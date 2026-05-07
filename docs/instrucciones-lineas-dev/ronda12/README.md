# Ronda 12 — Cierre MVP-α + apertura MVP-β controlada (valor numérico + traer conectados + plantillas privadas)

**Fecha**: 2026-05-07
**Base**: `main` @ commit `ff75966` (`chore(handoff): cierra ronda 11 — MVP-α 91.1% ponderado`) — HANDOFF vigente con rondas 1-11 cerradas. **MVP-α 91.1% ponderado, detector 92/92 reglas matched, 0 deuda estructural pendiente**.
**Objetivo**: 5 líneas paralelas. **Coproducto disjunto asimétrico** (`urn:fxsl:kb:icas-universales`): 1 línea cierra MVP-α (Right Kan extension de `Inc_α`, `urn:fxsl:kb:icas-extension`); 3 líneas abren MVP-β sobre épicas de blast aditivo (EPICA-17 valor numérico kernel-aditivo, EPICA-1B traer conectados canvas-aditivo, EPICA-33 plantillas dominio-aditivo); 1 línea consolida transversales + ledger. **Diferidas explícitas a rondas 13-14 dedicadas**: EPICA-32 sub-modelos peer-persistence (cascada en serializador) y HU-50.019/.020/.022 parser OPL bidireccional (no admite adjunto natural sin reglas léxicas formales).

## 1. Filosofía operativa

- **Marco SSOT-céntrico** (referencia: `docs/auditorias/2026-05-07-ssot-opm-extracted.md`, `docs/historias-usuario-v2/00-METODOLOGIA.md §6`). Tres niveles de autoridad:
  - **Nivel 1 — SSOT OPM v3.0.0** (`opm-iso-19450-es.md`, `opm-visual-es.md`, `opm-opl-es.md`, `metodologia-opm-es.md`): autoridad semántica, visual, textual y procedimental. **Citas obligatorias** (`[V-xxx]`, `[Glos 3.x]`, `[OPL-ES …]`, `[Met §x]`, `[JOYAS §x]`) según tipo de HU.
  - **Nivel 2 — `app/src/modelo/tipos.ts`**: SSOT viva en TypeScript del modelo de datos. Coherencia obligatoria con ISO-19450.
  - **Nivel 3 — `opm-extracted/`, `assets/`, `JOYAS.md`, `fixtures/`, `catalog/`, `config/`**: **respaldo técnico referencial**. Citas opcionales pero recomendadas para trazabilidad. **No es "primera fuente"**; es referencia para evitar reinventar lógica ya destilada por OPCloud, pero NUNCA se copia 1:1 (depende de Angular/Rappid/Firebase). Política operativa (`06-PROVENANCE.md §2`): "no inventa funcionalidad ausente en SSOT y OPCloud; no copia arquitectura OPCloud; SVGs/dimensiones/colores/tipografía/plantillas OPL se reutilizan".
- **Cierre + apertura controlada**: ronda 11 cerró el primer hito presentable (MVP-α 91.1%). Ronda 12 cierra los residuales (≥98%) y abre 3 épicas grandes seleccionadas por blast aditivo. Apertura, no explosión.
- **Coproducto disjunto asimétrico** (`urn:fxsl:kb:icas-universales`): la disjuntez no es sobre "tipo de trabajo" sino sobre dominio conceptual. L1 (cierre) opera sobre HU residuales pequeñas; L2/L3/L4 abren dominios nuevos cada uno con su capa principal.
- **Aditividad estricta** preservada (`urn:fxsl:kb:icas-extension`): cada feature agrega tipos opcionales (`?:`), exports nuevos, ningún rename. La adjunción libre/olvido entre exposed-API e internal-structure se mantiene (`urn:fxsl:kb:icas-adjunciones`).
- **Diferimiento por blast** (`urn:fxsl:kb:icas-calidad-riesgo`): épicas con cascada en serializador o sin adjunto natural se difieren a rondas dedicadas. EPICA-32 (peer-persistence) y HU-50.019/.020/.022 (parser OPL) NO entran en ronda 12.
- **Faithful sobre rondas 1-11** (`urn:fxsl:kb:icas-preservacion`): contratos públicos preservados, JSON lossless verificado, OPL invariante salvo adiciones canónicas declaradas (HU-17.016 nueva oración `Atributo es valor [Unidad].`).
- **Loop verde obligatorio**: cada línea cierra con `cd app && bun run check`; si toca UI/render: `bun run browser:smoke`; si toca proyección o bundle: `bun run build`. Línea base post-ronda-11: 624 unit / 2544 expect, 72/72 smoke (~1.3 min), chunk principal 181.34 KB / 47.82 KB gzip, detector 92/92 reglas.
- **Ship-beats-perfect**: si una HU expone un bug fuera de scope, se entrega como patch a `/tmp/` y NO se commitea.

## 2. Reglas duras comunes

