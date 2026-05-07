# Línea 1 — Cleanup TIER 1 (5 ítems steipete)

## 1. Misión

Ejecutar los 5 ítems TIER 1 de la auditoría steipete `docs/auditorias/2026-05-07-refactor-radical-steipete.md` §2. Cada uno entra como **commit atómico propio**, en el orden recomendado por el README §8 (T1.3 → T1.5 → T1.2 → T1.4 → T1.1).

Slice mínimo entregable: 5 commits feat/refactor/test/chore + opcional 1 commit cleanup si emerge fix detector. Total ~½ día. **Cero cambios kernel/render/OPL/serializadores**.

**Fuera de slice**:
- TIER 2 (split Toolbar, tokens central completo, methodological-checkers, BarraHerramientasElemento) — ronda 13 grande.
- TIER 3 (Zustand→signals, JointJS→canvas custom, etc.) — espera evento gatillante.
- Cambios en lógica de tests T1.4 (solo movimiento mecánico).
- Refactor de `Toolbar.tsx` más allá de los 9 literales T1.2.
- Migración de literales en otros archivos (Inspector, MenuContextual, Dialogo*) — ronda 13 grande T2.2.

## 2. Deudas que cierra

| ID | Deuda | Aporte L1 |
|---|---|---|
| **T1.1** | 5 stashes pendientes en `git stash list` (artefactos de coordinación cruzada ronda 12.1; territorio operador hasta autorización destructiva) | **AUTORIZACIÓN PREVIA REQUERIDA**. Ejecutor pregunta al operador antes del drop. Si autorizado: `git stash show -p stash@{N}` por cada uno como audit, luego `git stash drop stash@{N}` × 5 (en orden inverso 4→3→2→1→0 para no rotar índices). Verificar `git stash list` vacío. Si NO autorizado: documentar en commit final como "stashes preservados por decisión operador". |
| **T1.2** | 9 literales `#3BC3FF`/`#586D8C` activeButton/stickyBadge/activeSelect/nombreInput/primarySmall en `app/src/ui/Toolbar.tsx` que colisionan semánticamente con paleta canvas | Sustituir por referencias a `tokens.colors.acentoUi` (para `#3BC3FF`) y `tokens.colors.chromeNeutral` (para `#586D8C`). Para fondos suaves derivados: añadir 2 tokens nuevos `acentoUiSuave: "#eaf8ff"` y `chromeNeutralSuave: "#e8eef5"` en `tokens.ts`. Tests de tokens.test.ts añaden assertions para los 2 nuevos. Smoke browser `boton-toolbar-activo` debe seguir verde. |
| **T1.3** | Headers de provenance desactualizados (auditoría SSOT 2026-05-07 §RF-1+R4) en 4 archivos del modelo | Corregir headers exactos:<br>• `app/src/modelo/operaciones/enlaces.ts:33`: `Logical/AggregationLink.ts` → `DrawnPart/Links/AggregationLink.ts`<br>• `app/src/modelo/tipos/enlace.ts:10`: mismo<br>• `app/src/modelo/tipos/abanico.ts:8`: `Logical/*` → `LogicalPart/*`<br>• `app/src/modelo/validaciones.ts:1`: añadir header `// Refs: opm-extracted/.../{behavioral,structural}.rules.ts (técnica de inspiración; SSOT = opm-iso-19450-es.md §Reglas)` |
| **T1.4** | `app/e2e/opm-smoke.spec.ts` 3847 LOC / ~93 tests en un solo archivo monolítico | Particionar mecánicamente en 8 archivos por dominio (sin tocar lógica de tests; solo cortar/pegar):<br>• `01-carga-y-workspace.spec.ts` (5-7 tests)<br>• `02-canvas-y-render.spec.ts` (10-12)<br>• `03-opl-panel.spec.ts` (9)<br>• `04-arbol-y-pestanas.spec.ts` (3-4)<br>• `05-refinamiento-y-plegado.spec.ts` (5-7)<br>• `06-undo-redo-dirty.spec.ts` (8)<br>• `07-enlaces-avanzados.spec.ts` (10-12)<br>• `08-mvp-alpha-residual.spec.ts` (~12)<br>El archivo original `opm-smoke.spec.ts` queda vacío con comentario `// deprecated; tests redistribuidos en 01-08-*.spec.ts` o se elimina si Playwright config no lo requiere. |
| **T1.5** | Reglas detector con paths posiblemente desfasados tras commits L0-L3 ronda 12.1 | Ejecutar `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real --strict`. Si emerge diagnóstico nuevo, corregir paths/strings. Si está limpio, NO modificar. Documentar resultado en commit. |

