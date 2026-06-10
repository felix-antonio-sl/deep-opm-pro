# Auth/identidad v1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Identidad durable single-operator: login email+password obligatorio en prod sobre el handler de persistencia existente, con CLI de cuentas y adopción de tenants anónimos. Spec: `docs/specs/auth-identidad-v1.md`.

**Architecture:** Extiende `crearModelPersistenceFetchHandler` (compartido prod/dev/test) con endpoints `auth/login|logout` y gate `requireAuth`; la cookie HMAC `opforja_session` gana flag `auth`; Postgres gana migración 2 (accounts + membresía). Frontend: estado `requiereLogin` en el store + `PantallaLogin` bloqueante. Dev/unit/e2e existentes NO cambian (gate apagado por defecto); lane e2e `auth` nuevo con server dedicado.

**Tech Stack:** Bun 1.3 + TypeScript strict, scrypt `node:crypto` (cero deps nuevas), Zustand 5, Preact 10, Playwright, Postgres 16 (`Bun.SQL`).

**Convenciones del repo:** TDD estricto (bun test), comandos desde `app/`, commits `feat(...)`/`docs(...)` con co-author Claude. Gate mínimo por commit: `bun run check`.

---

### Task 1: Helper de password hashing (scrypt)

**Files:**
- Create: `app/src/server/passwordHash.ts`
- Test: `app/src/server/passwordHash.test.ts`

- [ ] **Step 1: Test que falla**

```ts
// app/src/server/passwordHash.test.ts
import { describe, expect, test } from "bun:test";
import { hashPassword, verifyPassword } from "./passwordHash";

describe("passwordHash — scrypt (auth v1)", () => {
  test("hash y verificación correcta", () => {
    const hash = hashPassword("secreto-claro");
    expect(hash.startsWith("scrypt$")).toBe(true);
    expect(verifyPassword("secreto-claro", hash)).toBe(true);
  });

  test("password incorrecta no verifica", () => {
    const hash = hashPassword("secreto-claro");
    expect(verifyPassword("otra", hash)).toBe(false);
  });

  test("salt aleatoria: dos hashes de la misma password difieren", () => {
    expect(hashPassword("x")).not.toBe(hashPassword("x"));
  });

  test("hash malformado no verifica ni lanza", () => {
    expect(verifyPassword("x", "")).toBe(false);
    expect(verifyPassword("x", "argon2$lo-que-sea")).toBe(false);
    expect(verifyPassword("x", "scrypt$16384$8$1$basura")).toBe(false);
  });
});
```

- [ ] **Step 2: Verificar RED** — `cd app && bun test src/server/passwordHash.test.ts` → falla por módulo ausente.

- [ ] **Step 3: Implementación mínima**

```ts
// app/src/server/passwordHash.ts
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

// scrypt de node:crypto: uniforme Bun/Node (el middleware dev de Vite puede
// correr bajo Node; Bun.password/argon2id no verificaría allí). Spec D2.
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
    const calculado = scryptSync(password, salt, esperado.length, { N: n, r, p });
    return esperado.length > 0 && timingSafeEqual(calculado, esperado);
  } catch {
    return false;
  }
}

/**
 * Hash señuelo para igualar el costo cuando el email no existe (respuesta
 * uniforme "Credenciales inválidas" sin oráculo de timing). Spec §3.
 */
export const HASH_SENUELO = hashPassword(randomBytes(16).toString("hex"));
```

- [ ] **Step 4: Verificar GREEN** — `bun test src/server/passwordHash.test.ts` → 4 pass.
- [ ] **Step 5: Commit** — `git add app/src/server/passwordHash.ts app/src/server/passwordHash.test.ts && git commit -m "feat(auth): helper scrypt de password hashing (spec D2)"`

---

### Task 2: Cookie con flag `auth`, endpoints login/logout y gate `requireAuth` en el handler

**Files:**
- Modify: `app/src/server/modelPersistence.ts`
- Test: `app/src/server/modelPersistenceAuth.test.ts` (nuevo)
- Modify: `app/src/server/repoMemoria.ts` (auth repo en memoria, lo usan los tests)

- [ ] **Step 1: Tests que fallan** (archivo nuevo completo)

```ts
// app/src/server/modelPersistenceAuth.test.ts
import { describe, expect, test } from "bun:test";
import {
  crearCookieSessionResolver,
  crearModelPersistenceFetchHandler,
} from "./modelPersistence";
import { crearAuthRepoMemoria, crearRepoMemoria } from "./repoMemoria";

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
  test("login correcto devuelve sesión del tenant de la cuenta y cookie auth", async () => {
    const handler = crearHandlerAuth();
    const response = await login(handler, "felix@opforja.local", "clave-correcta");
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.session).toMatchObject({ tenantId: "tenant-felix", userId: "user-felix", auth: true });
    expect(cookieDe(response)).toStartWith("opforja_session=");
    expect(response.headers.get("set-cookie")).toContain("Max-Age=2592000"); // 30d
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
      expect(response.headers.get("set-cookie")).toBeNull(); // no acuña tenants anónimos
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

  test("con cookie auth las rutas funcionan bajo el tenant de la cuenta", async () => {
    const handler = crearHandlerAuth();
    const cookie = cookieDe(await login(handler, "felix@opforja.local", "clave-correcta"));
    const session = await handler(new Request(`${BASE}/__deep-opm/session`, { headers: { cookie } }));
    expect(session.status).toBe(200);
    expect((await session.json()).session.tenantId).toBe("tenant-felix");

    const guardar = await handler(new Request(`${BASE}/__deep-opm/modelos`, {
      method: "POST",
      headers: { "content-type": "application/json", cookie },
      body: JSON.stringify({ modelo: { id: "m-1", nombre: "M", creadoEn: "2026-06-10", actualizadoEn: "2026-06-10", json: "{}" } }),
    }));
    expect(guardar.status).toBe(200);
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
    expect(response.status).toBe(200); // resolver anónimo acuña tenant como hoy
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
```

