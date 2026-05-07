# Línea 1 — Cierre MVP-α (residuales pendientes + parciales + smoke 854 + ejemplo organizacional)

## 1. Misión

Cosechar las **14 HU residuales MVP-α** post-ronda-11 para llevar la cobertura de **91.1% → ≥98% ponderado**:

- **4 pendientes**: HU-10.004 descripción cosa, HU-11.001 modo sticky verificación visual, HU-11.007 multi-al-todo gesto único, HU-30.036 redirigir Guardar→Guardar Como en read-only.
- **10 parciales**: HU-SHARED-002 (undo granular comandos ronda 11), HU-SHARED-007 (eco OPL multi-al-todo), HU-10.003 (modal nombre), HU-10.021 (descomposición objeto inzoom), HU-11.012 (enlace estructural etiquetado), HU-30.008 (payload OPM íntegro), HU-30.019/.020 (cargar doble clic / clic+botón), HU-30.021 (Cargar Ejemplo Organizacional con JSON canónico), HU-30.037 (cancelar Esc/Cancelar).
- **Smoke 854 stabilization**: el smoke `confirma cambios sin guardar antes de crear un modelo nuevo` es flaky desde ronda 9 — estabilizar wait condition o reescribir el assertion para que no dependa de timing.

Slice mínimo entregable: feature **cosecha de cierre** sin nuevos módulos grandes (excepto JSON ejemplo organizacional). La mayoría de cambios son aditivos pequeños sobre archivos ya estables: `inspector/SeccionDescripcion.tsx`, `acciones-canvas.ts`, `acciones-ui.ts`, `Toolbar.tsx`, `Dialogo.tsx`, `DialogoCargarModelo.tsx`, `persistencia/local.ts`, `e2e/opm-smoke.spec.ts`. Reuso obligatorio de `assets/svg/lock.svg` (HU-30.036) y `assets/svg/example.svg` (HU-30.021).

**Fuera de slice**:
- No tocar kernel ni serializador (territorio L2).
- No tocar `canvas/operacionesBatch.ts` salvo verificación atomicidad multi-al-todo (no nuevos exports).
- No tocar dominio de plantillas (territorio L4).
- No tocar dominio de traer conectados (territorio L3).

## 2. Deudas que cierra

