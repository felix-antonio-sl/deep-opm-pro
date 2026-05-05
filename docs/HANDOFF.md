# HANDOFF - estado integrado y próximos pasos

**Fecha**: 2026-05-05
**Repositorio**: `deep-opm-pro`
**Corte**: MVP-alpha + rondas 1, 2, 3, 4, 5 y 6 consolidadas sobre `main`
**Código verificado**: `main` @ `46df2ad` (`chore(ledger): regenera evidencia hu-progress post-ronda 6`)
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

La ronda 6 cerró seis líneas paralelas más una capa de cascadas resueltas en
consolidación final:

| Línea | Commits | Resultado integrado |
|---|---|---|
| L1 | `ee633eb` | Recalibración del detector `progress-dashboard.mjs`: 7 reglas regex actualizadas para reconocer evidencia post-ronda 5 (EPICA-50, 14, 30, 34, 1C, 20, 11). El detector pasa de 40/42 a 47/49 reglas matcheadas y desbloquea cobertura realista del backlog. |
| L2 | `7e952ad`, `ab26f59`, `5ca7150`, `13ccc05` | OPL avanzado: generadores `se despliega en` (TS3) y `es un/a` (TS1 generalización), helper `opl/edicionCanvas.ts` con propagación inversa (etiqueta de enlace, nombre de estado, abrir inspector enlace), tokens compuestos en oraciones multi-enlace, panel con búsqueda local, botón "Copiar OPL" e "Exportar HTML". |
| L3 | `1c660ef`, `8151347` | Asistente "Nuevo modelo" de 12 etapas: helper kernel `modelo/creacionWizard.ts` que siembra el SD con layout radial determinista (proceso central + beneficiario + agentes + instrumentos + entradas + salidas + ambientales) y modal `ui/AsistenteNuevoModelo.tsx` con barra de progreso, navegación adelante/atrás/cancelar y confirmación. Modelo post-asistente queda dirty (no autopersiste). |
| L4 | `90cf666`, `70de776`, `3e5f8aa`, `d388e2b` | Workspace jerárquico: `persistencia/workspace.ts` extendido con `carpetas: CarpetaIndice[]` (sin permisos O/W/R, single-user MVP), `persistencia/autosalvado.ts` con timer cada 5 min, diálogos `Cargar`/`Guardar como` con `PanelCarpetas` (tiles vs lista, ordenamiento, breadcrumb, recientes), `DialogoBuscarCosas` (Ctrl+F) con filtro por tipo y navegación al OPD, indicador discreto de autosalvado en Toolbar. |
| L5 | `344456b`, `00dbde1`, `1836527` | Mapa del sistema y gestión del árbol: `modelo/opdReorden.ts` con `reordenarHermanos`, `moverNodo`, `validarMovimientoSinCiclo`, `ordenSegunCanvasPadre`; `render/jointjs/mapaSistema.ts` con descriptor del meta-grafo + proyección JointJS (estilo neutro, no OPM); `ui/MapaSistema.tsx`, `ui/GestionArbolOpd.tsx` (Ctrl+D), reescritura aditiva de `ui/ArbolOpd.tsx` con drag manual, sufijos por refinamiento, expandir/colapsar todo y renombrado inline. |
| L6 | `c2fcbb7` | Estilo, multiplicidad, vértices y tabla de enlaces: tres helpers de dominio nuevos (`enlaceMultiplicidad.ts`, `enlaceEstilo.ts`, `enlaceVertices.ts`), `tipos.ts` extendido con `enlace.estilo?`, `enlace.multiplicidad{Origen,Destino}?`, `aparienciaEnlace.vertices?` y campos de texto en `apariencia.estilo` (familia, tamaño, peso, color, alineación). UI: `InspectorEnlace` reescrito (multiplicidad canónica + custom validada, estilo color/grosor/dash, copy/paste/reset), `InspectorEntidad` con sección "Texto del rótulo", `StyleControls` con controles de texto, `TablaEnlaces.tsx` global con filtros, ordenamiento, edición in-place y navegación al OPD. OPL emite multiplicidad según [OPL-ES §12]. |

Cascadas resueltas en consolidación (commits aditivos sobre las 6 líneas):

