# BUG-20260604T031923Z-df336b

**Creado**: 2026-06-04T03:19:23.171Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: La simulacion integra `rutaEtiqueta`: planifica pares consumo-resultado por ruta y ejecuta solo la transicion compatible con el estado current inicial del paso.

## Texto

la función de simulación no tiene adecuadamente integrada su lógica a las rutas de transición

## Screenshots

- [screenshots/01-google-chrome-2026-06-03-23.18.34.png](screenshots/01-google-chrome-2026-06-03-23.18.34.png)
- [screenshots/02-google-chrome-2026-06-03-23.18.44.png](screenshots/02-google-chrome-2026-06-03-23.18.44.png)

## Contexto

```json
{
  "modeloId": "modelo-1",
  "modeloNombre": "Modelo_simu",
  "opdActivoId": "opd-1",
  "opdActivoNombre": "SD",
  "seleccionEntidadId": null,
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-134efee1-2d5e-42ef-8059-4c3aa8f7e63c",
  "vistaMapaActiva": false,
  "url": "https://opforja.sanixai.com/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "viewport": {
    "width": 2133,
    "height": 1070,
    "devicePixelRatio": 0.8999999761581421
  },
  "capturedAt": "2026-06-04T03:19:18.534Z"
}
```
