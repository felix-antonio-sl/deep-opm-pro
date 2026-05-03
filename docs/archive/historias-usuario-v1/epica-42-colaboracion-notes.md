---
epica: "EPICA-42"
titulo: "Colaboracion — notas (sticky notes del OPD, anclaje, toggle, integracion)"
doc_fuente: "opcloud-reverse/42-colaboracion-notes.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "S"
hu_emitidas: 22
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "epica-10-canvas-creacion-cosas.md"
revision_piloto: "epica-10-canvas-creacion-cosas.md"
ultima_actualizacion: 2026-04-23
---

## Resumen

Esta epica cubre la capa de **anotaciones no-gramaticales** sobre el OPD: sticky notes amarillas con pushpin rojo, titulo y cuerpo editables, opcionalmente ancladas a una cosa OPM por una linea discontinua corta. Las notas son un **artefacto de canvas, no una primitiva OPM**: no forman parte del OPL, no aparecen en el arbol de OPDs y no tienen contraparte gramatical. Su proposito es canal autoral (recordatorios, marginalia, observaciones de revision) y soporte basico a flujos colaborativos intra-modelo.

El alcance de esta epica incluye: left pane conceptual de notas del OPD, creacion por doble clic, edicion inline de titulo y cuerpo, movimiento, redimensionado, anclaje a cosa, listado por OPD, filtrado, navegacion, eliminacion, toggle global de visibilidad, settings de usuario, integracion con OPD Navigator y con exportacion. Quedan **fuera** de esta epica: chat multi-modelador (`EPICA-41`), permisos (`EPICA-40`), descripcion larga adjunta a un Object (`EPICA-17`).

Nota importante sobre granularidad: el corpus de reverse de OPCloud no observa directamente un *left pane de notas* separable del secondary-toolbar `Toggle Notes`. Se mantienen HU para esa superficie por estar pedida explicitamente en el alcance del trabajo; se marcan como `requires-clarification` cuando la evidencia no cubre su comportamiento. Lo mismo vale para rich text / markdown, historial de cambios, permisos intra-modelo, visibilidad public/private e integracion con chat: son extensiones naturales pedidas por el brief, no observaciones de OPCloud, y se marcan apropiadamente.

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-42.001 | Crear nota por doble clic en zona vacia del canvas | CO | S | M | opcloud-ui | — |
| HU-42.002 | Editar titulo de nota con doble clic sobre la franja superior | CO | S | S | opcloud-ui | — |
| HU-42.003 | Editar cuerpo de nota con doble clic sobre el area de comentario | CO | S | S | opcloud-ui | — |
| HU-42.004 | Confirmar edicion con boton Update del editor inline | CO | S | XS | opcloud-ui | — |
| HU-42.005 | Mover nota por drag desde handle central | CO | S | S | opcloud-ui | — |
| HU-42.006 | Redimensionar nota con handles de esquina/borde | CO | S | S | opcloud-ui | — |
| HU-42.007 | Anclar nota a una cosa OPM con linea discontinua corta | CO | S | M | opcloud-ui | — |
| HU-42.008 | Eliminar nota con tecla Delete o icono papelera | CO | S | S | opcloud-ui | — |
| HU-42.009 | Ocultar y mostrar todas las notas con Toggle Notes | CO | S | S | opcloud-ui | — |
| HU-42.010 | Configurar Show notes by default en OPCloud Settings | CO | C | XS | opcloud-ui | — |
| HU-42.011 | Listar notas del OPD actual en panel lateral de notas | CO | C | M | opcloud-ui | — |
| HU-42.012 | Navegar al elemento anclado haciendo clic en nota del panel | CO | C | S | opcloud-ui | — |
| HU-42.013 | Filtrar notas del panel por autor | CO | C | S | opcloud-ui | — |
| HU-42.014 | Filtrar notas del panel por asociacion (cosa / enlace / OPD) | CO | C | S | opcloud-ui | — |
| HU-42.015 | Editar nota con markdown ligero en el cuerpo | CO | C | M | opcloud-ui | — |
| HU-42.016 | Atribuir autor y timestamp automaticos a cada nota | CO | C | M | opcloud-ui | — |
| HU-42.017 | Conservar historial de cambios de la nota (audit trail) | CO | C | L | opcloud-ui | — |
| HU-42.018 | Marcar nota como privada o publica dentro del modelo | CO | W | M | opcloud-ui | — |
| HU-42.019 | Persistir notas en el JSON del modelo al guardar | CO | S | S | opcloud-ui | — |
| HU-42.020 | Incluir notas visibles en exportaciones PNG/SVG/PDF del OPD | CO | C | S | opcloud-ui | — |
| HU-42.021 | Mostrar nota como bloque amarillo en OPD Navigator | CO | S | XS | opcloud-ui | — |
| HU-42.022 | Convertir nota en mensaje de chat del modelo | CO | W | M | opcloud-ui | — |

Total: **22 historias de usuario** (22 opcloud-ui).

## Historias de usuario

### HU-42.001 — Crear nota por doble clic en zona vacia del canvas

**Actor primario:** CO (colaborador editor).
**Actores secundarios:** RV (revisor — si tiene permiso de escritura), ME (experto).
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/42 §3.1, §5.3, §9; frames: frame_00042, frame_00043.
**Nivel categorico:** K (kernel — crea entidad `nota` paralela a `cosa`) primario; V (render sticky) y U (editor inline) secundarios.
**Superficie UI:** canvas-opd + sticky-nota-primitiva + editor-inline.
**Gesto canonico:** doble clic sobre zona vacia del canvas (sin cosa ni enlace bajo el cursor).

**Historia:**
> Como colaborador, quiero crear una nota haciendo doble clic sobre una zona vacia del canvas para capturar una observacion sin cambiar de contexto ni abrir un dialogo aparte.

**Contexto de negocio:**
Las notas son el canal autoral mas liviano del modelador: marginalia, recordatorios, preguntas abiertas de revision. El doble clic sobre zona vacia es un gesto geometrico autoexplicativo que no compite con otros gestos del canvas (drag crea enlaces/mueve cosas, clic simple selecciona). Permite capturar pensamiento sin abandonar el flujo de modelado.

**Criterios de aceptacion:**
- **Dado** que estoy en un OPD con permiso de escritura, **cuando** hago doble clic en una zona del canvas sin cosa ni enlace bajo el cursor, **entonces** se inserta una sticky nota amarilla en esa posicion con pushpin rojo en esquina superior-izquierda, franja de titulo con texto por defecto y cuerpo con placeholder `Type your comentario here...`.
- **Dado** que la nota acaba de aparecer, **cuando** se termina de renderizar, **entonces** se abre automaticamente el editor inline con cuadro de texto y boton `Update`, y se muestra el tooltip `Double click to edit text`.
- **Dado** que hago doble clic **sobre una cosa OPM** existente, **cuando** ocurre el gesto, **entonces** NO se crea nota — el doble clic sobre cosa dispara edicion de nombre (comportamiento de EPICA-10).
- **Dado** que existen ya N notas en el OPD, **cuando** creo una nueva sin renombrar, **entonces** el titulo default es serial (`Nota N+1 titulo`).
- **Dado** que cree una nota, **cuando** consulto el OPL pane, **entonces** NO aparece ninguna oracion nueva — las notas no participan del OPL.

**Reglas y restricciones:**
- La nota pertenece al OPD donde se crea; no se comparte entre OPDs (inferido del hecho de que aparece en la miniatura del Navigator local).
- Color de fondo: amarillo palido reservado (no debe reutilizarse para cosas OPM).
- Pushpin rojo: marca de identidad consistente, ninguna otra primitiva lo usa.
- Gesto: **doble clic**, no clic simple ni drag — el drag en zona vacia hace pan del canvas.

**Modelo de datos tocado:**
- `nota.id` — UUID — persistente.
- `nota.opd` — ID del OPD padre — persistente.
- `nota.titulo` — string — persistente (default `Nota N titulo`).
- `nota.cuerpo` — string — persistente (default vacio o placeholder).
- `nota.posicion` — `{x, y}` — persistente.
- `nota.tamano` — `{w, h}` — persistente (defaults observables en `frame_00043`).

