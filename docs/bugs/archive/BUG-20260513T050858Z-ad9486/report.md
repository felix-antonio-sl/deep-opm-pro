# BUG-20260513T050858Z-ad9486

**Creado**: 2026-05-13T05:08:58.985Z

## Texto

generemos canvas infinito (o muy grande) . de tal manera que vaya ampliandose en la medida que se vayan moviendose cosas hacia los bordes. y genera la función de zoom no tan sensible

## Anexo 2026-05-23

Adicionalmente: cuando se enfoca/centra la vista sobre el canvas (carga
inicial, "fit", cambio de OPD, etc.), el foco debe quedar en el **centro
del canvas**, no en el extremo superior izquierdo como hoy. El contenido
del OPD activo debe quedar visualmente centrado en el viewport del
modelador.

## Screenshots

- [screenshots/01-google-chrome-2026-05-13-01.05.23.png](screenshots/01-google-chrome-2026-05-13-01.05.23.png)

## Contexto

```json
{
  "modeloId": "modelo-1",
  "modeloNombre": "Comprar Pan",
  "opdActivoId": "opd-1",
  "opdActivoNombre": "SD",
  "seleccionEntidadId": null,
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-mp3lcim7-v3iri4pw",
  "vistaMapaActiva": false,
  "url": "http://138.201.53.205:5173/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
  "viewport": {
    "width": 2400,
    "height": 1203,
    "devicePixelRatio": 0.800000011920929
  },
  "capturedAt": "2026-05-13T05:01:23.865Z"
}
```
