---
epica: "EPICA-D1"
titulo: "Análisis — calificación de informatividad del modelo (MFSP, INF, WINF, TWINF)"
slug: "analysis-informativity"
doc_fuente: "opcloud-reverse/d1-analysis-informativity.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "S"
hu_emitidas: 16
hu_canonicas: 16
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Métrica de calidad del modelo: clasifica oraciones OPL en categorías MFSP, calcula INF por oración (Information Energy Functions), agrega WINF por categoría, y calcula TWINF global. Permite identificar áreas sub-especificadas y refinar iterativamente.

## 2. HU canónicas

### HU-D1.001 — Clasificar cada oración OPL en categoría MFSP fija
**Actor:** IS. **Tipo:** mixto. **Nivel:** L. **Criterios:** asignación según gramática. **Modelo:** `[propuesta]` `oracion.categoriaMFSP`. **Evidencia:** [Glos E1]. **Patrones:** HU-SHARED-007. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [mfsp].

### HU-D1.002 — Calcular puntuación INF por oración vía IEFs
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** fórmula Information Energy Function. **Modelo:** `oracion.inf`. **Evidencia:** [Glos E1]. **Deps:** HU-D1.001. **Prioridad:** S. **Tamaño:** L. **Etiquetas:** [inf, calculo].

### HU-D1.003 — Agregar WINF por categoría MFSP
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** suma ponderada. **Modelo:** `analisis.winf`. **Deps:** HU-D1.002. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [winf].

### HU-D1.004 — Calcular TWINF global del modelo
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** total weighted INF. **Modelo:** `analisis.twinf`. **Deps:** HU-D1.003. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [twinf].

### HU-D1.005 — Calcular INF Avg como promedio ponderado
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Deps:** HU-D1.002. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [avg].

### HU-D1.006 — Contar oraciones OPL totales como base
**Actor:** IS. **Tipo:** mixto. **Nivel:** L. **Evidencia:** [Glos E1]. **Patrones:** HU-SHARED-007. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [contador].

### HU-D1.007 — Ejecutar calificación bajo demanda con botón "Run"
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** P. **Deps:** HU-D1.001. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [trigger].

### HU-D1.008 — Ver placeholder antes de ejecutar
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-D1.007. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [empty].

### HU-D1.009 — Ver KPIs globales en tarjetas tras ejecución
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** TWINF, INF Avg, conteos. **Deps:** HU-D1.007. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [kpi].

### HU-D1.010 — Ver distribución MFSP como tabla
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** L. **Deps:** HU-D1.001. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [tabla].

### HU-D1.011 — Ver oraciones con INF individual en tabla detalle
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** L. **Deps:** HU-D1.002. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [detalle].

### HU-D1.012 — Filtrar tabla detalle por categoría MFSP
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** L. **Deps:** HU-D1.011. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [filtro].

### HU-D1.013 — Filtrar tabla por umbral Min INF
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** L. **Deps:** HU-D1.011. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [filtro].

### HU-D1.014 — Exportar calificación a Excel con tres hojas
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** X. **Deps:** HU-D1.007. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [export].

### HU-D1.015 — Ejecutar ciclo iterativo de refinamiento comparando runs
**Actor:** IS. **Tipo:** mixto. **Nivel:** L. **Criterios:** historial de runs + diff. **Deps:** HU-D1.007. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [iteracion].

### HU-D1.016 — Detectar áreas sub-especificadas
**Actor:** IS. **Tipo:** mixto. **Nivel:** L. **Criterios:** baja distribución MFSP en categorías esperadas → flag. **Deps:** HU-D1.010. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [diagnostico].

## 3. Referencias

- Patrones: HU-SHARED-007.
- Bloqueada por: EPICA-50.
