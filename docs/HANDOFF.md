# HANDOFF — Estado operativo del modelador OPM

**Fecha**: 2026-06-01 · **Repositorio**: `deep-opm-pro` · **Rama**: `main`
**Corte de producto vigente (2026-06-01)**: `BUG-20260601T023324Z-66ff2f` resuelto con marker transformador swallowtail OPCloud/JOYAS; cortes previos relevantes: `5298ec2` revisión jobs-web-ux de UX OPCloud-isomorfa sin copiar gestos, `d794dbf` UX/UI canónica para capacidades OPCloud aspiracionales, `a29e15a` chip `⋯N` de estados ocultos, `e69cf1d` supresión de estados por aparición (per-OPD), `2bbff4e` reanclaje de extremos para enlaces estructurales (BUG-fb6c2c), `9767912` exportación OPL a Markdown + retiro de HTML, `8caf4d1` reconciliación e2e con canon combinado, `e5ff438` exportador de diagnóstico a JSON.
**Instancia**: `https://opforja.sanixai.com` — **HTTP 200 publico** (sin auth, ver Riesgos); `opforja` healthy + `opforja-bug-capture` ok; entry bundle esperado tras redeploy de este corte: `index-D1Ag4Th0.js`.

## Corte actual — BUG-20260601T023324Z-66ff2f, triage vivo y refactor total

**Estado 2026-06-01:** se corrigió el bug visual reportado como `BUG-20260601T023324Z-66ff2f`. La causa raíz era una inversión de criterio: `linkAssets.ts`, pruebas y `ui-forja/08` habían blindado "punta cerrada" como triángulo lleno simple para transformadores, mientras la evidencia curada `docs/JOYAS.md §5` y las capturas OPCloud del bug muestran el marker transformador como **swallowtail cerrado**. La interpretación vigente queda:

- **Consumo / resultado / efecto:** swallowtail cerrado `M 0 0 L 23 8 L 12 0 L 23 -8 Z`, `fill=paper`, `stroke=ink`.
- **Efecto:** mismo marker en source y target.
- **Invocación:** rayo/zigzag en el tramo + punta simple `M 9 -4 0 0 9 4 z`; no usa swallowtail.

**Artefactos tocados:** `app/src/render/jointjs/linkAssets.ts`, `app/src/render/jointjs/composers/markers.test.ts`, `app/e2e/14-canvas-fidelity.spec.ts`, `app/src/modelo/constantes.bauhaus.ts`, `ui-forja/08-jointjs-styling.md`, `docs/bugs/statuses.json`, `docs/bugs/INDEX.md`, `docs/bugs/HISTORY.md`, `docs/bugs/BUG-20260601T023324Z-66ff2f/report.md`.

**Verificación focal:** `bun test src/render/jointjs/composers/markers.test.ts src/render/jointjs/proyeccion.test.ts -t "marker|efecto|procedimentales|transformadores|invocacion"` -> 15 pass / 0 fail. `PW_PORT=5187 bunx playwright test e2e/14-canvas-fidelity.spec.ts -g "modelo markers canonicos" --workers=1` -> 1 pass / 0 fail, con verificación DOM de marker en `defs`.

**Triage activo consolidado:** el índice vivo sigue mezclando bugs resueltos y nuevos porque muchos reportes activos no han sido archivados, pero `statuses.json` ya resuelve los sobrescritos importantes. Prioridad operativa:

1. `BUG-20260530T214922Z-fb6c2c`: el inspector ya permite reanclar estructurales, pero queda pendiente el reanclaje por arrastre de arrowheads en canvas.
2. `BUG-20260526T020725Z-b2477a`: barra de alinear/distribuir visible pero no responde tras el primer uso.
3. `BUG-20260526T021201Z-9cad06`: "estado volador" al seleccionar estado; requiere reproducción visual.
4. `BUG-20260526T020413Z-ec523c`: orden del inspector nombre -> esencia -> afiliación -> descripción; cambio UI acotado.
5. `BUG-20260526T020225Z-f897bc`: OPL más prosaico; requiere diseño, porque el intento anterior rompía refinamiento y resaltado por hecho.

**Auditoría/refactorización total:** hubo ejecución real de refactor, no solo documentación: commits `refactor(...)` extraen viewmodels, puertos, adapter JointJS, persistencia/workspace, OPL/diagnóstico y contratos del store. El cierre vigente, sin embargo, **no está reproducible**: `bun run quality:gate` falla hoy por bundle gzip 135.55 kB > 129.62 kB, cobertura MVP-alpha 84/121 vs mínimo 104, avance alpha 66% vs 86.2%, reglas auto matched 76/105 vs mínimo 89, y dashboard HU stale. Estado correcto: refactorización ejecutada en gran parte, cierre histórico documentado, cierre actual roto o al menos no revalidado.

## Corte actual — UX/UI canónica para capacidades OPCloud aspiracionales

**Estado:** el corte pasa de "kernel sin UX/UI completa" a **superficie UX/UI base implementada en op-forja** para las capacidades objetivo, manteniendo función **isomorfa** y no gestos copiados de OPCloud. La decisión vigente se mantiene: OPCloud es evidencia observacional; la autoridad semántica vive en KORA (`urn:fxsl:kb:reglas-opm-estrictas-es`), OPL operativo vive en KORA (`urn:fxsl:kb:spec-forja-opl-es`), y la interacción de producto se resuelve con patrón op-forja: **runtime/store primero, command palette, inspector y menú contextual**. Los archivos `docs/canon-opm/*.md` son puentes locales.

## Corte actual — Canon OPM/OPL promovido a KORA y enlazado desde deep-opm-pro

Se promovieron a KORA las dos piezas locales de canon que aún vivían completas en `docs/canon-opm/`:

- `urn:fxsl:kb:reglas-opm-estrictas-es` → `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/reglas-opm-estrictas-es.md`
- `urn:fxsl:kb:spec-forja-opl-es` → `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/spec-forja-opl-es.md`

`docs/canon-opm/reglas-opm-estrictas.md`, `docs/canon-opm/spec-forja-opl.md` y `docs/canon-opm/metodologia-forja.md` quedan como **puentes operativos**, no como SSOT. Cualquier cambio de canon debe hacerse primero en KORA, validarse con `python3 toolchain/kora lint-md`, `python3 toolchain/kora check`, reindexarse con `python3 toolchain/kora index`, y recién entonces mantener los puentes estables.

**Decisiones UX/UI aplicadas:**
- **Read-only por `opd.vista`:** `commitModelo` bloquea cualquier mutación cuando el OPD activo es una vista derivada `readOnly`; el puerto de editabilidad lo refleja en UI; la toolbar deshabilita creadores y muestra badge `solo lectura`. Las acciones que aún pueden abrir un diálogo caen igualmente en el bloqueo centralizado del store.
- **Ontología organizacional:** comando "Configurar ontología" en paleta abre un diálogo plano Codex para editar modo `none/suggest/enforce` y términos `canónico = sinónimo, sinónimo`; persiste con `definirOntologiaOrganizacional`.
- **Requisitos estructurados:** paleta, inspector y menú contextual permiten crear `<<Requirement>>`, marcar objeto existente, satisfacer requisito desde cosa/enlace y crear requirement view read-only.
- **Submodelos LF-04:** paleta, inspector y menú contextual conectan un submodelo desde la cosa seleccionada; el inspector lista referencias y permite desconectar. La acción crea vista read-only pero conserva la edición en el OPD padre.
- **Distribuir/recolectar contorno y split TS4/TS5 parcial:** expuestos como comandos de paleta e inspector de enlace; no se replica el gesto de arrastre OPCloud.
- **Resolver decisión XOR:** comando de paleta e inspector de enlace evalúan la política de decisión existente (`estado`, uniforme 50/50, porcentajes o función registrada).

**Artefactos principales nuevos/modificados:** `app/src/store/modelo/acciones-capacidades.ts`; `app/src/store/{modelo,tipos,runtime}.ts`; puertos/viewmodels en `app/src/app/{ports,viewmodels}`; diálogos `app/src/ui/Dialogo{Ontologia,Requisito,Submodelo}.tsx`; superficies `app/src/ui/{CommandPalette,InspectorEntidad,InspectorEnlace,MenuContextualEntidad,ToolbarBase}.tsx`; ejecución contextual `app/src/ui/ejecutarAccionContextual.ts`; pruebas `app/src/store/capacidadesOpcloudUi.test.ts`, `app/src/store/runtime.test.ts`, `app/src/store/acciones-contextuales.test.ts`, `app/src/ui/CommandPalette.test.ts`.

**Verificación del corte UX/UI:** `cd app && bun run check` -> **1798 pass / 0 fail**; `bun run lint` -> OK; `bun run design:governance` -> OK; `bun run build` -> OK; `git diff --check -- app/src docs/HANDOFF.md` -> OK. Deploy: `docker compose up -d --build` OK; `docker compose ps` -> `opforja` healthy; `curl -I https://opforja.sanixai.com` -> HTTP/2 200; assets vivos `index-DCJuglAp.js`, `CommandPalette-B4Fcp9Rv.js`, `DialogoOntologia-Be9YE3k_.js`.

**Handoff explícito / pendientes reales:**
- No afirmar "UX/UI completa OPCloud": la cobertura actual es la superficie canónica mínima de op-forja. Faltan edición avanzada y feedback inline para sugerencias de ontología en modo `suggest`.
- Requirement views y submodel views siguen siendo vistas derivadas simples/snapshots read-only; falta refresh incremental dedicado y navegación/gestión más rica.
- Submodelo LF-04 aún no implementa lazy-load multiarchivo real, rendering transparente de compartidas, ni confirmación modal específica para desconexión irreversible.
- Decisión XOR tiene resolución UI, pero no editor visual completo de las cuatro policies; la policy `funcion` depende del registry runtime y falla explícitamente si no existe.
- Distribución/recolección y split parcial están en inspector/paleta; si se quiere menú contextual de enlace dedicado, hacerlo como adaptación op-forja, no como copia de gesto OPCloud.
- Worktree sigue mezclado con cambios previos ajenos en `docs/bugs/**`, borrados de docs y auditorías sin versionar; no forman parte de este corte ni deben stagearse.

**Prompt breve de continuación:** "Retomar desde `docs/HANDOFF.md` sección `Corte actual — UX/UI canónica para capacidades OPCloud aspiracionales`; cerrar pendientes reales: suggestion UI de ontología, editor de policies de decisión, refresh/navegación de requirement/submodel views, LF-04 lazy-load/compartidas/confirmación irreversible y menú contextual de enlace si aporta a op-forja."