| HU | Estado actual | Aporte L1 |
|---|---|---|
| HU-10.004 — Editar descripción opcional cosas | pendiente | Verificar wiring de `inspector/SeccionDescripcion.tsx` para entidades tipo `objeto`/`proceso` (no solo estados). Si ya está, agregar regla detector con paths exactos. Si falta, exponer el campo `Entidad.descripcion` en la sección con `data-testid="seccion-descripcion-cosa"`. |
| HU-11.001 — Modo sticky verificación visual | pendiente | Indicador visible cuando modo barra creación sticky está activo (token UI ya en `OpmStore`). Botón Toolbar muestra estado pressed/active y un hint textual. `data-testid="indicador-modo-sticky"`. No reabre la decisión "modo barra creación sticky" (vigente desde ronda anterior). |
| HU-11.007 — Multi-al-todo gesto único | pendiente | Acción `conectarSeleccionAlTodo(todoApariencia, tipo)` **ya existe** en `app/src/store/seleccion.ts:305` (expuesta en API pública `store/tipos.ts:429`). Falta wiring UI: atajo `Ctrl+Alt+T` en `atajosTeclado.ts` invoca acción existente; ítem en `MenuContextualEnlace.tsx` (o sub-menú con tipoEnlace) hace lo mismo. **No se crean nuevas acciones**. |
| HU-30.036 — Redirigir Guardar→Guardar Como en read-only | pendiente | En `app/src/store/persistencia.ts:259` (donde vive `guardarLocal`): insertar check `if (get().readOnly)` al inicio del body; si true, dispara `get().guardarComoLocal({...})` con mensaje "Modelo en solo lectura — guardando como copia nueva" + reuso de `assets/svg/lock.svg` para indicador. Resto del body intacto. **Slice raíz; no acciones-ui.ts**. |
| HU-SHARED-002 — Undo granular comandos ronda 11 | parcial → cubierto | Tests aditivos en `app/src/store.test.ts` o `app/src/store/modelo/acciones-canvas.test.ts` cubriendo undo atómico de cada comando ronda 11: `reanclarExtremoEnlaceSeleccionado`, `aplicarEstiloEnlacesBatch`, `eliminarEnlacesBatch`, `copiarEstiloEnlaceAlPortapapeles`, BibliotecaCosa drag-drop, `conectarMultiAlTodo`. Cada uno entra como una operación atómica (un único push en `undoStack`). |
| HU-SHARED-007 — Eco OPL multi-al-todo | parcial → cubierto | Smoke + unit que verifican: tras `conectarMultiAlTodo` con N partes, panel OPL emite N oraciones de agregación canónicas (no una sola oración collapsada, no N+1 con duplicados). |
| HU-10.003 — Modal nombre tras crear | parcial → cubierto | Smoke estabilizado para `data-testid="modal-nombre-cosa"` en flujo crear cosa con click + drag. Verificar autofocus + Enter confirma + Esc cancela. |
| HU-10.021 — Descomposición objeto inzoom | parcial → cubierto | Smoke explícito: crear objeto, click derecho → Descomponer / Inzoom, verificar que se crea OPD hijo con apariencia interna y árbol refleja jerarquía. Patrón existente para procesos; verificar que el path UI funciona idéntico para objetos. |
| HU-11.012 — Enlace estructural etiquetado | parcial → cubierto | Smoke + unit cubriendo etiqueta para enlaces de exhibición/generalización/clasificación. Verificar que `RenombradoInline` admite enlace y persiste en `Enlace.etiqueta`. |
| HU-30.008 — Payload OPM íntegro | parcial → cubierto | Test de roundtrip JSON que crea modelo con todos los campos opcionales rellenos (gridConfig en runtime — NO en JSON; imagen, descripcion, alias, unidad, urls, refinamiento, layoutEstados, abanicos, modificadores, plegado parcial, modelo.descripcion) y verifica `exportarModelo(importarModelo(serializado)).valor === serializado` lossless. |
| HU-30.019 — Cargar doble clic | parcial → cubierto | Smoke explícito: en `DialogoCargarModelo`, doble clic sobre tile carga el modelo + cierra diálogo. Reusar el mismo handler que clic+botón Cargar. |
| HU-30.020 — Cargar clic+botón | parcial → cubierto | Smoke análogo: clic sobre tile selecciona, botón Cargar carga + cierra diálogo. |
| HU-30.021 — Cargar Ejemplo Organizacional | parcial → cubierto | JSON canónico nuevo en `app/examples/ejemplo-organizacional.json` (modelo OPM válido pequeño-mediano: ~10 OPDs, ~20 entidades, ~30 enlaces, descripción, varios refinamientos). Botón "Cargar Ejemplo" en `DialogoCargarModelo` o `MenuPrincipal` con icono `assets/svg/example.svg`. Acción `cargarEjemploOrganizacional` en `acciones-ui.ts` que hace `fetch('/examples/ejemplo-organizacional.json')` o import estático y dispara `importarDesdeJson`. |
| HU-30.037 — Cancelar modal Esc/Cancelar | parcial → cubierto | Auditar cada `Dialogo*.tsx` que faltó cobertura ronda 11; verificar que `Dialogo.tsx` wrapper captura Esc y dispara `onCancelar`. Smokes específicos para `DialogoVersiones`, `DialogoArchivados`, `DialogoBuscarGlobal`, `DialogoMoverPuerto`, `DialogoBuscarCosas` cancelando con Esc sin commit. |
| **Smoke 854 stabilization** | flaky | Reescribir el smoke `confirma cambios sin guardar antes de crear un modelo nuevo` con `await expect(page.getByRole(...)).toBeVisible({ timeout: 5000 })` antes del click crítico, o `page.waitForFunction(() => store.dirty === true)`. Eliminar timing implícito. |

