# Simulación — Motor (unfold) + Experiencia (Codex) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Arrancar la simulación categorial de opforja por sus dos frentes paralelos: **S1 (motor)** generaliza `ejecutarPaso` a un *unfold* parametrizado por un functor de efecto (preservando el comportamiento determinista), y **S0 (experiencia)** canoniza la UX de simulación al lenguaje Codex.

**Architecture:** El motor de simulación (`app/src/modelo/simulacion/`) ya es un anamorfismo a medio construir: `ejecutarPaso` es la coalgebra pura, `ejecutarCorrida` el unfold, `ContextoSimulacion` el carrier. S1 hace explícita esa estructura (tipo `Efecto<T>`, `pasoEfecto`, `desplegar`) con `F=Identidad` (un sucesor) — el enchufe para los modos de S2. S0 toca solo `render`/`ui` (halos, barra) y es disjunto de S1 → **paralelizable**. Diseño completo: `docs/roadmap/simulacion-categorial-opforja.md`.

**Tech Stack:** TypeScript estricto, Bun test. Sin dependencias nuevas. UI: Preact + JointJS + tokens Codex (`ui-forja/`). Gate UX: `cd app && bun run design:governance`.

**Mapa del programa:** S0 (experiencia) ∥ S1 (motor) → S2 (modos por functor) → S3 (tiempo híbrido) → S4 (composición in-zoom). **Este plan detalla S0 y S1** (ejecutables ya); **S2–S4 se bajan a su propio plan cuando S1 esté en `main`** (su código depende del functor que S1 introduce; escribirlo ahora sería inventar). Ver §"Fases siguientes".

---

## File Structure

**S1 — Motor (kernel puro, disjunto de UI):**
- Create: `app/src/modelo/simulacion/efecto.ts` — `Efecto<T>`, `Sucesor<T>`, `efectoUnico`, `tomarUnico`.
- Modify: `app/src/modelo/simulacion/runner.ts` — añadir `pasoEfecto`/`desplegar`; reexpresar `ejecutarPaso`/`ejecutarCorrida` sobre ellos.
- Test: `app/src/modelo/simulacion/efecto.test.ts`, `app/src/leyes/simulacion-unfold.test.ts`.

**S0 — Experiencia (render/ui, disjunto del motor):**
- Modify: `app/src/render/jointjs/composers/halos.ts` — halo proceso activo y estado a paleta Codex.
- Modify: `app/src/ui/simulacion/BarraSimulacion.tsx` — controles-palabra + segmented velocidad + scrubbing de marcos.
- Modify: `app/e2e/12-beta2-modo-simulacion.spec.ts` — actualizar aserciones de color/controles.

---

# FASE S1 — MOTOR (generalizar a unfold). Código fiel.

## Task 1: El functor de efecto `Efecto<T>`

**Files:**
- Create: `app/src/modelo/simulacion/efecto.ts`
- Test: `app/src/modelo/simulacion/efecto.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// app/src/modelo/simulacion/efecto.test.ts
import { describe, expect, test } from "bun:test";
import { efectoUnico, tomarUnico, type Efecto } from "./efecto";

describe("simulacion/efecto", () => {
  test("efectoUnico produce exactamente un sucesor con peso 1 (F=Identidad)", () => {
    const e = efectoUnico({ n: 7 });
    expect(e.sucesores.length).toBe(1);
    expect(e.sucesores[0]!.peso).toBe(1);
    expect(e.sucesores[0]!.estado).toEqual({ n: 7 });
  });

  test("tomarUnico devuelve el estado del primer sucesor", () => {
    expect(tomarUnico(efectoUnico("x"))).toBe("x");
  });

  test("tomarUnico lanza si no hay sucesores", () => {
    const vacio: Efecto<number> = { sucesores: [] };
    expect(() => tomarUnico(vacio)).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && bun test src/modelo/simulacion/efecto.test.ts`
Expected: FAIL — `Cannot find module './efecto'`.

- [ ] **Step 3: Write minimal implementation**

```ts
// app/src/modelo/simulacion/efecto.ts
/**
 * Functor de efecto de la simulación. La simulación es el unfold (anamorfismo)
 * de una coalgebra `paso : EstadoSistema → F(EstadoSistema)`; `Efecto<T>` ES ese
 * F. En el modo determinista (F = Identidad) hay exactamente un sucesor con
 * peso 1. S2 lo extenderá: Powerset (varios sucesores, exhaustivo) y Dist
 * (sucesores con peso = probabilidad, muestreo). Ver docs/roadmap/simulacion-categorial-opforja.md §3.
 */
export interface Sucesor<T> {
  estado: T;
  /** Etiqueta de la rama elegida (vacía en determinista). Trazabilidad UX. */
  rama?: string;
  /** Peso/probabilidad de la rama. 1 en determinista. */
  peso?: number;
}

export interface Efecto<T> {
  sucesores: Sucesor<T>[];
}

/** F = Identidad: un único sucesor, peso 1. */
export function efectoUnico<T>(estado: T): Efecto<T> {
  return { sucesores: [{ estado, peso: 1 }] };
}

/** Toma el sucesor canónico (el primero). Lanza si el efecto es vacío. */
export function tomarUnico<T>(efecto: Efecto<T>): T {
  const primero = efecto.sucesores[0];
  if (!primero) throw new Error("Efecto de simulación sin sucesores");
  return primero.estado;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd app && bun test src/modelo/simulacion/efecto.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add app/src/modelo/simulacion/efecto.ts app/src/modelo/simulacion/efecto.test.ts
git commit -m "feat(simulacion): functor de efecto (Efecto<T>, F=Identidad)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: `pasoEfecto` (la coalgebra) + `ejecutarPaso` delega en ella

Mueve la lógica de `ejecutarPaso` a `pasoEfecto(modelo, ctx): Efecto<ContextoSimulacion>` que envuelve el único sucesor; `ejecutarPaso` pasa a ser `tomarUnico(pasoEfecto(...))`. **Comportamiento idéntico.**

**Files:**
- Modify: `app/src/modelo/simulacion/runner.ts`

- [ ] **Step 1: Write the failing test** (contrato de compatibilidad)

```ts
// añadir a app/src/modelo/simulacion/efecto.test.ts
import { iniciarSimulacion, pasoEfecto, ejecutarPaso } from "./runner";
import { crearModelo, crearProceso } from "../operaciones"; // confirmar firma de crearProceso al abrir operaciones
import type { Resultado } from "../tipos";

