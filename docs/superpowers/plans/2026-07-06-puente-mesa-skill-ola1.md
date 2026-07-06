# Puente directo mesa↔skill — Ola 1 (A′-motor) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que la skill `modelamiento-opm` lea y escriba el estado de un modelo de opforja directo contra el backend, autenticada por token de agente, sin que el humano copie bytes a mano — por el camino headless (sin UI).

**Architecture:** Se extiende el handler de persistencia existente (`crearModelPersistenceFetchHandler`) con un resolver de sesión por token Bearer encadenado al de cookies (punto de inyección `options.sessionResolver` ya existe). Un CLI nuevo (`app/scripts/mesa-cli.ts`, Bun) habla con la API por HTTP reusando el generador de contexto puro `exportarContextoSkill` y el deserializador `hidratarModelo`. Todo lo del kernel es función pura, testeable sin red. La UI (chip, historial) NO entra en esta ola.

**Tech Stack:** Bun 1.3+, TypeScript strict, `node:crypto` (timingSafeEqual), el handler `fetch`-nativo del repo, Bun test runner.

## Global Constraints

- Lenguaje: español (es-CL) en dominio OPM, prosa y copy; inglés en identificadores de infraestructura. Comandos de shell en inglés.
- **Ningún flag booleano de especie nuevo** en persistencia (guardia dura del comité): el inventario `{esApunte, esBiblioteca}` es invariante; un 3er discriminante obligaría a migrar a `especie` discriminado ANTES. Este plan no agrega ninguno.
- Gate mínimo antes de cada commit: `cd app && bun run check` (typecheck + unit) verde.
- Fail-closed: sin `MODEL_AGENT_TOKEN` en el env, el carril de token queda deshabilitado (no acuña identidad).
- El resolver de token produce `{ tenantId, userId, auth: true }` — el `auth: true` es obligatorio o el gate `requireAuth` responde 401.
- El resolver de token NO emite `setCookie` ni acuña tenants anónimos.
- Comparación de token en **tiempo constante** (`crypto.timingSafeEqual`), nunca `===`.
- TDD estricto: test que falla → implementación mínima → verde → commit.
- Reuso obligatorio (no reimplementar): `exportarContextoSkill` (`app/src/opl/contextoSkill.ts`), `hidratarModelo` (`app/src/serializacion/json.ts`), tipos de sesión de `app/src/server/modelPersistence.ts`.

---

## File Structure

- `app/src/persistencia/especie.ts` — **nuevo**. Selector puro `especieDe()` + tipo `Especie`. Fundación consumida por CLI (y luego gestor/graduación). Concentra el decode de especie en un punto (mata el O(N²) del comité).
- `app/src/persistencia/especie.test.ts` — **nuevo**. Ley de las 3 especies + invariante de exclusión.
- `app/src/server/tokenSessionResolver.ts` — **nuevo**. `crearTokenSessionResolver` + `crearResolverEncadenado`. Aislado del handler para test unitario sin levantar servidor.
- `app/src/server/tokenSessionResolver.test.ts` — **nuevo**. Token válido/malformado/ausente + encadenamiento + `auth:true` + sin setCookie.
- `app/scripts/model-persistence-api.ts` — **modificar** (~línea 344): encadenar el resolver de token antes del de cookie cuando el env lo define.
- `app/src/mesa/contextoPull.ts` — **nuevo**. Lógica pura del pull: elegir base (autosave-vs-guardado) + componer encabezado de especie/fuente sobre `exportarContextoSkill`. Sin red.
- `app/src/mesa/contextoPull.test.ts` — **nuevo**. Criterio exacto de base + encabezado + ley de determinismo del generador.
- `app/src/mesa/validarPush.ts` — **nuevo**. Lógica pura del push: validar bundle (vía `hidratarModelo`), carril por procedencia (sello), gate de base ratificada, decisión crear-vs-actualizar. Sin red.
- `app/src/mesa/validarPush.test.ts` — **nuevo**. Las leyes de push (inválido, procedencia, base ratificada, especie).
- `app/scripts/mesa-cli.ts` — **nuevo**. El CLI de 3 verbos: arma HTTP (token + URL), llama a la lógica pura, imprime. Capa delgada de I/O.
- `app/src/mesa/roundtrip.test.ts` — **nuevo**. Leyes counit y clausura contra `devModelPersistence`/repo en memoria.
- `docs/solicitudes-upstream/2026-07-06-skill-v112-puente-directo.md` — **nuevo** (Task 0, día 0). Solicitud al custodio para la skill v1.12.0 + enmienda SSOT del bottom-up.

---

## Task 0: Solicitud upstream día 0 (skill v1.12.0 + enmienda SSOT)

Se eleva PRIMERO para que la firma del custodio madure en paralelo con el build. No bloquea las tareas de código de esta ola (la skill es HITL del custodio; el código del puente no la necesita para funcionar).

**Files:**
- Create: `docs/solicitudes-upstream/2026-07-06-skill-v112-puente-directo.md`

- [ ] **Step 1: Escribir la solicitud**

