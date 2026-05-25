# BUG-20260524T171628Z-a8c184

**Creado**: 2026-05-24T17:16:28.763Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: El contorno de descomposición forzaba `strokeDasharray` (discontinuo) a TODO proceso refinado, violando R-CTRN-1 (V-71): el contorno codifica EXCLUSIVAMENTE la afiliación (sistémica=sólido, ambiental=discontinuo) y persiste entre niveles. El refinamiento se marca con stroke GRUESO (4px), no con discontinuidad. Ahora un proceso sistémico refinado conserva contorno sólido; solo el ambiental sigue discontinuo. `composers/entidad.ts`.

## Texto

los proceso descompuestos al ser refinados , aunque sean sistémicos quedan con contorno discontinuo, cuando debería ser continuo

## Screenshots

- [screenshots/01-cleanshot-2026-05-24-at-13.15.27.jpg](screenshots/01-cleanshot-2026-05-24-at-13.15.27.jpg)

## Contexto

```json
{
  "modeloId": "modelo-1",
  "modeloNombre": "Modelo",
  "opdActivoId": "opd-70",
  "opdActivoNombre": "SD1.1.1.1",
  "seleccionEntidadId": null,
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-77290379-a609-45a4-8871-b49c8a09862f",
  "vistaMapaActiva": false,
  "url": "https://opforja.sanixai.com/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "viewport": {
    "width": 2133,
    "height": 1070,
    "devicePixelRatio": 0.8999999761581421
  },
  "capturedAt": "2026-05-24T17:16:26.369Z"
}
```