**Dependencias:**
- Bloquea a: HU-42.002, HU-42.003, HU-42.005, HU-42.006, HU-42.007, HU-42.008, HU-42.009, HU-42.021.

**Integraciones:**
- OPD Navigator (HU-42.021): miniatura incluye la nota.
- OPL pane: invariante — no se emite oracion.
- Persistencia (HU-42.019): serializacion en el JSON del modelo.

**Notas de evidencia:**
- Transcripcion: "working with nodes is easy — double clicking everywhere on the screen where there isn't any element will add a note" (ASR `nodes` ≡ `notes`).
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [notas, ui, creacion, double-clic, canvas, sticky-nota].

---

### HU-42.002 — Editar titulo de nota con doble clic sobre la franja superior

**Actor primario:** CO.
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/42 §3.2.
**Nivel categorico:** U primario; K (persiste `nota.titulo`) secundario.
**Superficie UI:** franja-titulo-nota + editor-inline.
**Gesto canonico:** doble clic sobre la franja superior de la nota.

**Historia:**
> Como colaborador, quiero editar el titulo de una nota haciendo doble clic sobre su franja superior para identificarla sin abrir ningun dialogo.

**Contexto de negocio:**
El titulo compacta la intencion de la nota y es la clave de busqueda/listado mas usable. Editarlo con el mismo gesto geometrico (doble clic) que el resto de la UI de notas mantiene consistencia cognitiva.

**Criterios de aceptacion:**
- **Dado** que tengo una nota con titulo `Nota 1 titulo`, **cuando** hago doble clic sobre la franja superior, **entonces** se abre un editor inline con el texto del titulo preseleccionado y boton `Update`.
- **Dado** que el editor de titulo esta abierto, **cuando** escribo nuevo texto y confirmo con `Update`, **entonces** `nota.titulo` queda persistido y el editor se cierra.
- **Dado** que el editor esta abierto, **cuando** cancelo (ESC o clic fuera), **entonces** el titulo previo se conserva.
- **Dado** que renombro el titulo, **cuando** abro el panel lateral de notas (HU-42.011), **entonces** la entrada refleja el nuevo titulo.

**Reglas y restricciones:**
- El titulo y el cuerpo son campos independientes (HU-42.003).
- No hay limite duro de longitud observado; sugerencia suave de ≤80 caracteres.

**Modelo de datos tocado:**
- `nota.titulo` — string — persistente.

**Dependencias:**
- Bloqueada por: HU-42.001.

**Integraciones:**
- Panel lateral de notas (HU-42.011).
- OPD Navigator: no se refleja en miniatura (el titulo no se dibuja a esa escala — inferido).

**Notas de evidencia:**
- Transcripcion: "you can change the title or you can change the note itself — double click to edit".
- Clase de afirmacion: confirmado por transcripcion + inferido (campos independientes).

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [notas, ui, edicion, double-clic, titulo, popup-inline].

---

### HU-42.003 — Editar cuerpo de nota con doble clic sobre el area de comentario

**Actor primario:** CO.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/42 §3.2; frame_00042.
**Nivel categorico:** U primario; K (persiste `nota.cuerpo`).
**Superficie UI:** cuerpo-nota + editor-inline.
**Gesto canonico:** doble clic sobre el area de comentario.

**Historia:**
> Como colaborador, quiero editar el cuerpo de la nota haciendo doble clic sobre el area de comentario para desarrollar la observacion sin salir del canvas.

**Contexto de negocio:**
El cuerpo de la nota es el texto principal — la marginalia propiamente dicha. Separar la edicion del cuerpo de la del titulo permite modificar una sin tocar la otra.

**Criterios de aceptacion:**
- **Dado** que tengo una nota con cuerpo vacio o con texto, **cuando** hago doble clic sobre el area de cuerpo, **entonces** se abre el editor inline (`Type your comentario here...` si vacio, texto actual si no) con boton `Update`.
- **Dado** que escribo texto multi-linea y confirmo con `Update`, **entonces** `nota.cuerpo` queda persistido con saltos de linea preservados.
- **Dado** que cancelo, **entonces** el cuerpo previo se mantiene.
- **Dado** que el cuerpo es largo, **cuando** no cabe visualmente, **entonces** la nota se ensancha automaticamente o aparece scroll interno — comportamiento a definir (ver HU-42.006 para resize manual).

**Reglas y restricciones:**
- El cuerpo acepta texto plano en la version base; markdown queda para HU-42.015.
- El area de cuerpo es distinta de la franja de titulo; el doble clic sobre la franja dispara HU-42.002.

**Modelo de datos tocado:**
- `nota.cuerpo` — string — persistente.

**Dependencias:**
- Bloqueada por: HU-42.001.
- Relaciona: HU-42.006 (resize), HU-42.015 (markdown).

**Integraciones:**
- Panel lateral de notas: puede mostrar preview truncado del cuerpo.
- OPD Navigator: cuerpo no visible en miniatura.

**Notas de evidencia:**
- Transcripcion: "you can change the title or you can change the note itself — double click to edit".
- Clase de afirmacion: confirmado por transcripcion + inferido (campos independientes).

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [notas, ui, edicion, double-clic, cuerpo, popup-inline].

---

### HU-42.004 — Confirmar edicion con boton Update del editor inline

**Actor primario:** CO.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/42 §3.1 paso 3, §3.2 paso 3; frame_00042.
**Nivel categorico:** U.
**Superficie UI:** editor-inline (boton Update).
**Gesto canonico:** clic en boton `Update` (o `Enter` como alternativa).

**Historia:**
> Como colaborador, quiero confirmar la edicion de titulo o cuerpo con el boton `Update` o con `Enter` para cerrar el editor en un solo gesto.

**Contexto de negocio:**
El boton explicito orienta al novato; `Enter` acelera al experto. El patron es identico al popup de naming de cosas (HU-10.005), lo que preserva consistencia de afordance.

**Criterios de aceptacion:**
- **Dado** que un editor de titulo o cuerpo esta abierto, **cuando** hago clic en `Update`, **entonces** el valor escrito queda persistido y el editor se cierra.
- **Dado** que el editor esta abierto, **cuando** presiono `Enter` dentro del campo, **entonces** comportamiento identico a `Update` — **pregunta abierta**: si el cuerpo acepta multi-linea, `Enter` podria necesitar `Ctrl+Enter` u otra combinacion para confirmar.
- **Dado** que confirme, **cuando** el editor cierra, **entonces** el foco vuelve al canvas y la nota muestra el nuevo contenido.

**Reglas y restricciones:**
- `Update` siempre visible mientras el editor esta abierto.
- La confirmacion es no-destructiva: no borra datos no-editados.

**Dependencias:**
- Bloqueada por: HU-42.002 o HU-42.003.

**Integraciones:**
- Persistencia: si el modelo tiene autosave, el Update dispara checkpoint.

**Notas de evidencia:**
- Clase de afirmacion: observado (boton Update visible) + inferido (shortcut Enter, paralelo a HU-10.005).
- Etiqueta: `requires-clarification` (comportamiento de `Enter` vs multi-linea).

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [notas, ui, edicion, popup-inline, update, shortcut, requires-clarification].

---

### HU-42.005 — Mover nota por drag desde handle central

**Actor primario:** CO.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/42 §3.3; frames: frame_00042, frame_00043.
**Nivel categorico:** U primario; K (actualiza `nota.posicion`).
**Superficie UI:** nota-seleccionada + handle-central-cruz.
**Gesto canonico:** mousedown sobre el handle central + drag.

**Historia:**
> Como colaborador, quiero reposicionar una nota arrastrandola por el handle central para moverla sin disparar edicion accidental.

**Contexto de negocio:**
El handle dedicado (cruz 4-direcciones) evita colisiones con los dobles clics de edicion. El drag desde cuerpo podria interpretarse como inicio de edicion o inicio de anclaje, asi que el handle central desambigua el gesto.

