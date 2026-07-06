import { describe, expect, test } from "bun:test";
import { elegirSessionResolver } from "./sessionResolverSelector";
import type { PersistenciaSessionResolver } from "./modelPersistence";

const TOKEN_OK = "t".repeat(48);
const TOKEN_CORTO = "t".repeat(47);

function cookieResolverFalso(): PersistenciaSessionResolver {
  return {
    async resolve() {
      return { tenantId: "t-cookie", userId: "u-cookie", auth: true };
    },
  };
}

function reqConToken(token: string): Request {
  return new Request("https://x/__deep-opm/modelos", { headers: { authorization: `Bearer ${token}` } });
}

/**
 * Task 8 (Ola 1, revisión whole-branch): unit tests del selector puro que
 * reemplaza `construirSessionResolver()` en `scripts/model-persistence-api.ts`.
 * Cierra a la vez el hallazgo "sin test" (FIX 3) y bloquea la regresión del
 * hallazgo de identidad (FIX 2: `AGENT_IDENTITY === ":"` ya no habilita el
 * carril de token con tenantId/userId vacíos).
 */
describe("elegirSessionResolver", () => {
  test("sin token → cae al cookieResolver (misma referencia, fail-closed)", () => {
    const cookie = cookieResolverFalso();
    const habilitados: boolean[] = [];
    const resolver = elegirSessionResolver({ identity: "a:b" }, cookie, (h) => habilitados.push(h));
    expect(resolver).toBe(cookie);
    expect(habilitados).toEqual([false]);
  });

  test("token < 48 caracteres → cae al cookieResolver", () => {
    const cookie = cookieResolverFalso();
    const resolver = elegirSessionResolver({ token: TOKEN_CORTO, identity: "a:b" }, cookie);
    expect(resolver).toBe(cookie);
  });

  test("token válido + identidad 'a:b' → resolver encadenado, el token gana", async () => {
    const cookie = cookieResolverFalso();
    const habilitados: boolean[] = [];
    const resolver = elegirSessionResolver({ token: TOKEN_OK, identity: "a:b" }, cookie, (h) => habilitados.push(h));
    expect(resolver).not.toBe(cookie);
    const sesion = await resolver.resolve(reqConToken(TOKEN_OK));
    expect(sesion).toMatchObject({ tenantId: "a", userId: "b", auth: true });
    expect(habilitados).toEqual([true]);
  });

  test("token encadenado que no autentica cae a la cookie (comportamiento navegador intacto)", async () => {
    const cookie = cookieResolverFalso();
    const resolver = elegirSessionResolver({ token: TOKEN_OK, identity: "a:b" }, cookie);
    const sesion = await resolver.resolve(new Request("https://x/__deep-opm/modelos"));
    expect(sesion).toMatchObject({ tenantId: "t-cookie", userId: "u-cookie", auth: true });
  });

  test("token válido + identidad ':' (ambas partes vacías) → cae al cookieResolver (FIX 2)", () => {
    const cookie = cookieResolverFalso();
    const habilitados: boolean[] = [];
    const resolver = elegirSessionResolver({ token: TOKEN_OK, identity: ":" }, cookie, (h) => habilitados.push(h));
    expect(resolver).toBe(cookie);
    expect(habilitados).toEqual([false]);
  });

  test("token válido + identidad 'a:' (userId vacío) → cae al cookieResolver", () => {
    const cookie = cookieResolverFalso();
    const resolver = elegirSessionResolver({ token: TOKEN_OK, identity: "a:" }, cookie);
    expect(resolver).toBe(cookie);
  });

  test("token válido + identidad ':b' (tenantId vacío) → cae al cookieResolver", () => {
    const cookie = cookieResolverFalso();
    const resolver = elegirSessionResolver({ token: TOKEN_OK, identity: ":b" }, cookie);
    expect(resolver).toBe(cookie);
  });

  test("token válido + sin identidad → cae al cookieResolver", () => {
    const cookie = cookieResolverFalso();
    const resolver = elegirSessionResolver({ token: TOKEN_OK }, cookie);
    expect(resolver).toBe(cookie);
  });
});
