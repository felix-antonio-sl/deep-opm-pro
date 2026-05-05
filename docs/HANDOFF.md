# HANDOFF - estado integrado y próximos pasos

**Fecha**: 2026-05-06
**Repositorio**: `deep-opm-pro`
**Corte**: MVP-alpha + rondas 1, 2, 3, 4, 5, 6, 7 y 8 consolidadas sobre `main`
**Código verificado**: `main` @ `ff1a74f` (`refactor(ui): extrae subcomponentes de paneles e inspectores`) más cascadas de consolidación pendientes de commit (fix de mutación legacy en `store.test.ts` y recalibración del detector — incluidas en este handoff y comiteables como `chore(ledger)` + `fix(test)`).
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

La ronda 8 cerró seis líneas paralelas de **refactor estructural** sobre los
monolitos acumulados en rondas 1-7, sin cambiar APIs públicas ni comportamiento
observable. Cada barrel top-level se reduce a re-exports y la lógica vive en
slices/composers/generadores/sub-componentes por dominio:

| Línea | Commit | Resultado integrado |
|---|---|---|
| L6a | `905528f` | Code-splitting Vite + scaffolding del detector. `manualChunks` en `vite.config.ts` separa JointJS (`vendor-jointjs`), Preact (`vendor-preact`), Zustand (`vendor-zustand`), vendor general, y por feature: `feature-mapa`, `feature-asistente`, `feature-dialogos-pesados`, `feature-modales`. `App.tsx` carga lazy `MapaSistema`, `AsistenteNuevoModelo` y modales pesados con `<Suspense fallback={null}>`. Detector con scaffolding declarativo (55 reglas tolerantes a paths nuevos). |
| L3 | `c3f03ff` | Validadores de serialización por dominio. `serializacion/json.ts` baja de 877→134 LOC como barrel agregador; `validarEntidades.ts` (4.1k), `validarEstados.ts` (5k), `validarOpds.ts` (3.2k), `validarApariencias.ts` (5.9k), `validarEnlaces.ts` (11k), `validarHelpers.ts`, `validarGuards.ts`, `validarNormalizacion.ts`, `validarIntegridad.ts`. Roundtrip JSON lossless preservado; `json.test.ts` intacto. |
| L2 | `0c20047` | Composers de render por familia. `render/jointjs/proyeccion.ts` baja de 1382→146 LOC; `proyeccionTipos.ts` aloja `JointCellJson`, `OpcionesProyeccion`, `OpmJointMetadata`, `RolApariencia`. Composers nuevos: `entidad.ts` (14k), `enlace.ts` (14k), `markers.ts` (4.8k), `plegado.ts` (4k), `estados.ts` (3.5k), `halos.ts` (1.9k), `colores.ts` (1.1k). `proyectarModeloAJointCells`, `fijarOpcionesProyeccionGlobal`, `proyectarProxyExtraccion` quedan en el barrel. |
| L4 | `e145193` | Generadores OPL por familia. `opl/generar.ts` baja de 1031→135 LOC como orquestador; generadores nuevos: `procedural.ts` (13k), `refinamiento.ts` (12k), `refsHints.ts` (8.5k), `abanico.ts` (3.9k), `duracionMetadata.ts` (2.7k), `estructural.ts` (2.3k), `plegado.ts` (1.2k), `designaciones.ts`. Exports públicos preservados: `generarOpl`, `generarOplInteractivo`, `emitirDespliegueOcurren`, `emitirEspecializacion`. Procedural y refinamiento exceden objetivo blando de LOC pero respetan scope; declarado como deuda menor. |
| L5 | `ff1a74f` | UI grandes a sub-componentes. `PanelCarpetas.tsx` 829→257 LOC, `ArbolOpd.tsx` 698→296 LOC, `InspectorEntidad.tsx` 665→148 LOC, `InspectorEnlace.tsx` 715→164 LOC, `PanelOpl.tsx` 515→168 LOC. Sub-componentes nuevos en `ui/inspector/`, `ui/inspectorEnlace/`, `ui/arbol/`, `ui/panelCarpetas/`, `ui/panelOpl/`. Containers leen amplio del store; leaves reciben props/callbacks. `data-testid`, foco y propagación de eventos preservados. |
| L1 | `b188230` | Slices del store por dominio. `store.ts` baja de 4006→41 LOC como barrel; `tipos.ts` aloja `OpmStore`, `runtime.ts` aloja singletons `undoStack/redoStack/snapshotGuardado/UNDO_LIMIT/autosalvado`. Slices: `modelo.ts` (54k LOC fuentes, slice más grande), `seleccion.ts` (14k), `enlaces.ts` (15k), `workspaceMod.ts` (17k), `carpetas.ts` (13k), `uiPanel.ts` (17k), `mapa.ts` (12k), `persistencia.ts` (15k), `pestanas.ts` (8.8k, preexistente). Exports públicos preservados: `store`, `useOpmStore`, `OpmStore`. `modelo/operaciones.ts` (1743 LOC) explícitamente fuera de scope (congelado). |
| L6b | (consolidación) | Medición final del detector tras L1-L5. **55/55 reglas matched** sobre 249 archivos fuente (vs 45/49 sobre 159 archivos pre-ronda 8). Patrón nuevo: cada regla apunta directamente al slice/composer/generador/sub-componente donde reside el string evidenciado, sin pasar por el barrel reducido. |

