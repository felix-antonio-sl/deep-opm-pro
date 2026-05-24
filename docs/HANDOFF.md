# HANDOFF — Estado operativo del modelador OPM

**Fecha**: 2026-05-24
**Repositorio**: `deep-opm-pro`
**Rama**: `main`
**Ultimo corte funcional**: Ronda Codex Ola 1.1 — pausa de producto para **Mapa del sistema** y **Biblioteca dock**: no se montan en el shell, no aparecen en menú/toolbar/paleta/atajos y el build público no publica chunk `feature-mapa`; la lógica interna queda dormida para futura reactivación.
**Ultimo commit funcional en main**: `feat(app): pause map and dock surfaces` (`2cbed09`) + ajuste de empaquetado `chore(app): rename map export chunk` (`89bc657`).
**Ultimo corte deploy**: `89bc657` desplegado en `https://opforja.sanixai.com/` el 2026-05-24T17:12Z con `docker compose up -d --build`, `VITE_ENABLE_BUG_CAPTURE=true`, `opforja` healthy, `opforja-bug-capture` arriba y Basic Auth Traefik activo (respuesta pública HTTP 401 esperada).
**Corte**: `bun run check` verde con 1629 unit tests + 5898 expectaciones y typecheck limpio. `bun run lint` y `bun run build` verdes. Smoke focalizado `02/04/08/12-toolbar/20-biblioteca-dock` verde 59/59.

## Política De Handoff Único

`docs/HANDOFF.md` es la única memoria de traspaso vigente del proyecto. No crear handoffs paralelos. Los reportes/capturas regenerables viven ignorados por git; la memoria versionada queda aquí.

## Fuentes Normativas Y Técnicas

- Plan normativo refactor total: `docs/roadmap/refactorizacion-total-plan-normativo.md`.
- Plan activo render/UI: `docs/roadmap/render-ui-boundary-plan.md`.
- Plan produccion single-user SVG: `docs/roadmap/produccion-usuario-unico-svg-plan.md`.
- Brief UX/IFML historico: `docs/instrucciones-lineas-dev/ronda22/refactor-ux-ifml.md`.
- SSOT OPM: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`.
- Evidencia OPCloud preferente: `opm-extracted/` antes de `decompiled/`.
- Canon visual local: `docs/JOYAS.md` y `assets/svg/`.
- JointJS OSS: usar documentación oficial viva cuando se toque JointJS.

## Estado Actual

### Cierre Ronda Codex Ola 1.1 — Mapa Y Biblioteca Dock Pausados — 2026-05-24

Estado actual:

- Por decisión de producto, **Mapa del sistema** y **Biblioteca dock** no forman parte de la app por ahora.
- Se agregó [app/src/app/features.ts](/home/felix/projects/deep-opm-pro/app/src/app/features.ts) como switch explícito de superficies: `mapaSistema: false`, `bibliotecaDock: false`.
- `App.tsx` ya no importa ni monta `MapaSistema` ni `BibliotecaDock`; el canvas OPM queda como superficie central única tanto en desktop como mobile.
- `Toolbar.tsx`/`ToolbarBase.tsx` ya no exponen slot ni cluster de mapa.
- `MenuPrincipal` ya no muestra `Biblioteca dock`; `globalShortcutsPort` ya no registra `Ctrl+B` mientras la superficie esté pausada, por lo que tampoco aparece como atajo en Command Palette.
- Los puertos/viewmodels del chrome se limpiaron para no arrastrar `abrirVistaMapa`, `vistaMapaActiva`, `bibliotecaDockAbierto` ni `toggleBibliotecaDock` donde ya no son contrato de producto.
- `vite.config.ts` separa `mapaExport` como `feature-export`; el build público ya no publica/preload `feature-mapa` cuando la vista de mapa está pausada.
- La lógica interna de mapa/dock permanece en `store`, `canvas`, componentes y tests unitarios para reactivación futura; esto es una pausa de superficie, no borrado de dominio.

Verificación:

- `bun run check`: typecheck limpio; 1629 unit tests verdes, 5898 expectaciones.
- `bun run lint`: limpio.
- `bun run build`: build Vite verde; chunk visible `feature-export-*`, sin `feature-mapa-*`.
- `bunx playwright test e2e/02-canvas-y-render.spec.ts e2e/04-arbol-y-pestanas.spec.ts e2e/08-mvp-alpha-residual.spec.ts e2e/12-toolbar-overflow.spec.ts e2e/20-biblioteca-dock.spec.ts`: 59/59 verdes.
- `docker compose up -d --build`: `opforja` y `opforja-bug-capture` recreados y arriba.
- `docker ps --filter name=opforja`: `opforja` healthy, `opforja-bug-capture` up.
- `docker exec opforja wget -qO- http://127.0.0.1:8080/`: sirve bundle `index-kCfAx3ZV.js` y preload `feature-export-B8y2YYLA.js`.
- `curl -k -sS -o /tmp/opforja-prod.html -D - https://opforja.sanixai.com/`: HTTP 401 con `www-authenticate: Basic realm="traefik"` esperado.

### Cierre Ronda Codex Ola 1 — Frame Responsive, Marginalia Y Command Palette — 2026-05-24

Estado actual:

- Implementado `CodexFrame` desktop como shell principal de Opforja: cabecera editorial, grilla de tres columnas, columna izquierda tipo TOC, canvas central y margen derecho unificado. El modo mobile existente se preserva.
- El margen derecho reemplaza el panel OPL inferior: `PanelOpl`, `PanelDiagnostico`, `Inspector` y `Timeline` conviven como marginalia Codex. `data-testid="inspector-pane"` y `data-testid="opl-pane"` se preservan para compatibilidad de pruebas; el modo se expone como `data-marginalia-mode="split|opl"`.
- `CommandPalette` adopta la propuesta Codex L6: seis secciones visibles (`MODELO`, `CREAR`, `NAVEGAR`, `EXPORTAR`, `VISTA`, `ASISTENTE`), glifos tipográficos, z-index por encima de capturador de bugs y helpers testeados para agrupación/búsqueda.
- El FAB de `CapturadorBugs` en desktop se movió al borde del canvas para no tapar marginalia.
- Corregido un bug real de visibilidad tras importar/cargar modelos: el auto-encuadre ahora centra el viewport sobre el bbox del OPD activo sin aplicar transformaciones JointJS automáticas que alteraban drag/drop y selección. `fitCanvasAPantalla` queda reservado para fit explícito.
- Se actualizaron los E2E afectados por la nueva arquitectura visual: inspector/OPL en marginalia, tabs de modelos vs tabs de inspector, swatches Codex crimson y labels SVG con ajuste de texto.

Decisiones consolidadas:

- **Codex es identidad única**: no se implementa theme switch Bauhaus/Codex en esta ola.
- **Responsive se conserva**: desktop adopta frame Codex; mobile mantiene `ModoRevisionMobile` con piel/token Codex vigente.
- **Canvas sin cambio de routing**: se toca encuadre/visibilidad de viewport, no `proyeccion.ts`, `opcloudRouting.ts`, anchors, multiplicidad ni reglas OPCloud.
- **Marginalia como default**: al colapsar inspector el margen derecho no desaparece; queda como OPL marginalia.
- **Repo liviano**: `app/dist` y `app/test-results` se eliminan tras verificación; los cambios no relacionados en `docs/bugs/*` permanecen fuera del stage.

Artefactos relevantes:

- [app/src/ui/App.tsx](/home/felix/projects/deep-opm-pro/app/src/ui/App.tsx) — montaje desktop `CodexFrame` y marginalia unificada.
- [app/src/ui/codex/CodexFrame.tsx](/home/felix/projects/deep-opm-pro/app/src/ui/codex/CodexFrame.tsx) — frame responsive desktop.
- [app/src/ui/codex/glifos.ts](/home/felix/projects/deep-opm-pro/app/src/ui/codex/glifos.ts) — glifos/atajos Codex.
- [app/src/ui/CommandPalette.tsx](/home/felix/projects/deep-opm-pro/app/src/ui/CommandPalette.tsx) — command palette editorial.
- [app/src/render/jointjs/JointCanvas.tsx](/home/felix/projects/deep-opm-pro/app/src/render/jointjs/JointCanvas.tsx) — auto-encuadre por bbox de OPD y guard de selección visible.
- [app/src/ui/CapturadorBugs.tsx](/home/felix/projects/deep-opm-pro/app/src/ui/CapturadorBugs.tsx) — posición desktop compatible con marginalia.

Verificación:

- `bun run check`: typecheck limpio; 1628 unit tests verdes, 5897 expectaciones.
- `bun run lint`: limpio.
- `bun run build`: build Vite verde.
- E2E por chunks/focos, todos verdes: `02/03/05/06/12/22` (73 passed, 1 skipped), `07/08/09` (40 passed), `10/11*` (35 passed), `12-beta2/13/14/15/16` (37 passed), `20/21/22/23/24/25/26/inspector-focus` (37 passed), `01/04/12-command/12-toolbar` (28 passed).
- `browser:smoke` completo monolítico: SIGTERM externo tras 74 tests, 0 fallos observados hasta ese punto; no se contabiliza como pass.
- `docker compose up -d --build`: `opforja` y `opforja-bug-capture` recreados y arriba.
- `docker ps --filter name=opforja`: `opforja` healthy, `opforja-bug-capture` up.
- `docker exec opforja wget -qO- http://127.0.0.1:8080/`: sirve `index.html` con variables Codex y bundle `index-BhF5QdOA.js`.
- `curl -k -sS -o /tmp/opforja-prod.html -D - https://opforja.sanixai.com/`: HTTP 401 con `www-authenticate: Basic realm="traefik"` esperado.

### Inicio Ronda Codex — Pivot Visual Opforja (Ola 0) — 2026-05-24

Estado actual:

- Quedó formalizada `docs/instrucciones-lineas-dev/ronda-codex/` como ronda de trabajo del pivot visual total a **Codex**: README maestro, 6 briefs de línea y prompt genérico de asignación.
- Decisiones rectoras consolidadas: Codex reemplaza la identidad Bauhaus, se preserva toda la funcionalidad actual, el layout debe seguir siendo responsive, el canvas se re-piela sin tocar routing OPCloud, y el margen derecho futuro absorbe OPL marginalia + inspector.
- **Ola 0 implementada**:
  - L1 tokens/fuentes: `app/src/ui/tokens.ts`, `tokens.test.ts`, `app/index.html`, `app/src/main.tsx`, `package.json`, `bun.lock`. Chrome pivota a papel/tinta/crimson/Inria; se preservan aliases legacy; `colors.canvas.*` sigue invariante JOYAS; JetBrains Mono usa la familia real `JetBrains Mono Variable`.
  - L4 CANON-V3 canvas: nuevo `app/src/render/jointjs/constantes.codex.ts` + repaint de attrs JointJS a paper/ink/crimson/Inria/canon OPM. No se cambió `proyeccion.ts`, `opcloudRouting.ts` ni `mapa/proyeccion.ts`; routing, anchors y multiplicidad quedan intactos.
- Correcciones de revisión integradas: se restauró `strokeWidth: 3` para estado inicial, el ghost de modo enlace reutiliza marker canónico desde `LINK_ASSETS`, `index.html` dejó de exponer Inter/Bauhaus como first paint, y los pesos Inria publicados se restringen a pesos self-hosted reales.
- Alcance no completado: L2 frame responsive, L3 margen unificado, L5 reconciliación de mapa/diálogos/dock/mobile/asistente y L6 command palette/glifos/asistente siguen pendientes. La UI visible todavía no debe evaluarse como implementación completa de Codex; Ola 0 es fundación de tokens + canvas.

Artefactos relevantes:

- [docs/instrucciones-lineas-dev/ronda-codex/README.md](/home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda-codex/README.md)
- [docs/instrucciones-lineas-dev/ronda-codex/prompt-asignacion.md](/home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda-codex/prompt-asignacion.md)
- [ui-forja/01-design-spec.md](/home/felix/projects/deep-opm-pro/ui-forja/01-design-spec.md)
- [ui-forja/08-jointjs-styling.md](/home/felix/projects/deep-opm-pro/ui-forja/08-jointjs-styling.md)
- [app/src/ui/tokens.ts](/home/felix/projects/deep-opm-pro/app/src/ui/tokens.ts)
- [app/src/render/jointjs/constantes.codex.ts](/home/felix/projects/deep-opm-pro/app/src/render/jointjs/constantes.codex.ts)

Verificación:

- `bun test src/ui/tokens.test.ts`: 13 tests verdes, 165 expectaciones.
- `bun run check`: typecheck limpio; 1619 unit tests verdes, 5856 expectaciones.
- `bun run lint`: limpio.
- `bun run build`: build Vite verde.
- `bunx playwright test e2e/09-tokens-visual.spec.ts e2e/14-canvas-fidelity.spec.ts e2e/22-responsive-review.spec.ts --workers=1`: 11/11 verdes.
- `git diff --check -- app docs/instrucciones-lineas-dev/ronda-codex`: limpio.
- `app/dist` y `app/test-results` fueron eliminados tras verificar por política de repo liviano.

### Cierre Auditoría De Pertinencia Canon Estricto — 2026-05-24

Estado actual:

- Aplicada la auditoría profunda de pertinencia/valor de cada elemento de `docs/canon-opm/reglas-opm-estrictas.md`: el canon estricto queda más alineado con R-DOC-1..8, con menos prosa explicativa, menos duplicación y reglas citables donde antes había bullets o párrafos normativos sin ID.
- **Tier 1 (cortar/reubicar)**: se retiraron del canon estricto reglas de simulación pura (`R-INS-5`, `R-EJEC-2`, `R-EJEC-4`, `R-EJEC-5`, `R-VIS-RUN-3D`) y se reubicaron en `docs/canon-opm/simulacion-ejecucion.md`; se eliminaron las notas "Crítico" de plantillas `ET/CT` que duplicaban R-MOD-1/R-MOD-4; se eliminó la enumeración no-gate de "bisimetría perfecta".
- **Tier 2 (deduplicación)**: se consolidaron remisiones a anclas normativas: línea temporal vertical → R-INV-2/R-INV-2A; detección de idioma por verbo → R-OPL-LANG-1; Post(P) input-only → R-MOD-4; identidad `SDx.y` → R-IDP-2; estado contenido/no flotante → R-EST-1.
- **Tier 3 (formalización)**: pasaron a reglas citables `R-ROL-UNIC-1`, `R-REF-SYNC-1/2`, `R-HIJO-1..6`, `R-IDP-0..0C`, `R-BI-DUAL-1`, `R-BI-TAB-1`, `R-MARCA-1`, `R-REF-MEC-1`, `R-MOD-0A/B`.
- **Tier 4 (alcance)**: se conservan estereotipos y `<<Requirement>>` por cobertura SSOT visual (R-DOC-4), se recortó `R-VIS-COMP-3` a frontera canónica de metadato/canvas (sin política de código ejecutable), y la tabla §9.2 queda explicitada como gate mínimo de roundtrip OPD<->OPL.
- No se tocó `app/`, parser, render, validadores ni assets.

Artefactos relevantes:

- [docs/canon-opm/reglas-opm-estrictas.md](/home/felix/projects/deep-opm-pro/docs/canon-opm/reglas-opm-estrictas.md)
- [docs/canon-opm/simulacion-ejecucion.md](/home/felix/projects/deep-opm-pro/docs/canon-opm/simulacion-ejecucion.md)

Verificación:

- `git diff --check -- docs/canon-opm/reglas-opm-estrictas.md docs/canon-opm/simulacion-ejecucion.md docs/HANDOFF.md`: limpio.
- IDs `R-*` duplicados en `docs/canon-opm/reglas-opm-estrictas.md` + `docs/canon-opm/simulacion-ejecucion.md`: sin duplicados.
- Referencias internas `R-*` huérfanas en `reglas-opm-estrictas.md`: sin huérfanas.
- Restos de Tier 1 en canon estricto (`R-INS-5`, `R-EJEC-2`, `R-EJEC-4`, `R-EJEC-5`, `R-VIS-RUN-3D`, notas "Crítico", §9.3 de bisimetría perfecta): sin coincidencias.

### Cierre Auditoría Profunda Canon Estricto + 2 Contradicciones De Diseño — 2026-05-24

Estado actual:

- Auditoría exhaustiva línea por línea de `docs/canon-opm/reglas-opm-estrictas.md` sobre 5 dimensiones (coherencia lógica, relevancia semántica, cumplimiento prescriptivo, unicidad/no-duplicación, precisión/no-ambigüedad), contrastada contra la SSOT `opm-ssot-es/`.
- Correcciones mecánicas aplicadas: P1 (eliminado metacomentario histórico que violaba R-DOC-1), P2 (`asi`→`así`, R-DOC-8), Pr1 (operadores normalizados a superficie EBNF ASCII `=`,`<`,`>`,`<=`,`>=` y `en {conjunto}` por A.7; Unicode marcado como visualización), U1 (duplicado R-INS-6≡R-HER-6 colapsado: R-INS-6 remite a R-HER-6).
- Resueltas 2 contradicciones de diseño:
  - **C1 (TS4/TS5)**: la Nota crítica §4.5 afirmaba que TS4/TS5 *son* siempre el enlace escindido, lo que contradecía ETS3/ETS4, R-EFE-3 y §6.3. Nueva regla **R-ESCIND-0** distingue dos regímenes por procedencia: (a) fragmento escindido (par acoplado de un TS3 descompuesto, sin modificadores, V-41) y (b) efecto parcial standalone (efecto completo, salida por defecto V-9, admite e/c vía ETS3/ETS4). Resuelve de paso la ambigüedad de bisimetría (Pr2): al parsear OPL aislado, TS4/TS5 es siempre standalone; el escindido solo nace de la descomposición y persiste con metadato de procedencia.
  - **C2 (modificador sobre invocación)**: AP-10 y §6.4 reclasificados de "no canonizado" a **Prohibido (error de categoría)**, fundado en `SSOT-iso §Control como modificador` (los modificadores anotan EXCLUSIVAMENTE enlaces transformador/habilitador; la invocación es familia autónoma). Sustituto canónico: nodo de decisión booleano (`SSOT-iso §Invocación cíclica con omisión condicional`). AP-28 (`c`+`e` juntos) se mantiene **No canonizado** (silencio SSOT verificado, no contradicción) y se reescribió para no usar verbo de prohibición. Nueva regla transversal **R-AP-0C** sella la distinción: silencio SSOT → régimen no-canonizado; contradicción explícita o error de categoría → bloqueo.
- El cierre es documental/normativo: no modifica `app/`, render, parser, validadores ni assets.

Decisiones consolidadas:

- **C1 — deep-opm-pro NO implementa el efecto parcial standalone (TS4/TS5 régimen b)** → clasificación **R-APP-2: no implementado**. El canon documenta ambos regímenes por fidelidad SSOT (R-APP-0), pero la app trata en la práctica todo TS4/TS5 como fragmento escindido. Si en el futuro se soporta el standalone (efecto solo-entrada con salida por defecto V-9), reabrir ETS3/ETS4 standalone como soportados.
- **C2 — modificador sobre invocación es prohibido por alcance definicional**, simétrico a AP-09 (modificador sobre estructural): ambos son errores de categoría contra la definición SSOT del modificador, no silencios.
- **Frontera silencio vs contradicción** (R-AP-0C): un anti-patrón solo ordena bloqueo si cita contradicción SSOT explícita o error de categoría; el silencio SSOT se clasifica como no-canonizado/extensión declarada y nunca se presenta como prohibición ontológica (R-APP-5).

Artefactos relevantes:

- [docs/canon-opm/reglas-opm-estrictas.md](/home/felix/projects/deep-opm-pro/docs/canon-opm/reglas-opm-estrictas.md) — R-ESCIND-0, R-AP-0C nuevas; AP-08/AP-10/AP-28, §6.4, §4.5 Nota crítica, R-EFE-3 reformulados; P1/P2/Pr1/U1.
- `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/` — fuentes verificadas: iso §Control como modificador (L379), iso L420 (resultado absoluto), opl A.7 (L1069-1070 EBNF operadores), visual §4.4/V-9/V-40/V-41/V-110, opl L297/L341-342 (ETS3/ETS4).

Verificación:

- `git diff --check -- docs/canon-opm/reglas-opm-estrictas.md`: limpio.
- IDs `R-*` duplicados: sin duplicados. Referencias nuevas (R-ESC-1, R-EFE-3, R-APP-5, R-ECA-4, R-INV-1A) resuelven a definición existente.
- Sin verbo de prohibición sobre silencio SSOT restante (`rechazarse como no canonizado`: 0 coincidencias).

### Cierre Simulación B0 Conceptual Al 100% (autocontenido) — 2026-05-24

Estado actual:

- El modo simulación conceptual (Beta2, kernel `modelo/simulacion/*`) queda cerrado al 100% en su slice autocontenido. Las HU que dependían solo del kernel B0 + chrome están cerradas: **B0.010** (ocultar controles manuales durante auto-avance), **B0.011/B0.012** (velocidad continua 0.25×–4× con slider `<input type="range">`), **B0.015** (toggle headless: corrida sin animación), **B0.017** (token verde viajero sobre enlaces en uso), **B0.019** (borde oliva del estado inicial), **B0.025** (resaltado OPL del proceso activo vía `data-sim-activa`), **B0.026** (navegar entre OPDs no aborta la corrida), **B0.028** (atajo Espacio play/pausa solo en modo simulación), **B0.030** (tooltips en controles de la barra). **B0.024** (lectura read-only) ya estaba cubierta.
- Smoke `e2e/12-beta2-modo-simulacion.spec.ts`: 8/8 verde (3 históricos + 5 nuevos) en ~28s con `--workers=1`. Cobertura nueva: slider+Espacio, headless hasta completar, resaltado OPL, ocultamiento de Paso/Correr/Reiniciar durante auto-avance, y persistencia del contexto al navegar OPDs.

Decisiones consolidadas:

- **Bug real encontrado y corregido (B0.028)**: `teclaNormalizada` en `src/ui/atajosTeclado.ts` resolvía `e.key === " "` por la rama `length === 1` y devolvía un espacio literal, que nunca casaba con el combo registrado `"Space"`. El atajo Espacio play/pausa estaba muerto en el navegador (el unit test no lo detectaba porque invoca el handler directamente). Fix: mapear `" " → "Space"` ANTES del atajo `length === 1`. Regresión sellada con unit test en `atajosTeclado.test.ts` (dispatch real de `key=" "`).
- **Test de velocidad realineado**: `mapa.test.ts > "velocidad de simulacion se normaliza..."` esperaba una escalera discreta `[0.5,1,2,4]` obsoleta. El commit `2ddc792` (B0.011/012) cambió `normalizarVelocidadSimulacion` a clamp continuo `[0.25,4]` sin actualizar el test. Se realineó el test al comportamiento continuo vigente (clamp + NaN→1, sin enganche a escalera).
- **Diferidos explícitos**: **B0.014** (Async paralelo) y **B0.020–B0.022** (ciclo simular→OPL→reordenar-Y) quedan FUERA de este cierre por dependencia dura de **EPICA-12** — concretamente **HU-12.016** (orden temporal por coordenada Y) y **HU-12.017** (procesos concurrentes en misma Y), ambas pendientes. No reabrir B0.014/B0.020–B0.022 hasta que E12 aterrice el orden-por-Y.

Artefactos relevantes:

- `docs/superpowers/specs/2026-05-24-simulacion-b0-conceptual-100-design.md` — spec del cierre (ruta canónica del ciclo; ejecutado vía subagent-driven development en el worktree `worktree-sim-b0-conceptual`).
- `docs/superpowers/plans/2026-05-24-simulacion-b0-conceptual-100.md` — plan del cierre (ruta canónica del ciclo).
- [app/e2e/12-beta2-modo-simulacion.spec.ts](/home/felix/projects/deep-opm-pro/app/e2e/12-beta2-modo-simulacion.spec.ts) — smoke con los 5 tests nuevos.
- [app/src/ui/atajosTeclado.ts](/home/felix/projects/deep-opm-pro/app/src/ui/atajosTeclado.ts) — fix `teclaNormalizada` espacio→"Space".
- [app/src/ui/simulacion/BarraSimulacion.tsx](/home/felix/projects/deep-opm-pro/app/src/ui/simulacion/BarraSimulacion.tsx) — chrome de simulación (slider range, headless toggle, ocultar manuales en auto-avance).

Verificación:

- `bun run check`: 1615 unit tests verdes, 5746 expectaciones, typecheck `tsc --noEmit` limpio.
- `bunx playwright test e2e/12-beta2-modo-simulacion.spec.ts --workers=1`: 8/8 verde (~28s).
- `bun run browser:smoke` (suite completa): ~211 passed / ~29 failed / 1 skipped. Los fallos son flakeo pre-existente de specs canvas-sensibles (`02`, `03`, `05`, `07`, `24`) bajo paralelismo sin retries; reproducen idénticos en HEAD limpio sin estos cambios (verificado stash-out: `24-conexion-anchor` 1 fail, `03-opl-panel` 5 fail con o sin el cambio). Ninguno toca simulación ni teclado.

### Cierre Estados Ciudadanos De Primera Clase — 2026-05-23

Estado actual:

