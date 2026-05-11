# HANDOFF — Cierre Fase 2 + Beta2 (L1+L2+L3)

**Fecha**: 2026-05-11
**Repositorio**: `deep-opm-pro`
**Rama**: `main`
**HEAD**: `aa1b8ef` (sincronizado con `origin/main`)
**Base previa**: `c34a482` (cierre fix FAB mobile post-Fase 2, 2026-05-08).
**Corte**: rondas 19, 20 y 21 cerradas en su totalidad sobre el informe UI/UX 2026-05-07. Ronda 17 / **Beta2 L1+L2+L3 cerrada** en sesión secuencial 2026-05-11 (kernel determinista + valores simples runtime + UI modo simulación). L4 (eval Beta2 sobre dominio ancla real) queda fuera de scope hasta que el operador cierre Beta1 sobre HODOM-HSC. Más 2 bugs reales cerrados: tab Inspector "pegote" cross-acción y flake `11-beta1-busqueda:106`.

## Política De Handoff Único

`docs/HANDOFF.md` es la única memoria de traspaso vigente del proyecto. Este archivo **reemplaza** y consolida el handoff anterior. No crear handoffs paralelos, fechados ni duplicados.

## Contexto Normativo

El modelador OPM vive en `app/` con Bun + Vite + Preact + Zustand + JointJS OSS. La arquitectura sigue siendo propia: no Angular, no Firebase, no Rappid.

Autoridad semántica:

- SSOT OPM/ISO 19450: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`
- Evidencia operacional OPCloud: `opm-extracted/`
- Evidencia visual canónica: `assets/svg/`, `assets/png/`, `docs/JOYAS.md`
- Backlog vivo: `docs/historias-usuario-v2/`
- Auditoría UX vigente: `docs/audits/opm-app-ux-2026-05-07/informe-final-ui-ux.md` (intocable, evidencia histórica)
- Corte operativo vivo: `docs/roadmap/cortes-operativos.md`

Regla viva: OPCloud operacionaliza OPM, pero no redefine la semántica. Antes de crear una solución nueva, revisar SSOT, `assets/`, `docs/JOYAS.md` y `opm-extracted/`.

## Estado Ejecutivo

`main @ 2bf9613` como base de esta continuidad, **25 commits adelante de `origin/main`** antes del commit de cierre. Trabajo nuevo desde el cierre de ronda 19:

1. **Empaque ronda 20/21** (`5130827`): briefs en `docs/instrucciones-lineas-dev/ronda20/` y `ronda21/` (cada uno con README + 4/3 líneas + prompt).
2. **Ronda 20 L4** (`02f652d`): creación de estados con nombres reales + preview OPL (`<ModalCrearEstados />`).
3. **Ronda 21 L3** (`f52d958`): eval UX permanente (`evaluacion-ux-permanente.mjs` + fixtures).
4. **Fix canvas** (`1093845`): zoom suave exponencial + doble clic navega a refinamiento.
5. **Convergencia paralela r20 L3/L1/L2 + r21 L1/L2** (15 commits + 5 merge `--no-ff` + 1 fix de marker + 4 commits de fix-up de smokes). Detalle en §"Memoria Consolidada Del Corte".
6. **Continuidad fix FAB mobile**: `CapturadorBugs` eleva el FAB sobre la barra mobile usando `useBreakpoint()` y el smoke 22 vuelve a clicks reales.

Loop verde sobre `main @ aa1b8ef`:

- `bun run check` (typecheck + tests) → pass · **1162 unit / 0 fail / 4287 expect()** / 113 archivos
- `bun run lint` → clean
- `bun run build` → `index-DiBkIJMj.js` **347.79 KB / 90.68 KB gzip** (vendor JointJS lazy 470 KB sin cambio)
- `bun run browser:smoke` → **171 passed / 0 fail**

> Nota cap bundle: el cap declarado en README ronda 20 era ≤ 340 KB; quedamos en 343.20 KB (+0.94%). Slack pequeño y dentro del cap relajado del fix-up (≤ 345 KB). Se documenta como deuda menor de optimización.

Próximas rondas disponibles:

- **Ronda 17 L4** / Beta2 eval dominio ancla: solo se ejecuta cuando el operador conduzca Beta1 sobre HODOM-HSC. Brief intacto en `docs/instrucciones-lineas-dev/ronda17/linea-4-eval-beta2-dominio-ancla.md`.
- **Render overlay JointJS para proceso activo**: deuda menor de Beta2 L2 (marca de proceso activo es textual en BarraSimulacion).
- **Optimización bundle**: 347.79 KB > cap fix-up r20 (345 KB) por 2.79 KB. Tree-shake o lazy split adicional cuando se requiera.

## Memoria Consolidada Del Corte

### Convergencia paralela r20 + r21 (cierre Fase 2 + cierre residual UX)

5 líneas ejecutadas en paralelo por 5 agentes en worktrees aislados, brief-driven, con loop verde local antes del entregable. Convergencia secuencial en `main` con `git merge --no-ff` en orden L3 → L1 → L2 (r20) → L1 → L2 (r21). Conflictos resueltos manualmente en archivos compartidos (`App.tsx`, `tokens.ts`, `uiPanel.ts`, `sliceTypes.ts`, `tipos.ts`, `ToolbarBase.tsx`).

#### Ronda 20 L3 — Biblioteca dockable (commits `4acbb45..208d3ee`, merge `034a414`)

| Aporte | Implementación |
|---|---|
| Filtros puros | `biblioteca/filtrosBiblioteca.ts`: `filtrarEntidades(modelo, opdActivoId, { query, tipo, soloOpdActivo })` con orden alfabético locale es-CL. 12 unit tests. |
| Dock acoplable | `biblioteca/BibliotecaDock.tsx` (NUEVO 268 LOC): panel persistente bajo el árbol OPD con `DivisorPanel` horizontal redimensionable (alto 280 default, 160-600 px). Convive con árbol + canvas + inspector en desktop ≥ 900 px. Mobile/tablet sigue overlay legacy. |
| Atajo y toggle | `Ctrl+B` (libre, verificado) → `toggleBibliotecaDock`. Botón "Biblioteca dock" agregado al cluster Vista de la toolbar (preserva `abrir-biblioteca-cosa` para overlay legacy + nuevo `toggle-biblioteca-dock`). |
| Surprise documentada | `bibliotecaCosaAbierta` no existía en store (vivía como local state en `ToolbarCreacion`). Migrada al store de forma aditiva preservando el testid existente, condición necesaria para enforcar la regla "abrir dock cierra overlay". |

Decisiones tomadas: dock abajo del árbol (no arriba), tipo radio + soloOpdActivo checkbox, contador "5 entidades" filtradas, default cerrado. Smoke: `e2e/20-biblioteca-dock.spec.ts` (3 tests).

#### Ronda 20 L1 — Inspector en tabs (commits `54d7a68..312b012`, merge `fabc728`)

| Aporte | Implementación |
|---|---|
| Tabs entidad | `inspector/InspectorTabs.tsx` (NUEVO genérico): `Semántica / Enlaces / Refinamiento / Apariciones / Estilo` con `role="tablist"`, `aria-selected`, `data-testid="inspector-tab-{id}"`. Default `Semántica`. |
| Tabs enlace | InspectorEnlace expone tabs simétricos: `Propiedades / Extremos / Estilo`. Default `Propiedades`. |
| Tab Apariciones | `inspector/SeccionApariciones.tsx` (NUEVO) + helpers puros `aparicionesUtils.ts`. Lista plana ordenada (raíz primero, alfabético), item OPD activo `disabled` con `aria-current="page"`. Click → navega cross-OPD. |
| Banner cobertura | El banner inline `inspector-cobertura-apariencias` se preserva como hint compacto clickeable en tab Semántica que salta a tab Apariciones. |
| Tab Enlaces (entidad) | Placeholder honesto + cobertura cross-OPD; lista detallada in/out de enlaces queda explícitamente fuera de slice según brief §1. |
| Persistencia | `tabInspectorEntidadActivo` y `tabInspectorEnlaceActivo` en `store.uiPanel`, no localStorage. |

Decisiones tomadas: tabs solo texto (peso 700 al activo), sin íconos; divisor con borde inferior sutil sobre la fila completa. 27 unit tests nuevos. Smoke: `e2e/20-inspector-tabs.spec.ts`.

#### Ronda 20 L2 — OPL editor honesto (commits `931c097..4efcffd`, merge `3a05113` + fix `9882daa`)

| Aporte | Implementación |
|---|---|
| Clasificador puro | `opl/clasificadorEdicion.ts` (NUEVO 233 LOC): `clasificarEdicionOpl(texto, preview, modelo)` mapea cada línea a estado `aplicable / no-aplicable / ignorada-vacia / sin-cambio` con razón canónica + cita SSOT. 16 unit tests. |
| Editor honesto | `panelOpl/EditorOplHonesto.tsx` (NUEVO 199 LOC): 4 grupos visuales planos — Texto editado, Sentencias reconocidas, Cambios aplicables, No aplicables. Botón "Aplicar N cambios" con conteo, deshabilitado si N=0. |
| Rail minimizado | Contador estable: "OPL · {N} oraciones · Restaurar" con tipografía mejorada (label semibold + tabular-nums). Preserva testid `panel-opl-restore` y assertions de smoke 03. |
| Surprise documentada | El parser real usa `patches`/`diagnosticos` con `linea: number` ya expuesta, no `cambios`/`errores`. Cero cambios al `parser/tipos.ts`. |
| Decisión de scope | Botón "Aplicar N cambios" vive en footer del editor honesto, no en `panelOpl/Toolbar.tsx`. Evita duplicación. |

Decisiones tomadas: 4 grupos planos (sin `<details>`), stack vertical, línea no aplicable formato `L{N}: {razón} ({cita ≤ 40 chars})`, sin dot indicator en rail. Smoke: `e2e/20-opl-editor-honesto.spec.ts` (4 tests).

#### Ronda 21 L1 — Estado vacío OPM (commits `fe9ef8d`+`dfe071c`, merge `c6036e1`)

| Aporte | Implementación |
|---|---|
| Bloque inicio compacto | `EstadoVacioOpm.tsx` (NUEVO 268 LOC): bloque DISCRETO posicionado `position: absolute, top: lg, left: 50%, transform: translateX(-50%)` dentro del canvas-pane. Título "Iniciar SD" + 3 botones primarios (Crear proceso, Agregar objeto, Agregar agente/instrumento) + secundario "Abrir asistente". |
| Nudge "Conectar como resultado" | Modo separado del bloque: aparece como chip pill bottom-center cuando hay exactamente 1 proceso + 1 objeto + 0 enlaces y `validarFirmaEnlace("resultado", proceso, objeto).ok`. Si firma no legal, fallback a "Tipos válidos" en toolbar. |
| Reuso operacional | Llama a `crearEntidadEnCanvas`, `crearEnlaceEntreEntidades`, `iniciarAsistente`, `posicionLibre` directamente. Cero helpers nuevos en `acciones-canvas.ts` o `acciones-ui.ts`. |
| Tokens-only | Sección comentada en `tokens.ts` documentando los tokens reusados por `EstadoVacioOpm`. Cero hex literales nuevos. |

Decisiones tomadas: bloque dentro del canvas-pane (no overlay separado), nudge solo cuando hay selección clara post-2-entidades, textos breves. 9 unit tests. Smoke: `e2e/21-estado-vacio-opm.spec.ts` con eval `<60s` usando `performance.now()`.

#### Ronda 21 L2 — Responsive como modo revisión (commits `4be4ffe`+`b494a0d`, merge `4e39148`)

| Aporte | Implementación |
|---|---|
| Helper breakpoint | `layoutResponsive.ts` (NUEVO + 56 tests LOC): `resolverBreakpoint(width)` retorna `mobile` (< 640), `tablet` (640-1024), `desktop` (≥ 1024). `useBreakpoint()` con resize listener. |
| Modo revisión mobile | `ModoRevisionMobile.tsx` (NUEVO 147 LOC): tabs **inferiores** (patrón nativo mobile-first) `Canvas / OPDs / OPL / Issues`. Canvas siempre montado; las vistas se renderizan como overlay absoluto (no desmonta JointJS). |
| Branch por viewport | `App.tsx`: rama mobile (section con tabs inferiores) vs desktop/tablet (workbench con grid). En tablet (640-1024) recorta tree (≤ 200 px) e inspector (240 px). |
| Toolbar adaptativa | `ToolbarBase.tsx` oculta `toolbar-actions-pesadas` y acciones secundarias del cluster Modelo en mobile; chip + menú + undo/redo siguen visibles. Resto accesible por `MenuPrincipal` (☰). |
| AvisoEditarEnEscritorio | Texto `"Editar en escritorio o tablet"` en vista Issues mobile cuando se intenta acción de modelado pesado. |
| Surprise documentada | `cambiarVistaMobile` se aloja en `uiPanel.ts` (no `acciones-ui.ts`) por contrato de slice; el typecheck rechazó la opción nominal del brief. Funcionalmente idéntico, brief permitía ambos archivos. |

Decisiones tomadas: tabs inferiores, drawers en tablet, texto del aviso de edición. 13 unit tests. Smoke: `e2e/22-responsive-review.spec.ts`.

### Smoke fix-up bounded post-convergencia (commits `1a314e8`+`ad231f7`+`40635a8`+`2bf9613`)

24 smokes E2E quedaron en regresión post-merge por la reorganización del Inspector en tabs (ronda 20 L1) y el toggle del cluster Vista (ronda 20 L3). El fix-up se hizo en commits dedicados, exclusivamente sobre `app/e2e/` (cero cambios en producción):

| Commit | Aporte |
|---|---|
| `1a314e8` | Smoke `12-toolbar-overflow:19` cota 25 → 26 (justificado por nuevo botón). Movimiento de `SeccionAbanico` del tab Extremos al tab Propiedades en `InspectorEnlace.tsx` (excepción: 1 archivo de producción tocado, cambio mínimo, abanico es propiedad lógica del enlace). |
| `ad231f7` | Smokes que esperaban Descomponer/Desplegar/Tamaño visibles inmediatamente ahora navegan al tab Refinamiento antes (vía helper `irATabRefinamiento`). |
| `40635a8` | Smokes que esperaban mover-puerto/ruta/reanclar/split visibles inmediatamente ahora navegan al tab Extremos antes (vía helper `irATabExtremos`). |
| `2bf9613` | Smokes nuevos `20-inspector-tabs:81` y `22-responsive-review:52` ajustan selectores al contrato real implementado. |

Helpers añadidos en `_smoke-helpers.ts`: `irATabRefinamiento`, `irATabApariciones`, `irATabExtremos`, `irATabEstiloEnlace`, `irATabEstiloEntidad`. `desplegarComoAgregacion` ahora navega al tab por sí sola.

### Ronda 19 / Fase 1 UX (preservado, commit `a99e350`)

| Línea | Implementación |
|---|---|
| **L5 Chip persistencia** | `<ChipPersistencia />` con `Local/Importado/Fixture/Asistente/Nuevo`, versiones, tiempo relativo. Click → Guardar como. |
| **L4 OPD tree primario** | `ArbolOpd` con badges `SD/Inzoom/Unfold`, conteos `o/p/e`, dot de issues, navegación al refinador. |
| **L1 Toolbar intención** | Clusters `Modelo/Modelar/Conectar/Vista/Validar/Ayuda`. ToolbarCreacion solo conecta. Grid/Config/Auto-layout en Vista. |
| **L3 Issues separados** | `PanelMetodologia` agrupa por `Bloqueos/Mejoras/Estilo`. |
| **L2 Modo enlace canvas** | Halo origen, highlight destinos válidos, drag origen→destino, Esc cancela. |

### Fase 0 UX (preservado, commits `f3e0ba4`+`a7dfce4`)

P0-1 identidad de modelo unificada · P0-2 menús mutuamente excluyentes (cierra 14 fallos pre-existentes) · P0-3 AI Text como beta · P0-4 bug capture color neutral · P0-5 auto-layout + fit-to-view · P0-6 "Tipos válidos" persistente.

### Estado anterior consolidado (preservado)

- Ronda 16 / Beta1 (commits `095b112..d834c01`).
- Ronda 18 — Refactor visual chrome 3 pasadas seriales.
- Ronda 15.2 — Schema dual ortogonal de refinamiento.
- Hotfix triple — pre-betas (`e5a0613`+`1e55a72`+`cf289ce`).
- Ronda 20 L4 — Crear estados con nombres reales (`02f652d`).
- Ronda 21 L3 — Eval UX permanente (`f52d958`).
- Fix canvas — zoom suave + doble clic navega refinamiento (`1093845`).

## Bugs Reales Detectados

Durante el smoke fix-up post-convergencia, el agente detectó **3 issues** en producción que no eran tab-related. En la continuidad del 2026-05-08 se cerró el primero (FAB mobile); quedan 2 asuntos para decisión/investigación.

| Bug | Origen | Descripción | Acción sugerida |
|---|---|---|---|
| **FAB "Capturar bug" intercepta tabs mobile** | `CapturadorBugs.tsx` × `ModoRevisionMobile.tsx` | A 390x844 el FAB se superponía a la barra inferior de tabs y bloqueaba hit-testing sobre OPDs/OPL/Issues. | **CERRADO**: `CapturadorBugs` usa `useBreakpoint()` y en mobile eleva `bottom` a `tokens.mobileNav.altoBarra + tokens.spacing.lg`; smoke 22 volvió a clicks reales y verifica que FAB/nav no se solapan. |
| **Tab Inspector se "pegote" cross-acción** | `store.ts` subscriber | Tab activo persistía cross-acción y dejaba inaccesibles secciones de la nueva entidad. | **CERRADO** (`b67eea2`): subscriber en `store.ts` detecta cambio de `seleccionId`/`enlaceSeleccionId` y resetea `tabInspectorEntidadActivo`/`tabInspectorEnlaceActivo` a default (`semantica`/`propiedades`). 3 unit tests + 2 fix-ups de smokes en `05-refinamiento-y-plegado.spec.ts`. |
| **`11-beta1-busqueda` flake (test :149)** | `e2e/11-beta1-busqueda.spec.ts` | Race entre `Control+f` → `setTimeout(focus, 50ms)` en `DialogoBuscarCosas` y `fill()` rápido bajo paralelismo. Reproducido 3/40 con repeat-each=10. | **CERRADO** (`8002edc`): awaits defensivos en spec (esperar `toBeVisible` + `toBeFocused` antes de fill, esperar contador `/aparici/` para confirmar query aplicada). 40/40 verde post-fix. Cero cambios en producción. |

Captura adicional: `docs/bugs/BUG-20260508T080229Z-70e055/` y `BUG-20260508T080332Z-898270/` (capturadas por el operador con el bug capture FAB durante uso vivo, antes del merge; texto "no se desplieguan las mejoras"). Quedaron incluidas en commit `1a314e8` por `git add -A`. Pueden quedar como evidencia o el operador puede gestionar su tracking.

## Decisiones Vigentes

1. **Política tokens-only para chrome UI**: cualquier valor visual de chrome sale de `app/src/ui/tokens.ts`. Cero hex literales nuevos. Paleta canvas (`docs/JOYAS.md`) sigue invariante.
2. **`<details open>` en `Inspector` vacío**: smokes hacen `fill()` sobre `<textarea>` JSON sin selección previa.
3. **Schema dual de refinamiento** (ronda 15.2): consumers usan `obtenerRefinamiento` / `refinaA` / `refinamientosDe`, **nunca** `entidad.refinamiento` directamente.
4. **Unicidad global de nombres canónicos**: enforced en creación y rename.
5. **Delete cross-OPD vs Ocultar apariencia**: semánticas disjuntas.
6. **Smokes > reorganización (regla 5.5 ronda 18)**: cuando un cambio de UX rompe smokes, prevalece el smoke a menos que sea estrictamente necesario por brief. **En r20 L1 el brief mandó tabs explícitamente, así que los smokes se actualizaron al nuevo contrato** vía helpers de tab-navigation en `_smoke-helpers.ts`.
7. **Política de handoff único**: `docs/HANDOFF.md` se reescribe, no se acumulan handoffs paralelos.
8. **Política de no actuar fuera de scope**: bugs descubiertos durante un fix se anotan como reportes nuevos, no se mezclan.
9. **Identidad de modelo SSOT** (Fase 0 P0-1): `etiquetaPestana({ nombre, modeloId })` única fuente de verdad.
10. **Menús primarios mutuamente excluyentes** (Fase 0 P0-2): MenuPrincipal lateral y ToolbarMas no coexisten abiertos.
11. **`solicitudFitToken` como contrato canvas** (Fase 0 P0-5): incrementa al "ordenar canvas"; JointCanvas reacciona con `fitCanvasAPantalla`.
12. **Modal de creación de estados como SSOT** (Ronda 20 L4): la creación de estados pasa por `<ModalCrearEstados />`. Cero `estado1/estado2/estadoN` por defecto.
13. **Eval UX permanente como gate independiente** (Ronda 21 L3): `evaluacion-ux-permanente.mjs` paralelo a `browser:smoke`. Outputs no versionados.
14. **Zoom suave por curva exponencial** (Fix canvas): `exp(−delta·0.00016)` limitado a `[0.99, 1.01]` por evento, con `scaleUniformAtPoint` cuando esté disponible.
15. **Doble clic = navegar a refinamiento** (Fix canvas): doble clic sobre entidad con descomposición navega al OPD hijo. Prioridad descomposición > despliegue cuando coexisten.
16. **Inspector en tabs por intención** (NUEVA — Ronda 20 L1): 5 tabs entidad (`Semántica/Enlaces/Refinamiento/Apariciones/Estilo`) y 3 tabs enlace (`Propiedades/Extremos/Estilo`). Default `Semántica`/`Propiedades`. Tab activo persiste en `store.uiPanel`. Cualquier sección nueva se ubica en el tab de su intención semántica. Nuevos callsites de smoke deben usar helpers `irATab*` antes del lookup.
17. **`SeccionAbanico` vive en Propiedades** (NUEVA — fix post-merge): el operador del abanico (O/XOR) es propiedad lógica del enlace, equivalente a multiplicidad/modificador.
18. **OPL editor honesto en 4 grupos** (NUEVA — Ronda 20 L2): texto editado / sentencias reconocidas / cambios aplicables / no aplicables. Botón "Aplicar N cambios" siempre con conteo. Razones canónicas cerradas (ver `clasificadorEdicion.ts`).
19. **Biblioteca dock acoplable + overlay legacy** (NUEVA — Ronda 20 L3): coexisten en el store con regla de exclusividad: abrir dock cierra overlay. `Ctrl+B` toggle dock. Dock solo desktop (≥ 900 px y `!esMobile && !esTablet`); mobile/tablet mantiene overlay.
20. **Empty state OPM como bloque + nudge** (NUEVA — Ronda 21 L1): bloque inicio compacto cuando 0 apariencias; nudge "Conectar como resultado" cuando 1 proceso + 1 objeto + firma legal + 0 enlaces. NO landing page, NO tutorial mode (EPICA-91 descartada).
21. **Responsive es modo revisión, no compresión** (NUEVA — Ronda 21 L2): `< 640px` → tabs inferiores `Canvas/OPDs/OPL/Issues` con vistas como overlay sobre canvas (no desmonta JointJS). `640-1024px` → tablet con tree/inspector recortados. `≥ 1024px` → workbench desktop sin cambios.
22. **Reset tab Inspector al cambiar selección** (NUEVA — fix 2026-05-11): subscriber en `store.ts` detecta cambios de `seleccionId`/`enlaceSeleccionId` y resetea tab a default. Persistencia se preserva dentro de la misma entidad/enlace. Smokes que ejecutan acciones cross-selección deben re-navegar al tab vía helpers `irATab*`.
23. **Kernel simulación conceptual puro** (NUEVA — Ronda 17 L1): `app/src/modelo/simulacion/{tipos,plan,runner,valores}.ts`. Determinista, no muta el modelo. `planificarSimulacion(modelo, opdId)` ordena procesos por Y ascendente con desempate alfabético es-CL; infiere transiciones de estado de pares consumo↔resultado sobre el mismo objeto. `ejecutarPaso` aplica transiciones + cambios de valor runtime; diagnóstico "no simulable" sin bloquear.
24. **Asignación atributo→atributo Beta2-min** (NUEVA — Ronda 17 L3): el motor de valores soporta solo **asignación** (no fórmulas, no aritmética). Cuando un proceso tiene consumo desde atributo A y resultado a atributo B (ambos con `valorSlot`), el valor runtime de A se copia a B si los tipos coinciden. Diagnósticos: "sin valor runtime", "tipos incompatibles", razón del validador.
25. **BarraSimulacion reemplaza Toolbar en modo simulación** (NUEVA — Ronda 17 L2): cuando `contextoSimulacion !== null`, `<BarraSimulacion />` ocupa el lugar de `<Toolbar />` en `App.tsx`. `readOnly` se fuerza `true` mientras el modo está activo (bloquea `commitModelo` vía mecanismo HU-SHARED-003). Marca de proceso activo es textual ("▶ Nombre"), no overlay JointJS (deuda menor documentada). Botón "Simulación" en cluster Validar del Toolbar.

## Verificación Final Conocida

`main @ aa1b8ef`:

```bash
cd app && bun run check
# 1162 unit pass / 0 fail / 4287 expect() / 113 archivos

