# Dossier — Capa de aplicación `app/src/app` (puertos y viewmodels) y arranque

Área: `app/src/app/**` (ports/ 112 archivos, viewmodels/ 48 archivos, `features.ts`,
`bugCapture.ts`) más `app/src/main.tsx`, `app/src/editorBootstrap.tsx`,
`app/src/completitud.test.ts` y `app/src/version.ts`.

Estado observado: `main` en `8ada528` (2026-09-30). La historia git disponible es corta
(69 commits desde 2026-07-26), así que el origen del patrón puertos/viewmodels no se
puede rastrear por commits. No hay ADR ni spec que lo justifique; la única mención
documental es la cadena de propagación de
`docs/superpowers/specs/2026-07-27-taller-modelos-ciclo-reversible-design.md:219-229`
(«kernel → persistencia → store → **ports y viewmodels** → UI → tutor → manuales →
E2E»), que trata la capa como un peldaño obligatorio por el que debe pasar cada
capacidad.

---

## 0. Veredicto en una página

**La capa `app/` es mayormente burocracia arquitectónica, con un núcleo pequeño de
costuras reales que sí vale la pena conservar.**

- **Aproximadamente 3.5k de 5.5k líneas no triviales son indirección mecánica**: 31
  interfaces de puerto cuyos campos se declaran literalmente como `OpmStore["x"]`, y
  49 adaptadores `useZustand*Port` que hacen `useOpmStore((s) => s.x)` campo a campo
  y devuelven un objeto con los mismos nombres. A eso se suman unas 20 viewmodels que
  solo reenvían campos (≈800 líneas), sin derivar nada.
- **No hay abstracción, solo alias.** Todas las interfaces «puro-store» dependen del
  tipo del store (`import type { OpmStore } from "../../store"`), y cada una tiene una
  sola implementación. Ninguna prueba inyecta un adaptador falso a un componente a
  través de ellas. Tampoco protegen una frontera: **38 archivos de `ui/` llaman
  `useOpmStore` directamente (177 llamadas) y 34 usan `store.getState()`**. El propio
  `JointCanvas` usa `useJointCanvasViewModel()` y, además, 7 `useOpmStore` directos
  (`render/jointjs/JointCanvas.tsx:161-177`).
- **Costo real por capacidad**: una sola acción del store se repite en 6 a 18
  archivos de `app/` (`cambiarOpdActivo`: 30 apariciones en 18 archivos;
  `abrirModalImagen`: 23 en 15; `renombrarEntidadDesdeOpl`: 11 en 6). Cada
  capacidad nueva paga ese impuesto. Es la «propagación» que exige la spec del
  ciclo reversible.
- **Costo en rendimiento**: los adaptadores suscriben campos que el consumidor no usa.
  `App` (la raíz) se suscribe a `hoverOplRef` a través de `usePanelOplViewModel →
  useZustandOplPort`, y en cada render recalcula sin memo
  `listarAvisosDiagnostico(modelo, …)` (`ui/App.tsx:137`). Por lo tanto, **pasar el
  cursor sobre una palabra del OPL vuelve a renderizar toda la raíz y reejecuta el
  diagnóstico completo**.
- **Costuras reales (conservar, simplificando nombres)**: `documentOperationsPort`
  (cola de cambios con permiso, recibo e inversa), `agentTaskPort` (ciclo de tarea del
  agente), `documentPersistencePort` (IndexedDB, sincronización, conflictos y
  recuperación), `piecePort`, `reviewOwnerPort`/`reviewPort`, el registro de atajos
  (`globalShortcutsPort`) y varias proyecciones puras de alto valor en viewmodels
  (`panelOplViewModel`, `tablaEnlacesViewModel`, `busquedaCosasViewModel`,
  `panelDiagnosticoViewModel`, `arbolOpdEstructura`, `timelineViewModel`,
  `agentTaskViewModel`). Estas costuras se prueban con dependencias inyectadas y
  aislan I/O, credenciales o concurrencia; en ellas el patrón sí paga.
- **Código muerto dentro del área**: toda la familia «mapa del sistema» (el flag
  `APP_FEATURES.mapaSistema = false`; `ui/MapaSistema.tsx` y
  `ui/toolbar/ToolbarMapaSistema.tsx` no se importan en ningún lugar),
  `documentFocusViewModel.ts` (140 líneas, sin consumidor), `useZustandSearchDialogsPort`,
  `useZustandEntityMetadataOpenersPort`, `opdsEnOrdenDeArbol`, `documentPolicy` en
  `appShellViewModel` (se calcula y nadie lo lee), `menuPrincipal*` en
  `toolbarChromePort` (menú retirado) y `mostrarPlaceholderAiOpl` (botón que solo
  muestra «Próximamente…»).

**Recomendación para la reescritura:** eliminar los puertos-alias y sus adaptadores.
La UI debe leer mediante selectores tipados del store o hooks de dominio pequeños y
llamar comandos del kernel/store. Se conservan como módulos de servicio,
independientes de React y con I/O inyectable, los cuatro o cinco seams reales. Las
proyecciones puras se trasladan como funciones de dominio/presentación junto a sus
tests, no como hooks «viewmodel».

---

## 1. Alcance y cifras

| Grupo | Archivos | LOC | Naturaleza |
|---|---:|---:|---|
| `ports/zustand*.ts` (adaptadores) | 49 | 1 693 | `useOpmStore` campo a campo; casi sin lógica |
| `ports/*Port.ts` alias de `OpmStore[...]` | 31 | ≈1 000 | interfaces con campos tipados como `OpmStore["x"]` |
| `ports/*` con lógica real | 8 | 1 793 | docOps, agent, docPersistence, piece, shortcuts, workspace, review×2 |
| `ports/*.test.ts` | 8 | 1 310 | 4 valiosos (agent, docPersistence, piece, shortcuts), 4 triviales |
| `viewmodels/*.ts` (no test) | 40 | 2 724 | ≈800 LOC de reenvío puro; resto, proyecciones reales |
| `viewmodels/*.test.ts` | 8 | 608 | prueban funciones puras exportadas, no los hooks |
| `features.ts`, `bugCapture.ts` | 2 | 25 | flag dormido y constantes de captura de bugs |
| `main.tsx`, `editorBootstrap.tsx`, `version.ts` | 3 | 129 | arranque |
| `completitud.test.ts` | 1 | 419 | test transversal de exhaustividad OPM |

Contexto del store que la capa refleja: `OpmStore` (`store/tipos.ts:140`) tiene
alrededor de 540 miembros entre estado y acciones, en 956 líneas. Los puertos son
cortes de esa superficie.

---

## 2. Arranque

### 2.1 `main.tsx` (49 LOC)
- Importa de forma eager 12 CSS de Inria Serif/Sans (pesos 300/400/700 con itálicas) y
  JetBrains Mono Variable, `jointjs/dist/joint.css`, `render/jointjs/jointjs.css`,
  `ui/focus.css`, `ui/arbol/arbol.css`, `ui/toolbar/toolbar.css` y `ui/menus.css`.
  El comentario L2-9 explica que Inria no incluye los pesos 500/600; el navegador los
  sintetiza y, cuando se necesitan de verdad, se recurre a JetBrains Mono.
- **Ruteo mínimo** (L30-49): con `^/revision/([^/]+)/?$` carga de forma perezosa
  `ui/review/RevisionReader` y `persistencia/reviewClient.createReviewPort({ token })`,
  y monta el **lector de revisión compartida** sin autenticación ni store editable. En
  cualquier otro caso importa de forma perezosa `./editorBootstrap`. Si algo falla,
  deja un texto plano de recuperación.
- **Contrato de URL**: `/revision/:token` es público y se comparte. Una reescritura
  debe conservarlo o redirigirlo.
- Olor menor: la ruta de lectura también descarga todas las fuentes y el CSS de
  JointJS y del editor, porque los imports están arriba del if.

### 2.2 `editorBootstrap.tsx` (61 LOC)
- `render(<App />)`. Suscribe `store.dirty` para añadir o quitar un listener de
  `beforeunload` (protección contra salir con cambios sin guardar) y lo limpia en
  HMR (`import.meta.hot.dispose`).
- `VITE_HEADLESS_RENDER === "true"` monta, mediante import dinámico eliminado por DCE,
  `window.__opmRenderHeadless__` (`render/jointjs/headlessRender`). Es la superficie
  para un agente consumidor, según el comentario H1.
- En `import.meta.env.DEV` expone `window.__opmTest = { exportarModeloActual,
  nuevoModeloPlano }`. Los e2e lo usan en 29 lugares (`e2e/_smoke-helpers.ts:364`,
  `e2e/mobile-readonly.spec.ts:23`, …). `nuevoModeloPlano` existe porque «Nuevo» ahora
  crea un **apunte** («todo nace apunte», diseño §3) y los e2e necesitan un modelo
  plano.
- Veredicto: **keep** (es liviano y correcto). En una reescritura, el
  `beforeunload` debería depender del estado de persistencia honesta
  (`DocumentPersistenceState.local !== "saved-here" | "synced"`) y no del `dirty`
  binario del store, porque hoy conviven dos nociones de «guardado»
  (ver §10.9).