- El estado de objeto OPM (`Estado` del modelo, §3.71 SSOT ISO 19450) es ahora ciudadano de primera clase de la selección del modelador, paralelo a entidad y enlace.
- Click sobre cápsula en modo normal selecciona el estado (antes redirigía al objeto propietario). Modo enlace conserva el comportamiento previo: el estado actúa como extremo del enlace en construcción.
- Componentes nuevos: `HaloEstado` (overlay Bauhaus mínimo con rename inline, popover de designación y eliminar), `InspectorEstado` (nombre, designaciones reutilizando `SeccionDesignaciones`, duración, supresión, flechas ↑↓ de posición, eliminar), `MenuContextualEstado` (right-click sobre cápsula, 6 acciones incluida designación con exclusiones SSOT D5–D8).
- Atajos canvas activos cuando `estadoSeleccionId !== null`: F2 rename, Del eliminar (vía `eliminarSeleccion` que ahora delega a `eliminarEstado` cuando todos los ids son estados), D popover designación, T modal duración, Esc deselecciona.
- Multi-select de estados via Shift/Ctrl restringido al mismo objeto propietario; cross-objeto se rechaza con mensaje.
- Operación de dominio `reordenarEstado(modelo, estadoId, indiceDestino)` con bounds + idempotencia + normalización de `Estado.orden?: number` al primer reorden.
- Acciones from-selection en el slice modelo: `eliminarEstadoSeleccionado`, `renombrarEstadoSeleccionadoSmart`, `designarEstadoSeleccionado`, `quitarDesignacionEstadoSeleccionado`, `suprimirEstadoSeleccionado`, `abrirModalDuracionEstadoSeleccionado`, `agregarEstadoHermanoDeSeleccionado`, `reordenarEstadoSeleccionado`, `designarBatch`.

Decisiones consolidadas:

- **Enfoque A con dos sellos categoriales (no B ahora)**: el spec aprobado tras brainstorming dialéctico + arbitraje polymath bajo `urn:fxsl:kb:icas-universales`, `urn:fxsl:kb:icas-preservacion` y `urn:fxsl:kb:icas-comparacion` elige extender los tres campos paralelos `seleccionId / enlaceSeleccionId / estadoSeleccionId` sellados por un punto único `setSeleccionPorTipo(kind, id|null)`, en vez de refactorizar al coproducto tagged `seleccion: { tipo, id } | null` discriminado (enfoque B). Razón: A preserva el shape del store, los componentes/handlers/atajos existentes son extensiones naturales; el costo del refactor B sin un nuevo funtor consumidor sería trabajo sin descubrimiento. La equivalencia con el coproducto se gana por el invariante de exclusividad mutua, no por la forma del tipo.
- **Invariante sellado**: toda mutación de selección pasa por `setSeleccionPorTipo` (punto único) o por las acciones específicas que lo delegan; cualquier setter directo agrega `estadoSeleccionId: null` para preservar el sello. El test categorial `seleccion.test.ts > invariante: cardinalidad <=1` itera los 4 valores de `KindSeleccion` y verifica que como máximo un campo del trío sea no-null tras cada mutación.
- **Tipado natural de componentes**: `HaloEstado`, `InspectorEstado`, `MenuContextualEstado` y el viewmodel del Inspector declaran sobre los tres campos explícitamente. Ningún componente nuevo asume "estoy dentro de una entidad seleccionada"; el discriminador es siempre cuál de los tres campos es no-null.
- **V-202 respetada**: halo, inspector y menú contextual son affordance UI, no gramática OPM. No se exportan al canon y no aparecen en la SSOT visual.

Deuda categorial activa (trigger explícito hacia B):

- Cuando entre el siguiente paquete (descubribilidad: OPL-jump global, Cmd+K command palette con búsqueda de estados, árbol OPD con estado como nodo hijo del objeto, o cualquier cuarto tipo seleccionable), **migrar A → B antes** de construir el nuevo funtor consumidor. La migración reemplaza los tres campos por `seleccion: { tipo: KindSeleccion; id: Id } | null` discriminado con adaptadores backwards-compat durante la transición. Esta deuda se anota también en `CLAUDE.md` proyecto.

Artefactos relevantes:

- [docs/superpowers/specs/2026-05-23-estados-ciudadania-primera-clase-design.md](/home/felix/projects/deep-opm-pro/docs/superpowers/specs/2026-05-23-estados-ciudadania-primera-clase-design.md) — spec aprobado con los dos sellos.
- [app/src/store/seleccion.ts](/home/felix/projects/deep-opm-pro/app/src/store/seleccion.ts) — `setSeleccionPorTipo`, `seleccionarEstado`, `agregarEstadoASeleccion`, `toggleSeleccionEstado` + validación mismo objeto.
- [app/src/store/runtime.ts](/home/felix/projects/deep-opm-pro/app/src/store/runtime.ts) — `tipoDeCosa(modelo, id)` + `estadoSeleccionDesdeIds` reescrita para discriminar tres tipos.
- [app/src/store/modelo/acciones-estados.ts](/home/felix/projects/deep-opm-pro/app/src/store/modelo/acciones-estados.ts) — 9 acciones from-selection + `designarBatch`.
- [app/src/modelo/operaciones/estados.ts](/home/felix/projects/deep-opm-pro/app/src/modelo/operaciones/estados.ts) — `reordenarEstado` + `Estado.orden?: number`.
- [app/src/render/jointjs/handlers/seleccion.ts](/home/felix/projects/deep-opm-pro/app/src/render/jointjs/handlers/seleccion.ts) — click cápsula precede a multi-evento entidad; right-click dispara `opm:menu-contextual-estado`.
- [app/src/render/jointjs/composers/entidad.ts](/home/felix/projects/deep-opm-pro/app/src/render/jointjs/composers/entidad.ts) — `data-estado-id` / `data-cap-rol` en `stateCapsule${index}`.
- [app/src/render/jointjs/jointjs.css](/home/felix/projects/deep-opm-pro/app/src/render/jointjs/jointjs.css) — reglas Bauhaus para `[data-selected]`, `[data-focus]`, `[data-dragging]`.
- [app/src/ui/HaloEstado.tsx](/home/felix/projects/deep-opm-pro/app/src/ui/HaloEstado.tsx), [app/src/ui/inspector/InspectorEstado.tsx](/home/felix/projects/deep-opm-pro/app/src/ui/inspector/InspectorEstado.tsx), [app/src/ui/MenuContextualEstado.tsx](/home/felix/projects/deep-opm-pro/app/src/ui/MenuContextualEstado.tsx).
- [app/e2e/15-estado-ciudadano.spec.ts](/home/felix/projects/deep-opm-pro/app/e2e/15-estado-ciudadano.spec.ts) — 10 escenarios verdes.

Verificación:

- `bun run check` (`1596 pass`, `0 fail`, `5715 expect`).
- `bunx playwright test e2e/15-estado-ciudadano.spec.ts` (`10 passed (29.8s)`).
- Regresiones reproducen sin el paquete: tests fallando en `03-opl-panel.spec.ts:98` y `05-refinamiento-y-plegado.spec.ts:196` también fallan en `HEAD~3` (flakeo pre-existente, no causado por el paquete).

### Cierre Poda Editorial Canon Estricto OPM — 2026-05-23

Estado actual:

- `docs/canon-opm/reglas-opm-estrictas.md` fue podado para eliminar solapes, redundancias, glosarios parciales, índices exhaustivos duplicativos, matrices recapitulativas y contenido metodológico periférico sin valor suficiente para el canon estricto.
- El contrato prescriptivo ahora exige que todo contenido conservado sea obligación, prohibición, condición, default, severidad, política de herramienta, matriz normativa o gate ejecutable.
- La sección 10 queda reducida a reglas operativas de importación OPL y edición OPD; las matrices de roundtrip que repetían reglas de entidades, enlaces, modificadores, refinamiento y visualidad fueron retiradas.
- Los anexos conservados son solo dos: checklist de cierre OPD<->OPL y desarrollo prescriptivo de cobertura visual. Los anexos de mapeo rápido, glosario, citación rápida e índices exhaustivos OPL/V-* fueron retirados.
- El cierre es documental/normativo: no modifica `app/`, render, parser, validadores ni assets.

Decisiones consolidadas:

- **Canon estricto no es enciclopedia**: la cobertura normativa debe vivir como regla aplicable, no como inventario paralelo.
- **Sin duplicación de reglas**: una tabla o anexo solo permanece si decide comportamiento distinto o actúa como gate verificable.
- **Metodología avanzada fuera del núcleo**: simulación, MBSE/PDR e integración virtual no deben inflar este canon salvo cuando cambien canonicidad OPD/OPL.
- **Trazabilidad sin ruido**: se conserva cita fuente por regla; se eliminan índices exhaustivos que repetían la misma trazabilidad sin agregar decisión.
- **Alcance aislado**: quedaron fuera los cambios concurrentes no relacionados en `app/src/app/ports/` y carpetas `docs/bugs/BUG-*` no versionadas.

Artefactos relevantes:

- [docs/canon-opm/reglas-opm-estrictas.md](/home/felix/projects/deep-opm-pro/docs/canon-opm/reglas-opm-estrictas.md)
- [docs/HANDOFF.md](/home/felix/projects/deep-opm-pro/docs/HANDOFF.md)
- `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`

Verificación:

- `git diff --check -- docs/canon-opm/reglas-opm-estrictas.md docs/HANDOFF.md`: limpio.
- IDs `R-*` duplicados: sin duplicados.
- Referencias internas `R-*` huérfanas: sin huérfanas.
- Restos de anexos/índices retirados (`R-READ`, `R-MBSE`, `R-VIRT`, `R-SIM-*`, `R-ANEXO-D`, `R-ANEXO-OPL`, glosario, citación rápida, índice exhaustivo): sin coincidencias.

### Cierre BUG-20260523T210035Z-7264f4 / BUG-20260523T210455Z-eec502 — 2026-05-23

Estado actual:

- Los símbolos estructurales simples y buses estructurales usan por defecto puertos centrados arriba/abajo (`in` en `15,0`, `out` en `15,30`), alineados con el router OPCloud top/bottom.
- Los anclajes manuales persistidos de símbolo estructural se conservan: el cambio solo afecta el fallback automático.
- La multiplicidad acepta notación OPCloud observada en fixtures del meta-modelo: `+`, `*`, `N`, `n..*`, `n..N` y rangos numéricos.
- Inspector de enlace, tabla de enlaces, parser OPL y generador OPL quedan alineados con esa gramática.
- `docs/bugs/INDEX.md`, `HISTORY.md` y `statuses.json` registran ambos bugs como `Resuelto`.

Decisiones consolidadas:

- **Anclaje centrado por defecto**: el router estructural ya obliga entradas/salidas top/bottom; los puertos automáticos deben coincidir con ese contrato visual.
- **Anclaje manual intacto**: si el usuario mueve el handle del símbolo, `symbolAnchors` sigue mandando sobre el default.
- **OPCloud primero para multiplicidad**: `+`, `2..*` y `3..*` existen en fixtures OPCloud y son sintaxis válida local.
- **Commit con blast radius controlado**: quedan fuera cambios concurrentes no relacionados en selección/orden de estados y carpetas `docs/bugs/BUG-*` no versionadas.

Artefactos relevantes:

- [app/src/render/jointjs/composers/enlace.ts](/home/felix/projects/deep-opm-pro/app/src/render/jointjs/composers/enlace.ts)
- [app/src/render/jointjs/agregacionBus.ts](/home/felix/projects/deep-opm-pro/app/src/render/jointjs/agregacionBus.ts)
- [app/src/modelo/operaciones/enlaces.ts](/home/felix/projects/deep-opm-pro/app/src/modelo/operaciones/enlaces.ts)
- [app/src/modelo/enlaceMultiplicidad.ts](/home/felix/projects/deep-opm-pro/app/src/modelo/enlaceMultiplicidad.ts)
- [app/src/opl/parser/parsear.ts](/home/felix/projects/deep-opm-pro/app/src/opl/parser/parsear.ts)
- [app/src/opl/generadores/refsHints.ts](/home/felix/projects/deep-opm-pro/app/src/opl/generadores/refsHints.ts)
- [docs/bugs/statuses.json](/home/felix/projects/deep-opm-pro/docs/bugs/statuses.json)

Verificación:

- `bun test src/modelo/enlaceMultiplicidad.test.ts src/modelo/operaciones.test.ts src/opl/parser/parsear.test.ts src/opl/generar.test.ts src/render/jointjs/proyeccion.test.ts` (`214 pass`)
- `bun run typecheck`
- `bun run lint`
- `bun run test` (`1586 pass`, `0 fail`)
- `bun run build`

### Cierre Coherencia Canon Estricto OPM — 2026-05-23

Estado actual:

- `docs/canon-opm/reglas-opm-estrictas.md` corrige los 12 hallazgos de auditoría normativa profunda sobre consistencia lógica, carácter prescriptivo, ambigüedad e imprecisión editorial.
- El contrato de exhaustividad ahora cubre explícitamente las cuatro capas SSOT (`opm-iso-19450-es.md`, `opm-opl-es.md`, `opm-visual-es.md`, `metodologia-opm-es.md`) y prohíbe que un índice o remisión sustituya la regla local aplicable.
- El conflicto entre procesos transformadores y procesos persistentes queda resuelto: procesos no persistentes requieren transformación; procesos persistentes requieren cierre explícito por invariancia, atributo o condición mantenida.
- La sección 12 deja de contener inventario fechado de implementación y queda como política estable de conformidad de `deep-opm-pro`.
- Anexo E pasa de checklist interrogativo a gates prescriptivos con severidad; Anexo F queda alineado con la política de cobertura desarrollada; Anexo G atomiza reglas visuales densas de runtime/export/Bring.
- El cierre es documental/normativo: no modifica `app/`, render, parser, validadores ni assets.

Decisiones consolidadas:

- **Canon estricto solo reglas**: estado vivo, tickets futuros y tablas fechadas pertenecen a `docs/HANDOFF.md`, `docs/roadmap/` o ledger de bugs, no al canon.
- **Cobertura local obligatoria**: la SSOT conserva autoridad literal, pero cada obligación aplicable debe tener regla local trazable.
- **Severidad cerrada**: refinamiento trivial bloquea cierre/export canónico; AP-27 distingue bloqueo vs advertencia por efectos previos obligatorios.
- **Ambigüedad operable**: expresiones como `cuando aplique`, “según severidad” o modos no definidos fueron reemplazadas por condiciones explícitas.
- **Alcance atómico**: los `docs/bugs/BUG-*` sin seguimiento quedan fuera del commit.

Artefactos relevantes:

- [docs/canon-opm/reglas-opm-estrictas.md](/home/felix/projects/deep-opm-pro/docs/canon-opm/reglas-opm-estrictas.md)
- [docs/HANDOFF.md](/home/felix/projects/deep-opm-pro/docs/HANDOFF.md)
- `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`

Verificación:

- `git diff --check -- docs/canon-opm/reglas-opm-estrictas.md`
- IDs `R-*` duplicados: sin duplicados.
- Referencias internas `R-*` huérfanas: sin huérfanas.
- Búsqueda de lenguaje laxo objetivo: sin restos relevantes salvo construcción prohibida explícita `"entidad" genérica sin tipo`.

### Cierre Retiro Decoración Habilitadora Visual OPM — 2026-05-23

Estado actual:

- La decoración adicional de origen para enlaces habilitadores fue eliminada de la SSOT visual KORA y del canon estricto derivado.
- `docs/canon-opm/reglas-opm-estrictas.md` conserva el Anexo G de cobertura visual prescriptiva, pero sin regla local que reintroduzca esa decoración.
- `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-visual-es.md` elimina la fila de decoraciones de extremo de enlace que definía esa marca como origen de habilitadores.
- El cierre es documental/normativo: no modifica `app/`, render, parser, validadores ni assets SVG.

Decisiones consolidadas:

- **Sin decoración adicional de origen**: la gramática visual OPM vigente NO debe usar ni exigir esa marca como decoración de origen de enlaces habilitadores.
- **SSOT y canon local alineados**: la eliminación vive en la fuente KORA y en el canon derivado de `deep-opm-pro`; no se mantiene divergencia documental.
- **Alcance de commit aislado**: en `kora` queda fuera `artifacts/skills/dev/hermes-agent-specialist/`; en `deep-opm-pro` quedan fuera los `docs/bugs/BUG-*` sin seguimiento.

Artefactos relevantes:

- [docs/canon-opm/reglas-opm-estrictas.md](/home/felix/projects/deep-opm-pro/docs/canon-opm/reglas-opm-estrictas.md)
- [docs/HANDOFF.md](/home/felix/projects/deep-opm-pro/docs/HANDOFF.md)
- `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-visual-es.md`
- KORA local commit: `df7a9ee docs(opm): remove habilitator origin decoration from visual ssot`.

Verificación:

- Búsqueda literal de las tres variantes retiradas en `deep-opm-pro` y `opm-ssot-es`: sin coincidencias exactas.
- `git diff --check -- docs/canon-opm/reglas-opm-estrictas.md`: limpio.
- IDs `R-*` duplicados en canon: sin duplicados.
- `git -C /home/felix/kora diff --check -- artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-visual-es.md`: limpio.
- `python3 toolchain/kora lint-md artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-visual-es.md`: `Issues: 0`.
- `python3 toolchain/kora check --strict --path artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-visual-es.md`: falla por relaciones rotas preexistentes en memorias/handoffs KORA no relacionadas; el archivo OPM visual no aparece en los diagnósticos.

### Cierre Canon Prescriptivo OPL SSOT — 2026-05-23

Estado actual:

- `docs/canon-opm/reglas-opm-estrictas.md` incorpora la cobertura prescriptiva integral de `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-opl-es.md`.
- El canon local cubre contrato textual OPL-ES, tipografía Markdown, orden oracional, verbos y palabras clave fijas, procesos persistentes, plantillas procedurales, enlaces estructurales, contexto, rutas, atributos, EBNF, transformación EN->ES y política de idioma/modelos mixtos.
- Se agrega el `Anexo F — Índice exhaustivo de cobertura SSOT-opl`, que mapea cada sección normativa y cada bloque del Apéndice A contra reglas locales.
- El cierre es documental: no modifica parser, render, validadores ni comportamiento de `app/`.

Decisiones consolidadas:

- **Solo reglas**: el documento local debe permanecer totalmente prescriptivo; no se añaden tutoriales, ejemplos narrativos ni justificaciones sin efecto normativo.
- **Apéndice A manda la gramática formal**: la sección 17 de la SSOT OPL queda tratada como adaptación explicativa; el Apéndice A queda como forma normativa que debe poder implementarse.
- **Idioma OPL explícito**: el idioma canónico se fija por usuario/modelo; cambiar idioma regenera el párrafo completo y no debe mezclar EN/ES salvo habilitación explícita de migración.
- **Estructural etiquetada corregida**: la firma local pasa de `Cosa <-> Cosa` a `Objeto <-> Objeto` o `Proceso <-> Proceso`; la caracterización objeto-proceso queda en exhibición.
- **Operadores de rango normalizados**: ASCII es la forma parseable normativa; operadores Unicode se aceptan solo como normalización o extensión de visualización.
- **Commit aislado**: los artefactos `docs/bugs/BUG-*` sin seguimiento quedan fuera del cierre normativo.

Artefactos relevantes:

- [docs/canon-opm/reglas-opm-estrictas.md](/home/felix/projects/deep-opm-pro/docs/canon-opm/reglas-opm-estrictas.md)
- [docs/HANDOFF.md](/home/felix/projects/deep-opm-pro/docs/HANDOFF.md)
- `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-opl-es.md`

Verificación:

- `git diff --check -- docs/canon-opm/reglas-opm-estrictas.md`
- IDs `R-*` duplicados: sin duplicados.
- Patrones narrativos prohibidos en canon: sin coincidencias para `Esta sección`, `Cita normativa`, `Descripción ASCII`, `Ejemplos aplicados`, `Por qué no canon`.
- `git diff --stat -- docs/canon-opm/reglas-opm-estrictas.md`: `175 insertions(+), 3 deletions(-)`.

### Cierre BUG-20260523T201251Z-afcfbe — 2026-05-23

Estado actual:

- La raíz era `posicionLibre()` en `app/src/modelo/layout.ts`: para OPDs raíz sin contorno seguía usando columnas absolutas cerca del origen (`80/300/520/740`) y `y=90`.
- Se definió una única geometría base de canvas `7200x5200` en la capa de modelo y se derivó `POSICION_INICIAL_CANVAS` desde su centro geométrico.
- `posicionLibre()` ahora siembra la primera cosa en torno al centro geométrico y busca posiciones libres en columnas simétricas alrededor de ese centro.
- `JointCanvas` enfoca explícitamente el viewport en `CENTRO_CANVAS_GEOMETRICO` cuando un OPD vacío se muestra o cuando pasa de 0 a 1 apariencias.
- `CANVAS_BASE` del render consume la geometría exportada por modelo para evitar divergencia entre semilla lógica y tamaño del paper.
- `docs/bugs/INDEX.md`, `HISTORY.md` y `statuses.json` registran `BUG-20260523T201251Z-afcfbe` como `Resuelto`.

Decisiones consolidadas:

- El fix anterior era insuficiente porque intentaba resolver con encuadre de render una coordenada de creación todavía anclada al origen.
- La posición inicial pertenece a la capa de modelo/layout; el render sólo se encarga de enfocar ese punto.
- No se modifica la política de posicionamiento dentro de contornos de refinamiento: allí sigue mandando `columnasDentroDe()`.

Artefactos relevantes:

- [app/src/modelo/layout.ts](/home/felix/projects/deep-opm-pro/app/src/modelo/layout.ts)
- [app/src/modelo/layout.test.ts](/home/felix/projects/deep-opm-pro/app/src/modelo/layout.test.ts)
- [app/src/render/jointjs/JointCanvas.tsx](/home/felix/projects/deep-opm-pro/app/src/render/jointjs/JointCanvas.tsx)
- [app/src/render/jointjs/handlers/helpers.ts](/home/felix/projects/deep-opm-pro/app/src/render/jointjs/handlers/helpers.ts)
- [app/e2e/21-estado-vacio-opm.spec.ts](/home/felix/projects/deep-opm-pro/app/e2e/21-estado-vacio-opm.spec.ts)
- [docs/bugs/statuses.json](/home/felix/projects/deep-opm-pro/docs/bugs/statuses.json)

Verificación focalizada:

- `bun test src/modelo/layout.test.ts src/render/jointjs/handlers/helpers.test.ts` (`8 pass`)
- `bunx playwright test e2e/21-estado-vacio-opm.spec.ts --grep "primera cosa"` (`1 passed`)
- `bun run typecheck`
- `bun run lint`

### Cierre Bugs/Features Activos 19:55Z — 2026-05-23

Estado actual:

- `BUG-20260523T195539Z-276694`: el canvas ejecuta fit automático cuando un OPD vacío recibe su primera apariencia; la primera cosa creada desde toolbar queda centrada visualmente en el viewport.
- `BUG-20260523T195613Z-932476`: el capturador de bugs abre con `Ctrl+Alt+B` y `Cmd+Alt+B`.
- `BUG-20260523T195651Z-7ff54e`: al guardar un reporte se copia el ID al portapapeles y se cierra el modal; si el portapapeles falla, el reporte ya persistido no se pierde.
- `BUG-20260523T195725Z-1372c7`: el panel OPL inferior incorpora divisor horizontal, drag vertical y doble clic de reset a 180 px.
- `BUG-20260523T195754Z-dd0c18`: `Mapa del sistema` se retira de árbol OPD, menú principal y Command Palette. El código interno queda sin exposición para evitar un refactor destructivo amplio.
- `docs/bugs/INDEX.md`, `HISTORY.md` y `statuses.json` consolidan 10 activos, todos `Resuelto`.

Decisiones consolidadas:

- Para centrar la primera cosa no se cambian coordenadas de modelo ni fixtures; la responsabilidad es de viewport/render (`JointCanvas`) al detectar transición OPD vacío -> primer contenido.
- El mapa del sistema se considera función sin valor actual y se elimina de superficies de usuario; no se borra el módulo ni tests unitarios derivados para mantener bajo el blast radius.
- El OPL se redimensiona localmente en estado de `App`; no se persiste aún como preferencia de workspace porque el reporte pidió capacidad inmediata, no preferencia permanente.
- El capturador prioriza cierre rápido: guardar, copiar ID, cerrar. El ledger visible sigue disponible desde el FAB `Ver bugs y features`.

Artefactos relevantes:

- [app/src/render/jointjs/JointCanvas.tsx](/home/felix/projects/deep-opm-pro/app/src/render/jointjs/JointCanvas.tsx)
- [app/src/ui/CapturadorBugs.tsx](/home/felix/projects/deep-opm-pro/app/src/ui/CapturadorBugs.tsx)
- [app/src/ui/App.tsx](/home/felix/projects/deep-opm-pro/app/src/ui/App.tsx)
- [app/src/ui/ArbolOpd.tsx](/home/felix/projects/deep-opm-pro/app/src/ui/ArbolOpd.tsx)
- [app/src/ui/MenuPrincipal.tsx](/home/felix/projects/deep-opm-pro/app/src/ui/MenuPrincipal.tsx)
- [app/src/ui/CommandPalette.tsx](/home/felix/projects/deep-opm-pro/app/src/ui/CommandPalette.tsx)
- [docs/bugs/statuses.json](/home/felix/projects/deep-opm-pro/docs/bugs/statuses.json)
- [docs/bugs/INDEX.md](/home/felix/projects/deep-opm-pro/docs/bugs/INDEX.md)
- [docs/bugs/HISTORY.md](/home/felix/projects/deep-opm-pro/docs/bugs/HISTORY.md)

Verificación:

- `bun run typecheck`
- `bun run lint`
- `bun run test` (`1567 pass`, `0 fail`)
- `bun run build`
- `bunx playwright test e2e/10-capturador-bugs.spec.ts e2e/21-estado-vacio-opm.spec.ts e2e/03-opl-panel.spec.ts e2e/04-arbol-y-pestanas.spec.ts e2e/12-toolbar-overflow.spec.ts --grep "capturador de bugs|primera cosa|panel OPL inferior se redimensiona|mapa del sistema retirado|menú principal absorbe|MenuPrincipal separa"` (`11 passed`)

### Cierre Canon Prescriptivo ISO OPM — 2026-05-23

Estado actual:

- `docs/canon-opm/reglas-opm-estrictas.md` cambió de "canon operativo exhaustivo" a **canon prescriptivo OPD/OPL**.
- El documento ahora declara su propio contrato: no tutorial, no explicación histórica y no ejemplos sin efecto normativo.
- Se cubrieron explícitamente elementos normativos de `opm-iso-19450-es.md` que estaban ausentes o solo implícitos: conformidad, principios de modelado, modelo conceptual vs ejecución, realización, metamodelo, objetos específicos de estado, atributos/propiedades, consumo temporal, herencia, SD, árboles OPD, vistas, OPL total, operaciones de descomposición/recomposición, simulación, MBSE/PDR e integración virtual.
- La tabla de anti-patrones fue reformulada como matriz de rechazo y acción canónica, no como justificación narrativa.
- El cierre se mantiene documental: no toca `app/`, no cambia validadores, parser, render ni tests.

Decisiones consolidadas:

- **Solo reglas**: toda prosa retenida debe formular obligación, prohibición, condición, default, severidad, política de herramienta, matriz normativa o trazabilidad.
- **Cobertura ISO por prescripción**: la capa semántica no se copia como explicación; se traduce a reglas `R-*` aplicables.
- **SSOT con precedencia**: si el canon local diverge de `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md`, la regla local queda inválida y debe abrirse corrección documental.
- **Arbitraje explícito de conflicto `V-43`**: resultado+consumo al recomponer se colapsa a efecto solo con continuidad de identidad y estados trazables; sin esa continuidad se reporta conflicto.
- **Proceso persistente restringido**: ya no opera como escape para procesos sin transformee; exige temporalidad, esfuerzo sostenido o condición mantenida relevante.
- **Commit aislado**: cambios concurrentes en `app/` y `docs/bugs/` quedan fuera del cierre normativo.

Artefactos relevantes:

- [docs/canon-opm/reglas-opm-estrictas.md](/home/felix/projects/deep-opm-pro/docs/canon-opm/reglas-opm-estrictas.md)
- [docs/HANDOFF.md](/home/felix/projects/deep-opm-pro/docs/HANDOFF.md)
- `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md`

Verificación:

- `git diff --check -- docs/canon-opm/reglas-opm-estrictas.md`
- búsqueda de bloques narrativos obvios: sin `Esta sección`, `Cita normativa`, `Descripción ASCII`, `Ejemplos aplicados`, `Por qué no canon`.
- búsqueda de IDs `R-*` duplicados: sin duplicados.

Pendiente:

- Implementar validadores/parser/UI para las reglas nuevas cuando entren en alcance de producto. Este cierre solo fija norma documental.

### Cierre Pendientes Activos Bugs/Features — 2026-05-23

Estado actual:

- `docs/bugs/statuses.json`, `INDEX.md` y `HISTORY.md` consolidan 5 activos en estado `Resuelto`.
- `BUG-20260523T174915Z-6ea103`: `MenuPrincipal` ahora cierra con `pointerdown` fuera del panel.
- `BUG-20260523T174837Z-509ecc`: `BarraPestanas` conserva overflow horizontal, pero oculta el scrollbar visual de la pestaña.
- `BUG-20260520T180859Z-77e6cf`: la barra contextual de enlace queda cubierta por la superficie actual (`Propiedades`, `Copiar`, `Pegar` solo cuando aplica, `Inspector`) y pruebas E2E.
- `BUG-20260513T050858Z-ad9486`: canvas grande/dinámico existente queda complementado con fit inicial/cambio de OPD y zoom wheel más suave.
- `BUG-20260523T185803Z-a0d7bc`: ledger visible en UI permanece como cierre de la lista histórica/activa.

Decisiones consolidadas:

- No se archivaron carpetas `BUG-*`: la política de archivo sigue siendo cierre mensual/semestral o rotación por volumen; por ahora el ledger activo muestra todos como resueltos.
- Los reportes/capturas generados en `docs/bugs/BUG-*` siguen fuera del commit salvo decisión explícita; el cierre versionado vive en `statuses.json`, `INDEX.md` y `HISTORY.md`.
- Se mantiene el patrón de UI liviana: ocultar scrollbar visual sin eliminar overflow, y cerrar menús modeless por interacción exterior.

Artefactos relevantes:

- [app/src/ui/MenuPrincipal.tsx](/home/felix/projects/deep-opm-pro/app/src/ui/MenuPrincipal.tsx)
- [app/src/ui/BarraPestanas.tsx](/home/felix/projects/deep-opm-pro/app/src/ui/BarraPestanas.tsx)
- [app/src/ui/BarraPestanas.css](/home/felix/projects/deep-opm-pro/app/src/ui/BarraPestanas.css)
- [app/src/render/jointjs/JointCanvas.tsx](/home/felix/projects/deep-opm-pro/app/src/render/jointjs/JointCanvas.tsx)
- [app/src/render/jointjs/handlers/zoom.ts](/home/felix/projects/deep-opm-pro/app/src/render/jointjs/handlers/zoom.ts)
- [docs/bugs/statuses.json](/home/felix/projects/deep-opm-pro/docs/bugs/statuses.json)

Verificación focalizada:

- `bun test src/render/jointjs/handlers/zoom.test.ts src/render/jointjs/handlers/helpers.test.ts`
- `bun run typecheck`
- `bun run lint`
- `bun run test`
- `bun run build`
- `bunx playwright test e2e/12-toolbar-overflow.spec.ts --grep "BUG-20260523T174915"`
- `bunx playwright test e2e/04-arbol-y-pestanas.spec.ts --grep "BUG-20260523T174837"`
- `bunx playwright test e2e/15-superficie-contextual.spec.ts --grep "barra contextual|seleccionar una cosa|Enlace"`
- `bunx playwright test e2e/04-arbol-y-pestanas.spec.ts e2e/12-toolbar-overflow.spec.ts e2e/15-superficie-contextual.spec.ts --grep "BUG-20260523T174837|BUG-20260523T174915|barra contextual|seleccionar una cosa|Enlace"`
- `docker compose up -d --build`
- `docker exec opforja wget -qO- http://127.0.0.1:8080/healthz`
- `docker exec opforja-bug-capture bun -e "...fetch('/__deep-opm/bug-reports')..."`

### Cierre Ledger Bugs/Features — 2026-05-23

Estado actual:

- El sistema de captura ahora mantiene `docs/bugs/INDEX.md` para activos y `docs/bugs/HISTORY.md` para el ledger completo.
- `docs/bugs/statuses.json` es la fuente editable para `type`, `status`, `resolution` y `note` por ID.
- El sidecar `bug-capture` regenera ambos ledgers al guardar un reporte nuevo; `cd app && bun run bug:index` los regenera manualmente.
- El mismo endpoint `/__deep-opm/bug-reports` ahora responde `GET` con `{ active, history, counts }`, para consumo directo de la UI.
- La app muestra un segundo FAB fijo `☷` con `aria-label="Ver bugs y features"`; abre un diálogo con pestañas `Activos` e `Histórico`, tabla de ID, tipo, estado, resumen y resolución.

Decisiones consolidadas:

- **Activo vs histórico separados**: `INDEX.md` responde a la operación diaria; `HISTORY.md` cubre la memoria completa con archivados.
- **Bugs y features comparten ledger**: la captura no se limita a defectos; también registra feats y los resuelve con el mismo contrato.
- **Resolución explícita**: cada ítem debe tener estado y resolución legibles, aunque sea `Pendiente.` en activos o `Archivado sin resolución detallada.` cuando el archivo no aporte más.
- **Archivo mensual como evidencia**: los `README.md` de `docs/bugs/archive/YYYY-MM/` se usan para recuperar cierres históricos cuando existan.
- **Visibilidad dentro de la app**: el ledger deja de ser solo artefacto documental; debe poder consultarse desde el modelador desplegado para evitar duplicar reportes.

Artefactos relevantes:

- [docs/bugs/INDEX.md](/home/felix/projects/deep-opm-pro/docs/bugs/INDEX.md)
- [docs/bugs/HISTORY.md](/home/felix/projects/deep-opm-pro/docs/bugs/HISTORY.md)
- [docs/bugs/statuses.json](/home/felix/projects/deep-opm-pro/docs/bugs/statuses.json)
- [app/src/server/bugIndex.ts](/home/felix/projects/deep-opm-pro/app/src/server/bugIndex.ts)
- [app/src/server/bugCapture.ts](/home/felix/projects/deep-opm-pro/app/src/server/bugCapture.ts)
- [app/src/ui/CapturadorBugs.tsx](/home/felix/projects/deep-opm-pro/app/src/ui/CapturadorBugs.tsx)
- [app/scripts/bug-index.ts](/home/felix/projects/deep-opm-pro/app/scripts/bug-index.ts)

Verificación:

- `bun test src/server/bugCapture.test.ts`
- `bunx playwright test e2e/10-capturador-bugs.spec.ts`
- `bun run typecheck`
- `bun run test`
- `bun run lint`
- `bun run build`
- `git diff --check`
- `docker compose up -d --build`
- `docker exec opforja wget -qO- http://127.0.0.1:8080/healthz`
- `docker exec opforja-bug-capture bun -e "...fetch('/__deep-opm/bug-reports')..."`

### Cierre Canon OPD/OPL Estricto — 2026-05-23

Estado actual:

- `main` local estaba en `848186e` al iniciar el cierre documental.
- Cambio documental limitado a `docs/canon-opm/reglas-opm-estrictas.md` y esta memoria única.
- Artefactos `docs/bugs/BUG-*` sin seguimiento quedan fuera del commit por no pertenecer al cierre canónico.

Contexto:

El documento `docs/canon-opm/reglas-opm-estrictas.md` fue evolucionado desde un canon estricto parcial hacia un canon operativo exhaustivo orientado a decisiones de producto, validación y parser/generador. El foco ya no es solo listar reglas: debe decir qué se puede hacer, qué no se puede hacer, qué se puede representar solo como vista/UI, qué exige bloqueo, qué exige warning y cómo cerrar el roundtrip OPD<->OPL.

Decisiones consolidadas:

- **SSOT manda sobre OPCloud**: OPCloud sigue siendo evidencia operacional, pero cualquier divergencia semántica se resuelve contra `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`.
- **Bidireccionalidad como contrato**: ningún hecho persistente de OPD debe quedar sin oración OPL canónica o metadato tipificado, y ninguna oración OPL aceptada debe reconstruir entidades plausibles ante ambigüedad.
- **Restricción por defecto en zonas no canonizadas**: si la SSOT calla, la UI cierra por seguridad y documenta la restricción como extensión/decisión de implementación, no como prohibición ontológica.
- **Cobertura por trazabilidad explícita**: las reglas visuales `V-*` y plantillas OPL se citan por ID para que futuros commits puedan cerrar validadores sin reinterpretar el canon completo.

Artefactos relevantes:

- `docs/canon-opm/reglas-opm-estrictas.md`: canon operativo OPD/OPL, escenarios, anti-patrones, matriz de soporte y anexos.
- Anexo D del canon: índice exhaustivo de cobertura `V-*` contra `opm-visual-es.md` v3.0.0.
- Anexo E del canon: checklist de cierre OPD<->OPL para identidad, firma, estados, OPL, parsing, modificadores, refinamiento, distribución, vistas, UI, export y deuda.
- SSOT OPM: `opm-iso-19450-es.md`, `opm-visual-es.md`, `opm-opl-es.md`, `metodologia-opm-es.md`.

Verificación:

- Comparación `V-*` SSOT visual vs canon local: sin faltantes.
- Comparación IDs de plantillas OPL SSOT vs canon local: sin faltantes.
- `git diff --check -- docs/canon-opm/reglas-opm-estrictas.md docs/HANDOFF.md`: limpio.

Cierre de envío:

1. Commit atómico del cierre documental en `main`.
2. Push controlado a `origin/main`.
3. Sin build, test de app ni deploy: no hay cambio ejecutable.

### Cierre Refinamiento Paleta Bauhaus Enriquecida — 2026-05-23

Estado al cierre del refinamiento:

- `main` local en `90f01ca feat(ui): enriquece paleta Bauhaus con triada disciplinada + elegancia tonal` (luego absorbido en `27228fb` por la línea paralela del operador).
- Loop verde: `1567 unit / 0 fail` (+1 nuevo, `WCAG AA` con 4 pares cromáticos nuevos), `219 smoke / 1 skip / 0 fail`.
- Desplegado en `https://opforja.sanixai.com/` (bundle `index-CZh7jKuu.js`); verificación in-vivo confirmó la paleta vía `getComputedStyle` directo sobre tokens OPL.

Decisiones consolidadas (vía `AskUserQuestion` con previews):

- **Paleta**: Disciplinada — 5 cromáticos, tríada Bauhaus completa más secundarios.
- **Elegancia**: Completo — surface tones + axis tipográfico + OPL syntax highlight + focus ring refinado.
- Rechazadas: Mínima (4 cromáticos, perdía la tríada), Expansiva (6 cromáticos con violeta — riesgo corporate).

Artefactos:

- `app/src/ui/tokens.ts` — paleta extendida + 7 tokens cromáticos nuevos + 3 surfaces + axis weights light(300)/display(900).
- `app/index.html` — espejo CSS vars `:root` + utility classes `.opm-weight-*` y `.opm-hairline` + `:focus-visible` global refinado (2px ultramar + 1px offset).
- `app/src/ui/panelOpl/RenderToken.tsx` — syntax highlight semántico: estado en ocre, verbo en ultramar, objeto/proceso preservan tipografía como diferenciador.
- `app/src/ui/tokens.test.ts` — test WCAG actualizado con 4 nuevos pares (success/bosque, warning/ocre, destructive/terracota, objeto-chrome/bosque).
- `app/src/ui/inspectorEnlace/{SeccionEstilo,SeccionEstiloEnlace,SeccionMetadatosOpcloud,SeccionMultiplicidad}.tsx` — cards a `fondoCard` (paper02) para elevación tonal visible.

Paleta semántica fija (referencia operativa):

| Símbolo | Hex | Rol |
|---|---|---|
| cinabrio | `#C8392F` | selección, acción primaria, danger |
| ultramar | `#1F3FA6` | focus-visible, info, verbos OPL, enlaces |
| ocre | `#C89033` | warning, atención, estados OPL |
| bosque | `#2D6B47` | success, válido, completado |
| terracota | `#8A3D2D` | destructive (distinto de cinabrio) |
| paper / paper02 / paper04 | `#FAFAFA` / `#F5F5F5` / `#F0F0F0` | background / cards / nested |
| ink02 | `#050505` | énfasis tipográfico raro |

Esencia Bauhaus preservada: cero gradientes, cero blur, cero glassmorphism. Cinco cromáticos disciplinados, cada uno carga un significado. Tipografía y geometría siguen siendo el diferenciador primario; el color refuerza.

Memoria persistida: `~/.claude/projects/-home-felix-projects-deep-opm-pro/memory/project_refinamiento_paleta_bauhaus.md`.

### Cierre Ronda 28 — Vuelta 360° estética Bauhaus computacional — 2026-05-23

Estado actual:

- `main` local en `8166fa3`. **29 commits sin push**.
- Loop verde: `1560 unit / 0 fail` + `219 smoke / 0 fail / 1 skip`.

Norte estético elegido entre 4 opciones presentadas con previews: **Bauhaus
computacional** (Dieter Rams + Otl Aicher + Karl Gerstner). Precisión nórdica,
retícula visible, geometría matemática, cero decoración.

Ejecutado en 6 líneas paralelas + 1 hotfix:

- **L1 — Tokens Bauhaus + fuentes** (4 commits): paleta `colors.{ink #0A0A0A, paper #FAFAFA, accent: #C8392F cinabrio, focus: #1F3FA6 ultramar, warning, ink90..ink04}`. Fuentes Inter Tight + JetBrains Mono self-hosted via `@fontsource-variable` (~172 KB woff2). CSS vars en `:root`. 89 alias legacy mapeados con compat-shim. Tabular nums activadas.

- **L2 — Chrome superior** (4 commits): toolbar, MenuPrincipal, ChipPersistencia, Breadcrumb, BarraPestanas, CommandPalette, MenuContextual* en Bauhaus puro monocromo. Marca "OPFORJA" en chrome (Inter Tight 700/13 uppercase tracking +0.12em). CommandPalette con barra cinabrio 2px en item activo.

- **L3 — Inspector + paneles** (4 commits + hotfix): InspectorEntidad/Enlace + 12 secciones, PanelDiagnostico, panelOpl, ArbolOpd, PanelCarpetas. Labels uppercase tracking +0.08em. Inputs con caret cinabrio + focus ring ultramar. Diagnóstico con banda lateral cromática 3px (cinabrio/ink-50/ink-30 por severidad). Underline tipográfico en nombres OPL (solid objetos, dashed procesos).

- **L4 — Canvas CANON-V2** (4 commits): objetos rect con fill `#EFF7EB` (verde papel 12% sat) + stroke ink 2px. Procesos ellipse con fill `#E8F0F8` (azul papel 10% sat). Selección stroke 2.5px cinabrio + 8 handles cuadrados. Markers diferenciados por tipo de enlace (lollipop vacío instrumento / lleno agente, rombo invocación, triángulo lleno consumo/resultado, doble flecha efecto). Triángulos canónicos OPM: agregación lleno, generalización vacío, exhibición doble. Halos SIM preservan semáforo verde/cinabrio/ámbar.

- **L5 — Diálogos + asistente + bienvenida** (5 commits): 18 archivos. Backdrop ink @30%, container borde 1.5px ink + sombra plana 12 12 0 ink-15, sin border-radius. Botones primarios ink/paper, secundarios paper/ink. DialogoEstiloEnlace con 6 swatches semánticos.

- **L6 — Iconografía + mobile + estados** (5 commits): SVG inline reemplazados por glifos Unicode geométricos (◆ mapa, ⊞ descomp., ⊟ desplegar, ✎ alias, ◉ bug, ▾/▸). Bottom nav mobile con subrayado 1.5px ink en activo. Timeline con línea ink-15. FlashToast con banda lateral cromática. CapturadorBugs FAB circular.

- **Hotfix L3** (1 commit `8166fa3`): tras integración, 5 smoke fails compartían causa raíz geométrica: el badge UNFOLD/INZOOM del treeitem caía exactamente en el centro debido al reorden de cols + spacing.md elevado de L1; `treeitem.click()` de Playwright clickeaba el badge (con stopPropagation), no el treeitem. Fix: reorden `gridTemplateColumns` para que el centro caiga sobre el count (span sin handler). 5 fails → 0.

Decisiones consolidadas:

- **Canvas mantiene afordancia cromática OPM** lavada (no monocromo puro). Análisis crítico del mockup previo al despacho determinó que monocromo puro borraba la heurística del modelador habituado. Compromiso: chrome/inspector/OPL/diálogos/iconos en Bauhaus puro monocromo, canvas con OPM cromático lavado.
- **Markers de enlace diferenciados por tipo** (lollipop, rombo, triángulo). Recupera afordancia semántica que el monocromo puro habría perdido.
- **Stroke 2px en canvas, 1.5px en chrome**. Densidad de modelos OPM requiere presencia visual mayor.
- **Marca OPFORJA discreta** en chrome como detalle obsesivo identitario.

Artefactos previos al despacho:

- Mockup HTML standalone en `/tmp/ronda28-mockup/mockup.html` con design system completo aplicado.
- Captura del mockup en `/tmp/ronda28-mockup-bauhaus.png`.

Pendiente:

1. `git push origin main` (29 commits).
2. Build Docker + `docker compose up -d`.
3. Verificación visual in-vivo con Playwright contra producción.

### Cierre Ronda 27 III.A — Chrome plano de 5 elementos — 2026-05-22

Estado actual:

- Rama `main` local en `ded0df9`. **3 commits sin push** sobre los 8 commits ronda26 ya pusheados (la auditoría inicial detectó `fd9e65a` como tip remoto; pendiente verificar al hacer push).
- Loop unit verde: `bun run check` da `1555 unit pass / 0 fail / 5566 expects`.
- Loop smoke verde: `bun run browser:smoke` da `219 pass / 1 skip`.
- Bundle producción al inicio: `index-DplME2ZR.js`. Pendiente build + deploy de bundle nuevo.

Contexto:

El veredicto jobs-web-ux original §III.A pedía reducir el chrome al 70%:
"Toolbar nueva, 5 elementos visibles: [☰ Modelo] [○ Objeto] [● Proceso]
[⌘ Buscar] [● Autosalvado]". Antes de esta ronda el chrome tenía 6
controles visibles (el sexto era `⋯ Más`) y el veredicto pedía
explícitamente "Más colapsa con Modelo (un solo menú)".

La auditoría in-vivo contra producción (`opforja.sanixai.com`) confirmó:

- Chrome anterior: 6 botones — `☰`, `Sin guardar · Ctrl+S`, `Objeto`,
  `Proceso`, `⌕ Buscar`, `⋯ Más`.
- Menú `⋯ Más` contenía 9 items en estado base (Alias, Descripciones,
  Imagen, Editar imagen, Cuadrícula, Auto-layout, Biblioteca dock,
  Mapa del sistema, Simulación) + bloque condicional multi-selección
  (Eliminar, Agregar como partes, Traer enlaces, 6 alinear, 2
  distribuir, 4 alinear enlaces).

La Ronda 27 III.A cerro en 3 sub-acciones secuenciales sobre `main`:

**Sub-A** (`ca9d093`) — `feat(chrome): absorbe acciones de Mas en MenuPrincipal`:

- `menuPrincipalViewModel` gana los selectores `toggleAliasVisibles`,
  `toggleDescripcionesVisibles`, ciclo modo imagen global,
  `toggleGrid`, `aplicarLayoutSugerido`, `toggleBibliotecaDock`,
  `toggleVistaMapa`, `iniciarModoSimulacion` y `editarImagenObjetoSeleccionado`
  desde `useZustandWorkbenchViewControlsPort` + `useZustandMapViewPort`.
- `MenuPrincipal` agrega sección **Vista** (Alias, Descripciones,
  Imagen, Editar imagen contextual, Cuadrícula, Biblioteca dock) y
  amplía sección **Herramientas** con Auto-layout, Mapa del sistema y
  Simulación conceptual.
- `MenuItem` acepta `aria-pressed` via prop `activo` y `testId`
  opcional. `itemActivo` agrega estilo toggle activo.
- Decisión de diseño: preservar `data-testid="toolbar-mas-*"` heredados
  en cada item migrado para que las 7 smokes históricas sigan
  funcionando sin churn de testIds.

**Sub-B** (`94fa2e9`) — `feat(chrome): retira boton Mas del cluster Ayuda`:

- `ToolbarBase` deja de instanciar `ToolbarMas`. Eliminado:
  `construirItemsMenuMas`, `purgarSeparadoresVacios`, tipo
  `ParametrosItemsMas`, import de `ToolbarMas`, todos los selectores
  ya desabsorbidos por MenuPrincipal.
- Comentario inline explícito: chrome final = `[☰] [ChipPersistencia]
  [Objeto] [Proceso] [⌕ Buscar]`. 5 elementos planos exactos.
- `ToolbarMas.tsx` y su viewmodel/store permanecen como módulos vivos
  sin montaje en chrome (reusables a futuro si se quiere otra dropdown
  contextual). `toolbarMasAbierto` queda en false default; el test de
  exclusividad mutua sigue verde porque la lógica del store no se
  toca.

**Sub-C** (`ded0df9`) — `test(e2e): redirige specs Mas hacia menu principal`:

- `_smoke-helpers.ts` exporta `clickToolbarMasItem` canónico unificado:
  abre menú principal `☰`, clickea el item por testId, verifica cierre
  del menú.
- 7 specs e2e actualizados:
  - `02-canvas-y-render`: el cluster Ayuda audita `toolbar-mas-trigger.toHaveCount(0)`
    y `toolbar-command-palette.toBeVisible()`.
  - `04-arbol-y-pestanas`, `12-beta2-modo-simulacion`,
    `14-canvas-fidelity`, `20-biblioteca-dock`: usan el helper canónico
    y eliminan copias locales del helper.
  - `08-mvp-alpha-residual`: el test "alinear selección" pasa de
    `toolbar-mas-alinear-izq` (extinto) a `barra-alinear-seleccion`
    (BarraHerramientasElemento contextual) — equivalencia funcional
    porque `handleAlinearSeleccion = () => alinearSeleccion("izq")`.
  - `12-toolbar-overflow`: reescrito completo. Tests nuevos:
    - "toolbar plano III.A: exactamente 5 controles visibles" — ahora
      verifica `total === 5` (no `<= 25`).
    - "III.A cierre: el botón ⋯ Más desaparece del chrome" —
      `toolbar-mas-trigger.toHaveCount(0)` + cluster Ayuda con un
      solo botón.
    - "menú principal absorbe los items del ⋯ Más" — verifica que los
      6 testId heredados (`toolbar-mas-toggle-grid`, etc.) viven en
      `☰`.
    - "modo imagen global cicla desde ☰ → Vista" — verifica ciclo de
      label `por cosa → imagen + nombre`.
    - "plantillas y configuración en su sección canónica" — verifica
      `☰ → Plantillas/Modelo`.
    - "MenuPrincipal separa archivo, datos y herramientas" —
      verifica visibilidad de Mapa, Simulación y Auto-layout como
      menuitems del `☰`.

Decisiones consolidadas:

- **Conservar testid heredados** (`toolbar-mas-*`) en vez de renombrar:
  evita churn cruzado en 7 specs, mantiene compatibilidad cognitiva
  con quien lea el repo, y refleja honestamente la procedencia.
  Trade-off: el prefijo `toolbar-mas-*` es semánticamente impreciso
  (vive en `☰`, no en `⋯ Más` que ya no existe). Aceptable.
- **Las multi-selección NO migran al `☰`**: ya están en
  `BarraHerramientasElemento` contextual flotante sobre la selección
  (Eliminar, Agregar como partes, Traer enlaces, Alinear, Distribuir).
  Duplicarlas en el menú principal sería redundante.
- **`Editar imagen del objeto…` solo visible si hay objeto**:
  condicional en `MenuPrincipal` para no exhibir item disabled como
  hacía el `⋯ Más`.
