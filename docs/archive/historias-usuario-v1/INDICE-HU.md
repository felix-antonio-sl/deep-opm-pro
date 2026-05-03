---
titulo: "Índice maestro — Inventario de historias de usuario del modelador OPM"
fecha: 2026-04-23
alcance: "Taxonomía completa y mapa de épicas derivadas de opcloud-reverse. Un archivo por épica."
estado: "activo"
metodologia: "00-METODOLOGIA-HU.md"
fuente: "/home/felix/projects/opm-model-app/opcloud-reverse/"
---

## 1. Propósito

Índice único y navegable del inventario de historias de usuario. Cada fila apunta a un archivo `epica-<NN>-<slug>.md` que contiene las HU específicas de esa épica, derivadas 1:1 del documento correspondiente en `opcloud-reverse/`.

Este índice es el **mapa de consulta rápida**: prioridad orientativa, foco categórico, tamaño y bloqueos de alto nivel. Las decisiones de corte (MVP-α, β, γ) se consolidan en `RESUMEN-ROADMAP.md`.

## 2. Capas funcionales

Las 48 épicas se organizan en 11 capas funcionales (agrupación de categorías del índice de reverse):

| # | Capa | Épicas | Peso en kernel OPM | Peso en producto |
|---|---|---|---|---|
| 1 | **Canvas y modelado central** | 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 1A, 1B, 1C | **crítico** | alto |
| 2 | **Estructura de modelo** | 20, 21 | crítico | alto |
| 3 | **Persistencia** | 30, 31, 32, 33, 34, 35 | medio | alto |
| 4 | **Colaboración** | 40, 41, 42 | bajo | medio |
| 5 | **OPL** | 50 | alto | alto |
| 6 | **Exportación** | 60, 61 | bajo | medio |
| 7 | **Interoperabilidad** | 70, 71 | medio | medio |
| 8 | **Configuración** | 80, 81, 82 | bajo | medio |
| 9 | **Interacción** | 90, 91 | bajo | alto |
| 10 | **Extensiones del lenguaje** | A0, A1, A2 | alto | medio |
| 11 | **Simulación, runtime y análisis** | B0–B5, C0–C2, D0–D1 | medio | bajo (MVP) |

## 2.bis Status global por épica (last_check: 2026-04-27)

Cada `epica-*.md` declara su `estado` en el frontmatter: `WIP` (hay
implementación parcial visible en `src/`), `TODO` (sin implementación),
`BLOCKED` (esperando decisión externa), `DONE` (cubierto y blindado por
e2e). Resumen consolidado:

| Capa | Épicas | WIP | TODO | BLOCKED | DONE |
|---|---|---|---|---|---|
| Canvas y modelado central | 10–19, 1A–1C | 10, 11, 12, 13, 15, 16, 1A, 1C | 14, 17, 18, 19, 1B | — | — |
| Estructura de modelo | 20, 21 | 20 | 21 | — | — |
| Persistencia | 30–35 | 30, 34 | 31, 32, 33, 35 | — | — |
| Colaboración | 40–42 | — | 40, 41, 42 | — | — |
| OPL | 50 | 50 | — | — | — |
| Exportación | 60, 61 | 61 | 60 | — | — |
| Interoperabilidad | 70, 71 | — | 70, 71 | — | — |
| Configuración | 80–82 | 82 | 80, 81 | — | — |
| Interacción | 90, 91 | 90 | 91 | — | — |
| Extensiones del lenguaje | A0, A1, A2 | A0, A1 | A2 | — | — |
| Simulación, runtime y análisis | B0–B5, C0–C2, D0–D1 | — | todas | — | — |

**Totales**: 16 WIP, 32 TODO, 0 BLOCKED, 0 DONE.

La ausencia de `DONE` refleja que ninguna épica tiene aún cobertura
e2e completa que valide *todas* sus HU; las que están en `WIP` tienen
funcionalidad observable y tests parciales (`tests/e2e/run.ts` cubre
los flujos centrales).

Esta tabla es heurística a nivel de épica; el detalle por HU vive en
los archivos `epica-*.md` y se irá afinando ciclo a ciclo. Para
auditar HU específicas, comparar el cuerpo de la épica contra `src/`.

