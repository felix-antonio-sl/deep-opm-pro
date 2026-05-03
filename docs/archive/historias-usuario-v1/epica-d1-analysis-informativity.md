---
epica: "EPICA-D1"
titulo: "Análisis — Calificación de Informatividad del Modelo (MFSP, INF, WINF, TWINF)"
doc_fuente: "opcloud-reverse/d1-analysis-informativity.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "S"
hu_emitidas: 16
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "DIAGNOSTICO-PILOTO-EPICA-10.md"
ultima_actualizacion: 2026-04-28
---

## Resumen

Esta épica cubre la segunda función analítica de la sección **Model Knowledge**: el **Model Informativity Grading (MIL/MIA)**. La feature evalúa cuán informativo es el modelo OPM a partir de su OPPL generado [Glos E1], clasificando cada oración en una categoría **MFSP** (Model Fundamental Specification Pattern), calculando una **puntuación INF** por oración vía **IEFs** (Informativity-Enhancing Factors), y agregando en métricas globales **WINF** (Weighted Informativity) y **TWINF** (Total Weighted Informativity).

El objetivo productivo es identificar **áreas sub-especificadas** del modelo (procesos sin input/output, precedencias faltantes, objetos sin estados) y guiar al modelador hacia un modelo más completo. Es el ancla cuantitativa del ciclo iterativo de refinamiento.

A diferencia de otras épicas del modelador core, **la feature vive completamente fuera del canvas OPD**: es un dashboard analítico con tablas, filtros y export Excel. No altera render ni persiste resultados dentro del modelo (el artefacto durable es el Excel descargado). Su valor categórico primario es **L (lente)** sobre el modelo + **X (integración externa)** para export.

Clase de afirmación dominante del doc fuente: **confirmado por transcripción**, con varios puntos `hipótesis` y `abierto` que se propagan como `requires-clarification` en las HU correspondientes.

## Tabla de HU de la épica

| ID | Título | Actor | Prioridad | Tamaño | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-D1.001 | Clasificar cada oración OPPL en una categoría MFSP fija | IA | S | M | W | [Glos E1] |
| HU-D1.002 | Calcular puntuación INF por oración vía IEFs | IA | S | L | W | [Glos E1] |
| HU-D1.003 | Agregar WINF por categoría MFSP | IA | S | S | W | — |
| HU-D1.004 | Calcular TWINF global del modelo | IA | S | S | W | — |
| HU-D1.005 | Calcular INF Avg como promedio ponderado por oración | IA | S | XS | W | — |
| HU-D1.006 | Contar oraciones OPPL totales como base de la calificación | IA | S | XS | W | [Glos E1] |
| HU-D1.007 | Ejecutar calificación bajo demanda con botón Run | IA | S | S | opcloud-ui | W |
| HU-D1.008 | Ver placeholder antes de ejecutar calificación | IA | C | XS | opcloud-ui | W |
| HU-D1.009 | Ver KPIs globales en tarjetas tras ejecución | IA | S | S | opcloud-ui | W |
| HU-D1.010 | Ver distribución MFSP como tabla agregada | IA | S | S | opcloud-ui | W |
| HU-D1.011 | Ver oraciones con INF individual en tabla detalle | IA | S | M | opcloud-ui | W |
| HU-D1.012 | Filtrar tabla detalle por categoría MFSP | IA | S | S | opcloud-ui | W |
| HU-D1.013 | Filtrar tabla detalle por umbral Min INF | IA | S | S | opcloud-ui | W |
| HU-D1.014 | Exportar calificación a Excel con tres hojas | IA | S | M | opcloud-ui | W |
| HU-D1.015 | Ejecutar ciclo iterativo de refinamiento comparando runs | IA | S | S | mixto | W |
| HU-D1.016 | Detectar áreas sub-especificadas a partir de distribución MFSP | IA | S | M | mixto | W |

Total: **16 historias de usuario**.

## Historias de usuario

### HU-D1.001 — Clasificar cada oración OPPL en una categoría MFSP fija

**Actor primario:** IA (analista de modelo).
**Actores secundarios:** RV (revisor).
**Tipo:** W.
**Nivel categórico:** L (lente sobre el OPPL) primario; C (config — vocabulario fijo).
**Superficie UI:** tabla-detalle-sentence-level (columna MFSP).
**Gesto canónico:** ninguno (clasificación automática al ejecutar calificación).

**Historia:**
> Como analista de modelo, quiero que cada oración del OPPL sea clasificada automáticamente en una categoría MFSP para entender la composición de mi modelo según el vocabulario canónico.

**Contexto de negocio:**
El **Model Fundamental Specification Pattern (MFSP)** es el vocabulario canónico de la calificación: 6 categorías fijas (`Meta`, `Precedence`, `Procedural`, `Structural`, `ThingDef`, `Unknown`). La clasificación es el primer paso del pipeline — sin categoría no hay agregación ni diagnóstico posible. El conjunto es cerrado y compartido entre la tabla agregada y el filtro de la tabla detalle; no se configura desde UI.

**Criterios de aceptación:**
- **Dado** un modelo con OPPL generado [Glos E1], **cuando** ejecuto la calificación, **entonces** cada oración recibe exactamente una categoría MFSP del conjunto `{Meta, Precedence, Procedural, Structural, ThingDef, Unknown}`.
- **Dado** una oración `Passenger is an environmental object.`, **cuando** se clasifica, **entonces** queda como `ThingDef` (sub-patrón `Object Definition`).
- **Dado** una oración `Entertaining consists of Audio Playing and Video Playing.`, **cuando** se clasifica, **entonces** queda como `Structural` (sub-patrón `Aggregation-Participation`).
- **Dado** una oración de invocación entre procesos, **cuando** se clasifica, **entonces** queda como `Procedural` (sub-patrón `Invocation Link`).
- **Dado** una oración que el clasificador no reconoce, **cuando** se procesa, **entonces** queda como `Unknown` (nunca se descarta silenciosamente).

**Reglas y restricciones:**
- Las 6 categorías MFSP son **fijas** — confirmado por transcripción: `those categories are fixed`.
- La columna MFSP de la tabla detalle muestra **sub-patrones** más finos (`Object Definition`, `State Set Definition`, `In-zooming`, `Invocation Link`, `Aggregation-Participation`, …) que se agregan a una de las 6 macro-categorías.
- Una oración no puede quedar sin clasificar: `Unknown` es el catch-all.

**Modelo de datos tocado:**
- `grading.sentence[i].mfsp` — enum `{Meta, Precedence, Procedural, Structural, ThingDef, Unknown}` — transitorio (resultado de run).
- `grading.sentence[i].sub_pattern` — string (p.ej. `"Object Definition"`) — transitorio.
- `grading.sentence[i].text` — string (oración OPPL original) — transitorio.

