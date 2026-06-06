# BUG-20260606T041330Z-1f46fe

**Creado**: 2026-06-06T04:13:30.698Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: Header editorial Codex de 60→48px y fila del panel Índice/OPDs de `42px`→`auto` para que el `OPDs` deje de recortarse.

## Texto

ahora backend para forja y no más localstore. tras eso algunos desajustes visuales:
screenshot 1: texto cortado
screenshot 2: barra superior desproporcianadamente alta me parece
Revisa eso y busca otros desajustes visuales/UI nevegando directamente en la app forja (opforja.sanixai.com)

## Causa raíz

- **Screenshot 1 (`OPDs` recortado)**: `layout.rightIndexPane` en `app/src/ui/App.tsx` fijaba la primera fila del grid en `"42px minmax(0, 1fr)"` con la altura **exacta**. El `CodexColHeader` interior necesitaba ~46-48px (kicker fs9 + title fs13 lh1.1 + rowGap 2px + padding 8×2). El navegador squisheaba la fila del título a 11px y el `D` se recortaba. El panel izquierdo (OPL) usa `display: flex` sin altura fija, por eso no sufría el clip.
- **Screenshot 2 (barra alta)**: `codexFrameRows()` en `app/src/ui/codex/CodexFrame.tsx` fijaba la primera fila en `60px`. El contenido real más alto del header son los `palabraTopBar` de 32px y la pestaña (que estira a la fila). Quedaban ~14px de aire inútil arriba/abajo.

## Fix

- `app/src/ui/App.tsx`: `rightIndexPane.gridTemplateRows` `"42px minmax(0, 1fr)"` → `"auto minmax(0, 1fr)"`.
- `app/src/ui/codex/CodexFrame.tsx`: `codexFrameRows()` `"60px minmax(0, 1fr)"` → `"48px minmax(0, 1fr)"` (alineado con la economía mobile `pageMobile.gridTemplateRows` 48px).
- `app/src/ui/codex/CodexFrame.test.ts`: expectativa actualizada a 48px.
- `app/src/ui/codex/CodexColHeader.test.tsx` (nuevo): test unitario del header que ancla `gridTemplateRows: "auto auto"`, `minHeight: 42` como suelo y `lineHeight: tight` en el título.

## Verificación

- Dev server local 1920×963: `header.h=48`, `treePane colHeader.h=45.84px` con `gridRows "12px 14.8438px"` (antes 12px+11px clipado), `oplPane colHeader` consistente.
- `bun test src/ui/codex/CodexColHeader.test.tsx src/ui/codex/CodexFrame.test.ts` → **10/10 pass**.
- `bun run build` → OK.
- `bun run lint` → OK.
- `bun run design:governance` → OK.
- Sin `pageErrors` ni `consoleErrors` en el walkthrough (bienvenida → empty workbench → crear objeto con O → command palette Ctrl+K).

## Otros desajustes revisados (no son bugs)

- El dimming de `Relación` / `Estado` / `editor vacío` en el header es estado contextual: sin selección son `ink50` (50% opacidad), con selección pasan a `ink`. Diseño intencional, no desajuste.
- El icono placeholder del OPD `SD` en el panel derecho es el affordance canónico de "sin desplegar" y se rellena al expandir.
- La sombra interna de los paneles y los divisores de 6px están alineados con la spec de ui-forja.

## Pendiente fuera de este corte

- El operador arrastraba WIP no commiteado de **persistencia backend-only** (58 archivos modificados, `app/src/persistencia/local.ts` borrado, `modelos.ts` nuevo, imports `cargarModeloLocal`/`guardarModeloLocal` huérfanos en `store/*.ts` y `ui/DialogoComposicion.tsx`). `bun run typecheck` y `bun test src/` fallan por ese WIP; mis tests de `codex/` pasan. No toqué esos archivos — el commit atómico solo cubre los 4 archivos del fix + el cierre de este bug.

## Screenshots

Antes (capturados por el operador en producción 2026-06-06T04:13Z, viewport 1920×963):

- [screenshots/01-google-chrome-2026-06-06-00.08.08.png](screenshots/01-google-chrome-2026-06-06-00.08.08.png) — header del panel Índice/OPDs, `OPDs` con la `D` recortada por la fila de 42px.
- [screenshots/02-google-chrome-2026-06-06-00.10.03.png](screenshots/02-google-chrome-2026-06-06-00.10.03.png) — vista general con la barra superior de 60px y el padding vertical excesivo.

Después (capturados con el fix aplicado, dev server 1920×963):

- [screenshots/03-despues-header-toolbar.png](screenshots/03-despues-header-toolbar.png) — header a 48px, botones sin aire sobrante.
- [screenshots/04-despues-panel-indice.png](screenshots/04-despues-panel-indice.png) — `OPDs` completo, sin clip; `1` correctamente alineado.
- [screenshots/05-despues-inspector-pane.png](screenshots/05-despues-inspector-pane.png) — `INSPECTOR / Selection` con header consistente.
- [screenshots/06-despues-fullpost.png](screenshots/06-despues-fullpost.png) — vista general, proporciones editoriales restauradas.

## Contexto

```json
{
  "modeloId": "modelo-hodom-completo-v1-6",
  "modeloNombre": "HODOM completo v1.6",
  "opdActivoId": "opd-sd0-clinico",
  "opdActivoNombre": "SD0-C - Hospitalizacion en domicilio",
  "seleccionEntidadId": "o-plan",
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-2791fa7d-d725-43b4-92b2-afde488e008c",
  "vistaMapaActiva": false,
  "url": "https://opforja.sanixai.com/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "viewport": {
    "width": 1920,
    "height": 963,
    "devicePixelRatio": 1
  },
  "capturedAt": "2026-06-06T04:13:26.393Z"
}
```
