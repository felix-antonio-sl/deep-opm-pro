---
epica: "EPICA-B2"
titulo: "Simulación — funciones definidas por usuario (código en procesos)"
slug: "simulation-user-functions"
doc_fuente: "opcloud-reverse/b2-simulation-user-functions.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "S"
hu_emitidas: 26
hu_canonicas: 26
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Modo "User Defined" para procesos computacionales: editor JS modal para escribir cuerpo de función, ejecución con alias como variables, dry-run, debug paso a paso, biblioteca organizacional de funciones reutilizables, sandbox sin red ni DOM.

## 2. HU canónicas

### HU-B2.001 — Activar modo "Definida por usuario" en computación
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** K. **Criterios:** opción en HU-B1.008. **Deps:** HU-B1.008. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [user-defined].

### HU-B2.002 — Abrir diálogo modeless "Función"
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** modal arrastrable que no bloquea canvas. **Deps:** HU-B2.001. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [modal].

### HU-B2.003 — Ver placeholder por defecto `return a+b;`
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-B2.002. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [placeholder].

### HU-B2.004 — Editar cuerpo de función en textarea
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** P. **Modelo:** `entidad.cuerpoFuncion: string`. **Deps:** HU-B2.002. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [editor].

### HU-B2.005 — Confirmar con botón "Actualizar"
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Patrones:** HU-SHARED-002. **Deps:** HU-B2.004. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [guardar].

### HU-B2.006 — Marcar proceso con sufijo `<>` tras asociar función
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** V. **Deps:** HU-B2.005. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [render].

### HU-B2.007 — Arrastrar diálogo Function con asa
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-B2.002. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [drag].

### HU-B2.008 — Asignar alias a cosa con "Editar Alias"
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** ver HU-17.007. **Evidencia:** [OPL-ES D3..D4]. **Deps:** HU-17.007. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [alias].

### HU-B2.009 — Referenciar atributos por alias de entidad y de atributo
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Historia:** Sintaxis `entidad.atributo` con aliases en lugar de IDs. **Criterios:** los aliases se resuelven en runtime contra `entidad.alias`. **Evidencia:** [V-1]. **Deps:** HU-B2.008. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [alias, scope].

### HU-B2.010 — Leer partes de agregación a través del alias del todo
**Actor:** IS. **Tipo:** opm-semantica. **Nivel:** K. **Criterios:** `todo.partes` como array. **Evidencia:** [V-239]. **Deps:** HU-B2.009. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [agregacion, runtime].

### HU-B2.011 — Ejecutar función con "Execute → Sync" y poblar casillas
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** ejecuta y propaga resultado a destinos. **Deps:** HU-B2.005, HU-B0.013. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [ejecucion].

### HU-B2.012 — Persistir cuerpo de función entre sesiones
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** P. **Modelo:** `entidad.cuerpoFuncion` parte del JSON. **Deps:** HU-30.008. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [persistencia].

### HU-B2.013 — Reabrir diálogo Function con cuerpo previo precargado
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-B2.012. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [reabrir].

### HU-B2.014 — Regresar de "User Defined" a función predefinida
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** dropdown vuelve a Predefined; cuerpo se preserva en histórico. **Deps:** HU-B2.001. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [reversion].

### HU-B2.015 — Reportar error de sintaxis
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** parser muestra línea + descripción. **Deps:** HU-B2.011. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [error, sintaxis].

### HU-B2.016 — Reportar error de runtime
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** alias indefinido, división por cero. **Deps:** HU-B2.011. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [error, runtime].

### HU-B2.017 — Cancelar edición sin persistir
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-B2.002. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [cancelar].

### HU-B2.018 — Probar función con "dry-run" sin modificar casillas
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** ejecución sin commit. **Deps:** HU-B2.011. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [dry-run].

### HU-B2.019 — Ejecutar paso a paso con debug de valores de alias
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** breakpoints + watch. **Deps:** HU-B2.011. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [debug].

### HU-B2.020 — Organizar funciones reutilizables en biblioteca organizacional
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** D. **Criterios:** `org.funcionesBiblioteca`. **Deps:** EPICA-80. **Prioridad:** C. **Tamaño:** L. **Etiquetas:** [biblioteca].

### HU-B2.021 — Importar función desde biblioteca a un proceso
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** P. **Deps:** HU-B2.020. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [import].

### HU-B2.022 — Exportar función del proceso a biblioteca
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** P. **Deps:** HU-B2.020. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [export].

### HU-B2.023 — Versionar cuerpo de función con historial mínimo
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** array de versiones. **Deps:** HU-B2.012. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [versiones].

### HU-B2.024 — Limitar tiempo de ejecución con timeout
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** C. **Criterios:** kill tras N ms. **Deps:** HU-B2.011. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [seguridad, timeout].

### HU-B2.025 — Sandboxar ejecución sin red ni DOM
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** C. **Historia:** Seguridad. **Criterios:** Web Worker o iframe con CSP estricto. **Patrones:** HU-SHARED-003. **Deps:** HU-B2.011. **Prioridad:** S. **Tamaño:** L. **Etiquetas:** [sandbox, seguridad].

### HU-B2.026 — Cargar pack de ejemplos de funciones canónicas OPM
**Actor:** PD. **Tipo:** opcloud-ui. **Nivel:** D. **Criterios:** ejemplos pre-cargados. **Deps:** HU-B2.020. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [ejemplos].

## 3. Referencias

- Patrones: HU-SHARED-002, HU-SHARED-003, HU-SHARED-007.
- Bloqueada por: EPICA-B1.
