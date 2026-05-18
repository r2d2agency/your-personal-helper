const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
// Also try loading from root .env if it exists on Easypanel
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('sslmode=disable') ? false : { rejectUnauthorized: false },
});

async function runMigrations() {
  console.log("Iniciando migrações no PostgreSQL...");
  try {
    const schemaPath = fs.existsSync(path.join(__dirname, '../schema.sql'))
      ? path.join(__dirname, '../schema.sql')
      : path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(sql);
      console.log("Migrações concluídas com sucesso!");
    } else {
      console.warn("Arquivo schema.sql não encontrado.");
    }
  } catch (err) {
    console.error("Erro ao executar migrações:", err);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runMigrations().then(() => {
    if (process.env.START_HEALTH_SERVER === 'true') {
      const http = require('http');
      const port = process.env.PORT || 3001;
      http.createServer((_, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      }).listen(port, '0.0.0.0', () => console.log(`Backend ativo na porta ${port}`));
    }
  });
}

module.exports = { runMigrations };
