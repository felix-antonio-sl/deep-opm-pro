# Cierre de brechas Tier 1 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cerrar tres brechas funcionales acotadas contra el manual simulado OPCloud: visibilidad de esencia en OPL, diálogo de colisión de nombre (reuso-vs-renombrar), y simulación numérica conectada a UI con export CSV.

**Architecture:** Cada brecha es independiente. A enhebra un parámetro opcional `VisibilidadOpl` por la cadena de generadores OPL para una proyección de *display* read-only, dejando el texto canónico (parser/roundtrip) intacto. B añade un helper puro de detección de colisión + un diálogo de UI que orquesta reuso o renombrado (sin cambiar el contrato de `crearEntidad`). F reusa el kernel `generarDatosSimulados` existente + una función CSV pura + un diálogo abierto desde command palette.

**Tech Stack:** Bun 1.3 (test runner), TypeScript strict, Preact 10 + Signals, Zustand 5, JointJS core, Playwright. Tests unit con `bun test`, e2e con `bunx playwright test`.

**Spec:** `docs/superpowers/specs/2026-05-26-cierre-brechas-tier1-design.md`

**Gate de cierre (cada commit de UI/canvas):** `cd app && bun run check && bun run lint && bun run build && bun run design:governance` + subset Playwright afectado. Antes de smoke, apagar el dev server (flakes canvas).

---

## File Structure

**Brecha A (esencia OPL):**
- Modify `app/src/modelo/tipos/ui.ts` — añade `oplEsenciaVisibilidad` a `PreferenciasUiUsuario`.
- Create `app/src/opl/opciones.ts` — tipo `VisibilidadOpl` + default.
- Modify `app/src/opl/generadores/estructural.ts` — `oracionEntidad(entidad, opciones?)`.
- Modify `app/src/opl/generar.ts` — enhebra `opciones` por `generarLineasOpl`/`generarOplInteractivo`.
- Modify `app/src/opl/panel.ts` — doble pase canónico/display.
- Modify `app/src/app/viewmodels/dialogoConfiguracionViewModel.ts` — expone pref + setter.
- Modify `app/src/ui/DialogoConfiguracion.tsx` — sección OPL.
- Modify `app/src/app/viewmodels/panelOplViewModel.ts` — pasa la pref al derive.

**Brecha B (colisión de nombre):**
- Create `app/src/modelo/operaciones/colisionNombre.ts` — `detectarColisionNombre`.
- Create `app/src/ui/DialogoColisionNombre.tsx` — diálogo.
- Modify la capa de acciones de creación/rename para invocar la detección y montar el diálogo (puerto/viewmodel correspondiente).

**Brecha F (simulación numérica):**
- Create `app/src/modelo/simulacion/csv.ts` — `filasSimulacionACsv`.
- Create `app/src/ui/DialogoSimulacionNumerica.tsx` — diálogo.
- Modify `app/src/ui/CommandPalette.tsx` — entrada "Simulación numérica".

---

## Brecha A — Visibilidad de esencia en OPL

### Task A1: Tipo `VisibilidadOpl` y preferencia

**Files:**
- Create: `app/src/opl/opciones.ts`
- Modify: `app/src/modelo/tipos/ui.ts:42` (zona prefs OPL)

- [ ] **Step 1: Crear el tipo y default**

`app/src/opl/opciones.ts`:
```ts
/** Opciones de presentación del OPL. NO afectan el texto canónico (parser/roundtrip). */
export type EsenciaVisibilidad = "siempre" | "solo-difiere" | "oculta";

export interface VisibilidadOpl {
  esencia: EsenciaVisibilidad;
}

export const VISIBILIDAD_OPL_DEFAULT: VisibilidadOpl = { esencia: "siempre" };
```

- [ ] **Step 2: Añadir la preferencia (aditiva, fuera del JSON OPM)**

En `app/src/modelo/tipos/ui.ts`, dentro de `PreferenciasUiUsuario`, junto a `oplNumeracionVisible`:
```ts
  /** Presentación: visibilidad de las oraciones de esencia/afiliación en el panel OPL. */
  oplEsenciaVisibilidad?: "siempre" | "solo-difiere" | "oculta";
```

- [ ] **Step 3: Typecheck**

Run: `cd app && bun run typecheck`
Expected: 0 errores.

- [ ] **Step 4: Commit**

```bash
git add app/src/opl/opciones.ts app/src/modelo/tipos/ui.ts
git commit -m "feat(opl): tipo VisibilidadOpl y preferencia oplEsenciaVisibilidad"
```

