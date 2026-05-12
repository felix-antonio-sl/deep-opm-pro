# HANDOFF — Cierre Inspector resizable + 4 bugs nuevos sin atender

**Fecha**: 2026-05-12
**Repositorio**: `deep-opm-pro`
**Rama**: `main`
**HEAD**: `<commit de cierre>` (este commit). Base previa `7982e91` (`fix(modelo): encajar creaciones inzoom en contorno`, commit local del operador del 2026-05-11/12).
**Origin previo al cierre**: 3 commits adelante de `origin/main`.
**Corte**: cierre de continuidad post-Beta2 que (a) entrega Inspector lateral derecho resizable cerrando BUG-696858, (b) descarta la "regresión 3 smokes" como flake de contención de worktrees, (c) cancela L5 Beta1 (HODOM-HSC) y R17 L4 sin trabajo conservado en main, y (d) captura 4 bugs nuevos no atendidos del 2026-05-11 noche.

## Política De Handoff Único

`docs/HANDOFF.md` es la única memoria de traspaso vigente del proyecto. Este archivo **reemplaza** y consolida el handoff anterior. No crear handoffs paralelos, fechados ni duplicados.

## Contexto Normativo

El modelador OPM vive en `app/` con Bun + Vite + Preact + Zustand + JointJS OSS. Arquitectura propia: no Angular, no Firebase, no Rappid.

Autoridad semántica:

- SSOT OPM/ISO 19450: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`
- Evidencia operacional OPCloud: `opm-extracted/`
- Evidencia visual canónica: `assets/svg/`, `assets/png/`, `docs/JOYAS.md`
- Backlog vivo: `docs/historias-usuario-v2/`
- Auditoría UX vigente: `docs/audits/opm-app-ux-2026-05-07/informe-final-ui-ux.md`
- Corte operativo vivo: `docs/roadmap/cortes-operativos.md`

## Estado Ejecutivo

`main @ <commit de cierre>`, 3 commits adelante de `origin/main` antes del push del cierre. Trabajo nuevo desde el HANDOFF anterior (`aa1b8ef`):

1. **Halo visual modo simulación** (`27654b0` halo verde proceso activo + dorado estados current; `c11d88c` fallback al primer estado como current cuando no hay designación) — pulido visual Beta2 L2.
2. **Fix encaje inzoom** (`7982e91` `fix(modelo): encajar creaciones inzoom en contorno`) — commit local del operador del 2026-05-11/12.
3. **Inspector resizable** (`404bc49` merge en este corte): `DivisorPanel` invertible aplicado al pane derecho. Estado `anchoPanelInspector` en `indice.preferenciasUi` (espejo de `anchoPanelArbol`), con min 240 / max 560 / inicial 300. Smoke nuevo `23-inspector-resize.spec.ts` (drag, persistencia, dblclick reset). Cierra **BUG-20260511T225343Z-696858**.

Loop verde sobre `main @ <commit de cierre>`:

- `bun run check` → **1166 unit / 0 fail / 4306 expect()** / 113 archivos
- `bun run lint` → clean
- `bun run build` → `index.js` **348.56 KB / 90.94 KB gzip** (vendor JointJS lazy 470 KB sin cambio). Sigue 3.56 KB sobre cap fix-up r20 (345 KB), dentro del orden de magnitud aceptado.
- `bun run browser:smoke` → **172 passed / 0 fail / 0 skip** (+1 sobre 171 HANDOFF, el `23-inspector-resize`).

### "Regresión 3 smokes" descartada como flake

Durante el repaso del 2026-05-12 se observó `170 pass / 3 fail` (`07-enlaces-avanzados HU-11 inspector`, `08-mvp-alpha-residual L4-m`, `08-mvp-alpha-residual L4-b`). El diagnóstico atribuyó la falla al halo verde/dorado. La investigación dedicada concluyó:

- Los 4 halos (`composers/halos.ts`) ya tienen `pointer-events: none`.
- Smoke completo sobre `7982e91` y `c11d88c` aislado: **171 pass / 0 fail**.
- Causa real del falso fail: **contención de 3 worktrees corriendo dev servers Vite simultáneamente en :5173**. Timeouts de click se cascadeaban entre suites. Reproducción descartada.

Decisión: **no commit, no patch cosmético**. El issue está cerrado por análisis (ship-discipline: no se fixea lo que no falla). Si el smoke real falla con esos tres tests aislados en main limpio, retomar como bug real.

### L5 Beta1 (HODOM-HSC) y R17 L4 cancelados sin trabajo conservado

El operador inició L5 Beta1 con dominio real HODOM-HSC del Hospital de San Carlos (alcance "Solo unidad núcleo", conducción "Tú decides, yo modelo"). El agente de delegación produjo 3 commits limpios sobre `7982e91` (`3fb48db` HEAD reportado) antes de ser cancelado a pedido del operador con `cerremos hasta aquí`. **El trabajo NO entró a main**. Branch borrada; los commits siguen vivos en reflog hasta GC (~30 días) para recuperación eventual.

R17 L4 (eval Beta2 sobre dominio ancla) quedó como pendiente original — depende de cerrar L5.

## Memoria Consolidada Del Corte

### Inspector resizable (BUG-696858) — commit `404bc49`, merge en este corte

| Aporte | Implementación |
|---|---|
| Constantes runtime | `app/src/store/runtime.ts`: `ANCHO_PANEL_INSPECTOR_DEFAULT=300/MIN=240/MAX=560` + `limitarAnchoPanelInspector` + chequeo en `esPreferenciasUi`. |
| Store aditivo | `store/tipos.ts`, `sliceTypes.ts`, `modelo/tipos/ui.ts`: campos `anchoPanelInspector` + `fijarAnchoPanelInspector`. `store/uiPanel.ts`: estado inicial + acción con persistencia espejo a `anchoPanelArbol` (vía `indice.preferenciasUi`, no localStorage adicional). |
| `DivisorPanel` invertible | `app/src/ui/divisorPanel.tsx`: props opcionales `invertirDelta`, `resetValue`, `testId`, `title`, `gridArea` (default-preserving). |
| Montaje canvas-pane→inspector | `app/src/ui/App.tsx`: monta `<DivisorPanel testId="divisor-panel-inspector" invertirDelta gridArea="divisorInspector"/>` cuando `inspectorAbierto && !esMobile`. `workbenchStyle` agrega columna `divisorInspector` 6px; tablet acota al default vía `anchoPanelInspectorLayout`. |
| Smoke | `app/e2e/23-inspector-resize.spec.ts`: drag, persistencia entre recargas, dblclick reset. |
| Unit | `app/src/store.test.ts` aditivo: clamp `[240, 560]`. |

Decisión: persistencia en `indice.preferenciasUi` (que sí escribe a localStorage), no key localStorage nueva. Política viva consistente con `anchoPanelArbol`.

### Halo visual modo simulación (preservado del HANDOFF anterior, ya en main)

- `27654b0` `feat(simulacion)`: halo verde sobre proceso activo + dorado sobre estados current. SVG sobre canvas con `pointer-events: none`.
- `c11d88c` `fix(simulacion)`: fallback al primer estado como current cuando no hay designación inicial.

### Estado anterior consolidado (preservado)

- **Beta2 r17 L1+L2+L3** (`041e0e4`+`b213a02`+`aa1b8ef`).
- **2 bugs reales pre-Beta2** (`b67eea2` tab Inspector pegote, `8002edc` flake busqueda).
- **Rondas 19 + 20 + 21** cerradas sobre el informe UI/UX 2026-05-07 (Fase 0 + Fase 1 + Fase 2 + cierre residual).
- **Ronda 16 / Beta1** (TablaEnlaces + búsqueda + validación + catálogo Préstamo Bibliotecario) sin eval real con dominio ancla.
- **Ronda 18** refactor visual chrome.
- **Ronda 15.2** schema dual ortogonal de refinamiento.
- Hotfixes pre-betas + fixes 2026-05-08 (menú principal, toolbar Más portal, autolayout OPCloud, enlaces a estados id+selector).

## Bugs Capturados Nuevos Sin Atender (2026-05-11 noche)

El operador capturó **4 bugs** entre 23:00 y 23:32 del 2026-05-11 que NO se atendieron en esta sesión. Sus reportes viven untracked en `docs/bugs/` y se commitean en este corte como evidencia.

| ID | Hora | Texto del operador |
|---|---|---|
| `BUG-20260511T230050Z-365788` | 23:00 | "los enlaces de invocación tienen su dirección o sentido al revés. en vez de apuntar desde el proceso que desencadena al que es desencadenado, está al revés. corrígelo por favor" |
| `BUG-20260511T232341Z-02b906` | 23:23 | "cuando hay algo que se refina con enlaces estructurales y se desplazan en el diagrama al desplazar y soltar los hijos se aglomeran sobre el padre como si fuesen metales que se desplazan a un imán" |
| `BUG-20260511T232603Z-1c2cc0` | 23:26 | "y esto pasa cuando aplico autolayout a un padre y sus hijos derivados de enlaces estructurales" |
| `BUG-20260511T233234Z-029d2b` | 23:32 | "mira que maraña de líneas. esto no esta bien. necesito que lo mejores" |

Hipótesis preliminares (NO investigadas en esta sesión):

- **365788** sugiere inversión de dirección en composer del enlace `invocacion` o en la operación de creación. Verificar `composers/enlace.ts` y `modelo/operaciones/enlace*.ts` para `invocacion`.
- **02b906 + 1c2cc0** parecen el mismo síntoma: drag o autolayout sobre padre con descomposición/despliegue colapsa hijos sobre el bbox del padre. Posible regresión post-`7982e91` (`fix(modelo): encajar creaciones inzoom en contorno`), o efecto del clamp HU-12.020 (`moverAparienciaPorId` re-encierra apariencias dentro del bbox del contorno) que el rediseño del autolayout 2026-05-08 evitó vía batch directo. Verificar handlers de drag en `JointCanvas.tsx` y `aplicarLayoutSugerido`.
- **029d2b** es queja general sobre routing de enlaces (probablemente complementario a 02b906/1c2cc0).

Acción sugerida próximo corte: agrupar 365788 + 02b906 + 1c2cc0 + 029d2b como pasada coordinada de fix-up visual del canvas (similar al ciclo del 2026-05-08).

## Bugs Reales Pendientes (preservado HANDOFF anterior)

- **Tab "Enlaces" entidad placeholder** (Ronda 20 L1) — implementar lista in/out detallada en futura ronda.

## Decisiones Vigentes (25 + 1 nueva)

1-21. Inalteradas desde HANDOFF anterior (D1 Tokens-only chrome UI · D2 `<details open>` Inspector vacío · D3 Schema dual refinamiento · D4 Unicidad global nombres · D5 Delete cross-OPD vs Ocultar apariencia · D6 Smokes > reorganización · D7 Handoff único · D8 No actuar fuera de scope · D9 Identidad modelo SSOT · D10 Menús primarios mutuamente excluyentes · D11 `solicitudFitToken` canvas · D12 Modal estados SSOT · D13 Eval UX permanente · D14 Zoom exponencial · D15 Doble clic refinamiento · D16 Inspector tabs · D17 Abanico en Propiedades · D18 OPL 4 grupos · D19 Biblioteca dock + overlay · D20 Empty state bloque+nudge · D21 Responsive modo revisión).

22-25. Vigentes desde HANDOFF Beta2 (D22 Reset tab Inspector cross-selección · D23 Kernel simulación puro determinista · D24 Asignación atributo→atributo Beta2-min · D25 BarraSimulacion `readOnly=true`).

**Nueva**:

26. **Ancho del Inspector resizable persistente en `preferenciasUi`** (Inspector resizable BUG-696858): el ancho del pane derecho vive en `indice.preferenciasUi.anchoPanelInspector` con clamp `[240, 560]` y default 300. Espejo de `anchoPanelArbol`; doble clic en el divisor lo resetea al default. En tablet acota al default; en mobile no se monta divisor. Cualquier callsite que persista ancho de paneles laterales debe usar `preferenciasUi`, no localStorage directo.

## Verificación Final Conocida

`main @ <commit de cierre>`:

```bash
cd app && bun run check
# 1166 unit pass / 0 fail / 4306 expect() / 113 archivos