### 2.3 `version.ts` (19 LOC) + `version.test.ts`
- `OPFORJA_FECHA` es `__OPFORJA_FECHA__`; `vite.config.ts:20` lo define como la fecha
  ISO del build y en desarrollo vale `"dev"`. `OPFORJA_BUILD` es `__OPFORJA_BUILD__`
  (`VITE_OPFORJA_BUILD` o `"local"`), y `OPFORJA_VERSION = OPFORJA_FECHA`. Se muestra
  en el footer de `ui/CheatsheetAtajos.tsx:63`.
- Veredicto: **keep as-is** (patrón `typeof` seguro, test mínimo).

### 2.4 `app/features.ts` y `app/bugCapture.ts`
- `APP_FEATURES = { mapaSistema: false }` sirve para «mantener dormidas superficies
  completas». Solo se consulta en 3 adaptadores para forzar `vistaMapaActiva: false`
  y `abrirVistaMapa: () => {}`. **Cut** junto con toda la familia mapa (§4.3).
- `bugCapture.ts`: combo `Ctrl+Shift+B`, eventos `opforja:bug-capture:open` y
  `opforja:bug-ledger:open`. `bugCapture habilitado()` equivale a
  `DEV || VITE_ENABLE_BUG_CAPTURE === "true"`. Es tooling interno de QA dentro del
  producto: **simplify** a solo DEV, o sacarlo a una extensión o script.

---

## 3. El patrón puerto → adaptador zustand → viewmodel → componente

### 3.1 Anatomía (ejemplo real: breadcrumb)

```ts
// ports/opdNavigationPort.ts
export interface OpdNavigationPort {
  modelo: OpmStore["modelo"];
  opdActivoId: OpmStore["opdActivoId"];
  cambiarOpdActivo: OpmStore["cambiarOpdActivo"];
}
// ports/zustandOpdNavigationPort.ts
export function useZustandOpdNavigationPort(): OpdNavigationPort {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const cambiarOpdActivo = useOpmStore((s) => s.cambiarOpdActivo);
  return { modelo, opdActivoId, cambiarOpdActivo };
}
// viewmodels/breadcrumbViewModel.ts
export function useBreadcrumbViewModel() {
  const { modelo, opdActivoId, cambiarOpdActivo } = useZustandOpdNavigationPort();
  return { modelo, opdActivoId, cambiarOpdActivo };
}
// ui/Breadcrumb.tsx → useBreadcrumbViewModel() → rutaBreadcrumbOpd(modelo, …)
```

Hay cuatro archivos y tres capas para leer dos campos y una acción. La viewmodel ni
siquiera deriva la ruta: la calcula la UI con `rutaBreadcrumbOpd`
(`ui/Breadcrumb.tsx:79`).

### 3.2 Composiciones que reenvían a mano
- `canvasInteractionPort.ts` (120 LOC) declara un `Pick<>` de 3 puertos con 48 claves
  y luego `componerCanvasInteractionPort` las copia una por una. Su test
  (`canvasInteractionPort.test.ts`, 126 LOC) verifica la copia y afirma «compone
  **solo** la frontera que JointCanvas consume». No es cierto: `JointCanvas` consume
  además `driftMap`, `eligiendoOrigenEnlace`, `iniciarRelacionDesdeEntidad`,
  `colaRenombradoPendiente`, `avanzarRenombradoPendiente`,
  `cancelarRenombradoPendiente` y `esApunte` directamente del store
  (`render/jointjs/JointCanvas.tsx:162-177`).
- `inspectorEntidadViewModel.ts` hace `...shell, ...semantics, ...metadata,
  ...geometry, ...refinement, ...states`: seis puertos (`entityInspectorPorts.ts`) que
  se vuelven a aplanar en uno.
- `linkInspectorPort.ts` define 5 interfaces (`LinkInspectorSessionPort`,
  `SelectedLinkPropertiesPort`, `SelectedLinkEndpointsPort`, `StructuralLinkGroupPort`,
  `LinkDeletionPort`) que se unen en `LinkInspectorPort`. Tiene un solo adaptador y una
  viewmodel de 3 líneas que lo devuelve tal cual (`inspectorEnlaceViewModel.ts`).
- `commandPalettePort.ts` declara 5 sub-interfaces. El adaptador tiene 50 selectores
  y la viewmodel (138 LOC) desestructura los 50 para devolverlos con otro orden y
  añade 5 envoltorios `() => { void x(); }`.
- `GlobalShortcutsSnapshot` (`globalShortcutsPort.ts:24-131`) enumera a mano unos 90
  campos, pero el adaptador devuelve `{ ...store.getState(), simulacionActiva,
  oplMarginaliaMinimizada }` (`zustandGlobalShortcutsPort.ts`). El tipo es una vista
  parcial del store, redactada de nuevo y con `unknown | null` para los campos que no
  quiso tipar.

### 3.3 ¿Qué valor aporta hoy?
| Supuesto valor | ¿Se realiza? | Evidencia |
|---|---|---|
| Desacoplar UI del store | No | Las interfaces tipan `OpmStore["x"]`; 38 archivos de UI usan el store directo |
| Sustituir la implementación | No | 1 adaptador por puerto; ningún segundo adaptador |
| Testear UI con puertos falsos | No (salvo agente/docOps/review) | Los tests de viewmodels prueban funciones puras exportadas, no los hooks |
| Suscripción granular | Parcial y contraproducente | Los adaptadores suscriben todos sus campos aunque el consumidor use uno (`inspectorViewModel` toma `useZustandWorkbenchViewControlsPort()`, 12 campos, para usar `abrirDialogoConfiguracion`) |
| Documentar qué consume cada superficie | Parcial | Útil como inventario, pero se desactualiza (canvasInteraction, menuPrincipal) |
| Frontera para servicios con I/O | **Sí** | documentOperations, agentTask, documentPersistence, piece, review |

**Conclusión:** fuera de los servicios con I/O, el patrón es burocracia. Triplica los
puntos de edición por capacidad, aparenta una frontera que no existe, suscribe de
más, cuesta rendimiento y queda desactualizado respecto del uso real. Esas son las
mismas señales de «gobernanza autorreferente» que la solicitud pide eliminar.

---

## 4. Inventario de puertos

Leyenda de valor: **N** = núcleo, **I** = importante, **M** = marginal,
**A** = acreción. Recomendación: keep / simplify / cut.

### 4.1 Puertos con sustancia (seams reales)

| Puerto | LOC | Qué hace | Valor | Rec. |
|---|---:|---|---|---|
| `documentOperationsPort.ts` | 373 | Adapta **la única cola** del store (`store/runtime`: `submitDocumentChange`, `flushDocumentOperations`, `prepareDocumentCommit`, `reconcileDocumentCommit`, `releaseDocumentCommit`, `getDocumentOperationsController`) a un `documentId`. Gestiona permiso de un solo uso (`claimCommitGrant`), commit, recibo desconocido (`resolveUnknownReceipt`), fallo tras envío (`resolveCommitFailure`), undo/reapply con `intentHistory` y `validateInverse`, y el flush posterior a la integración | I (núcleo de concurrencia del «producto integrado») | **keep/simplify**: conservar la semántica (un solo permiso, recibo idempotente y «no liberar ante un 500 tras enviar»); quitar la dependencia del store global singleton (`obtenerEstadoStore`, `getDocumentOperationsController`) y los reenvíos triples de `issueGrant` (`documentOperationsPort.ts:202`, `:293`, `:331`; el mismo objeto repetido tres veces) |
| `agentTaskPort.ts` | 444 | Ciclo de tarea: `open/start/instruct/continueTask/stop/review/apply/undo/reapply`, stream de eventos SSE con época y reconexión, heartbeat de presencia cada 10 s (L237), **autoaplicación delegada** cuando `intent.authority === "edit"` y hay `pendingCommit` (L167-181), `completedProposalChangeId` para no reabrir propuestas ya comprometidas | I (feature grande, candidata no desplegada ni aceptada; ver `docs/roadmap/implementacion-producto-integrado.md`) | **keep como servicio** si el producto conserva el agente; si no, **cut** con todo `agent/`. Separar la autoaplicación del `refreshTask` (hoy es un efecto lateral escondido en la lectura) |
| `documentPersistencePort.ts` | 404 | Por documento (`id` backend o `local:<pestaña>`): etiqueta local `empty/saving/saved-here/synced/conflict/volatile`, remoto `local-only/offline/idle/pending/syncing/synced/conflict`, `saveHere`, `synchronize` (coalesce + CAS con testigo), `resolveConflict` local/remoto, `recoveryJson` volátil (`format: "opforja.local-recovery.v1"`, L399), revalida identidad (tenant/usuario) tras cada `await`, escucha `online`/`offline` | N/I (persistencia honesta, offline) | **keep** (portar casi tal cual) pero unificar con el `PersistencePort` legado (§10.9) |
| `piecePort.ts` | 72 | Pieza reutilizable: `prepare` (valida `MAX_PIECE_SOURCE_BYTES = 1 MiB`, hace flush, envía `POST /__deep-opm/agent/pieces`), `apply` (`prepareCommit(..., "review")` + `commit`), `undo` | M/I (reuso entre modelos) | **keep** si se conserva el reuso; notar que depende de la cola del agente (§9) |
| `reviewOwnerPort.ts` + `reviewPort.ts` | 20 | `createReviewOwnerPort(fetch, flush→{expectedRevision, expectedWorkingCopyHash})`; reexporta tipos de `persistencia/reviewClient` | I (revisión compartida) | **keep** (fusionar en `persistencia/reviewClient`) |
| `globalShortcutsPort.ts` | 382 | Tabla completa de atajos (≈50 registros), cascada de Escape, guardas S/R/F2/D/T, pestañas Ctrl+1..9/Tab/W/T, Space en simulación, captura de bug | I | **simplify**: conservar la **tabla declarativa** como dato (también alimenta el cheatsheet); borrar `GlobalShortcutsSnapshot`; ver §10.6 sobre atajos no interceptables y la cascada de Escape inalcanzable |
| `workspacePort.ts` | 98 | Interfaz alias + 3 helpers puros: `resolverHijosWorkspace` (fusiona índice y resumen con banderas `archivado/esBiblioteca/esApunte`), `rutaWorkspaceActual`, `validarNombreWorkspace` | I | **simplify**: los helpers van a `persistencia/workspace`; la interfaz se elimina |
| `diagnosticsPort.ts` | 34 | `crearDiagnosticsQueryPort(modelo).listarAvisos(alcance)`, que envuelve `listarAvisosDiagnostico`, y `crearDiagnosticsPort` | M | **cut**: es un envoltorio de una función pura; usar `listarAvisosDiagnostico` memoizado |
| `contextualActionExecutionPort.ts` + adaptador | 71 | Snapshot de 20 acciones para `ui/ejecutarAccionContextual.ts` (inyectable en tests) | M | **simplify**: pasar `store.getState()` o un subconjunto tipado con `Pick<OpmStore,…>` |
| `feedbackPort.ts` + adaptador | 41 | `addFlash` y `sincronizarBadgesDesdeAvisos` sobre `store/feedback` (segundo store zustand) | M | **simplify** (ver §10.8: dos canales de mensajes) |
| `bugCaptureContextPort.ts` + adaptador | 63 | Contexto del reporte de bug (modelo, OPD, selección, pestaña, URL, UA, viewport) | A (tooling) | **cut** del producto o dejar solo en DEV. El adaptador usa un selector que devuelve un objeto literal: con `Object.is` en `useOpmStore` se renderiza de nuevo ante **cualquier** cambio del store |

