---
titulo: "Provenance — linaje del inventario v2 respecto al v1"
fecha: 2026-05-03
estado: "activo"
v1_fuente: "docs/archive/historias-usuario-v1/"
v2_motivacion: "DIAGNOSTICO-PILOTO-EPICA-10 + agentes Explore + agente Plan"
---

## 1. Propósito

Documenta el linaje entre v1 (inventario original) y v2 (refactorización). Permite trazar cualquier HU absorbida/fusionada/renombrada al original. Resuelve la trazabilidad histórica sin atar a la deuda de v1.

## 2. Cambios estructurales mayores

### 2.1 Nueva estructura

```
v1: docs/historias-usuario/epica-NN-slug.md  (48 archivos planos)
v2: docs/historias-usuario-v2/
    ├── 00–06 (pilares + mapa + roadmap + provenance)
    ├── shared/HU-SHARED-NNN-*.md (9 patrones transversales)
    ├── epicas/epica-NN-slug.md (48 épicas con stubs)
    └── tools/validate-hu.ts (linter)
```

### 2.2 Reglas de refactorización aplicadas

1. IDs HU-NN.NNN inmutables.
2. Stubs cortos para HU absorbidas/fusionadas con redirección.
3. Modelo de datos alineado a `app/src/modelo/tipos.ts` (`entidad/apariencia/enlace/opd/modelo`); prohibido `cosa.*`/`thing.*`/`link.*`/`object.*`/`appearance.*` en cuerpo.
4. Terminología 100% ES SSOT en cuerpo; anglicismos solo en notas de evidencia entre comillas.
5. Citas SSOT obligatorias en HU `opm-semantica` y `mixto`.
6. Patrones transversales por referencia (HU-SHARED-NNN), no duplicación.
7. Criterios Gherkin testeables (`Dado/Cuando/Entonces` con valor verificable).
8. Preguntas abiertas consolidadas al final de cada épica.

## 3. Conteos comparativos

| Métrica | v1 | v2 |
|---|---:|---:|
| Épicas | 48 | 48 |
| HU canónicas (en épicas) | 1.164 | 1.117 |
| HU shared | 0 | 9 |
| Stubs (absorbidas/fusionadas) | 0 | 48 |
| Reducción neta | — | ~3% (canónicas) |
| Citas SSOT verificadas (linter) | parcial | 100% |
| Modelo de datos alineado a `tipos.ts` | no | 100% |
| Terminología prohibida en cuerpo | sí (mezclada) | 0 (linter rechaza) |
| Tipos válidos `{opm-semantica, opcloud-ui, mixto}` | mezcla con 19 valores | 100% |

> Cifras de v2 verificadas contra el corpus por `tools/audit-hu.mjs` (URN icas-lifecycle: control de naturalidad docs↔realidad).

## 4. Renombramientos de título (slug se conserva)

