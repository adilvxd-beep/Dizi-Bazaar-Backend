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