### Task A2: `oracionEntidad` respeta la visibilidad de esencia

**Files:**
- Modify: `app/src/opl/generadores/estructural.ts:30-38`
- Test: `app/src/opl/generadores/estructural.test.ts` (crear si no existe)

- [ ] **Step 1: Escribir el test que falla**

`app/src/opl/generadores/estructural.test.ts`:
```ts
import { expect, test } from "bun:test";
import { oracionEntidad } from "./estructural";
import type { Entidad } from "../../modelo/tipos";

const base: Entidad = { id: "o1", tipo: "objeto", nombre: "Sensor", esencia: "informacional", afiliacion: "sistemica" };

test("siempre (default): emite esencia y afiliación", () => {
  expect(oracionEntidad(base)).toEqual(["**Sensor** es informacional.", "**Sensor** es sistémico."]);
});

test("oculta: no emite ni esencia ni afiliación", () => {
  expect(oracionEntidad(base, { esencia: "oculta" })).toEqual([]);
});

test("solo-difiere: omite las que coinciden con el default canónico", () => {
  expect(oracionEntidad(base, { esencia: "solo-difiere" })).toEqual([]);
});

test("solo-difiere: emite solo las que difieren del default", () => {
  const fisicoAmbiental: Entidad = { ...base, esencia: "fisica", afiliacion: "ambiental" };
  expect(oracionEntidad(fisicoAmbiental, { esencia: "solo-difiere" }))
    .toEqual(["**Sensor** es físico.", "**Sensor** es ambiental."]);
});

test("solo-difiere: caso mixto (esencia default, afiliación difiere)", () => {
  const mixto: Entidad = { ...base, afiliacion: "ambiental" };
  expect(oracionEntidad(mixto, { esencia: "solo-difiere" })).toEqual(["**Sensor** es ambiental."]);
});
```

> Nota: `nombreOpl(base)` produce `**Sensor**` (objeto, sin alias/unidad). Verificar el prefijo exacto contra `refsHints.ts:172-199` al implementar.

- [ ] **Step 2: Correr el test (debe fallar)**

Run: `cd app && bun test src/opl/generadores/estructural.test.ts`
Expected: FAIL — `oracionEntidad` no acepta segundo argumento / emite siempre ambas líneas.

- [ ] **Step 3: Implementar**

En `app/src/opl/generadores/estructural.ts`, reemplazar `oracionEntidad`:
```ts
import type { VisibilidadOpl } from "../opciones";

export function oracionEntidad(entidad: Entidad, opciones?: VisibilidadOpl): string[] {
  const atributoValor = oracionValorAtributo(entidad);
  if (atributoValor) return [atributoValor];
  const nombre = nombreOpl(entidad);
  const visibilidad = opciones?.esencia ?? "siempre";
  if (visibilidad === "oculta") return [];
  const lineas: string[] = [];
  const esenciaDifiere = entidad.esencia !== "informacional";
  const afiliacionDifiere = entidad.afiliacion !== "sistemica";
  if (visibilidad === "siempre" || esenciaDifiere) lineas.push(`${nombre} es ${textoEsencia(entidad)}.`);
  if (visibilidad === "siempre" || afiliacionDifiere) lineas.push(`${nombre} es ${textoAfiliacion(entidad)}.`);
  return lineas;
}
```

- [ ] **Step 4: Correr el test (debe pasar)**

Run: `cd app && bun test src/opl/generadores/estructural.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add app/src/opl/generadores/estructural.ts app/src/opl/generadores/estructural.test.ts
git commit -m "feat(opl): oracionEntidad respeta visibilidad de esencia"
```

### Task A3: Enhebrar `VisibilidadOpl` por el barrel generador

**Files:**
- Modify: `app/src/opl/generar.ts:46-128`

- [ ] **Step 1: Escribir el test que falla**

Añadir a `app/src/opl/generar.test.ts`:
```ts
import { generarOpl } from "./generar";
import { crearObjeto, crearModelo } from "../modelo/operaciones";

test("generarOpl con esencia 'oculta' no emite oraciones de esencia", () => {
  let m = crearModelo();
  const r = crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Sensor");
  if (!r.ok) throw new Error(r.error);
  m = r.value;
  const lineas = generarOpl(m, m.opdRaizId, { esencia: "oculta" });
  expect(lineas.some((l) => l.includes("es informacional") || l.includes("es sistémico"))).toBe(false);
});
```

- [ ] **Step 2: Correr (debe fallar)**

