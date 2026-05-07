# Línea 3 — IFML flow cleanup + `evaluacion-exhaustiva`

## 1. Misión

Normalizar los flujos IFML que bloquean trabajo diario y convertir `app/scripts/evaluacion-exhaustiva.mjs` en loop operativo de captura pre-Beta1. Esta línea absorbe la parte "IFML + bugs visuales" de la ronda 16 propuesta.

Slice mínimo:

- Corregir al menos un flujo IFML de alto impacto (preferencia: modal-stack LIFO si L1 no lo resolvió; si no, reemplazo de un `window.dispatchEvent` ad-hoc).
- Ejecutar y ajustar `evaluacion-exhaustiva.mjs` para reportar bugs visuales con IDs/capturas útiles.
- Nuevo smoke focal para el flujo corregido.

Fuera de slice: visual-canvas fidelity profundo (L4) y rediseño de Toolbar (L2).

## 2. HU Base

| HU/corte | Aporte |
|---|---|
| Beta0 foundation | Flujos/modales/eventos explícitos antes de Beta1. |
| IFML H-1 | Modal-stack LIFO determinista si entra en scope. |
| IFML H-3/H-4 | Reemplazar o tipar SystemEvents ad-hoc si son el slice elegido. |
| Capturador bugs dev-only | `evaluacion-exhaustiva` debe producir señales accionables para reportar/capturar. |

## 3. Anclaje A Evidencia

- `docs/auditorias/2026-05-07-auditoria-ifml.md` §8 H-1/H-3/H-4/O-1.
- `app/src/ui/App.tsx`: cierre de modales y atajos globales.
- `app/src/ui/ConfirmacionContext.tsx`: confirmación dirty actual.
- `app/src/ui/toolbar/ToolbarBase.tsx`: listeners `window.addEventListener("opm:*")`.
- `app/scripts/evaluacion-exhaustiva.mjs`: loop visual/dev vigente.

## 4. Archivos Permitidos

```text
app/src/ui/App.tsx                              EDIT acotado
app/src/store/runtime.ts                        EDIT si el flujo elegido lo requiere
app/src/store/tipos.ts                          EDIT solo tipo UI nuevo opcional
app/src/ui/ConfirmacionContext.tsx              LECTURA/EDIT si modal-stack
app/src/ui/toolbar/ToolbarBase.tsx              LECTURA; EDIT solo si reemplaza CustomEvent elegido
app/scripts/evaluacion-exhaustiva.mjs           EDIT
app/e2e/13-ifml-flujos-visuales.spec.ts         NUEVO
```

## 5. Restricciones De No Colisión

- Esperar o rebasear sobre L1 antes de tocar modales.
- No tocar `Dialogo.tsx` salvo patch acordado con L1.
- No tocar `toolbar/*.tsx` salvo el CustomEvent elegido y con hunk mínimo.
- No tocar render/canvas fidelity (L4).

## 6. Slice Mínimo Shippeable

### Flujos

Elegir una ruta:

- **Ruta A recomendada**: `pilaModales: ModalId[]` para cierre LIFO de modales globales, preservando flags existentes como API pública si conviene.
- **Ruta B alternativa**: reemplazar un `window.dispatchEvent` por estado de store tipado (`nuevaCosaPendiente` o export mapa).

### Evaluación visual

- Ejecutar `evaluacion-exhaustiva.mjs` antes/después.
- Si detecta bugs visuales, registrar salida legible y conectarla con capturador si aplica.
- No versionar `_eval-output/`.

### IFML

Documentar en commit el mapa `ViewContainer -> Event -> Action -> Flow` del flujo corregido.

## 7. Tests Obligatorios

- Unit si se agrega estado/store.
- Smoke `13-ifml-flujos-visuales.spec.ts`:
  - Escape cierra el top modal correcto o el SystemEvent reemplazado funciona sin listener global.
  - No regresan smokes existentes de HU-30.037.

## 8. Verificación

```bash
cd app && bun run check
cd app && bun run lint
cd app && bun run build
cd app && bun run browser:smoke
cd app && bun run scripts/evaluacion-exhaustiva.mjs
```

## 9. Decisiones Bloqueadas

- No implementar toda la auditoría IFML H-1..H-14.
- No abrir TablaEnlaces como feature Beta1.
- No agregar dependencia de estado externo ni librería modal.

## 10. Decisiones Que Tomas Vos

- Elegir Ruta A o Ruta B y justificar por evidencia.
- Definir si `evaluacion-exhaustiva` solo reporta o también crea artefactos referenciables.
- Si hay bug visual vivo, decidir si se captura como `BUG-*` o queda en reporte temporal.

## 11. Forma Del Entregable

Commits sugeridos:

1. `refactor(ifml): normaliza flujo modal/evento elegido`
2. `test(e2e): cubre flujo IFML pre-beta`
3. `chore(eval): mejora evaluacion exhaustiva visual`
