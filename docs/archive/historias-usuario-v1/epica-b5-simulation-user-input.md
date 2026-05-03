---
epica: "EPICA-B5"
titulo: "Simulacion — entrada de usuario en tiempo de ejecucion"
doc_fuente: "opcloud-reverse/b5-simulation-user-input.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "S"
hu_emitidas: 23
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "DIAGNOSTICO-PILOTO-EPICA-B5.md"
revision_piloto: "epica-10-canvas-creacion-cosas.md"
---

## Resumen

Esta epica cubre la variante de simulacion computacional en la que el modelo **se detiene para pedir un dato al humano** y luego continua con ese valor inyectado en el flujo. El mecanismo no es un hook aislado: combina un patron OPM explicito (`Usuario maneja Obtencion de Entrada genera Entrada`), un proceso marcado como *obtenedor de entrada*, un editor JS con variables reservadas (`userInput`, `updateValue`) y un runner sincrono que abre el modal `Please Enter a Value:` cuando la ejecucion alcanza ese proceso.

El alcance se centra en cuatro capas acopladas: modelado del patron canonico, autoria del codigo del obtenedor, suspension/reanudacion del runner y escritura del valor resultante en objetos-atributo del OPD. Las preguntas abiertas del documento fuente se reflejan como HUs `requires-clarification` o como notas explicitas en las HUs observadas.

La mayoria de las HU son tipo `opcloud-ui` porque la simulacion interactiva no esta normada por la SSOT OPM; es una extension de OPCloud. Las HU `opm-semantica` corresponden al modelado del patron canonico y las `mixto` a mecanismos kernel con superficie UI.

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-B5.001 | Marcar proceso como obtenedor de entrada desde control contextual | IS | S | S | opcloud-ui | — |
| HU-B5.002 | Modelar el patron canonico `Usuario maneja Obtencion de Entrada genera Entrada` | IS | S | M | opm-semantica | [Glos 3.3] [Glos 3.39] [Glos 3.58] [V-239] |
| HU-B5.003 | Abrir editor JS modal integrado por doble clic en el obtenedor | IS | S | S | opcloud-ui | — |
| HU-B5.004 | Editar el cuerpo de la funcion en la region superior del editor | IS | S | S | opcloud-ui | — |
| HU-B5.005 | Ver region protegida con comentario de guardia y variables runtime | IS | S | XS | opcloud-ui | — |
| HU-B5.006 | Exponer `userInput` como variable reservada del obtenedor de entrada | IS | S | S | mixto | [V-122] |
| HU-B5.007 | Exponer `updateValue(alias, valor)` como API de escritura por alias | IS | S | M | mixto | [V-122] |
| HU-B5.008 | Cambiar el tema del editor JS y persistir la preferencia visual | IS | C | XS | opcloud-ui | — |
| HU-B5.009 | Guardar funcion del obtenedor con `Update` y marcar el proceso con sufijo `` | IS | S | S | opcloud-ui | — |
| HU-B5.010 | Cancelar cambios del editor JS sin persistir | IS | C | XS | opcloud-ui | — |
| HU-B5.011 | Reabrir el editor con el cuerpo previo del obtenedor | IS | S | S | opcloud-ui | — |
| HU-B5.012 | Regenerar aliases elegibles al cambiar la topologia conectada | IS | C | S | mixto | [V-122] |
| HU-B5.013 | Ejecutar obtenedores de entrada en modo `Sync Execute` | IS | S | S | opcloud-ui | — |
| HU-B5.014 | Suspender la simulacion al alcanzar un obtenedor de entrada | IS | S | S | mixto | — |
| HU-B5.015 | Mostrar modal `Please Enter a Value:` con valor actual preseleccionado | IS | S | S | opcloud-ui | — |
| HU-B5.016 | Aceptar texto libre y delegar el parseo a la funcion JS | IS | S | S | opcloud-ui | — |
| HU-B5.017 | Aplicar la entrada humana para ejecutar la funcion y reanudar la corrida | IS | S | M | mixto | — |
| HU-B5.018 | Sobrescribir in-situ el pill `value` del objeto de salida | IS | S | S | opcloud-ui | — |
| HU-B5.019 | Escribir en otros objetos-atributo mediante `updateValue` | IS | S | M | mixto | [V-122] |
| HU-B5.020 | Listar obtenedores y atributos en `Simulated Elements` | IS | C | S | opcloud-ui | — |
| HU-B5.021 | Alimentar obtenedores de entrada con `Headless Runner` | IS | W | S | opcloud-ui | — |
| HU-B5.022 | Importar valores de entrada desde `XLSX` | IS | W | S | opcloud-ui | — |
| HU-B5.023 | Resolver obtenedores de entrada bajo `Async Execute` | IS | C | S | opcloud-ui | — |

Total: **23 historias de usuario** (16 opcloud-ui, 6 mixto, 1 opm-semantica).

## Historias de usuario

### HU-B5.001 — Marcar proceso como obtenedor de entrada desde control contextual

**Actor primario:** IS (ingeniero de simulacion).
**Actores secundarios:** ME (modelador experto).
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; K secundario.
**Superficie UI:** halo / toolbar contextual del proceso seleccionado.
**Gesto canonico:** clic en control contextual con la pregunta `do you want to get an input or not`.

**Historia:**
> Como ingeniero de simulacion, quiero marcar un proceso como obtenedor de entrada para que el runner sepa que debe detenerse y pedir un dato humano cuando ese proceso entre en ejecucion.

**Contexto de negocio:**
La entrada de usuario en OPCloud no es un servicio global del simulador sino una propiedad explicita del proceso modelado. El gesto de marcado hace visible que el comportamiento interactivo pertenece al proceso y no a la toolbar. Tambien separa a los obtenedores de las funciones computacionales puras que se ejecutan sin detener la corrida.

**Criterios de aceptacion:**
- **Dado** que tengo un proceso seleccionado dentro del subgrafo `Usuario maneja <Proceso>`, **cuando** aparece el control contextual `do you want to get an input or not`, **entonces** puedo activarlo para marcar el proceso como obtenedor de entrada.
- **Dado** que el proceso quedo marcado como obtenedor de entrada, **cuando** la simulacion sincrona alcanza ese proceso, **entonces** la ejecucion se suspende y se abre el modal `Please Enter a Value:` (ver HU-B5.014, HU-B5.015).
- **Dado** que el proceso no esta marcado como obtenedor de entrada, **cuando** se ejecuta en simulacion, **entonces** no se espera un dato humano por este mecanismo.

**Reglas y restricciones:**
- La fuente enfatiza que "you cannot just get a user input whenever you want, you need to model it correctly".
- El control esta confirmado por transcripcion, pero no se distingue con nitidez en los frames.
- La marca del proceso como obtenedor se infiere persistente porque altera el comportamiento del runner.

**Modelo de datos tocado:**
- `process.simulation.inputGetter` — boolean — persistente (inferido).

**Dependencias:**
- Bloqueada por: HU-B5.002 (requiere el patron canonico del obtenedor).
- Bloquea a: HU-B5.006, HU-B5.013, HU-B5.014.

**Integraciones:**
- Editor JS del proceso.
- Runner de simulacion.

**Notas de evidencia:**
- Fuente normativa: — (funcionalidad OPCloud, sin respaldo directo en SSOT OPM).
- Fuente OPCloud: `opcloud-reverse/b5-simulation-user-input.md` §3.1 paso 5, §4, §6.
- Frames: sin frame nitido; referencia contextual a frame_00008.
- Transcripcion: "do you want to get an input or not".
- Clase de afirmacion: confirmado por transcripcion + inferido.
- Pregunta abierta asociada: §11.11 (si existe o no una marca visual especifica de obtenedor aparte del sufijo ``).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulation-user-input, ui, toggle, proceso, requires-clarification].

---

### HU-B5.002 — Modelar el patron canonico `Usuario maneja Obtencion de Entrada genera Entrada`

