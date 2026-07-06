import { describe, expect, test } from "bun:test";
import { crearResolverEncadenado, crearTokenSessionResolver } from "./tokenSessionResolver";
import type { PersistenciaSessionResolver } from "./modelPersistence";

const TOKEN = "a".repeat(48);
const IDENT = { token: TOKEN, tenantId: "t-op", userId: "u-op" };

function req(headers: Record<string, string> = {}): Request {
  return new Request("https://x/__deep-opm/session", { headers });
}

describe("crearTokenSessionResolver", () => {
  test("Bearer correcto → sesión autenticada del operador", async () => {
    const r = crearTokenSessionResolver(IDENT);
    const s = await r.resolve(req({ authorization: `Bearer ${TOKEN}` }));
    expect(s).toMatchObject({ tenantId: "t-op", userId: "u-op", auth: true });
  });
  test("nunca emite setCookie", async () => {
    const r = crearTokenSessionResolver(IDENT);
    const s = await r.resolve(req({ authorization: `Bearer ${TOKEN}` }));
    expect(s.setCookie).toBeUndefined();
  });
  test("token incorrecto → sesión sin auth (no autentica)", async () => {
    const r = crearTokenSessionResolver(IDENT);
    const s = await r.resolve(req({ authorization: `Bearer ${"b".repeat(48)}` }));
    expect(s.auth).not.toBe(true);
  });
  test("sin header → sesión sin auth", async () => {
    const r = crearTokenSessionResolver(IDENT);
    const s = await r.resolve(req());
    expect(s.auth).not.toBe(true);
  });
  test("header malformado (sin Bearer) → sin auth", async () => {
    const r = crearTokenSessionResolver(IDENT);
    const s = await r.resolve(req({ authorization: TOKEN }));
    expect(s.auth).not.toBe(true);
  });
});

describe("crearResolverEncadenado", () => {
  const cookieFake: PersistenciaSessionResolver = {
    async resolve() {
      return { tenantId: "t-cookie", userId: "u-cookie", auth: true, setCookie: "c=1" };
    },
  };
  test("token autentica → gana sobre cookie", async () => {
    const chain = crearResolverEncadenado([crearTokenSessionResolver(IDENT), cookieFake]);
    const s = await chain.resolve(req({ authorization: `Bearer ${TOKEN}` }));
    expect(s.tenantId).toBe("t-op");
  });
  test("token no autentica → cae a la cookie (comportamiento navegador intacto)", async () => {
    const chain = crearResolverEncadenado([crearTokenSessionResolver(IDENT), cookieFake]);
    const s = await chain.resolve(req());
    expect(s.tenantId).toBe("t-cookie");
    expect(s.setCookie).toBe("c=1");
  });
});