Nota: la rotación usa token aleatorio → incluir `nonce` aleatorio en el payload firmado del login (ver Step 3).

- [ ] **Step 2: Verificar RED** — `bun test src/server/modelPersistenceAuth.test.ts` → falla (`crearAuthRepoMemoria`/`auth` no existen).

- [ ] **Step 3: Implementación**

3a. En `app/src/server/repoMemoria.ts`, al final, añadir:

```ts
import type { AuthRepository, CuentaAuth } from "./modelPersistence";
import { hashPassword } from "./passwordHash";

export interface CuentaSeedMemoria {
  email: string;
  password: string;
  tenantId: string;
  userId: string;
}

/** Auth repo en memoria para tests y para el dev server con MODEL_REQUIRE_AUTH. */
export function crearAuthRepoMemoria(seeds: CuentaSeedMemoria[]): AuthRepository {
  const cuentas: CuentaAuth[] = seeds.map((seed, i) => ({
    id: `acc-${i}`,
    email: seed.email.trim().toLowerCase(),
    passwordHash: hashPassword(seed.password),
    userId: seed.userId,
    tenantId: seed.tenantId,
  }));
  return {
    async getCuentaPorEmail(email) {
      return cuentas.find((cuenta) => cuenta.email === email) ?? null;
    },
  };
}
```

3b. En `app/src/server/modelPersistence.ts`:

- `PersistenciaSesion`: añadir `auth?: boolean;` (tras `userId`).
- Nuevos tipos exportados (junto a `ModelPersistenceRepository`):

```ts
export interface CuentaAuth {
  id: string;
  email: string;
  passwordHash: string;
  userId: string;
  tenantId: string;
}

export interface AuthRepository {
  /** email ya normalizado (lowercase+trim). null si no existe. */
  getCuentaPorEmail(email: string): Promise<CuentaAuth | null>;
  touchLogin?(accountId: string, fecha: string): Promise<void>;
}

export interface AuthOptions {
  repo: AuthRepository;
  /** Mismo MODEL_SESSION_SECRET con el que se firman las cookies. */
  secret: string;
  cookieName?: string;
  /** true ⇒ 401 en toda ruta de persistencia sin sesión autenticada (spec D3). */
  requireAuth?: boolean;
}
```

- `ModelPersistenceOptions`: añadir `auth?: AuthOptions;`.
- Constantes: `const AUTH_LOGIN_ENDPOINT = "/__deep-opm/auth/login"; const AUTH_LOGOUT_ENDPOINT = "/__deep-opm/auth/logout"; const AUTH_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;`
- En el handler, tras el bloque `/healthz` y ANTES del cálculo de `esRutaPersistencia`:

```ts
    if (options.auth && request.method === "POST" && url.pathname === AUTH_LOGIN_ENDPOINT) {
      return manejarLogin(request, options.auth, maxBodyBytes);
    }
    if (options.auth && request.method === "POST" && url.pathname === AUTH_LOGOUT_ENDPOINT) {
      const cookieName = options.auth.cookieName ?? COOKIE_NAME;
      return responderJson(200, { ok: true }, {
        tenantId: "", userId: "",
        setCookie: `${cookieName}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`,
      });
    }
```

- Gate, inmediatamente después de `const session = await sessionResolver.resolve(request);`:

```ts
    if (options.auth?.requireAuth && session.auth !== true) {
      // 401 sin session ⇒ sin Set-Cookie: bajo login obligatorio no se acuñan
      // tenants anónimos (spec D3/§2).
      return responderJson(401, { error: "No autenticado" });
    }
```

- `manejarLogin` (función nueva al nivel de los helpers):

```ts
import { hashPassword as _noUsar, HASH_SENUELO, verifyPassword } from "./passwordHash";
// (importar solo { HASH_SENUELO, verifyPassword })

async function manejarLogin(request: Request, auth: AuthOptions, maxBodyBytes: number): Promise<Response> {
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
  // Verificación SIEMPRE (señuelo si no hay cuenta): respuesta y costo uniformes.
  const valida = verifyPassword(body.password, cuenta?.passwordHash ?? HASH_SENUELO);
  if (!cuenta || !valida) return responderJson(401, { error: "Credenciales inválidas" });

  if (auth.repo.touchLogin) await auth.repo.touchLogin(cuenta.id, new Date().toISOString());
  const cookieName = auth.cookieName ?? COOKIE_NAME;
  const token = firmarTokenSesion({
    tenantId: cuenta.tenantId,
    userId: cuenta.userId,
    auth: true,
    nonce: randomBytes(8).toString("hex"), // rotación por login
  }, auth.secret);
  const secure = esRequestSeguro(request) ? "; Secure" : "";
  const session: PersistenciaSesion = {
    tenantId: cuenta.tenantId,
    userId: cuenta.userId,
    auth: true,
    setCookie: `${cookieName}=${token}; Path=/; Max-Age=${AUTH_SESSION_MAX_AGE_SECONDS}; HttpOnly; SameSite=Lax${secure}`,
  };
  return responderJson(200, { session: { tenantId: session.tenantId, userId: session.userId, auth: true } }, session);
}
```

- `firmarTokenSesion`/`verificarTokenSesion`: ampliar payload — firma acepta `{ tenantId, userId, auth?: boolean, nonce?: string }`; verificación propaga `auth` solo si es `true`:

```ts
function firmarTokenSesion(payload: { tenantId: string; userId: string; auth?: boolean; nonce?: string }, secret: string): string { /* igual */ }

// en verificarTokenSesion, el return pasa a:
    return {
      tenantId: parsed.tenantId,
      userId: parsed.userId,
      ...(parsed.auth === true ? { auth: true } : {}),
    };
```

- `GET /session` cuando hay auth: incluir el flag en la respuesta (cambiar la línea existente):

```ts
        return responderJson(200, { session: { tenantId: session.tenantId, userId: session.userId, ...(session.auth ? { auth: true } : {}) } }, session);
```

