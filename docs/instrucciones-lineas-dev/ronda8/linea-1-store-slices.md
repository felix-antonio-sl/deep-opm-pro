# Linea 1 — Slices del store por dominio

## 1. Mision

Romper el monolito `app/src/store.ts` (**4006 LOC**) en slices de Zustand por dominio canonico, conservando la API publica exacta del store (firmas de acciones, nombres de campos, selectores derivados) via barrel re-export. La forma OPCloud para este problema es **un servicio por dominio** (`ModelService` 190 LOC, `ContextService` 1037 LOC, `GraphService` 1943 LOC, `OplService`, `TreeViewService`, `StorageService`); destilamos ese patron a Zustand 5 con `createStore<UnionDeSlices>` y composicion explicita. Cada slice es una funcion `(set, get) => ({...estadoLocal, ...accionesLocales})` y se compone en un solo `createStore` que retorna el union.

Cierre arquitectural: `store.ts` queda como **barrel agregador** (objetivo: < 500 LOC; tope absoluto: < 1500 LOC); todo el codigo nuevo vive en `app/src/store/<dominio>.ts`. Las 18 reglas del detector que apuntan a `store.ts` siguen matcheando porque el barrel re-exporta las mismas firmas y porque el contenido del barrel sigue conteniendo los strings clave (cumple via re-export evaluable con regex tolerante).

**Slice minimo entregable**:

- 9 slices nuevos en `app/src/store/`:
  - `modelo.ts`: `modelo`, `opdActivoId`, `commitModelo`, `deshacer`, `rehacer`, `historialUndo`, `historialRedo`, `puedeDeshacer`, `puedeRehacer`, `dirty`, `snapshotGuardado`, `mensaje`.
  - `seleccion.ts`: `seleccionId`, `seleccionados`, `modoSeleccion`, `enlaceSeleccionId`, `portapapelesVisual`, todas las acciones de seleccion + batch (consume helpers ya existentes en `canvas/seleccionMultiple.ts` y `canvas/operacionesBatch.ts`).
  - `enlaces.ts`: `modoEnlace`, `modoCreacion`, `enlaceEstiloPortapapeles`, `tablaEnlacesAbierta`, `tablaEnlacesFiltroTipo`, `tablaEnlacesOrdenColumna`, `tablaEnlacesOrdenDireccion`, acciones de enlace (`abrirModoEnlace`, `cerrarModoEnlace`, `aplicarEstiloEnlace`, etc.).
  - `workspaceMod.ts` (workspace + indice): `indice: WorkspaceIndice`, `carpetaActualId`, `modelosRecientes`, acciones de archivado, version, busqueda global (`crearVersion`, `archivarModelo`, `restaurarModelo`, `archivarCarpeta`, `restaurarCarpeta`).
  - `carpetas.ts`: `dialogoBuscarGlobalAbierto`, `dialogoVersionesAbierto`, `dialogoArchivadosAbierto`, `portapapelesWorkspace`, busqueda global state (`busquedaGlobalEstado`), acciones de mover modelos/carpetas, cut/paste con caducidad 5min.
  - `uiPanel.ts` (UI flags y dialogos): `menuPrincipalAbierto`, `dialogoGuardarComoAbierto`, `dialogoCargarModeloAbierto`, `uiAliasVisibles`, `uiDescripcionesVisibles`, `modalUrlsAbierto`, `modalDuracionAbierto`, `filtroOplPorSeleccion`, `hoverOplRef`, `busquedaOpl`, toggles cross-cutting.
  - `mapa.ts`: `vistaMapaActiva`, `descriptorMapaCache`, `mapaFiltros`, `mapaResaltado`, `mapaMarcadores`, `mapaAutoRefresh`, acciones de mapa (`fijarFiltroProfundidad`, `fijarFiltroSubarbol`, `fijarCriterioResaltado`, `refrescarMapa`, `exportarMapa`).
  - `persistencia.ts`: `modelosGuardados`, `modeloPersistidoId`, `descripcionModeloLocal`, acciones `guardarLocal`, `cargarLocal`, `borrarLocal`, `actualizarMetadataLocal`, `listarLocales`.
  - `pestanas.ts` (ya existe — solo absorbe; reorganiza imports si necesario).
