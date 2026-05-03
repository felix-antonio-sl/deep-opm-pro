---
epica: "EPICA-D0"
titulo: "Analisis — deteccion de conocimiento faltante (AA prediccion de enlaces sobre el KG del modelo)"
doc_fuente: "opcloud-reverse/d0-analysis-missing-knowledge.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "S"
hu_emitidas: 22
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "DIAGNOSTICO-PILOTO-EPICA-D0.md"
---

## Resumen

Esta épica cubre el módulo analítico `Conocimiento del Modelo > Identificacion de Conocimiento Faltante` de OPCloud: un pipeline de **link prediction con Aprendizaje Automatico** que interpreta el modelo OPM como Knowledge Graph (KG) y propone tripletas `(Source, Relation, Target, Confidence)` que "deberían existir lógicamente" pero no están declaradas en el OPD. Es la **primera feature del corpus donde OPCloud aplica AA sobre la estructura del modelo** (no sobre valores ni simulación) y es hermana conceptual de `EPICA-D1` (informativity grading) y complementaria — distinta en foco — de `EPICA-1C` (validaciones gramaticales deterministas).

El módulo vive **fuera del canvas**, en Settings, como panel autocontenido con tres acciones (`DistMult Reasoning`, `R-GCN Reasoning`, `Download Suggestions (Excel)`), un slider de `Confidence umbral` y una tabla de resultados de cuatro columnas. El patrón arquitectónico es estricto: **el canvas es fuente, nunca destino** — ninguna sugerencia se materializa como enlace fantasma, halo o badge sobre el OPD. Esta constriction — junto con la ausencia de acción `Apply suggestion`, la opacidad de los hiperparámetros y la gating premium invisible — define la forma de las HU de esta épica, que se dividen entre (a) replicar el comportamiento observado y (b) proponer cortes donde la divergencia con OPCloud es defendible por SSOT, UX o arquitectura categórica de este repo (p.ej. accept/reject inline, batch fix, visualización de severidad por color, privacy local-first).

El actor primario transversal es **IA — Analista de modelo**, con incursiones de **ME — modelador experto** (al volver a canvas para aceptar una sugerencia) y **AO — admin de organización** (por la gating premium y la configuración del backend AA).

Las HU se numeran siguiendo la aparición en el doc fuente más un bloque final de HU propuestas por divergencia controlada con OPCloud (marcadas explícitamente como `divergencia-opcloud`). Cada HU cita doc fuente con sección y frames observados.

## Tabla de HU de la épica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|---|
| HU-D0.001 | Navegar a Settings > Analyze Model > Conocimiento del Modelo | IA | S | XS | opcloud-ui | — |
| HU-D0.002 | Alternar entre pestana Conocimiento Faltante e Informativity | IA | S | XS | opcloud-ui | — |
| HU-D0.003 | Ver panel inicial con placeholder pre-run | IA | S | XS | opcloud-ui | — |
| HU-D0.004 | Leer tooltips explicativos de DistMult y R-GCN | IA | S | XS | opcloud-ui | — |
| HU-D0.005 | Activar analisis DistMult (link prediction rapido in-browser) | IA | S | M | mixto | — |
| HU-D0.006 | Ver tabla de sugerencias con 4 columnas Source / Relation / Target / Confidence | IA | S | S | opcloud-ui | — |
| HU-D0.007 | Ver contador N suggestions (score >= X) reactivo | IA | S | XS | opcloud-ui | — |
| HU-D0.008 | Filtrar sugerencias por umbral de confianza con slider | IA | S | S | opcloud-ui | — |
| HU-D0.009 | Editar umbral con input numerico sincronizado (2 decimales) | IA | S | XS | opcloud-ui | — |
| HU-D0.010 | Validar que umbral este dentro de rango [0, 1] | IA | S | XS | opcloud-ui | — |
| HU-D0.011 | Activar analisis R-GCN (link prediction pesado, runtime Python remoto) | IA | C | M | opcloud-ui | — |
| HU-D0.012 | Exportar sugerencias filtradas a Excel con segunda pestana de metadata | IA | S | S | opcloud-ui | — |
| HU-D0.013 | Copiar tabla de sugerencias al portapapeles como texto | IA | C | XS | opcloud-ui | — |
| HU-D0.014 | Ver estado "0 sugerencias" con mensaje explicito de modelo completo | IA | S | XS | opcloud-ui | — |
| HU-D0.015 | Ejecutar analisis solo con credenciales premium (gating visible) | AO | S | S | opcloud-ui | — |
| HU-D0.016 | Resaltar cosa del canvas al pasar el cursor sobre una fila de sugerencia | IA | C | M | mixto | — |
| HU-D0.017 | Aceptar sugerencia inline creando el enlace en el modelo | ME | C | L | mixto | [V-61] |
| HU-D0.018 | Rechazar sugerencia inline sin crear enlace (ocultar + recordar) | ME | C | M | opcloud-ui | — |
| HU-D0.019 | Aplicar batch fix sobre multiples sugerencias seleccionadas | ME | C | L | mixto | [V-61] |
| HU-D0.020 | Codificar severidad visual por color segun confianza (semantica) | IA | C | S | opcloud-ui | — |
| HU-D0.021 | Ejecutar analisis en local sin enviar datos del modelo al exterior | IA | S | M | opcloud-ui | — |
| HU-D0.022 | Ver reporting agregado de analisis AA ejecutados (historial de runs) | IA | C | M | opcloud-ui | — |

Total: **22 historias de usuario** (18 opcloud-ui, 4 mixto).

## Historias de usuario

### HU-D0.001 — Navegar a Settings > Analyze Model > Conocimiento del Modelo

**Actor primario:** IA (analista de modelo).
**Actores secundarios:** ME (experto — usa el flujo al depurar modelos propios).
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; L (lectura del modelo para preparar el KG).
**Superficie UI:** barra-superior + settings-panel-lateral + page-model-knowledge.
**Gesto canónico:** clic en engranaje de la barra superior + expansión del grupo `Analyze Model` + clic en sub-item `Conocimiento del Modelo`.

**Historia:**
> Como analista, quiero navegar desde el canvas hasta la página `Conocimiento del Modelo` en Settings para encontrar las herramientas de analisis AA del modelo abierto.

**Contexto de negocio:**
El acceso canónico a la feature de detección de conocimiento faltante es a través de Settings, no de la toolbar del canvas. Esta ubicación refuerza el principio arquitectónico "analítica vive fuera del canvas" y agrupa Conocimiento Faltante con sus hermanas (`Calculate Model Metrics`, `NLP Model Analisis`, `DSM Analisis`, `Pareto Frontier Analisis`). El modelador debe poder llegar con dos o tres clics sin perder contexto del modelo abierto.

**Criterios de aceptación:**
- **Dado** que tengo un modelo abierto en el canvas, **cuando** hago clic en el icono de engranaje de la barra superior, **entonces** se abre la página Settings con el canvas sustituido por un panel lateral de categorías.
- **Dado** que Settings está abierto, **cuando** hago clic en el grupo `Analyze Model`, **entonces** se expande y muestra los 6 sub-items (`Calculate Model Metrics`, `NLP Model Analisis`, `Model Analisis Tools`, `DSM Analisis`, `Conocimiento del Modelo`, `Pareto Frontier Analisis`).
- **Dado** que `Analyze Model` está expandido, **cuando** hago clic en `Conocimiento del Modelo`, **entonces** se abre la página con los dos toggles `Identificacion de Conocimiento Faltante` y `Calificacion de Informatividad del Modelo`.
- **Dado** que entro a `Conocimiento del Modelo` por primera vez en la sesión, **cuando** se renderiza, **entonces** `Identificacion de Conocimiento Faltante` aparece seleccionado por defecto (azul saturado).
- **Dado** que navego a otra sección de Settings y vuelvo, **cuando** regreso a `Conocimiento del Modelo`, **entonces** la pestaña activa y el umbral del slider se preservan por sesión.

**Reglas y restricciones:**
- Ruta alternativa equivalente: main menu > OPCloud Settings > Analyze Model > Conocimiento del Modelo.
- El modelo abierto se mantiene cargado en memoria durante toda la sesión de Settings; no hay recarga desde disco.
- La navegación no cierra el modelo ni confirma/descarta cambios pendientes.

**Modelo de datos tocado:**
- `ui.settings.activePage` — string — transitorio UI-session.
- `ui.settings.modelKnowledge.activeTab` — `"conocimiento-faltante" | "informativity"` — transitorio.

**Dependencias:**
- Bloquea a: HU-D0.002, HU-D0.003, HU-D0.005, HU-D0.011.

**Integraciones:**
- Panel lateral de Settings (compartido con otras épicas de config).
- El modelo activo se comparte con canvas; ninguna mutación del modelo ocurre en este flujo.

**Notas de evidencia:**
- Fuente: `opcloud-reverse/d0-analysis-missing-knowledge.md` §2, §3.1.
- Frames: frame_1 (canvas pre-navegación), frame_5 (Settings sin expandir), frame_7 (página con pestañas sin seleccionar).
- Clase de afirmación: observado + confirmado por transcripción.

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [navegación, settings, analisis, conocimiento-faltante, ui].

---

### HU-D0.002 — Alternar entre pestaña Conocimiento Faltante e Informativity

**Actor primario:** IA.
**Tipo:** opcloud-ui.
**Nivel categórico:** U.
**Superficie UI:** page-model-knowledge (cabecera con dos toggles).
**Gesto canónico:** clic en el toggle contrario.