**Dependencias:**
- Bloqueada por: EPICA-50 (OPPL pane debe generar oraciones).
- Bloquea a: HU-D1.002 (el calificador INF opera sobre la categoría).
- Bloquea a: HU-D1.003, HU-D1.010 (agregación por MFSP).
- Bloquea a: HU-D1.012 (filtro por categoría).

**Integraciones:**
- Motor OPPL (`src/render/opl-renderer.ts` o equivalente): entrega oraciones normalizadas.
- Clasificador MFSP (nuevo módulo analítico): realiza la asignación.

**Notas de evidencia:**
- Fuente normativa: `opm-opl-es.md` [Glos E1] OPPL como representación bimodal del modelo.
- Fuente OPCloud: `opcloud-reverse/d1-analysis-informativity.md` §1, §6, §9.
- Frames: frame_00016, frame_00019, frame_00021, frame_00027.
- Transcripción: "each OPL sentence is classified into a MFSP category".
- Clase de afirmación: confirmado por transcripción (el mecanismo). **Hipótesis** sobre el conjunto completo de sub-patrones (§11 pregunta abierta).
- Etiqueta parcial: `requires-clarification` sobre sub-patrones no observados.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [informatividad, mfsp, clasificador, oppl, lente].

---

### HU-D1.002 — Calcular puntuación INF por oración vía IEFs

**Actor primario:** IA.
**Tipo:** W.
**Nivel categórico:** L (lente derivada — cálculo sin mutación del modelo).
**Superficie UI:** tabla-detalle-sentence-level (columna INF).
**Gesto canónico:** ninguno (cálculo automático al ejecutar calificación).

**Historia:**
> Como analista de modelo, quiero que cada oración OPPL reciba una puntuación INF numérica para cuantificar cuánto informa al modelo esa oración concreta.

**Contexto de negocio:**
La **puntuación INF (informatividad por oración)** es la unidad atómica de la calificación. Se calcula aplicando **IEFs (Informativity-Enhancing Factors, Factores de Mejora de Informatividad)** sobre la oración — modificadores que suben la puntuación cuando la oración aporta información no trivial (p.ej. estados múltiples, descomposición in-zoom, precedencias con condiciones). El rango observado es aproximadamente `0.042` (Object Definition simple) a `0.216` (In-zooming con descomposición múltiple).

**Criterios de aceptación:**
- **Dado** una oración clasificada, **cuando** se calcula el INF, **entonces** recibe un valor numérico `≥ 0` con al menos 3 decimales de precisión.
- **Dado** una oración `Object Definition` simple (sin estados, sin atributos), **cuando** se calcula el INF, **entonces** queda en el extremo bajo del rango observado (~`0.042`).
- **Dado** una oración `In-zooming` con múltiples sub-procesos y enlaces, **cuando** se calcula el INF, **entonces** queda en el extremo alto (~`0.180`–`0.216`).
- **Dado** dos oraciones con la misma categoría MFSP pero distinto detalle, **cuando** se calculan ambos INF, **entonces** la oración con más detalle tiene INF mayor o igual (monotonía).

**Reglas y restricciones:**
- El INF es determinístico: la misma oración sobre el mismo modelo produce el mismo INF.
- El cálculo no debe mutar el modelo (invariante de lente).
- La fórmula exacta y los pesos de cada IEF son **pregunta abierta** del doc fuente (§11): solo se conocen rangos observados, no la fórmula.

**Modelo de datos tocado:**
- `grading.sentence[i].inf` — float `≥ 0` — transitorio.
- `grading.sentence[i].iefs_applied` — lista de factores aplicados — transitorio (opcional, útil para drill-down).

**Dependencias:**
- Bloqueada por: HU-D1.001.
- Bloquea a: HU-D1.003, HU-D1.004, HU-D1.005, HU-D1.011, HU-D1.013.

**Integraciones:**
- Calificador INF (nuevo módulo): recibe oración clasificada, devuelve número.

**Notas de evidencia:**
- Fuente OPCloud: `opcloud-reverse/d1-analysis-informativity.md` §1, §6.
- Frames: frame_00019, frame_00021 (valores INF visibles en columna).
- Transcripción: "Informativity-Enhancing Factors" mencionados en el párrafo descriptivo.
- Clase de afirmación: confirmado por transcripción (existencia del mecanismo); **hipótesis** sobre fórmula exacta (§11).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamaño:** L (requiere diseño del calificador y calibración contra el rango observado).
**Etiquetas:** [informatividad, inf, iefs, calificador, lente, requires-clarification].

---

### HU-D1.003 — Agregar WINF por categoría MFSP

**Actor primario:** IA.
**Tipo:** W.
**Nivel categórico:** L.
**Superficie UI:** tabla-mfsp-distribution (columna WINF).
**Gesto canónico:** ninguno (cálculo automático tras clasificación y puntuación).

**Historia:**
> Como analista de modelo, quiero ver la suma ponderada de INF agrupada por categoría MFSP para identificar en qué pilar descansa la información del modelo.

**Contexto de negocio:**
**WINF (Weighted Informativity)** por categoría es la vista agregada que permite diagnóstico estructural: si el WINF de `Procedural` es alto pero el de `Precedence` es bajo, el modelo describe qué hace el sistema pero no en qué orden. Es el puente entre oraciones individuales y juicio global.

**Criterios de aceptación:**
- **Dado** el conjunto de oraciones clasificadas y con INF, **cuando** se agrega, **entonces** se produce una fila por cada una de las 6 categorías MFSP con `{count, winf}`.
- **Dado** la categoría `Procedural` tiene 43 oraciones con INF que suman `8.44`, **cuando** consulto la tabla, **entonces** veo `Procedural | 43 | 8.44`.
- **Dado** una categoría sin oraciones (p.ej. `Meta = 0`), **cuando** se agrega, **entonces** aparece con `count=0` y `winf=0.00` — no se omite la fila.
- **Dado** la suma de todos los `winf` por categoría, **cuando** se compara con TWINF, **entonces** son iguales (conservación).

**Reglas y restricciones:**
- Las 6 filas MFSP son fijas; aparecen siempre aunque estén vacías.
- Formato de presentación: 2 decimales para WINF, entero para count.
- Orden de filas: alfabético observado (`Meta, Precedence, Procedural, Structural, ThingDef, Unknown`).

**Modelo de datos tocado:**
- `grading.mfsp_distribution` — map `{mfsp: {count: int, winf: float}}` — transitorio.

**Dependencias:**
- Bloqueada por: HU-D1.001, HU-D1.002.
- Bloquea a: HU-D1.010, HU-D1.014, HU-D1.016.

**Integraciones:**
- Agregador analítico.

