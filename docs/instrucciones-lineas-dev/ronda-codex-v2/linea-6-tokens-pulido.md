# L6 — Tokens · color · layout · filtro OPL

## Misión
Pulido transversal de tokens y residuos no-Codex: pesos tipográficos 500/600, anchos de columna canónicos, erradicar colores legacy y sombras/radius fuera de token, y el chip de filtro activo del panel OPL. Muchos archivos chicos disjuntos; sin tocar hubs.

Cierra: **pesos colapsados (T-03/T-04)**, **anchos 240/300→210/360 (L-01/L-02)**, **colores legacy lime/cyan (C-04)**, **sombras (S-01) y radius (S-02) residuales**, **chip de filtro OPL (G7)**.

## Anclaje a evidencia
- Spec: `ui-forja/01-design-spec.md` (§2 anchos, §3 color, §4.3 pesos, §6 hairlines, §11 prohibiciones), `tokens.css`, `04-opl-rendering.md` §4 (chip filtro).
- Estado actual:
  - Pesos: `ui/tokens.ts:341-350` colapsa `medium→400`, `semibold→700`; Inria Sans 600 no cargado (`index.html`).
  - Anchos: `store/runtime.ts:56` (`ANCHO_PANEL_ARBOL_DEFAULT=240`, spec 210), `:61` (`ANCHO_PANEL_INSPECTOR_DEFAULT=300`, spec 360); `ui/divisorPanel.tsx:5`.
  - Colores legacy: lime `#70E483`/cyan `#3BC3FF` en `ui/RenombradoInline.tsx:51`, `ui/TablaEnlaces.tsx:561-562`, `ui/Timeline.tsx:261`, `render/jointjs/mapa/proyeccion.ts:47,102-103`.
  - Sombras: `ui/MenuContextual*.tsx` (offset duro `8px 8px 0`), `ui/PanelDiagnostico.tsx:273`, `ui/Timeline.tsx:224`.
  - Filtro OPL: `ui/panelOpl/Toolbar.tsx:132-139` es checkbox; falta chip `filtrado · o.06 · 4/24 ✕` crimson italic.

## Archivos permitidos
```
app/src/ui/tokens.ts                       EDIT
app/index.html                             EDIT (cargar pesos 500/600)
app/src/main.tsx                           EDIT (imports @fontsource si aplica)
app/src/store/runtime.ts                   EDIT (SOLO los 2 defaults de ancho, líneas 56 y 61)
app/src/ui/divisorPanel.tsx                EDIT (default de ancho)
app/src/ui/RenombradoInline.tsx            EDIT
app/src/ui/TablaEnlaces.tsx                EDIT
app/src/ui/Timeline.tsx                    EDIT
app/src/render/jointjs/mapa/proyeccion.ts  EDIT
app/src/ui/MenuContextual*.tsx             EDIT
app/src/ui/PanelDiagnostico.tsx            EDIT
app/src/ui/panelOpl/Toolbar.tsx            EDIT
ui-forja/01-design-spec.md, tokens.css     LECTURA
```

## Restricciones de no-colisión
- En `store/runtime.ts` tocar **solo** los dos defaults de ancho (líneas ~56 y ~61); nada más del slice.
- No tocar `App.tsx`, toolbar/, CodexFrame, Inspector*, opl/generadores, render/jointjs/composers (eso es L4).
- `MenuContextual*` y `PanelDiagnostico`: solo retirar sombras/radius, no cambiar comportamiento.

## Slice mínimo shippeable
1. **Pesos**: descolapsar `weights` (400/500/600/700) y cargar Inria Sans 600 (e Inria Serif/Sans/Mono pesos que falten) en `index.html`/`main.tsx`.
2. **Anchos**: `ANCHO_PANEL_ARBOL_DEFAULT 240→210`, `ANCHO_PANEL_INSPECTOR_DEFAULT 300→360` (y el default de `divisorPanel`).
3. **Color legacy**: reemplazar lime/cyan por tokens canónicos (verde/azul OPM o crimson/ink según contexto) en los 4 archivos.
4. **Sombras/radius**: retirar sombras fuera de token y border-radius residuales en MenuContextual*, Timeline, PanelDiagnostico.
5. **Chip filtro OPL**: en `panelOpl/Toolbar.tsx`, cuando hay selección, mostrar chip `filtrado · <código> · N/M ✕` crimson italic (además del checkbox o reemplazándolo).

## Tests obligatorios
- Unit de tokens (pesos) y de `panelOpl/Toolbar` (chip filtro).
- Verificar que ningún test dependa de los hex legacy reemplazados.

## Verificación
```bash
cd app && bun run check && bun run lint && bun run build
```

## Decisiones bloqueadas (no reabrir)
- Cero colores fuera del set Codex; cero sombras salvo backdrop del palette; cero radius en chrome salvo stadium de estado.
- Anchos canónicos 210 / 360.

## Decisiones que tomas vos (documentar en commit)
- A qué token canónico mapea cada uso legacy de lime/cyan según su semántica.
- Si el chip de filtro reemplaza o complementa el checkbox.

## Forma del entregable
- Commits `fix(tokens): pesos 500/600 + anchos 210/360`, `fix(ui): erradica color legacy lime/cyan`, `fix(ui): retira sombras/radius fuera de token`, `feat(opl): chip de filtro activo Codex`.
