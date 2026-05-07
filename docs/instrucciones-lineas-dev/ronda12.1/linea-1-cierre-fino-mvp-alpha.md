# Línea 1 — Cierre fino HU semánticas MVP-α (modal nombre + cargar tiles + descomposición objeto + enlace estructural etiquetado + undo granular)

## 1. Misión

Cosechar las **6 HU semánticas residuales MVP-α** que ronda 12 dejó sin evidencia detectable o sin smoke específico, llevando la cobertura de **90.8% → ≥95% ponderado** (sobre las 3 HU diferidas a consolidación operador y la HU-SHARED-007 honestamente diferida a ronda 14):

- **HU-10.003 parcial**: Modal nombre tras crear cosa. `data-testid="modal-nombre-cosa"` ya existe (ronda 11 L4); afinar smoke autoanular + Enter confirma + Esc cancela.
- **HU-30.019 pendiente**: Cargar modelo con doble clic sobre tile en `DialogoCargarModelo`.
- **HU-30.020 pendiente**: Cargar modelo con clic sobre tile + botón "Cargar".
- **HU-10.021 parcial**: Descomposición de objeto en mismo diagrama (inzoom para objetos, no solo procesos).
- **HU-11.012 parcial**: Crear enlace estructural etiquetado unidireccional (exhibición/generalización/clasificación) con etiqueta editable inline.
- **HU-SHARED-002 parcial**: Pila de undo/redo granular para cada comando ronda 11 (tests aditivos verifican atomicidad: una operación = un solo undoStack push).

Slice mínimo entregable: feature **cosecha de cierre semántico** sin nuevos módulos. La mayoría de cambios son tests + smokes; cambios de UI solo si la auditoría revela falta de wiring (HU-11.012 etiqueta, HU-10.021 inzoom-objeto). Reuso obligatorio del `data-testid` existente "modal-nombre-cosa" (HU-10.003) y verificación de inzoom con `assets/svg/inzoom.svg` (ya importado).

**Fuera de slice**:

- **No tocar `app/src/ui/Toolbar.tsx`** (territorio L3 tooltips).
- **No tocar `app/src/ui/Dialogo.tsx`** (territorio L2 tokens + size prop).
- **No tocar `app/src/ui/tokens.ts` ni paleta** (territorio L2).
- **No tocar `app/src/ui/App.tsx` lazy imports** (territorio L2).
- **No tocar Inspector secciones** (`SeccionRefinamiento`, `SeccionLayoutEstados`, `SeccionDuracion`) (territorio L3 íconos).
- **No tocar `MenuContextualEntidad.tsx` ni `MenuContextualArbol.tsx`** (territorio L3 íconos eliminar).
- **No tocar `ArbolOpd.tsx` ni `BibliotecaCosa.tsx`** (territorio L3 list-logical).
- **No tocar `DialogoTraerConectados.tsx`** (territorio L3 conteo).
- **No tocar serializadores ni JSON canónico**.
- **HU-SHARED-007 (eco OPL inverso) DIFERIDA a ronda 14** (requiere parser OPL bidireccional). No tocar `opl/parser*.ts` ni intentar inverso editable.

## 2. Deudas que cierra