**Actor primario:** IS.
**Actores secundarios:** AD (autor de dominio).
**Tipo:** opm-semantica.
**Nivel categorico:** K primario; L (OPL) secundario.
**Superficie UI:** canvas-opd + panel-opl.
**Gesto canonico:** composicion del subgrafo mediante creacion de things y enlaces.

**Historia:**
> Como ingeniero de simulacion, quiero modelar la entrada humana con el patron `Usuario maneja Obtencion de Entrada genera Entrada` para que el obtenedor quede expresado como OPM canonico y no como un hook suelto fuera del diagrama.

**Contexto de negocio:**
El documento fuente presenta este patron como requisito metodologico del producto. El actor humano debe estar modelado como objeto fisico `Usuario`, el proceso debe actuar como obtenedor y el dato debe aterrizar en un objeto-atributo cuyo estado-valor `value` funciona como slot de escritura. Esto mantiene la simulacion alineada con el modelo y con el OPL generado. La SSOT OPM [Glos 3.3] define Agente como habilitador fisico; [V-239] cubre las familias canonicas de enlace que soportan este patron: agente (`handles`) y resultado (`yields`).

**Criterios de aceptacion:**
- **Dado** un OPD vacio o parcial, **cuando** completo el patron con `Usuario`, `Obtencion de Entrada`, `Entrada`, un enlace `maneja` y un enlace `genera`, **entonces** el canvas muestra el subgrafo minimo de 3 things + 2 enlaces documentado por la fuente.
- **Dado** que `Usuario` quedo marcado como fisico, **cuando** consulto el OPL, **entonces** aparece `Usuario es fisico.`
- **Dado** que existe el enlace agent `Usuario -> Obtencion de Entrada`, **cuando** consulto el OPL, **entonces** aparece `Usuario maneja Obtencion de Entrada.`
- **Dado** que existe el enlace result `Obtencion de Entrada -> Entrada`, **cuando** consulto el OPL, **entonces** aparece `Obtencion de Entrada genera Entrada.`
- **Dado** que el objeto `Entrada` es computational con estado-valor placeholder, **cuando** consulto el OPL, **entonces** aparece la linea correspondiente al valor (`Entrada es valor.` o equivalente observado).

**Reglas y restricciones:**
- El patron canonico minimo es `Usuario (agente) - maneja -> Obtencion de Entrada - genera -> Entrada [valor]`.
- El objeto `Usuario` se observa como objeto fisico. [Glos 3.3]
- El estado-valor `valor` pertenece al objeto computational y opera como slot de escritura.

**Modelo de datos tocado:**
- `thing.name` — string — persistente.
- `thing.essence` — `"fisica"` para `Usuario` — persistente.
- `process.simulation.inputGetter` — boolean — persistente (inferido).
- `link.type` — `"agent" | "result"` — persistente. [V-239]
- `attribute.valueSlot.placeholder` — string (`"value"`) — persistente/inferido.

**Dependencias:**
- Bloqueada por: HU-10.001, HU-10.002, HU-10.007 (creacion y linking base), HU-B1.001, HU-B1.002 y HU-B1.013 (objeto computational, slot `value` y enlace result).
- Bloquea a: HU-B5.001, HU-B5.006, HU-B5.018.

**Integraciones:**
- Panel OPL.
- Biblioteca `Draggable OPM Things`.
- Runner de simulacion que detecta el patron.

**Notas de evidencia:**
- Fuente normativa: [Glos 3.3] Agente; [Glos 3.39] Objeto; [Glos 3.58] Proceso; [V-239] familias canonicas de enlace.
- Fuente OPCloud: `opcloud-reverse/b5-simulation-user-input.md` §1, §3.1, §7.
- Frames: frame_00004, frame_00008, frame_00012.
- Transcripcion: "you cannot just get a user input whenever you want, you need to model it correctly".
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [simulation-user-input, kernel, patron-canonico, agent, yields, opl].

---

### HU-B5.003 — Abrir editor JS modal integrado por doble clic en el obtenedor

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** editor-js-modal integrado sobre canvas.
**Gesto canonico:** doble clic sobre el proceso obtenedor.

**Historia:**
> Como ingeniero de simulacion, quiero abrir un editor JS modal integrado al hacer doble clic sobre el obtenedor para escribir la logica que transformara el dato humano en valor de simulacion.

**Contexto de negocio:**
El obtenedor de entrada se implementa como funcion especial del framework de funciones de usuario. El editor de esta carpeta no es un textarea plano sino un IDE modal ancho con numeracion de lineas, minimap y selector de tema. Esa superficie concentra la autoria tecnica del obtenedor sin sacar al modelador del OPD activo.

**Criterios de aceptacion:**
- **Dado** que tengo un proceso obtenedor en el canvas, **cuando** hago doble clic sobre el, **entonces** se abre un editor JS modal integrado sobre el canvas.
- **Dado** que el editor esta abierto, **cuando** inspecciono su layout, **entonces** veo una cabecera con `Update`, `Cancel` y `Theme:` y un cuerpo con numeros de linea, syntax highlight, scroll y minimap.
- **Dado** que cierro el editor con `Update` o `Cancel`, **cuando** vuelvo al canvas, **entonces** permanezco en el mismo OPD activo sin abandonar el contexto de simulacion.

**Reglas y restricciones:**
- El modal ocupa aproximadamente el 80% del ancho visible.
- La apertura observada es por doble clic; no se documenta shortcut alternativo.
- El editor pertenece al proceso, no a la toolbar global.

**Modelo de datos tocado:**
- `ui.jsEditor.isOpen` — boolean — transitorio.
- `ui.jsEditor.processId` — string — transitorio.

**Dependencias:**
- Bloqueada por: HU-B5.001.
- Bloquea a: HU-B5.004, HU-B5.005, HU-B5.008, HU-B5.009.

**Integraciones:**
- Canvas activo.
- Persistencia del cuerpo JS del proceso.

**Notas de evidencia:**
- Fuente normativa: — (editor JS es OPCloud-ui).
- Fuente OPCloud: `opcloud-reverse/b5-simulation-user-input.md` §2 tabla superficies, §3.2 paso 1, §5.
- Frames: frame_00014, frame_00015, frame_00016, frame_00018.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulation-user-input, ui, editor-js, modal, doble-clic].

---

### HU-B5.004 — Editar el cuerpo de la funcion en la region superior del editor

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; K secundario.
**Superficie UI:** region editable del editor JS.
**Gesto canonico:** escritura con teclado en lineas 1-2.

**Historia:**
> Como ingeniero de simulacion, quiero editar el cuerpo superior de la funcion para definir como el obtenedor transforma `userInput` en el valor que ingresara al modelo.

**Contexto de negocio:**
La fuente distingue con claridad la region editable de la region regenerada por el runtime. El modelador trabaja arriba de la guardia: primero con el placeholder `return a+b;` y luego con un cuerpo propio como `return userInput;`. Esa distincion reduce el riesgo de alterar el contrato del runtime.

**Criterios de aceptacion:**
- **Dado** que abri el editor por primera vez, **cuando** miro la primera linea, **entonces** veo el placeholder `return a+b;`.
- **Dado** que quiero que el obtenedor devuelva exactamente lo que el humano escribio, **cuando** reemplazo el placeholder por `return userInput;`, **entonces** el editor muestra el nuevo cuerpo en la region superior.
- **Dado** que la funcion requiere mas de una linea en la zona editable, **cuando** escribo, **entonces** el editor conserva numeracion y scroll sin colapsar el modal.

**Reglas y restricciones:**
- La region editable observada ocupa las lineas previas al comentario de guardia.
- El placeholder `return a+b;` se observa como default inicial del editor.
- El cuerpo editable retorna un valor que el runtime escribira en el objeto `genera` o en otros alias mediante `updateValue`.

**Modelo de datos tocado:**
- `process.function.body` — string — persistente.
- `ui.jsEditor.draftBody` — string — transitorio.

**Dependencias:**
- Bloqueada por: HU-B5.003.
- Bloquea a: HU-B5.009, HU-B5.011, HU-B5.017.

