# Auditoría de cumplimiento — SSOT y referencia `opm-extracted` en `app/`

| Campo | Valor |
|---|---|
| Fecha | 2026-05-07 |
| Operador | Felix |
| Auditor | Claude (Opus 4.7, 1M ctx) |
| Alcance | `app/src` ↔ `docs/historias-usuario-v2` ↔ `opm-extracted` ↔ `assets/` |
| Pregunta auditada | ¿El código, assets y configuraciones de `app/` se replican/derivan desde `opm-extracted` toda vez que se puede, en lugar de reinventarse — sin comprometer la fidelidad a SSOT ni la divergencia legítima por arquitectura? |
| Veredicto global | **Cumplimiento ≈ 85–90%** — fidelidad SSOT alta en kernel, divergencia arquitectónica legítima donde aplica, brechas reales acotadas a 4 hallazgos accionables |

---

## 1. Resumen ejecutivo

El proyecto cumple **alto** con la jerarquía normativa declarada en `docs/historias-usuario-v2/00-METODOLOGIA.md` y `06-PROVENANCE.md`:

- ✅ **Assets canónicos**: 84/84 SVG/PNG copiados a `assets/` raíz, importados vía Vite. Cumplimiento literal de la política "Sí copiar SVGs canónicos".
- ✅ **Cero residuos Angular**: 0 ocurrencias de `@Component`, `@Injectable`, `@NgModule`, RxJS `Observable/Subject`, `MatDialog`, imports `@angular/*`. Política "No reusar componentes Angular" respetada.
- ✅ **Kernel M0 (épicas 10/11/12/15/50)**: Disciplina alta de citas SSOT (`[V-xxx]`, `[Glos 3.x]`, `[OPL-ES …]`, `[JOYAS §x]`) y referencias `// Refs: opm-extracted/...:LINEAS` en archivos clave.
- ✅ **MVP-α**: 91.1% (107/121 HU); EPICA-20 (árbol OPD) y EPICA-50 (OPL) al 100%.

Cuatro hallazgos accionables con severidad reformulada bajo el marco SSOT-céntrico:

| ID | Hallazgo | Severidad | Esfuerzo |
|---|---|---|---|
| RF-1 | Paths errados `Logical/AggregationLink.ts` (no existe) en 3 archivos | 🟠 Media | XS — 5 min |
| RF-2 | EPICA-30 (persistencia) con 0 citas SSOT en sus HU | 🟠 Media | S — 1–2 h |
| RF-3 | Delta consistency: validaciones.ts (11) vs ~60 disponibles — pendiente mapeo contra HU activas | 🟡 Baja | M — 2–4 h auditoría dirigida |
| RF-4 | Wizard `app/src/ui/asistente/` sin referencia a 8 PNGs canónicos `modelWizard/` | 🟡 Baja (latente) | XS — cuando HU se active |

El "**18.6% de cobertura de citas a opm-extracted**" detectado en sondeos — que en una primera lectura parecía red flag — **no es métrica de cumplimiento bajo el marco correcto**: opm-extracted es nivel 3 (respaldo técnico referencial), no autoridad. Citarlo es trazabilidad opcional. Lo exigible es citar SSOT.

---

## 2. Marco normativo y jerarquía SSOT

`docs/historias-usuario-v2/00-METODOLOGIA.md §6` establece tres niveles de autoridad:

| Nivel | Fuente | Rol | Citas obligatorias |
|---|---|---|---|
| **1** | SSOT OPM v3.0.0 (`opm-iso-19450-es.md`, `opm-visual-es.md`, `opm-opl-es.md`, `metodologia-opm-es.md`) | Autoridad semántica, visual, textual y procedimental | `[V-xxx]`, `[Glos 3.x]`, `[OPL-ES …]`, `[Met §x]` según tipo de HU |
| **2** | `app/src/modelo/tipos.ts` | SSOT viva del modelo de datos en TS | Coherencia obligatoria con ISO-19450 |
| **3** | `opm-extracted/`, `assets/`, `JOYAS.md`, `fixtures/`, `catalog/`, `config/` | Respaldo técnico referencial | Citas opcionales pero recomendadas para trazabilidad |

