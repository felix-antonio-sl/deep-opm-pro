# Dossier — Render OPD (`app/src/render/jointjs`) y canvas (`app/src/canvas`)

> Fase: COMPRENDER (sin edición del repo). Lectura directa de código, tests, e2e,
> `docs/render-headless.md`, `docs/specs/2026-06-15-orden-inzoom-canvas-sync-design.md`,
> `ui-forja/08-jointjs-styling.md` y la SSOT visual `spec-forja-opd-es` (copia KORA en
> scratchpad `canon/spec-forja-opd-es/content.md`, v1.4.0). Rutas relativas a `app/src/`
> salvo indicación.

---

## 0. Ficha

| Dato | Valor |
|---|---|
| Código de producción | ≈13.250 LOC (render/jointjs ≈10.950 · canvas ≈2.300) en 70 archivos |
| Tests unitarios del área | ≈6.000 LOC, ≈225 `test(...)`; `proyeccion.test.ts` sola tiene 1.797 LOC / 66 tests |
| Acoplamiento e2e | 36 specs/scripts usan `.joint-element` (115 usos), `.joint-link` (56), `joint-selector=` (41+), `window.__opmJointAdapter` (25), `model-id` (10) |
| Motor | `jointjs` 3.7.7 (core MPL) → arrastra `jquery ~3.7`, `backbone ~1.4`, `lodash ~4.17`, `dagre`, `graphlib`; `joint.core.min.js` = 418 KB |
| Consumidores fuera del área | `ui/App.tsx`, `ui/JointCanvasFeedbackBoundary.tsx`, `ui/CanvasAdapterContext.tsx` (expone `dia.Paper` crudo a UI), `ui/BarraHerramientasElemento.tsx`, `ui/codex/CodexCanvasMount.tsx`, `ui/codex/CodexSelectionAnnotation.tsx`, `ui/toolbar/ToolbarBase.tsx`, `ui/CommandPalette.tsx`, `ui/MapaSistema.tsx`, `ui/portable/PortableReaderPage.tsx`, `ui/review/RevisionReader.tsx`, `store/*` (vía `canvas/*`) |
| Historia git | Truncada: 69 commits desde 2026-07-26; 7 tocan el área. Los comentarios conservan la arqueología ("Ronda 9 L2", "Ronda 16 L2", "CANON-V2/V3/V4", "BUG-xxxxxx", "HU-12.020", "SEL-1", "B0.017", "D6.3", "W3.1") |

---

## 1. Propósito y veredicto

**Propósito.** Proyectar un OPD del `Modelo` a SVG interactivo con la gramática visual OPM
(ISO 19450 + extensiones Forja), capturar gestos de edición directa y traducirlos a
comandos del store; además exportar el OPD a SVG/PNG (canvas vivo, offscreen, headless) y
ofrecer utilidades de canvas (layout sugerido, operaciones por lote, modo enlace, mapa del
sistema).

**Veredicto resumido.**

- La **gramática visual** (formas, sombra, dash de afiliación, estados rountangle, 4
  triángulos con topología interna, piruletas, swallowtail, rayo, `c/e/¬`, arcos XOR/OR,
  multiplicidades, etiquetas) está **bien resuelta y es conforme** con `spec-forja-opd-es`
  (la spec traza literalmente a estos archivos). Es la parte sagrada: portar los valores.
- La **arquitectura de render** es un embudo de acreción: una proyección pura produce JSON
  de celdas JointJS (`JointCellJson`) con **selectores string indexados**
  (`stateCapsule3`, `connect-anchor-ne-state2`, `resize-state1-se`) y metadatos `opm`
  casteados; luego **cinco post-pasadas imperativas** sobre el grafo vivo (embed,
  ruteo con obstáculos, permutación de terminales, a11y, re-geometría de abanicos leyendo
  `LinkView`) más herramientas y hover imperativos. La identidad de piezas se deduce por
  **sufijos de id** (`-triangulo`, `-refinable`, `-rama`, `struct-bus-`, `ag-bus`).
- La **interacción** está repartida en 8 handlers que se suscriben a los mismos eventos
  JointJS (`element:pointerdown` en 4 handlers, `element:pointerdblclick` en 2 + un
  `pointerclick detail>=2`), con ≈35 callbacks espejados en `useRef` (JointCanvas.tsx:187-305)
  y ≈70 casts `as unknown as` para alcanzar API JointJS no tipada.
- Hay **defectos latentes reales** (sección 10): ramas `grupo-enlaces` inalcanzables (el
  triángulo compartido de un bus no se selecciona ni arrastra), auto-layout que puede
  **cambiar el OPL temporal** de un in-zoom, rayo de invocación destruible por edición de
  vértices, dos caminos de export con fidelidad distinta.
- Recomendación: **reemplazar JointJS por un renderer SVG propio declarativo (Preact)
  sobre una “escena” geométrica pura**, conservando catálogos/valores y la mayor parte de
  la geometría pura ya escrita. El vocabulario visual OPM es cerrado
  (R-§23-OPD-VOCAB): ~12 primitivas. El único componente difícil es el ruteo ortogonal con
  obstáculos (reemplazable por ruteo “en codo” desde el triángulo). Detalle en §12–13.

---

## 2. Inventario de módulos

Valor: **N** núcleo · **I** importante · **M** marginal · **A** acreción.

### 2.1 `render/jointjs` — orquestación y adaptador

| Archivo | LOC | Propósito | Valor | Rec. |
|---|---:|---|:-:|---|
| `JointCanvas.tsx` | 998 | Componente Preact: monta paper, cablea handlers, efecto de proyección (462-562), tokens de simulación (570-611), zoom/fit/resize, centrado por selección externa (694-714), renombrado encadenado, menú de tipo de enlace (slots) | N | simplify (reescribir; ≈35 refs espejo, 12 efectos) |
| `jointCanvasAdapter.ts` | 197 | Crea `dia.Graph`+`dia.Paper` (`async:false`), `restrictTranslate` (66-86), `interactive` (87-127), sync por “canales” con `JSON.stringify` (162-184), hook debug `__opmJointAdapter` (192-197) | I | simplify |
| `proyeccion.ts` | 399 | `proyectarModeloAJointCells(modelo, opdId, selEntidad, selEnlace, hover, seleccionados, opciones, simulacion, driftMap)` — 9 posicionales; orquesta composers, buses, TS3, autoinvocación, halos | N | keep-la-lógica / simplify-la-forma |
| `proyeccionTipos.ts` | 114 | `OpmJointMetadata` (10 variantes), `JointCellJson`, `OpcionesProyeccion` | I | simplify |
| `proyeccionOpciones.ts` | 24 | defaults + normalización de opciones (incluye `canalSeleccion`, **nunca leído**) | A | cut (fusionar) |
| `customShapes.ts` | 32 | shape `opm.AbanicoArc` (path sin `refD` fantasma) | I | cut con JointJS |
| `palette.ts`, `labelText.ts`, `constantes.codex.ts` | 11+12+52 | tokens Codex espejados a mano de `ui-forja/tokens.css` | I | keep (unificar con `ui/tokens.ts`) |
| `jointjs.css` | 185 | hover de anclas, feedback de cápsulas, animaciones de simulación | I | keep (renombrar selectores) |

### 2.2 `render/jointjs/composers` — gramática visual

| Archivo | LOC | Propósito | Valor | Rec. |
|---|---:|---|:-:|---|
| `composers/entidad.ts` | 1.134 | Objeto/proceso: forma, sombra física, dash ambiental, stroke 4 refinada, contorno in-zoom, estados embebidos, plegado parcial, badges (desc `i`, URL `↗`, notas `?N`, fold `▸/▾`, suprimidos `⋯N`), estereotipo `<<N>>`, chip de drift, anclas de conexión, handles de resize, underline de selección, ports | N | keep-valores / simplify-estructura (pipeline de 6 decoradores `markupConX/attrsConX`) |
| `composers/estados.ts` | 187 | Dimensionado y rect de cápsulas (horizontal/vertical, manual x/y/w/h, clamp) | N | keep casi tal cual |
| `composers/enlace.ts` | 854 | Endpoints visuales (entidad/estado/proxy/port), marcadores, etiquetas (multiplicidad, `c/e/¬`, Pr, demora, tasa, Min/Max, requisitos, tags, ruta, proxy), refinamiento estructural simple, zigzag de invocación, anclaje center+boundary | N | keep-valores / simplify |
| `composers/markers.ts` | 317 | Triángulos estructurales (4 topologías), puertos del símbolo, marcadores de extremo, texto de modificador | N | keep valores |
| `composers/plegado.ts` | 106 | Plegado parcial: filas, separadores, hit-areas, tachado de extraída | I | keep |
| `composers/halos.ts` | 435 | Underline de selección (multi), halos de simulación (proceso activo, involucrada, current, resultado, inicial-pin) | I | simplify (7 funciones casi idénticas) |
| `composers/imagenOverlay.ts` | 133 | Imagen incrustada en objeto + insignia 📷 | M | simplify |
| `composers/colores.ts` | 30 | contraste WCAG texto/fill — **fill siempre `transparent`/`paperWarm` ⇒ siempre ink** | A | cut |
| `composers/grid.ts` | 22 | grid `mesh` del paper | M | keep (trivial en SVG propio) |
| `linkAssets.ts` | 126 | Catálogo de marcadores (paths literales). Campos `source`, `path`, `arrowPath`, `markerPath`, `logical` **no se usan en runtime** | N (markers) / A (resto) | keep markers, cut resto |
| `estadoTargets.ts`, `plegadoNesting.ts`, `labelLayout.ts`, `rutaLabels.ts` | 19+22+166+35 | Selectores de estado; filas de plegado con `▸`; claves de etiqueta persistidas + ancho de wrap; etiqueta de ruta | I | keep `labelLayout` (claves = contrato), fusionar resto |

### 2.3 `render/jointjs` — sub-construcciones OPM

