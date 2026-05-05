# Linea 5 — Atajos teclado centralizados y cierre arbol OPD

## 1. Mision

Dos cierres complementarios en una sola linea: (a) introducir un **registry central de atajos de teclado** que cubra EPICA-90 (0% pre-ronda) consolidando los atajos dispersos en handlers de `App.tsx` (Ctrl+S, Ctrl+F, Ctrl+D), `JointCanvas.tsx` (eventos canvas) y los cableados nuevos de L1 (Delete, Esc, Ctrl+A, flechas, Ctrl+C/V) y L3 (Ctrl+T, Ctrl+W, Ctrl+Tab); (b) cerrar EPICA-20 con los pendientes de **navegacion teclada del arbol** (Ctrl+arriba/abajo/izquierda/derecha), **divisor arrastrable** entre panel arbol y canvas, **menu contextual completo** del arbol (clic derecho con Renombrar, Eliminar, Reordenar, Cut/Paste, Mostrar/Ocultar nombres) y **toggle ocultar nombres**.

**Slice minimo entregable**:

- Registry central `app/src/ui/atajosTeclado.ts` con `registrarAtajo(combo, handler, ctx?)`, `desregistrarAtajo`, `escucharGlobal()` (instala un solo `keydown` listener en `window`), `listarAtajos()` (para cheatsheet), `formatearCombo(combo)`.
- Componente `app/src/ui/divisorPanel.tsx` con resize handle vertical entre arbol y canvas, persistencia de ancho.
- Componente `app/src/ui/MenuContextualArbol.tsx` con acciones Renombrar, Eliminar, Cortar, Pegar, Reordenar (sub-menu), Mostrar/Ocultar nombres, Expandir/Colapsar todo.
- Componente `app/src/ui/CheatsheetAtajos.tsx` (opcional dentro de slice si tiempo): modal con tabla de atajos por categoria.
- Extension `app/src/ui/ArbolOpd.tsx`: navegacion Ctrl+arrows, toggle ocultar nombres, handler clic derecho que abre menu contextual.
- Extension `app/src/ui/App.tsx`: invocar `escucharGlobal()` en mount; migrar listeners actuales (`keydown` global) al registry.
- Acciones `store.ts` agrupadas en bloque "Atajos / Arbol": `fijarAnchoPanelArbol`, `toggleNombresArbolVisibles`, `navegarOpdArriba/Abajo/Izquierda/Derecha`.

**Fuera de slice**: HU-91.* tutorial guiado (separa); remapeo de atajos por usuario (Q90.1, fuera de MVP); compatibilidad cross-platform avanzada (Cmd vs Ctrl ya cubierta basicamente con `e.metaKey || e.ctrlKey`); HU-90.018 Ctrl+D duplicar seleccion (colision con Ctrl+D = Gestion del Arbol de ronda 6 — mantener Ctrl+D como Gestion y dejar duplicar en Ctrl+Shift+D si entra; documentar).

## 2. HU base

| HU | Path absoluto | Aporte |
|---|---|---|
| HU-90.001 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-90-interaccion-shortcuts.md` | Ctrl+S guardar (cableado, registrar central). |
| HU-90.002 | idem | Ctrl+F buscar cosas (cableado, registrar central). |
| HU-90.005 | idem | Delete eliminar (registrar; L1 lo agrego ad-hoc). |
| HU-90.006 | idem | Flechas nudge 1 px (registrar). |
| HU-90.007 | idem | Nudge sobre enlaces (registrar). |
| HU-90.008 | idem | Ctrl+Z deshacer (cableado, registrar). |
| HU-90.009 | idem | Ctrl+Y / Ctrl+Shift+Z rehacer (cableado, registrar). |
| HU-90.010 | idem | Ctrl+arriba navega OPD anterior (NUEVO). |
| HU-90.011 | idem | Ctrl+abajo navega OPD siguiente. |
| HU-90.012 | idem | Ctrl+derecha desciende al primer hijo. |
| HU-90.013 | idem | Ctrl+izquierda asciende al padre. |
| HU-90.014 | idem | Shift+U despliegue (delegar a operacion existente). |
| HU-90.015 | idem | Ctrl+Shift+C format painter (delegar a HU-14.013 ronda 6). |
| HU-90.016 | idem | Axioma "no creacion por teclado" (verificacion documentada). |
| HU-90.017 | idem | Paridad atajo<->boton (verificacion). |
| HU-90.020 | idem | Ctrl+0 fit-to-screen (cableado en JointCanvas via registry). |
| HU-90.021 | idem | Ctrl+rueda zoom (cableado en JointCanvas via registry). |
| HU-20.009 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-20-estructura-arbol-opd.md` | Ctrl+arrows navegar arbol (refuerza HU-90.010-013 desde el arbol). |
| HU-20.010 | idem | Divisor arrastrable. |
| HU-20.011 | idem | Menu contextual completo del arbol. |
| HU-20.013 | idem | Toggle ocultar nombres. |

