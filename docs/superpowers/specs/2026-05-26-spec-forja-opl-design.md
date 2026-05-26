# Design — spec-forja OPL (SSOT OPL consolidada de OPFORJA)

**Fecha**: 2026-05-26 · **Tipo**: diseño de artefacto de conocimiento (SSOT) · **Estado**: aprobado, pendiente de plan de implementación.

## 1. Problema y objetivo

El sistema de generación/parseo de OPL de OPFORJA (`app/src/opl/`, ~5457 LOC no-test: `generadores/` forward + `parser/` reverse + panel/interacción/roundtrip) debe **alinearse 100% con una fuente de verdad exhaustiva y canónica**. Hoy el canon OPL vive disperso en `opm-opl-es.md` (SSOT externa, 74 KB) y `reglas-opm-estrictas.md §4` (canon del repo), sin una pieza única, autocontenida y orientada a OPFORJA que sirva de contrato verificable contra el código.

**Objetivo**: producir `docs/canon-opm/spec-forja-opl.md` — la **SSOT OPL única, consolidada y definitiva** de OPFORJA, que contenga con máximo detalle y precisión todo lo necesario para generar y parsear OPL, sin nada superfluo (intros, conversión EN↔ES, narrativa pedagógica no normativa). La spec nace conectada al código (traza + gaps) para alimentar la auditoría de alineación posterior.

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
| **Roundtrip** | simetría esperada + fixture de referencia |
| **Edge cases** | notas de implementación |
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
12. **Presentación del panel OPL**: orden global de oraciones, numeración, hover bidireccional, visibilidad de esencia, minimizar/edición inline (de la observación OPCloud).
13. **EBNF formal OPL-ES** consolidada (sin EN↔ES).
14. **Roundtrip y simetría global**: invariantes, qué se parsea vs solo-display, dónde se rompe la bisimetría + convención.
15. **Trazabilidad**: tabla maestra constructo ↔ generador ↔ parser ↔ fixture, marcando **GAPS** (oración canónica sin generador / generador sin entrada canónica) — insumo directo de la auditoría de alineación.

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
- **Ola 3 (transversales)**: §12 panel, §13 EBNF, §14 roundtrip, §15 trazabilidad, Apéndices A/B/C.
- **Cierre**: consolidación, self-review de simetría/IDs/gaps, verificación de que cada entrada traza a código existente o queda marcada como gap.

## 8. Criterios de aceptación del artefacto

- Cubre las 4 familias de enlace, todos los modificadores, abanicos, multiplicidad, ruta, refinamiento, designaciones, atributos, plegado y presentación del panel — cada uno con el contrato completo del §4.
- Incluye la sección de combinatoria (§8) con el producto cartesiano gobernado y las reglas de resolución.
- Incluye el Apéndice B de patrones sociotécnicos/agénticos, todo expresado como composición canónica con estatus etiquetado.
- OPL en español únicamente; sin EN↔ES; sin intros.
- Cada entrada traza a `app/src/opl/**` (o queda marcada como gap), de modo que la tabla §15 sea el punto de partida de la auditoría de alineación.
- Autocontenida: no requiere abrir `opm-opl-es.md` ni `reglas §4` para generar/parsear.

## 9. Fuera de alcance

- La auditoría de alineación del código en sí (es el paso siguiente, alimentado por la tabla §15).
- Cambios al sistema de generación/parser (este artefacto es la SSOT contra la cual se alineará después).
- Reglas visuales/OPD, salvo lo estrictamente necesario para la bisimetría OPL↔OPD.
- Idiomas distintos del español.
