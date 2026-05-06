# Línea 1 — Grid + snap + auto-tamaño + alineación

## 1. Misión

Cerrar la **EPICA-1A completa** (18 HU pendientes), agregando al canvas:
- **Auto-sizing** de cosas: tamaño mínimo por defecto, "ajustar al texto", alternar manual/auto, persistencia de `width/height/modoTamano`.
- **Resize handles**: lateral, esquina, multi-selección con preservación de modo, Shift bloquea relación de aspecto.
- **Cuadrícula ortogonal**: toggle, cuantización al paso, configuración de tamaño/color/grosor, persistencia fuera del JSON OPM.
- **Alineación y distribución**: 6 ejes (izq/centro/der/sup/medio/inf) + distribución uniforme.

Slice mínimo entregable: feature **canvas/UX** sin tocar kernel ni OPL. Toda la lógica vive en `Apariencia.{ancho?,alto?,modoTamano?,gridSnap?}` aditivo + nueva carpeta `canvas/grid.ts` + composer `composers/grid.ts` + Toolbar extendida.

**Fuera de slice**:
- HU-1B traer conectados (línea separada futura ronda 11).
- Reescribir `restrictTranslate` del paper (ya está en `JointCanvas.tsx`); solo se agrega comportamiento condicional.
- No tocar `JOYAS.md` dimensiones canónicas (135x60 sigue siendo el default).

## 2. Deudas que cierra

| HU | Estado actual | Aporte L1 |
|---|---|---|
| HU-1A.001 — Tamaño mínimo por defecto | pendiente | Default `135×60` (CANON.dims) si `apariencia.ancho/alto` no presentes. |
| HU-1A.002 — "Ajustar al texto" | pendiente | Función `ajustarApariciaAlTexto(modelo, opdId, aparienciaId)` que mide nombre + alias y ajusta. |
| HU-1A.003 — Alternar auto-tamaño | pendiente | `Apariencia.modoTamano: "auto" \| "manual"` con toggle desde Inspector/menú. |
| HU-1A.004/.005 — Resize handles lateral/esquina | pendiente | Render de 8 handles + handler `paper.on("element:resize")` con commit a `Apariencia.{ancho,alto}`. |
| HU-1A.006 — Proteger rótulo contra compresión | pendiente | Mínimos `MIN_W = 70`, `MIN_H = 40` en clamp de resize. |
| HU-1A.007 — Volver a auto preservando contenido | pendiente | Acción `volverAAutoTamano(aparienciaId)` que limpia `ancho/alto` y restaura `modoTamano: "auto"`. |
| HU-1A.008 — Persistir ancho/alto/modo por cosa | pendiente | Serialización JSON de los 3 campos opcionales. Roundtrip lossless. |
| HU-1A.009 — Activar cuadrícula con toggle | pendiente | `PreferenciasUiUsuario.gridConfig?.activa` aditivo + toggle en Toolbar. |
| HU-1A.010 — Cuantizar movimiento al paso | pendiente | En `moverApariencia` y `moverAparienciaPorId`: si `gridSnap` está activo, `pos.x = Math.round(x / step) * step`. |
| HU-1A.011 — Configurar tamaño de cuadrícula | pendiente | Modal "Configuración de cuadrícula" con input de paso (default 10). |
| HU-1A.012 — Color y grosor cuadrícula | pendiente | `gridConfig.color` y `.strokeWidth` con defaults. |
| HU-1A.013 — Factor de escala | pendiente | `gridConfig.escala` (multiplica el step base). |
| HU-1A.014 — Persistir preferencias fuera del JSON | pendiente | `PreferenciasUiUsuario.gridConfig` se persiste en `WorkspaceIndice`, NO en JSON OPM. |
| HU-1A.015 — Resize multi-selección | pendiente | `redimensionarBatch(modelo, opdId, ids[], delta)` en `canvas/operacionesBatch.ts` preservando `modoTamano` por cosa. |
| HU-1A.016 — Bloquear aspect-ratio con Shift | pendiente | En handler resize: si `event.shiftKey`, mantener `width/height` ratio del original. |
| HU-1A.017 — Alinear por eje | pendiente | `alinearPorEje(modelo, opdId, ids[], eje: "izq" \| "centro" \| "der" \| "sup" \| "medio" \| "inf")` en `operacionesBatch.ts` + 6 botones Toolbar. |
| HU-1A.018 — Distribuir uniformemente | pendiente | `distribuirUniformemente(modelo, opdId, ids[], orientacion: "horizontal" \| "vertical")` + 2 botones Toolbar. |

