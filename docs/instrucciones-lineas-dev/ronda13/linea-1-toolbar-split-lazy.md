# Línea 1 — Split Toolbar.tsx por modo del editor + lazy split adicional

## 1. Misión

Refactorizar `app/src/ui/Toolbar.tsx` (1098 LOC) a **orquestador delgado (~80 LOC)** + 5 archivos hijos en `app/src/ui/toolbar/` que reflejen los **modos del editor** (no bandas visuales). Combina T2.1 opción B + T2.6 (lazy split adicional) según auditoría steipete. Reducir chunk principal de 219.20 kB → ≤ 195 kB.

**Enmienda IFML absorbida** desde `docs/auditorias/2026-05-07-auditoria-ifml.md`: L1 también corrige H-2 (Actions opacas en lambdas inline), H-5/H-12 (atajos duplicados o fuera de catálogo central) y H-10 (disponibilidad incoherente entre selector de enlace y botón "Tipos válidos"). No abre H-1/H-3/H-4 (modal-stack y CustomEvents) porque son ronda 13.1.

5 modos del editor mapeados desde `store/runtime.ts` y `store/seleccion.ts`:

- **`ToolbarBase.tsx`** — chrome estable: encabezado (menú hamburguesa + título + autosave) + drag tipos + undo/redo + CRUD modelo (Nuevo/Demo/Cargar/Guardar). Siempre visible.
- **`ToolbarSeleccion.tsx`** — banda contextual cuando `seleccionPrincipal` es 1 entidad o enlace: editor estilo + alias/desc + acciones específicas. Slot opcional para invocar `BarraHerramientasElemento` (L4).
- **`ToolbarMultiseleccion.tsx`** — cuando `seleccion.length >= 2`: alinear/distribuir/agregar al todo + multi-al-todo + traer enlaces entre.
- **`ToolbarCreacion.tsx`** — cuando `modoEnlace !== null` o `modoCreacion !== null`: indicador modo activo + cancelar + tipos válidos.
- **`ToolbarMapaSistema.tsx`** — cuando `vistaMapaActiva === true`: refrescar/auto-refresh/estadísticas/grid mapa.

`Toolbar.tsx` queda como **orquestador**: lee state de store, decide qué subcomponentes montar y los compone con suspense para los lazy. Cero estado local propio salvo el `<Suspense>` wrapper.

T2.6 lazy splits adicionales en `App.tsx`:

- `MapaSistema.tsx` (370 LOC) → lazy con `vistaMapaActiva`.
- `Timeline.tsx` (385 LOC) → lazy con OPD inzoomed.
- `TablaEnlaces.tsx` (349 LOC) → lazy con `tablaEnlacesAbierta`.
- `GestionArbolOpd.tsx` (371 LOC) → lazy con `gestionArbolAbierta`.

Slice mínimo entregable: 6 commits atómicos (1 por archivo nuevo + 1 refactor Toolbar.tsx + 1 lazy splits App.tsx) con loop verde tras cada uno. **Cero cambios funcionales**: `data-testid` preservados, comportamiento idéntico, smokes existentes pasan sin tocar.

**Fuera de slice**:

- **No tocar `tokens.ts`** (territorio L2 — los 5 nuevos archivos toolbar/ importan tokens existentes).
- **No introducir spacing/radii/shadows/typography** (territorio L2).
- **No tocar `BarraHerramientasElemento.tsx`** (L4 lo crea); solo dejar slot opcional en `ToolbarSeleccion.tsx`.
- **No tocar Inspector secciones** (L4 podría leer InspectorEntidad).
- **No tocar checkers** (L3).
- **No tocar render JointJS** (cero cambios canvas).
- **No consolidar duplicación Objeto/Objeto-sticky** (decisión vigente desde rondas previas; se preserva en `ToolbarBase.tsx`).
- **No optimizar más allá de los 4 lazy candidatos identificados**.
- **No implementar modal-stack ni reemplazar `window.dispatchEvent`** (IFML H-1/H-3/H-4 quedan para ronda 13.1).

## 2. HU base

| HU | Estado actual | Aporte L1 |
|---|---|---|
| **Sin HU directa** | refactor estructural autorizado por brief steipete §T2.1 + §T2.6 | Toolbar orquestador + 5 archivos por modo + lazy splits. NO cierra HU del backlog (es deuda técnica). |

L1 NO cierra HU directas. Es **refactor estructural derivado de auditoría steipete**. La métrica de éxito es:
- Toolbar.tsx ≤ 100 LOC.
- 5 archivos en `app/src/ui/toolbar/` con cohesión por modo del editor.
- Chunk principal ≤ 195 kB (-24.2 kB vs 219.20 baseline).
- Tests existentes intactos; smokes existentes pasan.