### 4.2 Puertos alias de `OpmStore` y sus adaptadores (acreción)

Todos siguen el patrón §3.1. Recomendación común: **cut**. La UI debe leer con
selectores (`useOpmStore(s => s.x)` o, mejor, `useStore(selector, shallow)`) y hooks
de dominio pequeños donde haya derivación real.

| Puerto (campos) | Consumidor único | Observación |
|---|---|---|
| `appShellOverlaysPort` (24) | `appShellViewModel.useAppShellDialogsViewModel` → `WorkbenchDialogs` | 20 booleanos de «diálogo abierto». Síntoma de un store que modela cada modal como un flag global |
| `appShellWorkbenchPort` (24) | `App`, `MobileReadonlyApp` | `App` usa 16. `seleccionIdOpl` y `enlaceSeleccionIdOpl` no se usan y aun así renderizan la raíz de nuevo |
| `autosavePort` (3) | `toolbarBaseViewModel`, `toolbarViewModel` | **El autosalvado arranca en el `useEffect` de `ToolbarBase`** (`ui/toolbar/ToolbarBase.tsx:161`): ciclo de vida acoplado a un componente de chrome |
| `bringConnectedDialogPort` (4) | `dialogoTraerConectadosViewModel` | — |
| `canvasSessionPort` (14), `selectionPort` (18), `modelCommandPort` (19) | `canvasInteractionPort` y 6 viewmodels | Ver §3.2 |
| `commandPalettePort` (50) | `commandPaletteViewModel` | Reenvío masivo |
| `configurationDialogPort` (9) | `dialogoConfiguracionViewModel` | `gridConfig` normalizado; se repite en 4 lugares (`normalizarGridConfig(gridConfigBase)`) |
| `editabilityPort` (1) | 7 consumidores | `readOnly || opdActivoEsSoloLectura` (vista derivada `vista.readOnly`). Útil como **selector**; no como puerto |
| `entityInspectorPorts` (6 interfaces, ≈45 campos) | `inspectorEntidadViewModel` | Incluye `crearEstadosConNombres`, lógica semántica escondida en el adaptador (§6.3, §10.4) |
| `entityMetadataModalPort` (9) + `EntityMetadataOpenersPort` | modales imagen/URLs | `useZustandEntityMetadataOpenersPort` **sin uso** |
| `historyPort` (4), `interactionModePort` (2), `linkContextActionsPort` (1), `timelinePort` (1), `toolbarOverflowPort` (2), `sessionMessagePort` (2), `mobileReviewPort` (2) | 1 viewmodel cada uno | Puertos de 1 a 4 campos: ceremonia pura |
| `linkInspectorPort` (5 interfaces, 36 campos) | `inspectorEnlaceViewModel` (3 LOC) | — |
| `linksTablePort` (16) + `LinksTableEditPort` | `tablaEnlacesViewModel` | `renombrarEtiqueta` **selecciona el enlace como efecto lateral** antes de renombrar (el store solo tiene la acción «...Seleccionado») |
| `modelCreationPort` (8) | toolbars | Hace alias `crearObjeto: OpmStore["crearObjetoDemo"]` y lo mismo para Proceso. El nombre «Demo» del store es deuda de naming |
| `opdNavigationPort` (3) | 12 consumidores | El «puerto» más reutilizado equivale a 3 selectores |
| `opdTreePort` (19), `opdTreeManagementPort` (7) | árbol / gestión | — |
| `oplPort` (24) | `panelOplViewModel` | Incluye `mostrarPlaceholderAiOpl` (A) |
| `persistencePort` (≈32) | 11 consumidores | Mezcla diálogos, dirty, autosalvado, versiones, import/export y el «chip de revisión del agente» (A′-vitrina: `revisionRemota`, `iniciarPollRevision`, `traerRevisionDelAgente`, `verVersionDelAgente`). Cualquier consumidor se suscribe a todo |
| `searchDialogsPort` (3 interfaces) | búsquedas | `useZustandSearchDialogsPort` **sin uso** |
| `selectedElementActionsPort` (4), `selectionBatchActionsPort` (6) | barra de elemento, toolbar | — |
| `sessionTabsPort` (7) | `barraPestanasViewModel` | — |
| `simulacionNumericaDialogPort` (4) | diálogo | El adaptador calcula `columnas` en cada render y `ejecutar` usa `semilla ?? Math.random` (no reproducible sin semilla) |
| `simulationPort` (18) | `BarraSimulacion`, `JointCanvas` | — |
| `stateDurationModalPort` (5) | modal | — |
| `toolbarChromePort` (4) | `toolbarBaseViewModel` | `abrirMenuPrincipal`, `cerrarMenuPrincipal` y `menuPrincipalAbierto` **no se usan en la UI** (el menú lateral fue retirado, según `commandPalettePort.ts:24-29`) |
| `versionHistoryPort` (9) | `dialogoVersionesViewModel` | El adaptador fija `feedback: "receipt"`; es la única lógica |
| `workbenchViewControlsPort` (12) | `inspectorViewModel` (1 campo usado) | Suscripción excesiva |

### 4.3 Familia «mapa del sistema»: dormida y, en la práctica, muerta
`mapViewPort`, `systemMapControlsPort`, `systemMapDataPort`, `systemMapFiltersPort`,
`systemMapViewportPort` (5 interfaces + 5 adaptadores), `mapaSistemaViewModel`,
`toolbarMapaSistemaViewModel`, `features.ts`. Sus únicos consumidores
(`ui/MapaSistema.tsx` de 376 LOC y `ui/toolbar/ToolbarMapaSistema.tsx`) **no se
importan en ningún lugar**. Aun así, `vistaMapaActiva` sigue viajando por
`OplPort`, `OpdTreePort`, `AppShellWorkbenchPort`, `GlobalShortcutsPort`,
`BugCaptureStoreContext` y el contexto de atajos `"vista-mapa"`
(`ui/atajosTeclado.ts`). Del store dependen el slice `store/mapa.ts` (148),
`store/mapaSelectors.ts`, `canvas/mapaSistema.ts` y `render/jointjs/mapaSistema`.
**Cut completo.** Si alguna vez vuelve un mapa de la jerarquía de OPDs, se puede
derivar del árbol (`arbolOpdEstructura`) sin estado propio persistido.

---

## 5. Inventario de viewmodels

### 5.1 Con lógica real (conservar la **función pura**; el hook, no)

