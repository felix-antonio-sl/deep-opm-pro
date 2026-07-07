# Puente directo mesa↔skill — Ola 2 (A′-vitrina) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que el operador VEA llegar la revisión que un agente empujó al modelo abierto y la traiga sin perder su trabajo local sin querer, y que el historial no mienta sobre qué es un hito (una sesión de agente = un hito colapsable).

**Architecture:** Un poll ligero (patrón `crearAutosalvado`) refresca la revisión remota del modelo activo hacia un campo del store etiquetado por `modeloId`. Un selector puro compara contra la «base» (revisión que el operador cargó/guardó, registrada en un mapa por-modelo) y ramifica por `dirty`. Un chip de chrome (TINTA, hermano de `ToolbarPersistenceStatus`) presenta la rama. El colapso de hitos es una función pura que agrupa versiones consecutivas del agente y se aplica en el viewmodel del `DialogoVersiones` existente (se reusa, no se construye visor nuevo).

**Tech Stack:** Preact 10, Zustand 5, TypeScript strict, Bun test runner, Vite 6, Playwright. Backend `fetch`-nativo del repo (endpoints `GET /__deep-opm/modelos/:id`, `/versiones`), reuso de `cargarModeloBackend`/`cargarLocal`/`abrirDialogoVersiones`.

## Global Constraints

- Lenguaje: español (es-CL) en dominio OPM, prosa y copy; inglés en identificadores de infraestructura.
- **Ningún flag booleano de especie nuevo** (guardia dura del comité). Este corte no toca especie.
- **Dirty-bit = `dirty` a secas.** «Cambios locales en riesgo de pérdida» ⟺ `dirty === true`. Fundamento: el 409 fast-forward garantiza que toda revisión remota más nueva se construyó sobre el estado consolidado del operador; con `dirty=false` recargar es sin pérdida. NO plegar undo/frescura-de-autosave (serían cry-wolf).
- **Base por-modelo** (`revisionBasePorModelo[id]`) DEBE avanzar en los guardados propios (guardar/autosalvar/cargar) o el chip gatilla con el propio trabajo del operador.
- **Diferenciación visual**: el chip es DOM chrome rectangular plano con glifo NO-⟳; el drift es badge SVG circular en el canvas. Ambos TINTA (`tokens.colors.ink*`). Cero sombras offset, `borderRadius: 0`, sólo tokens existentes → `bun run design:governance` verde.
- Gate mínimo antes de cada commit: `cd app && bun run check` verde.
- TDD estricto: test que falla → implementación mínima → verde → commit.
- Reuso obligatorio: `cargarModeloBackend` (`persistencia/backend.ts`), `cargarLocal`/`abrirDialogoVersiones`/`listarModelosGuardados` (store), `DialogoVersiones.tsx` + su viewmodel, patrón `crearAutosalvado`.

---

## File Structure

- `app/src/mesa/revisionVitrina.ts` — **nuevo**. Selector puro `evaluarVitrina()` + tipo `EstadoVitrina`. El corazón de la ramificación (visible/oculto, dirty). Sin DOM, sin store.
- `app/src/mesa/revisionVitrina.test.ts` — **nuevo**. Leyes de la ramificación.
- `app/src/mesa/historialAgente.ts` — **nuevo**. `agruparHistorialPorSesionAgente()` + `esVersionDeAgente()` + tipo `FilaHistorial`. Colapso puro.
- `app/src/mesa/historialAgente.test.ts` — **nuevo**. Leyes del colapso.
- `app/src/store/tipos.ts` — **modificar**. Campos `revisionRemota` + `revisionBasePorModelo` + firmas de las 5 acciones nuevas.
- `app/src/store/runtime.ts` — **modificar**. Singleton `pollRevisionTimer` + getters/setters (patrón `autosalvadoControl`).
- `app/src/store/persistencia.ts` — **modificar**. Las acciones del poll/traer/ver + fijar base en los 3 upsert (`:357/410/494`) y en `abrirPestanaConModelo`.
- `app/src/store/persistencia.test.ts` — **modificar**. Tests store: guardado propio NO gatilla; push del agente SÍ; traer resetea; base por autosalvado.
- `app/src/app/ports/persistencePort.ts` + `zustandPersistencePort.ts` — **modificar**. Exponer los campos/acciones nuevos al chip.
- `app/src/app/viewmodels/chipRevisionViewModel.ts` — **nuevo**. Store → `evaluarVitrina` → props del chip.
- `app/src/ui/toolbar/ChipRevisionNueva.tsx` — **nuevo**. El chip ramificado (TINTA, botones por rama).
- `app/src/ui/toolbar/ToolbarBase.tsx` — **modificar**. Montar `<ChipRevisionNueva/>` en `cluster-modelo` (:295) + `useEffect(iniciarPollRevision)`.
- `app/src/app/viewmodels/dialogoVersionesViewModel.ts` — **modificar**. Aplicar `agruparHistorialPorSesionAgente` sobre las versiones visibles.
- `app/src/ui/DialogoVersiones.tsx` — **modificar**. Renderizar grupos colapsables con toggle de expansión.
- `app/e2e/40-vitrina-revision.spec.ts` — **nuevo**. E2E de las dos ramas + colapso in-vivo.

