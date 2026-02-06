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
      yearsInBusiness,
      numberOfEmployees,
      annualTurnover
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
       CREATE WHOLESALER (NO DOCUMENTS)
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
        years_in_business,
        number_of_employees,
        annual_turnover,
        gst_number,
        pan_number,
        aadhar_number,
        msme_number,
        trade_license_number,
        status,
        created_by_id,
        created_by_role,
        user_id
      )
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12,
        NULL, NULL, NULL, NULL, NULL,
        'profile_pending', $13, $14, $15
      )
      RETURNING id, status, created_at
      `,
      [
        businessName,
        business_category_id,
        ownerName,
        phone,
        alternatePhoneNumber,
        email,
        websiteUrl || null,
        businessAddress,
        billingAddress,
        yearsInBusiness,
        numberOfEmployees,
        annualTurnover,
        userId,
        role,
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


//create wholesaler documents
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
      cancelledChequeUrl,
      gstNumber,
      panNumber,
      aadharNumber
    } = data;

    const { id: userId } = user;

    /* =========================
       FETCH WHOLESALER ID FROM USER
    ========================= */
    const wholesalerRes = await client.query(
      `SELECT id FROM wholesalers WHERE user_id = $1`,
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
      `SELECT id FROM wholesaler_documents WHERE wholesaler_id = $1`,
      [wholesalerId]
    );

    if (existing.rowCount > 0) {
      throw new Error("DOCUMENTS_ALREADY_SUBMITTED");
    }

    /* =========================
       INSERT DOCUMENTS + NUMBERS
    ========================= */
    const { rows } = await client.query(
      `
      INSERT INTO wholesaler_documents (
        wholesaler_id,
        gst_certificate_url,
        gst_number,
        pan_card_url,
        pan_number,
        aadhar_card_url,
        aadhar_number,
        bank_statement_url,
        business_proof_url,
        cancelled_cheque_url,
        user_id
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
      )
      RETURNING id, created_at
      `,
      [
        wholesalerId,
        gstCertificateUrl,
        gstNumber,
        panCardUrl,
        panNumber,
        aadharCardUrl,
        aadharNumber,
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

//update wholesaler and documents
export const updateWholesalerAndDocuments = async (data, user) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { id: userId } = user;

    /* =========================
       GET WHOLESALER (TOKEN BASED)
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
       UPDATE WHOLESALER DETAILS
    ========================= */
    const wholesalerFields = [];
    const wholesalerValues = [];
    let idx = 1;

    const mapWholesaler = {
      businessName: "business_name",
      ownerName: "owner_name",
      alternatePhoneNumber: "alternate_phone_number",
      email: "email",
      websiteUrl: "website_url",
      businessAddress: "business_address",
      billingAddress: "billing_address",
      gstNumber: "gst_number",
      panNumber: "pan_number",
      aadharNumber: "aadhar_number",
      msmeNumber: "msme_number",
      yearsInBusiness: "years_in_business",
      numberOfEmployees: "number_of_employees",
      annualTurnover: "annual_turnover",
      tradeLicenseNumber: "trade_license_number"
    };

    for (const key in mapWholesaler) {
      if (data[key] !== undefined) {
        wholesalerFields.push(
          `${mapWholesaler[key]} = $${idx++}`
        );
        wholesalerValues.push(data[key]);
      }
    }

    if (wholesalerFields.length > 0) {
      await client.query(
        `
        UPDATE wholesalers
        SET ${wholesalerFields.join(", ")},
            updated_at = NOW()
        WHERE id = $${idx}
        `,
        [...wholesalerValues, wholesalerId]
      );
    }

    /* =========================
       UPDATE DOCUMENTS (IF ANY)
    ========================= */
    const docFields = [];
    const docValues = [];
    let dIdx = 1;

    const mapDocs = {
      gstCertificateUrl: "gst_certificate_url",
      panCardUrl: "pan_card_url",
      aadharCardUrl: "aadhar_card_url",
      bankStatementUrl: "bank_statement_url",
      businessProofUrl: "business_proof_url",
      cancelledChequeUrl: "cancelled_cheque_url"
    };

    for (const key in mapDocs) {
      if (data[key] !== undefined) {
        docFields.push(
          `${mapDocs[key]} = $${dIdx++},
           ${mapDocs[key].replace("_url", "_status")} = 'pending'`
        );
        docValues.push(data[key]);
      }
    }

    if (docFields.length > 0) {
      await client.query(
        `
        UPDATE wholesaler_documents
        SET ${docFields.join(", ")},
            updated_at = NOW()
        WHERE wholesaler_id = $${dIdx}
        `,
        [...docValues, wholesalerId]
      );
    }

    await client.query("COMMIT");

    return {
      wholesalerId,
      updated: true
    };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};



