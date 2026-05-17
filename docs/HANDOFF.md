# HANDOFF — Estado operativo del modelador OPM

**Fecha**: 2026-05-17
**Repositorio**: `deep-opm-pro`
**Rama**: `main`
**Último corte funcional**: `e407292 refactor(render): extrae handler de tooltip canvas`
**Corte**: Refactorizacion total, Corte 3 cerrado: JointJS queda tratado como adapter de render/interaccion con frontera de aplicacion explicita.

## Política De Handoff Único

`docs/HANDOFF.md` es la única memoria de traspaso vigente del proyecto. No crear handoffs paralelos. Los reportes/capturas regenerables viven ignorados por git; la memoria versionada queda aquí.

## Fuentes Normativas Y Técnicas

- Plan normativo activo: `docs/roadmap/refactorizacion-total-plan-normativo.md`.
- Brief UX/IFML historico: `docs/instrucciones-lineas-dev/ronda22/refactor-ux-ifml.md`.
- SSOT OPM: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`.
- Evidencia OPCloud preferente: `opm-extracted/` antes de `decompiled/`.
- Canon visual local: `docs/JOYAS.md` y `assets/svg/`.
- JointJS OSS: usar documentación oficial viva cuando se toque JointJS.

## Estado Actual

### Refactorizacion Total — Corte 3 JointJS Como Adapter Cerrado — 2026-05-17

La rama `main` queda sincronizada con `origin/main` tras `e407292`.

Resultado arquitectonico:

- `JointCanvas` ya no crea directamente `dia.Graph`/`dia.Paper`; delega montaje, destruccion, debug hook, namespace y grid en `app/src/render/jointjs/jointCanvasAdapter.ts`.
- `CanvasInteractionPort` explicita la frontera que el renderer consume desde sesion, seleccion y comandos de modelo, sin duplicar estado ni crear otro store.
- La sincronizacion de cells proyectadas (`resetCells` + dimensiones de paper) vive en el adapter; `proyectarModeloAJointCells` permanece puro.
- El handler de tooltip de hover/foco sale de `JointCanvas` a `handlers/hoverTooltip.ts`, manteniendo el componente como orquestador.
- No se cambio JointJS, geometria canonica, markers, metadata OPM, OPL, formato de persistencia ni UX visible.

Commits atomicos del corte:

- `fdc8e0a refactor(render): extrae adapter de canvas jointjs`
- `dd7fd37 refactor(app): introduce puerto de interaccion canvas`
- `9e6b841 refactor(render): mueve sync de cells al adapter jointjs`
- `e407292 refactor(render): extrae handler de tooltip canvas`

Validacion de cierre:

```bash
cd app && bun run check
# typecheck OK; 1379 pass / 0 fail
cd app && bun run build
# build OK
cd app && bun run browser:smoke -- e2e/02-canvas-y-render.spec.ts e2e/11-beta1-tabla-enlaces.spec.ts
# 23 passed
```

Documentacion JointJS OSS consultada para el corte:

- `https://docs.jointjs.com/learn/features/diagram-basics/paper/`
- `https://docs.jointjs.com/api/dia/Graph/`
- `https://docs.jointjs.com/4.0/learn/features/customizing-shapes/cell-namespaces/`

### Refactorizacion Total — Corte 1 ViewModels UI Cerrado — 2026-05-17

La rama `main` queda sincronizada con `origin/main` tras `495cc19`.

Resultado arquitectonico:

- `rg "useOpmStore" app/src/ui -l` no reporta archivos.
- Los componentes UI siguen renderizando y gestionando interaccion visual, pero ya no leen Zustand directamente.
- `app/src/app/viewmodels/` actua como fachada temporal sobre el store para pantallas, dialogos, toolbar, mapa, command palette, asistente, arbol, inspectors y chrome.
- No se cambio semantica OPM, textos visibles, layout intencional ni formato de persistencia.
- Se mantuvo JointJS como adapter visual; el corte no movio proyeccion ni geometria.

Commits atomicos recientes de cierre:

- `495cc19 refactor(ui): extrae viewmodel de toolbar base`
- `3d67c08 refactor(ui): extrae viewmodel de barra contextual`
- `4f1c273 refactor(ui): extrae viewmodel de command palette`
- `b70fac1 refactor(ui): extrae viewmodel de mapa sistema`
- `3907535 refactor(ui): extrae viewmodel de menu principal`
- `7911635 refactor(ui): extrae viewmodel de asistente`
- `cd002e3 refactor(ui): extrae viewmodel de capturador bugs`
- `5662d9f refactor(ui): extrae viewmodel de arbol opd`
- `6a6f843 refactor(ui): extrae viewmodel de toolbar creacion`
- `951eb7b refactor(ui): extrae viewmodel de pantalla inicio`
- `d278715 refactor(ui): extrae viewmodel de plantillas`
- `c26c58b refactor(ui): extrae viewmodel de gestion opd`

Validacion acumulada del cierre de Corte 1:

```bash
cd app && bun run typecheck
cd app && bun run build
cd app && bun test src/ui/BarraHerramientasElemento.test.ts
cd app && bun test src/ui/CommandPalette.test.ts
cd app && bun test src/render/jointjs/mapaSistema.test.ts
cd app && bun test src/store/uiPanel.test.ts src/ui/toolbar/ToolbarCreacion.test.ts
cd app && bun run browser:smoke -- e2e/15-superficie-contextual.spec.ts
cd app && bun run browser:smoke -- e2e/12-command-palette.spec.ts
cd app && bun run browser:smoke -- e2e/04-arbol-y-pestanas.spec.ts
cd app && bun run browser:smoke -- e2e/12-toolbar-overflow.spec.ts e2e/02-canvas-y-render.spec.ts e2e/21-estado-vacio-opm.spec.ts
```

Resultados observados:

```text
typecheck OK
build OK
BarraHerramientasElemento: 53 pass / 0 fail
CommandPalette: 4 pass / 0 fail
mapaSistema: 13 pass / 0 fail
uiPanel + ToolbarCreacion: 4 pass / 0 fail
superficie contextual: 11 passed
command palette: 5 passed
arbol y pestanas: 6 passed
toolbar + canvas + estado vacio: 25 passed
```

Siguiente corte normativo recomendado:

- Entrar a Corte 2 del plan: puertos de aplicacion sobre el store existente.
- No hacer otra ronda de viewmodels cosmeticos: el valor ahora esta en que viewmodels grandes dependan de puertos pequenos (`ModelCommandPort`, `SelectionPort`, `OplPort`, `PersistencePort`) en vez de `useOpmStore`.
- Primer candidato pragmatico: consolidar `app/src/app/ports/` existente y migrar 1-2 viewmodels de alto trafico (`toolbarCreacionViewModel`, `jointCanvasViewModel` o `tablaEnlacesViewModel`) a puertos ya creados, sin segundo store global.

### Refactorizacion Total — Corte 2 Puertos De Aplicacion Iniciado — 2026-05-17

Avance posterior al cierre de Corte 1:

- `ea7257a refactor(app): usa puertos en toolbar creacion`
  - `toolbarCreacionViewModel` consume `ModelCommandPort` y `SelectionPort` para comandos de enlace y seleccion.
  - Validado con typecheck, build, `ToolbarCreacion.test.ts` y `e2e/24-conexion-anchor.spec.ts`.
- `1f58233 refactor(app): introduce puerto de sesion canvas`
  - Nuevo `CanvasSessionPort` para estado de sesion/presentacion del canvas.
  - `jointCanvasViewModel` queda compuesto por puertos de comandos, seleccion y sesion canvas.
  - Validado con typecheck, build, `proyeccion.test.ts`, `halos.test.ts` y `e2e/02-canvas-y-render.spec.ts`.
- `9ce1e7f refactor(app): introduce puerto de navegacion opd`
  - Nuevo `OpdNavigationPort` para `modelo`, `opdActivoId` y `cambiarOpdActivo`.
  - `breadcrumbViewModel` deja de depender directo del store.
  - Validado con typecheck, build y `e2e/04-arbol-y-pestanas.spec.ts`.
- `f908717 refactor(app): introduce puerto de arbol opd`
  - Nuevo `OpdTreePort` para acciones/estado especificos del arbol OPD.
  - `arbolOpdViewModel` depende de `OpdNavigationPort` + `OpdTreePort`.
  - Validado con typecheck, build, `bun test src/store.test.ts -t "mapa del sistema"` y `e2e/04-arbol-y-pestanas.spec.ts`.
- `938d78e refactor(app): introduce puerto de tabla enlaces`
  - `tablaEnlacesViewModel` consume `LinksTablePort`.
  - Validado con typecheck, build, suite unitaria completa y smokes de tabla/superficie contextual.
