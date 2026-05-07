# Línea 3 — EPICA-1B traer conectados (toolbar contextual + halo + multi-selección + ocultar reverso)

## 1. Misión

Abrir **MVP-β fase canvas-aditivo** con la operación "traer conectados": materializar apariencias y enlaces de entidades vecinas en el OPD activo sin duplicarlas en el modelo. Cubre **13 HU vivas** de EPICA-1B:

- **HU-1B.001** activar "Traer conectados" desde toolbar contextual (M1, UI).
- **HU-1B.002** elegir familias de enlace en diálogo (M1, UI).
- **HU-1B.003** materializar cosas conectadas directamente al OPD actual (M1, kernel).
- **HU-1B.004** respetar conectividad directa sin propagar por jerarquía (M1, kernel).
- **HU-1B.005** activar "Traer conectados" desde halo con default (M1, UI).
- **HU-1B.007** seleccionar múltiples cosas para habilitar traer-enlaces (M1, UI).
- **HU-1B.008** activar "Traer enlaces entre seleccionadas" desde toolbar (M1, kernel).
- **HU-1B.009** traer únicamente enlaces internos a la selección múltiple (M1, kernel).
- **HU-1B.010** evitar duplicar apariencia si la cosa ya está visible (M1, kernel).
- **HU-1B.011** recalcular ruteo y posición de las cosas traídas (M1, render).
- **HU-1B.013** no generar oraciones OPL nuevas al traer cosa existente (M1, OPL idempotente).
- **HU-1B.015** ocultar cosa del OPD actual sin borrarla del modelo (M1, kernel reverso).
- **HU-1B.016** no producir cambio si ninguna familia coincide (M1, kernel no-op).

Slice mínimo entregable: **canvas-aditivo + UI canónica**:

- `canvas/operacionesBatch.ts` extendido con `traerConectadosBatch(modelo, opdId, aparienciaOrigenId, familias)` y `traerEnlacesEntreBatch(modelo, opdId, aparienciasIds)` y `ocultarAparienciaBatch(modelo, opdId, aparienciaId)`.
- Reglas de filtrado por familia (mapeo a tipos enlace OPM): `procedural-enablers`, `procedural-transformers`, `tagged`, `fundamental`, inspirado en `opm-extracted/src/app/models/consistency/bringConnectedRules.ts`.
- `acciones-canvas.ts` extendido con `traerConectadosSeleccionado(familias?)`, `traerEnlacesEntreSeleccionadas()`, `ocultarAparienciaSeleccionada()`.
- `ui/MenuContextualEntidad.tsx` nuevo: clic derecho sobre apariencia → "Traer conectados" / "Ocultar de este OPD".
- `ui/DialogoTraerConectados.tsx` nuevo: checkboxes por familia + botón "Traer".
- `ui/Toolbar.tsx` extendido con botón "Traer conectados" (icono `assets/svg/addConnected.svg`) que actúa sobre selección actual.
- Halo button "↓ Traer" sobre apariencia seleccionada (HU-1B.005) con default — **diferido a halo si halo del repo no existe aún; entonces solo Toolbar + menú contextual**.

**Fuera de slice**:
- HU-1B.006 (default preferencias por familia): bajo prioridad, ronda 13+.
- HU-1B.014 (burbuja de sugerencia): S, bajo prioridad. Ronda 13+.
- No tocar OPL generadores (HU-1B.013 OPL idempotente es propiedad emergente: si la entidad ya tenía oración, no se re-emite porque los generadores leen desde `modelo.entidades` no desde apariencias específicas).
- No tocar plantillas (territorio L4).
- No tocar atributos numéricos (territorio L2).

## 2. Deudas que cierra