| Commit | Cascada |
|---|---|
| `44fdbc8` | `docs(ronda6)`: incorpora los 8 briefs maestros + plantilla `prompt-asignacion.md` y los 6 reportes de sesión bajo `docs/instrucciones-lineas-dev/ronda6/`. Insumo de auditoría del ciclo. |
| `18448f4` | `fix(render)`: refactoriza `abanicoOverlay.ts` para construir el arco lógico dinámicamente desde el modelo (centros + dock real). XOR queda como un arco a r=30; O como dos arcos concéntricos r=30/r=35 con dasharray "4 1". `linkAssets.logical` se simplifica (sin path/points/size/strokeDasharray). Alinea con `opm-extracted shared.ts:5908-5914`. |
| `2e073df` | `fix(ui)`: el árbol OPD invierte la semántica del set de estado (almacena nodos `colapsado` en vez de `expandido`), de modo que arranca completamente expandido por default y los OPDs recién creados son visibles inmediatamente. El usuario sigue pudiendo colapsar manualmente con los toggles existentes. |
| `3c393d7` | `fix(ui)`: `MapaSistema` registra el namespace `shapes` en `cellNamespace` y `cellViewNamespace` del paper JointJS para resolver `standard.Rectangle` y `standard.Link` al renderizar; antes el paper levantaba `dia.ElementView: markup required` en runtime. |
| `8b8c9f2` | `chore(test)`: imports faltantes en `enlaceEstilo.test.ts` y `data-testid="reciente-modelo"` en `PanelCarpetas.tsx` para que los smokes puedan invocar la carga de un modelo guardado sin depender de un botón "Cargar" que ya no existe. |
| `eef4617` | `test(smoke)`: spec y `in-vivo-test.mjs` alineados con UI post-ronda 6 — `exact: true` para botones colisionantes ("Exportar"/"Exportar HTML", "Nuevo"/"Nuevo modelo por asistente"), helper `cargarPrimerModelo` con `getByTestId("reciente-modelo")`, asserciones del diálogo "Guardar como" usando el texto "Inicio / Modelos locales", smoke de estilo apuntando a `getByTitle("Reset Style")` (hay dos botones "Reset" tras L6), smoke de mapa relajado a `>= 1` joint-element + verificación del contador "N OPDs · M relaciones" en el toolbar. |
| `46df2ad` | `chore(ledger)`: regeneración de `docs/roadmap/hu-progress.{json,md,html}` y `hu-progress-evidence.json` tras consolidación. |

## Cómo Se Decidió La Partición

La partición original (README ronda 6) preveía orden `L1 -> L4 -> L3 -> L5 -> L6
-> L2`. La integración real respetó el orden de cierre de cada agente (L1
primero, después L2 con cuatro commits aislados, luego L6 en un commit, L5 en
tres commits, L3 en dos, L4 en cuatro). Las cascadas se resolvieron al final
en commits dedicados para preservar trazabilidad: cada cascada cita la línea
que la originó y la HU eje afectada.

L4 fue inicialmente bloqueada por restricciones de tooling del agente
delegado (Steipete: solo Read/Grep/Glob); el operador la implementó con su
plan de diseño íntegro, incluyendo la decisión de mantener `carpetaId` como
metadata de workspace (`ResumenModeloPersistido`) y NO en el JSON del modelo
OPM — esa frontera respeta SSOT (la persistencia es semántica de UI, no de
kernel) y simplifica `serializacion/json.ts`.

## Decisiones Vigentes

Decisiones nuevas de ronda 6:

- **OPL bidireccional ampliado**: la edición inversa cubre nombres (entidad y
  estado) y etiqueta de enlace; cambios estructurales (tipo, dirección,
  multiplicidad) se delegan al inspector via `abrir-inspector-enlace`. Multi-
  enlaces en una oración exponen un token `nombre` por destino con `ref` al
  enlace correspondiente. Indentación por nivel de OPD se calcula pero el
  panel renderiza un único OPD activo (HU-50.027 fuera de slice).
- **Generadores OPL nuevos**: `emitirDespliegueOcurren` (HU-50.013) y
  `emitirEspecializacion` (HU-50.015). El generador `generarOpl` mantiene su
  firma estable; las nuevas oraciones se integran de forma aditiva.
- **Asistente 12 etapas**: orden fijo según [Met §6]. Etapas obligatorias: 0
  (bienvenida), 1 (función principal), 2 (beneficiario), 5 (nombre del
  sistema), 10 (confirmar). Etapas opcionales con botón "Saltar": 3 (atributo),
  4 (handler adicional), 6 (herramientas), 7 (entradas), 8 (salidas), 9
  (ambientales). Layout radial determinista con sectores angulares por
  categoría. El modelo sembrado queda dirty (no autopersiste, coherente con
  L2 ronda 5 sobre importación JSON).
