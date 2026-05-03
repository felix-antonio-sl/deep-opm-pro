---
epica: "EPICA-D0"
titulo: "Análisis — detección de conocimiento faltante (predicción de enlaces sobre el grafo del modelo)"
slug: "analysis-missing-knowledge"
doc_fuente: "opcloud-reverse/d0-analysis-missing-knowledge.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "S"
hu_emitidas: 22
hu_canonicas: 22
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Predicción de enlaces faltantes sobre el grafo del modelo OPM usando algoritmos de Knowledge Graph completion: DistMult (rápido, in-browser) y R-GCN (pesado, runtime Python remoto). Tabla de sugerencias con confianza, filtro por umbral, accept/reject inline.

## 2. HU canónicas

### HU-D0.001 — Navegar a "Configuración > Análisis > Conocimiento del Modelo"
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [analisis, ui].

### HU-D0.002 — Alternar entre pestañas "Conocimiento Faltante" e "Informatividad"
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-D0.001, EPICA-D1. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [tabs].

### HU-D0.003 — Ver panel inicial con placeholder pre-run
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-D0.001. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [empty].

### HU-D0.004 — Leer tooltips explicativos de DistMult y R-GCN
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-D0.001. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [tooltip].

### HU-D0.005 — Activar análisis DistMult (link prediction in-browser)
**Actor:** IS. **Tipo:** mixto. **Nivel:** L. **Criterios:** ejecuta algoritmo cliente y produce sugerencias. **Modelo:** `[propuesta]` `analisis.sugerencias`. **Deps:** HU-D0.001. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [distmult, ml].

### HU-D0.006 — Ver tabla con 4 columnas Source/Relation/Target/Confidence
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** L. **Deps:** HU-D0.005. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [tabla].

### HU-D0.007 — Ver contador "N sugerencias (score >= X)" reactivo
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** L. **Deps:** HU-D0.006. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [contador].

### HU-D0.008 — Filtrar sugerencias por umbral de confianza con slider
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** slider 0-1. **Deps:** HU-D0.006. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [filtro].

### HU-D0.009 — Editar umbral con input numérico sincronizado
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** input refleja slider. **Deps:** HU-D0.008. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [input].

### HU-D0.010 — Validar umbral en rango [0, 1]
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** K. **Patrones:** HU-SHARED-009. **Deps:** HU-D0.009. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [validacion].

### HU-D0.011 — Activar análisis R-GCN (Python remoto)
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** X. **Criterios:** llamada a runtime externo. **Deps:** HU-D0.005. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [rgcn].

### HU-D0.012 — Exportar sugerencias filtradas a Excel con metadata
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** X. **Deps:** HU-D0.006. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [export].

### HU-D0.013 — Copiar tabla al portapapeles
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** X. **Deps:** HU-D0.006. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [copiar].

### HU-D0.014 — Ver "0 sugerencias" con mensaje explícito
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-D0.006. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [empty].

### HU-D0.015 — Ejecutar análisis solo con credenciales premium
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** C. **Patrones:** HU-SHARED-003. **Deps:** HU-D0.005. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [gating].

### HU-D0.016 — Resaltar cosa del canvas al pasar el cursor sobre fila
**Actor:** IS. **Tipo:** mixto. **Nivel:** V. **Deps:** HU-D0.006. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [render].

### HU-D0.017 — Aceptar sugerencia inline creando enlace
**Actor:** ME. **Tipo:** mixto. **Nivel:** K. **Criterios:** botón Accept crea `enlace`. **Patrones:** HU-SHARED-002. **Evidencia:** [V-61]. **Deps:** HU-D0.006. **Prioridad:** C. **Tamaño:** L. **Etiquetas:** [accept].

### HU-D0.018 — Rechazar sugerencia inline
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** lista de rejected. **Deps:** HU-D0.006. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [reject].

### HU-D0.019 — Aplicar batch fix sobre múltiples sugerencias
**Actor:** ME. **Tipo:** mixto. **Nivel:** K. **Patrones:** HU-SHARED-002, HU-SHARED-008. **Evidencia:** [V-61]. **Deps:** HU-D0.017. **Prioridad:** C. **Tamaño:** L. **Etiquetas:** [batch].

### HU-D0.020 — Codificar severidad por color según confianza
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** V. **Deps:** HU-D0.006. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [render, severidad].

### HU-D0.021 — Ejecutar análisis en local sin enviar datos al exterior
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** C. **Criterios:** DistMult ejecuta cliente. **Patrones:** HU-SHARED-003. **Deps:** HU-D0.005. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [privacidad].

### HU-D0.022 — Ver reporting agregado de análisis ejecutados
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** L. **Deps:** HU-D0.005. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [historial].

## 3. Referencias

- Patrones: HU-SHARED-002, HU-SHARED-003, HU-SHARED-008, HU-SHARED-009.
- Bloqueada por: EPICA-30.