**Integraciones:**
- Region protegida del runtime (HU-B5.005).
- Runner de simulacion.

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: `opcloud-reverse/b5-simulation-user-input.md` §2 tabla superficies, §3.2 pasos 2 y 4, §5.
- Frames: frame_00014, frame_00018.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulation-user-input, ui, editor-js, body, return].

---

### HU-B5.005 — Ver region protegida con comentario de guardia y variables runtime

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; K secundario.
**Superficie UI:** region inferior del editor JS.
**Gesto canonico:** ninguno (render declarativo del contrato).

**Historia:**
> Como ingeniero de simulacion, quiero ver una region protegida separada por un comentario de guardia para distinguir mi codigo editable de las variables que el runtime genera automaticamente.

**Contexto de negocio:**
La guardia hace explicito el contrato entre el modelador-programador y el simulador. En lugar de esconder el plumbing, OPCloud lo muestra con un comentario de advertencia que delimita que lineas pertenecen al usuario y cuales al sistema. Esta transparencia es importante porque el obtenedor mezcla logica authored y variables inyectadas en el mismo editor.

**Criterios de aceptacion:**
- **Dado** que el editor esta abierto, **cuando** observo la transicion entre la region editable y la inferior, **entonces** veo un comentario que comienza con `Don't edit or change the lines below here`.
- **Dado** que la guardia esta visible, **cuando** recorro la parte inferior, **entonces** encuentro alli las variables runtime (`userInput`, `updateValue`) y sus comentarios asociados.
- **Dado** que reabro el editor de un obtenedor ya configurado, **cuando** veo la region inferior, **entonces** la guardia sigue separando el cuerpo authored del bloque regenerado.

**Reglas y restricciones:**
- La fuente documenta la guardia como delimitador contractual; no prueba si la region es tecnicamente read-only.
- El comentario esta en ingles y forma parte visible del editor.

**Modelo de datos tocado:**
- `ui.jsEditor.runtimeGuardVisible` — boolean — transitorio.

**Dependencias:**
- Bloqueada por: HU-B5.003.
- Bloquea a: HU-B5.006, HU-B5.007, HU-B5.012.

**Integraciones:**
- Contrato de regeneracion del runtime.

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: `opcloud-reverse/b5-simulation-user-input.md` §2 tabla superficies, §3.2 paso 2, §5.
- Frames: frame_00014, frame_00015, frame_00016, frame_00018.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [simulation-user-input, ui, editor-js, guard, runtime].

---

### HU-B5.006 — Exponer `userInput` como variable reservada del obtenedor de entrada

**Actor primario:** IS.
**Tipo:** mixto.
**Nivel categorico:** K primario; U secundario.
**Superficie UI:** region protegida del editor + modal de entrada.
**Gesto canonico:** lectura/escritura indirecta mediante `Apply`.

**Historia:**
> Como ingeniero de simulacion, quiero que el runtime me exponga `userInput` dentro del obtenedor para acceder directamente al string que la persona ingresa durante la corrida.

**Contexto de negocio:**
`userInput` es la bisagra entre la interfaz modal y el codigo del proceso. Sin esa variable reservada, el obtenedor no tendria forma explicita de leer el dato humano. La fuente la muestra como `let userInput = undefined;` y luego confirma por transcripcion que el modal le asigna el string ingresado antes de ejecutar la funcion. El sistema de aliases [V-122] provee el marco para que las variables runtime referencien objetos del modelo.

**Criterios de aceptacion:**
- **Dado** que el proceso esta marcado como obtenedor de entrada, **cuando** abro el editor, **entonces** veo en la region protegida la declaracion `let userInput = undefined;`.
- **Dado** que el cuerpo de la funcion es `return userInput;`, **cuando** durante la simulacion ingreso `text` o `3` y pulso `Apply`, **entonces** la funcion recibe ese string en `userInput`.
- **Dado** que el proceso no funciona como obtenedor de entrada, **cuando** se ejecuta una funcion calculadora pura, **entonces** este mecanismo no es el camino documentado para obtener datos humanos.

**Reglas y restricciones:**
- `userInput` se documenta como string del dialogo interactivo.
- La variable es reservada y proviene del runtime, no del modelador.
- El valor inicial observado en la declaracion es `undefined`.

**Modelo de datos tocado:**
- `process.function.runtime.userInput` — string — transitorio.

**Dependencias:**
- Bloqueada por: HU-B5.001, HU-B5.005.
- Bloquea a: HU-B5.016, HU-B5.017.

**Integraciones:**
- Modal `Please Enter a Value:`.
- Motor de ejecucion de funciones JS.

**Notas de evidencia:**
- Fuente normativa: [V-122] sistema de aliases como marco general de referenciacion.
- Fuente OPCloud: `opcloud-reverse/b5-simulation-user-input.md` §1, §2 tabla superficies, §3.2 paso 3, §3.3 pasos 3-5, §5.
- Frames: frame_00014, frame_00018, frame_00020, frame_00027.
- Transcripcion: el narrador explica que `userInput` es la variable del dialogo.
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulation-user-input, kernel, editor-js, userInput, runtime].

---

### HU-B5.007 — Exponer `updateValue(alias, valor)` como API de escritura por alias

**Actor primario:** IS.
**Tipo:** mixto.
**Nivel categorico:** K primario; U secundario.
**Superficie UI:** region protegida del editor JS.
**Gesto canonico:** invocacion programatica desde el cuerpo de la funcion.

**Historia:**
> Como ingeniero de simulacion, quiero disponer de `updateValue(alias, valor)` para escribir valores en objetos-atributo conectados usando sus aliases V-122.

**Contexto de negocio:**
El obtenedor no solo puede devolver un valor monogamo hacia el objeto conectado por `genera`. La fuente describe una ruta mas potente: llamar a `updateValue(alias, valor)` para mutar otros objetos conectados por enlaces elegibles. Asi, los aliases dejan de ser decorativos y se convierten en API de programacion del modelo. La SSOT [V-122] define los aliases como mecanismo de referenciacion dentro del modelo OPM.

**Criterios de aceptacion:**
- **Dado** que el editor esta abierto, **cuando** miro la region protegida, **entonces** veo la firma `function updateValue(alias, value) {}`.
- **Dado** que inspecciono la documentacion inline de esa API, **cuando** leo el bloque JSDoc, **entonces** veo `@param {string} alias` y `@param {string | number} value`.
- **Dado** que un objeto-atributo expone alias V-122 como `{sd}` o `{c}`, **cuando** lo referencio desde la funcion mediante `updateValue(alias, valor)`, **entonces** el alias actua como clave programatica del objeto conectado.

**Reglas y restricciones:**
- La fuente explicita que los aliases elegibles provienen de objetos conectados por `effect`, `instrument` o `consumption`.
- `updateValue` es camino alternativo al `return`, no lo reemplaza necesariamente.
- El comportamiento ante alias inexistente queda abierto (§11.7).

**Modelo de datos tocado:**
- `attribute.alias` — string — persistente. [V-122]
- `process.function.runtime.updateValue` — funcion runtime — transitorio.

**Dependencias:**
- Bloqueada por: HU-B5.005.
- Bloquea a: HU-B5.012, HU-B5.019.

**Integraciones:**
- Sistema de aliases V-122.
- Topologia de objetos-atributo conectados.

**Notas de evidencia:**
- Fuente normativa: [V-122] aliases como sistema de referenciacion.
- Fuente OPCloud: `opcloud-reverse/b5-simulation-user-input.md` §2 tabla superficies, §3.2 paso 3, §5, §6, §7.
- Frames: frame_00014, frame_00018.
- Transcripcion: el narrador explica que `updateValue` escribe usando el alias de V-122.
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [simulation-user-input, kernel, alias, updateValue, editor-js].

---

### HU-B5.008 — Cambiar el tema del editor JS y persistir la preferencia visual

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; C secundario.
**Superficie UI:** selector `Theme:` del editor JS.
**Gesto canonico:** clic en dropdown de tema.

**Historia:**
> Como ingeniero de simulacion, quiero cambiar el tema del editor JS para trabajar con la paleta visual que me resulte mas legible durante la autoria del obtenedor.