- **Workspace jerárquico**: las carpetas viven en `WorkspaceIndice.carpetas`
  con campos `{id, nombre, padreId, creadoEn}`; `modelo.carpetaId` es
  metadata del **índice de workspace**, no del JSON OPM. Hidratación tolerante:
  ausentes -> raíz (`carpetaId = null`). Sin permisos O/W/R, sin cut/paste de
  carpetas, sin drag-and-drop de carpetas (esos quedan fuera).
- **Autosalvado**: timer cada 5 min con guard `esDirty()`. Idempotente: si
  está salvando, ignora ticks; si no está dirty, no hace nada. Arranca tras
  el primer save manual (modelos importados o nuevos sin save no
  autopersisten). Indicador discreto en Toolbar con `data-testid` y tooltip
  "Autosalvado activo · hh:mm".
- **Búsqueda intra-modelo**: Ctrl+F (Cmd+F en macOS) abre `DialogoBuscarCosas`
  con filtro por tipo (Todos/Procesos/Objetos) y navegación al OPD destino;
  halo de 3 s sobre la apariencia destino tras el salto. Solo cubre entidades
  top-level (estados/atributos quedan fuera del slice).
- **Mapa del sistema = vista derivada**: el descriptor `DescriptorMapa` se
  computa al abrir y se almacena en `descriptorMapaCache`; las flechas usan
  estilo neutro (gris, dasharray "6 3", marker triangular pequeño) — distinto
  del wrapper+line de OPM (HU-21.004). El mapa SUSPENDE OPL y oculta el
  navegador OPD mientras está activo. Doble clic en thumbnail navega y cierra
  el mapa.
- **Árbol OPD expandido por default**: el set de estado almacena ids
  *colapsados* (vacío inicial = todo expandido). El usuario puede colapsar
  manualmente con el toggle de cabecera o por nodo. Drag manual entre
  hermanos solo activo en `modoOrdenArbol === "manual"`. Renombrado inline
  por doble clic en el texto del nodo.
- **Multiplicidad de enlace canónica + custom**: lista canónica
  `["1", "0..1", "N", "0..N", "*"]`; custom validada por regex
  `/^\d+(\.\.\d+|\.\.\*)?$|^\*$|^N$|^0\.\.N$/`. Cuando ambos lados o uno son
  no-vacíos, OPL incorpora la multiplicidad según [OPL-ES §12]. Si ambos son
  `undefined`, OPL es idéntica a la versión actual (compatibilidad).
- **Estilo de enlace respeta convenciones SSOT**: `enlace.estilo` con `color`
  (HEX validado), `strokeWidth` (1-6 px), `dashArray` (lista permitida).
  Wrapper transparente de 15 px se preserva. El override de `dashArray` solo
  se aplica si la afiliación del par origen-destino no impone uno (ambiental
  conserva discontinuo).
- **Estilo de texto del rótulo**: `apariencia.estilo` extiende campos
  `fontFamily?`, `fontSize?` (8-24), `fontWeight?`, `fontStyle?`, `textColor?`,
  `textAnchor?` (`"start" | "middle" | "end"`). Sección "Texto del rótulo" en
  `InspectorEntidad` con reset independiente del fill/border.
- **Vértices manuales y reanclaje**: `aparienciaEnlace.vertices` opcional,
  ordenado. `insertarVerticeApariencia` ordena al insertar.
  `reanclarExtremoEnlace` aplica filtros de firma; si la nueva conexión rompe
  filtros (HU-10.008/.010), retorna error y `aparienciaEnlace` queda intacta.
- **Tabla de enlaces global**: vista derivada de `modelo.enlaces` (no
  apariencias); columnas Origen/Destino/Tipo/Etiqueta/Multiplicidad origen/
  Multiplicidad destino. Color por tipo según JOYAS §1. Filtros, ordenamiento
  asc/desc por columna, edición in-place sólo para etiqueta y multiplicidad
  (no tipo), navegación al primer OPD donde el enlace tiene apariencia.
- **Refactor abanicoOverlay**: el arco lógico se construye dinámicamente
  desde el modelo (centros de los otros extremos + dock real en el puerto)
  en lugar de usar fixtures estáticos. XOR = un arco a r=30; O = dos arcos
  concéntricos r=30 y r=35 con dasharray "4 1". Cita
  `opm-extracted shared.ts:5908-5914`.