## 3. Índice de épicas

Formato: `EPICA-NN — título (archivo) — prioridad predominante — notas`.

### 3.1 Canvas y modelado central (13 épicas)

Núcleo del producto. Estas épicas materializan el kernel OPM en interacción directa con el modelador.

| Épica | Título | Archivo | Prioridad | Notas |
|---|---|---|---|---|
| EPICA-10 | Creación de cosas (proceso, objeto, link inicial) | [epica-10-canvas-creacion-cosas.md](epica-10-canvas-creacion-cosas.md) | **M0** | Punto de entrada; cubre drag, popup nombre, affiliation, essence, link-table. |
| EPICA-11 | Modelado básico (partes, agente, instrumento, tagged link) | [epica-11-canvas-modelado-basico.md](epica-11-canvas-modelado-basico.md) | **M0** | Completa la taxonomía de links básicos y edición geométrica inicial. |
| EPICA-12 | In-zooming y descomposición | [epica-12-canvas-inzooming.md](epica-12-canvas-inzooming.md) | **M0** | Refinamiento fundamental; crea OPD hijo; preserva entidad única. |
| EPICA-13 | Estados, designaciones y valor | [epica-13-canvas-estados.md](epica-13-canvas-estados.md) | **M0** | Axioma "stateful ≥2 states". |
| EPICA-14 | Styling, fuentes, colores, widths | [epica-14-canvas-styling.md](epica-14-canvas-styling.md) | S | Post-MVP visual. |
| EPICA-15 | Enlaces avanzados (XOR/OR, probabilidad, paths, events/conditions) | [epica-15-canvas-enlaces-avanzados.md](epica-15-canvas-enlaces-avanzados.md) | **M1** | Semántica OPM completa. |
| EPICA-16 | Tabla y propiedades de enlaces | [epica-16-canvas-enlaces-propiedades.md](epica-16-canvas-enlaces-propiedades.md) | M1 | Multiplicidad, tag, style copy. |
| EPICA-17 | Objects advanced: atributos, clases, instancias | [epica-17-canvas-atributos-instancias.md](epica-17-canvas-atributos-instancias.md) | **M1** | Object classes, attributes, instances — complejo; revisar subdivisión. |
| EPICA-18 | Semi-folding | [epica-18-canvas-semi-folding.md](epica-18-canvas-semi-folding.md) | S | Compresión intra-rectángulo. |
| EPICA-19 | Imágenes embebidas en cosas | [epica-19-canvas-imagenes.md](epica-19-canvas-imagenes.md) | C | Estética; no impacta semántica. |
| EPICA-1A | Grid y resize | [epica-1a-canvas-grid-resize.md](epica-1a-canvas-grid-resize.md) | M1 | Grid on/off, resize manual/automático. |
| EPICA-1B | Bring connected, bring links | [epica-1b-canvas-operaciones-bring.md](epica-1b-canvas-operaciones-bring.md) | M1 | Gestos fundamentales para modelado real. |
| EPICA-1C | Validaciones de canvas (inner/outer, duplicate names, methodology) | [epica-1c-canvas-validaciones.md](epica-1c-canvas-validaciones.md) | **M0** | Integridad; incluye warnings. |

### 3.2 Estructura de modelo (2 épicas)

Navegación arriba del canvas: árbol OPD y meta-vista del modelo.

| Épica | Título | Archivo | Prioridad | Notas |
|---|---|---|---|---|
| EPICA-20 | Árbol OPD | [epica-20-estructura-opd-tree.md](epica-20-estructura-opd-tree.md) | **M0** | Navegación primaria; creación por in-zoom; orden/arrangement. |
| EPICA-21 | System Map (meta-vista) | [epica-21-estructura-system-map.md](epica-21-estructura-system-map.md) | S | Visualización macro para modelos grandes. |

### 3.3 Persistencia (6 épicas)

Ciclo de vida del modelo: crear, guardar, cargar, organizar, buscar.

