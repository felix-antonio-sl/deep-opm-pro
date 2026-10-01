# Dossier · `app/src/store` (estado, undo/redo, aplicación de operaciones, persistencia)

Alcance leído: `app/src/store.ts` (80 l.), `app/src/store/**` (34 archivos fuente, 14 375 l.; 7 444 l. de tests
en `store/**/*.test.ts` + 2 072 l. en `store.test.ts`/`storeFactory.test.ts`). Se leyó el código completo de todos los
archivos fuente; de los tests solo se muestrearon los contratos (`contrato.test.ts`, `storeFactory.test.ts`).
Se consultaron puntualmente dependencias que el store consume como contrato (`modelo/tipos/pestana.ts`,
`persistencia/modelos.ts`, `persistencia/workspace.ts`, `persistencia/backend.ts`, `agent/contracts.ts`,
`modelo/changes/types.ts`, `modelo/inheritedFanGuard.ts`, `modelo/familiasEfectosPreestado.ts`).
No se editó nada del repositorio.

---

## 1. Resumen ejecutivo

- El store es **un único `zustand/vanilla` monolítico** (`OpmStore`, ~557 claves: ~150 campos de estado y ~410
  acciones) armado por *spread* de 11 "slices" (`store.ts:23-45`). Los slices no encapsulan nada: todos leen y
  escriben cualquier clave de `OpmStore` vía `set/get` globales; la división es solo de archivo.
- El **corazón real** es `store/runtime.ts` (1 769 l.): `commitModelo` (punto único de mutación semántica del
  modelo, con guardas OPM), `estadoModelo` (derivación de `dirty`/`puedeDeshacer`/sincronización de la pestaña
  activa), la pila de **undo/redo por snapshots** (`undoStack`/`redoStack` como *variables de módulo*), la cola de
  escritura del `WorkspaceIndice`, el checkpoint local a IndexedDB y —desde 2026-09— toda la **maquinaria de
  operaciones de documento para el agente** (reservas, ediciones preparadas, merge a 3 vías, rebase de historial,
  historial de intenciones semánticas).
- La **semántica OPM no vive en el store**: todas las acciones delegan en funciones puras del kernel
  (`modelo/operaciones`, `modelo/abanicos`, `modelo/estadosDesignaciones`, `opl/parser`, `canvas/operacionesBatch`…)
  que devuelven `Resultado<Modelo>`. Esto es lo más valioso del diseño y debe preservarse. El store añade pocas
  reglas propias, pero algunas son sagradas (propiedad de abanicos, integridad de familias, orden temporal del
  in-zoom, reutilización por nombre, 1 aparición por OPD, OPD-árbol = jerarquía de refinamiento).
- El resto es **acreción**: ~180 callsites de `commitModelo` con el mismo *boilerplate*; ~30 banderas de diálogo;
  estado de la pestaña activa **duplicado** (campos top-level + `pestanasAbiertas[i]` + globals de módulo); siete
  copias del patrón "reconciliar respuesta async de guardado"; dos flujos casi idénticos de 250 líneas
  (graduación/reapertura); stubs vestigiales de la era localStorage; cachés derivadas guardadas como estado;
  serialización completa del modelo (y de hasta 100 snapshots) en cada edición.
- Riesgos concretos detectados (ver §9): redo post-commit remoto aplica el snapshot sin rebase
  (`runtime.ts:1742`), undo no respeta el bloqueo de edición (simulación/solo-lectura), `crearOpmStore` no aísla
  (usa globals del singleton), identidad dual `modelo.id` ≠ `modeloPersistidoId` usada para derivar especie/
  biblioteca.

---

## 2. Inventario de módulos

| Archivo | L. | Propósito real | Clasificación |
|---|---:|---|---|
| `store.ts` | 80 | `crearOpmStore` (spread de slices + conexión runtime) y hook `useOpmStore` con caché por selección | núcleo (hook: portar casi tal cual) |
| `store/tipos.ts` | 956 | Interfaz `OpmStore` (todas las claves) + tipos de flujos UI (`ColisionPendiente`, `RefinamientoPendiente`, `KindSeleccion`, `ResultadoBusquedaSalto`, `VersionMutationReceipt`…) | contrato interno; inflado |
| `store/sliceTypes.ts` | 326 | `Pick<OpmStore, …>` por slice + `AssertNever` que garantiza cobertura exacta de claves | burocracia de tipos |
| `store/modelo/contrato.ts` | 314 | `MODELO_SLICE_CAPABILITIES`: lista *a mano* de ~230 claves del slice modelo agrupadas por "capacidad"; test exige igualdad | burocracia autorreferente |
| `store/modelo.ts` | 60 | Composer del slice `modelo`: estado inicial + spread de 10 fragmentos `acciones-*` | indirección |
| `store/runtime.ts` | 1769 | commit, undo/redo, dirty, pestañas, workspace CAS, checkpoint IndexedDB, agente (reservas/merge/rebase), helpers varios | núcleo + acreción mezclados |
| `store/documentOperations.ts` | 424 | `DocumentOperationsController` (secuencia cliente, reserva, grant de un solo uso, ediciones preparadas) + merge JSON a 3 vías + resolución de fallos de commit | importante si el agente sigue; alta calidad |
| `store/intentHistory.ts` | 187 | Libro de intenciones semánticas (undo/reaplicar de cambios del agente) con barrera sobre la pila legacy | importante si agente; bien acotado |
| `store/sessionEpoch.ts` | 36 | Época de sesión para invalidar async tras login/logout; cola de logout remoto | núcleo (pequeño, correcto) |
| `store/runtimeEffects.ts` | 27 | Efectos inyectables (`now`, `confirm`, `randomUUID`, `random`) para tests | marginal (uso inconsistente) |
| `store/seleccion.ts` | 300 | Slice selección: set/agregar/toggle/vaciar, estados multi (mismo propietario), borrar selección, nudge, copiar/pegar, alinear enlaces | núcleo |
| `store/enlaces.ts` | 403 | Slice enlaces: modo enlace/creación (solo estado), multiplicidad, vértices, reanclar, grupos estructurales, tabla de enlaces | núcleo + UI de tabla |
| `store/uiPanel.ts` | 329 | Paneles, anchos persistidos, orden/gestión/renombrado del árbol OPD, navegación por flechas, focus de nombre, cola de renombrado | mezcla UI + 3 comandos de modelo |
| `store/mapa.ts` | 148 | Vista "mapa del sistema": caché de descriptor, zoom/pan/filtros persistidos por modelo en el índice | marginal |
| `store/mapaSelectors.ts` | 34 | Selectores puros del mapa | keep (selector) |
| `store/pestanas.ts` | 316 | Funciones puras de pestañas + slice (abrir, duplicar, cerrar, activar, reordenar, abrir persistida) | importante |
| `store/persistencia.ts` | 964 | Sesión/login, import/export JSON, guardar/cargar/borrar, autosalvado, poll de revisión remota, purga de sesión | núcleo (muy verboso) |
| `store/carpetas.ts` | 292 | **Mal nombrado**: versiones (restaurar/eliminar), búsqueda global, búsqueda intra-modelo | importante; renombrar/fusionar |
| `store/workspaceMod.ts` | 980 | Carpetas (CRUD, cortar/pegar, mover), archivar, biblioteca, **graduación Apunte→Modelo**, **reapertura Modelo→Apunte**, versión ahora | importante; duplicación masiva |
| `store/workspaceMerge.ts` | 134 | Merge a 3 vías del `WorkspaceIndice` (backend/base/local) por id y por clave | importante; portable |
| `store/feedback.ts` | 136 | **Segundo store zustand**: overlays (flash con TTL, errores inline de validación) | importante; unificar con `mensaje` |
| `store/simulacion.ts` | 293 | Slice simulación conceptual: orquesta kernel puro `modelo/simulacion/*`, fuerza `readOnly` | importante; limpio pero repetitivo |
| `store/atajos.ts` | 28 | Frecuencia de uso de la command palette (no persistida) | marginal |
| `store/acciones-contextuales.ts` | 260 | Catálogo **puro** de acciones contextuales (barra/menú/palette). No toca el store | mal ubicado (es UI) |
| `store/opdNavigation.ts` | 14 | `resolverOutzoomAutor` (OPD padre + refinador) | keep (fusionar) |
| `store/modelo/acciones-entidad.ts` | 671 | Crear cosa/apariencia, flujo de nombre + colisión (B3/B4), renombrar, atributos, esencia/afiliación/linealidad, tamaños, metadata (alias/unidad/URLs/imagen) | núcleo |
| `store/modelo/acciones-estados.ts` | 585 | Estados: agregar/eliminar/renombrar, designaciones, supresión global y por aparición, duración, reordenar, batch | núcleo (duplicado id vs "seleccionado") |
| `store/modelo/acciones-opd.ts` | 583 | Refinamiento (in-zoom/unfold) con intención previa + pregunta guía, bocetos (OPD suelto, adoptar, devolver), quitar refinamiento con confirmación, eliminar OPD, navegar | núcleo |
| `store/modelo/acciones-enlace.ts` | 625 | Modo enlace (libre/desde entidad/drag), crear enlace, extremos, split effect, abanicos, auto-invocación, modificadores, metadatos de enlace | núcleo (boilerplate) |
| `store/modelo/acciones-canvas.ts` | 1061 | Selección por click (+ creación de enlace en modo enlace), selección/edición desde OPL, OPL libre, preferencias OPL, copiar OPL/canon/contexto skill, notas de mesa, log de decisiones, undo/redo, plegado, mover/redimensionar, grid, alinear/distribuir, layout sugerido, timeline, traer conectados, ocultar | núcleo + muchas marginales |
| `store/modelo/acciones-capacidades.ts` | 693 | Ontología, requisitos, requirement-view, submodelos, composición, estereotipos, contorno/distribución, split parcial, decisión, razonamiento, coherencia de descomposición | importantes/marginales |
| `store/modelo/acciones-ui.ts` | 971 | **Mal nombrado**: guardar como (x2 variantes), renombrar modelo, nuevo modelo, nacer apunte, reconciliación post-guardado, diálogos, resaltado temporal, readOnly/biblioteca | núcleo de persistencia escondido |
| `store/modelo/acciones-anclaje.ts` | 268 | Centinela de drift: evalúa anclajes contra bibliotecas persistidas; calcar/anclar pieza; resync/soltar | importante (feature reciente) |
| `store/modelo/acciones-ficha.ts` | 35 | Ficha de trabajo y lentes de conocimiento | marginal |
| `store/modelo/acciones-mesa-exploracion.ts` | 153 | Mesa de exploración del Apunte (fuentes→trazos→propuestas→hecho OPM) | marginal/experimental |