| HU | Estado actual | Aporte L3 |
|---|---|---|
| HU-1B.001 | pendiente | Botón Toolbar "Traer conectados" + ítem en `MenuContextualEntidad`. Habilitado solo si hay 1+ apariencia seleccionada. Abre `DialogoTraerConectados` o ejecuta con default si halo. |
| HU-1B.002 | pendiente | `DialogoTraerConectados.tsx` nuevo: checkboxes por familia (`Procedurales habilitadores`, `Procedurales transformadores`, `Direccionales`, `Estructurales`), input "Aplicar" + Esc para cancelar. Recuerda última selección en `PreferenciasUiUsuario.traerConectadosUltimo?` aditivo. |
| HU-1B.003 | pendiente | `traerConectadosBatch(modelo, opdId, aparienciaOrigenId, familias)`: por cada enlace del modelo cuyo origen o destino sea la entidad de la apariencia origen, y cuyo tipo coincida con alguna familia, materializa apariencia para la entidad vecina (si no existe en OPD activo) + apariencia para el enlace. Atómico: una sola operación, un solo undo entry. |
| HU-1B.004 | pendiente | El batch traer trabaja a profundidad 1 (vecinos directos), no transitivo. Verificación explícita: si A→B→C, traer desde A solo materializa B. Test cubre. |
| HU-1B.005 | pendiente | Si el repo tiene halo button container, agregar botón "↓ Traer" con default `["procedural-enablers", "procedural-transformers", "tagged", "fundamental"]`. Si no hay halo, ítem `MenuContextualEntidad` con "(con default)". |
| HU-1B.007 | pendiente | Con multi-selección de ≥2 apariencias, `MenuContextualEntidad` muestra ítem "Traer enlaces entre seleccionadas". Mecánica de menú multi (`HU-SHARED-008`) ya cubierta. |
| HU-1B.008 | pendiente | `traerEnlacesEntreBatch(modelo, opdId, aparienciasIds)`: por cada par de apariencias (i, j) en la selección, busca enlaces en `modelo.enlaces` entre las entidades correspondientes que NO tengan apariencia de enlace en el OPD activo, y materializa solo esos. |
| HU-1B.009 | pendiente | Filtro: solo enlaces cuyo origen Y destino están en la selección. Enlaces que conectan a entidades fuera de la selección se ignoran. Test cubre A→B (interno), B→D (externo). |
| HU-1B.010 | pendiente | Idempotencia: en `traerConectadosBatch`, antes de crear apariencia para entidad vecina, check si ya existe `apariencia` para esa entidad en el OPD activo. Si existe, omite la creación + materializa solo la apariencia de enlace. |
| HU-1B.011 | pendiente | Layout radial canónico: las N apariencias traídas se distribuyen en círculo alrededor de la apariencia origen con radio R = max(120, 60 + 30 * N) px. Evita solapamiento mediante minDistance check. Si hay solapamiento, usar grid spiral fallback. |
| HU-1B.013 | pendiente (idempotente) | OPL invariante: la oración OPL se genera desde `modelo.entidades` y `modelo.enlaces`, no desde apariencias específicas. Traer una entidad ya existente no agrega oraciones porque los enlaces ya estaban. Smoke verifica: emite mismo conjunto de oraciones antes y después de traer una entidad ya cubierta. |
| HU-1B.015 | pendiente | `ocultarAparienciaBatch(modelo, opdId, aparienciaId)`: elimina la `apariencia` y todas las `aparienciaEnlace` que la referencian, **sin tocar `modelo.entidades` ni `modelo.enlaces`**. Reverso de `crearAparienciaBatch`. Atajo: ítem `MenuContextualEntidad` "Ocultar de este OPD". Atajo teclado opcional `Ctrl+H` (panel-canvas). |
| HU-1B.016 | pendiente | En `DialogoTraerConectados`, si el conjunto resultante está vacío (no hay enlaces que coincidan con las familias), no commit + mensaje "Sin cambios" en panel de avisos. Cierre del diálogo no abre estado dirty. |

**Total esperado**: 13 HU pendientes → cubiertas (toda EPICA-1B vivas excepto HU-1B.006/.014 diferidas).

## 3. Anclaje a evidencia

- **JOYAS** (`docs/JOYAS.md`):
  - §2 dimensiones: apariencias traídas conservan 135×60 px.
  - §4 arquitectura wrapper+line: enlaces traídos tienen wrapper `transparent stroke-width=15` + line `#586D8C stroke-width=2`.
- **Assets canónicos** (`assets/svg/`):
  - `addConnected.svg`: usado por OPCloud para halo bring-connected. **L3 reusa** para botón Toolbar y halo button.