| Archivo | Lógica | Valor | Rec. |
|---|---|---|---|
| `panelOplViewModel.ts` (241) | Llama a `derivarPanelOpl` (opl/panel) con filtro por selección, búsqueda, editor libre, visibilidad de esencia y régimen apunte. `alcanceOpl` («opd-local» para bocetos sueltos sin `vista`), `procesoActivoSimId`, `codigoCanonicoSeleccion` (`o.NN`/`p.NN`/`s.NN`), `panelOplMinimizadoEfectivo` y el editor libre (reverse OPL) con `aplicarEdicionOplLibre` | **N** (bimodalidad OPD/OPL) | **keep** la lógica y separar estado local del editor libre. Ojo: se sube a `App`, lo que suscribe la raíz a hover (§10.1) |
| `tablaEnlacesViewModel.ts` (284) | Filas por enlace (origen/destino con `Objeto.estado`, familia `naturalezaDeEnlace`, multiplicidades, OPDs donde aparece), filtro por tipo/familia/texto normalizado sin diacríticos, orden, «enfocar filtrados» (cambia de OPD y resalta el subgrafo durante 4.5 s) | I | **keep** (reubicar como `ui/tablaEnlaces/derivar.ts`) |
| `busquedaCosasViewModel.ts` (184) | `calcularResultadosBusquedaCosas`: una fila por **apariencia** (una cosa puede estar en varios OPDs), estados y etiquetas de enlace, orden proceso > objeto > estado > enlace; `entidadesTraiblesAlOpd` | I | **keep** |
| `panelDiagnosticoViewModel.ts` (199) | Solo funciones puras (no es hook): `derivarIssuesDiagnostico`, `agruparIssuesDiagnostico` (bloqueo/mejora/estilo, colapso por `testIdCodigo`), `resumirDeltaDiagnostico` (live region), `resumirPanelDiagnostico` | I | **keep** (renombrar como presentación de diagnóstico) |
| `arbolOpdEstructura.ts` (77) | `construirArbol` (raíz SD, hijos por `padreId`, orden `ordenLocal` y luego id, huérfanos corruptos bajo la raíz, **excluye sueltos**), `nodosBocetos` (banda «Bocetos», R-OPD-REF-20) | **N** | **keep**; **unificar** con `construirArbolGestion` (§10.3) |
| `arbolOpdViewModel.ts` (91) | Compone el árbol con avisos del modelo, bocetos, `esApunte`, y clasifica bocetos/integrados (`refinaA`) | I | simplify |
| `timelineViewModel.ts` (77) | `contextoTimeline`: en un OPD de descomposición, encuentra el refinador y su contorno y lista los subprocesos **dentro del contorno** ordenados por `y` (luego `x`, luego id). `parallelSize` = cantidad con la misma `y` exacta | **N** (orden temporal del in-zoom) | **keep** con revisión: ver §6.2 y §10.5 |
| `agentTaskViewModel.ts` (85) | `projectAgentTask`: `canStart/canCorrect/canContinue/canExtendBudget/canStop/canApply/canUndo/canReapply` y `statusLabel` | I (si hay agente) | keep |
| `estadoVacioOpmViewModel.ts` (95) | `sugerirEnlaceResultado` (exactamente 2 entidades, 1 proceso y 1 objeto, 0 enlaces y firma válida), intervención del Tutor, `empezarPorSd` / `empezarPorTaller` | I (onboarding) | keep la regla; simplify el hook |
| `dialogoTraerConectadosViewModel.ts` (69) | `contarCandidatosTraer` por familia (`canvas/reglasTraer`) | I | keep |
| `dialogoVersionesViewModel.ts` (45) | `aplicarPoliticaLogScaleVersiones`, `filtrarVersionesVisibles` y `agruparHistorialPorSesionAgente` | I | keep |
| `mesaExploracionViewModel.ts` (231) | Mesa de exploración: fuente, trazo, interpretación, propuesta y hecho confirmado; preview = diferencia de OPL entre el modelo actual y el previsualizado (`previsualizarPropuestaExploracion`); intervención del Tutor por etapa | M (feature de elicitación) | decisión de producto; si se queda, **keep** la lógica |
| `toolbarCreacionViewModel.ts` (46) | Resuelve origen y destino del menú de tipo de enlace (prioriza `modoEnlace.origenId`) | I | keep (selector puro) |
| `inspectorViewModel.ts` (71) | `modo` del inspector según el coproducto de selección, `calcularConteosModelo`, `infoProcedencia` | I | simplify |
| `chipRevisionViewModel.ts` (47) | `evaluarVitrina` (hay revisión remota más nueva que la base, «Recargar» o rama no destructiva si hay dirty) | M (canal de agente externo) | ver §10.9. `estadoVitrinaDelStore` se exporta para tests, pero el hook **duplica** la lógica en lugar de usarlo |
| `formatoPersistencia.ts` (9) | `formatearHoraGuardado` HH:mm es-CL | util | keep (mover a util) |
| `jointCanvasViewModel.ts` (21) | `opcionesProyeccionJointCanvas` (+ `canalSeleccion: "halo"`) | util | keep la función; cut el hook |

### 5.2 Reenvío puro (cut)
`breadcrumbViewModel`, `barraPestanasViewModel`, `busquedaGlobalViewModel`,
`dialogoConfiguracionViewModel`, `dialogoSimulacionNumericaViewModel`,
`mensajeFlashViewModel`, `modalDuracionEstadoViewModel`, `modalImagenObjetoViewModel`,
`modalUrlsObjetoViewModel`, `modoRevisionMobileViewModel`, `toolbarMasViewModel`,
`toolbarViewModel`, `toolbarMapaSistemaViewModel`, `inspectorEnlaceViewModel`,
`inspectorEntidadViewModel`, `barraHerramientasElementoViewModel`, `toolbarBaseViewModel`
(agrega 12 puertos), `appShellViewModel` (con `documentPolicy` sin uso),
`commandPaletteViewModel`, `capturadorBugsViewModel`, `mapaSistemaViewModel`.
Suman unas 800 LOC.

### 5.3 Muerto
`documentFocusViewModel.ts` (140 LOC + test de 73 LOC). Se agregó en `8ada528` y
ningún archivo de UI o render lo importa. Además duplica `rutaBreadcrumbOpd`
(`derivarRuta`, L86) y `esOpdSuelto` + `vista` (`esApunteLocal`, L137). Declara
«acciones» como datos (`materializeView: {supported:false}`,
`proposeRefinement: {supported:true, requiresConfirmation:true}`): especificación
disfrazada de código. **Cut**, o rescatar solo lo que la UI consuma de verdad.

---

## 6. Reglas OPM codificadas o verificadas en el área

Casi toda la semántica OPM vive en `modelo/` (otro dossier). En esta capa aparecen
tres tipos de regla: (a) enumeraciones y firmas **verificadas** por
`completitud.test.ts`, (b) reglas **aplicadas** en viewmodels y atajos, y (c)
composiciones semánticas **escondidas** en adaptadores. Todas son sagradas para la
reescritura.

### 6.1 `completitud.test.ts`: red de exhaustividad transversal
Usa `Record<Union, true>` para obligar en tiempo de compilación a cubrir cada miembro
nuevo de una unión en menú, render, OPL y kernel. **Portar como está** (idea y
casos).

| Regla / contrato | Ubicación |
|---|---|
| 15 `TipoEnlace`: estructurales `agregacion, exhibicion, generalizacion, clasificacion`; `etiquetado, etiquetadoBidireccional`; procedurales `agente, instrumento, consumo, resultado, efecto, invocacion`; excepciones `excepcionSobretiempo, excepcionSubtiempo, excepcionSubSobretiempo` | `completitud.test.ts:60-76`; tipo en `modelo/tipos/enlace.ts:14` |
| Los 15 aparecen en `TIPOS_ENLACE_CANONICOS`, `TIPOS_ENLACE_MENU` (sin duplicados y con etiqueta no vacía) y `LINK_ASSETS` (procedural o estructural) | `completitud.test.ts:121-174` |
| `ModoDespliegueObjeto` = las 4 relaciones estructurales fundamentales; cada una aparece en `OPCIONES_DESPLIEGUE_OBJETO` | `:78-83`, `:150-163`; tipo en `modelo/tipos/entidad.ts:20` |
| `desplegarObjeto` crea un OPD hijo y **3 refinadores** enlazados con el tipo del modo desde el objeto padre. *El número 3 es un default de UX, no una regla OPM* | `:204-221` |
| `DesignacionEstado` = `inicial, final, default, current` | `:85-90`; tipo en `modelo/tipos/estado.ts:12` |
| Un mismo estado puede ser inicial **y** final. OPL canónico: `**Orden** puede estar \`abierta\` (inicial y final) o \`cerrada\`.` Render: cápsula con `strokeWidth 3` y fill `#d6d2c6` | `:244-270` (oración en L261) |
| `ExtremoKind` = `entidad \| estado` (los enlaces pueden terminar en un estado) | `:97-100`, `:176-180` |
| `Modificador` = `condicion \| evento \| no` | `:102-106`, `:182-186` |
| `OrdenPartesPlegado` = `alfabetico \| creacion` | `:108-111` |
| `DerivacionOrigen` = `automatico \| manual`; un reanclaje manual de un enlace externo derivado tras un in-zoom sobrevive al roundtrip JSON (`exportarModelo`/`hidratarModelo`) | `:92-95`, `:272-301` |
| **Firmas de enlace** (`validarFirmaEnlace`): **agente** = Objeto **físico** → Proceso; **instrumento/consumo** = Objeto → Proceso; **resultado** = Proceso → Objeto; **efecto** = Proceso → Objeto (**con estados**, R-OPD-EST-3), además de Estado → Proceso (efecto de entrada) y Objeto → Proceso solo como rama de abanico lógico; **invocación** = Proceso → Proceso; **excepciones** = Proceso → Proceso **ambiental** (R-EXC-1A / R-OPD-CTL-6) y sin extremos Estado; **estructurales** = Objeto → Objeto | `:194-202`, `:322-368`, `:392-399`; implementación en `modelo/operaciones/helpers.ts:58-146` (`validarFirmaEnlace`) y `modelo/operaciones/enlaces.ts:117-127` |
| Cada tipo genera al menos una oración OPL y al menos una celda `standard.Link` | `:223-242` |
| (Referencia cruzada, no testeada aquí) AP-04: un enlace resultado no puede apuntar a un estado inicial | `modelo/operaciones/enlaces.ts:114-116` |