| Archivo | LOC | Propósito | Valor | Rec. |
|---|---:|---|:-:|---|
| `agregacionBus.ts` | 399 | Bus estructural: ≥2 ramas mismo `tipo:refinable:grupoEstructuralId` comparten un triángulo; reserva/separación anti-colisión de símbolos (44/50 px); multiplicidad re-emitida en ramas | N | keep lógica; dedup `extremo/attrsLinea/routerManhattan` |
| `abanicoOverlay.ts` | 234 | Geometría de arcos XOR (1×r30)/OR (r30+r35), dock recta-forma, mayor hueco angular | N | keep casi tal cual (geometría pura) |
| `abanicoDragSync.ts` | 130 | Recalcula el arco leyendo `LinkView.getPointAtLength` (post-render y en drag) | A (artefacto JointJS) | cut (con geometría propia el arco sale de la misma polilínea) |
| `autoinvocacionLoop.ts` | 213 | Lazo de autoinvocación (±35°, pico `max(56, h·0.55)`, 4 vértices OPCloud) | N | keep |
| `familiaPreestadoOverlay.ts` | 84 | Tarjeta “EXTENSIÓN DECLARADA” de familias de efectos por preestado | M | keep-si-la-extensión-se-mantiene |
| `declaracionesNoNuclearesOverlay.ts` | 92 | Tarjetas “CONTRATO NO NUCLEAR” (rol/restricción/exclusión/frontera) | M | keep-si-se-mantiene; mover a panel |
| `opcloudRouting.ts` | 93 | Post-pasada: manhattan con obstáculos para todo enlace estructural; direcciones por sufijo de id | I | replace (ruteo codo propio) |
| `sortStructuralLinks.ts` | 162 | Post-pasada: permuta terminales (≤7 enlaces ⇒ ≤5.040 permutaciones) contando cruces por muestreo de `LinkView` cada 12 px | A | cut (reemplazar por orden por ángulo/x de refinadores) |
| `beautifyConnectedLinks.ts` | 104 | Tras drag, lee `sourceAnchor/targetAnchor` reales para re-derivar ports persistidos | A (artefacto de ports) | cut con el rediseño de ports |

### 2.4 `render/jointjs/handlers` — interacción

| Archivo | LOC | Propósito | Valor | Rec. |
|---|---:|---|:-:|---|
| `handlers/seleccion.ts` | 356 | click/ctrl/shift, estado vs cosa, fold badge, parte plegada, grupo estructural, contextmenu (eventos `window` custom), dblclick ⇒ navegar a OPD refinado o renombrar subproceso, creación por click, drop de paleta | N | simplify |
| `handlers/drag.ts` | 412 | pointerup ⇒ `moverAparienciaConPuertos` (+ sort + beautify); drag de cápsula de estado (mousemove en `window`); vértices; labels; reanclaje por arrowhead; abanico en vivo; `embedirContorno` | N | simplify |
| `handlers/resize.ts` | 241 | Resize de cosa (4 esquinas; Shift proporcional) y de cápsula de estado | I | keep lógica |
| `handlers/estadoGeometry.ts` | 120 | Mutación live de attrs de cápsula (clamp duplicado de `composers/estados.ts`) | A (duplicación) | cut/fusionar |
| `handlers/modoEnlace.ts` | 510 | Drag desde ancla con ghost, resolución de destino por punto (BUG-916191), menú de tipo, feedback válido/inválido pintando `style.outline` inline, teclado (Tab/Enter) | N | simplify |
| `handlers/toolsEnlace.ts` | 122 | Link tools JointJS (Boundary, arrowheads, Vertices, Segments) | I | replace |
| `handlers/toolsSimboloEstructural.ts` | 160 | `elementTools.Control` para mover puertos in/out del triángulo | M | replace/simplify |
| `handlers/rubberBand.ts` | 106 | Marquee Shift+drag (div HTML) | I | keep lógica |
| `handlers/zoom.ts` | 193 | Ctrl+rueda (±0,25 %/evento), Ctrl+0 fit, transformToFitContent | I | simplify (UX) |
| `handlers/gestosTouch.ts` | 149 | Pan 1 dedo / pinch 2 dedos solo en lectura | I | keep |
| `handlers/hoverOpl.ts` | 67 | mouseover ⇒ `OplReferencia`; `aplicarHoverOpl` pinta fill/stroke imperativo | I | simplify (una sola fuente) |
| `handlers/helpers.ts` | 201 | `metadata()`, selectores, coords, fitToContent, bbox, constantes (padding 1800, zoom 0,5–1,6) | I | simplify |

### 2.5 `render/jointjs` — export, overlays HTML, mapa

| Archivo | LOC | Propósito | Valor | Rec. |
|---|---:|---|:-:|---|
| `mapaExport.ts` | 580 | SVG del paper vivo u offscreen, limpieza de chrome por regex, encuadre, fondo, rasterizado PNG, **ZIP escrito a mano** (store, `deflateRaw` identidad) | N (export) | simplify: export = serializar la misma escena |
| `headlessRender.ts` | 114 | Hook `window.__opmRenderHeadless__` (solo `VITE_HEADLESS_RENDER`) para agentes | I | simplify (con escena pura no requiere navegador salvo PNG) |
| `overlayCanvas/*` | 322 | Capa HTML: `ErrorBadge` △ anclado a celda (bbox tracker por badge), `FlashToast`, `avisos.ts` (corre `validarModelo` completo en cada cambio de modelo) | I | keep idea; simplify |
| `mapa/proyeccion.ts`, `mapaSistema.ts` | 113+20 | Mapa del sistema (árbol de OPDs) a celdas JointJS, Arial, rojos hex fijos | M | simplify/cut (el árbol ya existe en UI) |

### 2.6 `canvas/`

| Archivo | LOC | Propósito | Valor | Rec. |
|---|---:|---|:-:|---|
| `canvas/layoutSugerido.ts` | 748 | Auto-layout: caso A in-zoom (contorno, bandas `ordenInzoom`, externos izq/der por dirección) y caso B BFS por capas con baricentro | I | simplify + corregir semántica temporal (§10.2) |
| `canvas/operacionesBatch.ts` | 625 | **Operaciones de modelo** por lote: eliminar (+`purgarHuerfanos`), nudge, alinear/distribuir, conectar partes al todo, traer conectados/entre, copiar/pegar apariencias, ocultar | I | move a `modelo/operaciones` (capa equivocada) |
| `canvas/modoEnlace.ts` | 124 | `ModoEnlace`, evaluación de destinos por firma (`evaluarTiposEnlacePermitidos`), tipo inicial por prioridad, color de halo (**paleta legacy**) | N | keep lógica, cut colores legacy |
| `canvas/seleccionMultiple.ts` | 154 | Estado de selección puro, marquee por bbox, enlaces internos a una selección | I | keep |
| `canvas/reglasTraer.ts` | 68 | Familias “traer conectados” (habilitador/transformador/direccional/estructural) | I | keep |
| `canvas/layoutRadial.ts` | 100 | Colocación radial sin colisión para traídos | I | keep |
| `canvas/grid.ts` | 48 | `GridConfig` normalizado, cuantización | I | keep |
| `canvas/coloresCanon.ts` | 17 | Espejo legacy `#70E483/#3BC3FF/#586D8C` (GAP-OPD-FEEDBACK-LEGACY) | A | cut |
| `canvas/constantesInzoom.ts`, `canvas/mapaSistema.ts` | 6+24 | Re-exports de compatibilidad | A | cut |
| `canvas/mapa/*` | 434 | Descriptor del árbol de OPDs, filtros, marcadores, estadísticas | M | simplify/cut |

---

## 3. Pipeline de render (flujo real)

```
store (zustand) ──ports/viewmodel──▶ JointCanvas.tsx
  useJointCanvasViewModel() → useZustandCanvasInteractionPort() → componer(3 sub-ports)
  ≈35 callbacks → espejados en useRef (187-305) para handlers montados una sola vez

[mount]  crearJointCanvasAdapter(host)  → dia.Graph + dia.Paper(async:false, interactive(), restrictTranslate())
         cablearSeleccion / RubberBand / Drag / Resize / ModoEnlace / HoverOpl   (listeners sobre el mismo paper)

[efecto proyección: deps = modelo, selección, estados sel., resaltados, alias/desc/imagen, simulación, drift]
  1. cells = proyectarModeloAJointCells(modelo, opd, selId, enlSelId, null, seleccionados, opciones, sim, drift)
        busCells  → agregacionBus (≥2 ramas)
        enlaces   → autoinvocación | TS3 (2 segmentos) | refinamiento estructural simple | proyectarEnlace
        proxies   → proxy de extracción (plegado)
        overlays  → abanico (geometría fría), familias preestado, declaraciones no nucleares
        elementos → proyectarEntidad (markup+attrs compuestos)
        imágenes, halos (solo multi-selección), halos de simulación
  2. sincronizarCanalesJointCanvasAdapter: JSON.stringify(estructura) ≠ previo ⇒ graph.resetCells(TODO)
  3. embedirContorno(graph)                    // embebe internos en el contorno in-zoom
  4. aplicarRuteoOpcloudEnlaces(graph)         // manhattan con obstáculos a TODO enlace estructural
  5. ordenarTodosLosEnlacesEstructurales(...)  // permutaciones + muestreo de LinkView
  6. aplicarA11yConexionTeclado(...)           // tabindex/role/aria por celda
  7. recalcularOverlaysAbanicoDesdeLinkViews   // re-geometría leyendo LinkView
  8. instalarHerramientasEnlaceSeleccionado / SimboloEstructural, aplicarFeedbackModoEnlace
  9. aplicarHoverOpl (sobrescribe body/fill y line/strokeWidth)
 10. ajustarPaperAContenido (fitToContent allowNewOrigin:any, padding 1800) + compensación de scroll
     o centrado en rAF al cambiar de OPD / primera apariencia
```

Hechos clave del flujo:

- La **selección única** cambia el markup de la celda de la entidad (underline, handles,
  opacidad de anclas) ⇒ cambia `estructuraKey` ⇒ **cada click hace `resetCells` completo +
  pasos 3-10**. El “canal de selección” solo evita el reset en multi-selección (halos).
