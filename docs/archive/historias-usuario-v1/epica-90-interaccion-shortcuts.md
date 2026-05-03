---
epica: "EPICA-90"
titulo: "Interaccion — atajos de teclado (guardar, busqueda, copiar/pegar, eliminar, nudge, deshacer/rehacer, navegacion OPD, unfold, format painter)"
doc_fuente: "opcloud-reverse/90-interaccion-shortcuts.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "M1"
hu_emitidas: 21
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "DIAGNOSTICO-PILOTO-EPICA-10.md"
---

## Resumen

Esta epica cubre el conjunto de atajos de teclado que OPCloud reconoce como vias alternativas a la operacion con mouse. Los atajos son **aceleradores**, no capacidades exclusivas: cada uno tiene contraparte en toolbar, halo o menu contextual ya documentados en otras epicas. La narracion los enumera explicitamente como "key shortcuts utiles para el dia a dia" sobre el OnStar Example.

La epica se organiza en cinco bloques funcionales:

1. **Modelo completo** — `Ctrl+S` (guardar).
2. **Busqueda y seleccion** — `Ctrl+F` (things searching).
3. **Edicion sobre seleccion** — `Ctrl+C`, `Ctrl+V`, `Delete`, flechas (nudge), `Shift+U` (unfold), `Ctrl+Shift+C` (format painter).
4. **Deshacer/Rehacer** — `Ctrl+Z`, `Ctrl+Y`.
5. **Navegacion OPD tree** — `Ctrl+↑`, `Ctrl+↓`, `Ctrl+←`, `Ctrl+→`.

Cada HU corresponde a un atajo confirmado, con una HU adicional que cubre la convencion transversal (todos los atajos tienen contraparte grafica y respetan el axioma de no-creacion por teclado). Las preguntas abiertas del doc fuente (`Ctrl+D`, `Ctrl+A`, `Ctrl+0`, zoom con `Ctrl+scroll`, atajo para paneles) se emiten como HUs candidatas marcadas `requires-clarification` para preservar trazabilidad.

Las HU se numeran siguiendo el orden del catalogo §3 del doc fuente, agrupadas por bloque funcional.

**Clasificacion SSOT:** La SSOT OPM no regula atajos de teclado. Todas las HU de esta epica son `opcloud-ui`; la columna SSOT indica `—` en todos los casos.

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-90.001 | Guardar modelo con Ctrl+S | ME | M1 | S | opcloud-ui | — |
| HU-90.002 | Abrir modal Things searching con Ctrl+F | ME | M1 | S | opcloud-ui | — |
| HU-90.003 | Copiar seleccion con Ctrl+C al buffer visual | ME | M1 | S | opcloud-ui | — |
| HU-90.004 | Pegar copia visual con Ctrl+V en el OPD activo | ME | M1 | M | opcloud-ui | — |
| HU-90.005 | Eliminar seleccion con Delete | ME | M0 | S | opcloud-ui | — |
| HU-90.006 | Mover seleccion un pixel con flechas (nudge fino) | ME | M1 | S | opcloud-ui | — |
| HU-90.007 | Aplicar nudge sobre links seleccionados | ME | S | S | opcloud-ui | — |
| HU-90.008 | Deshacer ultima operacion con Ctrl+Z | ME | M0 | M | opcloud-ui | — |
| HU-90.009 | Rehacer operacion con Ctrl+Y | ME | M0 | S | opcloud-ui | — |
| HU-90.010 | Navegar al OPD siguiente del arbol con Ctrl+↓ | ME | M1 | S | opcloud-ui | — |
| HU-90.011 | Navegar al OPD anterior del arbol con Ctrl+↑ | ME | M1 | S | opcloud-ui | — |
| HU-90.012 | Descender al OPD hijo con Ctrl+→ | ME | M1 | S | opcloud-ui | — |
| HU-90.013 | Ascender al OPD padre con Ctrl+← | ME | M1 | S | opcloud-ui | — |
| HU-90.014 | Hacer unfold de cosa refinable con Shift+U | ME | S | M | opcloud-ui | — |
| HU-90.015 | Abrir format painter con Ctrl+Shift+C | ME | S | M | opcloud-ui | — |
| HU-90.016 | Respetar axioma "no creacion por teclado" | MN | M1 | XS | opcloud-ui | — |
| HU-90.017 | Mantener contraparte grafica de todos los atajos | MN | M1 | XS | opcloud-ui | — |
| HU-90.018 | Duplicar seleccion con Ctrl+D (pregunta abierta) | ME | C | S | opcloud-ui | — |
| HU-90.019 | Seleccionar todo con Ctrl+A (pregunta abierta) | ME | C | S | opcloud-ui | — |
| HU-90.020 | Ajustar vista con Ctrl+0 / fit-to-screen (pregunta abierta) | ME | C | S | opcloud-ui | — |
| HU-90.021 | Hacer zoom con Ctrl+scroll (pregunta abierta) | ME | C | S | opcloud-ui | — |

Total: **21 historias de usuario** (21 opcloud-ui).

## Historias de usuario

### HU-90.001 — Guardar modelo con Ctrl+S

**Actor primario:** ME (modelador experto).
**Actores secundarios:** MN (el novato tambien aprende el atajo universal).
**Tipo:** opcloud-ui.
**Fuente:** opcloud-ui.
**Nivel categorico:** P (persistencia) primario; U secundario (indicador en pestana).
**Superficie UI:** main toolbar (disquete espejo) + pestana superior.
**Gesto canonico:** atajo `Ctrl+S`.

**Historia:**
> Como modelador, quiero guardar el modelo con `Ctrl+S` para persistir cambios sin interrumpir el flujo llevando la mano al raton.

**Contexto de negocio:**
`Ctrl+S` es un atajo universal que todos los editores respetan. Mantenerlo en el modelador OPM es costo cero en aprendizaje. Elimina la friccion de viajar a la toolbar cada vez que el modelador quiere consolidar avance, lo que incentiva guardar frecuente y reduce perdida de trabajo.

**Criterios de aceptacion:**
- **Dado** que tengo un modelo con cambios sin guardar, **cuando** presiono `Ctrl+S`, **entonces** se dispara el flujo de guardar equivalente al boton disquete de la main toolbar.
- **Dado** que el modelo ya tiene nombre asignado, **cuando** `Ctrl+S`, **entonces** se guarda silenciosamente sin abrir modal.
- **Dado** que el modelo es nuevo y no tiene nombre, **cuando** `Ctrl+S`, **entonces** se abre el modal `Save As` (ver EPICA-30) para capturar nombre.
- **Dado** que termino el guardado, **cuando** miro la pestana superior, **entonces** el sufijo `(Not Saved)` desaparece.
- **Dado** que estoy enfocado en un input de texto (popup de rename, busqueda), **cuando** presiono `Ctrl+S`, **entonces** el atajo no se consume por el input y dispara el guardado global.

**Reglas y restricciones:**
- El atajo es global al modelador; no depende de cual superficie tiene foco (salvo inputs que lo capturen por default del navegador — manejo explicito requerido).
- Prevenir comportamiento default del navegador (`Save page as...`) via `event.preventDefault()`.
- El guardado respeta las reglas de EPICA-30 (new vs existing, ver permisos de EPICA-40).

**Modelo de datos tocado:**
- Ninguno directo; dispara el pipeline de persistencia ya existente.

**Dependencias:**
- Bloqueada por: EPICA-30 (flujo Guardar y Guardar como debe existir).
- Relaciona: HU-10.022 (indicador `Model (Not Saved)` que este atajo limpia).

