# 21 — SSOT Visual Mapping

| Campo | Valor |
|-------|-------|
| Fecha | 2026-04-16 |
| Estado | **Activo** — gobierna T2 (Fase 2 JointJS) |
| Base normativa | `urn:fxsl:kb:opd-es` (gramática visual), `urn:fxsl:kb:opm-es` (núcleo conceptual) |
| Base operacional | ADR-003 (isomorfismo), ADR-008 (JointJS renderer) |
| Slice | T2 / Slice 2.0 |

## Propósito

Documento de cierre del Slice 2.0. Cruza el catálogo normativo visual extraído de la SSOT (`opm-ssot-es/opm-visual-es.md`) con los constructos usados por las 6 fixtures del suite de isomorfismo, y define el contrato de cobertura para los slices 2.1–2.5 de T2.

Toda decisión de implementación visual del renderer JointJS debe:

1. citar la sección normativa de SSOT que describe el constructo;
2. declarar explícitamente si rellena un gap (aspecto no normado por la SSOT);
3. alinear su nombre de módulo/shape con el nombre normativo en español.

## Gaps normativos declarados por la SSOT

Los siguientes aspectos **no están normados** por `opm-visual-es.md` y son convención de implementación libre:

| Aspecto | Normatividad SSOT |
|---------|-------------------|
| Colores de formas y enlaces | Informativos (§1.1b, V-63). Cualquier paleta es válida. |
| Dimensiones de Object, Process, State | No normadas. Sujetas a V-47 (legibilidad) y V-50 (≤20–25 cosas/OPD). |
| Tipografía (familia, tamaño, peso) | No normada. Delegada a `opl-es` en V-121. |
| Grosor exacto de "contorno grueso" / "doble borde" | No cuantificado. |
| Offset de sombra para esencia física | No normado. |
| Dimensión de markers (punta, piruleta, triángulo) | No normada. |
| Iconografía del árbol SD/OPDs | No normada. |
| Layout y routing de enlaces | Solo principios (V-51: sin oclusión, minimizar cruces). |

El style pack `iso-19450` (slice 2.2) toma decisiones de implementación **en esos gaps**, no redefine normas.

## Inventario normativo visual

### A. Shapes de Thing

| Constructo SSOT | Sección | Forma | Markers normativos | Estado en adapter |
|-----------------|---------|-------|--------------------|-------------------|
| **Objeto** (Object) | §1.1, §1.4 | rectángulo | contorno sólido=systemic / punteado=environmental (§1.2, V-1); sombra=physical / plano=informational (§1.3, V-1); contorno grueso si refinado (V-69); contorno persiste en todos los niveles de refinamiento (V-71) | ✅ **Slice 2.2 cerrado** — afiliación dashed, essence dropShadow, isRefined strokeWidth |
| **Proceso** (Process) | §1.1, §1.4 | elipse | mismas reglas de afiliación/esencia; elipse agrandada si contiene subprocesos (V-34) | ✅ **Slice 2.2 + 2.5 cerrado** — más elipse contenedora en in-zoom |
| **Estado** (State / rountangle) | §1.1, §2 | rectángulo redondeado interno al objeto | dispuestos horizontalmente en zona inferior (V-4, V-5); borde grueso=inicial; doble borde=final; flecha diagonal abierta=default; `...` en esquina inferior derecha=supresión (§1.8, §10.6) | ✅ **Slice 2.3 cerrado** — embedded rountangles, initial/final/default markers; doble borde geométrico real diferido |
| **System boundary** | — | **no existe como entidad visual** | ausencia normativa: la SSOT no define este constructo. La afiliación sistémica/ambiental se codifica por el contorno de cada thing individualmente (§1.2, V-1). Cualquier caja envolvente en UI es decoración no-normativa. | ✅ No implementado como entidad (decisión SSOT-respetada) |
| **Internal vs external vs environmental** | §10.3b | 3 ejes ortogonales | afiliación: contorno sólido/punteado (§1.2, V-1); persistencia del tipo de contorno en refinamiento (V-71); rol en OPD hijo: contenedor agrandado vs posicionado alrededor (V-79..V-85); esencia: sombra/plano (V-95) | ✅ **Slice 2.1 + 2.2 + 2.5 cerrado** — los 3 ejes visibles |

### B. Links procedurales

