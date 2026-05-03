---
epica: "EPICA-14"
titulo: "Canvas — estilado visual de cosas, texto y enlaces"
slug: "canvas-styling"
doc_fuente: "opcloud-reverse/14-canvas-styling.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "C"
hu_emitidas: 17
hu_canonicas: 15
hu_stubs: 2
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Capa de apariencia manual que OPCloud expone sobre cada elemento del canvas: tipografía, colores, grosor de enlaces, alineación del rótulo, copia/pegado de estilo y reset al default. La separación semántica/apariencia es invariante: cambiar estilo no altera OPL ni kernel OPM. La SSOT [V-63] establece que los colores son informativos, no normativos. Los valores concretos de [JOYAS] son convención OPCloud, no mandato.

## 2. Tabla de HU

| ID | Título | Actor | Prioridad | Tamaño | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-14.001 | Mostrar grupo Style en toolbar al seleccionar cosa | ME | S | S | opcloud-ui | — |
| HU-14.002 | Cambiar color de relleno de una cosa con paleta | ME | S | S | opcloud-ui | [V-63] [JOYAS §1] |
| HU-14.003 | Cambiar color de borde de una cosa con paleta | ME | S | S | opcloud-ui | [V-63] [JOYAS §1] |
| HU-14.004 | Cambiar familia tipográfica del rótulo | ME | C | S | opcloud-ui | [JOYAS §3] |
| HU-14.005 | Cambiar tamaño de tipografía del rótulo | ME | C | XS | opcloud-ui | [JOYAS §3] |
| HU-14.006 | Cambiar peso/estilo tipográfico (negrita, cursiva) | ME | C | XS | opcloud-ui | [JOYAS §3] |
| HU-14.007 | Cambiar color del texto del rótulo | ME | C | XS | opcloud-ui | [V-63] [JOYAS §3] |
| HU-14.008 | Cambiar alineación del texto del rótulo | ME | C | XS | opcloud-ui | — |
| HU-14.009 | Activar posicionamiento manual de texto con ejes X/Y | ME | C | S | opcloud-ui | — |
| HU-14.010 | Cambiar color de un enlace [absorbida en HU-11.016] | — | — | — | — | — |
| HU-14.011 | Cambiar grosor de un enlace [absorbida en HU-11.016] | — | — | — | — | — |
| HU-14.012 | Cambiar patrón de trazo de un enlace | ME | C | S | opcloud-ui | [V-1] |
| HU-14.013 | Copiar estilo de un enlace (Copy Style) | ME | S | S | opcloud-ui | — |
| HU-14.014 | Pegar estilo copiado en otro enlace | ME | S | S | opcloud-ui | — |
| HU-14.015 | Resetear estilo de una cosa al defecto | ME | M1 | S | opcloud-ui | [V-63] |
| HU-14.016 | Aplicar estilo a varias cosas por multi-selección | ME | C | M | opcloud-ui | — |
| HU-14.017 | Persistir overrides de estilo junto al modelo (sin eco OPL) | ME | S | M | opcloud-ui | [V-63] |

15 canónicas, 2 stubs.

## 3. Historias de usuario

### HU-14.001 — Mostrar grupo "Style" en toolbar al seleccionar cosa

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** U.
**Historia:** Como modelador experto, quiero ver un grupo "Style" en la toolbar contextual al seleccionar una cosa para acceder rápidamente a opciones de estilado.
**Criterios:** **Dado** una cosa seleccionada, **cuando** la toolbar contextual aparece, **entonces** un grupo "Style" agrupa fill, border, fuente, alineación, reset.
**Modelo:** UI transitoria. **Patrones:** HU-SHARED-008.
**Deps:** Bloqueada por HU-SHARED-008.
**Evidencia:** Clase: observado.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [canvas, ui, toolbar, estilo].

---

### HU-14.002 — Cambiar color de relleno de una cosa con paleta

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V primario.
**Historia:** Como modelador, quiero cambiar el color de relleno de una cosa eligiendo de una paleta.
**Criterios:**
- **Dado** una cosa seleccionada, **cuando** elijo color en paleta, **entonces** `apariencia.estilo.fill = #color` `[propuesta]` y el render se actualiza.
- **Dado** el cambio, **cuando** OPL-ES se consulta, **entonces** la oración no cambia (estilo no altera semántica).
**Modelo:** `apariencia.estilo.fill` `[propuesta]`. **Patrones:** HU-SHARED-002.
**Deps:** Bloqueada por HU-14.001.
**Evidencia:** [V-63], [JOYAS §1]. Clase: observado.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render, estilo, fill, propuesta].

---