Contenido: pide a custodio-kora (a) skill `modelamiento-opm` v1.12.0 — camino primario `mesa pull`→trabajar→`mesa push`, reglas pull-antes-de-push / nunca push sin validación verde / respetar 409 / sobre base no-ratificada pedir confirmación / nota con procedencia; W6.0 portapapeles como fallback declarado; receta bottom-up-por-apuntes; (b) la enmienda SSOT del bottom-up de primera clase (metodología + spec-opd §10/§12) de la spec `2026-07-06-apuntes-taller-design.md` §5. Cita las specs por ruta. Estado: ABIERTA, HITL custodio.

- [ ] **Step 2: Commit**

```bash
git add docs/solicitudes-upstream/2026-07-06-skill-v112-puente-directo.md
git commit -m "docs(upstream): elevar skill v1.12.0 + enmienda SSOT bottom-up (día 0)"
```

---

## Task 1: Fundación `especieDe()`

**Files:**
- Create: `app/src/persistencia/especie.ts`
- Test: `app/src/persistencia/especie.test.ts`

**Interfaces:**
- Consumes: `ResumenModeloPersistido` de `app/src/persistencia/modelos.ts` (tiene `esApunte?: boolean`, `esBiblioteca?: boolean`).
- Produces: `type Especie = 'apunte' | 'modelo' | 'biblioteca'` y `especieDe(record: { esApunte?: boolean; esBiblioteca?: boolean }): Especie`.

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, expect, test } from "bun:test";
import { especieDe } from "./especie";

