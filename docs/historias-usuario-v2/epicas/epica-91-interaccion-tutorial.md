---
epica: "EPICA-91"
titulo: "Interacción — modo tutorial, tooltips guiados y asistencia pedagógica"
slug: "interaccion-tutorial"
doc_fuente: "opcloud-reverse/91-interaccion-tutorial.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "C"
hu_emitidas: 16
hu_canonicas: 16
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Modo tutorial: tooltips guiados, thumbnails animados con mini-OPD, cobertura sobre toolbar secundaria, halo, biblioteca lateral, árbol OPD. Inhibido durante gestos activos y excluido de exportes.

## 2. HU canónicas

### HU-91.001 — Activar modo tutorial desde Configuración
**Actor:** PD. **Tipo:** opcloud-ui. **Nivel:** C. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [tutorial, config].

### HU-91.002 — Desactivar modo tutorial con selector "Mostrar/Ocultar"
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [toggle].

### HU-91.003 — Persistir preferencia tutorial entre sesiones
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** P. **Modelo:** `usuario.preferencias.tutorial`. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [persistencia].

### HU-91.004 — Ver tooltip textual con nombre canónico al pasar el cursor
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** tooltip estándar con texto explicativo del control. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [tooltip].

### HU-91.005 — Ver thumbnail animado con mini-OPD al apuntar sostenido
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** V. **Criterios:** **Dado** apuntar 1.5s, **cuando** se renderiza, **entonces** mini-OPD demostrativo aparece. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [animacion].

### HU-91.006 — Tutorial Mode sobre toolbar secundaria completa
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** cobertura 100% controles. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [cobertura].

### HU-91.007 — Tutorial Mode sobre menú radial / halo
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** cobertura del halo. **Patrones:** HU-SHARED-001. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [cobertura].

### HU-91.008 — Tutorial Mode sobre biblioteca lateral
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [cobertura].

### HU-91.009 — Tutorial Mode sobre nodos del árbol OPD
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [cobertura].

### HU-91.010 — Inhibir overlays tutoriales durante gestos activos
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** No estorbar mientras dibujo. **Criterios:** durante drag/edit, tooltips se ocultan. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [ux].

### HU-91.011 — Excluir overlays tutoriales de exportes PDF/SVG
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** X. **Criterios:** export filtra. **Deps:** EPICA-60, EPICA-61. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [export].

### HU-91.012 — Activar tutorial por defecto para usuarios nuevos
**Actor:** PD. **Tipo:** opcloud-ui. **Nivel:** C. **Criterios:** primer login → tutorial activo. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [onboarding].

### HU-91.013 — Mostrar catálogo extensible de controles tutoriales
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** D. **Historia:** Permitir tutoriales custom por org. **Modelo:** `[propuesta]` `tutorial.entradas`. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [extensibilidad].

### HU-91.014 — Acceder a tutorial desde menú "Ayuda"
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [ayuda].

### HU-91.015 — Mantener tutorial accesible sin interrumpir modelado
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Modelo + tutorial coexisten. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [ux].

### HU-91.016 — Re-ejecutar tutorial guiado bajo demanda
**Actor:** PD. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** botón "Reiniciar tutorial". **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [tutorial].

## 3. Referencias

- Patrones: HU-SHARED-001.
- Bloqueada por: ninguna específica.
