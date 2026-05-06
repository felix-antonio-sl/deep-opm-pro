# Ronda 10 — Features post-MVP-α: cierre EPICA-1A/12/15/19/50 + HU-SHARED

**Fecha**: 2026-05-06
**Base**: `main` @ commit `010e3c7` (`chore(ledger): recalibra detector post-9.5 + actualiza HANDOFF a cero deuda estructural`) — HANDOFF vigente con rondas 1-9 + ronda 9.5 cerradas. **Cero deuda estructural pendiente**: todos los barrels < 350 LOC, sub-archivos por dominio bajo cada superficie.
**Objetivo**: 5 líneas paralelas de **features** que cierren parciales de MVP-α y agreguen capacidades canvas/UI grandes pendientes. **Cambio de paradigma** vs rondas 8, 9, 9.5: dejamos refactor, abrimos features. NO se reabren contratos. APIs públicas se extienden aditivamente con campos opcionales.

## 1. Filosofía operativa (cambio de paradigma)

- **Features sobre refactor**: rondas 8-9.5 estabilizaron el patrón canónico (barrel + sub-archivos por dominio). Ronda 10 lo respeta: cualquier archivo nuevo se ubica en el subdirectorio correcto siguiendo el patrón ya validado.
- **Aditividad sobre extensión**: cada feature agrega tipos opcionales (`?:` en interfaces) y comportamiento condicional. Cero rename, cero break de firma pública. La adjunción libre/olvido entre exposed-API e internal-structure se preserva (ref. `urn:fxsl:kb:icas-adjunciones`).
- **Disjuntez por dominio conceptual**: dos features son disjuntas si tocan capas distintas (kernel / render / OPL / UI / persistencia). Choques en archivos compartidos (ej. composers/entidad.ts) se resuelven con composición aditiva — badges, modificadores opcionales — siguiendo el patrón ronda 7 (badges 📄/🔗).
- **Cierre MVP-α prioritario**: ronda 10 mueve MVP-α de 46.3% a ~52-55%. Cada línea declara cuántas HU cubiertas+parciales agrega.
- **Loop verde obligatorio**: cada línea cierra con `cd app && bun run check`; si toca UI/render: `bun run browser:smoke`; si toca proyección o bundle: `bun run build`. Línea base post-9.5: 561 unit / 2381 expect, 40/40 smoke (47s), chunk principal 140 KB / 38 KB gzip, detector 55/55 reglas.
- **Ship-beats-perfect**: si una HU expone un bug fuera de scope, se entrega como patch a `/tmp/` y NO se commitea.
- **APIs públicas documentadas**: cada función nueva abre con JSDoc del módulo declarando su responsabilidad y consumidores.

## 2. Reglas duras comunes