cd app && bun run lint
# clean

cd app && bun run build
# index-DiBkIJMj.js 347.79 KB / 90.68 KB gzip
# vendor-jointjs-Cfe4rKV_.js 470.77 KB / 129.72 KB gzip (lazy)

cd app && bun run browser:smoke
# 171 passed / 0 failed
```

Dev server público: `http://138.201.53.205:5173/` (puerto 5173 abierto en ufw, host 0.0.0.0).

Bundle `index.js` evolucionó de 310.85 KB (cierre r19+r20L4+r21L3+fix canvas) → 343.20 KB (+32.35 KB) por las 5 líneas de la convergencia (modal estados ya estaba). El cap declarado era 340 KB; quedamos 3.2 KB sobre, dentro del margen relajado del fix-up (≤ 345 KB). Optimización pendiente como deuda menor.

> Nota: `bun test` (sin scope) no debe correrse: el config no excluye `e2e/` y reportará falsos fallos al cargar specs Playwright como tests unitarios. Usar siempre `bun run check` (que delega en `bun test src`).

## Pendientes Y Supuestos

### Beta2 cerrada salvo L4

- L1 kernel (`041e0e4`): `tipos.ts` + `plan.ts` + `runner.ts` + 20 unit tests.
- L3 valores (`b213a02`): `valores.ts` + 9 unit tests adicionales; integrado en runner.
- L2 UI (`aa1b8ef`): `store/simulacion.ts` + `ui/simulacion/BarraSimulacion.tsx` + botón en `ToolbarBase` + 2 smokes nuevos. Cota toolbar relajada 26→27.