**Integraciones:**
- Main toolbar: el boton disquete queda sincronizado visualmente.
- Pestana superior: el sufijo `(Not Saved)` desaparece.

**Notas de evidencia:**
- Fuente: `opcloud-reverse/90-interaccion-shortcuts.md` §2, §3.
- Frames: `frame_00001` (top bar con disquete visible como contraparte grafica).
- Transcripcion: "`Ctrl+S` guarda el modelo".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [atajo, guardar, persistencia, toolbar-espejo, ctrl].

---

### HU-90.002 — Abrir modal Things searching con Ctrl+F

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-ui.
**Nivel categorico:** L (lente — busqueda sobre modelo) primario; U secundario.
**Superficie UI:** modal `Things searching`.
**Gesto canonico:** atajo `Ctrl+F`.

**Historia:**
> Como modelador experto, quiero abrir el modal de busqueda con `Ctrl+F` para localizar una cosa por nombre en modelos grandes sin buscar visualmente.

**Contexto de negocio:**
En modelos con decenas o cientos de cosas, la busqueda textual es mas rapida que el paneo visual. `Ctrl+F` es el atajo universal de "find", coherente con la convencion de navegadores y editores. Elimina el viaje al icono de binoculares de la toolbar.

**Criterios de aceptacion:**
- **Dado** que estoy en el canvas, **cuando** presiono `Ctrl+F`, **entonces** se abre el modal `Things searching` con el input de busqueda enfocado.
- **Dado** que el modal esta abierto, **cuando** escribo texto, **entonces** la lista de resultados filtra contra todas las cosas del modelo (todos los OPDs).
- **Dado** que hago clic en un resultado, **cuando** se selecciona, **entonces** el canvas navega al OPD que lo contiene y selecciona la apariencia correspondiente.
- **Dado** que presiono `Ctrl+F` con foco sobre un input de texto (p.ej. dentro de popup de rename), **entonces** el atajo **no** se dispara — el navegador u otro flow lo consume.
- **Dado** que presiono `Esc`, **cuando** el modal esta abierto, **entonces** se cierra sin efectos.

**Reglas y restricciones:**
- Busqueda es sobre el modelo completo, no solo el OPD visible.
- Prevenir el `Find in Page` del navegador cuando el foco esta en el canvas.
- El campo de busqueda acepta texto libre; matching exacto vs fuzzy es **pregunta abierta** (no documentada en doc fuente).

**Modelo de datos tocado:**
- Ninguno (lente pura).

**Dependencias:**
- Bloqueada por: existencia del modal `Things searching` (epica UI a definir, eventualmente EPICA-35).
- Relaciona: HU-90.010 (navegacion OPD tras seleccion del resultado).

**Integraciones:**
- Lente de things.
- OPD Navigator (centra la apariencia encontrada).

**Notas de evidencia:**
- Fuente: §2, §3.
- Transcripcion: "`Ctrl+F` abre el modal *Things searching* con un campo de busqueda contra todas las cosas del modelo. Equivale al icono de binoculares".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [atajo, busqueda, modal, lente, ctrl].

---

### HU-90.003 — Copiar seleccion con Ctrl+C al buffer visual

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-ui.
**Nivel categorico:** U primario; L secundario (lectura del modelo).
**Superficie UI:** canvas.
**Gesto canonico:** atajo `Ctrl+C` con seleccion activa.

**Historia:**
> Como modelador experto, quiero copiar la seleccion con `Ctrl+C` a un buffer interno para preparar una **copia visual** sin duplicar aun en el canvas.

**Contexto de negocio:**
El modelo OPM distingue entre **entidad logica** (una sola) y **apariencia visual** (multiples en distintos OPDs). `Ctrl+C` prepara una copia visual: misma entidad, nuevo simbolo. El copiar-pegar no es clonacion; es **re-apariencia** de la misma entidad. El buffer es interno, no el portapapeles del sistema — no contamina con texto plano.

**Criterios de aceptacion:**
- **Dado** que tengo una cosa seleccionada en el canvas, **cuando** presiono `Ctrl+C`, **entonces** la referencia a la entidad se guarda en un buffer interno del modelador.
- **Dado** que hice `Ctrl+C`, **cuando** miro el canvas, **entonces** NO hay cambio visual — no se duplica inmediato.
- **Dado** que hice `Ctrl+C` sobre multi-seleccion, **cuando** `Ctrl+V` posterior se ejecute, **entonces** se pegan todas las cosas seleccionadas manteniendo posiciones relativas.
- **Dado** que no hay seleccion, **cuando** presiono `Ctrl+C`, **entonces** el atajo no hace nada (o feedback null).
- **Dado** que un link esta seleccionado (sin sus extremos), **cuando** presiono `Ctrl+C`, **entonces** el comportamiento es **pregunta abierta** — probablemente nada, o error silencioso.

**Reglas y restricciones:**
- El buffer es interno; no interfiere con el clipboard del sistema operativo.
- La copia es **por referencia** (misma entidad logica), no clonacion de datos.
- Prevenir el `Copy to clipboard` del navegador cuando el foco esta en el canvas con seleccion.

**Modelo de datos tocado:**
- Buffer de clipboard del modelador (estado transitorio, no persiste entre recargas).

**Dependencias:**
- Bloqueada por: sistema de seleccion en canvas (EPICA-10 seleccion).
- Bloquea a: HU-90.004 (pegar).

**Integraciones:**
- Clipboard interno del modelador.

**Notas de evidencia:**
- Fuente: §3, §4 (copia visual).
- Transcripcion: "`Ctrl+C` copia la(s) cosa(s) seleccionada(s) a un buffer interno para *visual copy*. No crea duplicado inmediato en el canvas".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [atajo, copiar, clipboard, visual-copy, ctrl].

---

### HU-90.004 — Pegar copia visual con Ctrl+V en el OPD activo

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-ui.
**Nivel categorico:** V primario (nueva apariencia); K secundario (actualiza apariencias de la entidad).
**Superficie UI:** canvas (OPD activo, puede ser distinto al del origen).
**Gesto canonico:** atajo `Ctrl+V`.

**Historia:**
> Como modelador experto, quiero pegar con `Ctrl+V` la entidad copiada como **copia visual** en el OPD activo para tener la misma cosa referenciada en varios diagramas sin duplicar la entidad.

**Contexto de negocio:**
Las co-referencias entre OPDs son el mecanismo de reutilizacion central de OPM. Una entidad (p.ej. `OnStar Advisor`) puede aparecer en SD1 y SD2; el OPL la trata como una sola. La copia visual es el vehiculo para materializar esa co-referencia sin abrir menus. El simbolo pegado lleva la marca `little sign` (icono cadena) que senala la co-referencia.

**Criterios de aceptacion:**
- **Dado** que tengo algo en el buffer (post `Ctrl+C`), **cuando** presiono `Ctrl+V` en el OPD activo, **entonces** se crea una nueva apariencia visual de la misma entidad en ese OPD.
- **Dado** que se pego la copia, **cuando** miro el simbolo pegado, **entonces** tiene el icono de cadena (little sign de copia visual) documentado en `16-canvas-enlaces-propiedades.md`.
- **Dado** que se pego la copia, **cuando** consulto el OPL, **entonces** NO hay una segunda oracion `is an object.` — la entidad logica sigue siendo unica.
- **Dado** que se pego la copia, **cuando** arrastro la copia a otro OPD, **entonces** la nueva apariencia se mueve conservando la co-referencia.
- **Dado** que pegue en el mismo OPD que el original, **cuando** miro, **entonces** ambas apariencias coexisten (ver `frame_00007` con dos `OnStar Advisor`).
- **Dado** que el OPD destino no admite la cosa copiada (p.ej. pegar un process dentro del rectangulo de un object), **cuando** intento pegar, **entonces** el comportamiento es **pregunta abierta** — debe validarse, no romperse.

