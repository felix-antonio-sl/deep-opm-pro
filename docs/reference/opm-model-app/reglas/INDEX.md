# Índice maestro de reglas OPM — opm-model-app

Cruza etapas/procesos de la app con los artefactos de reglas correspondientes. Usar este índice como primer punto de entrada.

## Mapa por etapa de la app

### Etapa 1 — Creación/edición del modelo (kernel)

| Proceso | Artefactos relevantes |
|---|---|
| Crear objeto/proceso | `10-primitivas-cosas.md` |
| Declarar esencia/afiliación/perseverancia | `10-primitivas-cosas.md` + `00-precedencia-autoridad.md` |
| Agregar estados a un objeto | `11-estados-designaciones.md` |
| Designar estado inicial/final/defecto/Current | `11-estados-designaciones.md` |
| Crear enlace procedimental | `13-enlaces-taxonomia-familias.md` |
| Crear enlace estructural | `14-enlaces-estructurales.md` |
| Crear enlace con estado especificado | `15-enlaces-estado-especificado.md` |
| Agregar modificador `e`/`c` | `16-modificadores-operadores.md` |
| Agregar operador AND/XOR/OR | `16-modificadores-operadores.md` |
| Declarar multiplicidad/cardinalidad | `16-modificadores-operadores.md` |
| Validar nombres y unicidad | `70-opl-convenciones-y-plantillas-cosa-estado.md` |
| Declarar estereotipo | `52-estereotipos-requirement.md` |
| Declarar binding computacional | `53-capa-computacional.md` |

### Etapa 2 — Renderizado visual (JointJS + layout)

| Proceso | Artefactos relevantes |
|---|---|
| Renderizar forma de cosa | `10-primitivas-cosas.md` |
| Aplicar contorno (sistémico/ambiental) | `10-primitivas-cosas.md` |
| Aplicar sombra (física/informacional) | `10-primitivas-cosas.md` |
| Dibujar rountangle de estado | `11-estados-designaciones.md` |
| Marcar designación inicial/final/defecto/Current | `11-estados-designaciones.md` |
| Dibujar decoración de extremo de enlace | `12-enlaces-decoraciones-marcas.md` |
| Dibujar triángulo estructural fundamental | `14-enlaces-estructurales.md` |
| Dibujar zigzag de invocación con punta | `13-enlaces-taxonomia-familias.md` (§invocación) |
| Marcar refinable (contorno grueso) | `10-primitivas-cosas.md` + `30-refinamiento-entre-opds.md` |
| Renderizar rótulo y alias | `20-layout-visual-opd.md` + `63-exportacion-canonica.md` |
| Renderizar marcas `e`/`c`/`/`//` | `12-enlaces-decoraciones-marcas.md` |
| Distribuir enlaces en descomposición | `31-distribucion-enlaces-descomposicion.md` |
| Manejar enlaces con estado anclados al rountangle | `15-enlaces-estado-especificado.md` |

### Etapa 3 — Layout algorítmico

| Proceso | Artefactos relevantes |
|---|---|
| Dagre global / rankdir | `20-layout-visual-opd.md` |
| Línea temporal (arriba → abajo) | `21-tiempo-paralelismo-orden.md` |
| Paralelismo por misma altura | `21-tiempo-paralelismo-orden.md` |
| Calcular envelope del refinable | `30-refinamiento-entre-opds.md` |
| Clasificar zonas interno/externo | `30-refinamiento-entre-opds.md` |
| Pasar estados a franja inferior | `11-estados-designaciones.md` |
| Habilitadores en fila | `13-enlaces-taxonomia-familias.md` (§habilitador) |
| Minimizar cruces | `20-layout-visual-opd.md` |
| Sin oclusión entre cosas | `20-layout-visual-opd.md` |
| Auto-viewport / fit-to-content | `63-exportacion-canonica.md` |

### Etapa 4 — Refinamiento y navegación

