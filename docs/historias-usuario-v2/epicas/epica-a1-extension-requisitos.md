---
epica: "EPICA-A1"
titulo: "Extensión — modelado de requisitos OPM (trazabilidad, plantilla canónica, vistas proyectadas)"
slug: "extension-requirements"
doc_fuente: "opcloud-reverse/a1-extension-requirements.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "S"
hu_emitidas: 34
hu_canonicas: 34
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Requisitos como objetos OPM con trazabilidad: cada requisito se modela como instancia de `<<Requirement>>` (estereotipo de A0), agregado en `Satisfied Requirement Set`, con identificador lógico `Req#N`, atributos canónicos (Essence, Satisfaction, etc.) y enlaces de trazabilidad. Vistas proyectadas (Requirement Views) generan OPDs read-only con cierre transitivo del requisito.

## 2. HU canónicas

### HU-A1.001 — Ver grupo "OPM Requirements" en menú contextual
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** U. **Patrones:** HU-SHARED-001. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [ui].

### HU-A1.002 — Agregar primer requisito (crea Set + instancia)
**Actor:** AD. **Tipo:** mixto. **Nivel:** K. **Historia:** Primer requisito materializa el Set. **Criterios:** crea `Satisfied Requirement Set` + instancia `Req#1`. **Modelo:** `entidad` Set + `entidad` instancia + `enlace` agregación. **Patrones:** HU-SHARED-002. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [requisito].

### HU-A1.003 — Auto-crear "Satisfied Requirement Set" como agregador canónico
**Actor:** AD. **Tipo:** mixto. **Nivel:** K. **Criterios:** Set único por modelo. **Deps:** HU-A1.002. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [agregacion].

### HU-A1.004 — Editar identificador lógico `Req#N`
**Actor:** AD. **Tipo:** mixto. **Nivel:** K. **Criterios:** caja-estado editable con identificador `Req#3`, etc. **Modelo:** `estado.nombre`. **Deps:** HU-A1.002. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [editar].

### HU-A1.005 — Agregar requisitos sucesivos reutilizando el Set
**Actor:** AD. **Tipo:** mixto. **Nivel:** K. **Criterios:** segundo requisito se agrega al Set existente.  **Patrones:** HU-SHARED-002 (mecánica detectada por audit-hu.mjs). **Deps:** HU-A1.003. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [requisito].

### HU-A1.006 — Re-numerar automáticamente tras borrar instancia
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** **Dado** elimino `Req#2`, **cuando** termina, **entonces** Req#3 → Req#2 y Req#4 → Req#3. **Patrones:** HU-SHARED-005. **Deps:** HU-A1.005. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [renumeracion].

### HU-A1.007 — Diferenciar numeración del objeto del identificador lógico
**Actor:** AD. **Tipo:** mixto. **Nivel:** L. **Criterios:** `Object#M` (interno) vs `Req#N` (lógico) son distintos. **Deps:** HU-A1.004. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [identidad].

### HU-A1.008 — Compartir identidad lógica entre dos instancias con mismo `Req#N`
**Actor:** AD. **Tipo:** mixto. **Nivel:** K. **Historia:** Mismo requisito en distintos contextos. **Criterios:** dos instancias con mismo `Req#N` se interpretan como iguales. **Evidencia:** [Met §8.3]. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [identidad-logica].

### HU-A1.009 — Agregar requisito sobre un enlace
**Actor:** AD. **Tipo:** mixto. **Nivel:** K. **Criterios:** scope = `enlace`. **Modelo:** `aplicacionRequisito.enlaceId`. **Patrones:** HU-SHARED-001. **Deps:** HU-A1.002. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [requisito-enlace].

### HU-A1.010 — Asociar varios requisitos al mismo enlace separados por `;`
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** sintaxis `Req#3; Req#5`. **Deps:** HU-A1.009. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [sintaxis].

### HU-A1.011 — Mostrar etiqueta `Satisfied_Req#N` itálica vertical sobre enlace
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** V. **Criterios:** etiqueta vertical, cursiva. **Deps:** HU-A1.009. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render].

### HU-A1.012 — Abrir diálogo de propiedades del enlace con campos requisito
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** ver HU-11.013 con campos extra: `Target Multiplicity`, `Requirement Set`, `Ordered`. **Deps:** HU-A1.009. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [propiedades].

### HU-A1.013 — Marcar Set como ordenado con checkbox "Ordered"
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** orden importa para iteración. **Deps:** HU-A1.012. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [orden].

### HU-A1.014 — Definir multiplicidad destino del enlace de trazabilidad
**Actor:** AD. **Tipo:** mixto. **Nivel:** K. **Criterios:** ver HU-15.002 con scope = trazabilidad. **Evidencia:** [Glos 3.43]. **Deps:** HU-A1.012. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [multiplicidad].

### HU-A1.015 — Proteger nombre "Satisfied Requirement Set" como no editable
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** K. **Criterios:** input bloqueado. **Patrones:** HU-SHARED-003. **Deps:** HU-A1.003. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [proteccion].

### HU-A1.016 — Ocultar Set + requisitos con "Toggle Satisfied Requirement Set"
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** V. **Criterios:** toggle local. **Deps:** HU-A1.003. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [toggle].

