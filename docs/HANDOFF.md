# HANDOFF — Auditoria UX ronda 4 + pasada visual canvas

**Fecha**: 2026-05-12
**Repositorio**: `deep-opm-pro`
**Rama**: `main`
**HEAD previo al handoff**: `1cc8f93` (`docs(audit): continuar evaluacion UX OPM`), ya pusheado a `origin/main` antes de este cierre documental.
**Base previa relevante**: `0aafb78` (`cerrando para sincronizar hacia abajo`) y `a1abe58` (`fix(canvas): corregir direccion y layout visual de enlaces`).
**Origin**: `main` alineado con `origin/main` al inicio de este cierre (`origin/main...HEAD = 0 0`).
**Corte**: cierre documental de la investigacion UX/UI ronda 4 sobre nuevas caracteristicas de la app OPM. Mantiene la pasada visual canvas/Inspector resizable y agrega el informe exhaustivo con 21 screenshots, hallazgos priorizados y prompt de continuacion.

## Política De Handoff Único

`docs/HANDOFF.md` es la única memoria de traspaso vigente del proyecto. Este archivo **reemplaza** y consolida el handoff anterior. No crear handoffs paralelos, fechados ni duplicados.

## Contexto Normativo

El modelador OPM vive en `app/` con Bun + Vite + Preact + Zustand + JointJS OSS. Arquitectura propia: no Angular, no Firebase, no Rappid.

Autoridad semántica:

- SSOT OPM/ISO 19450: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`
- Evidencia operacional OPCloud: `opm-extracted/`
- Evidencia visual canónica: `assets/svg/`, `assets/png/`, `docs/JOYAS.md`
- Backlog vivo: `docs/historias-usuario-v2/`
- Auditoría UX base: `docs/audits/opm-app-ux-2026-05-07/informe-final-ui-ux.md`
- Auditoría UX vigente ronda 4: `docs/audits/opm-app-ux-2026-05-12-ronda4-nuevas-caracteristicas/README.md`
- Corte operativo vivo: `docs/roadmap/cortes-operativos.md`

## Estado Ejecutivo

### Cierre actual — auditoria UX ronda 4

Artefacto principal: `docs/audits/opm-app-ux-2026-05-12-ronda4-nuevas-caracteristicas/README.md`.

Evidencia visual: 21 PNG en `docs/audits/opm-app-ux-2026-05-12-ronda4-nuevas-caracteristicas/screenshots/`.

Metodo de investigacion:

- Target solicitado: `http://138.201.53.205:5173/`.
- `curl` confirmo `HTTP/1.1 200 OK` en la URL publica.
- El navegador embebido tuvo timeout/bloqueo contra la IP publica.
- Chrome headless si cargo la URL publica y capturo estado inicial, fixture `App modeladora OPM deseada`, biblioteca dock, mobile y tablet.
- La interaccion profunda se hizo sobre `http://localhost:5173/` levantado desde este checkout, con la misma superficie funcional.

Mejoras confirmadas respecto al informe 2026-05-07:

- Toolbar agrupada por dominio operativo: `Modelo`, `Modelar`, `Conectar`, `Vista`, `Validar`, `Ayuda`.
- Estado vacio desktop con arranque OPM directo.
- Identidad del fixture amplio visible en header y pestana.
- Validacion separada en bloqueos estructurales, mejoras metodologicas y estilo/legibilidad.
- Arbol OPD con tipo de refinamiento y conteos.
- Biblioteca dock, inspector resizable, mapa, simulacion y fixture amplio disponibles.
- Flujo objeto/proceso/enlace resultado funcionando con OPL vivo: `Proceso genera Objeto`.

Hallazgos prioritarios nuevos:

1. **P0 dirty-state demasiado agresivo**: biblioteca/auto-layout/navegacion pueden dejar el fixture como `sin guardar` y bloquear carga posterior con modal de cambios. Separar `dirtyModel` de `dirtyView/layoutDraft`.
2. **P0 modos Mapa/Simulacion sin jerarquia clara**: mapa y simulacion pueden quedar activos simultaneamente; definir modos mutuamente excluyentes `Modelar`, `Mapa`, `Simular`, `Enlace`.
3. **P1 biblioteca dock duplicada**: cabecera `Biblioteca` y boton `x` aparecen dos veces en modo dock.
4. **P1 arbol OPD demasiado denso**: controles permanentes por nodo saturan desktop y se rompen en tablet.
5. **P1 auto-layout sin encuadre final confiable**: ordenar sin fit-to-view deja al usuario reparando camara.
6. **P1 `Tipos validos` no guia el enlace real**: necesita origen, destinos validos/invalidos y preview OPL.
7. **P1 estado sticky confuso**: `Modo sticky: Objeto` puede convivir con otras acciones/selecciones.
8. **P1 editor inline vivo tras cambiar contexto**: el editor de nombre puede quedar abierto mientras el inspector ya muestra un enlace.
9. **P2 menus invaden superficies primarias**: menu principal y `Mas acciones` caen sobre arbol/canvas/validacion.
10. **P2 responsive incompleto**: mobile muestra tabs inferiores pero oculta el arranque; tablet comprime columnas.
11. **P2 microcopy**: tildes, copy beta y labels como `Respeta` siguen bajando precision.

Decisiones de continuidad:

- No se toco codigo en esta ronda: solo auditoria, screenshots, memoria y handoff.
- El siguiente trabajo de producto debe atacar primero gobernanza de modos y dirty-state antes de agregar mas features.
- Mobile se mantiene como modo revision/navegacion; no modelado pesado salvo rediseño explicito.
- El informe 2026-05-07 sigue siendo base historica; la ronda 4 es el estado UX vigente.

### Estado funcional previo preservado

Base remota anterior `main @ c05c2a5`, pusheada a `origin/main`. Trabajo consolidado desde el HANDOFF anterior (`aa1b8ef`):

1. **Halo visual modo simulación** (`27654b0` halo verde proceso activo + dorado estados current; `c11d88c` fallback al primer estado como current cuando no hay designación) — pulido visual Beta2 L2.
2. **Fix encaje inzoom** (`7982e91` `fix(modelo): encajar creaciones inzoom en contorno`) — commit local del operador del 2026-05-11/12.
3. **Inspector resizable** (`404bc49` merge en este corte): `DivisorPanel` invertible aplicado al pane derecho. Estado `anchoPanelInspector` en `indice.preferenciasUi` (espejo de `anchoPanelArbol`), con min 240 / max 560 / inicial 300. Smoke nuevo `23-inspector-resize.spec.ts` (drag, persistencia, dblclick reset). Cierra **BUG-20260511T225343Z-696858**.

Loop verde sobre `main @ c05c2a5`:

- `bun run check` → **1166 unit / 0 fail / 4306 expect()** / 113 archivos
- `bun run lint` → clean
- `bun run build` → `index.js` **348.56 KB / 90.94 KB gzip** (vendor JointJS lazy 470 KB sin cambio). Sigue 3.56 KB sobre cap fix-up r20 (345 KB), dentro del orden de magnitud aceptado.
- `bun run browser:smoke` → **172 passed / 0 fail / 0 skip** (+1 sobre 171 HANDOFF, el `23-inspector-resize`).

### Pasada visual 2026-05-12

Cambios aplicados sobre `main @ c05c2a5` para atacar la pasada coordinada de bugs visuales 365788 + 02b906 + 1c2cc0 + 029d2b:

- **365788 invocación inversa**: `invocacion` usa marker en `targetMarker`, alineado con OPCloud `InvocationLink` (`opm-extracted/src/app/models/DrawnPart/Links/InvocationLink.ts`), no en `sourceMarker`.
- **02b906 drag aglomera hijos refinados**: el drag del canvas ya no desvía subprocesos internos al reordenador de timeline; persiste la posición JointJS real vía `moverApariencia`.
- **1c2cc0 autolayout aglomera refinamientos estructurales**: `layoutLayered` usa enlaces estructurales para ranking cuando no hay flujo procedural, evitando dejar padre e hijos en una sola banda plana.
- **029d2b maraña de líneas**: las ramas de refinamiento estructural se proyectan rectas hacia/desde el triángulo, sin `routerManhattan`, reduciendo codos y cruces artificiales.

Verificación de esta pasada:

- `bun run typecheck` → clean
- `bun run test` → **1166 pass / 0 fail / 4310 expect()**
- `bun run lint` → clean
- `bun run build` → `index-Bbtw-h6I.js` **348.13 KB / 90.82 KB gzip**
- `bun run browser:smoke -- --shard=1/4` → 56 passed
- `bun run browser:smoke -- --shard=2/4` → 49 passed
- `bun run browser:smoke -- --shard=3/4` → 25 passed
- `bun run browser:smoke -- --shard=4/4` → 42 passed

Total smoke shardificado: **172 passed / 0 fail**. `pgrep -af vite` quedó limpio al cierre. Artefactos regenerables creados por la verificación (`app/dist`, `app/test-results`) fueron eliminados.

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

## Bugs Visuales 2026-05-11 Atendidos

El operador capturó **4 bugs** entre 23:00 y 23:32 del 2026-05-11. En `main @ c05c2a5` seguían pendientes; esta pasada los atiende como corrección visual coordinada. Sus reportes viven en `docs/bugs/` como evidencia.

| ID | Hora | Texto del operador |
|---|---|---|
| `BUG-20260511T230050Z-365788` | 23:00 | "los enlaces de invocación tienen su dirección o sentido al revés. en vez de apuntar desde el proceso que desencadena al que es desencadenado, está al revés. corrígelo por favor" |
| `BUG-20260511T232341Z-02b906` | 23:23 | "cuando hay algo que se refina con enlaces estructurales y se desplazan en el diagrama al desplazar y soltar los hijos se aglomeran sobre el padre como si fuesen metales que se desplazan a un imán" |
| `BUG-20260511T232603Z-1c2cc0` | 23:26 | "y esto pasa cuando aplico autolayout a un padre y sus hijos derivados de enlaces estructurales" |
| `BUG-20260511T233234Z-029d2b` | 23:32 | "mira que maraña de líneas. esto no esta bien. necesito que lo mejores" |

Estado: atendidos por la pasada visual 2026-05-12. Queda revisión humana in-vivo si el operador quiere comparar directamente contra las capturas.

## Bugs Reales Pendientes (preservado HANDOFF anterior)

- **Tab "Enlaces" entidad placeholder** (Ronda 20 L1) — implementar lista in/out detallada en futura ronda.

## Decisiones Vigentes (25 + 1 nueva)

1-21. Inalteradas desde HANDOFF anterior (D1 Tokens-only chrome UI · D2 `<details open>` Inspector vacío · D3 Schema dual refinamiento · D4 Unicidad global nombres · D5 Delete cross-OPD vs Ocultar apariencia · D6 Smokes > reorganización · D7 Handoff único · D8 No actuar fuera de scope · D9 Identidad modelo SSOT · D10 Menús primarios mutuamente excluyentes · D11 `solicitudFitToken` canvas · D12 Modal estados SSOT · D13 Eval UX permanente · D14 Zoom exponencial · D15 Doble clic refinamiento · D16 Inspector tabs · D17 Abanico en Propiedades · D18 OPL 4 grupos · D19 Biblioteca dock + overlay · D20 Empty state bloque+nudge · D21 Responsive modo revisión).