Dependencias salientes del store (dirección real): `modelo/*` (kernel puro), `canvas/*` **puro** (operacionesBatch,
seleccionMultiple, modoEnlace, grid, layoutSugerido, reglasTraer, mapaSistema: son operaciones de modelo alojadas
en la carpeta del renderizador), `opl/*` (parser, exportarMarkdown, contextoSkill, interaccion, opciones),
`serializacion/*` (json, perfilesExport, validarIntegridad), `persistencia/*` (backend HTTP, workspace,
localRepository, autosalvado, versiones), `mesa/*`, `agent/contracts`. Entrantes: `app/ports/*` (112 archivos,
5 812 l.) y `app/viewmodels/*` (48 archivos, 3 332 l.) envuelven casi 1:1 el store (p. ej. `zustandHistoryPort.ts`
re-expone 4 claves); `ui/App.tsx` importa constantes de ancho desde `store/runtime`; `editorBootstrap.tsx`
se suscribe a `dirty` para `beforeunload`.

---

## 3. Arquitectura de estado

### 3.1 Composición

```ts
// store.ts:23-45
export function crearOpmStore(opciones: { conectarRuntimeGlobal?: boolean } = {}) {
  const api = createStore<OpmStore>((set, get) => ({
    ...createModeloSlice(set, get),
    ...createSeleccionSlice(set, get),
    ...createEnlacesSlice(set, get),
    ...createWorkspaceModSlice(set, get),
    ...createCarpetasSlice(set, get),
    ...createUiPanelSlice(set, get),
    ...createMapaSlice(set, get),
    ...createPersistenciaSlice(set, get),
    ...createPestanasSlice(set, get),
    ...createSimulacionSlice(set, get),
    ...createAtajosSlice(set, get),
  } as OpmStore));
  if (opciones.conectarRuntimeGlobal) {
    inicializarRuntimeStore(api, modeloInicial);
    connectBackendSessionBoundary((partial) => api.setState(partial), () => api.getState());
  }
  return api;
}
export const store = crearOpmStore({ conectarRuntimeGlobal: true });
```

`CrearSlice` es el contrato de fábrica (`sliceTypes.ts:8-11`):

```ts
export type CrearSlice<T> = (
  set: (partial: Partial<OpmStore> | ((state: OpmStore) => Partial<OpmStore>)) => void,
  get: () => OpmStore,
) => T;
```

`sliceTypes.ts:310-326` define `OpmStoreSlices` como intersección de los `Pick` y dos `AssertNever` que fallan en
compilación si falta o sobra una clave. `modelo/contrato.ts` repite, a mano, las ~230 claves del slice modelo en 9
"capacidades" (`sessionState`, `appFlow`, `entityCommands`, `stateCommands`, `opdCommands`, `anclaje`,
`oplCommands`, `canvasCommands`, `linkCommands`) y `contrato.test.ts` verifica que el composer exponga exactamente
esas claves. **Tres fuentes de verdad** para la misma lista de claves (tipos.ts, sliceTypes.ts, contrato.ts): cada
acción nueva exige tocar 3–4 archivos. Nota: `sessionState` del "slice modelo" incluye banderas de diálogo
(`dialogoOntologiaAbierto`, `vitrinaEstereotiposAbierta`…), lo que muestra que la agrupación no es semántica.

### 3.2 Estado global de módulo (fuera de zustand)

`runtime.ts:70-132` mantiene *singletons* de módulo:

```ts
let snapshotGuardado = "";           // JSON de la última versión "guardada" → base de dirty
let undoStack: Modelo[] = [];        // pila undo de la pestaña ACTIVA
let redoStack: Modelo[] = [];
let autosalvadoControl, pollRevisionTimer, storeApi, runtimeEffects;
let workspaceWriteQueue: Promise<void>; let persistedWorkspaceIndex: WorkspaceIndice | null;
const documentOperationControllers = new Map<string, DocumentOperationsController<…>>();
const reservationModels, observedBaseModels, legacyHistoryRebase, pendingDocumentConflicts;
const pendingCommitListeners, intentActionListeners;
```

Más: `intentHistory` (singleton en `intentHistory.ts:187`), `currentEpoch` (`sessionEpoch.ts`), `feedbackStore`
(segundo store), `limpiarResaltadoTimer` (`acciones-ui.ts:50`), `loadRequestSequence/listRequestSequence`
(`persistencia.ts:79-80`), `localCheckpointQueues` (`runtime.ts:1295`).

Consecuencia: `crearOpmStore()` sin `conectarRuntimeGlobal` **no aísla**. `commitModelo` y `estadoModelo` leen
`storeApi` (el singleton global) para bloqueo, pestañas y `puedeDeshacer`, y empujan a la `undoStack` global
(`runtime.ts:1109`, `1356-1386`, `1157`). `storeFactory.test.ts` pasa solo porque verifica entidades.

### 3.3 Grupos de estado (qué hay realmente)

1. **Documento activo** (semántico): `modelo`, `opdActivoId`, `dirty`, `dirtyModelo`, `puedeDeshacer`,
   `puedeRehacer`, `modeloPersistidoId`, `descripcionModeloLocal`, `workspaceLocal` (derivable),
   `readOnly`, `esBibliotecaAbierta`, `driftMap`.
2. **Pestañas**: `pestanasAbiertas: Pestana[]`, `pestanaActivaId`. Cada `Pestana` guarda su propio `modelo`,
   `dirty`, `historialUndo` (hasta 100 `Modelo` completos), `snapshotJson`, selección, descripción:

   ```ts
   // modelo/tipos/pestana.ts:15-28
   export interface Pestana {
     id: PestanaId; etiqueta: string; modeloId: Id | null; modelo: Modelo;
     cargadoDesde: OrigenPestana; dirty: boolean;
     historialUndo: HistorialEntrada[]; cursorUndo: number;
     vistaMapaActivaPestana: boolean; seleccionadosPestana?: Id[];
     snapshotJson?: string; descripcionModeloLocal?: string;
   }
   ```

   La pestaña activa se **espeja** en los campos top-level; `estadoModelo` re-sincroniza su entrada en
   `pestanasAbiertas` con `clonarModelo` (structuredClone completo) **en cada commit** (`runtime.ts:1362-1386`).
3. **Selección**: `seleccionId` (entidad), `enlaceSeleccionId`, `estadoSeleccionId` (exclusivos), `seleccionados`,
   `modoSeleccion`, `portapapelesVisual`. Discriminador `KindSeleccion = "entidad" | "enlace" | "estado" | "vacia"`
   (`tipos.ts:75`). El comentario de `tipos.ts:150-158` declara "punto único `setSeleccion`", pero hay **140
   escrituras directas de `seleccionId:`** y 48 de `estadoSeleccionId:` en el store; muchas no limpian
   `estadoSeleccionId`/`seleccionados` (p. ej. `enlaces.ts:303-310`, `carpetas.ts:249-258`, `acciones-opd.ts:542-549`).
4. **Modos de interacción**: `modoEnlace`, `eligiendoOrigenEnlace`, `modoCreacion`, `contextoSimulacion`
   (+ `modeloBaseSimulacion`, `readOnlyPrevSimulacion`, `autoAvanceSimulacionActivo`, `velocidadSimulacion`,
   `headlessSimulacion`), `vistaMapaActiva` (+13 campos `mapa*`).