- 2 modulos de soporte obligatorios:
  - `tipos.ts`: define y exporta `OpmStore` como union publica de slices, mas tipos auxiliares estrictamente store-locales. No reemplaza ni toca `app/src/tipos.ts`.
  - `runtime.ts`: encapsula los singletons actuales del modulo `store.ts` (`UNDO_LIMIT`, `snapshotGuardado`, `undoStack`, `redoStack`, control de autosalvado, helpers de dirty/commit/reset). Mantiene semantica singleton: un store activo, un runtime de undo/redo/autosalvado, sin duplicar stacks en varios slices.
- Barrel `store.ts` que importa los 9 slices y los compone en un unico `createStore<OpmStore>`. Mantiene `useOpmStore<T>(selector)` y `store` exportados sin cambios.
- `store.test.ts` preservado intacto (no reescribir tests existentes); agregar `app/src/store/<slice>.test.ts` por slice nuevo cubriendo APIs criticas del slice (al menos 1 test por slice nuevo).

**Fuera de slice**: el comportamiento del modelo (operaciones de `modelo/operaciones.ts`) NO se toca; los slices solo reorganizan estado UI y wiring de acciones. Cualquier cambio en `modelo/*.ts` queda fuera (operaciones.ts congelado).

## 2. Deudas que cierra

