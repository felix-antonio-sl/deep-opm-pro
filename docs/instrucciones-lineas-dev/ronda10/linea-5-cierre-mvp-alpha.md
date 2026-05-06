# Línea 5 — Cierre transversal MVP-α + OPL polish

## 1. Misión

Cerrar parciales pequeños y polish transversal para mover MVP-α de 46.3% a ~52-55%. Heterogénea pero todas las HU son **bajo blast**:

- **HU-SHARED-006 — diálogo Guardar/Descartar/Cancelar al cerrar dirty**: actualmente confirmación existe globalmente; falta el flujo específico al cerrar pestaña/navegar con cambios pendientes.
- **HU-SHARED-002 — smokes undo por operación**: ronda 9 cerró el wiring; faltan smokes específicos por operación (eliminar, renombrar, mover, esencia, vertices).
- **HU-50.013 — verbalizar despliegue asíncrono "ocurren"** (parcial → cubierto).
- **HU-50.015 — verbalizar especialización "es un/una"** (parcial → cubierto).
- **HU-50.018 — filtrar OPL por selección activa** (parcial → cubierto, ya cableado en ronda 6; verificar y agregar smoke).
- **HU-50.023 — copiar OPL al portapapeles** (parcial: la acción ya existe en `acciones-canvas.ts`; falta botón UI).
- **HU-50.024 — exportar OPL a archivo HTML** (parcial: la acción ya existe; falta botón UI).
- **HU-50.025 — buscar texto en panel OPL** (pendiente; acción `fijarBusquedaOpl` ya existe; falta input UI + filtrado).
- **HU-12.013 — cláusula "en esa secuencia" OPL** (parcial → cubierto).
- **HU-13.015 — split de efecto** (parcial; verificar con smoke completo).
- **HU-18.013 — extraer todas las partes de plegado** (1 pendiente).

Slice mínimo: extender UI con botones + input búsqueda + diálogo cierre dirty + smokes aditivos. Aditivos puros sin tocar kernel.

**Fuera de slice**:
- HU-50.019/.020/.022 edición OPL→canvas con parser inverso: peso alto, difiere.
- Refactor de `ConfirmacionContext.tsx` o `Dialogo.tsx`: solo aditivos.

## 2. Deudas que cierra

| HU | Estado actual | Aporte L5 |
|---|---|---|
| HU-SHARED-006 — diálogo cerrar dirty | parcial | `DialogoConfirmacion.tsx` aditivo: modo "guardar-descartar-cancelar" con 3 botones. `ConfirmacionContext.tsx` aditivo: `solicitarConfirmacionAlCerrar(callback)`. |
| HU-SHARED-002 — smokes undo por operación | parcial | 5 smokes aditivos en `opm-smoke.spec.ts`: undo eliminar / renombrar / mover / cambiar esencia / editar vertices. |
| HU-50.013 — "ocurren" despliegue async | parcial | Verificar `oracionDespliegueOcurren` en `opl/generadores/refinamiento.ts`. Si emerge gap, refinar. |
| HU-50.015 — "es un/una" especialización | parcial | Verificar `oracionEspecializacion`. Si emerge gap, refinar. |
| HU-50.018 — filtrar OPL por selección | parcial | `fijarFiltroOplPorSeleccion` ya cableado. Verificar smoke + UI toggle visible. |
| HU-50.023 — copiar OPL al portapapeles | parcial | `Toolbar.tsx` o `PanelOpl.tsx` aditivo: botón "📋 Copiar". `copiarOplActualAlPortapapeles` ya existe. |
| HU-50.024 — exportar OPL HTML | parcial | Idem: botón "💾 Exportar HTML". `exportarOplActualHtml` ya existe. |
| HU-50.025 — buscar texto en panel OPL | pendiente | `PanelOpl.tsx` aditivo: input búsqueda + filtrado de líneas en `Bloques.tsx`. `fijarBusquedaOpl` ya existe. |
| HU-12.013 — "en esa secuencia" OPL | parcial | Verificar emisión en `oracionRefinamiento`. Smoke. |
| HU-13.015 — split de efecto | parcial | Smoke end-to-end (HU ya implementada en ronda 2). |
| HU-18.013 — extraer todas las partes plegado | pendiente | `extraerTodasLasPartes(modelo, opdId, padreAparienciaId): Resultado<Modelo>` + acción store + botón "Extraer todas" en Inspector. |

