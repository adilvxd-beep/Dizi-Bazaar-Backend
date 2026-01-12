import pool from "../../../shared/db/postgres.js";
import { hashPassword } from "../../../shared/utils/bcryptHash.js";

export const findAllUsers = async () => {
  const result = await pool.query(
    "SELECT id, username, email, role FROM users"
  );
  return result.rows;
};

export const createUser = async (userData) => {
  const { username, email, password, role } = userData;
  const hashedPassword = await hashPassword(password);
  const result = await pool.query(
    "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role",
    [username, email, hashedPassword, role]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};
