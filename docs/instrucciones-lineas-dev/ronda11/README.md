# Ronda 11 — Cierre MVP-α: árbol OPD + persistencia + OPL polish + modelado canónico + transversales

**Fecha**: 2026-05-06
**Base**: `main` @ commit `d94903d` (`chore(ledger): recalibra detector ronda 10 (55→72 reglas, MVP-α 46.3%→50.0%)`) — HANDOFF vigente con rondas 1-10 + recalibración detector cerradas. **Cero deuda estructural pendiente** desde ronda 9.5.
**Objetivo**: 5 líneas paralelas dirigidas a **cerrar MVP-α** (50.0% → ~85-95% ponderado) atacando los 67 HU vivas pendientes/parciales en EPICA-20 (12), EPICA-30 (21), EPICA-50 (8), EPICA-10/11 (22) y EPICA-SHARED (4) + recalibración detector.

## 1. Filosofía operativa

- **Cierre sobre features nuevas**: ronda 10 abrió capacidades grandes (grid, modificadores, descomposición avanzada, imágenes). Ronda 11 cierra UX y polish que faltaba para llegar a un MVP-α presentable.
- **Aditividad estricta** preservada: cada feature agrega tipos opcionales (`?:`), exports nuevos, ningún rename. La adjunción libre/olvido entre exposed-API e internal-structure se mantiene (`urn:fxsl:kb:icas-adjunciones`).
- **Disjuntez por dominio conceptual**, no por archivo. Cada línea ocupa una capa principal con zonas de contacto declaradas y mitigadas.
- **Cierre MVP-α prioritario**: ronda 11 mueve MVP-α de 50.0% a un objetivo de **85-95% ponderado**. Cada línea declara cuántas HU cubiertas+parciales agrega y registra reglas detector ronda 11 propias.
- **Loop verde obligatorio**: cada línea cierra con `cd app && bun run check`; si toca UI/render: `bun run browser:smoke`; si toca proyección o bundle: `bun run build`. Línea base post-ronda-10: 597 unit / 2475 expect, 59/59 smoke (~1.2 min), chunk principal 163.91 KB / 43.89 KB gzip, detector 72/72 reglas.
- **Ship-beats-perfect**: si una HU expone un bug fuera de scope, se entrega como patch a `/tmp/` y NO se commitea.

## 2. Reglas duras comunes

