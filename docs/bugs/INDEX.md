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
| Resuelto | 5 |

## Resumen Por Tipo

| Tipo | Cantidad |
|---|---:|
| Bug | 3 |
| Feat | 2 |

## Activos

| Tipo | Estado | Bug/Feat | Creado | Contexto | Resumen | Resolución | Capturas | Nota |
|---|---|---|---|---|---|---|---:|---|
| Feat | Resuelto | [BUG-20260523T185803Z-a0d7bc](BUG-20260523T185803Z-a0d7bc/report.md) | 2026-05-23 18:58Z | HODOM / SD1 | que exista una lista de los bugs y su estado para no repetirnos | Se agrega indice vivo e historico y dialogo visible en UI para bugs/features con estado y resolucion. | 0 | El sidecar regenera INDEX.md/HISTORY.md y la app los consulta via GET /__deep-opm/bug-reports. |
| Bug | Resuelto | [BUG-20260523T174915Z-6ea103](BUG-20260523T174915Z-6ea103/report.md) | 2026-05-23 17:49Z | System Diagram / SD | que este menú desaparezca cuando se haga click en otro punto de la pantalla | Menu principal cierra al hacer pointerdown fuera del panel. | 1 | Regresion E2E BUG-20260523T174915. |
| Bug | Resuelto | [BUG-20260523T174837Z-509ecc](BUG-20260523T174837Z-509ecc/report.md) | 2026-05-23 17:48Z | System Diagram / SD | por que aquí hay una barra de desplazamiento? | La barra de pestañas conserva overflow horizontal funcional pero oculta el scrollbar visual. | 1 | Regresion E2E BUG-20260523T174837. |
| Bug | Resuelto | [BUG-20260520T180859Z-77e6cf](BUG-20260520T180859Z-77e6cf/report.md) | 2026-05-20 18:08Z | Modelo / SD | la barra no se para que sirve y no funciona | La barra contextual de enlace ya expone acciones legibles: Propiedades, Copiar formato, Pegar formato solo cuando aplica e Inspec… | 1 | Cubierto por e2e/15-superficie-contextual.spec.ts; no queda boton Pegar deshabilitado permanente. |
| Feat | Resuelto | [BUG-20260513T050858Z-ad9486](BUG-20260513T050858Z-ad9486/report.md) | 2026-05-13 05:08Z | Comprar Pan / SD | generemos canvas infinito (o muy grande) . de tal manera que vaya ampliandose en la medida que se vayan moviendose cosas hacia los bordes. y genera l… | Canvas grande con crecimiento por padding, fit inicial/cambio de OPD centrado y zoom wheel suavizado a 0.25% max por paso. | 1 | Verificado con tests de helpers/zoom; JointCanvas ejecuta fit al primer render de cada OPD. |
