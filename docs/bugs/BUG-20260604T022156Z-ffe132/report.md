# BUG-20260604T022156Z-ffe132

**Creado**: 2026-06-04T02:21:56.357Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: La proyeccion reconoce el par Estado -> Proceso -> Estado como una ruta logica de transicion y suprime marcas duplicadas en la rama de salida. El emparejamiento se hace solo por `rutaEtiqueta`, no por etiqueta libre.

## Texto

la lógica de rutas (paths) no está realizada

## Screenshots

- [screenshots/01-cleanshot-2026-06-03-at-22.21.34.jpg](screenshots/01-cleanshot-2026-06-03-at-22.21.34.jpg)

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
  "capturedAt": "2026-06-04T02:21:52.174Z"
}
```
