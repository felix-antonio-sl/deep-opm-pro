---
epica: "EPICA-16"
titulo: "Canvas — enlaces: propiedades, Tabla de Enlaces y estilo"
slug: "canvas-enlaces-propiedades"
doc_fuente: "opcloud-reverse/16-canvas-enlaces-propiedades.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "M1"
hu_emitidas: 22
hu_canonicas: 17
hu_stubs: 5
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Edición fina de enlaces ya creados: Tabla de Enlaces global del modelo (lista tabular), panel de propiedades por selección, edición de multiplicidad de origen/destino, etiqueta canónica, y panel de estilo (color, grosor, patrón) con copiar/pegar/restablecer. Asume creación en EPICA-10/15.

## 2. Tabla de HU

| ID | Título | Actor | Prioridad | Tamaño | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-16.001 | Abrir Tabla de Enlaces global del modelo | ME | M1 | M | opcloud-ui | [V-61] |
| HU-16.002 | Listar todos los enlaces del modelo en la tabla | ME | M1 | S | opcloud-ui | [V-61] |
| HU-16.003 | Mostrar columnas origen, destino, tipo, etiqueta, multiplicidad | ME | M1 | S | opcloud-ui | [V-61] [Glos 3.60] |
| HU-16.004 | Filtrar Tabla de Enlaces por tipo de enlace | ME | S | S | opcloud-ui | [V-239] |
| HU-16.005 | Ordenar Tabla de Enlaces por columna | ME | S | S | opcloud-ui | — |
| HU-16.006 | Navegar al enlace del canvas haciendo clic desde la tabla | ME | M1 | S | opcloud-ui | [V-61] |
| HU-16.007 | Editar propiedades de enlace desde la Tabla de Enlaces | ME | S | M | mixto | [V-61] [Glos 3.60] |
| HU-16.008 | Abrir panel de propiedades [absorbida en HU-11.013] | — | — | — | — | — |
| HU-16.009 | Editar etiqueta del enlace [absorbida en HU-11.014] | — | — | — | — | — |
| HU-16.010 | Seleccionar etiqueta canónica de lista (controla, se relaciona con, se comunica vía) | MN | M1 | S | opm-semantica | [V-239] |
| HU-16.011 | Editar multiplicidad de origen [absorbida en HU-15.002] | — | — | — | — | — |
| HU-16.012 | Elegir multiplicidad canónica (1, 0..1, N, 0..N, custom) | ME | M1 | S | opm-semantica | [V-61] [Glos 3.60] |
| HU-16.013 | Ingresar multiplicidad custom con validación | ME | M1 | M | opm-semantica | [V-61] [Glos 3.60] |
| HU-16.014 | Editar multiplicidad de destino con selector análogo | ME | M1 | S | opm-semantica | [V-61] [Glos 3.60] |
| HU-16.015 | Abrir Panel de Estilo de un enlace | ME | S | S | opcloud-ui | — |
| HU-16.016 | Cambiar color del enlace desde Panel de Estilo | ME | S | S | opcloud-ui | — |
| HU-16.017 | Cambiar grosor del enlace | ME | S | S | opcloud-ui | — |
| HU-16.018 | Cambiar patrón del enlace (sólido, discontinuo, punteado) | ME | S | S | opcloud-ui | — |
| HU-16.019 | Copiar estilo de un enlace [absorbida en HU-14.013] | — | — | — | — | — |
| HU-16.020 | Pegar estilo en otro enlace [absorbida en HU-14.014] | — | — | — | — | — |
| HU-16.021 | Restablecer estilo por defecto | ME | S | XS | opcloud-ui | — |
| HU-16.022 | Aplicar estilo a todos los enlaces similares | ME | S | M | opcloud-ui | — |

18 canónicas, 4 stubs.

## 3. Historias de usuario

### HU-16.001 — Abrir Tabla de Enlaces global del modelo

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** L primario; U secundario.
**Historia:** Como modelador experto, quiero abrir una tabla con todos los enlaces del modelo para auditar y editar masivamente.
**Criterios:**
- **Dado** que invoco "Tabla de Enlaces" desde menú, **cuando** la acción termina, **entonces** se abre un panel modal con tabla de filas (uno por enlace) y columnas (HU-16.003).
**Modelo:** lente derivada de `modelo.enlaces`. **Patrones:** HU-SHARED-008.
**Deps:** Bloqueada por HU-10.011.
**Evidencia:** [V-61]. Clase: observado.
**Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [ui, enlace, tabla, lente].

---

### HU-16.002 — Listar todos los enlaces del modelo en la tabla

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** L.
**Historia:** Como modelador, quiero ver una fila por cada enlace existente del modelo (no del OPD activo) para tener vista global.
**Criterios:** **Dado** la tabla abierta, **cuando** se renderiza, **entonces** las filas son `Object.values(modelo.enlaces)`.
**Patrones:** HU-SHARED-008. **Deps:** Bloqueada por HU-16.001.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [ui, lente].