**Total esperado**: 5 commits + 0-1 cleanup.

## 3. Anclaje a evidencia

**Auditoría steipete** `docs/auditorias/2026-05-07-refactor-radical-steipete.md` §2:
- T1.1 §120-127
- T1.2 §128-143
- T1.3 §144-157
- T1.4 §158-179
- T1.5 §180-186

**Auditoría SSOT** `docs/auditorias/2026-05-07-ssot-opm-extracted.md` §RF-1+R4: paths exactos para T1.3.

**Estado actual del código (verificado)**:
- `app/src/ui/Toolbar.tsx`: 9 literales en líneas 774, 823, 836, 867, 930, 967, 1019, 1024, 1026 (verificar que sean los activeButton/stickyBadge/activeSelect/nombreInput/primarySmall — si hay más o menos, documentar).
- `app/src/ui/tokens.ts`: tiene `colors.acentoUi`, `colors.acentoSecundario`, `colors.chromeNeutral`, `colors.canvas` (introducido en ronda 12.1 L2).
- `app/src/ui/tokens.test.ts`: tiene 3 expects en 1 describe (introducido en ronda 12.1 L2).
- `app/e2e/opm-smoke.spec.ts`: 3847 LOC / 93 tests aprox.
- `app/src/modelo/operaciones/enlaces.ts:33`, `app/src/modelo/tipos/enlace.ts:10`, `app/src/modelo/tipos/abanico.ts:8`: headers actuales con paths posiblemente desactualizados (verificar antes de editar).
- `app/src/modelo/validaciones.ts:1`: probablemente sin header de provenance (auditoría SSOT pidió añadirlo).
- `git stash list`: 5 stashes pendientes con descripción de coordinación cruzada ronda 12.1 (`L2/L3 WIP operador`, `L1+L2 in-flight broken state`, `L2 DialogoCargarModelo v3`, `L1 fixtures bleed`, `L1+L2 in flight`).

## 4. Archivos permitidos

```text
app/src/ui/Toolbar.tsx                                  EDIT aditivo (T1.2: sustituir 9 literales)
app/src/ui/tokens.ts                                    EDIT aditivo (T1.2: 2 tokens nuevos)
app/src/ui/tokens.test.ts                               EDIT aditivo (T1.2: assertions tokens nuevos)
app/src/modelo/operaciones/enlaces.ts                   EDIT aditivo (T1.3: header SSOT corregido, línea 33 aprox)
app/src/modelo/tipos/enlace.ts                          EDIT aditivo (T1.3: header SSOT corregido, línea 10 aprox)
app/src/modelo/tipos/abanico.ts                         EDIT aditivo (T1.3: header SSOT corregido, línea 8 aprox)
app/src/modelo/validaciones.ts                          EDIT aditivo (T1.3: header SSOT añadido, línea 1)
app/e2e/opm-smoke.spec.ts                               EDIT (T1.4: vaciar tras movimiento; o eliminar si Playwright config lo permite)
app/e2e/01-carga-y-workspace.spec.ts                    NUEVO (T1.4: 5-7 tests)
app/e2e/02-canvas-y-render.spec.ts                      NUEVO (T1.4: 10-12 tests)
app/e2e/03-opl-panel.spec.ts                            NUEVO (T1.4: 9 tests)
app/e2e/04-arbol-y-pestanas.spec.ts                     NUEVO (T1.4: 3-4 tests)
app/e2e/05-refinamiento-y-plegado.spec.ts               NUEVO (T1.4: 5-7 tests)
app/e2e/06-undo-redo-dirty.spec.ts                      NUEVO (T1.4: 8 tests)
app/e2e/07-enlaces-avanzados.spec.ts                    NUEVO (T1.4: 10-12 tests)
app/e2e/08-mvp-alpha-residual.spec.ts                   NUEVO (T1.4: ~12 tests)
docs/historias-usuario-v2/tools/progress-dashboard.mjs  EDIT aditivo (T1.5: solo si emerge fix paths)
docs/auditorias/2026-05-07-refactor-radical-steipete.md LECTURA (referencia)
docs/auditorias/2026-05-07-ssot-opm-extracted.md        LECTURA (referencia)
docs/HANDOFF.md                                         LECTURA
opm-extracted/**                                        LECTURA
assets/svg/**                                           LECTURA
```

