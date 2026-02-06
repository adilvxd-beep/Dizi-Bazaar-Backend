import pool from "../../../shared/db/postgres.js";


export const findAllProductVariantsForRetailer = async (query = {}) => {
  const {
    productId,
    search,
    status,
    page = 1,
    limit = 10,
    sortBy = "variant_created_at",
    order = "desc",
  } = query;

  const currentPage = Math.max(parseInt(page, 10), 1);
  const pageLimit = Math.max(parseInt(limit, 10), 1);
  const offset = (currentPage - 1) * pageLimit;

  const allowedSortBy = {
    product_created_at: "p.created_at",
    variant_created_at: "pv.created_at",
    product_name: "p.product_name",
    variant_name: "pv.variant_name",
    selling_price: "ap.selling_price",
    mrp: "ap.mrp",
  };

  const sortColumn = allowedSortBy[sortBy] || "pv.created_at";
  const sortOrder = order?.toLowerCase() === "asc" ? "ASC" : "DESC";

  const conditions = [];
  const values = [];

  if (productId) {
    values.push(productId);
    conditions.push(`pv.product_id = $${values.length}`);
  }

  if (search) {
    values.push(`%${search}%`);
    conditions.push(`
      (p.product_name ILIKE $${values.length}
       OR pv.variant_name ILIKE $${values.length})
    `);
  }

  if (status) {
    values.push(status);
    conditions.push(`p.status = $${values.length}`);
  }

  const whereClause =
    conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const dataQuery = `
    WITH admin_pricing AS (
      SELECT DISTINCT ON (vp.variant_id)
        vp.variant_id,
        vp.selling_price,
        vp.mrp,
        vp.tax_percentage,
        vp.state,
        vp.city
      FROM variant_pricing vp
      JOIN users u ON u.id = vp.user_id
      WHERE u.role = 'admin'
      ORDER BY vp.variant_id, vp.created_at DESC
    )

    SELECT
      p.id AS product_id,
      p.product_name,
      p.description,
      p.main_image,

      pv.id AS variant_id,
      pv.variant_name,
      pv.sku,

      ap.selling_price,
      ap.mrp,
      ap.tax_percentage,
      ap.state,
      ap.city

    FROM product_variants pv
    JOIN products p ON p.id = pv.product_id
    JOIN admin_pricing ap ON ap.variant_id = pv.id

    ${whereClause}

    ORDER BY ${sortColumn} ${sortOrder}
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2};
  `;

  const { rows } = await pool.query(dataQuery, [
    ...values,
    pageLimit,
    offset,
  ]);

  const countQuery = `
    WITH admin_pricing AS (
      SELECT DISTINCT vp.variant_id
      FROM variant_pricing vp
      JOIN users u ON u.id = vp.user_id
      WHERE u.role = 'admin'
    )
    SELECT COUNT(*)::int AS count
    FROM product_variants pv
    JOIN products p ON p.id = pv.product_id
    JOIN admin_pricing ap ON ap.variant_id = pv.id
    ${whereClause};
  `;

  const countResult = await pool.query(countQuery, values);

  return {
    items: rows,
    totalItems: countResult.rows[0].count,
    totalPages: Math.ceil(countResult.rows[0].count / pageLimit),
    currentPage,
  };
};

export const findProductWithVariantsForRetailerById = async (productId) => {
  if (!productId) {
    throw new Error("PRODUCT_ID_REQUIRED");
  }

  const query = `
    WITH admin_pricing AS (
      SELECT DISTINCT ON (vp.variant_id)
        vp.variant_id,
        vp.selling_price,
        vp.mrp,
        vp.tax_percentage,
        vp.state,
        vp.city
      FROM variant_pricing vp
      JOIN users u ON u.id = vp.user_id
      WHERE u.role = 'admin'
      ORDER BY vp.variant_id, vp.created_at DESC
    )
    SELECT
      -- Product
      p.id AS product_id,
      p.product_name,
      p.description,
      p.main_image,
      p.status,
      p.created_at AS product_created_at,

      -- Variant
      pv.id AS variant_id,
      pv.variant_name,
      pv.sku,

      -- Pricing
      ap.selling_price,
      ap.mrp,
      ap.tax_percentage,
      ap.state,
      ap.city

    FROM products p
    JOIN product_variants pv
      ON pv.product_id = p.id
    LEFT JOIN admin_pricing ap
      ON ap.variant_id = pv.id

    WHERE p.id = $1
    ORDER BY pv.created_at ASC;
  `;

  const { rows } = await pool.query(query, [productId]);

  if (rows.length === 0) {
    throw new Error("PRODUCT_NOT_FOUND");
  }

  return rows;
};


