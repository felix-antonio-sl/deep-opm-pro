# BUG-20260525T020822Z-9e3b9b

**Creado**: 2026-05-25T02:08:22.637Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: La cápsula de estado usaba `rx/ry: calc(h/2)` (stadium/píldora completa). El canon (reglas-opm-estrictas §3.2 línea 224) define el estado como ROUNTANGLE = rectángulo redondeado; la evidencia OPCloud (export-legend `rx="5"`, OpmObject.innerOuter `rx:5`) confirma radio fijo moderado. Corregido a `rx/ry: ESTADOS.radius`. `composers/entidad.ts`.

## Texto

los estados no tienen la forma canónica

## Screenshots

- [screenshots/01-cleanshot-2026-05-24-at-22.08.05.jpg](screenshots/01-cleanshot-2026-05-24-at-22.08.05.jpg)

## Contexto

```json
{
  "modeloId": "modelo-1",
  "modeloNombre": "System Diagram 1",
  "opdActivoId": "opd-35",
  "opdActivoNombre": "SD1",
  "seleccionEntidadId": null,
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-86eab034-584b-4c3e-8a47-8bde223ce13f",
  "vistaMapaActiva": false,
  "url": "https://opforja.sanixai.com/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "viewport": {
    "width": 2133,
    "height": 1102,
    "devicePixelRatio": 0.8999999761581421
  },
  "capturedAt": "2026-05-25T02:08:20.008Z"
}
```
