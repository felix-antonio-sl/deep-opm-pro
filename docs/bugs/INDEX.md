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
| Backlog | 2 |
| Nuevo | 2 |
| Resuelto | 1 |

## Resumen Por Tipo

| Tipo | Cantidad |
|---|---:|
| Bug | 3 |
| Feat | 2 |

## Activos

| Tipo | Estado | Bug/Feat | Creado | Contexto | Resumen | Resolución | Capturas | Nota |
|---|---|---|---|---|---|---|---:|---|
| Feat | Resuelto | [BUG-20260523T185803Z-a0d7bc](BUG-20260523T185803Z-a0d7bc/report.md) | 2026-05-23 18:58Z | HODOM / SD1 | que exista una lista de los bugs y su estado para no repetirnos | Se agrega indice vivo e historico de bugs/features con estado y resolucion. | 0 | El sidecar regenera INDEX.md y HISTORY.md automaticamente. |
| Bug | Nuevo | [BUG-20260523T174915Z-6ea103](BUG-20260523T174915Z-6ea103/report.md) | 2026-05-23 17:49Z | System Diagram / SD | que este menú desaparezca cuando se haga click en otro punto de la pantalla | Pendiente. | 1 | Pendiente de triage. |
| Bug | Nuevo | [BUG-20260523T174837Z-509ecc](BUG-20260523T174837Z-509ecc/report.md) | 2026-05-23 17:48Z | System Diagram / SD | por que aquí hay una barra de desplazamiento? | Pendiente. | 1 | Pendiente de triage. |
| Bug | Backlog | [BUG-20260520T180859Z-77e6cf](BUG-20260520T180859Z-77e6cf/report.md) | 2026-05-20 18:08Z | Modelo / SD | la barra no se para que sirve y no funciona | Pendiente de diseño UX. | 1 | Discoverability de barra contextual; sin cierre dedicado. |
| Feat | Backlog | [BUG-20260513T050858Z-ad9486](BUG-20260513T050858Z-ad9486/report.md) | 2026-05-13 05:08Z | Comprar Pan / SD | generemos canvas infinito (o muy grande) . de tal manera que vaya ampliandose en la medida que se vayan moviendose cosas hacia los bordes. y genera l… | Pendiente. | 1 | Feature: canvas infinito/zoom menos sensible y centrado inicial pendiente. |