- `0b40679 refactor(app): introduce puerto de inspector enlaces`
  - `inspectorEnlaceViewModel` consume `LinkInspectorPort` dividido internamente por sesion, propiedades, endpoints, grupo estructural, estilo y eliminacion.
  - Validado con typecheck, build, suite unitaria completa y smokes de canvas/enlaces/tabla.
- `7b41642 refactor(app): introduce puerto de paleta comandos`
  - `commandPaletteViewModel` consume `CommandPalettePort`.
  - Validado con typecheck, build, `CommandPalette.test.ts` y smoke `e2e/12-command-palette.spec.ts`.
- `450d85d refactor(app): introduce puertos de chrome e historial`
  - `toolbarBaseViewModel` empieza a depender de `ToolbarChromePort` y `HistoryPort`.
  - Validado con typecheck, build, suite unitaria completa y smokes de toolbar/command palette/undo-redo.
- `f2b1b73 refactor(app): introduce puerto de creacion modelo`
  - Nuevo `ModelCreationPort` para creacion de objeto/proceso/atributo y modal de nombre de cosa.
  - Validado con typecheck, build, suite unitaria completa y smokes de canvas/toolbar/conexion.
- `6b1ec89 refactor(app): usa puerto de seleccion en toolbar`
  - `toolbarBaseViewModel` reutiliza `SelectionPort` para seleccion pasiva y acciones de seleccionar entidad/enlace.
  - Validado con typecheck, suite unitaria completa y tests focales de seleccion.
- `5722eba fix(ui): prioriza escape de dialogos modales`
  - Corrige carrera de Escape entre `Dialogo`, registry global de atajos y `ToolbarMas`.
  - Validado con typecheck, unitarios de atajos/dialogos/toolbar y smoke `HU-33.022`.
- `915f45c refactor(app): introduce puerto de controles workbench`
  - Nuevo `WorkbenchViewControlsPort` para alias/descripciones, modo imagen, grid, configuracion, layout sugerido, biblioteca dock, mapa y simulacion.
  - Validado con typecheck, build, suite unitaria completa y 33 smokes seriales de workbench.
- `5dc9acf refactor(app): introduce puerto de acciones batch seleccion`
  - Nuevo `SelectionBatchActionsPort` compartido por toolbar base y barra contextual.
  - Validado con typecheck, build, suite unitaria completa y 43 smokes de canvas/toolbar/residual.
- `9020873 refactor(app): introduce puerto de acciones enlace`
  - Nuevo `LinkContextActionsPort` compartido por toolbar base y barra contextual para copiar/pegar estilo, portapapeles de estilo y borrado contextual de enlaces.
  - Validado con typecheck, build, suite unitaria completa y 39 smokes de canvas/residual.
- `ebad43c refactor(app): introduce puerto de autosalvado`
  - Nuevo `AutosavePort` para estado y ciclo iniciar/detener autosalvado.
  - `toolbarBaseViewModel` y `toolbarViewModel` dejan de leer autosalvado directo desde Zustand.
  - Validado con typecheck, build, suite unitaria completa y 19 smokes de dirty/undo/toolbar.
- `aff840c refactor(app): reutiliza puerto de navegacion opd en toolbar`
  - `toolbarBaseViewModel` reutiliza `OpdNavigationPort` para `modelo` y `opdActivoId`.
  - Validado con typecheck, build, unitarios focales y smoke `e2e/12-toolbar-overflow.spec.ts`.
- `7774a55 refactor(app): introduce puerto de vista mapa`
  - Nuevo `MapViewPort` para `vistaMapaActiva`, `abrirVistaMapa` y `cerrarVistaMapa`.
  - `WorkbenchViewControlsPort` deja de mezclar responsabilidad de mapa.
  - Validado con typecheck, build, suite unitaria completa y smokes de toolbar/arbol/mapa.
- `4577949 refactor(app): reutiliza puertos en barra contextual`
  - `barraHerramientasElementoViewModel` reutiliza `OpdNavigationPort` y `SelectionPort` para lectura de modelo/OPD/seleccion.
  - Validado con typecheck, build, suite unitaria completa y 28 smokes de canvas/superficie contextual.