1. **Scope estricto**: solo tocar archivos permitidos por el brief. Cualquier cambio cross-line no previsto se reporta y detiene.
2. **No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`** desde las líneas. El handoff único se actualiza solo en consolidación final. Tampoco tocar `docs/instrucciones-lineas-dev/ronda1..10/`, ni `docs/JOYAS.md`, ni la SSOT en `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/` (lectura).
3. **No tocar archivos sueltos del operador**: ni `app/scripts/in-vivo-test.mjs` ni `app/src/render/jointjs/customShapes.ts` ni `home/`. WIP del operador, fuera de scope.
4. **No copiar código 1:1 desde `opm-extracted/`**. Se usa como evidencia semántica/UX/arquitectura; la implementación se reescribe con Preact/Zustand/JointJS OSS.
5. **Citas explícitas**: cada decisión arquitectural cita SSOT (`opm-iso-19450-es.md`, `opm-visual-es.md`, `opm-opl-es.md`, `metodologia-opm-es.md`) o documento interno con paths absolutos + líneas.
6. **APIs públicas estables**: ningún rename de export. Cualquier cambio de firma de función pública se rechaza. Las features se agregan como **nuevas funciones exportadas** o **campos opcionales aditivos** en tipos.
7. **JSON lossless**: roundtrip permanece intacto. Campos nuevos en tipos opcionales (`?:`) deben tener default seguro en validadores y permitir hidratar JSON pre-ronda 11 sin pérdida.
8. **Idiomas**: docs y mensajes UI en es-CL; identificadores en estilo del repo (camelCase TS, kebab-case data-testid, helpers de operación en es-CL).
9. **Tests por capa**: cada feature trae tests al lado (`<feature>.test.ts`). Tests viejos se preservan sin reescribir.
10. **No introducir backend, Firebase, auth, Rappid, jspdf, pdf-lib, papaparse ni dependencias nuevas** en esta ronda.
11. **Commits de línea**: `feat(...)` predominante (UI polish + cierres), `refactor(...)` solo si abre superficie nueva mínima, `test(...)`, `chore(...)`. Co-author footer si aplica.
12. **No reabrir contratos de rondas 1-10**: `docs/HANDOFF.md §Decisiones Vigentes` es contrato. Ninguna línea reabre multi-selección, modo barra creación sticky, mapa = vista derivada, multi-pestaña sesión-only, undo per-pestaña, designaciones de estado, alias/unidad/descripción/URLs, duración canónica, plegado parcial, atajos centralizados, divisor árbol/canvas, diálogos custom con captura, barrel re-export como contrato público, slices Zustand con runtime singleton, detector apunta a evidencia real, code splitting Vite, aditividad estricta para features, cache imagen no-serializable, single-user EPICA-19, exclusión imagen/estados, gridConfig fuera del JSON OPM, composer overlay separado.
13. **EPICA-70 (OPCAT) y EPICA-91 (tutorial) descartadas del proyecto** desde 2026-05-05. No incluir en ningún brief.
14. **Cada línea registra sus reglas detector ronda 11**: agrega reglas nuevas en `docs/historias-usuario-v2/tools/progress-dashboard.mjs` solo en consolidación final, pero declara internamente qué HU cierra y qué evidencia lo respalda.

## 3. Stack y comandos del repo

- Bun 1.3+, TypeScript strict, Preact 10 + Signals, Zustand 5, JointJS 3.7 core, Vite 6, Playwright.
- Working directory: `/home/felix/projects/deep-opm-pro`; app en `app/`.

```bash
cd app
bun run check          # typecheck + unit tests (597 baseline post-ronda-10)
bun run browser:smoke  # Playwright Chromium 59/59 baseline (smoke 854 conocido flaky, retry verde)
bun run build          # build Vite; chunk principal 163.91 kB / 43.89 kB gzip baseline
bun run dev            # localhost:5173
```

Auditoría HU al cierre de consolidación:

```bash
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

## 4. Diagnóstico del estado MVP-α (50.0% → objetivo 85-95%)

Estado post-ronda-10 + recalibración:

| Segmento | HU vivas | Cubiertas | Parciales | Pendientes | Avance |
|---|---:|---:|---:|---:|---:|
| Total backlog | 1126 | 213 | 44 | 491 | 20.1% |
| MVP-α | 121 | 54 | 21 | 46 | 50.0% |

67 HU vivas faltantes para MVP-α distribuidas:

| Épica | Pendientes | Parciales | Total | Línea |
|---|---:|---:|---:|---|
| EPICA-20 árbol OPD | 12 | 0 | 12 | **L1** |
| EPICA-30 persistencia | 16 | 5 | 21 | **L2** |
| EPICA-50 panel OPL | 8 | 0 | 8 | **L3** |
| EPICA-10 creación cosas | 3 | 9 | 12 | **L4 (parte 1)** |
| EPICA-11 modelado básico | 6 | 4 | 10 | **L4 (parte 2)** |
| EPICA-SHARED | 1 | 3 | 4 | **L5** |

Por prioridad: ~13 M0, ~38 M1, ~16 S/C/W. **L1+L2+L3 absorben 41 HU (61%)**, **L4 absorbe 22 HU (33%)**, **L5 absorbe 4 HU + recalibración detector ronda 11**.

## 5. Contraste opm-extracted ↔ deep-opm-pro

OPCloud opera con ~349 archivos / ~165k LOC. Patrones canónicos destilables relevantes para ronda 11:

| Patrón OPCloud | Path | Aplicación ronda 11 |
|---|---|---|
| **OPD tree con menú contextual** | `opm-extracted/src/app/configuration/MenuesAndCommands/treeViewService.ts`, `app/configuration/MenuesAndCommands/contextMenusActions.ts` | L1: árbol OPD UX completa (Ctrl+↑↓, menú contextual, expandir/colapsar todo, gestión Ctrl+D, búsqueda, cortar/pegar). |
| **Save/load workflow + dialogs** | `opm-extracted/src/app/dialogs/save-as-dialog/`, `app/dialogs/save-dialog/`, `app/dialogs/load-model-dialog/` | L2: diálogos persistencia canónicos (descripción, recientes, telón, renombrar, ejemplos, archivado, autosalvado glifos). |
| **OPL pane positioning** | `opm-extracted/src/app/oplPane/oplPane.component.ts` (sidebar vs bottom toggle, minimize) | L3: panel OPL polish (toggle 123, mover lateral, minimizar/restaurar, indentar jerárquico, expandir/colapsar bloques). |
| **Drag from toolbar** | `opm-extracted/src/app/configuration/MenuesAndCommands/sideMenu/sideMenu.component.ts` | L4: drag desde Toolbar al canvas para crear cosas (HU-10.001/.002), tabla de tipos enlace contextual filtrada, biblioteca lateral. |
| **Read-only flag propagation** | `opm-extracted/src/app/modules/app/permissions.service.ts` (si existe) | L5: read-only propagado en store + UI (HU-SHARED-003), redirigir Guardar→Guardar como en read-only (HU-30.036). |

## 6. Visión general de las 5 líneas

| ID | Título | HU eje | Capa principal | Tamaño | Riesgo |
|---|---|---|---|---|---|
| **L1** | Árbol OPD completo (navegación + interacción + gestión modal) | HU-20.009..022 (12 HU) | `ui/ArbolOpd.tsx` + `ui/arbol/*` + `ui/MenuContextualArbol.tsx` + nuevo `DialogoGestionArbol.tsx` + `atajosTeclado.ts` | M | bajo-medio |
| **L2** | Persistencia + diálogos modales canónicos | HU-30.007/.011/.012/.016/.022..028/.032..036 (21 HU) | `persistencia/*` + `ui/Dialogo{Cargar,GuardarComo,Versiones,Archivados,BuscarGlobal}.tsx` + `ui/MenuPrincipal.tsx` + nuevo `ui/PantallaInicio.tsx` | L | medio |
| **L3** | Panel OPL polish (numeración + posición + minimizar + indentar) | HU-50.003..006/.021/.026..028 (8 HU) | `ui/PanelOpl.tsx` + `ui/panelOpl/*` + `opl/interaccion.ts` + nuevo `ui/panelOpl/Toolbar.tsx` | S | bajo |
| **L4** | Modelado básico canónico (drag desde toolbar + biblioteca + reanclaje + lote + propiedades enlace) | HU-10.001..004/.007..011/.017/.018/.021 + HU-11.001/.007/.012/.013/.016/.017/.020/.023/.025/.026 (22 HU) | `ui/Toolbar.tsx` + `ui/InspectorEnlace.tsx` + `ui/inspectorEnlace/*` + nuevo `ui/BibliotecaCosa.tsx` + `modelo/operaciones/enlaces.ts` | L | medio |
| **L5** | Transversales + ledger ronda 11 | HU-SHARED-003/.007/.009 + HU-30.036 read-only + recalibración detector | `store/runtime.ts` + `ui/Toolbar.tsx` + `ui/PanelOpl.tsx` + `progress-dashboard.mjs` | M | bajo |

Quedan fuera de ronda 11:

- **EPICA-32 sub-modelos** (peso alto, requiere persistencia peer): MVP-β.
- **EPICA-33 plantillas** (peso alto): MVP-β.
- **EPICA-31 carpetas/permisos** (single-user MVP no necesita): diferida.
- **EPICA-60/61 export PDF/SVG papel**: bloqueadas por regla "no introducir dependencias nuevas".
- **EPICA-71 CSV import**: bloqueada.
- **HU-50.019/.020/.022 OPL bidireccional fase profunda**: peso alto, requiere parser. Ronda 12+.
- **EPICA-1B traer conectados**: candidata ronda 12.
- **EPICA-19 pool organizacional** (HU-19.004..006): multi-user, diferida.

## 7. Mapa de archivos por línea

Convención: `aditivo` = solo agregar campos opcionales/funciones nuevas; `nuevo` = archivo creado por esa línea; `lectura` = puede leerse pero no editarse; `extiende` = agrega funciones públicas nuevas sin tocar las previas; vacío = sin contacto.

| Archivo | L1 | L2 | L3 | L4 | L5 |
|---|---|---|---|---|---|
| `app/src/modelo/tipos/ui.ts` | aditivo (`PreferenciasUiUsuario.{arbolOrden?,arbolNombresVisibles?,oplPosicion?,oplNumeracionVisible?,oplMinimizado?}`) | aditivo (`PreferenciasUiUsuario.recientesOrden?`) | aditivo (`PreferenciasUiUsuario.{oplPosicion?,oplNumeracionVisible?,oplMinimizado?,oplIndentado?}`) | — | — |
| `app/src/modelo/tipos/modelo.ts` | — | aditivo (`Modelo.descripcion?`) | — | — | — |
| `app/src/modelo/tipos/enlace.ts` | — | — | — | aditivo (`Enlace.estilo?` extendido si aplica) | — |
| `app/src/modelo/operaciones/enlaces.ts` | — | — | — | extiende (`reanclarExtremoEnlace`, `eliminarEnlacesBatch`) | — |
| `app/src/modelo/etiquetasEnlace.ts` | — | — | — | extiende (`copiarEstiloEnlace`) | — |
| `app/src/canvas/operacionesBatch.ts` | — | — | — | extiende (`eliminarEnlacesBatch`, `aplicarEstiloEnlacesBatch`) | — |
| `app/src/persistencia/workspace.ts` | aditivo (orden manual hermanos) | extiende (descripcion, recientes, archivado, autosalvado glifos) | — | — | aditivo (read-only flag) |
| `app/src/persistencia/local.ts` | — | extiende (autosalvado interval, glifos editable/candado) | — | — | aditivo (modo read-only carga) |
| `app/src/persistencia/versiones.ts` | — | extiende (toggle versiones, log-scale política, max 10) | — | — | — |
| `app/src/persistencia/autosalvado.ts` | — | extiende (autosalvado cada 5 min) | — | — | — |
| `app/src/store/runtime.ts` | — | aditivo (`solicitarConfirmacion` para Cargar dirty) | — | — | aditivo (`readOnly` flag) |
| `app/src/store/tipos.ts` | aditivo (5 acciones árbol) | aditivo (~10 acciones persistencia) | aditivo (4 acciones panel OPL) | aditivo (~8 acciones modelado) | aditivo (`readOnly?`, 1 acción) |
| `app/src/store/modelo/acciones-opd.ts` | extiende (renombrar OPD desde árbol, reordenar manual/auto, expandir/colapsar todo, navegar Ctrl±) | — | — | — | — |
| `app/src/store/modelo/acciones-canvas.ts` | — | — | extiende (`alternarNumeracionOpl`, `cambiarPosicionOpl`, `minimizarOpl`, `restaurarOpl`) | extiende (`reanclarExtremoEnlaceSeleccionado`, `eliminarEnlacesSeleccionados`, `copiarEstiloEnlaceSeleccionado`) | — |
| `app/src/store/modelo/acciones-enlace.ts` | — | — | — | extiende (`seleccionarEnlaceEspecifico`, edit propiedades) | — |
| `app/src/store/modelo/acciones-ui.ts` | extiende (`abrirGestionArbol`, `cerrarGestionArbol`) | extiende (`abrirDialogoVersiones`, `abrirDialogoArchivados`, `cerrarPantallaInicio`) | — | — | extiende (`activarReadOnly`) |
| `app/src/ui/ArbolOpd.tsx` | extiende (Ctrl+↑↓ navegación, expandir/colapsar todo, hover/foco visible) | — | — | — | — |
| `app/src/ui/arbol/NodoOpd.tsx` | aditivo (renombrado inline doble clic, drag manual reorder) | — | — | — | — |
| `app/src/ui/arbol/handlersTeclado.ts` | extiende (Ctrl+↑↓, F2 renombrar, Ctrl+D abrir gestión) | — | — | — | — |
| `app/src/ui/arbol/togglesArbol.ts` | extiende (expandir/colapsar todo) | — | — | — | — |
| `app/src/ui/MenuContextualArbol.tsx` | extiende (Renombrar, Eliminar hoja, Reordenar, Buscar) | — | — | — | — |
| `app/src/ui/DialogoGestionArbol.tsx` | **nuevo** (gestión Ctrl+D: lista, búsqueda, cortar/pegar) | — | — | — | — |
| `app/src/ui/divisorPanel.tsx` | aditivo (persistir ancho árbol HU-20.010 si no estaba) | — | — | — | — |
| `app/src/ui/PantallaInicio.tsx` | — | **nuevo** (grid de modelos recientes, telón oscurecido HU-30.011/.012) | — | — | — |
| `app/src/ui/DialogoCargarModelo.tsx` | — | extiende (toggle versiones, toggle archivados, búsqueda local, vista lista, glifos) | — | — | — |
| `app/src/ui/DialogoGuardarComo.tsx` | — | extiende (descripción opcional HU-30.007) | — | — | — |
| `app/src/ui/DialogoVersiones.tsx` | — | extiende (toggle visible HU-30.023, política log-scale HU-30.024) | — | — | — |
| `app/src/ui/DialogoArchivados.tsx` | — | extiende (toggle visible HU-30.025, restaurar HU-30.027) | — | — | — |
| `app/src/ui/MenuPrincipal.tsx` | — | extiende (Renombrar HU-30.016, ejemplos HU-30.022) | — | — | aditivo (indicador read-only) |
| `app/src/ui/Toolbar.tsx` | — | aditivo (autosalvado glifo HU-30.035) | — | aditivo (drag handlers desde botones HU-10.001/.002) | aditivo (indicador read-only HU-SHARED-003) |
| `app/src/ui/PanelOpl.tsx` | — | — | extiende (toggle numeración, minimizar, posición lateral, indentar) | — | aditivo (indicador read-only) |
| `app/src/ui/panelOpl/Toolbar.tsx` | — | — | **nuevo** (botones toggle 123, mover, minimizar) | — | — |
| `app/src/ui/panelOpl/Bloques.tsx` | — | — | aditivo (indentación + expandir/colapsar bloques) | — | — |
| `app/src/opl/interaccion.ts` | — | — | aditivo (selección por enlace específico HU-50.021) | — | — |
| `app/src/ui/InspectorEnlace.tsx` | — | — | — | extiende (estilo visual diálogo HU-11.016, copiar estilo HU-11.017) | — |
| `app/src/ui/inspectorEnlace/SeccionExtremos.tsx` | — | — | — | aditivo (reanclar puerto HU-11.020) | — |
| `app/src/ui/inspectorEnlace/SeccionMultiplicidad.tsx` | — | — | — | aditivo (tabla filtrada HU-11.026) | — |
| `app/src/ui/inspector/SeccionDescripcion.tsx` | — | — | — | extiende (descripción cosas HU-10.004) | — |
| `app/src/ui/BibliotecaCosa.tsx` | — | — | — | **nuevo** (biblioteca lateral HU-10.017/.018) | — |
| `app/src/ui/MenuTipoEnlace.tsx` | — | — | — | **nuevo** (tabla contextual filtrada HU-10.008/.009/.010/.011) | — |
| `app/e2e/opm-smoke.spec.ts` | aditivo (smoke árbol Ctrl+↑↓, gestión, expandir todo) | aditivo (smoke pantalla inicio + descripción + versiones + archivados) | aditivo (smoke OPL toggle + minimizar + indentar) | aditivo (smoke drag desde toolbar + reanclar + biblioteca) | aditivo (smoke read-only) |
| `docs/historias-usuario-v2/tools/progress-dashboard.mjs` | — | — | — | — | extiende (~15 reglas nuevas ronda 11) |
| `opm-extracted/**` | LECTURA | LECTURA | LECTURA | LECTURA | LECTURA |
| `assets/svg/**` | LECTURA | LECTURA | LECTURA | LECTURA | LECTURA |
| `docs/HANDOFF.md` | — | — | — | — | — |
| `docs/historias-usuario-v2/epicas/**` | — | — | — | — | — |

