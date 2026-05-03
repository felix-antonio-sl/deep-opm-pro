---
epica: "EPICA-90"
titulo: "Interacción — atajos de teclado"
slug: "interaccion-shortcuts"
doc_fuente: "opcloud-reverse/90-interaccion-shortcuts.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "M1"
hu_emitidas: 21
hu_canonicas: 21
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Mapa maestro de atajos de teclado: guardar, buscar, copiar/pegar, eliminar, nudge fino, deshacer/rehacer, navegación entre OPDs, despliegue, format painter. Axioma: ningún atajo crea cosas (creación es siempre por gesto explícito de canvas).

## 2. HU canónicas

### HU-90.001 — Guardar modelo con `Ctrl+S` [especializa HU-SHARED-002 vía HU-30.014]
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** atajo dispara HU-30.014. **Patrones:** HU-SHARED-003. **Deps:** HU-30.014. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [atajo, guardar].

### HU-90.002 — Abrir "Buscar Cosas" con `Ctrl+F` [especializa HU-35.008]
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** ver HU-35.008. **Deps:** HU-35.008. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [atajo, busqueda].

### HU-90.003 — Copiar selección con `Ctrl+C` al buffer visual
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** **Dado** selección, **cuando** Ctrl+C, **entonces** se copian apariencias y enlaces internos al buffer. **Modelo:** `ui.portapapelesVisual`. **Patrones:** HU-SHARED-008. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [atajo, copiar].

### HU-90.004 — Pegar copia visual con `Ctrl+V` en OPD activo
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** K. **Criterios:** **Dado** buffer activo, **cuando** Ctrl+V, **entonces** se crean nuevas apariencias para las entidades copiadas (con offset). Comparten entidad si es misma; si es duplicación entre OPDs distintos, son la misma entidad. **Patrones:** HU-SHARED-002. **Deps:** HU-90.003. **Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [atajo, pegar].

### HU-90.005 — Eliminar selección con `Delete` [especializa HU-SHARED-005]
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** ver HU-SHARED-005. **Patrones:** HU-SHARED-005. **Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [atajo, eliminar].

### HU-90.006 — Mover selección 1 px con flechas (nudge fino)
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** V. **Criterios:** flechas → mueven 1 px; con Shift → 10 px. **Patrones:** HU-SHARED-002, HU-SHARED-008. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [atajo, nudge].

### HU-90.007 — Aplicar nudge sobre enlaces seleccionados
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** V. **Criterios:** ídem para enlaces (mueve `aparienciaEnlace.vertices`). **Deps:** HU-90.006. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [atajo, enlace].

### HU-90.008 — Deshacer última operación con `Ctrl+Z` [especializa HU-SHARED-002]
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** ver HU-SHARED-002. **Patrones:** HU-SHARED-002. **Prioridad:** M0. **Tamaño:** M. **Etiquetas:** [atajo, undo].

### HU-90.009 — Rehacer con `Ctrl+Y` (o `Ctrl+Shift+Z`) [especializa HU-SHARED-002]
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** ver HU-SHARED-002. **Patrones:** HU-SHARED-002. **Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [atajo, redo].

### HU-90.010 — Navegar al OPD siguiente con `Ctrl+↓`
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** ver HU-20.009. **Deps:** HU-20.009. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [atajo, navegacion].

### HU-90.011 — Navegar al OPD anterior con `Ctrl+↑`
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** L. **Deps:** HU-20.009. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [atajo, navegacion].

### HU-90.012 — Descender al OPD hijo con `Ctrl+→`
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** L. **Deps:** HU-20.009. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [atajo, descender].

### HU-90.013 — Ascender al OPD padre con `Ctrl+←`
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** L. **Deps:** HU-20.009. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [atajo, ascender].

### HU-90.014 — Despliegue con `Shift+U`
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** K. **Criterios:** ver HU-17.028. **Deps:** HU-17.028. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [atajo, despliegue].

### HU-90.015 — Format painter con `Ctrl+Shift+C`
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** V. **Criterios:** activa modo copiar-estilo (HU-14.013). **Deps:** HU-14.013. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [atajo, estilo].

### HU-90.016 — Respetar axioma "no creación por teclado"
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** K. **Historia:** Crear cosas requiere gesto de canvas. **Criterios:** ningún atajo crea entidad/enlace; los atajos solo invocan operaciones sobre selección o estado. **Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [axioma].

### HU-90.017 — Mantener contraparte gráfica de todos los atajos
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Todo atajo tiene botón equivalente. **Criterios:** verificación de paridad atajo↔botón. **Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [accesibilidad].

### HU-90.018 — Duplicar selección con `Ctrl+D`
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** K. **Criterios:** atajo combina copiar + pegar con offset. **Patrones:** HU-SHARED-002. **Deps:** HU-90.003. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [atajo, duplicar, requires-clarification].

### HU-90.019 — Seleccionar todo con `Ctrl+A`
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** selecciona todas las apariencias del OPD activo. **Patrones:** HU-SHARED-008. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [atajo, requires-clarification].

### HU-90.020 — Ajustar vista con `Ctrl+0` (fit-to-screen)
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** V. **Criterios:** zoom + pan automáticos para encajar todo el OPD. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [atajo, requires-clarification].

### HU-90.021 — Hacer zoom con `Ctrl+rueda`
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** V. **Criterios:** rueda con Ctrl hace zoom in/out.  **Patrones:** HU-SHARED-002 (mecánica detectada por audit-hu.mjs). **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [atajo, zoom, requires-clarification].

## 3. Mapa de atajos canónico

| Atajo | Acción | HU |
|---|---|---|
| Ctrl+S | Guardar | HU-90.001 |
| Ctrl+F | Buscar cosas | HU-90.002 |
| Ctrl+C / V | Copiar / Pegar | HU-90.003/004 |
| Ctrl+Z / Y | Deshacer / Rehacer | HU-90.008/009 |
| Delete | Eliminar | HU-90.005 |
| Flechas | Nudge 1 px | HU-90.006 |
| Shift+Flechas | Nudge 10 px | HU-90.006 |
| Ctrl+Flechas | Navegar OPD | HU-90.010..013 |
| Shift+U | Despliegue | HU-90.014 |
| Ctrl+Shift+C | Format painter | HU-90.015 |
| Esc | Cancelar / deselección | HU-SHARED-008 |

## 4. Preguntas abiertas

| Q | Pregunta |
|---|---|
| Q90.1 | ¿Atajos remapeables por usuario? |
| Q90.2 | ¿Compatibilidad cross-platform (Cmd vs Ctrl)? |

## 5. Referencias

- Patrones: HU-SHARED-002, HU-SHARED-003, HU-SHARED-005, HU-SHARED-008.