- **opm-extracted/ verificado**:
  - `opm-extracted/src/app/models/Actions/BringConnectedEntitiesAction.ts`: clase canónica con método `act(opt, styleParams)` que invoca `filterRelevantRules`, `collectEntitiesAndLinks`, `filterEntitiesAndRelations`, `createNeededThings`, `createNeededRelations`, `setPartnersForConsumptionAndResultLinks`, `bringLinksBetweenBroughtEntities`. **Patrón canónico** que se reescribe en `traerConectadosBatch` aditivo. NO copiar 1:1 (depende de `OPCloudUtils`, `removeDuplicationsInArray`, etc. que no existen en deep-opm-pro).
  - `opm-extracted/src/app/models/consistency/bringConnectedRules.ts`: clases por familia (`BringProceduralEnablersRelations`, `BringProceduralTransformersRelations`, `BringUniBiDirectionalRelations`, `BringFundamentalRelations`) con `getNeededElements(logicalConnection)`. **Patrón canónico**: cada familia decide qué enlaces y entidades traer. Replicar como funciones `reglaProceduralHabilitador`, `reglaProceduralTransformador`, `reglaTagged`, `reglaEstructural` que reciben `enlace: Enlace` y devuelven `{ entidades: Id[]; enlaces: Id[] }`.
  - `opm-extracted/src/app/modules/layout/element-tool-bar/element-tool-bar.component.ts`: handle del halo `bring-connected` con `displayTitle`, `gif` (preview animado), `action.act()`. **Patrón referencial** para halo button del repo si se implementa; el halo del repo no necesariamente tiene preview gif — se omite.
- **SSOT**:
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/metodologia-opm-es.md` §gestión multi-OPD: las apariencias son vistas; traer no muta el modelo logical, solo la vista del OPD.
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md` §3.6 "Apariencia": una entidad puede aparecer en múltiples OPDs.
- **Estado actual del código (post-ronda-11)**:
  - `app/src/canvas/operacionesBatch.ts:106` — `conectarMultiAlTodo` existe (referencia patrón batch). **L3 agrega** `traerConectadosBatch`, `traerEnlacesEntreBatch`, `ocultarAparienciaBatch`.
  - `app/src/canvas/seleccionMultiple.ts` — tiene `setSeleccion`, `agregar`, `quitar`, `toggle`, `todasDelOpd`. **L3 agrega** `enlacesInternosSeleccion(modelo, opdId, aparienciasIds)` que retorna IDs de enlaces cuyos extremos están todos en la selección.
  - `app/src/store/modelo/acciones-canvas.ts` — patrón `seleccion-batch-action`. **L3 agrega** 3 acciones nuevas.
  - `app/src/ui/MenuContextualEnlace.tsx` — patrón menú contextual sobre enlace (ronda 11). **L3 crea `MenuContextualEntidad.tsx` análogo** sobre apariencia.

## 4. Archivos permitidos

```text
app/src/modelo/tipos/ui.ts                         EDIT aditivo (PreferenciasUiUsuario.traerConectadosUltimo?)
app/src/canvas/operacionesBatch.ts                 EDIT extiende (3 funciones nuevas: traerConectadosBatch, traerEnlacesEntreBatch, ocultarAparienciaBatch)
app/src/canvas/operacionesBatch.test.ts            EDIT aditivo (tests por familia + idempotencia + radial layout)
app/src/canvas/seleccionMultiple.ts                EDIT aditivo (enlacesInternosSeleccion)
app/src/canvas/seleccionMultiple.test.ts           EDIT aditivo
app/src/canvas/reglasTraer.ts                      NUEVO (4 reglas por familia: procedural-enablers, procedural-transformers, tagged, estructural)
app/src/canvas/reglasTraer.test.ts                 NUEVO
app/src/canvas/layoutRadial.ts                     NUEVO (HU-1B.011 layout radial cosa traída)
app/src/canvas/layoutRadial.test.ts                NUEVO
app/src/store/tipos.ts                             EDIT aditivo (5 acciones traer)
app/src/store/modelo/acciones-canvas.ts            EDIT extiende (traerConectadosSeleccionado, traerEnlacesEntreSeleccionadas, ocultarAparienciaSeleccionada)
app/src/store/modelo/acciones-ui.ts                EDIT extiende (abrirDialogoTraerConectados, cerrarDialogoTraerConectados)
app/src/ui/MenuContextualEntidad.tsx               NUEVO (clic derecho sobre apariencia: Traer conectados, Ocultar de este OPD, Traer enlaces entre seleccionadas)
app/src/ui/DialogoTraerConectados.tsx              NUEVO (checkboxes familia + Aplicar/Cancelar)
app/src/ui/Toolbar.tsx                             EDIT aditivo (botón Traer conectados con icono addConnected.svg)
app/src/ui/atajosTeclado.ts                        EDIT aditivo (Ctrl+Shift+T abre traer; Ctrl+H ocultar apariencia)
app/e2e/opm-smoke.spec.ts                          EDIT aditivo (~5 smokes traer conectados)
opm-extracted/**                                   LECTURA
docs/HANDOFF.md                                    LECTURA
docs/historias-usuario-v2/**                       LECTURA
docs/JOYAS.md                                      LECTURA
assets/svg/**                                      LECTURA
```

