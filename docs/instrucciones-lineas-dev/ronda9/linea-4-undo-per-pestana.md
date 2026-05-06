# Línea 4 — Undo per-pestaña

## 1. Misión

Cerrar la **deuda funcional declarada desde ronda 7**: actualmente `undoStack`, `redoStack` y `snapshotGuardado` son singletons globales en `app/src/store/runtime.ts`, compartidos entre todas las pestañas. El campo `historialUndo: HistorialEntrada[]` ya existe en cada `Pestana` (definido en `tipos.ts`) pero no se usa para historial vivo — solo se sincroniza en `sincronizarPestanaActivaEnLista` y `activarEstadoPestanas` para snapshotting.

L4 cablea `commitModelo` para empujar al `historialUndo` de la pestaña activa, y reescribe `deshacerRuntime`/`rehacerRuntime` para operar sobre el historial de la pestaña activa. Al cambiar de pestaña, `puedeDeshacer`/`puedeRehacer` reflejan la pestaña activa. Al hacer commit en pestaña B no se contamina el historial de pestaña A.

Es un cambio de **wiring interno**: la API pública (`commitModelo`, `deshacer`, `rehacer`, `puedeDeshacer`, `puedeRehacer`) mantiene firmas; cambia dónde vive el estado del historial. **No es refactor de archivos** — no hay barrel nuevo. Es deuda funcional con blast cognitivo alto.

**Slice mínimo entregable**:

Modificaciones a 3 archivos existentes:

- `app/src/store/runtime.ts` (614 LOC actuales): refactor interno de `commitModelo`, `deshacerRuntime`, `rehacerRuntime` para operar sobre `historialUndo` de la pestaña activa en lugar de `undoStack`/`redoStack` globales. Agregar helper `historialDePestanaActiva(state): HistorialEntrada[]` y `cursorDePestanaActiva(state): number`. Mantener firmas públicas. Documentar el cambio con comentario JSDoc del módulo.
- `app/src/store/modelo.ts` (1622 LOC actuales): el slice de modelo invoca `commitModelo` y `deshacerRuntime`/`rehacerRuntime` desde el runtime. Si `commitModelo` cambió internamente, el slice de modelo no necesita cambios — solo verificar que `puedeDeshacer`/`puedeRehacer` se computen desde `historialUndo` de pestaña activa. Posible cambio mínimo en `set({ puedeDeshacer, puedeRehacer })` si el cómputo cambia.
- `app/src/store/pestanas.ts` (249 LOC actuales): al cambiar `pestanaActivaId`, sincronizar el `redoStack` de la pestaña entrante (que actualmente vive en `redoStack` global). Ya hay `historialUndo` en cada pestaña; agregar `historialRedo: HistorialEntrada[]` y `cursorRedo` a la `Pestana` (cambio aditivo en `tipos.ts` — esto sí afecta L5, pero solo aditivamente).

Si `tipos.ts` debe extenderse con `Pestana.historialRedo`, **L4 lo hace en su scope** (excepción autorizada): la extensión es aditiva, opcional (`historialRedo?:`), y no rompe la serialización porque `historialUndo`/`historialRedo` son sesión-only (no se persisten en JSON OPM).

**Alternativa**: en lugar de agregar `historialRedo` a la pestaña, mantener `redoStack` global pero **clearearlo al cambiar de pestaña** (semántica: el redo es válido solo dentro de la sesión continua de una pestaña). Esto es más simple y se alinea con la decisión de ronda 7 ("undo per-pestaña queda como deuda explícita; cada pestaña sí posee modelo independiente"). El brief deja al implementador elegir entre las dos alternativas (declarar en commit).

**Tests aditivos**:

- `app/src/store/runtime.test.ts` (NUEVO o ampliar si existe): cubrir undo per-pestaña con tests focalizados.
- `app/src/store/pestanas.test.ts` (existente, 79 LOC): agregar 3-5 tests de undo cross-pestaña.

**Smoke aditivo**:

- `app/e2e/opm-smoke.spec.ts`: 1 smoke nuevo que verifica undo per-pestaña visualmente (crear pestaña B, hacer cambio, deshacer, cambiar a pestaña A, verificar que el cambio en B no afectó historial de A, volver a B, verificar que rehacer recupera el cambio).

**Fuera de slice**:

- **No tocar `tipos.ts`** salvo extensión aditiva opcional de `Pestana` (declarar en commit). Si la solución es mantener `redoStack` global con clear en cambio de pestaña, no se toca tipos.
- **No tocar `serializacion/json.ts`**: el JSON OPM no incluye historial. La extensión de `Pestana` es sesión-only, no se serializa.
- **No tocar otros slices del store** (`seleccion.ts`, `enlaces.ts`, `workspaceMod.ts`, `carpetas.ts`, `uiPanel.ts`, `mapa.ts`, `persistencia.ts`). Estos invocan `commitModelo` con la misma firma; el cambio es transparente.
- **No reabrir contratos vigentes**: undo limit (100), `commitModelo(set, modeloPrevio, modeloNuevo, extra?)` firma, `deshacer()` retorna void.
- **No tocar UI** que muestra `puedeDeshacer`/`puedeRehacer` (`Toolbar.tsx`, atajos): los selectores siguen funcionando porque las flags se mantienen en el state Zustand.

## 2. Deudas que cierra

| Deuda | Path absoluto | Aporte |
|---|---|---|
| Stack undo global compartido entre pestañas (deuda heredada ronda 7) | `/home/felix/projects/deep-opm-pro/docs/HANDOFF.md §Pendientes Inmediatos` | Cierra el ítem; cada pestaña mantiene historial independiente. |
| HU-34.* (multi-pestaña): comportamiento undo cross-pestaña corrupto | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-34-multi-pestana.md` (si existe; verificar) | Funcionalidad observable: usuario puede hacer undo en pestaña A sin afectar B. |
| Test smoke faltante de undo cross-pestaña | `app/e2e/opm-smoke.spec.ts` | Cobertura de regresión. |

## 3. Anclaje a evidencia

- **SSOT**: no hay SSOT directa para undo (es decisión de UX). Citas implícitas:
  - `docs/HANDOFF.md §Decisiones Vigentes` — "Multi-pestaña sesión-only: pestañas no se persisten ... commitModelo empuja al stack global compartido entre pestañas — undo per-pestaña queda como deuda explícita de bajo blast radius."
- **Corpus interno reusable**:
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/modules/app/context.service.ts:5-130` — `ContextService` orquesta el contexto activo (modelo, save, permisos) con su propia historia. Inspiración: cada contexto activo tiene su historial.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/modules/app/tabsService.ts:5-130` — `TabsManager` con `dropTab`, `replaceContextByTab`, `closeTab`, `refreshTab`. En 130 LOC manejaba pestañas. Confirma que el blast es bajo.
  - `/home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda7/linea-3-multi-pestana-bloques-opl.md` (si existe) — brief original de multi-pestaña ronda 7. Lectura obligatoria.
- **Estado actual del código (post-ronda 8)**:
  - `app/src/store/runtime.ts` (614 LOC): `undoStack`, `redoStack`, `snapshotGuardado` como variables module-level. `commitModelo(set, previo, siguiente, extra?)` línea 256, `deshacerRuntime(set, get)` línea 580, `rehacerRuntime(set, get)` línea 598. UNDO_LIMIT=100.
  - `app/src/store/tipos.ts` (531 LOC): tipo `Pestana` con `historialUndo: HistorialEntrada[]`, `cursorUndo: number`. NO tiene `historialRedo` ni `cursorRedo`.
  - `app/src/store/modelo.ts` línea 819-825: `deshacer()` y `rehacer()` invocan `deshacerRuntime`/`rehacerRuntime` directamente.
  - `app/src/store/pestanas.ts` línea 117-118: pestanaInicial tiene `historialUndo: [], cursorUndo: 0`.
  - `app/src/store/runtime.ts` línea 86-87: `activarEstadoPestanas` hace `undoStack = [...pestana.historialUndo]; redoStack = [];` — ya transfiere el historial al cambiar pestaña, pero el redo se pierde.
  - **Detalle clave**: `redoStack = []` en línea 87 implica que **el redo ya se pierde al cambiar de pestaña** en la implementación actual. Esto es semántica aceptable (redo solo dentro de sesión continua de pestaña). L4 puede preservar esa decisión y solo necesita garantizar que `undoStack` se actualice con cada commit hacia el `historialUndo` de la pestaña activa.

## 4. Archivos permitidos

```text
app/src/store/runtime.ts                       EDIT — refactor interno commitModelo, deshacerRuntime, rehacerRuntime
app/src/store/runtime.test.ts                  NUEVO o EDIT (ampliar tests undo per-pestaña)
app/src/store/modelo.ts                        EDIT mínimo (verificar puedeDeshacer/puedeRehacer cómputo)
app/src/store/pestanas.ts                      EDIT mínimo (sincronizar historialUndo en cambio de pestaña; ya lo hace pero verificar)
app/src/store/pestanas.test.ts                 EDIT (agregar tests undo cross-pestaña)
app/src/store/tipos.ts                         EDIT aditivo opcional (Pestana.historialRedo? si se elige Alt B)
app/e2e/opm-smoke.spec.ts                      EDIT aditivo (smoke undo cross-pestaña)
opm-extracted/**                               LECTURA
docs/HANDOFF.md                                LECTURA (no editar)
docs/historias-usuario-v2/**                   LECTURA (no editar)
```

## 5. Restricciones de no-colisión

- **No tocar otros slices del store**: `seleccion.ts`, `enlaces.ts`, `workspaceMod.ts`, `carpetas.ts`, `uiPanel.ts`, `mapa.ts`, `persistencia.ts`. Estos invocan `commitModelo` con la firma actual; el cambio interno del runtime es transparente.
- **No tocar `tipos.ts` global** (`modelo/tipos.ts`, territorio L5).
- **No tocar `serializacion/json.ts`**: el historial es sesión-only.
- **No tocar UI**.
- **No introducir librería de undo** (immer, redux-undo, etc.). El stack actual de snapshots de Modelo es suficiente.
- **Preservar firmas públicas**:
  - `commitModelo(set, previo, siguiente, extra?)` — sin cambio.
  - `deshacerRuntime(set, get)`, `rehacerRuntime(set, get)` — sin cambio.
  - `puedeDeshacer: boolean`, `puedeRehacer: boolean` en `OpmStore` — sin cambio.
  - `Pestana.historialUndo: HistorialEntrada[]`, `cursorUndo: number` — sin cambio.
- **Preservar UNDO_LIMIT=100** y semántica de slice.
- **Smokes existentes pasan sin tocar**.

## 6. Slice mínimo shippeable

### 6.1 Capa runtime (refactor interno)

```ts
// app/src/store/runtime.ts (líneas 256+ aprox)
/**
 * Empuja el modelo previo al historialUndo de la pestaña activa.
 * El redoStack global se limpia (semántica: redo solo dentro de sesión continua).
 * Ronda 9 L4: undo per-pestaña.
 */
