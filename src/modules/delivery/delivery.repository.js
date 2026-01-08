import pool from "../../shared/db/postgres.js";

export const findAllDeliveries = async () => {
  const result = await pool.query("SELECT * FROM deliveries");
  return result.rows;
};

export const updateDeliveryStatus = async (id, status) => {
  const result = await pool.query(
    "UPDATE deliveries SET status = $1 WHERE id = $2 RETURNING *",
    [status, id]
  );
  return result.rows[0];
};
