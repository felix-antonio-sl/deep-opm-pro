# Quality ledger law-first

**Fecha:** 2026-06-05
**Estado:** sistema de avance HU retirado por decisión del operador.

## Principio

La calidad del producto se gobierna por checks ejecutables, leyes falsificables y
smoke de interacción. El backlog HU puede orientar conversación histórica, pero
ya no produce porcentaje de avance, dashboard, firma de fuentes ni umbral de
cierre.

Lectura estructural: el sistema retirado era un observador parcial del producto,
no una preservación fiel de comportamiento. Mezclarlo con `quality:gate`
convertía una métrica documental en autoridad operativa. Desde este corte, el
gate vuelve a medir artefactos ejecutables.

## Gates vivos

| Gate | Comando | Rol |
|---|---|---|
| Typecheck + unit tests | `bun run check` | Integridad TS y leyes/unit tests. |
| Lint | `bun run lint` | Higiene estática de `app/src`. |
| Build | `bun run build` | Bundle productivo en `app/dist`. |
| Diseño | `bun run design:governance` | Cumplimiento de `ui-forja`. |
| Smoke browser | `bun run browser:smoke` | Regresión funcional de UI/canvas. |
| Quality ledger | `bun run quality:gate` | Bundle, leyes canónicas y compat detectors. |

`bun run gate:refactor` encadena esos gates. No regenera dashboards ni toca HU.

## Umbrales vigentes

| Eje | Umbral | Acción si falla |
|---|---|---|
| Bundle principal | No superar 129.62 kB gzip sin nota de deuda | Reducir, dividir chunk o documentar incremento deliberado. |
| Leyes canónicas | 6/6 activas | Restaurar ley o registrar cambio de canon con prueba equivalente. |
| Compat detectors | 0 | Convertir en ley, eliminar deuda o registrar issue explícito. |

Las leyes canónicas medidas por `quality-ledger.mjs` son:

- `law-json-roundtrip`
- `law-render-stable-metadata`
- `law-refinement-thing-matrix`
- `law-refinement-removal`
- `law-opl-safe-lens`
- `law-store-undo-atomicity`

## Lector reproducible

`app/scripts/quality-ledger.mjs` imprime métricas sin escribir archivos y puede
actuar como gate con `--check`:

```bash
cd app
bun run scripts/quality-ledger.mjs
bun run scripts/quality-ledger.mjs --markdown
bun run scripts/quality-ledger.mjs --markdown --check
bun run quality:gate
```

Lee solamente:

- `dist/assets/*.js`, si existe tras `bun run build`;
- `app/src/**/*.test.ts` para ids `law-*`;
- `app/src`, `app/e2e` y `app/scripts` para comentarios `Compat detector`.

No lee `docs/roadmap/hu-progress.*` ni cualquier otro artefacto de avance HU.

## Retiro 2026-06-05

El retiro elimina:

- generador `docs/historias-usuario-v2/tools/progress-dashboard.mjs`;
- artefactos `docs/roadmap/hu-progress.*`;
- baselines HU derivados en `docs/roadmap/hu-baseline-*` y
  `docs/roadmap/hu-no-cubiertas-*`;
- dependencia de dashboard en `app/package.json` y
  `app/scripts/quality-ledger.mjs`.

La historia git queda como red de recuperación. No reintroducir porcentajes HU
como gate sin una decisión explícita del operador.