- El parámetro `hoverOplRef` de la proyección es **siempre `null` en producción**
  (JointCanvas.tsx:476; mapaExport.ts:138); el hover se pinta imperativamente en el paso 9.
  Dos mecanismos para lo mismo.
- La geometría final de estructurales y abanicos **no existe en la proyección**: se decide
  en post-pasadas sobre el grafo vivo. Por eso el export offscreen (que omite los pasos 5 y 7)
  difiere del canvas (§10.4).

---

## 4. Gramática visual OPM codificada (reglas sagradas, con ubicación)

La spec `spec-forja-opd-es` referencia estos valores como “realización opforja”. Una
reescritura debe portarlos (o enmendar la spec). IDs de la spec entre paréntesis.

### 4.1 Cosas (R-OPD-COSA-1..8)

| Regla | Realización | Ubicación |
|---|---|---|
| Objeto = rectángulo esquinas rectas; proceso = elipse | `bodyTag = objeto ? rect : ellipse`; `standard.Rectangle`/`Ellipse`; `rx:0` | composers/entidad.ts:115, 137-139, 227 |
| Esencia física ⟺ sombra abajo-derecha (canal semántico, no decoración) | `filter dropShadow {dx:6, dy:6, blur:2, rgba(23,21,17,0.68)}` solo si `esencia === "fisica"` | composers/entidad.ts:133 |
| Afiliación ambiental ⟺ contorno discontinuo, **heredada por exhibición** (R-OPD-STR-13, R-CTRN-1) | `esAfiliacionEfectivaAmbiental(modelo, id) ? "8 4"` ; el refinamiento **no** usa dash | composers/entidad.ts:105-113 |
| Cosa refinada = contorno grueso (R-OPD-REF-1) | `strokeBase = refinada ? 4 : 1.5` (`tieneRefinamiento` = descomposición o despliegue) | composers/entidad.ts:88, 99 |
| Proceso en cursiva, objeto normal; Inria Serif 17 | `fontStyle` por tipo | composers/entidad.ts:141-152 |
| Rótulo íntegro, sin elipsis; la forma crece (R-OPD-COSA-6/V-212) | `textWrap {width:-16,height:-16, ellipsis:false}`; ancho = max(apariencia, 135, `chars·8+28`, palabra más larga `·10+28`) | constantes.codex.ts:32-34; composers/entidad.ts:399-406 |
| Procesos no tienen estados (R-OPD-COSA-7) | estados solo si `entidad.tipo === "objeto"` | composers/entidad.ts:66, 257 |
| Color informativo, no normativo (R-OPD-COSA-5); stroke objeto `#27613f`, proceso `#1d3f78` | `colorEntidadCodex` | constantes.codex.ts:50-52 |
| Estereotipo visible `<<Nombre>>`, no altera clase (R-OPD-ROT-6) | texto 11 px inkSoft, bajo el borde si el label va arriba | composers/entidad.ts:52-55, 463-499 |
| Anclaje a Pieza: chip de 3 fases en TINTA, jamás crimson (R-OPD-ROT-9) | amarre (path) / `?` / `⟳` con gradiente inkFaint→inkSoft→ink | composers/entidad.ts:520-618 |

### 4.2 Estados (R-OPD-EST-1..9)

| Regla | Realización | Ubicación |
|---|---|---|
| Rountangle **radio fijo**, no pill (GAP-UIFORJA-08a resuelto) | `rx = ry = ESTADOS.radius = 8` | composers/entidad.ts:878-885; composers/estados.ts:177-187 |
| Contenido en la región inferior del objeto; nunca flotante | `yBase = size.height − paddingBottom − altoTotal`; clamp al interior | composers/estados.ts:80-115, 153-171 |
| Inicial = borde grueso | `strokeWidth: inicial ? 3 : 1.2` | composers/entidad.ts:888 |
| Final = doble contorno | fill `estadoFinalFill` + rect interior padding 3, stroke 1 | composers/entidad.ts:886, 902-914 |
| Por defecto = flecha (vigente `↗`, GAP-OPD-DEFAULT-GLIFO) | `stateDefaultMarker` | composers/entidad.ts:930-942 |
| Current declarado (vigente `●` interno, GAP-OPD-CURRENT-GLIFO) | `stateCurrentMarker` | composers/entidad.ts:943-955 |
| Visibilidad = ¬suprimido global ∧ ¬suprimido local (R-OPD-EST-8) | `estadoVisibleEnAparicion(estado, apariencia)`; el índice de cápsula se calcula sobre el MISMO conjunto visible | composers/entidad.ts:70; composers/estados.ts:63-66, 143 |
| Indicador de supresión `⋯N` inferior-derecha (R-OPD-EST-9) | chip hairline paper/ink, radio alto/2 | composers/entidad.ts:1092-1130 |
| Layout horizontal/vertical por `layoutEstados` | ancho/alto por designación (+6 px), manual `estado.width/height/x/y` | composers/estados.ts:13-49 |
| Enlace a estado ancla la cápsula, no el objeto (R-OPD-TR-6) | endpoint `{id: apariencia, selector:"stateCapsuleN", anchor: midSide, connectionPoint: boundary sticky}`, `z=20` | composers/enlace.ts:74-78, 348-355, 174, 224 |

### 4.3 Enlaces procedimentales (R-OPD-TR, R-OPD-HAB, R-OPD-INV)

| Regla | Realización | Ubicación |
|---|---|---|
| Punta transformadora = swallowtail cerrado `M 0 0 L 23 8 L 12 0 L 23 -8 Z`, fill paper, stroke ink 1; consumo/resultado distinguidos por **dirección** | `TRANSFORMING_ARROWHEAD` como `targetMarker` | linkAssets.ts:24, 43-57; composers/markers.ts:209-222 |
| Efecto = punta en ambos extremos | `marcadorFuente("efecto")` + destino | composers/markers.ts:194-197 |
| TS3 (efecto entrada-salida) = dos segmentos estado→proceso y proceso→estado, sin punta en la fuente | `ts3-entrada`/`ts3-salida`, `sourceMarker: null` | proyeccion.ts:214-270; composers/enlace.ts:212 |
| Agente = piruleta **negra**, instrumento = piruleta **blanca** (palito 7 + círculo r5) en el extremo proceso | mismo path, fill ink vs paper | linkAssets.ts:28-42 |
| Invocación = rayo (zigzag) + swallowtail en el invocado | 2 vértices calculados si no hay vértices persistidos: t=0,62 offset 0 y t=0,48 offset ⊥ `min(22, max(12, len·0,08))` | composers/enlace.ts:799-825 |
| Autoinvocación = lazo bajo el proceso, 2 tramos, marca solo en el retorno | ±35°, pico `max(56, h·0,55)`, 4 vértices OPCloud por tramo | autoinvocacionLoop.ts:70-104, 108-154 |
| Excepciones sobretiempo `/`, subtiempo `//` (+ combinada) | polylines `4,10 13,-10` … | linkAssets.ts:71-82 |
| Procedimentales rectos (sin router); jumpover en cruces, recto si >35 enlaces (R-OPD-LAY-4/6) | `usarJumpover = enlaces ≤ 35`; `connectorJumpover {arc, size 8}` | proyeccion.ts:40, 93; composers/enlace.ts:165-169, 791-793 |
| Anclaje canónico: centro + recorte en perímetro real (R-OPD-LAY-5) | `anchor center` + `connectionPoint boundary {offset 0, sticky}`; con port: `connectionPoint anchor` | composers/enlace.ts:750-773 |
| Consumo/resultado/efecto **ignoran** el port persistido salvo abanico | `preservarPuertoRender` | composers/enlace.ts:333-336 |

### 4.4 Modificadores, lógica, anotaciones (R-OPD-CTL, R-OPD-MUL)

| Regla | Realización | Ubicación |
|---|---|---|
| `c`/`e` **minúscula**, `¬` como negación; modelo guarda `C/E/no` | `textoSubtipoModificador` | composers/markers.ts:250-260, 312-317 |
| Marca cerca del extremo del proceso | distance 0,8 si el proceso es destino (consumo/agente/instrumento), 0,2 si es origen; offset −20; badge círculo 18 paper/ink | composers/enlace.ts:376-400; composers/markers.ts:262-310 |
| XOR = 1 arco, OR = 2 arcos concéntricos en el extremo común (R-OPD-CTL-7) | r30 / r30+r35, dash `4 1`, 1,5 px, se abre evitando el mayor hueco angular; dock = intersección recta-forma hacia el centroide | abanicoOverlay.ts:9-49, 150-230 |
| Abanico solo “completo” (todas las ramas visibles y puerto exacto compartido) | `proyeccionesAbanicoEnOpd(...).completa` | proyeccion.ts:125-142; `modelo/abanicos.ts:226-251` |
| Probabilidad `Pr = p` | `textoProbabilidad` | composers/enlace.ts:402-404 |
| Demora sobre invocación | etiqueta 0,5/−28 | composers/enlace.ts:385-387 |
| Multiplicidad junto al extremo: origen 0,1 (proc.) / 0,2 (estr.), destino 0,9; **en bus se re-emite del lado del refinador** (V16-9) | `etiquetasMultiplicidad`; `multiplicidadRefinador` | composers/enlace.ts:357-374; agregacionBus.ts:206-222 |
| Etiqueta de ruta (R-OPD-CTL-12) 0,33/−24 | `etiquetasRuta` | rutaLabels.ts:7-35 |
| Tasa `Rate = x [u]`, `Min:`/`Max:` (GAP-OPD-DURACION-ELIPSE), `Satisfied:` | según `enlaceAdmiteTasa/TiempoMin/Max` | composers/enlace.ts:492-522 |
| Etiqueta de usuario en itálica | serif 12 italic inkMid | composers/enlace.ts:553-585 |

### 4.5 Estructurales (R-OPD-STR-1..13)

