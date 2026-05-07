# Linea 3 — Validacion metodologica accionable

## 1. Mision

Convertir `PanelMetodologia` en nucleo Beta1: avisos accionables con severidad, cita SSOT, navegacion al elemento, revalidacion on-demand y cobertura de reglas que aparecen en dominio real.

Fuera de slice: asistente de 12 etapas, IA generativa, regla engine externo.

## 2. HU base

| HU | Path | Aporte |
|---|---|---|
| HU-1C.013..019 | `docs/historias-usuario-v2/epicas/epica-1c-canvas-validaciones.md` | Panel, 5 reglas, severidad, lista, navegar, revalidar, citar SSOT. |

## 3. Anclaje a evidencia

- App actual: `app/src/modelo/checkers.ts`, `app/src/ui/PanelMetodologia.tsx`.
- OPCloud: `opm-extracted/src/app/dialogs/methodological-checking-dialog/checkers/`.
- SSOT: `metodologia-opm-es.md` gobierna la interpretacion; OPCloud no redefine semantica.

## 4. Archivos permitidos

```text
app/src/modelo/checkers.ts                     EDIT
app/src/modelo/checkers.test.ts                EDIT
app/src/modelo/tipos/avisos.ts                 EDIT aditivo
app/src/ui/PanelMetodologia.tsx                EDIT
app/src/store/uiPanel.ts                       EDIT aditivo para navegacion/revalidar
app/e2e/11-beta1-validacion-metodologica.spec.ts NUEVO
```

## 5. Restricciones de no-colision

No tocar TablaEnlaces ni busqueda salvo consumir accion de navegacion ya existente. No bloquear guardado por advertencias en Beta1: validar como feedback accionable.

## 6. Slice minimo shippeable

- Minimo 5 reglas con `codigo`, `severidad`, `mensaje`, `rationale`, `ssotRef`.
- Click en aviso navega al elemento/OPD.
- Boton revalidar visible y determinista.
- Aviso queda resuelto tras corregir el modelo.
- Cada regla cita SSOT y, si corresponde, referencia OPCloud destilada.

## 7. Tests obligatorios

- Unit: cada checker produce y deja de producir aviso en modelo minimo.
- Smoke: crear violacion, ver panel, navegar, corregir, revalidar.

## 8. Verificacion

```bash
cd app && bun run check
cd app && bun run browser:smoke -- --grep "Metodologia"
```

## 9. Decisiones bloqueadas

No hacer wizard metodologico. No usar LLM para decidir reglas runtime.

## 10. Decisiones a documentar

Si una regla OPCloud contradice SSOT, prevalece SSOT y se documenta el descarte.

## 11. Entregable

Commits sugeridos:

1. `feat(checkers): validacion metodologica accionable con citas SSOT`
2. `test(e2e): panel metodologia navega corrige y revalida`

