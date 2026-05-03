---
epica: "EPICA-A0"
titulo: "Extensión — estereotipos OPM (mecanismo genérico de ampliación del lenguaje)"
slug: "extension-stereotypes"
doc_fuente: "opcloud-reverse/a0-extension-stereotypes.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "M0"
hu_emitidas: 40
hu_canonicas: 40
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Mecanismo genérico de extensión: aplicar estereotipos a entidades para que hereden estructura predefinida (atributos con unidad, sub-objetos, esencia forzada). Los estereotipos viven en biblioteca organizacional con ámbito Privado/Org/Global. Aplicación cross-cutting (Object o Process). Render con prefijo `<<Nombre>>` en canvas y `«Nombre»` unicode en OPL. OPDs derivados read-only navegables desde árbol.

## 2. HU canónicas

### HU-A0.001 — Ver estereotipo como mecanismo de extensión genérico
**Actor:** MN. **Tipo:** opm-semantica. **Nivel:** K. **Historia:** El estereotipo es primitiva del lenguaje. **Criterios:** documentación canónica + entrada en glosario (`Glos 3.7x` `[propuesta]`). **Modelo:** `[propuesta]` `estereotipo.*`, `aplicacionEstereotipo.*`. **Evidencia:** [V-1]. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [extension, kernel].

### HU-A0.002 — Abrir diálogo "Set Stereotype" desde grupo Entities Extensions
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** botón en barra. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [ui, dialogo].

### HU-A0.003 — Ver galería de estereotipos disponibles con tarjetas
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** grid de tarjetas con nombre, descripción, ámbito. **Deps:** HU-A0.002. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [galeria].

### HU-A0.004 — Buscar estereotipo por nombre
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** caja de búsqueda. **Deps:** HU-A0.003. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [busqueda].

### HU-A0.005 — Marcar estereotipo como favorito
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** estrella toggle. **Deps:** HU-A0.003. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [favoritos].

### HU-A0.006 — Aplicar estereotipo con doble clic en tarjeta
**Actor:** AD. **Tipo:** mixto. **Nivel:** K. **Criterios:** doble clic aplica al elemento seleccionado. **Modelo:** `aplicacionEstereotipo.*`. **Patrones:** HU-SHARED-002. **Deps:** HU-A0.003. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [aplicacion].

### HU-A0.007 — Aplicar estereotipo con selección + botón "Set Stereotype"
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** alternativa al doble clic. **Deps:** HU-A0.003. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [aplicacion].

### HU-A0.008 — Cancelar aplicación con "Cancelar"
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-A0.002. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [cancelar].

### HU-A0.009 — Aplicar estereotipo indistinto a Objeto o Proceso
**Actor:** AD. **Tipo:** opm-semantica. **Nivel:** K. **Historia:** Cross-cutting. **Criterios:** **Dado** estereotipo definido para "Objeto" o "Proceso" o "Ambos", **cuando** aplico, **entonces** se valida el `entidad.tipo`. **Modelo:** `estereotipo.destino`. **Evidencia:** [V-1]. **Deps:** HU-A0.006. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [cross-cutting].

### HU-A0.010 — Ver prefijo `<<Nombre>>` en label del canvas
**Actor:** AD. **Tipo:** mixto. **Nivel:** V. **Criterios:** **Dado** entidad con estereotipo aplicado, **cuando** se renderiza, **entonces** label muestra `<<EstereotipoNombre>> EntidadNombre`. **Deps:** HU-A0.006. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render, prefijo].

### HU-A0.011 — Ver prefijo `«Nombre»` unicode en OPL
**Actor:** AD. **Tipo:** mixto. **Nivel:** L. **Criterios:** OPL usa comillas angulares unicode `«»`. **Patrones:** HU-SHARED-007. **Evidencia:** [OPL-ES]. **Deps:** HU-A0.010. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [opl, unicode].

### HU-A0.012 — Ver rama "Stereotypes" autogenerada en árbol OPD
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Estereotipos aplicados aparecen como rama del árbol. **Criterios:** rama "Estereotipos" con sub-nodos por aplicación. **Deps:** HU-A0.006. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [arbol].

### HU-A0.013 — Ver entidades derivadas en biblioteca lateral
**Actor:** AD. **Tipo:** mixto. **Nivel:** L. **Criterios:** instancias del estereotipo aparecen en biblioteca. **Deps:** HU-A0.006. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [biblioteca].

