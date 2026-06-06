# Mobile Solo-Lectura v1 - Spec alternativa steipete/cat/JointJS

**Estado**: propuesta alternativa implementable
**Fecha**: 2026-06-06
**Autoría**: Codex con lentes `steipete`, `cat-thinking`, `jointjs-open-source`
**Alcance**: reemplazar el chrome mobile actual por un lector OPM real, sin mutaciones de modelo desde mobile.

## 0. Decisiones no negociables

Esta spec asume como cerradas las tres decisiones del operador:

1. El tab **Acerca** reemplaza **Sugerencias** en bottom nav mobile.
2. El deep link usa path: `/m/<modeloId>/opd/<opdId>/vista/<vista>`.
3. La búsqueda incluye el toggle **Buscar también en diagnóstico**, off por default y persistido en `localStorage`.

No se reabre ninguna de esas decisiones. El trabajo aquí es aterrizarlas sin romper producción.

## 1. Lectura categorial

### 1.1 Diagnóstico estructural

El mobile actual mezcla dos categorías:

- `WorkbenchCompleto`: estados, navegación, selección, edición, persistencia, inspección y validación.
- `LectorMobile`: navegación, inspección, búsqueda y share/deep-link.

La migración correcta no es un "responsive skin". Es un **funtor de olvido controlado**:

```text
F_read : WorkbenchCompleto -> LectorMobile
```

Preserva:

- identidad del modelo,
- `opdActivoId`,
- árbol OPD,
- proyección visual OPD,
- OPL generado,
- selección consultiva de entidad/enlace/estado,
- metadatos de persistencia ya presentes.

Olvida:

- creación de entidades,
- creación de enlaces,
- movimiento/redimensión,
- edición de inspector,
- mutaciones OPL reverse,
- halos/handles/herramientas JointJS,
- acciones pesadas de toolbar y persistencia.

**URN aplicada**: `urn:fxsl:kb:icas-preservacion`. La ley relevante es que la traducción debe preservar identidad y composición; si un gesto de lectura seguido de otro gesto de lectura produce una mutación OPM, el funtor no preservó el contrato.

### 1.2 Lentes de UI

Cada view model mobile se modela como lente:

```text
get : OpmStore -> MobileViewState
put : (OpmStore, MobileUiAction) -> OpmStore
```

La restricción: `put` sólo puede cambiar estado UI/navegación permitido. No puede cambiar `modelo`, `undoStack`, enlaces, apariencias, estados OPM ni payload persistido.

**URN aplicada**: `urn:fxsl:kb:icas-interaccion`. Redux/store como lente: posiciones = render observable, direcciones = acciones disponibles. En mobile lectura, las direcciones de escritura se sustraen del polinomio.

### 1.3 Efectos explícitos

Los únicos efectos permitidos en mobile lectura:

- leer backend existente,
- cambiar URL con History API,
- guardar preferencia local del toggle de diagnóstico,
- abrir/cerrar overlays consultivos,
- registrar métricas/audit.

Quedan prohibidos:

- autosave por gesto mobile,
- `commitModelo`,
- operaciones del kernel,
- reverse OPL,
- creación de versiones,
- eliminación/renombre/movimiento.

**URN aplicada**: `urn:fxsl:kb:icas-efectos`. Los efectos deben estar visibles y componibles; un efecto de escritura escondido en un handler JointJS es bug de arquitectura.

## 2. Fuentes JointJS OSS consultadas

Se consultó documentación oficial viva de JointJS:

- `dia.Paper`: `interactive`, eventos `pointer*`, `pan`, `pinch`, `cellViewNamespace`, `cellVisibility`.
  https://docs.jointjs.com/api/dia/Paper/
- `dia.CellView.preventDefaultInteraction(event)`: previene la interacción default de movimiento/link/label pero mantiene eventos.
  https://docs.jointjs.com/api/dia/CellView/
- Eventos de paper/cellView: listeners centralizados sobre `paper`.
  https://docs.jointjs.com/4.1/learn/features/diagram-basics/events/
- Shape tools/link tools: las herramientas son vistas interactivas montadas sobre cell/link views.
  https://docs.jointjs.com/learn/features/shape-tools/

Inferencia técnica: en este repo no se debe introducir `PaperScroller` ni dependencias `joint.ui.*`; el proyecto usa JointJS OSS core y pan/scroll DOM propio. El readonly debe implementarse con `paper.options.interactive`, gating de handlers locales y no-montaje de tools.