## 3. Anclaje a evidencia

**Nivel 1 — SSOT (citas opcionales)**:

- `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/06-PROVENANCE.md §2`: política operativa.
- `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/00-METODOLOGIA.md §6`: jerarquía SSOT.

**Nivel 2 — `app/src/modelo/tipos.ts`**: ronda 13 NO modifica tipos kernel desde L1.

**Nivel 3 — respaldo técnico**:

- **`docs/auditorias/2026-05-07-refactor-radical-steipete.md` §T2.1 opción B + §T2.6**: contrato técnico L1.
- **`docs/auditorias/2026-05-07-auditoria-ifml.md` §8 H-2/H-5/H-10/H-12**: contrato secundario de interacción L1 (Actions nombradas, Event→Action único por contexto, disponibilidad coherente).
- **`docs/JOYAS.md`**: paleta + dimensiones (L1 los 5 archivos toolbar/ importan tokens.colors existentes).
- **`opm-extracted/src/app/modules/layout/{header,rappid-toolbar,element-tool-bar,navigator,opl-container,main}/`**: referencia semántica del modelo de modos del editor (NO copia 1:1 — Angular con Material).
- **Estado actual del código (verificado)**:
  - `app/src/ui/Toolbar.tsx`: 1098 LOC actuales.
  - `app/src/store/runtime.ts`: contiene `modoEnlace`, `modoCreacion`, `vistaMapaActiva` (verificar exact names).
  - `app/src/store/seleccion.ts`: contiene `seleccion` array + helpers.
  - `app/src/ui/MapaSistema.tsx`: 370 LOC, monta condicional a `vistaMapaActiva`.
  - `app/src/ui/Timeline.tsx`: 385 LOC.
  - `app/src/ui/TablaEnlaces.tsx`: 349 LOC.
  - `app/src/ui/GestionArbolOpd.tsx`: 371 LOC.
  - `app/src/ui/App.tsx`: ya usa `lazy()` con `<Suspense>` (patrón consolidado líneas 17-26 ronda 12).

## 4. Archivos permitidos

```text
app/src/ui/Toolbar.tsx                                  REFACTOR (1098 LOC → ~80 LOC orquestador; mantiene export `Toolbar`)
app/src/ui/toolbar/ToolbarBase.tsx                      NUEVO (~250 LOC: chrome estable)
app/src/ui/toolbar/ToolbarSeleccion.tsx                 NUEVO (~250 LOC: contextual 1 selección + slot BarraHerramientasElemento)
app/src/ui/toolbar/ToolbarMultiseleccion.tsx            NUEVO (~150 LOC: alinear/distribuir/multi-al-todo)
app/src/ui/toolbar/ToolbarCreacion.tsx                  NUEVO (~150 LOC: modo enlace/creación)
app/src/ui/toolbar/ToolbarMapaSistema.tsx               NUEVO (~150 LOC: refrescar/grid/estadísticas mapa)
app/src/ui/toolbar/toolbarStyles.ts                     NUEVO opcional (~50 LOC: estilos compartidos si emerge duplicación)
app/src/ui/App.tsx                                      EDIT aditivo (lazy MapaSistema + Timeline + TablaEnlaces + GestionArbolOpd)
app/src/ui/MapaSistema.tsx                              LECTURA (verificar export pattern para lazy)
app/src/ui/Timeline.tsx                                 LECTURA
app/src/ui/TablaEnlaces.tsx                             LECTURA
app/src/ui/GestionArbolOpd.tsx                          LECTURA
app/src/store/runtime.ts                                LECTURA (modoEnlace, modoCreacion, vistaMapaActiva)
app/src/store/seleccion.ts                              LECTURA (seleccion, seleccionPrincipal)
app/src/store/tipos.ts                                  LECTURA (OpmStore interface)
app/src/ui/atajosTeclado.ts                             EDIT aditivo restringido (solo si al migrar Toolbar se centralizan Ctrl+H/Ctrl+Alt+C/V/T; NO rediseñar catálogo)
app/src/ui/tokens.ts                                    LECTURA (importar tokens.colors en los 5 nuevos archivos)
app/e2e/02-canvas-y-render.spec.ts                      EDIT aditivo (1-2 smokes split toolbar)
app/e2e/06-undo-redo-dirty.spec.ts                      EDIT aditivo (1 smoke verificación toolbar después de refactor)
opm-extracted/**                                        LECTURA
docs/HANDOFF.md                                         LECTURA
docs/auditorias/2026-05-07-refactor-radical-steipete.md LECTURA
docs/JOYAS.md                                           LECTURA
assets/svg/**                                           LECTURA
```

