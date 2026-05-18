# Quality ledger law-first

**Fecha:** 2026-05-18  
**Corte:** refactorizacion total - Corte 10 proceso/refactor  
**Rol:** contrato operativo de calidad posterior a los cortes 0-7. Complementa
el dashboard HU; no lo reemplaza y no edita HU canonicas.

## Principio

La calidad se registra primero como leyes ejecutables y despues como metricas de
proceso. Un detector textual o el dashboard HU pueden aportar evidencia, pero no
sustituyen una ley con nombre estable cuando el borde es critico.

## Baselines

| Corte | Evidencia | `bun run check` | `browser:smoke` | Bundle principal | Dashboard HU |
|---|---|---:|---:|---:|---|
| 14.1 baseline | Brief L3 ronda 14.2 | 888 pass / 0 fail / 2976 expect | 106 passed | 233.48 kB / 62.79 kB gzip | MVP-alpha 100%, 102/102 reglas matched |
| Post L1/L2 local | Ejecutado por L3 el 2026-05-07 | 898 pass / 0 fail / 3525 expect, 90 archivos | No reejecutado en L3 | 233.48 kB / 62.79 kB gzip | `hu-progress.json` 2026-05-07T09:47:32.660Z: MVP-alpha 121/121, 102/102 reglas matched |
| Refactorizacion Corte 7 | Cierre `0d454ae` | 1406 pass / 0 fail / 5260 expect, 152 archivos | 193 passed | 463.71 kB / 124.65 kB gzip | MVP-alpha 99/121 (83.4%), 81/102 reglas matched |
| Corte 8 consistencia | Auditor HU vigente + chunk circular eliminado | 1406 pass / 0 fail / 5260 expect, 152 archivos | 193 passed | 463.44 kB / 124.62 kB gzip | MVP-alpha 104/121 + 1 parcial (86.2%), 89/105 reglas matched |
| Corte 9 cascadas | `gate:refactor` + quality `--check` | 1406 pass / 0 fail / 5260 expect, 152 archivos | 193 passed | 463.61 kB / 124.75 kB gzip | MVP-alpha 104/121 + 1 parcial (86.2%), 89/105 reglas matched |
| Corte 10 proceso | `gate:refactor` cwd-safe + firma HU anti-stale | 1406 pass / 0 fail / 5260 expect, 152 archivos | 193 passed | 464.55 kB / 124.90 kB gzip | MVP-alpha 104/121 + 1 parcial (86.2%), 89/105 reglas matched |

Notas:

- El objetivo historico de 195 kB raw quedo superado por el crecimiento
  funcional posterior. Para esta rama, el baseline vivo de control es 124.62 kB
  gzip; incrementos mayores a +5 kB gzip requieren nota de deuda.
- El warning de chunk circular `feature-dialogos-pesados <-> feature-modales`
  quedo cerrado en Corte 8 al consolidar esa frontera de empaquetado.
- El smoke browser completo sigue siendo gate antes de cerrar cortes de
  consistencia/refactor, porque detecta regresiones de orquestacion modal y UI.
- Desde Corte 10, `quality:gate` compara la firma de fuentes auditadas
  (`app/src`, `app/e2e`, `app/scripts`, `assets/svg/links`) contra la firma
  guardada por `progress-dashboard --sync-real`; si no coincide, el dashboard HU
  se considera stale.

## Leyes activas

| Ley canonica | Evidencia real | Archivo | Estado | Nota |
|---|---|---|---|---|
| `law-json-roundtrip` | test con ese nombre | `app/src/leyes/proyecciones.test.ts` | Activa | Preserva identidad, refinamiento y referencias tras exportar/hidratar. |
| `law-render-stable-metadata` | test con ese nombre | `app/src/leyes/proyecciones.test.ts` | Activa | Preserva metadata OPM y contorno refinado en JointJS. |
| `law-refinement-thing-matrix` | test con ese nombre | `app/src/leyes/proyecciones.test.ts` | Activa | Cubre objeto/proceso x descomposicion/despliegue. |
| `law-refinement-removal` | dos tests con ese nombre | `app/src/leyes/proyecciones.test.ts` | Activa | Remueve subarboles de refinamiento sin huerfanos. |
| `law-opl-safe-lens` | `describe` con ese nombre | `app/src/leyes/opl-reverse.test.ts` | Activa | OPL reverse no borra por ausencia y no muta en preview. |
| `law-store-undo-atomicity` | `law-opl-apply-undo-atomicity` | `app/src/leyes/undo.test.ts` | Activa con deuda de nombre | Cubre atomicidad undo para aplicar OPL libre con multiples patches. |