### Actualización jobs-web-ux — revisión de homologación OPCloud sin copiar gestos

**Estado:** se revisó la superficie nueva con `jobs-web-ux` aplicada como criterio de producto: sustracción, copy como UI, command palette/inspector como superficies canónicas y cero "botones mágicos". Se mantuvo la isomorfía funcional con OPCloud, no la mímica gestual.

**Decisiones aplicadas:**
- **Requisitos desde propiedades:** al crear un requisito vinculado desde la cosa/enlace seleccionado, queda visible en `Requisitos vinculados` con acción `Abrir`; la vista de requisito reutiliza el OPD existente si ya fue creada, evitando duplicados invisibles.
- **Ontología:** el diálogo dejó de hablar en `none/suggest/enforce` y muestra `Sin control / Sugerir canónico / Reforzar canónico`, resumen inmediato de términos/sinónimos y microcopy que explica la diferencia operativa entre sugerir y reforzar.
- **Submodelos LF-04:** el diálogo propone defaults útiles (`modelo-<cosa>-detalle`, `<cosa> detalle`), explicita que se crea una vista derivada read-only, y el inspector lista submodelos con estado editable, acción `Abrir` y confirmación antes de desconectar.
- **Requisitos/metadata de enlaces:** el bloque dejó de llamarse "OPCloud"; ahora separa `Satisfied textual` de requisitos estructurados, con copy que dirige a `Crear requisito vinculado` / `Vincular requisito existente`.
- **Contorno, split TS4/TS5 y decisión:** el inspector de enlaces muestra recolectar/distribuir solo cuando aplica; `Resolver decisión` aparece solo si hay política resoluble; el abanico XOR muestra la política visible y desactiva la acción para funciones sin registry runtime.
- **Command palette:** los comandos se nombran según contexto (`Crear requisito vinculado`, `Vincular requisito existente`, `Conectar submodelo` con vista read-only, `Resolver decisión`) para que la operación sea descubrible sin entrenamiento.
- **Calidad visual:** se corrigieron keys duplicadas en swatches de estilo (`StyleControls`) porque el smoke detectó warnings de render al seleccionar cosas.

**Verificación de esta actualización:** smoke Playwright manual en dev (`ontology`, requisito vinculado, submodelo, navegación read-only) -> OK sin `pageerror`/`console.error`; `cd app && bun run check` -> **1800 pass / 0 fail**; `bun run lint` -> OK; `bun run build` -> OK (`index-H8aGiLp7.js` local); `bun run design:governance` -> OK; `git diff --check -- app/src` -> OK. Deploy posterior: `docker compose up -d --build` OK; `opforja` healthy; `bug-capture` OK; `curl -fsSI https://opforja.sanixai.com/` -> HTTP/2 200; bundle vivo `index-B3ytqv2I.js` con chunks `CommandPalette-BrWQTeA5.js`, `DialogoOntologia-CbUMg9or.js`, `DialogoSubmodelo-IvGEHQIe.js`.

**Pendientes tras esta actualización:** sigue pendiente el editor completo de policies de decisión, sugerencias inline de ontología, refresh dedicado de requirement/submodel views, lazy-load real LF-04 y gestión rica de compartidas transparentes. No clonar gestos OPCloud: cualquier siguiente superficie debe pasar por inspector, command palette o menú contextual op-forja.

**Prompt breve de continuación:** "Retomar desde `docs/HANDOFF.md`, sección `Actualización jobs-web-ux — revisión de homologación OPCloud sin copiar gestos`; continuar con editor de policies de decisión, suggestion UI de ontología y refresh/navegación avanzada de requirement/submodel views, manteniendo kernel -> store -> UI y superficies canónicas op-forja."

## Corte actual — Supresión de estados POR APARICIÓN (per-OPD) + chip de conteo (sesión 2026-05-31)

**1. Supresión de estados por aparición (`e69cf1d`, 13 archivos, estilo OPCloud `suppress`/`suppressAll`/`expressAll`).** Se añade ocultar estados de un objeto en un OPD concreto **sin** afectar otras apariciones ni el modelo global, **conservando** la supresión GLOBAL (`Estado.suprimido`) intacta como override maestro. Diseño sellado con `cat-thinking` (`urn:fxsl:kb:icas-topoi`): la visibilidad de estados es un presheaf `Vis : OPD^op → Set`; el dato local vive en la **fibra** `Apariencia.estadosSuprimidos: Id[]` (no en `Estado`, que colapsaría las fibras); visibilidad efectiva = **meet** en Ω `visible = ¬global ∧ ¬local` (global domina, local refina); global y local son **ortogonales** (quitar la global no resucita lo ocultado localmente). SSOT del predicado + ops puras en `app/src/modelo/visibilidadEstados.ts` (`estadoVisibleEnAparicion`, `suprimir/mostrar[Todos]EnAparicion`); rechaza estados con enlaces incidentes (paridad con la global). Capas: campo en `apariencia.ts`; render filtra cápsulas por el predicado efectivo (`composers/{estados,entidad}.ts`, índices `stateCapsuleN` alineados); store expone 4 acciones vía la selección de estado ciudadano; UI "Ocultar/Mostrar (todos) en esta vista" en `MenuContextualEstado.tsx`; validador `validarApariencias.ts` sanea el campo; ley `leyes/supresion-estados-aparicion.test.ts` (no-contaminación entre apariciones, global-domina, ortogonalidad, render, roundtrip). Compat hacia atrás: campo opcional, ausente = ninguno.

**Incremento 2 — OPL por-OPD refleja la supresión local (decisión del operador "reflejar en OPL", SELLO 4 resuelto).** El generador (`opl/generar.ts`) ya itera `opd.apariencias`, así que enumera por la fibra usando `estadoVisibleEnAparicion`: el OPL de un OPD lista solo los estados visibles en *esa* vista. **Bisimetría preservada**: el parser reverse NO borra estados por omisión y alinea posición→id por refs/nombre, así que un OPL con estados ocultos por supresión local hace roundtrip sin corromper ni renombrar el estado oculto (tests "incremento 2" en `opl/generar.test.ts`: vista + roundtrip generar→parsear→aplicar).

**2. Chip `⋯N` de conteo para estados ocultos (`a29e15a`, 2 archivos).** El badge de esquina pasa de un `…` plano a un **chip hairline en tinta** (`rect` paper + borde ink `rx/ry`=pill detrás del `text`) con el **conteo** de estados ocultos en la vista (`⋯N`) y tooltip pluralizado ("N estados ocultos en este OPD"). El badge se dispara por supresión de **cualquier** causa (global o local) en esa aparición. Gobernanza: crimson queda fuera (UI-only, no marca semántica en el OPD, `ui-forja/06 §100`) → expresividad tipográfica, no cromática; `bun run design:governance` OK. Conteo `suppressedCount` transportado por `metadatosEntidad`; ancho del chip dinámico por dígitos.

**Gate del corte:** `bun run check` → **1786 pass / 0 fail**; lint limpio; `design:governance` OK. **Desplegado** en `opforja.sanixai.com` (entry bundle `index-DWseXsaH.js`; chip en `index-DWseXsaH.js`, supresión en `feature-dialogos-pesados`/`index`), HTTP 200, healthy. **Artefactos nuevos:** `app/src/modelo/visibilidadEstados.ts` (+test), `app/src/leyes/supresion-estados-aparicion.test.ts`.

## Corte previo — Reanclaje estructural + OPL a Markdown + reconciliación e2e (sesión 2026-05-31)

**1. Reanclaje de extremos en enlaces estructurales (`2bbff4e`, BUG-20260530T214922Z-fb6c2c).** La sección "Extremos" del inspector de enlaces (selectores + "Reanclar extremo"/"Mover ancla exacta" → `DialogoMoverPuerto`) se ocultaba para todo enlace no-procedural (`SeccionExtremos.tsx` retornaba `null`), dejando a los estructurales fundamentales sin vía para reasignar su cosa origen/destino — aunque el kernel (`apuntarExtremoEnlace` + `validarFirmaEnlace`) ya lo admitía. Fix: predicado `seccionExtremosVisible` (procedural ∪ estructural fundamental); el bloque de fan/abanico y los selectores de estado quedan solo para procedurales (los estructurales rechazan extremos Estado, V-237). **Brecha viva**: el reanclaje por **arrastre de arrowheads en canvas** sigue roto para estructurales (compuesto triangular `-refinable`/`-refinador`); reanclar funciona hoy solo por el inspector. Arreglar el canvas requiere instalar SourceArrowhead en `-refinable` y TargetArrowhead en `-refinador` (cirugía multi-celda en `toolsEnlace.ts`/`composers/enlace.ts`).

**2. Exportación de OPL a Markdown + retiro total de HTML (`9767912`).** Las frases OPL ya nacen en Markdown inline (`**objeto**`, `*proceso*`, `` `estado` ``), así que exportar a Markdown sólo las envuelve. Kernel puro `app/src/opl/exportarMarkdown.ts`: `exportarOplOpdMarkdown` (OPD en vista, `# {modelo} — {OPD}` + viñetas) y `exportarOplModeloMarkdown` (modelo completo, `# {modelo}` + sección `## {OPD}` por OPD en recorrido jerárquico). Superficies: **panel OPL** botón "copiar md" (`copiarOplActualAlPortapapeles`, OPD en vista) y **paleta Cmd+K** comando "Exportar OPL del modelo (Markdown)" (`copiarOplModeloMarkdownAlPortapapeles`, modelo completo, sección EXPORTAR). **HTML retirado por completo** por decisión del operador: se eliminó `generarHtmlOpl` (de `runtime.ts` y de 7 barrels que lo importaban muerto), la acción `exportarOplActualHtml` y los botones `html`/`exportar` del panel. Ya no se genera ningún archivo HTML.

**3. Reconciliación e2e con el canon combinado (`8caf4d1`).** `e2e/03` y `e2e/12` cargaban aserciones obsoletas desde `59ad3a9` (D1 recombinó esencia+afiliación en una sola oración "forma OPCloud", revirtiendo el split de `245b031` del 25-may sin actualizar los e2e). Corregidas a la forma combinada (counts 5→3 y 2→1; "Cliente" 3→2; "X es un objeto físico y ambiental." en vez de dos oraciones; "OPL · 1 oraciones"), más el color de hover del token OPL (`rgb(238,236,226)` = `paperWarm`/`#eeece2` vigente, antes `#f4f3ec`) y un stub de `navigator.clipboard` en el e2e de diagnóstico (evita `pageerror` por permiso de clipboard en headless). Causa raíz = deriva de tests vs canon/token, **no regresión de producto** (unit verdes afirman la combinada; `src` intacto, sin redeploy). Verificado con `PW_PORT` (servidor propio, evita la colisión con el vite de `hd-hsc-os` en :5173): 19 passed / 1 skipped.

