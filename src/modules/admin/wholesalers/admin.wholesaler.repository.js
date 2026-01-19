import pool from "../../../shared/db/postgres.js";

export const createWholesalerBasic = async (data, adminUser) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { user, wholesaler } = data;
    const { id: adminId, role: adminRole } = adminUser;

    /* =========================
       CREATE USER
    ========================= */
    const userRes = await client.query(
      `
      INSERT INTO users (username, email, phone, role)
      VALUES ($1, $2, $3, 'wholesaler')
      RETURNING id
      `,
      [
        user.username,
        user.email.toLowerCase(),
        user.phone
      ]
    );

    const userId = userRes.rows[0].id;

    /* =========================
       CREATE WHOLESALER
    ========================= */
    const wholesalerRes = await client.query(
      `
      INSERT INTO wholesalers (
        user_id,
        business_name,
        business_category_id,
        owner_name,
        phone_number,
        email,
        alternate_phone_number,
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
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,
        $19,$20
      )
      RETURNING id, status
      `,
      [
        userId,
        wholesaler.businessName,
        wholesaler.businessCategoryId,
        wholesaler.ownerName,
        user.phone,
        user.email,
        wholesaler.alternatePhoneNumber,
        wholesaler.websiteUrl,
        wholesaler.businessAddress,
        wholesaler.billingAddress,
        wholesaler.gstNumber,
        wholesaler.panNumber,
        wholesaler.aadharNumber,
        wholesaler.msmeNumber,
        wholesaler.yearsInBusiness,
        wholesaler.numberOfEmployees,
        wholesaler.annualTurnover,
        wholesaler.tradeLicenseNumber,
        adminId,
        adminRole
      ]
    );

    await client.query("COMMIT");

    return {
      userId,
      wholesalerId: wholesalerRes.rows[0].id,
      status: wholesalerRes.rows[0].status // pending
    };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const createWholesalerDocuments = async (
  wholesalerId,
  documents
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* =========================
       GET USER ID FROM WHOLESALER
    ========================= */
    const res = await client.query(
      `
      SELECT user_id
      FROM wholesalers
      WHERE id = $1
      `,
      [wholesalerId]
    );

    if (res.rowCount === 0) {
      throw new Error("WHOLESALER_NOT_FOUND");
    }

    const userId = res.rows[0].user_id;

    /* =========================
       CREATE DOCUMENTS
       status defaults to pending
    ========================= */
    await client.query(
      `
      INSERT INTO wholesaler_documents (
        wholesaler_id,
        user_id,
        gst_certificate_url,
        pan_card_url,
        aadhar_card_url,
        bank_statement_url,
        business_proof_url,
        cancelled_cheque_url
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      `,
      [
        wholesalerId,
        userId,
        documents.gstCertificateUrl,
        documents.panCardUrl,
        documents.aadharCardUrl,
        documents.bankStatementUrl,
        documents.businessProofUrl,
        documents.cancelledChequeUrl
      ]
    );

    await client.query("COMMIT");

    return {
      wholesalerId,
      documentsCreated: true
    };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const updateWholesalerStatus = async (wholesalerId, status) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const wholesalerRes = await client.query(

      `UPDATE wholesalers SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id, user_id, status`,
      [status, wholesalerId]
    );

    if (wholesalerRes.rowCount === 0) {
      throw new Error("Wholesaler not found");
    }

    const { user_id, status: newStatus} = wholesalerRes.rows[0];

    const isVerified = newStatus === "verified";

    await client.query (

      `UPDATE users SET is_verified = $1, updated_at = NOW() WHERE id = $2`,
      [isVerified, user_id]
    );

    await client.query("COMMIT");

    return {
      wholesalerId,
      status: newStatus,
      userVerified: isVerified
    };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error
  }
};

export const updateWholesalerDocumentStatus = async (
  wholesalerId,
  updates
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* =========================
       CHECK DOCUMENT RECORD EXISTS
    ========================= */
    const docCheck = await client.query(
      `SELECT id FROM wholesaler_documents WHERE wholesaler_id = $1`,
      [wholesalerId]
    );

    if (docCheck.rowCount === 0) {
      throw new Error("DOCUMENTS_NOT_FOUND");
    }

    /* =========================
       BUILD DYNAMIC UPDATE QUERY
    ========================= */
    const fields = [];
    const values = [];
    let index = 1;

    for (const key in updates) {
      fields.push(`${key} = $${index}`);
      values.push(updates[key]);
      index++;
    }

    values.push(wholesalerId);

    await client.query(
      `
      UPDATE wholesaler_documents
      SET ${fields.join(", ")},
          updated_at = NOW()
      WHERE wholesaler_id = $${index}
      `,
      values
    );

    await client.query("COMMIT");

    return {
      wholesalerId,
      updatedFields: Object.keys(updates)
    };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};


export const updateWholesalerAndDocuments = async (
  wholesalerId,
  updateData,
  adminUser
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* =========================
        UPDATE WHOLESALER
    ========================= */
    const fields = [];
    const values = [];
    let idx = 1;

    if (updateData.status) {
      fields.push(`status = $${idx++}`);
      values.push(updateData.status);
    }

    if (updateData.initialCreditLimit !== undefined) {
      fields.push(`initial_credit_limit = $${idx++}`);
      values.push(updateData.initialCreditLimit);
    }

    if (updateData.adminNote) {
      fields.push(`admin_note = $${idx++}`);
      values.push(updateData.adminNote);
    }

    fields.push(`verified_by_id = $${idx++}`);
    values.push(adminUser.id);

    fields.push(`verified_by_role = $${idx++}`);
    values.push(adminUser.role);

    fields.push(`updated_at = CURRENT_TIMESTAMP`);

    values.push(wholesalerId);

    const wholesalerRes = await client.query(
      `
      UPDATE wholesalers
      SET ${fields.join(", ")}
      WHERE id = $${idx}
      RETURNING id, status, user_id
      `,
      values
    );

    if (wholesalerRes.rowCount === 0) {
      throw new Error("WHOLESALER_NOT_FOUND");
    }

    const { status: newStatus, user_id } = wholesalerRes.rows[0];

    /* =========================
       SYNC USER (ENUM DRIVEN)
    ========================= */
    await client.query(
      `
      UPDATE users
      SET is_verified = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      `,
      [newStatus === "verified", user_id]
    );

    /* =================================================
       🔑 ENSURE DOCUMENT ROW EXISTS (CRITICAL FIX)
    ================================================= */
    await client.query(
      `
      INSERT INTO wholesaler_documents (wholesaler_id, user_id)
      VALUES ($1, $2)
      ON CONFLICT (wholesaler_id) DO NOTHING
      `,
      [wholesalerId, user_id]
    );

    /* =========================
       SYNC DOCUMENT STATUSES
       (ENUM → NO HARDCODING)
    ========================= */
await client.query(
  `
  UPDATE wholesaler_documents
  SET
    gst_certificate_status = $1::wholesaler_status,
    pan_card_status = $1::wholesaler_status,
    aadhar_card_status = $1::wholesaler_status,
    bank_statement_status = $1::wholesaler_status,
    business_proof_status = $1::wholesaler_status,
    cancelled_cheque_status = $1::wholesaler_status,
    updated_at = CURRENT_TIMESTAMP
  WHERE wholesaler_id = $2
  `,
  [newStatus, wholesalerId]
);

    await client.query("COMMIT");

    return {
      wholesalerId,
      status: newStatus,
      userVerified: newStatus === "verified",
      documentsStatus: newStatus
    };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
