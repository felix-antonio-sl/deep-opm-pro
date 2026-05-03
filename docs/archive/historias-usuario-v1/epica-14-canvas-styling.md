---
epica: "EPICA-14"
titulo: "Canvas — estilado visual de cosas, texto y enlaces (tipografia, color, grosor, copiar/pegar estilo, reset)"
doc_fuente: "opcloud-reverse/14-canvas-styling.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "C"
hu_emitidas: 17
ultima_actualizacion: 2026-04-23
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
---

## Resumen

Esta epica cubre la capa de apariencia manual que OPCloud expone sobre cada elemento del canvas: tipografia (familia, tamano, peso, color), color de borde y fill de cosas, color y grosor de enlaces, alineacion y posicionamiento del rotulo, copia/pegado de estilo entre elementos, y reseteo al estado default. La separacion entre semantica (OPL, modelo) y apariencia (estilo) es invariante: cambiar estilo **no altera** ni el OPL ni el kernel OPM.

El estilado vive completamente en el nivel Render (V) sobre un modelo de datos paralelo al kernel — un overlay reversible que se persiste por elemento pero que es opaco a la gramatica OPM. La SSOT [V-63] establece que los colores son informativos, no normativos: toda la paleta cromatica de esta epica es convencion OPCloud, no mandato OPM. Los valores concretos de color (#70E483, #3BC3FF, #586D8C), dimensiones (135x60), tipografia (Arial 14px semibold) y patrones de linea (wrapper+line 15px/2px) se anclan en JOYAS.md. Se articula con EPICA-81 (style defaults de organizacion) para la combinacion defaults globales + overrides por elemento.

Las HU se numeran siguiendo la aparicion en el doc fuente, sin reordenar por prioridad. Cada HU preserva trazabilidad con secciones §3.1, §3.2, §3.3, §5.1, §5.2, §6, §7.2 y frames frame_00001–frame_00019 del doc fuente.

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT | Etiquetas |
|---|---|---|---|---|---|---|---|
| HU-14.001 | Mostrar grupo Style en toolbar al seleccionar cosa | ME | S | S | opcloud-ui | — | canvas, ui, toolbar, estilo, seleccion |
| HU-14.002 | Cambiar color de fill de una cosa con paleta | ME | S | S | opcloud-ui | [V-63] [JOYAS §1] | canvas, render, estilo, fill, paleta |
| HU-14.003 | Cambiar color de borde de una cosa con paleta | ME | S | S | opcloud-ui | [V-63] [JOYAS §1] | canvas, render, estilo, border, paleta |
| HU-14.004 | Cambiar familia tipografica del rotulo | ME | C | S | opcloud-ui | [JOYAS §3] | canvas, render, estilo, tipografia |
| HU-14.005 | Cambiar tamano de tipografia del rotulo | ME | C | XS | opcloud-ui | [JOYAS §3] | canvas, render, estilo, tipografia-tamano |
| HU-14.006 | Cambiar peso/estilo tipografico (bold, italic) | ME | C | XS | opcloud-ui | [JOYAS §3] | canvas, render, estilo, tipografia-peso, requires-clarification |
| HU-14.007 | Cambiar color del texto del rotulo | ME | C | XS | opcloud-ui | [V-63] [JOYAS §3] | canvas, render, estilo, texto-color |
| HU-14.008 | Cambiar alineacion del texto del rotulo | ME | C | XS | opcloud-ui | — | canvas, render, estilo, alineacion, texto |
| HU-14.009 | Activar posicionamiento manual de texto con ejes X/Y | ME | C | S | opcloud-ui | — | canvas, ui, estilo, posicionamiento-manual, texto, requires-clarification |
| HU-14.010 | Cambiar color de un enlace desde dialogo de propiedades | ME | S | S | opcloud-ui | [V-63] [JOYAS §1] | canvas, render, estilo, enlaces, color |
| HU-14.011 | Cambiar grosor de un enlace | ME | S | XS | opcloud-ui | [JOYAS §4] | canvas, render, estilo, enlaces, grosor |
| HU-14.012 | Cambiar patron de trazo de un enlace (solido, discontinuo, punteado) | ME | C | S | opcloud-ui | [V-1 §1.2] | canvas, render, estilo, enlaces, patron, requires-clarification |
| HU-14.013 | Copiar estilo de un enlace con Copy style | ME | S | S | opcloud-ui | — | canvas, ui, estilo, enlaces, copiar-estilo, requires-clarification |
| HU-14.014 | Pegar estilo copiado en otro enlace | ME | S | S | opcloud-ui | — | canvas, ui, estilo, enlaces, pegar-estilo, requires-clarification |
| HU-14.015 | Resetear estilo de una cosa al default con Reset style | ME | M1 | S | opcloud-ui | [V-63] | canvas, ui, estilo, reset, overlay |
| HU-14.016 | Aplicar estilo a varias cosas por multi-seleccion | ME | C | M | opcloud-ui | — | canvas, ui, estilo, multi-seleccion, requires-clarification |
| HU-14.017 | Persistir overrides de estilo junto al modelo (sin eco OPL) | ME | S | M | opcloud-ui | [V-63] | canvas, persistencia, render, estilo, separacion-semantica |

Total: **17 historias de usuario** (17 opcloud-ui).

## Historias de usuario

### HU-14.001 — Mostrar grupo Style en toolbar al seleccionar cosa

**Actor primario:** ME (modelador experto).
**Actores secundarios:** MN (descubre controles via seleccion).
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; V (habilita edicion visual).
**Superficie UI:** secondary-toolbar (grupo `Style`) + canvas-opd.
**Gesto canonico:** clic simple sobre cosa en el canvas.

**Historia:**
> Como modelador, quiero que al seleccionar una cosa se despliegue el grupo `Style` en la secondary toolbar para acceder a todos los controles de apariencia sin buscar en menus.

**Contexto de negocio:**
El grupo `Style` es el punto de entrada unico a la capa visual. Su aparicion contextual respeta el principio de afordances progresivas: aparece solo cuando hay algo que estilar. Es la raiz de la mayoria de los flujos de esta epica (tipografia, color, alineacion, reset).

**Criterios de aceptacion:**
- **Dado** que el canvas tiene al menos una cosa (proceso u objeto), **cuando** selecciono la cosa con un clic, **entonces** se expande el grupo `Style` en la secondary toolbar mostrando controles de tipografia, color de borde, color de fill, alineacion y reset.
- **Dado** que deselecciono haciendo clic fuera, **cuando** se pierde la seleccion, **entonces** el grupo `Style` se oculta o queda inactivo (greyed-out).
- **Dado** que tengo una cosa seleccionada, **cuando** selecciono otra cosa distinta, **entonces** el grupo `Style` refleja los valores actuales de la nueva cosa.
- **Dado** que selecciono un enlace en vez de una cosa, **cuando** miro la toolbar, **entonces** NO se muestra el grupo `Style` de cosas (ver HU-14.010 para enlace).

**Reglas y restricciones:**
- Seleccion unica dispara el grupo; multi-seleccion lo muestra con semantica diferente (ver HU-14.016).
- El grupo es un **contenedor**, no una accion — sus controles hijos son las HU que siguen.
- La toolbar secundaria debe ser visible sin scroll horizontal en pantallas estandar (≥1366px).

**Modelo de datos tocado:**
- Ninguno — solo UI/estado de seleccion.

**Dependencias:**
- Bloqueada por: HU-10.001 o HU-10.002 (necesita cosa que seleccionar).
- Bloquea a: HU-14.002, HU-14.003, HU-14.004, HU-14.005, HU-14.006, HU-14.007, HU-14.008, HU-14.009, HU-14.015.

**Integraciones:**
- Sistema de seleccion del canvas.
- Secondary toolbar.

**Notas de evidencia:**
- Fuente normativa primaria: — (control de UI sin anclaje SSOT directo).
- Fuente OPCloud: `opcloud-reverse/14-canvas-styling.md` §2, §3.1.
- Frames: frame_00001, frame_00004.
- Evidencia visual: —
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, ui, toolbar, estilo, seleccion].