**Gate sesión:** `bun run check` → 1756 pass / 0 fail; lint limpio. e2e nuevos: panel copia Markdown (03), paleta copia modelo completo (12), reanclaje estructural expone botones (30). **Artefactos nuevos:** `app/src/opl/exportarMarkdown.ts` (+test), `app/src/ui/inspectorEnlace/SeccionExtremos.test.ts`, `app/e2e/30-reanclaje-estructural.spec.ts`.

## Corte previo — Exportador de diagnóstico del modelo a JSON (paleta de comandos)

**Commit `e5ff438` (atómico, 8 archivos):** nuevo comando **"Exportar diagnóstico (JSON)"** en la paleta (Cmd+K), sección EXPORTAR, que **copia al portapapeles** un JSON con **todas las sugerencias del diagnóstico del modelo completo** (alcance `{ tipo: "modelo" }`). Sin descarga de archivo, sin botón en panel — solo paleta, por decisión del operador.

**Forma del JSON** (envoltorio + array, indentación 2): `{ modelo, fecha, alcance: "modelo", totales: { bloqueo, mejora, estilo, total }, sugerencias: [ { id, origen, severidad, codigo, titulo, mensaje, destino, citaSSOT, opdId?, elementoId?, elementoTipo? } ] }`. La `severidad` es la **clasificada visible** (bloqueo/mejora/estilo) vía `severidadDiagnostico`, no el `SeveridadAviso` crudo, para que el JSON coincida 1:1 con el panel. Se omiten campos no serializables (`navegar`, `avisoNavegable`). Fecha inyectable para tests deterministas.

**Decisión de capa (relevante):** la serialización es función pura del kernel (`app/src/modelo/exportarDiagnostico.ts`). Como `severidadDiagnostico`/`severidadDesdeAviso` vivían en `app/viewmodels/` y `modelo/` no puede importar hacia arriba (regla de dependencia unidireccional), se **movieron al kernel** `app/src/modelo/diagnosticoSeveridad.ts` (donde ya viven `clasificarSeveridad`/`SeveridadIssue`) y el viewmodel ahora las **reexporta** para no romper consumidores. La clasificación de severidad es lógica de dominio pura; su sitio natural es el kernel.

**Artefactos:** `app/src/modelo/exportarDiagnostico.ts` (+`.test.ts`, 8 unit), `app/src/modelo/diagnosticoSeveridad.ts` (severidad movida), `app/src/app/viewmodels/panelDiagnosticoViewModel.ts` (reexport), `app/src/app/viewmodels/commandPaletteViewModel.ts` (`exportarDiagnosticoAlPortapapeles`), `app/src/ui/CommandPalette.tsx` (+`.test.ts`, ítem `exportar-diagnostico`), `app/e2e/12-command-palette.spec.ts` (e2e paleta). Gate: `bun run check` → **1750 pass / 0 fail**; lint limpio; e2e 7/7. Verificado en bundle desplegado (chunk `CommandPalette-BLPl2eGv.js`).

**Nota de flujo (e2e):** Playwright con `reuseExistingServer` se conecta al primer vite en `:5173`; si hay otro proyecto sirviendo ahí (p.ej. `hd-hsc-os`), usar `PW_PORT` libre o apagar el otro vite antes de correr el smoke de este repo.

## Corte previo — D1 esencia/afiliación combinada (forma OPCloud) + cierre de remediación GAP OPL + auditoría de divergencias OPL vs OPCloud (rama `codex/remediacion-gap-opl`, integrada a `main`)

**D1 combinada (commit `59ad3a9`):** `oracionEntidad` compone UNA oración con sustantivo de tipo — `**Cosa** es un {objeto|proceso} {esencia} y {afiliacion}.` (p.ej. `*Rescatar* es un proceso informacional y sistémico.`) — en vez de dos oraciones escindidas sin sustantivo de tipo. Es la forma del eco OPCloud (`docs/historias-usuario-v2/shared/HU-SHARED-007-eco-opl.md`), consistente con la coordinación canónica de D5/D10. El parser ya reconocía la forma combinada (roundtrip preservado). Se invirtió la doctrina previa en spec-forja (R-ENT-3, §2.7, §2.8, §9 R-COMP-ELEG-2) y el comentario de `estructural.ts`; bajo `solo-difiere` coordina solo lo que difiere del default. Gate: `bun run check` → 1741 pass / 0 fail; lint OK. Tests/fixtures actualizados por el cambio de forma e índices de línea.

**Remediación GAP OPL (ejecutada en 3 olas, commits del operador y del agente):**

**Ola 1 — bugs reales cerrados con TDD:**
- Placeholder OPL: `refsHints.ts·entidadOplEsEmitible` suprime procesos placeholder usando `esNombreProcesoPlaceholder`.
- INPUT-only: evento/condición sobre resultado e invocación degradan a la oración base; se elimina la emisión no canónica `puede generarse` en fan resultado+condición.
- Invocación: emisión canónica `después de`; parser compatible con `despues de` legacy.
- Probabilidad: export OPL emite `Pr=p` y retira el sufijo porcentual legacy; parser descarta `Pr=p` como anotación de superficie.

**Ola 2 — spec-forja ajustada:**
- `docs/canon-opm/spec-forja-opl.md` reclasifica `GAP-XOR` como `GAP-XOR-FEATURE`, documenta `unidades-tiempo` como metavariable, ubica colisión/recomposición en kernel de modelo, deja `GAP-COMP-GUARDA` como no-aplicable hasta `GAP-COMPOSICION`, y traza helpers display/metadatos antes marcados `GAP-spec`.
- §20 quedó sincronizada con los fixes: placeholder, modificadores inválidos, invocación, probabilidad, fan resultado+condición, click→foco fuera de `app/src/opl/**`.

**Ola 3 — fixtures roundtrip:**
- `app/src/opl/fixtures-roundtrip.ts` agrega fixtures de efecto básico, TS3/TS4/TS5, habilitadores con estado HS1/HS2, exhibición, clasificación, evento canónico, invocación/autoinvocación con tilde y degradación evento→invocación base.
- Las familias con reverse incompleto desde modelo vacío quedan explícitamente `bisimetricaEstricta: false`; las rutas ya cerradas quedan estrictas.
- `docs/canon-opm/spec-forja-opl.md` marca esos fixture gaps como cerrados o cerrados-para-emisión, manteniendo vivos solo los gaps reales de parser/procedencia.

**Auditoría de divergencias OPL vs OPCloud (commit `952346d`, `docs/auditorias/2026-05-26-alineacion-opl/divergencias-opcloud.md`):** se buscaron todas las divergencias entre la generación OPL de OPFORJA y el eco OPCloud (HU-SHARED-007), **arbitrando cada una por precedencia** (canon supremo `reglas-opm-estrictas`+`opm-opl-es` manda; OPCloud observacional). Resultado: **solo D1 era adoptable** (ya hecho). Las otras divergencias son **eco OPCloud equivocado** que OPFORJA correctamente NO clonó: D5 estados (`puede ser` es mal-traducción de "can be"; canon = `puede estar`), agregación (`consiste en` vs canon `consta de`), T6 dirección de habilitador (HU invierte sujeto/objeto). **Cero GAP-OPCLOUD de código nuevo; OPFORJA está alineado al canon.** Confirmado además que `duracionMetadata.ts:69` emite `puede estar` (el viejo bug C1 está resuelto). Lección: el eco OPCloud no es fiel al canon en ≥3 formas — OPCloud es observacional, no autoridad.
**Backlog vivo**: features/parsers diferidos de la auditoría §4: `GAP-XOR-FEATURE/PARSER`, `GAP-ABANICO-AGENTE-PARSE`, `GAP-TAG-PARSER`, `GAP-SSE-PARSER`, `GAP-CX-PARSER`, `GAP-FAN-EVENTO`, `GAP-FAN-M`, `GAP-COMPOSICION/GAP-COMP-REVERSE`, `GAP-PARSE-TS4/TS5`, `GAP-PROCEDENCIA-ESCIND`, `GAP-NOMBRE-INSTANCIA`, `GAP-VARIA/TIPO/REFINA/PLIEGA/RECOMPONE`.

## Corte previo — spec-forja OPL: SSOT OPL consolidada de OPFORJA (producida)

Se produjo `docs/canon-opm/spec-forja-opl.md` (~3069 líneas), hoy promovida a KORA como `urn:fxsl:kb:spec-forja-opl-es`: la **SSOT OPL única, bidireccional y operativa** de OPFORJA, conforme 100% a las specs KORA aplicables (KORA/MD v12 familia `spec` + spec-md v1 + knowledge-spec v3). Brainstorming → diseño (`docs/superpowers/specs/2026-05-26-spec-forja-opl-design.md`) → plan (`docs/superpowers/plans/2026-05-26-spec-forja-opl.md`) → ejecución subagent-driven (18 tareas, un `opm-specialist` por sección, commits aislados de solo-docs en `main`).

**Decisiones selladas**: SSOT única consolidada (absorbe `opm-opl-es`+`reglas §4` para OPFORJA); bidireccional (generación+parser+presentación+roundtrip); precedencia `urn:fxsl:kb:reglas-opm-estrictas-es` > Dori > OPCloud > curso; eje ontológico con contrato por constructo; combinatoria amplia + composición de prosa (§9) + patrones sociotécnicos/agénticos (Apéndice B); conformidad KORA en forma y en catálogo (`urn:fxsl:kb:spec-forja-opl-es`); OPL solo es-CL sin EN↔ES.

**Contenido**: 4 secciones de preámbulo (Definición/Definiciones/Precedencia/Convenciones) + §1–§20 cuerpo (vocabulario, entidades, transformadores, habilitadores, modificadores, estructurales, refinamiento, combinatoria, **§9 composición de prosa** que resuelve BUG-f897bc por sub-spans con `ref`/`hint` por hecho, multiplicidad, ruta, plegado, panel, interacción, edición, configuración, fallos, EBNF, roundtrip, **§20 trazabilidad**) + §21 Invariantes/§22 Validación-con-`Enforcement`/§23 Migración + Apéndices A (ejemplo end-to-end), B (5 patrones sociotécnicos/agénticos, 4 canon + 1 extensión declarada), C (índice de IDs). Orden = esqueleto spec-md §10.

