# Documentación de opforja

Entrada única al corpus vivo de `deep-opm-pro`, repositorio de **desarrollo** del
modelador OPM/ISO 19450 opforja. Aquí se separan orientación, contratos vigentes,
decisiones técnicas, operación, referencias históricas y dirección futura.

- **Instancia en producción:** [opforja.sanixai.com](https://opforja.sanixai.com)
- **Estado operativo:** Git, tests y `cd app && bun run cordon:estado`
- **Defectos activos:** [índice de bugs](bugs/INDEX.md)
- **Próximo corte:** [criterios de apertura](roadmap/README.md)

## Qué es este repositorio

opforja permite editar un mismo modelo mediante OPD y OPL, persistirlo, validarlo y
exportarlo de forma reproducible. El repositorio implementa la herramienta; no es la
fuente de verdad de modelos sanitarios, organizacionales ni de otros dominios.

Su organización principal es:

| Superficie | Responsabilidad |
|---|---|
| `app/` | producto, modelo OPM, persistencia, render, interfaz y pruebas |
| `ui-forja/` | gobierno visual y contratos de interacción no semánticos |
| `docs/` | orientación, aprendizaje, especificaciones, decisiones y operación |
| `opm-extracted/` | referencia técnica curada y trazable de OPCloud |
| `assets/`, `fixtures/`, `config/`, `catalog/` | evidencia y casos de prueba heredados |
| `deploy/` | procedimiento y configuración de despliegue |

## Elige tu ruta

| Quiero… | Empieza aquí | Continúa con |
|---|---|---|
| orientarme en el repositorio | [README raíz](../README.md) | [AGENTS.md](../AGENTS.md) |
| conocer el estado actual | Git y `bun run cordon:estado` | [Índice de bugs](bugs/INDEX.md) |
| usar la aplicación | [Uso productivo](uso-productivo.md) | [Hoja básica](cheatsheets/opforja-basico.html) |
| aprender OPM | [Manual de OPM puro](manual-opm-puro.md) | [Manual de opforja](manual-opforja.md) |
| aplicar el método Forja | [Manual de opforja](manual-opforja.md) | [Manual de sistemas](manual-sistemas-opm.md) |
| modelar sistemas sanitarios | [Manual de sistemas](manual-sistemas-opm.md) | [Manual sanitario](manual-sanitarios-opm.md) |
| desarrollar software | [AGENTS.md](../AGENTS.md) | [Manual de software](manual-software-opm.md) |
| revisar contratos técnicos | [Índice de especificaciones](specs/README.md) | [Índice de decisiones](decisiones/README.md) |
| desplegar u operar | [Runbook](deploy/opforja.md) | `bun run cordon:estado` |
| investigar antecedentes | [Referencias históricas](reference/README.md) | [Auditorías y actas](auditorias/README.md) |

## Jerarquía de autoridad

1. La solicitud vigente y [AGENTS.md](../AGENTS.md) gobiernan el trabajo local.
2. Las SSOT OPM/Forja viven en KORA Pneuma. El
   [resolutor local](canon-opm/resolutor-urn.json) fija las versiones observadas;
   los archivos de `canon-opm/` son puentes, no otra SSOT.
3. El comportamiento verificable de `app/` y sus tests decide qué está implementado.
4. [GOVERNANCE de ui-forja](../ui-forja/GOVERNANCE.md) gobierna estética y chrome
   bajo la precedencia semántica OPM.
5. Git, la implementación y sus tests fijan el estado; `cordon:estado` contrasta
   producción y canon; los [criterios del próximo corte](roadmap/README.md) evitan abrir
   trabajo sin evidencia y el [índice de bugs](bugs/INDEX.md) registra defectos observados.
6. Las [especificaciones](specs/README.md), [decisiones](decisiones/README.md),
   actas y auditorías conservan contratos o evidencia; no sustituyen el estado vivo.
7. Git y `reference/` conservan historia. `_archivo/` es desplazamiento local e
   ignorado de documentos retirados del árbol activo.

`CLAUDE.md` no agrega gobernanza: importa `AGENTS.md` para compatibilidad de runtime.

## Corpus de aprendizaje y uso

Cada concepto durable tiene un solo hogar explicativo:

| Documento | Propiedad editorial |
|---|---|
| [Uso productivo](uso-productivo.md) | interfaz, persistencia, exportación y atajos |
| [Manual de OPM puro](manual-opm-puro.md) | ontología, enlaces, refinamiento, OPD y OPL |
| [Manual de opforja](manual-opforja.md) | método Forja y trabajo humano-agente |
| [Manual de sistemas](manual-sistemas-opm.md) | evidencia, AS-IS/TO-BE, intervención, adopción y retiro |
| [Manual sanitario](manual-sanitarios-opm.md) | decisiones específicas de sistemas sanitarios |
| [Manual de software](manual-software-opm.md) | código, datos, arquitectura, tests, entrega y operación |
| [Hojas rápidas](cheatsheets/README.md) | proyecciones visuales derivadas de los manuales |

Las hojas rápidas no crean capacidades ni reglas nuevas. Los manuales conservan
principios durables; Git conserva cierres y el próximo corte solo se abre con evidencia.

## Estructura documental activa

```text
docs/
├── README.md                         orientación e índice
├── roadmap/
│   ├── README.md                     criterios del próximo corte
│   └── registro-conformidad-ssot.md  brechas normativas declaradas
├── decisiones/README.md              decisiones técnicas vigentes
├── specs/README.md                   mapa de especificaciones y reemplazos
├── deploy/opforja.md                 operación y despliegue
├── auditorias/README.md              evidencia y actas con referencia viva
├── memorias-aprendizajes/README.md   notas técnicas aún consumidas
├── reference/README.md               material histórico no gobernante
├── bugs/INDEX.md                     defectos y solicitudes activas
├── canon-opm/                        puentes locales al canon
├── cheatsheets/                      hojas rápidas derivadas
└── manual-*.md · uso-productivo.md   corpus de aprendizaje y uso
```

`superpowers/specs/` conserva algunas rutas históricas citadas por código y tests;
su clasificación vigente está centralizada en [specs/README.md](specs/README.md).

## Vigencia y archivo

- Solo hay una versión activa por especie operativa.
- No se mantiene una instantánea paralela del estado. Si una tarea queda materialmente
  inconclusa, `AGENTS.md` permite un `HANDOFF.md` raíz temporal que se elimina al cerrar.
- Informes, auditorías, actas y documentos operativos nuevos usan
  `<especie>-AAAA-MM-DD.md`; si hay más de uno el mismo día, usan `-2`, `-3`, etc.
- Un sucesor se crea como archivo nuevo. La versión anterior se mueve a `_archivo/`
  sin editarla.
- Los planes ejecutados, prompts de asignación y notas de sesión sin consumidores se
  archivan; no permanecen como instrucciones aparentes.
- Git conserva la historia versionada. `_archivo/` y `*.tar.gz` permanecen ignorados.

## Contrato editorial

1. La marca se escribe **opforja**, en minúscula.
2. La documentación usa español de Chile (`es-CL`); código, comandos e
   identificadores nuevos usan inglés.
3. Las fechas de estado se escriben como `AAAA-MM-DD`, nunca de forma relativa.
4. Cada documento tiene un H1 y enlaces relativos resolubles para navegación local.
5. Las afirmaciones formales dicen exactamente qué se verificó; una firma observable
   no prueba identidad, bisimulación ni equivalencia total.
6. `IMPLEMENTADO`, `PROPUESTO` y `EXTERNO` describen capacidades. La vigencia de un
   documento se expresa por su ubicación, índice y fecha, no inventando otra escala.
7. La [ley ejecutable del corpus](../app/src/leyes/corpus-documental.test.ts)
   verifica la superficie principal antes de publicar.