**Total esperado**: 14 HU residuales cerradas + smoke 854 estabilizado.

## 3. Anclaje a evidencia

**Nivel 1 — SSOT (citas obligatorias en cada archivo modificado, RF-2 remediation)**:

- `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/metodologia-opm-es.md`:
  - §read-only: modelos en read-only son artefactos publicados; cualquier cambio requiere copia editable. **Cita obligatoria HU-30.036**: `[Met §read-only]`.
  - §6 etapas SD: persistencia íntegra del payload. **Cita obligatoria HU-30.008/.019/.020/.021/.037**: `[Met §6]`.
- `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md`:
  - §3.55 Object, §3.69 Process: cosas tienen descripción opcional persistida. **Cita obligatoria HU-10.004**: `[Glos 3.55]` o `[Glos 3.69]`.
  - §3.* Link signature: enlaces estructurales etiquetados. **Cita obligatoria HU-11.012**: `[Glos 3.x]` correspondiente.
- `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-opl-es.md`:
  - §multi-al-todo: oraciones de agregación. **Cita obligatoria HU-11.007/HU-SHARED-007**: `[OPL-ES …]` correspondiente.
- `docs/historias-usuario-v2/00-METODOLOGIA.md §6`: jerarquía SSOT.
- `docs/auditorias/2026-05-07-ssot-opm-extracted.md §RF-2`: motivación y alcance de las citas SSOT obligatorias en EPICA-30.

**Nivel 2 — `app/src/modelo/tipos.ts`**: cualquier cambio en HU-30.008 (payload íntegro) verifica coherencia con todos los campos opcionales declarados en `tipos/{modelo,entidad,enlace,opd,apariencia,abanico,estado,opl,pestana,ui}.ts`.

**Nivel 3 — respaldo técnico (citas opcionales)**:

- **JOYAS** (`docs/JOYAS.md`): paleta canónica para indicadores (HU-11.001 modo sticky usa cyan `#3BC3FF` si modo proceso; verde lima `#70E483` si modo objeto). HU-30.036 indicador candado usa `#586D8C` (gris azulado) sobre fondo claro.
- **Assets canónicos** (`assets/svg/`, política PROVENANCE obliga reuso): `lock.svg` para HU-30.036 indicador candado read-only; `example.svg` para HU-30.021 botón "Cargar Ejemplo Organizacional"; `unfold.svg`/`inzoom.svg` ya existen para HU-10.021 (no recrear).
- **opm-extracted/ verificado** (paths con `ls`/`grep`; citas opcionales en headers):
  - `opm-extracted/src/app/dialogs/save-as-dialog/` (consolidado en ronda 11 L2): el patrón "redirect en read-only" no tiene path explícito; deducido por simetría con read-only flag (L5 ronda 11). Implementación propia del repo.
  - `opm-extracted/src/app/dialogs/existing-name-dialog/existing-name-dialog.component.ts`: patrón "manejar nombre existente" útil para HU-30.037 cobertura modal cancelable.

**Estado actual del código (post-ronda-11)**:
  - `app/src/canvas/operacionesBatch.ts:106` — `conectarMultiAlTodo` operación kernel existe.
  - `app/src/store/seleccion.ts:305` — acción pública `conectarSeleccionAlTodo(todoApariencia, tipo)` ya cablea kernel + commit. **L1 agrega solo wiring UI sobre acción existente; NO modifica este archivo**.
  - `app/src/store/persistencia.ts:259` — `guardarLocal()` vive aquí. **L1 modifica el body** insertando check `readOnly` al inicio (HU-30.036). Slice raíz autorizado en §4.
  - `app/src/store/modelo/acciones-ui.ts:87,153` — `guardarComoLocal`/`guardarComoLocalConDescripcion` existen como destinos del redirect. **L1 NO modifica esto** para HU-30.036.
  - `app/src/store/runtime.ts` — `readOnly` flag ya existe (ronda 11 L5).
  - `app/src/store/tipos.ts:429,445` — `conectarSeleccionAlTodo` y `guardarLocal` ya en API pública.
  - `app/src/ui/Toolbar.tsx` — ya tiene `data-testid="modal-nombre-cosa"`; agregar `data-testid="indicador-modo-sticky"`.
  - `app/src/ui/Dialogo.tsx` — wrapper con captura Esc ya existe; HU-30.037 verifica cobertura completa por smokes.
  - `app/src/ui/inspector/SeccionDescripcion.tsx` — verificar si admite cosas (objetos/procesos) o solo estados.

