---
epica: "EPICA-41"
titulo: "Colaboracion — chat del modelo (panel, popup, busqueda, links, permisos, notificaciones)"
doc_fuente: "opcloud-reverse/41-colaboracion-chat.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "W"
hu_emitidas: 17
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "DIAGNOSTICO-PILOTO-EPICA-10.md"
---

## Resumen

Esta epica cubre la colaboracion asincrona textual entre modeladores con acceso al mismo modelo. El chat vive **vinculado al modelo** (no a la sesion del usuario) y es persistente entre sesiones. Funciona como superficie compacta en el left pane con capacidad de detach a popup flotante sobre el canvas. Las HU cubren: activacion por toggle en secondary toolbar, renderizado del panel y del popup, envio de mensajes, render cronologico con autor/timestamp relativo, busqueda, insercion de links internos a modelos OPCloud y URLs externas, gestion de no-leidos, integracion con permisos (quien accede al modelo accede al chat), borrado por admin, y placeholders/ausencia de estado.

La prioridad predominante de la epica es **W (won't-have en el ciclo actual)** porque depende de infraestructura multi-usuario vivo que esta fuera del alcance del modelador core del repo `opm-model-app`. Sin embargo las HU se documentan con el mismo rigor que las epicas M0 para preservar el mapa 1:1 con OPCloud y para mantener la semilla de un futuro modulo colaborativo (ver EPICA-40 permisos y EPICA-42 notes como contexto afin).

Las HU siguen el orden de aparicion en el doc fuente (§2 superficies, §3 flows principales, §4 flows secundarios, §5 controles, §6 modelo de datos, §7 integraciones, §8 shortcuts, §11 preguntas abiertas).

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-41.001 | Activar Model Chat con toggle en secondary toolbar | CO | W | S | opcloud-ui | — |
| HU-41.002 | Mostrar panel Model Chat en left pane bajo OPD Navigator | CO | W | M | opcloud-ui | — |
| HU-41.003 | Ver placeholder cuando no hay mensajes | CO | W | XS | opcloud-ui | — |
| HU-41.004 | Enviar mensaje con Enter o boton enviar | CO | W | S | opcloud-ui | — |
| HU-41.005 | Ver mensaje propio agregado a lista cronologica | CO | W | S | opcloud-ui | — |
| HU-41.006 | Recibir mensajes de otros colaboradores en tiempo real | CO | W | M | opcloud-ui | — |
| HU-41.007 | Ver timestamp relativo junto a cada mensaje | CO | W | S | opcloud-ui | — |
| HU-41.008 | Buscar mensajes con campo Search en el panel | CO | W | S | opcloud-ui | — |
| HU-41.009 | Insertar link interno a modelo OPCloud y abrirlo sin salir del cliente | CO | W | M | opcloud-ui | — |
| HU-41.010 | Insertar link externo URL y abrirlo en nueva ventana | CO | W | S | opcloud-ui | — |
| HU-41.011 | Detachar panel a popup flotante draggable sobre canvas | CO | W | M | opcloud-ui | — |
| HU-41.012 | Minimizar, maximizar y cerrar popup flotante | CO | W | S | opcloud-ui | — |
| HU-41.013 | Cerrar panel con toggle y perder estado abierto/cerrado por modelo | CO | W | XS | opcloud-ui | — |
| HU-41.014 | Ver contador de mensajes no leidos sobre toggle de toolbar | CO | W | S | opcloud-ui | — |
| HU-41.015 | Marcar mensajes como leidos automaticamente al tener panel abierto | CO | W | S | opcloud-ui | — |
| HU-41.016 | Gatear acceso al chat por permiso de lectura del modelo | CO | W | M | opcloud-ui | — |
| HU-41.017 | Permitir borrado de mensajes solo a rol admin de la organizacion | AO | W | M | opcloud-ui | — |

Total: **17 historias de usuario** (17 opcloud-ui).

## Historias de usuario

### HU-41.001 — Activar Model Chat con toggle en secondary toolbar

**Actor primario:** CO (colaborador editor).
**Actores secundarios:** MN, ME, RV — cualquiera con acceso al modelo.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/41-colaboracion-chat.md §2, §3.1, §5, §7.1, §9.
**Nivel categorico:** U primario; C (preferencia global futura) secundario.
**Superficie UI:** secondary-toolbar (zona derecha, junto a MQTT/ROS).
**Gesto canonico:** clic sobre boton toggle Model Chat.

**Historia:**
> Como colaborador, quiero activar o desactivar el panel Model Chat con un clic en el toggle de la secondary toolbar para decidir cuando ver la conversacion sin salir del modelo.

**Contexto de negocio:**
El toggle consolida el chat como un **cinturon de integracion** del modelo, equivalente a MQTT y ROS. Como la colaboracion textual no siempre es deseada (requiere foco dividido), un interruptor binario deja al modelador decidir cuando estar disponible. El resaltado azul oscuro es el patron compartido para indicar estado activo en esa toolbar.

**Criterios de aceptacion:**
- **Dado** que cargue un modelo y el chat esta cerrado, **cuando** hago clic en el boton Model Chat de la secondary toolbar, **entonces** el panel Model Chat se despliega en el left pane.
- **Dado** que el chat esta abierto, **cuando** hago clic de nuevo en el mismo toggle, **entonces** el panel se colapsa y desaparece del left pane.
- **Dado** que el toggle esta activo, **cuando** miro el boton, **entonces** tiene fondo azul oscuro que lo distingue del estado inactivo.
- **Dado** que el toggle esta inactivo, **cuando** miro el boton, **entonces** tiene el estilo neutro compartido con el resto de la toolbar.

**Reglas y restricciones:**
- Default: OFF al cargar modelo (observado §3.1 y §5 tabla).
- El estado activo se indica con fondo azul oscuro (convencion §9).
- Preferencia global futura para dejarlo siempre visible: **abierta** — no implementada en esta version (§5 defaults declarados).

**Modelo de datos tocado:**
- Estado de sesion local (no persistente por modelo — ver HU-41.013).

**Dependencias:**
- Bloquea a: HU-41.002, HU-41.014.

**Integraciones:**
- Secondary toolbar (compartida con MQTT EPICA-C0 y ROS EPICA-C2).
- Sistema de identidad (el boton solo es visible si el usuario tiene acceso al modelo — ver HU-41.016).

**Notas de evidencia:**
- Fuente: `opcloud-reverse/41-colaboracion-chat.md` §2, §3.1, §5, §7.1, §9.
- Frames: frame_00001, frame_00009.
- Transcripcion: "if I will turn it off it will close the model chat... I can put it back on and you will see that it was added again".
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [chat, ui, toolbar, toggle, secondary-toolbar, colaboracion].

---

### HU-41.002 — Mostrar panel Model Chat en left pane bajo OPD Navigator

**Actor primario:** CO.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/41-colaboracion-chat.md §2, §7.2.
**Nivel categorico:** U primario; V secundario (layout del left pane).
**Superficie UI:** left-pane + panel-model-chat.
**Gesto canonico:** ninguno (render declarativo tras activar toggle).

**Historia:**
> Como colaborador, quiero que el panel de chat aparezca en una ubicacion fija del left pane, debajo del OPD Navigator, para ubicarlo sin buscarlo entre los paneles existentes.

**Contexto de negocio:**
El chat es la cuarta pila del left pane cuando esta activo (`OnStar Example` → `Draggable OPM Things` → `OPD Navigator` → `Model Chat`). Mantener una ubicacion estable respeta el contrato implicito con el usuario de que los paneles tienen lugar propio. La seccion es colapsable y comparte iconografia `▶◁` con el resto del left pane para que el modelador reconozca el patron de detach sin aprender afordances nuevas.

**Criterios de aceptacion:**
- **Dado** que active el toggle Model Chat, **cuando** se renderiza el left pane, **entonces** aparece una nueva seccion titulada `Model Chat` debajo de `OPD Navigator`.
- **Dado** que el panel esta renderizado, **cuando** miro su header, **entonces** veo el titulo `Model Chat` y controles de detach/collapse con iconos `▶◁` / `◁▶`.
- **Dado** que hay otros paneles ya presentes en el left pane, **cuando** se agrega el chat, **entonces** estos no se reordenan — el chat siempre se anade como ultima pila.

**Reglas y restricciones:**
- Orden fijo en el left pane (convencion §7.2).
- Iconografia `▶◁` identica al resto de paneles (patron de detach generalizado, §9).
- Seccion colapsable dentro del panel (observacion §2 tabla).

**Modelo de datos tocado:**
- Ninguno persistente. Orden del left pane es configuracion visual.

**Dependencias:**
- Bloqueada por: HU-41.001.
- Bloquea a: HU-41.003, HU-41.004, HU-41.005, HU-41.007, HU-41.008, HU-41.011.

**Integraciones:**
- Left pane layout (compartido con EPICA-20 OPD tree y EPICA-21 system map).

**Notas de evidencia:**
- Fuente: §2 tabla superficies, §7.2 left pane.
- Frames: frame_00001, frame_00015.
- Clase de afirmacion: observado.

**Prioridad:** W.
**Tamano:** M.
**Etiquetas:** [chat, ui, panel-lateral, left-pane, layout].

---

### HU-41.003 — Ver placeholder cuando no hay mensajes

**Actor primario:** CO.
**Actores secundarios:** MN (primera experiencia con la funcionalidad).
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/41-colaboracion-chat.md §2, §3.1, §4.1.
**Nivel categorico:** U.
**Superficie UI:** panel-model-chat (zona central).
**Gesto canonico:** ninguno.

**Historia:**
> Como colaborador que abre por primera vez el chat de un modelo, quiero ver un texto guia que me indique que puedo enviar el primer mensaje para no quedarme mirando un panel vacio sin saber que hacer.

**Contexto de negocio:**
El empty-state es pedagogico. Un panel vacio sin instrucciones fomenta la duda ("?hay un bug?", "?se esta cargando?"). El placeholder convierte ese momento en una invitacion clara a la accion.

**Criterios de aceptacion:**
- **Dado** que el chat del modelo no tiene mensajes, **cuando** abro el panel Model Chat, **entonces** veo el texto `Nothing here yet, send your first message below.` centrado en la zona de lista.
- **Dado** que envie el primer mensaje, **cuando** aparece en la lista, **entonces** el placeholder desaparece.
- **Dado** que se borraron todos los mensajes (por admin, ver HU-41.017), **cuando** vuelvo al panel, **entonces** reaparece el placeholder.

**Reglas y restricciones:**
- Texto exacto observado: `Nothing here yet, send your first message below.`
- El placeholder es solo visual; no bloquea el input.

**Modelo de datos tocado:**
- Ninguno. Derivado: `count(mensajes where chat.modelId = current) == 0`.

**Dependencias:**
- Bloqueada por: HU-41.002.

**Integraciones:**
- Lista de mensajes (HU-41.005).

**Notas de evidencia:**
- Fuente: §2 tabla (placeholder vacio), §3.1 paso 4, §4.1.
- Frames: frame_00001.
- Clase de afirmacion: observado.

**Prioridad:** W.
**Tamano:** XS.
**Etiquetas:** [chat, ui, placeholder, empty-state].

---

### HU-41.004 — Enviar mensaje con Enter o boton enviar

**Actor primario:** CO.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/41-colaboracion-chat.md §3.2, §8.
**Nivel categorico:** U primario; P (persiste mensaje) secundario.
**Superficie UI:** panel-model-chat (input inferior + boton enviar).
**Gesto canonico:** escritura en input + `Enter` o clic en boton.

**Historia:**
> Como colaborador, quiero escribir un mensaje en el campo inferior y enviarlo con Enter o con un boton explicito para cubrir ambas preferencias de interaccion (teclado y mouse).

**Contexto de negocio:**
La doble afordance `Enter` + boton es el patron universal del chat. Enter cubre al usuario de teclado rapido, el boton cubre al usuario que prefiere confirmacion visual. Es el mismo principio que el popup de naming en HU-10.005.

**Criterios de aceptacion:**
- **Dado** que escribo texto en el input `Enter Message...`, **cuando** presiono `Enter`, **entonces** el mensaje se envia y el input queda vacio.
- **Dado** que escribo texto en el input, **cuando** hago clic en el boton enviar adyacente, **entonces** el mensaje se envia y el input queda vacio.
- **Dado** que el input esta vacio, **cuando** presiono `Enter` o el boton, **entonces** no se envia ningun mensaje (fail-safe).
- **Dado** que presiono `Enter`, **cuando** ocurre el envio, **entonces** el foco permanece en el input para permitir respuesta rapida.

**Reglas y restricciones:**
- Enter envia; no hay modo multilinea documentado (abierto si shift+enter agrega salto).
- El boton se habilita solo con texto presente (default observado §5 tabla).

**Modelo de datos tocado:**
- `mensaje.id` — UUID — persistente.
- `mensaje.cuerpo` — string (texto plano) — persistente.
- `mensaje.modeloId` — ID de modelo — persistente.
- `mensaje.autorId` — ID de usuario emisor — persistente.
- `mensaje.timestamp` — ISO datetime servidor — persistente.

**Dependencias:**
- Bloqueada por: HU-41.002, HU-41.016.
- Bloquea a: HU-41.005, HU-41.006, HU-41.007.

**Integraciones:**
- Backend de mensajeria (fuera del scope del repo modelador core).
- Sistema de identidad (provee `autorId` y `autorNombreVisible`).

**Notas de evidencia:**
- Fuente: §3.2, §8 shortcuts.
- Transcripcion: "Enter dentro del input envia el mensaje".
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [chat, ui, input, enter, send].

---

### HU-41.005 — Ver mensaje propio agregado a lista cronologica

**Actor primario:** CO.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/41-colaboracion-chat.md §2, §3.2, §9.
**Nivel categorico:** V primario; U secundario.
**Superficie UI:** panel-model-chat (lista central de mensajes).
**Gesto canonico:** ninguno (render post-envio).

**Historia:**
> Como colaborador, quiero ver mi mensaje aparecer inmediatamente en la lista con mi nombre de autor, el texto y la hora para confirmar que se envio y tener contexto visual.

**Contexto de negocio:**
El render inmediato del mensaje propio es la retroalimentacion minima de un chat funcional. Separar autor en verde y cuerpo en negro es la convencion cromatica observada (mismo verde que OPL para objetos fisicos — acento de identidad del tenant, §9).

**Criterios de aceptacion:**
- **Dado** que envie un mensaje, **cuando** la lista se renderiza, **entonces** aparece una burbuja al final con mi `autorNombreVisible` en verde, el texto en negro y el timestamp relativo en gris.
- **Dado** que envie varios mensajes, **cuando** miro la lista, **entonces** los mensajes estan ordenados cronologicamente de mas antiguo (arriba) a mas reciente (abajo).
- **Dado** que mi mensaje fue el primero, **cuando** se renderiza, **entonces** el placeholder `Nothing here yet...` desaparece (ver HU-41.003).

**Reglas y restricciones:**
- Autor en color verde (convencion §9).
- Texto del mensaje en negro regular.
- Timestamp en gris claro, alineado a la derecha (§9).
- Orden: cronologico ascendente (observado §2 tabla, §3.2 paso 3, frames 11/15/19).

**Modelo de datos tocado:**
- Lectura de `mensaje.*` (ver HU-41.004).
- Derivado de lectura: `mensaje.autorNombreVisible` (ej. `OPCloud Modeler`, `OPCloudManager`).

**Dependencias:**
- Bloqueada por: HU-41.004.

**Integraciones:**
- Sistema de identidad (provee nombre visible).
- Render OPL (reutiliza mismo verde de objetos fisicos).

**Notas de evidencia:**
- Fuente: §2 tabla (lista cronologica), §3.2, §9.
- Frames: frame_00011, frame_00015, frame_00019.
- Clase de afirmacion: observado.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [chat, ui, render, lista, autor-verde, cronologico].

---

### HU-41.006 — Recibir mensajes de otros colaboradores en tiempo real

**Actor primario:** CO.
**Actores secundarios:** otros CO activos simultaneamente.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/41-colaboracion-chat.md §1, §4.4, §11.
**Nivel categorico:** P primario (sync backend); V secundario (render reactivo).
**Superficie UI:** panel-model-chat + popup si detached.
**Gesto canonico:** ninguno (push del servidor).

**Historia:**
> Como colaborador, quiero que los mensajes enviados por otros modeladores aparezcan en mi panel sin necesidad de refrescar para mantener la conversacion fluida.

**Contexto de negocio:**
El chat solo cumple su promesa colaborativa si los mensajes llegan sin gestos explicitos del receptor. La transcripcion confirma que los mensajes de otros modeladores llegan "en tiempo real tanto al panel como al popup" (§4.4), lo que implica un canal sync activo (websocket, SSE o polling corto).

**Criterios de aceptacion:**
- **Dado** que tengo el panel abierto, **cuando** otro colaborador envia un mensaje al mismo modelo, **entonces** la burbuja aparece en mi lista sin accion de mi parte.
- **Dado** que tengo el popup flotante abierto (HU-41.011), **cuando** llega un mensaje, **entonces** aparece tanto en el popup como en el panel adosado.
- **Dado** que dos usuarios envian simultaneamente, **cuando** los mensajes llegan, **entonces** se ordenan por timestamp del servidor (inferido, no visible directamente).

**Reglas y restricciones:**
- Mecanismo exacto: **abierto** — podria ser websocket o polling. Inferencia: sync server-pushed.
- Ordering en conflicto: timestamp servidor (hipotesis §11 pregunta 6).
- Performance: el render reactivo no debe bloquear interaccion con canvas (§4.4).

**Modelo de datos tocado:**
- Lectura reactiva de `mensaje.*`.
- Canal sync: `chat.modeloId` como clave de suscripcion.

**Dependencias:**
- Bloqueada por: HU-41.004, HU-41.016.
- Relaciona: HU-41.014 (no-leidos si panel cerrado), HU-41.015 (marca leido automatico si abierto).

**Integraciones:**
- Backend de mensajeria (fuera scope repo modelador core).

**Notas de evidencia:**
- Fuente: §1 proposito (persistente entre sesiones), §4.4, §11 pregunta 6.
- Clase de afirmacion: confirmado por transcripcion (§4.4) + inferido (mecanismo concreto abierto).

**Prioridad:** W.
**Tamano:** M.
**Etiquetas:** [chat, persistencia, tiempo-real, sync, backend].

---

### HU-41.007 — Ver timestamp relativo junto a cada mensaje

**Actor primario:** CO.
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/41-colaboracion-chat.md §2, §6, §9.
**Nivel categorico:** V primario; L (lente) secundario.
**Superficie UI:** panel-model-chat (timestamp en burbuja).
**Gesto canonico:** ninguno.

**Historia:**
> Como colaborador, quiero ver cuando se envio cada mensaje en formato relativo (`just now`, `a minute ago`, `2 minutes ago`) para tener contexto temporal legible sin decodificar fechas absolutas.

**Contexto de negocio:**
El formato relativo es natural para conversaciones cortas y recientes. Es la convencion dominante en chat moderno (Slack, iMessage, WhatsApp). Para mensajes mas antiguos, OPCloud **no documenta** el cambio a formato absoluto — podria ser un gap (pregunta abierta implicita).

**Criterios de aceptacion:**
- **Dado** que envie un mensaje hace segundos, **cuando** miro la lista, **entonces** el timestamp dice `just now`.
- **Dado** que un mensaje tiene uno o dos minutos, **cuando** miro la lista, **entonces** el timestamp dice `a minute ago` o `2 minutes ago`.
- **Dado** que pasa el tiempo, **cuando** el panel sigue abierto, **entonces** los timestamps se actualizan progresivamente (comportamiento esperado de formato relativo; no explicitamente observado pero estandar del patron).
- **Dado** que el timestamp esta presente, **cuando** miro la burbuja, **entonces** se renderiza en gris claro alineado a la derecha.

**Reglas y restricciones:**
- Formato observado: `just now`, `a minute ago`, `N minutes ago` (§9, frames 11/15/19).
- Refresh automatico: inferido — no explicito en fuentes.
- Transicion a formato absoluto (horas, dias, fechas): **abierta**, no observado en los 19 frames.

**Modelo de datos tocado:**
- Lectura de `mensaje.timestamp` (ISO servidor, renderizado como relativo).

**Dependencias:**
- Bloqueada por: HU-41.005, HU-41.006.

**Integraciones:**
- Motor de formato de tiempo relativo (biblioteca estandar o utility propia).

**Notas de evidencia:**
- Fuente: §2 tabla, §9, §6 modelo de datos (`mensaje.timestamp`).
- Frames: frame_00011 (`a minute ago`), frame_00015 (`2 minutes ago`, `just now`), frame_00019 (`2 minutes ago`, `a minute ago`).
- Clase de afirmacion: observado + inferido para refresh automatico.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [chat, ui, timestamp, relativo, legibilidad].

---

### HU-41.008 — Buscar mensajes con campo Search en el panel

**Actor primario:** CO.
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/41-colaboracion-chat.md §2, §3.3.
**Nivel categorico:** U primario; L (lente de filtrado) secundario.
**Superficie UI:** panel-model-chat (campo Search arriba).
**Gesto canonico:** escritura en input Search.

**Historia:**
> Como colaborador con historial largo en un modelo, quiero buscar mensajes por una cadena de texto para localizar una decision, una pregunta o un link sin hacer scroll ciego.

**Contexto de negocio:**
Los chats de modelos activos acumulan historia. El Search convierte el panel en un archivo consultable y reduce la friccion de recuperar contexto — critica cuando el chat sirve como bitacora de decisiones tecnicas sobre el modelo.

**Criterios de aceptacion:**
- **Dado** que el panel tiene mensajes, **cuando** escribo una cadena en el campo `Search`, **entonces** la lista se filtra a los mensajes cuyo cuerpo contiene la cadena.
- **Dado** que borro el texto del Search, **cuando** el campo queda vacio, **entonces** la lista vuelve a mostrar todos los mensajes.
- **Dado** que la busqueda no tiene resultados, **cuando** miro la lista, **entonces** la lista queda vacia (no se especifica placeholder de "no hay resultados" — comportamiento abierto).
- **Dado** que busco mientras llegan mensajes nuevos (HU-41.006), **cuando** el nuevo mensaje coincide con la query, **entonces** aparece filtrado; si no coincide, no aparece hasta limpiar Search.

**Reglas y restricciones:**
- Coincidencia: **abierto** — probablemente substring case-insensitive, no regex.
- Scope: mensajes del modelo actual unicamente (no cross-modelo).
- Campos buscados: `cuerpo` confirmado; si incluye `autorNombreVisible` o metadata es abierto.

**Modelo de datos tocado:**
- Ninguno persistente; filtrado es lente sobre lectura.

**Dependencias:**
- Bloqueada por: HU-41.002, HU-41.005.

**Integraciones:**
- Lista de mensajes (misma fuente de datos).

**Notas de evidencia:**
- Fuente: §2 tabla (input de busqueda), §3.3.
- Transcripcion: "I can search for it".
- Clase de afirmacion: observado + confirmado por transcripcion (accion); abierto (scope exacto, matching rules).

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [chat, ui, search, filtrado, lente].

---

### HU-41.009 — Insertar link interno a modelo OPCloud y abrirlo sin salir del cliente

**Actor primario:** CO.
**Actores secundarios:** receptor colaborador.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/41-colaboracion-chat.md §3.4, §6, §7.4, §11.
**Nivel categorico:** U primario; X (integracion interna entre modelos) secundario.
**Superficie UI:** panel-model-chat (cuerpo del mensaje con link renderizado).
**Gesto canonico:** escritura de URL canonica + envio; clic del receptor sobre link.

**Historia:**
> Como colaborador, quiero pegar un link a otro modelo OPCloud en el chat para que mis companeros abran ese modelo con un clic sin salir del entorno.

**Contexto de negocio:**
El chat del modelo frecuentemente referencia otros modelos (version anterior, sub-modelo de contexto, ejemplo canonico). Abrir sin perder la aplicacion respeta la continuidad del flujo de trabajo. Requiere una URL canonica estable por modelo — ver pregunta abierta §11.2.

**Criterios de aceptacion:**
- **Dado** que pego en el input una URL canonica de modelo OPCloud, **cuando** envio el mensaje, **entonces** la URL se renderiza como link accionable en la burbuja.
- **Dado** que el mensaje tiene un link interno, **cuando** otro colaborador hace clic, **entonces** OPCloud navega al modelo referenciado **dentro del mismo cliente** (no en nueva pestana).
- **Dado** que el link apunta a un modelo al que el usuario no tiene acceso, **cuando** intenta abrirlo, **entonces** recibe el error de permisos estandar (delegado a EPICA-40).

**Reglas y restricciones:**
- Formato URL canonica: **abierto** — §11 pregunta 2.
- Distincion visual entre link interno y externo: inferida; no observada explicitamente.
- Handle permanente del modelo: inferido si, para resistir renombres (§11 pregunta 5).

**Modelo de datos tocado:**
- `mensaje.links[]` — array con items `{ kind: "internalOPCloudModelLink", url, targetModelId? }` — persistente.

**Dependencias:**
- Bloqueada por: HU-41.004.
- Integra: EPICA-40 (permisos al abrir), EPICA-30 (persistencia de modelo con ID canonico).

**Integraciones:**
- Router interno del cliente OPCloud.
- Sistema de permisos (EPICA-40).

**Notas de evidencia:**
- Fuente: §3.4, §6 modelo (`mensaje.links` con `internalOPCloudModelLink`), §7.4, §11 preguntas 2 y 5.
- Clase de afirmacion: confirmado por transcripcion + abierto (formato URL).
- Etiqueta: `requires-clarification`.

**Prioridad:** W.
**Tamano:** M.
**Etiquetas:** [chat, ui, link-interno, navegacion, integracion-modelo, requires-clarification].

---

### HU-41.010 — Insertar link externo URL y abrirlo en nueva ventana

**Actor primario:** CO.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/41-colaboracion-chat.md §3.5, §6.
**Nivel categorico:** U primario; X secundario.
**Superficie UI:** panel-model-chat (cuerpo del mensaje).
**Gesto canonico:** escritura de URL externa + envio; clic del receptor.

**Historia:**
> Como colaborador, quiero incluir URLs externas (docs, issues, referencias) en un mensaje para que se abran en una nueva ventana y mantengan el contexto de OPCloud intacto.

**Contexto de negocio:**
Distinguir link interno (abre en cliente) vs externo (abre en nueva ventana) respeta la integridad del contexto de trabajo. Un link externo que reemplaza la pestana actual destruiria el estado del modelado en curso.

**Criterios de aceptacion:**
- **Dado** que envio un mensaje con una URL que no es canonica de OPCloud, **cuando** se renderiza, **entonces** aparece como link accionable.
- **Dado** que otro colaborador hace clic en el link externo, **cuando** el navegador responde, **entonces** la URL se abre en **nueva ventana/pestana** (no reemplaza la actual).
- **Dado** que el link es externo, **cuando** se renderiza, **entonces** podria mostrarse con indicador visual (icono de enlace saliente) — **abierto**, no observado explicitamente.

**Reglas y restricciones:**
- Deteccion interno vs externo: basada en dominio canonico OPCloud.
- `target="_blank"` equivalente — confirma transcripcion "en nueva ventana".

**Modelo de datos tocado:**
- `mensaje.links[]` — items `{ kind: "externalURL", url }` — persistente.

**Dependencias:**
- Bloqueada por: HU-41.004.

**Integraciones:**
- Navegador del usuario.

**Notas de evidencia:**
- Fuente: §3.5, §6 modelo.
- Transcripcion: "nueva ventana" para URLs externas.
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [chat, ui, link-externo, url, nueva-ventana].

---

### HU-41.011 — Detachar panel a popup flotante draggable sobre canvas

**Actor primario:** CO.
**Actores secundarios:** ME (usa canvas mientras chatea).
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/41-colaboracion-chat.md §2, §3.6, §4.4, §6, §9.
**Nivel categorico:** U primario; V secundario (capa flotante).
**Superficie UI:** popup-model-chat (flotante sobre canvas).
**Gesto canonico:** clic sobre boton `▶◁` en el header del panel + drag del handle de cruz en el popup.

**Historia:**
> Como colaborador que quiere ver el canvas al mismo tiempo que chatea, quiero despegar el panel a una ventana flotante sobre el diagrama para no perder vista del modelo mientras conversamos.

**Contexto de negocio:**
El panel adosado come ancho al canvas. Cuando la conversacion requiere referencias visuales repetidas al modelo, el popup flotante libera el left pane y ubica el chat encima del diagrama, reposicionable segun convenga. El handle de cruz es el lenguaje de drag generico de OPCloud (§9).

**Criterios de aceptacion:**
- **Dado** que tengo el panel adosado en left pane, **cuando** presiono el boton `▶◁` del header, **entonces** el chat se convierte en **ventana flotante** sobre el canvas.
- **Dado** que el popup esta flotante, **cuando** hago drag sobre el handle de cruz de cuatro flechas (esquina superior izquierda), **entonces** la ventana se mueve con el cursor.
- **Dado** que el popup esta flotante, **cuando** interactuo con el canvas (pan, crear, seleccionar), **entonces** el chat no bloquea la edicion (§4.4).
- **Dado** que el popup flotante esta activo, **cuando** llegan mensajes (HU-41.006), **entonces** aparecen simultaneamente en el popup y en la memoria del panel adosado (tanto si se reabre).
- **Dado** que cierro el popup (boton cerrar en esquina superior derecha), **cuando** ocurre el cierre, **entonces** el chat **vuelve al panel lateral** en su estado previo.

**Reglas y restricciones:**
- Popup contiene identica superficie que el panel: Search, lista, input, boton enviar (observado §2 tabla).
- Handle de cruz de 4 flechas: convencion de drag generico OPCloud (§9).
- Posicion y tamano del popup: **no persistentes** (§6 estado local transitorio).

**Modelo de datos tocado:**
- Estado UI local (no persistente): `popup.posicion`, `popup.tamano`, `popup.estaDetachado`.

**Dependencias:**
- Bloqueada por: HU-41.002.
- Bloquea a: HU-41.012.

**Integraciones:**
- Canvas (el popup no intercepta eventos de canvas).
- Capa de overlay UI.

**Notas de evidencia:**
- Fuente: §2 tabla (popup flotante, handle, controles), §3.6, §4.4, §6 estado local, §9.
- Frames: frame_00009 (popup a medio camino), frame_00011 (popup completo sobre canvas).
- Clase de afirmacion: observado + confirmado.

**Prioridad:** W.
**Tamano:** M.
**Etiquetas:** [chat, ui, popup, detach, drag, flotante].

---

### HU-41.012 — Minimizar, maximizar y cerrar popup flotante

**Actor primario:** CO.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/41-colaboracion-chat.md §2, §3.6, §5.
**Nivel categorico:** U.
**Superficie UI:** popup-model-chat (controles esquina superior derecha).
**Gesto canonico:** clic en botones `−`, `+`, cerrar.

**Historia:**
> Como colaborador que detacho el chat, quiero controlar el tamano del popup con minimizar, maximizar y cerrar para adaptarlo a mi espacio disponible sin perder la sesion.

**Contexto de negocio:**
Los controles de ventana `− / + / cerrar` en la esquina superior derecha replican la semantica familiar de ventanas de sistema operativo. Dan al usuario control sobre el ruido visual del popup sin recurrir al toggle global.

**Criterios de aceptacion:**
- **Dado** que el popup esta flotante, **cuando** hago clic en `−` (minimizar), **entonces** el popup se reduce a un tamano minimo (comportamiento exacto abierto — barra de titulo u otro).
- **Dado** que el popup esta flotante, **cuando** hago clic en `+` (maximizar), **entonces** el popup se amplia a un tamano mayor (observado como "ampliar").
- **Dado** que el popup esta flotante, **cuando** hago clic en cerrar, **entonces** el popup se cierra y el chat vuelve al panel lateral (ver HU-41.011).
- **Dado** que minimizo o maximizo, **cuando** ocurre el cambio de tamano, **entonces** la posicion del popup no se resetea.

**Reglas y restricciones:**
- Popup inicia en "tamano medio" al detach (§5 tabla defaults).
- Semantica exacta de `−` (minimizar a que estado): **abierta** en fuente.

**Modelo de datos tocado:**
- Estado UI local: `popup.modoTamano` ∈ `{ min, medium, max }`.

**Dependencias:**
- Bloqueada por: HU-41.011.

**Integraciones:**
- Capa overlay UI.

**Notas de evidencia:**
- Fuente: §2 tabla (controles de popup), §3.6 paso 5, §5 tabla.
- Frames: frame_00011.
- Clase de afirmacion: observado (presencia de botones) + abierto (semantica exacta minimizar).

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [chat, ui, popup, controles-ventana, tamano].

---

### HU-41.013 — Cerrar panel con toggle y perder estado abierto/cerrado por modelo

**Actor primario:** CO.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/41-colaboracion-chat.md §3.7, §4.3, §11.
**Nivel categorico:** U primario; P (no-persistencia explicita) secundario.
**Superficie UI:** secondary-toolbar + left-pane.
**Gesto canonico:** clic en toggle Model Chat con panel abierto.

**Historia:**
> Como colaborador, quiero cerrar el panel con el mismo toggle que lo abrio y aceptar que cada vez que reabra el modelo tendre que decidir si mostrarlo nuevamente, porque el estado abierto/cerrado **no se persiste por modelo**.

**Contexto de negocio:**
La decision de diseno observada es intencional: el chat no recuerda su estado por modelo. La transcripcion explicita que habra una preferencia global futura ("you want to see it all the time or not later on") pero en la version observada el estado es transitorio. Este comportamiento es relevante porque marca el contrato de no-persistencia con el usuario.

**Criterios de aceptacion:**
- **Dado** que el panel esta abierto, **cuando** hago clic en el toggle Model Chat, **entonces** el panel se colapsa y desaparece del left pane.
- **Dado** que cerre el panel y recargo el modelo, **cuando** se abre el modelo, **entonces** el chat esta **cerrado** por default, sin importar que estuviera abierto en la sesion anterior.
- **Dado** que abri y cerre el panel en un modelo A y luego cargo un modelo B, **cuando** miro B, **entonces** el chat esta cerrado (no hay memoria global ni por modelo).
- **Dado** que la version futura implemente preferencia global, **cuando** este disponible, **entonces** se tratara como nueva HU (no cubierta aqui).

**Reglas y restricciones:**
- Confirmado por transcripcion (§4.3): "it will not currently remember if you're closed or open the model chat for that specific model".
- Existe una intencion de preferencia global futura: **abierta** — §11 pregunta 4.

**Modelo de datos tocado:**
- Ninguno persistente en este recorte. Futuro: `usuario.preferencias.chat.siempreVisible` — **abierto**.

**Dependencias:**
- Bloqueada por: HU-41.001.

**Integraciones:**
- EPICA-80 config-user-org (futura preferencia global).

**Notas de evidencia:**
- Fuente: §3.7, §4.3, §11 pregunta 4.
- Transcripcion: confirma no-persistencia actual y anuncio de preferencia futura.
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** W.
**Tamano:** XS.
**Etiquetas:** [chat, ui, toggle, persistencia-sesion, no-persistencia].

---

### HU-41.014 — Ver contador de mensajes no leidos sobre toggle de toolbar

**Actor primario:** CO.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/41-colaboracion-chat.md §2, §3.8, §6.
**Nivel categorico:** U primario; P (persiste read-receipt por-usuario).
**Superficie UI:** secondary-toolbar (boton Model Chat + tooltip flotante).
**Gesto canonico:** hover sobre toggle con chat cerrado.

**Historia:**
> Como colaborador que trabaja con el chat cerrado, quiero ver cuantos mensajes nuevos tengo pendientes para decidir si abrir el panel y atender la conversacion.

**Contexto de negocio:**
La notificacion ambient (tooltip on-hover) respeta el foco del modelador sin interrumpir. El contador es por-usuario (cada modelador tiene su propio estado de `leidoPor`) — confirma que el modelo de datos incluye `mensaje.leidoPor` (§6).

**Criterios de aceptacion:**
- **Dado** que el panel esta cerrado y hay mensajes sin leer, **cuando** hago hover sobre el toggle Model Chat, **entonces** aparece tooltip `Total Unread Messages: N` con el conteo correcto.
- **Dado** que no hay mensajes sin leer, **cuando** hago hover, **entonces** el tooltip muestra `Total Unread Messages: 0` (frame_00009).
- **Dado** que el panel esta cerrado, **cuando** llega un nuevo mensaje de otro colaborador, **entonces** el contador se incrementa en 1 para mi usuario (no para el emisor).
- **Dado** que abro el panel, **cuando** los mensajes pendientes son visibles, **entonces** el contador vuelve a 0 (ver HU-41.015).

**Reglas y restricciones:**
- El contador es por-usuario.
- Mensajes propios nunca incrementan el contador propio.
- Indicador visual adicional (badge, punto rojo) sobre el boton: **abierto** — no observado explicitamente; solo tooltip confirmado.

**Modelo de datos tocado:**
- `mensaje.leidoPor` — array de `usuarioId` — persistente.
- Derivado: `count(mensajes where modeloId = current AND usuarioId NOT IN leidoPor)`.

**Dependencias:**
- Bloqueada por: HU-41.001, HU-41.006.

**Integraciones:**
- Backend de mensajeria (mantiene `leidoPor`).

**Notas de evidencia:**
- Fuente: §2 tabla (tooltip), §3.8 pasos 1-2, §6 modelo.
- Frames: frame_00009.
- Clase de afirmacion: observado.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [chat, ui, notificacion, unread, tooltip, contador].

---

### HU-41.015 — Marcar mensajes como leidos automaticamente al tener panel abierto

**Actor primario:** CO.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/41-colaboracion-chat.md §3.8.
**Nivel categorico:** P primario; U secundario.
**Superficie UI:** panel-model-chat + popup flotante.
**Gesto canonico:** ninguno (consecuencia de tener panel abierto).

**Historia:**
> Como colaborador con el panel abierto, quiero que los mensajes nuevos se marquen automaticamente como leidos sin que tenga que confirmar, para mantener la bandeja limpia.

**Contexto de negocio:**
La transcripcion confirma: "si el chat ya esta abierto al llegar un mensaje, este se marca automaticamente como leido y nunca incrementa el contador". Esto simplifica el modelo mental del usuario: mientras este mirando, no acumula notificaciones falsas.

**Criterios de aceptacion:**
- **Dado** que el panel esta abierto, **cuando** llega un mensaje nuevo (HU-41.006), **entonces** el `mensaje.leidoPor` incluye mi `usuarioId` inmediatamente.
- **Dado** que el panel esta abierto, **cuando** miro el tooltip del toggle, **entonces** el contador permanece en 0.
- **Dado** que abro el panel y habia mensajes pendientes, **cuando** se renderizan, **entonces** todos los mensajes pendientes pasan a `leidoPor` con mi usuarioId y el contador cae a 0.
- **Dado** que tengo el popup flotante abierto (HU-41.011), **cuando** llegan mensajes, **entonces** tambien se marcan como leidos — el popup y el panel comparten estado de lectura.

**Reglas y restricciones:**
- La regla es determinista y confirma la transcripcion (§3.8 paso 4).
- Scope: aplica al modelo actual; otros modelos mantienen sus contadores independientes.

**Modelo de datos tocado:**
- `mensaje.leidoPor` — escritura automatica — persistente.

**Dependencias:**
- Bloqueada por: HU-41.002, HU-41.006, HU-41.014.

**Integraciones:**
- Backend de mensajeria.

**Notas de evidencia:**
- Fuente: §3.8 paso 4.
- Transcripcion: confirma marca automatica.
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [chat, persistencia, read-receipt, automatico, read-by].

---

### HU-41.016 — Gatear acceso al chat por permiso de lectura del modelo

**Actor primario:** CO.
**Actores secundarios:** AO (configura permisos).
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/41-colaboracion-chat.md §7.3.
**Nivel categorico:** K (semantica de acceso) primario; U secundario (visibilidad del toggle); X (integracion con subsistema de permisos) secundario.
**Superficie UI:** secondary-toolbar (visibilidad condicional) + panel (visibilidad del input de envio).
**Gesto canonico:** ninguno — se deriva del permiso del usuario sobre el modelo.

**Historia:**
> Como organizacion, quiero que solo los usuarios con acceso de lectura al modelo vean el chat y que solo quienes pueden editar (o tienen permiso explicito de chat) puedan escribir en el, para que la colaboracion respete el modelo de permisos del workspace.

**Contexto de negocio:**
El chat se apoya en la identidad del tenant (§7.3). El acceso al chat **hereda** el acceso al modelo. Si un usuario no puede leer el modelo, no deberia ver el toggle ni los mensajes. Si solo puede leer (no editar), su capacidad de enviar mensajes depende de una decision de producto: por defecto se asume que **puede leer y chatear** pero **no editar el canvas** — esto es coherente con la idea de "chat = canal de conversacion sobre el modelo", no parte de la edicion.

**Criterios de aceptacion:**
- **Dado** que un usuario no tiene acceso de lectura al modelo, **cuando** intenta abrir el modelo, **entonces** el error de acceso bloquea la carga y el chat nunca se renderiza.
- **Dado** que un usuario tiene acceso de lectura, **cuando** carga el modelo, **entonces** ve el toggle Model Chat habilitado en la secondary toolbar.
- **Dado** que un usuario es editor (write permission), **cuando** abre el chat, **entonces** puede enviar mensajes.
- **Dado** que la politica por-chat sobre read-only-escritura es **abierta**, **cuando** se define, **entonces** se refleja en esta HU o se abre HU hermana.
- **Dado** que un usuario pierde acceso al modelo, **cuando** la revocacion ocurre, **entonces** su sesion del chat cierra en la siguiente sincronizacion.

**Reglas y restricciones:**
- Identidad derivada del tenant (§7.3, EPICA-80).
- Integracion con EPICA-40 colaboracion-permisos.
- Politica exacta de "lector puede chatear": **inferida, no documentada explicitamente**. Default razonable: si (chat es conversacion, no edicion).
- Etiqueta: `requires-clarification`.

**Modelo de datos tocado:**
- Lectura de `usuario.permisos.modelo[modeloId]` — no persistente por chat.
- `mensaje.autorId` referencia un usuario con permiso vigente al momento del envio.

**Dependencias:**
- Bloqueada por: EPICA-40 (permisos de modelo), EPICA-80 (identidad de usuario).
- Bloquea a: HU-41.001 (visibilidad del toggle), HU-41.004 (habilitacion del input), HU-41.017 (rol admin).

**Integraciones:**
- Subsistema de permisos (EPICA-40).
- Sistema de identidad (EPICA-80).

**Notas de evidencia:**
- Fuente: §7.3 sistema de permisos.
- Clase de afirmacion: inferido (no observado directamente; derivado del principio de integracion con permisos) + abierto (regla chat-para-read-only).
- Etiqueta: `requires-clarification`.

**Prioridad:** W.
**Tamano:** M.
**Etiquetas:** [chat, permisos, seguridad, integracion-epica40, requires-clarification].

---

### HU-41.017 — Permitir borrado de mensajes solo a rol admin de la organizacion

**Actor primario:** AO (admin de organizacion).
**Actores secundarios:** CO (observa el borrado como ausencia del mensaje).
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/41-colaboracion-chat.md §4.2, §6, §11.
**Nivel categorico:** P primario; U (UI admin no observada) secundario.
**Superficie UI:** **abierta** — UI de admin para borrar mensajes no aparece en los frames.
**Gesto canonico:** **abierto** (depende de UI admin no documentada).

**Historia:**
> Como admin de organizacion, quiero poder borrar mensajes del chat cuando contienen informacion sensible o inapropiada para mantener la conversacion limpia, aunque el usuario normal nunca tenga esa capacidad.

**Contexto de negocio:**
La transcripcion confirma que los usuarios normales no pueden borrar sus mensajes, pero un admin si puede verlos y borrarlos cuando es necesario. La UI concreta (menu contextual, panel admin dedicado) no aparece en los frames observados — es una pregunta abierta documentada en §11 pregunta 1.

**Criterios de aceptacion:**
- **Dado** que un usuario normal mira un mensaje, **cuando** busca controles de borrado, **entonces** NO hay afordance visible (ni menu, ni boton, ni shortcut).
- **Dado** que un admin de organizacion accede al chat de un modelo, **cuando** usa la UI de moderacion (por definir), **entonces** puede borrar mensajes individuales.
- **Dado** que un admin borra un mensaje, **cuando** el borrado se propaga, **entonces** el mensaje desaparece de la lista para todos los colaboradores en su proxima sincronizacion.
- **Dado** que el borrado ocurre, **cuando** queda registro (inferido): **abierto** si hay historial auditable o si el mensaje desaparece sin rastro.
- **Dado** que un admin borra el ultimo mensaje, **cuando** el chat queda vacio, **entonces** se restaura el placeholder (HU-41.003).

**Reglas y restricciones:**
- Rol que puede borrar: **admin de organizacion** (confirmado por transcripcion).
- UI de admin: **abierta** — no observada, §11 pregunta 1.
- Auditoria/rastro: **abierta** — no documentada.
- `mensaje.rolAutor` (§6 inferido) determina potencialmente privilegios de moderacion.

**Modelo de datos tocado:**
- `mensaje.borradoEn` / `mensaje.borradoPor` — **inferido**, no explicito.
- Operacion de borrado sobre `mensaje.id`.

**Dependencias:**
- Bloqueada por: HU-41.016 (base de permisos), EPICA-80 (rol admin).
- Relaciona: EPICA-40 colaboracion-permisos.

**Integraciones:**
- Subsistema de permisos y roles.
- UI admin (por definir).

**Notas de evidencia:**
- Fuente: §4.2, §6 modelo (`rolAutor`), §11 pregunta 1.
- Transcripcion: "the message itself is not something that you can delete by your own, an admin can see and delete messages if needed".
- Clase de afirmacion: confirmado por transcripcion (regla de permiso) + abierto (UI admin concreta).
- Etiqueta: `requires-clarification`.

**Prioridad:** W.
**Tamano:** M.
**Etiquetas:** [chat, permisos, admin, moderacion, borrado, requires-clarification].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q41.1**: UI de admin para ver y borrar mensajes — no aparece en los frames (cf. HU-41.017). Marcada `requires-clarification`.
- **Q41.2**: Formato exacto de las URLs canonicas de modelos OPCloud (cf. HU-41.009). Marcada `requires-clarification`.
- **Q41.3**: Soporte para menciones `@usuario` o formato enriquecido (negritas, emojis) — no observado. **HU candidata futura**: HU-41.018 (deferida hasta confirmar). Nota: el brief original pedia cubrir `@usuario`; la evidencia de la fuente **no lo documenta**, por lo que se recoge como pregunta abierta en vez de fabricar una HU sin evidencia.
- **Q41.4**: Preferencia global "mostrar chat siempre" anunciada como futura (cf. HU-41.013); no implementada en esta version.
- **Q41.5**: Identidad del hilo ante rename o mover modelo entre carpetas — hipotesis: atado a `modeloId` no al path (cf. HU-41.009).
- **Q41.6**: Ordering determinista en conflicto de mensajes simultaneos — inferido por timestamp servidor (cf. HU-41.006).
- **Q41.7**: Formato de timestamp para mensajes mas antiguos que minutos (cf. HU-41.007) — no observado en los 19 frames.
- **Q41.8**: Politica exacta de escritura de chat para usuarios read-only (cf. HU-41.016) — no documentada.
- **Q41.9**: Export del chat como archivo o impresion — **no observado** en el doc fuente. No se emite HU por ausencia total de evidencia; queda registrada como pregunta para futura version de OPCloud o decision propia del modelador `opm-model-app`.
- **Q41.10**: Integracion con notes (EPICA-42) — `mensaje.cuerpo` y `nota.cuerpo` podrian compartir motor de render; relacion no explicita en la fuente.

## Referencias cruzadas

- Doc fuente: `opcloud-reverse/41-colaboracion-chat.md`.
- Epicas relacionadas:
  - **EPICA-40 colaboracion-permisos** — provee el modelo de permisos que condiciona el acceso al chat (HU-41.016, HU-41.017).
  - **EPICA-42 colaboracion-notes** — funcionalidad hermana para anotaciones ligadas a elementos del modelo; complementa al chat (conversacion libre) con notas ancladas.
  - **EPICA-80 config-user-org** — identidad del usuario, rol admin, organizacion.
  - **EPICA-30 persistencia-save-load** — `modeloId` canonico requerido para links internos (HU-41.009).
  - **EPICA-20 estructura-opd-tree** — comparte left pane con OPD Navigator (HU-41.002).
  - **EPICA-C0 runtime-mqtt / EPICA-C2 runtime-ros** — comparten secondary toolbar (HU-41.001).
- Invariantes del repo aplicables (si/cuando se implemente):
  - Ninguna HU toca el kernel OPM (`src/nucleo/`) — el chat es superficie colaborativa externa al modelo OPM.
  - Render del chat viviria fuera del pipeline JointJS — candidato a `src/ui/chat/` (si se activa en un ciclo futuro).
  - Persistencia viviria fuera de `src/persistencia/` (IndexedDB) porque requiere sync multi-usuario — probablemente backend dedicado, fuera del scope del modelador core del repo.
- Clasificacion estrategica: toda la epica es **W (won't-have en el ciclo actual)** del modelador core. Se documenta para completitud del mapa OPCloud y como semilla de un modulo colaborativo futuro.
