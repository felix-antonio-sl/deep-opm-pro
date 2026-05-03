---
epica: "EPICA-18"
titulo: "Canvas — plegado parcial (vista compacta de refinadores intra-rectángulo)"
slug: "canvas-semi-folding"
doc_fuente: "opcloud-reverse/18-canvas-semi-folding.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "S"
hu_emitidas: 15
hu_canonicas: 15
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Modo intermedio entre vista plegada y completamente desplegada de una cosa refinable. El plegado parcial muestra las partes dentro del rectángulo padre sin abrir un OPD nuevo y permite extraer selectivamente. Cambia solo la vista del OPD actual; no crea OPDs hijos ni altera el grafo de refinamiento. Es operativo: las partes plegadas pueden participar en enlaces, y al reinsertar una extraída, los enlaces se redirigen al proxy.

## 2. Tabla de HU

| ID | Título | Actor | Prioridad | Tamaño | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-18.001 | Activar vista plegado parcial desde menú contextual | ME | S | M | mixto | [Glos 3.81] |
| HU-18.002 | Renderizar partes compactadas como lista vertical dentro del padre | MN | S | M | mixto | [Glos 3.81] |
| HU-18.003 | Mostrar badge "tiene partes" en el padre cuando está plegado | MN | S | S | opcloud-ui | — |
| HU-18.004 | Extraer parte del compacto con doble clic | ME | S | M | mixto | [Glos 3.81] |
| HU-18.005 | Mostrar contador de partes ocultas cuando hay extracción parcial | MN | S | S | opcloud-ui | — |
| HU-18.006 | Reinsertar parte extraída con acción sobre el enlace | ME | S | M | mixto | — |
| HU-18.007 | Volver de plegado parcial a plegado completo | MN | S | S | mixto | — |
| HU-18.008 | Conectar enlace desde una parte plegada a otra cosa | ME | S | M | mixto | [V-61] |
| HU-18.009 | Redirigir enlaces al proxy compactado al reinsertar | ME | S | M | mixto | — |
| HU-18.010 | Eco OPL con resumen "y N partes más" | MN | S | S | mixto | — |
| HU-18.011 | Persistir vista por OPD al guardar | ME | S | M | opcloud-ui | — |
| HU-18.012 | Diferenciar plegado parcial de descomposición clásica | ME | S | S | mixto | [Glos 3.31] [Glos 3.81] |
| HU-18.013 | Navegar al OPD desplegado desde el rectángulo plegado | ME | C | S | opcloud-ui | — |
| HU-18.014 | Bloquear plegado parcial cuando la cosa no tiene refinadores | MN | S | XS | opm-semantica | — |
| HU-18.015 | Preservar orden compacto de las partes en plegado parcial | ME | C | S | opcloud-ui | — |

15 canónicas.

## 3. Historias de usuario

### HU-18.001 — Activar vista plegado parcial desde menú contextual

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** V primario; U secundario.
**Historia:** Como modelador experto, quiero activar plegado parcial sobre una cosa refinable para ver sus partes dentro del rectángulo sin cambiar de OPD.
**Criterios:**
- **Dado** una cosa refinable, **cuando** elijo "Plegado parcial", **entonces** `apariencia.modoPlegado = "parcial"` `[propuesta]` y el render se actualiza (HU-18.002).
- **Dado** que el modo es read-only, **cuando** intento activar, **entonces** la acción es no-op.
**Modelo:** `apariencia.modoPlegado: "plegado" | "parcial" | "desplegado"` `[propuesta]`.
**Patrones:** HU-SHARED-001, HU-SHARED-002, HU-SHARED-003.
**Deps:** Bloqueada por HU-12.003 o HU-17.013.
**Evidencia:** [Glos 3.81]. Clase: observado + canonizado.
**Prioridad:** S. **Tamaño:** M. **Etiquetas:** [render, plegado-parcial, refinamiento, propuesta].

---

### HU-18.002 — Renderizar partes compactadas como lista vertical dentro del padre

**Actor primario:** MN. **Tipo:** mixto. **Nivel:** V.
**Historia:** Como modelador, quiero ver las partes apiladas verticalmente dentro del rectángulo padre.
**Criterios:**
- **Dado** plegado parcial activo, **cuando** se renderiza, **entonces** las partes aparecen como filas dentro del rectángulo padre, separadas por línea, con sus nombres.
**Deps:** Bloqueada por HU-18.001.
**Evidencia:** [Glos 3.81]. Clase: observado.
**Prioridad:** S. **Tamaño:** M. **Etiquetas:** [render, plegado-parcial].