**L4 (eval Beta2 sobre dominio ancla)** queda intacta en `docs/instrucciones-lineas-dev/ronda17/linea-4-eval-beta2-dominio-ancla.md`. Supone que el operador cierre Beta1 con dominio ancla real (HODOM-HSC u otro) antes de ejecutarse.

### Deuda viva no bloqueante

| Item | Origen | Sugerencia |
|---|---|---|
| Bundle `index.js` 347.79 KB > cap 345 KB del fix-up r20 | Convergencia r20+r21+r17 | Optimización menor; tree-shake o lazy split adicional. |
| BarraSimulacion marca proceso activo textual (no overlay JointJS) | Ronda 17 L2 Beta2-min | Render overlay sobre canvas en futura iteración. |
| `linkPickerLabel` huérfano en `toolbarStyles.ts` | Ronda 18 P3 | Limpieza no aditiva en próxima micro-ronda. |
| `mask-image` affordance scroll horizontal Toolbar | Ronda 15 L1/L2 | Polish post-Fase 1. |
| Canvas `role="application"` no reintroducido | Ronda 15 L1/L4 | Requiere migrar helpers `getByRole("img")` en bloque. |
| FAIL eval `dialogo-biblioteca` / `dialogo-menu-principal` | Ronda 15 L3 | Refinar criterios. |
| HU-13.005 duplicate-id en dashboard legado | Anterior | Sin bloqueo. |
| `bun test` sin scope rompe por incluir `e2e/` | Config | Considerar `testMatch` explícito en `package.json`. |
| Tab "Enlaces" entidad placeholder | Ronda 20 L1 | Implementar lista in/out detallada en futura ronda. |
| Worktrees + branches `worktree-agent-*` | Convergencia | Limpiar cuando operador autorice. |