**Criterios de aceptacion:**
- **Dado** que tengo una nota seleccionada, **cuando** aparece el handle central tipo cruz, **entonces** puedo agarrarlo con mousedown.
- **Dado** que hago drag desde el handle central, **cuando** muevo el cursor, **entonces** la nota sigue el cursor.
- **Dado** que suelto el drag, **cuando** termina el gesto, **entonces** `nota.posicion` se actualiza con las nuevas coordenadas.
- **Dado** que hice mousedown sobre la franja de titulo, **cuando** suelto sin mover (clic corto), **entonces** NO se inicia movimiento — se selecciona o se activa doble clic si corresponde.
- **Dado** que muevo la nota, **cuando** tenia anclaje (HU-42.007), **entonces** la linea discontinua se reconecta al nuevo origen siguiendo a la nota.

**Reglas y restricciones:**
- Handle central: cruz de 4 direcciones, glifo observable en `frame_00042` y `frame_00043`.
- El drag desde cuerpo fuera del handle: **pregunta abierta** (§11 doc no aclara).
- Collision detection con cosas: inferido que no existe — las notas pueden superponerse visualmente.

**Modelo de datos tocado:**
- `nota.posicion.x`, `nota.posicion.y` — persistente.

**Dependencias:**
- Bloqueada por: HU-42.001.
- Relaciona: HU-42.007 (anclaje sigue a la nota).

**Integraciones:**
- OPD Navigator: refresca posicion del bloque amarillo.
- Layout algoritmico (`src/render/layout/`): invariante — el layout NO reposiciona notas; son libres.

**Notas de evidencia:**
- Transcripcion: "you can use it to move it".
- Clase de afirmacion: observado (handle) + confirmado por transcripcion (drag).

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [notas, ui, drag, movimiento, handle, posicion].

---

### HU-42.006 — Redimensionar nota con handles de esquina/borde

**Actor primario:** CO.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/42 §2, §6; frame_00043.
**Nivel categorico:** U primario; K (actualiza `nota.tamano`).
**Superficie UI:** nota-seleccionada + handles-resize.
**Gesto canonico:** drag desde handle de esquina o borde.

**Historia:**
> Como colaborador, quiero redimensionar una nota arrastrando sus handles para ajustar el tamano al volumen de texto que contiene.

**Contexto de negocio:**
Las notas varian de una linea a varios parrafos. El redimensionado manual evita que notas largas se corten o que notas cortas ocupen espacio desproporcionado.

**Criterios de aceptacion:**
- **Dado** que tengo una nota seleccionada, **cuando** miro sus bordes, **entonces** veo handles de resize tipo cuadrado negro en esquinas y/o bordes (observado en `frame_00043`).
- **Dado** que hago drag desde un handle de esquina, **cuando** arrastro diagonalmente, **entonces** la nota cambia ancho y alto manteniendo esquina opuesta fija.
- **Dado** que hago drag desde un handle de borde, **cuando** arrastro, **entonces** solo cambia la dimension correspondiente.
- **Dado** que suelto, **cuando** termina el drag, **entonces** `nota.tamano` se persiste.
- **Dado** que el cuerpo es mas largo que el nuevo tamano, **cuando** redimensiono a mas pequeno, **entonces** el texto se trunca visualmente o aparece scroll — comportamiento a definir.

**Reglas y restricciones:**
- Tamano minimo razonable para que pushpin + titulo + cuerpo sigan visibles.
- Aspect ratio libre.

**Modelo de datos tocado:**
- `nota.tamano.w`, `nota.tamano.h` — persistente.

**Dependencias:**
- Bloqueada por: HU-42.001.

**Integraciones:**
- OPD Navigator.

**Notas de evidencia:**
- Clase de afirmacion: observado (handles visibles) + inferido (gesto de resize).

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [notas, ui, drag, resize, handle, tamano].

---

### HU-42.007 — Anclar nota a una cosa OPM con linea discontinua corta

**Actor primario:** CO.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/42 §3.4; frame_00044.
**Nivel categorico:** K (crea `nota.ancla`) primario; V (render dashed) y U (drag) secundarios.
**Superficie UI:** canvas-opd + linea-anclaje.
**Gesto canonico:** drag desde el borde de la nota hacia una cosa OPM.

**Historia:**
> Como colaborador, quiero anclar una nota a una cosa OPM arrastrando desde su borde hasta la cosa para asociar la observacion a su objeto semantico sin contaminar el OPL.

**Contexto de negocio:**
Una nota flotante pierde contexto; una nota anclada explicita a que se refiere. La linea discontinua fina y gris es visualmente disimilar al dashed grueso del contorno ambiental y a los enlaces OPM, lo que senala su naturaleza no-semantica. El anclaje NO crea oracion OPL.

**Criterios de aceptacion:**
- **Dado** que tengo una nota y una cosa OPM en el canvas, **cuando** hago drag desde el borde de la nota (fuera del handle central y fuera del titulo/cuerpo) hasta la cosa, **entonces** se crea una linea discontinua corta gris entre ambos.
- **Dado** que cree el anclaje, **cuando** consulto el OPL pane, **entonces** no aparece ninguna oracion nueva — el anclaje no es un enlace OPM.
- **Dado** que el anclaje se creo, **cuando** guardo y recargo, **entonces** `nota.ancla` persiste la referencia a `cosa.id`.
- **Dado** que muevo la cosa anclada, **cuando** termina el drag, **entonces** la linea se re-rutea al nuevo borde.
- **Dado** que muevo la nota anclada, **cuando** termina el drag, **entonces** la linea se re-rutea al nuevo borde de la nota.
- **Dado** que elimino la cosa anclada (HU-1C.xxx), **cuando** se borra, **entonces** **pregunta abierta**: ¿la linea se elimina, la nota queda flotante, o bloquea la eliminacion? (§11 Q7).

**Reglas y restricciones:**
- Estilo visual: discontinua corta, gris medio, ~1px — visualmente distinguible de todos los enlaces OPM y del borde dashed ambiental.
- El anclaje NO abre la tabla de enlaces — es un vinculo no-semantico.
- Cardinalidad: **pregunta abierta** sobre si una nota puede tener multiples anclas simultaneas (§11 Q3); la evidencia muestra solo uno-a-uno.

**Modelo de datos tocado:**
- `nota.ancla` — `cosa.id | null` (nullable) — persistente.

**Dependencias:**
- Bloqueada por: HU-42.001, HU-10.001/002 (necesita cosa a la que anclar).
- Relaciona: HU-1C.xxx (eliminacion de cosa).

**Integraciones:**
- Renderer: pass dedicado para lineas de anclaje, separado del pass de enlaces OPM.
- Layout: los anclajes no participan del ruteo OPM estandar.

**Notas de evidencia:**
- Transcripcion: "you can link with a dashed link a note to any object or process on the screen".
- Clase de afirmacion: confirmado por transcripcion + observado (estilo visual) + inferido (gesto de drag desde borde).
- Etiqueta: `requires-clarification` (cardinalidad, gesto exacto §11 Q6, efecto de eliminacion §11 Q7).

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [notas, ui, anclaje, dashed, anchor, drag, requires-clarification].

---

### HU-42.008 — Eliminar nota con tecla Delete o icono papelera

**Actor primario:** CO.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/42 §3.6; frame_00043.
**Nivel categorico:** K (borra entidad `nota`).
**Superficie UI:** nota-seleccionada + secondary-toolbar (icono papelera) + teclado.
**Gesto canonico:** seleccion + `Delete` o clic en papelera de secondary-toolbar.

**Historia:**
> Como colaborador, quiero eliminar definitivamente una nota con `Delete` o con el icono papelera para limpiar anotaciones obsoletas.

**Contexto de negocio:**
El toggle (HU-42.009) solo oculta; hace falta una accion de borrado duro. La transcripcion distingue claramente: "removing them will just remove them" vs "toggling will not delete them".

