# Linea 5 — UI grandes a sub-componentes

## 1. Mision

Romper los 5 componentes UI mas grandes en sub-componentes con responsabilidad acotada, conservando la API publica del componente principal via barrel TSX. La forma OPCloud para este problema es **un dialog/component por afordance** (`opm-extracted/src/app/dialogs/load-model-dialog/load-model-dialog.component.ts:3505 LOC` es el caso degenerado; pero `opm-extracted/src/app/dialogs/About/about.ts:50 LOC`, `change-password-dialog/change-password-dialog.component.ts:87 LOC`, `find-user-admin/find-user-admin.component.ts:372 LOC`, `confirm-dialog (en shared.ts)` muestran que los dialogs simples se mantienen pequenos). El patron canonico es **un componente principal + sub-dialogs/sub-popups por seccion**. Lo destilamos en **5 barrels TSX + 23 sub-componentes**.

Este split NO autoriza sprawl de selectores Zustand. La forma correcta es: el barrel/container conserva las lecturas amplias del store y baja props/callbacks estables a leaves; los leaves solo leen del store cuando un selector por id evita prop drilling real y no introduce dependencia amplia al modelo completo.

Cierre arquitectural: `PanelCarpetas.tsx`, `ArbolOpd.tsx`, `InspectorEntidad.tsx`, `InspectorEnlace.tsx`, `PanelOpl.tsx` quedan como **barrels TSX** que importan sub-componentes y los componen. Cada barrel < 150 LOC; cada sub-componente < 200 LOC.

**Slice minimo entregable**:

5 dominios de UI partidos:

### A. `ui/PanelCarpetas.tsx` (829 LOC) → barrel + 4 sub-componentes
- `ui/panelCarpetas/Tile.tsx`: render de un tile (modelo o carpeta) con glifos archivado/version.
- `ui/panelCarpetas/MenuContextual.tsx`: menu contextual (Renombrar, Eliminar, Cortar, Pegar, Mover, Archivar, Versiones, etc.).
- `ui/panelCarpetas/Breadcrumb.tsx`: breadcrumb con la ruta de carpeta actual.
- `ui/panelCarpetas/handlersDragDrop.ts`: handlers HTML5 drag-drop (no es componente — es modulo TS de logica).

### B. `ui/ArbolOpd.tsx` (698 LOC) → barrel + 3 sub-componentes
- `ui/arbol/NodoOpd.tsx`: render recursivo de un nodo (con icono colapsar, nombre, indicadores).
- `ui/arbol/handlersTeclado.ts`: handlers Ctrl+arrows, navegacion teclada.
- `ui/arbol/togglesArbol.ts`: toggle ocultar nombres a `SDn`, expandir/colapsar todo.

### C. `ui/InspectorEntidad.tsx` (665 LOC) → barrel + 8 sub-componentes
- `ui/inspector/SeccionDescripcion.tsx`: textarea + checkbox "Mostrar mas detalles".
- `ui/inspector/SeccionAlias.tsx`: input alias + boton aplicar.
- `ui/inspector/SeccionUrls.tsx`: lista compacta + boton "Gestionar URLs..." (abre `ModalUrlsObjeto` ya existente).
- `ui/inspector/SeccionLayoutEstados.tsx`: toggle horizontal/vertical.
- `ui/inspector/SeccionDesignaciones.tsx`: checkboxes Inicial/Final/Default/Current con validaciones.
- `ui/inspector/SeccionDuracion.tsx`: boton "Configurar duracion..." (abre `ModalDuracion` ya existente).
- `ui/inspector/SeccionEsenciaAfiliacion.tsx`: toggles esencia (informacional/fisica) + afiliacion (sistemica/ambiental).
- `ui/inspector/SeccionRefinamiento.tsx`: boton "Descomponer" / "Desplegar como..." con dropdown.

### D. `ui/InspectorEnlace.tsx` (715 LOC) → barrel + 6 sub-componentes
- `ui/inspectorEnlace/SeccionMultiplicidad.tsx`: input multiplicidad origen/destino con validacion canonica + custom.
- `ui/inspectorEnlace/SeccionEstiloEnlace.tsx`: ColorPicker + sliders grosor + selector dashArray + boton "Aplicar a seleccion".
- `ui/inspectorEnlace/SeccionExtremos.tsx`: render de extremos (entidad o estado) con dropdown reanclaje.
- `ui/inspectorEnlace/SeccionRuta.tsx`: input etiqueta de ruta + tabla de rutas existentes.
- `ui/inspectorEnlace/SeccionAbanico.tsx`: dropdown operador OR/XOR + lista enlaces agrupados.
- `ui/inspectorEnlace/SeccionReanclaje.tsx`: panel de reanclaje de enlaces externos derivados.

