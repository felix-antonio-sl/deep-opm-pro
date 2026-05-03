---
epica: "EPICA-C0"
titulo: "Runtime — integracion MQTT (intermediario, topicos, Publish/Subscribe, gemelo digital, live data en simulacion)"
doc_fuente: "opcloud-reverse/c0-runtime-mqtt.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "W"
hu_emitidas: 22
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
---

## Resumen

Esta epica cubre la integracion del modelador OPM con un intermediario **MQTT** externo, habilitando que un modelo sincronizado con simulacion computacional (ver EPICA-B1) reciba (`Subscribe`) o envie (`Publish`) valores reales hacia/desde dispositivos IoT (Arduino, ESP, sensores fisicos, actuadores). La arquitectura semantica se apoya en una **triada** observada en OPCloud: objeto ambiental (realidad fisica externa, borde verde dashed) ↔ gemelo digital sistemico con sufijo `_digitaltwin` y slot `value` (borde verde continuo) ↔ proceso callable `` con categoria `MQTT` como puente al intermediario. La conexion no se configura por modelo sino en **settings globales de organizacion** (`OPCloud Settings / External Connections Settings`, defaults `localhost:9883`) y se abre/cierra con un boton toggle `MQTT` en la toolbar secundaria; un toast flotante comunica estado.

Alcance esencial: configurar intermediario, declarar gemelo digital, crear proceso callable MQTT con binding (modo/topico/mensaje), abrir websocket, consumir live data en simulacion Sync, cerrar conexion. El alcance no-observado (reconexion automatica, coercion de payload, multiples bindings) se refleja como preguntas abiertas. El intermediario y el websocket mediador son piezas externas que corren fuera de OPCloud; OPCloud entrega un server de referencia descargable pero no lo ejecuta.