### Riesgos

1. **`main` sincronizado con `origin/main`** en `aa1b8ef`; loop verde.
2. **Beta1 (ronda 16)** ejecutada pero sin eval real con dominio ancla cerrado — L4 r17 depende de esto.
3. **Schema dual de refinamiento**: consumers nuevos usan helpers, no acceso directo.
4. **Identidad de modelo unificada**: callsites nuevos usan `etiquetaPestana`.
5. **Modal de estados**: nuevos callsites usan `<ModalCrearEstados />`, no genéricos.
6. **Doble clic canvas**: navegar refinamiento prioriza descomposición.
7. **Inspector tabs**: smokes nuevos deben navegar al tab correcto vía helpers `irATab*`. Acciones cross-selección resetean el tab a default — re-navegar antes de buscar.
8. **Biblioteca dock**: callsites nuevos usan `bibliotecaDockAbierto` + `toggleBibliotecaDock`. Mobile/tablet mantiene overlay legacy.
9. **Mobile mode**: `< 640px` es revisión/navegación, NO modelado pesado. Nuevos componentes deben respetar `useBreakpoint()`.
10. **Modo simulación**: bloquea edición vía `readOnly` (mecanismo HU-SHARED-003 existente). Nuevos slices con mutaciones que NO pasen por `commitModelo` deben respetar `contextoSimulacion !== null` explícitamente.