5. **Flujos transitorios** (máquinas de estado UI no serializables): `nuevaCosaPendiente`, `refinamientoPendiente`,
   `confirmacionEliminarRefinamiento`, `confirmacionDevolverBoceto`, `colisionPendiente`, `colaRenombradoPendiente`,
   `solicitarFocusNombre`, `dialogoGraduarModeloId` + 8 `graduacion*`, `dialogoReabrirModeloId` + 6 `reapertura*`,
   `dialogoRolBibliotecaModeloId`. Tipos clave:

   ```ts
   // tipos.ts:52-66
   export type ColisionPendiente =
     | { contexto: "creacion"; tipo: TipoEntidad; opdId: Id; posicion: Posicion; colision: ColisionNombre; entidadProvId: Id }
     | { contexto: "rename"; entidadId: Id; colision: ColisionNombre };
   // tipos.ts:91-117
   export type RefinamientoPendiente =
     | { tipo: "descomposicion"; opdPadreId: Id; entidadId: Id; entidadNombre: string; error?: string }
     | { tipo: "despliegue"; opdPadreId: Id; entidadId: Id; entidadNombre: string; modo: ModoDespliegueObjeto | null; error?: string }
     | { tipo: "adopcion"; opdPadreId: Id; opdSueltoId: Id; opdNombre: string; entidadId: Id;
         refinamiento: TipoRefinamiento; modo: ModoDespliegueObjeto | null; preguntaInicial?: string; error?: string };
   ```
6. **Diálogos/paneles** (~78 claves `dialogo*|modal*|abrir*|cerrar*`): `menuPrincipalAbierto`, `toolbarMasAbierto`,
   `dialogoGuardarComoAbierto`, `dialogoCargarModeloAbierto`, `dialogoImportarExportarJsonAbierto`,
   `dialogoComandosAbierto`, `dialogoConfiguracionAbierto`, `dialogoSimulacionNumericaAbierto`,
   `dialogoTraerConectadosAbierto`, `dialogoOntologiaAbierto`, `dialogoRequisitoAbierto`, `dialogoSubmodeloAbierto`,
   `dialogoComposicionAbierto`, `vitrinaEstereotiposAbierta`, `dialogoVersionesAbierto`, `dialogoBuscarGlobalAbierto`,
   `busquedaCosasAbierta`, `tablaEnlacesAbierta`, `gestionArbolAbierta`, `cheatsheetAtajosAbierto`,
   `modalUrlsAbierto`, `modalImagenAbierto`, `modalDuracionAbierto`, `panelOpleftAbierto`, `panelInspectorAbierto`,
   `uiSoloCanvas`, `vistaMobileActiva`… Cada uno con su par abrir/cerrar.
7. **Workspace/persistencia**: `indice: WorkspaceIndice`, `workspaceRevision` (CAS), `carpetaActualId`,
   `modelosGuardados`, `modelosRecientes` (derivable), `portapapelesWorkspace`, `mostrarArchivados`,
   `mostrarVersiones`, `busquedaGlobal`, `autosalvado`, `revisionRemota`, `revisionBasePorModelo`, `requiereLogin`.
8. **Preferencias UI**: viven en `indice.preferenciasUi` (persistidas vía workspace) y algunas se copian a campos
   top-level (`anchoPanel*`, `nombresArbolVisibles`, `gridConfig`); otras se leen directo del índice
   (`oplNumeracionVisible`, `oplEsenciaVisibilidad`, `oplMinimizado`, `oplBloquesContraidos`,
   `traerConectadosUltimo`, `crucesPuenteSkill`).
9. **Feedback**: `mensaje: string | null` (un solo slot, sobrescrito por casi toda acción) y, aparte,
   `feedbackStore.overlays` (flash con TTL + errores inline anclados). Dos canales para lo mismo.

### 3.4 Hook de suscripción

`useOpmStore` (`store.ts:51-80`) reimplementa `useStore` con `useSyncExternalStore`, cacheando el valor
seleccionado por identidad de estado y preservando la referencia cuando `Object.is` coincide, para que ~600
consumidores no re-rendericen en cada mutación. Es correcto y bien comentado. Varias acciones fuerzan re-render
clonando superficialmente el modelo (`modelo: { ...modelo }` en `toggleAliasVisibles`, `toggleDescripcionesVisibles`
`acciones-entidad.ts:526-536`, `toggleGrid`/`fijarGridConfig` `acciones-canvas.ts:785-800`, `fijarModoImagenGlobal`
`acciones-ui.ts:696-699`): *hack* que indica selectores de render que dependen del objeto `modelo` en vez de las
preferencias.

---

## 4. Cómo se aplica una operación del modelo

### 4.1 Patrón de acción (repetido ~180 veces)

```ts
accion(args) {
  const { modelo, opdActivoId, seleccionId } = get();
  if (!seleccionId) { set({ mensaje: "Selecciona …" }); return; }
  const resultado = operacionPura(modelo, opdActivoId, seleccionId, args); // kernel: Resultado<Modelo>
  if (!resultado.ok) { set({ mensaje: resultado.error }); return; }
  commitModelo(set, modelo, resultado.value, { seleccionId, enlaceSeleccionId: null, modoEnlace: null, mensaje: null });
}
```

El `extra` de `commitModelo` mezcla la selección posterior, mensajes, cierre de diálogos y banderas
(`dirtyModelo`, `solicitudFitToken`, `indice`…). Algunas acciones construyen el `Modelo` siguiente *a mano* en el
store en lugar de usar el kernel: `crearAparienciaEntidadEnCanvas` (`acciones-entidad.ts:166-189`),
`resolverColisionReutilizar` (`:563-586`), `fijarLayoutEstadosEntidad` (`:512-524`), `renombrarOpdDesdeArbol`
(`uiPanel.ts:166-173`), `agregarUrlAEntidad` (incrementa `nextSeq` en el store, `:429-441`).

### 4.2 `commitModelo` (runtime.ts:1103-1181) — pipeline exacto

1. **Bloqueo de edición** `mensajeBloqueoEdicion(estado)` (`runtime.ts:1086-1096`): simulación activa → "Modo
   simulación…"; `readOnly` → "Modelo en solo lectura…"; OPD activo con `vista.readOnly` (vistas derivadas:
   requirement-view/submodel-view) → "Vista derivada en solo lectura". Devuelve `false` (los callsites no deben
   emitir flash de éxito: "Ley silencio-cero").
2. **Normalización**: `previoSincronizado = sincronizarPuertosTodosLosOpd(previo)`;
   `sincronizado = sincronizarPuertosTodosLosOpd(sincronizarAbanicos(siguiente))`. `sincronizarAbanicos`
   (`modelo/abanicos.ts:286-297`) descarta abanicos con < 2 ramas vivas o que ya no validan como candidato
   (mismo puerto común) y normaliza la decisión.
3. **Guarda de abanico heredado** `mensajeBloqueoCambioAbanicoHeredado(previo, sincronizado, opdActivoId)`
   (`modelo/inheritedFanGuard.ts:6-49`): un abanico solo se edita en el OPD que lo posee, salvo introducción del
   OPD propietario o proyecciones automáticas desde el padre.
4. **Integridad de familias por preestado** `validarSemanticaFamiliasPreestado`
   (`modelo/familiasEfectosPreestado.ts:6-16`): ≥2 enlaces únicos, ≥2 estados de dominio, proceso/objeto válidos.
5. **No-op**: si el JSON exportado no cambió, aplica solo `extra` y retorna `true` (sin entrada de undo).
6. **Reserva activa del agente**: si el documento tiene una reserva de commit y el cambio no es "layout puro"
   (`extra.dirtyModelo !== false`), la edición se **prepara** (`prepareHumanEdit`), se emite
   `RuntimePendingCommit` y se muestra "Edición preparada…", retornando `false` (el cambio NO se ve aún).
7. **Historial**: `undoStack.push(previoSincronizado)` (límite `UNDO_LIMIT = 100`), `redoStack = []`.
8. `dirtyModelo` por defecto `true`; los gestos de layout pasan `{ dirtyModelo }` (el valor actual) para no
   marcar cambio semántico (`acciones-canvas.ts:745-916`).
9. Si la vista mapa está abierta con auto-refresh y cambiaron los OPD (`JSON.stringify(opds)`), recalcula
   `descriptorMapaCache` (acoplamiento store→vista).
10. `set(estadoModelo(sincronizado, extra))`; `controller.recordAppliedEdit()` (avanza `clientSequence`);
    `queueLocalDocumentCheckpoint(documentId)`.

### 4.3 `estadoModelo` (runtime.ts:1342-1403)

Re-sincroniza puertos otra vez, calcula `dirty = exportarModelo(modelo) !== snapshotGuardado` (serialización
completa), `dirtyModelo = extra.dirtyModelo ?? dirty`, recalcula `puedeDeshacer/puedeRehacer` consultando la
barrera de `intentHistory`, reescribe la pestaña activa en `pestanasAbiertas` (clon completo + copia de
`undoStack` + etiqueta) y **siempre** limpia `colisionPendiente`, `nuevaCosaPendiente`, `refinamientoPendiente`,
`confirmacionEliminarRefinamiento`, `confirmacionDevolverBoceto` antes de aplicar `extra`.

