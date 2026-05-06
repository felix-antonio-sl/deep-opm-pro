# HANDOFF - estado integrado y próximos pasos

**Fecha**: 2026-05-06
**Repositorio**: `deep-opm-pro`
**Corte**: MVP-alpha + rondas 1-9.5 + ronda 10 (5 líneas de features) + recalibración detector ronda 10 consolidadas sobre `main`
**Código verificado**: `main` tras ronda 10 + recalibración — 5 features aditivas integradas + 17 reglas nuevas en detector.
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

La **ronda 10** marcó el cambio de paradigma: tras dos rondas de **refactor
estructural** (8 y 9 + 9.5 cierre de deuda residual), la ronda 10 fue la
**primera ronda de features puros post-MVP-α**. Cinco líneas paralelas
aditivas: L1 grid + snap + auto-tamaño + alineación, L2 modificadores
avanzados de enlace + mover puerto + advertencia de consumo duplicado,
L3 descomposición avanzada (timeline, paralelo, ambiental, renombrado inline),
L4 imágenes incrustadas single-user con overlay separado, L5 cierre
transversal MVP-α + OPL polish (búsqueda, copiar, exportar, dirty dialog,
extraer todas las partes). Cambio categórico de **funtor faithful**
(preservación) a **funtor extensión** (agrega objetos y morfismos sin
romper la API previa). Aditividad estricta: tipos opcionales, exports
nuevos, ningún rename ni rotura de contrato. Adjunción libre/olvido
preservada.

| Línea | Resultado integrado | HU cerradas |
|---|---|---:|
| L1 | EPICA-1A completa: `canvas/grid.ts` con `GridConfig` + `cuantizarPosicion`; `composers/grid.ts` con drawGrid nativo JointJS; `handlers/resize.ts` con handles esquina; `Apariencia.modoTamano?` aditivo; `operacionesBatch.alinearPorEje` + `distribuirUniformemente`; `redimensionarApariencia` + `ajustarAlTexto` + `volverAAutoTamano` + `alternarModoTamano` en `operaciones/apariencias.ts`; `PreferenciasUiUsuario.gridConfig?` persistente; Toolbar Grid/Alinear/Distribuir; `ModalConfiguracionGrid` + `SeccionTamano`. Tres smokes nuevos. | 18 |
| L2 | Modificadores avanzados completos: `Enlace.subtipoModificador?: "C"\|"E"\|"no"` aditivo; badges canónicos `C`, `E`, `¬` en `composers/markers` con fallback desde `modificador` legacy; OPL probabilidad porcentual `(probabilidad: 70%)`; `moverPuertoEnlace` con opción remover; `DialogoMoverPuerto`; cableado en `SeccionExtremos`; `advertirConsumoDuplicado` expuesto sobre regla preexistente. Cuatro smokes nuevos. | ~10 |
| L3 | Descomposición avanzada: drag vertical reordena timeline; reasignación manual de enlaces externos derivados desde `SeccionRefinamiento`; `agruparSubprocesosParalelos` por tolerancia Y ≤ 4px; `oracionParalelo()` emite "X y Y ocurren en paralelo."; clamp de internos ambientales con `validarAmbientalDentroContorno`; `RenombradoInline` reusable. Cuatro smokes nuevos. | ~7 |
| L4 | EPICA-19 single-user: `Entidad.imagen?: { url, modo, cache? }` aditivo (cache transitorio NO se serializa); `imagenObjeto.ts` con validadores; `composers/imagenOverlay.ts` separado del composer base; insignia 📷 con click alternar modo + context-menu abrir modal; modo global de visualización (toolbar); supresión de bitmap si la entidad tiene refinamiento; exclusión mutua imagen/estados visibles; OPL invariante (HU-19.015). `ModalImagenObjeto` + `SeccionImagen`. Tres smokes nuevos. | ~13 |
| L5 | Cierre MVP-α: `extraerTodasLasPartesDePlegado` + botón "Extraer todas" en `SeccionRefinamiento`; PanelOpl con búsqueda/copiar/exportar testids + filtro por búsqueda; `DialogoConfirmacion` Guardar/Descartar/Cancelar al cerrar pestañas dirty; `buscarEnPanelOpl` + `extraerTodasLasPartesSeleccionadas` en store. Nueve smokes nuevos. | ~12 |

