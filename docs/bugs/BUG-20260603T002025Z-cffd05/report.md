# BUG-20260603T002025Z-cffd05

**Creado**: 2026-06-03T00:20:25.222Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: El header local del canvas extrae prefijos OPD canonicos como P5.4/LF-04 y trunca el kicker sin invadir el indicador de zoom.

## Remediación

- Causa raíz: `codigoOpd` devolvía el nombre descriptivo completo para OPDs no `SD*`, por ejemplo `P5.4 - Servicios territoriales de campo`.
- Cambio: `codigoOpd` extrae prefijos `SD`, `P`, `LF-*` y `OPD`; `CodexCanvasMount` reserva espacio al zoom y aplica ellipsis al kicker.
- Verificación: `bun test src/ui/arbol/NodoOpd.test.ts src/ui/codex/CodexFrame.test.ts` y `bun run typecheck`.

## Texto

eliminar este solapamiento de texto

## Screenshots

- [screenshots/01-google-chrome-2026-06-02-20.20.09.png](screenshots/01-google-chrome-2026-06-02-20.20.09.png)
- [screenshots/02-google-chrome-2026-06-02-20.20.03.png](screenshots/02-google-chrome-2026-06-02-20.20.03.png)

## Contexto

```json
{
  "modeloId": "modelo-hodom-completo-v1-5",
  "modeloNombre": "HODOM completo v1_5_",
  "opdActivoId": "opd-p5-servicios",
  "opdActivoNombre": "P5.4 - Servicios territoriales de campo",
  "seleccionEntidadId": null,
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-d9b12888-e1a3-420e-9ae0-3dba8ac0d5aa",
  "vistaMapaActiva": false,
  "url": "https://opforja.sanixai.com/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "viewport": {
    "width": 2133,
    "height": 1070,
    "devicePixelRatio": 0.8999999761581421
  },
  "capturedAt": "2026-06-03T00:20:23.519Z"
}
```
