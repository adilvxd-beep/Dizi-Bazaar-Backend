import pool from "../../../shared/db/postgres.js";

export const findAllCategories = async () => {
    const result = await pool.query("SELECT * FROM categories");
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

