# spec-forja OPL — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Producir `docs/canon-opm/spec-forja-opl.md`, la SSOT OPL única, bidireccional y operativa de OPFORJA, conforme 100% a las specs KORA aplicables.

**Architecture:** Documento KORA/MD v12 familia `spec` (prescriptiva). Eje ontológico con contrato por constructo; cuerpo envuelto en el esqueleto `spec` (Definición/Definiciones/Precedencia/…/Invariantes/Validación/Migración). Producción **secuencial por sección** (un solo archivo → tareas en orden, agrupadas en olas para checkpoints) — NO paralela sobre el mismo archivo. Cada tarea extrae de 5 fuentes con precedencia canon-repo, traza al código `app/src/opl/**`, y verifica conformidad antes de commitear.

**Tech Stack:** Markdown (KORA/MD v12 + spec-md v1), `rg` para gates de verificación, lectura de fuentes en `~/kora` y `docs/canon-opm/reglas-opm-estrictas.md`, trazas a TypeScript en `app/src/opl/`.

**Spec de referencia:** `docs/superpowers/specs/2026-05-26-spec-forja-opl-design.md` (aprobada).

---

## Convenciones compartidas (LECTURA OBLIGATORIA para cada tarea)

Todo subagente que ejecute una tarea DEBE recibir e internalizar este bloque.

### Esquema de entrada (contrato por constructo / forma de oración)

Cada forma de oración OPL es una entrada con **ID estable** (reusar IDs del canon vigente: D1–D13, T1–TS5, H*, E*, C*, SE*, RF*, SSE*, CX*, CM*; añadir IDs nuevos para lo no cubierto). Campos fijos por entrada:

- **ID** · **Plantilla(s)** (es-CL, marcado **objeto**/*proceso*/`estado`) · **Emisión** (qué dispara) · **Supresión** (placeholders, esencia, plegado, refinamiento) · **Tokenización** (verbo/cópula + refs entidad/enlace para `refsHints`) · **Orden** · **Composabilidad** (ejes de coordinación + zonas prohibidas, ver §9) · **Reverse** (parsea/muta o solo-display; cómo se descompone si es prosa) · **Edición** (editable inline? edición→mutación) · **Interacción** (hover/navegación/filtrado) · **Roundtrip** (simetría + fixture) · **Edge cases** · **Traza a código** (`generador.ts §x` · `parser/*.ts:L###` · fixture) · **Procedencia** (fuente canónica, como `Rationale:`).

### Precedencia de fuentes (en conflicto)

1. `docs/canon-opm/reglas-opm-estrictas.md §4–§7` + `~/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-opl-es.md` (mandan).
2. `~/kora/artifacts/knowledge/_SCRIPTORIUM/INBOX/opm-libro-curado/` (libro Dori — llena vacíos).
3. `~/kora/artifacts/knowledge/_SCRIPTORIUM/INBOX/opm/transcripciones-videos-opcloud.txt` (OPCloud — observacional).
4. `~/kora/artifacts/knowledge/_SCRIPTORIUM/INBOX/curso-dov-dori/` (curso — pedagógico).

Cuando el canon calla: marcar **no-canonizado** o **extensión declarada**; NUNCA inventar canon (R-ZNC-2).

### Forma KORA (conformidad 100%)

- **RFC 2119**: toda obligación usa DEBE / NO DEBE / DEBERÍA / NO DEBERÍA / PUEDE (mayúsculas, es-CL). Sin hedging.
- **Patrón regla+ejemplo+traza** (spec-md §8): reglas de lectura ambigua llevan `Correcto:`/`Incorrecto:`; justificación pragmática en `Rationale:` (NO `Traces to:`, reservado a Formal Layer KORA).
- **Sin grasa** (md-spec §5.3, spec-md §7): prosa solo si justifica / previene ambigüedad / contextualiza / advierte límite de enforcement. Estructura recuperable > prosa ornamental. Telegrafización.
- **Idioma**: OPL y documento en es-CL. Sin EN↔ES.