| Proceso | Artefactos relevantes |
|---|---|
| In-zooming a SDn+1 | `30-refinamiento-entre-opds.md` |
| Unfolding de refinadores | `30-refinamiento-entre-opds.md` |
| Clasificar contenedor vs elementos externos | `30-refinamiento-entre-opds.md` |
| Distribuir enlaces del padre a subprocesos | `31-distribucion-enlaces-descomposicion.md` |
| Enlaces escindidos (TS4/TS5) | `31-distribucion-enlaces-descomposicion.md` |
| Precedencia durante recomposición | `32-precedencia-recomposicion.md` |
| Supresión de estados en OPD padre | `33-supresion-expresion-estados.md` |
| Semi-plegado | `34-semi-plegado.md` |
| Propiedades invariantes (esencia, perseverancia, nombres) | `35-invariantes-entre-niveles.md` |
| Navegar árbol de procesos SD → SDn | `40-navegacion-arbol-identidad.md` |
| Asignar identificador persistente | `40-navegacion-arbol-identidad.md` |
| Tres categorías de OPD (jerárquico, anclada, ad hoc) | `40-navegacion-arbol-identidad.md` |

### Etapa 5 — Persistencia y metamodelo

| Proceso | Artefactos relevantes |
|---|---|
| Serializar existencia única de cosa | `41-metamodelo-apariencia-existencia.md` |
| Serializar apariencia local por OPD | `41-metamodelo-apariencia-existencia.md` |
| Referencia externa cross-model | `42-sub-modelos-inter-modelo.md` |
| Sub-modelo como cuarto par canónico | `42-sub-modelos-inter-modelo.md` |
| Ciclo cargado/sincronizado de referencia externa | `42-sub-modelos-inter-modelo.md` |
| Identidad persistente vs etiqueta visible | `40-navegacion-arbol-identidad.md` |

### Etapa 6 — Simulación y runtime

| Proceso | Artefactos relevantes |
|---|---|
| Marca de proceso activo | `50-simulacion-runtime-visual.md` |
| Marca de estado actual runtime | `50-simulacion-runtime-visual.md` |
| Diferenciar Current declarado vs runtime | `50-simulacion-runtime-visual.md` |
| Tokens transitorios de flujo | `50-simulacion-runtime-visual.md` |
| Declarar snapshot de simulación en export | `50-simulacion-runtime-visual.md` |
| Propiedades de duración dentro de elipse | `51-duracion-proceso.md` |
| Excepciones temporales | `51-duracion-proceso.md` + `85-metodologia-errores-simulacion.md` |

### Etapa 7 — OPL (generación textual)

| Proceso | Artefactos relevantes |
|---|---|
| Convenciones tipográficas Markdown | `70-opl-convenciones-y-plantillas-cosa-estado.md` |
| Plantilla D1-D13 (descripción de cosa) | `70-opl-convenciones-y-plantillas-cosa-estado.md` |
| Plantilla T/TS/H/HS (procedimental) | `71-opl-plantillas-procedimentales.md` |
| Plantilla ET/EH/ETS/EHS/CT/CH/CS/EX/IV | `71-opl-plantillas-procedimentales.md` |
| Plantilla SE/RF/SSE (estructural) | `72-opl-plantillas-estructurales.md` |
| Plantilla CX/CM (gestión contexto / inter-modelo) | `73-opl-plantillas-contexto-y-multiplicidad.md` |
| Reglas R1-R21 (transformación EN→ES) | `73-opl-plantillas-contexto-y-multiplicidad.md` |
| Análisis bidireccional EN/ES | `73-opl-plantillas-contexto-y-multiplicidad.md` |

### Etapa 8 — UI y afordances

