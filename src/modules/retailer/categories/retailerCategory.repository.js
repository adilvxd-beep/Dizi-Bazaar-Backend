import pool from "../../../shared/db/postgres.js";


export const findAllCategoriesForRetailer = async () => {
  const query = `
    SELECT
      id,
      name,
      business_category_id,
      status,
      created_at,
      updated_at
    FROM categories
    ORDER BY name ASC;
  `;

  const { rows } = await pool.query(query);
  return rows;
};