Reglas de colisión:

- **`acciones-opd.ts`**: L1 toca navegación/expansión/orden. L2 NO lo toca (los diálogos persistencia operan sobre `acciones-ui.ts` y `persistencia/*`). Sin choque.
- **`acciones-canvas.ts`**: L3 agrega 4 acciones panel OPL; L4 agrega 3 acciones modelado. Hunks disjuntos.
- **`acciones-ui.ts`**: L1 (`abrirGestionArbol`), L2 (`abrirDialogoVersiones`, `abrirDialogoArchivados`, `cerrarPantallaInicio`), L5 (`activarReadOnly`). Hunks disjuntos por línea.
- **`Toolbar.tsx`**: L2 (autosalvado glifo), L4 (drag handlers), L5 (read-only indicator). Hunks disjuntos por sección JSX.
- **`PanelOpl.tsx`**: L3 (UX completa), L5 (read-only indicator). Hunks disjuntos.
- **`MenuPrincipal.tsx`**: L2 (renombrar + ejemplos), L5 (indicador read-only). Hunks disjuntos.
- **`runtime.ts`**: L2 (`solicitarConfirmacion`), L5 (`readOnly`). Hunks disjuntos.
- **`tipos/ui.ts`**: L1 (5 prefs árbol+OPL), L2 (recientes), L3 (4 prefs OPL). Todos campos opcionales aditivos en `PreferenciasUiUsuario`.
- **`opm-smoke.spec.ts`**: TODAS las líneas agregan tests al final del archivo sin tocar tests previos.
- **Detector ledger**: L5 lo gestiona en consolidación final. Cada línea declara internamente qué reglas nuevas espera.

