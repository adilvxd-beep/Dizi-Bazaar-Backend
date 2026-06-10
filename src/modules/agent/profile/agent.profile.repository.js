import pool from "../../../shared/db/postgres.js";

export const findAgentProfileById = async (id) => {
  const result = await pool.query(
    `SELECT id, username, email, phone, role, is_verified, created_at FROM users WHERE id = $1 AND role = 'agent'`,
    [id]
  );
  return result.rows[0];
};

export const updateAgentProfile = async (id, data) => {
  const { username, email, phone } = data;
  const result = await pool.query(
    `UPDATE users 
     SET username = COALESCE($1, username),
         email = COALESCE($2, email),
         phone = COALESCE($3, phone),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $4 AND role = 'agent'
     RETURNING id, username, email, phone, role, is_verified`,
    [username, email, phone, id]
  );
  return result.rows[0];
};