**Historia:**
> Como analista, quiero alternar entre las pestañas `Identificacion de Conocimiento Faltante` y `Calificacion de Informatividad del Modelo` para acceder a las dos modalidades de analisis del mismo panel sin navegar a otra página.

**Contexto de negocio:**
Las dos features son **complementarias conceptualmente** (transcripción fuente: "it goes hand with hand with identification of conocimiento faltante") y comparten la misma página para reforzar esa hermandad. El toggle evita duplicar la jerarquía de Settings y permite al analista comparar resultados.

**Criterios de aceptación:**
- **Dado** que estoy en la pestaña Conocimiento Faltante, **cuando** hago clic en `Calificacion de Informatividad del Modelo`, **entonces** el panel inferior cambia a la interfaz de informativity (EPICA-D1) preservando el modelo activo.
- **Dado** que estoy en Informativity, **cuando** hago clic en `Identificacion de Conocimiento Faltante`, **entonces** el panel regresa al estado anterior (con o sin sugerencias cargadas según el caso).
- **Dado** que corrí DistMult y cambio de pestaña, **cuando** vuelvo a Conocimiento Faltante, **entonces** la tabla de sugerencias **se preserva** en memoria (no se re-ejecuta el razonamiento).
- **Dado** que el toggle es binario, **cuando** miro el estado visual, **entonces** solo uno de los dos aparece con el fondo azul saturado.

**Reglas y restricciones:**
- Los toggles son mutuamente excluyentes (radio-style, no checkboxes).
- El umbral y resultados de Conocimiento Faltante y los datos de Informativity son independientes y cada pestaña los conserva.

**Modelo de datos tocado:**
- `ui.settings.modelKnowledge.activeTab` — `"conocimiento-faltante" | "informativity"` — transitorio.
- `ui.settings.modelKnowledge.missingKnowledgeResults` — cache de sugerencias — transitorio.

**Dependencias:**
- Bloqueada por: HU-D0.001.

**Integraciones:**
- EPICA-D1 (Informativity) comparte la superficie; la HU solo cubre el gesto de alternancia.

**Notas de evidencia:**
- Fuente: §2 tabla, §3.1 paso 6.
- Frames: frame_7 (ambos visibles sin seleccionar), frame_9 (Conocimiento Faltante activa).
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [ui, toggle, conocimiento-faltante, informativity, navegación].

---

### HU-D0.003 — Ver panel inicial con placeholder pre-run

**Actor primario:** IA.
**Tipo:** opcloud-ui.
**Nivel categórico:** U.
**Superficie UI:** page-model-knowledge (panel inferior de resultados).
**Gesto canónico:** ninguno (estado por defecto al entrar).

**Historia:**
> Como analista, quiero ver un placeholder explícito (`No suggestions yet. Run reasoning to discover conocimiento faltante.`) cuando aún no he ejecutado el razonamiento para saber que el panel está vacío por ausencia de ejecución y no por fallo.

**Contexto de negocio:**
El estado inicial es semántica observable. Sin el placeholder, el usuario podría asumir que el modelo no tiene sugerencias, que el feature no funciona, o que hay un error silencioso. El texto explícito le indica la siguiente acción (ejecutar razonamiento).

**Criterios de aceptación:**
- **Dado** que entro a Conocimiento Faltante por primera vez en la sesión, **cuando** se renderiza la página, **entonces** el panel inferior muestra el texto `No suggestions yet. Run reasoning to discover conocimiento faltante.` centrado, en gris y cursiva.
- **Dado** que el placeholder está visible, **cuando** no ejecuto ningún razonamiento, **entonces** persiste indefinidamente sin timeout ni mensaje de error.
- **Dado** que el placeholder está visible, **cuando** miro la cabecera del panel, **entonces** el contador de sugerencias no aparece (o aparece como `0 suggestions` — ver HU-D0.014 para el flujo post-run vacío).
- **Dado** que el placeholder está visible, **cuando** miro el slider, **entonces** está en `0.5` por defecto.

**Reglas y restricciones:**
- El placeholder es **texto estático**, no enlace ni botón.
- Diferencia semántica: el placeholder indica "nunca se corrió", no "se corrió y dio 0" — ver HU-D0.014 para la divergencia propuesta respecto a OPCloud.

**Modelo de datos tocado:**
- `ui.settings.modelKnowledge.lastRun` — `null | timestamp` — transitorio.

**Dependencias:**
- Bloqueada por: HU-D0.001.

**Integraciones:**
- Ninguna (render puro).

**Notas de evidencia:**
- Fuente: §2 tabla, §3.1 paso 7, §4 primer bullet.
- Frames: frame_9.
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [ui, empty-state, placeholder, conocimiento-faltante].

---

### HU-D0.004 — Leer tooltips explicativos de DistMult y R-GCN

**Actor primario:** IA.
**Tipo:** opcloud-ui.
**Nivel categórico:** U.
**Superficie UI:** page-model-knowledge (botones de acción) + tooltip gris.
**Gesto canónico:** hover del cursor sobre el botón.

**Historia:**
> Como analista, quiero leer una descripción corta de cada algoritmo (DistMult y R-GCN) al pasar el cursor sobre su botón para entender qué hacen, cuánto cuestan y cuándo elegir uno sobre el otro sin dejar el panel.

**Contexto de negocio:**
Los dos algoritmos son cajas negras para el usuario (ningún hiperparámetro expuesto); el único vehículo pedagógico es el tooltip. La descripción declara trade-offs (velocidad vs precisión) y casos de uso recomendados. Es crítica para que el analista no invoque R-GCN innecesariamente o confunda su salida con DistMult.

**Criterios de aceptación:**
- **Dado** que estoy en el panel Conocimiento Faltante, **cuando** hago hover sobre `DistMult Reasoning`, **entonces** aparece una caja de tooltip gris claro con el texto: `A very fast matrix-factorization model. Each entity and relation is represented by a learned vector. Great baseline for small or mostly complete OPM models. Can miss higher-order patterns.`
- **Dado** que hago hover sobre `R-GCN Reasoning`, **cuando** aparece el tooltip, **entonces** muestra: `A graph neural network that extends GCNs to multi-relation graphs. Gives higher link-prediction accuracy. Heavier: seconds-minutes per run, depends on graph size.`
- **Dado** que hago hover sobre `Download Suggestions (Excel)`, **cuando** aparece el tooltip, **entonces** muestra: `Download the current suggestions as an Excel file.`
- **Dado** que saco el cursor del botón, **cuando** sale del área, **entonces** el tooltip se oculta inmediatamente.
- **Dado** que el tooltip está visible, **cuando** mido su posición, **entonces** aparece cerca del botón sin tapar otros controles.

**Reglas y restricciones:**
- Tooltip tiene 2-5 líneas; el texto es fijo (idioma inglés en OPCloud; en este repo se traduce a es-CL).
- No es interactivo (no se hace clic dentro del tooltip).

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-D0.001.

**Integraciones:**
- Ninguna.

**Notas de evidencia:**
- Fuente: §2 tabla, §3.2 paso 1, §3.4 paso 1, §3.6 paso 1.
- Frames: frame_11 (DistMult tooltip), frame_13 (R-GCN tooltip), frame_21 (Excel tooltip).
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [ui, tooltip, pedagógico, conocimiento-faltante].

---

### HU-D0.005 — Activar analisis DistMult (link prediction rápido in-browser)

**Actor primario:** IA.
**Tipo:** mixto.
**Nivel categórico:** L (lente — lee modelo y produce ranking) primario; X (integración con motor AA embebido) secundario.
**Superficie UI:** page-model-knowledge (botón `DistMult Reasoning`) + tabla de resultados.
**Gesto canónico:** clic en el botón.

**Historia:**
> Como analista, quiero ejecutar el algoritmo DistMult con un clic para obtener en segundos un ranking de tripletas faltantes sobre el modelo abierto sin configurar nada.

**Contexto de negocio:**
DistMult es el algoritmo baseline: rápido, in-browser, sin dependencias externas. Es la puerta de entrada al analisis AA y debe funcionar sin fricción. Produce un ranking denso (164 sugerencias observadas para un modelo de ~20 cosas), por lo que el filtrado por umbral (HU-D0.008) es el mecanismo principal de navegación del resultado.

**Criterios de aceptación:**
- **Dado** que estoy en el panel Conocimiento Faltante, **cuando** hago clic en `DistMult Reasoning`, **entonces** el motor AA procesa el KG en segundos y puebla la tabla inferior.
- **Dado** que el razonamiento terminó, **cuando** miro el panel, **entonces** el placeholder desaparece y aparece el contador `N suggestions (score >= 0.50)` con N > 0 (para modelos no triviales).
- **Dado** que corrí DistMult, **cuando** re-ejecuto haciendo clic de nuevo, **entonces** el resultado se recalcula desde cero (no hay cache intra-sesión).
- **Dado** que el razonamiento está en curso, **cuando** observo el botón, **entonces** el sistema indica visualmente el progreso (spinner, barra o cambio de cursor) — **hipótesis**: OPCloud no lo muestra, pero este repo debería incluirlo (UX patch).
- **Dado** que el motor AA falla (modelo vacío o grafo no entrenable), **cuando** se procesa, **entonces** el panel muestra un mensaje de error específico sin crashear la UI.

