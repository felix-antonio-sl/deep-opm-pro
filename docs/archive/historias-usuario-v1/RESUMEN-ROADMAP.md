---
titulo: "Resumen roadmap — Inventario de historias de usuario del modelador OPM"
fecha: 2026-04-23
estado: "cerrado"
fuente: "docs/historias-usuario/"
epicas: 48
hu_emitidas: 1164
metodo_conteo: "grep -c '^### HU-' docs/historias-usuario/epica-*.md"
---

## 1. Resultado ejecutivo

El inventario queda cerrado con **48/48 épicas producidas** y **1.164 historias de usuario** derivadas del corpus `opcloud-reverse/`. Cada épica mantiene trazabilidad al documento fuente, preguntas abiertas explícitas y dependencias hacia otras épicas cuando corresponde.

La prioridad operativa es separar el backlog en cuatro cortes: **MVP-α** para cerrar el kernel OPM usable, **MVP-β** para convertirlo en modelador de dominio real, **MVP-γ** para productividad/interoperabilidad y **MVP-δ** para colaboración, simulación, runtime y análisis.

## 2. Cortes MVP

| Corte | Objetivo | Épicas foco | HU en épicas foco | Criterio de salida |
|---|---|---|---:|---|
| **MVP-α** | Kernel OPM editable y persistente | 10, 11, 20, 30, 50 | 136 | Crear cosas y links básicos, navegar OPD tree, guardar/cargar, ver OPL reactivo y fixtures canónicos. |
| **MVP-β** | Modelador usable para KORA/HDOS | 12, 13, 15, 16, 1B, 1C, 34, A0 | 227 | In-zooming, estados, validaciones, enlaces avanzados, creación guiada de modelos y stereotypes genéricos. |
| **MVP-γ** | Productividad, organización e intercambio | 14, 17, 18, 19, 1A, 21, 31, 32, 33, 35, 42, 60, 61, 70, 71, 82, 90, 91, A1 | 449 | Styling, grilla/resize, búsqueda, folders/templates/sub-models, notes, export/import, shortcuts, tutorial y requirements modeling. |
| **MVP-δ** | Capacidades avanzadas diferidas | 40, 41, 80, 81, A2, B0, B1, B2, B3, B4, B5, C0, C1, C2, D0, D1 | 352 | Colaboración, administración, defaults, GenAI, simulación, runtime externo y análisis de calidad. |

Notas de corte:

- **MVP-α** puede implementarse incrementalmente, pero no debe salir sin las HUs M0 de creación, persistencia y OPL.
- **MVP-β** depende de que `A0` esté disponible como mecanismo genérico antes de especializar dominios.
- **MVP-γ** contiene muchas épicas `S/C`, pero varias son aceleradores reales para trabajo diario: búsqueda, shortcuts, export e import.
- **MVP-δ** concentra dependencias de infraestructura o semántica avanzada; no bloquea el modelador core.

## 3. Agregados cuantitativos

### 3.1 Por prioridad HU

| Prioridad | HUs | Lectura |
|---|---:|---|
| M0 | 157 | Kernel OPM irreducible. |
| M1 | 183 | Producto mínimo usable. |
| S | 469 | Diferenciales de productividad y expresividad. |
| C | 241 | Conveniencia, pulido y automatización secundaria. |
| W | 114 | Diferido por infraestructura, colaboración o runtime externo. |
| **Total** | **1.164** | — |

### 3.2 Por nivel categórico primario

| Nivel | HUs | Lectura |
|---|---:|---|
| K | 253 | Kernel, tipos, validadores y reglas semánticas. |
| V | 193 | Render visual, canvas y vocabulario gráfico. |
| L | 126 | Lentes derivadas: OPL, árbol, mapas, tablas. |
| P | 78 | Persistencia, workspace, versionado y serialización. |
| U | 385 | UI, gestos, popups, modales y toolbars. |
| D | 6 | Profiles o dominio explícito. |
| C | 57 | Configuración usuario/organización. |
| X | 66 | Integración externa, import/export/runtime. |
| **Total** | **1.164** | — |

Lectura complementaria: si se cuentan menciones secundarias además del nivel primario, las HUs tocan `U=592`, `V=411`, `K=399`, `L=253`, `P=158`, `X=130`, `C=91`, `D=17`. Esto confirma que gran parte del backlog es transversal entre kernel, render y UI.

### 3.3 Por capa funcional

| Capa | Épicas | HUs |
|---|---:|---:|
| Canvas y modelado central | 13 | 288 |
| Estructura de modelo | 2 | 40 |
| Persistencia | 6 | 165 |
| Colaboración | 3 | 64 |
| OPL | 1 | 28 |
| Exportación | 2 | 61 |
| Interoperabilidad | 2 | 51 |
| Configuración | 3 | 68 |
| Interacción | 2 | 37 |
| Extensiones del lenguaje | 3 | 98 |
| Simulación | 6 | 150 |
| Runtime | 3 | 76 |
| Análisis | 2 | 38 |
| **Total** | **48** | **1.164** |