## 3. Anclaje a evidencia

- **SSOT**:
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-visual-es.md` V-1..V-240: dimensiones canónicas. La cuadrícula NO altera la semántica OPM; solo asiste el layout.
  - JOYAS §dimensiones (135x60 default) preservado.
- **Corpus interno reusable**:
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/configuration/elementsFunctionality/draw.view.ts` — registro de elementos JointJS. Lectura para entender cómo OPCloud configura resize/grid (no copiar 1:1).
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/DrawnPart/OpmDrawnThing.ts` — clases con `resize`/`autosize` semantics si aplica.
  - **JointJS API canónica**: `paper.options.gridSize`, `paper.options.drawGrid`, `linkPinning`, `restrictTranslate`. Ya están parcialmente cableados en `JointCanvas.tsx` (líneas 117-144). L1 los extiende sin reescribirlos.
- **Estado actual del código (post-9.5)**:
  - `app/src/render/jointjs/JointCanvas.tsx` (321 LOC tras ronda 9): paper config con `gridSize: 10, drawGrid: true` ya activos como default visual. **L1 los hace configurables.**
  - `app/src/canvas/operacionesBatch.ts` (370 LOC): ya tiene `nudgeApariencias`, `alinearEnlacesIzquierda/Arriba/Abajo/Derecha`. **L1 agrega `alinearPorEje` (cosas, no enlaces) + `distribuirUniformemente` + `redimensionarBatch`.**
  - `app/src/modelo/tipos/apariencia.ts` (38 LOC, ronda 9): `Apariencia` ya tiene `width`/`height` requeridos. **L1 NO los rompe**: agrega `ancho?` y `alto?` opcionales para distinguir auto vs manual; al hidratar JSON viejo, `width/height` siguen siendo los efectivos.

  > **Decisión clave**: ¿reusar `width`/`height` directamente o agregar `ancho`/`alto` aditivos? Mejor reusar `width`/`height` y agregar solo `modoTamano?: "auto" | "manual"`. JSON pre-ronda 10 sigue siendo válido (modoTamano default "auto").

  Re-evaluado el plan: **NO agregar `ancho?`/`alto?`**, reusar `width`/`height` existentes y agregar solo `modoTamano?` opcional.

## 4. Archivos permitidos

```text
app/src/modelo/tipos/apariencia.ts                EDIT aditivo (modoTamano?: "auto" | "manual")
app/src/modelo/tipos/ui.ts                        EDIT aditivo (PreferenciasUiUsuario.gridConfig?)
app/src/modelo/operaciones/apariencias.ts         EDIT extiende (redimensionarApariencia, ajustarAlTexto, volverAAuto)
app/src/canvas/grid.ts                            NUEVO (helpers cuantización + tipo GridConfig)
app/src/canvas/grid.test.ts                       NUEVO
app/src/canvas/operacionesBatch.ts                EDIT extiende (alinearPorEje, distribuirUniformemente, redimensionarBatch)
app/src/canvas/operacionesBatch.test.ts           EDIT aditivo
app/src/render/jointjs/composers/entidad.ts       EDIT aditivo (resize handles + width/height del modelo si modoTamano="manual")
app/src/render/jointjs/composers/grid.ts          NUEVO (renderizar cuadrícula visible)
app/src/render/jointjs/composers/grid.test.ts     NUEVO
app/src/render/jointjs/handlers/seleccion.ts      EDIT aditivo (handler clic en resize handle)
app/src/render/jointjs/handlers/drag.ts           EDIT aditivo (snap to grid en drag)
app/src/render/jointjs/handlers/resize.ts         NUEVO opcional (si la lógica de resize merece archivo aparte)
app/src/render/jointjs/proyeccion.ts              EDIT aditivo (opciones grid visible global)
app/src/store/modelo/acciones-entidad.ts          EDIT extiende (redimensionarSeleccionada, ajustarAlTexto, volverAAuto, alternarModoTamano)
app/src/store/modelo/acciones-canvas.ts           EDIT extiende (toggleGrid, fijarGridConfig, alinearSeleccion, distribuirSeleccion)
app/src/store/tipos.ts                            EDIT aditivo (acciones nuevas en OpmStore)
app/src/persistencia/workspace.ts                 EDIT aditivo (gridConfig en preferencias)
app/src/serializacion/validarApariencias.ts       EDIT aditivo (validar modoTamano)
app/src/serializacion/validarApariencias.test.ts  EDIT aditivo
app/src/ui/Toolbar.tsx                            EDIT aditivo (toggle grid, alinear, distribuir, configurar grid)
app/src/ui/InspectorEntidad.tsx                   EDIT aditivo opcional (toggle modoTamano + ajustar al texto)
app/src/ui/inspector/SeccionTamano.tsx            NUEVO opcional (sub-componente para resize/autosize)
app/src/ui/ModalConfiguracionGrid.tsx             NUEVO
app/e2e/opm-smoke.spec.ts                         EDIT aditivo (smoke grid + alinear + resize)
opm-extracted/**                                  LECTURA
docs/HANDOFF.md                                   LECTURA (no editar)
docs/historias-usuario-v2/**                      LECTURA (no editar)
```

Cualquier otro archivo es **fuera de scope**.

## 5. Restricciones de no-colisión

- **No tocar `tipos/entidad.ts`** (territorio L4). L1 toca solo `tipos/apariencia.ts` y `tipos/ui.ts`.
- **No tocar `tipos/enlace.ts`** (territorio L2).
- **No tocar `operaciones/refinamiento/*`** (territorio L3).
- **No tocar `composers/imagenOverlay.ts`** (territorio L4, archivo nuevo).
- **No tocar `Dialogo.tsx` ni `ConfirmacionContext.tsx`** (territorio L5).
- **`composers/entidad.ts`**: L1 puede agregar resize handles cuando seleccionado. L4 agrega badge imagen en otro composer (`imagenOverlay.ts`). Cero choque.
- **`Toolbar.tsx`**: L1 agrega botones grid/alinear/distribuir en su propia sección. L4 agrega toggle modo imagen global en otra sección. Coordinación: cada línea agrega botones al final de la respectiva familia, sin reordenar los previos.
- **`acciones-canvas.ts`** y **`acciones-entidad.ts`**: L1 agrega métodos disjuntos. L5 agrega `buscarEnPanelOpl` en `acciones-canvas.ts` (sin choque). L4 extiende `acciones-entidad.ts` con métodos imagen disjuntos.
- **`opm-smoke.spec.ts`**: agregar smokes al final del archivo, sin tocar tests previos.
- **`canvas/operacionesBatch.ts`**: L1 extiende. No conflict.

## 6. Slice mínimo shippeable

### 6.1 Capa modelo

```ts
// app/src/modelo/tipos/apariencia.ts (extiende)
export interface Apariencia {
  // ... campos existentes
  modoTamano?: "auto" | "manual"; // default "auto" si no presente
}
```

```ts
// app/src/modelo/tipos/ui.ts (extiende)
export interface PreferenciasUiUsuario {
  // ... campos existentes
  gridConfig?: {
    activa: boolean;       // default true
    paso: number;          // default 10
    color: string;         // default "#e4eaf1"
    strokeWidth: number;   // default 1
    escala: number;        // default 1
    snapActivo: boolean;   // default true
  };
}
```

```ts
// app/src/canvas/grid.ts (NUEVO)
export interface GridConfig {
  activa: boolean;
  paso: number;
  color: string;
  strokeWidth: number;
  escala: number;
  snapActivo: boolean;
}

export const GRID_DEFAULT: GridConfig = { ... };

export function cuantizarPosicion(x: number, y: number, config: GridConfig): { x: number; y: number } {
  if (!config.snapActivo) return { x, y };
  const step = Math.round(config.paso * config.escala);
  return { x: Math.round(x / step) * step, y: Math.round(y / step) * step };
}

export function paddingValido(min: number, max: number, valor: number): number {
  return Math.max(min, Math.min(max, valor));
}
```

```ts
// app/src/modelo/operaciones/apariencias.ts (extiende)
export function redimensionarApariencia(
  modelo: Modelo,
  opdId: Id,
  aparienciaId: Id,
  width: number,
  height: number,
): Resultado<Modelo> { /* clamp a MIN_W=70 MIN_H=40 + actualizar modoTamano="manual" */ }