1. **Scope estricto**: solo tocar archivos permitidos por el brief. Cualquier cambio cross-line no previsto se reporta y detiene.
2. **No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`** desde las líneas. El handoff único se actualiza solo en consolidación final. Tampoco tocar `docs/instrucciones-lineas-dev/ronda1..9.5/`, ni `docs/JOYAS.md`, ni la SSOT en `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/` (lectura).
3. **No tocar archivos sueltos del operador**: ni `app/scripts/in-vivo-test.mjs` ni `app/src/render/jointjs/customShapes.ts` ni `home/`. WIP del operador, fuera de scope.
4. **No copiar código 1:1 desde `opm-extracted/`**. Se usa como evidencia semántica/UX/arquitectura; la implementación se reescribe con Preact/Zustand/JointJS OSS.
5. **Citas explícitas**: cada decisión arquitectural cita SSOT (`opm-iso-19450-es.md`, `opm-visual-es.md`, `opm-opl-es.md`, `metodologia-opm-es.md`) o documento interno con paths absolutos + líneas.
6. **APIs públicas estables**: ningún rename de export. Cualquier cambio de firma de función pública se rechaza. Las features se agregan como **nuevas funciones exportadas** o **campos opcionales aditivos** en tipos.
7. **JSON lossless**: roundtrip permanece intacto. Campos nuevos en tipos opcionales (`?:`) deben tener default seguro en validadores y permitir hidratar JSON pre-ronda 10 sin pérdida.
8. **Idiomas**: docs y mensajes UI en es-CL; identificadores en estilo del repo (camelCase TS, kebab-case data-testid, helpers de operación en es-CL).
9. **Tests por capa**: cada feature trae tests al lado (`<feature>.test.ts`). Tests viejos se preservan sin reescribir.
10. **No introducir backend, Firebase, auth, Rappid, jspdf, pdf-lib, papaparse ni dependencias nuevas** en esta ronda.
11. **Commits de línea**: `feat(...)` predominante (es ronda de features), `refactor(...)` solo si abre superficie nueva mínima, `test(...)`, `chore(...)`. Co-author footer si aplica.
12. **No reabrir contratos de rondas 1-9.5**: `docs/HANDOFF.md §Decisiones Vigentes` es contrato. Ninguna línea reabre multi-selección, modo barra creación sticky, mapa = vista derivada, multi-pestaña sesión-only, undo per-pestaña, designaciones de estado, alias/unidad/descripción/URLs, duración canónica, plegado parcial, atajos centralizados, divisor árbol/canvas, diálogos custom con captura, barrel re-export como contrato público, slices Zustand con runtime singleton, detector apunta a evidencia real, code splitting Vite. Ninguno se reabre. Si la línea matiza alguno, lo declara como decisión documentada en commit; no lo rompe.
13. **EPICA-70 (OPCAT) y EPICA-91 (tutorial) descartadas del proyecto** desde 2026-05-05. No incluir en ningún brief.

## 3. Stack y comandos del repo

- Bun 1.3+, TypeScript strict, Preact 10 + Signals, Zustand 5, JointJS 3.7 core, Vite 6, Playwright.
- Working directory: `/home/felix/projects/deep-opm-pro`; app en `app/`.

```bash
cd app
bun run check          # typecheck + unit tests (561 baseline)
bun run browser:smoke  # Playwright Chromium 40/40 baseline
bun run build          # build Vite; chunk principal 140 KB / 38 KB gzip baseline
bun run dev            # localhost:5173
```

Auditoría HU al cierre de consolidación:

```bash
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

## 4. Diagnóstico del estado MVP-α (46.3% → ~52-55%)

Estado post-9.5:

| Segmento | HU vivas | Cubiertas | Parciales | Pendientes | Avance |
|---|---:|---:|---:|---:|---:|
| Total backlog | 1126 | 168 | 51 | 529 | 16.6% |
| MVP-α | 121 | 48 | 23 | 50 | 46.3% |
| MVP-β | 193 | 47 | 23 | 123 | 32.6% |

Top épicas con parciales **cerrables** en ronda 10:

| Épica | Total | Cubierto | Parcial | Pendiente | Línea |
|---|---:|---:|---:|---:|---|
| EPICA-12 descomposición de procesos | 31 | 18 | 10 | 3 | **L3** |
| EPICA-13 estados | 18 | 9 | 6 | 3 | (L5 cierre menor) |
| EPICA-15 enlaces avanzados | 23 | 18 | 1 | 4 | **L2** |
| EPICA-18 plegado parcial | 15 | 12 | 2 | 1 | (L5 cierre menor) |
| EPICA-50 OPL pane | 21 | 9 | 1 | 11 | **L5 polish** |
| EPICA-SHARED transversales | 9 | 1 | 6 | 2 | **L5 cierre** |

Top épicas grandes pendientes (features nuevas):

| Épica | Total | Pendiente | Línea |
|---|---:|---:|---|
| EPICA-1A grid + snap + auto-tamaño | 18 | 18 | **L1** |
| EPICA-19 imágenes incrustadas | 16 | 16 | **L4** |

## 5. Contraste opm-extracted ↔ deep-opm-pro

OPCloud opera con ~349 archivos / ~165k LOC. Patrones canónicos destilables relevantes para ronda 10:

| Patrón OPCloud | Path | Aplicación ronda 10 |
|---|---|---|
| **Auto-sizing y resize handles** | `opm-extracted/src/app/configuration/elementsFunctionality/draw.view.ts`, `OpmVisualThing.ts` (resize behavior) | L1 grid+snap+autosize: replicar la doctrina de auto-tamaño + handles laterales/esquina + restrict translate al grid. |
| **Modificadores de enlace** | `opm-extracted/src/app/models/components/commands/EditModifierCommand.ts` (si existe) o `models/Logical/OpmLogicalLink.ts` (campo `condition`/`event`/`negation`) | L2 modificadores: extender `Enlace.modificador?: Modificador` (ya existe en tipos) + `Enlace.subtipoModificador?: "condicion-evento" | "no"` aditivo. |
| **Decomposition refinement** | `opm-extracted/src/app/configuration/rappidEnviromentFunctionality/in-zooming/` (carpeta entera) | L3 descomposición avanzada: timeline reordenable, reasignación manual de externos, distinción in-zooming vs unfolding en UI. |
| **Image embedding** | `opm-extracted/src/app/configuration/elementsFunctionality/imageRepoConfig.ts`, `OpmVisualThing` con `urlImage?` | L4 imágenes: `Entidad.imagen?: { url, modo: "imagen" \| "texto" \| "imagen-texto" }` aditivo + render compuesto vía overlay (no toca composer base, igual que badges 📄/🔗 ronda 7). |
| **OPL textual operations** | `opm-extracted/src/app/modules/app/export-opl.service.ts` | L5 polish OPL: copiar al portapapeles, exportar HTML, buscar texto en panel. |

