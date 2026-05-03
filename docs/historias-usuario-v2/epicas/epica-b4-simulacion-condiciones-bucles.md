---
epica: "EPICA-B4"
titulo: "Simulación — condiciones y bucles (control-flow)"
slug: "simulation-conditions-loops"
doc_fuente: "opcloud-reverse/b4-simulation-conditions-loops.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "S"
hu_emitidas: 26
hu_canonicas: 26
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Control-flow sobre la ejecución: enlaces condicionales con modificador `c`, distinción condición/evento, invocación a ancestro in-zoomed para bucles, OPL específico de condiciones [OPL-ES §7], pesos probabilísticos en valores textuales, randomize, detección de bucle infinito.

## 2. HU canónicas

### HU-B4.001 — Marcar enlace instrumento como condicional con `c`
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** modificador `c` agrega comportamiento condicional. **Modelo:** `enlace.condicional`. **Evidencia:** [OPL-ES §7 CS1], [V-61]. **Deps:** HU-11.009. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [condicion].

### HU-B4.002 — Marcar enlace consumo como condicional
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** análogo a HU-B4.001 para consumo. **Evidencia:** [OPL-ES §7 CS1]. **Deps:** HU-11.003. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [condicion].

### HU-B4.003 — Ver lollipop blanca en extremo-proceso de enlace condicional
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** V. **Criterios:** marker visual. **Evidencia:** [V-1], [JOYAS §1]. **Deps:** HU-B4.001. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [render].

### HU-B4.004 — Ver letra `c` adyacente al lollipop
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** V. **Deps:** HU-B4.003. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [render].

### HU-B4.005 — Anclar enlace condicional a estado específico del origen
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** condición evalúa estado actual. **Evidencia:** [OPL-ES §7.3 CS1..CS6]. **Deps:** HU-13.014, HU-B4.001. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [estado, condicion].

### HU-B4.006 — Ver OPL `<Proceso> ocurre si <Objeto> está en estado <X>, de lo contrario <Proceso> se omite.`
**Actor:** IS. **Tipo:** opm-semantica. **Nivel:** L. **Patrones:** HU-SHARED-007. **Evidencia:** [OPL-ES §7 CS1]. **Deps:** HU-B4.005. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [opl].

### HU-B4.007 — Distinguir condición de evento en enlaces entrantes
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** ver HU-11.027, HU-15.015. **Evidencia:** [OPL-ES §6, §7]. **Deps:** HU-11.027. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [distincion].

### HU-B4.008 — Crear enlace de invocación hacia ancestro in-zoomed para bucle
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Historia:** Bucle implícito por invocación hacia padre. **Criterios:** ver HU-15.019. **Evidencia:** [OPL-ES §8.2 IV1]. **Deps:** HU-15.019. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [bucle, invocacion].

### HU-B4.009 — Anclar invocación a puerto de estado específico
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** V. **Deps:** HU-B4.008. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [puerto].

### HU-B4.010 — Ver OPL `<Subproceso> invoca <Ancestro>.`
**Actor:** IS. **Tipo:** opm-semantica. **Nivel:** L. **Evidencia:** [OPL-ES §8.2 IV1]. **Patrones:** HU-SHARED-007. **Deps:** HU-B4.008. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [opl].

### HU-B4.011 — Abrir editor inline "Función:" desde proceso seleccionado
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** ver HU-B2.002. **Deps:** HU-B2.002. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [editor].

### HU-B4.012 — Guardar función con sufijo `<>` en el nombre
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** V. **Criterios:** ver HU-B2.006. **Deps:** HU-B2.006. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render].

### HU-B4.013 — Ver tooltip con cuerpo de función al apuntar
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-B4.012. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [tooltip].

### HU-B4.014 — Reposicionar diálogo Function con asa
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-B2.007. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [drag].

### HU-B4.015 — Asignar pesos probabilísticos por etiqueta en Textual Value
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** ver HU-B1.019. **Deps:** HU-B1.019. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [pesos].

### HU-B4.016 — Añadir filas con botón `+`
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** L. **Deps:** HU-B4.015. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [ui].

### HU-B4.017 — Ver token verde recorriendo enlace activo
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** V. **Criterios:** ver HU-B0.017. **Deps:** HU-B0.017. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [animacion].

### HU-B4.018 — Ejecutar paso a paso con toggle "ejecución sincrónica"
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** modo step-through. **Deps:** HU-B0.013. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [step].

### HU-B4.019 — Ajustar velocidad con slider
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-B0.011. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [velocidad].

### HU-B4.020 — Activar Headless Runner
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** P. **Deps:** HU-B0.015. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [headless].

### HU-B4.021 — Activar randomize con botón de dados
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** asignación aleatoria de valores en cada run. **Deps:** HU-B1.018. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [random].

### HU-B4.022 — Detectar bucle infinito y permitir freno con Stop
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** umbral N iteraciones → advertencia + Stop. **Deps:** HU-B4.008. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [seguridad, bucle].

### HU-B4.023 — Ver contador de iteraciones avanzando
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** L. **Deps:** HU-B4.022. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [contador].

### HU-B4.024 — Modelar bucles anidados mediante invocaciones cruzadas
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** múltiples invocaciones recursivas. **Evidencia:** [OPL-ES §8.2 IV1]. **Deps:** HU-B4.008. **Prioridad:** C. **Tamaño:** L. **Etiquetas:** [anidamiento].

### HU-B4.025 — Ejecutar varias simulaciones sobre mismo modelo con Stop/Play
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** ciclo iterativo. **Deps:** HU-B0.005. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [iteracion].

### HU-B4.026 — Exportar trazo de simulación condicional como XLSX
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** X. **Criterios:** historial de pasos. **Deps:** HU-B1.025. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [export].

## 3. Referencias

- Patrones: HU-SHARED-002, HU-SHARED-007.
- Bloqueada por: EPICA-B0, EPICA-B1, EPICA-13, EPICA-15.
