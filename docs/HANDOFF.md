# HANDOFF - estado integrado y próximos pasos

**Fecha**: 2026-05-05
**Repositorio**: `deep-opm-pro`
**Corte**: MVP-alpha + rondas 1, 2, 3, 4, 5, 6 y 7 consolidadas sobre `main`
**Código verificado**: `main` @ `ee10c9c` (`chore(ledger): regenera evidencia hu-progress post-ronda 7`)
**Documentación vigente**: este archivo reemplaza por completo el handoff anterior.

## Política De Handoff Único

`docs/HANDOFF.md` es la única memoria de traspaso vigente del proyecto. No se
mantienen handoffs paralelos, fechados ni duplicados. Cada nuevo handoff debe
reemplazar y consolidar el contenido anterior en este mismo archivo.

## Estado Integrado

El modelador OPM vive en `app/` con Bun + Vite + Preact + Zustand + JointJS OSS.
La arquitectura es propia: no Angular, no Firebase, no Rappid. La semántica se
ancla en la SSOT OPM/ISO 19450 en
`/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/` y la evidencia
operacional reusable se consulta en `opm-extracted/` sin copiar bloques 1:1.

La ronda 7 cerró seis líneas paralelas más una capa de cascadas resueltas en
consolidación final, todas integradas sobre `main`:

| Línea | Commit | Resultado integrado |
|---|---|---|
| L2 | `f32aba2` | Mapa del sistema cierre + fix `scaleContentToFit`. `mapaSistema.ts` extendido con `calcularEstadisticas`, `filtrarPorProfundidad`, `filtrarPorSubarbol`, `resaltarPorTipo` (predominancia proceso/objeto/estados/raíz), `aplicarMarcadores` (activo/visitado), proyección completa con `cellNamespace` + `queueMicrotask` para que `scaleContentToFit` vea todas las cells. `mapaExport.ts` nuevo con export PNG/SVG cliente-side via `paper.toSVG()` + `canvas.toBlob` (PDF diferido por EPICA-60). `MapaSistema.tsx` con paneles de filtros y estadísticas, tooltip por hover, Ctrl+rueda zoom, pan persistente, marcadores rojo/verde, botón Refrescar. `MapaFiltros.tsx` y `MapaPanelEstadisticas.tsx` nuevos. Persistencia `ui.mapa.{zoom,pan,filtros}` por modelo en `WorkspaceIndice`. |
| L5 | `d3a798d` | Atajos centrales + cierre árbol OPD. `ui/atajosTeclado.ts` registry central con contexto (global/canvas/panel-arbol/panel-opl/modal-input/vista-mapa), `escucharGlobal` con un solo `keydown` listener en `window` con captura, `formatearCombo` cross-platform. `divisorPanel.tsx` con clamp [160, 600] y doble clic reset a 240. `MenuContextualArbol.tsx` con Renombrar/Eliminar/Cortar/Pegar/Reordenar/Mostrar-Ocultar nombres/Expandir-Colapsar todo. `CheatsheetAtajos.tsx`. `ArbolOpd.tsx` con Ctrl+arrows, toggle ocultar nombres a códigos `SDn`. |
| L4 | `6528aa9` | Workspace cierre. `persistencia/movimientoModelos.ts` (mover modelos y carpetas con validación de ciclo), `versiones.ts` (snapshots manuales sin log-scale, `restaurarVersion` como copia con sufijo "(restaurado AAAA-MM-DD)"), `workspace.ts` con `archivarModelo`/`archivarCarpeta` con cascada, `buscarGlobal` con guard ≥3 caracteres. `DialogoBuscarGlobal.tsx`, `DialogoVersiones.tsx`, `DialogoArchivados.tsx` nuevos. `PanelCarpetas.tsx` con drag-drop, cut/paste con caducidad 5min, glifos archivado y versión, menú contextual completo. |
| L1 | `2bcd533` | Multi-selección y operaciones batch. `canvas/seleccionMultiple.ts` con modos `simple/multi/rectangulo`. `canvas/operacionesBatch.ts` con `eliminarBatch`, `nudgeApariencias/Enlaces`, `alinearEnlaces` (4 direcciones), `conectarMultiAlTodo` idempotente, `aplicarEstiloA{Apariencias,Enlaces}`, `copiarSeleccion`+`pegarSeleccion` via buffer en memoria. `JointCanvas.tsx` con handlers Ctrl/Cmd+clic, Shift+drag rubber band SVG. `StyleControls.tsx` y `InspectorEnlace.tsx` con boton "Aplicar a selección". Halo `#3DA8FF` 2px aplicado solo en multi-selección para no romper conteos históricos. |
| L6 | `1b3941a` | Objetos avanzados + cierre estados/plegado. `modelo/objetoMetadata.ts` (alias, unidad, descripción, URLs, parser/formatter `Nombre [Unidad] {alias}`). `modelo/estadosDesignaciones.ts` (Inicial/Final/Default/Current con exclusiones SSOT: Default↔Current excluyentes; Inicial+Final coexisten HU-17.033). `modelo/objetoDuracion.ts` con validación min≤nominal≤max. `ModalUrlsObjeto.tsx`, `ModalDuracionEstado.tsx`. `InspectorEntidad.tsx` con secciones Descripción, Alias, Unidad, URLs, Layout estados, Designaciones (cuando entidad es estado), Duración, Suprimir. `opl/generar.ts` emite alias `, también iP`, unidad `[°C]`, designaciones D5/D6/D7, duración canónica JOYAS §9, plegado parcial "lista A y B como rasgos". `proyeccion.ts` con render compuesto, badges 📄 y 🔗, marcadores V-4/V-5/V-6 sobre cápsulas; estado suprimido omitido del render. |
| L3 | `f6433ba` | Multi-pestaña sesión-only + bloques OPL jerárquicos. `store/pestanas.ts` con `crearPestanaNueva`, `abrirPestana`, `cerrarPestana` (rechaza si N=1 o dirty sin forzar), `cambiarActiva`, `reordenarPestanas`. Cada pestaña tiene modelo independiente; `state.modelo` es espejo del activo. `opl/bloquesJerarquicos.ts` con `agruparPorOpd` y `aplanar` (omite oraciones colapsadas). `BarraPestanas.tsx` con tab list, botón "+", botón X (oculto si N=1), drag-reorder HTML5, asterisco dirty. `PanelOpl.tsx` con chevrons por bloque OPD y Expandir/Colapsar todo. Stack undo per-pestaña queda como deuda explícita; cada pestaña sí posee modelo independiente. |