export function commitModelo(
  set: SetStore,
  previo: Modelo,
  siguiente: Modelo,
  extra: Partial<OpmStore> = {},
): void {
  const state = obtenerEstadoStore();
  const pestanaActiva = state.pestanasAbiertas.find((p) => p.id === state.pestanaActivaId);
  if (!pestanaActiva) {
    // fallback: comportamiento previo
    undoStack = [...undoStack, previo].slice(-UNDO_LIMIT);
    redoStack = [];
  } else {
    // empujar al historialUndo de la pestaña activa
    const historialNuevo = [...pestanaActiva.historialUndo, previo].slice(-UNDO_LIMIT);
    // sincronizar en la lista de pestañas
    const pestanasNuevas = state.pestanasAbiertas.map((p) =>
      p.id === pestanaActiva.id ? { ...p, historialUndo: historialNuevo, cursorUndo: historialNuevo.length } : p
    );
    set({ pestanasAbiertas: pestanasNuevas, /* ... */ });
    redoStack = []; // limpiar redo al hacer commit
  }
  set({
    modelo: siguiente,
    dirty: true,
    puedeDeshacer: true,
    puedeRehacer: false,
    ...extra,
  });
}

export function deshacerRuntime(set: SetStore, get: GetStore): void {
  const state = get();
  const pestanaActiva = state.pestanasAbiertas.find((p) => p.id === state.pestanaActivaId);
  if (!pestanaActiva || pestanaActiva.historialUndo.length === 0) return;

  const previo = pestanaActiva.historialUndo[pestanaActiva.historialUndo.length - 1]!;
  const historialNuevo = pestanaActiva.historialUndo.slice(0, -1);
  redoStack = [state.modelo, ...redoStack].slice(0, UNDO_LIMIT);
  const pestanasNuevas = state.pestanasAbiertas.map((p) =>
    p.id === pestanaActiva.id ? { ...p, historialUndo: historialNuevo, cursorUndo: historialNuevo.length } : p
  );
  set({
    modelo: previo,
    pestanasAbiertas: pestanasNuevas,
    puedeDeshacer: historialNuevo.length > 0,
    puedeRehacer: true,
    dirty: exportarModelo(previo) !== snapshotGuardado,
  });
}