`docs/historias-usuario-v2/06-PROVENANCE.md §2` precisa la política operativa:

> "No inventa funcionalidad ausente en la SSOT y en OPCloud. No copia la arquitectura de OPCloud (Firebase, Angular). SVGs, dimensiones, colores, tipografía y plantillas OPL se reutilizan."

`opm-extracted/README.md §"Política y licencia"` complementa con cuatro reglas operativas:

1. ❌ No copiar bloques Angular tal cual a `app/`
2. ✅ Sí copiar SVGs canónicos directamente (`assets/svg/`, `assets/png/`)
3. ✅ Sí leer y citar reglas de consistency, OPL templates y algoritmos como spec ejecutable — pero reescribir
4. ❌ No reusar componentes Angular (`dialogs/`, `modules/Settings/`, `rappid-components/`)

**Implicancia metodológica**: la auditoría debe medir cumplimiento **SSOT-céntrico**, no "% de citas a opm-extracted". Las divergencias arquitectónicas (Preact/Zustand/JointJS-core vs Angular/Rappid/Firebase) son **esperadas** y no constituyen incumplimiento.

---

## 3. Metodología

Ejecutado el 2026-05-07 en `main @ ff75966`, vía 4 auditorías Explore en paralelo:

1. **Inventario `opm-extracted`** — qué hay disponible para referenciar.
2. **Auditoría de assets** — comparación 1:1 entre `opm-extracted/assets/` y `assets/` raíz; revisión de imports en `app/src`.
3. **Auditoría de derivación de lógica** — coverage de citas en headers + validación spot de fidelidad de citas.
4. **Cruce HU-v2 ↔ código** — política declarada en epicas; muestreo de provenance en 6 épicas representativas; estado del roadmap.

Verificaciones puntuales adicionales:
- Existencia y conteo en `/home/felix/projects/deep-opm-pro/assets/` (resultado: 86 archivos)
- Resolución real de paths citados en código vs estructura de `opm-extracted/src/app/models/`
- Inventario de reglas en `behavioral.rules.ts` (40 clases) y `structural.rules.ts` (11 clases)
- Inventario de reglas en `app/src/modelo/validaciones.ts` (11 funciones `reglaXXX`/`validarXXX`/`advertirXXX`, 453 LOC)

---

## 4. Hallazgos por dimensión

### 4.1 Assets canónicos — ✅ 100% cumplimiento

| Categoría | `opm-extracted/assets/` | `assets/` raíz | Mecanismo |
|---|---|---|---|
| SVG structural links (4) | aggregation, classification, exhibition, generalization | ✅ Copiados | Imports Vite en `linkAssets.ts` |
| SVG procedural links (~21) | agent, consumption, effect, instrument, invocation, result + variantes | ✅ Copiados | `linkAssets.ts` con `source: "assets/svg/links/procedural/..."` |
| SVG fans lógicos (2) | or, xor (extras vs original) | ✅ Copiados | `abanicoOverlay.ts` con cita `shared.ts:5908-5912` |
| SVG list-logical (4) | object/objectDashed, process/processDashed | ✅ Copiados | `arbolOpd.tsx` y derivados |
| SVG toolbar/UI (~36) | folder, autosave, lock, halos, modelWizard, etc. | ✅ Copiados | `MenuPrincipal.tsx`, `DialogoCargarModelo.tsx`, etc. |
| PNG icons (3) | key-icon, pin, token-icon | ✅ Copiados | — |
| PNG modelWizard (8) | page2, page3, page5, page7, page10.{1,2,3}, page11 | ✅ Copiados, no usados aún | RF-4 (latente) |
| **Total** | **84** | **86** (84 + 2 fans) | — |

**Sample de imports verificados**:
```
app/src/ui/MenuPrincipal.tsx:1: import modelWizardIcon from "../../../assets/svg/toolbar/modelWizard.svg";
app/src/ui/DialogoCargarModelo.tsx:2: import autosaveIcon from "../../../assets/svg/autosave.svg";
app/src/render/jointjs/linkAssets.ts: source: "assets/svg/links/procedural/agent.svg"
```