Defecto del test: el bucle de designaciones (`:255-259`) llama a
`designarEstadoInicial` para «inicial» y a `designarEstadoFinal` para **las otras
tres** (`final`, `default`, `current`). Parece exhaustivo, pero **no ejercita
`default` ni `current`**. La reescritura debe cubrir cada designación con su propia
operación.

Nota de procedencia: R-EXC-1A («el proceso de manejo de excepción debe ser
ambiental») y R-OPD-EST-3 («un objeto sin estados no puede ser afectado») se citan
como `spec-forja-opd-es` del corpus KORA/Forja. Son reglas del método Forja, más
estrictas que la lectura mínima de ISO 19450, y se deben conservar según la autoridad
declarada en AGENTS.md. Su origen normativo debe confirmarse contra el corpus antes de
cualquier cambio.

### 6.2 Reglas aplicadas en viewmodels, puertos y atajos

| Regla | Ubicación | Comentario |
|---|---|---|
| **Coproducto de selección**: a lo sumo uno de `seleccionId`, `enlaceSeleccionId` o `estadoSeleccionId` es no nulo; el inspector hace pattern-match con prioridad estado > entidad > enlace | `viewmodels/inspectorViewModel.ts:50`; `ports/selectionPort.ts:8-13` (sellado por `setSeleccionPorTipo`) | Invariante de UI que protege la distinción entidad / estado / enlace |
| **Solo los objetos tienen estados**: S («agregar estado») exige una cosa seleccionada; la acción contextual «agregar-estado» exige `tipo === "objeto"` | `ports/globalShortcutsPort.ts:154-161`; `ui/ejecutarAccionContextual.ts` («Agregar estado requiere un objeto seleccionado») | El atajo S solo valida que exista la entidad y delega el resto a `agregarEstadoSmart` |
| **Un objeto con estados conserva al menos 2**: crear estados iniciales produce 2 (`agregarEstadosObjeto`); uno adicional produce 1 | `ports/zustandEntityInspectorPorts.ts:123-136` (usa la regla de `modelo/operaciones/estados.ts:166`) | Ver §6.3 |
| **Unicidad del nombre de estado dentro del objeto**: al renombrar un par recién creado se pasa primero por `estado-temporal-N` para no chocar | `ports/zustandEntityInspectorPorts.ts:152-170` | Semántica escondida en el adaptador (§10.4) |
| **Agregación multi-al-todo**: con N ≥ 2 seleccionados, las N−1 primeras son partes y la **última** seleccionada es el todo (`Ctrl+Alt+T`, acción contextual «agregar-como-partes») | `ports/globalShortcutsPort.ts:143-147`, `:293-301` | Convención de gesto; OPL resultante: «Todo consta de …» |
| **Tipo de enlace sugerido**: R, con una cosa seleccionada, usa `tipoInicialConexionDesdeEntidad` (el primer tipo de `PRIORIDAD_TIPO_INICIAL` permitido hacia alguna cosa del OPD y, si no hay, `etiquetado`); sin selección entra al enlace libre | `ports/globalShortcutsPort.ts:162-174`; `canvas/modoEnlace.ts:113-124` | — |
| **In-zoom como línea de tiempo**: los subprocesos dentro del contorno del proceso refinado se ordenan de arriba abajo; los que tienen la misma `y` son paralelos | `viewmodels/timelineViewModel.ts:34-66` (orden L53, paralelismo L55-63) | Coincide con la convención OPM de orden temporal vertical. **Riesgo**: usa geometría `y` exacta y no las bandas declaradas `ordenInzoom`, que el índice de decisiones fija como canónicas (`docs/decisiones/README.md`, fila «orden in-zoom») |
| **El timeline solo existe para el OPD de descomposición** de un proceso cuyo refinador aparece en el OPD padre | `timelineViewModel.ts:36-45` | — |
| **Entidad vs apariencia**: una cosa puede aparecer en varios OPDs; la búsqueda devuelve una fila por apariencia y «Traer a este OPD» ofrece las que no aparecen en el OPD activo | `viewmodels/busquedaCosasViewModel.ts:44-69`, `:140-154` | Distinción OPM esencial (cosa del modelo vs su apariencia en un OPD) |
| **Estados como extremos de enlace**: se muestran como `Objeto.estado` | `viewmodels/tablaEnlacesViewModel.ts:211-220` | — |
| **Familia de enlace** estructural o procedural (`naturalezaDeEnlace`) | `tablaEnlacesViewModel.ts:201` | — |
| **Familias «traer conectados»**: habilitador = `agente, instrumento`; transformador = `consumo, efecto, resultado`; direccional = `etiquetado, etiquetadoBidireccional`; estructural = las 4 fundamentales | `viewmodels/dialogoTraerConectadosViewModel.ts:20-31`; tabla en `canvas/reglasTraer.ts:25-30` | **Faltan** `invocacion` y las 3 excepciones: no se pueden «traer» enlaces de control. Revisar si es intencional |
| **Jerarquía de OPDs**: raíz SD; hijos por `padreId`; orden `ordenLocal`; huérfanos corruptos van defensivamente bajo la raíz; **OPD suelto** (`padreId === null` y no raíz) va a la banda «Bocetos», fuera del árbol integrado (R-OPD-REF-20) | `viewmodels/arbolOpdEstructura.ts:10-42`, `:50-72`; `modelo/opdSueltos.ts` | — |
| **Integrado vs boceto**: un OPD no raíz es «integrado» si alguna entidad lo refina (`refinaA`) | `viewmodels/arbolOpdViewModel.ts:42-58` | — |
| **Régimen apunte** (excepción de apunte a R-ENT-2): en un apunte los placeholders emiten OPL; `esApunte` se aplica a la vez al OPL de display y al canónico | `viewmodels/panelOplViewModel.ts:99-108` | La especie se lee del **índice del workspace**, no del modelo |
| **Visibilidad de esencia** (`siempre / solo-difiere / oculta`) es una preferencia de display; el texto canónico para roundtrip se genera con la esencia por defecto | `panelOplViewModel.ts:103-108` y `opl/panel` | Protege la simetría forward/reverse |
| **Alcance OPL**: en un boceto suelto sin `vista`, el panel muestra «opd-local»; en otro caso, «modelo-completo» | `panelOplViewModel.ts:125-127` (duplicado en `documentFocusViewModel.ts:137`) | — |
| **Sugerencia de resultado en estado vacío**: con 1 proceso, 1 objeto y 0 enlaces, ofrece «Conectar como resultado» si `validarFirmaEnlace("resultado", proceso, objeto)` es ok | `viewmodels/estadoVacioOpmViewModel.ts:81-93` | — |
| **Vista derivada de solo lectura**: `opd.vista.readOnly === true` bloquea la edición; `readOnly` global o simulación también | `ports/zustandEditabilityPort.ts`; `store/runtime.ts:1070-1101` (`mensajeBloqueoEdicion`: simulación > readOnly > vista) | — |
| **Escape** sale del modo simulación cuando no queda nada más que cerrar | `globalShortcutsPort.ts:213-217` | Regla de UX («ley silencio-cero») |

### 6.3 Composición semántica escondida (debe bajar al kernel)
`useZustandObjectStatesInspectorPort(entidadId).crearEstadosConNombres(nombres)`
(`zustandEntityInspectorPorts.ts:123-170`):
- Con 2 nombres ejecuta `agregarEstados()` (crea 2 con nombre por defecto), luego lee
  `store.getState()`, toma los 2 primeros estados y los renombra; si hay choque,
  pasa antes por `estado-temporal-N`.
- Con 1 nombre calcula el diff de estados antes y después de `agregarEstado()` y lo
  renombra.
- **Con otro largo no hace nada, sin avisar.**
- Son **3 o más commits de store no atómicos**, dentro de un hook de «adaptador», que
  leen el store global mientras operan. En la reescritura debe ser **una sola
  operación del kernel** `crearEstados(modelo, entidadId, nombres[])`, atómica, con
  un paso de undo y validación de unicidad y cardinalidad (≥ 2 al crear el conjunto).

---

## 7. Contratos de datos y APIs que la reescritura debe respetar o migrar

### 7.1 Contratos de operaciones de documento (`ports/documentOperationsPort.ts`)

