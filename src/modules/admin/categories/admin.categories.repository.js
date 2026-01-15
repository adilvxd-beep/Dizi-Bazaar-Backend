import pool from "../../../shared/db/postgres.js";


export const findCategoryById = async (categoryId) => {
    const result = await pool.query(
        `
        SELECT
            c.id,
            c.name,
            c.image_url,
            c.status,
            c.created_at,
            c.updated_at,
            bc.id     AS business_category_id,
            bc.name   AS business_category_name,
            bc.status AS business_category_status
        FROM categories c
        JOIN business_categories bc
            ON bc.id = c.business_category_id
        WHERE c.id = $1 
        `,
        [categoryId]
    );
    return result.rows[0];
};

export const findAllCategories = async (query = {}) => {
  const {
    search,
    status,
    business_category_id,
    page = 1,
    limit = 10,
    sortBy = "created_at",
    order = "desc",
  } = query;

  // Ensure valid numbers
  const currentPage = Math.max(parseInt(page, 10), 1);
  const pageLimit = Math.max(parseInt(limit, 10), 1);
  const offset = (currentPage - 1) * pageLimit;

  // Allowed sortable columns (SQL injection protection)
  const allowedSortBy = ["id", "name", "created_at", "status"];
  const sortColumn = allowedSortBy.includes(sortBy)
    ? `c.${sortBy}`
    : "c.created_at";

  const sortOrder = order?.toLowerCase() === "asc" ? "ASC" : "DESC";

  const conditions = [];
  const values = [];

  // Search (category name OR business category name)
  if (search) {
    values.push(`%${search}%`);
    conditions.push(
      `(c.name ILIKE $${values.length} OR bc.name ILIKE $${values.length})`
    );
  }

  //  Filter by category status
  if (status) {
    values.push(status);
    conditions.push(`c.status = $${values.length}`);
  }

  // Filter by business category
  if (business_category_id) {
    values.push(Number(business_category_id));
    conditions.push(`c.business_category_id = $${values.length}`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

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
      bc.status AS business_category_status
    FROM categories c
    JOIN business_categories bc
      ON bc.id = c.business_category_id
    ${whereClause}
    ORDER BY ${sortColumn} ${sortOrder}
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2};
  `;

  const dataValues = [...values, pageLimit, offset];
  const { rows } = await pool.query(dataQuery, dataValues);

  // Count query (same filters, no pagination)
  const countQuery = `
    SELECT COUNT(*)::int AS countgetAllBusinessCategoryById
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

export const createCategory = async (categoryData) => {
    const { name, business_category_id, image_url, status } = categoryData;
    const result = await pool.query(
        "INSERT INTO categories (name, business_category_id, image_url, status) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, business_category_id, image_url, status]
    );
    return result.rows[0];
};

/**
 * Check business category existence + status
 */
export const getBusinessCategoryStatusRepo = async (businessCategoryId) => {
  const result = await pool.query(
    "SELECT status FROM business_categories WHERE id = $1",
    [businessCategoryId]
  );

  return result.rows[0] || null;
};

/**
 * Update category fields
 */
export const updateCategoryRepo = async (categoryId, updateData) => {
  const fields = [];
  const values = [];
  let index = 1;

  for (const key in updateData) {
    fields.push(`${key} = $${index}`);
    values.push(updateData[key]);
    index++;
  }

  values.push(categoryId);

  const sql = `
    UPDATE categories
    SET ${fields.join(", ")},
        updated_at = NOW()
    WHERE id = $${index}
    RETURNING *
  `;

  const result = await pool.query(sql, values);
  return result.rows[0];
};  

export const toggleCategoryStatusRepo = async (categoryId) => {

  const result = await pool.query(
    `
    UPDATE categories
    SET status = (
      CASE
        WHEN status = 'active' THEN 'inactive'
        ELSE 'active'
      END
    )::status,
    updated_at = NOW()
    WHERE id = $1
    RETURNING id, status
    `,
    [categoryId]
  );

  return result;
};


export const deleteCategoryById = async (categoryId) => {
    const result = await pool.query(
        "DELETE FROM categories WHERE id = $1 RETURNING *",
        [categoryId]
    );
    return result.rows[0];
};