---

### HU-18.003 — Mostrar badge "tiene partes" en el padre cuando está plegado

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador, quiero ver un badge cuando un padre tiene partes en plegado completo, para saber que admite plegado parcial.
**Criterios:** badge "▾" o número en esquina; clic activa plegado parcial.
**Deps:** Bloqueada por HU-18.001.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render, badge].

---

### HU-18.004 — Extraer parte del compacto con doble clic

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** V primario; K secundario.
**Historia:** Como modelador experto, quiero extraer una parte del plegado parcial al canvas con doble clic para trabajarla individualmente.
**Criterios:**
- **Dado** parte plegada, **cuando** doble clic, **entonces** se crea `apariencia` independiente para la parte en el OPD actual y se muestra una conexión visual (proxy) al padre.
**Modelo:** nueva `apariencia.entidadId = parte.id`, `apariencia.opdId = opd.id`.
**Patrones:** HU-SHARED-002. **Deps:** Bloqueada por HU-18.002.
**Evidencia:** [Glos 3.81]. Clase: observado.
**Prioridad:** S. **Tamaño:** M. **Etiquetas:** [render, plegado, extraccion].

---

### HU-18.005 — Mostrar contador de partes ocultas cuando hay extracción parcial

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador, quiero saber cuántas partes siguen ocultas cuando algunas están extraídas.
**Criterios:** texto "y N más" al final del bloque plegado.
**Deps:** Bloqueada por HU-18.004.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render, contador].

---

### HU-18.006 — Reinsertar parte extraída con acción sobre el enlace

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** V.
**Historia:** Como modelador experto, quiero reinsertar una parte extraída al plegado para limpieza.
**Criterios:**
- **Dado** una apariencia extraída, **cuando** elijo "Reinsertar", **entonces** la apariencia se elimina y la parte vuelve al stack del padre. Los enlaces que la tocaban se redirigen al proxy (HU-18.009).
**Patrones:** HU-SHARED-002. **Deps:** Bloqueada por HU-18.004.
**Prioridad:** S. **Tamaño:** M. **Etiquetas:** [render, reinsercion].

---

### HU-18.007 — Volver de plegado parcial a plegado completo

**Actor primario:** MN. **Tipo:** mixto. **Nivel:** V.
**Historia:** Como modelador, quiero volver al plegado completo (sin partes visibles) para reducir clutter.
**Criterios:** **Dado** plegado parcial, **cuando** elijo "Plegar completo", **entonces** `apariencia.modoPlegado = "plegado"` y el rectángulo se contrae al tamaño normal.
**Patrones:** HU-SHARED-002. **Deps:** Bloqueada por HU-18.001.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render, plegado].

---

### HU-18.008 — Conectar enlace desde una parte plegada a otra cosa del canvas

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** K primario.
**Historia:** Como modelador experto, quiero conectar enlaces desde una parte plegada a cosas del canvas sin extraerla.
**Criterios:**
- **Dado** parte plegada, **cuando** arrastro enlace desde su fila a otra cosa, **entonces** se crea `enlace` con `origenId = parte.id` y la apariencia del enlace se ancla al rectángulo padre con etiqueta de la parte.
**Modelo:** `enlace.*`. **Patrones:** HU-SHARED-002.
**Deps:** Bloqueada por HU-18.002.
**Evidencia:** [V-61]. Clase: observado.
**Prioridad:** S. **Tamaño:** M. **Etiquetas:** [kernel, enlace, plegado].

---

### HU-18.009 — Redirigir enlaces al proxy compactado al reinsertar parte extraída

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** K.
**Historia:** Como modelador experto, quiero que los enlaces existentes a una parte extraída se redirijan al proxy del rectángulo padre al reinsertar.
**Criterios:** **Dado** parte extraída con N enlaces, **cuando** se reinserta, **entonces** los N enlaces siguen vivos y sus apariencias se reanclan al rectángulo padre con etiqueta de la parte.
**Modelo:** `aparienciaEnlace.vertices` recalculados; `enlace.*` no se altera (referencia por id, no por apariencia).
**Patrones:** HU-SHARED-002.
**Deps:** Bloqueada por HU-18.006.
**Prioridad:** S. **Tamaño:** M. **Etiquetas:** [render, reanclaje].