**Criterios de aceptacion:**
- **Dado** que tengo una nota seleccionada, **cuando** presiono `Delete`, **entonces** la nota se elimina del modelo y desaparece del canvas, del OPD Navigator y del panel lateral de notas.
- **Dado** que tengo una nota seleccionada, **cuando** hago clic en el icono de papelera de la secondary toolbar, **entonces** comportamiento identico a `Delete`.
- **Dado** que la nota tenia anclaje, **cuando** se elimina, **entonces** la linea de anclaje tambien se elimina.
- **Dado** que elimine la nota, **cuando** consulto el OPL pane, **entonces** invariante: no habia oracion asociada, tampoco hay delta.
- **Dado** que elimine por error, **cuando** presiono `Ctrl+Z` (undo, HU-90.xxx), **entonces** **pregunta abierta**: si el undo restaura la nota.

**Reglas y restricciones:**
- La eliminacion es definitiva (salvo undo).
- No pide confirmacion explicita observada; se asume accion directa.
- Seleccion multiple de notas + delete: **pregunta abierta**.

**Modelo de datos tocado:**
- Remueve `nota.*` del modelo.
- Remueve anclaje si existia.

**Dependencias:**
- Bloqueada por: HU-42.001.
- Relaciona: HU-90.xxx (undo).

**Integraciones:**
- Panel lateral de notas: decrementa conteo.
- OPD Navigator: remueve bloque amarillo.

**Notas de evidencia:**
- Transcripcion: "removing them will just remove them".
- Clase de afirmacion: confirmado por transcripcion + inferido (gesto exacto de `Delete`).

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [notas, ui, eliminacion, delete, secondary-toolbar].

---

### HU-42.009 — Ocultar y mostrar todas las notas con Toggle Notes

**Actor primario:** CO.
**Actores secundarios:** RV (revisor leyendo un modelo sin distracciones).
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/42 §3.5, §5.1; frames: frame_00040, frame_00044, frame_00045.
**Nivel categorico:** V (render switch) primario; C (config transitoria) secundario.
**Superficie UI:** secondary-toolbar (boton `Toggle Notes`).
**Gesto canonico:** clic en boton `Toggle Notes`.

**Historia:**
> Como colaborador, quiero ocultar y mostrar todas las notas del OPD con un boton para alternar entre la vista de modelado puro y la vista con anotaciones sin borrar nada.

**Contexto de negocio:**
El modelador alterna entre dos modos: el trabajo puro sobre OPM (donde las notas distraen) y la revision colaborativa (donde las notas son el canal). El toggle permite esa alternancia sin costo — las notas siguen existiendo, solo se ocultan visualmente.

**Criterios de aceptacion:**
- **Dado** que hay N notas visibles en el OPD, **cuando** hago clic en el boton `Toggle Notes` de la secondary toolbar, **entonces** todas las notas se ocultan visualmente del canvas.
- **Dado** que las notas estan ocultas, **cuando** hago clic de nuevo en `Toggle Notes`, **entonces** todas reaparecen en sus posiciones previas.
- **Dado** que hago toggle off, **cuando** guardo y recargo, **entonces** **pregunta abierta**: ¿el estado del toggle se persiste con el modelo o es transitorio? (relacionado con HU-42.010).
- **Dado** que hago toggle off y luego elimino una nota mientras esta oculta: **pregunta abierta** — ¿el delete funciona sin ver la nota? (cardinalidad con HU-42.008).
- **Dado** que hago toggle off, **cuando** miro el OPD Navigator, **entonces** **pregunta abierta**: las miniaturas reflejan el toggle o no (§11).

**Reglas y restricciones:**
- Tooltip literal: `Toggle Notes` (observado en frame_00040 y frame_00044).
- Alcance: **todas las notas del OPD actual** (no selectivo por nota).
- No-destructivo: el modelo conserva todas las notas.
- Alcance cross-OPD: **pregunta abierta** (§11 Q4) — evidencia consistente con per-OPD pero no concluyente.

**Modelo de datos tocado:**
- `opd.notasVisibles` — boolean transitoria (hipotesis: preferencia de render, no persistida).

**Dependencias:**
- Bloqueada por: HU-42.001.
- Relaciona: HU-42.010 (default de settings).

**Integraciones:**
- Renderer: pass condicional para la capa de notas.
- OPD Navigator: comportamiento con toggle off abierto.

**Notas de evidencia:**
- Transcripcion: "if I will toggle the notes out it will not delete them, it will just hide them — toggle the notes back will show them again".
- Clase de afirmacion: confirmado por transcripcion + observado.
- Etiqueta: `requires-clarification` (persistencia del estado, alcance cross-OPD).

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [notas, ui, toggle, secondary-toolbar, render, requires-clarification].

---

### HU-42.010 — Configurar Show notes by default en OPCloud Settings

**Actor primario:** CO.
**Actores secundarios:** AO (admin — si hay override organizacional).
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/42 §5.2.
**Nivel categorico:** C (config de usuario).
**Superficie UI:** main-menu → OPCloud Settings → General → `Show notes by default` (toggle).
**Gesto canonico:** clic en toggle del panel de settings.

**Historia:**
> Como colaborador, quiero configurar en settings si las notas se muestran por defecto al abrir cualquier modelo para controlar mi estado inicial de trabajo.

**Contexto de negocio:**
La preferencia evita que cada vez que abro un modelo tenga que activar/desactivar manualmente el toggle de la toolbar. Respeta patrones de usuario (un modelador que siempre trabaja con notas ocultas no deberia activarlas cada vez).

**Criterios de aceptacion:**
- **Dado** que abro OPCloud Settings → General, **cuando** miro las opciones, **entonces** existe un toggle `Show notes by default`.
- **Dado** que marco el toggle en `on`, **cuando** abro cualquier modelo, **entonces** las notas son visibles desde el inicio.
- **Dado** que marco el toggle en `off`, **cuando** abro cualquier modelo, **entonces** las notas estan ocultas desde el inicio (el toggle de la toolbar las puede mostrar).
- **Dado** que cambio la preferencia, **cuando** cierro settings, **entonces** la preferencia persiste entre sesiones.

**Reglas y restricciones:**
- Preferencia por usuario, no por modelo.
- Override organizacional: **pregunta abierta** (relaciona EPICA-80).

**Modelo de datos tocado:**
- `usuario.preferencias.mostrarNotasPorDefecto` — boolean — persistente.

**Dependencias:**
- Relaciona: HU-42.009 (toggle de la toolbar), EPICA-80 (user config).

**Integraciones:**
- Sistema de settings de OPCloud (EPICA-80).

**Notas de evidencia:**
- Transcripcion (Intro 13 OPCloud Settings): "I can select whether to show the notes by default yes or no — this is also connected to the button of the notes that we've seen in the secondary toolbar".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [notas, config, settings, default, user-preference].

---

### HU-42.011 — Listar notas del OPD actual en panel lateral de notas

**Actor primario:** CO.
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Fuente:** brief del trabajo (hipotesis de diseno, no observado en OPCloud).
**Nivel categorico:** L (lente derivada del modelo) primario; U secundario.
**Superficie UI:** panel-lateral-notas (left pane — HIPOTESIS de diseno, no observado).
**Gesto canonico:** ninguno (panel pasivo, render automatico).

**Historia:**
> Como colaborador, quiero ver un panel lateral con la lista de todas las notas del OPD actual para escanear rapidamente las anotaciones existentes sin depender del canvas.

**Contexto de negocio:**
En modelos con decenas de notas, el canvas se vuelve dificil de escanear. Un panel lateral con la lista de notas (titulo + preview del cuerpo) es una **lente** que acelera la revision. Este panel es pedido por el alcance del trabajo pero NO se observa en el corpus de OPCloud — se documenta como extension nueva natural.

**Criterios de aceptacion:**
- **Dado** que el OPD actual tiene N notas, **cuando** abro el panel lateral de notas, **entonces** veo N entradas con `nota.titulo` y preview truncado de `nota.cuerpo`.
- **Dado** que creo o elimino una nota, **cuando** ocurre el cambio, **entonces** el panel se actualiza en vivo (lente pura).
- **Dado** que renombro el titulo de una nota, **cuando** confirmo, **entonces** la entrada del panel refleja el nuevo titulo.
- **Dado** que cambio de OPD, **cuando** ocurre la navegacion, **entonces** el panel lista las notas del OPD nuevo.
- **Dado** que el OPD actual no tiene notas, **cuando** abro el panel, **entonces** veo un estado vacio con mensaje explicativo.

