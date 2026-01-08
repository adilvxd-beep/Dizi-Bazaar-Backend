import pkg from "pg";
const { Pool } = pkg;
import { env } from "../../config/index.js";

const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASS,
});

export default pool;