| Deuda | Path absoluto | Aporte |
|---|---|---|
| Monolito `store.ts` | `/home/felix/projects/deep-opm-pro/app/src/store.ts` (4006 LOC) | Reduce a < 500 LOC en barrel; 9 slices < 600 LOC c/u. |
| 18 reglas del detector apuntando a `store.ts` | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/tools/progress-dashboard.mjs:382-...` | Barrel preserva strings que las reglas matchean; ninguna regla cae. L6 cierra el ledger con reglas nuevas para slices. |
| HANDOFF "deuda tecnica `app/src/store.ts` ~3700 LOC" | `/home/felix/projects/deep-opm-pro/docs/HANDOFF.md §Pendientes Inmediatos` | Cierra el item explicito; la carpeta `app/src/store/` ya existe parcialmente (con `pestanas.ts`) y se completa. |

## 3. Anclaje a evidencia

- **SSOT**: este refactor no toca semantica OPM; no se cita SSOT como base. La validacion semantica vive en `modelo/*.ts` y permanece intacta. Se citan implicitamente las decisiones de `docs/HANDOFF.md §Decisiones Vigentes` (multi-seleccion canonica, multi-pestana sesion-only, mapa = vista derivada, etc.) que esta linea preserva.
- **Corpus interno reusable**:
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/modules/app/model.service.ts:5-190` — `ModelService` con dependencias inyectadas (`graph`, `tree`, `opl`) y un solo metodo orchestrador `set(model, displayName, id, opt)`. Patron canonico de **slice de modelo activo** con dependencias declaradas. Lo destilamos como `store/modelo.ts` con la misma responsabilidad: modelo activo + commit/undo/redo + dirty + mensaje.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/modules/app/context.service.ts:5-130` — `ContextService` orquestador de tabs + save + permissions + sync. Cada accion (`replaceContext`, `replaceContextByTab`, `save`, `updateLocalPermissionsAfterChange`) es atomica y delega a colaboradores. Lo destilamos en `store/workspaceMod.ts` (estado de archivado + versiones + indice) y `store/persistencia.ts` (estado de modelos guardados).
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/modules/app/tabsService.ts:5-130` — `TabsManager` con `dropTab`, `replaceContextByTab`, `closeTab`, `refreshTab`. Solo 130 LOC para todo el dominio de pestanas. Confirmacion empirica: 130 LOC alcanza para multi-pestana. Nuestro `store/pestanas.ts` actual ya esta en linea con esto y no necesita cambio; esta linea solo reorganiza imports si el barrel lo requiere.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/rappid-components/services/init-rappid.service.ts:5-80` — `InitRappidService` con constructor que recibe 8 dependencias y un campo `cell$` que es `BehaviorSubject`. Patron de **agregador con dependencias declaradas**. Lo destilamos en el barrel `store.ts`: el `createStore<OpmStore>` actual recibe los 9 slices via funciones; el orden de mounting es explicito.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/configuration/rappidEnviromentFunctionality/selectionConfiguration.ts:5-65` — `selectionConfiguration` como objeto literal con 4 metodos (`blankPointerdown`, `cellPointerdown`, `selectionBoxPointerdown`, `selectionBoxPointerup`). Confirma que la seleccion como dominio merece archivo aparte. Nuestro `store/seleccion.ts` y los helpers `canvas/seleccionMultiple.ts` ya creados ronda 7 quedan en linea.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/REFACTOR-NOTES.md:13-25` — explicacion de que OPCloud paso por webcrack divide bundles por path semantico. Justifica que el codigo `app/` se beneficie de la misma division (slices por dominio).
- **Estado actual del codigo (post-ronda 7)**:
  - `app/src/store.ts` (4006 LOC): un solo `createStore<OpmStore>((set, get) => ({...}))` con interface `OpmStore` que tiene ~250 campos y acciones mezclados. Importa de 30+ modulos. La unica seccion explicita es `// ── Persistencia del WorkspaceIndice ──` en linea 3850.
  - `app/src/store/pestanas.ts` (existe ronda 7, ~280 LOC) con `crearPestanaNueva`, `abrirPestana`, `cerrarPestana`, `cambiarActiva`, `reordenarPestanas`, `clonarModelo`. Patron a replicar en los 8 slices nuevos: cada archivo exporta funciones puras que reciben el subset del store que necesitan + `set/get` slices del store global, no clases.
  - `app/src/canvas/seleccionMultiple.ts` (151 LOC) y `app/src/canvas/operacionesBatch.ts` (existe ronda 7) ya tienen logica pura de seleccion; `store/seleccion.ts` solo cablea a state Zustand.
  - `app/src/persistencia/{local,workspace,movimientoModelos,versiones,autosalvado}.ts` ya tienen funciones puras; los slices `persistencia.ts` y `workspaceMod.ts` son solo cableado.
  - `app/src/store.test.ts` (1577 LOC): tests de integracion del store completo. Tras la particion debe pasar **sin reescribir** (la API publica del store no cambia).

## 4. Archivos permitidos

```text
app/src/store.ts                                EDIT — reducir a barrel < 500 LOC (objetivo) / < 1500 LOC (tope)
app/src/store/tipos.ts                          NUEVO — union OpmStore + tipos store-locales
app/src/store/runtime.ts                        NUEVO — singletons undo/redo/dirty/autosalvado
app/src/store/runtime.test.ts                   NUEVO opcional si la logica dirty/undo queda aislada
app/src/store/modelo.ts                         NUEVO
app/src/store/modelo.test.ts                    NUEVO
app/src/store/seleccion.ts                      NUEVO
app/src/store/seleccion.test.ts                 NUEVO
app/src/store/enlaces.ts                        NUEVO
app/src/store/enlaces.test.ts                   NUEVO
app/src/store/workspaceMod.ts                   NUEVO
app/src/store/workspaceMod.test.ts              NUEVO
app/src/store/carpetas.ts                       NUEVO
app/src/store/carpetas.test.ts                  NUEVO
app/src/store/uiPanel.ts                        NUEVO
app/src/store/uiPanel.test.ts                   NUEVO
app/src/store/mapa.ts                           NUEVO
app/src/store/mapa.test.ts                      NUEVO
app/src/store/persistencia.ts                   NUEVO
app/src/store/persistencia.test.ts              NUEVO
app/src/store/pestanas.ts                       LECTURA o EDIT minimo (solo reorganizar imports si es necesario)
app/src/store.test.ts                           LECTURA (preservar intacto)
opm-extracted/**                                LECTURA
docs/HANDOFF.md                                 LECTURA (no editar)
/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/** LECTURA
```

NO tocar nada en `modelo/`, `render/`, `serializacion/`, `opl/`, `ui/`, `persistencia/`, `canvas/`. NO tocar `app/src/tipos.ts` (queda intacto). `app/src/store/tipos.ts` y `app/src/store/runtime.ts` son parte del scope L1. `runtime.ts` puede importar helpers existentes de `persistencia/autosalvado.ts` o `serializacion/json.ts` via barrels, pero no editar esos modulos. NO tocar `vite.config.ts`.

## 5. Restricciones de no-colision

- **No tocar `proyeccion.ts`** (territorio L2). Si esta linea descubre que un slice consume helpers de proyeccion que faltan en el barrel L2, espera al merge de L2 antes de cablear (orden sugerido: L2 antes de L1).
- **No tocar `serializacion/json.ts`** (territorio L3). Los slices `persistencia.ts` y `workspaceMod.ts` consumen `exportarModelo` y `hidratarModelo` desde `serializacion/json.ts` (barrel L3) sin cambios de firma.
- **No tocar `opl/generar.ts`** (territorio L4). Si un slice (probable: `uiPanel.ts` para `busquedaOpl`) consume `generarOplInteractivo`, lo importa de `opl/generar.ts` (barrel L4) sin cambios.
- **No tocar UI** (territorio L5). Los componentes UI seguiran consumiendo `useOpmStore<T>(selector)` desde `store.ts` (barrel intacto). El refactor del store DEBE ser invisible a la UI; ningun import de UI puede romper.
- **No tocar `vite.config.ts` ni `package.json` ni `main.tsx`** (territorio L6). El refactor solo reorganiza source code, no build.
- **No tocar `modelo/operaciones.ts`** (1743 LOC, congelado). El slice `modelo.ts` solo cablea las llamadas existentes; NO reorganiza las operaciones.
- **No tocar `app/src/canvas/`** ni `app/src/render/jointjs/abanicoOverlay.ts` ni `abanicoDragSync.ts` (helpers ya estables).
- **No tocar `app/src/persistencia/*`** salvo si una linea del slice `persistencia.ts` necesita un import nuevo (poco probable; los slices solo cablea a las funciones puras existentes).
- **No introducir libreria nueva**. Zustand 5 alcanza para slices. No usar `zustand/middleware` (lo evita; preserva API minima).
- **No tocar `docs/HANDOFF.md`, `docs/historias-usuario-v2/`, `docs/instrucciones-lineas-dev/ronda1..7/`**.
- **No introducir validaciones, helpers de modelo, ni operaciones nuevas**. Cualquier cosa que no sea estado/accion del store se mantiene fuera.

## 6. Slice minimo shippeable

### Patron canonico de slice

```ts
// app/src/store/<dominio>.ts
import type { StateCreator } from "zustand";
import type { OpmStore } from "./tipos";
import type { Id, Modelo /*, ...tipos del dominio*/ } from "../modelo/tipos";

