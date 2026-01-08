import pool from "../../shared/db/postgres.js";

export const findAllAgents = async () => {
  const result = await pool.query("SELECT * FROM users WHERE role = $1", [
    "agent",
  ]);
  return result.rows;
};

export const updateAgent = async (id, username, email) => {
  const result = await pool.query(
    "UPDATE users SET username = $1, email = $2 WHERE id = $3 AND role = $4 RETURNING *",
    [username, email, id, "agent"]
  );
  return result.rows[0];
};