Coste por edición: ≥3 `sincronizarPuertosTodosLosOpd`, ≥3 `exportarModelo` completos, 1 `structuredClone`,
1 `JSON.stringify(opds)` condicional, y el checkpoint IndexedDB serializa el modelo **y cada uno de los hasta 100
snapshots de undo** (`localDocumentSnapshotInput`, `runtime.ts:1206-1211`) — O(100 × tamaño del modelo) por
tecla de nudge.

### 4.4 Dirty: cuatro fuentes

`dirty` (JSON ≠ `snapshotGuardado`), `dirtyModelo` (semántico, bloquea cargar otro modelo), `pestana.dirty`,
`pestana.snapshotJson`. Tras cada guardado async, siete rutinas recomputan "hubo cambios posteriores" comparando
JSON (§7.3).

---

## 5. Undo/redo

### 5.1 Pila de snapshots (legacy, la que usa el humano)

- **Qué se guarda**: el `Modelo` completo (sincronizado) previo a cada commit efectivo. No se guarda selección ni
  `opdActivoId`. Incluye cambios de layout (cada drag/nudge/redimensionado = 1 entrada).
- **Deshacer** `deshacerRuntime` (`runtime.ts:1595-1680`): toma `undoStack.at(-1)`; si hubo commit remoto
  (`legacyHistoryRebase`), rebasa el snapshot con `mergePreparedModelEdit(base, remoto, previo)` y valida
  (`validateRebasedModel`, `runtime.ts:700-714`); si hay reserva activa, prepara la edición; aplica guarda de
  abanico con `origen: "historial"`; mueve el modelo actual a `redoStack`; limpia selección, `modoEnlace`,
  `modoCreacion`; ajusta `opdActivoId` si el OPD dejó de existir. **No consulta `mensajeBloqueoEdicion`**.
- **Rehacer** `rehacerRuntime` (`runtime.ts:1682-1752`): simétrico; si no hay redo y hay intención semántica
  "undone", despacha "reapply" al canal del agente.
- **Pestañas**: al activar una pestaña, `undoStack = [...pestana.historialUndo]`, `redoStack = []`
  (`runtime.ts:872-873`): el redo se pierde al cambiar de pestaña.
- **Persistencia del historial**: formato local `opforja.local-history.v1` en IndexedDB
  (`runtime.ts:1206-1211`) y restauración en `restoreLocalDocumentRecord` (`runtime.ts:1215-1293`):

  ```ts
  const history = [{
    format: "opforja.local-history.v1",
    undo: (tab?.historialUndo ?? undoStack).map((model) => exportarModelo(model, folderId)),
    cursor: tab?.cursorUndo ?? undoStack.length,
    intents: intentHistory.entries(documentId),
  }];
  ```
- Efectos colaterales: `deshacer`/`rehacer` de `acciones-canvas.ts:511-525` re-evalúan drift si cambió la firma
  de anclajes.

### 5.2 Historial de intenciones semánticas (agente)

```ts
// intentHistory.ts:4-18
export type IntentHistoryStatus = "applied" | "undo-pending" | "undone" | "undo-conflict" | "reapply-pending" | "reapplied";
export interface IntentHistoryEntry {
  documentId: string; changeId: string; target: Target; sequence: number;
  /** Legacy snapshot depth when this semantic intent crossed into the document. */
  legacyUndoDepth: number;
  change: ChangeSet; inverse: SemanticInverse; status: IntentHistoryStatus;
  undoChangeId?: string; conflict?: { reason: string; references: string[] };
}
```

Cada commit remoto aceptado registra una entrada con `legacyUndoDepth` = profundidad actual de la pila. Esa
profundidad es una **barrera** (`undoBarrier`, `intentHistory.ts:68-73`): Ctrl+Z desapila snapshots hasta la
barrera; en la barrera, en vez de restaurar snapshot, valida la inversa semántica (`validateInverse`) contra el
modelo presente y despacha "undo" a los listeners (`dispatchIntentHistoryAction`, `runtime.ts:1754-1758`), que el
`documentOperationsPort` convierte en un nuevo ChangeSet hacia el gateway. Snapshots anteriores a la barrera
quedan inalcanzables hasta que la intención se revierta ("El historial anterior está protegido…").

**Evaluación**: modelo híbrido (snapshots + libro semántico + rebase por merge 3-vías de cada snapshot)
difícil de razonar. Correcto en intención ("deshacer sobre el presente", ver
`docs/roadmap/implementacion-producto-integrado.md`), pero es la pieza más compleja del área y depende de una
feature cuya aceptación con proveedor real y personas sigue abierta según ese mismo documento.

---

## 6. Operaciones de documento para el agente (runtime.ts:88-857 + documentOperations.ts)

Contratos:

```ts
// agent/contracts.ts:10-16
export interface Base { revision: number; semanticHash: string; workingCopyHash: string; clientSequence: number; profileVersion: string; }
// agent/contracts.ts:38-48
export interface ChangeSet extends SemanticChangeBatch {
  taskId: string | null; actorId: string; intentVersion: number | null; target: Target; base: Base;
  readIds: Id[]; writeIds: Id[]; dependencies: Dependency[]; explanation: string;
}
// agent/contracts.ts:50-57
export interface CommitReceipt { changeId: Id; target: Target; previousRevision: number; revision: number; appliedOperationIds: string[]; inverseId: Id; }
// modelo/changes/types.ts:86-91
export interface SemanticInverse { id: Id; sourceChangeId: Id; patches: Array<{ path: ModelPath; expected: ModelSlot; restore: ModelSlot }>; }
// runtime.ts:88-102
interface PreparedRuntimeEdit { extra: Partial<OpmStore>; change: ChangeSet | null; history?: "undo" | "redo"; }
export interface RuntimePendingCommit { documentId: string; pendingId: string; candidate: Modelo; change: ChangeSet | null;
  status: "prepared" | "conflict"; reason?: string; references?: string[]; }
// documentOperations.ts:6-15
export interface CommitReservation<Grant = unknown> { changeId: string; base: Base; status: "preparing" | "granted" | "unknown";
  startedAt: number; expiresAt: number | null; grant: Grant | null; commitSubmitted: boolean; }
```

Flujo:
1. `documentIdForState` = `modeloPersistidoId ?? "local:" + pestanaActivaId` (`runtime.ts:158-160`); un
   `DocumentOperationsController` por documento (secuencia cliente monótona, base observada, reserva única).
2. `submitDocumentChange` (`runtime.ts:188-230`): valida el ChangeSet con `applyChangeSet` y lo aplica vía
   `commitModelo` (o lo prepara si hay reserva).
3. `flushDocumentOperations` (`runtime.ts:289-362`): antes de una tarea, fuerza que la copia de trabajo exacta esté
   en el autosave del servidor (hasta 3 intentos comparando SHA-256 de JSON local vs efectivo remoto) y fija la
   `Base` observada.
4. `prepareDocumentCommit` (`runtime.ts:397-469`): flush → reserva → pide *grant* de un solo uso al servidor.
5. Mientras hay reserva, toda edición humana (y undo/redo) se **encola** como `PreparedDocumentEdit`.
6. `reconcileDocumentCommit` (`runtime.ts:491-616`): valida recibo contra reserva; merge 3-vías del trabajo vivo
   sobre el modelo remoto; rebasa snapshots de undo/redo; registra intención; re-aplica ediciones encoladas
   (cada una revalidada por merge + `applyChangeSet` + `validateRebasedModel`); los conflictos se retienen en
   `pendingDocumentConflicts` con el candidato completo para recuperación.
7. `releaseDocumentCommit` (`runtime.ts:618-651`): libera reserva y re-aplica borradores.
8. `resolveCommitFailure` (`documentOperations.ts:338-356`): solo 400/401/403/404/409/422/429 prueban que no hubo
   commit; timeouts/5xx mantienen la reserva "unknown" hasta consultar el recibo.

`mergePreparedModelEdit` (`documentOperations.ts:306-311, 364-388`) es un merge JSON a 3 vías genérico (arrays y
hojas atómicas, conflicto por ruta). Código compacto y bien razonado; portable.

Código muerto en producción (solo tests): `DocumentOperationsController.prepareGrant` y `alignClientSequence`,
`fusionarPreferenciasBootstrap` (re-exportado en `runtime.ts:37`).

---

## 7. Persistencia, workspace y pestañas

### 7.1 Contratos persistidos que el store produce/consume

