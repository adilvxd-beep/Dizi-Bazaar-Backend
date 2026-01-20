import pool from "../../../shared/db/postgres.js";

// ==================== PRODUCT CRUD ====================

export const findProductById = async (id) => {
  const result = await pool.query(
    `
    SELECT 
      p.*,
      bc.name as business_category_name,
      c.name as category_name
    FROM products p
    LEFT JOIN business_categories bc ON p.business_category_id = bc.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = $1
    `,
    [id],
  );
  return result.rows[0];
};

export const findAllProducts = async (query = {}) => {
  const {
    search,
    status,
    category_id,
    business_category_id,
    page = 1,
    limit = 10,
    sortBy = "created_at",
    order = "desc",
  } = query;

  // Ensure numbers
  const currentPage = Math.max(parseInt(page, 10), 1);
  const pageLimit = Math.max(parseInt(limit, 10), 1);
  const offset = (currentPage - 1) * pageLimit;

  // Allowed sortable columns (SQL injection protection)
  const allowedSortBy = ["id", "product_name", "status", "created_at"];
  const sortColumn = allowedSortBy.includes(sortBy) ? sortBy : "created_at";
  const sortOrder = order?.toLowerCase() === "asc" ? "ASC" : "DESC";

  const conditions = [];
  const values = [];

  // Search filter
  if (search) {
    values.push(`%${search}%`);
    conditions.push(
      `(p.product_name ILIKE $${values.length} OR p.description ILIKE $${values.length})`,
    );
  }

  // Status filter
  if (status) {
    values.push(status);
    conditions.push(`p.status = $${values.length}`);
  }

  // Category filter
  if (category_id) {
    values.push(category_id);
    conditions.push(`p.category_id = $${values.length}`);
  }

  // Business category filter
  if (business_category_id) {
    values.push(business_category_id);
    conditions.push(`p.business_category_id = $${values.length}`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Data query
  const dataQuery = `
    SELECT 
      p.*,
      bc.name as business_category_name,
      c.name as category_name,
      COUNT(pv.id)::int as variant_count
    FROM products p
    LEFT JOIN business_categories bc ON p.business_category_id = bc.id
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_variants pv ON p.id = pv.product_id
    ${whereClause}
    GROUP BY p.id, bc.name, c.name
    ORDER BY p.${sortColumn} ${sortOrder}
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `;

  const dataValues = [...values, pageLimit, offset];
  const { rows } = await pool.query(dataQuery, dataValues);

  // Count query
  const countQuery = `
    SELECT COUNT(DISTINCT p.id)::int AS count
    FROM products p
    ${whereClause}
  `;

  const countResult = await pool.query(countQuery, values);
  const totalItems = countResult.rows[0].count;
  const totalPages = Math.ceil(totalItems / pageLimit);

  return {
    items: rows,
    totalItems,
    totalPages,
    currentPage,
  };
};

export const createProduct = async (productData) => {
  const {
    product_name,
    business_category_id,
    category_id,
    description,
    main_image,
    status = "active",
  } = productData;

  const result = await pool.query(
    `
    INSERT INTO products (product_name, business_category_id, category_id, description, main_image, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [
      product_name,
      business_category_id,
      category_id,
      description,
      main_image,
      status,
    ],
  );
  return result.rows[0];
};

export const updateProduct = async (id, productData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(productData).forEach((key) => {
    if (productData[key] !== undefined) {
      fields.push(`${key} = $${paramCount}`);
      values.push(productData[key]);
      paramCount++;
    }
  });

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(id);

  const result = await pool.query(
    `
    UPDATE products
    SET ${fields.join(", ")}
    WHERE id = $${paramCount}
    RETURNING *
    `,
    values,
  );
  return result.rows[0];
};

export const toggleProductStatus = async (id) => {
  const result = await pool.query(
    `
    UPDATE products
    SET status = CASE 
      WHEN status = 'active' THEN 'inactive'::status
      ELSE 'active'::status
    END,
    updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
    `,
    [id],
  );

  return result.rows[0];
};

export const deleteProduct = async (id) => {
  await pool.query("DELETE FROM products WHERE id = $1", [id]);
};

// ==================== PRODUCT VARIANTS ====================

export const findVariantById = async (id) => {
  const result = await pool.query(
    `
    SELECT 
      pv.*,
      json_agg(
        json_build_object(
          'id', vi.id,
          'image_url', vi.image_url,
          'display_order', vi.display_order
        ) ORDER BY vi.display_order
      ) FILTER (WHERE vi.id IS NOT NULL) as images
    FROM product_variants pv
    LEFT JOIN variant_images vi ON pv.id = vi.variant_id
    WHERE pv.id = $1
    GROUP BY pv.id
    `,
    [id],
  );
  return result.rows[0];
};

export const findVariantsByProductId = async (productId) => {
  const { rows } = await pool.query(
    `
    SELECT * FROM product_variants
    WHERE product_id = $1
    ORDER BY created_at DESC
    `,
    [productId],
  );
  return rows;
};

export const findVariantBySKU = async (sku) => {
  const result = await pool.query(
    `
    SELECT 
      pv.*,
      p.product_name,
      p.main_image,
      p.description
    FROM product_variants pv
    JOIN products p ON pv.product_id = p.id
    WHERE pv.sku = $1
    `,
    [sku],
  );
  return result.rows[0];
};

export const createVariant = async (variantData) => {
  const {
    product_id,
    variant_name,
    attribute_name_1,
    attribute_value_1,
    attribute_name_2,
    attribute_value_2,
    attribute_name_3,
    attribute_value_3,
    sku,
  } = variantData;

  const result = await pool.query(
    `
    INSERT INTO product_variants 
    (product_id, variant_name, attribute_name_1, attribute_value_1, 
     attribute_name_2, attribute_value_2, attribute_name_3, attribute_value_3, sku)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
    `,
    [
      product_id,
      variant_name,
      attribute_name_1,
      attribute_value_1,
      attribute_name_2,
      attribute_value_2,
      attribute_name_3,
      attribute_value_3,
      sku,
    ],
  );
  return result.rows[0];
};

export const updateVariant = async (id, variantData) => {
  const fields = [];
  const values = [];
  let paramCount = 1;

  Object.keys(variantData).forEach((key) => {
    if (variantData[key] !== undefined) {
      fields.push(`${key} = $${paramCount}`);
      values.push(variantData[key]);
      paramCount++;
    }
  });

  if (fields.length === 0) {
    throw new Error("No fields to update");
  }

  values.push(id);

  const result = await pool.query(
    `
    UPDATE product_variants
    SET ${fields.join(", ")}
    WHERE id = $${paramCount}
    RETURNING *
    `,
    values,
  );
  return result.rows[0];
};

export const deleteVariant = async (id) => {
  await pool.query("DELETE FROM product_variants WHERE id = $1", [id]);
};

// ==================== VARIANT IMAGES ====================

export const findVariantImages = async (variantId) => {
  const { rows } = await pool.query(
    `
    SELECT * FROM variant_images
    WHERE variant_id = $1
    ORDER BY display_order
    `,
    [variantId],
  );
  return rows;
};

export const addVariantImages = async (variantId, images) => {
  const values = [];
  const placeholders = [];

  images.forEach((img, index) => {
    const offset = index * 3;
    placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3})`);
    values.push(variantId, img.image_url, img.display_order || index);
  });

  const { rows } = await pool.query(
    `
    INSERT INTO variant_images (variant_id, image_url, display_order)
    VALUES ${placeholders.join(", ")}
    RETURNING *
    `,
    values,
  );
  return rows;
};