## 3. Blast radius

**Estimación**: medio-alto. Reversible por feature flag de build y cambios aislados, pero toca UI shell, store UI, puertos, JointJS adapter/handlers, E2E, audit y docs.

### 3.1 Archivos nuevos

```text
app/src/ui/mobile/MobileReadonlyApp.tsx
app/src/ui/mobile/HeaderLectura.tsx
app/src/ui/mobile/BottomNavLectura.tsx
app/src/ui/mobile/DiagramaLectura.tsx
app/src/ui/mobile/OplLectura.tsx
app/src/ui/mobile/ArbolOpdsLectura.tsx
app/src/ui/mobile/AcercaLectura.tsx
app/src/ui/mobile/VistaBusquedaLectura.tsx
app/src/ui/mobile/BottomSheetLectura.tsx
app/src/ui/mobile/BottomSheetEntidadLectura.tsx
app/src/ui/mobile/BottomSheetEnlaceLectura.tsx
app/src/ui/mobile/routerMovil.ts
app/src/ui/mobile/preferenciasMovil.ts
app/src/app/viewmodels/mobileReadonlyViewModel.ts
app/src/app/viewmodels/busquedaLecturaViewModel.ts
app/src/app/viewmodels/diagramaLecturaViewModel.ts
app/src/app/ports/mobileReadonlyPort.ts
app/src/app/ports/zustandMobileReadonlyPort.ts
app/src/ui/mobile/mobileReadonly.test.tsx
app/src/app/viewmodels/busquedaLecturaViewModel.test.ts
app/src/app/viewmodels/diagramaLecturaViewModel.test.ts
```

### 3.2 Archivos modificados

```text
app/src/ui/App.tsx
app/src/ui/contextoWorkbench.ts
app/src/ui/contextoWorkbench.test.ts
app/src/ui/layoutResponsive.ts
app/src/ui/JointCanvasFeedbackBoundary.tsx
app/src/render/jointjs/JointCanvas.tsx
app/src/render/jointjs/jointCanvasAdapter.ts
app/src/render/jointjs/handlers/seleccion.ts
app/src/render/jointjs/handlers/drag.ts
app/src/render/jointjs/handlers/resize.ts
app/src/render/jointjs/handlers/rubberBand.ts
app/src/render/jointjs/handlers/modoEnlace.ts
app/src/render/jointjs/handlers/toolsEnlace.ts
app/src/render/jointjs/handlers/toolsSimboloEstructural.ts
app/src/store/tipos.ts
app/src/store/uiPanel.ts
app/e2e/22-responsive-review.spec.ts
app/scripts/in-vivo-exhaustivo.mjs
app/package.json
Dockerfile
docker-compose.yml
```

`deploy/nginx.conf` no requiere cambio para path deep links: ya tiene `location / { try_files $uri $uri/ /index.html; }`.

## 4. Contrato de producto

### 4.1 Mobile es lector

Para `breakpoint === "mobile"` y `VITE_MOBILE_READONLY === "true"`:

- no hay toolbar pesada,
- no hay chip de persistencia,
- no hay inspector editable,
- no hay halo de estado editable,
- no hay drag de cosas/estados,
- no hay resize,
- no hay creación de enlaces,
- no hay edición OPL,
- sí hay navegación OPD,
- sí hay pan/zoom/fit,
- sí hay bottom sheets consultivos,
- sí hay búsqueda,
- sí hay deep link.

Para `VITE_MOBILE_READONLY !== "true"`:

- se conserva el mobile actual como fallback temporal.

**Rollback honesto**: `VITE_MOBILE_READONLY` es flag de build Vite. Desactivar en producción requiere rebuild/redeploy o rollback de imagen. No es kill switch runtime.

### 4.2 Desktop/tablet

Desktop y tablet no cambian su chrome funcional. Si abren `/m/...`, la app no redirige: carga el workspace normal y conserva la URL. El path sólo se interpreta en mobile readonly.

## 5. Contexto Workbench

### 5.1 Tipos

```ts
export type ContextModoWorkbench = "edicion" | "mapa" | "simulacion" | "lectura";

export interface ResolverModoWorkbenchInput {
  vistaMapaActiva: boolean;
  modoSimulacionActivo: boolean;
  modoEnlaceActivo?: boolean;
  modoCreacionActivo?: boolean;
  modoSoloLectura?: boolean;
}
```

### 5.2 Precedencia

La precedencia debe ser explícita:

```ts
export function resolverContextModoWorkbench(input: ResolverModoWorkbenchInput): ContextModoWorkbench {
  if (input.modoSoloLectura) return "lectura";
  if (input.modoSimulacionActivo) return "simulacion";
  if (input.vistaMapaActiva) return "mapa";
  return "edicion";
}
```

Razón: mobile lector no debe exponer simulación/mapa como modos top-level heredados si el nuevo chrome no los modela. Si más adelante se quiere simulación mobile, debe entrar como vista consultiva explícita, no por filtración de flags desktop.

### 5.3 Helper responsive

```ts
export function esMobileLectura(bp: BreakpointOpm, flag: boolean): boolean {
  return bp === "mobile" && flag;
}
```

No esconder esta decisión dentro de `App.tsx`; debe ser testeable.

## 6. Arquitectura UI

### 6.1 Composición raíz

`App.tsx`:

```tsx
const mobileReadonlyEnabled = import.meta.env.VITE_MOBILE_READONLY === "true";
const modoSoloLectura = esMobileLectura(breakpoint, mobileReadonlyEnabled);
const contextoWorkbench = resolverContextoWorkbench({
  breakpoint,
  vistaMapaActiva,
  modoSimulacionActivo,
  modoEnlaceActivo,
  modoCreacionActivo,
  modoSoloLectura,
});

if (modoSoloLectura) {
  return (
    <MobileReadonlyApp
      contexto={contextoWorkbench}
      onAdapterChange={setCanvasAdapter}
    />
  );
}
```

`MobileReadonlyApp` monta un shell separado. No debe renderizar el chrome desktop y esconderlo por CSS.

### 6.2 Vistas

```ts
export type MobileVistaLectura = "diagrama" | "opds" | "opl" | "acerca";
```

Tabs:

- Diagrama,
- OPDs,
- OPL,
- Acerca.

`Acerca` muestra:

- nombre del modelo,
- descripción,
- `actualizadoEn` o `ultimaApertura` si está disponible,
- `revision` si el modelo viene de backend,
- URL profunda copiable,
- CTA "Continuar en escritorio".

No crear `syncApi.ts` en v1. Usar metadatos existentes del backend/workspace. Si falta timestamp, mostrar "Sin fecha de sincronización disponible".

## 7. Contrato JointJS readonly

### 7.1 Propagación de props

```ts
interface JointCanvasFeedbackBoundaryProps {
  onAdapterChange?: (adapter: JointCanvasAdapter | null) => void;
  readonlyMode?: boolean;
}

interface JointCanvasProps {
  readonlyMode?: boolean;
  onAdapterChange?: (adapter: JointCanvasAdapter | null) => void;
  feedbackPort: Pick<FeedbackPort, "sincronizarBadgesDesdeAvisos">;
  feedbackOverlays: readonly FeedbackOverlay[];
  renderMenuTipoEnlace: (props: CanvasMenuTipoEnlaceSlotProps) => ComponentChildren;
  renderRenombradoInline: (props: CanvasRenombradoInlineSlotProps) => ComponentChildren;
}

interface CrearJointCanvasAdapterArgs {
  host: HTMLElement;
  gridConfig: GridConfig;
  enlaceSeleccionIdRef: RefActual<string | null>;
  modoEnlaceRef: RefActual<ModoEnlace | null>;
  modoCreacionRef: RefActual<TipoEntidad | null>;
  readonlyModeRef: RefActual<boolean>;
}
```

### 7.2 `paper.options.interactive`

En readonly:

```ts
interactive(cellView) {
  if (readonlyModeRef.current) {
    return {
      elementMove: false,
      addLinkFromMagnet: false,
      linkMove: false,
      labelMove: false,
      arrowheadMove: false,
      vertexAdd: false,
      vertexMove: false,
      vertexRemove: false,
      useLinkTools: false,
    };
  }
  // comportamiento actual
}
```

Esto se apoya en la API oficial `dia.Paper.interactive`: permite boolean, objeto o función; `elementMove`, `labelMove`, `vertexMove`, `useLinkTools` son claves reconocidas por JointJS.

### 7.3 Handlers locales

Readonly no se logra sólo con `interactive`. Los handlers locales también mutan store.

Matriz:

| Handler | Mobile readonly | Razón |
|---|---|---|
| `cablearSeleccion` | parcial | permitir tap entidad/enlace/blank; bloquear doble click que cambia OPD si no es navegación explícita |
| `cablearRubberBand` | off | selección múltiple es gesto de edición |
| `cablearDrag` | off para movimiento/estado/vertices | muta apariencias, estados o vertices |
| `cablearResize` | off | muta tamaño |
| `cablearModoEnlace` | off | crea enlaces |
| `instalarHerramientasEnlaceSeleccionado` | off | tools editan vertices/labels |
| `instalarHerramientasSimboloEstructuralSeleccionado` | off | edita anclajes |
| `aplicarHoverOpl` | on | feedback consultivo |
| `aplicarFeedbackModoEnlace` | off | modo enlace no existe |
| fit/scroll compensation | on | lectura/navegación |

### 7.4 `preventDefaultInteraction`

En eventos que se mantienen para lectura pero podrían activar comportamiento default de JointJS, llamar `cellView.preventDefaultInteraction(evt)` cuando el target sea entidad/link/estado y `readonlyModeRef.current === true`.

Esto se apoya en la API oficial `dia.CellView.preventDefaultInteraction(event)`: evita la interacción default pero mantiene emisión de eventos. En este repo ya existe helper `prevenirInteraccionNativa`; se debe reutilizar.

### 7.5 Tools y halos

En readonly:

- no montar `HaloEstado`,
- no montar `BarraHerramientasElemento`,
- no montar renombrado inline,
- no montar `MenuTipoEnlace`,
- no instalar link tools,
- no instalar tools de símbolo estructural.

CSS sólo puede reforzar apariencia. Nunca es la barrera primaria de readonly.

### 7.6 Invariante de no-mutación

Antes y después de cada gesto mobile readonly:

```ts
exportarModelo(store.modelo) === snapshotModeloAntes
store.dirty === dirtyAntes
```

Excepción permitida: navegación de OPD, selección consultiva y estado UI mobile.

## 8. Deep links

### 8.1 Rutas válidas

```text
/m/:modeloId
/m/:modeloId/opd/:opdId
/m/:modeloId/vista/:vista
/m/:modeloId/opd/:opdId/vista/:vista
```

`vista` sólo puede ser:

```ts
type MobileVistaLectura = "diagrama" | "opds" | "opl" | "acerca";
```

`modeloId` y `opdId`:

```ts
const ID_SEGMENT_RE = /^[A-Za-z0-9._:-]{1,128}$/;
```

No usar una regex que rechace IDs reales del repo antes de auditar los IDs existentes. El router debe hacer `decodeURIComponent` seguro y rechazar segmentos vacíos.

### 8.2 Fallbacks

| Caso | Mobile readonly | Desktop/tablet |
|---|---|---|
| path no `/m/...` | workspace normal | workspace normal |
| modelo no encontrado | vista `acerca` con mensaje "Modelo no disponible" | workspace normal |
| OPD no encontrado | OPD raíz + toast "OPD no disponible" | workspace normal |
| vista inválida | `diagrama` | workspace normal |
| path malformado | `diagrama` sobre modelo actual o workspace normal si no hay modelo | workspace normal |

No redirigir automáticamente a `/`. Rompe share/debug y puede producir loops.

### 8.3 Escritura de URL

Usar `history.pushState` sólo cuando cambia vista u OPD por navegación mobile. Usar `replaceState` en normalización inicial para evitar ensuciar back stack.

## 9. Búsqueda mobile

### 9.1 Clases

```ts
export type BusquedaHitClase = "opd" | "entidad" | "enlace" | "oracion-opl" | "issue";
```

### 9.2 Toggle diagnóstico

```ts
const KEY = "deep-opm.mobile.busqueda.incluirDiagnostico";
```

Default `false`. La preferencia es de dispositivo/navegador, no de modelo. Cuando exista auth/tenants real, se puede migrar a:

```text
deep-opm.mobile.<tenantId>.<userId>.busqueda.incluirDiagnostico
```

### 9.3 Motor

No llamar "fuzzy" si se reusa `filtrarItemsCommandPalette`, porque hoy ese motor hace matching por inclusión normalizada, no scoring fuzzy. Dos opciones válidas:

1. llamarlo "búsqueda normalizada multi-sección"; o
2. implementar fuzzy real con scoring propio.

Para v1, elegir opción 1.

### 9.4 Performance

Budget:

- índice inicial sobre HODOM v1.6: `< 80ms`,
- query normalizada: `< 30ms p95`,
- toggle on: `< 50ms p95`,
- si excede: FAIL en audit mobile, no WARN.

## 10. Accesibilidad y gestos

Gestos:

| Gesto | Resultado |
|---|---|
| 1 dedo sobre vacío | pan por scroll DOM |
| 1 dedo sobre cosa | tap selecciona/abre bottom sheet, no drag |
| tap enlace | abre bottom sheet enlace |
| tap vacío | cierra bottom sheet |
| pinch | zoom si ya existe soporte; si no, botones `-`/`+`/fit en header |
| `Esc` teclado físico | cierra búsqueda/bottom sheet |
| `Ctrl/Cmd+K` | abre búsqueda mobile |
| Back browser | cierra modal o vuelve navegación URL |

Accesibilidad:

- bottom sheet: `role="dialog"`, `aria-modal="true"`, foco atrapado mientras esté abierto,
- nav: `role="tablist"` + tabs con `aria-selected`,
- búsqueda: input con label visible,
- hit: button real, no `li` clickeable,
- tap targets 44px mínimo,
- `prefers-reduced-motion` desactiva animación de sheet.

## 11. Data-testids

IDs canónicos:

```text
mobile-app-lectura
mobile-header-lectura
mobile-breadcrumb-opd
mobile-breadcrumb-volver
mobile-boton-buscar
mobile-vista-activa
mobile-vista-diagrama
mobile-vista-opl
mobile-vista-opds
mobile-vista-acerca
mobile-nav-lectura
mobile-tab-diagrama
mobile-tab-opl
mobile-tab-opds
mobile-tab-acerca
mobile-canvas-readonly
mobile-canvas-zoom-indicator
mobile-canvas-vacio
mobile-opl-buscar
mobile-opl-lista
mobile-arbol-nodo
mobile-arbol-activo
mobile-acerca-cta-escritorio
mobile-acerca-url-escritorio
mobile-acerca-sync
mobile-busqueda-vista
mobile-busqueda-input
mobile-busqueda-toggle-diagnostico
mobile-busqueda-toggle-diagnostico-input
mobile-busqueda-seccion-opds
mobile-busqueda-seccion-entidades
mobile-busqueda-seccion-opl
mobile-busqueda-seccion-issues
mobile-busqueda-hit
mobile-busqueda-badge-issue
bottom-sheet-entidad
bottom-sheet-entidad-header
bottom-sheet-entidad-aparece-en
bottom-sheet-enlace
bottom-sheet-drag-handle
```

Total: 40 IDs canónicos. No decir 30.

Compatibilidad temporal:

- `mobile-tab-canvas` alias productivo de `mobile-tab-diagrama` durante 2 sprints.
- `mobile-tab-opds` y `mobile-tab-opl` se conservan porque no cambian.
- `mobile-tab-issues` se elimina sólo después de actualizar `e2e/22-responsive-review.spec.ts` e `in-vivo-exhaustivo.mjs`.

Si el audit productivo se actualiza en el mismo PR, no hace falta alias `mobile-tab-issues`.

## 12. Plan de implementación

### Fase 0 - Contrato y flag (0.5 día)

- Agregar `esMobileLectura`.
- Extender `ContextModoWorkbench`.
- Tests de precedencia.
- `VITE_MOBILE_READONLY=false` por default.

Gate:

```bash
cd app
bun run typecheck
bun test src/ui/contextoWorkbench.test.ts
```

### Fase 1 - JointJS readonly bajo flag (1.5 días)

- Propagar `readonlyMode`.
- `interactive` devuelve objeto readonly.
- Gatear handlers mutantes.
- No montar tools/halos/renombrado/menu enlace.
- Tests unitarios de adapter/handlers.

Gate:

```bash
cd app
bun test src/render/jointjs
bun run typecheck
```

### Fase 2 - Shell mobile lectura (2 días)

- Crear `MobileReadonlyApp`.
- Header/nav/vistas.
- Bottom sheets consultivos.
- Acerca con metadatos existentes.
- No tocar persistencia backend.

Gate:

```bash
cd app
bun test src/ui/mobile src/app/viewmodels
bun run lint
```

### Fase 3 - Router path y búsqueda (1.5 días)

- `routerMovil.ts`.
- `preferenciasMovil.ts`.
- búsqueda normalizada multi-sección.
- toggle diagnóstico persistido.

Gate:

```bash
cd app
bun test src/ui/mobile src/app/viewmodels
```

### Fase 4 - E2E + audit in-vivo (1.5 días)

- Actualizar `22-responsive-review.spec.ts`.
- Agregar suite `mobile-readonly`.
- Extender `in-vivo-exhaustivo.mjs` bloque 11.
- Smoke path deep link self-hosted.

