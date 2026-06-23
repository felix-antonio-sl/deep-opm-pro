# BUG-20260604T040903Z-37ebd2

**Creado**: 2026-06-04T04:09:03.059Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: El planificador expande una cadena ruteada de transiciones de estado sobre el mismo objeto en ocurrencias sucesivas del proceso. En el caso Agua/Calentar, `sol-liq` y `liq-gas` son dos pasos ejecutables, por lo que la corrida completa termina en `gaseosa` y no queda a medio camino.

## Texto

simula 1 solo paso en vez de 2. transitó un sólo par de transición quedando a medio camino

## Screenshots

- [screenshots/01-google-chrome-2026-06-04-00.07.45.png](screenshots/01-google-chrome-2026-06-04-00.07.45.png)
- [screenshots/02-google-chrome-2026-06-04-00.07.54.png](screenshots/02-google-chrome-2026-06-04-00.07.54.png)

## Contexto

```json
{
  "modeloId": "modelo-1",
  "modeloNombre": "Modelo_simu",
  "opdActivoId": "opd-1",
  "opdActivoNombre": "SD",
  "seleccionEntidadId": null,
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-efb15b19-ac72-45fc-9773-5e1937e2657a",
  "vistaMapaActiva": false,
  "url": "https://opforja.sanixai.com/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "viewport": {
    "width": 2133,
    "height": 1070,
    "devicePixelRatio": 0.8999999761581421
  },
  "capturedAt": "2026-06-04T04:09:00.968Z"
}
```