| Constructo SSOT | Sección | Marker destino | Marker origen | Estado en adapter |
|-----------------|---------|----------------|---------------|-------------------|
| **Consumo** (consumption) | §3.1 | punta de flecha cerrada | ninguno | ✅ **Slice 2.4 cerrado** |
| **Resultado** (result) | §3.1 | punta cerrada | ninguno | ✅ **Slice 2.4 cerrado** |
| **Efecto** (effect) | §3.1 | punta cerrada en ambos extremos | mismo | ✅ **Slice 2.4 cerrado** (bidireccional queda para slice futuro) |
| **Agente** (agent) | §3.3, §1.5 | **piruleta negra** (círculo relleno) | corchete cuadrado abierto | ✅ **Slice 2.4 cerrado** — lollipop-black |
| **Instrumento** (instrument) | §3.3, §1.5 | **piruleta blanca** (círculo vacío) | corchete cuadrado abierto | ✅ **Slice 2.4 cerrado** — lollipop-white |
| **Invocación** (invocation) | §9, §1.5 | **zigzag/rayo** con punta | — | ✅ **Slice 2.4 cerrado** — lightning path |
| **Excepción sobretiempo** (overtime) | §4.4 | marca `/` sobre la línea | — | ✅ **Slice 2.4 cerrado** |
| **Excepción subtiempo** (undertime) | §4.4 | marca `//` sobre la línea | — | ✅ **Slice 2.4 cerrado** |

### C. Links estructurales

Anatomía común: triángulo+línea. **Vértice apunta al refinable**, base conecta con refinadores (§1.7, V-3).

| Constructo SSOT | Sección | Marker | Estado en adapter |
|-----------------|---------|--------|-------------------|
| **Agregación-participación** | §1.7, §8.2 | triángulo negro sólido | ✅ **Slice 2.4 cerrado** — triangle-filled |
| **Exhibición-caracterización** | §1.7 | triángulo vacío con triángulo negro más pequeño dentro | ✅ **Slice 2.4 cerrado** — triangle-hollow + glyph ▲ Unicode |
| **Generalización-especialización** | §1.7 | triángulo vacío | ✅ **Slice 2.4 cerrado** — triangle-hollow |
| **Clasificación-instanciación** | §1.7 | triángulo vacío con círculo negro dentro | ✅ **Slice 2.4 cerrado** — triangle-hollow + glyph ● Unicode |
| **Tagged unidireccional** | §8.1 | punta abierta + etiqueta en itálica | ✅ **Slice 2.4 cerrado** — open-arrow |
| **Tagged bidireccional / recíproco** | §8.1 | arpones en ambos extremos | ⚠️ Pendiente — hoy open-arrow en ambos lados |
| **Colección incompleta** | §1.8 | barra horizontal corta bajo triángulo | ⚠️ Pendiente — sin ejercitarse en fixtures |

### D. Modificadores de Link

| Constructo SSOT | Sección | Representación | Estado en adapter |
|-----------------|---------|----------------|-------------------|
| **Fan AND** | §5.1 | enlaces separados sin arco (default, V-14) | ✅ Slice 2.3 cerrado — sin render, correcto |
| **Fan XOR** | §5.2 | **un arco discontinuo** en extremo convergente (V-16) | ✅ **Slice 2.3 cerrado** — badge XOR; arco geométrico real diferido |
| **Fan OR** | §5.3 | **dos arcos discontinuos concéntricos** | ✅ **Slice 2.3 cerrado** — badge OR con dash; arco geométrico diferido |
| **Fan probabilístico** | §5.8 | marca `Pr=p` sobre cada enlace (V-18: siempre XOR) | ⚠️ Pendiente — no ejercitado en fixtures |
| **Event marker (e)** | §4.1 | letra `e` sobre la línea, cerca del proceso | ✅ **Slice 2.3 cerrado** |
| **Condition marker (c)** | §4.2 | letra `c` sobre la línea, cerca del proceso | ✅ **Slice 2.3 cerrado** — soporta negated y condition_mode |
| **Multiplicidad** | §7, §1.8 | `?` / `*` / `+` / rangos, junto al extremo | ✅ **Slice 2.4 cerrado** — labels en pos 0.1 y 0.9 |
| **Path label** | §6 | texto sobre enlaces procedurales | ✅ **Slice 2.4 cerrado** — italics mid-link |

