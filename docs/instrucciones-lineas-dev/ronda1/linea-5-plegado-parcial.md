# Línea 5 — Plegado parcial intra-rectángulo (vista compacta de refinables)

## 1. Misión

EPICA-18 define un modo intermedio entre vista plegada y completamente desplegada de una cosa refinable: el **plegado parcial** muestra las partes dentro del rectángulo padre **sin abrir un OPD nuevo**. Cambia sólo la vista del OPD actual; no altera el modelo ni el grafo de refinamiento. La operación inversa (`quitarDespliegueObjeto`) destruye; el plegado parcial **oculta sin destruir**, y permite extracción selectiva.

**Slice mínimo entregable**: campo nuevo `apariencia.modoPlegado: "completo" | "parcial"` (default `"completo"`); render del modo `"parcial"` como lista de partes apiladas verticalmente dentro del rectángulo padre; entrada de menú "Plegado parcial" en Inspector cuando la entidad tiene refinamiento; round-trip de JSON; bloqueo de la opción cuando la entidad no tiene partes.

**Pendientes explícitos** (no entran a este slice):
- Extracción de partes al canvas (HU-18.004).
- Reanclaje de enlaces al proxy (HU-18.009).
- Anidamiento de plegados parciales.

## 2. HU base (lectura obligatoria antes de codificar)

| HU | Path | Aporta |
|---|---|---|
| HU-18.001 | `docs/historias-usuario-v2/epicas/epica-18-canvas-plegado-parcial.md` (sección 18.001) | Activar plegado parcial desde menú |
| HU-18.002 | (mismo archivo, 18.002) | Render como lista vertical |
| HU-18.003 | (mismo archivo, 18.003) | Badge "tiene partes" cuando plegado completo |
| HU-18.011 | (mismo archivo, 18.011) | Persistir vista por OPD al guardar |
| HU-18.012 | (mismo archivo, 18.012) | Distinguir plegado parcial de descomposición clásica |
| HU-18.014 | (mismo archivo, 18.014) | Bloquear plegado parcial cuando la cosa no tiene refinadores |
| HU-18.015 (referencia) | (mismo archivo, 18.015) | Orden compacto de las partes (alfabético por defecto) |

## 3. Anclaje a evidencia

- **SSOT**: `opm-iso-19450-es.md` — `[Glos 3.81]` (despliegue), distinción descomposición vs despliegue.
- **OPCloud (lectura)**: `opm-extracted/_raw/` — buscar `semi-fold`, `partial fold`, `compact view`, `unfolding`. `rg "fold|unfold|semi" opm-extracted/`. La forma observable es típicamente una pila vertical de filas con el nombre de cada parte.
- **JOYAS**: `docs/JOYAS.md` — colores objeto/proceso, tipografía de etiquetas, contornos. La vista parcial usa el mismo color del padre, las filas internas usan tipografía igual a etiquetas pero más pequeña (~12px).
- **Estado actual**:
  - `app/src/modelo/tipos.ts:37-45` — interfaz `Apariencia`. Aquí va el nuevo campo opcional.
  - `app/src/serializacion/json.ts` — round-trip de Apariencia.
  - `app/src/render/jointjs/` — adaptador de render. Aquí se interpreta el nuevo campo.
  - `app/src/ui/Inspector.tsx` — donde se agrega el menú.

## 4. Archivos permitidos (scope estricto)

```
app/src/modelo/tipos.ts                      ← EDIT aditivo — campo apariencia.modoPlegado opcional
app/src/serializacion/json.ts                ← EDIT aditivo — round-trip del nuevo campo (default "completo" al deserializar si falta)
app/src/serializacion/json.test.ts           ← EDIT aditivo — test del round-trip
app/src/render/jointjs/                      ← EDIT aditivo — render del modo "parcial" (lista vertical interna)
app/src/ui/Inspector.tsx                     ← EDIT aditivo — entrada de menú "Plegado parcial / completo" cuando aplica
```

**Lectura permitida**:
- `app/src/modelo/operaciones.ts`: para conocer la API de las apariencias y el contrato de refinamiento.
- `app/src/store.ts`: si necesitás disparar acciones que cambien `apariencia.modoPlegado` (probable que necesites una nueva acción ahí o en `operaciones.ts` — **detenerse y consultar** antes de tocar el store/operaciones, ya que ese terreno es de L1).

**Prohibido**: tocar `app/src/modelo/operaciones.ts` (lectura sí, edición no), `app/src/ui/Toolbar.tsx`, `app/src/ui/PersistenciaJson.tsx`, `app/src/opl/*`, `app/src/persistencia/*`.

## 5. Restricciones de no-colisión