```ts
export type OperationPolicy = "review" | "delegated";

export interface DocumentOperationsState {
  documentId: string;
  controllerId: string;
  clientSequence: number;
  base: Base | null;
  workingCopyHash: string;
  reservation: null | {
    changeId: string;
    status: "preparing" | "granted" | "unknown";
    expiresAt: number | null;
  };
  pendingEdits: number;
  pendingConflicts: number;
}

export interface DocumentOperationConflict {
  id: string; reason: string; references: string[]; recoveryJson: string;
}

export type SubmitChangeResult =
  | { kind: "applied"; changeId: string; sequence: number; model: Modelo; inverse: SemanticInverse }
  | { kind: "prepared"; pendingId: string }
  | { kind: "rejected"; validation: Extract<ChangeValidation, { kind: "rejected" }> };

export interface CommitResponse {
  receipt: CommitReceipt; modelJson: string; base: Base; inverse: SemanticInverse;
}

export interface DocumentOperationsTransport<Grant = unknown> {
  prepareCommit(input: { documentId; change: ChangeSet; policy: OperationPolicy;
    controllerId; clientSequence; workingCopyHash }): Promise<{ grant: Grant; expiresAt: string }>;
  commit(input: { documentId; changeId; grant: Grant }): Promise<CommitResponse>;
  resolveReceipt(input: { target: ChangeSet["target"]; changeId }): Promise<CommitResponse | null>;
  getChange?(input: { target; changeId }): Promise<ChangeSet | null>;
  prepareUndo(input: { documentId; sourceChangeId; controllerId; clientSequence; workingCopyHash }): Promise<{ change: ChangeSet }>;
  prepareReapply(input: { …igual… }): Promise<{ change: ChangeSet }>;
}
```

Tipos de `agent/contracts.ts` de los que dependen (se citan porque cruzan el cable):

```ts
export type Target =
  | { kind: "current"; documentId: string }
  | { kind: "variant"; documentId: string; variantId: string };
export interface Base { revision: number; semanticHash: string; workingCopyHash: string;
  clientSequence: number; profileVersion: string; }
export interface ChangeSet extends SemanticChangeBatch { taskId: string | null; actorId: string;
  intentVersion: number | null; target: Target; base: Base; readIds: Id[]; writeIds: Id[];
  dependencies: Dependency[]; explanation: string; }
export interface CommitReceipt { changeId: Id; target: Target; previousRevision: number;
  revision: number; appliedOperationIds: string[]; inverseId: Id; }
```

Invariantes de comportamiento (conservar):
1. **Una sola cola por documento/pestaña.** El puerto no crea una segunda cola
   (`documentOperationsPort.ts:115-117`).
2. **El permiso es de un solo uso.** `claimCommitGrant` puede devolver
   `already-submitted`, lo que obliga a consultar el recibo, o `expired`, lo que
   libera la reserva.
3. **Un error después de enviar el commit no libera la reserva** mientras no se
   consulte el recibo (`resolveCommitFailure`).
4. **Deshacer sobre el presente**: `validateInverse` contra el modelo actual; si hay
   conflicto se marca `markUndoConflict` y se rechaza. Reaplicar solo desde el estado
   `undone`.
5. Después de una integración limpia se hace flush de la copia rebasada, para que la
   siguiente tarea o presencia quede ligada a su hash vigente.

### 7.2 Contrato de tarea de agente (`ports/agentTaskPort.ts`)

```ts
export type AgentPortPhase = "loading" | "ready" | "unavailable" | "error";
export type AgentPortAction = "starting" | "correcting" | "continuing" | "stopping"
  | "loading-change" | "applying" | "undoing" | "reapplying" | null;
export interface AgentTaskSnapshot {
  documentId: string; phase: AgentPortPhase; availability: AgentAvailability | null;
  tasks: TaskView[]; activeTask: TaskView | null; change: AgentChangeView | null;
  preparedChange: PreparedAgentChange | null; cursor: number; action: AgentPortAction;
  error: string | null; pendingEdits: number; pendingConflicts: number;
  conflicts: DocumentOperationConflict[]; lastAppliedChangeId: string | null;
  lastUndoneChangeId: string | null;
}
export interface NewAgentTask {
  outcome: string; scopeIds: string[]; allowedSourceIds?: string[];
  exclusions?: string[]; sufficiency?: string[]; authority: "propose" | "edit";
}
```

HTTP usado (vía `persistencia/agentClient.ts`, `ROOT = "/__deep-opm/agent"`):
`GET /status`; `GET/POST /tasks`; `GET /tasks/:id`;
`POST /tasks/:id/{instructions,continue,stop,presence}`; `GET /tasks/:id/events?after=`
(stream); `GET /changes/:id?documentId`; `POST /changes/:id/{prepare,undo,reapply,grants,commit}`;
`GET /changes/:id/receipt?documentId`. Las propuestas humanas usan
`POST /__deep-opm/agent/{refinements,pieces}` (`persistencia/humanChangeClient.ts`), con
la cabecera de identidad de sesión.

### 7.3 Contrato de persistencia de documento (`ports/documentPersistencePort.ts`)

```ts
export type LocalPersistenceLabel = "empty" | "saving" | "saved-here" | "synced" | "conflict" | "volatile";
export type RemotePersistenceState = "local-only" | "offline" | "idle" | "pending" | "syncing" | "synced" | "conflict";
export interface DocumentPersistenceState {
  documentId: string; identity: DocumentLocalIdentity["status"];
  local: LocalPersistenceLabel; remote: RemotePersistenceState;
  localRevision: number | null; lastSyncedLocalRevision: number | null;
  remoteRevision: number | null; pendingOperations: number;
  conflicts: LocalConflictBranch[]; error: string | null;
  durableSnapshotMatchesCurrent: boolean;
}
export interface DocumentPersistencePort {
  snapshot(); subscribe(listener); openLocal(); saveHere();
  synchronize(): Promise<SyncResult | { kind: "local-only" } | { kind: "offline" }>;
  resolveConflict(conflictId, choice: "local" | "remote"); recoveryJson(); dispose();
}
```

- **Convención de identificador**: `documentId` es el id del modelo en backend o
  `local:<pestanaActivaId>` (`ui/App.tsx:84`). El prefijo `local:` fija
  `remote = "local-only"`.
- **Formato de recuperación** (se descarga como `opforja-recuperacion.json`):
  `{ format: "opforja.local-recovery.v1", volatile: true, error, document: LocalDocumentRecord }`
  (`documentPersistencePort.ts:~380-404`). **Es un contrato persistido fuera de la
  app**: una reescritura debe seguir leyéndolo.
- `SyncTransport` (`persistencia/syncQueue.ts:15`): `readRemote` / `commitRemote`,
  con CAS por `witness` (`MesaBaseWitnessV1`) y `confirmedByOperator`.

### 7.4 Pieza (`ports/piecePort.ts`)

```ts
export const MAX_PIECE_SOURCE_BYTES = 1_048_576;
export type PieceWireTarget =
  | { opdId: string; position: { x: number; y: number } }
  | { opdId: string; anchorEntityId: string }
  | { referenceId: string; expectedSourceVersion: string };
export type PreparePieceInput = { sourceJson: string; pieceId: string; function: string } & (
  | { kind: "copy"; target: /* position */ }
  | { kind: "reference"; target: /* anchorEntityId */ }
  | { kind: "update"; target: /* referenceId */; includeBoundaryChange?: boolean });
export interface PreparedPieceChange extends PreparedAgentChange {
  manifest: PieceManifest; losses: string[]; comparison?: PieceVersionComparison; }
```

### 7.5 Revisión compartida
- `ReviewOwnerPort`: `list/create/get/revoke/resolve`. `ReviewReaderPort`:
  `load/annotate` (`persistencia/reviewClient.ts:5-33`). Raíz HTTP
  `/__deep-opm/review` (`/grants`, `/grants/:id`, `/grants/:id/annotations/:aid/resolve`,
  `/:token`).
- `createDocumentReviewOwnerPort` hace flush de la cola antes de compartir, para que
  la copia compartida sea **la misma** working copy
  (`expectedRevision`, `expectedWorkingCopyHash`).
- Ruta pública del lector: `/revision/:token` (`main.tsx:30`).

### 7.6 Atajos
`ShortcutRegistration { combo; handler; ctx: "global" | "canvas"; etiqueta?; descripcion;
descripcionLarga?; categoria: "navegacion" | "edicion" | "archivo" | "vista" | "seleccion";
preventDefault? }` (`globalShortcutsPort.ts:11-20`). Duplica `RegistroAtajo` de
`ui/atajosTeclado.ts`, que admite más contextos (`panel-opl`, `panel-arbol`,
`modal-input`, `vista-mapa`). La duplicación es deliberada para no importar `ui/`
desde `app/`. La tabla de atajos (combo → descripción) es **contrato visible**:
alimenta el cheatsheet y los manuales.

### 7.7 Superficies globales y flags de build
- `window.__opmTest` (DEV): `exportarModeloActual(): string`, `nuevoModeloPlano()`.
- `window.__opmRenderHeadless__` (solo con `VITE_HEADLESS_RENDER=true`).
- Eventos DOM: `opforja:bug-capture:open`, `opforja:bug-ledger:open`,
  `opm:halo-estado-rename`, `opm:halo-estado-popover-designar`
  (`globalShortcutsPort.ts:261,274`), `EVENTO_ABRIR_AVISO_DIAGNOSTICO` (`store/feedback`).
- Env: `VITE_HEADLESS_RENDER`, `VITE_ENABLE_BUG_CAPTURE`, `VITE_MOBILE_READONLY`
  (en `App`), `VITE_OPFORJA_BUILD`. Globals: `__OPFORJA_FECHA__`, `__OPFORJA_BUILD__`.