1. **Scope estricto**: solo tocar archivos permitidos por el brief. Cualquier cambio cross-line no previsto se reporta y detiene.
2. **No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`** desde las líneas. El handoff único se actualiza solo en consolidación final. Tampoco tocar `docs/instrucciones-lineas-dev/ronda1..11/`, ni `docs/JOYAS.md`, ni la SSOT en `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/` (lectura).
3. **No tocar archivos sueltos del operador**: ni `app/scripts/in-vivo-test.mjs` ni `app/src/render/jointjs/customShapes.ts` ni `home/`. WIP del operador, fuera de scope.
4. **No copiar código 1:1 desde `opm-extracted/`**. Se usa como evidencia semántica/UX/arquitectura; la implementación se reescribe con Preact/Zustand/JointJS OSS.
5. **Citas explícitas**: cada decisión arquitectural cita SSOT (`opm-iso-19450-es.md`, `opm-visual-es.md`, `opm-opl-es.md`, `metodologia-opm-es.md`) o documento interno con paths absolutos + líneas.
6. **APIs públicas estables**: ningún rename de export. Cualquier cambio de firma de función pública se rechaza. Las features se agregan como **nuevas funciones exportadas** o **campos opcionales aditivos** en tipos.
7. **JSON lossless**: roundtrip permanece intacto. Campos nuevos en tipos opcionales (`?:`) deben tener default seguro en validadores y permitir hidratar JSON pre-ronda 12 sin pérdida. **Crítico para L2** (`Entidad.valorSlot?`) y **L4** (catálogo de plantillas separado del modelo OPM).
8. **Idiomas**: docs y mensajes UI en es-CL; identificadores en estilo del repo (camelCase TS, kebab-case data-testid, helpers de operación en es-CL).
9. **Tests por capa**: cada feature trae tests al lado (`<feature>.test.ts`). Tests viejos se preservan sin reescribir.
10. **No introducir backend, Firebase, auth, Rappid, jspdf, pdf-lib, papaparse ni dependencias nuevas** en esta ronda.
11. **Commits de línea**: `feat(...)` predominante (apertura MVP-β + cierres MVP-α), `refactor(...)` solo si abre superficie nueva mínima, `test(...)`, `chore(...)`. Co-author footer si aplica.
12. **No reabrir contratos de rondas 1-11**: `docs/HANDOFF.md §Decisiones Vigentes` es contrato. Ninguna línea reabre multi-selección, modo barra creación sticky, mapa = vista derivada, multi-pestaña sesión-only, undo per-pestaña, designaciones de estado, alias/unidad/descripción/URLs, duración canónica, plegado parcial, atajos centralizados, divisor árbol/canvas, diálogos custom con captura, barrel re-export como contrato público, slices Zustand con runtime singleton, code splitting Vite, aditividad estricta para features, cache imagen no-serializable, single-user EPICA-19, exclusión imagen/estados, gridConfig fuera del JSON OPM, composer overlay separado, read-only flag de runtime no de modelo, validación nominal `validarNombreEntidad`, política log-scale versiones, auto-archivar 90 días marca-no-destruye, `application/x-opm-tipo` MIME drag-Toolbar, paleta cerrada estilo enlace, reanclar extremos enlace con linkTools.
13. **EPICA-70 (OPCAT) y EPICA-91 (tutorial) descartadas del proyecto** desde 2026-05-05. No incluir en ningún brief.
14. **Diferimiento explícito**: ninguna línea aborda EPICA-32 sub-modelos peer (ronda 13), HU-50.019/.020/.022 parser OPL (ronda 14), HU-33.004/.005/.016/.017/.019/.020/.021 plantillas con ámbito org/global o modo plantilla AO (requieren multi-user, MVP-β fase posterior), HU-1B.006/.014 (configuración + burbuja sugerencia, S/C). Cualquier reapertura se rechaza.
15. **Cada línea registra sus reglas detector ronda 12**: agrega reglas nuevas en `docs/historias-usuario-v2/tools/progress-dashboard.mjs` solo en consolidación final L5, pero declara internamente qué HU cierra y qué evidencia lo respalda.

## 3. Stack y comandos del repo

- Bun 1.3+, TypeScript strict, Preact 10 + Signals, Zustand 5, JointJS 3.7 core, Vite 6, Playwright.
- Working directory: `/home/felix/projects/deep-opm-pro`; app en `app/`.

```bash
cd app
bun run check          # typecheck + unit tests (624 baseline post-ronda-11)
bun run browser:smoke  # Playwright Chromium 72/72 baseline (smoke 854 conocido flaky, retry verde)
bun run build          # build Vite; chunk principal 181.34 kB / 47.82 kB gzip baseline
bun run dev            # localhost:5173
```

Auditoría HU al cierre de consolidación:

```bash
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

## 4. Diagnóstico del estado y objetivos ronda 12

Estado post-ronda-11:

| Segmento | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance |
|---|---:|---:|---:|---:|---:|---:|
| Total backlog | 1126 | 266 | 33 | 449 | 378 | **24.6%** |
| MVP-α | 121 | 107 | 10 | 4 | 0 | **91.1%** |

**14 HU residuales MVP-α** (objetivo L1 → cierre):