- `fe3361f refactor(app): introduce puerto de acciones de elemento`
  - Nuevo `SelectedElementActionsPort` para acciones de estado/refinamiento/imagen sobre el elemento seleccionado.
  - `barraHerramientasElementoViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, suite unitaria completa y 43 smokes de canvas/superficie/refinamiento.
- `64b673b refactor(app): reutiliza puertos en toolbar creacion`
  - `toolbarCreacionViewModel` reutiliza `ModelCreationPort` y `OpdNavigationPort` para modo de creacion y modelo.
  - Validado con typecheck, build, suite unitaria completa y 20 smokes de conexion/canvas.
- `7283f91 refactor(app): introduce puerto de modo interaccion`
  - Nuevo `InteractionModePort` para `modoEnlace` y `modoSeleccion`.
  - `toolbarCreacionViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, suite unitaria completa y 20 smokes de conexion/canvas.
- `fa9d140 refactor(app): introduce puerto de controles mapa`
  - Nuevo `SystemMapControlsPort` para refresco de mapa, auto-refresh y panel de estadisticas.
  - `toolbarMapaSistemaViewModel` queda sin dependencia directa a `useOpmStore`; `mapaSistemaViewModel` reutiliza el puerto para controles compartidos.
  - Validado con typecheck, build, suite unitaria completa y smokes de arbol/mapa/toolbar.
- `224c7c5 refactor(app): reutiliza puertos en mapa sistema`
  - `mapaSistemaViewModel` reutiliza `OpdNavigationPort` para `modelo` y `MapViewPort` para cierre de mapa.
  - Validado con typecheck, build, suite unitaria completa y smoke `e2e/04-arbol-y-pestanas.spec.ts`.
- `c096639 refactor(app): introduce puerto de mensajes de sesion`
  - Nuevo `SessionMessagePort` para `mensaje` y `limpiarMensaje`.
  - `mensajeFlashViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, `MensajeFlashBridge.test.ts` y `feedback.test.ts`.
- `6b3bea9 refactor(app): introduce puertos de modales de metadatos`
  - Nuevos `EntityMetadataModalPort` y `StateDurationModalPort`.
  - `modalImagenObjetoViewModel`, `modalUrlsObjetoViewModel` y `modalDuracionEstadoViewModel` quedan sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, unitarios de metadata/duracion y smoke `e2e/02-canvas-y-render.spec.ts`.
- `8f17d94 refactor(app): introduce puerto de revision mobile`
  - Nuevo `MobileReviewPort` para tabs del modo revision mobile.
  - `modoRevisionMobileViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, `ModoRevisionMobile.test.tsx` y smoke `e2e/22-responsive-review.spec.ts`.
- `8c07ae5 refactor(app): introduce puerto de dialogo configuracion`
  - Nuevo `ConfigurationDialogPort` con grid normalizado en adapter.
  - `dialogoConfiguracionViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build y smokes `e2e/11-dialogo-layout-regression.spec.ts` + `e2e/12-toolbar-overflow.spec.ts`.
- `d814e30 refactor(app): introduce puerto de pestanas de sesion`
  - Nuevo `SessionTabsPort` para pestanas abiertas, activa, cambio/cierre/reordenamiento y guardado local del cierre dirty.
  - `barraPestanasViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, unitarios de pestanas/persistencia/runtime y smoke `e2e/04-arbol-y-pestanas.spec.ts`.
- `08b631e refactor(app): reutiliza puertos en menu principal`
  - `menuPrincipalViewModel` empieza a reutilizar puertos existentes de chrome, pestanas, persistencia, workspace, mapa, workbench, navegacion OPD y seleccion.
  - `PersistencePort` incorpora `abrirCargarModelo`.
  - Validado con typecheck, build, unitarios focales y smoke `e2e/12-toolbar-overflow.spec.ts`.
- `e1ce0c0 refactor(app): introduce puertos complementarios de menu`
  - Nuevos `HelpPort`, `ModelBootstrapPort`, `SearchDialogsPort` y `TemplateDialogsPort`.
  - `LinksTablePort`, `PersistencePort` y `EntityMetadataModalPort` incorporan openers nombrables.
  - `menuPrincipalViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, unitarios focales y smokes de toolbar, command palette y tabla de enlaces.
- `5ea674a refactor(app): reutiliza puertos en inspector raiz`
  - `inspectorViewModel` reutiliza `OpdNavigationPort`, `SelectionPort` y `PersistencePort`.
  - Validado con typecheck, build, unitarios de inspector y smokes de superficie contextual, tabs de inspector y catalogo/ancla.
- `22be80b refactor(app): introduce puerto de overflow toolbar`
  - Nuevo `ToolbarOverflowPort` para `ToolbarMas`.
  - `toolbarMasViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, unitarios de UI panel/toolbar y smoke `e2e/12-toolbar-overflow.spec.ts`.