## 4. Archivos permitidos

```text
app/src/ui/inspector/SeccionDescripcion.tsx        EDIT extiende (HU-10.004 wiring cosas si falta) o LECTURA (si ya cubre)
app/src/ui/InspectorEntidad.tsx                    LECTURA (verificar montaje SeccionDescripcion)
app/src/ui/Toolbar.tsx                             EDIT aditivo (HU-11.001 indicador modo sticky con data-testid; HU-30.036 candado read-only adicional al ya existente)
app/src/ui/MenuContextualEnlace.tsx                EDIT aditivo (ítem "Conectar multi al todo" con tipoEnlace HU-11.007 invoca acción ya existente conectarSeleccionAlTodo)
app/src/ui/MenuContextualArbol.tsx                 LECTURA
app/src/ui/atajosTeclado.ts                        EDIT aditivo (Ctrl+Alt+T cablea acción existente conectarSeleccionAlTodo HU-11.007)
app/src/ui/Dialogo.tsx                             EDIT aditivo (HU-30.037 cobertura captura Esc, si falta) o LECTURA
app/src/ui/DialogoCargarModelo.tsx                 EDIT aditivo (HU-30.019 doble clic + HU-30.020 clic+botón verificación + HU-30.021 botón Cargar Ejemplo)
app/src/store/persistencia.ts                      EDIT extiende (HU-30.036 intercepción en guardarLocal con check readOnly; ver §5 nota arquitectónica)
app/src/store/persistencia.test.ts                 EDIT aditivo (test redirect read-only)
app/src/store/modelo/acciones-canvas.ts            EDIT aditivo (solo si emerge necesidad de wrapper; preferir cablear conectarSeleccionAlTodo desde UI directamente)
app/src/store/modelo/acciones-entidad.ts           EDIT extiende (HU-10.004 `editarDescripcionEntidad` si falta)
app/src/store/modelo/acciones-ui.ts                EDIT extiende (HU-30.021 `cargarEjemploOrganizacional`; NO HU-30.036 — vive en store/persistencia.ts)
app/src/store/tipos.ts                             EDIT aditivo (acciones nuevas necesarias en OpmStore)
app/src/persistencia/local.ts                      EDIT aditivo (HU-30.008 verificación payload íntegro; tests roundtrip)
app/src/persistencia/local.test.ts                 EDIT aditivo (test roundtrip todos los campos opcionales)
app/src/canvas/operacionesBatch.ts                 LECTURA (no nuevos exports; verificar atomicidad)
app/src/canvas/operacionesBatch.test.ts            EDIT aditivo (tests atomicidad HU-SHARED-002 comandos ronda 11)
app/src/store.test.ts                              EDIT aditivo (smokes undo granular ronda 11)
app/src/store/seleccion.ts                         LECTURA — NO EDIT (acción conectarSeleccionAlTodo ya existe en línea 305; HU-11.007 cierra cableando atajo)
app/examples/ejemplo-organizacional.json           NUEVO (HU-30.021 JSON canónico)
app/e2e/opm-smoke.spec.ts                          EDIT aditivo (smokes residuales L1 + smoke 854 stabilization)
opm-extracted/**                                   LECTURA
docs/HANDOFF.md                                    LECTURA
docs/historias-usuario-v2/**                       LECTURA
docs/JOYAS.md                                      LECTURA
assets/svg/**                                      LECTURA
```