cd app && bun run lint
# clean

cd app && bun run build
# index-Csc_2OHN.js 348.56 KB / 90.94 KB gzip
# vendor-jointjs-Cfe4rKV_.js 470.77 KB / 129.72 KB gzip (lazy)

cd app && bun run browser:smoke
# 172 passed / 0 failed / 0 skipped
```

Dev server público: `http://138.201.53.205:5173/` (puerto 5173 abierto en ufw, host 0.0.0.0). Verificar `pgrep -af vite` antes de levantar — esta sesión detectó un Vite zombie de worktree borrado interceptando el puerto, causando falsos `Process from config.webServer was not able to start`.

## Pendientes Y Supuestos

### Eval Beta1 dominio real — sigue pendiente (sin trabajo en main)

L5 Beta1 con HODOM-HSC cancelado en esta sesión. El alcance acordado se preserva para retomar: **"Solo unidad HODOM núcleo"** desde la perspectiva del DT, conducción **"Tú decides, yo modelo"**. Brief intacto en `docs/instrucciones-lineas-dev/ronda16/linea-5-eval-beta1-dominio-real.md`. Pre-requisito para R17 L4.

Los 3 commits del agente quedaron en reflog del worktree borrado (`worktree-agent-ac93cec24a901194e` HEAD `3fb48db`). Recuperables vía `git reflog show` o cherry-pick por SHA hasta el próximo `git gc` (~30 días).

