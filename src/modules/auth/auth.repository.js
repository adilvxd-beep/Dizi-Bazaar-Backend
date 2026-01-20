import pool from "../../shared/db/postgres.js";

export const createUser = async (userData) => {
  const { username, phone, role } = userData;
  const result = await pool.query(
    "INSERT INTO users (username, phone, role) VALUES ($1, $2, $3) RETURNING id, username, phone, role",
    [username, phone, role]
  );
  return result.rows[0];
};
export const findUserByPhone = async (phone) => {
  const result = await pool.query("SELECT * FROM users WHERE phone = $1", [
    phone,
  ]);
  return result.rows[0];
};

export const signupWholesalerLite = async ({
  username,
  phone,
  businessCategoryId,
  role
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* =========================
       BASIC SAFETY CHECKS
    ========================= */
    if (!username || !phone || !businessCategoryId || !role) {
      throw new Error("MISSING_REQUIRED_FIELDS");
    }

    if (role !== "wholesaler") {
      throw new Error("INVALID_ROLE");
    }

    /* =========================
       CHECK IF USER EXISTS (PHONE / USERNAME)
    ========================= */
    const existingUser = await client.query(
      `
      SELECT id
      FROM users
      WHERE phone = $1 OR username = $2
      `,
      [phone, username]
    );

    if (existingUser.rowCount > 0) {
      throw new Error("USER_ALREADY_EXISTS");
    }

    /* =========================
       CREATE USER
    ========================= */
    const userRes = await client.query(
      `
      INSERT INTO users (username, phone, role)
      VALUES ($1, $2, $3)
      RETURNING id, username, phone, role
      `,
      [username, phone, role]
    );

    const userId = userRes.rows[0].id;

    /* =========================
       CREATE WHOLESALER (MINIMAL)
    ========================= */
    const wholesalerRes = await client.query(
      `
      INSERT INTO wholesalers (
        user_id,
        phone_number,
        business_category_id,
        status
      )
      VALUES ($1, $2, $3, 'pending')
      RETURNING id, status
      `,
      [
        userId,
        phone,
        businessCategoryId
      ]
    );

    await client.query("COMMIT");

    return {
      userId,
      username: userRes.rows[0].username,
      wholesalerId: wholesalerRes.rows[0].id,
      status: wholesalerRes.rows[0].status
    };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};