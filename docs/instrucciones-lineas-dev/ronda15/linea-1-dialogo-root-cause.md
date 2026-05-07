# Línea 1 — `Dialogo` root-cause + regresiones visuales revertidas

## 1. Misión

Investigar y corregir la causa raíz por la que `Dialogo` se monta pero no pinta cuando el padre `<main>` usa `display: grid` y existen subárboles SVG/composite layers. El objetivo no es re-aplicar cambios revertidos a ciegas; es aislar el fallo y dejar un test browser que lo impida.

Slice mínimo:

- Repro focal en Playwright.
- Fix focal en `Dialogo.tsx` o su montaje.
- Si el fix lo permite, reintroducir una mejora revertida por commit separado.

Fuera de slice: normalización IFML sistémica. Si aparece deuda de modal-stack, coordinar con L3 y no absorberla salvo que sea causa directa del bug.

## 2. HU Base

| HU/corte | Aporte |
|---|---|
| Beta0 foundation | Estabilidad visual de modales como gate pre-Beta1. |
| HU-30.037 | Mantener Escape/cancelación modal ya cubierta. |
| IFML H-1 | Contexto: pila modal futura, no implementación obligatoria salvo que el bug lo requiera. |

## 3. Anclaje A Evidencia

- `app/src/ui/Dialogo.tsx`: wrapper actual usa backdrop `position: fixed`, `display: grid`, `placeItems: center`, `zIndex: 1000`.
- `app/src/ui/App.tsx`: `<main>` usa grid de workbench.
- `app/src/render/jointjs/JointCanvas.tsx`: canvas SVG/composite layer activo.
- Reverts a explicar: `789eb0e`, `816e7bf`, `73f46ce`.
- `docs/HANDOFF.md`: “Reverts conscientes”.
- OPCloud: revisar primero patrones de overlays/dialogs en `opm-extracted/src/app/modules/layout/main/main.component.ts` y dialogs relevantes; no copiar Angular.

## 4. Archivos Permitidos

```text
app/src/ui/Dialogo.tsx                         EDIT focal
app/src/ui/App.tsx                             LECTURA / test hook solo si imprescindible
app/src/render/jointjs/JointCanvas.tsx         EDIT solo para reintroducir role accesible con smoke
app/src/ui/DialogoCargarModelo.tsx             LECTURA
app/src/ui/DialogoPlantillas.tsx               LECTURA
app/src/ui/CapturadorBugs.tsx                  LECTURA
app/e2e/11-dialogo-layout-regression.spec.ts   NUEVO
```

## 5. Restricciones De No Colisión

- No tocar `app/src/ui/toolbar/*` (territorio L2).
- No tocar `app/scripts/evaluacion-exhaustiva.mjs` ni flujos/eventos globales (territorio L3).
- No tocar render fidelity general (territorio L4).
- No tocar store/kernel/OPL/serializadores.
- No meter modal-stack completo salvo que el repro demuestre que es la causa real.
- No usar z-index arbitrariamente alto sin documentar stacking context.

## 6. Slice Mínimo Shippeable

1. Crear repro Playwright: abrir un diálogo real (`DialogoCargarModelo`, `DialogoPlantillas` o capturador de bugs) con el canvas montado y verificar bounding box visible + pixel no transparente/oculto.
2. Aislar causa: stacking context, fixed dentro de grid, paint containment, SVG layer, focus trap o composite layer.
3. Aplicar fix focal: preferir portal/host modal estable o ajuste de stacking context explícito antes que tocar cada diálogo.
4. Re-evaluar mejoras revertidas:
   - `modal-grid`: solo si el diálogo pinta y no rompe layout.
   - `mask-image` scroll affordance: solo si no crea layer conflict.
   - `canvas role=application`: solo si smoke accesible queda verde.

## 7. Tests Obligatorios

- Nuevo smoke `11-dialogo-layout-regression.spec.ts`.
- Debe cubrir al menos un diálogo ancho con grid interno (`DialogoCargarModelo`) y un diálogo simple (`DialogoVersiones` o capturador).
- Si reintroduces mejora revertida, agrega test focal que habría fallado antes.

## 8. Verificación

```bash
cd app && bun run check
cd app && bun run lint
cd app && bun run build
cd app && bun run browser:smoke
```

## 9. Decisiones Bloqueadas

- No convertir todos los modales a un framework externo.
- No reabrir tokens ni diseño visual global.
- No degradar accesibilidad para pasar smokes.

## 10. Decisiones Que Tomas Vos

- Si el fix debe ser portal modal único, documentar host elegido.
- Si uno de los 3 reverts sigue siendo inviable, dejar diagnóstico reproducible y no reintroducirlo.
- Si el problema real es browser-specific, fijar evaluación con Chromium porque Playwright actual usa Chromium.

## 11. Forma Del Entregable

Commits sugeridos:

1. `test(e2e): reproduce dialogo invisible sobre grid y canvas SVG`
2. `fix(ui): estabiliza Dialogo sobre workbench grid`
3. `ux/a11y(...): reintroduce <mejora> con smoke focal` (opcional, uno por mejora)
