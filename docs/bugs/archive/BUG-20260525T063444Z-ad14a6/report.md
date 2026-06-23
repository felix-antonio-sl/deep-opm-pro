# BUG-20260525T063444Z-ad14a6

**Creado**: 2026-05-25T06:34:44.041Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: Los enlaces transformadores (consumo, resultado y efecto) y la invocación vuelven a usar punta cerrada simple según la SSOT visual. Se eliminan los markers anómalos: swallowtail en transformadores y rombo en invocación. La invocación conserva el rayo/zigzag del tramo, pero termina con flecha cerrada limpia.

## Texto

las flechas de los enlaces de transformación e invocación siguen siendo anómalos

## Verificación

- `bun test src/render/jointjs/composers/markers.test.ts`
- `bun test src/render/jointjs/proyeccion.test.ts -t "proyecta invocacion|auto-invocacion"`
- `bun test src/render/jointjs/composers/enlace.test.ts`

## Screenshots

- [screenshots/01-cleanshot-2026-05-25-at-02.33.59.jpg](screenshots/01-cleanshot-2026-05-25-at-02.33.59.jpg)

## Contexto

```json
{
  "modeloId": "modelo-1",
  "modeloNombre": "Modelo",
  "opdActivoId": "opd-1",
  "opdActivoNombre": "SD",
  "seleccionEntidadId": null,
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-93a1b453-2dda-4a4d-bb7f-931e84e7b4b9",
  "vistaMapaActiva": false,
  "url": "https://opforja.sanixai.com/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "viewport": {
    "width": 2133,
    "height": 1102,
    "devicePixelRatio": 0.8999999761581421
  },
  "capturedAt": "2026-05-25T06:34:29.290Z"
}
```