**Reglas y restricciones:**
- El panel es una **vista**, no almacena estado propio — se regenera desde el modelo.
- Orden por defecto: **pregunta abierta** — candidatos: creacion, posicion `(x,y)`, titulo alfabetico.
- Scope: OPD actual; alcance cross-OPD queda para HU posterior.

**Modelo de datos tocado:**
- Ninguno (read-only).

**Dependencias:**
- Bloqueada por: HU-42.001.
- Relaciona: HU-42.012 (navegacion), HU-42.013 (filtro autor), HU-42.014 (filtro asociacion).

**Integraciones:**
- Lente del modelo: re-render al cambiar `nota.*`.

**Notas de evidencia:**
- Fuente: brief del trabajo (no observado en `42-colaboracion-notes.md`). OPCloud no expone tal panel; es extension natural.
- Clase de afirmacion: hipotesis.
- Etiqueta: `requires-clarification` (decision de diseno sobre si existe o no este panel).

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [notas, ui, left-pane, lente, lista, requires-clarification].

---

### HU-42.012 — Navegar al elemento anclado haciendo clic en nota del panel

**Actor primario:** CO.
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Fuente:** brief del trabajo (extension natural).
**Nivel categorico:** U (navegacion) primario; V (viewport) secundario.
**Superficie UI:** panel-lateral-notas + canvas-opd.
**Gesto canonico:** clic en entrada de nota del panel.

**Historia:**
> Como colaborador, quiero hacer clic en una entrada del panel de notas para que el canvas haga pan/zoom hasta la nota y, si esta anclada, destaque la cosa ancla.

**Contexto de negocio:**
Escanear el panel y saltar a la ubicacion de la nota convierte el panel en indice navegable. Sin navegacion, el panel es meramente informativo.

**Criterios de aceptacion:**
- **Dado** que tengo el panel de notas abierto, **cuando** hago clic en una entrada, **entonces** el canvas hace pan/zoom hasta la posicion de la nota con la nota seleccionada.
- **Dado** que la nota tiene anclaje a una cosa, **cuando** clic en la entrada, **entonces** ademas de navegar a la nota, la cosa ancla queda visualmente destacada (halo temporal o highlight).
- **Dado** que la nota esta en otro OPD, **cuando** clic en la entrada, **entonces** **pregunta abierta**: si el scope es solo OPD actual (HU-42.011) esto no aplica; si es cross-OPD, se cambia al OPD destino.
- **Dado** que hice clic, **cuando** llego, **entonces** el estado del toggle `Toggle Notes` se fuerza a `on` si estaba `off` (sino no veo nada).

**Reglas y restricciones:**
- Pan + zoom animado suave, no salto brusco.
- El highlight de la cosa ancla es temporal (≤2s).

**Dependencias:**
- Bloqueada por: HU-42.011, HU-42.007 (para el caso anclado).

**Integraciones:**
- Viewport del canvas.
- Toggle Notes (se fuerza on).

**Notas de evidencia:**
- Fuente: brief del trabajo (extension natural).
- Clase de afirmacion: hipotesis.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [notas, ui, left-pane, navegacion, viewport, requires-clarification].

---

### HU-42.013 — Filtrar notas del panel por autor

**Actor primario:** CO.
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Fuente:** brief del trabajo (extension natural, no observada en corpus).
**Nivel categorico:** U (filtro) primario; L secundario.
**Superficie UI:** panel-lateral-notas (barra de filtros).
**Gesto canonico:** seleccion en dropdown `Autor`.

**Historia:**
> Como colaborador en un modelo con varios autores, quiero filtrar las notas del panel por autor para enfocarme solo en las observaciones de una persona.

**Contexto de negocio:**
En revision colaborativa, cada autor genera su conjunto de notas. Poder aislarlas ayuda a seguir hilos de feedback y a distinguir entre mis propias notas y las ajenas.

**Criterios de aceptacion:**
- **Dado** que el panel tiene un filtro de autor, **cuando** selecciono un autor especifico, **entonces** el panel muestra solo las notas cuyo `nota.autor` coincide.
- **Dado** que selecciono `Todos`, **cuando** se aplica el filtro, **entonces** el panel muestra todas las notas del OPD.
- **Dado** que hay notas sin autor (creadas antes de HU-42.016), **cuando** filtro por autor, **entonces** caen en un grupo `Sin autor` o quedan excluidas — comportamiento a definir.
- **Dado** que cambio de OPD, **cuando** se carga el nuevo, **entonces** el filtro se mantiene o se resetea — comportamiento a definir.

**Reglas y restricciones:**
- Bloqueada por HU-42.016 (atribucion de autor): sin autor no hay filtro por autor.
- El filtro afecta solo el panel, NO el canvas ni el toggle visual.

**Modelo de datos tocado:**
- Lee `nota.autor` (ver HU-42.016).

**Dependencias:**
- Bloqueada por: HU-42.011, HU-42.016.

**Integraciones:**
- Panel lateral de notas.

**Notas de evidencia:**
- Fuente: brief del trabajo (extension natural, no observada en corpus).
- Clase de afirmacion: hipotesis.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [notas, ui, left-pane, filtro, autor, requires-clarification].

---

### HU-42.014 — Filtrar notas del panel por asociacion (cosa / enlace / OPD)

**Actor primario:** CO.
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Fuente:** brief del trabajo (extension natural). OPCloud observa solo anclaje a cosa.
**Nivel categorico:** U (filtro) primario; L secundario.
**Superficie UI:** panel-lateral-notas (barra de filtros).
**Gesto canonico:** seleccion en dropdown `Asociacion`.

**Historia:**
> Como colaborador, quiero filtrar las notas del panel por tipo de asociacion (ancladas a cosa, ancladas a enlace, flotantes, ancladas al OPD) para aislar grupos de observaciones segun su objeto de referencia.

**Contexto de negocio:**
Una nota sobre una cosa especifica tiene otro peso que una nota general del OPD o una nota sobre un enlace. El filtro por tipo de anclaje permite tratar cada categoria por separado durante revision.

**Criterios de aceptacion:**
- **Dado** que el panel tiene filtro `Asociacion`, **cuando** selecciono `Anclada a cosa`, **entonces** el panel muestra solo notas con `nota.ancla` apuntando a un `cosa.id`.
- **Dado** que selecciono `Flotantes`, **cuando** se aplica, **entonces** el panel muestra notas con `nota.ancla = null`.
- **Dado** que selecciono `Anclada a enlace`, **cuando** se aplica, **entonces** muestra notas con `nota.ancla` apuntando a un `enlace.id` — **pregunta abierta**: OPCloud no observo anclaje a enlaces.
- **Dado** que selecciono `Anclada al OPD`, **cuando** se aplica, **entonces** muestra notas con anclaje al OPD mismo (no a una cosa concreta) — **pregunta abierta**.

**Reglas y restricciones:**
- Tipos de asociacion a soportar: cosa, enlace, OPD, flotante. Cosa y flotante son observables; enlace y OPD son hipotesis.
- El filtro es ortogonal a HU-42.013 (autor); se pueden combinar.

**Modelo de datos tocado:**
- Lee `nota.ancla` (shape a extender: `{tipo: "cosa"|"enlace"|"opd"|null, id}`).

**Dependencias:**
- Bloqueada por: HU-42.011, HU-42.007.

**Integraciones:**
- Panel lateral de notas.

**Notas de evidencia:**
- Fuente: brief del trabajo (extension natural). OPCloud observa solo anclaje a cosa.
- Clase de afirmacion: hipotesis + abierto (cardinalidad y tipos de anclaje).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [notas, ui, left-pane, filtro, anchor, requires-clarification].

---

### HU-42.015 — Editar nota con markdown ligero en el cuerpo