Run: `cd app && bun test src/opl/generar.test.ts -t "esencia 'oculta'"`
Expected: FAIL — `generarOpl` no acepta `opciones`.

- [ ] **Step 3: Implementar el threading**

En `app/src/opl/generar.ts`:
```ts
import { type VisibilidadOpl } from "./opciones";

export function generarOpl(modelo: Modelo, opdId: Id = modelo.opdRaizId, opciones?: VisibilidadOpl): string[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  return generarLineasOpl(modelo, opd, opciones).map((linea) => linea.texto);
}

export function generarOplInteractivo(modelo: Modelo, opdId: Id = modelo.opdRaizId, opciones?: VisibilidadOpl): OplLineaInteractiva[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  const lineas = generarLineasOpl(modelo, opd, opciones);
  // ...resto idéntico...
}

function generarLineasOpl(modelo: Modelo, opd: Opd, opciones?: VisibilidadOpl): OplLineaPendiente[] {
  // ...
  // En el bucle de apariencias, cambiar:
  //   for (const oracion of oracionEntidad(entidad)) {
  // por:
  //   for (const oracion of oracionEntidad(entidad, opciones)) {
  // ...resto idéntico...
}
```
(Solo `oracionEntidad` recibe `opciones`; el resto de generadores no cambian en este corte.)

- [ ] **Step 4: Correr (debe pasar)**

Run: `cd app && bun test src/opl/generar.test.ts`
Expected: PASS (incluido el nuevo y los existentes).

- [ ] **Step 5: Commit**

```bash
git add app/src/opl/generar.ts app/src/opl/generar.test.ts
git commit -m "feat(opl): generarOpl/generarOplInteractivo aceptan VisibilidadOpl"
```

### Task A4: `derivarPanelOpl` — doble pase canónico/display

**Files:**
- Modify: `app/src/opl/panel.ts:35-64`
- Test: `app/src/opl/panel.test.ts`

- [ ] **Step 1: Escribir el test que falla**

Añadir a `app/src/opl/panel.test.ts` (un modelo con un objeto; con `esencia:"oculta"` las líneas de display no contienen esencia pero `textoOplActual` sí):
```ts
test("derivarPanelOpl: display oculta esencia pero textoOplActual la conserva", () => {
  let m = crearModelo();
  const r = crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Sensor");
  if (!r.ok) throw new Error(r.error);
  m = r.value;
  const out = derivarPanelOpl({
    modelo: m, opdActivoId: m.opdRaizId, seleccionId: null, enlaceSeleccionId: null,
    filtroActivo: false, busquedaOpl: "", editorLibre: false, textoLibre: "",
    visibilidad: { esencia: "oculta" },
  });
  expect(out.visibles.some((l) => l.texto.includes("es informacional"))).toBe(false);
  expect(out.textoOplActual).toContain("es informacional");
});
```

- [ ] **Step 2: Correr (debe fallar)**

Run: `cd app && bun test src/opl/panel.test.ts -t "oculta esencia"`
Expected: FAIL — `DerivarPanelOplInput` no tiene `visibilidad`.

- [ ] **Step 3: Implementar el doble pase**

En `app/src/opl/panel.ts`:
```ts
import { VISIBILIDAD_OPL_DEFAULT, type VisibilidadOpl } from "./opciones";

export interface DerivarPanelOplInput {
  // ...campos existentes...
  visibilidad?: VisibilidadOpl;
}

export function derivarPanelOpl(input: DerivarPanelOplInput): PanelOplDerivado {
  const seleccionRef = referenciaSeleccionada(input.seleccionId, input.enlaceSeleccionId);
  const visibilidad = input.visibilidad ?? VISIBILIDAD_OPL_DEFAULT;
  const opds = ordenarOpdsParaOpl(input.modelo);
  // Canónico: SIEMPRE todo visible → alimenta textoOplActual, editor, parser.
  const lineasCanonicas = opds.flatMap((id) => generarOplInteractivo(input.modelo, id));
  const textoOplActual = lineasCanonicas.map((l) => l.texto).join("\n");
  // Display: aplica visibilidad. Si es default, reusa el pase canónico.
  const esDefault = visibilidad.esencia === "siempre";
  const lineas = esDefault
    ? lineasCanonicas
    : opds.flatMap((id) => generarOplInteractivo(input.modelo, id, visibilidad));
  const previewLibre = input.editorLibre
    ? planificarEdicionOplLibre(input.modelo, input.textoLibre, { opdActivoId: input.opdActivoId })
    : null;
  const bloques = agruparOracionesPorOpd(lineas, input.modelo);
  const filtradasPorSeleccion = input.filtroActivo ? filtrarLineasPorReferencia(lineas, seleccionRef) : lineas;
  // ...resto idéntico (query/visibles/visiblesPorId/primeraVisibleSeleccionada) usando `lineas`...
  return { query, seleccionRef, lineas, textoOplActual, bloques, visibles, visiblesPorId, primeraVisibleSeleccionada, previewLibre };
}
```

