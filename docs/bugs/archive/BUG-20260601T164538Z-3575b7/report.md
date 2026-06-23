# BUG-20260601T164538Z-3575b7

**Creado**: 2026-06-01T16:45:38.503Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: PanelDiagnostico se monta bajo OPL en el margen izquierdo y conserva expandir, colapsar, revalidar, cita y navegación; el inspector derecho queda dedicado a propiedades.

## Texto

El panel de diagnóstico de modelo con advertencias quiero que lo cambiemos al lado izquirdo bajo el panel del OPL. Conservar comportamiento y caracteristicas , pero a la izquierda

## Screenshots

- [screenshots/01-google-chrome-2026-06-01-12.42.17.png](screenshots/01-google-chrome-2026-06-01-12.42.17.png)

## Verificación

- `PW_PORT=5201 bunx playwright test e2e/15-superficie-contextual.spec.ts --workers=1`
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
  "capturedAt": "2026-06-01T16:45:36.267Z"
}
```