**Reimplementaciones programáticas con cita exacta** (no son "reinvención", son derivación documentada):
- `app/src/render/jointjs/linkAssets.ts:64` cita `opm-extracted shared.ts:5908-5914` (XOR=1 arco r=30, O=2 arcos r=30/35)
- `app/src/render/jointjs/abanicoOverlay.ts:6` cita `opm-extracted shared.ts:5908-5912`

### 4.2 Kernel del modelo (`app/src/modelo/`) — ✅ Disciplina alta

Archivos con citas SSOT y `// Refs: opm-extracted/...` verificadas (path real existente):

| Archivo | Cita | Verificación |
|---|---|---|
| `modelo/tipos/modelo.ts:13` | `models/json.model.ts:6-611` | ✅ Existe |
| `modelo/tipos/apariencia.ts:8` | `models/DrawnPart/OpmObject.ts:5-15` | ✅ Existe |
| `modelo/tipos/entidad.ts:10` | `models/DrawnPart/OpmObject.ts:5-15` | ✅ Existe |
| `modelo/tipos/pestana.ts:10` | `modules/app/tabsService.ts:5-130` | ✅ Existe |
| `modelo/imagenObjeto.ts:12` | SSOT `opm-iso-19450-es.md §Objetos` + opm-extracted `OpmLogicalThing` | ✅ Existe |
| `modelo/operaciones.ts:11-12` | `commands/edit-alias.ts:5-30` | ✅ Existe |
| `modelo/operaciones/helpers.ts:11` | `commands/edit-alias.ts:5-30` | ✅ Existe |
| `modelo/operaciones/refinamiento/descomposicion.ts:28` | `LogicalPart/OpmLogicalThing.ts` | ✅ Existe |

Archivos en `modelo/tipos/` con cobertura de citas: 6/11 = 54% (alto para un dominio donde la SSOT es la autoridad y opm-extracted es respaldo).

### 4.3 OPL (`app/src/opl/`) — ✅ EPICA-50 al 100% con citas SSOT

- `app/src/opl/generar.ts:32` cita `LogicalTextModule.ts:36-47` (verificado: existe).
- `app/src/opl/generadores/duracionMetadata.ts:13` cita `LogicalPart/components/aliasing-module.ts:5-32` (verificado).
- `app/src/opl/generadores/refsHints.ts:10` cita `LogicalTextModule.ts:36-47` (verificado).
- EPICA-50 acumula 26 citas SSOT (`[OPL-ES …]`).

Archivos sin cita explícita a opm-extracted (`abanico.ts`, `designaciones.ts`, `estructural.ts`, `plegado.ts`, `procedural.ts`): **no es violación** — todos citan SSOT (`[OPL-ES x.y.z]`) que es la autoridad para OPL.

### 4.4 Reglas de consistency / validaciones — 🟡 Brecha latente acotada por HU

Inventario `opm-extracted/src/app/models/consistency/`:

| Archivo | LOC | Reglas (clases) |
|---|---|---|
| `behavioral.rules.ts` | 1232 | **40** subclases de `BehaviouralRule` |
| `structural.rules.ts` | 299 | **11** subclases de `StructuralRule` |
| `consistional.rules.ts` | 145 | ~5 |
| `bringConnectedRules.ts` | 182 | ~7 |
| `changeActions/*` | varios | ~3 |
| **Total disponible** | ~1858 | **~60 reglas** |

Implementación actual `app/src/modelo/validaciones.ts` (453 LOC, 11 reglas):

