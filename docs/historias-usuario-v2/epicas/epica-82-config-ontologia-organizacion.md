---
epica: "EPICA-82"
titulo: "Configuración — ontología organizacional (glosario canónico + sugerencia + reforzamiento)"
slug: "config-organization-ontology"
doc_fuente: "opcloud-reverse/82-config-organization-ontology.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "S"
hu_emitidas: 20
hu_canonicas: 20
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Ontología organizacional: glosario canónico de términos del dominio con alias, niveles de reforzamiento (Ninguno / Sugerir / Reforzar), match al confirmar nombre, sustitución de rótulo, integración con CSV import, audit trail de sustituciones aceptadas.

## 2. HU canónicas

### HU-82.001 — Activar feature "Ontología de organización"
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** D. **Criterios:** toggle a nivel org. **Evidencia:** [Glos]. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [feature].

### HU-82.002 — Definir entrada canónica con alias en panel admin
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** D. **Criterios:** form: canónica, alias[]. **Modelo:** `[propuesta]` `ontologia.canonica`, `ontologia.alias`. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [admin, ontologia].

### HU-82.003 — Declarar múltiples formas canónicas con separador `;`
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** D. **Criterios:** input acepta `;` para multi-canónica. **Deps:** HU-82.002. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [sintaxis].

### HU-82.004 — Declarar alias múltiples con separador `;`
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** D. **Criterios:** input acepta `;` para multi-alias. **Deps:** HU-82.002. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [sintaxis].

### HU-82.005 — Editar entrada existente
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** D. **Patrones:** HU-SHARED-002. **Deps:** HU-82.002. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [editar].

### HU-82.006 — Eliminar entrada
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** D. **Patrones:** HU-SHARED-005. **Deps:** HU-82.002. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [eliminar].

### HU-82.007 — Filtrar tabla por texto
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** L. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [filtro].

### HU-82.008 — Guardar cambios con feedback
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** botón Guardar + toast. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [feedback].

### HU-82.009 — Configurar nivel de reforzamiento (Ninguno / Sugerir / Reforzar)
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** C. **Criterios:** dropdown a nivel org. **Modelo:** `org.ontologia.reforzamiento`. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [config, reforzamiento].

### HU-82.010 — Detectar match al confirmar nombre y abrir modal sugerencia
**Actor:** MN. **Tipo:** mixto. **Nivel:** K. **Historia:** Cuando creo cosa con nombre que coincide con alias, sugerir canónica. **Criterios:** **Dado** confirmo `coche`, alias de `Vehículo`, **cuando** el sistema detecta match, **entonces** se abre modal sugerencia. **Evidencia:** [Glos 3.4]. **Deps:** HU-10.003, HU-82.002. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [sugerencia].

### HU-82.011 — Listar formas canónicas como botones en el modal
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** botones por canónica. **Deps:** HU-82.010. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [ui].

### HU-82.012 — Aceptar sugerencia y sustituir rótulo
**Actor:** MN. **Tipo:** mixto. **Nivel:** K. **Historia:** **Dado** modal abierto, **cuando** clico canónica, **entonces** `entidad.nombre = canonica`. **Patrones:** HU-SHARED-002, HU-SHARED-007. **Deps:** HU-82.010. **Evidencia:** [Glos 3.4]. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [sustitucion].

### HU-82.013 — Cerrar sin cambiar bajo modo "Sugerir"
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** modo Sugerir permite Skip. **Deps:** HU-82.010. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [modo].

### HU-82.014 — Bloquear cierre sin elección bajo modo "Reforzar"
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** modo Reforzar exige elección. **Deps:** HU-82.010. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [modo].

### HU-82.015 — Desactivar Auto Format cuando canónica tiene casing no estándar
**Actor:** MN. **Tipo:** mixto. **Nivel:** K. **Historia:** Si canónica es `iPhone`, no aplicar title-case. **Criterios:** sustitución preserva casing canónico. **Patrones:** HU-SHARED-009. **Deps:** HU-82.012. **Evidencia:** [Glos 3.4]. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [auto-format].

### HU-82.016 — Reflejar rótulo canónico en canvas, biblioteca, OPL y navegador
**Actor:** MN. **Tipo:** mixto. **Nivel:** L. **Historia:** Sustitución se propaga a todas las superficies. **Criterios:** consistencia. **Patrones:** HU-SHARED-007. **Deps:** HU-82.012. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [propagacion].

### HU-82.017 — Aplicar sugerencia también al renombrar cosa existente
**Actor:** ME. **Tipo:** mixto. **Nivel:** K. **Criterios:** ver HU-82.010 disparado desde HU-SHARED-004. **Patrones:** HU-SHARED-004. **Deps:** HU-SHARED-004. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [renombrar, sugerencia].

### HU-82.018 — Importar ontología desde CSV
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** X. **Criterios:** CSV con columnas canónica, alias. **Patrones:** EPICA-71. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [import].

### HU-82.019 — Exportar ontología a CSV
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** X. **Criterios:** descarga CSV. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [export].

### HU-82.020 — Auditar historial de sustituciones aceptadas por modelador
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Trazabilidad. **Criterios:** tabla con columna usuario, original, canónica, fecha. **Modelo:** `[propuesta]` `auditOntologia.*`. **Prioridad:** W. **Tamaño:** L. **Etiquetas:** [audit].

## 3. Referencias

- Patrones: HU-SHARED-002, HU-SHARED-004, HU-SHARED-005, HU-SHARED-007, HU-SHARED-009.
- Bloqueada por: EPICA-80, EPICA-71.
