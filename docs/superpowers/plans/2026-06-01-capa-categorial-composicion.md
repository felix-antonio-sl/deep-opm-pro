# Capa categorial — F1 Composición + Linealidad (kernel) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans para implementar task-by-task. Los pasos usan checkbox (`- [ ]`).

**Goal:** Dar a opforja el **eje horizontal** de OPM en el kernel: componer dos modelos por interfaz explícita (pushout / structured cospan) sin duplicar lo compartido, y declarar objetos **lineales** (recursos que no se copian). Sobre el cimiento F0 (`modelo/hechos/`, commit `e7822ee`).

**Architecture:** Módulo kernel nuevo `app/src/modelo/composicion/` (puro). Reusa el mapa `compartidas: Record<Id,Id>` que ya existe en `submodelos.ts` (el *legging* del cospan) y el patrón de renombrado por namespace de `submodelos/materializacion.ts`. Linealidad = un campo en `Entidad` + un verificador. Todo se valida con el conjunto de hechos del cimiento F0. **No** toca primitivas OPM, `validarModelo`, ni el wire format (salvo adición retrocompatible `Entidad.lineal?`).

**Tech Stack:** TypeScript estricto, Bun test. `cd app && bun test <archivo>`; gate `cd app && bun run check`.

**Diseño de referencia:** `docs/roadmap/capa-categorial-opforja.md` §3 (Linealidad) y §4 (Composición). Este plan implementa **solo el kernel** de F1. La UX (puertos de interfaz, diálogo de mapeo, "compartidas transparentes") es un **plan hermano** posterior (`…-composicion-ux.md`), igual que F0 dejó la UI para después.

**Alcance acotado (lectura más débil que cumple):** la composición opera sobre interfaz **explícita** (`compartidas`), no sobre derivación automática de frontera (esa es fase posterior, heurística). Composición monoidal `⊗` = caso `compartidas = {}` (unión disjunta). Pushout = caso con `compartidas`.

---

## File Structure

- Modify: `app/src/modelo/tipos/entidad.ts` — añadir `lineal?: boolean` a `Entidad`.
- Modify: `app/src/serializacion/validarEntidades.ts` — preservar `lineal` en hidratar/exportar (confirmar firma al iniciar Task 1).
- Create: `app/src/modelo/composicion/linealidad.ts` — `esLineal`, `verificarLinealidad`, `ObservacionLinealidad`.
- Create: `app/src/modelo/composicion/componer.ts` — `componerModelos`, `Interfaz` (mínima).
- Create: `app/src/modelo/composicion/index.ts` — barrel.
- Test: `app/src/modelo/composicion/linealidad.test.ts`, `composicion/componer.test.ts`.
- Test (ley transversal): `app/src/leyes/composicion.test.ts`.

---

## Task 1: `Entidad.lineal` (campo + serialización)

**Files:**
- Modify: `app/src/modelo/tipos/entidad.ts` (interface `Entidad`)
- Modify: `app/src/serializacion/validarEntidades.ts`
- Test: `app/src/serializacion/validarEntidades.test.ts` (existe)

- [ ] **Step 1: Write the failing test** (en `validarEntidades.test.ts`, añadir)

```ts
test("lineal se preserva en roundtrip de entidad", () => {
  const entrada = { id: "o1", tipo: "objeto", nombre: "Energia", esencia: "fisica", afiliacion: "sistemica", lineal: true };
  const r = validarEntidades({ o1: entrada });
  expect(r.ok).toBe(true);
  if (r.ok) expect(r.value.o1!.lineal).toBe(true);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd app && bun test src/serializacion/validarEntidades.test.ts -t "lineal se preserva"`
Expected: FAIL (campo `lineal` no reconocido / undefined).

- [ ] **Step 3: Implement** — en `tipos/entidad.ts`, dentro de `interface Entidad`, añadir junto a `afiliacion`:

```ts
  /** Recurso lineal: se consume, no se copia (default false = copiable). Capa categorial F1. */
  lineal?: boolean;
```
Y en `validarEntidades.ts`, donde se construye la entidad validada, preservar el flag (patrón de los campos opcionales booleanos ya presentes, p.ej. `esAtributo`): copiar `lineal` si `typeof raw.lineal === "boolean"`.

- [ ] **Step 4: Run to verify it passes**

Run: `cd app && bun test src/serializacion/validarEntidades.test.ts -t "lineal se preserva"`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/src/modelo/tipos/entidad.ts app/src/serializacion/validarEntidades.ts app/src/serializacion/validarEntidades.test.ts
git commit -m "feat(composicion): Entidad.lineal — recurso lineal retrocompatible

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: `verificarLinealidad` (un objeto lineal, un consumidor)

**Files:**
- Create: `app/src/modelo/composicion/linealidad.ts`
- Test: `app/src/modelo/composicion/linealidad.test.ts`