Cualquier otro archivo es **fuera de scope**.

## 5. Restricciones de no-colisión

- **No tocar `modelo/tipos/entidad.ts` ni `modelo/tipos/opl.ts`** (territorio L2).
- **No tocar `opl/generadores/*`** (OPL invariante; HU-1B.013 idempotencia es propiedad emergente, no requiere cambio).
- **No tocar `acciones-entidad.ts`** (territorio L1 HU-10.004 + L2 valor numérico).
- **No tocar `acciones-ui.ts` para read-only/redirect** (territorio L1).
- **No tocar `MenuPrincipal.tsx`** (territorio L4).
- **No tocar `persistencia/*` salvo lectura para roundtrip** (territorio L4 plantillas; HU-1B.012 emerge porque las apariencias ya se serializan).
- **No tocar `progress-dashboard.mjs`** (territorio L5).
- **`Toolbar.tsx`**: L3 (botón traer conectados), L1 (indicador modo sticky), L2 (botón crear atributo numérico), L4 (botón plantillas). Hunks disjuntos por sección JSX.
- **`tipos/ui.ts`**: L3 (`traerConectadosUltimo?`), L4 (`plantillasOrden?`). Aditivos disjuntos.
- **`acciones-canvas.ts`**: L3 (3 acciones traer), L1 (multi-al-todo wiring), L4 (insertarPlantilla). Hunks disjuntos.
- **`canvas/operacionesBatch.ts`**: L3 agrega 3 batchs nuevos; L4 agrega 1 (`insertarPlantillaBatch`); L1 NO agrega exports nuevos (solo verificación atomicidad). Hunks disjuntos.
- **`atajosTeclado.ts`**: L3 (Ctrl+Shift+T, Ctrl+H), L1 (Ctrl+Alt+T multi-al-todo). Disjuntos.
- **`MenuContextualEntidad.tsx`**: L3 crea el archivo. L1/L2/L4 no tocan.

## 6. Comportamiento esperado

- **Familias enum** (`canvas/reglasTraer.ts`):
  - `"procedural-habilitador"`: tipos `agente`, `instrumento` (instrumentos / habilitadores).
  - `"procedural-transformador"`: tipos `consumo`, `efecto`, `resultado` (transformadores).
  - `"direccional"`: tipos `direccional`, `bidireccional` (tagged).
  - `"estructural"`: tipos `agregacion`, `exhibicion`, `generalizacion`, `clasificacion`.
  - **Verificar mapeo** contra `app/src/modelo/tipos/enlace.ts` exacto. Si los tipos del repo son distintos, ajustar enum.
- **Batch traer conectados** (HU-1B.003/.004/.010):
  - Iterar enlaces del modelo con extremo en entidad origen.
  - Filtrar por familias seleccionadas.
  - Para cada enlace: si entidad vecina no tiene apariencia en OPD activo, crear apariencia (pos por layout radial) + apariencia de enlace.
  - Atómico: un solo `commitModelo` con mensaje "Traer conectados: N entidades, M enlaces".
  - Si `N === 0 && M === 0`, no commit + mensaje "Sin cambios" (HU-1B.016).
- **Layout radial** (HU-1B.011):
  - `layoutRadial(centroPos, N, radio)`: distribuye N puntos en círculo alrededor de `centroPos` separados por `2π/N` radianes. Radio default `max(120, 60 + 30 * N)`.
  - Si una posición candidato solapa con apariencia existente, intenta posición rotada `+30°` hasta encontrar libre.
  - Si todas las posiciones del círculo están ocupadas, expande radio en pasos de `40px`.