---

## Task 1: Selector puro `evaluarVitrina` (comparación + dirty-bit)

**Files:**
- Create: `app/src/mesa/revisionVitrina.ts`
- Test: `app/src/mesa/revisionVitrina.test.ts`

**Interfaces:**
- Produces:
  - `type EstadoVitrina = { visible: false } | { visible: true; revisionRemota: number; hayCambiosLocales: boolean }`
  - `evaluarVitrina(input: { modeloPersistidoId: string | null; revisionRemota: { modeloId: string; revision: number } | null; revisionBase: number | null; dirty: boolean }): EstadoVitrina`

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, expect, test } from "bun:test";
import { evaluarVitrina } from "./revisionVitrina";

const RR = (modeloId: string, revision: number) => ({ modeloId, revision });

describe("evaluarVitrina", () => {
  test("no persistido → oculto", () => {
    expect(evaluarVitrina({ modeloPersistidoId: null, revisionRemota: RR("m", 5), revisionBase: 3, dirty: false }))
      .toEqual({ visible: false });
  });
  test("sin lectura de poll → oculto", () => {
    expect(evaluarVitrina({ modeloPersistidoId: "m", revisionRemota: null, revisionBase: 3, dirty: false }))
      .toEqual({ visible: false });
  });
  test("poll de OTRO modelo (rancio) → oculto", () => {
    expect(evaluarVitrina({ modeloPersistidoId: "m", revisionRemota: RR("otro", 9), revisionBase: 3, dirty: false }))
      .toEqual({ visible: false });
  });
  test("base desconocida → oculto (no falso positivo)", () => {
    expect(evaluarVitrina({ modeloPersistidoId: "m", revisionRemota: RR("m", 9), revisionBase: null, dirty: false }))
      .toEqual({ visible: false });
  });
  test("remota == base → oculto (mi propio estado)", () => {
    expect(evaluarVitrina({ modeloPersistidoId: "m", revisionRemota: RR("m", 3), revisionBase: 3, dirty: false }))
      .toEqual({ visible: false });
  });
  test("remota < base → oculto (nunca retrocede)", () => {
    expect(evaluarVitrina({ modeloPersistidoId: "m", revisionRemota: RR("m", 2), revisionBase: 3, dirty: false }))
      .toEqual({ visible: false });
  });
  test("remota > base, limpio → visible sin cambios locales (rama Recargar)", () => {
    expect(evaluarVitrina({ modeloPersistidoId: "m", revisionRemota: RR("m", 6), revisionBase: 5, dirty: false }))
      .toEqual({ visible: true, revisionRemota: 6, hayCambiosLocales: false });
  });
  test("remota > base, dirty → visible con cambios locales (rama no-destructiva)", () => {
    expect(evaluarVitrina({ modeloPersistidoId: "m", revisionRemota: RR("m", 6), revisionBase: 5, dirty: true }))
      .toEqual({ visible: true, revisionRemota: 6, hayCambiosLocales: true });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && bun test src/mesa/revisionVitrina.test.ts`
Expected: FAIL — `Cannot find module './revisionVitrina'`.

- [ ] **Step 3: Write minimal implementation**

```typescript
// app/src/mesa/revisionVitrina.ts

/**
 * Estado de la vitrina de revisión para el modelo activo. El corazón de la
 * ramificación del chip A′-vitrina (spec 2026-07-06-puente-directo §6).
 *
 * `hayCambiosLocales === dirty`: es el ÚNICO estado que una recarga a la
 * revisión del agente descartaría silenciosamente. El 409 fast-forward del
 * backend garantiza que toda revisión remota más nueva se construyó sobre el
 * estado consolidado del operador → con `dirty=false` recargar es sin pérdida.
 * Ver docs/memorias-aprendizajes/notas-vitrina.md.
 */
export type EstadoVitrina =
  | { visible: false }
  | { visible: true; revisionRemota: number; hayCambiosLocales: boolean };

export function evaluarVitrina(input: {
  modeloPersistidoId: string | null;
  revisionRemota: { modeloId: string; revision: number } | null;
  revisionBase: number | null;
  dirty: boolean;
}): EstadoVitrina {
  const { modeloPersistidoId, revisionRemota, revisionBase, dirty } = input;
  if (modeloPersistidoId === null) return { visible: false };
  if (revisionRemota === null || revisionRemota.modeloId !== modeloPersistidoId) return { visible: false };
  if (revisionBase === null) return { visible: false };
  if (revisionRemota.revision <= revisionBase) return { visible: false };
  return { visible: true, revisionRemota: revisionRemota.revision, hayCambiosLocales: dirty };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd app && bun test src/mesa/revisionVitrina.test.ts`
Expected: PASS (8 tests).

- [ ] **Step 5: Commit**

```bash
git add app/src/mesa/revisionVitrina.ts app/src/mesa/revisionVitrina.test.ts
git commit -m "feat(vitrina): selector puro evaluarVitrina (comparación + dirty-bit colapsado por el 409)"
```

---

## Task 2: Colapso de hitos — agrupador puro `agruparHistorialPorSesionAgente`

**Files:**
- Create: `app/src/mesa/historialAgente.ts`
- Test: `app/src/mesa/historialAgente.test.ts`

**Interfaces:**
- Consumes: `VersionResumen` de `app/src/modelo/tipos` (`{ id; creadoEn; nombre; descripcion?; preservar?; modeloPayloadKey; bytes }`). La versión del agente lleva `nombre` con prefijo `agente·` (emitido por `mesa-cli.ts`).
- Produces:
  - `esVersionDeAgente(v: VersionResumen): boolean`
  - `type FilaHistorial = { tipo: "individual"; version: VersionResumen } | { tipo: "sesion-agente"; versiones: VersionResumen[]; desde: string; hasta: string }`
  - `agruparHistorialPorSesionAgente(versiones: VersionResumen[]): FilaHistorial[]` — agrupa corridas CONSECUTIVAS (en el orden recibido, que es desc por `creadoEn`) de versiones de agente en una fila `sesion-agente`; las demás quedan `individual`. Preserva el orden.

- [ ] **Step 1: Write the failing test**

```typescript
import { describe, expect, test } from "bun:test";
import { agruparHistorialPorSesionAgente, esVersionDeAgente } from "./historialAgente";
import type { VersionResumen } from "../modelo/tipos";

function v(id: string, nombre: string, creadoEn: string): VersionResumen {
  return { id, nombre, creadoEn, modeloPayloadKey: id, bytes: 10 };
}

describe("esVersionDeAgente", () => {
  test("prefijo agente· → true", () => { expect(esVersionDeAgente(v("1", "agente·nota", "2026-07-07T10:00:00Z"))).toBe(true); });
  test("humano → false", () => { expect(esVersionDeAgente(v("1", "Guardado manual", "2026-07-07T10:00:00Z"))).toBe(false); });
});

describe("agruparHistorialPorSesionAgente", () => {
  test("lista vacía → []", () => { expect(agruparHistorialPorSesionAgente([])).toEqual([]); });
  test("solo humanas → todas individuales", () => {
    const out = agruparHistorialPorSesionAgente([v("a", "Manual", "2026-07-07T12:00:00Z"), v("b", "Manual", "2026-07-07T11:00:00Z")]);
    expect(out.map((f) => f.tipo)).toEqual(["individual", "individual"]);
  });
  test("corrida consecutiva de agente → una fila sesion-agente", () => {
    const versiones = [
      v("a3", "agente·paso 3", "2026-07-07T12:03:00Z"),
      v("a2", "agente·paso 2", "2026-07-07T12:02:00Z"),
      v("a1", "agente·paso 1", "2026-07-07T12:01:00Z"),
      v("h", "Manual", "2026-07-07T12:00:00Z"),
    ];
    const out = agruparHistorialPorSesionAgente(versiones);
    expect(out.map((f) => f.tipo)).toEqual(["sesion-agente", "individual"]);
    const grupo = out[0];
    if (grupo.tipo !== "sesion-agente") throw new Error("esperaba grupo");
    expect(grupo.versiones).toHaveLength(3);
    expect(grupo.desde).toBe("2026-07-07T12:01:00Z"); // más antigua de la corrida
    expect(grupo.hasta).toBe("2026-07-07T12:03:00Z"); // más nueva de la corrida
  });
  test("dos sesiones separadas por una humana → dos grupos", () => {
    const versiones = [
      v("b2", "agente·b2", "2026-07-07T14:02:00Z"),
      v("b1", "agente·b1", "2026-07-07T14:01:00Z"),
      v("h", "Manual", "2026-07-07T13:00:00Z"),
      v("a2", "agente·a2", "2026-07-07T12:02:00Z"),
      v("a1", "agente·a1", "2026-07-07T12:01:00Z"),
    ];
    const out = agruparHistorialPorSesionAgente(versiones);
    expect(out.map((f) => f.tipo)).toEqual(["sesion-agente", "individual", "sesion-agente"]);
  });
  test("una sola versión de agente → sesion-agente de 1 (sigue siendo hito honesto)", () => {
    const out = agruparHistorialPorSesionAgente([v("a", "agente·x", "2026-07-07T12:00:00Z")]);
    expect(out).toHaveLength(1);
    expect(out[0].tipo).toBe("sesion-agente");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && bun test src/mesa/historialAgente.test.ts`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Write minimal implementation**

```typescript
// app/src/mesa/historialAgente.ts
import type { VersionResumen } from "../modelo/tipos";

/** El CLI de agente etiqueta cada push `agente·<nota>` (mesa-cli.ts). */
export function esVersionDeAgente(v: VersionResumen): boolean {
  return v.nombre.startsWith("agente·");
}

export type FilaHistorial =
  | { tipo: "individual"; version: VersionResumen }
  | { tipo: "sesion-agente"; versiones: VersionResumen[]; desde: string; hasta: string };

/**
 * Agrupa corridas CONSECUTIVAS de versiones de agente en un hito colapsable.
 * El orden de entrada se preserva (el caller entrega desc por `creadoEn`).
 * Una «sesión» = maximal run de versiones `agente·` sin versión humana en medio.
 * `hasta` = más nueva de la corrida, `desde` = más antigua (extremos por creadoEn).
 */
export function agruparHistorialPorSesionAgente(versiones: VersionResumen[]): FilaHistorial[] {
  const filas: FilaHistorial[] = [];
  let corrida: VersionResumen[] = [];
  const cerrar = () => {
    if (corrida.length === 0) return;
    const fechas = corrida.map((v) => v.creadoEn);
    filas.push({ tipo: "sesion-agente", versiones: corrida, desde: min(fechas), hasta: max(fechas) });
    corrida = [];
  };
  for (const version of versiones) {
    if (esVersionDeAgente(version)) {
      corrida.push(version);
    } else {
      cerrar();
      filas.push({ tipo: "individual", version });
    }
  }
  cerrar();
  return filas;
}

function min(xs: string[]): string { return xs.reduce((a, b) => (a <= b ? a : b)); }
function max(xs: string[]): string { return xs.reduce((a, b) => (a >= b ? a : b)); }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd app && bun test src/mesa/historialAgente.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/src/mesa/historialAgente.ts app/src/mesa/historialAgente.test.ts
git commit -m "feat(vitrina): colapso puro de versiones consecutivas de agente en un hito"
```

---

## Task 3: Estado del store + poll de revisión + acciones

**Files:**
- Modify: `app/src/store/tipos.ts` (campos + firmas)
- Modify: `app/src/store/runtime.ts` (singleton del timer)
- Modify: `app/src/store/persistencia.ts` (acciones + fijar base)
- Test: `app/src/store/persistencia.test.ts`

**Interfaces:**
- Consumes: `cargarModeloBackend`, `persistenciaBackendHabilitada` (`persistencia/backend.ts`); `obtenerEstadoStore`/`setEstadoStore` (`runtime.ts`); `cargarLocal`/`abrirDialogoVersiones`/`listarModelosGuardados` (store).
- Produces (campos en `OpmStore`):
  - `revisionRemota: { modeloId: Id; revision: number } | null`
  - `revisionBasePorModelo: Record<Id, number>`
- Produces (acciones en `OpmStore`):
  - `verificarRevisionRemota: () => Promise<void>` — un tick del poll: si hay modelo persistido activo + backend, `GET` su revisión y fija `revisionRemota`.
  - `iniciarPollRevision: () => void` / `detenerPollRevision: () => void` — control del intervalo (singleton en runtime.ts, patrón autosalvado).
  - `traerRevisionDelAgente: () => void` — recarga la revisión del agente (misma acción para «Recargar» y «Descartar los míos…»): `cargarLocal(modeloPersistidoId)` + limpia `revisionRemota`.
  - `verVersionDelAgente: () => void` — refresca versiones + abre `DialogoVersiones`.

- [ ] **Step 1: Añadir campos + firmas a `tipos.ts`**

En `interface OpmStore`, junto a `autosalvado`:
```typescript
  /**
   * A′-vitrina: última revisión remota vista por el poll para el modelo activo,
   * etiquetada por `modeloId` (evita mostrar chip rancio al cambiar de pestaña).
   */
  revisionRemota: { modeloId: Id; revision: number } | null;
  /**
   * A′-vitrina: «base» = revisión que el operador cargó/guardó por-modelo. El
   * chip se muestra sólo si la remota la supera. DEBE avanzar en los guardados
   * propios (guardar/autosalvar/cargar) o el chip gatilla con el propio trabajo.
   */
  revisionBasePorModelo: Record<Id, number>;
```
Y en la sección de acciones (junto a `iniciarAutosalvado`):
```typescript
  verificarRevisionRemota: () => Promise<void>;
  iniciarPollRevision: () => void;
  detenerPollRevision: () => void;
  traerRevisionDelAgente: () => void;
  verVersionDelAgente: () => void;
```

- [ ] **Step 2: Añadir singleton del timer a `runtime.ts`**

Junto a `autosalvadoControl` (líneas ~58-83):
```typescript
let pollRevisionTimer: ReturnType<typeof setInterval> | null = null;
export function obtenerPollRevisionTimer(): ReturnType<typeof setInterval> | null { return pollRevisionTimer; }
export function fijarPollRevisionTimer(timer: ReturnType<typeof setInterval> | null): void { pollRevisionTimer = timer; }
```

- [ ] **Step 3: Escribir el test store que falla**

En `persistencia.test.ts`, dentro del describe existente (reusa `instalarBackendMock`/`esperar`):
```typescript
  test("A′-vitrina: guardado propio NO gatilla el chip; push del agente SÍ", async () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarComoLocal({ nombre: "Modelo vitrina" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    const id = store.getState().modeloPersistidoId!;
    // Guardado propio adicional: la base debe avanzar con la revisión, sin chip.
    store.getState().crearProcesoDemo();
    store.getState().guardarLocal();
    await esperar(() => store.getState().dirty === false);
    await store.getState().verificarRevisionRemota();
    const base1 = store.getState().revisionBasePorModelo[id];
    expect(store.getState().revisionRemota).toEqual({ modeloId: id, revision: base1 }); // remota == base ⇒ oculto
    // Simular push del agente: el backend avanza una revisión por fuera.
    backend.modelos.set(id, { ...backend.modelos.get(id)!, revision: base1 + 1 });
    await store.getState().verificarRevisionRemota();
    expect(store.getState().revisionRemota).toEqual({ modeloId: id, revision: base1 + 1 });
    expect(store.getState().revisionBasePorModelo[id]).toBe(base1); // base intacta ⇒ el selector mostrará el chip
  });

  test("A′-vitrina: traerRevisionDelAgente recarga y limpia revisionRemota", async () => {
    store.getState().crearObjetoDemo();
    store.getState().guardarComoLocal({ nombre: "Modelo traer" });
    await esperar(() => store.getState().mensaje === "Modelo guardado exitosamente");
    const id = store.getState().modeloPersistidoId!;
    const base = store.getState().revisionBasePorModelo[id];
    backend.modelos.set(id, { ...backend.modelos.get(id)!, revision: base + 1 });
    await store.getState().verificarRevisionRemota();
    expect(store.getState().revisionRemota).not.toBeNull();
    store.getState().traerRevisionDelAgente();
    await esperar(() => store.getState().revisionRemota === null);
    expect(store.getState().revisionBasePorModelo[id]).toBe(base + 1); // base avanzó al recargar
  });
```
(El mock necesita exponer `backend`; ya está en el scope del describe.)

- [ ] **Step 4: Run test to verify it fails**

Run: `cd app && bun test src/store/persistencia.test.ts -t "A′-vitrina"`
Expected: FAIL — acciones/campos inexistentes.

- [ ] **Step 5: Implementar en `persistencia.ts`**

(a) En el objeto del slice, campos iniciales:
```typescript
  revisionRemota: null,
  revisionBasePorModelo: {},
```
(b) Fijar base en los 3 upsert. En `finalizarGuardado` (`:351` set) añadir a `estadoModelo(modelo, {...})`:
```typescript
      revisionBasePorModelo: conBase(get().revisionBasePorModelo, guardado.id, guardado.revision),
```
En `cargarLocal` (`:411` set) añadir:
```typescript
      revisionBasePorModelo: conBase(get().revisionBasePorModelo, cargado.value.id, cargado.value.revision),
```
En autosave (`:492` setEstadoStore) añadir:
```typescript
      revisionBasePorModelo: conBase(obtenerEstadoStore().revisionBasePorModelo, guardado.value.id, guardado.value.revision),
```
Y el helper puro al final del archivo:
```typescript
function conBase(mapa: Record<string, number>, id: string, revision: number | undefined): Record<string, number> {
  if (typeof revision !== "number") return mapa;
  return { ...mapa, [id]: revision };
}
```
(c) Las acciones (dentro del slice):
```typescript
  async verificarRevisionRemota() {
    const { modeloPersistidoId } = get();
    if (!modeloPersistidoId || !persistenciaBackendHabilitada()) return;
    const cargado = await cargarModeloBackend(modeloPersistidoId);
    if (!cargado.ok || typeof cargado.value.revision !== "number") return;
    // Anti-race: sólo fija si el modelo activo sigue siendo el mismo.
    if (get().modeloPersistidoId !== modeloPersistidoId) return;
    set({ revisionRemota: { modeloId: modeloPersistidoId, revision: cargado.value.revision } });
  },

  iniciarPollRevision() {
    if (obtenerPollRevisionTimer()) return;
    void get().verificarRevisionRemota();
    const timer = setInterval(() => { void obtenerEstadoStore().verificarRevisionRemota(); }, POLL_REVISION_MS);
    fijarPollRevisionTimer(timer);
  },

  detenerPollRevision() {
    const timer = obtenerPollRevisionTimer();
    if (timer) clearInterval(timer);
    fijarPollRevisionTimer(null);
  },

  traerRevisionDelAgente() {
    const { modeloPersistidoId } = get();
    if (!modeloPersistidoId) return;
    set({ revisionRemota: null });
    get().cargarLocal(modeloPersistidoId);
  },

  verVersionDelAgente() {
    const { modeloPersistidoId } = get();
    if (!modeloPersistidoId) return;
    get().listarModelosGuardados();
    get().abrirDialogoVersiones(modeloPersistidoId);
  },
```
(d) Constante e imports: al tope de `persistencia.ts` añadir `POLL_REVISION_MS`:
```typescript
const POLL_REVISION_MS = 15_000; // poll ligero de revisión (patrón autosalvado)
```
y añadir `obtenerPollRevisionTimer, fijarPollRevisionTimer` al import de `./runtime`.

(e) `abrirPestanaConModelo` (en `pestanas.ts`): tras `activarPestanaNueva`, fijar base:
```typescript
        setEstadoStore({ revisionBasePorModelo: conBase(get().revisionBasePorModelo, cargado.value.id, cargado.value.revision) });
```
(usar el mismo helper — exportarlo desde persistencia.ts o duplicar la guarda de 2 líneas; preferir exportarlo).

- [ ] **Step 6: Run test to verify it passes**

Run: `cd app && bun test src/store/persistencia.test.ts -t "A′-vitrina"`
Expected: PASS (2 tests). Luego `bun run typecheck` verde.

- [ ] **Step 7: Commit**

```bash
git add app/src/store/tipos.ts app/src/store/runtime.ts app/src/store/persistencia.ts app/src/store/pestanas.ts app/src/store/persistencia.test.ts
git commit -m "feat(vitrina): poll de revisión + base por-modelo + acciones traer/ver (base avanza en guardado propio)"
```

---

## Task 4: Chip de chrome `ChipRevisionNueva` + viewmodel + montaje + poll

**Files:**
- Modify: `app/src/app/ports/persistencePort.ts` + `app/src/app/ports/zustandPersistencePort.ts`
- Create: `app/src/app/viewmodels/chipRevisionViewModel.ts`
- Create: `app/src/ui/toolbar/ChipRevisionNueva.tsx`
- Modify: `app/src/ui/toolbar/ToolbarBase.tsx`
- Test: `app/src/app/viewmodels/chipRevisionViewModel.test.ts`

**Interfaces:**
- Consumes: `evaluarVitrina` (Task 1); store fields/actions (Task 3).
- Produces:
  - `chipRevisionViewModel(): { estado: EstadoVitrina; traer: () => void; verVersion: () => void }` (hook `useChipRevisionViewModel`).
  - `ChipRevisionNueva(): preact.JSX.Element | null` — renderiza `null` si `!estado.visible`; si `!hayCambiosLocales` un botón «Recargar»; si `hayCambiosLocales` dos botones «Ver la del agente» + «Descartar los míos y traer la del agente».

- [ ] **Step 1: Exponer campos/acciones en el port**

En `persistencePort.ts` añadir a la interfaz:
```typescript
  revisionRemota: OpmStore["revisionRemota"];
  revisionBase: number | null;
  iniciarPollRevision: OpmStore["iniciarPollRevision"];
  traerRevisionDelAgente: OpmStore["traerRevisionDelAgente"];
  verVersionDelAgente: OpmStore["verVersionDelAgente"];
```
En `zustandPersistencePort.ts` derivar y devolver (base = `revisionBasePorModelo[modeloPersistidoId]`):
```typescript
  const revisionRemota = useOpmStore((s) => s.revisionRemota);
  const revisionBasePorModelo = useOpmStore((s) => s.revisionBasePorModelo);
  const iniciarPollRevision = useOpmStore((s) => s.iniciarPollRevision);
  const traerRevisionDelAgente = useOpmStore((s) => s.traerRevisionDelAgente);
  const verVersionDelAgente = useOpmStore((s) => s.verVersionDelAgente);
  const revisionBase = modeloPersistidoId ? (revisionBasePorModelo[modeloPersistidoId] ?? null) : null;
```
y agregarlos al objeto retornado.

- [ ] **Step 2: Escribir el test del viewmodel que falla**

`chipRevisionViewModel.test.ts` — probar el mapeo store→selector con el store real (patrón de `panelOplViewModel.test.ts`). Mínimo:
```typescript
import { describe, expect, test } from "bun:test";
import { store } from "../../store";
import { evaluarVitrina } from "../../mesa/revisionVitrina";

describe("chipRevisionViewModel (mapeo)", () => {
  test("evaluarVitrina consume los campos del store sin romper con estado inicial", () => {
    const s = store.getState();
    const estado = evaluarVitrina({
      modeloPersistidoId: s.modeloPersistidoId,
      revisionRemota: s.revisionRemota,
      revisionBase: s.modeloPersistidoId ? (s.revisionBasePorModelo[s.modeloPersistidoId] ?? null) : null,
      dirty: s.dirty,
    });
    expect(estado.visible).toBe(false); // estado inicial: no persistido
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `cd app && bun test src/app/viewmodels/chipRevisionViewModel.test.ts`
Expected: FAIL — módulo/campos inexistentes (hasta implementar el viewmodel + Task 3 mergeada).

- [ ] **Step 4: Implementar viewmodel + chip**

`chipRevisionViewModel.ts`:
```typescript
import { useZustandPersistencePort } from "../ports/zustandPersistencePort";
import { useOpmStore } from "../../store";
import { evaluarVitrina, type EstadoVitrina } from "../../mesa/revisionVitrina";

export function useChipRevisionViewModel(): { estado: EstadoVitrina; traer: () => void; verVersion: () => void } {
  const p = useZustandPersistencePort();
  const dirty = useOpmStore((s) => s.dirty);
  const estado = evaluarVitrina({
    modeloPersistidoId: p.modeloPersistidoId,
    revisionRemota: p.revisionRemota,
    revisionBase: p.revisionBase,
    dirty,
  });
  return { estado, traer: p.traerRevisionDelAgente, verVersion: p.verVersionDelAgente };
}
```

`ChipRevisionNueva.tsx` (TINTA; glifo «↓» inline SVG monocromo, NO ⟳; botones planos, `borderRadius: 0`, `boxShadow: "none"`, sólo `tokens.colors.*`). `data-testid="chip-revision-nueva"`, botones `data-testid` `revision-recargar` / `revision-ver` / `revision-descartar`. Sigue el estilo `inlineStatusButton` del vecino (`toolbarStyles.ts`). El componente devuelve `null` cuando `!estado.visible`.

- [ ] **Step 5: Montar en el chrome + arrancar el poll**

En `ToolbarBase.tsx`: importar `ChipRevisionNueva`; añadir `useEffect(() => iniciarPollRevision(), [iniciarPollRevision])` junto al de autosalvado (:161); montar `<ChipRevisionNueva />` en `cluster-modelo` tras `<ToolbarPersistenceStatus … />` (:295). `iniciarPollRevision` se expone al `ToolbarBase` vía el viewmodel `toolbarBaseViewModel`/port (añadir si falta) o vía `useZustandPersistencePort`.

- [ ] **Step 6: Gate visual + tests**

Run: `cd app && bun run check && bun run lint && bun run design:governance`
Expected: verde. `design:governance` no debe reportar sombras offset ni desajuste de tokens (el chip sólo usa `ink`/`ink70`/`rule`/`paper`).

- [ ] **Step 7: Commit**

```bash
git add app/src/app/ports/persistencePort.ts app/src/app/ports/zustandPersistencePort.ts app/src/app/viewmodels/chipRevisionViewModel.ts app/src/app/viewmodels/chipRevisionViewModel.test.ts app/src/ui/toolbar/ChipRevisionNueva.tsx app/src/ui/toolbar/ToolbarBase.tsx
git commit -m "feat(vitrina): chip ramificado revisión nueva (TINTA, Recargar / Ver la del agente / Descartar los míos)"
```

---

## Task 5: Colapso de hitos en `DialogoVersiones`

**Files:**
- Modify: `app/src/app/viewmodels/dialogoVersionesViewModel.ts`
- Modify: `app/src/ui/DialogoVersiones.tsx`

**Interfaces:**
- Consumes: `agruparHistorialPorSesionAgente`, `FilaHistorial` (Task 2).
- Produces: el viewmodel expone `filas: FilaHistorial[]` (además de `versiones` para compat). El diálogo renderiza cada `individual` como fila normal y cada `sesion-agente` como una fila-hito colapsada con toggle de expansión (estado local `useState<Set<string>>`), que al expandir muestra las versiones internas (cada una con «Restaurar como copia» / «Eliminar» como hoy).

- [ ] **Step 1: Extender el viewmodel**

En `dialogoVersionesViewModel.ts`, tras calcular `versiones`:
```typescript
  const filas = useMemo(() => agruparHistorialPorSesionAgente(versiones), [versiones]);
```
y devolver `filas`.

- [ ] **Step 2: Renderizar grupos en el diálogo**

En `DialogoVersiones.tsx`, reemplazar el `.map(version => <tr>…)` por un recorrido de `filas`: `individual` → la fila actual; `sesion-agente` → una fila-resumen con `▸/▾` (clic togglea el `Set` de expandidos, clave = `desde`), copy `Sesión de agente · {versiones.length} revisiones · {fecha(desde)}–{fecha(hasta)}`, y si está expandida, las filas internas debajo (mismas acciones). `data-testid` `hito-sesion-agente` en la fila-resumen. Sólo tokens; sin colores nuevos.

- [ ] **Step 3: Gate**

Run: `cd app && bun run check && bun run lint`
Expected: verde.

- [ ] **Step 4: Commit**

```bash
git add app/src/app/viewmodels/dialogoVersionesViewModel.ts app/src/ui/DialogoVersiones.tsx
git commit -m "feat(vitrina): colapso de sesión de agente en un hito expandible del historial"
```

---

## Task 6: E2E + gate completo + verificación in-vivo

**Files:**
- Create: `app/e2e/40-vitrina-revision.spec.ts`

- [ ] **Step 1: E2E de las dos ramas + colapso**

Contra el dev server con backend memoria (`devModelPersistence`): (a) crear+guardar un modelo; (b) simular push del agente escribiendo una revisión avanzada + versión `agente·…` por el endpoint (o inyectando en el backend memoria vía `page.evaluate` sobre el store); (c) sin editar → aparece «Recargar»; (d) editar → aparecen «Ver la del agente» + «Descartar los míos y traer la del agente»; (e) abrir versiones → el push del agente aparece colapsado como «Sesión de agente». Reusar el patrón de inyección de store de e2e existentes.

- [ ] **Step 2: Gate completo**

```bash
cd app
bun run check && bun run lint && bun run design:governance
# apagar dev server antes del smoke (flake canvas):
bun run browser:smoke
```
Expected: todo verde; smoke sin fallos nuevos sobre la base.

- [ ] **Step 3: Verificación in-vivo (ambas ramas)**

Levantar `bun run dev`, con Playwright MCP: guardar un modelo, simular el push del agente (avanzar revisión + versión `agente·`), confirmar visualmente el chip en ambas ramas (limpio → «Recargar»; dirty → dos botones) y el colapso en el diálogo. Capturas a `test-results/`.

- [ ] **Step 4: Commit del cierre**

```bash
git add app/e2e/40-vitrina-revision.spec.ts
git commit -m "test(vitrina): e2e de las dos ramas del chip + colapso de hito de sesión de agente"
```

---

## Self-Review (cobertura de spec §6)

- **Chip ramificado** (sin cambios locales → Recargar; con cambios → Ver la del agente + Descartar los míos): Task 1 (selector) + Task 4 (chip). Nombrado por su costo: label explícito, sin confirm redundante.
- **Reuso del visor de versiones** (no visor nuevo): Task 4 (`verVersionDelAgente` → `abrirDialogoVersiones`) + Task 5 (mismo `DialogoVersiones`).
- **Detección honesta de «cambios locales»**: Global Constraint + Task 1 — `dirty` a secas, justificado por el 409; base propia avanza (Task 3) para no cry-wolf.
- **Colapso de hitos por sesión de agente** (ancla = pre-agente): Task 2 (agrupador) + Task 5 (render). «Sesión» = corrida consecutiva de `agente·`; el pre-agente es la fila individual siguiente en el orden desc.
- **Gobierno visual TINTA / diferenciación del drift**: Global Constraint + Task 4 Step 6 (`design:governance`).
- **Riesgo dirty-bit (§9)**: resuelto en Task 1 + notas-vitrina.md.