## 6. Visión general de las 5 líneas

| ID | Título | HU eje | Capa principal | Tamaño | Riesgo |
|---|---|---|---|---|---|
| **L1** | Grid + snap + auto-tamaño + alineación | HU-1A.001..018 (18 HU) | render Apariencia + UI Toolbar + JointCanvas handler resize | L | bajo-medio |
| **L2** | Modificadores avanzados de enlace + ruta editable + advertencia consumo | HU-11.026, HU-11.027, HU-15.014..018, HU-15.022, HU-15.023, HU-15.025 (~10 HU) | tipos enlace + operaciones/enlaces + render markers + OPL procedural + Inspector enlace | M | medio |
| **L3** | Descomposición avanzada (timeline + reasignación manual + split-effect distinción + in-zooming vs unfolding UI) | HU-12.011, HU-12.015, HU-12.018, HU-12.022..024, HU-12.029, HU-12.030 (~7 HU) | operaciones/refinamiento + Inspector SeccionRefinamiento + render contorno timeline | M | medio |
| **L4** | Imágenes incrustadas (URL externa + modos + render compuesto + cache) | HU-19.001..003, HU-19.007..016 (13 HU; .004-.006 pool organizacional difieren a multi-user) | tipos entidad (aditivo) + operaciones entidad + render overlay imagen + ModalImagenObjeto | M | bajo |
| **L5** | Cierre transversal MVP-α + OPL polish | HU-SHARED-002 smokes, HU-SHARED-006 diálogo Guardar/Descartar/Cancelar al cerrar, HU-50.023/.024/.025, HU-13.* cierres, HU-18.013, HU-12.013, HU-50.013, HU-50.015 (~12 HU) | UI Dialogo + ConfirmacionContext + PanelOpl + smoke spec + opl/generadores | S | bajo |

Quedan fuera de ronda 10:

- **EPICA-32 sub-modelos** (31 pendientes): peso alto, requiere persistencia peer.
- **EPICA-33 plantillas** (22 pendientes): peso alto, requiere artefacto reutilizable.
- **EPICA-31 carpetas/permisos** (23 pendientes): single-user MVP no necesita permisos.
- **EPICA-60/61 export PDF/SVG papel**: bloqueadas por regla "no introducir dependencias nuevas".
- **EPICA-71 CSV import**: bloqueada.
- **EPICA-50 bidireccional fase profunda** (HU-50.019/.020/.022 con parser): peso alto. Solo polish entra en L5.
- **EPICA-1B traer conectados**: complementaria a L1, candidata ronda 11.
- **HU-19.004..006** (pool organizacional con tags y ámbitos): requiere multi-user, difiere.

## 7. Mapa de archivos por línea

Convención: `aditivo` = solo agregar campos opcionales/funciones nuevas; `nuevo` = archivo creado por esa línea; `lectura` = puede leerse pero no editarse; `extiende` = agrega funciones públicas nuevas sin tocar las previas; vacío = sin contacto.