**Notas de evidencia:**
- Fuente OPCloud: `opcloud-reverse/d1-analysis-informativity.md` §3.3 tabla MFSP Distribution.
- Frames: frame_00016.
- Clase de afirmación: observado (valores exactos del ejemplo).

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [informatividad, winf, agregación, mfsp, lente].

---

### HU-D1.004 — Calcular TWINF global del modelo

**Actor primario:** IA.
**Tipo:** W.
**Nivel categórico:** L.
**Superficie UI:** tarjeta-kpi `TWINF (Total)`.
**Gesto canónico:** ninguno.

**Historia:**
> Como analista de modelo, quiero un único número que resuma la informatividad total del modelo para comparar runs o versiones de un vistazo.

**Contexto de negocio:**
**TWINF (Total Weighted Informativity)** es la "puntuación global" del modelo — un solo número que habilita la comparación ordinal: `modelo A = 18.68`, `modelo A' tras añadir precedencias = 21.5` → mejora. Es la métrica-llave del ciclo iterativo.

**Criterios de aceptación:**
- **Dado** un modelo con oraciones OPPL calificadas, **cuando** se calcula TWINF, **entonces** es igual a la suma de todos los INF individuales.
- **Dado** el ejemplo demo, **cuando** consulto `TWINF (Total)`, **entonces** veo `18.68` (formato 2 decimales).
- **Dado** un modelo vacío (sin OPPL), **cuando** se calcula, **entonces** `TWINF = 0` sin error.
- **Dado** TWINF y la suma de `winf` por categoría MFSP, **cuando** se comparan, **entonces** son iguales (invariante de conservación con HU-D1.003).

**Reglas y restricciones:**
- Formato: `XX.XX` con 2 decimales.
- En el ejemplo observado `TWINF == WINF (Overall)`. **Hipótesis** del doc fuente: en modelos con ponderación no-trivial podrían divergir, no observado (§11).
- Sigla `TWINF` se expone literal — parte del vocabulario del dashboard.

**Modelo de datos tocado:**
- `grading.twinf` — float — transitorio.

**Dependencias:**
- Bloqueada por: HU-D1.002.
- Bloquea a: HU-D1.005, HU-D1.009, HU-D1.014, HU-D1.015.

**Notas de evidencia:**
- Fuente OPCloud: `opcloud-reverse/d1-analysis-informativity.md` §1, §3.3.
- Frames: frame_00016 (`TWINF 18.68`).
- Clase de afirmación: observado (valor) + hipótesis (relación con WINF Overall).

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [informatividad, twinf, agregación, global, lente].

---

### HU-D1.005 — Calcular INF Avg como promedio ponderado por oración

**Actor primario:** IA.
**Tipo:** W.
**Nivel categórico:** L.
**Superficie UI:** tarjeta-kpi `INF Avg`.
**Gesto canónico:** ninguno.

**Historia:**
> Como analista de modelo, quiero ver el INF promedio por oración para entender la densidad informativa independiente del tamaño del modelo.

**Contexto de negocio:**
`INF Avg = TWINF / OPPL Sentences`. Normaliza por tamaño: un modelo grande con muchas oraciones triviales puede tener TWINF alto pero INF Avg bajo — indica que hay volumen pero poca densidad. Permite comparar calidad entre modelos de distinto tamaño.

**Criterios de aceptación:**
- **Dado** un modelo con `TWINF = 18.68` y `OPPL Sentences = 155`, **cuando** se calcula INF Avg, **entonces** es `18.68 / 155 ≈ 0.121` (3 decimales).
- **Dado** un modelo con `OPPL Sentences = 0`, **cuando** se calcula, **entonces** INF Avg es `0` o `N/A` (no división por cero silenciosa).
- **Dado** dos modelos con igual TWINF pero distinto conteo de oraciones, **cuando** comparo INF Avg, **entonces** el de menos oraciones tiene INF Avg mayor.

**Reglas y restricciones:**
- Formato: 3 decimales.
- División por cero: comportamiento no observado (§11 pregunta abierta) — asumir `N/A` o `0`.

**Modelo de datos tocado:**
- `grading.inf_avg` — float — transitorio (derivado).

**Dependencias:**
- Bloqueada por: HU-D1.004, HU-D1.006.

**Notas de evidencia:**
- Fuente OPCloud: `opcloud-reverse/d1-analysis-informativity.md` §3.3, §6.
- Frames: frame_00016 (`INF Avg 0.121`).
- Clase de afirmación: inferido (chequeo aritmético `18.68 / 155 ≈ 0.1205`).

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [informatividad, inf-avg, métrica, lente].

---

### HU-D1.006 — Contar oraciones OPPL totales como base de la calificación

**Actor primario:** IA.
**Tipo:** W.
**Nivel categórico:** L.
**Superficie UI:** tarjeta-kpi `OPPL Sentences`.
**Gesto canónico:** ninguno.

**Historia:**
> Como analista de modelo, quiero ver cuántas oraciones OPPL compone el modelo para contextualizar las métricas agregadas.

**Contexto de negocio:**
`OPPL Sentences` es la cuenta total; sirve como denominador de INF Avg (HU-D1.005) y como señal del tamaño del modelo. Es la primera métrica que cambia al añadir o quitar elementos: sin ella, TWINF parece abstracto.

**Criterios de aceptación:**
- **Dado** un modelo con 155 oraciones OPPL, **cuando** consulto la tarjeta, **entonces** muestra `155` (entero, sin decimales).
- **Dado** un modelo vacío, **cuando** consulto la tarjeta, **entonces** muestra `0`.
- **Dado** el conteo y la suma de `count` en la tabla MFSP Distribution, **cuando** se comparan, **entonces** son iguales (invariante de cobertura: toda oración clasificada en una categoría).

**Reglas y restricciones:**
- Formato: entero.
- El conteo incluye oraciones clasificadas como `Unknown`.

**Modelo de datos tocado:**
- `grading.opl_sentences_count` — int — transitorio.

**Dependencias:**
- Bloqueada por: EPICA-50 (OPPL pane).

**Notas de evidencia:**
- Fuente normativa: `opm-opl-es.md` [Glos E1] OPPL como representación bimodal.
- Fuente OPCloud: `opcloud-reverse/d1-analysis-informativity.md` §3.3.
- Frames: frame_00016 (`OPL Sentences 155`).
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [informatividad, oppl, conteo, métrica].

---

### HU-D1.007 — Ejecutar calificación bajo demanda con botón Run

**Actor primario:** IA.
**Tipo:** opcloud-ui.
**Nivel categórico:** U (acción UI); L (dispara el pipeline).
**Superficie UI:** botón `Run Model Grading`.
**Gesto canónico:** clic.

**Historia:**
> Como analista de modelo, quiero disparar la calificación manualmente con un botón para controlar cuándo se consume cómputo y tener un resultado reproducible.