**Contexto de negocio:**
La fuente muestra al menos dos temas (`Active4D` claro y `Twilight` oscuro) y evidencia que la preferencia persiste entre aperturas. No altera semantica del modelo, pero si reduce friccion para quien edita funciones varias veces durante una sesion de simulacion.

**Criterios de aceptacion:**
- **Dado** que el editor esta abierto, **cuando** despliego `Theme:`, **entonces** veo al menos `Active4D` y `Twilight`.
- **Dado** que cambio de `Active4D` a `Twilight`, **cuando** el selector aplica el cambio, **entonces** el editor actualiza su paleta y syntax highlight.
- **Dado** que cierro y vuelvo a abrir el editor despues de cambiar el tema, **cuando** reviso el selector, **entonces** la preferencia elegida se conserva.

**Reglas y restricciones:**
- `Active4D` parece ser el tema default observado.
- La persistencia documentada es de preferencia visual del editor, no del modelo OPM.

**Modelo de datos tocado:**
- `ui.jsEditor.theme` — string — persistente de preferencia o transitorio prolongado (inferido).

**Dependencias:**
- Bloqueada por: HU-B5.003.

**Integraciones:**
- Editor integrado.

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: `opcloud-reverse/b5-simulation-user-input.md` §2 tabla superficies, §3.2 pasos 2 y 4, §5.
- Frames: frame_00014, frame_00018.
- Clase de afirmacion: observado.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [simulation-user-input, ui, editor-js, theme, preferencia].

---

### HU-B5.009 — Guardar funcion del obtenedor con `Update` y marcar el proceso con sufijo ``

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; K y V secundarios.
**Superficie UI:** cabecera del editor JS + canvas-opd.
**Gesto canonico:** clic en `Update`.

**Historia:**
> Como ingeniero de simulacion, quiero guardar la funcion del obtenedor con `Update` para persistir su cuerpo y reconocer en el canvas que el proceso ya tiene codigo adjunto.

**Contexto de negocio:**
El commit explicito del editor cierra el ciclo de autoria. Una vez guardada la funcion, el proceso recupera el sufijo `` junto a su nombre, lo que permite distinguir rapidamente procesos con codigo adjunto de procesos puramente conceptuales. En esta feature, esa marca no distingue si el codigo es obtenedor o calculadora pura: solo indica presencia de funcion.

**Criterios de aceptacion:**
- **Dado** que modifique el cuerpo del obtenedor, **cuando** hago clic en `Update`, **entonces** el editor cierra y el cuerpo queda persistido para futuras aperturas.
- **Dado** que la funcion fue guardada, **cuando** regreso al canvas, **entonces** el nombre del proceso muestra el sufijo `` como marca visual de codigo adjunto.
- **Dado** que el proceso guardado entra luego en simulacion, **cuando** el runner lo alcanza, **entonces** la logica persistida se usa como parte de la ejecucion del obtenedor.

**Reglas y restricciones:**
- `Update` es el commit path observado.
- El sufijo `` marca "proceso con codigo adjunto", no necesariamente "proceso esperando entrada".
- La fuente no documenta una decoracion adicional exclusiva para obtenedor de entrada.

**Modelo de datos tocado:**
- `process.function.body` — string — persistente.
- `process.function.bound` — boolean — persistente (inferido).

**Dependencias:**
- Bloqueada por: HU-B5.004.
- Bloquea a: HU-B5.011, HU-B5.013.

**Integraciones:**
- Canvas renderer del nombre del proceso.
- Persistencia del modelo.

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: `opcloud-reverse/b5-simulation-user-input.md` §2 tabla superficies, §3.2 pasos 4-5, §5, §9.
- Frames: frame_00018, frame_00019, frame_00026, frame_00027.
- Clase de afirmacion: observado.
- Pregunta abierta asociada: §11.11 (si existe una marca especifica para distinguir obtenedor de funcion pura).

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulation-user-input, ui, persistencia, suffix, marca-visual].

---

### HU-B5.010 — Cancelar cambios del editor JS sin persistir

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** cabecera del editor JS.
**Gesto canonico:** clic en `Cancel`.

**Historia:**
> Como ingeniero de simulacion, quiero cancelar la edicion del obtenedor para descartar cambios locales sin reemplazar el cuerpo ya guardado.

**Contexto de negocio:**
El obtenedor mezcla codigo authored y runtime helpers, por lo que el usuario puede abrir el editor para inspeccionar sin intencion de modificarlo. `Cancel` preserva ese flujo de lectura o experimentacion segura. La fuente lo documenta explicitamente como contraparte de `Update`.

**Criterios de aceptacion:**
- **Dado** que edite el cuerpo del obtenedor pero aun no confirme, **cuando** hago clic en `Cancel`, **entonces** el editor cierra sin persistir el borrador.
- **Dado** que existia un cuerpo guardado previamente, **cuando** reabro el editor tras cancelar, **entonces** se muestra el cuerpo anterior y no el borrador descartado.
- **Dado** que no hice cambios en la sesion actual, **cuando** pulso `Cancel`, **entonces** el editor simplemente cierra.

**Reglas y restricciones:**
- La fuente observa el control `Cancel` pero no documenta atajo de teclado equivalente.
- `Cancel` descarta la sesion de edicion actual; no modifica la marca `` ya existente.

**Modelo de datos tocado:**
- `ui.jsEditor.draftBody` — string — transitorio descartable.

**Dependencias:**
- Bloqueada por: HU-B5.003.

**Integraciones:**
- Persistencia del cuerpo JS.

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: `opcloud-reverse/b5-simulation-user-input.md` §2 tabla superficies, §4, §5.
- Frames: frame_00014, frame_00018.
- Clase de afirmacion: observado + confirmado por narracion del flujo secundario.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [simulation-user-input, ui, cancelar, editor-js].

---

### HU-B5.011 — Reabrir el editor con el cuerpo previo del obtenedor

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; K secundario.
**Superficie UI:** editor-js-modal.
**Gesto canonico:** doble clic sobre proceso con sufijo ``.

**Historia:**
> Como ingeniero de simulacion, quiero reabrir el editor del obtenedor con el cuerpo previo precargado para iterar la funcion sin tener que reconstruirla desde cero.

**Contexto de negocio:**
El obtenedor es una pieza iterativa: se prueba, se corrige y se vuelve a probar. La fuente muestra que `return userInput;` persiste entre aperturas y cierres, lo que confirma que el editor actua sobre un cuerpo guardado en el proceso y no sobre una sesion efimera.

**Criterios de aceptacion:**
- **Dado** que guarde un obtenedor con `return userInput;`, **cuando** hago doble clic otra vez sobre el proceso, **entonces** el editor reabre con ese cuerpo ya precargado.
- **Dado** que el proceso muestra el sufijo ``, **cuando** lo reabro, **entonces** no vuelvo al placeholder `return a+b;` salvo que no hubiera cuerpo previo.
- **Dado** que la preferencia de tema ya fue cambiada, **cuando** reabro el editor, **entonces** tambien se conserva la paleta elegida (ver HU-B5.008).

**Reglas y restricciones:**
- La reapertura observada reutiliza el mismo modal integrado.
- La persistencia del cuerpo es inferida por el comportamiento entre cierres y aperturas.

**Modelo de datos tocado:**
- `process.function.body` — string — persistente.

**Dependencias:**
- Bloqueada por: HU-B5.009.
- Bloquea a: HU-B5.012.

**Integraciones:**
- Persistencia del modelo.
- Editor JS.

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: `opcloud-reverse/b5-simulation-user-input.md` §4, §5, §6.
- Frames: frame_00018.
- Clase de afirmacion: observado + inferido.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulation-user-input, ui, re-edicion, persistencia, editor-js].

---

### HU-B5.012 — Regenerar aliases elegibles al cambiar la topologia conectada

**Actor primario:** IS.
**Tipo:** mixto.
**Nivel categorico:** K primario; U secundario.
**Superficie UI:** editor JS reabierto tras cambios topologicos.
**Gesto canonico:** agregar enlace elegible y reabrir editor.