| HU | Estado actual | Aporte L1 |
|---|---|---|
| HU-10.003 — Modal nombre tras crear cosa | parcial → cubierto | Smoke estabilizado en `app/e2e/opm-smoke.spec.ts`: crear cosa con click-drag desde Toolbar → modal `data-testid="modal-nombre-cosa"` aparece → autofocus en input → Enter confirma + persiste nombre → Esc cancela + descarta cosa creada. **No modificar Toolbar.tsx ni el modal**; solo agregar smoke. Si el modal no captura Esc, reportar como bug L2 (puede ser cobertura HU-30.037). |
| HU-30.019 — Cargar doble clic | pendiente → cubierto | Smoke explícito: en `DialogoCargarModelo`, doble clic sobre tile invoca handler de carga + cierra diálogo + abre modelo en pestaña activa. **Verificar que el handler `onDoubleClick` ya existe**; si falta, agregar como aditivo (NO refactor). |
| HU-30.020 — Cargar clic+botón | pendiente → cubierto | Smoke análogo: clic sobre tile selecciona (visual seleccionado) + botón "Cargar" carga + cierra. **Verificar que tile + botón ya están**; smoke valida flujo completo. |
| HU-10.021 — Descomposición objeto inzoom | parcial → cubierto | Verificar primero con `grep "esObjeto\|esProceso" app/src/store/modelo/acciones-canvas.ts | grep -i "inzoom\|despleg\|refin"` que la acción `desplegar`/`hacerInzoom` admite ambos tipos. Si solo soporta proceso, **extender aditivamente** (caso `esObjeto` paralelo al de proceso, copia textual del bloque + sustitución `Proceso`→`Objeto`). Smoke: crear objeto, click derecho → "Inzoom", verificar que se crea OPD hijo + apariencia interna + árbol refleja jerarquía. Si ya soporta objetos, solo agregar smoke + regla detector. |
| HU-11.012 — Enlace estructural etiquetado | parcial → cubierto | Auditar `MenuContextualEnlace.tsx` y operaciones de enlace estructural: ¿existe edición inline de etiqueta para enlaces de exhibición/generalización/clasificación? Si solo cubre etiqueta de agregación, extender aditivamente: ítem "Editar etiqueta" en `MenuContextualEnlace.tsx` invoca `editarEtiquetaEnlaceEstructural(enlaceId, etiqueta)` (acción nueva en `store/modelo/acciones-canvas.ts` si no existe). Validación: etiqueta no puede ser vacía (regla del archivo HU). Smoke + unit cubriendo los 3 tipos estructurales. |
| HU-SHARED-002 — Pila undo/redo granular | parcial → cubierto | Tests aditivos en `app/src/canvas/operacionesBatch.test.ts` y/o `app/src/store.test.ts` cubriendo undo atómico de cada comando ronda 11: `reanclarExtremoEnlaceSeleccionado`, `aplicarEstiloEnlacesBatch`, `eliminarEnlacesBatch`, `copiarEstiloEnlaceAlPortapapeles`, BibliotecaCosa drag-drop, `conectarMultiAlTodo`. Cada uno emite **un solo push en undoStack** verificable con `estadoModelo().undoStack.length` antes/después. **No modificar implementaciones**; los tests son la verificación; si falla, reportar como bug fuera de scope. |

**Total esperado**: 6 HU residuales cerradas (HU-10.003, HU-10.021, HU-11.012, HU-30.019, HU-30.020, HU-SHARED-002).

**HU diferidas conscientemente**:

- **HU-SHARED-007 OPL inverso editable**: forward cubierto desde ronda 8; inverso requiere parser. Diferida a **ronda 14 dedicada parser OPL** junto con HU-50.019/.020/.022. **No tocar en L1**.
- **HU-10.004, HU-30.008, HU-30.021** (las 3 marcadas con asterisco en README §4): probablemente ya cubiertas por reglas detector ronda 12. La consolidación operador ejecuta `--sync-real` y recategoriza. **No tocar en L1**.

## 3. Anclaje a evidencia

**Nivel 1 — SSOT (citas obligatorias en cada archivo modificado, RF-2 vigente)**:

- `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/metodologia-opm-es.md`:
  - §6 etapas SD: persistencia íntegra del payload. **Cita obligatoria HU-30.019/.020**: `[Met §6]`.
  - §inzoom: descomposición canónica. **Cita obligatoria HU-10.021**: `[Met §inzoom]`.
- `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md`:
  - §3.55 Object, §3.69 Process: descomposición aplicable a ambos. **Cita obligatoria HU-10.021**: `[Glos 3.55]` o `[Glos 3.69]`.
  - §3.x link signature: enlaces estructurales. **Cita obligatoria HU-11.012**: `[Glos 3.x]` correspondiente.
- `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-visual-es.md`:
  - V-239 familias estructurales. **Cita obligatoria HU-11.012**: `[V-239]`.
- `docs/historias-usuario-v2/00-METODOLOGIA.md §6`: jerarquía SSOT.
- `docs/historias-usuario-v2/epicas/epica-11-canvas-modelado-basico.md §HU-11.012` línea 416: criterio "etiqueta no puede ser vacía".

**Nivel 2 — `app/src/modelo/tipos.ts`**: ronda 12.1 **NO modifica tipos kernel**. Verificar coherencia: si HU-11.012 requiere campo nuevo, abortar y reportar (sale del scope ronda corta).

**Nivel 3 — respaldo técnico (citas opcionales)**:

- **opm-extracted/ verificado**:
  - `opm-extracted/src/app/dialogs/save-as-dialog/` (consolidado en ronda 11 L2): patrón "load on double click" implícito en patrones de tile + handler.
  - **No copiar 1:1**: implementación es propia (Preact + Zustand).

