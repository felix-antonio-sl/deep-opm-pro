# BUG-20260526T150009Z-35087a

**Creado**: 2026-05-26T15:00:09.734Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: Fix en `1a3acb6`. `validarMultiplicidad` ahora acepta `?`. `multiplicidadPlural("?")` → `false` (singular: `un X opcional`).

## Texto

sigue sin generar opls canónicos ni aceptar simbolos como ?  para multiplicidad

## Screenshots

- [screenshots/01-cleanshot-2026-05-26-at-10.59.34.jpg](screenshots/01-cleanshot-2026-05-26-at-10.59.34.jpg)

## Contexto

```json
{
  "modeloId": "modelo-1",
  "modeloNombre": "Modelo",
  "opdActivoId": "opd-1",
  "opdActivoNombre": "SD",
  "seleccionEntidadId": null,
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-a66f7545-aa0a-487c-9c01-cc51e7f55674",
  "vistaMapaActiva": false,
  "url": "https://opforja.sanixai.com/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "viewport": {
    "width": 2133,
    "height": 1070,
    "devicePixelRatio": 0.8999999761581421
  },
  "capturedAt": "2026-05-26T15:00:06.847Z"
}
```
