import { describe, expect, test } from "bun:test";
import { createHmac } from "node:crypto";
import { Buffer } from "node:buffer";
import {
  crearCookieSessionResolver,
  crearModelPersistenceFetchHandler,
} from "./modelPersistence";
import { crearAuthRepoMemoria, crearRepoMemoria } from "./repoMemoria";
import {
  encodeSessionIdentity,
  SESSION_IDENTITY_HEADER,
} from "../persistencia/sessionIdentity";

// Auth v1 (spec §2-§3): login/logout + gate requireAuth sobre el handler
// compartido. Sin `auth` en options el handler es BYTE-equivalente al actual
// (modelPersistence.test.ts defiende esa base).

const SECRET = "secret-de-test-suficientemente-largo-0123456789";
const BASE = "http://localhost";

function crearHandlerAuth(requireAuth = true) {
  return crearModelPersistenceFetchHandler({
    repo: crearRepoMemoria(),
    sessionResolver: crearCookieSessionResolver(SECRET),
    auth: {
      repo: crearAuthRepoMemoria([
        { email: "felix@opforja.local", password: "clave-correcta", tenantId: "tenant-felix", userId: "user-felix" },
      ]),
      secret: SECRET,
      requireAuth,
    },
  });
}

function cookieDe(response: Response): string {
  const setCookie = response.headers.get("set-cookie") ?? "";
  return setCookie.split(";")[0] ?? "";
}