---

### HU-14.002 — Cambiar color de fill de una cosa con paleta

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; P (persiste override).
**Superficie UI:** secondary-toolbar (control `Fill color`) + paleta-flotante.
**Gesto canonico:** clic en swatch de color actual + clic en color de la paleta.

**Historia:**
> Como modelador, quiero cambiar el color de fill de una cosa eligiendo un color desde la paleta para diferenciarla visualmente de otras cosas del mismo tipo.

**Contexto de negocio:**
El fill color es el atributo visual de mayor impacto visible. Permite destacar elementos criticos, agrupar visualmente por dominio, o mostrar estado. La paleta debe ofrecer colores sensatos por defecto y permitir elegir uno custom. La SSOT [V-63] establece que los colores son informativos, no normativos; ningun valor de color esta mandado por la semantica OPM.

**Criterios de aceptacion:**
- **Dado** que tengo una cosa seleccionada con grupo `Style` visible, **cuando** hago clic en el swatch `Fill color`, **entonces** se abre una paleta flotante con presets y picker custom.
- **Dado** que la paleta esta abierta, **cuando** elijo un color, **entonces** el fill de la cosa se actualiza en vivo y la paleta se cierra.
- **Dado** que cambie el fill, **cuando** guardo y recargo el modelo, **entonces** el color persiste en `shape.fill_color`.
- **Dado** que cambie el fill, **cuando** consulto el OPL pane, **entonces** la oracion OPL **no refleja** el cambio (separacion semantica vs apariencia §4.1).
- **Dado** que abro el picker custom, **cuando** ingreso un hex `#3498db`, **entonces** el fill usa exactamente ese color.

**Reglas y restricciones:**
- El color no altera el kernel: `thing.type`, `thing.essence`, `thing.affiliation` quedan iguales.
- Default observado: fill blanco/crema segun tipo (ver SSOT visual). Los colores canonicos OPCloud son `#70E483` (verde lima, objetos), `#3BC3FF` (cyan, procesos), `#586D8C` (gris-azul). [JOYAS §1]
- El override se almacena por elemento, no por tipo.

**Modelo de datos tocado:**
- `shape.fill_color` — string (hex) nullable — persistente (nullable = usa default global).

**Dependencias:**
- Bloqueada por: HU-14.001.

**Integraciones:**
- Renderer JointJS (actualiza atributo `fill` del shape).
- Sistema de persistencia (grabado junto al modelo).
- EPICA-81 (style defaults global de organizacion).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-visual-es.md` [V-63] colores informativos no normativos.
- Fuente OPCloud: `opcloud-reverse/14-canvas-styling.md` §3.1 paso 4, §5.1, §6 (`shape.fill_color`).
- Frames: frame_00008, frame_00011, frame_00015.
- Evidencia visual: JOYAS §1 colores canonicos (#70E483, #3BC3FF, #586D8C).
- Transcripcion: "cambia tambien borde y fill".
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, render, estilo, fill, paleta].

---

### HU-14.003 — Cambiar color de borde de una cosa con paleta

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; P.
**Superficie UI:** secondary-toolbar (control `Border color`) + paleta-flotante.
**Gesto canonico:** clic en swatch de borde + clic en color.

**Historia:**
> Como modelador, quiero cambiar el color del borde de una cosa con la paleta para contrastar contra su fill o para marcar categorias visuales.

**Contexto de negocio:**
El color de borde opera en capa complementaria al fill. Permite contornos marcados para elementos criticos o paletas combinadas (borde + fill) que codifiquen dominio sin violar la semantica OPM. La SSOT [V-63] aclara que el color es informativo, no normativo: la distincion semantica de borde es topologica (solido vs discontinuo), no cromatica.

**Criterios de aceptacion:**
- **Dado** que tengo una cosa seleccionada, **cuando** hago clic en swatch `Border color`, **entonces** se abre una paleta identica en estructura a la de fill.
- **Dado** que elijo un color, **cuando** confirmo, **entonces** el borde se actualiza en vivo y persiste en `shape.border_color`.
- **Dado** que la cosa tiene `affiliation=environmental` (borde discontinuo verde, HU-10.015), **cuando** cambio el color de borde, **entonces** el nuevo color sobrescribe el verde default **manteniendo el patron discontinuo**.
- **Dado** que reseteo el estilo (HU-14.015), **cuando** confirmo reset, **entonces** el borde vuelve al color default derivado de affiliation.

**Reglas y restricciones:**
- El color override convive con el estilo de linea semantico (discontinuo/solido) derivado de `affiliation`.
- NO altera `thing.affiliation`; es puramente visual.
- Separacion estricta: color = visual; patron = semantico.

**Modelo de datos tocado:**
- `shape.border_color` — string (hex) nullable — persistente.

**Dependencias:**
- Bloqueada por: HU-14.001.

**Integraciones:**
- Renderer JointJS (atributo `stroke` del shape).
- Convencion visual SSOT para el patron discontinuo/solido de affiliation.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-visual-es.md` [V-63] colores informativos no normativos; [V-1 §1.2] contorno continuo/discontinuo.
- Fuente OPCloud: `opcloud-reverse/14-canvas-styling.md` §3.1 paso 4, §5.1, §6 (`shape.border_color`).
- Frames: frame_00008, frame_00015.
- Evidencia visual: JOYAS §1 colores canonicos de borde (#70E483, #3BC3FF).
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, render, estilo, border, paleta].

---

### HU-14.004 — Cambiar familia tipografica del rotulo

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; P.
**Superficie UI:** secondary-toolbar (dropdown `Font family`).
**Gesto canonico:** clic en dropdown + seleccion.

