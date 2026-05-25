# BUG-20260525T052239Z-445a97

**Creado**: 2026-05-25T05:22:39.761Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: Atajos O/P/S/R de creacion con canvas activo cableados en globalShortcutsPort.ts (ctx canvas) a crearObjetoDemo/crearProcesoDemo/agregarEstadoSmart/elegirTipoEnlace, con guards de seleccion para S y R y guard de foco via atajosTeclado.ts (no dispara en inputs/dialogos). Tests anadidos.

## Texto

cuando esté modelando con el canvas activo asegúrate que lo de la imagen adjunta se cumpla, es decir, al apretar O se cree un objeto. al apretar S (con un objeto seleccionado) se cree un estado ,, etc

## Screenshots

- [screenshots/01-cleanshot-2026-05-25-at-01.21.25.jpg](screenshots/01-cleanshot-2026-05-25-at-01.21.25.jpg)

## Contexto

```json
{
  "modeloId": "modelo-1",
  "modeloNombre": "System Diagram",
  "opdActivoId": "opd-1",
  "opdActivoNombre": "SD",
  "seleccionEntidadId": null,
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-7895dc18-aeeb-4425-82f5-fb26a039a971",
  "vistaMapaActiva": false,
  "url": "https://opforja.sanixai.com/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "viewport": {
    "width": 2133,
    "height": 1102,
    "devicePixelRatio": 0.8999999761581421
  },
  "capturedAt": "2026-05-25T05:22:36.872Z"
}
```
