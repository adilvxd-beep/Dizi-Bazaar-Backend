import pool from "../../../shared/db/postgres.js";
import bcrypt from "bcrypt";

export const findAllUsers = async () => {
  const result = await pool.query(
    "SELECT id, username, email, role FROM users"
  );
  return result.rows;
};

export const createUser = async (userData) => {
  const { username, email, password, role } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role",
    [username, email, hashedPassword, role]
  );
  return result.rows[0];
};