- [ ] **Step 4: Verificar GREEN** — `bun test src/server/modelPersistenceAuth.test.ts src/server/modelPersistence.test.ts` → todo verde (el archivo viejo no cambia de comportamiento: sin `auth` el handler es idéntico).
- [ ] **Step 5: `bun run check`** (suite completa) → 0 fail.
- [ ] **Step 6: Commit** — `feat(auth): endpoints login/logout + gate requireAuth en el handler compartido (spec §2-§3)`

---

### Task 3: Cliente backend — estado de sesión con `requiere-login`

**Files:**
- Modify: `app/src/persistencia/backend.ts`
- Test: `app/src/persistencia/backend.test.ts` (añadir describe)

- [ ] **Step 1: Tests que fallan** (añadir al final de `backend.test.ts`; seguir el patrón de mock de `fetch` ya usado en ese archivo — si no existe mock previo, usar este patrón):

```ts
import { afterEach, describe, expect, test } from "bun:test";
import { cerrarSesionBackend, iniciarSesionBackend, obtenerEstadoSesionBackend } from "./backend";

function mockFetch(status: number, body: unknown): void {
  (globalThis as Record<string, unknown>).window = {};
  globalThis.fetch = (async () => new Response(JSON.stringify(body), { status })) as typeof fetch;
}

describe("auth v1 — cliente de sesión", () => {
  afterEach(() => {
    delete (globalThis as Record<string, unknown>).window;
  });

  test("obtenerEstadoSesionBackend: 200 ⇒ autenticada", async () => {
    mockFetch(200, { session: { tenantId: "t", userId: "u", auth: true } });
    const estado = await obtenerEstadoSesionBackend();
    expect(estado).toEqual({ estado: "autenticada", session: { tenantId: "t", userId: "u" } });
  });

  test("obtenerEstadoSesionBackend: 401 ⇒ requiere-login", async () => {
    mockFetch(401, { error: "No autenticado" });
    expect(await obtenerEstadoSesionBackend()).toEqual({ estado: "requiere-login" });
  });

  test("iniciarSesionBackend: 401 ⇒ error con mensaje del backend", async () => {
    mockFetch(401, { error: "Credenciales inválidas" });
    const resultado = await iniciarSesionBackend("a@b.c", "x");
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) expect(resultado.error).toBe("Credenciales inválidas");
  });

  test("iniciarSesionBackend: 200 ⇒ sesión", async () => {
    mockFetch(200, { session: { tenantId: "t", userId: "u", auth: true } });
    const resultado = await iniciarSesionBackend("a@b.c", "x");
    expect(resultado.ok).toBe(true);
  });

  test("cerrarSesionBackend: 200 ⇒ ok", async () => {
    mockFetch(200, { ok: true });
    expect((await cerrarSesionBackend()).ok).toBe(true);
  });
});
```

- [ ] **Step 2: Verificar RED.**
- [ ] **Step 3: Implementación** (en `backend.ts`, junto a `obtenerSesionBackend`, que se conserva):

```ts
const AUTH_LOGIN_ENDPOINT = "/__deep-opm/auth/login";
const AUTH_LOGOUT_ENDPOINT = "/__deep-opm/auth/logout";

export type EstadoSesionBackend =
  | { estado: "autenticada"; session: SesionBackend }
  | { estado: "requiere-login" }
  | { estado: "error"; error: string };

/** Bootstrap auth-aware: distingue 401 (login obligatorio, spec §4) de caída del backend. */
export async function obtenerEstadoSesionBackend(): Promise<EstadoSesionBackend> {
  if (!persistenciaBackendHabilitada()) return { estado: "error", error: "Persistencia backend no disponible" };
  try {
    const response = await fetch(SESSION_ENDPOINT, { method: "GET" });
    if (response.status === 401) return { estado: "requiere-login" };
    const body = await leerJson(response);
    if (!response.ok) return { estado: "error", error: errorDesdeBody(body) ?? "No se pudo iniciar sesión de workspace" };
    const session = sesionDesdeBody(body);
    if (!session) return { estado: "error", error: "Respuesta de sesión inválida" };
    return { estado: "autenticada", session };
  } catch {
    return { estado: "error", error: "No se pudo conectar al backend de modelos" };
  }
}

export async function iniciarSesionBackend(email: string, password: string): Promise<Resultado<SesionBackend>> {
  if (!persistenciaBackendHabilitada()) return fallo("Persistencia backend no disponible");
  try {
    const response = await fetch(AUTH_LOGIN_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const body = await leerJson(response);
    if (!response.ok) return fallo(errorDesdeBody(body) ?? "No se pudo iniciar sesión");
    const session = sesionDesdeBody(body);
    if (!session) return fallo("Respuesta de sesión inválida");
    return ok(session);
  } catch {
    return fallo("No se pudo conectar al backend de modelos");
  }
}

export async function cerrarSesionBackend(): Promise<Resultado<void>> {
  if (!persistenciaBackendHabilitada()) return fallo("Persistencia backend no disponible");
  try {
    const response = await fetch(AUTH_LOGOUT_ENDPOINT, { method: "POST" });
    if (!response.ok) return fallo("No se pudo cerrar la sesión");
    return ok(undefined);
  } catch {
    return fallo("No se pudo conectar al backend de modelos");
  }
}
```

- [ ] **Step 4: Verificar GREEN + `bun run check`.**
- [ ] **Step 5: Commit** — `feat(auth): cliente de sesión auth-aware (estado requiere-login, login, logout)`

---

### Task 4: Store — `requiereLogin` + acciones `iniciarSesion`/`cerrarSesion`

**Files:**
- Modify: `app/src/store/tipos.ts` (interface `OpmStore`, junto a los campos de persistencia)
- Modify: `app/src/store/persistencia.ts` (slice; `sincronizarListadoBackend` en `:478`)
- Test: `app/src/store/auth.test.ts` (nuevo)