| Regla | Realización | Ubicación |
|---|---|---|
| Topología interna del triángulo es el canal normativo | agregación: relleno ink; generalización: vacío (paper); exhibición: contorno + triángulo interior 12×12 relleno en (+9,+12); clasificación: vacío + círculo r4 en (15,20) | composers/markers.ts:34-116; linkAssets.ts:92-117 |
| Vértice al refinable, base a refinadores; triángulo siempre conectado por líneas | tramo `-refinable` (refinable→puerto `in`) + tramo(s) `-refinador`/`-rama` (puerto `out`→refinador) | composers/enlace.ts:645-726; agregacionBus.ts:168-183 |
| Bus: ≥2 ramas del mismo `tipo` + refinable + `grupoEstructuralId` ⇒ un solo triángulo | agrupa por origen, luego por destino con los no consumidos | agregacionBus.ts:54-108 |
| Enlaces a estado o a proxy no entran al bus | filtro | proyeccion.ts:171-174 |
| Ruteo ortogonal que evita cosas y triángulos (R-OPD-LAY-4); sale por abajo del triángulo, entra por arriba | `routerManhattanConObstaculos` padding 5 / step 11; direcciones por sufijo de id | opcloudRouting.ts:8-56 |
| Separación de símbolos que colisionan (<44 px ⇒ carriles de 50 px) (R-OPD-LAY-7) | `separarCentroSimboloEstructural` | agregacionBus.ts:349-376 |
| `ordered` junto al triángulo (R-OPD-STR-5) | `etiquetaOrdenEstructural` si `orderedFundamentalTypes` incluye el tipo | composers/enlace.ts:587-612, 705; agregacionBus.ts:166, 176 |
| Tagged uni = punta abierta; bi = arpones con 2 etiquetas (0,8 ida / 0,2 vuelta); orientación del arpón según Δx | `marcadorTaggedBidireccional(deltaX)` | composers/markers.ts:204-207; composers/enlace.ts:476-490 |
| Semi-plegado (plegado parcial): filas internas, parte extraída tachada 0,64; enlaces a parte plegada entran al padre con etiqueta del nombre | `markupPlegadoParcial`; `resolverEndpointVisual` → `proxy` | composers/plegado.ts:13-100; composers/enlace.ts:81-86, 286-324 |

### 4.6 Refinamiento / in-zoom en el canvas (R-OPD-REF-1..5, R-OPD-UI-3)

| Regla | Realización | Ubicación |
|---|---|---|
| El refinable aparece agrandado como contenedor en el OPD de descomposición | `contornoRefinamiento = obtenerRefinamiento(entidad,"descomposicion")?.opdId === opdId`; fill `rgba(250,250,248,.96)`, label arriba (`refY 8%`), `z=0`, tamaño ≥ bbox de internos + 16 | composers/entidad.ts:97, 114, 148-149, 241, 408-430, 675-679 |
| Rol contorno/interno/externo por contexto de refinamiento | `rolAparienciaEnRefinamiento` | composers/entidad.ts:671-673 |
| Internos se mueven con el contorno; externos libres | `embedirContorno` embebe solo `rol === "interno"` | handlers/drag.ts:389-412 |
| Drag de subproceso confinado al contenedor | `restrictTranslate` con pads 4/28/8 | jointCanvasAdapter.ts:66-86 |
| Doble click navega al OPD refinado (descomposición antes que despliegue) | `opdRefinadoPorDobleClick` | handlers/seleccion.ts:218-233, 327-336 |
| Subproceso interno: doble click = renombrado inline | `esSubprocesoInternoTimeline` (duplicado en drag.ts:363-381 y seleccion.ts:338-356) | — |
| Drag de subproceso interno re-deriva `ordenInzoom` (cara 4) | vive en `store/modelo/acciones-canvas.ts::moverAparienciaConPuertos` (fuera del área); el canvas solo llama | handlers/drag.ts:141-145 |

### 4.7 Canal UI reservado (R-OPD-UI-1..5, R-OPD-CAN-3)

- Crimson `#8e2a2e` exclusivo de UI: underline de selección (1,2 px) embebido en selección
  única (entidad.ts:432-457) y celda-halo en multi (halos.ts:47-100); handles 8×8 crimson
  (entidad.ts:620-669); vértices crimson (jointjs.css:4-9); marquee crimson
  (rubberBand.ts:260-266); puertos del símbolo crimson (markers.ts:153-192).
- Simulación comparte el hue crimson con separación por dash/z (halos.ts:118-157;
  enlace.ts:199-214); estado inicial en simulación = pin oliva `#6B7B2A` (halos.ts:15-16,
  366-435) — **hex fuera de tokens y cercano al oliva semántico del estado `#68711f`**
  (roza R-OPD-CAN-3).
- Feedback de modo enlace usa paleta **legacy OPCloud** (`canvas/coloresCanon.ts:9-13`,
  `canvas/modoEnlace.ts:89-101`) — GAP-OPD-FEEDBACK-LEGACY declarado.

### 4.8 Reglas de edición codificadas en `canvas/`

| Regla | Ubicación |
|---|---|
| Validar firma antes de crear enlace; solo ofrecer tipos legales (R-OPD-EDIT-1) | canvas/modoEnlace.ts:45-87 (delegan en `modelo/opcionesEnlace::evaluarTiposEnlacePermitidos`) |
| Tipo inicial sugerido por prioridad consumo > resultado > agente > instrumento > efecto > invocación > estructurales > tagged > excepciones | canvas/modoEnlace.ts:19-35, 113-124 |
| Familias de “traer conectados” | canvas/reglasTraer.ts:138-154 |
| Traer materializa apariencias de hechos ya declarados, sin crear semántica (R-OPD-REF-19) | canvas/operacionesBatch.ts:147-228, 263-301 |
| Conectar partes al todo: el todo y las partes deben ser objetos; sin duplicar enlace | canvas/operacionesBatch.ts:106-138 |
| In-zoom de proceso: bandas `ordenInzoom` = filas del layout; validación de anticadena | canvas/layoutSugerido.ts:654-724 |

---

## 5. Interacción (inventario de gestos)

| Gesto | Handler | Efecto (store) | Notas |
|---|---|---|---|
| Click en cosa | seleccion.ts:98-178 | `seleccionarEntidad` / estado / parte plegada / fold badge / grupo | orden de precedencia: modo creación > insignia imagen > enlace libre > estado > multi > foldBadge > parte > cosa |
| Ctrl/Cmd click, Shift click | seleccion.ts:136-150, 163-167 | toggle / agregar | estados: multi solo dentro del mismo objeto |
| Click en vacío | seleccion.ts:265-276 | vaciar selección o crear cosa (modo creación) | guard rubber band con `setTimeout(0)` |
| Drop desde paleta/árbol | seleccion.ts:278-303 | crear cosa o apariencia | MIME `application/x-opm-tipo` / `x-opm-entidad-id` |
| Drag de cosa | JointJS nativo + drag.ts:106-146 | `moverAparienciaConPuertos(id, x, y, ajustes)` | al soltar: sort de terminales + lectura de anchors reales |
| Drag de cápsula de estado | drag.ts:75-104, 179-202 | `moverEstadoEnCanvas(estadoId, x, y)` | umbral 3 px; listeners en `window`; workaround de pointerup (110-124) |
| Resize de cosa / estado | resize.ts | `redimensionarAparienciaEnCanvas` / `redimensionarEstadoEnCanvas` | 4 esquinas (spec dice 8); Shift = proporcional; mínimos 70×40 / 52×24 |
| Drag desde ancla (8 anclas) | modoEnlace.ts:103-146, 217-242 | abre menú de tipo en el punto | destino resuelto por `elementFromPoint` (el pointerup siempre llega a la vista origen) |
| Modo enlace por botón (origen→destino) | modoEnlace.ts:150-162 | `crearEnlaceEntreEntidades` | feedback: outline inline sobre `view.el` |
| Enlace libre (R sin selección) | seleccion.ts:121-124; modoEnlace.ts:164-168 | `iniciarRelacionDesdeEntidad` | candidatos con outline punteado |
| Teclado | modoEnlace.ts:169-209 | Enter elige tipo inicial / abre menú; Tab recorre destinos válidos | cada cosa `tabindex=0 role=button` (264-281) |
| Vértices de enlace | toolsEnlace.ts + drag.ts:204-238 | `actualizarVerticesEnlace` | batch en drag del tool; bloqueado en agregación |
| Mover etiqueta de enlace | JointJS `labelMove` + drag.ts:240-253 | `actualizarPosicionLabelEnlace(ae, key, pos)` | clave `opmLabelKey` |
| Reanclar extremo (arrowhead) | toolsEnlace.ts:60-71; drag.ts:255-261, 338-361 | `reanclarExtremoAccion` | no aplica a estructurales en canvas (GAP-OPD-DRAG-TRIANGULO) |
| Mover triángulo / sus puertos | drag.ts:128-140; toolsSimboloEstructural.ts | `actualizarPosicionSimboloEstructural` / `…Anclajes…` | **roto para buses** (§10.1) |
| Marquee | rubberBand.ts | `setSeleccion(ids)` (Ctrl+Shift acumula) | usa bbox del modelo, no el renderizado |
| Zoom | zoom.ts | — | Ctrl+rueda ±0,25 %/evento; Ctrl+0 fit; rango 0,5–1,6 |
| Pan | scroll DOM del viewport | — | paper = contenido + 1.800 px por lado |
| Touch (solo lectura) | gestosTouch.ts | — | 1 dedo pan, 2 dedos pinch |
| Hover | hoverOpl.ts | `fijarHoverOpl(ref)` | resaltado bimodal con OPL por referencia tipada (R-OPD-INT-1) |
| Doble click | seleccion.ts:218-233; drag.ts:148-172 | navegar a refinado / extraer parte plegada / renombrar | **tres** listeners distintos para el mismo gesto |
| Contextmenu | seleccion.ts:180-216 | `window.dispatchEvent("opm:menu-contextual-estado"|"-enlace")` | contrato implícito con UI |

---

## 6. Layout, routing y canvas infinito

- **Dos motores de layout** (política W3.1, docs/render-headless.md): el de autoría
  (`autoria/layout.ts::aplicarLayoutCompleto`, fuera del área, usado por import/headless)
  y `canvas/layoutSugerido.ts` (botón “auto-layout” del canvas). Divergen por diseño.