| Slug (filename) | Título v1 | Título v2 |
|---|---|---|
| canvas-inzooming | Canvas — descomposición (in-zooming) de procesos | Canvas — descomposición de procesos |
| canvas-semi-folding | Canvas — semi-plegado (vista compacta de refinadores intra-rectángulo) | Canvas — plegado parcial (vista compacta de refinadores intra-rectángulo) |
| canvas-operaciones-bring | Canvas — operaciones bring (hidratar OPD con cosas y enlaces existentes) | Canvas — operaciones de traer conectados (hidratar OPD con cosas y enlaces existentes) |
| canvas-atributos-instancias | Canvas — atributos, instancias y rasgos avanzados del objeto | Canvas — objetos avanzados (alias, unidad, descripción, URL, plegado parcial, designaciones de estado, duración) |
| estructura-system-map | Estructura — Mapa del sistema (meta-vista gráfica del árbol de OPDs) | Estructura — mapa del sistema (meta-vista gráfica del árbol de OPDs) |
| persistencia-folders | Persistencia — carpetas, jerarquía, permisos y navegación del espacio de trabajo | Persistencia — carpetas, jerarquía, permisos y navegación del workspace |
| persistencia-sub-models | Persistencia — sub-modelos (subsystem model views, archivos peer, composicion cross-modelo) | Persistencia — sub-modelos (vistas de subsistema, archivos peer, composición cross-modelo) |
| persistencia-templates | Persistencia — plantillas (plantillas reutilizables, ámbitos Private/Organizational/Global, insertar, guardar, editar) | Persistencia — plantillas (artefactos reutilizables, ámbitos Privado/Organizacional/Global) |
| persistencia-new-model | Persistencia — creacion de modelo nuevo (ruta simple + asistente de 12 etapas) | Persistencia — creación de modelo nuevo (ruta simple + asistente de 12 etapas) |
| persistencia-move-search | Persistencia — Mover Modelos y Buscar Cosas (Ctrl+F intra-modelo) | Persistencia — mover modelos y buscar cosas (Ctrl+F intra-modelo) |
| colaboracion-permisos | Colaboracion — permisos de modelo, token de edicion y auto-lectura desde carpeta | Colaboración — permisos de modelo, token de edición y auto-lectura desde carpeta |
| colaboracion-chat | Colaboracion — chat del modelo (panel, popup, busqueda, links, permisos, notificaciones) | Colaboración — chat del modelo |
| colaboracion-notes | Colaboracion — notas (sticky notes del OPD, anclaje, toggle, integracion) | Colaboración — notas adhesivas (anclaje, toggle, integración) |
| opl-pane | Panel OPL-ES — lente bimodal, edicion inversa y sincronizacion con el canvas | Panel OPL-ES — lente bimodal, edición inversa y sincronización con el canvas |
| export-pdf | Exportar a PDF — pipeline papel, opciones, seleccion de OPDs, integracion Share | Exportar a PDF — pipeline papel, opciones, selección de OPDs, integración Compartir |
| interop-opcat | Interop — importacion de modelos OPCAT 4.2 (.opx) al modelador OPM | Interoperabilidad — importación de modelos OPCAT 4.2 (.opx) |
| interop-csv | Interoperabilidad — importar CSV de atributos, instancias y valores sobre objeto-clase | Interoperabilidad — importar CSV de atributos, instancias y valores |
| config-user-org | Config — gestion de usuarios, grupos y organizacion (OPCloud Settings administrativo) | Configuración — gestión de usuarios, grupos y organización |
| config-style-defaults | Configuración — por defecto de estilo visual, esencia, OPL, grilla y herencia organizacion/usuario | Configuración — defaults de estilo visual, esencia, OPL, cuadrícula y herencia |
| config-organization-ontology | Config — ontologia organizacional (glosario canonico + sugerencia inline + reforzamiento) | Configuración — ontología organizacional (glosario canónico + sugerencia + reforzamiento) |
| interaccion-shortcuts | Interaccion — atajos de teclado (guardar, busqueda, copiar/pegar, eliminar, nudge, deshacer/rehacer, navegacion OPD, unfold, format painter) | Interacción — atajos de teclado |
| interaccion-tutorial | Interacción — Tutorial Mode, tooltips guiados, thumbnails animados y asistencia pedagógica | Interacción — modo tutorial, tooltips guiados y asistencia pedagógica |
| extension-stereotypes | Extension — estereotipos OPM (mecanismo generico de ampliacion del lenguaje) | Extensión — estereotipos OPM (mecanismo genérico de ampliación del lenguaje) |
| extension-requirements | Extension — OPM Requirements Modeling (requisitos como objetos OPM con trazabilidad, plantilla canonica y vistas proyectadas) | Extensión — modelado de requisitos OPM (trazabilidad, plantilla canónica, vistas proyectadas) |
| extension-generative-ai | Extensión GenerativeAI — AI Reqs Generation (generación asistida de requirements) | Extensión — IA generativa para requisitos (AI Reqs Generation) |
| simulation-conceptual | Simulación conceptual — conmutación de modo, barra secundaria, ejecución paso a paso y marcas sobre canvas | Simulación conceptual — modo, controles y marcas sobre canvas |
| simulation-computational | Simulacion computacional — valores escalares, firmas invocables y sorteo probabilistico | Simulación computacional — valores escalares, firmas invocables y sorteo probabilístico |
| simulation-user-functions | Simulacion — funciones definidas por usuario (codigo-como-computacion en procesos) | Simulación — funciones definidas por usuario (código en procesos) |
| simulation-range-validation | Simulacion — validacion de rango, tipo primitivo y aplicacion suave/dura | Simulación — validación de rango, tipo primitivo y aplicación suave/dura |
| simulation-conditions-loops | Simulacion — condiciones y bucles (control-flow sobre la ejecucion) | Simulación — condiciones y bucles (control-flow) |
| simulation-user-input | Simulacion — entrada de usuario en tiempo de ejecucion | Simulación — entrada de usuario en tiempo de ejecución |
| runtime-mqtt | Runtime — integracion MQTT (intermediario, topicos, Publish/Subscribe, gemelo digital, live data en simulacion) | Runtime — integración MQTT (broker, tópicos, Publish/Subscribe, gemelo digital) |
| runtime-urls | Runtime — External URL (HTTP/REST) como categoria ejecutable de procesos computacionales | Runtime — URL externas (HTTP/REST) como categoría ejecutable |
| runtime-ros | Runtime ROS — integracion con Robot Operating System (publish/subscribe/servicio, topicos, overlays de simulacion, Turtlesim) | Runtime ROS — integración con Robot Operating System |
| analysis-missing-knowledge | Analisis — deteccion de conocimiento faltante (AA prediccion de enlaces sobre el KG del modelo) | Análisis — detección de conocimiento faltante (predicción de enlaces sobre el grafo del modelo) |
| analysis-informativity | Análisis — Calificación de Informatividad del Modelo (MFSP, INF, WINF, TWINF) | Análisis — calificación de informatividad del modelo (MFSP, INF, WINF, TWINF) |

