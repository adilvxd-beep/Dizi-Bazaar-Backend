import pool from "../../../shared/db/postgres.js";

/**
 * CREATE
 */
export const createCustomFieldDefinition = async ({
  module,
  field_key,
  label,
  field_type,
  placeholder,
  required,
  validation_regex,
  options,
  is_active,
}) => {
  const result = await pool.query(
    `
    INSERT INTO custom_field_definitions (
      module,
      field_key,
      label,
      field_type,
      placeholder,
      required,
      validation_regex,
      options,
      is_active
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9)
    RETURNING *
    `,
    [
      module,
      field_key,
      label,
      field_type,
      placeholder,
      required,
      validation_regex,
      options ? JSON.stringify(options) : null,
      is_active,
    ],
  );

  return result.rows[0];
};

/**
 * READ ALL
 */
export const findAllCustomFieldDefinitions = async () => {
  const result = await pool.query(
    "SELECT * FROM custom_field_definitions ORDER BY created_at DESC",
  );
  return result.rows;
};

/**
 * READ BY ID
 */
export const findCustomFieldDefinitionById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM custom_field_definitions WHERE id = $1",
    [id],
  );
  return result.rows[0];
};

/**
 * READ BY MODULE
 */
export const findCustomFieldsByModule = async (module) => {
  const result = await pool.query(
    `
    SELECT *
    FROM custom_field_definitions
    WHERE module = $1
      AND is_active = true
    ORDER BY created_at ASC
    `,
    [module],
  );
  return result.rows;
};

/**
 * UPDATE
 */
export const updateCustomFieldDefinition = async (
  id,
  {
    label,
    field_type,
    placeholder,
    required,
    validation_regex,
    options,
    is_active,
  },
) => {
  const result = await pool.query(
    `
    UPDATE custom_field_definitions
    SET
      label = $1,
      field_type = $2,
      placeholder = $3,
      required = $4,
      validation_regex = $5,
      options = $6,
      is_active = $7
    WHERE id = $8
    RETURNING *
    `,
    [
      label,
      field_type,
      placeholder,
      required,
      validation_regex,
      options,
      is_active,
      id,
    ],
  );

  return result.rows[0];
};

/**
 * DELETE
 * (hard delete — tell me if you prefer soft delete)
 */
export const deleteCustomFieldDefinition = async (id) => {
  const result = await pool.query(
    "DELETE FROM custom_field_definitions WHERE id = $1 RETURNING *",
    [id],
  );
  return result.rows[0];
};
