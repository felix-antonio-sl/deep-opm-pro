# BUG-20260523T201251Z-afcfbe

**Creado**: 2026-05-23T20:12:51.526Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: Reabierto por feedback del 2026-05-25: la corrección anterior centraba la primera creación manual, pero no cubría todos los SD/OPD al navegar desde el índice ni toda generación de contenido. Ahora el viewport se enfoca siempre en el centro geométrico del canvas al activar un OPD o poblar por primera vez un OPD vacío; además el asistente de siembra usa la misma posición inicial centrada del canvas, no un layout radial cerca de x/y 0/0.

## Texto

despues de la corrección ahora las cosas se crean en otro punto del canvas que no es la esquina superior izquierda, sin embargo la vista no se centra ahí , sino que vuelve a la esquina usperior izquierda quedando los elementos fuera de foco. debes identificar el centro geométrico del canvas y poner las nuevas cosas creadas en torno a el  y la vista enfocarla en ese centro

## Verificación

- `bun test src/modelo/creacionWizard.test.ts src/modelo/layout.test.ts`
- `bunx playwright test e2e/04-arbol-y-pestanas.spec.ts -g "navega OPDs desde el arbol lateral|BUG-20260523T201251Z-afcfbe"`

## Screenshots

Sin screenshots adjuntos.

## Contexto

```json
{
  "modeloId": "modelo-1",
  "modeloNombre": "Modelo",
  "opdActivoId": "opd-1",
  "opdActivoNombre": "SD",
  "seleccionEntidadId": null,
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-8c9890fa-89f9-487b-8d8d-34e7359dfea4",
  "vistaMapaActiva": false,
  "url": "https://opforja.sanixai.com/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "viewport": {
    "width": 2400,
    "height": 1203,
    "devicePixelRatio": 0.800000011920929
  },
  "capturedAt": "2026-05-23T20:12:49.303Z"
}
```