22-25. Vigentes desde HANDOFF Beta2 (D22 Reset tab Inspector cross-selección · D23 Kernel simulación puro determinista · D24 Asignación atributo→atributo Beta2-min · D25 BarraSimulacion `readOnly=true`).

**Nueva**:

26. **Ancho del Inspector resizable persistente en `preferenciasUi`** (Inspector resizable BUG-696858): el ancho del pane derecho vive en `indice.preferenciasUi.anchoPanelInspector` con clamp `[240, 560]` y default 300. Espejo de `anchoPanelArbol`; doble clic en el divisor lo resetea al default. En tablet acota al default; en mobile no se monta divisor. Cualquier callsite que persista ancho de paneles laterales debe usar `preferenciasUi`, no localStorage directo.

## Verificación Final Conocida

### Cierre documental UX ronda 4

```bash
git diff --check
# clean

git diff --cached --check
# clean antes de commit 1cc8f93

curl -I --connect-timeout 5 --max-time 10 http://138.201.53.205:5173/
# HTTP/1.1 200 OK

git rev-list --left-right --count origin/main...HEAD
# 0 0 tras push de 1cc8f93
```

No se ejecuto suite de app en esta ronda porque el cambio fue documental/evidencia visual. La verificacion tecnica funcional vigente sigue siendo la pasada visual inmediatamente anterior:

Pasada visual 2026-05-12 sobre `main`:

```bash
cd app && bun run typecheck
# clean

cd app && bun run test
# 1166 unit pass / 0 fail / 4310 expect() / 113 archivos

cd app && bun run lint
# clean

cd app && bun run build
# index-Bbtw-h6I.js 348.13 KB / 90.82 KB gzip
# vendor-jointjs-Cfe4rKV_.js 470.77 KB / 129.72 KB gzip (lazy)

cd app && bun run browser:smoke -- --shard=1/4
cd app && bun run browser:smoke -- --shard=2/4
cd app && bun run browser:smoke -- --shard=3/4
cd app && bun run browser:smoke -- --shard=4/4
# 172 passed / 0 failed total
```

Dev server público: `http://138.201.53.205:5173/` (puerto 5173 abierto en ufw, host 0.0.0.0). Verificar `pgrep -af vite` antes de levantar — esta sesión detectó un Vite zombie de worktree borrado interceptando el puerto, causando falsos `Process from config.webServer was not able to start`.

## Pendientes Y Supuestos

### Eval Beta1 dominio real — sigue pendiente (sin trabajo en main)

L5 Beta1 con HODOM-HSC cancelado en esta sesión. El alcance acordado se preserva para retomar: **"Solo unidad HODOM núcleo"** desde la perspectiva del DT, conducción **"Tú decides, yo modelo"**. Brief intacto en `docs/instrucciones-lineas-dev/ronda16/linea-5-eval-beta1-dominio-real.md`. Pre-requisito para R17 L4.

Los 3 commits del agente quedaron en reflog del worktree borrado (`worktree-agent-ac93cec24a901194e` HEAD `3fb48db`). Recuperables vía `git reflog show` o cherry-pick por SHA hasta el próximo `git gc` (~30 días).

### Ronda 17 L4 / Beta2 dominio ancla — sigue pendiente

Brief intacto en `docs/instrucciones-lineas-dev/ronda17/linea-4-eval-beta2-dominio-ancla.md`. Depende del cierre de L5 Beta1.

### Bugs visuales del 2026-05-11 noche — atendidos

Cuatro reportes en `docs/bugs/` atendidos por la pasada visual 2026-05-12. Ver §"Bugs Visuales 2026-05-11 Atendidos".

### Deuda viva no bloqueante

| Item | Origen | Sugerencia |
|---|---|---|
| Bundle `index.js` 348.13 KB > cap fix-up 345 KB | Convergencia r20+r21+r17+Inspector resizable + pasada visual | Optimización menor; tree-shake o lazy split adicional. |
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