**Reglas y restricciones:**
- Regla dura: copiar+pegar mantiene identidad logica (invariante de apariencias OPM).
- La copia visual se marca con icono cadena.
- No se dibuja enlace estructural automatico entre original y copia (confirmado en `frame_00007`).
- Posicionamiento del pegado: pregunta abierta (cursor actual, offset del original, centro del viewport) — pendiente de decidir en implementacion.

**Modelo de datos tocado:**
- `apariencia.id` — UUID nueva — persistente.
- `apariencia.entidad_id` — UUID existente — persistente.
- `apariencia.opd_id` — UUID del OPD activo — persistente.
- `apariencia.position` — `{x, y}` — persistente.

**Dependencias:**
- Bloqueada por: HU-90.003.
- Bloqueada por: modelo de apariencias/co-referencia en el kernel (kernel debe distinguir entidad de apariencia).
- Relaciona: `16-canvas-enlaces-propiedades.md`, `17-canvas-atributos-instancias.md` (little sign).

**Integraciones:**
- Renderer: dibuja apariencia con marca.
- OPL: no emite nueva oracion.
- OPD Navigator: actualiza miniatura.

**Notas de evidencia:**
- Fuente: §3, §4.
- Frames: `frame_00007` (dos `OnStar Advisor` coexistiendo tras `Ctrl+V`).
- Transcripcion: "pega el contenido de `Ctrl+C` como copia visual [...] permite arrastrar la copia a otro OPD".
- Clase de afirmacion: confirmado por transcripcion + observado.

**Prioridad:** M1.
**Tamano:** M.
**Etiquetas:** [atajo, pegar, visual-copy, co-referencia, ctrl, requires-clarification].

---

### HU-90.005 — Eliminar seleccion con Delete

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-ui.
**Nivel categorico:** K primario; U secundario (modal condicional).
**Superficie UI:** canvas + modal `Choose Remove Operation` condicional.
**Gesto canonico:** tecla `Delete` (o `Backspace`) con seleccion activa.

**Historia:**
> Como modelador, quiero eliminar la seleccion con `Delete` para borrar sin viajar a la toolbar, con comportamiento inteligente segun si la cosa aparece en varios OPDs.

**Contexto de negocio:**
El delete es la operacion mas peligrosa del modelador. OPCloud distingue entre `visual-only delete` (eliminar solo la apariencia del OPD actual) y `logical delete` (eliminar la entidad del modelo). Si la cosa aparece en un solo OPD, visual y logico coinciden y el atajo borra directo. Si aparece en varios, el modal de confirmacion evita errores de ambiguedad.

**Criterios de aceptacion:**
- **Dado** que tengo una cosa seleccionada cuya **unica apariencia** es en este OPD, **cuando** presiono `Delete`, **entonces** se elimina directamente (entidad + apariencia).
- **Dado** que tengo una cosa seleccionada con **multiples apariencias**, **cuando** presiono `Delete`, **entonces** se abre el modal `Choose Remove Operation` con opciones `visual only`, `visual + logical` y posiblemente `visual + children` (ver EPICA-1C).
- **Dado** que tengo un link seleccionado, **cuando** presiono `Delete`, **entonces** el link se elimina sin modal (un link no tiene apariencias multiples).
- **Dado** que tengo multi-seleccion, **cuando** presiono `Delete`, **entonces** se procesan los elementos aplicando la regla anterior a cada uno.
- **Dado** que `Backspace` se presiona en contexto equivalente, **cuando** ocurre, **entonces** actua identico a `Delete` — **confirmacion esperada pero no explicita en fuente**, marcar para validar.
- **Dado** que tengo foco en un input de texto, **cuando** presiono `Delete` o `Backspace`, **entonces** el atajo no borra el elemento del canvas — el input consume la tecla.

**Reglas y restricciones:**
- Condicion de modal: `n(apariencias de la entidad) ≥ 2`.
- El delete es irreversible sin `Ctrl+Z`.
- `Delete` canonico; `Backspace` **equivalente esperado pero no confirmado en doc fuente** — marcar pregunta abierta.

**Modelo de datos tocado:**
- `entidad` — eliminada si logical.
- `apariencia` — eliminada siempre al menos la del OPD actual.
- Para logical delete: todas las apariencias y links relacionados se limpian.

**Dependencias:**
- Bloqueada por: sistema de seleccion, modelo de apariencias.
- Relaciona: EPICA-1C (modal `Choose Remove Operation` detallado).

**Integraciones:**
- Validador del kernel (cascada de cleanups).
- OPL (desaparece oracion).
- Biblioteca lateral (desaparece entrada si logical).

**Notas de evidencia:**
- Fuente: §3, §4 ("Delete inteligente").
- Transcripcion: "si el simbolo es la unica representacion [...] borra directamente; en caso contrario abre el *delete screen*".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M0 (sin delete no hay edicion de modelos viables).
**Tamano:** S.
**Etiquetas:** [atajo, eliminar, modal-condicional, kernel, visual-vs-logical].

---

### HU-90.006 — Mover seleccion un pixel con flechas (nudge fino)

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-ui.
**Nivel categorico:** V primario (ajuste posicional); U secundario.
**Superficie UI:** canvas.
**Gesto canonico:** teclas `←` `→` `↑` `↓` con seleccion activa.

**Historia:**
> Como modelador experto, quiero mover la cosa seleccionada pixel a pixel con las flechas para alinear con precision sub-grid que el drag con mouse no alcanza.

**Contexto de negocio:**
El drag con mouse respeta un paso de grilla; el nudge por teclado es mas fino, pensado para alineacion pixel-perfect. En diagramas densos con muchos elementos cercanos, el nudge es el mecanismo para ajustes finales antes de exportar o presentar.

**Criterios de aceptacion:**
- **Dado** que tengo una cosa seleccionada, **cuando** presiono `→`, **entonces** la cosa se mueve 1 pixel a la derecha.
- **Dado** que tengo una cosa seleccionada, **cuando** presiono `↑`, **entonces** la cosa se mueve 1 pixel arriba (y analogo `←`, `↓`).
- **Dado** que mantengo la flecha presionada, **cuando** el auto-repeat del sistema actua, **entonces** la cosa se desplaza de forma continua (comportamiento nativo de key-repeat).
- **Dado** que el nudge termina, **cuando** miro el canvas, **entonces** la nueva posicion queda persistida.
- **Dado** que tengo multi-seleccion, **cuando** presiono flecha, **entonces** todas las cosas seleccionadas se mueven en conjunto manteniendo posiciones relativas.
- **Dado** que no hay seleccion, **cuando** presiono flecha, **entonces** el atajo no hace nada (no hay pan del canvas por flechas — reservado a Shift+flecha u otro, no documentado).
- **Dado** que el foco esta en un input de texto, **cuando** presiono flecha, **entonces** el input maneja el cursor de texto — el canvas no se mueve.

**Reglas y restricciones:**
- Paso del nudge: **1 pixel** (el doc fuente dice "mucho menor que el paso de la grilla por drag" — 1px es el supuesto estandar, pendiente de confirmar exacto).
- El nudge es mucho mas fino que el snap-to-grid del drag (ver EPICA-1A).
- No hay feedback auditivo; el unico indicador es el cambio posicional visible.