| Proceso | Artefactos relevantes |
|---|---|
| Handles de selección | `60-ui-afordances-canvas.md` |
| Overlays modales y chrome | `60-ui-afordances-canvas.md` |
| Grid, snap, smart-guides | `20-layout-visual-opd.md` + `60-ui-afordances-canvas.md` |
| Notas y sticky notes | `60-ui-afordances-canvas.md` |
| Resaltado de búsqueda | `60-ui-afordances-canvas.md` |
| Tutorial y ayuda | `60-ui-afordances-canvas.md` |

### Etapa 9 — Validación y errores

| Proceso | Artefactos relevantes |
|---|---|
| Familia de validación (invalidez/advertencia/etc.) | `62-validacion-marcas-error.md` |
| Canvas limpio | `62-validacion-marcas-error.md` |
| Marcador `×` durante edición | `62-validacion-marcas-error.md` |
| Conflicto de unicidad nominal | `62-validacion-marcas-error.md` |
| Detección de sinónimos/homónimos | `84-metodologia-heuristicas-avanzadas.md` |

### Etapa 10 — Export y conformidad

| Proceso | Artefactos relevantes |
|---|---|
| canon-diagrama (SVG vectorial) | `63-exportacion-canonica.md` |
| canon-documento (multi-OPD + OPL + índice) | `63-exportacion-canonica.md` |
| Export parcial | `63-exportacion-canonica.md` |
| Preview raster | `63-exportacion-canonica.md` |
| Auto-fit viewport | `63-exportacion-canonica.md` |
| Recursos embebidos o referenciados | `63-exportacion-canonica.md` |
| Watermarks y overlays editoriales | `63-exportacion-canonica.md` |

### Etapa 11 — Operaciones auxiliares

| Proceso | Artefactos relevantes |
|---|---|
| Bring connected things | `64-operaciones-auxiliares-bring.md` |
| Bring links between selected entities | `64-operaciones-auxiliares-bring.md` |
| Reversibilidad | `64-operaciones-auxiliares-bring.md` |
| Supresores de enlaces no materializados | `64-operaciones-auxiliares-bring.md` |

### Etapa 12 — Estilado autoral

| Proceso | Artefactos relevantes |
|---|---|
| Tipografía, color, tamaño | `61-estilado-autoral.md` |
| Bitmap decorativo | `61-estilado-autoral.md` |
| Normalización léxica | `61-estilado-autoral.md` |
| Reserva de canales | `61-estilado-autoral.md` |

### Etapa 13 — Metodología guiada

| Proceso | Artefactos relevantes |
|---|---|
| Clasificar sistema (artificial/natural/social/socio-técnico) | `80-metodologia-construccion-sd.md` |
| Construir SD (asistente agnóstico) | `80-metodologia-construccion-sd.md` |
| Construir SD1 (descomposición) | `81-metodologia-sd1-descomposicion.md` |
| Gestión de complejidad N ≥ 2 | `82-metodologia-complejidad-gobernanza.md` |
| Heurísticas (proceso persistente → enlace, etc.) | `83-metodologia-heuristicas-avanzadas.md` |
| Control de flujo avanzado | `84-metodologia-control-flujo.md` |
| Errores temporales y simulación | `85-metodologia-errores-simulacion.md` |
| Modelado de requisitos | `86-metodologia-requisitos.md` |
| Ejecución y simulación del modelo | `87-metodologia-simulacion-ejecucion.md` |

### Etapa 14 — Verificación de conformidad

| Proceso | Artefactos relevantes |
|---|---|
| Invariantes de modelo | `99-invariantes-verificaciones.md` |
| Checklist por nivel (SD, SD1, SD2+, Global) | `99-invariantes-verificaciones.md` |
| Auditoría visual vs SSOT | `99-invariantes-verificaciones.md` + `docs/design/archive/auditoria-ssot-visual-2026-04-23.md` |

## Mapa por reglas V-*

