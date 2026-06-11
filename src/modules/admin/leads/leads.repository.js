import pool from "../../../shared/db/postgres.js";

// ==================== INVESTMENT LEADS ====================

export const findAllInvestmentLeads = async () => {
  const result = await pool.query("SELECT * FROM investment_leads ORDER BY created_at DESC");
  return result.rows;
};

export const createInvestmentLead = async (data) => {
  const { full_name, email, phone, investment_amount, message } = data;
  const result = await pool.query(
    "INSERT INTO investment_leads (full_name, email, phone, investment_amount, message) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [full_name, email, phone, investment_amount, message]
  );
  return result.rows[0];
};

export const updateInvestmentLeadStatus = async (id, status) => {
  const result = await pool.query(
    "UPDATE investment_leads SET status = $1 WHERE id = $2 RETURNING *",
    [status, id]
  );
  return result.rows[0];
};

// ==================== AGENT APPLICATIONS ====================

export const findAllAgentApplications = async () => {
  const result = await pool.query("SELECT * FROM agent_applications ORDER BY created_at DESC");
  return result.rows;
};

export const createAgentApplication = async (data) => {
  const { full_name, email, phone, experience_years, city } = data;
  const result = await pool.query(
    "INSERT INTO agent_applications (full_name, email, phone, experience_years, city) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [full_name, email, phone, experience_years, city]
  );
  return result.rows[0];
};

export const updateAgentApplicationStatus = async (id, status) => {
  const result = await pool.query(
    "UPDATE agent_applications SET status = $1 WHERE id = $2 RETURNING *",
    [status, id]
  );
  return result.rows[0];
};