### E. `ui/PanelOpl.tsx` (515 LOC) → barrel + 2 sub-componentes
- `ui/panelOpl/RenderToken.tsx`: render de un token OPL (texto + ref + hint) con hover.
- `ui/panelOpl/Bloques.tsx`: agrupacion por OPD con chevrons (consume `bloquesJerarquicos.ts`).

**Fuera de slice**:
- Smokes browser cross-componente: salvo que la particion altere selectores `data-testid`. El brief asume que TODOS los `data-testid` actuales se preservan; los tests existentes deben pasar sin modificacion.
- Internalizacion / i18n: el texto sigue en es-CL hardcoded.
- Accesibilidad ARIA mas alla de lo actual: sigue como esta.
- `AsistenteNuevoModelo.tsx` (~32 KB / 785 LOC estimadas): NO se toca; diferido a ronda 9.
- `MapaSistema.tsx` (~12 KB): tamano razonable; NO se toca.
- Todos los demas componentes UI < 500 LOC: NO se tocan.

## 2. Deudas que cierra

| Deuda | Path absoluto | Aporte |
|---|---|---|
| Componente monolitico `PanelCarpetas.tsx` | `/home/felix/projects/deep-opm-pro/app/src/ui/PanelCarpetas.tsx` (829 LOC) | Reduce a < 350 LOC; 4 sub-componentes < 200 c/u. |
| Componente monolitico `ArbolOpd.tsx` | `/home/felix/projects/deep-opm-pro/app/src/ui/ArbolOpd.tsx` (698 LOC) | Reduce a < 300 LOC; 3 sub-componentes. |
| Componente monolitico `InspectorEntidad.tsx` | `/home/felix/projects/deep-opm-pro/app/src/ui/InspectorEntidad.tsx` (665 LOC) | Reduce a < 300 LOC; 8 sub-componentes. |
| Componente monolitico `InspectorEnlace.tsx` | `/home/felix/projects/deep-opm-pro/app/src/ui/InspectorEnlace.tsx` (715 LOC) | Reduce a < 300 LOC; 6 sub-componentes. |
| Componente monolitico `PanelOpl.tsx` | `/home/felix/projects/deep-opm-pro/app/src/ui/PanelOpl.tsx` (515 LOC) | Reduce a < 200 LOC; 2 sub-componentes. |

## 3. Anclaje a evidencia

- **SSOT** (justifica las secciones del Inspector y el render):
  - `opm-iso-19450-es.md §Glos 3.7 alias`, `§Glos 3.4 atributo (unidad)`, `§Glos 3.68 estado`, `§Glos 3.71a designaciones`, `§Glos 3.45 duracion`. Cada concepto es una seccion del Inspector.
  - `opm-iso-19450-es.md §multiplicidad`, `§rutas`. Cada uno es una seccion del Inspector de Enlace.
  - `opm-iso-19450-es.md §abanico`. Seccion abanico del Inspector de Enlace.
  - `opm-visual-es.md V-1`, `V-237`, `V-238`. Justifica seccion de estados + layout.