### HU-A1.017 — Ocultar todos los requisitos con "Toggle All Model Requirements"
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** V. **Criterios:** toggle global. **Deps:** HU-A1.016. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [toggle, global].

### HU-A1.018 — Ocultar etiqueta sobre enlace con toggle específico
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** V. **Deps:** HU-A1.011. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [toggle].

### HU-A1.019 — Distinguir oculto vs borrado (preservar en modelo y OPL)
**Actor:** AD. **Tipo:** mixto. **Nivel:** K. **Historia:** Hide ≠ delete. **Criterios:** ocultos siguen en `modelo.entidades`. **Deps:** HU-A1.016. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [distincion].

### HU-A1.020 — Abrir diálogo "Crear/Actualizar Requirement View" listando `Req#N` únicos
**Actor:** AD. **Tipo:** mixto. **Nivel:** L. **Criterios:** lista de identificadores. **Evidencia:** [Met §8.3]. **Deps:** HU-A1.005. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [vista].

### HU-A1.021 — Generar OPD derivado "Vista del Req#N"
**Actor:** AD. **Tipo:** mixto. **Nivel:** L. **Criterios:** **Dado** elijo Req#5, **cuando** confirmo, **entonces** se crea OPD read-only con cierre transitivo del enlace etiquetado. **Modelo:** nuevo `opd.tipo = "requirement-view"`. **Evidencia:** [Met §8.3].  **Patrones:** HU-SHARED-003 (mecánica detectada por audit-hu.mjs). **Deps:** HU-A1.020. **Prioridad:** S. **Tamaño:** L. **Etiquetas:** [vista, opd-derivado].

### HU-A1.022 — Aplicar cierre transitivo mínimo (source/target del enlace)
**Actor:** AD. **Tipo:** mixto. **Nivel:** K. **Criterios:** vista incluye solo origen y destino directos del enlace etiquetado. **Evidencia:** [Met §8.3]. **Deps:** HU-A1.021. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [cierre].

### HU-A1.023 — Mantener Vista como OPD read-only re-posicionable
**Actor:** AD. **Tipo:** mixto. **Nivel:** V. **Criterios:** layout editable, contenido read-only. **Evidencia:** [Met §8.3]. **Patrones:** HU-SHARED-003. **Deps:** HU-A1.021. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [vista].

### HU-A1.024 — Actualizar Vista existente
**Actor:** AD. **Tipo:** mixto. **Nivel:** L. **Criterios:** botón "Actualizar" recalcula cierre. **Evidencia:** [Met §8.3]. **Deps:** HU-A1.021. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [actualizar].

### HU-A1.025 — Conectar estereotipo canónico `<<Requirement>>`
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** D. **Criterios:** comando aplica estereotipo predefinido. **Deps:** EPICA-A0. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [estereotipo].

### HU-A1.026 — Desplegar plantilla canónica de 5 atributos
**Actor:** AD. **Tipo:** mixto. **Nivel:** K. **Historia:** Atributos canónicos: esencia (operacional/no-operacional/híbrida), satisfacción, prioridad, etc. **Criterios:** despliegue automático tras aplicar estereotipo. **Evidencia:** [Met §8.1]. **Deps:** HU-A1.025. **Prioridad:** S. **Tamaño:** L. **Etiquetas:** [plantilla].

### HU-A1.027 — Editar atributo "esencia operacional" del requisito
**Actor:** AD. **Tipo:** mixto. **Nivel:** K. **Criterios:** valores: operacional / no-operacional / híbrida. **Deps:** HU-A1.026. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [atributo].

### HU-A1.028 — Editar atributo "Satisfaction"
**Actor:** AD. **Tipo:** mixto. **Nivel:** K. **Criterios:** valores: hard/soft. **Deps:** HU-A1.026. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [atributo].

### HU-A1.029 — Ampliar requisito con atributos adicionales
**Actor:** AD. **Tipo:** mixto. **Nivel:** K. **Deps:** HU-A1.026. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [extension].

### HU-A1.030 — Advertir pérdida de valores al remover estereotipo
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** modal advertencia. **Deps:** HU-A0.025. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [warning].

### HU-A1.031 — Asociar URL de sistema externo
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** ver HU-17.018. **Deps:** HU-17.018. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [url].

### HU-A1.032 — Renderizar OPL específico con prefijo `<<Requirement>>`
**Actor:** AD. **Tipo:** mixto. **Nivel:** L. **Criterios:** OPL: `<<Requirement>> Req#N satisface ...`. **Patrones:** HU-SHARED-007. **Deps:** HU-A0.011. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [opl].

### HU-A1.033 — Navegar rama "Requirement Views" del árbol OPD
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** rama paralela al SD. **Deps:** HU-A1.021. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [arbol].

### HU-A1.034 — Bloquear delete del `Satisfied_Req#N` desde la vista
**Actor:** AD. **Tipo:** mixto. **Nivel:** K. **Criterios:** vista read-only impide eliminar requisitos.  **Patrones:** HU-SHARED-003 (mecánica detectada por audit-hu.mjs). **Deps:** HU-A1.023. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [restriccion].

## 3. Referencias

- Patrones: HU-SHARED-001, HU-SHARED-002, HU-SHARED-003, HU-SHARED-005, HU-SHARED-007.
- Bloqueada por: EPICA-A0 (estereotipos), EPICA-13 (estados).