| ID | Estado | Tamaño | Comentario |
|---|---|---|---|
| HU-10.004 | pendiente | S | Editar descripción opcional cosas; verificar wiring SeccionDescripcion. |
| HU-11.001 | pendiente | M0 | Crear cosa+partes secuencia mismo OPD; modo sticky verificación visual. |
| HU-11.007 | pendiente | M1 | Multi-al-todo gesto único; `conectarMultiAlTodo` existe en operacionesBatch. |
| HU-30.036 | pendiente | S | Redirigir Guardar→Guardar Como en read-only; L5 ronda 11 dejó diferida. |
| HU-SHARED-002 | parcial | M0 | Pila undo/redo granular; verificar comandos ronda 11. |
| HU-SHARED-007 | parcial | M0 | Eco OPL sincronizado; verificar emisión multi-al-todo. |
| HU-10.003 | parcial | M0 | Modal nombre tras crear; afinar smoke `data-testid="modal-nombre-cosa"`. |
| HU-10.021 | parcial | C | Descomposición objeto mismo diagrama; verificar inzoom para objetos. |
| HU-11.012 | parcial | M0 | Enlace estructural etiquetado; cobertura completa exhibición/generalización/clasificación. |
| HU-30.008 | parcial | M0 | Persistir payload OPM íntegro; verificar gridConfig/imagen/descripcion en exportarModelo. |
| HU-30.019 | parcial | M0 | Cargar doble clic; afinar smoke. |
| HU-30.020 | parcial | M0 | Cargar clic+botón; afinar smoke. |
| HU-30.021 | parcial | S | Cargar Ejemplo Global; falta JSON canónico. |
| HU-30.037 | parcial | M0 | Cancelar modal Esc/Cancelar sin persistir; cobertura completa. |

**Apertura MVP-β** (objetivo L2+L3+L4):

| Épica | HU vivas seleccionadas | Pendientes | Tamaño | Línea |
|---|---|---:|---|---|
| EPICA-17 valor numérico | HU-17.011/.012/.013/.014/.015/.016/.017 (7 HU) | 7 | M0/M1 | **L2** |
| EPICA-1B traer conectados | HU-1B.001/.002/.003/.004/.005/.007/.008/.009/.010/.011/.013/.015/.016 (13 HU) | 13 | M0/M1 | **L3** |
| EPICA-33 plantillas privadas | HU-33.001/.002/.003/.006/.007/.008/.009/.010/.012/.014/.015/.018/.022 (13 HU) | 13 | S/M | **L4** |

**Diferidas en ronda 12** (a confirmar en ronda 13-14):

- **EPICA-32 sub-modelos** (peer-persistence, requiere nueva topología — `urn:fxsl:kb:icas-topoi` sheaves): ronda 13.
- **HU-50.019/.020/.022 parser OPL bidireccional** (sin adjunto izquierdo natural — `urn:fxsl:kb:icas-adjunciones`): ronda 14 dedicada con reglas léxicas formales.
- **HU-33.004/.005/.016/.017/.019/.020/.021** (plantillas org/global, modo plantilla AO, favoritas, cortar carpeta): post multi-user.
- **HU-1B.006/.014** (default preferencias, burbuja sugerencia): bajo prioridad, ronda 13+.
- **EPICA-31 carpetas/permisos** (single-user MVP no necesita): diferida.
- **EPICA-60/61 export PDF/SVG papel**, **EPICA-71 CSV import**: bloqueadas por regla "no introducir dependencias nuevas".
- **EPICA-19 pool organizacional** (HU-19.004..006): multi-user, diferida.

## 5. Patrones técnicos referenciales en `opm-extracted/` (nivel 3, respaldo opcional)

OPCloud opera con ~349 archivos / ~165k LOC. **`opm-extracted/` es nivel 3** según la jerarquía SSOT (auditoría `docs/auditorias/2026-05-07-ssot-opm-extracted.md` §2): citas opcionales pero recomendadas para evitar reinventar lógica ya destilada. **No es "primera fuente"** — la SSOT (nivel 1) es la autoridad. Estos patrones son **referencia técnica**, NUNCA se copian 1:1 (dependen de Angular/Rappid/Firebase). Todos los paths de esta tabla fueron verificados con `ls`/`grep` antes de citarse; cualquier path no existente en `opm-extracted/` se rechaza (ver auditoría §RF-1 sobre paths errados a corregir):