**Estado actual del código (post-ronda-12, verificado)**:

- `app/src/canvas/operacionesBatch.ts` (889 LOC) — todos los batchs ronda 11+12 viven aquí. **L1 NO modifica**, solo verifica atomicidad por tests.
- `app/src/canvas/operacionesBatch.test.ts` (399 LOC) — agregar tests undo granular HU-SHARED-002.
- `app/src/store/modelo/acciones-canvas.ts` (735 LOC) — HU-11.012 wiring si falta (acción `editarEtiquetaEnlaceEstructural`).
- `app/src/ui/MenuContextualEnlace.tsx` — HU-11.012 ítem "Editar etiqueta" si falta.
- `app/src/ui/InspectorEntidad.tsx` — HU-10.021 verificar si admite inzoom para objetos (tipo de entidad activa).
- `app/src/store.test.ts` — agregar tests integrados HU-SHARED-002 + HU-11.012.
- `app/src/store/persistencia.test.ts` — opcional, smokes ya cubren HU-30.019/.020.
- `app/e2e/opm-smoke.spec.ts` (3496 LOC) — agregar 6 smokes al final del archivo.
- `app/src/ui/DialogoCargarModelo.tsx` — verificar handlers `onClick`/`onDoubleClick` ya existen (no editar si están).

## 4. Archivos permitidos

```text
app/src/canvas/operacionesBatch.test.ts            EDIT aditivo (~5 tests undo granular HU-SHARED-002)
app/src/store.test.ts                              EDIT aditivo (~3 tests integrados HU-SHARED-002 + HU-11.012)
app/src/store/persistencia.test.ts                 EDIT aditivo (~1 test si modela HU-30.019/.020 desde store)
app/src/store/modelo/acciones-canvas.ts            EDIT extiende (HU-11.012 `editarEtiquetaEnlaceEstructural` si falta; verificar primero)
app/src/store/tipos.ts                             EDIT aditivo (acción HU-11.012 en OpmStore si nueva; ningún rename)
app/src/ui/MenuContextualEnlace.tsx                EDIT aditivo (HU-11.012 ítem "Editar etiqueta" si falta; NO tocar handlers existentes)
app/src/ui/InspectorEntidad.tsx                    EDIT aditivo (HU-10.021 verificar y cablear inzoom-objeto si falta)
app/src/ui/DialogoCargarModelo.tsx                 LECTURA (verificar handlers existentes; smokes los validan; NO editar salvo emerja necesidad mínima)
app/src/canvas/operacionesBatch.ts                 LECTURA (no modificar; tests verifican atomicidad)
app/src/store/seleccion.ts                         LECTURA
app/src/store/persistencia.ts                      LECTURA
app/e2e/opm-smoke.spec.ts                          EDIT aditivo (~6 smokes nuevos al final del archivo)
opm-extracted/**                                   LECTURA
docs/HANDOFF.md                                    LECTURA
docs/historias-usuario-v2/**                       LECTURA
docs/JOYAS.md                                      LECTURA
assets/svg/**                                      LECTURA
```

Cualquier otro archivo es **fuera de scope**.

### Nota arquitectónica

- **HU-10.021 inzoom-objeto**: si la auditoría revela que `desplegar`/`hacerInzoom` ya soporta ambos (objeto y proceso) en `acciones-canvas.ts`, **L1 solo agrega smoke + regla detector**. Si requiere extensión código, **slice mínimo** (caso `esObjeto` paralelo al de proceso, ~10-20 LOC aditivos). Cualquier refactor más amplio se reporta y pausa.
- **HU-11.012 etiqueta enlace estructural**: si `MenuContextualEnlace.tsx` ya tiene edición inline para todos los tipos, solo agregar tests + regla detector. Si solo cubre algunos tipos, agregar caso aditivo. Si requiere campo nuevo en `Enlace.etiqueta`, abortar y reportar (cambio kernel sale del scope ronda corta).
- **HU-SHARED-002 undo granular**: los tests son la verificación. Si un comando emite >1 push en `undoStack`, reportar como bug. **NO arreglar**: la causa puede estar en serialización del comando o en composición de batch; reparar es cambio fuera de scope ronda corta.

## 5. Restricciones de no-colisión

