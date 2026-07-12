# Documentación — deep-opm-pro

Índice navegable del repositorio de desarrollo de opforja, modelador OPM/ISO 19450 con arquitectura propia.

**Instancia en producción:** [opforja.sanixai.com](https://opforja.sanixai.com)

## Entrada rápida

| Necesidad | Fuente |
|---|---|
| Entender el proyecto, arquitectura y reglas | `../CLAUDE.md` |
| Conocer el estado operativo | `handoff-2026-07-12.md` |
| Elegir el próximo corte | `roadmap/roadmap-2026-07-12.md` |
| Revisar defectos activos | `bugs/INDEX.md` |
| Usar el modelador | `uso-productivo.md` |
| Aprender OPM sin depender de una herramienta | `manual-opm-puro.md` y `cheatsheets/opm-puro.html` |
| Modelar con el método Forja | `manual-opforja.md` |
| Modelar sistemas sanitarios complejos | `manual-sanitarios-opm.md` |
| Desplegar y operar producción | `deploy/opforja.md` |
| Consultar la autoridad OPM | `canon-opm/` como puente a `kora-pneuma` |
| Consultar decisiones y auditorías vivas | `auditorias/README.md` |
| Revisar evidencia histórica | `reference/PROCEDENCIA.md` |

## Jerarquía de autoridad

1. `../CLAUDE.md` gobierna el repositorio.
2. Las SSOT OPM viven en `/home/felix/kora-pneuma/artefactos/conocimiento/fxsl/`; `canon-opm/` resuelve sus URN y versiones observadas.
3. `ui-forja/GOVERNANCE.md` gobierna estética y chrome bajo la precedencia OPM.
4. El handoff fecha el estado, el roadmap fecha la dirección y `bugs/INDEX.md` registra defectos.
5. Specs, actas y auditorías conservan contratos o evidencia; no sustituyen el estado actual.
6. Git conserva la historia versionada. `_archivo/` es desplazamiento local reversible y queda fuera del árbol vivo.

## Estructura viva

```text
docs/
├── README.md
├── handoff-2026-07-12.md
├── uso-productivo.md
├── manual-opm-puro.md
├── manual-opforja.md
├── manual-sanitarios-opm.md
├── cheatsheets/
├── JOYAS.md
├── render-headless.md
├── verify-reproducible.md
├── canon-opm/
├── deploy/
├── roadmap/
│   ├── README.md
│   ├── roadmap-2026-07-12.md
│   ├── quality-ledger.md
│   ├── registro-conformidad-ssot.md
│   └── protocolo-re-pin.md
├── auditorias/
├── specs/
├── superpowers/specs/
├── memorias-aprendizajes/
├── solicitudes-upstream/
├── reference/
└── bugs/
```

Los planes TDD, prompts de arranque y solicitudes cerradas fueron retirados del árbol vivo el 2026-07-12. Las especificaciones que todavía fijan decisiones o tienen referencias vivas permanecen visibles.

## Política de vigencia

- Un solo documento visible por especie operativa; nombre `<especie>-AAAA-MM-DD.md` y fecha ISO máxima como vigente.
- Los operativos son inmutables. Para actualizarlos, crear una versión nueva y desplazar la anterior a `_archivo/` antes de publicar.
- No usar expresiones relativas como “hoy” o “la semana pasada” para fijar estado histórico.
- Auditorías y actas viven mientras tengan una brecha abierta o sean autoridad citada por código, tests o normas.
- Los artefactos resueltos no permanecen como instrucciones ejecutables.

## Convenciones

- Documentación y comunicación en español de Chile; código nuevo, comandos e identificadores en inglés.
- El vocabulario OPM histórico en español dentro del código es una excepción heredada, no una pauta para código nuevo.
- Fechas siempre en formato `AAAA-MM-DD`.
- No versionar artefactos regenerables o efímeros. `opm-extracted/` es la excepción curada y trazable.
