# Canvas infinito — spec de frente propuesto

> **Estado:** propuesto, NO implementado (2026-06-03). Spec autocontenido para una
> sesión futura. Antes de implementar: leer `docs/HANDOFF.md`, invocar la skill
> `jointjs-open-source` (SSOT del API de Paper; consultar `docs.jointjs.com` antes de
> usar `fitToContent`/`setDimensions`), respetar `ui-forja/GOVERNANCE.md` y
> **re-verificar el estado del código** (puede haber drift).

## Objetivo

El diagrama parte enfocado **a la pantalla** (si está vacío) o **al bbox del diagrama**
(si se carga), y el paper crece / desplaza sus límites **dinámicamente en cualquier
dirección** a medida que el contenido crece, se mueve o se redimensiona. Reemplaza el
modelo actual de "canvas fijo grande que solo crece a la derecha/abajo".

## Estado actual verificado (2026-06-03)

opforja ya hace una versión **cruda** del patrón (crece, pero solo positivo y sobre un
piso fijo). Lo que hay que cambiar:

| Archivo | Hecho actual |
|---|---|
| `app/src/modelo/layout.ts` (≈27) | `CANVAS_GEOMETRICO_BASE = {width:7200, height:5200}` (piso **fijo**); `CENTRO_CANVAS_GEOMETRICO ≈ (3600,2600)`. |
| `app/src/render/jointjs/handlers/helpers.ts` | `CANVAS_BASE = CANVAS_GEOMETRICO_BASE`; `CANVAS_PADDING=1800`; `ZOOM_MIN=0.5`; `ZOOM_MAX=1.6`. La función de dimensiones `n(cells)` (≈102): `n([])===CANVAS_BASE` y **solo crece +X/+Y** (`position.x+width`, nunca `minX/minY`), origen clavado en `(0,0)`. `setPaperDimensions` (≈95) hace `paper.setDimensions(w,h)` + ajusta el `div` DOM. |
| `app/src/render/jointjs/jointCanvasAdapter.ts` | llama `setPaperDimensions(paper, n(cells))` al actualizar. |
| `app/src/render/jointjs/mapaExport.ts` | llama `setPaperDimensions(paper, n(cells))` para el sizing del PNG. |
| `app/src/store/sliceTypes.ts` (≈182) | `MapaSlice` (pan/zoom). El viewport **ya encuadra el bbox del contenido** (esa mitad existe). |
| `app/src/autoria/layout.ts` (≈455) | `centrarOpdsEnCanvas()` centra cada OPD en `(3600,2600)` — **hack** para tener aire en las 4 direcciones dentro del box fijo. |
| `app/src/render/jointjs/handlers/helpers.test.ts` | asierta el comportamiento actual de `n` (`n([])===CANVAS_BASE`, "parte de un canvas grande") → **habrá que reconciliarlo**. |

## El gap (3 cosas)

1. **Parte en 7200×5200, no en la pantalla.** → piso = tamaño del viewport.
2. **Solo crece derecha/abajo, origen fijo en (0,0).** → crecer en cualquier dirección.
3. **El `3600/2600` compensa (2).** Al arreglar (2), sobra.

## API JointJS OSS (verificado en docs.jointjs.com, `dia.Paper`)

- Las celdas viven en coordenadas de modelo **arbitrarias (incluidas negativas),
  independientes del tamaño del paper**.
- `paper.fitToContent(opt)` con opciones: `padding`, `allowNewOrigin: 'positive' |
  'negative' | 'any'` (con `'any'` el origen del paper queda en el origen del
  contenido → crece en todas direcciones), `minWidth`/`minHeight`,
  `maxWidth`/`maxHeight`, `contentArea`, `useModelGeometry`, `allowNegativeBottomRight`.

## Diseño propuesto

Reemplazar `n(cells)` + `setPaperDimensions(paper, n(cells))` por, en cada cambio de
contenido:

```js
paper.fitToContent({
  allowNewOrigin: 'any',
  padding: CANVAS_PADDING,
  minWidth: viewportW,   // tamaño visible → diagrama vacío parte a pantalla
  minHeight: viewportH,
  useModelGeometry: true,
});
```

- **Soltar** el `3600/2600` en `autoria/layout.ts` (las cosas viven en coordenadas
  naturales; el app las encuadra).
- **Arreglar `mapaExport.ts`** (PNG): exportar usando el bbox del contenido, no el piso
  fijo.

## Pieza no-trivial (el corazón del trabajo)

`allowNewOrigin:'any'` **desplaza el origen del paper a negativo** cuando el contenido
crece hacia arriba/izquierda. El slice `mapa` (pan/zoom) y la lógica de encuadre deben
**rastrear ese origen desplazado** para que el contenido **no "salte"** visualmente.
Diseñar y validar este tracking ANTES de escribir el resto. Hacerlo como **unidad
coherente**: soltar el `3600/2600` aislado NO sirve (el contenido quedaría en una
esquina del box fijo de 7200×5200).

## Blast radius / riesgos

- Toca el **renderer** (adaptador desechable: `jointCanvasAdapter.ts`,
  `JointCanvas.tsx`, `handlers/helpers.ts`), el slice **`mapa`**, `mapaExport.ts`,
  `autoria/layout.ts` y `helpers.test.ts`.
- Es **capa del operador**; puede haber WIP de simulación/UI activo → coordinar, usar
  `git add` específico, no mezclar con su WIP.
- **e2e 02/05** son sensibles a geometría de canvas e históricamente flaky: **apagar el
  dev server antes de `bun run browser:smoke`** (vite bg + smoke = flakes); correr e2e
  con `PW_PORT` libre.
- Gobernado por diseño → `bun run design:governance` debe pasar.

## Verificación

- Cambio visual → verificar **in-vivo** con la skill `test-vivo-iterativo-opmkv`
  (navegador headless contra el dev server): (a) vacío parte enfocado a pantalla;
  (b) cargar un diagrama lo encuadra; (c) crear/mover cosas hacia los 4 lados crece el
  paper **sin saltos**.
- Gates: `cd app && bun run check` (typecheck+unit) · `bun run lint` ·
  `bun run design:governance` · `bun run gate:refactor` (gate pesado de comportamiento)
  · e2e con `PW_PORT` libre.
- No declarar verde sin auditar de primera mano (lección del repo contra el verde
  tautológico).

## Deploy (cuando esté verde y aprobado por el operador)

`docker compose up -d --build` desde la raíz; verificar `docker compose ps` (todo
healthy), healthz internos y `curl -fsSI https://opforja.sanixai.com` (HTTP/2 200).
**NUNCA `docker compose down -v`** (borra el volumen Postgres). Detalle:
`docs/deploy/opforja.md`.

## Referencias

- SSOT del API JointJS: `docs.jointjs.com` (`dia.Paper`) — vía skill `jointjs-open-source`.
- Autoridad de diseño: `ui-forja/GOVERNANCE.md`.
- Estado operativo: `docs/HANDOFF.md`.
