# Ronda 7 — Instrucciones de lineas de desarrollo paralelas

**Fecha**: 2026-05-05
**Base**: `main` @ commit `46df2ad` (`chore(ledger): regenera evidencia hu-progress post-ronda 6`) — HANDOFF vigente con rondas 1-6 consolidadas; el workspace puede contener archivos sueltos del operador (`L1`, `L2.md..L6.md`, `session-ses_208e.md`, `app/src/render/jointjs/customShapes.ts`) y un directorio `home/`. Esos archivos no son input de esta ronda, no se editan, no se eliminan.
**Objetivo**: 6 lineas paralelas para los pendientes priorizados post-ronda 6 del HANDOFF: multi-seleccion + batch (desbloqueo), cierre del Mapa del sistema (incluye fix render), multi-pestana + bloques OPL jerarquicos, cierre del workspace (mover modelos, drag-drop carpetas, busqueda global, versiones simples), atajos teclado centralizados + cierre del arbol OPD, y objetos avanzados (alias/unidad/URL/descripcion/duracion + designaciones de estado).

## 1. Filosofia operativa

- **No reinventar**: antes de disenar, revisar `opm-extracted/INDEX.md`, `opm-extracted/MODULES.md`, `opm-extracted/README.md`, `opm-extracted/REFACTOR-NOTES.md`, `opm-extracted/assets/INDEX.md`, modulos `src/` citados por cada brief, `assets/svg/`, `assets/png/`, `docs/JOYAS.md`, `fixtures/`, los briefs y commits de rondas 1-6 y la SSOT `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`. Cada linea cita evidencia concreta con path absoluto desde el repo root.
- **HU como contrato**: cada linea cierra HU explicitas del backlog vivo (`docs/historias-usuario-v2/`) o reduce una brecha listada en `docs/HANDOFF.md` y `docs/roadmap/hu-progress.md`. La ronda 6 dejo el detector calibrado a 47/49 reglas; cualquier evidencia que agreguen las lineas debe seguir disparando esas reglas (sin caidas).
- **Aditividad estricta**: campos nuevos opcionales, helpers nuevos, componentes nuevos. No renombrar tipos, no romper JSON legacy, no reordenar APIs publicas compartidas salvo wrapper minimo documentado en commit. Las decisiones vigentes de `docs/HANDOFF.md §Decisiones Vigentes` no se reabren.
- **Modularidad por dominio**: post-ronda 6 los archivos compartidos crecieron a niveles delicados — `app/src/store.ts` mide **2554 LOC**, `app/src/modelo/operaciones.ts` mide **1743 LOC**, `app/src/render/jointjs/proyeccion.ts` mide **1116 LOC**, `app/src/opl/generar.ts` mide **988 LOC**, `app/src/ui/PanelCarpetas.tsx` mide **609 LOC**, `app/src/ui/ArbolOpd.tsx` mide **539 LOC**, `app/src/ui/InspectorEntidad.tsx` mide **522 LOC**, `app/src/ui/PanelOpl.tsx` mide **435 LOC`. Toda capacidad nueva debe vivir en modulo de dominio nuevo (`canvas/seleccionMultiple.ts`, `canvas/operacionesBatch.ts`, `render/jointjs/mapaExport.ts`, `store/pestanas.ts`, `opl/bloquesJerarquicos.ts`, `persistencia/movimientoModelos.ts`, `persistencia/versiones.ts`, `ui/atajosTeclado.ts`, `modelo/objetoMetadata.ts`, `modelo/estadosDesignaciones.ts`, etc.). Los monoliticos `store.ts`, `operaciones.ts`, `proyeccion.ts`, `generar.ts` y los archivos UI grandes solo admiten wrappers finos cuando una firma existente lo obliga.
- **Loop verde obligatorio**: cada linea cierra con `cd app && bun run check`; si toca UI/render, sumar `bun run browser:smoke`; si toca proyeccion JointJS o serializacion, sumar `bun run build`. Linea base post-ronda 6: 412 unit tests / 2006 expect, 37/37 smoke (40.0 s), bundle 915 KB minificado / 261 KB gzip.

## 2. Reglas duras comunes

1. **Scope estricto**: solo tocar archivos permitidos por el brief. Si aparece un cambio cross-line no previsto, detenerse y reportar (no resolver por invasion silenciosa).
2. **No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`** desde las lineas. El handoff unico se actualiza solo en consolidacion final. Tampoco tocar `docs/instrucciones-lineas-dev/ronda1..6/` (memoria historica).
3. **No tocar archivos sueltos del operador** en working tree raiz (`L1`, `L2.md`, `L3.md`, `L4.md`, `L5.md`, `L6.md`, `session-ses_208e.md`) ni `app/src/render/jointjs/customShapes.ts` ni `home/`. Son WIP del operador, fuera de scope; ni editar, ni mover, ni borrar.
4. **No copiar codigo 1:1 desde `opm-extracted/`**. Se usa como evidencia semantica, UX y trazabilidad; la implementacion en `app/` se reescribe con Preact/Zustand/JointJS OSS.
5. **Citas explicitas**: toda decision semantica cita SSOT (`opm-iso-19450-es.md`, `opm-visual-es.md`, `opm-opl-es.md`, `metodologia-opm-es.md`) o documento interno (`docs/JOYAS.md`, `opm-extracted/...` con path absoluto desde repo root + lineas cuando aplique).
6. **Assets canonicos**: iconos y markers salen de `assets/svg/` y `assets/png/`. No redibujar `folder.svg`, `delete.svg`, `styleElement.svg`, marcadores de enlaces, abrir-iconos ni iconos de wizard si ya existen en `assets/`.
7. **JSON lossless**: cualquier campo nuevo se serializa/deserializa con default seguro; modelos previos siguen cargando. Roundtrip lossless verificado por unit tests aditivos en `app/src/serializacion/json.test.ts` (no reescribir tests existentes).
8. **Tests por capa**: kernel (`modelo/*.test.ts`), serializacion (`serializacion/json.test.ts`), OPL (`opl/*.test.ts`), render (`render/jointjs/*.test.ts`) y store/UI (`store.test.ts`, smoke) se prueban segun el blast radius de cada linea.
9. **Idiomas**: documentacion y mensajes de usuario en es-CL; identificadores siguen el estilo existente del repo (camelCase TS, kebab-case data-testid).
10. **No introducir backend, Firebase, auth, Rappid ni dependencias nuevas** en esta ronda. Las HU que requieran multi-usuario, permisos O/W/R, ACL, simulacion, sub-modelos, plantillas, OPCAT, PDF/SVG export server-side, MQTT/ROS/HTTP runtime, IA generativa, graphDB, chat o notas adhesivas quedan fuera y deben omitirse del slice si las cita la EPICA. La excepcion es L2 que puede emitir PNG/SVG cliente-side via `canvas.toBlob()` o serializacion JointJS sin libreria nueva.
11. **Commits de linea**: mensajes imperativos con `feat(...)`, `test(...)`, `refactor(...)`, `chore(...)`; reportar hashes y comandos ejecutados al cerrar. Co-author footer si aplica al implementador externo.
12. **No reabrir contratos de rondas 1-6**: workspace local con jerarquia de carpetas sin permisos (L4 ronda 7 lo cierra aditivamente), Importacion JSON no autopersiste, Bus de agregacion derivado en render, Apariencia.estilo invariante a OPL, OPL-ES como lente derivada, Modelo post-asistente queda dirty, Mapa = vista neutra (no OPM), arbol expandido por default invirtiendo set a `colapsados`, multiplicidad canonica + custom validada, abanicos OR/XOR como arcos canonicos r=30/r=35. Si la linea necesita matizarlos, lo declara como decision documentada en commit; no los rompe.

