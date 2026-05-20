import { createServerFn } from "@tanstack/react-start";
import { query } from "./db";
import bcrypt from "bcryptjs";
import { readToken, signToken, setAuthCookie, deleteAuthCookie } from "./auth-utils.server";

let schemaReady: Promise<void> | null = null;
async function ensureSchema() {
  // No preview do Lovable, evitamos tentar criar o schema se não houver conexão
  const connectionString = process.env.DATABASE_URL || "";
  const isPreview = !connectionString || connectionString.includes('127.0.0.1') || connectionString.includes('localhost');

  if (isPreview) return;

  if (!schemaReady) {
    schemaReady = (async () => {
      try {
        await query(`
          CREATE TABLE IF NOT EXISTS admin_users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            full_name TEXT,
            role TEXT NOT NULL DEFAULT 'admin',
            created_at TIMESTAMPTZ NOT NULL DEFAULT now()
          );
        `);
      } catch (e) {
        console.warn('Erro ao criar schema (ignorado):', e.message);
        schemaReady = null;
      }
    })();
  }
  return schemaReady;
}

export const signUp = createServerFn({ method: "POST" })
  .inputValidator((d: { email: string; password: string; fullName?: string; role?: string }) => d)
  .handler(async ({ data }) => {
    await ensureSchema();
    const email = data.email.trim().toLowerCase();
    if (!email || !data.password || data.password.length < 6) {
      throw new Error("Email e senha (mín. 6 caracteres) são obrigatórios");
    }
    const existing = await query("SELECT id FROM admin_users WHERE email = $1", [email]);
    if (existing.rowCount && existing.rowCount > 0) {
      throw new Error("Já existe um usuário com este email");
    }
    const hash = await bcrypt.hash(data.password, 10);
    const role = data.role || "admin";
    const { rows } = await query(
      "INSERT INTO admin_users (email, password_hash, full_name, role) VALUES ($1,$2,$3,$4) RETURNING id, email, role, full_name",
      [email, hash, data.fullName || null, role]
    );
    const user = rows[0];
    const token = signToken({ sub: user.id, email: user.email, role: user.role });
    setAuthCookie(token);
    return { user };
  });

export const signIn = createServerFn({ method: "POST" })
  .inputValidator((d: { email: string; password: string }) => d)
  .handler(async ({ data }) => {
    await ensureSchema();
    const email = data.email.trim().toLowerCase();
    const { rows } = await query(
      "SELECT id, email, password_hash, role, full_name FROM admin_users WHERE email = $1",
      [email]
    );
    if (!rows.length) throw new Error("Credenciais inválidas");
    const user = rows[0];
    const ok = await bcrypt.compare(data.password, user.password_hash);
    if (!ok) throw new Error("Credenciais inválidas");
    const token = signToken({ sub: user.id, email: user.email, role: user.role });
    setAuthCookie(token);
    return { user: { id: user.id, email: user.email, role: user.role, full_name: user.full_name } };
  });

export const signOut = createServerFn({ method: "POST" }).handler(async () => {
  deleteAuthCookie();
  return { ok: true };
});

export const getMe = createServerFn({ method: "GET" }).handler(async () => {
  const payload = readToken();
  if (!payload) return { user: null };
  await ensureSchema();
  const { rows } = await query(
    "SELECT id, email, role, full_name FROM admin_users WHERE id = $1",
    [payload.sub]
  );
  return { user: rows[0] || null };
});

export const listAdmins = createServerFn({ method: "GET" }).handler(async () => {
  const payload = readToken();
  if (!payload) throw new Error("Não autenticado");
  await ensureSchema();
  const { rows } = await query(
    "SELECT id, email, role, full_name, created_at FROM admin_users ORDER BY created_at DESC"
  );
  return rows;
});

export function requireAuth() {
  const payload = readToken();
  if (!payload) throw new Error("Não autenticado");
  return payload;
}