Cualquier otro archivo es **fuera de scope**.

### Nota arquitectónica sobre slices raíz vs sub-slices (corrección a brief original)

El brief original asumió que `guardarLocal` vivía en `store/modelo/acciones-ui.ts` y que HU-11.007 requeriría una nueva acción `conectarMultiAlTodoSeleccion` en `store/modelo/acciones-canvas.ts`. **Verificación post-asignación reveló**:

1. **`guardarLocal()` efectivo vive en `app/src/store/persistencia.ts:259`** (slice raíz `createPersistenciaSlice`). Los slices Zustand se componen, no se interceptan; el body de la función está allí. **HU-30.036 (redirigir Guardar→Guardar Como en read-only) requiere modificar este archivo**. Autorización CONCEDIDA con scope mínimo: insertar check `if (get().readOnly)` al inicio del body, redirigir a `get().guardarComoLocal({...})` con mensaje canónico, preservar el resto del body intacto. ~10-15 LOC añadidas.

2. **`conectarSeleccionAlTodo(todoApariencia, tipo)` ya existe** en `app/src/store/seleccion.ts:305` y está expuesta como API pública en `app/src/store/tipos.ts:429`. **HU-11.007 (multi-al-todo gesto único) cierra cableando atajo `Ctrl+Alt+T` y/o ítem en `MenuContextualEnlace.tsx`** que invocan la acción existente. **NO se modifica `store/seleccion.ts`**. Esto preserva blast y respeta scope.

Justificación arquitectónica: zustand compone slices con spread; cada slice raíz puede definir las acciones públicas finales. La estructura `store/modelo/*` es para sub-acciones específicas del modelo OPM (creación, OPDs, entidades), mientras `store/persistencia.ts`, `store/seleccion.ts`, `store/pestanas.ts`, etc. cubren responsabilidades transversales. Para HU que tocan responsabilidades transversales (persistencia, selección), el cambio efectivo va al slice raíz correspondiente.

## 5. Restricciones de no-colisión

- **No tocar `modelo/tipos/entidad.ts` ni `modelo/tipos/opl.ts`** (territorio L2: `valorSlot?` aditivo).
- **No tocar `opl/generadores/exhibicion.ts`** (territorio L2: oración `Atributo es valor [Unidad].`).
- **No tocar `canvas/operacionesBatch.ts` salvo verificación** (territorio L3: 3 batchs nuevos; territorio L4: insertarPlantilla).
- **No tocar `ui/MenuContextualEntidad.tsx`** (territorio L3: nuevo archivo).
- **No tocar `ui/DialogoTraerConectados.tsx`** (territorio L3: nuevo archivo).
- **No tocar `ui/DialogoPlantillas.tsx` ni `ui/DialogoGuardarPlantilla.tsx`** (territorio L4: nuevos archivos).
- **No tocar `persistencia/plantillas.ts` ni `persistencia/workspace.ts` con `PlantillaIndice`** (territorio L4).
- **No tocar `ui/MenuPrincipal.tsx` para Plantillas...** (territorio L4).
- **No tocar `progress-dashboard.mjs`** (territorio L5).
- **`store/seleccion.ts` y `store/persistencia.ts` (slices raíz)**: **L1 modifica solo el body de `guardarLocal()` en `store/persistencia.ts`** (autorización §4 nota arquitectónica). **No modifica `store/seleccion.ts`** (acción `conectarSeleccionAlTodo` ya existe). L2/L3/L4 no tocan estos slices raíz: si L4 necesita acciones plantillas que muten store, debe crear `store/plantillas.ts` separado. Si L3 necesita extender selección, primero pausa y reporta.
- **`Toolbar.tsx`**: L1 agrega indicador modo sticky + reforzar candado; L2 agrega botón crear atributo numérico; L3 agrega botón traer conectados; L4 agrega botón plantillas. Hunks disjuntos por sección JSX. **Coordinación**: L1 al final del orden de merge para que sus indicadores coexistan con todos los botones nuevos.
- **`acciones-canvas.ts`**: L1 (aditivo solo si emerge necesidad de wrapper, normalmente vacío), L3 (3 acciones traer), L4 (insertar plantilla). Hunks disjuntos.
- **`acciones-ui.ts`**: L1 (HU-30.021 cargar ejemplo; HU-30.036 ya NO va aquí, va en store/persistencia.ts), L3 (abrir diálogo traer), L4 (2 acciones plantillas). Hunks disjuntos por línea.
- **`acciones-entidad.ts`**: L1 (HU-10.004 si falta), L2 (asignarValor). Hunks disjuntos.

