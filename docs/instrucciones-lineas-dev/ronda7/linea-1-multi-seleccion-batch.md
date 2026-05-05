# Linea 1 — Multi-seleccion y operaciones batch

## 1. Mision

Cerrar el patron de seleccion del canvas que esta abierto desde MVP-alpha y desbloquea una cadena de HU. La ronda 5 dejo seleccion simple (un solo elemento); la ronda 6 reescribio render y workspace pero **no toco multi-seleccion**, por lo que HU-11.007/.008/.023, HU-14.016 y HU-16.022 siguen pendientes. Esta linea introduce el contrato canonico de seleccion (HU-SHARED-008), las operaciones batch sobre el canvas (eliminar, alinear, conectar al todo, batch styling) y los gestos kernel asociados (Ctrl+clic, Shift+lazo, Esc, Delete, flechas con Shift, Ctrl+C/V).

**Slice minimo entregable**:

- Helper `app/src/canvas/seleccionMultiple.ts` (logica de modos `simple | multi | rectangulo`, `agregar`, `quitar`, `set`, `vaciar`, `interseccionRectangulo`).
- Helper `app/src/canvas/operacionesBatch.ts` (`eliminarApariencias`, `eliminarEnlaces`, `conectarMultiAlTodo`, `alinearEnlaces`, `aplicarEstiloABatch`, `nudgeApariencias`, `nudgeEnlaces`, `copiarSeleccion`, `pegarSeleccion`).
- Acciones `store.ts` agrupadas en bloque "Seleccion" (al final del archivo, no reordenar bloques previos).
- Eventos canvas en `JointCanvas.tsx`: Ctrl+clic, Shift+drag, Esc, Delete, flechas/Shift+flechas, Ctrl+C/V, Ctrl+A.
- Halo de seleccion en `proyeccion.ts` (anillo azul `#3DA8FF` 2px sobre apariencia, alrededor del wrapper de 15px sobre enlace).
- Boton "Aplicar a seleccion" en `StyleControls.tsx` y slot estable `data-testid="inspector-entidad-acciones"` para que L6 monte luego.
- Smoke browser que cubre crear 3 cosas, lazo Shift, Ctrl+clic toggle, Delete batch, Esc.

**Fuera de slice**: HU-11.026/.027 (tabla de tipos extendida + Condicion/Evento/NOT — bloqueada por kernel `enlace.subtipo`); HU-15.* multiplicidad avanzada; HU-1A snap/grid (no incluido — HU-90.006/.007 nudge fino sin snap); HU-90.014 Shift+U despliegue (entra en L5 atajos); HU-90.015 format painter (entra en L5 si cabe); biblioteca lateral arrastrable (HU-35.016/.017 fuera de ronda); operaciones cross-OPD (la seleccion vive en el OPD activo, sin propagacion a otros OPDs).

## 2. HU base

| HU | Path absoluto | Aporte |
|---|---|---|
| HU-SHARED-008 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-008-seleccion-canvas.md` | Contrato canonico: clic, Ctrl+clic, Shift+lazo, Esc, halo. |
| HU-11.001 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-11-canvas-modelado-basico.md` | Crear cosa y partes en secuencia (M0). Barra creativa "viva" sin auto-cierre. |
| HU-11.007 | idem | Conectar multi-seleccion al todo en un solo gesto (idempotente, atomico). |
| HU-11.008 | idem | Alinear enlaces a izquierda/derecha/arriba/abajo segun coordenada extrema. |
| HU-11.023 | idem | Borrar varios enlaces seleccionados con Delete (un solo undo). |
| HU-14.016 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-14-canvas-styling.md` | Multi-seleccion para batch styling (apariencia + enlace). |
| HU-90.003 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-90-interaccion-shortcuts.md` | Ctrl+C copia seleccion al buffer visual. |
| HU-90.004 | idem | Ctrl+V pega buffer en OPD activo con offset (mismo entidadId si misma entidad). |
| HU-90.005 | idem | Delete elimina seleccion (especializa HU-SHARED-005 con scope batch). |
| HU-90.006 | idem | Flechas mueven 1px; Shift+flechas mueven 10px (nudge fino). |
| HU-90.007 | idem | Nudge sobre enlaces seleccionados (mueve `aparienciaEnlace.vertices`). |
| HU-90.019 | idem | Ctrl+A selecciona todo el OPD activo (apariencias + enlaces). |

