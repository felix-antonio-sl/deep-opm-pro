import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

// scrypt de node:crypto: uniforme Bun/Node (el middleware dev de Vite puede
// correr bajo Node; Bun.password/argon2id no verificaría allí). Spec D2 de
// docs/specs/auth-identidad-v1.md.
const N = 16384;
const R = 8;
const P = 1;
const KEYLEN = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, KEYLEN, { N, r: R, p: P });
  return `scrypt$${N}$${R}$${P}$${salt.toString("base64url")}$${hash.toString("base64url")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const partes = stored.split("$");
  if (partes.length !== 6 || partes[0] !== "scrypt") return false;
  const n = Number(partes[1]);
  const r = Number(partes[2]);
  const p = Number(partes[3]);
  if (!Number.isInteger(n) || !Number.isInteger(r) || !Number.isInteger(p)) return false;
  try {
    const salt = Buffer.from(partes[4]!, "base64url");
    const esperado = Buffer.from(partes[5]!, "base64url");
    if (esperado.length === 0) return false;
    const calculado = scryptSync(password, salt, esperado.length, { N: n, r, p });
    return timingSafeEqual(calculado, esperado);
  } catch {
    return false;
  }
}

/**
 * Hash señuelo para igualar el costo cuando el email no existe (respuesta
 * uniforme "Credenciales inválidas" sin oráculo de timing). Spec §3.
 */
export const HASH_SENUELO = hashPassword(randomBytes(16).toString("hex"));