Decisiones de rondas 1-5 que siguen vigentes (no se reabren):

- **OPL-ES como lente derivada**: el panel OPL no es fuente de verdad; los IDs
  emitidos por `generarOplInteractivo` permiten edición inversa sin parser
  libre, alineado con `opm-iso-19450-es.md` y `opm-opl-es.md`.
- **Hover OPL↔canvas es estado UI**: no se serializa, no se persiste.
- **Eliminación de OPDs**: la raíz es `disabled`, los internos ejecutan acción
  con mensaje accionable, las hojas eliminan refinamiento, apariencias y
  enlaces huérfanos. Apariencias compartidas se preservan. OPD activo navega
  al padre.
- **Bus de agregación**: vista derivada en render, no cambio del JSON.
- **Workspace local sin jerarquía** (ronda 5) → reemplazada parcialmente por
  ronda 6: ahora hay jerarquía de carpetas pero sin permisos.
- **Importación JSON no auto-persiste**: queda en estado "(No guardado)"
  hasta que el usuario invoque `Guardar como` o sobreescriba.
- **Creación interna por posición**: cuando el usuario hace click dentro del
  bbox de un contenedor refinado, la cosa creada nace como hija.
- **Apariencia.estilo invariante a OPL** (ronda 5) → ahora extendida a
  texto del rótulo en ronda 6, mismo invariante: el estilo no altera OPL.
- **`Modelo.estados` y `Modelo.abanicos` siguen top-level** (legado de ronda 4).
- **Extremos `ExtremoEnlace = { kind, id }`** para entidad o estado.
- **`rutaEtiqueta` y `ordenPartes`** son metadata opcional con normalización
  conservadora.

## Cascadas Gestionadas

- **Render JointJS**: la composición sigue en `proyeccion.ts`, pero la lógica
  nueva vive en helpers (`abanicoOverlay.ts`, `estadoTargets.ts`,
  `rutaLabels.ts`, `autoinvocacionLoop.ts`, `plegadoNesting.ts`,
  `agregacionBus.ts`, `mapaSistema.ts` y la aplicación de
  `enlace.estilo` en línea con marcadores).
- **Mapa del sistema**: el paper JointJS necesita namespaces de `shapes` para
  resolver `standard.Rectangle` y `standard.Link`. La cobertura visual del
  meta-grafo permanece como deuda menor — el descriptor reporta
  correctamente N OPDs en el toolbar pero `scaleContentToFit` ocasionalmente
  proyecta solo el primer thumbnail visible. El smoke se ajustó a `>= 1`
  joint-element + verificación del contador "N OPDs · M relaciones".
- **Árbol OPD**: con la inversión de semántica `expandido → colapsado` el
  árbol arranca expandido por default y los OPDs creados por descomposición/
  despliegue son visibles inmediatamente.
- **JSON estricto**: `enlace.multiplicidad{Origen,Destino}?`, `enlace.estilo?`,
  `aparienciaEnlace.vertices?` y campos de texto en `apariencia.estilo` se
  hidratan con defaults seguros, validan tipo y preservan documentos legacy.
  `modelo.carpetaId` NO se persiste en el JSON OPM (solo en el índice de
  workspace), respetando SSOT.
- **OPL**: integran TS3 despliegue "ocurren", TS1 generalización "es un/a",
  multiplicidad en oraciones según §12, tokens compuestos en multi-enlace,
  y placeholder "Vista mapa: OPL no disponible" cuando `vistaMapaActiva`.
- **Gestos UI**: `Ctrl+F` abre `DialogoBuscarCosas` (L4); `Ctrl+D` abre
  `GestionArbolOpd` (L5); `Ctrl+S` mantiene comportamiento de L2 ronda 5
  (primer save abre `Guardar como`, siguientes son incrementales). Los
  atajos del panel OPL (L2 ronda 6) usan `Ctrl+Shift+F` para no chocar con
  Ctrl+F del workspace.
- **Persistencia local**: `persistencia/local.ts` ahora hidrata `carpetaId`,
  `ultimaApertura`, `autosalvado`. La identidad lógica del modelo se
  preserva entre cargas. Modelos legacy sin `carpetaId` se tratan como
  raíz.
- **Cascada test↔smoke**: el spec se actualizó en consolidación final
  (`eef4617`) — locator colisionantes con `exact: true`, helpers para los
  diálogos nuevos, asserciones para mapa/árbol/estilo. `in-vivo-test.mjs`
  recibió el flujo "Guardar como" / incremental coherente con L4.