**Contexto de negocio:**
El análisis no es automático porque el tiempo depende del tamaño del modelo (confirmado por transcripción: `the larger the model the longer it will take`). Ofrecer un gesto explícito respeta el flujo del modelador: se trabaja en el modelo, se ejecuta calificación al cerrar un ciclo, se evalúa. También evita consumir cómputo innecesario al entrar a la pantalla.

**Criterios de aceptación:**
- **Dado** que entro a la vista `Model Informativity Grading`, **cuando** la veo sin haber hecho clic en Run, **entonces** el área de resultados muestra el placeholder (ver HU-D1.008).
- **Dado** que hago clic en `Run Model Grading`, **cuando** se procesa, **entonces** se ejecuta el pipeline completo (clasificación → puntuación → agregación) sobre el OPPL actual.
- **Dado** que la calificación terminó, **cuando** el resultado aparece, **entonces** se renderizan las 4 tarjetas KPI, la tabla MFSP Distribution y la tabla Sentence-Level Informativity.
- **Dado** que la calificación está en curso (modelo grande), **cuando** miro la UI, **entonces** **pregunta abierta**: no se observó indicador de progreso en los frames.

**Reglas y restricciones:**
- El botón `Run Model Grading` está siempre activo (no gated por estado previo).
- Cada ejecución es independiente — no hay cacheo visible entre runs (§11 pregunta abierta sobre reutilización de OPPL).
- El resultado actual reemplaza al anterior sin confirmación.

**Modelo de datos tocado:**
- `grading.last_run_at` — timestamp — transitorio (útil para comparación manual).

**Dependencias:**
- Bloquea a: HU-D1.009, HU-D1.010, HU-D1.011.

**Integraciones:**
- Motor OPPL: se consume el OPPL actual al momento de ejecutar.
- Pipeline analítico completo.

**Notas de evidencia:**
- Fuente OPCloud: `opcloud-reverse/d1-analysis-informativity.md` §3.2.
- Frames: frame_00013 (pre-run), frame_00016 (post-run).
- Transcripción: confirma que el tiempo escala con el tamaño.
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [informatividad, run, ui, análisis-on-demand].

---

### HU-D1.008 — Ver placeholder antes de ejecutar calificación

**Actor primario:** IA.
**Actores secundarios:** MN (primera exposición).
**Tipo:** opcloud-ui.
**Nivel categórico:** U.
**Superficie UI:** área-de-resultados (placeholder).
**Gesto canónico:** ninguno.

**Historia:**
> Como analista de modelo, quiero ver un mensaje explícito que me indique que debo ejecutar la calificación para entender cómo activar la vista.

**Contexto de negocio:**
Sin placeholder, el panel vacío confunde al usuario (¿está cargando? ¿roto? ¿mi modelo no tiene OPPL?). Un texto claro que invita a la acción (`Click Run Model Grading to analyze the model's OPL and see metrics here.`) resuelve la ambigüedad con el mínimo costo visual.

**Criterios de aceptación:**
- **Dado** que entro a la vista por primera vez, **cuando** miro el área de resultados, **entonces** veo el texto `Click Run Model Grading to analyze the model's OPL and see metrics here.`
- **Dado** que ejecuté la calificación, **cuando** el resultado se renderiza, **entonces** el placeholder desaparece.
- **Dado** que navego fuera de la vista y vuelvo, **cuando** regreso, **entonces** **pregunta abierta**: no observado si el resultado previo se mantiene o si vuelve a placeholder (§11).

**Reglas y restricciones:**
- El placeholder se muestra solo antes del primer run de la sesión.
- Texto exacto observado en frames frame_00005, frame_00009, frame_00013.

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Relaciona: HU-D1.007.

**Notas de evidencia:**
- Fuente OPCloud: `opcloud-reverse/d1-analysis-informativity.md` §2 (tabla inventario UI), §3.1.
- Frames: frame_00005, frame_00009, frame_00013.
- Clase de afirmación: observado.

**Prioridad:** C.
**Tamaño:** XS.
**Etiquetas:** [informatividad, ui, placeholder, feedback].

---

### HU-D1.009 — Ver KPIs globales en tarjetas tras ejecución

**Actor primario:** IA.
**Tipo:** opcloud-ui.
**Nivel categórico:** V (vista derivada del modelo).
**Superficie UI:** panel-kpi-cards (4 tarjetas horizontales).
**Gesto canónico:** ninguno.

**Historia:**
> Como analista de modelo, quiero ver las 4 métricas globales en tarjetas horizontales para captar el estado del modelo de un vistazo sin leer tablas.

**Contexto de negocio:**
El patrón de tarjetas KPI (etiqueta pequeña gris sobre valor grande negro) es la convención observada en OPCloud para métricas de top-level. Exponer TWINF, WINF, INF Avg y OPPL Sentences en cuatro tarjetas paralelas permite lectura instantánea y sienta la base para comparación entre runs (HU-D1.015).

**Criterios de aceptación:**
- **Dado** que la calificación terminó, **cuando** miro el panel superior, **entonces** veo 4 tarjetas: `TWINF (Total)`, `WINF (Overall)`, `INF Avg`, `OPPL Sentences`, en ese orden.
- **Dado** una tarjeta, **cuando** la leo, **entonces** tiene etiqueta gris pequeña arriba y valor grande negro abajo.
- **Dado** el ejemplo demo, **cuando** consulto las tarjetas, **entonces** muestran `18.68`, `18.68`, `0.121`, `155` respectivamente.
- **Dado** que re-ejecuto la calificación tras cambios, **cuando** termina, **entonces** las tarjetas se actualizan con los nuevos valores.

**Reglas y restricciones:**
- Orden fijo observado: TWINF → WINF → INF Avg → OPPL Sentences.
- Sin colorización condicional (semáforo) según valor — todo neutro sobre blanco (convención §9).
- Convención tipográfica: etiqueta pequeña gris + valor grande negro.

**Modelo de datos tocado:**
- Consume `grading.twinf`, `grading.winf_overall`, `grading.inf_avg`, `grading.opl_sentences_count`.

**Dependencias:**
- Bloqueada por: HU-D1.004, HU-D1.005, HU-D1.006.
- Bloqueada por: HU-D1.007.

**Notas de evidencia:**
- Fuente OPCloud: `opcloud-reverse/d1-analysis-informativity.md` §2 inventario UI, §3.3, §9 (convención tipográfica).
- Frames: frame_00016, frame_00027.
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [informatividad, ui, kpi, dashboard, vista].

---

### HU-D1.010 — Ver distribución MFSP como tabla agregada

**Actor primario:** IA.
**Tipo:** opcloud-ui.
**Nivel categórico:** V.
**Superficie UI:** tabla-mfsp-distribution.
**Gesto canónico:** ninguno.