- `layoutSugerido` caso A (in-zoom): contorno anclado cerca de (150, 90), internos en filas
  (bandas `ordenInzoom` si existen; si no, orden por **id** y grilla densa ≥6),
  externos clasificados entrada/salida por dirección de enlaces hacia {contorno ∪ internos},
  multi-columna cada 6. Clasificación interno/externo por **geometría O mismo tipo que el
  contorno** (layoutSugerido.ts:148-155) — heurística, pese a existir
  `Apariencia.contextoRefinamiento.rol`.
- Caso B: BFS por capas sobre procedimentales (o estructurales si no hay), cota
  Bellman-Ford contra ciclos, baricentro de entrantes, procesos al centro, grilla densa.
- Ruteo: procedimentales rectos (+jumpover); estructurales → post-pasada manhattan con
  obstáculos (opcloudRouting.ts). Tres funciones `routerManhattan` idénticas
  (composers/enlace.ts:782, agregacionBus.ts:397, opcloudRouting.ts:8).
- Canvas infinito (R-OPD-LAY-10): `fitToContent({allowNewOrigin:"any", padding:1800})`
  tras cada sync y compensación de scroll (`calcularAjusteScroll`); al cambiar de OPD se
  centra el bbox real (JointCanvas.tsx:529-561). `window.resize` ⇒ `fitCanvasAPantalla`
  (cambia el zoom del usuario).
- Coordenadas: tres sistemas simultáneos (scroll del viewport, `translate` del paper,
  `scale` del paper). `centrarSiFueraDeViewport` asume escala 1 (comentario JointCanvas.tsx:925-929).

---

## 7. Export y render headless

| Camino | Entrada | Pasos | Consumidores |
|---|---|---|---|
| PNG del OPD actual | paper **vivo** | serializa `<svg>` del DOM, regex quita `model-id="seleccion-*"` y `.joint-tools`, encuadre, colores, fondo, rasterizado | CommandPalette (`descargarOpdActualPng`), MapaSistema |
| ZIP de todos los OPDs | paper **offscreen** por OPD | proyección con selección nula + embed + ruteo + fit (sin sort ni sync de abanicos) | CommandPalette |
| SVG+PNG offscreen | igual al anterior | — | headless (`__opmRenderHeadless__`), PortableReaderPage, RevisionReader |

- Limpieza de chrome por regex sobre SVG serializado (mapaExport.ts:230-266).
- `normalizarColoresSvg` colapsa `rgba(...,1)` y preserva alfa real (sombra física) (mapaExport.ts:355-365).
- ZIP propio con CRC32 y método store; `deflateRaw` es la identidad (mapaExport.ts:473-535).
- Headless requiere Vite efímero + Chromium (Playwright) porque JointJS mide texto en DOM.

---

## 8. Contratos de datos que la reescritura debe respetar o migrar

### 8.1 Tipos del modelo consumidos (persistidos en JSON)

Citas textuales (`modelo/tipos/*.ts`):

```ts
// apariencia.ts
export interface PuertoApariencia {
  /** Coordenadas relativas 0..1 dentro del bbox de la apariencia. */
  x: number;
  y: number;
}
export interface Apariencia {
  id: Id; entidadId: Id; opdId: Id;
  x: number; y: number; width: number; height: number;
  modoTamano?: ModoTamano;
  modoPlegado?: ModoPlegado;            // "completo" | "parcial" | "plegado" | "desplegado"
  ordenPartes?: OrdenPartesPlegado;
  parteExtraidaDe?: { padreAparienciaId: Id; parteEntidadId: Id };
  contextoRefinamiento?: ContextoRefinamientoApariencia;
  /** Ports dinámicos OPCloud-style usados como puntos de conexión por enlace. */
  ports?: Record<Id, PuertoApariencia>;
  estadosSuprimidos?: Id[];
}

// enlace.ts
export interface ExtremoEnlace {
  kind: ExtremoKind;                    // "entidad" | "estado"
  id: Id;
  /** Port dinámico de la apariencia visible cuando el extremo es entidad. */
  portId?: Id;
}
export interface AnclajeSimboloEstructural { dx: number; dy: number; }
export interface AnclajesSimboloEstructural {
  refinable?: AnclajeSimboloEstructural;
  refinador?: AnclajeSimboloEstructural;
}
export type OffsetLabelEnlace = number | { x: number; y: number };
export interface PosicionLabelEnlace {
  /** Distancia JointJS sobre el path: 0..1 relativo o px si JointJS lo produce. */
  distance: number;
  /** Offset JointJS preservado tras arrastre manual del label. */
  offset?: OffsetLabelEnlace;
  angle?: number;
}
export interface AparienciaEnlace {
  id: Id; enlaceId: Id; opdId: Id;
  vertices: Array<{ x: number; y: number }>;
  /** Centro persistido del símbolo estructural OPCloud (triángulo/bus). */
  symbolPos?: { x: number; y: number };
  /** Offsets persistidos de los puertos del símbolo, relativos a symbolPos. */
  symbolAnchors?: AnclajesSimboloEstructural;
  /** Posiciones persistidas por rol visual de label, al estilo labels() OPCloud. */
  labelPositions?: Record<string, PosicionLabelEnlace>;
}

// estado.ts (campos visuales en el hecho semántico)
export interface Estado {
  id: Id; entidadId: Id; nombre: string;
  esInicial?: boolean; esFinal?: boolean; designaciones?: DesignacionEstado[];
  duracion?: DuracionTemporal; suprimido?: boolean;
  width?: number; height?: number; x?: number; y?: number;   // geometría de cápsula GLOBAL
  orden?: number;
}

// abanico.ts
export interface PuertoAbanicoExacto { entidadId: Id; lado: "origen" | "destino"; portId: Id; }
export interface Abanico {
  id: Id; opdId: Id; puertoComun: PuertoAbanicoExacto;
  puertoEntidadId: Id;                  // alias legacy
  operador: OperadorAbanico;            // "O" | "XOR"
  enlaceIds: Id[]; decision?: DecisionPolicy;
}

// opd.ts
export interface Opd {
  id: Id; nombre: string; padreId: Id | null; preguntaGuia?: string;
  apariencias: Record<Id, Apariencia>;
  enlaces: Record<Id, AparienciaEnlace>;
  vista?: OpdVista; ordenLocal?: number;
  ordenInzoom?: Id[][];                 // bandas de subprocesos paralelos; Y = tiempo
}
```

Observaciones de contrato (para migración):

1. **`PosicionLabelEnlace` persiste semántica de JointJS** (`distance` fracción 0..1 o px
   “si JointJS lo produce”, `offset` número o vector). Un renderer propio debe reproducir la
   interpretación: fracción ⇒ posición sobre la polilínea por longitud; px negativo ⇒ desde
   el final; `offset` número ⇒ desplazamiento perpendicular; vector ⇒ absoluto.
2. **Claves de `labelPositions`** (contrato estable, labelLayout.ts:3-17):
   `etiqueta`, `ruta`, `multiplicidad:origen`, `multiplicidad:destino`, `modificador`,
   `probabilidad`, `demora`, `tasa`, `tiempo:minimo`, `tiempo:maximo`, `requisitos`,
   `backwardTag`, `proxy:origen`, `proxy:destino`, `orden`.
3. **`ExtremoEnlace.portId` vive en el `Enlace` semántico** (global a todos los OPD) pero
   su posición vive en `Apariencia.ports[portId]` (por OPD). El id es determinista por
   enlace+lado (`modelo/operaciones/ports.ts:126`) o `port-anchor-<entidad>-<lado>-<ancla>`
   (ports.ts:267). Además la **identidad lógica del abanico depende de un portId**
   (`PuertoAbanicoExacto`). Geometría visual filtrada al hecho OPM: candidato a migrar a
   `AparienciaEnlace` (anclas por OPD) y a definir el abanico por extremo común
   (entidad+lado), no por puerto.
4. **`Estado.x/y/width/height` son globales**: mover una cápsula en un OPD la mueve en todos.
   Candidato a `Apariencia.estados?: Record<estadoId, rect>`.
5. `symbolPos`/`symbolAnchors` por `AparienciaEnlace`; en un bus se promedian los de todas
   las ramas (agregacionBus.ts:127, 240-279).
6. Anclas de conexión: `ANCLAS_RELOJ_ENLACE = ["N","NE","E","SE","S","SO","O","NO"]`
   (`modelo/anclajesEnlace.ts:3`) — 8, no 12 como dice R-OPD-UI-3.
7. Constantes de geometría canónica: cosa 135×60 (`modelo/constantes.ts:41-44`, hit-area
   enlace 15); `RESIZE_MIN 70×40` (`modelo/geometria.ts:1`); `INZOOM_CANON`
   (`modelo/constantesInzoom.ts`: padding sup. 100, inf. 65, gap 30, ancho ×3, mín. 3).

### 8.2 Contratos internos del render (a reemplazar, no preservar)

```ts
// proyeccionTipos.ts
export type OpmJointMetadata =
  | { kind: "entidad"; opdId; entidadId; aparienciaId; rol: "contorno"|"interno"|"externo";
      estadosInteractivos?: EstadoTarget[]; partesPlegadas?: Array<{ selector; entidadId }> }
  | { kind: "enlace"; opdId; enlaceId; aparienciaEnlaceId; tipo: TipoEnlace;
      enlaceIds?; aparienciaEnlaceIds?; segmentoTs3?: "entrada"|"salida";
      rolEstructural?: "refinable"|"rama"|"simbolo"; rolInvocacion?: "auto-salida"|"auto-retorno";
      ladoRefinable?: "origen"|"destino" }
  | { kind: "grupo-enlaces"; tipoGrupo: "estructural"; ...; refinableId; enlaceIds; aparienciaEnlaceIds; ladoRefinable }
  | { kind: "proxy-plegado" ... } | { kind: "overlay-abanico" ... }
  | { kind: "overlay-familia-preestado" ... } | { kind: "overlay-declaracion-no-nuclear" ... }
  | { kind: "imagen-overlay" ... } | { kind: "imagen-insignia" ... }
  | { kind: "selection-halo" ... } | { kind: "simulacion-halo" ... };
export interface JointCellJson { id: Id; type: "standard.Rectangle" | ... | "opm.AbanicoArc";
  opm: OpmJointMetadata; z: number; [key: string]: unknown; }
```

