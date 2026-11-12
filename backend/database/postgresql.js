import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;
let postgresPool = null;

export function getPostgresPool() {
  if (!postgresPool) {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.DATABASE_PUBLIC_URL;

    if (connectionString) {
      const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
      postgresPool = new Pool({
        connectionString,
        ssl: isLocal ? false : { rejectUnauthorized: false },
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
    } else {
      const host = process.env.POSTGRES_HOST || process.env.PGHOST || 'localhost';
      const port = parseInt(process.env.POSTGRES_PORT || process.env.PGPORT || '5432');
      const user = process.env.POSTGRES_USER || process.env.PGUSER || 'postgres';
      const password = process.env.POSTGRES_PASSWORD || process.env.PGPASSWORD || 'postgres';
      const database = process.env.POSTGRES_DATABASE || process.env.PGDATABASE || 'ecommerce_db';
      const isLocal = host === 'localhost' || host === '127.0.0.1';
      const useSSL = process.env.POSTGRES_SSL === 'true' || process.env.PGSSL === 'true' || !isLocal;

      postgresPool = new Pool({
        host,
        port,
        user,
        password,
        database,
        ssl: useSSL && !isLocal ? { rejectUnauthorized: false } : false,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
    }

    postgresPool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client:', err.message);
    });
  }
  return postgresPool;
}

export async function testPostgresConnection() {
  try {
    const pool = getPostgresPool();
    const res = await pool.query('SELECT 1 as val');
    return Boolean(res && res.rows && res.rows[0] && res.rows[0].val === 1);
  } catch (err) {
    return false;
  }
}