| Regla en app/ | Equivalente en opm-extracted |
|---|---|
| `reglaProceduralNoObjetoObjeto` | `ObjectCantConnectToObjectWithProceduralLinks` ✅ |
| `reglaAgregacionMismaEsencia` | `PreventAggregationBetweenInformaticalToPhysical` + `AggregationBetweenPhysicaltoInformatical` ✅ |
| `reglaSubprocesoNoConectaAlPadre` | `ThingCannotConnectToFather` + `InzoomedProcessCannotConnectToIsSubProcess` ✅ |
| `reglaGeneralizacionMismoTipo` | (sin equivalente directo, regla SSOT) |
| `reglaEstructuralNoAceptaExtremoEstado` | `StateCannotConnectToFather*` (parcial) |
| `reglaEstructuralSinDuplicar` | `AlreadyConnectedWithStructural*` (parcial) |
| `reglaAgenteRequiereObjetoFisico` | (regla SSOT, no en opm-extracted como tal) |
| `reglaProcesoSinEntradaNiSalida` | (regla SSOT) |
| `reglaInstrumentoYAgenteSimultaneos` | (parcial) |
| `reglaSoloUnNivelDeInstanciacion` | `Semifoldinglinks` (parcial) |
| `reglaConsumoDobleMismoObjeto` (advertencia) | `LegalConsumptionWarning` (parcial) |

Reglas en opm-extracted **no implementadas** (sample): `AlreadyConnectedWithProcedural`, `CantConnectConsumed`/`CantConnectConsumed2`, `CantConnectBeforeCreated`/`CantConnectBeforeCreated2`, `CantConnectSelfInvocationForInzoomedProcess`, `CantConnectInzoomedProcessToItsChildrenWithInvocation`, `ExhibitionToPhysical`, `CannotLinkToValueTypeObject`, `CannotLinkToRequirementObject`, `SourceAndTargetOnSameOPD`.

**Interpretación bajo marco SSOT**: la pregunta correcta no es *"¿se portaron las 60?"* sino *"¿qué reglas piden las HU activas (EPICA-1c, EPICA-15) y MVP-α?"*. La brecha real solo es identificable mapeando HU vivas vs reglas faltantes (RF-3).

`validaciones.ts` no cita opm-extracted en su header — debería añadirse `// Refs: opm-extracted/src/app/models/consistency/{behavioral,structural}.rules.ts (referencia técnica de inspiración; SSOT = opm-iso-19450-es.md §Reglas)`.

### 4.5 Render (`app/src/render/jointjs/`) — ✅ Derivación con cita en archivos críticos

- `linkAssets.ts:64` cita `shared.ts:5908-5914` ✅
- `abanicoOverlay.ts:6` cita `shared.ts:5908-5912` ✅
- `handlers/seleccion.ts:24` cita `configuration/rappidEnviromentFunctionality/` ✅
- `handlers/helpers.ts:8` cita `configuration/rappidEnviromentFunctionality/` ✅

Otros archivos (`customShapes.ts`, `estadoTargets.ts`, `proyeccion.ts`, `autoinvocacionLoop.ts`, `agregacionBus.ts`): **divergencia arquitectónica esperada**. JointJS core ≠ Rappid; la lógica de proyección visual es propia. No constituye incumplimiento.

### 4.6 Dominios divergentes (`canvas/`, `store/`, `persistencia/`, `ui/`) — ✅ Divergencia legítima

| Dominio | Stack opm-extracted | Stack app/ | Cita esperada |
|---|---|---|---|
| `canvas/` | Rappid + Angular | JointJS core + Preact | No requiere cita opm-extracted |
| `store/` | Service Angular + RxJS | Zustand | No requiere cita opm-extracted (excepto `modelo.ts` que sí cita `model.service.ts:5-190`) |
| `persistencia/` | Firebase + json.model | Workspace local + IndexedDB-likely | Cita opcional (json.model.ts como referencia de schema) |
| `ui/` | Material + Angular dialogs | Preact components propios | No debe citar opm-extracted (política explícita) |

**0% de citas opm-extracted en `canvas/` y `persistencia/` no es red flag** — es la divergencia arquitectónica esperada. Lo exigible es: (a) cumplir SSOT donde aplica (semántica del modelo), y (b) coherencia con `tipos.ts` (SSOT nivel 2).

### 4.7 Importación OPX — ✅ Decisión limpia

