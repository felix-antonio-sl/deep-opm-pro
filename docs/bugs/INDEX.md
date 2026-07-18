# Índice Vivo De Bugs Y Features

Este archivo es el ledger operativo de bugs/features activos. Se regenera desde
`payload.json`/`report.md` de cada `BUG-*` en esta carpeta y desde
`statuses.json`, que es la fuente editable para tipo, estado, resolución y nota.

Histórico completo: [HISTORY.md](HISTORY.md).

Para regenerarlo manualmente:

```bash
cd app && bun run bug:index
```

## Resumen Por Estado

| Estado | Cantidad |
|---|---:|
| Nuevo | 1 |
| Resuelto | 3 |

## Resumen Por Tipo

| Tipo | Cantidad |
|---|---:|
| Bug | 4 |

## Activos

| Tipo | Estado | Bug/Feat | Creado | Contexto | Resumen | Resolución | Capturas | Nota |
|---|---|---|---|---|---|---|---:|---|
| Bug | Resuelto | [BUG-20260709T174709Z-76af16](BUG-20260709T174709Z-76af16/report.md) | 2026-07-09 17:47Z | apuntes HD / SD | no se genera OPL de proceso y cuando estoy en modo taller no se forma ningún OPL | «No se genera OPL de proceso; en modo taller no se forma ningún OPL». Causa raíz única: R-ENT-2 (spec-forja-opl-es §2.0) suprime … | 1 | Un primer intento (cf27104d) fue REVERTIDO (f0faf77f): citaba R-NOM-PROC-1 (política de nominación, no suprime nada) y relajaba solo el display del panel, dejando divergentes editor libre, exports, móvil y puente skill. SSOT firmada y aplicada: spec-forja-opl-es v1.3.0 (pneuma 4ae6428, velar 12/12). Roundtrip verificado por ley (canónico de apunte re-parsea con cero patches, panel.test.ts); e2e/45-opl-proceso-apunte.spec.ts end-to-end. gate:refactor PASS: check 3132/0 + smoke 302/0 + ledger 6/6. Desplegado en opforja.sanixai.com (6ae55b52). |
| Bug | Resuelto | [BUG-20260708T205824Z-7f09f9](BUG-20260708T205824Z-7f09f9/report.md) | 2026-07-08 20:58Z | HODOM completo v2.0 / SD1.M2.1.R - Realizacion de la atencion (prestaciones) | se solapan y sobreescrien los breadcumbs | Los segmentos del breadcrumb (ruta OPD del header) se solapaban y sobreescribían con OPDs de nombre largo (HODOM: «SD1.M2.1.R - R… | 1 | TDD/verificación visual: e2e/44-breadcrumb-overlap.spec.ts mide desbordamiento de texto (scrollWidth vs clientWidth) en viewport real 1920 + barra angosta 900, con screenshot before/after. Unit: src/ui/Breadcrumb.test.ts (codigoBreadcrumb, rutaBreadcrumbCodex con titulo, doctrina de recorte). La doctrina previa «sin ellipsis CSS silencioso» se actualizó conscientemente: el COLAPSO de niveles sigue usando el segmento « … » explícito, pero el recorte de un segmento individual largo ahora usa ellipsis (solución al exceso pedida por el operador). toolbar-overflow 8/8 intacto. gate:refactor PASS: check 3128/0 + lint + design:governance + build + smoke 301/0 + quality ledger 6/6. Desplegado en opforja.sanixai.com. |
| Bug | Resuelto | [BUG-20260708T193209Z-f688a1](BUG-20260708T193209Z-f688a1/report.md) | 2026-07-08 19:32Z | Modelo / SD | El atajo "R" no está activo. no permite enlazar cosas | El atajo R para enlazar retornaba en silencio-cero cuando no habia cosa seleccionada (contexto del reporte: seleccionEntidadId nu… | 0 | TDD por olas (store → atajo → Escape → render → feedback → e2e). Cubierto por src/store/enlaces.test.ts (iniciarEnlaceLibre, transicion 1→2, iniciarRelacionDesdeEntidad), src/app/ports/globalShortcutsPort.test.ts (R hibrido con/sin seleccion, Escape cancela) y e2e/43-enlace-libre.spec.ts (gesto completo dos clicks + Escape). Un intento inicial de resolver el click-destino en modoEnlace.ts rompio la conexion hacia estados (07-enlaces-avanzados:382) por doble-handler; se corrigio centralizando en seleccion.ts. Gate:refactor PASS (check + lint + build + design:governance + smoke 299/0 + quality ledger 6/6). Desplegado en opforja.sanixai.com. |
| Bug | Nuevo | [BUG-20260605T032425Z-422d7d](BUG-20260605T032425Z-422d7d/report.md) | 2026-06-05 03:24Z | Modelo copia / SD | que las pills/capsulas de los estados dentro de los objetos se puedan mover y relocalizar | Pendiente. | 0 |  |