- **No tocar `app/src/ui/Toolbar.tsx`** (territorio L3 tooltips).
- **No tocar `app/src/ui/Dialogo.tsx`** (territorio L2 tokens + size prop + HU-30.037 cobertura Esc).
- **No tocar `app/src/ui/tokens.ts`** (NUEVO en L2).
- **No tocar `app/src/ui/App.tsx`** (territorio L2 lazy imports).
- **No tocar `app/src/ui/inspector/SeccionRefinamiento.tsx`, `SeccionLayoutEstados.tsx`, `SeccionDuracion.tsx`** (territorio L3 íconos).
- **No tocar `app/src/ui/MenuContextualEntidad.tsx`, `MenuContextualArbol.tsx`** (territorio L3 íconos delete).
- **No tocar `app/src/ui/ArbolOpd.tsx`, `BibliotecaCosa.tsx`** (territorio L3 list-logical).
- **No tocar `app/src/ui/DialogoTraerConectados.tsx`** (territorio L3 conteo).
- **No tocar `app/src/ui/DialogoPlantillas.tsx`** (territorio L2 size prop).
- **No tocar generadores OPL** (`app/src/opl/generadores/*.ts`): cero cambios OPL en ronda 12.1.
- **No tocar serializadores ni JSON canónico**.
- **No tocar `progress-dashboard.mjs`**: la consolidación operador agrega reglas detector.
- **`acciones-canvas.ts` y `MenuContextualEnlace.tsx`**: L1 los toca exclusivamente para HU-11.012. Hunks aditivos al final, no modificar handlers existentes.

## 6. Comportamiento esperado

- **HU-10.003**: al crear cosa con click-drag desde Toolbar (botón "Objeto"/"Proceso"), aparece modal con `data-testid="modal-nombre-cosa"`, autofocus en input, Enter persiste nombre + cierra modal + commit cosa. Esc descarta cosa + cierra modal sin persistir.
- **HU-30.019**: en `DialogoCargarModelo`, doble clic sobre tile dispara `cargarModelo(modeloId)` + `cerrarDialogoCargarModelo()`. Modelo abre en pestaña activa.
- **HU-30.020**: clic sobre tile selecciona visualmente (`aria-selected="true"` + estilo); botón "Cargar" del footer dispara mismo flujo de carga.
- **HU-10.021**: con objeto seleccionado, click derecho → "Inzoom" (o atajo si existe) genera OPD hijo refinante con la apariencia del objeto, agrega entrada en árbol OPD jerárquico bajo el OPD padre. **Mismo path UI que para procesos**.
- **HU-11.012**: con enlace estructural seleccionado (exhibición/generalización/clasificación), click derecho → "Editar etiqueta" dispara `RenombradoInline` o input modal con etiqueta actual, Enter persiste, Esc cancela. **Etiqueta no puede ser vacía** (validación en acción).
- **HU-SHARED-002**: cada uno de los 6 comandos ronda 11 (`reanclarExtremoEnlaceSeleccionado`, `aplicarEstiloEnlacesBatch`, `eliminarEnlacesBatch`, `copiarEstiloEnlaceAlPortapapeles`, drag-drop biblioteca, `conectarMultiAlTodo`) emite **exactamente un push** en `estadoModelo().undoStack`. Tests verifican `length` antes y después.

## 7. Pruebas requeridas

**Unit tests (~9 nuevos)**:

- `operacionesBatch.test.ts`: 5 tests undo granular (uno por comando ronda 11; el sexto `conectarMultiAlTodo` ya está cubierto en ronda 12 L1, verificar y no duplicar).
- `store.test.ts`: 1 test integrado HU-SHARED-002 (composición de comandos sucesivos da pila proporcional).
- `store.test.ts`: 1-2 tests HU-11.012 `editarEtiquetaEnlaceEstructural` (etiqueta válida + rechazo etiqueta vacía + roundtrip).
- `acciones-canvas.test.ts` (si existe) o `store.test.ts`: 1 test HU-10.021 inzoom-objeto (acción crea OPD hijo + apariencia interna + entrada árbol).

**Smoke browser (`app/e2e/opm-smoke.spec.ts`), ~6 nuevos**:

- "HU-10.003: crear cosa abre modal nombre con autofocus + Enter persiste + Esc cancela".
- "HU-30.019: doble clic sobre tile carga modelo y cierra diálogo".
- "HU-30.020: clic sobre tile + botón Cargar carga modelo".
- "HU-10.021: inzoom sobre objeto crea OPD hijo + entrada en árbol".
- "HU-11.012: editar etiqueta de enlace estructural exhibición/generalización/clasificación".
- "HU-SHARED-002: cada comando ronda 11 deja un solo entry en undoStack".