- **Corpus interno reusable**:
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/components/commands/edit-alias.ts:5-43` — `EditAliasCommand` y `EditAliasAction` con `act()` que abre popup. Patron canonico: **un comando + un popup por afordance**. Lo destilamos en sub-componentes (cada seccion del Inspector es un sub-componente que invoca acciones del store).
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/components/commands/object-decider.ts:5-128` — `ObjectCommandsDecider` con `getHaloCommands()` y `getToolabarCommands()` que retornan listas filtradas de comandos segun contexto. Confirma que el Inspector debe exponer **conjuntos diferentes de acciones** segun tipo de cosa seleccionada. Lo destilamos como `<SeccionXxx />` que se monta solo si aplica (`{entidad.tipo === "objeto" && <SeccionEstados ... />}`).
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/components/commands/state-decider.ts` (mismo directorio) — decider para estados. Justifica que las secciones de estado (Designaciones, Duracion, Suprimir) solo aparecen cuando la entidad es estado.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/components/commands/process-decider.ts` (mismo directorio) — decider para procesos. Justifica filtros condicionales de secciones segun tipo.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/dialogs/load-model-dialog/load-model-dialog.component.ts:1-100` — el dialog tiene 3505 LOC porque mezcla render + handlers + drag-drop + validaciones + navegacion de carpetas. Es el ejemplo de no haber partido a tiempo. Justifica empiricamente la division actual de `PanelCarpetas.tsx`.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/opd-hierarchy/opd-hierarchy.component.ts:1-100` — componente de jerarquia OPD (992 LOC). Confirma que el arbol OPD tambien esta sobre-cargado en OPCloud. Su division en sub-componentes seria similar a la nuestra: nodo + handlers + toggles.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/opd-hierarchy/coll-menu.component.ts:1-112` — `CollaborationMenuComponent` separado del componente principal. Patron de **menu contextual como sub-componente independiente**. Justifica `MenuContextualArbol.tsx` (existe ronda 7) y `panelCarpetas/MenuContextual.tsx` (nuevo).
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/dialogs/opl-dialog/opl-dialog.component.ts:1-100` — dialog OPL (603 LOC). Confirma que `PanelOpl.tsx` puede tener < 600 LOC. La separacion `RenderToken` + `Bloques` es similar a su `OPLToken` y `OPLBlock` (referenciados en el dialog).
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/rappid-components/rappid-opl/rappid-opl.component.ts:1-100` — componente OPL en Rappid (557 LOC). Mismo patron: tokens + bloques.
- **Estado actual del codigo**:
  - `PanelCarpetas.tsx` (829 LOC, 1 componente principal `PanelCarpetas` + helper `MenuContextualState` interno + 1 const `style` al final). Toda la logica de drag-drop, cut/paste, breadcrumb, glifos, menu contextual esta inline en el componente principal.
  - `ArbolOpd.tsx` (698 LOC, 1 componente principal). Render recursivo + handlers Ctrl+arrows + toggle nombres + menu contextual.
  - `InspectorEntidad.tsx` (665 LOC): 1 componente principal `InspectorEntidad` + 4 sub-componentes inline (`Segment`, `EstadosObjeto`, `PartesCompactas`, `DesplegarComo`). Las secciones nuevas de ronda 7 (Descripcion, Alias, Unidad, URLs, Layout, Designaciones, Duracion, Suprimir) estan inlineadas.
  - `InspectorEnlace.tsx` (715 LOC): 1 componente principal + 3 sub-componentes inline (`ColorPickerEnlace`, `SliderGrosor`, `SelectorPatron`). Las secciones (Multiplicidad, Estilo, Extremos, Reanclaje, Ruta, Abanico) estan inlineadas.
  - `PanelOpl.tsx` (515 LOC): 1 componente principal + helper `renderToken` + helper `textoVisibleToken` + helper `styleTokenMarkdown`. Bloques jerarquicos se procesan inline.

## 4. Archivos permitidos

```text
app/src/ui/PanelCarpetas.tsx                       EDIT — reducir a barrel < 350 LOC
app/src/ui/panelCarpetas/Tile.tsx                  NUEVO
app/src/ui/panelCarpetas/MenuContextual.tsx        NUEVO
app/src/ui/panelCarpetas/Breadcrumb.tsx            NUEVO
app/src/ui/panelCarpetas/handlersDragDrop.ts       NUEVO

app/src/ui/ArbolOpd.tsx                            EDIT — reducir a barrel < 300 LOC
app/src/ui/arbol/NodoOpd.tsx                       NUEVO
app/src/ui/arbol/handlersTeclado.ts                NUEVO
app/src/ui/arbol/togglesArbol.ts                   NUEVO

app/src/ui/InspectorEntidad.tsx                    EDIT — reducir a barrel < 300 LOC
app/src/ui/inspector/SeccionDescripcion.tsx        NUEVO
app/src/ui/inspector/SeccionAlias.tsx              NUEVO
app/src/ui/inspector/SeccionUrls.tsx               NUEVO
app/src/ui/inspector/SeccionLayoutEstados.tsx      NUEVO
app/src/ui/inspector/SeccionDesignaciones.tsx      NUEVO
app/src/ui/inspector/SeccionDuracion.tsx           NUEVO
app/src/ui/inspector/SeccionEsenciaAfiliacion.tsx  NUEVO
app/src/ui/inspector/SeccionRefinamiento.tsx       NUEVO