Cascadas resueltas en consolidación (pendientes de commit):

| Cascada | Resolución |
|---|---|
| `app/src/store.test.ts:957` mutaba `store.getState().cargarDemo = () => {}` y nunca restauraba la función original. Pre-ronda 8 nunca afloraba porque solo `store.test.ts` consumía `cargarDemo`; L1 introdujo `enlaces.test.ts`, `mapa.test.ts`, `seleccion.test.ts` que también la consumen. Como Bun ejecuta `store.test.ts` (con punto, ASCII `.` = 0x2E) antes de `store/*.test.ts` (con `/` = 0x2F), el primer slice que consume `cargarDemo` veía la función no-op heredada del test legacy. | Reescrito el test legacy con `try/finally` que restaura `cargarDemoOriginal` al terminar. Solución mínima invasiva que preserva la intención del test (mockear `cargarDemo` como no-op) sin filtrar al resto de la suite. |
| Detector `progress-dashboard.mjs`: 31 reglas pendientes tras L1-L5 porque seguían apuntando a `app/src/store.ts`, `app/src/render/jointjs/proyeccion.ts`, `app/src/serializacion/json.ts`, `app/src/opl/generar.ts`, `app/src/ui/Inspector{Entidad,Enlace}.tsx`, `app/src/ui/PanelOpl.tsx` con strings que ya viven en slices/composers/generadores/sub-componentes. | Recalibradas 19 reglas a sus paths reales (`store/runtime.ts`, `store/modelo.ts`, `store/persistencia.ts`, `store/seleccion.ts`, `store/pestanas.ts`, `serializacion/validar*.ts`, `opl/generadores/*.ts`, `render/jointjs/composers/*.ts`, `ui/inspector/*.tsx`, `ui/inspectorEnlace/*.tsx`, `ui/arbol/*.tsx`, `ui/panelCarpetas/*.tsx`, `ui/panelOpl/*.tsx`). Barrels viejos quedan en `evidenciaExtra` para trazabilidad. Patrón: nada de comentarios señuelo en barrels — cada regla apunta a evidencia real. |

## Cómo Se Decidió La Partición

La partición se diseñó sobre evidencia OPCloud destilada en `opm-extracted/`:

1. **Slices Zustand por dominio (L1)**: inspirados en `model.service.ts` (190 LOC), `context.service.ts` (1037), `tabsService.ts` (130), `selectionConfiguration.ts` (65), `init-rappid.service.ts` (80) y `REFACTOR-NOTES.md:13-25`. Servicios Angular DI traducidos como `createStore<UnionDeSlices>` con composición explícita de funciones `(set, get) => ({...})`.
2. **Composers de render por familia (L2)**: inspirados en `models/DrawnPart/` con `OpmObject.ts:5-15`, `OpmEntity.ts:6-16`, `Links/AggregationLink.ts:33`, `Links/EffectLink.ts:117`, `Links/InvocationLink.ts:211`. Cada familia procedural/estructural tiene su archivo en OPCloud; nuestros composers replican el patrón.
3. **JsonModel concentra serialización (L3)**: `models/json.model.ts:6-611`. Aunque OPCloud lo tiene como clase única, internamente separa por tipo. Lo destilamos partiendo `serializacion/json.ts` en validadores por dominio.
4. **Módulos OPL por familia (L4)**: inspirados en `aliasing-module.ts:5-32`, `units-text-module.ts:5-32`. Cada módulo lógico aporta `getText()`. En nuestro stack, generadores por familia: estructural / procedural / designaciones / refinamiento / duración / abanico / plegado / metadata.
5. **Sub-componentes UI por sección (L5)**: inspirados en `models/components/commands/object-decider.ts:5-88` y deciders por tipo. Cada sub-componente del Inspector (Alias, URLs, Layout, Designaciones, Duración, Esencia, Refinamiento) y del InspectorEnlace (Multiplicidad, Estilo, Extremos, Ruta, Abanico, Reanclaje) es prop-driven y testable en aislamiento.
6. **Code splitting Vite (L6)**: inspirado en `REFACTOR-NOTES.md:21` y `README.md:56` — OPCloud tiene 16 chunks decompilados. JointJS aislado en chunk separado, modales/asistente/mapa lazy.

EPICA-70 (Importación OPCAT) y EPICA-91 (Modo tutorial) descartadas del proyecto desde 2026-05-05 — no se reabren.

## Decisiones Vigentes

Decisiones nuevas de ronda 8:

- **Barrel re-export como contrato público**: `store.ts`, `render/jointjs/proyeccion.ts`, `serializacion/json.ts`, `opl/generar.ts`, `ui/{PanelCarpetas,ArbolOpd,InspectorEntidad,InspectorEnlace,PanelOpl}.tsx` permanecen como ARCHIVOS PÚBLICOS TOP-LEVEL. Su contenido es importar de slices/composers/generadores/sub-componentes y re-exportar firmas públicas previas. Las APIs públicas no cambian. Los tests existentes pasan sin reescritura. Inspirado en el patrón OPCloud `class OpmModel extends BasicOpmModel` (`opm-extracted/src/app/models/OpmModel.ts:6-7`).
- **Slices Zustand con runtime singleton**: cada slice exporta una función `createXxxSlice(set, get)` que retorna `{...estado, ...acciones}`. El barrel `store.ts` compone los 9 slices en un único `createStore<OpmStore>`. `store/runtime.ts` aloja singletons compartidos (`undoStack`, `redoStack`, `snapshotGuardado`, `UNDO_LIMIT`, control de autosalvado) accesibles vía `obtenerEstadoStore()`/`setEstadoStore()`/`conectarRuntimeStore(api)`. Cada slice tiene su `.test.ts` aditivo.
- **Detector apunta a evidencia real, no a comentarios señuelo**: las reglas del progress-dashboard ahora apuntan al slice/composer/generador/sub-componente donde efectivamente vive cada string evidenciado. Nada de comentarios "Compat detector" en barrels reducidos. Los barrels viejos quedan en `evidenciaExtra` por trazabilidad. Patrón a sostener en rondas futuras.
- **Code splitting Vite con `manualChunks`**: vendor JointJS (468.96 KB / 129.38 KB gzip) en chunk separado; chunk principal 138.50 KB / 37.67 KB gzip (vs 1045 KB pre-ronda 8). Lazy chunks: `feature-asistente` (248 KB / 64 KB gzip), `feature-dialogos-pesados` (45.87 KB / 13.67 KB gzip), `feature-mapa` (13.82 KB / 4.67 KB gzip), `feature-modales` (10.88 KB / 3.81 KB gzip). `App.tsx` envuelve cargas lazy con `<Suspense fallback={null}>`. `mapaSistema.ts` queda en chunk principal porque el store lo consume síncrono (separarlo producía ciclo Rollup); la UI/export del mapa sí queda lazy.
- **Tests legacy se preservan, solo se corrige lo que afloró**: `store.test.ts:957` mutaba `cargarDemo` sin restaurar. Antes no fallaba porque solo `store.test.ts` lo consumía. L1 expuso el bug. La corrección es mínima: `try/finally` que restaura. No reescribir el test, no cambiar su intención.

