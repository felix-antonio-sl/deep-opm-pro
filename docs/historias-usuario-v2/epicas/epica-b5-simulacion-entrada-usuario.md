---
epica: "EPICA-B5"
titulo: "Simulación — entrada de usuario en tiempo de ejecución"
slug: "simulation-user-input"
doc_fuente: "opcloud-reverse/b5-simulation-user-input.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "S"
hu_emitidas: 23
hu_canonicas: 23
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Procesos "obtenedores de entrada" capturan input humano durante simulación. Patrón canónico `Usuario maneja Obtención de Entrada genera Entrada`. Editor JS modal con variables runtime (`userInput`, `updateValue`). Suspensión de simulación al alcanzar obtenedor; modal de input; reanudación con valor capturado.

## 2. HU canónicas

### HU-B5.001 — Marcar proceso como obtenedor de entrada
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** K. **Criterios:** botón en toolbar contextual. **Modelo:** `entidad.tipoSim = "input-getter"`. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [input].

### HU-B5.002 — Modelar patrón canónico "Usuario maneja Obtención genera Entrada"
**Actor:** IS. **Tipo:** opm-semantica. **Nivel:** K. **Historia:** Patrón estándar. **Criterios:** **Dado** marco proceso, **cuando** activo patrón, **entonces** se genera Usuario (agente) → Obtención (proceso) → Entrada (resultado). **Evidencia:** [Glos 3.3], [Glos 3.39], [Glos 3.58], [V-239]. **Deps:** HU-B5.001. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [patron].

### HU-B5.003 — Abrir editor JS modal con doble clic en obtenedor
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-B5.001. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [editor].

### HU-B5.004 — Editar cuerpo de función en región superior del editor
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** P. **Deps:** HU-B5.003. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [editor].

### HU-B5.005 — Ver región protegida con comentario de guardia
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** texto `/*-- No editar --*/` separa código del usuario de runtime. **Deps:** HU-B5.003. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [proteccion].

### HU-B5.006 — Exponer `userInput` como variable reservada
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** variable disponible en cuerpo. **Evidencia:** [V-122]. **Deps:** HU-B5.004. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [runtime].

### HU-B5.007 — Exponer `updateValue(alias, valor)` como API de escritura
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** función global escribe a otros objetos. **Evidencia:** [V-122]. **Deps:** HU-B5.004. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [api, runtime].

### HU-B5.008 — Cambiar tema del editor JS y persistir
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** C. **Deps:** HU-B5.003. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [tema].

### HU-B5.009 — Guardar función con `Update` y marcar proceso con sufijo `<>`
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** P. **Deps:** HU-B5.004. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [guardar].

### HU-B5.010 — Cancelar cambios sin persistir
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-B5.003. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [cancelar].

### HU-B5.011 — Reabrir editor con cuerpo previo
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-B5.009. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [reabrir].

### HU-B5.012 — Regenerar aliases elegibles al cambiar topología
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** lista de aliases dinámica. **Evidencia:** [V-122]. **Deps:** HU-B5.007. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [aliases].

### HU-B5.013 — Ejecutar obtenedores en modo Sync
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** P. **Deps:** HU-B0.013. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [sync].

### HU-B5.014 — Suspender simulación al alcanzar un obtenedor
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** simulación pausa esperando input. **Deps:** HU-B0.005, HU-B5.001. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [suspension].

### HU-B5.015 — Mostrar modal "Por favor ingrese un valor:" con valor actual preseleccionado
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-B5.014. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [modal-input].

### HU-B5.016 — Aceptar texto libre y delegar parseo a función JS
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** input string crudo. **Deps:** HU-B5.015. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [input].

### HU-B5.017 — Aplicar entrada y reanudar la simulación
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** **Dado** input recibido, **cuando** confirmo, **entonces** función ejecuta y simulación continúa. **Deps:** HU-B5.016. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [reanudar].

### HU-B5.018 — Sobrescribir `value` del objeto de salida in-situ
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** V. **Criterios:** valor visible se actualiza. **Deps:** HU-B5.017. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render].

### HU-B5.019 — Escribir en otros objetos vía `updateValue`
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** **Dado** función llama `updateValue("alias.atributo", 42)`, **cuando** se ejecuta, **entonces** ese atributo se actualiza. **Evidencia:** [V-122]. **Deps:** HU-B5.007. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [api].

### HU-B5.020 — Listar obtenedores y atributos en "Elementos simulables"
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** L. **Deps:** HU-B1.016. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [lista].

### HU-B5.021 — Alimentar obtenedores con Headless Runner
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** runner usa valores predefinidos en lugar de modal. **Deps:** HU-B0.015. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [headless].

### HU-B5.022 — Importar valores de entrada desde XLSX
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** X. **Deps:** HU-B5.021. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [batch].

### HU-B5.023 — Resolver obtenedores bajo Async Execute
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** K. **Criterios:** soporte async. **Deps:** HU-B0.014. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [async].

## 3. Referencias

- Patrones: HU-SHARED-002, HU-SHARED-007.
- Bloqueada por: EPICA-B0, EPICA-B1, EPICA-B2.
