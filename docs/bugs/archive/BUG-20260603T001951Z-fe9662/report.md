# BUG-20260603T001951Z-fe9662

**Creado**: 2026-06-03T00:19:51.129Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: Diagnostico y advertencias metodologicas usan titulos canonicos y citas visibles por URN KORA para R-NOM-PROC, R-NOM-OBJ, R-NOM-EST y capa visual.

## Remediación

- Causa raíz: la superficie de diagnóstico conservaba títulos humanos y referencias del puente local antiguo, aunque la SSOT operativa ya vive en KORA.
- Cambio: títulos de reglas metodológicas actualizados a vocabulario canónico; `ssotRef`/`citaSSOT` visibles migrados a URNs KORA en checkers metodológicos, diagnóstico visual y validación de efecto TS3-TS5.
- Verificación: `bun test src/modelo/diagnostico.test.ts src/modelo/checkers.test.ts src/modelo/validaciones.test.ts` y `bun run typecheck`.

## Texto

actualiza a la nueva ssot y canon el sistema para generar diagnóstico y adventencias

## Screenshots

- [screenshots/01-cleanshot-2026-06-02-at-20.19.23.jpg](screenshots/01-cleanshot-2026-06-02-at-20.19.23.jpg)

## Contexto

```json
{
  "modeloId": "modelo-hodom-completo-v1-5",
  "modeloNombre": "HODOM completo v1_5_",
  "opdActivoId": "opd-sd1",
  "opdActivoNombre": "SD1 - In-zoom Hospitalizacion en domicilio",
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
  "capturedAt": "2026-06-03T00:19:49.207Z"
}
```