**Historia:**
> Como modelador, quiero cambiar la familia tipografica del rotulo de una cosa para ajustar la legibilidad o para aplicar un branding visual especifico.

**Contexto de negocio:**
La familia tipografica es la decision visual mas sutil. Permite diferenciar dominios o alinear con guidelines de la organizacion. El listado debe ofrecer tipografias seguras (sans-serif, serif, monospace) y tipografias web si hay defaults de org. La tipografia canonica OPCloud es Arial 14px semibold. [JOYAS §3]

**Criterios de aceptacion:**
- **Dado** que tengo una cosa seleccionada, **cuando** abro el dropdown `Font family`, **entonces** veo un listado de familias disponibles (al menos sans-serif, serif, monospace).
- **Dado** que elijo una familia, **cuando** confirmo la seleccion, **entonces** el rotulo se renderiza con la nueva familia en vivo.
- **Dado** que la familia elegida no esta cargada, **cuando** el render intenta usarla, **entonces** cae al fallback del sistema sin romper.
- **Dado** que persisto y recargo, **cuando** miro la cosa, **entonces** la familia persiste en `label.font_family`.

**Reglas y restricciones:**
- Lista de familias disponibles deriva de settings globales + browser (ver EPICA-81).
- La familia aplica solo al rotulo de la cosa, no al OPL pane ni a otras UI.

**Modelo de datos tocado:**
- `label.font_family` — string nullable — persistente.

**Dependencias:**
- Bloqueada por: HU-14.001.

**Integraciones:**
- Renderer (atributo `font-family` del text SVG).
- EPICA-81 (default global de organizacion).

**Notas de evidencia:**
- Fuente normativa primaria: JOYAS §3 tipografia Arial 14px semibold como default canonico.
- Fuente OPCloud: `opcloud-reverse/14-canvas-styling.md` §3.1 paso 3, §5.1, §6 (`label.font_family`).
- Frames: frame_00006, frame_00011, frame_00013.
- Transcripcion: "tipografia" listada como control confirmado.
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [canvas, render, estilo, tipografia].

---

### HU-14.005 — Cambiar tamano de tipografia del rotulo

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; P.
**Superficie UI:** secondary-toolbar (control `Font size`).
**Gesto canonico:** input numerico o dropdown de tallas.

**Historia:**
> Como modelador, quiero cambiar el tamano de tipografia del rotulo de una cosa para jerarquizar visualmente elementos del diagrama.

**Contexto de negocio:**
Tamano de tipografia es la segunda palanca de jerarquia visual (despues del color). Un proceso critico merece tipografia mayor; detalles, tipografia menor. El default canonico OPCloud es 14px. [JOYAS §3]

**Criterios de aceptacion:**
- **Dado** que tengo una cosa seleccionada, **cuando** ingreso un nuevo valor en `Font size`, **entonces** el rotulo se redimensiona en vivo.
- **Dado** que el valor es invalido (≤0, no-numerico), **cuando** intento confirmar, **entonces** se descarta el cambio y el control vuelve al valor previo sin aplicar.
- **Dado** que persisto y recargo, **cuando** vuelvo a la cosa, **entonces** el tamano persiste en `label.font_size`.
- **Dado** que el tamano excede el bounding box del shape, **cuando** se renderiza, **entonces** el texto se ajusta o trunca segun convencion (pregunta abierta §11.3 fuente — ver notas).

**Reglas y restricciones:**
- Rango recomendado: 8px–72px (heuristica; sin limite duro observado).
- Default canonico: 14px. [JOYAS §3]
- Unidad: px (convencion).

**Modelo de datos tocado:**
- `label.font_size` — number nullable — persistente.

**Dependencias:**
- Bloqueada por: HU-14.001.

**Integraciones:**
- Renderer.
- EPICA-81 (default global).

**Notas de evidencia:**
- Fuente normativa primaria: JOYAS §3 tipografia Arial 14px semibold default.
- Fuente OPCloud: `opcloud-reverse/14-canvas-styling.md` §3.1 paso 3, §5.1, §6 (`label.font_size`), §7.2.
- Frames: frame_00006, frame_00011.
- Transcripcion: "el tamano por defecto puede configurarse en settings".
- Clase de afirmacion: confirmado por transcripcion + hipotesis (comportamiento overflow).

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [canvas, render, estilo, tipografia-tamano].

---

### HU-14.006 — Cambiar peso/estilo tipografico (bold, italic)

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; P.
**Superficie UI:** secondary-toolbar (toggles `Bold`, `Italic`).
**Gesto canonico:** clic en boton toggle.

**Historia:**
> Como modelador, quiero aplicar bold o italic al rotulo de una cosa para enfatizar elementos clave o marcar convenciones (p.ej. abstracto vs concreto).

**Contexto de negocio:**
Bold/italic son ajustes binarios de alto impacto. No estan explicitos en la spec como grupo separado, pero se infieren del grupo tipografico general. El peso canonico OPCloud es semibold. [JOYAS §3] Etiqueta `inferido` hasta verificar frames.

**Criterios de aceptacion:**
- **Dado** que tengo una cosa seleccionada, **cuando** hago clic en `Bold`, **entonces** el rotulo se renderiza en negrita y el boton queda marcado como activo.
- **Dado** que el toggle bold esta activo, **cuando** hago clic otra vez, **entonces** se desactiva y el rotulo vuelve al peso normal.
- **Dado** que hago lo mismo con `Italic`, **cuando** se aplica, **entonces** el rotulo se renderiza en cursiva independientemente de bold.
- **Dado** que los dos estan activos, **cuando** se combinan, **entonces** el rotulo es `bold italic`.

**Reglas y restricciones:**
- Bold e italic son ortogonales: pueden combinarse.
- Default: ambos OFF. Peso canonico: semibold. [JOYAS §3]
- Si la familia tipografica no tiene variante bold/italic, usar fallback synthetic del render.

**Modelo de datos tocado:**
- `label.font_weight` — `"normal" | "bold"` — persistente.
- `label.font_style` — `"normal" | "italic"` — persistente.

**Dependencias:**
- Bloqueada por: HU-14.001.

**Integraciones:**
- Renderer (atributos `font-weight`, `font-style`).

**Notas de evidencia:**
- Fuente normativa primaria: JOYAS §3 tipografia Arial 14px semibold como peso canonico por defecto.
- Fuente OPCloud: `opcloud-reverse/14-canvas-styling.md` §5.1 (grupo tipografia mencionado sin enumeracion exhaustiva).
- Clase de afirmacion: inferido a partir del grupo de controles tipograficos.
- Etiqueta: `requires-clarification` — confirmar si OPCloud los expone como toggles separados o como parte de `Font family`.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [canvas, render, estilo, tipografia-peso, requires-clarification].