### Ronda 17 L4 / Beta2 dominio ancla — sigue pendiente

Brief intacto en `docs/instrucciones-lineas-dev/ronda17/linea-4-eval-beta2-dominio-ancla.md`. Depende del cierre de L5 Beta1.

### Bugs nuevos del 2026-05-11 noche — sin atender

Cuatro reportes en `docs/bugs/` commiteados en este corte como evidencia. Ver §"Bugs Capturados Nuevos Sin Atender".

### Deuda viva no bloqueante

| Item | Origen | Sugerencia |
|---|---|---|
| Bundle `index.js` 348.56 KB > cap fix-up 345 KB | Convergencia r20+r21+r17+Inspector resizable | Optimización menor; tree-shake o lazy split adicional. |
| BarraSimulacion marca proceso activo solo textual | Ronda 17 L2 Beta2-min | **Cerrada parcialmente** por `27654b0` halo verde sobre proceso + dorado sobre estados current. Queda revisión visual final. |
| `linkPickerLabel` huérfano en `toolbarStyles.ts` | Ronda 18 P3 | Limpieza no aditiva en próxima micro-ronda. |
| `mask-image` affordance scroll horizontal Toolbar | Ronda 15 L1/L2 | Polish post-Fase 1. |
| Canvas `role="application"` no reintroducido | Ronda 15 L1/L4 | Requiere migrar helpers `getByRole("img")` en bloque. |
| FAIL eval `dialogo-biblioteca` / `dialogo-menu-principal` | Ronda 15 L3 | Refinar criterios. |
| HU-13.005 duplicate-id en dashboard legado | Anterior | Sin bloqueo. |
| `bun test` sin scope rompe por incluir `e2e/` | Config | Considerar `testMatch` explícito en `package.json`. |
| Tab "Enlaces" entidad placeholder | Ronda 20 L1 | Implementar lista in/out detallada en futura ronda. |
| `bunfig.toml` y `tsconfig.json` en root untracked | Helpers local del operador para `bun test`/typecheck desde root | Operador decide si los gitignorea explícitamente o los commitea como helpers compartidos. |

