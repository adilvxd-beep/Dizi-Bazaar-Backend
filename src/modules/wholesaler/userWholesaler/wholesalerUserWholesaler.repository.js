import pool from "../../../shared/db/postgres.js";

//create wholesaler
export const createWholesaler = async (data, user) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      businessName,
      ownerName,
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

/* =========================
   FETCH USER DATA (SOURCE OF TRUTH)
========================= */
const userRes = await client.query(
  `
  SELECT phone, business_category_id
  FROM users
  WHERE id = $1
  `,
  [userId]
);

if (userRes.rowCount === 0) {
  throw new Error("USER_NOT_FOUND");
}

const { phone, business_category_id } = userRes.rows[0];


    /* =========================
       PREVENT DUPLICATE WHOLESALER
    ========================= */
    const existing = await client.query(
      `SELECT id FROM wholesalers WHERE user_id = $1`,
      [userId]
    );

    if (existing.rowCount > 0) {
      throw new Error("WHOLESALER_ALREADY_EXISTS");
    }

    /* =========================
       CREATE WHOLESALER
    ========================= */
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
        status,
        created_by_id,
        created_by_role,
        user_id
      )
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15,
        $16, $17, 'pending', $18, $19, $20
      )
      RETURNING id, status, created_at
      `,
      [
        businessName,
        business_category_id,   // from users table
        ownerName,
        phone,                  // from users table
        alternatePhoneNumber,
        email,
        websiteUrl || null,
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
        userId,                 // created_by_id
        role,                   // created_by_role
        userId                  // user_id
      ]
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

export const createWholesalerDocuments = async (data, user) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      gstCertificateUrl,
      panCardUrl,
      aadharCardUrl,
      bankStatementUrl,
      businessProofUrl,
      cancelledChequeUrl
    } = data;

    const { id: userId } = user;

    /* =========================
       FETCH WHOLESALER ID FROM USER
    ========================= */
    const wholesalerRes = await client.query(
      `
      SELECT id
      FROM wholesalers
      WHERE user_id = $1
      `,
      [userId]
    );

    if (wholesalerRes.rowCount === 0) {
      throw new Error("WHOLESALER_NOT_FOUND");
    }

    const wholesalerId = wholesalerRes.rows[0].id;

    /* =========================
       PREVENT DUPLICATE DOCUMENTS
    ========================= */
    const existing = await client.query(
      `
      SELECT id
      FROM wholesaler_documents
      WHERE wholesaler_id = $1
      `,
      [wholesalerId]
    );

    if (existing.rowCount > 0) {
      throw new Error("DOCUMENTS_ALREADY_SUBMITTED");
    }

    /* =========================
       INSERT DOCUMENTS
    ========================= */
    const { rows } = await client.query(
      `
      INSERT INTO wholesaler_documents (
        wholesaler_id,
        gst_certificate_url,
        pan_card_url,
        aadhar_card_url,
        bank_statement_url,
        business_proof_url,
        cancelled_cheque_url,
        user_id
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      )
      RETURNING id, created_at
      `,
      [
        wholesalerId,
        gstCertificateUrl,
        panCardUrl,
        aadharCardUrl,
        bankStatementUrl,
        businessProofUrl,
        cancelledChequeUrl,
        userId
      ]
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