La **taxonomía** (qué piezas existen y a qué hecho pertenecen) sí es valiosa; su forma
(JSON JointJS + selectores string) no.

### 8.3 Contratos con UI y herramientas (preservar semántica, rediseñar forma)

- `JointCanvasProps`: `readonlyMode`, `feedbackPort.sincronizarBadgesDesdeAvisos`,
  `feedbackOverlays`, slots `renderMenuTipoEnlace(CanvasMenuTipoEnlaceSlotProps)` y
  `renderRenombradoInline(CanvasRenombradoInlineSlotProps)`, `onAdapterChange`
  (JointCanvas.tsx:55-85). Los slots son un buen patrón (render no importa UI concreta;
  test `renderUiBoundary.test.ts`).
- **Fuga**: `CanvasAdapterContext` entrega `dia.Paper` a UI; la UI usa `scale()`, eventos
  `scale transform resize`, `getCell(id).prop("opm")`, `findViewByModel().getBBox()`
  (`overlayCanvas/useBboxTracker.ts:74-89`). Contrato mínimo real: *bbox de pieza en coords
  de pantalla*, *zoom actual + suscripción*, *meta de pieza bajo un evento*, *serializar SVG*.
- Eventos `window`: `opm:menu-contextual-estado {estadoId, entidadId, aparienciaId, x, y}`,
  `opm:menu-contextual-enlace {enlaceId, x, y}` (seleccion.ts:199-215).
- Globales: `window.__opmJointAdapter` (debug/e2e), `window.__opmRenderHeadless__`
  (headless; `OpdRenderizado {opdId, nombre, orden, svg, pngBase64}`, headlessRender.ts:11-25).
- Atributos DOM que usan e2e/CSS: `joint-selector`, `model-id`, `.joint-element/.joint-link`,
  `data-opm-connect-anchor`, `data-opm-connect-state-id`, `data-estado-id`,
  `data-cap-rol="estado"`, `data-selected`, `data-dragging`, `data-opm-modo-enlace`,
  `data-opm-label-key`, `data-opm-sim*`, `data-opm-keyboard-connect`,
  `data-testid="rubber-band-seleccion"|"error-badge"|"overlay-canvas-layer"|"entidad-imagen-overlay"|"entidad-insignia-imagen"`.

---

## 9. Rendimiento

| Costo | Dónde | Magnitud |
|---|---|---|
| Re-proyección completa en cada cambio de modelo **y de selección** | JointCanvas.tsx:462-562 | O(cosas + enlaces) con muchos `Object.values(...).find` anidados (p. ej. `resolverEndpointVisual` itera apariencias para proxies) |
| `JSON.stringify` de toda la estructura para diffear | jointCanvasAdapter.ts:164 | O(tamaño JSON) por sync |
| `graph.resetCells` total (`async:false`) | jointCanvasAdapter.ts:167 | destruye y recrea todas las vistas SVG en cada click |
| Manhattan con obstáculos: `isPointObstacle` recorre todos los elementos por punto explorado | opcloudRouting.ts:24-31 | O(puntos × elementos) por enlace estructural |
| Permutación de terminales | sortStructuralLinks.ts:116-128 | hasta 7! = 5.040 permutaciones × re-render de enlaces × muestreo cada 12 px; por cada entidad, en cada sync |
| Re-geometría de abanicos leyendo LinkView | abanicoDragSync.ts:273-363 | por sync y por cada `change:position` durante drag |
| `validarModelo` completo en cada cambio de modelo (badges) | JointCanvas.tsx:264-266 → overlayCanvas/avisos.ts:136-157 | validación global en el hilo de render |
| DOM pesado: 8 anclas por cosa + 8 anclas + 5 nodos por estado siempre montados (opacity 0) | composers/entidad.ts:721-756, 788-805, 975-997 | objeto con 4 estados ≈ 63 nodos SVG |
| `useBboxTracker` por badge suscrito a 8 eventos del grafo | overlayCanvas/useBboxTracker.ts:45-72 | N suscripciones |
| Tokens de simulación con `setTimeout` por enlace ×3 | JointCanvas.tsx:570-611 | acotado |

Degradaciones ya presentes: jumpover → recto con >35 enlaces (proyeccion.ts:93);
sort solo 2..7 enlaces. No hay medición de rendimiento automatizada en el área.

---

## 10. Defectos latentes y divergencias (verificados por lectura)

### 10.1 [CONFIRMADO] Ramas `grupo-enlaces` inalcanzables: el triángulo compartido de un bus no se selecciona, no se arrastra ni recibe herramientas
`metadata()` (handlers/helpers.ts:18-27) solo devuelve `entidad | enlace | imagen-overlay |
imagen-insignia`. El triángulo de un bus tiene `opm.kind === "grupo-enlaces"`
(agregacionBus.ts:155-165). Todos los chequeos `meta?.kind === "grupo-enlaces"` pasan por
`metadata()`: `interactive().elementMove` (jointCanvasAdapter.ts:121-126 ⇒ `false`),
selección (seleccion.ts:174-177, 259-262), persistencia de posición (drag.ts:128-140),
herramientas de puertos (toolsSimboloEstructural.ts:28-35, 95-98), visibilidad
(JointCanvas.tsx:904-906). Resultado: con ≥2 partes de una agregación, el triángulo
central es inerte; `symbolPos` de buses nunca se escribe desde el canvas. (Relacionado con
GAP-OPD-DRAG-TRIANGULO.)

### 10.2 [CONFIRMADO por lectura] El auto-layout del canvas puede alterar el OPL temporal de un in-zoom sin `ordenInzoom`
Sin `ordenInzoom`, el OPL deriva la secuencia/paralelismo de la **Y** de los subprocesos
(`opl/generadores/refinamiento.ts:249-254` → `agruparSubprocesosParalelos`, tolerancia 4 px).
`layoutConContorno` ordena internos por **id** (layoutSugerido.ts:159) y con ≥6 internos
usa grilla de hasta 4 columnas (`filasInzoom` → `calcularGrillaDensa`, layoutSugerido.ts:654-663,
538-550) ⇒ subprocesos quedan en la misma fila ⇒ **paralelos** en OPL; y el orden por id
puede invertir la secuencia que el usuario tenía por Y. Una operación “ornamental” cambia
un hecho (R-OPD-REF-2, R-OPD-INV-2, R-OPD-BIM-3). El commit d94ee1f (2026-09-30) cubrió
solo el caso con `ordenInzoom` declarado. En la reescritura: el layout de in-zoom debe
partir de `derivarOrdenInzoomDeGeometria` (bandas actuales) y nunca crear/romper bandas.

### 10.3 [PLAUSIBLE] El rayo de invocación se pierde al editar vértices
El rayo (portador del tipo, R-OPD-TR-1/R-OPD-INV-1) solo se dibuja si `vertices.length === 0`
(composers/enlace.ts:799-802). La herramienta Vertices se instala para invocación
(toolsEnlace.ts:72-79, solo excluye `rolInvocacion`); arrastrar un vértice persiste una
polilínea arbitraria. `alinearEnlaces` (operacionesBatch.ts:504-521) y `nudgeEnlaces`
también escriben vértices. El rayo debe ser **decoración derivada** sobre la ruta, no la ruta.

### 10.4 [CONFIRMADO] Dos caminos de export con fidelidad distinta
- Offscreen (ZIP, headless, lector portable, revisión) omite `ordenarTodosLosEnlacesEstructurales`
  y `recalcularOverlaysAbanicoDesdeLinkViews` (mapaExport.ts:137-148 vs JointCanvas.tsx:493-508):
  arcos XOR/OR con geometría fría y terminales sin permutar. `docs/render-headless.md`
  afirma “cadena idéntica a la del canvas”.
- PNG del OPD actual usa el paper vivo: la limpieza por regex solo quita celdas
  `seleccion-*` y `.joint-tools`; **no** quita el underline embebido, los handles de resize,
  las anclas visibles de la selección única ni los `outline` del modo enlace
  (mapaExport.ts:235-238) ⇒ chrome UI en un artefacto canónico (R-OPD-CAN-3, V-227).

### 10.5 [CONFIRMADO] Hover imperativo pisa la proyección
`aplicarHoverOpl` (hoverOpl.ts:329-348) fija `body/fill` a `transparent` en toda entidad no
resaltada (incluido el contorno in-zoom cuyo fill proyectado es `rgba(250,250,248,.96)`) y
fija `line/strokeWidth` a `1,2` en el enlace seleccionado, anulando el `+2` de la proyección
(composers/enlace.ts:209). También escribe `body/strokeWidth` en links (attr inexistente).

### 10.6 [PLAUSIBLE] Inconsistencias menores
- `imagenOverlay` decide “hay estados visibles” con `!estado.suprimido` (solo global) y usa
  el tamaño de la apariencia, no el renderizado (composers/imagenOverlay.ts:38-46); la
  entidad usa supresión global ∧ local.
- `rectCapsulaEstado` usa `formatearNombreCompuesto(entidad)` sin opción de alias, la
  entidad lo calcula con `aliasVisible` ⇒ halos de estado pueden desalinearse con alias ocultos
  (composers/estados.ts:69 vs composers/entidad.ts:80-87).
- Glifos colisionan entre canales: `↗` = estado por defecto **y** badge de URL
  (entidad.ts:931, 1032); `?` = nota de mesa (`?N`) **y** drift no-resuelto (entidad.ts:1064, 534).
- Identificador `o.NN` definido pero siempre `display:none` (entidad.ts:153); la spec §2.2
  lo describe como visible. `identificadorCanonicoApariencia` solo se usa en tests.
- Spec vs código: 12 anclas (spec) vs 8; 8 handles (spec R-OPD-UI-3) vs 4 (entidad.ts:620-624);
  rayo “de 4 vértices” (spec §8.1) vs 2 en invocación normal y 4 en autoinvocación.