## 8. Protocolo de conciliación (orden de merge)

Orden sugerido: **L3 → L1 → L4 → L2 → L5 → consolidación**.

Rationale:

1. **L3 panel OPL primero** (bajo blast, polish puro): preferencias UI aditivas, posicionamiento alternativo, minimizar/restaurar. Si L3 falla aquí, las preferencias UI compartidas con L1 están mal.
2. **L1 árbol OPD segundo**: extiende navegación, gestión modal, atajos. Aterriza después de L3 para que el patrón "preferencias UI aditivas" esté validado.
3. **L4 modelado canónico tercero**: drag desde toolbar, biblioteca, reanclaje, lote. Aterriza con L1 ya estable para evitar choque sobre Toolbar.tsx.
4. **L2 persistencia cuarto**: pantalla inicio, diálogos canónicos, autosalvado glifos, versiones/archivados. Aterriza tarde para absorber cualquier cascada.
5. **L5 transversales + ledger**: último, agrupa read-only propagado y recalibración detector ronda 11.
6. **Consolidación**: detector recalibrado + cascadas residuales + HANDOFF actualizado a "post-ronda 11" + reportar avance MVP-α real.

Después de cada merge: `cd app && bun run check`; si tocó UI/render: `bun run browser:smoke`; al cierre de ronda: `bun run build` y auditoría HU con `--sync-real`. **Reservar el último commit del ciclo para una capa explícita de cascadas resueltas** (rondas 6-10 demostraron que esa capa es ineludible).