### 3.4 Por tamaño HU

| Tamaño | HUs |
|---|---:|
| XS | 234 |
| S | 565 |
| M | 309 |
| L | 51 |
| XL | 5 |
| **Total** | **1.164** |

## 4. Dependencias bloqueantes

Las dependencias observadas por `Bloqueada por:` muestran que el backlog pivota sobre pocas épicas fundacionales.

| Bloqueante | Bloquea principalmente | Motivo |
|---|---|---|
| **EPICA-10** | 11, 12, 13, 14, 15, 16, 17, 1B, 1C, B1, B2, B4, B5, 91, D0 | Crear Object/Process/link y edición base es la raíz de casi todo el modelador. |
| **EPICA-11** | 15, 16, B4, B5 | Links básicos y agent/result/instrument son prerrequisito de enlaces avanzados y simulación. |
| **EPICA-12** | 1C, B4 | In-zooming define jerarquía y contexto para validaciones y loops. |
| **EPICA-13** | 15, 17, B3, B4 | Estados y value-states sostienen rangos, condiciones y designaciones. |
| **EPICA-20** | Navegación, persistencia avanzada, roadmap α | El árbol OPD es la navegación primaria de modelos multi-OPD. |
| **EPICA-30** | 31, 32, 33, 34, colaboración | Save/load/versiones son base de workspace y multiusuario. |
| **EPICA-50** | 10-17, B1-B5, export/documentación | OPL es la lente textual que valida la semántica observable. |
| **EPICA-A0** | A1, A2, B3 | Stereotypes son el mecanismo genérico para requirements, GenAI y property sets. |
| **EPICA-B0** | B1-B5 | Runner base, Play/Pause/Stop y modo simulación preceden la simulación computacional. |
| **EPICA-B1** | B2, B3, B5 | Objetos computacionales, unidad, alias y value-state habilitan funciones, rangos e input. |
| **EPICA-B2** | B5 y parte de B4 | User-defined functions son el sustrato de código para getters y condiciones avanzadas. |
| **EPICA-C0/C2** | B5 headless, runtime conectado | MQTT/ROS sólo son necesarios para alimentar simulación desde sistemas externos. |

Orden recomendado de desbloqueo:

1. Cerrar el eje `10 -> 11 -> 20 -> 30 -> 50` para dejar un modelador OPM legal y persistible.
2. Cerrar `12 -> 13 -> 15/16 -> 1C` para que la edición sea semánticamente robusta.
3. Cerrar `A0` antes de requirements, property sets y cualquier dominio con extensiones.
4. Diferir `B0-B5`, `C0-C2`, `D0-D1` hasta que el kernel y la persistencia estén estabilizados.

## 5. Open questions consolidadas

El inventario registra **561 preguntas abiertas**. No todas bloquean implementación inmediata: muchas corresponden a comportamiento OPCloud no observado, exactitud visual, políticas de error o integración diferida. Para Sprint 0 conviene resolver primero las preguntas que afectan `M0/M1`, kernel y persistencia.

### 5.1 Por épica