| Épica | Título | Archivo | Prioridad | Notas |
|---|---|---|---|---|
| EPICA-30 | Save/Load básico + versiones + archivado | [epica-30-persistencia-save-load.md](epica-30-persistencia-save-load.md) | **M0** | Cornerstone de persistencia. |
| EPICA-31 | Folders (workspace) | [epica-31-persistencia-folders.md](epica-31-persistencia-folders.md) | **M1** | Jerarquía + matriz O/W/R. |
| EPICA-32 | Sub-models (composición inter-modelo) | [epica-32-persistencia-sub-models.md](epica-32-persistencia-sub-models.md) | S | Interop intra-workspace. |
| EPICA-33 | Templates | [epica-33-persistencia-templates.md](epica-33-persistencia-templates.md) | S | Reutilización. |
| EPICA-34 | Create New Model + Wizard | [epica-34-persistencia-new-model.md](epica-34-persistencia-new-model.md) | **M0** | Entrada al modelador. |
| EPICA-35 | Move models + búsqueda de things | [epica-35-persistencia-move-search.md](epica-35-persistencia-move-search.md) | M1 | Operaciones secundarias críticas. |

### 3.4 Colaboración (3 épicas)

Multi-usuario intra-organización. Prioridad baja para un modelador local; alta si el modelador quiere escalar.

| Épica | Título | Archivo | Prioridad | Notas |
|---|---|---|---|---|
| EPICA-40 | Permisos y tokens de escritura | [epica-40-colaboracion-permisos.md](epica-40-colaboracion-permisos.md) | W (MVP) / M1 (post) | Depende de backend multi-usuario. |
| EPICA-41 | Model Chat | [epica-41-colaboracion-chat.md](epica-41-colaboracion-chat.md) | W (MVP) | Depende de canal comunicación. |
| EPICA-42 | Notes (panel lateral) | [epica-42-colaboracion-notes.md](epica-42-colaboracion-notes.md) | S | Notas intra-modelo. |

### 3.5 OPL (1 épica)

| Épica | Título | Archivo | Prioridad | Notas |
|---|---|---|---|---|
| EPICA-50 | OPL pane avanzado | [epica-50-opl-pane.md](epica-50-opl-pane.md) | **M0** | Eco OPL es diferencial OPM; avanzado = S. |

### 3.6 Exportación (2 épicas)

| Épica | Título | Archivo | Prioridad | Notas |
|---|---|---|---|---|
| EPICA-60 | Export PDF | [epica-60-export-pdf.md](epica-60-export-pdf.md) | S | Deliverable operativo. |
| EPICA-61 | Export SVG | [epica-61-export-svg.md](epica-61-export-svg.md) | S | Más ligero que PDF; también útil para docs. |

### 3.7 Interoperabilidad (2 épicas)

| Épica | Título | Archivo | Prioridad | Notas |
|---|---|---|---|---|
| EPICA-70 | Import OPCAT | [epica-70-interop-opcat.md](epica-70-interop-opcat.md) | M1 | Permite migrar desde predecesor OPM. |
| EPICA-71 | Import CSV | [epica-71-interop-csv.md](epica-71-interop-csv.md) | C | Bootstrapping masivo de things. |

### 3.8 Configuración (3 épicas)

| Épica | Título | Archivo | Prioridad | Notas |
|---|---|---|---|---|
| EPICA-80 | User/group/organization | [epica-80-config-user-org.md](epica-80-config-user-org.md) | W (MVP local) / M1 (multi-usuario) | Admin-only. |
| EPICA-81 | Style defaults | [epica-81-config-style-defaults.md](epica-81-config-style-defaults.md) | C | Preferencias visuales. |
| EPICA-82 | Organization ontology | [epica-82-config-organization-ontology.md](epica-82-config-organization-ontology.md) | S | Normalización léxica; clave para dominios. |

### 3.9 Interacción (2 épicas)

| Épica | Título | Archivo | Prioridad | Notas |
|---|---|---|---|---|
| EPICA-90 | Shortcuts de teclado | [epica-90-interaccion-shortcuts.md](epica-90-interaccion-shortcuts.md) | **M1** | Fundamentales para velocidad ME. |
| EPICA-91 | Tutorial mode | [epica-91-interaccion-tutorial.md](epica-91-interaccion-tutorial.md) | S | Onboarding MN. |

### 3.10 Extensiones del lenguaje (3 épicas)