export function rehacerRuntime(set: SetStore, get: GetStore): void {
  const state = get();
  const siguiente = redoStack.shift();
  if (!siguiente) return;
  const pestanaActiva = state.pestanasAbiertas.find((p) => p.id === state.pestanaActivaId);
  if (!pestanaActiva) return;

  const historialNuevo = [...pestanaActiva.historialUndo, state.modelo].slice(-UNDO_LIMIT);
  const pestanasNuevas = state.pestanasAbiertas.map((p) =>
    p.id === pestanaActiva.id ? { ...p, historialUndo: historialNuevo, cursorUndo: historialNuevo.length } : p
  );
  set({
    modelo: siguiente,
    pestanasAbiertas: pestanasNuevas,
    puedeDeshacer: true,
    puedeRehacer: redoStack.length > 0,
    dirty: exportarModelo(siguiente) !== snapshotGuardado,
  });
}
```

(Pseudocódigo simplificado; el actual maneja más extras y es más cuidadoso. Adapta a la implementación real.)

### 6.2 Sincronización en cambio de pestaña

`activarEstadoPestanas` (runtime.ts línea 82) ya hace:

```ts
undoStack = [...pestana.historialUndo];  // ← se elimina; ahora vive en la pestaña
redoStack = [];                           // ← se mantiene; redo es local a sesión continua
```

Tras el refactor, `undoStack` global puede eliminarse (o quedar como cache de la pestaña activa para no recomputar). Decisión del implementador.

### 6.3 Eliminación opcional de `undoStack` global

Si se decide eliminar `undoStack` global completamente:
- `puedeDeshacer` se computa desde `pestanaActiva.historialUndo.length > 0` en cada `set`.
- `puedeRehacer` se computa desde `redoStack.length > 0` (redo sigue global o se mueve a pestaña según alternativa A o B).

Si se mantiene `undoStack` global como cache (alt rápida):
- Cada `commitModelo` actualiza ambos: `pestanaActiva.historialUndo` y `undoStack` global.
- `activarEstadoPestanas` carga `undoStack = [...pestana.historialUndo]`.

Ambas son válidas. La primera es más limpia categorialmente (single source of truth); la segunda es más conservadora.

## 7. Tests obligatorios

- **Suites existentes intactas**: 558 tests / 2357 expects verde sin reescribir.
- **Smokes existentes intactos**: 40/40 verde.
- **Tests aditivos (obligatorios)**:
  - `runtime.test.ts` (NUEVO o ampliar): 
    - `commitModelo empuja al historialUndo de la pestaña activa`
    - `deshacerRuntime opera sobre historialUndo de pestaña activa, no global`
    - `rehacerRuntime opera sobre redoStack (clearado en cambio de pestaña)`
    - `cambiarPestanaActiva no contamina historialUndo de pestaña entrante con commits de pestaña saliente`
    - ~5 tests / ~20 expects.
  - `pestanas.test.ts` (ampliar):
    - `undo en pestaña B no afecta historialUndo de pestaña A`
    - `cambiar de A a B y deshacer recupera estado previo de B, no de A`
    - `crear pestaña nueva tiene historialUndo vacío`
    - ~3 tests / ~10 expects.
- **Smoke aditivo (obligatorio)**:
  - `opm-smoke.spec.ts`: 1 smoke "undo per-pestaña preserva historiales independientes". Crea modelo en pestaña 1, abre pestaña 2, crea modelo distinto, verifica que pestaña 2 puede deshacer su propio cambio sin afectar pestaña 1, cambia a pestaña 1 y verifica que el historial es independiente.
- **Total esperado**: ~8 tests / ~30 expects + 1 smoke.

## 8. Verificación

```bash
cd app
bun run typecheck
bun run test src/store/
bun run test src/                          # suite completa
bun run check                              # typecheck + tests
bun run browser:smoke                      # 40/40 + nuevo smoke = 41/41
```

**No requiere `bun run build`** (no afecta bundle).

Detector: L4 puede agregar 1 regla nueva en `progress-dashboard.mjs` que evidencie `historialUndo` per-pestaña en `runtime.ts` + smoke. L_scaffolding puede dejar el placeholder y L_consolidación recalibra.

**Verificación manual (recomendada)** en `bun run dev`:
1. Crear modelo en pestaña 1 (objeto A).
2. Abrir pestaña 2.
3. Crear modelo en pestaña 2 (objeto B distinto).
4. Click "Deshacer" → modelo de pestaña 2 vuelve atrás.
5. Cambiar a pestaña 1 → modelo de pestaña 1 intacto, "Deshacer" deshace creación de A.
6. Cambiar a pestaña 2 → modelo intermedio, "Rehacer" recupera B (si redo no se limpió en cambio de pestaña; alt B).

## 9. Decisiones bloqueadas (no reabrir)

- **Multi-pestaña sesión-only**: pestañas no se persisten en JSON OPM. `historialUndo` tampoco se persiste (es sesión-only por diseño).
- **`UNDO_LIMIT=100`**: sin cambio.
- **Firmas públicas**: `commitModelo`, `deshacerRuntime`, `rehacerRuntime`, `puedeDeshacer`, `puedeRehacer` — todas idénticas.
- **Snapshot de pestaña**: `Pestana.snapshotJson` y `Pestana.historialUndo` son sesión-only (decisión ronda 7).
- **Redo limpia al commit**: clearear `redoStack` cuando se hace commit es semántica universal de undo/redo. No se reabre.
- **No introducir libs de undo**: continúa el patrón de snapshots de Modelo.

## 10. Decisiones que tomas vos (documentar en commit)

- **Alternativa A (recomendada): mantener `redoStack` global, clearearlo al cambiar de pestaña** (semántica simple: redo solo dentro de sesión continua de la pestaña activa). 0 cambios en `tipos.ts`. Documentar en commit: "redo es sesión-continua de pestaña, se pierde al cambiar".
- **Alternativa B: agregar `Pestana.historialRedo: HistorialEntrada[]` y `cursorRedo: number`** (cambio aditivo en `tipos.ts`, redo persiste por pestaña). Más feature-completo pero toca tipos. Si se elige, es la única excepción autorizada para tocar `tipos.ts` en L4.
- **Mantener o no `undoStack` global como cache**: si se mantiene, es cache redundante de `pestanaActiva.historialUndo`; si se elimina, cualquier consulta de undo va vía la pestaña activa. Más limpio eliminar; más conservador mantener. Documentar.
- **Tests aditivos**: del rango 5-10, decidir granularidad. Mínimo 5 cubriendo cross-pestaña.
- **Smoke aditivo**: ¿el smoke usa multi-pestaña real o lo simula? Real es preferido.
- **Si emerge un bug oculto** (ej. cambio de pestaña con undo en curso, race condition): declarar como observación; bugs cross-line se entregan como patch a `/tmp/` no commiteados.

## 11. Forma del entregable

Commit sugerido (puede ser uno o dos):

```
1. refactor(store): undo per-pestaña

   - commitModelo empuja al historialUndo de la pestaña activa
   - deshacerRuntime/rehacerRuntime operan sobre pestaña activa
   - cambiar de pestaña no contamina historiales
   - Alternativa elegida: <A o B>
   - Tests aditivos: 5-10 / 30 expects
   - Smoke nuevo: undo cross-pestaña independiente
   - Firmas públicas preservadas (commitModelo, deshacer, rehacer, puedeDeshacer, puedeRehacer)

   Refs: docs/HANDOFF.md §Pendientes Inmediatos (deuda heredada ronda 7),
         opm-extracted/src/app/modules/app/context.service.ts:5-130

   Co-Authored-By: <implementador-externo> <noreply@...>
