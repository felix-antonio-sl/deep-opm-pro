# BUG-20260525T021047Z-6ae261

**Creado**: 2026-05-25T02:10:47.240Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: La sombra de esencia física usaba `dropShadow` con `blur:0` + `color:grey` opaco, rindiendo como duplicado duro del contorno (efecto "doble línea"), no como sombra. Corregida a sombra suave (`dx:2, dy:3, blur:2, color:rgba(23,21,17,0.35)`) — desplazada abajo-derecha (canon §3.4) con desenfoque y tinte ink semi-transparente. `composers/entidad.ts`.

## Texto

las sombras no logran efecto grafico correcto

## Screenshots

- [screenshots/01-google-chrome-2026-05-24-22.10.21.png](screenshots/01-google-chrome-2026-05-24-22.10.21.png)
- [screenshots/02-google-chrome-2026-05-24-22.10.18.png](screenshots/02-google-chrome-2026-05-24-22.10.18.png)

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
  "capturedAt": "2026-05-25T02:10:44.538Z"
}
```
