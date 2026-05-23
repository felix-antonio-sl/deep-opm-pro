# Simulación B0 conceptual al 100% (autocontenido) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cerrar la parte autocontenida de EPICA-B0 (simulación conceptual) sobre el kernel actual: token viajero animado, OPL highlight del paso, atajo Espacio, slider 0.25–4×, headless explícito, borde de estado inicial, tooltips, y verificación de navegación OPD durante simulación.

**Architecture:** El kernel de simulación (`modelo/simulacion/*`) ya es puro y completo; se reutiliza `enlacesInvolucradosEnPaso` y `focoPasoActualSimulacion` sin tocarlos. Los cambios viven en store (slice `simulacion.ts`: velocidad continua + headless), render (`JointCanvas`/`halos.ts`: token + borde oliva), UI (`BarraSimulacion`, `panelOpl/Bloques`), y ports (atajo Espacio). La animación es responsabilidad exclusiva del adaptador render (no es verdad de modelo).

**Tech Stack:** Bun + Vite + Preact + Zustand + JointJS 3.7 core OSS + Playwright. Tests unitarios con `bun:test`; smoke con Playwright. JSX `jsxImportSource: preact`.

**Spec:** `docs/superpowers/specs/2026-05-24-simulacion-b0-conceptual-100-design.md`

---

## File Structure

- `app/src/store/simulacion.ts` — MODIFY: `normalizarVelocidadSimulacion` pasa de cuantizar a clamp continuo [0.25,4]; añade `headlessSimulacion` + `alternarHeadlessSimulacion`.
- `app/src/store/sliceTypes.ts` — MODIFY: extiende `SimulacionSlice` con `headlessSimulacion` y `alternarHeadlessSimulacion`.
- `app/src/store/simulacion.test.ts` — CREATE: tests de clamp de velocidad y toggle headless.
- `app/src/app/ports/simulationPort.ts` + `zustandSimulationPort.ts` — MODIFY: exponen `headless` + `alternarHeadless`.
- `app/src/app/ports/globalShortcutsPort.ts` — MODIFY: atajo `Espacio` con guard; añade campos al snapshot.
- `app/src/app/ports/globalShortcutsPort.test.ts` — CREATE (o extender si existe): guard del atajo Espacio.
- `app/src/modelo/simulacion/animacionTokens.ts` — CREATE: helper puro `debeAnimarTokensSim` + `tokensViajeDelPaso`.
- `app/src/modelo/simulacion/animacionTokens.test.ts` — CREATE.
- `app/src/render/jointjs/composers/halos.ts` — MODIFY: `proyectarHaloSimulacionEstadoInicial`.
- `app/src/render/jointjs/proyeccion.ts` — MODIFY: emite el halo de estado inicial cuando hay sim activa; añade `estadosInicialesIds` a `OpcionesSimulacionRender`.
- `app/src/render/jointjs/JointCanvas.tsx` — MODIFY: efecto que dispara `sendToken` sobre enlaces en uso (si `!headless`).
- `app/src/ui/simulacion/BarraSimulacion.tsx` — MODIFY: slider 0.25–4×, toggle headless, tooltips, ocultar controles no aplicables.
- `app/src/ui/panelOpl/Bloques.tsx` — MODIFY: resalta la línea OPL del proceso activo en simulación.
- `app/e2e/12-beta2-modo-simulacion.spec.ts` — MODIFY: smokes nuevos.
- `docs/HANDOFF.md` — MODIFY: registra cierre + diferidos B0.014 / B0.020–022.

---

## Task 1: Slider de velocidad continuo 0.25–4× (B0.011 / B0.012)

**Files:**
- Modify: `app/src/store/simulacion.ts:144-149`
- Test: `app/src/store/simulacion.test.ts` (create)
- Modify: `app/src/ui/simulacion/BarraSimulacion.tsx:78-94`

- [ ] **Step 1: Write the failing test**

Create `app/src/store/simulacion.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import { normalizarVelocidadSimulacion } from "./simulacion";

describe("normalizarVelocidadSimulacion", () => {
  test("clamp continuo al rango [0.25, 4]", () => {
    expect(normalizarVelocidadSimulacion(0.25)).toBe(0.25);
    expect(normalizarVelocidadSimulacion(4)).toBe(4);
    expect(normalizarVelocidadSimulacion(1.7)).toBe(1.7);
  });

  test("recorta fuera de rango a los extremos", () => {
    expect(normalizarVelocidadSimulacion(0.1)).toBe(0.25);
    expect(normalizarVelocidadSimulacion(10)).toBe(4);
  });

  test("valor no finito cae a 1", () => {
    expect(normalizarVelocidadSimulacion(Number.NaN)).toBe(1);
    expect(normalizarVelocidadSimulacion(Number.POSITIVE_INFINITY)).toBe(4);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && bun test src/store/simulacion.test.ts`
