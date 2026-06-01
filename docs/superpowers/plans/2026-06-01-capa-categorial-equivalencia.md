# Capa categorial — F2 Equivalencia (kernel) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development (recomendado) o superpowers:executing-plans. Pasos en checkbox (`- [ ]`).

**Goal:** Permitir declarar que dos refinamientos hermanos del mismo proceso padre son **realizaciones alternativas equivalentes**, y **verificar** (no solo registrar) que producen la misma frontera observable. Cierra el método A0 de `metodologia-forja` (generar ≥3 conceptos, separar función de forma) que la SSOT ya prescribe y no podía formalizar.

**Architecture:** Módulo kernel `app/src/modelo/equivalencia/` (puro). La verificación reusa el cimiento F0 (`modelo/hechos/seccionLocal`, commit `e7822ee`): dos descomposiciones son equivalentes sii sus secciones locales sobre la **frontera del padre** (conjunto previo/posterior + habilitadores) coinciden como conjuntos de hechos. Lectura formal: bisimulación / 2-célula (`urn:fxsl:kb:icas-efectos`, `icas-higher-categories`); en código se llama "realización alternativa".

**Tech Stack:** TypeScript estricto, Bun test. Gate `cd app && bun run check`.

**Dependencias:** F0 en `main` (✅ `e7822ee`). La UX (badge "variante" en OPD tree, panel, selector de variante activa) es **plan hermano** posterior (`…-equivalencia-ux.md`).

**Diseño de referencia:** `docs/roadmap/capa-categorial-opforja.md` §5.

---

## File Structure

- Create: `app/src/modelo/equivalencia/frontera.ts` — `fronteraDe(modelo, padreId): Id[]`.
- Create: `app/src/modelo/equivalencia/verificar.ts` — `RealizacionAlternativa`, `verificarEquivalencia`.
- Create: `app/src/modelo/equivalencia/index.ts` — barrel.
- Test: `equivalencia/frontera.test.ts`, `equivalencia/verificar.test.ts`, `app/src/leyes/equivalencia.test.ts`.

---

## Task 1: `fronteraDe` — entidades que cruzan el contorno del padre

**Files:** Create `app/src/modelo/equivalencia/frontera.ts` + test.

La frontera observable de un proceso descompuesto = las entidades enlazadas al proceso padre (conjunto previo/posterior + habilitadores) en el OPD donde vive. Esas son las que ambas descomposiciones deben preservar.

- [ ] **Step 1: failing test**

```ts
import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto, crearProceso, crearEnlace } from "../operaciones";
import type { Modelo, Resultado } from "../tipos";
import { fronteraDe } from "./frontera";
function must<T>(r: Resultado<T>): T { if (!r.ok) throw new Error(r.error); return r.value; }

describe("equivalencia/frontera", () => {
  test("fronteraDe incluye las entidades enlazadas al proceso padre", () => {
    // proceso P con consumo de A y resultado B → frontera = {A, B}
    const { modelo, procesoId, aId, bId } = construirPConEntradaSalida();
    const f = new Set(fronteraDe(modelo, procesoId));
    expect(f.has(aId)).toBe(true);
    expect(f.has(bId)).toBe(true);
  });
});
```
> El helper se arma con `crearProceso`/`crearObjeto`/`crearEnlace` (confirmar firmas al iniciar) o inyectando enlaces a mano (patrón de `modelo/hechos/pegado.test.ts`).

- [ ] **Step 2: run, verify fails.** `cd app && bun test src/modelo/equivalencia/frontera.test.ts`

- [ ] **Step 3: implement**

```ts
// app/src/modelo/equivalencia/frontera.ts
import type { Id, Modelo } from "../tipos";

/** Entidades enlazadas al proceso `padreId` (conjunto previo/posterior + habilitadores). */
export function fronteraDe(modelo: Modelo, padreId: Id): Id[] {
  const frontera = new Set<Id>();
  for (const enlace of Object.values(modelo.enlaces)) {
    const o = entidadDe(enlace.origenId, modelo);
    const d = entidadDe(enlace.destinoId, modelo);
    if (o === padreId && d) frontera.add(d);
    if (d === padreId && o) frontera.add(o);
  }
  return [...frontera];
}
function entidadDe(ex: { kind: string; id: Id }, modelo: Modelo): Id | null {
  if (ex.kind === "entidad") return ex.id;
  return modelo.estados[ex.id]?.entidadId ?? null;
}
```

- [ ] **Step 4: run, verify passes.**
- [ ] **Step 5: commit** `feat(equivalencia): fronteraDe — entidades de la frontera del padre`

---

## Task 2: `verificarEquivalencia` — misma frontera observable

**Files:** Create `app/src/modelo/equivalencia/verificar.ts` + test. Reusa `seccionLocal` de `modelo/hechos`.

- [ ] **Step 1: failing test**

