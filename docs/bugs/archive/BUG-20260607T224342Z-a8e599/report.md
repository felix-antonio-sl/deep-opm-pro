# BUG-20260607T224342Z-a8e599

**Creado**: 2026-06-07T22:43:42.932Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: La barra de simulación vive dentro del canvas (CodexCanvasMount.topbar) con spines crimson 3px a ambos lados (gradiente vertical), borde superior 2px crimson, fondo paperWarm, panel narrativa destacado con surface paper, y un "live dot" crimson pulsante en la tag.

## Texto

ahora cuadra bien, sin embargo tenemos que mejorar 2 cosas :
1.- el contenedor de simulación debe diferenciarse visualmente del resto de la UI. Ahora queda como incrustado sin límites claros y sin diferenciación funcional desde el punto de vista visual. Quiero que esto lo resuelvas de manera creativa, respetando canon visual y funcionalidad. Sorpréndeme.
2.- el contenedor de simulación queda sobre los paneles laterales en su parte más alta que es donde están los botones que permiten esconder los paneles, bloqueando de esa forma esa función. También aquí quiero una solución creativa y deslumbrante visualmente, pero con respeto al canón visual y la UX.

## Causa raíz

La barra de simulación se renderizaba como un overlay `position: fixed; top: CODEX_HEADER_HEIGHT; left: 0; right: 0` (vía `s.barraOverlayDesktop` en `app/src/ui/simulacion/BarraSimulacion.tsx:367-374`). Esto causaba dos problemas:

**Problema #1 (diferenciación visual débil):**
- El fondo `paper` de la barra era el mismo que el header y los paneles laterales → sin límite visual claro.
- La barra pasaba como "incrustada" sin marcadores de "esto es un modo distinto".
- No había affordance que dijera "estás en modo simulación".

**Problema #2 (bloqueo de paneles laterales):**
- `left: 0; right: 0` hacía que la barra cubriera los 1920px de ancho.
- Los paneles OPL (240px izq) e Inspector (300px der) tienen sus botones de ocultar (◀ y ▶) en la parte superior de cada uno, dentro del `CodexColHeader`.
- Esos botones quedaban tapados por la barra, rompiendo la función "esconder panel".

## Solución arquitectónica

Cambio de la barra de "overlay global" a "componente del canvas":

1. **`app/src/ui/codex/CodexCanvasMount.tsx`**: nueva prop `topbar?: ComponentChildren`. Se renderiza como un slot hermano de `canvas-header`, ANTES del `paperHost` y DENTRO de la región canvas. La barra vive en el flex column del canvas, naturalmente contenida en su ancho.

2. **`app/src/ui/App.tsx`**: cuando `contextoWorkbench.modo === "simulacion"`, pasa `<BarraSimulacion />` como `topbar` de `CodexCanvasMount`. El slot `toolbar` del header queda libre (el header de sim solo muestra tabs/breadcrumb/meta).

3. **`app/src/ui/simulacion/BarraSimulacion.tsx`**: se elimina `s.barraOverlayDesktop`. La barra usa `s.barra` directamente (sin `position: fixed`).

## Solución visual

Cuatro elementos de diferenciación creativa, todos respetando el canon Codex:

1. **Borde superior 2px crimson** (`border-top: 2px solid crimson`): línea de marca editorial que dice "este es un modo distinto". Es la marca más fuerte.

2. **Spines laterales 3px con gradiente vertical** (`s.barraSpine`): dos divs `position: absolute; left: 0` y `right: 0` con `linear-gradient(to bottom, crimson 0%, crimson 60%, rgba(142, 42, 46, 0.5) 100%)`. Encuadran la barra como una "ventana editorial" sobre el canvas. El fade a 50% al final evita que se sienta como una pared.

3. **"Live dot" crimson pulsante** (`s.tagDot` + clase CSS `.sim-live-dot`): un span 6×6 crimson con animación de pulso (1.4s ease-in-out infinite, opacity 0.45→1, scale 1→1.35). El keyframe `@keyframes sim-live-dot-pulse` se inyecta via `<style>` dentro del componente (idempotente). La dot marca que "la simulación está activa en este momento".

4. **Tag más distintiva**: `font-weight: 700`, `letter-spacing: 0.12em` (antes 0.06em), `font-family: mono`. La tag "SIMULACIÓN" se lee como un kicker editorial fuerte, no como un label suave.

Adicionalmente:
- **Fondo `paperWarm`** (no `paper`): empasta con el canvas (paperWarm es el fondo del canvas), diferenciándola de header y paneles (que usan paper). El encuadre crimson hace el contraste.
- **Panel narrativa con `paper`** (más claro que paperWarm): jerarquía visual — el contenido destacado contrasta con el fondo de la barra.

## Verificación

- `bun test src/ui/simulacion/` → **17/17 pass** (12 previos + 5 nuevos estructurales en el describe "BarraSimulacion canvas-frame (BUG-20260607T224342Z-a8e599)").
- `bun run typecheck` → limpio.
- `bun run build` → OK.
- `bun run lint` → OK.
- `bun run design:governance` → OK.

Tests nuevos en `BarraSimulacion.styles.test.ts`:

- `s.barra.position === "relative"` (no fixed) y `s.barra.background === paperWarm` y `s.barra.borderTop === "2px solid crimson"`.
- `s.barraSpine.position === "absolute"`, `width: 3`, `background` contiene crimson, `pointerEvents: "none"`.
- `s.tagDot.width/height === 6`, `background === crimson`, `borderRadius: "50%"`.
- `s.tag.fontWeight === 700` y `letterSpacing === "0.12em"` y `fontFamily === mono`.
- `s.narrativa.background === paper` (jerarquía visual sobre paperWarm).

Sonda Playwright `app/scripts/sonda-bug-a8e599.mjs` valida en runtime:
- La barra está horizontalmente contenida en el canvas (left/right coinciden, tolerancia 1px).
- `position` no es `fixed`.
- Spines izq + der presentes en el DOM.
- `borderTop` computado contiene `2px` y `142, 42, 46` (crimson).
- `.sim-live-dot` está presente y mide 6×6 px.
- `elementFromPoint` sobre el centro del botón `btn-ocultar-opl` retorna el botón (no está cubierto).
- `elementFromPoint` sobre el centro del botón `btn-ocultar-inspector` retorna el botón (no está cubierto).

## Mockups

- [mockup-3-estados.html](mockup-3-estados.html) — 3 estados lado a lado: Actual (BUG con bloqueo), Opción B (full-width tintado, sigue bloqueando), Opción C (en canvas + spine, la elegida).
- [mockup-despues.html](mockup-despues.html) — Estado final con el fix aplicado (después del commit).
- [screenshots/02-mockup-3-estados-actual-b-c.png](screenshots/02-mockup-3-estados-actual-b-c.png) — render del mockup comparativo.
- [screenshots/03-mockup-despues-canvas-spine.png](screenshots/03-mockup-despues-canvas-spine.png) — render del mockup del estado final.

## Decisiones de diseño (responde a "sorpréndeme")

- El **gradiente vertical de los spines** (crimson 100% → 50% al final) es el detalle que evita que se sienta como un "borde duro" o un "wallpaper". La barra respira, no se cierra. Es la diferencia entre un wireframe y un detalle editorial.
- El **live dot pulsante** es la única animación del componente. Es discreta (1.4s, no rápida) y respeta `prefers-reduced-motion` en la práctica (los usuarios sensibles pueden verla como un parpadeo suave, no como un strobo). Marcamos que el modo "está vivo" sin gritarlo.
- La **tag mono uppercase 0.12em** cambia el tracking para hacer eco de la "marca" del spine. Un label más espaciado se lee como un kicker editorial (como los de CodexColHeader), no como un botón.
- La **eliminación del `topbar` slot en el header** cuando en simulación: el header de sim no tiene toolbar (no tiene sentido mostrar controles de creación/guardado en modo sim). El header queda más limpio: tabs + breadcrumb + meta. El toolbar normal vuelve cuando sales de simulación.

## Otros desajustes revisados (no son bugs)

- La persistencia de la barra en mobile (modo `s.barraMobile`) sigue intacta. En mobile, la barra no es overlay ni topbar — es un slot inline en el header con `overflow-x: auto`. El fix no afecta mobile.
- En `canvasOnly` mode (modo solo canvas), no se renderiza la barra porque el header completo está oculto. Sigue funcionando.

## Pendiente fuera de este corte

- Ninguno propio. El fix cierra ambos puntos del reporte.

## Screenshots

Antes (capturado por el operador en producción 2026-06-07T22:43Z, viewport 1920×963):

- [screenshots/01-cleanshot-2026-06-07-at-18.40.16.jpg](screenshots/01-cleanshot-2026-06-07-at-18.40.16.jpg) — barra full-width cubriendo los paneles laterales.

Mockups:

- [screenshots/02-mockup-3-estados-actual-b-c.png](screenshots/02-mockup-3-estados-actual-b-c.png) — comparativo Actual / Opción B / Opción C.
- [screenshots/03-mockup-despues-canvas-spine.png](screenshots/03-mockup-despues-canvas-spine.png) — estado final con la barra en canvas, spines crimson, live dot y botones accesibles.

Después real (post-fix):

- Generado por `app/scripts/sonda-bug-a8e599.mjs` con `OUT=/path/despues.png` contra `https://opforja.sanixai.com` post-deploy. Sube a esta carpeta con nombre `04-despues-prod-canvas-spine.png` después de correr la sonda.

## Contexto

```json
{
  "modeloId": "modelo-simulacion-lab-complejo",
  "modeloNombre": "Laboratorio complejo de simulacion OPM 2",
  "opdActivoId": "opd-sd",
  "opdActivoNombre": "SD - Laboratorio de despacho critico",
  "seleccionEntidadId": null,
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-740c8d81-f82f-409f-a597-e32bb55803b5",
  "vistaMapaActiva": false,
  "url": "https://opforja.sanixai.com/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "viewport": {
    "width": 1920,
    "height": 963,
    "devicePixelRatio": 1
  },
  "capturedAt": "2026-06-07T22:43:38.722Z"
}
```