Cascadas resueltas en consolidación (commits aditivos sobre las 6 líneas):

| Commit | Cascada |
|---|---|
| `b7ea297` | `docs(ronda7)`: 8 briefs maestros + plantilla `prompt-asignacion.md` bajo `docs/instrucciones-lineas-dev/ronda7/`. Insumo de auditoría del ciclo. |
| `ebbabbe` | `docs(hu)`: EPICA-70 (Importación OPCAT 4.2) y EPICA-91 (Modo tutorial) marcadas como descartadas del proyecto en frontmatter, con bloque de aviso al inicio de cada archivo. `04-MAPA.md` y `05-ROADMAP.md` actualizados; sección 7 nueva "Épicas descartadas del proyecto" en roadmap. Decisión irreversible salvo nueva instrucción explícita. |
| `9acbf50` | `chore(docs)`: elimina `docs/archive/historias-usuario-v1/` (41 archivos). La SSOT operativa pasa a ser `docs/historias-usuario-v2/` exclusivamente. |
| `8063b1e` | `feat(ronda7)`: integra slices y campos compartidos de las 6 líneas en archivos super-compartidos: `tipos.ts` (campos opcionales por dominio), `store.ts/test` (slices al final agrupados), `App.tsx` (montaje de paneles, modales y registry de atajos), `MenuPrincipal.tsx`, `Toolbar.tsx`, `serializacion/json.ts/test` (roundtrip lossless), `persistencia/local.ts/test`, `e2e/opm-smoke.spec.ts` (smokes nuevos por dominio), `completitud.test.ts` (cubre `default` y `current` en `DesignacionEstado`). |
| `7889191` | `fix(render)`: continuación de los commits `47c286b` y `55f48ec` post-ronda 6 sobre el abanico OR/XOR. `abanicoOverlay.ts` con nueva firma `calcularGeometriaAbanicoDesdePuntos` basada en puntos sample a `RADIO_PROBE=30` (igual al radio interno). `abanicoDragSync.ts` recompute mid-drag limitado al subset afectado sin pasar por el store. `in-vivo-test.mjs` con caso "proceso desplazado a la derecha de objetos casi colineales". |
| `60495e9` | `fix(ui)`: cascadas resueltas en `Dialogo.tsx` (listener Escape/Tab en captura con `stopImmediatePropagation`) y `atajosTeclado.ts` (registry global ignora eventos cuyo target esté dentro de `[role="dialog"][aria-modal="true"]`). Doble seguridad: cualquier modal abierto consume sus propios atajos sin ser robado. `opm-smoke.spec.ts` actualizado para liberar el modo barra creación sticky de L1 (HU-11.001) antes de invocar "Descomponer" en el smoke del árbol OPD. Cascada incluida en commits L2 y L6 directamente: `mapaExport.ts` con `parentNode.removeChild` por compatibilidad happy-dom; `proyeccion.test.ts` altura cápsulas estado 94→100 e `y` 64→70 por padding de marcadores de designaciones. |
| `ee10c9c` | `chore(ledger)`: regeneración de `docs/roadmap/hu-progress.{json,md,html}` y `hu-progress-evidence.json` post-consolidación. Detector cae a 45/49 reglas (vs 47/49 pre-ronda 7); deuda explícita de calibración documentada abajo. |

