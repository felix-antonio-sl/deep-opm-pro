# HANDOFF — Estado operativo del modelador OPM

**Fecha**: 2026-05-26 · **Repositorio**: `deep-opm-pro` · **Rama**: `main`
**Commits de producto**: ronda commiteada **atómicamente por el operador** (co-implementación en `main`, ya en `origin/main`): `e2ec53d` atajos O/P/S/R, `1394a42` atajo capturador, `85e2db6` inspector vs diagnóstico, `21096a7` barra simulación — más bugs adicionales que resolvió por su cuenta (`dd28882` atributos, `9669f3a` usabilidad modelos, `d19f675` contraste tokens). **Desplegado** en producción con `docker compose up -d --build` (bundle `index-BEwvFCpF.js`).
**Instancia**: `https://opforja.sanixai.com` — **HTTP 200 publico** (sin auth, ver Riesgos); `opforja` healthy + `opforja-bug-capture` ok; bundle vivo `index-BEwvFCpF.js`.

## Corte actual — Auditoría de canon `reglas-opm-estrictas.md` vs SSOT OPM

Se auditó la SSOT suprema del repo (`docs/canon-opm/reglas-opm-estrictas.md`, 1412 líneas) contra la SSOT OPM original externa (`/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`: `opm-iso-19450-es.md`, `opm-opl-es.md`, `opm-visual-es.md`, `metodologia-opm-es.md`) en 4 líneas paralelas (un `opm-specialist` por dimensión: visual, OPL, ISO/ontología/enlaces, metodología/refinamiento).

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

**Artefacto:** `docs/canon-opm/reglas-opm-estrictas.md` (7 inserciones / 5 borrados). Corte de solo-docs, aislado de los cambios in-flight del operador en `app/src/**` y de la cola de bugs.

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
1. `docs/canon-opm/reglas-opm-estrictas.md` manda para canonicidad OPM/OPD/OPL.
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

- **SSOT suprema de canon OPM (repo)**: `docs/canon-opm/reglas-opm-estrictas.md` — autoritativa para verbos/plantillas OPL (estados=`puede estar`, especialización=`puede ser`).
- SSOT OPM externa: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`.
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
  - *D — herencia de generalización computada*: propagar rasgos/estados/relaciones de generales a especializados; es cambio de kernel y debe alinearse con `docs/canon-opm/reglas-opm-estrictas.md`.
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

> Continúa desde `docs/HANDOFF.md`, sección "Corte actual — Ronda bugs OPM/OPL/OPD 2026-05-26". La tanda de 19 bugs OPM/OPL/OPD quedo cerrada en `main` con verificacion verde local (`bun run check`, `lint`, `build`, `design:governance` y Playwright focal 29/29). Si se retoma producto, priorizar: (1) limpiar las fallas historicas de `browser:smoke` completo no relacionadas con este corte; (2) triar la cola documental de bugs capturados en `docs/bugs/BUG-*` antes de stagearla; (3) continuar brechas diferidas del Tier 1 (visibilidad unidades/alias OPL; D herencia; E condiciones/loops; G sociotecnico). Antes de tocar OPM/OPL leer `docs/canon-opm/reglas-opm-estrictas.md` y la SSOT externa `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`. Antes de tocar UI/canvas leer `ui-forja/GOVERNANCE.md`. Gate UI: `cd app && bun run check && bun run lint && bun run build && bun run design:governance` + Playwright del layout/canvas afectado. Recordatorio operativo: vite-bg + e2e en paralelo produce flakes (correr e2e con `--workers=1` o apagar el dev server). No stagear cambios ajenos (`docs/auditorias/**`, deletes documentales previos, bug dirs no triados) sin instruccion explicita.
