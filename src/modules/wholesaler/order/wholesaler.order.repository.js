import pool from "../../../shared/db/postgres.js";

/**
 * Get all order requests broadcasted to this wholesaler
 */
export const findBroadcastedOrders = async (wholesalerId) => {
  const result = await pool.query(`
    SELECT 
      o.id as order_id,
      o.total_amount,
      o.shipping_address,
      o.created_at as order_date,
      ob.status as broadcast_status,
      u.username as retailer_name,
      (
        SELECT json_agg(json_build_object(
          'id', oi.id,
          'product_variant_id', oi.product_variant_id,
          'quantity', oi.quantity,
          'price', oi.price_at_time,
          'variant_name', pv.variant_name,
          'product_name', p.product_name,
          'current_stock', pv.stock,
          'is_managed', w.manages_inventory
        ))
        FROM order_items oi
        JOIN product_variants pv ON oi.product_variant_id = pv.id
        JOIN products p ON pv.product_id = p.id
        JOIN users w ON w.id = $1
        WHERE oi.order_id = o.id AND (oi.fulfilled_by_wholesaler_id IS NULL OR oi.fulfilled_by_wholesaler_id = $1)
      ) as items
    FROM order_broadcasts ob
    JOIN orders_v2 o ON ob.order_id = o.id
    JOIN users u ON o.retailer_id = u.id
    WHERE ob.wholesaler_id = $1 AND ob.status = 'pending'
    ORDER BY o.created_at DESC
  `, [wholesalerId]);
  
  return result.rows;
};

/**
 * Accept specific items from a broadcasted order
 * data: { orderId, itemIds: [id1, id2] }
 */
export const acceptOrderItems = async (wholesalerId, orderId, itemIds) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Get wholesaler preference
    const userResult = await client.query("SELECT manages_inventory FROM users WHERE id = $1", [wholesalerId]);
    const managesInventory = userResult.rows[0]?.manages_inventory;

    const acceptedItems = [];

    // 2. Process each item
    for (const itemId of itemIds) {
      // Update item to mark as fulfilled by this wholesaler
      const updateItemQuery = `
        UPDATE order_items 
        SET fulfilled_by_wholesaler_id = $1, status = 'accepted'
        WHERE id = $2 AND order_id = $3 AND fulfilled_by_wholesaler_id IS NULL
        RETURNING *
      `;
      const itemResult = await client.query(updateItemQuery, [wholesalerId, itemId, orderId]);
      
      if (itemResult.rows.length > 0) {
        const item = itemResult.rows[0];
        acceptedItems.push(item);

        // 3. Hybrid Inventory Logic: If managed, decrement stock
        if (managesInventory) {
          await client.query(
            "UPDATE product_variants SET stock = GREATEST(0, stock - $1) WHERE id = $2",
            [item.quantity, item.product_variant_id]
          );
        }
      }
    }

    // 4. Update broadcast status
    await client.query(
      "UPDATE order_broadcasts SET status = 'accepted', updated_at = CURRENT_TIMESTAMP WHERE order_id = $1 AND wholesaler_id = $2",
      [orderId, wholesalerId]
    );

    // 5. Check if all items in order are now accepted
    const checkOrderQuery = "SELECT COUNT(*) FROM order_items WHERE order_id = $1 AND fulfilled_by_wholesaler_id IS NULL";
    const checkResult = await client.query(checkOrderQuery, [orderId]);
    
    if (parseInt(checkResult.rows[0].count) === 0) {
      // Entire order is now spoken for
      await client.query("UPDATE orders_v2 SET status = 'accepted' WHERE id = $1", [orderId]);
    } else {
      // Partial acceptance
      await client.query("UPDATE orders_v2 SET status = 'partial' WHERE id = $1", [orderId]);
    }

    await client.query("COMMIT");
    return acceptedItems;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Legacy support / General list
 */
export const findOrdersByWholesalerId = async (wholesalerId) => {
  const result = await pool.query(`
    SELECT o.* 
    FROM orders_v2 o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE oi.fulfilled_by_wholesaler_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `, [wholesalerId]);
  return result.rows;
};