Cualquier otro archivo es **fuera de scope**.

## 5. Restricciones de no-colisión

- **No tocar `tokens.ts`** (territorio L2). Los 5 nuevos archivos importan `tokens.colors`/`tokens.spacing` desde `../tokens` (post-L2 los tokens secundarios están disponibles).
- **No tocar Inspector secciones** (`SeccionAlias/Atributo/Descripcion/Designaciones/Duracion/EsenciaAfiliacion/Imagen/LayoutEstados/Refinamiento/Tamano/Urls`).
- **No tocar `MenuContextual{Entidad,Enlace,Arbol}.tsx`**.
- **No tocar `Dialogo*.tsx`, `Modal*.tsx`** (territorio L2 migración tokens).
- **No tocar `MenuPrincipal.tsx`, `PantallaInicio.tsx`, `ArbolOpd.tsx`, `BibliotecaCosa.tsx`, `arbol/NodoOpd.tsx`, `panelOpl/*.tsx`** (territorio L2).
- **No tocar `BarraHerramientasElemento.tsx`** (L4 lo crea). En `ToolbarSeleccion.tsx` puede dejar un comentario `// L4 podrá invocar BarraHerramientasElemento aquí o como overlay separado` o un slot vacío `{slotBarraFlotante ?? null}` opcional.
- **No tocar `app/src/modelo/checkers.ts` ni `tipos/avisos.ts` ni `PanelMetodologia.tsx`** (territorio L3).
- **No tocar `app/src/render/jointjs/**`**: cero cambios canvas.
- **No tocar `acciones-canvas.ts`, `acciones-ui.ts`, `acciones-entidad.ts`, `store/persistencia.ts`** salvo lectura para entender qué acción invoca cada botón del Toolbar.
- **No crear nuevas acciones de store** para resolver IFML H-2. En esta línea, "Action nombrada" significa handler local nombrado o Action existente del store. Si hace falta una Action de slice nueva, entregar patch a `/tmp` y reportar.
- **No tocar generadores OPL** ni serializadores.
- **No tocar `progress-dashboard.mjs`**: consolidación operador.
- **`App.tsx` en zona compartida con L3 y L4**: L1 modifica imports (lazy) y rendering principal; L3 monta `PanelMetodologia` en una zona del layout; L4 monta `BarraHerramientasElemento` overlay. Hunks disjuntos. **Coordinación de orden**: L1 → L4 → L3.

## 6. Slice mínimo shippeable

### 6.1 Refactor Toolbar.tsx → orquestador

```typescript
// app/src/ui/Toolbar.tsx (orquestador delgado, ~80 LOC)
import { Suspense } from "preact/compat";
import { useOpmStore } from "../store/runtime";
import { ToolbarBase } from "./toolbar/ToolbarBase";
import { ToolbarSeleccion } from "./toolbar/ToolbarSeleccion";
import { ToolbarMultiseleccion } from "./toolbar/ToolbarMultiseleccion";
import { ToolbarCreacion } from "./toolbar/ToolbarCreacion";
import { ToolbarMapaSistema } from "./toolbar/ToolbarMapaSistema";

export function Toolbar() {
  const seleccion = useOpmStore((s) => s.seleccion);
  const modoEnlace = useOpmStore((s) => s.modoEnlace);
  const modoCreacion = useOpmStore((s) => s.modoCreacion);
  const vistaMapaActiva = useOpmStore((s) => s.vistaMapaActiva);

  const enModoCreacion = modoEnlace !== null || modoCreacion !== null;
  const cantidadSeleccion = seleccion.length;

  return (
    <div data-testid="toolbar-root" style={/* contenedor mínimo */}>
      <ToolbarBase />
      {vistaMapaActiva && <ToolbarMapaSistema />}
      {enModoCreacion && <ToolbarCreacion />}
      {cantidadSeleccion === 1 && <ToolbarSeleccion />}
      {cantidadSeleccion >= 2 && <ToolbarMultiseleccion />}
    </div>
  );
}
```

### 6.2 Lazy splits en App.tsx