---

### HU-14.007 — Cambiar color del texto del rotulo

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; P.
**Superficie UI:** secondary-toolbar (swatch `Text color`) + paleta-flotante.
**Gesto canonico:** clic en swatch + clic en color.

**Historia:**
> Como modelador, quiero cambiar el color del texto del rotulo para distinguirlo del fill o para reforzar una jerarquia cromatica.

**Contexto de negocio:**
El color del texto es independiente del fill y del borde. Permite combinaciones contrastantes (fill oscuro + texto claro) o monocromaticas con variacion tonal. Comparte paleta con los otros swatches. La SSOT [V-63] establece que el color es informativo, no normativo.

**Criterios de aceptacion:**
- **Dado** que tengo una cosa seleccionada, **cuando** hago clic en swatch `Text color`, **entonces** se abre la misma paleta estructura de fill/border.
- **Dado** que elijo un color, **cuando** confirmo, **entonces** el rotulo se renderiza con ese color en vivo.
- **Dado** que el color elegido tiene bajo contraste vs el fill, **cuando** se aplica, **entonces** se aplica igual sin bloqueo (el modelador decide).
- **Dado** que persisto, **cuando** recargo, **entonces** el color persiste en `label.color`.

**Reglas y restricciones:**
- No hay validacion de contraste (el modelador es responsable de legibilidad).
- Compatible con bold/italic y con alineacion.

**Modelo de datos tocado:**
- `label.color` — string (hex) nullable — persistente.

**Dependencias:**
- Bloqueada por: HU-14.001.

**Integraciones:**
- Renderer (atributo `fill` del text SVG).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-visual-es.md` [V-63] colores informativos no normativos; JOYAS §3 tipografia canonica.
- Fuente OPCloud: `opcloud-reverse/14-canvas-styling.md` §3.1 paso 3, §5.1, §6 (`label.color`).
- Frames: frame_00006, frame_00011.
- Transcripcion: "color de texto" listado como control confirmado.
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [canvas, render, estilo, texto-color].

---

### HU-14.008 — Cambiar alineacion del texto del rotulo

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; P.
**Superficie UI:** ribbon-flotante bajo toolbar (botones `align-left`, `align-center`, `align-right`).
**Gesto canonico:** clic en boton de alineacion.

**Historia:**
> Como modelador, quiero alinear el texto del rotulo (izquierda, centro, derecha) para ordenar visualmente cuando un texto ocupa varias lineas o cuando combino con posicionamiento manual.

**Contexto de negocio:**
La alineacion del texto es la palanca mas simple del ribbon flotante. Por defecto los rotulos OPM estan centrados; un modelador experto puede querer alineacion especifica para crear alineaciones visuales entre cosas.

**Criterios de aceptacion:**
- **Dado** que tengo una cosa seleccionada, **cuando** miro el ribbon flotante bajo la toolbar, **entonces** veo los botones `align-left`, `align-center` y `align-right`.
- **Dado** que hago clic en `align-left`, **cuando** se aplica, **entonces** el rotulo se alinea a la izquierda del bounding box de la cosa.
- **Dado** que el rotulo tiene multiples lineas, **cuando** aplico alineacion, **entonces** todas las lineas se alinean consistentemente.
- **Dado** que persisto, **cuando** recargo, **entonces** la alineacion persiste en `label.align`.

**Reglas y restricciones:**
- Default: `center`.
- Alineacion interactua con `manual text positioning` (HU-14.009) de forma aditiva.
- Alineacion aplica al texto, no al shape.

**Modelo de datos tocado:**
- `label.align` — `"left" | "center" | "right"` — persistente.

**Dependencias:**
- Bloqueada por: HU-14.001.

**Integraciones:**
- Renderer (atributo `text-anchor` del text SVG).

**Notas de evidencia:**
- Fuente normativa primaria: — (control de UI sin anclaje SSOT directo).
- Fuente OPCloud: `opcloud-reverse/14-canvas-styling.md` §2 (ribbon flotante), §5.1 ("alineacion del texto"), §6 (`label.align`).
- Frames: frame_00008.
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [canvas, render, estilo, alineacion, texto].

---

### HU-14.009 — Activar posicionamiento manual de texto con ejes X/Y

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; V, P secundarios.
**Superficie UI:** ribbon-flotante + controles X/Y + presets-cardinales.
**Gesto canonico:** toggle `manual text positioning` + input X/Y o clic en preset.

**Historia:**
> Como modelador experto, quiero activar posicionamiento manual del texto y moverlo con ejes X/Y o con presets (arriba, abajo, izquierda, derecha, centro) para acomodar rotulos en diagramas densos sin cambiar la semantica.

**Contexto de negocio:**
Cuando un diagrama se densifica, los rotulos pueden colisionar con otras cosas o con enlaces. El posicionamiento manual de texto deja desplazar el rotulo dentro del bounding box **sin mover la cosa ni alterar el modelo**. Los presets ofrecen 5 puntos cardinales para el 80% de los casos; X/Y da control fino para el 20% restante.

**Criterios de aceptacion:**
- **Dado** que tengo una cosa seleccionada, **cuando** activo `manual text positioning`, **entonces** aparecen los controles X/Y y los presets cardinales.
- **Dado** que hago clic en preset `top`, **cuando** se aplica, **entonces** el rotulo se posiciona arriba del bounding box.
- **Dado** que ajusto X e Y numericamente, **cuando** confirmo, **entonces** el rotulo se posiciona en ese offset relativo al centro del bounding box.
- **Dado** que mueva el rotulo manualmente, **cuando** consulto el OPL pane, **entonces** el OPL **no refleja** el cambio (separacion §4.1).
- **Dado** que desactivo `manual text positioning`, **cuando** el toggle se apaga, **entonces** el rotulo vuelve a la posicion default (centro o segun alineacion).
- **Dado** que persisto, **cuando** recargo, **entonces** las coordenadas persisten en `label.position_x` y `label.position_y`.

**Reglas y restricciones:**
- Rango duro para offset X/Y: **pregunta abierta** §11.3 fuente — puede salir del bounding box (observado en transcripcion implicitamente).
- Presets: `top`, `bottom`, `left`, `right`, `center`.
- Las coordenadas son offsets relativos al centro del shape, en unidades de pantalla.

**Modelo de datos tocado:**
- `label.position_x` — number nullable — persistente.
- `label.position_y` — number nullable — persistente.
- `label.manual_positioning` — boolean — persistente.

**Dependencias:**
- Bloqueada por: HU-14.001.

**Integraciones:**
- Renderer (atributos `x`, `y` y `transform` del text).
- Layout: manual positioning NO participa de auto-layout algoritmico.

**Notas de evidencia:**
- Fuente normativa primaria: — (control de UI sin anclaje SSOT directo).
- Fuente OPCloud: `opcloud-reverse/14-canvas-styling.md` §3.2, §5.1 ("posicionamiento manual"), §6 (`label.position_x`, `label.position_y`), §11.3 (pregunta abierta sobre limites).
- Frames: frame_00008, frame_00013.
- Clase de afirmacion: observado + confirmado por transcripcion.
- Etiqueta: `requires-clarification` (limites de offset antes de salir del contenedor).

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [canvas, ui, estilo, posicionamiento-manual, texto, requires-clarification].

---

### HU-14.010 — Cambiar color de un enlace desde dialogo de propiedades

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; P, U secundarios.
**Superficie UI:** dialogo-propiedades-enlace (`Style` → `Link color`) + paleta-flotante.
**Gesto canonico:** clic derecho en enlace → propiedades → Style → clic en color → `Update style`.

**Historia:**
> Como modelador, quiero cambiar el color de un enlace desde el dialogo de propiedades para distinguir flujos criticos o para aplicar una convencion cromatica por tipo.

**Contexto de negocio:**
El color de enlace es una palanca fuerte para representar categorias: flujos principales en un color, flujos secundarios en otro, flujos de error en rojo, etc. Por default los enlaces son negros; los overrides permiten narrativa visual rica. La SSOT [V-63] establece que los colores son informativos, no normativos.

**Criterios de aceptacion:**
- **Dado** que selecciono un enlace con clic derecho, **cuando** se abre el menu contextual, **entonces** veo la opcion `Properties` que abre el dialogo.
- **Dado** que estoy en el dialogo de propiedades, **cuando** entro a la pestana/seccion `Style`, **entonces** veo el control `Link color` con paleta.
- **Dado** que elijo un color en la paleta, **cuando** hago clic en `Update style`, **entonces** el enlace se renderiza con ese color y el dialogo se cierra.
- **Dado** que cancelo el dialogo, **cuando** cierro sin `Update style`, **entonces** el color previo se preserva.
- **Dado** que persisto, **cuando** recargo, **entonces** el color persiste en `link.color`.

**Reglas y restricciones:**
- El color no altera `link.type` ni `link.subtype` ni su OPL.
- `Update style` es el **commit**; el dialogo tiene transaccionalidad explicita (no auto-apply).
- Default: color derivado del tipo de enlace (negro estandar o segun SSOT visual). Colores canonicos OPCloud: #70E483, #3BC3FF, #586D8C. [JOYAS §1]

**Modelo de datos tocado:**
- `link.color` — string (hex) nullable — persistente.

**Dependencias:**
- Bloqueada por: HU-10.011 (enlace creado).

**Integraciones:**
- Renderer JointJS link (atributo `stroke` del path).
- Dialogo de propiedades (EPICA-16).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-visual-es.md` [V-63] colores informativos no normativos; JOYAS §1 colores canonicos.
- Fuente OPCloud: `opcloud-reverse/14-canvas-styling.md` §2 (dialogo de estilo de enlace), §3.3 pasos 1-5, §5.2, §6 (`link.color`).
- Frames: frame_00017, frame_00019.
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, render, estilo, enlaces, color].