| Épica | Título | Archivo | Prioridad | Notas |
|---|---|---|---|---|
| EPICA-A0 | Stereotypes (mecanismo genérico) | [epica-a0-extension-stereotypes.md](epica-a0-extension-stereotypes.md) | **M1** | Soporta todos los dominios; clave para HDOS/KORA. |
| EPICA-A1 | Requirements Modeling | [epica-a1-extension-requirements.md](epica-a1-extension-requirements.md) | S | Extensión formal; instancia de A0. |
| EPICA-A2 | Generative AI Requirements | [epica-a2-extension-generative-ai.md](epica-a2-extension-generative-ai.md) | C | Auxiliar a A1. |

### 3.11 Simulación, runtime y análisis (11 épicas)

| Épica | Título | Archivo | Prioridad | Notas |
|---|---|---|---|---|
| EPICA-B0 | Simulación conceptual | [epica-b0-simulation-conceptual.md](epica-b0-simulation-conceptual.md) | S | Step-through del modelo. |
| EPICA-B1 | Simulación computacional | [epica-b1-simulation-computational.md](epica-b1-simulation-computational.md) | C | Requiere engine computacional. |
| EPICA-B2 | User-defined functions | [epica-b2-simulation-user-functions.md](epica-b2-simulation-user-functions.md) | C | Extensión B1. |
| EPICA-B3 | Range validation | [epica-b3-simulation-range-validation.md](epica-b3-simulation-range-validation.md) | C | Integridad de valores. |
| EPICA-B4 | Conditions + loops | [epica-b4-simulation-conditions-loops.md](epica-b4-simulation-conditions-loops.md) | C | Flujos no lineales. |
| EPICA-B5 | User input during simulation | [epica-b5-simulation-user-input.md](epica-b5-simulation-user-input.md) | C | Simulación interactiva. |
| EPICA-C0 | MQTT runtime | [epica-c0-runtime-mqtt.md](epica-c0-runtime-mqtt.md) | W | Integración externa. |
| EPICA-C1 | External URLs runtime | [epica-c1-runtime-urls.md](epica-c1-runtime-urls.md) | W | Integración externa. |
| EPICA-C2 | ROS runtime | [epica-c2-runtime-ros.md](epica-c2-runtime-ros.md) | W | Integración externa robótica. |
| EPICA-D0 | Missing knowledge (ML) | [epica-d0-analysis-missing-knowledge.md](epica-d0-analysis-missing-knowledge.md) | W | Auxiliar analítico. |
| EPICA-D1 | Informativity grading | [epica-d1-analysis-informativity.md](epica-d1-analysis-informativity.md) | W | Métrica de calidad de modelo. |

## 4. Leyenda de prioridades

- **M0** Must-have kernel OPM (17 épicas): sin ellas el producto no es OPM legal.
- **M1** Must-have producto (11 épicas): usabilidad mínima real.
- **S** Should-have (11 épicas): diferenciales de productividad.
- **C** Could-have (5 épicas): conveniencia.
- **W** Won't-have (en MVP) (7 épicas): infra externa o prioridad muy baja para el modelador core.

Las 17 épicas M0 forman el **núcleo irreducible** del modelador OPM. Son las que el repo debe resolver primero y son la base del MVP-α funcional.

## 5. Roadmap tentativo de cortes

Esta sección es orientativa y se refina en `RESUMEN-ROADMAP.md` una vez completado el inventario. Los cortes sugeridos:

### 5.1 MVP-α (ya en curso, ver `project_mvp_editable`)

Cobertura: creación de things, link básico con picker, drag edit, layout algorítmico, OPL eco, 6 fixtures canónicos, persistencia IndexedDB capa 1.

Épicas implicadas (parcialmente): EPICA-10 (∼80%), EPICA-11 (∼60%), EPICA-50 (∼40%), EPICA-20 (∼30%), EPICA-30 (∼20%).

### 5.2 MVP-β (próximo)

Objetivo: modelador usable para un dominio real (KORA/HDOS).

Épicas foco completas: EPICA-12, EPICA-13, EPICA-1B, EPICA-1C, EPICA-15, EPICA-16, EPICA-34, EPICA-A0.

Complemento: cerrar EPICA-10, 11, 20, 30, 50.

### 5.3 MVP-γ (horizonte mediano)

