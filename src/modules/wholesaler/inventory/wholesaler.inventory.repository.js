import pool from "../../../shared/db/postgres.js";

export const findStockByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT 
      vs.id,
      vs.variant_id,
      vs.user_id,
      vs.stock_quantity,
      vs.reserved_quantity,
      vs.stock_quantity - vs.reserved_quantity as available_quantity,
      vs.created_at,
      vs.updated_at,
      pv.variant_name,
      pv.sku,
      pv.attribute_name_1,
      pv.attribute_value_1,
      pv.attribute_name_2,
      pv.attribute_value_2,
      pv.attribute_name_3,
      pv.attribute_value_3,
      p.id as product_id,
      p.product_name,
      p.main_image,
      vp.id as pricing_id,
      vp.cost_price,
      vp.selling_price,
      vp.mrp,
      vp.tax_percentage,
      vp.state,
      vp.city
    FROM variant_stock vs
    JOIN product_variants pv ON vs.variant_id = pv.id
    JOIN products p ON pv.product_id = p.id
    LEFT JOIN variant_pricing vp ON vp.variant_id = vs.variant_id AND vp.user_id = vs.user_id
    WHERE vs.user_id = $1
    ORDER BY p.product_name, pv.variant_name`,
    [userId],
  );
  return result.rows;
};

export const findStockByVariantAndUser = async (variantId, userId) => {
  const result = await pool.query(
    `SELECT 
      vs.*,
      vs.stock_quantity - vs.reserved_quantity as available_quantity,
      pv.variant_name,
      pv.sku,
      p.product_name,
      vp.id as pricing_id,
      vp.cost_price,
      vp.selling_price,
      vp.mrp,
      vp.tax_percentage,
      vp.state,
      vp.city
    FROM variant_stock vs
    JOIN product_variants pv ON vs.variant_id = pv.id
    JOIN products p ON pv.product_id = p.id
    LEFT JOIN variant_pricing vp ON vp.variant_id = vs.variant_id AND vp.user_id = vs.user_id
    WHERE vs.variant_id = $1 AND vs.user_id = $2`,
    [variantId, userId],
  );
  return result.rows[0] || null;
};

export const upsertStockWithPricing = async (data) => {
  const {
    variantId,
    userId,
    stockQuantity,
    reservedQuantity = 0,
    costPrice,
    sellingPrice,
    mrp,
    taxPercentage = 0,
    state,
    city,
  } = data;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Upsert stock
    const stockResult = await client.query(
      `INSERT INTO variant_stock (variant_id, user_id, stock_quantity, reserved_quantity)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (variant_id, user_id) 
      DO UPDATE SET 
        stock_quantity = $3,
        reserved_quantity = $4,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *`,
      [variantId, userId, stockQuantity, reservedQuantity],
    );

    // Upsert pricing
    const pricingResult = await client.query(
      `INSERT INTO variant_pricing 
        (variant_id, user_id, cost_price, selling_price, mrp, tax_percentage, state, city)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (variant_id, user_id) 
      DO UPDATE SET 
        cost_price = $3,
        selling_price = $4,
        mrp = $5,
        tax_percentage = $6,
        state = $7,
        city = $8,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *`,
      [
        variantId,
        userId,
        costPrice,
        sellingPrice,
        mrp,
        taxPercentage,
        state,
        city,
      ],
    );

    await client.query("COMMIT");

    return {
      stock: stockResult.rows[0],
      pricing: pricingResult.rows[0],
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const updateStockQuantity = async (variantId, userId, stockQuantity) => {
  const result = await pool.query(
    `UPDATE variant_stock 
    SET stock_quantity = $3, updated_at = CURRENT_TIMESTAMP
    WHERE variant_id = $1 AND user_id = $2 
    RETURNING *`,
    [variantId, userId, stockQuantity],
  );
  return result.rows[0] || null;
};

export const updatePricing = async (data) => {
  const {
    variantId,
    userId,
    costPrice,
    sellingPrice,
    mrp,
    taxPercentage,
    state,
    city,
  } = data;

  const result = await pool.query(
    `UPDATE variant_pricing 
    SET 
      cost_price = $3,
      selling_price = $4,
      mrp = COALESCE($5, mrp),
      tax_percentage = COALESCE($6, tax_percentage),
      state = COALESCE($7, state),
      city = COALESCE($8, city),
      updated_at = CURRENT_TIMESTAMP
    WHERE variant_id = $1 AND user_id = $2 
    RETURNING *`,
    [
      variantId,
      userId,
      costPrice,
      sellingPrice,
      mrp,
      taxPercentage,
      state,
      city,
    ],
  );
  return result.rows[0] || null;
};

export const incrementStock = async (variantId, userId, quantity) => {
  const result = await pool.query(
    `UPDATE variant_stock 
    SET stock_quantity = stock_quantity + $3, updated_at = CURRENT_TIMESTAMP
    WHERE variant_id = $1 AND user_id = $2 
    RETURNING *`,
    [variantId, userId, quantity],
  );
  return result.rows[0] || null;
};

export const decrementStock = async (variantId, userId, quantity) => {
  const result = await pool.query(
    `UPDATE variant_stock 
    SET stock_quantity = stock_quantity - $3, updated_at = CURRENT_TIMESTAMP
    WHERE variant_id = $1 AND user_id = $2 AND stock_quantity >= $3
    RETURNING *`,
    [variantId, userId, quantity],
  );
  return result.rows[0] || null;
};

export const reserveStock = async (variantId, userId, quantity) => {
  const result = await pool.query(
    `UPDATE variant_stock 
    SET reserved_quantity = reserved_quantity + $3, updated_at = CURRENT_TIMESTAMP
    WHERE variant_id = $1 AND user_id = $2 
      AND (stock_quantity - reserved_quantity) >= $3
    RETURNING *`,
    [variantId, userId, quantity],
  );
  return result.rows[0] || null;
};

export const releaseReservedStock = async (variantId, userId, quantity) => {
  const result = await pool.query(
    `UPDATE variant_stock 
    SET reserved_quantity = reserved_quantity - $3, updated_at = CURRENT_TIMESTAMP
    WHERE variant_id = $1 AND user_id = $2 AND reserved_quantity >= $3
    RETURNING *`,
    [variantId, userId, quantity],
  );
  return result.rows[0] || null;
};

export const confirmReservedStock = async (variantId, userId, quantity) => {
  const result = await pool.query(
    `UPDATE variant_stock 
    SET 
      stock_quantity = stock_quantity - $3,
      reserved_quantity = reserved_quantity - $3,
      updated_at = CURRENT_TIMESTAMP
    WHERE variant_id = $1 AND user_id = $2 
      AND reserved_quantity >= $3
    RETURNING *`,
    [variantId, userId, quantity],
  );
  return result.rows[0] || null;
};

export const findLowStockByUserId = async (userId, threshold = 10) => {
  const result = await pool.query(
    `SELECT 
      vs.id,
      vs.variant_id,
      vs.stock_quantity,
      vs.reserved_quantity,
      vs.stock_quantity - vs.reserved_quantity as available_quantity,
      pv.variant_name,
      pv.sku,
      p.product_name,
      p.main_image,
      vp.cost_price,
      vp.selling_price,
      vp.mrp,
      vp.tax_percentage
    FROM variant_stock vs
    JOIN product_variants pv ON vs.variant_id = pv.id
    JOIN products p ON pv.product_id = p.id
    LEFT JOIN variant_pricing vp ON vp.variant_id = vs.variant_id AND vp.user_id = vs.user_id
    WHERE vs.user_id = $1 
      AND (vs.stock_quantity - vs.reserved_quantity) <= $2
      AND p.status = 'active'
    ORDER BY (vs.stock_quantity - vs.reserved_quantity), p.product_name`,
    [userId, threshold],
  );
  return result.rows;
};

export const findOutOfStockByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT 
      vs.id,
      vs.variant_id,
      vs.stock_quantity,
      vs.reserved_quantity,
      pv.variant_name,
      pv.sku,
      p.product_name,
      p.main_image,
      vp.cost_price,
      vp.selling_price,
      vp.tax_percentage
    FROM variant_stock vs
    JOIN product_variants pv ON vs.variant_id = pv.id
    JOIN products p ON pv.product_id = p.id
    LEFT JOIN variant_pricing vp ON vp.variant_id = vs.variant_id AND vp.user_id = vs.user_id
    WHERE vs.user_id = $1 
      AND (vs.stock_quantity - vs.reserved_quantity) <= 0
      AND p.status = 'active'
    ORDER BY p.product_name`,
    [userId],
  );
  return result.rows;
};