**Reglas y restricciones:**
- DistMult corre **in-browser** (observación del corpus; ver §7 integraciones).
- Hiperparámetros (dimensión de embeddings, epochs, learning rate) son **caja negra** — no expuestos al usuario.
- La entrada es un KG derivado del modelo con:
  - Entidades = cosas (Process + Object).
  - Relaciones = 6 tipos observados (`Aggregation`, `Generalization`, `Consumption`, `Result`, `Instrument`, `Invocation`).
  - Triples declarados = ground truth de entrenamiento.
- Sugerencias con `confidence < 0.5` se descartan por el motor; el usuario nunca las ve (observación: el slider no baja de 0.5).

**Modelo de datos tocado:**
- `analysis.missingKnowledge.suggestions` — array de `{source, relation, target, confidence}` — transitorio UI-session.
- `analysis.missingKnowledge.lastRunAt` — timestamp — transitorio.

**Dependencias:**
- Bloqueada por: HU-D0.001.
- Bloquea a: HU-D0.006, HU-D0.007, HU-D0.008, HU-D0.012, HU-D0.013, HU-D0.014, HU-D0.016, HU-D0.017, HU-D0.018.

**Integraciones:**
- Motor AA (embebido en cliente — probablemente TensorFlow.js o similar).
- Canvas / OPD: solo fuente de lectura; ninguna mutación.

**Notas de evidencia:**
- Fuente: §3.2.
- Frames: frame_15, frame_18 (tabla post-run).
- Transcripción: "the process is working and a few seconds later we'll get our suggestion".
- Clase de afirmación: observado + confirmado por transcripción.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [analisis, aa, distmult, link-prediction, conocimiento-faltante].

---

### HU-D0.006 — Ver tabla de sugerencias con 4 columnas Source / Relation / Target / Confidence

**Actor primario:** IA.
**Tipo:** opcloud-ui.
**Nivel categórico:** V primario (render); L (lectura derivada).
**Superficie UI:** page-model-knowledge (panel inferior de resultados).
**Gesto canónico:** ninguno (render post-run).

**Historia:**
> Como analista, quiero ver las sugerencias del motor AA en una tabla ordenada por confianza descendente con cuatro columnas fijas (`Source`, `Relation`, `Target`, `Confidence`) para escanear rápido los candidatos más probables.

**Contexto de negocio:**
La tabla es la superficie principal del valor del feature. Un formato tabular con orden decreciente deja arriba las sugerencias más confiables — la cola del ranking tiene utilidad marginal. Las cuatro columnas son fijas, sin configuración: eligen deliberadamente la simpleza sobre la personalización.

**Criterios de aceptación:**
- **Dado** que DistMult generó resultados, **cuando** miro el panel inferior, **entonces** aparece una tabla con cuatro columnas en ese orden: `Source`, `Relation`, `Target`, `Confidence`.
- **Dado** que la tabla está cargada, **cuando** miro el orden de las filas, **entonces** están ordenadas por `Confidence` descendente.
- **Dado** que el modelo tiene 164 sugerencias sobre umbral 0.5, **cuando** miro la primera fila, **entonces** muestra el par con mayor confianza observada (p.ej. `Data Base | Aggregation | Passenger Communicating & Entertaining System | 0.524`).
- **Dado** que una fila muestra `Confidence`, **cuando** miro el formato, **entonces** el valor tiene **3 decimales** en la UI (contrasta con Excel que exporta hasta 9 — ver HU-D0.012).
- **Dado** que la tabla tiene muchas filas, **cuando** la altura excede el viewport, **entonces** hay scroll vertical dentro del panel sin afectar el resto de la página.
- **Dado** que las filas son texto puro, **cuando** hago clic en una, **entonces** no hay acción implícita **en el comportamiento OPCloud** — ver HU-D0.016 y HU-D0.017 para las divergencias propuestas.

**Reglas y restricciones:**
- Cabecera en title-case (`Source`, `Relation`, `Target`, `Confidence`) consistente con otras tablas de OPCloud.
- Las 6 relaciones que pueden aparecer en la columna `Relation` son: `Aggregation`, `Generalization`, `Consumption`, `Result`, `Instrument`, `Invocation`. **Invocation** es reificada por el algoritmo como primitiva de primera clase (observación del corpus §9).
- No hay iconografía de color por tipo de relación ni por severidad de confianza **en OPCloud** — ver HU-D0.020 para la divergencia.

**Modelo de datos tocado:**
- `analysis.missingKnowledge.suggestions[i].source` — string (nombre de thing) — transitorio.
- `analysis.missingKnowledge.suggestions[i].relation` — enum de 6 valores — transitorio.
- `analysis.missingKnowledge.suggestions[i].target` — string (nombre de thing) — transitorio.
- `analysis.missingKnowledge.suggestions[i].confidence` — float ∈ [0.5, ~0.525] — transitorio.

**Dependencias:**
- Bloqueada por: HU-D0.005.

**Integraciones:**
- Renderer genérico de tabla (componente UI reusable).

**Notas de evidencia:**
- Fuente: §2 tabla (fila `Tabla de sugerencias`), §3.2 paso 4-5, §6.
- Frames: frame_15, frame_18.
- Transcripción: columna de confianza "0.5 meaning 50% confidence… as the confidence gets higher it means that the algorithm thinks that it is really missing from our model".
- Clase de afirmación: observado + confirmado.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [ui, tabla, conocimiento-faltante, resultados].

---

### HU-D0.007 — Ver contador N suggestions (score >= X) reactivo

**Actor primario:** IA.
**Tipo:** opcloud-ui.
**Nivel categórico:** V.
**Superficie UI:** page-model-knowledge (cabecera del panel de resultados).
**Gesto canónico:** ninguno (render reactivo).

**Historia:**
> Como analista, quiero ver un contador dinámico `N suggestions (score >= X)` arriba de la tabla para saber cuántas filas matchean el filtro actual de umbral.

**Contexto de negocio:**
Con rankings densos (164 sugerencias), el contador es la única métrica de "magnitud del resultado" inmediatamente legible. También sirve como feedback del filtrado: al mover el slider, el contador cambia en vivo y confirma que el filtro está aplicado.

**Criterios de aceptación:**
- **Dado** que DistMult generó 164 sugerencias con umbral 0.5, **cuando** miro la cabecera, **entonces** dice `164 suggestions (score >= 0.50)`.
- **Dado** que muevo el slider a 0.52, **cuando** el filtrado se aplica, **entonces** el contador muestra el nuevo N (p.ej. `1 suggestions (score >= 0.52)`).
- **Dado** que vuelvo el slider a 0.5, **cuando** se re-estabiliza, **entonces** el contador vuelve a `164 suggestions (score >= 0.50)`.
- **Dado** que el contador está visible, **cuando** el formato es singular (N=1), **entonces** **abierto**: OPCloud usa `1 suggestions` (pluralización incorrecta observada en frame_20). Este repo debería corregir a `1 suggestion` (regla gramatical) — marcar `divergencia-opcloud` menor.

**Reglas y restricciones:**
- El contador tiene dos decimales en el umbral (`>= 0.50`, no `>= 0.5`).
- Reactividad < 100ms al mover el slider.

**Modelo de datos tocado:**
- Derivado en render desde `analysis.missingKnowledge.suggestions` + `ui.settings.modelKnowledge.umbral`.

**Dependencias:**
- Bloqueada por: HU-D0.005, HU-D0.008.

**Integraciones:**
- Componente reactivo.

**Notas de evidencia:**
- Fuente: §2 tabla (`Contador N suggestions`), §3.2 paso 4, §3.3 paso 3.
- Frames: frame_15 (`164 suggestions (score >= 0.50)`), frame_20 (`1 suggestions (score >= 0.52)`).
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [ui, contador, conocimiento-faltante, filtrado].

---

### HU-D0.008 — Filtrar sugerencias por umbral de confianza con slider

**Actor primario:** IA.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; V (rerender de tabla).
**Superficie UI:** page-model-knowledge (slider de confidence umbral).
**Gesto canónico:** arrastre del thumb del slider.

**Historia:**
> Como analista, quiero arrastrar un slider de umbral de confianza para filtrar dinámicamente las sugerencias visibles y enfocarme solo en las más probables.

**Contexto de negocio:**
El ranking denso (164 sugerencias) es inmanejable sin filtro. El slider permite al analista explorar el espacio de resultados de forma continua: umbral alto = alta precisión con baja cobertura; umbral bajo = alta cobertura con baja precisión. La exploración visual del umbral es el gesto principal del feature.

**Criterios de aceptación:**
- **Dado** que la tabla tiene 164 sugerencias, **cuando** arrastro el slider a la derecha hasta 0.52, **entonces** la tabla filtra en vivo y queda con las filas con `confidence >= 0.52`.
- **Dado** que el slider está en 0.52, **cuando** lo arrastro de vuelta a 0.5, **entonces** reaparecen todas las filas.
- **Dado** que arrastro el slider, **cuando** muevo, **entonces** el input numérico adyacente refleja el valor en vivo (HU-D0.009).
- **Dado** que arrastro el slider, **cuando** muevo, **entonces** el contador se actualiza en vivo (HU-D0.007).
- **Dado** que el slider está en posición extrema derecha, **cuando** miro el rango, **entonces** el máximo observado en el corpus es `~0.524` (primer elemento del ranking); **abierto**: ¿se vacía progresivamente o hay tope duro? (ver preguntas abiertas).

**Reglas y restricciones:**
- Rango visible del slider: `[0.5, 1.0]` (el motor descarta < 0.5).
- Step del slider: no observado — **hipótesis**: 0.01 (consistente con 2 decimales del input).
- El filtro es del lado cliente (no re-ejecuta el motor AA).

