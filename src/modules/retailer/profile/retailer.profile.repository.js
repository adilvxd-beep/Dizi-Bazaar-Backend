import pool from "../../../shared/db/postgres.js";

export const findRetailerProfileByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT rd.*, bc.name as business_category_name 
     FROM retailer_details rd
     LEFT JOIN business_categories bc ON rd.business_category_id = bc.id
     WHERE rd.user_id = $1`,
    [userId]
  );
  return result.rows[0];
};

export const updateRetailerProfile = async (userId, profileData) => {
  const {
    store_name,
    owner_name,
    email,
    phone_number,
    alternate_phone_number,
    business_address,
    billing_address,
  } = profileData;

  const result = await pool.query(
    `UPDATE retailer_details 
     SET store_name = COALESCE($1, store_name),
         owner_name = COALESCE($2, owner_name),
         email = COALESCE($3, email),
         phone_number = COALESCE($4, phone_number),
         alternate_phone_number = COALESCE($5, alternate_phone_number),
         business_address = COALESCE($6, business_address),
         billing_address = COALESCE($7, billing_address),
         updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $8
     RETURNING *`,
    [
      store_name,
      owner_name,
      email,
      phone_number,
      alternate_phone_number,
      business_address,
      billing_address,
      userId,
    ]
  );
  return result.rows[0];
};

export const createRetailerProfile = async (userId, profileData) => {
    const {
        business_category_id,
        store_name,
        owner_name,
        email,
        phone_number,
        business_address,
      } = profileData;

      const result = await pool.query(
        `INSERT INTO retailer_details (user_id, business_category_id, store_name, owner_name, email, phone_number, business_address)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [userId, business_category_id, store_name, owner_name, email, phone_number, business_address]
      );
      return result.rows[0];
}
