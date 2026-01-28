import pool from "../../../shared/db/postgres.js";

export const findAllProducts = async (userId, query = {}) => {
  const {
    search,
    status,
    category_id,
    page = 1,
    limit = 10,
    sortBy = "created_at",
    order = "desc",
  } = query;

  const userResult = await pool.query(
    `SELECT business_category_id FROM users WHERE id = $1`,
    [userId],
  );

  if (!userResult.rowCount) {
    throw new Error("User not found");
  }

  const businessCategoryId = userResult.rows[0].business_category_id;

  if (!businessCategoryId) {
    throw new Error("User has no business category");
  }

  // Pagination
  const currentPage = Math.max(parseInt(page, 10), 1);
  const pageLimit = Math.max(parseInt(limit, 10), 1);
  const offset = (currentPage - 1) * pageLimit;

  // Safe sorting
  const allowedSortBy = ["id", "product_name", "status", "created_at"];
  const sortColumn = allowedSortBy.includes(sortBy) ? sortBy : "created_at";
  const sortOrder = order?.toLowerCase() === "asc" ? "ASC" : "DESC";

  const conditions = [];
  const values = [];

  values.push(businessCategoryId);
  conditions.push(`p.business_category_id = $${values.length}`);

  // Search
  if (search) {
    values.push(`%${search}%`);
    conditions.push(
      `(p.product_name ILIKE $${values.length} OR p.description ILIKE $${values.length})`,
    );
  }

  // Status
  if (status) {
    values.push(status);
    conditions.push(`p.status = $${values.length}`);
  }

  // Category
  if (category_id) {
    values.push(category_id);
    conditions.push(`p.category_id = $${values.length}`);
  }

  const whereClause = `WHERE ${conditions.join(" AND ")}`;

  // Data query
  const dataQuery = `
    SELECT 
      p.*,
      bc.name AS business_category_name,
      c.name  AS category_name,
      COUNT(pv.id)::int AS variant_count
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

  // Count query (no joins needed)
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
