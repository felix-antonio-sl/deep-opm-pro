# Linea 5 — Eval Beta1 de dominio real

## 1. Mision

Cerrar Beta1 con un flujo end-to-end verificable: construir/cargar modelo ancla, usar descomposicion, estados, enlaces avanzados, validacion, busqueda, TablaEnlaces y persistencia sin workaround.

Fuera de slice: simulacion, export, wizard, IA, colaboracion.

## 2. HU base

| HU | Path | Aporte |
|---|---|---|
| EPICA-12 | `docs/historias-usuario-v2/epicas/epica-12-canvas-descomposicion.md` | Descomposicion robusta. |
| EPICA-13 | `docs/historias-usuario-v2/epicas/epica-13-canvas-estados.md` | Estados/designaciones. |
| EPICA-15 | `docs/historias-usuario-v2/epicas/epica-15-canvas-enlaces-avanzados.md` | Enlaces avanzados. |
| EPICA-1B | `docs/historias-usuario-v2/epicas/epica-1b-canvas-traer-conectados.md` | Traer conectados residual si aparece. |

## 3. Anclaje a evidencia

- Ronda 15 se asume perfecta: el canvas/IFML/contexto ya no bloquea.
- App actual ya tiene refinamiento Thing, estados, enlaces y OPL reverse alpha cerrado.
- SSOT: Thing refinement, estados de objeto, OPL y metodologia.

## 4. Archivos permitidos

```text
app/e2e/11-beta1-dominio-real.spec.ts          NUEVO
app/src/modelo/operaciones/refinamiento/**     EDIT solo si eval detecta residuo
app/src/modelo/operaciones/estados.ts          EDIT solo si eval detecta residuo
app/src/store/modelo/acciones-*.ts             EDIT solo si eval detecta residuo
docs/bugs/**                                   NUEVO si hay bug capturado
```

## 5. Restricciones de no-colision

Esta linea mergea al final. No redisenar superficies de L1-L4; consumirlas como usuario.

## 6. Slice minimo shippeable

Crear un smoke "beta1 dominio real" que haga, en una sesion:

1. cargar/crear modelo ancla;
2. navegar multiples OPDs;
3. usar TablaEnlaces;
4. buscar una Thing y saltar;
5. provocar/corregir un aviso metodologico;
6. guardar/cargar;
7. confirmar OPL y canvas coherentes.

## 7. Tests obligatorios

Un smoke largo puede ser suficiente si esta bien nombrado y estable. Si falla por bug visual, capturar `BUG-*` y reportar.

## 8. Verificacion

```bash
cd app && bun run check
cd app && bun run browser:smoke -- --grep "Beta1 dominio real"
cd app && bun run build
```

## 9. Decisiones bloqueadas

No bajar gate Beta1 para pasar rapido. Si el dominio ancla necesita workaround, Beta1 no cierra.

## 10. Decisiones a documentar

Declarar explicitamente que dominio ancla pasa el eval y que capacidades quedan para Gamma/Delta.

## 11. Entregable

Commits sugeridos:

1. `test(e2e): eval beta1 dominio real end-to-end`
2. `fix(beta1): corrige residuos semanticos detectados por eval`