| Rango V | Artefacto principal |
|---|---|
| V-0..V-0e | `01-canon-exportacion.md` |
| V-1..V-2 | `10-primitivas-cosas.md` |
| V-3 | `14-enlaces-estructurales.md` |
| V-4..V-9 | `11-estados-designaciones.md` |
| V-10..V-11 | `13-enlaces-taxonomia-familias.md` |
| V-12..V-13 | `16-modificadores-operadores.md` |
| V-14..V-19 | `16-modificadores-operadores.md` |
| V-20 | `16-modificadores-operadores.md` |
| V-21..V-23 | `16-modificadores-operadores.md` |
| V-24..V-29 | `14-enlaces-estructurales.md` |
| V-30 | `15-enlaces-estado-especificado.md` |
| V-31..V-32 | `21-tiempo-paralelismo-orden.md` |
| V-33..V-35 | `30-refinamiento-entre-opds.md` |
| V-36..V-41 | `31-distribucion-enlaces-descomposicion.md` |
| V-42..V-44 | `32-precedencia-recomposicion.md` |
| V-45 | `51-duracion-proceso.md` |
| V-46 | `40-navegacion-arbol-identidad.md` |
| V-47..V-49 | `70-opl-convenciones-y-plantillas-cosa-estado.md` |
| V-50..V-52 | `20-layout-visual-opd.md` |
| V-53..V-55 | `50-simulacion-runtime-visual.md` |
| V-56..V-59 | `14-enlaces-estructurales.md`, `21-tiempo-paralelismo-orden.md` |
| V-60..V-68 | `41-metamodelo-apariencia-existencia.md` |
| V-69..V-78 | `30-refinamiento-entre-opds.md`, `10-primitivas-cosas.md` |
| V-79..V-85 | `30-refinamiento-entre-opds.md` |
| V-86..V-90 | `33-supresion-expresion-estados.md` |
| V-91..V-94 | `30-refinamiento-entre-opds.md` |
| V-95..V-102 | `35-invariantes-entre-niveles.md` |
| V-103..V-112 | `31-distribucion-enlaces-descomposicion.md` |
| V-113..V-114 | `40-navegacion-arbol-identidad.md` |
| V-115 | `13-enlaces-taxonomia-familias.md` |
| V-116..V-120 | `34-semi-plegado.md` |
| V-121..V-123 | `41-metamodelo-apariencia-existencia.md` |
| V-124..V-127 | `10-primitivas-cosas.md` |
| V-128..V-131 | `14-enlaces-estructurales.md` |
| V-132..V-141 | `50-simulacion-runtime-visual.md` |
| V-142..V-157 | `52-estereotipos-requirement.md` |
| V-158..V-175 | `53-capa-computacional.md` |
| V-176..V-189 | `42-sub-modelos-inter-modelo.md` |
| V-190..V-193 | `12-enlaces-decoraciones-marcas.md` |
| V-194..V-195 | `20-layout-visual-opd.md` |
| V-196..V-199 | `20-layout-visual-opd.md`, `63-exportacion-canonica.md` |
| V-200..V-206 | `60-ui-afordances-canvas.md` |
| V-207..V-217 | `61-estilado-autoral.md` |
| V-218..V-224 | `62-validacion-marcas-error.md` |
| V-225..V-236 | `63-exportacion-canonica.md` |
| V-237..V-238 | `11-estados-designaciones.md` |
| V-239..V-241 | `13-enlaces-taxonomia-familias.md` |
| V-242..V-245 | `40-navegacion-arbol-identidad.md`, `30-refinamiento-entre-opds.md` |
| V-246..V-250 | `40-navegacion-arbol-identidad.md` |
| V-251..V-253 | `41-metamodelo-apariencia-existencia.md` |
| V-254..V-255 | `52-estereotipos-requirement.md` |
| V-256 | `42-sub-modelos-inter-modelo.md` |
| V-257..V-263 | `64-operaciones-auxiliares-bring.md` |

## Mapa por módulos de código