**Historia:**
> Como analista de modelo, quiero ver la tabla MFSP Distribution con `Count` y `WINF` por categoría para entender en qué pilar del modelo está concentrada la información.

**Contexto de negocio:**
La tabla es el **diagnóstico estructural** del modelo. Mirar fila por fila revela desbalances: `Meta = 0` puede ser normal, pero `Precedence = 6` cuando `Procedural = 43` es la señal clásica de "muchos procesos descritos pero poca secuenciación" — el diagnóstico que el narrador usa en la transcripción.

**Criterios de aceptación:**
- **Dado** que la calificación terminó, **cuando** miro la tabla MFSP Distribution, **entonces** veo 3 columnas `MFSP | Count | WINF` y 6 filas fijas (Meta, Precedence, Procedural, Structural, ThingDef, Unknown).
- **Dado** la tabla se renderiza, **cuando** leo una fila, **entonces** veo categoría + conteo entero + WINF con 2 decimales.
- **Dado** el ejemplo demo, **cuando** miro la fila `Procedural`, **entonces** veo `Procedural | 43 | 8.44`.
- **Dado** una categoría con count 0, **cuando** la miro, **entonces** veo `0` y `0.00` (no vacío, no oculto).
- **Dado** la tabla, **cuando** sumo todos los `Count`, **entonces** es igual a `OPPL Sentences` (invariante de cobertura).

**Reglas y restricciones:**
- Las 6 filas son fijas; orden alfabético.
- Sin colorización condicional.
- No clickeable (no drill-down desde aquí — eso ocurre en tabla detalle con filtro).

**Modelo de datos tocado:**
- Consume `grading.mfsp_distribution`.

**Dependencias:**
- Bloqueada por: HU-D1.003.
- Bloqueada por: HU-D1.007.

**Notas de evidencia:**
- Fuente OPCloud: `opcloud-reverse/d1-analysis-informativity.md` §3.3 tabla.
- Frames: frame_00016.
- Transcripción: diagnóstico basado en la distribución.
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [informatividad, ui, tabla, distribución, mfsp, vista].

---

### HU-D1.011 — Ver oraciones con INF individual en tabla detalle

**Actor primario:** IA.
**Tipo:** opcloud-ui.
**Nivel categórico:** V.
**Superficie UI:** tabla-sentence-level-informativity.
**Gesto canónico:** ninguno (scroll vertical).

**Historia:**
> Como analista de modelo, quiero ver cada oración OPPL con su categoría MFSP y su INF en una tabla scrollable para hacer drill-down desde la métrica global hasta la oración individual.

**Contexto de negocio:**
El drill-down oración-por-oración es el núcleo pedagógico: permite al modelador ver **qué oración concreta** está bajando el promedio (`Object Definition` con INF bajo = objeto pobremente definido) y **qué oración concreta** está subiéndolo (`In-zooming` con INF alto = descomposición rica). Es la base del diagnóstico accionable.

**Criterios de aceptación:**
- **Dado** que la calificación terminó, **cuando** bajo al panel `Sentence-Level Informativity`, **entonces** veo una tabla con 4 columnas: `# | OPPL Sentence | MFSP | INF`.
- **Dado** la tabla tiene muchas filas (155 en el ejemplo), **cuando** navego, **entonces** puedo hacer scroll vertical.
- **Dado** una fila, **cuando** la leo, **entonces** veo índice entero, oración OPPL completa, sub-patrón MFSP (p.ej. `Object Definition`), e INF con 3 decimales.
- **Dado** filas con distintos sub-patrones, **cuando** miro la columna MFSP, **entonces** veo los sub-patrones observados (`Object Definition`, `State Set Definition`, `In-zooming`, `Invocation Link`, `Aggregation-Participation`, …).
- **Dado** filas con distintos INF, **cuando** miro la columna INF, **entonces** los valores están en el rango `[0, ~0.25]` observado.

**Reglas y restricciones:**
- La columna MFSP muestra el **sub-patrón** (granular) — no la macro-categoría.
- Las macro-categorías son las que aparecen en la tabla MFSP Distribution y en el filtro de esta misma tabla (HU-D1.012).
- Sin colorización; texto neutro.
- **Abierto** (§11): no observado si la tabla soporta hover/clic para navegar de oración a elemento del OPD. Ver HU candidata más abajo.

**Modelo de datos tocado:**
- Consume `grading.sentences[]` con `{index, text, mfsp_sub, mfsp_macro, inf}`.

**Dependencias:**
- Bloqueada por: HU-D1.001, HU-D1.002.
- Bloqueada por: HU-D1.007.
- Bloquea a: HU-D1.012, HU-D1.013.

**Integraciones:**
- Posible integración futura con OPD canvas (hover → highlight elemento). **No implementada en OPCloud observado** (§10 del doc fuente: la feature no altera el canvas).

**Notas de evidencia:**
- Fuente OPCloud: `opcloud-reverse/d1-analysis-informativity.md` §2, §3.3, §9 correspondencia MFSP↔primitiva visual.
- Frames: frame_00019 (oraciones 1-12), frame_00021 (filtro Precedence), frame_00027 (filtro Structural).
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [informatividad, ui, tabla-detalle, sentence-level, drill-down].

---

### HU-D1.012 — Filtrar tabla detalle por categoría MFSP

**Actor primario:** IA.
**Tipo:** opcloud-ui.
**Nivel categórico:** U.
**Superficie UI:** dropdown `MFSP` sobre tabla detalle.
**Gesto canónico:** selección de dropdown.

**Historia:**
> Como analista de modelo, quiero filtrar la tabla detalle por una categoría MFSP específica para aislar las oraciones de ese tipo y enfocar el análisis.

**Contexto de negocio:**
El filtro MFSP es el gesto de drill-down por categoría. Después de ver en la tabla MFSP Distribution que `Precedence` tiene WINF bajo, el modelador filtra por `Precedence` para examinar exactamente cuáles 6 oraciones hay y cómo mejorarlas. Es el puente operativo entre diagnóstico y acción.

**Criterios de aceptación:**
- **Dado** que la calificación terminó, **cuando** abro el dropdown `MFSP`, **entonces** veo las opciones `All, ThingDef, Structural, Procedural, Precedence, Meta, Unknown`.
- **Dado** que selecciono `Precedence`, **cuando** se aplica el filtro, **entonces** la tabla detalle muestra solo oraciones con macro-categoría `Precedence`.
- **Dado** que selecciono `All`, **cuando** se aplica, **entonces** todas las oraciones vuelven a aparecer.
- **Dado** que el filtro está activo y combino con `Min INF` (HU-D1.013), **cuando** miro la tabla, **entonces** se aplica intersección de ambos filtros.
- **Dado** que exporto con `Download Grades` (HU-D1.014), **cuando** el filtro está activo, **entonces** la hoja `Sentences` del Excel respeta el filtrado (confirmado por transcripción).