## 3. Stack y comandos del repo

- Bun 1.3+, TypeScript strict, Preact 10 + Signals, Zustand 5, JointJS 3.7 core, Vite 6, Playwright.
- Working directory: `/home/felix/projects/deep-opm-pro`; app en `app/`.

```bash
cd app
bun run check          # typecheck + unit tests
bun run browser:smoke  # Playwright Chromium para UI/render
bun run build          # build Vite; warning de chunk JointJS esperado
bun run dev            # localhost:5173
```

Auditoria HU al cierre de consolidacion:

```bash
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

## 4. Vision general de las 6 lineas

| ID | Titulo | Pendiente que cierra | HU eje | Tamano | Riesgo |
|---|---|---|---|---|---|
| **L1** | Multi-seleccion y operaciones batch | "Multi-seleccion no implementada — bloquea HU-11.007/.008/.023, HU-14.016, HU-16.022" + M0 HU-11.001 | HU-SHARED-008, HU-11.001, HU-11.007, HU-11.008, HU-11.023, HU-14.016, HU-90.003, HU-90.004, HU-90.005, HU-90.006, HU-90.007, HU-90.019 | L | alto |
| **L2** | Mapa del sistema cierre + fix render | "Mapa render visual incompleto: scaleContentToFit con >=2 OPDs" + EPICA-21 a 0% | HU-21.005, HU-21.009, HU-21.011, HU-21.012, HU-21.013, HU-21.014, HU-21.016, HU-21.017, HU-21.018 | M | medio |
| **L3** | Multi-pestana + bloques OPL jerarquicos | "EPICA-34 HU-34.002/.003 abiertos" + "EPICA-50 HU-50.027 fuera de slice" | HU-34.002, HU-34.003, HU-50.027 | M | medio-alto |
| **L4** | Workspace cierre: mover, cut/paste, drag-drop, busqueda global, versiones simples | "EPICA-30/31/35 workspace pendientes" | HU-35.001-005, HU-31.011-013, HU-30.029, HU-30.011, HU-30.023, HU-30.025, HU-30.027 | L | medio |
| **L5** | Atajos teclado centralizados + cierre arbol OPD | "EPICA-90 0%" + "EPICA-20 atajos teclado/divisor/menu contextual/toggle" | HU-90.001-009/.010-013/.014/.015/.016/.017/.020/.021, HU-20.009, HU-20.010, HU-20.011, HU-20.013 | M | bajo |
| **L6** | Objetos avanzados + cierre estados/plegado parcial | "EPICA-17 a 11.1% (24 HU pend)" + cierre EPICA-13/.18 | HU-17.002-012, HU-17.018-023, HU-17.027-030, HU-17.033, HU-17.034, HU-13.007, HU-13.010-013, HU-13.019, HU-18.011, HU-18.013, HU-18.014, HU-18.015 | L | medio |

Quedan fuera de ronda 7: HU-50.028 AI text (requiere LLM externo), HU-30.021/.022 ejemplos globales/org (requiere catalogo curado), HU-30.024/.026 log-scale + auto-archivado (requiere job y politica), HU-31.008/.014-021/.024-025 permisos O/W/R y matriz (requiere multi-usuario), HU-35.007/.016/.017 ACL al mover y biblioteca lateral arrastrable (requiere multi-usuario / canvas drag), HU-11.026/.027 tabla tipos extendida + Condicion/Evento/NOT (requiere kernel `enlace.subtipo` + render), HU-15.* multiplicidad avanzada, HU-19.* imagenes incrustadas, HU-1A/1B canvas grid/snap/traer-conectados, HU-32 sub-modelos, HU-33 plantillas, HU-60/61 export PDF/SVG papel completo, HU-70/71 OPCAT/CSV, HU-80-82 config usuarios/defaults/ontologia, HU-91 tutorial, HU-A0-A2 estereotipos/requisitos/IA, HU-B0-B5 simulacion, HU-C0-C2 runtime MQTT/URL/ROS, HU-D0-D1 analisis. Refactor de `operaciones.ts` y `store.ts`, code splitting Vite y redistribucion publica tampoco entran en esta ronda — la regla de modularidad por dominio mantiene el crecimiento bajo control.

## 5. Mapa de archivos por linea

Convencion: `aditivo` = solo agregar o conectar helper; `nuevo` = archivo creado por esa linea; `lectura` = puede leerse pero no editarse; vacio = sin contacto.

| Archivo | L1 | L2 | L3 | L4 | L5 | L6 |
|---|---|---|---|---|---|---|
| `app/src/modelo/tipos.ts` | aditivo (`ui.seleccionados` ya transitorio, no tocar; agregar `ui.portapapelesVisual?` opcional) | — | aditivo (`pestanasAbiertas`, `pestanaActivaId` en sesion, no JSON OPM) | aditivo (`carpeta.archivada?`, `modelo.archivado?`, `modelo.versiones?`) | aditivo opcional (`ui.anchoPanelArbol?`, `ui.nombresArbolVisibles?`) | aditivo (`entidad.alias?`, `entidad.unidad?`, `entidad.descripcion?`, `entidad.urls?`, `estado.designaciones?`, `estado.duracion?`, `estado.suprimido?`, `entidad.layoutEstados?`, `apariencia.modoPlegado?`) |
| `app/src/modelo/operaciones.ts` | lectura | lectura | lectura | lectura | lectura | lectura o wrapper minimo |
| `app/src/canvas/seleccionMultiple.ts` | **nuevo** | — | — | — | — | — |
| `app/src/canvas/operacionesBatch.ts` | **nuevo** | — | — | — | — | — |
| `app/src/canvas/seleccionMultiple.test.ts` | **nuevo** | — | — | — | — | — |
| `app/src/canvas/operacionesBatch.test.ts` | **nuevo** | — | — | — | — | — |
| `app/src/render/jointjs/mapaSistema.ts` | — | EDIT aditivo (filtros, resaltado, estadisticas, marcadores, scaleContentToFit fix) | — | — | — | — |
| `app/src/render/jointjs/mapaSistema.test.ts` | — | EDIT aditivo | — | — | — | — |
| `app/src/render/jointjs/mapaExport.ts` | — | **nuevo** | — | — | — | — |
| `app/src/render/jointjs/mapaExport.test.ts` | — | **nuevo** | — | — | — | — |
| `app/src/render/jointjs/proyeccion.ts` | aditivo (halo de seleccion multi sobre apariencias) | aditivo (resaltado por tipo) | lectura | lectura | lectura | aditivo (alias/unidad/badges en label, designaciones en estados) |
| `app/src/render/jointjs/proyeccion.test.ts` | aditivo | aditivo | lectura | lectura | lectura | aditivo |
| `app/src/render/jointjs/JointCanvas.tsx` | EDIT aditivo (rubber-band Shift+drag, Ctrl+clic, Esc, halo selection) | EDIT aditivo (zoom Ctrl+rueda, pan, refresco mapa, hookear export y filtros) | lectura | lectura | aditivo (Ctrl+0 fit, Ctrl+rueda zoom global) | lectura |
| `app/src/store.ts` | aditivo (acciones seleccion+batch agrupadas en bloque "Seleccion") | aditivo (acciones mapa: filtros, resaltado, export, refresh, persistencia view) | aditivo (slice pestanas) | aditivo (movimiento, drag-drop, busqueda global, versiones, archivado) | aditivo (atajos centrales registry) | aditivo (alias, unidad, descripcion, urls, designaciones, duracion, suprimido, layoutEstados, modoPlegado) |
| `app/src/store.test.ts` | aditivo | aditivo | aditivo | aditivo | aditivo | aditivo |
| `app/src/store/pestanas.ts` | — | — | **nuevo** | — | — | — |
| `app/src/store/pestanas.test.ts` | — | — | **nuevo** | — | — | — |
| `app/src/opl/generar.ts` | lectura | lectura | aditivo (numerar oraciones por OPD para bloques jerarquicos) | lectura | lectura | aditivo (alias `, tambien iP`, unidad `[°C]`, designaciones `es el estado inicial de`, duracion canonica, plegado-parcial `lista A y B como rasgos`) |
| `app/src/opl/generar.test.ts` | lectura | lectura | aditivo | lectura | lectura | aditivo |
| `app/src/opl/bloquesJerarquicos.ts` | — | — | **nuevo** | — | — | — |
| `app/src/opl/bloquesJerarquicos.test.ts` | — | — | **nuevo** | — | — | — |
| `app/src/persistencia/local.ts` | lectura | lectura | aditivo (no autopersistir pestanas; sesion-only) | aditivo (`modelo.archivado?`, `modelo.versiones?`, `carpeta.archivada?`) | lectura | aditivo (alias/unidad/descripcion/urls/designaciones/duracion en local) |
| `app/src/persistencia/local.test.ts` | lectura | lectura | lectura | aditivo | lectura | aditivo |
| `app/src/persistencia/workspace.ts` | — | — | lectura | EDIT aditivo (movimiento de modelos, cut/paste carpetas, busqueda global) | — | lectura |
| `app/src/persistencia/movimientoModelos.ts` | — | — | — | **nuevo** | — | — |
| `app/src/persistencia/movimientoModelos.test.ts` | — | — | — | **nuevo** | — | — |
| `app/src/persistencia/versiones.ts` | — | — | — | **nuevo** (snapshot por save manual; no log-scale) | — | — |
| `app/src/persistencia/versiones.test.ts` | — | — | — | **nuevo** | — | — |
| `app/src/serializacion/json.ts` | aditivo opcional (no persistir seleccion) | aditivo (`ui.mapa.{zoom,pan,filtros}` se guarda en workspace, no en JSON OPM) | aditivo (no persistir pestanas en JSON OPM) | aditivo (`modelo.archivado?`, `modelo.versiones?`) | aditivo opcional (`ui.anchoPanelArbol`, `ui.nombresArbolVisibles` van a workspace, no JSON OPM) | aditivo (alias/unidad/descripcion/urls/designaciones/duracion/suprimido/layoutEstados/modoPlegado, todos opcionales) |
| `app/src/serializacion/json.test.ts` | aditivo (verificar que ui.* no se persiste en JSON OPM) | aditivo | aditivo | aditivo | aditivo | aditivo |
| `app/src/ui/App.tsx` | aditivo (handler global Ctrl+clic, Esc, Delete sobre canvas, registrar lazo Shift) | aditivo (modal `MapaPanelEstadisticas`, `MapaFiltros`, boton Export) | aditivo (`BarraPestanas` arriba del canvas) | aditivo (modal `DialogoBuscarGlobal`, `DialogoVersiones`, `DialogoArchivados`) | aditivo (registrar atajos centrales globales) | aditivo (modal `ModalUrlsObjeto`, `ModalDuracion`) |
| `app/src/ui/MenuPrincipal.tsx` | — | aditivo ("Exportar mapa como PNG/SVG", visible solo cuando `vistaMapaActiva`) | aditivo ("Nuevo modelo en pestana") | aditivo ("Buscar global", "Mostrar archivados", "Mostrar versiones") | aditivo ("Atajos de teclado..." abre cheatsheet, opcional dentro de slice) | aditivo (entradas alias/url/descripcion en menu contextual de cosa) |
| `app/src/ui/Toolbar.tsx` | aditivo discreto (boton "Acciones de seleccion" cuando `seleccionados.length>=2`) | aditivo (boton "Refrescar mapa") | lectura | aditivo discreto (icono "archivado" / "version") | aditivo (toggles ocultar nombres y modo orden) | aditivo (toggle alias visibles, descripciones visibles) |
| `app/src/ui/PanelOpl.tsx` | lectura | lectura | EDIT aditivo (chevrons expandir/colapsar bloque por OPD) | lectura | lectura | aditivo si emite alias/unidad (delegar a `opl/generar.ts`) |
| `app/src/ui/ArbolOpd.tsx` | lectura | lectura | lectura | lectura | EDIT aditivo (Ctrl+up/down/left/right, expandir/colapsar todo via L5, toggle ocultar nombres, menu contextual completo) | lectura |
| `app/src/ui/PanelCarpetas.tsx` | — | — | aditivo ("Abrir en pestana") | EDIT aditivo (drag-drop, cut/paste, breadcrumb activo, glifos archivado/version) | aditivo (atajos teclado dentro del panel: flechas, Enter, Backspace) | — |
| `app/src/ui/DialogoCargarModelo.tsx` | — | — | aditivo ("Abrir en nueva pestana") | aditivo (drag-drop entre tiles, opciones cortar/pegar) | aditivo (Esc cierra, Enter carga) | — |
| `app/src/ui/DialogoGuardarComo.tsx` | — | — | lectura | aditivo (snapshot-version checkbox opcional) | aditivo (atajos Esc/Enter) | — |
| `app/src/ui/DialogoBuscarCosas.tsx` | — | — | lectura | lectura | aditivo (Esc cierra) | — |
| `app/src/ui/DialogoBuscarGlobal.tsx` | — | — | — | **nuevo** | aditivo (atajo Ctrl+Shift+F si no choca con OPL) | — |
| `app/src/ui/DialogoVersiones.tsx` | — | — | — | **nuevo** | — | — |
| `app/src/ui/DialogoArchivados.tsx` | — | — | — | **nuevo** | — | — |
| `app/src/ui/MapaPanelEstadisticas.tsx` | — | **nuevo** | — | — | — | — |
| `app/src/ui/MapaFiltros.tsx` | — | **nuevo** | — | — | — | — |
| `app/src/ui/MapaSistema.tsx` | — | EDIT aditivo (zoom, pan persistente, tooltip, marcadores, fix scaleContentToFit, montar filtros + estadisticas) | — | — | — | — |
| `app/src/ui/BarraPestanas.tsx` | — | — | **nuevo** | — | — | — |
| `app/src/ui/InspectorEntidad.tsx` | aditivo discreto (boton "Aplicar a seleccion" en sliders de estilo) | lectura | lectura | lectura | lectura | EDIT aditivo (campos descripcion, alias, unidad, URLs, layoutEstados, designaciones, duracion) |
| `app/src/ui/InspectorEnlace.tsx` | aditivo discreto ("Aplicar a seleccion") | lectura | lectura | lectura | lectura | lectura |
| `app/src/ui/StyleControls.tsx` | EDIT aditivo (modo "aplicar a seleccion") | lectura | lectura | lectura | lectura | lectura |
| `app/src/ui/atajosTeclado.ts` | — | — | — | — | **nuevo** (registry central) | — |
| `app/src/ui/atajosTeclado.test.ts` | — | — | — | — | **nuevo** | — |
| `app/src/ui/divisorPanel.tsx` | — | — | — | — | **nuevo** (resize handle) | — |
| `app/src/ui/MenuContextualArbol.tsx` | — | — | — | — | **nuevo** | — |
| `app/src/ui/CheatsheetAtajos.tsx` | — | — | — | — | **nuevo** opcional dentro de slice | — |
| `app/src/ui/ModalUrlsObjeto.tsx` | — | — | — | — | — | **nuevo** |
| `app/src/ui/ModalDuracion.tsx` | — | — | — | — | — | **nuevo** |
| `app/src/modelo/objetoMetadata.ts` | — | — | — | — | — | **nuevo** (alias, unidad, descripcion, URLs) |
| `app/src/modelo/objetoMetadata.test.ts` | — | — | — | — | — | **nuevo** |
| `app/src/modelo/estadosDesignaciones.ts` | — | — | — | — | — | **nuevo** (designar/quitar Inicial/Final/Default/Current con reglas exclusion) |
| `app/src/modelo/estadosDesignaciones.test.ts` | — | — | — | — | — | **nuevo** |
| `app/src/modelo/objetoDuracion.ts` | — | — | — | — | — | **nuevo** |
| `app/src/modelo/objetoDuracion.test.ts` | — | — | — | — | — | **nuevo** |
| `app/e2e/opm-smoke.spec.ts` | aditivo (smoke seleccion+batch) | aditivo (smoke mapa con filtros y export) | aditivo (smoke pestanas) | aditivo (smoke movimiento + busqueda global) | aditivo (smoke atajos + divisor + menu contextual) | aditivo (smoke alias + descripcion + designaciones) |
| `assets/svg/**` | LECTURA canonica | LECTURA canonica | LECTURA canonica | LECTURA canonica | LECTURA canonica | LECTURA canonica |
| `opm-extracted/**` | LECTURA | LECTURA | LECTURA | LECTURA | LECTURA | LECTURA |

Reglas de colision:

- `store.ts` es el principal archivo compartido (2554 LOC). Cada linea agrega su slice agrupado por dominio en bloque consecutivo y NO reordena bloques existentes. Si la linea propia supera ~80 LOC adicionales se extrae a `app/src/store/<dominio>.ts` (L3 lo hace por defecto con `pestanas.ts`). Los slices nuevos viven al final del archivo en orden de merge.
- `tipos.ts` (158 LOC) lo tocan L1, L3, L4, L5 y L6 con campos opcionales, agrupados por dominio. Ninguna linea modifica firmas existentes ni reordena.
- `serializacion/json.ts` lo tocan L4 y L6 con campos OPM (`modelo.*`, `entidad.*`, `estado.*`, `apariencia.*`). L1, L2, L3 y L5 NO escriben en JSON OPM — sus campos son sesion/workspace o pertenecen al indice de workspace (`carpeta.archivada`). Roundtrip lossless garantizado por tests aditivos.
- `MenuPrincipal.tsx` (125 LOC) lo tocan L2, L3, L4, L5 y L6 (cada una agrega entradas). El orden actual de entradas se preserva; nuevas entradas van al final del bloque relevante. Cualquier reorden es decision documentada en commit.
- `proyeccion.ts` (1116 LOC) lo tocan L1 (halo de multi-seleccion), L2 (resaltado por tipo en mapa) y L6 (badges + designaciones de estado). Cada una extrae a helper nuevo cuando supera 30 LOC efectivas: `canvas/seleccionMultiple.ts` (L1), `render/jointjs/mapaSistema.ts` extendido (L2), `modelo/objetoMetadata.ts` + `modelo/estadosDesignaciones.ts` (L6). `proyeccion.ts` solo queda como punto de composicion.
- `JointCanvas.tsx` lo tocan L1 (eventos seleccion: rubber-band, Ctrl+clic, Delete, Esc), L2 (zoom Ctrl+rueda en mapa, refresco) y L5 (Ctrl+0 fit-to-screen, Ctrl+rueda en canvas normal). Coordinacion via prop `vistaMapaActiva` ya disponible en store; el handler global de teclado vive en `App.tsx` y delega segun contexto.
- `MapaSistema.tsx` (148 LOC) y `mapaSistema.ts` (258 LOC) son territorio de L2; ninguna otra linea los toca.
- `ArbolOpd.tsx` (539 LOC) es territorio de L5 para Ctrl+arrows, divisor, menu contextual y toggle nombres; las demas lineas solo leen.
- `PanelCarpetas.tsx` (609 LOC) lo tocan L3 (item "Abrir en pestana") y L4 (drag-drop + cut/paste + glifos). El orden de merge reduce la colision: L3 inserta un item al final del menu contextual existente; L4 reescribe handlers de tile y agrega nuevos pero respeta la firma del item de L3 si ya esta en `main`.
- `InspectorEntidad.tsx` (522 LOC) es territorio de L6 para descripcion/alias/unidad/URLs/designaciones/duracion/layoutEstados; L1 solo agrega un boton "Aplicar a seleccion" en los sliders existentes (al pie de cada control). L1 deja un slot estable `inspector-entidad-acciones` con `data-testid`.
- `StyleControls.tsx` (309 LOC) es territorio de L1 para el modo "aplicar a seleccion"; L6 no lo toca.
- `PanelOpl.tsx` (435 LOC) es territorio de L3 para chevrons de bloques jerarquicos; L1 (filtro por seleccion ya cubierto en ronda 6) y L6 (alias/unidad delegados al generador, no al panel) no lo modifican.
- `App.tsx` (108 LOC) lo tocan todas las lineas para montar modales/handlers globales. Cada linea agrega su modal/listener al final del JSX y registra/desregistra en mount/unmount. L1 agrega listener canvas-global de teclas (Delete, Esc, flechas) y mouse (Ctrl+clic, Shift+drag); L5 lo absorbe luego en `atajosTeclado.ts` central manteniendo el comportamiento de L1 invariante.
- `assets/svg/` se considera lectura canonica universal; ningun brief redibuja iconos.

## 6. Protocolo de conciliacion

Orden de merge sugerido: **L2 -> L5 -> L4 -> L1 -> L6 -> L3**.

1. **L2 primero**: cierra el bug de mapa render (HANDOFF #1) y completa EPICA-21 a >70%. Bajo riesgo, no toca canvas normal ni store transversal — solo extiende el slice de mapa ya consolidado en ronda 6. Aterrizar primero garantiza estado base verde antes de las lineas de mayor blast.
2. **L5 segundo**: introduce el registry central de atajos `atajosTeclado.ts` y el divisor del panel arbol. Tocar `App.tsx` aqui evita que L1 y L3 monten handlers en bruto que luego haya que migrar al registry. L5 deja una API estable `registrarAtajo(combo, handler, ctx)` que L1 y L3 consumen al merge siguiente.
3. **L4 tercero**: cierra workspace (mover, drag-drop, cut/paste, busqueda global, versiones, archivado). No depende de canvas; toca persistencia y dialogos de archivo. Aterrizar antes de L1 y L6 garantiza que los dialogos esten estables cuando esas lineas escriban tests smoke.
4. **L1 cuarto**: multi-seleccion + batch. Alto blast en `JointCanvas.tsx`, `App.tsx`, `proyeccion.ts`, `store.ts`, `StyleControls.tsx`, `InspectorEntidad.tsx`. Aterriza despues de L5 para consumir el registry de atajos (Delete, Esc, Ctrl+A, Ctrl+C/V) y antes de L6 para que L6 pueda escribir batch-styling de descripciones/alias/URLs sobre seleccion.
5. **L6 quinto**: objetos avanzados + cierre estados/plegado. Toca `tipos.ts`, `operaciones.ts` (lectura), `InspectorEntidad.tsx`, `proyeccion.ts`, `serializacion/json.ts`, `opl/generar.ts`. Aprovecha L1 (batch styling de alias/URLs) y L5 (atajos para abrir modal URL/Duracion).
6. **L3 ultimo**: multi-pestana reescribe el flujo del store con un slice `pestanas.ts` que mantiene el modelo activo como espejo de `pestanaActiva.modelo`. Mayor blast estructural; aprovechar consolidacion final para resolver cascadas (PanelCarpetas item "Abrir en pestana", DialogoCargarModelo "Abrir en nueva pestana", App.tsx BarraPestanas, persistencia de sesion-only). Bloques OPL jerarquicos (HU-50.027) viajan junto con la linea.

Despues de cada merge: `cd app && bun run check`; si toco UI/render: `bun run browser:smoke`; al cierre de ronda: `bun run build` y auditoria HU con `--sync-real`. **Reservar el ultimo commit del ciclo para una capa explicita de cascadas resueltas** (la ronda 6 demostro que esa capa es ineludible: L1 ledger, refactor abanicoOverlay, fix arbol expandido, fix mapa namespace, alineacion smoke).

## 7. Anclaje obligatorio a HU y SSOT

Antes de codificar cada linea, leer:

- HU listadas en el brief bajo `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/`.
- SSOT en `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`:
  - `opm-iso-19450-es.md`: glosario OPD/OPL/multiplicidad/alias/unidad, §OPD tree, §multiplicidad, §rutas, §nombres canonicos, §estados (Glos 3.68/3.71a), §atributo (Glos 3.4), §alias (Glos 3.7).
  - `opm-visual-es.md`: V-1, V-4 inicial, V-5 final, V-6 default, V-61, V-95, V-129, V-163 slot de valor, V-237 estados, V-238 axioma >=2, V-239, V-240.
  - `opm-opl-es.md`: §1, §3-§10, §12 multiplicidad, §13 rutas, D5 inicial, D6 final, D7 default, D8 estados, T1-T3, TS1, TS3, §17/Ap. A roundtrip.
  - `metodologia-opm-es.md`: §6 nuevo SD, §7/§7b refinamiento, §15 invariantes.
- Evidencia OPCloud en `opm-extracted/`:
  - `INDEX.md`, `MODULES.md`, `README.md`, `REFACTOR-NOTES.md`, `assets/INDEX.md`.
  - Modulos puntuales citados en cada brief (`selectionConfiguration`, `BringConnectedAction`, `bringConnectedRules`, `multi-delete-progress`, `keyboardShortcuts`, `resize-bar`, `opdsTreeActions`, `coll-menu`, `tabsService`, `opd-hierarchy`, `aliasing-module`, `units-text-module`, `edit-alias`, `edit-units`, `set-process-time-duration`, `set-state-time-duration`, `OpmObject` URLarray + descriptionStatus, `load-model-dialog-interfaces`, `chooseExportedFileName`, `export-model-as-html`).

Si SSOT y OPCloud difieren, manda SSOT. OPCloud operacionaliza; no redefine semantica.

## 8. Brief por linea

| Linea | Brief |
|---|---|
| L1 | [linea-1-multi-seleccion-batch.md](./linea-1-multi-seleccion-batch.md) |
| L2 | [linea-2-mapa-cierre.md](./linea-2-mapa-cierre.md) |
| L3 | [linea-3-multi-pestana-opl-bloques.md](./linea-3-multi-pestana-opl-bloques.md) |
| L4 | [linea-4-workspace-cierre.md](./linea-4-workspace-cierre.md) |
| L5 | [linea-5-atajos-arbol.md](./linea-5-atajos-arbol.md) |
| L6 | [linea-6-objetos-avanzados.md](./linea-6-objetos-avanzados.md) |

Prompt para asignar lineas: [prompt-asignacion.md](./prompt-asignacion.md).

## 9. Verificacion al cierre de la ronda

```bash
cd app
bun run check
bun run browser:smoke
bun run build
cd ..
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

Metricas esperadas post-ronda 7 (sobre base post-ronda 6: 412 unit tests / 2006 expect, 37 smoke, bundle 915 KB):

- Unit tests: objetivo conservador **>= 500 tests verdes**.
- Smoke browser: objetivo conservador **>= 45 smoke verdes**.
- HU cerradas o elevadas (segun brief): HU-SHARED-008 cubierta; HU-11.001/.007/.008/.023; HU-14.016; HU-90.001-009/.010-013/.014/.015/.016/.017/.020/.021; HU-20.009-013; HU-21.005/.009/.011-018; HU-30.011/.023/.025/.027/.029; HU-31.011-013; HU-34.002/.003; HU-35.001-005; HU-50.027; HU-13.007/.010-013/.019; HU-17.002-012/.018-023/.027-030/.033/.034; HU-18.011/.013-015. Avance ponderado MVP-alpha esperado >= 55% (vs 43.3% pre-ronda); MVP-beta >= 38% (vs 33.5%); M0 >= 73% (vs 69.1%).
- Detector ledger: tras `--sync-real`, mantener **>= 47/49 reglas** matcheadas (no caer). Las HU nuevas usan reglas existentes (alias/unidad ya tienen reglas; designaciones idem); no se introducen reglas nuevas en esta ronda salvo que las lineas detecten ausencia y la documenten en `linea-N.md §10`.
- `app/src/modelo/operaciones.ts`, `app/src/store.ts` y `app/src/render/jointjs/proyeccion.ts` no deben crecer mas de wrappers minimos; cualquier crecimiento neto relevante se justifica en el reporte de la linea (declarando el modulo de dominio nuevo creado y por que el wrapper era inevitable).
- `docs/HANDOFF.md` permanece intacto durante las lineas; se actualiza solo en consolidacion final.
