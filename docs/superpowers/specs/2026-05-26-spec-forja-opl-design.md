# Design — spec-forja OPL (SSOT OPL consolidada de OPFORJA)

**Fecha**: 2026-05-26 · **Tipo**: diseño de artefacto de conocimiento (SSOT) · **Estado**: aprobado, pendiente de plan de implementación.

## 1. Problema y objetivo

El sistema de generación/parseo de OPL de OPFORJA (`app/src/opl/`, ~5457 LOC no-test: `generadores/` forward + `parser/` reverse + panel/interacción/roundtrip) debe **alinearse 100% con una fuente de verdad exhaustiva y canónica**. Hoy el canon OPL vive disperso en `opm-opl-es.md` (SSOT externa, 74 KB) y `reglas-opm-estrictas.md §4` (canon del repo), sin una pieza única, autocontenida y orientada a OPFORJA que sirva de contrato verificable contra el código.

**Objetivo**: producir `docs/canon-opm/spec-forja-opl.md` — la **SSOT OPL única, consolidada y definitiva** de OPFORJA, que contenga con máximo detalle y precisión todo lo necesario para generar y parsear OPL, sin nada superfluo (intros, conversión EN↔ES, narrativa pedagógica no normativa). La spec nace conectada al código (traza + gaps) para alimentar la auditoría de alineación posterior.

**Rol del documento (framing del operador)**: esta spec es **el instrumento con el que se especifica TODO el funcionamiento OPL de OPFORJA**. No es solo un catálogo canónico de oraciones: es la **especificación operativa completa** del subsistema OPL — canon lingüístico **más** comportamiento de runtime. Todo lo que OPL hace en el producto debe quedar especificado aquí: generación, parseo, presentación del panel, interacción OPL↔OPD (hover/navegación/filtrado), edición de OPL (clasificación edición→mutación, editable vs bloqueado), configuración (display vs canónico), modos de fallo/validación/ambigüedad e invariantes/leyes (p.ej. *safe-lens*). Si una conducta OPL del producto no está en esta spec, es un gap a cerrar — no un detalle de implementación.

## 2. Decisiones de alcance (selladas en brainstorming)

1. **Rol del documento**: SSOT única consolidada. La spec-forja **absorbe y supera** el canon OPL para OPFORJA; `opm-opl-es.md` y `reglas §4` quedan como **procedencia**, no se consultan en runtime de desarrollo.
2. **Alcance**: **bidireccional completo** — generación (`generadores/`), parser (`parser/`), presentación del panel forward, y simetría roundtrip.
3. **Precedencia de fuentes en conflicto**: **canon del repo primero** → `reglas §4` + `opm-opl-es` mandan; el **libro de Dori** llena vacíos como autoridad metodológica; los **videos de OPCloud** son observacionales (operacionalizan, no redefinen); el **curso de Dov Dori** es pedagógico. (Consistente con la regla de oro 1 del repo: SSOT manda sobre OPCloud.)
4. **Organización**: eje **ontológico con contrato por constructo**. Cada forma de oración OPL es una entrada auditable de forma aislada.
5. **Idioma**: OPL en **español (es-CL) únicamente**. Se poda toda conversión/equivalencia EN↔ES.
6. **Combinatoria y dominios** (ampliación pedida por el operador): cobertura amplia de **combinaciones** de enlaces/modificadores/multiplicidad/abanicos/probabilidad/ruta con relevancia semántica y lógica, más patrones OPL para **sistemas sociotécnicos y sistemas computacionales agénticos complejos** (anclados a `app/src/modelo/simulacion/sociotecnico.ts`).
7. **Cumplimiento KORA 100%** (artefacto orientado a agentes): el documento DEBE conformar las specs KORA que corresponden — **KORA/MD v12** (`md-spec`), **spec-md v1** (familia `spec`) y **knowledge-spec v3** (identidad/relations). Vive en `docs/canon-opm/spec-forja-opl.md` con **forma KORA 100%** y URN nominal `urn:opforja:kb:spec-forja-opl`; **NO** se registra en el catálogo/toolchain de KORA (es portable, ingestable después). Implica: frontmatter de dos capas, RFC 2119, patrón regla+ejemplo+traza, sin "grasa", esqueleto `spec` (Definición/Definiciones/…/Invariantes/Validación-con-`Enforcement`/Migración) y auto-declaración de precedencia. **Convención de trazabilidad**: `Traces to:` se reserva a la Formal Layer categorial de KORA; las reglas OPL usan `Rationale:` + campo **Procedencia** a la SSOT OPM (no fingen respaldo formal, spec-md §5).

