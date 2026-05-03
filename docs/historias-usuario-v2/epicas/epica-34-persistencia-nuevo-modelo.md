---
epica: "EPICA-34"
titulo: "Persistencia — creación de modelo nuevo (ruta simple + asistente de 12 etapas)"
slug: "persistencia-new-model"
doc_fuente: "opcloud-reverse/34-persistencia-new-model.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "M1"
hu_emitidas: 28
hu_canonicas: 28
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Dos rutas de creación: simple (canvas vacío con SD raíz) y asistente de 12 etapas guiadas por la metodología SSOT [Met §6]. El asistente captura paso a paso: función principal, beneficiario, atributo relevante, handler, nombre del sistema, herramientas, entrada, salida, ambientales. Al cierre, siembra el SD con layout radial pre-poblado y OPL-ES con líneas numeradas.

## 2. HU canónicas

### HU-34.001 — Activar "Nuevo Modelo" desde menú principal
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Punto de entrada simple. **Criterios:** clic crea pestaña con SD vacío. **Modelo:** nuevo `modelo.*`. **Patrones:** HU-SHARED-002. **Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [nuevo, ui].

### HU-34.002 — Activar "Nuevo Modelo" con botón "+" de barra de pestañas
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Atajo en barra de pestañas. **Criterios:** botón "+" crea pestaña. **Deps:** Bloqueada por HU-34.001. **Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [atajo, ui].

### HU-34.003 — Coexistir múltiples pestañas "Modelo (No guardado)"
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Trabajar varios modelos a la vez. **Criterios:** N pestañas con SDs independientes. **Modelo:** múltiples `modelo` en sesión. **Deps:** Bloqueada por HU-34.001. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [pestanas].

### HU-34.004 — Ver pestaña inicial con literal "Modelo (No guardado)"
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** V. **Historia:** Reconocer estado inicial. **Criterios:** texto literal hasta primer guardado (HU-30.005). **Deps:** Bloqueada por HU-34.001. **Prioridad:** M0. **Tamaño:** XS. **Etiquetas:** [render].

### HU-34.005 — Ver árbol OPD inicial con nodo único "SD"
**Actor:** MN. **Tipo:** opm-semantica. **Nivel:** L. **Historia:** El SD es la raíz canónica. **Criterios:** **Dado** modelo nuevo, **cuando** se renderiza, **entonces** existe `opd.nombre = "SD"` y `modelo.opdRaizId` apunta a él. **Modelo:** `modelo.opdRaizId`, `opd.nombre = "SD"`. **Evidencia:** [Met §6], [Glos 3.69]. **Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [kernel, sd].

### HU-34.006 — Ver lienzo OPD vacío tras "Nuevo Modelo"
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** V. **Historia:** Canvas en blanco. **Criterios:** sin apariencias. **Deps:** Bloqueada por HU-34.001. **Prioridad:** M0. **Tamaño:** XS. **Etiquetas:** [canvas, vacio].

### HU-34.007 — Ver panel OPL-ES vacío tras "Nuevo Modelo"
**Actor:** MN. **Tipo:** opm-semantica. **Nivel:** L. **Historia:** Panel sin oraciones. **Criterios:** placeholder "Sin oraciones todavía". **Patrones:** HU-SHARED-007. **Deps:** Bloqueada por HU-34.001. **Evidencia:** [OPL-ES D1]. **Prioridad:** M0. **Tamaño:** XS. **Etiquetas:** [opl, vacio].

### HU-34.008 — Ver biblioteca "Cosas arrastrables" vacía
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Biblioteca lateral vacía. **Criterios:** sin entradas. **Deps:** Bloqueada por HU-34.001. **Prioridad:** M0. **Tamaño:** XS. **Etiquetas:** [biblioteca].

### HU-34.009 — Panear lienzo vacío con cursor "grab"
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Pan funciona aunque vacío. **Criterios:** cursor "grab" + drag. **Deps:** Bloqueada por HU-34.001. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [pan].

### HU-34.010 — Activar "Nuevo Modelo por Asistente"
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Camino guiado. **Criterios:** opción del menú principal abre asistente. **Deps:** Bloqueada por HU-34.001. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [asistente].

### HU-34.011 — Ver modal del asistente con barra de progreso "Etapa N de 12"
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Saber dónde estoy en el flujo. **Criterios:** barra de progreso visible. **Deps:** Bloqueada por HU-34.010. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [progreso, asistente].

### HU-34.012 — Ver etapa "Bienvenida" del asistente
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Pantalla introductoria. **Criterios:** etapa 0 con texto explicativo y botón "Siguiente". **Deps:** Bloqueada por HU-34.011. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [asistente, bienvenida].

### HU-34.013 — Etapa "Función principal" (proceso central)
**Actor:** MN. **Tipo:** opm-semantica. **Nivel:** K. **Historia:** Identificar el proceso principal. **Criterios:** input texto; resultado se persistirá en HU-34.024. **Modelo:** `entidad` proceso central. **Evidencia:** [Glos 3.58], [Met §6 etapa 1]. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [asistente, proceso].

### HU-34.014 — Etapa "Beneficiario"
**Actor:** MN. **Tipo:** opm-semantica. **Nivel:** K. **Historia:** Identificar el beneficiario primario. **Criterios:** input texto. **Modelo:** `entidad` objeto beneficiario. **Evidencia:** [Glos 3.39], [Met §6 etapa 2]. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [asistente, beneficiario].

### HU-34.015 — Etapa "Atributo relevante + estados entrada/salida"
**Actor:** MN. **Tipo:** opm-semantica. **Nivel:** K. **Historia:** Capturar el valor a transformar. **Criterios:** input atributo + estados entrada/salida. **Modelo:** `entidad` atributo + dos `estado.*`. **Evidencia:** [V-1], [Glos 3.71a], [Met §6 etapa 3]. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [atributo, estado].