**Total HU nuevas cerrables ronda 10**: ~60. Tras la **recalibración
del detector ronda 10** (commit chore(ledger) post-consolidación), la
cobertura HU pasó de 16.6% → **20.1% ponderado** y MVP-α de 46.3% →
**50.0% ponderado**. El detector ahora evalúa **72 reglas con 72/72
matched** (vs 55/55 previo). Las cifras reales del backlog tras ronda 10
y recalibración: **54 cubiertas + 21 parciales + 46 pendientes = 121 HU
vivas en MVP-α** (60 HU absorbidas/fusionadas excluidas del cálculo).

## Cómo Se Decidió La Partición

La partición ronda 10 se diseñó usando **cat-thinking** sobre el corpus
`opm-extracted/`, SSOT OPM y el roadmap MVP-α, encarnando la persona
**steipete** (director de ejecución cognitiva). Cambio categórico explícito
vs rondas 8-9.5: de **funtor faithful** (preservación, refactor) a
**funtor extensión** (agrega objetos/morfismos, ref.
`urn:fxsl:kb:icas-extension`). La disjuntez se midió en **dominios
conceptuales OPM** (kernel/render/OPL/UI/persistencia) en lugar de archivos
editados, porque los features cruzan archivos pero respetan capas. La
aditividad sobre tipos opcionales preserva la adjunción libre/olvido de
rondas 8-9.5: nada se rompe, todo se extiende.

Patrones canónicos OPCloud destilados para ronda 10 (sin copiar 1:1):
1. **Grid + snap nativo del paper**: drawGrid de JointJS OSS reusado vs overlay custom (ahorra LOC y mantiene rendimiento).
2. **Resize handle por esquina**: handles SVG sobre seleccionado activo, persistencia en `Apariencia.{width,height}` con `modoTamano` aditivo.
3. **Overlay de imagen separado del composer base**: `imagenOverlay.ts` proyecta cells `imagen-overlay` + `imagen-insignia` sin tocar `composers/entidad.ts`. Patrón ya usado en ronda 7 para badges 📄/🔗.
4. **Modificador como subtipo discriminado**: `subtipoModificador` opcional con discriminante `"C"|"E"|"no"`, badges canónicos, fallback desde `modificador` legacy preservando lectura de modelos antiguos.
5. **Timeline implícito por orden Y de apariencias internas**: drag vertical reordena, agrupación por tolerancia Y ≤ 4px detecta paralelo automáticamente. OPL emite frase "ocurren en paralelo" cuando hay grupo.

## Decisiones Vigentes

Decisiones nuevas de ronda 10:

- **Aditividad estricta para features**: tipos opcionales (`?:`), exports nuevos, ningún rename ni rotura de contrato público. Patrón consolidado: si una HU requiere romper firmas, se promueve a refactor de ronda dedicada y NO se mezcla con features.
- **Cache de imagen NO se serializa**: `Entidad.imagen.cache?: { ts, estado }` es transitorio en runtime; el normalizador/exportador JSON lo elimina. Reduce ruido en archivos versionados y evita conflictos por cache divergente entre clientes.
- **Imágenes single-user**: el alcance de EPICA-19 se limita a HU-19.001..003 + .007..016 (URL + modos + render compuesto). Subida multipart, drive, federación quedan diferidas.
- **Exclusión mutua imagen/estados visibles**: si un objeto tiene `imagen` con modo que incluye bitmap Y tiene estados no suprimidos, la regla `imagen-estados-excluyentes` advierte. Patrón: el modo puede degradarse a "texto" automáticamente vía `modoImagenSeguroParaEstados`.
- **Grid configurable, persistente, fuera del JSON OPM**: vive en `PreferenciasUiUsuario.gridConfig?` (workspace, no modelo). Decisión: el grid es preferencia de visualización, no parte del modelo conceptual.
- **Detector apunta a evidencia real, no a comentarios señuelo**: tres iteraciones (rondas 8, 9, 9.5) consolidaron este patrón. Ronda 10 NO recalibró todavía; el siguiente ciclo de ledger debe agregar reglas para los nuevos dominios (grid, imagen, modificadores avanzados, paralelo OPL, dirty dialog).
- **Composer overlay separado del composer base**: `imagenOverlay.ts` no toca `composers/entidad.ts`. Patrón: si una feature aditiva agrega visual sobre apariencias existentes, va en composer separado para evitar choque entre líneas paralelas.