**Actor primario:** CO.
**Tipo:** opcloud-ui.
**Fuente:** brief del trabajo (extension natural). OPCloud no observa markdown.
**Nivel categorico:** V (render enriquecido) primario; U (editor extendido) secundario.
**Superficie UI:** editor-inline-cuerpo + render-nota.
**Gesto canonico:** edicion de texto con sintaxis markdown.

**Historia:**
> Como colaborador, quiero usar markdown ligero (negrita, italica, listas, enlaces, inline code) en el cuerpo de la nota para expresar estructura sin abandonar el flujo de escritura.

**Contexto de negocio:**
Las notas extensas son mini-documentos. Markdown ligero es el minimo comun denominador que permite estructurar sin un editor rich-text pesado. OPCloud NO observa markdown; esta HU es una mejora propuesta en el brief.

**Criterios de aceptacion:**
- **Dado** que edito el cuerpo de una nota, **cuando** escribo `**bold**`, `*italic*`, `- lista`, `[texto](url)`, `` `codigo` ``, **entonces** el render de la nota muestra el formato interpretado.
- **Dado** que guardo el cuerpo con markdown, **cuando** persisto, **entonces** `nota.cuerpo` guarda el texto fuente (no el HTML renderizado).
- **Dado** que cargo el modelo en un cliente que no soporta markdown (compatibilidad retrograda), **cuando** se renderiza, **entonces** el texto fuente sigue siendo legible (no hay tags HTML visibles).
- **Dado** que uso markdown no soportado (tablas, imagenes), **cuando** se renderiza, **entonces** se muestra el texto fuente sin romper la nota.

**Reglas y restricciones:**
- Subset soportado: negrita, italica, listas, enlaces, inline code. Explicitamente fuera: tablas, imagenes, HTML embebido.
- El render es opt-in visual; el texto guardado es el fuente markdown.
- Riesgo: colision con caracteres no-markdown en prosa natural. Mitigacion: render lenient.

**Modelo de datos tocado:**
- `nota.cuerpo` — string (markdown fuente) — persistente.
- Opcional: `nota.formatoCuerpo` — `"plain" | "markdown"` — persistente, default `"markdown"`.

**Dependencias:**
- Bloqueada por: HU-42.003.

**Integraciones:**
- Renderer de nota: pass de markdown.
- Export PDF/SVG (HU-42.020): debe preservar el render.

**Notas de evidencia:**
- Fuente: brief del trabajo (extension natural). OPCloud no observa markdown.
- Clase de afirmacion: hipotesis.
- Etiqueta: `requires-clarification` (subset markdown, interaccion con export).

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [notas, ui, edicion, markdown, rich-text, requires-clarification].

---

### HU-42.016 — Atribuir autor y timestamp automaticos a cada nota

**Actor primario:** CO.
**Actores secundarios:** AO, RV.
**Tipo:** opcloud-ui.
**Fuente:** §11 Q2 explicita; brief del trabajo.
**Nivel categorico:** P (persistencia) primario; K (shape de `nota`) secundario.
**Superficie UI:** panel-lateral-notas (muestra autor/fecha) + nota-seleccionada (tooltip con metadata).
**Gesto canonico:** ninguno (atribucion automatica).

**Historia:**
> Como colaborador en un modelo compartido, quiero que cada nota lleve automaticamente el autor que la creo y un timestamp para saber quien anoto que y cuando.

**Contexto de negocio:**
Sin atribucion, las notas son anonimas y no sirven para hilos de conversacion. OPCloud NO observa autor ni timestamp en los frames disponibles (§11 Q2 explicita). Esta HU resuelve esa brecha para soportar colaboracion real.

**Criterios de aceptacion:**
- **Dado** que creo una nota, **cuando** se persiste, **entonces** `nota.autor` toma el ID del usuario actual y `nota.creadoEn` toma el timestamp actual.
- **Dado** que edito titulo o cuerpo de una nota ajena, **cuando** guardo, **entonces** `nota.actualizadoEn` se actualiza pero `nota.autor` permanece.
- **Dado** que paso el cursor sobre una nota, **cuando** aparece un tooltip, **entonces** veo `Por <autor>, <fecha>`.
- **Dado** que abro el panel lateral (HU-42.011), **cuando** miro cada entrada, **entonces** el autor y la fecha son visibles.
- **Dado** que trabajo en modo offline sin sesion, **cuando** creo una nota, **entonces** `nota.autor` queda como `"anonymous"` o hereda una identidad local.

**Reglas y restricciones:**
- `nota.autor` es inmutable tras creacion (no editable por UI).
- `nota.actualizadoEn` se actualiza por cualquier edicion.
- Depende de infraestructura de identidad (sesion de usuario).

**Modelo de datos tocado:**
- `nota.autor` — string (user id) — persistente.
- `nota.creadoEn` — ISO 8601 — persistente.
- `nota.actualizadoEn` — ISO 8601 — persistente.

**Dependencias:**
- Bloqueada por: HU-42.001.
- Relaciona: HU-42.013 (filtro por autor), HU-42.017 (historial).

**Integraciones:**
- Sistema de identidad / sesion.
- Panel lateral, tooltip.

**Notas de evidencia:**
- Fuente: §11 Q2 ("¿Existe alguna forma de atribuir autor/timestamp? No se observa").
- Clase de afirmacion: abierto + hipotesis.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [notas, persistencia, autor, timestamp, identidad, requires-clarification].

---

### HU-42.017 — Conservar historial de cambios de la nota (audit trail)

**Actor primario:** CO.
**Actores secundarios:** AO.
**Tipo:** opcloud-ui.
**Fuente:** brief del trabajo (extension natural, no observada en corpus).
**Nivel categorico:** P (persistencia) primario; U (viewer de historial) secundario.
**Superficie UI:** detalle-nota (pestana `Historial`).
**Gesto canonico:** clic en pestana `Historial` en el detalle de la nota.

**Historia:**
> Como colaborador, quiero ver el historial de cambios de una nota (quien edito que y cuando) para auditar la evolucion de una observacion en colaboracion.

**Contexto de negocio:**
Cuando multiples autores editan la misma nota, perder el hilo de cambios deteriora la confianza. Un audit trail simple (entrada por edicion: actor, timestamp, diff) resuelve el problema.

**Criterios de aceptacion:**
- **Dado** que una nota ha sido editada N veces, **cuando** abro su historial, **entonces** veo N entradas con actor, timestamp y diff resumido (campo modificado + valor previo/nuevo).
- **Dado** que restauro una version previa, **cuando** confirmo, **entonces** la nota actual toma los valores de esa version y se agrega una nueva entrada de historial.
- **Dado** que elimino la nota (HU-42.008), **cuando** se borra, **entonces** el historial se elimina con ella — o queda en papelera segun politica de organizacion.
- **Dado** que el historial supera N entradas (umbral a definir), **cuando** se agrega una nueva, **entonces** las mas antiguas se archivan o descartan.

**Reglas y restricciones:**
- Una entrada por edicion atomica (titulo O cuerpo O posicion O tamano O anclaje).
- Tamano del historial: umbral configurable.

**Modelo de datos tocado:**
- `nota.historial[]` — array de `{actor, timestamp, campo, valorPrevio, valorNuevo}` — persistente.

**Dependencias:**
- Bloqueada por: HU-42.016 (actor requerido).
- Relaciona: HU-42.019 (persistencia en JSON).

**Integraciones:**
- Persistencia del modelo: crece linealmente con ediciones.

**Notas de evidencia:**
- Fuente: brief del trabajo (extension natural, no observada en corpus).
- Clase de afirmacion: hipotesis.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** L.
**Etiquetas:** [notas, persistencia, historial, audit, requires-clarification].

---

### HU-42.018 — Marcar nota como privada o publica dentro del modelo

**Actor primario:** CO.
**Actores secundarios:** AO, RV.
**Tipo:** opcloud-ui.
**Fuente:** brief del trabajo. OPCloud no observa visibility por nota.
**Nivel categorico:** P (persistencia) primario; C (permisos) secundario.
**Superficie UI:** nota-seleccionada + toggle `Privacidad` en detalle.
**Gesto canonico:** toggle `Private / Public`.

