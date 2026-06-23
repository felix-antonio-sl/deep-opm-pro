# BUG-20260606T063734Z-52df54

**Creado**: 2026-06-06T06:37:34.653Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: Tres filas independientes (status, narrativa full-width, controles) con `alignItems: flex-start` en el padre y `flexBasis: 100%` + `maxHeight: 90px` en la narrativa.

## Texto

barra de simulación se va descuadrando en tanto requiere más espacio

## Causa raíz

`app/src/ui/simulacion/BarraSimulacion.tsx:294-306` define `barra` con `display: flex`, `alignItems: "center"`, `flexWrap: "wrap"`. Los children son: `fila` (status line) → `narrativa` (panel) → `fila` (controles) → timeline → timer → trace. La `narrativa` tiene `flex: "1 1 520px"` y `minWidth: 280`, así que cuando el viewport da, ella y la primera `fila` comparten línea. El panel `narrativa` (líneas 366-378 en la versión previa) tiene su propio título + detalle + chips y crece con el contenido. La `fila` queda como una línea inline. El `alignItems: "center"` del padre los centraba verticalmente sobre el más alto (la narrativa), así que la `fila` "flotaba" centrada mientras el panel "tiraba" hacia abajo. Mientras más crecía `detalle` y más `chips` aparecían, más se descentraba la línea de status.

El resultado visible en `screenshots/01-...jpg`:
- Fila izquierda (h≈28): "SIMULACION | Listo para simular · paso 2 de 13 · preparación | Validar orden recibida | SD1 - Orquestacion simulable del despacho critico"
- Panel derecho (h≈48): "Preparación: Validar orden recibida" con detalle + 4 chips
- Comparten línea pero el panel derecho tira de la altura, el status queda "flotando" sin baseline claro contra el panel.

JointJS no aplica: la skill que el operador cargó (`jointjs-open-source`) cubre el canvas, pero este bug es 100% CSS/layout del shell de la barra de simulación, no de la proyección de canvas.

## Fix aplicado

`app/src/ui/simulacion/BarraSimulacion.tsx` — dos cambios mínimos en el objeto de estilos `s`:

1. `s.barra` (línea 301-313, ahora con comentario BUG-id):
   - `alignItems: "center"` → `alignItems: "flex-start"`. Alinea al tope en vez de centrar sobre el más alto, así dos filas con alturas distintas no se descentran entre sí.

2. `s.narrativa` (línea 378-393):
   - Agregado `flexBasis: "100%"` para forzar a la narrativa a ocupar su propia fila (status arriba, controles abajo). Antes compartía línea con la `fila` de status.
   - Agregado `maxHeight: "90px"` + `overflow: "hidden"` para acotar el crecimiento vertical del panel cuando el `detalle` o los `chips` se vuelven largos.

Cambio quirúrgico: solo dos campos CSS + dos comentarios BUG-id. No se tocó la lógica de proyección (`proyeccionBarra.ts`), ni la API del port (`useZustandSimulationPort`), ni el árbol de children. La barra ahora vive en 3 filas independientes (status, narrativa full-width, controles), sin riesgo de deriva vertical.

`alignContent: "flex-start"` no fue necesario: el `flexWrap: "wrap"` del padre sigue empujando items a nuevas filas cuando no caben; la `narrativa` ya tiene `flexBasis: "100%"` para garantizarse su fila propia.

## Verificación

- `bun test src/ui/simulacion/` → **12/12 pass** (6 originales de `proyeccionBarra.test.ts` + 6 nuevos estructurales en `BarraSimulacion.styles.test.ts`).
- `bun run typecheck` → limpio.
- `bun run build` → OK.
- `bun run lint` → OK.
- Mockup comparativo en [mockup-comparativo.html](mockup-comparativo.html) (renderizado en [screenshots/02-mockup-comparativo-3-estados.png](screenshots/02-mockup-comparativo-3-estados.png)) con los 3 estados lado a lado usando los estilos reales del repo.

Tests estructurales nuevos en `app/src/ui/simulacion/BarraSimulacion.styles.test.ts` anclan las invariantes de layout para que un refactor futuro no reintroduzca el bug:

- `s.barra.alignItems === "flex-start"`
- `s.narrativa.flexBasis === "100%"`
- `s.narrativa.maxHeight === "90px"`
- `s.narrativa.overflow === "hidden"`
- `s.barra.minHeight === 44`
- invariantes secundarias de la `fila` (display, alignItems, gap, flexWrap)
- invariantes de marca del `tag` (crimson, uppercase, tracking 0.06em, fontWeight 600)
- altura compacta de `control`/`segmentBtn` (28) y bordes canónicos de `segmented`

Para hacer testable el objeto `s`, se agregó `export const s: EstilosBarra = { ... }` con tipo `EstilosBarra` declarado arriba del objeto (32 entradas, sin cambios semánticos). El runtime del componente no se ve afectado — los consumidores ya destructuran `s.foo` por clave.

## Mockup comparativo

Se construyó [mockup-comparativo.html](mockup-comparativo.html) con los estilos reales del repo (tokens de `app/src/ui/tokens.ts`, escala tipográfica Codex, paleta canónica) para que el operador comparara 3 opciones antes de elegir:

- **Actual (BUG)**: `alignItems: center` + sin cap de altura en narrativa → status "flotando".
- **Opción A** (elegida): `alignItems: flex-start` + `flexBasis: 100%` en narrativa + `maxHeight: 90px` → 3 filas estables.
- **Opción B** (descartada): `display: grid` con 2 columnas en fila 1 → preservaba la posición lateral del panel, pero los chips hacían overflow horizontal al acotar la altura.

## Otros desajustes revisados (no son bugs)

- El dimming de `Relación` / `Estado` / `editor vacío` en el header es estado contextual intencional: sin selección son `ink50` (50% opacidad), con selección pasan a `ink`. Verificado en BUG-20260606T041330Z-1f46fe.
- El ícono placeholder del OPD `SD` en el panel derecho es el affordance canónico de "sin desplegar" y se rellena al expandir.
- La sombra interna de los paneles y los divisores de 6px están alineados con la spec de ui-forja.

## Pendiente fuera de este corte

- WIP no-commiteado del operador (persistencia backend-only, autoría, mobile-readonly Fases 0-2) ya integrado en main en commits `9f7ee89`, `14166d2`, `25c4d4d`, `cdceb19`, `d4dcf99`, `f0a4a94`. No tocado por este fix.
- El import path obsoleto `app/src/server/modelPersistence.ts:3` (1 línea) ya fue absorbido en `606daf0 fix(server)`.

## Screenshots

Antes (capturado por el operador en producción 2026-06-06T06:37Z, viewport 1920×963):

- [screenshots/01-cleanshot-2026-06-06-at-02.36.50.jpg](screenshots/01-cleanshot-2026-06-06-at-02.36.50.jpg) — barra con la `fila` de status "flotando" contra el panel `narrativa` que tira de la altura.

Mockup comparativo (3 estados lado a lado, mismos tokens del repo):

- [mockup-comparativo.html](mockup-comparativo.html) — HTML standalone, abrir en navegador.
- [screenshots/02-mockup-comparativo-3-estados.png](screenshots/02-mockup-comparativo-3-estados.png) — render del mockup a 1920×~1400.

Después real (post-fix):

- El dev server local no permite levantar el modelo `modelo-simulacion-lab-complejo` y el OPD `opd-orquestacion` con la sesión de cookies del operador, por lo que la captura "después" desde la app no es viable en este entorno. La evidencia visual es el mockup comparativo, los tests estructurales pasan, y el renderizado del navegador sobre los estilos corregidos coincide con la fila 2 del mockup.

## Contexto

```json
{
  "modeloId": "modelo-simulacion-lab-complejo",
  "modeloNombre": "Laboratorio complejo de simulacion OPM 2",
  "opdActivoId": "opd-orquestacion",
  "opdActivoNombre": "SD1 - Orquestacion simulable del despacho critico",
  "seleccionEntidadId": null,
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-463f2d45-5c05-49ff-9c67-63886325e6ff",
  "vistaMapaActiva": false,
  "url": "https://opforja.sanixai.com/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "viewport": {
    "width": 1920,
    "height": 963,
    "devicePixelRatio": 1
  },
  "capturedAt": "2026-06-06T06:37:31.664Z"
}
```