Gate:

```bash
cd app
bun run check
bun run lint
bun run build
PW_PORT=<libre> bunx playwright test e2e/22-responsive-review.spec.ts --workers=1
node scripts/in-vivo-exhaustivo.mjs http://127.0.0.1:<puerto> <hodom-json>
```

### Fase 5 - Activación productiva (0.5 día)

- Setear build arg `VITE_MOBILE_READONLY=true`.
- Build Docker.
- Deploy.
- Smoke externo:

```bash
curl -fsSI https://opforja.sanixai.com/m/test/opd/test/vista/diagrama
```

Debe devolver `200` y servir `index.html`.

## 13. Tests obligatorios

### 13.1 Invariante no-mutación

E2E:

1. abrir modelo con cosa y enlace,
2. capturar `exportarModelo`,
3. intentar drag entidad,
4. intentar drag estado,
5. intentar resize,
6. intentar link desde anchor,
7. abrir bottom sheet,
8. cambiar tabs,
9. capturar `exportarModelo`,
10. assert igualdad.

### 13.2 Deep links

Unit:

- 16 casos de parser,
- IDs con `-`, `_`, `.`, `:`,
- segmentos malformados,
- vista inválida,
- segmentos opcionales.

E2E:

- mobile interpreta `/m/<id>/opd/<id>/vista/opl`,
- desktop no monta `mobile-app-lectura`,
- path desconocido no redirige a `/`.

### 13.3 JointJS

Unit/interaction:

- `interactive` readonly devuelve `elementMove:false`,
- link selected no instala tools en readonly,
- `preventDefaultInteraction` se llama en `element:pointerdown` si readonly y handler consultivo está activo,
- handlers mutantes no se cablean.

### 13.4 Búsqueda

- toggle off no monta sección issues,
- toggle on monta sección issues,
- preferencia sobrevive remount,
- limpiar localStorage vuelve a off,
- hit navega y cierra modal sin mutar modelo.

## 14. Riesgos

| Riesgo | Severidad | Mitigación |
|---|---:|---|
| readonly incompleto en JointJS | P0 | invariantes de no-mutación + gating adapter/handlers |
| path deep link rompe producción | P1 | `deploy/nginx.conf` ya tiene fallback; smoke de path antes de deploy |
| `VITE_MOBILE_READONLY` se confunde con runtime kill switch | P1 | documentar como build flag; rollback por imagen/redeploy |
| IDs reales no pasan regex | P1 | regex amplia y tests con IDs existentes |
| búsqueda se llama fuzzy sin serlo | P2 | llamarla búsqueda normalizada o implementar scoring real |
| diagnóstico opt-in ensucia UX de lectura | P2 | default off + sección al final + badge "Diagnóstico" |

## 15. Criterios de aceptación

La spec se considera implementada cuando:

- `data-context-modo="lectura"` sólo aparece en mobile con flag activo.
- Desktop/tablet mantienen chrome actual.
- `mobile-tab-issues` ya no existe o el audit fue actualizado en el mismo PR.
- Ningún gesto mobile readonly muta `modelo`.
- JointJS no permite `elementMove`, link tools, label move ni vertex edits en readonly.
- Deep links path devuelven SPA en Docker/nginx y se parsean en mobile.
- Búsqueda tiene diagnóstico off por default y persistido.
- `cd app && bun run check && bun run lint && bun run build` pasa.
- `e2e/22-responsive-review.spec.ts` pasa en mobile y desktop.
- `in-vivo-exhaustivo.mjs` reporta bloque mobile readonly sin FAIL.

## 16. No hacer en v1

- No crear backend nuevo para sync timestamp.
- No introducir `joint.ui.PaperScroller`.
- No portar inspector editable a mobile.
- No habilitar simulación mobile por herencia de flags desktop.
- No añadir visual diff como gate obligatorio.
- No tocar kernel OPM, serialización ni OPL reverse.

## 17. Prompt breve de implementación

Retomar desde `docs/specs/mobile-readonly-v1-steipete-cat-jointjs.md`. Implementar mobile lectura como funtor de olvido controlado: mobile preserva navegación/consulta y olvida toda escritura. Empezar por Fase 0 y Fase 1: contexto `lectura`, flag de build honesto, y readonly JointJS en adapter/handlers con invariant tests de no-mutación. No tocar kernel OPM ni persistencia; no introducir PaperScroller ni APIs nuevas.