Decisiones de rondas 1-9.5 que siguen vigentes (no se reabren):

- **OPL-ES como lente derivada**, **Hover OPL↔canvas estado UI**, **Eliminación de OPDs raíz disabled / hojas eliminan refinamiento**, **Bus de agregación derivado en render**, **Importación JSON no auto-persiste**, **Creación interna por posición**, **Apariencia.estilo invariante a OPL**, **`Modelo.estados` y `Modelo.abanicos` top-level**, **Extremos `ExtremoEnlace = { kind, id }`**, **Multiplicidad canónica + custom**, **Estilo de enlace**, **Vértices manuales y reanclaje**, **Tabla de enlaces global**, **Modelo post-asistente queda dirty**, **Workspace con jerarquía de carpetas**, **Árbol OPD expandido por default**, **Mapa del sistema = vista neutra**, **Abanicos OR/XOR canónicos**, **Multi-selección canónica**, **Operaciones batch atómicas en undo**, **Modo barra creación sticky**, **Multi-pestaña sesión-only**, **Bloques OPL jerárquicos**, **Workspace single-user MVP**, **Designaciones de estado con exclusiones SSOT**, **Alias/unidad/descripción/URLs en entidad**, **Duración canónica de estado**, **Plegado parcial persistido**, **Atajos centralizados**, **Divisor árbol/canvas**, **Toggle ocultar nombres del árbol**, **Diálogos custom con captura**, **Barrel re-export como contrato público**, **Slices Zustand con runtime singleton**, **Code splitting Vite con manualChunks**, **Tests legacy se preservan, solo se corrige lo que afloró**, **`validarFirmaEnlace` en `operaciones/helpers.ts` para evitar ciclo enlaces↔refinamiento**, **Anti-patrón `_siguienteGlobal` eliminado**, **Wrapper `paperOff` en `handlers/helpers.ts` para Backbone events**, **Undo per-pestaña vía `estadoModelo()`/`activarEstadoPestanas()`**.

## Cascadas Gestionadas

Cascadas integradas durante la consolidación de ronda 10:

| Cascada | Resolución |
|---|---|
| `JointCanvas.tsx` orquesta tres líneas (L1 grid+resize, L3 renombrado inline, L4 modo imagen global). | Cableado disjunto por handler (`cablearResize` para L1, `abrirRenombradoInlineRef` + JSX `<RenombradoInline>` para L3, `uiModoImagenGlobal` + `alternarModoImagenEntidadRef` + `abrirModalImagenRef` para L4). Cada handler propio. |
| `store/tipos.ts` agrega ~25 acciones nuevas distribuidas en 5 líneas. | Slices Zustand (ronda 8) absorben extensión sin romper firma. Cada acción nueva se compone vía `accionesXxx(set, get): Partial<Slice>` + spread composer. |
| `tipos.ts` re-exporta `ModoTamano` (L1), `SubtipoModificador` (L2), `ModoImagenEntidad`+`ImagenEntidad` (L4). | Barrel ronda 9 absorbe sin romper fan-in 124. |
| `validaciones.ts` añade tres reglas nuevas: `consumo-doble-mismo-objeto` (L2 wrap), `ambiental-dentro-contorno` (L3), `imagen-estados-excluyentes` (L4). | Cada regla en función propia, todas re-emitidas por `validarModelo`. La regla L2 es wrapper sobre la preexistente para retro-compatibilidad. |
| `acciones-canvas.ts` integra grid+alineación+distribución (L1) + extraer-todas+buscar-OPL (L5). | Acciones disjuntas dentro del slice; helpers `gridConfigDesdeEstado`/`cuantizarDesdeEstado` privados. |
| `acciones-entidad.ts` integra resize/auto-tamaño (L1) + imagen (L4). | Acciones disjuntas, separadas por dominio (apariencia vs metadata). |
| `operaciones.ts` re-exporta `moverPuertoEnlace` (L2) + `redimensionarApariencia`/`ajustarAlTexto`/`volverAAutoTamano`/`alternarModoTamano` (L1). | Barrel ronda 9 absorbe los 5 nuevos exports en bloque aditivo. |
| Detector quedó descalibrado para nueva cobertura HU (ronda 10 cierra ~60 HU pero detector no lo refleja). | Pendiente: agregar reglas para HU-1A.* (grid), HU-15.* (modificadores), HU-12.* (descomposición), HU-19.* (imagen), HU-50.* + HU-SHARED-* (OPL polish). |
| Smoke 854 (`confirma cambios sin guardar antes de crear un modelo nuevo`) flaky en primer arranque. | Conocido desde ronda 9. Reintento generalmente verde. No bloqueante. |