**Prioridad agregada W (won't-have en ciclo actual):** MQTT es diferido del MVP del modelador core; depende de runtime externo y requiere simulacion computacional (EPICA-B1) madura antes de tener sentido. Las HU estan inventariadas para cierre de cobertura 1:1 del corpus reverse, no para activacion inmediata.

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-C0.001 | Configurar server y port MQTT en External Connections Settings | AO | W | S | opcloud-ui | — |
| HU-C0.002 | Aplicar defaults MQTT localhost:9883 al abrir settings por primera vez | AO | W | XS | opcloud-ui | — |
| HU-C0.003 | Ver boton MQTT en toolbar secundaria con tooltip de estado | IR | W | XS | opcloud-ui | — |
| HU-C0.004 | Abrir conexion MQTT haciendo clic en boton toggle | IR | W | S | opcloud-ui | — |
| HU-C0.005 | Ver toast MQTT Websocket connection established tras conectar | IR | W | S | opcloud-ui | — |
| HU-C0.006 | Ver cambio de color del boton MQTT cuando esta conectado | IR | W | XS | opcloud-ui | — |
| HU-C0.007 | Cerrar conexion MQTT haciendo clic de nuevo en boton | IR | W | S | opcloud-ui | — |
| HU-C0.008 | Ver toast MQTT Websocket disconnected al cerrar conexion | IR | W | XS | opcloud-ui | — |
| HU-C0.009 | Declarar gemelo digital con sufijo _digitaltwin en nombre | IR | W | S | mixto | [§MQ-1] |
| HU-C0.010 | Ver oracion OPL is the Digital Twin of X para gemelo digital | IR | W | S | mixto | [§MQ-1] |
| HU-C0.011 | Seleccionar categoria MQTT en menu de proceso computacional | IR | W | S | opcloud-ui | — |
| HU-C0.012 | Ver firma de dos parentesis redondos en proceso MQTT | IR | W | XS | opcloud-ui | — |
| HU-C0.013 | Abrir popup de binding MQTT sobre proceso callable | IR | W | S | opcloud-ui | — |
| HU-C0.014 | Elegir modo Publish o Subscribe en popup de binding | IR | W | S | opcloud-ui | — |
| HU-C0.015 | Configurar topico MQTT en popup de binding | IR | W | S | opcloud-ui | — |
| HU-C0.016 | Configurar mensaje con alias de objeto en popup de binding | IR | W | S | opcloud-ui | — |
| HU-C0.017 | Confirmar binding MQTT con boton Update | IR | W | XS | opcloud-ui | — |
| HU-C0.018 | Ver slot value mutar a numeral al recibir payload Subscribe | IR | W | M | opcloud-ui | — |
| HU-C0.019 | Ver slot value mutar a literal published tras enviar Publish | IR | W | M | opcloud-ui | — |
| HU-C0.020 | Ejecutar simulacion MQTT en modo Sync obligatorio | IR | W | S | opcloud-ui | — |
| HU-C0.021 | Descargar websocket server de referencia desde Manuals pane | IR | W | XS | opcloud-ui | — |
| HU-C0.022 | Persistir binding MQTT al guardar el modelo | IR | W | M | opcloud-ui | [§11 #6] |

Total: **22 historias de usuario** (20 opcloud-ui, 2 mixto).

## Historias de usuario

### HU-C0.001 — Configurar server y port MQTT en External Connections Settings

**Actor primario:** AO (admin de organizacion).
**Actores secundarios:** IR (ingeniero runtime — consume la config).
**Tipo:** opcloud-ui.
**Nivel categorico:** C (config) primario; X (integracion externa) secundario.
**Superficie UI:** settings-globales / panel `OPCloud Settings / External Connections Settings`.
**Gesto canonico:** editar inputs `Server` y `Port` del bloque `MQTT` + guardar.

**Historia:**
> Como admin de organizacion, quiero configurar el servidor y puerto del intermediario MQTT en un panel de settings globales para que cualquier modelo de mi organizacion pueda conectarse al intermediario sin que cada modelador lo configure por modelo.

**Contexto de negocio:**
La conexion a un intermediario MQTT es **infraestructura de organizacion**, no decoracion de modelo. Exponer host/port en un panel dedicado `External Connections Settings` separa el modelado semantico (kernel OPM) de la configuracion de runtime y evita que cada modelo lleve credenciales duplicadas. La decision arquitectonica observada refleja el principio de separacion kernel/ambiente del repo.

**Criterios de aceptacion:**
- **Dado** que soy AO y abro `OPCloud Settings`, **cuando** navego a la seccion `External Connections Settings`, **entonces** veo un bloque titulado `MQTT` con campos editables `Server` (texto) y `Port` (integer).
- **Dado** que estoy en el bloque MQTT, **cuando** cambio `Server` de `localhost` a `broker.example.com` y `Port` de `9883` a `8083` y confirmo, **entonces** los valores se persisten como config global y el proximo clic de conexion los usa.
- **Dado** que hay un bloque `ROS` hermano en la misma seccion, **cuando** modifico MQTT, **entonces** ROS no se ve afectado (bloques independientes).
- **Dado** que hay modelos abiertos con un websocket MQTT activo, **cuando** cambio los valores, **entonces** pregunta abierta: ¿la conexion se refresca automaticamente o exige desconectar+conectar manual? (ver §4 doc fuente, inferido).

**Reglas y restricciones:**
- Campos obligatorios: `Server` (string no vacio), `Port` (integer 1-65535).
- Validacion: `Port` debe ser numerico; si no, el form bloquea con error inline.
- Los valores se almacenan en `GlobalSettings.externalConnections.mqtt` (ver modelo de datos §6 doc fuente).
- Permisos: solo AO modifica; IR solo lee.

**Modelo de datos tocado:**
- `GlobalSettings.externalConnections.mqtt.server` — string — persistente.
- `GlobalSettings.externalConnections.mqtt.port` — number — persistente.

**Dependencias:**
- Bloquea a: HU-C0.004 (conexion requiere host/port configurados).
- Relaciona: EPICA-80 (config-user-org), EPICA-82 (config-organization-ontology).

**Integraciones:**
- Panel settings global.
- Servicio de runtime MQTT (lee config al conectar).

**Notas de evidencia:**
- Fuente: `opcloud-reverse/c0-runtime-mqtt.md` §2 "Settings globales", §5 controles, §6 modelo de datos.
- Frames: frame_00015.
- Transcripcion: "the default are localhost and a specific port of course you can change it according to your preferences".
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [config, mqtt, settings, external-connections, admin-organizacion].

---

### HU-C0.002 — Aplicar defaults MQTT localhost:9883 al abrir settings por primera vez

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** C.
**Superficie UI:** settings-globales / External Connections Settings.
**Gesto canonico:** ninguno (render declarativo de defaults).

**Historia:**
> Como admin, quiero que el bloque MQTT ya tenga valores por defecto `localhost:9883` cuando lo abro por primera vez para poder probar la integracion con un intermediario local sin tener que averiguar los valores tipicos.

**Contexto de negocio:**
Los defaults sensatos reducen friccion de onboarding. `localhost:9883` es el patron convencional para el websocket MQTT de pruebas y alinea con el websocket server de referencia que OPCloud distribuye (HU-C0.021). Sin defaults, el ingeniero runtime debe consultar documentacion externa antes de intentar cualquier conexion.

**Criterios de aceptacion:**
- **Dado** que abro settings por primera vez en una instalacion nueva, **cuando** miro el bloque MQTT, **entonces** `Server` muestra `localhost` y `Port` muestra `9883` como valores precargados.
- **Dado** que edito los defaults, **cuando** los guardo y cierro, **entonces** los valores modificados persisten y al reabrir se muestran los editados, no los defaults.
- **Dado** que nunca abri settings, **cuando** el sistema intenta conectar al intermediario, **entonces** usa los defaults implicitos (no requiere que el usuario haya "abierto" settings al menos una vez).

**Reglas y restricciones:**
- Defaults observados: `server = "localhost"`, `port = 9883`.
- Los defaults son **valores iniciales**, no constantes — el usuario puede reemplazarlos.

**Modelo de datos tocado:**
- Mismos campos que HU-C0.001 con valores iniciales.

**Dependencias:**
- Bloqueada por: HU-C0.001 (definir panel).

**Notas de evidencia:**
- Fuente: §2 inventario UI, §5 tabla de controles.
- Frames: frame_00015.
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** W.
**Tamano:** XS.
**Etiquetas:** [config, mqtt, settings, defaults].

---

### HU-C0.003 — Ver boton MQTT en toolbar secundaria con tooltip de estado

**Actor primario:** IR (ingeniero runtime).
**Tipo:** opcloud-ui.
**Nivel categorico:** U (UI/interaccion).
**Superficie UI:** toolbar-secundaria-canvas (boton `MQTT`).
**Gesto canonico:** hover sobre boton.

**Historia:**
> Como ingeniero runtime, quiero ver un boton MQTT con icono de nube en la toolbar secundaria del canvas y un tooltip que me muestre server y port configurados para validar de un vistazo contra que intermediario estoy a punto de conectarme.

**Contexto de negocio:**
El tooltip de estado permite al IR verificar la configuracion **antes de hacer clic** en el toggle. Esto evita el anti-patron de conectarse por accidente al intermediario equivocado. El icono de nube con texto vertical `MQTT` es la marca visual del feature en la toolbar; convive con un boton hermano `ROS` (EPICA-C2).

**Criterios de aceptacion:**
- **Dado** que estoy en el canvas de un modelo abierto, **cuando** miro la toolbar secundaria superior, **entonces** veo un boton con icono de nube y texto vertical `MQTT` entre los botones `Analyze` y `ROS`.
- **Dado** que el boton MQTT esta visible, **cuando** hago hover sin hacer clic, **entonces** aparece un tooltip en bloque gris oscuro con tres lineas: `MQTT Connection` / `Server: <valor>` / `Port: <valor>`.
- **Dado** que no hay config MQTT guardada, **cuando** hago hover, **entonces** el tooltip muestra los defaults `localhost:9883`.
- **Dado** que cambie los valores en settings globales, **cuando** hago hover de nuevo, **entonces** el tooltip refleja los nuevos valores sin requerir refresh.

**Reglas y restricciones:**
- Ubicacion fija: toolbar secundaria, entre `Analyze` y `ROS`.
- El tooltip se despliega en hover, no en focus keyboard (comportamiento observado).
- El tooltip NO expone credenciales ni tokens (en MVP observado no hay auth; ver HU-C0.022 + preguntas abiertas).

**Modelo de datos tocado:**
- Solo lectura de `GlobalSettings.externalConnections.mqtt`.

**Dependencias:**
- Bloqueada por: HU-C0.001 (necesita config leible).

**Integraciones:**
- Toolbar secundaria (EPICA-UI generica).
- Renderizado de tooltip.

**Notas de evidencia:**
- Fuente: §2 "Toolbar secundaria del canvas", §2 "Tooltip de estado".
- Frames: frame_00013.
- Clase de afirmacion: observado.

**Prioridad:** W.
**Tamano:** XS.
**Etiquetas:** [ui, mqtt, toolbar-secundaria, tooltip, cloud-icon].

---

### HU-C0.004 — Abrir conexion MQTT haciendo clic en boton toggle

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** X (integracion externa) primario; U secundario.
**Superficie UI:** boton MQTT de toolbar secundaria.
**Gesto canonico:** clic unico.

**Historia:**
> Como ingeniero runtime, quiero iniciar el websocket hacia el intermediario MQTT con un solo clic en el boton de la toolbar para acoplar el modelo al mundo real con el menor ceremonial posible.

**Contexto de negocio:**
Un unico gesto (clic) para abrir runtime externo es coherente con el principio de afordancia minima del canvas. El clic no es destructivo: inicia un handshake websocket contra el intermediario configurado. El exito se comunica por toast (HU-C0.005) y cambio de color del boton (HU-C0.006). Esta HU cubre **solo la apertura** — el cierre es HU-C0.007.

**Criterios de aceptacion:**
- **Dado** que el boton MQTT esta en estado desconectado y hay config valida, **cuando** hago clic, **entonces** el sistema inicia un websocket con `ws://<server>:<port>` (o `wss://` si TLS — ver preguntas abiertas).
- **Dado** que el handshake tiene exito, **cuando** se completa, **entonces** aparece el toast `MQTT Websocket connection established` (HU-C0.005) y el boton cambia color a estado-conectado (HU-C0.006).
- **Dado** que el handshake falla (intermediario inaccesible), **cuando** expira timeout, **entonces** pregunta abierta: ¿toast de error? ¿boton vuelve a estado desconectado? (no observado en frames, inferido).
- **Dado** que el boton ya esta conectado, **cuando** hago clic, **entonces** NO abre segunda conexion — trata el clic como cierre (ver HU-C0.007).

**Reglas y restricciones:**
- Comportamiento toggle: clic alterna entre desconectado ↔ conectado.
- No hay reconexion automatica tras caida del intermediario mid-sesion (preguntas abiertas §11 doc fuente).
- La conexion es **por sesion de canvas abierto**; al recargar pierde el estado (inferido).
- Requiere websocket mediador corriendo externamente (HU-C0.021 — descarga del websocket server de referencia).

**Modelo de datos tocado:**
- `RuntimeState.mqttWebsocket` — `"connected" | "disconnected"` — transitorio.

**Dependencias:**
- Bloqueada por: HU-C0.001 (config), HU-C0.003 (boton visible).
- Bloquea a: HU-C0.005, HU-C0.006, HU-C0.018, HU-C0.019, HU-C0.020 (requieren conexion activa).

**Integraciones:**
- Runtime websocket (cliente MQTT-over-websocket).
- Toast system (HU-C0.005).
- Render de boton (HU-C0.006).

**Notas de evidencia:**
- Fuente: §3.4 "Abrir la conexion MQTT".
- Transcripcion: "the color of the button is currently changed to show that it is connected and working okay".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [mqtt, runtime, websocket, toggle, integracion-externa].

---

### HU-C0.005 — Ver toast MQTT Websocket connection established tras conectar

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** U (UI feedback).
**Superficie UI:** toast-runtime (esquina superior derecha del canvas).
**Gesto canonico:** ninguno (feedback automatico).

**Historia:**
> Como ingeniero runtime, quiero ver un toast que confirme el establecimiento del websocket MQTT para tener certeza explicita de que el handshake fue exitoso antes de correr simulacion.

**Contexto de negocio:**
El feedback explicito es critico en integracion con runtime externo porque el estado no es observable directamente sin el. El cambio de color del boton (HU-C0.006) es complementario pero mas sutil; el toast garantiza que el usuario no ejecute simulacion sin saber que la conexion esta abierta. Toast en esquina superior derecha, fondo azul oscuro, texto blanco, con ✕ para descarte manual.

**Criterios de aceptacion:**
- **Dado** que hice clic en boton MQTT y el handshake exitoso, **cuando** el websocket se establece, **entonces** aparece un toast en esquina superior derecha del canvas con texto `MQTT Websocket connection established`.
- **Dado** que el toast aparecio, **cuando** hago clic en la ✕, **entonces** el toast se cierra manualmente.
- **Dado** que el toast aparecio, **cuando** esperan N segundos sin interactuar, **entonces** pregunta abierta: ¿auto-dismiss? (no observado explicito, inferido).
- **Dado** que ya hay una conexion activa y hago clic de nuevo en MQTT (reconexion rapida), **cuando** el handshake se repite, **entonces** pregunta abierta: ¿el toast aparece de nuevo o es idempotente? (§11 doc fuente #7).

**Reglas y restricciones:**
- Estilo: fondo azul oscuro, texto blanco, ✕ a la derecha.
- Posicion: esquina superior derecha del canvas (consistente con HU-C0.008 de desconexion).
- Formato literal: `MQTT Websocket connection established`.

**Modelo de datos tocado:**
- Ninguno directo (feedback UI transitorio).

**Dependencias:**
- Bloqueada por: HU-C0.004.

**Integraciones:**
- Sistema de toasts (compartido con otros feedbacks de runtime).

**Notas de evidencia:**
- Fuente: §2 "Toast de estado".
- Transcripcion: "you will see that mqtt websocket connection established".
- Clase de afirmacion: confirmado por transcripcion (no capturado en frames muestreados pero enunciado explicito).
- Preguntas abiertas: §11 #7 reconexion rapida.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [mqtt, ui, toast, feedback-runtime].

---

### HU-C0.006 — Ver cambio de color del boton MQTT cuando esta conectado

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** V (render) primario; U secundario.
**Superficie UI:** boton MQTT de toolbar secundaria.
**Gesto canonico:** ninguno.

**Historia:**
> Como ingeniero runtime, quiero que el boton MQTT cambie de color cuando el websocket esta abierto para tener un indicador persistente del estado, independiente del toast efimero.

**Contexto de negocio:**
El toast es transitorio; el cambio de color del boton es el **indicador persistente**. Mientras el websocket este activo, cualquier lectura del canvas debe poder verificar conexion de un vistazo sin esperar el siguiente toast. Principio de observabilidad permanente en runtime.

**Criterios de aceptacion:**
- **Dado** que el websocket esta abierto, **cuando** miro el boton MQTT, **entonces** tiene un color distinto al estado desconectado (color exacto sujeto a SSOT visual — ver preguntas abiertas).
- **Dado** que el websocket se cierra, **cuando** miro el boton, **entonces** vuelve al color original de estado desconectado.
- **Dado** que el boton cambio de color, **cuando** hago hover, **entonces** el tooltip sigue mostrando server/port (consistente con HU-C0.003), sin agregar estado "connected" explicito en el tooltip (no observado).

**Reglas y restricciones:**
- La convencion de color exacta no esta confirmada por frames directos; solo por transcripcion ("the color of the button is currently changed").
- Comportamiento binario: 2 estados de color (conectado/desconectado).

**Modelo de datos tocado:**
- Solo lectura de `RuntimeState.mqttWebsocket`.

**Dependencias:**
- Bloqueada por: HU-C0.004.

**Integraciones:**
- Render del boton en toolbar secundaria.

**Notas de evidencia:**
- Fuente: §3.4 paso 4.
- Transcripcion: "the color of the button is currently changed to show that it is connected and working okay".
- Clase de afirmacion: confirmado por transcripcion (color exacto abierto).
- Etiqueta: `requires-clarification` (color especifico).

**Prioridad:** W.
**Tamano:** XS.
**Etiquetas:** [mqtt, ui, toolbar-secundaria, estado-visual, requires-clarification].

---

### HU-C0.007 — Cerrar conexion MQTT haciendo clic de nuevo en boton

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** X primario; U secundario.
**Superficie UI:** boton MQTT.
**Gesto canonico:** clic unico (segunda vez).

**Historia:**
> Como ingeniero runtime, quiero cerrar el websocket MQTT haciendo clic en el mismo boton que use para abrirlo para simetrizar el gesto de apertura/cierre sin separar UI.

**Contexto de negocio:**
El boton MQTT es un toggle binario. Simetria de gesto reduce carga cognitiva: el mismo gesto abre y cierra. El cierre es critico al terminar una sesion de modelado: libera recursos del intermediario y evita que el IDE quede con un websocket huerfano consumiendo ancho de banda.

**Criterios de aceptacion:**
- **Dado** que el websocket esta abierto, **cuando** hago clic en el boton MQTT, **entonces** se cierra el websocket contra el intermediario.
- **Dado** que el cierre tiene exito, **cuando** termina, **entonces** aparece el toast `MQTT Websocket disconnected` (HU-C0.008) y el boton vuelve a color desconectado.
- **Dado** que hay una simulacion corriendo que consume live data, **cuando** cierro el websocket, **entonces** pregunta abierta: ¿la simulacion se pausa/detiene automaticamente o queda en estado inconsistente? (no observado, inferido).
- **Dado** que el websocket ya estaba cerrado, **cuando** intento clic, **entonces** el clic se interpreta como apertura (HU-C0.004).

**Reglas y restricciones:**
- Cierre gracioso: envia `DISCONNECT` al intermediario antes de cerrar el socket.
- Los slots `value` de objetos computacionales conservan el ultimo valor observado (§3.6 doc fuente: "los slots conservan el ultimo valor observado").

**Modelo de datos tocado:**
- `RuntimeState.mqttWebsocket` — `"connected" | "disconnected"` — transitorio.

**Dependencias:**
- Bloqueada por: HU-C0.004.
- Bloquea a: HU-C0.008.

**Integraciones:**
- Runtime websocket client.
- Toast system.

**Notas de evidencia:**
- Fuente: §3.6 "Cerrar la conexion".
- Frames: frame_00034.
- Clase de afirmacion: observado.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [mqtt, runtime, websocket, toggle, cierre].

---

### HU-C0.008 — Ver toast MQTT Websocket disconnected al cerrar conexion

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** toast-runtime.
**Gesto canonico:** ninguno.

**Historia:**
> Como ingeniero runtime, quiero ver un toast de confirmacion cuando el websocket se cierra para tener certeza explicita de la desconexion y evitar creer que sigo conectado por error.

**Contexto de negocio:**
El toast de desconexion es la contraparte del toast de conexion (HU-C0.005) y cierra el ciclo de feedback de runtime. Critico cuando la desconexion no es intencional (caida del intermediario, timeout, red perdida) — no observado directo si se dispara en caida no-solicitada, pero el feedback visual es consistente.

**Criterios de aceptacion:**
- **Dado** que cerre la conexion con clic, **cuando** el cierre se completa, **entonces** aparece el toast `MQTT Websocket disconnected` en esquina superior derecha con ✕.
- **Dado** que el toast esta visible, **cuando** hago clic en ✕, **entonces** se cierra manualmente.
- **Dado** que la desconexion ocurrio por caida del intermediario (no por clic), **cuando** el websocket detecta la perdida, **entonces** pregunta abierta: ¿el toast aparece igual? Inferido: si (coherencia de feedback).

**Reglas y restricciones:**
- Formato literal: `MQTT Websocket disconnected`.
- Estilo y posicion identicos al toast de conexion (HU-C0.005).

**Modelo de datos tocado:**
- Ninguno directo.

**Dependencias:**
- Bloqueada por: HU-C0.007.

**Integraciones:**
- Toast system.

**Notas de evidencia:**
- Fuente: §2 "Toast de estado", §3.6.
- Frames: frame_00034.
- Clase de afirmacion: observado.

**Prioridad:** W.
**Tamano:** XS.
**Etiquetas:** [mqtt, ui, toast, feedback-runtime, desconexion].

---

### HU-C0.009 — Declarar gemelo digital con sufijo _digitaltwin en nombre

**Actor primario:** IR.
**Actores secundarios:** AD (autor de dominio — modela el par realidad/espejo).
**Tipo:** mixto.
**Nivel categorico:** K (kernel — convencion de naming con efecto semantico) primario; V secundario.
**Superficie UI:** editor de nombre del objeto (popup Auto Format de EPICA-10 + convencion).
**Gesto canonico:** escribir nombre con sufijo literal `_digitaltwin`.

**Historia:**
> Como ingeniero runtime, quiero declarar un objeto sistemico como gemelo digital de un objeto ambiental agregando el sufijo literal `_digitaltwin` al nombre para senalizar la relacion "realidad fisica ↔ espejo computacional" sin primitiva grafica nueva.

**Contexto de negocio:**
OPCloud no introduce un primitivo visual nuevo para gemelo digital: **reutiliza** el sufijo textual `_digitaltwin` como marca semantica. Esta decision minimiza la expansion del kernel visual pero impone carga lexica: el lector del modelo debe conocer la convencion o leer el OPL (HU-C0.010). Para el ingeniero runtime, es el mecanismo de declaracion del nexo entre un objeto ambiental (sensor fisico) y su espejo local computacional (el objeto donde el slot `value` se actualiza en cada tick).

**Criterios de aceptacion:**
- **Dado** que tengo un objeto ambiental en el canvas (p.ej. `Room Surroundings Light Intensity` con borde verde dashed), **cuando** creo un segundo objeto sistemico con borde verde continuo y le asigno nombre `Room Surroundings Light Intensity_digitaltwin`, **entonces** el sistema reconoce el sufijo como marca semantica de gemelo digital.
- **Dado** que el gemelo digital tiene nombre con sufijo, **cuando** lo convierto en objeto computacional (EPICA-B1) agregando unidad `[lx]` y alias `{rli}`, **entonces** el nombre se renderiza apilado en tres lineas + slot `value`.
- **Dado** que enlazo el gemelo digital con el ambiental mediante la relacion "Digital Twin" (declarable en popup o menu), **cuando** el enlace se crea, **entonces** se registra en el modelo como `Object.digitalTwinOf: <ObjectId>`.
- **Dado** que el sufijo `_digitaltwin` es convencion textual (no primitiva visual), **cuando** un lector mira el canvas, **entonces** la unica pista de la relacion es el sufijo + el OPL (HU-C0.010) — ver brecha `adv-08 §MQ-1` del doc fuente.

**Reglas y restricciones:**
- Sufijo literal: `_digitaltwin` (minusculas, underscore al inicio). Sin variante ni internacionalizacion observada.
- No impuesto por UI: el sistema observado acepta cualquier nombre; la convencion es **emergente** (ver §9 doc fuente "Convenciones no-normativas").
- La relacion "Digital Twin" se **refleja en OPL** pero no tiene render visual propio (brecha severidad A en doc fuente).
- El gemelo digital tipicamente es sistemico (borde continuo) y el original es ambiental (dashed).

**Modelo de datos tocado:**
- `thing.name` — string con sufijo `_digitaltwin` — persistente.
- `Object.digitalTwinOf` — `ObjectId | null` — persistente (opcional).

**Dependencias:**
- Bloqueada por: EPICA-10 (crear object + nombrar), EPICA-B1 (objeto computacional con slot `value`).
- Bloquea a: HU-C0.010, HU-C0.018, HU-C0.019.

**Integraciones:**
- OPL renderer (emite `is the Digital Twin of`).
- Render del objeto (sin decoracion nueva, solo sufijo textual).

**Notas de evidencia:**
- Fuente: §3.1 "Declarar un gemelo digital", §9 convenciones.
- Frames: frame_00001, frame_00022.
- Transcripcion: implicito en "X_digitaltwin, rli, is the Digital Twin of X".
- Clase de afirmacion: observado.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [modelado, mqtt, digital-twin, naming, convencion-textual].

---

### HU-C0.010 — Ver oracion OPL is the Digital Twin of X para gemelo digital

**Actor primario:** IR.
**Tipo:** mixto.
**Nivel categorico:** L (OPL lens).
**Superficie UI:** opl-pane.
**Gesto canonico:** ninguno.

**Historia:**
> Como ingeniero runtime, quiero ver en el OPL la oracion "X_digitaltwin is the Digital Twin of X" para que la relacion entre realidad y espejo sea explicita en la modalidad textual del modelo, dado que no hay primitiva visual que la codifique.

**Contexto de negocio:**
OPM es bimodal (diagrama + OPL). Cuando una relacion semantica no tiene traduccion visual, el OPL es el **unico canal** donde se registra explicitamente. Omitir la oracion `is the Digital Twin of` romperia la completitud del lenguaje. La oracion observada tiene estructura canonica: sujeto con alias entre comas, "is the Digital Twin of", objeto referenciado.

**Criterios de aceptacion:**
- **Dado** que declare un gemelo digital con HU-C0.009 y lo enlace al ambiental, **cuando** consulto el OPL pane, **entonces** aparece la oracion `<Gemelo>, <alias>, is the Digital Twin of <Ambiental>.` (ejemplo observado: `Room Surroundings Light Intensity_digitaltwin, rli, is the Digital Twin of Room Surroundings Light Intensity.`).
- **Dado** que el gemelo tiene alias `{rli}`, **cuando** aparece la oracion OPL, **entonces** el alias se intercala entre comas despues del nombre.
- **Dado** que elimino el enlace "Digital Twin", **cuando** miro el OPL, **entonces** la oracion desaparece.
- **Dado** que el gemelo digital tiene ademas relaciones de agregacion/instrument/etc., **cuando** miro el OPL, **entonces** la oracion "Digital Twin" coexiste con las otras sin orden fijo observado.

**Reglas y restricciones:**
- Formato literal: `<Gemelo>, <alias>, is the Digital Twin of <Ambiental>.` con punto final.
- Si el gemelo no tiene alias, la segunda coma se omite (inferido, no verificado).
- Capitalizacion: "Digital Twin" con mayusculas iniciales (convencion OPL observada).

**Modelo de datos tocado:**
- Solo lectura de `Object.digitalTwinOf` y nombres.

**Dependencias:**
- Bloqueada por: HU-C0.009.

**Integraciones:**
- Motor OPL (`src/render/opl-renderer.ts`) — debe extenderse con plantilla para Digital Twin.

**Notas de evidencia:**
- Fuente: §7 integraciones, §3.1 paso 4.
- Frames: frame_00022 (linea 5 del OPL listado).
- Clase de afirmacion: observado.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [opl, mqtt, digital-twin, lente, extension-opl].

---

### HU-C0.011 — Seleccionar categoria MQTT en menu de proceso computacional

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** K (cambia categoria del proceso) primario; U secundario.
**Superficie UI:** menu flotante bajo elipse (barra `Predefined | User Defined | External | ROS | MQTT`).
**Gesto canonico:** clic en pestana `MQTT`.

**Historia:**
> Como ingeniero runtime, quiero seleccionar la categoria `MQTT` en el menu de proceso computacional para activar el modo de binding contra intermediario en un proceso callable que ya existe.

**Contexto de negocio:**
La barra de categorias del proceso computacional (EPICA-B1) expone cinco opciones: `Predefined`, `User Defined`, `External`, `ROS`, `MQTT`. Al elegir MQTT, el proceso pasa a mostrar firma `` (dos parentesis redondos vacios) en vez del nombre plano, y habilita el popup de binding (HU-C0.013). La decision de agrupar MQTT como categoria de proceso, no como primitivo separado, refuerza el patron del funtor de runtime sobre el kernel.

**Criterios de aceptacion:**
- **Dado** que tengo un proceso computacional (convertido con EPICA-B1), **cuando** miro la barra de categorias, **entonces** veo cinco pestanas incluyendo `MQTT`.
- **Dado** que la categoria activa era `Predefined`, **cuando** hago clic en `MQTT`, **entonces** el proceso pasa a categoria MQTT y el nombre pasa a mostrarse con la firma `` al final (ver HU-C0.012).
- **Dado** que cambie a `MQTT`, **cuando** hago clic derecho sobre el proceso, **entonces** se habilita el popup de binding (HU-C0.013).
- **Dado** que cambio MQTT a cualquier otra categoria, **cuando** confirmo, **entonces** pregunta abierta: ¿se conserva el binding o se descarta? (§11 doc fuente #4).

**Reglas y restricciones:**
- Las categorias son **mutuamente excluyentes**: un proceso tiene exactamente una categoria activa.
- Cambiar de categoria puede descartar config especifica (confirmacion por popup — no observado).

**Modelo de datos tocado:**
- `Process.category` — `"Predefined" | "User Defined" | "External" | "ROS" | "MQTT"` — persistente.

**Dependencias:**
- Bloqueada por: EPICA-B1 (proceso computacional).
- Bloquea a: HU-C0.012, HU-C0.013.

**Integraciones:**
- Menu de categorias del proceso (compartido con EPICA-B1, B2, C1, C2).
- Render de nombre del proceso (agrega ``).

**Notas de evidencia:**
- Fuente: §2 "Menu de categoria del proceso computacional", §3.2.
- Frames: frame_00012.
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [modelado, mqtt, computacional, categoria, extension-b1].

---

### HU-C0.012 — Ver firma de dos parentesis redondos en proceso MQTT

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** V.
**Superficie UI:** canvas-render (elipse de proceso).
**Gesto canonico:** ninguno.

**Historia:**
> Como ingeniero runtime, quiero que el proceso callable con categoria MQTT muestre la firma `` al final del nombre para distinguir visualmente procesos MQTT de procesos planos sin abrir el popup de binding.

**Contexto de negocio:**
La firma `` es el **unico marcador visual** de que un proceso es callable externamente. Sin ella, MQTT y Predefined serian indistinguibles en el canvas, rompiendo el principio de observabilidad del modelo. La convencion se comparte con `User Defined`, `External`, `ROS` (heredada de EPICA-B1 §9).

**Criterios de aceptacion:**
- **Dado** que un proceso tiene categoria `MQTT`, **cuando** miro la elipse, **entonces** el nombre se renderiza con sufijo ` ` (ej. `LDR 1 Sensing `).
- **Dado** que cambio la categoria a `Predefined`, **cuando** confirmo, **entonces** la firma desaparece del nombre.
- **Dado** que el proceso MQTT esta en modo simulacion ejecutandose, **cuando** miro, **entonces** la firma persiste (no se oculta durante ejecucion — frames 12, 30, 32 lo confirman).

**Reglas y restricciones:**
- Render literal: dos parentesis redondos vacios, separados por espacio del nombre base.
- No se muestra diferenciacion visual entre `MQTT Publish` y `MQTT Subscribe` en el canvas — ver §11 doc fuente #8.

**Modelo de datos tocado:**
- Solo lectura de `Process.category`.

**Dependencias:**
- Bloqueada por: HU-C0.011.

**Integraciones:**
- Renderer JointJS.

**Notas de evidencia:**
- Fuente: §3.2 paso 3, §9 convenciones.
- Frames: frame_00012, frame_00030, frame_00032.
- Clase de afirmacion: observado.

**Prioridad:** W.
**Tamano:** XS.
**Etiquetas:** [render, mqtt, computacional, firma, parentesis].

---

### HU-C0.013 — Abrir popup de binding MQTT sobre proceso callable

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; K secundario (binding pertenece al modelo).
**Superficie UI:** popup-binding-mqtt (anclado al proceso).
**Gesto canonico:** clic derecho o doble-clic sobre elipse de proceso MQTT.

**Historia:**
> Como ingeniero runtime, quiero abrir un popup de binding MQTT al interactuar con el proceso callable para configurar modo, topico y mensaje sin salir del canvas.

**Contexto de negocio:**
El popup inline (anclado al proceso) mantiene al ingeniero en contexto espacial: la configuracion del binding es **del proceso especifico**, no global. Este patron (popup anclado) es consistente con el popup Auto Format de EPICA-10. El popup contiene cuatro elementos: dropdown de modo, input de topico, input de mensaje, boton Update.

**Criterios de aceptacion:**
- **Dado** que tengo un proceso con categoria MQTT, **cuando** hago clic derecho / abrir configuracion sobre la elipse, **entonces** aparece un panel flotante anclado al proceso con los campos `Modo`, `Topico`, `Mensaje`, `Update`.
- **Dado** que el popup esta abierto, **cuando** hago clic fuera sin confirmar, **entonces** pregunta abierta: ¿se cierra descartando o se cierra persistiendo? (no observado explicito).
- **Dado** que ya hay un binding previo, **cuando** abro el popup de nuevo, **entonces** los campos muestran los valores previos para edicion.
- **Dado** que el proceso NO tiene categoria MQTT, **cuando** intento abrir el popup, **entonces** no aparece el popup (o aparece el popup generico de EPICA-B1 — inferido).

**Reglas y restricciones:**
- El popup se ancla visualmente al proceso (no al canvas global).
- Un unico binding por proceso en el MVP observado (§11 doc fuente #9).

**Modelo de datos tocado:**
- Lectura/escritura de `Process.mqttBinding`.

**Dependencias:**
- Bloqueada por: HU-C0.011.
- Bloquea a: HU-C0.014, HU-C0.015, HU-C0.016, HU-C0.017.

**Integraciones:**
- Render del popup anclado.

**Notas de evidencia:**
- Fuente: §2 "Popup de binding MQTT sobre el proceso callable", §3.2 paso 4.
- Frames: frame_00023.
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [ui, mqtt, popup, binding, inline].

---

### HU-C0.014 — Elegir modo Publish o Subscribe en popup de binding

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** K.
**Superficie UI:** popup-binding-mqtt / dropdown `Modo`.
**Gesto canonico:** clic en dropdown + seleccion.

**Historia:**
> Como ingeniero runtime, quiero elegir entre `Publish` y `Subscribe` en el popup de binding para declarar si el proceso MQTT envia al intermediario o recibe de el.

**Contexto de negocio:**
`Publish` y `Subscribe` son las dos operaciones fundamentales del protocolo MQTT. Elegirlas en el popup separa la semantica de sentido de flujo (entrada vs salida del modelo). La convencion observada es que `Subscribe` se usa tipicamente con el gemelo digital como salida (recibe payload del sensor); `Publish` con el gemelo digital como entrada (envia comando al actuador).

**Criterios de aceptacion:**
- **Dado** que el popup de binding esta abierto, **cuando** hago clic en dropdown `Modo`, **entonces** veo dos opciones: `Publish` y `Subscribe`.
- **Dado** que elijo `Subscribe`, **cuando** cierro dropdown, **entonces** el proceso queda configurado como suscriptor — en simulacion lee del topico y escribe al objeto salida.
- **Dado** que elijo `Publish`, **cuando** cierro dropdown, **entonces** el proceso queda configurado como publicador — en simulacion toma el alias del objeto entrante y envia al topico.
- **Dado** que cambio de modo despues de configurado, **cuando** confirmo con Update, **entonces** el nuevo modo reemplaza al anterior.

**Reglas y restricciones:**
- Opciones observadas: solo `Publish` y `Subscribe`. No hay "Publish+Subscribe" ni "Request/Response".
- Default observado al abrir: `Publish` (frame_00023).

**Modelo de datos tocado:**
- `Process.mqttBinding.mode` — `"Publish" | "Subscribe"` — persistente.

**Dependencias:**
- Bloqueada por: HU-C0.013.

**Integraciones:**
- Runtime MQTT client (lee mode en cada tick).

**Notas de evidencia:**
- Fuente: §2 popup binding, §3.2 paso 4.
- Frames: frame_00023.
- Transcripcion: "we have both publish or subscribe".
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [mqtt, binding, dropdown, modo, pub-sub].

---

### HU-C0.015 — Configurar topico MQTT en popup de binding

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** K.
**Superficie UI:** popup-binding-mqtt / input `Topico`.
**Gesto canonico:** escritura en input de texto.

**Historia:**
> Como ingeniero runtime, quiero escribir el topico MQTT (ej. `espClient/ldr1`) en el popup de binding para apuntar el proceso callable al canal del intermediario especifico de este sensor/actuador.

**Contexto de negocio:**
El topico es la **coordenada de direccionamiento** en MQTT. Usa notacion slash-separated (`espClient/ldr1`, `espClient/led`, `sensores/room1/temperatura`). Es texto libre: el cliente no impone estructura, pero convencion usa jerarquia semantica para permitir wildcards del lado del intermediario.

**Criterios de aceptacion:**
- **Dado** que el popup esta abierto, **cuando** escribo en el input `Topico`, **entonces** el texto se captura sin normalizacion.
- **Dado** que ingrese un topico con slashes, **cuando** confirmo con Update, **entonces** se persiste literal (`espClient/ldr1`, no escapado ni transformado).
- **Dado** que dejo el topico vacio, **cuando** intento confirmar, **entonces** pregunta abierta: ¿bloquea con validacion o acepta vacio? (no observado explicito).
- **Dado** que el topico contiene wildcards MQTT (`+`, `#`), **cuando** confirmo, **entonces** pregunta abierta: ¿acepta wildcards en Publish (no deberia, convencion MQTT) o solo en Subscribe? (no observado).

**Reglas y restricciones:**
- Tipo: string libre.
- Convencion observada: notacion jerarquica con `/` como separador.
- Longitud: sin limite observado.

**Modelo de datos tocado:**
- `Process.mqttBinding.topic` — string — persistente.

**Dependencias:**
- Bloqueada por: HU-C0.013.

**Notas de evidencia:**
- Fuente: §2 popup binding, §5 controles.
- Frames: frame_00023.
- Transcripcion: "we have the topic".
- Clase de afirmacion: observado.
- Preguntas abiertas: validacion vacio, wildcards.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [mqtt, binding, topico, input, requires-clarification].

---

### HU-C0.016 — Configurar mensaje con alias de objeto en popup de binding

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** K.
**Superficie UI:** popup-binding-mqtt / input `Mensaje`.
**Gesto canonico:** escritura (alias literal).

**Historia:**
> Como ingeniero runtime, quiero escribir en el campo `Mensaje` el alias de un objeto del modelo (ej. `pan`) para que en modo `Publish` el payload enviado al topico sea el valor dinamico de ese objeto al momento de la ejecucion.

**Contexto de negocio:**
El `Mensaje` es el **puente entre el modelo y el payload MQTT**. En modo `Publish`, el texto del mensaje se interpola: si coincide con un alias de objeto del modelo, se reemplaza por el valor actual de ese objeto al enviar. Esta resolucion dinamica es el mecanismo que permite que un modelo publique valores calculados (ej. potencia a entregar al LED) al actuador fisico. En modo `Subscribe`, el uso del campo es menos claro (pregunta abierta §4 hermano c2 "si el mensaje es vacio, se interpola desde el alias del objeto entrante").

**Criterios de aceptacion:**
- **Dado** que estoy en modo `Publish` y escribo `pan` en `Mensaje`, **cuando** confirmo Update, **entonces** el binding queda con `mensaje: "pan"`.
- **Dado** que el objeto con alias `{pan}` tiene slot `value = 42.5`, **cuando** el proceso MQTT se ejecuta en simulacion, **entonces** envia al topico el payload correspondiente al valor `42.5`.
- **Dado** que `Mensaje` queda vacio, **cuando** el proceso ejecuta en `Publish`, **entonces** hipotesis: se interpola automaticamente desde el alias del objeto entrante (inferido de doc hermano c2 §4).
- **Dado** que `Mensaje` contiene texto que NO corresponde a ningun alias, **cuando** ejecuta, **entonces** pregunta abierta: ¿se envia como string literal o bloquea? (§11 doc fuente #2).

**Reglas y restricciones:**
- Tipo: string libre (acepta alias o literal).
- Resolucion dinamica al tiempo de ejecucion, no al tiempo de binding.
- Un unico mensaje por binding en el MVP observado.

**Modelo de datos tocado:**
- `Process.mqttBinding.message` — string — persistente.

**Dependencias:**
- Bloqueada por: HU-C0.013, HU-C0.014.

**Integraciones:**
- Runtime MQTT (resuelve alias en cada tick).
- Objetos con alias `{…}` (EPICA-B1).

**Notas de evidencia:**
- Fuente: §2 popup binding, §3.2 paso 4.
- Frames: frame_00023 (`Message: pan`).
- Transcripcion: "the message that we takes according to the alias as seen in previous examples".
- Clase de afirmacion: observado + confirmado por transcripcion.
- Preguntas abiertas: §11 #2 mensaje invalido, #5 coercion de payload.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [mqtt, binding, mensaje, alias, resolucion-dinamica, requires-clarification].

---

### HU-C0.017 — Confirmar binding MQTT con boton Update

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; K (persiste al modelo).
**Superficie UI:** popup-binding-mqtt / boton `Update`.
**Gesto canonico:** clic en boton `Update`.

**Historia:**
> Como ingeniero runtime, quiero confirmar la configuracion del binding con el boton `Update` para aplicar los cambios al modelo de una vez, en lugar de guardar campo por campo.

**Contexto de negocio:**
Confirmacion atomica por boton evita estados intermedios inconsistentes durante edicion. El gesto `Update` es familiar al usuario de OPCloud (mismo patron que popup Auto Format de EPICA-10 aunque sin Enter equivalente documentado aqui).

**Criterios de aceptacion:**
- **Dado** que el popup tiene valores editados (modo, topico, mensaje), **cuando** hago clic en `Update`, **entonces** los valores se persisten en `Process.mqttBinding` y el popup se cierra.
- **Dado** que confirme con Update, **cuando** reabro el popup, **entonces** muestra los valores persistidos.
- **Dado** que no cambie nada pero hago clic en Update, **cuando** se ejecuta, **entonces** los valores se reconfirman sin efecto observable.

**Reglas y restricciones:**
- Accion unica: no hay `Cancel` explicito observado — cerrar por fuera descarta (inferido).
- Validacion previa al Update: no observada explicita.
- El binding se aplica **al modelo**, no al runtime — requiere estar en simulacion Sync (HU-C0.020) para tomar efecto.

**Modelo de datos tocado:**
- `Process.mqttBinding` completo se persiste.

**Dependencias:**
- Bloqueada por: HU-C0.013.

**Notas de evidencia:**
- Fuente: §2 popup binding (campo `Update`).
- Frames: frame_00023.
- Clase de afirmacion: observado.

**Prioridad:** W.
**Tamano:** XS.
**Etiquetas:** [mqtt, binding, popup, persistencia, confirmacion].

---

### HU-C0.018 — Ver slot value mutar a numeral al recibir payload Subscribe

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; X (consume live data) secundario.
**Superficie UI:** canvas-render / slot `value` interior de objeto computacional.
**Gesto canonico:** ninguno (actualizacion reactiva durante simulacion).

**Historia:**
> Como ingeniero runtime, quiero ver el slot `value` del objeto ligado mutar de la palabra literal `value` a un numero con decimales (`3438.00`, `113.00`) cada vez que el proceso MQTT en modo `Subscribe` recibe un payload del intermediario para observar en vivo como el mundo real fluye hacia el modelo.

**Contexto de negocio:**
El slot `value` es la **ventana al mundo real** durante simulacion. Su mutacion en tiempo real es la evidencia visual de que el websocket esta vivo y el intermediario esta empujando payloads. La convencion de mostrar siempre dos decimales (incluso cuando el valor es entero, como `3438.00`) es observada consistentemente en los frames. Es el diferencial mas vistoso de la integracion MQTT: modelos OPM "cobrando vida".

**Criterios de aceptacion:**
- **Dado** que tengo un proceso MQTT en modo `Subscribe` ligado a un objeto computacional con slot `value`, **cuando** estoy en simulacion Sync con websocket abierto, **entonces** cada vez que llega un mensaje al topico el slot `value` del objeto se actualiza al payload recibido.
- **Dado** que el payload es el numero `3438`, **cuando** el slot se actualiza, **entonces** se renderiza como `3438.00` (dos decimales siempre).
- **Dado** que el payload llega rapidamente, **cuando** sucede a frecuencia alta, **entonces** el render actualiza con visibilidad suficiente para que el usuario observe cambios (frame 30, 32 muestran valores distintos en ticks distintos).
- **Dado** que el payload no es numerico (ej. texto), **cuando** llega, **entonces** pregunta abierta: ¿coerce a numero, lo ignora, o rompe? (§11 doc fuente #5).
- **Dado** que no hay mensajes por un periodo, **cuando** miro el slot, **entonces** conserva el ultimo valor recibido (no vuelve a `value` placeholder hasta salir de simulacion — §3.6 doc fuente).

**Reglas y restricciones:**
- Formato de render: `<numero>.<2 decimales>` (ej. `3438.00`, `113.00`, `3543.50`).
- Coercion observada: payload numerico siempre renderizado con dos decimales.
- Ver brecha `adv-08 §MQ-3`: el slot mutable entre tres textos (`value` / numero / `published`).

**Modelo de datos tocado:**
- `RuntimeState.lastValues[<ObjectId>]` — `number | "published" | "value"` — transitorio.
- `thing.slotValue` — render derivado — transitorio.

**Dependencias:**
- Bloqueada por: HU-C0.004 (conexion), HU-C0.014 (modo Subscribe), HU-C0.020 (simulacion Sync).

**Integraciones:**
- Renderer JointJS del slot `value`.
- Runtime MQTT client (handler `onMessage`).
- Objetos computacionales EPICA-B1.

**Notas de evidencia:**
- Fuente: §3.5 paso 3, §9 convenciones "Contenido del slot `value` con tres estados".
- Frames: frame_00030, frame_00032.
- Transcripcion: "it is subscribing to ldr1 and getting the value now it's subscribing to ldr2 and getting its value".
- Clase de afirmacion: observado + confirmado por transcripcion.
- Preguntas abiertas: §11 #5 coercion.

**Prioridad:** W.
**Tamano:** M.
**Etiquetas:** [render, mqtt, simulacion, live-data, slot-value, subscribe].

---

### HU-C0.019 — Ver slot value mutar a literal published tras enviar Publish

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; X secundario.
**Superficie UI:** canvas-render / slot `value` de objeto ligado al Publish.
**Gesto canonico:** ninguno.

**Historia:**
> Como ingeniero runtime, quiero ver el slot `value` del objeto gemelo digital mutar a la palabra-estado literal `published` cada vez que el proceso MQTT envia un payload al intermediario para confirmar visualmente que la publicacion salio.

**Contexto de negocio:**
Al contrario de `Subscribe` que escribe un numero recibido, `Publish` no tiene un "valor recibido" de vuelta — el feedback visual es que el **envio ocurrio**, representado con la palabra-estado literal `published` en el slot. Es una convencion singular: el mismo slot muestra un numero (dato) o una palabra (estado) segun el modo del proceso que lo acompana. El doc fuente marca esta confusion como brecha severidad A (§MQ-3): un lector externo no puede inferir si `published` es nombre del slot o valor.

**Criterios de aceptacion:**
- **Dado** que tengo un proceso MQTT en modo `Publish` ligado a un objeto gemelo digital, **cuando** el proceso ejecuta y envia el mensaje al intermediario, **entonces** el slot `value` del objeto asociado pasa a mostrar literal `published`.
- **Dado** que el `Publish` se ejecuta repetidamente durante la simulacion, **cuando** cada tick, **entonces** el slot se mantiene en `published` (no parpadea, a verificar).
- **Dado** que salgo del modo simulacion, **cuando** dejo de ejecutar, **entonces** pregunta abierta: ¿el slot vuelve a `value` placeholder o conserva `published`? (§11 doc fuente #3).
- **Dado** que un observador externo ve el slot con `published`, **cuando** intenta interpretar, **entonces** no tiene pista visual de si es dato o estado — la ambiguedad es deuda de diseno documentada (brecha §MQ-3).

**Reglas y restricciones:**
- Palabra literal: `published` (minusculas, una palabra).
- Se distingue del placeholder `value` y de numerales por la semantica, no por estilo grafico.
- El slot renderiza la palabra con la misma tipografia y caja que numerales.

**Modelo de datos tocado:**
- `RuntimeState.lastValues[<ObjectId>]` — `"published"` — transitorio.

**Dependencias:**
- Bloqueada por: HU-C0.004, HU-C0.014 (modo Publish), HU-C0.020.

**Integraciones:**
- Renderer del slot.
- Runtime MQTT client (handler `onPublishComplete`).

**Notas de evidencia:**
- Fuente: §3.5 paso 3, §9 "Contenido del slot `value`".
- Frames: frame_00032 (rectangulo inferior derecho con `published`).
- Clase de afirmacion: observado.
- Preguntas abiertas: §11 #3 reset post-simulacion; brecha `adv-08 §MQ-3` ambiguedad de lectura.

**Prioridad:** W.
**Tamano:** M.
**Etiquetas:** [render, mqtt, simulacion, live-data, slot-value, published, brecha-diseno].

---

### HU-C0.020 — Ejecutar simulacion MQTT en modo Sync obligatorio

**Actor primario:** IR.
**Actores secundarios:** IS (ingeniero simulacion — comparte la simulacion).
**Tipo:** opcloud-ui.
**Nivel categorico:** X primario; U secundario.
**Superficie UI:** barra-simulacion (boton Play + indicador Sync/Async).
**Gesto canonico:** elegir Sync + clic Play.

**Historia:**
> Como ingeniero runtime, quiero ejecutar la simulacion en modo `Sync` (sincronizado) obligatoriamente cuando el modelo esta acoplado a MQTT para que los ticks esperen a los payloads reales del intermediario en vez de sortear valores aleatorios.

**Contexto de negocio:**
MQTT **no genera valores**: los lee del intermediario. Correr en `Async` (que sortea valores computacionales segun reglas de simulacion EPICA-B3) rompe la semantica de integracion real. La regla `use Sync with MQTT` es critica y explicita en la transcripcion. El doc fuente la eleva a "regla critica" en §3.5 paso 2.

**Criterios de aceptacion:**
- **Dado** que el modelo tiene procesos con categoria MQTT y websocket abierto, **cuando** entro al modo simulacion, **entonces** veo la barra con play/stop/dado/speed/Async (coherente con EPICA-B1 §3.4).
- **Dado** que la barra muestra Async activo, **cuando** presiono Play, **entonces** pregunta abierta: ¿el sistema bloquea con advertencia o ejecuta degradado? (no observado).
- **Dado** que selecciono modo `Sync` (sincronizado) y presiono Play, **cuando** ejecuta, **entonces** cada tick espera al siguiente payload MQTT — los slots `value` se actualizan al ritmo del intermediario (HU-C0.018, HU-C0.019).
- **Dado** que cubro fisicamente el sensor (caso observado del LDR), **cuando** el payload baja, **entonces** los valores del modelo bajan proporcionalmente y el loop se mantiene — dinamica en tiempo real.
- **Dado** que presiono Stop, **cuando** termina simulacion, **entonces** los slots conservan el ultimo valor recibido (§3.6 doc fuente).

**Reglas y restricciones:**
- Regla critica: **Sync obligatorio** para MQTT. Formalizacion exacta del bloqueo es pregunta abierta.
- Sync respeta el rate del intermediario (no hay velocidad controlada por speed slider en este modo — inferido).
- La simulacion puede combinarse con Predefined/User Defined/External en el mismo modelo (§7 integraciones).

**Modelo de datos tocado:**
- `RuntimeState.simulationMode` — `"Sync" | "Async"` — transitorio.
- `RuntimeState.mqttWebsocket` — verificado conectado antes de Play.

**Dependencias:**
- Bloqueada por: HU-C0.004 (conexion), EPICA-B0 + B1 (barra simulacion).
- Bloquea a: HU-C0.018, HU-C0.019 (dependen de estar en simulacion Sync).

**Integraciones:**
- Motor simulacion (EPICA-B0, B1).
- Runtime MQTT client.

**Notas de evidencia:**
- Fuente: §3.5 "Ejecutar la simulacion con MQTT vivo", paso 2 "Regla critica".
- Transcripcion: "please use the synchronized execution in order to see it in real time", "now i cover the sensing sensors so in the coming sensors you will see that it is much lower rate".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [mqtt, simulacion, sync-execute, runtime, regla-critica].

---

### HU-C0.021 — Descargar websocket server de referencia desde Manuals pane

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** C (config/onboarding).
**Superficie UI:** manuals-pane / link de descarga.
**Gesto canonico:** clic en link.

**Historia:**
> Como ingeniero runtime, quiero descargar el websocket server de referencia (`MQTT and ROS connection WebSocket Servers Examples Zip File`) desde el panel Manuals para tener el puente mediador entre el intermediario MQTT y OPCloud sin escribirlo desde cero.

**Contexto de negocio:**
OPCloud no conecta directamente al intermediario MQTT nativo: requiere un **websocket server intermediario** que corre en el host del usuario. Este server traduce protocol MQTT a websocket que el navegador puede consumir. Distribuir un server de ejemplo reduce enormemente la barrera de entrada. Es pieza de **onboarding critico** para el feature.

**Criterios de aceptacion:**
- **Dado** que abro el panel `OPCloud Manuals / OPCloud Quick User Guide`, **cuando** navego la seccion relevante, **entonces** veo un link titulado `MQTT and ROS connection WebSocket Servers Examples Zip File`.
- **Dado** que hago clic en el link, **cuando** se descarga, **entonces** obtengo un ZIP con codigo de ejemplo (`mqtt_conn_opcloud.js` observado en frame 20).
- **Dado** que ejecuto el server descargado, **cuando** OPCloud intenta conectar, **entonces** el websocket server media entre intermediario MQTT y canvas.
- **Dado** que el server descargado es de version antigua, **cuando** hay mismatch con la version de OPCloud, **entonces** pregunta abierta: ¿se versiona con OPCloud o independiente? (§11 doc fuente #10).

**Reglas y restricciones:**
- Descarga es estatica: el ZIP no cambia sin redeploy de OPCloud.
- El server de ejemplo es punto de partida, no solucion productiva (convencion de "examples").

**Modelo de datos tocado:**
- Ninguno (descarga de asset externo).

**Dependencias:**
- Relaciona: HU-C0.004 (el websocket abierto depende de este server corriendo).

**Integraciones:**
- Manuals pane (EPICA-91 tutorial/docs).
- File download del navegador.

**Notas de evidencia:**
- Fuente: §2 "Manuals pane", §7 integraciones.
- Frames: frame_00017, frame_00020.
- Clase de afirmacion: observado.
- Preguntas abiertas: §11 #10 versionado.

**Prioridad:** W.
**Tamano:** XS.
**Etiquetas:** [mqtt, onboarding, manuals, descarga, zip, websocket-server].

---

### HU-C0.022 — Persistir binding MQTT al guardar el modelo

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** P (persistencia).
**Superficie UI:** ninguna directa (efecto transparente al Save).
**Gesto canonico:** ninguno (colateral de Save).

**Historia:**
> Como ingeniero runtime, quiero que la configuracion del binding MQTT (modo, topico, mensaje) de cada proceso se guarde al persistir el modelo para no tener que reconfigurar cada vez que abro el archivo.

**Contexto de negocio:**
La config de binding es **del modelo**, no del runtime: vive con el archivo. Al cargar el modelo en otra sesion/maquina, el binding debe estar presente para que simulacion MQTT funcione sin re-configuracion manual. Esto lo diferencia de `RuntimeState.mqttWebsocket` (estado, transitorio) vs `Process.mqttBinding` (config, persistente). El doc fuente marca esto como pregunta abierta explicita (§11 #6).

**Criterios de aceptacion:**
- **Dado** que configure el binding MQTT en un proceso, **cuando** hago Save (EPICA-30), **entonces** los campos `mode`, `topic`, `message` se serializan junto con el proceso.
- **Dado** que cierro el modelo y lo reabro (o lo cargo en otra sesion), **cuando** inspecciono el proceso MQTT, **entonces** el binding persiste identico.
- **Dado** que exporto el modelo a `.opcat` (EPICA-70) o formato propio, **cuando** re-importo, **entonces** el binding se preserva en la ida y vuelta.
- **Dado** que el modelo se carga en una instalacion con `External Connections Settings` distinto, **cuando** ejecuto simulacion, **entonces** usa los settings globales locales (no los del modelo — config global y binding son ortogonales).

**Reglas y restricciones:**
- `Process.mqttBinding` se serializa junto con el proceso.
- **No se serializa** `RuntimeState.mqttWebsocket` (estado transitorio).
- **No se serializa** la config global `GlobalSettings.externalConnections.mqtt` (es por instalacion, no por modelo).

**Modelo de datos tocado:**
- `Process.mqttBinding.{mode, topic, message}` — persistente — serializado.

**Dependencias:**
- Bloqueada por: HU-C0.011-017 (binding completo), EPICA-30 (Save/Load).
- Relaciona: EPICA-70 (interop OPCat).

**Integraciones:**
- Serializador del modelo (kernel).
- Save/Load.

**Notas de evidencia:**
- Fuente: §11 preguntas abiertas #6 "¿El modelo serializa el `mqttBinding` al guardar, o es configuracion volatil?".
- Clase de afirmacion: **abierta** — comportamiento no verificado en el reverse.
- Etiqueta: `requires-clarification`.

**Prioridad:** W.
**Tamano:** M.
**Etiquetas:** [mqtt, persistencia, serializacion, binding, requires-clarification].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q-C0.1** (§11 #1): ¿Hay reconexion automatica del websocket MQTT si el intermediario cae mid-simulacion, o requiere clic manual? — impacto: HU-C0.004, HU-C0.007.
- **Q-C0.2** (§11 #2): ¿Que ocurre si el `Mensaje` del popup no corresponde a ningun alias conocido — se envia como string literal o se bloquea? — impacto: HU-C0.016.
- **Q-C0.3** (§11 #3): ¿El slot `value` se resetea a la palabra literal `value` al salir de modo simulacion, o conserva el ultimo numero/`published` indefinidamente? — impacto: HU-C0.018, HU-C0.019.
- **Q-C0.4** (§11 #4): ¿Puede un proceso MQTT en modo `Subscribe` coexistir con una firma `Predefined` o `User Defined` sobre el mismo proceso, o son excluyentes? — impacto: HU-C0.011.
- **Q-C0.5** (§11 #5): ¿Que tipo de coercion aplica al payload recibido — todo a numero con dos decimales, o se respeta el formato del intermediario? — impacto: HU-C0.018.
- **Q-C0.6** (§11 #6): ¿El modelo serializa el `mqttBinding` (topico, mensaje) al guardar, o es configuracion volatil? — impacto: HU-C0.022 (HU abierta completa).
- **Q-C0.7** (§11 #7): ¿El toast `MQTT Websocket connection established` aparece siempre o es omitido en reconexion rapida? — impacto: HU-C0.005.
- **Q-C0.8** (§11 #8): ¿Hay algun indicador visual sobre la elipse callable para distinguir `MQTT Publish` de `MQTT Subscribe` sin abrir el popup? — impacto: HU-C0.012 (potencial HU nueva si se confirma existencia).
- **Q-C0.9** (§11 #9): ¿Se pueden tener multiples bindings (varios topicos) sobre el mismo proceso ``? El popup sugiere un solo binding por proceso; no verificado — impacto: modelo de datos `Process.mqttBinding` (singular vs array).
- **Q-C0.10** (§11 #10): ¿La descarga del websocket server de referencia viene versionada con la instalacion de OPCloud o se actualiza independientemente? — impacto: HU-C0.021.
- **Q-C0.11** (no en §11, observada en HU-C0.003): ¿El tooltip de estado del boton MQTT expone credenciales/tokens cuando existan? Actualmente no hay auth; si se agrega TLS/auth, el tooltip no debe exponerla.
- **Q-C0.12** (no en §11, observada en HU-C0.020): ¿Intenta el sistema bloquear Play en Async cuando hay procesos MQTT, o ejecuta degradado? Regla critica pero comportamiento de enforcement no observado.
- **Q-C0.13** (no explicito en doc fuente): ¿Hay soporte para TLS (`wss://`), autenticacion con usuario/password, o certificados client-side? No observado. El unico endpoint documentado es `ws://localhost:9883`. Si se incorpora en iteraciones futuras, impacta modelo de datos de settings globales (HU-C0.001).
- **Q-C0.14** (no explicito): ¿Hay QoS (Quality of Service 0/1/2) ni retained messages configurables? Estandar MQTT los expone; no observado en popup ni settings. Si se incorpora: extension de `Process.mqttBinding` con campos `qos`, `retain`.

## Referencias cruzadas

- **Doc fuente**: `opcloud-reverse/c0-runtime-mqtt.md`.
- **Epicas hermanas de runtime**:
  - **EPICA-C1** (runtime-urls): categoria `External URL` del mismo menu de proceso computacional.
  - **EPICA-C2** (runtime-ros): boton vecino `ROS` y categoria `ROS` del mismo menu.
- **Epicas blocker (requieren estar antes)**:
  - **EPICA-10** (canvas-creacion-cosas): crear proceso y objeto.
  - **EPICA-B0** (simulation-conceptual): modo simulacion base.
  - **EPICA-B1** (simulation-computational): proceso computacional, slot `value`, alias, unidad, barra de categorias.
  - **EPICA-30** (persistencia-save-load): Save para HU-C0.022.
  - **EPICA-80** (config-user-org): settings globales shell para HU-C0.001.
  - **EPICA-82** (config-organization-ontology): scope de admin de organizacion.
- **Epicas aguas abajo (consumen o reusan)**:
  - **EPICA-50** (opl-pane): emite la oracion `is the Digital Twin of` (HU-C0.010).
  - **EPICA-70** (interop-opcat): preserva binding al exportar/importar (HU-C0.022).
  - **EPICA-91** (interaccion-tutorial): Manuals pane con link de descarga (HU-C0.021).
- **Brechas SSOT documentadas en reverse** (`adv-08 §MQ-1..8`):
  - **§MQ-1** severidad A: relacion "Digital Twin" sin primitiva visual, solo OPL + sufijo textual → afecta HU-C0.009, HU-C0.010.
  - **§MQ-2**: slot `value` persistente dentro del objeto → afecta HU-C0.018, HU-C0.019.
  - **§MQ-3**: slot `value` con tres estados textuales (`value` / numeral / `published`) ambiguos → afecta HU-C0.018, HU-C0.019.
  - **§MQ-5**: unidad `[lx]` entre corchetes como parte del nombre visual (heredada de B1).
  - **§MQ-6**: alias `{rli}` entre llaves (heredada de B1).
  - **§MQ-7**: borde dashed vs continuo con doble carga (sistemico/ambiental + realidad/gemelo) → afecta HU-C0.009.
  - **§MQ-8**: circulos sobre bordes como puntos de anclaje persistentes.
- **Invariantes del repo tocados**:
  - `src/nucleo/tipos.ts`: extender `Process` con `category` y `mqttBinding`; `Object` con `digitalTwinOf`.
  - `src/nucleo/validacion/`: validar coherencia de binding (modo vs direccion de enlace entrante/saliente).
  - `src/render/opl-renderer.ts`: plantilla `is the Digital Twin of`.
  - `src/persistencia/`: serializar `mqttBinding` (HU-C0.022).
  - **Nota sobre kernel**: la integracion MQTT es candidata a **dominio funtor** (ver `docs/design/patron-dominios-funtor.md`) — `D_MQTT` en `src/suite/` podria alojar extensiones de `Process` sin tocar el kernel. La presion multiple (EPICA-C0 + EPICA-C1 URLs + EPICA-C2 ROS comparten el patron "categoria de proceso callable con binding") ya se cumple: evaluar consolidacion en un funtor `D_RUNTIME` al activar cualquiera de las tres epicas.