---

### HU-16.003 — Mostrar columnas origen, destino, tipo, etiqueta, multiplicidad

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** L.
**Historia:** Como modelador, quiero ver columnas claras para auditar relaciones.
**Criterios:** la tabla tiene columnas: Origen (nombre), Destino (nombre), Tipo (consumo, agente, ...), Etiqueta, Multiplicidad origen, Multiplicidad destino.
**Deps:** Bloqueada por HU-16.002.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [ui, tabla, columna].

---

### HU-16.004 — Filtrar Tabla de Enlaces por tipo de enlace

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** L.
**Historia:** Como modelador, quiero filtrar por tipo (consumo, agente, agregación...) para enfocarme.
**Criterios:** dropdown "Filtro por tipo" con valores derivados de `enlace.tipo`.
**Deps:** Bloqueada por HU-16.001.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [ui, filtro].

---

### HU-16.005 — Ordenar Tabla de Enlaces por columna

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** L.
**Historia:** Como modelador, quiero ordenar por cualquier columna para encontrar relaciones.
**Criterios:** clic en encabezado alterna asc/desc; orden case-insensitive para texto.
**Deps:** Bloqueada por HU-16.001.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [ui, ordenar].

---

### HU-16.006 — Navegar al enlace del canvas haciendo clic desde la tabla

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** L primario; U secundario.
**Historia:** Como modelador, quiero saltar al canvas y al OPD donde el enlace tiene apariencia para inspeccionarlo.
**Criterios:**
- **Dado** clic en una fila, **cuando** la acción termina, **entonces** el canvas cambia al primer OPD donde el enlace tiene `aparienciaEnlace`, se hace zoom-fit y la apariencia se selecciona (HU-SHARED-008).
**Patrones:** HU-SHARED-008. **Deps:** Bloqueada por HU-16.001.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [navegacion, ui].

---

### HU-16.007 — Editar propiedades de enlace desde la Tabla de Enlaces

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** K primario.
**Historia:** Como modelador, quiero editar etiqueta y multiplicidad in situ en la tabla, sin abrir el panel de propiedades.
**Criterios:**
- **Dado** clic doble en celda editable, **cuando** ingreso valor y confirmo, **entonces** la propiedad se actualiza.
**Modelo:** `enlace.*`. **Patrones:** HU-SHARED-002, HU-SHARED-007.
**Deps:** Bloqueada por HU-16.003.
**Prioridad:** S. **Tamaño:** M. **Etiquetas:** [ui, edicion, batch].

---

### HU-16.008 — Abrir panel de propiedades [absorbida en HU-11.013]

**Estado:** absorbida (2026-05-03). **Canónica:** HU-11.013.

---

### HU-16.009 — Editar etiqueta del enlace [absorbida en HU-11.014]

**Estado:** absorbida (2026-05-03). **Canónica:** HU-11.014.

---

### HU-16.010 — Seleccionar etiqueta canónica de lista

**Actor primario:** MN. **Tipo:** opm-semantica. **Nivel:** K.
**Historia:** Como modelador, quiero elegir entre etiquetas canónicas (controla, se relaciona con, se comunica vía) para enlaces estructurales etiquetados, en lugar de escribir.
**Criterios:**
- **Dado** un enlace estructural etiquetado, **cuando** abro selector, **entonces** veo lista canónica de etiquetas + opción "Personalizada".
- **Dado** elijo canónica, **cuando** confirmo, **entonces** OPL-ES emite con esa etiqueta.
**Modelo:** `enlace.etiqueta`. **Patrones:** HU-SHARED-007.
**Deps:** Bloqueada por HU-11.014.
**Evidencia:** [V-239]. Clase: confirmado.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [kernel, etiqueta, canonica].

---

### HU-16.011 — Editar multiplicidad de origen [absorbida en HU-15.002]

**Estado:** absorbida (2026-05-03). **Canónica:** HU-15.002.

---

### HU-16.012 — Elegir multiplicidad canónica (1, 0..1, N, 0..N, custom)

**Actor primario:** ME. **Tipo:** opm-semantica. **Nivel:** K.
**Historia:** Como modelador experto, quiero elegir multiplicidad canónica de un selector con valores predefinidos.
**Criterios:** **Dado** selector "Multiplicidad", **cuando** elijo "0..N", **entonces** `enlace.multiplicidadOrigen = "0..N"` y OPL-ES se actualiza.
**Modelo:** `enlace.multiplicidadOrigen` `[propuesta]`.
**Patrones:** HU-SHARED-007. **Deps:** Bloqueada por HU-15.002.
**Evidencia:** [Glos 3.60]. Clase: confirmado.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [kernel, multiplicidad].