- [ ] **Step 1: Tests que fallan**

```ts
// app/src/store/auth.test.ts
import { afterEach, describe, expect, test } from "bun:test";
import { store } from "../store";

function mockFetch(rutas: Record<string, { status: number; body: unknown }>): void {
  (globalThis as Record<string, unknown>).window = {};
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url = String(input);
    const match = Object.entries(rutas).find(([ruta]) => url.includes(ruta));
    const { status, body } = match?.[1] ?? { status: 404, body: { error: "no mock" } };
    return new Response(JSON.stringify(body), { status });
  }) as typeof fetch;
}

describe("store auth v1", () => {
  afterEach(() => {
    delete (globalThis as Record<string, unknown>).window;
    store.setState({ requiereLogin: false });
  });

  test("iniciarSesion con credenciales malas deja requiereLogin y mensaje", async () => {
    mockFetch({ "/auth/login": { status: 401, body: { error: "Credenciales inválidas" } } });
    store.setState({ requiereLogin: true });
    await store.getState().iniciarSesion("a@b.c", "mala");
    expect(store.getState().requiereLogin).toBe(true);
    expect(store.getState().mensaje).toContain("Credenciales");
  });

  test("iniciarSesion correcta limpia requiereLogin", async () => {
    mockFetch({
      "/auth/login": { status: 200, body: { session: { tenantId: "t", userId: "u", auth: true } } },
      "/session": { status: 200, body: { session: { tenantId: "t", userId: "u", auth: true } } },
      "/modelos": { status: 200, body: { modelos: [] } },
      "/workspace": { status: 200, body: { indice: { modelos: [], carpetas: [], recientes: [] } } },
    });
    store.setState({ requiereLogin: true });
    await store.getState().iniciarSesion("a@b.c", "buena");
    expect(store.getState().requiereLogin).toBe(false);
  });

  test("cerrarSesion vuelve a requiereLogin", async () => {
    mockFetch({ "/auth/logout": { status: 200, body: { ok: true } } });
    await store.getState().cerrarSesion();
    expect(store.getState().requiereLogin).toBe(true);
  });
});
```

- [ ] **Step 2: Verificar RED.**
- [ ] **Step 3: Implementación**

3a. `app/src/store/tipos.ts` — en `OpmStore` (sección persistencia, cerca de `modelosGuardados`):

```ts
  /** Auth v1 (spec §4): true ⇒ el backend exige login; la UI monta PantallaLogin. */
  requiereLogin: boolean;
  iniciarSesion: (email: string, password: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;
```

3b. `app/src/store/persistencia.ts`:
- Importar `cerrarSesionBackend, iniciarSesionBackend, obtenerEstadoSesionBackend` desde `../persistencia/backend`.
- Estado inicial del slice: `requiereLogin: false,`.
- Acciones (dentro del slice, junto a las demás):

```ts
  async iniciarSesion(email, password) {
    const resultado = await iniciarSesionBackend(email.trim(), password);
    if (!resultado.ok) {
      set({ mensaje: resultado.error });
      return;
    }
    set({ requiereLogin: false, mensaje: null });
    sincronizarListadoBackend(set, get);
  },

  async cerrarSesion() {
    await cerrarSesionBackend();
    // Pase lo que pase con la red, la sesión local se considera cerrada.
    set({ requiereLogin: true, modelosGuardados: [], modelosRecientes: [] });
  },
```

- `sincronizarListadoBackend` (línea ~478): anteponer el chequeo de estado:

```ts
function sincronizarListadoBackend(set: SetStore, get: GetStore): void {
  if (!persistenciaBackendHabilitada()) return;
  void obtenerEstadoSesionBackend().then((estadoSesion) => {
    if (estadoSesion.estado === "requiere-login") {
      set({ requiereLogin: true, modelosGuardados: [] });
      return null;
    }
    if (estadoSesion.estado === "error") {
      set({ modelosGuardados: [], mensaje: estadoSesion.error });
      return null;
    }
    return Promise.all([listarModelosBackend(), cargarWorkspaceBackend()]);
  }).then((resultados) => {
    if (!resultados) return;
    const [modelosResultado, workspaceResultado] = resultados;
    // ... (cuerpo existente sin cambios desde `if (!modelosResultado.ok)`)
  }).catch(() => {
    set({ modelosGuardados: [], mensaje: "No se pudo conectar al backend de modelos" });
  });
}
```

- [ ] **Step 4: Verificar GREEN + `bun run check`.** OJO lección W6.5: si algún test siembra y commitea, resetear `activarReadOnly(false)` — aquí no aplica (no se commitea modelo), pero `store.setState` residual debe limpiarse en `afterEach`.
- [ ] **Step 5: Commit** — `feat(auth): estado requiereLogin + acciones iniciarSesion/cerrarSesion en el store`

---

### Task 5: PantallaLogin + gate en App

**Files:**
- Create: `app/src/ui/PantallaLogin.tsx`
- Test: `app/src/ui/PantallaLogin.test.tsx` (contrato estructural, patrón SeccionApariciones)
- Modify: `app/src/App.tsx` (gate de render; localizar el return del workbench)

- [ ] **Step 1: Test contrato que falla**

```tsx
// app/src/ui/PantallaLogin.test.tsx
import { describe, expect, test } from "bun:test";
import { PantallaLogin } from "./PantallaLogin";

/**
 * Contrato estructural (patrón SeccionApariciones): la lógica vive en el store
 * (auth.test.ts) y el flujo UI completo en e2e/auth.spec.ts.
 */
describe("PantallaLogin contrato", () => {
  test("export es función componente sin props", () => {
    expect(typeof PantallaLogin).toBe("function");
    expect(<PantallaLogin />).toBeDefined();
  });
});
```

- [ ] **Step 2: Verificar RED.**
- [ ] **Step 3: Componente** (tokens ui-forja, estilo de formularios del Inspector):