describe("especieDe", () => {
  test("sin flags → modelo", () => {
    expect(especieDe({})).toBe("modelo");
  });
  test("esApunte → apunte", () => {
    expect(especieDe({ esApunte: true })).toBe("apunte");
  });
  test("esBiblioteca → biblioteca", () => {
    expect(especieDe({ esBiblioteca: true })).toBe("biblioteca");
  });
  test("flags en false → modelo", () => {
    expect(especieDe({ esApunte: false, esBiblioteca: false })).toBe("modelo");
  });
  // Contrato de exclusión: el invariante lo sella workspace.ts; aquí definimos
  // la desambiguación defensiva si un record ilegal llegara (apunte gana, es
  // el estado más laxo → nunca trata un borrador como fuente gobernada).
  test("ambos flags (ilegal) → apunte (desambiguación segura)", () => {
    expect(especieDe({ esApunte: true, esBiblioteca: true })).toBe("apunte");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && bun test src/persistencia/especie.test.ts`
Expected: FAIL — `Cannot find module './especie'`.

- [ ] **Step 3: Write minimal implementation**

```typescript
// app/src/persistencia/especie.ts

/**
 * Especie de un record de persistencia, decodificada UNA vez al borde de
 * lectura desde los dos flags aditivos existentes (esApunte/esBiblioteca).
 * Fundación del programa «experiencia ágil mesa↔skill» (comité 2026-07-06):
 * concentra el decode que si no se dispersaría por CLI/gestor/graduación (O(N²)).
 * NO toca el encoding — migrar los dos booleanos a un discriminado está
 * prohibido antes del 3er flag de especie (CLAUDE.md §Deuda categorial).
 * La forma futura del discriminado es el producto rigor×rol restringido, no
 * un coproducto plano de 3 (spec 2026-07-06-apuntes-taller-design.md §2-bis).
 */
export type Especie = "apunte" | "modelo" | "biblioteca";

export function especieDe(record: { esApunte?: boolean; esBiblioteca?: boolean }): Especie {
  if (record.esApunte) return "apunte";
  if (record.esBiblioteca) return "biblioteca";
  return "modelo";
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd app && bun test src/persistencia/especie.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add app/src/persistencia/especie.ts app/src/persistencia/especie.test.ts
git commit -m "feat(mesa): especieDe() — fundación del decode de especie en un punto"
```

---

## Task 2: Resolver de token Bearer encadenado

**Files:**
- Create: `app/src/server/tokenSessionResolver.ts`
- Test: `app/src/server/tokenSessionResolver.test.ts`

**Interfaces:**
- Consumes: `PersistenciaSesion` y `PersistenciaSessionResolver` de `app/src/server/modelPersistence.ts`.
- Produces:
  - `crearTokenSessionResolver(opts: { token: string; tenantId: string; userId: string }): PersistenciaSessionResolver` — resuelve `{tenantId, userId, auth: true}` sólo si el header `Authorization: Bearer <token>` iguala en tiempo constante; si no, devuelve una sesión "vacía" con `auth` ausente (para que el siguiente resolver de la cadena decida).
  - `crearResolverEncadenado(resolvers: PersistenciaSessionResolver[]): PersistenciaSessionResolver` — devuelve la primera sesión con `auth === true`; si ninguna autentica, devuelve la del último (comportamiento cookie/anónimo intacto).

- [ ] **Step 1: Write the failing test**

```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && bun test src/server/tokenSessionResolver.test.ts`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Write minimal implementation**

```typescript
// app/src/server/tokenSessionResolver.ts
import { Buffer } from "node:buffer";
import { timingSafeEqual } from "node:crypto";
import type { PersistenciaSesion, PersistenciaSessionResolver } from "./modelPersistence";

/**
 * Resolver de sesión por token de agente (Bearer). Producto del corte
 * «puente directo mesa↔skill» (A′-motor). Encadenado ANTES del resolver de
 * cookies: si el token autentica, la skill actúa como el operador; si no,
 * la cadena cae al comportamiento de navegador intacto.
 */
export function crearTokenSessionResolver(opts: {
  token: string;
  tenantId: string;
  userId: string;
}): PersistenciaSessionResolver {
  const esperado = Buffer.from(opts.token);
  return {
    async resolve(request): Promise<PersistenciaSesion> {
      const header = request.headers.get("authorization") ?? "";
      const prefijo = "Bearer ";
      if (header.startsWith(prefijo)) {
        const presentado = Buffer.from(header.slice(prefijo.length));
        // timingSafeEqual exige longitudes iguales; el guard evita su throw
        // y a la vez no filtra la longitud por tiempo (rechazo inmediato).
        if (presentado.length === esperado.length && timingSafeEqual(presentado, esperado)) {
          return { tenantId: opts.tenantId, userId: opts.userId, auth: true };
        }
      }
      // Sin auth: la cadena decide (el siguiente resolver o el 401 del gate).
      return { tenantId: "", userId: "" };
    },
  };
}

export function crearResolverEncadenado(
  resolvers: PersistenciaSessionResolver[],
): PersistenciaSessionResolver {
  return {
    async resolve(request): Promise<PersistenciaSesion> {
      let ultima: PersistenciaSesion = { tenantId: "", userId: "" };
      for (const r of resolvers) {
        const s = await r.resolve(request);
        if (s.auth === true) return s;
        ultima = s;
      }
      return ultima;
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd app && bun test src/server/tokenSessionResolver.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add app/src/server/tokenSessionResolver.ts app/src/server/tokenSessionResolver.test.ts
git commit -m "feat(mesa): resolver de token Bearer encadenado (auth:true, tiempo constante)"
```

---

## Task 3: Cablear el resolver de token en la API

**Files:**
- Modify: `app/scripts/model-persistence-api.ts` (bloque de construcción del handler, ~línea 344)

**Interfaces:**
- Consumes: `crearTokenSessionResolver`, `crearResolverEncadenado` (Task 2); `crearCookieSessionResolver` (ya importado).
- Produces: el handler productivo resuelve token→cookie cuando `MODEL_AGENT_TOKEN` + `MODEL_AGENT_IDENTITY` están en el env; si no, se comporta idéntico a hoy (solo cookie).

- [ ] **Step 1: Escribir el cableado (no hay unit; se cubre en integración Task 7 + verificación manual)**

Reemplazar la construcción del `sessionResolver` en el objeto que se pasa a `crearModelPersistenceFetchHandler`:

```typescript
// app/scripts/model-persistence-api.ts (cerca de la línea 344)
import { crearResolverEncadenado, crearTokenSessionResolver } from "../src/server/tokenSessionResolver";

// ... dentro del arranque, antes de crear el handler:
const cookieResolver = crearCookieSessionResolver(SESSION_SECRET);
const AGENT_TOKEN = process.env.MODEL_AGENT_TOKEN;
const AGENT_IDENTITY = process.env.MODEL_AGENT_IDENTITY; // "tenantId:userId"

function construirSessionResolver() {
  if (AGENT_TOKEN && AGENT_TOKEN.length >= 48 && AGENT_IDENTITY && AGENT_IDENTITY.includes(":")) {
    const [tenantId, userId] = AGENT_IDENTITY.split(":", 2);
    const tokenResolver = crearTokenSessionResolver({ token: AGENT_TOKEN, tenantId, userId });
    logEvento("model_api_agent_token", { habilitado: true });
    return crearResolverEncadenado([tokenResolver, cookieResolver]);
  }
  logEvento("model_api_agent_token", { habilitado: false });
  return cookieResolver; // fail-closed: sin token válido, carril deshabilitado
}

const handler = crearModelPersistenceFetchHandler({
  repo: repositorioPostgres(),
  sessionResolver: construirSessionResolver(),
  auth: { repo: authRepositorioPostgres(), secret: SESSION_SECRET, requireAuth: REQUIRE_AUTH },
});
```

- [ ] **Step 2: Verificar typecheck**

Run: `cd app && bun run typecheck`
Expected: PASS (sin errores de tipos; el import resuelve).

- [ ] **Step 3: Commit**

```bash
git add app/scripts/model-persistence-api.ts
git commit -m "feat(mesa): cablear resolver de token en la API (fail-closed sin env)"
```

---

## Task 4: Lógica pura del pull (base + encabezado)

**Files:**
- Create: `app/src/mesa/contextoPull.ts`
- Test: `app/src/mesa/contextoPull.test.ts`

**Interfaces:**
- Consumes: `exportarContextoSkill(modelo: Modelo, now?: Date): string` de `app/src/opl/contextoSkill.ts`; `hidratarModelo(json: string): Resultado<Modelo>` de `app/src/serializacion/json.ts`; `especieDe` (Task 1).
- Produces:
  - `type FuenteEstado = { clase: "guardado"; rev: number } | { clase: "autosave"; creadoEn: string }`
  - `elegirBase(input: { guardadoActualizadoEn: string; guardadoJson: string; guardadoRev: number; autosave?: { creadoEn: string; json: string } }): { json: string; fuente: FuenteEstado }` — autosave sii `autosave.creadoEn > guardadoActualizadoEn`.
  - `componerPull(input: { nombre: string; especie: Especie; base: { json: string; fuente: FuenteEstado }; now?: Date }): string` — encabezado (Especie + Fuente) + `exportarContextoSkill`.

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, expect, test } from "bun:test";
import { componerPull, elegirBase } from "./contextoPull";
import { exportarContextoSkill } from "../opl/contextoSkill";
import { hidratarModelo, exportarModelo } from "../serializacion/json";
import { crearModeloVacio } from "../modelo/operaciones"; // helper de modelo vacío

const NOW = new Date("2026-07-06T00:00:00.000Z");
const modelo = crearModeloVacio("Demo");
const json = exportarModelo(modelo);

describe("elegirBase", () => {
  test("autosave más nuevo que lo guardado → autosave", () => {
    const b = elegirBase({
      guardadoActualizadoEn: "2026-07-06T10:00:00.000Z",
      guardadoJson: json,
      guardadoRev: 3,
      autosave: { creadoEn: "2026-07-06T10:00:05.000Z", json },
    });
    expect(b.fuente).toEqual({ clase: "autosave", creadoEn: "2026-07-06T10:00:05.000Z" });
  });
  test("autosave más viejo → guardado", () => {
    const b = elegirBase({
      guardadoActualizadoEn: "2026-07-06T10:00:00.000Z",
      guardadoJson: json,
      guardadoRev: 3,
      autosave: { creadoEn: "2026-07-06T09:59:00.000Z", json },
    });
    expect(b.fuente).toEqual({ clase: "guardado", rev: 3 });
  });
  test("sin autosave → guardado", () => {
    const b = elegirBase({ guardadoActualizadoEn: "2026-07-06T10:00:00.000Z", guardadoJson: json, guardadoRev: 3 });
    expect(b.fuente).toEqual({ clase: "guardado", rev: 3 });
  });
});

describe("componerPull", () => {
  test("declara especie y fuente en el encabezado", () => {
    const out = componerPull({
      nombre: "Demo",
      especie: "apunte",
      base: { json, fuente: { clase: "autosave", creadoEn: "2026-07-06T10:00:05.000Z" } },
      now: NOW,
    });
    expect(out).toContain("Especie: apunte");
    expect(out).toContain("autosave no consolidado");
  });
  // LEY DE DETERMINISMO DEL GENERADOR: el cuerpo del pull, quitando el
  // encabezado de la mesa, es byte-igual a exportarContextoSkill sobre el
  // MISMO modelo-fuente. Un generador, dos consumidores.
  test("el cuerpo es byte-igual a exportarContextoSkill del mismo modelo", () => {
    const m = hidratarModelo(json);
    if (!m.ok) throw new Error("fixture inválido");
    const esperado = exportarContextoSkill(m.value, NOW);
    const out = componerPull({
      nombre: "Demo",
      especie: "modelo",
      base: { json, fuente: { clase: "guardado", rev: 1 } },
      now: NOW,
    });
    expect(out.endsWith(esperado)).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && bun test src/mesa/contextoPull.test.ts`
Expected: FAIL — módulo inexistente. (Si `crearModeloVacio`/`exportarModelo` tienen otro nombre, ajústalo al helper real de creación de modelo vacío + serializador; `hidratarModelo` y `exportarModelo` sí existen en `json.ts`.)

- [ ] **Step 3: Write minimal implementation**

```typescript
// app/src/mesa/contextoPull.ts
import { exportarContextoSkill } from "../opl/contextoSkill";
import { hidratarModelo } from "../serializacion/json";
import type { Especie } from "../persistencia/especie";

export type FuenteEstado =
  | { clase: "guardado"; rev: number }
  | { clase: "autosave"; creadoEn: string };

export function elegirBase(input: {
  guardadoActualizadoEn: string;
  guardadoJson: string;
  guardadoRev: number;
  autosave?: { creadoEn: string; json: string };
}): { json: string; fuente: FuenteEstado } {
  if (input.autosave && input.autosave.creadoEn > input.guardadoActualizadoEn) {
    return { json: input.autosave.json, fuente: { clase: "autosave", creadoEn: input.autosave.creadoEn } };
  }
  return { json: input.guardadoJson, fuente: { clase: "guardado", rev: input.guardadoRev } };
}

function lineaFuente(f: FuenteEstado): string {
  return f.clase === "guardado"
    ? `Fuente: guardado rev ${f.rev}`
    : `Fuente: autosave no consolidado (no ratificado) — ${f.creadoEn}`;
}

export function componerPull(input: {
  nombre: string;
  especie: Especie;
  base: { json: string; fuente: FuenteEstado };
  now?: Date;
}): string {
  const m = hidratarModelo(input.base.json);
  if (!m.ok) throw new Error(`base ilegible: ${m.error}`);
  const encabezado = [
    `<!-- mesa pull · ${input.nombre} -->`,
    `Especie: ${input.especie}`,
    lineaFuente(input.base.fuente),
    "",
  ].join("\n");
  return encabezado + exportarContextoSkill(m.value, input.now);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd app && bun test src/mesa/contextoPull.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/src/mesa/contextoPull.ts app/src/mesa/contextoPull.test.ts
git commit -m "feat(mesa): lógica pura del pull (base autosave-vs-guardado + determinismo del generador)"
```

---

## Task 5: Lógica pura del push (validación, procedencia, base, especie)

**Files:**
- Create: `app/src/mesa/validarPush.ts`
- Test: `app/src/mesa/validarPush.test.ts`

**Interfaces:**
- Consumes: `hidratarModelo` de `app/src/serializacion/json.ts`; `especieDe` (Task 1).
- Produces:
  - `type VeredictoPush = { ok: true; especieDestino: "apunte" | "modelo" } | { ok: false; motivo: string }`
  - `evaluarPush(input: { bundleJson: string; destino?: { tieneSello: boolean; especie: "apunte" | "modelo" | "biblioteca" }; baseFueAutosave: boolean; confirmadoPorOperador: boolean; especieAlCrear?: "apunte" | "modelo" }): VeredictoPush` — puro; no toca red. El "sello" del bundle se detecta por presencia de `procedencia` en el JSON (helper interno `bundleTieneSello`).

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, expect, test } from "bun:test";
import { evaluarPush } from "./validarPush";
import { exportarModelo } from "../serializacion/json";
import { crearModeloVacio } from "../modelo/operaciones";

const bundleValido = exportarModelo(crearModeloVacio("X"));
const bundleInvalido = '{"esto":"no es un modelo"}';

describe("evaluarPush", () => {
  test("bundle inválido → rechaza sin permitir escritura", () => {
    const v = evaluarPush({ bundleJson: bundleInvalido, destino: { tieneSello: false, especie: "modelo" }, baseFueAutosave: false, confirmadoPorOperador: false });
    expect(v.ok).toBe(false);
  });
  test("modelo con sello + bundle artesanal (sin sello) → rechaza (carril procedencia)", () => {
    const v = evaluarPush({ bundleJson: bundleValido, destino: { tieneSello: true, especie: "modelo" }, baseFueAutosave: false, confirmadoPorOperador: false });
    expect(v).toMatchObject({ ok: false });
    if (!v.ok) expect(v.motivo).toContain("proto");
  });
  test("modelo sin sello + bundle artesanal → pasa (push libre mesa-nacido)", () => {
    const v = evaluarPush({ bundleJson: bundleValido, destino: { tieneSello: false, especie: "modelo" }, baseFueAutosave: false, confirmadoPorOperador: false });
    expect(v.ok).toBe(true);
  });
  test("base fue autosave + sin confirmación → rechaza (base no ratificada)", () => {
    const v = evaluarPush({ bundleJson: bundleValido, destino: { tieneSello: false, especie: "modelo" }, baseFueAutosave: true, confirmadoPorOperador: false });
    expect(v).toMatchObject({ ok: false });
    if (!v.ok) expect(v.motivo).toContain("ratific");
  });
  test("base fue autosave + confirmada → pasa", () => {
    const v = evaluarPush({ bundleJson: bundleValido, destino: { tieneSello: false, especie: "modelo" }, baseFueAutosave: true, confirmadoPorOperador: true });
    expect(v.ok).toBe(true);
  });
  test("destino biblioteca → rechaza (solo-lectura)", () => {
    const v = evaluarPush({ bundleJson: bundleValido, destino: { tieneSello: false, especie: "biblioteca" }, baseFueAutosave: false, confirmadoPorOperador: false });
    expect(v).toMatchObject({ ok: false });
  });
  test("crear (sin destino) exige especie explícita", () => {
    const sin = evaluarPush({ bundleJson: bundleValido, baseFueAutosave: false, confirmadoPorOperador: false });
    expect(sin.ok).toBe(false);
    const con = evaluarPush({ bundleJson: bundleValido, baseFueAutosave: false, confirmadoPorOperador: false, especieAlCrear: "apunte" });
    expect(con).toMatchObject({ ok: true, especieDestino: "apunte" });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && bun test src/mesa/validarPush.test.ts`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Write minimal implementation**

```typescript
// app/src/mesa/validarPush.ts
import { hidratarModelo } from "../serializacion/json";

export type VeredictoPush =
  | { ok: true; especieDestino: "apunte" | "modelo" }
  | { ok: false; motivo: string };

function bundleTieneSello(json: string): boolean {
  try {
    const doc = JSON.parse(json) as { procedencia?: unknown };
    return doc.procedencia != null && typeof doc.procedencia === "object";
  } catch {
    return false;
  }
}

export function evaluarPush(input: {
  bundleJson: string;
  destino?: { tieneSello: boolean; especie: "apunte" | "modelo" | "biblioteca" };
  baseFueAutosave: boolean;
  confirmadoPorOperador: boolean;
  especieAlCrear?: "apunte" | "modelo";
}): VeredictoPush {
  // 1. Contrato de import duro: el bundle debe hidratar a un modelo legítimo.
  const hidratado = hidratarModelo(input.bundleJson);
  if (!hidratado.ok) return { ok: false, motivo: `bundle inválido: ${hidratado.error}` };

  // 2. Crear vs actualizar.
  if (!input.destino) {
    if (!input.especieAlCrear) return { ok: false, motivo: "al crear se debe declarar --especie apunte|modelo" };
    return { ok: true, especieDestino: input.especieAlCrear };
  }

  // 3. Biblioteca = solo-lectura.
  if (input.destino.especie === "biblioteca") return { ok: false, motivo: "destino biblioteca es solo-lectura" };

  // 4. Carril por procedencia: modelo con sello exige bundle del compilador.
  if (input.destino.tieneSello && !bundleTieneSello(input.bundleJson)) {
    return { ok: false, motivo: "el modelo tiene proto: edita el proto y recompila (bundle sin sello rechazado)" };
  }

  // 5. Base no ratificada: si la base del pull fue autosave, exige confirmación.
  if (input.baseFueAutosave && !input.confirmadoPorOperador) {
    return { ok: false, motivo: "base no ratificada (autosave): el operador debe confirmar (--confirmado-por-operador)" };
  }

  return { ok: true, especieDestino: input.destino.especie };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd app && bun test src/mesa/validarPush.test.ts`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add app/src/mesa/validarPush.ts app/src/mesa/validarPush.test.ts
git commit -m "feat(mesa): lógica pura del push (contrato, procedencia, base ratificada, especie)"
```

---

## Task 6: CLI de mesa (capa delgada de I/O)

**Files:**
- Create: `app/scripts/mesa-cli.ts`

**Interfaces:**
- Consumes: `especieDe` (Task 1), `elegirBase`/`componerPull` (Task 4), `evaluarPush` (Task 5). Config: env `OPFORJA_API_URL` (default instancia prod) + archivo `~/.config/opforja/agent-token`.
- Produces: ejecutable `bun app/scripts/mesa-cli.ts <modelos|pull|push> …`. Sin exports (script). Endpoints: `GET /__deep-opm/modelos` (lista), `GET /__deep-opm/modelos/:id`, `POST /__deep-opm/modelos` (crear/actualizar), `POST /__deep-opm/modelos/:id/versiones`. Header `Authorization: Bearer <token del archivo>`.

- [ ] **Step 1: Escribir el CLI (capa I/O; la lógica ya está testeada en Tasks 4-5)**

```typescript
// app/scripts/mesa-cli.ts
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { especieDe } from "../src/persistencia/especie";
import { componerPull, elegirBase } from "../src/mesa/contextoPull";
import { evaluarPush } from "../src/mesa/validarPush";

const API = process.env.OPFORJA_API_URL ?? "https://opforja.sanixai.com";
const TOKEN_PATH = process.env.OPFORJA_AGENT_TOKEN_FILE ?? join(homedir(), ".config/opforja/agent-token");

function token(): string {
  try {
    return readFileSync(TOKEN_PATH, "utf8").trim();
  } catch {
    console.error(`No hay token en ${TOKEN_PATH}. Genera uno con openssl y colócalo (chmod 600).`);
    process.exit(2);
  }
}
function headers(): Record<string, string> {
  return { authorization: `Bearer ${token()}`, "content-type": "application/json" };
}
async function api(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${API}/__deep-opm${path}`, { ...init, headers: { ...headers(), ...(init?.headers ?? {}) } });
}
async function resolverId(ref: string): Promise<{ id: string; nombre: string } | null> {
  const r = await api("/modelos");
  if (!r.ok) { console.error(`API ${r.status}`); process.exit(1); }
  const lista = (await r.json()) as Array<Record<string, unknown>>;
  return (lista.find((m) => m.id === ref) ?? lista.find((m) => m.nombre === ref)) as { id: string; nombre: string } | undefined ?? null;
}

async function cmdModelos(): Promise<void> {
  const r = await api("/modelos");
  if (!r.ok) { console.error(`API ${r.status}`); process.exit(1); }
  const lista = (await r.json()) as Array<Record<string, unknown>>;
  for (const m of lista) {
    console.log(`${m.id}\t${especieDe(m as { esApunte?: boolean; esBiblioteca?: boolean })}\trev ${m.revision ?? 0}\t${m.nombre}`);
  }
}

async function cmdPull(ref: string): Promise<void> {
  const ref2 = await resolverId(ref);
  if (!ref2) { console.error("modelo no encontrado"); process.exit(1); }
  const r = await api(`/modelos/${encodeURIComponent(ref2.id)}`);
  if (!r.ok) { console.error(`API ${r.status}`); process.exit(1); }
  const rec = (await r.json()) as Record<string, unknown>;
  const base = elegirBase({
    guardadoActualizadoEn: String(rec.actualizadoEn),
    guardadoJson: String(rec.json),
    guardadoRev: Number(rec.revision ?? 0),
    autosave: rec.autosalvado ? { creadoEn: String(rec.autosaveCreadoEn), json: String(rec.autosaveJson) } : undefined,
  });
  console.log(componerPull({ nombre: String(rec.nombre), especie: especieDe(rec as { esApunte?: boolean; esBiblioteca?: boolean }), base }));
}

async function cmdPush(ref: string, bundlePath: string, opts: { nota: string; confirmado: boolean; especie?: "apunte" | "modelo" }): Promise<void> {
  const bundleJson = readFileSync(bundlePath, "utf8");
  const destino = await resolverId(ref);
  let destinoInfo: { tieneSello: boolean; especie: "apunte" | "modelo" | "biblioteca" } | undefined;
  let baseFueAutosave = false;
  if (destino) {
    const r = await api(`/modelos/${encodeURIComponent(destino.id)}`);
    const rec = (await r.json()) as Record<string, unknown>;
    destinoInfo = { tieneSello: bundleTieneSelloRemoto(String(rec.json)), especie: especieDe(rec as { esApunte?: boolean; esBiblioteca?: boolean }) };
    baseFueAutosave = Boolean(rec.autosalvado);
  }
  const veredicto = evaluarPush({ bundleJson, destino: destinoInfo, baseFueAutosave, confirmadoPorOperador: opts.confirmado, especieAlCrear: opts.especie });
  if (!veredicto.ok) { console.error(`push rechazado: ${veredicto.motivo}`); process.exit(1); }
  // Escritura: crea (POST /modelos) o actualiza + versión etiquetada.
  const body = JSON.stringify({ id: destino?.id ?? null, nombre: destino?.nombre ?? `Nuevo ${veredicto.especieDestino}`, json: bundleJson, esApunte: veredicto.especieDestino === "apunte" ? true : undefined });
  const w = await api("/modelos", { method: "POST", body });
  if (w.status === 409) { console.error("409: la mesa avanzó bajo tus pies. Re-pull y reintenta."); process.exit(3); }
  if (!w.ok) { console.error(`API ${w.status}`); process.exit(1); }
  const guardado = (await w.json()) as { id: string; revision?: number };
  await api(`/modelos/${encodeURIComponent(guardado.id)}/versiones`, {
    method: "POST",
    body: JSON.stringify({ version: { etiqueta: `agente·${opts.nota}` }, json: bundleJson }),
  });
  console.log(`push ok: ${guardado.id} rev ${guardado.revision ?? "?"}`);
}

function bundleTieneSelloRemoto(json: string): boolean {
  try { return (JSON.parse(json) as { procedencia?: unknown }).procedencia != null; } catch { return false; }
}

// --- dispatch ---
const [, , verbo, ...rest] = process.argv;
const flag = (n: string): string | undefined => { const i = rest.indexOf(n); return i >= 0 ? rest[i + 1] : undefined; };
const has = (n: string): boolean => rest.includes(n);
if (verbo === "modelos") await cmdModelos();
else if (verbo === "pull") await cmdPull(rest[0]);
else if (verbo === "push") await cmdPush(rest[0], rest[1], { nota: flag("--nota") ?? "sin nota", confirmado: has("--confirmado-por-operador"), especie: flag("--especie") as "apunte" | "modelo" | undefined });
else { console.error("uso: mesa <modelos|pull <ref>|push <ref> <bundle.json> --nota … [--especie apunte|modelo] [--confirmado-por-operador]>"); process.exit(2); }
```

- [ ] **Step 2: Verificar typecheck**

Run: `cd app && bun run typecheck`
Expected: PASS. (Si el shape real del record remoto difiere en los nombres de campos de autosave, ajusta `cmdPull`/`cmdPush` a lo que devuelve `GET /modelos/:id` — verifícalo con el handler; la lógica pura ya está fijada por tests.)

- [ ] **Step 3: Añadir scripts a package.json**

En `app/package.json`, sección `scripts`:
```json
"mesa": "bun scripts/mesa-cli.ts"
```

- [ ] **Step 4: Commit**

```bash
git add app/scripts/mesa-cli.ts app/package.json
git commit -m "feat(mesa): CLI de 3 verbos (modelos/pull/push) — capa I/O sobre lógica pura testeada"
```

---

## Task 7: Leyes de round-trip (counit + clausura) contra repo en memoria

**Files:**
- Create: `app/src/mesa/roundtrip.test.ts`

**Interfaces:**
- Consumes: `crearRepoMemoria` de `app/src/server/repoMemoria.ts`, `crearModelPersistenceFetchHandler` + `crearTokenSessionResolver` (Tasks 2), `exportarModelo`/`hidratarModelo`, `exportarContextoSkill`.
- Produces: sólo tests (no exporta). Verifica las dos leyes categoriales del comité contra el handler real en memoria (sin red).

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, expect, test } from "bun:test";
import { crearModelPersistenceFetchHandler } from "../server/modelPersistence";
import { crearTokenSessionResolver } from "../server/tokenSessionResolver";
import { crearRepoMemoria } from "../server/repoMemoria";
import { exportarContextoSkill } from "../opl/contextoSkill";
import { exportarModelo, hidratarModelo } from "../serializacion/json";
import { crearModeloVacio } from "../modelo/operaciones";

const TOKEN = "z".repeat(48);
function nuevoHandler() {
  return crearModelPersistenceFetchHandler({
    repo: crearRepoMemoria(),
    sessionResolver: crearTokenSessionResolver({ token: TOKEN, tenantId: "t", userId: "u" }),
    // sin auth.requireAuth: el token ya trae auth:true; el repo memoria no exige login
  });
}
function req(path: string, init?: RequestInit): Request {
  return new Request(`https://x/__deep-opm${path}`, { ...init, headers: { authorization: `Bearer ${TOKEN}`, "content-type": "application/json", ...(init?.headers ?? {}) } });
}

describe("leyes de round-trip del puente", () => {
  // COUNIT: tras push de B, un pull inmediato produce proyección semántica ≡ a la de B.
  test("pull∘push preserva la proyección semántica (counit)", async () => {
    const h = nuevoHandler();
    const modelo = crearModeloVacio("RT");
    const bundle = exportarModelo(modelo);
    const post = await h(req("/modelos", { method: "POST", body: JSON.stringify({ id: null, nombre: "RT", json: bundle }) }));
    expect(post.ok).toBe(true);
    const { id } = (await post.json()) as { id: string };
    const get = await h(req(`/modelos/${id}`));
    const rec = (await get.json()) as { json: string };
    const mB = hidratarModelo(bundle); const mPull = hidratarModelo(rec.json);
    if (!mB.ok || !mPull.ok) throw new Error("hidratación falló");
    expect(exportarContextoSkill(mPull.value, new Date("2026-07-06"))).toBe(exportarContextoSkill(mB.value, new Date("2026-07-06")));
  });

  // CLAUSURA: pull de un modelo sin ediciones + push del mismo → no crea revisión nueva.
  test("push∘pull sin delta no avanza la revisión (clausura)", async () => {
    const h = nuevoHandler();
    const bundle = exportarModelo(crearModeloVacio("RT2"));
    const post = await h(req("/modelos", { method: "POST", body: JSON.stringify({ id: null, nombre: "RT2", json: bundle }) }));
    const { id, revision } = (await post.json()) as { id: string; revision?: number };
    const get = await h(req(`/modelos/${id}`));
    const rec = (await get.json()) as { json: string; revision?: number };
    // re-push del MISMO json (sin delta): la revisión no debe avanzar.
    const rePost = await h(req("/modelos", { method: "POST", body: JSON.stringify({ id, nombre: "RT2", json: rec.json, revision: rec.revision }) }));
    const re = (await rePost.json()) as { revision?: number };
    expect(re.revision ?? 0).toBe(revision ?? 0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails or reveals the gap**

Run: `cd app && bun test src/mesa/roundtrip.test.ts`
Expected: la counit debería PASAR (round-trip fiel); la **clausura probablemente FALLA** si el backend crea revisión en cada POST sin comparar contenido. Ese fallo es el hallazgo: documenta si el no-op requiere un guard de "sin delta" en el repo o en el CLI.

- [ ] **Step 3: Cerrar la clausura donde corresponda**

Si la clausura falla: el guard más barato y correcto vive en el CLI (`cmdPush`): antes de escribir, si `bundleJson` es semánticamente igual al `json` remoto (comparar `exportarContextoSkill` de ambos, o hash semántico si existe `firmaSemantica`), abortar con "sin cambios: no se crea revisión". Implementa ese guard en `mesa-cli.ts::cmdPush` y refleja la ley con un test de la lógica pura (añadir a `validarPush.test.ts` un caso `sinDelta → ok:false motivo "sin cambios"` y el flag en `evaluarPush`). Mantén la counit intacta.

- [ ] **Step 4: Run tests to verify both laws pass**

Run: `cd app && bun test src/mesa/`
Expected: PASS (ambas leyes).

- [ ] **Step 5: Commit**

```bash
git add app/src/mesa/roundtrip.test.ts app/src/mesa/validarPush.ts app/src/mesa/validarPush.test.ts app/scripts/mesa-cli.ts
git commit -m "test(mesa): leyes de round-trip counit (preserva) + clausura (sin delta no crea revisión)"
```

---

## Task 8: Gate completo + verificación end-to-end manual

**Files:**
- (ninguno nuevo — verificación)

- [ ] **Step 1: Gate completo**

Run: `cd app && bun run check && bun run lint`
Expected: check verde (todos los tests), lint sin errores.

- [ ] **Step 2: Prueba viva contra dev (headless, sin prod)**

Levantar el dev server con token de agente y probar los 3 verbos:
```bash
cd app
export MODEL_AGENT_TOKEN=$(openssl rand -hex 32)
export MODEL_AGENT_IDENTITY="tenant-dev:user-dev"
# levantar la API dev (o el middleware) según docs/deploy/opforja.md
mkdir -p ~/.config/opforja && printf '%s' "$MODEL_AGENT_TOKEN" > ~/.config/opforja/agent-token && chmod 600 ~/.config/opforja/agent-token
OPFORJA_API_URL=http://localhost:<puerto> bun run mesa modelos
```
Expected: lista de modelos con columna de especie; `pull` de uno devuelve contexto con encabezado Especie/Fuente; `push` de un bundle válido crea revisión; token borrado → 401.

- [ ] **Step 3: Commit del cierre de la ola (si hubo ajustes de verificación)**

```bash
git add -A && git commit -m "chore(mesa): cierre Ola 1 — gate verde + verificación headless"
```

---

## Self-Review (cubierto)

- **Cobertura de spec §3-§5, §8**: especieDe (Task 1) · token+auth:true+sin-setCookie (Task 2) · cableado fail-closed (Task 3) · pull base-autosave+determinismo (Task 4) · push contrato/procedencia/base/especie (Task 5) · CLI 3 verbos (Task 6) · leyes counit+clausura (Task 7) · gate (Task 8). Spec §6 (vitrina) y §9 riesgo dirty-bit = **Ola 2**, fuera de este plan. Solicitud upstream §7 = Task 0.
- **Guardia dura** (ningún flag de especie nuevo): ningún task agrega flag; el test de contrato de inventario vive en la spec B′ (su corte). especieDe sólo decodifica.
- **Tipos consistentes**: `Especie`, `FuenteEstado`, `VeredictoPush`, `PersistenciaSesion` usados con los mismos nombres entre tasks.
- **Riesgo nombrado**: los shapes exactos del record remoto de autosave (`autosaveCreadoEn`/`autosaveJson`) pueden diferir del handler real — el plan lo marca en Task 6 Step 2 y Task 4 Step 2; la lógica pura queda fijada por tests, la capa I/O se ajusta al shape real al ejecutar.
