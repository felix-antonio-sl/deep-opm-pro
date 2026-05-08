# HANDOFF — Corte post-Fase 0 UX (informe UI/UX 2026-05-07)

**Fecha**: 2026-05-08
**Repositorio**: `deep-opm-pro`
**Rama**: `main`
**HEAD**: `a7dfce4`
**Corte**: cierre de Fase 0 del informe UI/UX 2026-05-07. Identidad de modelo unificada, menús mutuamente excluyentes, AI Text como beta, bug capture color neutral, auto-layout con fit-to-view, "Tipos válidos" persistente al cambiar selección en canvas. Beta1 (ronda 16) ya estaba ejecutada; Fase 1 UX (ronda 19) está empacada como briefs paralelos pero **no ejecutada**.

## Política De Handoff Único

`docs/HANDOFF.md` es la única memoria de traspaso vigente del proyecto. Este archivo **reemplaza** y consolida el handoff anterior. No crear handoffs paralelos, fechados ni duplicados.

## Contexto Normativo

El modelador OPM vive en `app/` con Bun + Vite + Preact + Zustand + JointJS OSS. La arquitectura sigue siendo propia: no Angular, no Firebase, no Rappid.

Autoridad semantica:

- SSOT OPM/ISO 19450: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`
- Evidencia operacional OPCloud: `opm-extracted/`
- Evidencia visual canónica: `assets/svg/`, `assets/png/`, `docs/JOYAS.md`
- Backlog vivo: `docs/historias-usuario-v2/`
- Auditoría UX vigente: `docs/audits/opm-app-ux-2026-05-07/informe-final-ui-ux.md` (intocable, evidencia histórica)
- Corte operativo vivo: `docs/roadmap/cortes-operativos.md`

Regla viva: OPCloud operacionaliza OPM, pero no redefine la semantica. Antes de crear una solucion nueva, revisar SSOT, `assets/`, `docs/JOYAS.md` y `opm-extracted/`.

## Estado Ejecutivo

`main` está en `a7dfce4`, **2 commits adelante de `origin/main`** (no pusheados todavía):

1. **Fase 0 UX bundle** (`a7dfce4`): cierra P0-2..P0-6 del informe UI/UX 2026-05-07 + corrige bug derivado de duplicación de MenuPrincipal.
2. **P0-1 identidad de modelo** (`f3e0ba4`): unifica etiqueta de pestaña con nombre real del modelo (header + pestaña + selector consistentes).

Loop verde sobre `main @ a7dfce4`:

- `bun run check` → **977 unit pass / 0 fail / 3880 expect()**
- `bun run lint` → clean
- `bun run build` → `index.js` 284 KB (gzip 75 KB)
- `bun run browser:smoke` → **149 passed / 0 fail / 0 skipped** (cierra los 5 skips de TablaEnlaces y los 14 fallos preexistentes de Beta1)
- Working tree limpio. Solo branch `main`. Cero worktrees auxiliares.

Próximas rondas disponibles:

- **Ronda 19 / Fase 1 UX** (NUEVO): `docs/instrucciones-lineas-dev/ronda19/` — 5 líneas paralelas para el reordenamiento estructural del informe UI/UX (toolbar agrupada, modo enlace canvas, issues separados, OPD tree con badges, chip persistencia). **Diseñada pero no ejecutada**.
- **Ronda 17 / Beta2**: `docs/instrucciones-lineas-dev/ronda17/` — simulación conceptual + valores simples. **Diseñada pero no ejecutada**. Supone dominio ancla cerrado por Beta1.

## Memoria Consolidada Del Corte

### Fase 0 UX (commits `f3e0ba4` + `a7dfce4`)

Cierre de las 6 acciones críticas del informe `docs/audits/opm-app-ux-2026-05-07/informe-final-ui-ux.md` §"Plan viable de remediacion §Fase 0 - Limpieza critica, 1 a 2 dias".

| ID | Acción | Implementación | Verificación |
|---|---|---|---|
| **P0-1** | Identidad de modelo unificada | Helper `etiquetaPestana({ nombre, modeloId })` como SSOT. `crearPestanaDesdeModelo`, `runtime.estadoModelo`, `sincronizarPestanaActivaEnLista` lo consumen. `abrirPestanaImportandoJson` propaga `resultado.value.nombre`. `duplicarPestana` mantiene nombre real. | 6 unit tests nuevos + smoke 01:220 actualizado (count 1→2 reflejando consistencia) |
| **P0-2** | Menús mutuamente excluyentes | `toolbarMasAbierto: boolean` global. Acciones `abrirMenuPrincipal()` y `fijarToolbarMasAbierto(true)` cierran el contrario. ToolbarMas migrado de `useState` local a store. **Bug derivado**: MenuPrincipal estaba duplicado en DOM (App.tsx + ToolbarBase). Removido del ToolbarBase. | 1 unit test + smoke 01:81 ahora verde |
| **P0-3** | AI Text como beta | Botón `panel-opl-ai-text` con `data-beta`, opacidad 0.55, badge "beta" pill, tokens `chromeNeutral`. testid + onClick preservados (smoke 03:297). aria-label simplificado a "AI Text". | smoke 03:297 verde |
| **P0-4** | Bug capture color neutral | FAB `bug-capture-open` cambia de `errorBase` (rojo) a `acentoUi` (azul) sobre `fondoChrome`. Icono "!" reemplazado por SVG inline de bocadillo de feedback. aria-label "Capturar bug" preservado por regla 5.5 ronda 18. | smokes 10-capturador-bugs verdes |
| **P0-5** | Auto-layout + fit-to-view | Counter monotono `solicitudFitToken: number` en store. `aplicarLayoutSugerido` incrementa al confirmar éxito; JointCanvas observa con useEffect y llama `fitCanvasAPantalla` en requestAnimationFrame. Token=0 inicial no dispara fit. | 2 unit tests nuevos |
| **P0-6** | "Tipos válidos" persistente | Listener pointerdown de `MenuTipoEnlace` excluye clicks dentro de `[data-testid="canvas-pane"]`. Antes el menú se cerraba al seleccionar la 2da cosa, perdiendo la promesa de preview OPL. Esc y click fuera del canvas siguen cerrando. | smokes existentes pasan; preview OPL ya estaba implementado en `MenuTipoEnlace.previewOpl` desde antes |

### Cambios físicos consolidados

```
13 files, +213 / -23 sobre commit `d834c01`:
  app/e2e/01-carga-y-workspace.spec.ts        +6 -1
  app/src/render/jointjs/JointCanvas.tsx      +20 -1
  app/src/store/modelo.test.ts                +27 -0
  app/src/store/modelo/acciones-canvas.ts     +14 -2
  app/src/store/modelo/acciones-ui.ts         +12 -0
  app/src/store/sliceTypes.ts                 +3 -0
  app/src/store/tipos.ts                      +22 -0
  app/src/store/uiPanel.test.ts               +28 -0
  app/src/store/uiPanel.ts                    +2 -0
  app/src/ui/CapturadorBugs.tsx               +28 -7
  app/src/ui/panelOpl/Toolbar.tsx             +37 -3
  app/src/ui/toolbar/ToolbarBase.tsx          +14 -7
  app/src/ui/toolbar/ToolbarCreacion.tsx      +10 -0
  app/src/ui/toolbar/ToolbarMas.tsx           +13 -1
  app/src/store/pestanas.ts                   +47 -3
  app/src/store/pestanas.test.ts              +60 -1
  app/src/store/runtime.ts                    +15 -2