## Cómo Se Decidió La Partición

La partición original (README ronda 7) preveía orden `L2 → L5 → L4 → L1 → L6 →
L3` para que (a) el cierre del Mapa con bajo riesgo aterrizara primero, (b) el
registry central de atajos de L5 estuviera disponible para L1 y L3, (c) el
workspace cerrara antes que L1 escribiera smokes sobre diálogos, (d) la
multi-selección de L1 pudiera ser consumida por el batch styling de L6, y (e)
las pestañas de L3 reescribieran el flujo del store al final aprovechando la
consolidación para resolver cascadas.

La integración real respetó ese orden pero los implementadores trabajaron sobre
`main` sin worktrees, lo cual obligó a la consolidación a hacer un **mapeo
post-hoc** del working tree (16 archivos compartidos modificados por varias
líneas) antes de poder commitear por dominio. Se hicieron 11 commits semánticos
agrupando archivos exclusivos de cada línea + commit "infra" para los
super-compartidos (`tipos.ts`, `store.ts`, `App.tsx`, `MenuPrincipal.tsx`,
`Toolbar.tsx`, `json.ts/test`, `local.ts/test`, `opm-smoke.spec.ts`,
`completitud.test.ts`).

EPICA-70 y EPICA-91 fueron declaradas fuera del alcance del proyecto durante
la planificación de la ronda; su descarte se documentó en frontmatter, índices
y roadmap.

## Decisiones Vigentes

Decisiones nuevas de ronda 7:

- **Multi-selección canónica**: `ui.seleccionados: Id[]` transitorio (no
  serializa). Halo `#3DA8FF` 2px aplicado solo cuando `seleccionados.length>=2`
  para no romper smokes históricos de selección simple. Vista mapa suspende
  multi-selección. Selección se vacía al cambiar de OPD o de pestaña.
- **Operaciones batch**: atómicas con un solo entry en undo (HU-SHARED-002).
  `conectarMultiAlTodo` idempotente. `copiarSeleccion`/`pegarSeleccion` via
  buffer en memoria; reusa entidades por id, crea apariencias nuevas con
  offset incremental.
- **Modo barra creación sticky** (HU-11.001): la barra de creación no se
  cierra al crear; el modo se mantiene activo hasta Esc o cambio de
  herramienta. Cada creación entra como entry separado en undo (no batch).
  Smokes deben liberar el modo con Esc antes de invocar acciones del
  Inspector sobre la apariencia recién creada.
- **Mapa del sistema = vista derivada extendida** (extiende ronda 6): zoom
  `paper.scale` directo, persistencia `ui.mapa.{zoom,panX,panY,profundidad,
  subarbolRaiz,criterioResaltado,autoRefresh}` por modelo en
  `WorkspaceIndice.modelos[i].mapa`. Auto-refresh subscribe a `modelo.opds`
  con debounce 300ms; togglable. Filtros y resaltado son lente sobre el
  descriptor; export PNG/SVG cliente-side WYSIWYG con marcadores incluidos.
  PDF diferido por EPICA-60.
- **Multi-pestaña sesión-only**: pestañas no se persisten (ni en JSON OPM ni
  en workspace). Refresh de página arranca con pestaña inicial vacía.
  `state.modelo` es espejo del modelo de la pestaña activa. `commitModelo`
  empuja al stack global compartido entre pestañas — undo per-pestaña queda
  como deuda explícita de bajo blast radius. `Ctrl+T/W/Tab` registrados en el
  registry de atajos.
