# HANDOFF - estado integrado y próximos pasos

**Fecha**: 2026-05-07
**Repositorio**: `deep-opm-pro`
**Corte**: ronda 12 (4 líneas L1-L4 + recalibración detector L5) consolidada sobre `main` con commits atómicos por línea.
**Código verificado**: `main` tras commits `be84aca f0a88a3 7a74b7c 7bf74e5 1a09e61 3152d97`. **MVP-α 90.8% ponderado**. Tests 659/659 + smokes 81/81 verdes.
**Documentación vigente**: este archivo reemplaza por completo el handoff anterior (ronda 11).

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

La **ronda 12** entregó cuatro vectores aditivos paralelos sobre el código
ronda 11 ya en MVP-α: cierre del set MVP-α faltante (L1), atributos canónicos
con valor (L2), traer conectados con familias y layout radial (L3),
plantillas privadas EPICA-33 (L4), más la recalibración del detector (L5).

Las cuatro líneas trabajaron concurrentemente sobre el mismo worktree. La
consolidación se hizo con **5 commits atómicos**: uno por línea con sus
archivos exclusivos, más un commit `chore(integracion ronda12)` para los
archivos compartidos (Toolbar, operacionesBatch, opm-smoke, acciones-*) cuyos
hunks se entrelazan y no admiten split atómico sin riesgo. La verdad
estructural prevalece sobre la pureza atómica nominal.

| Línea | Resultado integrado | Commit | HU cerradas |
|---|---|---|---:|
| L1 | Cierre MVP-α: SeccionDescripcion canónica + indicador-modo-sticky + ATAJO_CONECTAR_MULTI_AL_TODO (Ctrl+Alt+T) reusando `conectarSeleccionAlTodo` + redirección Guardar→Guardar Como cuando readOnly + ejemplo-organizacional cargable como asset URL + preservación exacta JSON local. Smokes 854 estabilizados. Briefs ronda12/L1 actualizados. | `7bf74e5` | 7 |
| L2 | Atributos canónicos: kernel aditivo `Entidad.esAtributo? + valorSlot? + TipoValorSlot/ValorConcreto`, validador integer/float/char/string, operaciones `crearAtributoEnObjeto/asignarValorAtributo/cambiarTipoValorAtributo/esAtributoDerivado`, parseo idempotente Nombre [unidad], render Nombre [Unidad] {alias}, OPL nueva, SeccionAtributo en Inspector, botón +Atributo en Toolbar con drag canvas. | `be84aca` | 7 |
| L3 | Traer conectados / ocultar apariencia / layout radial: reglas por familia (todos, jerarquía, generalización, exhibición, eventos, agentes, instrumentos, direccional no-op), `traerConectadosBatch` + `traerEnlacesEntreBatch` + `ocultarAparienciaBatch`, layout radial alrededor del foco, `enlacesInternosSeleccion`, DialogoTraerConectados, MenuContextualEntidad como fallback sin invadir handlers selección, atajos Ctrl+Shift+T/Ctrl+H. | `f0a88a3` | 15 |
| L4 | Plantillas privadas EPICA-33: tipos `Plantilla/PlantillaIndice/AmbitoPlantilla`, persistencia localStorage separada (`opm:plantilla:*`, `opm:plantilla-indice:*`, `opm:plantillas-lista`), `insertarPlantillaBatch` con IDs nuevos + sub-OPDs propagados + sufijo `_n`, `resaltarTemporalmente`, DialogoPlantillas/DialogoGuardarPlantilla, Guardar como plantilla en MenuPrincipal con `assets/svg/template.svg`. | `7a74b7c` | 13 |
| Glue | Integración cross-line de archivos compartidos: Toolbar (botones +Atributo/Traer/Plantilla), acciones-ui (atajos cross + diálogos plantillas), acciones-canvas (traer + insertar), operacionesBatch (L3+L4 batches), operacionesBatch.test (10 tests), opm-smoke (smokes de las 4 líneas: HU-17 x3, HU-1B x2, HU-33 x4, HU-30/SHARED x2), modelo/tipos (reexports L2+L4), store/tipos (imports L2+L3+L4 en OpmStore), runtime crearDemo via fixtures, InspectorEntidad orquesta SeccionDescripcion+SeccionAtributo, modelo/fixtures.ts + scripts/generar-demos.ts + fixtures/demo-models/ (7 modelos demo: Cafetera_Domestica, Control_de_Calidad, Diagnostico_Clinico, Logistica_de_Envios, etc.). | `1a09e61` | — |
| L5 | Recalibración detector + regeneración ledger post-merge: 9 reglas nuevas para HU-10.004 / HU-11.001 / HU-11.007 / HU-30.036 / HU-30.021+.008 / HU-17.011..017 / HU-1B.001..015 / HU-33.001..022. Cleanup IDs duplicados (HU-30.008/.021 movidas de parcial a cubierto, HU-17.011/.012/.013 movidas de regla genérica a regla específica). | `3152d97` | — (recalibración) |