```ts
// persistencia/modelos.ts:5-37 (resumen)
export interface ResumenModeloPersistido { id: string; nombre: string; descripcion: string; creadoEn: string; actualizadoEn: string;
  carpetaId?: string | null; ultimaApertura?: string; autosalvado?: boolean; archivado?: boolean; archivadoEn?: string;
  archivadoAuto?: boolean; esBiblioteca?: boolean; esApunte?: boolean; versiones?: VersionResumen[];
  crearVersionAlGuardar?: boolean; revision?: number; /* + estadoCierre derivado, no persistido */ }
export interface ModeloPersistido extends ResumenModeloPersistido { json: string; }
// persistencia/workspace.ts:16-53
export interface ModeloIndice { id: Id; carpetaId: Id | null; archivado?: boolean; archivadoEn?: string; archivadoAuto?: boolean;
  esBiblioteca?: boolean; esApunte?: boolean; ultimoUso?: string; descripcion?: string; autosalvado?: boolean;
  versiones?: VersionResumen[]; mapa?: MapaWorkspace; }
export interface WorkspaceIndice { modelos: ModeloIndice[]; carpetas: CarpetaIndice[]; recientes: Id[];
  busquedaGlobalUltima?: string; preferenciasUi?: PreferenciasUiUsuario; }
export interface WorkspacePersistido { indice: WorkspaceIndice; revision: number; }
// store/tipos.ts:30-43
export type VersionMutationReceipt =
  | { ok: true; operation: VersionMutationOperation; resultId: Id; modelId: Id; versionId: Id }
  | { ok: false; operation: VersionMutationOperation; error: string };
```

- El JSON del modelo se produce con `exportarModelo(modelo, carpetaId)`: **el id de carpeta viaja dentro del JSON
  del modelo** (`carpetaIdDeJson`), además de en el índice.
- **Especie** (apunte/biblioteca) es un bit **solo-índice** (`acciones-ui.ts:157-161`): el record de Postgres no es
  su SSOT; re-sincronizar el índice desde el listado nunca debe "des-graduar" (`sincronizarIndiceConModelosGuardados`,
  `runtime.ts:1548-1569`).
- HTTP consumido (vía `persistencia/backend.ts`): `GET /__deep-opm/modelos?includePayload=1`,
  `GET|PUT|DELETE /__deep-opm/modelos/:id`, `GET|PUT /__deep-opm/modelos/:id/autosave`,
  `POST /__deep-opm/modelos/:id/revisiones` (commit atómico modelo+versión+especie+workspace: guardar con versión,
  graduar, reabrir, crear apunte), `POST|GET|DELETE /__deep-opm/modelos/:id/versiones[/:vid]`,
  `GET|PUT /__deep-opm/workspace` (CAS con `revisionBase`), `GET /__deep-opm/session`,
  `POST /__deep-opm/auth/login|logout`.
- IndexedDB (`localRepository`): `saveHere({ snapshotJson, initialSnapshotJson, remoteBase, expectedLocalRevision,
  history })` con el formato de historial de §5.1.

### 7.2 Flujos

- **Arranque**: `inicializarRuntimeStore` resetea globals; `ui/App.tsx` llama `verificarSesion` (401 ⇒
  `purgeLocalSession` y `requiereLogin`; offline ⇒ restaura el último documento local).
- **Login** `iniciarSesion` → `sincronizarListadoBackend` (lista + workspace en paralelo, anti-rewind por
  revisión, merge 3-vías si el índice cambió durante la red, `persistencia.ts:871-940`).
- **Guardar** `guardarLocal` (`persistencia.ts:210-441`): sin id ⇒ abre "Guardar como"; readOnly ⇒ guarda copia;
  con versión ⇒ `observarBaseRevisionBackend` + `confirmarRevisionBackend`; sin versión ⇒ `PUT` con `revision`
  base (optimistic locking). Reconciliación post-respuesta (§7.3).
- **Autosalvado** (`persistencia.ts:571-670`): control externo `crearAutosalvado`; `PUT …/autosave` con revisión base.
- **Poll de revisión remota** cada 15 s (`persistencia.ts:680-708`): descarga el **modelo completo** solo para leer
  `revision`; alimenta el chip "el agente tiene una revisión nueva".
- **Cargar** `cargarLocal` (`persistencia.ts:443-530`): anula si el usuario editó durante la red; resetea historial;
  `gobernarAperturaBiblioteca`; `cargarYEvaluarDrift`.
- **Nacer apunte** `nacerApunte` (`acciones-ui.ts:645-675`): crea modelo con id pre-generado y dispara
  `guardarComoLocal({ esApunte: true })` (commit atómico con especie "apunte").
- **Graduación/Reapertura** (`workspaceMod.ts:315-858`): diálogo con objetivo precargado (sesión o backend),
  testigo de base, `confirmarRevisionBackend({ graduation | reopening, confirmedByOperator: true })`, merge del
  workspace confirmado, reconciliación con la pestaña de origen.
- **Workspace** `escribirIndiceWorkspace` (`runtime.ts:1485-1529`): cola serial, época de sesión, carga base si no
  se conoce revisión, **merge 3-vías** (`workspaceMerge.ts:33-65`) contra el último índice persistido, `PUT` CAS.
  Cualquier preferencia UI (ancho de panel, zoom del mapa, numeración OPL, familias de "traer conectados") dispara
  una escritura completa del índice al servidor.
- **Logout/401** `purgeLocalSession` (`persistencia.ts:729-841`): reset manual de ~100 campos enumerados a mano
  (no reutiliza los iniciales de los slices; fácil que diverjan).

### 7.3 El patrón "reconciliar respuesta asíncrona" (7 copias)

`guardarLocal.finalizarGuardado` (`persistencia.ts:249-386`), autosalvado (`:595-657`),
`reconciliarGuardadoComo` (`acciones-ui.ts:719-896`), `renombrarModeloActual` (`:484-591`),
`confirmarGraduacion` (`workspaceMod.ts:500-601`), `confirmarReaperturaTaller` (`:772-857`),
`restaurarVersionComoCopia` (`carpetas.ts:52-136`). Todas: capturan época/pestaña/JSON de origen → al volver
chequean época y `requiereLogin` → deciden `origenSigueActivo` → calculan `huboCambiosPosteriores` por JSON →
si el origen no está activo, parchean la pestaña; si lo está, `marcarSnapshotModelo` + `estadoModelo` + parche de
`snapshotJson`. Las guardas de origen también están triplicadas: `restorationOriginIsCurrent`
(`carpetas.ts:281-292`), `asyncOriginIsCurrent` (`acciones-capacidades.ts:674-685`), `versionOriginIsCurrent`
(`workspaceMod.ts:969-980`), `asyncAnchorOriginIsCurrent` (`acciones-anclaje.ts:255-264`). Y la "revisión
conocida" dos veces: `knownRevision/isStoredRevisionObsolete` (`persistencia.ts:850-869`) y
`revisionGuardadoObsoleta` (`acciones-ui.ts:934-951`); `upsertModeloGuardado` (`persistencia.ts:942-955`) vs
`upsertModeloGuardadoComo` (`acciones-ui.ts:921-932`).

### 7.4 Pestañas

Funciones puras correctas (`pestanas.ts:20-167`: `cerrarPestana` impide cerrar la última y la sucia sin forzar;
`reordenarPestanas` valida permutación). El slice (`pestanas.ts:181-316`) delega en `activarEstadoPestanas`
(`runtime.ts:868-908`), que reemplaza el estado activo completo (≈30 claves) y dispara `cargarYEvaluarDrift`.
`cambiarPestanaActiva` re-gobierna la biblioteca buscando `indice.modelos[].id === modelo.id`
(`pestanas.ts:294-296`), pero `modelo.id` es `"modelo-1"` para todo modelo no nacido como apunte
(`modelo/operaciones/creacion.ts:20`), no el id del record (ver §9). Hay **dos pestañas iniciales distintas**:
`modelo.ts:30` y `pestanas.ts:175` crean cada una `crearPestanaNueva()`; el `modelo` top-level y el de
`pestanasAbiertas[0]` nacen como objetos distintos hasta el primer `estadoModelo`.

---

## 8. Reglas OPM y reglas de producto codificadas en el área

Marcadas **[OPM]** las que expresan semántica ISO 19450/OPM (sagradas), **[bimodal]** las que sostienen la
simetría OPD↔OPL, **[prod]** las de producto/UX (se pueden rediseñar).

