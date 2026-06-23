# BUG-20260604T022418Z-a4d837

**Creado**: 2026-06-04T02:24:18.840Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: El generador OPL empareja paths de estado por `rutaEtiqueta` y no reutiliza resultados; asi liquida -> gaseosa no queda como resultado suelto ni se produce liquida -> liquida.

## Texto

la logica de rutas (paths) no funciona

## Screenshots

- [screenshots/01-cleanshot-2026-06-03-at-22.23.57.jpg](screenshots/01-cleanshot-2026-06-03-at-22.23.57.jpg)

## Contexto

```json
{
  "modeloId": "modelo-1",
  "modeloNombre": "Modelo_simu",
  "opdActivoId": "opd-1",
  "opdActivoNombre": "SD",
  "seleccionEntidadId": null,
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-67be0ab6-611b-4413-acdb-3d63eac23f30",
  "vistaMapaActiva": false,
  "url": "https://opforja.sanixai.com/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "viewport": {
    "width": 2133,
    "height": 1070,
    "devicePixelRatio": 0.8999999761581421
  },
  "capturedAt": "2026-06-04T02:24:15.463Z"
}
```
