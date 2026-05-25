# L3 — Inspector ficha continua

## Misión
Convertir el Inspector de **tabs** a **ficha tipográfica continua** (scroll vertical sin pestañas), corregir el identificador con guion y retirar los contadores del estado vacío. Dominio disjunto de `App.tsx` y del resto.

Cierra: **C9** (tabs→ficha), **identificador `o-11`→`o.11`**, **contadores en Inspector vacío**.

## Anclaje a evidencia
- Spec: `ui-forja/02-components.md` (Inspector = ficha continua, apéndice prohíbe Tabs), `03-scenes.md` (04 inspector).
- Estado actual:
  - Tabs: `ui/InspectorEntidad.tsx:35` (`TABS_ENTIDAD`), `:57-58` (`tabActivo/cambiarTab`), `:187-200`; `ui/inspector/InspectorTabs.tsx`; `ui/InspectorEnlace.tsx` (`TABS_ENLACE`).
  - Identificador: el header del Inspector muestra `o-11` (guion); el canvas usa `o.11` (punto). Buscar el formateo en `Inspector*.tsx`/`inspectorStyles.ts` y unificar al punto canónico.
  - Contadores: `ui/Inspector.tsx:63,75-77` («N objetos · N procesos · N OPDs», testid `inspector-vacio-conteos`).
  - Secciones existentes a recolocar en el scroll: `ui/inspector/Seccion*.tsx` (ya son componentes — reusar, solo cambiar el contenedor de tabs por secciones apiladas).

## Archivos permitidos
```
app/src/ui/InspectorEntidad.tsx        EDIT
app/src/ui/InspectorEnlace.tsx         EDIT
app/src/ui/Inspector.tsx               EDIT
app/src/ui/inspectorStyles.ts          EDIT
app/src/ui/inspector/InspectorTabs.tsx EDIT (retirar/neutralizar)
app/src/ui/inspector/Seccion*.tsx      EDIT aditivo (solo si el layout lo exige)
app/src/ui/inspector/*.test.tsx        EDIT
ui-forja/02-components.md, 03-scenes.md  LECTURA
```

## Restricciones de no-colisión
- No tocar `App.tsx` (lo monta L2; tú editas el componente interno). No tocar toolbar/, codex/, render/, opl/, tokens.ts.
- Las `Seccion*.tsx` ya existen: **reusar**, no reescribir su lógica; solo cambiar el contenedor de tabs por una ficha con secciones apiladas separadas por hairline.

## Slice mínimo shippeable
1. Reemplazar el contenedor de `tabs` (`InspectorTabs` + `cambiarTab`) por una **ficha vertical** que apila las secciones existentes (Semántica → Enlaces → Refinamiento → Apariciones → Estilo) separadas por hairline, con kicker mono por sección.
2. Lo mismo en `InspectorEnlace`.
3. Identificador del header: `o-11` → `o.11` (punto, como el canvas).
4. Inspector vacío: retirar los contadores «N objetos · N procesos»; reemplazar por placeholder editorial o la OPL completa (decisión propia).

## Tests obligatorios
- Actualizar `inspector/*.test.tsx` y cualquier test que dependa de `role="tablist"` / `cambiarTab`.
- Smoke `e2e/` del inspector si existe.
- Estimado: ~8–15 expectaciones.

## Verificación
```bash
cd app && bun run check && bun run lint
```

## Decisiones bloqueadas (no reabrir)
- Sin tabs. Ficha continua tipográfica.
- Conservar el callout «Aparece en N OPDs» (es acierto aprobado).
- Identificador con punto, no guion.

## Decisiones que tomas vos (documentar en commit)
- Qué mostrar en el Inspector vacío (placeholder italic vs OPL completa).
- Orden y separadores de las secciones apiladas.

## Forma del entregable
- Commits `feat(ui): L3 Inspector ficha continua sin tabs`, `fix(ui): identificador o.NN con punto`, `fix(ui): retira contadores de Inspector vacío`.
