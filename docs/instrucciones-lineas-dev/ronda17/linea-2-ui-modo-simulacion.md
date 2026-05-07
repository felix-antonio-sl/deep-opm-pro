# Linea 2 — UI modo simulacion

## 1. Mision

Agregar modo simulacion visible: toolbar dedicada, play/pause/stop/step, bloqueo de edicion y marcas visuales de proceso/estado activo.

Fuera de slice: configuracion avanzada, headless runner completo, export de traces.

## 2. HU base

| HU | Path | Aporte |
|---|---|---|
| HU-B0.001..012 | `docs/historias-usuario-v2/epicas/epica-b0-simulacion-conceptual.md` | Entrar/salir, controles, velocidad, play/pause/stop. |
| HU-B0.016/.018/.024/.030 | mismo | Marcas visuales, read-only, tooltips. |

## 3. Anclaje a evidencia

- OPCloud: element toolbar abre `SimulationElementComponent`; no copiar UI, destilar controles esenciales.
- App: Toolbar ya esta split por modos; agregar modo simulacion como modo nuevo, no reengordar toolbar principal.

## 4. Archivos permitidos

```text
app/src/ui/simulacion/BarraSimulacion.tsx      NUEVO
app/src/ui/simulacion/PanelTraceSimulacion.tsx NUEVO opcional
app/src/store/simulacion.ts                    NUEVO/EDIT
app/src/render/jointjs/*.tsx                   EDIT minimo para overlays
app/e2e/12-beta2-modo-simulacion.spec.ts       NUEVO
```

## 5. Restricciones de no-colision

Consumir kernel L1; no implementar reglas semanticas en UI. No tocar TablaEnlaces/Busqueda.

## 6. Slice minimo shippeable

- Boton "Simulacion" entra a modo.
- Barra de simulacion reemplaza acciones de edicion.
- Step/Play/Stop funcionan con kernel.
- Canvas read-only mientras simula.
- Proceso activo y estado actual se ven con estilos no confundibles con refinamiento.

## 7. Tests obligatorios

Smoke: entrar modo, step, ver marca, comprobar que crear objeto queda bloqueado, stop vuelve a edicion.

## 8. Verificacion

```bash
cd app && bun run check
cd app && bun run browser:smoke -- --grep "simulacion"
```

## 9. Decisiones bloqueadas

No usar modal pesado como unica interfaz. La simulacion es modo del modelador.

## 10. Decisiones a documentar

Color/estilo de activo vs refinable; debe consultar `docs/JOYAS.md`.

## 11. Entregable

Commit sugerido: `feat(ui): modo simulacion con barra y canvas read-only`