## 3. Fuentes de extracción

| # | Fuente | Rol | Precedencia |
|---|--------|-----|-------------|
| 1 | `docs/canon-opm/reglas-opm-estrictas.md §4` (+ §5–§7 enlaces/modificadores) | Canon del repo, ya auditado | **1ª (manda)** |
| 2 | `~/kora/.../opm-ssot-es/opm-opl-es.md` | SSOT OPL dedicada (esqueleto estructural) | **1ª (manda)** |
| 3 | `~/kora/.../INBOX/opm-libro-curado/` (libro Dori, 24 cap.) | Autoridad metodológica, ejemplos/justificación | 2ª (llena vacíos) |
| 4 | `~/kora/.../INBOX/opm/transcripciones-videos-opcloud.txt` | Comportamiento observado del panel OPL de OPCloud | 3ª (observacional) |
| 5 | `~/kora/.../INBOX/curso-dov-dori/` (4 partes + guía) | Curso Dov Dori | 4ª (pedagógico) |

Apoyo: `app/src/opl/**` (generadores/parser/panel) y `app/src/modelo/simulacion/sociotecnico.ts` para traza y patrones de dominio.

**Specs KORA que gobiernan la FORMA** (no el contenido OPL, sino la conformidad del artefacto): `~/kora/serialization/md-spec.md` (KORA/MD v12), `~/kora/serialization/spec-md.md` (familia `spec`), `~/kora/serialization/knowledge-spec.md` (identidad/relations), `~/kora/CLAUDE.md` §Canon (precedencia, URN `gobernanza §4.3`).

## 4. Esquema de entrada (contrato por constructo)

Cada forma de oración OPL es una entrada con **ID estable** (reutilizando los IDs del canon vigente — D1–D13, T1–TS5, H*, E*, C*, SE*, RF*, SSE*, CX*, CM* — y añadiendo IDs nuevos para lo no cubierto). Campos fijos:

| Campo | Contenido |
|---|---|
| **ID** | identificador estable y direccionable |
| **Plantilla(s)** | OPL-ES canónica con marcado tipográfico: **objeto** negrita, *proceso* cursiva, `estado/valor` backtick |
| **Emisión** | configuración del modelo que dispara la oración |
| **Supresión** | cuándo NO se emite (placeholders, visibilidad de esencia, plegado, contexto de refinamiento/despliegue) |
| **Tokenización** | segmentos (verbo/cópula, refs por entidad/enlace) para `refsHints` y resaltado bidireccional canvas↔OPL |
| **Orden** | posición en la secuencia del panel |
| **Composabilidad** | perfil de composición de la oración (ver §9): ejes de coordinación que admite (sujeto-compartido / predicado-compartido / destino-enumerable), conectores aplicables, y **zonas donde la composición está prohibida** (p.ej. contexto de refinamiento/despliegue). Si no es componible, decirlo y por qué. |
| **Reverse** | qué parsea/planifica/muta, o "solo-display"; **si participa en prosa compuesta, cómo se descompone de vuelta a hechos atómicos** |
| **Edición** | ¿editable inline? qué edición se admite y a qué mutación mapea; qué queda bloqueado y por qué (razón de no-aplicable) |
| **Interacción** | comportamiento hover/navegación/filtrado por referencia para esta oración (qué tokens son ref de entidad/enlace) |
| **Roundtrip** | simetría esperada + fixture de referencia; ley/invariante que la defiende |
| **Edge cases** | notas de implementación; modos de fallo/ambigüedad |
| **Traza a código** | `generador.ts §x` · `parser/*.ts:L###` · fixture |
| **Procedencia** | fuente(s) canónica(s) + enriquecimiento libro/OPCloud/curso, expresada como `Rationale:` (no `Traces to:`, reservado a Formal Layer KORA) |

