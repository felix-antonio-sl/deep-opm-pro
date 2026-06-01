# BUG-20260601T164709Z-aad990

**Creado**: 2026-06-01T16:47:09.650Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: Se elimina la barra inferior Codex. Su función real era redundante: viewpoint, atajos y resumen de diagnóstico ya viven en breadcrumb/header, botones de creación y diagnóstico bajo OPL.

## Texto

esto en la barra inferiore es redundante. De hecho creo que deberíamos eliminar la barra inferior ¿cual es su funcionalidad real en este momento?

## Screenshots

- [screenshots/01-cleanshot-2026-06-01-at-12.46.12.jpg](screenshots/01-cleanshot-2026-06-01-at-12.46.12.jpg)

## Verificación

- `PW_PORT=5201 bunx playwright test e2e/01-carga-y-workspace.spec.ts e2e/27-visual-compliance-25-05.spec.ts --workers=1`
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
  "capturedAt": "2026-06-01T16:47:07.440Z"
}
```