| Patrón OPCloud | Path verificado | Aplicación ronda 12 |
|---|---|---|
| **Validación de atributos numéricos con tipos y rangos** | `opm-extracted/src/app/models/modules/attribute-validation/attribute-value.ts` (clase `AttributeValue` con `setRange/validate/getDefault`), `attribute-validation/char-range.ts` (validador `CharRange`), `attribute-validation/validation-module.ts`. Enum `ValueAttributeType.INTEGER \| FLOAT \| CHAR`. | L2: `Entidad.valorSlot?` aditivo (tipo + valor) + validador derivado + OPL `Atributo es valor [Unidad].`. |
| **Bring connected entities (kernel + halo)** | `opm-extracted/src/app/models/Actions/BringConnectedEntitiesAction.ts` (clase canónica con `act(opt, styleParams)`, métodos `filterRelevantRules`, `collectEntitiesAndLinks`, `filterEntitiesAndRelations`, `createNeededThings`, `createNeededRelations`, `bringLinksBetweenBroughtEntities`); `opm-extracted/src/app/models/consistency/bringConnectedRules.ts` (clases `BringProceduralEnablersRelations`, `BringProceduralTransformersRelations`, `BringUniBiDirectionalRelations`, `BringFundamentalRelations` con enum `BringConnectedTypes`); `opm-extracted/src/app/modules/layout/element-tool-bar/element-tool-bar.component.ts` (handle halo `bring-connected` con `displayTitle`/`gif`/`action.act()`). | L3: `traerConectadosBatch` con familias enum (procedural-enablers, procedural-transformers, tagged, fundamental) + `traerEnlacesEntreBatch` + halo button + diálogo familias. |
| **Plantillas (importación + gestión nombre duplicado)** | `opm-extracted/src/app/dialogs/templates-import/templates-import.ts`; `opm-extracted/src/app/dialogs/existing-name-dialog/existing-name-dialog.component.ts` (diálogo "Use Existing Thing" / `goToOpdById` cuando hay duplicado al insertar); `opm-extracted/src/app/dialogs/submodel-name-dialog/` (input de nombre canónico). | L4: catálogo plantillas `Privado` + merge en OPD activo + resolución colisión sufijo `_n` (HU-33.008) + tile clickeable a OPD origen. |
| **Cierre micro-features MVP** | sin path único; cosecha sobre archivos ya existentes en `app/src/`. | L1: residuales sin archivos nuevos grandes (excepto `examples/ejemplo-organizacional.json`). |
| **Read-only redirect Save→Save As** | `opm-extracted/src/app/dialogs/save-as-dialog/` ya integrado en ronda 11 L2; el patrón "redirect en read-only" no tiene path explícito en `opm-extracted/` (deducido por simetría con read-only flag de ronda 11 L5). | L1 HU-30.036: en `acciones-ui.guardarLocal` si `readOnly`, dispara `guardarComo()` con confirmación. **Ojo**: el patrón es propio del repo, no copia 1:1. |

Ningún brief debe inventar paths bajo `opm-extracted/`. Si un path no aparece en esta tabla o no se verifica con `ls`/`grep` antes, NO se cita en un brief. **El header de cada archivo nuevo debe citar primero SSOT (nivel 1, obligatorio) y opcionalmente opm-extracted (nivel 3) con paths verificados**.

## 5b. Assets SVG canónicos a reusar (obligatorio)

`assets/svg/` ya contiene iconos canónicos de OPCloud listos para reuso visual. La política `06-PROVENANCE.md §2` dice **"SVGs, dimensiones, colores, tipografía y plantillas OPL se reutilizan"** — **es obligación**, no opcional. Antes de crear iconos nuevos, **verificar** si existe el equivalente:

| Archivo SVG | Usado por | Aplicación ronda 12 |
|---|---|---|
| `assets/svg/addConnected.svg` | halo bring-connected en OPCloud | **L3** botón Toolbar + halo "Traer conectados". |
| `assets/svg/template.svg` | gestión de plantillas | **L4** botón Toolbar/MenuPrincipal + tile en `DialogoPlantillas`. |
| `assets/svg/editAlias.svg`, `assets/svg/editUnits.svg` | edición de alias/unidades de atributo | **L2** botones inspector `SeccionAtributo` (alias HU-17.007 ya cubierto ronda 7; unidad HU-17.011/.012 nueva en L2). |
| `assets/svg/lock.svg` | indicador read-only OPCloud | **L1** HU-30.036 indicador candado en redirect Guardar→Guardar Como (refuerza icono ronda 11 L5 ya en Toolbar). |
| `assets/svg/example.svg` | botón "Ejemplo" canónico | **L1** HU-30.021 botón "Cargar Ejemplo Organizacional" en `DialogoCargarModelo`. |
| `assets/svg/unfold.svg`, `inzoom.svg` | descomposición canvas | **L1** HU-10.021 verificación inzoom para objetos (icono ya existente, no recrear). |
| `assets/svg/objectDrag.svg`, `processDrag.svg` | drag de cosa desde toolbar | **L2** botón crear atributo numérico (drag desde Toolbar) — variante visual de objectDrag. |

Cualquier brief que necesite un icono nuevo debe primero declarar por qué no aplica un SVG existente.

## 5c. JOYAS canónicas (paleta + dimensiones) — contrato visual obligatorio

`docs/JOYAS.md` documenta la paleta y dimensiones extraídas del bundle real de OPCloud. Aunque JOYAS es nivel 3 técnicamente, la política `06-PROVENANCE.md §2` lo eleva a **contrato visual obligatorio** ("dimensiones, colores, tipografía se reutilizan"). **Toda nueva UI ronda 12 respeta**:

- **Paleta canónica** (`docs/JOYAS.md §1`): `#70E483` Object stroke, `#3BC3FF` Process stroke, `#586D8C` link stroke, `#fdffff` fill, `#000002` text. Inspector usa la paleta secundaria documentada.
- **Dimensiones canónicas** (`docs/JOYAS.md §2`): Object/Process 135×60 px, link visible `stroke-width=2`, link wrapper `stroke-width=15`, marker triangle 30×30 px.
- **Tipografía** (`docs/JOYAS.md §3`): Arial 14px font-weight 600, text-anchor middle, y=0.8em.
- **Halo button conventions** (`docs/JOYAS.md §...`): si L3 emite halo button, replica geometría halo de OPCloud.

**Cualquier elección de color/tamaño/tipografía** que se desvíe de JOYAS.md debe declararse explícitamente con rationale.

## 5d. Política de citas SSOT obligatorias en archivos nuevos (RF-2 remediation)