---

### HU-18.010 — Eco OPL con resumen "y N partes más"

**Actor primario:** MN. **Tipo:** mixto. **Nivel:** L.
**Historia:** Como modelador, quiero que el OPL refleje el plegado parcial sin enumerar todas las partes cuando son muchas.
**Criterios:** **Dado** plegado parcial con N partes, **cuando** OPL emite, **entonces** aparece: `**Padre** consiste en **A**, **B** y N partes más.` (truncado pedagógico).
**Patrones:** HU-SHARED-007.
**Deps:** Bloqueada por HU-18.001.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [opl, plegado].

---

### HU-18.011 — Persistir vista por OPD al guardar

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** P.
**Historia:** Como modelador, quiero que el modo de plegado de cada apariencia se preserve entre sesiones.
**Criterios:** `apariencia.modoPlegado` se persiste en serialización del modelo.
**Deps:** Bloqueada por HU-18.001, HU-30.001.
**Prioridad:** S. **Tamaño:** M. **Etiquetas:** [persistencia, plegado].

---

### HU-18.012 — Diferenciar plegado parcial de descomposición clásica en la elección

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** U.
**Historia:** Como modelador experto, quiero que el menú contextual distinga claramente entre "Descomponer (OPD hijo)" y "Plegado parcial (intra-rectángulo)".
**Criterios:** dos entradas separadas con tooltips explicativos.
**Patrones:** HU-SHARED-001.
**Deps:** Bloqueada por HU-12.002, HU-18.001.
**Evidencia:** [Glos 3.31] descomposición; [Glos 3.81] despliegue.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [ui, distincion].

---

### HU-18.013 — Navegar al OPD desplegado desde el rectángulo plegado

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** L.
**Historia:** Como modelador, quiero un atajo para abrir el OPD del despliegue completo desde el plegado.
**Criterios:** botón "Mostrar despliegue" navega al `OPD: <Padre> desplegado` (HU-17.028).
**Deps:** Bloqueada por HU-17.028, HU-18.001.
**Prioridad:** C. **Tamaño:** S. **Etiquetas:** [navegacion, despliegue].

---

### HU-18.014 — Bloquear plegado parcial cuando la cosa no tiene refinadores

**Actor primario:** MN. **Tipo:** mixto. **Nivel:** K.
**Historia:** Como modelador, quiero que la opción "Plegado parcial" no aparezca cuando la cosa no tiene partes definidas.
**Criterios:** **Dado** una cosa sin partes, **cuando** abro menú contextual, **entonces** "Plegado parcial" no está disponible.
**Modelo:** validación sobre `entidad` y enlaces de exhibición/agregación.
 **Patrones:** HU-SHARED-001 (mecánica detectada por audit-hu.mjs). **Deps:** Bloqueada por HU-18.001.
**Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [validacion, plegado].

---

### HU-18.015 — Preservar orden compacto de las partes en plegado parcial

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador experto, quiero un orden estable de las partes en el plegado para no perder orientación.
**Criterios:** **Dado** plegado parcial activado, **cuando** se renderiza, **entonces** el orden es alfabético por defecto, configurable a "orden de creación".
**Modelo:** `apariencia.ordenPartes: "alfabetico" | "creacion"` `[propuesta]`.
**Deps:** Bloqueada por HU-18.001.
**Prioridad:** C. **Tamaño:** S. **Etiquetas:** [render, orden].

---

## 4. Preguntas abiertas

| Código | Pregunta | Bloquea |
|---|---|---|
| Q18.1 | ¿El plegado parcial admite anidamiento (parte plegada con sus propias partes)? | HU-18.001 |
| Q18.2 | ¿Cuántas partes son "muchas" para activar el truncado "y N más"? | HU-18.010 |

## 5. Referencias cruzadas

- Patrones: HU-SHARED-001, HU-SHARED-002, HU-SHARED-003, HU-SHARED-007.
- Bloqueada por: EPICA-12 (descomposición), EPICA-17 (despliegue).
- Bloquea a: EPICA-30 (persistencia con modoPlegado).