export function ajustarAlTexto(modelo: Modelo, opdId: Id, aparienciaId: Id): Resultado<Modelo> {
  // Mide nombre + alias del entidad asociada y ajusta width/height a tamaño justo.
}

export function volverAAutoTamano(modelo: Modelo, opdId: Id, aparienciaId: Id): Resultado<Modelo> {
  // Limpia modoTamano + restaura width/height a CANON.dims.cosaWidth/Height.
}
```

```ts
// app/src/canvas/operacionesBatch.ts (extiende)
export function alinearPorEje(
  modelo: Modelo,
  opdId: Id,
  ids: Id[],
  eje: "izq" | "centro" | "der" | "sup" | "medio" | "inf",
): Resultado<Modelo> { /* ... */ }

export function distribuirUniformemente(
  modelo: Modelo,
  opdId: Id,
  ids: Id[],
  orientacion: "horizontal" | "vertical",
): Resultado<Modelo> { /* ... */ }

export function redimensionarBatch(
  modelo: Modelo,
  opdId: Id,
  ids: Id[],
  delta: { dw: number; dh: number },
): Resultado<Modelo> { /* preservar modoTamano por cosa */ }
```

### 6.2 Capa render

```ts
// app/src/render/jointjs/composers/grid.ts (NUEVO)
import type { dia } from "jointjs";
import type { GridConfig } from "../../../canvas/grid";