Decisiones de rondas 1-7 que siguen vigentes (no se reabren):

- **OPL-ES como lente derivada**: el panel OPL no es fuente de verdad; los IDs emitidos por `generarOplInteractivo` permiten edición inversa sin parser libre.
- **Hover OPL↔canvas es estado UI**: no se serializa, no se persiste.
- **Eliminación de OPDs**: la raíz es `disabled`, los internos ejecutan acción con mensaje accionable, las hojas eliminan refinamiento, apariencias y enlaces huérfanos. Apariencias compartidas se preservan.
- **Bus de agregación**: vista derivada en render, no cambio del JSON.
- **Importación JSON no auto-persiste**: queda en estado "(No guardado)" hasta que el usuario invoque `Guardar como` o sobreescriba.
- **Creación interna por posición**: cuando el usuario hace click dentro del bbox de un contenedor refinado, la cosa creada nace como hija.
- **Apariencia.estilo invariante a OPL**: el estilo (incluido texto del rótulo) no altera OPL.
- **`Modelo.estados` y `Modelo.abanicos` siguen top-level** (legado de ronda 4).
- **Extremos `ExtremoEnlace = { kind, id }`** para entidad o estado.
- **Multiplicidad canónica + custom validada** (ronda 6).
- **Estilo de enlace** (ronda 6): `enlace.estilo` con color, strokeWidth, dashArray; wrapper transparente 15px preservado.
- **Vértices manuales y reanclaje** (ronda 6): `aparienciaEnlace.vertices` opcional; `reanclarExtremoEnlace` aplica filtros de firma.
- **Tabla de enlaces global** (ronda 6): vista derivada con filtros y ordenamiento.
- **Modelo post-asistente queda dirty** (ronda 6).
- **Workspace con jerarquía de carpetas** (ronda 6): extendida en ronda 7 con archivado, versiones y movimiento.
- **Árbol OPD expandido por default** (ronda 6): set almacena ids *colapsados*.
- **Mapa del sistema = vista neutra** (ronda 6): flechas grises dasharray "6 3", marker triangular pequeño; distinto de OPM.
- **Abanicos OR/XOR canónicos** (ronda 6 + refactor ronda 7): XOR = arco r=30; O = arcos concéntricos r=30/r=35 dasharray "4 1".
- **Multi-selección canónica** (ronda 7): `ui.seleccionados: Id[]` transitorio. Halo `#3DA8FF` 2px solo cuando `seleccionados.length>=2`. Vista mapa suspende multi-selección. Selección se vacía al cambiar de OPD o de pestaña.
- **Operaciones batch atómicas en undo** (ronda 7, HU-SHARED-002).
- **Modo barra creación sticky** (ronda 7, HU-11.001): la barra de creación no se cierra al crear; el modo se mantiene activo hasta Esc o cambio de herramienta. Cada creación entra como entry separado en undo.
- **Mapa del sistema = vista derivada extendida** (ronda 7): zoom `paper.scale` directo, persistencia `ui.mapa.{zoom,panX,panY,profundidad,subarbolRaiz,criterioResaltado,autoRefresh}` por modelo en `WorkspaceIndice.modelos[i].mapa`. Auto-refresh subscribe a `modelo.opds` con debounce 300ms; togglable.
- **Multi-pestaña sesión-only** (ronda 7): pestañas no se persisten. Refresh arranca con pestaña inicial vacía. `state.modelo` es espejo de la pestaña activa. `commitModelo` empuja al stack global compartido entre pestañas — undo per-pestaña queda como deuda explícita.
- **Bloques OPL jerárquicos** (ronda 7): `OracionOpl` propaga `opdId/opdNombre/profundidad`. Panel agrupa por OPD con chevrons. Estado de colapso es local del panel.
- **Workspace single-user MVP** (ronda 7): sin permisos O/W/R, sin matriz, sin propagación de lectura. `WorkspaceIndice.recientes: Id[]` obligatorio (max 10). Versiones opt-in por save manual. Movimiento preserva `versiones` (HU-35.005). Cut/paste caduca a 5 minutos. Búsqueda global ≥3 caracteres. Drag-drop usa API HTML5 nativa.
- **Designaciones de estado** (ronda 7): Default y Current **mutuamente excluyentes** (HU-13.013 Q13.2). Inicial y Final **coexisten** (HU-17.033). Default y Current son **únicos por entidad**. `suprimirEstado` requiere ausencia de enlaces incidentes.
- **Alias, unidad, descripción, URLs** (ronda 7): campos opcionales en `entidad.*`. Alias va siempre en OPL tras primera mención. URLs tipadas {imagen, video, articulo, texto, oslc} con validación laxa.
- **Duración canónica del estado** (ronda 7): `{unidad, min, nominal, max}` con validación `min ≤ nominal ≤ max`.
- **Plegado parcial persistido** (ronda 7): `apariencia.modoPlegado` opcional. OPL trunca a 3 partes inline + "y N partes más".
- **Atajos centralizados** (ronda 7): registry único en `ui/atajosTeclado.ts` con `escucharGlobal()`. Modal abierto consume sus propios atajos antes que el registry.
- **Divisor árbol/canvas** (ronda 7): ancho persistido en `WorkspaceIndice.preferenciasUi.anchoPanelArbol`, clamp [160, 600] px.
- **Toggle ocultar nombres del árbol** (ronda 7): nodos muestran solo `SDn`/`SDn.m` cuando `ui.nombresArbolVisibles === false`.
- **Diálogos custom con captura** (ronda 7): `Dialogo.tsx` registra Escape/Tab en captura con `stopImmediatePropagation`. Tab focus trap nativo.
- **Política de handoff único**: este archivo reemplaza completamente al anterior; sin handoffs paralelos.

