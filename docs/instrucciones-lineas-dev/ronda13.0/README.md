# Ronda 13.0 — Cleanup TIER 1 (refactor evidente, blast bajo, ronda corta ~medio día)

**Fecha**: 2026-05-07
**Base**: `main` @ commit `d99382e` (`docs(handoff): integra línea L0 operador (catálogo demos + UX unificada)`) — HANDOFF vigente con rondas 1-12.1 cerradas. **MVP-α 98.8% ponderado, detector recalibrado, bundle principal 218.99 kB / 59 kB gzip**.
**Objetivo**: ronda corta de 1 línea ejecutora con 5 ítems TIER 1 derivados de la auditoría steipete `docs/auditorias/2026-05-07-refactor-radical-steipete.md` §2. Cada ítem es **reversible, blast bajo, sin debate de taste**. Total ~medio día. Después de esta ronda corta arranca **ronda 13 grande** (T2, 4 líneas paralelas dedicadas a UX foundation).

## 1. Filosofía operativa

- **Ronda corta de cosecha técnica**, no apertura. Solo ejecuta lo que la auditoría steipete clasificó como T1: cambios donde la respuesta correcta es obvia y sin trade-offs reales.
- **Loop verde obligatorio**: cada commit cierra con `cd app && bun run check`; si toca UI/render: `bun run browser:smoke`; si toca proyección o bundle: `bun run build`. Línea base post-ronda-12.1: 673 unit / 2698 expect / 0 fail, 86 smokes (~5 min), chunk principal 218.99 kB / 59 kB gzip.
- **Aditividad estricta** preservada. Cero rename de exports. Cero cambios kernel/render/OPL.
- **Reversibilidad por commit**: cada ítem T1 entra como commit propio; rollback granular si algo falla.
- **Diferimiento absoluto**: T2 (split Toolbar, tokens central completo, methodological-checkers, BarraHerramientasElemento) NO se aborda aquí — va a ronda 13 grande con 4 líneas paralelas.

## 2. Reglas duras comunes

1. **Scope estricto**: solo tocar archivos permitidos por el brief de la línea ejecutora.
2. **No tocar `docs/HANDOFF.md`** desde la ronda. Se actualiza solo en consolidación final del operador.
3. **No introducir dependencias nuevas** (libs, frameworks, utilidades).
4. **Idiomas**: docs y mensajes UI en es-CL; identificadores en estilo del repo.
5. **Tests existentes intactos**: 673 baseline pasa sin tocar.
6. **JSON lossless + OPL invariante**: ronda 13.0 NO toca kernel ni serializadores ni generadores OPL.
7. **Decisión destructiva (T1.1 stashes) requiere autorización explícita del operador antes de ejecutar**. El brief documenta el patrón pero NO ejecuta el drop sin go-ahead.

## 3. Stack y comandos

- Bun 1.3+, TypeScript strict, Preact 10 + Signals, Zustand 5, JointJS 3.7 core, Vite 6, Playwright.

```bash
cd app
bun run check          # 673 unit baseline
bun run browser:smoke  # 86 smokes baseline
bun run build          # chunk principal 218.99 kB / 59 kB gzip baseline
```

Auditoría HU al cierre:

```bash
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real --strict
```

## 4. Diagnóstico y objetivos

Estado post-ronda-12.1: MVP-α 98.8%, detector recalibrado. Auditoría steipete identificó **5 ítems T1** ejecutables sin debate:

| ID | Ítem | Path principal | Costo | Verificación |
|---|---|---|---|---|
| **T1.1** | Limpiar 5 stashes pendientes (decisión destructiva → autorización operador requerida) | `git stash` × 5 | 10 min | `git stash list` vacío |
| **T1.2** | Asignar 9 literales `#3BC3FF`/`#586D8C` activeButton/stickyBadge en Toolbar.tsx a tokens (con tokens nuevos `acentoUiSuave`/`chromeNeutralSuave`) | `app/src/ui/Toolbar.tsx` + `app/src/ui/tokens.ts` | 30 min | smoke `boton-toolbar-activo` verde |
| **T1.3** | Headers de provenance ya identificados por auditoría SSOT 2026-05-07 §RF-1+R4 | `app/src/modelo/operaciones/enlaces.ts:33`, `app/src/modelo/tipos/enlace.ts:10`, `app/src/modelo/tipos/abanico.ts:8`, `app/src/modelo/validaciones.ts:1` | 5 min | grep verde |
| **T1.4** | Particionar `app/e2e/opm-smoke.spec.ts` (3847 LOC / 93 tests) en 8 archivos por dominio | `app/e2e/{01..08}-*.spec.ts` | 1 h | smoke pasa con misma cobertura |
| **T1.5** | Verificar reglas detector con `--strict`; fix paths heredados si rotaron tras commits L0-L3 | `docs/historias-usuario-v2/tools/progress-dashboard.mjs` | 15 min audit + 0-30 fix | dashboard sin diagnostico nuevo |

**Total esperado**: 5 commits atómicos + 1 commit consolidación si emerge cleanup. ~½ día de trabajo neto.

**Objetivos de salida**:
- `git stash list` vacío (con autorización previa del operador).
- 0 literales `#3BC3FF`/`#586D8C` en `Toolbar.tsx` (ya existían en `app/src/ui/tokens.ts:colors.canvas` como referencia documental — no para uso UI; los del chrome migran a `tokens.colors.acentoUi`/`chromeNeutral` + 2 tokens nuevos `acentoUiSuave`/`chromeNeutralSuave`).
- Headers SSOT corregidos en 4 archivos según auditoría 2026-05-07 §RF-1+R4.
- `opm-smoke.spec.ts` particionado en 8 archivos navegables; misma cobertura.
- Detector `--strict` sin diagnostico nuevo.

## 5. Patrones técnicos referenciales

- **`docs/auditorias/2026-05-07-refactor-radical-steipete.md` §2**: detalle T1.1-T1.5 con verificación por ítem.
- **`docs/auditorias/2026-05-07-ssot-opm-extracted.md` §RF-1+R4**: paths exactos a corregir en T1.3.
- **`app/src/ui/tokens.ts` ronda 12.1**: paleta UI separada del canvas semántico (T1.2 amplía con 2 tokens suaves derivados).

## 6. Visión general (1 línea ejecutora)

| ID | Título | Items | Capa | Tamaño | Riesgo |
|---|---|---|---|---|---|
| **L1** | Cleanup TIER 1 (5 ítems steipete: stashes + tokens activeButton + headers + smoke split + detector strict) | T1.1-T1.5 | UI + tests + docs + ledger | S | bajo |

**No hay L2/L3** en ronda 13.0. Es ronda corta de un solo ejecutor.

## 7. Mapa de archivos

