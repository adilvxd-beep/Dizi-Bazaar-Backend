import pool from "../../../shared/db/postgres.js";

export const createWholesaler = async (data, user) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      businessName,
      businessCategoryId,
      ownerName,
      phoneNumber,
      alternatePhoneNumber,
      email,
      websiteUrl,
      businessAddress,
      billingAddress,
      gstNumber,
      panNumber,
      aadharNumber,
      msmeNumber,
      yearsInBusiness,
      numberOfEmployees,
      annualTurnover,
      tradeLicenseNumber
    } = data;

    const { id: userId, role } = user;

    // 1️⃣ Insert wholesaler (STEP 1)
    const { rows } = await client.query(
      `
      INSERT INTO wholesalers (
        business_name,
        business_category_id,
        owner_name,
        phone_number,
        alternate_phone_number,
        email,
        website_url,
        business_address,
        billing_address,
        gst_number,
        pan_number,
        aadhar_number,
        msme_number,
        years_in_business,
        number_of_employees,
        annual_turnover,
        trade_license_number,
        created_by_id,
        created_by_role
      )
      VALUES (
        $1,$2,$3,$4,$5,
        $6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,
        $16,$17,$18,$19
      )
      RETURNING id, status, created_at
      `,
      [
        businessName?.trim(),
        businessCategoryId,
        ownerName?.trim(),
        phoneNumber,
        alternatePhoneNumber,
        email?.toLowerCase(),
        websiteUrl,
        businessAddress,
        billingAddress,
        gstNumber,
        panNumber,
        aadharNumber,
        msmeNumber,
        yearsInBusiness,
        numberOfEmployees,
        annualTurnover,
        tradeLicenseNumber,
        userId,
        role
      ]
    );

    const wholesalerId = rows[0].id;

    // 2️⃣ Create empty document row (all statuses = pending)
    await client.query(
      `
      INSERT INTO wholesaler_documents (wholesaler_id)
      VALUES ($1)
      `,
      [wholesalerId]
    );

    await client.query("COMMIT");
    return rows[0];

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const updateWholesalerDocuments = async (
  wholesalerId,
  updates
) => {
  // ✅ Whitelist allowed columns
  const allowedFields = [
    "gst_certificate_url",
    "gst_certificate_status",
    "pan_card_url",
    "pan_card_status",
    "aadhar_card_url",
    "aadhar_card_status",
    "bank_statement_url",
    "bank_statement_status",
    "business_proof_url",
    "business_proof_status",
    "cancelled_cheque_url",
    "cancelled_cheque_status"
  ];

  const fields = [];
  const values = [];
  let index = 1;

  for (const key of Object.keys(updates)) {
    if (allowedFields.includes(key)) {
      fields.push(`${key} = $${index}`);
      values.push(updates[key]);
      index++;
    }
  }

  // ❌ No valid fields → block query
  if (!fields.length) {
    throw new Error("No valid document fields provided");
  }

  values.push(wholesalerId);

  const query = `
    UPDATE wholesaler_documents
    SET ${fields.join(", ")},
        updated_at = CURRENT_TIMESTAMP
    WHERE wholesaler_id = $${index}
    RETURNING *
  `;

  const { rows } = await pool.query(query, values);
  return rows[0];
};
