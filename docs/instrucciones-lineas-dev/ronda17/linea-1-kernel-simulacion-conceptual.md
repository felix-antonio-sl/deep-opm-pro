# Linea 1 — Kernel de simulacion conceptual

## 1. Mision

Crear un kernel puro de simulacion conceptual: derivar pasos ejecutables desde procesos/estados/enlaces, ejecutar paso determinista y producir trace sin mutar el modelo.

Fuera de slice: UI, animaciones, user functions, probabilidad.

## 2. HU base

| HU | Path | Aporte |
|---|---|---|
| HU-B0.005/.013/.020/.027 | `docs/historias-usuario-v2/epicas/epica-b0-simulacion-conceptual.md` | Play, orden sync, orden por Y, transiciones de estado. |

## 3. Anclaje a evidencia

- SSOT/metodologia: modelos conceptuales y ejecucion como razonamiento sobre procesos/estados.
- OPCloud: `SimulationElement.ts` y `HeadlessRunnerComponent` como referencia UX/alcance.
- App: estados, enlaces y value slots ya existen.

## 4. Archivos permitidos

```text
app/src/modelo/simulacion/tipos.ts             NUEVO
app/src/modelo/simulacion/plan.ts              NUEVO
app/src/modelo/simulacion/runner.ts            NUEVO
app/src/modelo/simulacion/*.test.ts            NUEVO
```

## 5. Restricciones de no-colision

No tocar UI. No agregar campos persistentes al modelo salvo que L3 lo acuerde; estado de simulacion es derivado/runtime.

## 6. Slice minimo shippeable

- `planificarSimulacion(modelo, opdId)` devuelve pasos ordenados.
- `ejecutarPaso(contexto)` devuelve nuevo contexto + trace.
- Transiciones de estado usan enlaces/resultados existentes si son inferibles; si no, diagnostico "no simulable".

## 7. Tests obligatorios

Unit tests puros para orden por Y, proceso sin precondiciones, transicion estado y diagnostico no simulable.

## 8. Verificacion

```bash
cd app && bun run check
```

## 9. Decisiones bloqueadas

No async paralelo en Beta2 inicial salvo que salga gratis de la representacion.

## 10. Decisiones a documentar

Definir subconjunto exacto de enlaces que disparan transicion en Beta2.

## 11. Entregable

Commit sugerido: `feat(simulacion): kernel conceptual determinista con trace`