> Invariante: `bloques` para el editor libre se derivan del pase **canónico** si el editor está activo. Como `editorLibre` siembra desde `textoLibre`/`textoOplActual` (canónico), el roundtrip queda intacto. Verificar en `panelOplViewModel` que el editor use `textoOplActual`, no `lineas` de display.

- [ ] **Step 4: Correr (debe pasar) + roundtrip intacto**

Run: `cd app && bun test src/opl/panel.test.ts && bun test src/opl/roundtrip.test.ts`
Expected: PASS — display filtra, canónico y roundtrip intactos.

- [ ] **Step 5: Commit**

```bash
git add app/src/opl/panel.ts app/src/opl/panel.test.ts
git commit -m "feat(opl): derivarPanelOpl con pase display vs canónico (roundtrip intacto)"
```

### Task A5: Pref → viewmodel del panel → derive

**Files:**
- Modify: `app/src/app/viewmodels/panelOplViewModel.ts:90` (zona lectura de prefs OPL)

- [ ] **Step 1: Leer la pref y pasarla al derive**

En `panelOplViewModel.ts`, donde se lee `preferenciasOpl?.oplNumeracionVisible`, leer también:
```ts
const visibilidad = { esencia: preferenciasOpl?.oplEsenciaVisibilidad ?? "siempre" } as const;
```
y pasar `visibilidad` en el objeto que entra a `derivarPanelOpl({ ..., visibilidad })`.

- [ ] **Step 2: Typecheck + unit del viewmodel si existe**

Run: `cd app && bun run typecheck`
Expected: 0 errores.

- [ ] **Step 3: Commit**

```bash
git add app/src/app/viewmodels/panelOplViewModel.ts
git commit -m "feat(opl): panelOplViewModel pasa oplEsenciaVisibilidad al derive"
```

### Task A6: UI — sección OPL en DialogoConfiguracion

**Files:**
- Modify: `app/src/app/viewmodels/dialogoConfiguracionViewModel.ts`
- Modify: `app/src/ui/DialogoConfiguracion.tsx`

- [ ] **Step 1: Exponer pref + setter en el viewmodel**

En `dialogoConfiguracionViewModel.ts`, junto a `gridConfig`/`fijarGridConfig`, exponer:
```ts
oplEsenciaVisibilidad: estado.indice.preferenciasUi?.oplEsenciaVisibilidad ?? "siempre",
fijarOplEsenciaVisibilidad: (valor: "siempre" | "solo-difiere" | "oculta") =>
  // mismo patrón que el toggle de numeración: acciones-canvas.ts:252-253
  actualizarPreferenciasUi(estado.indice, { oplEsenciaVisibilidad: valor }),
```
(Seguir el patrón exacto de cómo `fijarGridConfig` muta el índice vía `actualizarPreferenciasUi`.)

- [ ] **Step 2: Añadir la sección OPL al diálogo**

En `DialogoConfiguracion.tsx`, tras la sección Cuadrícula, añadir:
```tsx
<section style={style.section} aria-labelledby="config-opl-title">
  <h3 id="config-opl-title" style={style.sectionTitle}>OPL</h3>
  <label style={style.field}>
    <span style={style.label}>Esencia</span>
    <select
      aria-label="Visibilidad de esencia en OPL"
      style={style.input}
      value={oplEsenciaVisibilidad}
      onChange={(e) => fijarOplEsenciaVisibilidad(e.currentTarget.value as "siempre" | "solo-difiere" | "oculta")}
    >
      <option value="siempre">Siempre</option>
      <option value="solo-difiere">Solo si difiere del default</option>
      <option value="oculta">Oculta</option>
    </select>
  </label>
</section>
```
Desestructurar `oplEsenciaVisibilidad, fijarOplEsenciaVisibilidad` del viewmodel (línea 14).

- [ ] **Step 3: Gate visual + governance**

Run: `cd app && bun run check && bun run lint && bun run build && bun run design:governance`
Expected: todo verde.

