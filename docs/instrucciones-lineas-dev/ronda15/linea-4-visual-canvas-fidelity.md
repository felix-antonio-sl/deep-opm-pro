# Línea 4 — Visual-canvas fidelity + autolayout sugerido

## 1. Misión

Mejorar fidelidad visual del canvas antes de Beta1: shapes, enlaces, anclaje, routing, cruces y autolayout como "vista sugerida/aplicar layout". Esta línea absorbe la parte Visual-canvas fidelity de la ronda 16 propuesta.

Slice mínimo:

- Auditoría focal contra SSOT + `docs/JOYAS.md` + `opm-extracted/`.
- Un paquete de mejoras visuales de bajo riesgo sobre shapes/enlaces/anclaje/routing.
- Autolayout no persistente o aplicable bajo acción explícita.

Fuera de slice: simulación, TablaEnlaces Beta1, rediseño completo de JointJS.

## 2. HU Base

| HU/corte | Aporte |
|---|---|
| Beta0 foundation | Canvas profesional y estable para modelado real. |
| EPICA-1A grid/layout | Autolayout sugerido/aplicar layout, no movimiento automático persistente. |
| EPICA-15 enlaces avanzados | Routing/anclaje/cruces más legibles. |
| SSOT visual | Shapes y enlaces deben respetar gramática OPD. |

## 3. Anclaje A Evidencia

- `docs/JOYAS.md`: dimensiones, colores, tipografía, wrapper+line, markers.
- `assets/svg/links/procedural/`, `assets/svg/links/structural/`: fuente canónica de markers.
- `opm-extracted/src/app/modules/layout/main/main.component.ts`: scrollbars, main-content, navigator.
- `opm-extracted/src/app/modules/layout/element-tool-bar/element-tool-bar.component.ts`: affordances contextuales visuales.
- `app/src/render/jointjs/` y `app/src/canvas/`: implementación actual.

## 4. Archivos Permitidos

```text
app/src/render/jointjs/JointCanvas.tsx                  EDIT
app/src/render/jointjs/customShapes.ts                  EDIT si aplica
app/src/render/jointjs/composers/**                     EDIT
app/src/render/jointjs/handlers/**                      EDIT acotado
app/src/canvas/**                                       EDIT si routing/layout
app/src/ui/toolbar/ToolbarCreacion.tsx                  EDIT solo botón/acción layout sugerido
app/src/ui/ModalConfiguracionGrid.tsx                   LECTURA
app/e2e/14-canvas-fidelity.spec.ts                      NUEVO
```

## 5. Restricciones De No Colisión

- No tocar `Dialogo.tsx` ni App modal stack (L1/L3).
- No tocar ToolbarBase/ToolbarMas salvo si necesitas exponer "Aplicar layout" y coordinas con L2.
- No persistir autolayout automáticamente al cargar modelo.
- No redibujar SVGs canónicos si existen en `assets/`.

## 6. Slice Mínimo Shippeable

### Auditoría

- Comparar objeto/proceso/estado/enlaces contra `JOYAS.md` y assets.
- Registrar brechas en commit o mini reporte en comentario de PR/entregable, no crear handoff paralelo.

### Canvas

- Corregir al menos una familia visual que afecte legibilidad real: anclaje, cruces, routing o marker.
- Mantener metadata estable cubierta por laws 14.2.

### Autolayout

- Implementar como acción explícita "Sugerir layout" / "Aplicar layout".
- Preview o modo no destructivo preferido.
- Si aplica cambios, deben ser undoables.

## 7. Tests Obligatorios

- Unit para función pura de layout/routing si se introduce.
- Smoke `14-canvas-fidelity.spec.ts`:
  - modelo mediano demo se renderiza con objetos/procesos visibles;
  - enlaces tienen marker correcto;
  - aplicar layout no rompe selección ni undo.

## 8. Verificación

```bash
cd app && bun run check
cd app && bun run lint
cd app && bun run build
cd app && bun run browser:smoke
```

## 9. Decisiones Bloqueadas

- No migrar fuera de JointJS.
- No clonar Rappid/Angular.
- No implementar simulación.
- No crear dependencia nueva de layout sin aprobación.

## 10. Decisiones Que Tomas Vos

- Qué familia visual corrige primero.
- Si autolayout queda en preview, apply o ambos.
- Cómo documentas diferencias intencionales respecto de OPCloud.

## 11. Forma Del Entregable

Commits sugeridos:

1. `docs(canvas): audita fidelity contra SSOT y opm-extracted`
2. `fix(render): mejora anclaje/routing/markers del canvas`
3. `feat(canvas): layout sugerido aplicable y undoable`
4. `test(e2e): canvas fidelity pre-beta`