`opm-extracted/src/app/ImportOPX/` (7 archivos, 95 KB, parser OPX completo) **no implementado en app/**. Coherente con EPICA-70 (Importación OPCAT 4.2 .opx) **descartada el 2026-05-05**, según memoria de proyecto y `04-MAPA.md`. No es deuda; es decisión arquitectónica explícita.

### 4.8 Limpieza Angular — ✅ Cumplimiento total

Búsquedas con resultado **0**:
- `@Component`, `@Injectable`, `@NgModule`, `@Directive`, `@Pipe`
- `MatDialog`, `MatSnackBar`, `BehaviorSubject`, `Subject` (RxJS), `Observable` (RxJS)
- `OnInit`, `ngOnInit`, `lifecycleHook`
- imports desde `@angular/*`

---

## 5. Red flags

### RF-1 (🟠 Media) — Paths errados a `Logical/AggregationLink.ts`

**Hecho**: 3 archivos citan `opm-extracted/src/app/models/Logical/AggregationLink.ts` que **no existe**. La ruta real es `opm-extracted/src/app/models/DrawnPart/Links/AggregationLink.ts`.

| Archivo | Línea | Cita errada |
|---|---|---|
| `app/src/modelo/operaciones/enlaces.ts` | 33 | `models/Logical/AggregationLink.ts (separación por familia)` |
| `app/src/modelo/tipos/enlace.ts` | 10-11 | `models/Logical/AggregationLink.ts`, `DrawnPart/Links/EffectLink.ts:117` |
| `app/src/modelo/tipos/abanico.ts` | 8 | `models/Logical/* (lógica de fan)` |

**Impacto**: trazabilidad rota; un agente o lector que siga la cita no llega al archivo.

**Fix**: reemplazar `Logical/AggregationLink.ts` → `DrawnPart/Links/AggregationLink.ts` en los 3 archivos. ~5 minutos.

### RF-2 (🟠 Media) — EPICA-30 (persistencia) sin citas SSOT en sus HU

**Hecho**: La épica `docs/historias-usuario-v2/epicas/epica-30-persistencia-save-load.md` tiene **0 citas SSOT** (`[V-…]`, `[Glos 3.x]`, `[OPL-ES …]`, `[Met §x]`, `[JOYAS §x]`) en sus HU, según muestreo del agente de cruce HU↔código.

**Impacto**: viola directamente `00-METODOLOGIA.md §6` que exige citas según tipo de HU (`opm-semantica` / `opcloud-ui` / `mixto`). HU-30.008 ("Persistir payload OPM íntegro") es `mixto` y debería citar `[Met §6]` (etapas SD) o estructura canónica de `tipos.ts`.

**Riesgo**: deriva de la lógica de serialización respecto al modelo canónico — en M0, donde la persistencia es kernel de fidelidad, esta brecha es la más material de las cuatro.

**Fix**:
1. Auditoría de las ~35 HU de EPICA-30: clasificar cada una como `opcloud-ui` puro (afordance) o `mixto` (toca payload).
2. Para `mixto`: añadir `[Met §6]` o cita a estructura específica de `tipos.ts`.
3. Documentar el resultado de la auditoría en la propia épica.

Esfuerzo: 1–2 horas de trabajo dirigido sobre una sola épica.

### RF-3 (🟡 Baja, requiere medición) — Delta consistency vs HU activas

**Hecho**: `validaciones.ts` cubre 11 reglas; `opm-extracted/consistency/` tiene ~60 reglas disponibles como referencia.

**Marco corregido**: el delta no se mide contra opm-extracted, sino contra las HU activas (especialmente EPICA-1c "validaciones" y EPICA-15 "enlaces avanzados") y contra SSOT (`opm-iso-19450-es.md §Reglas`).

**Procedimiento de medición** (no ejecutado aún en esta auditoría):
1. Listar HU activas/parciales/pendientes de EPICA-1c y EPICA-15 que pidan reglas semánticas.
2. Por cada HU, identificar qué regla(s) ISO 19450 y de comportamiento OPCloud son necesarias.
3. Comparar contra las 11 reglas implementadas → derivar lista de reglas faltantes **realmente exigidas** (no la diferencia bruta de 49).
4. Priorizar las faltantes en una HU/ronda dedicada.

**Probable resultado**: el delta real es 5–15 reglas (no 49), porque MVP-α al 91% sugiere que las reglas críticas para MVP ya están cubiertas. Las reglas tipo `LegalConsumptionWarning` o `CantConnectBeforeCreated` son candidatas naturales.

Esfuerzo: 2–4 h de auditoría dirigida.

### RF-4 (🟡 Baja, latente) — Wizard sin referencia a 8 PNGs canónicos

**Hecho**: `opm-extracted/assets/png/modelWizard/page{2,3,5,7,10.1,10.2,10.3,11}.png` están copiados en `assets/png/modelWizard/`, pero `app/src/ui/asistente/` **no los referencia** en código ni comentarios.

**Impacto**: cuando la HU del wizard se active, riesgo de divergencia visual respecto al referente OPCloud o de reinvención visual sin trazabilidad.

**Fix**: Cuando la HU del asistente entre en flujo, añadir referencia explícita en el componente correspondiente: `// Asset canónico: assets/png/modelWizard/pageN.png (espejo de opm-extracted/assets/png/modelWizard/)`.

Esfuerzo: trivial cuando la HU se active. Documentar en backlog.

---

## 6. Recomendaciones priorizadas

| ID | Acción | Prioridad | Esfuerzo | Beneficio |
|---|---|---|---|---|
| R1 | Corregir 3 paths errados (RF-1) | 🟠 P1 | XS — 5 min | Trazabilidad restaurada |
| R2 | Auditar y completar citas SSOT en EPICA-30 (RF-2) | 🟠 P1 | S — 1–2 h | Cumplimiento metodológico restablecido |
| R3 | Mapear reglas faltantes en `validaciones.ts` contra HU activas (RF-3) | 🟡 P2 | M — 2–4 h | Delta real medido; ronda futura priorizable |
| R4 | Añadir header `// Refs:` en `validaciones.ts` apuntando a `behavioral.rules.ts` y `structural.rules.ts` como referencia técnica | 🟡 P2 | XS — 5 min | Trazabilidad de la inspiración técnica |
| R5 | Linter de provenance SSOT (no opm-extracted) en CI: archivos de dominio semántico (`modelo/tipos/`, `opl/`, `validaciones.ts`) deben tener al menos una cita `[V-]`, `[Glos]`, `[OPL-ES]`, `[Met]` o `[JOYAS]` | 🟡 P3 | M — 3–6 h | Garantía continua de fidelidad |
| R6 | Documentar referencia a `assets/png/modelWizard/` cuando la HU del asistente entre a flujo (RF-4) | ⚪ Latente | XS | Fidelidad visual al activarse la HU |

**No recomendado**:
- Portar las 49 reglas faltantes de `behavioral.rules.ts` "para igualar opm-extracted". Marco equivocado: el techo lo definen SSOT y HU vivas, no opm-extracted bruto.
- Linter que exija citas `// Refs: opm-extracted/...` en todos los archivos. opm-extracted es nivel 3; trazabilidad opcional.

---

## 7. Apéndices

### A. Inventario `opm-extracted` (resumido)

- **349 archivos** OPM extraídos, ~165K LOC, 486 clases distintas, 7.8 MiB.
- Núcleo: `BasicOpmModel.ts`, `OpmModel.ts`, `OpmOpd.ts`, `json.model.ts`.
- Capas: `LogicalPart/` (3.7K LOC), `VisualPart/` (2.2K), `DrawnPart/` (~670K).
- Links: 13 clases en `DrawnPart/Links/` (~326 LOC).
- Consistency: `behavioral.rules.ts` (40), `structural.rules.ts` (11), `consistional.rules.ts`, `bringConnectedRules.ts`, `changeActions/*`. **Total ≈ 60 reglas / 1858 LOC**.
- Geometría/Rappid: `configuration/rappidEnviromentFunctionality/shared.ts` (6261 LOC) — markers SVG, halos, radios canónicos, transformaciones.
- OPL: `LogicalTextModule.ts` (94 LOC) + components (`aliasing-module`, `units-text-module`, `computation-module`, `StereotypeModule`, etc.).
- Algoritmos DCM/SysML: `services/dcm/algorithms/` (8), `exporters/` (5), `sysml-converters/` (7).
- Importación: `ImportOPX/` (7 archivos) — **no aplicable**, EPICA-70 descartada.
- Assets: 84 (73 SVG + 11 PNG) — **100% replicados**.

### B. Cobertura de citas opm-extracted por subdirectorio (con interpretación SSOT-céntrica)

| Subdirectorio | Total | Citan opm-extracted | Cobertura | Interpretación |
|---|---|---|---|---|
| `modelo/tipos/` | 11 | 6 | 54% | ✅ Apropiada para dominio de tipos |
| `serializacion/` | 10 | 4 | 40% | ✅ Citas en archivos críticos (`validarIntegridad`, `validarOpds`, `validarApariencias`, `validarNormalizacion`) |
| `modelo/operaciones/` | 8 | 2 | 25% | ⚠️ Inconsistente; podría subir a 50% |
| `opl/generadores/` | 8 | 2 | 25% | ✅ Citan SSOT `[OPL-ES]` (no medido aquí) |
| `render/jointjs/` | 14 | 2 | 14% | ✅ Citas en archivos derivados de geometría (`linkAssets`, `abanicoOverlay`, handlers); resto es divergencia JointJS-core |
| `store/` | 11 | 1 | 9% | ✅ `modelo.ts` cita; resto es Zustand puro (divergencia arquitectónica) |
| `modelo/` (raíz) | 24 | 3 | 12% | ✅ Citas en archivos clave; resto cubre lógica derivada de operaciones internas |
| `canvas/` | 3 | 0 | 0% | ✅ Divergencia arquitectónica esperada |
| `persistencia/` | 5 | 0 | 0% | ✅ Divergencia arquitectónica esperada (no Firebase) |
| `ui/` | 46 | 0 | 0% | ✅ Política explícita: no citar componentes Angular |

**Lectura correcta**: la cobertura **no es una métrica monotónica** ("más alto = mejor"). Es alta donde corresponde (tipos, serialización, OPL, geometría de enlaces) y baja donde corresponde (UI, store, canvas, persistencia). Esto es disciplina, no negligencia.

### C. Mapping reglas `validaciones.ts` ↔ `behavioral.rules.ts` / `structural.rules.ts`

(Ver §4.4 — tabla completa con equivalencias y reglas no implementadas.)

### D. Paths errados detallados

```
app/src/modelo/operaciones/enlaces.ts:33
  Cita errada: opm-extracted/src/app/models/Logical/AggregationLink.ts (separación por familia)
  Path real:   opm-extracted/src/app/models/DrawnPart/Links/AggregationLink.ts

app/src/modelo/tipos/enlace.ts:10
  Cita errada: opm-extracted/src/app/models/Logical/AggregationLink.ts
  Path real:   opm-extracted/src/app/models/DrawnPart/Links/AggregationLink.ts

app/src/modelo/tipos/enlace.ts:11
  Cita correcta: opm-extracted/src/app/models/DrawnPart/Links/EffectLink.ts:117 ✅

app/src/modelo/tipos/abanico.ts:8
  Cita errada (genérica): opm-extracted/src/app/models/Logical/* (lógica de fan)
  Path real:   opm-extracted/src/app/models/LogicalPart/* o DrawnPart/Links/* según el aspecto
```

### E. Referencias

- `opm-extracted/README.md` §"Política y licencia" (líneas 152–187)
- `docs/historias-usuario-v2/00-METODOLOGIA.md` §6 (jerarquía SSOT, citas obligatorias)
- `docs/historias-usuario-v2/06-PROVENANCE.md` §2 (no inventar funcionalidad ausente; reutilizar SVGs/dimensiones/OPL)
