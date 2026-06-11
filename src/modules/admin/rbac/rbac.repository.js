import pool from "../../../shared/db/postgres.js";

// ==================== ROLES ====================

export const findAllRoles = async () => {
  const result = await pool.query(`
    SELECT r.*, array_agg(p.name) as permissions 
    FROM roles r
    LEFT JOIN role_permissions rp ON r.id = rp.role_id
    LEFT JOIN permissions p ON rp.permission_id = p.id
    GROUP BY r.id
    ORDER BY r.level DESC
  `);
  return result.rows;
};

export const createRole = async (data) => {
  const { name, description, level, permissions } = data;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    const roleResult = await client.query(
      "INSERT INTO roles (name, description, level) VALUES ($1, $2, $3) RETURNING *",
      [name, description, level]
    );
    const roleId = roleResult.rows[0].id;

    if (permissions && permissions.length > 0) {
      for (const permName of permissions) {
        // Ensure permission exists
        const permResult = await client.query(
          "INSERT INTO permissions (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id",
          [permName]
        );
        const permId = permResult.rows[0].id;
        await client.query(
          "INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)",
          [roleId, permId]
        );
      }
    }

    await client.query("COMMIT");
    return { ...roleResult.rows[0], permissions };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const updateRole = async (id, data) => {
  const { name, description, level, permissions, status } = data;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
    const roleResult = await client.query(
      "UPDATE roles SET name = $1, description = $2, level = $3, status = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *",
      [name, description, level, status, id]
    );

    if (permissions) {
      // Clear existing and re-add
      await client.query("DELETE FROM role_permissions WHERE role_id = $1", [id]);
      for (const permName of permissions) {
        const permResult = await client.query(
          "INSERT INTO permissions (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id",
          [permName]
        );
        const permId = permResult.rows[0].id;
        await client.query(
          "INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)",
          [id, permId]
        );
      }
    }

    await client.query("COMMIT");
    return { ...roleResult.rows[0], permissions };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const deleteRole = async (id) => {
  await pool.query("DELETE FROM roles WHERE id = $1", [id]);
};

// ==================== PERMISSIONS ====================

export const findAllPermissions = async () => {
  const result = await pool.query("SELECT * FROM permissions ORDER BY name ASC");
  return result.rows;
};
