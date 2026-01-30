import pool from "../../../shared/db/postgres.js";

// ==================== JOB POSTS CRUD ====================

// Create Job Post
export const createJobPost = async (data) => {
  const {
    title,
    department,
    location,
    type,
    experience,
    salary_min,
    salary_max,
    description,
    requirements,
    benefits,
    application_deadline,
    status = "active",
    contact_email,
    skills,
  } = data;

  const result = await pool.query(
    `
    INSERT INTO job_posts (
      title,
      department,
      location,
      type,
      experience,
      salary_min,
      salary_max,
      description,
      requirements,
      benefits,
      application_deadline,
      status,
      contact_email,
      skills,
      created_at,
      updated_at
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,
      NOW(), NOW()
    )
    RETURNING *
    `,
    [
      title,
      department,
      location,
      type,
      experience,
      salary_min,
      salary_max,
      description,
      requirements,
      benefits,
      application_deadline,
      status,
      contact_email,
      skills,
    ],
  );

  return result.rows[0];
};

// Get Job Post by ID
export const findJobPostById = async (id) => {
  const result = await pool.query(
    `
    SELECT *
    FROM job_posts
    WHERE id = $1
    `,
    [id],
  );

  return result.rows[0];
};

// Get All Job Posts (Admin)
export const findAllJobPosts = async () => {
  const result = await pool.query(
    `
    SELECT *
    FROM job_posts
    ORDER BY created_at DESC
    `,
  );

  return result.rows;
};

// Update Job Post
export const updateJobPostById = async (id, data) => {
  const {
    title,
    department,
    location,
    type,
    experience,
    salary_min,
    salary_max,
    description,
    requirements,
    benefits,
    application_deadline,
    status,
    contact_email,
    skills,
  } = data;

  const result = await pool.query(
    `
    UPDATE job_posts
    SET
      title = $1,
      department = $2,
      location = $3,
      type = $4,
      experience = $5,
      salary_min = $6,
      salary_max = $7,
      description = $8,
      requirements = $9,
      benefits = $10,
      application_deadline = $11,
      status = $12,
      contact_email = $13,
      skills = $14,
      updated_at = NOW()
    WHERE id = $15
    RETURNING *
    `,
    [
      title,
      department,
      location,
      type,
      experience,
      salary_min,
      salary_max,
      description,
      requirements,
      benefits,
      application_deadline,
      status,
      contact_email,
      skills,
      id,
    ],
  );

  return result.rows[0];
};

// Delete Job Post
export const deleteJobPostById = async (id) => {
  const result = await pool.query(
    `
    DELETE FROM job_posts
    WHERE id = $1
    RETURNING *
    `,
    [id],
  );

  return result.rows[0];
};

// ==================== ADMIN HELPERS ====================

// Change Job Status (active / inactive / closed)
export const updateJobPostStatus = async (id, status) => {
  const result = await pool.query(
    `
    UPDATE job_posts
    SET status = $1,
        updated_at = NOW()
    WHERE id = $2
    RETURNING *
    `,
    [status, id],
  );

  return result.rows[0];
};

// Get Job Posts by Status
export const findJobPostsByStatus = async (status) => {
  const result = await pool.query(
    `
    SELECT *
    FROM job_posts
    WHERE status = $1
    ORDER BY created_at DESC
    `,
    [status],
  );

  return result.rows;
};

// Search Job Posts (Admin)
export const searchJobPosts = async (search) => {
  const result = await pool.query(
    `
    SELECT *
    FROM job_posts
    WHERE
      title ILIKE $1 OR
      department ILIKE $1 OR
      location ILIKE $1 OR
      type ILIKE $1 OR
      skills ILIKE $1
    ORDER BY created_at DESC
    `,
    [`%${search}%`],
  );

  return result.rows;
};