export const deleteStockAndPricing = async (variantId, userId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Delete pricing first
    await client.query(
      `DELETE FROM variant_pricing 
      WHERE variant_id = $1 AND user_id = $2`,
      [variantId, userId],
    );

    // Delete stock
    const result = await client.query(
      `DELETE FROM variant_stock 
      WHERE variant_id = $1 AND user_id = $2 
      RETURNING id`,
      [variantId, userId],
    );

    await client.query("COMMIT");
    return result.rowCount > 0;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const getStockSummary = async (userId) => {
  const result = await pool.query(
    `SELECT 
      COUNT(*) as total_variants,
      SUM(vs.stock_quantity) as total_stock,
      SUM(vs.reserved_quantity) as total_reserved,
      SUM(vs.stock_quantity - vs.reserved_quantity) as total_available,
      COUNT(CASE WHEN (vs.stock_quantity - vs.reserved_quantity) <= 0 THEN 1 END) as out_of_stock_count,
      COUNT(CASE WHEN (vs.stock_quantity - vs.reserved_quantity) > 0 AND (vs.stock_quantity - vs.reserved_quantity) <= 10 THEN 1 END) as low_stock_count,
      SUM(vs.stock_quantity * vp.cost_price) as total_inventory_cost,
      SUM(vs.stock_quantity * vp.selling_price) as total_inventory_value
    FROM variant_stock vs
    JOIN product_variants pv ON vs.variant_id = pv.id
    JOIN products p ON pv.product_id = p.id
    LEFT JOIN variant_pricing vp ON vp.variant_id = vs.variant_id AND vp.user_id = vs.user_id
    WHERE vs.user_id = $1 AND p.status = 'active'`,
    [userId],
  );
  return result.rows[0];
};

export const findStockByProductAndUser = async (productId, userId) => {
  const result = await pool.query(
    `SELECT 
      pv.id as variant_id,
      pv.variant_name,
      pv.sku,
      pv.attribute_name_1,
      pv.attribute_value_1,
      pv.attribute_name_2,
      pv.attribute_value_2,
      pv.attribute_name_3,
      pv.attribute_value_3,
      vs.id as stock_id,
      vs.stock_quantity,
      vs.reserved_quantity,
      COALESCE(vs.stock_quantity, 0) - COALESCE(vs.reserved_quantity, 0) as available_quantity,
      vp.id as pricing_id,
      vp.cost_price,
      vp.selling_price,
      vp.tax_percentage,
      vp.state,
      vp.city
    FROM product_variants pv
    LEFT JOIN variant_stock vs ON vs.variant_id = pv.id AND vs.user_id = $2
    LEFT JOIN variant_pricing vp ON vp.variant_id = pv.id AND vp.user_id = $2
    WHERE pv.product_id = $1
    ORDER BY pv.variant_name`,
    [productId, userId],
  );
  return result.rows;
};
