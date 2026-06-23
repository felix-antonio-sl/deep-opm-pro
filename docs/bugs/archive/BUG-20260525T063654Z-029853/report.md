# BUG-20260525T063654Z-029853

**Creado**: 2026-05-25T06:36:54.600Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: Los proxies externos materializados al descomponer una cosa ya no usan `x: 24`; se posicionan relativos al contorno refinado centrado en el canvas geométrico.

## Texto

al descomponer los objetos relacionados se presentan en el borde izquierdo del canvas, inclumpliendo la regla de que todo se tiene que armar y ordenar a partir del centro geométrico del canvas

## Resolución técnica

- Causa raíz: `materializarAparienciasExternas` ubicaba los externos de entrada con una coordenada absoluta `x: 24`, heredada de un layout previo al centrado geométrico de OPDs hijos.
- Corrección: los externos de entrada se colocan a la izquierda del contorno refinado (`contorno.x - width - 40`) y los de salida a la derecha (`contorno.x + contorno.width + 40`), preservando la distribución alrededor del centro geométrico del canvas.
- Cobertura: prueba de regresión `BUG-20260525T063654Z-029853 centra proxies externos de entrada respecto del contorno refinado`.

## Verificación

- `bun test src/modelo/operaciones.test.ts -t BUG-20260525T063654Z-029853`
- `bun test src/modelo/operaciones.test.ts src/modelo/operaciones/refinamiento/helpers.test.ts src/leyes/refinamiento-cascadas.test.ts src/modelo/layout.test.ts`

## Screenshots

- [screenshots/01-cleanshot-2026-05-25-at-02.35.53.jpg](screenshots/01-cleanshot-2026-05-25-at-02.35.53.jpg)

## Contexto

```json
{
  "modeloId": "modelo-1",
  "modeloNombre": "Modelo",
  "opdActivoId": "opd-23",
  "opdActivoNombre": "SD1.1",
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
  "capturedAt": "2026-05-25T06:36:51.003Z"
}
```
