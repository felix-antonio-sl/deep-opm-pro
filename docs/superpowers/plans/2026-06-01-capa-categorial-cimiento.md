# Capa categorial — Cimiento (hecho OPM reificado + sheaf-check) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir el cimiento de la capa categorial de opforja — el *hecho OPM reificado* como dato computable — y su primera ley: el sheaf-check de pegado entre OPDs (`law-pegado-opd`), como diagnóstico puro que NO toca el gate de import.

**Architecture:** Módulo kernel nuevo `app/src/modelo/hechos/` (puro: sin store, render, UI). Proyecta el modelo a un conjunto de hechos atómicos comparables por valor; `seccionLocal` realiza la fibra de una identidad en un OPD (reusa `visibilidadEstados.ts`); `verificarPegado` detecta contradicciones de separación entre vistas. Es la base de los pisos F1–F3 (composición, equivalencia, razonamiento) descritos en `docs/roadmap/capa-categorial-opforja.md`.

**Tech Stack:** TypeScript estricto, Bun test runner. Sin dependencias nuevas. Convenciones del repo: `cd app && bun test <archivo>` para un test; `cd app && bun run check` (typecheck + unit) como gate mínimo.

**Diseño de referencia:** `docs/roadmap/capa-categorial-opforja.md` §2 (Cimiento). Este plan implementa **solo el cimiento** (F0). F1–F3 = planes separados (ver §"Planes siguientes").

---

## File Structure

- Create: `app/src/modelo/hechos/tipos.ts` — tipo `Hecho`, `ConjuntoDeHechos`, `claveHecho`, `conjunto`.
- Create: `app/src/modelo/hechos/proyeccion.ts` — `hechosDe`, `seccionLocal`.
- Create: `app/src/modelo/hechos/pegado.ts` — `verificarPegado`, `ObservacionPegado`.
- Create: `app/src/modelo/hechos/index.ts` — barrel export.
- Test: `app/src/modelo/hechos/tipos.test.ts`
- Test: `app/src/modelo/hechos/proyeccion.test.ts`
- Test: `app/src/leyes/hechos-pegado.test.ts` — la ley transversal `law-pegado-opd`.

Convención del repo: tests unitarios junto al módulo (`modelo/**/*.test.ts`); leyes/invariantes transversales en `leyes/`.

---

## Task 1: Tipo `Hecho` y clave estructural

**Files:**
- Create: `app/src/modelo/hechos/tipos.ts`
- Test: `app/src/modelo/hechos/tipos.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// app/src/modelo/hechos/tipos.test.ts
import { describe, expect, test } from "bun:test";
import { claveHecho, conjunto, type Hecho } from "./tipos";

const hEntidad: Hecho = { tipo: "entidad", entidadId: "o1", clase: "objeto", esencia: "informacional", afiliacion: "sistemica" };
const hEstado: Hecho = { tipo: "estado", entidadId: "o1", estadoId: "s1", nombre: "abierto", designaciones: ["inicial"] };
const hEnlace: Hecho = { tipo: "enlace", enlaceId: "e1", clase: "efecto", origen: { kind: "entidad", id: "p1" }, destino: { kind: "estado", id: "s1" } };

describe("hechos/tipos: clave estructural", () => {
  test("claveHecho es determinista y discrimina por valor", () => {
    expect(claveHecho(hEntidad)).toBe(claveHecho({ ...hEntidad }));
    expect(claveHecho(hEntidad)).not.toBe(claveHecho({ ...hEntidad, afiliacion: "ambiental" }));
    expect(claveHecho(hEstado)).not.toBe(claveHecho(hEnlace));
  });

  test("designaciones no dependen del orden", () => {
    const a: Hecho = { ...hEstado, designaciones: ["inicial", "final"] };
    const b: Hecho = { ...hEstado, designaciones: ["final", "inicial"] };
    expect(claveHecho(a)).toBe(claveHecho(b));
  });

  test("conjunto deduplica por clave estructural", () => {
    const c = conjunto([hEntidad, { ...hEntidad }, hEstado]);
    expect(c.size).toBe(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && bun test src/modelo/hechos/tipos.test.ts`