1. **`main` parte de `origin/main` en `c05c2a5`**; esta pasada se empuja controladamente como commit atómico de canvas visual.
2. **Loop verde 100%** — cualquier nueva regresión será visible.
3. **Vite zombie de worktrees borrados** puede interceptar :5173 — verificar con `pgrep -af vite` antes de levantar dev o smoke.
4. **L5 Beta1 sigue sin dominio ancla cerrado** — R17 L4 sigue dependiendo de esto.
5. **4 bugs visuales del 2026-05-11 noche atendidos**, pendientes solo de revisión visual humana si el operador quiere validar contra las capturas originales.
6. **Schema dual de refinamiento**: consumers nuevos usan helpers (`obtenerRefinamiento` / `refinaA` / `refinamientosDe` / `fijarRefinamiento`), nunca `entidad.refinamiento` directo.
7. **Inspector tabs**: smokes con acciones cross-selección deben re-navegar al tab antes de buscar elementos.
8. **Inspector ancho**: callsites nuevos usan `anchoPanelInspector` + `fijarAnchoPanelInspector`. No localStorage directo.
9. **Mobile mode**: `< 640px` es revisión/navegación, NO modelado pesado. Componentes nuevos respetan `useBreakpoint()`.
10. **Modo simulación**: `readOnly=true` bloquea `commitModelo`. Nuevos slices con mutaciones que NO pasen por `commitModelo` deben respetar `contextoSimulacion !== null`.

## Próximos Pasos Operativos

1. **Remediar P0 dirty-state**: distinguir mutacion semantica de navegacion/layout exploratorio.
2. **Remediar P0 modos simultaneos**: hacer `Modelar` / `Mapa` / `Simular` / `Enlace` mutuamente excluyentes o claramente jerarquicos.
3. **Simplificar biblioteca dock**: una sola cabecera, un solo cierre, filtros persistentes.
4. **Resolver sticky mode e inline editor cruzado**.
5. **Dar al modo enlace un flujo guiado con preview OPL**.
6. **Ajustar auto-layout para terminar con fit-to-view**.
7. **Rediseñar responsive**: mobile revision, tablet paneles alternables.
8. **Limpieza de microcopy y tooltips**.
9. **Conducir L5 Beta1 con HODOM-HSC** cuando el operador decida retomar dominio real.
10. **Ronda 17 L4** una vez Beta1 cerrada.
11. **Optimización bundle** 348.13 → ≤ 345 KB (deuda menor).
12. **Mantener loop verde** antes de cualquier commit de codigo:
   - `cd app && bun run check`
   - `cd app && bun run lint`
   - `cd app && bun run build`
   - `cd app && bun run browser:smoke` (verificar `pgrep -af vite` primero)

## Prompt De Continuación Breve

Usa `docs/HANDOFF.md` como memoria unica. Estado actual: `main` incluye la auditoria UX ronda 4 en `docs/audits/opm-app-ux-2026-05-12-ronda4-nuevas-caracteristicas/README.md` con 21 screenshots y hallazgos priorizados. Commit publicado previo: `1cc8f93 docs(audit): continuar evaluacion UX OPM`. La app mejoro en toolbar agrupada, estado vacio, identidad de fixture, validacion separada, arbol OPD, biblioteca dock, inspector resizable, mapa/simulacion y OPL vivo. Siguiente foco recomendado: P0 dirty-state vs navegacion/layout, P0 modos Mapa/Simulacion/Modelar/Enlace, biblioteca dock duplicada, sticky mode/editor inline cruzado, modo enlace con preview OPL, auto-layout con fit-to-view y responsive. Preserva contexto previo: pasada visual canvas 2026-05-12 ya atendio 365788/02b906/1c2cc0/029d2b; Inspector resizable BUG-696858 cerrado con D26 (`preferenciasUi.anchoPanelInspector`). Antes de levantar dev server o smoke: `pgrep -af vite`.