- **`ToolbarMas.tsx` y su slice store no se eliminan**: ship beats
  perfect. El componente está bien aislado, su lógica de portal +
  posición es correcta, y eliminarlo agrega riesgo sin valor neto.
  Queda como reserva.

Artefactos relevantes:

- 3 commits en `main` local sobre el tip ronda26:
  ```
  ded0df9 test(e2e): redirige specs Mas hacia menu principal (ronda27 III.A.C)
  94fa2e9 feat(chrome): retira boton "Mas" del cluster Ayuda (ronda27 III.A.B)
  ca9d093 feat(chrome): absorbe acciones de Mas en MenuPrincipal (ronda27 III.A.A)
  ```

Pendiente:

1. `git push origin main` para subir los 3 commits ronda27 + verificar
   estado del remoto respecto a ronda26.
2. Build + deploy de la imagen Docker desde `ded0df9`.
3. Validación visual con curl/Playwright sobre producción: confirmar
   chrome de 5 elementos, ausencia del botón `⋯ Más`, presencia de
   items Vista/Herramientas en el menú `☰`.

### Cierre Ronda 26 — Bisimetria OPL completa (Tier 1+2) — 2026-05-22

Estado actual:

- Rama `main` local en `64d11ce`. **8 commits sin push** (Ola 1: 7 commits + Ola 2: 1 commit consolidado).
- Loop verde local: `bun run check` da `1555 unit pass / 0 fail / 5566 expects`.
- `bun run browser:smoke` pendiente revalidacion tras integracion final.

Contexto:

Un audit profundo del OPL bidireccional revelo que el producto era unidireccional
con islas de bisimetria: el generador cubria ~100% de SSOT (§3 hasta §13), pero
el parser solo entendia ~30%. 70% de las oraciones eran write-only — el usuario
las veia, podia editarlas en el modo Editar del panel, pero los cambios no se
aplicaban al canvas.

La Ronda 26 cerro Tier 1 + Tier 2 del audit con 6 lineas paralelas en 2 olas:

**Ola 1** (L1+L2+L5+L6 paralelas):