export const updateImageOrder = async (id, displayOrder) => {
  const result = await pool.query(
    `
    UPDATE variant_images
    SET display_order = $1
    WHERE id = $2
    RETURNING *
    `,
    [displayOrder, id],
  );
  return result.rows[0];
};

export const deleteVariantImage = async (id) => {
  await pool.query("DELETE FROM variant_images WHERE id = $1", [id]);
};

// ==================== VARIANT PRICING ====================

export const findPricingByUser = async (userId, variantId = null) => {
  let query = `
    SELECT 
      vp.*,
      pv.variant_name,
      pv.sku,
      p.product_name,
      p.main_image,
      u.username as wholesaler_name
    FROM variant_pricing vp
    JOIN product_variants pv ON vp.variant_id = pv.id
    JOIN products p ON pv.product_id = p.id
    JOIN users u ON vp.user_id = u.id
    WHERE vp.user_id = $1
  `;

  const params = [userId];

  if (variantId) {
    query += ` AND vp.variant_id = $2`;
    params.push(variantId);
  }

  query += ` ORDER BY p.product_name, pv.variant_name`;

  const { rows } = await pool.query(query, params);
  return rows;
};

export const findPricingByVariant = async (variantId) => {
  const { rows } = await pool.query(
    `
    SELECT 
      vp.*,
      u.username as wholesaler_name,
      u.state as user_state,
      u.city as user_city
    FROM variant_pricing vp
    JOIN users u ON vp.user_id = u.id
    WHERE vp.variant_id = $1
    ORDER BY vp.selling_price
    `,
    [variantId],
  );
  return rows;
};

