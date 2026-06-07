# BUG-20260607T220340Z-42c24c

**Creado**: 2026-06-07T22:03:40.753Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: Overlay de la barra de simulación consume `CODEX_HEADER_HEIGHT` desde CodexFrame; un cambio de altura del header propaga sin riesgo de drift.

## Texto

quedó mal puesto el encaje del contenedor de simulación con la barra superior, filtrandose visualmente el fondo

## Causa raíz

Es una regresión del fix `BUG-20260606T041330Z-1f46fe` (commit `d4dcf99`), que bajó el header Codex de 60px a 48px vía `codexFrameRows()` en `app/src/ui/codex/CodexFrame.tsx:34`. El overlay de la simulación (`s.barraOverlayDesktop` en `app/src/ui/simulacion/BarraSimulacion.tsx:359-366`) tenía `top: 60` hardcoded como match con la altura vieja del header. Cuando el header bajó a 48px, el overlay se quedó flotando 12px más abajo, dejando una franja visible del body (background `paperWarm`) entre el header y la barra.

La franja se hizo más notoria con el fix `BUG-20260606T063734Z-52df54` (commit `8b8557c`) que creció la altura de la barra a 3 filas: el bloque de la barra, ahora más opaco y extendido, contrastaba más fuerte contra el hueco del fondo filtrado.

## Fix aplicado

Refactor arquitectónico + 1 línea de cambio semántico. La altura del header queda como SSOT en `CodexFrame.tsx` y el overlay la consume.

**1. `app/src/ui/codex/CodexFrame.tsx`** — nueva constante exportada y `codexFrameRows()` la usa:

```ts
/**
 * Altura del header editorial Codex (primera fila del grid del CodexFrame).
 * SSOT: este es el único lugar donde la altura del header vive como dato.
 * El layout `codexFrameRows()` la usa para construir el `gridTemplateRows`,
 * y los overlays `position: fixed` que se anclan al borde inferior del
 * header (p.ej. `BarraSimulacion.s.barraOverlayDesktop.top`) deben
 * consumir esta constante — nunca un literal.
 */
export const CODEX_HEADER_HEIGHT = 48;

export function codexFrameRows(canvasOnly = false): string {
  return canvasOnly
    ? "minmax(0, 1fr)"
    : `${CODEX_HEADER_HEIGHT}px minmax(0, 1fr)`;
}
```

**2. `app/src/ui/simulacion/BarraSimulacion.tsx`** — el overlay consume la constante:

```ts
import { CODEX_HEADER_HEIGHT } from "../codex/CodexFrame";

barraOverlayDesktop: {
  position: "fixed",
  top: CODEX_HEADER_HEIGHT,  // antes: 60
  left: 0,
  right: 0,
  zIndex: 30,
  pointerEvents: "none",
},
```

## Verificación

- `bun test src/ui/simulacion/` → **15/15 pass** (12 previos + 3 nuevos en el describe "BarraSimulacion overlay (BUG-20260607T220340Z-42c24c)").
- `bun run typecheck` → limpio.
- `bun run build` → OK.
- `bun run lint` → OK.
- `bun run design:governance` → OK.

Tests nuevos en `BarraSimulacion.styles.test.ts`:

- `s.barraOverlayDesktop.top === CODEX_HEADER_HEIGHT` (y === 48)
- `s.barraOverlayDesktop.position === "fixed"`
- `s.barraOverlayDesktop.left/right === 0`
- `s.barraOverlayDesktop.zIndex === 30` (≥ 20 del header, para quedar sobre él)
- `s.barraOverlayDesktop.pointerEvents === "none"` (no intercepta clicks del canvas)

Sonda Playwright `app/scripts/sonda-bug-42c24c.mjs` mide el offset entre el bottom del header y el top de la barra (tolerancia 1px). En prod con la sesión del operador, antes del fix esperaba offset ≈ 12px; después debe ser ≤ 1px.

## Por qué constante exportada en vez de hardcode

Tres razones:

1. **SSOT explícita**: la altura del header es una invariante estructural. Tenerla como constante con comentario JSDoc y un test que la ancla al `codexFrameRows()` hace visible su rol arquitectónico.
2. **Propagación automática**: si un próximo cambio vuelve a mover la altura (p.ej. mobile-readonly Fase 5 con tabs más densos), el overlay de la simulación se ajusta solo.
3. **Testeable**: `expect(s.barraOverlayDesktop.top).toBe(CODEX_HEADER_HEIGHT)` no depende del literal `48` — ancla la relación semántica (overlay consume la constante), no el valor numérico.

Hardcodear `top: 48` con comentario BUG-id también hubiera resuelto el síntoma, pero la siguiente vez que el header cambie el bug reaparecería silenciosamente.

## Otros desajustes revisados (no son bugs)

- El dimming contextual de los botones de la barra superior (Relación/Estado/editor-vacio) sigue intencional. Ver BUG-20260606T041330Z-1f46fe.
- El overflow horizontal del breadcrumb de tabs (HODOM com..., Laboratorio complejo de...) está dentro del contrato: el slot del header tiene `overflow: "hidden"` y el slot del breadcrumb usa `minmax(130px, 220px)`. Si el nombre del modelo es muy largo, se trunca con ellipsis — affordance canónico.

## Pendiente fuera de este corte

- Ninguno propio. La regresión vino de un fix anterior mío y queda corregida con guarda arquitectónica para que no vuelva.

## Screenshots

Antes (capturado por el operador en producción 2026-06-07T22:03Z, viewport 1920×963):

- [screenshots/01-cleanshot-2026-06-07-at-18.02.47.jpg](screenshots/01-cleanshot-2026-06-07-at-18.02.47.jpg) — overlay de la simulación flotando ~12px debajo del header, con el fondo del body filtrándose en la franja.

Después (captura por la sonda contra `https://opforja.sanixai.com` post-fix):

- Generado por `app/scripts/sonda-bug-42c24c.mjs` con `OUT=/path/despues.png`. Sube a esta carpeta con nombre `02-despues-overlay-alineado.png` después de correr la sonda.

## Contexto

```json
{
  "modeloId": "modelo-simulacion-lab-complejo",
  "modeloNombre": "Laboratorio complejo de simulacion OPM 2",
  "opdActivoId": "opd-sd",
  "opdActivoNombre": "SD - Laboratorio de despacho critico",
  "seleccionEntidadId": null,
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-54e678bc-df3b-475c-8b4f-2758c6949e08",
  "vistaMapaActiva": false,
  "url": "https://opforja.sanixai.com/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "viewport": {
    "width": 1920,
    "height": 963,
    "devicePixelRatio": 1
  },
  "capturedAt": "2026-06-07T22:03:37.444Z"
}
```
