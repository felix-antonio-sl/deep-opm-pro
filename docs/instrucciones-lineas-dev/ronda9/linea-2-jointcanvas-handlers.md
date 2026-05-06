# Línea 2 — Handlers JointCanvas por familia

## 1. Misión

Romper el componente `app/src/render/jointjs/JointCanvas.tsx` (**697 LOC**) en sub-archivos por **familia de handlers de eventos JointJS**, conservando la API pública del componente (`<JointCanvas />` sin props), el comportamiento observable de eventos y los `data-testid` del paper. La forma OPCloud para este problema es **objetos de configuración con métodos disjuntos por evento** (`opm-extracted/src/app/configuration/rappidEnviromentFunctionality/selectionConfiguration.ts:5-65` con 4 métodos `blankPointerdown`/`cellPointerdown`/`selectionBoxPointerdown`/`selectionBoxPointerup`); destilamos ese patrón a TypeScript con módulos por familia que exponen funciones puras `(args) => () => void` (cleanup). El componente Preact queda como **orquestador delgado** que monta el paper y cablea handlers.

Cierre arquitectural: `JointCanvas.tsx` queda como **orquestador < 200 LOC** (objetivo) / < 350 LOC (tope absoluto); todo el código de handlers vive en `app/src/render/jointjs/handlers/<familia>.ts`. Cada handler es testeable en aislamiento con un `dia.Paper` mock y un `dia.Graph` mock. Ningún test reescribe los smokes existentes.

**Slice mínimo entregable**:

8 sub-archivos nuevos en `app/src/render/jointjs/handlers/`:

- `seleccion.ts`: `cablearSeleccion(args)` instala handlers `cell:pointerdown`, `blank:pointerdown` con detección de Ctrl/Cmd+clic para multi-selección, click sobre estado para extremos de enlace, click sobre apariencia plegada para extraer parte. Retorna cleanup. Consume `seleccionarEntidad`, `seleccionarEnlace`, `agregarASeleccion`, `quitarDeSeleccion`, `seleccionarEstadoComoExtremo`, `seleccionarPartePlegada` del store.
- `zoom.ts`: `cablearZoom(args)` instala handler de `wheel` con Ctrl modifier para zoom canvas (delegando a `zoomCanvasEnCursor`) y Ctrl+0 fit-to-screen (`fitCanvasAPantalla`). Helper `limitarZoom` queda local. Constantes `ZOOM_MIN`/`ZOOM_MAX` quedan locales o en `helpers.ts`.
- `pan.ts`: `cablearPan(args)` instala handlers de pan (mouse middle / Shift+drag opcional). Si actualmente no hay pan independiente del rubber band, este archivo puede ser pequeño o difererirse a tomar lo de `cablearRubberBand` que tiene también pan accidental.
- `rubberBand.ts`: `cablearRubberBand(args)` instala handler `blank:pointerdown` con Shift modifier que inicia rubber band SVG (`iniciarRubberBand`), tracking pointer move/up, intersección con apariencias del OPD activo, commit a `seleccionMultiple` del store.
- `teclado.ts`: `cablearTeclado(args)` opcional — si actualmente las teclas Esc/Delete/flechas/Ctrl+A/C/V se manejan via `atajosTeclado.ts` registry global (decisión ronda 7), este archivo solo cablea las teclas que el paper consume directamente (raras). Si no hay teclas locales del paper, omitir el archivo.
- `drag.ts`: `cablearDrag(args)` instala handler `element:pointermove`/`element:pointerup` con `embedirContorno` para drag de subprocesos dentro de contorno de descomposición, drag de proxy plegado, commit a `moverApariencia`/`moverAparienciaPorId` del store. Maneja también `element:pointerdblclick` para `extraerParteDePlegado`.
- `hoverOpl.ts`: `cablearHoverOpl(args)` instala handlers `cell:mouseover`/`cell:mouseout` que computan `OplReferencia` desde la cell y llaman a `fijarHoverOpl` del store. Helper `aplicarHoverOpl` queda local.
- `toolsEnlace.ts`: `cablearToolsEnlace(args)` instala/desinstala link tools (`Boundary`, `Vertices`, `Segments`) cuando un enlace es seleccionado. Helper `instalarHerramientasEnlaceSeleccionado` se mueve aquí.