- Zoom: ±0,25 % por evento de rueda (zoom.ts:166-180; test lo fija) ⇒ ~190 muescas de
  1,0 a 1,6 con ratón; si el cursor no está sobre una celda el ancla es el centro del bbox,
  no el cursor (zoom.ts:141-164); `window.resize` re-encuadra y pierde el zoom del usuario.
- Marquee usa `apariencia.width/height` del modelo, no el tamaño renderizado (que crece
  con estados/texto) (canvas/seleccionMultiple.ts:84-110).
- `calcularEstadisticas` no cuenta excepciones y separa tagged de estructurales
  (canvas/mapa/estadisticas.ts:34-50).
- `pegarSeleccion` en el mismo OPD crea una **segunda apariencia de la misma cosa**; la
  proyección indexa `aparienciaPorEntidad` (una por entidad) ⇒ los enlaces solo se conectan a
  una (GAP-OPD-DUPLICADO) (operacionesBatch.ts:442-502; proyeccion.ts:94).

---

## 11. Sobreingeniería y acreción (ejemplos concretos)

1. **Proyección a JSON de un motor ajeno + post-proceso imperativo.** La proyección “pura”
   no determina el dibujo final: ruteo, orden de terminales, arcos y a11y se deciden después
   sobre el grafo vivo, leyendo `LinkView`. Consecuencias: export divergente, tests de
   proyección que no prueban el dibujo, dependencia de sufijos de id.
2. **Identidad por strings.** `id.endsWith("-refinable")`, `id.includes("triangulo") ||
   id.includes("ag-bus")` (`ag-bus` ya no existe) (opcloudRouting.ts:62-70,
   beautifyConnectedLinks.ts:326-358), `String(cell.id).endsWith("-triangulo")`
   (proyeccion.ts:383), regex de selectores `^resize-state(\d+)-(nw|ne|se|sw)$`
   (resize.ts:137), `stateCapsule${index}` recalculado en tres lugares.
3. **Pipeline de decoradores de markup.** `renderBase → ConAnchors → ConResize →
   ConSeleccion → ConEstereotipo → ConDrift` (entidad.ts:167-222), cada uno con
   `markupConX/attrsConX` espejo; `markupConBadge` y `markupConEstados` repiten la cabecera.
   `attrsConEstados` llama `attrsConBadge(...).foldBadge` y luego `aplicarMetadatosAttrs`
   vuelve a crear `foldBadge` si falta (entidad.ts:866, 1077-1091).
4. **Duplicaciones.** `extremo()`, `attrsLinea()`, `routerManhattan()`, `centro()`,
   `puntoPuertoElipse()` (3 copias), `clamp()`, `esSubprocesoInternoTimeline()` (2 copias),
   `limitarRectEstado` ≡ `limitarRectCapsulaALocal`, 5 funciones `etiquetaTexto*` casi
   iguales (enlace.ts:406-639, agregacionBus.ts:281-308, autoinvocacionLoop.ts:188-213),
   7 halos de simulación con la misma plantilla.
5. **Opciones y parámetros muertos.** `canalSeleccion` (declarado, normalizado y pasado,
   nunca leído); `hoverOplRef` de la proyección siempre `null`; `dashOverride = undefined`
   (enlace.ts:148, 211); `strokeWidth = strokeBase`, `strokeColor = stroke`,
   `dasharray = dasharrayBase`, `modeloRender = modelo` (alias sin función);
   `colorTextoParaFill` sobre fills que siempre son claros; `LINK_ASSETS.*.source/path/
   arrowPath/markerPath/logical`; `etiquetaBadgeModificador` y `textoModificador`
   (sin uso); `sincronizarCellsJointCanvasAdapter`, `dimensionesLayoutSugerido`,
   `familiaDeTipoEnlace`, `Posicion2D`, `ANCHORS_CONEXION` (solo tests o nada);
   `void modelo` en `exportarMapa` (mapaExport.ts:34).
6. **Capas de indirección.** `useJointCanvasViewModel → useZustandCanvasInteractionPort →
   componerCanvasInteractionPort(session, selection, command)` para luego espejar ≈35
   funciones en refs. `canvas/mapaSistema.ts` y `render/jointjs/mapaSistema.ts` son
   re-exports; `canvas/constantesInzoom.ts` re-export “de compatibilidad”.
7. **Capa equivocada.** `canvas/operacionesBatch.ts` es kernel de modelo (eliminar,
   purgar huérfanos, pegar, traer) viviendo en `canvas/`.
8. **Comentarios-bitácora.** Buena parte del volumen de `entidad.ts`, `enlace.ts`,
   `markers.ts`, `JointCanvas.tsx` son historias de bugs y rondas (“BUG-6ae261”,
   “CANON-V2 (ronda 28 L4)”, “Ronda 16 L2”). Valiosos como procedencia, ruido como código.
9. **Governance auto-referencial alrededor.** Tests que leen el propio código fuente como
   texto para prohibir imports (`renderUiBoundary.test.ts`) y gates que verifican frases en
   Markdown (`scripts/design-governance-audit.mjs:158-170`). La frontera útil (render no
   importa UI) se obtiene mejor con reglas de import de ESLint.
10. **Casts masivos.** ≈70 `as unknown as` en el área (29 en `modoEnlace.ts`, 13 en
    `helpers.ts`) para APIs de JointJS 3.x no tipadas (`fitToContent`, `scaleUniformAtPoint`,
    `off`, `el`, `findView`).
11. **Heurísticas OPCloud portadas con toda su superficie.** Ports dinámicos por enlace +
    “beautify” post-drag + permutación de terminales + manhattan con obstáculos reproducen el
    comportamiento de OPCloud/Rappid, no una necesidad OPM (la spec solo exige: recto para
    procedimentales, ortogonal para estructurales, centro+perímetro).

---

## 12. JointJS: ¿mantener, migrar a `@joint/core` 4, o SVG propio?

| Criterio | Mantener 3.7 | `@joint/core` 4 | SVG propio (Preact) |
|---|---|---|---|
| Dependencias | jquery+backbone+lodash+dagre+graphlib | sin jquery/backbone | ninguna |
| Tamaño | ≈420 KB core min + deps | menor | ≈10–20 KB propios |
| Fidelidad export = canvas | no (post-pasadas vivas) | igual problema | **sí por construcción** (mismo SVG) |
| Headless sin navegador | no (mide texto en DOM) | no | **sí para SVG** (métricas aproximadas ya usadas para dimensionar) |
| Ruteo manhattan con obstáculos | gratis | gratis | a construir (o simplificar a codo) |
| Text wrap | gratis (`textWrap`) | gratis | a construir (≈60 LOC con métrica por carácter / `measureText`) |
| Herramientas vértices/arrowheads | gratis | gratis | a construir (≈300 LOC) |
| Acoplamiento e2e (36 archivos) | intacto | bajo cambio | alto (reescribir selectores o emitir alias) |
| Riesgo de regresión visual | nulo | medio | alto sin golden SVG |

**Recomendación: SVG propio declarativo.** Razones:
1. Vocabulario cerrado (§4): rect, elipse, rountangle, 4 triángulos, piruleta, swallowtail,
   arpón, punta abierta, barras de excepción, arco, polilínea, texto. Nada exige un motor
   de diagramas genérico.
2. Casi toda la geometría no trivial **ya es TS puro**: dimensiones de estados/plegado,
   abanicos (`calcularGeometriaAbanicoDesdePuntos`), autoinvocación, zigzag, separación de
   símbolos, anclajes de símbolo, layout. Falta: intersección recta-rect/elipse (trivial,
   ya existe 3 veces), interpolación sobre polilínea para etiquetas y ruta ortogonal.
3. Elimina de raíz: `resetCells`, post-pasadas, lecturas de `LinkView`, casts, sufijos de
   id, doble export, `abanicoDragSync`, `sortStructuralLinks`, `beautifyConnectedLinks`,
   `customShapes`, `jointCanvasAdapter`, `toolsEnlace`, `toolsSimboloEstructural`.
4. Permite render headless del SVG en Bun (PNG opcional vía navegador).

Costo a asumir: ruteo estructural. Propuesta: tramo refinable→triángulo vertical/codo y
triángulo→refinadores como “peine” ortogonal (bus horizontal bajo la base + bajadas), que es
exactamente lo que el canon pide (vértice arriba, base a partes, R-OPD-LAY-9) y evita el
buscador de caminos. Obstáculos: solo desvío simple si el segmento cruza una cosa.

Si el horizonte es corto: migrar a `@joint/core` 4 **y** mover ruteo/abanicos/orden a la
proyección (geometría explícita en vértices), lo que igual elimina la mitad del lastre.

---

## 13. Arquitectura propuesta para la reescritura

```
modelo ──▶ escena(modelo, opdId, vista) : EscenaOpd          (puro, testeable, Bun)
             nodos:   {id, ref: {tipo, id}, forma, caja, estilo, estados[], badges[], rol}
             aristas: {id, ref, ruta: Punto[], marcas: {origen, destino}, decoraciones: rayo|arco|triángulo, etiquetas[{clave, texto, pos}]}
             simbolos:{id, tipo estructural, centro, puertos}
             overlays:{abanicos, tarjetas meta}
        ──▶ <OpdSvg escena capaUI={seleccion, hover, modoEnlace, simulacion}/>   (Preact, sin estado)
        ──▶ serializarSvg(escena) (export canónico = misma función sin capaUI)
interacción: un único controlador de pointer events sobre <svg> (hit-test por data-ref),
             máquina de estados explícita: idle | arrastrandoCosa | arrastrandoEstado |
             redimensionando | trazandoEnlace | editandoVertice | marquee | pan
             comandos → store (mismas acciones que hoy)
cámara:      viewBox (zoom/pan) en lugar de scroll+translate+scale
```

Principios: la **capa UI** (selección, handles, anclas, hover, feedback de modo enlace,
simulación) es un `<g>` separado que nunca entra al export; las anclas se montan solo en la
cosa bajo el cursor/seleccionada; hover y selección no invalidan la escena semántica
(memo por `modelo`+`opdId`); badges de validación como capa derivada perezosa.