**Modelo de datos tocado:**
- `apariencia.position.x` / `apariencia.position.y` — persistente.

**Dependencias:**
- Bloqueada por: sistema de seleccion.
- Relaciona: EPICA-1A (grid y resize — contraparte de drag snap).

**Integraciones:**
- Renderer (re-dibuja).
- Layout (no recalcula; posicion es imperativa).

**Notas de evidencia:**
- Fuente: §3, §4 ("Nudge por flechas").
- Frames: `frame_00010` (`OnStar Advisor` seleccionado con handles, contexto previo al nudge).
- Transcripcion: "movimiento fino del elemento seleccionado en el OPD, pixel a pixel".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [atajo, nudge, alineacion, seleccion, arrow-keys].

---

### HU-90.007 — Aplicar nudge sobre links seleccionados

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-ui.
**Nivel categorico:** V primario.
**Superficie UI:** canvas (link seleccionado).
**Gesto canonico:** teclas `←` `→` `↑` `↓` con link seleccionado.

**Historia:**
> Como modelador experto, quiero mover con flechas los puntos de ruteo (vertices) del link seleccionado para ajustar finamente el trayecto sin perder el vertex-edit mode.

**Contexto de negocio:**
Los links en OPM suelen requerir ajustes de ruteo manual cuando cruzan areas densas. El nudge sobre links permite refinar waypoints despues de seleccionarlos explicitamente, complementando el auto-routing algoritmico.

**Criterios de aceptacion:**
- **Dado** que tengo un link seleccionado con vertex activo, **cuando** presiono flecha, **entonces** el vertex se desplaza 1 pixel en la direccion correspondiente.
- **Dado** que el link esta seleccionado sin vertex (seleccion de todo el link), **cuando** presiono flecha, **entonces** el comportamiento es **pregunta abierta** — probablemente mueve todos los vertices en conjunto, a validar.
- **Dado** que el movimiento del vertex cruza regiones validas, **cuando** termina, **entonces** el trayecto se persiste.

**Reglas y restricciones:**
- Aplica a vertices del link, no a los endpoints (source/target los determinan los things conectados).
- Paso 1 pixel consistente con HU-90.006.

**Modelo de datos tocado:**
- `link.vertices[i].x` / `link.vertices[i].y` — persistente.

**Dependencias:**
- Bloqueada por: HU-90.006 (mecanismo de nudge).
- Bloqueada por: modelo de link vertices (EPICA-15 o EPICA-16).

**Integraciones:**
- Layout (post-procesos OPM pueden re-rutear si la edicion lo rompe).
- Renderer.

**Notas de evidencia:**
- Fuente: §3, §4 ("Aplica a nodos y a puntos de ruteo de enlaces cuando el link esta seleccionado").
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [atajo, nudge, links, vertex-routing, arrow-keys].

---

### HU-90.008 — Deshacer ultima operacion con Ctrl+Z

**Actor primario:** ME.
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-ui.
**Nivel categorico:** K primario (reversion de mutacion); U secundario.
**Superficie UI:** main toolbar (flecha curva izquierda, espejo) + estado del modelo.
**Gesto canonico:** atajo `Ctrl+Z`.

**Historia:**
> Como modelador, quiero deshacer la ultima operacion con `Ctrl+Z` para revertir errores sin miedo, habilitando exploracion libre del modelo.

**Contexto de negocio:**
El deshacer es la red de seguridad fundamental de cualquier editor. Sin el, el modelador teme errores y ralentiza la exploracion. El atajo `Ctrl+Z` es universal; mantenerlo es cero esfuerzo de aprendizaje. El doc fuente confirma que aplica a crear, borrar, renombrar, mover, unfold, pegar — es decir, **toda** operacion registrable.

**Criterios de aceptacion:**
- **Dado** que acabo de ejecutar una operacion reversible (crear, borrar, renombrar, mover, unfold, pegar), **cuando** presiono `Ctrl+Z`, **entonces** el estado del modelo vuelve al previo a esa operacion.
- **Dado** que presiono `Ctrl+Z` repetidamente, **cuando** ocurre, **entonces** se recorre el historial hacia atras operacion por operacion.
- **Dado** que llegue al inicio de la sesion (sin operaciones previas), **cuando** presiono `Ctrl+Z`, **entonces** el atajo no hace nada (o feedback indicador de limite).
- **Dado** que hice `Ctrl+Z` y luego una nueva operacion, **cuando** el historial se bifurca, **entonces** el stack de rehacer se descarta (comportamiento estandar de deshacer lineal).
- **Dado** que la operacion a deshacer afecta multiples apariencias (p.ej. logical delete), **cuando** se revierte, **entonces** todas las apariencias se restauran.
- **Dado** que el foco esta en un input de texto, **cuando** presiono `Ctrl+Z`, **entonces** el input hace deshacer local (texto) — no afecta el modelo.

**Reglas y restricciones:**
- Historial es por sesion (abierto: ¿persiste post-guardado? — no documentado).
- Operaciones no registrables (zoom, pan, seleccion) no consumen historial.
- Deshacer es lineal, no por ramas.

**Modelo de datos tocado:**
- Event log / historial del modelo (persistente o en memoria segun diseno).

**Dependencias:**
- Bloqueada por: event log / command pattern en el kernel.
- Bloqueada por: cada operacion primitiva debe ser reversible.

**Integraciones:**
- Main toolbar: boton `deshacer` sincronizado (enable/disable segun disponibilidad).
- OPL, biblioteca, navigator: todos reflejan el estado restaurado.

**Notas de evidencia:**
- Fuente: §3.
- Frames: top bar con flecha curva visible en `frame_00001`.
- Transcripcion: "Deshacer de la ultima operacion (crear, borrar, renombrar, mover, unfold, pegar)".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M0 (editor sin deshacer no es usable).
**Tamano:** M (toca kernel, event log, toda operacion).
**Etiquetas:** [atajo, deshacer, historia, kernel, toolbar-espejo, ctrl].

---

### HU-90.009 — Rehacer operacion con Ctrl+Y

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-ui.
**Nivel categorico:** K primario; U secundario.
**Superficie UI:** main toolbar (flecha curva derecha) + estado del modelo.
**Gesto canonico:** atajo `Ctrl+Y`.

**Historia:**
> Como modelador, quiero rehacer con `Ctrl+Y` una operacion que acabo de deshacer para explorar caminos alternativos sin perder el trabajo ya hecho.

**Contexto de negocio:**
El rehacer complementa al deshacer. Sin el, el usuario teme deshacer porque no puede volver. `Ctrl+Y` es la convencion dominante en editores (Office, Windows); `Ctrl+Shift+Z` es la alternativa Mac/Linux — el doc fuente confirma `Ctrl+Y` como el canonico en OPCloud.

**Criterios de aceptacion:**
- **Dado** que hice `Ctrl+Z` al menos una vez, **cuando** presiono `Ctrl+Y`, **entonces** la operacion revertida se reaplica.
- **Dado** que hago `Ctrl+Y` sin haber hecho deshacer previo, **cuando** el stack de rehacer esta vacio, **entonces** el atajo no hace nada.
- **Dado** que hice una nueva operacion despues de un `Ctrl+Z`, **cuando** el stack de rehacer se limpia, **entonces** posterior `Ctrl+Y` no restaura la operacion descartada.
- **Dado** que `Ctrl+Shift+Z` es el analogo en otros sistemas, **cuando** el usuario lo presiona, **entonces** el comportamiento es **pregunta abierta** — se puede soportar como alias por usabilidad.

