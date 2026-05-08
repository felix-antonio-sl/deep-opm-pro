# L2 — Responsive como modo revisión/navegación

## 1. Misión

Reemplazar la compresión responsive por un **modo revisión/navegación** en mobile. Cierra el pendiente `P2 - Responsive es compresion, no adaptacion` y el eval mínimo "En mobile, revisar OPD/OPL/issues sin toolbar saturada".

**Slice mínimo entregable**:

1. A `< 640px`, ocultar la toolbar primaria de modelado pesado y mostrar una barra compacta de revisión.
2. Priorizar vistas: `Canvas`, `OPDs`, `OPL`, `Issues`.
3. Permitir selección, navegación OPD, filtro OPL e inspección de issues.
4. Si EPICA-42/notas ya está implementada al momento de ejecutar la línea, exponer lectura/listado de comentarios-notas del OPD activo como parte de revisión. Si no está implementada, registrar `WARN: comentarios no disponibles` en el eval, no crear el dominio desde cero.
5. Mantener edición pesada disponible solo en tablet/desktop o mediante panel full-screen explícito si ya existe.
6. A `640-1024px`, usar tablet híbrido: toolbar reducida + paneles como drawers.
7. En desktop, no cambiar comportamiento.

**Fuera de slice**: no implementar edición completa mobile, no rediseñar JointJS, no reabrir toolbar ronda19.

## 2. HU base

| HU | Path | Aporte |
|---|---|---|
| HU-20.009 | `docs/historias-usuario-v2/epicas/epica-20-estructura-arbol-opd.md` | Navegación entre OPDs |
| HU-50.001+ | `docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | OPL visible/filtrable |
| HU-42.011+ | `docs/historias-usuario-v2/epicas/epica-42-colaboracion-notas.md` | Comentarios/notas como lente de revisión si existe implementación |
| HU-90.017 | `docs/historias-usuario-v2/epicas/epica-90-interaccion-shortcuts.md` | Contraparte gráfica de acciones |
| HU-90.020 | `docs/historias-usuario-v2/epicas/epica-90-interaccion-shortcuts.md` | Fit-to-screen |
| HU-92.030 (NUEVO) | declarar como propuesta | Modo revisión mobile |

## 3. Anclaje a evidencia

- Informe: screenshots `44-mobile-390x844-toolbar-panels.png`, `45-tablet-768x1024-toolbar-panels.png`, `46-desktop-after-responsive-reset.png`.
- `app/scripts/evaluacion-exhaustiva.mjs`: ya contiene pasada responsive y overflow.
- `app/src/ui/App.tsx`: grid principal.
- `app/src/ui/toolbar/*`: toolbar actual.
- `app/src/ui/PanelOpl.tsx`, `PanelMetodologia.tsx`, `ArbolOpd.tsx`: vistas que mobile debe priorizar.
- OPCloud: revisar `opm-extracted/INDEX.md` para patrones de panel responsive antes de implementar.

## 4. Archivos permitidos

```
app/src/ui/layoutResponsive.ts                         NUEVO
app/src/ui/layoutResponsive.test.ts                    NUEVO
app/src/ui/ModoRevisionMobile.tsx                      NUEVO
app/src/ui/ModoRevisionMobile.test.tsx                 NUEVO
app/src/ui/App.tsx                                     EDIT aditivo (branch por viewport)
app/src/ui/toolbar/ToolbarBase.tsx                     EDIT aditivo (compactar/ocultar en mobile)
app/src/ui/tokens.ts                                   EDIT aditivo (mobile nav)
app/src/store/uiPanel.ts                               EDIT aditivo (vistaMobileActiva)
app/src/store/sliceTypes.ts                            EDIT aditivo
app/src/store/modelo/acciones-ui.ts                    EDIT aditivo
app/e2e/22-responsive-review.spec.ts                   NUEVO
docs/historias-usuario-v2/...                          NO TOCAR
```

## 5. Restricciones de no-colisión

- Si ronda19 L1 ya agrupó toolbar, no reordenar clusters; solo definir su visibilidad por viewport.
- Si ronda20 L3 dockea biblioteca, en mobile mantener overlay/drawer; no mostrar dock dividido.
- No romper testIds desktop: smokes existentes suelen correr desktop.
- No usar viewport-width para font-size.

## 6. Slice mínimo shippeable

### Helper responsive

```ts
export type BreakpointOpm = "mobile" | "tablet" | "desktop";

export function resolverBreakpoint(width: number): BreakpointOpm {
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}
```

### Modo revisión

`ModoRevisionMobile` expone tabs inferiores o superiores:

- `Canvas`: canvas visible, fit-to-screen accesible.
- `OPDs`: árbol OPD full-screen/drawer.
- `OPL`: panel OPL filtrable.
- `Issues`: estructura/metodología/estilo si ronda19 L3 existe; fallback a panel actual.
- `Notas`: solo si el dominio EPICA-42 está implementado; si no, no se muestra tab y el eval deja WARN explícito.

Los labels deben caber a 390px. Usar iconos cuando existan.

### Contrato de edición

En mobile, acciones de modelado pesado pueden estar ocultas o bajo `Editar en escritorio/tablet`. No bloquear selección, navegación, zoom/fit ni lectura.

## 7. Tests obligatorios

- Unit: `resolverBreakpoint` cubre 390, 768, 1280.
- E2E 390x844: no hay overflow horizontal > 8px; toolbar primaria no está saturada; tabs `Canvas`, `OPDs`, `OPL`, `Issues` son visibles.
- E2E 390x844: cargar fixture, abrir OPD tree, seleccionar OPD, revisar OPL e issues.
- E2E 390x844: si existe UI de notas/comentarios, abrir la vista `Notas`; si no existe, el test del harness UX debe registrar WARN no bloqueante.
- E2E desktop: toolbar y paneles existentes siguen visibles.

## 8. Verificación

```bash
cd app
bun run check
bun run lint
bun run build
bun run browser:smoke
bun run scripts/evaluacion-exhaustiva.mjs http://127.0.0.1:5173/ --out ronda21-l2
```

## 9. Decisiones bloqueadas

- Mobile no es desktop comprimido.
- No implementar modelado completo en 390px.
- No reabrir EPICA-91.
- No cambiar canvas desktop.

## 10. Decisiones que tomas vos

- Navegación mobile como tabs superiores o inferiores.
- Si tablet usa drawers o grid de dos columnas.
- Texto exacto para indicar edición pesada fuera de mobile.

## 11. Forma del entregable

Commits sugeridos:

- `feat(responsive): modo revision mobile`
- `test(e2e): mobile revisa opd opl issues sin saturar toolbar`

No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`.