- **Bloques OPL jerárquicos**: `OracionOpl` propaga `opdId/opdNombre/
  profundidad`. Panel agrupa por OPD con chevrons (▾/▸); estado de colapso
  es local del panel (no se persiste). Botón "Expandir/Colapsar todo" en
  toolbar del panel.
- **Workspace single-user MVP**: sin permisos O/W/R, sin matriz, sin
  propagación de lectura. `WorkspaceIndice.recientes: Id[]` obligatorio
  (max 10). Versiones son **opt-in por save manual**, sin log-scale, sin
  retention automática, sin auto-archivado por 90 días. Movimiento de modelo
  preserva `versiones` (HU-35.005). Cut/paste caduca a los 5 minutos.
  Búsqueda global ≥3 caracteres, filtra `nombre` y `descripcion`.
  Drag-drop usa API HTML5 nativa (sin libreria nueva).
- **Designaciones de estado**: Default y Current **mutuamente excluyentes**
  (HU-13.013 Q13.2 → bloqueante). Inicial y Final **coexisten** (HU-17.033).
  Default y Current son **únicos por entidad** (uno solo por estado padre).
  `suprimirEstado` requiere ausencia de enlaces incidentes; OPL D8 sigue
  listando el estado (la supresión es de render). Marcadores SSOT V-4/V-5/V-6
  sobre cápsulas; Current renderiza como anillo verde (propuesta
  documentada, no en SSOT canónico).
- **Alias, unidad, descripción, URLs**: campos opcionales en `entidad.*`.
  Alias va siempre en OPL tras primera mención (HU-17.009); `uiAliasVisibles`
  controla solo el render canvas, no el OPL. Unidad textual libre (max 20
  chars). URLs tipadas {imagen, video, articulo, texto, oslc} con validación
  laxa (no vacía + tiene `:` y `/`). Descripción multi-línea hasta 5000 chars.
  Badges 📄 y 🔗 en esquinas controladas por `uiDescripcionesVisibles`.
- **Duración canónica del estado**: `{unidad, min, nominal, max}` con
  validación `min ≤ nominal ≤ max` y unidad en `{ms, s, min, h, dia, sem,
  mes, año}`. OPL emite formato JOYAS §9 textual.
- **Plegado parcial persistido**: `apariencia.modoPlegado` opcional
  (`plegado/parcial/desplegado`). Persiste por apariencia (HU-18.011). OPL
  trunca a 3 partes inline + "y N partes más" para plegado parcial extenso
  (HU-18.010 parcial).
- **Atajos centralizados**: registry único en `ui/atajosTeclado.ts` con
  `escucharGlobal()` capturando `keydown` en `window`. Resolución de
  contexto via `data-atajos-contexto` (panel-arbol, panel-opl, canvas) y
  `vistaMapaActiva`. Cualquier modal abierto (`[role="dialog"][aria-modal=
  "true"]`) consume sus propios atajos; el registry se hace a un lado.
  `modal-input` solo procesa Escape y Enter. Atajos cross-platform via
  `e.ctrlKey || e.metaKey`.
- **Divisor árbol/canvas**: ancho persistido en `WorkspaceIndice.
  preferenciasUi.anchoPanelArbol`, clamp [160, 600] px, doble clic reset.
- **Toggle ocultar nombres del árbol**: nodos muestran solo `SDn`/`SDn.m`
  cuando `ui.nombresArbolVisibles === false`, persistido en `preferenciasUi`.
- **Diálogos custom con captura**: `Dialogo.tsx` registra Escape/Tab en
  captura con `stopImmediatePropagation`. Tab focus trap nativo. Cualquier
  diálogo abierto tiene prioridad sobre los atajos globales.

Decisiones de rondas 1-6 que siguen vigentes (no se reabren):

- **OPL-ES como lente derivada**: el panel OPL no es fuente de verdad; los
  IDs emitidos por `generarOplInteractivo` permiten edición inversa sin
  parser libre, alineado con `opm-iso-19450-es.md` y `opm-opl-es.md`.
- **Hover OPL↔canvas es estado UI**: no se serializa, no se persiste.
- **Eliminación de OPDs**: la raíz es `disabled`, los internos ejecutan
  acción con mensaje accionable, las hojas eliminan refinamiento,
  apariencias y enlaces huérfanos. Apariencias compartidas se preservan.
- **Bus de agregación**: vista derivada en render, no cambio del JSON.
- **Importación JSON no auto-persiste**: queda en estado "(No guardado)"
  hasta que el usuario invoque `Guardar como` o sobreescriba.
- **Creación interna por posición**: cuando el usuario hace click dentro
  del bbox de un contenedor refinado, la cosa creada nace como hija.
