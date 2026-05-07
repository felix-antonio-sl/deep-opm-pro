# Linea 4 — Eval Beta2 sobre dominio ancla

## 1. Mision

Cerrar Beta2 con un flujo real: cargar modelo ancla Beta1, entrar a simulacion, ejecutar pasos, observar cambio de estado/valor y leer trace.

Fuera de slice: ampliar motor; esta linea prueba y corrige residuos pequenos.

## 2. HU base

| HU | Path | Aporte |
|---|---|---|
| EPICA-B0 | `docs/historias-usuario-v2/epicas/epica-b0-simulacion-conceptual.md` | Flujo conceptual completo. |
| EPICA-B1 subset | `docs/historias-usuario-v2/epicas/epica-b1-simulacion-computacional.md` | Valores simples. |

## 3. Anclaje a evidencia

- Beta1 ancla ya existe tras ronda 16.
- Bug capturer disponible para fallas visuales.
- Quality ledger debe sumar law/eval de simulacion si se agrega.

## 4. Archivos permitidos

```text
app/e2e/12-beta2-dominio-ancla.spec.ts         NUEVO
app/src/modelo/simulacion/**                   EDIT solo fix residual
app/src/ui/simulacion/**                       EDIT solo fix residual
docs/bugs/**                                   NUEVO si aplica
```

## 5. Restricciones de no-colision

No reabrir alcance Beta2. Si el eval exige user functions, registrar Delta y mantener Beta2-min.

## 6. Slice minimo shippeable

Smoke end-to-end:

1. cargar ancla;
2. seleccionar OPD con proceso simulable;
3. entrar modo simulacion;
4. step;
5. ver proceso activo/estado current;
6. ver trace con valor/estado antes-despues;
7. stop vuelve a edicion.

## 7. Tests obligatorios

Smoke unico estable + unit residual si se corrige kernel.

## 8. Verificacion

```bash
cd app && bun run check
cd app && bun run browser:smoke -- --grep "Beta2"
cd app && bun run build
```

## 9. Decisiones bloqueadas

No cerrar Beta2 con demo artificial si el ancla Beta1 no ejecuta nada relevante.

## 10. Decisiones a documentar

Declarar el caso de simulacion que pasa y las capacidades que quedan en Delta.

## 11. Entregable

Commit sugerido: `test(e2e): beta2 simula dominio ancla con trace`

