import pg from 'pg';

const { Pool } = pg;

// Use DATABASE_URL from environment
const connectionString = process.env.DATABASE_URL || import.meta.env.VITE_DATABASE_URL;

if (!connectionString) {
  console.warn('DATABASE_URL is not defined. PostgreSQL connection will fail.');
}

export const pool = new Pool({
  connectionString,
  ssl: connectionString?.includes('sslmode=disable') ? false : { rejectUnauthorized: false },
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