Auditoría `docs/auditorias/2026-05-07-ssot-opm-extracted.md` §RF-2 detectó que **EPICA-30 tiene 0 citas SSOT en sus HU**, violando `00-METODOLOGIA.md §6`. Para evitar reincidencia, **cada archivo nuevo o feature nueva en ronda 12 debe agregar cita SSOT al header** según tipo de HU:

| Tipo de HU | Cita obligatoria |
|---|---|
| `opm-semantica` | `[Glos 3.x]` (definición), `[V-xxx]` (visual si aplica), `[Met §x]` (procedimiento) |
| `opcloud-ui` | `[V-xxx]` o `[JOYAS §x]` cuando aplica visualmente |
| `opl-es` | `[OPL-ES x.y.z]` |
| `mixto` | combinar las anteriores según los aspectos tocados |

Aplicación concreta ronda 12:

- **L1** HU-30.008/.019/.020/.021/.036/.037 (`mixto` persistencia): cita obligatoria `[Met §6]` (etapas SD) o estructura específica de `app/src/modelo/tipos.ts` en el header del archivo modificado.
- **L1** HU-10.004 (`opm-semantica`): cita `[Glos 3.55]` u `[Glos 3.69]` para descripción de cosa.
- **L2** HU-17.011..017: cita `[Glos 3.4]`, `[V-163]`, `[OPL-ES …]` (ya documentadas en el brief §3).
- **L3** HU-1B.*: cita `[Met §multi-OPD]`, `[Glos 3.6]` (apariencia).
- **L4** HU-33.*: cita `[Met §plantillas]`, `[Glos 3.6]`.
- **L5**: en `progress-dashboard.mjs` no aplica (es tooling, no kernel).

**`opm-extracted/` es complemento opcional** al header. Citar SSOT primero, opm-extracted después si aplica.

## 6. Visión general de las 5 líneas

| ID | Título | HU eje | Capa principal | Tamaño | Riesgo |
|---|---|---|---|---|---|
| **L1** | Cierre MVP-α (residuales + smoke 854 + ejemplo global) | 14 HU residuales (4 pendientes + 10 parciales) | `ui/inspector/SeccionDescripcion.tsx` + `ui/Toolbar.tsx` (modo sticky visual) + `acciones-canvas.ts` (multi-al-todo wiring) + `acciones-ui.ts` (read-only redirect) + `persistencia/local.ts` (payload integro) + `examples/*.json` + `e2e/opm-smoke.spec.ts` | M | bajo |
| **L2** | EPICA-17 slot de valor numérico + sintaxis compuesta | HU-17.011/.012/.013/.014/.015/.016/.017 (7 HU) | `modelo/tipos/entidad.ts` (`valorSlot?`) + `opl/generadores/exhibicion.ts` (oración valor) + `ui/inspector/SeccionAtributo.tsx` nuevo + `ui/Toolbar.tsx` (botón crear atributo numérico) | M | medio (kernel) |
| **L3** | EPICA-1B traer conectados (toolbar + halo + multi-selección) | HU-1B.001..005/.007..011/.013/.015/.016 (13 HU) | `canvas/operacionesBatch.ts` (`traerConectadosBatch`) + `acciones-canvas.ts` (`traerConectadosSeleccionado`, `ocultarApariencia`) + `ui/DialogoTraerConectados.tsx` nuevo + `ui/MenuContextualEntidad.tsx` nuevo + `ui/Toolbar.tsx` | L | medio |
| **L4** | EPICA-33 plantillas privadas (catálogo + insertar + merge) | HU-33.001/.002/.003/.006..010/.012/.014/.015/.018/.022 (13 HU) | `persistencia/plantillas.ts` nuevo + `persistencia/workspace.ts` (`PlantillaIndice` aditivo) + `ui/DialogoPlantillas.tsx` nuevo + `ui/DialogoGuardarPlantilla.tsx` nuevo + `acciones-canvas.ts` (`insertarPlantilla`) + `ui/MenuPrincipal.tsx` (Plantillas...) | L | medio |
| **L5** | Transversales + ledger ronda 12 | recalibración detector + draft handoff + cascadas | `progress-dashboard.mjs` + `docs/HANDOFF.md` (consolidación) + cascadas residuales | S | bajo |

Quedan fuera de ronda 12 (diferidas explícitas, ver §4):

- **EPICA-32 sub-modelos** (ronda 13 dedicada).
- **HU-50.019/.020/.022 OPL bidireccional con parser** (ronda 14 dedicada).
- **HU-33.004/.005/.016/.017/.019/.020/.021** (plantillas org/global + modo plantilla AO + favoritas + cortar): post multi-user.
- **HU-1B.006/.014** (default preferencias + burbuja sugerencia): bajo prioridad.

## 7. Mapa de archivos por línea

Convención: `aditivo` = solo agregar campos opcionales/funciones nuevas; `nuevo` = archivo creado por esa línea; `lectura` = puede leerse pero no editarse; `extiende` = agrega funciones públicas nuevas sin tocar las previas; vacío = sin contacto.