| # | Regla | Ubicación | Tipo |
|---|---|---|---|
| R1 | Toda mutación semántica pasa por un punto único que normaliza puertos y abanicos antes de aceptar | `runtime.ts:1115-1116` | [OPM] invariante estructural |
| R2 | Abanico lógico (XOR/OR) solo existe con ≥2 ramas válidas que comparten puerto; si deja de validar, se disuelve | `modelo/abanicos.ts:286-297` vía `runtime.ts:1116` | [OPM] |
| R3 | Un abanico se edita solo en su OPD propietario; cambios desde OPD refinado/heredado se rechazan (también en undo/redo con `origen:"historial"`) | `runtime.ts:1117-1123`, `1663-1667`, `1725-1729`; `modelo/inheritedFanGuard.ts:6-49`; pre-chequeo duplicado en `acciones-enlace.ts:611-615` | [OPM] consistencia entre niveles |
| R4 | Familias de efectos por preestado: ≥2 enlaces únicos, ≥2 estados de dominio, proceso y objeto válidos; edición que las rompe se rechaza | `runtime.ts:1124-1128`; `modelo/familiasEfectosPreestado.ts:6-36` | [OPM] extensión declarada |
| R5 | Vistas derivadas (`opd.vista.readOnly`) no son editables; simulación y solo-lectura bloquean con mensaje explícito, simulación primero | `runtime.ts:1070-1096` | [prod] (vistas derivadas = [OPM] proyección) |
| R6 | Tres ciudadanos seleccionables exclusivos: entidad, enlace, estado; mezcla heterogénea colapsa la selección única | `runtime.ts:1411-1441` | [prod] sobre ontología [OPM] |
| R7 | Objeto con estados conserva ≥2 estados; eliminar selección de solo-estados usa `eliminarEstado` uno a uno | `seleccion.ts:68-82`; `modelo/operaciones/estados.ts:165-166` | [OPM] |
| R8 | Multi-selección de estados solo dentro del mismo objeto propietario; `designarBatch` idem | `seleccion.ts:281-300`; `acciones-estados.ts:485-502` | [prod] |
| R9 | Designaciones: default y current excluyentes; inicial/final/default/current vía kernel | `acciones-estados.ts:523-535, 566-585`; `modelo/estadosDesignaciones.ts:14-26` | [OPM] |
| R10 | No se suprime un estado con enlaces incidentes; supresión por aparición = ¬global ∧ ¬local, requiere que el objeto aparezca en el OPD activo | `modelo/estadosDesignaciones.ts:44`; `acciones-estados.ts:359-429, 543-564` | [OPM] consistencia de vista |
| R11 | Unicidad de nombre de cosa en el modelo: colisión al crear o renombrar abre resolución (reutilizar si mismo tipo, renombrar, cancelar, ir a ubicación). Reutilizar = nueva **aparición** de la misma cosa, no copia | `acciones-entidad.ts:96-139, 212-236, 540-663`; `modelo/operaciones/colisionNombre.ts:37-61` | [OPM] identidad por nombre |
| R12 | Una cosa aparece a lo sumo una vez por OPD; traer/crear aparición existente solo la selecciona | `acciones-entidad.ts:146-165`; `acciones-canvas.ts:918-943` | [OPM] política de apariciones |
| R13 | Un refinamiento por tipo y cosa: si ya hay in-zoom/unfold, navegar a él en vez de crear | `acciones-opd.ts:116-124, 153-161` | [OPM] |
| R14 | Refinar exige intención previa (no muta) y pregunta guía; unfold exige relación (modo de despliegue) | `acciones-opd.ts:174-268` | [prod] (modo = [OPM] agregación/exhibición/generalización/clasificación) |
| R15 | Quitar refinamiento y devolver a Bocetos requieren confirmación con alcance (subárbol OPD) y re-verifican que el vínculo no cambió | `acciones-opd.ts:327-488` | [prod] seguridad |
| R16 | El árbol OPD **es** la jerarquía de refinamiento: mover un OPD bajo otro padre está prohibido desde gestión ("usa Integrar desde Bocetos") | `uiPanel.ts:108-125` | [OPM] |
| R17 | Nombre de OPD único entre hermanos (rechazo en `uiPanel.ts:156-165`; variante con sufijo automático solo usada en tests `acciones-opd.ts:31-90`) | idem | [prod] |
| R18 | Orden temporal del in-zoom: solo subprocesos internos al contorno de una descomposición de proceso en OPD hijo se reordenan en el timeline, con Y acotada al contorno | `runtime.ts:945-970`; `acciones-canvas.ts:852-877` | [OPM] (orden vertical = orden de ejecución) |
| R19 | Arrastrar un subproceso interno **declara** `ordenInzoom` (re-derivación global del OPD, idempotente) en el mismo commit | `acciones-canvas.ts:772-782` | [OPM][bimodal] |
| R20 | Edición OPL libre: se planifica, cualquier diagnóstico "error" bloquea; parches se aplican atómicamente (1 undo) | `acciones-canvas.ts:341-365` | [bimodal] |
| R21 | Edición inversa desde OPL (renombrar entidad/estado, etiqueta de enlace) usa las mismas operaciones que el canvas | `acciones-canvas.ts:222-330` | [bimodal] |
| R22 | Grupo estructural = enlaces del mismo tipo estructural que comparten origen o destino (entidad portadora) | `enlaces.ts:388-403`; separar/automático exigen enlace estructural fundamental `enlaces.ts:140-144, 165-169` | [OPM] |
| R23 | Auto-invocación solo sobre procesos | `acciones-enlace.ts:373-396` | [OPM] |
| R24 | Crear abanico exige ramas compatibles exactas y alinea el ancla común antes de formar | `acciones-enlace.ts:342-371` | [OPM] |
| R25 | Modo enlace no se enciende en solo-lectura (no pintar targets que mienten) | `acciones-enlace.ts:52-59, 82-99` | [prod] |
| R26 | Composición de modelos valida integridad referencial y advierte (no bloquea) conflictos de linealidad | `acciones-capacidades.ts:211-266` | [OPM] recurso lineal |
| R27 | Coherencia de descomposición = preservación de firma de frontera (condición necesaria, no suficiente) | `acciones-capacidades.ts:598-613` | [OPM] |
| R28 | Export canónico gateado por densidad; "Boceto sin integrar" bloquea en Modelo y degrada a observación en Apunte | `acciones-canvas.ts:398-414` | [prod] (R-OPD-REF-20) |
| R29 | Mesa de exploración solo en Apunte activo cuyo `modelo.id` coincide con el record | `acciones-mesa-exploracion.ts:142-153` | [prod] |
| R30 | Especie: biblioteca abre en solo-lectura; apunte y biblioteca excluyentes; graduar/reabrir cruzan commit atómico confirmado por operador; reabrir exige quitar rol biblioteca | `acciones-ui.ts:713-715`; `workspaceMod.ts:261-310, 315-858` | [prod] |
| R31 | Simulación: escenario invalidado si la revisión base del modelo cambió (identidad de objeto) | `simulacion.ts:95-99, 270-292` | [prod] |
| R32 | Drift de anclaje se mide contra la biblioteca **persistida**, nunca contra otra pestaña; una evaluación vieja no pisa una nueva | `acciones-anclaje.ts:88-123` | [prod] |
| R33 | Commit remoto: solo rechazos contractuales liberan la reserva; incertidumbre de red mantiene la valla | `documentOperations.ts:338-362` | [prod] integridad |

---

## 9. Hallazgos de riesgo (verificados leyendo código)

1. **Redo tras commit remoto ignora el rebase** — `runtime.ts:1701-1742`: se calcula `redoTarget` rebasado y
   validado, pero se aplica `set(estadoModelo(siguiente, …))` (el snapshot sin rebase). Tras un commit del agente,
   Ctrl+Y puede revertir en silencio lo que el agente incorporó. `deshacerRuntime` sí usa `undoTarget` (`:1670`).
2. **Undo/redo saltan el bloqueo de edición** — `deshacerRuntime`/`rehacerRuntime` no llaman
   `mensajeBloqueoEdicion`; Ctrl+Z (`app/ports/globalShortcutsPort.ts:228`) muta el modelo en modo simulación o
   con `readOnly` (p. ej. tras "Editar biblioteca" → volver a solo-lectura). Contradice R5.
3. **Identidad dual del documento** — `modelo.id` (en el JSON, `"modelo-1"` por defecto) vs `modeloPersistidoId`
   (id del record). El comentario de `acciones-ui.ts:640-644` lo admite. Se usa `modelo.id` para derivar especie
   (`acciones-canvas.ts:371, 385, 402, 500`), biblioteca al cambiar pestaña (`pestanas.ts:294-296`) y acceso a la
   Mesa (`acciones-mesa-exploracion.ts:147-149`): para modelos no nacidos como apunte, esas derivaciones fallan
   (p. ej. una biblioteca abierta en pestaña pierde su solo-lectura al volver a ella).
4. **`crearOpmStore` no aísla** (§3.2): comparte `undoStack`, `storeApi`, controllers y pestañas del singleton.
5. **Invariante de selección declarado pero no sellado**: 140 escrituras directas de `seleccionId`; varias dejan
   `estadoSeleccionId` o `seleccionados` inconsistentes (`navegarAEnlaceDesdeTabla`, `saltarAResultadoBusqueda`,
   `navegarAviso`, `seleccionarPartePlegada`).
6. **Errores silenciosos** pese a la "Ley silencio-cero": `fijarEsenciaSeleccionada`, `fijarAfiliacionSeleccionada`,
   `fijarLinealidadSeleccionada` (`acciones-entidad.ts:301-320`), `moverEntidad`/`moverApariencia`/
   `actualizarVerticesEnlace` (`acciones-canvas.ts:745-757, 879-883`) descartan `resultado.error`.