- **Apariencia.estilo invariante a OPL**: el estilo (incluido texto del
  rótulo) no altera OPL.
- **`Modelo.estados` y `Modelo.abanicos` siguen top-level** (legado de
  ronda 4).
- **Extremos `ExtremoEnlace = { kind, id }`** para entidad o estado.
- **Multiplicidad canónica + custom validada** (ronda 6): `["1", "0..1",
  "N", "0..N", "*"]` + custom regex.
- **Estilo de enlace** (ronda 6): `enlace.estilo` con color, strokeWidth,
  dashArray; wrapper transparente 15px preservado.
- **Vértices manuales y reanclaje** (ronda 6): `aparienciaEnlace.vertices`
  opcional; `reanclarExtremoEnlace` aplica filtros de firma.
- **Tabla de enlaces global** (ronda 6): vista derivada con filtros y
  ordenamiento.
- **Modelo post-asistente queda dirty** (ronda 6).
- **Workspace con jerarquía de carpetas** (ronda 6): extendida en ronda 7
  con archivado, versiones y movimiento.
- **Árbol OPD expandido por default** (ronda 6): set almacena ids
  *colapsados*.
- **Mapa del sistema = vista neutra** (ronda 6): flechas grises dasharray
  "6 3", marker triangular pequeño; distinto de OPM.
- **Abanicos OR/XOR canónicos** (ronda 6): XOR = arco r=30; O = arcos
  concéntricos r=30/r=35 dasharray "4 1". Refactor de ronda 7
  (`calcularGeometriaAbanicoDesdePuntos`) preserva la geometría canónica.
- **Política de handoff único**: este archivo reemplaza completamente al
  anterior; sin handoffs paralelos.

## Cascadas Gestionadas

- **`tipos.ts`**: 5 líneas agregaron campos opcionales agrupados por
  dominio. Roundtrip lossless verificado en `serializacion/json.test.ts`.
- **`store.ts`** (~3700 LOC tras ronda 7): cada slice se agrupó en bloque
  consecutivo al final del archivo, sin reordenar bloques previos. L3
  extrajo a `store/pestanas.ts` para no inflar más.
- **`App.tsx`**: monta `BarraPestanas`, `MapaSistema` con paneles,
  `MapaFiltros`, `MapaPanelEstadisticas`, `DialogoBuscarGlobal`,
  `DialogoVersiones`, `DialogoArchivados`, `ModalUrlsObjeto`,
  `ModalDuracionEstado`, `CheatsheetAtajos`, `MenuContextualArbol`,
  `divisorPanel` entre árbol y canvas. Registra todos los atajos via
  `escucharGlobal` del registry.
- **`MenuPrincipal.tsx`**: 5 líneas agregaron entradas en orden de merge,
  preservando entradas previas.
- **`Toolbar.tsx`**: toggles "Mostrar alias", "Mostrar descripciones",
  "Mostrar archivados", "Mostrar versiones", indicador modo orden árbol,
  refrescar mapa, autosalvado.
- **`proyeccion.ts`**: L1 (halo de selección múltiple), L2 (resaltado por
  tipo en mapa) y L6 (badges + render compuesto + marcadores de
  designación). Cada línea extrajo helpers nuevos cuando creció el blast.
- **`JointCanvas.tsx`**: L1 (rubber band Shift+drag, Ctrl/Cmd+clic), L2
  (zoom Ctrl+rueda en branch `vistaMapaActiva`), L5 (Ctrl+0 fit, Ctrl+rueda
  canvas normal). Coordinación via flag del store.
- **`InspectorEntidad.tsx`**: L6 territorio (522→780+ LOC tras secciones
  Descripción/Alias/Unidad/URLs/Layout/Designaciones/Duración/Suprimir);
  L1 dejó el slot estable `data-testid="inspector-entidad-acciones"` que
  L6 pobló.
- **`PanelOpl.tsx`**: L3 chevrons por bloque OPD; L1 mantiene el filtro
  por selección de ronda 6.
- **`PanelCarpetas.tsx`**: L4 reescribió handlers de tile (drag-drop,
  cut/paste, glifos, menú contextual completo). L3 podría agregar "Abrir
  en pestaña" como cascada futura.
- **`Dialogo.tsx` y `atajosTeclado.ts`**: doble seguridad para que
  diálogos modales consuman Escape antes que el registry global. Listener
  del Dialogo en captura con `stopImmediatePropagation`; registry hace
  early return si `event.target` está dentro de
  `[role="dialog"][aria-modal="true"]`.