export const setVariantPricing = async (pricingData) => {
  const {
    variant_id,
    user_id,
    cost_price,
    selling_price,
    tax_percentage,
    state,
    city,
  } = pricingData;

  const result = await pool.query(
    `
    INSERT INTO variant_pricing 
    (variant_id, user_id, cost_price, selling_price, tax_percentage, state, city)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (variant_id, user_id)
    DO UPDATE SET
      cost_price = EXCLUDED.cost_price,
      selling_price = EXCLUDED.selling_price,
      tax_percentage = EXCLUDED.tax_percentage,
      state = EXCLUDED.state,
      city = EXCLUDED.city,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
    `,
    [
      variant_id,
      user_id,
      cost_price,
      selling_price,
      tax_percentage || 0,
      state,
      city,
    ],
  );
  return result.rows[0];
};

export const bulkSetVariantPricing = async (userId, pricingArray) => {
  const values = [];
  const placeholders = [];

  pricingArray.forEach((pricing, index) => {
    const offset = index * 7;
    placeholders.push(
      `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${
        offset + 5
      }, $${offset + 6}, $${offset + 7})`,
    );
    values.push(
      pricing.variant_id,
      userId,
      pricing.cost_price,
      pricing.selling_price,
      pricing.tax_percentage || 0,
      pricing.state,
      pricing.city,
    );
  });

  const { rows } = await pool.query(
    `
    INSERT INTO variant_pricing 
    (variant_id, user_id, cost_price, selling_price, tax_percentage, state, city)
    VALUES ${placeholders.join(", ")}
    ON CONFLICT (variant_id, user_id)
    DO UPDATE SET
      cost_price = EXCLUDED.cost_price,
      selling_price = EXCLUDED.selling_price,
      tax_percentage = EXCLUDED.tax_percentage,
      state = EXCLUDED.state,
      city = EXCLUDED.city,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
    `,
    values,
  );
  return rows;
};

export const deleteVariantPricing = async (variantId, userId) => {
  await pool.query(
    `
    DELETE FROM variant_pricing
    WHERE variant_id = $1 AND user_id = $2
    `,
    [variantId, userId],
  );
};

