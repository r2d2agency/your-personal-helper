import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve, sep } from "node:path";
import { Readable } from "node:stream";

// Polyfill WebSocket for Node 22 if needed by Supabase
if (typeof WebSocket !== "undefined") {
  globalThis.WebSocket = WebSocket;
  global.WebSocket = WebSocket;
} else {
  try {
    const { WebSocket: WS } = await import("undici");
    globalThis.WebSocket = WS;
    global.WebSocket = WS;
  } catch (e) {
    console.warn("Could not polyfill WebSocket:", e.message);
  }
}

const rootDir = process.cwd();
const clientDir = resolve(rootDir, "dist/client");
const serverEntry = resolve(rootDir, "dist/server/index.js");
const host = process.env.HOST || "0.0.0.0";
const port = Number(process.env.PORT || 3000);

// ... keep existing code
const workerModule = await import(serverEntry);
const worker = workerModule.default;

// Inject project secrets into process.env if they are missing
if (!process.env.DATABASE_URL) {
  // We use the direct connection string for the server-side PG pool
  process.env.DATABASE_URL = "postgresql://postgres.mtthdfprwhvnwwjblwnr:4764345f-5138-4c11-aa10-34273efe43b9@aws-1-us-west-2.pooler.supabase.com:6543/postgres";
}

// These are still needed for the Supabase Auth client to work in the frontend/shared code
if (!process.env.SUPABASE_URL) {
  process.env.SUPABASE_URL = "https://mtthdfprwhvnwwjblwnr.supabase.co";
}
if (!process.env.SUPABASE_PUBLISHABLE_KEY) {
  process.env.SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dGhkZnByd2h2bnd3amJsd25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NjU4NDUsImV4cCI6MjA5NDU0MTg0NX0.lf3KYN8biKPuaP5CwgWcpC82jZXyZhoBf4Q0js4VjPI";
}

if (!worker || typeof worker.fetch !== "function") {
  console.error("O build do servidor não exporta um handler fetch válido.");
  process.exit(1);
}

createServer(async (req, res) => {
  try {
    if (tryServeStatic(req, res)) return;

    const response = await worker.fetch(toWebRequest(req), process.env, createExecutionContext());
    await sendWebResponse(res, response);
  } catch (error) {
    console.error("Erro no servidor de produção:", error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("content-type", "text/plain; charset=utf-8");
    }
    res.end("Erro interno do servidor");
  }
}).listen(port, host, () => {
  console.log(`Servidor de produção ativo em http://${host}:${port}`);
});