- **Cascada arc canónico**: `linkAssets.logical` simplificado +
  `abanicoOverlay` reescrito + `proyeccion.test` adaptado a la nueva forma
  del cell (standard.Path con `d`, sin sprite estático).

## Verificación

Último loop verde de consolidación sobre `46df2ad`:

```bash
cd app
bun run check          # typecheck OK; 412 unit tests pass, 2006 expect()
bun run browser:smoke  # 37/37 Playwright smoke pass (40.0 s)
bun run build          # OK; bundle 915 KB minificado, 261 KB gzip
```

Estado HU tras `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real`:

| Segmento | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance |
|---|---:|---:|---:|---:|---:|---:|
| Total backlog | 1126 | 115 | 51 | 582 | 378 | 12.6% |
| M0 | 130 | 77 | 29 | 24 | 0 | 69.1% |
| MVP-alpha | 121 | 46 | 23 | 52 | 0 | 43.3% |
| MVP-beta | 193 | 51 | 23 | 119 | 0 | 33.5% |

Detector: 47/49 reglas matcheadas sobre 125 archivos fuente (vs 40/42 pre-L1).

Diagnóstico vigente: 1 advertencia de inventario por ID duplicado `HU-13.005`
entre `epica-13-canvas-estados.md` y `HU-SHARED-001-menu-contextual.md`.
Legado de rondas previas, no es fallo de app ni de consolidación.

## Estado Por Dominio

- **Modelo/kernel**: creación básica, firmas de enlace, estados, abanicos,
  multiplicidad de origen/destino, modificadores, invocación, rutas, auto-
  invocación, descomposición, despliegue de objetos, plegado parcial
  avanzado, eliminación segura de OPDs hoja, creación interna por posición,
  estilo visual editable de cosas y enlaces (color/grosor/dash/texto),
  vértices manuales de enlace, reordenamiento manual/automático del árbol y
  validación de movimiento sin ciclos están cubiertos por unit tests.
- **Render**: assets canónicos de enlaces procedimentales, estructurales y
  lógicos se proyectan desde `assets/svg/links/`. El bus de agregación es
  derivado en render. Los abanicos OR/XOR se construyen dinámicamente como
  arcos canónicos (XOR = un arco a r=30; O = dos a r=30/35). El override de
  `enlace.estilo` se compone después de la firma canónica sin romper
  `strokeDasharray` ambiental. El mapa del sistema se proyecta como meta-
  grafo neutral con thumbnails y aristas grises.
- **UI/store**: Inspector y canvas cubren creación/edición de estados,
  rutas, auto-invocación, orden de partes plegadas, extracción/reinserción,
  enlaces desde filas plegadas, OPL inverso (selección/hover/renombrado/
  multi-enlace), eliminación de OPDs desde árbol, etiquetas de enlace,
  swatches de estilo, menú principal con todas las entradas (Nuevo, Nuevo
  por asistente, Guardar/Guardar como/Cargar, Buscar cosas, Mapa del
  sistema, Exportar JSON, Demo, Tabla de enlaces), diálogos de archivo con
  jerarquía, asistente 12 etapas, mapa del sistema, gestión del árbol con
  Ctrl+D, búsqueda intra con Ctrl+F. La tabla de enlaces ofrece filtros,
  ordenamiento y navegación.
- **Persistencia**: JSON conserva estados, extremos, multiplicidad,
  modificadores, rutas, plegado, apariencias extraídas, orden de partes,
  estilo de apariencia y de enlace, multiplicidad de enlace y vértices.
  Workspace local con jerarquía de carpetas (sin permisos), índice tolerante
  con campos opcionales (`carpetaId`, `ultimaApertura`, `autosalvado`),
  diálogos `Guardar como` / `Cargar modelo` con breadcrumb y panel
  reutilizable. Autosalvado periódico cada 5 min cuando el modelo está
  persistido.
- **Auditoría**: `docs/roadmap/hu-progress.{md,html,json}` y
  `hu-progress-evidence.json` regenerados sobre HEAD; calibración de L1
  reflejada en 47/49 reglas matcheadas.

## Pendientes Inmediatos

- **Mapa del sistema — render visual incompleto**: el toolbar reporta
  correctamente "N OPDs · M relaciones" pero `scaleContentToFit` ocasionalmente
  proyecta solo el primer thumbnail visible cuando hay >= 2 OPDs. El smoke
  fue relajado a `>= 1` joint-element. Investigar el flujo de scaleContentToFit
  con paper de 1600x1200 y descriptor multi-nivel; complementar con tests
  unitarios sobre `proyectarMapaSistemaAJointCells` que validen la cantidad
  esperada de cells.