| Archivo | L1 | L2 | L3 | L4 | L5 |
|---|---|---|---|---|---|
| `app/src/modelo/tipos/entidad.ts` | — | aditivo (`Entidad.valorSlot?`, `TipoAtributo`, `ValorSlot`) | — | — | — |
| `app/src/modelo/tipos/opl.ts` | — | aditivo (`TokenValor`, `TokenUnidad`) | — | — | — |
| `app/src/modelo/tipos/modelo.ts` | — | — | — | — | — |
| `app/src/modelo/tipos/ui.ts` | — | — | aditivo (`PreferenciasUiUsuario.traerConectadosUltimo?`) | aditivo (`PreferenciasUiUsuario.plantillasOrden?`) | — |
| `app/src/modelo/operaciones/entidad.ts` | — | extiende (`asignarValorAtributo`, `cambiarTipoAtributo`) | — | — | — |
| `app/src/modelo/operaciones/enlaces.ts` | extiende (HU-11.012 etiqueta exhibición/generalización/clasificación) | — | — | — | — |
| `app/src/opl/generadores/exhibicion.ts` | — | extiende (oración `Atributo es valor [Unidad].`) | — | — | — |
| `app/src/opl/generadores/refinamiento.ts` | aditivo (HU-SHARED-007 verificación multi-al-todo) | — | — | — | — |
| `app/src/canvas/operacionesBatch.ts` | aditivo (verificación atomicidad multi-al-todo) | — | extiende (`traerConectadosBatch`, `traerEnlacesEntreBatch`, `ocultarAparienciaBatch`) | extiende (`insertarPlantillaBatch` con merge + sufijo) | — |
| `app/src/canvas/seleccionMultiple.ts` | — | — | extiende (`enlacesInternosSeleccion`) | — | — |
| `app/src/persistencia/local.ts` | aditivo (HU-30.008 payload íntegro) | — | — | — | — |
| `app/src/persistencia/workspace.ts` | — | — | — | aditivo (`PlantillaIndice`, `WorkspaceIndice.plantillas?`) | — |
| `app/src/persistencia/plantillas.ts` | — | — | — | **nuevo** (CRUD plantillas + insertar) | — |
| `app/src/store/runtime.ts` | — | — | — | — | — |
| `app/src/store/tipos.ts` | aditivo (~3 acciones residuales) | aditivo (~3 acciones atributo) | aditivo (~5 acciones traer) | aditivo (~6 acciones plantillas) | — |
| `app/src/store/modelo/acciones-canvas.ts` | extiende (HU-11.007 wiring `conectarMultiAlTodoSeleccion`) | — | extiende (`traerConectadosSeleccionado`, `traerEnlacesEntreSeleccionadas`, `ocultarAparienciaSeleccionada`) | extiende (`insertarPlantillaEnOpdActivo`) | — |
| `app/src/store/modelo/acciones-entidad.ts` | extiende (HU-10.004 set descripción + commit) | extiende (`asignarValorAtributoSeleccionado`) | — | — | — |
| `app/src/store/modelo/acciones-ui.ts` | extiende (HU-30.036 redirigir guardar→guardarComo en read-only) | — | extiende (`abrirDialogoTraerConectados`) | extiende (`abrirDialogoPlantillas`, `abrirDialogoGuardarPlantilla`) | — |
| `app/src/ui/Toolbar.tsx` | aditivo (HU-11.001 indicador modo sticky activo) | aditivo (botón crear atributo numérico drag) | aditivo (botón Traer conectados sobre selección) | aditivo (botón Plantillas) | — |
| `app/src/ui/inspector/SeccionDescripcion.tsx` | extiende (HU-10.004 wiring cosas) | — | — | — | — |
| `app/src/ui/inspector/SeccionAtributo.tsx` | — | **nuevo** (slot valor + tipo numérico/objeto + unidad) | — | — | — |
| `app/src/ui/InspectorEntidad.tsx` | — | aditivo (montar SeccionAtributo) | — | — | — |
| `app/src/ui/MenuContextualEntidad.tsx` | — | — | **nuevo** (Traer conectados + Ocultar) | — | — |
| `app/src/ui/DialogoTraerConectados.tsx` | — | — | **nuevo** (familias enlace + ámbito directo) | — | — |
| `app/src/ui/DialogoPlantillas.tsx` | — | — | — | **nuevo** (catálogo + búsqueda + breadcrumb + insertar) | — |
| `app/src/ui/DialogoGuardarPlantilla.tsx` | — | — | — | **nuevo** (nombre + ámbito Privado) | — |
| `app/src/ui/MenuPrincipal.tsx` | — | — | — | aditivo (Guardar como plantilla, Plantillas...) | — |
| `app/src/ui/DialogoCargarModelo.tsx` | aditivo (HU-30.019/.020 doble clic + clic+botón smoke) | — | — | — | — |
| `app/src/ui/Dialogo.tsx` | aditivo (HU-30.037 cancelar Esc cobertura) | — | — | — | — |
| `app/examples/ejemplo-organizacional.json` | **nuevo** (HU-30.021 JSON canónico) | — | — | — | — |
| `app/e2e/opm-smoke.spec.ts` | aditivo (~6 smokes residuales + smoke 854 stabilization) | aditivo (~3 smokes valor numérico) | aditivo (~5 smokes traer conectados) | aditivo (~4 smokes plantillas) | — |
| `docs/historias-usuario-v2/tools/progress-dashboard.mjs` | — | — | — | — | extiende (~22 reglas nuevas ronda 12) |
| `opm-extracted/**` | LECTURA | LECTURA | LECTURA | LECTURA | LECTURA |
| `assets/svg/**` | LECTURA | LECTURA | LECTURA | LECTURA | LECTURA |
| `docs/HANDOFF.md` | — | — | — | — | EDIT consolidación |
| `docs/historias-usuario-v2/epicas/**` | — | — | — | — | — |