Chequeo de contrato por merge:

- **Export surface**: cada línea declara qué exports nuevos agrega. Cero rename, cero break.
- **JSON lossless**: cargar un JSON pre-ronda 11 produce modelo válido sin pérdida. Tests `serializacion/json.test.ts` deben pasar sin tocar.
- **OPL invariante**: verbalización core no cambia salvo despliegue async (HU-50.013 ya cubierto ronda 10) y especialización (HU-50.015).
- **Behavioral surface**: `JointCellJson` mantiene orden/id/type/selectores/metadata `opm`; UI mantiene `data-testid`, foco y propagación de eventos. Cualquier `data-testid` nuevo se agrega aditivamente.
- **Detector surface**: cada HU cerrada declara su evidencia; L5 agrega ~15 reglas nuevas en consolidación.

## 9. Anclaje obligatorio a SSOT y opm-extracted

Antes de codificar cada línea, leer:

- SSOT en `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`:
  - `metodologia-opm-es.md`: workflow OPM. Más relevante para L1 (árbol OPD), L2 (persistencia de modelos completos), L3 (lente OPL).
  - `opm-iso-19450-es.md`: glosario y axiomas. Más relevante para L4 (firmas enlace, propiedades canónicas).
  - `opm-visual-es.md`: V-1 a V-240. Más relevante para L4 (handles, propiedades visuales enlace).
  - `opm-opl-es.md`: D5-D8, T1-T3, TS1-TS3. Más relevante para L3 (indentación jerárquica, selección por enlace).
- Evidencia OPCloud en `opm-extracted/`:
  - `INDEX.md`, `MODULES.md`, `README.md`, `REFACTOR-NOTES.md`.
  - Módulos puntuales citados en cada brief con paths absolutos desde repo root + líneas.
- HANDOFF y briefs de rondas 1-10 (`docs/HANDOFF.md §Decisiones Vigentes`). Ronda 11 las preserva sin reabrir.

Si SSOT y OPCloud difieren, manda SSOT.

## 10. Brief por línea

| Línea | Brief |
|---|---|
| L1 | [linea-1-arbol-opd.md](./linea-1-arbol-opd.md) |
| L2 | [linea-2-persistencia-dialogos.md](./linea-2-persistencia-dialogos.md) |
| L3 | [linea-3-panel-opl-polish.md](./linea-3-panel-opl-polish.md) |
| L4 | [linea-4-modelado-canonico.md](./linea-4-modelado-canonico.md) |
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

Métricas esperadas post-ronda 11 (sobre base post-ronda-10: 597 unit / 2475 expect, 59/59 smoke, chunk principal 163.91 KB / 43.89 KB gzip, detector 72/72 reglas):

- **Unit tests ≥ 660**. Tests aditivos por línea: L1 ~12, L2 ~20, L3 ~10, L4 ~15, L5 ~5. Total razonable: ~660-680.
- **Smoke browser ≥ 75**. Cada línea agrega 2-5 smokes nuevos.
- **Build**: chunk principal puede crecer ~10-20 KB (diálogos persistencia + biblioteca + gestión árbol). Razonable < 185 KB / < 50 KB gzip.
- **Detector ledger ≥ 85 reglas matched** (vs 72 baseline; +13-15 nuevas para HU cerradas). Total esperado: ~87.
- **MVP-α: 50.0% → 85-95%** (cierre de ~50 HU vivas pendientes/parciales con evidencia detectable).
- **APIs públicas sin cambios**: cada feature se agrega como export nuevo o campo opcional aditivo.
- **Contratos observables sin cambios** donde aplica: JSON roundtrip, OPL invariante, `data-testid` previos preservados.
- **`docs/HANDOFF.md` permanece intacto** durante las líneas; se actualiza solo en consolidación final.

Si una métrica no se cumple, la línea correspondiente lo declara explícito con rationale.
