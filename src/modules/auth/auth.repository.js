import pool from "../../shared/db/postgres.js";

/* =========================
   CREATE USER (SIMPLE)
========================= */
export const createUser = async (userData) => {
  const { username, phone, role } = userData;

  const result = await pool.query(
    `
    INSERT INTO users (username, phone, role)
    VALUES ($1, $2, $3)
    RETURNING id, username, phone, role
    `,
    [username, phone, role],
  );

  return result.rows[0];
};

/* =========================
   FIND USER BY PHONE
========================= */
export const findUserByPhone = async (phone) => {
  const result = await pool.query(`SELECT * FROM users WHERE phone = $1`, [
    phone,
  ]);

  return result.rows[0];
};

/* =========================
   USER SIGNUP REPO
========================= */
export const userSignupRepo = async ({
  username,
  phone,
  businessCategoryId,
  role,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* =========================
       BASIC VALIDATION
    ========================= */
    if (!username || !phone || !businessCategoryId || !role) {
      throw new Error("Required fields are missing");
    }

    /* =========================
       CHECK IF USER EXISTS
    ========================= */
    const existingUser = await client.query(
      `SELECT id FROM users WHERE phone = $1`,
      [phone],
    );

    if (existingUser.rowCount > 0) {
      throw new Error("User already exists with this phone number");
    }

    /* =========================
       CREATE USER
    ========================= */
    const result = await client.query(
      `
      INSERT INTO users (
        username,
        phone,
        role,
        business_category_id
      )
      VALUES ($1, $2, $3, $4)
      RETURNING 
        id,
        username,
        phone,
        role,
        business_category_id,
        is_verified
      `,
      [username.trim(), phone, role.trim().toLowerCase(), businessCategoryId],
    );

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