Reglas de colisión:

- **`acciones-canvas.ts`**: L1 (HU-11.007 wiring), L3 (3 acciones traer), L4 (insertarPlantilla). Hunks disjuntos por sección. Exports nuevos cada uno.
- **`acciones-entidad.ts`**: L1 (HU-10.004 descripción), L2 (asignarValor). Hunks disjuntos.
- **`acciones-ui.ts`**: L1 (HU-30.036 redirigir Guardar), L3 (abrirDialogoTraerConectados), L4 (2 acciones plantillas). Hunks disjuntos por línea.
- **`Toolbar.tsx`**: L1 (indicador modo sticky), L2 (botón atributo numérico), L3 (botón traer conectados), L4 (botón plantillas). Hunks disjuntos por sección JSX. **Coordinación**: L2 → L3 → L4 → L1 al final para que cada línea coloque su botón sin choque visual.
- **`MenuPrincipal.tsx`**: L4 agrega Plantillas... + Guardar como plantilla. L1/L2/L3 NO tocan.
- **`tipos/ui.ts`**: L3 (`traerConectadosUltimo?`), L4 (`plantillasOrden?`). Aditivos disjuntos.
- **`canvas/operacionesBatch.ts`**: L1 (verificación HU-SHARED-002 atomicidad multi-al-todo, sin nuevos exports), L3 (3 batchs nuevos), L4 (1 batch nuevo). Hunks disjuntos.
- **`opm-smoke.spec.ts`**: TODAS las líneas agregan tests al final del archivo sin tocar tests previos.
- **Detector ledger**: L5 lo gestiona en consolidación final. Cada línea declara internamente qué reglas nuevas espera.
- **`tipos/entidad.ts`**: solo L2 toca (`valorSlot?` aditivo). L4 plantillas guarda modelo serializado completo, sin tocar tipos del modelo.

## 8. Protocolo de conciliación (orden de merge)

Orden sugerido: **L2 → L3 → L4 → L1 → L5 → consolidación**.

Rationale categorial:

1. **L2 valor numérico primero** (kernel-aditivo, blast medio): `Entidad.valorSlot?` opcional + generador OPL aditivo + Inspector seccion nueva. Si L2 falla aquí, el patrón "campo opcional aditivo en kernel + serializador" está roto y bloquea L4.
2. **L3 traer conectados segundo**: opera sobre canvas/operacionesBatch + acciones-canvas. Aterriza después de L2 para que el patrón "batch atómico nuevo" esté validado en kernel-aditivo.
3. **L4 plantillas tercero**: módulo nuevo `persistencia/plantillas.ts` + dos diálogos nuevos. Aterriza después de L3 para que `acciones-canvas` y `Toolbar` ya tengan los patrones de hunks disjuntos.
4. **L1 cierre cuarto**: cosecha residuales tras los grandes. Aterriza tarde porque algunos cierres dependen de ver el estado consolidado de Toolbar/acciones (HU-11.001 modo sticky visualización debe coexistir con botones nuevos L2/L3/L4 sin choque).
5. **L5 transversales + ledger**: último, agrupa recalibración detector ronda 12 y draft handoff.
6. **Consolidación**: detector recalibrado + cascadas residuales + HANDOFF actualizado a "post-ronda 12" + reportar avance MVP-α + apertura MVP-β.

Después de cada merge: `cd app && bun run check`; si tocó UI/render: `bun run browser:smoke`; al cierre de ronda: `bun run build` y auditoría HU con `--sync-real`. **Reservar el último commit del ciclo para una capa explícita de cascadas resueltas** (rondas 6-11 demostraron que esa capa es ineludible).

Chequeo de contrato por merge:

- **Export surface**: cada línea declara qué exports nuevos agrega. Cero rename, cero break.
- **JSON lossless**: cargar un JSON pre-ronda 12 produce modelo válido sin pérdida. Tests `serializacion/json.test.ts` deben pasar sin tocar. **Crítico L2** (`Entidad.valorSlot?` opcional con default `undefined`).
- **OPL invariante**: verbalización core no cambia. **L2 agrega caso canónico nuevo**: `Atributo es valor [Unidad].` solo cuando el atributo tiene `valorSlot.tipo === "numerico"`.
- **Behavioral surface**: `JointCellJson` mantiene orden/id/type/selectores/metadata `opm`; UI mantiene `data-testid`, foco y propagación de eventos. Cualquier `data-testid` nuevo se agrega aditivamente.
- **Detector surface**: cada HU cerrada declara su evidencia; L5 agrega ~22 reglas nuevas en consolidación (L1: ~4, L2: ~5, L3: ~6, L4: ~6, L5 propias: ~1).

## 9. Anclaje obligatorio: SSOT (autoridad) + nivel 2 + nivel 3 (respaldo)

Antes de codificar cada línea, leer **en este orden de jerarquía SSOT**:

**Nivel 1 — SSOT (autoridad obligatoria)** en `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`:

- `metodologia-opm-es.md`: workflow OPM, etapas SD, persistencia. Más relevante para L1 (HU EPICA-30 — RF-2), L3 (gestión multi-OPD), L4 (plantillas como artefactos).
- `opm-iso-19450-es.md`: glosario y axiomas. **Más relevante para L2** (§3.4 atributo, §3.40 exhibición), L1 (§3.55 Object, §3.69 Process), L3/L4 (§3.6 apariencia).
- `opm-visual-es.md`: V-1 a V-240. Más relevante para L2 (V-163 slot valor numérico).
- `opm-opl-es.md`: D5-D8, T1-T3, TS1-TS3. **Más relevante para L2** (oración `Atributo es valor [Unidad].`).
- `06-PROVENANCE.md §2`: política operativa "no inventa funcionalidad ausente; SVGs/dimensiones/colores/tipografía/plantillas OPL se reutilizan".
- `00-METODOLOGIA.md §6`: jerarquía SSOT y citas obligatorias por tipo de HU.

**Nivel 2 — `app/src/modelo/tipos.ts` (SSOT viva)**: coherencia obligatoria con ISO-19450. Los tipos en TS son contrato.

**Nivel 3 — respaldo técnico referencial (citas opcionales pero recomendadas)**:

- **`docs/JOYAS.md`** completo: paleta canónica, dimensiones, arquitectura wrapper+line, tipografía. Aunque nivel 3 técnicamente, la política PROVENANCE lo eleva a contrato visual obligatorio.
- **`assets/svg/`** inventario: política PROVENANCE obliga reuso (ver §5b).
- **`opm-extracted/`** dirigido a la línea: leer paths verificados en §5 + grep amplio (`grep -ri "concepto-clave" opm-extracted/src/app -l`) antes de inventar API. **Cualquier path que no se verifique con `ls`/`grep` no se cita en el brief** (RF-1 evita recurrencia). Citas opcionales pero recomendadas para trazabilidad.

**HANDOFF + briefs rondas 1-11** (`docs/HANDOFF.md §Decisiones Vigentes`): contrato heredado. Ronda 12 las preserva sin reabrir.

**Orden de prioridad cuando hay conflicto**:

- **SSOT (nivel 1) manda sobre todo**. Si OPCloud implementa algo no canónico, no se replica.
- **`tipos.ts` (nivel 2)** es contrato vivo: cualquier cambio debe ser coherente con ISO-19450.
- **JOYAS + `assets/svg/`**: contrato visual y de iconos; reusar es obligación operativa por política PROVENANCE.
- **`opm-extracted/` (nivel 3)**: respaldo técnico para evitar reinventar lógica destilada por OPCloud, pero **nunca se copia 1:1** (depende de Angular/Rappid/Firebase). Se reescribe en Preact + Zustand + JointJS OSS preservando la semántica.
- **Header del archivo nuevo cita primero SSOT (obligatorio), después opm-extracted (opcional, paths verificados)**. Ver §5d.

## 10. Brief por línea

| Línea | Brief |
|---|---|
| L1 | [linea-1-cierre-mvp-alpha.md](./linea-1-cierre-mvp-alpha.md) |
| L2 | [linea-2-valor-numerico.md](./linea-2-valor-numerico.md) |
| L3 | [linea-3-traer-conectados.md](./linea-3-traer-conectados.md) |
| L4 | [linea-4-plantillas-privadas.md](./linea-4-plantillas-privadas.md) |
| L5 | [linea-5-transversales-ledger.md](./linea-5-transversales-ledger.md) |

Prompt para asignar líneas: [prompt-asignacion.md](./prompt-asignacion.md).

## 11. Verificación al cierre de la ronda

```bash
cd app
bun run check
bun run browser:smoke
bun run build
cd ..
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

Métricas esperadas post-ronda 12 (sobre base post-ronda-11: 624 unit / 2544 expect, 72/72 smoke, chunk principal 181.34 KB / 47.82 KB gzip, detector 92/92 reglas, MVP-α 91.1%):

- **Unit tests ≥ 680**. Tests aditivos por línea: L1 ~10, L2 ~14, L3 ~18, L4 ~14, L5 ~3. Total razonable: ~680-700.
- **Smoke browser ≥ 90**. Cada línea agrega 3-6 smokes nuevos.
- **Build**: chunk principal puede crecer ~10-15 KB (módulos plantillas + diálogos lazy). Razonable < 195 KB / < 55 KB gzip.
- **Detector ledger ≥ 110 reglas matched** (vs 92 baseline; +22 nuevas). Cero unmatched.
- **MVP-α: 91.1% → ≥98% ponderado** (cierre de ~12 HU residuales + recalibración detector L5).
- **MVP-β: nueva métrica activa**. EPICA-17 +7 HU cubiertas, EPICA-1B +13 HU cubiertas, EPICA-33 +13 HU cubiertas. Total **+~33 HU MVP-β** (de 0 a ~33 HU activas en MVP-β).
- **APIs públicas sin cambios**: cada feature se agrega como export nuevo o campo opcional aditivo.
- **Contratos observables sin cambios** donde aplica: JSON roundtrip preservado (`Entidad.valorSlot?` opcional con default `undefined`), OPL invariante salvo nueva oración canónica L2 declarada, `data-testid` previos preservados.
- **`docs/HANDOFF.md` permanece intacto** durante las líneas; se actualiza solo en consolidación final.

Si una métrica no se cumple, la línea correspondiente lo declara explícito con rationale.
