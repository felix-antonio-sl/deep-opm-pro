# BUG-20260603T022341Z-cc4801

**Creado**: 2026-06-03T02:23:41.133Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: El inspector de enlaces expone un editor de porcentajes para abanicos XOR; aplica una policy de probabilidades por rama, valida suma 100%, persiste pesos y muestra los porcentajes en el canvas.

## Texto

No está en la UI/UX la asignación de probabilidades

## Cierre

- Causa raíz: la semántica de probabilidades explícitas ya existía de forma parcial en kernel/render/decisión, pero la UI solo permitía editar `probabilidad` para enlaces con modificador `evento`.
- Solución: se agregó una operación canónica de abanico XOR (`definirProbabilidadesAbanico`) y una superficie en el inspector con porcentajes por rama, suma visible, validación de 100% y limpieza de la policy.
- Verificación: `bun run check`, `bun run lint`, `bun run design:governance`, `bun run build` y `PW_PORT=5273 bunx playwright test e2e/02-canvas-y-render.spec.ts -g "renderiza abanicos" --workers=1`.

## Screenshots

- [screenshots/01-cleanshot-2026-06-02-at-22.23.17.jpg](screenshots/01-cleanshot-2026-06-02-at-22.23.17.jpg)

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
    "width": 2133,
    "height": 1070,
    "devicePixelRatio": 0.8999999761581421
  },
  "capturedAt": "2026-06-03T02:23:38.919Z"
}
```