### HU-A0.014 — Ver esencia física forzada por estereotipo "Sensor"
**Actor:** AD. **Tipo:** opm-semantica. **Nivel:** K. **Historia:** Algunos estereotipos forzan `esencia = "fisica"`. **Criterios:** al aplicar, `entidad.esencia = "fisica"` se persiste. **Modelo:** `entidad.esencia`. **Evidencia:** [V-1], [V-124]. **Deps:** HU-A0.006. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [esencia, forzada].

### HU-A0.015 — Ver oración OPL de aplicación del estereotipo
**Actor:** AD. **Tipo:** opm-semantica. **Nivel:** L. **Criterios:** OPL emite `<<Estereotipo>> es ...`. **Patrones:** HU-SHARED-007. **Evidencia:** [OPL-ES]. **Deps:** HU-A0.011. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [opl].

### HU-A0.016 — Ver oración OPL de descomposición del estereotipo
**Actor:** AD. **Tipo:** opm-semantica. **Nivel:** L. **Criterios:** descomposición canónica del estereotipo se verbaliza. **Patrones:** HU-SHARED-007. **Evidencia:** [OPL-ES]. **Deps:** HU-A0.018. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [opl, descomposicion].

### HU-A0.017 — Navegar al OPD read-only del estereotipo
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** clic en rama abre OPD read-only. **Patrones:** HU-SHARED-003. **Deps:** HU-A0.012. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [navegacion, read-only].

### HU-A0.018 — Ver descomposición canónica con triángulo de agregación
**Actor:** AD. **Tipo:** opm-semantica. **Nivel:** V. **Criterios:** OPD del estereotipo muestra cosas internas con agregación. **Evidencia:** [V-61], [V-239]. **Deps:** HU-A0.017. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render].

### HU-A0.019 — Ver atributos con notación `[unidad] {alias}`
**Actor:** AD. **Tipo:** mixto. **Nivel:** V. **Criterios:** sintaxis compuesta de HU-17.012. **Deps:** HU-17.012, HU-A0.017. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render, atributo].

### HU-A0.020 — Ver caja-estado con rango, multiplicidad o valor
**Actor:** AD. **Tipo:** mixto. **Nivel:** V. **Criterios:** caja muestra `rango` o `multiplicidad`. **Deps:** HU-A0.017, EPICA-B3. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render, valor].

### HU-A0.021 — Bloquear edición en OPD derivado
**Actor:** AD. **Tipo:** mixto. **Nivel:** K. **Criterios:** OPD del estereotipo es read-only para no romper definición. **Patrones:** HU-SHARED-003. **Evidencia:** [V-127]. **Deps:** HU-A0.017. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [read-only].

### HU-A0.022 — Identificar origen organizacional vs global con badge "G"
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** V. **Criterios:** badge en tarjeta. **Deps:** HU-A0.003. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [badge, ambito].

### HU-A0.023 — Aplicar segundo estereotipo a la misma cosa con "«s»+"
**Actor:** AD. **Tipo:** mixto. **Nivel:** K. **Historia:** Múltiples estereotipos. **Criterios:** una entidad puede tener múltiples `aplicacionEstereotipo`. **Patrones:** HU-SHARED-002. **Deps:** HU-A0.006. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [multi-aplicacion].

### HU-A0.024 — Soportar estereotipos anidados (Sensor contiene Property Set)
**Actor:** AD. **Tipo:** mixto. **Nivel:** K. **Historia:** Componente de un estereotipo puede ser otro. **Criterios:** definición referencia otro estereotipo. **Deps:** HU-A0.001. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [anidamiento].

### HU-A0.025 — Remover estereotipo con "Unlink" (preserva componentes)
**Actor:** AD. **Tipo:** mixto. **Nivel:** K. **Criterios:** elimina aplicación, preserva entidad y sus partes. **Patrones:** HU-SHARED-002. **Deps:** HU-A0.006. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [unlink].

### HU-A0.026 — Remover con "Unlink and Remove All Components"
**Actor:** AD. **Tipo:** mixto. **Nivel:** K. **Criterios:** elimina aplicación + componentes derivados. **Patrones:** HU-SHARED-005. **Deps:** HU-A0.025. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [unlink, cascada].

### HU-A0.027 — Revertir esencia forzada al remover estereotipo
**Actor:** AD. **Tipo:** mixto. **Nivel:** K. **Criterios:** **Dado** estereotipo forzaba `fisica`, **cuando** lo remuevo, **entonces** `esencia` vuelve al default. **Evidencia:** [V-124]. **Deps:** HU-A0.014, HU-A0.025. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [reversion].

### HU-A0.028 — Ver toolbar contextual ampliada cuando hay estereotipo
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** toolbar incluye acciones específicas del estereotipo. **Deps:** HU-A0.006. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [toolbar].