app/src/ui/InspectorEnlace.tsx                     EDIT — reducir a barrel < 300 LOC
app/src/ui/inspectorEnlace/SeccionMultiplicidad.tsx NUEVO
app/src/ui/inspectorEnlace/SeccionEstiloEnlace.tsx  NUEVO
app/src/ui/inspectorEnlace/SeccionExtremos.tsx     NUEVO
app/src/ui/inspectorEnlace/SeccionRuta.tsx         NUEVO
app/src/ui/inspectorEnlace/SeccionAbanico.tsx      NUEVO
app/src/ui/inspectorEnlace/SeccionReanclaje.tsx    NUEVO

app/src/ui/PanelOpl.tsx                            EDIT — reducir a barrel < 200 LOC
app/src/ui/panelOpl/RenderToken.tsx                NUEVO
app/src/ui/panelOpl/Bloques.tsx                    NUEVO

app/e2e/opm-smoke.spec.ts                          EDIT aditivo (solo si la particion altera selectores)
opm-extracted/**                                   LECTURA
docs/HANDOFF.md                                    LECTURA
/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/** LECTURA
```

NO tocar nada fuera de `ui/` (excepto e2e si cae). NO tocar `App.tsx`, `MenuPrincipal.tsx`, `Toolbar.tsx`, `ConfirmacionContext.tsx`, `Dialogo.tsx`, otros componentes UI < 500 LOC. NO tocar `tipos.ts`, `store.ts`, `proyeccion.ts`, ni nada en `modelo/`, `serializacion/`, `opl/` (excepto consumir lecturas que ya hace cada componente).

## 5. Restricciones de no-colision

- **No tocar `store.ts`** ni cualquier slice (territorio L1). Todos los sub-componentes consumen `useOpmStore<T>(selector)` desde `store.ts` (barrel intacto). Las acciones invocadas son las existentes.
- **No tocar `proyeccion.ts`** (territorio L2). Componentes UI no llaman a proyeccion directamente; solo consumen `useOpmStore`.
- **No tocar `serializacion/json.ts`** (territorio L3) ni `opl/generar.ts` (territorio L4). El `PanelOpl` consume `generarOplInteractivo` desde el barrel.
- **No tocar `vite.config.ts`** ni `package.json` (territorio L6). Si un sub-componente fuera grande candidato a lazy-load, se difiere a L6 (esta linea no introduce lazy imports).
- **No tocar `Dialogo.tsx`** (cierre ronda 7 con captura de Escape). Sub-componentes que abren dialogos siguen invocando `<Dialogo />` existente.
- **No tocar `atajosTeclado.ts`** (registry central ronda 7). Sub-componentes registran atajos via el registry existente con su contexto.
- **No tocar `MenuContextualArbol.tsx`** (existe ronda 7) — es **distinto** de `panelCarpetas/MenuContextual.tsx` que esta linea crea. El de panelCarpetas es para tiles de modelo/carpeta, no para nodos de arbol.
- **No tocar `ModalUrlsObjeto.tsx`** ni `ModalDuracionEstado.tsx`: sub-componentes de Inspector solo abren los modales existentes via store actions.
- **Preservar TODOS los `data-testid`** existentes. El smoke `opm-smoke.spec.ts` apunta a estos selectors. Si un selector debe cambiar, declarar en commit y actualizar el spec.
- **Preservar comportamiento de eventos**: orden de handlers, propagation, stopPropagation. Especialmente importante para `Dialogo` Escape capturado y `atajosTeclado` registry global.
- **Disciplina de selectores**: barrels/container pueden leer `modelo`, `indice`, `opdActivoId`, `seleccionados` y derivar props. Leaves prefieren props/callbacks. Un leaf puede usar `useOpmStore` solo para acciones estables o selector por id muy acotado (`s.modelo.entidades[entidadId]`), nunca para leer el modelo completo sin necesidad.
- **PanelCarpetas sigue prop-driven**: se usa como selector/navegador en dialogos de guardar/cargar; sus sub-componentes reciben `tile`, ruta, callbacks y estado de portapapeles por props. No mover ahi lecturas globales arbitrarias del store.
- **Sin atajos globales duplicados**: sub-componentes no registran atajos globales nuevos; los handlers TS puros se cablean desde el barrel al registry existente cuando corresponda.
- **No introducir librerias UI** (no Tailwind, no Mantine, no Radix). CSS inline + classes minimalistas con la convencion actual.
- **No introducir Preact context providers nuevos**. Sub-componentes reciben props desde el barrel (composicion explicita).

## 6. Slice minimo shippeable

### Patron canonico de sub-componente

```tsx
// app/src/ui/<dominio>/<Sub>.tsx
import type { /* tipos*/ } from "../../modelo/tipos";