**Modelo de datos tocado:**
- `ui.settings.modelKnowledge.umbral` — float ∈ [0.5, 1.0] — transitorio.

**Dependencias:**
- Bloqueada por: HU-D0.005.
- Bloquea a: HU-D0.009, HU-D0.012 (exporta lo filtrado).

**Integraciones:**
- Input numérico sincronizado (HU-D0.009).
- Contador (HU-D0.007).
- Tabla (HU-D0.006).

**Notas de evidencia:**
- Fuente: §2 tabla (`Slider Confidence umbral`), §3.3.
- Frames: frame_9 (slider en 0.5 pre-run), frame_20 (slider en 0.52).
- Transcripción: semántica del umbral.
- Clase de afirmación: observado + confirmado.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [ui, slider, filtrado, confidence, conocimiento-faltante].

---

### HU-D0.009 — Editar umbral con input numérico sincronizado (2 decimales)

**Actor primario:** IA.
**Tipo:** opcloud-ui.
**Nivel categórico:** U.
**Superficie UI:** page-model-knowledge (input numérico junto al slider).
**Gesto canónico:** escritura en teclado + Enter, o clic en spinner (flechas).

**Historia:**
> Como analista, quiero escribir o teclear un valor exacto en un input numérico sincronizado con el slider para ajustar el umbral con precisión sin depender del gesto analógico del arrastre.

**Contexto de negocio:**
El slider es bueno para exploración continua, pero para fijar umbrales reproducibles (p.ej. para reporting) hace falta un input discreto. Ambas superficies conviven y se mantienen sincronizadas. El spinner (flechas arriba/abajo) atiende usuarios que prefieren teclado o mouse incremental.

**Criterios de aceptación:**
- **Dado** que el input muestra `0.50`, **cuando** escribo `0.52` y presiono Enter, **entonces** el slider se desplaza a 0.52 y la tabla se filtra.
- **Dado** que arrastro el slider a 0.51, **cuando** suelto, **entonces** el input muestra `0.51`.
- **Dado** que hago clic en la flecha arriba del spinner, **cuando** se incrementa, **entonces** sube en step de 0.01 (o el step configurado).
- **Dado** que escribo un valor con más de 2 decimales (`0.523`), **cuando** confirmo, **entonces** el input redondea/trunca a 2 decimales (`0.52` o `0.53` según política) **— regla a definir**, marcada `requires-clarification`.
- **Dado** que escribo texto no numérico, **cuando** confirmo, **entonces** el input rechaza el valor y vuelve al último valor válido.

**Reglas y restricciones:**
- Formato visible: 2 decimales siempre (padding de ceros, p.ej. `0.50` no `0.5`).
- Step del spinner: 0.01 (hipótesis consistente con 2 decimales).
- Bidirectional binding con slider: siempre sincronizado.

**Modelo de datos tocado:**
- `ui.settings.modelKnowledge.umbral` — compartido con HU-D0.008.

**Dependencias:**
- Bloqueada por: HU-D0.008.

**Integraciones:**
- Slider (HU-D0.008).

**Notas de evidencia:**
- Fuente: §2 tabla (`Input numerico`), §3.3 paso 2.
- Frames: frame_18, frame_20 (input visible junto al slider).
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [ui, input-numerico, confidence, conocimiento-faltante].

---

### HU-D0.010 — Validar que umbral esté dentro de rango [0, 1]

**Actor primario:** IA.
**Tipo:** opcloud-ui.
**Nivel categórico:** U.
**Superficie UI:** input-numerico + slider.
**Gesto canónico:** ninguno (validación).

**Historia:**
> Como analista, quiero que el sistema rechace valores de umbral fuera del rango `[0, 1]` para no introducir estados inválidos (p.ej. umbral negativo o > 1).

**Contexto de negocio:**
`confidence` es una probabilidad: por definición está en `[0, 1]`. El corpus observa valores entre 0.5 y ~0.525 en el modelo de ejemplo, y el slider arranca en 0.5 por diseño del motor AA. No hay evidencia de que OPCloud valide valores fuera de rango; este repo debe hacerlo para evitar estados rotos (p.ej. `umbral = 2` produciría tabla vacía permanente sin feedback claro).

**Criterios de aceptación:**
- **Dado** que escribo `-0.3` en el input, **cuando** confirmo, **entonces** el input rechaza y muestra feedback (borde rojo, tooltip de error o revertir al valor anterior).
- **Dado** que escribo `1.5` en el input, **cuando** confirmo, **entonces** el input rechaza con el mismo mecanismo.
- **Dado** que el motor AA descarta valores `< 0.5` por diseño, **cuando** intento setear umbral `0.3` vía input, **entonces** el sistema permite el valor (es un filtro, no un hiperparámetro del motor) pero la tabla no muestra nada debajo de 0.5 porque el motor no retornó esas sugerencias.
- **Dado** que el rango efectivo de filtrado es `[0.5, max(confidence)]`, **cuando** el usuario arrastra el slider, **entonces** no se permite bajar de 0.5 ni subir del máximo observado + 0.01.

**Reglas y restricciones:**
- Rango teórico: `[0, 1]` (probabilidad).
- Rango efectivo observado: `[0.5, 1.0]`.
- Política de rechazo: revertir al último valor válido + feedback visual.
- **Abierto**: OPCloud no documenta este comportamiento; asumir defensive validation.

**Modelo de datos tocado:**
- `ui.settings.modelKnowledge.umbral` — compartido.

**Dependencias:**
- Bloqueada por: HU-D0.009.

**Integraciones:**
- Validador de input genérico.

**Notas de evidencia:**
- Fuente: §4 bullet "Confianza fuera de rango".
- Clase de afirmación: inferido (no observado en el corpus).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [ui, validación, input-numerico, conocimiento-faltante, requires-clarification].

---

### HU-D0.011 — Activar analisis R-GCN (link prediction pesado, runtime Python remoto)

**Actor primario:** IA.
**Tipo:** opcloud-ui.
**Nivel categórico:** X (integración con runtime externo) primario; L (lente).
**Superficie UI:** page-model-knowledge (botón `R-GCN Reasoning`).
**Gesto canónico:** clic en el botón.

**Historia:**
> Como analista, quiero ejecutar el algoritmo R-GCN (graph neural network multi-relación) con un clic para obtener predicciones de mayor precisión en modelos grandes donde DistMult no captura patrones de orden superior.

**Contexto de negocio:**
R-GCN es el algoritmo avanzado: más lento (segundos a minutos), dependiente del tamaño del grafo, y su ejecución requiere un runtime Python remoto (observación: "currently is disabled but later on it will be enabled this will go behind the scenes"). En el corpus aparece deshabilitado; esta HU cubre el comportamiento previsto cuando se habilite.

**Criterios de aceptación:**
- **Dado** que R-GCN está deshabilitado (estado observado en OPCloud al momento de la captura), **cuando** miro el botón, **entonces** aparece visualmente degradado (grayed out) o no reacciona al clic. **Abierto**: OPCloud no lo degrada visualmente — este repo debe hacerlo.
- **Dado** que R-GCN está habilitado, **cuando** hago clic, **entonces** el cliente envía el KG al runtime Python remoto y espera la respuesta (segundos a minutos).
- **Dado** que R-GCN está corriendo, **cuando** miro la UI, **entonces** aparece un indicador de progreso (spinner, barra, contador) claramente distinto de DistMult por el tiempo esperado.
- **Dado** que R-GCN termina, **cuando** el resultado llega, **entonces** la tabla se puebla idénticamente a DistMult (mismas 4 columnas) con el ranking producido por el modelo pesado.
- **Dado** que el runtime remoto falla (timeout, error de red, error del script), **cuando** la UI recibe el error, **entonces** muestra un mensaje claro ("R-GCN is currently unavailable. Try DistMult instead.") y no corrompe el estado del panel.

**Reglas y restricciones:**
- R-GCN requiere conexión a un backend Python (asumido HTTP/REST o WebSocket).
- El resultado es **equivalente en formato** a DistMult: mismas 4 columnas, mismo rango de confianza.
- Dado que opmodel.sanixai.com es el entorno target, **pregunta crítica**: ¿este repo exporta datos del modelo al backend R-GCN? Ver HU-D0.021 para la divergencia local-first.

**Modelo de datos tocado:**
- `analysis.missingKnowledge.suggestions` — compartido con HU-D0.005.
- `analysis.missingKnowledge.algorithm` — `"distmult" | "rgcn"` — transitorio (para reporting).

**Dependencias:**
- Bloqueada por: HU-D0.001.
- Relaciona: HU-D0.015 (credenciales), HU-D0.021 (privacy).

**Integraciones:**
- Runtime Python remoto (infra externa; no provista por este repo en MVP).

**Notas de evidencia:**
- Fuente: §3.6, §5 tabla.
- Frames: frame_13 (tooltip).
- Transcripción: "currently is disabled but later on it will be enabled this will go behind the scenes".
- Clase de afirmación: observado (UI) + hipótesis (runtime Python) + abierto (comportamiento deshabilitado).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamaño:** M.
**Etiquetas:** [analisis, aa, rgcn, link-prediction, conocimiento-faltante, runtime-python, requires-clarification].

---

### HU-D0.012 — Exportar sugerencias filtradas a Excel con segunda pestaña de metadata

**Actor primario:** IA.
**Tipo:** opcloud-ui.
**Nivel categórico:** X (integración export) primario; L.
**Superficie UI:** page-model-knowledge (botón `Download Suggestions (Excel)`).
**Gesto canónico:** clic en el botón.

