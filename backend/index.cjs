const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
// Also try loading from root .env if it exists on Easypanel (for both root and sub-folder deploys)
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("ERRO: A variável de ambiente DATABASE_URL não foi encontrada.");
  console.log("Certifique-se de configurar o DATABASE_URL no EasyPanel.");
  process.exit(0); // Sai silenciosamente para não travar o build, mas avisa o erro
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1') ? false : { rejectUnauthorized: false },
});

async function runMigrations() {
  console.log("Iniciando migrações no PostgreSQL...");
  try {
    // Check local directory first (for sub-folder deploy)
    let schemaPath = path.join(__dirname, 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      // Fallback to parent directory (for root deploy)
      schemaPath = path.join(__dirname, '../schema.sql');
    }
    
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(sql);
      console.log("Migrações concluídas com sucesso!");
    } else {
      console.warn("Arquivo schema.sql não encontrado em:", schemaPath);
    }
  } catch (err) {

    console.error("Erro ao executar migrações:", err);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runMigrations().then(() => {
    if (process.env.START_HEALTH_SERVER === 'true' || true) { // Force for now to ensure we have a backend listening
      const http = require('http');
      const port = process.env.PORT || 3001;
      http.createServer((req, res) => {
        // Simple health check and allow host message
        if (req.url === '/health') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ ok: true }));
        }
        
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Backend is running. Use /health for check.');
      }).listen(port, '0.0.0.0', () => console.log(`Backend ativo na porta ${port}`));
    }
  });
}

module.exports = { runMigrations };