**Reglas y restricciones:**
- Rehacer lineal, gemelo del deshacer.
- `Ctrl+Y` es el canonico segun doc fuente; alias `Ctrl+Shift+Z` queda a decision del producto.

**Modelo de datos tocado:**
- Stack de rehacer.

**Dependencias:**
- Bloqueada por: HU-90.008.

**Integraciones:**
- Main toolbar: boton `rehacer` sincronizado.

**Notas de evidencia:**
- Fuente: §3.
- Frames: top bar con flecha curva derecha.
- Transcripcion: "Rehacer de la ultima operacion revertida con `Ctrl+Z`".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [atajo, rehacer, historia, kernel, toolbar-espejo, ctrl].

---

### HU-90.010 — Navegar al OPD siguiente del arbol con Ctrl+↓

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-ui.
**Nivel categorico:** L (navegacion sin mutacion) primario; U secundario.
**Superficie UI:** OPD tree (panel izquierdo) + canvas.
**Gesto canonico:** atajo `Ctrl+↓`.

**Historia:**
> Como modelador experto, quiero saltar al OPD siguiente del arbol con `Ctrl+↓` para recorrer el modelo linealmente sin usar el cursor sobre el panel de arbol.

**Contexto de negocio:**
En modelos con decenas de OPDs, la navegacion del arbol es costosa con mouse. El atajo lineal permite recorrer todos los OPDs en orden como "slides" de una presentacion. Util para revisiones y demos.

**Criterios de aceptacion:**
- **Dado** que estoy en el OPD `SD`, **cuando** presiono `Ctrl+↓`, **entonces** el canvas carga el siguiente OPD en orden lineal del arbol (p.ej. `SD1`).
- **Dado** que estoy en el ultimo OPD del orden lineal, **cuando** presiono `Ctrl+↓`, **entonces** el atajo no hace nada (o wrap — **pregunta abierta**, no documentado).
- **Dado** que la topologia es lineal (un solo refinamiento), **cuando** presiono `Ctrl+↓`, **entonces** produce el mismo resultado que `Ctrl+→` (caso degenerado, confirmado en §4).
- **Dado** que el foco esta en el arbol o en un input, **cuando** presiono `Ctrl+↓`, **entonces** el manejo de foco determina si el atajo se consume.

**Reglas y restricciones:**
- "Orden lineal" es el orden de traversal del arbol (DFS o similar — no explicitado en fuente; pendiente de decidir).
- Sin wrap-around por defecto (pendiente de confirmar).

**Modelo de datos tocado:**
- Ninguno (solo cambia viewport / OPD activo).

**Dependencias:**
- Bloqueada por: existencia del OPD tree (EPICA-20).

**Integraciones:**
- OPD tree (highlight del nuevo OPD activo).
- Canvas (re-render).
- OPL pane (refleja OPD activo si su modo es `por OPD`).

**Notas de evidencia:**
- Fuente: §2, §3, §4.
- Frames: `frame_00001` (SD activo), `frame_00005`/`frame_00007` (SD1 tras navegar).
- Transcripcion: "Navega al OPD siguiente en orden lineal del arbol (ej. desde SD a SD1)".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [atajo, navegacion, opd-tree, lineal, ctrl].

---

### HU-90.011 — Navegar al OPD anterior del arbol con Ctrl+↑

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-ui.
**Nivel categorico:** L primario; U secundario.
**Superficie UI:** OPD tree + canvas.
**Gesto canonico:** atajo `Ctrl+↑`.

**Historia:**
> Como modelador experto, quiero volver al OPD anterior del arbol con `Ctrl+↑` para recorrer el modelo lineal en ambos sentidos.

**Contexto de negocio:**
Complemento natural de `Ctrl+↓`. Permite navegacion bidireccional sin mouse.

**Criterios de aceptacion:**
- **Dado** que estoy en el OPD `SD1`, **cuando** presiono `Ctrl+↑`, **entonces** el canvas carga el OPD previo en orden lineal (p.ej. `SD`).
- **Dado** que estoy en el primer OPD del orden lineal, **cuando** presiono `Ctrl+↑`, **entonces** el atajo no hace nada (sin wrap por defecto).

**Reglas y restricciones:**
- Simetrico a HU-90.010.

**Dependencias:**
- Bloqueada por: HU-90.010 (mecanismo compartido).

**Integraciones:** mismas que HU-90.010.

**Notas de evidencia:**
- Fuente: §3.
- Transcripcion: "Navega al OPD anterior en orden lineal (ej. desde SD1 a SD)".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [atajo, navegacion, opd-tree, lineal, ctrl].

---

### HU-90.012 — Descender al OPD hijo con Ctrl+→

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-ui.
**Nivel categorico:** L primario; U secundario.
**Superficie UI:** OPD tree + canvas.
**Gesto canonico:** atajo `Ctrl+→`.

**Historia:**
> Como modelador experto, quiero bajar al OPD hijo (refinamiento) con `Ctrl+→` para descender en la jerarquia del modelo sin clics en el arbol.

**Contexto de negocio:**
La navegacion jerarquica (padre/hijo) es distinta de la lineal cuando hay ramas. `Ctrl+→` desciende por refinamiento (inzoom/unfold); `Ctrl+↓` recorre siblings/descendientes en orden lineal. En arboles profundos con ramas, la distincion permite navegar por estructura.

**Criterios de aceptacion:**
- **Dado** que estoy en el OPD `SD1` con hijo `SD1.1`, **cuando** presiono `Ctrl+→`, **entonces** el canvas carga `SD1.1`.
- **Dado** que el OPD actual no tiene hijos, **cuando** presiono `Ctrl+→`, **entonces** el atajo no hace nada.
- **Dado** que el OPD tiene multiples hijos, **cuando** presiono `Ctrl+→`, **entonces** desciende al primero (regla a definir — pendiente de documentar).

**Reglas y restricciones:**
- Descenso por refinamiento (inzoom/unfold), no por siblings.
- Con un solo refinamiento, `Ctrl+→` equivale a `Ctrl+↓` (caso degenerado).

**Dependencias:**
- Bloqueada por: EPICA-20 (estructura del OPD tree).
- Relaciona: EPICA-12 (in-zoom crea hijos).

**Integraciones:** mismas que HU-90.010.

**Notas de evidencia:**
- Fuente: §3, §4.
- Transcripcion: "Desciende en el arbol hacia el hijo/refinamiento (ej. SD1 → SD1.1 cuando existe)".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [atajo, navegacion, opd-tree, refinamiento, jerarquico, ctrl].

---

### HU-90.013 — Ascender al OPD padre con Ctrl+←

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-ui.
**Nivel categorico:** L primario; U secundario.
**Superficie UI:** OPD tree + canvas.
**Gesto canonico:** atajo `Ctrl+←`.

**Historia:**
> Como modelador experto, quiero subir al OPD padre con `Ctrl+←` para salir del refinamiento y volver al nivel superior sin recurrir al arbol.

**Contexto de negocio:**
Complemento simetrico de `Ctrl+→`. Junto con HU-90.012, habilita navegacion jerarquica completa.

**Criterios de aceptacion:**
- **Dado** que estoy en el OPD `SD1.1`, **cuando** presiono `Ctrl+←`, **entonces** el canvas carga el padre `SD1`.
- **Dado** que estoy en el OPD raiz `SD`, **cuando** presiono `Ctrl+←`, **entonces** el atajo no hace nada.

