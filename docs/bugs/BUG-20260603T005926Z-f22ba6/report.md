# BUG-20260603T005926Z-f22ba6

**Creado**: 2026-06-03T00:59:26.060Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: Split parcial TS4/TS5 acepta tanto metadato TS3 como efectos ya reanclados visualmente a estado de entrada o salida.

## Remediación

- Causa raíz: `splitEffectParcial` rechazaba extremos `Estado` visibles y solo aceptaba metadato oculto `estadoEntradaId`/`estadoSalidaId`.
- Cambio: el kernel resuelve la forma parcial desde TS3 con metadato o desde extremos visibles `Estado -> Proceso` y `Proceso -> Estado`, conservando `efectoEscindido`.
- Verificación: `bun test src/modelo/capacidadesOpcloud.test.ts` y `bun run typecheck`.

## Texto

split del enlace no funcionó

## Screenshots

- [screenshots/01-cleanshot-2026-06-02-at-20.59.09.jpg](screenshots/01-cleanshot-2026-06-02-at-20.59.09.jpg)

## Contexto

```json
{
  "modeloId": "modelo-1",
  "modeloNombre": "Modelo",
  "opdActivoId": "opd-1",
  "opdActivoNombre": "SD",
  "seleccionEntidadId": null,
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-d8c69663-f86c-47ea-a1f8-7dd3145d8adb",
  "vistaMapaActiva": false,
  "url": "https://opforja.sanixai.com/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "viewport": {
    "width": 2133,
    "height": 1070,
    "devicePixelRatio": 0.8999999761581421
  },
  "capturedAt": "2026-06-03T00:59:23.495Z"
}
```