**Historia:**
> Como analista, quiero descargar las sugerencias filtradas por el umbral actual a un archivo Excel con dos pestañas (datos + metadata del filtro) para compartir resultados con stakeholders que no usan OPCloud.

**Contexto de negocio:**
El Excel es la salida persistente del analisis. Las sugerencias no se serializan en el modelo (observación: "no hay persistencia en el OPD"), por lo que Excel es el único vehículo de guardado de resultados. La segunda pestaña con metadata del filtro (umbral + conteo) es importante para la trazabilidad de la decisión analítica.

**Criterios de aceptación:**
- **Dado** que tengo 164 sugerencias filtradas con umbral 0.5, **cuando** hago clic en `Download Suggestions (Excel)`, **entonces** se descarga un archivo `.xlsx` con las 164 filas en la primera pestaña.
- **Dado** que filtré con umbral 0.52 y quedan 1 sugerencia, **cuando** exporto, **entonces** el Excel contiene solo esa fila (exporta lo filtrado, no el ranking completo).
- **Dado** que el Excel está descargado, **cuando** lo abro, **entonces** la pestaña 1 tiene 4 columnas: `Source`, `Relation`, `Target`, `Confidence`.
- **Dado** que la pestaña 1 muestra `Confidence`, **cuando** miro los valores, **entonces** el formato tiene **hasta 9 decimales** (`0.523994477`) — divergente del render en UI de 3 decimales.
- **Dado** que existe una pestaña 2, **cuando** la abro, **entonces** contiene metadata del filtro aplicado (umbral mínimo + conteo de sugerencias).

**Reglas y restricciones:**
- El formato es `.xlsx` nativo de Excel (no CSV).
- El export respeta el umbral actual del slider (no exporta siempre todo).
- Ningún dato sensible del modelo se incluye más allá de los nombres de cosas y relaciones.

**Modelo de datos tocado:**
- Ninguno (lectura + serialización a archivo binario).

**Dependencias:**
- Bloqueada por: HU-D0.005, HU-D0.008.

**Integraciones:**
- Librería de generación Excel (p.ej. `exceljs`, `xlsx` de SheetJS).

**Notas de evidencia:**
- Fuente: §3.4.
- Frames: frame_21 (tooltip), frame_22-24 (Excel abierto).
- Transcripción: "the second tab in the Excel will show us what we filtered for and how many suggestions we have".
- Clase de afirmación: observado + confirmado.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [export, excel, conocimiento-faltante, metadata].

---

### HU-D0.013 — Copiar tabla de sugerencias al portapapeles como texto

**Actor primario:** IA.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; X (clipboard).
**Superficie UI:** page-model-knowledge (icono de copy en esquina inferior izquierda del panel de resultados).
**Gesto canónico:** clic en el icono.

**Historia:**
> Como analista, quiero copiar la tabla de sugerencias al portapapeles con un clic para pegarla en un editor de texto, correo o mensaje sin pasar por Excel.

**Contexto de negocio:**
El clipboard es una salida ligera, complementaria al Excel, para flujos rápidos de comunicación (ticket, email, chat técnico). La transcripción lo menciona explícitamente: "you may also able to copy the current suggestion as a text into your own text editor and work like that".

**Criterios de aceptación:**
- **Dado** que hay sugerencias en la tabla, **cuando** hago clic en el icono de copy (esquina inferior izquierda), **entonces** el portapapeles del sistema contiene la tabla como texto.
- **Dado** que pego el contenido en un editor, **cuando** miro el formato, **entonces** las filas están separadas por newline y las columnas por tab (TSV) — **hipótesis**: el corpus no precisa el separador.
- **Dado** que la tabla está filtrada por umbral 0.52, **cuando** copio, **entonces** solo la fila filtrada va al portapapeles.
- **Dado** que hago copy, **cuando** se ejecuta, **entonces** aparece un feedback visual breve (toast o cambio del icono por ~1s) confirmando éxito.

**Reglas y restricciones:**
- Formato de salida: TSV (hipótesis); **abierto**: ¿CSV, TSV o texto con separadores custom?
- La acción copia las filas visibles post-filtro (consistente con HU-D0.012).
- Usa la API `navigator.clipboard.writeText`.

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-D0.005.

**Integraciones:**
- Clipboard del sistema operativo.

**Notas de evidencia:**
- Fuente: §3.5, §2 tabla.
- Frames: frame_18 (icono visible pero pequeño).
- Transcripción: "copy the current suggestion as a text".
- Clase de afirmación: observado (icono) + hipótesis (formato exacto).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamaño:** XS.
**Etiquetas:** [clipboard, export, conocimiento-faltante, requires-clarification].

---

### HU-D0.014 — Ver estado "0 sugerencias" con mensaje explícito de modelo completo

**Actor primario:** IA.
**Tipo:** opcloud-ui.
**Nivel categórico:** U.
**Superficie UI:** page-model-knowledge (panel inferior post-run).
**Gesto canónico:** ninguno (render post-run vacío).

**Historia:**
> Como analista, quiero ver un mensaje positivo explícito (`No conocimiento faltante detected. Model appears complete at this confidence level.`) cuando el motor AA retorna 0 sugerencias sobre el umbral actual para distinguir el caso "modelo completo" del caso "nunca ejecuté".

**Contexto de negocio:**
Observación del corpus: OPCloud **no distingue** entre "nunca corrí el motor" y "lo corrí y dio 0 resultados" — ambos muestran el mismo placeholder degenerado. Es una omisión UX crítica: el usuario pierde información sobre el estado de su modelo. Esta HU propone la corrección como **divergencia-opcloud**, alineada con el principio del repo "feedback terminal positivo cuando aplica".

**Criterios de aceptación:**
- **Dado** que corrí DistMult sobre un modelo y el motor retornó 0 sugerencias sobre umbral 0.5, **cuando** miro el panel, **entonces** aparece el mensaje `No conocimiento faltante detected. Model appears complete at this confidence level.` en color verde/azul (positivo).
- **Dado** que el motor retornó >0 sugerencias pero el umbral filtra todo, **cuando** el contador dice `0 suggestions (score >= 0.60)`, **entonces** aparece un mensaje secundario `Lower the umbral to see more suggestions.`
- **Dado** que nunca corrí el motor, **cuando** miro el panel, **entonces** el placeholder pre-run (HU-D0.003) se mantiene distinto de este mensaje post-run.
- **Dado** que el mensaje de "modelo completo" está visible, **cuando** miro la cabecera, **entonces** el contador muestra `0 suggestions (score >= X)` coherente.

**Reglas y restricciones:**
- Tres estados visualmente distintos:
  1. Pre-run (placeholder gris): `No suggestions yet. Run reasoning to discover conocimiento faltante.`
  2. Post-run con resultados: tabla + contador.
  3. Post-run vacío: mensaje positivo + contador `0 suggestions`.
- El mensaje positivo debe ser honesto: dice "at this confidence level", no afirma que el modelo es absolutamente completo.

**Modelo de datos tocado:**
- `analysis.missingKnowledge.lastRun` — `null | timestamp` — transitorio.
- Derivado: `visibleSuggestions.length` controla el render.

**Dependencias:**
- Bloqueada por: HU-D0.005, HU-D0.008.

**Integraciones:**
- Renderer del panel.

**Notas de evidencia:**
- Fuente: §4 bullet "Run con 0 sugerencias" (hipótesis: OPCloud no da feedback), §9 bullet "Placeholder como estado único pre-run".
- Clase de afirmación: divergencia propuesta por este repo (OPCloud no lo hace).
- Etiqueta: `divergencia-opcloud`.

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [ui, empty-state, conocimiento-faltante, divergencia-opcloud, feedback-positivo].

---

### HU-D0.015 — Ejecutar analisis solo con credenciales premium (gating visible)

**Actor primario:** AO (admin de organización).
**Actores secundarios:** IA (afectado por gating).
**Tipo:** opcloud-ui.
**Nivel categórico:** C (config) primario; U (gating visible).
**Superficie UI:** Settings > Analyze Model > Conocimiento del Modelo (item + panel).
**Gesto canónico:** ninguno (estado de gating).

**Historia:**
> Como admin de organización, quiero que el analisis Conocimiento Faltante esté disponible solo para usuarios con credenciales premium, y quiero que la UI indique claramente el gating para que el usuario entienda por qué no puede acceder.

**Contexto de negocio:**
La feature es premium (observación: "model knowledge is a premium feature that needs specific credentials to access"). Sin embargo, en OPCloud la UI **no indica** el gating: no hay badge, candado, ni botón "upgrade"; el usuario sin credenciales simplemente no ve el item. Esta HU propone gating **visible y honesto** como divergencia del repo.

**Criterios de aceptación:**
- **Dado** que soy usuario sin credenciales premium, **cuando** entro a Settings > Analyze Model, **entonces** veo el item `Conocimiento del Modelo` pero con un badge `Premium` visible (no oculto).
- **Dado** que hago clic en `Conocimiento del Modelo` sin credenciales, **cuando** se renderiza el panel, **entonces** veo un mensaje explicativo (`This feature requires premium credentials. Contact your admin.`) en lugar de los toggles y botones.
- **Dado** que soy admin, **cuando** configuro las credenciales de un usuario, **entonces** puedo habilitar/deshabilitar Conocimiento del Modelo por usuario o por grupo.
- **Dado** que el gating es por backend, **cuando** un usuario intenta ejecutar DistMult sin credenciales (vía hack o URL directa), **entonces** el backend rechaza con 403 y la UI muestra un error coherente.