Conformidad KORA por entrada: las obligaciones de cada entrada usan **RFC 2119**; las reglas de lectura ambigua siguen el patrón **regla + `Correcto:`/`Incorrecto:` + `Rationale:`** (spec-md §8). La prosa de una entrada solo existe si cumple una de las 4 funciones admitidas (justificar / prevenir ambigüedad / contextualizar / advertir límite de enforcement); lo demás es grasa y se elimina (spec-md §7, md-spec §5.3).

## 5. Índice del artefacto (`spec-forja-opl.md`)

El orden real del documento envuelve el cuerpo ontológico en el esqueleto `spec` de spec-md §10: **Frontmatter → Definición → Definiciones → Precedencia → Convenciones → [cuerpo normativo §1–§20] → Invariantes → Validación → Migración → Apéndices**. (La numeración secuencial final se asigna en producción; aquí el cuerpo conserva sus números de trabajo.)

- **Frontmatter KORA/MD**: `_manifest.urn: urn:opforja:kb:spec-forja-opl`, `provenance`, `version`, `status`, `tags`≥3, `lang: es`, `extensions.opforja.family: spec`, `relations`.
- **Definición**: alcance y audiencia (agentes de desarrollo + generación/parseo OPL de OPFORJA).
- **Definiciones**: términos normativos (oración atómica, oración compuesta, sub-span, hecho, `ref`, `hint`, token, esencia, afiliación, placeholder, plegado…).
- **Precedencia** (auto-declaración, spec-md §11): esta spec manda sobre la implementación OPL; queda **bajo** `reglas-opm-estrictas.md` para canon OPM nuclear y **bajo** la SSOT OPM externa.
- **Convenciones**: tipografía (**objeto**/*proceso*/`estado`), esquema de IDs, **RFC 2119** (DEBE/NO DEBE/DEBERÍA/NO DEBERÍA/PUEDE), patrón **regla+ejemplo+traza** (`Correcto:`/`Incorrecto:`/`Rationale:`), cómo leer una entrada, precedencia de fuentes.