### E. Refinamiento

| Constructo SSOT | Sección | Indicador | Estado en adapter |
|-----------------|---------|-----------|-------------------|
| **In-zoom** (descomposición en nuevo OPD) | §10.3, §10.4 | padre: contorno grueso (V-33, V-69); hijo: elipse agrandada como contenedor con subprocesos dispuestos arriba→abajo (V-34, V-35, V-79) | ✅ **Slice 2.5 cerrado** — container embed + timeline vertical |
| **Unfolding** de objeto en nuevo OPD | §10.2, §10.3b | objeto padre con contorno grueso (V-69); rectángulo agrandado como contenedor en hijo (V-79) | ✅ **Slice 2.5 cerrado** — mismo layout para unfold containers |
| **Despliegue intradiagrama** (unfolding estructural sin OPD hijo) | §10.2 | no engrosa contorno (V-70) | ✅ Correcto — sin isRefined no hay engrosamiento |
| **Semi-folding** | §10.12 | íconos triangulares con nombre de parte **dentro del rectángulo del todo**; número junto al triángulo = refinadores ocultos (V-118) | ⚠️ Pendiente — no ejercitado en fixtures |
| **Supresión de estados** | §1.8, §10.6 | rountangle con `...` en esquina inferior derecha (V-86: computada bajo demanda) | ⚠️ Pendiente — se requiere computación on-demand en kernel |
| **SD-tree iconografía** | §15.1 | texto `SD`, `SD1`, `SD1.1` — **no hay iconografía normada** para árbol de OPDs | fuera de scope JointJS (vista de árbol, no de OPD) |

## Constructos ejercitados por las 6 fixtures

Datos extraídos programáticamente de los `.opmodel` (`tests/*.opmodel`).

### Cobertura de Thing

| Fixture | Objects | Processes | Systemic | Environmental | Physical | Informatical |
|---------|--------:|----------:|---------:|--------------:|---------:|-------------:|
| coffee-making | 6 | 4 | 10 | 0 | 10 | 0 |
| driver-rescuing | 10 | 5 | 14 | 1 | 14 | 1 |
| hospitalizacion-domiciliaria | 31 | 17 | 43 | 5 | 33 | 15 |
| hodom-v2 | 21 | 6 | 21 | 6 | 18 | 9 |
| ev-ams | 51 | 22 | 66 | 7 | 45 | 28 |
| hodom-hsc-v0 | 21 | 15 | 29 | 7 | 26 | 10 |

Conclusión: los 3 ejes (systemic/environmental, physical/informational, object/process) se ejercitan en todas las fixtures medianas y grandes.

### Cobertura de State

| Fixture | Estados | Initial | Final | Default |
|---------|--------:|--------:|------:|--------:|
| coffee-making | 4 | 2 | 2 | 2 |
| driver-rescuing | 4 | 2 | 1 | 0 |
| hospitalizacion-domiciliaria | 34 | 11 | 7 | 11 |
| hodom-v2 | 7 | 3 | 3 | 3 |
| ev-ams | 29 | 11 | 11 | 11 |
| hodom-hsc-v0 | 18 | 7 | 5 | 7 |

Las designaciones `initial` / `final` / `default` se ejercitan en todas las fixtures con estados.

### Cobertura de Link types (unión de las 6 fixtures)

**Procedurales ejercitados:**

- `agent` — 6/6 fixtures
- `instrument` — 6/6
- `consumption` — 6/6
- `result` — 6/6
- `effect` — 6/6
- `invocation` — 2/6 (hospitalizacion-dom, ev-ams)
- `exception` — 3/6 (hospitalizacion-dom, hodom-v2, hodom-hsc-v0)

**Estructurales ejercitados:**

- `aggregation` — 4/6 (no en coffee-making, no en hodom-hsc-v0)
- `exhibition` — 4/6 (no en coffee-making, no en hospitalizacion-dom)
- `generalization` — 2/6 (hospitalizacion-dom, ev-ams)
- `classification` — 2/6 (hospitalizacion-dom, ev-ams)
- `tagged` — 3/6 (driver-rescuing, hospitalizacion-dom, ev-ams)

**Tipos dudosos (posibles legacy aliases):**