Expected: FAIL — `normalizarVelocidadSimulacion` no está exportada (hoy es `function` privada que cuantiza a 0.5/1/2).

- [ ] **Step 3: Reemplaza la cuantización por clamp continuo y exporta**

En `app/src/store/simulacion.ts` reemplaza la función (líneas 144-149):

```ts
export function normalizarVelocidadSimulacion(velocidad: number): number {
  if (!Number.isFinite(velocidad)) return velocidad === Number.POSITIVE_INFINITY ? 4 : 1;
  return Math.min(4, Math.max(0.25, velocidad));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd app && bun test src/store/simulacion.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Cambia el `<select>` por `<input type="range">` en la barra**

En `app/src/ui/simulacion/BarraSimulacion.tsx` reemplaza el bloque `<label style={style.velocidadControl}>…</label>` (líneas 78-94) por:

```tsx
        <label style={style.velocidadControl} title="Velocidad de reproducción (0.25× a 4×)">
          <span style={style.velocidadTexto}>Velocidad {velocidadSimulacion}×</span>
          <input
            type="range"
            min="0.25"
            max="4"
            step="0.25"
            value={String(velocidadSimulacion)}
            onInput={(event) => {
              const target = event.currentTarget as HTMLInputElement;
              fijarVelocidad(Number(target.value));
            }}
            disabled={totalPasos === 0}
            style={style.velocidadSelect}
            data-testid="barra-simulacion-velocidad"
            aria-label="Velocidad de simulación"
          />
        </label>
```

- [ ] **Step 6: Verifica typecheck + lint**

Run: `cd app && bun run typecheck && bun run lint`
Expected: OK.

- [ ] **Step 7: Commit**

```bash
git add app/src/store/simulacion.ts app/src/store/simulacion.test.ts app/src/ui/simulacion/BarraSimulacion.tsx
git commit -m "feat(sim): velocidad continua 0.25-4x con slider (B0.011/012)"
```

---

## Task 2: Toggle Headless runner (B0.015)

**Files:**
- Modify: `app/src/store/sliceTypes.ts` (interface `SimulacionSlice`)
- Modify: `app/src/store/simulacion.ts` (estado inicial + acción)
- Modify: `app/src/app/ports/simulationPort.ts`, `app/src/app/ports/zustandSimulationPort.ts`
- Modify: `app/src/ui/simulacion/BarraSimulacion.tsx`
- Test: `app/src/store/simulacion.test.ts` (extender)

- [ ] **Step 1: Write the failing test**

Añade a `app/src/store/simulacion.test.ts`:

```ts
import { createStore } from "../store"; // helper existente del proyecto para store de test

// Si el proyecto ya tiene un helper de store en store.test.ts, replícalo aquí.
describe("headless simulacion", () => {
  test("alternarHeadlessSimulacion togglea el flag", () => {
    const store = createStore();
    expect(store.getState().headlessSimulacion).toBe(false);
    store.getState().alternarHeadlessSimulacion();
    expect(store.getState().headlessSimulacion).toBe(true);
    store.getState().alternarHeadlessSimulacion();
    expect(store.getState().headlessSimulacion).toBe(false);
  });
});
```

Nota: usa el mismo patrón de construcción de store que `app/src/store.test.ts` (revisar sus primeras líneas para el import/helper exacto antes de escribir este test).

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && bun test src/store/simulacion.test.ts -t "headless"`
Expected: FAIL — `headlessSimulacion` / `alternarHeadlessSimulacion` no existen.

- [ ] **Step 3: Añade el campo y la acción al tipo del slice**

En `app/src/store/sliceTypes.ts`, dentro de `SimulacionSlice` (alrededor de la línea 261), añade:

```ts
  headlessSimulacion: boolean;
  alternarHeadlessSimulacion: () => void;
```

- [ ] **Step 4: Implementa en el slice**