### HU-A0.029 — Traer componentes internos al SD con Bring Connected
**Actor:** AD. **Tipo:** mixto. **Nivel:** K. **Criterios:** ver HU-1B.003 con scope = componentes del estereotipo. **Deps:** HU-1B.003. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [bring].

### HU-A0.030 — Instanciar entidad derivada por drag desde biblioteca
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** K. **Criterios:** drag de tarjeta crea instancia con estereotipo aplicado. **Deps:** HU-A0.013. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [drag].

### HU-A0.031 — Validar compatibilidad estereotipo vs tipo de cosa
**Actor:** AD. **Tipo:** mixto. **Nivel:** K. **Criterios:** validación bloquea aplicar estereotipo "Sensor" (objeto-físico) a un proceso. **Deps:** HU-A0.009. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [validacion].

### HU-A0.032 — Serializar aplicación de estereotipo en persistencia
**Actor:** AD. **Tipo:** mixto. **Nivel:** P. **Criterios:** `aplicacionEstereotipo.*` parte del JSON del modelo. **Deps:** HU-30.008. **Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [persistencia].

### HU-A0.033 — Serializar definición de estereotipo en biblioteca organizacional
**Actor:** AO. **Tipo:** mixto. **Nivel:** P. **Criterios:** estereotipos viven en backend de organización. **Deps:** EPICA-80. **Prioridad:** S. **Tamaño:** L. **Etiquetas:** [persistencia, org].

### HU-A0.034 — Crear nuevo estereotipo en biblioteca organizacional
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** D. **Historia:** Admin-only. **Criterios:** modal create-stereotype. **Patrones:** HU-SHARED-003. **Deps:** HU-A0.033. **Prioridad:** C. **Tamaño:** L. **Etiquetas:** [crear-estereotipo].

### HU-A0.035 — Editar definición y propagar a apariciones
**Actor:** AO. **Tipo:** mixto. **Nivel:** K. **Historia:** Cambio en definición se propaga. **Criterios:** propagación opcional con confirmación por modelo. **Deps:** HU-A0.034. **Prioridad:** C. **Tamaño:** L. **Etiquetas:** [edicion, propagacion].

### HU-A0.036 — Versionar estereotipo y detectar incompatibilidad
**Actor:** AO. **Tipo:** mixto. **Nivel:** P. **Historia:** Estereotipo evoluciona. **Criterios:** versión semantica + detección de breaking changes. **Deps:** HU-A0.034. **Prioridad:** W. **Tamaño:** XL. **Etiquetas:** [versionado].

### HU-A0.037 — Export/Import de estereotipos entre organizaciones
**Actor:** AO. **Tipo:** mixto. **Nivel:** X. **Criterios:** archivo `.estereotipos.json`. **Deps:** HU-A0.034. **Prioridad:** W. **Tamaño:** L. **Etiquetas:** [export, import].

### HU-A0.038 — Preservar estereotipo en export PDF/SVG
**Actor:** RV. **Tipo:** mixto. **Nivel:** X. **Criterios:** prefijo `<<>>` aparece en exporte. **Deps:** EPICA-60, EPICA-61, HU-A0.010. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [export].

### HU-A0.039 — Resolver conflicto de esencias forzadas en estereotipos múltiples
**Actor:** AD. **Tipo:** mixto. **Nivel:** K. **Historia:** Si dos estereotipos fuerzan distinta esencia. **Criterios:** validación bloquea o pide elección. **Deps:** HU-A0.023, HU-A0.014. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [conflicto].

### HU-A0.040 — Identificar entidad derivada vs creada manualmente
**Actor:** AD. **Tipo:** mixto. **Nivel:** L. **Criterios:** badge o icono distintivo en biblioteca. **Deps:** HU-A0.013. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render, distincion].

## 3. Preguntas abiertas

| Q | Pregunta |
|---|---|
| QA0.1 | ¿Modelo de estereotipo se acerca más a UML stereotype o a SysML profile? |
| QA0.2 | ¿Qué pasa con instancias cuando se elimina el estereotipo en biblioteca? |

## 4. Referencias

- Patrones: HU-SHARED-001, HU-SHARED-002, HU-SHARED-003, HU-SHARED-005, HU-SHARED-007.
- Bloqueada por: EPICA-10, EPICA-17, EPICA-30, EPICA-80.
- Bloquea a: EPICA-A1 (`<<Requirement>>`), EPICA-B3 (`<<EmbeddedDevice>>`), EPICA-C0/C1/C2 (estereotipos runtime).