| Archivo | L1 | L2 | L3 | L4 | L5 |
|---|---|---|---|---|---|
| `app/src/modelo/tipos/apariencia.ts` | aditivo (`Apariencia.ancho?,alto?,modoTamano?,gridSnap?`) | — | — | — | — |
| `app/src/modelo/tipos/entidad.ts` | — | — | — | aditivo (`Entidad.imagen?: ImagenEntidad`) | — |
| `app/src/modelo/tipos/enlace.ts` | — | aditivo (`Enlace.subtipoModificador?`) | — | — | — |
| `app/src/modelo/tipos/ui.ts` | aditivo (`PreferenciasUiUsuario.gridConfig?`) | — | — | — | — |
| `app/src/modelo/operaciones/apariencias.ts` | extiende (resize, autosize, snap a grid) | — | — | — | — |
| `app/src/modelo/operaciones/enlaces.ts` | — | extiende (modificadorAvanzado, moverPuerto) | — | — | — |
| `app/src/modelo/operaciones/refinamiento/*` | — | — | extiende (reasignar externo manual, reordenar timeline) | — | — |
| `app/src/modelo/objetoMetadata.ts` | — | — | — | extiende (editarImagen, quitarImagen) | — |
| `app/src/modelo/imagenObjeto.ts` | — | — | — | **nuevo** (helpers validación URL + cache bitmap) | — |
| `app/src/modelo/validaciones.ts` | — | aditivo (advertencia consumo duplicado HU-15.025) | aditivo (validación timeline) | — | — |
| `app/src/canvas/operacionesBatch.ts` | extiende (`alinearPorEje`, `distribuirUniformemente`, `redimensionarBatch`) | — | — | — | — |
| `app/src/canvas/grid.ts` | **nuevo** (helpers de cuantización + preferencias) | — | — | — | — |
| `app/src/render/jointjs/composers/entidad.ts` | aditivo (resize handles + width/height del modelo) | — | — | aditivo (overlay imagen vía badge) | — |
| `app/src/render/jointjs/composers/grid.ts` | **nuevo** (renderizar cuadrícula visual) | — | — | — | — |
| `app/src/render/jointjs/composers/imagenOverlay.ts` | — | — | — | **nuevo** (overlay imagen sin tocar composer base) | — |
| `app/src/render/jointjs/composers/markers.ts` | — | aditivo (markers para subtipos modificador C/E/¬) | — | — | — |
| `app/src/render/jointjs/handlers/seleccion.ts` | aditivo (handler resize handles) | — | — | aditivo (click en insignia imagen) | — |
| `app/src/render/jointjs/handlers/drag.ts` | aditivo (snap to grid en drag) | — | aditivo (drag subproceso reordena timeline) | — | — |
| `app/src/render/jointjs/proyeccion.ts` | aditivo (opciones grid visible) | — | — | aditivo (opciones modo imagen global) | — |
| `app/src/opl/generadores/procedural.ts` | — | aditivo (oraciones C/E/¬ refinadas, "Por ruta") | aditivo (oración paralelo HU-12.017) | — | — |
| `app/src/opl/generadores/refinamiento.ts` | — | — | aditivo (verbo distinguido HU-12.014, "ocurren" HU-50.013, "es un" HU-50.015) | — | aditivo |
| `app/src/store/modelo/acciones-entidad.ts` | extiende (resize, autosize, modoTamano) | — | — | extiende (editarImagenEntidad, quitarImagenEntidad, alternarModoImagen) | — |
| `app/src/store/modelo/acciones-canvas.ts` | extiende (`toggleGrid`, `setGridConfig`, `alinearSeleccion`, `distribuirSeleccion`) | — | — | — | — |
| `app/src/store/modelo/acciones-enlace.ts` | — | extiende (`aplicarSubtipoModificador`, `moverPuertoEnlace`) | — | — | — |
| `app/src/store/modelo/acciones-opd.ts` | — | — | extiende (`reasignarEnlaceExternoManual`, `reordenarTimelineSubprocesos`) | — | — |
| `app/src/store/modelo/acciones-canvas.ts` | — | — | — | — | extiende (`buscarEnPanelOpl`) |
| `app/src/store/modelo/acciones-ui.ts` | — | — | — | extiende (`abrirModalImagen`, `cerrarModalImagen`) | extiende (`solicitarConfirmacionAlCerrar`) |
| `app/src/ui/Toolbar.tsx` | aditivo (toggle grid + alinear/distribuir buttons) | — | — | aditivo (toggle modo imagen global) | — |
| `app/src/ui/inspectorEnlace/SeccionMultiplicidad.tsx` | — | aditivo (selector subtipo modificador C/E/¬) | — | — | — |
| `app/src/ui/inspectorEnlace/SeccionRuta.tsx` | — | aditivo (input ruta editable HU-15.005..007) | — | — | — |
| `app/src/ui/inspectorEnlace/SeccionExtremos.tsx` | — | aditivo (botón Mover Puerto HU-15.022/.023) | — | — | — |
| `app/src/ui/inspector/SeccionRefinamiento.tsx` | — | — | aditivo (botón "Reasignar externo" + selector subproceso) | — | — |
| `app/src/ui/inspector/SeccionImagen.tsx` | — | — | — | **nuevo** | — |
| `app/src/ui/ModalImagenObjeto.tsx` | — | — | — | **nuevo** | — |
| `app/src/ui/DialogoConfirmacion.tsx` | — | — | — | — | aditivo (modo Guardar/Descartar/Cancelar al cerrar) |
| `app/src/ui/ConfirmacionContext.tsx` | — | — | — | — | aditivo (`confirmarSiDirty` extendido) |
| `app/src/ui/PanelOpl.tsx` | — | — | — | — | aditivo (input búsqueda) |
| `app/src/ui/panelOpl/Bloques.tsx` | — | — | — | — | aditivo (filtrar líneas por texto) |
| `app/e2e/opm-smoke.spec.ts` | aditivo (smoke grid + alinear + resize) | aditivo (smoke modificador C/E/¬ + ruta) | aditivo (smoke timeline + reasignar) | aditivo (smoke imagen URL + modos) | aditivo (smoke confirmar al cerrar dirty) |
| `app/src/serializacion/validar*.ts` | aditivo (validar campos nuevos apariencia) | aditivo (validar subtipoModificador) | — | aditivo (validar imagen + URLs) | — |
| `opm-extracted/**` | LECTURA | LECTURA | LECTURA | LECTURA | LECTURA |
| `assets/svg/**` | LECTURA | LECTURA | LECTURA | LECTURA | LECTURA |
| `docs/HANDOFF.md` | — | — | — | — | — |
| `docs/historias-usuario-v2/**` | — | — | — | — | — |