7. **Coste por edición** (§4.3): serializaciones completas repetidas + checkpoint IndexedDB con hasta 100
   snapshots serializados; memoria: 100 `Modelo` completos por pestaña.
8. **Poll de 15 s descarga el payload completo** para leer un número (`persistencia.ts:680-695`).
9. **Confirmaciones inconsistentes**: `workspaceMod.ts:114-123, 866` usan `globalThis.confirm` directo; el resto
   usa `runtimeEffects.confirm`; muchas fechas usan `new Date()` directo pese a `runtimeEffects.now`.
10. **Stubs vestigiales** que aparentan persistencia: `leerPreferenciaBooleana` / `escribirPreferenciaBooleana`
    (no-op, `runtime.ts:1581-1589`) ⇒ `mostrarArchivados`/`mostrarVersiones` nunca persisten;
    `leerIndiceWorkspace` devuelve vacío (`:1531-1533`); `listarModelosGuardadosSeguro` devuelve `[]` (`:1338-1340`).

---

## 10. Olores de sobreingeniería y acreción (con ejemplos)

1. **Triple registro de claves** (`tipos.ts` + `sliceTypes.ts` + `modelo/contrato.ts` + test): gobernanza
   autorreferente; la "capacidad" no aporta semántica (diálogos en `sessionState`).
2. **Slices sin frontera**: el "slice modelo" contiene persistencia (`acciones-ui.ts`), preferencias OPL,
   diálogos; `carpetas.ts` contiene versiones y búsquedas; `workspaceMod.ts` contiene carpetas; `uiPanel.ts`
   contiene comandos de modelo (renombrar/mover OPD).
3. **Boilerplate de acción** (~180×): mismo esqueleto "leer selección → op pura → mensaje de error → commit con
   extra". En `acciones-enlace.ts:398-607` diez acciones consecutivas difieren solo en la función del kernel.
4. **Duplicados "por id" vs "seleccionado"** en estados: `eliminarEstado` / `eliminarEstadoSeleccionado`,
   `renombrarEstadoSeleccionado(estadoId, n)` / `renombrarEstadoSeleccionadoSmart(n)`,
   `designarEstadoComo` / `designarEstadoSeleccionado`, `suprimirEstadoPorId` / `suprimirEstadoSeleccionado`,
   `abrirModalDuracion` / `abrirModalDuracionEstadoSeleccionado`; tabla de designación duplicada
   (`acciones-estados.ts:523-535` vs `:566-585`). Igual en plegado: `cambiarModoPlegadoApariencia` /
   `fijarModoPlegadoApariencia` (alias puro, `acciones-canvas.ts:562-564`); `buscarEnPanelOpl` = alias de
   `fijarBusquedaOpl`; `guardarComoLocal` vs `guardarComoLocalConDescripcion` (dos rutas de "guardar como" con
   reglas de nombre distintas).
5. **Estado derivado almacenado**: `workspaceLocal` (siempre `workspaceDesdeModelo(...)`, con
   `carpetaId: "local"` constante, "compatibilidad ronda 5"), `modelosRecientes`, `descriptorMapaCache`
   (+ recálculo dentro de `commitModelo`), `puedeDeshacer/puedeRehacer`, `esBibliotecaAbierta` duplicando el
   índice, anchos de panel duplicando `preferenciasUi`.
6. **Espejo de la pestaña activa** en top-level + `pestanasAbiertas` + globals de módulo, con
   `sincronizarPestanaActivaEnLista` y `activarEstadoPestanas` reseteando 30 claves.
7. **Flujos de diálogo gemelos**: graduación (9 campos) y reapertura (7 campos) ≈ 540 líneas casi idénticas
   (`workspaceMod.ts:315-858`); `prepararObjetivoTransicion` ya es común, el resto no.
8. **Reset de sesión a mano** (`purgeLocalSession`, 110 líneas enumerando campos).
9. **Dos canales de feedback** (`mensaje` + `feedbackStore`), más `idsResaltadosTemporales` con timer de módulo.
10. **Hacks de re-render** `modelo: { ...modelo }` para preferencias visuales (§3.4).
11. **Features de circunstancia / marginales** en el store central: `mostrarPlaceholderAiOpl` ("Próximamente…"),
    `registrarCrucePuenteSkill` (contador de "cruces" app↔skill persistido en preferencias, observable g3),
    `copiarContextoSkillAlPortapapeles`, `copiarLogDecisionesAlPortapapeles`, `anotarAnclaEnMesa`/
    `ratificarAnclaConFuente` (registro [RATIFICAR] de la skill), `vistaMobileActiva`,
    `frecuenciaUsoCommandPalette` (no persistida), `headlessSimulacion`, mapa del sistema con 13 campos y
    persistencia por modelo en el índice, `crearObjetoDemo/crearProcesoDemo` (nombres de demo en API productiva).
12. **Comentarios-bitácora** ("P0 ronda 4", "L4 ronda 23 (#15)", "BUG-2026…", "IFML H-3 / Ronda 15 L3") que
    documentan historia en vez de intención; útiles para arqueología, ruido para mantenimiento.
13. **Catálogo UI en `store/`** (`acciones-contextuales.ts`) y operaciones de modelo en `canvas/` (consumidas por
    el store): nombres de carpeta no reflejan capas.
14. **Indirección de ports/viewmodels** (fuera del área, acoplada a ella): 112 ports + 48 viewmodels (~9 k l.)
    que re-exponen claves del store una a una (`zustandHistoryPort.ts`).

---

## 11. Acoplamientos principales

- **store → kernel** (`modelo/*`, `opl/*`, `canvas/*` puro, `serializacion/*`): sano y deseable (el store no
  reimplementa semántica). Debe mantenerse como única dirección.
- **store → persistencia/backend HTTP**: directo desde acciones (no hay servicio de sincronización); cada acción
  gestiona épocas, carreras y reconciliación.
- **store ↔ agente**: `runtime.ts` conoce ChangeSet/Base/Receipt, reservas y grants; `documentOperationsPort` se
  engancha por listeners (`onPendingCommit`, `onIntentHistoryAction`). `commitModelo` cambia de comportamiento
  (encola en vez de aplicar) si hay reserva: toda acción humana depende del estado del agente.
- **runtime ↔ slices**: `commitModelo`/`estadoModelo` leen y escriben claves de pestañas, mapa, selección y
  diálogos que pertenecen a otros slices; `activarEstadoPestanas` invoca `cargarYEvaluarDrift` (anclaje).
- **Globals de módulo** acoplan todas las instancias del store y los tests entre sí.
- **Mapa ↔ commit** (recálculo de descriptor en `commitModelo`), **simulación ↔ readOnly** (reutiliza el flag de
  solo-lectura del modelo y guarda el previo en `readOnlyPrevSimulacion`, cuando `mensajeBloqueoEdicion` ya
  prioriza `contextoSimulacion`), **mapa ↔ simulación** (exclusión mutua cableada en ambos slices).
- **`modelo.id` como clave de índice** (§9.3) acopla especie/biblioteca a un id que el JSON no garantiza.

---

## 12. Piezas de alta calidad para portar casi tal cual

- `store.ts:51-80` `useOpmStore`: hook con caché por selección e identidad estable.
- Kernel-first: el contrato `Resultado<Modelo>` de las operaciones puras y la disciplina "el store no inventa
  semántica". Portar el patrón, no el boilerplate.
- `commitModelo` como **idea** (punto único con bloqueo + normalización + invariantes OPM + no-op detection):
  conservar sus guardas R1–R5 exactamente.
- `documentOperations.ts`: `DocumentOperationsController` (máquina de estados pequeña y explícita),
  `mergePreparedModelEdit`/`mergeValue` (merge JSON 3-vías), `resolveCommitFailure`/`isDefiniteCommitRejection`.
- `intentHistory.ts`: libro de intenciones con estados explícitos (si el agente se conserva).
- `workspaceMerge.ts`: merge 3-vías por id/clave del índice (si el índice sigue siendo un documento único con CAS).
- `sessionEpoch.ts`: invalidación de async por sesión + serialización de logout (pequeño y correcto).
- Funciones puras de `pestanas.ts:20-167` (cerrar/reordenar/duplicar/etiqueta).
- `simulacion.ts` como patrón "slice orquesta kernel puro" (quitando la guarda repetida 5 veces).
- `acciones-anclaje.ts::construirResolverHashVivo` y el anti-race por `evaluacionDriftVigente`.
- `seleccion.ts::validarMismoObjetoPropietario` y `runtime.ts::estadoSeleccionDesdeIds` (lógica, no la forma).
- `mensajeBloqueoEdicion` (orden de causas y mensajes accionables).

---

## 13. Recomendaciones keep / simplify / cut

