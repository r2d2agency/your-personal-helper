// Arquivo para compatibilidade com o EasyPanel
console.log("Iniciando backend...");
require('dotenv').config({ path: './.env' });
console.log("Variáveis de ambiente carregadas.");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Definida" : "Não definida");