```tsx
// app/src/ui/PantallaLogin.tsx
// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useState } from "preact/hooks";
import { useOpmStore } from "../store";
import { tokens } from "./tokens";

/**
 * Auth v1 (spec §4): login obligatorio. Bloquea el workbench completo cuando
 * el backend responde 401. Registro cerrado: sin signup ni recuperación
 * self-service (las cuentas las administra el operador por CLI).
 */
export function PantallaLogin() {
  const iniciarSesion = useOpmStore((s) => s.iniciarSesion);
  const mensaje = useOpmStore((s) => s.mensaje);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enviando, setEnviando] = useState(false);

  const enviar = async (event: Event) => {
    event.preventDefault();
    if (!email.trim() || !password || enviando) return;
    setEnviando(true);
    try {
      await iniciarSesion(email, password);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={loginStyles.fondo} data-testid="pantalla-login">
      <form style={loginStyles.tarjeta} onSubmit={(event) => { void enviar(event); }}>
        <span class="opm-label-uppercase" style={loginStyles.kicker}>opforja</span>
        <h1 style={loginStyles.titulo}>Iniciar sesión</h1>
        <label style={loginStyles.label}>
          Email
          <input
            type="email"
            autocomplete="username"
            data-testid="login-email"
            style={loginStyles.input}
            value={email}
            onInput={(event) => setEmail(event.currentTarget.value)}
          />
        </label>
        <label style={loginStyles.label}>
          Contraseña
          <input
            type="password"
            autocomplete="current-password"
            data-testid="login-password"
            style={loginStyles.input}
            value={password}
            onInput={(event) => setPassword(event.currentTarget.value)}
          />
        </label>
        {mensaje ? <p style={loginStyles.error} data-testid="login-error" role="alert">{mensaje}</p> : null}
        <button type="submit" style={loginStyles.boton} data-testid="login-submit" disabled={!email.trim() || !password || enviando}>
          {enviando ? "Entrando…" : "Entrar"}
        </button>
        <p style={loginStyles.nota}>Acceso por invitación. Las cuentas las administra el operador.</p>
      </form>
    </div>
  );
}

const loginStyles = {
  fondo: {
    position: "fixed" as const,
    inset: 0,
    display: "grid",
    placeItems: "center",
    background: tokens.colors.paper,
    zIndex: 1000,
  },
  tarjeta: {
    display: "grid",
    gap: `${tokens.spacing.md}px`,
    width: "min(360px, 90vw)",
    padding: `${tokens.spacing.xl}px`,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.paper,
  },
  kicker: { color: tokens.colors.ink50 },
  titulo: {
    margin: 0,
    fontFamily: tokens.typography.familySerif,
    fontSize: `${tokens.typography.sizes.xl}px`,
    color: tokens.colors.ink,
  },
  label: {
    display: "grid",
    gap: `${tokens.spacing.xs}px`,
    color: tokens.colors.ink,
    fontSize: `${tokens.typography.sizes.base}px`,
  },
  input: {
    padding: "8px 10px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    outlineColor: tokens.colors.focus,
    caretColor: tokens.colors.accent,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    fontFamily: tokens.typography.familyChrome,
    fontSize: `${tokens.typography.sizes.base}px`,
  },
  error: { margin: 0, color: tokens.colors.accent, fontSize: `${tokens.typography.sizes.base}px` },
  boton: {
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.ink,
    color: tokens.colors.paper,
    cursor: "pointer",
    padding: `${tokens.spacing.sm}px`,
    fontSize: `${tokens.typography.sizes.base}px`,
  },
  nota: { margin: 0, color: tokens.colors.ink50, fontSize: `${tokens.typography.sizes.xxs}px` },
} satisfies Record<string, preact.JSX.CSSProperties>;
```

NOTA de ejecución: verificar nombres exactos de tokens (`familySerif`, `sizes.xl`, `radii.sm`, `spacing.xl`) contra `app/src/ui/tokens.ts`; usar los equivalentes reales si difieren. Debe pasar `bun run design:governance`.

3b. `app/src/App.tsx` — dentro del componente `App`, después de los hooks y ANTES del return del workbench:

```tsx
  const requiereLogin = useOpmStore((s) => s.requiereLogin);
  if (requiereLogin) return <PantallaLogin />;
```

(con `import { PantallaLogin } from "./ui/PantallaLogin";`). Si `App.tsx` ya selecciona del store con un selector compuesto, añadir el campo ahí siguiendo el patrón local. El early-return debe ir DESPUÉS de todos los hooks (regla de hooks).

- [ ] **Step 4: Verificar GREEN + `bun run check` + `bun run design:governance`.**
- [ ] **Step 5: Commit** — `feat(auth): PantallaLogin bloqueante + gate requiereLogin en App`

---

### Task 6: "Cerrar sesión" en CommandPalette

**Files:**
- Modify: `app/src/ui/CommandPalette.tsx` (lista de acciones-menu ~`:546`, shape `{ id, label, descripcion, categoria, run }`)
- Modify: el componente que inyecta `deps` a `construirAccionesMenuCommandPalette` (localizar con `rg -n "copiarLogDecisiones" app/src/ui/`)

- [ ] **Step 1**: Añadir a la lista de acciones (junto a los exportadores):

```ts
    { id: "auth-cerrar-sesion", label: "Cerrar sesión", descripcion: "Cerrar la sesión de esta cuenta y volver a la pantalla de login", categoria: "archivo", run: deps.cerrarSesion },
```

y en la interface de `deps` del mismo archivo: `cerrarSesion: () => void;`. En el caller que arma `deps` (mismo lugar donde se inyecta `copiarLogDecisiones`): `cerrarSesion: () => { void useOpmStore.getState().cerrarSesion(); },` (adaptar al patrón real del caller — puede ser `store.getState()`).

- [ ] **Step 2**: `bun run check` (typecheck obliga a que el dep esté inyectado en todos los call-sites).
- [ ] **Step 3: Commit** — `feat(auth): comando de paleta Cerrar sesión`

---

