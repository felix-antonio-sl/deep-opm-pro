# Quality ledger law-first

**Fecha:** 2026-05-07  
**Corte:** ronda 14.2 - leyes ejecutables + ledger de calidad  
**Rol:** contrato operativo previo a Beta1. Complementa el dashboard HU; no lo
reemplaza y no edita HU canonicas.

## Principio

La calidad se registra primero como leyes ejecutables y despues como metricas de
proceso. Un detector textual o el dashboard HU pueden aportar evidencia, pero no
sustituyen una ley con nombre estable cuando el borde es critico.

## Baselines

| Corte | Evidencia | `bun run check` | `browser:smoke` | Bundle principal | Dashboard HU |
|---|---|---:|---:|---:|---|
| 14.1 baseline | Brief L3 ronda 14.2 | 888 pass / 0 fail / 2976 expect | 106 passed | 233.48 kB / 62.79 kB gzip | MVP-alpha 100%, 102/102 reglas matched |
| Post L1/L2 local | Ejecutado por L3 el 2026-05-07 | 898 pass / 0 fail / 3525 expect, 90 archivos | No reejecutado en L3 | 233.48 kB / 62.79 kB gzip | `hu-progress.json` 2026-05-07T09:47:32.660Z: MVP-alpha 121/121, 102/102 reglas matched |

Notas:

- El bundle principal sigue sobre el objetivo historico de 195 kB. Se acepta
  como deuda medida, no como nuevo objetivo.
- El build post L1/L2 mantiene el mismo main bundle que el baseline 14.1:
  `dist/assets/index-*.js` 233.48 kB / 62.79 kB gzip.
- El smoke browser completo es gate antes de cortes visuales o Beta1. L3 no lo
  requiere para este slice documental/script lector.

## Leyes activas

| Ley canonica | Evidencia real | Archivo | Estado | Nota |
|---|---|---|---|---|
| `law-json-roundtrip` | test con ese nombre | `app/src/leyes/proyecciones.test.ts` | Activa | Preserva identidad, refinamiento y referencias tras exportar/hidratar. |
| `law-render-stable-metadata` | test con ese nombre | `app/src/leyes/proyecciones.test.ts` | Activa | Preserva metadata OPM y contorno refinado en JointJS. |
| `law-refinement-thing-matrix` | test con ese nombre | `app/src/leyes/proyecciones.test.ts` | Activa | Cubre objeto/proceso x descomposicion/despliegue. |
| `law-refinement-removal` | dos tests con ese nombre | `app/src/leyes/proyecciones.test.ts` | Activa | Remueve subarboles de refinamiento sin huerfanos. |
| `law-opl-safe-lens` | `describe` con ese nombre | `app/src/leyes/opl-reverse.test.ts` | Activa | OPL reverse no borra por ausencia y no muta en preview. |
| `law-store-undo-atomicity` | `law-opl-apply-undo-atomicity` | `app/src/leyes/undo.test.ts` | Activa con deuda de nombre | Cubre atomicidad undo para aplicar OPL libre con multiples patches. |

## Umbrales iniciales

| Eje | Umbral 14.2 | Accion si falla |
|---|---|---|
| Typecheck + unit tests | `bun run check` verde, 0 fallos | Bloquear corte hasta corregir o documentar rollback. |
| Leyes canonicas | 6/6 activas: JSON, render metadata, refinement matrix, refinement removal, OPL safe lens, undo atomicity | No cerrar 14.2 ni Beta1 si una ley critica desaparece. |
| Browser smoke | Suite completa verde antes de corte visual/producto | Reproducir y corregir antes de promocionar. |
| Bundle principal | No crecer mas de +5 kB gzip sobre 62.79 kB sin nota de deuda | Registrar razon, chunk afectado y plan de reduccion. |
| Dashboard HU | MVP-alpha debe mantenerse 100% y reglas auto 102/102 matched | Reejecutar dashboard y explicar regresion. |
| `Compat detector` | 0 nuevos sin issue/deuda declarada | Convertir detector critico en ley o abrir deuda explicita. |

## Deuda aceptada

| Deuda | Estado aceptado | Condicion de salida |
|---|---|---|
| Bundle principal sobre 195 kB | Aceptado como baseline medido 62.79 kB gzip | Reducir por chunks o justificar incrementos > +5 kB gzip. |
| Refinamiento single-slot | Aceptado por una iteracion para evitar migracion amplia | Decidir/migrar `inzoom? x unfold?` antes de fixtures/import cercanos a OPCloud. |
| APIs legacy `descomponerProceso` / `desplegarObjeto` | Aceptado con leyes de Thing refinement | Renombrar o envolver con API canonica cuando baje blast radius. |
| Nombre real `law-opl-apply-undo-atomicity` | Aceptado como evidencia de `law-store-undo-atomicity` | Renombrar test o agregar alias canonico cuando L1/L2 puedan tocar tests. |
| `Compat detector` existente en `app/src/store.ts` | Retirado en Corte 7; las reglas HU leen archivos reales | Nuevos detectores deben tener deuda declarada o ley asociada. |

## Lector reproducible

`app/scripts/quality-ledger.mjs` imprime metricas sin escribir archivos:

```bash
cd app
bun run scripts/quality-ledger.mjs
bun run scripts/quality-ledger.mjs --markdown
```

Lee:

- `dist/assets/*.js`, si existe tras `bun run build`;
- `app/src/**/*.test.ts` para ids `law-*`;
- `app/src`, `app/e2e` y `app/scripts` para comentarios `Compat detector`;
- `docs/roadmap/hu-progress.json` para resumen HU y reglas auto.

## Gate operativo antes de Beta1

Antes de promover Beta1, actualizar este ledger con:

1. `bun run check`.
2. `bun run lint`.
3. `bun run build` y medicion del main bundle.
4. `bun run browser:smoke`.
5. `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real`.
6. Salida de `bun run scripts/quality-ledger.mjs`.