export interface <Dominio>Slice {
  // Estado
  campo1: Tipo1;
  campo2: Tipo2;
  // Acciones
  accion1(arg: T): void;
  accion2(): void;
}

export const create<Dominio>Slice: StateCreator<OpmStore, [], [], <Dominio>Slice> = (set, get) => ({
  campo1: valorInicial1,
  campo2: valorInicial2,
  accion1(arg) {
    set((state) => ({ ...state, campo1: nuevoValor }));
  },
  accion2() {
    const helper = get().algunHelperDeOtroSlice;
    set({ /* ... */ });
  },
});
```

`OpmStore` vive en `store/tipos.ts` como union (suma de todos los slices); cada slice declara solo SU subset, pero `set/get` operan sobre el store completo (para acceder a otros slices cuando es necesario). Ningun slice importa desde `../store` ni desde `store.ts`: eso crearia ciclo. Las dependencias cross-slice se leen via `get()` y las dependencias de runtime via `store/runtime.ts`.

### `store/modelo.ts`

Estado:
- `modelo: Modelo` — modelo activo (espejo de la pestana activa).
- `opdActivoId: Id`.
- `historialUndo: Modelo[]` — stack ronda 6 (UNDO_LIMIT=100, ya existe en store.ts ~linea 540).
- `historialRedo: Modelo[]`.
- `dirty: boolean` — derivado: `exportarModelo(modelo) !== snapshotGuardado`.
- `snapshotGuardado: string | null`.
- `mensaje: string | null` — mensajes transitorios.
- `puedeDeshacer: boolean`, `puedeRehacer: boolean`.

Acciones:
- `commitModelo(nuevoModelo: Modelo, descripcion: string)`: empuja al stack, vacia redo, recalcula dirty.
- `deshacer()`, `rehacer()` — usar UNDO_LIMIT.
- `marcarGuardado(snapshotJson: string)`.
- `fijarMensaje(texto: string | null)`.
- `marcarOpdActivo(id: Id)`.

Implementacion: la logica de dirty/undo/redo/autosalvado se centraliza en `store/runtime.ts`. El slice `modelo.ts` expone los campos publicos heredados para compatibilidad, pero NO mantiene una segunda copia independiente de `undoStack`/`redoStack`/`snapshotGuardado`. Si el estado publico necesita reflejar esos valores, se actualiza desde el runtime en un unico punto de commit/reset.

Tests `modelo.test.ts`:
- `commitModelo` con stack vacio agrega entry y limpia redo.
- `deshacer` con stack > 0 retorna estado anterior.
- `rehacer` tras deshacer recupera el estado.
- `marcarGuardado` marca dirty=false; modificar luego marca dirty=true.
- UNDO_LIMIT=100: agregar 101 commits descarta el primero.

### `store/seleccion.ts`

Estado:
- `seleccionId: Id | null` — derivado de `seleccionados.length === 1 ? seleccionados[0] : null` (compatibilidad rondas 1-6).
- `seleccionados: Id[]`.
- `modoSeleccion: ModoSeleccion`.
- `enlaceSeleccionId: Id | null`.
- `portapapelesVisual: UiPortapapelesVisual | null`.

Acciones:
- `setSeleccion`, `agregarASeleccion`, `quitarDeSeleccion`, `toggleSeleccion`, `vaciarSeleccion`, `seleccionarTodoEnOpd`.
- `eliminarSeleccion`, `nudgeSeleccion(dx, dy)`, `alinearSeleccionEnlaces(direccion)`, `conectarSeleccionAlTodo(todoId, tipo)`, `aplicarEstiloASeleccion(estilo)`.
- `copiarSeleccionAlBuffer`, `pegarBufferEnOpdActivo`.

Implementacion: los handlers consumen `canvas/seleccionMultiple.ts` y `canvas/operacionesBatch.ts` (helpers puros existentes). Cada accion que muta el modelo invoca `commitModelo` del slice modelo.

Tests `seleccion.test.ts`:
- `setSeleccion([a, b])` deja `seleccionados.length === 2`, `seleccionId === null`.
- `vaciarSeleccion` deja `seleccionados === []`.
- `eliminarSeleccion` con 3 ids reduce el modelo y queda como un solo undo entry.

### `store/enlaces.ts`

Estado:
- `modoEnlace: ModoEnlace | null`.
- `modoCreacion: TipoEntidad | null`.
- `enlaceEstiloPortapapeles: EnlaceEstilo | null`.
- `tablaEnlacesAbierta: boolean`.
- `tablaEnlacesFiltroTipo: TipoEnlace | "todos"`.
- `tablaEnlacesOrdenColumna: string | null`.
- `tablaEnlacesOrdenDireccion: "asc" | "desc"`.

Acciones:
- `abrirModoEnlace(tipo, origenId)`, `cerrarModoEnlace`.
- `abrirModoCreacionTipo(tipo)`, `cerrarModoCreacion`.
- `abrirTablaEnlaces`, `cerrarTablaEnlaces`, `fijarFiltroEnlaces`, `fijarOrdenEnlaces`.
- `copiarEstiloEnlaceAlBuffer(estilo)`, `pegarEstiloEnlaceDesdeBuffer(enlaceId)`.

Tests: cada accion abre/cierra correctamente; los flags son disjuntos.

### `store/workspaceMod.ts`

Estado:
- `indice: WorkspaceIndice`.
- `carpetaActualId: Id | null`.
- `modelosRecientes: ResumenModeloPersistido[]`.

Acciones: `crearCarpeta`, `renombrarCarpeta`, `eliminarCarpeta`, `archivarModelo`, `archivarCarpeta`, `restaurarModelo`, `restaurarCarpeta`, `crearVersion`, `restaurarVersion`, `eliminarVersion`, `recargarRecientes`.

### `store/carpetas.ts`

Estado: dialogos workspace + portapapeles cut/paste + busqueda global state.
- `dialogoBuscarGlobalAbierto: boolean`.
- `dialogoVersionesAbierto: boolean`.
- `dialogoArchivadosAbierto: boolean`.
- `portapapelesWorkspace: PortapapelesWorkspace | null` (caducidad 5min ya en helper).
- `busquedaGlobalEstado: BusquedaGlobalEstado`.

Acciones: abrir/cerrar dialogos; iniciar/cancelar busqueda global; cortar/pegar carpeta o modelo.

### `store/uiPanel.ts`

Estado: flags UI cross-cutting (no encajan en slices de dominio).
- `menuPrincipalAbierto: boolean`.
- `dialogoGuardarComoAbierto: boolean`.
- `dialogoCargarModeloAbierto: boolean`.
- `uiAliasVisibles: boolean`, `uiDescripcionesVisibles: boolean`.
- `modalUrlsAbierto: Id | null`, `modalDuracionAbierto: Id | null`.
- `filtroOplPorSeleccion: boolean`.
- `hoverOplRef: OplReferencia | null`.
- `busquedaOpl: string`.

Acciones: toggles y setters por flag.

### `store/mapa.ts`

Estado:
- `vistaMapaActiva: boolean`.
- `descriptorMapaCache: DescriptorMapa | null`.
- `mapaFiltros: { profundidad: number | null; subarbolRaiz: Id | null }`.
- `mapaResaltado: { criterio: CriterioResaltado | null }`.
- `mapaMarcadores: { activos: Id[]; visitados: Id[] }`.
- `mapaAutoRefresh: boolean`.

Acciones: `entrarVistaMapa`, `salirVistaMapa`, `fijarFiltroProfundidad`, `fijarFiltroSubarbol`, `fijarCriterioResaltado`, `marcarActivo(id)`, `marcarVisitado(id)`, `refrescarMapa`, `togglearAutoRefresh`.

### `store/persistencia.ts`

Estado:
- `modelosGuardados: ResumenModeloPersistido[]`.
- `modeloPersistidoId: Id | null`.
- `descripcionModeloLocal: string`.

Acciones: `listarLocales`, `guardarLocal`, `cargarLocal`, `borrarLocal`, `actualizarMetadataLocal`. Consume `persistencia/local.ts` existente.

### `store.ts` (barrel reducido)

```ts
// app/src/store.ts (objetivo: < 500 LOC)
import { createStore } from "zustand/vanilla";
import type { OpmStore } from "./store/tipos";
import { crearStoreRuntime } from "./store/runtime";
import { createModeloSlice } from "./store/modelo";
import { createSeleccionSlice } from "./store/seleccion";
import { createEnlacesSlice } from "./store/enlaces";
import { createWorkspaceModSlice } from "./store/workspaceMod";
import { createCarpetasSlice } from "./store/carpetas";
import { createUiPanelSlice } from "./store/uiPanel";
import { createMapaSlice } from "./store/mapa";
import { createPersistenciaSlice } from "./store/persistencia";
import { createPestanasSlice } from "./store/pestanas";

