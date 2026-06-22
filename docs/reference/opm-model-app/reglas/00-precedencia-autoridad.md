# 00 — Precedencia y autoridad

**Alcance**: jerarquía de las 4 capas del corpus OPM, resolución de conflictos, convenciones editoriales, decisiones axiomáticas D1..D6 que vertebran la v2.
**Capa SSOT propietaria**: todas (`README.md` del corpus + frontmatter de cada capa)
**Aplicación en la app**: gobierna CUALQUIER decisión de implementación; no implementada por un módulo específico, sino citada por todas las decisiones.

## Reglas

### R-000: Cuatro capas canónicas del corpus OPM

- Enunciado: el corpus OPM se compone de 4 capas con URN propios, cada una propietaria de un dominio distinto.
- Capas:
  1. `urn:fxsl:kb:opm-es` — `opm-iso-19450-es.md` — núcleo conceptual y ontológico (semántica, glosario, clases de elementos/relaciones, principios de modelado)
  2. `urn:fxsl:kb:opl-es` — `opm-opl-es.md` — superficie textual canónica en español (gramática, plantillas, EBNF)
  3. `urn:fxsl:kb:opd-es` — `opm-visual-es.md` — gramática visual del OPD (símbolos, contornos, composición, comportamiento entre OPDs)
  4. `urn:fxsl:kb:manual-metodologico-opm-es` — `metodologia-opm-es.md` — procedimiento de modelado, heurísticas, gobernanza, patrones
- Aplicación: cualquier cita de regla debe identificar su capa propietaria.
- Antipatrón: atribuir una regla gráfica a la capa conceptual o viceversa.

### R-001: Orden de precedencia

- Enunciado: ante conflicto entre capas, la precedencia es:
  1. Semántica (`opm-es`)
  2. Textual (`opl-es`)
  3. Visual (`opd-es`)
  4. Metodológica (`manual`)
- Consecuencia: una heurística metodológica NO puede violar semántica base. Una regla visual NO puede redefinir el significado de un hecho conceptual. Las plantillas OPL NO alteran la ontología.
- Referencia SSOT: `README.md` del corpus + §1 de `metodologia-opm-es.md`
- Aplicación en código: al implementar una feature, resolver dependencias citando primero la capa conceptual.

### R-002: Unicidad propietaria de cada regla

- Enunciado: una regla vive **una sola vez** en su capa propietaria. Las demás capas pueden referenciarla o resumirla, pero no redefinirla.
- Referencia SSOT: `README.md` del corpus (reglas editoriales)
- Aplicación en código: evitar duplicar la misma regla en múltiples capas; preferir citas cruzadas.

### R-003: Dualidad OPD ↔ OPL por modelo individual

- Enunciado: dentro de un modelo OPM individual, cada OPD tiene contraparte en un párrafo OPL y viceversa. La dualidad es bidireccional.
- Referencia SSOT: V-65 (`opm-visual-es.md` §18.2)
- Aplicación en código: `src/render/opl-renderer.ts` genera OPL equivalente a cada OPD renderizado. Cualquier cambio de OPD debe proyectarse a OPL.
- Antipatrón: que la edición visual no actualice el OPL o que el OPL se edite sin reflejarse en el OPD.

### R-004: Clausura local al modelo

- Enunciado: la dualidad OPD↔OPL es local a cada modelo individual. Un modelo compuesto es un DAG de modelos conectados por referencia, con cada modelo localmente autocontenido.
- Referencia SSOT: V-251 (`opm-visual-es.md` §18.1)
- Aplicación en código: `src/persistencia/` mantiene separación por modelo; las referencias cross-model usan identificador persistente, no inclusión literal.

### R-005: No hay referencias normativas externas

- Enunciado: el corpus OPM no depende de estándares externos para su conformidad. Todo lo necesario vive en las 4 capas.
- Referencia SSOT: `opm-iso-19450-es.md` §Alcance y conformidad
- Consecuencia: la app NO debe implementar reglas derivadas de SysML, UML, BPMN u otros lenguajes. Si un patrón externo aparece en un fixture, debe justificarse como analogía, no como regla.

### R-006: Tres niveles de conformidad

- Enunciado: una herramienta OPM puede declarar uno de tres niveles de conformidad:
  | Nivel | Requisitos |
  |---|---|
  | Parcial (simbólico) | Solo uso de símbolos OPM con semántica asignada |
  | Completo | Parcial + aplicación consistente de principios, contexto y refinamiento |
  | Herramienta | Parcial + soporte para conformidad completa + soporte textual OPL según EBNF |
- Referencia SSOT: `opm-iso-19450-es.md` §Alcance y conformidad
- Aplicación en código: `opm-model-app` aspira al nivel **Herramienta**. Toda decisión que recorte capacidades debe declarar explícitamente el nivel resultante.

### R-007: Regla de resolución de la metodología

- Enunciado: al aplicar metodología sobre un caso concreto:
  - si una regla metodológica contradice la semántica del lenguaje → prevalece la semántica
  - si una formulación textual contradice OPL-ES → prevalece OPL-ES
  - si una heurística procedimental contradice la gramática gráfica → prevalece la visual
  - las capacidades de herramienta NO redefinen por sí solas la semántica OPM
- Referencia SSOT: `metodologia-opm-es.md` §1
- Aplicación: los `feedback*` pueden sugerir estilo y procedimiento, pero no pueden anular reglas `V-*`.

### R-008: Convención léxica y editorial del corpus

