import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

let pool = null;
let isPgConnected = false;

// If DATABASE_URL is configured, initialize PostgreSQL Pool
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (connectionString) {
  try {
    pool = new Pool({
      connectionString,
      ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false }
    });

    pool.on('error', (err) => {
      console.warn('[Postgres Pool Warning]:', err.message);
    });
  } catch (err) {
    console.warn('[Postgres Init Warning]:', err.message);
  }
}

/**
 * Test PostgreSQL connectivity and run migrations if connected
 */
export async function initPostgres() {
  if (!pool) {
    console.log('[Database] PostgreSQL URL not supplied; running resilient JSON DataStore engine.');
    return false;
  }

  try {
    const client = await pool.connect();
    try {
      const res = await client.query('SELECT NOW()');
      console.log('✅ [Database] PostgreSQL connected successfully at:', res.rows[0].now);
      isPgConnected = true;

      // Run schema initialization
      const schemaPath = path.join(__dirname, 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schemaSql);
        console.log('✅ [Database] PostgreSQL Schema verified & synchronized.');
      }
      return true;
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn('⚠️ [Database] Could not connect to PostgreSQL:', err.message);
    console.warn('[Database] Falling back seamlessly to local persistent store.');
    isPgConnected = false;
    return false;
  }
}

export function getPool() {
  return pool;
}

export function isConnected() {
  return isPgConnected;
}

export async function query(text, params) {
  if (!pool || !isPgConnected) {
    throw new Error('PostgreSQL is not currently connected.');
  }
  return pool.query(text, params);
}