| Archivo | T1.1 | T1.2 | T1.3 | T1.4 | T1.5 |
|---|---|---|---|---|---|
| `git stash list` | drop × 5 (autorización) | — | — | — | — |
| `app/src/ui/Toolbar.tsx` | — | aditivo (sustituir 9 literales) | — | — | — |
| `app/src/ui/tokens.ts` | — | aditivo (`acentoUiSuave` + `chromeNeutralSuave`) | — | — | — |
| `app/src/ui/tokens.test.ts` | — | aditivo (asserts tokens nuevos) | — | — | — |
| `app/src/modelo/operaciones/enlaces.ts` | — | — | header SSOT corregido | — | — |
| `app/src/modelo/tipos/enlace.ts` | — | — | header SSOT corregido | — | — |
| `app/src/modelo/tipos/abanico.ts` | — | — | header SSOT corregido | — | — |
| `app/src/modelo/validaciones.ts` | — | — | header SSOT añadido | — | — |
| `app/e2e/opm-smoke.spec.ts` | — | — | — | partido en 8 archivos | — |
| `app/e2e/01-carga-y-workspace.spec.ts` | — | — | — | NUEVO (5-7 tests) | — |
| `app/e2e/02-canvas-y-render.spec.ts` | — | — | — | NUEVO (10-12) | — |
| `app/e2e/03-opl-panel.spec.ts` | — | — | — | NUEVO (9) | — |
| `app/e2e/04-arbol-y-pestanas.spec.ts` | — | — | — | NUEVO (3-4) | — |
| `app/e2e/05-refinamiento-y-plegado.spec.ts` | — | — | — | NUEVO (5-7) | — |
| `app/e2e/06-undo-redo-dirty.spec.ts` | — | — | — | NUEVO (8) | — |
| `app/e2e/07-enlaces-avanzados.spec.ts` | — | — | — | NUEVO (10-12) | — |
| `app/e2e/08-mvp-alpha-residual.spec.ts` | — | — | — | NUEVO (~12) | — |
| `docs/historias-usuario-v2/tools/progress-dashboard.mjs` | — | — | — | — | aditivo si emerge fix |

**Cero overlap entre T1.1-T1.5**.

## 8. Protocolo de conciliación (orden de commits)

Orden recomendado: **T1.3 → T1.5 → T1.2 → T1.4 → T1.1**.

Rationale:
1. **T1.3 headers SSOT primero** (5 min, 4 archivos pequeños): cero impacto runtime, deja la cosecha SSOT cerrada antes de tocar código.
2. **T1.5 detector strict segundo** (15 min audit): valida estado pre-cambios; si emerge fix paths, va antes que T1.4 mueva tests.
3. **T1.2 tokens activeButton tercero** (30 min): cambio aislado en Toolbar + tokens.ts; valida con smoke `boton-toolbar-activo`.
4. **T1.4 split smoke cuarto** (1 h): movimiento mecánico de tests; todos los archivos son nuevos, opm-smoke.spec.ts queda vacío o con un comentario "deprecated, ver 01-08-*.spec.ts".
5. **T1.1 stashes último** (10 min, AUTORIZACIÓN OPERADOR REQUERIDA): destructivo; ejecutar con check previo `git stash show -p stash@{N}` por cada uno.

Después de cada commit: `cd app && bun run check`; si tocó UI: `bun run browser:smoke`; al cierre: `bun run build`.

## 9. Anclaje obligatorio

- **`docs/auditorias/2026-05-07-refactor-radical-steipete.md` §2**: brief T1 detallado.
- **`docs/auditorias/2026-05-07-ssot-opm-extracted.md` §RF-1+R4**: paths headers a corregir.
- **`docs/HANDOFF.md`**: estado vigente.
- **`docs/JOYAS.md`**: tokens canvas invariantes.

## 10. Brief

| Línea | Brief |
|---|---|
| L1 | [linea-1-cleanup-tier1.md](./linea-1-cleanup-tier1.md) |

Prompt para asignar: [prompt-asignacion.md](./prompt-asignacion.md).

## 11. Verificación al cierre

```bash
cd app
bun run check                # 673 unit (sin regresión)
bun run browser:smoke        # 86 smokes (sin regresión, ahora distribuidos en 8 archivos)
bun run build                # chunk principal sin regresión grave
cd ..
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real --strict
```

Métricas esperadas post-ronda 13.0:
- **Unit tests = 673** (sin cambios funcionales).
- **Smoke browser = 86** (sin cambios funcionales; redistribuidos en 8 archivos por dominio).
- **Build**: chunk principal ≈ 218.99 kB (cero impacto significativo).
- **Detector**: cero diagnostico nuevo.
- **Stashes**: 0 pendientes (con autorización operador).
- **Literales `#3BC3FF`/`#586D8C` en `Toolbar.tsx`**: 0 (migrados a tokens).

Si una métrica no se cumple, la línea ejecutora lo declara explícito con rationale.
