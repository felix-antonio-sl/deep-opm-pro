# Documentación de deep-opm-pro

Índice navegable y contrato editorial del corpus vivo de **opforja**, modelador
OPM/ISO 19450 con método Forja.

**Instancia en producción:** [opforja.sanixai.com](https://opforja.sanixai.com)

## Elige tu ruta

| Quiero… | Empieza aquí | Continúa con |
|---|---|---|
| usar la aplicación de inmediato | [Hoja básica](cheatsheets/opforja-basico.html) | [Uso productivo](uso-productivo.md) |
| aprender OPM con rigor | [Manual de OPM puro](manual-opm-puro.md) | [Manual de opforja](manual-opforja.md) |
| modelar con el método Forja | [Manual de opforja](manual-opforja.md) | [Transformar sistemas](manual-sistemas-opm.md) |
| transformar una organización, servicio o sistema físico | [Manual de sistemas](manual-sistemas-opm.md) | perfil de dominio, si corresponde |
| modelar sistemas sanitarios | [Manual de sistemas](manual-sistemas-opm.md) | [Manual sanitario](manual-sanitarios-opm.md) |
| desarrollar y operar software | [Manual de sistemas](manual-sistemas-opm.md) | [Manual de software](manual-software-opm.md) |
| trabajar como agente modelador | [Pista agente del manual de opforja](manual-opforja.md#pista-agente) | [Ingeniería agéntica transversal](manual-sistemas-opm.md#5-ingeniería-agéntica-del-trabajo) |
| consultar una referencia visual | [Índice de hojas rápidas](cheatsheets/README.md) | manual propietario de cada hoja |
| mantener el producto | [CLAUDE.md](../CLAUDE.md) | [handoff](handoff-2026-07-12.md) y [roadmap](roadmap/roadmap-2026-07-12.md) |
| desplegar u operar producción | [Runbook de despliegue](deploy/opforja.md) | [handoff](handoff-2026-07-12.md) |

## Corpus de aprendizaje y uso

| Documento | Propósito | No vuelve a explicar |
|---|---|---|
| [Uso productivo](uso-productivo.md) | comportamiento exacto de la UI, persistencia, exportación y atajos | teoría OPM o método |
| [Manual de OPM puro](manual-opm-puro.md) | ontología, semántica, OPD y OPL independientes de herramienta | botones o capacidades de opforja |
| [Manual de opforja](manual-opforja.md) | método Forja, apuntes, Taller, validación y puente humano-agente | ciclo completo de una intervención |
| [Manual para transformar sistemas](manual-sistemas-opm.md) | evidencia, AS-IS, necesidad, TO-BE, intervención, adopción, aprendizaje y retiro | teoría OPM ni mecánica detallada de la mesa |
| [Manual sanitario](manual-sanitarios-opm.md) | decisiones que cambian por clínica, gestión, red, población, regulación y riesgo sanitario | ciclo transversal |
| [Manual de software](manual-software-opm.md) | decisiones que cambian por código, datos, arquitectura, tests, CI/CD, release y telemetría | ciclo transversal |
| [Hojas rápidas](cheatsheets/README.md) | recordatorios visuales derivados | hechos o capacidades nuevas |

## Propietario de cada concepto

Un concepto tiene un solo hogar explicativo. Los demás documentos pueden resumirlo
en una frase y enlazarlo.

| Materia | Propietario |
|---|---|
| Ontología, enlaces, refinamientos, OPD y OPL | [Manual de OPM puro](manual-opm-puro.md) y canon OPM |
| Método Forja, validación tripartita, apunte, Taller, adopción de OPDs sueltos y graduación | [Manual de opforja](manual-opforja.md) |
| Operaciones, menús, atajos, persistencia y exportación | [Uso productivo](uso-productivo.md) |
| Evidencia, ficha, AS-IS/TO-BE, alternativas, autonomía, gates, adopción del cambio y retiro | [Manual de sistemas](manual-sistemas-opm.md) |
| Semántica sanitaria | [Manual sanitario](manual-sanitarios-opm.md) |
| Semántica de ingeniería de software | [Manual de software](manual-software-opm.md) |
| Estado implementado y brechas de conformidad | [handoff](handoff-2026-07-12.md) y [registro de conformidad](roadmap/registro-conformidad-ssot.md) |
| Dirección futura priorizada | [roadmap](roadmap/roadmap-2026-07-12.md) |
| Historia editorial | Git y actas citadas con valor vigente |

## Jerarquía de autoridad

1. [CLAUDE.md](../CLAUDE.md) gobierna el repositorio.
2. Las SSOT OPM viven en
   `/home/felix/kora-pneuma/artefactos/conocimiento/fxsl/`; el
   [resolutor local](canon-opm/resolutor-urn.json) fija sus URN y versiones
   observadas.
3. [GOVERNANCE de UI Forja](../ui-forja/GOVERNANCE.md) gobierna estética y chrome
   bajo la precedencia OPM.
4. El [handoff](handoff-2026-07-12.md) fecha el estado, el
   [roadmap](roadmap/roadmap-2026-07-12.md) fecha la dirección y el
   [índice de bugs](bugs/INDEX.md) registra defectos.
5. Specs, actas y auditorías conservan contratos o evidencia; no sustituyen el
   estado actual.
6. Git conserva la historia versionada. `_archivo/` es desplazamiento local
   reversible y queda fuera del árbol vivo.

## Contrato editorial

1. La marca se escribe **opforja**, en minúscula.
2. El idioma es español de Chile (`es-CL`), con tuteo y sin voseo rioplatense.
3. Cada documento tiene un H1; las partes usan H2 y los capítulos, H3.
4. Toda ruta destinada al lector se expresa como enlace relativo resoluble.
5. Los términos OPM conservan su significado canónico; no se reutilizan para
   taxonomías documentales.
6. Las capacidades usan solo `IMPLEMENTADO`, `PROPUESTO` o `EXTERNO`, definidos en
   el [manual de sistemas](manual-sistemas-opm.md#vocabulario-de-capacidad).
   `PROGRAMADA` y `CERRADA` aparecen únicamente al citar el estado exacto del
   [registro de conformidad](roadmap/registro-conformidad-ssot.md); no son etiquetas
   generales de capacidad.
7. Una hoja rápida resume a su manual propietario; nunca crea otro contrato.
8. Los manuales conservan principios durables. Handoff y roadmap conservan estado
   mutable y fechas.
9. Cuando una referencia de sección salta a otro documento, nombra también ese
   documento; dentro del mismo documento puede usarse `§` si el contexto es
   inequívoco.
10. Git conserva la bitácora. El texto vivo conserva solo procedencia necesaria
    para interpretar una decisión.
11. La [ley ejecutable del corpus](../app/src/leyes/corpus-documental.test.ts)
    verifica jerarquía, enlaces, procedencia de hojas rápidas, idioma y vocabulario
    editorial antes de publicar.

## Estructura viva

```text
docs/
├── README.md
├── handoff-2026-07-12.md
├── uso-productivo.md
├── manual-opm-puro.md
├── manual-opforja.md
├── manual-sistemas-opm.md
├── manual-sanitarios-opm.md
├── manual-software-opm.md
├── cheatsheets/
│   └── README.md
├── ejemplos/
├── JOYAS.md
├── render-headless.md
├── verify-reproducible.md
├── canon-opm/
├── deploy/
├── roadmap/
├── auditorias/
├── specs/
├── superpowers/specs/
├── memorias-aprendizajes/
├── solicitudes-upstream/
├── reference/
└── bugs/
```

Los planes TDD, prompts de arranque y solicitudes cerradas fueron retirados del
árbol vivo el 2026-07-12. Las especificaciones que todavía fijan decisiones o
tienen referencias vivas permanecen visibles.

## Política de vigencia

- Un solo documento visible por especie operativa; nombre
  `<especie>-AAAA-MM-DD.md` y fecha ISO máxima como vigente.
- Los operativos son inmutables. Para actualizarlos, crea una versión nueva y
  desplaza la anterior a `_archivo/` antes de publicar.
- No uses expresiones relativas como “hoy” o “la semana pasada” para fijar estado
  histórico.
- Auditorías y actas viven mientras tengan una brecha abierta o sean autoridad
  citada por código, tests o normas.
- Los artefactos resueltos no permanecen como instrucciones ejecutables.

## Convenciones técnicas

- Documentación y comunicación en español de Chile; código nuevo, comandos e
  identificadores en inglés.
- El vocabulario OPM histórico en español dentro del código es una excepción
  heredada, no una pauta para código nuevo.
- Fechas siempre en formato `AAAA-MM-DD`.
- No se versionan artefactos regenerables o efímeros. `opm-extracted/` es la
  excepción curada y trazable.