- [ ] **Step 4: Commit**

```bash
git add app/src/app/viewmodels/dialogoConfiguracionViewModel.ts app/src/ui/DialogoConfiguracion.tsx
git commit -m "feat(opl): selector de visibilidad de esencia en DialogoConfiguracion"
```

### Task A7: e2e del flujo

**Files:**
- Create: `app/e2e/28-opl-visibilidad-esencia.spec.ts`

- [ ] **Step 1: Escribir el e2e**

Mirar un spec existente (p.ej. `e2e/03-opl-panel.spec.ts`) para el patrón de arranque/selectores. Flujo: cargar modelo demo → abrir Configuración (command palette o atajo) → cambiar Esencia a "Oculta" → verificar que el panel OPL ya no muestra "es informacional"/"es sistémico"; volver a "Siempre" → reaparecen.

- [ ] **Step 2: Correr (dev server apagado)**

Run: `cd app && bunx playwright test e2e/28-opl-visibilidad-esencia.spec.ts`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add app/e2e/28-opl-visibilidad-esencia.spec.ts
git commit -m "test(e2e): visibilidad de esencia OPL"
```

---

## Brecha B — Diálogo colisión de nombre (creación + rename)

### Task B1: Helper puro `detectarColisionNombre`

**Files:**
- Create: `app/src/modelo/operaciones/colisionNombre.ts`
- Test: `app/src/modelo/operaciones/colisionNombre.test.ts`

- [ ] **Step 1: Escribir el test que falla**

`app/src/modelo/operaciones/colisionNombre.test.ts`:
```ts
import { expect, test } from "bun:test";
import { crearModelo, crearObjeto } from "./index"; // ajustar import real al barrel de operaciones
import { detectarColisionNombre } from "./colisionNombre";