En `app/src/store/simulacion.ts`, añade al objeto retornado (junto a `velocidadSimulacion: 1`):

```ts
  headlessSimulacion: false,

  alternarHeadlessSimulacion() {
    set({ headlessSimulacion: !get().headlessSimulacion });
  },
```

- [ ] **Step 5: Expón en el puerto**

En `app/src/app/ports/simulationPort.ts` añade al `interface SimulationPort`:

```ts
  headless: OpmStore["headlessSimulacion"];
  alternarHeadless: OpmStore["alternarHeadlessSimulacion"];
```

En `app/src/app/ports/zustandSimulationPort.ts` añade los selectores y al objeto retornado:

```ts
  const headless = useOpmStore((s) => s.headlessSimulacion);
  const alternarHeadless = useOpmStore((s) => s.alternarHeadlessSimulacion);
```
```ts
    headless,
    alternarHeadless,
```

- [ ] **Step 6: Run test to verify it passes**

Run: `cd app && bun test src/store/simulacion.test.ts -t "headless"`
Expected: PASS.

- [ ] **Step 7: Añade el toggle en la barra**

En `BarraSimulacion.tsx`, destructura `headless` y `alternarHeadless` del puerto (líneas 18-29) y añade un botón en el segundo `style.cluster` (antes de "Salir"):

```tsx
        <button
          type="button"
          style={style.boton}
          onClick={alternarHeadless}
          aria-pressed={headless}
          title="Headless: corre sin animación, salto directo al final"
          data-testid="barra-simulacion-headless"
        >
          {headless ? "Headless ✓" : "Headless"}
        </button>
```

- [ ] **Step 8: Verifica typecheck + lint**

Run: `cd app && bun run typecheck && bun run lint`
Expected: OK.

- [ ] **Step 9: Commit**

```bash
git add app/src/store/simulacion.ts app/src/store/sliceTypes.ts app/src/store/simulacion.test.ts app/src/app/ports/simulationPort.ts app/src/app/ports/zustandSimulationPort.ts app/src/ui/simulacion/BarraSimulacion.tsx
git commit -m "feat(sim): toggle headless runner explicito (B0.015)"
```

---

## Task 3: Atajo Espacio Play/Pausa con guard (B0.028)

**Files:**
- Modify: `app/src/app/ports/globalShortcutsPort.ts`
- Test: `app/src/app/ports/globalShortcutsPort.test.ts` (create)

El atajo solo debe actuar cuando hay simulación activa (`contextoSimulacion !== null`). El registro de atajos ya filtra inputs editables por contexto `canvas`/`global`; el guard adicional es por estado de simulación.

- [ ] **Step 1: Write the failing test**

Create `app/src/app/ports/globalShortcutsPort.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import { registrarAtajosAplicacion, type GlobalShortcutsPort, type ShortcutRegistration } from "./globalShortcutsPort";

function capturar(): { registros: ShortcutRegistration[]; port: GlobalShortcutsPort; sim: { activa: boolean; auto: boolean; toggles: number } } {
  const sim = { activa: false, auto: false, toggles: 0 };
  const base = { /* campos mínimos del snapshot */ } as unknown as ReturnType<GlobalShortcutsPort["snapshot"]>;
  const port: GlobalShortcutsPort = {
    vistaMapaActiva: () => false,
    snapshot: () => ({
      ...base,
      simulacionActiva: sim.activa,
      autoAvanceSimulacionActivo: sim.auto,
      iniciarAutoAvanceSimulacion: () => { sim.toggles++; },
      pausarAutoAvanceSimulacion: () => { sim.toggles++; },
    }),
  };
  const registros: ShortcutRegistration[] = [];
  registrarAtajosAplicacion(port, (r) => { registros.push(r); return () => {}; });
  return { registros, port, sim };
}

describe("atajo Espacio en simulación", () => {
  test("no actúa fuera de modo simulación", () => {
    const { registros, sim } = capturar();
    const espacio = registros.find((r) => r.combo === "Space");
    expect(espacio).toBeDefined();
    espacio!.handler(new KeyboardEvent("keydown", { key: " " }));
    expect(sim.toggles).toBe(0);
  });

  test("togglea play/pausa con simulación activa", () => {
    const { registros, sim } = capturar();
    sim.activa = true;
    const espacio = registros.find((r) => r.combo === "Space")!;
    espacio.handler(new KeyboardEvent("keydown", { key: " " }));
    expect(sim.toggles).toBe(1);
  });
});
```