- `input` — 1 caso en hospitalizacion-domiciliaria. Probablemente alias legacy de `consumption`. **Ver candidate-extensions #3.**
- `output` — 1 caso en hospitalizacion-domiciliaria. Probablemente alias legacy de `result`. **Ver candidate-extensions #3.**

### Cobertura de Fans y Modifiers

| Fixture | Fans | XOR | OR | AND | Diverging | Converging | Modifiers | Event | Condition |
|---------|-----:|----:|---:|----:|----------:|-----------:|----------:|------:|----------:|
| coffee-making | 0 | — | — | — | — | — | 0 | — | — |
| driver-rescuing | 0 | — | — | — | — | — | 0 | — | — |
| hospitalizacion-domiciliaria | 4 | 2 | 1 | 1 | 3 | 1 | 5 | 2 | 3 |
| hodom-v2 | 0 | — | — | — | — | — | 0 | — | — |
| ev-ams | 1 | 1 | 0 | 0 | 1 | 0 | 5 | 1 | 4 |
| hodom-hsc-v0 | 0 | — | — | — | — | — | 0 | — | — |

Los 3 tipos de fan (XOR/OR/AND) se ejercitan **solo en hospitalizacion-domiciliaria**. Modifiers event/condition también concentrados en hospitalizacion-dom y ev-ams.

**Gap de cobertura:** 4 de las 6 fixtures no ejercitan fans ni modifiers. Candidate-extensions #4 propone fixtures sintéticas mínimas.

### Cobertura de OPD tree depth

| Fixture | Profundidades |
|---------|---------------|
| coffee-making | SD (0), SD1 (1) |
| driver-rescuing | SD, SD1 |
| hospitalizacion-domiciliaria | SD, SD1, SD1.1, SD1.2, SD2, SD3 (hasta depth 2) |
| hodom-v2 | SD, SD1 |
| ev-ams | SD, SD1, SD1.1, SD1.1.1, SD1.2, SD1.2.1 (hasta depth 3) |
| hodom-hsc-v0 | SD, SD1 |

In-zoom multi-nivel se ejercita en ev-ams y hospitalizacion-dom. El slice 2.5 debe cubrir al menos depth 3 (ev-ams).

### Appearances internal vs external

Todas las fixtures tienen appearances con `internal: true` en OPDs hijos (rango 5–27). Esto es lo que consume la lógica de in-zoom containers.

## Contrato de slices T2

Con el cruce normativa ↔ cobertura, los slices siguientes quedan así:

### Slice 2.1 — Extender `VisualRenderSpec` (core)

**Debe exponer:**

- `states[]` — con campos `id`, `ownerThingId`, `label`, `initial`, `final`, `default`
- `fans[]` — con campos `id`, `operator` (`xor`|`or`|`and`), `direction` (`diverging`|`converging`), `members[]`
- `modifiers[]` — con `id`, `linkId`, `type` (`event`|`condition`)
- Campo por nodo: `isRefined: boolean` (codifica contorno grueso V-69)
- Campo por nodo: `inZoomContainerOf?: string` (si la elipse/rectángulo es contenedor in-zoom; referencia ID del padre in-zoomed)
- Campo por edge: `exceptionKind?: "overtime" | "undertime"`
- Campo por edge: `multiplicity?: string`
- Campo por edge: `pathLabel?: string`

**No debe:** introducir un `systemBoundary` como entidad (contra SSOT).

Actualizar `kernelToVisualRenderSpec` y `visual-render-verifier` consistentemente.

### Slice 2.2 — Style pack `iso-19450` (web)

Decisiones de implementación en los gaps normativos declarados arriba. Single source para:

- paletas de color por ejes (afiliación, esencia, kind)
- tamaños tipo-faz de Object/Process/State
- grosores (normal, grueso de refinamiento, doble borde)
- familia tipográfica y tamaños
- dimensiones de markers y arcos

Cada decisión comenta la sección SSOT ejercitada y, si corresponde, declara "gap SSOT rellenado por implementación".

### Slice 2.3 — Shapes restantes

- `state-shape` — rountangle + 3 designaciones + supresión
- `fan-shape` — arcos discontinuos XOR/OR + modo probabilístico
- `modifier-marker` — E/C como letra textual
- `internal-object` / `external-thing` — refactor sobre object-shape para exponer afiliación + rol internal/external
- (No se implementa `system-boundary`.)

