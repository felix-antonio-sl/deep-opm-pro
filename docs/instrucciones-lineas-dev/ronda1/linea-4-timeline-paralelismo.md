# Línea 4 — Timeline editor para subprocesos en in-zoom + paralelismo OPL

## 1. Misión

Hoy, dentro de un OPD hijo de descomposición, el orden temporal de subprocesos se infiere por `apariencia.y` (pure lente derivada). El usuario sólo puede reordenar arrastrando subprocesos en el canvas, lo cual es ergonómicamente pobre cuando hay 5+ subprocesos. Esta línea agrega un **editor de timeline lateral** (vista lista vertical reordenable por drag) que opera sobre la misma SSOT (`apariencia.y`).

**Adicionalmente**: verificar que la plantilla OPL-ES "en paralelo" para subprocesos en misma `y` esté implementada en `app/src/opl/generar.ts`. Si no lo está, agregarla. Esta es una HU declarada como cubierta parcialmente en HANDOFF y la línea la cierra.

**Slice mínimo**: panel Timeline visible cuando el OPD activo es hijo de descomposición; lista los subprocesos del OPD por `y` ascendente; drag vertical reordena; los con misma `y` se agrupan visualmente como paralelos; OPL-ES emite "en paralelo" correctamente.

## 2. HU base (lectura obligatoria antes de codificar)

| HU | Path | Aporta |
|---|---|---|
| HU-12.013 | `docs/historias-usuario-v2/epicas/epica-12-canvas-descomposicion.md` (sección 12.013) | Cláusula "en esa secuencia" |
| HU-12.016 | `docs/historias-usuario-v2/epicas/epica-12-canvas-descomposicion.md` (sección 12.016) | Orden temporal por coordenada Y |
| HU-12.017 | `docs/historias-usuario-v2/epicas/epica-12-canvas-descomposicion.md` (sección 12.017) | Subprocesos concurrentes (misma Y) y "en paralelo" en OPL |
| HU-SHARED-002 (referencia) | `docs/historias-usuario-v2/shared/HU-SHARED-002-undo-redo.md` | Las acciones de timeline entran al stack undo |

## 3. Anclaje a evidencia

- **OPCloud (lectura)**: `opm-extracted/_raw/` — buscar componentes de timeline o reordenamiento. `rg "timeline|reorder|sequence" opm-extracted/`. Existe la posibilidad de que OPCloud no tenga este componente; en ese caso, el diseño es propio pero respeta la semántica SSOT.
- **JOYAS**: `docs/JOYAS.md` — colores cyan procesos, espaciado, tipografía.
- **Estado actual**: leer `app/src/store.ts` (acciones existentes: `moverApariencia`, `moverAparienciaPorId`); `app/src/modelo/operaciones.ts:278-310` para entender cómo se aplica un cambio de Y; `app/src/opl/generar.ts` para verificar el manejo actual de paralelismo.

## 4. Archivos permitidos (scope estricto)

```
app/src/ui/Timeline.tsx                      ← NUEVO — componente del editor
app/src/ui/App.tsx                           ← EDIT — montar Timeline en el layout cuando aplique
app/src/store.ts                             ← EDIT — acción reordenarSubprocesoEnTimeline (o reuso de moverAparienciaPorId)
app/src/opl/generar.ts                       ← EDIT — sólo para agregar/corregir plantilla "en paralelo" si falta
app/src/opl/generar.test.ts                  ← AGREGAR — test del paralelismo (no reemplazar lo de L3)
```

**Lectura permitida**:
- `app/src/modelo/operaciones.ts`: para entender la semántica.
- `app/src/modelo/tipos.ts`: para conocer la forma.

**Prohibido**: tocar `app/src/modelo/*` (sólo lectura), `app/src/ui/Toolbar.tsx`, `app/src/ui/Inspector.tsx`, `app/src/ui/PersistenciaJson.tsx`, `app/src/persistencia/*`, `app/src/serializacion/*`, `app/src/render/*`.

## 5. Restricciones de no-colisión