Semántica: un objeto **lineal** no puede ser consumido por más de un proceso (no se copia). Diagnóstico puro (no bloquea), paridad con `verificarPegado` del cimiento.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto, crearProceso, crearEnlace } from "../operaciones";
import type { Modelo, Resultado } from "../tipos";
import { verificarLinealidad } from "./linealidad";

function must<T>(r: Resultado<T>): T { if (!r.ok) throw new Error(r.error); return r.value; }

describe("composicion/linealidad", () => {
  test("objeto lineal consumido por dos procesos → error-linealidad", () => {
    // Construir: un objeto lineal + dos procesos que lo consumen.
    // (Confirmar firmas de crearProceso/crearEnlace al iniciar; si difieren,
    //  inyectar enlaces de consumo a mano como en hechos/pegado.test.ts.)
    const modelo = construirObjetoLinealConDosConsumidores();
    const obs = verificarLinealidad(modelo);
    expect(obs.some((o) => o.severidad === "error-linealidad")).toBe(true);
  });

  test("objeto copiable (default) consumido por dos procesos → sin observacion", () => {
    const modelo = construirObjetoCopiableConDosConsumidores();
    expect(verificarLinealidad(modelo)).toEqual([]);
  });
});
```

> El helper `construir…` se arma con las operaciones reales (`crearObjeto`/`crearProceso`/`crearEnlace`) o inyectando enlaces de consumo a mano (patrón verificado en `modelo/hechos/pegado.test.ts`). Marcar el objeto con `lineal: true` vía `{ ...entidad, lineal: true }` en el fixture.

- [ ] **Step 2: Run to verify it fails**

Run: `cd app && bun test src/modelo/composicion/linealidad.test.ts`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implement**

```ts
// app/src/modelo/composicion/linealidad.ts
import type { Entidad } from "../tipos/entidad";
import type { Id, Modelo } from "../tipos";

export interface ObservacionLinealidad {
  codigo: "lineal-multiple-consumo";
  severidad: "error-linealidad";
  entidadId: Id;
  procesos: Id[];
  mensaje: string;
}

export function esLineal(entidad: Entidad): boolean {
  return entidad.lineal === true;
}

/** Un objeto lineal no puede ser consumido por más de un proceso (no se copia). Puro. */
export function verificarLinealidad(modelo: Modelo): ObservacionLinealidad[] {
  const consumidoresPorObjeto = new Map<Id, Set<Id>>();
  for (const enlace of Object.values(modelo.enlaces)) {
    if (enlace.tipo !== "consumo") continue;
    // consumo: objeto (origen) → proceso (destino). Extremos pueden ser entidad o estado.
    const objetoId = extremoEntidadId(enlace.origenId, modelo);
    const procesoId = extremoEntidadId(enlace.destinoId, modelo);
    if (!objetoId || !procesoId) continue;
    if (!consumidoresPorObjeto.has(objetoId)) consumidoresPorObjeto.set(objetoId, new Set());
    consumidoresPorObjeto.get(objetoId)!.add(procesoId);
  }
  const obs: ObservacionLinealidad[] = [];
  for (const [objetoId, procesos] of consumidoresPorObjeto) {
    const entidad = modelo.entidades[objetoId];
    if (entidad && esLineal(entidad) && procesos.size > 1) {
      obs.push({
        codigo: "lineal-multiple-consumo",
        severidad: "error-linealidad",
        entidadId: objetoId,
        procesos: [...procesos],
        mensaje: `El objeto lineal '${entidad.nombre}' es consumido por ${procesos.size} procesos; un recurso lineal no se copia.`,
      });
    }
  }
  return obs;
}