## Umbrales vigentes

| Eje | Umbral vigente | Accion si falla |
|---|---|---|
| Typecheck + unit tests | `bun run check` verde, 0 fallos | Bloquear corte hasta corregir o documentar rollback. |
| Leyes canonicas | 6/6 activas: JSON, render metadata, refinement matrix, refinement removal, OPL safe lens, undo atomicity | No cerrar 14.2 ni Beta1 si una ley critica desaparece. |
| Browser smoke | Suite completa verde antes de corte visual/producto | Reproducir y corregir antes de promocionar. |
| Bundle principal | No crecer mas de +5 kB gzip sobre 124.62 kB gzip sin nota de deuda | Registrar razon, chunk afectado y plan de reduccion. |
| Dashboard HU | No bajar de Corte 8: MVP-alpha 104/121 + 1 parcial (86.2%) y 89/105 reglas auto matched; firma de fuentes vigente | Reejecutar dashboard con `--sync-real` y explicar regresion si existe. |
| `Compat detector` | 0 nuevos sin issue/deuda declarada | Convertir detector critico en ley o abrir deuda explicita. |

## Deuda aceptada

| Deuda | Estado aceptado | Condicion de salida |
|---|---|---|
| Bundle principal sobre objetivo historico | Aceptado como baseline medido 124.62 kB gzip | Reducir por chunks o justificar incrementos > +5 kB gzip. |
| Refinamiento single-slot | Aceptado por una iteracion para evitar migracion amplia | Decidir/migrar `inzoom? x unfold?` antes de fixtures/import cercanos a OPCloud. |
| APIs legacy `descomponerProceso` / `desplegarObjeto` | Aceptado con leyes de Thing refinement | Renombrar o envolver con API canonica cuando baje blast radius. |
| Nombre real `law-opl-apply-undo-atomicity` | Aceptado como evidencia de `law-store-undo-atomicity` | Renombrar test o agregar alias canonico cuando L1/L2 puedan tocar tests. |
| `Compat detector` existente en `app/src/store.ts` | Retirado en Corte 7; las reglas HU leen archivos reales | Nuevos detectores deben tener deuda declarada o ley asociada. |
| HU-50.004 posicion lateral OPL | Pendiente real; ya no bloquea numeracion/minimizado/AI placeholder en el auditor | Implementar HU-50.004 como feature o mantener pendiente explicita. |

## Lector reproducible

`app/scripts/quality-ledger.mjs` imprime metricas sin escribir archivos y puede
actuar como gate con `--check`:

```bash
cd app
bun run scripts/quality-ledger.mjs
bun run scripts/quality-ledger.mjs --markdown
bun run scripts/quality-ledger.mjs --markdown --check
bun run quality:gate
```

Lee:

- `dist/assets/*.js`, si existe tras `bun run build`;
- `app/src/**/*.test.ts` para ids `law-*`;
- `app/src`, `app/e2e` y `app/scripts` para comentarios `Compat detector`;
- `docs/roadmap/hu-progress.json` para resumen HU y reglas auto.
- `hu-progress.json:autoAudit.sourceFiles.signature` para bloquear dashboards
  stale cuando el codigo auditado cambio sin regenerar.

## Gate operativo antes de Beta1

Antes de promover Beta1, actualizar este ledger con:

1. `bun run gate:refactor`.
2. Salida de `bun run scripts/quality-ledger.mjs --markdown --check`.

`gate:refactor` ejecuta check, lint, build, smoke browser, dashboard HU con
`--sync-real` y el gate del ledger contra los umbrales vigentes.