function modeloConSensor() {
  let m = crearModelo();
  const r = crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Sensor");
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

test("sin colisión → null", () => {
  expect(detectarColisionNombre(modeloConSensor(), "Bomba", "objeto")).toBeNull();
});

test("colisión mismo tipo → mismoTipo true + ubicaciones de la existente", () => {
  const m = modeloConSensor();
  const col = detectarColisionNombre(m, "Sensor", "objeto");
  expect(col?.mismoTipo).toBe(true);
  expect(col?.ubicaciones.length).toBeGreaterThan(0);
});

test("colisión tipo distinto → mismoTipo false", () => {
  const m = modeloConSensor();
  const col = detectarColisionNombre(m, "Sensor", "proceso");
  expect(col?.mismoTipo).toBe(false);
});
```

- [ ] **Step 2: Correr (debe fallar)**

Run: `cd app && bun test src/modelo/operaciones/colisionNombre.test.ts`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar**

`app/src/modelo/operaciones/colisionNombre.ts`:
```ts
import type { Id, Modelo, TipoEntidad } from "../tipos";
import { entidadPorNombreCanonico } from "./entidad";

export interface ColisionNombre {
  nombre: string;
  entidadExistenteId: Id;
  mismoTipo: boolean;
  ubicaciones: Array<{ opdId: Id; aparienciaId: Id }>;
}

export function detectarColisionNombre(
  modelo: Modelo,
  nombre: string,
  tipoSolicitado: TipoEntidad,
  excluirEntidadId?: Id,
): ColisionNombre | null {
  const existente = entidadPorNombreCanonico(modelo, nombre, excluirEntidadId);
  if (!existente) return null;
  const ubicaciones: Array<{ opdId: Id; aparienciaId: Id }> = [];
  for (const opd of Object.values(modelo.opds)) {
    for (const ap of Object.values(opd.apariencias)) {
      if (ap.entidadId === existente.id) ubicaciones.push({ opdId: opd.id, aparienciaId: ap.id });
    }
  }
  return {
    nombre,
    entidadExistenteId: existente.id,
    mismoTipo: existente.tipo === tipoSolicitado,
    ubicaciones,
  };
}
```
> Verificar la firma real de `entidadPorNombreCanonico` (entidad.ts:80) — devuelve la entidad o undefined. Ajustar import del barrel `operaciones`.

- [ ] **Step 4: Correr (debe pasar)**

Run: `cd app && bun test src/modelo/operaciones/colisionNombre.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add app/src/modelo/operaciones/colisionNombre.ts app/src/modelo/operaciones/colisionNombre.test.ts
git commit -m "feat(modelo): detectarColisionNombre puro (tipo + ubicaciones)"
```

### Task B2: Componente `DialogoColisionNombre`

**Files:**
- Create: `app/src/ui/DialogoColisionNombre.tsx`

- [ ] **Step 1: Implementar el componente (presentacional, props explícitas)**

Mirar `DialogoConfiguracion.tsx` para el uso de `Dialogo`/`DialogoAccion`/`tokens`. Contrato de props:
```tsx
import { useState } from "preact/hooks";
import { Dialogo, DialogoAccion } from "./Dialogo";

export interface DialogoColisionNombreProps {
  abierto: boolean;
  colision: { nombre: string; mismoTipo: boolean; ubicaciones: Array<{ opdId: string }> } | null;
  contexto: "creacion" | "rename";
  onReutilizar: () => void;        // solo creación + mismoTipo
  onRenombrar: (nuevo: string) => void;
  onIrAUbicacion: (opdId: string) => void;
  onCancelar: () => void;
}
```
Cuerpo: muestra `nombre` en colisión, lista de ubicaciones con "ir a", y un input de renombrado prellenado con sufijo (`${nombre}_2`). Acciones según reglas de la spec §4.2:
- `contexto==="creacion" && colision.mismoTipo` → botones *Reutilizar* · *Renombrar* · *Cancelar*.
- `contexto==="creacion" && !mismoTipo` → *Renombrar* · *Cancelar* (sin reuso).
- `contexto==="rename"` → *Renombrar* · *Cancelar*.

- [ ] **Step 2: Typecheck + governance**

Run: `cd app && bun run typecheck && bun run design:governance`
Expected: verde.

- [ ] **Step 3: Commit**

```bash
git add app/src/ui/DialogoColisionNombre.tsx
git commit -m "feat(ui): DialogoColisionNombre (reuso/renombrar/cancelar)"
```

### Task B3: Orquestar creación con detección de colisión

**Files:**
- Modify: la capa de acciones de creación (puerto `app/src/app/ports/zustandModelCreationPort.ts` / `modelCreationPort.ts` y/o `store/modelo/acciones-entidad.ts`).

- [ ] **Step 1: Test de orquestación (store)**

En el test del puerto/acciones (mirar `store/modelo/acciones-entidad.test.ts` si existe), verificar: al crear una cosa con nombre+tipo existente, el estado expone una colisión pendiente en vez de fallar silenciosamente; al "reutilizar" se crea una **aparición** de la entidad existente (no una entidad nueva); al "renombrar" se crea la entidad con el nuevo nombre.

- [ ] **Step 2: Implementar orquestación**

En la acción de creación: antes de `crearObjeto`/`crearProceso`, llamar `detectarColisionNombre(modelo, nombre, tipo)`. Si hay colisión → guardar `colisionPendiente` en el slice de feedback/diálogos (mirar cómo se montan otros diálogos en el store) y NO crear todavía. El diálogo resuelve:
- *Reutilizar* → `crearAparienciaEntidadEnCanvas(entidadExistenteId, opdId, posicion)` (handler existente).
- *Renombrar* → `crearObjeto/crearProceso(..., nuevoNombre)`.
- *Cancelar* → limpia `colisionPendiente`.

> Verificar el nombre/firma real de `crearAparienciaEntidadEnCanvas` en `render/jointjs/handlers/seleccion.ts:281` y la vía por la que el store la invoca.

- [ ] **Step 3: Correr unit del store**

Run: `cd app && bun test src/store`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A app/src/app/ports app/src/store
git commit -m "feat(store): creación detecta colisión y ofrece reuso-vs-renombrar"
```

### Task B4: Orquestar rename con detección de colisión

**Files:**
- Modify: la acción de rename (donde se invoca `renombrarEntidad`).

- [ ] **Step 1: Test**

Al renombrar hacia un nombre existente, el estado expone colisión con `contexto:"rename"`; resolver con *Renombrar a otro* aplica el nuevo nombre; *Cancelar* mantiene el nombre previo. Sin opción de reuso (invariante #2).

- [ ] **Step 2: Implementar**

Antes de `renombrarEntidad`, `detectarColisionNombre(modelo, nuevoNombre, entidad.tipo, entidadId)`; si colisiona, montar `colisionPendiente` con `contexto:"rename"`.

- [ ] **Step 3: Correr unit**

Run: `cd app && bun test src/store`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A app/src/store app/src/app
git commit -m "feat(store): rename detecta colisión (renombrar/cancelar, sin fusión)"
```

### Task B5: Montar el diálogo + e2e

**Files:**
- Modify: el árbol de UI donde se montan los diálogos (junto a `DialogoConfiguracion`).
- Create: `app/e2e/29-colision-nombre.spec.ts`

- [ ] **Step 1: Montar `DialogoColisionNombre`** con props desde el slice `colisionPendiente`.

- [ ] **Step 2: Escribir e2e**

Crear objeto "Sensor"; crear otro objeto y nombrarlo "Sensor" → aparece el diálogo → *Reutilizar* crea una aparición (no nueva entidad: verificar conteo en árbol/biblioteca) ; repetir y usar *Renombrar* → entidad nueva con sufijo.

- [ ] **Step 3: Gate + e2e (dev server apagado)**

Run: `cd app && bun run check && bun run lint && bun run build && bun run design:governance && bunx playwright test e2e/29-colision-nombre.spec.ts`
Expected: verde.

- [ ] **Step 4: Commit**

```bash
git add -A app/src/ui app/e2e/29-colision-nombre.spec.ts
git commit -m "feat(ui): monta DialogoColisionNombre + e2e creación/rename"
```

---

## Brecha F — Simulación numérica conectada + CSV

### Task F1: `filasSimulacionACsv` puro

**Files:**
- Create: `app/src/modelo/simulacion/csv.ts`
- Test: `app/src/modelo/simulacion/csv.test.ts`

- [ ] **Step 1: Escribir el test que falla**

`app/src/modelo/simulacion/csv.test.ts`:
```ts
import { expect, test } from "bun:test";
import { filasSimulacionACsv } from "./csv";

test("encabezado + filas en orden de columnas", () => {
  const csv = filasSimulacionACsv([{ a: 1, b: 2 }, { a: 3, b: 4 }], ["a", "b"]);
  expect(csv).toBe("a,b\n1,2\n3,4");
});

test("celda undefined → vacía", () => {
  expect(filasSimulacionACsv([{ a: undefined }], ["a"])).toBe("a\n");
});

test("escapa comas, comillas y saltos", () => {
  const csv = filasSimulacionACsv([{ a: 'x,"y"\nz' }], ["a"]);
  expect(csv).toBe('a\n"x,""y""\nz"');
});
```

- [ ] **Step 2: Correr (debe fallar)**

Run: `cd app && bun test src/modelo/simulacion/csv.test.ts`
Expected: FAIL — módulo inexistente.

- [ ] **Step 3: Implementar**

`app/src/modelo/simulacion/csv.ts`:
```ts
import type { ValorConcreto } from "../tipos";

function celda(valor: ValorConcreto | undefined): string {
  if (valor === undefined) return "";
  const texto = String(valor);
  return /[",\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
}

export function filasSimulacionACsv(
  filas: Array<Record<string, ValorConcreto | undefined>>,
  columnas: string[],
): string {
  const header = columnas.map(celda).join(",");
  const cuerpo = filas.map((fila) => columnas.map((c) => celda(fila[c])).join(",")).join("\n");
  return cuerpo ? `${header}\n${cuerpo}` : header;
}
```
> Verificar el tipo `ValorConcreto` (entidad.ts) — es `number | string` (o similar); `String(valor)` cubre ambos.

- [ ] **Step 4: Correr (debe pasar)**

Run: `cd app && bun test src/modelo/simulacion/csv.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add app/src/modelo/simulacion/csv.ts app/src/modelo/simulacion/csv.test.ts
git commit -m "feat(simulacion): filasSimulacionACsv puro con escape"
```

### Task F2: Componente `DialogoSimulacionNumerica`

**Files:**
- Create: `app/src/ui/DialogoSimulacionNumerica.tsx`

- [ ] **Step 1: Implementar (presentacional + lógica de corrida local)**

Contrato de props:
```tsx
export interface DialogoSimulacionNumericaProps {
  abierto: boolean;
  columnas: string[]; // nombres de atributos simulables
  onEjecutar: (n: number) => Array<Record<string, number | string | undefined>>; // envuelve generarDatosSimulados(modelo, n)
  onCerrar: () => void;
}
```
Cuerpo: input N (min 1, máx p.ej. 10000 con aviso), botón **Ejecutar** → guarda `filas` en estado local y renderiza tabla (`columnas` × filas). Si `columnas.length === 0` → estado vacío: "Marca atributos como simulables en el inspector". Botón **Descargar CSV**: `filasSimulacionACsv(filas, columnas)` → Blob → `a[download]` (mirar el patrón de descarga existente, p.ej. export JSON/SVG en `ui/PersistenciaJson.tsx` o `render/jointjs/mapaExport.ts`).
Usar `Dialogo`/`DialogoAccion`/`tokens` como las demás superficies.

- [ ] **Step 2: Typecheck + governance**

Run: `cd app && bun run typecheck && bun run design:governance`
Expected: verde.

- [ ] **Step 3: Commit**

```bash
git add app/src/ui/DialogoSimulacionNumerica.tsx
git commit -m "feat(ui): DialogoSimulacionNumerica (N corridas, tabla, CSV)"
```

### Task F3: Entrada en command palette + cableado al modelo

**Files:**
- Modify: `app/src/ui/CommandPalette.tsx`
- Modify: el árbol de UI que monta diálogos (montar `DialogoSimulacionNumerica`).

- [ ] **Step 1: Añadir la entrada**

En `CommandPalette.tsx`, añadir una entrada (mirar el patrón de las existentes, p.ej. la de "Simulación conceptual"/"Buscar en el modelo") categoría vista/herramientas: "Simulación numérica" → abre el diálogo (flag de apertura en el slice de UI).

- [ ] **Step 2: Cablear columnas + onEjecutar**

`columnas` = `Object.values(modelo.entidades).filter(e => e.esAtributo && e.valorSlot && e.simulacion?.simulable).map(e => e.nombre)`. `onEjecutar = (n) => generarDatosSimulados(modelo, n)`.

- [ ] **Step 3: Gate completo**

Run: `cd app && bun run check && bun run lint && bun run build && bun run design:governance`
Expected: verde.

- [ ] **Step 4: Commit**

```bash
git add app/src/ui/CommandPalette.tsx app/src/ui
git commit -m "feat(ui): abre simulación numérica desde command palette"
```

### Task F4: e2e

**Files:**
- Create: `app/e2e/30-simulacion-numerica.spec.ts`

- [ ] **Step 1: Escribir el e2e**

Cargar un modelo con al menos un atributo simulable (o crearlo en el flujo) → ⌘K → "Simulación numérica" → fijar N=5 → Ejecutar → verificar tabla con 5 filas → click Descargar CSV → verificar que se dispara la descarga (interceptar `download` en Playwright). Caso vacío: sin atributos simulables → estado vacío visible.

- [ ] **Step 2: Correr (dev server apagado)**

Run: `cd app && bunx playwright test e2e/30-simulacion-numerica.spec.ts`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add app/e2e/30-simulacion-numerica.spec.ts
git commit -m "test(e2e): simulación numérica + descarga CSV"
```

---

## Cierre del corte

- [ ] **Gate final completo**

Run: `cd app && bun run check && bun run lint && bun run build && bun run design:governance`
Expected: todo verde. Luego (dev server apagado) el subset Playwright: `bunx playwright test e2e/03-opl-panel.spec.ts e2e/28-opl-visibilidad-esencia.spec.ts e2e/29-colision-nombre.spec.ts e2e/30-simulacion-numerica.spec.ts`.

- [ ] **Actualizar `docs/HANDOFF.md`**

Reescribir la sección "Corte actual" para registrar el cierre Tier 1 (esencia OPL, colisión de nombre, simulación numérica CSV), con los hashes y la verificación verde. No crear handoffs paralelos.

- [ ] **Actualizar memoria de auditoría**

Marcar en la matriz de cobertura (cuando exista) que estas 3 capacidades pasan a cubiertas, y que unidades/alias visibilidad queda diferida con su razón.

## Self-review (cobertura spec)

- §4.1 A esencia → Tasks A1–A7. ✅ (unidades/alias explícitamente fuera).
- §4.2 B colisión (creación+rename, sin fusión, tipos incompatibles) → Tasks B1–B5. ✅
- §4.3 F sim numérica + CSV + palette → Tasks F1–F4. ✅
- Invariante #1 (canon intacto/roundtrip) → Task A4 step 4 lo verifica explícitamente.
- Invariante #4 (governance) → gates `design:governance` en A6/B5/F3.
- Testing TDD por brecha → cada task abre con test que falla.

Notas de verificación para el implementador (firmas a confirmar al tocar el archivo, no inventar): `entidadPorNombreCanonico` (entidad.ts:80), `crearAparienciaEntidadEnCanvas` (handlers/seleccion.ts:281), `ValorConcreto` (tipos), patrón de descarga (PersistenciaJson/mapaExport), montaje de diálogos en el árbol de UI, y el patrón de entradas de `CommandPalette`.