- **JSON estricto**: `entidad.alias?/unidad?/descripcion?/urls?/
  layoutEstados?`, `estado.designaciones?/duracion?/suprimido?`,
  `apariencia.modoPlegado?/ordenPartes?`, `modelo.archivado?/archivadoEn?/
  versiones?`, `carpeta.archivada?/archivadaEn?` se hidratan con defaults
  seguros y validan tipo. `modelo.carpetaId` y `WorkspaceIndice.modelos[i].
  mapa` siguen en el índice de workspace, NO en el JSON OPM (decisión
  ronda 6 conservada).
- **OPL**: nuevas oraciones para alias (`, también iP`), unidad
  (`[°C]`), designaciones D5/D6/D7 (HU-13.010-012), Current como
  propuesta, duración canónica JOYAS §9, plegado parcial "lista A y B
  como rasgos" + truncado a 3 partes con "y N partes más".
- **Cascada test↔smoke**: 481 unit tests verdes (vs 412 base ronda 6),
  40/40 smoke verde (vs 37 base). `proyeccion.test.ts` actualizado a
  altura 100 / `y` 70 por padding de marcadores de designaciones (cambio
  de render legítimo de L6). `mapaExport.test.ts` usa
  `parentNode.removeChild` por compatibilidad con happy-dom.
- **Refactor abanico** (continuación post-ronda 6): `abanicoOverlay.ts`
  con `calcularGeometriaAbanicoDesdePuntos` basada en puntos sample a
  `RADIO_PROBE=30`; `abanicoDragSync.ts` recompute mid-drag focalizado.
  Sin impacto semántico ni en JSON OPM.

## Verificación

Último loop verde de consolidación sobre `ee10c9c`:

```bash
cd app
bun run check          # typecheck OK; 481 unit tests pass / 2206 expects
bun run browser:smoke  # 40/40 Playwright smoke pass (44.3 s)
bun run build          # OK; bundle 1045 KB minificado, 295 KB gzip
```

Estado HU tras `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real`:

| Segmento | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance |
|---|---:|---:|---:|---:|---:|---:|
| Total backlog | 1126 | 109 | 50 | 589 | 378 | 12.2% |
| M0 | 130 | 72 | 29 | 29 | 0 | 65.5% |
| MVP-alpha | 121 | 46 | 22 | 53 | 0 | 42.9% |
| MVP-beta | 193 | 46 | 23 | 124 | 0 | 31.3% |

Detector: 45/49 reglas matcheadas sobre 159 archivos fuente (vs 47/49 sobre
125 archivos pre-ronda 7). **Caída del detector documentada como deuda
inmediata abajo**: el código de L6 introdujo evidencia en
`modelo/objetoMetadata.ts`, `estadosDesignaciones.ts`, `objetoDuracion.ts`
que las reglas regex no reconocen, y código de L5 (`atajosTeclado.ts`)
tampoco está cableado. Las cifras del detector son **inferiores a la
cobertura real del código**.

Diagnóstico vigente: 1 advertencia de inventario por ID duplicado
`HU-13.005` entre `epica-13-canvas-estados.md` y
`HU-SHARED-001-menu-contextual.md` (legado de rondas previas, no es fallo
de app).

## Estado Por Dominio

- **Modelo/kernel**: creación básica, firmas de enlace, estados con
  designaciones canónicas (Inicial/Final/Default/Current con exclusiones),
  abanicos, multiplicidad canónica + custom, modificadores, invocación,
  rutas, auto-invocación, descomposición, despliegue, plegado parcial
  persistido, eliminación segura de OPDs hoja, creación interna por
  posición, alias/unidad/descripción/URLs en entidad, duración temporal
  en estados, supresión de estados sin enlaces, layout horizontal/vertical
  de estados, estilo visual editable de cosas y enlaces (incluyendo texto
  del rótulo), vértices manuales y reanclaje. Helpers de dominio
  modulares en `modelo/objetoMetadata.ts`, `estadosDesignaciones.ts`,
  `objetoDuracion.ts`, `enlaceMultiplicidad.ts`, `enlaceEstilo.ts`,
  `enlaceVertices.ts`, `opdReorden.ts`, `opdEliminacion.ts`,
  `creacionWizard.ts` (asistente 12 etapas).
