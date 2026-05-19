import pg from 'pg';

const { Pool } = pg;

// Use DATABASE_URL from environment
const connectionString = process.env.DATABASE_URL || import.meta.env.VITE_DATABASE_URL;

if (!connectionString) {
  console.error('ERRO CRÍTICO: DATABASE_URL não definida.');
}

export const pool = new Pool({
  connectionString,
  ssl: !connectionString || connectionString.includes('localhost') || connectionString.includes('127.0.0.1') || connectionString.includes('sslmode=disable') ? false : { rejectUnauthorized: false },
});

export const query = async (text: string, params?: any[]) => {
  try {
    return await pool.query(text, params);
  } catch (error) {
    console.error(`Erro na query SQL: ${text}`, error);
    throw error;
  }
};
