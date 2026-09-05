import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { Buffer } from "node:buffer";
import { HASH_SENUELO, verifyPassword } from "./passwordHash";
import { leerJsonRequest, responderJson, esRecord } from "./persistenceHttp";
import type { PersistenciaSesion, AuthOptions, PersistenciaSessionResolver } from "./modelPersistence";

export const COOKIE_NAME = "opforja_session";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

// Cookie autenticada más corta que la anónima (spec §2): 30 días, rotada por login.
const AUTH_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

interface TokenSesionFirmado {
  tenantId: string;
  userId: string;
  iat: number;
  exp: number;
  auth?: boolean;
  nonce?: string;
}

export function crearCookieSessionResolver(secret: string, cookieName = COOKIE_NAME): PersistenciaSessionResolver {
  return {
    async resolve(request) {
      const token = leerCookie(request.headers.get("cookie") ?? "", cookieName);
      const payload = token ? verificarTokenSesion(token, secret) : null;
      if (payload) return payload;
      const tenantId = `tenant-${randomBytes(16).toString("hex")}`;
      const userId = `user-${randomBytes(16).toString("hex")}`;
      const ahora = ahoraEpochSeconds();
      const firmado = firmarTokenSesion({ tenantId, userId, iat: ahora, exp: ahora + SESSION_MAX_AGE_SECONDS }, secret);
      const secure = esRequestSeguro(request) ? "; Secure" : "";
      return {
        tenantId,
        userId,
        setCookie: `${cookieName}=${firmado}; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}; HttpOnly; SameSite=Lax${secure}`,
      };
    },
  };
}

export function resolverSesionAnonima(): PersistenciaSessionResolver {
  return {
    async resolve() {
      return { tenantId: "tenant-test", userId: "user-test" };
    },
  };
}

function leerCookie(cookies: string, name: string): string | null {
  for (const part of cookies.split(";")) {
    const [rawName, ...rawValue] = part.trim().split("=");
    if (rawName === name) return rawValue.join("=") || null;
  }
  return null;
}

function esRequestSeguro(request: Request): boolean {
  if (request.headers.get("x-forwarded-proto") === "https") return true;
  const host = request.headers.get("host") ?? "";
  if (host && !host.startsWith("localhost") && !host.startsWith("127.0.0.1")) return true;
  try {
    return new URL(request.url).protocol === "https:";
  } catch {
    return false;
  }
}

export async function manejarLogin(request: Request, auth: AuthOptions, maxBodyBytes: number): Promise<Response> {
  let body: unknown;
  try {
    body = await leerJsonRequest(request, maxBodyBytes);
  } catch (error) {
    return responderJson(400, { error: error instanceof Error ? error.message : "JSON invalido" });
  }
  if (!esRecord(body) || typeof body.email !== "string" || typeof body.password !== "string") {
    return responderJson(400, { error: "Login invalido: email y password requeridos" });
  }
  const email = body.email.trim().toLowerCase();
  const cuenta = await auth.repo.getCuentaPorEmail(email);
  // Verificación SIEMPRE (señuelo si no hay cuenta): respuesta y costo uniformes,
  // sin oráculo de existencia de email (spec §3).
  const valida = verifyPassword(body.password, cuenta?.passwordHash ?? HASH_SENUELO);
  if (!cuenta || !valida) return responderJson(401, { error: "Credenciales inválidas" });

  const ahora = ahoraEpochSeconds();
  if (auth.repo.touchLogin) await auth.repo.touchLogin(cuenta.id, new Date(ahora * 1000).toISOString());
  const cookieName = auth.cookieName ?? COOKIE_NAME;
  const token = firmarTokenSesion({
    tenantId: cuenta.tenantId,
    userId: cuenta.userId,
    iat: ahora,
    exp: ahora + AUTH_SESSION_MAX_AGE_SECONDS,
    auth: true,
    // Rotación por login (spec §2): el nonce hace único cada token emitido.
    nonce: randomBytes(8).toString("hex"),
  }, auth.secret);
  const secure = esRequestSeguro(request) ? "; Secure" : "";
  const session: PersistenciaSesion = {
    tenantId: cuenta.tenantId,
    userId: cuenta.userId,
    auth: true,
    authKind: "operator",
    setCookie: `${cookieName}=${token}; Path=/; Max-Age=${AUTH_SESSION_MAX_AGE_SECONDS}; HttpOnly; SameSite=Lax${secure}`,
  };
  return responderJson(200, { session: { tenantId: session.tenantId, userId: session.userId, auth: true } }, session);
}

function firmarTokenSesion(payload: TokenSesionFirmado, secret: string): string {
  const encoded = base64UrlEncode(JSON.stringify(payload));
  return `${encoded}.${firma(encoded, secret)}`;
}

function verificarTokenSesion(token: string, secret: string): PersistenciaSesion | null {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  const expected = firma(encoded, secret);
  if (!compararConstante(signature, expected)) return null;
  try {
    const parsed = JSON.parse(base64UrlDecode(encoded));
    if (!esRecord(parsed) || typeof parsed.tenantId !== "string" || typeof parsed.userId !== "string") return null;
    if (typeof parsed.exp !== "number" || !Number.isFinite(parsed.exp)) return null;
    if (typeof parsed.iat !== "number" || !Number.isFinite(parsed.iat)) return null;
    if (parsed.exp <= ahoraEpochSeconds()) return null;
    return {
      tenantId: parsed.tenantId,
      userId: parsed.userId,
      ...(parsed.auth === true ? { auth: true, authKind: "operator" as const } : {}),
    };
  } catch {
    return null;
  }
}

function ahoraEpochSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

function firma(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function compararConstante(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}