function extremoEntidadId(extremo: { kind: string; id: Id }, modelo: Modelo): Id | null {
  if (extremo.kind === "entidad") return extremo.id;
  return modelo.estados[extremo.id]?.entidadId ?? null;
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd app && bun test src/modelo/composicion/linealidad.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/src/modelo/composicion/linealidad.ts app/src/modelo/composicion/linealidad.test.ts
git commit -m "feat(composicion): verificarLinealidad — un objeto lineal, un consumidor

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: `componerModelos` (pushout por interfaz explícita)

**Files:**
- Create: `app/src/modelo/composicion/componer.ts`
- Test: `app/src/modelo/composicion/componer.test.ts`

Contrato: `componerModelos(a, b, compartidas): Resultado<Modelo>` pega `a` y `b` identificando las entidades de `b` listadas en `compartidas` (`{ entidadDeB: entidadDeA }`) con sus contrapartes de `a`; el resto de `b` se incorpora con IDs renombrados (namespace) para evitar colisión. `compartidas = {}` ⇒ unión disjunta (monoidal `⊗`). Reusa el patrón de namespacing de `submodelos/materializacion.ts`.

- [ ] **Step 1: Write the failing tests** (contrato ejecutable — el corazón del task)

```ts
import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto } from "../operaciones";
import { hechosDe } from "../hechos";
import type { Modelo, Resultado } from "../tipos";
import { componerModelos } from "./componer";

function must<T>(r: Resultado<T>): T { if (!r.ok) throw new Error(r.error); return r.value; }
function unObjeto(nombre: string): Modelo {
  let m = crearModelo();
  m = must(crearObjeto(m, m.opdRaizId, { x: 100, y: 100 }, nombre));
  return m;
}

describe("composicion/componer", () => {
  test("union disjunta (compartidas vacio) conserva entidades de ambos", () => {
    const compuesto = must(componerModelos(unObjeto("A"), unObjeto("B"), {}));
    const nombres = Object.values(compuesto.entidades).map((e) => e.nombre).sort();
    expect(nombres).toEqual(["A", "B"]);
  });

  test("law-composicion-unidad: componer con modelo vacio preserva hechos", () => {
    const a = unObjeto("A");
    const vacio = crearModelo();
    const compuesto = must(componerModelos(a, vacio, {}));
    // Mismos hechos de entidad que A (modulo IDs): misma cantidad de objetos
    const objetosA = Object.values(a.entidades).length;
    const objetosC = Object.values(compuesto.entidades).length;
    expect(objetosC).toBe(objetosA);
  });

  test("law-composicion-no-duplica: una entidad compartida aparece una sola vez", () => {
    const a = unObjeto("Comun");
    const b = unObjeto("Comun");
    const idComunA = Object.values(a.entidades)[0]!.id;
    const idComunB = Object.values(b.entidades)[0]!.id;
    const compuesto = must(componerModelos(a, b, { [idComunB]: idComunA }));
    const comunes = Object.values(compuesto.entidades).filter((e) => e.nombre === "Comun");
    expect(comunes).toHaveLength(1);
  });

  test("no hay colision de IDs tras componer (todos los ids son unicos)", () => {
    const compuesto = must(componerModelos(unObjeto("A"), unObjeto("B"), {}));
    const ids = Object.keys(compuesto.entidades);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `cd app && bun test src/modelo/composicion/componer.test.ts`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implement** (esqueleto con las decisiones clave; el implementador completa el renombrado guiado por los tests)

```ts
// app/src/modelo/composicion/componer.ts
import type { Id, Modelo } from "../tipos";

/** Interfaz mínima F1: las identidades de B que se identifican con A. */
export type Compartidas = Record<Id, Id>; // entidadDeB -> entidadDeA

export function componerModelos(a: Modelo, b: Modelo, compartidas: Compartidas): Resultado<Modelo> {
  // 1. Validar: cada clave de `compartidas` existe en b.entidades; cada valor en a.entidades.
  // 2. Construir mapa de reescritura de IDs de B:
  //    - entidad compartida (clave en `compartidas`) -> su contraparte en A (valor).
  //    - resto de IDs de B -> id namespaced único (patrón submodelos/materializacion.ts).
  // 3. Reescribir entidades/estados/enlaces/opds/apariencias de B con el mapa.
  // 4. Unir con A (A manda en las entidades compartidas). nextSeq = max + 1.
  // 5. Devolver ok(modeloCompuesto). Las entidades compartidas aparecen UNA vez (las de A).
  // Reusar el helper de namespacing de submodelos/materializacion (no reinventar).
}
```

> El renombrado debe reusar el helper de namespace de `app/src/modelo/submodelos/materializacion.ts` (`materializarSnapshotSubmodelo` ya namespacea ids por refId). Confirmar su API exacta al iniciar este task y extraer/compartir el helper si hace falta.

- [ ] **Step 4: Run to verify they pass**

Run: `cd app && bun test src/modelo/composicion/componer.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add app/src/modelo/composicion/componer.ts app/src/modelo/composicion/componer.test.ts
git commit -m "feat(composicion): componerModelos — pushout por interfaz explicita

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Ley transversal — linealidad respeta la composición

**Files:**
- Create: `app/src/leyes/composicion.test.ts`

Conecta T2+T3: componer no debe identificar un objeto lineal de modo que quede con dos consumidores (uno por lado).

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, test } from "bun:test";
import { componerModelos } from "../modelo/composicion";
import { verificarLinealidad } from "../modelo/composicion";
import type { Modelo, Resultado } from "../modelo/tipos";

function must<T>(r: Resultado<T>): T { if (!r.ok) throw new Error(r.error); return r.value; }

