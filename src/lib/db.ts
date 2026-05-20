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
  // Em ambiente de preview (Lovable), ignoramos erros de conexão com localhost/127.0.0.1
  // para permitir que o SSR carregue sem travar a interface.
  const isPreview = typeof window === 'undefined' && (!connectionString || connectionString.includes('127.0.0.1') || connectionString.includes('localhost'));

  if (!connectionString) {
    if (isPreview) {
      console.warn('Preview: Ignorando erro de query por falta de DATABASE_URL');
      return { rows: [], rowCount: 0 };
    }
    console.error('Tentativa de query sem DATABASE_URL configurada.');
    throw new Error('Database not configured');
  }

  try {
    return await pool.query(text, params);
  } catch (error) {
    if (isPreview && (error as any).code === 'ECONNREFUSED') {
      console.warn('Preview: Ignorando ECONNREFUSED no SSR');
      return { rows: [], rowCount: 0 };
    }
    
    console.error(`Erro na query SQL: ${text}`, error);
    // Se for erro de conexão, dá uma dica sobre o Easypanel
    if ((error as any).code === 'ECONNREFUSED' || (error as any).code === 'ENOTFOUND') {
      console.error('DICA: Verifique se o hostname do banco de dados está correto e acessível.');
    }
    throw error;
  }
};
