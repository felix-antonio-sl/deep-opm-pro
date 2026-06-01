# Simulación categorial — S0 Coalgebra explícita (refactor sin cambio de comportamiento) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development (recomendado) o superpowers:executing-plans. Pasos en checkbox (`- [ ]`).

**Goal:** Refundar el motor de simulación B0 como un **anamorfismo explícito** — `ejecutarPaso` expresado como `paso : EstadoSistema → F(EstadoSistema)` con `F = Identidad` — derivando el plan del unfold, **sin cambiar el comportamiento observable** (e2e de simulación idénticos). Y conectar la simulación al cimiento F0 vía `hechosDeEjecucion`. Es el prerrequisito de S1 (functor `F` + ramas), S2 (reloj híbrido), S3 (Monte Carlo), S4 (composición por lentes).

**Architecture:** B0 ya es un anamorfismo a medio construir: `app/src/modelo/simulacion/runner.ts::ejecutarPaso` es la coalgebra (pura), `ejecutarCorrida` el unfold, `ContextoSimulacion` el carrier. S0 hace la estructura **explícita** y reusa el cimiento F0 (`modelo/hechos`, commit `e7822ee`). **Refactor interno: cero cambio de comportamiento.**

**Tech Stack:** TypeScript estricto, Bun test, Playwright (e2e `12-beta2-modo-simulacion`). Gate `cd app && bun run check` + e2e.

**Dependencias:** B0 (existe) + F0 en `main` (✅).

**Diseño de referencia:** `docs/roadmap/simulacion-categorial-opforja.md` (Parte I, §2–§3).

---

## LÍNEAS ROJAS (no romper — verificado en B0)

Preservar **intactas**: firma de `ContextoSimulacion`; el vector `focoPasoActualSimulacion`; el gate puro `debeAnimarTokensSim`; el port `useZustandSimulationPort`; el timing `intervaloAutoAvanceMs(v)=900/v`; colores `SIM_VERDE`/`bosque`; atributo `data-sim-activa`. El token verde, el halo, el resaltado OPL y el panel de trace **no cambian**. **Criterio de éxito de S0: los e2e de `12-beta2-modo-simulacion` pasan sin tocarlos.**

---

## File Structure

- Create: `app/src/modelo/hechos/ejecucion.ts` — `hechosDeEjecucion(modelo, contexto): ConjuntoDeHechos`.
- Create: `app/src/modelo/simulacion/coalgebra.ts` — `paso` (wrapper explícito de `ejecutarPaso`, F=Identidad) + tipos del functor.
- Modify: `app/src/modelo/simulacion/runner.ts` — `ejecutarCorrida` se expresa como unfold sobre `paso` (sin cambiar salida).
- Test: `modelo/hechos/ejecucion.test.ts`, `modelo/simulacion/coalgebra.test.ts`, `app/src/leyes/simulacion-coalgebra.test.ts`.

---

## Task 1: `hechosDeEjecucion` — la traza como hechos (conexión con F0)

**Files:** Create `app/src/modelo/hechos/ejecucion.ts` + test.

- [ ] **Step 1: failing test**

```ts
import { describe, expect, test } from "bun:test";
import { iniciarSimulacion } from "../simulacion/runner";
import { hechosDeEjecucion } from "./ejecucion";
// construir un modelo con un objeto en estado inicial e iniciar simulación
describe("hechos/ejecucion", () => {
  test("hechosDeEjecucion proyecta el estado de ejecución a hechos", () => {
    const { modelo, contexto } = iniciarSimulacionDeModeloConObjeto();
    const hechos = [...hechosDeEjecucion(modelo, contexto).values()];
    // al menos un hecho-estado reflejando estadosCurrent
    expect(hechos.some((h) => h.tipo === "estado")).toBe(true);
  });
});
```
> Confirmar la firma de `iniciarSimulacion` / `ContextoSimulacion.estadosCurrent` al iniciar (ver `modelo/simulacion/tipos.ts`, `runner.ts`).

- [ ] **Step 2: run, verify fails.**

- [ ] **Step 3: implement** — `hechosDeEjecucion(modelo, contexto)` proyecta el estado de ejecución (`estadosCurrent`, instancias vivas) a un `ConjuntoDeHechos` reusando los constructores del cimiento F0. No muta nada.

- [ ] **Step 4: run, verify passes.**
- [ ] **Step 5: commit** `feat(hechos): hechosDeEjecucion — traza de simulación como hechos (F0+B0)`

---

## Task 2: `paso` — coalgebra explícita (F = Identidad)

**Files:** Create `app/src/modelo/simulacion/coalgebra.ts` + test.

Hacer explícita la estructura: `paso(modelo, estado) → estado'` con la forma de un unfold. En S0 `F = Identidad` (un único sucesor determinista) — **idéntico** a `ejecutarPaso` actual. El parámetro `F` queda como semilla para S1.

- [ ] **Step 1: failing test**

```ts
import { describe, expect, test } from "bun:test";
import { paso } from "./coalgebra";
import { iniciarSimulacion, ejecutarPaso } from "./runner";
describe("simulacion/coalgebra", () => {
  test("paso (F=Id) produce el mismo contexto que ejecutarPaso", () => {
    const { modelo, contexto } = iniciarSimulacionDeModeloConProceso();
    expect(paso(modelo, contexto)).toEqual(ejecutarPaso(modelo, contexto));
  });
});
```