### 7.8 Contexto de captura de bug (payload hacia `/__deep-opm/bug-reports`)
`BugCaptureContext = { modeloId, modeloNombre, opdActivoId, opdActivoNombre,
seleccionEntidadId, seleccionEnlaceId, pestanaActivaId, vistaMapaActiva, url,
userAgent, viewport{width,height,devicePixelRatio}, capturedAt }`
(`bugCaptureContextPort.ts:3-25`). Si se conserva el tooling, `vistaMapaActiva` debe
salir.

---

## 8. Flujos principales que atraviesan la capa

1. **Arranque.** `main.tsx` elige entre la ruta `/revision/:token` (lector) y
   `editorBootstrap` (App, `beforeunload`, hooks DEV). `App`
   (`ui/App.tsx:111-122`) crea `crearZustandGlobalShortcutsPort()`,
   `configurarContextoAtajos`, `escucharGlobal()` y `registrarAtajosAplicacion`.
2. **Edición en canvas.** `JointCanvas` → `useJointCanvasViewModel` →
   `useZustandCanvasInteractionPort` → 3 adaptadores (sesión, selección, comandos) →
   acciones del store (`crearEntidadEnCanvas`, `crearEnlaceEntreEntidades`,
   `moverAparienciaConPuertos`, `reanclarExtremoAccion`, …) → kernel. Además hay 7
   `useOpmStore` directos.
3. **Bimodalidad OPL.** `App` y `MobileReadonlyApp` → `usePanelOplViewModel` →
   `derivarPanelOpl` (forward). Clic o hover en un token → `seleccionarDesdeOpl` /
   `fijarHoverOpl` (el hover resalta en el canvas mediante `hoverOplRef` de
   `CanvasSessionPort`). Edición inline → `renombrarEntidadDesdeOpl` /
   `renombrarEstadoDesdeOpl`. Editor libre → `aplicarEdicionOplLibre(texto)` (reverse)
   con vista previa `previewLibre`.
4. **Atajos.** keydown en captura → `ui/atajosTeclado.manejarKeydown`: si hay un
   `[role=dialog][aria-modal=true]`, **retorna sin despachar**; si no, resuelve el
   contexto (`modal-input`/`vista-mapa`/`panel-*`/`canvas`) → handler de la tabla →
   `port.snapshot()` = `store.getState()`.
5. **Persistencia honesta.** `DocumentActions` → `DocumentPersistenceStatus` (se
   remonta según `localDocumentId`) → `createDocumentPersistencePort` →
   `saveHere` / `synchronize` / `resolveConflict` / `recoveryJson`. En paralelo sigue
   vivo el circuito legado `PersistencePort` (`guardarLocal`, `autosalvado`,
   `versiones`, `revisionRemota`).
6. **Tarea de agente.** `AgentWorkbench` (con documento persistido) crea
   `createAgentDocumentOperationsPort` + `createAgentTaskPort` → `IntentBar` →
   `useAgentTaskViewModel(port)` (`open()` en el effect) → `start` hace flush de la
   cola, `startTask`, heartbeat, stream y `refreshTask`. Una tarea `edit` con
   `pendingCommit` se autoaplica; una `propose` se aplica a mano (`apply` →
   `commitChange` → `prepareChange` → `prepareCommit` → `commit` → reconciliación).
7. **Pieza / refinamiento propuesto.** `DocumentActions.renderDocumentActions(operations)`
   → `PieceProposalAction` → `createPiecePort(operations)` → `prepare` (flush + POST
   `/agent/pieces`) → revisión humana → `apply` (política `review`).
8. **Compartir revisión.** `ReviewDocumentAction` → `createDocumentReviewOwnerPort()`
   → flush → `create` → token → lector anónimo en `/revision/:token`.

---

## 9. Acoplamientos

- **Dirección de dependencias**: se respeta `modelo → store → app → (ui, render)`. El
  store no importa `app/`. `render/jointjs/*` importa `app/ports/feedbackPort` y
  `app/viewmodels/jointCanvasViewModel`, lo cual está permitido.
- **Singleton global**: `documentOperationsPort` usa `obtenerEstadoStore()`,
  `getDocumentOperationsController(documentId)` y `intentHistory` como estado de
  módulo (`store/runtime.ts`, 1 769 LOC). La «inyección» del transporte convive con
  singletons, así que el puerto no se puede instanciar para dos stores.
- **Las propuestas humanas dependen del agente**: la cola de operaciones que usan
  piezas y refinamientos la crea `AgentWorkbench` con
  `createAgentDocumentOperationsPort` (transporte `AgentClient`). Sin `modeloPersistidoId`
  no hay `operations`, y el nombre «agent» cubre flujos humanos. En la reescritura
  debería existir una sola «cola de cambios del documento» independiente del agente.
- **Especie del documento fuera del modelo**: `esApunte`, `esBiblioteca` y `archivado`
  viven en `indice.modelos[]` (workspace). El mismo selector
  `s.indice.modelos.some((m) => m.id === s.modelo.id && m.esApunte === true)` se
  repite en 11 lugares (arbolOpdViewModel, panelOplViewModel, PanelDiagnostico ×2,
  CommandPalette, VistaBusquedaLectura, JointCanvas, …). En 2 de ellos
  (`estadoVacioOpmViewModel.ts:20-22`, `mesaExploracionViewModel.ts:63-65`) se agrega
  además `archivado !== true`. **Hay dos definiciones distintas de «es apunte»**, y
  esa definición afecta el OPL generado (R-ENT-2).
- **Ciclo de vida acoplado a chrome**: el autosalvado arranca cuando se monta
  `ToolbarBase`; el poll de la revisión remota depende del chip.
- **Dos stores zustand**: `store` (OpmStore) y `store/feedback.feedbackStore`, puenteados
  por `MensajeFlashBridge` (`OpmStore.mensaje` → `addFlash`).

---

## 10. Olores de sobreingeniería y defectos concretos

1. **La raíz se vuelve a renderizar en cada hover del OPL** y recalcula el
   diagnóstico sin memo. `App` → `usePanelOplViewModel` → `useZustandOplPort` →
   `hoverOplRef`, y `ui/App.tsx:137` ejecuta `listarAvisosDiagnostico(...)` en cada
   render. `appShellViewModel` calcula `deriveDocumentPolicy(...)` en cada render y
   nadie lo usa (`appShellViewModel.ts:12`).
2. **Puertos que suscriben de más**: `inspectorViewModel` usa 1 de 12 campos de
   `WorkbenchViewControlsPort`; `toolbarBaseViewModel` agrega 12 puertos, incluido todo
   `PersistencePort` (≈32 campos); `AppShellWorkbenchPort` suscribe la selección en la
   raíz.
3. **Árboles de OPD duplicados e inconsistentes**: `construirArbolGestion`
   (`gestionArbolOpdViewModel.ts:37-60`) **no excluye los OPD sueltos**. Como su
   `padreId` es `null`, los cuelga bajo el SD raíz (L44). Además no ordena por
   `ordenLocal`. `construirArbol` (`arbolOpdEstructura.ts:10-42`) sí los excluye y
   ordena. El panel de gestión contradice entonces la banda «Bocetos» (R-OPD-REF-20).
   Existen también `derivarRuta` (documentFocus) duplicando `rutaBreadcrumbOpd` y
   `hermanosOrdenados` en `store/runtime.ts:1059`.
4. **Semántica no atómica dentro de un adaptador** (`crearEstadosConNombres`, §6.3).
5. **El timeline usa geometría y no el orden declarado**: el orden temporal y el
   paralelismo se derivan de `apariencia.y` exacta (`timelineViewModel.ts:53-63`) y
   `reordenarSubprocesoEnTimeline` solo mueve `y` (`store/modelo/acciones-canvas.ts:852-876`).
   Mientras tanto, el modelo tiene `opd.ordenInzoom` (bandas) como fuente canónica. Hay
   que verificar si `moverAparienciaPorId` sincroniza `ordenInzoom`. Si no lo hace, OPD
   y OPL pueden discrepar en el orden temporal.
6. **Atajos que el navegador no deja interceptar o que chocan con él**: `Ctrl+W`,
   `Ctrl+T`, `Ctrl+Tab`, `Ctrl+Shift+Tab`, `Ctrl+Shift+T` y, en la mayoría de los
   navegadores, `Ctrl+1..9` están reservados. Con alta probabilidad nunca llegan a la
   página. `Ctrl+D` (marcador) y `Ctrl+H` (historial) roban comportamiento conocido.
   Hay registros redundantes: `Ctrl+Y` y `Ctrl+Shift+Z`, `Delete` y `Backspace`,
   `Ctrl+Tab` y `Ctrl+Shift+]`.
7. **Cascada de Escape en gran parte inalcanzable**: `manejarKeydown` retorna si hay
   un `[role=dialog][aria-modal=true]`, y `Dialogo` es modal por defecto
   (`ui/Dialogo.tsx:75`), igual que CommandPalette, Cheatsheet, GestionArbol y
   TablaEnlaces (`aria-modal="true"`). En producción, la mayoría de las 17 ramas de
   `cerrarModalSuperiorOVaciarSeleccion` (`globalShortcutsPort.ts:194-218`) no se
   ejecuta: cada diálogo cierra su propio Escape. Los tests unitarios las siguen
   ejercitando, lo que da una falsa cobertura.
8. **Dos canales de mensajes**: `OpmStore.mensaje` (string) y `feedbackStore` (flash
   con TTL), puenteados por un componente. Debe quedar una sola función `notificar()`.