**Historia:**
> Como colaborador, quiero marcar una nota como privada (solo yo la veo) o publica (todos en el modelo la ven) para distinguir entre anotaciones personales y observaciones compartidas.

**Contexto de negocio:**
En revision compartida, a veces quiero escribir notas de trabajo personal (un TODO, una duda para mi yo futuro) sin contaminar la vista de los colaboradores. Distinguir privada vs publica respeta ese uso.

**Criterios de aceptacion:**
- **Dado** que creo una nota, **cuando** se persiste, **entonces** el default es `nota.visibilidad = "publica"`.
- **Dado** que marco una nota como `privada`, **cuando** guardo, **entonces** solo el autor la ve en su sesion; otros usuarios no la ven ni en canvas ni en panel ni en navigator.
- **Dado** que un usuario es owner del modelo, **cuando** mira notas privadas ajenas, **entonces** **pregunta abierta**: ¿override? Politica de privacidad pendiente.
- **Dado** que exporto el modelo a PDF/SVG (HU-42.020), **cuando** se renderiza, **entonces** las notas privadas del exportador se incluyen pero las privadas de otros no.

**Reglas y restricciones:**
- Default: publica.
- Privacidad es por nota, no por OPD.
- Depende de sistema de identidad (HU-42.016) y permisos (EPICA-40).

**Modelo de datos tocado:**
- `nota.visibilidad` — `"publica" | "privada"` — persistente.

**Dependencias:**
- Bloqueada por: HU-42.001, HU-42.016.
- Relaciona: EPICA-40 (permisos de modelo).

**Integraciones:**
- Lente del canvas: filtra por identidad + visibility.
- Persistencia.

**Notas de evidencia:**
- Fuente: brief del trabajo. OPCloud no observa visibility por nota.
- Clase de afirmacion: hipotesis.
- Etiqueta: `requires-clarification`.

**Prioridad:** W (depende de infraestructura de identidad y permisos; fuera del MVP del modelador core).
**Tamano:** M.
**Etiquetas:** [notas, permisos, visibilidad, privacy, requires-clarification].

---

### HU-42.019 — Persistir notas en el JSON del modelo al guardar

**Actor primario:** CO.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Fuente:** §11 Q1, §6 (modelo implicito).
**Nivel categorico:** P (persistencia) primario; K (shape de modelo) secundario.
**Superficie UI:** modal-save-model (implicito — no hay UI nueva, solo persistencia).
**Gesto canonico:** ninguno propio (sucede al ejecutar Save de EPICA-30).

**Historia:**
> Como modelador, quiero que las notas se guarden con el modelo en el JSON para no perderlas al cerrar la sesion o compartir el archivo.

**Contexto de negocio:**
Si las notas solo existen en el render visual, se pierden al cerrar el navegador o al compartir el modelo. Persistirlas en el JSON del modelo las convierte en parte legitima del artefacto.

**Criterios de aceptacion:**
- **Dado** que tengo notas en un OPD, **cuando** ejecuto `Save`, **entonces** cada nota persiste como entrada en `modelo.notas[]` con todos sus campos (id, opd, titulo, cuerpo, posicion, tamano, ancla, autor, creadoEn, actualizadoEn, visibilidad, historial).
- **Dado** que abro el JSON, **cuando** inspecciono, **entonces** las notas aparecen como un array paralelo a `cosas` y `enlaces`.
- **Dado** que cargo el modelo, **cuando** se hidrata, **entonces** las notas se reinstancian en su OPD y posicion originales.
- **Dado** que exporto el modelo como OPCAT (EPICA-70), **cuando** se genera el archivo, **entonces** **pregunta abierta**: OPCAT no tiene concepto de nota; se omiten o se convierten en comentarios.
- **Dado** que duplico un modelo con `Save As`, **cuando** el duplicado se crea, **entonces** las notas se copian al duplicado (§11 Q5).

**Reglas y restricciones:**
- Las notas son entidades de modelo de primer orden a nivel de serializacion.
- No viajan en OPL export (las notas NO participan del OPL).
- Compatibilidad: modelos viejos sin `modelo.notas[]` se cargan con array vacio.

**Modelo de datos tocado:**
- `modelo.notas[]` — array — persistente.

**Dependencias:**
- Bloqueada por: HU-42.001, EPICA-30 (Save/Load).

**Integraciones:**
- Persistencia (EPICA-30, `src/persistencia/`).
- Export OPCAT (EPICA-70): compatibilidad.
- Duplicacion con Save As.

**Notas de evidencia:**
- Fuente: §11 Q1 ("¿La nota se persiste en el JSON del modelo o solo en el render visual del OPD?"), §6 (modelo implicito).
- Clase de afirmacion: inferido (consistente con miniatura del Navigator que reproduce la nota) + hipotesis (shape exacto).

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [notas, persistencia, save, json, serializacion].

---

### HU-42.020 — Incluir notas visibles en exportaciones PNG/SVG/PDF del OPD

**Actor primario:** CO.
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Fuente:** §7.3 (inferido + abierto).
**Nivel categorico:** X (export) primario; V (render congelado) secundario.
**Superficie UI:** modal-export (EPICA-60/61).
**Gesto canonico:** ninguno propio (sucede al ejecutar Export).

**Historia:**
> Como colaborador, quiero que las notas visibles se incluyan en las exportaciones PNG/SVG/PDF del OPD para compartir el diagrama con anotaciones en formatos estaticos.

**Contexto de negocio:**
Revisores sin acceso al modelo vivo reciben PDFs o PNGs. Si las notas no aparecen, el feedback se pierde. La regla deberia ser: lo que se ve en el canvas en el momento del export es lo que aparece en el archivo.

**Criterios de aceptacion:**
- **Dado** que tengo notas visibles (toggle `on`), **cuando** exporto el OPD a PDF/PNG/SVG, **entonces** las notas aparecen en el archivo exportado en sus posiciones del canvas.
- **Dado** que tengo notas ocultas (toggle `off`), **cuando** exporto, **entonces** **pregunta abierta** (§7.3): ¿se excluyen las notas del export, o el toggle es solo de render en vivo?
- **Dado** que exporto con notas ancladas, **cuando** se renderiza el archivo, **entonces** la linea discontinua del anclaje se preserva.
- **Dado** que exporto con notas privadas (HU-42.018), **cuando** se genera el archivo, **entonces** solo aparecen las privadas del exportador + las publicas.

**Reglas y restricciones:**
- Regla propuesta: el export refleja exactamente el render visual actual.
- Notas en markdown (HU-42.015): el render en exportacion debe ser identico al del canvas.

**Dependencias:**
- Bloqueada por: HU-42.001, HU-42.009, EPICA-60 (export PDF), EPICA-61 (export SVG).
- Relaciona: HU-42.015, HU-42.018.

**Integraciones:**
- Exporters (EPICA-60/61).

**Notas de evidencia:**
- Fuente: §7.3.
- Clase de afirmacion: inferido + abierto (§7.3 "si el toggle Off excluye las notas de la exportacion o solo las oculta").
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [notas, export, render, pdf, svg, png, requires-clarification].

---

### HU-42.021 — Mostrar nota como bloque amarillo en OPD Navigator

**Actor primario:** CO.
**Tipo:** opcloud-ui.
**Fuente:** §4.4, §7.1; frames: frame_00043, frame_00044.
**Nivel categorico:** L (lente) primario; V secundario.
**Superficie UI:** opd-navigator (miniatura).
**Gesto canonico:** ninguno.

**Historia:**
> Como colaborador, quiero ver cada nota como un bloque amarillo en la miniatura del OPD Navigator para ubicar geograficamente las anotaciones en modelos grandes.

**Contexto de negocio:**
El navigator es el mapa rapido del OPD. Incluir las notas como bloques amarillos mantiene la correspondencia geografica y orienta al modelador cuando escanea un modelo con muchas anotaciones.

