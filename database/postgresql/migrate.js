import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.DATABASE_PUBLIC_URL;

let clientConfig;
if (connectionString) {
  const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
  clientConfig = {
    connectionString,
    ssl: isLocal ? false : { rejectUnauthorized: false }
  };
} else {
  const host = process.env.POSTGRES_HOST || process.env.PGHOST || 'localhost';
  const isLocal = host === 'localhost' || host === '127.0.0.1';
  clientConfig = {
    host,
    port: parseInt(process.env.POSTGRES_PORT || process.env.PGPORT || '5432'),
    user: process.env.POSTGRES_USER || process.env.PGUSER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || process.env.PGPASSWORD || 'postgres',
    database: process.env.POSTGRES_DATABASE || process.env.PGDATABASE || 'ecommerce_db',
    ssl: !isLocal ? { rejectUnauthorized: false } : false
  };
}

const client = new pg.Client(clientConfig);

async function runMigration() {
  try {
    console.log('Connecting to PostgreSQL database...');
    await client.connect();
    console.log('Connected successfully!');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const seedPath = path.join(__dirname, 'seed.sql');

    console.log(`Executing schema DDL from ${schemaPath}...`);
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSql);
    console.log('Schema DDL executed successfully.');

    console.log(`Executing seed data from ${seedPath}...`);
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    await client.query(seedSql);
    console.log('Seed data inserted successfully.');

    console.log('PostgreSQL migration & seeding completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