// ========================================================================
// Create Product with Variants and Single Price (Transactional Helper)
// ========================================================================
export const createProductWithVariantsAndSinglePrice = async (
  productData,
  variants,
  userId,
  location,
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Insert Product
    const productResult = await client.query(
      `
      INSERT INTO products 
      (product_name, business_category_id, category_id, description, main_image, status)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [
        productData.product_name,
        productData.business_category_id,
        productData.category_id,
        productData.description,
        productData.main_image,
        productData.status || "active",
      ],
    );

    const product = productResult.rows[0];
    const createdVariants = [];

    // 2. Insert Variants + Images + Pricing
    for (const variant of variants) {
      const variantResult = await client.query(
        `
        INSERT INTO product_variants 
        (product_id, variant_name, attribute_name_1, attribute_value_1,
         attribute_name_2, attribute_value_2, attribute_name_3, attribute_value_3, sku)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *
        `,
        [
          product.id,
          variant.variant_name,
          variant.attribute_name_1,
          variant.attribute_value_1,
          variant.attribute_name_2,
          variant.attribute_value_2,
          variant.attribute_name_3,
          variant.attribute_value_3,
          variant.sku,
        ],
      );

      const createdVariant = variantResult.rows[0];

      // Variant Images
      if (variant.images?.length) {
        const imgValues = [];
        const imgPlaceholders = [];

        variant.images.forEach((img, index) => {
          const offset = index * 3;
          imgPlaceholders.push(
            `($${offset + 1},$${offset + 2},$${offset + 3})`,
          );
          imgValues.push(
            createdVariant.id,
            img.image_url,
            img.display_order || index,
          );
        });

        await client.query(
          `
          INSERT INTO variant_images (variant_id,image_url,display_order)
          VALUES ${imgPlaceholders.join(",")}
          `,
          imgValues,
        );
      }

      // Per-Variant Pricing
      await client.query(
        `
        INSERT INTO variant_pricing
        (variant_id,user_id,cost_price,selling_price,tax_percentage,state,city)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        `,
        [
          createdVariant.id,
          userId,
          variant.pricing.cost_price,
          variant.pricing.selling_price,
          variant.pricing.tax_percentage || 0,
          location.state,
          location.city,
        ],
      );

      createdVariants.push(createdVariant);
    }

    await client.query("COMMIT");

    return { product, variants: createdVariants };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// ========================================================================
// Update Product with Variants and Single Price (Transactional Helper)
// ========================================================================
export const updateProductWithVariantsAndSinglePrice = async (
  productId,
  productData,
  variants,
  userId,
  location,
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Update product
    await client.query(
      `
      UPDATE products
      SET product_name=$1,
          business_category_id=$2,
          category_id=$3,
          description=$4,
          main_image=$5,
          status=$6,
          updated_at=CURRENT_TIMESTAMP
      WHERE id=$7
      `,
      [
        productData.product_name,
        productData.business_category_id,
        productData.category_id,
        productData.description,
        productData.main_image,
        productData.status || "active",
        productId,
      ],
    );

    // Remove old variants (images & pricing cascade)
    await client.query(`DELETE FROM product_variants WHERE product_id=$1`, [
      productId,
    ]);

    const createdVariants = [];

    for (const variant of variants) {
      const variantResult = await client.query(
        `
        INSERT INTO product_variants 
        (product_id,variant_name,attribute_name_1,attribute_value_1,
         attribute_name_2,attribute_value_2,attribute_name_3,attribute_value_3,sku)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *
        `,
        [
          productId,
          variant.variant_name,
          variant.attribute_name_1,
          variant.attribute_value_1,
          variant.attribute_name_2,
          variant.attribute_value_2,
          variant.attribute_name_3,
          variant.attribute_value_3,
          variant.sku,
        ],
      );

      const createdVariant = variantResult.rows[0];

      // Images
      if (variant.images?.length) {
        const imgValues = [];
        const imgPlaceholders = [];

        variant.images.forEach((img, index) => {
          const offset = index * 3;
          imgPlaceholders.push(
            `($${offset + 1},$${offset + 2},$${offset + 3})`,
          );
          imgValues.push(
            createdVariant.id,
            img.image_url,
            img.display_order || index,
          );
        });

        await client.query(
          `
          INSERT INTO variant_images (variant_id,image_url,display_order)
          VALUES ${imgPlaceholders.join(",")}
          `,
          imgValues,
        );
      }

      // Per-Variant Pricing
      await client.query(
        `
        INSERT INTO variant_pricing
        (variant_id,user_id,cost_price,selling_price,tax_percentage,state,city)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        `,
        [
          createdVariant.id,
          userId,
          variant.pricing.cost_price,
          variant.pricing.selling_price,
          variant.pricing.tax_percentage || 0,
          location.state,
          location.city,
        ],
      );

      createdVariants.push(createdVariant);
    }

    await client.query("COMMIT");
    return { productId, variants: createdVariants };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// ========================================================================
// Delete Product with Variants, Images, and Pricing (Transactional Helper)
// ========================================================================
export const deleteProductFull = async (productId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Delete pricing linked to variants
    await client.query(
      `
      DELETE FROM variant_pricing
      WHERE variant_id IN (
        SELECT id FROM product_variants WHERE product_id = $1
      )
      `,
      [productId],
    );

    // Delete variant images
    await client.query(
      `
      DELETE FROM variant_images
      WHERE variant_id IN (
        SELECT id FROM product_variants WHERE product_id = $1
      )
      `,
      [productId],
    );

    // Delete variants
    await client.query(`DELETE FROM product_variants WHERE product_id = $1`, [
      productId,
    ]);

    // Delete product
    await client.query(`DELETE FROM products WHERE id = $1`, [productId]);

    await client.query("COMMIT");
    return { deleted: true, productId };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// ==================== COMPLEX QUERIES ====================

export const findCompleteProduct = async (productId, userId = null) => {
  const result = await pool.query(
    `
    SELECT 
      p.*,
      bc.name as business_category_name,
      c.name as category_name,
      json_agg(
        DISTINCT jsonb_build_object(
          'variant_id', pv.id,
          'variant_name', pv.variant_name,
          'sku', pv.sku,
          'attributes', jsonb_build_object(
            'attribute_1', jsonb_build_object('name', pv.attribute_name_1, 'value', pv.attribute_value_1),
            'attribute_2', jsonb_build_object('name', pv.attribute_name_2, 'value', pv.attribute_value_2),
            'attribute_3', jsonb_build_object('name', pv.attribute_name_3, 'value', pv.attribute_value_3)
          ),
          'images', (
            SELECT json_agg(
              json_build_object('id', vi.id, 'image_url', vi.image_url, 'display_order', vi.display_order)
              ORDER BY vi.display_order
            )
            FROM variant_images vi
            WHERE vi.variant_id = pv.id
          ),
          'pricing', CASE 
            WHEN $2 IS NOT NULL THEN (
              SELECT json_build_object(
                'cost_price', vp.cost_price,
                'selling_price', vp.selling_price,
                'tax_percentage', vp.tax_percentage,
                'state', vp.state,
                'city', vp.city
              )
              FROM variant_pricing vp
              WHERE vp.variant_id = pv.id AND vp.user_id = $2
            )
            ELSE NULL
          END
        )
      ) FILTER (WHERE pv.id IS NOT NULL) as variants
    FROM products p
    LEFT JOIN business_categories bc ON p.business_category_id = bc.id
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_variants pv ON p.id = pv.product_id
    WHERE p.id = $1
    GROUP BY p.id, bc.name, c.name
    `,
    [productId, userId],
  );
  return result.rows[0];
};

export const searchProducts = async (query = {}) => {
  const {
    search,
    page = 1,
    limit = 10,
    sortBy = "created_at",
    order = "desc",
  } = query;

  // Ensure numbers
  const currentPage = Math.max(parseInt(page, 10), 1);
  const pageLimit = Math.max(parseInt(limit, 10), 1);
  const offset = (currentPage - 1) * pageLimit;

  // Allowed sortable columns
  const allowedSortBy = ["id", "product_name", "created_at"];
  const sortColumn = allowedSortBy.includes(sortBy) ? sortBy : "created_at";
  const sortOrder = order?.toLowerCase() === "asc" ? "ASC" : "DESC";

  if (!search) {
    return {
      items: [],
      totalItems: 0,
      totalPages: 0,
      currentPage,
    };
  }

  const searchPattern = `%${search}%`;

  // Data query
  const dataQuery = `
    SELECT DISTINCT
      p.*,
      bc.name as business_category_name,
      c.name as category_name
    FROM products p
    LEFT JOIN business_categories bc ON p.business_category_id = bc.id
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_variants pv ON p.id = pv.product_id
    WHERE 
      p.product_name ILIKE $1 OR
      p.description ILIKE $1 OR
      pv.sku ILIKE $1 OR
      pv.variant_name ILIKE $1
    ORDER BY p.${sortColumn} ${sortOrder}
    LIMIT $2 OFFSET $3
  `;

  const { rows } = await pool.query(dataQuery, [
    searchPattern,
    pageLimit,
    offset,
  ]);

  // Count query
  const countQuery = `
    SELECT COUNT(DISTINCT p.id)::int AS count
    FROM products p
    LEFT JOIN product_variants pv ON p.id = pv.product_id
    WHERE 
      p.product_name ILIKE $1 OR
      p.description ILIKE $1 OR
      pv.sku ILIKE $1 OR
      pv.variant_name ILIKE $1
  `;

  const countResult = await pool.query(countQuery, [searchPattern]);
  const totalItems = countResult.rows[0].count;
  const totalPages = Math.ceil(totalItems / pageLimit);

  return {
    items: rows,
    totalItems,
    totalPages,
    currentPage,
  };
};

export const findProductsWithPriceStats = async (query = {}) => {
  const { page = 1, limit = 10, sortBy = "created_at", order = "desc" } = query;

  // Ensure numbers
  const currentPage = Math.max(parseInt(page, 10), 1);
  const pageLimit = Math.max(parseInt(limit, 10), 1);
  const offset = (currentPage - 1) * pageLimit;

  // Allowed sortable columns
  const allowedSortBy = ["id", "product_name", "created_at"];
  const sortColumn = allowedSortBy.includes(sortBy) ? sortBy : "created_at";
  const sortOrder = order?.toLowerCase() === "asc" ? "ASC" : "DESC";

  // Data query
  const dataQuery = `
    SELECT 
      p.*,
      COUNT(DISTINCT pv.id)::int as variant_count,
      COUNT(DISTINCT vp.user_id)::int as wholesaler_count,
      MIN(vp.selling_price) as min_price,
      MAX(vp.selling_price) as max_price,
      AVG(vp.selling_price) as avg_price
    FROM products p
    LEFT JOIN product_variants pv ON p.id = pv.product_id
    LEFT JOIN variant_pricing vp ON pv.id = vp.variant_id
    WHERE p.status = 'active'
    GROUP BY p.id
    ORDER BY p.${sortColumn} ${sortOrder}
    LIMIT $1 OFFSET $2
  `;

  const { rows } = await pool.query(dataQuery, [pageLimit, offset]);

  // Count query
  const countQuery = `
    SELECT COUNT(*)::int AS count
    FROM products p
    WHERE p.status = 'active'
  `;

  const countResult = await pool.query(countQuery);
  const totalItems = countResult.rows[0].count;
  const totalPages = Math.ceil(totalItems / pageLimit);

  return {
    items: rows,
    totalItems,
    totalPages,
    currentPage,
  };
};

export const findProductsByCategory = async (categoryId, query = {}) => {
  const { page = 1, limit = 10, sortBy = "created_at", order = "desc" } = query;

  // Ensure numbers
  const currentPage = Math.max(parseInt(page, 10), 1);
  const pageLimit = Math.max(parseInt(limit, 10), 1);
  const offset = (currentPage - 1) * pageLimit;

  // Allowed sortable columns
  const allowedSortBy = ["id", "product_name", "created_at"];
  const sortColumn = allowedSortBy.includes(sortBy) ? sortBy : "created_at";
  const sortOrder = order?.toLowerCase() === "asc" ? "ASC" : "DESC";

  // Data query
  const dataQuery = `
    SELECT 
      p.*,
      COUNT(pv.id)::int as variant_count
    FROM products p
    LEFT JOIN product_variants pv ON p.id = pv.product_id
    WHERE p.category_id = $1 AND p.status = 'active'
    GROUP BY p.id
    ORDER BY p.${sortColumn} ${sortOrder}
    LIMIT $2 OFFSET $3
  `;

  const { rows } = await pool.query(dataQuery, [categoryId, pageLimit, offset]);

  // Count query
  const countQuery = `
    SELECT COUNT(*)::int AS count
    FROM products p
    WHERE p.category_id = $1 AND p.status = 'active'
  `;

  const countResult = await pool.query(countQuery, [categoryId]);
  const totalItems = countResult.rows[0].count;
  const totalPages = Math.ceil(totalItems / pageLimit);

  return {
    items: rows,
    totalItems,
    totalPages,
    currentPage,
  };
};
