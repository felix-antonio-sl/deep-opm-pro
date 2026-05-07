# Linea 3 — Valores simples y transiciones

## 1. Mision

Extender Beta2 desde simulacion conceptual hacia valores simples: atributos con value slots existentes, asignacion inicial y trace de cambio antes/despues.

Fuera de slice: funciones de usuario, distribuciones probabilisticas, multiples ejecuciones XLSX.

## 2. HU base

| HU | Path | Aporte |
|---|---|---|
| HU-B1.014/.015/.024 | `docs/historias-usuario-v2/epicas/epica-b1-simulacion-computacional.md` | Valor manual, ejecucion determinista, display actualizado. |
| EPICA-17 | backlog atributos | Reusar slots de valor ya implementados. |

## 3. Anclaje a evidencia

- App actual: `app/src/modelo/validadores/valorSlot.ts`, `operaciones/entidad.ts`, tests de EPICA-17.
- OPCloud: `models/modules/attribute-validation/attribute-value.ts`, `numeric-range.ts`, `validation-module.ts`.
- SSOT: atributo como objeto exhibido y valor como slot/estado de atributo.

## 4. Archivos permitidos

```text
app/src/modelo/validadores/valorSlot.ts        EDIT aditivo
app/src/modelo/simulacion/valores.ts           NUEVO
app/src/modelo/simulacion/runner.ts            EDIT
app/src/ui/simulacion/**                       EDIT lectura/visualizacion
app/src/modelo/simulacion/*.test.ts            EDIT
```

## 5. Restricciones de no-colision

No agregar lenguaje de formulas. Si se necesita computo, limitar a operaciones predefinidas muy pequenas y documentarlas como Beta2-min.

## 6. Slice minimo shippeable

- Contexto de simulacion mantiene valores runtime separados del modelo.
- Paso puede leer atributo instrumento y escribir atributo resultado si regla simple existe.
- Trace muestra `Temperatura: value -> 25` o equivalente.
- Valores invalidos producen diagnostico, no mutacion.

## 7. Tests obligatorios

Unit: validar valores, aplicar cambio runtime, no mutar modelo persistente. Smoke si L2 ya expone panel trace.

## 8. Verificacion

```bash
cd app && bun run check
```

## 9. Decisiones bloqueadas

No user JS. No probabilidades. No backend.

## 10. Decisiones a documentar

Definir si Beta2-min soporta solo asignacion manual o tambien suma/resta predefinida. Preferencia: asignacion/transicion primero.

## 11. Entregable

Commit sugerido: `feat(simulacion): valores simples runtime con trace antes-despues`

