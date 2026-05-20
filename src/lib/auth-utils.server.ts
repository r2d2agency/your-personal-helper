import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "basmar_auth";
const JWT_SECRET = process.env.JWT_SECRET || process.env.DATABASE_URL || "change-me-in-production-please";

type JwtPayload = { sub: string; email: string; role: string };

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function setAuthCookie(token: string) {
  setCookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function deleteAuthCookie() {
  deleteCookie(COOKIE_NAME, { path: "/" });
}

export function readToken(): JwtPayload | null {
  try {
    const token = getCookie(COOKIE_NAME);
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}
