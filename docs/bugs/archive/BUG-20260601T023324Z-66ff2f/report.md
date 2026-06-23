# BUG-20260601T023324Z-66ff2f

**Creado**: 2026-06-01T02:33:24.975Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: Los enlaces transformadores consumo, resultado, efecto e invocación usan swallowtail cerrado OPCloud/JOYAS con interior paper y contorno ink; invocación conserva rayo/zigzag en el tramo.

## Texto

después de muchos intentos, aún no tenemos la flecha canónica para los enlaces de transformación. Primero adjunto la screenshot de como es ahora y despues las de como debería ser (referencias opcloud)

## Screenshots

- [screenshots/01-google-chrome-2026-05-31-22.31.40.png](screenshots/01-google-chrome-2026-05-31-22.31.40.png)
- [screenshots/02-google-chrome-2026-05-31-22.31.56.png](screenshots/02-google-chrome-2026-05-31-22.31.56.png)
- [screenshots/03-google-chrome-2026-05-31-22.30.59.png](screenshots/03-google-chrome-2026-05-31-22.30.59.png)
- [screenshots/04-google-chrome-2026-05-31-22.31.08.png](screenshots/04-google-chrome-2026-05-31-22.31.08.png)

## Verificación

- `bun test src/render/jointjs/composers/markers.test.ts src/render/jointjs/proyeccion.test.ts -t "marker|efecto|procedimentales|transformadores|invocacion"`
- `PW_PORT=5187 bunx playwright test e2e/14-canvas-fidelity.spec.ts -g "modelo markers canonicos" --workers=1`

## Contexto

```json
{
  "modeloId": "modelo-1",
  "modeloNombre": "Modelo",
  "opdActivoId": "opd-1",
  "opdActivoNombre": "SD",
  "seleccionEntidadId": null,
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-60469857-846f-4dc1-acd6-753029b057b0",
  "vistaMapaActiva": false,
  "url": "https://opforja.sanixai.com/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "viewport": {
    "width": 2133,
    "height": 1102,
    "devicePixelRatio": 0.8999999761581421
  },
  "capturedAt": "2026-06-01T02:33:20.794Z"
}
```