- **Multi-selección + traer enlaces** (HU-1B.007/.008/.009):
  - Activado en `MenuContextualEntidad` solo si `seleccion.modo === "multi"`.
  - `enlacesInternosSeleccion(modelo, opdId, aparienciasIds)` retorna enlaces cuyos extremos (entidad origen Y entidad destino) ambos pertenecen a la selección.
  - `traerEnlacesEntreBatch` materializa apariencias de enlace solo para esos enlaces que NO tengan apariencia ya en el OPD activo.
- **Ocultar apariencia** (HU-1B.015):
  - Confirma con tooltip "Ocultar X del OPD actual (no afecta otras vistas)".
  - Atómico: elimina apariencia + apariencias de enlace que la referencian. **NO toca** `modelo.entidades` ni `modelo.enlaces`.
  - Smoke: ocultar entidad de OPD A no la afecta en OPD B. Cambio reversible con undo.
- **OPL idempotente** (HU-1B.013):
  - Tras traer conectados, panel OPL emite el mismo conjunto de oraciones que ya emitía (porque las oraciones se generan por entidades/enlaces logical, no apariencias).
  - Smoke: capturar oraciones antes y después; deben ser idénticas (modulo orden si depende de aparición en OPD activo).

## 7. Pruebas requeridas

**Unit tests**:

- `canvas/reglasTraer.test.ts`: cada familia retorna entidades/enlaces correctos para mock de modelo + entidad origen.
- `canvas/operacionesBatch.test.ts`:
  - `traerConectadosBatch` con familia procedural-habilitador trae solo enlaces de habilitador.
  - HU-1B.004: traer desde A no propaga a C cuando A→B→C.
  - HU-1B.010: si entidad vecina ya tiene apariencia, no duplica; solo crea apariencia de enlace.
  - HU-1B.016: sin enlaces matching, no commit.
  - `traerEnlacesEntreBatch` (HU-1B.008/.009) con selección [A, B, C] y enlaces A→B/B→D/A→C, materializa solo A→B y A→C.
  - `ocultarAparienciaBatch` (HU-1B.015) elimina apariencia + apariencias de enlace; preserva entidad y enlaces.
- `canvas/seleccionMultiple.test.ts`: `enlacesInternosSeleccion` filtra correctamente.
- `canvas/layoutRadial.test.ts`: distribución sin solapamiento; radio adaptativo.

**Smoke browser** (`app/e2e/opm-smoke.spec.ts`), ~5 nuevos:

- "HU-1B.001/.002/.003: clic derecho sobre apariencia → Traer conectados → diálogo familias → confirmar trae N entidades": verifica entidades aparecen en canvas + apariencias de enlace.
- "HU-1B.005: halo button (o ítem default) trae con familias default sin abrir diálogo".
- "HU-1B.007/.008/.009: multi-selección + Traer enlaces entre seleccionadas trae solo internos".
- "HU-1B.013: OPL invariante tras traer entidad ya existente": capturar count oraciones antes/después.
- "HU-1B.015: Ocultar de este OPD elimina apariencia sin afectar entidad ni otros OPDs".

**Detector**: L3 declara las reglas siguientes para consolidación L5 (~6 reglas):

- HU-1B.001/.002: `app/src/ui/Toolbar.tsx` botón + `DialogoTraerConectados.tsx` existe.
- HU-1B.003/.004/.010/.016: `app/src/canvas/operacionesBatch.ts` string `traerConectadosBatch`.
- HU-1B.005: `app/src/ui/MenuContextualEntidad.tsx` o `Toolbar.tsx` evidencia halo/default.
- HU-1B.007/.008/.009: `app/src/canvas/seleccionMultiple.ts` `enlacesInternosSeleccion` + `operacionesBatch.ts` `traerEnlacesEntreBatch`.
- HU-1B.011: `app/src/canvas/layoutRadial.ts` existe.
- HU-1B.015: `app/src/canvas/operacionesBatch.ts` `ocultarAparienciaBatch` + `acciones-canvas.ts` `ocultarAparienciaSeleccionada`.

## 8. Métricas esperadas

- **Tests aditivos**: ~18 unit + 5 smokes nuevos.
- **HU cerradas L3**: 13 HU pendientes → cubiertas.
- **Reglas detector ronda 12 que esta línea aporta**: ~6 reglas nuevas.
- **Build**: chunk principal + ~5-7 KB (`DialogoTraerConectados`, `MenuContextualEntidad`, reglas, layout radial). Razonable < 190 KB.
- **Smoke browser**: 72 → ~77.