interface <Sub>Props {
  // Props desde el barrel: datos ya seleccionados, IDs estables y callbacks.
  entidad?: Entidad;
  onAlgo?: () => void;
}

export function <Sub>(props: <Sub>Props) {
  // Estado local con `useState` si es transitorio
  // No leer el store completo aqui. Si hace falta una accion, pasala como prop
  // desde el barrel o usa un selector por id estrictamente acotado.

  return (
    <div data-testid="<sub>-section">
      {/* ... */}
    </div>
  );
}
```

### A. PanelCarpetas

#### `panelCarpetas/Tile.tsx` (objetivo < 200 LOC)

Render de un tile (carpeta o modelo) con:
- Icono (carpeta o documento).
- Nombre + descripcion truncada.
- Glifos: archivado (icono cesta), version (icono diff).
- Indicador "cortado" si esta en portapapeles.
- Click handler para navegar / abrir modelo.
- Hover muestra menu contextual (delegado a `MenuContextual`).

Props: `tile: { tipo: "carpeta" | "modelo"; id: Id; nombre: string; ... }` + handlers callback.

#### `panelCarpetas/MenuContextual.tsx` (objetivo < 200 LOC)

Menu contextual con items condicionales:
- Renombrar.
- Eliminar.
- Cortar / Pegar (segun estado portapapeles).
- Mover a... (abre selector).
- Archivar / Restaurar.
- Versiones (solo si modelo).
- Abrir en pestana (si L3 mergeo en alguna ronda futura — link estable).

Props: `tile: TileData` + callbacks por accion. Estado local: `posicion: { x, y } | null`.

#### `panelCarpetas/Breadcrumb.tsx` (objetivo < 100 LOC)

Render de la ruta actual: `Home / SubCarpeta / SubSubCarpeta`. Click en un nivel navega.

Props: `rutaActual: Id[]` + `onNavegarA(carpetaId: Id)`.

#### `panelCarpetas/handlersDragDrop.ts` (objetivo < 200 LOC)

Modulo TS (no componente) con handlers HTML5 nativos:
- `onDragStart(tile, event)`.
- `onDragOver(tile, event)`.
- `onDrop(tileSource, tileDestino, action)` — `action: "mover" | "copiar"`.
- `onDragEnd`.

Exporta funciones puras + `useDragDropCarpetas(...)` hook si es facil de aislar.

#### `PanelCarpetas.tsx` (barrel, objetivo < 350 LOC)

Componente principal con:
- Lectura del store (`indice`, `carpetaActualId`, `portapapelesWorkspace`) en el barrel solamente.
- Estado local minimo: layout (tiles vs lista).
- Composicion: `<Breadcrumb />` arriba, grid de `<Tile />`, `<MenuContextual />` overlay.
- Handlers de drag-drop importados de `handlersDragDrop.ts`.

### B. ArbolOpd

#### `arbol/NodoOpd.tsx` (objetivo < 200 LOC)

Render recursivo de un nodo:
- Icono colapsar (chevron) si tiene hijos.
- Nombre del OPD (o `SDn` si toggle ocultar nombres activo).
- Indentacion segun profundidad.
- Click navega; doble click renombra.
- Hover muestra glifos.

Props: `nodo: { id: Id; nombre: string; hijos: NodoOpd[] }` + `nivel: number`.

#### `arbol/handlersTeclado.ts` (objetivo < 100 LOC)

Modulo TS con handlers Ctrl+arrows, Enter, Backspace, F2.
- `onCtrlArrow(direccion)`: navega up/down/left/right en arbol.
- `onEnter(nodoFocoId)`: abre nodo.
- `onBackspace`: vuelve al padre.
- `onF2`: renombra.

Hook: `useArbolTeclado(...)`.

#### `arbol/togglesArbol.ts` (objetivo < 80 LOC)

Toggles del arbol:
- `expandirTodo()` — expande todos los nodos.
- `colapsarTodo()`.
- `toggleOcultarNombres()` — alterna entre nombres y `SDn`.

Funciones puras que reciben/retornan estado del store.

#### `ArbolOpd.tsx` (barrel, objetivo < 300 LOC)

Componente principal con:
- Lectura del store (`opds`, `opdActivoId`, `colapsados`, `nombresArbolVisibles`).
- Render recursivo via `<NodoOpd />`.
- Listeners de teclado registrados via `atajosTeclado.ts` con contexto `panel-arbol`.
- Toggles desde `togglesArbol.ts`.

### C. InspectorEntidad

#### `inspector/SeccionEsenciaAfiliacion.tsx` (objetivo < 100 LOC)

Toggles esencia + afiliacion. Props: `entidadId: Id`.

#### `inspector/SeccionDescripcion.tsx` (objetivo < 150 LOC)

Textarea (max 1000) + checkbox "Mostrar mas detalles" (expande a 5000). Save on blur.

#### `inspector/SeccionAlias.tsx` (objetivo < 100 LOC)

Input alias + boton "Aplicar" + validacion.

#### `inspector/SeccionUrls.tsx` (objetivo < 120 LOC)

Lista compacta de URLs (max 3 visibles) + boton "Gestionar URLs..." (abre `ModalUrlsObjeto`).

#### `inspector/SeccionLayoutEstados.tsx` (objetivo < 80 LOC)

Toggle horizontal/vertical (visible solo si entidad tiene >=2 estados).

#### `inspector/SeccionDesignaciones.tsx` (objetivo < 150 LOC)

Checkboxes Inicial / Final / Default / Current con validaciones (Default-Current excluyentes).

#### `inspector/SeccionDuracion.tsx` (objetivo < 80 LOC)

Boton "Configurar duracion..." (abre `ModalDuracion`) + resumen actual (`min, nom, max [unit]`).

#### `inspector/SeccionRefinamiento.tsx` (objetivo < 120 LOC)

Botones "Descomponer", "Desplegar como..." con dropdown (agregacion/exhibicion/generalizacion/clasificacion).

#### `InspectorEntidad.tsx` (barrel, objetivo < 300 LOC)

Componente principal con:
- Lectura del store (`entidad: Entidad | null`).
- Composicion ordenada de secciones segun tipo de entidad y estado:
  - Si entidad es objeto: Esencia, Afiliacion, Descripcion, Alias, Unidad (textbox simple inline), URLs, Estados (sub-comp `EstadosObjeto` que ya existe inline — promover a `inspector/EstadosObjeto.tsx`), LayoutEstados, Refinamiento.
  - Si entidad es proceso: Esencia, Afiliacion, Descripcion, Alias, Unidad, URLs, Refinamiento (descomponer).
  - Si entidad es estado: Designaciones, Duracion, Suprimir, Descripcion, Alias.
- Slot estable `data-testid="inspector-entidad-acciones"` para batch styling (heredado ronda 7).

Selector discipline: el barrel calcula `entidad`, `estados`, acciones y flags principales. Secciones reciben entidades/callbacks por props. Excepcion permitida: una seccion con `entidadId` puede leer un campo acotado si eso evita pasar una subestructura muy dinamica; documentar esa decision en commit.

### D. InspectorEnlace

#### `inspectorEnlace/SeccionMultiplicidad.tsx` (objetivo < 150 LOC)

Inputs multiplicidad origen + destino con validacion canonica `["1", "0..1", "N", "0..N", "*"]` + custom regex.

#### `inspectorEnlace/SeccionEstiloEnlace.tsx` (objetivo < 200 LOC)

ColorPicker + sliders grosor + dashArray + boton "Aplicar a seleccion" (toggle batch).

#### `inspectorEnlace/SeccionExtremos.tsx` (objetivo < 150 LOC)

Render extremos con dropdown reanclaje (entidad o estado) — solo enlaces externos derivados.

#### `inspectorEnlace/SeccionRuta.tsx` (objetivo < 120 LOC)

Input etiqueta de ruta + tabla de rutas existentes en el modelo.

#### `inspectorEnlace/SeccionAbanico.tsx` (objetivo < 150 LOC)

Dropdown operador OR/XOR + lista enlaces agrupados (lectura del modelo).

#### `inspectorEnlace/SeccionReanclaje.tsx` (objetivo < 100 LOC)

Panel reanclaje para enlaces externos derivados (manual / automatico).

#### `InspectorEnlace.tsx` (barrel, objetivo < 300 LOC)

Componente principal con:
- Lectura del store (`enlace: Enlace | null`).
- Composicion ordenada de secciones segun tipo de enlace:
  - Multiplicidad (siempre).
  - Estilo (siempre).
  - Extremos (si externo derivado).
  - Reanclaje (si externo derivado).
  - Ruta (si tipo procedural con ruta).
  - Abanico (si pertenece a abanico).

Selector discipline: mismo criterio que InspectorEntidad. No pasar de un monolito TSX a 6 sub-componentes que todos leen `s.modelo` completo.

### E. PanelOpl

#### `panelOpl/RenderToken.tsx` (objetivo < 150 LOC)

Render de un token OPL (texto + ref + hint) con hover. Props: `token: OplToken`.
Absorbe `renderToken`, `textoVisibleToken`, `styleTokenMarkdown` actuales.

#### `panelOpl/Bloques.tsx` (objetivo < 150 LOC)

Render de bloques jerarquicos por OPD con chevrons. Consume `bloquesJerarquicos.ts` (existe ronda 7).

#### `PanelOpl.tsx` (barrel, objetivo < 200 LOC)

Componente principal con:
- Lectura del store (`modelo`, `opdActivoId`, `filtroOplPorSeleccion`, `seleccionados`, `hoverOplRef`, `busquedaOpl`).
- Llama `generarOplInteractivo(modelo, opdActivoId)` y agrupa por OPD via `agruparPorOpd`.
- Filtro por seleccion y por busqueda.
- Composicion: toolbar superior (busqueda, expandir todo, etc.) + `<Bloques />` + footer.

## 7. Tests obligatorios

- Smoke browser (40 actuales) deben pasar **sin tocar**. Si un selector cambia, actualizar el spec con el nuevo selector y declarar en commit.
- Preservar foco y propagacion: clicks en menus/contextuales, drag-drop, Escape en Dialogo y atajos del arbol deben comportarse igual. Agregar smoke aditivo solo si la particion hace visible un flujo no cubierto; no cambiar selectors existentes para acomodar el refactor.
- Unit test de cada sub-componente NO es obligatorio (UI); en su lugar, smoke browser cubre. Sin embargo, sub-componentes con logica calculatoria (ej. `handlersDragDrop.ts`, `togglesArbol.ts`, `handlersTeclado.ts`) que son TS puros DEBEN tener test unitario:
  - `panelCarpetas/handlersDragDrop.test.ts`: drag de carpeta sobre carpeta destino retorna accion `mover`; drag con Ctrl retorna `copiar`.
  - `arbol/togglesArbol.test.ts`: `expandirTodo` deja set `colapsados` vacio.
  - `arbol/handlersTeclado.test.ts`: `onCtrlArrow("down")` mueve el foco al siguiente nodo en orden.
- Verificacion visual: `bun run dev` y comparar con captura previa para asegurarse que la UI luce identica.

## 8. Verificacion

```bash
cd app
bun run check          # 481 + nuevos tests de modulos TS
bun run browser:smoke  # 40 actuales — DEBEN pasar
bun run build          # bundle (objetivo: igual o menor; chunk JointJS lo separa L6)
```

Verificacion adicional:

```bash
cd /home/felix/projects/deep-opm-pro
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
# detector >= 45 sin caida (la mayoria de reglas no apuntan a UI)
```

## 9. Decisiones bloqueadas (no reabrir)

- **Comportamiento UI invariante**: cada sub-componente debe lucir y comportarse identico al actual. Si la particion introduce diff visual, es bug.
- **`data-testid` preservados**: cada testid existente sigue presente en el sub-componente correspondiente. Smokes no se rompen.
- **Acciones del store invocadas**: cada sub-componente invoca las MISMAS acciones que el componente original. NO renombrar acciones.
- **Composicion de Inspector segun tipo**: la logica de "mostrar seccion solo si aplica" se preserva exactamente (objeto vs proceso vs estado).
- **Modal URL y Modal Duracion**: NO se tocan; sub-componentes solo invocan `abrirModalUrls(entidadId)` y `abrirModalDuracion(estadoId)` del store.
- **Registry de atajos**: sub-componentes que registran atajos lo hacen via `atajosTeclado.ts` con contexto correcto (`panel-arbol`, `panel-carpetas`, `inspector`, etc.).
- **Captura de Escape en dialogos**: NO tocar `Dialogo.tsx` (cierre ronda 7). Sub-componentes que abren dialogos siguen invocando `<Dialogo />` existente.
- **CSS inline + classes minimalistas**: NO introducir libreria CSS-in-JS ni Tailwind. Estilos siguen el patron actual (`const style = { ... }`).
- **Slot estable `data-testid="inspector-entidad-acciones"`**: heredado ronda 7; sigue donde esta.
- **Halo de seleccion azul `#3DA8FF`** en multi-seleccion: NO se altera.
- **Selector discipline**: no pasar de componentes monoliticos a sub-componentes con dependencias globales invisibles. Barrels leen amplio; leaves reciben props/callbacks o selector por id acotado.

