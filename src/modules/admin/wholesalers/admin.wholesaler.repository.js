import pool from "../../../shared/db/postgres.js";

export const createWholesalerBasic = async (data, adminUser) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { user, wholesaler } = data;
    const { id: adminId, role: adminRole } = adminUser;

    //create user
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

    //create wholesaler
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

export const getWholesalerById = async (wholesalerId) => {
  const res = await pool.query(
    `
    SELECT *
    FROM wholesalers
    WHERE id = $1
    `,
    [wholesalerId]
  );

  if (res.rowCount === 0) {
    throw new Error("WHOLESALER_NOT_FOUND");
  }

  return res.rows[0];
};   


export const findAllWholesalers = async (query = {}) => {
  const {
    search,
    status,
    business_category_id,
    page = 1,
    limit = 10,
    sortBy = "created_at",
    order = "desc",
  } = query;

  const currentPage = Math.max(parseInt(page, 10), 1);
  const pageLimit = Math.max(parseInt(limit, 10), 1);
  const offset = (currentPage - 1) * pageLimit;

  const allowedSortBy = [
    "id",
    "business_name",
    "status",
    "created_at",
    "initial_credit_limit",
  ];

  const sortColumn = allowedSortBy.includes(sortBy)
    ? `w.${sortBy}`
    : "w.created_at";

  const sortOrder = order?.toLowerCase() === "asc" ? "ASC" : "DESC";

  const conditions = [];
  const values = [];

  /*  SEARCH (business name, owner, email, phone) */
  if (search) {
    values.push(`%${search}%`);
    conditions.push(
      `(w.business_name ILIKE $${values.length}
        OR w.owner_name ILIKE $${values.length}
        OR w.email ILIKE $${values.length}
        OR w.phone_number ILIKE $${values.length})`
    );
  }

  /*  FILTER STATUS */
  if (status) {
    values.push(status);
    conditions.push(`w.status = $${values.length}`);
  }

  /*  FILTER BUSINESS CATEGORY */
  if (business_category_id) {
    values.push(Number(business_category_id));
    conditions.push(`w.business_category_id = $${values.length}`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  /* ================= DATA QUERY ================= */
  const dataQuery = `
    SELECT
      w.id,
      w.business_name,
      w.owner_name,
      w.phone_number,
      w.email,
      w.status,
      w.initial_credit_limit,
      w.created_at,
      w.updated_at,

      u.id AS user_id,
      u.username,
      u.is_verified,

      bc.name AS business_category_name,

      d.gst_certificate_status,
      d.pan_card_status,
      d.aadhar_card_status,
      d.bank_statement_status,
      d.business_proof_status,
      d.cancelled_cheque_status

    FROM wholesalers w
    JOIN users u ON u.id = w.user_id
    LEFT JOIN business_categories bc ON bc.id = w.business_category_id
    LEFT JOIN wholesaler_documents d ON d.wholesaler_id = w.id

    ${whereClause}
    ORDER BY ${sortColumn} ${sortOrder}
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2};
  `;

  const dataValues = [...values, pageLimit, offset];
  const { rows } = await pool.query(dataQuery, dataValues);

  /* ================= COUNT QUERY ================= */
  const countQuery = `
    SELECT COUNT(*)::int AS count
    FROM wholesalers w
    JOIN users u ON u.id = w.user_id
    LEFT JOIN business_categories bc ON bc.id = w.business_category_id
    LEFT JOIN wholesaler_documents d ON d.wholesaler_id = w.id
    ${whereClause};
  `;

  const countResult = await pool.query(countQuery, values);
  const totalItems = countResult.rows[0].count;
  const totalPages = Math.ceil(totalItems / pageLimit);

  return {
    items: rows,
    totalItems,
    totalPages,
    currentPage,
  };
};


export const createWholesalerDocuments = async (
  wholesalerId,
  documents
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // get wholesaler user_id
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
    //create documents  
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

    //check if documents exist
    const docCheck = await client.query(
      `SELECT id FROM wholesaler_documents WHERE wholesaler_id = $1`,
      [wholesalerId]
    );

    if (docCheck.rowCount === 0) {
      throw new Error("DOCUMENTS_NOT_FOUND");
    }

    //build dynamic query
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

    //update wholesaler
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

    // update user verification status
    await client.query(
      `
      UPDATE users
      SET is_verified = $1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      `,
      [newStatus === "verified", user_id]
    );

    //ensure documents record exists
    await client.query(
      `
      INSERT INTO wholesaler_documents (wholesaler_id, user_id)
      VALUES ($1, $2)
      ON CONFLICT (wholesaler_id) DO NOTHING
      `,
      [wholesalerId, user_id]
    );

    //sync all document statuses to wholesaler status
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

export const deleteWholesalerById = async (wholesalerId) => {

  try {
    const res = await pool.query(
      `
      DELETE FROM wholesalers
      WHERE id = $1
      RETURNING id
      `,
      [wholesalerId]
    );

    if (res.rowCount === 0) {
      throw new Error("WHOLESALER_NOT_FOUND");
    }

    return {
      wholesalerId,
      deleted: true
    };      
  } catch (error) {
    throw error;

  }
}

export const editWholesalerBasicAndDocuments = async (
  wholesalerId,
  data,
  adminUser
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { user, wholesaler, documents } = data;
    const { id: adminId, role: adminRole } = adminUser;

   //get wholesaler user_id
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

    //update users
    if (user) {
      await client.query(
        `
        UPDATE users
        SET
          username = COALESCE($1, username),
          email = COALESCE($2, email),
          phone = COALESCE($3, phone)
        WHERE id = $4
        `,
        [
          user.username,
          user.email?.toLowerCase(),
          user.phone,
          userId
        ]
      );
    }

   //update wholesalers (same fields as create)
    if (wholesaler) {
      await client.query(
  `
  UPDATE wholesalers
  SET
    business_name = COALESCE($1, business_name),
    business_category_id = COALESCE($2, business_category_id),
    owner_name = COALESCE($3, owner_name),
    phone_number = COALESCE($4, phone_number),
    email = COALESCE($5, email),
    alternate_phone_number = COALESCE($6, alternate_phone_number),
    website_url = COALESCE($7, website_url),
    business_address = COALESCE($8, business_address),
    billing_address = COALESCE($9, billing_address),
    gst_number = COALESCE($10, gst_number),
    pan_number = COALESCE($11, pan_number),
    aadhar_number = COALESCE($12, aadhar_number),
    msme_number = COALESCE($13, msme_number),
    years_in_business = COALESCE($14, years_in_business),
    number_of_employees = COALESCE($15, number_of_employees),
    annual_turnover = COALESCE($16, annual_turnover),
    trade_license_number = COALESCE($17, trade_license_number)
  WHERE id = $18
  `,
  [
    wholesaler.businessName,
    wholesaler.businessCategoryId,
    wholesaler.ownerName,
    user?.phone,
    user?.email,
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
    wholesalerId
  ]
);

    }

    //update documents (same fields as create)
    if (documents) {
      await client.query(
        `
        UPDATE wholesaler_documents
        SET
          gst_certificate_url = COALESCE($1, gst_certificate_url),
          pan_card_url = COALESCE($2, pan_card_url),
          aadhar_card_url = COALESCE($3, aadhar_card_url),
          bank_statement_url = COALESCE($4, bank_statement_url),
          business_proof_url = COALESCE($5, business_proof_url),
          cancelled_cheque_url = COALESCE($6, cancelled_cheque_url)
        WHERE wholesaler_id = $7
        `,
        [
          documents.gstCertificateUrl,
          documents.panCardUrl,
          documents.aadharCardUrl,
          documents.bankStatementUrl,
          documents.businessProofUrl,
          documents.cancelledChequeUrl,
          wholesalerId
        ]
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

export const createWholesalerBankDetails = async (
  userId,
  bankDetails
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    if (bankDetails.accountType) {
      // When API sends account type
      await client.query(
        `
        INSERT INTO user_bank_details (
          user_id,
          bank_name,
          account_holder_name,
          account_number,
          ifsc_code,
          upi_id,
          account_type
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        `,
        [
          userId,
          bankDetails.bankName,
          bankDetails.accountHolderName,
          bankDetails.accountNumber,
          bankDetails.ifscCode,
          bankDetails.upiId,
          bankDetails.accountType
        ]
      );
    } else {
      // When API does NOT send account type → DB default works
      await client.query(
        `
        INSERT INTO user_bank_details (
          user_id,
          bank_name,
          account_holder_name,
          account_number,
          ifsc_code,
          upi_id
        )
        VALUES ($1,$2,$3,$4,$5,$6)
        `,
        [
          userId,
          bankDetails.bankName,
          bankDetails.accountHolderName,
          bankDetails.accountNumber,
          bankDetails.ifscCode,
          bankDetails.upiId
        ]
      );
    }

    await client.query("COMMIT");

    return {
      userId,
      bankDetailsCreated: true,
    };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const getAllUsersBankDetails = async () => {
  const { rows } = await pool.query(
    `
    SELECT
      u.id AS user_id,
      u.username,
      u.email,
      u.phone,

      b.id AS bank_detail_id,
      b.bank_name,
      b.account_holder_name,
      b.account_number,
      b.ifsc_code,
      b.upi_id,
      b.account_type,
      b.created_at,
      b.updated_at

    FROM user_bank_details b
    JOIN users u ON u.id = b.user_id
    ORDER BY b.created_at DESC;
    `
  );

  return rows; // returns full list
};

export const deleteWholesalerBankDetailsByUserId = async (userId) => {
  const { rowCount } = await pool.query(
    `
    DELETE FROM user_bank_details
    WHERE user_id = $1
    `,
    [userId]
  );

  if (rowCount === 0) {
    throw new Error("BANK_DETAILS_NOT_FOUND");
  }

  return {
    userId,
    bankDetailsDeleted: true,
  };
};


