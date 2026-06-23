# BUG-20260601T164425Z-844f4e

**Creado**: 2026-06-01T16:44:25.238Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: Los controles de Texto del rótulo aplican familia, tamaño, negrita, cursiva, color y alineación al estilo de apariencia; Reset elimina solo los campos tipográficos y preserva fill/borde.

## Texto

ninguno de estos controles de este subpanel funcionan

## Screenshots

- [screenshots/01-cleanshot-2026-06-01-at-12.43.53.jpg](screenshots/01-cleanshot-2026-06-01-at-12.43.53.jpg)

## Verificación

- `bun test app/src/modelo/estilos.test.ts`
- `cd app && bun run check`

## Contexto

```json
{
  "modeloId": "modelo-1",
  "modeloNombre": "Modelo",
  "opdActivoId": "opd-11",
  "opdActivoNombre": "SD1",
  "seleccionEntidadId": "o-1",
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-5dd2c7f1-2206-4c08-b194-b1d451fc0be0",
  "vistaMapaActiva": false,
  "url": "https://opforja.sanixai.com/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "viewport": {
    "width": 2133,
    "height": 1102,
    "devicePixelRatio": 0.8999999761581421
  },
  "capturedAt": "2026-06-01T16:44:21.796Z"
}
```