**Historia:**
> Como ingeniero de simulacion, quiero que los aliases elegibles se regeneren cuando conecto nuevos objetos-atributo al proceso para que `updateValue` refleje la topologia actual del modelo.

**Contexto de negocio:**
La utilidad de `updateValue` depende de que el runtime conozca que aliases estan disponibles. La transcripcion afirma que, al anadir un enlace elegible desde otro objeto-atributo, ese objeto "will be defined here as part of the aliases array". El detalle exacto de la regeneracion no se ve en frames, pero es una pieza relevante para mantener coherencia entre topologia y codigo. La SSOT [V-122] establece que los aliases identifican univocamente objetos-atributo dentro del modelo.

**Criterios de aceptacion:**
- **Dado** que un proceso obtenedor ya tiene editor y aliases disponibles, **cuando** conecto un nuevo objeto-atributo por un enlace elegible (`effect`, `instrument`, `consumption`) y reabro el editor, **entonces** el runtime incluye ese nuevo alias en la region protegida.
- **Dado** que el runtime regenero la region protegida, **cuando** reviso el cuerpo authored superior, **entonces** este se conserva sin ser sobrescrito.
- **Dado** que elimino o cambio una conexion elegible, **cuando** reabro el editor, **entonces** la disponibilidad de aliases debe reflejar la topologia actual.

**Reglas y restricciones:**
- El simbolo literal `aliases` es mencionado por transcripcion, pero no aparece visible en los frames muestreados.
- La fuente no documenta si la regeneracion es automatica en vivo o solo al reabrir el editor.

**Modelo de datos tocado:**
- `process.function.runtime.aliases` — `string[]` — transitorio/regenerado. [V-122]

**Dependencias:**
- Bloqueada por: HU-B5.007, HU-B5.011.
- Bloquea a: HU-B5.019.

**Integraciones:**
- Topologia del proceso.
- Sistema de aliases V-122.

**Notas de evidencia:**
- Fuente normativa: [V-122] aliases como sistema de referenciacion univoca.
- Fuente OPCloud: `opcloud-reverse/b5-simulation-user-input.md` §4, §5, §7, §11.6.
- Frames: sin observacion directa del array; contexto de frame_00026 y frame_00027.
- Transcripcion: "will be defined here as part of the aliases array".
- Clase de afirmacion: confirmado por transcripcion + inferido.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [simulation-user-input, alias, regeneracion, editor-js, requires-clarification].

---

### HU-B5.013 — Ejecutar obtenedores de entrada en modo `Sync Execute`

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; K secundario.
**Superficie UI:** toolbar de simulacion extendida.
**Gesto canonico:** clic en modo `Sync Execute` y luego Play.

**Historia:**
> Como ingeniero de simulacion, quiero correr obtenedores de entrada bajo `Sync Execute` para que el runner pueda detenerse de forma interactiva y esperar mi respuesta humana.

**Contexto de negocio:**
La carpeta muestra el flujo interactivo solo en modo sincrono. El tooltip `Sync Execute` y la suspension con modal sugieren que este modo es el compatible con entradas humanas bloqueantes. La experiencia depende de que el runner conserve el contexto del canvas mientras espera el `Apply`.

**Criterios de aceptacion:**
- **Dado** que entro a modo simulacion, **cuando** observo la toolbar extendida, **entonces** veo los controles `Play`, `Stop`, contador `1`, `Sync Execute`, `Async Execute`, `Table`, slider, `100%` y `Headless Runner`.
- **Dado** que hago hover sobre el boton de flechas circulares, **cuando** aparece el tooltip, **entonces** se identifica explicitamente como `Sync Execute`.
- **Dado** que quiero ejecutar un obtenedor interactivo, **cuando** corro la simulacion en `Sync Execute`, **entonces** el runner puede suspenderse para pedir entrada humana.

**Reglas y restricciones:**
- El flujo observado con modal ocurre en `Sync Execute`.
- La fuente no muestra obtenedor de entrada interactivo corriendo en `Async Execute`.

**Modelo de datos tocado:**
- `simulation.runner.mode` — `"sync" | "async"` — transitorio.

**Dependencias:**
- Bloqueada por: HU-B5.009 y capacidades base de EPICA-B0.
- Bloquea a: HU-B5.014, HU-B5.015, HU-B5.017.

**Integraciones:**
- Toolbar de simulacion.
- Runner base de EPICA-B0.

**Notas de evidencia:**
- Fuente normativa: — (simulacion interactiva no normada por SSOT).
- Fuente OPCloud: `opcloud-reverse/b5-simulation-user-input.md` §2 tabla superficies, §3.3 pasos 1-2, §4, §5.
- Frames: frame_00019, frame_00020, frame_00027.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulation-user-input, runner, sync, toolbar].

---

### HU-B5.014 — Suspender la simulacion al alcanzar un obtenedor de entrada

**Actor primario:** IS.
**Tipo:** mixto.
**Nivel categorico:** U primario; K secundario.
**Superficie UI:** toolbar de ejecucion + canvas + overlay modal.
**Gesto canonico:** suspension automatica del runner.

**Historia:**
> Como ingeniero de simulacion, quiero que la corrida se suspenda cuando llega a un obtenedor de entrada para poder ingresar el dato sin perder el estado actual del modelo.

**Contexto de negocio:**
La suspension es la diferencia clinica entre un obtenedor y una funcion calculadora pura. El runner no termina ni se detiene por completo: queda activo pero pausado en un tercer estado operacional, con el boton `Pause` visible y el canvas aun detras del modal. Esto permite retomar exactamente desde el punto donde se solicito el dato.

**Criterios de aceptacion:**
- **Dado** que la simulacion esta corriendo en `Sync Execute`, **cuando** el token de ejecucion alcanza un proceso marcado como obtenedor de entrada, **entonces** la corrida se suspende y aparece el modal de entrada.
- **Dado** que la corrida esta suspendida en un obtenedor, **cuando** observo la toolbar, **entonces** `Play` ha cambiado a `Pause`, senalando que la simulacion sigue activa pero bloqueada esperando entrada.
- **Dado** que el modal esta abierto, **cuando** observo el canvas de fondo, **entonces** el contexto visual del OPD sigue visible detras del overlay.

**Reglas y restricciones:**
- La fuente observa ausencia de marca visual adicional sobre la elipse del proceso suspendido.
- No se observa timeout ni barra de progreso para esta espera.
- La suspension es indefinida hasta `Apply` o `Stop`.

**Modelo de datos tocado:**
- `simulation.runner.state` — `"running" | "waiting_input" | "stopped"` — transitorio (inferido).

**Dependencias:**
- Bloqueada por: HU-B5.001, HU-B5.013.
- Bloquea a: HU-B5.015, HU-B5.017.

**Integraciones:**
- Modal de entrada.
- Estado del runner.

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: `opcloud-reverse/b5-simulation-user-input.md` §1, §2 tabla superficies, §3.3 pasos 2-3, §6, §9, §11.12.
- Frames: frame_00020, frame_00027.
- Clase de afirmacion: observado + inferido.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulation-user-input, runner, suspension, modal, waiting-input].

---

### HU-B5.015 — Mostrar modal `Please Enter a Value:` con valor actual preseleccionado

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** modal centrado `Please Enter a Value:`.
**Gesto canonico:** foco en campo de texto y clic en `Apply`.

**Historia:**
> Como ingeniero de simulacion, quiero ver un modal de entrada con el valor actual ya precargado para editarlo rapidamente sin perder el contexto del proceso que lo solicita.

**Contexto de negocio:**
El modal es la cara visible del obtenedor para el humano. La fuente lo muestra centrado, con un solo campo de texto, el valor actual preseleccionado (`value` en la primera corrida) y un boton rojo `Apply`. No se observa boton `Cancel`, lo que refuerza que la interaccion esperada es proveer un dato o frenar la simulacion completa.

