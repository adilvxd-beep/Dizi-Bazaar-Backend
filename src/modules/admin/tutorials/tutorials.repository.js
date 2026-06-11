import pool from "../../../shared/db/postgres.js";

export const findAllTutorials = async () => {
  const result = await pool.query("SELECT * FROM tutorials ORDER BY created_at DESC");
  return result.rows;
};

export const findTutorialsByRole = async (role) => {
  const result = await pool.query(
    "SELECT * FROM tutorials WHERE role = $1 AND status = 'active' ORDER BY created_at DESC",
    [role]
  );
  return result.rows;
};

export const createTutorial = async (data) => {
  const { title, description, video_url, role } = data;
  const result = await pool.query(
    "INSERT INTO tutorials (title, description, video_url, role) VALUES ($1, $2, $3, $4) RETURNING *",
    [title, description, video_url, role]
  );
  return result.rows[0];
};

export const updateTutorial = async (id, data) => {
  const { title, description, video_url, role, status } = data;
  const result = await pool.query(
    "UPDATE tutorials SET title = $1, description = $2, video_url = $3, role = $4, status = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *",
    [title, description, video_url, role, status, id]
  );
  return result.rows[0];
};

export const deleteTutorial = async (id) => {
  await pool.query("DELETE FROM tutorials WHERE id = $1", [id]);
};