(Slugs en filename del v2 conservan la forma del v1 para no romper enlaces externos. Solo cambia el `titulo:` en frontmatter.)

## 5. HU absorbidas/fusionadas (selección representativa)

### 5.1 Fusiones intra-épica

| HU absorbida | Canónica | Razón |
|---|---|---|
| HU-10.005 (confirmar Enter o botón) | HU-10.003 (diálogo de nombre) | Subset trivial; variantes de gesto |
| HU-50.007–015 (verbalizaciones) | HU-SHARED-007 + plantillas OPL-ES | Patrón transversal |
| HU-30.030 (crear carpeta) | HU-31.007 | Misma mecánica, mejor en EPICA-31 |
| HU-30.031 (renombrar carpeta) | HU-31.009 | Misma mecánica |
| HU-12.028 (descomposición in-diagram) | HU-10.021 | Misma mecánica, scope unificado |
| HU-12.033 (mostrar árbol al descomponer) | HU-12.025 | Subset de navegación |
| HU-13.016 (selector de modificadores) | HU-11.027 + HU-13.014 | Cubierto por padres |
| HU-13.020 (duración temporal) | HU-17.034 | Mejor consolidado en EPICA-17 |
| HU-17.001 (popup edición doble clic) | HU-10.003 | Misma mecánica de diálogo de nombre |
| HU-17.024–026 (plegado parcial en cosa) | HU-18.001/002/004 | Mejor en EPICA-18 |
| HU-17.031 (designar inicial/final) | HU-13.010 + HU-13.011 | Cubierto en EPICA-13 |
| HU-17.032 (designar Current/Default) | HU-13.012 + HU-13.013 | Cubierto en EPICA-13 |
| HU-14.010/011 (color/grosor enlace) | HU-11.016 | Cubierto en EPICA-11 |
| HU-15.001 (abrir propiedades enlace) | HU-11.013 | Cubierto en EPICA-11 |
| HU-15.014 (subtipo Condición) | HU-11.027 | Cubierto en EPICA-11 |
| HU-16.008 (panel propiedades) | HU-11.013 | Cubierto en EPICA-11 |
| HU-16.009 (editar etiqueta) | HU-11.014 | Cubierto en EPICA-11 |
| HU-16.011 (multiplicidad origen) | HU-15.002 | Cubierto en EPICA-15 |
| HU-16.019/020 (copiar/pegar estilo enlace) | HU-14.013/014 | Cubierto en EPICA-14 |
| HU-20.003 (generar nodo hijo descomposición) | HU-12.004 | Cubierto en EPICA-12 |
| HU-30.004 (pestaña No guardado) | HU-SHARED-006 | Patrón transversal |

### 5.2 Absorciones en patrones shared

| Shared | Absorbidas (extracto) |
|---|---|
| HU-SHARED-001 | HU-10.019, HU-10.020, HU-12.001, HU-32.007 |
| HU-SHARED-002 | HU-90.008, HU-90.009 |
| HU-SHARED-003 | HU-30.036 (especialización) |
| HU-SHARED-004 | HU-1C.010, HU-13.004, HU-20.014, HU-31.009 (especializaciones) |
| HU-SHARED-005 | HU-11.021, HU-11.022, HU-1C.020, HU-1C.022, HU-13.006 |
| HU-SHARED-006 | HU-10.022, HU-30.004 |
| HU-SHARED-007 | HU-10.016, HU-50.007, HU-50.008, HU-50.009, HU-50.010, HU-50.011, HU-50.012, HU-50.014 |
| HU-SHARED-008 | HU-11.005, HU-11.006 |
| HU-SHARED-009 | HU-1C.007, HU-1C.012 |

## 6. Cómo consultar el v1

```bash
ls /home/felix/projects/deep-opm-pro/docs/archive/historias-usuario-v1/
```

El v1 queda como artefacto histórico, sin garantía de mantenimiento. Cualquier HU consultada en v1 que esté absorbida/fusionada se redirige a su canónica v2 (mediante el stub).

## 7. Linaje cronológico

- 2026-04-23: cierre del v1 con 1.164 HU.
- 2026-04-28: diagnóstico piloto EPICA-10 identifica 5 patrones de gap.
- 2026-05-03: refactorización v2 ejecutada (este inventario).
- (futuro): cuando v2 sea estable y validado por linter, mover v1 a `docs/archive/historias-usuario-v1/`.
