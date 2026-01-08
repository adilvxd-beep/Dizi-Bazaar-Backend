import pool from "../../../shared/db/postgres.js";

export const findInventoryByUserId = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM inventory WHERE user_id = $1",
    [userId]
  );
  return result.rows;
};

export const updateInventoryItem = async (id, quantity, userId) => {
  const result = await pool.query(
    "UPDATE inventory SET quantity = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
    [quantity, id, userId]
  );
  return result.rows[0];
};
