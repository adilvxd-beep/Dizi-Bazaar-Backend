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

export const userSignupRepo = async ({
  username,
  phone,
  businessCategoryId,
  role
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* =========================
       BASIC VALIDATION
    ========================= */
    if (!username || !phone || !businessCategoryId || !role) {
      return {
        success: false,
        message: "Required fields are missing"
      };
    }

    /* =========================
       CHECK IF USER EXISTS (PHONE)
    ========================= */
    const existingUser = await client.query(
      `
      SELECT id
      FROM users
      WHERE phone = $1
      `,
      [phone]
    );

    if (existingUser.rowCount > 0) {
      return {
        success: false,
        message: "User already exists with this phone number"
      };
    }

    /* =========================
       CREATE USER
    ========================= */
    const userRes = await client.query(
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
      [
        username.trim(),
        phone,
        role.trim().toLowerCase(),
        businessCategoryId
      ]
    );

    await client.query("COMMIT");

    return {
      success: true,
      message: "User registered successfully",
      user: userRes.rows[0]
    };

  } catch (error) {
    await client.query("ROLLBACK");

    return {
      success: false,
      message: "Failed to register user",
      error: error.message
    };
  } finally {
    client.release();
  }
};