1 archivo de soporte:

- `helpers.ts`: helpers compartidos entre 2+ handlers — `metadata`, `parteEntidadDesdeSelector`, `estadoDesdeSelector`, `refDesdeCellView`, `cellViewModel`, `graphEvents`, `jointSelector`, `paperView`, `posicionCanvasDesdeEvento`, `ctrlEvento`, `shiftEvento`, `multiEvento`, `setPaperDimensions`, `dimensionesPaper`, `embedirContorno`, `CANVAS_BASE`, `CANVAS_PADDING`, `ZOOM_MIN`, `ZOOM_MAX`, `fitCanvasAPantalla`, `zoomCanvasEnCursor`, `limitarZoom`. Si `embedirContorno` solo se usa en `drag.ts`, quedará ahí; si lo usan zoom/pan también, va en helpers.

Barrel `JointCanvas.tsx` reducido (orquestador):

```tsx
// app/src/render/jointjs/JointCanvas.tsx (< 200 LOC)
/**
 * Componente Preact que monta el paper JointJS y cablea handlers por familia.
 * Los handlers viven en handlers/{seleccion,zoom,pan,rubberBand,teclado,drag,hoverOpl,toolsEnlace}.ts.
 * El componente solo orquesta: monta paper, suscribe a store, llama a cada cableador
 * con el contexto necesario, retorna cleanup compuesto.
 */
import { useEffect, useRef } from "preact/hooks";
import { useOpmStore, store } from "../../store";
import { JointAdapter, /* ... */ } from "...";
import { cablearSeleccion } from "./handlers/seleccion";
import { cablearZoom } from "./handlers/zoom";
import { cablearPan } from "./handlers/pan";
import { cablearRubberBand } from "./handlers/rubberBand";
import { cablearDrag } from "./handlers/drag";
import { cablearHoverOpl } from "./handlers/hoverOpl";
import { cablearToolsEnlace } from "./handlers/toolsEnlace";

export function JointCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  const adapterRef = useRef<JointAdapter | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const adapter = new JointAdapter(ref.current);
    adapterRef.current = adapter;

    const cleanups = [
      cablearSeleccion({ adapter, store }),
      cablearZoom({ adapter, store }),
      cablearPan({ adapter, store }),
      cablearRubberBand({ adapter, store }),
      cablearDrag({ adapter, store }),
      cablearHoverOpl({ adapter, store }),
      cablearToolsEnlace({ adapter, store }),
    ];

    return () => {
      cleanups.forEach((fn) => fn());
      adapter.dispose();
    };
  }, []);

  // useEffects derivados (proyección modelo → cells, hover, modo enlace, etc.)
  // pueden quedar en el componente o moverse a hooks separados si crecen.

  return <div ref={ref} data-testid="canvas-jointjs" /* ... */ />;
}
```

`proyeccion.test.ts` y `customShapes.ts` son lectura. Los smokes de `app/e2e/opm-smoke.spec.ts` son lectura (sumar smokes solo si la partición altera selectores observables).

**Fuera de slice**:

- **No tocar `proyeccion.ts`**, `composers/*` (territorio L2 ronda 8, ya cerrado).
- **No tocar `mapaSistema.ts`**, `abanicoOverlay.ts`, `abanicoDragSync.ts` (otros archivos de render no relacionados con canvas principal).
- **No tocar `customShapes.ts`** (WIP del operador).
- **No tocar `JointCanvas.test.ts`** si existe (preservar intacto). Verificar: `find app/src/render -name "*JointCanvas*" -name "*.test.ts"` → si existe, intacto.
- **No reabrir contratos visuales**: dimensiones, colores, tipografía, marcadores se preservan vía composers L2 ronda 8.
- **No reescribir `atajosTeclado.ts`** (registry global, ronda 7). Si una tecla específica del paper no encaja, dejarla en el componente con comentario.

## 2. Deudas que cierra