- [ ] **Step 2: run, verify fails.**

- [ ] **Step 3: implement** — `coalgebra.ts` define `paso` que en F=Id delega en `ejecutarPaso` (o, mejor, `ejecutarPaso` pasa a expresarse en términos de `paso`). Tipo `FunctorEfecto` declarado pero solo `Identidad` implementado en S0. **No cambia la lógica de transición.**

- [ ] **Step 4: run, verify passes.**
- [ ] **Step 5: commit** `feat(simulacion): paso — coalgebra explícita (F=Identidad), comportamiento idéntico`

---

## Task 3: `ejecutarCorrida` como unfold + ley de estabilidad

**Files:** Modify `runner.ts` (expresar `ejecutarCorrida` como unfold sobre `paso`); Create `app/src/leyes/simulacion-coalgebra.test.ts`.

- [ ] **Step 1: failing test** (`leyes/simulacion-coalgebra.test.ts`)

```ts
import { describe, expect, test } from "bun:test";
import { iniciarSimulacion, ejecutarCorrida } from "../modelo/simulacion/runner";
describe("LEY law-simulacion-determinista-estable", () => {
  test("ejecutarCorrida es determinista y no muta el modelo", () => {
    const { modelo, contexto } = construirModeloSimulable();
    const antes = JSON.stringify(modelo);
    const t1 = ejecutarCorrida(modelo, contexto);
    const t2 = ejecutarCorrida(modelo, contexto);
    expect(JSON.stringify(modelo)).toBe(antes);     // no muta el modelo
    expect(t1.trace).toEqual(t2.trace);             // determinista
  });
});
```

- [ ] **Step 2: run, verify fails (o pasa si ya era estable — confirmar baseline).**
- [ ] **Step 3: implement** — reescribir `ejecutarCorrida` como `unfold(paso)` preservando exactamente la salida (`trace` idéntico). Si ya delega en `ejecutarPaso`, el cambio es expresarlo vía `paso`.
- [ ] **Step 4: run, verify passes.**
- [ ] **Step 5: commit** `refactor(simulacion): ejecutarCorrida como unfold sobre paso (sin cambio de salida)`

---

## Task 4: Gate — e2e de simulación intactos (líneas rojas)

- [ ] **Step 1:** `cd app && bun test src/modelo/simulacion src/modelo/hechos src/leyes/simulacion-coalgebra.test.ts` → PASS.
- [ ] **Step 2:** `cd app && bun run check` → verde (incluye toda la unit suite).
- [ ] **Step 3:** apagar dev server; `PW_PORT=<libre> bunx playwright test e2e/12-beta2-modo-simulacion.spec.ts --workers=1` → **igual número de pass que antes de S0** (las líneas rojas no se tocaron). Si algún e2e cambia de resultado, S0 rompió comportamiento → revertir el paso culpable.
- [ ] **Step 4: commit** (si hubo ajustes de barrel) `feat(simulacion): cierre S0 — coalgebra explícita, e2e verdes`

---

## Acceptance criteria (S0)

- [ ] `hechosDeEjecucion` proyecta el estado de ejecución a hechos (reusa F0); puro.
- [ ] `paso` (F=Identidad) produce contexto idéntico a `ejecutarPaso`.
- [ ] `ejecutarCorrida` expresado como unfold; `trace` idéntico al de B0; determinista; no muta el modelo.
- [ ] **Líneas rojas intactas**: e2e `12-beta2-modo-simulacion` con el mismo resultado que antes de S0.
- [ ] `bun run check` verde.

## Planes siguientes (mapeados en el doc de diseño §3–§7)
- **S1 — Functor `F` + ramas:** enchufar `modelo/decision.ts` → `F=Powerset`/selección (XOR/OR), desbloquea B4. Orden no-det/prob explícito en OPL.
- **S2 — Reloj híbrido:** duración (`DuracionTemporal`) + excepciones sobretiempo/subtiempo.
- **S3 — Monte Carlo:** `F=Dist` (muestreo de comportamiento, reusa `parametros.ts`) + export de traza (`csv.ts`).
- **S4 — Composición por lentes:** simular proceso descompuesto = componer subprocesos.

## Self-review
- Spec coverage (doc simulación Parte I): anamorfismo explícito ✓; conexión F0 (`hechosDeEjecucion`) ✓; F=Identidad preserva B0 ✓; functor como semilla de S1 ✓; líneas rojas como criterio de éxito ✓.
- Placeholder scan: tests son contrato ejecutable (igualdad con `ejecutarPaso`, `trace` estable); el código exacto de `paso`/`ejecutarCorrida` se ancla contra `runner.ts` real al iniciar (no inventar la lógica de transición — reusarla).
- Type consistency: `paso`, `FunctorEfecto`, `hechosDeEjecucion`, `ConjuntoDeHechos` (F0), `ContextoSimulacion` (B0) consistentes.

## Execution handoff
1. Subagent-driven (recomendado). 2. Inline con checkpoints. **Crítico:** confirmar la firma real de `runner.ts`/`tipos.ts` de B0 antes de Task 2 (refactor, no reescritura).
