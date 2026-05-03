---
epica: "EPICA-B3"
titulo: "Simulación — validación de rango, tipo primitivo y aplicación suave/dura"
slug: "simulation-range-validation"
doc_fuente: "opcloud-reverse/b3-simulation-range-validation.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "S"
hu_emitidas: 18
hu_canonicas: 18
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Definición de rangos sobre slot de valor de objetos computacionales: `[min, max]`, listas de intervalos, tipos primitivos (number/integer/string/boolean/datetime). Validación blanda (cromática) o dura (bloquea inserción). Heredable desde estereotipos. SSOT [V-163, V-164, V-218, V-219].

## 2. HU canónicas

### HU-B3.001 — Abrir popover "Set Range" desde Entities Extensions
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Evidencia:** [V-163], [V-218]. **Deps:** HU-B1.001. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [popover].

### HU-B3.002 — Declarar rango literal en textbox
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** sintaxis `[0, 100]` o `(0, 1]` o `{1, 5, 10}`. **Modelo:** `valueSlot.rangoSpec` `[propuesta]`. **Evidencia:** [Met §2.3], [OPL-ES §12]. **Deps:** HU-B3.001. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [rango, sintaxis].

### HU-B3.003 — Seleccionar tipo primitivo
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** dropdown number/integer/string/boolean/datetime. **Modelo:** `valueSlot.tipoPrimitivo`. **Evidencia:** [Met §2.3]. **Deps:** HU-B3.001. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [tipo].

### HU-B3.004 — Aplicar "Set Range" y reemplazar `value` por estado-rango azul
**Actor:** IS. **Tipo:** mixto. **Nivel:** V. **Criterios:** caja se renderiza con rango. **Evidencia:** [V-164], [V-166]. **Deps:** HU-B3.002. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [render].

### HU-B3.005 — Autogenerar atributo derivado "Type" con sub-estados
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** K. **Criterios:** atributo Type aparece con cinco sub-estados (rangos posibles). **Evidencia:** [OPL-ES §12]. **Deps:** HU-B3.004. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [type, derivado].

### HU-B3.006 — Marcar tipo activo con pin azul
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** V. **Deps:** HU-B3.005. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [render].

### HU-B3.007 — Ver proyección OPL de rango, tipos y current state
**Actor:** IS. **Tipo:** mixto. **Nivel:** L. **Criterios:** OPL: `Atributo es valor [unidad] entre 0 y 100.`. **Patrones:** HU-SHARED-007. **Evidencia:** [OPL-ES §12, §14]. **Deps:** HU-B3.004. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [opl].

### HU-B3.008 — Reabrir "Set Range" con valores precargados
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-B3.002. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [reabrir].

### HU-B3.009 — Mostrar valor en verde lima cuando cumple bajo Soft
**Actor:** IS. **Tipo:** mixto. **Nivel:** V. **Criterios:** color `#70E483` cuando válido. **Evidencia:** [V-219]. **Deps:** HU-B3.012. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render, validacion].

### HU-B3.010 — Mostrar valor en rojo coral cuando viola bajo Soft
**Actor:** IS. **Tipo:** mixto. **Nivel:** V. **Criterios:** color rojo cuando inválido. **Evidencia:** [V-219], [V-220]. **Deps:** HU-B3.012. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render, validacion].

### HU-B3.011 — Revelar rango original con tooltip al apuntar
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-B3.004. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [tooltip].

### HU-B3.012 — Configurar "Enforcement level" (Soft/Hard)
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** C. **Criterios:** dropdown global. **Modelo:** `modelo.validacionEnforcement`. **Evidencia:** [V-218]. **Deps:** HU-B3.004. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [enforcement].

### HU-B3.013 — Impedir insertar valores inválidos bajo Hard
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** input bloquea fuera de rango. **Evidencia:** [V-219], [V-226]. **Deps:** HU-B3.012. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [validacion-dura].

### HU-B3.014 — Configurar "Validation Time" a nivel de modelo
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** C. **Criterios:** valida al digitar / al confirmar / nunca. **Deps:** HU-B3.012. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [config].

### HU-B3.015 — Declarar valor por defecto embebido dentro del rango
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** K. **Criterios:** input default. **Evidencia:** [OPL-ES §14]. **Deps:** HU-B3.002. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [default].

### HU-B3.016 — Heredar rangos preempacados desde estereotipo
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** estereotipo define rango → instancia hereda. **Evidencia:** [V-163]. **Deps:** EPICA-A0. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [herencia].

### HU-B3.017 — Restringir re-definición de rango heredado a sub-rangos válidos
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** validar que nuevo ⊆ heredado. **Evidencia:** [Met §2.3], [V-29]. **Deps:** HU-B3.016. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [restriccion].

### HU-B3.018 — Validar contra sub-rango efectivo heredado/refinado
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** validación usa el rango más restrictivo. **Evidencia:** [V-58], [OPL-ES §14]. **Deps:** HU-B3.017. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [validacion, efectivo].

## 3. Referencias

- Patrones: HU-SHARED-007.
- Bloqueada por: EPICA-B1, EPICA-A0.