- `ed91881 refactor(app): introduce puerto de pantalla inicio`
  - Nuevo `WelcomeScreenPort`; `pantallaInicioViewModel` reutiliza puertos de bootstrap, navegacion, persistencia y workspace.
  - Validado con typecheck, build, `PantallaInicio.test.ts`, `persistencia.test.ts` y smoke `e2e/21-estado-vacio-opm.spec.ts`.
- `e329b31 refactor(app): introduce puerto de editabilidad`
  - Nuevo `EditabilityPort` para `readOnly`.
  - `estadoVacioOpmViewModel` reutiliza `OpdNavigationPort`, `ModelCommandPort`, `ModelBootstrapPort` y `EditabilityPort`.
  - Validado con typecheck, build, unitarios focales de estados y smoke `e2e/21-estado-vacio-opm.spec.ts`.
- `a936dc2 refactor(app): amplia puerto de plantillas`
  - `TemplateDialogsPort` cubre catalogo, guardado e insercion de plantillas.
  - `dialogoPlantillasViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, unitarios de plantillas/batch y smokes residuales/toolbar.
- `b810701 refactor(app): introduce puerto de historial versiones`
  - Nuevo `VersionHistoryPort` para dialogo de versiones, creacion manual, restauracion, eliminacion y toggle de visibilidad.
  - `dialogoVersionesViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, unitarios de versiones/persistencia y smoke residual completa.
- `277f1bc refactor(app): introduce puerto de timeline`
  - Nuevo `TimelinePort`; `timelineViewModel` reutiliza `OpdNavigationPort` y `SelectionPort`.
  - Validado con typecheck y build.
- `5dbe3f2 refactor(app): introduce puerto de traer conectados`
  - Nuevo `BringConnectedDialogPort`; el viewmodel reutiliza navegacion OPD y seleccion para conteos.
  - Validado con typecheck, build, `operacionesBatch.test.ts` y smoke `e2e/07-enlaces-avanzados.spec.ts`.
- `5810c17 refactor(app): introduce puertos de busqueda`
  - `SearchDialogsPort` queda como opener; nuevos subpuertos para busqueda intra-modelo y global.
  - `busquedaCosasViewModel` y `busquedaGlobalViewModel` quedan sin dependencia directa al store.
  - Validado con typecheck, build, unitarios de workspace/busqueda y 33 smokes de busqueda/workspace/residual.
- `7d00655 refactor(app): introduce puerto de gestion arbol opd`
  - Nuevo `OpdTreeManagementPort`; `gestionArbolOpdViewModel` queda aislado del puerto ancho del arbol lateral.
  - Validado con typecheck, build, unitarios OPD/arbol y smoke `e2e/04-arbol-y-pestanas.spec.ts`.
- `d312f46 refactor(app): introduce puerto de contexto bugs`
  - Nuevo `BugCaptureContextPort` con helper puro para contexto store+navegador.
  - `capturadorBugsViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, unitario del shape y smoke `e2e/10-capturador-bugs.spec.ts`.
- `f52b7cf refactor(app): introduce puertos de mapa sistema`
  - Nuevos puertos de datos, viewport y filtros del mapa; `mapaSistemaViewModel` queda sin store directo.
  - Validado con typecheck, build, unitarios de mapa y smokes de arbol/mapa/toolbar.
- `7c54039 refactor(app): introduce puerto de asistente modelo`
  - Nuevo `NewModelAssistantPort`; las mutaciones imperativas del wizard salen del viewmodel.
  - Validado con typecheck, build, unitarios de asistente/estado vacio y smoke `e2e/21-estado-vacio-opm.spec.ts`.
- `881d931 refactor(app): introduce puertos de app shell`
  - Nuevos puertos shell-only para workbench/layout/modos y overlays.
  - `appShellViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, unitarios focales y 32 smokes de canvas/arbol/toolbar/mobile.
- `24fc92c refactor(app): introduce puertos de inspector entidad`
  - Nuevos subpuertos para shell, semantica, metadata, estilo, refinamiento y estados del inspector de entidad.
  - `inspectorEntidadViewModel` queda sin dependencia directa a `useOpmStore`; el caso `crearEstadosConNombres` conserva la lectura post-mutacion en el adapter.
  - Validado con typecheck, build, 28 unitarios focales y 62 smokes de canvas/inspector/refinamiento/enlaces.

Estado arquitectonico del ultimo corte:

- `toolbarBaseViewModel` queda sin dependencia directa a `useOpmStore`; se compone por puertos pequenos (`ToolbarChromePort`, `HistoryPort`, `ModelCreationPort`, `SelectionPort`, `WorkbenchViewControlsPort`, `LinkContextActionsPort`, `SelectionBatchActionsPort`, `AutosavePort`, `OpdNavigationPort`, `MapViewPort`).
- `barraHerramientasElementoViewModel` queda sin dependencia directa a `useOpmStore`; se compone por `OpdNavigationPort`, `SelectionPort`, `SelectedElementActionsPort`, `SelectionBatchActionsPort` y `LinkContextActionsPort`.
- `toolbarViewModel` queda sin dependencia directa a `useOpmStore`; consume `AutosavePort` y `MapViewPort`.
- `toolbarCreacionViewModel` queda sin dependencia directa a `useOpmStore`; se compone por `ModelCommandPort`, `ModelCreationPort`, `OpdNavigationPort`, `SelectionPort` e `InteractionModePort`.
- `toolbarMapaSistemaViewModel` queda sin dependencia directa a `useOpmStore`; consume `SystemMapControlsPort`.
- `menuPrincipalViewModel`, `barraPestanasViewModel`, `inspectorViewModel`, `toolbarMasViewModel`, `pantallaInicioViewModel`, `estadoVacioOpmViewModel`, `mensajeFlashViewModel`, `modoRevisionMobileViewModel`, `dialogoConfiguracionViewModel`, `dialogoPlantillasViewModel`, `dialogoVersionesViewModel`, `timelineViewModel`, `dialogoTraerConectadosViewModel`, `busquedaCosasViewModel`, `busquedaGlobalViewModel`, `gestionArbolOpdViewModel`, `capturadorBugsViewModel`, `mapaSistemaViewModel`, `asistenteNuevoModeloViewModel`, `appShellViewModel`, `inspectorEntidadViewModel` y los viewmodels de modales de metadata quedan sin dependencia directa a `useOpmStore`.
- `rg "useOpmStore|from \"../../store\"|from '../../store'" app/src/app/viewmodels -n` no reporta resultados.
- No se introdujo segundo store, estado duplicado ni DI global.

Estado pendiente observado tras `24fc92c`:

- `rg "useOpmStore" app/src/app/viewmodels -l` reporta 0 viewmodels directos.
- Siguiente orden recomendado del plan normativo: entrar a Corte 3 con `JointCanvas`/render y handlers como adapters hacia puertos/eventos, manteniendo proyeccion pura testeable; no iniciar otro refactor UI cosmetico.

Regla operativa nueva: antes de migrar otro viewmodel, preferir reutilizar un puerto existente. Crear un puerto nuevo solo si representa una capacidad nombrable y reusable, no una coleccion accidental de selectors.

### Post-Brief HODOM Denso — Foco De Estados OPM — 2026-05-16

La rama `main` queda preparada para sincronizarse con `origin/main` tras `993e1f9`, que corrige la precisión OPM del foco temporal iniciado en `daa3bc3`:

- `TablaEnlaces` ya no degrada extremos `estado` a la entidad contenedora al construir `idsResaltadosTemporales`; conserva el `estado.id` cuando el enlace apunta a una cápsula.
- La proyección JointJS agrega halo `selection-halo` con `targetKind: "estado"` sobre la cápsula interna visible, usando geometría compartida `rectCapsulaEstado`.
- Si el estado no está visible por plegado parcial o supresión, el foco degrada al objeto contenedor para evitar selecciones invisibles.
- Los halos de entidad existentes quedan estables: metadata previa sin `targetKind` para no romper consumidores actuales.
- E2E nuevo cubre el flujo real: filtro en tabla sobre enlace `s-pendiente -> Aprobar`, botón `Resaltar filtrados`, enlace resaltado, halo en `s-pendiente`, sin halo falso en `o-pedido`.

Validación del corte:

```bash
cd app && bun run typecheck
cd app && bun test src/render/jointjs/proyeccion.test.ts src/render/jointjs/composers/halos.test.ts
# 59 pass / 0 fail
cd app && bun run browser:smoke -- e2e/11-beta1-tabla-enlaces.spec.ts
# 6 passed
cd app && bun run lint
cd app && bun run test
# 1373 pass / 0 fail
cd app && bun run build
cd app && bun run browser:smoke
# 193 passed / 0 fail
```