### Gate de verificación por tarea (antes de cada commit)

1. **Cobertura**: cada sub-constructo de las fuentes citadas tiene su entrada (o gap marcado).
2. **Schema completo**: cada entrada tiene todos los campos del esquema (los no aplicables se marcan "n/a — razón").
3. **Forma KORA**: `rg -n 'DEBE|NO DEBE|DEBERÍA|PUEDE' <sección>` retorna obligaciones; cero hedging ("idealmente", "sería bueno"); cero EN↔ES.
4. **Traza**: cada entrada apunta a `app/src/opl/**` o queda marcada `GAP`.
5. **Commit** con mensaje `docs(spec-forja): <sección>`.

### Archivo objetivo

- Crear/extender: `docs/canon-opm/spec-forja-opl.md` (un solo archivo, secciones en orden).
- Las tareas APENDIZAN su sección al final del cuerpo en construcción; el orden final del esqueleto se reconcilia en la Tarea 17.

---

## Task 0: Scaffold — frontmatter KORA + preámbulo `spec`

**Files:**
- Create: `docs/canon-opm/spec-forja-opl.md`

- [ ] **Step 1: Crear el archivo con frontmatter KORA/MD v12**

Frontmatter exacto (familia `spec`, URN nominal, ≥3 tags, `lang: es`):

```yaml
---
_manifest:
  urn: "urn:opforja:kb:spec-forja-opl"
  provenance:
    created_by: "opforja"
    created_at: "2026-05-26"
    source: "docs/canon-opm/reglas-opm-estrictas.md; ~/kora/.../opm-opl-es.md; opm-libro-curado; transcripciones-videos-opcloud; curso-dov-dori"
version: "1.0.0"
status: borrador
tags: [opl, opforja, spec, generacion, parser]
lang: "es"
extensions:
  opforja:
    family: spec
relations:
  depends:
    - "urn:fxsl:kb:opl-es"
    - "urn:fxsl:kb:opm-es"
  refines:
    - "docs/canon-opm/reglas-opm-estrictas.md"
---
```

- [ ] **Step 2: Escribir el preámbulo `spec`** (secciones `## Definición`, `## Definiciones`, `## Precedencia`, `## Convenciones`)

- `## Definición`: alcance (SSOT OPL bidireccional + operativa de OPFORJA) y audiencia (agentes de desarrollo y de generación/parseo OPL).
- `## Definiciones`: términos normativos — oración atómica, oración compuesta, sub-span, hecho, `ref`, `hint`, token, esencia, afiliación, placeholder, plegado, display-vs-canónico.
- `## Precedencia` (spec-md §11): esta spec manda sobre la implementación OPL; bajo `reglas-opm-estrictas.md` para canon OPM nuclear; bajo la SSOT OPM externa. Usar RFC 2119.
- `## Convenciones`: tipografía, esquema de IDs, RFC 2119, patrón regla+ejemplo+traza, `Rationale:`/Procedencia, precedencia de fuentes, cómo leer una entrada.

- [ ] **Step 3: Verificar conformidad de frontmatter**

Run: `rg -n '_manifest:|family: spec|lang:|version:' docs/canon-opm/spec-forja-opl.md`
Expected: las 4 claves presentes; `tags` con ≥3 elementos.

- [ ] **Step 4: Commit**

```bash
git add docs/canon-opm/spec-forja-opl.md
git commit -m "docs(spec-forja): scaffold KORA/MD + preámbulo spec"
```

---

## Task 1: §1 Vocabulario fijo de verbos y cópulas

**Files:** Modify: `docs/canon-opm/spec-forja-opl.md`

**Fuentes:** `reglas §4.3` (líneas 387–446), `opm-opl-es §2`, libro Dori (cap. de OPL/links para matices de verbo).
**Traza:** `app/src/opl/generadores/refsHints.ts` (verbos), `procedural.ts`, `estructural.ts`.

