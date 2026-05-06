# HANDOFF - estado integrado y próximos pasos

**Fecha**: 2026-05-06
**Repositorio**: `deep-opm-pro`
**Corte**: MVP-alpha + rondas 1, 2, 3, 4, 5, 6, 7, 8 y 9 consolidadas sobre `main`
**Código verificado**: `main` tras commits L1-L4 ronda 9 + cascada de detector recalibrado.
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

La ronda 9 cerró 5 líneas paralelas de **refactor estructural** sobre los 4
monolitos restantes (`operaciones.ts`, `tipos.ts`, `JointCanvas.tsx`,
`AsistenteNuevoModelo.tsx`) más cierre de la **deuda funcional de undo
per-pestaña** declarada desde ronda 7. El patrón canónico ronda 8 (barrel
re-export + sub-archivos por dominio) se extiende a las 4 superficies
restantes. APIs públicas inalteradas:

| Línea | Commit | Resultado integrado |
|---|---|---|
| L1 | `5ab04b9` | `modelo/operaciones.ts` 1743→60 LOC (barrel). 7 sub-archivos por dominio canónico OPM: `creacion.ts` (87 LOC), `refinamiento.ts` (754 LOC), `entidad.ts` (49 LOC), `estados.ts` (191 LOC), `enlaces.ts` (278 LOC), `apariencias.ts` (134 LOC), `eliminacion.ts` (298 LOC) + `helpers.ts` (91 LOC, aloja `validarFirmaEnlace` para evitar ciclo enlaces↔refinamiento). Sin ciclos. 38 consumidores intactos. `operaciones.test.ts` (1185 LOC) intacto. |
| L5 | `d920846` | `modelo/tipos.ts` 241→61 LOC (barrel). 11 sub-archivos por dominio: `comunes.ts` (Id/Posicion/Resultado), `entidad.ts`, `estado.ts`, `apariencia.ts`, `enlace.ts`, `abanico.ts`, `opd.ts`, `modelo.ts`, `pestana.ts`, `opl.ts`, `ui.ts`. Cero diff runtime (tipos zero-cost). 124 consumidores intactos. |
| L2 | `2b1b13a` | `render/jointjs/JointCanvas.tsx` 697→321 LOC (orquestador). 7 sub-archivos en `handlers/`: `seleccion.ts` (155 LOC), `zoom.ts` (72 LOC), `rubberBand.ts` (106 LOC), `drag.ts` (134 LOC), `hoverOpl.ts` (67 LOC), `toolsEnlace.ts` (47 LOC) + `helpers.ts` (109 LOC con `paperOff` wrapper para Backbone). Composers L2 ronda 8 intactos. `proyeccion.test.ts` intacto. |
| L3 | `14ba098` | `ui/AsistenteNuevoModelo.tsx` 935→18 LOC (barrel). 13 sub-archivos en `asistente/`: 11 etapas + `Asistente.tsx` orquestador (280 LOC) + `estilos.ts` (176 LOC). Cada etapa prop-driven. Anti-patrón `_siguienteGlobal` eliminado: `onEnter` como prop. |
| L4 | `36f1fa7` | Undo per-pestaña — la deuda declarada en ronda 7 ya estaba resuelta por el wiring `estadoModelo()` + `activarEstadoPestanas()`. L4 agrega 3 tests integrados en `store/runtime.test.ts` que confirman: commit en pestaña A no contamina B; `redoStack` se limpia al cambiar de pestaña (Alt A); dirty se computa por pestaña. Cero cambio de código de producción. |

Cascadas resueltas en consolidación final:

| Cascada | Resolución |
|---|---|
| Detector descalibrado por barrels reducidos: 19 reglas seguían apuntando a `app/src/modelo/operaciones.ts`, `app/src/modelo/tipos.ts`, `app/src/render/jointjs/JointCanvas.tsx` con strings que ahora viven en sub-archivos. | Recalibradas a paths reales (`operaciones/{creacion,entidad,enlaces,refinamiento,estados,apariencias,eliminacion,helpers}.ts`, `tipos/{enlace,entidad,estado}.ts`, `handlers/{seleccion,drag,helpers,toolsEnlace,zoom}.ts`). Patrón consolidado: **el detector apunta a evidencia real**, no a comentarios señuelo en barrels. 55/55 reglas matchean tras recalibración. |