describe("LEY law-composicion-respeta-lineal", () => {
  test("identificar un objeto lineal consumido en ambos lados produce error-linealidad en el compuesto", () => {
    // A: objeto lineal L consumido por proc PA. B: objeto lineal L' consumido por PB.
    // compartidas: { L'->L }. Tras componer, L tiene 2 consumidores → verificarLinealidad lo detecta.
    const { a, b, compartidas } = construirDosConsumidoresLineales();
    const compuesto = must(componerModelos(a, b, compartidas));
    expect(verificarLinealidad(compuesto).some((o) => o.severidad === "error-linealidad")).toBe(true);
  });

  test("componerModelos es puro: no muta los modelos de entrada", () => {
    const { a, b, compartidas } = construirDosConsumidoresLineales();
    const antesA = JSON.stringify(a), antesB = JSON.stringify(b);
    componerModelos(a, b, compartidas);
    expect(JSON.stringify(a)).toBe(antesA);
    expect(JSON.stringify(b)).toBe(antesB);
  });
});
```

- [ ] **Step 2–4: Run / implement helper / verify**

Run: `cd app && bun test src/leyes/composicion.test.ts`. La implementación ya existe (T2+T3); este task añade el helper de fixture `construirDosConsumidoresLineales` y verifica la composición de las dos leyes. Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/src/leyes/composicion.test.ts
git commit -m "test(leyes): law-composicion-respeta-lineal + pureza de componerModelos

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Barrel y gate

**Files:**
- Create: `app/src/modelo/composicion/index.ts`

- [ ] **Step 1: Write the barrel**

```ts
export { esLineal, verificarLinealidad, type ObservacionLinealidad } from "./linealidad";
export { componerModelos, type Compartidas } from "./componer";
```

- [ ] **Step 2: Run module + ley**

Run: `cd app && bun test src/modelo/composicion src/leyes/composicion.test.ts`
Expected: PASS (todos los tests de Tasks 1–4).

- [ ] **Step 3: Gate**

Run: `cd app && bun run check`
Expected: typecheck limpio + suite verde. **No** debe haber cambios en `validarModelo` salvo la adición retrocompatible de `lineal`.

- [ ] **Step 4: Commit**

```bash
git add app/src/modelo/composicion/index.ts
git commit -m "feat(composicion): barrel del modulo composicion (F1 kernel)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Acceptance criteria (F1 kernel)

- [ ] `Entidad.lineal?` existe y hace roundtrip en serialización (retrocompatible; modelos sin el campo siguen válidos).
- [ ] `modelo/composicion/` es puro (sin imports de `store/`, `render/`, `ui/`, `preact`).
- [ ] `verificarLinealidad` y `componerModelos` con tests verdes; ambos puros (no mutan entradas).
- [ ] `componerModelos`: unión disjunta y pushout por `compartidas`; lo compartido aparece una vez; sin colisión de IDs.
- [ ] `law-composicion-respeta-lineal` verde.
- [ ] `cd app && bun run check` verde; wire format intacto salvo `lineal?`.

---

## Planes siguientes

- **`…-composicion-ux.md` (F1-UX):** puertos de interfaz visibles, acción "Componer" (Cmd+K), diálogo de mapeo de `compartidas`, render de "compartidas transparentes", OPL del compuesto. Prerrequisito: F1-kernel en `main`. Gate añade `design:governance` + e2e.
- **F2 Equivalencia, F3 Razonamiento:** ver `docs/roadmap/capa-categorial-opforja.md` §5–§6; bajar a plan cuando F1 esté en `main`.

---

## Self-review

- **Spec coverage (§3–§4 del doc maestro):** Linealidad (T1 campo + T2 verificador) ✓; Composición ⊗ y pushout (T3) ✓; interacción linealidad×composición (T4) ✓; UX → plan hermano (declarado) ✓; reusa cimiento F0 `hechosDe` en tests ✓; no toca `validarModelo` salvo adición ✓.
- **Placeholder scan:** linealidad (T1, T2) tiene código completo. La implementación de `componerModelos` (T3) se da como esqueleto con decisiones clave + **tests completos como contrato ejecutable** (el renombrado de IDs reusa `submodelos/materializacion`, cuya API el implementador confirma) — TDD honesto, no placeholder: los tests fijan el comportamiento exacto.
- **Type consistency:** `Entidad.lineal`, `esLineal`, `verificarLinealidad`, `ObservacionLinealidad`, `componerModelos`, `Compartidas` se usan idénticos entre tasks y barrel. `hechosDe` viene del cimiento F0 (commit `e7822ee`).
- **Riesgo residual:** la API exacta del helper de namespacing en `submodelos/materializacion.ts` debe confirmarse al iniciar T3; si no es reutilizable directamente, extraer un helper `renombrarIdsModelo(modelo, prefijo)` puro.

---

## Execution handoff

Plan guardado. Dos opciones de ejecución:
1. **Subagent-driven (recomendado)** — un subagente fresco por task, revisión entre tasks (como se hizo con F0).
2. **Inline** — ejecución por lotes con checkpoints.