**Total HU nuevas cerradas ronda 12**: ~40 HU adicionales por reglas detectoras
nuevas (5 L1 + 7 L2 + 15 L3 + 13 L4). Detector ronda 12: **100/100 reglas
matched** sobre 351 archivos fuente (vs 92/92 sobre 333 en ronda 11).

**MVP-α: 91.1% → 90.8% ponderado** (-0.3 pts). La leve baja se explica
porque HU-SHARED-002/007 vuelven a parcial: el cambio L1 estabilizó smokes
pero no resolvió undo granular (HU-SHARED-002) ni OPL inverso editable
(HU-SHARED-007). Mantengo verdad estructural en lugar de inflar métricas.

**Total backlog: 24.6% → 27.5% ponderado** (+2.9 pts; 266→302 cubiertas, +36).

## Cómo Se Decidió La Partición Y La Consolidación

La partición ronda 12 fue declarada por briefs en
`docs/instrucciones-lineas-dev/ronda12/`. Cuatro líneas paralelas con
disjuntez por dominio funcional + un nodo L5 que solo corre tras el merge.

La **consolidación post-líneas** (este handoff) se diseñó así:

- **Coproducto disjunto** sobre archivos exclusivos por línea: cada commit
  por línea contiene únicamente archivos que ninguna otra línea tocó. Esto
  da atomicidad real para L2, L3, L4 y L1 sobre 14 + 8 + 9 + 10 archivos
  respectivamente.
- **Pullback explícito** sobre archivos compartidos: 12 archivos M + 3
  untracked (Toolbar, acciones-ui, acciones-canvas, operacionesBatch,
  operacionesBatch.test, opm-smoke, modelo/tipos, store/tipos,
  store/runtime, InspectorEntidad, modelo/fixtures, scripts/generar-demos,
  fixtures/demo-models/) consolidados en un único commit
  `chore(integracion)` que documenta qué línea aporta qué hunk.
- **Funtor identidad** sobre rondas previas (`urn:fxsl:kb:icas-preservacion`):
  cero rename, contratos públicos preservados, tipos opcionales aditivos.
- **Funtor extensión** sobre features faltantes
  (`urn:fxsl:kb:icas-extension`): nueva familia `FamiliaTraerConectados`,
  nuevo `TipoValorSlot`, nuevos `Plantilla*`. Todo opcional.
- **Adjunción libre/olvido** preservada: API pública estable, estructura
  interna crece. JSON OPM canónico sigue lossless.
- **V-model fase Validation**: cada HU cerrada tiene criterio + smoke +
  regla detector. 100/100 reglas matched.

Patrones canónicos OPCloud destilados:

1. **AttributeValue + char-range + validation-module** → L2 atributos.
2. **BringConnectedEntitiesAction + bringConnectedRules + element-tool-bar**
   → L3 traer conectados.
3. **TemplatesImport + existing-name-dialog + submodel-name-dialog** → L4
   plantillas.
4. **Read-only redirect** completado (HU-30.036) sobre el flag heredado de
   ronda 11.

## Decisiones Vigentes

Decisiones nuevas de ronda 12:

- **Atributo como variante de Entidad, no entidad nueva**: `Entidad.esAtributo?` opcional. No introduce un tipo discriminante extra; preserva contrato JSON canónico.
- **Slot de valor con tipo declarado y placeholder canónico `"value"`**: `TipoValorSlot = "integer" | "float" | "char" | "string"`. Validador rechaza fuera de tipo y devuelve placeholder cuando vacío.
- **Render compuesto Nombre [Unidad] {alias}**: parseo idempotente Nombre [unidad] preserva alias separado. Composer entidad emite layout completo.
- **OPL atributo aditivo**: "**Atributo** es valor [Unidad].", "**Atributo** es 25 [Unidad]." sin tocar generadores OPL legados.
- **Traer conectados como pull, no push**: usuario decide qué familia traer y profundidad. Familia `direccional` queda no-op por ausencia de TipoEnlace direccional/bidireccional en SSOT actual.
- **Layout radial alrededor del foco**: `layoutRadial` calcula posiciones para nuevas apariencias evitando colisión con seleccionadas.
- **Ocultar apariencia ≠ borrar**: `ocultarAparienciaBatch` quita del OPD activo sin afectar el modelo subyacente.
- **MenuContextualEntidad como fallback**: para no invadir `render/jointjs/handlers/seleccion.ts` (fuera de scope L3), el menú contextual de entidad se resuelve desde Toolbar.tsx por captura DOM sobre metadata JointJS existente. Halo dedicado queda como deuda menor (outline amarillo #FFFC7F en compositor real).
- **Plantillas como ámbito separado del workspace**: `AmbitoPlantilla = "privado"` (solo `"privado"` en MVP). Catálogo `PlantillaIndice` separado de `ModeloIndice` en `WorkspaceIndice.plantillas?`.
- **Persistencia localStorage con prefijos disjuntos**: `opm:plantilla:*`, `opm:plantilla-indice:*`, `opm:plantillas-lista` para evitar colisión con `opm:modelo:*`.
- **Inserción atómica con identidad nueva**: `insertarPlantillaBatch` regenera todos los IDs (entidades, enlaces, OPDs hijos), agrega sufijo `_n` cuando hay colisión de nombre y preserva etiquetas.
- **Foco temporal post-inserción**: `idsResaltadosTemporales` marca los nuevos IDs por ~3 s para guiar atención del usuario.
- **HU-30.036 cierra como redirección, no bloqueo**: cuando `readOnly`, `guardarLocal()` invoca `guardarComoLocal()` con nombre derivado y limpia el flag al cambiar `modeloPersistidoId`. Patrón "redirección antes que bloqueo" elegido sobre el modal previsto en ronda 11.
- **Ejemplo organizacional como asset, no chunk**: `app/examples/ejemplo-organizacional.json` (15.11 kB / 2.42 kB gzip) se carga vía URL de asset, no como import — mantiene el chunk principal estable.
- **HU-SHARED-002/007 son honestamente parciales**: el cambio L1 estabilizó smokes 854 con HU-30.021 canónico y conteos no frágiles, pero no resolvió undo granular ni OPL inverso. La métrica refleja la verdad.
- **Fixtures demo como kernel + script regenerable**: `app/src/modelo/fixtures.ts` define los modelos en TypeScript; `app/scripts/generar-demos.ts` los emite a `fixtures/demo-models/{Nombre}.{json,md,opl.txt}`. `crearDemo()` en runtime usa el primer fixture del catálogo.
- **Catálogo unificado de 7 modelos (2026-05-07)**: `fixtureTodos()` cubre el espectro OPM completo: Cafetera Domestica (SD básico), OnStar System (agregación clásica ISO 19450), Diagnostico Clinico (estados + efecto), SD Generico (plantilla wizard), Logistica de Envios (SD+SD1 in-zoom), SD Async (SD+SD1 async), Control de Calidad (estados + efecto). Los 3 últimos portados desde los fixtures históricos de OPCloud.

Decisiones de rondas 1-11 que siguen vigentes (no se reabren):

OPL-ES como lente derivada • Hover OPL↔canvas estado UI • Eliminación OPDs raíz disabled / hojas eliminan refinamiento • Bus de agregación derivado en render • Importación JSON no auto-persiste • Creación interna por posición • Apariencia.estilo invariante a OPL • `Modelo.estados` y `Modelo.abanicos` top-level • Extremos `ExtremoEnlace = { kind, id }` • Multiplicidad canónica + custom • Estilo de enlace • Vértices manuales y reanclaje • Tabla de enlaces global • Modelo post-asistente queda dirty • Workspace con jerarquía de carpetas • Árbol OPD expandido por default • Mapa del sistema = vista neutra • Abanicos OR/XOR canónicos • Multi-selección canónica • Operaciones batch atómicas en undo • Modo barra creación sticky • Multi-pestaña sesión-only • Bloques OPL jerárquicos • Workspace single-user MVP • Designaciones de estado con exclusiones SSOT • Alias/unidad/descripción/URLs en entidad • Duración canónica de estado • Plegado parcial persistido • Atajos centralizados • Divisor árbol/canvas • Toggle ocultar nombres del árbol • Diálogos custom con captura • Barrel re-export como contrato público • Slices Zustand con runtime singleton • Code splitting Vite con manualChunks • `validarFirmaEnlace` en `operaciones/helpers.ts` para evitar ciclo enlaces↔refinamiento • Wrapper `paperOff` en `handlers/helpers.ts` para Backbone events • Undo per-pestaña vía `estadoModelo()`/`activarEstadoPestanas()` • Aditividad estricta para features • Cache imagen NO se serializa • Read-only como flag de runtime, no de modelo • Validación nominal completa via `validarNombreEntidad` • Atajos panel-locales para árbol OPD • PantallaInicio con dynamic import • Política log-scale para versiones • Auto-archivar 90 días marca • Modo orden árbol configurable • Selección enlace específico en oración multi-enlace • DialogoEstiloEnlace con paleta cerrada • `copiarEstiloEnlace` con portapapeles in-memory.

## Cascadas Gestionadas

Cascadas integradas durante la consolidación de ronda 12:

| Cascada | Resolución |
|---|---|
| **4 líneas concurrentes sobre mismo worktree**: L1+L2+L3+L4 entregaron sin commit individual; el worktree quedó con 57 archivos M + 18 untracked mezclando contribuciones. | Mapeo archivo→línea por símbolos clave (valorSlot/SeccionAtributo→L2, layoutRadial/reglasTraer→L3, plantillas/AmbitoPlantilla→L4, ejemplo-organizacional/SeccionDescripcion/readOnly→L1). Archivos puros (con UNA sola línea contribuyente) van a su commit; mezclados van al commit `chore(integracion)`. |
| **`tipos.ts` con hunks L2 y L4 disjuntos**: re-exporta TipoValorSlot/ValorConcreto/ValorSlot (L2) y AmbitoPlantilla/Plantilla/PlantillaIndice (L4) en hunks distintos. | Va a `chore(integracion)` para no fracturar. |
| **`store/tipos.ts` con imports cross**: `OpmStore` importa PlantillaIndice (L4), TipoValorSlot/ValorConcreto (L2), FamiliaTraerConectados (L3). | Va a `chore(integracion)`. |
| **`Toolbar.tsx` con botones de las 4 líneas**: `+Atributo` (L2 + objectDrag.svg), `Traer` (L3 + addConnected.svg), `Plantilla` (L4 + template.svg), más glue L1. | Commit de integración documenta cada hunk por línea. |
| **`operacionesBatch.ts` integra L3+L4**: `traerConectadosBatch/traerEnlacesEntreBatch/ocultarAparienciaBatch` (L3) y `insertarPlantillaBatch` (L4) en mismo módulo. | Co-residencia explícita en commit de integración. |
| **`opm-smoke.spec.ts` integra 4 líneas de smokes**: HU-17 x3 (L2), HU-1B x2 (L3), HU-33 x4 (L4), HU-30/SHARED x2 (L1). | Hunks aditivos nuevos en commit de integración; tests existentes intactos. |
| **`runtime.ts.crearDemo` ahora usa `fixtureTodos()`**: nueva dependencia desde `modelo/fixtures.ts` (untracked compartido, sin línea atribuible clara). | `runtime.ts` y `fixtures.ts` van juntos a `chore(integracion)`. Catálogo regenerable con `bun run scripts/generar-demos.ts`. |
| **Detector con duplicate-id warnings**: reglas nuevas L5 cubrían HU ya listadas en reglas previas (HU-17.011/.012/.013, HU-30.008/.021, HU-SHARED-002/.007). | Cleanup quirúrgico: HU-30.008/.021 retiradas de regla parcial (528) y declaradas cubierto en regla L1 nueva; HU-17.011/.012 retiradas de regla cubierta genérica (905) y declaradas cubierto en regla L2 nueva específica; HU-17.013 quitada de regla compartida (460). HU-SHARED-002/007 NO redeclaradas (decisión consciente, ver nota de honestidad). |
| **HU-SHARED-002/007 baja MVP-α 0.3 pts**: las reglas previas las tienen parcial; la regla L1 nueva las habría declarado cubierto pero el alcance del cambio L1 (estabilizar smokes) no resuelve undo granular ni OPL inverso. | Aceptado. La métrica refleja la verdad. |
| **Bundle 211.49 kB / 57.39 kB gzip**: sobre objetivo de 195 KB / 55 KB heredado de ronda 11. | Documentado, no remediado en ronda 12. Crecimiento +30 KB respecto a ronda 11 absorbe atributos + plantillas + traer conectados. Optimización candidata para ronda corta (lazy splits adicionales o code-splitting de DialogoTraerConectados/DialogoPlantillas). |
| **`docs/roadmap/hu-progress-*` regenerables**: el operador entregó worktree con timestamps stale del dashboard. | Reverteo a HEAD pre-commits y regeneración limpia con `--sync-real` después de cargar las 9 reglas nuevas. Commit L5 incluye dashboard recién generado. |

## Verificación

Loop verde de consolidación de ronda 12 sobre `main`:

```bash
cd app
bun run typecheck      # tsc --noEmit OK
bun run test           # 659 pass / 2643 expect / 0 fail / 82 archivos
bun run browser:smoke  # 81/81 Playwright pass (~1.5 min)
bun run build          # OK; chunk principal 211.49 kB / 57.39 kB gzip
cd ..
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

Bundle generado:

| Chunk | KB minificado | KB gzip |
|---|---:|---:|
| `vendor-jointjs-*.js` (lazy) | 470.77 | 129.72 |
| `feature-asistente-*.js` (lazy) | 301.36 | 78.47 |
| `index-*.js` (chunk principal) | **211.49** | **57.39** |
| `vendor-*.js` | 134.37 | 47.14 |
| `feature-dialogos-pesados-*.js` (lazy) | 63.58 | 17.47 |
| `vendor-preact-*.js` | 19.86 | 7.91 |
| `feature-mapa-*.js` (lazy) | 13.82 | 4.67 |
| `MenuPrincipal-*.js` (lazy) | 11.84 | 3.41 |
| `feature-modales-*.js` (lazy) | 10.91 | 3.82 |
| `PantallaInicio-*.js` (lazy) | 4.86 | 1.94 |
| `ModalImagenObjeto-*.js` (lazy) | 4.16 | 1.67 |
| `vendor-zustand-*.js` | 0.34 | 0.25 |
| `vendor-jointjs-*.css` | 46.28 | 32.49 |
| `assets/ejemplo-organizacional-*.json` | 15.11 | 2.42 |

Crecimiento del chunk principal vs ronda 11: 181.34 → **211.49 kB** (+30.15 KB)
absorbe atributos + plantillas + traer conectados. Sobre el objetivo
documentado <195 / <55 gzip; deuda explícita para optimización menor.

Estado HU post-recalibración detector ronda 12 (`--sync-real`):

| Segmento | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance |
|---|---:|---:|---:|---:|---:|---:|
| Total backlog | 1126 | 302 | 30 | 416 | 378 | **27.5%** |
| MVP-α | 121 | 110 | 8 | 3 | 0 | **90.8%** |

Detector: **100/100 reglas matched** sobre 351 archivos fuente. 9 reglas
nuevas agregadas para evidencias ronda 12; 4 reglas preexistentes
deduplicadas para mover HU específicas a sus reglas nuevas.

Diagnóstico vigente: 1 advertencia de inventario por ID duplicado
`HU-13.005` (legado pre-ronda-8, fuera de scope ronda 12).

## Estado Por Dominio

- **Modelo/kernel**: estable. Ronda 12 agregó `Entidad.esAtributo? + valorSlot? + TipoValorSlot/ValorConcreto/ValorSlot` (L2), `Plantilla/PlantillaIndice/AmbitoPlantilla` (L4), `FamiliaTraerConectados` (L3). Cero rename. Operaciones nuevas: `crearAtributoEnObjeto/asignarValorAtributo/cambiarTipoValorAtributo/esAtributoDerivado` (L2).
- **Render**: composer entidad emite Nombre [Unidad] {alias} (L2). Composers ronda 8-11 estables. JointCanvas y handlers seleccion intactos en ronda 12 (decisión consciente: MenuContextualEntidad fallback en Toolbar para evitar invadir handlers).
- **OPL**: lente derivada estable. Generadores ronda 8-11 sin tocar. Ronda 12 L2 agrega `app/src/modelo/opl/generador-opl.ts` para "**Atributo** es valor [Unidad]." Tokens `TokenValor/TokenUnidad` aditivos en `tipos/opl.ts`.
- **Canvas**: ronda 12 L3 agrega `canvas/operacionesBatch.ts` con 3 batches nuevos + ronda 12 L4 agrega `insertarPlantillaBatch`. Layout radial nuevo en `canvas/layoutRadial.ts`. Reglas familia en `canvas/reglasTraer.ts`. `seleccionMultiple` extendido con `enlacesInternosSeleccion`.
- **UI/store**: Inspector orquesta SeccionDescripcion (L1) + SeccionAtributo (L2). Toolbar con 3 botones nuevos (drag MIME). MenuPrincipal con entrada Plantillas. DialogoTraerConectados, DialogoPlantillas, DialogoGuardarPlantilla, MenuContextualEntidad nuevos. Slices store con acciones nuevas: `conectarSeleccionAlTodo` (L1), `traerConectados/ocultarApariencia` (L3), `abrir/cerrar/guardar/insertarPlantilla + resaltarTemporalmente` (L4). Runtime con `crearDemo` via fixtures.
- **Persistencia**: JSON conserva todos los campos OPM. localStorage con catálogo de plantillas separado del catálogo de modelos (prefijos disjuntos). `guardarLocal` redirige a `guardarComoLocal` cuando readOnly (L1 cierra HU-30.036).
- **Auditoría**: detector calibrado 100/100 reglas matched. Cobertura HU 27.5% ponderado / MVP-α **90.8%**. 1 advertencia legado pre-ronda-8.

## Pendientes Inmediatos

Tras ronda 12, MVP-α está **90.8% cubierto**. Las **3 HU pendientes + 8 parciales** restantes son:

**Pendientes MVP-α (3)**:

- **HU-10.003** [M0] — Modal nombre tras crear. Existe `data-testid="modal-nombre-cosa"` (ronda 11 L4); afinar regla detector o smoke.
- **HU-30.019** [M0] — Cargar con doble clic.
- **HU-30.020** [M0] — Cargar con clic + botón.

**Parciales MVP-α (8)**:

- **HU-SHARED-002** [M0] — Pila de undo/redo granular. Cubierto operacionalmente; falta evidencia detectada para cada comando inverso.
- **HU-SHARED-007** [M0] — Eco OPL bidireccional editable. Forward cubierto; inverso requiere parser OPL (post-MVP-α).
- **HU-10.021** [C] — Descomposición de objeto en mismo diagrama.
- **HU-11.012** [M0] — Crear enlace estructural etiquetado completo.
- **HU-30.037** [M0] — Cancelar modal con Cancelar o Esc sin persistir.
- (3 más según ledger; consultar `docs/roadmap/hu-progress.md`).

**Pendientes que siguen vivos para post-MVP-α**:

- **EPICA-32 sub-modelos**: candidata ronda 13.
- **EPICA-50 OPL bidireccional fase profunda** (HU-50.019/.020/.022): requiere parser. Ronda post-MVP.
- **EPICA-19 pool organizacional**: multi-user, diferida.
- **EPICA-60/61 export PDF/SVG papel**, **EPICA-71 CSV import**: bloqueadas por regla "no introducir dependencias nuevas".
- **EPICA-31 carpetas/permisos**: single-user MVP no necesita.
- **Optimización bundle**: chunk principal 211.49 kB sobre objetivo 195. Lazy split candidato para `DialogoTraerConectados` y `DialogoPlantillas` (≈8-12 KB ahorro estimado).
- **Outline amarillo #FFFC7F en compositor real**: deuda menor de L4 (HU-33.010 cubrió foco temporal pero el outline visual canónico queda diferido por scope).

Sub-archivo más grande post-ronda-12: `app/e2e/opm-smoke.spec.ts` 3496 LOC
(vs 3047 post-ronda-11; +449 LOC por smokes nuevos), seguido por
`app/src/ui/Toolbar.tsx` 1051 LOC (vs 814 post-ronda-11; +237 LOC por
botones nuevos) y `app/src/canvas/operacionesBatch.ts` 889 LOC (vs 499
post-ronda-11; +390 LOC por batches L3+L4). Particionables si crecen, no
urgentes.

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
2. **MVP-α 90.8%**: estado presentable y demostrable; las 11 HU restantes
   (3 pendientes + 8 parciales) son afinaciones de UX/evidencia o features
   menores que no bloquean validación.
3. Para cierre estricto MVP-α 100%, ronda corta candidata:
   - HU-10.003, HU-30.019/.020 (smokes refinados)
   - HU-SHARED-002 evidencia granular
   - HU-30.037 wrapper Esc verificado
   - Optimización bundle <195 KB (lazy splits diálogos pesados nuevos).
4. Para nueva ronda paralela post-MVP-α:
   - Heredar el formato de `docs/instrucciones-lineas-dev/ronda12/`.
   - Asumir cadenas de efecto kernel→render→OPL→UI.
   - Para features aditivas: tipos opcionales (`?:`), exports nuevos, ningún rename.
   - Si una HU requiere romper firmas, dedicar ronda completa a refactor.
   - Si hay refactor estructural, **recalibrar el detector ANTES de cerrar la ronda**, no después.
   - Reservar el último commit del ciclo para la capa explícita de cascadas resueltas.
   - **Próximas rondas recomendadas**:
     - Ronda 12.1 cierre fino MVP-α 100% + bundle <195.
     - Ronda 13: EPICA-32 sub-modelos.
     - Ronda 14: EPICA-50 OPL bidireccional con parser.
5. Antes de diseñar, consultar `opm-extracted/`, `assets/svg/`, `docs/JOYAS.md` y la SSOT OPM.
6. Cerrar cada cambio con `bun run check`; si toca UI/render: `bun run browser:smoke`; si toca proyección o bundle: `bun run build`.
7. Regenerar auditoría con `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real` antes de publicar un cierre de ronda. **Mantener ≥100/N reglas matched y MVP-α ≥90%; objetivo MVP-α ≥95% post-cierre fino.**

## Exploración de fuentes externas de modelos OPM (2026-05-07)

Se auditó la disponibilidad de modelos OPM descargables desde las dos URLs
públicas de OPCloud (`opcloud.systems`, `opcloud.tech`) y ecosistemas
adyacentes:

**Formatos descubiertos en OPCloud (via `opm-extracted/` decompilado):**

| Formato | Extensión | Origen | Acceso |
|---|---|---|---|
| OPCloud nativo | `.opcl` | `GET /storage/downloadModel?modelId=X` | Auth-gated (Firebase `opcloud-trial`) |
| OPCAT 4.2 | `.opx` (XML) | Desktop Java, Technion | Libre, GPL |
| RDF/Turtle | `.ttl` | Export OPCloud | Requiere modelo cargado |
| SysML XMI | `.xmi` | Export OPCloud | Requiere modelo cargado |
| OPL HTML | `.html` | Export OPCloud | Requiere modelo cargado |

**Lo que NO existe:**
- `.oplx` no es un formato real en el ecosistema OPM. OPL es generación textual.
- No hay repositorio público de modelos `.opcl`/`.opx` accesible sin autenticación.
- El sandbox (`opcloud-sandbox.web.app`) requiere Firebase auth.

**Conclusión**: los 6 modelos en `fixtures/` (extraídos del sandbox antes del
auth-gate) + los 4 modelos demo nuevos en `fixtures/demo-models/` (generados
desde kernel canónico) constituyen el catálogo completo de modelos OPM
disponibles para el proyecto. La ruta OPCAT 4.2 (.opx) queda como opción de
expansión futura (parser completo en `opm-extracted/src/app/ImportOPX/`) pero
EPICA-70 está descartada del scope.

**API REST de OPCloud** (`opcloud-trial.uc.r.appspot.com`): 30+ endpoints
`/storage/*` documentados en `opm-extracted/src/app/database/ServerDatabaseDrive.ts`.
Todos auth-gated. Sin cuenta/token Firebase no son accesibles.