---

### HU-14.011 — Cambiar grosor de un enlace

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; P.
**Superficie UI:** dialogo-propiedades-enlace (`Style` → `Link width`).
**Gesto canonico:** input numerico + `Update style`.

**Historia:**
> Como modelador, quiero cambiar el grosor del trazo de un enlace para resaltar flujos principales vs flujos secundarios.

**Contexto de negocio:**
El grosor de trazo es la segunda palanca visual del enlace (despues del color). Permite jerarquizar conexiones: un enlace grueso denota flujo critico o de alto volumen; un enlace fino, secundario o condicional. El valor default es fino para no dominar el diagrama. OPCloud usa wrapper+line de 15px/2px para hit area. [JOYAS §4]

**Criterios de aceptacion:**
- **Dado** que el dialogo de propiedades del enlace esta abierto en `Style`, **cuando** ingreso un valor en `Link width`, **entonces** el control muestra el nuevo valor.
- **Dado** que hago clic en `Update style`, **cuando** se aplica, **entonces** el enlace se renderiza con el nuevo grosor.
- **Dado** que el valor es invalido (≤0, no-numerico), **cuando** intento `Update style`, **entonces** se rechaza o se normaliza al valor valido mas cercano.
- **Dado** que persisto, **cuando** recargo, **entonces** el grosor persiste en `link.width`.

**Reglas y restricciones:**
- Unidad: px.
- Rango recomendado: 1px–10px (heuristica).
- Default: deriva de SSOT visual (tipicamente 1–2px). Linea visible canonica: 2px. [JOYAS §4]
- El grosor no cambia las puntas de flecha (arrowheads) — esas dependen de `link.type`.

**Modelo de datos tocado:**
- `link.width` — number nullable — persistente.

**Dependencias:**
- Bloqueada por: HU-14.010 (comparte dialogo de propiedades).

**Integraciones:**
- Renderer JointJS link (atributo `stroke-width`).

**Notas de evidencia:**
- Fuente normativa primaria: JOYAS §4 wrapper+line 15px/2px para hit area y linea visible.
- Fuente OPCloud: `opcloud-reverse/14-canvas-styling.md` §3.3 paso 4, §5.2, §6 (`link.width`).
- Frames: frame_00017.
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [canvas, render, estilo, enlaces, grosor].

---

### HU-14.012 — Cambiar patron de trazo de un enlace (solido, discontinuo, punteado)

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; P.
**Superficie UI:** dialogo-propiedades-enlace (`Style` → `Link pattern` o `Stroke style`).
**Gesto canonico:** dropdown de patrones + `Update style`.

**Historia:**
> Como modelador, quiero cambiar el patron del trazo (solido, discontinuo, punteado) para distinguir visualmente categorias de flujo que no tienen tipo OPM propio (p.ej. flujos planificados vs actuales).

**Contexto de negocio:**
El patron de trazo completa el trio visual del enlace (color, grosor, patron). En OPM el patron tiene semantica dura para algunos tipos (p.ej. borde discontinuo = ambiental [V-1 §1.2]), pero para enlaces el patron puede ser puramente visual si se preserva la separacion semantica.

**Criterios de aceptacion:**
- **Dado** que el dialogo de estilo de enlace esta abierto, **cuando** miro los controles, **entonces** puedo elegir entre `solido`, `discontinuo`, `punteado` (opciones minimas).
- **Dado** que elijo `discontinuo`, **cuando** aplico `Update style`, **entonces** el enlace se renderiza con patron discontinuo preservando color y grosor.
- **Dado** que el enlace tiene semantica que ya define patron (si aplica), **cuando** intento sobrescribir, **entonces** la override visual aplica pero es reversible con reset.
- **Dado** que persisto, **cuando** recargo, **entonces** el patron persiste en `link.dash_pattern`.

