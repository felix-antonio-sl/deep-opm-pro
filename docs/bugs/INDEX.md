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
| Nuevo | 2 |

## Resumen Por Tipo

| Tipo | Cantidad |
|---|---:|
| Bug | 2 |

## Activos

| Tipo | Estado | Bug/Feat | Creado | Contexto | Resumen | Resolución | Capturas | Nota |
|---|---|---|---|---|---|---|---:|---|
| Bug | Nuevo | [BUG-20260605T032425Z-422d7d](BUG-20260605T032425Z-422d7d/report.md) | 2026-06-05 03:24Z | Modelo copia / SD | que las pills/capsulas de los estados dentro de los objetos se puedan mover y relocalizar | Pendiente. | 0 |  |
| Bug | Nuevo | [BUG-20260603T193134Z-f314c4](BUG-20260603T193134Z-f314c4/report.md) | 2026-06-03 19:31Z | HODOM completo v1.6 / SD0-C - Hospitalizacion en domicilio | El generador OPL no verbaliza la transición de estados de un efecto TS3 compacto: todo enlace efecto con estadoEntradaId/estadoSalidaId se emite como… | Pendiente. | 0 |  |