- [ ] **Step 1:** Extraer el enum cerrado de verbos/cópulas (consume/genera/afecta/cambia/maneja/requiere/inicia/invoca/ocurre/existe/consta de/exhibe/son/es un/es una instancia de/se relaciona con/varía de/es de tipo/**puede estar**/se descompone/se despliega/se refina) y palabras clave, cada uno con: significado, familia que lo usa, traza al generador. Marcar **puede estar** (estados) y **puede ser** (especialización XOR) como reglas duras.
- [ ] **Step 2:** Gate de verificación (cobertura vs `opm-opl-es §2` + `reglas §4.3`; cada verbo con traza o GAP; RFC 2119).
- [ ] **Step 3:** Commit `docs(spec-forja): §1 vocabulario de verbos y cópulas`.

---

## Task 2: §2 Entidades

**Files:** Modify: `docs/canon-opm/spec-forja-opl.md`

**Fuentes:** `reglas §4.4` (cosas, 447–468), `reglas §2` (ontología, 104–215), `opm-opl-es §3`, `§14` (atributos), libro Dori (objetos/procesos/estados).
**Traza:** `app/src/opl/generadores/estructural.ts` (`oracionEntidad`, `oracionValorAtributo`), `designaciones.ts`, `app/src/modelo/nombresCanonicos.ts`.

- [ ] **Step 1:** Entradas para: objeto, proceso, estado (`puede estar`), atributo/valor, instancia, designación, esencia (física/informática), afiliación (sistémica/ambiental) — cada una con plantilla, emisión, supresión de placeholders (citar `nombresCanonicos.ts`), tokenización, traza.
- [ ] **Step 2:** Gate de verificación.
- [ ] **Step 3:** Commit `docs(spec-forja): §2 entidades`.

---

## Task 3: §3 Enlaces transformadores

**Files:** Modify: `docs/canon-opm/spec-forja-opl.md`

**Fuentes:** `reglas §4.5` (469–485), `reglas §5.2` (707–726), `opm-opl-es §4`, libro Dori.
**Traza:** `app/src/opl/generadores/procedural.ts`, `parser/parsear.ts`, `roundtrip.test.ts`.

- [ ] **Step 1:** Entradas T1–TS5: consumo, resultado, efecto, escindidos (TS4/TS5). Cada una: plantilla, emisión, asimetría consumo/resultado, reverse, roundtrip+fixture, traza.
- [ ] **Step 2:** Gate de verificación.
- [ ] **Step 3:** Commit `docs(spec-forja): §3 enlaces transformadores`.

---

## Task 4: §4 Enlaces habilitadores

**Files:** Modify: `docs/canon-opm/spec-forja-opl.md`

**Fuentes:** `reglas §4.6` (486–494), `reglas §5.3` (727–742), `opm-opl-es §5`.
**Traza:** `app/src/opl/generadores/procedural.ts`, `parser/parsear.ts`.

- [ ] **Step 1:** Entradas H1–HS2: agente, instrumento (+ etiquetados/estados). Plantilla, emisión, reverse, roundtrip, traza.
- [ ] **Step 2:** Gate de verificación.
- [ ] **Step 3:** Commit `docs(spec-forja): §4 enlaces habilitadores`.

---

## Task 5: §5 Modificadores de control

**Files:** Modify: `docs/canon-opm/spec-forja-opl.md`

**Fuentes:** `reglas §4.7–§4.9` (495–537), `reglas §5.4` (invocación), `§5.7` (excepción), `§6.1–§6.4` (modificadores, 813–859), `opm-opl-es §6–§8`.
**Traza:** `app/src/opl/generadores/procedural.ts`, `duracionMetadata.ts`, `parser/parser.condicionesExcepciones.test.ts`.

- [ ] **Step 1:** Entradas para evento, condición, excepción (sobretiempo `/`, subtiempo `//`), invocación/autoinvocación. Incluir naturaleza INPUT-only (§6.2) y asimetría bajo `e`/`c` (§6.3). Cada una con plantilla, emisión, reverse, roundtrip, traza.
- [ ] **Step 2:** Gate de verificación.
- [ ] **Step 3:** Commit `docs(spec-forja): §5 modificadores de control`.

