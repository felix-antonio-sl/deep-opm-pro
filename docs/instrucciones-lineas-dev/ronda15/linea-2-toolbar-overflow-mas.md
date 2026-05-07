# Línea 2 — Toolbar overflow manual `⋯ Más`

## 1. Misión

Reducir la Toolbar visible de ~38 controles a ~25 mediante un menú manual `⋯ Más`, sin detector automático de overflow. Es una decisión de diseño: mantener visibles acciones primarias de modelado y mover acciones secundarias/raras a un menú accesible.

Slice mínimo:

- Nuevo `ToolbarMas.tsx`.
- Rebalanceo de acciones visibles vs menú.
- Smoke de accesibilidad y conteo aproximado de controles visibles.

## 2. HU Base

| HU/corte | Aporte |
|---|---|
| Beta0 foundation | Chrome usable antes de Beta1. |
| EPICA-90 shortcuts | Mantener contraparte visible o en menú accesible para acciones con atajo. |
| IFML CN-DT/CN-SOT/CN-MOT | Toolbar dinámica según contexto, pero con contratos de acción claros. |

## 3. Anclaje A Evidencia

- `Toolbar.tsx` ya es orquestador de 59 LOC; trabajar en `app/src/ui/toolbar/*`.
- `ToolbarBase.tsx` concentra demasiado chrome estable y modeless layers.
- `ToolbarCreacion.tsx`, `ToolbarSeleccion.tsx`, `ToolbarMultiseleccion.tsx` separan modos.
- Steipete T2.1 opción C proponía overflow automático con IntersectionObserver; esta línea lo rechaza por complejidad y elige menú manual.
- OPCloud usa element tool bar y popups contextuales; revisar `opm-extracted/src/app/modules/layout/element-tool-bar/element-tool-bar.component.ts` y `rappid-toolbar.component.ts`.

## 4. Archivos Permitidos

```text
app/src/ui/toolbar/ToolbarMas.tsx              NUEVO
app/src/ui/toolbar/ToolbarBase.tsx             EDIT
app/src/ui/toolbar/ToolbarCreacion.tsx         EDIT
app/src/ui/toolbar/ToolbarSeleccion.tsx        EDIT
app/src/ui/toolbar/ToolbarMultiseleccion.tsx   EDIT
app/src/ui/toolbar/toolbarStyles.ts            EDIT
app/e2e/12-toolbar-overflow.spec.ts            NUEVO
```

## 5. Restricciones De No Colisión

- No tocar `Dialogo.tsx` ni `App.tsx` (territorio L1).
- No mover acciones al Inspector si eso rompe discoverability.
- No ocultar acciones críticas de creación, guardar, undo/redo, selección contextual primaria ni OPL reverse.
- No implementar medición automática de ancho en esta línea.

## 6. Slice Mínimo Shippeable

1. Clasificar acciones:
   - visibles siempre: menú, título, crear objeto/proceso, demo, guardar/cargar, undo/redo;
   - visibles por contexto: enlace, traer conectados, plantillas si seleccionadas;
   - mover a `⋯ Más`: acciones raras, settings, grid config secundaria, export/mapa, opciones de gestión, duplicados textuales.
2. Crear `ToolbarMas.tsx` con botón iconográfico `⋯ Más`, `aria-haspopup="menu"`, `aria-expanded`, Escape/click-outside.
3. Mantener keyboard support básico: Enter/Space abre, Escape cierra, items son `button role="menuitem"`.
4. Mantener títulos/tooltips existentes.
5. Smoke cuenta controles visibles por `data-testid="toolbar-root"` y verifica que acciones movidas siguen invocables desde `⋯ Más`.

## 7. Tests Obligatorios

- `12-toolbar-overflow.spec.ts`:
  - Toolbar inicial tiene un máximo razonable de botones/select visibles (objetivo ≤ 25, tolerancia documentada si hay selects).
  - `⋯ Más` abre menú accesible.
  - Al menos 3 acciones movidas siguen funcionando o abriendo su diálogo/menu.
  - No hay overflow horizontal en viewport desktop estándar.

## 8. Verificación

```bash
cd app && bun run check
cd app && bun run lint
cd app && bun run build
cd app && bun run browser:smoke
```

## 9. Decisiones Bloqueadas

- No volver a monolito `Toolbar.tsx`.
- No introducir librería de menú.
- No usar IntersectionObserver para overflow automático.
- No mover capacidades Beta1 a este refactor.

## 10. Decisiones Que Tomas Vos

- Lista exacta visible vs `⋯ Más`.
- Si `Grid` queda visible y `Config grid` pasa a `⋯ Más`, documentarlo.
- Si una acción tiene atajo, el texto del menú debe incluirlo.

## 11. Forma Del Entregable

Commits sugeridos:

1. `feat(toolbar): agrega menu Mas accesible`
2. `refactor(toolbar): mueve acciones secundarias a Mas`
3. `test(e2e): toolbar overflow queda bajo control`
