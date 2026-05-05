---
epica: "EPICA-70"
titulo: "Interoperabilidad — importación de modelos OPCAT 4.2 (.opx)"
slug: "interop-opcat"
doc_fuente: "opcloud-reverse/70-interop-opcat.md"
estado: "descartada-del-proyecto"
fecha: 2026-05-03
fecha_descarte: 2026-05-05
descartada_del_proyecto: true
razon_descarte: "Fuera de alcance de deep-opm-pro. Decisión del operador."
prioridad_predominante: "S"
hu_emitidas: 25
hu_canonicas: 25
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

> **DESCARTADA DEL PROYECTO** (2026-05-05). EPICA-70 (Importación OPCAT 4.2) **NO será abordada en deep-opm-pro**. Las 25 HU se conservan abajo como referencia histórica y trazabilidad SSOT, pero quedan **fuera del alcance del proyecto**. No deben asignarse a ninguna ronda de desarrollo, no deben aparecer en briefs de líneas paralelas, ni deben contar como pendientes en el roadmap operativo. Decisión del operador, irreversible salvo nueva instrucción explícita.

## 1. Resumen

Importación desde OPCAT 4.2 (predecesor OPM): parsea .opx, mapea tipos OPCAT a primitivas SSOT, reconstruye árbol OPD con sufijos in-zoomed/unfolded, regenera OPL desde el kernel propio (no del OPCAT), carga como "Modelo (No guardado)". Manejo de errores con descarga de log.

## 2. HU canónicas

### HU-70.001 — Abrir diálogo "Importar OPCAT" desde menú principal
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [import, ui].

### HU-70.002 — Ver modal "Importar OPCAT" en fase vacía
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [modal].

### HU-70.003 — Leer restricción de versión OPCAT 4.2 en bloque "Atención"
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Solo soportamos 4.2. **Criterios:** texto explícito. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [aviso].

### HU-70.004 — Acceder a link externo "Instalar OPCAT"
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** X. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [link].

### HU-70.005 — Adjuntar archivo .opx
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** input file con filtro `.opx`. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [import].

### HU-70.006 — Ver metadatos del archivo (nombre/tamaño)
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [metadata].

### HU-70.007 — Habilitar botón IMPORT solo tras adjuntar archivo
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [validacion].

### HU-70.008 — Disparar importación con botón IMPORT
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** progress bar + cancelable. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [import].

### HU-70.009 — Parsear estructura OPM del .opx
**Actor:** MN. **Tipo:** mixto. **Nivel:** K primario. **Historia:** Convertir XML OPCAT a estructura interna. **Criterios:** **Dado** archivo .opx, **cuando** se parsea, **entonces** se obtienen cosas, enlaces y OPDs como estructura intermedia. **Modelo:** intermedio. **Prioridad:** S. **Tamaño:** XL. **Etiquetas:** [parser, kernel].

### HU-70.010 — Mapear tipos OPCAT a primitivas OPM canónicas
**Actor:** AD. **Tipo:** opm-semantica. **Nivel:** K. **Historia:** Tabla de equivalencia OPCAT → SSOT. **Criterios:** mapping completo y documentado. **Modelo:** `entidad.*`, `enlace.*`. **Evidencia:** [V-1], [V-61], [V-239]. **Deps:** HU-70.009. **Prioridad:** S. **Tamaño:** L. **Etiquetas:** [mapping, ssot].

### HU-70.011 — Reconstruir árbol OPD con sufijos
**Actor:** MN. **Tipo:** mixto. **Nivel:** L. **Historia:** Generar SDn con sufijos descompuesto/desplegado. **Criterios:** ver HU-12.005, HU-20.005. **Deps:** HU-70.010. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [arbol].

### HU-70.012 — Poblar inventario "Cosas arrastrables" post-importación
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** L. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [biblioteca].

### HU-70.013 — Regenerar OPL desde el kernel propio
**Actor:** MN. **Tipo:** opm-semantica. **Nivel:** L. **Historia:** No usar OPL importado; regenerar con plantillas SSOT-ES. **Criterios:** **Dado** modelo importado, **cuando** se renderiza OPL-ES, **entonces** las oraciones siguen [OPL-ES T*/D*/TS*] del SSOT. **Patrones:** HU-SHARED-007. **Deps:** HU-70.010. **Evidencia:** [OPL-ES]. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [opl, regenerar].

### HU-70.014 — Cargar modelo importado como "Modelo (No guardado)"
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** estado dirty (HU-SHARED-006). **Patrones:** HU-SHARED-006. **Deps:** HU-70.013. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [carga].

### HU-70.015 — Guardar modelo importado posteriormente
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** ver HU-30.005. **Deps:** HU-70.014. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [guardar].

### HU-70.016 — Cancelar Import desde fase vacía sin efectos
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [cancelar].

### HU-70.017 — Cancelar Import tras adjuntar archivo (descartar)
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [cancelar].

### HU-70.018 — Ver modal de error con DOWNLOAD LOG en rojo
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Manejo de errores. **Criterios:** error visible con CTA descargar log. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [error].

### HU-70.019 — Descargar log de error
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** X. **Criterios:** archivo .log con detalles. **Deps:** HU-70.018. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [log, debug].

### HU-70.020 — Cerrar modal de error con OK
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [error].

### HU-70.021 — Rechazar archivo de versión OPCAT incompatible
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** validación de versión. **Deps:** HU-70.005. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [validacion].

### HU-70.022 — Rechazar archivo no-.opx
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** filtro de extensión. **Deps:** HU-70.005. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [validacion].

### HU-70.023 — Re-abrir Import sobre modelo ya cargado
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** advertir que se descartará el actual. **Deps:** HU-70.014. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [warning].

### HU-70.024 — Advertir antes de descartar cambios no guardados al importar
**Actor:** MN. **Tipo:** mixto. **Nivel:** P. **Criterios:** confirmar si HU-SHARED-006 dirty. **Patrones:** HU-SHARED-006. **Deps:** HU-70.023. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [warning].

### HU-70.025 — Emitir advertencia de retipificación post-importación
**Actor:** AD. **Tipo:** mixto. **Nivel:** L. **Historia:** Mapping puede haber producido tipos que requieren validación humana. **Criterios:** lista de cosas con tipo dudoso. **Deps:** HU-70.010. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [warning, validacion].

## 3. Preguntas abiertas

| Q | Pregunta |
|---|---|
| Q70.1 | ¿Mapping OPCAT → SSOT se publica como tabla pública para users? |
| Q70.2 | ¿Round-trip OPCAT → deep-opm → OPCAT preserva semántica? |

## 4. Referencias

- Patrones: HU-SHARED-006, HU-SHARED-007.
- Bloqueada por: EPICA-30.