- **Render**: assets canónicos de enlaces. Bus de agregación derivado en
  render. Abanicos OR/XOR como arcos canónicos r=30/r=35. Override de
  `enlace.estilo` se compone después de la firma sin romper dasharray
  ambiental. Mapa del sistema completo: meta-grafo neutro, filtros,
  resaltado por tipo, marcadores activo/visitado, tooltip, zoom Ctrl+rueda,
  pan persistente, export PNG/SVG cliente-side. Render compuesto
  `Nombre [Unidad] {alias}`, badges 📄/🔗, marcadores V-4/V-5/V-6 sobre
  cápsulas. Halo de selección múltiple `#3DA8FF`.
- **UI/store**: Inspector con secciones nuevas (Descripción/Alias/Unidad/
  URLs/Layout/Designaciones/Duración/Suprimir) en `InspectorEntidad`.
  Diálogos: archivar, versiones, búsqueda global, gestión árbol (Ctrl+D),
  buscar cosas (Ctrl+F), nuevo modelo asistente, mapa del sistema, mapa
  paneles. Modales: ModalUrlsObjeto, ModalDuracionEstado, Cheatsheet de
  atajos. `BarraPestanas` con N pestañas independientes session-only.
  `PanelCarpetas` con drag-drop, cut/paste, glifos archivado/versión.
  `MenuContextualArbol` con acciones completas. `DivisorPanel` entre árbol
  y canvas. Registry central de atajos `ui/atajosTeclado.ts` con contexto.
  Toggles `Mostrar alias`/`Mostrar descripciones`/`Mostrar archivados`/
  `Mostrar versiones` en Toolbar. Ctrl+arrows navegan árbol; Ctrl+0
  fit-to-screen; Ctrl+rueda zoom; Esc/Delete/Ctrl+A/C/V con guards de
  modal-input. Multi-selección con Ctrl/Cmd+clic y rubber band Shift;
  operaciones batch atómicas en undo.
- **Persistencia**: JSON conserva todos los campos OPM nuevos
  (`entidad.alias/unidad/descripcion/urls/layoutEstados`,
  `estado.designaciones/duracion/suprimido`, `apariencia.modoPlegado/
  ordenPartes`, `modelo.archivado/archivadoEn/versiones`). Workspace
  local con jerarquía de carpetas, sin permisos, índice tolerante con
  `recientes: Id[]` obligatorio (max 10), `mapa` por modelo,
  `preferenciasUi` global (anchoPanelArbol, nombresArbolVisibles),
  `carpeta.archivada/archivadaEn`. Versiones por save manual (sin
  log-scale). Movimiento de modelos y carpetas con cut/paste y drag-drop;
  caducidad 5 minutos del portapapeles. Búsqueda global ≥3 caracteres.
  Autosalvado 5 min con guard `esDirty()`.
- **Auditoría**: `docs/roadmap/hu-progress.{md,html,json}` y
  `hu-progress-evidence.json` regenerados sobre HEAD. Detector descalibrado
  (45/49 reglas) — recalibración explícita en pendientes inmediatos.

## Pendientes Inmediatos

- **Recalibrar el detector `progress-dashboard.mjs`** (deuda inmediata para
  ronda 8): EPICA-13 cayó de 7 cubiertas a 2 (las HU de designaciones de
  estado ahora viven en `modelo/estadosDesignaciones.ts`, fuera del regex
  actual). EPICA-17 quedó en 0 cubiertas pese a alias/unidad/descripción/
  URLs/duración entregados (código en `modelo/objetoMetadata.ts` y
  `objetoDuracion.ts`). EPICA-90 sigue en 0% pese al registry central de
  atajos (código en `ui/atajosTeclado.ts`). EPICA-30 mantiene 34.8% sin
  reflejar versiones/archivado/búsqueda global. Patrón a seguir: L1 ronda 6
  (commit `ee633eb`).
- **Multi-pestaña — undo per-pestaña**: actualmente el stack undo es
  global compartido entre pestañas; cada pestaña sí posee modelo
  independiente. Migrar a undo per-pestaña requiere envolver `commitModelo`
  para empujar al `historialUndo` de la pestaña activa (~50 acciones).
- **Mapa render — export PDF**: HU-21.017 PDF queda diferida por regla
  "no introducir dependencias nuevas". Reabrir si se aprueba `jspdf` o
  `pdf-lib`.
- **EPICA-17 slot de valor numérico**: HU-17.014/.015-017 (`valueSlot.*`)
  fuera de ronda 7 — requiere kernel separado para "atributo numérico".
- **EPICA-11 tabla de tipos extendida + Condición/Evento/NOT**:
  HU-11.026/.027 fuera de ronda 7 — requiere kernel `enlace.subtipo` y
  `enlace.modificadorNot`.