---

## Task 6: §6 Enlaces estructurales

**Files:** Modify: `docs/canon-opm/spec-forja-opl.md`

**Fuentes:** `reglas §4.10` (538–585), `reglas §5.5–§5.6` (756–789), `opm-opl-es §9`.
**Traza:** `app/src/opl/generadores/estructural.ts` (`oracionEnlaceEstructural`, `oracionEnlaceEstructuralInteractivo`), `parser/parsear.ts`.

- [ ] **Step 1:** Entradas SE/SSE: agregación (`consta de`), exhibición (`exhibe`), generalización (`es un`/`puede ser`), instanciación (`es una instancia de`/`son instancias de`); etiquetados unidireccional/bidireccional. Plantilla, emisión, reverse, roundtrip, traza.
- [ ] **Step 2:** Gate de verificación.
- [ ] **Step 3:** Commit `docs(spec-forja): §6 enlaces estructurales`.

---

## Task 7: §7 Refinamiento / gestión de contexto

**Files:** Modify: `docs/canon-opm/spec-forja-opl.md`

**Fuentes:** `reglas §4.11` (586–611), `reglas §8` (refinamiento, 1008–1129), `opm-opl-es §10`, libro Dori (in-zoom/unfolding/state-expression).
**Traza:** `app/src/opl/generadores/refinamiento.ts`, `plegado.ts`, `bloquesJerarquicos.ts`, `parser/parser.designacionesPlegado.test.ts`.

- [ ] **Step 1:** Entradas CX/CM: in-zoom/out-zoom, unfolding/folding, expresión de estado; descomposición síncrona vs despliegue asíncrono; enlaces escindidos (remite §3); distribución de enlaces al descomponer. **Marcar la zona prohibida de composición en refinamiento** (preludio a §9). Plantilla, emisión, reverse, roundtrip, traza.
- [ ] **Step 2:** Gate de verificación.
- [ ] **Step 3:** Commit `docs(spec-forja): §7 refinamiento`.

---

## Task 8: §8 Combinatoria a nivel de modelo

**Files:** Modify: `docs/canon-opm/spec-forja-opl.md`

**Fuentes:** `reglas §6.4–§6.8` (849–938), `reglas §7` (abanicos, 939–1007), `opm-opl-es §11–§13`, `reglas §11.2` (zonas no-canonizadas).
**Traza:** `app/src/opl/generadores/abanico.ts`, `procedural.ts`.

- [ ] **Step 1:** Matriz del producto cartesiano `rol × modificador × multiplicidad × abanico (XOR/OR/AND) × probabilidad × ruta`. Cada celda relevante: **válida / inválida / no-canonizada**, plantilla compuesta, reglas de resolución (fuerza semántica + matriz de precedencia, consolidadas de `reglas §6.5/§6.6`). Zona no-canonizada `c+e` documentada.
- [ ] **Step 2:** Gate de verificación.
- [ ] **Step 3:** Commit `docs(spec-forja): §8 combinatoria a nivel de modelo`.

---

## Task 9: §9 Composición de oraciones y prosa OPL (CRÍTICA)

**Files:** Modify: `docs/canon-opm/spec-forja-opl.md`

**Fuentes:** transcript OPCloud (panel/prosa), `BUG-20260526T020225Z-f897bc/report.md`, memoria `project_opl_enumeracion_estructural_bloqueada`, libro Dori (ejemplos de OPL prosaica).
**Traza:** `app/src/opl/interaccion.ts` (`OplToken`, `OplReferencia`, `tokenizarConHints`, `lineaTocaReferencia`, `filtrarLineasPorReferencia`), `generadores/refsHints.ts` (`OplLineaPendiente`), `generadores/estructural.ts`.