**Reglas y restricciones:**
- Simetrico a HU-90.012.

**Dependencias:**
- Bloqueada por: HU-90.012.

**Integraciones:** mismas que HU-90.010.

**Notas de evidencia:**
- Fuente: §3.
- Transcripcion: "Asciende en el arbol hacia el padre (sale del refinamiento)".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [atajo, navegacion, opd-tree, refinamiento, jerarquico, ctrl].

---

### HU-90.014 — Hacer unfold de cosa refinable con Shift+U

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-ui.
**Nivel categorico:** K primario (crea OPD hijo + marca unfolded); V secundario.
**Superficie UI:** canvas (cosa seleccionada) + OPD tree (nuevo nodo).
**Gesto canonico:** atajo `Shift+U`.

**Historia:**
> Como modelador experto, quiero disparar el unfold de la cosa refinable seleccionada con `Shift+U` para descomponerla sin viajar al halo o al toolbar.

**Contexto de negocio:**
El unfold es una de las operaciones estructurales mas usadas en OPM para desplegar partes, features o especializaciones. Asignarle un atajo acelera el flujo de descomposicion iterativa. El doc fuente confirma que es reversible con `Ctrl+Z`.

**Criterios de aceptacion:**
- **Dado** que tengo una cosa refinable seleccionada (Object o Process con candidatos de descomposicion), **cuando** presiono `Shift+U`, **entonces** se dispara el flujo de unfold equivalente al boton del halo/toolbar secundaria.
- **Dado** que se ejecuto unfold, **cuando** miro el OPD tree, **entonces** aparece un nuevo OPD con las partes y la cosa padre se marca como `unfolded`.
- **Dado** que hice unfold, **cuando** presiono `Ctrl+Z`, **entonces** el unfold se revierte (OPD hijo desaparece, marca se quita).
- **Dado** que la cosa no es refinable (p.ej. un estado), **cuando** presiono `Shift+U`, **entonces** el atajo no hace nada (o feedback de invalido).
- **Dado** que no hay seleccion, **cuando** presiono `Shift+U`, **entonces** el atajo no hace nada.

**Reglas y restricciones:**
- Solo aplica a cosas refinables (derivacion de regla OPM).
- Reversible con deshacer (confirmado en fuente).
- Delegacion completa al flujo de unfold ya documentado en EPICA-12.

**Modelo de datos tocado:**
- Nuevo OPD hijo.
- `thing.unfolded = true` en la cosa padre.
- Nuevos symbols de partes en el OPD hijo.

**Dependencias:**
- Bloqueada por: EPICA-12 (flujo de unfold completo).
- Relaciona: HU-90.008 (deshacer del unfold).

**Integraciones:**
- OPD tree (nuevo nodo).
- Kernel (mutacion del modelo).
- OPL pane (nuevas oraciones para las partes).

**Notas de evidencia:**
- Fuente: §3.
- Transcripcion: "`Shift+U` Unfold de la cosa refinable seleccionada [...] Reversible con `Ctrl+Z`".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** M (atajo simple, pero delega a flujo de unfold completo).
**Etiquetas:** [atajo, unfold, opd-tree, reversible, shift, kernel].

---

### HU-90.015 — Abrir format painter con Ctrl+Shift+C

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-ui.
**Nivel categorico:** U primario; V secundario.
**Superficie UI:** modal `Choose Which Style Elements To Copy`.
**Gesto canonico:** atajo `Ctrl+Shift+C` con cosa origen seleccionada.

**Historia:**
> Como modelador experto, quiero abrir el format painter con `Ctrl+Shift+C` para preparar la copia de atributos de estilo desde la cosa seleccionada sin buscar el boton en la toolbar.

**Contexto de negocio:**
El format painter (estilo "Copy Style") acelera el trabajo de presentacion al propagar estilo entre elementos. El modal previo permite seleccionar que atributos copiar (font size, font, text color, border color, fill color). Es un flujo de dos pasos: abrir modal, confirmar con Apply, y luego el siguiente clic sobre otro elemento aplica el estilo.

**Criterios de aceptacion:**
- **Dado** que tengo una cosa seleccionada, **cuando** presiono `Ctrl+Shift+C`, **entonces** se abre el modal `Choose Which Style Elements To Copy` con esa cosa como origen.
- **Dado** que el modal se abre, **cuando** miro los checkboxes, **entonces** vienen todos marcados por defecto: `Font Size`, `Font`, `Text Color`, `Border Color`, `Fill Color` (ver frames `00020`, `00022`).
- **Dado** que desmarco algunos atributos y presiono `Apply`, **cuando** se activa el painter, **entonces** el siguiente clic sobre otra cosa aplica solo los atributos marcados.
- **Dado** que cancelo el modal, **cuando** se cierra, **entonces** el painter NO se activa.
- **Dado** que no hay seleccion, **cuando** presiono `Ctrl+Shift+C`, **entonces** el atajo no hace nada.

**Reglas y restricciones:**
- El modal es **confirmacion previa**, no aplicacion directa.
- Los 5 atributos son los observados; la lista exacta puede expandirse segun EPICA-14.
- Post-Apply, el modo painter persiste hasta el siguiente clic o hasta cancelar (detalle en `14-canvas-styling.md`).

**Modelo de datos tocado:**
- `thing.estilo.{fontSize, font, textColor, borderColor, fillColor}` — cuando se aplica en el target.

**Dependencias:**
- Bloqueada por: EPICA-14 (canvas-styling — flujo completo del format painter).

**Integraciones:**
- Renderer (re-dibuja el target con estilo copiado).

**Notas de evidencia:**
- Fuente: §2, §3, §4 ("Format painter").
- Frames: `frame_00020`, `frame_00022` (modal con 5 atributos marcados).
- Transcripcion: "`Ctrl+Shift+C` abre el modal *Choose Which Style Elements To Copy* (format painter) con la cosa seleccionada como origen".
- Clase de afirmacion: confirmado por transcripcion + observado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [atajo, styling, format-painter, modal, ctrl-shift].

---

### HU-90.016 — Respetar axioma "no creacion por teclado"

**Actor primario:** MN.
**Actores secundarios:** ME, AO.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-ui.
**Nivel categorico:** U (convencion de producto).
**Superficie UI:** global.
**Gesto canonico:** N/A (ausencia de atajo por diseno).

**Historia:**
> Como modelador, quiero que ningun atajo de teclado cree cosas (process/object) para que el gesto de creacion quede inequivocamente asociado al drag desde la main toolbar.

**Contexto de negocio:**
OPCloud explicita en §5 que **la creacion sigue siendo solo por drag**. Esta convencion protege la pedagogia del modelador novato: el drag es el gesto canonico, aprendido una vez, visible y directo. Atajos de creacion romperian la uniformidad y competerian con el arrastre como fuente de verdad. Mantener esta disciplina en este repo es una decision consciente de producto.

**Criterios de aceptacion:**
- **Dado** cualquier combinacion de teclas, **cuando** la presiono en el canvas sin arrastrar desde toolbar, **entonces** NO se crea ninguna nueva cosa (process, object, state).
- **Dado** que presiono un atajo reservado a edicion (p.ej. `Ctrl+V`), **cuando** lo ejecuto, **entonces** pega apariencias de entidades existentes — no crea entidades nuevas.
- **Dado** que el usuario tipea un atajo no mapeado, **cuando** el sistema lo recibe, **entonces** no hace nada (no se activan fallback de creacion).