```

### Hallazgo crítico inesperado

Al correr smoke en baseline para distinguir fallos pre-existentes vs introducidos por mí, descubrí que **14 smokes fallaban antes de mi trabajo**:

- 4 fallos de TablaEnlaces (`11-beta1-tabla-enlaces`, `15-superficie-contextual`) — causados por el bug de **MenuPrincipal duplicado en DOM** (`role="menu"` aparecía 2 veces). El bug venía del commit `4f7dc66 fix(menu-principal): monta MenuPrincipal en App.tsx para que el boton ≡ abra el menu lateral`, que añadió la instancia a App.tsx **sin remover** la lazy de ToolbarBase.
- 4 fallos de plantillas y archivados (`08-mvp-alpha-residual`) — mismo síntoma derivado.
- 1 fallo de workspace local (`01:81`) — mismo síntoma.
- 5 fallos varios reseteados al limpiar la duplicación.

El fix de `ToolbarBase.tsx` (removí el `MenuPrincipalLazy` y su useState/useEffect) cierra los 14 fallos de un solo cambio. **Resultado neto**: la suite smoke pasó de 132 pass / 14 fail / 5 skip → **149 pass / 0 fail / 0 skip**.

Este hallazgo NO estaba en el informe UI/UX original como tal, pero es **directamente causado por el patrón P0-2** que el informe sí señala (menús que coexisten). Lo documento aquí porque cambia la salud del proyecto: estado smoke verde 100% por primera vez post-Beta1.

### Estado anterior consolidado (preservado)

#### Ronda 16 / Beta1 (commits `095b112..d834c01` previos a Fase 0 UX)

| Linea | Aporte | Commits clave |
|---|---|---|
| L1 TablaEnlaces workbench | Inspeccion/edicion canonica de enlaces cross-OPD | `6eceaef` `f346b7a` |
| L2 Búsqueda intra-modelo | Ctrl+F, apariciones, OPL sync | `095b112` `53f55b8` |
| L3 Validación metodológica | Avisos accionables con citas SSOT | `119e007` `47e786c` |
| L4 Catálogo + anclas | Fixtures Beta1 cargables | `43ac824` `469d3b3` |

Hotfixes post-Beta1 (commits previos a Fase 0):

- `4f7dc66` mount MenuPrincipal en App.tsx (introdujo bug duplicación, ya cerrado en Fase 0).
- `96d671d` portal a body para menú Más (cerrado bug `BUG-9e8ac5`).
- `edfbc68` redisena autolayout siguiendo OpmVisualThing OPCloud (cerrado bug `BUG-a0dc5f` + relacionados `BUG-e749eb`, `BUG-40280f`).
- `554d0ca` enlaces a estados con id+selector y z=20 (cerrado bug `BUG-1fc4d2`).
- `d834c01 debugeo` añade bugs nuevos a docs (sin código).

#### Ronda 18 — Refactor visual chrome (3 pasadas seriales mergeadas)

Línea única L1 con tres pasadas en archivos disjuntos. Cierra `BUG-20260507T212356Z-692129`.

- **P1** (`a536578` + merge `fe6fa5f`): `Inspector` vacío rediseñado con jerarquía; `<PersistenciaJson />` envuelto en `<details open>` cuando inspector vacío.
- **P2** (`69b6b30` + merge `549e49e`): cabecera del panel OPL en tres clusters separados por dividers — chrome (▾, ↔), display (123, AI, Editar), consulta (búsqueda, Copiar, HTML).
- **P3** (`cd9c87b` + merge `dd5ba9a`): toolbar superior en cinco clusters por intención — Crear · Historia · Modelo · Enlace · Vista. **Fase 0 actual amplía esto**: el cluster Vista necesita ser independiente del Modelar, y se agruparán por intención completa en ronda 19 / L1.

#### Ronda 15.2 — Schema dual ortogonal de refinamiento

Cierre semántico de la ortogonalidad descomposición/despliegue. 6 commits (`a3bc6de..0e6cec4`). Schema migra de **coproducto exclusivo** a **producto parcial indexado por tipo**; migración legacy es funtor faithful; aciclicidad V-220/V-221 preservada por construcción.

#### Hotfix triple — pre-betas

- `e5a0613` Delete cross-OPD (BUG-91e001) + unicidad global de nombres (BUG-13c786).
- `1e55a72` menú Tipos válidos cierra con Escape/click fuera (BUG-13e330).
- `cf289ce` ajuste smoke agregacion-triangulo.

## Bugs Cerrados En Este Ciclo

| Bug | Cerrado por | Lectura operativa |
|---|---|---|
| `BUG-20260508T013350Z-ad652b` | `4f7dc66` (previo) + cleanup en Fase 0 P0-2 | Menu lateral no se abria (faltaba mount). Posteriormente, MenuPrincipal duplicado en DOM también arreglado en P0-2 (commit `a7dfce4`). |
| `BUG-20260508T013456Z-9e8ac5` | `96d671d` (previo) | Menú Más no se veía completo (clipping por overflow ancestro). |
| `BUG-20260508T013631Z-a0dc5f` | `edfbc68` (previo) | Autolayout horrible — rediseño siguiendo OPCloud. |
| `BUG-20260508T015103Z-e749eb` | `edfbc68` (previo) | Autolayout despliegue mete todo dentro como inzoom. |
| `BUG-20260508T015138Z-40280f` | `edfbc68` (previo) | Autolayout inzoom amontona izquierda. |
| `BUG-20260508T020740Z-1fc4d2` | `554d0ca` (previo) | Enlaces a estados detrás del objeto (z-index). |
| **Bug derivado P0-2** | `a7dfce4` (Fase 0) | MenuPrincipal duplicado en DOM rompía 14 smokes. No tenía bug-id propio porque se descubrió como side effect del audit Fase 0. |

Reportes versionados bajo `docs/bugs/`. Los 6 bugs del 2026-05-08 estaban capturados como evidencia visual con payload + screenshots, pero ya estaban arreglados por commits previos (verificado por mí en este corte).

## Decisiones Vigentes

1. **Política tokens-only para chrome UI**: cualquier valor visual de chrome (no canvas) sale de `app/src/ui/tokens.ts`. Cero hex literales nuevos. Paleta canvas (`docs/JOYAS.md`) sigue invariante.
2. **`<details open>` en `Inspector` vacío**: smokes hacen `fill()` sobre `<textarea>` JSON sin selección previa; `<details>` cerrado provoca `display:none` y timeout.
3. **Schema dual de refinamiento** (ronda 15.2): una entidad puede tener simultáneamente descomposición y despliegue.
4. **Unicidad global de nombres canónicos** (ronda hotfix triple): enforced en creación y rename.
5. **Delete cross-OPD vs Ocultar apariencia** (ronda hotfix triple): semánticas disjuntas y documentadas.
6. **Smokes > reorganización (regla 5.5 ronda 18)**: cuando un cambio de UX rompe smokes, prevalece el smoke a menos que sea estrictamente necesario por brief. Aplicado en Fase 0 P0-3 (aria-label "AI Text" preservado), P0-4 (aria-label "Capturar bug" preservado).
7. **Política de handoff único** (sin cambio): `docs/HANDOFF.md` se reescribe, no se acumulan handoffs paralelos.
8. **Política de no actuar fuera de scope** (sin cambio): bugs descubiertos durante un fix se anotan como reportes nuevos, no se mezclan con el commit del fix en curso.
9. **Identidad de modelo SSOT** (NUEVA — Fase 0 P0-1): el helper `etiquetaPestana({ nombre, modeloId })` es la única fuente de verdad para etiqueta de pestaña + header. Cualquier nuevo callsite debe usarlo, no replicar la lógica.
10. **Menús primarios mutuamente excluyentes** (NUEVA — Fase 0 P0-2): MenuPrincipal lateral y ToolbarMas (⋯ Más) no pueden coexistir abiertos. State global `menuPrincipalAbierto` + `toolbarMasAbierto` con sincronización en acciones del store. NO añadir nuevos menús primarios sin participar de esta exclusividad.
11. **`solicitudFitToken` como contrato canvas** (NUEVA — Fase 0 P0-5): cualquier acción del store que deje el canvas en estado "ordenado pero potencialmente fuera de viewport" debe incrementar `solicitudFitToken`. JointCanvas reacciona con `fitCanvasAPantalla`.

## Verificacion Final Conocida

`main @ a7dfce4`:

```bash
cd app && bun run check
# 977 unit pass / 0 fail / 3880 expect() / 94 files

