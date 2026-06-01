# Capa categorial — F3 Razonamiento (kernel, versión mínima) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development (recomendado) o superpowers:executing-plans. Pasos en checkbox (`- [ ]`).

**Goal:** Dar a opforja un **motor de derivación** puro que hace computables las inferencias que OPM ya define implícitamente (alcanzar, requerir, impactar), distinguiendo **hecho declarado** de **hecho inferido**. Es el catamorfismo dual de la simulación (anamorfismo), sobre el cimiento F0.

**Architecture:** Módulo kernel `app/src/modelo/razonamiento/` (puro). Consultas predefinidas sobre el grafo de hechos (`modelo/hechos`, commit `e7822ee`). **NO** es lógica de primer orden ni demostrador.

**Tech Stack:** TypeScript estricto, Bun test. Gate `cd app && bun run check`.

**Dependencias:** F0 en `main` (✅). UX (consola de consultas en Cmd+K, badges inferido/declarado en canvas/OPL) = **plan hermano** posterior.

**Diseño de referencia:** `docs/roadmap/capa-categorial-opforja.md` §6.

---

## FRONTERA DURA (anti-scope-creep) — leer antes de empezar

La versión mínima implementa un **conjunto cerrado de consultas predefinidas** sobre la estructura. **Fuera de alcance, se rechaza en review:** cuantificadores, deducción general, lenguaje de consulta libre, razonador tipo Datalog/Prolog, topos interno. Eso cambia la misión de OPM (otra premisa). Documentar esta frontera en `CONTRIBUTING.md` (Task 5).

---

## File Structure

- Create: `app/src/modelo/razonamiento/derivar.ts` — `Consulta`, `derivar`, `HechoDerivado`.
- Create: `app/src/modelo/razonamiento/index.ts` — barrel.
- Test: `razonamiento/derivar.test.ts`, `app/src/leyes/razonamiento.test.ts`.

---

## Task 1: `derivar` — consulta "afectan-a"

**Files:** Create `app/src/modelo/razonamiento/derivar.ts` + test.

- [ ] **Step 1: failing test**

```ts
import { describe, expect, test } from "bun:test";
import { derivar } from "./derivar";
describe("razonamiento/derivar", () => {
  test("afectan-a: lista los procesos con enlace que cambia el estado de X", () => {
    const { modelo, objetoId, procesoId } = construirProcesoQueAfecta();
    const r = derivar(modelo, { tipo: "afectan-a", entidadId: objetoId });
    expect(r.some((h) => h.inferido && h.procesoId === procesoId)).toBe(true);
  });
});
```

- [ ] **Step 2: run, verify fails.**

- [ ] **Step 3: implement**

```ts
// app/src/modelo/razonamiento/derivar.ts
import type { Id, Modelo } from "../tipos";

export type Consulta =
  | { tipo: "afectan-a"; entidadId: Id }
  | { tipo: "requerido-por"; procesoId: Id }
  | { tipo: "impacto-de-eliminar"; elementoId: Id };

export interface HechoDerivado {
  inferido: true;             // todo lo que sale de `derivar` es inferido, nunca declarado
  via: Consulta["tipo"];
  procesoId?: Id;
  entidadId?: Id;
  enlaceId?: Id;
}

export function derivar(modelo: Modelo, consulta: Consulta): HechoDerivado[] {
  switch (consulta.tipo) {
    case "afectan-a": {
      const salida: HechoDerivado[] = [];
      for (const enlace of Object.values(modelo.enlaces)) {
        if (enlace.tipo !== "efecto" && enlace.tipo !== "consumo" && enlace.tipo !== "resultado") continue;
        if (tocaEntidad(enlace, consulta.entidadId, modelo)) {
          const procesoId = procesoDelEnlace(enlace, modelo);
          if (procesoId) salida.push({ inferido: true, via: "afectan-a", procesoId, entidadId: consulta.entidadId, enlaceId: enlace.id });
        }
      }
      return salida;
    }
    case "requerido-por": return requeridoPor(modelo, consulta.procesoId); // cierre transitivo de precondiciones (Task 2)
    case "impacto-de-eliminar": return impactoDeEliminar(modelo, consulta.elementoId); // Task 3
  }
}
// helpers tocaEntidad / procesoDelEnlace / requeridoPor / impactoDeEliminar: puros sobre el grafo.
```

