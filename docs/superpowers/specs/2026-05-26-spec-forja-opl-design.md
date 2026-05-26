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

## 3. Fuentes de extracción

| # | Fuente | Rol | Precedencia |
|---|--------|-----|-------------|
| 1 | `docs/canon-opm/reglas-opm-estrictas.md §4` (+ §5–§7 enlaces/modificadores) | Canon del repo, ya auditado | **1ª (manda)** |
| 2 | `~/kora/.../opm-ssot-es/opm-opl-es.md` | SSOT OPL dedicada (esqueleto estructural) | **1ª (manda)** |
| 3 | `~/kora/.../INBOX/opm-libro-curado/` (libro Dori, 24 cap.) | Autoridad metodológica, ejemplos/justificación | 2ª (llena vacíos) |
| 4 | `~/kora/.../INBOX/opm/transcripciones-videos-opcloud.txt` | Comportamiento observado del panel OPL de OPCloud | 3ª (observacional) |
| 5 | `~/kora/.../INBOX/curso-dov-dori/` (4 partes + guía) | Curso Dov Dori | 4ª (pedagógico) |

Apoyo: `app/src/opl/**` (generadores/parser/panel) y `app/src/modelo/simulacion/sociotecnico.ts` para traza y patrones de dominio.

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
| **Reverse** | qué parsea/planifica/muta, o "solo-display" |
| **Edición** | ¿editable inline? qué edición se admite y a qué mutación mapea; qué queda bloqueado y por qué (razón de no-aplicable) |
| **Interacción** | comportamiento hover/navegación/filtrado por referencia para esta oración (qué tokens son ref de entidad/enlace) |
| **Roundtrip** | simetría esperada + fixture de referencia; ley/invariante que la defiende |
| **Edge cases** | notas de implementación; modos de fallo/ambigüedad |
| **Traza a código** | `generador.ts §x` · `parser/*.ts:L###` · fixture |
| **Procedencia** | fuente(s) canónica(s) + enriquecimiento libro/OPCloud/curso |

## 5. Índice del artefacto (`spec-forja-opl.md`)

