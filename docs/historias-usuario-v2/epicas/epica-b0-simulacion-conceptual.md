---
epica: "EPICA-B0"
titulo: "Simulación conceptual — modo, controles y marcas sobre canvas"
slug: "simulation-conceptual"
doc_fuente: "opcloud-reverse/b0-simulation-conceptual.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "S"
hu_emitidas: 30
hu_canonicas: 30
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Simulación step-through conceptual del modelo OPM: alterna entre modo edición y modo simulación, barra dedicada con Play/Pause/Stop, animación de tokens, marcado de proceso activo y estado actual. Modo Sync (determinista) y Async (paralelo). Headless runner para sin animación. Bloquea edición durante simulación.

## 2. HU canónicas

### HU-B0.001 — Activar modo simulación desde barra principal
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** botón "▶ Simulación" cambia modo. **Modelo:** `ui.modo: "edicion" \| "simulacion"`. **Patrones:** HU-SHARED-002, HU-SHARED-003. **Evidencia:** [Met §Modelos conceptuales y de ejecución]. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [modo].

### HU-B0.002 — Reemplazar barra de edición por barra de simulación
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** UI cambia. **Deps:** HU-B0.001. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [ui].

### HU-B0.003 — Volver a modo edición
**Actor:** IS. **Tipo:** mixto. **Nivel:** U. **Criterios:** botón "Volver a Edición". **Patrones:** HU-SHARED-002. **Deps:** HU-B0.001. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [modo].

### HU-B0.004 — Ver inventario de controles en barra detenida
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** Play, slider velocidad, modo, runner headless. **Deps:** HU-B0.002. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [controles].

### HU-B0.005 — Iniciar simulación con "Reproducir"
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** ejecuta paso a paso desde proceso inicial. **Modelo:** `ui.simulacion.estado = "ejecutando"`. **Evidencia:** [Met §Modelos]. **Deps:** HU-B0.004. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [play].

### HU-B0.006 — Pausar con "Pausar"
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** estado pausado conserva contexto. **Deps:** HU-B0.005. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [pause].

### HU-B0.007 — Reanudar pausada
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Deps:** HU-B0.006. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [resume].

### HU-B0.008 — Detener y resetear con "Detener"
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** vuelve al estado inicial. **Deps:** HU-B0.005. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [stop].

### HU-B0.009 — Ver mutación de barra: Reproducir → Pausar al iniciar
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** V. **Deps:** HU-B0.005. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [render].

### HU-B0.010 — Ocultar controles no aplicables durante ejecución
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** modo selector desaparece durante run. **Deps:** HU-B0.005. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [ui].

### HU-B0.011 — Ajustar velocidad con slider
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** slider 0.25× a 4×. **Deps:** HU-B0.004. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [velocidad].

### HU-B0.012 — Ajustar velocidad durante ejecución
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** ajuste en caliente. **Deps:** HU-B0.011. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [velocidad].

### HU-B0.013 — Ejecutar en modo Sync determinista
**Actor:** IS. **Tipo:** opm-semantica. **Nivel:** K. **Historia:** Orden por Y; un proceso a la vez. **Criterios:** orden derivado de `apariencia.y` ascendente. **Evidencia:** [V-35], [Met §Árboles OPD]. **Deps:** HU-B0.005. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [sync].

### HU-B0.014 — Ejecutar en modo Async paralelo
**Actor:** IS. **Tipo:** opm-semantica. **Nivel:** K. **Historia:** Procesos concurrentes corren a la vez. **Criterios:** misma Y ⇒ ejecución concurrente. **Evidencia:** [V-32], [Met §Árboles OPD]. **Deps:** HU-B0.005. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [async].

### HU-B0.015 — Activar Headless Runner
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** sin animación, salto directo al final. **Deps:** HU-B0.005. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [headless].