**Reglas y restricciones:**
- Default: `All`.
- Los valores del dropdown son fijos — coinciden exactamente con las 6 macro-categorías MFSP más `All`.
- El filtro opera sobre la **macro-categoría**, no sobre el sub-patrón.

**Modelo de datos tocado:**
- `ui.filter.mfsp` — enum `All | Meta | Precedence | Procedural | Structural | ThingDef | Unknown` — transitorio (estado UI).

**Dependencias:**
- Bloqueada por: HU-D1.011.
- Relaciona: HU-D1.013 (composición), HU-D1.014 (exporta filtrado).

**Notas de evidencia:**
- Fuente OPCloud: `opcloud-reverse/d1-analysis-informativity.md` §2, §3.4, §5.
- Frames: frame_00021 (filtro `Precedence`), frame_00027 (filtro `Structural`).
- Transcripción: `according to your filtering` para Excel.
- Clase de afirmación: observado + confirmado por transcripción.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [informatividad, ui, filtro, mfsp, drill-down].

---

### HU-D1.013 — Filtrar tabla detalle por umbral Min INF

**Actor primario:** IA.
**Tipo:** opcloud-ui.
**Nivel categórico:** U.
**Superficie UI:** input numérico `Min INF` sobre tabla detalle.
**Gesto canónico:** escritura de valor + Enter/blur.

**Historia:**
> Como analista de modelo, quiero fijar un umbral mínimo de INF para ocultar oraciones con aporte trivial y concentrarme en las oraciones con mayor contenido informativo.

**Contexto de negocio:**
El umbral `Min INF` es el filtro cuantitativo complementario al filtro cualitativo MFSP. Permite responder preguntas como "¿cuáles son las oraciones con INF > 0.15 que más informan mi modelo?" o "¿qué pasa si escondo las oraciones con INF < 0.05?" El filtro responde al uso declarado en la transcripción.

**Criterios de aceptación:**
- **Dado** el input `Min INF`, **cuando** lo miro inicialmente, **entonces** tiene valor `0` (default observado).
- **Dado** que ingreso `0.1`, **cuando** se aplica, **entonces** la tabla detalle muestra solo oraciones con `INF ≥ 0.1`.
- **Dado** que combino `Min INF = 0.1` con filtro MFSP `Precedence`, **cuando** ambos están activos, **entonces** se aplica intersección.
- **Dado** que ingreso un valor mayor al INF máximo observado, **cuando** se aplica, **entonces** la tabla queda vacía (**abierto** en §11 doc fuente — estado vacío no observado).
- **Dado** que exporto con filtro `Min INF` activo, **cuando** genero el Excel, **entonces** la hoja `Sentences` respeta el umbral.

**Reglas y restricciones:**
- Default: `0`.
- Admite valores fraccionarios (rango observado va de 0 a ~0.25). **Pregunta abierta** (§11): ¿admite solo enteros o fraccionarios? Dado el rango observado, debe admitir fraccionarios.
- Valores negativos: comportamiento no definido; asumir saneo a `0`.
- Sin validación explícita observada — input numérico estándar.

**Modelo de datos tocado:**
- `ui.filter.min_inf` — float `≥ 0` — transitorio.

**Dependencias:**
- Bloqueada por: HU-D1.011.
- Relaciona: HU-D1.012, HU-D1.014.

**Notas de evidencia:**
- Fuente OPCloud: `opcloud-reverse/d1-analysis-informativity.md` §2, §3.4, §5.
- Frames: frame_00016, frame_00021, frame_00027 (input visible con valor 0).
- Transcripción: uso combinado categoría + umbral.
- Clase de afirmación: observado + abierto sobre tipo de valor.
- Etiqueta: `requires-clarification` sobre tipo numérico admitido.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [informatividad, ui, filtro, umbral, drill-down, requires-clarification].

---

### HU-D1.014 — Exportar calificación a Excel con tres hojas

**Actor primario:** IA.
**Actores secundarios:** RV (revisor externo), AO (admin organización).
**Tipo:** opcloud-ui.
**Nivel categórico:** X (integración externa — export).
**Superficie UI:** botón `Download Grades (Excel)`.
**Gesto canónico:** clic.

**Historia:**
> Como analista de modelo, quiero exportar la calificación completa a un archivo Excel con tres hojas para compartir el diagnóstico fuera del modelador y archivarlo junto al modelo.

**Contexto de negocio:**
El Excel es el **único artefacto durable** de la calificación (no se persiste dentro del modelo — ver hipótesis §6). Las tres hojas `Totals | MFSP Distribution | Sentences` replican la estructura del dashboard, permitiendo análisis offline, comparación manual entre runs, y entrega a stakeholders que no usan el modelador.

**Criterios de aceptación:**
- **Dado** que la calificación terminó, **cuando** hago clic en `Download Grades (Excel)`, **entonces** se descarga un archivo con nombre `<ModelName>_grading.xlsx`.
- **Dado** el archivo descargado, **cuando** lo abro, **entonces** tiene exactamente tres hojas: `Totals`, `MFSP Distribution`, `Sentences`.
- **Dado** la hoja `Totals`, **cuando** la leo, **entonces** contiene las 4 métricas globales (TWINF, WINF, INF Avg, OPPL Sentences).
- **Dado** la hoja `MFSP Distribution`, **cuando** la leo, **entonces** replica la tabla agregada con columnas `MFSP | Count | WINF`.
- **Dado** la hoja `Sentences`, **cuando** los filtros MFSP y Min INF están activos en la UI, **entonces** la hoja contiene **solo las oraciones que pasan el filtro** (confirmado por transcripción: `according to your filtering`).
- **Dado** no hay filtros activos, **cuando** exporto, **entonces** la hoja `Sentences` contiene las 155 oraciones (todas).

**Reglas y restricciones:**
- Formato: `.xlsx` (Excel moderno).
- Nombre de archivo: `<ModelName>_grading.xlsx` con el nombre del modelo como prefijo.
- Las 3 hojas son fijas; no se configuran columnas ni formatos.
- El export es **stateless**: no deja traza en el modelo (consistente con §6 hipótesis).
- **Abierto** (§11): no observado export a otros formatos (CSV, JSON). Solo Excel.

**Modelo de datos tocado:**
- Ninguno persistente. El archivo es un snapshot de la última calificación.

**Dependencias:**
- Bloqueada por: HU-D1.007 (requiere calificación ejecutada).
- Relaciona: HU-D1.012, HU-D1.013 (aplican al filtrado exportado).

**Integraciones:**
- Motor de export XLSX (librería externa, p.ej. SheetJS o equivalente).
- Sistema de archivos del navegador para descarga.

