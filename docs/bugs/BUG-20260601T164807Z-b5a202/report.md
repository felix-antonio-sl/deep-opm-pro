# BUG-20260601T164807Z-b5a202

**Creado**: 2026-06-01T16:48:07.104Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: Se retiran los botones visibles dedicados a abrir la paleta de comandos; la paleta sigue disponible por Ctrl/Cmd+K y los tests/helpers usan esa entrada canónica.

## Texto

el botón para abrir la paleta de comandos, no lo uso. saquemoslo

## Screenshots

- [screenshots/01-cleanshot-2026-06-01-at-12.47.35.jpg](screenshots/01-cleanshot-2026-06-01-at-12.47.35.jpg)

## Verificación

- `PW_PORT=5202 bunx playwright test e2e/12-toolbar-overflow.spec.ts --workers=1`
- `cd app && bun run check`

## Contexto

```json
{
  "modeloId": "modelo-1",
  "modeloNombre": "Modelo",
  "opdActivoId": "opd-11",
  "opdActivoNombre": "SD1",
  "seleccionEntidadId": null,
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
  "capturedAt": "2026-06-01T16:48:04.972Z"
}
```