0. **Contrato editorial**: convenciones tipográficas, esquema de IDs, cómo leer una entrada, precedencia de fuentes, relación con `reglas-opm-estrictas.md`.
1. **Vocabulario fijo** de verbos y cópulas (es-CL).
2. **Entidades**: objetos · procesos · estados · atributos/valores · instancias · designaciones · esencia/afiliación en OPL.
3. **Enlaces transformadores**: consumo, resultado, efecto.
4. **Enlaces habilitadores**: agente, instrumento.
5. **Modificadores de control**: evento · condición · excepción (sobretiempo/subtiempo) · invocación/autoinvocación.
6. **Estructurales**: fundamentales (agregación, exhibición, generalización, instanciación) + etiquetados (uni/bidireccional).
7. **Refinamiento/gestión de contexto**: in/out-zoom, unfolding/folding, expresión de estado; descomposición síncrona vs despliegue asíncrono; enlaces escindidos; distribución de enlaces.
8. **Combinatoria y composición** (ampliada): producto cartesiano gobernado `rol × modificador de control × multiplicidad/cardinalidad × abanico (XOR/OR/AND) × probabilidad × ruta`. Cada celda relevante: **válida / inválida / no-canonizada**, con plantilla OPL compuesta y reglas de resolución (fuerza semántica y matriz de precedencia transformadora, procedentes de `reglas-opm-estrictas §6.5/§6.6` y consolidadas aquí; zonas no-canonizadas p.ej. `c+e`). No se inventa primitiva nueva (R-ZNC-2): lo que el canon calla se marca *no-canonizado* o *extensión declarada*.
9. **Multiplicidad y cardinalidad**.
10. **Etiquetas de ruta**.
11. **Plegado/despliegue de OPL** (display, bloques jerárquicos).
12. **Presentación del panel OPL**: orden global de oraciones, numeración, plegado-display, visibilidad de esencia, minimizar (de la observación OPCloud).
13. **Interacción OPL↔OPD**: tokens y referencias (entidad/enlace), hover bidireccional (resaltado), navegación por click, filtrado de líneas por selección/referencia. (ancla: `interaccion.ts`, `refsHints.ts`)
14. **Edición de OPL**: clasificación de líneas editadas (`aplicable`/`no-aplicable`/`ignorada-vacía`/`sin-cambio`), razones de no-aplicabilidad, mapeo edición→mutación, qué es editable inline vs bloqueado, edición de nombres/propiedades de enlace (observación OPCloud). (ancla: `clasificadorEdicion.ts`, `edicionCanvas.ts`)
15. **Configuración/opciones que afectan OPL**: visibilidad de esencia (`siempre`/`solo-difiere`/`oculta`), numeración, idioma — siempre **display vs texto canónico** (las opciones NO alteran el canónico que alimenta parser/roundtrip). (ancla: `opciones.ts`)
16. **Modos de fallo, validación y ambigüedad**: contrato de error del parser, oraciones no parseables/ambiguas, colisión de nombre desde OPL, partial-parse, qué se rechaza vs se suspende.
17. **EBNF formal OPL-ES** consolidada (sin EN↔ES).
18. **Roundtrip, invariantes y leyes**: simetría global, qué se parsea vs solo-display, ley *safe-lens* y demás invariantes (`leyes/opl-reverse`), dónde se rompe la bisimetría + convención.
19. **Trazabilidad**: tabla maestra constructo/conducta ↔ generador ↔ parser ↔ módulo de comportamiento ↔ fixture/ley, marcando **GAPS** (oración o conducta sin código / código sin entrada en la spec) — insumo directo de la auditoría de alineación.

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
- **Ola 2 (composición y refinamiento)**: §7 refinamiento, §8 combinatoria, §9 multiplicidad, §10 ruta, §11 plegado.
- **Ola 3 (comportamiento de runtime)**: §12 panel, §13 interacción, §14 edición, §15 configuración, §16 modos de fallo.
- **Ola 4 (transversales y cierre)**: §17 EBNF, §18 roundtrip/invariantes/leyes, §19 trazabilidad, Apéndices A/B/C.
- **Cierre**: consolidación, self-review de simetría/IDs/gaps, verificación de que cada entrada y cada conducta traza a código existente (generador/parser/módulo de comportamiento/ley) o queda marcada como gap.

## 8. Criterios de aceptación del artefacto

- Cubre las 4 familias de enlace, todos los modificadores, abanicos, multiplicidad, ruta, refinamiento, designaciones, atributos, plegado y presentación del panel — cada uno con el contrato completo del §4.
- Incluye la sección de combinatoria (§8) con el producto cartesiano gobernado y las reglas de resolución.
- **Especifica todo el comportamiento de runtime OPL**: interacción OPL↔OPD (§13), edición y clasificación edición→mutación (§14), configuración display-vs-canónico (§15), modos de fallo/validación/ambigüedad (§16) e invariantes/leyes (§18). Ninguna conducta OPL del producto queda sin especificar.
- Incluye el Apéndice B de patrones sociotécnicos/agénticos, todo expresado como composición canónica con estatus etiquetado.
- OPL en español únicamente; sin EN↔ES; sin intros.
- Cada entrada y cada conducta traza a `app/src/opl/**` (o queda marcada como gap), de modo que la tabla §19 sea el punto de partida de la auditoría de alineación.
- Autocontenida: es **el único** documento que hay que abrir para entender, generar, parsear, presentar, editar y validar OPL en OPFORJA; no requiere `opm-opl-es.md` ni `reglas §4`.

## 9. Fuera de alcance

- La auditoría de alineación del código en sí (es el paso siguiente, alimentado por la tabla §15).
- Cambios al sistema de generación/parser (este artefacto es la SSOT contra la cual se alineará después).
- Reglas visuales/OPD, salvo lo estrictamente necesario para la bisimetría OPL↔OPD.
- Idiomas distintos del español.