### Post-Brief HODOM Denso — 2026-05-16

La rama `main` queda preparada para sincronizarse con `origin/main` tras `daa3bc3`, que conecta `TablaEnlaces` con foco visual en el canvas:

- Búsqueda textual por origen, destino, etiqueta, tipo, familia y OPD.
- Filtro por familia `Procedurales` / `Estructurales` / `Todos`.
- Contador accesible `filtrados/total` con desglose procedurales/estructurales y visibles en el OPD activo.
- Botón de limpieza de filtros.
- Botón `Resaltar filtrados` que no cierra la tabla, cambia al primer OPD relevante si el filtro no tiene enlaces visibles en el OPD actual y resalta enlaces + extremos como subgrafo temporal.
- `idsResaltadosTemporales` vuelve a participar en la proyección JointJS, sin contaminar la selección real del store.
- Smokes específicos sobre modelo mixto de 10 enlaces para cubrir búsqueda + familia + foco visual sin romper edición, eliminación ni navegación existente.

Prueba directa con HODOM v1.1 real:

```bash
# Cargado por browser contra http://127.0.0.1:5173/
# Contador inicial: 113 de 113 enlaces · 83 procedurales · 30 estructurales · 21 visibles en SD-0 — Establecimiento HODOM
# Búsqueda "Paciente": 19 enlaces resaltados · 7 visibles en SD-0 — Establecimiento HODOM
# Foco canvas: 5 enlaces con wrapper resaltado + 4 halos de extremos
# pageErrors: []
```

Validación del corte:

```bash
cd app && bun run typecheck
cd app && bun run browser:smoke -- e2e/11-beta1-tabla-enlaces.spec.ts
# 5 passed
cd app && bun run lint
cd app && bun run test
# 1371 pass / 0 fail
cd app && bun run build
cd app && bun run browser:smoke
# 192 passed / 0 fail
cd app && node scripts/in-vivo-test.mjs http://127.0.0.1:5173/
# OK=57 FAIL=0 WARN=0 INFO=2
```

### UX/IFML Ronda 22 — 2026-05-16

La rama `main` quedó sincronizada con `origin/main` tras el commit `08b3753`, que reemplaza la sonda in-vivo obsoleta por una auditoría alineada a la UI actual:

- Carga/bienvenida y mini-glosa OPM.
- Chrome IFML desktop: `ViewPoint` default, clusters `Modelar`/`Conectar`/`Ayuda`, menú principal y `CommandPalette`.
- Ejemplo canónico `Cafetera Domestica`: JointJS, OPL y SSOT visual (`#fdffff`, `#70E483`, `#3BC3FF`, 135x60).
- Overlay feedback: `BarraHerramientasElemento`, `ErrorBadge`, `HoverTooltip`, `FlashToast`.
- Conexión por `MenuTipoEnlace` y submodo accesible `conectando`.
- Import JSON multi-OPD y navegación del árbol.
- Mobile review 390x844: tabs `Canvas`/`OPDs`/`OPL`/`Issues`, sin overflow horizontal.

Resultado de la última auditoría:

```bash
cd app
node scripts/in-vivo-test.mjs http://127.0.0.1:5173/
# OK=57 FAIL=0 WARN=0 INFO=2
# pageerror=0 console.error=0 console.warn=0 requestfailed=0
```

El script genera `docs/REPORTE-EJECUTIVO.md` y `app/test-results/in-vivo/`, ambos ignorados por git según `.gitignore`.

## Validación Reciente

Ejecutado sobre el estado actual (`e407292`):

```bash
cd app && bun run check
cd app && bun run build
cd app && bun run browser:smoke -- e2e/02-canvas-y-render.spec.ts e2e/11-beta1-tabla-enlaces.spec.ts
```

Resultado:

```text
typecheck OK via check
1379 unit tests passed / 0 fail
build OK
23 browser smoke passed / 0 fail
```

Última auditoría in-vivo completa sigue siendo la de `08b3753`/`63dd213`; este corte no cambió el script in-vivo ni la semantica OPM, solo la frontera JointJS/app/render.

Validación HODOM v1.1 realizada sobre el corte funcional previo de foco canvas:

```bash
cd app
bun -e 'import { readFileSync } from "node:fs"; import { hidratarModelo } from "./src/serializacion/json"; import { proyectarModeloAJointCells } from "./src/render/jointjs/proyeccion"; const raw = readFileSync("/home/felix/projects/hd-hsc-os/docs/models/opm-hodom-bundle-v1.1.json", "utf8"); const hidratado = hidratarModelo(raw); if (!hidratado.ok) throw new Error(hidratado.error); const modelo = hidratado.value; const proyecciones = Object.keys(modelo.opds).map((opdId) => ({ opdId, cells: proyectarModeloAJointCells(modelo, opdId, null, null).length })); console.log(JSON.stringify({ entidades: Object.keys(modelo.entidades).length, enlaces: Object.keys(modelo.enlaces).length, opds: Object.keys(modelo.opds).length, proyecciones }, null, 2));'
# entidades=46 enlaces=113 opds=5
# opd-sd0=43 cells, opd-sd1=97, opd-sd1-2=38, opd-eq-salud-hd=19, opd-cap-op-hd=15
```

## Commits Relevantes Del Cierre UX/IFML

- `993e1f9 feat(ux): enfoca extremos de estado filtrados`
- `63dd213 docs: registra foco hodom en canvas`
- `96d5097 feat(ux): filtra tabla de enlaces densa`
- `daa3bc3 feat(ux): enfoca enlaces filtrados en canvas`
- `08b3753 test(ux): actualiza auditoria in vivo`
- `de67395 refactor(a11y): unifica fuente de avisos`
- `84a96f2 test(a11y): cubre ciclo de feedback`
- `5ac1319 fix(a11y): ajusta contraste de warning`
- `d9b85c1 fix(a11y): respeta reduced motion`
- `38762ea fix(a11y): describe hover tooltip al foco`
- `15d9077 fix(a11y): anuncia cambios de viewpoint`
- `f5486db fix(a11y): navega tabs del inspector con flechas`
- `f10ce76 refactor(ifml): tipa eventos de acciones contextuales`
- `76b1911 feat(a11y): permite conectar por teclado`
- `d7c2c1d feat(ux): guia conexion por anchors`
- `97abbb8 feat(ifml): declara contexto canonico del workbench`
- `976ef1d refactor(ux): ordena menu principal por intencion`

## Workspace No Consolidado

Hay artefactos no trackeados en `docs/audits/`, `docs/bugs/` y `docs/instrucciones-lineas-dev/ronda22/`. Son insumos/artefactos de trabajo previos; no promoverlos sin una decisión explícita de alcance.

También pueden existir salidas regenerables ignoradas:

- `docs/REPORTE-EJECUTIVO.md`
- `app/test-results/in-vivo/`
- `app/dist/`

## Pendientes Post-Brief Y Refactorizacion

El brief UX/IFML queda cerrado para el corte auditado. Los cortes de modelos densos ya mejoraron `TablaEnlaces`, conectaron sus filtros con foco visual en canvas y corrigieron el foco de extremos `estado`.

Pendiente inmediato de refactorizacion:

- Continuar Corte 4: persistencia y workspace como infraestructura.
- Introducir `PersistencePort`/`WorkspacePort` solo donde reduzcan acoplamiento real, sin cambiar formato exportado ni claves localStorage.
- Mantener `OpmStore` como fachada compatible mientras se separan persistencia, workspace y comandos de modelado.
- Seguir usando smokes focales y `bun run check` como cierre de loop por corte.

Pendientes funcionales a retomar despues o como pressure tests:

- **Mini-mapa / mapa del sistema más operativo**: navegación visual para modelos densos.
- **Import/export OPX real**: interoperabilidad más allá del JSON local.
- **Modelos densos HODOM**: profundizar filtros de canvas, mini-mapa y performance perceptual con 5 OPDs y 113 enlaces.
- **Enlaces OPCloud avanzados**: forked tagged links, smoke UI específico para tagged/bidirectional + exception/time.
- **Comentarios/notas**: EPICA-42 sigue fuera del modo mobile review productivo; hoy se comunica como no disponible.

## Prompt De Continuación

Retomar desde este `docs/HANDOFF.md` y el plan `docs/roadmap/refactorizacion-total-plan-normativo.md`.

Siguiente bloque recomendado: iniciar **Corte 4 - Persistencia Y Workspace Como Infraestructura**. Objetivo pragmatico: separar persistencia local, workspace y busqueda/global-openers del store sin cambiar formato JSON, claves locales ni UX visible. Validar siempre con typecheck, unit dirigido, build, suite completa cuando el cambio toque persistencia/workspace, y smokes `e2e/06-undo-redo-dirty.spec.ts` + `e2e/01-carga-y-workspace.spec.ts`.