1. **No tocar el modelo**. Toda la mecánica de reorden se hace via `moverAparienciaPorId` o equivalente ya existente. Si la acción atómica que necesitás no existe, **componer** desde existentes en el store, no agregar al modelo.
2. **No tocar Inspector ni Toolbar**. Timeline es un panel propio.
3. **`opl/generar.ts`**: cambio quirúrgico para agregar la plantilla de paralelismo si falta. NO refactorizar el archivo. NO tocar el resto de plantillas.
4. **Layout en `App.tsx`**: agregar Timeline como panel lateral o inferior **sin romper** la disposición actual. Mostrar sólo cuando el OPD activo es hijo de una descomposición (`opd.padreId !== null` Y la entidad refinada del padre es `proceso`).

## 6. Slice mínimo shippeable

1. **Componente `Timeline.tsx`**:
   - Detecta si hay timeline aplicable (OPD activo es hijo de descomposición de proceso).
   - Lista los subprocesos del OPD activo ordenados por `y` ascendente, luego `x`.
   - Cada fila muestra: nombre del subproceso, indicador de paralelismo si comparte `y` con otro.
   - Drag vertical reordena (cambia `y` del subproceso arrastrado).
   - Snap a "misma altura que vecino" cuando el drag se acerca al `y` de otro fila → grupo paralelo.
   - "Romper paralelismo": acción para asignar `y` distinto a un subproceso de un grupo (ej: nudge ±10).
2. **Acción del store** `reordenarSubprocesoEnTimeline(opdId, aparienciaId, nuevaY)`:
   - Valida que la apariencia es de un subproceso del OPD.
   - Llama a `moverAparienciaPorId` con la nueva Y (mantiene X actual).
   - Entra al stack undo.
3. **OPL "en paralelo"**:
   - Verificar que `app/src/opl/generar.ts` agrupa subprocesos con misma `y` y emite "en paralelo".
   - Plantilla canónica (verificar SSOT): `*Padre* se descompone en *SubA* y *SubB* en paralelo, *SubC*, en esa secuencia.` o similar.
   - Si no está, agregar lógica mínima de agrupación.
4. **Layout `App.tsx`**: Timeline aparece a la derecha del Inspector o como pestaña secundaria. Diseño liviano, sin colisión con paneles existentes.

**Pendientes explícitos** (no entran):
- Reasignación manual de enlaces externos derivados (eso es otra línea, no esta).
- Split de `effect` en consumo+resultado.

## 7. Tests obligatorios

### Unit tests
- En `app/src/opl/generar.test.ts`:
  - `paralelismo: dos subprocesos misma y → "en paralelo"`.
  - `mezcla: tres subprocesos con dos en misma y, uno solo → agrupa correctamente`.
- En un nuevo `app/src/store.test.ts` (extender el existente):
  - `reordenarSubprocesoEnTimeline mueve y deja x intacto`.
  - `reordenarSubprocesoEnTimeline aplica al stack undo`.

### Smoke browser (Playwright)
- Si el harness lo permite: descomponer un proceso, ver Timeline, drag para reordenar, verificar que el orden visual y el OPL se actualizan.

## 8. Verificación

```bash
cd app
bun run check          # typecheck + unit tests OBLIGATORIO verde
bun run browser:smoke  # smoke browser
bun run dev            # validación visual del Timeline
```

## 9. Decisiones bloqueadas (no reabrir)

- Timeline es **vista** del modelo; SSOT sigue siendo `apariencia.y`. Razón: simplicidad y consistencia con la decisión arquitectural existente (HU-12.016).
- "Misma Y" significa **estrictamente igual**, no "dentro de un epsilon". Razón: el snap del drag se encarga de la igualdad explícita.
- Reordenar entra al stack undo como una sola operación (HU-SHARED-002).

## 10. Decisiones que tomás vos (documentar en commit)

- Posición del panel Timeline: lateral derecho debajo del Inspector, o inferior, o pestaña. Elegí lo que minimiza conflicto visual con el canvas y el panel OPL.
- Si Timeline aparece colapsable o siempre visible cuando aplica.
- Granularidad del nudge para romper paralelismo: 10px arbitrario es razonable (validar que no rompe layout existente).

## 11. Forma del entregable

- Commits:
  - `feat(ui): timeline editor para subprocesos en in-zoom`.
  - `feat(opl): plantilla "en paralelo" para subprocesos concurrentes` (si correspondiera).
  - `test(...)`: tests asociados.
- Co-author footer estándar.
- No tocar HU ni HANDOFF.