### HU-14.003 — Cambiar color de borde de una cosa con paleta

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V primario.
**Historia:** Como modelador, quiero cambiar el color del borde de una cosa preservando la semántica de afiliación (continuo/discontinuo).
**Criterios:**
- **Dado** una cosa con `afiliacion = "ambiental"`, **cuando** cambio color de borde, **entonces** se actualiza `apariencia.estilo.borderColor` pero el patrón discontinuo se preserva.
- **Dado** el cambio, **cuando** OPL-ES se consulta, **entonces** la oración no cambia.
**Modelo:** `apariencia.estilo.borderColor` `[propuesta]`. **Patrones:** HU-SHARED-002.
**Deps:** Bloqueada por HU-14.001.
**Evidencia:** [V-63], [JOYAS §1]. Clase: observado.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render, estilo, borde].

---

### HU-14.004 — Cambiar familia tipográfica del rótulo

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V primario.
**Historia:** Como modelador, quiero cambiar la familia tipográfica del rótulo (Arial, Times, Courier, ...).
**Criterios:**
- **Dado** una cosa seleccionada, **cuando** elijo fuente, **entonces** `apariencia.estilo.fontFamily` se actualiza y el render usa `getParagraphWidth`/`getParagraphHeight` para reescalar la caja.
**Modelo:** `apariencia.estilo.fontFamily` `[propuesta]`. **Patrones:** HU-SHARED-002.
**Deps:** Bloqueada por HU-14.001.
**Evidencia:** [JOYAS §3]. Clase: observado.
**Prioridad:** C. **Tamaño:** S. **Etiquetas:** [render, tipografia].

---

### HU-14.005 — Cambiar tamaño de tipografía del rótulo

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador, quiero cambiar el tamaño de tipografía del rótulo entre 8px y 24px.
**Criterios:** ajusta `apariencia.estilo.fontSize`. La caja se reescala vía `refactorText`. [JOYAS §3]
**Modelo:** `apariencia.estilo.fontSize` `[propuesta]`. **Patrones:** HU-SHARED-002.
**Deps:** Bloqueada por HU-14.001.
**Evidencia:** [JOYAS §3]. Clase: observado.
**Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [render, tipografia, tamano].

---

### HU-14.006 — Cambiar peso/estilo tipográfico (negrita, cursiva)

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador, quiero alternar negrita y cursiva del rótulo.
**Criterios:** ajusta `apariencia.estilo.fontWeight` y `fontStyle`. Cuidado: la convención SSOT usa cursiva para procesos en OPL; en canvas el styling es libre.
**Modelo:** `apariencia.estilo.fontWeight`, `apariencia.estilo.fontStyle` `[propuesta]`.
**Deps:** Bloqueada por HU-14.001.
**Evidencia:** Clase: observado.
**Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [render, tipografia, peso].

---

### HU-14.007 — Cambiar color del texto del rótulo

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador, quiero cambiar el color del rótulo manteniendo legibilidad.
**Criterios:** ajusta `apariencia.estilo.textColor`. [V-63]
**Modelo:** `apariencia.estilo.textColor` `[propuesta]`.
**Deps:** Bloqueada por HU-14.001.
**Evidencia:** [V-63], [JOYAS §3]. Clase: observado.
**Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [render, texto, color].

---

### HU-14.008 — Cambiar alineación del texto del rótulo

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador, quiero alinear el rótulo a izquierda, centro o derecha.
**Criterios:** ajusta `apariencia.estilo.textAnchor`. Default: middle. [JOYAS §3]
**Modelo:** `apariencia.estilo.textAnchor` `[propuesta]`.
**Deps:** Bloqueada por HU-14.001.
**Evidencia:** [JOYAS §3]. Clase: observado.
**Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [render, texto, alineacion].

---

### HU-14.009 — Activar posicionamiento manual de texto con ejes X/Y

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador experto, quiero posicionar manualmente el texto del rótulo dentro de la cosa con offsets X/Y.
**Criterios:** `apariencia.estilo.textOffsetX` y `textOffsetY`. La operación se desactiva por default.
**Modelo:** `apariencia.estilo.textOffsetX/Y` `[propuesta]`.
**Deps:** Bloqueada por HU-14.001.
**Evidencia:** Clase: observado.
**Prioridad:** C. **Tamaño:** S. **Etiquetas:** [render, texto, posicionamiento, requires-clarification].

---

### HU-14.010 — Cambiar color de un enlace [absorbida en HU-11.016]

**Estado:** absorbida (2026-05-03). **Canónica:** HU-11.016.

---

### HU-14.011 — Cambiar grosor de un enlace [absorbida en HU-11.016]

**Estado:** absorbida (2026-05-03). **Canónica:** HU-11.016.

---