| Deuda | Path absoluto | Aporte |
|---|---|---|
| Componente JointCanvas mezclando 6+ familias de handlers | `/home/felix/projects/deep-opm-pro/app/src/render/jointjs/JointCanvas.tsx` (697 LOC) | Reduce a < 200 LOC en orquestador; 8 sub-archivos de handlers < 200 LOC c/u. |
| HANDOFF "deuda técnica `JointCanvas.tsx` 697 LOC" | `/home/felix/projects/deep-opm-pro/docs/HANDOFF.md §Pendientes Inmediatos` | Cierra el ítem; los handlers son testeables en aislamiento. |
| Imposibilidad de testear handlers JointJS aislados | (no había tests dedicados) | Cada handler queda exportado con su firma; tests aditivos con paper/graph mock. |

## 3. Anclaje a evidencia

- **SSOT**:
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-visual-es.md` V-1 a V-240: define el render canónico que los handlers respetan. Las decisiones visuales viven en composers L2 ronda 8; los handlers solo cablean eventos.
- **Corpus interno reusable**:
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/configuration/rappidEnviromentFunctionality/selectionConfiguration.ts:5-65` — `selectionConfiguration` con 4 métodos disjuntos por evento (`blankPointerdown`, `cellPointerdown`, `selectionBoxPointerdown`, `selectionBoxPointerup`). Patrón canónico: **un objeto de configuración por familia de evento, cada método autónomo**.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/configuration/rappidEnviromentFunctionality/keyboardShortcuts.ts:6-50` — registry de shortcuts. Confirma decisión ronda 7 de `atajosTeclado.ts`; los handlers de paper son disjuntos del registry global.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/configuration/elementsFunctionality/draw.view.ts` — registro central de shapes y plugins JointJS. En nuestro stack equivalente vive en `JointAdapter` (no se toca aquí).
  - `/home/felix/projects/deep-opm-pro/opm-extracted/REFACTOR-NOTES.md:21` — code splitting por chunk semántico. Aplicado en ronda 8 (vendor-jointjs). L2 ronda 9 NO altera el splitting; solo reordena dentro del chunk.
  - `/home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda8/linea-2-render-composers.md` — brief composers L2 ronda 8. Patrón replicado: barrel + sub-archivos por familia.
- **Estado actual del código (post-ronda 8)**:
  - `app/src/render/jointjs/JointCanvas.tsx` (697 LOC): 12+ `useEffect` que montan handlers JointJS. Funciones internas: `metadata`, `parteEntidadDesdeSelector`, `estadoDesdeSelector`, `refDesdeCellView`, `aplicarHoverOpl`, `instalarHerramientasEnlaceSeleccionado`, `cellViewModel`, `graphEvents`, `jointSelector`, `paperView`, `fitCanvasAPantalla`, `zoomCanvasEnCursor`, `limitarZoom`, `posicionCanvasDesdeEvento`, `ctrlEvento`, `shiftEvento`, `multiEvento`, `iniciarRubberBand`, `setPaperDimensions`, `embedirContorno`, `dimensionesPaper`. Constantes `CANVAS_BASE`, `CANVAS_PADDING`, `ZOOM_MIN`, `ZOOM_MAX`, `style`.
  - Composers L2 ronda 8 estables en `render/jointjs/composers/` (entidad, enlace, markers, plegado, estados, halos, colores).
  - Tests existentes: `app/src/render/jointjs/proyeccion.test.ts` (820 LOC) — cubre composers; no tests de handlers directamente. Tests smoke `app/e2e/opm-smoke.spec.ts` cubren interacciones (clicks, drag, etc.).

## 4. Archivos permitidos

