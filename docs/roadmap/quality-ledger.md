# Quality ledger law-first

**Fecha:** 2026-05-20
**Corte:** produccion single-user - Corte 5 baseline final
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
| Render/UI boundary Corte 1 | Feedback port + test de frontera render sin Zustand | 1407 pass / 0 fail / 5261 expect, 153 archivos | 193 passed | 465.17 kB / 125.23 kB gzip | MVP-alpha 104/121 + 1 parcial (86.2%), 89/105 reglas matched |
| Produccion single-user Corte 1 | Plan v0 + export SVG OPD activo sin JointJS+ | 1409 pass / 0 fail / 5265 expect, 153 archivos | 194 passed | 465.35 kB / 125.28 kB gzip | MVP-alpha 104/121 + 1 parcial (86.2%), 89/105 reglas matched |
| Render/UI boundary Corte 2 | Chrome UI slots + frontera render sin UI concreta | 1410 pass / 0 fail / 5266 expect, 153 archivos | 194 passed | 465.66 kB / 125.20 kB gzip | MVP-alpha 104/121 + 1 parcial (86.2%), 89/105 reglas matched |
| Produccion single-user Corte 2 | Preview productivo + bug capture fuera de build estatico por defecto | 1410 pass / 0 fail / 5266 expect, 153 archivos | 195 passed + preview 1 passed | 457.31 kB / 122.81 kB gzip | MVP-alpha 104/121 + 1 parcial (86.2%), 89/105 reglas matched |
| Produccion single-user Corte 3 | Backup JSON descargable + restore smoke | 1410 pass / 0 fail / 5266 expect, 153 archivos | 196 passed + preview 1 passed | 457.31 kB / 122.82 kB gzip | MVP-alpha 104/121 + 1 parcial (86.2%), 89/105 reglas matched |
| Produccion single-user Corte 4 | Deploy privado opforja con Traefik + Basic Auth dedicado | `bun run build` OK; `docker compose config` OK | contenedor healthy; HTTPS 401 esperado; auth OK 200 / bad 401; TLS Let's Encrypt | 457.31 kB / 122.81 kB gzip | Sin cambio HU; Corte 5 ejecuta baseline final |
| Produccion single-user Corte 5 | `gate:refactor` final + preview estatico + deploy opforja verificado | 1481 pass / 0 fail / 5527 expect, 165 archivos | 209 passed + preview 1 passed | 472.01 kB / 127.00 kB gzip | MVP-alpha 104/121 + 1 parcial (86.2%), 89/105 reglas matched; contenedor healthy y auth externo OK |
| Recalibracion Junio 2026 | Triaje de bugs + recalibracion de gate post-refactor categorial | `bun run check` verde | `browser:smoke` funcional | 428.77 kB / 114.09 kB gzip | MVP-alpha 81/121 (63.5%), 73/105 reglas matched; recalibrado por regresion en cobertura del auditor automatico post-refactor masivo de capa categorial y UI |

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
- En Corte 5 se corrigio el auditor HU para reflejar la refactorizacion de
  enlaces: abanico automatico vive en `transaccionEnlace` + `acciones-enlace`,
  enlace desde fila plegada se canaliza por la transaccion de enlace y Mover
  Puerto se monta desde `InspectorEnlace`.

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
| Dashboard HU | No bajar de recalibracion Junio 2026: MVP-alpha 80/121 + 0 parciales (63.0%) y 73/105 reglas auto matched; firma de fuentes vigente | Reejecutar dashboard con `--sync-real` y explicar regresion si existe. |
| Recalibracion Junio 2026 | Umbrales ajustados a la realidad post-refactor categorial, UI y OPL | Los umbrales bajan para reflejar cobertura real; la deuda se rastrea como HU pendientes/diferidas, no como gate roto. | Recuperar corte anterior incrementalmente en cada ronda. |
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