### HU-34.016 — Etapa "Handler del sistema"
**Actor:** MN. **Tipo:** opm-semantica. **Nivel:** K. **Historia:** Identificar el agente humano. **Criterios:** declarar si beneficiario coincide con handler + agentes adicionales. **Modelo:** `entidad` agente. **Evidencia:** [Glos 3.3], [Met §6 etapa 5]. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [agente, handler].

### HU-34.017 — Etapa "Nombre del sistema"
**Actor:** MN. **Tipo:** opm-semantica. **Nivel:** K. **Historia:** Nombrar el sistema. **Criterios:** input texto. **Modelo:** `modelo.nombre`. **Evidencia:** [Glos 3.69], [Met §6 etapa 6]. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [nombre].

### HU-34.018 — Etapa "Conjunto de herramientas"
**Actor:** MN. **Tipo:** opm-semantica. **Nivel:** K. **Historia:** Identificar instrumentos físicos. **Criterios:** lista de herramientas con marcado físico. **Modelo:** `entidad` instrumentos. **Evidencia:** [V-1], [V-124], [Met §6 etapa 7]. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [instrumento].

### HU-34.019 — Etapa "Entrada principal"
**Actor:** MN. **Tipo:** opm-semantica. **Nivel:** K. **Historia:** Capturar transformados consumidos. **Criterios:** lista de objetos consumidos. **Modelo:** `entidad` + enlaces de consumo. **Evidencia:** [V-239], [V-240], [Met §6 etapa 7]. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [entrada, consumo].

### HU-34.020 — Etapa "Salida principal" con verbo "creates/affects/changes"
**Actor:** MN. **Tipo:** opm-semantica. **Nivel:** K. **Historia:** Capturar resultado/efecto. **Criterios:** lista de objetos resultantes con verbo elegido. **Modelo:** `entidad` + enlaces de resultado/efecto. **Evidencia:** [V-239], [V-240]. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [salida].

### HU-34.021 — Etapa "Objetos ambientales"
**Actor:** MN. **Tipo:** opm-semantica. **Nivel:** K. **Historia:** Marcar cuáles cosas ya ingresadas son ambientales. **Criterios:** checkbox por cosa. **Modelo:** `entidad.afiliacion = "ambiental"` para marcadas. **Evidencia:** [V-1], [Glos 3.5], [Met §6 etapa 9]. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [ambiental].

### HU-34.022 — Navegar hacia atrás con "Anterior" preservando datos
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Ir y volver entre etapas sin perder. **Criterios:** botón "Anterior" preserva inputs. **Patrones:** HU-SHARED-002. **Deps:** Bloqueada por HU-34.011. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [navegacion].

### HU-34.023 — Cancelar asistente desde cualquier etapa
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Salir sin sembrar. **Criterios:** botón "Cancelar" + confirmación si hay datos ingresados. **Deps:** Bloqueada por HU-34.011. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [cancelar].

### HU-34.024 — Confirmar asistente y sembrar SD con layout radial
**Actor:** MN. **Tipo:** mixto. **Nivel:** K primario. **Historia:** Materializar el modelo a partir del asistente. **Criterios:** **Dado** clic en "Llevame al modelo", **cuando** termina, **entonces** se crean entidades, enlaces y apariencias de las 12 etapas en el SD con layout radial. **Modelo:** múltiples `entidad`, `enlace`, `apariencia`. **Patrones:** HU-SHARED-002, HU-SHARED-007. **Deps:** Bloqueada por HU-34.013 a HU-34.021. **Evidencia:** [V-1], [V-61], [V-239]. **Prioridad:** S. **Tamaño:** L. **Etiquetas:** [siembra, asistente].

### HU-34.025 — Ver SD pre-poblado con layout radial "sol"
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** V. **Historia:** Layout inicial inteligente. **Criterios:** proceso central + cosas radialmente alrededor. **Deps:** Bloqueada por HU-34.024. **Prioridad:** S. **Tamaño:** L. **Etiquetas:** [render, layout].

### HU-34.026 — Ver panel OPL-ES pre-poblado con líneas numeradas
**Actor:** MN. **Tipo:** opm-semantica. **Nivel:** L. **Historia:** OPL-ES inmediato. **Criterios:** **Dado** post-asistente, **cuando** OPL-ES emite, **entonces** aparecen oraciones numeradas usando plantillas D1-D4 y T1-T3. **Patrones:** HU-SHARED-007. **Evidencia:** [OPL-ES D1], [OPL-ES T1]. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [opl, asistente].

### HU-34.027 — Ver biblioteca con entradas alfabéticas tras asistente
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Biblioteca poblada. **Criterios:** entradas ordenadas alfabéticamente. **Deps:** Bloqueada por HU-34.024. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [biblioteca].

### HU-34.028 — Continuar modelando post-asistente con estado "No guardado"
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Edición continua. **Criterios:** post-asistente, modelo está en estado dirty (HU-SHARED-006); usuario debe Guardar. **Patrones:** HU-SHARED-006. **Deps:** Bloqueada por HU-34.024. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [continuar].

## 3. Preguntas abiertas

| Q | Pregunta | Bloquea |
|---|---|---|
| Q34.1 | ¿El asistente puede saltar etapas opcionales o todas son obligatorias? | HU-34.013 |
| Q34.2 | Layout radial: ¿algoritmo determinista o force-directed? | HU-34.025 |

## 4. Referencias

- Patrones: HU-SHARED-002, HU-SHARED-006, HU-SHARED-007.
- Bloqueada por: EPICA-30. Bloquea a: EPICA-10/11 (entidades creadas), EPICA-50 (OPL-ES generada).
