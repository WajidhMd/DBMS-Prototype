import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

let mysqlPool = null;

export function getMySQLPool() {
  if (!mysqlPool) {
    mysqlPool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'ecommerce_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return mysqlPool;
}

export async function testMySQLConnection() {
  try {
    const pool = getMySQLPool();
    const [rows] = await pool.query('SELECT 1 as val');
    return rows[0].val === 1;
  } catch (err) {
    return false;
  }
}