Expected: FAIL — `Cannot find module './tipos'`.

- [ ] **Step 3: Write minimal implementation**

```ts
// app/src/modelo/hechos/tipos.ts
import type { Afiliacion, Esencia, TipoEntidad } from "../tipos/entidad";
import type { ExtremoEnlace, Modificador, TipoEnlace } from "../tipos/enlace";
import type { DesignacionEstado } from "../tipos/estado";
import type { Id } from "../tipos/comunes";

/**
 * Hecho OPM atómico: la unidad mínima de la denotación de un modelo.
 * Capa semántica (NO primitiva OPM nueva). Base del eje horizontal:
 * composición = unión de hechos; equivalencia = igualdad de hechos de
 * frontera; razonamiento = cierre de hechos. Ver docs/roadmap/capa-categorial-opforja.md §2.
 */
export type Hecho =
  | { tipo: "entidad"; entidadId: Id; clase: TipoEntidad; esencia: Esencia; afiliacion: Afiliacion }
  | { tipo: "estado"; entidadId: Id; estadoId: Id; nombre: string; designaciones: DesignacionEstado[] }
  | { tipo: "enlace"; enlaceId: Id; clase: TipoEnlace; origen: ExtremoEnlace; destino: ExtremoEnlace; modificador?: Modificador };

/** Conjunto de hechos con igualdad estructural (clave canónica → hecho). */
export type ConjuntoDeHechos = ReadonlyMap<string, Hecho>;

function claveExtremo(e: ExtremoEnlace): string {
  return `${e.kind}:${e.id}`;
}

/** Serialización canónica de un hecho: igualdad por valor, estable al orden. */
export function claveHecho(h: Hecho): string {
  switch (h.tipo) {
    case "entidad":
      return `entidad|${h.entidadId}|${h.clase}|${h.esencia}|${h.afiliacion}`;
    case "estado":
      return `estado|${h.entidadId}|${h.estadoId}|${h.nombre}|${[...h.designaciones].sort().join(",")}`;
    case "enlace":
      return `enlace|${h.enlaceId}|${h.clase}|${claveExtremo(h.origen)}|${claveExtremo(h.destino)}|${h.modificador ?? "no"}`;
  }
}

/** Construye un ConjuntoDeHechos deduplicando por clave estructural. */
export function conjunto(hechos: readonly Hecho[]): ConjuntoDeHechos {
  const m = new Map<string, Hecho>();
  for (const h of hechos) m.set(claveHecho(h), h);
  return m;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd app && bun test src/modelo/hechos/tipos.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add app/src/modelo/hechos/tipos.ts app/src/modelo/hechos/tipos.test.ts
git commit -m "feat(hechos): tipo Hecho reificado + clave estructural

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Proyección `hechosDe` y fibra `seccionLocal`

**Files:**
- Create: `app/src/modelo/hechos/proyeccion.ts`
- Test: `app/src/modelo/hechos/proyeccion.test.ts`

**Confirmar antes de empezar** (firmas usadas; verificar contra el repo, son las observadas en `leyes/supresion-estados-aparicion.test.ts`):
- `crearModelo(): Modelo`, `crearObjeto(modelo, opdId, {x,y}, nombre): Resultado<Modelo>`, `crearEstadosIniciales(modelo, objetoId): Resultado<{ modelo: Modelo }>` desde `../operaciones`.
- `aparienciaDeEntidadEnOpd(opd, entidadId): Apariencia | undefined` desde `../politicaApariciones`.
- `estadosVisiblesEnAparicion(modelo, entidadId, apariencia): Estado[]` desde `../visibilidadEstados`.

- [ ] **Step 1: Write the failing test**

```ts
// app/src/modelo/hechos/proyeccion.test.ts
import { describe, expect, test } from "bun:test";
import { crearEstadosIniciales, crearModelo, crearObjeto, desplegarObjeto } from "../operaciones";
import type { Modelo, Resultado } from "../tipos";
import { hechosDe, seccionLocal } from "./proyeccion";

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