**Notas de evidencia:**
- Fuente OPCloud: `opcloud-reverse/d1-analysis-informativity.md` §2, §3.5, §7.
- Frames: frame_00024 (archivo abierto, hoja `Totals` visible, tabs `Totals / MFSP Distribution / Sentences` en pie).
- Transcripción: confirma 3 hojas y respeto del filtrado.
- Clase de afirmación: observado + confirmado.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [informatividad, export, excel, reporte, integración-externa].

---

### HU-D1.015 — Ejecutar ciclo iterativo de refinamiento comparando runs

**Actor primario:** IA.
**Actores secundarios:** MN (modelador novato — beneficiario pedagógico).
**Tipo:** mixto.
**Nivel categórico:** L (lente comparativa); C (roadmap).
**Superficie UI:** reutiliza `Run Model Grading` + comparación externa (Excel).
**Gesto canónico:** ciclo editar modelo → re-Run → comparar manual.

**Historia:**
> Como analista de modelo, quiero poder re-ejecutar la calificación tras editar el modelo para comparar métricas entre runs y validar que mis cambios elevan la informatividad.

**Contexto de negocio:**
El ciclo iterativo es el **outcome productivo** de toda la feature: sin posibilidad de comparar antes/después, la calificación sería decorativa. La comparación **actualmente es manual** (el usuario retiene el número anterior mentalmente o en un Excel). El doc fuente declara explícitamente que **comparar entre versiones** y **entre OPDs** está en el roadmap, no implementado. Esta HU captura el ciclo observable hoy y deja el comparador automático como HU candidata futura.

**Criterios de aceptación:**
- **Dado** que ejecuté calificación con `TWINF = 18.68`, **cuando** edito el modelo (p.ej. añado 3 precedencias faltantes) y vuelvo a la vista, **entonces** el resultado previo ya no es válido — debo re-ejecutar.
- **Dado** que re-ejecuto `Run Model Grading`, **cuando** termina, **entonces** veo el nuevo TWINF (esperado mayor si mis cambios agregaron contenido).
- **Dado** que quiero comparar, **cuando** consulto la UI, **entonces** **no hay historial automático**: la comparación es manual (retener número, o exportar Excel antes/después).
- **Dado** que exporté Excel pre-cambio y post-cambio, **cuando** comparo los archivos externamente, **entonces** veo el diff en TWINF, distribución MFSP y oraciones.

**Reglas y restricciones:**
- No hay historial persistente de runs previos (confirmado por ausencia en frames).
- La comparación automática inter-version e inter-OPD es **roadmap declarado** por la transcripción (§1), no implementado en los frames.
- Un modelo puede recibir ilimitados runs; cada uno reemplaza al anterior en pantalla.

**Modelo de datos tocado:**
- `grading.last_run_at` — timestamp — transitorio (útil para comparación manual).
- **HU candidata futura:** `grading_history[]` persistente con TWINF + timestamp por run, para habilitar diff automático.

**Dependencias:**
- Bloqueada por: HU-D1.007.
- Relaciona: HU-D1.014 (Excel como artefacto de comparación manual).

**Integraciones:**
- Ciclo editor-analizador: implícito en la arquitectura del modelador.

**Notas de evidencia:**
- Fuente OPCloud: `opcloud-reverse/d1-analysis-informativity.md` §3.6, §1 roadmap.
- Transcripción: `compare informativity between versions of the same model; between OPDs within the same model` (roadmap, no implementado).
- Clase de afirmación: confirmado por transcripción (ciclo manual actual + roadmap del comparador).
- Etiqueta: `requires-clarification` sobre implementación del comparador automático.

**Prioridad:** S.
**Tamaño:** S (el ciclo actual es solo re-Run; el comparador automático sería una HU futura de tamaño L).
**Etiquetas:** [informatividad, iteración, comparación-manual, diagnóstico, roadmap, requires-clarification].

---

### HU-D1.016 — Detectar áreas sub-especificadas a partir de distribución MFSP

**Actor primario:** IA.
**Actores secundarios:** MN (modelador novato — destinatario pedagógico), AD (autor de dominio).
**Tipo:** mixto.
**Nivel categórico:** L (lente diagnóstica) primario; C (presentación de sugerencias).
**Superficie UI:** tabla-mfsp-distribution + interpretación del modelador (sin UI automática).
**Gesto canónico:** lectura de distribución + decisión del modelador.

**Historia:**
> Como analista de modelo, quiero identificar áreas sub-especificadas comparando la distribución MFSP de mi modelo con patrones balanceados para saber dónde invertir esfuerzo de refinamiento.

**Contexto de negocio:**
Es el **outcome productivo más alto** de la épica: la calificación no existe por sí misma, existe para **guiar el refinamiento**. La transcripción muestra el diagnóstico canónico: `we can see that we have fewer precedence than other factors, so we may want to invest into that later on`. Esta HU formaliza ese razonamiento como capacidad esperada del producto — hoy queda en el usuario, pero es el campo fértil para sugerencias automáticas (HU candidata futura).

Señales observadas que indican sub-especificación:
- `Precedence = 0` o muy bajo → el modelo no describe orden; faltan `before / after` links.
- `Meta = 0` → puede ser ok (raro) o faltar metadata de sistema.
- `Unknown > 0` → hay oraciones que el clasificador no entiende; probable modelo irregular.
- `ThingDef` dominante sin `Procedural` → modelo estático sin dinámica.
- `Procedural` dominante sin `Structural` → procesos sueltos sin agregación.

**Criterios de aceptación:**
- **Dado** que ejecuto calificación y miro la tabla MFSP Distribution, **cuando** una categoría tiene count `0`, **entonces** puedo interpretar que esa dimensión del modelo está ausente.
- **Dado** que una categoría tiene count bajo relativo (p.ej. `Precedence = 6` vs `Procedural = 43`), **cuando** leo la distribución, **entonces** puedo identificar la asimetría.
- **Dado** que una oración aparece en categoría `Unknown`, **cuando** filtro por `Unknown` (HU-D1.012), **entonces** puedo inspeccionar y corregir.
- **Dado** que ajusto el modelo y re-ejecuto (HU-D1.015), **cuando** miro la nueva distribución, **entonces** la asimetría debería reducirse.
- **HU candidata futura:** mostrar sugerencias automáticas como `"Considera añadir precedencias entre procesos para elevar Precedence"` junto a la tabla. **No implementado** en OPCloud observado.

**Reglas y restricciones:**
- La detección es **interpretativa** — la UI no resalta ni sugiere automáticamente (esta es una oportunidad de diferenciación para el modelador de este repo).
- Patrones diagnósticos derivados de la transcripción son **heurísticos**, no formalizados en OPCloud.
- El filtro por `Unknown` (HU-D1.012) es la ruta operativa para convertir un diagnóstico agregado en acciones concretas.