**Reglas y restricciones:**
- Regla dura: **ningun atajo crea entidades** en el kernel.
- Excepciones permitidas: atajos que disparan flujos ya documentados (unfold → crea OPD hijo como efecto lateral del refinamiento, no creacion de cosa nueva).
- El modificador `Alt` no se observa usado en atajos OPCloud — preservar esa ausencia.

**Modelo de datos tocado:**
- Ninguno (es una restriccion).

**Dependencias:**
- Relaciona: HU-10.001, HU-10.002 (creacion por drag).

**Integraciones:**
- Toda la epica EPICA-10.

**Notas de evidencia:**
- Fuente: §5 ("No hay atajos de teclado para crear cosas [...] La creacion sigue siendo **solo por drag** desde la main toolbar").
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1 (convencion observada; facil de romper por accidente).
**Tamano:** XS (es una invariante de diseno).
**Etiquetas:** [atajo, convencion, axioma, no-creacion, no-alt].

---

### HU-90.017 — Mantener contraparte grafica de todos los atajos

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** main toolbar, halo, menu contextual.
**Gesto canonico:** N/A (invariante de producto).

**Historia:**
> Como modelador novato, quiero que todo atajo de teclado tenga un boton visible equivalente para poder descubrir la funcionalidad sin memorizar teclas.

**Contexto de negocio:**
El doc fuente es explicito: "los atajos son aceleradores, no capacidades exclusivas". Esta invariante protege la discoverability del modelador novato y hace los atajos opcionales. Romperla crearia funciones ocultas que el usuario experto domina y el novato desconoce — anti-pedagogico.

**Criterios de aceptacion:**
- **Dado** cualquier atajo documentado en esta epica, **cuando** busco una via grafica, **entonces** existe un boton en main toolbar, halo, menu contextual o modal equivalente.
- **Dado** que deshabilito el teclado (p.ej. tablet), **cuando** modelo, **entonces** todas las operaciones siguen siendo alcanzables via gesto.
- **Dado** que agrego un nuevo atajo al producto, **cuando** lo diseno, **entonces** existe previamente una contraparte grafica (no se anaden atajos-solo).

**Reglas y restricciones:**
- Invariante: **sin atajos exclusivos**. Cada atajo apunta a una accion que ya es invocable por mouse.
- Aplicable prospectivamente: futuros atajos deben verificar esta regla antes de ser anadidos.

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Relaciona con: HU-90.016 (axioma hermano).

**Notas de evidencia:**
- Fuente: §1, §3 (cada fila de la tabla tiene un equivalente grafico).
- Transcripcion: "todos tienen una invocacion equivalente via toolbar, halo o menu contextual — los atajos son aceleradores, no capacidades exclusivas".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** XS.
**Etiquetas:** [atajo, discoverability, toolbar-espejo, convencion, axioma].

---

### HU-90.018 — Duplicar seleccion con Ctrl+D (pregunta abierta)

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-ui.
**Nivel categorico:** K primario (si se implementa).
**Superficie UI:** canvas.
**Gesto canonico:** atajo `Ctrl+D` (candidato).

**Historia:**
> Como modelador experto, quiero duplicar rapidamente la seleccion con `Ctrl+D` para crear una nueva entidad con el mismo contenido sin pasar por copiar/pegar — **pendiente de confirmar** si el atajo existe y con que semantica.

**Contexto de negocio:**
`Ctrl+D` es un atajo razonablemente esperable en editores graficos (duplica en Figma, Inkscape, etc.). El doc fuente lo menciona como "esperable" pero la transcripcion NO lo demuestra; la duplicacion se hace via `Ctrl+C` + `Ctrl+V`, que produce copia **visual** de la misma entidad, no una nueva entidad.

Si `Ctrl+D` se implementara, la decision semantica es: ¿duplica entidad logica (nueva entidad con mismo nombre?) o es alias de `Ctrl+C`+`Ctrl+V` (copia visual)? Ambas rutas tienen trade-offs distintos.

**Criterios de aceptacion (provisionales):**
- **Dado** que OPCloud confirma `Ctrl+D`, **cuando** se adopta en este repo, **entonces** la semantica se documenta explicitamente (logical duplicate vs visual copy) antes de implementar.
- **Dado** que OPCloud no lo soporta, **cuando** validamos, **entonces** esta HU queda `deferred` y no entra al backlog activo.

**Reglas y restricciones:**
- Bloqueada por clarificacion.

**Dependencias:**
- Depende de respuesta a pregunta abierta §6 del doc fuente.

**Notas de evidencia:**
- Fuente: §3 nota final ("No mencionados explicitamente pero referidos como esperables: `Ctrl+D` duplicar"), §6 Q2.
- Clase de afirmacion: hipotesis / abierto.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [atajo, duplicar, requires-clarification, ctrl, open-question].

---

### HU-90.019 — Seleccionar todo con Ctrl+A (pregunta abierta)

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-ui.
**Nivel categorico:** U primario.
**Superficie UI:** canvas (OPD activo).
**Gesto canonico:** atajo `Ctrl+A` (candidato).

**Historia:**
> Como modelador experto, quiero seleccionar todas las cosas del OPD activo con `Ctrl+A` para aplicar operaciones masivas (mover, borrar, cambiar estilo) — **pendiente de confirmar** si OPCloud lo soporta.

**Contexto de negocio:**
`Ctrl+A` es atajo universal de select-all. El doc fuente §6 Q4 lo marca como **no demostrado** en los frames ni en la transcripcion. Puede existir pero no se capturo en la muestra. La semantica tipica es "seleccionar todo en el OPD activo" — no "en el modelo completo", porque multi-OPD no tiene sentido visual.

**Criterios de aceptacion (provisionales):**
- **Dado** que OPCloud confirma `Ctrl+A`, **cuando** se adopta, **entonces** selecciona todas las cosas del OPD visible (no cruza OPDs).
- **Dado** que `Ctrl+A` se implementa con multi-seleccion (ver shift+lazo), **cuando** el usuario lo usa, **entonces** el subsiguiente `Delete`, `Ctrl+C`, nudge actua sobre todo lo seleccionado.
- **Dado** que OPCloud no lo soporta, **cuando** validamos, **entonces** esta HU queda `deferred`.

**Reglas y restricciones:**
- Comportamiento para links: ¿incluidos en select-all? Pendiente.
- Scope: OPD activo (no modelo global).

**Dependencias:**
- Depende de respuesta a pregunta abierta §6 Q4.
- Relaciona: sistema de multi-seleccion (epica UI separada, posiblemente en EPICA-1A o implicita).

**Notas de evidencia:**
- Fuente: §3 nota final, §6 Q4 ("¿`Ctrl+A` selecciona todo en el OPD activo? No demostrado").
- Clase de afirmacion: hipotesis / abierto.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [atajo, select-all, requires-clarification, ctrl, open-question].

---

### HU-90.020 — Ajustar vista con Ctrl+0 / fit-to-screen (pregunta abierta)

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-ui.
**Nivel categorico:** V primario (ajuste de viewport).
**Superficie UI:** canvas.
**Gesto canonico:** atajo `Ctrl+0` (candidato).

**Historia:**
> Como modelador, quiero reencuadrar el canvas para ver todo el OPD actual con `Ctrl+0` — **pendiente de confirmar** si existe un atajo equivalente al boton de fit-to-screen visible en la toolbar.

