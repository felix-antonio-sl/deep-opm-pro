# L2 — Modo enlace con estado canvas

## 1. Misión

Implementar un **modo enlace** que sea contrato visible en el canvas. Hoy el flujo `select origen → tipo enlace → select destino` funciona pero es invisible: no hay halo en el origen, no se resaltan destinos válidos, no se atenúan inválidos, no hay preview OPL antes de confirmar, y el drag source-target no produce link. El popover "Tipos válidos" promete preview pero su flujo se rompe al cambiar selección (P0-6 ya cerrado en Fase 0; L2 amplía a contrato visual).

**Slice mínimo entregable**:
1. Cuando hay tipo de enlace activo y origen seleccionado:
   - Halo de origen visible (color del tipo de enlace).
   - Destinos válidos resaltados con color suave.
   - Destinos inválidos atenuados con tooltip "no permitido para este enlace".
2. Drag source-target completa el enlace si el destino es válido.
3. Click-click sigue funcionando.
4. Preview OPL en MenuTipoEnlace antes de confirmar (ya parcialmente implementado en `MenuTipoEnlace.previewOpl`; ampliar a panel inline cerca del cursor).
5. Escape cancela modo enlace y limpia halos.

**Pendientes explícitos fuera de slice**:
- No implementar enlaces multi-select (operador → varios destinos en un click).
- No tocar la semántica de `validarFirmaEnlace`; se reusa.
- No cambiar el modelo de datos del enlace.

## 2. HU base

| HU | Path | Aporte |
|---|---|---|
| HU-10.001 | `docs/historias-usuario-v2/EPICA-10-enlaces-y-conectividad/HU-10-001-modo-enlace-canvas.md` (NUEVO) | Define modo enlace, halos, drag y previsualización |
| HU-10.002 | (idem epic) | Drag source-target |
| HU-20.001 | `docs/historias-usuario-v2/EPICA-20-canvas/HU-20-001-resaltado-validez-enlace.md` (NUEVO) | Highlight de destinos válidos/inválidos |

## 3. Anclaje a evidencia

- SSOT: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md` §"firmas de enlace válidas" + `opm-visual-es.md` §"feedback visual de creación".
- Corpus reusable:
  - `opm-extracted/INDEX.md` clases `LinkCreatorService`, `ValidatorThing`, `LinkValidatorService`.
  - `opm-extracted/src/main/.../link-creator.service.ts` — patrón canvas-state-machine de OPCloud (referencia, no copiar).
  - `assets/svg/links/` — markers canónicos por tipo de enlace.
  - `app/src/modelo/operaciones.ts` `validarFirmaEnlace()` — función de validez que se reusa.
  - `app/src/ui/MenuTipoEnlace.tsx` `previewOpl()` — ya genera oraciones OPL por par origen/destino.
- Estado actual: `app/src/render/jointjs/handlers/seleccion.ts`, `handlers/drag.ts`. El store tiene `modoEnlace: { tipo, origenId } | null`.

## 4. Archivos permitidos

```
app/src/canvas/modoEnlace.ts                                NUEVO (logica pura: filtrarDestinosValidos, calcularHaloOrigen)
app/src/canvas/modoEnlace.test.ts                           NUEVO
app/src/render/jointjs/handlers/modoEnlace.ts               NUEVO (cableado JointJS: halo, highlights, drag)
app/src/render/jointjs/JointCanvas.tsx                      EDIT aditivo
app/src/render/jointjs/composers/highlight.ts               EDIT aditivo (si aplica)
app/src/store/modelo/acciones-canvas.ts                     EDIT aditivo (acciones modoEnlace mejoradas)
app/src/ui/MenuTipoEnlace.tsx                               EDIT aditivo (preview OPL persistente)
app/src/ui/toolbar/ToolbarCreacion.tsx                      LECTURA (no romper)
app/e2e/06-creacion-enlaces.spec.ts (existente o NUEVO)     EDIT aditivo o NUEVO
docs/historias-usuario-v2/EPICA-10-enlaces-y-conectividad/HU-10-001-modo-enlace-canvas.md NUEVO
docs/historias-usuario-v2/EPICA-20-canvas/HU-20-001-resaltado-validez-enlace.md NUEVO
```

## 5. Restricciones de no-colisión

- **L1 reorganiza ToolbarCreacion** (cluster Conectar). L2 NO toca el JSX de ToolbarCreacion ni el menú principal; solo lee handlers.
- **No tocar `composers/enlace.ts`** salvo lectura. Esa es la lógica de proyección modelo→jointjs y debe permanecer estable.
- **Coordinar con L1** vía rebase: L1 cierra primero (lower risk), L2 rebasa.

## 6. Slice mínimo shippeable

### `canvas/modoEnlace.ts` (lógica pura testeable)

```ts
export interface DestinoEvaluado {
  apariencia: Apariencia;
  esValido: boolean;
  razonInvalidez?: string;
}