cd app && bun run lint
# clean

cd app && bun run build
# index-BtHvCJrB.js 284 KB / 75 KB gzip
# vendor-jointjs-Cfe4rKV_.js 470 KB / 130 KB gzip (lazy)

cd app && bun run browser:smoke
# 149 passed / 0 fail / 0 skipped (PRIMERA VEZ smoke 100% verde post-Beta1)
```

Dev server público: `http://138.201.53.205:5173/` (puerto 5173 abierto en ufw, host 0.0.0.0).

Bundle `index.js` subió de 260 KB → 284 KB (+24 KB) por Fase 0: principalmente tests añadidos + helper `etiquetaPestana` + acciones de store + chip beta + handler fit-to-view + coordinación menus. Sigue dentro del umbral del proyecto.

## Pendientes Y Supuestos

### Ronda 19 / Fase 1 UX — diseñada, NO ejecutada

`docs/instrucciones-lineas-dev/ronda19/` empaca **5 líneas paralelas** para el reordenamiento estructural del informe UI/UX 2026-05-07 §Fase 1:

| ID | Título | Riesgo | Tamaño estimado | Orden de merge |
|---|---|---|---|---|
| L5 | Chip de persistencia visible | bajo | S (<2h) | 1° |
| L4 | OPD tree como navegación primaria con badges | bajo | M (2-6h) | 2° |
| L1 | Toolbar agrupada por intención (6 clusters) | bajo | M | 3° |
| L3 | Issues separados por severidad | medio | M | 4° |
| L2 | Modo enlace con estado canvas | **alto** | L (>6h) | 5° (worktree) |