## Cascadas Gestionadas

- **Mutación legacy de `cargarDemo` en `store.test.ts`** (introducida pre-ronda 8): contenida con `try/finally`. No se cambia la intención del test, solo se restaura el state al terminar.
- **Detector descalibrado por barrel reducido**: 19 reglas redirigidas a slices/composers/generadores/sub-componentes apropiados. 55/55 reglas matchean ahora. Patrón documentado: el detector apunta a evidencia real, los barrels viejos quedan como `evidenciaExtra`.
- **`tipos.ts` global** sigue sin tocarse en ronda 8 (decisión: no romper firmas cross-modulo). El nuevo `app/src/store/tipos.ts` aloja solo `OpmStore` y tipos store-locales.
- **`JointCanvas.tsx`** (697 LOC) sigue sin partir; se difiere a ronda 9. Composers/slices estabilizados en ronda 8 le dan piso para una L1 segura.
- **`AsistenteNuevoModelo.tsx`** sigue sin partir; difiere.
- **`modelo/operaciones.ts`** (1743 LOC) sigue congelado por doctrina; cualquier ronda que lo aborde necesita worktree dedicado.

## Verificación

Loop verde de consolidación de ronda 8 sobre `main` @ `ff1a74f` + cascadas:

```bash
cd app
bun run check          # typecheck OK; 558 unit tests pass / 2357 expects (vs 481/2206 base ronda 7)
bun run browser:smoke  # 40/40 Playwright smoke pass (46.5 s)
bun run build          # OK
cd ..
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

Bundle generado:

| Chunk | KB minificado | KB gzip |
|---|---:|---:|
| `index-*.js` (chunk principal) | 138.50 | 37.67 |
| `vendor-jointjs-*.js` (lazy) | 468.96 | 129.38 |
| `feature-asistente-*.js` (lazy) | 248.09 | 64.49 |
| `vendor-*.js` | 134.37 | 47.14 |
| `feature-dialogos-pesados-*.js` (lazy) | 45.87 | 13.67 |
| `vendor-preact-*.js` | 19.86 | 7.91 |
| `feature-mapa-*.js` (lazy) | 13.82 | 4.67 |
| `feature-modales-*.js` (lazy) | 10.88 | 3.81 |
| `vendor-zustand-*.js` | 0.34 | 0.25 |
| `vendor-jointjs-*.css` | 46.28 | 32.49 |

Chunk principal pasa de 1045 KB minificado / 295 KB gzip (pre-ronda 8) a **138.50 KB / 37.67 KB gzip** (objetivo: <600 KB / <240 KB; superado por mucho). Total razonable.

LOC barrels finales (objetivos cumplidos):

| Barrel | LOC | Objetivo | Tope | Estado |
|---|---:|---:|---:|---|
| `app/src/store.ts` | 41 | <500 | <1500 | ✓ |
| `app/src/render/jointjs/proyeccion.ts` | 146 | <200 | <600 | ✓ |
| `app/src/serializacion/json.ts` | 134 | <200 | <400 | ✓ |
| `app/src/opl/generar.ts` | 135 | <200 | <500 | ✓ |
| `app/src/ui/PanelCarpetas.tsx` | 257 | <150 | <350 | dentro de tope |
| `app/src/ui/ArbolOpd.tsx` | 296 | <150 | <300 | dentro de tope |
| `app/src/ui/InspectorEntidad.tsx` | 148 | <150 | <300 | ✓ |
| `app/src/ui/InspectorEnlace.tsx` | 164 | <150 | <300 | dentro de tope |
| `app/src/ui/PanelOpl.tsx` | 168 | <150 | <200 | dentro de tope |

Estado HU tras `--sync-real` final:

| Segmento | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance |
|---|---:|---:|---:|---:|---:|---:|
| Total backlog | 1126 | 168 | 51 | 529 | 378 | 16.6% |
| MVP-alpha | 121 | 48 | 23 | 50 | 0 | 46.3% |
| MVP-beta | 193 | 47 | 23 | 123 | 0 | 32.6% |
| M0 | 130 | 73 | 29 | 28 | 0 | 65.8% |

Detector: **55/55 reglas matched** (vs 45/49 pre-ronda 8) sobre 249 archivos fuente (vs 159). Las reglas reflejan ahora la estructura real del código tras L1-L5: barrels reducidos no son evidencia, los slices/composers/generadores/sub-componentes sí lo son.

Diagnóstico vigente: 1 advertencia de inventario por ID duplicado `HU-13.005` (legado de rondas previas, no es fallo de app).

## Estado Por Dominio

- **Modelo/kernel**: creación básica, firmas de enlace, estados con designaciones canónicas (Inicial/Final/Default/Current con exclusiones), abanicos, multiplicidad canónica + custom, modificadores, invocación, rutas, auto-invocación, descomposición, despliegue, plegado parcial persistido, eliminación segura de OPDs hoja, creación interna por posición, alias/unidad/descripción/URLs en entidad, duración temporal en estados, supresión de estados sin enlaces, layout horizontal/vertical de estados, estilo visual editable de cosas y enlaces, vértices manuales y reanclaje. Helpers de dominio modulares en `modelo/objetoMetadata.ts`, `estadosDesignaciones.ts`, `objetoDuracion.ts`, `enlaceMultiplicidad.ts`, `enlaceEstilo.ts`, `enlaceVertices.ts`, `opdReorden.ts`, `opdEliminacion.ts`, `creacionWizard.ts` (asistente 12 etapas).
- **Render**: assets canónicos de enlaces. Bus de agregación derivado en render. Abanicos OR/XOR como arcos canónicos r=30/r=35. Override de `enlace.estilo` se compone después de la firma sin romper dasharray ambiental. Mapa del sistema completo: meta-grafo neutro, filtros, resaltado por tipo, marcadores activo/visitado, tooltip, zoom Ctrl+rueda, pan persistente, export PNG/SVG cliente-side. Render compuesto `Nombre [Unidad] {alias}`, badges 📄/🔗, marcadores V-4/V-5/V-6 sobre cápsulas. Halo de selección múltiple `#3DA8FF`. **Composers ronda 8**: `entidad`, `enlace`, `markers`, `plegado`, `estados`, `halos`, `colores` separados; `proyeccion.ts` queda como barrel.
- **OPL**: lente derivada con generación bimodal (texto + interactiva con IDs). Cada familia OPL en su archivo de generador (procedural, refinamiento, estructural, designaciones, duración/metadata, abanico, plegado). `refsHints.ts` aloja referencias y hints compartidos. Truncado plegado parcial "y N partes más" desde `UMBRAL_PARTES_MAS`. **Generadores ronda 8**: separados; `generar.ts` queda como orquestador.
- **UI/store**: Inspector con secciones nuevas (Descripción/Alias/Unidad/URLs/Layout/Designaciones/Duración/Suprimir) en sub-componentes `ui/inspector/*.tsx`. InspectorEnlace con secciones (Multiplicidad/Estilo/Extremos/Ruta/Abanico/Reanclaje) en `ui/inspectorEnlace/*.tsx`. ArbolOpd con NodoOpd + handlersTeclado + togglesArbol en `ui/arbol/`. PanelCarpetas con Tile + MenuContextual + Breadcrumb + handlersDragDrop en `ui/panelCarpetas/`. PanelOpl con RenderToken + Bloques en `ui/panelOpl/`. Modal: ModalUrlsObjeto, ModalDuracionEstado, Cheatsheet de atajos. BarraPestanas con N pestañas independientes session-only. DivisorPanel entre árbol y canvas. Registry central de atajos `ui/atajosTeclado.ts`. **Slices store ronda 8**: `modelo`, `seleccion`, `enlaces`, `workspaceMod`, `carpetas`, `uiPanel`, `mapa`, `persistencia`, `pestanas`. Runtime singleton en `store/runtime.ts`. Tipos públicos en `store/tipos.ts`.
- **Persistencia**: JSON conserva todos los campos OPM (`entidad.alias/unidad/descripcion/urls/layoutEstados`, `estado.designaciones/duracion/suprimido`, `apariencia.modoPlegado/ordenPartes`, `modelo.archivado/archivadoEn/versiones`). Workspace local con jerarquía de carpetas, sin permisos, índice tolerante con `recientes: Id[]` obligatorio (max 10), `mapa` por modelo, `preferenciasUi` global. Versiones por save manual. Movimiento de modelos y carpetas con cut/paste y drag-drop; caducidad 5 minutos. Búsqueda global ≥3 caracteres. Autosalvado 5 min con guard `esDirty()`. **Validadores ronda 8**: separados por dominio en `serializacion/validar*.ts`; `json.ts` queda como barrel.
- **Auditoría**: `docs/roadmap/hu-progress.{md,html,json}` y `hu-progress-evidence.json` regenerados sobre `main` + cascadas. **Detector calibrado a estructura real**: 55/55 reglas matchean.