## Verificación

Loop verde de consolidación de ronda 10 sobre `main @ f2f69a2`:

```bash
cd app
bun run check          # typecheck OK; 597 unit tests pass / 2475 expects / 0 fail
bun run browser:smoke  # 59/59 Playwright smoke pass (~1.2 min)
bun run build          # OK; chunk principal 163.91 kB / 43.89 kB gzip
cd ..
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

Bundle generado:

| Chunk | KB minificado | KB gzip |
|---|---:|---:|
| `index-*.js` (chunk principal) | 163.91 | 43.89 |
| `vendor-jointjs-*.js` (lazy) | 468.96 | 129.38 |
| `feature-asistente-*.js` (lazy) | 266.59 | 69.45 |
| `vendor-*.js` | 134.37 | 47.14 |
| `feature-dialogos-pesados-*.js` (lazy) | 46.25 | 13.74 |
| `vendor-preact-*.js` | 19.86 | 7.91 |
| `feature-mapa-*.js` (lazy) | 13.82 | 4.67 |
| `feature-modales-*.js` (lazy) | 10.88 | 3.81 |
| `ModalImagenObjeto-*.js` (lazy, NUEVO) | 4.16 | 1.67 |
| `vendor-zustand-*.js` | 0.34 | 0.25 |
| `vendor-jointjs-*.css` | 46.28 | 32.49 |

Crecimiento de bundle vs base ronda 9.5: chunk principal +23 KB (140→164 KB
min, +17%) por el peso conjunto de grid/snap, modificadores enlace, badges,
imagen overlay, dirty dialog, extraer-todas. Dentro del tope razonable
documentado en briefs (≤180 KB / ≤50 KB gzip para chunk principal).

LOC barrels finales (objetivos cumplidos, sin regresión):

| Barrel | LOC | Objetivo | Tope | Estado |
|---|---:|---:|---:|---|
| `app/src/modelo/operaciones.ts` | 67 | <200 | <350 | ✓ por mucho |
| `app/src/modelo/tipos.ts` | 67 | <100 | <150 | ✓ |
| `app/src/render/jointjs/JointCanvas.tsx` | 397 | <200 | <450 | ligeramente sobre objetivo, dentro del tope ronda 10 (orquestación de L1+L3+L4) |
| `app/src/ui/AsistenteNuevoModelo.tsx` | 18 | <200 | — | ✓ por mucho |
| `app/src/store.ts` | 41 | (ronda 8) | — | ✓ |
| `app/src/render/jointjs/proyeccion.ts` | 154 | (ronda 8) | <200 | ✓ |
| `app/src/serializacion/json.ts` | 135 | (ronda 8) | — | ✓ |
| `app/src/opl/generar.ts` | 135 | (ronda 8) | — | ✓ |
| `app/src/store/modelo.ts` | 45 | (ronda 9.5) | — | ✓ |
| `app/src/modelo/operaciones/refinamiento.ts` | 36 | (ronda 9.5) | — | ✓ |
| `app/src/render/jointjs/mapaSistema.ts` | 36 | (ronda 9.5) | — | ✓ |

Estado HU post-recalibración detector ronda 10 (`--sync-real`):

| Segmento | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance |
|---|---:|---:|---:|---:|---:|---:|
| Total backlog | 1126 | 213 | 44 | 491 | 378 | 20.1% |
| MVP-alpha | 121 | 54 | 21 | 46 | 0 | 50.0% |

Detector: **72/72 reglas matched** sobre 305 archivos fuente. 17 reglas
nuevas agregadas para evidencias ronda 10 (HU-1A.* grid+autosize+alineación,
HU-15.022/.023 mover puerto, HU-15.014/.017 subtipos, HU-15.025 advertir
consumo, HU-12.011/.013/.014/.016/.017/.018/.022/.023/.024/.029/.030
descomposición avanzada, HU-19.001..016 imágenes excepto pool/SVG/PDF,
HU-50.013/.023/.024/.025 OPL polish, HU-SHARED-006 dirty dialog). Reglas
preexistentes corregidas: HU-13.014 string canónico, HU-1C.004 string
canónico.

Diagnóstico vigente: 1 advertencia de inventario por ID duplicado
`HU-13.005` (legado de rondas previas).

## Estado Por Dominio

- **Modelo/kernel**: creación básica, firmas de enlace, estados con designaciones canónicas, abanicos, multiplicidad canónica + custom, modificadores básicos + **subtipos avanzados C/E/¬ (ronda 10 L2)**, invocación, rutas, auto-invocación, descomposición + **timeline + paralelo + ambiental (ronda 10 L3)**, despliegue, plegado parcial persistido + **extracción total (ronda 10 L5)**, eliminación segura de OPDs, creación interna, alias/unidad/descripción/URLs + **imágenes incrustadas (ronda 10 L4)**, duración temporal, supresión de estados, layout horizontal/vertical, estilo visual editable, vértices y reanclaje + **mover puerto (ronda 10 L2)**, **auto-tamaño + redimensionado manual (ronda 10 L1)**.
- **Render**: assets canónicos de enlaces. Composers ronda 8 estables (entidad, enlace, markers, plegado, estados, halos, colores) + **grid (ronda 10 L1) + imagenOverlay (ronda 10 L4)**. Markers extendidos con badges canónicos C/E/¬ (L2). JointCanvas ronda 9: 7 sub-archivos en `handlers/` por familia de evento + **resize.ts (ronda 10 L1)**.
- **OPL**: lente derivada con generación bimodal. Generadores ronda 8 separados por familia (procedural, refinamiento, estructural, designaciones, duración/metadata, abanico, plegado, refsHints). **Ronda 10**: probabilidad porcentual `(70%)`, oración paralelo "X y Y ocurren en paralelo.", invariante imagen.
- **UI/store**: Inspector con secciones nuevas (ronda 8) + **SeccionTamano + SeccionImagen (ronda 10)**. InspectorEnlace particionado (ronda 8) + **DialogoMoverPuerto (ronda 10 L2)**. ArbolOpd, PanelCarpetas, PanelOpl particionados (ronda 8) + **PanelOpl búsqueda/copiar/exportar (ronda 10 L5)**. Asistente ronda 9: 11 sub-componentes por etapa + orquestador. Slices store ronda 8 + ronda 9.5: modelo (6 sub-archivos), seleccion, enlaces, workspaceMod, carpetas, uiPanel, mapa, persistencia, pestanas. Runtime singleton en `store/runtime.ts`. Tipos modelo ronda 9: 11 sub-archivos en `modelo/tipos/` por dominio canónico. **Ronda 10**: ModalConfiguracionGrid, ModalImagenObjeto, RenombradoInline.
- **Persistencia**: JSON conserva todos los campos OPM. Workspace local con jerarquía de carpetas, archivado, versiones, búsqueda global, autosalvado. **`gridConfig` en `PreferenciasUiUsuario` (ronda 10 L1) persistente fuera del JSON OPM**. **`Entidad.imagen.cache` transitorio NO se serializa (ronda 10 L4)**. Validadores ronda 8 separados por dominio + extensión imagen (L4) + extensión apariencia.modoTamano (L1) + extensión enlace.subtipoModificador (L2).
- **Auditoría**: detector calibrado al patrón canónico (barrel + sub-archivos). 55/55 reglas matchean. Cobertura HU 16.6% ponderado / MVP-α 46.3% (sin recalibración ronda 10). Recalibración pendiente para reflejar las ~60 HU cerradas en ronda 10.

## Pendientes Inmediatos

Tras ronda 10 + recalibración, **cero deuda estructural pendiente** y
**MVP-α en 50.0% ponderado** (54 cubiertas + 21 parciales + 46 pendientes
sobre 121 HU vivas).

Para cerrar MVP-α faltan **67 HU vivas** (46 pendientes + 21 parciales)
distribuidas por épica:

| Épica | Pendientes | Parciales | Total | Naturaleza |
|---|---:|---:|---:|---|
| EPICA-10 (creación cosas) | 3 | 9 | 12 | Detalles de gestos canónicos (drag, descripción, biblioteca) |
| EPICA-11 (modelado básico) | 6 | 4 | 10 | Reanclaje, copiar estilo, lote, propiedades enlace |
| EPICA-20 (árbol OPD) | 12 | 0 | 12 | UX completa del árbol (navegación, menú contextual, gestión, drag) |
| EPICA-30 (persistencia) | 16 | 5 | 21 | Diálogos modales canónicos, versiones, archivado, autosalvado glifos |
| EPICA-50 (panel OPL) | 8 | 0 | 8 | Polish del panel (numeración toggle, mover, minimizar, indentar) |
| EPICA-SHARED | 1 | 3 | 4 | Read-only, undo/redo granular, eco OPL inverso, validación nominal |

Distribución por prioridad de los 67 pendientes/parciales MVP-α:
- **M0 (crítica)**: ~13 HU (mayoría parciales en EPICA-10/11 + algunos M0 en EPICA-30/SHARED).
- **M1 (alta)**: ~38 HU (la mayor parte de EPICA-20 y EPICA-30 pendientes).
- **S/C/W (menor)**: ~16 HU (autosalvado, versiones, vista lista).
- **HU de kernel pendientes**: slot de valor numérico EPICA-17, multiplicidad avanzada residual EPICA-15, sub-modelos EPICA-32, plantillas EPICA-33.
- **EPICA-60 export PDF**, **EPICA-61 export SVG papel**, **EPICA-71 CSV import**: bloqueadas por regla "no introducir dependencias nuevas".
- **EPICA-70 OPCAT**, **EPICA-91 tutorial**: descartadas del proyecto.
- **Endurecimiento del boundary JointJS**: `roadmap/jointjs-boundary.md`. Candidato a ronda futura cuando el corte funcional lo justifique.
- **Smoke 854 flaky**: ocasional, no bloqueante. Reintento generalmente verde. Conocido desde ronda 9.
- **JointCanvas.tsx 397 LOC**: ligeramente sobre objetivo (200) por orquestación de tres líneas ronda 10. Dentro del tope (450). Particionable a futuro si crece, no urgente.

Sub-archivo más grande post-ronda-10: `store/modelo/acciones-canvas.ts` 559
LOC (vs 472 post-9.5). Crecimiento esperado por L1 (grid+alinear+distribuir)
+ L5 (buscar+extraer-todas). Particionable si crece, no urgente.

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
2. Próximo paso natural inmediato: **abrir ronda 11 enfocada en cierre MVP-α**, con énfasis en EPICA-20 (árbol OPD), EPICA-30 (diálogos persistencia) y EPICA-50 (panel OPL polish), que concentran ~50 de las 67 HU faltantes.
3. Si abrirás una nueva ronda paralela:
   - Heredar el formato de `docs/instrucciones-lineas-dev/ronda10/` (10 secciones README + 11 secciones por brief, ya consolidado).
   - Asumir cadenas de efecto kernel→render→OPL→UI.
   - Para features aditivas, ronda 10 confirma el patrón: tipos opcionales (`?:`), exports nuevos, ningún rename. Si una HU requiere romper firmas, dedicar ronda completa a refactor.
   - Si hay refactor estructural, **recalibrar el detector ANTES de cerrar la ronda**, no después. El patrón consolidado en rondas 8 y 9: nada de comentarios señuelo, solo paths reales con strings reales.
   - Reservar el último commit del ciclo para una capa explícita de cascadas resueltas (rondas 6, 7, 8, 9, 10 demostraron que esa capa es ineludible).
   - **Próximas rondas**: kernel restante (EPICA-17, EPICA-32, EPICA-33), endurecimiento boundary JointJS, completitud OPL avanzada.
4. Antes de diseñar, consultar `opm-extracted/`, `assets/svg/`, `docs/JOYAS.md` y la SSOT OPM.
5. Cerrar cada cambio con `bun run check`; si toca UI/render, sumar `bun run browser:smoke`; si toca proyección o bundle, sumar `bun run build`.
6. Regenerar auditoría con `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real` antes de publicar un cierre de ronda. **Mantener ≥72/N reglas matched y MVP-α ≥50%; tras ronda 11 esperado MVP-α ≥75%.**