- [ ] **Step 1:** Especificar el **álgebra de composición** con máxima precisión:
  - **Regla maestra**: oración compuesta = UNA línea con N sub-spans; cada hecho conserva `ref` + `hint`. `Correcto:`/`Incorrecto:` mostrando sub-span preservado vs fusión opaca (causa f897bc).
  - **Ejes y conectores**: sujeto-compartido/predicado-coordinado; predicado-compartido/destino-enumerado; sujeto-coordinado; condicional/temporal/causal; XOR/OR (remite §8). Conector serial es-CL `, … y` / `, … o`.
  - **Elegibilidad**: mismo eje, misma familia, orden determinista, preservación de tokens.
  - **Zonas prohibidas**: contexto refinamiento/despliegue (HU-50.015) NO fusiona en plural; toda composición que pierda refs/hints; toda oración no descomponible por parser.
  - **Roundtrip**: componer→parsear = identidad sobre el conjunto de hechos.
  - **Configuración**: prosa atómica vs compuesta = opción display, no altera canónico.
- [ ] **Step 2:** Gate de verificación (cada regla con keyword RFC 2119; regla maestra con `Correcto:`/`Incorrecto:`; traza a `interaccion.ts`).
- [ ] **Step 3:** Commit `docs(spec-forja): §9 composición de prosa OPL`.

---

## Task 10: §10 Multiplicidad · §11 Ruta · §12 Plegado

**Files:** Modify: `docs/canon-opm/spec-forja-opl.md`

**Fuentes:** `reglas §6.7` (multiplicidad, 912–931), `reglas §4.12` (ruta, 612–620), `opm-opl-es §12`, `§13`; plegado: `reglas §8.10`, `opm-opl-es §10`.
**Traza:** `app/src/opl/generadores/refsHints.ts` (`nombreOplExtremo`/multiplicidad), `bloquesJerarquicos.ts`, `plegado.ts`.

- [ ] **Step 1:** §10 multiplicidad/cardinalidad (símbolos `?`/`*`/`+`/default 1..1, tipos computacionales). §11 etiquetas de ruta (`Por ruta`, restricción local consumo/resultado como extensión declarada). §12 plegado/despliegue display (bloques jerárquicos). Cada entrada con plantilla, traza.
- [ ] **Step 2:** Gate de verificación.
- [ ] **Step 3:** Commit `docs(spec-forja): §10–§12 multiplicidad, ruta, plegado`.

---

## Task 11: §13 Presentación del panel · §14 Interacción OPL↔OPD

**Files:** Modify: `docs/canon-opm/spec-forja-opl.md`

**Fuentes:** transcript OPCloud (panel: numeración, minimizar, hover, edición inline), `opm-opl-es §1.7`.
**Traza:** `app/src/opl/panel.ts`, `interaccion.ts`, `generadores/refsHints.ts`, `app/src/opl/generar.ts` (orden global).

- [ ] **Step 1:** §13 orden global de oraciones, numeración, plegado-display, visibilidad de esencia, minimizar. §14 tokens/referencias (entidad/enlace), hover bidireccional, navegación por click, filtrado por selección/referencia, **resolución por sub-span (§9)**. Reglas RFC 2119 + traza.
- [ ] **Step 2:** Gate de verificación.
- [ ] **Step 3:** Commit `docs(spec-forja): §13–§14 panel e interacción`.

---

## Task 12: §15 Edición · §16 Configuración · §17 Modos de fallo

**Files:** Modify: `docs/canon-opm/spec-forja-opl.md`

**Fuentes:** transcript OPCloud (edición inline de nombres/propiedades), `app/src/opl/clasificadorEdicion.ts`, `edicionCanvas.ts`, `opciones.ts`, `parser/aplicar.ts`.
**Traza:** los mismos módulos.

- [ ] **Step 1:** §15 clasificación de líneas (`aplicable`/`no-aplicable`/`ignorada-vacía`/`sin-cambio`), razones de no-aplicabilidad, edición→mutación, editable vs bloqueado, edición de oraciones compuestas → mutación por hecho. §16 configuración (visibilidad esencia `siempre`/`solo-difiere`/`oculta`, modo prosa atómica/compuesta, numeración) — display vs canónico. §17 modos de fallo: error del parser, no parseable/ambiguo, colisión de nombre desde OPL, partial-parse, rechazo vs suspensión.
- [ ] **Step 2:** Gate de verificación.
- [ ] **Step 3:** Commit `docs(spec-forja): §15–§17 edición, configuración, fallos`.