## 3. Anclaje a evidencia

- **SSOT**: `opm-iso-19450-es.md` (no prescribe seleccion — UI), `opm-visual-es.md §V-239 cinco familias estructurales` (relevante para HU-11.007 conexion multi al todo: agregacion-participacion fusiona en bus vertical), `opm-opl-es.md` (no se altera; las operaciones batch deben mantener OPL emitiendo lineas correctas para cada enlace nuevo). HU-SHARED-008 estandariza `ui.seleccionados: Id[]` como estado UI transitorio (no se serializa).
- **Corpus interno reusable**:
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/configuration/rappidEnviromentFunctionality/selectionConfiguration.ts` — `options.selection.startSelecting()` (rubber-band con Shift+blank pointerdown), `options.selection.collection.add/remove()` con Ctrl/Meta lineas 38-45. Patron: el evento `blank:pointerdown` con `shiftKey` arranca lazo; el evento `cell:pointerup` con `ctrlKey || metaKey` toggle.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/Actions/BringConnectedEntitiesAction.ts` — `filterRelevantRules()`, `collectEntitiesAndLinks()`, `createNeededRelations()` lineas 6-26. Patron para HU-11.007: estrategias filtradas por reglas (`bringConnectedRules.ts`), no copia 1:1 — usar como base estructural para "conectar batch al todo".
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/consistency/bringConnectedRules.ts` lineas 5-39: 6 estrategias (procedural enablers/transformers, structural fundamental, etc.). Para HU-11.007 basta la estrategia "agregacion uno-a-todo" — `if (origenes.every(o => o.tipo === "objeto") && destino.tipo === "objeto")` -> emitir N enlaces de agregacion.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/VisualPart/OpmVisualThing.ts` linea 1946: `BringConnectedAction`, `BringConnectedCommand`, `StylingCommand`, `StyleAction`, `MultiDeleteProgressComponent`. Confirma que OPCloud trata batch como comandos atomicos en undo stack.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/dialogs/multi-delete-progress/multi-delete-progress.component.ts` — patron progress UI para batch delete (no necesario en MVP; el batch instantaneo basta).
  - `docs/JOYAS.md` color seleccion: `#3DA8FF` 2px borde (HU-SHARED-008 §3); wrapper enlace 15px transparente preservado.
- **Estado actual del codigo (post-ronda 6)**:
  - `app/src/store.ts` (2554 LOC) tiene `seleccionId: Id | null` (single-select). Esta linea introduce `seleccionados: Id[]` como nueva fuente, mantiene `seleccionId` derivado (`seleccionId = seleccionados.length === 1 ? seleccionados[0] : null`) para no romper consumidores.
  - `app/src/render/jointjs/JointCanvas.tsx` ya cablea `cell:pointerclick` -> `seleccionar(id)` y `blank:pointerclick` -> `vaciarSeleccion()`. Aditivo: agregar handlers `cell:pointerclick` con `e.shiftKey || e.ctrlKey || e.metaKey`, `blank:pointerdown + Shift` para arrancar rubber-band, `keydown global` (Delete, Esc, flechas, Ctrl+C/V/A).
  - `app/src/render/jointjs/proyeccion.ts` (1116 LOC) ya proyecta apariencias y enlaces con `apariencia.estilo`. Aditivo: agregar `selectionRing` aparte (no tocar el cell principal) con clase CSS `.opm-seleccionado` y borde `#3DA8FF` 2px.
  - `app/src/ui/StyleControls.tsx` (309 LOC) edita `apariencia.estilo` del unico elemento seleccionado; aditivo: switch "Aplicar a seleccion" cuando `seleccionados.length >= 2`.
  - No existe `app/src/canvas/`. Esta linea crea el directorio y los dos helpers nuevos.