## 6. Comportamiento esperado

- **HU-10.004**: en Inspector de cosa (objeto/proceso), `SeccionDescripcion` permite editar `Entidad.descripcion` con textarea multi-línea. Cambio se persiste en kernel + roundtrip JSON. Indicador 📄 sobre apariencia ya existe (ronda 7).
- **HU-11.001 modo sticky visualización**: cuando el modo barra creación sticky está activo, el botón cosa correspondiente en Toolbar tiene estado visual `aria-pressed="true"` + clase CSS `boton-toolbar-activo`. `data-testid="indicador-modo-sticky"` permite smoke. No cambia comportamiento, solo afordancia.
- **HU-11.007**: con multi-selección de ≥2 apariencias y un todo (último seleccionado o ítem explícito), atajo `Ctrl+Alt+T` o menú contextual sobre selección dispara `conectarMultiAlTodoSeleccion(tipoEnlace)`. Por defecto `tipoEnlace = "agregacion-participacion"`. Sub-menú permite elegir otro tipo válido. Operación es **atómica para undo** (un solo push undoStack).
- **HU-30.036**:
  - Atajo `Ctrl+S` o botón "Guardar" en MenuPrincipal/Toolbar.
  - Si `OpmStore.readOnly === true`, se intercepta y redirige a `guardarComoLocal` con mensaje "Modelo en solo lectura — guardando como copia nueva". Confirmación implícita (no dispara segundo modal a menos que faltase nombre).
  - Indicador candado adicional junto al botón Guardar usando `assets/svg/lock.svg`.
- **HU-30.019**: en `DialogoCargarModelo`, doble clic sobre tile invoca el mismo handler que botón Cargar (cargar + cerrar).
- **HU-30.020**: clic sobre tile selecciona; botón Cargar carga + cierra.
- **HU-30.021**: botón "Cargar Ejemplo" en `DialogoCargarModelo` (header) con icono `example.svg`. Click dispara `cargarEjemploOrganizacional` que hidrata el JSON estático y abre el modelo en pestaña nueva. Modelo queda dirty (importación, ronda 9 decisión vigente).
- **HU-30.037**: en cualquier `Dialogo*.tsx`, presionar Esc cierra sin commit y preserva estado anterior. Botón "Cancelar" (cuando exista) tiene mismo efecto. Verificar para todos los diálogos modal del repo.

## 7. Pruebas requeridas

**Unit tests**:

- `acciones-entidad.test.ts` (si existe) o nuevo: HU-10.004 `editarDescripcionEntidad` aplica cambio + commit + roundtrip.
- `acciones-canvas.test.ts` o `store.test.ts`: HU-11.007 `conectarMultiAlTodoSeleccion` crea N enlaces atómicos en un solo undo entry.
- `acciones-ui.test.ts` o `store.test.ts`: HU-30.036 `guardarLocal` con `readOnly === true` redirige a `guardarComoLocal`.
- `persistencia/local.test.ts`: HU-30.008 roundtrip lossless con todos los campos opcionales.
- `operacionesBatch.test.ts`: HU-SHARED-002 cada comando ronda 11 emite un solo undo entry atómico.

**Smoke browser** (`app/e2e/opm-smoke.spec.ts`), ~6 nuevos:

- "HU-11.007: multi-selecciono partes + todo y Ctrl+Alt+T crea N enlaces de agregación atómicos" (multi-al-todo gesto único + undo atómico).
- "HU-30.036: en read-only, Ctrl+S redirige a Guardar Como con mensaje" (read-only redirect).
- "HU-30.019: doble clic sobre tile carga modelo y cierra diálogo".
- "HU-30.020: clic sobre tile + botón Cargar carga modelo".
- "HU-30.021: botón Cargar Ejemplo carga modelo organizacional con N OPDs y M entidades".
- "HU-30.037: Esc cancela DialogoVersiones sin persistir cambios".
- **Reescritura smoke 854** sin timing implícito.

**Detector**: L1 declara las reglas siguientes para consolidación L5 (~4 reglas):

- HU-11.007: `app/src/ui/atajosTeclado.ts` (string `Ctrl+Alt+T` con referencia a `conectarSeleccionAlTodo`) + `app/src/ui/MenuContextualEnlace.tsx` (ítem multi-al-todo).
- HU-30.036: `app/src/store/persistencia.ts` (string `readOnly` cerca de `guardarComoLocal` en body de `guardarLocal`).
- HU-30.021: existencia `app/examples/ejemplo-organizacional.json` + `app/src/store/modelo/acciones-ui.ts` string `cargarEjemploOrganizacional`.
- HU-11.001/HU-10.004/HU-30.037: regla agrupada `Toolbar.tsx` `data-testid="indicador-modo-sticky"` + `Dialogo.tsx` captura Esc.

## 8. Métricas esperadas

- **Tests aditivos**: ~10 unit + 6 smokes nuevos.
- **HU cerradas L1 directas**: 14 (4 pendientes + 10 parciales).
- **Reglas detector que esta línea aporta** (a registrar en consolidación L5): ~4 reglas nuevas + correcciones a reglas existentes si hay drift.
- **Build**: cero impacto significativo (cambios pequeños). Bundle no debería crecer.
- **Smoke browser**: 72 → ~78.

## 9. Loop verde y commits

```bash
cd app
bun run check          # 624 → ~634 unit
bun run browser:smoke  # 72 → 78 (smoke 854 estabilizado)
bun run build          # main chunk objetivo < 185 KB / < 50 KB gzip (sin crecimiento)
```

Commits sugeridos (orden):

1. `feat(inspector): SeccionDescripcion cubre cosas (HU-10.004)` (si falta wiring)
2. `feat(toolbar): indicador modo sticky con data-testid (HU-11.001)`
3. `feat(ui): atajo Ctrl+Alt+T cablea conectarSeleccionAlTodo existente (HU-11.007)` (ítem MenuContextualEnlace + atajosTeclado.ts; sin nuevas acciones)
4. `feat(store): redirigir Guardar→Guardar Como en read-only (HU-30.036)` (intervención puntual en body de guardarLocal en store/persistencia.ts)
5. `feat(persistencia): cargar ejemplo organizacional canónico (HU-30.021)` + `app/examples/ejemplo-organizacional.json`
6. `test(persistencia): roundtrip lossless con todos los campos (HU-30.008)`
7. `test(store): undo granular comandos ronda 11 (HU-SHARED-002)`
8. `test(e2e): smokes residuales MVP-α + smoke 854 stabilization`

Cada commit debe dejar la rama verde. Co-author si aplica.