Reglas de colisión:

- **`composers/entidad.ts`** lo tocan L1 (resize handles + width/height) y L4 (overlay imagen). Coordinación: L4 implementa imágenes como **overlay aditivo separado** (`composers/imagenOverlay.ts`), NO modifica el composer base. Patrón ronda 7 (badges 📄/🔗).
- **`tipos/apariencia.ts`** lo toca solo L1 con campos opcionales. **`tipos/entidad.ts`** lo toca solo L4 con campo opcional. **`tipos/enlace.ts`** lo toca solo L2 con campo opcional. Sin choques.
- **`acciones-canvas.ts`** lo tocan L1 (alinear/distribuir/grid) y L5 (buscar OPL). Cada uno agrega métodos disjuntos.
- **`Toolbar.tsx`** lo tocan L1 (grid + alinear) y L4 (toggle modo imagen). Cada uno agrega botones a su sección sin colisionar.
- **`opm-smoke.spec.ts`** lo tocan TODAS las líneas con tests aditivos. Cada línea agrega su `test(...)` al final del archivo sin tocar tests previos.
- **Detector ledger** es territorio de la consolidación final. Cada línea declara internamente qué reglas nuevas espera, pero no edita `progress-dashboard.mjs` directamente; eso queda para la cascada post-ronda.

## 8. Protocolo de conciliación (orden de merge)

Orden sugerido: **L4 → L1 → L3 → L2 → L5 → consolidación**.

Rationale:

1. **L4 imágenes primero** (bajo blast, aditivo puro): valida el patrón "feature aditivo overlay" sin tocar composers/operaciones existentes. Si L4 falla aquí, el patrón ronda 10 entero está mal.
2. **L1 grid+snap+autosize segundo**: agrega `Apariencia.{ancho,alto,modoTamano,gridSnap}` aditivos. Si L4 ya agregó `Entidad.imagen?` y L1 agrega esos, ambos son campos opcionales disjuntos sin choque.
3. **L3 descomposición avanzada tercero**: usa `operaciones/refinamiento/*` (sub-archivos ronda 9.5). Aterriza después de L4/L1 para que un eventual sub-particionado emergente no choque.
4. **L2 modificadores cuarto**: extensión de tipos `Enlace.subtipoModificador?` + render markers + OPL. Aterriza tarde para absorber cualquier cascada de tipos de L4 + L1.
5. **L5 cierre transversal**: último, agrupa los cierres pequeños tras el resto.
6. **Consolidación**: detector recalibrado + cascadas residuales (smoke ajustes si aparecen) + HANDOFF actualizado a "post-ronda 10".

Después de cada merge: `cd app && bun run check`; si tocó UI/render: `bun run browser:smoke`; al cierre de ronda: `bun run build` y auditoría HU con `--sync-real`. **Reservar el último commit del ciclo para una capa explícita de cascadas resueltas** (rondas 6-9.5 demostraron que esa capa es ineludible).