- Enunciado: el corpus prefiere terminología castellana unificada:
  - `modelado` (no `modelamiento`)
  - `ruta` (no `camino`, salvo `camino crítico` consolidado)
  - `etiqueta` (no `tag`)
  - `por defecto` (no `default`)
- Referencia SSOT: `README.md` del corpus
- Aplicación en código: comentarios, rótulos, mensajes y docs usan esta convención. Identificadores técnicos OPM estándar (Dori, OPCloud) pueden preservar forma original cuando sean literatura canónica.

### R-009: Decisiones axiomáticas D1..D6 aplicadas en v2

- Enunciado: la SSOT v2 aplica seis decisiones axiomáticas consolidadas en `docs/design/ssot-decisiones-axiomaticas.md`. Cualquier feature debe honrarlas.

| Decisión | Contenido | Cláusulas donde se aplica |
|---|---|---|
| D1 | Apariencia cross-model = existencia compartida por URI/handle persistente | V-123 (§16.3), V-184, V-185, V-252, V-253, V-256 |
| D2 | Sub-model como cuarto par canónico de refinamiento-abstracción | V-64 (§18.1), V-242 (§10.1), §23 |
| D3 | Bring como operador derivado, no mecanismo ontológico | V-243 (§10.1), §26 (V-257..V-263) |
| D4 | Invocación como familia autónoma (firma Proceso→Proceso) | V-239, V-240, V-241 (§3.0) |
| D5 | V-114 tres categorías de OPD (jerárquico, anclada, ad hoc) | V-114, V-244, V-245, V-113, V-180, V-181, V-254 |
| D6 | Separación de canales del eje `y`: temporal, navegación, identidad | §15.5 (V-246..V-250) |

- Aplicación en código: toda decisión de implementación que toque identidad, sub-modelos, refinamiento o invocación debe citar la decisión D correspondiente.

### R-010: Breaking changes respecto a v1

- Enunciado: v2 introduce los siguientes cambios que rompen perfiles v1:
  - V-64 reescrita: modelos pueden referenciar otros modelos
  - V-114 reescrita: árbol con tres categorías
  - V-123 reescrita: apariencia ≠ referencia externa
  - V-53 y V-54 reescritas: marcas no fijadas a una forma única
  - V-63 ampliada: colores informativos; topología interna obliga
  - §10.1 ampliada a cuatro pares canónicos (sub-model)
  - §3.0 taxonomía declarada: invocación es familia autónoma
  - §15.5 identidad persistente: `SDx.y` deja de ser referencia estable
- Referencia SSOT: `opm-visual-es.md` Anexo C
- Aplicación: implementaciones v1-compat son admitidas como perfil propio, pero la SSOT publica solo v2.

### R-011: Precedencia de fuente en este proyecto

- Enunciado: ante duda sobre el contenido canónico, consultar en el siguiente orden:
  1. Archivo simbólico en `ssot/` (que apunta a `~/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`)
  2. `ssot.lock` para confirmar commit y hash vigente
  3. Este directorio `docs/reglas/` como capa derivada
- Referencia del proyecto: `CLAUDE.md` del repo
- Antipatrón: modificar una regla en este directorio sin actualizarla en la SSOT. Si un artefacto aquí diverge de la SSOT, el artefacto es incorrecto.

### R-012: Excepción editorial sobre `V-48`

- Enunciado: V-48 fue eliminada; su contenido se absorbió en V-4. Toda referencia externa a V-48 debe redirigirse a V-4.
- Referencia SSOT: `opm-visual-es.md` §16.1
- Aplicación: código o docs que hagan referencia a V-48 deben actualizarse.

### R-013: Decisiones aplazadas

- Enunciado: las siguientes decisiones NO son parte de v2 y están explícitamente aplazadas:
  - Forma exacta del identificador persistente del OPD (UUID, slug, URI)
  - Formato exacto de serialización cross-model (JSON-LD, YAML, propietario)
  - Semántica coalgebraica completa de simulación
  - Apéndice categorial formal
  - Tests categoriales automáticos
- Referencia SSOT: `opm-visual-es.md` Anexo D
- Aplicación: la app puede elegir localmente su forma de identificador persistente; debe documentar la elección en un ADR.

## Checklist

- [ ] Cualquier nueva regla tiene capa propietaria identificada (`opm-es` / `opl-es` / `opd-es` / `manual`)
- [ ] No hay duplicación de una regla entre capas
- [ ] La dualidad OPD↔OPL se preserva al editar
- [ ] Los sub-modelos se tratan como DAG de modelos con frontera explícita
- [ ] Las referencias externas usan identificador persistente, no etiqueta visible
- [ ] Las invocaciones son familia autónoma, no subtipo de habilitación
- [ ] El árbol OPD clasifica cada OPD en jerárquico / vista anclada / vista ad hoc
- [ ] `SDx.y` se usa solo para navegación; identidad persistente aparte

## Antipatrones

- Atribuir una regla a la capa equivocada ("V-3 es de OPL" — es visual)
- Duplicar el contenido de una regla en dos capas y divergir
- Implementar el eje vertical del canvas como único canal de identidad
- Tratar sub-modelos como vistas ad hoc o como OPDs jerárquicos
- Invertir topología de triángulo estructural en import

## Referencias cruzadas

- Canon-exportación: `01-canon-exportacion.md`
- Identidad persistente: `40-navegacion-arbol-identidad.md`
- Metamodelo: `41-metamodelo-apariencia-existencia.md`
- Sub-modelos: `42-sub-modelos-inter-modelo.md`