**Reglas y restricciones:**
- Gating debe ser **visible** en UI (divergencia explícita de OPCloud).
- Gating debe ser **enforced** en backend (no solo UI, por seguridad).
- El admin puede configurar gating a nivel de organización (todo el grupo premium) o por usuario.

**Modelo de datos tocado:**
- `user.permissions.modelKnowledge` — `boolean` — persistente (en servidor).
- `org.plan.includesModelKnowledge` — `boolean` — persistente.

**Dependencias:**
- Bloqueada por: HU-D0.001 (si no hay item en UI, no hay gating).
- Relaciona: EPICA-40 (colaboración permisos), EPICA-80 (config user org).

**Integraciones:**
- Backend de auth/permisos.

**Notas de evidencia:**
- Fuente: §1 ("premium feature"), §4 bullet "Credenciales insuficientes", §9 bullet "Premium como clase no visible".
- Transcripción: "model knowledge is a premium feature that needs specific credentials to access".
- Clase de afirmación: observado (gating existe) + divergencia (UI debe mostrarlo, OPCloud no).
- Etiqueta: `divergencia-opcloud`.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [permisos, premium, gating, conocimiento-faltante, divergencia-opcloud].

---

### HU-D0.016 — Resaltar cosa del canvas al pasar el cursor sobre una fila de sugerencia

**Actor primario:** IA.
**Actores secundarios:** ME.
**Tipo:** mixto.
**Nivel categórico:** V primario; U.
**Superficie UI:** tabla de sugerencias + canvas (cross-panel).
**Gesto canónico:** hover sobre fila de la tabla.

**Historia:**
> Como analista, quiero que al pasar el cursor sobre una fila de la tabla de sugerencias se resalten las dos cosas (`Source` y `Target`) en el canvas para ubicar visualmente dónde está el hueco que el algoritmo detectó.

**Contexto de negocio:**
Observación del corpus: "clicar una fila de la tabla no lleva al canvas ni resalta la cosa mencionada. Las filas son texto plano no interactivo." Esta es una limitación severa: el analista debe hacer búsqueda mental del nombre en el canvas. Con modelos grandes, esto rompe el flujo. La divergencia propuesta añade un hover que no muta el modelo pero sí el render (halo transitorio).

**Criterios de aceptación:**
- **Dado** que tengo el panel Conocimiento Faltante con tabla cargada y el canvas visible en split-view o modal-overlay, **cuando** paso el cursor sobre una fila, **entonces** las dos cosas mencionadas (Source y Target) se resaltan en el canvas con un halo azul transitorio.
- **Dado** que el cursor sale de la fila, **cuando** el hover termina, **entonces** el halo se desvanece.
- **Dado** que la cosa del Source o Target no existe visiblemente en el OPD actual (p.ej. está en otro OPD por in-zoom), **cuando** hago hover, **entonces** el halo no aparece pero un tooltip indica `Thing not in current OPD`.
- **Dado** que el canvas no está visible (panel Settings fullscreen), **cuando** hago hover, **entonces** el halo no se activa (requiere split o modal — ver HU-D0.016a para la sub-división futura).

**Reglas y restricciones:**
- El hover solo **lee** el modelo y el render; **no muta** nada.
- El halo es consistente con el halo de selección general (EPICA-10 HU-10.019).
- Requiere que Settings pueda mostrarse con el canvas visible — arquitectura UI actual de OPCloud no lo permite, este repo debe proveerlo (o usar modal).

**Modelo de datos tocado:**
- `ui.canvas.highlightedThings` — array de IDs — transitorio.

**Dependencias:**
- Bloqueada por: HU-D0.006.
- Relaciona: arquitectura UI de Settings (cambio estructural — se puede diferir).

**Integraciones:**
- Renderer del canvas.

**Notas de evidencia:**
- Fuente: §9 bullet "Ausencia de navegación contextual" (como observación crítica).
- Clase de afirmación: divergencia propuesta.
- Etiqueta: `divergencia-opcloud`.

**Prioridad:** C.
**Tamaño:** M.
**Etiquetas:** [ui, hover, canvas, conocimiento-faltante, divergencia-opcloud].

---

### HU-D0.017 — Aceptar sugerencia inline creando el enlace en el modelo

**Actor primario:** ME (modelador experto — mutar el modelo es decisión suya).
**Actores secundarios:** IA (quien prepara las sugerencias).
**Tipo:** mixto.
**Nivel categórico:** K (kernel — crea `link`) primario; V (render) y U (popup).
**Superficie UI:** tabla de sugerencias (fila con botón `Accept`).
**Gesto canónico:** clic en botón `Accept` de la fila.

**Historia:**
> Como modelador experto, quiero aceptar una sugerencia de la tabla con un clic para crear el link en el modelo sin cambiar de panel ni volver al canvas manualmente.

**Contexto de negocio:**
Observación crítica: "Ausencia de acción 'Apply suggestion': no hay botón 'Crear este enlace en el modelo'. El analisis es read-only respecto al modelo." Es la principal limitación UX del feature en OPCloud: el analista debe recordar la sugerencia y volver al canvas a crearla manualmente, perdiendo la trazabilidad con el analisis. Esta divergencia habilita el ciclo **analizar → aceptar → modelo actualizado** sin fricción.

**Criterios de aceptación:**
- **Dado** que una fila muestra `Source | Relation | Target | Confidence`, **cuando** miro la fila, **entonces** tiene un botón `Accept` (o icono check) al final.
- **Dado** que hago clic en `Accept`, **cuando** se ejecuta, **entonces** el kernel crea un `link` con `source=<source thing ID>`, `target=<target thing ID>`, `type=<relation>`, y la cosa se persiste en IndexedDB (EPICA-30).
- **Dado** que el link se creó, **cuando** miro el canvas, **entonces** el enlace aparece renderizado con las convenciones visuales OPM (HU-10.xxx).
- **Dado** que acepté, **cuando** miro la fila, **entonces** queda marcada como `Accepted` (check verde) y ya no participa del filtrado.
- **Dado** que el motor sugiere una relación inválida para los tipos de source/target (rara en AA bien entrenado, pero posible), **cuando** hago clic en `Accept`, **entonces** el validador del kernel (EPICA-1C) rechaza y muestra un error claro; la fila permanece en la tabla.
- **Dado** que acepté una sugerencia y hago undo (EPICA-90), **cuando** se revierte, **entonces** el link desaparece del modelo y la fila vuelve a estar pendiente.

**Reglas y restricciones:**
- El botón Accept llama al mismo comando del kernel que usa la creación manual (HU-10.011), garantizando consistencia semántica.
- El `confidence` del AA **no se persiste** en el link creado — los links son iguales vengan de AA o de creación manual (principio: modelo tiene semántica única, no marcas de origen).
- Aceptar no cierra el panel Conocimiento Faltante (el analista puede seguir revisando).

**Modelo de datos tocado:**
- `link.id` — UUID nuevo — persistente.
- `link.type` — string enum (relation) — persistente.
- `link.source` — thing ID — persistente.
- `link.target` — thing ID — persistente.
- `ui.settings.modelKnowledge.suggestions[i].status` — `"pending" | "accepted" | "rejected"` — transitorio.

**Dependencias:**
- Bloqueada por: HU-D0.006, HU-10.011 (comando de creación de link del kernel).
- Relaciona: EPICA-1C (validación), EPICA-90 (undo).

**Integraciones:**
- Kernel OPM.
- OPL pane (reflejo inmediato).
- OPD Navigator.

**Notas de evidencia:**
- Fuente: §9 bullet "Ausencia de acción 'Apply suggestion'" (como limitación observada).
- Clase de afirmación: divergencia propuesta.
- Etiqueta: `divergencia-opcloud`.

**Prioridad:** C (alto valor UX, pero requiere todo el pipeline AA antes).
**Tamaño:** L.
**Etiquetas:** [kernel, accept, conocimiento-faltante, divergencia-opcloud, cierre-del-loop].

---

### HU-D0.018 — Rechazar sugerencia inline sin crear enlace (ocultar + recordar)

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; P (persistencia del rechazo).
**Superficie UI:** tabla de sugerencias (fila con botón `Reject`).
**Gesto canónico:** clic en botón `Reject`.

**Historia:**
> Como modelador experto, quiero rechazar una sugerencia con un clic para ocultarla de la tabla y recordar que la descarté, evitando re-evaluar la misma sugerencia si corro el analisis de nuevo.

**Contexto de negocio:**
Sin un rechazo explícito, el analista debe re-evaluar todas las sugerencias cada vez que corre DistMult, lo que hace el flujo repetitivo e ineficiente. El rechazo persistido permite **refinar iterativamente** el modelo: aceptar las buenas, rechazar las falsas, correr de nuevo, y ver solo las nuevas.

**Criterios de aceptación:**
- **Dado** que una fila pendiente está visible, **cuando** hago clic en `Reject`, **entonces** la fila desaparece de la tabla visible.
- **Dado** que rechacé una fila, **cuando** re-ejecuto DistMult, **entonces** la misma sugerencia no reaparece (el cliente la filtra contra el set de rechazadas).
- **Dado** que rechacé N filas, **cuando** miro un toggle `Show rejected` en la cabecera del panel, **entonces** puedo volver a verlas y des-rechazar (undo del reject).
- **Dado** que rechacé una sugerencia y luego la creo manualmente en el canvas por otra vía, **cuando** re-corro DistMult, **entonces** el sistema detecta que el link existe y no la re-sugiere (comportamiento del motor AA, no del reject).
- **Dado** que guardo el modelo (EPICA-30), **cuando** lo reabro más tarde, **entonces** las sugerencias rechazadas persisten asociadas al modelo.