```ts
import { describe, expect, test } from "bun:test";
import { verificarEquivalencia, type RealizacionAlternativa } from "./verificar";
// construir un modelo con un padre P descompuesto en opdA y opdB que dejan la MISMA
// frontera observable (mismos consumos/resultados sobre las mismas entidades)
describe("equivalencia/verificar", () => {
  test("dos descomposiciones con misma frontera → equivalente", () => {
    const { modelo, eq } = construirDosVariantesEquivalentes();
    const r = verificarEquivalencia(modelo, eq);
    expect(r.ok && r.value.equivalente).toBe(true);
  });
  test("frontera distinta → no equivalente, reporta diferencias", () => {
    const { modelo, eq } = construirDosVariantesDistintas();
    const r = verificarEquivalencia(modelo, eq);
    expect(r.ok && r.value.equivalente).toBe(false);
    if (r.ok) expect(r.value.diferencias && r.value.diferencias.size > 0).toBe(true);
  });
});
```

- [ ] **Step 2: run, verify fails.**

- [ ] **Step 3: implement**

```ts
// app/src/modelo/equivalencia/verificar.ts
import { seccionLocal, type ConjuntoDeHechos } from "../hechos";
import { fronteraDe } from "./frontera";
import type { Id, Modelo, Resultado } from "../tipos";

export interface RealizacionAlternativa {
  padreId: Id;
  opdA: Id; // OPD hijo de la variante A
  opdB: Id; // OPD hijo de la variante B
}

export function verificarEquivalencia(
  modelo: Modelo,
  eq: RealizacionAlternativa,
): Resultado<{ equivalente: boolean; diferencias?: ConjuntoDeHechos }> {
  const frontera = fronteraDe(modelo, eq.padreId);
  // Hechos de frontera observados en cada variante (union de secciones locales por entidad de frontera).
  const hechosA = unionSecciones(modelo, frontera, eq.opdA);
  const hechosB = unionSecciones(modelo, frontera, eq.opdB);
  const diferencias = diferenciaSimetrica(hechosA, hechosB); // claves en A xor B
  return { ok: true, value: { equivalente: diferencias.size === 0, ...(diferencias.size ? { diferencias } : {}) } };
}
// unionSecciones + diferenciaSimetrica: helpers puros sobre ConjuntoDeHechos (Map por clave).
```
> `diferenciaSimetrica` opera sobre las claves del `Map` (igualdad estructural del cimiento F0). Implementar como helper puro.

- [ ] **Step 4: run, verify passes.**
- [ ] **Step 5: commit** `feat(equivalencia): verificarEquivalencia por frontera (reusa seccionLocal F0)`

---

## Task 3: Ley `law-equivalencia-frontera`

**Files:** Create `app/src/leyes/equivalencia.test.ts`.

- [ ] **Step 1: failing test** — propiedades: reflexiva (`verificarEquivalencia(m, {padreId, opdA:X, opdB:X})` → equivalente); simétrica (intercambiar opdA/opdB no cambia el veredicto); y `verificarEquivalencia` es pura (no muta el modelo, comparar `JSON.stringify` antes/después).
- [ ] **Step 2–4: run / (impl ya existe en T2) / verify passes.**
- [ ] **Step 5: commit** `test(leyes): law-equivalencia-frontera (reflexiva, simétrica, pura)`

---

## Task 4: Barrel + gate

- [ ] **Step 1:** `app/src/modelo/equivalencia/index.ts`:
```ts
export { fronteraDe } from "./frontera";
export { verificarEquivalencia, type RealizacionAlternativa } from "./verificar";
```
- [ ] **Step 2:** `cd app && bun test src/modelo/equivalencia src/leyes/equivalencia.test.ts` → PASS.
- [ ] **Step 3:** `cd app && bun run check` → verde; sin tocar `validarModelo` ni wire format.
- [ ] **Step 4: commit** `feat(equivalencia): barrel del modulo equivalencia (F2 kernel)`

---

## Acceptance criteria (F2 kernel)

- [ ] `modelo/equivalencia/` puro; `fronteraDe` y `verificarEquivalencia` con tests verdes; ambos puros.
- [ ] `verificarEquivalencia` reusa `seccionLocal` (cimiento F0); equivalencia = igualdad de frontera observable.
- [ ] `law-equivalencia-frontera` verde (reflexiva, simétrica, pura).
- [ ] `bun run check` verde; wire format intacto.

## Planes siguientes
- **`…-equivalencia-ux.md`:** badge "variante" en OPD tree, panel de equivalencia (declarar A≡B, ver verificación → `PanelMetodologia`), selector de variante activa (reusa apariencias-por-OPD). Prerrequisito: F2 kernel en `main`.
- **Propuesta SSOT:** equivalencia de realizaciones como cierre formal de A0 en `metodologia-forja` (vía `custodio-kora`).

## Self-review
- Spec coverage §5: relación de segundo nivel (RealizacionAlternativa) ✓; verificación por frontera reusando F0 ✓; cierra A0 (documentado) ✓; UX → plan hermano ✓.
- Placeholder scan: `verificarEquivalencia`/`fronteraDe` con código real; helpers `unionSecciones`/`diferenciaSimetrica`/`construir…` se completan guiados por los tests (contrato ejecutable). Riesgo residual: definición precisa de "frontera" (¿incluye estados específicos?) se afina al iniciar T1 contra el repo.
- Type consistency: `RealizacionAlternativa`, `fronteraDe`, `verificarEquivalencia`, `ConjuntoDeHechos` (de F0) consistentes entre tasks.

## Execution handoff
1. Subagent-driven (recomendado). 2. Inline con checkpoints.
