import pool from "../../../shared/db/postgres.js";

export const findAllBusinessCategories = async (query) => {
  const {
    search,
    status,
    page = 1,
    limit = 10,
    sortBy = "created_at",
    order = "desc",
  } = query;

  const offset = (page - 1) * limit;

  // Allowed sortable columns (security)
  const allowedSortBy = ["id", "name", "created_at"];
  const sortColumn = allowedSortBy.includes(sortBy)
    ? sortBy
    : "created_at";

  const sortOrder = order.toLowerCase() === "asc" ? "ASC" : "DESC";

  let conditions = [];
  let values = [];

  // Search
  if (search) {
    values.push(`%${search}%`);
    conditions.push(`name ILIKE $${values.length}`);
  }

  // Filter
  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

  // Final query
  const sql = `
    SELECT *
    FROM business_categories
    ${whereClause}
    ORDER BY ${sortColumn} ${sortOrder}
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `;

  values.push(limit, offset);

  const result = await pool.query(sql, values);

  return result.rows;
};


export const createBusinessCategory = async (categoryData) => {
  const { name, status } = categoryData;
  const result = await pool.query(
    "INSERT INTO business_categories (name, status) VALUES ($1, $2) RETURNING *",
    [name, status]
  );
  return result.rows[0];
};

export const updateBusinessCategory = async (id, categoryData) => {
  const { name, description } = categoryData;
  const result = await pool.query(
    "UPDATE business_categories SET name = $1 WHERE id = $2 RETURNING *",
    [name, id]
  );
  return result.rows[0];
}

export const updateRestrictedBusinessCategoryStatus = async (id, status) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Update business category status
    const result = await client.query(
      `UPDATE business_categories
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    // 2️⃣ If business category is inactivated,
    //    inactivate all linked categories
    if (status === "inactive") {
      await client.query(
        `UPDATE categories
         SET status = 'inactive', updated_at = NOW()
         WHERE business_category_id = $1`,
        [id]
      );
    }
    if (status === "active") {
  await client.query(
    `UPDATE categories
     SET status = 'active', updated_at = NOW()
     WHERE business_category_id = $1`,
    [id]
  );
}

    await client.query("COMMIT");

    return result.rows[0];

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const deleteBusinessCategory = async (id) => {
  await pool.query(
    "DELETE FROM business_categories WHERE id = $1",
    [id]
  );
}