**Reglas y restricciones:**
- Rechazos persisten junto al modelo (no son UI-session).
- Rechazo es por `(source, relation, target)` exacta; si uno de los tres cambia (rename de thing), el rechazo pierde ancla — **abierto**: política de invalidación al renombrar.
- El contador (HU-D0.007) NO cuenta las rechazadas por defecto.

**Modelo de datos tocado:**
- `analysis.missingKnowledge.rejectedSuggestions` — array de `{source, relation, target, rejectedAt}` — persistente en el modelo.

**Dependencias:**
- Bloqueada por: HU-D0.017 (comparte infra de status).
- Relaciona: EPICA-30 (persistencia).

**Integraciones:**
- Persistencia del modelo.

**Notas de evidencia:**
- Fuente: divergencia propuesta; no observada en OPCloud.
- Clase de afirmación: divergencia propuesta.
- Etiqueta: `divergencia-opcloud`.

**Prioridad:** C.
**Tamaño:** M.
**Etiquetas:** [ui, reject, conocimiento-faltante, divergencia-opcloud, persistencia].

---

### HU-D0.019 — Aplicar batch fix sobre múltiples sugerencias seleccionadas

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categórico:** K primario (crea N links atómicamente); U.
**Superficie UI:** tabla de sugerencias (checkboxes por fila + botones `Accept Selected`, `Reject Selected`).
**Gesto canónico:** selección múltiple + clic en botón de acción.

**Historia:**
> Como modelador experto, quiero seleccionar múltiples sugerencias con checkboxes y aceptarlas o rechazarlas en lote para acelerar el refinamiento de modelos con muchos huecos evidentes.

**Contexto de negocio:**
Cuando el motor AA devuelve 164 sugerencias y el analista confía en el top-30 con `confidence > 0.52`, aceptarlas una por una es tedioso. El batch habilita un flujo tipo "revisar, marcar, ejecutar" que se alinea con cómo los analistas trabajan en herramientas de AA más maduras (p.ej. labeling tools).

**Criterios de aceptación:**
- **Dado** que la tabla tiene N filas, **cuando** miro la cabecera, **entonces** tiene un checkbox master que selecciona/deselecciona todas.
- **Dado** que cada fila tiene un checkbox, **cuando** selecciono 5 filas, **entonces** la cabecera indica `5 selected` y se habilitan los botones `Accept Selected` y `Reject Selected`.
- **Dado** que hago clic en `Accept Selected` con 5 filas marcadas, **cuando** se ejecuta, **entonces** el kernel crea los 5 links en una transacción atómica (o rollback si uno falla); un diálogo de confirmación aparece antes de la ejecución (`Create 5 links?`).
- **Dado** que 3 de 5 pasan la validación y 2 fallan, **cuando** la operación termina, **entonces** se crea un log de resultados por fila (3 verdes, 2 rojas con razón) y las filas fallidas quedan en la tabla con su estado.
- **Dado** que hago `Reject Selected`, **cuando** se ejecuta, **entonces** las N filas se marcan como rechazadas (HU-D0.018) en una operación.
- **Dado** que hago undo (EPICA-90), **cuando** ejecuto undo, **entonces** **abierto**: ¿se revierte el batch entero o una fila a la vez?

**Reglas y restricciones:**
- Batch accept crea un commit de evento en el event log del modelo (EPICA-30) para permitir undo coherente.
- Diálogo de confirmación obligatorio para batch > 1 (mitigación de clics fat-fingered).
- Ordenamiento de ejecución: por confianza descendente (consistente con orden visible).

**Modelo de datos tocado:**
- `ui.settings.modelKnowledge.selectedSuggestions` — array de IDs — transitorio.
- Event log entry `{type: "batch-accept", items: [...]}` — persistente.

**Dependencias:**
- Bloqueada por: HU-D0.017, HU-D0.018.
- Relaciona: EPICA-90 (undo), EPICA-30 (event log).

**Integraciones:**
- Kernel (creación atómica multi-link).
- Event log.

**Notas de evidencia:**
- Fuente: divergencia propuesta; no observada en OPCloud.
- Clase de afirmación: divergencia propuesta.
- Etiqueta: `divergencia-opcloud`.

**Prioridad:** C.
**Tamaño:** L.
**Etiquetas:** [batch, accept, conocimiento-faltante, divergencia-opcloud, kernel].

---

### HU-D0.020 — Codificar severidad visual por color según confianza (semántica)

**Actor primario:** IA.
**Tipo:** opcloud-ui.
**Nivel categórico:** V.
**Superficie UI:** tabla de sugerencias (columna `Confidence`).
**Gesto canónico:** ninguno (render).

**Historia:**
> Como analista, quiero que las filas de la tabla tengan codificación de color por rango de confianza (verde alta, amarillo media, rojo baja) para priorizar visualmente las sugerencias de mayor valor al escanear la tabla.

**Contexto de negocio:**
Observación del corpus: "Ranking denso sin severidad visual: las 164 sugerencias van de 0.500 a 0.524 pero no hay código de color ni barra de progreso. Solo el valor numérico." Con 164 filas y confianzas apretadas en un rango estrecho, el ojo humano necesita señales visuales para priorizar. Esta HU propone una codificación conservadora que no compite con la semántica OPM del canvas.

**Criterios de aceptación:**
- **Dado** que la tabla tiene N filas con confianzas variables, **cuando** miro la columna `Confidence`, **entonces** cada celda tiene un fondo de color suave según el rango:
  - `>= 0.9` — verde alta (máxima confianza; rara).
  - `0.7 - 0.89` — verde.
  - `0.5 - 0.69` — amarillo (el caso típico según corpus).
  - `< 0.5` — no aparece (el motor descarta).
- **Dado** que un rango de confianza es `0.5 - 0.69`, **cuando** miro, **entonces** el color amarillo indica "sugerencia baja-media, revisar con contexto" sin penalizarla.
- **Dado** que el daltónico usa el sistema, **cuando** mira la tabla, **entonces** hay un texto complementario o iconografía (no solo color) que transmite la información.
- **Dado** que el usuario prefiere UI austera (observación del corpus: OPCloud es austera), **cuando** hay un toggle `Show severity colors` (default on), **entonces** puede desactivar los colores y volver a tabla mono-color.

**Reglas y restricciones:**
- Colores compatibles con modo oscuro (no saturados).
- El color no debe competir con los colores semánticos del canvas OPM (verde dashed = environmental, etc.).

**Modelo de datos tocado:**
- `ui.settings.modelKnowledge.showSeverityColors` — `boolean` default `true` — persistente user-preference.

**Dependencias:**
- Bloqueada por: HU-D0.006.

**Integraciones:**
- Renderer de tabla.

**Notas de evidencia:**
- Fuente: §9 bullet "Ranking denso sin severidad visual".
- Clase de afirmación: divergencia propuesta (respetuosa con UX austera).
- Etiqueta: `divergencia-opcloud`.

**Prioridad:** C.
**Tamaño:** S.
**Etiquetas:** [ui, render, severidad, conocimiento-faltante, divergencia-opcloud].

---

### HU-D0.021 — Ejecutar analisis en local sin enviar datos del modelo al exterior

**Actor primario:** IA.
**Actores secundarios:** AO (responsable de la política de privacidad).
**Tipo:** opcloud-ui.
**Nivel categórico:** X (privacidad de integración) primario; C (config).
**Superficie UI:** page-model-knowledge (indicador de modo) + settings de privacidad.
**Gesto canónico:** ninguno (política).

**Historia:**
> Como analista trabajando con modelos de datos sensibles, quiero que el analisis de conocimiento faltante se ejecute completamente en mi navegador sin enviar el modelo a ningún servidor externo para no filtrar información de negocio.

**Contexto de negocio:**
Observación crítica: "DistMult corre in-browser" (privacidad-friendly), pero "R-GCN via script Python remoto" (requiere enviar el KG al servidor). Para modelos clínicos (HDOS), gubernamentales o con PII, el envío de datos al servidor es un **bloqueador legal**. La política debe ser explícita, opcional, y con indicador visible de modo.

**Criterios de aceptación:**
- **Dado** que hago clic en `DistMult Reasoning`, **cuando** se ejecuta, **entonces** el procesamiento ocurre 100% en el cliente sin request de red al backend de AA.
- **Dado** que hago clic en `R-GCN Reasoning` y el modelo está marcado como "sensible" (setting user/org), **cuando** se ejecuta, **entonces** el sistema muestra un diálogo de confirmación: `R-GCN requires sending the model to the server. Continue? [Cancel] [Continue]`.
- **Dado** que la organización tiene política "no data leaves browser", **cuando** el admin la configura, **entonces** R-GCN queda deshabilitado para todos los usuarios y el tooltip explica por qué.
- **Dado** que el panel Conocimiento Faltante está visible, **cuando** miro la cabecera, **entonces** hay un indicador discreto del modo actual (`Running locally` verde / `Cloud processing` amarillo) junto al botón activo.
- **Dado** que un desarrollador del repo quiere auditar el flujo de red, **cuando** ejecuta DistMult, **entonces** el DevTools confirma 0 requests de red hacia endpoints AA.