**Contexto de negocio:**
La toolbar expone un boton de fit (icono de marco con flechas, visible en `frame_00001`) pero §6 Q1 del doc fuente marca que la narracion **no asigna tecla**. `Ctrl+0` es convencion razonable (Chrome reset zoom). Otra alternativa es `Ctrl+1` o numero de fit preestablecido.

**Criterios de aceptacion (provisionales):**
- **Dado** que OPCloud confirma `Ctrl+0`, **cuando** se adopta, **entonces** el canvas calcula el bounding box del OPD y ajusta zoom+pan para mostrar todo el contenido con padding.
- **Dado** que el OPD esta vacio, **cuando** se ejecuta, **entonces** el canvas vuelve al zoom base y al origen.
- **Dado** que hay zoom reset (`Ctrl+0` = zoom 100%) vs fit (zoom ajustado al contenido), **cuando** se decide, **entonces** se documenta cual semantica aplica.

**Reglas y restricciones:**
- Ambiguedad entre "reset zoom a 100%" y "fit to screen" — el doc fuente junta ambos sin distinguir. Documentar la eleccion.

**Dependencias:**
- Depende de respuesta a pregunta abierta §6 Q1.

**Notas de evidencia:**
- Fuente: §3 nota final, §6 Q1 ("¿Existe un atajo para fit-to-screen y zoom reset?").
- Frames: `frame_00001` muestra el boton de fit.
- Clase de afirmacion: hipotesis / abierto.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [atajo, zoom, viewport, fit-to-screen, requires-clarification, ctrl].

---

### HU-90.021 — Hacer zoom con Ctrl+scroll (pregunta abierta)

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-ui.
**Nivel categorico:** V primario.
**Superficie UI:** canvas.
**Gesto canonico:** `Ctrl` + rueda del mouse.

**Historia:**
> Como modelador, quiero hacer zoom in/out con `Ctrl+scroll` sobre el canvas para ajustar el nivel de detalle sin buscar botones — **pendiente de confirmar** si OPCloud lo soporta.

**Contexto de negocio:**
`Ctrl+scroll` es convencion universal de zoom en navegadores y editores graficos. El doc fuente §3 nota final lo menciona como "esperable pero no demostrado en la narracion ni en los frames". Es casi seguro que existe (seria desviacion fuerte del estandar si no), pero al no ser confirmado queda como pregunta abierta con trazabilidad.

**Criterios de aceptacion (provisionales):**
- **Dado** que el cursor esta sobre el canvas, **cuando** hago `Ctrl` + scroll hacia arriba, **entonces** el zoom aumenta centrado en la posicion del cursor.
- **Dado** que hago `Ctrl` + scroll hacia abajo, **cuando** ocurre, **entonces** el zoom disminuye.
- **Dado** que llego a los limites (min/max zoom), **cuando** sigo scrolleando, **entonces** el zoom se clampa.
- **Dado** que hago scroll sin `Ctrl`, **cuando** ocurre, **entonces** el comportamiento es pan vertical del canvas o scroll de la pagina — a decidir.

**Reglas y restricciones:**
- Prevenir zoom de la pagina (default del navegador) cuando el cursor esta sobre el canvas.
- Zoom centrado en cursor (convencion Figma) vs centrado en viewport — a definir.

**Dependencias:**
- Depende de respuesta a pregunta abierta §6 Q1 (junto con fit-to-screen).

**Notas de evidencia:**
- Fuente: §3 nota final ("zoom `Ctrl+scroll` [...] no aparecen demostrados").
- Clase de afirmacion: hipotesis / abierto.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [atajo, zoom, wheel, viewport, requires-clarification, ctrl].

---

## Preguntas abiertas derivadas (trazabilidad con §6 doc fuente)

- **Q90.1**: ¿Existe atajo para **fit-to-screen** y **zoom reset**? — cubierta por HU-90.020.
- **Q90.2**: ¿`Ctrl+D` duplica? — cubierta por HU-90.018.
- **Q90.3**: ¿Existe atajo para abrir OPL pane, Navigator o chat? — **no cubierta como HU nueva** (delega a futuras epicas 50, 41 cuando se defina). Se registra aqui como recordatorio.
- **Q90.4**: ¿`Ctrl+A` selecciona todo? — cubierta por HU-90.019.
- **Q90.5**: ¿Hay atajos especificos para la link table (p.ej. Enter para confirmar tipo)? — **relaciona** con HU-10.011 (Confirmar tipo de link). Marcar en EPICA-10 esa posibilidad si se decide implementar; no se emite HU separada aqui.
- **Q90.6**: ¿Que ocurre con `Ctrl+V` si el OPD destino no admite la cosa copiada? — cubierta como CA y regla en HU-90.004.
- **Q90.7 (derivada)**: ¿`Backspace` es equivalente a `Delete`? — cubierta como CA en HU-90.005.
- **Q90.8 (derivada)**: ¿`Ctrl+Shift+Z` alias de `Ctrl+Y`? — cubierta como CA en HU-90.009.
- **Q90.9 (derivada)**: Paso exacto del nudge (¿1 pixel o unidad de modelo?) — cubierta como CA en HU-90.006.
- **Q90.10 (derivada)**: ¿Wrap-around al final del arbol lineal en `Ctrl+↓`? — cubierta como CA en HU-90.010.

## Referencias cruzadas

- Doc fuente: `opcloud-reverse/90-interaccion-shortcuts.md`.
- Epicas que integran con esta:
  - **EPICA-10** (canvas-creacion-cosas): `Delete` y el axioma no-creacion-por-teclado (HU-90.005, HU-90.016, HU-90.017).
  - **EPICA-1C** (canvas-validaciones): modal `Choose Remove Operation` disparado por `Delete` (HU-90.005).
  - **EPICA-1A** (canvas-grid-resize): contraste entre snap-to-grid del drag y nudge fino de flechas (HU-90.006).
  - **EPICA-12** (canvas-inzooming): `Shift+U` delega al flujo de unfold (HU-90.014).
  - **EPICA-13** (canvas-estados): delete y copiar/pegar pueden afectar estados.
  - **EPICA-14** (canvas-styling): `Ctrl+Shift+C` delega al flujo completo del format painter (HU-90.015).
  - **EPICA-15**, **EPICA-16** (canvas-enlaces): seleccion y nudge de links, iconos de co-referencia (HU-90.007, HU-90.004).
  - **EPICA-17** (canvas-atributos-instancias): el little sign de copia visual se documenta alli (HU-90.004).
  - **EPICA-20** (estructura-opd-tree): navegacion jerarquica y lineal (HU-90.010 a HU-90.013).
  - **EPICA-30** (persistencia-guardar-cargar): `Ctrl+S` dispara el flujo Guardar (HU-90.001).
  - **EPICA-35** (persistencia-move-search): modal `Things searching` abierto por `Ctrl+F` (HU-90.002).
  - **EPICA-40** (colaboracion-permisos): `Ctrl+S` respeta permisos de edicion.
  - **EPICA-50** (opl-pane): atajo para togglear pane — pregunta abierta Q90.3.
- Invariantes del repo:
  - `src/persistencia/` — deshacer/rehacer requiere event log robusto (HU-90.008, HU-90.009).
  - Kernel debe distinguir **entidad logica** de **apariencia** para que copiar/pegar visual sea correcta (HU-90.003, HU-90.004).
  - `src/ui/` — el manejo global de atajos de teclado (despachador de atajos) es una pieza transversal nueva que esta epica requiere.
  - Convencion `prevent default` del navegador para `Ctrl+S`, `Ctrl+F`, `Ctrl+Shift+C` para no disparar comportamiento nativo del navegador.