### HU-B0.016 — Resaltar proceso activo con contorno cian grueso
**Actor:** IS. **Tipo:** mixto. **Nivel:** V. **Criterios:** stroke-width 4px durante ejecución. **Evidencia:** [V-?], [JOYAS §1, §9]. **Deps:** HU-B0.005. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [render, animacion].

### HU-B0.017 — Animar token verde sobre enlace en uso
**Actor:** IS. **Tipo:** mixto. **Nivel:** V. **Criterios:** círculo verde recorre el enlace. **Evidencia:** [JOYAS §9]. **Deps:** HU-B0.005. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [animacion].

### HU-B0.018 — Marcar estado actual con disco verde anclado
**Actor:** IS. **Tipo:** opm-semantica. **Nivel:** V. **Criterios:** disco junto al estado activo. **Evidencia:** [V-237], [JOYAS §9]. **Deps:** HU-B0.005. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [render, current].

### HU-B0.019 — Preservar borde oliva grueso del estado inicial
**Actor:** IS. **Tipo:** opm-semantica. **Nivel:** V. **Criterios:** estado Inicial conserva indicador. **Evidencia:** [V-4]. **Deps:** HU-13.010. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [render].

### HU-B0.020 — Derivar orden de ejecución de coordenada Y
**Actor:** IS. **Tipo:** opm-semantica. **Nivel:** K. **Criterios:** ver HU-12.016. **Evidencia:** [V-35]. **Deps:** HU-12.016. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [orden].

### HU-B0.021 — Actualizar OPL al reordenar subprocesos en Y
**Actor:** IS. **Tipo:** mixto. **Nivel:** L. **Criterios:** OPL refleja nuevo orden. **Patrones:** HU-SHARED-007. **Deps:** HU-B0.020. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [opl].

### HU-B0.022 — Cerrar ciclo simular → leer OPL → reordenar → re-simular
**Actor:** IS. **Tipo:** mixto. **Nivel:** L. **Historia:** Ciclo iterativo. **Criterios:** flujo completo sin recargar. **Deps:** HU-B0.021. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [iteracion].

### HU-B0.023 — Ver contador de pasos en barra
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** contador `Paso N`. **Deps:** HU-B0.005. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [contador].

### HU-B0.024 — Bloquear edición durante simulación
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** K. **Criterios:** canvas en read-only mientras ejecuta. **Patrones:** HU-SHARED-003. **Deps:** HU-B0.005. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [read-only].

### HU-B0.025 — Mantener panel OPL estático durante ejecución
**Actor:** IS. **Tipo:** mixto. **Nivel:** L. **Historia:** OPL no cambia (semántica fija); solo apunta proceso activo. **Criterios:** highlight del paso, no reemisión. **Deps:** HU-B0.005. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [opl].

### HU-B0.026 — Navegar entre OPDs durante simulación
**Actor:** IS. **Tipo:** mixto. **Nivel:** L. **Criterios:** cambio de OPD permitido; simulación continúa. **Deps:** HU-B0.005. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [navegacion].

### HU-B0.027 — Reflejar transiciones de estado de objeto
**Actor:** IS. **Tipo:** mixto. **Nivel:** K. **Criterios:** Current se mueve entre estados según par entrada-salida. **Evidencia:** [V-237]. **Deps:** HU-B0.005. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [transicion].

### HU-B0.028 — Atajo Espacio para Play/Pause
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-B0.005. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [atajo].

### HU-B0.029 — Distinguir cian de refinable vs cian de activo
**Actor:** IS. **Tipo:** mixto. **Nivel:** V. **Criterios:** colores ligeramente distintos o context-aware. **Deps:** HU-12.008, HU-B0.016. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render].

### HU-B0.030 — Ver tooltip en controles de simulación
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-B0.004. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [tooltip].

## 3. Referencias

- Patrones: HU-SHARED-002, HU-SHARED-003, HU-SHARED-007.
- Bloqueada por: EPICA-12 (descomposición), EPICA-13 (estados).
- Bloquea a: EPICA-B1, EPICA-B2, EPICA-B4, EPICA-B5.
