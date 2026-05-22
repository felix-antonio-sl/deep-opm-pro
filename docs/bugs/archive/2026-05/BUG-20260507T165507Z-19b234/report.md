# BUG-20260507T165507Z-19b234

**Creado**: 2026-05-07T16:55:07.618Z

## Texto

para que son las funciones dentro del círculo rojo?

## Screenshots

- [screenshots/01-cleanshot-2026-05-07-at-12.54.48.jpg](screenshots/01-cleanshot-2026-05-07-at-12.54.48.jpg)

## Contexto

```json
{
  "modeloId": "modelo-1",
  "modeloNombre": "Diagnostico Clinico",
  "opdActivoId": "opd-1",
  "opdActivoNombre": "SD",
  "seleccionEntidadId": null,
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-movpw6sa-4vukltzn",
  "vistaMapaActiva": false,
  "url": "http://138.201.53.205:5173/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
  "viewport": {
    "width": 1920,
    "height": 963,
    "devicePixelRatio": 1
  },
  "capturedAt": "2026-05-07T16:54:10.472Z"
}
```

## Evaluacion

**Tipo**: UX / discoverability  
**Severidad**: media-baja, pero afecta uso diario.  
**Diagnostico**: los botones marcados no son funciones de dominio nuevas; activan
la creacion continua de cosas. `Modo objeto` permitia crear varios objetos
haciendo clic sucesivamente en el canvas; `Modo proceso` hacia lo mismo para
procesos. El copy era ambiguo porque convivia al lado de `Objeto` y `Proceso`,
que crean una sola cosa o se arrastran al canvas.

## Resolucion Aplicada

- `Modo objeto` -> `Crear varios objetos`
- `Modo proceso` -> `Crear varios procesos`
- Tooltips actualizados para explicar que cada clic en canvas inserta una cosa.
- Smokes desacoplados del texto visible mediante `data-testid` estable:
  `toolbar-modo-creacion-objeto` y `toolbar-modo-creacion-proceso`.