Decisión de orden: del README ronda19. L2 va al final por blast radius alto (toca canvas + render).

### Fase 2 informe UX — sin briefs aún, fuera de ronda 19

El informe propone Fase 2 (Inspector + OPL como producto serio):

- Inspector en tabs `Semántica / Enlaces / Refinamiento / Apariciones / Estilo`.
- Creación de estados con nombres reales y preview OPL.
- Biblioteca dockable o integrada con OPD tree.
- Editor OPL con cambios aplicables vs no aplicables separados.

Esto es 2-3 semanas de trabajo y se empaca en **ronda 20** cuando el operador lo decida. **NO** se ejecuta en este corte.

### Fase 3 informe UX — evals UX permanentes

- Fixtures chico/mediano/grande.
- Screenshots de regresión por viewport.
- Métricas de tiempo y fallos.

Tarea de continuidad, no requiere ronda dedicada; va a `app/scripts/` y `docs/audits/regresion/` como infraestructura.

### Beta2 (ronda 17) — diseñada, NO ejecutada

`docs/instrucciones-lineas-dev/ronda17/` empaca cuatro líneas para simulación conceptual + valores simples. Sin cambios desde el corte anterior.

### Deuda viva no bloqueante

| Item | Origen | Sugerencia |
|---|---|---|
| `linkPickerLabel` huérfano en `toolbarStyles.ts` | Ronda 18 P3 | Limpieza no aditiva en próxima micro-ronda. |
| `mask-image` affordance scroll horizontal Toolbar no reintroducida | Ronda 15 L1/L2 | Polish post-Fase 1. |
| Canvas `role="application"` no reintroducido | Ronda 15 L1/L4 | Requiere migrar helpers `getByRole("img")` en bloque. |
| FAIL eval `dialogo-biblioteca` / `dialogo-menu-principal` | Ronda 15 L3 | Refinar criterios. |
| HU-13.005 duplicate-id en dashboard legado | Anterior | Sin bloqueo. |