**Criterios de aceptacion:**
- **Dado** que la simulacion se suspendio en un obtenedor, **cuando** el modal aparece, **entonces** muestra el titulo `Please Enter a Value:`.
- **Dado** que el modal esta abierto por primera vez para ese objeto, **cuando** miro el campo de texto, **entonces** el contenido actual preseleccionado es `value`.
- **Dado** que el objeto ya tenia otro valor durante la corrida, **cuando** el obtenedor vuelva a pedir entrada, **entonces** el campo precarga el valor actual del estado-valor.
- **Dado** que el modal esta visible, **cuando** observo sus affordances, **entonces** veo el boton rojo `Apply` y no observo un boton `Cancel`.

**Reglas y restricciones:**
- El modal es de una sola linea de texto.
- No se documenta entrada multilinea ni estructurada.
- La forma de cancelar sin detener toda la simulacion queda abierta.

**Modelo de datos tocado:**
- `ui.inputModal.isOpen` — boolean — transitorio.
- `ui.inputModal.currentValue` — string — transitorio.

**Dependencias:**
- Bloqueada por: HU-B5.014.
- Bloquea a: HU-B5.016, HU-B5.017.

**Integraciones:**
- Value slot del objeto destino.
- Runner de simulacion.

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: `opcloud-reverse/b5-simulation-user-input.md` §2 tabla superficies, §3.3 paso 3, §4, §5, §9, §11.3, §11.9, §11.12.
- Frames: frame_00020, frame_00027.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulation-user-input, modal, apply, value-slot, ui].

---

### HU-B5.016 — Aceptar texto libre y delegar el parseo a la funcion JS

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario; U secundario.
**Superficie UI:** campo de texto del modal + cuerpo JS del obtenedor.
**Gesto canonico:** escritura libre y posterior procesamiento por la funcion.

**Historia:**
> Como ingeniero de simulacion, quiero que el modal acepte texto libre para decidir en mi funcion como validar, parsear o rechazar el valor segun mi dominio.

**Contexto de negocio:**
La fuente no muestra validacion previa del runtime sobre lo que el humano escribe. El narrador explicita que "we can insert any kind of value that we want" y que la verificacion, si hace falta, debe realizarse en la funcion definida por el usuario. Esto vuelve al obtenedor flexible, pero tambien desplaza responsabilidad al autor del modelo.

**Criterios de aceptacion:**
- **Dado** que el modal de entrada esta abierto, **cuando** escribo un string como `text`, **entonces** el sistema acepta esa entrada para pasarla a `userInput`.
- **Dado** que escribo un string numerico como `3`, **cuando** pulso `Apply`, **entonces** el runtime tambien lo entrega a la funcion como entrada de texto a parsear segun el cuerpo authored.
- **Dado** que el dominio requiere restricciones adicionales, **cuando** necesito validar rango o tipo, **entonces** la validacion se implementa en la funcion JS y no se documenta una validacion previa obligatoria del modal.

**Reglas y restricciones:**
- `userInput` se trata como string en la UI observada.
- La interaccion con range validation de EPICA-B3 queda abierta.
- No se observa selector de tipo (`numeric`, `boolean`, etc.) para el obtenedor.

**Modelo de datos tocado:**
- `process.function.runtime.userInput` — string — transitorio.

**Dependencias:**
- Bloqueada por: HU-B5.006, HU-B5.015.
- Bloquea a: HU-B5.017.

**Integraciones:**
- Funcion JS del obtenedor.
- Eventual cruce con EPICA-B3 (range validation).

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: `opcloud-reverse/b5-simulation-user-input.md` §3.3 pasos 4-5, §4, §11.2, §11.8.
- Frames: frame_00020, frame_00027.
- Transcripcion: "we can insert any kind of value that we want and according to what we need we will need to do it to verify it in the user defined function".
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulation-user-input, validacion, userInput, parseo, string].

---

### HU-B5.017 — Aplicar la entrada humana para ejecutar la funcion y reanudar la corrida

**Actor primario:** IS.
**Tipo:** mixto.
**Nivel categorico:** K primario; U secundario.
**Superficie UI:** boton `Apply` + runner + funcion JS.
**Gesto canonico:** clic en `Apply`.

**Historia:**
> Como ingeniero de simulacion, quiero confirmar el dato con `Apply` para que el obtenedor ejecute su funcion con esa entrada y la simulacion continue desde el punto suspendido.

**Contexto de negocio:**
`Apply` es el puente entre espera y reanudacion. La secuencia documentada es precisa: el modal cierra, el string pasa a `userInput`, la funcion del proceso se ejecuta, el retorno se escribe en el modelo y luego la simulacion avanza. Sin este commit explicito, el runner no puede continuar con un dato humano consistente.

**Criterios de aceptacion:**
- **Dado** que el modal de entrada esta abierto, **cuando** hago clic en `Apply`, **entonces** el string ingresado se asigna a `userInput` y el modal se cierra.
- **Dado** que `Apply` ya cerro el modal, **cuando** el runtime ejecuta la funcion del obtenedor, **entonces** usa el `userInput` recien ingresado para producir el valor de salida.
- **Dado** que la funcion termino su ejecucion, **cuando** el runner actualiza el modelo, **entonces** la simulacion se reanuda automaticamente desde el punto donde estaba suspendida.

**Reglas y restricciones:**
- El boton confirmado en frames es `Apply`.
- La fuente no confirma shortcut `Enter` para confirmar el modal.
- La cadena completa `modal -> userInput -> funcion -> escritura -> reanudacion` se describe en §6 como modelo mental de ejecucion.

**Modelo de datos tocado:**
- `process.function.runtime.userInput` — string — transitorio.
- `simulation.runner.state` — `"waiting_input" -> "running"` — transitorio (inferido).

**Dependencias:**
- Bloqueada por: HU-B5.015, HU-B5.016.
- Bloquea a: HU-B5.018, HU-B5.019.

**Integraciones:**
- Runtime del obtenedor.
- Runner de simulacion.

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: `opcloud-reverse/b5-simulation-user-input.md` §1, §3.3 pasos 4-6, §6.
- Frames: frame_00020, frame_00022, frame_00027, frame_00028.
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [simulation-user-input, apply, ejecucion, runner, reanudacion].

---

### HU-B5.018 — Sobrescribir in-situ el pill `value` del objeto de salida

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; K secundario.
**Superficie UI:** objeto-atributo de salida en el canvas.
**Gesto canonico:** render automatico posterior a `Apply`.

**Historia:**
> Como ingeniero de simulacion, quiero ver que el pill `value` del objeto de salida se reemplace in-situ por el valor retornado para confirmar visualmente que dato ingreso al modelo.

**Contexto de negocio:**
La escritura no aparece en un log lateral ni en una consola: ocurre dentro del propio OPD. La sustitucion del placeholder `value` por `text` o `3` mantiene la continuidad visual entre diseno y ejecucion y hace del objeto-atributo un slot legible de estado de simulacion.

**Criterios de aceptacion:**
- **Dado** que el obtenedor retorna `userInput`, **cuando** confirmo el modal con `text`, **entonces** el pill interno del objeto `Entrada` reemplaza `value` por `text`.
- **Dado** que el obtenedor retorna un valor numerico parseado como `3`, **cuando** el runner re-renderiza el objeto destino, **entonces** el pill se sustituye in-situ por `3`.
- **Dado** que observo el objeto despues de la escritura, **cuando** comparo con estados categoricos como `partial` o `complete`, **entonces** la sustitucion ocurre dentro del mismo pill del slot escribible y no como anotacion aparte.

**Reglas y restricciones:**
- El placeholder observado pre-simulacion es `value`.
- La escritura observada es in-situ dentro del mismo rectangulo redondeado.
- La persistencia del valor entre corridas posteriores queda abierta.

**Modelo de datos tocado:**
- `attribute.valueSlot.currentValue` — `string | number` — transitorio de simulacion.

**Dependencias:**
- Bloqueada por: HU-B5.002, HU-B5.017.
- Bloquea a: HU-B5.020.

