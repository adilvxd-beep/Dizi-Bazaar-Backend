import pool from "../../../shared/db/postgres.js";

export const findAllCategories = async (userId, query = {}) => {
  const {
    search,
    status,
    page = 1,
    limit = 10,
    sortBy = "created_at",
    order = "desc",
  } = query;

  // 🔹 Get business_category_id for this user (REQUIRED)
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

  // Sorting (safe)
  const allowedSortBy = ["id", "name", "created_at", "status"];
  const sortColumn = allowedSortBy.includes(sortBy)
    ? `c.${sortBy}`
    : "c.created_at";

  const sortOrder = order?.toLowerCase() === "asc" ? "ASC" : "DESC";

  const conditions = [];
  const values = [];

  // 🔹 Always filter by user's business category
  values.push(businessCategoryId);
  conditions.push(`c.business_category_id = $${values.length}`);

  // Search
  if (search) {
    values.push(`%${search}%`);
    conditions.push(
      `(c.name ILIKE $${values.length} OR bc.name ILIKE $${values.length})`,
    );
  }

  // Status filter
  if (status) {
    values.push(status);
    conditions.push(`c.status = $${values.length}`);
  }

  const whereClause = `WHERE ${conditions.join(" AND ")}`;

  // Data query
  const dataQuery = `
  SELECT
    c.id,
    c.name,
    c.image_url,
    c.status,
    c.created_at,
    c.updated_at,
    bc.id     AS business_category_id,
    bc.name   AS business_category_name,
    bc.status AS business_category_status,
    COUNT(p.id)::int AS product_count
  FROM categories c
  JOIN business_categories bc
    ON bc.id = c.business_category_id
  LEFT JOIN products p
    ON p.category_id = c.id
  ${whereClause}
  GROUP BY
    c.id,
    bc.id
  ORDER BY ${sortColumn} ${sortOrder}
  LIMIT $${values.length + 1}
  OFFSET $${values.length + 2};
`;

  const dataValues = [...values, pageLimit, offset];
  const { rows } = await pool.query(dataQuery, dataValues);

  // Count query
  const countQuery = `
    SELECT COUNT(*)::int AS count
    FROM categories c
    JOIN business_categories bc
      ON bc.id = c.business_category_id
    ${whereClause};
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
