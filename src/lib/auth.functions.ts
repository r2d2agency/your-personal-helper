import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";

import { query } from "./db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "basmar_auth";
const JWT_SECRET = process.env.JWT_SECRET || process.env.DATABASE_URL || "change-me-in-production-please";

type JwtPayload = { sub: string; email: string; role: string };

let schemaReady: Promise<void> | null = null;
async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
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
    })();
  }
  return schemaReady;
}

function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

function setAuthCookie(token: string) {
  setCookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

function readToken(): JwtPayload | null {
  try {
    const token = getCookie(COOKIE_NAME);
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
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
  deleteCookie(COOKIE_NAME, { path: "/" });
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