```text
app/src/render/jointjs/JointCanvas.tsx                 EDIT — reducir a orquestador < 200 LOC (objetivo) / < 350 LOC (tope)
app/src/render/jointjs/handlers/seleccion.ts           NUEVO
app/src/render/jointjs/handlers/seleccion.test.ts      NUEVO opcional
app/src/render/jointjs/handlers/zoom.ts                NUEVO
app/src/render/jointjs/handlers/zoom.test.ts           NUEVO opcional
app/src/render/jointjs/handlers/pan.ts                 NUEVO opcional (omitir si no hay pan independiente)
app/src/render/jointjs/handlers/rubberBand.ts          NUEVO
app/src/render/jointjs/handlers/rubberBand.test.ts     NUEVO opcional
app/src/render/jointjs/handlers/teclado.ts             NUEVO opcional (omitir si no hay teclas del paper)
app/src/render/jointjs/handlers/drag.ts                NUEVO
app/src/render/jointjs/handlers/drag.test.ts           NUEVO opcional
app/src/render/jointjs/handlers/hoverOpl.ts            NUEVO
app/src/render/jointjs/handlers/hoverOpl.test.ts       NUEVO opcional
app/src/render/jointjs/handlers/toolsEnlace.ts         NUEVO
app/src/render/jointjs/handlers/toolsEnlace.test.ts    NUEVO opcional
app/src/render/jointjs/handlers/helpers.ts             NUEVO (helpers compartidos entre 2+ handlers)
app/src/render/jointjs/handlers/helpers.test.ts        NUEVO opcional
app/e2e/opm-smoke.spec.ts                              EDIT aditivo (smokes nuevos solo si selector cambia)
opm-extracted/**                                       LECTURA
docs/HANDOFF.md                                        LECTURA (no editar)
docs/historias-usuario-v2/**                           LECTURA (no editar)
```

## 5. Restricciones de no-colisión

- **No editar composers L2 ronda 8** (`render/jointjs/composers/*`): son lectura.
- **No editar `proyeccion.ts`** ni `proyeccionTipos.ts` ni `customShapes.ts` ni `JointAdapter`/`linkAssets.ts`/`abanicoOverlay.ts`/`mapaSistema.ts`.
- **No tocar `tipos.ts` global** (territorio L5).
- **No tocar `store/*`** (territorio L4 indirectamente; los handlers consumen el store pero no editan sus archivos).
- **No introducir dependencias nuevas**.
- **Smokes existentes pasan sin reescribir**. Si un smoke falla, hay bug en la partición.
- **Selectores visibles preservados**: `data-testid="canvas-jointjs"` y todos los `data-testid` que el paper exponga directamente.
- **Cleanup correcto**: cada `cablearXxx` retorna una función que desinstala todos sus listeners. La composición de cleanups en `useEffect` debe ser limpia (sin leaks de listeners cross-mount).

## 6. Slice mínimo shippeable

### 6.1 Capa render (única capa que toca L2)

Cada handler tiene firma estándar:

```ts
// app/src/render/jointjs/handlers/seleccion.ts
import type { dia } from "@joint/core";
import type { JointAdapter } from "../JointAdapter";
import type { StoreApi } from "zustand/vanilla";
import type { OpmStore } from "../../store/tipos";

interface CablearArgs {
  adapter: JointAdapter;
  store: StoreApi<OpmStore>;
}

/**
 * Handlers de selección JointJS: click simple, Ctrl/Cmd+clic multi, click sobre estado,
 * click sobre apariencia plegada, blank deselect.
 * Refs: opm-extracted selectionConfiguration.ts:5-65 (patrón disjunto por evento).
 */
export function cablearSeleccion({ adapter, store }: CablearArgs): () => void {
  const paper = adapter.paper;
  const onCellPointerdown = (cellView: dia.CellView, evt: dia.Event, x: number, y: number) => { /* ... */ };
  const onBlankPointerdown = (evt: dia.Event, x: number, y: number) => { /* ... */ };

  paper.on("cell:pointerdown", onCellPointerdown);
  paper.on("blank:pointerdown", onBlankPointerdown);

  return () => {
    paper.off("cell:pointerdown", onCellPointerdown);
    paper.off("blank:pointerdown", onBlankPointerdown);
  };
}
```

### 6.2 Helpers compartidos

