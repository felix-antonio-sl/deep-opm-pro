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
| Resuelto | 1 |

## Resumen Por Tipo

| Tipo | Cantidad |
|---|---:|
| Bug | 2 |

## Activos

| Tipo | Estado | Bug/Feat | Creado | Contexto | Resumen | Resolución | Capturas | Nota |
|---|---|---|---|---|---|---|---:|---|
| Bug | Resuelto | [BUG-20260708T193209Z-f688a1](BUG-20260708T193209Z-f688a1/report.md) | 2026-07-08 19:32Z | Modelo / SD | El atajo "R" no está activo. no permite enlazar cosas | El atajo R para enlazar retornaba en silencio-cero cuando no habia cosa seleccionada (contexto del reporte: seleccionEntidadId nu… | 0 | TDD por olas (store → atajo → Escape → render → feedback → e2e). Cubierto por src/store/enlaces.test.ts (iniciarEnlaceLibre, transicion 1→2, iniciarRelacionDesdeEntidad), src/app/ports/globalShortcutsPort.test.ts (R hibrido con/sin seleccion, Escape cancela) y e2e/43-enlace-libre.spec.ts (gesto completo dos clicks + Escape). Un intento inicial de resolver el click-destino en modoEnlace.ts rompio la conexion hacia estados (07-enlaces-avanzados:382) por doble-handler; se corrigio centralizando en seleccion.ts. Gate:refactor PASS (check + lint + build + design:governance + smoke 299/0 + quality ledger 6/6). Desplegado en opforja.sanixai.com. |
| Bug | Nuevo | [BUG-20260605T032425Z-422d7d](BUG-20260605T032425Z-422d7d/report.md) | 2026-06-05 03:24Z | Modelo copia / SD | que las pills/capsulas de los estados dentro de los objetos se puedan mover y relocalizar | Pendiente. | 0 |  |
