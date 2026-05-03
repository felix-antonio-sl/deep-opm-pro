---
epica: "EPICA-C2"
titulo: "Runtime ROS — integración con Robot Operating System"
slug: "runtime-ros"
doc_fuente: "opcloud-reverse/c2-runtime-ros.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "W"
hu_emitidas: 28
hu_canonicas: 28
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Integración con ROS (Robot Operating System): publish/subscribe/servicio sobre tópicos, modos múltiples (Publish, Subscribe, Servicio, Raw Script), badges PYTHON+camara+ROS, editor Monaco, sincronización con Turtlesim/RViz externos. Toda la épica es `W` (requiere ROS Master + WebSocket).

## 2. HU canónicas

### HU-C2.001 — Seleccionar categoría ROS en proceso computacional
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** L. **Evidencia:** [JOYAS §1]. **Deps:** HU-B1.008. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [ros, categoria].

### HU-C2.002 — Configurar Server/Port del WebSocket ROS
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** C. **Modelo:** `org.ros.server`, `org.ros.port`. **Deps:** EPICA-80. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [config].

### HU-C2.003 — Descargar WebSocket mediador desde "Manuals"
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** X. **Prioridad:** W. **Tamaño:** XS. **Etiquetas:** [referencia].

### HU-C2.004 — Abrir popup "ROS Messaging Screen"
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-C2.001. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [popup].

### HU-C2.005 — Seleccionar modo Publish
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** L. **Modelo:** `entidad.rosModo = "publish"`. **Deps:** HU-C2.004. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [publish].

### HU-C2.006 — Configurar tópico con parseo por slash y alias
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** sintaxis `/turtle1/cmd_vel`. **Deps:** HU-C2.005. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [topico].

### HU-C2.007 — Configurar tipo de dato del mensaje ROS
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** dropdown `geometry_msgs/Twist`, etc. **Deps:** HU-C2.005. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [tipo].

### HU-C2.008 — Configurar mensaje literal o delegar a código + alias
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** P. **Deps:** HU-C2.005. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [mensaje].

### HU-C2.009 — Seleccionar modo Subscribe
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** L. **Deps:** HU-C2.004. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [subscribe].

### HU-C2.010 — Seleccionar modo Servicio
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** L. **Deps:** HU-C2.004. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [servicio].

### HU-C2.011 — Seleccionar modo Raw Script
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** L. **Deps:** HU-C2.004. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [raw].

### HU-C2.012 — Persistir configuración ROS con "Update"
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** P. **Patrones:** HU-SHARED-002. **Deps:** HU-C2.004. **Prioridad:** W. **Tamaño:** XS. **Etiquetas:** [guardar].

### HU-C2.013 — Ver badges PYTHON + cámara + ROS sobre proceso
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** V. **Evidencia:** [JOYAS §1]. **Deps:** HU-C2.012. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [badges].

### HU-C2.014 — Editar código Python/JS en editor Monaco
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** P. **Deps:** HU-C2.011. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [editor, monaco].

### HU-C2.015 — Ver runtime variables inyectadas read-only
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** L. **Patrones:** HU-SHARED-003. **Deps:** HU-C2.014. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [runtime].

### HU-C2.016 — Ver tooltip amarillo con preview de código
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-C2.014. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [tooltip].

### HU-C2.017 — Usar rótulo extendido `Nombre [unidad] {alias}`
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** V. **Deps:** HU-17.012. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [render].

### HU-C2.018 — Ejecutar simulación Sync con ROS Master en vivo
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** P. **Deps:** HU-B0.013. **Prioridad:** W. **Tamaño:** L. **Etiquetas:** [ejecucion].

### HU-C2.019 — Ver pin azul en gota sobre estado actual
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** V. **Deps:** HU-B0.018. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [render].

### HU-C2.020 — Ver dots verde-oliva sobre enlaces activos
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** V. **Deps:** HU-B0.017. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [animacion].

### HU-C2.021 — Ver valor estructurado multilínea en rectángulo-valor
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** V. **Deps:** HU-C2.018. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [render].

### HU-C2.022 — Sincronizar modelo con ventana externa Turtlesim/RViz
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** X. **Criterios:** OPM ↔ Turtlesim live. **Deps:** HU-C2.018. **Prioridad:** W. **Tamaño:** L. **Etiquetas:** [sync, turtlesim].

### HU-C2.023 — Ver línea OPL dinámica `está actualmente en estado X`
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** L. **Patrones:** HU-SHARED-007. **Deps:** HU-B0.018. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [opl].

### HU-C2.024 — Ejecutar Headless Runner sin animación
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** P. **Deps:** HU-B0.015. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [headless].

### HU-C2.025 — Abortar o reaccionar a caída del WebSocket
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** L. **Deps:** HU-C2.018. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [error].

### HU-C2.026 — Convertir tipos ROS std_msgs ↔ primitivas OPM
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** K. **Criterios:** mapping bidireccional. **Deps:** HU-C2.007. **Prioridad:** W. **Tamaño:** L. **Etiquetas:** [mapping].

### HU-C2.027 — Replay de rosbag sobre modelo OPM
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** X. **Deps:** HU-C2.018. **Prioridad:** W. **Tamaño:** XL. **Etiquetas:** [rosbag].

### HU-C2.028 — Exportar modelo como ROS launch file
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** X. **Deps:** HU-C2.018. **Prioridad:** W. **Tamaño:** XL. **Etiquetas:** [export].

## 3. Referencias

- Patrones: HU-SHARED-002, HU-SHARED-007.
- Bloqueada por: EPICA-B0, EPICA-B1.