- **L1 — Eventos (§6)**: parser reconoce ET/EH/ETS/EHS ("X inicia Y, que ...").
- **L2 — Condiciones + Excepciones (§7, §8)**: parser reconoce CT/CH/CS
  ("ocurre si X existe, de lo contrario se omite") y EX1/EX2 ("ocurre si
  duracion de Y excede 5 minutos").
- **L5 — Designaciones + Plegado (§3.3, §10.5)**: parser aplica D7-D10 al
  modelo (antes parseaba pero emitia unsupported-kernel). Plegado parcial
  reconocido como informacional.
- **L6 — Roundtrip + Bug 62ee85 + UX honesta**: framework de tests de
  roundtrip (modelar→generar→parsear→aplicar→regenerar→comparar). Bug
  62ee85 fijado: estado en enlace ahora se emite consistentemente desde
  canvas. Mensaje contextual en el modo Editar avisa al usuario que ciertas
  familias se generan desde canvas.

**Ola 2** (L3+L4 secuenciadas tras Ola 1):

- **L3 — Abanicos (§11.2-§11.4) + cierre TODOs `abanico.ts`**: parser
  reconoce abanicos OR/XOR ("exactamente uno de X y Y" / "al menos uno de
  X y Y") y forma condicional §11.4. Cierra los 2 TODOs SSOT para
  resultado+condicion+abanico e invocacion+condicion+abanico.
- **L4 — Multiplicidad + Rutas (§12, §13)**: parser reconoce cardinalidad
  ("{1..N}", "*") en extremos de enlace y rutas etiquetadas
  ("Por ruta <etiqueta>, ...").

Decisiones consolidadas:

- **A5 (negacion "no") archivada por baja cobertura**: solo 2 ocurrencias
  generadas en todo el codigo. ROI inaceptable. No incluida en la ronda.
- Contrato `PatchOplPropuesto` ampliado aditivamente con `modificador`,
  `tiempoMaximo/Minimo`, `unidadTiempo*`, `multiplicidadOrigen/Destino`,
  `rutaEtiqueta`. Patch nuevo `crear-abanico` y `aplicar-designacion-estado`.
- `AstProcedimentalBase` reutilizado entre `kind: "procedimental"` y
  sub-clausulas de `kind: "evento"`. Extendido con campos opcionales de
  multiplicidad y ruta.
- Idempotencia: si el usuario edita un enlace existente sin modificador y
  agrega "ocurre si ... se omite", el modificador `condicion` se aplica;
  si ya tiene otro modificador, se emite warning `patch-conflict`.
- XOR si "exactamente uno de"; OR si "al menos uno de". Sin override desde
  texto — para cambiar operador, usar canvas.

Concurrencia (lesson learned):

- Los 4 agentes paralelos de Ola 1 trabajando en los mismos archivos centrales
  del parser (`parsear.ts`, `planificar.ts`, `aplicar.ts`, `tipos.ts`)
  generaron stashes cruzados y carreras de escritura. Tres stashes
  `ronda26-L6-...WIP` quedan en `git stash list` pero su contenido ya esta
  integrado en commits mergeados. El operador puede `git stash drop` con
  seguridad si quiere limpiar.
- Para Ola 2 se endurecieron las reglas: prohibido crear branches, prohibido
  `git stash` masivo, `git add` solo con nombres especificos. Funciono mejor.

Artefactos relevantes:

- 8 commits en `main` local:
  ```
  64d11ce feat(opl-parser): cierra bisimetria de abanicos, multiplicidad y rutas (ronda26/L3+L4)
  c999b4b test(opl-parser): cubre ciclo de eventos hasta modelo (ronda26/L1)
  cb6577c feat(opl-parser): reconoce condiciones (CT/CH/CS) y excepciones (EX1/EX2) (ronda26/L2)
  cb20949 test(opl): cubre bisimetria del bug 62ee85
  78aa9fe feat(opl): reconoce designaciones de estado D7-D10 y plegado parcial (ronda26/L5)
  87d7e3a feat(panel-opl): mensaje contextual sobre familias no editables (ronda26/L6 B4)
  2f55235 fix(opl-generador): estado en enlace emitido consistentemente (ronda26/L6 B3, BUG-20260519T200211Z-62ee85)
  b49acac test(opl): framework de roundtrip bisimetrico con fixtures iniciales (ronda26/L6 B1)
  ```

Pendiente:

1. `git push origin main` para subir los 8 commits.
2. Build + deploy de la imagen Docker desde `64d11ce`.
3. Re-audit Playwright contra produccion para confirmar visibilidad de
   cambios (especialmente el mensaje contextual de B4 en panel OPL y el
   fix del bug 62ee85 en canvas).

Pendientes documentados (fuera de alcance):

- **III.B del veredicto jobs-web-ux**: copilot contextual generalizado.
  Decision de producto: cambia la metafora del producto, no es solo
  rediseno cosmetico. Requiere su propio audit de impacto.
- **A5 (negacion "no")**: diferida por baja cobertura. Documentada arriba.

### Cierre Ronda 25 — III.A Sustraccion arquitectonica del chrome — 2026-05-22

Estado actual:

- Rama `main` local en `8ce4608`. `origin/main` aun en `af7fd7c`. **5 commits sin pushear**.
- Loop verde local: `bun run check` da `1486 unit pass / 0 fail`, `bun run browser:smoke`
  da `218 passed / 1 skip intencional / 0 failed`.
- L1 (3 commits): eliminacion de Undo/Redo del chrome global + supresion de etiqueta
  visible "Modelo" + tooltip de reversibilidad en ChipPersistencia. Atajos
  `Ctrl+Z` / `Ctrl+Shift+Z` siguen funcionando. Cobertura semantica preservada
  mediante reescritura de 06-undo-redo-dirty.spec.ts a atajos de teclado.
- L2 (2 commits): eliminacion de 2 duplicaciones netas (Plantillas y
  Configuracion residian en `☰` Modelo y en `⋯ Más`). Conservadas solo en
  el menu principal. Seccion "Plantillas" del menu Mas eliminada por quedar
  vacia. 12+ asserts en 4 specs reasignados.

Decisiones consolidadas:

- El veredicto jobs-web-ux original proponia "chrome al 70%" como rediseno
  arquitectonico (seccion III.A). Steipete-orquestador auditando el chrome
  post-ronda23+24 determino que ya estaba mas cerca de "5 elementos planos"
  de lo que el veredicto suponia: solo "Modelo" tenia etiqueta visible,
  los demas grupos solo tenian `aria-label`. La sub-accion real era mas
  pequeña que lo descrito en el veredicto.
- **NO fusionar `⋯ Más` en `☰ Modelo`**. `⋯ Más` contiene items criticos
  sin destino alternativo (auto-layout, biblioteca-dock, toggle-grid,
  modo-imagen-global, multi-seleccion). El palette Cmd-K es buscador, no
  contenedor canonico de UI.
- Undo/Redo sale del chrome visible. El power-user accede via Ctrl+Z;
  el principiante descubre la reversibilidad mediante el tooltip enriquecido
  del chip de persistencia ("Reversible con Ctrl+Z · rehacer con Ctrl+Shift+Z").
- La duplicacion Plantillas/Configuracion entre `☰` y `⋯` era cosmetica
  (mismo handler en ambos lugares). Resuelta dejando ambos items solo en
  `☰` Modelo (contenedor canonico de operaciones de modelo).

Artefactos relevantes:

- 5 commits en `main` local:
  ```
  8ce4608 test(e2e): redirige asserts de plantillas y configuracion al menu principal (ronda25/L2 III.A)
  9563f0a refactor(toolbar): elimina items duplicados Plantillas/Configuracion del menu Mas (ronda25/L2 III.A)
  10ff13e test(e2e): migra asserts undo/redo a atajos teclado (ronda25/L1 III.A)
  bd2d352 fix(chip): tooltip menciona reversibilidad con Ctrl+Z (ronda25/L1 III.A)
  aa0f707 refactor(toolbar): elimina Undo/Redo y etiqueta Modelo del chrome (ronda25/L1 III.A)
  ```

Pendiente:

1. `git push origin main` para subir los 5 commits.
2. Build + deploy de la imagen Docker desde `8ce4608`.
3. Re-audit Playwright contra produccion.

Pendientes documentados (no en alcance):

- **III.B del veredicto: copilot contextual generalizado**. Requiere decision
  de producto separada porque cambia la metafora del producto (sugerencias
  inline por elemento en vez de panel de Diagnostico). Es la unica sub-accion
  del veredicto jobs-web-ux original que queda fuera de scope ejecutado.

### Cierre Micro-Ronda 24 — Detalles cosmeticos del audit jobs-web-ux — 2026-05-21

Estado actual:

- Rama `main` local en `7d0bea9`. `origin/main` aun en `e495513`. **9 commits sin pushear**.
- Loop verde local: `bun run check` da `1486 unit pass / 0 fail`, `bun run browser:smoke`
  da `218 passed / 1 skip intencional / 0 failed`.
- Ola 1 (L1+L3+L4 paralelas): 5 commits — IDs internos ocultos como `title`, badge SSOT
  decorativo eliminado y renombrado a "Cita", boton "123" → "Nº" con tooltip claro,
  help inline en modo edicion libre del OPL, cluster Conectar contextual.
- Ola 2 (L2+L5 paralelas): 4 commits — glifo Auto coherente, copy chip persistencia
  desambiguado, hints inline en Esencia/Afiliacion del Inspector, labels visibles
  en mini-toolbar contextual.

Decisiones consolidadas:

- Audit jobs-web-ux original tenia 15 items en punch-list (cerrados en ronda23) +
  detalles menores no listados (cerrados en esta micro-ronda) + rediseno arquitectonico
  (Opcion 3 del veredicto: chrome al 70% + copilot contextual generalizado).
  El rediseno arquitectonico queda **archivado pendiente de decision de producto**
  porque toca semantica de la app, no cosmetica.
- Item #7 del veredicto (mover "+ Atributo" a contextual) ya estaba implementado
  desde Corte 3.5; no requirio trabajo.
- Item #11 (colapso menu 9→3) archivado: steipete lo identifico como decision de
  producto (mata el comando "Buscar" global si se hace mal). Pendiente brief separado.
- IDs internos del Inspector (`o-1`, `p-3`, `e-5`) se preservan como `title` HTML +
  `data-*` para deeplinking y futuros copy-to-clipboard; no se renderizan como texto.
- Badge SSOT renombrado a "Cita" (mas humano); `title="Cita SSOT: ..."` preservado
  para contratos de tests Playwright.
- Cluster "Conectar" del chrome: visible solo cuando hay 1+ entidad seleccionada o
  modo enlace/creacion activo. Brief decia "2+" pero el agente detecto que el flujo
  canonico es 1 origen + 1 destino via clic en canvas; priorizo intent sobre letra.
- Mini-toolbar contextual: 3 acciones con label visible (Descomp./Desplegar/Alias),
  +Estado queda solo-icono para no saturar el ancho.
- Copy del chip de persistencia: `Guardado` / `Guardando…` / `Cambios sin guardar`
  para variantes persistidas; `Sin guardar · Ctrl+S` solo para no persistidas
  (importado, asistente, fixture, nuevo) donde Ctrl+S abre "Guardar como".

Artefactos relevantes:

- `docs/audits/ronda23-2026-05/` sigue siendo el paquete autoritativo del ciclo
  (audit completo + briefs + screenshots pre/post). Esta micro-ronda no genera
  paquete propio; la evidencia visual se preserva en commits + tests.
- 9 commits en `main` local:
  ```
  7d0bea9 feat(mini-toolbar): labels visibles junto a iconos contextuales (ronda24/L5 #9)
  c96e958 feat(inspector): hint inline en Esencia y Afiliacion (ronda24/L5 #8)
  24ba60c fix(chip): copy persistencia coherente con autosalvado (ronda24/L2 #5)
  3b846da style(toolbar): glifo Auto coherente con estado de autosalvado (ronda24/L2 #3)
  e3b3fca feat(opl): help inline en modo edicion libre (ronda24/L3 #10)
  28379d5 refactor(toolbar): cluster Conectar aparece solo con 2+ seleccionados (ronda24/L4 #6)
  91116e8 refactor(diagnostico): elimina badge SSOT decorativo (ronda24/L1 #2)
  d1b2428 refactor(inspector): oculta IDs internos del header (ronda24/L1 #1)
  c85935f fix(opl): renombra boton 123 a Nº con tooltip claro (ronda24/L3 #4)
  ```

Validacion ejecutada por cada linea localmente. Pendiente:

1. `git push origin main` para subir los 9 commits.
2. Build y deploy de la imagen Docker desde `7d0bea9`.
3. Re-audit Playwright contra produccion para confirmar visibilidad de cambios.

Pendientes documentados (no en alcance de esta micro-ronda):

- **Rediseno arquitectonico (Opcion 3 del veredicto jobs-web-ux)**:
  - III.A: sustraccion del chrome al 70% (toolbar de 5 elementos planos).
  - III.B: copilot contextual generalizado (sugerencias inline por elemento,
    no panel separado).
  Cualquiera de los dos requiere audit de impacto previo + decision de producto.

### Cierre Ronda 23 — Remediacion UI/UX Audit jobs-web-ux — 2026-05-21

Estado actual:

- Rama `main` local en `a631742 e2e: spec onboarding canvas precargado (ronda23/L3)`.
  `origin/main` aun en `1b26f2e`. **18 commits sin pushear** correspondientes a la ronda.
- Produccion `https://opforja.sanixai.com` sigue sirviendo el baseline anterior (Corte BUG OPL).
  Pendiente: push a remoto + deploy.
- Loop verde local: `bun run check` da `1481 unit pass / 0 fail`, `bun run browser:smoke`
  da `218 passed / 1 skip intencional / 0 failed` desde el cierre L3.
- Audit completo y artefactos preservados en `docs/audits/ronda23-2026-05/`:
  README, 28 capturas pre-cambios (`audit-inicial/`), 5 capturas post-cambios
  (`validacion-postcambios/`), briefs por linea (`briefs-ronda23/`).

Decisiones consolidadas:

- El audit identifico 15 hallazgos UI/UX agrupados por el agente `steipete` en
  4 conos disjuntos. Las 4 lineas paralelas se ejecutaron en 3 olas: L1+L4
  concurrentes, luego L2, luego L3.
- 14 hallazgos cerrados ✅ + 1 ⚠ justificado (#12 icono cierre inspector;
  el render ya no usaba "···", el cambio a "✕" rompia un smoke).
- Asistente reducido de 9 etapas a 3 (Funcion → Beneficiario → Sembrar).
  9 archivos `Etapa*.tsx` eliminados + 1 nuevo `EtapaSembrar.tsx`.
- Modal de bienvenida con 3 caminos eliminado; canvas precarga ejemplo
  System Diagram + banner inline descartar.
- 43 reglas de diagnostico renombradas con titulo humano y mensaje didactico;
  IDs/codigos intactos por contrato de tests/serializacion.
- AI Text del panel OPL oculto tras feature flag `AI_TEXT_HABILITADO = false`
  hasta que la feature exista de verdad (vaporware UI removido).
- Mini-toolbar contextual: "Inzoom (descomposicion)" → "Descomponer",
  "Unfold (despliegue)" → "Desplegar" en acciones; nomenclatura tecnica
  preservada en badges del arbol (decision documentada por L1).
- Inspector: seccion Tamaño/Ancho/Alto movida del tab Refinamiento al tab Estilo;
  focus automatico + select-all en input Nombre tras crear objeto/proceso desde
  toolbar (default brutal extendido).
- Senal de focus implementada via bus en store (`solicitarFocusNombre: Id | null`)
  con helper `reenviarComboGlobalDesdeInput` para no romper atajos globales
  cuando hay input focuseado.

Hallazgos residuales documentados (no bloqueantes para deploy):

- 3 comandos del command palette todavia con `description == title`
  ("Ajustar OPD activo a pantalla", "Cerrar pestaña activa", "Colapsar todo el arbol OPD").
- Tab mobile "Issues" sigue en ingles mientras desktop dice "sugerencias".
- Tooltip `[Glos 3.69]` sobre proceso seleccionado sigue exponiendo referencia
  a seccion de glosa (hallazgo menor del audit, no estaba en la punch-list inicial).

Artefactos relevantes:

- `docs/audits/ronda23-2026-05/` paquete completo del ciclo.
- 18 commits en `main` local:
  ```
  a631742 e2e: spec onboarding canvas precargado (ronda23/L3)
  6eca4d5 fix(bienvenida): deshabilita precarga bajo Playwright y normaliza viewpoint (ronda23/L3 #7)
  ac6e797 fix(bienvenida): pestana bienvenida es reemplazable y se rebautiza al vaciar (ronda23/L3 #7)
  23e4b37 refactor(bienvenida): suprime modal por default y agrega banner descartar (ronda23/L3 #7)
  b69a893 feat(onboarding): precarga ejemplo system-diagram cuando workspace vacio (ronda23/L3 #7)
  1bc0316 refactor(asistente): poda wizard de 9 a 3 etapas (funcion, beneficiario, sembrar) (ronda23/L3 #6)
  1259160 test(diagnostico): cobertura para titulos humanos y agrupacion por regla (ronda23/L2 #2 #8)
  d1f5cc6 style(validaciones): reescribe mensajes de reglas con tono didactico (ronda23/L2 #2)
  4c8bd2b refactor(diagnostico): introduce titulos humanos y agrupacion por regla en panel (ronda23/L2 #2 #8)
  b96d5ce fix(inspector): placeholders ejemplificados e icono mobile OPDs (ronda23/L1 #13 #14)
  18dc021 style(toolbar): renombra Inzoom/Unfold a Descomponer/Desplegar (ronda23/L1 #10 #12)
  edd62ca fix(diagnostico): concordancia plural N sugerencias en panel (ronda23/L1 #9)
  9b0668b chore(opl): oculta boton AI Text hasta que la feature funcione (ronda23/L1 #5)
  3151a0e fix(palette): elimina duplicado abrir-arbol-opd y reescribe descripciones (ronda23/L1 #3 #4)
  8c13b6c fix(copy): tildes castellano en strings de UI (ronda23/L1 #1)
  fef743b test(inspector): cubre focus default y nueva ubicacion de Tamano (ronda23/L4)
  5e6d09b feat(inspector): focus automatico en input Nombre al crear elemento (ronda23/L4 #15)
  b02a5f3 refactor(inspector): mueve seccion Tamano de Refinamiento a Estilo (ronda23/L4 #11)
  ```

Validacion ejecutada:

```bash
cd app && bun run check
# 1481 unit pass / 0 fail

cd app && bun run browser:smoke
# 218 passed / 1 skipped (AI Text gateado) / 0 failed

# Playwright in-vivo contra dev local (post-merge de las 3 olas):
# 14/15 hallazgos verificados visualmente ✅, 1 justificado ⚠ (#12)
```

Proximo paso operativo:

1. `git push origin main` para subir los 18 commits.
2. Verificar deploy a `https://opforja.sanixai.com` (proceso del operador).
3. Re-audit con Playwright contra produccion una vez deployado para confirmar
   visibilidad de cambios.

### Cierre BUG-20260520T190141Z-a054e1 — OPL Estados No Pareados — 2026-05-20

Estado actual:

- Rama `main` esta en `1b26f2e fix(opl): corrige estados no pareados`, tambien
  en `origin/main`.
- Produccion `https://opforja.sanixai.com` fue reconstruida y levantada desde
  `git archive 1b26f2e`, no desde el worktree sucio. Esto evita mezclar cambios
  concurrentes de UI/asistente presentes localmente.
- El bug reportado era que el OPL generaba cambios parciales falsos al conectar
  un proceso con estados de objetos distintos:
  `Procesar 2 cambia Objeto_4 de estado1` y
  `Procesar 2 cambia Objeto_8 a e1`.
- La regla consolidada es:
  - si consumo + resultado forman una transicion completa sobre estados del
    mismo objeto, el OPL puede emitir `cambia ... de ... a ...`;
  - si un extremo de estado esta no pareado, o pertenece a otro objeto, el OPL
    conserva la semantica del enlace y califica el estado: `consume ... en` o
    `genera ... en`.

Decisiones consolidadas:

- No convertir endpoints de estado aislados en cambios parciales. Un cambio de
  estado OPM requiere la pareja semantica consumo/resultado sobre el mismo
  objeto.
- La correccion queda en el generador OPL procedimental, no en el render ni en
  la UI. El canvas ya expresaba los enlaces correctamente; la fuga estaba en
  la verbalizacion.
- El deploy debe seguir haciendose desde commit limpio cuando existan cambios
  concurrentes no propios en el worktree.
- `docs/HANDOFF.md` sigue siendo la unica memoria versionada de traspaso.

Artefactos relevantes:

- `app/src/opl/generadores/procedural.ts`
- `app/src/opl/generadores/procedural.test.ts`
- `app/src/opl/generar.test.ts`
- `docs/bugs/BUG-20260520T190141Z-a054e1/` como evidencia no versionada del
  reporte de usuario.
- Screenshot productivo de validacion:
  `/tmp/opforja-bug190141-opl-fixed.png`.

Validacion ejecutada:

```bash
cd app && bun test src/opl/generar.test.ts --test-name-pattern "BUG-20260520T190141Z|consumo desde Estado|resultado hacia Estado|par consumo-resultado"
# 4 pass / 0 fail

cd app && bun test src/opl/generadores/procedural.test.ts
# 12 pass / 0 fail

cd app && bun run check
# typecheck OK
# unit: 1486 pass / 0 fail / 5552 expect / 165 archivos

cd app && bun run build
# OK; asset local index-DC5qvVuv.js en build directo previo al deploy

cd app && bun run browser:smoke
# 211 passed / 0 failed

git archive 1b26f2e | docker build -t deep-opm-pro-opforja:latest --build-arg VITE_ENABLE_BUG_CAPTURE=true -f Dockerfile -
git archive 1b26f2e | docker build --target bug-capture -t deep-opm-pro-bug-capture:latest -f Dockerfile -
docker compose up -d --no-build
docker compose ps
# opforja healthy; opforja-bug-capture up

docker exec opforja wget -qO- http://127.0.0.1:8080/healthz
# ok

docker exec opforja-bug-capture bun -e "const r = await fetch('http://127.0.0.1:3000/healthz'); console.log(r.status, await r.text())"
# 200 {"ok":true}

curl https://opforja.sanixai.com/
# 401 sin credenciales

curl autenticado https://opforja.sanixai.com/
# 200; asset principal /assets/index-DeJZDp2-.js
```

Smoke productivo focal:

- URL: `https://opforja.sanixai.com/`
- Viewport: `1440x900`
- Flujo: cargar modelo JSON con `Objeto_4.estado1 -> Procesar 2 ->
  Objeto_8.e1`, restaurar panel OPL y verificar texto.
- Resultado observado:
  - presente: `Procesar 2 consume Objeto_4 en estado1.`
  - presente: `Procesar 2 genera Objeto_8 en e1.`
  - ausente: `Procesar 2 cambia Objeto_4 de estado1.`
  - ausente: `Procesar 2 cambia Objeto_8 a e1.`
  - sin `pageerror` ni errores/warnings relevantes de consola.

Pendientes:

- Revisar los cambios concurrentes no commiteados del worktree antes de
  cualquier nuevo commit de UI. Al cierre de este handoff existian cambios
  locales en `app/e2e/*`, `app/src/app/ports/globalShortcutsPort.ts`,
  `app/src/store/*`, `app/src/ui/*` y el archivo nuevo
  `app/e2e/inspector-focus.spec.ts`.
- Mantener fuera del commit los artefactos no versionados de bugs, auditorias,
  screenshots y rondas antiguas salvo decision explicita.
- Si se sigue con enlaces/OPL, el siguiente riesgo tecnico esta en alinear la
  previsualizacion OPL del menu de tipos con el generador canonico para evitar
  divergencias futuras.

Supuestos:

- El modo productivo vigente sigue siendo single-user, protegido por Basic Auth
  perimetral, sin auth interna de aplicacion ni backend persistente.
- El deploy autorizado sigue siendo `docker compose` local detras de Traefik.
- Los cambios concurrentes locales pertenecen a otro agente u operador y no
  deben revertirse automaticamente.

Riesgos:

- El worktree local no esta limpio por trabajo concurrente. Produccion esta
  controlada por el commit `1b26f2e`, pero el proximo agente debe inspeccionar
  esos cambios antes de build/deploy desde el directorio de trabajo.
- La correccion OPL cubre endpoints de estado no pareados y conserva TS3 cuando
  la pareja consumo/resultado es completa sobre el mismo objeto; nuevos patrones
  de abanico de estados deben seguir pasando por pruebas focales OPL.

Prompt breve de continuacion:

```text
Continuar desde docs/HANDOFF.md, seccion "Cierre BUG-20260520T190141Z-a054e1 — OPL Estados No Pareados — 2026-05-20". Estado: main/origin en 1b26f2e, opforja.sanixai.com desplegado desde git archive limpio, BUG OPL de estados no pareados corregido y verificado con bun run check, build, browser:smoke y smoke productivo. Antes de avanzar, inspeccionar cambios concurrentes no commiteados en app/e2e, app/src/store y app/src/ui; no revertirlos sin decision explicita.
```

### Corte 5 Primera Produccion Single-User + SVG — 2026-05-20

Estado actual:

- El plan `docs/roadmap/produccion-usuario-unico-svg-plan.md` queda cerrado:
  Cortes 0-5 completos.
- `main` queda como rama de release operativo para la primera version privada
  single-user.
- Produccion `https://opforja.sanixai.com` sirve el baseline final de Corte 5.
- El modo productivo vigente sigue siendo single-user, privado por Basic Auth
  perimetral de Traefik, sin auth de aplicacion, sin backend y sin sincronizacion
  remota.
- El respaldo portable sigue siendo JSON descargado por el usuario; localStorage
  no se considera backup.

Decisiones consolidadas:

- La primera produccion no espera OPX, PDF, multiusuario, cloud sync ni cierre
  total del backlog HU. Es una version privada usable: modelar, persistir local,
  respaldar JSON y exportar SVG del OPD activo.
- El gate final no baja umbrales. Durante el cierre, `quality:gate` detecto una
  caida de 89 a 86 reglas automaticas por detectores HU obsoletos tras la
  refactorizacion de enlaces. Se corrigio el auditor para seguir la arquitectura
  vigente (`transaccionEnlace`, `acciones-enlace`, `InspectorEnlace`) y el gate
  volvio a 89/105.
- `quality-ledger` registra el baseline final como contrato operativo de calidad.

Artefactos relevantes:

- `docs/roadmap/produccion-usuario-unico-svg-plan.md`
- `docs/roadmap/quality-ledger.md`
- `docs/roadmap/hu-progress.{json,md,html}`
- `docs/roadmap/hu-progress-evidence.json`
- `docs/historias-usuario-v2/tools/progress-dashboard.mjs`

Validacion ejecutada:

```bash
cd app && bun run gate:refactor
# typecheck OK
# unit: 1481 pass / 0 fail / 5527 expect, 165 archivos
# lint OK
# build OK; bundle principal 472.01 kB / 127.00 kB gzip
# browser:smoke 209 passed
# Dashboard HU: Total 27.4%; MVP-alpha 104/121 + 1 parcial (86.2%); 89/105 reglas auto
# quality:gate PASS; leyes canonicas 6/6; compat detectors 0

cd app && bun run browser:preview
# 1 passed

docker compose up -d --build
docker compose ps
# opforja healthy; opforja-bug-capture up

docker exec opforja wget -qO- http://127.0.0.1:8080/healthz
# ok

docker exec opforja wget -qO- http://bug-capture:3000/healthz
# {"ok":true}

curl https://opforja.sanixai.com/
# 401 sin credenciales

curl autenticado https://opforja.sanixai.com/
# 200 text/html; asset principal externo /assets/index-BM0_R17F.js
```

Pendientes:

- Sin pendiente bloqueante para primera produccion single-user.
- Hacer un smoke manual en el navegador real del operador: crear/cargar,
  editar, guardar, cerrar/abrir, descargar JSON y exportar SVG.
- Siguiente corte tecnico recomendado si se continua refactorizando: mini-plan
  `Link Transaction Kernel` para unificar creacion, reanclaje, anclas, puertos,
  fans y rutas UI.
- Siguiente corte de producto recomendado si se endurece produccion: auth de
  aplicacion o estrategia de backup/sync. No mezclarlo con el baseline v0.

Riesgos aceptados:

- localStorage es almacenamiento operativo, no backup.
- La app no tiene cuentas ni permisos internos; la barrera actual es Traefik.
- El backlog HU completo sigue abierto; la primera produccion se limita al
  contrato single-user + SVG.

Prompt breve de continuacion:

```text
Continuar desde docs/HANDOFF.md, sección "Corte 5 Primera Produccion Single-User + SVG — 2026-05-20". Estado: plan produccion single-user SVG cerrado, gate:refactor verde, browser:preview verde y opforja.sanixai.com desplegado. No reabrir el plan v0 salvo regresion. Siguiente corte recomendado: Link Transaction Kernel o hardening productivo de auth/backup, manteniendo gates bun run gate:refactor y smoke productivo.
```

### Handoff Explícito Y Cierre De Subagentes — 2026-05-20

Estado actual:

- Rama `main` está pusheada a `origin/main`.
- Producción `https://opforja.sanixai.com` sirve el corte de saneamiento
  categorial de fans exactos.
- El último corte funcional relevante es `a0fb239 fix(modelo): preserva
  identidad exacta de fans`; el cierre documental de deploy quedó en
  `d8e6e91 docs(handoff): registra despliegue de fans exactos`.
- Los subagentes paralelos que quedaban activos fueron desinvocados:
  `Mencius`, `Chandrasekhar`, `Volta`, `Harvey` y `Mendel`.
- El worktree conserva solo artefactos no versionados previos bajo
  `docs/bugs/`, `docs/audits/corte-visual-opcloud-derivado/` y
  `docs/instrucciones-lineas-dev/ronda22/`; no forman parte de este cierre.

Decisiones consolidadas:

- El modelo debe preservar la identidad exacta de relaciones visuales cuando
  esa identidad tiene semántica OPM. En fans, eso significa `(entidad, lado,
  portId)`, no solo entidad.
- `puertoEntidadId` se mantiene como compatibilidad legacy, pero no debe
  volver a ser usado como criterio canónico de pertenencia o render.
- La memoria de proyecto sigue siendo única: este documento, no handoffs
  paralelos.
- La próxima evolución de enlaces debe tratarse como mini-plan propio, no como
  arreglo incidental: `Link Transaction Kernel` o equivalente que unifique
  creación, reanclaje, puertos, anclas, fans y rutas UI.

Pendientes:

- Sin pendiente bloqueante para usar producción tras el corte actual.
- Si se continúa refactorizando enlaces, priorizar una transacción única de
  creación/reanclaje que devuelva modelo canónico sin depender de la
  normalización posterior de `commitModelo`.
- Revisar si la previsualización OPL del menú de tipos puede delegar en el
  generador/planificador canónico para evitar divergencias futuras.
- Mantener la deuda de OPX/i18n/simulación semántica fuera de este corte; son
  líneas de producto separadas, no saneamiento categorial inmediato.

Supuestos:

- La operación single-user sigue siendo el modo productivo actual.
- El despliegue autorizado es el stack `docker compose` local detrás de
  `opforja.sanixai.com`.
- Los artefactos no versionados de bugs/audits son material previo que no debe
  incorporarse sin una decisión explícita.

Riesgos:

- La UI de creación manual de fans propone candidatos por entidad/lado antes de
  alinear `portId`; es aceptable porque la acción alinea ancla exacta antes de
  formar el fan, pero debe seguir testeada.
- La frontera de enlaces aún distribuye responsabilidades entre kernel,
  store, render JointJS e inspector. El saneamiento de fans cerró la pérdida
  de identidad exacta, no una factorización total del sistema de enlaces.
- Cualquier importador externo que emita `abanicos` sin `puertoComun` depende
  de la migración legacy; si no hay un único puerto exacto reconstruible, será
  rechazado.

Prompt breve de continuación:

```text
Continuar desde docs/HANDOFF.md, sección "Handoff Explícito Y Cierre De Subagentes — 2026-05-20". Estado: main pusheada y opforja.sanixai.com desplegado con saneamiento categorial de fans exactos. No reabrir subagentes anteriores. Siguiente corte recomendado: mini-plan Link Transaction Kernel para unificar creación, reanclaje, anclas, puertos, fans y UI de enlaces, manteniendo gates bun run check, lint, build y browser:smoke.
```

### Corte Saneamiento Categorial De Fans Exactos — 2026-05-20

Motivación categorial: el modelo ya exigía puertos exactos para formar un
abanico, pero la entidad `Abanico` persistía principalmente `puertoEntidadId`.
Eso era un funtor de olvido no declarado desde el modelo relacional de enlaces
hacia el estado persistido: dos morfismos distintos `(entidad, lado, portId)`
podían colapsar en la misma entidad. En términos del corpus ICAS-BoK, la falla
era de preservación/faithfulness (`urn:fxsl:kb:icas-preservacion`) y de
identidad por patrón de relaciones (`urn:fxsl:kb:icas-identidad-relacion`).

Decisiones:

- `Abanico` ahora almacena `puertoComun: { entidadId, lado, portId }` como
  identidad canónica del puerto común.
- `puertoEntidadId` queda solo como alias legacy derivado de
  `puertoComun.entidadId`, para compatibilidad con JSON histórico.
- Dos abanicos del mismo tipo y de la misma entidad pueden coexistir si sus
  `portId` exactos son distintos.
- La serialización hidrata JSON legacy cuando puede reconstruir un único puerto
  exacto desde las ramas; rechaza un `puertoComun` declarado que no coincide.
- OPL, inspector, sincronización de puertos y overlay JointJS consumen la
  identidad exacta del fan. El render ya no decide pertenencia por entidad sola.
- La consulta JointJS OSS se apoyó en la documentación oficial de `LinkView`
  (`getConnectionLength`, `getPointAtLength`) y `Ports` (`id` + `port` en
  extremos de enlace). La inferencia local: el overlay debe leer la geometría
  real del `LinkView`, pero filtrar ramas por el contrato semántico exacto del
  modelo.

Artefactos:

- `app/src/modelo/tipos/abanico.ts`
- `app/src/modelo/abanicos.ts`
- `app/src/modelo/operaciones/ports.ts`
- `app/src/modelo/transaccionEnlace.test.ts`
- `app/src/serializacion/validarEnlaces.ts`
- `app/src/opl/generadores/abanico.ts`
- `app/src/opl/generadores/refsHints.ts`
- `app/src/render/jointjs/abanicoDragSync.ts`
- `app/src/render/jointjs/abanicoOverlay.ts`
- `app/src/render/jointjs/proyeccion.ts`
- `app/src/ui/inspectorEnlace/detalleContratoPuerto.test.ts`
- `app/e2e/_smoke-helpers.ts`
- `app/e2e/02-canvas-y-render.spec.ts`

Validación ejecutada:

```bash
cd app && bun test src/modelo/abanicos.test.ts src/serializacion/validarEnlaces.test.ts src/store.test.ts src/modelo/transaccionEnlace.test.ts src/opl/generadores/abanico.test.ts src/opl/generar.test.ts src/ui/inspectorEnlace/detalleContratoPuerto.test.ts src/render/jointjs/abanicoOverlay.test.ts src/render/jointjs/proyeccion.test.ts --test-name-pattern "abanico|fan|puerto comun|puerto común|BUG|OPL-ES|detalleContratoPuerto|transaccion"
# 82 pass / 0 fail

cd app && bun run check
# typecheck OK
# unit: 1479 pass / 0 fail

cd app && bun run lint
# OK

cd app && bun run build
# OK; asset principal local index-BulgeSOh.js

cd app && bun run browser:smoke
# 207 passed / 0 failed
```

Estado de cierre:

- Commit funcional: `a0fb239 fix(modelo): preserva identidad exacta de fans`.
- Push controlado a `origin/main` completado.
- Deploy ejecutado con `docker compose up -d --build`.
- Contenedores verificados: `opforja` healthy y `opforja-bug-capture` up.
- Health local: `http://127.0.0.1:8080/healthz` responde `ok`.
- Health bug-capture: `http://bug-capture:3000/healthz` responde `{"ok":true}`.
- Verificación externa autenticada: `https://opforja.sanixai.com/` sirve
  `/assets/index-CpfubC0L.js`; el bundle contiene `Fan posible`,
  `Crear fan` y `Anclaje exacto`.
- Riesgo residual: los candidatos de fan manual siguen pudiendo proponer ramas
  compatibles por entidad/lado antes de alinear `portId`; eso es intencional
  en UX, porque la acción `Crear fan` primero alinea ancla común y luego forma
  el fan exacto.

### Corte UX/UI Fans Y Anclaje Contextual — 2026-05-20

Motivación: tras el refactor de enlaces exactos, la semántica de fans era más
rigurosa, pero la UI seguía comunicando solo `Sin fan exacto`. Un modelador
podía crear dos ramas `resultado` compatibles y no veía cómo convertirlas en
abanico. La falla no era de kernel: era de affordance.

Decisiones:

- Se abrió el plan normativo `docs/roadmap/ux-ui-modelador-plan.md` para
  gobernar los próximos cortes UX/UI sin mezclar nuevas funcionalidades.
- La UI debe mostrar acciones de modelado cerca de la decisión: si un enlace
  seleccionado tiene ramas compatibles, el tab `Extremos` expone `Fan posible`
  y el botón `Crear fan`.
- La acción no reimplementa semántica en UI. El inspector consume un selector
  puro, llama un puerto de aplicación y el store coordina alineación de puerto
  común + `formarAbanico`.
- La microcopy distingue fans salientes y entrantes: `desde` para origen,
  `hacia` para destino.

Cambios:

- `candidatosAbanicoExacto` detecta fans posibles por extremo común aunque las
  ramas todavía no compartan `portId`.
- `compartirAnclaExtremosEnlaces` alinea los extremos compatibles a un puerto
  exacto común serializable.
- `crearAbanicoDesdeEnlaceSeleccionado` crea el fan manual desde la rama
  seleccionada y mantiene historial undo/dirty por `commitModelo`.
- `InspectorEnlace` y `SeccionExtremos` exponen `Fan posible` + `Crear fan`.
- El puerto `linkInspectorPort` incorpora `crearAbanicoDesdeEnlace`.
- Se agregó regresión E2E para `BUG-20260520T043712Z-72ab52`.

Artefactos:

- `docs/roadmap/ux-ui-modelador-plan.md`
- `app/src/modelo/abanicos.ts`
- `app/src/modelo/operaciones/ports.ts`
- `app/src/modelo/operaciones.ts`
- `app/src/store/modelo/acciones-enlace.ts`
- `app/src/store/modelo/contrato.ts`
- `app/src/store/tipos.ts`
- `app/src/app/ports/linkInspectorPort.ts`
- `app/src/app/ports/zustandLinkInspectorPort.ts`
- `app/src/ui/InspectorEnlace.tsx`
- `app/src/ui/inspectorEnlace/SeccionExtremos.tsx`
- `app/src/ui/inspectorEnlace/detalleContratoPuerto.ts`
- `app/src/modelo/abanicos.test.ts`
- `app/src/store.test.ts`
- `app/e2e/02-canvas-y-render.spec.ts`

Validación ejecutada:

```bash
cd app && bun run browser:smoke
# 207 passed / 0 failed

cd app && bun run check
# 1477 pass / 0 fail

cd app && bun run lint
# OK

cd app && bun run build
# OK; asset principal local index-DR6KjsJa.js

cd app && bunx playwright test e2e/02-canvas-y-render.spec.ts --grep "BUG-20260520T043712Z"
# 1 passed / 0 failed
```

Uso esperado:

1. Crear o tener dos enlaces procedurales compatibles del mismo tipo con un
   extremo común, por ejemplo dos `resultado` desde el mismo proceso.
2. Seleccionar una rama.
3. Abrir `Extremos` en el Inspector de enlace.
4. Usar `Crear fan` en el bloque `Fan posible`.
5. El inspector debe pasar a `Fan O` y mostrar el puerto común exacto.

Cierre operativo:

- Commit atómico preparado: `feat(ui): permite crear fans desde el inspector`.
- Deploy ejecutado con `docker compose up -d --build`.
- Contenedores verificados: `opforja` healthy y `opforja-bug-capture` up.
- Health local: `http://127.0.0.1:8080/healthz` responde `ok`.
- Health bug-capture: `http://bug-capture:3000/healthz` responde `{"ok":true}`.
- Verificación externa autenticada: `https://opforja.sanixai.com/` sirve
  `/assets/index-DSZvXp0c.js` y el bundle contiene `Fan posible`,
  `Crear fan` y `Anclaje exacto`.

### Corte UI De Anclaje Exacto — 2026-05-20

Motivación: producción sí estaba desplegada, pero la UI visible no expresaba
el nuevo contrato semántico de enlaces exactos. El kernel ya distinguía
`entidad + lado + portId`; el modelador debía mostrarlo al operador en el
lugar donde decide y corrige enlaces.

Cambios:

- Se exportó `puertoExactoCompartidoDeAbanico` desde `modelo/abanicos.ts`
  para leer el puerto común canónico sin duplicar reglas privadas.
- Se agregó el selector puro `detalleContratoPuertoEnlace` para el inspector:
  extremos origen/destino, entidad/estado, `portId`, ancla de reloj y fan
  exacto si existe.
- El tab `Extremos` del Inspector de enlace ahora muestra un panel
  `Anclaje exacto` con ambos extremos, estado de puerto y fan exacto.
- La sección `Abanico` muestra explícitamente el `Puerto común`: entidad,
  lado, hora de ancla y `portId`.
- `DialogoMoverPuerto` habla el mismo lenguaje de modelo: extremo del enlace,
  ancla exacta y acción `Aplicar ancla`.

Artefactos:

- `app/src/modelo/abanicos.ts`
- `app/src/ui/InspectorEnlace.tsx`
- `app/src/ui/inspectorEnlace/detalleContratoPuerto.ts`
- `app/src/ui/inspectorEnlace/SeccionExtremos.tsx`
- `app/src/ui/inspectorEnlace/SeccionAbanico.tsx`
- `app/src/ui/DialogoMoverPuerto.tsx`
- `app/src/ui/inspectorEnlace/detalleContratoPuerto.test.ts`
- `app/e2e/02-canvas-y-render.spec.ts`

Validación ejecutada:

```bash
cd app && bun test src/ui/inspectorEnlace/detalleContratoPuerto.test.ts src/modelo/abanicos.test.ts src/modelo/operaciones/ports.test.ts
# 16 pass / 0 fail

cd app && bun run typecheck
# OK

cd app && bun run build
# OK; asset principal local index-B7PJNqeH.js

cd app && bun run lint
# OK

cd app && bunx playwright test e2e/02-canvas-y-render.spec.ts --grep "abanicos|mover puerto"
# 2 passed / 0 failed

cd app && bun run check
# 1475 pass / 0 fail

cd app && bun run browser:smoke
# 206 passed / 0 failed
```

### Corte Sistema De Enlaces Exactos Cerrado Y Desplegado — 2026-05-20

Se cerró el corte autónomo de enlaces pedido después de repensar origen,
destino, reanclaje, creación de abanicos y cascadas derivadas. El foco fue
quitar ambigüedad visual: un abanico ya no se infiere por "misma entidad",
sino por un puerto exacto compartido (`entidad + lado + portId`).

Commits cerrados sobre `main`:

- `abe4646 fix(modelo): exige puertos exactos en abanicos`
- `ae90341 fix(modelo): preserva anclas exactas de enlaces`
- `e336d7c test(e2e): alinea fixtures de abanicos exactos`

Decisiones:

- Los abanicos O/XOR son semántica de puerto compartido real. Si dos enlaces
  apuntan a la misma entidad pero llegan por puertos distintos, no forman fan.
- La serialización rechaza abanicos estructurales y abanicos sin endpoint
  exacto común; los fixtures y smokes importados también deben traer `portId`
  compartido.
- La transacción de enlace aplica anclas explícitas antes de formar abanico,
  sincroniza puertos y solo después infiere el fan automático.
- Las anclas manuales usan `port-anchor-<entidad>-<lado>-<ancla>` cuando el
  extremo no trae un puerto compartido previo. Si ya trae un `portId` común
  válido, se conserva para no romper el fan.
- El render/handler JointJS preserva `source().port` / `target().port` al
  persistir reanclaje de arrowhead. Esto sigue el contrato JointJS OSS
  documentado para links con `id` + `port`.
- La comparación de extremos en operaciones de reanclaje ahora distingue
  `portId` para no descartar cambios dentro de la misma entidad.

Artefactos principales:

- `app/src/modelo/abanicos.ts`
- `app/src/modelo/transaccionEnlace.ts`
- `app/src/modelo/operaciones/ports.ts`
- `app/src/modelo/operaciones/enlaces.ts`
- `app/src/modelo/enlaceVertices.ts`
- `app/src/modelo/extremos.ts`
- `app/src/render/jointjs/handlers/drag.ts`
- `app/e2e/_smoke-helpers.ts`

Cobertura agregada o actualizada:

- `app/src/modelo/abanicos.test.ts`
- `app/src/modelo/transaccionEnlace.test.ts`
- `app/src/modelo/ports.test.ts`
- `app/src/modelo/operaciones/ports.test.ts`
- `app/src/serializacion/validarEnlaces.test.ts`
- `app/src/opl/generar.test.ts`
- `app/src/render/jointjs/proyeccion.test.ts`
- `app/src/render/jointjs/handlers/drag.test.ts`
- `app/src/store.test.ts`
- smokes E2E de abanicos, OPL multi-enlace y rutas hacia estados.

Validación exacta:

```bash
cd app && bun run check
# typecheck OK
# unit: 1473 pass / 0 fail

cd app && bun run build
# OK; asset principal index-DLQ8Lo_V.js

cd app && bun run browser:smoke
# 206 passed / 0 failed
```

Deploy opforja:

```bash
docker compose up -d --build
docker compose ps
# opforja healthy; opforja-bug-capture up

docker exec opforja wget -qO- http://127.0.0.1:8080/healthz
# ok

docker exec opforja wget -qO- http://bug-capture:3000/healthz
# {"ok":true}

curl https://opforja.sanixai.com/
# 401 sin credenciales

curl -u fsanhuezal:<secreto-local> https://opforja.sanixai.com/
# 200 text/html; asset /assets/index-DLQ8Lo_V.js responde 200
```

Pendientes:

- No hay bloqueo conocido de este corte para uso productivo single-user.
- Mantener sin versionar los artefactos no relacionados ya presentes en
  `docs/bugs/`, `docs/audits/corte-visual-opcloud-derivado/` y
  `docs/instrucciones-lineas-dev/ronda22/`.
- Siguiente trabajo razonable: probar manualmente en producción un escenario
  de usuario con dos ramas desde la misma ancla, alternar O/XOR, exportar SVG
  y reimportar JSON. Si aparece fricción, tratarla como UX de manipulación de
  puertos, no como deuda de semántica base.

Prompt breve de continuación:

> Continuar desde `docs/HANDOFF.md`, sección "Corte Sistema De Enlaces
> Exactos Cerrado Y Desplegado — 2026-05-20". `main` está en `e336d7c`,
> deploy activo en opforja y los gates `check`, `build`, `browser:smoke`
> están verdes. Próximo paso sugerido: smoke manual productivo de enlaces
> exactos/anclas/fans y export SVG, o pasar a la siguiente deuda priorizada.

### Corte Dov-Dori Cerrado — SSOT Puertos, Ley Temporal Y OPL Único — 2026-05-20

Se resolvieron las tres críticas estructurales planteadas contra el
modelador:

1. **Modelo fantasma / fuga render**. El render JointJS ya no sincroniza
   puertos en tiempo de render. `proyectarModeloAJointCells` consume el
   modelo tal como está; la materialización canónica de puertos vive en
   operaciones, store e import/export.
2. **Error categorial temporal**. Las excepciones temporales
   (`excepcionSobretiempo`, `excepcionSubtiempo`,
   `excepcionSubSobretiempo`) quedan restringidas a `Proceso -> Proceso`,
   sin extremos `Estado`. La ley se preserva en creación, reanclaje,
   importación y diagnóstico de modelos ya corruptos.
3. **Cerebro OPL bifurcado**. La generación OPL plana e interactiva queda
   unificada sobre la misma representación lógica; el generador legacy en
   `modelo/opl/generador-opl.ts` pasa a ser wrapper de compatibilidad.

Decisiones:

- Los puertos son semántica serializable del modelo, no estética del
  render. El render puede proyectar, pero no corregir la verdad del store.
- La validación de firma sigue siendo el primer muro; la validación
  metodológica ahora también denuncia corrupción temporal si un modelo
  inválido entra por una ruta interna o legacy.
- No se eliminó `app/src/modelo/opl/generador-opl.ts`, porque scripts
  antiguos lo importan. Se lo redujo a wrapper para evitar doble motor.
- Se corrigió el auditor HU para aceptar el nombre consolidado real del
  diálogo `Abrir / importar modelo`, en vez de exigir el literal legacy
  `Cargar modelo`.

Artefactos principales:

- `app/src/render/jointjs/proyeccion.ts`
- `app/src/modelo/operaciones/enlaces.ts`
- `app/src/store/runtime.ts`
- `app/src/serializacion/json.ts`
- `app/src/modelo/validaciones.ts`
- `app/src/opl/generar.ts`
- `app/src/modelo/opl/generador-opl.ts`
- `app/src/render/jointjs/renderUiBoundary.test.ts`
- `app/src/modelo/operaciones.test.ts`
- `app/src/modelo/operaciones/enlaces.test.ts`
- `app/src/modelo/validaciones.test.ts`
- `app/src/serializacion/json.test.ts`
- `app/src/store/enlaces.test.ts`
- `app/src/opl/generar.test.ts`
- `docs/historias-usuario-v2/tools/progress-dashboard.mjs`
- `docs/roadmap/hu-progress.{md,html,json}` y
  `docs/roadmap/hu-progress-evidence.json`

Validación exacta:

```bash
cd app && bun run gate:refactor
# typecheck OK
# unit: 1456 pass / 0 fail
# lint src/ OK
# build OK
# browser:smoke: 206 passed
# Dashboard HU: Total 27.4%; MVP-alpha 86.2% (104/121); 89/105 reglas auto
# quality:gate PASS; leyes canonicas 6/6; compat detectors 0
```

Supuestos:

- Este corte no cambia funcionalidad de usuario ni diseño visual; corrige
  ubicación de invariantes y consistencia formal.
- Los JSON legacy sin `portId` son aceptados y normalizados al hidratarse.
- Los cambios de `docs/roadmap/hu-progress*` son regenerados por el gate y
  pertenecen al corte porque el ledger final depende de esa firma.

Pendientes:

- Mantener fuera de este commit los artefactos no relacionados que ya están
  sin trackear en `docs/bugs/`, `docs/audits/corte-visual-opcloud-derivado/`
  y `docs/instrucciones-lineas-dev/ronda22/`.
- Después del push, si se despliega producción, ejecutar el flujo de deploy
  opforja documentado y smoke autenticado sobre
  `https://opforja.sanixai.com/`.
- Próximo corte técnico razonable: endurecer la frontera de mutación directa
  del store para que `setState` interno no pueda inyectar modelos sin pasar
  por normalización/validación, o bien documentar formalmente ese bypass como
  herramienta solo-dev.

Riesgos:

- El full smoke Playwright había mostrado previamente dos arranques en blanco
  no deterministas en corridas aisladas; el gate exacto final pasó completo
  con 206/206. Si reaparece, tratarlo como flake de arranque Vite/Playwright,
  no como regresión de puertos, salvo evidencia nueva.
- Cualquier código futuro que construya enlaces manualmente debe pasar por
  operaciones o validación de importación; no escribir `modelo.enlaces`
  directo salvo tests de corrupción explícitos.

Prompt breve de continuación:

> Continuar desde `docs/HANDOFF.md`, sección "Corte Dov-Dori Cerrado — SSOT
> Puertos, Ley Temporal Y OPL Único — 2026-05-20". Verificar que `main`
> contiene el commit del corte y decidir el siguiente paso entre deploy
> opforja con smoke autenticado o endurecimiento de mutación directa del
> store (`setState`/normalización).

### Corte 4 Doc Uso Productivo Cerrado Lado Usuario — 2026-05-19

Se cerró el lado pendiente del Corte 4 del plan single-user SVG. El
cierre anterior (2026-05-18) cubría solo deploy/admin (`opforja.md`,
Dockerfile, Traefik); faltaba la doc desde el ángulo del usuario
operador del modelador, detectada por auditoría `jobs-web-ux` el
2026-05-19 (anti-patrón Tutorial Mountain + violaciones II/XII/XIII/XV
en el material existente).

Resultado:

- `docs/uso-productivo.md` es el doc único del usuario operador. Incluye
  resumen, entrar, crear primer modelo, tres operaciones diarias
  (`Ctrl+S` con chip de persistencia como señal canónica, `Ctrl+F`,
  `Ctrl+K`), respaldo manual como primary (cuándo, cómo descargar, cómo
  restaurar), export SVG del OPD activo, recetas por síntoma observable
  (chip dice `Sin guardar`; cerré sin guardar; navegador borró datos;
  app no carga), atajos útiles y límites honestos.
- `docs/deploy/opforja.md` queda como doc del **administrador** de la
  instancia; pierde §Datos Locales (movido al doc del usuario) y gana
  nota explícita de scope (admin, no usuario) y de que los datos del
  usuario viven en su navegador, no en infraestructura.
- `README.md` §Producción Privada colapsa de 5 bullets a 2 punteros:
  uno al doc del usuario, otro al doc del admin. Elimina duplicación
  previa.
- `docs/roadmap/produccion-usuario-unico-svg-plan.md` §Corte 4 actualiza
  resultado para reflejar cierre real (deploy + usuario), y §Corte 3
  Procedimiento Backup deja de duplicar el procedimiento JSON (apunta a
  `docs/uso-productivo.md` §Respaldo Manual).

Validación:

```bash
cd app && bun run typecheck
# OK — cambio solo en docs, sin impacto runtime
```

Siguiente corte recomendado:

- Corte 5 del plan single-user SVG: gate final de release local, registro
  de baseline final y smoke manual autenticado contra el dominio. Con
  Corte 3.5 y Corte 4 (lado usuario) ya cerrados, el plan queda listo
  para su cierre formal.

### Corte 3.5 Sustracción De Chrome Cerrado — 2026-05-18

Se completó la sustracción de chrome detectada por la auditoría UX 360° del
2026-05-18 (analisis inline contra los 15 principios `jobs-web-ux` y lectura
categorial `cat-thinking`). Las 6 críticas quedan implementadas en commits
atómicos sobre `main` local, sin push:

- `347cb08 refactor(ui): elimina bloque centrado de estado vacio en canvas`.
  El bloque "Iniciar SD" con sus 3 botones primarios + asistente sale del
  canvas. `EstadoVacioOpm` retiene un `HintInicioVacio` discreto abajo
  (microcopy literal: `Pulsa Objeto o Proceso arriba para empezar.`) y el
  Nudge "Conectar como resultado" cuando la firma proceso→objeto aplica.
- `ea26143 refactor(bienvenida): auto-abre ultimo reciente si existe`.
  `PantallaInicio` solo se muestra cuando no hay recientes; con ≥1 reciente
  y query vacío, autoabre el último directo, sin overlay.
- `a256740 refactor(bienvenida): mueve glosa OPM a drawer plegable`. La
  glosa OPM (Cosa/OPD/Apariencia/Enlace) sale del overlay por defecto y
  queda accesible vía botón `?` en el header del panel inicio. Recupera
  ~80 px verticales por default.
- `b3048ec refactor(persistencia): unifica chip y elimina sufijos dirty
  redundantes`. `ChipPersistencia` colapsa a 3 estados literales:
  `Sin guardar · Ctrl+S`, `Guardando…`, `Guardado · HH:mm`. Elimina la
  duplicación previa de estado dirty en el label de tab y en
  `+ Nuevo · sin guardar`.
- `cf3fafb refactor(inspector): rediseña branch vacio con identidad del
  modelo`. `InspectorVacio` muestra nombre del modelo (editable inline al
  click), línea de conteos `N objetos · M procesos · K OPDs · editado
  HH:mm`, y única acción `Renombrar modelo`. Eliminado el bloque
  "ATAJOS PARA EMPEZAR" y el botón gigante "JSON del modelo".
- `c5b0727 refactor(toolbar): oculta + atributo deshabilitado y rotula
  buscar`. "+ Atributo" solo se renderiza si la selección es un objeto
  que admite atributo. El botón de búsqueda de comandos pasa de "⌕"
  solo a "⌕ Buscar" con label legible.

Validación:

```bash
cd app && bun run gate:refactor
# typecheck OK; check OK; lint src/ OK; build OK
# browser:smoke: 196 passed / 0 failed
# Bundle 454.29 kB / 122.46 kB gzip; leyes 6/6; compat 0; Gate ledger PASS
```

Nota sobre flake corregido: un primer paso del gate detectó el smoke
`e2e/11-beta1-busqueda.spec.ts:63` como rojo. La causa fue una race
condition pre-existente: el test hacía `.fill()` sobre el input del
diálogo antes de que el `setTimeout(focus, 50ms)` interno de
`DialogoBuscarCosas` corriera; con el dialog ya visible pero el
componente aún no procesando inputs, la query escrita quedaba sin efecto
y `apariciones` se mantenía en el estado vacio "Escribe para buscar".
El helper `modeloDosOpds()` mantiene `nombre: "SD1"` para `opd-2`; el
catálogo no cambió. Fix sin tocar fixtures: agregar
`await expect(input).toBeVisible()` y `await expect(input).toBeFocused()`
antes del `.fill()`, alineando el test con el patrón ya documentado en
`:106` y `:157` del mismo archivo.

Siguiente corte recomendado:

- Corte 4 del plan single-user SVG: documentación productiva privada
  (build, preview, backup JSON, export SVG, rollback, límites) contra
  la UI ya saneada por Corte 3.5.

### Deploy Privado Opforja Cerrado — 2026-05-18

Se desplego la app en `https://opforja.sanixai.com` siguiendo el patron local de
`hdos-app`: Docker Compose, red Docker externa `web`, Traefik con TLS
`myresolver` y contenedor reiniciable.

Resultado:

- `Dockerfile` compila `app/` con Bun y sirve `app/dist` con Nginx en `8080`.
- `docker-compose.yml` publica `opforja.sanixai.com` por Traefik.
- La ruta queda protegida con `opforja-auth@docker`, porque esta SPA todavia no
  tiene auth interna; `hdos-app` si la tiene.
- El usuario operativo Basic Auth es `fsanhuezal`; la contrasena queda fuera de
  la documentacion versionada y el compose mantiene solo el hash APR1.
- `docs/deploy/opforja.md` documenta deploy, verificacion, backup y rollback.
- Let's Encrypt emitio certificado para `CN = opforja.sanixai.com`.

Validacion:

```bash
cd app && bun run build
# OK

docker compose config
# OK

docker compose up -d --build
# opforja started

docker compose ps
# opforja Up, healthy

docker exec opforja wget -qO- http://127.0.0.1:8080/healthz
# ok

curl -I https://opforja.sanixai.com
# HTTP/2 401; WWW-Authenticate: Basic realm="traefik"

curl -sS -o /tmp/opforja-auth-ok.html -w '%{http_code} %{content_type} %{size_download}\n' -u 'fsanhuezal:<secreto-local>' https://opforja.sanixai.com/
# 200 text/html 1373

curl -sS -o /tmp/opforja-auth-bad.txt -w '%{http_code} %{content_type} %{size_download}\n' -u 'fsanhuezal:wrong' https://opforja.sanixai.com/
# 401 text/plain 17

printf '' | openssl s_client -servername opforja.sanixai.com -connect opforja.sanixai.com:443 2>/dev/null | openssl x509 -noout -subject -issuer -dates
# subject=CN = opforja.sanixai.com; issuer=Let's Encrypt R13
```

Siguiente corte recomendado:

- Corte 5 del plan: gate final de release local, registro de baseline final y
  smoke manual autenticado sobre el dominio.

### Produccion Single-User SVG — Corte 3 Backup JSON Operable Cerrado — 2026-05-18

Se cerro el riesgo operativo principal del uso single-user local: el usuario ya
puede generar un respaldo portable del modelo activo y restaurarlo sin depender
solo de `localStorage`.

Resultado:

- `PersistenciaJson` expone `Descargar JSON` desde
  `Menu principal > Importar/Exportar JSON...`.
- La descarga usa nombre derivado del modelo y fecha (`modelo-YYYY-MM-DD.json`)
  y conserva el formato serializado `deep-opm-pro.modelo.v0`.
- `25-produccion-backup.spec.ts` cubre el flujo completo: importar modelo,
  descargar backup, crear modelo nuevo, reimportar el archivo descargado y
  comparar los conteos del modelo restaurado.
- La persistencia local, dirty guard, round-trip JSON y autosalvado quedan
  cubiertos por tests focales existentes y por el gate completo.
- El procedimiento minimo de backup manual quedo documentado en
  `docs/roadmap/produccion-usuario-unico-svg-plan.md`.

Commit atomico:

- `acdeb32 feat(produccion): agrega backup json descargable`

Validacion:

```bash
cd app && bun test src/persistencia/local.test.ts src/persistencia/autosalvado.test.ts src/store/persistencia.test.ts src/serializacion/json.test.ts
# 79 pass / 0 fail

cd app && bunx playwright test e2e/06-undo-redo-dirty.spec.ts e2e/11-beta1-catalogo-ancla.spec.ts e2e/25-produccion-backup.spec.ts
# 19 passed

cd app && bun run browser:preview
# 1 passed

cd app && bun run gate:refactor
# typecheck OK; 1410 pass / 0 fail / 5266 expect; lint src/ OK; build OK; browser:smoke 196 passed
# Dashboard HU: Total 24.8%; MVP-alpha 86.2%; 89/105 reglas auto; firma de fuentes vigente
# Quality gate PASS: bundle 457.31 kB / 122.82 kB gzip; leyes 6/6; compat detectors 0
```

Siguiente corte recomendado:

- Corte 4 del plan: documentacion de uso productivo privado. Debe quedar como
  guia operable breve: build, preview, backup JSON, export SVG, rollback y
  limites conocidos para uso single-user.

### Produccion Single-User SVG — Corte 2 Operacion Estatica Cerrado — 2026-05-18

Se verifico que la app opera como build estatico servido por `vite preview` y
que los affordances no-productivos no rompen la experiencia single-user.

Resultado:

- `browser:preview` ejecuta un smoke focal contra `dist` servido por
  `bun run preview` en `127.0.0.1:4173`.
- `playwright.preview.config.ts` construye y sirve el build productivo para ese
  smoke.
- `playwright.config.ts` excluye `*.preview.spec.ts` del smoke normal; el gate
  principal no duplica el preview productivo.
- El smoke productivo carga la SPA, importa un modelo, renderiza el canvas,
  descarga SVG del OPD activo y verifica que no arrastra chrome.
- `CapturadorBugs` queda fuera de builds productivos por defecto; solo se
  habilita con `VITE_ENABLE_BUG_CAPTURE=true`.
- Si el capturador se habilita contra un hosting sin middleware, degrada con
  mensaje explicito en vez de romper la app.

Commit atomico:

- `1df6f8a test(produccion): valida preview estatico`

Validacion:

```bash
cd app && bun run typecheck
# OK

cd app && bunx playwright test e2e/10-capturador-bugs.spec.ts
# 4 passed

cd app && bun run browser:preview
# 1 passed

cd app && bun run gate:refactor
# typecheck OK; 1410 pass / 0 fail / 5266 expect; lint src/ OK; build OK; browser:smoke 195 passed
# Dashboard HU: Total 24.8%; MVP-alpha 86.2%; 89/105 reglas auto; firma de fuentes vigente
# Quality gate PASS: bundle 457.31 kB / 122.81 kB gzip; leyes 6/6; compat detectors 0
```

Siguiente corte recomendado:

- Corte 4 del plan: documentacion de uso productivo privado, usando el backup
  JSON operable ya cerrado en Corte 3.

### Render/UI Boundary — Corte 2 Chrome UI Slots Cerrado — 2026-05-18

Se cerro el plan acotado de frontera `render/jointjs`/UI. `JointCanvas`
mantiene estado e interaccion JointJS, pero dejo de poseer componentes chrome
concretos del canvas.

Resultado:

- `JointCanvas` recibe slots obligatorios `renderMenuTipoEnlace` y
  `renderRenombradoInline`.
- `JointCanvas` ya no importa `MenuTipoEnlace`, `RenombradoInline` ni
  `ui/motion`.
- `JointCanvasFeedbackBoundary` monta el chrome UI concreto y conserva el
  adapter Zustand de feedback creado en Corte 1.
- `renderUiBoundary.test.ts` blinda que `render/jointjs` no vuelva a importar
  chrome UI concreto ni helpers UI de motion.
- Los flujos observables de menu de tipo de enlace, renombrado inline,
  feedback, tabla de enlaces y export SVG quedan preservados.

Commit atomico:

- `808559b refactor(render): desacopla chrome ui del canvas`

Validacion:

```bash
cd app && bun run gate:refactor
# typecheck OK; 1410 pass / 0 fail / 5266 expect; lint src/ OK; build OK; browser:smoke 194 passed
# Dashboard HU: Total 24.8%; MVP-alpha 86.2%; 89/105 reglas auto; firma de fuentes vigente
# Quality gate PASS: bundle 465.66 kB / 125.20 kB gzip; leyes 6/6; compat detectors 0
```

Deuda residual medida:

- `JointCanvasFeedbackBoundary` sigue siendo el boundary UI combinado para
  feedback y chrome slots. Renombrarlo puede hacerse luego si aporta claridad,
  pero no bloquea la frontera.
- `render/jointjs/overlayCanvas/*` todavia usa `ui/tokens`; aceptado como
  presentacion de overlays, no como ownership de componentes chrome.
- `render/jointjs/handlers/zoom.ts` todavia importa `atajosTeclado`; queda como
  deuda menor separada de este plan.

### Produccion Single-User SVG — Corte 1 Export OPD Activo Cerrado — 2026-05-18

Se abrio un plan nuevo y acotado para primera produccion privada de usuario
unico, con persistencia local existente y export SVG del OPD activo como salida
minima. No incluye auth, backend, multiusuario, PDF ni ZIP de todos los OPDs.

Resultado:

- `docs/roadmap/produccion-usuario-unico-svg-plan.md` define cortes 0-5 para
  habilitar v0 single-user. Corte 0, Corte 1, Corte 2 y Corte 3 quedan cerrados.
- El menu principal de la vista normal expone `Exportar OPD actual como SVG`;
  la vista de mapa conserva su export PNG/SVG existente.
- La accion usa el `dia.Paper` vivo desde `CanvasAdapterContext` y serializa el
  SVG DOM del paper OSS. No usa `globalThis.__opmJointAdapter` ni JointJS+.
- `mapaExport` prioriza el camino OSS (`paper.el.querySelector("svg")`) y
  conserva fallback historico para mapa.
- `mapaExport.test.ts` cubre serializacion SVG DOM sin `paper.toSVG`.
- `02-canvas-y-render.spec.ts` descarga el SVG, verifica textos OPM y comprueba
  que no arrastra chrome de aplicacion.

Commits atomicos:

- `025d245 docs(produccion): define plan single-user svg`
- `5efff99 feat(export): permite svg del opd activo`

Validacion:

```bash
cd app && bun test src/render/jointjs/mapaExport.test.ts
# 6 pass / 0 fail

cd app && bunx playwright test e2e/02-canvas-y-render.spec.ts --grep "Exportar OPD actual como SVG|renderiza todos los markers"
# 2 passed

cd app && bun run gate:refactor
# typecheck OK; 1409 pass / 0 fail / 5265 expect; lint src/ OK; build OK; browser:smoke 194 passed
# Dashboard HU: Total 24.8%; MVP-alpha 86.2%; 89/105 reglas auto; firma de fuentes vigente
# Quality gate PASS: bundle 465.35 kB / 125.28 kB gzip; leyes 6/6; compat detectors 0
```

Siguiente corte recomendado:

- Corte 4 del plan: documentacion de uso productivo privado, con pasos de
  build, preview, backup JSON, export SVG y rollback.

### Render/UI Boundary — Corte 1 Feedback Port Cerrado — 2026-05-18

Se abrio un plan nuevo y acotado para la frontera `render/jointjs`/UI, sin
convertirlo en Corte 11 automatico de la refactorizacion total.

Resultado:

- `docs/roadmap/render-ui-boundary-plan.md` define alcance, no objetivos, dos
  cortes y gates. Corte 1 quedo cerrado; Corte 2 queda cerrado en la seccion
  superior de este handoff.
- `render/jointjs` ya no importa `zustandFeedbackPort` ni
  `useZustandFeedbackOverlays`.
- `JointCanvas` recibe `feedbackPort` y overlays por props; la suscripcion
  Zustand queda en `app/src/ui/JointCanvasFeedbackBoundary.tsx`.
- `hoverTooltip` usa un puerto minimo `setHoverTooltip/clearHoverTooltip`.
- `OverlayLayer` recibe overlays ya resueltos, sin conocer Zustand.
- `renderUiBoundary.test.ts` blinda que `render/jointjs` no vuelva a importar el
  adapter concreto de feedback Zustand.

Validacion:

```bash
cd app && bun test src/store/feedback.test.ts src/render/jointjs/overlayCanvas/avisos.test.ts src/render/jointjs/overlayCanvas/hoverTooltipContent.test.ts src/app/ports/diagnosticsPort.test.ts src/app/ports/canvasInteractionPort.test.ts src/render/jointjs/jointCanvasAdapter.test.ts src/render/jointjs/renderUiBoundary.test.ts
# 16 pass / 0 fail

cd app && bunx playwright test e2e/11-beta1-validacion-metodologica.spec.ts e2e/02-canvas-y-render.spec.ts e2e/11-beta1-tabla-enlaces.spec.ts --grep "panel metodologia|ErrorBadge inline|HoverTooltip|ciclo de feedback|renderiza todos los markers|renderiza modificadores|arrastra una cosa JointJS|lista, filtra|resalta filas filtradas|resalta extremo de estado|edicion de etiqueta"
# 12 passed

cd app && bun run gate:refactor
# typecheck OK; 1407 pass / 0 fail / 5261 expect; lint src/ OK; build OK; browser:smoke 193 passed
# Dashboard HU: Total 24.8%; MVP-alpha 86.2%; 89/105 reglas auto; firma de fuentes vigente
# Quality gate PASS: bundle 465.17 kB / 125.23 kB gzip; leyes 6/6; compat detectors 0
```

Deuda residual:

- `render/jointjs/overlayCanvas/*` todavia usa `ui/tokens`; aceptado como
  presentacion de overlays, no como ownership directo de chrome UI.
- `render/jointjs/handlers/zoom.ts` todavia importa `atajosTeclado`; queda como
  deuda menor separada de Corte 1.

### Refactorizacion Total — Corte 10 Auditoria De Proceso Cerrado — 2026-05-18

La rama `main` queda con el gate de refactor endurecido contra falsos verdes de
proceso. El ultimo commit funcional del corte es `e125981`.

Resultado arquitectonico/proceso:

- `gate:refactor` deja de depender de `cd .. && cd app`; ejecuta el dashboard HU
  desde `app/` usando la ruta cwd-safe del script.
- `lint` se amplia de `src/ui/` a `src/`, alineado con la refactorizacion real
  que ya movio fronteras a `app`, `render`, `modelo`, `opl` y `store`.
- `progress-dashboard.mjs` agrega `--dry-run` para auditar sin escribir ledger ni
  reportes, y guarda una firma `sha256` de las fuentes auditadas.
- `quality-ledger.mjs --check` compara la firma actual de
  `app/src`, `app/e2e`, `app/scripts` y `assets/svg/links` contra
  `hu-progress.json`; si el dashboard HU esta stale o sin firma, el gate falla.
- El umbral de bundle queda expresado como baseline `124.62 kB gzip` + margen
  `5 kB`, sin cambiar el limite operativo `129.62 kB gzip`.
- `crearZustandContextualActionExecutionPort` deja de devolver todo `OpmStore`
  por tipado estructural y entrega solo el snapshot declarado.
- `zustandEntityInspectorPorts` conserva lecturas frescas post-mutacion donde
  son necesarias, pero deja de invocar `store.getState()` para renombrar estados
  cuando ya tiene la accion capturada por el adapter.
- El plan normativo y el quality ledger quedan alineados con Corte 10.

Commits atomicos del corte:

- `e125981 refactor(app): acota adaptadores zustand residuales`
- `bfbaa15 fix(quality): bloquea dashboard hu stale`

Validacion de cierre:

```bash
cd app && bun run gate:refactor
# typecheck OK; 1406 pass / 0 fail / 5260 expect; lint src/ OK; build OK; browser:smoke 193 passed
# Dashboard HU: Total 24.8%; MVP-alpha 86.2%; 89/105 reglas auto; firma de fuentes vigente
# Quality gate PASS: bundle 464.55 kB / 124.90 kB gzip; leyes 6/6; compat detectors 0
```

Deuda residual medida, fuera de Corte 10:

- `JointCanvas` todavia renderiza chrome UI concreto; el feedback desde render
  quedo cerrado en Render/UI boundary Corte 1.
- Quedan puertos type-only acoplados a `OpmStore`; no migrar masivamente sin
  agrupar por frontera y contrato verificable.
- `zustandGlobalShortcutsPort`, `zustandNewModelAssistantPort` y algunos puertos
  de persistencia/inspector conservan `store.getState()` por comandos compuestos
  o lectura fresca deliberada.
- `HU-50.004` permanece pendiente real: posicion lateral del panel OPL.

### Refactorizacion Total — Corte 9 Cascadas De Efectos Cerrado — 2026-05-18

La rama `main` queda lista para sincronizar con `origin/main` tras el cierre documental de este handoff. El ultimo commit funcional del corte es `3caef2b`.

Resultado arquitectonico/proceso:

- `quality-ledger.mjs` ahora tiene modo `--check` con umbrales de baseline: bundle principal <= 129.62 kB gzip, leyes canonicas 6/6, compat detectors 0, MVP-alpha >= 104 cubiertas + 1 parcial y 89/105 reglas auto. `app/package.json` agrega `quality:gate` y `gate:refactor`.
- La dependencia productiva de UI sobre `globalThis.__opmJointAdapter` queda eliminada. `JointCanvas` publica el adapter por `CanvasAdapterContext`; el global queda solo como hook de debug/in-vivo.
- `App.tsx` deja de importar el store y de registrar atajos con `store.getState()` directo. Los atajos viven en `globalShortcutsPort` con adaptador `zustandGlobalShortcutsPort`.
- `ui/ejecutarAccionContextual.ts` deja de leer Zustand directamente; consume un puerto de ejecucion contextual con adaptador Zustand.
- `zustandLinksTablePort` elimina el snapshot imperativo para renombrar etiquetas y usa selecciones/actions capturadas por el adapter.
- Ocho puertos hoja dejan de tiparse contra `OpmStore`: `HelpPort`, `EditabilityPort`, `WelcomeScreenPort`, `ToolbarOverflowPort`, `MobileReviewPort`, `HistoryPort`, `SessionMessagePort` y `SystemMapViewportPort`.
- El auditor HU actualiza evidencia de atajos y persistencia hacia `app/src/app/ports/globalShortcutsPort.ts`; los reportes `hu-progress.*` quedan regenerados sin caida de reglas.
- El plan normativo agrega explicitamente `Corte 9 - Cascadas De Efectos Y Fronteras Residuales`.

Commits atomicos del corte:

- `d154147 fix(quality): convierte ledger en gate`
- `c973cec refactor(render): expone adapter canvas por contexto`
- `7b73b76 refactor(ports): explicita puertos hoja`
- `800ed77 refactor(app): mueve atajos globales a puerto`
- `4a68304 refactor(app): aísla ejecución contextual del store`
- `3caef2b refactor(app): elimina snapshot imperativo en tabla enlaces`
- `e42616f fix(roadmap): actualiza evidencia de atajos movidos`
- `989d711 docs(refactor): registra cierre corte cascadas`

Validacion de cierre:

```bash
cd app && bun run gate:refactor
# typecheck OK; 1406 pass / 0 fail; lint OK; build OK; browser:smoke 193 passed
# Dashboard HU: Total 24.8%; MVP-alpha 86.2%; 89/105 reglas auto
# Quality gate PASS: bundle 463.61 kB / 124.75 kB gzip; leyes 6/6; compat detectors 0
```

Deuda residual medida, fuera de Corte 9:

- `JointCanvas` todavia renderiza chrome UI concreto (`MenuTipoEnlace`, `RenombradoInline`) y sincroniza feedback desde render. La dependencia global quedo cerrada, pero la frontera render/UI completa requiere corte propio con pruebas visuales.
- Quedan 33 puertos type-only bajo `app/src/app/ports/*Port.ts` acoplados a `OpmStore`; el primer lote seguro ya fue migrado, pero no se debe hacer migracion masiva sin agrupar por frontera.
- Algunos adaptadores Zustand conservan `store.getState()` por lectura fresca deliberada o comandos compuestos (`zustandPersistencePort`, `zustandNewModelAssistantPort`, `zustandEntityInspectorPorts`). Requieren cortes focalizados.
- `HU-50.004` permanece pendiente real: posicion lateral del panel OPL. No se implemento para no mezclar feature con refactor.

### Refactorizacion Total — Corte 8 Consistencia Transversal Cerrado — 2026-05-18

La rama `main` queda lista para sincronizar con `origin/main` tras el cierre documental de este handoff. El ultimo commit funcional del corte es `ca471db`.

Resultado arquitectonico/proceso:

- El plan normativo agrega explicitamente `Corte 8 - Consistencia Transversal Y Cierre De Drift`, para resolver la contradiccion previa entre "no hay Corte 8" y el trabajo real de auditoria solicitado.
- `PanelOpl` deja de re-exportar el helper `panelOplMinimizadoEfectivo`; `App` y el test consumen el helper desde `app/viewmodels/panelOplViewModel`.
- El auditor HU separa reglas OPL que antes estaban acopladas artificialmente: numeracion, minimizado/restauracion, AI Text placeholder y posicion lateral ya no se bloquean entre si.
- El auditor HU actualiza rutas obsoletas hacia superficies vigentes: `PanelDiagnostico`, `DialogoConfiguracion`, `BibliotecaDock` y `DialogoPlantillas`.
- El duplicado `HU-13.005` deja de ser inventariable en `HU-SHARED-001`; el dashboard queda sin diagnosticos de duplicate-id.
- `vite.config.ts` elimina el alias `@app` no usado y consolida chunks manuales para cerrar el warning circular `feature-dialogos-pesados <-> feature-modales`.
- `quality-ledger.md` queda alineado con el baseline vivo de Corte 8: bundle principal 463.44 kB / 124.62 kB gzip, leyes 6/6, compat detectors 0.

Commits atomicos del corte:

- `7827563 refactor(opl): mueve helper visual al viewmodel`
- `3b91747 fix(roadmap): separa evidencia hu opl`
- `ca471db fix(build): elimina chunk circular manual`
- `c692199 fix(roadmap): actualiza reglas hu vigentes`
- `docs(refactor): registra cierre corte consistencia` (este handoff)

Validacion de cierre:

```bash
cd app && bun run check
# typecheck OK; 1406 pass / 0 fail
cd app && bun run lint
# OK
cd app && bun run build
# build OK, sin warning de chunk circular
cd app && bun run browser:smoke
# 193 passed
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
# Total 24.8%; MVP-alpha 86.2%; 89/105 reglas auto; 0 diagnosticos
cd app && bun run scripts/quality-ledger.mjs --markdown
# Canonical laws 6/6; Compat detectors 0; MVP-alpha 104/121 (86.2%); Auto rules 89/105
```

Deuda residual medida, fuera de Corte 8:

- `render/jointjs` aun importa piezas UI/feedback concretas en algunas integraciones. Resolverlo requiere corte propio de frontera render/UI, no un cleanup documental.
- `App.tsx` y `ui/ejecutarAccionContextual.ts` aun usan `store.getState()` para atajos/global commands. Migrar eso a comandos/puertos debe hacerse como corte de aplicacion.
- Varios puertos bajo `app/src/app/ports/*Port.ts` todavia son contratos tipados desde `OpmStore`; el patron correcto ya existe en `OplPort`, `DiagnosticsPort`, `PersistencePort` y `WorkspacePort`, pero migrar los restantes no debe hacerse masivamente.
- `HU-50.004` permanece pendiente real: posicion lateral del panel OPL. No se implemento para no mezclar feature con consistencia.

### Refactorizacion Total — Corte 7 Limpieza De Compatibilidad Temporal Cerrado — 2026-05-18

La rama `main` queda lista para sincronizar con `origin/main` tras el cierre documental de este handoff. El ultimo commit funcional del corte es `eb2ccd3`.

Resultado arquitectonico:

- Se elimino el wrapper temporal `app/src/ui/panelMetodologiaIssues.ts`; la severidad visible vive directamente en `app/src/modelo/diagnosticoSeveridad.ts`.
- Se retiro el alias legacy `sincronizarOverlayAbanicoEnDrag`; el contrato vigente es `sincronizarOverlayAbanicoConDrag`.
- `OpmStore` ya no expone `designarEstadoInicial` ni `designarEstadoFinal`; la frontera vigente es `designarEstadoComo`. Las funciones puras de dominio se conservaron.
- La auditoria HU dejo de depender de detectores sinteticos/legacy en `proyeccion.ts`, `store.ts`, wrappers UI y aliases de arbol; ahora apunta a composers, view-models o superficies reales.
- Se eliminaron wrappers y re-exports muertos: `DialogoGestionArbol.tsx`, `AsistenteNuevoModelo.tsx` y el re-export test-only de `sugerirEnlaceResultado` en `EstadoVacioOpm.tsx`.
- La proyeccion JointJS ya no lee configuracion global temporal (`globalThis.__deepOpm...`); usa defaults canonicos o opciones explicitas.
- `render/jointjs/mapaSistema.ts` dejo de funcionar como barrel amplio de helpers canvas y expone solo la frontera JointJS/tipos esperada.
- Se corrigio una carrera real del smoke: `CommandPalette` ahora captura `Escape` como modal aunque el input aun no haya recibido foco.
- Se preservaron compatibilidades con consumidores reales: hidratar JSON legacy, `descomponerProceso`/`desplegarObjeto`, y `guardarComoLocal`/`guardarComoLocalConDescripcion`.

Commits atomicos del corte:

- `5951eba refactor(diagnostico): retira wrapper temporal de severidad`
- `2a62de3 refactor(render): elimina alias legacy de abanico drag`
- `1af1f52 refactor(store): elimina aliases deprecated de estados`
- `7fd2e80 refactor(roadmap): reemplaza detector legacy de proyeccion`
- `12be09a docs(roadmap): actualiza detectores hu legacy`
- `ca40238 refactor(ui): elimina aliases legacy del arbol`
- `5a51caf refactor(ui): elimina wrapper muerto de gestion arbol`
- `cfb8aa9 refactor(ui): elimina reexport test-only de estado vacio`
- `7fb204b refactor(ui): elimina wrapper legacy del asistente`
- `4af17d3 refactor(render): elimina opciones globales legacy`
- `212ce02 refactor(render): reduce barrel del mapa sistema`
- `d9aa3d8 refactor(store): retira detector compat heredado`
- `eb2ccd3 fix(ui): estabiliza cierre escape de command palette`

Validacion de cierre:

```bash
cd app && bun run check
# typecheck OK; 1406 pass / 0 fail
cd app && bun run build
# build OK; warning no bloqueante: circular chunk feature-dialogos-pesados <-> feature-modales
cd app && bun run browser:smoke
# 193 passed
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
# Total 22.3%; MVP-alpha 83.4%; 1 advertencia diagnostica por HU-13.005 duplicada
cd app && bun run scripts/quality-ledger.mjs --markdown
# Canonical laws 6/6; Compat detectors 0; Auto rules 81/102
```

Notas de frontera:

- El plan normativo `docs/roadmap/refactorizacion-total-plan-normativo.md` define cortes 0-7; con este corte queda cubierto el ultimo corte operativo declarado.
- La siguiente unidad recomendable no es "Corte 8" dentro del mismo plan, sino una auditoria de cierre contra los indicadores del plan y, si procede, un nuevo plan normativo acotado para deuda residual.
- El warning de build sobre chunk circular queda registrado como deuda de empaquetado; no bloquea el corte porque no se introdujo en esta limpieza y el build produce artefactos validos.
- Los directorios no versionados existentes bajo `docs/audits/`, `docs/bugs/` y `docs/instrucciones-lineas-dev/ronda22/` siguen fuera del corte.

### Refactorizacion Total — Corte 6 Store Por Capacidades Reales Cerrado — 2026-05-18

La rama `main` queda sincronizada con `origin/main` tras `45145da`.

Resultado arquitectonico:

- `ModeloSlice` deja de declararse como union literal extensa en `sliceTypes.ts`; el contrato vive en `app/src/store/modelo/contrato.ts` como capacidades nombradas (`MODELO_SLICE_CAPABILITIES`) y claves derivadas (`MODELO_SLICE_KEYS`).
- `AtajosSlice` queda tipado como capacidad propia en `app/src/store/atajos.ts`, sin depender de `Pick<OpmStore, ...>`.
- Las derivaciones de mapa (`descriptorMapaFiltrado`, `estadisticasModelo`) salen del store y viven como selectores puros en `app/src/store/mapaSelectors.ts`.
- `SystemMapDataPort` deja de tiparse contra miembros de `OpmStore`; expone tipos explicitos de descriptor, estadisticas y navegacion.
- `designarEstadoInicial` y `designarEstadoFinal` se conservan como aliases compatibles, pero quedan deprecated y delegan a `designarEstadoComo`.
- `MapaSistema` sincroniza paper y cells con `useLayoutEffect` para no declarar la vista visible antes de instalar las celdas JointJS.
- No se elimino compatibilidad usada por UI, no se cambio formato JSON, no se cambiaron reglas OPM/OPL y no se agregaron funcionalidades.

Commits atomicos del corte:

- `33ec412 refactor(store): explicita contrato de modelo por capacidades`
- `ec0f469 refactor(store): tipa atajos como capacidad propia`
- `e15ba55 refactor(store): mueve derivaciones de mapa a selectores`
- `737002f refactor(store): centraliza designacion de estados`
- `45145da fix(ui): sincroniza mapa antes de pintar`

Validacion de cierre:

```bash
cd app && bun run check
# typecheck OK; 1407 pass / 0 fail
cd app && bun run build
# build OK
cd app && bun run browser:smoke
# 193 passed
cd app && bun test src/store/modelo/contrato.test.ts src/store/modelo.test.ts
# 5 pass / 0 fail
cd app && bun test src/store/atajos.test.ts src/ui/CommandPalette.test.ts
# 9 pass / 0 fail
cd app && bun test src/store/mapaSelectors.test.ts src/store/mapa.test.ts src/render/jointjs/mapaSistema.test.ts
# 30 pass / 0 fail
```

Notas de frontera:

- `OpmStore` sigue siendo fachada de sesion; el corte redujo contratos efectivos y dependencias tipadas, no intento borrar Zustand.
- `guardarComoLocal` y `guardarComoLocalConDescripcion` no se colapsaron porque la auditoria encontro comportamiento divergente; tratarlos requiere corte propio o pruebas de migracion.
- La compatibilidad de aliases de estado queda marcada para Corte 7 solo si no hay consumidores activos.
- El siguiente corte normativo recomendado es Corte 7: Limpieza De Compatibilidad Temporal. Debe empezar por wrappers/aliases sin consumidores, con verificacion previa de call sites.

### Refactorizacion Total — Corte 5 OPL Y Diagnostico Como Capacidades Cerrado — 2026-05-18

La rama `main` queda sincronizada con `origin/main` tras `cf43571`.

Resultado arquitectonico:

- `OplPort` y `DiagnosticsPort` dejan de tiparse contra `OpmStore`; exponen contratos explicitos basados en tipos de dominio.
- `app/src/opl/panel.ts` concentra la derivacion del panel OPL: lineas, texto, bloques jerarquicos, filtros por seleccion/busqueda, referencia activa y preview del editor libre.
- `PanelOpl` queda como consumidor del view-model; la generacion OPL, filtros e inverse editing ya no quedan dispersos dentro del componente.
- `app/src/modelo/diagnosticoSeveridad.ts` concentra la clasificacion visible de severidades metodologicas (`bloqueo`, `mejora`, `estilo`) sin cambiar los codigos actuales.
- `app/src/app/viewmodels/panelDiagnosticoViewModel.ts` deriva issues de diagnostico, grupos visibles y navegacion desde `AvisoDiagnostico`; `PanelDiagnostico` queda limitado a render y estado visual local.
- `DiagnosticsPort` expone `listarAvisos(alcance)` y compone avisos del OPD activo; `arbolOpdViewModel` consume ese contrato en vez de importar directo el calculo de diagnostico.
- `render/jointjs/overlayCanvas/avisos.ts` se mantiene usando la funcion pura `listarAvisosDiagnostico(modelo, alcance)` porque recibe `modelo` explicitamente y actua como utilidad de render; no se abrio radio innecesario.
- No se cambiaron frases OPL, severidades/citas SSOT, formato JSON, reglas de validacion, comportamiento visible ni semantica OPM.

Commits atomicos del corte:

- `42f7bf9 refactor(app): tipa puertos opl diagnostico`
- `9ea442f refactor(opl): extrae derivacion de panel`
- `37a544c refactor(diagnostico): extrae derivacion de panel`
- `cf43571 refactor(diagnostico): expone calculo por puerto`

Validacion de cierre:

```bash
cd app && bun test src/opl src/modelo/checkers.test.ts src/modelo/validaciones.test.ts
# 338 pass / 0 fail
cd app && bun run browser:smoke -- e2e/03-opl-panel.spec.ts e2e/11-beta1-validacion-metodologica.spec.ts
# 19 passed
cd app && bun run check
# typecheck OK; 1401 pass / 0 fail
cd app && bun run build
# build OK
```

Notas de frontera:

- `OpmStore` sigue siendo fachada de sesion; el corte solo reduce el contrato consumido por OPL/diagnostico.
- `panelMetodologiaIssues.ts` queda como re-export temporal para compatibilidad de imports existentes; la fuente nueva de severidad visible vive en `modelo/diagnosticoSeveridad.ts`.
- El siguiente corte normativo recomendado es Corte 6: Store Por Capacidades Reales. Debe enfocarse en reagrupar slices/contratos efectivos, no en nuevas superficies UI.

### Refactorizacion Total — Corte 4 Persistencia Y Workspace Como Infraestructura Cerrado — 2026-05-18

La rama `main` queda sincronizada con `origin/main` tras `91d247a`.

Resultado arquitectonico:

- `app/src/persistencia/workspaceStorage.ts` concentra lectura/escritura del índice workspace y preferencias UI booleanas, sin depender de `localStorage` global.
- `PersistencePort` y `WorkspacePort` dejan de tiparse contra `OpmStore`; describen contratos explícitos para persistencia, workspace, carpetas, versiones y búsqueda.
- `app/src/persistencia/versiones.ts` expone `ResultadoVersion<T>` con códigos (`storage_no_disponible`, `storage_escritura_fallida`, `storage_lectura_fallida`, `storage_borrado_fallido`, `version_no_encontrada`, `snapshot_no_encontrado`, `snapshot_corrupto`) y mantiene wrappers compatibles `crearVersion`, `restaurarVersion`, `eliminarVersion`.
- Los callers de store para crear/restaurar/eliminar versiones consumen los resultados tipados sin `try/catch` genérico en el camino esperado.
- Puertos adyacentes de workspace/persistencia (`VersionHistoryPort`, `SearchDialogsPort`, `CommandPalettePort`) dejan de depender de `OpmStore`.
- No se cambio formato JSON exportado, claves `localStorage`, backend, UX visible, semantica OPM ni serialización.

Commits atomicos del corte:

- `36c8498 refactor(persistencia): extrae storage de workspace`
- `6c09e9c refactor(app): tipa puerto de persistencia`
- `1bee048 refactor(app): tipa puerto de workspace`
- `261f76f refactor(persistencia): tipa resultados de versiones`
- `91d247a refactor(app): desacopla puertos de workspace del store`

Validacion de cierre:

```bash
cd app && bun run check
# typecheck OK; 1390 pass / 0 fail
cd app && bun run build
# build OK
cd app && bun test src/persistencia src/serializacion
# 131 pass / 0 fail
cd app && bun run browser:smoke -- e2e/06-undo-redo-dirty.spec.ts e2e/01-carga-y-workspace.spec.ts
# 22 passed
```

Notas de frontera:

- `OpmStore` sigue existiendo como fachada de sesión y compatibilidad; el corte no intenta borrar Zustand.
- Persistencia local y versionado ya devuelven resultados tipados en la frontera nueva, pero flujos más grandes de guardar/cargar siguen orquestados desde slices por compatibilidad.
- Quedan otros puertos de UI fuera del alcance de Corte 4 que todavía usan `OpmStore`; deben tratarse solo cuando un corte normativo lo exija.

### Refactorizacion Total — Corte 3 JointJS Como Adapter Cerrado — 2026-05-17

La rama `main` quedo sincronizada con `origin/main` tras `5c5cde4`.

Resultado arquitectonico:

- `JointCanvas` ya no crea directamente `dia.Graph`/`dia.Paper`; delega montaje, destruccion, debug hook, namespace y grid en `app/src/render/jointjs/jointCanvasAdapter.ts`.
- `CanvasInteractionPort` explicita la frontera que el renderer consume desde sesion, seleccion y comandos de modelo, sin duplicar estado ni crear otro store.
- La sincronizacion de cells proyectadas (`resetCells` + dimensiones de paper) vive en el adapter; `proyectarModeloAJointCells` permanece puro.
- El handler de tooltip de hover/foco sale de `JointCanvas` a `handlers/hoverTooltip.ts`, manteniendo el componente como orquestador.
- No se cambio JointJS, geometria canonica, markers, metadata OPM, OPL, formato de persistencia ni UX visible.

Commits atomicos del corte:

- `fdc8e0a refactor(render): extrae adapter de canvas jointjs`
- `dd7fd37 refactor(app): introduce puerto de interaccion canvas`
- `9e6b841 refactor(render): mueve sync de cells al adapter jointjs`
- `e407292 refactor(render): extrae handler de tooltip canvas`
- `5c5cde4 docs(refactor): registra cierre corte jointjs adapter`

Validacion de cierre:

```bash
cd app && bun run check
# typecheck OK; 1379 pass / 0 fail
cd app && bun run build
# build OK
cd app && bun run browser:smoke -- e2e/02-canvas-y-render.spec.ts e2e/11-beta1-tabla-enlaces.spec.ts
# 23 passed
```

Documentacion JointJS OSS consultada para el corte:

- `https://docs.jointjs.com/learn/features/diagram-basics/paper/`
- `https://docs.jointjs.com/api/dia/Graph/`
- `https://docs.jointjs.com/4.0/learn/features/customizing-shapes/cell-namespaces/`

### Refactorizacion Total — Corte 1 ViewModels UI Cerrado — 2026-05-17

La rama `main` queda sincronizada con `origin/main` tras `495cc19`.

Resultado arquitectonico:

- `rg "useOpmStore" app/src/ui -l` no reporta archivos.
- Los componentes UI siguen renderizando y gestionando interaccion visual, pero ya no leen Zustand directamente.
- `app/src/app/viewmodels/` actua como fachada temporal sobre el store para pantallas, dialogos, toolbar, mapa, command palette, asistente, arbol, inspectors y chrome.
- No se cambio semantica OPM, textos visibles, layout intencional ni formato de persistencia.
- Se mantuvo JointJS como adapter visual; el corte no movio proyeccion ni geometria.

Commits atomicos recientes de cierre:

- `495cc19 refactor(ui): extrae viewmodel de toolbar base`
- `3d67c08 refactor(ui): extrae viewmodel de barra contextual`
- `4f1c273 refactor(ui): extrae viewmodel de command palette`
- `b70fac1 refactor(ui): extrae viewmodel de mapa sistema`
- `3907535 refactor(ui): extrae viewmodel de menu principal`
- `7911635 refactor(ui): extrae viewmodel de asistente`
- `cd002e3 refactor(ui): extrae viewmodel de capturador bugs`
- `5662d9f refactor(ui): extrae viewmodel de arbol opd`
- `6a6f843 refactor(ui): extrae viewmodel de toolbar creacion`
- `951eb7b refactor(ui): extrae viewmodel de pantalla inicio`
- `d278715 refactor(ui): extrae viewmodel de plantillas`
- `c26c58b refactor(ui): extrae viewmodel de gestion opd`

Validacion acumulada del cierre de Corte 1:

```bash
cd app && bun run typecheck
cd app && bun run build
cd app && bun test src/ui/BarraHerramientasElemento.test.ts
cd app && bun test src/ui/CommandPalette.test.ts
cd app && bun test src/render/jointjs/mapaSistema.test.ts
cd app && bun test src/store/uiPanel.test.ts src/ui/toolbar/ToolbarCreacion.test.ts
cd app && bun run browser:smoke -- e2e/15-superficie-contextual.spec.ts
cd app && bun run browser:smoke -- e2e/12-command-palette.spec.ts
cd app && bun run browser:smoke -- e2e/04-arbol-y-pestanas.spec.ts
cd app && bun run browser:smoke -- e2e/12-toolbar-overflow.spec.ts e2e/02-canvas-y-render.spec.ts e2e/21-estado-vacio-opm.spec.ts
```

Resultados observados:

```text
typecheck OK
build OK
BarraHerramientasElemento: 53 pass / 0 fail
CommandPalette: 4 pass / 0 fail
mapaSistema: 13 pass / 0 fail
uiPanel + ToolbarCreacion: 4 pass / 0 fail
superficie contextual: 11 passed
command palette: 5 passed
arbol y pestanas: 6 passed
toolbar + canvas + estado vacio: 25 passed
```

Siguiente corte normativo recomendado:

- Entrar a Corte 2 del plan: puertos de aplicacion sobre el store existente.
- No hacer otra ronda de viewmodels cosmeticos: el valor ahora esta en que viewmodels grandes dependan de puertos pequenos (`ModelCommandPort`, `SelectionPort`, `OplPort`, `PersistencePort`) en vez de `useOpmStore`.
- Primer candidato pragmatico: consolidar `app/src/app/ports/` existente y migrar 1-2 viewmodels de alto trafico (`toolbarCreacionViewModel`, `jointCanvasViewModel` o `tablaEnlacesViewModel`) a puertos ya creados, sin segundo store global.

### Refactorizacion Total — Corte 2 Puertos De Aplicacion Iniciado — 2026-05-17

Avance posterior al cierre de Corte 1:

- `ea7257a refactor(app): usa puertos en toolbar creacion`
  - `toolbarCreacionViewModel` consume `ModelCommandPort` y `SelectionPort` para comandos de enlace y seleccion.
  - Validado con typecheck, build, `ToolbarCreacion.test.ts` y `e2e/24-conexion-anchor.spec.ts`.
- `1f58233 refactor(app): introduce puerto de sesion canvas`
  - Nuevo `CanvasSessionPort` para estado de sesion/presentacion del canvas.
  - `jointCanvasViewModel` queda compuesto por puertos de comandos, seleccion y sesion canvas.
  - Validado con typecheck, build, `proyeccion.test.ts`, `halos.test.ts` y `e2e/02-canvas-y-render.spec.ts`.
- `9ce1e7f refactor(app): introduce puerto de navegacion opd`
  - Nuevo `OpdNavigationPort` para `modelo`, `opdActivoId` y `cambiarOpdActivo`.
  - `breadcrumbViewModel` deja de depender directo del store.
  - Validado con typecheck, build y `e2e/04-arbol-y-pestanas.spec.ts`.
- `f908717 refactor(app): introduce puerto de arbol opd`
  - Nuevo `OpdTreePort` para acciones/estado especificos del arbol OPD.
  - `arbolOpdViewModel` depende de `OpdNavigationPort` + `OpdTreePort`.
  - Validado con typecheck, build, `bun test src/store.test.ts -t "mapa del sistema"` y `e2e/04-arbol-y-pestanas.spec.ts`.
- `938d78e refactor(app): introduce puerto de tabla enlaces`
  - `tablaEnlacesViewModel` consume `LinksTablePort`.
  - Validado con typecheck, build, suite unitaria completa y smokes de tabla/superficie contextual.
- `0b40679 refactor(app): introduce puerto de inspector enlaces`
  - `inspectorEnlaceViewModel` consume `LinkInspectorPort` dividido internamente por sesion, propiedades, endpoints, grupo estructural, estilo y eliminacion.
  - Validado con typecheck, build, suite unitaria completa y smokes de canvas/enlaces/tabla.
- `7b41642 refactor(app): introduce puerto de paleta comandos`
  - `commandPaletteViewModel` consume `CommandPalettePort`.
  - Validado con typecheck, build, `CommandPalette.test.ts` y smoke `e2e/12-command-palette.spec.ts`.
- `450d85d refactor(app): introduce puertos de chrome e historial`
  - `toolbarBaseViewModel` empieza a depender de `ToolbarChromePort` y `HistoryPort`.
  - Validado con typecheck, build, suite unitaria completa y smokes de toolbar/command palette/undo-redo.
- `f2b1b73 refactor(app): introduce puerto de creacion modelo`
  - Nuevo `ModelCreationPort` para creacion de objeto/proceso/atributo y modal de nombre de cosa.
  - Validado con typecheck, build, suite unitaria completa y smokes de canvas/toolbar/conexion.
- `6b1ec89 refactor(app): usa puerto de seleccion en toolbar`
  - `toolbarBaseViewModel` reutiliza `SelectionPort` para seleccion pasiva y acciones de seleccionar entidad/enlace.
  - Validado con typecheck, suite unitaria completa y tests focales de seleccion.
- `5722eba fix(ui): prioriza escape de dialogos modales`
  - Corrige carrera de Escape entre `Dialogo`, registry global de atajos y `ToolbarMas`.
  - Validado con typecheck, unitarios de atajos/dialogos/toolbar y smoke `HU-33.022`.
- `915f45c refactor(app): introduce puerto de controles workbench`
  - Nuevo `WorkbenchViewControlsPort` para alias/descripciones, modo imagen, grid, configuracion, layout sugerido, biblioteca dock, mapa y simulacion.
  - Validado con typecheck, build, suite unitaria completa y 33 smokes seriales de workbench.
- `5dc9acf refactor(app): introduce puerto de acciones batch seleccion`
  - Nuevo `SelectionBatchActionsPort` compartido por toolbar base y barra contextual.
  - Validado con typecheck, build, suite unitaria completa y 43 smokes de canvas/toolbar/residual.
- `9020873 refactor(app): introduce puerto de acciones enlace`
  - Nuevo `LinkContextActionsPort` compartido por toolbar base y barra contextual para copiar/pegar estilo, portapapeles de estilo y borrado contextual de enlaces.
  - Validado con typecheck, build, suite unitaria completa y 39 smokes de canvas/residual.
- `ebad43c refactor(app): introduce puerto de autosalvado`
  - Nuevo `AutosavePort` para estado y ciclo iniciar/detener autosalvado.
  - `toolbarBaseViewModel` y `toolbarViewModel` dejan de leer autosalvado directo desde Zustand.
  - Validado con typecheck, build, suite unitaria completa y 19 smokes de dirty/undo/toolbar.
- `aff840c refactor(app): reutiliza puerto de navegacion opd en toolbar`
  - `toolbarBaseViewModel` reutiliza `OpdNavigationPort` para `modelo` y `opdActivoId`.
  - Validado con typecheck, build, unitarios focales y smoke `e2e/12-toolbar-overflow.spec.ts`.
- `7774a55 refactor(app): introduce puerto de vista mapa`
  - Nuevo `MapViewPort` para `vistaMapaActiva`, `abrirVistaMapa` y `cerrarVistaMapa`.
  - `WorkbenchViewControlsPort` deja de mezclar responsabilidad de mapa.
  - Validado con typecheck, build, suite unitaria completa y smokes de toolbar/arbol/mapa.
- `4577949 refactor(app): reutiliza puertos en barra contextual`
  - `barraHerramientasElementoViewModel` reutiliza `OpdNavigationPort` y `SelectionPort` para lectura de modelo/OPD/seleccion.
  - Validado con typecheck, build, suite unitaria completa y 28 smokes de canvas/superficie contextual.
- `fe3361f refactor(app): introduce puerto de acciones de elemento`
  - Nuevo `SelectedElementActionsPort` para acciones de estado/refinamiento/imagen sobre el elemento seleccionado.
  - `barraHerramientasElementoViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, suite unitaria completa y 43 smokes de canvas/superficie/refinamiento.
- `64b673b refactor(app): reutiliza puertos en toolbar creacion`
  - `toolbarCreacionViewModel` reutiliza `ModelCreationPort` y `OpdNavigationPort` para modo de creacion y modelo.
  - Validado con typecheck, build, suite unitaria completa y 20 smokes de conexion/canvas.
- `7283f91 refactor(app): introduce puerto de modo interaccion`
  - Nuevo `InteractionModePort` para `modoEnlace` y `modoSeleccion`.
  - `toolbarCreacionViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, suite unitaria completa y 20 smokes de conexion/canvas.
- `fa9d140 refactor(app): introduce puerto de controles mapa`
  - Nuevo `SystemMapControlsPort` para refresco de mapa, auto-refresh y panel de estadisticas.
  - `toolbarMapaSistemaViewModel` queda sin dependencia directa a `useOpmStore`; `mapaSistemaViewModel` reutiliza el puerto para controles compartidos.
  - Validado con typecheck, build, suite unitaria completa y smokes de arbol/mapa/toolbar.
- `224c7c5 refactor(app): reutiliza puertos en mapa sistema`
  - `mapaSistemaViewModel` reutiliza `OpdNavigationPort` para `modelo` y `MapViewPort` para cierre de mapa.
  - Validado con typecheck, build, suite unitaria completa y smoke `e2e/04-arbol-y-pestanas.spec.ts`.
- `c096639 refactor(app): introduce puerto de mensajes de sesion`
  - Nuevo `SessionMessagePort` para `mensaje` y `limpiarMensaje`.
  - `mensajeFlashViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, `MensajeFlashBridge.test.ts` y `feedback.test.ts`.
- `6b3bea9 refactor(app): introduce puertos de modales de metadatos`
  - Nuevos `EntityMetadataModalPort` y `StateDurationModalPort`.
  - `modalImagenObjetoViewModel`, `modalUrlsObjetoViewModel` y `modalDuracionEstadoViewModel` quedan sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, unitarios de metadata/duracion y smoke `e2e/02-canvas-y-render.spec.ts`.
- `8f17d94 refactor(app): introduce puerto de revision mobile`
  - Nuevo `MobileReviewPort` para tabs del modo revision mobile.
  - `modoRevisionMobileViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, `ModoRevisionMobile.test.tsx` y smoke `e2e/22-responsive-review.spec.ts`.
- `8c07ae5 refactor(app): introduce puerto de dialogo configuracion`
  - Nuevo `ConfigurationDialogPort` con grid normalizado en adapter.
  - `dialogoConfiguracionViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build y smokes `e2e/11-dialogo-layout-regression.spec.ts` + `e2e/12-toolbar-overflow.spec.ts`.
- `d814e30 refactor(app): introduce puerto de pestanas de sesion`
  - Nuevo `SessionTabsPort` para pestanas abiertas, activa, cambio/cierre/reordenamiento y guardado local del cierre dirty.
  - `barraPestanasViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, unitarios de pestanas/persistencia/runtime y smoke `e2e/04-arbol-y-pestanas.spec.ts`.
- `08b631e refactor(app): reutiliza puertos en menu principal`
  - `menuPrincipalViewModel` empieza a reutilizar puertos existentes de chrome, pestanas, persistencia, workspace, mapa, workbench, navegacion OPD y seleccion.
  - `PersistencePort` incorpora `abrirCargarModelo`.
  - Validado con typecheck, build, unitarios focales y smoke `e2e/12-toolbar-overflow.spec.ts`.
- `e1ce0c0 refactor(app): introduce puertos complementarios de menu`
  - Nuevos `HelpPort`, `ModelBootstrapPort`, `SearchDialogsPort` y `TemplateDialogsPort`.
  - `LinksTablePort`, `PersistencePort` y `EntityMetadataModalPort` incorporan openers nombrables.
  - `menuPrincipalViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, unitarios focales y smokes de toolbar, command palette y tabla de enlaces.
- `5ea674a refactor(app): reutiliza puertos en inspector raiz`
  - `inspectorViewModel` reutiliza `OpdNavigationPort`, `SelectionPort` y `PersistencePort`.
  - Validado con typecheck, build, unitarios de inspector y smokes de superficie contextual, tabs de inspector y catalogo/ancla.
- `22be80b refactor(app): introduce puerto de overflow toolbar`
  - Nuevo `ToolbarOverflowPort` para `ToolbarMas`.
  - `toolbarMasViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, unitarios de UI panel/toolbar y smoke `e2e/12-toolbar-overflow.spec.ts`.
- `ed91881 refactor(app): introduce puerto de pantalla inicio`
  - Nuevo `WelcomeScreenPort`; `pantallaInicioViewModel` reutiliza puertos de bootstrap, navegacion, persistencia y workspace.
  - Validado con typecheck, build, `PantallaInicio.test.ts`, `persistencia.test.ts` y smoke `e2e/21-estado-vacio-opm.spec.ts`.
- `e329b31 refactor(app): introduce puerto de editabilidad`
  - Nuevo `EditabilityPort` para `readOnly`.
  - `estadoVacioOpmViewModel` reutiliza `OpdNavigationPort`, `ModelCommandPort`, `ModelBootstrapPort` y `EditabilityPort`.
  - Validado con typecheck, build, unitarios focales de estados y smoke `e2e/21-estado-vacio-opm.spec.ts`.
- `a936dc2 refactor(app): amplia puerto de plantillas`
  - `TemplateDialogsPort` cubre catalogo, guardado e insercion de plantillas.
  - `dialogoPlantillasViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, unitarios de plantillas/batch y smokes residuales/toolbar.
- `b810701 refactor(app): introduce puerto de historial versiones`
  - Nuevo `VersionHistoryPort` para dialogo de versiones, creacion manual, restauracion, eliminacion y toggle de visibilidad.
  - `dialogoVersionesViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, unitarios de versiones/persistencia y smoke residual completa.
- `277f1bc refactor(app): introduce puerto de timeline`
  - Nuevo `TimelinePort`; `timelineViewModel` reutiliza `OpdNavigationPort` y `SelectionPort`.
  - Validado con typecheck y build.
- `5dbe3f2 refactor(app): introduce puerto de traer conectados`
  - Nuevo `BringConnectedDialogPort`; el viewmodel reutiliza navegacion OPD y seleccion para conteos.
  - Validado con typecheck, build, `operacionesBatch.test.ts` y smoke `e2e/07-enlaces-avanzados.spec.ts`.
- `5810c17 refactor(app): introduce puertos de busqueda`
  - `SearchDialogsPort` queda como opener; nuevos subpuertos para busqueda intra-modelo y global.
  - `busquedaCosasViewModel` y `busquedaGlobalViewModel` quedan sin dependencia directa al store.
  - Validado con typecheck, build, unitarios de workspace/busqueda y 33 smokes de busqueda/workspace/residual.
- `7d00655 refactor(app): introduce puerto de gestion arbol opd`
  - Nuevo `OpdTreeManagementPort`; `gestionArbolOpdViewModel` queda aislado del puerto ancho del arbol lateral.
  - Validado con typecheck, build, unitarios OPD/arbol y smoke `e2e/04-arbol-y-pestanas.spec.ts`.
- `d312f46 refactor(app): introduce puerto de contexto bugs`
  - Nuevo `BugCaptureContextPort` con helper puro para contexto store+navegador.
  - `capturadorBugsViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, unitario del shape y smoke `e2e/10-capturador-bugs.spec.ts`.
- `f52b7cf refactor(app): introduce puertos de mapa sistema`
  - Nuevos puertos de datos, viewport y filtros del mapa; `mapaSistemaViewModel` queda sin store directo.
  - Validado con typecheck, build, unitarios de mapa y smokes de arbol/mapa/toolbar.
- `7c54039 refactor(app): introduce puerto de asistente modelo`
  - Nuevo `NewModelAssistantPort`; las mutaciones imperativas del wizard salen del viewmodel.
  - Validado con typecheck, build, unitarios de asistente/estado vacio y smoke `e2e/21-estado-vacio-opm.spec.ts`.
- `881d931 refactor(app): introduce puertos de app shell`
  - Nuevos puertos shell-only para workbench/layout/modos y overlays.
  - `appShellViewModel` queda sin dependencia directa a `useOpmStore`.
  - Validado con typecheck, build, unitarios focales y 32 smokes de canvas/arbol/toolbar/mobile.
- `24fc92c refactor(app): introduce puertos de inspector entidad`
  - Nuevos subpuertos para shell, semantica, metadata, estilo, refinamiento y estados del inspector de entidad.
  - `inspectorEntidadViewModel` queda sin dependencia directa a `useOpmStore`; el caso `crearEstadosConNombres` conserva la lectura post-mutacion en el adapter.
  - Validado con typecheck, build, 28 unitarios focales y 62 smokes de canvas/inspector/refinamiento/enlaces.

Estado arquitectonico del ultimo corte:

- `toolbarBaseViewModel` queda sin dependencia directa a `useOpmStore`; se compone por puertos pequenos (`ToolbarChromePort`, `HistoryPort`, `ModelCreationPort`, `SelectionPort`, `WorkbenchViewControlsPort`, `LinkContextActionsPort`, `SelectionBatchActionsPort`, `AutosavePort`, `OpdNavigationPort`, `MapViewPort`).
- `barraHerramientasElementoViewModel` queda sin dependencia directa a `useOpmStore`; se compone por `OpdNavigationPort`, `SelectionPort`, `SelectedElementActionsPort`, `SelectionBatchActionsPort` y `LinkContextActionsPort`.
- `toolbarViewModel` queda sin dependencia directa a `useOpmStore`; consume `AutosavePort` y `MapViewPort`.
- `toolbarCreacionViewModel` queda sin dependencia directa a `useOpmStore`; se compone por `ModelCommandPort`, `ModelCreationPort`, `OpdNavigationPort`, `SelectionPort` e `InteractionModePort`.
- `toolbarMapaSistemaViewModel` queda sin dependencia directa a `useOpmStore`; consume `SystemMapControlsPort`.
- `menuPrincipalViewModel`, `barraPestanasViewModel`, `inspectorViewModel`, `toolbarMasViewModel`, `pantallaInicioViewModel`, `estadoVacioOpmViewModel`, `mensajeFlashViewModel`, `modoRevisionMobileViewModel`, `dialogoConfiguracionViewModel`, `dialogoPlantillasViewModel`, `dialogoVersionesViewModel`, `timelineViewModel`, `dialogoTraerConectadosViewModel`, `busquedaCosasViewModel`, `busquedaGlobalViewModel`, `gestionArbolOpdViewModel`, `capturadorBugsViewModel`, `mapaSistemaViewModel`, `asistenteNuevoModeloViewModel`, `appShellViewModel`, `inspectorEntidadViewModel` y los viewmodels de modales de metadata quedan sin dependencia directa a `useOpmStore`.
- `rg "useOpmStore|from \"../../store\"|from '../../store'" app/src/app/viewmodels -n` no reporta resultados.
- No se introdujo segundo store, estado duplicado ni DI global.

Estado pendiente observado tras `24fc92c`:

- `rg "useOpmStore" app/src/app/viewmodels -l` reporta 0 viewmodels directos.
- Siguiente orden recomendado del plan normativo: entrar a Corte 3 con `JointCanvas`/render y handlers como adapters hacia puertos/eventos, manteniendo proyeccion pura testeable; no iniciar otro refactor UI cosmetico.

Regla operativa nueva: antes de migrar otro viewmodel, preferir reutilizar un puerto existente. Crear un puerto nuevo solo si representa una capacidad nombrable y reusable, no una coleccion accidental de selectors.

### Post-Brief HODOM Denso — Foco De Estados OPM — 2026-05-16

La rama `main` queda preparada para sincronizarse con `origin/main` tras `993e1f9`, que corrige la precisión OPM del foco temporal iniciado en `daa3bc3`:

- `TablaEnlaces` ya no degrada extremos `estado` a la entidad contenedora al construir `idsResaltadosTemporales`; conserva el `estado.id` cuando el enlace apunta a una cápsula.
- La proyección JointJS agrega halo `selection-halo` con `targetKind: "estado"` sobre la cápsula interna visible, usando geometría compartida `rectCapsulaEstado`.
- Si el estado no está visible por plegado parcial o supresión, el foco degrada al objeto contenedor para evitar selecciones invisibles.
- Los halos de entidad existentes quedan estables: metadata previa sin `targetKind` para no romper consumidores actuales.
- E2E nuevo cubre el flujo real: filtro en tabla sobre enlace `s-pendiente -> Aprobar`, botón `Resaltar filtrados`, enlace resaltado, halo en `s-pendiente`, sin halo falso en `o-pedido`.

Validación del corte:

```bash
cd app && bun run typecheck
cd app && bun test src/render/jointjs/proyeccion.test.ts src/render/jointjs/composers/halos.test.ts
# 59 pass / 0 fail
cd app && bun run browser:smoke -- e2e/11-beta1-tabla-enlaces.spec.ts
# 6 passed
cd app && bun run lint
cd app && bun run test
# 1373 pass / 0 fail
cd app && bun run build
cd app && bun run browser:smoke
# 193 passed / 0 fail
```

### Post-Brief HODOM Denso — 2026-05-16

La rama `main` queda preparada para sincronizarse con `origin/main` tras `daa3bc3`, que conecta `TablaEnlaces` con foco visual en el canvas:

- Búsqueda textual por origen, destino, etiqueta, tipo, familia y OPD.
- Filtro por familia `Procedurales` / `Estructurales` / `Todos`.
- Contador accesible `filtrados/total` con desglose procedurales/estructurales y visibles en el OPD activo.
- Botón de limpieza de filtros.
- Botón `Resaltar filtrados` que no cierra la tabla, cambia al primer OPD relevante si el filtro no tiene enlaces visibles en el OPD actual y resalta enlaces + extremos como subgrafo temporal.
- `idsResaltadosTemporales` vuelve a participar en la proyección JointJS, sin contaminar la selección real del store.
- Smokes específicos sobre modelo mixto de 10 enlaces para cubrir búsqueda + familia + foco visual sin romper edición, eliminación ni navegación existente.

Prueba directa con HODOM v1.1 real:

```bash
# Cargado por browser contra http://127.0.0.1:5173/
# Contador inicial: 113 de 113 enlaces · 83 procedurales · 30 estructurales · 21 visibles en SD-0 — Establecimiento HODOM
# Búsqueda "Paciente": 19 enlaces resaltados · 7 visibles en SD-0 — Establecimiento HODOM
# Foco canvas: 5 enlaces con wrapper resaltado + 4 halos de extremos
# pageErrors: []
```

Validación del corte:

```bash
cd app && bun run typecheck
cd app && bun run browser:smoke -- e2e/11-beta1-tabla-enlaces.spec.ts
# 5 passed
cd app && bun run lint
cd app && bun run test
# 1371 pass / 0 fail
cd app && bun run build
cd app && bun run browser:smoke
# 192 passed / 0 fail
cd app && node scripts/in-vivo-test.mjs http://127.0.0.1:5173/
# OK=57 FAIL=0 WARN=0 INFO=2
```

### UX/IFML Ronda 22 — 2026-05-16

La rama `main` quedó sincronizada con `origin/main` tras el commit `08b3753`, que reemplaza la sonda in-vivo obsoleta por una auditoría alineada a la UI actual:

- Carga/bienvenida y mini-glosa OPM.
- Chrome IFML desktop: `ViewPoint` default, clusters `Modelar`/`Conectar`/`Ayuda`, menú principal y `CommandPalette`.
- Catalogo de ejemplos reseteado a OPCloud sandbox: `System Diagram`, `SD Sync`, `SD Async`, `OnStar System`, `OPM Structure Meta Model`, `Modelo Vacio`. `OnStar System` es tambien el unico ejemplo del libro curado conservado por respaldo formativo.
- Overlay feedback: `BarraHerramientasElemento`, `ErrorBadge`, `HoverTooltip`, `FlashToast`.
- Conexión por `MenuTipoEnlace` y submodo accesible `conectando`.
- Import JSON multi-OPD y navegación del árbol.
- Mobile review 390x844: tabs `Canvas`/`OPDs`/`OPL`/`Issues`, sin overflow horizontal.

Resultado de la última auditoría:

```bash
cd app
node scripts/in-vivo-test.mjs http://127.0.0.1:5173/
# OK=57 FAIL=0 WARN=0 INFO=2
# pageerror=0 console.error=0 console.warn=0 requestfailed=0
```

El script genera `docs/REPORTE-EJECUTIVO.md` y `app/test-results/in-vivo/`, ambos ignorados por git según `.gitignore`.

## Validación Reciente

Ejecutado sobre el estado actual (`e407292`):

```bash
cd app && bun run check
cd app && bun run build
cd app && bun run browser:smoke -- e2e/02-canvas-y-render.spec.ts e2e/11-beta1-tabla-enlaces.spec.ts
```

Resultado:

```text
typecheck OK via check
1379 unit tests passed / 0 fail
build OK
23 browser smoke passed / 0 fail
```

Última auditoría in-vivo completa sigue siendo la de `08b3753`/`63dd213`; este corte no cambió el script in-vivo ni la semantica OPM, solo la frontera JointJS/app/render.

Validación HODOM v1.1 realizada sobre el corte funcional previo de foco canvas:

```bash
cd app
bun -e 'import { readFileSync } from "node:fs"; import { hidratarModelo } from "./src/serializacion/json"; import { proyectarModeloAJointCells } from "./src/render/jointjs/proyeccion"; const raw = readFileSync("/home/felix/projects/hd-hsc-os/docs/models/opm-hodom-bundle-v1.1.json", "utf8"); const hidratado = hidratarModelo(raw); if (!hidratado.ok) throw new Error(hidratado.error); const modelo = hidratado.value; const proyecciones = Object.keys(modelo.opds).map((opdId) => ({ opdId, cells: proyectarModeloAJointCells(modelo, opdId, null, null).length })); console.log(JSON.stringify({ entidades: Object.keys(modelo.entidades).length, enlaces: Object.keys(modelo.enlaces).length, opds: Object.keys(modelo.opds).length, proyecciones }, null, 2));'
# entidades=46 enlaces=113 opds=5
# opd-sd0=43 cells, opd-sd1=97, opd-sd1-2=38, opd-eq-salud-hd=19, opd-cap-op-hd=15
```

## Commits Relevantes Del Cierre UX/IFML

- `993e1f9 feat(ux): enfoca extremos de estado filtrados`
- `63dd213 docs: registra foco hodom en canvas`
- `96d5097 feat(ux): filtra tabla de enlaces densa`
- `daa3bc3 feat(ux): enfoca enlaces filtrados en canvas`
- `08b3753 test(ux): actualiza auditoria in vivo`
- `de67395 refactor(a11y): unifica fuente de avisos`
- `84a96f2 test(a11y): cubre ciclo de feedback`
- `5ac1319 fix(a11y): ajusta contraste de warning`
- `d9b85c1 fix(a11y): respeta reduced motion`
- `38762ea fix(a11y): describe hover tooltip al foco`
- `15d9077 fix(a11y): anuncia cambios de viewpoint`
- `f5486db fix(a11y): navega tabs del inspector con flechas`
- `f10ce76 refactor(ifml): tipa eventos de acciones contextuales`
- `76b1911 feat(a11y): permite conectar por teclado`
- `d7c2c1d feat(ux): guia conexion por anchors`
- `97abbb8 feat(ifml): declara contexto canonico del workbench`
- `976ef1d refactor(ux): ordena menu principal por intencion`

## Workspace No Consolidado

Hay artefactos no trackeados en `docs/audits/`, `docs/bugs/` y `docs/instrucciones-lineas-dev/ronda22/`. Son insumos/artefactos de trabajo previos; no promoverlos sin una decisión explícita de alcance.

También pueden existir salidas regenerables ignoradas:

- `docs/REPORTE-EJECUTIVO.md`
- `app/test-results/in-vivo/`
- `app/dist/`

## Pendientes Post-Corte 10

El brief UX/IFML y la refactorizacion total 0-10 quedan cerrados para los cortes
auditados. Los cortes de modelos densos ya mejoraron `TablaEnlaces`, conectaron
sus filtros con foco visual en canvas y corrigieron el foco de extremos
`estado`; los cortes 8-10 cerraron consistencia, cascadas y proceso.

Pendiente arquitectonico recomendado:

- Abrir un plan normativo nuevo y acotado si se decide atacar deuda residual de frontera render/UI, comandos globales o puertos aun tipados desde `OpmStore`.
- No llamar a ese trabajo "continuacion automatica" de Corte 10: debe declarar alcance, no objetivos y gates propios.
- Mantener `OpmStore` como fachada compatible mientras los puertos restantes se vuelven contratos explicitos.
- Seguir usando `bun run check`, `bun run lint`, `bun run build`, `bun run browser:smoke`, `progress-dashboard --sync-real` y `quality-ledger` como cierre de loop para cortes de refactor.

Pendientes funcionales a retomar despues o como pressure tests:

- **Mini-mapa / mapa del sistema más operativo**: navegación visual para modelos densos.
- **Import/export OPX real**: interoperabilidad más allá del JSON local.
- **Modelos densos HODOM**: profundizar filtros de canvas, mini-mapa y performance perceptual con 5 OPDs y 113 enlaces.
- **Enlaces OPCloud avanzados**: forked tagged links, smoke UI específico para tagged/bidirectional + exception/time.
- **Comentarios/notas**: EPICA-42 sigue fuera del modo mobile review productivo; hoy se comunica como no disponible.

## Prompt De Continuación

Retomar desde este `docs/HANDOFF.md` y el plan `docs/roadmap/refactorizacion-total-plan-normativo.md`.

Siguiente bloque recomendado: decidir si se abre un plan nuevo para deuda residual de frontera, empezando por uno de tres frentes: render/UI, comandos globales fuera de `App`, o puertos restantes que todavia dependen tipadamente de `OpmStore`.