**Integraciones:**
- Renderer del canvas.
- Value slot del objeto computational.

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: `opcloud-reverse/b5-simulation-user-input.md` §3.3 paso 5, §3.4 pasos 4-5, §6, §9, §11.1.
- Frames: frame_00022, frame_00027, frame_00028, frame_00030.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulation-user-input, render, value-slot, overwrite, canvas].

---

### HU-B5.019 — Escribir en otros objetos-atributo mediante `updateValue`

**Actor primario:** IS.
**Tipo:** mixto.
**Nivel categorico:** K primario; V secundario.
**Superficie UI:** editor JS + canvas con aliases V-122.
**Gesto canonico:** invocacion programatica de `updateValue(alias, valor)`.

**Historia:**
> Como ingeniero de simulacion, quiero usar `updateValue` para escribir en objetos-atributo conectados ademas del objeto `genera` y asi hacer obtenedores con efectos laterales controlados por alias.

**Contexto de negocio:**
El `return` cubre el caso simple de un unico objeto de salida. `updateValue` extiende el obtenedor a escenarios donde la entrada humana debe alimentar varias casillas o una casilla distinta a la del `genera` directo. La transcripcion lo explica como una ruta alternativa mas poderosa, apoyada en aliases V-122 [V-122].

**Criterios de aceptacion:**
- **Dado** que un obtenedor tiene objetos-atributo conectados por enlaces elegibles y con alias V-122, **cuando** su cuerpo invoca `updateValue(alias, valor)`, **entonces** el runtime usa el alias como clave para resolver el objeto destino.
- **Dado** que el obtenedor escribe con `updateValue` en un alias distinto del objeto `genera`, **cuando** la simulacion continua, **entonces** el objeto-atributo afectado refleja el valor actualizado en su slot de escritura.
- **Dado** que el alias referenciado no existe o no corresponde a un objeto conectado, **cuando** el cuerpo lo usa, **entonces** el comportamiento exacto queda abierto y debe clarificarse.

**Reglas y restricciones:**
- Los aliases provienen de objetos conectados por `effect`, `instrument` o `consumption`.
- La fuente confirma el mecanismo por transcripcion, pero no muestra un frame donde se vea una llamada real a `updateValue` mutando un alias alternativo.

**Modelo de datos tocado:**
- `attribute.alias` — string — persistente. [V-122]
- `attribute.valueSlot.currentValue` — `string | number` — transitorio de simulacion.

**Dependencias:**
- Bloqueada por: HU-B5.007, HU-B5.012, HU-B5.017.

**Integraciones:**
- Sistema de aliases V-122.
- Topologia de enlaces elegibles.

**Notas de evidencia:**
- Fuente normativa: [V-122] aliases como mecanismo de escritura programatica.
- Fuente OPCloud: `opcloud-reverse/b5-simulation-user-input.md` §3.2 paso 3, §5, §6, §7, §11.7.
- Frames: frame_00014, frame_00018.
- Transcripcion: `updateValue` permite escribir en otros objetos por alias.
- Clase de afirmacion: confirmado por transcripcion + inferido.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [simulation-user-input, kernel, alias, updateValue, requires-clarification].

---

### HU-B5.020 — Listar obtenedores y atributos en `Simulated Elements`

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** dialogo `Simulated Elements`.
**Gesto canonico:** abrir modal desde toolbar de simulacion y revisar filas.

**Historia:**
> Como ingeniero de simulacion, quiero ver en `Simulated Elements` que obtenedores, funciones y atributos participan en la corrida para configurar y auditar el conjunto simulado antes de ejecutar.

**Contexto de negocio:**
El ejemplo Turtlesim confirma que un modelo complejo puede reunir varios obtenedores y varias funciones calculadoras puras a la vez. El dialogo `Simulated Elements` expone esa lista como una vista operacional previa a la ejecucion, con checkbox y boton `Set Simulation Parameters` por fila. Para obtenedores de entrada, esa vista vuelve auditable que procesos podran suspender la simulacion.

**Criterios de aceptacion:**
- **Dado** que abro `Simulated Elements`, **cuando** inspecciono la lista, **entonces** veo filas con checkbox, nombre del elemento y boton `Set Simulation Parameters`.
- **Dado** que el modelo contiene obtenedores de entrada y funciones calculadoras, **cuando** miro la lista, **entonces** ambos tipos coexisten en el mismo dialogo.
- **Dado** que estoy en el ejemplo Turtlesim, **cuando** reviso las filas visibles, **entonces** aparecen obtenedores como `Spiral Depth Selecting `, `Message Publishing `, `Counter Returning ` y `Completion Deciding ` junto con funciones puras como `Counter Incrementing ` y `Message Creating `.

**Reglas y restricciones:**
- El boton exacto que abre el dialogo desde la toolbar no quedo capturado en los frames.
- El dialogo documenta coexistencia de multiples obtenedores, pero no muestra su parametrizacion interna.

**Modelo de datos tocado:**
- `ui.simulatedElements.isOpen` — boolean — transitorio.
- `ui.simulatedElements.selection[]` — lista de ids — transitorio.

**Dependencias:**
- Bloqueada por: HU-B5.013.

**Integraciones:**
- Toolbar de simulacion.
- Inventario de procesos y objetos simulables del modelo.

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: `opcloud-reverse/b5-simulation-user-input.md` §2 tabla superficies, §3.4 paso 3, §5, §12.
- Frames: frame_00026.
- Clase de afirmacion: observado.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [simulation-user-input, ui, simulated-elements, runner, inventario].

---

### HU-B5.021 — Alimentar obtenedores de entrada con `Headless Runner`

**Actor primario:** IS.
**Actores secundarios:** IR (ingeniero de runtime).
**Tipo:** opcloud-ui.
**Nivel categorico:** X primario; U secundario.
**Superficie UI:** checkbox `Headless Runner` de la toolbar de simulacion.
**Gesto canonico:** activar checkbox antes de correr la simulacion.

**Historia:**
> Como ingeniero de simulacion, quiero ejecutar obtenedores de entrada en `Headless Runner` para alimentar el valor requerido sin abrir dialogos interactivos.

**Contexto de negocio:**
La nomenclatura `Headless Runner` sugiere una ruta no interactiva compatible con automatizacion o ejecucion sin operador humano frente a la pantalla. En la carpeta fuente el checkbox esta visible, pero nunca activado; por eso la historia se registra como candidata derivada de hipotesis y no como comportamiento confirmado.

**Criterios de aceptacion:**
- **Dado** que la toolbar de simulacion muestra `Headless Runner`, **cuando** activo ese checkbox antes de ejecutar un obtenedor, **entonces** la fuente sugiere que la corrida deberia resolver el valor sin abrir el modal `Please Enter a Value:`.
- **Dado** que el obtenedor necesita un valor en modo headless, **cuando** la simulacion lo alcance, **entonces** debe existir una fuente alternativa documentada para alimentar `userInput`.
- **Dado** que no se ha clarificado la fuente alternativa, **cuando** esta HU entre a implementacion, **entonces** debe permanecer bloqueada hasta resolver §11.4 y §11.10 del documento fuente.

**Reglas y restricciones:**
- No hay evidencia observada de Headless Runner activo en esta carpeta.
- Las fuentes alternativas mencionadas por hipotesis son XLSX, MQTT u otra integracion runtime.

**Modelo de datos tocado:**
- `simulation.runner.headless` — boolean — transitorio.

**Dependencias:**
- Bloqueada por: HU-B5.013.
- Bloquea a: HU-B5.022, HU-B5.023.

**Integraciones:**
- Runner sin UI interactiva.
- Posible cruce con EPICA-C0 (MQTT) y EPICA-C2 (ROS).

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: `opcloud-reverse/b5-simulation-user-input.md` §2 tabla superficies, §4, §5, §7, §11.4, §11.10.
- Frames: frame_00019, frame_00020, frame_00022, frame_00028.
- Clase de afirmacion: hipotesis.
- Etiqueta: `requires-clarification`.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [simulation-user-input, runner, headless, integracion-externa, requires-clarification].

---

### HU-B5.022 — Importar valores de entrada desde `XLSX`