```ts
// app/src/render/jointjs/handlers/helpers.ts
/**
 * Helpers compartidos entre handlers del paper JointJS.
 */
export function jointSelector(target: EventTarget | null): string | null { /* ... */ }
export function ctrlEvento(evt: dia.Event): boolean { /* ... */ }
export function shiftEvento(evt: dia.Event): boolean { /* ... */ }
export function multiEvento(evt: dia.Event): boolean { /* ... */ }
export function metadata(cell: dia.Cell): OpmJointMetadata | null { /* ... */ }
export function refDesdeCellView(cellView: dia.CellView, target: EventTarget | null): OplReferencia | null { /* ... */ }
// ... etc
```

### 6.3 Orquestador `JointCanvas.tsx`

El componente queda como cableador delgado: monta el paper vía `JointAdapter`, invoca cada `cablearXxx`, compone cleanups, suscribe al store para los `useEffect` derivados (proyección modelo → cells, modo enlace, multi-selección activa, vista mapa toggle, etc.).

Si el componente sigue creciendo en `useEffect` derivados después del refactor, considerar mover esos efectos a `hooks/useProyectarModelo.ts`/`useModoEnlace.ts`/etc. (declarado en §10 como decisión del implementador).

## 7. Tests obligatorios

- **Smokes existentes intactos**: `app/e2e/opm-smoke.spec.ts` 40/40 verde post-refactor. Si falla, hay bug en partición.
- **`proyeccion.test.ts` intacto**: 820 LOC, no se toca.
- **Tests aditivos por handler (recomendados)**:
  - `seleccion.test.ts`: 1+ test por modo de selección (simple, Ctrl+clic agregar, Ctrl+clic quitar, click estado, click parte plegada, blank deselect). ~6 tests / ~20 expects.
  - `zoom.test.ts`: 1+ test por modificador (Ctrl+wheel zoom, Ctrl+0 fit). ~3 tests / ~10 expects.
  - `rubberBand.test.ts`: 1+ test por intersección (vacío, 1 entidad, 2+ entidades, cancela con Esc). ~4 tests / ~15 expects.
  - `drag.test.ts`: 1+ test por escenario (drag normal, drag dentro de contorno, dblclick parte plegada). ~4 tests / ~15 expects.
  - `hoverOpl.test.ts`: 1+ test por mouseover/mouseout. ~3 tests / ~10 expects.
  - `toolsEnlace.test.ts`: 1+ test por instalación/desinstalación. ~3 tests / ~10 expects.
  - `helpers.test.ts`: 1+ test por helper público no trivial. ~5 tests / ~15 expects.
- **Total esperado**: ~28 tests aditivos / ~95 expects nuevos.

Para tests de handlers se necesita un mock de `dia.Paper` y `dia.Graph`. Si JointJS no es trivial de mockear, se permite tests de integración que monten el paper real en jsdom/happy-dom (igual que `proyeccion.test.ts`).

## 8. Verificación

```bash
cd app
bun run typecheck
bun run test src/render/jointjs/
bun run test src/                          # suite completa, sin reescribir
bun run check                              # typecheck + tests
bun run browser:smoke                      # Playwright Chromium 40/40
bun run build                              # bundle vite, chunk principal sin regresión
```

Detector: L2 no toca `progress-dashboard.mjs` directamente. L_scaffolding declara reglas tolerantes para `handlers/*`.

## 9. Decisiones bloqueadas (no reabrir)

- **API pública del componente `<JointCanvas />`**: sin props, sin children, igual a hoy.
- **Comportamiento observable de eventos**: Ctrl/Cmd+clic, Shift+drag rubber band, dblclick parte plegada, hover OPL — exactamente igual a hoy. Cualquier cambio se rechaza.
- **`data-testid="canvas-jointjs"` y data-testid relacionados**: preservados.
- **Smokes Playwright**: 40/40 verde sin tocar el spec (excepto smokes nuevos aditivos).
- **Composers L2 ronda 8** son lectura; cualquier cambio se rechaza.
- **Registry de atajos `atajosTeclado.ts`** (decisión ronda 7): no se reabre; el paper consume sus eventos vía dia.Paper, no vía registry global.
- **No introducir context Preact nuevo**. El store global vía `useOpmStore`/`store` es suficiente.

