# BUG-20260525T060646Z-4e8a3e

**Creado**: 2026-05-25T06:06:46.908Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: La sombra fisica usa dropShadow mas visible (`dx:4`, `dy:4`, `blur:2`, `color:rgba(23, 21, 17, 0.55)`) sin aplicar sombra a cosas informacionales. Cubierto por `app/src/leyes/proyecciones.test.ts`.

## Texto

la sombra de las cosas fisicas está muy tenue, apenas se distingue la diferencia con las cosas informacionales

## Screenshots

- [screenshots/01-cleanshot-2026-05-25-at-02.06.17.jpg](screenshots/01-cleanshot-2026-05-25-at-02.06.17.jpg)

## Contexto

```json
{
  "modeloId": "modelo-1",
  "modeloNombre": "Modelo",
  "opdActivoId": "opd-1",
  "opdActivoNombre": "SD",
  "seleccionEntidadId": null,
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-be09dfa1-56db-4a8c-890f-4565ddbe03ba",
  "vistaMapaActiva": false,
  "url": "https://opforja.sanixai.com/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "viewport": {
    "width": 2133,
    "height": 1102,
    "devicePixelRatio": 0.8999999761581421
  },
  "capturedAt": "2026-05-25T06:06:44.468Z"
}
```