## 9. Loop verde y commits

```bash
cd app
bun run check          # 624 → ~642 unit
bun run browser:smoke  # 72 → 77
bun run build          # main chunk objetivo < 190 KB / < 52 KB gzip
```

Commits sugeridos (orden):

1. `feat(canvas): reglas traer conectados por familia (procedural-habilitador, transformador, direccional, estructural)`
2. `feat(canvas): traerConectadosBatch + idempotencia + no-op (HU-1B.003/.004/.010/.016)`
3. `feat(canvas): traerEnlacesEntreBatch + enlacesInternosSeleccion (HU-1B.007/.008/.009)`
4. `feat(canvas): ocultarAparienciaBatch (HU-1B.015)`
5. `feat(canvas): layoutRadial para cosas traídas (HU-1B.011)`
6. `feat(ui): MenuContextualEntidad con Traer/Ocultar (HU-1B.001/.005/.007/.015)`
7. `feat(ui): DialogoTraerConectados con familias (HU-1B.002)`
8. `feat(toolbar): botón Traer conectados con addConnected.svg (HU-1B.001)`
9. `test(e2e): smokes traer conectados L3 (~5 nuevos)`

## 10. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| **Mapeo familia→tipo enlace divergente del repo**: si los tipos OPM en `tipos/enlace.ts` no coinciden con la nomenclatura OPCloud, las reglas no funcionan. | Audit primero `app/src/modelo/tipos/enlace.ts` para conocer los tipos exactos del repo. Construir el mapeo desde ahí, no desde memoria OPCloud. |
| **`traerConectadosBatch` no atómico**: si la implementación llama `crearAparienciaBatch` N veces, undo no es atómico. | El batch debe operar sobre un único snapshot de modelo, generar todas las aperaciones en memoria, y aplicar una sola transición. Test verifica un solo undo entry. |
| **Layout radial solapa con apariencias preexistentes**: si el radio default no es suficiente. | Algoritmo iterativo con expansión de radio; fallback grid spiral si círculo lleno. Test cubre caso denso. |
| **`ocultarAparienciaBatch` rompe enlaces de otros OPDs**: si un enlace tiene apariencias en múltiples OPDs y se eliminan todas. | El batch elimina **solo** las apariencias del OPD activo; no toca apariencias en otros OPDs. Test verifica preservación cross-OPD. |
| **Multi-selección de tipos mixtos (entidad + enlace)**: la selección puede contener ambos tipos. | `enlacesInternosSeleccion` filtra por tipo apariencia (solo entidades cuentan). Si selección incluye apariencias de enlace, ignorarlas. |
| **HU-1B.013 OPL idempotencia depende de generadores existentes**: si un generador depende de `cantidadAparicionesOpd` (no debería), traer duplicaría. | Smoke verifica empíricamente: capturar conteo de oraciones antes y después. Si fallara, documentar drift y referir a ronda dedicada. |
| **MenuContextualEntidad colisiona con MenuContextualEnlace existente**: ambos detectan right-click sobre canvas. | Distinción por target del evento: si target es `apariencia`, abre MenuContextualEntidad; si es `aparienciaEnlace`, abre MenuContextualEnlace. Pattern ya usado para árbol vs canvas. |
| **Halo button no existe en deep-opm-pro**: HU-1B.005 depende de halo. | Fallback: ítem `MenuContextualEntidad` "(con default)" cumple HU-1B.005. Halo es opcional; documentar la decisión. |

## 11. Salida esperada

Al cierre de L3, el operador debe poder:

- Hidratar un OPD activo trayendo cosas vecinas con un solo gesto desde menú contextual o Toolbar.
- Filtrar las familias de enlace que se traen (procedurales, estructurales, direccionales).
- Multi-seleccionar cosas y traer solo los enlaces internos a esa selección.
- Ocultar una apariencia del OPD actual sin afectar el modelo logical ni otros OPDs.
- Confiar en que traer es idempotente: traer una entidad ya visible no duplica nada.
- Ver layout automático de las cosas traídas sin solapamiento manual.

**MVP-β fase canvas-aditivo iniciada**. EPICA-1B cierra al menos 13/16 HU canónicas, dejando solo HU-1B.006 (preferencias) y HU-1B.014 (burbuja sugerencia) para rondas posteriores.