---

## Task 13: §18 EBNF formal OPL-ES

**Files:** Modify: `docs/canon-opm/spec-forja-opl.md`

**Fuentes:** `reglas §4.14` (638–658), `opm-opl-es A.0–A.10` (806–1345), **excluyendo** §15–§18 (EN↔ES/idioma) y A de transformación.
**Traza:** `app/src/opl/parser/parsear.ts`, `parser/tipos.ts`.

- [ ] **Step 1:** EBNF consolidada es-CL: declaraciones base, identificadores, oraciones de descripción, procedimentales, condición, estructurales, gestión de contexto, **y producciones de oración compuesta/coordinada (§9)**. Sin EN↔ES.
- [ ] **Step 2:** Gate de verificación (EBNF cubre todas las familias; incluye coordinación; cero EN↔ES).
- [ ] **Step 3:** Commit `docs(spec-forja): §18 EBNF OPL-ES`.

---

## Task 14: §19 Roundtrip · §21 Invariantes · §22 Validación · §23 Migración

**Files:** Modify: `docs/canon-opm/spec-forja-opl.md`

**Fuentes:** `app/src/leyes/opl-reverse.test.ts` (ley *safe-lens*), `roundtrip.test.ts`, `fixtures-roundtrip.ts`; spec-md §9–§10 (invariantes/template); `gobernanza §7` (valores Enforcement).
**Traza:** los archivos de leyes/roundtrip.

- [ ] **Step 1:** §19 roundtrip/simetría global: parseado vs solo-display, ley *safe-lens*, invariante de descomposición de prosa compuesta, dónde se rompe la bisimetría + convención.
- [ ] **Step 2:** §21 Invariantes: (a) prescriptivos del documento (consistencia, auto-suficiencia, no-circularidad, idioma); (b) invariantes OPL del dominio.
- [ ] **Step 3:** §22 Validación: tabla con columna **`Enforcement`** obligatoria. Filas por clase de regla → verificación: plantillas → `lint`/unit (`generadores/*.test.ts`); roundtrip → `eval` (`roundtrip.test.ts`); bisimetría → `eval` (`leyes/opl-reverse`); RFC 2119/grasa → `lint`/`manual`; cobertura de gaps → `manual`.
- [ ] **Step 4:** §23 Migración: qué cambia respecto del canon disperso (`opm-opl-es` + `reglas §4`), qué migrar, qué se deprecia.
- [ ] **Step 5:** Gate de verificación (tabla §22 tiene columna `Enforcement` con valores de `gobernanza §7`).
- [ ] **Step 6:** Commit `docs(spec-forja): §19,§21–§23 roundtrip, invariantes, validación, migración`.

---

## Task 15: §20 Trazabilidad (tabla maestra + GAPS)

**Files:** Modify: `docs/canon-opm/spec-forja-opl.md`

**Fuentes:** todas las entradas ya producidas (§1–§19) + `app/src/opl/**`.

- [ ] **Step 1:** Tabla maestra: cada ID de entrada/conducta ↔ generador ↔ parser ↔ módulo de comportamiento ↔ fixture/ley. Columna **Estado**: `alineado` / `GAP-código` (oración canónica sin generador) / `GAP-spec` (código sin entrada). Esta tabla es el insumo de la auditoría de alineación posterior.
- [ ] **Step 2:** Gate: barrer `app/src/opl/**` y confirmar que cada export de generador/parser aparece en la tabla (o se marca GAP-spec).
- [ ] **Step 3:** Commit `docs(spec-forja): §20 trazabilidad y gaps`.

---

## Task 16: Apéndices A (ejemplo end-to-end), B (patrones sociotécnicos/agénticos), C (índice IDs)

**Files:** Modify: `docs/canon-opm/spec-forja-opl.md`