### Slice 2.4 — Links completos

- Procedurales: markers ISO (lollipop negro/blanco, lightning, punta cerrada bidireccional, /, //)
- Estructurales: 4 markers de triángulo + tagged (arpones y punta abierta) + colección incompleta
- Path labels, multiplicidad

### Slice 2.5 — In-zoom containers

- Elipse/rectángulo agrandado con `embed()` JointJS
- Layout jerárquico arriba→abajo para secuencia implícita
- Contorno grueso en padre refinado
- Cobertura hasta depth 3 (ev-ams)

### Slice 2.6 — Snapshot tests

- JointJS graph JSON por fixture × 6
- Verificación contra `visual-render-verifier`
- Style pack test determinista

## Coverage matrix final

| Slice | Coffee | Driver | HospDom | HodomV2 | EVAMS | HSCv0 |
|-------|:------:|:------:|:-------:|:-------:|:-----:|:-----:|
| 2.1 spec-ext | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 2.2 style | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 2.3 states | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 2.3 fans | — | — | ✓ | — | ✓ | — |
| 2.3 modifiers | — | — | ✓ | — | ✓ | — |
| 2.4 proc links | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 2.4 struct links | — | ✓ | ✓ | — | ✓ | — |
| 2.4 exception | — | — | ✓ | ✓ | — | ✓ |
| 2.5 in-zoom | ✓ | ✓ | ✓✓ | ✓ | ✓✓✓ | ✓ |

✓✓ = depth 2. ✓✓✓ = depth 3.

## Relación con ADR-003 y ADR-008

- No redefine categorías 𝒫/𝒮/ℛ/𝒜/𝓛. Extiende la frontera ADR-008 I2 (`VisualRenderSpec` como única frontera kernel→visual) con más campos, sin crear caminos alternativos.
- Preserva Ley 4 de ADR-003: nada de lo aquí listado introduce dependencia layout→semántica.
- Subordinación explícita a SSOT normativa añadida como disciplina del proyecto. No requiere ADR nueva.

## Cierre del slice 2.0

Este documento + `candidate-extensions.md` + README de `docs/ssot/` actualizado cierran el Slice 2.0. La apertura de Slice 2.1 requiere: lectura de este mapping y confirmación de scope. Cada slice posterior debe citar sección(es) de SSOT que ejercita y actualizar la tabla "Estado en adapter" cuando cierre.

## Cierre T2 — 2026-04-17

Los 7 slices (2.0–2.6) cerraron. Commits de cada slice:

| Slice | Commit | Cobertura SSOT |
|-------|--------|-----------------|
| 2.0 | `af18667` | Mapping + candidate-extensions |
| 2.1 | `6c79d07` | VisualRenderSpec extension (states/fans/modifiers/refinement/exception/multiplicity) |
| 2.2 | `10be521` | Style pack `iso-19450` — V-71, V-1, V-69, §1.3, §2.2 |
| 2.3 | `f2f90a5` | state/fan/modifier shapes — §2.2, §5.1–§5.3, §4.1–§4.2 |
| 2.4 | `4441e18` | markers ISO + path label + multiplicity — §1.7, §3.3, §4.4, §6, §7, §8.1, §9 |
| 2.5 | `68c9ff1` | in-zoom container + layout jerárquico — §10.3, §10.4, V-34, V-35, V-79 |
| 2.6 | (pendiente) | snapshot tests + handoff update |

Gaps SSOT residuales (quedarán como candidate-extensions o slices futuros):
- Tagged bidireccional con arpones separados (§8.1) — hoy open-arrow en ambos lados.
- Colección incompleta barra horizontal (§1.8).
- Fan probabilístico `Pr=p` (§5.8) — no ejercitado en fixtures.
- Supresión de estados `...` (§1.8, §10.6) — requiere computación on-demand en kernel.
- Semi-folding (§10.12) — no ejercitado.
- Doble borde geométrico real de final-state (§2.2).
- Arco geométrico literal de fan XOR/OR (§5.2–§5.3) — hoy badge textual.
- Distribución horizontal de subprocesos en in-zoom con muchos miembros.

Apertura T3: `KernelPatchOperation` + drag-to-layout + context menu. Gate
T3 ya abierto desde T1 (24/24 isomorphism laws verdes).