export function configurarGridPaper(paper: dia.Paper, config: GridConfig): void {
  // paper.options.gridSize = step; paper.options.drawGrid = config.activa ? { color, thickness } : false;
}
```

```ts
// app/src/render/jointjs/composers/entidad.ts (aditivo, no rompe)
// Si modoTamano === "manual": usar apariencia.width/height tal cual.
// Si modoTamano === "auto": calcular del nombre+alias+default CANON.dims.
// Renderizar 8 resize handles cuando esta apariencia es la única seleccionada.
```

### 6.3 Capa store + UI

```ts
// app/src/store/modelo/acciones-entidad.ts (extiende)
redimensionarSeleccionada(width: number, height: number) { ... }
ajustarSeleccionadaAlTexto() { ... }
volverSeleccionadaAAuto() { ... }
alternarModoTamanoSeleccionado() { ... }

// app/src/store/modelo/acciones-canvas.ts (extiende)
toggleGrid() { ... }
fijarGridConfig(config: Partial<GridConfig>) { ... }
alinearSeleccion(eje) { ... }
distribuirSeleccion(orientacion) { ... }
```

```tsx
// app/src/ui/Toolbar.tsx (aditivo)
// Agregar sección "Cuadrícula": [▦ Grid ON/OFF] [⚙ Configurar]
// Agregar sección "Alinear": [⇤ Izq] [⇔ Centro] [⇥ Der] [↥ Sup] [↕ Medio] [↧ Inf]
// Agregar sección "Distribuir": [↔ Horizontal] [↕ Vertical]
```

```tsx
// app/src/ui/ModalConfiguracionGrid.tsx (NUEVO)
// Modal con inputs: paso (number), color (color picker simple), grosor (number), escala (number), snap (checkbox).
```

## 7. Tests obligatorios

- **Tests existentes intactos**: 561 tests pasan sin tocar.
- **Tests aditivos** (~10 tests / ~30 expects):
  - `canvas/grid.test.ts`: cuantizar a paso, snap on/off, padding clamp.
  - `canvas/operacionesBatch.test.ts`: alinear izq/centro/der + distribuir horizontal/vertical + redimensionar batch.
  - `render/jointjs/composers/grid.test.ts`: configurar paper con grid + render visible.
  - `serializacion/validarApariencias.test.ts`: aditivo (modoTamano default safe).
- **Smoke aditivo** en `opm-smoke.spec.ts`:
  - `test("toggle cuadricula activa snap y muestra grid")`
  - `test("alinear seleccion 3 cosas a la izquierda")`
  - `test("redimensionar cosa con handle de esquina, persistir modoTamano=manual")`

## 8. Verificación

```bash
cd app
bun run typecheck
bun run test src/canvas/ src/modelo/operaciones/apariencias.test.ts src/render/jointjs/composers/grid.test.ts src/serializacion/validarApariencias.test.ts
bun run check
bun run browser:smoke
bun run build  # chunk principal puede crecer ~5-8 KB
```

## 9. Decisiones bloqueadas (no reabrir)

- **Reusar `width`/`height` de `Apariencia`**: NO agregar campos `ancho?`/`alto?` paralelos. JSON pre-ronda 10 sigue siendo válido.
- **Default `modoTamano = "auto"`**: el JSON pre-ronda 10 hidrata como auto.
- **`PreferenciasUiUsuario.gridConfig` NO va en JSON OPM**: persiste solo en `WorkspaceIndice` (decisión ronda 7 sobre preferencias UI).
- **CANON.dims.cosaWidth/Height (135×60) sigue como default**: la cuadrícula NO altera dimensiones canónicas; solo asiste el layout cuando el usuario activa snap.
- **`MIN_W = 70`, `MIN_H = 40`** como mínimos manuales (HU-1A.006 protección de rótulo).
- **No introducir librerías de UI nuevas** para color picker. Input HTML5 `<input type="color">` es suficiente.

## 10. Decisiones que tomas vos (documentar en commit)

- **Si `composers/entidad.ts` crece > 500 LOC** tras agregar resize handles: extraer `composers/resizeHandles.ts` aparte. Documentar.
- **Si `acciones-canvas.ts` crece > 600 LOC** tras agregar grid + alinear + distribuir: sub-particionar en `acciones-canvas/grid.ts` + `acciones-canvas/alineacion.ts`. Documentar.
- **Render de la cuadrícula**: puede usar `paper.options.drawGrid` directo de JointJS (más simple, menos control) o un overlay SVG custom (más control, más código). Recomendado: `drawGrid` con args de color/thickness, suficiente para HU.
- **Resize handles visuales**: usar `joint-tools` (link tools ya en uso para enlaces) o handles custom. Decidir según evidencia OPCloud + costo.
- **Multi-resize aspect-ratio con Shift**: aplicar el ratio del primer seleccionado a todos. Documentar el criterio.
- **Modal configuración grid**: posición y estilos según `Dialogo.tsx` patrón. Reusar componente `Dialogo` si existe; si no, crear simple.
- **`SeccionTamano.tsx`** sub-componente: crear si emerge claramente; si no, agregar inline en `InspectorEntidad.tsx` reusando patrones existentes.

## 11. Forma del entregable

Commits sugeridos (1-3 commits a tu criterio):

```
1. feat(canvas): grid + snap + auto-tamano + alineacion (EPICA-1A completa)
   - 18 HU cubiertas (HU-1A.001..018)
   - Apariencia.modoTamano? aditivo, PreferenciasUiUsuario.gridConfig? aditivo
   - canvas/grid.ts NUEVO + composers/grid.ts NUEVO
   - operacionesBatch extiende con alinearPorEje, distribuirUniformemente, redimensionarBatch
   - Toolbar: secciones Cuadricula + Alinear + Distribuir
   - ModalConfiguracionGrid NUEVO
   - ~10 tests / ~30 expects nuevos
   - 3 smokes nuevos

   Refs: docs/instrucciones-lineas-dev/ronda10/linea-1-grid-snap-autosize.md,
         opm-extracted/src/app/configuration/elementsFunctionality/draw.view.ts,
         JOYAS §dimensiones (135x60 default preservado).

   Co-Authored-By: <implementador> <noreply@...>
```

**Reporte de cierre obligatorio**:

- Hash final + LOC nuevos por archivo.
- Output `bun run check` (561+ pass / +30 expects).
- Output `bun run browser:smoke` (40+ pass).
- Output `bun run build` (chunk principal ≤ 160 KB).
- Lista de tests aditivos + conteo.
- Decisiones declaradas (de §10).
- Confirmación: JSON pre-ronda 10 hidrata sin pérdida; tipos enlace/entidad/refinamiento NO se tocaron.

**Qué NO tocar**: archivos territorio L2/L3/L4/L5, tests existentes, smoke spec previo, HANDOFF, historias-usuario-v2, JOYAS, customShapes.ts, in-vivo-test.mjs, home/.
