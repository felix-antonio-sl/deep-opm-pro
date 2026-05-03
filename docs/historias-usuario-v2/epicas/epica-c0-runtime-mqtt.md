---
epica: "EPICA-C0"
titulo: "Runtime — integración MQTT (broker, tópicos, Publish/Subscribe, gemelo digital)"
slug: "runtime-mqtt"
doc_fuente: "opcloud-reverse/c0-runtime-mqtt.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "W"
hu_emitidas: 22
hu_canonicas: 22
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Integración con broker MQTT como categoría de proceso computacional. Configuración server/port, conexión WebSocket, gemelo digital con sufijo `_digitaltwin`, modos Publish/Subscribe, binding por proceso con tópico y mensaje. Live data en simulación. Toda la épica es `W` (requiere infraestructura externa).

## 2. HU canónicas

### HU-C0.001 — Configurar server y port MQTT en "External Connections Settings"
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** C. **Modelo:** `org.mqtt.server`, `org.mqtt.port`. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [config, mqtt].

### HU-C0.002 — Aplicar defaults `localhost:9883`
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** C. **Deps:** HU-C0.001. **Prioridad:** W. **Tamaño:** XS. **Etiquetas:** [defaults].

### HU-C0.003 — Ver botón MQTT en toolbar con tooltip de estado
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** estado: connected/disconnected. **Prioridad:** W. **Tamaño:** XS. **Etiquetas:** [toolbar].

### HU-C0.004 — Abrir conexión MQTT con clic en toggle
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** abre WebSocket. **Deps:** HU-C0.003. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [conexion].

### HU-C0.005 — Ver toast "Conexión MQTT establecida"
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-C0.004. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [feedback].

### HU-C0.006 — Cambiar color del botón cuando conectado
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** V. **Deps:** HU-C0.004. **Prioridad:** W. **Tamaño:** XS. **Etiquetas:** [render].

### HU-C0.007 — Cerrar conexión con clic de nuevo
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** P. **Deps:** HU-C0.004. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [conexion].

### HU-C0.008 — Toast "Conexión MQTT desconectada"
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-C0.007. **Prioridad:** W. **Tamaño:** XS. **Etiquetas:** [feedback].

### HU-C0.009 — Declarar gemelo digital con sufijo `_digitaltwin`
**Actor:** IR. **Tipo:** mixto. **Nivel:** K. **Historia:** Cosa que representa contraparte real. **Criterios:** sufijo en `entidad.nombre`. **Modelo:** `entidad.gemeloDigitalDe`. **Evidencia:** [Met §MQ-1]. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [gemelo-digital].

### HU-C0.010 — Ver oración OPL "es el gemelo digital de X"
**Actor:** IR. **Tipo:** mixto. **Nivel:** L. **Patrones:** HU-SHARED-007. **Evidencia:** [Met §MQ-1]. **Deps:** HU-C0.009. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [opl].

### HU-C0.011 — Seleccionar categoría MQTT en menú de proceso computacional
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** L. **Deps:** HU-B1.008. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [categoria].

### HU-C0.012 — Ver firma `( )` en proceso MQTT
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** V. **Deps:** HU-C0.011. **Prioridad:** W. **Tamaño:** XS. **Etiquetas:** [render].

### HU-C0.013 — Abrir popup de binding MQTT
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-C0.011. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [binding].

### HU-C0.014 — Elegir modo Publish o Subscribe
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** L. **Modelo:** `entidad.mqttModo`. **Deps:** HU-C0.013. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [modo].

### HU-C0.015 — Configurar tópico MQTT
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** input texto con sintaxis `/path/topic`. **Modelo:** `entidad.mqttTopico`. **Deps:** HU-C0.013. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [topico].

### HU-C0.016 — Configurar mensaje con alias de objeto
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** template con `${alias}`. **Deps:** HU-C0.013. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [mensaje].

### HU-C0.017 — Confirmar binding con "Update"
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** P. **Patrones:** HU-SHARED-002. **Deps:** HU-C0.013. **Prioridad:** W. **Tamaño:** XS. **Etiquetas:** [guardar].

### HU-C0.018 — Ver `value` mutar al recibir Subscribe
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** V. **Criterios:** payload llega → `valueSlot.valor` se actualiza. **Deps:** HU-C0.014. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [tiempo-real, subscribe].

### HU-C0.019 — Ver `value` mutar al enviar Publish
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** V. **Criterios:** valor enviado se refleja localmente. **Deps:** HU-C0.014. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [publish].

### HU-C0.020 — Ejecutar simulación MQTT en modo Sync obligatorio
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** K. **Criterios:** Async no soportado para MQTT (Q). **Deps:** HU-B0.013. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [sync].

### HU-C0.021 — Descargar WebSocket server de referencia
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** X. **Criterios:** link a binario en panel "Manuals". **Prioridad:** W. **Tamaño:** XS. **Etiquetas:** [referencia].

### HU-C0.022 — Persistir binding MQTT al guardar el modelo
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** `entidad.mqtt*` parte del JSON. **Evidencia:** [Met §11 #6]. **Deps:** HU-30.008. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [persistencia].

## 3. Referencias

- Patrones: HU-SHARED-002, HU-SHARED-007.
- Bloqueada por: EPICA-B0, EPICA-B1, EPICA-30, EPICA-80.
