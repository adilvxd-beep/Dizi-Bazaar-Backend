import pool from "../../../shared/db/postgres.js";

export const findOrdersByUserId = async (userId) => {
  const result = await pool.query(`
    SELECT o.*, 
      (SELECT json_agg(row_to_json(oi.*)) FROM order_items oi WHERE oi.order_id = o.id) as items
    FROM orders_v2 o 
    WHERE o.retailer_id = $1
    ORDER BY o.created_at DESC
  `, [userId]);
  return result.rows;
};

export const createOrderForUser = async (orderData, userId) => {
  const { totalAmount, shippingAddress, items } = orderData;
  const client = await pool.connect();
  
  try {
    await client.query("BEGIN");
    
    // 1. Create the order
    const orderResult = await client.query(
      "INSERT INTO orders_v2 (retailer_id, total_amount, shipping_address, status) VALUES ($1, $2, $3, 'broadcasted') RETURNING *",
      [userId, totalAmount || 0, shippingAddress || '']
    );
    const order = orderResult.rows[0];
    
    // 2. Insert items
    if (items && items.length > 0) {
      for (const item of items) {
        await client.query(
          "INSERT INTO order_items (order_id, product_variant_id, quantity, price_at_time) VALUES ($1, $2, $3, $4)",
          [order.id, item.variantId, item.quantity, item.price]
        );
      }
    }
    
    // 3. Broadcast to Active Wholesalers within their Shift
    // If a wholesaler has no shift, they get it. If they have a shift, we check if current time is within it.
    const broadcastQuery = `
      INSERT INTO order_broadcasts (order_id, wholesaler_id, status)
      SELECT $1, u.id, 'pending'
      FROM users u
      LEFT JOIN shift_timings st ON u.shift_id = st.id
      WHERE u.role = 'wholesaler' 
      AND (
        st.id IS NULL OR 
        (CURRENT_TIME BETWEEN st.start_time AND st.end_time) OR
        (st.start_time > st.end_time AND (CURRENT_TIME >= st.start_time OR CURRENT_TIME <= st.end_time))
      )
      ON CONFLICT (order_id, wholesaler_id) DO NOTHING
    `;
    await client.query(broadcastQuery, [order.id]);
    
    await client.query("COMMIT");
    return order;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
