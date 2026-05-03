---
epica: "EPICA-71"
titulo: "Interoperabilidad — importar CSV de atributos, instancias y valores"
slug: "interop-csv"
doc_fuente: "opcloud-reverse/71-interop-csv.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "S"
hu_emitidas: 26
hu_canonicas: 26
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Importación masiva desde CSV: atributos × instancias × valores sobre objeto-clase, o cosas planas sin clase raíz, o enlaces. Configuración de delimitador, codificación, encabezado. Mapeo columnas → campos OPM. Validación contra gramática + simulación pre-importación con resumen.

## 2. HU canónicas

### HU-71.001 — Abrir importador CSV desde menú principal
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [import].

### HU-71.002 — Invocar importador desde grupo de extensiones de objeto-clase
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [import, extension].

### HU-71.003 — Seleccionar archivo CSV desde selector OS
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** P. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [import].

### HU-71.004 — Mostrar metadatos del archivo
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [metadata].

### HU-71.005 — Ver vista previa tabular del CSV antes de importar
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** tabla con primeras 50 filas. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [preview].

### HU-71.006 — Configurar delimitador (coma, punto-y-coma, tab)
**Actor:** ME. **Tipo:** mixto. **Nivel:** P. **Criterios:** dropdown con detección automática inicial. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [config].

### HU-71.007 — Configurar codificación (UTF-8, UTF-8 BOM, Latin-1)
**Actor:** ME. **Tipo:** mixto. **Nivel:** P. **Criterios:** dropdown. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [config].

### HU-71.008 — Declarar fila de encabezado
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** checkbox. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [config].

### HU-71.009 — Mapear columnas a campos OPM (nombre, tipo, esencia, afiliación, padre)
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** K. **Historia:** Tabla de mapeo. **Criterios:** **Dado** preview con columnas, **cuando** elijo destino para cada columna, **entonces** se persiste mapeo. **Modelo:** mapeo en sesión. **Evidencia:** [V-1], [Glos 3.39], [Glos 3.58]. **Prioridad:** S. **Tamaño:** L. **Etiquetas:** [mapeo].

### HU-71.010 — Validar vista previa contra gramática OPM
**Actor:** ME. **Tipo:** mixto. **Nivel:** K. **Historia:** Catch errors antes de importar. **Criterios:** validación detecta combinaciones inválidas. **Evidencia:** [V-239], [V-240]. **Deps:** HU-71.009. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [validacion].

### HU-71.011 — Reportar errores de validación en línea
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** filas con error en rojo + tooltip. **Deps:** HU-71.010. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [error].

### HU-71.012 — Ejecutar simulación y mostrar resumen sin mutar
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Dry run. **Criterios:** "Simular" reporta N creadas, M actualizadas, K errores sin tocar el modelo. **Deps:** HU-71.010. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [dry-run].

### HU-71.013 — Importar matriz atributos×instancias×valores sobre objeto-clase
**Actor:** ME. **Tipo:** mixto. **Nivel:** K. **Historia:** Caso de uso principal. **Criterios:** filas son instancias, columnas son atributos, celdas son valores. Genera entidad por instancia, atributos por columna, valores en cada slot. **Modelo:** múltiples `entidad.*`, `enlace.*`. **Evidencia:** [V-61], [V-1]. **Deps:** HU-71.012. **Prioridad:** S. **Tamaño:** L. **Etiquetas:** [import, matriz].

### HU-71.014 — Crear atributos como computacionales con un solo estado (default)
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** K. **Historia:** Atributos numéricos para simulación. **Evidencia:** [V-163]. **Deps:** HU-71.013. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [computacional].

### HU-71.015 — Crear atributos como no-computacionales
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** K. **Criterios:** checkbox alterna. **Deps:** HU-71.014. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [no-computacional].

### HU-71.016 — Respetar valores existentes con "Ignorar contenido CSV"
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** No sobrescribir. **Criterios:** toggle ignora valores cuando instancia existe. **Deps:** HU-71.013. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [merge].

### HU-71.017 — Aplicar Auto Format sobre nombres del CSV
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** K. **Criterios:** ver HU-10.006. **Patrones:** HU-SHARED-009. **Deps:** HU-71.013. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [auto-format].

### HU-71.018 — Crear masivamente cosas desde CSV plano (sin clase)
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** K. **Historia:** CSV libre sin clase raíz. **Criterios:** cada fila es una entidad independiente. **Evidencia:** [V-1]. **Deps:** HU-71.009. **Prioridad:** S. **Tamaño:** L. **Etiquetas:** [import, plano].

### HU-71.019 — Crear masivamente enlaces desde CSV de enlaces
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** K. **Historia:** CSV con columnas origen, destino, tipo. **Evidencia:** [V-61], [V-239]. **Deps:** HU-71.018. **Prioridad:** S. **Tamaño:** L. **Etiquetas:** [import, enlaces].

### HU-71.020 — Elegir modo "Fusionar vs Reemplazar" al importar sobre modelo con contenido
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** dropdown. **Deps:** HU-71.013. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [merge].

### HU-71.021 — Bloquear import sobre objeto que es a su vez instancia
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** K. **Criterios:** validación bloquea. **Evidencia:** [V-61]. **Deps:** HU-71.013. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [validacion].

### HU-71.022 — Aplicar estereotipos de organización a cosas importadas
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** D. **Criterios:** auto-aplicar según mapeo. **Deps:** EPICA-A0. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [estereotipo].

### HU-71.023 — Integrar import con ontología de organización
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** D. **Historia:** Solo permitir tipos canonizados. **Criterios:** validación contra ontología (EPICA-82). **Deps:** EPICA-82. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [ontologia].

### HU-71.024 — Auto-diagramar tras importación
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** V. **Historia:** Layout automático. **Criterios:** force-directed o radial. **Evidencia:** [V-124], [V-1]. **Deps:** HU-71.013. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [layout].

### HU-71.025 — Reporte final con N creadas, M ignoradas, K errores
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** modal post-import. **Deps:** HU-71.013. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [reporte].

### HU-71.026 — Deshacer import completo con un solo deshacer
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** K. **Historia:** Atomicidad. **Criterios:** Ctrl+Z revierte toda la importación. **Patrones:** HU-SHARED-002. **Deps:** HU-71.013. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [undo, atomico].

## 3. Preguntas abiertas

| Q | Pregunta |
|---|---|
| Q71.1 | ¿Validación con/sin Auto Format es prioridad opcional o por defecto? |
| Q71.2 | ¿CSV soporta multilíneas en celdas? |

## 4. Referencias

- Patrones: HU-SHARED-002, HU-SHARED-009.
- Bloqueada por: EPICA-30, EPICA-A0, EPICA-82.
