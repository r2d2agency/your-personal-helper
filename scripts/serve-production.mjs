import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve, sep } from "node:path";
import { Readable } from "node:stream";

const rootDir = process.cwd();
const clientDir = resolve(rootDir, "dist/client");
const serverEntry = resolve(rootDir, "dist/server/index.js");
const host = process.env.HOST || "0.0.0.0";
const port = Number(process.env.PORT || 3000);

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".gif", "image/gif"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

function getStaticFilePath(url) {
  const pathname = decodeURIComponent(new URL(url, "http://localhost").pathname);
  const normalizedPath = normalize(pathname).replace(/^[/\\]+/, "");
  const filePath = resolve(clientDir, normalizedPath);
  return filePath === clientDir || filePath.startsWith(`${clientDir}${sep}`) ? filePath : undefined;
}

function tryServeStatic(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") return false;

  const filePath = getStaticFilePath(req.url || "/");
  if (!filePath || !existsSync(filePath)) return false;

  const stats = statSync(filePath);
  if (!stats.isFile()) return false;

  res.statusCode = 200;
  res.setHeader("content-type", mimeTypes.get(extname(filePath)) || "application/octet-stream");
  res.setHeader("content-length", stats.size);
  if (filePath.includes(`${sep}assets${sep}`)) {
    res.setHeader("cache-control", "public, max-age=31536000, immutable");
  }

  if (req.method === "HEAD") {
    res.end();
    return true;
  }

  createReadStream(filePath).pipe(res);
  return true;
}

function createExecutionContext() {
  return {
    waitUntil(promise) {
      Promise.resolve(promise).catch((error) => console.error("waitUntil error:", error));
    },
    passThroughOnException() {},
  };
}

function toWebRequest(req) {
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const hostHeader = req.headers.host || `localhost:${port}`;
  const url = `${protocol}://${hostHeader}${req.url || "/"}`;
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) {
      for (const item of value) headers.append(key, item);
    } else if (value !== undefined) {
      headers.set(key, value);
    }
  }

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  return new Request(url, {
    method: req.method,
    headers,
    body: hasBody ? Readable.toWeb(req) : undefined,
    duplex: hasBody ? "half" : undefined,
  });
}

async function sendWebResponse(res, webResponse) {
  res.statusCode = webResponse.status;
  res.statusMessage = webResponse.statusText;
  webResponse.headers.forEach((value, key) => res.setHeader(key, value));

  if (!webResponse.body) {
    res.end();
    return;
  }

  Readable.fromWeb(webResponse.body).pipe(res);
}

if (!existsSync(serverEntry)) {
  console.error(`Build do servidor não encontrado em ${serverEntry}. Execute npm run build antes de iniciar.`);
  process.exit(1);
}

const workerModule = await import(serverEntry);
const worker = workerModule.default;

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