**Reglas y restricciones:**
- Opciones minimas: `solido`, `discontinuo`, `punteado`. Custom dash-arrays: **pregunta abierta**.
- No alterar `link.type` ni OPL al cambiar patron.
- Etiqueta `requires-clarification` — el doc fuente no enumera explicitamente este control; se infiere del grupo `Style` de enlace.

**Modelo de datos tocado:**
- `link.dash_pattern` — `"solid" | "dashed" | "dotted"` nullable — persistente.

**Dependencias:**
- Bloqueada por: HU-14.010.

**Integraciones:**
- Renderer JointJS link (atributo `stroke-dasharray`).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-visual-es.md` [V-1 §1.2] contorno continuo (sistemico) vs discontinuo (ambiental) — fundamento semantico del patron.
- Fuente OPCloud: `opcloud-reverse/14-canvas-styling.md` §3.3, §5.2 (controles de enlace enumerados: color, grosor, picker, copy — `pattern` no mencionado explicitamente).
- Clase de afirmacion: inferido (completa el trio visual estandar; no aparece en transcripcion).
- Etiqueta: `requires-clarification` — validar si OPCloud lo expone o no.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [canvas, render, estilo, enlaces, patron, requires-clarification].

---

### HU-14.013 — Copiar estilo de un enlace con Copy style

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; V secundaria.
**Superficie UI:** dialogo-propiedades-enlace (boton `Copy style`).
**Gesto canonico:** clic en `Copy style`.

**Historia:**
> Como modelador, quiero copiar el estilo de un enlace (color, grosor, patron) para aplicarlo a otros enlaces sin reconfigurar cada uno manualmente.

**Contexto de negocio:**
`Copy style` materializa una cultura de **consistencia visual manual**. Cuando el modelador definio un look para una categoria de flujo, lo replica sin redefinir. Es un **clipboard de estilo** paralelo al clipboard del sistema.

**Criterios de aceptacion:**
- **Dado** que tengo un enlace estilado y su dialogo de propiedades abierto, **cuando** hago clic en `Copy style`, **entonces** el estilo actual (color, grosor, patron) se guarda en un clipboard de estilo interno.
- **Dado** que copie el estilo, **cuando** consulto cualquier senal UI, **entonces** hay feedback visual de que hay estilo en clipboard (toast breve, estado de boton, o cursor distintivo — pregunta abierta).
- **Dado** que copie el estilo, **cuando** hago refresh de la pagina, **entonces** el clipboard **no persiste** entre sesiones (comportamiento volatil estandar de clipboard).

**Reglas y restricciones:**
- Atributos cubiertos por copy: color, grosor, (patron si HU-14.012 aplica). Pregunta abierta §11.1 fuente sobre cobertura exacta.
- Solo se puede tener **un estilo** en clipboard a la vez; copiar otro lo reemplaza.
- `Copy style` NO copia el **tipo** del enlace (solo apariencia).

**Modelo de datos tocado:**
- Transitorio: `styleClipboard.link = { color, width, dash_pattern }` — en memoria, sesion.

**Dependencias:**
- Bloqueada por: HU-14.010, HU-14.011.
- Bloquea a: HU-14.014.

**Integraciones:**
- AppState o equivalente para clipboard in-memory.
- Posible shortcut de teclado `Ctrl+Shift+C` — pregunta abierta (no observado explicitamente).

**Notas de evidencia:**
- Fuente normativa primaria: — (convencion de UI sin anclaje SSOT directo).
- Fuente OPCloud: `opcloud-reverse/14-canvas-styling.md` §2 (accion `Copy style`), §3.3 paso 6, §5.2, §11.1 (pregunta abierta sobre cobertura).
- Frames: frame_00017, frame_00019.
- Transcripcion: "copy style para replicar el mismo look".
- Clase de afirmacion: observado + confirmado por transcripcion; cobertura exacta de atributos — abierto.
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, ui, estilo, enlaces, copiar-estilo, requires-clarification].

---

### HU-14.014 — Pegar estilo copiado en otro enlace

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; V, P.
**Superficie UI:** dialogo-propiedades-enlace (boton `Paste style`) o accion de context menu.
**Gesto canonico:** clic en `Paste style` sobre enlace destino.

**Historia:**
> Como modelador, quiero pegar el estilo previamente copiado en otro enlace para aplicar consistencia visual con un solo gesto.

**Contexto de negocio:**
`Paste style` cierra el ciclo iniciado por `Copy style`. Sin paste, copy pierde utilidad. El gesto debe ser simetrico al de copy (mismo dialogo, boton hermano) o mas rapido (context menu directo).

**Criterios de aceptacion:**
- **Dado** que hay un estilo en clipboard (HU-14.013) y selecciono otro enlace, **cuando** abro su dialogo de propiedades, **entonces** el boton `Paste style` esta habilitado.
- **Dado** que no hay clipboard con estilo, **cuando** miro el boton `Paste style`, **entonces** esta deshabilitado (greyed-out).
- **Dado** que hago clic en `Paste style`, **cuando** se aplica, **entonces** el enlace destino adopta color, grosor y patron del clipboard.
- **Dado** que pegue el estilo, **cuando** consulto el OPL, **entonces** el OPL del enlace destino **no cambia** (separacion semantica).
- **Dado** que el enlace destino tiene un tipo OPM distinto del origen, **cuando** pego, **entonces** los atributos visuales se aplican igual (el tipo OPM no es estilo).

**Reglas y restricciones:**
- Paste preserva el clipboard (se puede pegar en multiples enlaces consecutivos).
- Paste es reversible con undo (EPICA-90) y con `Reset style` (HU-14.015).
- Posible shortcut de teclado `Ctrl+Shift+V` — pregunta abierta.

**Modelo de datos tocado:**
- `link.color`, `link.width`, `link.dash_pattern` — persistentes en el enlace destino.

**Dependencias:**
- Bloqueada por: HU-14.013.

**Integraciones:**
- Renderer.
- AppState (lectura del clipboard).

**Notas de evidencia:**
- Fuente normativa primaria: — (convencion de UI sin anclaje SSOT directo).
- Fuente OPCloud: inferido como contraparte necesaria de `Copy style` (`opcloud-reverse/14-canvas-styling.md` §2, §3.3, §5.2 no enumeran explicitamente `Paste style`).
- Clase de afirmacion: inferido — no observado directamente, se deriva del flujo completo de Copy/Paste.
- Etiqueta: `requires-clarification` — validar nomenclatura exacta en OPCloud (puede ser `Apply style` o `Paste style`).

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, ui, estilo, enlaces, pegar-estilo, requires-clarification].

---

### HU-14.015 — Resetear estilo de una cosa al default con Reset style

**Actor primario:** ME.
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; V, P.
**Superficie UI:** secondary-toolbar (boton `Reset style`).
**Gesto canonico:** clic en `Reset style`.

**Historia:**
> Como modelador, quiero resetear el estilo de una cosa a sus valores por default con un solo clic para descartar overrides acumulados y volver al look limpio.

**Contexto de negocio:**
El reset garantiza que el estilado es un **overlay reversible**, no una transformacion destructiva. El modelador puede experimentar libremente con estilos sabiendo que puede volver al estado default. La SSOT [V-63] establece que los colores son informativos, no normativos: el reset devuelve la cosa a los defaults informativos OPCloud. Es una invariante fuerte del producto (§4.2 fuente).

**Criterios de aceptacion:**
- **Dado** que tengo una cosa seleccionada con overrides de estilo, **cuando** hago clic en `Reset style`, **entonces** se limpian todos los campos `label.*` y `shape.*` (vuelven a `null` o a defaults globales) y el render vuelve al look default.
- **Dado** que reseteo el estilo, **cuando** la cosa tiene `affiliation=environmental`, **entonces** el borde discontinuo verde (default semantico) se preserva — reset solo quita **overrides visuales**, no semantica.
- **Dado** que reseteo, **cuando** consulto el OPL, **entonces** el OPL **no cambia** (separacion).
- **Dado** que persisto, **cuando** recargo, **entonces** los campos quedan `null` (usa default global) o valores default canonicos: colores `#70E483`/`#3BC3FF`/`#586D8C` [JOYAS §1], dimensiones 135x60 [JOYAS §2], tipografia Arial 14px semibold [JOYAS §3].
- **Dado** que hago undo tras reset, **cuando** ejecuto Ctrl+Z, **entonces** los overrides previos se restauran (interaccion con EPICA-90).