## 10. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| **HU-10.004 ya cubierto pero sin regla detector**: la SeccionDescripcion existe y maneja entidades; el detector no tenía evidencia explícita. | Auditar primero el código actual; si ya cubre, solo agregar regla detector con paths verificados. No modificar comportamiento. |
| **HU-11.007 wiring rompe atomicidad existente**: si la acción dispara N `commitModelo`, undo no es atómico. | `conectarMultiAlTodoSeleccion` debe envolver `conectarMultiAlTodo` (kernel) en **un solo `commitModelo`** con mensaje "Conectar multi al todo: N enlaces". Test verifica un solo entry en undo. |
| **HU-30.036 redirect rompe flujo Guardar normal**: si la intercepción es en `guardarLocal`, todos los flujos Guardar pasan por el check. | Check explícito `if (get().readOnly)` al inicio del body en `app/src/store/persistencia.ts:259`. Ningún cambio de comportamiento si `readOnly === false`; solo redirige cuando `readOnly === true`. |
| **Slice raíz `store/persistencia.ts` autorizado pero scope mínimo**: tentación de refactor en el archivo. | Brief §4 nota arquitectónica autoriza solo intervención puntual en body de `guardarLocal()` (~10-15 LOC). Cualquier refactor adicional se reporta y pausa. |
| **HU-30.021 ejemplo organizacional grande puede romper bundle**: si el JSON se importa estáticamente, suma al chunk principal. | Cargar via `fetch('/examples/ejemplo-organizacional.json')` o dynamic import. Mantener bundle bajo control. JSON realista pero no excesivo (≤30 KB raw). |
| **HU-30.037 cancelar Esc en diálogos legados**: algunos diálogos pueden tener su propio handler que ignora Esc. | Auditar cada `Dialogo*.tsx` con grep `keyDown\|escape`. Si tienen captura propia que no cierra, ajustar para llamar `onCancelar` consistente. |
| **Smoke 854 stabilization rompe asserts existentes**: si reescribo el wait con condición distinta, otros smokes pueden depender. | Reescritura mínima sobre el smoke específico; otros smokes intactos. |
| **HU-11.012 etiqueta enlace estructural**: `RenombradoInline` posiblemente no admite enlaces. | Auditar primero; si solo cubre entidades, agregar wrapper para enlaces sin tocar el componente core. Patrón aditivo. |
| **HU-30.008 roundtrip puede exponer drift en serializador**: si un campo opcional no se serializa, el test falla. | El test es la verificación; si falla, identificar el campo y corregir el serializador (aditivo). No cambiar el contrato. |
| **RF-2: HU EPICA-30 sin citas SSOT en headers**: auditoría 2026-05-07 detectó violación `00-METODOLOGIA.md §6` para EPICA-30. | Cada archivo modificado en L1 que cierra HU EPICA-30 debe agregar cita SSOT al header (`[Met §6]` o `[Met §read-only]` según aplique). Verificación cruzada: tras L1 cerrado, grep `[Met §` en archivos persistencia debe retornar matches. Aplica a `acciones-ui.ts`, `persistencia/local.ts`, `DialogoCargarModelo.tsx`, `Dialogo.tsx`. |

## 11. Salida esperada

Al cierre de L1, el operador debe poder:

- Editar descripción de cualquier cosa (objeto/proceso) desde el inspector y verla persistida.
- Ver claramente cuando el modo barra creación sticky está activo.
- Conectar N partes a un todo con un solo gesto + undo atómico.
- Guardar un modelo read-only y recibir copia editable automáticamente con mensaje claro.
- Cargar modelo recientes con doble clic.
- Cargar el "Ejemplo Organizacional" canónico con un click.
- Cancelar cualquier modal con Esc sin persistir cambios.
- Ver smoke 854 verde sin retry.

**MVP-α esperado post-L1+L5**: 91.1% → **≥98% ponderado** (cierre de 14 HU residuales con evidencia detectable). Cero pendientes en MVP-α salvo HU explícitamente diferidas que se documentan en HANDOFF.

**Remediación auditoría 2026-05-07** alcanzada en L1: RF-2 (citas SSOT EPICA-30) cerrada parcialmente — las HU EPICA-30 cubiertas por L1 (HU-30.008/.019/.020/.021/.036/.037) llevan cita SSOT en el header del archivo modificado. El resto de HU EPICA-30 ya cubiertas en rondas previas se difieren a auditoría dirigida en ronda 13+ (R2 esfuerzo S 1-2h).