## Cómo Se Decidió La Partición

La partición ronda 9 se diseñó usando **cat-thinking** sobre el corpus
`opm-extracted/` y SSOT OPM, encarnando la persona **steipete** (director de
ejecución cognitiva). Las 5 líneas son disjuntas en archivos editados
(coproducto categórico, ref. `urn:fxsl:kb:icas-universales`). Cada barrel es
un funtor faithful sobre la API pública (ref. `urn:fxsl:kb:icas-preservacion`).
El patrón `barrel re-export + sub-archivos por dominio` es la adjunción
libre/olvido entre exposed-API e internal-structure (ref.
`urn:fxsl:kb:icas-adjunciones`), validada en ronda 8 sobre 5 superficies y
extendida en ronda 9 a las 4 superficies restantes + 1 deuda funcional.

Patrones canónicos OPCloud destilados (sin copiar 1:1):
1. **Comando por familia**: `opm-extracted/src/app/models/components/commands/edit-alias.ts:5-30` y `object-decider.ts:5-127`. Aplicado en L1 a `operaciones/*.ts`.
2. **Tipos por dominio**: `opm-extracted/src/app/models/DrawnPart/OpmObject.ts:5-15`, `models/Logical/AggregationLink.ts`. Aplicado en L5 a `tipos/*.ts`.
3. **Handlers disjuntos por evento**: `opm-extracted/src/app/configuration/rappidEnviromentFunctionality/selectionConfiguration.ts:5-65`. Aplicado en L2 a `handlers/*.ts`.
4. **Wizard por etapa**: aplicado en L3 a `asistente/*.tsx` con cada etapa prop-driven.
5. **Contexto activo con su propio historial**: `opm-extracted/src/app/modules/app/context.service.ts:5-130`. Verificado en L4 que el wiring del store ya respetaba el patrón.

## Decisiones Vigentes

Decisiones nuevas de ronda 9:

- **Patrón barrel re-export sobre superficies con fan-in alto**: aplicable a cualquier monolito futuro con consumidores externos. Sub-archivos por dominio canónico, sin imports cíclicos (resolverlo con helpers.ts si emerge ciclo natural). El detector apunta a evidencia real (no comentarios señuelo en barrels).
- **`validarFirmaEnlace` vive en `modelo/operaciones/helpers.ts`**: para evitar ciclo entre `enlaces.ts` (que usa `validarFirmaEnlace` en `crearEnlace` y `apuntarExtremoEnlace`) y `refinamiento.ts` (que usa `validarFirmaEnlace` en `proyectarEnlacesExternosEnRefinamiento`). El barrel `operaciones.ts` re-exporta `validarFirmaEnlace` preservando la firma pública previa.
- **Anti-patrón `_siguienteGlobal` eliminado**: las 3 etapas del asistente (FuncionPrincipal, Beneficiario, NombreSistema) que tenían Enter handler reciben ahora `onEnter` como prop. Cero state global mutable en `ui/asistente/`.
- **Wrapper `paperOff` en `handlers/helpers.ts`**: dia.Paper hereda de Backbone Events que sí expone `.off`, pero los tipos públicos de jointjs solo declaran `.on`. Helper local centraliza el cast en lugar de repetirlo en cada handler.
- **Undo per-pestaña confirmado funcional**: el wiring existente (`estadoModelo()` sincroniza `pestana.historialUndo` en cada commit; `activarEstadoPestanas()` recarga `undoStack` al cambiar de pestaña) ya implementa undo independiente por pestaña. Alt A documentada: `redoStack` se limpia al cambiar de pestaña (redo es sesión-continua).
- **L1 NO requirió worktree dedicado**: la doctrina histórica indicaba worktree para `operaciones.ts` por su congelación, pero las 5 líneas ronda 9 fueron disjuntas en archivos editados, así que main directo fue seguro. Doctrina actualizada: worktree dedicado solo si hay riesgo real de conflicto cross-line.