### Riesgos

1. **2 commits ahead de origin** sin pushear (Fase 0). El push controlado se hace cuando el operador lo autorice.
2. **Smoke 100% verde por primera vez post-Beta1** — esto es positivo pero también significa que cualquier nueva regresión será inmediatamente visible. Mantener disciplina de loop verde.
3. **Beta1 (ronda 16)** está ejecutada pero no ha pasado eval real con dominio ancla cerrado. Las precondiciones están sostenidas.
4. **Schema dual de refinamiento**: cualquier consumer nuevo debe usar helpers `obtenerRefinamiento` / `refinaA` / `refinamientosDe`, **nunca** acceder a `entidad.refinamiento` directamente.
5. **Identidad de modelo unificada**: cualquier código nuevo que toque etiquetas de pestaña debe usar `etiquetaPestana({ nombre, modeloId })` y NO replicar la lógica.

## Proximos Pasos Operativos

1. **Operador decide** push de los 2 commits de Fase 0 a `origin/main`.
2. **Operador decide** ejecución de ronda 19 (Fase 1 UX). Recomendación de orden: L5 → L4 → L1 → L3 → L2. L2 en worktree.
3. **Mantener loop verde**:
   - `cd app && bun run check`
   - `cd app && bun run lint`
   - `cd app && bun run build`
   - `cd app && bun run browser:smoke`
   - `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real`
4. **Antes de abrir ronda 19**:
   - Considerar si las HU nuevas que cada brief declara (HU-90.001, HU-10.001, HU-50.001, HU-30.001, HU-30.020, etc.) deben crearse formalmente en `docs/historias-usuario-v2/` antes de ejecutar.
   - Decidir si Beta1 dominio ancla real cierra ANTES de Fase 1 UX (recomendación: paralelo, sin dependencia).

## Prompt De Continuacion Breve

Usa `docs/HANDOFF.md` como memoria única. Estado: `main @ a7dfce4`, 2 commits ahead de origin (no pusheados) con cierre Fase 0 UX del informe `docs/audits/opm-app-ux-2026-05-07/informe-final-ui-ux.md`. Loop verde 977 unit / 149 smoke / build 284 KB. Ronda 16 Beta1 ya ejecutada; **ronda 19 / Fase 1 UX (5 líneas paralelas)** está diseñada como briefs en `docs/instrucciones-lineas-dev/ronda19/` con orden L5 → L4 → L1 → L3 → L2 (L2 en worktree). Identidad de modelo unificada vía helper `etiquetaPestana`. Menús primarios mutuamente excluyentes. Auto-layout hace fit-to-view. AI Text marcado beta. Bug capture en color neutral. "Tipos válidos" persiste durante selección en canvas.