9. **Persistencia en capas superpuestas** vistas desde esta capa:
   (a) `PersistencePort.guardarLocal`/`autosalvado`/`dirty`/`dirtyModelo`;
   (b) `DocumentPersistencePort.saveHere`/`synchronize` (IndexedDB + CAS);
   (c) `DocumentOperationsPort` (cola de cambios con recibo);
   (d) `VersionHistoryPort` (versiones);
   (e) chip de revisión «A′-vitrina» (`revisionRemota`, `iniciarPollRevision`,
   `traerRevisionDelAgente`), un canal para un agente **externo** (skill) que choca
   conceptualmente con el agente integrado.
   Existen dos nociones de «guardado» (`dirty` y `local: saved-here/synced`). La
   reescritura necesita **un** modelo de persistencia (documento local durable +
   sincronización + versiones), una sola etiqueta de estado y un solo canal de agente.
10. **Código muerto** (§0, §4.3, §5.3): familia del mapa, `documentFocusViewModel`,
    `useZustandSearchDialogsPort`, `useZustandEntityMetadataOpenersPort`,
    `opdsEnOrdenDeArbol` (exportada «para test»: `Ctrl+1..9` ya no navega OPDs sino
    pestañas), `menuPrincipal*`, `mostrarPlaceholderAiOpl` («Próximamente: oraciones
    generadas por LLM», `store/modelo/acciones-canvas.ts:295-297`) y el test
    `globalShortcutsPort.test.ts:162` sobre un «Ctrl+B biblioteca dock» que ya no
    existe.
11. **Test de composición que certifica una mentira**: `canvasInteractionPort.test.ts`
    afirma «solo la frontera que JointCanvas consume» (§3.2).
12. **Duplicación de derivaciones**: `normalizarGridConfig(gridConfigBase)` ×4,
    selector `esApunte` ×11 (con dos semánticas), `estadoVitrinaDelStore` vs el cuerpo
    del hook `useChipRevisionViewModel`.
13. **Naming mixto e inconsistente**: puertos en inglés (`LinkInspectorPort`,
    `SelectedLinkPropertiesPort`), acciones y viewmodels en español, alias que
    renombran (`crearObjeto` ← `crearObjetoDemo`, `renombrar` ← `renombrarSeleccionada`,
    `navegarAEnlace` ← `navegarAEnlaceDesdeTabla`, `traer` ← `traerConectadosSeleccionado`).
    Un mismo concepto tiene 2 o 3 nombres según la capa.
14. **Comentarios de procedencia burocráticos** en lugar de intención: «Ronda Codex v2
    L5», «Línea D (BUG-2026…)», «Paquete "Estados ciudadanos de primera clase"
    (2026-05-23)», «A′-vitrina», «W6.0», «W6.5-b», «Codex L6 (G7)», «CANON-V2 (ronda 28
    L4)». Son útiles como arqueología, pero ruido en el código. Git y docs deberían
    cargar esa historia.
15. **Acciones «...Seleccionado» en todas partes**: la mayoría de los comandos del
    store operan sobre «la selección actual» (`renombrarSeleccionada`,
    `fijarEsenciaSeleccionada`, `ajustarMultiplicidadSeleccionada`, …). Esto obliga a
    hacks como `LinksTableEditPort.renombrarEtiqueta` (selecciona y luego renombra) y
    a leer el store tras cada comando. La reescritura debe exponer comandos por **id
    explícito** y dejar la selección como estado de UI.
16. **Simulación numérica no reproducible sin semilla** (`semilla ?? Math.random`).
    Menor, pero contradice la cultura de reproducibilidad del repo
    (`verify:reproducible`).
17. **`useZustandBugCaptureContextPort`** devuelve un objeto nuevo desde el selector,
    así que el capturador se vuelve a renderizar ante cualquier cambio del store.

---

## 11. Partes de alta calidad que conviene portar casi tal cual

- `completitud.test.ts`: la técnica `Record<Union, true>` y los casos por tipo, con
  la corrección de §6.1 para `default`/`current`.
- `documentPersistencePort.ts` + su test: revalidación de identidad tras cada
  `await`, recuperación volátil aun si IndexedDB falla, conflictos que conservan ambas
  ramas y la distinción honesta local/remoto.
- `documentOperationsPort.ts` (semántica): permiso de un solo uso, recibo
  idempotente, incertidumbre ante fallos posteriores al envío, undo validado contra el
  presente.
- `agentTaskPort.ts`: época del stream y reconexión, y `completedProposalChangeId`
  (no reabrir propuestas ya comprometidas), si se mantiene el agente.
- Funciones puras de viewmodels: `derivarIssuesDiagnostico`/`agruparIssuesDiagnostico`/
  `resumirDeltaDiagnostico`/`resumirPanelDiagnostico`, `calcularResultadosBusquedaCosas`,
  `entidadesTraiblesAlOpd`, las filas y filtros de `tablaEnlacesViewModel`,
  `construirArbol`/`nodosBocetos`, `contextoTimeline` (con fuente de orden revisada),
  `sugerirEnlaceResultado`, `projectAgentTask`, `panelOplMinimizadoEfectivo`,
  `codigoCanonicoSeleccion`, `contarCandidatosTraer`.
- La **tabla declarativa de atajos** como dato: una fuente única para el registro, el
  cheatsheet y los manuales.
- `version.ts` y el ruteo mínimo de `main.tsx` (lector de revisión separado del editor).

---

## 12. Propuesta de rediseño para la capa

1. **Eliminar la capa de puertos-alias.** Queda un solo mecanismo de lectura:
   `useOpm(selector, equality?)` con `shallow` para tuplas. Se agregan hooks de dominio
   solo donde hay derivación (`useOpdActivo()`, `useSeleccion()`,
   `useEspecieDocumento()` con **una** definición de «apunte»,
   `useEditabilidad()`).
2. **Comandos**: la UI llama `comandos.x(args)`, que delega en el kernel. Los ids son
   explícitos y la selección no es parámetro implícito. Las composiciones como
   `crearEstadosConNombres` se vuelven operaciones atómicas del kernel.
3. **Proyecciones puras** (OPL panel, tabla de enlaces, búsqueda, diagnóstico, árbol,
   timeline) viven en `derivar/` o junto a su vista, como funciones `(modelo, ui) → vm`
   probadas sin React. El hook es un `useMemo` de una línea en el componente.
4. **Servicios con I/O** (fuera de React, con transporte inyectado y sin singletons):
   `DocumentChanges` (la cola actual de `documentOperations`, independiente del
   agente), `DocumentStorage` (persistencia local + sync + recuperación + versiones,
   unificando `PersistencePort` y `DocumentPersistencePort`), `AgentTasks` (opcional)
   y `ReviewShares`. Cada uno con `snapshot/subscribe` y un hook genérico
   `useService(svc)`.
5. **Atajos**: una tabla de datos sin combos reservados por el navegador. Escape lo
   resuelve la pila de overlays (un único `OverlayStack` en lugar de 20 flags
   `dialogo*Abierto` en el store global).
6. **Cortes**: mapa del sistema, `features.ts`, `documentFocusViewModel`,
   placeholders, `menuPrincipal`, captura de bugs en producción y el canal
   «A′-vitrina» si el agente integrado lo reemplaza.
7. **Suscripciones**: la raíz no se suscribe al hover ni a la selección. El panel OPL
   se suscribe a su propio estado, y el diagnóstico se memoiza por `modelo` y se
   comparte (hoy se calcula en App, PanelDiagnostico, árbol y overlay).

Estimación: la capa baja de ≈7 200 LOC (sin tests) a ≈2 000–2 500 (servicios
≈1 200, derivaciones ≈900, hooks ≈200), sin perder capacidades.

---

## 13. Riesgos y verificación pendiente

- **No medí en navegador** el costo del re-render por hover. La afirmación se basa en
  la topología de suscripciones (App → panelOplViewModel → hoverOplRef) y en el
  cálculo sin memo de `ui/App.tsx:137`. Hay que confirmarlo con un profiler antes de
  priorizarlo.
- **Atajos reservados**: que `Ctrl+W/T/Tab/1..9` no lleguen a la página es
  comportamiento conocido de Chrome y Firefox, pero no lo probé aquí.
- **Sincronía de `ordenInzoom` con `y`**: hay que revisar `moverAparienciaPorId` y la
  spec `docs/specs/2026-06-15-orden-inzoom-canvas-sync-design.md` antes de declarar
  la inconsistencia.
- **Cascada de Escape**: comprobar dialogo por dialogo cuáles montan
  `aria-modal="true"`; la afirmación vale para los que usan `Dialogo` sin
  `modal={false}` y para los 4 con `aria-modal` explícito.
- **Agente, piezas, revisión y persistencia local** forman parte del «producto
  integrado», implementado pero **no desplegado ni aceptado con proveedor real ni
  personas** (`docs/roadmap/implementacion-producto-integrado.md`, estado al
  2026-09-30). Conservarlos, simplificarlos o posponerlos es una decisión de producto.
  Este dossier solo evalúa su calidad técnica, que es alta.
- Una suite verde no valida el modelado. Las reglas de §6 deben contrastarse con el
  corpus KORA/Forja (autoridad metodológica), no con este dossier.