const runtime = crearStoreRuntime();

export const store = createStore<OpmStore>()((set, get, api) => ({
  ...createModeloSlice(set, get, api, runtime),
  ...createSeleccionSlice(set, get, api),
  ...createEnlacesSlice(set, get, api),
  ...createWorkspaceModSlice(set, get, api),
  ...createCarpetasSlice(set, get, api),
  ...createUiPanelSlice(set, get, api),
  ...createMapaSlice(set, get, api),
  ...createPersistenciaSlice(set, get, api),
  ...createPestanasSlice(set, get, api),
}));

export function useOpmStore<T>(selector: (state: OpmStore) => T): T { /* ... */ }

// Re-exports compatibilidad rondas 1-7:
export type { OpmStore } from "./store/tipos";
// (otros tipos pre-existentes que `store.ts` exportaba)
```

Crear `app/src/store/tipos.ts` con `export type OpmStore = ModeloSlice & SeleccionSlice & ...` (o interface equivalente extendida), mas tipos auxiliares store-locales (`ModoEnlace`, `ModoSeleccion` re-exportado si hoy salia desde `store.ts`). Crear `app/src/store/runtime.ts` como modulo no-UI con los singletons actuales; no debe importar ningun slice ni `store.ts`. El ejemplo muestra `runtime` inyectado al slice de modelo; si mas slices necesitan runtime, pasarlo como dependencia explicita, no importando el store.

### Garantia API publica

Antes de mergear, ejecutar:

```bash
cd app && grep -rE "from \"\\.\\/store\"|from \"@app/store\"" src --include="*.ts" --include="*.tsx" | head -50
```

Asegurarse que cada import sigue funcionando. Si algun import importaba un nombre interno (no publico), restaurar el export en `store.ts` (re-export desde el slice donde vive ahora).

Ademas, capturar la superficie observable del store antes/despues:

- `store.getState()` debe seguir exponiendo las mismas claves publicas usadas por consumidores actuales.
- `useOpmStore<T>(selector)` y `store.subscribe` conservan comportamiento y timing suficiente para que UI/render no requieran cambios.
- Las transiciones `commitModelo -> deshacer -> rehacer -> marcarGuardado` producen el mismo historial y los mismos flags `dirty`, `puedeDeshacer`, `puedeRehacer`, `mensaje`.

Las 18 reglas del detector que apuntan a `store.ts` matchean substrings como `"const UNDO_LIMIT = 100"`, `"deshacer()"`, `"rehacer()"`, `"snapshotGuardado"`, `"seleccionarEntidad(id)"`, `"crearObjetoDemo"`, etc. **Verificar** despues del refactor que cada string sigue presente como export real o comentario documental temporal en `store.ts`, pero no confiar en eso como evidencia. L6 cierra recalibrando reglas hacia `store/runtime.ts` y `store/<slice>.ts`; L1 debe conservar comportamiento con tests, no solo regex.

## 7. Tests obligatorios

- Unit por slice (al menos 3-5 tests por slice nuevo, total ~30-40 tests nuevos).
- `store.test.ts` debe pasar **sin tocar** (regresion zero).
- Snapshot tipo: ejecutar `bun run typecheck` y verificar que TODAS las firmas exportadas de `store.ts` siguen matcheando (compila sin error en consumidores).
- Contrato runtime: tests de `modelo.ts` o `runtime.ts` deben cubrir que no hay stacks duplicados entre slice y runtime, que `snapshotGuardado` es singleton y que resetear/cambiar pestana no deja dirty heredado por error.

Ejemplos de tests minimos:

`modelo.test.ts`:
```ts
test("commitModelo agrega al historial undo y vacia redo", () => { ... });
test("deshacer recupera estado previo", () => { ... });
test("UNDO_LIMIT recorta a 100 entries", () => { ... });
test("marcarGuardado fija dirty=false", () => { ... });
```

`seleccion.test.ts`:
```ts
test("setSeleccion con 2 ids deja seleccionId=null y seleccionados.length=2", () => { ... });
test("toggleSeleccion sobre id presente lo quita", () => { ... });
test("vaciarSeleccion deja seleccionados vacio", () => { ... });
```

`enlaces.test.ts`:
```ts
test("abrirModoEnlace fija modoEnlace; cerrarModoEnlace lo limpia", () => { ... });
test("abrirTablaEnlaces y cerrar es idempotente", () => { ... });
```

(Y analogos para los 6 slices restantes.)

## 8. Verificacion

```bash
cd app
bun run check          # typecheck strict + 481 unit + nuevos
bun run browser:smoke  # 40 smoke; debe pasar sin cambios
bun run build          # bundle; sin regresion (objetivo: similar)
```

Verificacion adicional:

```bash
cd /home/felix/projects/deep-opm-pro
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
# detector debe seguir en 45/49 minimo (no caer); idealmente igual o mejor.
```

Si el detector cae, examinar el evidence ledger para ver que reglas fallaron y restaurar los strings clave en barrel `store.ts` via re-export comentado o reposicionar la constante. L6 recalibra reglas estructurales; L1 NO debe romper reglas existentes.

## 9. Decisiones bloqueadas (no reabrir)

- **Patron barrel re-export**: `store.ts` debe seguir siendo importable como `import { store, useOpmStore } from "../store"` por todos los consumidores actuales (UI, render, persistencia). Las firmas publicas no cambian; solo la implementacion interna.
- **Zustand 5 vanilla**: usar `createStore` de `zustand/vanilla` (es lo que ronda 1-7 hizo). NO migrar a `create()` con hook React (Preact no usa React hooks; el patron `useOpmStore` con selector actual sigue siendo el mecanismo de subscripcion).
- **NO usar middleware** (`zustand/middleware`): el store es minimo. Si una linea futura quiere persistir el estado UI, seria una decision de ronda separada; aqui no.
- **Pestanas (`store/pestanas.ts`)**: ya existe ronda 7; no se reescribe. Si esta linea necesita reorganizar imports (es probable, porque `store.ts` consume actualmente `crearPestanaNueva`, `abrirPestana`, etc. desde `store/pestanas.ts`), se hace minimo y sin cambiar firmas.
- **Helpers `canvas/seleccionMultiple.ts` y `canvas/operacionesBatch.ts`**: ya existen ronda 7; el slice `seleccion.ts` los consume sin cambios.
- **Helpers `persistencia/{local,workspace,movimientoModelos,versiones,autosalvado}.ts`**: ya existen; los slices `persistencia.ts` y `workspaceMod.ts` los consumen sin cambios.
- **Tipos en `app/src/tipos.ts`**: NO se tocan (todos los `?` opcionales, todas las interfaces). `app/src/store/tipos.ts` es obligatorio para evitar ciclos entre slices y aloja solo tipos del store. Si los slices necesitan un tipo publico de modelo/UI fuera del store, se discute en consolidacion (no en linea).
- **Decisiones vigentes de HANDOFF**: multi-seleccion canonica, multi-pestana sesion-only, mapa = vista derivada, designaciones de estado, alias/unidad/descripcion/URLs, duracion canonica, plegado parcial persistido, atajos centralizados, divisor arbol/canvas, dialogos custom con captura — TODAS preservadas. El refactor solo reorganiza wiring.

## 10. Decisiones que tomas vos (documentar en commit)

- **Como organizar imports en `store.ts` barrel**: orden alfabetico de slices o por dependencia (modelo primero, luego los que dependen de modelo). Recomendado: orden de mounting con dependencia declarada en comentario por slice.
- **Como organizar `store/tipos.ts`**: es obligatorio. Documentar si usaste `type` intersection o `interface extends`; ambas son validas si no crean ciclos.
- **Como organizar `store/runtime.ts`**: es obligatorio. Documentar que singletons quedaron ahi y que slices no duplican `undoStack`, `redoStack`, `snapshotGuardado` ni control de autosalvado.
- **Como manejar campos cross-slice** (ej. `dirty` esta en `modelo.ts` pero `uiPanel.ts` quiere reaccionar a el): usa `get()` para leer del slice del modelo. NO duplicar el estado en dos slices.
- **Si extraer un slice `tabla.ts`** separado de `enlaces.ts` para `tablaEnlacesAbierta/Filtro/Orden`. Recomendado: NO; cabe en `enlaces.ts` y mantiene cohesion (la tabla es vista derivada de enlaces).
- **Si extraer `autosalvado.ts` slice** para el control de autosalvado o dejarlo en `persistencia.ts`. Recomendado: dejarlo en `persistencia.ts` (es estado de persistencia); el helper `crearAutosalvado` sigue en `persistencia/autosalvado.ts`.
- **Si los re-exports en `store.ts` mantienen comentarios para el detector** o se recalibran reglas. Recomendado: dejar comentarios documentales por API, y L6 recalibra ledger explicitamente. Coordinacion con L6: declarar en el reporte que strings se preservaron en barrel.
- **Si los slices exponen su `interface`** publicamente o solo el `create<X>Slice`. Recomendado: exponer la interface (para que `store/tipos.ts` la importe en la union) pero NO exponer estado interno opcional.
- **Si testear cada slice en aislacion** (con `createStore` minimo) o solo via `store.test.ts` (integrado). Recomendado: cada slice con su test minimo + `store.test.ts` para integracion.

## 11. Forma del entregable

Commits sugeridos:

- `refactor(store): introduce slice modelo con commit deshacer rehacer`
- `refactor(store): extrae slice seleccion y portapapeles visual`
- `refactor(store): extrae slice enlaces y tabla de enlaces`
- `refactor(store): extrae slice workspace versiones y archivado`
- `refactor(store): extrae slice carpetas dialogos y portapapeles workspace`
- `refactor(store): extrae slice uiPanel flags y modales`
- `refactor(store): extrae slice mapa filtros resaltado y export`
- `refactor(store): extrae slice persistencia local y autosalvado`
- `refactor(store): reduce store.ts a barrel agregador`
- `test(store): cubre slices modelo seleccion enlaces workspaceMod carpetas uiPanel mapa persistencia`

Co-author footer estandar si aplica al implementador externo.

NO tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`. Reportar:

- Hashes de commits.
- LOC final del barrel `store.ts` (objetivo < 500; tope < 1500).
- LOC de cada slice nuevo.
- Resultado de `bun run check` (tests pasados / fallidos).
- Resultado de `bun run browser:smoke` (smoke pasados / fallidos).
- Resultado de `bun run build` (bundle KB / gzip KB; comparar contra base).
- Resultado de `--sync-real` (reglas matcheadas; debe ser >= 45 sin caida).
- Decisiones tomadas en §10.
- HU parcialmente cubiertas: ninguna (refactor estructural; HU se cubren en otros niveles).
- Bloqueos: si algun slice no se pudo extraer por dependencia inesperada, declararlo y dejar TODO en barrel para ronda 9.

Si descubris bug fuera de scope (poco probable en un refactor pero posible en cascadas de tests), entregar como patch a `/tmp/` y NO commitear.