### HU-14.012 — Cambiar patrón de trazo de un enlace (sólido, discontinuo, punteado)

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador experto, quiero cambiar el patrón de trazo de un enlace para distinciones visuales finas.
**Criterios:** `enlace.estilo.dashArray`. Importante: el patrón no debe romper convenciones SSOT (ej. enlace ambiental sigue siendo discontinuo).
**Modelo:** `enlace.estilo.dashArray` `[propuesta]`.
**Deps:** Bloqueada por HU-11.016.
**Evidencia:** [V-1]. Clase: observado.
**Prioridad:** C. **Tamaño:** S. **Etiquetas:** [render, enlace, patron].

---

### HU-14.013 — Copiar estilo de un enlace (Copy Style)

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** U.
**Historia:** Como modelador, quiero copiar el estilo de un enlace al portapapeles para luego pegar en otros.
**Criterios:**
- **Dado** un enlace seleccionado, **cuando** elijo "Copiar estilo", **entonces** `ui.estiloPortapapeles = enlace.estilo`.
**Modelo:** UI transitoria. **Patrones:** ninguno.
**Deps:** Bloqueada por HU-11.016.
**Evidencia:** Clase: observado.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [ui, estilo, portapapeles].

---

### HU-14.014 — Pegar estilo copiado en otro enlace

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador, quiero pegar el estilo del portapapeles en otro enlace.
**Criterios:**
- **Dado** que tengo `ui.estiloPortapapeles` y un enlace seleccionado, **cuando** elijo "Pegar estilo", **entonces** `enlace.estilo = ui.estiloPortapapeles` y entra al stack undo.
**Patrones:** HU-SHARED-002.
**Deps:** Bloqueada por HU-14.013.
**Evidencia:** Clase: observado.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [ui, estilo, pegar].

---

### HU-14.015 — Resetear estilo de una cosa al defecto

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V primario.
**Historia:** Como modelador, quiero resetear todos los overrides de estilo de una cosa a los valores por defecto.
**Criterios:**
- **Dado** una cosa con overrides, **cuando** elijo "Reset Style", **entonces** `apariencia.estilo = {}` (vacío) y el render usa los defaults canónicos. [JOYAS §1, §3]
**Modelo:** `apariencia.estilo`. **Patrones:** HU-SHARED-002.
**Deps:** Bloqueada por HU-14.001.
**Evidencia:** [V-63]. Clase: observado.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render, estilo, reset].

---

### HU-14.016 — Aplicar estilo a varias cosas por multi-selección

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador, quiero aplicar un cambio de estilo a varias cosas seleccionadas en lote.
**Criterios:**
- **Dado** varias apariencias seleccionadas (HU-SHARED-008), **cuando** cambio cualquier propiedad de estilo, **entonces** se aplica a todas en una sola operación de undo.
**Modelo:** múltiples `apariencia.estilo.*`. **Patrones:** HU-SHARED-002, HU-SHARED-008.
**Deps:** Bloqueada por HU-14.001, HU-SHARED-008.
**Evidencia:** Clase: observado.
**Prioridad:** C. **Tamaño:** M. **Etiquetas:** [render, estilo, batch].

---

### HU-14.017 — Persistir overrides de estilo junto al modelo (sin eco OPL)

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** P primario.
**Historia:** Como modelador, quiero que mis overrides de estilo se guarden con el modelo y se restauren al cargar.
**Criterios:**
- **Dado** que hice cambios de estilo, **cuando** guardo, **entonces** `apariencia.estilo` y `enlace.estilo` se persisten.
- **Dado** que cargo el modelo, **cuando** se renderiza, **entonces** los overrides se restauran sin afectar OPL-ES (HU-SHARED-007 ignora estilo).
**Modelo:** `apariencia.estilo`, `enlace.estilo` `[propuesta]`.
 **Patrones:** HU-SHARED-007 (mecánica detectada por audit-hu.mjs). **Deps:** Bloqueada por HU-14.001 a HU-14.016, HU-30.001.
**Evidencia:** [V-63]. Clase: observado + canonizado.
**Prioridad:** C. **Tamaño:** M. **Etiquetas:** [persistencia, estilo, separacion-semantica].

---

## 4. Preguntas abiertas derivadas

| Código | Pregunta | Bloquea |
|---|---|---|
| Q14.1 | Lista canónica de fuentes soportadas (web-safe + custom). | HU-14.004 |
| Q14.2 | ¿Reset Style afecta también el subset semántico (afiliación/esencia) o solo overrides estéticos? | HU-14.015 |
| Q14.3 | ¿El estilo aplicado a multi-selección sobrescribe overrides individuales o solo agrega? | HU-14.016 |

## 5. Referencias cruzadas

- Patrones: HU-SHARED-002, HU-SHARED-008.
- Bloqueada por: EPICA-10 (cosas existentes), EPICA-11 (enlaces).
- Bloquea a: EPICA-30 (persistencia con overrides), EPICA-81 (defaults globales).
