---
epica: "EPICA-A2"
titulo: "Extensión — IA generativa para requisitos (AI Reqs Generation)"
slug: "extension-generative-ai"
doc_fuente: "opcloud-reverse/a2-extension-generative-ai.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "C"
hu_emitidas: 24
hu_canonicas: 24
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Generación asistida de requisitos vía LLM (provider configurable). Construye instrucción interna desde OPL del modelo, clasifica resultados (Structural/Interface/Functional/State), workflow accept/reject/edit, materialización como `<<Requirement>>` con auditoría de origen IA. Privacy: opt-in al envío del modelo a LLM externo.

## 2. HU canónicas

### HU-A2.001 — Acceder a "AI Reqs Generation" desde menú GenerativeAI
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** U. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [ui, ia].

### HU-A2.002 — Abrir modal con estado inicial y velo sobre canvas
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-A2.001. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [modal].

### HU-A2.003 — Disparar generación con botón "GO!" y spinner
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** spinner durante llamada LLM. **Deps:** HU-A2.002. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [trigger].

### HU-A2.004 — Construir instrucción interna desde OPL y triples
**Actor:** AD. **Tipo:** mixto. **Nivel:** L. **Historia:** Convertir modelo a prompt. **Criterios:** OPL del modelo + triples (sujeto-verbo-objeto) → prompt. **Patrones:** HU-SHARED-007. **Evidencia:** [OPL-ES]. **Deps:** HU-A2.003. **Prioridad:** C. **Tamaño:** L. **Etiquetas:** [prompt-engineering].

### HU-A2.005 — Configurar provider LLM y API key
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** C. **Criterios:** dropdown providers (OpenAI, Anthropic, etc.) + input API key. **Deps:** EPICA-80. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [config, ia].

### HU-A2.006 — Cancelar modal con "Cerrar"
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-A2.002. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [cancelar].

### HU-A2.007 — Renderizar listado enriquecido de "REQ-NNNN"
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** lista con id, descripción, categoría. **Deps:** HU-A2.003. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [listado].

### HU-A2.008 — Clasificar requisitos en Structural/Interface/Functional/State
**Actor:** AD. **Tipo:** mixto. **Nivel:** L. **Criterios:** clasificación por LLM con cita SSOT. **Evidencia:** [V-239]. **Deps:** HU-A2.007. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [clasificacion].

### HU-A2.009 — Completar atributos automáticos (rationale, AC, verification, status)
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** atributos canónicos auto-rellenos. **Deps:** HU-A2.007. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [atributos].

### HU-A2.010 — Generar jerarquía con ParentID y sufijos (REQ-0006a)
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** identificadores jerárquicos. **Deps:** HU-A2.007. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [jerarquia].

### HU-A2.011 — Copiar listado al portapapeles
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** X. **Deps:** HU-A2.007. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [copiar].

### HU-A2.012 — Descargar Excel multi-hoja con Requirements + Stats
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** X. **Deps:** HU-A2.007. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [export].

### HU-A2.013 — Re-disparar generación y decidir política
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** modos: reemplazar, diff, acumular. **Deps:** HU-A2.003. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [politica].

### HU-A2.014 — Sugerir requisitos faltantes contra modelo OPM actual
**Actor:** AD. **Tipo:** mixto. **Nivel:** L. **Historia:** Detectar gaps. **Criterios:** gap analysis. **Evidencia:** [V-1]. **Deps:** HU-A2.007. **Prioridad:** C. **Tamaño:** L. **Etiquetas:** [gap-analysis].

### HU-A2.015 — Revisar redacción (lint natural-language)
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** sugerencias de mejora textual. **Deps:** HU-A2.007. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [lint].

### HU-A2.016 — Configurar idioma de generación (es/en)
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** L. **Deps:** HU-A2.005. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [idioma].

### HU-A2.017 — Gestionar plantillas de instrucción nombradas y versionadas
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** D. **Criterios:** biblioteca de prompts. **Deps:** HU-A2.005. **Prioridad:** C. **Tamaño:** L. **Etiquetas:** [prompts].

### HU-A2.018 — Ver historial de generaciones por modelo
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** lista timestamps. **Deps:** HU-A2.003. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [historial].

### HU-A2.019 — Workflow accept/reject/edit por requisito
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** acciones por fila. **Deps:** HU-A2.007. **Prioridad:** C. **Tamaño:** L. **Etiquetas:** [workflow].

### HU-A2.020 — Materializar requisito aceptado como `<<Requirement>>` en canvas
**Actor:** AD. **Tipo:** mixto. **Nivel:** K. **Criterios:** crea entidad con estereotipo aplicado. **Patrones:** HU-SHARED-002. **Deps:** HU-A2.019, EPICA-A1. **Prioridad:** C. **Tamaño:** L. **Etiquetas:** [materializacion].

### HU-A2.021 — Marcar origen IA vs humano en auditoría
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** atributo `origen.ia = true`. **Deps:** HU-A2.020. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [auditoria].

### HU-A2.022 — Exponer conteo de tokens y costo estimado
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** muestra tokens + USD. **Deps:** HU-A2.005. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [tokens, costo].

### HU-A2.023 — Privacy: opt-in al envío del modelo a LLM externo
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** C. **Criterios:** consentimiento explícito antes de cada envío. **Patrones:** HU-SHARED-003. **Deps:** HU-A2.005. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [privacidad].

### HU-A2.024 — Reportar errores de la API IA (timeout, auth, cuota)
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** modal con detalles. **Deps:** HU-A2.003. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [error].

## 3. Referencias

- Patrones: HU-SHARED-002, HU-SHARED-003, HU-SHARED-007.
- Bloqueada por: EPICA-A1, EPICA-A0.