**Detector**: L1 declara las reglas siguientes para consolidación operador (~5 reglas):

- HU-10.003: smoke en `opm-smoke.spec.ts` con string `"modal-nombre-cosa"` + autofocus.
- HU-30.019/.020: regla agrupada con paths `DialogoCargarModelo.tsx` (handlers) + smokes en `opm-smoke.spec.ts`.
- HU-10.021: `acciones-canvas.ts` con string `"hacerInzoom"`/`"desplegar"` cubriendo `esObjeto` + smoke.
- HU-11.012: `MenuContextualEnlace.tsx` con string `"Editar etiqueta"` + `acciones-canvas.ts` con string `"editarEtiquetaEnlaceEstructural"`.
- HU-SHARED-002: `operacionesBatch.test.ts` con string `"undoStack.length"` cubriendo cada comando ronda 11.

## 8. Métricas esperadas

- **Tests aditivos**: ~9 unit + 6 smokes nuevos.
- **HU cerradas L1 directas**: 6 (HU-10.003, HU-10.021, HU-11.012, HU-30.019, HU-30.020, HU-SHARED-002).
- **Reglas detector que esta línea aporta** (consolidación operador): ~5 reglas nuevas.
- **Build**: cero impacto (cambios pequeños, sin componentes nuevos).
- **Smoke browser**: 81 → ~87.

## 9. Loop verde y commits

```bash
cd app
bun run check          # 659 → ~668 unit
bun run browser:smoke  # 81 → ~87
bun run build          # main chunk sin crecimiento (sin código nuevo significativo)
```

Commits sugeridos (orden):

1. `test(operacionesBatch): undo granular comandos ronda 11 (HU-SHARED-002)` (5 tests)
2. `feat(canvas): inzoom soporta objetos (HU-10.021)` (si requirió cambio código; si no, omitir y pasar al test directo)
3. `test(store): inzoom-objeto crea OPD hijo (HU-10.021)`
4. `feat(canvas): editar etiqueta enlace estructural (HU-11.012)` (si requirió wiring)
5. `test(store): etiqueta enlace estructural valida no-vacía (HU-11.012)`
6. `test(e2e): smokes residuales MVP-α (HU-10.003, HU-30.019/.020, HU-10.021, HU-11.012, HU-SHARED-002)`

Cada commit debe dejar la rama verde. Co-author si aplica.

## 10. Decisiones que tomas vos (documentar en commit)

- **HU-10.021**: si `hacerInzoom`/`desplegar` ya soporta objetos, **omitir cambio código** y solo agregar smoke + regla detector. Documentar en commit el path concreto y la línea verificada.
- **HU-11.012**: si `MenuContextualEnlace.tsx` ya cubre los 3 tipos estructurales, omitir cambio UI. Documentar.
- **HU-SHARED-002**: si un comando emite >1 push en undoStack, **reportar bug fuera de scope** (NO arreglar en L1). Crear `/tmp/ronda12.1-bug-undo-{comando}.md` con descripción + repro.
- Composición exacta de smokes (1 caso por HU vs sub-casos por tipo): tu criterio sobre legibilidad.
- Si `editarEtiquetaEnlaceEstructural` requiere campo kernel nuevo (`Enlace.etiqueta?`), **abortar L1** y reportar al operador. Cambio kernel sale del scope ronda corta.

## 11. Forma del entregable

Al cierre de L1, declarar:

- Hash final del último commit en main.
- LOC nuevos por archivo (`wc -l`).
- Output de `bun run check`, `bun run browser:smoke`, `bun run build` (último tail).
- Lista de tests aditivos creados + conteo.
- Lista de smokes aditivos + conteo.
- Decisiones declaradas (§10).
- HU cerradas con id (de §2).
- Reglas detector declaradas para consolidación operador (§7 final).
- **Citas SSOT agregadas en headers** (`[V-…]`, `[Glos 3.x]`, `[Met §x]`) — RF-2 remediation.
- Bloqueos o desviaciones explícitas con rationale.
- Confirmación de archivos no tocados (de §5 lista).

Si dudás de un caso límite: detente y reporta al operador antes de actuar. Mejor pausar que invadir scope.

Co-author footer en commits si corresponde.