Productividad y estética: EPICA-14, EPICA-17, EPICA-18, EPICA-1A, EPICA-21, EPICA-31, EPICA-32, EPICA-33, EPICA-35, EPICA-42, EPICA-60, EPICA-61, EPICA-70, EPICA-82, EPICA-90, EPICA-91, EPICA-A1.

### 5.4 MVP-δ y más allá

Colaboración, simulación, runtime, análisis: EPICA-40, 41, 71, 80, 81, A2, B0–B5, C0–C2, D0, D1, EPICA-19.

## 6. Conteo cuantitativo final

Conteo real basado en `grep -c "^### HU-"` sobre cada archivo `epica-*.md` al cierre del inventario.

| Capa | Épicas | HU emitidas |
|---|---|---|
| Canvas y modelado | 13 | 288 |
| Estructura | 2 | 40 |
| Persistencia | 6 | 165 |
| Colaboración | 3 | 64 |
| OPL | 1 | 28 |
| Exportación | 2 | 61 |
| Interoperabilidad | 2 | 51 |
| Configuración | 3 | 68 |
| Interacción | 2 | 37 |
| Extensiones | 3 | 98 |
| Simulación/runtime/análisis | 11 | 264 |
| **Total emitido** | **48** | **1.164** |

El inventario queda por sobre la proyección inicial por mayor atomización en persistencia, exportación, extensión y simulación.

## 7. Estado de producción

| Épica | Estado | HU emitidas | Notas |
|---|---|---|---|
| 10 | producido | 22 | Piloto canónico. |
| 11 | producido | 27 | — |
| 12 | producido | 34 | — |
| 13 | producido | 20 | — |
| 14 | producido | 17 | — |
| 15 | producido | 25 | — |
| 16 | producido | 22 | — |
| 17 | producido | 34 | — |
| 18 | producido | 15 | — |
| 19 | producido | 16 | — |
| 1A | producido | 18 | — |
| 1B | producido | 16 | — |
| 1C | producido | 22 | — |
| 20 | producido | 22 | — |
| 21 | producido | 18 | — |
| 30 | producido | 37 | — |
| 31 | producido | 26 | — |
| 32 | producido | 32 | — |
| 33 | producido | 22 | — |
| 34 | producido | 28 | — |
| 35 | producido | 20 | — |
| 40 | producido | 25 | — |
| 41 | producido | 17 | — |
| 42 | producido | 22 | — |
| 50 | producido | 28 | — |
| 60 | producido | 35 | — |
| 61 | producido | 26 | — |
| 70 | producido | 25 | — |
| 71 | producido | 26 | — |
| 80 | producido | 26 | — |
| 81 | producido | 22 | — |
| 82 | producido | 20 | — |
| 90 | producido | 21 | — |
| 91 | producido | 16 | — |
| A0 | producido | 40 | — |
| A1 | producido | 34 | — |
| A2 | producido | 24 | — |
| B0 | producido | 30 | — |
| B1 | producido | 27 | — |
| B2 | producido | 26 | — |
| B3 | producido | 18 | Cerrada en retoma final. |
| B4 | producido | 26 | — |
| B5 | producido | 23 | Cerrada en retoma final. |
| C0 | producido | 22 | — |
| C1 | producido | 26 | — |
| C2 | producido | 28 | — |
| D0 | producido | 22 | — |
| D1 | producido | 16 | — |
| **Total** | **producido** | **1.164** | **48/48 épicas.** |

La tabla queda cerrada al 2026-04-23 con todas las épicas producidas.

## 8. Referencias cruzadas

- `docs/historias-usuario/00-METODOLOGIA-HU.md` — metodología.
- `docs/historias-usuario/RESUMEN-ROADMAP.md` — roadmap definitivo (generado al cierre).
- `docs/historias-usuario/MATRIZ-HU-REGLAS-SSOT.md` — cruce épicas/HUs con reglas SSOT accionables de `docs/reglas/`.
- `/home/felix/projects/opm-model-app/opcloud-reverse/INDICE.md` — mapa fuente.
- `/home/felix/projects/opm-model-app/docs/ARQUITECTURA-CATEGORICA.md` — constitución categórica.
- `/home/felix/projects/opm-model-app/CLAUDE.md` — convenciones del repo.