**Hallazgo de valor — GAPs código↔canon (§20)**: 53 filas en tabla maestra, **44 GAPs consolidados**, **4 GAP-spec** (código sin entrada). GAPs notables: GAP-EVENTO-RESULTADO/GAP-CONDICION-RESULTADO (el generador emite evento/condición de resultado violando la regla INPUT-only de modificadores), GAP-XOR/XOR-PARSER (`puede ser` especialización XOR sin generador ni parser), GAP-PLACEHOLDER-ENTIDAD (`entidadOplEsEmitible` siempre true → supresión de placeholders no cableada), GAPs de fixtures roundtrip, GAP-COMPOSICION (capacidad nueva).

**Verificación (gates KORA)**: hedging 0; EN↔ES 0 (solo mención legítima de la regla); `Traces to:` 0 usos reales (2 menciones que prohíben su uso); tabla `Validación` con columna `Enforcement`; 30 secciones H2 en orden de esqueleto `spec`. `status: borrador` (pendiente promover a `publicado` si el operador aprueba). Commits `f59c9b4`..`9896e5e` (solo-docs, aislados de los cambios in-flight del operador en `app/`).

**Pendiente derivado (corte siguiente)**: **auditoría de alineación del sistema de generación/parser** (`app/src/opl/**`) contra esta spec, usando la tabla §20 como punto de partida — cerrar cada `GAP-*`.

## Corte previo — Auditoría de canon `reglas-opm-estrictas.md` vs SSOT OPM

Se auditó la SSOT suprema operativa (`docs/canon-opm/reglas-opm-estrictas.md`, hoy promovida a `urn:fxsl:kb:reglas-opm-estrictas-es`) contra la SSOT OPM original externa (`/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`: `opm-iso-19450-es.md`, `opm-opl-es.md`, `opm-visual-es.md`, `metodologia-opm-es.md`) en 4 líneas paralelas (un `opm-specialist` por dimensión: visual, OPL, ISO/ontología/enlaces, metodología/refinamiento).

**Veredicto: cero conflictos semánticos de canon.** El archivo es fiel a OPM en entidades, taxonomía de enlaces, vocabulario/plantillas OPL-ES (verbos 1:1 con SSOT, EBNF y equivalencia EN↔ES consistentes), primitivas visuales, geometría de abanicos y mecanismos de refinamiento. Los hallazgos fueron **extensiones de producto presentadas como canon SSOT sin marcar** (no contradicciones).

**Correcciones aplicadas (marcado de procedencia, sin alterar fuerza prescriptiva):**
- **§3.12 R-LAY-1 / R-LAY-2**: umbral graduado + bloqueo de export y re-ruteo automático obligatorio marcados como *extensión de implementación* sobre `V-50`/`V-51` (que solo fijan límite de legibilidad y minimización de cruces).
- **§4.13 R-ATR-3..6**: unidades/dominios/intervalos/mutabilidad marcados como extensión local; `SSOT-opl §14` solo canoniza las plantillas textuales.
- **§4.12 R-OPL-RUTA-3**: la restricción a consumo/resultado marcada como decisión de producto; `A.5` admite cualquier procedimental tras `Por ruta`.
- **§8.4 R-ESC-1A**: la escisión como mecanismo *único* marcada como endurecimiento local; `SSOT-metod §7.4` la describe como *la* resolución pero sin exclusividad.
- **§5.8 R-ROL-UNIC-1**: distingue unicidad de rol (canon ISO) de la resolución por fuerza semántica (capa visual, §6.5).

**Falsos hallazgos descartados tras verificación directa (no se tocaron):**
- §5.7 R-EXC-1A (excepción ambiental): correcto — `SSOT-visual §4.4` lo dice literalmente.
- "V-N son evidencia OPCloud": falso — §1.2 ya define `V-N` como reglas de `opm-visual-es.md`.
- §6.5/§6.6 "mal atribuidos a ISO": ya citaban `SSOT-visual §13.x`/`V-43`/`V-44` inline.
- Anexo B R-VIS-DUR-1 (formato duración): R-VIS-DUR-1 + R-VIS-DUR-2 cubren el formato completo de `V-45` entre ambas.

**Artefacto:** `docs/canon-opm/reglas-opm-estrictas.md` (7 inserciones / 5 borrados), actualmente puente local a `urn:fxsl:kb:reglas-opm-estrictas-es`. Corte de solo-docs, aislado de los cambios in-flight del operador en `app/src/**` y de la cola de bugs.

## Corte previo — Ronda de bugs UX delegada (captura/atajos/paneles)

Se paralelizó la resolución de una ronda de bugs reportados desde el capturador en producción, repartidos en **5 líneas con dominios disjuntos** delegadas a subagentes, con reconciliación final (gate unit + e2e afectado). **6 bugs resueltos, 1 revertido por requerir diseño.** El operador integró el resultado commiteándolo atómicamente en `main` (ver hashes arriba) y resolvió en paralelo bugs adicionales (atributos, usabilidad de modelos, contraste de paleta).

**Decisiones aplicadas (resueltos):**
- **BUG-5a6c58** — atajo del capturador de bugs cambia de `Alt+Ctrl/Cmd+B` a **`Shift+Ctrl/Cmd+B`** (`CapturadorBugs.tsx`); e2e `10-capturador` reconciliado al nuevo combo.
- **BUG-c76a40 + BUG-58fefc** — atajos de canvas (`O/P/S/R`) no disparaban tras cambiar de OPD por **click** en el árbol: el foco quedaba en `[data-atajos-contexto="panel-arbol"]`. Fix en `atajosTeclado.ts` `contextoDesdeEvento`: si el panel contextual no tiene registro propio para ese combo, cae a `canvas`. `R` sigue exigiendo cosa seleccionada **por contrato** (no se tocó).
- **BUG-fbb0f1 + BUG-f23d0a** — apilamiento de paneles: Inspector y diagnóstico pasan a columna flex (un solo scroll, diagnóstico acotado a `40%`) en `App.tsx`/`inspectorStyles.ts`; la barra de simulación se vuelve overlay `position:fixed; top:60; zIndex:30` en escritorio/tablet (`BarraSimulacion.tsx`).
- **BUG-895504** — auditoría de canonicidad de la barra superior: **veredicto canónica** (cero hex hardcodeado, sin sombras offset, tipografía/colores por token; `design:governance` OK). Sin cambios de código.

**Revertido (pendiente de diseño):**
- **BUG-f897bc** — "OPL más prosaico con cópulas/conectores". Se implementó agrupación enumerada estructural ("A exhibe B, C y D" en una frase, bisimétrica) pero **colisiona con la ruta de refinamiento/despliegue (HU-50.015)**: fusiona los enlaces hijos de un objeto refinado en la forma plural "son", eliminando las frases individuales con token-verbo + ref por enlace que el resaltado interactivo necesita (rompía 7 tests en `generar.test.ts`). Se revirtió. Requiere diseño: excluir de la agrupación los enlaces en contexto de despliegue/refinamiento preservando tokens por enlace.

**Artefactos relevantes (7 archivos, solo `app/`):** `src/ui/CapturadorBugs.tsx`, `src/ui/atajosTeclado.ts` (+ `.test.ts`), `src/ui/App.tsx`, `src/ui/inspectorStyles.ts`, `src/ui/simulacion/BarraSimulacion.tsx`, `e2e/10-capturador-bugs.spec.ts`.

**Verificación del corte:**
- `cd app && bun run check` → **1707 pass / 0 fail**, typecheck limpio.
- e2e afectado (`10`, `12-beta2`, `30-simulacion`, `inspector-focus`, `23-inspector-resize`, `--workers=1`) → **15/16 pass**. El único fallo (`12-beta2:260` B0.026) es **pre-existente y ajeno**: su aserción espera `"system diagram"` pero el modelo del propio test se llama `"Sim multi OPD"` y la importación no se aplica; ningún archivo tocado roza el flujo de import/breadcrumb.

**Estado / pendientes derivados:**
- El **marcado `Resuelto` en `docs/bugs/*` y la regeneración de `INDEX.md`/`HISTORY.md` (`cd app && bun run bug:index`) quedan al flujo del operador**: no se incluyeron en este commit para mantenerlo aislado y atómico (el índice ya contiene ~24 capturas nuevas sin triar de la cola del operador).
- Bugs nuevos sin abordar en esta ronda (cola de triage): `0e3997, ec523c, b2477a, e7fe11, 9cad06, 86aa78, 738f53, 679f28, 142989, f28eb5, b768d4, 00f799, f81da4, 4c5463, 16a874, 5d7651, 0c3cde, a41f5c`.

## Corte previo — Auditoría prescriptiva Jobs + IFML: primer paint vacío y sin demo

Se ejecutó el P0 de `docs/auditorias/2026-05-26-jobs-ifml-opforja-prescriptivo/informe-prescriptivo-ui-ux-opforja.md`: Opforja deja de abrir como demo/asistente y pasa a abrir como herramienta de modelado vacía, honesta y lista para trabajar. El estado inicial real es `Modelo` + `SD`, sin OPL precargada y sin `System Diagram` como etiqueta visible por defecto.

**Decisiones aplicadas:**
- Se eliminan las superficies de onboarding, bienvenida, asistente, ejemplos, fixtures demo y plantillas guardadas como experiencia de producto. El primer paint queda vacío; el usuario empieza modelando, no descartando una demo.
- La command palette conserva acciones reales de trabajo y depuración, pero retira asistente/ejemplos/plantillas; con búsqueda activa sólo muestra grupos con resultados y el vacío queda como `sin resultados - escribe otro comando`.
- El capturador de bugs deja de exponer FABs visibles. Se mantiene operativo por atajos/command palette y por el sidecar de producción.
- `Abrir/importar` deja de sugerir ejemplos: el diálogo queda como `Abrir modelo` con acción primaria `Abrir`.
- El inspector vacío se reduce a `Selecciona un elemento.` y el breadcrumb base queda `modelo · sd`.
- La limpieza se hace también en store/runtime/persistencia/e2e para no dejar puertos, acciones o pruebas dependientes de la experiencia demo.

**Artefactos relevantes:**
- Auditoría fuente: `docs/auditorias/2026-05-26-jobs-ifml-opforja-prescriptivo/` (informe, evidencia y screenshots).
- UI removida: `PantallaInicio`, `bienvenida`, `asistente/*`, `DialogoPlantillas` y sus puertos/viewmodels.
- Store/runtime limpiado: acciones y estado de asistente, bienvenida, fixture demo y plantillas; persistencia de plantillas retirada del workspace.
- Superficie actualizada: `CommandPalette`, `DialogoCargarModelo`, `CapturadorBugs`, `Inspector`, `Breadcrumb`, `EstadoVacioOpm`, `ChipPersistencia`.
- E2E: helpers pasan de cerrar bienvenida a esperar workbench inicial; specs obsoletas de onboarding/catálogos demo se eliminan o se convierten en aserciones negativas.