Chequeo de contrato por merge:

- **Export surface**: cada línea declara qué exports nuevos agrega. Cero rename, cero break.
- **JSON lossless**: cargar un JSON pre-ronda 10 produce modelo válido sin pérdida. Tests `serializacion/json.test.ts` deben pasar sin tocar.
- **OPL invariante donde aplica**: HU-19.015 (imágenes no afectan OPL), HU-50.013/.015 (despliegue async + especialización emiten oraciones nuevas sin alterar las existentes).
- **Behavioral surface**: `JointCellJson` mantiene orden/id/type/selectores/metadata `opm`; UI mantiene `data-testid`, foco y propagación de eventos. Cualquier `data-testid` nuevo se agrega aditivamente.
- **Detector surface**: si una HU agrega evidencia nueva, registrar regla nueva en consolidación; no comentarios señuelo.

## 9. Anclaje obligatorio a SSOT y opm-extracted

Antes de codificar cada línea, leer:

- SSOT en `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`:
  - `opm-iso-19450-es.md`: glosario y axiomas. Más relevante para L2 (modificadores), L3 (refinamiento), L4 (estados de cosa: imagen no es estado).
  - `opm-visual-es.md`: V-1 a V-240. Más relevante para L1 (grid + tamaño), L2 (markers C/E/¬), L4 (visibilidad imagen).
  - `opm-opl-es.md`: D5-D8, T1-T3, TS1-TS3. Más relevante para L2 (modificadores OPL), L3 (verbos distinguidos), L5 (polish).
  - `metodologia-opm-es.md`: workflow OPM. Lectura general.
- Evidencia OPCloud en `opm-extracted/`:
  - `INDEX.md`, `MODULES.md`, `README.md`, `REFACTOR-NOTES.md`, `assets/INDEX.md`.
  - Módulos puntuales citados en cada brief con paths absolutos desde repo root + líneas.
- HANDOFF y briefs de rondas 1-9.5 (`docs/HANDOFF.md §Decisiones Vigentes`). Ronda 10 las preserva sin reabrir.

Si SSOT y OPCloud difieren, manda SSOT.

## 10. Brief por línea

| Línea | Brief |
|---|---|
| L1 | [linea-1-grid-snap-autosize.md](./linea-1-grid-snap-autosize.md) |
| L2 | [linea-2-modificadores-enlace.md](./linea-2-modificadores-enlace.md) |
| L3 | [linea-3-descomposicion-avanzada.md](./linea-3-descomposicion-avanzada.md) |
| L4 | [linea-4-imagenes-incrustadas.md](./linea-4-imagenes-incrustadas.md) |
| L5 | [linea-5-cierre-mvp-alpha.md](./linea-5-cierre-mvp-alpha.md) |

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

Métricas esperadas post-ronda 10 (sobre base post-9.5: 561 unit / 2381 expect, 40/40 smoke, chunk principal 140 KB / 38 KB gzip, detector 55/55 reglas):

- **Unit tests ≥ 600**. Tests aditivos por feature: L1 ~10, L2 ~12, L3 ~10, L4 ~10, L5 ~5. Total razonable: ~610.
- **Smoke browser ≥ 45**. Cada línea agrega 1-2 smokes (toggle grid, modificador, timeline, imagen URL, confirmar al cerrar dirty).
- **Build**: chunk principal puede crecer ~5-15 KB (grid handlers + image overlay + búsqueda OPL). Razonable < 160 KB / < 42 KB gzip.
- **Detector ledger ≥ 55 reglas matched**, idealmente +5-8 reglas nuevas para evidencia de las features (gridConfig, subtipoModificador, imagen, alinear/distribuir, paralelo OPL, etc.). Total esperado: ~60-63 reglas.
- **MVP-α: 46.3% → ~52-55%** (cierre de parciales en EPICAs 12, 15 + features grandes nuevas en 1A, 19).
- **APIs públicas sin cambios**: cada feature se agrega como export nuevo o campo opcional aditivo.
- **Contratos observables sin cambios** donde aplica: JSON roundtrip, OPL invariante en HU-19.015, `data-testid` previos preservados.
- **`docs/HANDOFF.md` permanece intacto** durante las líneas; se actualiza solo en consolidación final.

Si una métrica no se cumple, la línea correspondiente lo declara explícito con rationale.