## 4. Archivos permitidos

```text
app/src/canvas/seleccionMultiple.ts            NUEVO
app/src/canvas/seleccionMultiple.test.ts       NUEVO
app/src/canvas/operacionesBatch.ts             NUEVO
app/src/canvas/operacionesBatch.test.ts        NUEVO
app/src/modelo/tipos.ts                        EDIT aditivo (`ui.portapapelesVisual?` opcional)
app/src/render/jointjs/proyeccion.ts           EDIT aditivo (selectionRing + halo seleccionados)
app/src/render/jointjs/proyeccion.test.ts      EDIT aditivo
app/src/render/jointjs/JointCanvas.tsx         EDIT aditivo (Ctrl+clic, Shift+drag, listeners global)
app/src/store.ts                               EDIT aditivo (bloque "Seleccion" al final)
app/src/store.test.ts                          EDIT aditivo
app/src/ui/App.tsx                             EDIT aditivo (handler global Ctrl+C/V/A/Esc/Delete/flechas)
app/src/ui/StyleControls.tsx                   EDIT aditivo (boton "Aplicar a seleccion")
app/src/ui/InspectorEntidad.tsx                EDIT aditivo discreto (slot data-testid="inspector-entidad-acciones")
app/src/ui/InspectorEnlace.tsx                 EDIT aditivo discreto (boton "Aplicar a seleccion")
app/src/ui/Toolbar.tsx                         EDIT aditivo discreto (boton "Acciones de seleccion" cuando seleccion >=2)
app/src/serializacion/json.ts                  EDIT aditivo (verificar que ui.seleccionados/portapapeles no se persiste)
app/src/serializacion/json.test.ts             EDIT aditivo
app/e2e/opm-smoke.spec.ts                      EDIT aditivo
opm-extracted/**                               LECTURA
docs/JOYAS.md                                  LECTURA
/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/** LECTURA
```

## 5. Restricciones de no-colision