### Riesgos

1. **3 commits ahead de `origin/main`** antes del push del cierre. Push se hace en este corte (operador-controlado).
2. **Loop verde 100%** — cualquier nueva regresión será visible.
3. **Vite zombie de worktrees borrados** puede interceptar :5173 — verificar con `pgrep -af vite` antes de levantar dev o smoke.
4. **L5 Beta1 sigue sin dominio ancla cerrado** — R17 L4 sigue dependiendo de esto.
5. **4 bugs visuales del 2026-05-11 noche pendientes**, especialmente 02b906 y 1c2cc0 que sugieren regresión en drag/autolayout sobre padres con descomposición/despliegue.
6. **Schema dual de refinamiento**: consumers nuevos usan helpers (`obtenerRefinamiento` / `refinaA` / `refinamientosDe` / `fijarRefinamiento`), nunca `entidad.refinamiento` directo.
7. **Inspector tabs**: smokes con acciones cross-selección deben re-navegar al tab antes de buscar elementos.
8. **Inspector ancho**: callsites nuevos usan `anchoPanelInspector` + `fijarAnchoPanelInspector`. No localStorage directo.
9. **Mobile mode**: `< 640px` es revisión/navegación, NO modelado pesado. Componentes nuevos respetan `useBreakpoint()`.
10. **Modo simulación**: `readOnly=true` bloquea `commitModelo`. Nuevos slices con mutaciones que NO pasen por `commitModelo` deben respetar `contextoSimulacion !== null`.

## Próximos Pasos Operativos

1. **Investigar y cerrar los 4 bugs del 2026-05-11 noche** (365788 invocación inverso · 02b906 drag aglomeración · 1c2cc0 autolayout aglomeración · 029d2b maraña de líneas) — sugerido como pasada coordinada de fix-up visual del canvas, similar al ciclo del 2026-05-08.
2. **Conducir L5 Beta1 con HODOM-HSC** una vez resueltos los bugs visuales — el modelado en vivo va a tropezar con ellos.
3. **Ronda 17 L4** una vez Beta1 cerrada.
4. **Optimización bundle** 348.56 → ≤ 345 KB (deuda menor).
5. **Mantener loop verde** antes de cualquier commit nuevo:
   - `cd app && bun run check`
   - `cd app && bun run lint`
   - `cd app && bun run build`
   - `cd app && bun run browser:smoke` (verificar `pgrep -af vite` primero)

## Prompt De Continuación Breve

Usa `docs/HANDOFF.md` como memoria única. Estado: `main @ <commit de cierre>`, recién pusheado a `origin/main`. Loop verde 100%: 1166 unit / 172 smoke / build `index.js` 348.56 KB. Inspector lateral derecho ahora resizable vía `DivisorPanel` (BUG-696858 cerrado). "Regresión 3 smokes" descartada como flake de contención de worktrees. **Pendiente alta prioridad**: 4 bugs visuales capturados 2026-05-11 noche (365788 enlace invocación inverso · 02b906 drag aglomera hijos refinados · 1c2cc0 autolayout aglomera · 029d2b maraña de líneas) — recomendado como pasada coordinada antes de retomar L5 Beta1 HODOM-HSC. **L5 Beta1 cancelado sin trabajo en main**; alcance acordado preservado: "Solo unidad HODOM núcleo" + conducción "Tú decides, yo modelo". 26 decisiones vigentes; la nueva es D26 (ancho Inspector resizable persistente en `preferenciasUi`).