| Pieza | Recomendación | Justificación |
|---|---|---|
| Pipeline `commitModelo` + guardas R1–R5 | **keep** (reescribir como `aplicar(op, opciones)`) | Es el único lugar donde se sellan invariantes OPM; debe seguir siendo único e ineludible. |
| Boilerplate de ~180 acciones | **simplify** | Un helper `ejecutar({ requiere: "entidad" \| "enlace" \| "estado", op, seleccionTras, mensaje })` reduce ~4 k líneas a tablas declarativas; conserva los mensajes de precondición. |
| Undo/redo por snapshots | **keep + simplify** | Simple y robusto con modelos inmutables; guardar referencias (structural sharing) en vez de clones, vivir **dentro** del estado del documento (no globals), agrupar gestos continuos (drag/nudge) en una entrada, aplicar el bloqueo de edición, no serializar 100 snapshots por tecla (persistir historial al guardar/cerrar o como parches). Corregir `rehacerRuntime` (§9.1). |
| Agente: reservas, prepared edits, rebase, intentHistory (~1 100 l.) | **simplify / aislar** | Semánticamente valioso, pero experimental (aceptación pendiente). Aislarlo en un módulo opcional que envuelva `aplicar()`; si se conserva, unificar historial en un solo libro de operaciones (humanas y agénticas con inversa) en vez de snapshots + barrera + rebase de snapshots. |
| Triple registro de claves (`sliceTypes`, `contrato.ts`, test) | **cut** | Burocracia autorreferente; el tipo del store basta. |
| División en 11 slices + 10 fragmentos `acciones-*` | **simplify** | Reorganizar por dominio real: `documento` (modelo+historial+persistencia por pestaña), `seleccion`, `interaccion` (modos), `ui` (diálogo activo, paneles, preferencias), `workspace`, `simulacion`. |
| Espejo pestaña activa (top-level + `pestanasAbiertas` + globals) | **cut** | `documentos: Record<PestanaId, Documento>` + `activa`; selectores derivan el activo. Elimina `sincronizarPestanaActivaEnLista`, clones por commit y el reset de 30 claves. |
| Selección 3 ids + `seleccionados` + `modoSeleccion` | **simplify** | `seleccion: { tipo: "entidad" \| "enlace" \| "estado"; ids: Id[] } \| null` (el propio spec lo anticipa). Sella el invariante por construcción. |
| ~30 banderas de diálogo + pares abrir/cerrar | **simplify** | `dialogo: { tipo; payload } \| null` + 3–4 paneles persistidos. |
| Flujos transitorios (nuevaCosa, refinamiento, confirmaciones, colisión, graduación×9, reapertura×7, rol biblioteca) | **simplify** | Un `flujo` discriminado; graduación y reapertura comparten un único "transición de especie" con destino. |
| 7 copias de reconciliación post-guardado + 4 guardas de origen + 2 `knownRevision` + 2 `upsert` | **simplify** | Un servicio `sincronizacion` fuera del store con `reconciliar(origen, enviado, confirmado)` y `origenVigente(captura)`. |
| `dirty` / `dirtyModelo` / `pestana.dirty` / `snapshotJson` | **simplify** | Hash/firma del último guardado por documento + bandera "solo layout"; derivar el resto. |
| `workspaceLocal`, `modelosRecientes`, `descriptorMapaCache`, `puedeDeshacer/Rehacer`, `esBibliotecaAbierta` | **cut** (derivar) | Estado derivado almacenado; fuente de divergencias. |
| Identidad `modelo.id` vs record | **simplify** (migrar) | Una sola identidad de documento; migrar JSON existentes asignando `modelo.id = record.id` al cargar, o dejar de usar `modelo.id` como clave. |
| Workspace CAS + `workspaceMerge` | **keep** (reubicar) | Contrato con backend vigente; mover a servicio. Evaluar separar preferencias UI del índice para no hacer PUT del índice completo por cada ancho de panel. |
| Preferencias UI (12 setters) | **simplify** | `fijarPreferencia(clave, valor)` tipado + debounce de escritura. |
| `persistencia.ts` login/sesión/autosalvado/carga | **keep + simplify** | Capacidades núcleo; mantener épocas de sesión y anti-rewind por revisión; eliminar stubs vestigiales. |
| Poll de revisión remota | **simplify** | Endpoint liviano de revisión (o ETag) en vez de descargar el payload; o suscripción. |
| Versiones (crear/restaurar como copia/eliminar) | **keep** | Capacidad importante con recibo tipado `VersionMutationReceipt`. |
| Carpetas, cortar/pegar con TTL, mover directo, archivar | **keep + simplify** | Útiles; unificar "cortar/pegar" y "mover directo" (drag) en una sola operación de mover. |
| Especie apunte/biblioteca, graduación/reapertura atómicas | **keep** (fusionar flujos) | Reglas de producto con commit atómico en servidor; conservar confirmación de operador y testigo de base. |
| Simulación | **keep + simplify** | Quitar el truco `readOnly`/`readOnlyPrevSimulacion` (el bloqueo ya prioriza `contextoSimulacion`) y la guarda de escenario repetida 5 veces. |
| Mapa del sistema (13 campos, persistencia por modelo) | **simplify** | Estado local de la vista + selectores; persistir solo si hay demanda. |
| Drift/anclaje/calcar/anclar | **keep** | Capacidad de reutilización con reglas claras (R32); mantener anti-race. |
| Requisitos, submodelos, composición, estereotipos, ontología | **keep** (evaluar uso) | Capacidades OPM extendidas legítimas; mover a módulo de "capacidades" con el helper genérico. |
| Razonamiento, coherencia de descomposición, decisión | **keep** (como consultas) | No mutan; deberían ser selectores/consultas, no acciones del store que escriben `mensaje`. |
| Notas de mesa, log de decisiones, [RATIFICAR], contexto skill, cruces puente skill | **cut** del núcleo / plugin | Acoplados a una skill externa y a observables de un experimento (g3); fuera del modelador. |
| Mesa de exploración, ficha de trabajo, lentes | **simplify** / plugin | Experimentales; aislarlas. |
| `mostrarPlaceholderAiOpl`, `frecuenciaUsoCommandPalette`, `vistaMobileActiva`, `headlessSimulacion`, `crear*Demo` | **cut** o renombrar | Marginales o de circunstancia. |
| `feedback.ts` + `mensaje` + `idsResaltadosTemporales` | **simplify** | Un único servicio de notificaciones (toasts con TTL + badges de validación). |
| `acciones-contextuales.ts` | **keep** (mover a `ui/`) | Catálogo puro bien hecho; no pertenece al store. |
| `runtimeEffects.ts` | **simplify** | Inyectar efectos al crear el store y usarlos siempre (hoy hay `confirm`/`Date` directos). |
| Tablas/árbol/búsquedas (`tablaEnlaces*`, `gestionArbol*`, `busqueda*`) | **simplify** | Estado local de componentes, salvo lo que otras vistas necesiten. |
| Código solo-test (`prepareGrant`, `alignClientSequence`, `fusionarPreferenciasBootstrap`, helpers puros de `acciones-opd.ts:31-90`) | **cut** | Sin consumidores productivos. |
| Stubs (`leer/escribirPreferenciaBooleana`, `leerIndiceWorkspace`, `listarModelosGuardadosSeguro`) | **cut** | Vestigios de la era localStorage que simulan persistencia inexistente. |

---

## 14. Esbozo de la arquitectura de estado sugerida para la reescritura

```ts
interface Documento {            // uno por pestaña; nada espejado
  id: DocumentoId;               // = id del record si está persistido (identidad única)
  modelo: Modelo;
  opdActivoId: Id;
  historial: { pasado: Modelo[]; futuro: Modelo[] };  // referencias inmutables, entradas agrupables
  guardado: { revision: number | null; firma: string; especie: "apunte" | "modelo" | "biblioteca"; carpetaId: Id | null };
  soloLayoutDesdeGuardado: boolean;
}
interface Estado {
  documentos: Record<PestanaId, Documento>; orden: PestanaId[]; activa: PestanaId;
  seleccion: { tipo: "entidad" | "enlace" | "estado"; ids: Id[] } | null;
  interaccion: { tipo: "normal" } | { tipo: "crear"; cosa: TipoEntidad } | { tipo: "enlazar"; … } | { tipo: "simular"; ctx: ContextoSimulacion };
  flujo: FlujoTransitorio | null;          // nombre, colisión, refinamiento, confirmación, transición de especie
  dialogo: { tipo: DialogoId; payload?: unknown } | null;
  preferencias: PreferenciasUiUsuario;     // persistidas con debounce
  sesion: { requiereLogin: boolean; epoca: number };
  workspace: { indice: WorkspaceIndice; revision: number | null; modelos: ResumenModeloPersistido[] };
}
// Un único punto de mutación semántica:
aplicar(op: (m: Modelo, ctx) => Resultado<Modelo | { modelo: Modelo; seleccion?; mensaje? }>, opts?: { layout?: boolean; agrupar?: string }): boolean
```

`aplicar` = bloqueo de edición (R5, también para undo/redo) → op pura → normalización (R1–R2) → guardas
(R3–R4) → no-op → historial → notificación → checkpoint diferido. El canal agéntico, si se conserva, se inserta
como *middleware* de `aplicar` y del historial, no como condicionales dentro de él.