Cualquier otro archivo es **fuera de scope**.

## 5. Restricciones

- **No tocar kernel** (`app/src/modelo/tipos/{modelo,entidad,opd,apariencia,abanico,estado,opl,pestana,ui}.ts` salvo enlace.ts y abanico.ts solo headers L3).
- **No tocar generadores OPL** (`app/src/opl/generadores/*.ts`, `app/src/modelo/opl/generador-opl.ts`).
- **No tocar serializadores** (`app/src/serializacion/*.ts`).
- **No tocar render** (`app/src/render/jointjs/*`).
- **No tocar canvas/operacionesBatch.ts**.
- **No tocar store/** (slices runtime/modelo/seleccion/persistencia/pestanas) salvo si T1.5 fix paths requiere documentar (no edit).
- **No tocar inspector/** ni otros componentes UI más allá de Toolbar.tsx (que solo cambia los 9 literales).
- **No tocar `Dialogo.tsx`, `MenuContextual*.tsx`, `ArbolOpd.tsx`, `BibliotecaCosa.tsx`, `DialogoTraerConectados.tsx`, `DialogoPlantillas.tsx`, `DialogoCargarModelo.tsx`, `App.tsx`, `MenuPrincipal.tsx`, `PantallaInicio.tsx`** — territorio ronda 13 grande.
- **No introducir tokens.spacing, radii, shadows, typography** — territorio ronda 13 grande T2.2.
- **No introducir ESLint rule** — territorio ronda 13 grande T2.2.
- **No agregar features ni HU** — ronda 13.0 es cleanup técnico.

## 6. Comportamiento esperado

- **T1.1**: tras autorización operador, `git stash list` retorna vacío. Si NO autorizado, los 5 stashes permanecen documentados en commit final con rationale.
- **T1.2**: `Toolbar.tsx` no contiene literales `#3BC3FF`/`#586D8C` en activeButton/stickyBadge/activeSelect/nombreInput/primarySmall. Visual diff manual confirma que los botones activos siguen renderizando con el mismo color de acento.
- **T1.3**: 4 headers actualizados con paths SSOT correctos. `grep` de los paths corregidos retorna match.
- **T1.4**: smoke browser ejecuta los 86 tests distribuidos en 8 archivos navegables; tiempo total similar (~5 min); cobertura idéntica.
- **T1.5**: dashboard `--strict` retorna sin diagnóstico nuevo (o con fix aplicado y commit propio).

## 7. Pruebas requeridas

**Unit tests**: `tokens.test.ts` extendido con 2 expects nuevos para `acentoUiSuave` y `chromeNeutralSuave`. Total: 673 → 675 pass.

**Smoke browser**: 86 → 86 (sin cambios funcionales; redistribuidos en 8 archivos). Verificar especialmente:
- `boton-toolbar-activo` (smoke L1 ronda 12.1) sigue verde tras T1.2.
- Cada uno de los 8 archivos nuevos ejecuta los tests que migraron sin error.

**Build**: chunk principal sin crecimiento significativo (cambios son tokens + headers + reorganización tests).

**Detector**: `--sync-real --strict` sin diagnóstico nuevo.

## 8. Métricas esperadas

- **Tests aditivos**: ~2 unit (tokens.test.ts) + 0 smokes nuevos.
- **HU cerradas**: 0 (cleanup técnico, no cierre HU).
- **Reglas detector**: cero nuevas; 0-N correcciones de paths si emerge fix T1.5.
- **Build**: chunk principal ≈ 218.99 kB (sin cambios significativos).
- **Smokes browser**: 86 → 86 (redistribuidos).

## 9. Loop verde y commits

```bash
cd app
bun run check          # 673 → 675 unit (tokens.test.ts +2)
bun run browser:smoke  # 86 → 86 (redistribuidos)
bun run build          # main chunk sin crecimiento
```

Commits sugeridos (orden T1.3 → T1.5 → T1.2 → T1.4 → T1.1):

1. `chore(modelo): corrige headers SSOT provenance (auditoria 2026-05-07 §RF-1+R4)` (T1.3, 4 archivos del modelo)
2. `chore(detector): verifica reglas con --strict post-ronda-12.1` (T1.5; o `chore(detector): corrige paths heredados en N reglas tras commits L0-L3` si emerge fix)
3. `refactor(toolbar): tokens activeButton/stickyBadge sustituyen 9 literales (T1.2 steipete)` (T1.2, Toolbar.tsx + tokens.ts + tokens.test.ts)
4. `test(e2e): particiona opm-smoke.spec.ts en 8 archivos por dominio (T1.4 steipete)` (T1.4, 8 archivos nuevos + opm-smoke.spec.ts vaciado/eliminado)
5. `chore(stash): limpia 5 stashes legacy ronda 12.1 (autorizado)` (T1.1, SOLO si autorizado por operador; si no, omitir y documentar en commit consolidación final)

Cada commit debe dejar la rama verde. Co-author si aplica.

## 10. Decisiones que tomas vos (documentar en commit)

- **T1.1 stashes**: si el operador rechaza el drop, omitir el commit y documentar en commit final. Si autoriza, ejecutar en orden inverso (4→3→2→1→0) para no rotar índices.
- **T1.2 nombres exactos de tokens nuevos**: el brief sugiere `acentoUiSuave: "#eaf8ff"` y `chromeNeutralSuave: "#e8eef5"` pero los hex exactos del fondo claro derivado pueden ajustarse si visualmente queda mal. Documentar valores finales en commit.
- **T1.3 wording exacto del header validaciones.ts**: el brief sugiere `// Refs: opm-extracted/.../{behavioral,structural}.rules.ts (técnica de inspiración; SSOT = opm-iso-19450-es.md §Reglas)` — ajustable mientras mantenga semantic intent.
- **T1.4 nombres de archivos**: el brief sugiere `01-carga-y-workspace.spec.ts` etc. Si Playwright requiere prefijo distinto o si conviene agrupar por épica HU, ajustar y documentar.
- **T1.4 archivo original**: `opm-smoke.spec.ts` queda vacío con comentario o se elimina. Verificar con `playwright.config.ts` qué patrón espera.
- **T1.5 si emerge fix paths**: hacer cleanup quirúrgico solo en las reglas afectadas; NO refactor mayor del dashboard.

## 11. Forma del entregable

Al cierre de la línea, declarar:

- Hash final del último commit en main.
- LOC delta por archivo (`git diff --stat`).
- Output de `bun run check`, `bun run browser:smoke`, `bun run build` (último tail).
- Lista de commits creados en orden + rationale por uno.
- Decisiones declaradas (§10).
- Estado final `git stash list`.
- Resultado de `--strict` (clean / N fixes).
- Confirmación archivos no tocados (de §5).

Si dudás de un caso límite: detente y reporta al operador antes de actuar. Mejor pausar que invadir scope.

Co-author footer en commits si corresponde.