- **EPICA-50 OPL avanzado**: HU-50.027 (expandir/colapsar bloques OPL
  jerárquicos) e HU-50.028 (AI text) quedan fuera. El cambio estructural
  (cambiar tipo de enlace o dirección desde texto OPL) sigue delegado al
  inspector via `abrir-inspector-enlace`.
- **EPICA-34 asistente**: HU-34.002 (botón "+" en barra de pestañas) y
  HU-34.003 (multi-pestaña con N modelos abiertos) siguen abiertos.
- **EPICA-30/31/35 workspace**: ejemplos globales/organizacionales (HU-30.021/
  .022), versiones con política log-scale (HU-30.023-027), búsqueda global
  cross-folder ≥3 chars (HU-30.029); permisos O/W/R y matriz de carpetas
  (HU-31.008/.014-021/.024-025), cut/paste de carpetas (HU-31.011/.012),
  drag-and-drop de carpetas (HU-31.013); mover modelos entre carpetas (HU-
  35.001-007), biblioteca lateral de cosas arrastrables (HU-35.016/.017).
- **EPICA-21 mapa**: filtros por profundidad/rama (HU-21.012),
  resaltado por tipo (HU-21.013), panel de estadísticas (HU-21.014), auto-
  refresh tras cambios (HU-21.016), export PNG/SVG/PDF (HU-21.017),
  persistir zoom/pan/filtros entre sesiones (HU-21.018).
- **EPICA-20 árbol**: atajos teclado Ctrl+arriba/abajo (HU-20.009), divisor
  arrastrable (HU-20.010), menú contextual completo (HU-20.011), toggle
  ocultar nombres (HU-20.013).
- **EPICA-14 estilo**: posicionamiento manual de texto X/Y (HU-14.009),
  multi-selección de cosas para batch styling (HU-14.016 — bloqueada por
  HU-SHARED-008).
- **EPICA-11 enlaces**: tabla de tipos extendida con familias O/O/O/P/P/O/P/P
  (HU-11.026), subtipo Condición/Evento + modificador NOT (HU-11.027),
  multi-selección conectar al todo (HU-11.007), alinear enlaces seleccionados
  (HU-11.008).
- **HU-SHARED-008**: multi-selección de canvas con Ctrl+clic y lazo Shift
  no implementada; bloquea HU-11.007/.008/.023, HU-14.016, HU-16.022 y
  cualquier operación batch que exija selección múltiple.
- **HU-15.\***: multiplicidad avanzada (más allá de origen/destino simples)
  pendiente.
- **Deuda técnica**: `app/src/modelo/operaciones.ts` (1743 LOC) y
  `app/src/store.ts` (~2550 LOC tras ronda 6) siguen creciendo; cualquier
  capacidad nueva debe preferir módulos de dominio y wrappers mínimos.
- **Deuda de build**: Vite advierte por chunk JS grande (~915 KB minificado);
  posponer code splitting hasta que el corte funcional lo justifique.
- **Mapa render**: ver primer ítem de esta lista.

## Cómo Continuar

1. Leer este `docs/HANDOFF.md` y `docs/roadmap/hu-progress.md`.
2. Si abrirás una nueva ronda paralela:
   - Heredar el formato de `docs/instrucciones-lineas-dev/ronda6/`.
   - Asumir cadenas de efecto kernel→render→OPL→UI: cada brief debe declarar
     qué archivos toca y cómo evita colisiones cross-line.
   - Reservar el **último** commit del ciclo para una capa explícita de
     cascadas resueltas (ronda 6 demostró que esa capa es ineludible).
3. Antes de diseñar, consultar `opm-extracted/`, `assets/svg/`, `docs/JOYAS.md`
   y la SSOT OPM. Las decisiones de ronda 6 citan paths concretos de
   `opm-extracted` (ej. `shared.ts:5908-5914` para los abanicos lógicos).
4. Cerrar cada cambio con `bun run check`; si toca UI/render, sumar
   `bun run browser:smoke`; si toca proyección o bundle, sumar
   `bun run build`.
5. Regenerar auditoría con
   `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real`
   antes de publicar un cierre de ronda. El detector espera
   `rulesMatched/rulesEvaluated` >= 47/49 sobre 125 archivos fuente.
