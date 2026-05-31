# BUG-20260526T095153Z-c65ba1

**Creado**: 2026-05-26T09:51:53.585Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: Fix en `fbbfc46`. `attrsIndiceEntidad()` ahora emite `display: "none"`. Los identificadores canónicos (`o.13`, `p.03`) ya no se muestran en el canvas. Las utilidades `identificadorCanonicoEntidad`/`identificadorCanonicoApariencia` se conservan para el inspector.

## Texto

podemos sacar los id tipo 0.13 de las cosas?

## Screenshots

- [screenshots/01-cleanshot-2026-05-26-at-05.51.23.jpg](screenshots/01-cleanshot-2026-05-26-at-05.51.23.jpg)

## Contexto

```json
{
  "modeloId": "modelo-1",
  "modeloNombre": "Modelo",
  "opdActivoId": "opd-1",
  "opdActivoNombre": "SD",
  "seleccionEntidadId": "o-13",
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-76f4b1b5-b96e-493a-b1a9-d409facb9c21",
  "vistaMapaActiva": false,
  "url": "https://opforja.sanixai.com/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "viewport": {
    "width": 2133,
    "height": 1032,
    "devicePixelRatio": 0.8999999761581421
  },
  "capturedAt": "2026-05-26T09:51:51.235Z"
}
```