function must<T>(r: Resultado<T>): T { if (!r.ok) throw new Error(r.error); return r.value; }

describe("pasoEfecto = ejecutarPaso (F=Identidad)", () => {
  test("pasoEfecto produce 1 sucesor y ejecutarPaso devuelve ese estado", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Procesar"));
    const ini = iniciarSimulacion(modelo, modelo.opdRaizId);
    const efecto = pasoEfecto(modelo, ini);
    expect(efecto.sucesores.length).toBe(1);
    expect(ejecutarPaso(modelo, ini)).toEqual(efecto.sucesores[0]!.estado);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && bun test src/modelo/simulacion/efecto.test.ts`
Expected: FAIL — `pasoEfecto` no existe / no exportado.

- [ ] **Step 3: Refactor `runner.ts`**

Reemplazar la función `ejecutarPaso` actual por el par `pasoEfecto` + `ejecutarPaso` (la lógica es **la misma**, solo envuelta). Añadir el import de `efecto`:

```ts
// arriba de runner.ts
import { efectoUnico, tomarUnico, type Efecto } from "./efecto";
```

```ts
/**
 * La coalgebra: dado el estado actual, produce el efecto con su(s) sucesor(es).
 * F = Identidad (un sucesor). S2 extenderá esta función para Powerset/Dist.
 */
export function pasoEfecto(modelo: Modelo, contexto: ContextoSimulacion): Efecto<ContextoSimulacion> {
  if (contexto.pasoActual >= contexto.plan.length) {
    const completado = contexto.estado === "completado" ? contexto : { ...contexto, estado: "completado" as const };
    return efectoUnico(completado);
  }

  const paso = contexto.plan[contexto.pasoActual]!;
  const transicionesAplicadas: TransicionEstadoSim[] = [];
  const motivosBloqueo: string[] = [];
  const estadosCurrent: Record<Id, Id> = { ...contexto.estadosCurrent };

  for (const transicion of paso.transicionesPlanificadas) {
    if (transicion.estadoAntesId !== null) {
      const observado = estadosCurrent[transicion.entidadId] ?? null;
      if (observado !== transicion.estadoAntesId) {
        const entidadNombre = modelo.entidades[transicion.entidadId]?.nombre ?? transicion.entidadId;
        const esperado = modelo.estados[transicion.estadoAntesId]?.nombre ?? transicion.estadoAntesId;
        motivosBloqueo.push(`${entidadNombre} no está en estado ${esperado}`);
        continue;
      }
    }
    if (transicion.estadoDespuesId !== null) {
      estadosCurrent[transicion.entidadId] = transicion.estadoDespuesId;
    } else if (transicion.estadoAntesId !== null) {
      delete estadosCurrent[transicion.entidadId];
    }
    transicionesAplicadas.push(transicion);
  }

  const { valoresNuevos, cambios: cambiosValor, motivos: motivosValor } = aplicarCambiosValor(
    modelo,
    contexto.valoresRuntime,
    paso,
  );
  motivosBloqueo.push(...motivosValor);

  const entrada: EntradaTraceSim = {
    numero: contexto.pasoActual + 1,
    opdId: paso.opdId,
    opdNombre: paso.opdNombre,
    procesoId: paso.procesoId,
    procesoNombre: paso.procesoNombre,
    transicionesAplicadas,
    cambiosValor,
  };
  if (motivosBloqueo.length > 0) {
    entrada.diagnostico = `No simulable: ${motivosBloqueo.join("; ")}`;
  }

  const nuevoPaso = contexto.pasoActual + 1;
  const siguiente: ContextoSimulacion = {
    ...contexto,
    pasoActual: nuevoPaso,
    estado: nuevoPaso >= contexto.plan.length ? "completado" : "ejecutando",
    estadosCurrent,
    valoresRuntime: valoresNuevos,
    trace: [...contexto.trace, entrada],
  };
  return efectoUnico(siguiente);
}

/** Compat: avanza un paso tomando el sucesor canónico. Comportamiento idéntico al previo. */
export function ejecutarPaso(modelo: Modelo, contexto: ContextoSimulacion): ContextoSimulacion {
  return tomarUnico(pasoEfecto(modelo, contexto));
}
```

- [ ] **Step 4: Run tests**

Run: `cd app && bun test src/modelo/simulacion/efecto.test.ts`
Expected: PASS. Si `crearProceso` tiene otra firma, ajustarla (confirmar contra `modelo/operaciones`).

- [ ] **Step 5: Commit**

```bash
git add app/src/modelo/simulacion/runner.ts app/src/modelo/simulacion/efecto.test.ts
git commit -m "refactor(simulacion): ejecutarPaso delega en pasoEfecto (coalgebra)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: `desplegar` (el unfold) + `ejecutarCorrida` delega

**Files:**
- Modify: `app/src/modelo/simulacion/runner.ts`

- [ ] **Step 1: Reemplazar `ejecutarCorrida`**

```ts
/**
 * El unfold (anamorfismo): despliega la coalgebra desde un estado hasta
 * completar, tomando el sucesor canónico en cada paso. F = Identidad ⟹
 * traza determinista idéntica a iterar `ejecutarPaso`.
 */
export function desplegar(modelo: Modelo, estadoInicial: ContextoSimulacion): ContextoSimulacion {
  let actual = estadoInicial;
  while (actual.pasoActual < actual.plan.length) {
    actual = tomarUnico(pasoEfecto(modelo, actual));
  }
  return actual;
}

/** Compat: corre todos los pasos restantes. Delega en el unfold. */
export function ejecutarCorrida(modelo: Modelo, contexto: ContextoSimulacion): ContextoSimulacion {
  return desplegar(modelo, contexto);
}
```

- [ ] **Step 2: Run the existing suite to confirm no regression**

Run: `cd app && bun test src/modelo/simulacion/`
Expected: PASS (los tests existentes del runner siguen verdes — el comportamiento no cambió).

- [ ] **Step 3: Commit**

```bash
git add app/src/modelo/simulacion/runner.ts
git commit -m "refactor(simulacion): ejecutarCorrida delega en desplegar (unfold)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Ley `law-simulacion-unfold` (paridad e identidad)

**Files:**
- Create: `app/src/leyes/simulacion-unfold.test.ts`

- [ ] **Step 1: Write the law**

```ts
// app/src/leyes/simulacion-unfold.test.ts
import { describe, expect, test } from "bun:test";
import { crearModelo, crearProceso } from "../modelo/operaciones"; // confirmar firma crearProceso
import { desplegar, ejecutarPaso, iniciarSimulacion, pasoEfecto } from "../modelo/simulacion/runner";
import type { ContextoSimulacion, Modelo, Resultado } from "../modelo/tipos";

function must<T>(r: Resultado<T>): T { if (!r.ok) throw new Error(r.error); return r.value; }

function modeloConProcesos(): Modelo {
  let m = crearModelo();
  m = must(crearProceso(m, m.opdRaizId, { x: 120, y: 80 }, "Recibir"));
  m = must(crearProceso(m, m.opdRaizId, { x: 120, y: 240 }, "Procesar"));
  return m;
}

function iterarManual(modelo: Modelo, ini: ContextoSimulacion): ContextoSimulacion {
  let c = ini;
  while (c.pasoActual < c.plan.length) c = ejecutarPaso(modelo, c);
  return c;
}

describe("LEY law-simulacion-unfold", () => {
  test("law-efecto-identidad: pasoEfecto siempre rinde 1 sucesor, peso 1", () => {
    const m = modeloConProcesos();
    let c = iniciarSimulacion(m, m.opdRaizId);
    while (c.pasoActual < c.plan.length) {
      const e = pasoEfecto(m, c);
      expect(e.sucesores.length).toBe(1);
      expect(e.sucesores[0]!.peso).toBe(1);
      c = e.sucesores[0]!.estado;
    }
  });

  test("law-unfold-paridad: desplegar == iterar ejecutarPaso (mismo trace)", () => {
    const m = modeloConProcesos();
    const ini = iniciarSimulacion(m, m.opdRaizId);
    expect(desplegar(m, ini).trace).toEqual(iterarManual(m, ini).trace);
  });

  test("law-unfold-pureza: desplegar no muta el estado inicial", () => {
    const m = modeloConProcesos();
    const ini = iniciarSimulacion(m, m.opdRaizId);
    const antes = JSON.stringify(ini);
    desplegar(m, ini);
    expect(JSON.stringify(ini)).toBe(antes);
  });
});
```

- [ ] **Step 2: Run to verify**

Run: `cd app && bun test src/leyes/simulacion-unfold.test.ts`
Expected: PASS (3 tests). Ajustar `crearProceso` si su firma difiere.

- [ ] **Step 3: Commit**

```bash
git add app/src/leyes/simulacion-unfold.test.ts
git commit -m "test(leyes): law-simulacion-unfold (paridad F=Identidad)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Barrel + gate S1

- [ ] **Step 1: Exportar desde el índice de simulación** (si existe `modelo/simulacion/index.ts`, añadir; si no, omitir — los consumidores importan de `runner`/`efecto` directamente):

```ts
// si existe app/src/modelo/simulacion/index.ts, añadir:
export { efectoUnico, tomarUnico, type Efecto, type Sucesor } from "./efecto";
export { pasoEfecto, desplegar } from "./runner";
```

- [ ] **Step 2: Gate mínimo**

Run: `cd app && bun run check`
Expected: typecheck limpio + toda la unit suite verde. **`ejecutarPaso`/`ejecutarCorrida` conservan su firma pública** (los consumidores —store, UI— no cambian).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore(simulacion): exports del functor de efecto (cierre S1)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

**Aceptación S1:** `Efecto<T>` + `pasoEfecto` + `desplegar` existen; `ejecutarPaso`/`ejecutarCorrida` delegan y conservan firma; `law-simulacion-unfold` verde; `bun run check` verde; **cero cambio de comportamiento** (los e2e de simulación siguen verdes sin tocarlos). El enchufe para los modos (S2) queda listo: `pasoEfecto` es el único lugar donde S2 producirá >1 sucesor.

---

# FASE S0 — EXPERIENCIA (canonizar a Codex). Disjunta de S1; paralelizable.

> Toca solo `render`/`ui`/`e2e`. Transformaciones precisas sobre símbolos reales; el ensamblaje JSX se confirma con el archivo abierto. Tokens exactos del kit Codex (`ui-forja/tokens.json`). Gate: `bun run design:governance` + e2e/12.

## Task 6: Halo del proceso activo → crimson dashed (retira `#16a34a`)

**Files:** Modify `app/src/render/jointjs/composers/halos.ts`; Modify `app/e2e/12-beta2-modo-simulacion.spec.ts`.

- [ ] **Step 1:** En `halos.ts`, el halo del proceso activo (hoy `stroke: SIM_VERDE "#16a34a"`, `strokeWidth: 3`, `strokeDasharray: "6 3"`, `z: 35`): reemplazar el color por `tokens.colors.crimson` (`#8e2a2e`). Conservar `dasharray "6 3"`, `strokeWidth 3`, `z 35`, `pointerEvents: "none"`. La **textura dashed + crimson** es el canal canónico (resuelve V-132 sin color nuevo). Retirar la constante `SIM_VERDE` si queda huérfana.
- [ ] **Step 2:** El **token en vuelo** (`JointCanvas.tsx`, círculo) conserva el verde, pero migrado a `tokens.colors.bosque` (`#27613f`, alias de `opmGreen`) en vez de `#16a34a` — es una instancia de objeto.
- [ ] **Step 3:** Actualizar `e2e/12-beta2-modo-simulacion.spec.ts`: las aserciones que verifican el halo `#16a34a` pasan a `#8e2a2e` (crimson) y dashed.
- [ ] **Step 4:** `cd app && bun run design:governance` (verifica V-63/V-132/V-203). Luego, con vite apagado: `bunx playwright test e2e/12-beta2-modo-simulacion.spec.ts` (con `PW_PORT` libre).
- [ ] **Step 5:** Commit `feat(simulacion-ux): halo de proceso activo crimson dashed (canon Codex, V-132)`.

## Task 7: Estado alcanzado → anillo crimson (retira pin ámbar `#f59e0b`)

**Files:** Modify `app/src/render/jointjs/composers/halos.ts`.

- [ ] **Step 1:** El pin del estado current (hoy gota `#f59e0b`/`#92400e`): reemplazar por un **anillo/subrayado crimson** (`box-shadow`/path `stroke: crimson`, sin blur) sobre la cápsula del estado. Sin color fuera de paleta. Conservar la degradación segura (si no hay cápsula visible, halo del objeto).
- [ ] **Step 2:** Actualizar e2e si aserta el ámbar.
- [ ] **Step 3:** `bun run design:governance` + e2e/12. Commit `feat(simulacion-ux): estado alcanzado en crimson (retira ambar fuera de canon)`.

## Task 8: BarraSimulacion → controles-palabra + segmented velocidad

**Files:** Modify `app/src/ui/simulacion/BarraSimulacion.tsx`; Modify `e2e/12`.

- [ ] **Step 1:** Controles como **palabras** separadas por `·` (no botones cromados): `reproducir ⌘P · pausa · ◂ atrás · paso ▸ · correr · reiniciar · salir ⎋`. Hover→peso 600; activo→`border-bottom: 1px solid crimson`. Tokens: Inria Serif 13.5px `ink`; separador `·` `inkFaint`; `<kbd>` mono 10px `ls 0.06em` borde `rule`; transición `120ms ease`. **Microcopy literal** (§10 del diseño). Preservar los `testid`/handlers del port `useZustandSimulationPort` (línea roja).
- [ ] **Step 2:** Velocidad: migrar el slider 0.25–4× a **segmented inline** `½× · 1× · 2× · 4×` (activo bold + subrayado). El valor sigue alimentando `intervaloAutoAvanceMs(v)=900/v` (línea roja del timing). Timer `00:03 / 00:08` en mono 10px `inkSoft`.
- [ ] **Step 3:** `bun run design:governance` (cero radios/sombras en chrome) + e2e/12 (actualizar selectores de velocidad/controles). Commit `feat(simulacion-ux): BarraSimulacion canonica (palabras + segmented)`.

## Task 9: Scrubbing — línea de tiempo de marcos navegable

**Files:** Modify `app/src/ui/simulacion/BarraSimulacion.tsx`; añadir acción al port si falta (`irAPaso(n)`).

- [ ] **Step 1:** Bajo los controles, fila de **marcos** `1 · 2 · ⟨3⟩ · 4 …` (mono 10px); el actual en crimson + peso 600. Click en un marco → saltar a ese paso. `←/→` y `◂ atrás / paso ▸` navegan. Requiere que el motor permita saltar (reiniciar + N pasos, o memorizar trazas) — usar `reiniciarSimulacion` + N×`ejecutarPaso` si no hay salto directo (determinista ⟹ reproducible).
- [ ] **Step 2:** e2e: navegar a un marco anterior y verificar que el halo/OPL reflejan ese paso. `bun run design:governance` + e2e/12. Commit `feat(simulacion-ux): scrubbing de marcos (timeline navegable)`.

**Aceptación S0:** halos y estado en paleta Codex (gate `design:governance` verde, V-132 cumplido); BarraSimulacion en palabras + segmented; scrubbing funcional; e2e/12 actualizado y verde; **líneas rojas preservadas** (port, foco, `data-sim-activa`, timing, read-only).

---

# FASE S2 — MODOS POR FUNCTOR (Powerset + Dist). Código fiel.

> Aquí `F` deja de ser Identidad. `pasoEfecto` gana un parámetro `modo` y, cuando el proceso del paso es el **puerto común de un abanico XOR** (`Abanico.puertoEntidadId === procesoId`), ramifica. Reusa `modelo/decision.ts::resolverDecisionAbanico` (muestreo) y `Abanico.enlaceIds` (exhaustivo). Desbloquea B4. **Prerrequisito: S1 en `main`.**

## Task 10: RNG sembrado + modo en el carrier

**Files:** Create `app/src/modelo/simulacion/rng.ts`; Modify `app/src/modelo/simulacion/tipos.ts`; Test `app/src/modelo/simulacion/rng.test.ts`.

- [ ] **Step 1: Write the failing test**

```ts
// app/src/modelo/simulacion/rng.test.ts
import { describe, expect, test } from "bun:test";
import { rngSembrado } from "./rng";

describe("simulacion/rng", () => {
  test("misma semilla → misma secuencia (reproducible)", () => {
    const a = rngSembrado(42), b = rngSembrado(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
  test("semillas distintas → secuencias distintas", () => {
    const a = rngSembrado(1), b = rngSembrado(2);
    expect(a()).not.toBe(b());
  });
  test("valores en [0, 1)", () => {
    const r = rngSembrado(7);
    for (let i = 0; i < 100; i++) { const v = r(); expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThan(1); }
  });
});
```

- [ ] **Step 2: Run** `cd app && bun test src/modelo/simulacion/rng.test.ts` → FAIL (no module).

- [ ] **Step 3: Implementation** (PRNG puro mulberry32; compatible con `RngSimulacion = () => number` de `parametros.ts`)

```ts
// app/src/modelo/simulacion/rng.ts
import type { RngSimulacion } from "./parametros";

/** PRNG determinista (mulberry32). Mismo `semilla` ⟹ misma secuencia. Puro. */
export function rngSembrado(semilla: number): RngSimulacion {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

- [ ] **Step 4:** En `tipos.ts`, añadir a `ContextoSimulacion` (campos opcionales, retrocompatibles — default determinista):

```ts
export type ModoSimulacion = "determinista" | "muestreo" | "exhaustivo";
// dentro de ContextoSimulacion:
  /** Modo del functor de efecto F. Ausente ⟹ "determinista" (paridad S1). */
  modo?: ModoSimulacion;
  /** Semilla del RNG en modo muestreo (reproducibilidad). */
  semilla?: number;
```

- [ ] **Step 5: Run** `cd app && bun test src/modelo/simulacion/rng.test.ts` → PASS. Commit `feat(simulacion): RNG sembrado + modo en el carrier`.

## Task 11: `pasoEfecto` ramifica por modo (consulta abanico XOR del proceso)

**Files:** Modify `app/src/modelo/simulacion/runner.ts`; Test `app/src/modelo/simulacion/modos.test.ts`.

**Contrato:** `pasoEfecto(modelo, ctx)` lee `ctx.modo`/`ctx.semilla`. Si el proceso del paso actual es puerto común de un abanico XOR (`modelo.abanicos`), produce:
- **determinista**: 1 sucesor — la rama de mayor probabilidad (o la primera).
- **muestreo**: 1 sucesor — `resolverDecisionAbanico(modelo, abanicoId, { random })` con `random` derivado de `semilla`; el sucesor lleva `rama` + `peso`.
- **exhaustivo**: N sucesores — uno por `abanico.enlaceIds`, cada uno con su `rama`.
Si no hay abanico, se mantiene S1 (`efectoUnico`). La transición efectiva de la rama elegida reusa `resolverDecisionEnlace`/`inferirTransiciones` ya existentes (confirmar al conectar).

- [ ] **Step 1: Write the failing test**

```ts
// app/src/modelo/simulacion/modos.test.ts
import { describe, expect, test } from "bun:test";
import { pasoEfecto } from "./runner";
// Construir un modelo con un proceso, un objeto con 2 estados, y un abanico XOR
// de salida del proceso hacia los 2 estados (usar helpers reales: crearModelo,
// crearProceso, crearObjeto, crearEstadosIniciales, crearEnlace, formarAbanico
// — confirmar firmas al abrir modelo/operaciones y modelo/abanicos).
import { modeloConAbanicoXorDeSalida } from "./fixtures-modos"; // helper de test a crear en este archivo o junto

describe("simulacion/modos: pasoEfecto ramifica por abanico XOR", () => {
  test("exhaustivo: un sucesor por rama del abanico", () => {
    const { modelo, ctx } = modeloConAbanicoXorDeSalida("exhaustivo");
    const e = pasoEfecto(modelo, ctx);
    expect(e.sucesores.length).toBe(2);
    expect(new Set(e.sucesores.map((s) => s.rama)).size).toBe(2);
  });
  test("muestreo: un sucesor, reproducible por semilla", () => {
    const a = modeloConAbanicoXorDeSalida("muestreo", 42);
    const b = modeloConAbanicoXorDeSalida("muestreo", 42);
    const ea = pasoEfecto(a.modelo, a.ctx), eb = pasoEfecto(b.modelo, b.ctx);
    expect(ea.sucesores.length).toBe(1);
    expect(ea.sucesores[0]!.rama).toBe(eb.sucesores[0]!.rama);
  });
  test("determinista: un sucesor (rama de mayor probabilidad)", () => {
    const { modelo, ctx } = modeloConAbanicoXorDeSalida("determinista");
    expect(pasoEfecto(modelo, ctx).sucesores.length).toBe(1);
  });
});
```

- [ ] **Step 2: Run** → FAIL.

- [ ] **Step 3: Implementation** — en `runner.ts`, antes del `efectoUnico(siguiente)` final de `pasoEfecto`, insertar la ramificación:

```ts
// imports nuevos en runner.ts
import { resolverDecisionAbanico } from "../decision";
import { rngSembrado } from "./rng";
import type { Abanico } from "../tipos";

function abanicoXorDeSalida(modelo: Modelo, procesoId: Id): Abanico | undefined {
  return Object.values(modelo.abanicos ?? {}).find(
    (a) => a.operador === "XOR" && a.puertoEntidadId === procesoId,
  );
}

// dentro de pasoEfecto, tras construir `siguiente` (S1) y antes de retornar:
const abanico = abanicoXorDeSalida(modelo, paso.procesoId);
const modo = contexto.modo ?? "determinista";
if (abanico) {
  if (modo === "exhaustivo") {
    return {
      sucesores: abanico.enlaceIds.map((enlaceId) => ({
        estado: aplicarRama(modelo, siguiente, abanico, enlaceId), // reusa transición de la rama
        rama: modelo.enlaces[enlaceId]?.etiqueta || enlaceId,
        peso: 1 / abanico.enlaceIds.length,
      })),
    };
  }
  if (modo === "muestreo") {
    const random = rngSembrado(contexto.semilla ?? 0);
    const d = resolverDecisionAbanico(modelo, abanico.id, { random });
    if (d.ok && d.value.enlaceId) {
      return { sucesores: [{
        estado: aplicarRama(modelo, siguiente, abanico, d.value.enlaceId),
        rama: modelo.enlaces[d.value.enlaceId]?.etiqueta || d.value.enlaceId,
        peso: d.value.probabilidades?.[d.value.enlaceId] ?? 1,
      }] };
    }
  }
  // determinista: rama de mayor probabilidad (o primera)
  const elegido = [...abanico.enlaceIds].sort(
    (x, y) => (modelo.enlaces[y]?.probabilidad ?? 0) - (modelo.enlaces[x]?.probabilidad ?? 0),
  )[0]!;
  return { sucesores: [{ estado: aplicarRama(modelo, siguiente, abanico, elegido), rama: modelo.enlaces[elegido]?.etiqueta || elegido, peso: 1 }] };
}
return efectoUnico(siguiente);
```

`aplicarRama(modelo, estado, abanico, enlaceId)`: aplica al `estado` la transición que implica la rama elegida (reusa `resolverDecisionEnlace` para obtener el estado destino y actualiza `estadosCurrent`). **Confirmar al conectar:** el plan actual aplica todas las transiciones; en presencia de abanico, solo la de la rama elegida. Escribir `aplicarRama` reusando la lógica de transición de `pasoEfecto`/`inferirTransiciones`. Anotar la rama elegida en la última `EntradaTraceSim` (`trace`) para la marginalia (§12 del diseño).

- [ ] **Step 4: Run** `cd app && bun test src/modelo/simulacion/modos.test.ts` → PASS.

- [ ] **Step 5: Commit** `feat(simulacion): pasoEfecto ramifica por modo (Powerset/Dist sobre abanico XOR)`.

## Task 12: `desplegar` por modo (lineal vs árbol)

**Files:** Modify `app/src/modelo/simulacion/runner.ts`; Test en `modos.test.ts`.

- [ ] **Step 1:** `desplegar` en determinista/muestreo toma el sucesor canónico (hilando el rng implícito por semilla); en **exhaustivo** produce un árbol acotado:

```ts
export interface NodoTraza { estado: ContextoSimulacion; rama?: string; hijos: NodoTraza[]; }

/** Exhaustivo: árbol de ejecución hasta un límite de nodos (anti-explosión). */
export function desplegarArbol(modelo: Modelo, ini: ContextoSimulacion, limite = 200): { raiz: NodoTraza; truncado: boolean } {
  let contador = 0;
  let truncado = false;
  const construir = (estado: ContextoSimulacion): NodoTraza => {
    if (estado.pasoActual >= estado.plan.length || contador >= limite) {
      if (contador >= limite) truncado = true;
      return { estado, hijos: [] };
    }
    contador += 1;
    const e = pasoEfecto(modelo, estado);
    return { estado, hijos: e.sucesores.map((s) => ({ ...construir(s.estado), rama: s.rama })) };
  };
  return { raiz: construir(ini), truncado };
}
```

- [ ] **Step 2: Test:** un modelo con un abanico XOR de 2 ramas en exhaustivo → la raíz tiene 2 hijos; con `limite` bajo, `truncado === true`.

- [ ] **Step 3: Commit** `feat(simulacion): desplegarArbol (modo exhaustivo, con límite)`.

## Task 13: Leyes de modos

**Files:** Create `app/src/leyes/simulacion-modos.test.ts`.

- [ ] **Step 1: Write the laws**

```ts
// app/src/leyes/simulacion-modos.test.ts
import { describe, expect, test } from "bun:test";
// fixtures: modelo SIN abanicos y modelo CON abanico XOR (helpers reales)

describe("LEY law-simulacion-modos", () => {
  test("law-modo-determinista-paridad: sin abanicos, determinista == S1", () => {
    // desplegar(modelo-sin-abanicos, ini{modo:'determinista'}).trace
    //   == desplegar(modelo-sin-abanicos, ini{modo undefined}).trace
  });
  test("law-muestreo-reproducible: misma semilla ⟹ misma traza", () => {
    // desplegar(m, ini{modo:'muestreo', semilla:42}).trace
    //   == desplegar(m, ini{modo:'muestreo', semilla:42}).trace
  });
  test("law-exhaustivo-cubre-ramas: N ramas ⟹ raíz con N hijos", () => {
    // desplegarArbol(m-con-XOR-de-N, ini).raiz.hijos.length === N
  });
});
```

> Completar los cuerpos con los fixtures reales (helpers `crearProceso`/`crearEnlace`/`formarAbanico`, confirmar firmas). Las aserciones son las indicadas.

- [ ] **Step 2: Run** → PASS. Commit `test(leyes): law-simulacion-modos (paridad/reproducible/cubre-ramas)`.

## Task 14: UX de modos (selector + marginalia + navegación de ramas)

**Files:** Modify `app/src/store/simulacion.ts` (acción `fijarModoSimulacion`, `fijarSemilla`); Modify `app/src/ui/simulacion/BarraSimulacion.tsx`; Modify `e2e/12`.

- [ ] **Step 1:** Store: añadir `modo`/`semilla` al contexto y acciones (port `useZustandSimulationPort`).
- [ ] **Step 2:** BarraSimulacion: segmented `modo determinista · muestreo · exhaustivo` **revelado solo si `Object.keys(modelo.abanicos ?? {}).length > 0`** (progressive disclosure, §11). En muestreo, mostrar `semilla 42 ↺`. En exhaustivo, `rama 1 de N ◂ ▸`. Microcopy literal del diseño §12.
- [ ] **Step 3:** Marginalia de rama en el trace (§12): `— rama «X» · {modo} (Pr/semilla)`.
- [ ] **Step 4:** `bun run design:governance` + e2e/12. Commit `feat(simulacion-ux): selector de modo + marginalia de rama (progressive disclosure)`.

**Aceptación S2:** `pasoEfecto` ramifica por modo; reproducibilidad por semilla; exhaustivo acotado; leyes verdes; UX de modo revelada solo con abanicos; `check` + `design:governance` + e2e verdes.

---

# FASE S3 — TIEMPO HÍBRIDO (reloj + duración + excepciones). Tareas + contratos.

> Continuo (duración) + discreto (transiciones/excepciones). `DuracionTemporal {unidad,min,nominal,max}` ya existe en `tipos/estado.ts`. **Confirmar al iniciar:** dónde se asocia la duración a un *proceso* (hoy `DuracionTemporal` vive en `Estado`; ver si el proceso la toma del estado de salida o si requiere una propiedad nueva). Prerrequisito: S2 en `main`.

## Task 15: Reloj y duración muestreada en el carrier

**Files:** Modify `tipos.ts` (`reloj?: number` en `ContextoSimulacion`; `duracion?: number` en `EntradaTraceSim`); Modify `runner.ts` (avanzar reloj en `pasoEfecto`); Test `simulacion-tiempo.test.ts`.

- [ ] **Step 1: Contrato + test:** cada paso muestrea una duración `d ∈ [min,max]` (nominal si no hay distribución; con rng en muestreo) y avanza `reloj += d`. Ley `law-reloj-monotono`: `reloj` no decrece a lo largo de la traza.
- [ ] **Step 2: Implementación:** en `pasoEfecto`, calcular `duracion` desde la fuente confirmada (paso/estado), añadirla a la `EntradaTraceSim`, y `reloj: (contexto.reloj ?? 0) + duracion` en el sucesor. Determinista usa `nominal`; muestreo muestrea en `[min,max]`.
- [ ] **Step 3:** Commit `feat(simulacion): reloj híbrido + duración por paso`.

## Task 16: Excepciones sobretiempo / subtiempo

**Files:** Modify `runner.ts`; Test.

- [ ] **Step 1: Contrato:** si la duración real `> max` (sobretiempo) o `< min` (subtiempo), y existe un enlace de excepción (`TipoEnlace` `excepcionSobretiempo`/`excepcionSubtiempo`/`excepcionSubSobretiempo`) desde el proceso, el sucesor invoca el proceso de manejo (transición discreta).
- [ ] **Step 2: Test:** `law-excepcion-umbral`: duración fuera de `[min,max]` con enlace de excepción ⟹ la traza incluye el proceso de manejo; sin enlace ⟹ sin manejo. Anclar en los `tipo` de `Enlace` reales.
- [ ] **Step 3:** Commit `feat(simulacion): excepciones sobretiempo/subtiempo como transición discreta`.

## Task 17: Lifeline (sección instante → estado)

**Files:** Create `app/src/modelo/simulacion/lifeline.ts`; Test.

- [ ] **Step 1: Contrato:** `lifeline(contexto): Array<{ t: number; vivos: Id[]; estados: Record<Id,Id>; procesosActivos: Id[] }>` derivada de la traza + reloj. Es la sección del sheaf temporal (diseño §4). Pura.
- [ ] **Step 2: Test:** `law-lifeline-cubre-traza`: la lifeline tiene un punto por instante de la traza; `estados` en `t` coincide con `estadosCurrent` tras el paso correspondiente.
- [ ] **Step 3:** Commit `feat(simulacion): lifeline (sección temporal pura)`.

## Task 18: UX de tiempo (timer real + panel vida útil)

**Files:** Modify `BarraSimulacion.tsx` (timer `00:03 / 00:08` desde `reloj`, mono `inkSoft`); opcional panel de vida útil en columna derecha (Codex: campos `tiempo actual`, `duración`).

- [ ] **Step 1:** Timer real desde `reloj` (no índice). **Línea roja:** no cambiar `intervaloAutoAvanceMs`. `bun run design:governance` + e2e/12.
- [ ] **Step 2:** Commit `feat(simulacion-ux): timer real + panel de vida útil`.

**Aceptación S3:** reloj monótono; duración muestreada; excepciones por umbral; lifeline pura; timer real; leyes + gates verdes.

---

# FASE S4 — COMPOSICIÓN IN-ZOOM (lentes). Tareas + contratos.

> Simular un proceso descompuesto = **componer las coalgebras** de sus subprocesos (lente ⊗), en vez de la recursión secuencial del plan (`plan.ts::planificarOpd` recursa `opdHijoId`). La descomposición es **síncrona** (el padre espera a los hijos). Prerrequisito: S2 en `main` (idealmente S3). La más avanzada.

## Task 19: La lente de un proceso (coalgebra local)

**Files:** Create `app/src/modelo/simulacion/lente.ts`; Test.

- [ ] **Step 1: Contrato:** `lenteDeProceso(modelo, procesoId)` = `{ observar(estado): observable; actualizar(estado, input): estado }` (Moore). Para un proceso sin descomposición, es el paso atómico; para uno con `obtenerRefinamiento(entidad,"descomposicion")`, se compone de las lentes de sus subprocesos.
- [ ] **Step 2: Test:** `law-lente-atomica`: para un proceso hoja, `lenteDeProceso` reproduce `pasoEfecto` restringido a ese proceso.
- [ ] **Step 3:** Commit `feat(simulacion): lente de proceso (coalgebra local)`.

## Task 20: Composición síncrona de subprocesos

**Files:** Modify `runner.ts`/`lente.ts`; Test.

- [ ] **Step 1: Contrato:** al ejecutar un proceso con `opdHijoId`, en vez de aplanar el plan, **componer** las lentes de los subprocesos (orden Y / paralelo a misma altura) y devolver el estado compuesto al completar todos (síncrono).
- [ ] **Step 2: Ley `law-composicion-inzoom`:** simular un proceso descompuesto == componer la simulación de sus subprocesos (mismo `estadosCurrent` final que la recursión actual del plan, para paridad). Esto es el **teorema de composabilidad** (`icas-interaccion`).
- [ ] **Step 3:** Commit `feat(simulacion): composición síncrona de subprocesos (lentes)`.

## Task 21: UX de composición (sin novedad mayor — navegación multi-OPD ya existe)

**Files:** verificar `BarraSimulacion`/`JointCanvas`.

- [ ] **Step 1:** Confirmar que al entrar a un subproceso el OPD activo cambia y el halo/OPL siguen al subproceso activo (la navegación multi-OPD viva ya existe en B0). Añadir breadcrumb `SD ▸ SD1` si falta.
- [ ] **Step 2:** e2e: simular un modelo con descomposición y verificar el descenso. Commit `feat(simulacion-ux): breadcrumb de descenso in-zoom`.

**Aceptación S4:** lente de proceso + composición síncrona; `law-composicion-inzoom` verde (paridad con la recursión actual); navegación multi-OPD intacta.

---

# Orden global y dependencias

```
S0 (experiencia) ─┐
                  ├─ paralelas (archivos disjuntos) ─→ reconciliación e2e
S1 (motor) ───────┘
        │
        └─→ S2 (modos) ─→ S3 (tiempo) ─→ S4 (composición)
```

S0 ∥ S1 ahora. S2 tras S1 en `main`. S3 tras S2. S4 tras S2 (idealmente S3). Cada salto exige el prerrequisito en `main` + sus leyes verdes.

---

## Coordinación S0 ∥ S1

S0 (`render`/`ui`/`e2e`) y S1 (`modelo/simulacion/`) tocan archivos **disjuntos** → se ejecutan en paralelo (worktrees, skill `lineas-paralelas`), con **reconciliación e2e final** sobre `main` integrado (lección de rondas paralelas). Ninguna toca primitivas OPM ni el wire format. **Operativo:** apagar vite antes de `browser:smoke`; e2e con `PW_PORT` libre.

---

## Self-review

- **Spec coverage:** S1 cubre §2–§3 del diseño (anamorfismo, functor, F=Identidad, paridad). S0 cubre §9–§13 (registro visual canónico, barra, scrubbing). S2–S4 mapeadas a §3/§6/§7. ✓
- **Placeholder scan:** S1 tiene código completo y fiel (anclado en `runner.ts`/`tipos.ts` reales). S0 da transformaciones precisas sobre símbolos reales (`SIM_VERDE`, `#16a34a`, `#f59e0b`, slider) + tokens exactos + criterios e2e; el JSX se confirma con el archivo abierto (no es placeholder vago, es transformación dirigida). **Riesgo residual marcado:** confirmar firma de `crearProceso` al iniciar Task 2/4.
- **Type consistency:** `Efecto<T>`, `Sucesor<T>`, `efectoUnico`, `tomarUnico`, `pasoEfecto`, `desplegar` se usan idénticos entre tasks. `ejecutarPaso`/`ejecutarCorrida` conservan firma pública (compat).
- **Motor cubierto:** S1 (este plan) + S2–S4 (mapeadas) responden la pregunta "¿qué pasa con el motor?": el motor es el corazón y arranca en paralelo a la UX, no después.
