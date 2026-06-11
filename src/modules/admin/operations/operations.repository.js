import pool from "../../../shared/db/postgres.js";

// ==================== SHIFT TIMINGS ====================

export const findAllShifts = async () => {
  const result = await pool.query("SELECT * FROM shift_timings ORDER BY id ASC");
  return result.rows;
};

export const createShift = async (data) => {
  const { name, start_time, end_time } = data;
  const result = await pool.query(
    "INSERT INTO shift_timings (name, start_time, end_time) VALUES ($1, $2, $3) RETURNING *",
    [name, start_time, end_time]
  );
  return result.rows[0];
};

export const updateShift = async (id, data) => {
  const { name, start_time, end_time, status } = data;
  const result = await pool.query(
    "UPDATE shift_timings SET name = $1, start_time = $2, end_time = $3, status = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *",
    [name, start_time, end_time, status, id]
  );
  return result.rows[0];
};

export const deleteShift = async (id) => {
  await pool.query("DELETE FROM shift_timings WHERE id = $1", [id]);
};

// ==================== DELIVERY RANGES ====================

export const findAllRanges = async () => {
  const result = await pool.query("SELECT * FROM delivery_ranges ORDER BY id ASC");
  return result.rows;
};

export const createRange = async (data) => {
  const { name, range_km, base_charge } = data;
  const result = await pool.query(
    "INSERT INTO delivery_ranges (name, range_km, base_charge) VALUES ($1, $2, $3) RETURNING *",
    [name, range_km, base_charge]
  );
  return result.rows[0];
};

export const updateRange = async (id, data) => {
  const { name, range_km, base_charge, status } = data;
  const result = await pool.query(
    "UPDATE delivery_ranges SET name = $1, range_km = $2, base_charge = $3, status = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *",
    [name, range_km, base_charge, status, id]
  );
  return result.rows[0];
};

export const deleteRange = async (id) => {
  await pool.query("DELETE FROM delivery_ranges WHERE id = $1", [id]);
};