export function evaluarDestinos(
  modelo: Modelo,
  opdId: Id,
  origenId: Id,
  tipo: TipoEnlace,
): DestinoEvaluado[] {
  // Para cada apariencia del OPD, validarFirmaEnlace() y devolver evaluacion.
}

export function colorHaloPorTipo(tipo: TipoEnlace): string {
  // Mapeo a tokens.colors.canvas / tokens.colors.acentoUi.
}
```

### `render/jointjs/handlers/modoEnlace.ts`

```ts
export function cablearModoEnlace(opts: {
  paperRef: { current: dia.Paper | null };
  storeRef: () => OpmStore;
}): () => void {
  // Suscripcion al store: cuando modoEnlace activo:
  //   1. Aplicar halo al origenId (paper.findViewById(...).highlight()).
  //   2. Calcular destinos via evaluarDestinos().
  //   3. Aplicar opacity 0.4 a invalidos, ring color suave a validos.
  //   4. Habilitar drag source→target con mousedown en origen seleccionado.
  // Cuando modoEnlace null: limpiar todos los highlights.
}
```

### Acciones de store (aditivas)

```ts
// acciones-canvas.ts
crearEnlaceDragDesdeOrigen(destinoId: Id) {
  const { modoEnlace, modelo, opdActivoId } = get();
  if (!modoEnlace || !modoEnlace.origenId) return;
  const valid = validarFirmaEnlace(modoEnlace.tipo, modelo.entidades[modoEnlace.origenId], modelo.entidades[destinoId]);
  if (!valid.ok) {
    set({ mensaje: `Enlace no permitido: ${valid.error}` });
    return;
  }
  // Llama crearEnlaceEntreEntidades existente.
}
```

### MenuTipoEnlace inline preview persistente

Cuando el menú está abierto y hay 2 cosas seleccionadas, el preview OPL no debe desaparecer al hacer clicks dentro del canvas (ya cerrado en Fase 0 P0-6). L2 amplía: cuando el usuario flota el puntero sobre una opción de tipo, mostrar preview OPL en línea con highlight visual de la opción.

## 7. Tests obligatorios

- Unit (~15 tests nuevos):
  - `modoEnlace.ts`: `evaluarDestinos` para cada combinación de tipos canónicos (consumo, resultado, agente, instrumento, agregación, exhibición, generalización, clasificación, efecto, invocación) — al menos 1 test por tipo cubriendo 1 destino válido + 1 inválido.
  - `colorHaloPorTipo` retorna colores válidos del paleta.
- Smoke (~4 tests nuevos):
  - `modoEnlace: halo en origen visible y destinos validos resaltados`.
  - `modoEnlace: drag source→target crea enlace y limpia modo`.
  - `modoEnlace: Escape cancela modo y limpia halos`.
  - `modoEnlace: tipo enlace invalido para par muestra mensaje y NO crea`.

## 8. Verificación

```bash
cd app
bun run check
bun run lint
bun run browser:smoke
bun run build
```

Audit visual:
- Crear `Proceso → Resultado → Objeto` por click-click.
- Crear el mismo enlace por drag source→target.
- Verificar halo visible en origen, destinos válidos resaltados.
- Cumplir criterio de salida del informe UI/UX 2026-05-07 §P0-3 enlaces.

## 9. Decisiones bloqueadas (no reabrir)

- **`validarFirmaEnlace` es la única fuente de verdad de validez**. No reimplementar.
- **El modo enlace cancela cualquier seleccion previa**. Coherencia con state machine actual.
- **Halos vivos solo durante modo enlace**. No persisten al cancelar.

## 10. Decisiones que tomas vos (documentar en commit)

- Color exacto del halo origen (gradient vs solid, opacity).
- Si los destinos inválidos solo se atenúan o además llevan border rojo (recomendado: solo atenuar).
- Si el drag source→target acepta un click rápido como auto-target o requiere mouseup (recomendado: mouseup explícito).

## 11. Forma del entregable

- Commit 1: `feat(canvas): modo enlace con halo y destinos resaltados` — `modoEnlace.ts` + `handlers/modoEnlace.ts` + cableado en JointCanvas.
- Commit 2: `feat(store,canvas): drag source-target completa enlace` — acciones del store + handler drag.
- Commit 3: `test(e2e): modo enlace cubre click-click y drag con preview OPL`.
- Co-author footer estándar.
- No tocar HANDOFF.md ni HU otras epics.