## 10. Decisiones que tomas vos (documentar en commit)

- **Si `EstadosObjeto`** (sub-componente inline en `InspectorEntidad.tsx` actual) se promueve a `inspector/EstadosObjeto.tsx` o queda inline en barrel. Recomendado: promover a archivo propio (es > 120 LOC, merece sub-componente).
- **Si `PartesCompactas`** (sub-componente inline) se promueve. Recomendado: promover si > 80 LOC.
- **Si `DesplegarComo`** (selector dropdown) se incluye en `SeccionRefinamiento.tsx` o queda como sub-componente propio `inspector/DesplegarComo.tsx`. Recomendado: incluir en `SeccionRefinamiento.tsx` (es helper interno).
- **Si `Segment`** (componente helper interno actual de `InspectorEntidad`) se promueve a `ui/comun/Segment.tsx` o queda inline en barrel. Recomendado: promover a `ui/comun/Segment.tsx` para reuso (probablemente lo necesite Inspector de Enlace tambien).
- **Si los sub-componentes de Inspector exponen `data-testid` propio** (ej. `inspector-seccion-alias`) o solo el barrel los expone. Recomendado: ambos — barrel testid coarse + sub-componente testid fine.
- **Si los sub-componentes de Inspector reciben props o leen por id**. Recomendado actualizado: props/callbacks desde el barrel por defecto; selector por id solo cuando evita prop drilling real y esta acotado a un campo. Nunca leer `s.modelo` completo en leaves. `PanelCarpetas` debe permanecer prop-driven.
- **Si los handlers TS modules (`handlersDragDrop`, `handlersTeclado`)** son hooks Preact (`useDragDropCarpetas`) o funciones puras + integracion via `useEffect`. Recomendado: funciones puras + un solo hook por dominio que las cablea. Mas testeable.
- **Si `panelOpl/Bloques.tsx`** consume `bloquesJerarquicos.ts` (existe) directamente o el barrel `PanelOpl.tsx` orquesta. Recomendado: consumo directo desde `Bloques.tsx` (mas autocontenido).
- **Smoke browser**: si la particion altera selectores. Recomendado: NO alterar; preservar todos los `data-testid` actuales. Si es inevitable, actualizar `opm-smoke.spec.ts` con minimum diff y declarar en commit.