### Task 7: Dev middleware con auth opcional por env (lane e2e)

**Files:**
- Modify: `app/src/server/devModelPersistence.ts`

- [ ] **Step 1: Implementación** (sin test unit propio: la conducta queda cubierta por el lane e2e de Task 9; el middleware es wiring fino sobre el handler ya testeado):

```ts
import { crearAuthRepoMemoria, crearRepoMemoria } from "./repoMemoria";

/** Cuenta sembrada del lane e2e auth (MODEL_REQUIRE_AUTH=true en el dev server). */
export const CUENTA_DEV_AUTH = {
  email: "dev@opforja.local",
  password: "opforja-dev-password",
  tenantId: "tenant-auth-dev",
  userId: "user-auth-dev",
} as const;

export function instalarModelPersistenceDevMiddleware(middlewares: ConnectMiddlewares): void {
  const requireAuth = process.env.MODEL_REQUIRE_AUTH === "true";
  const handler = crearModelPersistenceFetchHandler({
    repo: crearRepoMemoria(),
    sessionResolver: crearCookieSessionResolver(SECRETO_SESION_DEV),
    ...(requireAuth
      ? {
        auth: {
          repo: crearAuthRepoMemoria([CUENTA_DEV_AUTH]),
          secret: SECRETO_SESION_DEV,
          requireAuth: true,
        },
      }
      : {}),
  });
  // ... resto idéntico
}
```

Añadir a `RUTAS_PERSISTENCIA`: `"/__deep-opm/auth"`.

- [ ] **Step 2**: `bun run check`; arrancar `MODEL_REQUIRE_AUTH=true bun run dev` y verificar a mano: `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5173/__deep-opm/session` → 401; login con la cuenta sembrada → 200.
- [ ] **Step 3: Commit** — `feat(auth): dev middleware con gate por MODEL_REQUIRE_AUTH y cuenta sembrada`

---

### Task 8: Prod — migración 2, auth repo Postgres y wiring del model-api

**Files:**
- Modify: `app/scripts/model-persistence-api.ts`

- [ ] **Step 1: Migración 2** (añadir a `MIGRACIONES_SCHEMA` tras la versión 1):

```ts
  {
    version: 2,
    nombre: "auth_identidad",
    async run(db: typeof sql) {
      await db`
        CREATE TABLE IF NOT EXISTS opforja_accounts (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL,
          password_hash TEXT NOT NULL,
          user_id TEXT NOT NULL REFERENCES opforja_users(id),
          creado_en TEXT NOT NULL,
          ultimo_login_en TEXT
        )
      `;
      await db`CREATE UNIQUE INDEX IF NOT EXISTS opforja_accounts_email_idx ON opforja_accounts (email)`;
      await db`
        CREATE TABLE IF NOT EXISTS opforja_account_tenants (
          account_id TEXT NOT NULL REFERENCES opforja_accounts(id) ON DELETE CASCADE,
          tenant_id TEXT NOT NULL REFERENCES opforja_tenants(id) ON DELETE CASCADE,
          rol TEXT NOT NULL DEFAULT 'owner',
          creado_en TEXT NOT NULL,
          PRIMARY KEY (account_id, tenant_id)
        )
      `;
    },
  },
```

- [ ] **Step 2: Auth repo Postgres** (junto al repo de modelos):

```ts
import type { AuthRepository } from "../src/server/modelPersistence";

const authRepoPostgres: AuthRepository = {
  async getCuentaPorEmail(email) {
    const rows = await sql`
      SELECT a.id, a.email, a.password_hash, a.user_id, m.tenant_id
      FROM opforja_accounts a
      JOIN opforja_account_tenants m ON m.account_id = a.id
      WHERE a.email = ${email}
      ORDER BY m.creado_en ASC
      LIMIT 1
    `;
    const row = rows[0];
    if (!row) return null;
    return {
      id: String(row.id),
      email: String(row.email),
      passwordHash: String(row.password_hash),
      userId: String(row.user_id),
      tenantId: String(row.tenant_id),
    };
  },
  async touchLogin(accountId, fecha) {
    await sql`UPDATE opforja_accounts SET ultimo_login_en = ${fecha} WHERE id = ${accountId}`;
  },
};
```

- [ ] **Step 3: Wiring** — donde se construye el handler:

```ts
// Fail-closed: en prod el gate está activo salvo opt-out explícito (rollback spec §7).
const REQUIRE_AUTH = process.env.MODEL_REQUIRE_AUTH !== "false";

const handler = crearModelPersistenceFetchHandler({
  repo,                       // el repo Postgres existente
  sessionResolver: crearCookieSessionResolver(SESSION_SECRET),
  auth: { repo: authRepoPostgres, secret: SESSION_SECRET, requireAuth: REQUIRE_AUTH },
});
```

- [ ] **Step 4**: `bun run check` (typecheck cubre el script) + commit — `feat(auth): migración 2 + auth repo Postgres + gate fail-closed en model-api`

---

### Task 9: CLI de cuentas

**Files:**
- Create: `app/scripts/auth-cuenta.ts`
- Modify: `app/package.json` (script `"auth:cuenta": "bun run scripts/auth-cuenta.ts"`)

- [ ] **Step 1: Implementación** (sin unit test: script operativo sobre Postgres real; la lógica criptográfica ya está testeada en Task 1; verificación manual en Step 2):

