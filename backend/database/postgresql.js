import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
let postgresPool = null;

export function getPostgresPool() {
  if (!postgresPool) {
    postgresPool = new Pool({
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DATABASE || 'ecommerce_db',
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  return postgresPool;
}

export async function testPostgresConnection() {
  try {
    const pool = getPostgresPool();
    const res = await pool.query('SELECT 1 as val');
    return res.rows[0].val === 1;
  } catch (err) {
    return false;
  }
}
