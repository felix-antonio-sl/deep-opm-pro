---
epica: "EPICA-C1"
titulo: "Runtime — URL externas (HTTP/REST) como categoría ejecutable"
slug: "runtime-urls"
doc_fuente: "opcloud-reverse/c1-runtime-urls.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "W"
hu_emitidas: 26
hu_canonicas: 26
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Procesos categoria "External": ejecutan fetch HTTP a URLs configuradas en objeto-punto-de-acceso. Mini-editor URL/Parámetros, parseo de respuesta JSON, sincronización en OPL pane. Toda la épica es `W` (requiere CORS y backend coordination).

## 2. HU canónicas

### HU-C1.001 — Activar categoría External en proceso computacional
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** L. **Deps:** HU-B1.008. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [external].

### HU-C1.002 — Marcar proceso External con sufijo `()` en nombre
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** V. **Deps:** HU-C1.001. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [render].

### HU-C1.003 — Portar URL literal en objeto string-valued
**Actor:** IR. **Tipo:** mixto. **Nivel:** K. **Modelo:** `entidad.urlLiteral` `[propuesta]`. **Evidencia:** [Glos 3.39]. **Deps:** HU-B1.001. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [url].

### HU-C1.004 — Asignar alias al objeto-punto-de-acceso
**Actor:** IR. **Tipo:** mixto. **Nivel:** K. **Deps:** HU-17.007. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [alias].

### HU-C1.005 — Ver línea OPL del objeto-punto-de-acceso con URL literal
**Actor:** IR. **Tipo:** mixto. **Nivel:** L. **Patrones:** HU-SHARED-007. **Evidencia:** [OPL-ES]. **Deps:** HU-C1.003. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [opl].

### HU-C1.006 — Abrir mini-editor URL/Parámetros inline sobre canvas
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-C1.001. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [editor].

### HU-C1.007 — Configurar campo URL con alias del objeto-punto-de-acceso
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** P. **Deps:** HU-C1.006. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [url].

### HU-C1.008 — Declarar pares query-key/alias en campo Parameters
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** P. **Deps:** HU-C1.006. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [parametros].

### HU-C1.009 — Confirmar mini-editor con "Update"
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** P. **Patrones:** HU-SHARED-002. **Deps:** HU-C1.006. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [guardar].

### HU-C1.010 — Conectar objeto-punto-de-acceso al proceso External como Instrumento
**Actor:** IR. **Tipo:** opm-semantica. **Nivel:** K. **Evidencia:** [V-239], [V-240]. **Deps:** HU-11.009. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [enlace].

### HU-C1.011 — Aplicar modificador `c` al habilitador condicional
**Actor:** IR. **Tipo:** opm-semantica. **Nivel:** K. **Evidencia:** [V-239], [V-61]. **Deps:** HU-B4.001. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [condicion].

### HU-C1.012 — Separar fetch (External) de parse (code inline)
**Actor:** IR. **Tipo:** mixto. **Nivel:** K. **Historia:** Patrón de dos procesos. **Deps:** HU-C1.001. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [patron].

### HU-C1.013 — Abrir editor para cuerpo JS del proceso External
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-B2.002. **Prioridad:** W. **Tamaño:** L. **Etiquetas:** [editor].

### HU-C1.014 — Preservar separador runtime inmutable
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** P. **Criterios:** ver HU-B5.005. **Deps:** HU-C1.013. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [proteccion].

### HU-C1.015 — Inyectar `aliasArr` auto-generado pre-ejecución
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** K. **Criterios:** array de aliases disponibles. **Deps:** HU-C1.013. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [runtime].

### HU-C1.016 — Ejecutar `fetch` HTTP y recibir payload JSON
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** X. **Deps:** HU-C1.013. **Prioridad:** W. **Tamaño:** L. **Etiquetas:** [http, fetch].

### HU-C1.017 — Expandir rectángulo-valor JSON con payload completo
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** V. **Deps:** HU-C1.016. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [render, json].

### HU-C1.018 — Renderizar valor final como disyunción literal
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** V. **Criterios:** `A or B or C` cuando hay opciones. **Deps:** HU-C1.016. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [render].

### HU-C1.019 — Sincronizar OPL pane con valores runtime
**Actor:** IR. **Tipo:** mixto. **Nivel:** L. **Patrones:** HU-SHARED-007. **Evidencia:** [OPL-ES]. **Deps:** HU-C1.016. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [opl].

### HU-C1.020 — Marcar estado activo con punto verde transitorio
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** V. **Deps:** HU-B0.018. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [render].

### HU-C1.021 — Preservar URL literal como configuración no sorteable
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** P. **Deps:** HU-C1.003. **Prioridad:** W. **Tamaño:** XS. **Etiquetas:** [config].

### HU-C1.022 — Advertir punto de acceso inalcanzable
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** ping al modelo, marcar inalcanzable. **Deps:** HU-C1.016. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [error].

### HU-C1.023 — Auditar modelo verificando enlaces por lote
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** L. **Deps:** HU-C1.022. **Prioridad:** W. **Tamaño:** L. **Etiquetas:** [auditoria].

### HU-C1.024 — Registrar historia de respuestas HTTP por run
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** P. **Deps:** HU-C1.016. **Prioridad:** W. **Tamaño:** L. **Etiquetas:** [historial].

### HU-C1.025 — Modelar autenticación HTTP (headers, Authorization)
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** X. **Deps:** HU-C1.016. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [auth].

### HU-C1.026 — Reabrir mini-editor para edición posterior
**Actor:** IR. **Tipo:** opcloud-ui. **Nivel:** U. **Deps:** HU-C1.006. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [reabrir].

## 3. Referencias

- Patrones: HU-SHARED-002, HU-SHARED-007.
- Bloqueada por: EPICA-B1, EPICA-B2, EPICA-B4.