```ts
// app/scripts/auth-cuenta.ts
// CLI de administración de cuentas (auth v1, spec §5). Registro cerrado: las
// cuentas SOLO se crean aquí. Uso (con DATABASE_URL):
//   bun run auth:cuenta crear <email> [--tenant <tenant-id>]
//   bun run auth:cuenta reset <email>
//   bun run auth:cuenta listar
// En el servidor: docker exec -e DATABASE_URL=... -it opforja-model-api bun run scripts/auth-cuenta.ts ...
import { randomBytes } from "node:crypto";
import { hashPassword } from "../src/server/passwordHash";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL requerido");
  process.exit(1);
}
const sql = new Bun.SQL(DATABASE_URL);

async function leerPassword(prompt: string): Promise<string> {
  process.stdout.write(`${prompt}: `);
  for await (const line of console) {
    const valor = line.trim();
    if (valor.length >= 8) return valor;
    process.stdout.write("Mínimo 8 caracteres. Reintenta: ");
  }
  throw new Error("stdin cerrado sin password");
}

function normalizarEmail(email: string): string {
  const normalizado = email.trim().toLowerCase();
  if (!normalizado.includes("@")) throw new Error(`Email inválido: ${email}`);
  return normalizado;
}

async function crear(emailArg: string, tenantFlag: string | null): Promise<void> {
  const email = normalizarEmail(emailArg);
  const existente = await sql`SELECT id FROM opforja_accounts WHERE email = ${email}`;
  if (existente.length > 0) throw new Error(`Ya existe cuenta para ${email}`);

  const ahora = new Date().toISOString();
  const accountId = `acc-${randomBytes(8).toString("hex")}`;
  const userId = `user-${randomBytes(16).toString("hex")}`;
  let tenantId = tenantFlag;

  if (tenantId) {
    const tenant = await sql`SELECT id FROM opforja_tenants WHERE id = ${tenantId}`;
    if (tenant.length === 0) throw new Error(`Tenant no existe: ${tenantId} (adopción imposible)`);
  } else {
    tenantId = `tenant-${randomBytes(16).toString("hex")}`;
  }

  const passwordHash = hashPassword(await leerPassword(`Password para ${email}`));
  await sql.begin(async (tx) => {
    if (!tenantFlag) await tx`INSERT INTO opforja_tenants (id, creado_en) VALUES (${tenantId}, ${ahora})`;
    await tx`INSERT INTO opforja_users (id, tenant_id, creado_en) VALUES (${userId}, ${tenantId}, ${ahora})`;
    await tx`
      INSERT INTO opforja_accounts (id, email, password_hash, user_id, creado_en)
      VALUES (${accountId}, ${email}, ${passwordHash}, ${userId}, ${ahora})
    `;
    await tx`
      INSERT INTO opforja_account_tenants (account_id, tenant_id, rol, creado_en)
      VALUES (${accountId}, ${tenantId}, 'owner', ${ahora})
    `;
  });
  console.log(`Cuenta creada: ${email} → tenant ${tenantId}${tenantFlag ? " (ADOPTADO)" : ""}`);
}

async function reset(emailArg: string): Promise<void> {
  const email = normalizarEmail(emailArg);
  const rows = await sql`SELECT id FROM opforja_accounts WHERE email = ${email}`;
  if (rows.length === 0) throw new Error(`No existe cuenta para ${email}`);
  const passwordHash = hashPassword(await leerPassword(`Nueva password para ${email}`));
  await sql`UPDATE opforja_accounts SET password_hash = ${passwordHash} WHERE email = ${email}`;
  console.log(`Password reseteada: ${email}`);
}

async function listar(): Promise<void> {
  const rows = await sql`
    SELECT a.email, m.tenant_id, a.creado_en, a.ultimo_login_en
    FROM opforja_accounts a
    LEFT JOIN opforja_account_tenants m ON m.account_id = a.id
    ORDER BY a.creado_en ASC
  `;
  if (rows.length === 0) { console.log("(sin cuentas)"); return; }
  for (const row of rows) {
    console.log(`${row.email}\t${row.tenant_id}\tcreada=${row.creado_en}\tlogin=${row.ultimo_login_en ?? "—"}`);
  }
}

const [comando, emailArg] = Bun.argv.slice(2);
const tenantIdx = Bun.argv.indexOf("--tenant");
const tenantFlag = tenantIdx > -1 ? Bun.argv[tenantIdx + 1] ?? null : null;

try {
  if (comando === "crear" && emailArg) await crear(emailArg, tenantFlag);
  else if (comando === "reset" && emailArg) await reset(emailArg);
  else if (comando === "listar") await listar();
  else {
    console.error("Uso: auth:cuenta crear <email> [--tenant <id>] | reset <email> | listar");
    process.exit(1);
  }
  process.exit(0);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
```

- [ ] **Step 2: Verificación local contra Postgres efímero** (opcional si no hay Docker local; obligatorio antes del deploy):

```bash
docker run -d --rm --name pg-auth-test -e POSTGRES_PASSWORD=test -p 54329:5432 postgres:16-alpine
# levantar model-api una vez para aplicar migraciones, o aplicar el SQL de la migración 2 a mano
DATABASE_URL=postgres://postgres:test@127.0.0.1:54329/postgres bun run auth:cuenta listar
docker stop pg-auth-test
```

- [ ] **Step 3: Commit** — `feat(auth): CLI auth:cuenta (crear/reset/listar + adopción de tenant)`

---

### Task 10: Lane e2e `auth`

**Files:**
- Modify: `app/playwright.config.ts`
- Create: `app/e2e/auth.spec.ts`

- [ ] **Step 1: Config** — tercer webServer y project (espejo del patrón mobile):

