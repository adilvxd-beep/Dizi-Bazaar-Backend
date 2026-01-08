import pool from "../../../shared/db/postgres.js";

export const findOrdersByUserId = async (userId) => {
  const result = await pool.query("SELECT * FROM orders WHERE user_id = $1", [
    userId,
  ]);
  return result.rows;
};

export const createOrderForUser = async (orderData, userId) => {
  const { productId, quantity } = orderData;
  const result = await pool.query(
    "INSERT INTO orders (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
    [userId, productId, quantity]
  );
  return result.rows[0];
};