```

**Reporte de cierre obligatorio**:

- Hash final del último commit en main.
- Output de `bun run check` (último tail).
- Output de `bun run browser:smoke` (41/41 esperado con smoke nuevo).
- Lista de tests aditivos creados + conteo.
- Alternativa elegida (A: redoStack global con clear / B: historialRedo en Pestana).
- Si se eliminó `undoStack` global o se mantuvo como cache.
- Decisiones declaradas (de §10).
- Confirmación de archivos no tocados: otros slices del store, `serializacion/*`, `tipos.ts` si Alt A, UI.

**Qué NO tocar**:

- `docs/HANDOFF.md`, `docs/historias-usuario-v2/`, `docs/JOYAS.md`, `docs/instrucciones-lineas-dev/ronda1..8/`.
- `app/src/modelo/*`, `app/src/serializacion/*`, `app/src/opl/*`, `app/src/render/*`, `app/src/canvas/*`, `app/src/persistencia/*`, `app/src/ui/*`.
- Otros slices del store: `seleccion.ts`, `enlaces.ts`, `workspaceMod.ts`, `carpetas.ts`, `uiPanel.ts`, `mapa.ts`, `persistencia.ts`.
- `app/scripts/in-vivo-test.mjs`, `app/src/render/jointjs/customShapes.ts`, `home/`.