Decisiones de rondas 1-8 que siguen vigentes (no se reabren):

- **OPL-ES como lente derivada**, **Hover OPL↔canvas estado UI**, **Eliminación de OPDs raíz disabled / hojas eliminan refinamiento**, **Bus de agregación derivado en render**, **Importación JSON no auto-persiste**, **Creación interna por posición**, **Apariencia.estilo invariante a OPL**, **`Modelo.estados` y `Modelo.abanicos` top-level**, **Extremos `ExtremoEnlace = { kind, id }`**, **Multiplicidad canónica + custom**, **Estilo de enlace**, **Vértices manuales y reanclaje**, **Tabla de enlaces global**, **Modelo post-asistente queda dirty**, **Workspace con jerarquía de carpetas**, **Árbol OPD expandido por default**, **Mapa del sistema = vista neutra**, **Abanicos OR/XOR canónicos**, **Multi-selección canónica**, **Operaciones batch atómicas en undo**, **Modo barra creación sticky**, **Mapa del sistema = vista derivada extendida**, **Multi-pestaña sesión-only**, **Bloques OPL jerárquicos**, **Workspace single-user MVP**, **Designaciones de estado con exclusiones SSOT**, **Alias/unidad/descripción/URLs en entidad**, **Duración canónica de estado**, **Plegado parcial persistido**, **Atajos centralizados**, **Divisor árbol/canvas**, **Toggle ocultar nombres del árbol**, **Diálogos custom con captura**, **Barrel re-export como contrato público (ronda 8)**, **Slices Zustand con runtime singleton (ronda 8)**, **Detector apunta a evidencia real (ronda 8)**, **Code splitting Vite con manualChunks (ronda 8)**, **Tests legacy se preservan, solo se corrige lo que afloró (ronda 8)**.

## Cascadas Gestionadas

- **Detector recalibrado por refactor de monolitos**: 19 reglas redirigidas. Patrón consolidado tercera vez (rondas 8 y 9): cuando un barrel se reduce, las reglas que evidenciaban strings en él se redirigen a sub-archivos. El barrel viejo queda en `evidenciaExtra` por trazabilidad solo si tiene contenido propio.
- **Imports cíclicos potenciales en `operaciones/`**: resolución con `helpers.ts` para tipos/funciones cross-dominio (`validarFirmaEnlace`, `entidadVisibleEnOpd`, `siguienteId`, `ok`, `fallo`).
- **`tipos.ts` global con fan-in 124**: ningún consumidor cambió tras la partición. Cero diff fuera de `modelo/tipos/*` confirmado por `git diff --stat`.
- **Smoke 854 flaky al inicio del dev server**: ocasional, no relacionado con cambios. Reintento generalmente verde. Si persistente en CI: investigar.

## Verificación

Loop verde de consolidación de ronda 9 sobre `main` post-cascada-detector:

```bash
cd app
bun run check          # typecheck OK; 561 unit tests pass / 2381 expects
bun run browser:smoke  # 40/40 Playwright smoke pass (47 s)
bun run build          # OK; chunk principal 140 KB / 38 KB gzip
cd ..
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

Bundle generado:

| Chunk | KB minificado | KB gzip |
|---|---:|---:|
| `index-*.js` (chunk principal) | 140.49 | 38.18 |
| `vendor-jointjs-*.js` (lazy) | 468.96 | 129.38 |
| `feature-asistente-*.js` (lazy) | 247.47 | 64.50 |
| `vendor-*.js` | 134.37 | 47.14 |
| `feature-dialogos-pesados-*.js` (lazy) | 45.87 | 13.67 |
| `vendor-preact-*.js` | 19.86 | 7.91 |
| `feature-mapa-*.js` (lazy) | 13.82 | 4.68 |
| `feature-modales-*.js` (lazy) | 10.88 | 3.81 |
| `vendor-zustand-*.js` | 0.34 | 0.25 |
| `vendor-jointjs-*.css` | 46.28 | 32.49 |

Sin regresión vs base ronda 8.

LOC barrels finales (objetivos cumplidos):

| Barrel | LOC | Objetivo | Tope | Estado |
|---|---:|---:|---:|---|
| `app/src/modelo/operaciones.ts` | 60 | <200 | <350 | ✓ por mucho |
| `app/src/modelo/tipos.ts` | 61 | <100 | <150 | ✓ |
| `app/src/render/jointjs/JointCanvas.tsx` | 321 | <200 | <350 | dentro de tope |
| `app/src/ui/AsistenteNuevoModelo.tsx` | 18 | <200 | — | ✓ por mucho |
| `app/src/store.ts` | 41 | (ronda 8) | — | ✓ |
| `app/src/render/jointjs/proyeccion.ts` | 146 | (ronda 8) | — | ✓ |
| `app/src/serializacion/json.ts` | 134 | (ronda 8) | — | ✓ |
| `app/src/opl/generar.ts` | 135 | (ronda 8) | — | ✓ |

Estado HU tras `--sync-real` final:

| Segmento | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance |
|---|---:|---:|---:|---:|---:|---:|
| Total backlog | 1126 | 168 | 51 | 529 | 378 | 16.6% |
| MVP-alpha | 121 | 48 | 23 | 50 | 0 | 46.3% |
| MVP-beta | 193 | 47 | 23 | 123 | 0 | 32.6% |
| M0 | 130 | 73 | 29 | 28 | 0 | 65.8% |

Detector: **55/55 reglas matched** sobre 264 archivos fuente (vs 249 post-ronda 8 + nuevos archivos ronda 9). Sin caída.

Diagnóstico vigente: 1 advertencia de inventario por ID duplicado `HU-13.005` (legado de rondas previas).

## Estado Por Dominio

- **Modelo/kernel**: creación básica, firmas de enlace, estados con designaciones canónicas, abanicos, multiplicidad canónica + custom, modificadores, invocación, rutas, auto-invocación, descomposición, despliegue, plegado parcial persistido, eliminación segura de OPDs, creación interna, alias/unidad/descripción/URLs, duración temporal, supresión de estados, layout horizontal/vertical, estilo visual editable, vértices y reanclaje. **Operaciones ronda 9**: 7 sub-archivos por dominio canónico + helpers; barrel re-exporta firmas previas. Helpers de dominio modulares en `modelo/{abanicos,autoinvocacion,creacionWizard,creacionInterna,enlace*,estadosDesignaciones,etiquetasEnlace,extremos,modificadores,objetoDuracion,objetoMetadata,opdEliminacion,opdReorden,plegado,rutas,validaciones}.ts`.
- **Render**: assets canónicos de enlaces. Composers ronda 8 estables (entidad, enlace, markers, plegado, estados, halos, colores). **JointCanvas ronda 9**: 7 sub-archivos en `handlers/` por familia de evento (selección, zoom, rubberBand, drag, hoverOpl, toolsEnlace + helpers); orquestador < 350 LOC.
- **OPL**: lente derivada con generación bimodal. Generadores ronda 8 separados por familia (procedural, refinamiento, estructural, designaciones, duración/metadata, abanico, plegado, refsHints).
- **UI/store**: Inspector con secciones nuevas (ronda 8). InspectorEnlace particionado (ronda 8). ArbolOpd, PanelCarpetas, PanelOpl particionados (ronda 8). **Asistente ronda 9**: 11 sub-componentes por etapa + orquestador + estilos compartidos; barrel < 20 LOC. Slices store ronda 8: modelo, seleccion, enlaces, workspaceMod, carpetas, uiPanel, mapa, persistencia, pestanas. Runtime singleton en `store/runtime.ts`. **Tipos store ronda 8** en `store/tipos.ts`. **Tipos modelo ronda 9**: 11 sub-archivos en `modelo/tipos/` por dominio canónico.
- **Persistencia**: JSON conserva todos los campos OPM. Workspace local con jerarquía de carpetas, archivado, versiones, búsqueda global, autosalvado. Validadores ronda 8 separados por dominio.
- **Auditoría**: detector calibrado al patrón canónico (barrel + sub-archivos). 55/55 reglas matchean. Cobertura HU 16.6% ponderado / MVP-alpha 46.3%.

## Pendientes Inmediatos

- **`store/modelo.ts`** (1622 LOC): emergente post-ronda 8. NO se partió en ronda 9 por riesgo de choque con L4. Si crece más, candidato natural para ronda 10 con worktree dedicado.
- **`modelo/operaciones/refinamiento.ts`** (754 LOC): el sub-archivo más grande tras L1. Está dentro del dominio canónico (in-zoom + unfold + helpers), pero podría sub-particionarse si crece más (`refinamiento/{descomposicion,despliegue,proyeccion,helpers}.ts`).
- **HU de kernel pendientes**: `enlace.subtipo`, `enlace.modificadorNot`, slot de valor numérico EPICA-17, multiplicidad avanzada EPICA-15, imágenes EPICA-19, sub-modelos EPICA-32, plantillas EPICA-33. Son features, no refactor. **Ronda 10 puede ser la primera ronda de features post-MVP-α**.
- **EPICA-60 export PDF**, **EPICA-61 export SVG papel**, **EPICA-71 CSV import**: requieren librerías nuevas; bloqueadas por regla "no introducir dependencias nuevas" hasta cambio de doctrina.
- **EPICA-70 OPCAT**, **EPICA-91 tutorial**: descartadas del proyecto.
- **Endurecimiento del boundary JointJS**: `roadmap/jointjs-boundary.md` documenta el adapter mínimo. Endurecerlo (formalizar contracts del adapter, hacer testeable sin JointJS) es candidato a ronda futura cuando el corte funcional lo justifique.
- **Refactor de `mapaSistema.ts` (499 LOC)**: bajo blast, modularización pendiente; candidato menor.
- **Smoke 854 flaky**: el smoke "confirma cambios sin guardar antes de crear un modelo nuevo" ocasionalmente falla en la primera corrida del día (timing al iniciar dev server). Reintento generalmente verde. Si persistente: investigar timing de Playwright o del beforeunload del browser.

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
   - Heredar el formato de `docs/instrucciones-lineas-dev/ronda9/` (10 secciones README + 11 secciones por brief, ya consolidado).
   - Asumir cadenas de efecto kernel→render→OPL→UI.
   - Si hay refactor estructural, **recalibrar el detector ANTES de cerrar la ronda**, no después. Cada barrel reducido con strings en archivos hijos requiere actualizar reglas; el patrón consolidado en rondas 8 y 9 es: nada de comentarios señuelo, solo paths reales con strings reales.
   - Reservar el último commit del ciclo para una capa explícita de cascadas resueltas (rondas 6, 7, 8 y 9 demostraron que esa capa es ineludible).
   - **Ronda 10 puede ser de features**: tras 2 rondas de refactor estructural (8 y 9), la deuda de monolitos está cerrada. Las próximas HU pueden enfocarse en kernel/UI nuevo.
3. Antes de diseñar, consultar `opm-extracted/`, `assets/svg/`, `docs/JOYAS.md` y la SSOT OPM.
4. Cerrar cada cambio con `bun run check`; si toca UI/render, sumar `bun run browser:smoke`; si toca proyección o bundle, sumar `bun run build`.
5. Regenerar auditoría con `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real` antes de publicar un cierre de ronda. **Ronda 9 cerró 55/55 reglas; tras ronda 10 mantener ≥55/N reglas.**