- **EPICA-15 multiplicidad avanzada**: HU-15.* más allá de origen/destino
  simples sigue pendiente.
- **EPICA-19 imágenes incrustadas**: 16 HU pendientes; podría lanzarse
  como línea independiente disjunta de las 6 actuales.
- **EPICA-1A grid + snap + alineación**, **EPICA-1B traer conectados**:
  pendientes de MVP-β.
- **EPICA-32 sub-modelos**, **EPICA-33 plantillas**: pendientes MVP-γ.
- **EPICA-60 export PDF**, **EPICA-61 export SVG papel**: pendientes,
  requieren librerías o cliente-side avanzado.
- **EPICA-71 CSV import**: pendiente; coordina con campos de `entidad`
  introducidos en ronda 7.
- **EPICA-80-82** (config usuarios/defaults estilo/ontología organizacional):
  diferidas a MVP-γ/δ.
- **EPICA-A0-A2** (estereotipos / requisitos / IA): diferidas.
- **EPICA-B0-B5** (simulación), **EPICA-C0-C2** (runtime), **EPICA-D0-D1**
  (análisis): diferidas a MVP-δ.
- **EPICA-40, 41, 42** (colaboración multi-usuario, chat, notas): diferidas
  por single-user MVP.
- **HU-SHARED-008** ya cubierta en ronda 7; sigue siendo precondición de
  HU-11.007/.008/.023, HU-14.016, etc.
- **Deuda técnica**: `app/src/store.ts` ~3700 LOC tras ronda 7,
  `app/src/modelo/operaciones.ts` 1743 LOC (congelado), `app/src/render/
  jointjs/proyeccion.ts` 1116 LOC. Cualquier capacidad nueva debe preferir
  módulos de dominio y wrappers mínimos.
- **Deuda de build**: bundle 1045 KB minificado / 295 KB gzip; Vite advierte
  por chunk grande. Code splitting diferido hasta que el corte funcional
  lo justifique.

## Épicas Descartadas Del Proyecto

| Épica | Título | Fecha de descarte | Razón |
|---|---|---|---|
| 70 | Importación OPCAT 4.2 (.opx) | 2026-05-05 | Fuera de alcance del proyecto |
| 91 | Modo tutorial / tooltips guiados / asistencia pedagógica | 2026-05-05 | Fuera de alcance del proyecto |

Las HU de estas épicas se conservan en sus archivos como referencia
histórica y trazabilidad SSOT, pero **no deben asignarse a ninguna ronda
de desarrollo, no deben aparecer en briefs de líneas paralelas, ni deben
contar como pendientes en el roadmap operativo**. Decisión irreversible
salvo nueva instrucción explícita del operador.

## Cómo Continuar

1. Leer este `docs/HANDOFF.md` y `docs/roadmap/hu-progress.md`.
2. Si abrirás una nueva ronda paralela:
   - Heredar el formato de `docs/instrucciones-lineas-dev/ronda7/`.
   - Asumir cadenas de efecto kernel→render→OPL→UI: cada brief debe
     declarar qué archivos toca y cómo evita colisiones cross-line.
   - Reservar el **último** commit del ciclo para una capa explícita de
     cascadas resueltas (ronda 7 demostró que esa capa es ineludible: fix
     scaleContentToFit, halo selección selectiva, padding marcadores
     designaciones, captura de Escape en diálogos, sticky barra creación,
     happy-dom link.remove, registry vs modal precedence).
   - Considerar **L7 calibración del detector** como primera línea de la
     próxima ronda (similar a L1 ronda 6).
3. Antes de diseñar, consultar `opm-extracted/`, `assets/svg/`,
   `docs/JOYAS.md` y la SSOT OPM. Las decisiones de ronda 7 citan paths
   concretos de `opm-extracted` (ej. `selectionConfiguration.ts:38-45`,
   `BringConnectedEntitiesAction.ts:6-26`, `tabsService.ts:5-50`,
   `keyboardShortcuts.ts:6-50`, `aliasing-module.ts:5-33`).
4. Cerrar cada cambio con `bun run check`; si toca UI/render, sumar
   `bun run browser:smoke`; si toca proyección o bundle, sumar
   `bun run build`.
5. Regenerar auditoría con
   `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real`
   antes de publicar un cierre de ronda. **Tras la ronda 8 esperar
   detector >= 50/52 reglas** sobre ~170 archivos fuente.