- [ ] **Step 4: run, verify passes.**
- [ ] **Step 5: commit** `feat(razonamiento): derivar afectan-a sobre el grafo de hechos`

---

## Task 2: consulta "requerido-por" (cierre transitivo de precondiciones)

**Files:** Modify `razonamiento/derivar.ts` (implementar `requeridoPor`) + test.

- [ ] **Step 1: failing test** — un proceso P que consume A, donde A es resultado de Q: `requerido-por(P)` debe incluir A y Q (cierre transitivo de lo que P necesita). Construir cadena Q→A→P.
- [ ] **Step 2: run, verify fails.**
- [ ] **Step 3: implement** `requeridoPor(modelo, procesoId)`: BFS/cierre sobre enlaces de consumo/instrumento/agente entrantes al proceso y sus productores, marcando ciclos (no recursión infinita).
- [ ] **Step 4: run, verify passes.**
- [ ] **Step 5: commit** `feat(razonamiento): requerido-por (cierre transitivo de precondiciones)`

---

## Task 3: consulta "impacto-de-eliminar"

**Files:** Modify `razonamiento/derivar.ts` (`impactoDeEliminar`) + test.

- [ ] **Step 1: failing test** — eliminar un objeto X devuelve los hechos que desaparecerían: enlaces incidentes a X, estados de X, y refinamientos colgantes. Verificar que lista los enlaces incidentes.
- [ ] **Step 2–4:** run / implement (`impactoDeEliminar` recoge enlaces con extremo en X, estados de X, refinamientos cuyo refinable es X) / verify.
- [ ] **Step 5: commit** `feat(razonamiento): impacto-de-eliminar`

---

## Task 4: Ley `law-derivacion`

**Files:** Create `app/src/leyes/razonamiento.test.ts`.

- [ ] **Step 1: failing test:**
  - `law-derivacion-pura`: `derivar` no muta el modelo (`JSON.stringify` antes/después) y es determinista (dos llamadas → mismo resultado).
  - `law-derivacion-todo-inferido`: todo `HechoDerivado` tiene `inferido: true` (jamás se mezcla con hechos declarados del modelo).
- [ ] **Step 2–4:** run / (impl existe) / verify.
- [ ] **Step 5: commit** `test(leyes): law-derivacion (pura, determinista, todo inferido)`

---

## Task 5: Barrel, gate y frontera documentada

- [ ] **Step 1:** `app/src/modelo/razonamiento/index.ts`:
```ts
export { derivar, type Consulta, type HechoDerivado } from "./derivar";
```
- [ ] **Step 2:** Añadir a `CONTRIBUTING.md` (o crear nota en el módulo) la **frontera dura**: el razonamiento es un conjunto cerrado de consultas; FOL/Datalog/demostrador quedan fuera de alcance y se rechazan en review.
- [ ] **Step 3:** `cd app && bun test src/modelo/razonamiento src/leyes/razonamiento.test.ts` → PASS.
- [ ] **Step 4:** `cd app && bun run check` → verde.
- [ ] **Step 5: commit** `feat(razonamiento): barrel + frontera anti-FOL documentada (F3 kernel)`

---

## Acceptance criteria (F3 kernel)

- [ ] `modelo/razonamiento/` puro; `derivar` con las 3 consultas; tests verdes.
- [ ] Todo resultado marca `inferido: true` (separado de hechos declarados).
- [ ] `law-derivacion` verde (pura, determinista, todo-inferido).
- [ ] Frontera dura documentada; sin FOL/demostrador.
- [ ] `bun run check` verde; wire format intacto.

## Planes siguientes
- **`…-razonamiento-ux.md`:** consola de consultas en Cmd+K (conjunto cerrado), resaltado del subgrafo derivado en canvas, badges "inferido"/"declarado" en OPL. Prerrequisito: F3 kernel en `main`.

## Self-review
- Spec coverage §6: motor de derivación mínimo (afectan-a, requerido-por, impacto) ✓; declarado vs inferido ✓; frontera dura ✓; UX → plan hermano ✓; dual de la simulación (documentado en el doc maestro) ✓.
- Placeholder scan: `derivar`/afectan-a con código real; `requeridoPor`/`impactoDeEliminar` con contrato + test (cierre transitivo; el implementador completa el BFS guiado por el test).
- Type consistency: `Consulta`, `HechoDerivado`, `derivar` consistentes entre tasks y barrel.

## Execution handoff
1. Subagent-driven (recomendado). 2. Inline con checkpoints.