| Módulo | Artefactos que gobiernan |
|---|---|
| `src/nucleo/` | `10-*`, `11-*`, `13-*`, `14-*`, `15-*`, `16-*`, `41-*`, `42-*` |
| `src/render/jointjs/markers.ts` | `12-enlaces-decoraciones-marcas.md`, `14-enlaces-estructurales.md` |
| `src/render/jointjs/crear-cosa.ts` | `10-primitivas-cosas.md` |
| `src/render/jointjs/crear-estado.ts` | `11-estados-designaciones.md` |
| `src/render/jointjs/crear-link.ts` | `12-*`, `13-*`, `14-*`, `15-*`, `16-*` |
| `src/render/jointjs/pass-enlaces.ts` | `15-*`, `31-*`, `33-*` |
| `src/render/jointjs/pass-embed-refinable.ts` | `30-*` |
| `src/render/layout/index.ts` | `20-*`, `21-*`, `30-*`, `31-*` |
| `src/render/layout/pass-refinable-envelope.ts` | `30-*` |
| `src/render/layout/pass-zonas-externos.ts` | `30-*`, `31-*` |
| `src/render/layout/pass-estados-franja-inferior.ts` | `11-*` |
| `src/render/layout/pass-dagre-*.ts` | `20-*`, `21-*` |
| `src/render/layout/pass-habilitadores-fila.ts` | `13-*`, `20-*` |
| `src/render/layout/pass-stack-vertical-sin-cadena.ts` | `21-*` |
| `src/render/opl-renderer.ts` | `70-*`, `71-*`, `72-*`, `73-*` |
| `src/persistencia/` | `41-*`, `42-*` |
| `src/ui/` | `60-*`, `61-*`, `62-*` |
| `src/suite/*/profile.ts` | `52-*` (estereotipos), `53-*` |

## Mapa por capítulos de la SSOT

| Capítulo visual | Artefacto |
|---|---|
| §1 Primitivas gráficas | `10-*`, `12-*`, `14-*` |
| §2 Estados de objeto | `11-*` |
| §3 Taxonomía de enlaces | `13-*`, `15-*` |
| §4 Modificadores de control | `16-*` |
| §5 Operadores lógicos | `16-*` |
| §6 Trayectorias y etiquetas de ruta | `16-*` |
| §7 Multiplicidad | `16-*` |
| §8 Enlaces estructurales | `14-*` |
| §9 Enlaces de invocación | `13-*` |
| §10 Gestión de contexto y refinamiento | `30-*`, `33-*`, `34-*`, `35-*` |
| §11 Distribución de enlaces | `31-*` |
| §12 Enlaces transformadores escindidos | `31-*` |
| §13 Precedencia de enlaces | `32-*` |
| §14 Propiedades de duración | `51-*` |
| §15 Etiquetas OPD y navegación | `40-*` |
| §16 Rotulado y buenas prácticas | `20-*`, `70-*` |
| §17 Ejecución y simulación | `50-*` |
| §18 Estructura del metamodelo | `41-*` |
| §19 Estereotipos | `52-*` |
| §20 Capa computacional | `53-*` |
| §21 Indicadores UI | `60-*` |
| §22 Estilado autoral | `61-*` |
| §23 Composición inter-modelo | `42-*` |
| §24 Marcas de validación | `62-*` |
| §25 Exportación canónica | `63-*` |
| §26 Operaciones auxiliares | `64-*` |

## Lectura recomendada

Para un colaborador nuevo:

1. `README.md` (este directorio)
2. `00-precedencia-autoridad.md`
3. `10-primitivas-cosas.md` — `16-modificadores-operadores.md` (bloque visual fundacional)
4. `30-refinamiento-entre-opds.md` — `35-invariantes-entre-niveles.md` (bloque de refinamiento)
5. `40-navegacion-arbol-identidad.md` — `42-sub-modelos-inter-modelo.md` (metamodelo)
6. `99-invariantes-verificaciones.md` (checklist operativo)