---

### HU-16.013 — Ingresar multiplicidad custom con validación

**Actor primario:** ME. **Tipo:** opm-semantica. **Nivel:** K.
**Historia:** Como modelador experto, quiero ingresar multiplicidad libre con validación de sintaxis.
**Criterios:**
- **Dado** elijo "Custom" en HU-16.012, **cuando** ingreso `5..10`, **entonces** la sintaxis se valida (regex `^\d+(\.\.\d+|\.\.\*)?$|^\*$`).
- **Dado** ingreso inválido, **cuando** confirmo, **entonces** la operación falla con mensaje específico.
**Modelo:** `enlace.multiplicidadOrigen`.
**Patrones:** HU-SHARED-009 (validación). **Deps:** Bloqueada por HU-16.012.
**Evidencia:** [Glos 3.60]. Clase: confirmado.
**Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [kernel, multiplicidad, validacion].

---

### HU-16.014 — Editar multiplicidad de destino con selector análogo

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** K.
**Historia:** Idéntica a HU-16.012 con scope `enlace.multiplicidadDestino`.
**Modelo:** `enlace.multiplicidadDestino` `[propuesta]`.
**Deps:** Bloqueada por HU-15.002.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [kernel, multiplicidad, destino].

---

### HU-16.015 — Abrir Panel de Estilo de un enlace

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** U.
**Historia:** Como modelador, quiero abrir un panel dedicado al estilo del enlace.
**Criterios:** desde menú contextual o doble clic en enlace.
 **Patrones:** HU-SHARED-001 (mecánica detectada por audit-hu.mjs). **Deps:** Bloqueada por HU-11.013.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [ui, estilo].

---

### HU-16.016 — Cambiar color del enlace desde Panel de Estilo

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador, quiero cambiar color desde el panel.
**Criterios:** ver HU-11.016. **Modelo:** `enlace.estilo.color`.
**Deps:** Bloqueada por HU-16.015.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render, color].

---

### HU-16.017 — Cambiar grosor del enlace

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador, quiero ajustar grosor (1-6px).
**Criterios:** `enlace.estilo.strokeWidth`. Wrapper se mantiene en 15px. [JOYAS §4]
**Deps:** Bloqueada por HU-16.015.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render, grosor].

---

### HU-16.018 — Cambiar patrón del enlace (sólido, discontinuo, punteado)

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador, quiero cambiar el patrón de trazo.
**Criterios:** ver HU-14.012. **Modelo:** `enlace.estilo.dashArray`.
**Deps:** Bloqueada por HU-16.015.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render, patron].

---

### HU-16.019 — Copiar estilo de un enlace [absorbida en HU-14.013]

**Estado:** absorbida (2026-05-03). **Canónica:** HU-14.013.

---

### HU-16.020 — Pegar estilo en otro enlace [absorbida en HU-14.014]

**Estado:** absorbida (2026-05-03). **Canónica:** HU-14.014.

---

### HU-16.021 — Restablecer estilo por defecto

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador, quiero restablecer estilo del enlace al default.
**Criterios:** `enlace.estilo = {}`. [JOYAS §1, §4]
**Patrones:** HU-SHARED-002. **Deps:** Bloqueada por HU-16.015.
**Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [render, reset].

---

### HU-16.022 — Aplicar estilo a todos los enlaces similares (Apply to all similar)

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador, quiero aplicar el estilo de un enlace a todos los del mismo tipo en el modelo.
**Criterios:**
- **Dado** un enlace con estilo X y `enlace.tipo = "agente"`, **cuando** elijo "Aplicar a similares", **entonces** todos los enlaces de tipo "agente" del modelo adoptan el estilo X (una sola operación de undo).
**Modelo:** N × `enlace.estilo`. **Patrones:** HU-SHARED-002, HU-SHARED-003.

**Deps:** Bloqueada por HU-16.015.
**Prioridad:** S. **Tamaño:** M. **Etiquetas:** [render, batch, estilo].

---

## 4. Preguntas abiertas

| Código | Pregunta | Bloquea |
|---|---|---|
| Q16.1 | Lista canónica completa de etiquetas (más allá de "controla", "se relaciona con", "se comunica vía"). | HU-16.010 |
| Q16.2 | "Apply to all similar": ¿"similar" se define por tipo, por etiqueta, o por ambos? | HU-16.022 |
| Q16.3 | Edición in-place en tabla: ¿qué celdas son editables y cuáles read-only? | HU-16.007 |

## 5. Referencias cruzadas

- Patrones: HU-SHARED-002, HU-SHARED-007, HU-SHARED-008.
- Bloqueada por: EPICA-10, EPICA-11, EPICA-15.
