---
epica: "EPICA-B1"
titulo: "Simulación computacional — valores escalares, firmas invocables y sorteo probabilístico"
slug: "simulation-computational"
doc_fuente: "opcloud-reverse/b1-simulation-computational.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "S"
hu_emitidas: 27
hu_canonicas: 27
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Convertir cosas en computacionales: objetos con slot de valor, procesos con firma `()`, operaciones predefinidas (Sumar, Multiplicar, etc.), enlaces Instrumento como lectura, valores numéricos sorteados con distribución probabilística, ejecuciones múltiples con export XLSX.

## 2. HU canónicas (resumen denso)

### HU-B1.001 — Convertir objeto en computacional con botón del halo
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** **Dado** botón "Computacional" en halo, **cuando** activo, **entonces** `entidad.computacional = true` `[propuesta]` y se renderiza slot `value`. **Modelo:** `entidad.computacional` `[propuesta]`. **Patrones:** HU-SHARED-001, HU-SHARED-002. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [computacional].

### HU-B1.002 — Renderizar rectángulo-estado `value` dentro del objeto computacional
**Actor:** IS. **Tipo:** mixto. **Nivel:** V. **Criterios:** caja con texto `value` o número. [V-163]. **Deps:** HU-B1.001. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render, slot].

### HU-B1.003 — Asignar unidad física con sintaxis `[...]`
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** K. **Criterios:** ver HU-17.011. **Deps:** HU-17.011, HU-B1.001. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [unidad].

### HU-B1.004 — Abrir popup "Editar Alias"
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** ver HU-17.007. **Deps:** HU-17.007. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [alias].

### HU-B1.005 — Renderizar alias como segunda línea `{alias}`
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** V. **Criterios:** ver HU-17.008. **Deps:** HU-17.008. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [render].

### HU-B1.006 — Convertir proceso en computacional
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** análogo a HU-B1.001 para procesos. **Modelo:** `entidad.computacional`. **Deps:** HU-B1.001. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [computacional, proceso].

### HU-B1.007 — Renderizar firma `( )` detrás del nombre
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** V. **Criterios:** indicador visual de proceso invocable. **Deps:** HU-B1.006. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [render].

### HU-B1.008 — Elegir categoría de computación en grid 3×3
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** Predefinida, User Defined, MQTT, External, ROS, etc. **Deps:** HU-B1.006. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [categoria].

### HU-B1.009 — Seleccionar operación Predefined (ej. "Sumar")
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** lista de operaciones. **Modelo:** `entidad.operacion`. **Deps:** HU-B1.008. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [operacion].

### HU-B1.010 — Ver tooltip con operación predefinida al pasar el cursor
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-B1.009. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [tooltip].

### HU-B1.011 — Conectar objeto computacional a proceso con enlace Instrumento
**Actor:** IS. **Tipo:** opm-semantica. **Nivel:** K. **Criterios:** ver HU-11.009. **Evidencia:** [V-239], [V-240]. **Deps:** HU-11.009, HU-B1.006. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [enlace, instrumento].

### HU-B1.012 — Renderizar círculo abierto como punto de lectura
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** V. **Criterios:** marker en extremo Instrumento. **Deps:** HU-B1.011. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render, marker].

### HU-B1.013 — Conectar proceso a objeto resultado con Result
**Actor:** IS. **Tipo:** opm-semantica. **Nivel:** K. **Criterios:** ver HU-10.011 con tipo "resultado". **Evidencia:** [V-239]. **Deps:** HU-10.011, HU-B1.006. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [enlace, resultado].

### HU-B1.014 — Asignar valor manual al estado-value antes de ejecutar
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** K. **Criterios:** input numérico. **Modelo:** `valueSlot.valor`. **Deps:** HU-B1.002. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [valor].

### HU-B1.015 — Ejecutar simulación Sync determinista y ver resultado en vivo
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** K. **Criterios:** ejecuta operación + propaga al destino. **Patrones:** HU-B0.013. **Deps:** HU-B1.011, HU-B1.013, HU-B1.014. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [ejecucion].

### HU-B1.016 — Abrir modal "Elementos simulables"
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** lista de cosas que pueden simularse. **Deps:** HU-B1.015. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [modal].

### HU-B1.017 — Marcar objeto como simulable con casilla
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** K. **Criterios:** checkbox por entidad. **Modelo:** `entidad.simulable`. **Deps:** HU-B1.016. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [simulable].

### HU-B1.018 — Definir valor numérico sorteado con distribución
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** K. **Criterios:** distribuciones: uniforme, normal, exponencial, etc. **Modelo:** `entidad.distribucion`. **Deps:** HU-B1.017. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [distribucion].

### HU-B1.019 — Definir valor textual sorteado con pares texto:peso
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** K. **Criterios:** lista de tuplas. **Modelo:** `entidad.valoresPesos`. **Deps:** HU-B1.017. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [pesos].

### HU-B1.020 — Configurar "Cantidad de Ejecuciones de Simulación"
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** input numérico. **Modelo:** `simulacion.numEjecuciones`. **Deps:** HU-B1.018. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [config].

### HU-B1.021 — Configurar "Descargar CSV tras N ejecuciones"
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** X. **Deps:** HU-B1.020. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [config, csv].

### HU-B1.022 — Ejecutar simulación Async con valores sorteados
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** K. **Criterios:** Async ejecuta N ejecuciones. **Patrones:** HU-B0.014. **Deps:** HU-B1.020. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [async].

### HU-B1.023 — Descartar valor preasignado cuando objeto es simulable
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** K. **Criterios:** simulable sobreescribe valor manual. **Deps:** HU-B1.014, HU-B1.017. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [override].

### HU-B1.024 — Actualizar `displayText` del estado-value en tiempo real
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** V. **Criterios:** texto se actualiza por frame. **Deps:** HU-B1.015. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render, tiempo-real].

### HU-B1.025 — Exportar resultados a XLSX
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** X. **Criterios:** archivo con N filas (una por ejecución). **Deps:** HU-B1.022. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [export, xlsx].

### HU-B1.026 — Ver OPL de cuatro campos con alias y unidad
**Actor:** IS. **Tipo:** mixto. **Nivel:** L. **Criterios:** OPL con `nombre [unidad] {alias} value`. **Patrones:** HU-SHARED-007. **Evidencia:** [OPL-ES]. **Deps:** HU-B1.005. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [opl].

### HU-B1.027 — Conectar proceso computacional a sensor MQTT como categoría
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** X. **Criterios:** ver EPICA-C0. **Deps:** EPICA-C0. **Prioridad:** W. **Tamaño:** L. **Etiquetas:** [mqtt, runtime].

## 3. Referencias

- Patrones: HU-SHARED-001, HU-SHARED-002, HU-SHARED-007.
- Bloqueada por: EPICA-B0.
- Bloquea a: EPICA-B2, B3, B4, B5.
