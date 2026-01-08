import pool from "../../../shared/db/postgres.js";

export const findAllOrders = async () => {
  const result = await pool.query("SELECT * FROM orders");
  return result.rows;
};

export const createOrder = async (orderData) => {
  const { userId, productId, quantity } = orderData;
  const result = await pool.query(
    "INSERT INTO orders (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
    [userId, productId, quantity]
  );
  return result.rows[0];
};