```ts
const PORT_AUTH = String(Number(PORT) + 2);
const BASE_URL_AUTH = `http://127.0.0.1:${PORT_AUTH}`;
const AUTH_SPEC = /auth\.spec\.ts/;
```

- webServer añadido: `{ command: \`MODEL_REQUIRE_AUTH=true bun run dev --host 127.0.0.1 --port ${PORT_AUTH} --strictPort\`, url: \`${BASE_URL_AUTH}/\`, reuseExistingServer: true, timeout: 60_000 }`.
- project añadido: `{ name: "auth", testMatch: AUTH_SPEC, use: { ...devices["Desktop Chrome"], baseURL: BASE_URL_AUTH } }`.
- project `chromium`: `testIgnore: [MOBILE_SPEC, AUTH_SPEC]` (array).

- [ ] **Step 2: Spec e2e**

```ts
// app/e2e/auth.spec.ts
import { expect, test } from "@playwright/test";

// Lane auth v1: corre contra el dev server con MODEL_REQUIRE_AUTH=true
// (cuenta sembrada CUENTA_DEV_AUTH en devModelPersistence.ts).
const EMAIL = "dev@opforja.local";
const PASSWORD = "opforja-dev-password";

test("sin sesión la app monta PantallaLogin, no el workbench", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("pantalla-login")).toBeVisible();
  await expect(page.getByTestId("canvas-pane")).toHaveCount(0);
});

test("credenciales inválidas muestran error uniforme y no entran", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("login-email").fill(EMAIL);
  await page.getByTestId("login-password").fill("incorrecta");
  await page.getByTestId("login-submit").click();
  await expect(page.getByTestId("login-error")).toContainText("Credenciales inválidas");
  await expect(page.getByTestId("pantalla-login")).toBeVisible();
});

test("login correcto entra al workbench con persistencia viva y logout vuelve al login", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("login-email").fill(EMAIL);
  await page.getByTestId("login-password").fill(PASSWORD);
  await page.getByTestId("login-submit").click();

  await expect(page.getByTestId("canvas-pane")).toBeVisible();
  // La sesión quedó autenticada a nivel API:
  const status = await page.evaluate(async () => (await fetch("/__deep-opm/session")).status);
  expect(status).toBe(200);

  // Logout por paleta:
  await page.keyboard.press(process.platform === "darwin" ? "Meta+k" : "Control+k");
  await page.getByPlaceholder(/comando/i).fill("cerrar sesión");
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("pantalla-login")).toBeVisible();
});

test("la cookie sobrevive recarga (sesión durable)", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("login-email").fill(EMAIL);
  await page.getByTestId("login-password").fill(PASSWORD);
  await page.getByTestId("login-submit").click();
  await expect(page.getByTestId("canvas-pane")).toBeVisible();
  await page.reload();
  await expect(page.getByTestId("canvas-pane")).toBeVisible();
  await expect(page.getByTestId("pantalla-login")).toHaveCount(0);
});
```

NOTA de ejecución: el atajo/placeholder reales de la paleta se verifican contra `e2e/12-command-palette.spec.ts` y se ajusta el test a los helpers existentes (`ejecutarComandoPalette` de `_smoke-helpers` si aplica).

- [ ] **Step 3: Correr el lane** — `bunx playwright test --project=auth` → 4/4. Después `bun run browser:smoke` completo → paridad de chromium/mobile intacta.
- [ ] **Step 4: Commit** — `feat(auth): lane e2e auth con server dedicado MODEL_REQUIRE_AUTH`

---

### Task 11: Compose + documentación de operación

**Files:**
- Modify: `docker-compose.yml` (servicio `model-api`, junto a `MODEL_SESSION_SECRET`): `MODEL_REQUIRE_AUTH: "true"`
- Modify: `docs/deploy/opforja.md` — nueva sección "## Cuentas y login (auth v1)": crear cuenta del operador, adopción de tenant anónimo (cómo encontrar el tenant: `SELECT tenant_id, COUNT(*) FROM opforja_models GROUP BY 1`), reset, rollback `MODEL_REQUIRE_AUTH=false`.
- Modify: `docs/HANDOFF.md` — entrada del corte + actualizar "Instancia pública sin auth perimetral" en Riesgos + Frentes abiertos #2.
- Modify: `docs/specs/auth-identidad-v1.md` — marcar estado implementado.

- [ ] **Step 1**: Editar los 4 archivos.
- [ ] **Step 2: Gate completo** — `bun run gate:refactor` + `bunx playwright test --project=auth`.
- [ ] **Step 3: Commit + push** — `feat(auth): corte auth/identidad v1 — compose, docs y gate` (consolidar si los commits previos ya pushearon).

---

### Task 12: Deploy coordinado (requiere al operador)

**No automatizable completo**: la password de la cuenta se ingresa por stdin.

- [ ] 1. `docker compose up -d --build` (aplica migración 2 sola; `MODEL_REQUIRE_AUTH=true` queda activo).
- [ ] 2. Verificar: raíz 200, `/__deep-opm/session` → **401**, healthz 200, PantallaLogin visible in-vivo.
- [ ] 3. Operador: identificar su tenant valioso (`docker exec opforja-postgres psql -U opforja -c "SELECT tenant_id, COUNT(*) FROM opforja_models GROUP BY 1"`), luego `docker exec -it opforja-model-api bun run scripts/auth-cuenta.ts crear <su-email> --tenant <tenant-id>` e ingresar password.
- [ ] 4. Login in-vivo → su workspace aparece; verificar literales del bundle.
- [ ] 5. HANDOFF: registrar DESPLEGADO; riesgo "instancia pública sin auth" se cierra.

---

## Self-review (hecho al escribir)

- **Cobertura spec**: §1→Task 8 (migración), §2→Task 2 (cookie/rotación/30d), §3→Task 2 (endpoints+gate+uniformidad), §4→Tasks 3-6 (cliente/store/UI/logout), §5→Task 9 (CLI+adopción), §6→Tasks 1-5,10 (unit+e2e), §7→Tasks 11-12 (deploy/rollback). Migración 2 "idempotente" (spec §6): cubierta por `IF NOT EXISTS` + sistema de versiones existente; sin test unit de SQL (sin Postgres en unit) — verificación en deploy (Task 12.1), anotado.
- **Placeholders**: ninguno; los dos puntos de adaptación (tokens de PantallaLogin, helper de paleta en e2e) están marcados como NOTA de ejecución con la referencia exacta a verificar.
- **Consistencia de tipos**: `AuthRepository.getCuentaPorEmail` (Tasks 2/3a/8), `CuentaAuth.{id,email,passwordHash,userId,tenantId}` (2/8), `requiereLogin/iniciarSesion/cerrarSesion` (4/5/6), `CUENTA_DEV_AUTH` (7/10) — alineados.
