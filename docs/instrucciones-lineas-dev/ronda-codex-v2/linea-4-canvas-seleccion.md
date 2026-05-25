# L4 — Canvas selección · una voz

## Misión
Alinear la afordancia de selección con Codex: **solo subrayado crimson** bajo la etiqueta (en selección única y múltiple), **sin** resize-handles flotantes, y **una sola voz** sobre la selección (retirar la barra de chips, hacer funcional la anotación tipográfica). **Ola 2** (depende de que L2 haya retirado el mount de `BarraHerramientasElemento` en `App.tsx`).

Cierra: **SEL-1** (underline solo en multi → también en single), **SEL-2** (8 resize-handles), **multi-select dual voice** (2.7).

## Anclaje a evidencia
- Spec: `ui-forja/08-jointjs-styling.md` §5.1 (underline crimson único), §5.2 (hover), §6.2 (NO handles flotantes; la barra HTML los reemplaza). `ui-forja/02-components.md` §5 (CodexSelectionAnnotation).
- Estado actual:
  - `render/jointjs/composers/entidad.ts:133-139,276-318` añade 8 resize-handles (rect crimson 6×6) a toda entidad seleccionada.
  - `render/jointjs/proyeccion.ts:170` solo emite `proyectarHaloSeleccion` cuando `seleccionMultiple.size > 1` → en single no hay underline.
  - `render/jointjs/composers/halos.ts:55-78` ya tiene el underline crimson 1.2 (composer listo) y la variante hover (`:34-46`).
  - `ui/codex/CodexSelectionAnnotation.tsx` es `aria-hidden` + `pointerEvents:none` (decorativa); `ui/BarraHerramientasElemento.tsx` es la funcional (chips).
  - `ui/codex/CodexCanvasMount.tsx:34` monta la anotación.

## Archivos permitidos
```
app/src/render/jointjs/proyeccion.ts            EDIT
app/src/render/jointjs/composers/entidad.ts     EDIT
app/src/render/jointjs/composers/halos.ts        EDIT (si hace falta)
app/src/ui/codex/CodexSelectionAnnotation.tsx    EDIT (hacerla funcional)
app/src/ui/codex/CodexCanvasMount.tsx            EDIT
app/src/ui/BarraHerramientasElemento.tsx         EDIT (retirar/repurpose; el mount lo quitó L2)
app/src/render/jointjs/**/*.test.ts              EDIT
ui-forja/08-jointjs-styling.md, 02-components.md  LECTURA
```

## Restricciones de no-colisión
- **Ola 2**: arrancar desde `main` con L2 ya mergeada (el mount de `BarraHerramientasElemento` ya retirado de `App.tsx`). No editar `App.tsx`.
- Solo apariencia/overlay; **no tocar routing/anchors** ni la lógica de selección del store.
- No tocar opl/, Inspector*, tokens.ts, toolbar/.

## Slice mínimo shippeable
1. **SEL-2**: eliminar `markupConResizeHandles`/`attrsConResizeHandles` del render de entidad seleccionada (`entidad.ts:133-139,276-318`).
2. **SEL-1**: en `proyeccion.ts:170`, emitir `proyectarHaloSeleccion` también para `seleccionEntidadId` (single), no solo `size>1`.
3. **Una voz**: hacer funcional `CodexSelectionAnnotation` (acciones clicables: descomponer/desplegar/estado/alias/inspector) y retirar `BarraHerramientasElemento` (o reducirla a no-render). La interacción pasa a la anotación tipográfica.

## Tests obligatorios
- `render/jointjs/proyeccion.test.ts`: assert underline en single-select; assert ausencia de resize-handles.
- Unit de `CodexSelectionAnnotation` funcional (click dispara acción).
- Smoke `e2e/05` (superficie contextual) / `e2e/15` verde.

## Verificación
```bash
cd app && bun run check && bun run lint
# apagar dev server antes del smoke (regla del repo)
bunx playwright test e2e/15-superficie-contextual.spec.ts
```

## Decisiones bloqueadas (no reabrir)
- Sin resize-handles. Solo underline crimson hairline.
- Una sola superficie de acción sobre la selección (la tipográfica Codex).

## Decisiones que tomas vos (documentar en commit)
- Si retirar `BarraHerramientasElemento` por completo o dejar un stub; cómo trasladar sus acciones a la anotación funcional preservando testids.

## Forma del entregable
- Commits `fix(render): SEL-2 sin resize-handles`, `fix(render): SEL-1 underline en selección única`, `feat(ui): multi-select una sola voz (anotación funcional)`.
