import pg from 'pg';

const { Pool } = pg;

// Use DATABASE_URL from environment
const connectionString = process.env.DATABASE_URL || import.meta.env.VITE_DATABASE_URL;

if (!connectionString) {
  console.warn('AVISO: DATABASE_URL não definida. O banco de dados não funcionará corretamente.');
}

// Configuração do Pool com tratamento de erros de conexão
export const pool = new Pool({
  connectionString,
  ssl: !connectionString || connectionString.includes('localhost') || connectionString.includes('127.0.0.1') || connectionString.includes('sslmode=disable') ? false : { rejectUnauthorized: false },
  // Adiciona um timeout pequeno para falhar rápido em vez de travar o processo
  connectionTimeoutMillis: 5000,
});

// Listener para erros no pool (importante para evitar crash do processo)
pool.on('error', (err) => {
  console.error('Erro inesperado no cliente do PostgreSQL:', err);
});

export const query = async (text: string, params?: any[]) => {
  if (!connectionString) {
    console.error('Tentativa de query sem DATABASE_URL configurada.');
    throw new Error('Database not configured');
  }

  try {
    return await pool.query(text, params);
  } catch (error) {
    console.error(`Erro na query SQL: ${text}`, error);
    // Se for erro de conexão, dá uma dica sobre o Easypanel
    if ((error as any).code === 'ECONNREFUSED' || (error as any).code === 'ENOTFOUND') {
      console.error('DICA: Verifique se o hostname do banco de dados está correto e acessível.');
    }
    throw error;
  }
};