Nota: completa `base` con los campos del snapshot que el constructor toca al registrar (ver `GlobalShortcutsSnapshot`); para este test bastan los de simulación más los obligatorios. Ajusta si el typecheck exige más.

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && bun test src/app/ports/globalShortcutsPort.test.ts`
Expected: FAIL — no existe atajo `Space` ni campos `simulacionActiva` en el snapshot.

- [ ] **Step 3: Añade los campos al snapshot**

En `app/src/app/ports/globalShortcutsPort.ts`, dentro de `interface GlobalShortcutsSnapshot` añade:

```ts
  simulacionActiva: boolean;
  autoAvanceSimulacionActivo: boolean;
  iniciarAutoAvanceSimulacion: () => void;
  pausarAutoAvanceSimulacion: () => void;
```

- [ ] **Step 4: Registra el atajo con guard**

Antes del `return [` o dentro del array de `registrarAtajosAplicacion`, añade el helper y el atajo:

```ts
  const togglePlaySimulacion = () => {
    const state = s();
    if (!state.simulacionActiva) return;
    if (state.autoAvanceSimulacionActivo) state.pausarAutoAvanceSimulacion();
    else state.iniciarAutoAvanceSimulacion();
  };
```
```ts
    registrarAtajo({ combo: "Space", ctx: "global", categoria: "navegacion", descripcion: "Reproducir/Pausar simulación", descripcionLarga: "En modo simulación, alterna entre reproducir y pausar", preventDefault: true, handler: togglePlaySimulacion }),
```

- [ ] **Step 5: Cablea los campos en el productor del snapshot**

Busca dónde se construye el snapshot (el adaptador que implementa `GlobalShortcutsPort.snapshot`, típicamente en `app/src/ui/App.tsx` o un hook `useGlobalShortcuts*`). Añade:

```ts
  simulacionActiva: store.contextoSimulacion !== null,
  autoAvanceSimulacionActivo: store.autoAvanceSimulacionActivo,
  iniciarAutoAvanceSimulacion: store.iniciarAutoAvanceSimulacion,
  pausarAutoAvanceSimulacion: store.pausarAutoAvanceSimulacion,
```

Run: `cd app && rg -n "snapshot\\(\\)|vistaMapaActiva:" src/ui src/app` para localizar el productor antes de editar.

- [ ] **Step 6: Run test + typecheck**

Run: `cd app && bun test src/app/ports/globalShortcutsPort.test.ts && bun run typecheck`
Expected: PASS + OK.

- [ ] **Step 7: Commit**

```bash
git add app/src/app/ports/globalShortcutsPort.ts app/src/app/ports/globalShortcutsPort.test.ts app/src/ui/App.tsx
git commit -m "feat(sim): atajo Espacio play/pausa con guard de modo (B0.028)"
```

---

## Task 4: Token verde viajero sobre enlaces en uso (B0.017)

**Files:**
- Create: `app/src/modelo/simulacion/animacionTokens.ts`
- Test: `app/src/modelo/simulacion/animacionTokens.test.ts`
- Modify: `app/src/render/jointjs/JointCanvas.tsx`

La decisión de animar y QUÉ enlaces animar es pura y testeable; el disparo de `sendToken` es render y se valida por smoke.

- [ ] **Step 1: Write the failing test**

Create `app/src/modelo/simulacion/animacionTokens.test.ts`:

```ts
import { describe, expect, test } from "bun:test";
import { debeAnimarTokensSim, tokensViajeDelPaso } from "./animacionTokens";
import type { FocoPasoSimulacion } from "./foco";

const focoEn = (opdId: string, enlaces: string[]): FocoPasoSimulacion => ({
  paso: { opdId } as FocoPasoSimulacion["paso"],
  procesoActivoId: "p1",
  entidadesInvolucradasIds: [],
  enlacesInvolucradosIds: enlaces,
});

describe("debeAnimarTokensSim", () => {
  test("anima cuando el paso vive en el OPD visible y no es headless", () => {
    expect(debeAnimarTokensSim(focoEn("SD", ["e1"]), "SD", false)).toBe(true);
  });
  test("no anima en headless", () => {
    expect(debeAnimarTokensSim(focoEn("SD", ["e1"]), "SD", true)).toBe(false);
  });
  test("no anima si el paso está en otro OPD", () => {
    expect(debeAnimarTokensSim(focoEn("SD1", ["e1"]), "SD", false)).toBe(false);
  });
  test("no anima sin paso activo", () => {
    const sinPaso: FocoPasoSimulacion = { paso: null, procesoActivoId: null, entidadesInvolucradasIds: [], enlacesInvolucradosIds: [] };
    expect(debeAnimarTokensSim(sinPaso, "SD", false)).toBe(false);
  });
});

describe("tokensViajeDelPaso", () => {
  test("devuelve los enlaces involucrados del foco", () => {
    expect(tokensViajeDelPaso(focoEn("SD", ["e1", "e2"]))).toEqual(["e1", "e2"]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && bun test src/modelo/simulacion/animacionTokens.test.ts`
Expected: FAIL — módulo no existe.

- [ ] **Step 3: Implementa el helper puro**

Create `app/src/modelo/simulacion/animacionTokens.ts`:

```ts
import type { Id } from "../tipos";
import type { FocoPasoSimulacion } from "./foco";

/**
 * Decide si el render debe disparar tokens animados sobre el OPD visible.
 * Puro: no toca DOM ni paper. El disparo real vive en el adaptador JointJS.
 */
export function debeAnimarTokensSim(
  foco: FocoPasoSimulacion,
  opdActivoId: Id,
  headless: boolean,
): boolean {
  if (headless) return false;
  if (!foco.paso) return false;
  if (foco.paso.opdId !== opdActivoId) return false;
  return foco.enlacesInvolucradosIds.length > 0;
}

/** Enlaces por los que viaja un token en el paso activo. */
export function tokensViajeDelPaso(foco: FocoPasoSimulacion): Id[] {
  return foco.enlacesInvolucradosIds;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd app && bun test src/modelo/simulacion/animacionTokens.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Dispara `sendToken` en JointCanvas**

En `app/src/render/jointjs/JointCanvas.tsx`:

1. Importa el helper y `V` de jointjs (junto a los imports existentes de jointjs):

```ts
import { V } from "jointjs";
import { debeAnimarTokensSim, tokensViajeDelPaso } from "../../modelo/simulacion/animacionTokens";
import { useZustandSimulationPort } from "../../app/ports/zustandSimulationPort";
```

2. Dentro del componente, obtén `headless` y la velocidad:

```ts
  const { headless: simHeadless, velocidad: simVelocidad } = useZustandSimulationPort();
```

3. Añade un `useEffect` que reaccione al paso activo (después del efecto de proyección, usando el `paper` vivo del `CanvasAdapterContext` ya disponible en el componente). El `focoSimulacion` ya se calcula en la línea ~416:

```ts
  useEffect(() => {
    if (!paper) return;
    if (!debeAnimarTokensSim(focoSimulacion, opdActivoId, simHeadless)) return;
    const duracion = Math.round(900 / simVelocidad); // mismo ritmo que intervaloAutoAvanceMs
    for (const enlaceId of tokensViajeDelPaso(focoSimulacion)) {
      const cell = grafo.getCell(enlaceId);
      if (!cell) continue;
      const linkView = paper.findViewByModel(cell);
      if (!linkView || typeof (linkView as { sendToken?: unknown }).sendToken !== "function") continue;
      const token = V("circle", { r: 6, fill: tokens.colors.bosque, stroke: tokens.colors.paper, "stroke-width": 1 });
      (linkView as unknown as { sendToken: (t: unknown, d: number) => void }).sendToken(token.node, duracion);
    }
  }, [paper, grafo, focoSimulacion, opdActivoId, simHeadless, simVelocidad]);
```

Nota de integración: usa el nombre real del `paper` y del grafo según ya existan en el componente (revisar el efecto de proyección de la línea ~416; el adaptador ya tiene acceso a ambos). **Valida la firma `sendToken` contra docs.jointjs.com vía la skill `jointjs-open-source` antes de fijar la llamada** (en JointJS 3.7 OSS `linkView.sendToken(token, duration)` recorre el path ruteado). Token verde por JOYAS §9: si `halos.ts` ya define un verde de simulación, reutilízalo en vez de `tokens.colors.bosque`.

- [ ] **Step 6: Run typecheck + lint + smoke focal de render**

Run: `cd app && bun run typecheck && bun run lint`
Expected: OK. (El movimiento del token se valida en Task 9 por smoke; jsdom no anima.)

- [ ] **Step 7: Commit**

```bash
git add app/src/modelo/simulacion/animacionTokens.ts app/src/modelo/simulacion/animacionTokens.test.ts app/src/render/jointjs/JointCanvas.tsx
git commit -m "feat(sim): token verde viajero sobre enlaces en uso (B0.017)"
```

---

## Task 5: Borde oliva del estado inicial durante simulación (B0.019)

**Files:**
- Modify: `app/src/render/jointjs/composers/halos.ts`
- Modify: `app/src/render/jointjs/proyeccion.ts` (`OpcionesSimulacionRender` + emisión)
- Test: `app/src/render/jointjs/proyeccion.test.ts` (extender)

Reutiliza el patrón de `proyectarHaloSimulacionEstadoCurrent` ya existente en `halos.ts`. El estado "inicial" es el designado inicial del objeto (ver `estadosDesignaciones`).

- [ ] **Step 1: Write the failing test**

Añade a `app/src/render/jointjs/proyeccion.test.ts` (sigue el patrón de los tests de simulación existentes en ese archivo para construir el modelo y llamar a la proyección con opciones de simulación):

```ts
test("proyecta borde oliva del estado inicial cuando hay simulación activa", () => {
  // Construir modelo con un objeto con estado designado inicial (reusar helper
  // del archivo: crearEstadosIniciales + designarInicial).
  const cells = proyectarModeloAJointCells(modelo, opdId, [], {
    procesoActivoId: null,
    estadosCurrent: {},
    entidadesInvolucradasIds: [],
    enlacesInvolucradosIds: [],
    estadosInicialesIds: [estadoInicialId],
  });
  const halo = cells.find((c) => c.id === `sim-inicial-${aparienciaObjetoId}-${estadoInicialId}`);
  expect(halo).toBeDefined();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && bun test src/render/jointjs/proyeccion.test.ts -t "borde oliva"`
Expected: FAIL — `estadosInicialesIds` no existe en las opciones y el halo no se emite.

- [ ] **Step 3: Añade el proyector en halos.ts**

En `app/src/render/jointjs/composers/halos.ts`, replicando la firma de `proyectarHaloSimulacionEstadoCurrent`:

```ts
/**
 * Borde oliva del estado inicial preservado durante la simulación (B0.019).
 * Color oliva por JOYAS §9; reutiliza el token de estado-inicial si existe.
 */
export function proyectarHaloSimulacionEstadoInicial(
  opdId: Id,
  apariencia: Apariencia,
  estado: { id: Id },
): JointCellJson {
  return {
    id: `sim-inicial-${apariencia.id}-${estado.id}`,
    // ...mismo shape que proyectarHaloSimulacionEstadoCurrent, con stroke oliva
    // grueso (reusar tokens.colors.* — verificar token oliva/ocre; NO literal).
  } as JointCellJson;
}
```

Nota: copia exactamente el cuerpo de `proyectarHaloSimulacionEstadoCurrent` (mismo `markup`/`attrs`/`kind: "simulacion-halo"`) cambiando `tipo` a `"estado-inicial"`, el `id` al prefijo `sim-inicial-`, y el color de stroke al oliva (verificar token existente en `tokens.ts`; si no hay oliva, usar `tokens.colors.warning`/ocre antes que un literal — regla de oro #2).

- [ ] **Step 4: Extiende las opciones y emite el halo en proyeccion.ts**

En `app/src/render/jointjs/proyeccion.ts`:

1. Añade a `interface OpcionesSimulacionRender`:

```ts
  estadosInicialesIds?: readonly Id[];
```

2. Importa `proyectarHaloSimulacionEstadoInicial` y, en el bloque `halosSimulacion` (donde ya se proyectan current/proceso/involucrada), emite el halo inicial para cada estado en `estadosInicialesIds` cuyo objeto tenga apariencia visible en el OPD.

- [ ] **Step 5: Cablea `estadosInicialesIds` desde JointCanvas**

En `JointCanvas.tsx`, donde se construye el objeto `simulacion` (línea ~434), añade:

```ts
            estadosInicialesIds: estadosInicialesDelModelo(modelo),
```

Donde `estadosInicialesDelModelo` deriva los estados designados inicial. Si ya existe un selector en `estadosDesignaciones`, reutilízalo; si no, créalo como helper puro en `modelo/simulacion/foco.ts` y testéalo (un test trivial de derivación).

- [ ] **Step 6: Run test to verify it passes**

Run: `cd app && bun test src/render/jointjs/proyeccion.test.ts -t "borde oliva"`
Expected: PASS.

- [ ] **Step 7: typecheck + lint + commit**

```bash
cd app && bun run typecheck && bun run lint
git add app/src/render/jointjs/composers/halos.ts app/src/render/jointjs/proyeccion.ts app/src/render/jointjs/proyeccion.test.ts app/src/render/jointjs/JointCanvas.tsx app/src/modelo/simulacion/foco.ts
git commit -m "feat(sim): borde oliva del estado inicial durante simulacion (B0.019)"
```

---

## Task 6: Highlight de la frase OPL del proceso activo (B0.025)

**Files:**
- Modify: `app/src/ui/panelOpl/Bloques.tsx`
- Modify: el contenedor que pasa props a `Bloques` (PanelOpl)
- Test: smoke (Task 9); unit del helper si se extrae

El panel OPL no se reemite; solo se resalta la línea cuyo proceso es el activo. Reutiliza `lineaTocaReferencia` (ya importado en `Bloques.tsx`) con una referencia de tipo entidad apuntando a `procesoActivoId`.

- [ ] **Step 1: Pasa el proceso activo de simulación a Bloques**

En el componente `PanelOpl` (contenedor de `Bloques`), lee el foco de simulación y pásalo como prop. Añade a `BloquesProps` en `Bloques.tsx`:

```ts
  procesoActivoSimId: string | null;
```

- [ ] **Step 2: Resalta la línea del proceso activo**

En `LineaOpl` (dentro de `Bloques.tsx`), calcula si la línea corresponde al proceso activo de simulación y aplica un estilo de fondo de resaltado (token existente, p.ej. `tokens.colors.acentoUiSuave`):

```tsx
const esProcesoActivoSim =
  props.procesoActivoSimId != null &&
  lineaTocaReferencia(props.linea, { tipo: "entidad", id: props.procesoActivoSimId });
```

Aplica `data-testid={esProcesoActivoSim ? "opl-linea-sim-activa" : undefined}` y el estilo de fondo condicional. Verifica la forma exacta de `OplReferencia` para "entidad" en `app/src/opl/interaccion.ts` antes de fijar el objeto.

- [ ] **Step 3: typecheck + lint**

Run: `cd app && bun run typecheck && bun run lint`
Expected: OK.

- [ ] **Step 4: Commit**

```bash
git add app/src/ui/panelOpl/Bloques.tsx app/src/ui/PanelOpl.tsx
git commit -m "feat(sim): highlight OPL de la frase del proceso activo (B0.025)"
```

---

## Task 7: Tooltips y ocultar controles no aplicables en ejecución (B0.010 / B0.030)

**Files:**
- Modify: `app/src/ui/simulacion/BarraSimulacion.tsx`

- [ ] **Step 1: Añade `title` a cada control**

Agrega `title` descriptivo a los botones Paso, Correr, Reiniciar, Salir, Play/Pausa (ej. Play: `title="Reproducir (Espacio)"`, Reiniciar: `title="Volver al estado inicial"`).

- [ ] **Step 2: Oculta/atenúa controles no aplicables durante auto-avance**

Mientras `autoAvance` está activo, Paso/Correr/Reiniciar ya están `disabled`. Refuerza ocultándolos (no solo disabled) cuando `autoAvance === true`, dejando solo Pausa + velocidad visibles, para cumplir B0.010:

```tsx
{!autoAvance ? (
  <>
    {/* botones Paso, Correr, Reiniciar */}
  </>
) : null}
```

- [ ] **Step 3: typecheck + lint + commit**

```bash
cd app && bun run typecheck && bun run lint
git add app/src/ui/simulacion/BarraSimulacion.tsx
git commit -m "feat(sim): tooltips y oculta controles no aplicables en ejecucion (B0.010/030)"
```

---

## Task 8: Verificar navegación OPD durante simulación (B0.026)

**Files:**
- Test: `app/e2e/12-beta2-modo-simulacion.spec.ts` (smoke en Task 9)

`contextoSimulacion` es un campo independiente del store; solo `salirModoSimulacion` lo anula. Cambiar `opdActivoId` por navegación (árbol/atajos) NO debe abortar la simulación, y JointCanvas ya guarda `focoSimulacion.paso?.opdId === opdActivoId` para proyectar halos solo en el OPD del paso.

- [ ] **Step 1: Confirma en código que ninguna acción de navegación anula `contextoSimulacion`**

Run: `cd app && rg -n "contextoSimulacion: null" src/store`
Expected: solo aparece en `salirModoSimulacion`. Si aparece en alguna acción de navegación, abrir bug — el contrato es que navegar preserva la simulación.

- [ ] **Step 2: (cobertura) — el smoke de Task 9 valida el comportamiento en vivo.**

No requiere cambio de código si Step 1 confirma el contrato. Si lo viola, añadir tarea de fix antes de continuar.

---

## Task 9: Smoke extendido + cierre HANDOFF

**Files:**
- Modify: `app/e2e/12-beta2-modo-simulacion.spec.ts`
- Modify: `docs/HANDOFF.md`

- [ ] **Step 1: Añade smokes nuevos**

En `app/e2e/12-beta2-modo-simulacion.spec.ts`, sigue el patrón de los tests existentes (entrar a modo simulación vía menú/command palette) y añade:

```ts
test("simulación: slider ajusta velocidad y Espacio togglea play", async ({ page }) => {
  // entrar a modo simulación (reusar helper del archivo)
  const velocidad = page.getByTestId("barra-simulacion-velocidad");
  await velocidad.fill("2");
  await expect(page.getByTestId("barra-simulacion-auto")).toBeVisible();
  await page.keyboard.press("Space");
  await expect(page.getByTestId("barra-simulacion-auto")).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Space");
  await expect(page.getByTestId("barra-simulacion-auto")).toHaveAttribute("aria-pressed", "false");
});

test("simulación: headless corre sin animación hasta completar", async ({ page }) => {
  // entrar a modo simulación con un OPD que tenga procesos
  await page.getByTestId("barra-simulacion-headless").click();
  await page.getByTestId("barra-simulacion-correr").click();
  await expect(page.getByTestId("barra-simulacion-progreso")).toContainText("Completado");
});

test("simulación: OPL resalta la frase del proceso activo", async ({ page }) => {
  // entrar a modo simulación, ejecutar un paso
  await page.getByTestId("barra-simulacion-paso").click();
  await expect(page.getByTestId("opl-linea-sim-activa")).toBeVisible();
});

test("simulación: navegar a otro OPD no aborta la corrida", async ({ page }) => {
  // entrar a modo simulación; navegar por el árbol a otro OPD; verificar barra sigue visible
  // (reusar helpers de navegación del árbol de e2e/04)
  await expect(page.getByTestId("barra-simulacion")).toBeVisible();
});
```

Ajusta los selectores de "entrar a simulación" al helper real del archivo.

- [ ] **Step 2: Apaga dev server y corre el smoke focal**

Run (con dev server APAGADO — ver CLAUDE.md):
`cd app && bunx playwright test e2e/12-beta2-modo-simulacion.spec.ts`
Expected: todos los tests pasan.

- [ ] **Step 3: Gate completo**

Run: `cd app && bun run check && bun run browser:smoke`
Expected: unit verde, smoke verde.

- [ ] **Step 4: Registra cierre y diferidos en HANDOFF**

En `docs/HANDOFF.md`, añade una sección de cierre que registre: HU cerradas (B0.010/011/012/015/017/019/025/026/028/030), y **diferidos explícitos**: B0.014 (Async paralelo) y B0.020–B0.022 (ciclo OPL-reorden) por dependencia de EPICA-12 (HU-12.016/12.017 pendientes).

- [ ] **Step 5: Commit**

```bash
git add app/e2e/12-beta2-modo-simulacion.spec.ts docs/HANDOFF.md
git commit -m "test(sim): smoke B0 conceptual + cierre HANDOFF con diferidos E12"
```

---

## Notas finales

- **Color**: prohibido introducir literales de color (regla de oro #2 + lint contra literales UI). Token verde/oliva desde `tokens.ts`; si falta, añadir token semántico citando JOYAS §9.
- **JointJS**: validar `sendToken` contra docs.jointjs.com vía skill `jointjs-open-source` antes de fijar la llamada en Task 4.
- **Smoke vs dev server**: apagar `vite dev` antes de correr `browser:smoke` (flakes en specs canvas-sensibles).
- **Diferido**: B0.014 y B0.020–022 NO entran; quedan documentados como dependientes de EPICA-12.
