import pool from "../../../shared/db/postgres.js";


export const findAllCategories = async (query) => {
  const {
    search,
    status,
    business_category_id,
    page = 1,
    limit = 10,
    sortBy = "created_at",
    order = "desc",
  } = query;

  const offset = (page - 1) * limit;

  // Allowed sortable columns (security)
  const allowedSortBy = ["id", "name", "created_at", "status"];
  const sortColumn = allowedSortBy.includes(sortBy)
    ? `c.${sortBy}`
    : "c.created_at";

  const sortOrder = order.toLowerCase() === "asc" ? "ASC" : "DESC";

  let conditions = [];
  let values = [];

  // 🔍 Search (category name OR business category name)
  if (search) {
    values.push(`%${search}%`);
    conditions.push(
      `(c.name ILIKE $${values.length} OR bc.name ILIKE $${values.length})`
    );
  }

  // 🎯 Filter by category status
  if (status) {
    values.push(status);
    conditions.push(`c.status = $${values.length}`);
  }

  // 🎯 Filter by business_category_id
  if (business_category_id) {
    values.push(Number(business_category_id));
    conditions.push(`c.business_category_id = $${values.length}`);
  }

  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

  const sql = `
    SELECT
      c.id,
      c.name,
      c.image_url,
      c.status,
      c.created_at,
      c.updated_at,
      bc.id   AS business_category_id,
      bc.name AS business_category_name,
      bc.status AS business_category_status
    FROM categories c
    JOIN business_categories bc
      ON bc.id = c.business_category_id
    ${whereClause}
    ORDER BY ${sortColumn} ${sortOrder}
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `;

  values.push(limit, offset);

  const result = await pool.query(sql, values);
  return result.rows;
};


export const createCategory = async (categoryData) => {
    const { name, business_category_id, image_url, status } = categoryData;
    const result = await pool.query(
        "INSERT INTO categories (name, business_category_id, image_url, status) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, business_category_id, image_url, status]
    );
    return result.rows[0];
};

export const updateCategory = async (categoryId, updateData) => {
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
        SET ${fields.join(", ")}
        WHERE id = $${index}
        RETURNING *
    `;

    const result = await pool.query(sql, values);
    return result.rows[0];
};      


export const deleteCategoryById = async (categoryId) => {
    const result = await pool.query(
        "DELETE FROM categories WHERE id = $1 RETURNING *",
        [categoryId]
    );
    return result.rows[0];
};