Cuerpo normativo (números de trabajo):
1. **Vocabulario fijo** de verbos y cópulas (es-CL).
2. **Entidades**: objetos · procesos · estados · atributos/valores · instancias · designaciones · esencia/afiliación en OPL.
3. **Enlaces transformadores**: consumo, resultado, efecto.
4. **Enlaces habilitadores**: agente, instrumento.
5. **Modificadores de control**: evento · condición · excepción (sobretiempo/subtiempo) · invocación/autoinvocación.
6. **Estructurales**: fundamentales (agregación, exhibición, generalización, instanciación) + etiquetados (uni/bidireccional).
7. **Refinamiento/gestión de contexto**: in/out-zoom, unfolding/folding, expresión de estado; descomposición síncrona vs despliegue asíncrono; enlaces escindidos; distribución de enlaces.
8. **Combinatoria a nivel de modelo**: producto cartesiano gobernado `rol × modificador de control × multiplicidad/cardinalidad × abanico (XOR/OR/AND) × probabilidad × ruta`. Cada celda relevante: **válida / inválida / no-canonizada**, con plantilla OPL compuesta y reglas de resolución (fuerza semántica y matriz de precedencia transformadora, procedentes de `reglas-opm-estrictas §6.5/§6.6` y consolidadas aquí; zonas no-canonizadas p.ej. `c+e`). No se inventa primitiva nueva (R-ZNC-2): lo que el canon calla se marca *no-canonizado* o *extensión declarada*.
9. **Composición de oraciones y prosa OPL** (sección crítica, máxima especificación). Define el **álgebra de composición** que fusiona varias oraciones atómicas en una sola oración/párrafo semánticamente más rico mediante conectores, **sin perder la direccionabilidad por hecho**. Cubre:
   - **Regla maestra (lección BUG-f897bc)**: una oración compuesta es **UNA línea de texto con N sub-spans**, donde **cada hecho conserva su `ref` y su `hint`** (composición a nivel de token, nunca fusión opaca). `refs` de la línea = unión de refs de los hechos; `hints` = sub-span por hecho. Hover, filtrado, navegación y clasificación de edición resuelven al hecho individual, no a la línea entera.
   - **Ejes de coordinación y conectores**: (a) **sujeto compartido / predicado coordinado** — "*P* consume **A**, genera **B** y requiere **C**."; (b) **predicado compartido / destino enumerado** — "**A** exhibe **B**, **C** y **D**."; (c) **sujeto coordinado** — "**A** y **B** consumen **C**." (si canónico); (d) conectores condicionales/temporales/causales donde el canon lo soporte; (e) operadores lógicos XOR/OR (remite a §8). Conector serial es-CL: `, … y` / `, … o` (sin coma de Oxford).
   - **Reglas de elegibilidad**: mismo eje de coordinación, misma familia semántica, orden determinista estable de los hechos coordinados, y **preservación obligatoria de tokens**.
   - **Zonas prohibidas de composición**: **contexto de refinamiento/despliegue (HU-50.015)** — los enlaces hijos de una entidad refinada NO se fusionan en plural ("son …") porque el resaltado/navegación exigen frase individual con token-verbo + ref por enlace (causa raíz del revert f897bc); toda composición que no pueda preservar refs/hints por hecho; toda oración que el parser no pueda descomponer.
   - **Reverse / roundtrip**: el parser DEBE descomponer la oración compuesta de vuelta a los hechos atómicos; la composición es transformación display reversible (componer→parsear = identidad sobre el conjunto de hechos).
   - **Configuración**: la prosa rica es **opción de presentación** ("OPL atómica" vs "OPL prosaica") que **NO altera el texto canónico** que alimenta parser/roundtrip (igual contrato display-vs-canónico que §16).
   - **Edición**: editar una oración compuesta inline resuelve a los hechos componentes afectados (qué sub-span cambió → qué mutación); ver §15.
10. **Multiplicidad y cardinalidad**.
11. **Etiquetas de ruta**.
12. **Plegado/despliegue de OPL** (display, bloques jerárquicos).
13. **Presentación del panel OPL**: orden global de oraciones, numeración, plegado-display, visibilidad de esencia, minimizar (de la observación OPCloud).
14. **Interacción OPL↔OPD**: tokens y referencias (entidad/enlace), hover bidireccional (resaltado), navegación por click, filtrado de líneas por selección/referencia; **resolución por sub-span en oraciones compuestas** (§9). (ancla: `interaccion.ts`, `refsHints.ts`)
15. **Edición de OPL**: clasificación de líneas editadas (`aplicable`/`no-aplicable`/`ignorada-vacía`/`sin-cambio`), razones de no-aplicabilidad, mapeo edición→mutación, qué es editable inline vs bloqueado, edición de nombres/propiedades de enlace (observación OPCloud), **edición de oraciones compuestas → mutación por hecho** (§9). (ancla: `clasificadorEdicion.ts`, `edicionCanvas.ts`)
16. **Configuración/opciones que afectan OPL**: visibilidad de esencia (`siempre`/`solo-difiere`/`oculta`), **modo prosa atómica vs compuesta** (§9), numeración, idioma — siempre **display vs texto canónico** (las opciones NO alteran el canónico que alimenta parser/roundtrip). (ancla: `opciones.ts`)
17. **Modos de fallo, validación y ambigüedad**: contrato de error del parser, oraciones no parseables/ambiguas, colisión de nombre desde OPL, partial-parse, qué se rechaza vs se suspende.
18. **EBNF formal OPL-ES** consolidada (sin EN↔ES), incluyendo las producciones de **oración compuesta/coordinada** (§9).
19. **Roundtrip, invariantes y leyes**: simetría global, qué se parsea vs solo-display, ley *safe-lens*, **invariante de descomposición de prosa compuesta** (§9), demás invariantes (`leyes/opl-reverse`), dónde se rompe la bisimetría + convención.
20. **Trazabilidad**: tabla maestra constructo/conducta ↔ generador ↔ parser ↔ módulo de comportamiento ↔ fixture/ley, marcando **GAPS** (oración o conducta sin código / código sin entrada en la spec) — insumo directo de la auditoría de alineación.

