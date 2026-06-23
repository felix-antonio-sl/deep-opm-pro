# BUG-20260603T020848Z-7b49ec

**Creado**: 2026-06-03T02:08:48.310Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: op-forja soporta el patrón OPCloud de abanico lógico de efecto desde un objeto hacia procesos: B afecta exactamente/al menos uno de P, Q y R. La creación permite esas ramas, el diagnóstico solo las acepta cuando están agrupadas en O/XOR y OPL reverse conserva el sujeto objeto.

## Texto

quiero mostrar un nuevo patrón súper relevante que se comporta inadecuadamente en nuestro OPforja. pongo como se presenta en OPcloud que es referente .

## Cierre

- Causa raíz: la firma de creación y el OPL reverse asumían que todo efecto sin estado era Proceso -> Objeto; eso hacía que el patrón Objeto -> Procesos de OPCloud no fuera operable/canónico.
- Decisión: permitir Objeto -> Proceso solo como rama potencial de abanico lógico de efecto. Si queda suelto, `validarModelo` mantiene error `efecto-direccion-canonica`.
- Artefactos: `app/src/modelo/operaciones/helpers.ts`, `app/src/modelo/validaciones.ts`, `app/src/opl/parser/planificar.ts`, tests de operaciones, validaciones, OPL generator y OPL reverse.
- Verificación: `cd app && bun run check` -> 1926 pass / 0 fail; `cd app && bun run build` -> OK.

## Screenshots

- [screenshots/01-google-chrome-2026-06-02-22.01.36.png](screenshots/01-google-chrome-2026-06-02-22.01.36.png)
- [screenshots/02-google-chrome-2026-06-02-22.03.00.png](screenshots/02-google-chrome-2026-06-02-22.03.00.png)
- [screenshots/03-google-chrome-2026-06-02-22.06.05.png](screenshots/03-google-chrome-2026-06-02-22.06.05.png)
- [screenshots/04-google-chrome-2026-06-02-22.06.11.png](screenshots/04-google-chrome-2026-06-02-22.06.11.png)

## Contexto

```json
{
  "modeloId": "modelo-1",
  "modeloNombre": "Modelo",
  "opdActivoId": "opd-1",
  "opdActivoNombre": "SD",
  "seleccionEntidadId": null,
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-263f2490-94d8-4f0d-8d2a-c1cbfe9ca68c",
  "vistaMapaActiva": false,
  "url": "https://opforja.sanixai.com/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "viewport": {
    "width": 1603,
    "height": 1070,
    "devicePixelRatio": 0.8999999761581421
  },
  "capturedAt": "2026-06-03T02:08:44.091Z"
}
```