**Criterios de aceptacion:**
- **Dado** que creo una nota, **cuando** se termina de renderizar, **entonces** aparece un rectangulo amarillo en la miniatura del Navigator en la posicion escalada correspondiente (<500ms).
- **Dado** que muevo la nota, **cuando** termina el drag, **entonces** la miniatura refleja la nueva posicion.
- **Dado** que elimino la nota, **cuando** se borra, **entonces** el bloque desaparece de la miniatura.
- **Dado** que activo `Toggle Notes` off, **cuando** ocurre, **entonces** **pregunta abierta**: las miniaturas mantienen los bloques amarillos o los ocultan en paralelo.

**Reglas y restricciones:**
- Estilo: bloque amarillo a escala, sin pushpin ni texto (el detalle no es legible a esa escala).
- La miniatura es render puro; no edita modelo.

**Dependencias:**
- Bloqueada por: HU-42.001, EPICA-21 (OPD Navigator).

**Integraciones:**
- OPD Navigator.

**Notas de evidencia:**
- Fuente: §4.4, §7.1.
- Frames: frame_00043, frame_00044.
- Clase de afirmacion: observado.
- Etiqueta: `requires-clarification` (comportamiento con toggle off).

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [notas, ui, navigator, lente, miniatura].

---

### HU-42.022 — Convertir nota en mensaje de chat del modelo

**Actor primario:** CO.
**Actores secundarios:** AO.
**Tipo:** opcloud-ui.
**Fuente:** brief del trabajo (extension natural). OPCloud no observa esta integracion.
**Nivel categorico:** X (integracion con chat) primario; U (comando) secundario.
**Superficie UI:** menu-contextual-nota + panel-chat (EPICA-41).
**Gesto canonico:** comando `Enviar al chat` desde menu contextual de la nota.

**Historia:**
> Como colaborador, quiero convertir una nota en mensaje del chat del modelo para escalar una observacion personal a conversacion compartida.

**Contexto de negocio:**
Una nota empieza como observacion propia; a veces deviene en pregunta colectiva. Un camino para promoverla al chat (EPICA-41) evita la doble escritura y preserva la trazabilidad.

**Criterios de aceptacion:**
- **Dado** que tengo una nota con cuerpo, **cuando** invoco `Enviar al chat` desde su menu contextual, **entonces** se crea un mensaje en el chat del modelo con el cuerpo de la nota y una referencia al `nota.id`.
- **Dado** que envie la nota al chat, **cuando** miro la nota, **entonces** aparece un indicador discreto (icono o borde) de que esta promovida al chat.
- **Dado** que alguien responde en el chat a ese mensaje, **cuando** miro la nota, **entonces** **pregunta abierta**: si se refleja un contador de respuestas en la nota.
- **Dado** que elimino la nota, **cuando** se borra, **entonces** el mensaje de chat persiste (el chat tiene su propia vida).

**Reglas y restricciones:**
- Operacion unidireccional (nota → chat), no bidireccional.
- El chat depende de infraestructura multi-usuario (EPICA-41), fuera del modelador core.

**Modelo de datos tocado:**
- `nota.promovidoAChat` — boolean | chat message id — persistente.

**Dependencias:**
- Bloqueada por: HU-42.001, EPICA-41 (chat).

**Integraciones:**
- Chat (EPICA-41).

**Notas de evidencia:**
- Fuente: brief del trabajo (extension natural). OPCloud no observa esta integracion.
- Clase de afirmacion: hipotesis.
- Etiqueta: `requires-clarification`.

**Prioridad:** W (depende de EPICA-41, fuera del modelador core en el ciclo actual).
**Tamano:** M.
**Etiquetas:** [notas, chat, integracion, requires-clarification].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q42.1** (§11 Q1): ¿La nota se persiste en el JSON del modelo y viaja en export OPL como metadato, o solo en el render visual del OPD? — HU-42.019 propone persistencia en `modelo.notas[]`.
- **Q42.2** (§11 Q2): ¿Existe atribucion de autor/timestamp? — cubierta por HU-42.016 como extension; pendiente de observacion.
- **Q42.3** (§11 Q3): ¿Cardinalidad del anclaje (uno-a-uno u uno-a-muchos)? — HU-42.007 mantiene uno-a-uno por defecto; queda `requires-clarification`.
- **Q42.4** (§11 Q4): ¿Alcance del toggle (OPD actual vs modelo completo)? — HU-42.009 asume per-OPD por evidencia; no concluyente.
- **Q42.5** (§11 Q5): ¿Las notas se copian al duplicar el modelo (Save As)? — HU-42.019 propone si; pendiente de confirmacion.
- **Q42.6** (§11 Q6): ¿Gesto exacto de creacion del anclaje (drag desde borde, menu contextual, ambos)? — HU-42.007 asume drag desde borde por paralelismo con enlaces.
- **Q42.7** (§11 Q7): ¿Efecto de eliminacion de cosa ancla sobre la nota (borra anclaje, convierte en flotante, bloquea delete)? — HU-42.007 lo deja abierto.
- **Q42.8**: ¿Existe un left pane de notas en OPCloud o es una extension propuesta del modelador? — HU-42.011 a 42.014 asumen extension propuesta, marcadas `requires-clarification`.
- **Q42.9**: ¿Markdown en el cuerpo es compatible con versiones sin render markdown? — HU-42.015 propone subset seguro.
- **Q42.10**: ¿Historial de cambios, visibility privada y promocion al chat dependen de infraestructura colaborativa no disponible en el modelador core? — HU-42.017, 42.018, 42.022 marcadas `W`.
- **Q42.11**: ¿`Enter` en el editor de cuerpo confirma o inserta salto de linea? — HU-42.004 `requires-clarification`.
- **Q42.12**: ¿Comportamiento con toggle `off` en miniaturas del Navigator y en exportaciones? — HU-42.020, HU-42.021 abiertas.

## Referencias cruzadas

- Doc fuente: `opcloud-reverse/42-colaboracion-notes.md`.
- Epicas relacionadas:
  - **EPICA-10** (canvas-creacion-cosas): invariante de que doble clic sobre cosa dispara edicion de nombre, no creacion de nota.
  - **EPICA-17** (canvas-atributos-instancias): distinguir de `Description field` de Object, que NO es una nota.
  - **EPICA-1C** (canvas-validaciones): efecto de eliminacion de cosa sobre notas ancladas.
  - **EPICA-21** (estructura-system-map) / OPD Navigator: HU-42.021 depende de la miniatura.
  - **EPICA-30** (persistencia-save-load): HU-42.019 se apoya en el pipeline de save.
  - **EPICA-40** (colaboracion-permisos): HU-42.018 (privacidad) depende del sistema de permisos.
  - **EPICA-41** (colaboracion-chat): HU-42.022 (promocion de nota a chat) depende.
  - **EPICA-50** (opl-pane): invariante — las notas NO emiten OPL.
  - **EPICA-60** (export-pdf) / **EPICA-61** (export-svg): HU-42.020 depende.
  - **EPICA-70** (interop-opcat): pregunta abierta de compatibilidad.
  - **EPICA-80** (config-user-org): HU-42.010 (Show notes by default) se apoya.
  - **EPICA-90** (interaccion-shortcuts): HU-42.008 se apoya en `Delete` y undo.
- Invariantes del repo:
  - `src/nucleo/`: extender shape del modelo con `nota` como entidad de primer orden (decision no tomada — requiere evaluacion kernel vs dominio segun `docs/design/patron-dominios-funtor.md`).
  - `src/render/jointjs/`: factory de sticky-nota, factory de linea de anclaje dashed corta.
  - `src/render/layout/`: invariante — el layout NO reposiciona notas; son libres.
  - `src/render/opl-renderer.ts`: invariante — notas excluidas del OPL.
  - `src/persistencia/`: shape extendido en el JSON del modelo.
- Trazabilidad SSOT:
  - Brechas SSOT atribuibles a esta feature: **N1** (primitiva visual Nota), **N2** (conector dashed corto nota→cosa), **N3** (pushpin rojo) — ver §10.1 doc fuente.
  - Convenciones de color amarillo palido, pushpin rojo y dashed corto gris reservadas contra uso por modeladores — ver §9 doc fuente.
