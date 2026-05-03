---
epica: "EPICA-C2"
titulo: "Runtime ROS — integracion con Robot Operating System (publish/subscribe/servicio, topicos, overlays de simulacion, Turtlesim)"
doc_fuente: "opcloud-reverse/c2-runtime-ros.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "W"
hu_emitidas: 28
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "DIAGNOSTICO-PILOTO-EPICA-10.md"
---

## Resumen

Esta epica cubre la integracion runtime del modelo OPM con un ROS Master real a traves de un WebSocket mediador. Un proceso computacional con categoria `ROS` puede publicar mensajes a topicos (`/turtle1/cmd_vel`), suscribirse, llamar servicios o ejecutar scripts raw; el payload se construye desde el codigo Python/JS del proceso inyectado con los alias de los objetos conectados por `Instrument`. Durante `Sync Execute` el modelo sincroniza la simulacion conceptual con un robot externo (p.ej. nodo Turtlesim que dibuja una espiral), y el canvas expone overlays transitorios exclusivos: pin azul en gota sobre el estado actual, dots verde-oliva solidos sobre los enlaces activos y valores estructurados multilinea (JSON-like) en el rectangulo-valor.

La categoria es **hermana de `MQTT` (EPICA-C0) y `URLs` (EPICA-C1)**, compartiendo el grupo WebSocket de Settings y el patron de badges de runtime, pero diferencia por la semantica publish/subscribe y la gramatica de topicos con alias. Las HU se numeran segun la aparicion en el doc fuente. Prioridad predominante **W** (won't-have en ciclo actual del modelador core) porque la integracion runtime requiere infraestructura externa (ROS Master + WebSocket mediador + nodo Turtlesim) y salvo en dominios de robotica excede el alcance del modelador OPM base. Se incluyen como backlog estrategico por paridad conceptual con OPCloud.

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-C2.001 | Seleccionar categoria ROS en proceso computacional | IR | W | M | opcloud-ui | [JOYAS §1] |
| HU-C2.002 | Configurar Server/Port del WebSocket ROS en Settings | IR | W | S | opcloud-ui | — |
| HU-C2.003 | Descargar WebSocket mediador desde Manuals & Guides | IR | W | XS | opcloud-ui | — |
| HU-C2.004 | Abrir popup ROS Messaging Screen desde proceso categoria ROS | IR | W | S | opcloud-ui | — |
| HU-C2.005 | Seleccionar modo Publish en ROS Messaging Screen | IR | W | S | opcloud-ui | — |
| HU-C2.006 | Configurar topico con parseo por slash y alias | IR | W | M | opcloud-ui | — |
| HU-C2.007 | Configurar Data type del mensaje ROS | IR | W | S | opcloud-ui | — |
| HU-C2.008 | Configurar mensaje literal o delegar a codigo + alias | IR | W | S | opcloud-ui | — |
| HU-C2.009 | Seleccionar modo Subscribe en ROS Messaging Screen | IR | W | M | opcloud-ui | — |
| HU-C2.010 | Seleccionar modo Servicio en ROS Messaging Screen | IR | W | M | opcloud-ui | — |
| HU-C2.011 | Seleccionar modo Raw Script en ROS Messaging Screen | IR | W | M | opcloud-ui | — |
| HU-C2.012 | Persistir configuracion ROS con boton Update | IR | W | XS | opcloud-ui | — |
| HU-C2.013 | Ver badges PYTHON + camara + :::ROS sobre proceso | IR | W | S | opcloud-ui | [JOYAS §1] [R-1] |
| HU-C2.014 | Editar codigo Python/JS del proceso en editor Monaco | IR | W | M | opcloud-ui | — |
| HU-C2.015 | Ver runtime variables inyectadas read-only en editor | IR | W | S | opcloud-ui | — |
| HU-C2.016 | Ver tooltip amarillo con preview de codigo al hover | IR | W | S | opcloud-ui | [R-11] |
| HU-C2.017 | Usar rotulo extendido `Nombre [unidad] {alias}` en objeto | IR | W | S | opcloud-ui | [R-5] |
| HU-C2.018 | Ejecutar simulacion Sync Execute con ROS Master en vivo | IR | W | L | opcloud-ui | — |
| HU-C2.019 | Ver pin azul en gota sobre estado actual del objeto | IR | W | M | opcloud-ui | [R-2] |
| HU-C2.020 | Ver dots verde-oliva sobre enlaces activos en simulacion | IR | W | M | opcloud-ui | [R-3] |
| HU-C2.021 | Ver valor estructurado multilinea en rectangulo-valor | IR | W | S | opcloud-ui | [R-4] |
| HU-C2.022 | Sincronizar modelo OPM con ventana externa Turtlesim/RViz | IR | W | L | opcloud-ui | — |
| HU-C2.023 | Ver linea OPL dinamica `is currently at state X` | RV | W | S | opcloud-ui | [R-2] |
| HU-C2.024 | Ejecutar en modo Headless Runner sin animacion de canvas | IR | W | S | opcloud-ui | — |
| HU-C2.025 | Abortar o reaccionar a caida del WebSocket mid-simulacion | IR | W | M | opcloud-ui | — |
| HU-C2.026 | Convertir tipos ROS std_msgs ↔ primitivas OPM | IR | W | L | opcloud-ui | — |
| HU-C2.027 | Replay de rosbag sobre modelo OPM | IR | W | XL | opcloud-ui | — |
| HU-C2.028 | Exportar modelo como ROS launch file ejecutable | IR | W | XL | opcloud-ui | — |

Total: **28 historias de usuario** (28 opcloud-ui).

## Historias de usuario

### HU-C2.001 — Seleccionar categoria ROS en proceso computacional

**Actor primario:** IR (ingeniero de runtime).
**Actores secundarios:** IS (ingeniero de simulacion).
**Tipo:** opcloud-ui.
**Nivel categorico:** K (kernel — nuevo campo `process.category`) primario; U (barra contextual) secundario; X (integracion externa) secundario.
**Superficie UI:** barra-contextual-proceso-computacional (grid `Predefined | User Defined | External` / `ROS | MQTT | Python`).
**Gesto canonico:** clic en pestana `ROS` dentro de la barra contextual del proceso.

**Historia:**
> Como ingeniero de runtime, quiero marcar un proceso computacional con categoria `ROS` para declarar que su ejecucion publica o consume mensajes de un ROS Master real.

**Contexto de negocio:**
La categoria del proceso determina su canal de ejecucion. OPCloud expone cinco categorias en la barra contextual (`Predefined`, `User Defined`, `External`, `ROS`, `MQTT`) mas `Python` en la fila inferior. Seleccionar `ROS` transforma el proceso en un emisor/receptor de mensajes sobre un broker externo mediado por WebSocket. El cambio es semantico, no cosmetico: el proceso gana el campo `rosConfig`, los badges de runtime, la posibilidad de invocar la *Pantalla de Mensajeria ROS* y acceso a las runtime variables en el editor Monaco.

**Criterios de aceptacion:**
- **Dado** que tengo un proceso convertido a computacional (`computational=true`, sufijo ``), **cuando** selecciono la cosa, **entonces** veo la barra contextual con las cinco pestanas de categoria mas `Python`.
- **Dado** que la barra contextual esta visible, **cuando** hago clic en `ROS`, **entonces** `process.category` pasa a `"ROS"` y la pestana queda destacada.
- **Dado** que seleccione `ROS`, **cuando** el proceso se renderiza, **entonces** emergen los tres badges de runtime `PYTHON` / camara / `:::ROS` fuera del contorno de la elipse (ver HU-C2.013).
- **Dado** que seleccione `ROS`, **cuando** hago clic sobre la elipse, **entonces** se abre la *Pantalla de Mensajeria ROS* anclada bajo el proceso (ver HU-C2.004).
- **Dado** que cambio de `ROS` a otra categoria (`MQTT`, `Predefined`…), **cuando** confirmo el cambio, **entonces** `rosConfig` se preserva como draft o se descarta (**pregunta abierta**, ver §11.5 doc fuente).

**Reglas y restricciones:**
- Precondicion dura: el proceso debe ser computacional previamente (EPICA-B1). Categoria no se puede asignar a procesos conceptuales puros.
- La barra contextual se layoutea en grid de tres columnas × dos filas (frame 21 del doc fuente).
- La categoria es mutuamente exclusiva: un proceso pertenece a una y solo una.

**Modelo de datos tocado:**
- `process.category` — enum `"Predefined" | "UserDefined" | "External" | "ROS" | "MQTT" | "Python"` — persistente.
- `process.rosConfig` — objeto opcional (ver HU-C2.004) — persistente cuando category=ROS.
- `process.runtimeBadges` — array string — transitorio (deriva de category).

**Dependencias:**
- Bloqueada por: EPICA-B1 (`b1-simulation-computational.md`) — proceso debe ser computacional.
- Bloqueada por: HU-C2.002 (Settings del WebSocket ROS debe existir para ejecucion, no para configuracion).
- Bloquea a: HU-C2.004, HU-C2.013, HU-C2.018.

**Integraciones:**
- Barra contextual del proceso.
- Render del proceso (badges).
- Pantalla de Mensajeria ROS (se activa).
- Editor Monaco (expone scope ROS).

**Notas de evidencia:**
- Fuente: `opcloud-reverse/c2-runtime-ros.md` §1, §2.6, §3.5 paso 1.
- Frames: frame 21 (grid de categorias), frame 36 (badges post-seleccion).
- Transcripcion: "you're going to create a computational process and click on the ROS".
- Clase de afirmacion: observado + confirmado por transcripcion.
- Evidencia visual: JOYAS §1 colores para elipse de proceso.

**Prioridad:** W.
**Tamano:** M.
**Etiquetas:** [runtime, ros, proceso-computacional, barra-contextual, kernel].

---

### HU-C2.002 — Configurar Server/Port del WebSocket ROS en Settings

**Actor primario:** IR.
**Actores secundarios:** AO (admin de organizacion — override global).
**Tipo:** opcloud-ui.
**Nivel categorico:** C (config) primario; X (integracion) secundario.
**Superficie UI:** modal-settings (OPCloud Settings → User Management → OPCloud Settings → WebSocket Connection).
**Gesto canonico:** edicion de campos `Server` y `Port` + guardar.

**Historia:**
> Como ingeniero de runtime, quiero configurar el host y puerto del WebSocket mediador de ROS en los settings de usuario para apuntar OPCloud a mi ROS Master local o remoto.

**Contexto de negocio:**
El WebSocket es el puente entre OPCloud y el ROS Master. Los defaults `localhost:3000` sirven para el caso mediador-en-la-misma-maquina; para escenarios distribuidos (ROS Master en un robot, OPCloud en laptop) hay que apuntar explicitamente. El setting es per-usuario a menos que el admin de organizacion lo congele (consistente con EPICA-80).

**Criterios de aceptacion:**
- **Dado** que abro `OPCloud Settings → User Management → OPCloud Settings`, **cuando** busco el grupo `WebSocket Connection`, **entonces** veo tres filas: Python (`localhost:8765`), ROS (`localhost:3000`), MQTT (`localhost:9883`).
- **Dado** que edito el campo `Server` de ROS a `192.168.1.50`, **cuando** guardo, **entonces** el valor persiste para mi usuario.
- **Dado** que edito el `Port` de ROS a `9090`, **cuando** guardo, **entonces** el valor persiste.
- **Dado** que el admin de organizacion congelo el setting (ver EPICA-80), **cuando** intento editar, **entonces** el campo queda readonly con indicador visual.

**Reglas y restricciones:**
- Defaults observados: `Python localhost:8765`, `ROS localhost:3000`, `MQTT localhost:9883`.
- Validacion: `Server` es hostname o IP; `Port` entero en rango `[1, 65535]`.
- El valor se usa al arrancar `Sync Execute` (HU-C2.018), no al configurar el proceso.

**Modelo de datos tocado:**
- `settings.websocket.ros.server` — string — persistente por usuario.
- `settings.websocket.ros.port` — integer — persistente por usuario.
- `settings.websocket.ros.frozen` — boolean — persistente (admin de org).

**Dependencias:**
- Relaciona: EPICA-80 (config user/org), EPICA-C0 (MQTT comparte grupo), EPICA-C1 (URLs).

**Integraciones:**
- Modal de Settings.
- Motor de ejecucion (lee al iniciar simulacion).

**Notas de evidencia:**
- Fuente: §2.4, frame 33.
- Transcripcion: "you will need a websocket connection to use as a mediator between OPCloud and your ROS master".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [runtime, ros, settings, websocket, config-usuario].

---

### HU-C2.003 — Descargar WebSocket mediador desde Manuals & Guides

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** X (integracion) primario; U secundario.
**Superficie UI:** OPCloud Manuals → OPCloud Guides.
**Gesto canonico:** clic en hiperenlace de descarga.

**Historia:**
> Como ingeniero de runtime, quiero descargar el ejemplo de servidor WebSocket mediador desde Manuals & Guides para tener el puente ROS↔OPCloud sin implementarlo desde cero.

**Contexto de negocio:**
OPCloud no trae el mediador embebido: es codigo externo que el usuario corre localmente. Exponer el zip como descarga oficial evita que el usuario lo reinvente o busque en GitHub no oficial. La errata observada ("WebSockect") en la UI es parte de la evidencia.

**Criterios de aceptacion:**
- **Dado** que abro `OPCloud Manuals → OPCloud Guides`, **cuando** busco en la lista, **entonces** encuentro un hiperenlace llamado `MQTT and ROS connection WebSockect Servers Examples Zip File` (con la errata observada).
- **Dado** que hago clic, **cuando** el browser procesa, **entonces** se descarga un `.zip` con los ejemplos de servidor.
- **Dado** que descomprimo el zip, **cuando** ejecuto el servidor incluido (instrucciones dentro), **entonces** queda un proceso WebSocket escuchando en el puerto configurado.

**Reglas y restricciones:**
- El zip es estatico, servido por OPCloud; no esta auto-generado.
- La errata "WebSockect" es literal en la UI observada — preservar como evidencia, no como prescripcion.

**Dependencias:**
- Relaciona: HU-C2.002 (los defaults apuntan al mediador descargado).

**Integraciones:**
- Panel Manuals & Guides.

**Notas de evidencia:**
- Fuente: §2.5, frame 39.
- Clase de afirmacion: observado.

**Prioridad:** W.
**Tamano:** XS.
**Etiquetas:** [runtime, ros, manual, descarga].

---

### HU-C2.004 — Abrir popup ROS Messaging Screen desde proceso categoria ROS

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; K (acceso a `rosConfig`) secundario.
**Superficie UI:** popup-ros-messaging-screen anclado bajo la elipse del proceso.
**Gesto canonico:** clic sobre la elipse del proceso con `category=ROS` (o boton dedicado en la barra contextual).

**Historia:**
> Como ingeniero de runtime, quiero abrir la *Pantalla de Mensajeria ROS* desde un proceso con categoria ROS para configurar topico, data type, modo y mensaje sin salir del canvas.

**Contexto de negocio:**
El popup es la superficie de configuracion principal de la integracion ROS. Al ser inline bajo la elipse, el modelador mantiene el contexto visual del proceso y los objetos conectados — clave para entender que alias van a estar disponibles en el codigo.

**Criterios de aceptacion:**
- **Dado** que tengo un proceso con `category=ROS`, **cuando** hago clic (o el trigger equivalente) sobre la elipse, **entonces** aparece el popup *ROS Messaging Screen* anclado bajo el proceso.
- **Dado** que el popup esta abierto, **cuando** miro la estructura, **entonces** veo cuatro campos: dropdown de modo, `Topic`, `Data type`, `Message`, mas boton `Update`.
- **Dado** que el popup esta abierto, **cuando** hago clic fuera del popup sin `Update`, **entonces** los cambios se descartan y el popup se cierra (**pregunta abierta**: ¿confirma descartar?).
- **Dado** que el popup esta abierto, **cuando** el proceso ya tenia `rosConfig` persistido, **entonces** los campos aparecen pre-rellenados con los valores previos.

**Reglas y restricciones:**
- Popup es no-modal: el canvas sigue interactivo detras.
- El anclaje visual es directo bajo la elipse (no flotante).
- Al abrir, el foco por defecto cae en el campo `Topic` (**pregunta abierta**).

**Modelo de datos tocado:**
- `process.rosConfig` (lectura) — ver HU-C2.005, HU-C2.006, HU-C2.007, HU-C2.008.

**Dependencias:**
- Bloqueada por: HU-C2.001.
- Bloquea a: HU-C2.005, HU-C2.006, HU-C2.007, HU-C2.008, HU-C2.012.

**Integraciones:**
- Render del canvas (anclaje).
- Campos del popup.

**Notas de evidencia:**
- Fuente: §2.2, frames 25, 27.
- Transcripcion: "this is the ROS option … you're going to create a computational process and click on the ROS and you will see that we have the ROS messaging screen".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [runtime, ros, popup-inline, pantalla-mensajeria].

---

### HU-C2.005 — Seleccionar modo Publish en ROS Messaging Screen

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario; U secundario.
**Superficie UI:** popup-ros-messaging-screen (dropdown superior).
**Gesto canonico:** seleccion en dropdown.

**Historia:**
> Como ingeniero de runtime, quiero seleccionar el modo `Publish` para declarar que el proceso emite mensajes al ROS Master en lugar de consumirlos.

**Contexto de negocio:**
ROS tiene cuatro patrones de interaccion: publish (broadcast a un topico), subscribe (escucha a un topico), servicio (RPC request/response), raw (escape hatch). `Publish` es el observado y el mas comun en robotica de control. Otros modos aplican para sensores, servicios o casos avanzados.

**Criterios de aceptacion:**
- **Dado** que el popup esta abierto, **cuando** abro el dropdown de modo, **entonces** veo las cuatro opciones: `Publish`, `Subscribe`, `Service`, `Raw Script`.
- **Dado** que selecciono `Publish`, **cuando** confirmo, **entonces** el resto de los campos (`Topic`, `Data type`, `Message`) se habilitan con semantica de emision.
- **Dado** que `Publish` esta seleccionado, **cuando** el proceso ejecuta, **entonces** despacha el payload al topico configurado via WebSocket mediador.

**Reglas y restricciones:**
- Default observado: `Publish`.
- El modo es mutuamente exclusivo: un proceso publica, se suscribe, llama servicio o ejecuta raw, no combina.

**Modelo de datos tocado:**
- `process.rosConfig.mode` — `"Publish" | "Subscribe" | "Service" | "RawScript"` — persistente.

**Dependencias:**
- Bloqueada por: HU-C2.004.
- Bloquea a: HU-C2.018.

**Integraciones:**
- Motor de ejecucion ROS.

**Notas de evidencia:**
- Fuente: §2.2, §3.5 paso 2, frame 25.
- Clase de afirmacion: observado + confirmado.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [runtime, ros, publish, dropdown].

---

### HU-C2.006 — Configurar topico con parseo por slash y alias

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario; X (integracion) secundario.
**Superficie UI:** popup-ros-messaging-screen (campo `Topic`).
**Gesto canonico:** escritura en input text.

**Historia:**
> Como ingeniero de runtime, quiero declarar el topico como `/turtle1/cmd_vel` o `/{a}/cmd_vel` para que OPCloud reemplace los segmentos con alias en tiempo de ejecucion.

**Contexto de negocio:**
El parser de topicos divide por `/` y evalua cada segmento: si coincide con un alias definido en un objeto conectado, se resuelve al valor del alias; si no, se trata como literal. Esto permite topicos parametrizados por el modelo (p.ej. multiples tortugas con `/{turtle_id}/cmd_vel`). Es un diferencial sobre MQTT donde el topico es normalmente literal.

**Criterios de aceptacion:**
- **Dado** que el popup esta abierto, **cuando** escribo `/turtle1/cmd_vel` en `Topic` y confirmo con `Update`, **entonces** persiste literal.
- **Dado** que escribo `/{a}/cmd_vel` y un objeto conectado tiene alias `a` con valor `"turtle1"`, **cuando** ejecuto la simulacion, **entonces** el topico efectivo es `/turtle1/cmd_vel`.
- **Dado** que escribo `/{a}/cmd_vel` y ningun objeto conectado tiene alias `a`, **cuando** ejecuto, **entonces** el segmento `{a}` se trata como literal (no hay warning visible — ver §4 doc fuente).
- **Dado** que escribo sin slash inicial (`turtle1/cmd_vel`), **cuando** persisto: **pregunta abierta** sobre validacion.

**Reglas y restricciones:**
- Parser: split por `/`, cada segmento evalua alias o literal.
- No hay autocomplete de alias (**pregunta abierta**).
- Expresiones dentro de `{...}`: solo identificadores simples observados, no `{a+1}` (**pregunta abierta**, §11.9 doc fuente).

**Modelo de datos tocado:**
- `process.rosConfig.topic` — string — persistente.

**Dependencias:**
- Bloqueada por: HU-C2.004.
- Relaciona: HU-C2.017 (rotulo con alias).

**Integraciones:**
- Parser de topicos (componente de runtime).
- Resolucion de alias desde objetos conectados.

**Notas de evidencia:**
- Fuente: §2.2, §11.9, frame 25.
- Transcripcion: "in the ROS message we split by the tag slash and take each value of its own and check whether it's an alias … or is it just a string".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** W.
**Tamano:** M.
**Etiquetas:** [runtime, ros, topico, alias, parser].

---

### HU-C2.007 — Configurar Data type del mensaje ROS

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario; X secundario.
**Superficie UI:** popup-ros-messaging-screen (campo `Data type`).
**Gesto canonico:** escritura en input text.

**Historia:**
> Como ingeniero de runtime, quiero indicar el tipo canonico ROS (`geometry_msgs/Twist`, `std_msgs/String`, etc.) para que el mediador serialice correctamente el payload.

**Contexto de negocio:**
ROS es fuertemente tipado a nivel de topico. Declarar `geometry_msgs/Twist` indica al mediador WebSocket que estructura espera el receptor. Sin el type, el payload es ambiguo. La fuente de verdad de los tipos es la distribucion ROS (`std_msgs`, `geometry_msgs`, `sensor_msgs`, `nav_msgs`, etc.).

**Criterios de aceptacion:**
- **Dado** que el popup esta abierto, **cuando** escribo `geometry_msgs/Twist` y confirmo, **entonces** persiste en `rosConfig.dataType`.
- **Dado** que escribo un type con typo (`geomtry_msgs/Twist`), **cuando** persisto, **entonces** OPCloud acepta el string (no hay validacion contra catalogo ROS — **pregunta abierta**).
- **Dado** que escribo un type estandar (`std_msgs/String`, `std_msgs/Int32`, `sensor_msgs/LaserScan`), **cuando** el mediador recibe el payload, **entonces** respeta el type declarado.

**Reglas y restricciones:**
- No hay catalogo embebido de tipos ROS (no autocomplete observado).
- El type es string libre; la validacion recae en el mediador, no en OPCloud.

**Modelo de datos tocado:**
- `process.rosConfig.dataType` — string — persistente.

**Dependencias:**
- Bloqueada por: HU-C2.004.
- Relaciona: HU-C2.026 (conversion tipos).

**Integraciones:**
- Mediador WebSocket.

**Notas de evidencia:**
- Fuente: §2.2, frame 25.
- Clase de afirmacion: observado.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [runtime, ros, datatype, std-msgs].

---

### HU-C2.008 — Configurar mensaje literal o delegar a codigo + alias

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario; X secundario.
**Superficie UI:** popup-ros-messaging-screen (textarea `Message`).
**Gesto canonico:** escritura en textarea o dejar vacio.

**Historia:**
> Como ingeniero de runtime, quiero dejar el campo `Message` vacio para que el payload se construya desde el codigo del proceso + alias de objetos conectados, o escribirlo literal para overridear esa logica.

**Contexto de negocio:**
El textarea `Message` es un switch binario: vacio ⇒ se ejecuta el codigo del proceso y el `return` se usa como payload; no-vacio ⇒ se envia literal ignorando el codigo. La mayoria de los casos usa vacio (el codigo es la logica real); el literal es para debug o topicos triviales.

**Criterios de aceptacion:**
- **Dado** que el popup esta abierto y el textarea `Message` esta vacio, **cuando** persisto, **entonces** el payload se toma del `return` del codigo en ejecucion.
- **Dado** que escribo `{"data":"hello"}` en `Message` y persisto, **cuando** se ejecuta el proceso, **entonces** se envia literalmente el string ignorando el codigo.
- **Dado** que `Message` esta vacio y no hay objetos conectados por `Instrument`, **cuando** se ejecuta, **entonces** el payload es lo que retorna el codigo sin alias (**pregunta abierta**: ¿es el string vacio?).

**Reglas y restricciones:**
- Default: vacio (modo "delegar a codigo").
- La regla `vacio ⇒ codigo` es invariante, documentada en el tooltip del popup.
- No hay validacion de parsing JSON en el textarea (observado: el string multilinea JSON-like fluye como texto plano, §3.7 doc fuente).

**Modelo de datos tocado:**
- `process.rosConfig.message` — `string | null` — persistente (null = vacio = delegar).

**Dependencias:**
- Bloqueada por: HU-C2.004.

**Integraciones:**
- Motor de ejecucion: si null, ejecuta codigo; si string, skip codigo.

**Notas de evidencia:**
- Fuente: §2.2 frame 25, §2.2 fila `Message`.
- Transcripcion: "if the message is empty it will be only from connected to the computational objects that's connected to it".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [runtime, ros, mensaje, payload].

---

### HU-C2.009 — Seleccionar modo Subscribe en ROS Messaging Screen

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario; X secundario.
**Superficie UI:** popup-ros-messaging-screen (dropdown modo).
**Gesto canonico:** seleccion en dropdown.

**Historia:**
> Como ingeniero de runtime, quiero seleccionar modo `Subscribe` para que el proceso escuche un topico del ROS Master y actualice el modelo con los mensajes recibidos.

**Contexto de negocio:**
`Subscribe` invierte el sentido: el proceso deja de emitir y pasa a consumir. El flujo se vuelve reactivo: cada mensaje recibido dispara una ejecucion del proceso con el payload como input. Tipico para integrar sensores (LIDAR, camara) al modelo OPM.

**Criterios de aceptacion:**
- **Dado** que el popup esta abierto, **cuando** selecciono `Subscribe`, **entonces** `rosConfig.mode = "Subscribe"`.
- **Dado** que el modo es Subscribe, **cuando** declaro un topico `/turtle1/pose`, **entonces** el proceso espera mensajes entrantes de ese topico.
- **Dado** que llega un mensaje al topico suscrito, **cuando** el mediador lo entrega, **entonces** el proceso se ejecuta con el payload como input disponible en el codigo.
- **Dado** que estoy en modo `Subscribe`, **cuando** miro el render del proceso en simulacion: **pregunta abierta** — ¿como se visualizan los dots verde-oliva? ¿entrando desde un objeto virtual "ROS Master"?

**Reglas y restricciones:**
- Modo no observado en ejecucion en el doc fuente (§11.5).
- Semantica reactiva vs polling: **pregunta abierta**.
- Interaccion con `Message` textarea: **pregunta abierta** (¿se usa como filtro?).

**Modelo de datos tocado:**
- `process.rosConfig.mode = "Subscribe"` — persistente.
- Flujo de ejecucion: reactivo en lugar de secuencial.

**Dependencias:**
- Bloqueada por: HU-C2.004.
- Etiqueta: `requires-clarification`.

**Integraciones:**
- Motor de ejecucion (callback al recibir mensaje).
- Render de overlays (flujo inverso).

**Notas de evidencia:**
- Fuente: §1 (declarado, no observado), §2.2, §4 (flow no observado), §11.5.
- Clase de afirmacion: declarado + hipotesis + abierto.

**Prioridad:** W.
**Tamano:** M.
**Etiquetas:** [runtime, ros, subscribe, requires-clarification].

---

### HU-C2.010 — Seleccionar modo Servicio en ROS Messaging Screen

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario; X secundario.
**Superficie UI:** popup-ros-messaging-screen (dropdown modo).
**Gesto canonico:** seleccion en dropdown.

**Historia:**
> Como ingeniero de runtime, quiero seleccionar modo `Service` para que el proceso invoque un servicio ROS (request/response sincrono) y use la respuesta como resultado del proceso.

**Contexto de negocio:**
`Service` en ROS es RPC: cliente envia request, espera response. Distinto de topicos (fire-and-forget). Tipico para acciones discretas (resetear posicion, cambiar parametro). En OPCloud el proceso se vuelve un cliente de servicio.

**Criterios de aceptacion:**
- **Dado** que selecciono `Service`, **cuando** persisto, **entonces** `rosConfig.mode = "Service"`.
- **Dado** que el modo es `Service`, **cuando** el proceso se ejecuta, **entonces** envia un request al servicio declarado en el campo `Topic` y bloquea hasta recibir response.
- **Dado** que el servicio responde exitosamente, **cuando** el proceso continua, **entonces** la response se materializa como valor en los objetos `Result` conectados (**pregunta abierta**).
- **Dado** que el servicio timeout-ea, **cuando** expira: **pregunta abierta** — ¿el proceso falla, retry, continua?

**Reglas y restricciones:**
- Modo no observado en ejecucion (§4 doc fuente, §11.5).
- Nomenclatura: ROS usa `srv/ServiceName`; el campo `Data type` podria alojarlo.
- Request/response shape: **pregunta abierta**.

**Modelo de datos tocado:**
- `process.rosConfig.mode = "Service"` — persistente.

**Dependencias:**
- Bloqueada por: HU-C2.004.
- Etiqueta: `requires-clarification`.

**Integraciones:**
- Mediador WebSocket (cliente de servicio).

**Notas de evidencia:**
- Fuente: §1 (declarado), §2.2 dropdown, §11.5.
- Clase de afirmacion: declarado + hipotesis.

**Prioridad:** W.
**Tamano:** M.
**Etiquetas:** [runtime, ros, servicio, requires-clarification].

---

### HU-C2.011 — Seleccionar modo Raw Script en ROS Messaging Screen

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario; X secundario.
**Superficie UI:** popup-ros-messaging-screen (dropdown modo).
**Gesto canonico:** seleccion en dropdown.

**Historia:**
> Como ingeniero de runtime, quiero seleccionar modo `Raw Script` para ejecutar un script arbitrario contra el ROS Master cuando los otros modos no alcanzan.

**Contexto de negocio:**
`Raw Script` es el escape hatch. Para casos donde `Publish`/`Subscribe`/`Service` no cubren la complejidad (p.ej. action clients multi-step, sincronizacion manual entre topicos, TF broadcasts), el raw script permite ejecutar codigo ROS nativo directamente. Costo: pierde la estructura semantica.

**Criterios de aceptacion:**
- **Dado** que selecciono `Raw Script`, **cuando** persisto, **entonces** `rosConfig.mode = "RawScript"`.
- **Dado** que el modo es `Raw Script`, **cuando** el proceso ejecuta, **entonces** el mediador ejecuta el script sobre su runtime ROS (hipotesis).
- **Dado** que estoy en modo Raw Script, **cuando** miro los campos: **pregunta abierta** — ¿`Topic` y `Data type` siguen siendo relevantes? ¿el textarea `Message` se convierte en editor de script?

**Reglas y restricciones:**
- Modo no observado en ejecucion.
- Semantica exacta: **pregunta abierta** (§11.6 doc fuente).
- Seguridad: ejecutar scripts arbitrarios requiere confianza en el mediador.

**Modelo de datos tocado:**
- `process.rosConfig.mode = "RawScript"` — persistente.
- `process.rosConfig.script` — string (hipotesis) — persistente.

**Dependencias:**
- Bloqueada por: HU-C2.004.
- Etiqueta: `requires-clarification`.

**Integraciones:**
- Mediador WebSocket (evaluador de scripts).

**Notas de evidencia:**
- Fuente: §1, §2.2, §4, §11.6.
- Clase de afirmacion: declarado + hipotesis.

**Prioridad:** W.
**Tamano:** M.
**Etiquetas:** [runtime, ros, raw-script, requires-clarification].

---

### HU-C2.012 — Persistir configuracion ROS con boton Update

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; P (persistencia) secundario.
**Superficie UI:** popup-ros-messaging-screen (boton `Update`).
**Gesto canonico:** clic en `Update`.

**Historia:**
> Como ingeniero de runtime, quiero confirmar la configuracion ROS con el boton `Update` para que los campos se persistan en el proceso.

**Contexto de negocio:**
El boton `Update` es el confirm del popup. Patron heredado del popup Auto Format de EPICA-10. Discrimina entre la edicion tentativa (cambios en los campos sin confirmar) y el estado persistido del modelo.

**Criterios de aceptacion:**
- **Dado** que edite `Topic`, `Data type` y/o `Message`, **cuando** hago clic en `Update`, **entonces** los cuatro campos persisten en `process.rosConfig` y el popup se cierra.
- **Dado** que edite campos pero cierro sin `Update`, **cuando** el popup se cierra: **pregunta abierta** — ¿se descartan los cambios? ¿se pide confirmacion?
- **Dado** que hago `Update`, **cuando** el popup cierra, **entonces** el foco vuelve al canvas y los badges del proceso permanecen (si category=ROS).

**Reglas y restricciones:**
- `Update` es el unico confirm explicito.
- No hay autosave de los campos.

**Modelo de datos tocado:**
- `process.rosConfig.*` — todos los campos — persistente.

**Dependencias:**
- Bloqueada por: HU-C2.004.

**Integraciones:**
- Persistencia del modelo (EPICA-30 Save/Load).

**Notas de evidencia:**
- Fuente: §2.2 fila `Update`.
- Clase de afirmacion: observado.

**Prioridad:** W.
**Tamano:** XS.
**Etiquetas:** [runtime, ros, persistencia, popup-inline].

---

### HU-C2.013 — Ver badges PYTHON + camara + :::ROS sobre proceso

**Actor primario:** IR.
**Actores secundarios:** RV (revisor — los ve al leer el modelo).
**Tipo:** opcloud-ui.
**Nivel categorico:** V (render) primario.
**Superficie UI:** canvas — borde superior-derecho de la elipse del proceso.
**Gesto canonico:** ninguno (render declarativo).

**Historia:**
> Como ingeniero de runtime, quiero ver tres badges (`PYTHON`, camara, `:::ROS`) flotando sobre el proceso de categoria ROS para identificar de un vistazo que ejecuta codigo externo.

**Contexto de negocio:**
Los badges son anotaciones de runtime: comunican en la lectura rapida que el proceso no es puro OPM sino que interactua con un sistema externo. Son distintos del sufijo `` (que marca "computacional en general"): los badges anaden "computacional publicando por ROS". Aparecen solo para `category=ROS`; ausentes en `Predefined`/`User Defined`.

**Criterios de aceptacion:**
- **Dado** que un proceso tiene `category=ROS`, **cuando** lo renderizo, **entonces** aparecen tres badges contiguos en gris oscuro sobre fondo transparente, adyacentes al borde superior-derecho de la elipse.
- **Dado** que cambio la categoria a `MQTT`, **cuando** se rerenderiza, **entonces** los badges cambian (`:::ROS` → `:::MQTT`, hipotesis) — ver EPICA-C0.
- **Dado** que los badges estan presentes, **cuando** miro el layout, **entonces** NO redimensionan la elipse ni mueven el nombre.
- **Dado** que cambio el proceso a no-computacional, **cuando** se rerenderiza, **entonces** los badges desaparecen junto con el sufijo ``.

**Reglas y restricciones:**
- Badges flotan fuera del contorno (no parte del nombre ni del estereotipo).
- Pregunta abierta (§11.1 doc fuente): ¿los badges aparecen sobre `Message Publishing ` o solo sobre `Message Creating `? Frame 36 los muestra solo sobre el proceso con codigo Python literal.
- Convencion observada transversal a videos Advance 8–10 (MQTT, ROS, URL comparten patron).
- Brecha SSOT R-1: la SSOT visual no regula los badges. [JOYAS §1]

**Modelo de datos tocado:**
- `process.runtimeBadges` — array derivado de `category` — transitorio.

**Dependencias:**
- Bloqueada por: HU-C2.001.

**Integraciones:**
- Renderer (JointJS).
- SSOT visual (brecha R-1).

**Notas de evidencia:**
- Fuente: §2.1 primera fila, §3.5 paso 3, §9.1, frame 36, §11.1.
- Clase de afirmacion: observado + ambiguedad sobre scope.
- Etiqueta: `requires-clarification` (sobre que procesos exactamente reciben los badges).
- Evidencia visual: JOYAS §1 render de proceso y anotaciones externas.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [runtime, ros, render, badges, anotacion-externa].

---

### HU-C2.014 — Editar codigo Python/JS del proceso en editor Monaco

**Actor primario:** IR.
**Actores secundarios:** AD (autor de dominio — codigo de dominio).
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; K (codigo es parte del modelo) secundario.
**Superficie UI:** modal-editor-monaco (tema `Tomorrow-Night-Eighties`).
**Gesto canonico:** clic en boton "abrir editor" del halo del proceso + edicion de linea 1.

**Historia:**
> Como ingeniero de runtime, quiero editar el cuerpo de la funcion del proceso en el editor Monaco para definir el payload ROS en funcion de los alias de objetos conectados.

**Contexto de negocio:**
El editor Monaco es la superficie de codigo canonica de OPCloud (hereda de EPICA-B2 user-defined functions). Para ROS se usa igual que para User Defined: el modelador edita la linea 1 (el `return`) y deja intactas las runtime variables inyectadas. La linea 1 define como se construye el payload a partir de los alias disponibles.

**Criterios de aceptacion:**
- **Dado** que tengo un proceso ROS con code, **cuando** abro el halo y hago clic en el boton "editor", **entonces** se abre el editor Monaco modal.
- **Dado** que el editor esta abierto, **cuando** miro la linea 1, **entonces** veo el `return` editable con syntax highlighting.
- **Dado** que edito la linea 1 (p.ej. cambio `c*1.0174` por `c*Math.PI/180`), **cuando** hago clic `Update`, **entonces** el codigo persiste y el tooltip de preview (HU-C2.016) refleja el cambio.
- **Dado** que hago clic `Cancel`, **cuando** cierro, **entonces** los cambios se descartan.
- **Dado** que cambio el tema del editor, **cuando** selecciono otro en el dropdown, **entonces** el cambio es visual, no afecta el codigo.

**Reglas y restricciones:**
- Default del editor: tema `Tomorrow-Night-Eighties`.
- Solo la linea 1 es editable; lineas 3–22 son runtime variables (ver HU-C2.015).
- No hay linter embebido (**pregunta abierta**).

**Modelo de datos tocado:**
- `process.code` — string (cuerpo de funcion) — persistente.

**Dependencias:**
- Bloqueada por: HU-C2.001.
- Relaciona: EPICA-B2 (user-defined functions — mismo editor).

**Integraciones:**
- Editor Monaco embebido.
- Tooltip de preview (HU-C2.016).

**Notas de evidencia:**
- Fuente: §2.3, §3.4, frame 19, §9.10.
- Clase de afirmacion: observado.

**Prioridad:** W.
**Tamano:** M.
**Etiquetas:** [runtime, ros, editor-monaco, codigo, alias].

---

### HU-C2.015 — Ver runtime variables inyectadas read-only en editor

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; K secundario.
**Superficie UI:** modal-editor-monaco (lineas 3–22 con comentario `Don't edit or change`).
**Gesto canonico:** ninguno (render declarativo).

**Historia:**
> Como ingeniero de runtime, quiero ver el scope inyectado por OPCloud (alias, aliasArr, userInput, updateValue) listado abajo del codigo editable para saber que variables puedo usar en el return.

**Contexto de negocio:**
El scope inyectado es el contrato entre el modelo OPM y el codigo. Cada alias de objeto conectado se materializa como variable (`let c = 1; let Counter = 1; let sd = ...`). El modelador lee esta seccion para saber que nombres puede usar sin tener que inferirlos del diagrama.

**Criterios de aceptacion:**
- **Dado** que el editor Monaco esta abierto, **cuando** miro debajo de la linea 1, **entonces** veo un comentario `/*Don't edit or change the lines below here*/` seguido de declaraciones de variables.
- **Dado** que el proceso tiene objetos conectados con alias `c`, `sd`, `cc`, **cuando** miro las variables, **entonces** veo `let c = 1;`, `let sd = ...;`, `let cc = ...;` mas `aliasArr`, `userInput`, `updateValue`.
- **Dado** que intento editar una linea bloqueada: **pregunta abierta** — ¿el editor lo rechaza visualmente o acepta pero revierte al Update?
- **Dado** que agrego un nuevo objeto conectado con alias `z`, **cuando** reabro el editor, **entonces** aparece `let z = ...;` en el scope.

**Reglas y restricciones:**
- `aliasArr`: array de objetos `{alias, value, instances}`.
- `userInput`: placeholder para input del usuario (EPICA-B5).
- `updateValue(alias, value)`: hook para mutar valores desde el codigo.
- Una variable por alias declarado.

**Modelo de datos tocado:**
- `process.runtimeScope` — derivado de objetos conectados — transitorio.

**Dependencias:**
- Bloqueada por: HU-C2.014.
- Relaciona: HU-C2.017 (rotulo con alias), EPICA-B2 (misma semantica).

**Integraciones:**
- Editor Monaco (line decorations read-only).

**Notas de evidencia:**
- Fuente: §2.3 frame 19.
- Clase de afirmacion: observado.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [runtime, ros, editor-monaco, alias, scope].

---

### HU-C2.016 — Ver tooltip amarillo con preview de codigo al hover

**Actor primario:** IR.
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; U secundario.
**Superficie UI:** canvas — tooltip amarillo flotante.
**Gesto canonico:** hover sobre la elipse del proceso.

**Historia:**
> Como modelador, quiero ver un tooltip amarillo con el `return` del codigo al pasar el mouse sobre un proceso computacional para leer la logica sin abrir el editor.

**Contexto de negocio:**
El tooltip es un read-only preview del codigo para inspeccion rapida. Diferencial sobre OPCloud: evita que el usuario tenga que abrir el editor solo para ver "que hace este proceso". Particularmente util en modelos densos donde hay muchos procesos con codigo.

**Criterios de aceptacion:**
- **Dado** que un proceso tiene codigo asociado (category computacional con code), **cuando** hago hover sobre la elipse, **entonces** aparece un globo pastel amarillo con el `return` del codigo.
- **Dado** que el tooltip esta visible, **cuando** miro, **entonces** tiene syntax highlighting simple (strings en verde, operadores en negro).
- **Dado** que muevo el mouse fuera de la elipse, **cuando** el hover termina, **entonces** el tooltip desaparece.
- **Dado** que el tooltip esta visible, **cuando** intento interactuar, **entonces** es read-only (no es el editor).

**Reglas y restricciones:**
- Fondo: amarillo pastel / crema.
- Texto: negro con highlighting simple.
- No-modal, read-only.
- Brecha SSOT R-11: la SSOT visual no regula este tooltip.

**Dependencias:**
- Bloqueada por: HU-C2.014.

**Integraciones:**
- Renderer del canvas.

**Notas de evidencia:**
- Fuente: §2.1 fila tooltip, §3.3, §9.9, frame 13.
- Clase de afirmacion: observado.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [runtime, ros, tooltip, preview-codigo].

---

### HU-C2.017 — Usar rotulo extendido `Nombre [unidad] {alias}` en objeto

**Actor primario:** IR.
**Actores secundarios:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; K (campos `unit`, `alias`) secundario.
**Superficie UI:** canvas — primera linea del rectangulo del objeto.
**Gesto canonico:** ninguno (render declarativo derivado de datos del objeto).

**Historia:**
> Como ingeniero de runtime, quiero nombrar objetos como `Counter [m] {c}` para exponer unidad y alias en una sola linea del rotulo, consistente con `b1` y consumible desde el codigo.

**Contexto de negocio:**
El patron `<Nombre> [<unidad>] {<alias>}` es el rotulo dual de los objetos conectados a procesos computacionales. La unidad `[m]` aporta semantica fisica (metros); el alias `{c}` es el identificador sintactico que se usa en el codigo del proceso. Consistente con EPICA-B1. Brecha SSOT R-5.

**Criterios de aceptacion:**
- **Dado** que un objeto tiene `name="Counter"`, `unit="m"`, `alias="c"`, **cuando** se renderiza, **entonces** la primera linea del rectangulo muestra `Counter [m] {c}`.
- **Dado** que el nombre es corto, **cuando** se renderiza, **entonces** `nombre + [unidad] + {alias}` caben en una sola linea.
- **Dado** que el nombre es largo, **cuando** se renderiza, **entonces** OPCloud apila los modifiers (observacion consistente con `b1`).
- **Dado** que el objeto no tiene unidad ni alias, **cuando** se renderiza, **entonces** solo aparece `<Nombre>` sin corchetes ni llaves.
- **Dado** que el codigo del proceso usa `c`, **cuando** se ejecuta, **entonces** el valor actual del objeto con `alias=c` se inyecta como variable.

**Reglas y restricciones:**
- Convencion observada: `[]` para unidad, `{}` para alias.
- Primera linea del rectangulo; no partir en dos salvo que no quepa.
- Brecha SSOT R-5: la SSOT visual no regula este rotulo extendido.

**Modelo de datos tocado:**
- `object.unit` — `string | null` — persistente.
- `object.alias` — `string | null` — persistente.

**Dependencias:**
- Relaciona: EPICA-B1 (rotulo introducido alli), HU-C2.014, HU-C2.015.

**Integraciones:**
- Renderer (formatting del rotulo).
- Editor Monaco (alias se convierte en variable).
- Parser de topicos (HU-C2.006).

**Notas de evidencia:**
- Fuente: §2.1 fila `Nombre extendido`, §9.3, frames 13, 42, 45.
- Clase de afirmacion: observado + consistente con `b1`.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [runtime, ros, rotulo, alias, unidad, render].

---

### HU-C2.018 — Ejecutar simulacion Sync Execute con ROS Master en vivo

**Actor primario:** IR.
**Actores secundarios:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** X primario; K (motor de ejecucion) secundario; V (canvas en modo simulacion) secundario.
**Superficie UI:** barra-simulacion (play ▶ + Sync Execute).
**Gesto canonico:** clic en play con modo `Sync Execute` activo y ROS Master + WebSocket + Turtlesim corriendo.

**Historia:**
> Como ingeniero de runtime, quiero ejecutar el modelo en modo Sync Execute para que la simulacion conceptual quede sincronizada paso-a-paso con el robot real (Turtlesim) y pueda ver la espiral dibujandose en tiempo real.

**Contexto de negocio:**
El Sync Execute es el modo taxativo recomendado para ROS. Cada evaluacion de `Message Creating ` + `Message Publishing ` se ejecuta sincronicamente: OPCloud espera que el mediador confirme la entrega del mensaje al ROS Master antes de avanzar al siguiente paso. Async rompe la sincronia visual con el robot (narrador: "please use the synchronized execution in order to see it in real time").

**Criterios de aceptacion:**
- **Dado** que ROS Master, WebSocket mediador y Turtlesim estan corriendo, y el modelo esta listo, **cuando** hago clic en play con Sync Execute activado, **entonces** la simulacion arranca y despacha mensajes al ROS Master por `/turtle1/cmd_vel`.
- **Dado** que la simulacion avanza, **cuando** observo Turtlesim, **entonces** veo la tortuga moverse siguiendo los mensajes (arco, espiral).
- **Dado** que la simulacion avanza, **cuando** observo el canvas OPCloud, **entonces** veo los overlays transitorios: pin azul sobre estado actual (HU-C2.019), dots verde-oliva sobre enlaces activos (HU-C2.020), valor JSON-like en rectangulo-valor (HU-C2.021).
- **Dado** que la barra de simulacion esta activa, **cuando** la edicion de toolbar superior se oculta, **entonces** el canvas queda en modo simulacion sin manijas.
- **Dado** que la simulacion termina, **cuando** el ultimo paso se completa, **entonces** la tortuga ha trazado la espiral completa y los estados finales (`Spiral = complete`, `Drawing Ability = easy`) quedan marcados con pin azul persistente.

**Reglas y restricciones:**
- Sync Execute es el modo recomendado para ROS; Async funciona pero desincroniza (**pregunta abierta** sobre el caso Async).
- Precondiciones out-of-band: ROS Master, WebSocket, Turtlesim corriendo (§3.1 doc fuente).
- La ventana Turtlesim es externa a OPCloud; el usuario la coloca manualmente.
- Entrar en simulacion cambia de capa operativa, no de vista: mismo OPD, distintos controles (§3.6).

**Modelo de datos tocado:**
- `simulation.mode = "sync"` — transitorio.
- `simulation.overlays` — transitorio (pins, dots, valores).
- Estado final persiste: `object.currentStateRef`, `object.valueState.displayText`.

**Dependencias:**
- Bloqueada por: HU-C2.001, HU-C2.002, HU-C2.005 (Publish), HU-C2.006, HU-C2.007, HU-C2.008, HU-C2.014.
- Relaciona: EPICA-B1 (Sync/Async), EPICA-B0 (simulacion conceptual).

**Integraciones:**
- Mediador WebSocket ROS.
- ROS Master externo.
- Turtlesim externo.
- Render del canvas en modo simulacion.
- OPL pane (HU-C2.023).

**Notas de evidencia:**
- Fuente: §3.1, §3.6, §3.7, frames 48, 53, 55.
- Transcripcion: "please use the synchronized execution in order to see it in real time".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** W.
**Tamano:** L.
**Etiquetas:** [runtime, ros, simulacion, sync-execute, turtlesim].

---

### HU-C2.019 — Ver pin azul en gota sobre estado actual del objeto

**Actor primario:** IR.
**Actores secundarios:** RV, IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** V (render) primario; L (lente estado actual) secundario.
**Superficie UI:** canvas — rectangulo de estado activo dentro de objeto con estados.
**Gesto canonico:** ninguno (overlay declarativo durante simulacion).

**Historia:**
> Como ingeniero de runtime, quiero ver un pin azul en forma de gota sobre el estado que el motor considera "actual" para saber de un vistazo en que condicion esta cada objeto durante la simulacion.

**Contexto de negocio:**
El pin azul es el render grafico de la designacion dinamica "current state". Distinto de las designaciones estaticas `Initial`/`Final`/`Default` (que se escriben dentro del rectangulo). Su correlato textual en OPL es la formula `X of Y is currently at state Z.`

**Criterios de aceptacion:**
- **Dado** que un objeto tiene estados y la simulacion esta corriendo, **cuando** el motor marca un estado como "actual", **entonces** aparece un pin celeste/azul en forma de gota invertida (~10 px alto) anclado al borde superior-izquierdo del rectangulo del estado.
- **Dado** que el objeto tiene multiples estados, **cuando** miro, **entonces** veo exactamente un pin (no varios): solo el actual.
- **Dado** que el estado actual cambia durante la simulacion, **cuando** ocurre la transicion, **entonces** el pin migra al nuevo estado.
- **Dado** que la simulacion termina, **cuando** vuelvo al modo edicion: **pregunta abierta** — ¿el pin persiste como marcador de "ultimo valor corrido" o se resetea?
- **Dado** que un estado tiene designacion `Initial`/`Final`/`Default`, **cuando** tambien es el actual, **entonces** el pin coexiste sin deformar el rectangulo.

**Reglas y restricciones:**
- Uno y solo un pin por objeto con estados.
- Ancla: borde superior-izquierdo del rectangulo del estado.
- Forma: gota invertida / lagrima con punta hacia abajo, cuerpo redondeado, relleno solido azul/celeste.
- Exclusivo de modo simulacion.
- Brecha SSOT R-2: la SSOT visual no regula el pin azul.

**Modelo de datos tocado:**
- `object.currentStateRef` — ID de estado — transitorio durante simulacion, persiste post-simulacion (observado en §3.9).
- `simulation.overlays.currentStatePins` — transitorio.

**Dependencias:**
- Bloqueada por: HU-C2.018.
- Relaciona: EPICA-13 (estados).

**Integraciones:**
- Renderer (JointJS).
- OPL pane (HU-C2.023).
- SSOT visual (brecha R-2).

**Notas de evidencia:**
- Fuente: §2, §3.8 pin azul, §9.4, frames 58, 61.
- Clase de afirmacion: observado.
- Preguntas abiertas: §11.2 doc fuente (persistencia entre corridas).

**Prioridad:** W.
**Tamano:** M.
**Etiquetas:** [runtime, ros, overlay, pin-azul, estado-actual, render].

---

### HU-C2.020 — Ver dots verde-oliva sobre enlaces activos en simulacion

**Actor primario:** IR.
**Actores secundarios:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; L secundario.
**Superficie UI:** canvas — punto medio de enlaces activos.
**Gesto canonico:** ninguno (overlay declarativo durante simulacion).

**Historia:**
> Como ingeniero de runtime, quiero ver dots verde-oliva solidos sobre los enlaces que participan del paso actual de simulacion para entender cuales conexiones estan activas ahora.

**Contexto de negocio:**
Los dots verdes son el marcador "token en transito" / "este enlace esta activo ahora". Complementa el pin azul (estado actual de objeto) con la semantica dual de flujo de ejecucion. Clave para entender la animacion paso-a-paso.

**Criterios de aceptacion:**
- **Dado** que la simulacion esta en curso, **cuando** un proceso consume/produce a traves de un enlace, **entonces** aparece un dot solido (~6 px diametro) color verde-oliva sobre el punto medio del enlace.
- **Dado** que miro los dots, **cuando** comparo con la piruleta normativa del edit mode: **brecha SSOT R-3** — visualmente indistinguibles si se exporta SVG estatico fuera de modo simulacion.
- **Dado** que el paso de simulacion avanza, **cuando** otros enlaces se activan, **entonces** los dots migran o aparecen en los nuevos enlaces.
- **Dado** que pauso o detengo la simulacion, **cuando** el estado es pause/stop, **entonces** los dots desaparecen (§3.8 doc fuente, frame 58 no los muestra).
- **Dado** que quiero inferir animacion vs parpadeo estatico: **pregunta abierta** (§11.3 doc fuente).

**Reglas y restricciones:**
- Posicion: punto medio exacto del enlace (no desplazado).
- Color: verde-oliva, no verde puro.
- Relleno: solido (distinto del circulo hueco abierto de `b1 §3.3` que marca "punto de lectura de valor").
- Solo en modo simulacion.
- Brecha SSOT R-3: ambiguedad con piruleta normativa.

**Modelo de datos tocado:**
- `simulation.overlays.activeLinkDots` — array `{linkId, phase}` — transitorio.

**Dependencias:**
- Bloqueada por: HU-C2.018.

**Integraciones:**
- Renderer (JointJS).
- SSOT visual (brecha R-3).

**Notas de evidencia:**
- Fuente: §3.8 dots verde-oliva, §9.5, frames 53, 55.
- Clase de afirmacion: observado + animacion no capturada.
- Preguntas abiertas: §11.3 (animacion vs parpadeo).

**Prioridad:** W.
**Tamano:** M.
**Etiquetas:** [runtime, ros, overlay, dots, enlaces-activos, render].

---

### HU-C2.021 — Ver valor estructurado multilinea en rectangulo-valor

**Actor primario:** IR.
**Actores secundarios:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario.
**Superficie UI:** canvas — rectangulo-valor dentro de objeto.
**Gesto canonico:** ninguno (render declarativo durante simulacion).

**Historia:**
> Como ingeniero de runtime, quiero que el rectangulo-valor del objeto aloje el string JSON-like retornado por el codigo (p.ej. `linear:{...},angular:{...}`) en varias lineas para ver que payload se esta enviando al ROS Master.

**Contexto de negocio:**
El rectangulo-valor es la misma primitiva usada en `b1` para escalares, pero aqui aloja un string multilinea de 2–4 lineas. Es el unico rincon del canvas donde el payload vive visualmente. Brecha SSOT R-4.

**Criterios de aceptacion:**
- **Dado** que un objeto con rectangulo-valor recibe un string multilinea (retornado por el codigo), **cuando** se renderiza, **entonces** el rectangulo crece verticalmente para alojar el contenido.
- **Dado** que el string tiene contenido JSON-like (`linear:{x:2.0, y:0.0, z:0.0},angular:{x:0.0, y:0.0, z:3.0522}`), **cuando** se renderiza, **entonces** el texto fluye libremente sin parsing ni formatting inteligente (espacios irregulares se preservan).
- **Dado** que el string tiene muchas lineas: **pregunta abierta** — ¿hay limite? ¿trunca con `…`? ¿hay scroll? (§11.4 doc fuente).
- **Dado** que el contorno oliva del rectangulo-valor se mantiene, **cuando** el contenido cambia, **entonces** el color/estilo del contorno es invariante (solo el tamano varia).
- **Dado** que la simulacion termina, **cuando** vuelvo al modo edicion: **pregunta abierta** — ¿el valor persiste o se resetea a `value`?

**Reglas y restricciones:**
- Parser: texto plano, sin JSON strict.
- El alto del rectangulo es flexible; el ancho se mantiene.
- No hay scroll observado.
- Brecha SSOT R-4: la SSOT visual no regula valores multilinea.

**Modelo de datos tocado:**
- `object.valueState.displayText` — string (puede ser multilinea) — transitorio durante simulacion.

**Dependencias:**
- Bloqueada por: HU-C2.018.
- Relaciona: EPICA-B1 (rectangulo-valor introducido alli para escalares).

**Integraciones:**
- Renderer (JointJS — wrap / resize vertical).
- SSOT visual (brecha R-4).

**Notas de evidencia:**
- Fuente: §3.7 paso 2, §3.8 valor estructurado, §9.6, frame 53.
- Clase de afirmacion: observado.
- Preguntas abiertas: §11.4.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [runtime, ros, overlay, valor-json, render].

---

### HU-C2.022 — Sincronizar modelo OPM con ventana externa Turtlesim/RViz

**Actor primario:** IR.
**Actores secundarios:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** X primario; V secundario.
**Superficie UI:** ventana externa del SO (no controlada por OPCloud).
**Gesto canonico:** ninguno (sincronia implicita via WebSocket + ROS Master).

**Historia:**
> Como ingeniero de runtime, quiero que mi modelo OPM dispare acciones en el robot real o simulado (Turtlesim, Gazebo, RViz) para validar que la semantica del modelo corresponde al comportamiento fisico observable.

**Contexto de negocio:**
La integracion cierra el ciclo entre spec (modelo OPM) y ejecucion (robot). Turtlesim es el hello-world de ROS; Gazebo y RViz son los siguientes escalones. OPCloud no controla las ventanas externas (posicion, visibilidad, ciclo de vida) — el usuario las maneja manualmente. La sincronia es via mensajes ROS.

**Criterios de aceptacion:**
- **Dado** que Turtlesim esta corriendo y recibo mensajes por `/turtle1/cmd_vel`, **cuando** mi modelo publica `linear:{x:2.0,...},angular:{z:3.0522}`, **entonces** la tortuga se mueve siguiendo ese comando (arco).
- **Dado** que el robot es RViz o Gazebo en lugar de Turtlesim, **cuando** el topico/data type son compatibles, **entonces** el comportamiento observable es el mismo: el mensaje llega al nodo externo y el robot responde.
- **Dado** que quiero visualizar TF frames (transformaciones entre coordinate frames), **cuando** el topico es `/tf`, **entonces** el mensaje se propaga (**pregunta abierta**: ¿OPCloud lo renderiza en el canvas o solo pasa-a-traves?).
- **Dado** que la ventana externa esta minimizada, **cuando** la simulacion corre, **entonces** los mensajes siguen llegando al ROS Master; el render externo es responsabilidad del nodo.

**Reglas y restricciones:**
- OPCloud no administra las ventanas externas (posicion, visibilidad).
- La sincronia es per-mensaje, no per-paso completo.
- Compatibilidad con Gazebo/RViz: **pregunta abierta** — no se observa en los frames.
- TF frames: mencionados como uso tipico de ROS pero no vistos en el ejemplo espiral.

**Dependencias:**
- Bloqueada por: HU-C2.018.
- Etiqueta: `requires-clarification` (sobre Gazebo/RViz/TF).

**Integraciones:**
- ROS Master + WebSocket mediador.
- Nodo externo (Turtlesim, Gazebo, RViz, otros).

**Notas de evidencia:**
- Fuente: §2.7, §3.7 paso 3, frames 53, 55.
- Clase de afirmacion: observado (Turtlesim) + hipotesis (Gazebo/RViz/TF).

**Prioridad:** W.
**Tamano:** L.
**Etiquetas:** [runtime, ros, turtlesim, rviz, simulacion-externa].

---

### HU-C2.023 — Ver linea OPL dinamica `is currently at state X`

**Actor primario:** RV (revisor).
**Actores secundarios:** IR, IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** L (lente OPL) primario.
**Superficie UI:** opl-pane.
**Gesto canonico:** ninguno (actualizacion automatica durante/post simulacion).

**Historia:**
> Como lector del modelo, quiero ver en el OPL pane la oracion `Drawing Ability of Turtlesim ROS User is currently at state easy.` para entender el estado actual de los objetos sin tener que ver los pins azules en el canvas.

**Contexto de negocio:**
El verbo compuesto `is currently at state` es el correlato textual del pin azul (HU-C2.019). OPL dinamico es la promesa de bimodalidad OPM llevada a runtime: el diagrama no es solo spec estatica, es lente de ejecucion. La linea aparece solo durante/despues de simulacion; las sentencias estaticas del modelo (declaraciones iniciales) permanecen.

**Criterios de aceptacion:**
- **Dado** que la simulacion corre y un objeto tiene estado actual `easy`, **cuando** consulto el OPL pane, **entonces** aparece `Drawing Ability of Turtlesim ROS User is currently at state easy.`
- **Dado** que otro objeto con estados cambia de estado, **cuando** la simulacion avanza, **entonces** una nueva linea dinamica aparece o la existente se actualiza.
- **Dado** que la simulacion termina, **cuando** las lineas dinamicas se asentan, **entonces** persisten como "ultimo valor corrido" (§3.9 doc fuente).
- **Dado** que las sentencias estaticas (declaraciones 1–5 del modelo) existen, **cuando** aparecen las dinamicas, **entonces** las estaticas permanecen sin deformacion.

**Reglas y restricciones:**
- Formato: `<Atributo> of <Objeto> is currently at state <estado>.`
- Verbo compuesto: `is currently at state`.
- Posicion: presumiblemente al final del OPL (**pregunta abierta**).
- Brecha SSOT R-2: la SSOT OPL no regula verbos dinamicos.

**Modelo de datos tocado:**
- Deriva de `object.currentStateRef` — transitorio.

**Dependencias:**
- Bloqueada por: HU-C2.018, HU-C2.019.

**Integraciones:**
- Motor OPL.
- OPL pane.

**Notas de evidencia:**
- Fuente: §3.8 pin azul (correlato OPL), §3.9, §7, frame 58.
- Clase de afirmacion: observado.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [runtime, ros, opl, lente, estado-actual].

---

### HU-C2.024 — Ejecutar en modo Headless Runner sin animacion de canvas

**Actor primario:** IR.
**Actores secundarios:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** X primario; U secundario.
**Superficie UI:** barra-simulacion (checkbox `Headless Runner`).
**Gesto canonico:** marcar checkbox + play.

**Historia:**
> Como ingeniero de runtime, quiero ejecutar el modelo en modo Headless para saltarme la animacion del canvas y correr mas rapido, conservando el efecto sobre el robot real.

**Contexto de negocio:**
Headless es performance: para corridas largas o batch, la animacion visual cuesta. Headless publica igual al ROS Master pero sin overlays en el canvas. Relevante para CI de robotica o para runs multiples (`Number Of Simulation Runs > 1`).

**Criterios de aceptacion:**
- **Dado** que marco `Headless Runner` y hago play, **cuando** la simulacion arranca, **entonces** el canvas no muestra overlays (no pins, no dots, no valores).
- **Dado** que headless esta activo, **cuando** Turtlesim esta corriendo, **entonces** los mensajes llegan igual al ROS Master y el robot dibuja.
- **Dado** que headless esta activo, **cuando** miro el OPL: **pregunta abierta** — ¿las lineas dinamicas aparecen igual o tambien se suprimen?
- **Dado** que termina la simulacion headless, **cuando** reviso, **entonces** los estados finales (`currentStateRef`, `valueState.displayText`) quedan persistidos.

**Reglas y restricciones:**
- Default: checkbox off (modo con animacion).
- Headless afecta solo el canvas; no afecta el despacho de mensajes.
- Interaccion con Sync vs Async: **pregunta abierta**.

**Modelo de datos tocado:**
- `simulation.headless` — boolean — transitorio.

**Dependencias:**
- Bloqueada por: HU-C2.018.

**Integraciones:**
- Motor de simulacion.
- Renderer (skip overlays).

**Notas de evidencia:**
- Fuente: §2.6, §9.11.
- Clase de afirmacion: observado (checkbox) + hipotesis (semantica exacta).

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [runtime, ros, headless, performance].

---

### HU-C2.025 — Abortar o reaccionar a caida del WebSocket mid-simulacion

**Actor primario:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** X primario; U (feedback) secundario.
**Superficie UI:** barra-simulacion + indicador conexion.
**Gesto canonico:** ninguno (reaccion automatica).

**Historia:**
> Como ingeniero de runtime, quiero que el sistema reaccione de forma predecible si el WebSocket cae durante la simulacion (abortar, pausar, retry) para no quedar en estado indefinido.

**Contexto de negocio:**
El WebSocket es un punto de falla critico. Sin el, ROS Master queda inalcanzable. La reaccion de OPCloud a la caida (abort / pause / retry) no esta definida en los frames observados. Narrador menciona que el "connection group" cambia de color al establecerse la conexion, pero no se observa la caida.

**Criterios de aceptacion:**
- **Dado** que la simulacion esta corriendo y el WebSocket cae, **cuando** el proximo mensaje intenta despacharse: **pregunta abierta** — ¿simulacion se aborta? ¿pausa con retry? ¿continua con error?
- **Dado** que el WebSocket se recupera, **cuando** se reconecta: **pregunta abierta** — ¿la simulacion reanuda?
- **Dado** que un mensaje fallo, **cuando** reviso feedback: **pregunta abierta** — ¿hay log visible? ¿banner de error?
- **Dado** que configure Port incorrecto, **cuando** arranco: **pregunta abierta** — ¿falla al inicio antes de publicar el primer mensaje?

**Reglas y restricciones:**
- Comportamiento no observado en frames (§4 doc fuente: "WebSocket no iniciado" declarado abierto, §11.7).
- Requiere definicion explicita para produccion (defaults conservadores: abortar + alert).

**Modelo de datos tocado:**
- `simulation.connectionState` — `"connected" | "disconnected" | "error"` — transitorio.

**Dependencias:**
- Bloqueada por: HU-C2.018.
- Etiqueta: `requires-clarification`.

**Integraciones:**
- Mediador WebSocket (deteccion de caida).
- UI de feedback.

**Notas de evidencia:**
- Fuente: §4 primera fila, §11.7.
- Clase de afirmacion: abierto.

**Prioridad:** W.
**Tamano:** M.
**Etiquetas:** [runtime, ros, error, websocket, requires-clarification].

---

### HU-C2.026 — Convertir tipos ROS std_msgs ↔ primitivas OPM

**Actor primario:** IR.
**Actores secundarios:** AD.
**Tipo:** opcloud-ui.
**Nivel categorico:** X primario; K (primitivas del kernel) secundario.
**Superficie UI:** no expuesta directamente (ocurre en el mediador WebSocket).
**Gesto canonico:** ninguno (implicito en configuracion `dataType` + code).

**Historia:**
> Como ingeniero de runtime, quiero que los tipos canonicos ROS (`std_msgs/String`, `std_msgs/Int32`, `geometry_msgs/Twist`, `sensor_msgs/LaserScan`) se conviertan automaticamente a/desde primitivas OPM (string, number, estado estructurado) sin tener que escribir codigo de serializacion manual.

**Contexto de negocio:**
ROS es fuertemente tipado; OPM tiene su propio sistema de atributos y valores. La conversion bidireccional es el pegamento entre los dos mundos. Sin conversion automatica, el modelador hace serialize/deserialize a mano en cada proceso — tedioso y propenso a error. La conversion deberia cubrir al menos los tipos `std_msgs` basicos.

**Criterios de aceptacion:**
- **Dado** que un proceso publica con `dataType=std_msgs/String` y el codigo retorna `"hello"`, **cuando** el mediador serializa, **entonces** el payload es un `std_msgs/String` valido con `data="hello"`.
- **Dado** que un proceso se suscribe a `std_msgs/Int32`, **cuando** llega un mensaje, **entonces** el codigo recibe un numero (no un objeto `{data: n}`).
- **Dado** que el tipo es compuesto (`geometry_msgs/Twist`), **cuando** el codigo retorna `linear:{x:2.0,...},angular:{z:...}`, **entonces** el mediador parsea la estructura correctamente (observado en el ejemplo espiral).
- **Dado** que el tipo es desconocido (custom msg de un paquete propio), **cuando** se intenta convertir: **pregunta abierta** — ¿falla, pasa bytes raw, pide schema?

**Reglas y restricciones:**
- Catalogo canonico ROS: `std_msgs`, `geometry_msgs`, `sensor_msgs`, `nav_msgs` (minimo).
- Conversion: responsabilidad del mediador WebSocket, no de OPCloud.
- Custom msgs: **pregunta abierta**.
- La gramatica del string retornado (JSON-like no estricto, §9.6 doc fuente) sugiere conversion ad-hoc, no deserializador universal.

**Modelo de datos tocado:**
- `process.rosConfig.dataType` — ver HU-C2.007.
- Convencion de retorno del codigo — implicita.

**Dependencias:**
- Bloqueada por: HU-C2.007, HU-C2.014.
- Etiqueta: `requires-clarification`.

**Integraciones:**
- Mediador WebSocket (nucleo de la conversion).
- Potencial validador futuro (catalogo de types).

**Notas de evidencia:**
- Fuente: §2.2 fila `Data type`, §3.7 paso 2 (string JSON-like), §7 integracion con `b2`.
- Clase de afirmacion: inferido + hipotesis.

**Prioridad:** W.
**Tamano:** L.
**Etiquetas:** [runtime, ros, tipos, conversion, std-msgs, requires-clarification].

---

### HU-C2.027 — Replay de rosbag sobre modelo OPM

**Actor primario:** IR.
**Actores secundarios:** IA (analista — usa replay para auditar).
**Tipo:** opcloud-ui.
**Nivel categorico:** X primario; L secundario.
**Superficie UI:** no existente actualmente — propuesta (control en barra de simulacion).
**Gesto canonico:** cargar rosbag + play.

**Historia:**
> Como ingeniero de runtime, quiero cargar un rosbag grabado y ejecutarlo contra un modelo OPM en modo Subscribe para ver como el modelo reacciona a una captura historica sin necesidad de robot en vivo.

**Contexto de negocio:**
Rosbag es el formato de grabacion/replay de ROS. Permite reproducir una sesion completa (mensajes de multiples topicos con timestamps) sin hardware. Usado en robotics para regression testing, debug offline, analisis post-mortem. Integrarlo a OPCloud convertiria el modelo OPM en un consumidor de datos historicos — gran valor para analisis.

**Criterios de aceptacion:**
- **Dado** que tengo un archivo `.bag` local, **cuando** lo cargo en OPCloud (UI propuesta), **entonces** OPCloud lo monta como fuente de mensajes.
- **Dado** que un proceso esta en modo Subscribe al topico `/turtle1/pose`, **cuando** corro el replay, **entonces** el proceso recibe los mensajes en el orden y timing original.
- **Dado** que ajusto la velocidad del replay, **cuando** corro, **entonces** los timestamps escalan proporcionalmente.
- **Dado** que el rosbag tiene topicos no cubiertos por el modelo, **cuando** corro: **pregunta abierta** — ¿se ignoran? ¿se listan? ¿generan warning?

**Reglas y restricciones:**
- Funcionalidad no observada en frames — HU aspiracional.
- Formato: `.bag` (binario) o `.bag2` (nuevo formato ROS 2).
- Integracion: potencialmente el mediador WebSocket o herramienta dedicada.

**Dependencias:**
- Bloqueada por: HU-C2.009 (Subscribe), HU-C2.018 (simulacion).
- Etiqueta: `requires-clarification` — funcionalidad no presente en OPCloud observado.

**Integraciones:**
- Parser de rosbag.
- Motor de simulacion (inyeccion de mensajes).

**Notas de evidencia:**
- Fuente: no observada en el doc fuente; HU derivada por completitud de la integracion ROS.
- Clase de afirmacion: hipotesis — NO esta en OPCloud observado; declarada por paridad con ecosistema ROS.

**Prioridad:** W.
**Tamano:** XL.
**Etiquetas:** [runtime, ros, rosbag, replay, requires-clarification].

---

### HU-C2.028 — Exportar modelo como ROS launch file ejecutable

**Actor primario:** IR.
**Actores secundarios:** AD.
**Tipo:** opcloud-ui.
**Nivel categorico:** X primario.
**Superficie UI:** no existente actualmente — propuesta (menu File → Export → ROS launch).
**Gesto canonico:** clic en export + guardar archivo.

**Historia:**
> Como ingeniero de runtime, quiero generar un archivo `.launch` o `.launch.py` desde el modelo OPM para arrancar todos los nodos ROS declarados sin tener que escribir el launch a mano.

**Contexto de negocio:**
El launch file de ROS orquesta el arranque de multiples nodos con parametros. Si el modelo OPM declara procesos como `Message Publishing ` con topicos, data types y dependencias, en principio podria derivarse un launch file que instancie nodos correspondientes. Diferencial potente: el modelo pasa de ser spec a ser artefacto ejecutable.

**Criterios de aceptacion:**
- **Dado** que un modelo tiene N procesos con `category=ROS` y topicos distintos, **cuando** exporto a launch, **entonces** se genera un archivo `.launch` con N declaraciones de nodo mas remapping de topicos.
- **Dado** que el modelo tiene `Turtlesim Node` como objeto ambiental externo, **cuando** exporto, **entonces** el launch incluye `<node pkg="turtlesim" type="turtlesim_node">` (hipotesis sobre mapeo).
- **Dado** que el modelo tiene parametros (unidades, alias iniciales), **cuando** exporto, **entonces** los parametros se propagan como `<param>` al nodo correspondiente.
- **Dado** que ejecuto el launch con `roslaunch`, **cuando** los nodos arrancan, **entonces** la topologia de comunicacion corresponde al modelo.

**Reglas y restricciones:**
- Funcionalidad no observada — HU aspiracional.
- Formato: `.launch` XML (ROS 1) o `.launch.py` (ROS 2).
- Mapeo objeto ambiental → nodo externo: convenio a definir.
- Generacion determinista: mismo modelo → mismo launch.

**Dependencias:**
- Bloqueada por: HU-C2.001 (category=ROS), HU-C2.006 (topicos).
- Etiqueta: `requires-clarification` — funcionalidad no presente en OPCloud observado.

**Integraciones:**
- Exportador (similar a EPICA-60/61 export PDF/SVG).
- Serializador XML o templating Python.

**Notas de evidencia:**
- Fuente: no observada en el doc fuente; HU derivada por completitud de la integracion ROS y por paralelo con otros exports.
- Clase de afirmacion: hipotesis — NO esta en OPCloud observado; declarada como diferencial potencial.

**Prioridad:** W.
**Tamano:** XL.
**Etiquetas:** [runtime, ros, launch-file, export, requires-clarification].

---

## Preguntas abiertas derivadas

- **Q C2.1** (§11.1): ¿Los badges `PYTHON`/camara/`:::ROS` aparecen tambien sobre `Message Publishing ` o solo sobre el proceso con codigo Python literal (`Message Creating `)? Afecta HU-C2.013.
- **Q C2.2** (§11.2): ¿El pin azul aparece desde el frame 1 de la simulacion o tras la primera evaluacion de estado? ¿Persiste entre corridas o se resetea a `Default`? Afecta HU-C2.019.
- **Q C2.3** (§11.3): ¿Los dots verdes viajan animadamente sobre la linea o parpadean estaticos en el punto medio? Requiere video frame-a-frame. Afecta HU-C2.020.
- **Q C2.4** (§11.4): ¿El rectangulo-valor con string multilinea tiene limite de lineas/caracteres? ¿Trunca con `…`? ¿Scroll? Afecta HU-C2.021.
- **Q C2.5** (§11.5): Modo `Subscribe` — ¿como se renderiza el proceso que escucha un topico? ¿Dots entrantes desde un objeto virtual "ROS Master"? Afecta HU-C2.009.
- **Q C2.6** (§11.6): Modo `Raw Script` — ¿substituye completamente `Topic`/`Data type`/`Message` por un script libre? ¿El textarea `Message` se convierte en editor de script? Afecta HU-C2.011.
- **Q C2.7** (§11.7): ¿Que pasa cuando el WebSocket cae mid-simulacion? Abort / pause / retry / continue. Afecta HU-C2.025.
- **Q C2.8** (§11.8): ¿El dot negro solido del borde sur de `Spiral Drawing` (frame 1, 48) es un punto de origen de enlace visible en edicion, distinto del dot verde-oliva de simulacion? Brecha SSOT R-10.
- **Q C2.9** (§11.9): ¿El alias en el topico (`/{a}/cmd_vel`) admite expresiones (`{a+1}`, funciones) o solo identificadores simples? Afecta HU-C2.006.
- **Q C2.10** (§11.10): Interaccion Turtlesim con simulacion `Async` — ¿la tortuga dibuja caoticamente o el WebSocket serializa? Transcripcion pide explicitamente Sync. Afecta HU-C2.018, HU-C2.024.
- **Q C2.11** (§11.11): ¿El archivo XLSX descargado en modo ROS incluye los mensajes publicados como filas? No observado. Relaciona con EPICA-B1.
- **Q C2.12**: Conversion de tipos custom ROS (mensajes de paquetes propios) — ¿como se declaran? ¿OPCloud pide schema? Afecta HU-C2.026.
- **Q C2.13**: ¿Que campos de la config `rosConfig` se preservan al cambiar de categoria `ROS` → otra y volver? Afecta HU-C2.001.
- **Q C2.14**: ¿El sistema soporta action clients ROS (long-running goals con feedback)? Tipico de manipuladores / navegacion. No observado.
- **Q C2.15**: ¿TF frames tienen render dedicado en el canvas o solo pasan-a-traves como mensajes? Afecta HU-C2.022.
- **Q C2.16**: Headless vs OPL pane — ¿las lineas dinamicas del OPL se suprimen tambien en headless? Afecta HU-C2.024.

## Referencias cruzadas

- **Doc fuente:** `opcloud-reverse/c2-runtime-ros.md`.
- **Fuente normativa:** `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es`.
- **Evidencia OPCloud:** `JOYAS.md`, `assets/svg/`, `decompiled/`, `sandbox-data/`.
- **Hermanas de la familia runtime:**
  - `EPICA-C0` (`c0-runtime-mqtt.md`) — MQTT comparte el grupo WebSocket en Settings y el patron de badges.
  - `EPICA-C1` (`c1-runtime-urls.md`) — URLs externas, mismo patron de anotacion runtime.
- **Dependencias upstream:**
  - `EPICA-B1` (`b1-simulation-computational.md`) — proceso computacional base, sufijo ``, rectangulo-valor, barra de simulacion.
  - `EPICA-B2` (`b2-simulation-user-functions.md`) — editor Monaco, scope inyectado con alias.
  - `EPICA-B0` (`b0-simulation-conceptual.md`) — capa operativa simulacion, OPD tree marca SD.
  - `EPICA-B5` (`b5-simulation-user-input.md`) — variable `userInput` inyectada.
- **Dependencias transversales:**
  - `EPICA-80` (config user/org) — freeze de settings WebSocket por admin.
  - `EPICA-50` (OPL pane) — linea dinamica `is currently at state X`.
  - `EPICA-13` (canvas-estados) — estados sobre los que se ancla el pin azul.
  - `EPICA-30` (Save/Load) — persistencia de `rosConfig`.
- **Brechas SSOT citadas:**
  - R-1 (badges runtime): HU-C2.013.
  - R-2 (pin azul / `is currently at state`): HU-C2.019, HU-C2.023.
  - R-3 (dots verde-oliva vs piruleta): HU-C2.020.
  - R-4 (valor multilinea): HU-C2.021.
  - R-5 (rotulo `[unidad]{alias}`): HU-C2.017.
  - R-6 (sufijo ``): relaciona HU-C2.001 via `process.computational`.
  - R-7 (objeto ambiental discontinuo verde): observado en `Turtlesim Node`, cubierto por EPICA-10/11.
  - R-9 (cardinal `1` en triangulo especializacion): mencionado en §9.7, cubierto por EPICA-11/12.
  - R-10 (dot negro solido borde sur): abierto Q C2.8.
  - R-11 (tooltip amarillo preview codigo): HU-C2.016.
- **Invariantes del repo potencialmente tocados:**
  - `src/nucleo/tipos.ts` — anadir `process.category`, `process.rosConfig`, `object.unit`, `object.alias`, `object.currentStateRef`, `object.valueState` (requiere presion multiple con EPICA-B1, EPICA-C0, EPICA-C1 antes de tocar el kernel; esta HU no basta).
  - `src/render/jointjs/` — factories para badges, pin azul, dots verde-oliva, rectangulo-valor multilinea.
  - `src/render/opl-renderer.ts` — verbos dinamicos `is currently at state`.
  - Nueva capa `src/runtime/ros/` — mediador cliente, parser topico, serializador std_msgs (si se materializa la integracion).
