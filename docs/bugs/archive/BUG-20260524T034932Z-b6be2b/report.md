# BUG-20260524T034932Z-b6be2b

**Creado**: 2026-05-24T03:49:32.407Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: El OPD hijo creado por refinamiento se ancla al centro geometrico del canvas en descomposicion.ts/despliegue.ts; el encuadre existente (encuadrarViewportEnOpd) ya centra el viewport. Cubierto por e2e/05 con asercion de scroll/centrado.

## Texto

cuando refino en un diagrama el foco de la vista vuelve a la esquina superior izquierda, cuando deberia enfocarse nuevamente en el centro geométrico del canvas, en donde muy bien , se presenta el diagrama refinado

## Screenshots

Sin screenshots adjuntos.

## Contexto

```json
{
  "modeloId": "modelo-1",
  "modeloNombre": "Modelo",
  "opdActivoId": "opd-13",
  "opdActivoNombre": "SD1",
  "seleccionEntidadId": "p-3",
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-19acaa69-c733-4d0f-842c-b3d0f4595f99",
  "vistaMapaActiva": false,
  "url": "https://opforja.sanixai.com/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "viewport": {
    "width": 2400,
    "height": 1203,
    "devicePixelRatio": 0.800000011920929
  },
  "capturedAt": "2026-05-24T03:49:29.510Z"
}
```