**Reglas y restricciones:**
- Reset limpia SOLO atributos de la capa de estilo; NO toca kernel (`thing.type`, `thing.essence`, `thing.affiliation`, `thing.name`, `thing.description`).
- Reset es reversible con undo.
- El boton esta siempre visible cuando hay una cosa seleccionada (no requiere que haya overrides).

**Modelo de datos tocado:**
- Limpia: `label.font_family`, `label.font_size`, `label.font_weight`, `label.font_style`, `label.color`, `label.align`, `label.position_x`, `label.position_y`, `label.manual_positioning`, `shape.border_color`, `shape.fill_color`.

**Dependencias:**
- Bloqueada por: HU-14.001.
- Relacionada con: EPICA-90 (undo/redo), EPICA-81 (defaults globales que se recuperan).

**Integraciones:**
- Renderer (redraw completo del shape).
- Persistencia (commit del cambio).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-visual-es.md` [V-63] colores informativos no normativos — el reset restaura los defaults informativos.
- Fuente OPCloud: `opcloud-reverse/14-canvas-styling.md` §3.1 paso 5, §4.2, §5.1 ("Reset style" confirmado).
- Frames: frame_00001 (baseline), frame_00015 (despues de estilado).
- Evidencia visual: JOYAS §1 colores, §2 dimensiones, §3 tipografia.
- Transcripcion: "si quiere volver al estado original, usa `Reset style`".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, ui, estilo, reset, overlay].

---

### HU-14.016 — Aplicar estilo a varias cosas por multi-seleccion

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; V, P.
**Superficie UI:** secondary-toolbar + canvas-multi-seleccion.
**Gesto canonico:** multi-seleccion (shift+clic o lazo) + cambio en control de estilo.

**Historia:**
> Como modelador experto, quiero seleccionar varias cosas y aplicar un cambio de estilo de una sola vez para imponer consistencia visual en una categoria completa sin repetir el gesto por elemento.

**Contexto de negocio:**
Multi-seleccion amplifica la productividad del estilado manual. Sin ella, aplicar un color corporativo a 20 cosas requiere 20 gestos; con multi-seleccion es un solo gesto. Es el quality-of-life que diferencia un modelador productivo de uno frustrado.

**Criterios de aceptacion:**
- **Dado** que selecciono varias cosas (shift+clic o lazo), **cuando** abro el grupo `Style`, **entonces** el grupo muestra controles habilitados.
- **Dado** que las cosas seleccionadas tienen valores distintos para un atributo (p.ej. fill), **cuando** miro el control, **entonces** el control indica "multiple" o muestra un estado mixto (no un valor unico).
- **Dado** que aplico un cambio (p.ej. fill azul), **cuando** confirmo, **entonces** todas las cosas seleccionadas adoptan ese valor.
- **Dado** que reseteo estilo con multi-seleccion activa, **cuando** confirmo `Reset style`, **entonces** todas las seleccionadas pierden overrides.
- **Dado** que la multi-seleccion incluye cosas y enlaces, **cuando** abro toolbar, **entonces** los controles muestran solo los atributos comunes — pregunta abierta, puede ser que se oculte el grupo completo.

**Reglas y restricciones:**
- Los cambios son atomicos: todos se aplican o ninguno (preparar para undo con snapshot de N elementos).
- Multi-seleccion mixta (cosas + enlaces) tiene comportamiento especifico: **pregunta abierta**.
- El performance debe mantenerse fluido hasta ~100 elementos seleccionados.

**Modelo de datos tocado:**
- Cada elemento de la seleccion recibe el override en los campos correspondientes.

**Dependencias:**
- Bloqueada por: HU-14.001.
- Bloqueada por: HU-sobre-multi-seleccion (EPICA de interaccion — posible EPICA-90).

**Integraciones:**
- Sistema de seleccion multi-elemento.
- Undo/redo (un solo evento que captura todos los cambios).

**Notas de evidencia:**
- Fuente normativa primaria: — (control de UI sin anclaje SSOT directo).
- Fuente OPCloud: inferido — el doc fuente no trata multi-seleccion explicitamente en §3.1–§3.3.
- Clase de afirmacion: inferido (practica estandar de herramientas visuales; OPCloud probablemente lo soporta).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [canvas, ui, estilo, multi-seleccion, requires-clarification].

---

### HU-14.017 — Persistir overrides de estilo junto al modelo (sin eco OPL)

**Actor primario:** ME.
**Actores secundarios:** RV (revisor — ve el estilo al abrir el modelo).
**Tipo:** opcloud-ui.
**Nivel categorico:** P primario; V, K secundarios.
**Superficie UI:** implicita (no hay UI de persistencia; solo contrato de datos).
**Gesto canonico:** ninguno — se dispara por cualquier cambio de estilo.

**Historia:**
> Como modelador, quiero que los overrides de estilo persistan junto al modelo para que al reabrir o compartir el diagrama se conserve la apariencia que defini, sin contaminar la capa semantica (OPL, kernel).

**Contexto de negocio:**
La persistencia del estilado es invariante de uso: si los overrides se pierden al guardar, toda la feature pierde valor. La persistencia debe ser **paralela** al kernel OPM — un namespace propio dentro del modelo que el OPL ignora y el export visual honra. Es la materializacion de la separacion §4.1 fuente. La SSOT [V-63] establece que los colores son informativos: el namespace de estilo encapsula decisiones de presentacion que no afectan la semantica OPM.

**Criterios de aceptacion:**
- **Dado** que modifique estilos de varias cosas y enlaces, **cuando** guardo el modelo (EPICA-30), **entonces** los campos `label.*`, `shape.*` y `link.*` (visuales) se serializan en el archivo del modelo.
- **Dado** que recargo el modelo desde disco, **cuando** se renderiza, **entonces** los estilos se restauran identicos a como quedaron.
- **Dado** que consulto el OPL pane tras guardar y recargar, **cuando** lo leo, **entonces** es identico al OPL sin estilos (el OPL no es funcion de los overrides visuales).
- **Dado** que exporto a PDF o SVG (EPICA-60, EPICA-61), **cuando** consulto el export, **entonces** los estilos se honran en la imagen.
- **Dado** que exporto a OPCat u otro interop (EPICA-70), **cuando** consulto el archivo exportado, **entonces**: o los estilos se incluyen en su namespace propio, o se descartan explicitamente (pregunta abierta §7.1 fuente).

**Reglas y restricciones:**
- Los campos de estilo viven en un namespace separado del kernel (`thing.style.*`, `link.style.*`) — **no** se mezclan con `thing.type`, `thing.affiliation`, etc.
- `null` en un campo visual = "usa default global" (composicion con EPICA-81).
- La serializacion es retrocompatible: un modelo sin campos de estilo se carga y se renderiza con defaults canonicos: colores `#70E483`/`#3BC3FF`/`#586D8C` [JOYAS §1], dimensiones 135x60 [JOYAS §2], tipografia Arial 14px semibold [JOYAS §3].
- Invariante del kernel: el estilado NUNCA altera `ModeloOPM.things[i]` ni `ModeloOPM.links[j]` de manera que afecte validacion, OPL o analisis categorico.

