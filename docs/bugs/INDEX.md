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
| Resuelto | 11 |

## Resumen Por Tipo

| Tipo | Cantidad |
|---|---:|
| Bug | 6 |
| Feat | 5 |

## Activos

| Tipo | Estado | Bug/Feat | Creado | Contexto | Resumen | Resolución | Capturas | Nota |
|---|---|---|---|---|---|---|---:|---|
| Bug | Resuelto | [BUG-20260523T201251Z-afcfbe](BUG-20260523T201251Z-afcfbe/report.md) | 2026-05-23 20:12Z | Modelo / SD | despues de la corrección ahora las cosas se crean en otro punto del canvas que no es la esquina superior izquierda, sin embargo la vista no se centra… | La posicion libre inicial nace en el centro geometrico del canvas 7200x5200 y el viewport se enfoca explicitamente ahi para OPDs … | 0 | Cubierto por layout.test y e2e/21-estado-vacio-opm.spec.ts con verificacion de scroll real al centro. |
| Bug | Resuelto | [BUG-20260523T195754Z-dd0c18](BUG-20260523T195754Z-dd0c18/report.md) | 2026-05-23 19:57Z | Modelo / SD | sacar la función del mapa del sistema. no tiene valor actual | La funcion Mapa del sistema se retira de arbol OPD, menu principal y Command Palette. | 1 | Se conserva codigo interno no expuesto para evitar refactor destructivo amplio. |
| Feat | Resuelto | [BUG-20260523T195725Z-1372c7](BUG-20260523T195725Z-1372c7/report.md) | 2026-05-23 19:57Z | Modelo / SD | que el panel opl se mueda redimensionar verticalmente | El panel OPL inferior tiene divisor horizontal para redimensionar verticalmente y doble clic para resetear a 180 px. | 0 | Cubierto por e2e/03-opl-panel.spec.ts. |
| Feat | Resuelto | [BUG-20260523T195651Z-7ff54e](BUG-20260523T195651Z-7ff54e/report.md) | 2026-05-23 19:56Z | Modelo / SD | que al guardar un reporte de bug se copie inmediatamente el codigo id del bug al porta papeles y se cierre el modal | Al guardar un reporte, la app copia el ID del bug al portapapeles y cierra el modal. | 0 | El guardado no falla si el portapapeles no esta disponible. |
| Feat | Resuelto | [BUG-20260523T195613Z-932476](BUG-20260523T195613Z-932476/report.md) | 2026-05-23 19:56Z | Modelo / SD | que haya un atajo de teclado para agregar nuevo bug | El capturador de bugs se abre con Ctrl+Alt+B o Cmd+Alt+B. | 0 | Cubierto por e2e/10-capturador-bugs.spec.ts. |
| Bug | Resuelto | [BUG-20260523T195539Z-276694](BUG-20260523T195539Z-276694/report.md) | 2026-05-23 19:55Z | Modelo / SD | cuando se crea la primera cosa de un diagrama que sea en el centro del canvas , no en la esquina superior izquierda. y que desde ese punto se vayan a… | El canvas hace fit automatico cuando un OPD vacio recibe su primera apariencia, dejando la primera cosa centrada visualmente. | 1 | Cubierto por e2e/21-estado-vacio-opm.spec.ts. |
| Feat | Resuelto | [BUG-20260523T185803Z-a0d7bc](BUG-20260523T185803Z-a0d7bc/report.md) | 2026-05-23 18:58Z | HODOM / SD1 | que exista una lista de los bugs y su estado para no repetirnos | Se agrega indice vivo e historico y dialogo visible en UI para bugs/features con estado y resolucion. | 0 | El sidecar regenera INDEX.md/HISTORY.md y la app los consulta via GET /__deep-opm/bug-reports. |
| Bug | Resuelto | [BUG-20260523T174915Z-6ea103](BUG-20260523T174915Z-6ea103/report.md) | 2026-05-23 17:49Z | System Diagram / SD | que este menú desaparezca cuando se haga click en otro punto de la pantalla | Menu principal cierra al hacer pointerdown fuera del panel. | 1 | Regresion E2E BUG-20260523T174915. |
| Bug | Resuelto | [BUG-20260523T174837Z-509ecc](BUG-20260523T174837Z-509ecc/report.md) | 2026-05-23 17:48Z | System Diagram / SD | por que aquí hay una barra de desplazamiento? | La barra de pestañas conserva overflow horizontal funcional pero oculta el scrollbar visual. | 1 | Regresion E2E BUG-20260523T174837. |
| Bug | Resuelto | [BUG-20260520T180859Z-77e6cf](BUG-20260520T180859Z-77e6cf/report.md) | 2026-05-20 18:08Z | Modelo / SD | la barra no se para que sirve y no funciona | La barra contextual de enlace ya expone acciones legibles: Propiedades, Copiar formato, Pegar formato solo cuando aplica e Inspec… | 1 | Cubierto por e2e/15-superficie-contextual.spec.ts; no queda boton Pegar deshabilitado permanente. |
| Feat | Resuelto | [BUG-20260513T050858Z-ad9486](BUG-20260513T050858Z-ad9486/report.md) | 2026-05-13 05:08Z | Comprar Pan / SD | generemos canvas infinito (o muy grande) . de tal manera que vaya ampliandose en la medida que se vayan moviendose cosas hacia los bordes. y genera l… | Canvas grande con crecimiento por padding, fit inicial/cambio de OPD centrado y zoom wheel suavizado a 0.25% max por paso. | 1 | Verificado con tests de helpers/zoom; JointCanvas ejecuta fit al primer render de cada OPD. |