## 3. Anclaje a evidencia

- **SSOT**:
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-opl-es.md` D5..D8: oraciones canónicas. L5 verifica que los emisores existentes cubren los casos.
- **Corpus interno reusable**:
  - HU-SHARED docs en `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-006-dirty-state.md`.
  - HU-SHARED-002 en `HU-SHARED-002-undo-redo.md`.
- **Estado actual del código (post-9.5)**:
  - `app/src/store/modelo/acciones-canvas.ts`: ya tiene `copiarOplActualAlPortapapeles`, `exportarOplActualHtml`, `fijarBusquedaOpl`, `fijarFiltroOplPorSeleccion`, `fijarHoverOpl`. **L5 los expone via UI** (botones + input).
  - `app/src/ui/PanelOpl.tsx` (168 LOC) y `app/src/ui/panelOpl/Bloques.tsx`: estructura existente. **L5 agrega input búsqueda y botones**.
  - `app/src/ui/DialogoConfirmacion.tsx`: existe. **L5 lo extiende con modo "guardar-descartar-cancelar"** o agrega un componente nuevo similar.
  - `app/src/ui/ConfirmacionContext.tsx`: existe. **L5 agrega `solicitarConfirmacionAlCerrar`** o extiende `confirmarSiDirty`.
  - `app/src/modelo/plegado.ts`: tiene `extraerParteDePlegado`. **L5 agrega `extraerTodasLasPartesDePlegado`** (loop sobre las partes restantes).

## 4. Archivos permitidos

```text
app/src/modelo/plegado.ts                            EDIT extiende (extraerTodasLasPartesDePlegado)
app/src/modelo/plegado.test.ts                       EDIT aditivo
app/src/store/modelo/acciones-canvas.ts              EDIT extiende (extraerTodasLasPartesSeleccionadas, buscarEnPanelOpl)
app/src/store/modelo/acciones-ui.ts                  EDIT extiende (solicitarConfirmacionAlCerrar)
app/src/store/tipos.ts                               EDIT aditivo
app/src/ui/PanelOpl.tsx                              EDIT aditivo (input búsqueda + botones copiar/exportar)
app/src/ui/panelOpl/Bloques.tsx                      EDIT aditivo (filtrar líneas por substring de búsqueda)
app/src/ui/InspectorEntidad.tsx                      EDIT aditivo opcional (botón "Extraer todas las partes" cuando entidad tiene partes plegadas)
app/src/ui/inspector/SeccionRefinamiento.tsx         EDIT aditivo opcional (botón extraer todas si aplica)
app/src/ui/DialogoConfirmacion.tsx                   EDIT aditivo (modo "guardar-descartar-cancelar")
app/src/ui/ConfirmacionContext.tsx                   EDIT aditivo (solicitarConfirmacionAlCerrar callback)
app/e2e/opm-smoke.spec.ts                            EDIT aditivo (~7 smokes nuevos)
app/src/opl/generadores/refinamiento.ts              EDIT aditivo opcional (refinar si HU-50.013/.015 lo requiere)
app/src/opl/generadores/refinamiento.test.ts         EDIT aditivo opcional
opm-extracted/**                                     LECTURA
docs/HANDOFF.md                                      LECTURA (no editar)
docs/historias-usuario-v2/**                         LECTURA (no editar)
```

## 5. Restricciones de no-colisión

- **No tocar `tipos/*`** salvo aditivo en `acciones-ui` que requiera tipo nuevo.
- **No tocar `operaciones/*`** salvo `plegado.ts` (extiende).
- **No tocar `composers/*`** ni `handlers/*`.
- **No tocar `Toolbar.tsx`**: L1/L4 ya lo modifican; L5 agrega botones en `PanelOpl.tsx` (su propio panel) en lugar de Toolbar para evitar choque.
- **`acciones-canvas.ts`**: L1 extiende con grid/alinear. L5 extiende con `extraerTodasLasPartes`/`buscarEnPanelOpl`. Métodos disjuntos al final del objeto.
- **`acciones-ui.ts`**: L4 agrega modal imagen. L5 agrega `solicitarConfirmacionAlCerrar`. Métodos disjuntos.
- **`opm-smoke.spec.ts`**: L5 agrega ~7 smokes al final.

## 6. Slice mínimo shippeable

### 6.1 Capa modelo

```ts
// app/src/modelo/plegado.ts (extiende)
export function extraerTodasLasPartesDePlegado(
  modelo: Modelo,
  opdId: Id,
  padreAparienciaId: Id,
): Resultado<Modelo> {
  // Loop sobre cada parte plegada del padre, llamar extraerParteDePlegado.
  // Acumular en un solo modelo final.
}
```

### 6.2 Capa store

```ts
// app/src/store/modelo/acciones-canvas.ts (extiende)
extraerTodasLasPartesSeleccionadas() {
  const { modelo, opdActivoId, seleccionId } = get();
  // resolver apariencia padre y delegar a extraerTodasLasPartesDePlegado
}

buscarEnPanelOpl(texto: string) {
  // Wrapper de fijarBusquedaOpl (ya existe). Trivial.
}

// app/src/store/modelo/acciones-ui.ts (extiende)
solicitarConfirmacionAlCerrar(callback: () => void) {
  // Si state.dirty: abre DialogoConfirmacion en modo "guardar-descartar-cancelar".
  // Botón "Guardar" → guardarComoLocal + callback.
  // Botón "Descartar" → callback (sin guardar).
  // Botón "Cancelar" → cierra dialogo (no callback).
  // Si !dirty: callback() directo.
}
```

### 6.3 Capa UI

```tsx
// app/src/ui/DialogoConfirmacion.tsx (aditivo)
// Modo "guardar-descartar-cancelar":
// - 3 botones en lugar de 2 (Sí/No estándar).
// - Texto: "Hay cambios sin guardar. ¿Qué quieres hacer?"
// - data-testid="dialogo-confirmacion-cerrar-dirty"
```

```tsx
// app/src/ui/PanelOpl.tsx (aditivo)
// Header del panel agrega:
// - Input <input data-testid="panel-opl-buscar" placeholder="Buscar..." onInput={(e) => store.buscarEnPanelOpl(e.target.value)} />
// - Botón [📋 Copiar] → store.copiarOplActualAlPortapapeles()
// - Botón [💾 HTML] → store.exportarOplActualHtml()
```

```tsx
// app/src/ui/panelOpl/Bloques.tsx (aditivo)
// Lee state.busquedaOpl. Si no vacío: filtrar líneas que contienen el substring (case-insensitive).
// data-testid="opl-line" preserva.
```

```tsx
// app/src/ui/InspectorEntidad.tsx o SeccionRefinamiento.tsx (aditivo opcional)
// Si entidad tiene apariencia con partes plegadas (modoPlegado="parcial" + partes ocultas):
//   Botón "Extraer todas las partes" → store.extraerTodasLasPartesSeleccionadas()
```

## 7. Tests obligatorios

- **Tests existentes intactos**.
- **Tests aditivos** (~5 tests / ~15 expects):
  - `plegado.test.ts`: extraerTodasLasPartesDePlegado extrae loops correctamente.
- **Smokes aditivos** (~7 smokes):
  - `test("undo elimina entidad y restaura modelo previo")` (HU-SHARED-002)
  - `test("undo renombra entidad y restaura nombre previo")`
  - `test("undo mueve apariencia y restaura posicion")`
  - `test("undo cambia esencia y restaura previa")`
  - `test("undo edita vertices y restaura previos")`
  - `test("dialogo cerrar con cambios dirty muestra Guardar/Descartar/Cancelar")` (HU-SHARED-006)
  - `test("buscar texto en panel OPL filtra lineas")` (HU-50.025)
  - `test("copiar OPL al portapapeles desde boton")` (HU-50.023)
  - `test("exportar OPL HTML descarga archivo")` (HU-50.024)
  - `test("extraer todas las partes plegadas en un solo undo")` (HU-18.013)

## 8. Verificación

```bash
cd app
bun run typecheck
bun run test src/modelo/plegado.test.ts
bun run check
bun run browser:smoke   # 47+/47+ esperado con +7 smokes
bun run build
```

## 9. Decisiones bloqueadas (no reabrir)

- **`copiarOplActualAlPortapapeles`, `exportarOplActualHtml`, `fijarBusquedaOpl`** ya existen en el store (ronda 7-8). NO se duplican.
- **`fijarFiltroOplPorSeleccion`** ya cableado. NO se reabre.
- **HU-50.019/.020/.022 edición OPL→canvas** difieren (requieren parser inverso).
- **`Dialogo.tsx`** captura Escape (decisión ronda 7): NO se reabre.
- **`atajosTeclado.ts`** registry global (ronda 7): NO se reabre. Si emerge atajo nuevo (ej. Ctrl+F en panel OPL), se registra ahí.

## 10. Decisiones que tomas vos (documentar en commit)

- **Atajo Ctrl+F en panel OPL** para focus al input búsqueda: registrar en `atajosTeclado` con `ctx="panel-opl"` o no registrarlo y dejar input visible. Recomendado: registrar (UX mejor).
- **Persistir `busquedaOpl` entre sesiones**: NO (es transitorio, similar a hover).
- **Ubicación exacta de los botones [Copiar] [HTML] [Buscar]**: header del panel OPL, en orden lógico. Smokes deben usar `data-testid` específicos.
- **`DialogoConfirmacion` con 3 botones**: agregar prop `modo: "si-no" | "guardar-descartar-cancelar"` o crear componente separado `DialogoCerrarDirty.tsx`. Recomendado: prop al existente para reuso.
- **Si emergen smokes flaky**: documentar; reintento normalmente verde.

## 11. Forma del entregable

```
1. feat(ui): cierre transversal MVP-alpha + OPL polish

   Cierra ~12 HU dispersas (HU-SHARED-002 smokes, HU-SHARED-006 dialogo, HU-12.013,
   HU-13.015, HU-18.013, HU-50.013/.015/.018/.023/.024/.025).
   MVP-alpha pasa de 46.3% a ~52-55%.

   - plegado.ts extiende: extraerTodasLasPartesDePlegado
   - acciones-canvas.ts extiende: extraerTodasLasPartesSeleccionadas, buscarEnPanelOpl
   - acciones-ui.ts extiende: solicitarConfirmacionAlCerrar
   - DialogoConfirmacion.tsx aditivo: modo "guardar-descartar-cancelar"
   - ConfirmacionContext.tsx aditivo
   - PanelOpl.tsx aditivo: input busqueda + botones copiar/exportar
   - panelOpl/Bloques.tsx aditivo: filtrar lineas por busqueda
   - inspector aditivo: boton extraer todas
   - 5 tests + ~7 smokes nuevos

   Refs: docs/instrucciones-lineas-dev/ronda10/linea-5-cierre-mvp-alpha.md,
         HU-SHARED-002, HU-SHARED-006, HU-50.* polish.

   Co-Authored-By: <implementador> <noreply@...>
```

**Reporte de cierre**:
- Hash + LOC nuevos.
- Output check / smoke / build.
- Confirmación: kernel intacto; OPL emisores no modificados (verificación opcional si se refinan).

**Qué NO tocar**: territorios L1/L2/L3/L4 (operaciones/*, tipos/*, composers/*, handlers/*), Toolbar.tsx, HANDOFF, historias-usuario-v2, JOYAS, customShapes.ts, in-vivo-test.mjs, home/.