**Actor primario:** IS.
**Actores secundarios:** IR.
**Tipo:** opcloud-ui.
**Nivel categorico:** X primario; U secundario.
**Superficie UI:** boton `XLSX` en la toolbar de simulacion.
**Gesto canonico:** clic en boton `XLSX`.

**Historia:**
> Como ingeniero de simulacion, quiero alimentar obtenedores desde una planilla `XLSX` para ejecutar corridas repetibles sin intervencion manual en cada pausa.

**Contexto de negocio:**
El boton `XLSX` aparece en la toolbar del runner, pero la carpeta no lo muestra activado ni describe su resultado. La hipotesis del documento es que podria importar valores de entrada para evitar el modal interactivo, en coherencia con Headless Runner. Se registra como HU diferida porque hoy la evidencia no alcanza para especificarla con certeza.

**Criterios de aceptacion:**
- **Dado** que la toolbar muestra un boton `XLSX`, **cuando** lo observo en contexto de obtenedores de entrada, **entonces** existe una hipotesis razonable de que pueda proveer valores batch a la simulacion.
- **Dado** que una corrida contiene uno o mas obtenedores, **cuando** esta via se clarifique, **entonces** los valores importados deberan mapearse a los puntos donde hoy aparece `Please Enter a Value:`.
- **Dado** que la carpeta fuente no demuestra el flujo, **cuando** esta HU sea priorizada, **entonces** debera mantenerse bloqueada hasta resolver §11.4 y §11.10.

**Reglas y restricciones:**
- No hay frames del dialogo o resultado de `XLSX`.
- La relacion exacta entre XLSX y `Headless Runner` es hipotetica.

**Modelo de datos tocado:**
- `simulation.runner.inputImport.source` — `"xlsx"` — transitorio/inferido.

**Dependencias:**
- Bloqueada por: HU-B5.021.

**Integraciones:**
- Runner de simulacion.
- Importacion de archivos tabulares.

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: `opcloud-reverse/b5-simulation-user-input.md` §2 tabla superficies, §4, §5, §7, §11.4, §11.10.
- Frames: frame_00019.
- Clase de afirmacion: hipotesis.
- Etiqueta: `requires-clarification`.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [simulation-user-input, xlsx, import, runner, requires-clarification].

---

### HU-B5.023 — Resolver obtenedores de entrada bajo `Async Execute`

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; X secundario.
**Superficie UI:** boton `Async Execute` en la toolbar de simulacion.
**Gesto canonico:** seleccion del modo async antes de correr.

**Historia:**
> Como ingeniero de simulacion, quiero entender como se comporta un obtenedor de entrada bajo `Async Execute` para saber si la espera humana bloquea, se degrada a sync o se resuelve por otra via.

**Contexto de negocio:**
El documento fuente considera la combinacion `Async Execute` + obtenedor de entrada como intuitivamente problematica. Un dialogo bloqueante encaja de forma natural con el runner sincrono, pero no con uno paralelo o no bloqueante. La HU se conserva porque la superficie existe en la UI y afecta decisiones de arquitectura del runner, aunque la evidencia actual solo alcanza para tratarla como pregunta abierta.

**Criterios de aceptacion:**
- **Dado** que la toolbar muestra `Async Execute`, **cuando** el modelo contiene obtenedores de entrada, **entonces** el producto necesita definir si ese modo es compatible o no con pausas por entrada humana.
- **Dado** que la compatibilidad aun no esta documentada, **cuando** esta HU se evalua para implementacion, **entonces** debe permanecer bloqueada hasta resolver §11.5 del doc fuente.
- **Dado** que se adopte una politica futura, **cuando** un obtenedor aparezca en modo async, **entonces** el runner debera comportarse de manera consistente con esa politica en todos los obtenedores del modelo.

**Reglas y restricciones:**
- No se observa ningun frame del efecto de `Async Execute` sobre el modal `Please Enter a Value:`.
- La fuente solo documenta obtenedor de entrada interactivo en `Sync Execute`.

**Modelo de datos tocado:**
- `simulation.runner.mode` — `"async"` — transitorio.

**Dependencias:**
- Bloqueada por: HU-B5.013, HU-B5.021.

**Integraciones:**
- Runner asincrono de EPICA-B0.

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: `opcloud-reverse/b5-simulation-user-input.md` §2 tabla superficies, §4, §5, §11.5.
- Frames: frame_00019.
- Clase de afirmacion: hipotesis.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [simulation-user-input, async, runner, requires-clarification].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **QB5.1** — Persistencia del valor ingresado entre corridas: ¿el slot vuelve a `value` o conserva el ultimo valor? Afecta HU-B5.018.
- **QB5.2** — Validacion previa del runtime: ¿B3 intercepta `userInput` o toda validacion queda dentro del cuerpo JS? Afecta HU-B5.016.
- **QB5.3** — Cancelacion del modal: ¿existe salida distinta de `Stop` para cerrar `Please Enter a Value:` sin abortar toda la simulacion? Afecta HU-B5.015.
- **QB5.4** — `Headless Runner`: ¿de donde proviene el valor cuando no hay dialogo interactivo? Afecta HU-B5.021.
- **QB5.5** — `Async Execute`: ¿se bloquea, degrada a sync o ignora el obtenedor? Afecta HU-B5.023.
- **QB5.6** — Regeneracion de aliases: ¿la region protegida se actualiza en vivo o solo al reabrir el editor? Afecta HU-B5.012.
- **QB5.7** — Alias indefinido: ¿`updateValue` falla silenciosamente, logea o lanza error cuando recibe un alias inexistente? Afecta HU-B5.019.
- **QB5.8** — Tipado de la entrada: ¿`userInput` siempre es string o existe un modo tipado por proceso? Afecta HU-B5.016.
- **QB5.9** — Entrada multilinea o estructurada: ¿el producto soporta formularios mas ricos que un unico campo de texto? Afecta HU-B5.015 y HU-B5.016.
- **QB5.10** — Integraciones runtime: ¿un obtenedor puede alimentarse desde MQTT o ROS en lugar de dialogo humano? Afecta HU-B5.021 y HU-B5.022.
- **QB5.11** — Marca visual del obtenedor: ¿hay badge o decoracion especifica aparte del sufijo `` para distinguirlo de una funcion calculadora pura? Afecta HU-B5.001 y HU-B5.009.
- **QB5.12** — Timeout de espera: ¿la pausa por entrada tiene limite temporal o espera indefinidamente? Afecta HU-B5.014 y HU-B5.015.

## Referencias cruzadas

- Fuente normativa: `opm-iso-19450-es.md`, `opm-visual-es.md`, `opm-opl-es.md`.
- Evidencia OPCloud: `JOYAS.md`, `sandbox-data/`, `assets/svg/`, `decompiled/`.
- Doc fuente original: `opcloud-reverse/b5-simulation-user-input.md`.
- **Epicas hermanas en simulacion:**
  - **EPICA-B0** (`simulation-conceptual`): runner base, Play/Pause/Stop, toolbar de simulacion.
  - **EPICA-B1** (`simulation-computational`): objetos computational, casillas de valor y comportamiento de procesos computacionales.
  - **EPICA-B2** (`simulation-user-functions`): sustrato general de funciones definidas por el usuario y persistencia del cuerpo JS.
  - **EPICA-B3** (`simulation-range-validation`): validacion/rangos potencialmente aplicables al `userInput`.
  - **EPICA-B4** (`simulation-conditions-loops`): control-flow del runner que consume los valores producidos por obtenedores.
- **Epicas de runtime relacionadas:**
  - **EPICA-C0** (`runtime-mqtt`): candidata para resolver entradas headless por topicos externos.
  - **EPICA-C2** (`runtime-ros`): el ejemplo Turtlesim muestra convivencia con ROS conceptual sin conexion real.
- **Invariantes y superficies del repo afectadas:**
  - Nucleo del modelo para marca de obtenedor, aliases y slot de escritura del objeto computational.
  - Renderer del canvas para sufijo ``, overlay modal y sustitucion in-situ del pill `value`.
  - Runner de simulacion para el estado suspendido `waiting_input`.