```typescript
// app/src/ui/App.tsx (extensión aditiva del patrón existente)
const MapaSistema = lazy(() => import("./MapaSistema").then((m) => ({ default: m.MapaSistema })));
const Timeline = lazy(() => import("./Timeline").then((m) => ({ default: m.Timeline })));
const TablaEnlaces = lazy(() => import("./TablaEnlaces").then((m) => ({ default: m.TablaEnlaces })));
const GestionArbolOpd = lazy(() => import("./GestionArbolOpd").then((m) => ({ default: m.GestionArbolOpd })));

// En el rendering, cada uno envuelto en <Suspense fallback={null}>
{vistaMapaActiva && <Suspense fallback={null}><MapaSistema /></Suspense>}
// idem Timeline, TablaEnlaces, GestionArbolOpd según su flag
```

### 6.3 Distribución de contenido por archivo (mecánica)

Mover las secciones JSX de Toolbar.tsx a los 5 archivos correspondientes según su modo:

- **ToolbarBase**: menú hamburguesa, título, badges (autosave, dirty, readOnly), undo/redo, Nuevo/Demo/Cargar/Guardar, drag tipos (Objeto/Proceso), modo creación sticky toggle.
- **ToolbarSeleccion**: estilo enlace, alias toggle, descripción toggle, image edit (solo objeto), grid config, acciones específicas a la cosa seleccionada.
- **ToolbarMultiseleccion**: alinear (horizontal/vertical), distribuir (horizontal/vertical), eliminar selección, conectar multi al todo, traer enlaces entre seleccionadas.
- **ToolbarCreacion**: indicador modo sticky activo, cancelar creación, selector tipo enlace, tipos válidos, biblioteca cosa.
- **ToolbarMapaSistema**: refrescar mapa, auto-refresh toggle, estadísticas mapa, grid mapa.

Cada archivo mantiene **idéntico comportamiento** que el código original (cero refactor de lógica; solo movimiento + decompositioning).

### 6.4 Contrato IFML de L1

- Cada botón con efecto material debe invocar una Action existente del store o un handler local nombrado (`handleCrearEnlaceDesdeMenuTipos`, `handleOcultarApariencia`, etc.). Evitar lambdas inline que combinen varias acciones sin nombre.
- El `useEffect` ad-hoc de atajos en Toolbar debe desaparecer o reducirse a cero. Los atajos de edición contextual (`Ctrl+H`, `Ctrl+Alt+C/V/T`) se registran en `atajosTeclado.ts` si el patrón central ya lo permite.
- `Ctrl+S`, `Ctrl+Z`, `Ctrl+Y` y `Ctrl+Shift+Z` no deben quedar duplicados entre App y Toolbar.
- `selectorEnlaceDeshabilitado` gobierna tanto el selector de tipo de enlace como el botón "Tipos válidos".
- No introducir `window.dispatchEvent` nuevo.

### 6.5 Tokens (lectura desde L2)

Cada archivo importa `import { tokens } from "../tokens"` y usa `tokens.colors.acentoUi`, `tokens.spacing.gap8`, etc. **L2 los crea**; L1 los consume. Si un valor no está en tokens al momento de L1, dejar comentario `// TODO L2 token` y usar literal temporal (que L2 migrará).

## 7. Tests obligatorios

**Unit tests**: 0 nuevos significativos. El refactor es movimiento + decomposición sin cambio funcional.

**Smoke browser** (`app/e2e/0X-*.spec.ts`), 2-3 nuevos:

- `02-canvas-y-render.spec.ts`: smoke verifica que `[data-testid="toolbar-root"]` monta correctamente y los sub-componentes se montan según modo (1 selección, 2+ selección, modo enlace, vista mapa).
- `06-undo-redo-dirty.spec.ts`: smoke verifica que los botones Deshacer/Rehacer (ahora en ToolbarBase) siguen funcionando.

Verificar especialmente que **todos los `data-testid` previos se preservan** en los archivos hijos (búsqueda con grep antes y después; cero pérdidas).

## 8. Verificación

```bash
cd app
bun run check          # 675 → 675 (sin tests funcionales nuevos significativos)
bun run browser:smoke  # 93 → ~96 (con +3 smokes nuevos L1)
bun run build          # main chunk 219.20 → ≤ 195 kB; lazy chunks nuevos para MapaSistema/Timeline/TablaEnlaces/GestionArbolOpd
```

Verificar:

- `wc -l app/src/ui/Toolbar.tsx` ≤ 100.
- `wc -l app/src/ui/toolbar/*.tsx` cada uno ≤ 300.
- Build genera chunks lazy nuevos: `MapaSistema-*.js`, `Timeline-*.js`, `TablaEnlaces-*.js`, `GestionArbolOpd-*.js`.
- Tests existentes (`bun run check`) pasan sin tocar.