- No tocar `app/src/render/jointjs/mapaSistema.ts`, `mapaSistema.test.ts`, `MapaSistema.tsx`, `mapaExport.ts` (territorio L2). En vista mapa la seleccion no aplica — guardar con `if (vistaMapaActiva) return;` antes de procesar gestos de seleccion.
- No tocar `app/src/store/pestanas.ts`, `BarraPestanas.tsx`, `opl/bloquesJerarquicos.ts`, `PanelOpl.tsx` (territorio L3). Si L3 mergea antes (no es el caso en orden sugerido), respetar prefijo `pestanasAbiertas` en store y prefijar el slice de seleccion como `seleccion*` para evitar choques.
- No tocar `app/src/persistencia/movimientoModelos.ts`, `versiones.ts`, `DialogoBuscarGlobal.tsx`, `DialogoVersiones.tsx`, `DialogoArchivados.tsx`, `PanelCarpetas.tsx`, `DialogoCargarModelo.tsx`, `DialogoGuardarComo.tsx` (territorio L4).
- No tocar `app/src/ui/atajosTeclado.ts`, `atajosTeclado.test.ts`, `divisorPanel.tsx`, `MenuContextualArbol.tsx`, `CheatsheetAtajos.tsx`, `ArbolOpd.tsx` (territorio L5). El handler global de teclado de esta linea vive en `App.tsx` con `useEffect`/`addEventListener("keydown")` directo. Cuando L5 mergea despues, migrara estos listeners al registry central manteniendo el comportamiento. Esta linea **deja documentado** en commit el handler para que L5 lo migre sin reabrir contrato.
- No tocar `app/src/modelo/objetoMetadata.ts`, `estadosDesignaciones.ts`, `objetoDuracion.ts`, `ModalUrlsObjeto.tsx`, `ModalDuracion.tsx` (territorio L6).
- No tocar `app/src/render/jointjs/proyeccion.ts` mas alla del slot de selection ring; el resto de la composicion permanece intacta.
- No tocar `app/src/modelo/operaciones.ts` (1743 LOC, congelado): toda operacion batch vive en `canvas/operacionesBatch.ts` y consume helpers existentes (`eliminarEntidadDelOPD`, `eliminarEnlaceDelOPD`, `crearEnlace`, etc.) leyendo sus firmas publicas.
- No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`.
- No introducir libreria DnD ni de seleccion (evitar `@dnd-kit/*`, `react-selectable`); usar API nativa HTML5 + JointJS events.

## 6. Slice minimo shippeable

### Modelo

`tipos.ts` (aditivo opcional):

```ts
export interface UiPortapapelesVisual {
  apariencias: Array<{ entidadId: Id; offsetX: number; offsetY: number }>;
  enlaces: Array<{ enlaceId: Id }>;
  origenOpdId: Id;
}
// Estado UI transitorio. NO se persiste en JSON OPM. NO se persiste en workspace.
```

`ui.seleccionados: Id[]` y `ui.modoSeleccion: "simple" | "multi" | "rectangulo"` ya estan declarados en HU-SHARED-008 §Modelo; el store los expone como source of truth en lugar de `seleccionId` heredado.

### Canvas / dominio

`canvas/seleccionMultiple.ts`:

```ts
export type ModoSeleccion = "simple" | "multi" | "rectangulo";

export interface EstadoSeleccion {
  seleccionados: Id[];
  modo: ModoSeleccion;
}

export function vacia(): EstadoSeleccion;
export function set(s: EstadoSeleccion, ids: Id[]): EstadoSeleccion;
export function agregar(s: EstadoSeleccion, id: Id): EstadoSeleccion;
export function quitar(s: EstadoSeleccion, id: Id): EstadoSeleccion;
export function toggle(s: EstadoSeleccion, id: Id): EstadoSeleccion;
export function todasDelOpd(modelo: Modelo, opdId: Id): Id[];          // HU-90.019 (apariencias + enlaces del OPD)
export function interseccionRectangulo(modelo: Modelo, opdId: Id, rect: BBox): Id[];   // HU-SHARED-008 lazo
```

Reglas:
- `agregar` es no-op si el id ya esta presente.
- `toggle` agrega o quita segun presencia.
- `todasDelOpd` retorna apariencias y enlaces del OPD activo (no incluye estados internos).
- `interseccionRectangulo` evalua bbox de cada apariencia + bbox derivado de cada `aparienciaEnlace.vertices` con padding de 4 px. La interseccion es por overlap, no por contencion total (consistente con OPCloud).

`canvas/operacionesBatch.ts`:

```ts
export function eliminarBatch(modelo: Modelo, ids: Id[]): Resultado<Modelo>;        // HU-11.023 + HU-90.005
export function nudgeApariencias(modelo: Modelo, opdId: Id, ids: Id[], dx: number, dy: number): Resultado<Modelo>;   // HU-90.006
export function nudgeEnlaces(modelo: Modelo, opdId: Id, ids: Id[], dx: number, dy: number): Resultado<Modelo>;        // HU-90.007
export function alinearEnlacesIzquierda(modelo: Modelo, opdId: Id, ids: Id[]): Resultado<Modelo>;   // HU-11.008
export function alinearEnlacesDerecha(modelo: Modelo, opdId: Id, ids: Id[]): Resultado<Modelo>;
export function alinearEnlacesArriba(modelo: Modelo, opdId: Id, ids: Id[]): Resultado<Modelo>;
export function alinearEnlacesAbajo(modelo: Modelo, opdId: Id, ids: Id[]): Resultado<Modelo>;
export function conectarMultiAlTodo(
  modelo: Modelo,
  opdId: Id,
  partesApariencias: Id[],
  todoApariencia: Id,
  tipoEnlace: TipoEnlace,
): Resultado<Modelo>;                                                                // HU-11.007
export function aplicarEstiloApariencias(
  modelo: Modelo,
  opdId: Id,
  ids: Id[],
  estilo: Partial<ApariencaEstilo>,
): Resultado<Modelo>;                                                                // HU-14.016 batch styling
export function aplicarEstiloEnlaces(modelo: Modelo, opdId: Id, ids: Id[], estilo: Partial<EnlaceEstilo>): Resultado<Modelo>;
export function copiarSeleccion(modelo: Modelo, opdId: Id, ids: Id[]): UiPortapapelesVisual;          // HU-90.003
export function pegarSeleccion(
  modelo: Modelo,
  opdId: Id,
  buffer: UiPortapapelesVisual,
  offset: { x: number; y: number },
): Resultado<Modelo>;                                                                // HU-90.004
```

Reglas:
- Toda operacion batch es atomica: una sola entrada en undo stack via `commitModelo` (consistente con HU-SHARED-002).
- `conectarMultiAlTodo` filtra duplicados: si `enlace.origenId === parteId && enlace.destinoId === todoId && enlace.tipo === tipoEnlace` ya existe, se omite (idempotencia HU-11.007).
- `alinearEnlaces*` usa la coordenada extrema (min/max) del primer punto de cada enlace; si hay vertices manuales, se ajustan los puntos de inicio/fin proyectando sobre la coordenada elegida.
- `pegarSeleccion` reusa entidades existentes (mismo `entidadId`); solo crea apariencias y enlaces nuevos. Si el buffer proviene del mismo OPD, aplica offset (24, 24) por defecto. Si el buffer proviene de otro OPD, mantiene la entidad y crea apariencia local (la entidad es global a `modelo.entidades`).
- `eliminarBatch` invoca `eliminarEntidadDelOPD` o `eliminarEnlaceDelOPD` segun el id; respeta scope OPD-only por default (HU-SHARED-005 vista). Si todos los ids son enlaces o todos apariencias del mismo OPD, no abre dialogo de scope (atajo Delete).

### Render

`proyeccion.ts` (aditivo):

- Tras componer `cell` para apariencia y enlace, agregar atributo `selected: boolean` derivado de `seleccionados.includes(id)`.
- Construir `selectionRing` como capa adicional sobre el cell (no modificar el cell base): un `<rect>` o `<circle>` con stroke `#3DA8FF`, strokeWidth `2`, strokeDasharray `none`, fill `transparent`, posicionado al exterior del bbox del cell con padding 4 px. Para enlaces, ampliar el wrapper transparente en el mismo color con strokeWidth 4 alpha 0.4.
- En vista mapa (`vistaMapaActiva`), no aplicar selection ring (mapa tiene su propio resaltado).

`JointCanvas.tsx` (aditivo):

```tsx
useEffect(() => {
  if (!paper) return;

  paper.on("cell:pointerclick", (cellView, evt) => {
    if (vistaMapaActiva) return;
    const id = cellView.model.id as Id;
    if (evt.ctrlKey || evt.metaKey) {
      store.toggleSeleccion(id);            // multi
    } else if (evt.shiftKey) {
      store.agregarASeleccion(id);          // sumar al rango
    } else {
      store.setSeleccion([id]);             // simple
    }
  });

  paper.on("blank:pointerdown", (evt) => {
    if (vistaMapaActiva) return;
    if (evt.shiftKey) {
      iniciarRubberBand(evt);
    } else {
      store.vaciarSeleccion();
    }
  });

  paper.on("blank:pointerup", (evt) => {
    if (rubberBandActivo) {
      finalizarRubberBand(evt);
    }
  });
}, [paper, vistaMapaActiva]);
```

`iniciarRubberBand` dibuja un overlay SVG con `<rect>` semitransparente (`fill: rgba(61, 168, 255, 0.2); stroke: #3DA8FF; stroke-width: 1`) y captura mousemove via `paper.el.addEventListener("mousemove", ...)`. Al soltar, calcula `interseccionRectangulo` y `setSeleccion(idsIntersectados)`. Si Ctrl mantenido durante drag, el resultado se suma a la seleccion previa (HU-SHARED-008).

### Store

```ts
// Bloque "Seleccion" (al final de store.ts; agrupar consecutivamente)
seleccionados: Id[];
modoSeleccion: ModoSeleccion;
portapapelesVisual: UiPortapapelesVisual | null;

setSeleccion(ids: Id[]): void;
agregarASeleccion(id: Id): void;
quitarDeSeleccion(id: Id): void;
toggleSeleccion(id: Id): void;
seleccionarTodoEnOpd(): void;                  // HU-90.019
vaciarSeleccion(): void;

eliminarSeleccion(): void;                     // HU-11.023 + HU-90.005
nudgeSeleccion(dx: number, dy: number): void;  // HU-90.006/.007
alinearSeleccionEnlaces(direccion: "izquierda" | "derecha" | "arriba" | "abajo"): void;
conectarSeleccionAlTodo(todoApariencia: Id, tipo: TipoEnlace): void;
aplicarEstiloASeleccion(estilo: Partial<ApariencaEstilo | EnlaceEstilo>): void;

copiarSeleccionAlBuffer(): void;               // HU-90.003
pegarBufferEnOpdActivo(): void;                // HU-90.004
```

Selectores derivados:
- `seleccionId: Id | null` = `seleccionados.length === 1 ? seleccionados[0] : null` (compatibilidad hacia atras con consumidores ronda 5/6).
- `seleccionEsEnlaces: boolean` = todos los seleccionados son enlaces.
- `seleccionEsApariencias: boolean` = todos son apariencias.
- `seleccionMixta: boolean` = mezcla.

### Serializacion

`json.ts` (aditivo): test que asegura que `seleccionados`, `modoSeleccion`, `portapapelesVisual` NO aparecen en el snapshot serializado. La serializacion existente ya excluye campos `ui.*`; reforzar la asercion.

### UX

`StyleControls.tsx` (aditivo):

- Cuando `seleccionados.length >= 2`, mostrar barra superior con texto "N elementos seleccionados" + boton "Aplicar a seleccion" toggle.
- Si toggle activo, los sliders y selectores invocan `aplicarEstiloASeleccion` en lugar de `aplicarEstiloAEntidad/Enlace`.
- Si toggle inactivo o seleccion = 1, comportamiento clasico.
- Boton "Reset Style" se mantiene; si toggle activo, resetea estilos del batch.

`InspectorEntidad.tsx` (aditivo discreto):

- Agregar slot estable `<div data-testid="inspector-entidad-acciones" />` al pie del panel; L6 lo poblara con acciones (alias, descripcion, URL).
- No alterar nada mas.

`InspectorEnlace.tsx` (aditivo discreto):

- Boton "Aplicar a seleccion" al final del panel cuando `seleccionados.length >= 2 && seleccionEsEnlaces`.

`Toolbar.tsx` (aditivo discreto):

- Cuando `seleccionados.length >= 2`, mostrar grupo "Acciones": Eliminar (icono basura), Alinear (dropdown con 4 direcciones), Conectar al todo (cuando hay >= 2 apariencias y 1 sola adicional resaltada como pivot — diferir a interaccion canvas: arrastrar enlace desde una al pivot abre tabla, batch derivado).

`App.tsx` (aditivo):

- `useEffect` global que registra listeners en `window`:
  - `keydown` Delete -> `eliminarSeleccion()` si hay seleccion y no hay input enfocado.
  - `keydown` Escape -> `vaciarSeleccion()`.
  - `keydown` ArrowUp/Down/Left/Right -> `nudgeSeleccion(dx, dy)` con dx/dy = 1; con Shift = 10.
  - `keydown` Ctrl+A (o Cmd+A) -> `seleccionarTodoEnOpd()` si canvas tiene foco logico.
  - `keydown` Ctrl+C / Cmd+C -> `copiarSeleccionAlBuffer()`.
  - `keydown` Ctrl+V / Cmd+V -> `pegarBufferEnOpdActivo()`.
- Detectar input enfocado (`document.activeElement?.tagName` in `['INPUT', 'TEXTAREA']` o contentEditable) y abortar si si para no robar Delete/Esc al usuario en dialogos.

### Cross-capa

- Cuando se navega de OPD (HU-12.025/.026), `vaciarSeleccion()` automatico (la seleccion vive en el OPD activo).
- Cuando se abre dialogo (asistente, cargar/guardar como, mapa, gestion arbol, busqueda), bloquear los listeners de App.tsx para no eliminar elementos seleccionados sin querer (`if (any(modal abierto)) return`).
- Vista mapa (`vistaMapaActiva`) suspende multi-seleccion: no rubber-band, no halo, no batch.
- Crear cosa y partes en secuencia (HU-11.001): la barra de creacion no se cierra al crear; el modo "creacion-cosa" se mantiene activo hasta que el usuario presiona Esc o cambia a otra herramienta. Esto se logra con un store flag `modoBarraCreacion: TipoCosa | null` que persiste tras cada drag-drop. Cada creacion nueva entra como entry separado en undo (no batch).

## 7. Tests obligatorios

- Unit `seleccionMultiple`: `vacia` retorna `{seleccionados: [], modo: "simple"}`; `agregar` idempotente; `toggle` agrega luego quita; `todasDelOpd` excluye OPDs distintos al activo; `interseccionRectangulo` con bbox que toca borde retorna match (overlap, no contencion).
- Unit `operacionesBatch`: `eliminarBatch` con 3 enlaces los elimina y deja entidades intactas; `nudgeApariencias(dx=10)` mueve cada apariencia 10 px en x; `alinearEnlacesIzquierda` con 3 enlaces ajusta sus origenes a min(x); `conectarMultiAlTodo` con 3 partes y 1 todo crea 3 enlaces de agregacion; idempotente si dos ya existen; `copiarSeleccion` snapshot incluye `entidadId` no `id` de apariencia; `pegarSeleccion` con offset (24,24) crea apariencias nuevas y reusa entidades.
- Unit `operacionesBatch`: `aplicarEstiloApariencias` con 5 ids aplica `colorFondo: "#FF0000"` a las 5 sin tocar otras; `aplicarEstiloEnlaces` analogo.
- Unit serializacion: snapshot OPM no contiene `seleccionados`, `modoSeleccion`, `portapapelesVisual`. Roundtrip lossless con seleccion previa.
- Store: `setSeleccion([a, b])` -> `seleccionId === null`, `seleccionados === [a, b]`. `vaciarSeleccion` deja `seleccionados === []`. Ctrl+A en OPD con 4 apariencias y 2 enlaces -> seleccionados.length === 6. `eliminarSeleccion` con 3 enlaces deja modelo con 3 enlaces menos y un solo undo.
- Store: navegar a otro OPD via `cambiarOpdActivo` vacia seleccion automaticamente.
- Component/UI: rubber-band: simular `mousedown shiftKey` en blank, `mousemove` 100 px, `mouseup` -> seleccionados con apariencias intersectadas. `Esc` desde canvas vacia. `Delete` con seleccion 2 -> 0 elementos en OPD. `Ctrl+clic` toggle individual.
- Component/UI: `StyleControls` con seleccion 3, toggle "Aplicar a seleccion" activo, slider color -> 3 apariencias con nuevo color. Toggle inactivo + seleccion 3 -> deshabilitar slider o aplicar solo al primero (decidir y documentar — recomendado: aplicar al primero como ronda 6 y mostrar warning).
- Smoke browser: cargar modelo demo; Shift+drag desde canvas vacio sobre 3 apariencias -> halo en las 3; Ctrl+clic en una -> halo en 2; Delete -> 2 menos; Ctrl+Z -> restaurado. Crear cosa, mantener barra activa, crear segunda cosa sin reabrir, ambas en undo separado.

## 8. Verificacion

```bash
cd app
bun run check
bun run browser:smoke
bun run build
```

## 9. Decisiones bloqueadas (no reabrir)

- `ui.seleccionados` es transitorio; no se serializa, no se persiste en workspace.
- Halo de seleccion: borde 2 px color `#3DA8FF` (HU-SHARED-008 §3, JOYAS §1).
- Multi-seleccion solo entre elementos del mismo OPD; al navegar OPD se vacia (consistente con OPCloud).
- Operaciones batch entran como un solo undo (HU-SHARED-002 atomicidad).
- Vista mapa suspende multi-seleccion completamente.
- Buffer copy/paste de Ctrl+C/V es visual: reusa entidades por id, crea apariencias nuevas. No usa system clipboard (ranges complicados); buffer interno en memoria.
- Listeners global de teclado en `App.tsx` con guard `document.activeElement.tagName in ['INPUT','TEXTAREA']` para no robar Delete/Esc.
- HU-90.014 Shift+U y HU-90.015 Ctrl+Shift+C quedan para L5 (registry central de atajos); esta linea NO los implementa.
- HU-11.026/.027 (tabla tipos extendida + Condicion/Evento/NOT) fuera de slice — bloqueada por kernel `enlace.subtipo` no implementado.
- HU-1A snap/grid fuera de ronda; nudge fino es 1 px / 10 px (Shift) sin alinear a grid.

## 10. Decisiones que tomas vos (documentar en commit)

- Como manejar `aplicarEstiloAEntidad` con seleccion mixta (apariencias + enlaces): bloquear toggle "Aplicar a seleccion" o solo aplicar al subset compatible. Recomendado: aplicar al subset y mostrar contador "N de M aplicados".
- Si Ctrl+A incluye estados internos (cuando estan visibles) o solo apariencias top-level. Recomendado: solo top-level.
- Si rubber-band redibujado en `paper.el` o en `<svg>` aparte. Recomendado: en `paper.el` para reusar pan/zoom de JointJS.
- Si `pegarSeleccion` aplica offset incremental cada paste sucesivo (acumula 24, 48, 72...) o siempre constante (24, 24). Recomendado: incremental para evitar overlap visual.
- Si `Ctrl+A` con OPD vacio es no-op o muestra toast "Sin elementos para seleccionar". Recomendado: no-op silente.
- Si nudge sobre enlaces seleccionados mueve solo `vertices` o tambien anclajes extremos. Recomendado: solo vertices (extremos viven anclados a los puertos).
- Si HU-11.007 abre tabla de tipos para elegir tipo de enlace o usa "Agregacion-Participacion" por default cuando todos origenes son objeto. Recomendado: tabla minimal con familias estructurales filtradas.

## 11. Forma del entregable

Commits sugeridos:

- `feat(canvas): introduce seleccion multiple y rubber band con shift drag`
- `feat(canvas): operaciones batch eliminar alinear conectar nudge sobre seleccion`
- `feat(canvas): copiar y pegar selección visual con Ctrl+C/V buffer en memoria`
- `feat(ui): aplicar a seleccion en StyleControls e InspectorEnlace`
- `feat(ui): mantener barra creativa activa entre creaciones consecutivas`
- `test(canvas): cubre seleccion, batch, rubber band y atajos delete/esc/flechas`

Co-author footer estandar si aplica al implementador externo. No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`. Reportar comandos ejecutados, tests agregados, decisiones tomadas, HU parcialmente cubiertas y bloqueos. Si descubris bug fuera de scope (ej. fix render mapa), entregar como patch a `/tmp/` y NO commitear (regla de operador para WIP cross-line).