## Pendientes Inmediatos

- **Comitear cascadas de consolidación ronda 8**: cambios pendientes en `app/src/store.test.ts` (fix `cargarDemo` legacy), `docs/historias-usuario-v2/tools/progress-dashboard.mjs` (recalibración de 19 reglas), `docs/roadmap/hu-progress.{json,html,md}`, `docs/roadmap/hu-progress-evidence.json`. Comiteables como `fix(test)` + `chore(detector)` + `chore(ledger)`. Este HANDOFF también queda commiteable.
- **`render/jointjs/JointCanvas.tsx`** (697 LOC): partir en handlers (selección, zoom, pan, rubber band, Esc/Delete/flechas, drag halos). Riesgo medio: handlers JointJS son frágiles. Composers L2 estabilizados en ronda 8 dan piso. Candidato L1 ronda 9.
- **`ui/AsistenteNuevoModelo.tsx`** (~785 LOC): asistente 12 etapas. Refactor cabe pero alto blast (formularios, validaciones por etapa, transiciones). Diferido pero no bloqueante.
- **`modelo/operaciones.ts`** (1743 LOC): congelado. Cualquier ronda 9 que lo aborde necesita worktree dedicado y tests verde antes y después.
- **`store/modelo.ts`** (~1622 LOC): slice más grande tras ronda 8. Acumula la mayoría de operaciones del modelo + acciones cabeceras. Si crece más, candidato a partir en sub-slices (acciones-modelo / acciones-OPD / acciones-render-asistido / hooks-OPL). Bajo blast porque las acciones son funciones puras que llaman a `modelo/operaciones.ts`.
- **Multi-pestaña — undo per-pestaña** (deuda ronda 7): el stack undo es global compartido entre pestañas; cada pestaña sí posee modelo independiente. Migrar a undo per-pestaña requiere envolver `commitModelo` para empujar al `historialUndo` de la pestaña activa (~50 acciones).
- **Mapa render — export PDF**: HU-21.017 PDF queda diferida por regla "no introducir dependencias nuevas". Reabrir si se aprueba `jspdf` o `pdf-lib`.
- **EPICA-17 slot de valor numérico**: HU-17.014/.015-017 (`valueSlot.*`) requiere kernel separado para "atributo numérico".
- **EPICA-11 tabla de tipos extendida + Condición/Evento/NOT**: HU-11.026/.027 requiere kernel `enlace.subtipo` y `enlace.modificadorNot`.
- **EPICA-15 multiplicidad avanzada**: HU-15.* más allá de origen/destino simples sigue pendiente.
- **EPICA-19 imágenes incrustadas**: 16 HU pendientes; podría lanzarse como línea independiente.
- **EPICA-1A grid + snap + alineación**, **EPICA-1B traer conectados**: pendientes de MVP-β.
- **EPICA-32 sub-modelos**, **EPICA-33 plantillas**: pendientes MVP-γ.
- **EPICA-60 export PDF**, **EPICA-61 export SVG papel**: requieren librerías o cliente-side avanzado.
- **EPICA-71 CSV import**: pendiente; coordina con campos de `entidad`.
- **EPICA-80-82** (config usuarios/defaults estilo/ontología organizacional): diferidas a MVP-γ/δ.
- **EPICA-A0-A2** (estereotipos / requisitos / IA): diferidas.
- **EPICA-B0-B5** (simulación), **EPICA-C0-C2** (runtime), **EPICA-D0-D1** (análisis): diferidas a MVP-δ.
- **EPICA-40, 41, 42** (colaboración multi-usuario, chat, notas): diferidas por single-user MVP.

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
   - Heredar el formato de `docs/instrucciones-lineas-dev/ronda8/`.
   - Asumir cadenas de efecto kernel→render→OPL→UI.
   - Reservar el **último** commit del ciclo para una capa explícita de cascadas resueltas. Rondas 6, 7 y 8 demostraron que esa capa es ineludible (mutaciones legacy en tests, recalibración del detector, ajustes de imports cuando los barrels se reducen).
   - Si hay refactor estructural, recalibrar el detector ANTES de cerrar la ronda, no después. Cada barrel reducido con strings en archivos hijos requiere actualizar reglas; el patrón ronda 8 es: nada de comentarios señuelo, solo paths reales.
3. Antes de diseñar, consultar `opm-extracted/`, `assets/svg/`, `docs/JOYAS.md` y la SSOT OPM. Las decisiones de ronda 8 citan paths concretos en briefs `docs/instrucciones-lineas-dev/ronda8/`.
4. Cerrar cada cambio con `bun run check`; si toca UI/render, sumar `bun run browser:smoke`; si toca proyección o bundle, sumar `bun run build`.
5. Regenerar auditoría con `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real` antes de publicar un cierre de ronda. **Ronda 8 cerró 55/55 reglas; tras ronda 9 mantener ≥55/N reglas (N puede crecer si la ronda agrega reglas nuevas).**