| Épica | Open questions | Foco dominante |
|---|---:|---|
| 10 | 5 | Description, affiliation, biblioteca draggable, object in-diagram in-zooming. |
| 11 | 10 | Style/copy style, bus estructural, remove operation, OPL procedural y NOT. |
| 12 | 14 | Menú radial, bring connected en in-zoom, fases de refinamiento, layout jerárquico. |
| 13 | 10 | Current state, suppress, state/value/designation, duración y eliminación de estados. |
| 14 | 10 | Alcance de styling, patrones de links, copy/paste style, multi-selección. |
| 15 | 10 | XOR/OR, self-invocation, port movement, condition/event/NOT, tool button. |
| 16 | 11 | Links table, filtros, edición masiva, multiplicidad custom, style reset/copy. |
| 17 | 20 | Alias, URL, atributos, instancias, multi-apariencia, designaciones y current. |
| 18 | 8 | Semi-folding, persistencia de vista, límites y reversibilidad. |
| 19 | 12 | Imagen/texto, URL, cache, export y política de fallas. |
| 1A | 11 | Grid, snap, resize automático/manual y conflictos con layout. |
| 1B | 6 | Bring connected/links, duplicados visuales y scope de OPD. |
| 1C | 12 | Severidad de validaciones, naming serial, remove operation y methodology checking. |
| 20 | 9 | Orden, rename, drag/reorder, cut/paste y estados del árbol. |
| 21 | 8 | Refresh, zoom, tooltip, filtros, export y persistencia de vista. |
| 30 | 12 | Dirty state, versiones, permisos, búsqueda global, glifos y retención. |
| 31 | 12 | Matriz permisos, herencia, operaciones folder y visibilidad workspace. |
| 32 | 13 | Sub-models, rutas, sincronización, ownership y composición cross-model. |
| 33 | 13 | Scope de templates, edición, versiones, permisos y colisiones. |
| 34 | 13 | Wizard, defaults, validación, ejemplos y transición a save/load. |
| 35 | 10 | Búsqueda, highlight, Unicode/case, deduplicación y move semantics. |
| 40 | 11 | Read-only, token, auto-read, permisos efectivos y excepciones. |
| 41 | 10 | Chat, notificaciones, permisos, historial, links y búsqueda. |
| 42 | 12 | Notes, anclaje, visibilidad, persistencia, permisos y export. |
| 50 | 10 | Edición inversa OPL, sincronización, grammar coverage y conflictos. |
| 60 | 17 | PDF, selección OPD, page setup, share, tooltips y estilos exportables. |
| 61 | 12 | SVG, scopes, CSS/fonts, ids, metadata y compatibilidad. |
| 70 | 15 | OPCAT import, mapping, layout, validación, warnings y round-trip parcial. |
| 71 | 13 | CSV, delimitador, encoding, mapping, dry-run, merge y layout. |
| 80 | 14 | Admin UI, grupos, org management, expiración, privacidad y aislamiento. |
| 81 | 8 | Reset defaults, herencia, OPL colors, persistencia de defaults. |
| 82 | 12 | Ontología, suggest/enforce, alias, case-sensitivity, import/export y auditoría. |
| 90 | 10 | Scope de shortcuts, conflictos, accesibilidad, remapeo y plataforma. |
| 91 | 8 | Tutorial, persistencia de progreso, ejemplos y asistencia pedagógica. |
| A0 | 14 | Stereotypes, property sets, herencia, aplicación, edición y visualización. |
| A1 | 14 | Requirements, trazabilidad, vistas proyectadas, estados y export. |
| A2 | 12 | GenAI, prompts, privacidad, revisión humana y trazabilidad. |
| B0 | 12 | Runner conceptual, sync/async, headless, reset, trazas y export. |
| B1 | 12 | Tipos computacionales, distribuciones, XLSX, alias, MQTT y reset. |
| B2 | 12 | User-defined functions, errores, sandbox, aliases, biblioteca y versionado. |
| B3 | 14 | Range syntax, hard validation, validation time, defaults, export y herencia. |
| B4 | 12 | Conditions, loops, randomize, headless, counters, infinito y XLSX. |
| B5 | 12 | Persistencia input, validación, cancelación, headless, async, aliases y timeout. |
| C0 | 14 | MQTT broker, topics, QoS, reconexión, seguridad y mapping payload. |
| C1 | 12 | URLs, métodos HTTP, auth, errores, mapping y ejecución. |
| C2 | 16 | ROS graph, topics, services, Turtlesim, conexión, errores y sincronización. |
| D0 | 12 | Missing knowledge, ML, datasets, umbrales, UX y explicabilidad. |
| D1 | 12 | Informativity, fórmulas, pesos, visualización, thresholds y comparabilidad. |
| **Total** | **561** | — |

### 5.2 Paquetes de decisión para Sprint 0

| Paquete | Preguntas a cerrar primero | Razón |
|---|---|---|
| Kernel OPM | Q10, Q11, Q13, Q15, Q16, Q17 | Afectan tipos, enlaces, estados, OPL y semántica base. |
| Persistencia | Q30-Q35 | Definen save/load, versiones, folders, templates, sub-models y búsqueda. |
| Visual/Render | Q14, Q18, Q19, Q21, Q60, Q61 | Evitan re-trabajo en styling, semi-fold, imágenes y export. |
| Extensiones | Q80-Q82, QA0-QA2 | Separan configuración organizacional de profiles y GenAI. |
| Simulación | QB0-QB5 | Deben cerrarse antes de diseñar el runner runtime real. |
| Runtime/análisis | QC0-QC2, QD0-QD1 | Diferibles hasta post-MVP; requieren infraestructura externa o modelos analíticos. |

## 6. Archivos cerrados

- `00-METODOLOGIA-HU.md` — metodología corregida a 48 épicas productivas.
- `INDICE-HU.md` — conteos reales por capa y estado de producción 48/48.
- `epica-b3-simulation-range-validation.md` — EPICA-B3 cerrada con 18 HUs.
- `epica-b5-simulation-user-input.md` — EPICA-B5 cerrada con 23 HUs.
- `RESUMEN-ROADMAP.md` — este resumen consolidado.
- `MATRIZ-HU-REGLAS-SSOT.md` — cruce de 48 épicas y 1.164 HUs contra los artefactos de reglas derivados de la SSOT.