function modeloDocEnDosOpds() {
  let modelo = crearModelo();
  const opdRaizId = modelo.opdRaizId;
  modelo = must(crearObjeto(modelo, opdRaizId, { x: 200, y: 120 }, "Documento"));
  const objetoId = Object.values(modelo.entidades).find((e) => e.tipo === "objeto")!.id;
  modelo = must(crearEstadosIniciales(modelo, objetoId)).modelo;
  const desp = must(desplegarObjeto(modelo, opdRaizId, objetoId, "agregacion"));
  return { modelo: desp.modelo as Modelo, objetoId, opdRaizId, opdHijoId: desp.opdId };
}

describe("hechos/proyeccion", () => {
  test("hechosDe(modelo) incluye el hecho-entidad del objeto", () => {
    const { modelo, objetoId } = modeloDocEnDosOpds();
    const hechos = [...hechosDe(modelo).values()];
    expect(hechos.some((h) => h.tipo === "entidad" && h.entidadId === objetoId)).toBe(true);
  });

  test("seccionLocal proyecta la entidad y sus estados visibles en ese OPD", () => {
    const { modelo, objetoId, opdRaizId } = modeloDocEnDosOpds();
    const seccion = [...seccionLocal(modelo, objetoId, opdRaizId).values()];
    expect(seccion.some((h) => h.tipo === "entidad" && h.entidadId === objetoId)).toBe(true);
    expect(seccion.every((h) => h.tipo === "entidad" ? h.entidadId === objetoId : true)).toBe(true);
  });

  test("seccionLocal de una entidad ausente en el OPD es vacía", () => {
    const { modelo, objetoId, opdHijoId } = modeloDocEnDosOpds();
    // el objeto SÍ aparece en el hijo (es el desplegado); usamos un id inexistente
    expect(seccionLocal(modelo, "id-inexistente", opdHijoId).size).toBe(0);
    expect(seccionLocal(modelo, objetoId, "opd-inexistente").size).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && bun test src/modelo/hechos/proyeccion.test.ts`
Expected: FAIL — `Cannot find module './proyeccion'`.

- [ ] **Step 3: Write minimal implementation**

```ts
// app/src/modelo/hechos/proyeccion.ts
import { aparienciaDeEntidadEnOpd } from "../politicaApariciones";
import { estadosVisiblesEnAparicion } from "../visibilidadEstados";
import type { Entidad } from "../tipos/entidad";
import type { Enlace, ExtremoEnlace } from "../tipos/enlace";
import type { Estado } from "../tipos/estado";
import type { Id, Modelo } from "../tipos";
import { conjunto, type ConjuntoDeHechos, type Hecho } from "./tipos";

function hechoEntidad(e: Entidad): Hecho {
  return { tipo: "entidad", entidadId: e.id, clase: e.tipo, esencia: e.esencia, afiliacion: e.afiliacion };
}

function hechoEstado(s: Estado): Hecho {
  return { tipo: "estado", entidadId: s.entidadId, estadoId: s.id, nombre: s.nombre, designaciones: s.designaciones ?? [] };
}

function hechoEnlace(en: Enlace): Hecho {
  return { tipo: "enlace", enlaceId: en.id, clase: en.tipo, origen: en.origenId, destino: en.destinoId, modificador: en.modificador };
}

function extremoTocaEntidad(ex: ExtremoEnlace, entidadId: Id, modelo: Modelo): boolean {
  if (ex.kind === "entidad") return ex.id === entidadId;
  return modelo.estados[ex.id]?.entidadId === entidadId;
}

/** Denotación del modelo (o de un OPD): su conjunto de hechos atómicos. */
export function hechosDe(modelo: Modelo, opdId?: Id): ConjuntoDeHechos {
  const acc: Hecho[] = [];
  if (opdId) {
    const opd = modelo.opds[opdId];
    if (!opd) return conjunto([]);
    for (const ap of Object.values(opd.apariencias)) {
      const ent = modelo.entidades[ap.entidadId];
      if (!ent) continue;
      acc.push(hechoEntidad(ent));
      for (const st of estadosVisiblesEnAparicion(modelo, ent.id, ap)) acc.push(hechoEstado(st));
    }
    for (const ae of Object.values(opd.enlaces)) {
      const en = modelo.enlaces[ae.enlaceId];
      if (en) acc.push(hechoEnlace(en));
    }
    return conjunto(acc);
  }
  for (const ent of Object.values(modelo.entidades)) acc.push(hechoEntidad(ent));
  for (const st of Object.values(modelo.estados)) if (!st.suprimido) acc.push(hechoEstado(st));
  for (const en of Object.values(modelo.enlaces)) acc.push(hechoEnlace(en));
  return conjunto(acc);
}

/** Fibra: hechos sobre una identidad visibles en un OPD (presheaf Vis : OPD^op → Set). */
export function seccionLocal(modelo: Modelo, entidadId: Id, opdId: Id): ConjuntoDeHechos {
  const opd = modelo.opds[opdId];
  if (!opd) return conjunto([]);
  const ap = aparienciaDeEntidadEnOpd(opd, entidadId);
  const ent = modelo.entidades[entidadId];
  if (!ap || !ent) return conjunto([]);
  const acc: Hecho[] = [hechoEntidad(ent)];
  for (const st of estadosVisiblesEnAparicion(modelo, entidadId, ap)) acc.push(hechoEstado(st));
  for (const ae of Object.values(opd.enlaces)) {
    const en = modelo.enlaces[ae.enlaceId];
    if (!en) continue;
    if (extremoTocaEntidad(en.origenId, entidadId, modelo) || extremoTocaEntidad(en.destinoId, entidadId, modelo)) {
      acc.push(hechoEnlace(en));
    }
  }
  return conjunto(acc);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd app && bun test src/modelo/hechos/proyeccion.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add app/src/modelo/hechos/proyeccion.ts app/src/modelo/hechos/proyeccion.test.ts
git commit -m "feat(hechos): proyeccion hechosDe + fibra seccionLocal

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: `verificarPegado` (separación) — sheaf-check como diagnóstico

**Files:**
- Create: `app/src/modelo/hechos/pegado.ts`
- Test: `app/src/modelo/hechos/pegado.test.ts`

**Nota de alcance (no es placeholder):** F0 implementa la **mitad de separación** del sheaf-check — el caso duro y construible: un enlace que referencia un estado suprimido en la aparición de su objeto en ese OPD (el OPD se contradice consigo mismo). La **mitad de gluing** (advertencia por fibras divergentes entre apariciones inter-modelo) entra en F1, cuando existan apariciones compartidas entre modelos. El tipo `SeveridadPegado` ya contempla ambas.

- [ ] **Step 1: Write the failing test**

```ts
// app/src/modelo/hechos/pegado.test.ts
import { describe, expect, test } from "bun:test";
import { crearEstadosIniciales, crearModelo, crearObjeto } from "../operaciones";
import { aparienciaDeEntidadEnOpd } from "../politicaApariciones";
import type { AparienciaEnlace, Enlace } from "../tipos/enlace";
import type { Modelo, Resultado } from "../tipos";
import { verificarPegado } from "./pegado";

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

/** Modelo sano: objeto con estados, sin contradicciones. */
function modeloSano(): Modelo {
  let modelo = crearModelo();
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Documento"));
  const objetoId = Object.values(modelo.entidades).find((e) => e.tipo === "objeto")!.id;
  return must(crearEstadosIniciales(modelo, objetoId)).modelo;
}

/** Modelo corrupto (simula import roto): enlace sobre un estado suprimido en su aparición. */
function modeloCorrupto(): Modelo {
  const modelo = modeloSano();
  const opdRaizId = modelo.opdRaizId;
  const obj = Object.values(modelo.entidades).find((e) => e.tipo === "objeto")!;
  const estado = Object.values(modelo.estados).find((s) => s.entidadId === obj.id)!;
  const enlace: Enlace = {
    id: "enlace-corrupto-1",
    tipo: "efecto",
    origenId: { kind: "entidad", id: obj.id },
    destinoId: { kind: "estado", id: estado.id },
    etiqueta: "",
  };
  const aparienciaEnlace: AparienciaEnlace = { id: "ae-corrupto-1", enlaceId: enlace.id, opdId: opdRaizId, vertices: [] };
  const opd = modelo.opds[opdRaizId]!;
  const apObj = aparienciaDeEntidadEnOpd(opd, obj.id)!;
  return {
    ...modelo,
    enlaces: { ...modelo.enlaces, [enlace.id]: enlace },
    opds: {
      ...modelo.opds,
      [opdRaizId]: {
        ...opd,
        enlaces: { ...opd.enlaces, [aparienciaEnlace.id]: aparienciaEnlace },
        apariencias: { ...opd.apariencias, [apObj.id]: { ...apObj, estadosSuprimidos: [estado.id] } },
      },
    },
  };
}

describe("LEY law-pegado-opd: separación entre vistas (sheaf-check)", () => {
  test("modelo sano no produce observaciones", () => {
    expect(verificarPegado(modeloSano())).toEqual([]);
  });

  test("enlace sobre estado suprimido en su aparición → error-consistencia", () => {
    const obs = verificarPegado(modeloCorrupto());
    expect(obs.length).toBe(1);
    expect(obs[0]!.severidad).toBe("error-consistencia");
    expect(obs[0]!.codigo).toBe("pegado-enlace-estado-suprimido");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && bun test src/modelo/hechos/pegado.test.ts`
Expected: FAIL — `Cannot find module './pegado'`.

- [ ] **Step 3: Write minimal implementation**

```ts
// app/src/modelo/hechos/pegado.ts
import { aparienciaDeEntidadEnOpd } from "../politicaApariciones";
import { estadoVisibleEnAparicion } from "../visibilidadEstados";
import type { Id, Modelo } from "../tipos";

export type SeveridadPegado = "error-consistencia" | "advertencia-consistencia";

export interface ObservacionPegado {
  codigo: string;
  severidad: SeveridadPegado;
  entidadId: Id;
  opdIds: Id[];
  mensaje: string;
}

/**
 * Sheaf-check de pegado entre OPDs (diagnóstico puro; NO bloquea import).
 * F0: separación — un enlace de un OPD no puede referenciar un estado que ese
 * mismo OPD oculta en la aparición del objeto dueño. Ver docs/roadmap/capa-categorial-opforja.md §2.
 */
export function verificarPegado(modelo: Modelo): ObservacionPegado[] {
  const obs: ObservacionPegado[] = [];
  for (const opd of Object.values(modelo.opds)) {
    for (const ae of Object.values(opd.enlaces)) {
      const en = modelo.enlaces[ae.enlaceId];
      if (!en) continue;
      for (const ex of [en.origenId, en.destinoId]) {
        if (ex.kind !== "estado") continue;
        const estado = modelo.estados[ex.id];
        if (!estado) continue;
        const ap = aparienciaDeEntidadEnOpd(opd, estado.entidadId);
        if (!ap) continue;
        if (!estadoVisibleEnAparicion(estado, ap)) {
          obs.push({
            codigo: "pegado-enlace-estado-suprimido",
            severidad: "error-consistencia",
            entidadId: estado.entidadId,
            opdIds: [opd.id],
            mensaje: `El enlace ${en.id} referencia el estado '${estado.nombre}', suprimido en este OPD.`,
          });
        }
      }
    }
  }
  return obs;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd app && bun test src/modelo/hechos/pegado.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add app/src/modelo/hechos/pegado.ts app/src/modelo/hechos/pegado.test.ts
git commit -m "feat(hechos): verificarPegado (sheaf-check separacion) como diagnostico

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Ley transversal `law-pegado-opd` en `leyes/`

**Files:**
- Create: `app/src/leyes/hechos-pegado.test.ts`

Eleva el caso a invariante del repo (paridad con `leyes/proyecciones.test.ts`, `leyes/supresion-estados-aparicion.test.ts`): la ley valida la promesa de severidad, no solo el comportamiento puntual.

- [ ] **Step 1: Write the failing test**

```ts
// app/src/leyes/hechos-pegado.test.ts
import { describe, expect, test } from "bun:test";
import { crearEstadosIniciales, crearModelo, crearObjeto } from "../modelo/operaciones";
import { aparienciaDeEntidadEnOpd } from "../modelo/politicaApariciones";
import { verificarPegado } from "../modelo/hechos";
import type { AparienciaEnlace, Enlace } from "../modelo/tipos/enlace";
import type { Modelo, Resultado } from "../modelo/tipos";

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

function conEnlaceSobreEstadoSuprimido(): Modelo {
  let modelo = crearModelo();
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 200, y: 120 }, "Documento"));
  const obj = Object.values(modelo.entidades).find((e) => e.tipo === "objeto")!;
  modelo = must(crearEstadosIniciales(modelo, obj.id)).modelo;
  const estado = Object.values(modelo.estados).find((s) => s.entidadId === obj.id)!;
  const enlace: Enlace = { id: "ec1", tipo: "efecto", origenId: { kind: "entidad", id: obj.id }, destinoId: { kind: "estado", id: estado.id }, etiqueta: "" };
  const ae: AparienciaEnlace = { id: "aec1", enlaceId: "ec1", opdId: modelo.opdRaizId, vertices: [] };
  const opd = modelo.opds[modelo.opdRaizId]!;
  const apObj = aparienciaDeEntidadEnOpd(opd, obj.id)!;
  return {
    ...modelo,
    enlaces: { ...modelo.enlaces, ec1: enlace },
    opds: { ...modelo.opds, [modelo.opdRaizId]: { ...opd, enlaces: { ...opd.enlaces, aec1: ae }, apariencias: { ...opd.apariencias, [apObj.id]: { ...apObj, estadosSuprimidos: [estado.id] } } } },
  };
}

describe("LEY law-pegado-opd", () => {
  test("separación → error-consistencia, jamás bloquea (es diagnóstico, devuelve lista)", () => {
    const obs = verificarPegado(conEnlaceSobreEstadoSuprimido());
    expect(Array.isArray(obs)).toBe(true);
    expect(obs.some((o) => o.severidad === "error-consistencia")).toBe(true);
  });

  test("verificarPegado es puro: no muta el modelo", () => {
    const m = conEnlaceSobreEstadoSuprimido();
    const antes = JSON.stringify(m);
    verificarPegado(m);
    expect(JSON.stringify(m)).toBe(antes);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && bun test src/leyes/hechos-pegado.test.ts`
Expected: FAIL — `Cannot find module '../modelo/hechos'` (el barrel aún no existe; se crea en Task 5). Si se ejecuta antes de Task 5, falla por import.

- [ ] **Step 3: Write minimal implementation**

No hay implementación nueva: la ley consume `verificarPegado` (Task 3) vía el barrel (Task 5). Si ejecutas las tareas en orden, crea primero el barrel de Task 5, luego corre esta ley. (Reordenar Task 5 antes de Task 4 es válido.)

- [ ] **Step 4: Run test to verify it passes**

Run: `cd app && bun test src/leyes/hechos-pegado.test.ts`
Expected: PASS (2 tests) — tras crear el barrel (Task 5).

- [ ] **Step 5: Commit**

```bash
git add app/src/leyes/hechos-pegado.test.ts
git commit -m "test(leyes): law-pegado-opd (sheaf-check diagnostico, puro)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Barrel export y gate

**Files:**
- Create: `app/src/modelo/hechos/index.ts`

- [ ] **Step 1: Write the barrel**

```ts
// app/src/modelo/hechos/index.ts
export { claveHecho, conjunto, type ConjuntoDeHechos, type Hecho } from "./tipos";
export { hechosDe, seccionLocal } from "./proyeccion";
export { verificarPegado, type ObservacionPegado, type SeveridadPegado } from "./pegado";
```

- [ ] **Step 2: Run the full module + leyes**

Run: `cd app && bun test src/modelo/hechos/ src/leyes/hechos-pegado.test.ts`
Expected: PASS (todos los tests de Tasks 1–4).

- [ ] **Step 3: Run the minimal gate**

Run: `cd app && bun run check`
Expected: typecheck limpio + toda la unit suite verde. **No** debe haber cambios en `serializacion/json.ts::validarModelo` (el pegado es diagnóstico, no gate de import).

- [ ] **Step 4: Commit**

```bash
git add app/src/modelo/hechos/index.ts
git commit -m "feat(hechos): barrel export del modulo hechos (cimiento F0)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Acceptance criteria (F0)

- [ ] `app/src/modelo/hechos/` existe, es puro (sin imports de `store/`, `render/`, `ui/`, `preact`).
- [ ] `hechosDe`, `seccionLocal`, `verificarPegado` con tests verdes.
- [ ] `law-pegado-opd` en `leyes/` verde; `verificarPegado` es puro y devuelve lista (nunca lanza, nunca bloquea).
- [ ] `cd app && bun run check` verde.
- [ ] `validarModelo` intacto (el pegado no entró al gate de import).
- [ ] Sin cambios al wire format `deep-opm-pro.modelo.v0`.

---

## Planes siguientes (un plan por subsistema; bajar cuando el prerrequisito esté en `main`)

> La skill writing-plans manda partir spec multi-subsistema en planes separados, cada uno con software testeable propio. F1–F3 dependen del cimiento; su código se baja a plan ejecutable **después** de F0, no antes (escribirlo ahora sería inventar firmas sobre una base inexistente). Diseño completo en `docs/roadmap/capa-categorial-opforja.md` §3–§6.

- **`2026-XX-XX-capa-categorial-composicion.md` (F1 + Linealidad):** `Entidad.lineal`, `interfazDe`, `componerModelos` (pushout), leyes de composición + `law-lineal-no-clona`; UX puertos + diálogo de mapeo + compartidas transparentes; integra el diagnóstico de pegado (incluida la mitad de **gluing**) al `PanelMetodologia`. Prerrequisito: F0 en `main`.
- **`2026-XX-XX-capa-categorial-equivalencia.md` (F2):** `RealizacionAlternativa`, `verificarEquivalencia` (reusa `seccionLocal`), UX variantes + panel + selector. Cierra el método A0 de `metodologia-forja`. Prerrequisito: F1 en `main`.
- **`2026-XX-XX-capa-categorial-razonamiento.md` (F3):** `derivar` + 4 consultas, badges inferido/declarado, consola Cmd+K. **Frontera dura** anti-Datalog documentada en CONTRIBUTING. Prerrequisito: F0 (idealmente F1–F2) en `main`.

Cada uno gatea con `bun run check` + (si toca UI) `bun run design:governance` + e2e. **Lecciones operativas del repo para esos planes:** apagar el dev server antes de `browser:smoke` (flakes en specs 02/05); correr e2e con `PW_PORT` libre (vite de otro proyecto ocupa `:5173`); reconciliación e2e final sobre el `main` integrado si se paraleliza con la skill `lineas-paralelas`.

---

## Self-review

- **Spec coverage (§2 del doc maestro):** `Hecho`/`ConjuntoDeHechos` (Task 1) ✓; `hechosDe`/`seccionLocal` (Task 2) ✓; `law-pegado-opd` con severidad separación/gluing (Tasks 3–4, gluing declarado para F1) ✓; no toca `validarModelo` ✓; alimenta `PanelMetodologia` → diferido a F1 (es UI; F0 es kernel puro) ✓.
- **Placeholder scan:** sin TBD/TODO; todo paso tiene código o comando real. La "mitad de gluing" es scope declarado de F1, no placeholder en el código de F0 (la función cumple lo que promete).
- **Type consistency:** `Hecho`, `claveHecho`, `conjunto`, `ConjuntoDeHechos`, `hechosDe`, `seccionLocal`, `verificarPegado`, `ObservacionPegado` se usan idénticos entre tasks y barrel. Firmas de operaciones (`crearModelo`/`crearObjeto`/`crearEstadosIniciales`/`desplegarObjeto`/`aparienciaDeEntidadEnOpd`/`estadosVisiblesEnAparicion`/`estadoVisibleEnAparicion`) tomadas de `leyes/supresion-estados-aparicion.test.ts` y `modelo/visibilidadEstados.ts` reales. **Riesgo residual:** confirmar `crearObjeto`/`crearEstadosIniciales` exponen la forma usada al iniciar Task 2.