1. **`tipos.ts`**: agregar `modoPlegado?: "completo" | "parcial"` al final del tipo `Apariencia`. NO renombrar campos. L1 también extiende `tipos.ts` en otra región (TipoEnlace) — los cambios deben quedar disjuntos.
2. **JSON retro-compatible**: deserializar modelos sin `modoPlegado` debe asumir `"completo"`. Verificar en `json.test.ts` con un fixture viejo.
3. **Render**: cuando `modoPlegado === "parcial"`, el render dentro del rectángulo cambia. Cuando `"completo"` (default), comportamiento idéntico al actual. **No regresión visual** de modelos sin plegado parcial activado.
4. **Cambio de modo**: necesitás una acción para alternar `apariencia.modoPlegado`. **Decisión bloqueante**: si la acción se agrega al store o a `operaciones.ts`. Como **L1 toca operaciones.ts** y hay riesgo de conflicto, preferí **agregar la acción al store sin pasar por `operaciones.ts`** (mutación local de la apariencia, similar a `moverAparienciaPorId` que ya existe en operaciones.ts). Si necesitás extender `operaciones.ts`, **detenerse y consultar**.

   Alternativa preferida: agregar en `store.ts` una acción `cambiarModoPlegado(opdId, aparienciaId, modo)` que clona el modelo, muta esa apariencia y entra al stack undo. NO toca operaciones.ts.

   **Pero `store.ts` lo toca L4**. Si querés evitar también ese conflicto: el camino más limpio es agregar una **función pura** `cambiarModoPlegado` en un nuevo archivo `app/src/modelo/plegado.ts` (NUEVO), exportarla, y consumirla desde el store mediante un wrapper minimal. El nuevo archivo es disjunto y la edición de store puede hacerse al final con merge trivial.

   Elegir uno de los dos caminos y documentarlo.
5. **Inspector**: la entrada de menú nueva no debe pisar la entrada de "Desplegar como…" que L1 va a agregar. Resolución: convención "Plegado parcial / completo" como toggle separado del bloque de despliegue. Merge trivial.

## 6. Slice mínimo shippeable

1. **Modelo**: `Apariencia.modoPlegado?: "completo" | "parcial"` agregado a `tipos.ts`.
2. **Función `cambiarModoPlegado`** en `app/src/modelo/plegado.ts` (NUEVO) o en `store.ts` directamente (decisión arriba).
3. **Round-trip**: `json.ts` serializa el nuevo campo cuando está presente; `hidratarModelo` (en `persistencia/local.ts` — sólo lectura) acepta modelos sin el campo (asume `"completo"`).
4. **Render JointJS**:
   - Cuando `modoPlegado === "parcial"`:
     - El rectángulo padre se agranda automáticamente para acomodar la lista.
     - Lista vertical interna de partes (subprocesos para procesos refinados; partes para objetos desplegados con agregación). Cada fila: nombre + separador.
     - Orden alfabético por defecto.
     - El nombre del padre permanece en posición superior-centro interior (igual que en in-zoom; HU-12.009).
   - Cuando `modoPlegado === "completo"` (default): comportamiento actual sin cambios.
5. **Inspector**: cuando la entidad seleccionada tiene `entidad.refinamiento`, mostrar entrada "Plegado parcial" / "Plegado completo" (toggle según estado actual de la apariencia en el OPD activo). Si no tiene refinamiento, **no mostrar** la entrada (HU-18.014).
6. **Badge "tiene partes"** (HU-18.003): cuando `modoPlegado === "completo"` y la entidad tiene refinamiento, render un pequeño indicador "▾" o similar en una esquina del rectángulo. Click sobre el badge activa el modo `"parcial"` (atajo del menú).

## 7. Tests obligatorios

### Unit tests
- En `app/src/serializacion/json.test.ts`:
  - `round-trip preserva apariencia.modoPlegado === "parcial"`.
  - `hidratar modelo sin modoPlegado asume "completo"`.
- En `app/src/modelo/operaciones.test.ts` (lectura) o un nuevo `app/src/modelo/plegado.test.ts` si creaste el archivo:
  - `cambiarModoPlegado en apariencia con refinamiento → cambia el campo`.
  - `cambiarModoPlegado en apariencia sin refinamiento → error o no-op`.

### Smoke browser
- Activar plegado parcial desde Inspector sobre un proceso descompuesto → la vista cambia → el subárbol no se altera → guardar y recargar → modo persiste.

## 8. Verificación

```bash
cd app
bun run check          # typecheck + unit tests OBLIGATORIO verde
bun run browser:smoke  # smoke browser
bun run dev            # validación visual: render parcial vs completo
```

## 9. Decisiones bloqueadas (no reabrir)

- Plegado parcial es **estado de visualización** sobre `Apariencia`, NO un nuevo tipo de refinamiento. Razón: HU-18.012 explícitamente lo distingue de descomposición/despliegue.
- Default `"completo"`. Razón: retro-compatibilidad de JSON.
- HU-18.004 (extracción) NO entra a este slice. HU-18.009 (reanclaje de enlaces) tampoco. HU-18.005 (contador) tampoco. Esos vienen después.

## 10. Decisiones que tomás vos (documentar en commit)

- Lugar de `cambiarModoPlegado`: nuevo archivo `modelo/plegado.ts` o directamente en `store.ts`. Documentar elección y razón.
- Layout exacto de la lista vertical interna: tipografía 12px, separador 1px gris claro, padding 4-6px por fila. Si JOYAS sugiere algo distinto, seguir JOYAS.
- Posición del badge "tiene partes": esquina superior derecha del rectángulo, similar a la marca 📄 propuesta en HU-17.004 (no la implementes, sólo respetá la convención de esquina).

## 11. Forma del entregable

- Commits:
  - `feat(modelo): plegado parcial como estado de Apariencia`.
  - `feat(render): vista compacta intra-rectangulo`.
  - `feat(ui): entrada de plegado parcial en Inspector`.
  - `test(...)`.
- Co-author footer estándar.
- No tocar HU ni HANDOFF.