Secciones de cierre (esqueleto `spec`):

21. **Invariantes**: (a) prescriptivos del documento (spec-md §9: consistencia interna, auto-suficiencia de regla, no-circularidad, preservación de idioma); (b) invariantes OPL del dominio (bisimetría, descomposición de prosa compuesta, display-vs-canónico, *safe-lens*).
22. **Validación**: tabla con columna **`Enforcement`** obligatoria (valores de `gobernanza §7`: `schema`/`lint`/`runtime`/`eval`/`manual`) — declara cómo se verifica cada clase de regla contra el código (p.ej. plantillas → unit en `generadores/*.test.ts`; roundtrip → `eval`/`runtime` en `roundtrip.test.ts`; bisimetría → `eval` en `leyes/opl-reverse`; RFC 2119/grasa → `lint`/`manual`).
23. **Migración**: qué cambia respecto del canon disperso previo (`opm-opl-es` + `reglas §4`), qué migrar, qué se deprecia (obligatoria por ser primer corte mayor del artefacto).

**Apéndice A — Ejemplo end-to-end**: un modelo OPM completo → OPL completa con todas las familias.
**Apéndice B — Patrones OPL sociotécnicos y agénticos**: construcciones recurrentes expresadas **como composición de constructos canónicos** (no OPL nuevo), ancladas a `sociotecnico.ts`:
- **Actor–rol–autoridad**: actor (humano/equipo/servicio/sistema-externo) como objeto; rol vía habilitadores (agente/instrumento); disponibilidad (`disponible`/`ocupado`/`no-disponible`) como estados.
- **Agente–autonomía**: agente como objeto informático; nivel (`bloqueado`/`requiere-aprobación`/`autónomo`) como estados; política por defecto/acción/herramienta como atributos/refinamiento.
- **Decisión**: proceso con abanico XOR de resultado-estado → `permitida`/`suspendida`/`bloqueada`; precedencia de política como condición.
- **Efecto pendiente**: `ask-human`/`tool-call`/`http`/`python`/`mqtt`/`sql`/`ros`/`genai` como procesos invocados (enlace de invocación); aprobación humana como condición/evento; escalamiento como excepción/sobretiempo.
- **Supervisión humana (HITL)**: aprobación como enlace de condición + agente humano.

Cada patrón etiqueta su estatus: **canon** (composición pura) · **extensión declarada** (requiere rasgo fuera del canon) · **no-canonizado** (la SSOT calla; se documenta, no se inventa).

**Apéndice C — Índice de IDs**.

## 6. Metodología de extracción

- **Esqueleto**: estructura ya validada de `opm-opl-es.md` + `reglas §4–§7`.
- **Enriquecer** cada entrada con ejemplos/justificación del libro de Dori, comportamiento de panel de los videos OPCloud y matices del curso, respetando la precedencia.
- **Podar**: intros, alcance editorial genérico, conversión/equivalencia EN↔ES, reglas de transformación EN→ES, narrativa pedagógica no normativa.
- **Trazar al código actual** (generadores/parser/fixtures) y marcar **gaps** bidireccionales.
- **Conflictos**: resolver por precedencia (§2.3); cuando el canon calla, marcar *no-canonizado* / *extensión declarada* — nunca inventar canon.

## 7. Plan de producción (entrada a writing-plans)

Tamaño estimado ~2500–4000 líneas. Producción **por familias en líneas paralelas** (un `opm-specialist` por familia de constructo), cada una extrayendo de las 5 fuentes con el esquema fijo del §4 y trazando al código. Olas sugeridas:

- **Ola 1 (constructos base)**: §1 vocabulario, §2 entidades, §3 transformadores, §4 habilitadores, §5 modificadores, §6 estructurales.
- **Ola 2 (composición y refinamiento)**: §7 refinamiento, §8 combinatoria de modelo, §9 **composición de prosa** (sección crítica), §10 multiplicidad, §11 ruta, §12 plegado.
- **Ola 3 (comportamiento de runtime)**: §13 panel, §14 interacción, §15 edición, §16 configuración, §17 modos de fallo.
- **Ola 4 (transversales y cierre)**: §18 EBNF, §19 roundtrip/invariantes/leyes, §20 trazabilidad, §21 invariantes, §22 validación (tabla `Enforcement`), §23 migración, Apéndices A/B/C.
- **Pase de conformidad KORA (cierre)**: frontmatter de dos capas, familia `spec`, RFC 2119 en toda obligación, patrón regla+ejemplo+traza, poda de grasa, auto-declaración de precedencia, tabla de validación con `Enforcement`. Verificar contra md-spec/spec-md (manual, ya que no se registra en el toolchain KORA).

Nota: §9 (composición de prosa) y §14/§15 (interacción/edición) comparten el contrato de tokenización por sub-span; deben producirse de forma coordinada o por el mismo agente para no divergir.
- **Cierre**: consolidación, self-review de simetría/IDs/gaps, verificación de que cada entrada y cada conducta traza a código existente (generador/parser/módulo de comportamiento/ley) o queda marcada como gap.

## 8. Criterios de aceptación del artefacto

- Cubre las 4 familias de enlace, todos los modificadores, abanicos, multiplicidad, ruta, refinamiento, designaciones, atributos, plegado y presentación del panel — cada uno con el contrato completo del §4.
- Incluye la sección de combinatoria de modelo (§8) con el producto cartesiano gobernado y las reglas de resolución.
- **Especifica exhaustivamente la composición de prosa (§9)**: álgebra de conectores, ejes de coordinación, regla maestra de sub-span (cada hecho conserva ref/hint), zonas prohibidas (refinamiento/despliegue, lección f897bc) e invariante de descomposición reversible. Resuelve correctamente el caso revertido BUG-f897bc.
- **Especifica todo el comportamiento de runtime OPL**: interacción OPL↔OPD (§14), edición y clasificación edición→mutación (§15), configuración display-vs-canónico (§16), modos de fallo/validación/ambigüedad (§17) e invariantes/leyes (§19). Ninguna conducta OPL del producto queda sin especificar.
- Incluye el Apéndice B de patrones sociotécnicos/agénticos, todo expresado como composición canónica con estatus etiquetado.
- OPL en español únicamente; sin EN↔ES; sin intros.
- Cada entrada y cada conducta traza a `app/src/opl/**` (o queda marcada como gap), de modo que la tabla §20 sea el punto de partida de la auditoría de alineación.
- Autocontenida: es **el único** documento que hay que abrir para entender, generar, parsear, presentar, editar y validar OPL en OPFORJA; no requiere `opm-opl-es.md` ni `reglas §4`.
- **Conforme 100% a KORA en forma**: KORA/MD v12 (frontmatter de dos capas, sin grasa, telegrafización), familia `spec` de spec-md (RFC 2119, regla+ejemplo+traza, invariantes, tabla de validación con `Enforcement`, auto-declaración de precedencia, sección Migración), knowledge-spec (URN `urn:opforja:kb:spec-forja-opl`, `relations`). `Traces to:` no se usa para canon OPL (reservado a Formal Layer KORA); se usa `Rationale:` + Procedencia.

## 9. Fuera de alcance

- La auditoría de alineación del código en sí (es el paso siguiente, alimentado por la tabla §20).
- Cambios al sistema de generación/parser (este artefacto es la SSOT contra la cual se alineará después).
- Reglas visuales/OPD, salvo lo estrictamente necesario para la bisimetría OPL↔OPD.
- Idiomas distintos del español.