**Verificación del corte:**
- `cd app && bun run check` -> **1705 pass / 0 fail**.
- `cd app && bun run lint` -> OK.
- `cd app && bun run build` -> OK.
- `cd app && bun run design:governance` -> OK.
- `git diff --check -- app/src app/e2e docs/HANDOFF.md docs/auditorias/2026-05-26-jobs-ifml-opforja-prescriptivo` -> OK.
- `cd app && bunx playwright test e2e/01-carga-y-workspace.spec.ts e2e/12-command-palette.spec.ts e2e/12-toolbar-overflow.spec.ts e2e/21-estado-vacio-opm.spec.ts e2e/27-visual-compliance-25-05.spec.ts` -> **27/27 verde**.

**Estado:** commiteado sobre `main` y desplegado en `https://opforja.sanixai.com` con bundle `index-Cjnl1ime.js` (`docker compose up -d --build`; `opforja` healthy + `bug-capture` up; healthz interno `ok`; `curl -I` externo `HTTP/2 200`; certificado Let's Encrypt R13 vigente hasta 2026-08-16). Mantener fuera del commit de producto los artefactos locales no relacionados: `docs/bugs/**`, `docs/auditorias/2026-05-26-jobs-web-ux-opforja/` y `docs/instrucciones-lineas-dev/ronda-refactor-eje-a/`.

## Corte previo — Tier 1 completo: simulación numérica CSV + e2e de cierre

Se cierra la brecha **F** del Tier 1 (auditoría Opforja vs manual simulado OPCloud): la simulación numérica queda conectada de extremo a extremo a la UI, con export CSV. También se cierran los e2e de las brechas ya integradas (esencia OPL y colisión de nombre), dejando el corte Tier 1 verificado end-to-end.

**Decisiones aplicadas:**
- `generarDatosSimulados` (kernel existente) se conecta vía `DialogoSimulacionNumerica`, abierto desde el command palette (doctrina ⌘K-only), con N corridas síncronas, tabla de resultados y descarga CSV.
- `filasSimulacionACsv` es una función pura con escape estilo RFC-4180, sin dependencias nuevas; columnas = atributos con `esAtributo && valorSlot && simulacion.simulable`; estado vacío guía a marcar atributos simulables.
- Fuera de este corte (diferido): corridas async, export Excel, y la visibilidad de unidades/alias en OPL (tejida en la capa de nombres OPL — hints/parser/roundtrip; merece su propio corte).

**Artefactos relevantes:**
- `app/src/modelo/simulacion/csv.ts` (+ test) — `filasSimulacionACsv` puro.
- `app/src/ui/DialogoSimulacionNumerica.tsx` + `app/src/app/ports/{,zustand}simulacionNumericaDialogPort.ts` + viewmodel + `CommandPalette.tsx` + `App.tsx` — UI de simulación numérica.
- Tests focales: `e2e/30-simulacion-numerica.spec.ts`, `e2e/29-colision-nombre.spec.ts`, `e2e/28-opl-visibilidad-esencia.spec.ts`, `src/modelo/simulacion/csv.test.ts`.

**Verificación del corte:**
- `cd app && bun run check` -> **1755 pass / 0 fail**.
- `cd app && bun run lint && bun run build && bun run design:governance` -> OK.
- `cd app && bunx playwright test e2e/28-opl-visibilidad-esencia.spec.ts e2e/29-colision-nombre.spec.ts e2e/30-simulacion-numerica.spec.ts` -> **7/7 verde**.

**Estado:** commiteado y pusheado a `origin/main` y **desplegado** en `https://opforja.sanixai.com` (bundle `index-i8iXchqs.js`, `docker compose up -d --build`; `opforja` healthy + `bug-capture` up; HTTP/2 200).

**Procedencia (auditoría de cobertura Opforja vs manual simulado OPCloud):** 369 capacidades evaluadas → **47% cubierto / 24% parcial / 29% ausente**. El Tier 1 cerró las 3 brechas reales de mayor valor y bajo riesgo (A esencia OPL · B colisión de nombre · F simulación numérica CSV). Ausencias mayores que siguen abiertas: stereotypes, ontología organizacional, métricas del modelo, requisitos estructurados, informative grading, missing-knowledge (ver Pendientes).

## Corte previo — resolucion base de colisiones de nombre + captura viva

Se consolida el siguiente incremento sobre `main`: el capturador sigue escribiendo artefactos versionables en `docs/bugs/` y el flujo de nombres duplicados deja de caer en error seco. La deteccion pura ya integrada se conecta ahora con estado suspendido, resolutores y un dialogo Codex minimo.

**Decisiones aplicadas:**
- Si una creacion inline intenta usar un nombre canonico existente, la operacion queda suspendida en `colisionPendiente` y se abre `DialogoColisionNombre`.
- En creacion con mismo tipo, `Reutilizar` elimina la entidad provisional y crea una nueva aparicion de la entidad existente en la posicion original, en un commit undo atomico.
- En creacion o rename, `Usar otro nombre` aplica `renombrarEntidad`; si el nuevo nombre sigue siendo invalido, se preserva el mensaje de dominio.
- En cancelacion de creacion suspendida, la entidad provisional se elimina para no dejar basura semantica.
- El bug vivo `BUG-20260525T233828Z-895504` queda registrado como pendiente de auditoria de barra superior.

**Artefactos relevantes:**
- `app/src/store/modelo/acciones-entidad.ts`, `acciones-ui.ts`, `contrato.ts`, `store/tipos.ts` — estado y resolutores de colision.
- `app/src/ui/DialogoColisionNombre.tsx`, `App.tsx` — UI modal tipografica sin chrome pesado.
- `app/src/store.test.ts` — regresiones de suspension, reuso, renombrado alternativo y rename sin mutacion prematura.
- `docs/bugs/BUG-20260525T233828Z-895504/`, `docs/bugs/INDEX.md`, `docs/bugs/HISTORY.md` — artefacto capturado por operador.

**Pendientes derivados:**
- Reauditar visualmente la barra superior con el bug nuevo y decidir si se resuelve con ajuste de diseño o se marca no-defecto contra `ui-forja`.
- Si el dialogo de colision crece, extraer un puerto/viewmodel dedicado; por ahora el acoplamiento directo a store mantiene el corte pequeno.

## Corte anterior — Tier 1 + recuperacion operativa capturador/scroll

Se llevo la rama `feat/cierre-brechas-tier1` a `main` con dos bloques cerrados: preferencias de visibilidad de esencia en OPL y recuperacion operativa del capturador de bugs/desplazamiento nativo del canvas.

**Decisiones aplicadas:**
- La OPL mantiene una forma canonica interna/roundtrip completa, pero el panel puede ocultar oraciones de esencia desde Configuracion (`oplEsenciaVisibilidad`) para lectura editorial.
- La preferencia de visibilidad de esencia se aplica al Guardar en Configuracion, siguiendo el contrato ya usado por grilla/modos visuales.
- `detectarColisionNombre` queda como helper puro del modelo para identificar colisiones por nombre, tipo y ubicaciones. La UI completa de resolucion de colisiones se integro en el corte siguiente.
- Se repusieron accesos visibles del capturador de bugs (`bug-capture-open`, `bug-ledger-open`) ademas de `Ctrl+Alt+B` y command palette.
- El viewport real de JointJS vuelve a `overflow: auto`, recuperando desplazamiento nativo por canvas; el pan/zoom y centrado programatico siguen funcionando sobre el mismo viewport.
- Se actualizo la auditoria visual e2e para reflejar que capturador visible y scroll nativo son comportamiento esperado, no regresion visual.

**Artefactos relevantes:**
- `app/src/opl/opciones.ts`, `generar.ts`, `panel.ts`, `generadores/estructural.ts` — visibilidad display vs canonica de esencia.
- `app/src/ui/DialogoConfiguracion.tsx` + puertos/viewmodel de configuracion — selector de visibilidad de esencia.
- `app/src/modelo/operaciones/colisionNombre.ts` — helper puro de colision por nombre.
- `app/src/ui/CapturadorBugs.tsx` — accesos visibles restaurados.
- `app/src/render/jointjs/JointCanvas.tsx` — viewport scrolleable restaurado.
- Tests focales: `e2e/28-opl-visibilidad-esencia.spec.ts`, `e2e/10-capturador-bugs.spec.ts`, `e2e/27-visual-compliance-25-05.spec.ts`, `e2e/21-estado-vacio-opm.spec.ts`, unit tests de OPL y colision de nombre.

**Verificacion del corte:**
- `cd app && bun run check` -> verde.
- `cd app && bun run lint` -> OK.
- `cd app && bun run build` -> OK.
- `cd app && bun run design:governance` -> OK.
- `git diff --check` -> OK.
- `cd app && bunx playwright test e2e/10-capturador-bugs.spec.ts e2e/27-visual-compliance-25-05.spec.ts e2e/21-estado-vacio-opm.spec.ts` -> verde.

**Estado local al cierre:** no stagear automaticamente `docs/auditorias/inclumplimiento-visual-25-05-2026.md` ni `docs/manual-simulado-opcloud-capacidades.md`; contienen cambios previos/no relacionados con este commit de producto.

**Pendientes derivados:**
- Integrar de punta a punta el flujo de colision de nombre: store actions, modal, reuso por aparicion, rename sin fusion y navegacion a ubicaciones.
- Reauditar visualmente el posicionamiento de los dos accesos del capturador en desktop y mobile para asegurar que no tapan controles criticos.

## Corte previo — Ronda 2 Codex v1.1: OPL canonica, canvas y diagnostico

Se resolvio la auditoria "Incumplimientos Codex — Ronda 2" del 25 mayo 2026, visible con modelo cargado, diagnostico expandido y refinamientos SD1/SD1.1. El foco fue preservar funcionalidad y elevar el cumplimiento contra la SSOT suprema `docs/canon-opm/reglas-opm-estrictas.md` y la autoridad visual `ui-forja/GOVERNANCE.md`.

**Decisiones aplicadas:**
- La OPL forward emite nombres canonicos legibles, no slugs: `Hospitalización_domiciliaria` se proyecta como `Hospitalización Domiciliaria` en OPL, canvas e hints.
- Los procesos placeholder (`Proceso`, `Proceso parte 1`, etc.) no producen OPL canonica; quedan como diagnostico metodologico hasta recibir un nombre verbal/deverbal valido.
- Los estados placeholder (`estado1`, `estado2`) no producen la oracion `puede estar`; se reportan con `ESTADO_NOMBRE_CANONICO` para obligar nombre descriptivo en minusculas.
- Las etiquetas de canvas preservan palabras y autoexpanden el ancho cuando el nombre canonico lo requiere; los contornos de descomposicion crecen para respetar padding interno minimo de 16 px.
- Los identificadores visuales de apariencias internas de descomposicion se renderizan jerarquicos (`p.01.1`, `p.01.2`, `o.01.1`) en vez de saltos top-level (`p.21`, `o.11`).
- El diagnostico deja de ser panel encajonado: vive como marginalia editorial dentro del inspector, con `revalidar` inline italic, conteos `△ N sugerencias`, categorias de una columna, filas sin chip y citas con border-left hairline.
- Al expandir diagnostico, reemplaza visualmente el inspector vacio; al navegar a un aviso, colapsa para mostrar el inspector poblado.
- El indicador flotante de sugerencias en canvas pasa de chip negro `!` a marca tipografica `△` sin fondo.
- El breadcrumb largo colapsa con marca explicita `…`, sin `text-overflow: ellipsis` silencioso.
- El caret huerfano del panel OPL queda etiquetado como `plegar ▾`.

**Decision normativa explicitada:**
- No se cambio el marker de `exhibicion` a cuadrado. La auditoria lo pidio, pero entra en conflicto con el canon vigente y los tests actuales: `ui-forja/08-jointjs-styling.md`, `app/src/render/jointjs/linkAssets.ts` y `proyeccion.test.ts` mantienen exhibicion como triangulo de contorno con triangulo interno. Ante conflicto, manda `docs/canon-opm/reglas-opm-estrictas.md` + autoridad visual versionada, no la captura.

**Artefactos relevantes:**
- `app/src/modelo/nombresCanonicos.ts` — normalizacion de nombres canonicos de entidades/estados y deteccion de placeholders.
- `app/src/opl/generar.ts` + `app/src/opl/generadores/*` — supresion OPL de placeholders y emision canonica.
- `app/src/modelo/checkers.ts` — diagnostico `ESTADO_NOMBRE_CANONICO`.
- `app/src/render/jointjs/composers/entidad.ts` — labels canonicos, auto-size, padding de compounds e IDs jerarquicos.
- `app/src/ui/PanelDiagnostico.tsx`, `App.tsx`, `Breadcrumb.tsx`, `panelOpl/Toolbar.tsx` — diagnostico editorial, reemplazo de inspector, breadcrumb colapsado y toolbar OPL etiquetada.
- Tests focales: `generar.test.ts`, `diagnostico.test.ts`, `entidad.test.ts`, `Breadcrumb.test.ts` y specs Playwright ajustadas a los contratos canonicos.

**Verificacion del corte:**
- `cd app && bun run check` -> verde (typecheck + unit).
- `cd app && bun run lint` -> OK.
- `cd app && bun run build` -> OK.
- `cd app && bun run design:governance` -> OK.
- `git diff --check` -> OK.
- `bun run visual:gate` no existe en `app/package.json`; se uso Playwright como gate visual disponible:
  - `cd app && bunx playwright test --shard=1/3` -> verde.
  - `cd app && bunx playwright test --shard=2/3` -> verde.
  - `cd app && bunx playwright test --shard=3/3` -> verde.

**Estado local al cierre:** no stagear automaticamente `docs/auditorias/inclumplimiento-visual-25-05-2026.md` ni `docs/manual-simulado-opcloud-capacidades.md`; contienen cambios previos/no relacionados con este commit de producto.

**Pendientes derivados:**
- Convertir esta ronda en DDR si se quiere formalizar el patron de diagnostico editorial como norma estable.
- Agregar gate dedicado si el equipo decide llamar `visual:gate` a la combinacion Playwright/visual audit.
- Reauditar con captura nueva de SD, SD1 y SD1.1 tras deploy para confirmar cobertura visual cercana a 97%.

## Corte visual previo — Auditoría visual Codex v1.1 cerrada y desplegada

Se resolvió `docs/auditorias/inclumplimiento-visual-25-05-2026.md` contra la captura del 25 mayo 2026. El corte es de ajuste visual/estructural, sin cambiar la semántica OPM ni la SSOT `docs/canon-opm/reglas-opm-estrictas.md`.

**Decisiones aplicadas:**
- El capturador de bugs deja de exponer floating action buttons. Sigue montado como servicio operativo y se abre por `Ctrl+Alt+B` o command palette (`Capturar bug`, `Bugs y features`). Decisión formal: `docs/decisiones/DDR-0007-botones-flotantes-capturador.md`.
- El inspector vacío queda reducido a una sola frase italic; renombrar modelo vive en command palette → `MODELO`.
- El breadcrumb del workspace muestra la jerarquía editorial `sistema · system diagram` y agrega OPDs hijos en minúsculas.
- La toolbar OPL usa palabras inline, sin checkbox para filtro por selección y sin cajas para acciones de pie.
- Se elimina `LIVE` redundante de OPL/Inspector y el árbol sólo muestra disclosure cuando hay hijos.
- El viewport JointJS queda sin scrollbar nativa (`overflow: hidden`); el pan/zoom sigue siendo responsabilidad del canvas.
- Los glifos y kbd de creación respetan color canónico por clase OPM.

**Artefactos relevantes:**
- `docs/auditorias/inclumplimiento-visual-25-05-2026.md` — crítica original y resolución aplicada.
- `docs/decisiones/DDR-0007-botones-flotantes-capturador.md` — decisión de retirar FABs.
- `app/e2e/27-visual-compliance-25-05.spec.ts` — cobertura Playwright focal de la auditoría.
- Componentes tocados: `Breadcrumb`, `CommandPalette`, `Inspector`, `PantallaInicio`, `CapturadorBugs`, `panelOpl/Toolbar`, `toolbarPrimitives`, `ToolbarCreacion`, `NodoOpd`, `CodexFooterKey`, `JointCanvas`.

**Verificación del corte:**
- `cd app && bun run check` -> **1718 pass / 0 fail**.
- `cd app && bun run lint` -> OK.
- `cd app && bun run build` -> OK.
- `cd app && bun run design:governance` -> OK.
- `git diff --check` -> OK.
- Playwright focal ejecutado: auditoría visual 25-05, onboarding precargado, capturador de bugs, OPL panel, carga/workspace, responsive review, superficie contextual, inspector tabs, árbol/pestañas, toolbar overflow, canvas/render e inspector resize.

**Deploy verificado:**
- `docker compose ps` -> `opforja` healthy y `opforja-bug-capture` up.
- `docker exec opforja wget -qO- http://127.0.0.1:8080/healthz` -> `ok`.
- `docker exec opforja wget -qO- http://bug-capture:3000/healthz` -> `{"ok":true}`.
- `curl -I https://opforja.sanixai.com/` -> `HTTP/2 200`, `content-type: text/html`.
- Certificado TLS Let's Encrypt para `CN = opforja.sanixai.com`, vigente hasta 2026-08-16.

**Estado local al cierre:** quedan cambios no stageados/no incluidos en `docs/auditorias/inclumplimiento-visual-25-05-2026.md` y `docs/manual-simulado-opcloud-capacidades.md`; no pertenecen al commit documental de handoff y no deben stagearse automáticamente.

## Corte normativo base — ui-forja-governance como autoridad normativa de diseño

`ui-forja/` deja de ser una propuesta y queda consolidado como **ui-forja-governance**, autoridad normativa de diseño para Opforja.

**Precedencia vigente:**
1. `urn:fxsl:kb:reglas-opm-estrictas-es` manda para canonicidad OPM/OPD/OPL; `docs/canon-opm/reglas-opm-estrictas.md` es puente local.
2. `ui-forja/GOVERNANCE.md` manda para frame, chrome, tokens, tipografía, composición, componentes, interacción visual y apariencia JointJS.
3. `ui-forja/01-design-spec.md` ... `08-jointjs-styling.md` detallan la norma por capa.
4. `app/src/ui/tokens.ts`, `app/src/ui/` y `app/src/render/jointjs/` implementan la norma.

**Artefactos nuevos / actualizados:**
- `ui-forja/GOVERNANCE.md` — jerarquía, invariantes, excepciones, política de cambio y definición de listo.
- `ui-forja/README.md`, `01-design-spec.md`, `02-components.md`, `03-scenes.md`, `05-interactions.md`, `tokens.css`, `tokens.json` — actualizados a Codex v1.1 (`OPL ← canvas → Índice + Inspector`, tabs workspace en header, columnas 360/360).
- `app/scripts/design-governance-audit.mjs` + `bun run design:governance` — gate ejecutable para tokens, layout documental y sombras offset prohibidas.

**Auditoría aplicada en implementación:**
- Sombras offset eliminadas de overlays/menús secundarios detectados (`BarraHerramientasElemento`, `MenuTipoEnlace`, `HaloEstado`, modal de nombre en toolbar). Se preservan rings `0 0 0`, inset hairlines y aliases `tokens.shadows.*` permitidos.
- `gate:refactor` ahora incluye `bun run design:governance`.

**Gate local de este corte:**
- `cd app && bun run design:governance` -> OK.
- `cd app && bun test src/ui/tokens.test.ts src/ui/toolbar/toolbarStyles.test.ts src/ui/BarraHerramientasElemento.test.ts` -> 75 pass / 0 fail.
- `cd app && bun run check` -> 1713 pass / 0 fail.
- `cd app && bun run lint` -> OK.
- `cd app && bun run build` -> OK.
- `cd app && bunx playwright test e2e/02-canvas-y-render.spec.ts e2e/03-opl-panel.spec.ts e2e/04-arbol-y-pestanas.spec.ts e2e/12-toolbar-overflow.spec.ts e2e/22-responsive-review.spec.ts e2e/23-inspector-resize.spec.ts` -> 55 passed / 1 skipped.

## Ronda bugs-canvas (en main, pusheada y desplegada)

7 bugs de canvas/atajos resueltos en 4 líneas paralelas (worktrees, dominios disjuntos) — `docs/bugs/` todos en Resuelto:
- **Símbolos** (L-A): sombra física suave (`6ae261`), estado como rountangle de radio fijo (`9e3b9b`), proceso sistémico refinado conserva contorno sólido (`a8c184`).
- **Enlaces** (L-B): ancla canónica center+boundary para consumo/resultado/efecto (`7fcdba`), self-loop de autoinvocación con geometría/marca canónicas (`06f1ed`).
- **Viewport** (L-C): OPD hijo refinado se ancla al centro geométrico → el encuadre lo centra (`b6be2b`).
- **Atajos** (L-D): teclas O/P/S/R crean objeto/proceso/estado/enlace con canvas activo, con guard de foco (`445a97`).

Verde: **1696 unit + 237 e2e / 0 fail**. Lección operativa: los subagentes en worktree a veces resuelven rutas absolutas al checkout principal (contaminan `main`); el orquestador resetea el working tree y mergea solo las ramas committeadas. Ver [[feedback-ronda-paralela-reconciliacion-e2e]].

> Este es el **único** handoff vigente del proyecto. No crear handoffs paralelos ni fechados: reescribir y consolidar aquí.

## Corte documental previo — Baseline funcional OPCloud/OPCAT para auditoria de cumplimiento

Se consolido un manual funcional simulado de capacidades OPCloud/OPCAT como artefacto de referencia para chequear avance, granularidad y cumplimiento del desarrollo de Opforja. El documento suma capacidades sin distinguir entre OPCAT y OPCloud y describe **que hace** el software, no como lo implementa.

**Artefacto nuevo:**
- `docs/manual-simulado-opcloud-capacidades.md` — inventario enriquecido de capacidades funcionales agrupado por modelado OPM nuclear, refinamiento, OPD/OPL, canvas, conectividad contextual, gestion de modelos, reutilizacion/gobierno semantico, requisitos, analisis, import/export, simulacion/ejecucion y entrada de usuario.

**Fuentes consolidadas:**
- `/home/felix/kora/artifacts/knowledge/_SCRIPTORIUM/INBOX/fxsl/opm-methodology/opm-curso-applied-modeling.md`
- `/home/felix/kora/artifacts/knowledge/_SCRIPTORIUM/INBOX/fxsl/opm-methodology/opm-curso-sd-wizard.md`
- `/home/felix/kora/artifacts/knowledge/_SCRIPTORIUM/INBOX/fxsl/opm-methodology/opm-iso.md`
- `/home/felix/kora/artifacts/knowledge/_SCRIPTORIUM/INBOX/fxsl/opm-methodology/OPM version felix.md`
- `/home/felix/kora/artifacts/knowledge/_SCRIPTORIUM/INBOX/opm-libro-curado/`
- `/home/felix/kora/artifacts/knowledge/_SCRIPTORIUM/INBOX/opm/transcripciones-videos-opcloud.txt`

**Decision de uso:**
- Este manual queda como baseline externo funcional para auditorias de brecha Opforja vs. capacidades OPCloud/OPCAT, complementario al backlog HU (`docs/historias-usuario-v2/`) y al dashboard `docs/roadmap/hu-progress.*`.
- No reemplaza la SSOT OPM ni `docs/canon-opm/reglas-opm-estrictas.md`; cuando una capacidad OPCloud/OPCAT diverge del canon, manda la SSOT.
- Para medir avance, convertir cada capacidad del manual en criterio verificable contra codigo, tests, e2e, UI viva o artefacto documental antes de marcarla cubierta.

**Verificacion documental del corte:**
- `wc -l docs/manual-simulado-opcloud-capacidades.md` -> 909 lineas.
- `rg -n '^## ' docs/manual-simulado-opcloud-capacidades.md` -> secciones 1,2,3,4,5,6,7,9,10,11,12,13,14 y Fuentes usadas; se conserva el salto 7→9 del indice base entregado.
- `git diff --check -- docs/manual-simulado-opcloud-capacidades.md docs/HANDOFF.md` -> sin whitespace errors.

## Corte funcional previo — Runtime sociotecnico/agentico de simulacion

Se implemento el primer corte vertical del sistema de simulacion y computo de Opforja orientado a sistemas sociotecnicos complejos y sistemas computacionales agenticos. El corte es deliberadamente pequeno, puro y verificable: no conecta todavia con UI, runner conceptual existente, persistencia ni herramientas externas reales.

**Artefactos nuevos:**
- `app/src/modelo/simulacion/sociotecnico.ts` — modulo puro tipado para actores, agentes, politicas de autonomia, decisiones, efectos pendientes y trace sociotecnico.
- `app/src/modelo/simulacion/sociotecnico.test.ts` — tests TDD del comportamiento base.

**Decisiones de diseno vigentes:**
- El runtime sociotecnico queda separado del simulador conceptual actual (`runner.ts`/`plan.ts`) para evitar acoplar prematuramente UI, animacion de tokens y ejecucion agentica.
- Las decisiones agenticas se evaluan como datos puros: `permitida`, `suspendida` o `bloqueada`.
- Los efectos externos (`ask-human`, `tool-call`, `http`, `python`, `mqtt`, `sql`, `ros`, `genai`) no se ejecutan; quedan como `efectosPendientes` para que futuros puertos los resuelvan.
- La politica de autonomia resuelve con precedencia: politica por herramienta > politica por accion > politica por defecto.
- Una decision que requiere supervision genera un efecto `ask-human`; una herramienta bloqueada por politica no genera efecto pendiente.
- El trace sociotecnico es inmutable y numerado; `aplicarDecisionSociotecnica` no muta el runtime de entrada.

**Verificacion del corte:**
- TDD rojo inicial confirmado: el test fallaba por modulo inexistente.
- `cd app && bun test src/modelo/simulacion/sociotecnico.test.ts` -> **4 pass / 0 fail**.
- `cd app && bun run typecheck` -> **0 errores**.
- `cd app && bun run test` -> **1700 pass / 0 fail**.

**Estado de worktree al cierre del corte:** existen cambios previos/no relacionados fuera de este commit en render/tests/docs de bugs (`app/src/leyes/proyecciones.test.ts`, `app/src/render/jointjs/*`, `docs/bugs/*`). No forman parte del corte sociotecnico y no deben stagearse automaticamente.

## Último corte funcional — Ronda Codex v2 (cerrada y desplegada)

Cierre completo de la **Auditoría Codex v1.0 ↔ Implementación rev2** (`/home/felix/_TEMP_BORRAR/OpForja_diff.pdf`): las ~28 desviaciones se ejecutaron en **6 líneas paralelas** (worktrees aislados, 2 olas, orden de merge controlado) documentadas en `docs/instrucciones-lineas-dev/ronda-codex-v2/`.

**Desviaciones cerradas:**
- **Canon OPL** (L1): enumeración de estados con `puede estar` (SSOT línea 411); clasificación escindida en esencia + afiliación (D1–D4). Cambio coordinado generador↔parser↔fixtures.
- **Chrome** (L2): wordmark único "Opforja" sin chip; botones top-bar sin caja; breadcrumb + meta en el header de `CodexFrame`; `CodexFooterKey` con leyenda de teclas + diagnóstico; tree-header "ÍNDICE/OPDs".
- **Inspector** (L3): ficha tipográfica continua sin tabs; identificador con punto `o.11`; sin contadores en estado vacío.
- **Canvas** (L4): sin resize-handles (SEL-2); underline crimson en selección única (SEL-1); una sola voz (`CodexSelectionAnnotation` funcional, `BarraHerramientasElemento` retirada del desktop).
- **Comandos** (L5): `⌘K` como vía única; `MenuPrincipal` eliminado, `☰` abre el palette; navegación `⌘1-9`; etiquetas de atajo por plataforma.
- **Tokens** (L6): pesos 500/600; anchos canónicos 210/360; color legacy (lime/cyan) erradicado; sombras/radius fuera de token retirados; chip de filtro OPL.

**Verificación verde:** `bun run check` = **1685 unit / 0 fail**; `bun run browser:smoke` = **237 e2e / 0 fail** (2 skips intencionales: AI-Text placeholder y resize-handles retirados); `lint` + `build` limpios. La reconciliación e2e final confirmó **cero regresiones de producto** (las 15 fallas eran aserciones obsoletas por el cambio de canon/anchos).

## Corte actual — Ronda bugs OPM/OPL/OPD 2026-05-26

Se cerro la tanda de 19 bugs capturados entre `BUG-20260526T024016Z-b768d4`
y `BUG-20260526T033451Z-59993d`, con trabajo paralelo en tres dominios:
OPL/canon, semantica de enlaces/render JointJS y UX de interaccion.

**Fuentes normativas usadas:**
- Repo: `docs/canon-opm/reglas-opm-estrictas.md`.
- SSOT externa indicada por el operador:
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md`
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-opl-es.md`

**Decisiones y comportamiento cerrado:**
- `efecto` ya no acepta `Objeto -> Proceso`; las firmas validas son
  `Proceso -> Objeto` y `Estado -> Proceso` como efecto de entrada.
- El split de efecto TS3 escinde a dos efectos TS4/TS5 acoplados
  (`Estado -> Proceso` y `Proceso -> Estado`) sin crear objeto sintetico ni
  reemplazar por consumo/resultado.
- La serializacion JSON preserva metadatos de efecto TS3/TS4:
  `estadoEntradaId`, `estadoSalidaId` y `efectoEscindido`.
- OPL vuelve a emitirse aunque los nombres no pasen heuristicas de canon; las
  heuristicas quedan como diagnostico, no como supresion de lenguaje.
- OPL cubre efectos con estados, multiplicidad opcional (`?`, `0..1`),
  agrupaciones opcionales, modificadores y frases naturales de instrumento
  para procesos como manejar/conducir.
- La raiz visual de un bus estructural se identifica como `grupo-enlaces`, no
  como la primera rama.
- Los markers de enlaces transformadores usan punta cerrada canonica.
- Cosas y estados se pueden redimensionar; Backspace/Delete elimina estados
  seleccionados y limpia enlaces asociados; la anotacion contextual ya no
  desborda ni superpone acciones.

**Artefactos principales:**
- Modelo/kernel: `app/src/modelo/operaciones/helpers.ts`,
  `app/src/modelo/operaciones/eliminacion.ts`,
  `app/src/modelo/tipos/enlace.ts`,
  `app/src/serializacion/validarEnlaces.ts`.
- OPL: `app/src/opl/generar.ts`,
  `app/src/opl/generadores/procedural.ts`,
  `app/src/opl/generadores/estructural.ts`,
  `app/src/opl/parser/parsear.ts`.
- Render/UI: `app/src/render/jointjs/*`,
  `app/src/store/modelo/acciones-estados.ts`,
  `app/src/ui/codex/CodexSelectionAnnotation.tsx`.
- Regresion e2e nueva: `app/e2e/31-domain-c-ui-interactions.spec.ts`.
- Trazabilidad bugs: `docs/bugs/statuses.json`, `docs/bugs/INDEX.md`,
  `docs/bugs/HISTORY.md`.

**Verificacion verde del corte:**
- `cd app && bun run check` -> **1723 pass / 0 fail**.
- `cd app && bun run lint` -> OK.
- `cd app && bun run build` -> OK.
- `cd app && bun run design:governance` -> OK.
- `git diff --check -- app/src app/e2e docs/bugs/statuses.json docs/bugs/INDEX.md docs/bugs/HISTORY.md` -> OK.
- Playwright focal:
  `bunx playwright test e2e/02-canvas-y-render.spec.ts e2e/07-enlaces-avanzados.spec.ts:435 e2e/14-canvas-fidelity.spec.ts e2e/25-produccion-backup.spec.ts e2e/31-domain-c-ui-interactions.spec.ts --workers=1`
  -> **29 passed**.

**Smoke completo observado:**
- `cd app && bun run browser:smoke -- --workers=1` fue ejecutado antes de los
  ultimos ajustes y arrojo **223 passed / 17 failed / 2 skipped**.
- Las fallas de esta tanda detectadas por ese smoke (fixtures de markers con
  efecto en direccion antigua, split TS3 y preservacion de metadata TS3/TS4)
  quedaron corregidas y cubiertas por la verificacion focal anterior.
- Persisten fallas e2e historicas/no relacionadas con este corte: aserciones
  visuales obsoletas de colores, expectativas antiguas de OPL vacio en
  refinamientos, grid/configuracion, tabla densa, simulacion multi-OPD, anchor
  drag y colision de nombres. No bloquearon este commit por estar fuera del
  alcance de los 19 bugs.

**Estado git/documental:**
- Rama de trabajo: `main`.
- Hay cambios ajenos no relacionados en el worktree que no pertenecen a este
  corte: deletes documentales previos y directorios nuevos bajo
  `docs/auditorias/**` / `docs/bugs/BUG-*`. No stagear salvo instruccion
  explicita.

## Fuentes normativas y técnicas

- **SSOT suprema de canon OPM/opforja**: `urn:fxsl:kb:reglas-opm-estrictas-es` — autoritativa para verbos/plantillas OPL (estados=`puede estar`, especialización=`puede ser`); puente local en `docs/canon-opm/reglas-opm-estrictas.md`.
- **SSOT OPL operativa de opforja**: `urn:fxsl:kb:spec-forja-opl-es`; puente local en `docs/canon-opm/spec-forja-opl.md`.
- SSOT OPM base: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`.
- Autoridad normativa de diseño: `ui-forja/GOVERNANCE.md` + `ui-forja/` (`01-design-spec.md` … `08-jointjs-styling.md`, `tokens.css`, `tokens.json`).
- Evidencia OPCloud preferente: `opm-extracted/` (antes que `decompiled/`).
- Baseline funcional OPCloud/OPCAT para auditoria de cumplimiento: `docs/manual-simulado-opcloud-capacidades.md`.
- Canon visual local: `docs/JOYAS.md` y `assets/svg/`.
- Arquitectura interna, comandos y reglas de oro: `CLAUDE.md` (raíz del repo) — documento único de orientación.

## Decisiones vigentes (no reabrir sin causa)

- Inspector = ficha continua (sin tabs). Comandos = solo palette `⌘K` (sin menú lateral). Selección = solo underline crimson (sin resize-handles). OPL de estados = `puede estar`.
- **OPL — visibilidad de esencia (Tier 1)**: la preferencia `oplEsenciaVisibilidad` (Configuración) es de **presentación**; el texto canónico que alimenta editor libre y parser SIEMPRE se genera completo (roundtrip protegido). No filtrar el canónico.
- **Colisión de nombre (Tier 1)**: reuse-vs-rename; *reutilizar* solo crea una nueva aparición de la entidad existente (nunca entidad nueva ni fusión); tipos incompatibles no se reutilizan; rename hacia un nombre existente solo ofrece renombrar/cancelar.
- **Simulación numérica (Tier 1)**: se abre desde command palette (no chrome); síncrona; export CSV con `filasSimulacionACsv` (puro, sin deps); columnas = atributos `simulable`.
- Deuda categorial activa: trigger del coproducto tagged de selección (refactor A→B en `OpmStore`) — ver `CLAUDE.md` § "Deuda categorial".
- Épicas descartadas: EPICA-70 (Importación OPCAT) y EPICA-91 (Modo tutorial).

## Pendientes

- **Brechas diferidas del Tier 1** (cada una merece su propia spec→plan):
  - *Visibilidad de unidades/alias en OPL*: están tejidas en la capa de nombres (`refsHints.ts` `nombreOpl`/`nombreOplBase`) usada por todos los generadores y por los hints de hover OPL↔canvas y la delimitación de tokens del parser; ocultarlas con consistencia exige enhebrar la opción por toda la capa + regresión hover/parser/roundtrip. Por eso A se acotó a esencia.
  - *D — herencia de generalización computada*: propagar rasgos/estados/relaciones de generales a especializados; es cambio de kernel y debe alinearse con `urn:fxsl:kb:reglas-opm-estrictas-es`.
  - *E — condiciones/loops ejecutables en simulación*: hoy `plan.ts`/`runner.ts` solo ordenan por Y; los modificadores `condicion`/`evento`/`invocacion`/`autoinvocacion` se modelan pero no se ejecutan.
  - *G — cablear el runtime sociotécnico*: `sociotecnico.ts` está aislado (sin UI/persistencia); depende de E + de "procesos computacionales" (subsistema ausente).
- **Auditoria post-deploy con modelo cargado**: tomar nueva captura de SD, SD1 y SD1.1 con diagnostico expandido y una seleccion activa para confirmar la resolucion visual completa de Ronda 2.
- **Deuda Codex v1.1 fuera de este corte**: proceso activo in-flight, asistente SD wizard, sub-modelos, switcher de lengua OPL, dark mode, frame letterbox 1700×950.
- **Integrar runtime sociotecnico con OPM**: mapear procesos computacionales/agenticos a `DecisionSim`, enlaces procedurales a pre/postcondiciones, y objetos/estados a contexto operativo.
- **Agregar puertos de efectos**: definir puertos para aprobacion humana, tool-call, HTTP, Python, MQTT, SQL, ROS y GenAI sin ejecutar efectos desde el kernel puro.
- **Disenar UI de laboratorio de simulacion**: inspeccion de agentes, politicas, decisiones suspendidas, trace sociotecnico y cola de efectos pendientes.
- **Escenarios y corridas**: conectar el runtime sociotecnico con parametros/distribuciones existentes para exploracion Monte Carlo y analisis de resiliencia.
- **Limpieza menor post-ronda**: campos `tab*Activo`/`cambiarTab*` del store y puertos quedaron huérfanos tras L3 (Inspector sin tabs) — candidatos a poda por el dueño de `store/`/`ports/`.
- **Inria Sans 600** no existe como master en `@fontsource` — los pesos 500/600 quedan sintetizados por el navegador (documentado en `main.tsx`).
- Opcional: regenerar la auditoría como **rev3** para confirmar cobertura ≈95%.
- Convertir `docs/manual-simulado-opcloud-capacidades.md` en matriz trazable de cumplimiento Opforja: capacidad → HU/epica → evidencia en codigo/tests/e2e/UI → estado.

## Supuestos

- `app/node_modules` se mantiene localmente (gitignored); los worktrees lo symlinkean.
- El gate mínimo antes de cualquier commit de producto es `cd app && bun run check`; si toca UI/canvas, agregar `bun run design:governance` y el subset Playwright afectado.
- El canvas no es fuente de verdad: el renderer JointJS proyecta el modelo; no se versiona estado de render.

## Riesgos

- **Semantica sociotecnica inicial**: el tratamiento de `ocupado` vs `no-disponible`, aprobaciones humanas, prioridad entre politicas y reintentos de efectos aun es base; debe validarse con modelos reales antes de exponerlo como comportamiento final.
- **Kernel sin persistencia ni UI**: el nuevo runtime existe en `src/modelo/simulacion`, pero todavia no se serializa dentro de `Modelo`, no aparece en inspector/canvas y no se ejecuta desde la barra de simulacion.
- **Ejecucion externa deliberadamente deshabilitada**: los efectos `python/http/mqtt/sql/ros/genai` son descriptores pendientes, no side effects reales. Cualquier conexion futura debe pasar por puertos auditables y permisos explicitos.
- **Instancia pública sin auth**: por decisión del operador se retiró el Basic Auth de Traefik. El endpoint `POST /__deep-opm/bug-reports` (sidecar `bug-capture`, `VITE_ENABLE_BUG_CAPTURE=true`) queda **público y escribe a disco** → riesgo de abuso/llenado. Revertir: re-agregar `opforja-auth@docker` al router + `basicauth.users` en `docker-compose.yml` (hash APR1 para `fsanhuezal`: `$$apr1$$opforja$$08lJpTQlgp0W79vrFxMnR/`) y `docker compose up -d`.
- Worktrees de la ronda quedaron bloqueados por el runtime de agentes (`.claude/worktrees/`); se autolimpian, no forzar.

## Prompt de continuación

> Continúa desde `docs/HANDOFF.md`, sección "Corte actual — Ronda bugs OPM/OPL/OPD 2026-05-26". La tanda de 19 bugs OPM/OPL/OPD quedo cerrada en `main` con verificacion verde local (`bun run check`, `lint`, `build`, `design:governance` y Playwright focal 29/29). Si se retoma producto, priorizar: (1) limpiar las fallas historicas de `browser:smoke` completo no relacionadas con este corte; (2) triar la cola documental de bugs capturados en `docs/bugs/BUG-*` antes de stagearla; (3) continuar brechas diferidas del Tier 1 (visibilidad unidades/alias OPL; D herencia; E condiciones/loops; G sociotecnico). Antes de tocar OPM/OPL leer las SSOT KORA `urn:fxsl:kb:reglas-opm-estrictas-es`, `urn:fxsl:kb:spec-forja-opl-es` y las capas base en `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`; los archivos `docs/canon-opm/*.md` son puentes. Antes de tocar UI/canvas leer `ui-forja/GOVERNANCE.md`. Gate UI: `cd app && bun run check && bun run lint && bun run build && bun run design:governance` + Playwright del layout/canvas afectado. Recordatorio operativo: vite-bg + e2e en paralelo produce flakes (correr e2e con `--workers=1` o apagar el dev server). No stagear cambios ajenos (`docs/auditorias/**`, deletes documentales previos, bug dirs no triados) sin instruccion explicita.