**Modelo de datos tocado:**
- Lectura: `grading.mfsp_distribution`.
- **HU candidata futura:** `grading.suggestions[]` con recomendaciones heurísticas generadas desde la distribución.

**Dependencias:**
- Bloqueada por: HU-D1.003, HU-D1.010.
- Relaciona: HU-D1.012, HU-D1.015, EPICA-D0 (missing knowledge — complementaria, `goes hand with hand` por transcripción).

**Integraciones:**
- **EPICA-D0 — Identification of Missing Knowledge**: complementaria bajo Model Knowledge; las dos funciones juntas cubren "qué falta" (D0) + "cuán informativo es lo que hay" (D1). La transcripción confirma la relación pero **no hay integración de datos observable**.

**Notas de evidencia:**
- Fuente OPCloud: `opcloud-reverse/d1-analysis-informativity.md` §1, §3.3 diagnóstico, §7 integración con D0.
- Frames: frame_00016 distribución demo.
- Transcripción: `we can see that we have fewer precedence than other factors, so we may want to invest into that later on`; `goes hand with hand with identification of missing knowledge`.
- Clase de afirmación: confirmado por transcripción (el diagnóstico interpretativo); hipótesis sobre sugerencias automáticas.
- Etiqueta: `requires-clarification` sobre nivel de automatización esperado.

**Prioridad:** S.
**Tamaño:** M (la HU cubre la lectura interpretativa de la distribución; las sugerencias automáticas serían una HU candidata de tamaño L).
**Etiquetas:** [informatividad, diagnóstico, pedagógico, sub-especificación, mfsp, outcome-productivo, requires-clarification].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **QD1.1**: Fórmula exacta del INF y peso de cada IEF. Solo se conocen rangos observados (0.042 a 0.216). Bloquea calibración precisa de HU-D1.002.
- **QD1.2**: Definición precisa de WINF vs TWINF. En el ejemplo coinciden; hipótesis de divergencia en modelos con ponderación no-trivial no observada. Afecta HU-D1.004.
- **QD1.3**: Conjunto completo de sub-categorías MFSP. Se observan 5 sub-patrones (`Object Definition`, `State Set Definition`, `In-zooming`, `Invocation Link`, `Aggregation-Participation`). Faltan exhibition, participation, agent link, etc. Afecta granularidad de HU-D1.001 y HU-D1.011.
- **QD1.4**: Significado de `MIL/MIA`. Hipótesis: `Model Informativity Level / Average`; no confirmado. Afecta nomenclatura del dashboard.
- **QD1.5**: Interactividad oración OPPL ↔ elemento OPD al hover/clic. Los frames no muestran el canvas durante post-run. **HU candidata futura**: navegación desde oración en tabla detalle a elemento del OPD (ancla `MFSP sub-pattern ↔ primitiva visual` documentada en §9 del doc fuente — oportunidad productiva no explotada por OPCloud).
- **QD1.6**: Si el input `Min INF` admite valores fraccionarios o solo enteros. Dado el rango observado (0 a 0.25), debe admitir fraccionarios. Afecta HU-D1.013.
- **QD1.7**: Comportamiento de la calificación con modelos vacíos o sin OPPL. No observado. Afecta HU-D1.004, HU-D1.005, HU-D1.006.
- **QD1.8**: Si las credenciales premium son por usuario, organización o licencia del servidor. No observado rechazo en frames.
- **QD1.9**: Si `Run Model Grading` reutiliza OPPL cacheado o lo regenera en cada ejecución. Afecta performance de HU-D1.007.
- **QD1.10**: Si el roadmap (comparación entre versiones y entre OPDs) introducirá columnas de diff en la misma tabla o una vista nueva. Afecta HU-D1.015.
- **QD1.11**: Si el resultado de la calificación se persiste dentro del modelo o solo existe como Excel descargado. Hipótesis del doc fuente: solo Excel.
- **QD1.12**: Si navegar fuera de la vista y volver preserva el resultado o vuelve a placeholder. Afecta HU-D1.008.

## HU candidatas futuras (no derivadas del doc fuente — oportunidades productivas)

- **HU-D1.C01**: Navegación oración ↔ elemento OPD (hover en fila de tabla detalle → highlight en canvas). Derivada de §9 ancla MFSP↔primitiva visual. OPCloud no la explota; **oportunidad clara** para el modelador de este repo.
- **HU-D1.C02**: Comparador automático entre runs consecutivos (diff TWINF, delta en distribución MFSP, lista de oraciones que subieron/bajaron INF). Derivada del roadmap declarado en transcripción.
- **HU-D1.C03**: Sugerencias heurísticas automáticas a partir de distribución MFSP (`Añade precedencias`, `Revisa oraciones Unknown`, etc.). Derivada del patrón diagnóstico de la transcripción, no implementado en OPCloud.
- **HU-D1.C04**: Calificación por OPD individual (no solo global). Derivada del roadmap.
- **HU-D1.C05**: Persistencia del resultado de calificación dentro del modelo, con historial de runs para comparación longitudinal.
- **HU-D1.C06**: Export a otros formatos (CSV, JSON) para integración con pipelines analíticos externos.

## Referencias cruzadas

- **Doc fuente:** `opcloud-reverse/d1-analysis-informativity.md`.
- **Épica complementaria:** **EPICA-D0** (Identification of Missing Knowledge) — hermana bajo Model Knowledge, `goes hand with hand` por transcripción; complementarias pero independientes en OPCloud.
- **Épicas que bloquean a esta:** **EPICA-50** (OPPL pane — fuente primaria de la calificación).
- **Épicas vecinas en menú Analyze Model:** Calculate Model Metrics, NLP Model Analysis, Model Analysis Tools, DSM Analysis, Pareto Frontier Analysis (no integradas visualmente — observación del doc fuente §7).
- **Invariantes del repo:**
  - `src/render/opl-renderer.ts` — motor OPPL que alimenta el pipeline.
  - **Nuevo módulo:** `src/analisis/informatividad/` (clasificador MFSP + calificador INF + agregador).
  - `src/ui/` — dashboard de calificación como nueva vista lateral/modal.
  - `src/persistencia/` — **no se toca** si se adopta la hipótesis de "calificación no persiste en modelo" (§6).
- **Constitución categórica** (`docs/ARQUITECTURA-CATEGORICA.md`): HU-D1.001–006 operan como funtor derivado `OPM → Grading` sobre el OPPL — invariante de lente (sin mutación del modelo).
- **SSOT OPM:** el vocabulario MFSP es una capa **analítica sobre OPPL** [Glos E1], no una extensión del kernel OPM — debe mantenerse como módulo analítico separado, nunca como campo persistente en `Thing` o `Link`.