## 3. Anclaje a evidencia

- **SSOT**: la SSOT no prescribe atajos ni layout UI. `metodologia-opm-es.md §15 invariantes` exige que la creacion sea por gesto explicito de canvas (HU-90.016 axioma "no creacion por teclado") — los atajos solo invocan operaciones sobre seleccion, navegacion o estado, nunca crean entidades/enlaces.
- **Corpus interno reusable**:
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/configuration/rappidEnviromentFunctionality/keyboardShortcuts.ts` lineas 6-50: `copy()`, `pasteOnlyFormatting()`, copy to `clipboard.copied[]`, paste cloning visual+logico. Patron canonico para registrar atajos como mapa `combo -> handler`.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/modules/shared/resize-bar/resize-bar.directive.ts` lineas 16-50: `ResizeBarDirective`, `DIRECTIONS = ["top", "right", "bottom", "left"]`, RxJS `mousedown` -> `mergeMap(mousemove)` -> `takeUntil(mouseup)`. Patron para divisor arrastrable. En esta linea, sin RxJS — usar `addEventListener` nativos.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/modules/shared/resize-bar/resize-bar.component.ts` complementa la directiva.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/opd-hierarchy/opdsTreeActions.ts` lineas 5-50: `ToggleOPDsNamesTreeAction.act()` con `init.oplService.settings.SDNames` (linea 9-15) — patron persistencia toggle. `RenameOpdTreeAction` (linea 21), `RemoveOpdTreeAction` (linea 36), `MoveOpdTreeAction` patron canonico para acciones del menu contextual.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/opd-hierarchy/coll-menu.component.ts` lineas 31-50: context menu abierto, permisos check (descartar — single-user), throttle 2s re-open. Patron de modal contextual.
- **Estado actual del codigo (post-ronda 6)**:
  - `app/src/ui/App.tsx` (108 LOC) tiene handlers globales de `Ctrl+S`, `Ctrl+F`, `Ctrl+D`, `Ctrl+Shift+F`, `Ctrl+Z`, `Ctrl+Y` (revisar — verificar exactamente). El registry central debe migrar estos sin romper.
  - `app/src/ui/ArbolOpd.tsx` (539 LOC) cubre L5 ronda 6: drag manual, expandir/colapsar todo (parcial), renombrado inline, sufijos por refinamiento, toggle de cabecera. Le falta: navegacion Ctrl+arrows, menu contextual completo, toggle ocultar nombres.
  - `app/src/render/jointjs/JointCanvas.tsx` cablea zoom rueda (sin Ctrl) y Ctrl+rueda en mapa (L2 ronda 7 lo agrega). HU-90.020 Ctrl+0 y HU-90.021 Ctrl+rueda en canvas normal viven en esta linea.
  - `app/src/store.ts` ya tiene `cambiarOpdActivo`, `colapsarOpd`, `expandirOpd`. Aditivo: `navegarOpdArriba/Abajo/Izquierda/Derecha`, `fijarAnchoPanelArbol`, `toggleNombresArbolVisibles`.

## 4. Archivos permitidos

```text
app/src/ui/atajosTeclado.ts                    NUEVO
app/src/ui/atajosTeclado.test.ts               NUEVO
app/src/ui/divisorPanel.tsx                    NUEVO
app/src/ui/MenuContextualArbol.tsx             NUEVO
app/src/ui/CheatsheetAtajos.tsx                NUEVO opcional
app/src/ui/ArbolOpd.tsx                        EDIT aditivo (Ctrl+arrows, menu contextual, toggle nombres)
app/src/ui/App.tsx                             EDIT aditivo (escucharGlobal, montar divisorPanel, montar MenuContextualArbol)
app/src/ui/MenuPrincipal.tsx                   EDIT aditivo (entrada "Atajos de teclado..." opcional)
app/src/render/jointjs/JointCanvas.tsx         EDIT aditivo (Ctrl+0 fit, Ctrl+rueda zoom canvas normal)
app/src/store.ts                               EDIT aditivo (slice "Atajos / Arbol")
app/src/store.test.ts                          EDIT aditivo
app/src/modelo/tipos.ts                        EDIT aditivo (`ui.anchoPanelArbol?`, `ui.nombresArbolVisibles?`)
app/src/persistencia/workspace.ts              EDIT aditivo (preferencias UI por usuario: ancho panel, nombres visibles)
app/src/persistencia/local.ts                  LECTURA
app/src/serializacion/json.ts                  EDIT aditivo (asegurar que `ui.*` no entra en JSON OPM)
app/src/serializacion/json.test.ts             EDIT aditivo
app/e2e/opm-smoke.spec.ts                      EDIT aditivo
opm-extracted/**                               LECTURA
docs/JOYAS.md                                  LECTURA
/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/** LECTURA
```

## 5. Restricciones de no-colision

- No tocar `app/src/canvas/seleccionMultiple.ts`, `operacionesBatch.ts` (territorio L1). El registry central absorbe handlers que L1 introdujo en `App.tsx` (Delete, Esc, flechas, Ctrl+A, Ctrl+C/V) sin reescribir las acciones — solo migra el binding `keydown -> accion`. La accion subyacente queda intacta.
- No tocar `app/src/render/jointjs/mapaSistema.ts`, `mapaExport.ts`, `MapaSistema.tsx`, `MapaPanelEstadisticas.tsx`, `MapaFiltros.tsx` (territorio L2). El zoom Ctrl+rueda dentro de la vista mapa permanece en L2; esta linea agrega Ctrl+rueda y Ctrl+0 al canvas normal (cuando `!vistaMapaActiva`). El registry central distingue contexto via parametro `ctx?` para ruteo.
- No tocar `app/src/store/pestanas.ts`, `BarraPestanas.tsx`, `opl/bloquesJerarquicos.ts`, `PanelOpl.tsx` (territorio L3). Atajos `Ctrl+T` (nueva pestana), `Ctrl+W` (cerrar), `Ctrl+Tab` (siguiente) los registra esta linea como **placeholders** que invocan acciones del store que L3 expone (`abrirPestanaNueva`, `cerrarPestana`). Si L3 ya mergeo (no lo hace por orden sugerido), las acciones existen; si no, los handlers son no-op silentes hasta que L3 mergea — documentar.
- No tocar `app/src/persistencia/movimientoModelos.ts`, `versiones.ts`, `DialogoBuscarGlobal.tsx`, `DialogoVersiones.tsx`, `DialogoArchivados.tsx` (territorio L4). El atajo `Ctrl+Shift+F` para busqueda global se registra aqui y delega a `store.abrirDialogoBuscarGlobal()` — accion ya disponible si L4 mergea antes (orden sugerido: si).
- No tocar `app/src/modelo/objetoMetadata.ts`, `estadosDesignaciones.ts`, `objetoDuracion.ts`, `InspectorEntidad.tsx`, `ModalUrlsObjeto.tsx`, `ModalDuracion.tsx` (territorio L6).
- No tocar `app/src/modelo/operaciones.ts`, `app/src/render/jointjs/proyeccion.ts`, `app/src/opl/generar.ts`. El registry y los componentes son UI puro.
- No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`.
- No introducir libreria de hotkeys (no `react-hotkeys`, no `mousetrap`); el registry es propio Preact + `addEventListener` nativo.
- No introducir libreria de menu contextual; usar `<dialog>` nativo o overlay propio.

## 6. Slice minimo shippeable

### Modelo

`tipos.ts` (aditivo opcional, todo no-OPM):

```ts
// Tipos UI usados solo por L5; viven en workspace, NO en JSON OPM
export interface PreferenciasUiUsuario {
  anchoPanelArbol?: number;          // px; default 240
  nombresArbolVisibles?: boolean;    // default true
  cheatsheetVisible?: boolean;       // default false
}
```

### Registry central

`atajosTeclado.ts` (nuevo):

```ts
export type Combo = string;          // ej. "Ctrl+S", "Ctrl+Shift+F", "Delete", "ArrowUp", "Ctrl+ArrowUp"

export type ContextoAtajo = "global" | "canvas" | "panel-opl" | "panel-arbol" | "modal-input" | "vista-mapa";

export interface RegistroAtajo {
  combo: Combo;
  handler: (e: KeyboardEvent) => void;
  ctx: ContextoAtajo;
  descripcion: string;               // human-readable para cheatsheet
  categoria: "navegacion" | "edicion" | "archivo" | "vista" | "seleccion";
  preventDefault?: boolean;          // default true
}

export function registrarAtajo(reg: RegistroAtajo): () => void;     // retorna unsubscribe
export function desregistrarAtajo(combo: Combo, ctx: ContextoAtajo): void;
export function escucharGlobal(): () => void;                        // instala 1 listener en window, retorna unsubscribe
export function listarAtajos(): RegistroAtajo[];
export function formatearCombo(combo: Combo): string;                // ej. "Ctrl+Shift+F" -> "⌃⇧F" en mac, "Ctrl+Shift+F" en win/linux
```

Reglas:
- `escucharGlobal` instala UN unico `keydown` listener en `window` que matchea contra todos los registros, deshace en `unsubscribe`.
- Matching: parser que toma `e.ctrlKey || e.metaKey`, `e.shiftKey`, `e.altKey`, `e.key`. Combo "Ctrl+S" matchea con `(ctrl || meta) && key === "s"`.
- Resolucion de contexto:
  - Si `document.activeElement` es input/textarea/contentEditable -> ctx implícito = `modal-input`. Solo se ejecutan registros con ctx in `["modal-input", "global"]` Y `combo in ["Escape", "Enter"]`. Los demas se ignoran (no robar Delete/Esc del input).
  - Si `vistaMapaActiva` -> ctx implícito = `vista-mapa`. Registros con ctx === `vista-mapa` se ejecutan; los de ctx === `canvas` se ignoran.
  - Si foco logico canvas (no input, no mapa) -> ctx implícito = `canvas`. Registros `canvas` y `global` se ejecutan.
  - Foco panel arbol (panel con tabindex y focused) -> ctx implícito = `panel-arbol`.
- `preventDefault: true` por default; `false` para combos que necesitan dejar pasar el evento (raro).
- Multiplex: si dos registros matchean el mismo combo+ctx, ejecutar el ultimo registrado (LIFO) y warn en dev.

Atajos a registrar (esta linea registra, no implementa la accion):

| Combo | ctx | Categoria | Accion del store | HU |
|---|---|---|---|---|
| `Ctrl+S` | global | archivo | `guardarModelo()` | HU-90.001 / HU-30.014 |
| `Ctrl+F` | canvas | navegacion | `abrirDialogoBuscarCosas()` | HU-90.002 / HU-35.008 |
| `Ctrl+Shift+F` | global | navegacion | `abrirDialogoBuscarGlobal()` | (atajo nuevo, L4) |
| `Ctrl+D` | global | navegacion | `abrirGestionArbol()` | HU-20.020 (ronda 6) |
| `Ctrl+Z` | global | edicion | `deshacer()` | HU-90.008 |
| `Ctrl+Y` | global | edicion | `rehacer()` | HU-90.009 |
| `Ctrl+Shift+Z` | global | edicion | `rehacer()` | HU-90.009 |
| `Ctrl+A` | canvas | seleccion | `seleccionarTodoEnOpd()` | HU-90.019 (L1) |
| `Ctrl+C` | canvas | seleccion | `copiarSeleccionAlBuffer()` | HU-90.003 (L1) |
| `Ctrl+V` | canvas | seleccion | `pegarBufferEnOpdActivo()` | HU-90.004 (L1) |
| `Delete` | canvas | seleccion | `eliminarSeleccion()` | HU-90.005 (L1) |
| `Escape` | global | seleccion | `vaciarSeleccion()` o cerrar dialogo top | HU-SHARED-008 |
| `ArrowUp` | canvas | edicion | `nudgeSeleccion(0, -1)` | HU-90.006 (L1) |
| `ArrowDown` | canvas | edicion | `nudgeSeleccion(0, 1)` | HU-90.006 |
| `ArrowLeft` | canvas | edicion | `nudgeSeleccion(-1, 0)` | HU-90.006 |
| `ArrowRight` | canvas | edicion | `nudgeSeleccion(1, 0)` | HU-90.006 |
| `Shift+ArrowUp/Down/Left/Right` | canvas | edicion | `nudgeSeleccion` con paso 10 | HU-90.006 |
| `Ctrl+ArrowUp` | global | navegacion | `navegarOpdArriba()` | HU-90.011 / HU-20.009 |
| `Ctrl+ArrowDown` | global | navegacion | `navegarOpdAbajo()` | HU-90.010 / HU-20.009 |
| `Ctrl+ArrowLeft` | global | navegacion | `navegarOpdIzquierda()` | HU-90.013 |
| `Ctrl+ArrowRight` | global | navegacion | `navegarOpdDerecha()` | HU-90.012 |
| `Shift+U` | canvas | edicion | `desplegarSeleccion()` | HU-90.014 |
| `Ctrl+Shift+C` | canvas | edicion | `iniciarFormatPainter()` | HU-90.015 |
| `Ctrl+0` | canvas | vista | `fitToScreen()` | HU-90.020 |
| `Ctrl+T` | global | navegacion | `abrirPestanaNueva()` (L3, no-op si L3 no merged) | (atajo extra) |
| `Ctrl+W` | global | navegacion | `cerrarPestanaActiva()` (L3) | (extra) |
| `Ctrl+Tab` | global | navegacion | `siguientePestana()` (L3) | (extra) |
| `Ctrl+Shift+Tab` | global | navegacion | `pestanaAnterior()` (L3) | (extra) |

**Ctrl+rueda** se maneja aparte: no es `keydown`, es `wheel` event. Se cablea en `JointCanvas.tsx` directo (no via registry) — hook independiente.

### Divisor arrastrable

`divisorPanel.tsx` (nuevo):

```tsx
export interface DivisorPanelProps {
  orientacion: "vertical" | "horizontal";   // vertical = handle entre paneles izq/der
  anchoInicial: number;                      // px
  anchoMin?: number;                         // default 160
  anchoMax?: number;                         // default 600
  onAnchoChange: (px: number) => void;
}

export function DivisorPanel(props: DivisorPanelProps) {
  // Render un <div role="separator"> de 4 px ancho con cursor "col-resize"
  // mousedown -> capturar pointer, mousemove -> calcular delta y emitir onAnchoChange clamped
  // mouseup -> liberar
  // Doble clic -> reset al ancho default
}
```

`ArbolOpd.tsx` (aditivo): consumir `divisorPanel` en su edge derecho (entre arbol y canvas). El ancho se persiste en `WorkspaceIndice.preferenciasUi.anchoPanelArbol`.

### Menu contextual del arbol

`MenuContextualArbol.tsx` (nuevo):

```tsx
export interface MenuContextualArbolProps {
  opdId: Id;
  posicion: { x: number; y: number };
  onCerrar: () => void;
}

export function MenuContextualArbol(props: MenuContextualArbolProps) {
  // Render <ul role="menu"> en posicion absoluta;
  // items: Renombrar (HU-20.014), Eliminar OPD (HU-20.015), Cortar nodo (HU-20.022),
  //        Pegar aqui (visible si portapapelesNodo no nulo),
  //        Reordenar (sub-menu: subir, bajar, alinear segun canvas), Mostrar/Ocultar nombres,
  //        Expandir todo, Colapsar todo, Ir al OPD padre, Ir al primer hijo.
  // Click fuera o Esc cierra.
}
```

`ArbolOpd.tsx` (aditivo): handler `oncontextmenu` en cada nodo abre `MenuContextualArbol` con `opdId` y `posicion = e.clientX, e.clientY`. Bloquea menu contextual nativo (`e.preventDefault()`).

### Toggle ocultar nombres (HU-20.013)

`ArbolOpd.tsx` (aditivo):

- Cuando `ui.nombresArbolVisibles === false`, los nodos muestran solo el codigo `SDn` o `SDn.m`. Nombre se omite.
- Boton en cabecera del panel (icono ojo) togglea la preferencia. Tooltip "Ocultar nombres" / "Mostrar nombres".
- Persistido en `WorkspaceIndice.preferenciasUi.nombresArbolVisibles`.

### Navegacion teclada (HU-20.009 + HU-90.010-013)

`ArbolOpd.tsx` y `store.ts` (aditivo):

```ts
// Store
navegarOpdArriba(): void;       // ir al hermano arriba (segun ordenLocal o orden alfabetico)
navegarOpdAbajo(): void;        // ir al hermano abajo
navegarOpdIzquierda(): void;    // ir al padre
navegarOpdDerecha(): void;      // ir al primer hijo
```

Reglas:
- "Arriba/Abajo" se mueve entre hermanos del OPD activo respetando el orden visual del arbol.
- "Izquierda" sube al padre; en SD raiz no hace nada.
- "Derecha" desciende al primer hijo; si no hay hijos, no-op.
- Los atajos Ctrl+arrows pasan por el registry; el panel arbol responde tambien con flechas simples cuando esta enfocado (focus en el panel via tabindex).

### Cheatsheet (opcional dentro de slice)

`CheatsheetAtajos.tsx` (nuevo opcional):

- Modal con tabla de `listarAtajos()` agrupados por categoria.
- Columnas: Combo (formateado), Descripcion, Contexto.
- Boton "Cerrar".
- `data-testid="cheatsheet-atajos"`.

`MenuPrincipal.tsx` (aditivo): item "Atajos de teclado..." abre `CheatsheetAtajos` (si se incluye en el slice).

### App.tsx (aditivo)

- En mount: `escucharGlobal()` y registrar todos los combos de la tabla de §6 con sus handlers (delegados al store).
- En unmount: invocar el `unsubscribe`.
- Migrar listeners actuales (que vivan en hooks `useEffect` con `addEventListener("keydown")`) al registry: borrar el `addEventListener` y agregar `registrarAtajo(...)`. Verificar que el comportamiento sea identico en smoke.
- Montar `<DivisorPanel />` en el layout entre `<ArbolOpd />` y el cuerpo del canvas.
- Montar `<MenuContextualArbol />` controlado por flag del store `arbolMenuContextualAbierto: { opdId, x, y } | null`.
- Montar `<CheatsheetAtajos />` controlado por flag `cheatsheetAbierto: boolean`.

### Persistencia

`workspace.ts` (aditivo):

```ts
export interface WorkspaceIndice {
  // ... campos existentes
  preferenciasUi?: PreferenciasUiUsuario;
}
```

Cargar al iniciar: `state.ui.anchoPanelArbol = workspace.preferenciasUi?.anchoPanelArbol ?? 240`. Persistir al cambiar (actualizar `WorkspaceIndice.preferenciasUi` y guardar).

### Cross-capa

- L1 multi-seleccion: el registry consume las acciones de L1 (`eliminarSeleccion`, `vaciarSeleccion`, `seleccionarTodoEnOpd`, `nudgeSeleccion`, `copiarSeleccionAlBuffer`, `pegarBufferEnOpdActivo`). Si L5 mergea segundo (orden sugerido: si), L1 ya estara presente cuando L5 mergee — registrar atajos que apuntan a las acciones disponibles. Si por algun motivo L1 mergea despues, los atajos quedan registrados pero los handlers son no-op silentes hasta que L1 mergea.
- L2 mapa: cuando `vistaMapaActiva`, el registry usa contexto `vista-mapa` y excluye atajos `canvas`. Ctrl+0 y Ctrl+rueda en mapa siguen siendo de L2; el registry no los toca alli.
- L3 multi-pestana: los atajos `Ctrl+T/W/Tab` apuntan a acciones de pestanas. Si L3 no mergeo aun, los handlers son no-op silentes (con guard `if (typeof store.abrirPestanaNueva === "function")`).
- L4 workspace: el atajo `Ctrl+Shift+F` apunta a `abrirDialogoBuscarGlobal()` de L4. Si L4 mergea antes (orden sugerido: si), accion existe.
- L6 objetos avanzados: no se cablean atajos especificos de L6 en esta linea. Si L6 introduce atajos (ej. abrir modal URL), los registra en su propia linea via `registrarAtajo` desde el componente.

## 7. Tests obligatorios

- Unit `atajosTeclado.test.ts`:
  - `registrarAtajo` agrega; `desregistrarAtajo` quita; `listarAtajos` retorna sin orden definido pero todos.
  - `escucharGlobal` instala listener (mock window). Disparar `keydown Ctrl+S` -> handler invocado.
  - Combo con focus en input ignorado salvo Esc/Enter.
  - Combo en vista mapa: `canvas` ctx ignorado, `vista-mapa` ctx ejecutado.
  - LIFO en colision: dos registros mismo combo+ctx, el ultimo ejecuta.
  - `formatearCombo("Ctrl+S")` produce `"⌃S"` en mac (`navigator.platform === "MacIntel"`) y `"Ctrl+S"` en win/linux.
- Unit `divisorPanel`: simular drag horizontal con jsdom; `onAnchoChange` invocado con clamp en [min, max]; doble clic resetea.
- Unit `MenuContextualArbol`: render con 8 items; click en "Renombrar" invoca `renombrarOpdDesdeArbol`; Esc cierra.
- Store: `navegarOpdArriba` con OPD activo en medio de hermanos cambia al anterior; con OPD activo en SD raiz no-op; `navegarOpdIzquierda` sube al padre; `navegarOpdDerecha` desciende al primer hijo.
- Store: `toggleNombresArbolVisibles` alterna; persiste en workspace.
- Store: `fijarAnchoPanelArbol(160)` clamp a >= anchoMin; persiste.
- Persistencia: cargar workspace con `preferenciasUi.anchoPanelArbol = 320` -> store.ui.anchoPanelArbol === 320.
- Component/UI: arbol con 3 OPDs, focus en panel, presionar `ArrowDown` cambia `opdActivoId` al hermano; `ArrowLeft` sube al padre; `ArrowRight` desciende.
- Component/UI: clic derecho sobre nodo abre menu contextual; click en "Renombrar" inicia inline rename; Esc cierra menu.
- Component/UI: divisor entre arbol y canvas; arrastrar 50 px aumenta ancho 50; doble clic resetea a 240.
- Component/UI: cheatsheet abierto via menu, lista todos los atajos categorizados.
- Smoke browser: cargar modelo demo; presionar Ctrl+S -> save (toast aparece); Ctrl+F -> dialogo busqueda intra-modelo; Ctrl+ArrowDown -> cambia a OPD siguiente; Esc -> deselecciona; Delete -> elimina (si hay seleccion); Ctrl+Shift+F (si L4 mergeo) abre dialogo busqueda global. Arrastrar divisor del panel arbol cambia ancho. Click derecho en nodo del arbol abre menu contextual; "Mostrar/Ocultar nombres" togglea visibilidad.

## 8. Verificacion

```bash
cd app
bun run check
bun run browser:smoke
bun run build
```

## 9. Decisiones bloqueadas (no reabrir)

- Ctrl+D = abrir Gestion del Arbol (ronda 6). NO se reasigna a duplicar seleccion. HU-90.018 (Ctrl+D duplicar) queda fuera de slice o se asigna a `Ctrl+Shift+D` con documentacion en commit.
- Atajo `Ctrl+F` en canvas = busqueda intra-modelo (existe ronda 6). El nuevo atajo `Ctrl+Shift+F` apunta a busqueda global.
- HU-90.016 axioma "no creacion por teclado": ningun atajo crea entidad/enlace. Verificacion en review.
- HU-90.017 paridad atajo<->boton: cada atajo registrado tiene boton equivalente en UI. Documentar en commit cualquier excepcion.
- Registry usa `e.ctrlKey || e.metaKey` para combos `Ctrl+*` (cross-platform mac/win/linux).
- Persistencia de preferencias UI vive en `WorkspaceIndice.preferenciasUi`, NO en JSON OPM ni en LocalStorage suelto. Multi-perfil futuro encajara aqui.
- Sin remapeo de atajos por usuario en MVP (Q90.1).
- Cheatsheet incluido en slice si tiempo permite; opcional. Decision en commit.
- Atajos para pestanas (`Ctrl+T/W/Tab`) registrados como placeholders no-op si L3 aun no mergeo.
- Divisor arrastrable con clamp [160, 600] px; doble clic resetea a 240.

## 10. Decisiones que tomas vos (documentar en commit)

- Si `Escape` en contexto modal cierra solo el modal top o todos los modals. Recomendado: solo el modal top.
- Si Ctrl+rueda en canvas normal hace zoom-in-cursor o zoom-from-center. Recomendado: zoom-in-cursor (consistente con OPCloud).
- Si "Mostrar nombres" / "Ocultar nombres" tiene atajo. Recomendado: no inicialmente; el toggle del panel basta.
- Si el menu contextual del arbol incluye "Ir al OPD padre" / "Ir al primer hijo". Recomendado: si (consistente con Ctrl+arrows visualmente).
- Si el cheatsheet es modal o panel lateral. Recomendado: modal.
- Como manejar conflictos cuando un campo input dentro del canvas (ej. inline rename) recibe foco — el registry debe distinguir. Recomendado: detectar `e.target.closest("[data-modo='inline-rename']")` o equivalente y excluir.
- Si el divisor del panel arbol se persiste por modelo o globalmente. Recomendado: globalmente (preferencia del usuario, no del modelo).

## 11. Forma del entregable

Commits sugeridos:

- `feat(ui): registry central de atajos de teclado con contexto y unsubscribe`
- `feat(ui): divisor arrastrable entre panel arbol y canvas con persistencia`
- `feat(ui): menu contextual del arbol opd con renombrar eliminar cortar pegar reordenar`
- `feat(ui): toggle ocultar nombres y navegacion teclada del arbol con Ctrl+arrows`
- `feat(canvas): Ctrl+0 fit to screen y Ctrl+rueda zoom en canvas normal`
- `feat(ui): cheatsheet de atajos accesible desde menu principal` (opcional)
- `test(atajos): cubre registry contextos divisor menu contextual y navegacion arbol`

Co-author footer estandar si aplica al implementador externo. No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`. Reportar comandos ejecutados, tests agregados, decisiones tomadas, HU parcialmente cubiertas (HU-90.018 Ctrl+D duplicar fuera, HU-91.* tutorial fuera) y bloqueos. Si descubris bug fuera de scope, entregar como patch a `/tmp/`. **Importante**: al migrar listeners de `App.tsx` al registry, garantizar smoke verde — cualquier regresion bloquea el merge.