## 10. Decisiones que tomas vos (documentar en commit)

- **Granularidad de handlers**: si `pan.ts` o `teclado.ts` no aplican (no hay pan independiente del rubber band, no hay teclas del paper), **omitir** y declararlo en commit. Si emerge un handler nuevo (ej. `hoverEntidad.ts` para tooltips), declararlo y crearlo.
- **Helpers en `helpers.ts` vs locales**: igual que L1, decidir caso por caso. Si un helper se usa en 1 solo archivo, queda local. Si se usa en 2+, va a `helpers.ts`.
- **Si emergen hooks Preact** (ej. `useProyectarModelo`, `useModoEnlace`): crearlos en `app/src/render/jointjs/hooks/` o dejarlos en el componente. Ambas son válidas; recomendado dejarlos en el componente si son ≤ 30 LOC cada uno.
- **Tipos de `CablearArgs`**: si todos los handlers reciben el mismo objeto `{ adapter, store }`, declararlo una vez en `helpers.ts` y exportar; si la firma varía por handler, declarar localmente.
- **Cleanup compose**: el patrón `cleanups.forEach(fn => fn())` o `Promise.all(cleanups.map(fn => fn()))` o helper `composeCleanup(...fns)`. Cualquiera es válido; el primero es lo más simple.
- **Tests con paper real vs mock**: si los tests aditivos requieren `JointAdapter` real, montarlo igual que `proyeccion.test.ts`. Si se opta por mock, declarar en commit por qué (más rápidos, más aislados).

## 11. Forma del entregable

Commit sugerido:

```
refactor(render): extrae handlers JointCanvas por familia

- 8 sub-archivos en handlers/{seleccion,zoom,pan,rubberBand,teclado,drag,hoverOpl,toolsEnlace,helpers}.ts
  (omitir pan/teclado si no aplican; ~6-8 archivos finales)
- JointCanvas.tsx reducido a orquestador < 200 LOC
- proyeccion.ts y composers/ intactos
- proyeccion.test.ts intacto (820 LOC)
- smokes 40/40 verde
- tests aditivos por handler ~28 tests / ~95 expects

Refs: opm-extracted/src/app/configuration/rappidEnviromentFunctionality/selectionConfiguration.ts:5-65

Co-Authored-By: <implementador-externo> <noreply@...>
```

**Reporte de cierre obligatorio**:

- Hash final del último commit en main.
- LOC final de `JointCanvas.tsx` + cada `handlers/*.ts`.
- Output de `bun run check` (último tail).
- Output de `bun run browser:smoke` (40/40 esperado).
- Output de `wc -l app/src/render/jointjs/JointCanvas.tsx app/src/render/jointjs/handlers/*.ts`.
- Lista de tests aditivos creados + conteo.
- Decisiones declaradas (de §10).
- Confirmación de archivos no tocados: `proyeccion.ts`, `composers/*`, `proyeccion.test.ts`, `customShapes.ts`, `mapaSistema.ts`, `abanicoOverlay.ts`, `JointAdapter.ts`, `linkAssets.ts`.

**Qué NO tocar**:

- `docs/HANDOFF.md`, `docs/historias-usuario-v2/`, `docs/JOYAS.md`, `docs/instrucciones-lineas-dev/ronda1..8/`.
- `app/src/render/jointjs/proyeccion.ts`, `composers/*`, `proyeccionTipos.ts`, `customShapes.ts`, `mapaSistema.ts`, `mapaExport.ts`, `abanicoOverlay.ts`, `abanicoDragSync.ts`, `JointAdapter.ts`, `linkAssets.ts`, `agregacionBus.ts`, `autoinvocacionLoop.ts`, `estadoTargets.ts`, `plegadoNesting.ts`, `rutaLabels.ts`, `proyeccion.test.ts`.
- `app/src/store/*`, `app/src/modelo/*`, `app/src/serializacion/*`, `app/src/opl/*`, `app/src/ui/*`, `app/src/persistencia/*`, `app/src/canvas/*`.
- `app/scripts/in-vivo-test.mjs`, `home/`.