---

## 14. Recomendación keep / simplify / cut por pieza

| Pieza | Rec. | Justificación |
|---|---|---|
| Catálogo de marcadores (`linkAssets` markers), triángulos, estilos Codex | **keep** | Valores normativos trazados por la spec |
| `composers/estados.ts` (dimensiones/rect de cápsulas) | **keep** | Pura, correcta, alineada a R-OPD-EST |
| `abanicoOverlay.ts` geometría | **keep** | Pura; alimentarla con la ruta real de la escena |
| `autoinvocacionLoop.ts` | **keep** | Pura; geometría canónica |
| `agregacionBus.ts` agrupación + separación de símbolos | **keep/simplify** | Regla OPM (un triángulo por refinable+tipo+grupo); dedup helpers |
| `labelLayout.ts` claves + `posicionLabelDesdeJoint` | **keep/simplify** | Claves persistidas = contrato; reinterpretar `distance/offset` sin JointJS |
| `composers/entidad.ts` | **simplify** | Mantener reglas; reemplazar pipeline de decoradores por un componente declarativo por cosa |
| `composers/enlace.ts` | **simplify** | Mantener reglas de marcas/etiquetas; un único constructor de etiqueta parametrizado |
| `composers/markers.ts` | **keep** (valores) / **cut** (celdas JointJS) | — |
| `composers/halos.ts` | **simplify** | Una función de halo por forma + tabla de estilos por tipo de runtime |
| `composers/plegado.ts`, `plegadoNesting.ts` | **keep** | Semi-plegado es única ley visual (R-OPD-STR-12) |
| `composers/imagenOverlay.ts` | **simplify** | Corregir visibilidad de estados; integrar como hijo de la cosa |
| `composers/colores.ts` | **cut** | Siempre ink |
| `proyeccion.ts` | **simplify** | Convertir en `escena()`; parámetros como objeto; eliminar `hoverOplRef` |
| `proyeccionTipos.ts` | **simplify** | Conservar taxonomía de piezas; eliminar forma JointJS |
| `proyeccionOpciones.ts` | **cut** | Opciones inline; eliminar `canalSeleccion` |
| `JointCanvas.tsx` | **simplify (reescribir)** | Controlador de interacción + cámara; sin refs espejo (leer store en el handler) |
| `jointCanvasAdapter.ts`, `customShapes.ts` | **cut** | Artefactos del motor |
| `opcloudRouting.ts` | **replace** | Ruteo ortogonal propio (peine) dentro de la escena |
| `sortStructuralLinks.ts` | **cut** | Ordenar refinadores por x del centro al construir el peine elimina cruces sin permutar |
| `beautifyConnectedLinks.ts` | **cut** | Con anclas por OPD calculadas en la escena no hace falta leer anchors del DOM |
| `abanicoDragSync.ts` | **cut** | La escena recalcula en drag (rAF) con la misma geometría |
| `familiaPreestadoOverlay.ts`, `declaracionesNoNuclearesOverlay.ts` | **simplify/move** | Contenido meta: mejor en panel lateral o capa meta plegable; si quedan en canvas, fuera del export `canon-diagrama` |
| `handlers/seleccion.ts` | **simplify** | Una tabla de precedencia; un solo manejador de doble click |
| `handlers/drag.ts`, `resize.ts`, `estadoGeometry.ts` | **simplify** | Máquina de estados de gesto; un solo clamp de cápsula |
| `handlers/modoEnlace.ts` + `canvas/modoEnlace.ts` | **simplify** | Conservar validación por firma, teclado y resolución por punto; feedback con canal UI reservado (cerrar GAP-OPD-FEEDBACK-LEGACY) |
| `handlers/toolsEnlace.ts`, `toolsSimboloEstructural.ts` | **replace** | Handles propios en capa UI; habilitar reanclaje de estructurales (GAP-OPD-DRAG-TRIANGULO) |
| `handlers/zoom.ts`, `gestosTouch.ts` | **simplify** | Zoom multiplicativo por muesca (~10 %), anclado al cursor, rango 0,2–3; no re-encuadrar en resize |
| `handlers/rubberBand.ts` | **keep** | Usar tamaño renderizado de la escena |
| `handlers/hoverOpl.ts` | **simplify** | Hover como estado de capa UI, no mutación de attrs |
| `mapaExport.ts` | **simplify** | Export = `serializarSvg(escena)`; ZIP: usar `CompressionStream` o mantener store honesto (renombrar `deflateRaw`) |
| `headlessRender.ts` | **simplify** | SVG sin navegador; PNG opcional |
| `overlayCanvas/*` | **keep/simplify** | Badges △ anclados; avisos calculados perezosamente (no `validarModelo` completo por render) |
| `mapa/proyeccion.ts`, `mapaSistema.ts`, `canvas/mapa/*` | **cut o simplify** | Duplica el árbol de OPDs; si se conserva, como SVG simple con tokens (no Arial/hex fijos) |
| `canvas/layoutSugerido.ts` | **simplify** | Mantener caso B; caso A debe preservar bandas actuales (§10.2) y usar `contextoRefinamiento.rol` |
| `canvas/operacionesBatch.ts` | **move** | A `modelo/operaciones`; revisar `purgarHuerfanos` (borra enlaces sin apariencia en ningún OPD) |
| `canvas/seleccionMultiple.ts`, `reglasTraer.ts`, `layoutRadial.ts`, `grid.ts` | **keep** | Puros, pequeños, útiles |
| `canvas/coloresCanon.ts`, `canvas/constantesInzoom.ts`, `canvas/mapaSistema.ts` | **cut** | Legacy/re-export |
| `jointjs.css` | **keep/simplify** | Renombrar a selectores propios; conservar `prefers-reduced-motion` |
| `renderUiBoundary.test.ts` | **replace** | Regla ESLint `no-restricted-imports` |

---

## 15. Piezas de alta calidad para portar casi tal cual

1. **`abanicoOverlay.ts`** — `calcularGeometriaAbanicoDesdePuntos`, `angulosExtremos`
   (mayor hueco angular, estable al cruzar 0/360), `puntoDockEnPuerto` (recta-elipse y
   recta-rect), `describeArc`. Geometría pura y correcta.
2. **`autoinvocacionLoop.ts`** — `loopAutoInvocacion` + `verticesInvocacionOpcloud`.
3. **`composers/estados.ts`** — `dimensionesConEstados`, `anchoCapsulaEstado` (compensación
   de designación), `rectCapsulaEstadoLocal` (manual + clamp), `ESTADOS`.
4. **`linkAssets.ts` (solo `marker`)** y **`composers/markers.ts`** — paths literales y
   topologías internas de triángulos.
5. **`agregacionBus.ts`** — `gruposEstructurales` (clave `tipo:refinable:grupoEstructuralId`,
   origen antes que destino), `separarCentroSimboloEstructural`, promedio de anclajes.
6. **`labelLayout.ts`** — claves estables, `posicionLabelDesdeJoint` (validación estricta),
   `anchoWrapEntreApariencias`.
7. **`canvas/layoutSugerido.ts` caso B** — BFS con cota anti-ciclo, baricentro, grilla densa.
8. **`canvas/layoutRadial.ts`**, **`canvas/seleccionMultiple.ts`**, **`canvas/reglasTraer.ts`**,
   **`canvas/grid.ts`** — pequeños, puros, con tests.
9. **`handlers/modoEnlace.ts`** — la lógica de resolución de destino por punto y la
   navegación por teclado (Tab a siguiente destino válido) son UX correcta y accesible.
10. **`mapaExport.ts`** — `normalizarColoresSvg` (preserva alfa semántico),
    `removerChromeEdicionSvg` como red de seguridad, `slugArchivo`, CRC32.
11. **`handlers/gestosTouch.ts`** — funciones puras de pinch/pan.
12. Patrón de **slots** del componente de canvas (menú de tipo y renombrado inyectados).

---

## 16. Riesgos y preguntas abiertas para las fases siguientes

- **Fidelidad visual**: sin golden SVG por construcción OPM, una reescritura no puede
  declarar paridad. Recomendación: generar fixtures “una construcción por archivo”
  (8 representaciones de cosa, 4 triángulos, TS1..TS5, H1/H2, IV1/IV2, EX1/EX2, XOR/OR,
  tagged uni/bi, plegado parcial, in-zoom) desde el sistema actual antes de reemplazarlo.
- **e2e**: 36 archivos dependen de clases JointJS. Decidir entre emitir alias compatibles
  (`class="joint-element"`, `model-id`, `joint-selector`) durante la transición o migrar
  a `data-opm-*`/`data-testid`.
- **Contrato persistido**: `PosicionLabelEnlace` (semántica JointJS), `ExtremoEnlace.portId`
  + `Apariencia.ports`, `Estado.x/y/w/h` global, `PuertoAbanicoExacto.portId`. Migrar
  requiere hidratación versionada (coordinar con dossier de serialización).
- **Spec acoplada al motor**: `spec-forja-opd-es` §2.2, §7.1, §11, §18 citan
  `standard.Polygon`, `refPoints`, `connectionPoint boundary`, `jumpover`. La reescritura
  debe preservar la **estructura** (normativa) y enmendar las trazas de realización.
- **Semántica temporal del in-zoom**: fijar como invariante de test que ninguna operación
  de layout cambia `agruparSubprocesosParalelos` de los internos cuando `ordenInzoom` falta.
- **Afiliación/esencia heredadas**: `esAfiliacionEfectivaAmbiental` (modelo) debe seguir
  siendo la única fuente del dash; no reimplementar en el render.
- **Contenido meta en canvas** (familias preestado, declaraciones no nucleares, notas,
  drift, estereotipos, imagen): decidir cuáles permanecen en el lienzo y cuáles pasan a
  paneles para aligerar el OPD y el export canónico.
- ¿Se conserva el **mapa del sistema** como vista? GAP-OPD-CATEGORIAS-OPD dice que no está
  realizado como OPD-con-metadato; hoy es una vista efímera duplicada del árbol.