**Fuentes:** `opm-opl-es §16` (ejemplo empanadas) como molde; `app/src/modelo/simulacion/sociotecnico.ts` para B.
**Traza:** `sociotecnico.ts` (tipos: ActorSim, AgenteSim, PoliticaAutonomiaSim, EfectoSim, DecisionSim, ResultadoDecisionSim).

- [ ] **Step 1:** Apéndice A: un modelo OPM completo → su OPL completa (atómica y prosaica) con todas las familias, mostrando tokens/refs.
- [ ] **Step 2:** Apéndice B: patrones sociotécnicos/agénticos como composición de constructos canónicos — actor-rol-autoridad, agente-autonomía (estados `bloqueado`/`requiere-aprobación`/`autónomo`), decisión (XOR `permitida`/`suspendida`/`bloqueada`), efecto pendiente (`ask-human`/`tool-call`/`http`/`python`/`mqtt`/`sql`/`ros`/`genai` como invocación), HITL (aprobación = condición + agente humano). Cada patrón etiqueta estatus: **canon** / **extensión declarada** / **no-canonizado**.
- [ ] **Step 3:** Apéndice C: índice de todos los IDs con su sección.
- [ ] **Step 4:** Gate de verificación (Apéndice B: ningún patrón inventa primitiva nueva; cada uno con estatus etiquetado y traza a `sociotecnico.ts`).
- [ ] **Step 5:** Commit `docs(spec-forja): apéndices A/B/C`.

---

## Task 17: Pase de conformidad KORA + self-review final

**Files:** Modify: `docs/canon-opm/spec-forja-opl.md`

- [ ] **Step 1: Reconciliar orden del esqueleto `spec`** (spec-md §10): Frontmatter → Definición → Definiciones → Precedencia → Convenciones → cuerpo §1–§20 → Invariantes → Validación → Migración → Apéndices. Renumerar secuencialmente las secciones finales; corregir referencias cruzadas internas.

- [ ] **Step 2: Gate de conformidad KORA (manual + grep)**

Run y revisar:
```bash
rg -n 'idealmente|sería bueno|probablemente|quizás' docs/canon-opm/spec-forja-opl.md   # cero hedging
rg -n 'Traces to:' docs/canon-opm/spec-forja-opl.md                                    # solo si apunta a Formal Layer KORA; si no, debe ser Rationale:
rg -nc 'DEBE|NO DEBE|DEBERÍA|PUEDE' docs/canon-opm/spec-forja-opl.md                    # obligaciones presentes
rg -n 'Enforcement' docs/canon-opm/spec-forja-opl.md                                   # tabla de validación presente
rg -n 'EN↔ES|English|MUST|SHOULD' docs/canon-opm/spec-forja-opl.md                      # cero EN↔ES residual
```
Expected: hedging y EN↔ES = 0; `Enforcement` presente; obligaciones RFC 2119 abundantes; `Traces to:` ausente o solo a Formal Layer.

- [ ] **Step 3: Self-review de cobertura, consistencia y gaps**

Verificar contra la spec de diseño: las 4 familias, todos los modificadores, abanicos, multiplicidad, ruta, refinamiento, designaciones, atributos, plegado, panel, interacción, edición, configuración, fallos, EBNF, roundtrip, combinatoria, composición, patrones de dominio — todo presente. IDs únicos y consistentes entre secciones (un mismo constructo no usa dos IDs). Tabla §20 sin filas huérfanas.

- [ ] **Step 4: Promover status si procede**

Cambiar `status: borrador` → `status: publicado` en el frontmatter solo si el operador lo aprueba tras revisión.

- [ ] **Step 5: Commit**

```bash
git add docs/canon-opm/spec-forja-opl.md
git commit -m "docs(spec-forja): conformidad KORA + reconciliación de esqueleto y gaps"
```

---

## Cierre

Al terminar: actualizar `docs/HANDOFF.md` con el corte (spec-forja OPL producida, KORA-conforme, tabla de gaps lista) y consolidar memoria. La **auditoría de alineación del código** contra esta spec (usando la tabla §20) es el corte siguiente, fuera de este plan.