## Próximos Pasos Operativos

1. **Conducir eval Beta1 dominio real** (HODOM-HSC u otro): pre-requisito para Ronda 17 L4.
2. **Ejecutar Ronda 17 L4** (eval Beta2 sobre dominio ancla) una vez Beta1 cerrada con dominio real.
3. **Pulido visual modo simulación**: render overlay JointJS para marca de proceso activo (deuda menor).
4. **Optimización bundle**: bajar `index.js` de 347.79 KB a ≤ 345 KB (deuda menor).
5. **Mantener loop verde** antes de cualquier commit nuevo:
   - `cd app && bun run check`
   - `cd app && bun run lint`
   - `cd app && bun run build`
   - `cd app && bun run browser:smoke`

## Prompt De Continuación Breve

Usa `docs/HANDOFF.md` como memoria única. Estado: `main @ aa1b8ef` sincronizado con `origin/main`. Loop verde 100%: 1162 unit / 171 smoke / build `index.js` 347.79 KB. **Rondas 19 + 20 + 21 cerradas** sobre el informe UI/UX 2026-05-07 (Fase 0+1+2). **Ronda 17 / Beta2 L1+L2+L3 cerrada** en sesión 2026-05-11 (kernel determinista + valores simples runtime + UI modo simulación). **2 bugs reales cerrados**: tab Inspector pegote (subscriber en `store.ts`) y flake busqueda (awaits defensivos en spec). **Pendiente de operador**: conducir eval Beta1 con dominio ancla real (HODOM-HSC) → habilita Ronda 17 L4. 25 decisiones vigentes (ver §"Decisiones Vigentes"); las 4 nuevas: 22-Reset tab Inspector cross-selección, 23-Kernel simulación puro, 24-Asignación atributo→atributo Beta2-min, 25-BarraSimulacion reemplaza Toolbar.