**Reglas y restricciones:**
- DistMult es **local-first por construcción** (motor JS in-browser).
- R-GCN requiere envío; el repo debe documentarlo claramente en el tooltip y ofrecer opt-in explícito.
- Política de org sobrescribe preferencia user.

**Modelo de datos tocado:**
- `user.preferences.localFirst` — `boolean` — persistente.
- `org.policy.allowCloudML` — `boolean` — persistente.
- `model.metadata.sensitive` — `boolean` — persistente en el modelo.

**Dependencias:**
- Bloqueada por: HU-D0.005, HU-D0.011.
- Relaciona: EPICA-80 (config user org).

**Integraciones:**
- Backend de AA (para R-GCN, opt-in).
- Sistema de auth/permisos.

**Notas de evidencia:**
- Fuente: §3.6 (script Python remoto para R-GCN), §11 pregunta abierta sobre corpus de entrenamiento.
- Clase de afirmación: divergencia propuesta con motivación fuerte (privacidad).
- Etiqueta: `divergencia-opcloud`.

**Prioridad:** S (privacidad es must en dominios clínico/gobierno).
**Tamaño:** M.
**Etiquetas:** [privacy, local-first, conocimiento-faltante, divergencia-opcloud].

---

### HU-D0.022 — Ver reporting agregado de analisis AA ejecutados (historial de runs)

**Actor primario:** IA.
**Tipo:** opcloud-ui.
**Nivel categórico:** L (lente — vista derivada).
**Superficie UI:** page-model-knowledge (pestaña o sub-panel `History`).
**Gesto canónico:** clic en pestaña `History`.

**Historia:**
> Como analista, quiero ver el historial de runs del motor AA sobre este modelo (timestamp, algoritmo, umbral, N sugerencias, N aceptadas, N rechazadas) para llevar trazabilidad del analisis y medir la evolución del modelo.

**Contexto de negocio:**
Observación del corpus: "las sugerencias no se serializan en el OPD; viven solo en memoria de la página Settings. Al cerrar Settings y volver a abrir se pierden". Esta volatilidad hace imposible cualquier métrica longitudinal. Un historial persistido habilita: ¿el modelo está mejorando? ¿cuántas sugerencias estoy aceptando cada run? ¿cuáles ignoro sistemáticamente?

**Criterios de aceptación:**
- **Dado** que he ejecutado DistMult 3 veces a lo largo del tiempo sobre este modelo, **cuando** abro la pestaña `History`, **entonces** veo una tabla de 3 filas con columnas: `Timestamp`, `Algorithm`, `Umbral`, `Total Suggestions`, `Accepted`, `Rejected`, `Pending`.
- **Dado** que una fila de historial muestra 164 total, 20 aceptadas, 30 rechazadas, **cuando** hago clic en la fila, **entonces** se expande mostrando las 164 sugerencias de ese run y su estado individual.
- **Dado** que un run es de hace 2 meses y el modelo ha cambiado, **cuando** miro su detalle, **entonces** las sugerencias reflejan el estado del modelo en ese momento (snapshot) — el historial es inmutable.
- **Dado** que ejecuto un nuevo run, **cuando** termina, **entonces** se agrega una fila nueva al historial con los datos actuales.
- **Dado** que el historial tiene >10 entradas, **cuando** miro la UI, **entonces** hay paginación o scroll.
- **Dado** que el modelo se renombra o se hace una versión mayor, **cuando** se consulta el historial, **entonces** sigue asociado al modelo (por ID, no por nombre).

**Reglas y restricciones:**
- El historial es **persistente** en el modelo (no UI-session).
- Cada run guarda: algoritmo, timestamp, umbral, sugerencias generadas, aceptadas, rechazadas, snapshot resumido del modelo en ese momento (N things, N links).
- Borrar un run del historial requiere permiso de owner del modelo.
- El historial NO se exporta al OPD canvas (principio: canvas sigue siendo vista principal del modelo, historial es meta).

**Modelo de datos tocado:**
- `model.analysisHistory[]` — array de `{id, algorithm, timestamp, umbral, suggestions[], counts}` — persistente.

**Dependencias:**
- Bloqueada por: HU-D0.005, HU-D0.017, HU-D0.018.
- Relaciona: EPICA-30 (persistencia del modelo).

**Integraciones:**
- Persistencia IndexedDB (EPICA-30).

**Notas de evidencia:**
- Fuente: §6 ("Persistencia en el modelo: ninguna"), §11 pregunta abierta sobre caching entre sesiones.
- Clase de afirmación: divergencia propuesta.
- Etiqueta: `divergencia-opcloud`.

**Prioridad:** C.
**Tamaño:** M.
**Etiquetas:** [reporting, historial, conocimiento-faltante, divergencia-opcloud, persistencia].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **QD0.1**: ¿Qué muestra el panel cuando el motor AA retorna 0 sugerencias? OPCloud no lo aclara; este repo lo resuelve con divergencia en HU-D0.014.
- **QD0.2**: ¿Se puede mover el umbral por encima del máximo observado (~0.524)? ¿Hay tope duro o se vacía progresivamente? Afecta HU-D0.008.
- **QD0.3**: ¿El botón `R-GCN Reasoning` aparece visualmente degradado (grayed out) cuando está deshabilitado, o solo falla al clic? Afecta HU-D0.011.
- **QD0.4**: ¿Cuál es el catálogo completo de relaciones que el algoritmo puede sugerir? Se observaron 6 (`Aggregation`, `Generalization`, `Consumption`, `Result`, `Instrument`, `Invocation`). ¿Puede sugerir enlaces de efecto (bidireccional), tagged links, probabilísticos, XOR/OR, estados? Afecta el diseño del modelo de datos de HU-D0.006, HU-D0.017.
- **QD0.5**: ¿Qué corpus entrena al algoritmo? ¿Solo el modelo actual o hay pre-training sobre biblioteca OPM global? La transcripción sugiere in-browser/per-model, pero no se declara. Afecta HU-D0.021 (privacy).
- **QD0.6**: ¿Qué metadata exacta contiene la segunda pestaña del Excel? Transcripción menciona "what we filtered for and how many suggestions we have" — formato no precisado. Afecta HU-D0.012.
- **QD0.7**: ¿Las sugerencias se cachean entre sesiones o se recalculan siempre? Afecta HU-D0.022.
- **QD0.8**: ¿El icono de copiar al clipboard produce CSV, TSV o texto con separadores custom? Afecta HU-D0.013.
- **QD0.9**: ¿Existe integración con Generative AI (EPICA-A2) para convertir una sugerencia en requisito? **Hipótesis**: no, son pipelines independientes. Pendiente de confirmar.
- **QD0.10**: ¿El algoritmo distingue entre cosas ambientales (dashed) y sistémicas? ¿Distingue físico/informático? ¿O trata todas las cosas como nodos homogéneos? Crítico para interpretar las sugerencias — una sugerencia `Agent` desde un informatical sería inválida (ver HU-10.010).
- **QD0.11**: ¿Política de invalidación del rechazo al renombrar una thing involucrada? Afecta HU-D0.018.
- **QD0.12**: ¿El `confidence` del motor AA debe persistirse en el link aceptado? La HU-D0.017 decide "no" por defecto (modelo único, sin marcas de origen), pero podría ser una pestaña de metadata en EPICA-42 (notes).

## Referencias cruzadas

- **Doc fuente**: `opcloud-reverse/d0-analysis-missing-knowledge.md`.
- **Épica hermana**: **EPICA-D1** (analysis-informativity) — comparte página y panel, complementaria conceptualmente.
- **Épicas que dependen**:
  - **EPICA-10** (creación de things/links) — HU-D0.017 delega en HU-10.011 para la creación del link.
  - **EPICA-1C** (validaciones) — el validador rechaza sugerencias inválidas en batch accept (HU-D0.019).
  - **EPICA-30** (persistencia save/load) — el historial (HU-D0.022), los rechazados persistidos (HU-D0.018) y el event log (HU-D0.019) requieren la capa de persistencia.
  - **EPICA-40** (colaboración permisos) y **EPICA-80** (config user org) — gating premium (HU-D0.015) y política cloud/local (HU-D0.021).
  - **EPICA-90** (shortcuts) — undo de batch (HU-D0.019).
  - **EPICA-A2** (generative AI) — posible integración (pregunta abierta QD0.9).
- **Invariantes del repo tocados**:
  - `src/nucleo/validacion/` — validador rechaza sugerencias inválidas (HU-D0.017, HU-D0.019).
  - `src/nucleo/tipos.ts` — las 6 relaciones del motor AA deben alinearse con el catálogo OPM (ver QD0.4).
  - `src/persistencia/` — historial, rechazados, event log (HU-D0.018, HU-D0.019, HU-D0.022).
  - `src/render/jointjs/` — halo transitorio para hover (HU-D0.016).
- **SSOT OPM**: la aceptación de una sugerencia debe cumplir las reglas gramaticales del link (V-xx, §3 y §8 de SSOT). El motor AA reifica `Invocation` en pie de igualdad con relaciones estructurales — ver §9 bullet del doc fuente y QD0.10.
- **Constitución categórica** (`docs/ARQUITECTURA-CATEGORICA.md`): el módulo Conocimiento Faltante es un **funtor analítico L → L** (lente sobre lente: lee el modelo, produce una vista derivada de "lo que falta"). Al aceptar (HU-D0.017) se convierte en un **morfismo K** (mutación kernel). La separación categórica entre "sugerir" (L) y "aplicar" (K) es crucial: respeta la invariante de inmutabilidad del kernel hasta presión explícita del usuario.