async function login(handler: (r: Request) => Promise<Response>, email: string, password: string): Promise<Response> {
  return handler(new Request(`${BASE}/__deep-opm/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  }));
}

describe("auth v1 — login/logout y gate requireAuth", () => {
  test("login correcto devuelve sesión del tenant de la cuenta y cookie auth de 30d", async () => {
    const handler = crearHandlerAuth();
    const response = await login(handler, "felix@opforja.local", "clave-correcta");
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.session).toMatchObject({ tenantId: "tenant-felix", userId: "user-felix", auth: true });
    expect(cookieDe(response)).toStartWith("opforja_session=");
    expect(response.headers.get("set-cookie")).toContain("Max-Age=2592000");
  });

  test("email normaliza lowercase/trim", async () => {
    const handler = crearHandlerAuth();
    const response = await login(handler, "  FELIX@opforja.local ", "clave-correcta");
    expect(response.status).toBe(200);
  });

  test("password incorrecta y email inexistente responden 401 uniforme", async () => {
    const handler = crearHandlerAuth();
    const mala = await login(handler, "felix@opforja.local", "incorrecta");
    const fantasma = await login(handler, "nadie@opforja.local", "lo-que-sea");
    expect(mala.status).toBe(401);
    expect(fantasma.status).toBe(401);
    expect((await mala.json()).error).toBe("Credenciales inválidas");
    expect((await fantasma.json()).error).toBe("Credenciales inválidas");
  });

  test("gate: sin cookie auth toda ruta de persistencia responde 401 sin Set-Cookie", async () => {
    const handler = crearHandlerAuth();
    for (const ruta of ["/__deep-opm/session", "/__deep-opm/workspace", "/__deep-opm/modelos"]) {
      const response = await handler(new Request(`${BASE}${ruta}`));
      expect(response.status).toBe(401);
      expect(response.headers.get("set-cookie")).toBeNull();
    }
  });

  test("gate: cookie anónima vieja (sin flag auth) queda invalidada", async () => {
    const sinAuth = crearModelPersistenceFetchHandler({
      repo: crearRepoMemoria(),
      sessionResolver: crearCookieSessionResolver(SECRET),
    });
    const anonima = await sinAuth(new Request(`${BASE}/__deep-opm/session`));
    expect(anonima.status).toBe(200);
    const cookieAnonima = cookieDe(anonima);

    const handler = crearHandlerAuth();
    const response = await handler(new Request(`${BASE}/__deep-opm/session`, { headers: { cookie: cookieAnonima } }));
    expect(response.status).toBe(401);
  });

  test("gate: cookie auth expirada server-side queda invalidada aunque la firma sea valida", async () => {
    const handler = crearHandlerAuth();
    const tokenExpirado = firmarTokenTest({
      tenantId: "tenant-felix",
      userId: "user-felix",
      auth: true,
      iat: 1_700_000_000,
      exp: 1_700_000_001,
    });

    const response = await handler(new Request(`${BASE}/__deep-opm/session`, {
      headers: { cookie: `opforja_session=${tokenExpirado}` },
    }));

    expect(response.status).toBe(401);
  });

  test("con cookie auth las rutas funcionan bajo el tenant de la cuenta", async () => {
    const handler = crearHandlerAuth();
    const cookie = cookieDe(await login(handler, "felix@opforja.local", "clave-correcta"));
    const session = await handler(new Request(`${BASE}/__deep-opm/session`, { headers: { cookie } }));
    expect(session.status).toBe(200);
    expect((await session.json()).session.tenantId).toBe("tenant-felix");

    const guardar = await handler(new Request(`${BASE}/__deep-opm/modelos`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie,
        [SESSION_IDENTITY_HEADER]: encodeSessionIdentity({
          tenantId: "tenant-felix",
          userId: "user-felix",
        }),
      },
      body: JSON.stringify({ modelo: { id: "m-1", nombre: "M", creadoEn: "2026-06-10", actualizadoEn: "2026-06-10", json: "{}" } }),
    }));
    expect(guardar.status).toBe(200);
  });

  test("rechaza antes de leer o escribir cuando la cookie no coincide con la sesión observada", async () => {
    const repo = crearRepoMemoria();
    const handler = crearModelPersistenceFetchHandler({
      repo,
      sessionResolver: crearCookieSessionResolver(SECRET),
      auth: {
        repo: crearAuthRepoMemoria([
          { email: "felix@opforja.local", password: "clave-correcta", tenantId: "tenant-felix", userId: "user-felix" },
        ]),
        secret: SECRET,
        requireAuth: true,
      },
    });
    const cookie = cookieDe(await login(handler, "felix@opforja.local", "clave-correcta"));
    const response = await handler(new Request(`${BASE}/__deep-opm/modelos`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie,
        [SESSION_IDENTITY_HEADER]: encodeSessionIdentity({
          tenantId: "otro-tenant",
          userId: "otro-user",
        }),
      },
      body: JSON.stringify({
        modelo: {
          id: "m-no-debe-guardarse",
          nombre: "M",
          creadoEn: "2026-07-18T00:00:00.000Z",
          actualizadoEn: "2026-07-18T00:00:00.000Z",
          json: "{}",
        },
      }),
    }));

    expect(response.status).toBe(401);
    expect((await response.json()).error).toContain("identidad de sesión cambió");
    expect(await repo.get(
      { tenantId: "tenant-felix", userId: "user-felix" },
      "m-no-debe-guardarse",
    )).toBeNull();
  });

  test("logout expira la cookie y el gate vuelve a 401", async () => {
    const handler = crearHandlerAuth();
    const cookie = cookieDe(await login(handler, "felix@opforja.local", "clave-correcta"));
    const logout = await handler(new Request(`${BASE}/__deep-opm/auth/logout`, { method: "POST", headers: { cookie } }));
    expect(logout.status).toBe(200);
    expect(logout.headers.get("set-cookie")).toContain("Max-Age=0");
  });

  test("rotación: dos logins emiten tokens distintos", async () => {
    const handler = crearHandlerAuth();
    const c1 = cookieDe(await login(handler, "felix@opforja.local", "clave-correcta"));
    const c2 = cookieDe(await login(handler, "felix@opforja.local", "clave-correcta"));
    expect(c1).not.toBe(c2);
  });

  test("healthz sigue público bajo requireAuth", async () => {
    const handler = crearHandlerAuth();
    expect((await handler(new Request(`${BASE}/healthz`))).status).toBe(200);
  });

  test("requireAuth=false conserva el comportamiento anónimo actual", async () => {
    const handler = crearHandlerAuth(false);
    const response = await handler(new Request(`${BASE}/__deep-opm/session`));
    expect(response.status).toBe(200);
  });

  test("login con body inválido responde 400", async () => {
    const handler = crearHandlerAuth();
    const response = await handler(new Request(`${BASE}/__deep-opm/auth/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: 5 }),
    }));
    expect(response.status).toBe(400);
  });
});

function firmarTokenTest(payload: Record<string, unknown>): string {
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = createHmac("sha256", SECRET).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}