## 11. Forma del entregable

Commits sugeridos (uno por dominio principal + barrel + tests):

- `refactor(ui): extrae Tile MenuContextual Breadcrumb y handlers drag drop de PanelCarpetas`
- `refactor(ui): reduce PanelCarpetas.tsx a barrel componente`
- `refactor(ui): extrae NodoOpd y handlers teclado y toggles de ArbolOpd`
- `refactor(ui): reduce ArbolOpd.tsx a barrel componente`
- `refactor(ui): extrae secciones del Inspector de entidad por dominio (esencia descripcion alias urls layout designaciones duracion refinamiento)`
- `refactor(ui): reduce InspectorEntidad.tsx a barrel componente`
- `refactor(ui): extrae secciones del Inspector de enlace (multiplicidad estilo extremos ruta abanico reanclaje)`
- `refactor(ui): reduce InspectorEnlace.tsx a barrel componente`
- `refactor(ui): extrae RenderToken y Bloques de PanelOpl`
- `refactor(ui): reduce PanelOpl.tsx a barrel componente`
- `test(ui): cubre handlers drag-drop carpetas, teclado arbol, toggles arbol`

Co-author footer estandar si aplica.

NO tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`. Reportar:

- Hashes de commits.
- LOC final de cada barrel (objetivos: PanelCarpetas <350, ArbolOpd <300, InspectorEntidad <300, InspectorEnlace <300, PanelOpl <200).
- LOC de cada sub-componente.
- Resultado de `bun run check`, `browser:smoke`, `build`.
- Resultado del detector (debe ser >= 45 sin caida — UI no afecta detector mucho).
- Decisiones tomadas en §10.
- Smokes que se hayan tenido que actualizar (si alguno) — NO debe haber.
- Bloqueos.

Si descubris bug fuera de scope (ej. selector que no estaba documentado), entregar como patch a `/tmp/` y NO commitear.