## 9. Decisiones bloqueadas (no reabrir)

- **Opción B steipete**: descomponer por modo del editor, no por bandas visuales. **NO ejecutar opción A** (BarraEncabezado/BarraTipos/BarraContextual hermanos) — descartada explícitamente por steipete porque BarraContextual seguiría siendo monolito ~600 LOC.
- **NO ejecutar opción C** (slot dinámico con IntersectionObserver) — descartada por exceso de complejidad y accesibilidad pobre.
- **NO consolidar duplicación Objeto/Objeto-sticky en Toolbar** — decisión vigente desde rondas previas (se preserva tal cual en `ToolbarBase.tsx`).
- **Toolbar.tsx mantiene su export `Toolbar`** — los consumidores (`App.tsx`) no cambian.
- **NO migrar literales en los 5 nuevos archivos toolbar/** salvo importar `tokens.colors` desde L2; el resto es responsabilidad L2.
- **NO resolver IFML H-1/H-3/H-4**: modal-stack y CustomEvents son ronda 13.1. L1 solo evita añadir nuevos CustomEvents y nombra Actions/atajos dentro del scope Toolbar.

## 10. Decisiones que tomas vos (documentar en commit)

- **Discriminante exacto del modo del editor**: el slice §6.1 propone `modoEnlace !== null || modoCreacion !== null` para `ToolbarCreacion`. Si el store expone un único `modoEditor: "base" | "creacion" | "seleccion" | ...`, usarlo. Si requiere helper compute, agregarlo en el orquestador (no en store).
- **Distribución exacta de botones entre los 5 archivos**: el slice §6.3 propone una asignación; ajustar si emergen ambigüedades (ej. "Cargar Demo" puede ir en ToolbarBase o en ToolbarCreacion). Documentar tabla final en commit.
- **`toolbarStyles.ts`**: opcional. Si los 5 archivos comparten más de ~3 estilos, extraer; si no, mantener inline.
- **Botón "···" → BarraHerramientasElemento (L4)**: dejar slot opcional `{slotBarraFlotante ?? null}` en `ToolbarSeleccion.tsx`. L4 decide si lo invoca aquí o como overlay separado.
- **Lazy chunks naming**: respetar el patrón consolidado de App.tsx (`MapaSistema-*.js` style).
- **Si algún archivo crece > 300 LOC**: re-particionar (ej. ToolbarSeleccion en `ToolbarSeleccionEntidad` y `ToolbarSeleccionEnlace`). Documentar.
- **Resolución IFML H-2/H-5/H-10/H-12**: documentar tabla corta `Event → Action nombrada → archivo` y qué atajos quedaron en catálogo central.

## 11. Forma del entregable

Al cierre de L1, declarar:

- Hash final del último commit en main.
- LOC delta por archivo (`git diff --stat HEAD~6 HEAD` aprox 6 commits).
- Output de `bun run check`, `bun run browser:smoke`, `bun run build` (último tail con tabla de chunks).
- Lista de commits creados en orden + rationale por uno.
- Decisiones declaradas (§10).
- Mapa IFML L1: ViewContainer (`Toolbar*`), Events tocados, Actions nombradas y atajos centralizados.
- LOC final de cada archivo (`wc -l app/src/ui/Toolbar.tsx app/src/ui/toolbar/*.tsx`).
- Tabla de distribución de botones por archivo.
- Confirmación que **todos los `data-testid` previos se preservan** (grep antes/después).
- Bundle delta (chunk principal antes/después + chunks lazy nuevos).
- Confirmación archivos no tocados (de §5).

Commits sugeridos (orden):

1. `refactor(toolbar): extrae ToolbarBase con chrome estable (T2.1 steipete opción B)`
2. `refactor(toolbar): extrae ToolbarMapaSistema condicional a vistaMapaActiva`
3. `refactor(toolbar): extrae ToolbarCreacion para modoEnlace/modoCreacion`
4. `refactor(toolbar): extrae ToolbarSeleccion con slot opcional para L4 BarraHerramientasElemento`
5. `refactor(toolbar): extrae ToolbarMultiseleccion para selección ≥2`
6. `refactor(toolbar): Toolbar.tsx orquestador delgado (~80 LOC)`
7. `chore(build): lazy MapaSistema + Timeline + TablaEnlaces + GestionArbolOpd (T2.6 steipete; -25 kB chunk principal estimado)`
8. `test(e2e): smokes split Toolbar por modo del editor`

Cada commit debe dejar la rama verde. Co-author si aplica.

Si dudás de un caso límite: detente y reporta al operador antes de actuar.