**Modelo de datos tocado:**
- `thing.style.label.*` — objeto — persistente.
- `thing.style.shape.*` — objeto — persistente.
- `link.style.*` — objeto — persistente.
- Namespace separado del kernel en el JSON del modelo.

**Dependencias:**
- Depende de: todas las HU que persisten overrides (HU-14.002..008, 010..012).
- Relacionada con: EPICA-30 (save/load), EPICA-60/61 (exports), EPICA-70 (interop), EPICA-81 (defaults globales).

**Integraciones:**
- Serializacion del modelo.
- Exportadores visual (PDF, SVG) y semantico (OPL, OPCat).
- Validador del kernel: debe ignorar el namespace de estilo.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-visual-es.md` [V-63] colores informativos no normativos — fundamenta la separacion de namespace visual/semantico.
- Fuente OPCloud: `opcloud-reverse/14-canvas-styling.md` §4.1 (separacion OPL vs estilo), §6 (modelo de datos implicito), §7.1 (pregunta abierta sobre export).
- Evidencia visual: JOYAS §1 colores, §2 dimensiones, §3 tipografia como defaults canonicos.
- Clase de afirmacion: confirmado por transcripcion (separacion semantica) + hipotesis (forma exacta de serializacion).
- Etiqueta: `requires-clarification` (comportamiento en interop).

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [canvas, persistencia, render, estilo, separacion-semantica].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q14.1**: Si `Copy style` actua solo sobre color/grosor o tambien sobre patron y otros atributos del enlace (cf. HU-14.013). Marcada `requires-clarification`.
- **Q14.2**: Como interactua el estilado manual con themes o templates globales (cf. HU-14.002 a HU-14.008 y EPICA-81).
- **Q14.3**: Si hay limites duros para offset X/Y de texto antes de salir del contenedor (cf. HU-14.009).
- **Q14.4**: Si existe un shortcut de teclado para `Copy style`/`Paste style` (p.ej. Ctrl+Shift+C / Ctrl+Shift+V) — no observado en frames.
- **Q14.5**: Si OPCloud expone explicitamente controles de patron de enlace (solido/discontinuo/punteado) — cf. HU-14.012, etiqueta `requires-clarification`.
- **Q14.6**: Si OPCloud expone toggles explicitos de `Bold` / `Italic` como controles separados o si estan dentro de `Font family` — cf. HU-14.006.
- **Q14.7**: Comportamiento de multi-seleccion mixta (cosas + enlaces) en grupo `Style` — cf. HU-14.016.
- **Q14.8**: Si el estilado se preserva o se descarta en los interop (OPCat, CSV) — cf. HU-14.017 y §7.1 fuente.
- **Q14.9**: Feedback visual al usuario cuando hay estilo en clipboard de `Copy style` (toast, cursor, estado de boton) — cf. HU-14.013.
- **Q14.10**: Comportamiento del texto cuando `font_size` excede el bounding box del shape — cf. HU-14.005 (truncar, ajustar, overflow).

## Referencias cruzadas

- Doc fuente: `opcloud-reverse/14-canvas-styling.md`.
- Fuente normativa: `opm-visual-es.md` [V-63], `opm-iso-19450-es.md`.
- Evidencia OPCloud: `JOYAS.md` §1 colores, §2 dimensiones, §3 tipografia, §4 wrapper+line.
- Epicas que dependen o interactuan con esta:
  - **EPICA-10** (creacion de cosas — provee el sujeto a estilar).
  - **EPICA-16** (propiedades de enlaces — comparte dialogo de propiedades).
  - **EPICA-30** (save/load — persiste los overrides).
  - **EPICA-60** (export PDF — debe honrar estilos).
  - **EPICA-61** (export SVG — debe honrar estilos).
  - **EPICA-70** (interop OPCat — que hace con estilos).
  - **EPICA-81** (config style defaults — defaults globales que los overrides sobrescriben).
  - **EPICA-90** (shortcuts — Ctrl+Shift+C/V hipoteticos y undo/redo).
- Invariantes del repo:
  - `src/render/jointjs/` (factories de shapes y enlaces — aplican atributos visuales).
  - `src/render/opl-renderer.ts` (debe ser insensible a overrides de estilo — invariante §4.1).
  - `src/nucleo/tipos.ts` (kernel NO contiene campos de estilo; el estilado vive en namespace separado).
  - `src/persistencia/` (serializacion del namespace de estilo junto al modelo).
- SSOT OPM:
  - `opm-visual-es.md` [V-63] — colores informativos, no normativos (anclaje normativo central de esta epica).
  - `opm-visual-es.md` [V-1 §1.2] — convenciones de contorno continuo/discontinuo.
  - JOYAS §1 (#70E483, #3BC3FF, #586D8C), §2 (135x60), §3 (Arial 14px semibold), §4 (wrapper+line 15px/2px).
