---
epica: "EPICA-13"
titulo: "Canvas — estados (designaciones, Par de enlaces entrada-salida, supresion, layout interno)"
doc_fuente: "opcloud-reverse/13-canvas-estados.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "M0"
hu_emitidas: 20
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
ultima_actualizacion: 2026-04-23
---

## Resumen

Esta epica cubre el ciclo completo de estados dentro de un Objeto OPM: creacion inicial por pares (`estado1`, `estado2`), edicion secuencial de nombres, designaciones semanticas (`Inicial`, `Final`, `Actual declarado`, `Por defecto`), enlaces que entran y salen de estados especificos (`Par de enlaces entrada-salida`), supresion condicional, alineacion interna, duracion temporal y render visual dentro del Objeto contenedor. El axioma OPM gobernante es **con estados ≥ 2 estados**: un Objeto no puede ser con estados si tiene un solo estado — por eso la primera invocacion de `Agregar estados` siempre crea dos. Cada HU refina una unidad de valor observable del flujo y respeta la gramatica OPM donde un estado es un elemento subordinado al Objeto que lo contiene.

Las HU se numeran siguiendo la aparicion en el doc fuente y las preguntas abiertas, sin reordenar por prioridad. El mapa de correspondencia con las secciones del doc fuente se documenta en cada HU.

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-13.001 | Agregar primeros dos estados con Agregar estados desde menu contextual | MN | M0 | M | opm-semantica | [Glos 3.68] [V-237] [OPL-ES D8] |
| HU-13.002 | Agregar primeros dos estados con Agregar estados desde toolbar contextual | MN | M0 | S | opcloud-ui | — |
| HU-13.003 | Crear estado adicional individual con Agregar estados posterior | MN | M0 | S | opm-semantica | [Glos 3.68] [V-237] |
| HU-13.004 | Renombrar estado con dialogo Auto Format | MN | M0 | S | mixto | [Glos 3.68] |
| HU-13.005 | Editar estados en cadena con Enter saltando al siguiente | ME | M1 | S | opcloud-ui | — |
| HU-13.006 | Eliminar estado con accion remove del menu contextual | ME | M1 | S | opm-semantica | [V-237] [V-238] |
| HU-13.007 | Suprimir estado no conectado con suppress | ME | S | S | opcloud-ui | — |
| HU-13.008 | Validar axioma con estados: minimo dos estados por Objeto | MN | M0 | M | opm-semantica | [V-237] [V-238] [Glos 3.68] |
| HU-13.009 | Distinguir estados de values (enum fijo) y designaciones | AD | S | M | opm-semantica | [Glos 3.68] [V-237] |
| HU-13.010 | Marcar estado como Inicial con barra de designaciones | MN | M0 | S | opm-semantica | [V-4] [Glos 3.68] [OPL-ES D5] |
| HU-13.011 | Marcar estado como Final con barra de designaciones | MN | M0 | S | opm-semantica | [V-5] [Glos 3.68] [OPL-ES D6] |
| HU-13.012 | Marcar estado como Por defecto | ME | M1 | S | opm-semantica | [V-6] [Glos 3.68] [OPL-ES D7] |
| HU-13.013 | Marcar estado como Actual declarado y ver eco en simulacion | IS | S | M | mixto | [Glos 3.68] |
| HU-13.014 | Crear enlace entrante/saliente dirigido a estado especifico | ME | M0 | M | opm-semantica | [V-61] [V-237] [Glos 3.68] |
| HU-13.015 | Convertir effect link existente en Par de enlaces entrada-salida | ME | M1 | S | opcloud-ui | — |
| HU-13.016 | Ver selector con Par de enlaces entrada-salida, Condicion, Evento, Split Input | ME | M1 | S | opcloud-ui | — |
| HU-13.017 | Ver eco OPL-ES de estados posibles al crear estados | MN | M0 | S | opm-semantica | [OPL-ES D8..D13] [Glos 3.68] |
| HU-13.018 | Ver eco OPL-ES de transicion entre estados con Par de enlaces entrada-salida | MN | M0 | S | opm-semantica | [OPL-ES D8..D13] [V-237] [Glos 3.68] |
| HU-13.019 | Alinear estados internamente con layout horizontal o vertical | ME | M1 | M | opcloud-ui | — |
| HU-13.020 | Asignar duracion temporal a un estado con set-time-duration | IS | S | S | mixto | [Glos 3.68] |

Total: **20 historias de usuario** (11 opm-semantica, 6 opcloud-ui, 3 mixto).

## Historias de usuario

### HU-13.001 — Agregar primeros dos estados con Agregar estados desde menu contextual

**Actor primario:** MN (modelador novato).
**Actores secundarios:** ME (experto).
**Tipo:** opm-semantica.
**Nivel categorico:** K (kernel — crea `estado1`, `estado2` dentro de objeto) primario; V (render visual dentro del objeto) y U (menu contextual) secundarios.
**Superficie UI:** canvas-opd + menu contextual del Objeto + dialogo Auto Format potencial.
**Gesto canonico:** clic en accion `agregar-estado` del menu contextual del Objeto seleccionado.

**Historia:**
> Como modelador novato, quiero agregar los primeros estados de un Objeto con una sola invocacion de `Agregar estados` desde el menu contextual para que el sistema respete el axioma OPM y me deje dos estados por defecto sin tener que inferirlo.

**Contexto de negocio:**
OPM prohibe que un Objeto sea con estados teniendo un solo estado (axioma "con estados ≥ 2 estados"). [V-237] [V-238] OPCloud codifica ese axioma en la UI: la primera invocacion de `Agregar estados` crea automaticamente `estado1` y `estado2`. Este comportamiento ensena la regla sin texto didactico: el usuario aprende OPM modelando. El menu contextual (HU-10.019/020) ofrece acceso de proximidad a esta accion frecuente.

**Criterios de aceptacion:**
- **Dado** que tengo un Objeto `O` sin estados seleccionado y abro el menu contextual, **cuando** hago clic en la accion `agregar-estado`, **entonces** se crean dos estados hijos de `O` con nombres por defecto `estado1` y `estado2` en minuscula. [V-237] [Glos 3.68]
- **Dado** que se acaban de crear los dos estados, **cuando** miro el canvas, **entonces** se renderizan como rectangulos redondeados dentro del rectangulo de `O`, distribuidos de izquierda a derecha.
- **Dado** que se crearon los dos estados, **cuando** consulto el panel OPL-ES, **entonces** aparece la oracion `**O** puede estar \`estado1\` o \`estado2\`.` [OPL-ES D8]
- **Dado** que `O` ya tenia dos estados, **cuando** invoco `agregar-estado` de nuevo, **entonces** NO se crean dos mas en par — se crea un estado adicional unico (ver HU-13.003).
- **Dado** que `O` tenia un estado huerfano previamente (estado creado de forma anomala), **cuando** invoco `agregar-estado`, **entonces** el comportamiento se alinea con el axioma: el sistema completa hasta ≥ 2 estados.

**Reglas y restricciones:**
- Nombres por defecto: `estado1`, `estado2` — siempre en minuscula.
- Orientacion de distribucion inicial: horizontal, de izquierda a derecha (observacion §3.1).
- El axioma "con estados ≥ 2 estados" es una regla dura de SSOT OPM; su violacion NO debe ser posible a traves de la UI. [V-237] [V-238]
- La creacion inicial no abre dialogo automatico — los nombres por defecto quedan listos para edicion manual posterior (ver HU-13.004).

**Modelo de datos tocado:**
- `object.states` — array de `state` — persistente.
- `state.id` — UUID — persistente.
- `state.name` — string — persistente.
- `state.ownerObjectId` — ID del Objeto — persistente.
- `state.order` — numero — persistente (para layout inicial).

**Dependencias:**
- Bloqueada por: HU-10.002 (Objeto existe), HU-10.019/020 (menu contextual disponible).
- Bloquea a: HU-13.003, HU-13.004, HU-13.008, HU-13.010 en adelante.

**Integraciones:**
- Panel OPL-ES: emite oracion de enumeracion de estados. [OPL-ES D8..D13]
- Renderer JointJS: dibuja rectangulos redondeados dentro del Objeto.
- Layout: aplica distribucion horizontal por defecto (ver HU-13.019 para alternativas).

**Notas de evidencia:**
- Fuente normativa: [Glos 3.68] estado de objeto; [V-237] axioma con estados; [V-238] cardinalidad minima. [OPL-ES D8] enumeracion de estados.
- Fuente: `opcloud-reverse/13-canvas-estados.md` §3.1, §9.
- Frames: frame_00001, frame_00020.
- Transcripcion: "la primera operacion crea automaticamente `state1` y `state2`" y "las siguientes invocaciones de `Add states` agregan solo un estado adicional cada vez".
- Clase de afirmacion: confirmado por transcripcion + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [canvas, kernel, estados, menu-contextual, con-estados, axioma-opm].

---

### HU-13.002 — Agregar primeros dos estados con Agregar estados desde toolbar contextual

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario; U (toolbar contextual) secundaria.
**Superficie UI:** toolbar-contextual-objeto (boton `Agregar estados`).
**Gesto canonico:** clic en boton `Agregar estados` de la secondary toolbar visible al seleccionar el Objeto.

**Historia:**
> Como modelador, quiero invocar `Agregar estados` tambien desde la toolbar contextual para mantener afordancia doble (menu contextual y toolbar) segun mi estilo de trabajo.

**Contexto de negocio:**
OPCloud expone `Add states` en dos lugares: menu contextual (proximidad) y secondary toolbar (permanente). La dualidad respeta al experto que prefiere la toolbar fija y al novato que usa el menu contextual de proximidad. El resultado semantico es identico.

**Criterios de aceptacion:**
- **Dado** que tengo un Objeto seleccionado sin estados, **cuando** hago clic en `Agregar estados` de la secondary toolbar, **entonces** se crean `estado1` y `estado2` con identicas reglas que HU-13.001.
- **Dado** que hice clic desde la toolbar, **cuando** consulto el OPL-ES y el canvas, **entonces** el resultado es indistinguible de haber invocado desde el menu contextual.
- **Dado** que el Objeto no esta seleccionado, **cuando** miro la toolbar, **entonces** el boton `Agregar estados` NO esta disponible o esta deshabilitado.

**Reglas y restricciones:**
- Equivalencia semantica total con HU-13.001.
- Visibilidad del boton condicional a seleccion de Objeto.
- Aplica solo a Objetos, no a Procesos (Procesos no tienen estados).

**Modelo de datos tocado:**
- Identico a HU-13.001.

**Dependencias:**
- Bloqueada por: HU-10.002.
- Relaciona: HU-13.001.

**Integraciones:**
- Toolbar contextual (`src/ui/` secondary toolbar).
- Mismo motor de creacion que HU-13.001.

**Notas de evidencia:**
- Fuente normativa: — (afordancia alternativa, no exigida por SSOT).
- Fuente: §2 tabla superficies UI, §3.1 paso 2 ("activa `Add states` desde halo o secondary toolbar").
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [canvas, kernel, estados, toolbar-contextual, opcloud-ui].

---

### HU-13.003 — Crear estado adicional individual con Agregar estados posterior

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** K.
**Superficie UI:** menu contextual del Objeto o toolbar contextual del Objeto.
**Gesto canonico:** clic en `agregar-estado` / `Agregar estados` tras existir ya ≥ 2 estados.

**Historia:**
> Como modelador, quiero que `Agregar estados` posteriores agreguen un solo estado adicional para enriquecer el ciclo de vida de un Objeto sin forzar pares innecesarios.

**Contexto de negocio:**
El axioma de minimo dos estados se satisface con la primera creacion en par. [V-237] A partir de alli, la semantica cambia: cada invocacion agrega una unidad al repertorio de estados del Objeto. Muchos Objetos tienen 3, 4, 5 estados (p.ej. `draft / reviewed / published / archived`).

**Criterios de aceptacion:**
- **Dado** que un Objeto tiene ya 2 o mas estados, **cuando** invoco `agregar-estado` (menu contextual o toolbar), **entonces** se crea un unico estado nuevo con nombre por defecto secuencial (p.ej. `estado3`). [Glos 3.68]
- **Dado** que creo el tercer estado, **cuando** consulto el OPL-ES, **entonces** la oracion de enumeracion incluye el nuevo: `**Objeto** puede estar \`s1\`, \`s2\`, o \`s3\`.` [OPL-ES D8]
- **Dado** que creo el nuevo estado, **cuando** miro el canvas, **entonces** se renderiza contiguo a los existentes siguiendo el layout actual (horizontal o vertical segun HU-13.019).
- **Dado** que se creo el estado, **cuando** miro el menu contextual del nuevo estado, **entonces** ofrece acciones especificas (remove, suppress, styling, set-time-duration).

**Reglas y restricciones:**
- Naming por defecto: `estadoN` donde `N = orden de creacion`.
- La posicion visual respeta la orientacion del layout actual.
- No hay limite superior documentado; en la practica la usabilidad degrada por encima de 8–10 estados.

**Modelo de datos tocado:**
- `object.states[].*` — append al array — persistente.

**Dependencias:**
- Bloqueada por: HU-13.001 o HU-13.002.
- Relaciona: HU-13.017 (OPL-ES eco se actualiza).

**Integraciones:**
- Panel OPL-ES: agrega estado a enumeracion.
- Layout interno: repite distribucion.

**Notas de evidencia:**
- Fuente normativa: [Glos 3.68] estado de objeto; [V-237] cardinalidad minima; [OPL-ES D8] enumeracion de estados.
- Fuente: §3.1 nota transcripcion.
- Transcripcion: "las siguientes invocaciones de `Add states` agregan solo **un** estado adicional cada vez".
- Clase de afirmacion: confirmado por transcripcion + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [canvas, kernel, estados, creacion, post-par].

---

### HU-13.004 — Renombrar estado con dialogo Auto Format

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categorico:** U primario; K (propaga a `state.name`) secundaria.
**Superficie UI:** dialogo Auto Format sobre estado.
**Gesto canonico:** doble-clic sobre estado (o accion de edicion del menu contextual) + escritura.

**Historia:**
> Como modelador, quiero renombrar un estado con el mismo dialogo `Auto Format / Description` que uso para nombrar cosas para tener un flujo de edicion uniforme.

**Contexto de negocio:**
La uniformidad del dialogo entre cosas y estados reduce carga cognitiva y reutiliza infraestructura UI. El dialogo ofrece `Auto Format`, campo `Description` y boton `Update` analogos a HU-10.003. La necesidad de nombrar es SSOT [Glos 3.68]; el dialogo especifico es afordancia OPCloud.

**Criterios de aceptacion:**
- **Dado** que selecciono un estado con nombre `estado1`, **cuando** activo la edicion, **entonces** se abre el dialogo `Auto Format / Description` con el nombre preseleccionado para sobrescritura directa.
- **Dado** que escribo `requested` y confirmo con `Enter` o `Update`, **entonces** `state.name = "requested"` queda persistido.
- **Dado** que el dialogo estaba marcado con `Auto Format`, **cuando** escribo `online state` y confirmo, **entonces** se capitaliza segun la convencion de `Auto Format` — pero los estados canonicos suelen dejarse en minuscula, por lo que el usuario puede desmarcar (analogo a HU-10.006).
- **Dado** que cancelo la edicion (ESC o clic fuera), **cuando** se cierra el dialogo, **entonces** el nombre previo se conserva.

**Reglas y restricciones:**
- El dialogo es el mismo componente que HU-10.003, reutilizado.
- `Description` del estado se guarda en `state.description` (opcional, texto libre).
- Default semantico: estados inician en minuscula; el usuario decide si mantener convencion.

**Modelo de datos tocado:**
- `state.name` — string — persistente.
- `state.description` — string nullable — persistente.

**Dependencias:**
- Bloqueada por: HU-13.001 o HU-13.003.
- Relaciona: HU-13.005 (cadena de edicion serial).

**Integraciones:**
- Panel OPL-ES: actualiza enumeracion con nombre nuevo.
- Dialogo `Auto Format / Description` compartido con HU-10.003.

**Notas de evidencia:**
- Fuente normativa: [Glos 3.68] estado de objeto (requiere nombre).
- Fuente: §3.2, §5.3.
- Frames: frame_00010.
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [canvas, ui, dialogo-inline, rename, estados].

---

### HU-13.005 — Editar estados en cadena con Enter saltando al siguiente

**Actor primario:** ME.
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** dialogo Auto Format.
**Gesto canonico:** `Enter` tras escribir nombre → dialogo avanza al siguiente estado.

**Historia:**
> Como modelador experto, quiero que al confirmar un nombre con `Enter` el dialogo salte automaticamente al siguiente estado del mismo Objeto para renombrar varios en una sola cadena sin reabrir dialogos.

**Contexto de negocio:**
Cuando se crean estados en par (HU-13.001), los nombres por defecto `estado1`, `estado2` casi siempre requieren renombrado. Una UX que obligue a reabrir el dialogo por cada estado multiplica los gestos. OPCloud resuelve con "edicion serial": `Enter` confirma y avanza al siguiente. Es una optimizacion especifica para el flujo de state-naming tras creacion. Es afordancia OPCloud, no exigida por la SSOT.

**Criterios de aceptacion:**
- **Dado** que acabo de crear `estado1` y `estado2` y estoy editando `estado1` con dialogo abierto, **cuando** escribo `requested` y presiono `Enter`, **entonces** se persiste `estado1 → requested` y el dialogo salta automaticamente a `estado2` con el nombre preseleccionado.
- **Dado** que el dialogo esta en `estado2`, **cuando** escribo `online` y presiono `Enter`, **entonces** se persiste `estado2 → online` y si no hay mas estados por editar en la cadena, el dialogo se cierra.
- **Dado** que el dialogo esta en cadena, **cuando** cancelo con ESC, **entonces** la cadena se interrumpe y los estados restantes quedan con su nombre actual.
- **Dado** que el Objeto tiene 4 estados, **cuando** edito el primero y presiono `Enter`, **entonces** la cadena continua por los cuatro en orden.
- **Dado** que hago clic en `Update` (no `Enter`), **cuando** confirmo, **entonces** **pregunta abierta**: ¿se interrumpe la cadena o continua? Transcripcion no explicita.

**Reglas y restricciones:**
- Orden de la cadena: `state.order` ascendente.
- La cadena termina al llegar al ultimo estado sin ciclo.
- Solo aplica en edicion iniciada post-creacion en par; edicion individual de un unico estado cierra el dialogo normalmente.

**Modelo de datos tocado:**
- `state.name` — multiples escrituras secuenciales — persistente.

**Dependencias:**
- Bloqueada por: HU-13.004.
- Bloquea a: optimizacion UX futura.

**Integraciones:**
- Panel OPL-ES: se actualiza tras cada confirmacion.

**Notas de evidencia:**
- Fuente normativa: — (afordancia OPCloud, no exigida por SSOT).
- Fuente: §3.2 pasos 2–5.
- Transcripcion: "Al confirmar, OPCloud salta automaticamente al siguiente estado".
- Clase de afirmacion: confirmado por transcripcion (comportamiento `Enter`); hipotesis (comportamiento `Update`).

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, ui, dialogo-inline, edicion-serial, shortcut, enter, opcloud-ui].

---

### HU-13.006 — Eliminar estado con accion remove del menu contextual

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario; V (actualiza render) secundaria.
**Superficie UI:** menu contextual del estado + posible modal `Choose Remove Operation`.
**Gesto canonico:** clic en accion `remove` del menu contextual del estado.

**Historia:**
> Como modelador, quiero eliminar un estado especifico desde su menu contextual para depurar el ciclo de vida del Objeto sin afectar el resto del modelo.

**Contexto de negocio:**
El menu contextual del estado tiene cuatro acciones: `remove`, `suppress`, `styling`, `set-time-duration` (doc fuente §10). `remove` es la eliminacion definitiva; `suppress` oculta sin borrar (HU-13.007). Si el estado tiene enlaces entrantes o salientes, la ruta pasa por el modal `Choose Remove Operation` (delegado a EPICA-1C) porque hay impacto cascada. Eliminar es una operacion semantica que afecta el modelo OPM; el axioma [V-237] debe preservarse.

**Criterios de aceptacion:**
- **Dado** que un estado no tiene enlaces asociados y abro su menu contextual, **cuando** hago clic en `remove`, **entonces** se elimina directo y el canvas refleja la reduccion.
- **Dado** que un estado tiene enlaces entrantes o salientes, **cuando** hago clic en `remove`, **entonces** se abre el modal `Choose Remove Operation` con los scopes definidos en EPICA-1C.
- **Dado** que tras eliminar un estado el Objeto queda con un solo estado, **cuando** se procesa la eliminacion, **entonces** el axioma "con estados ≥ 2 estados" se viola: **ver HU-13.008 para la reaccion del sistema** (probablemente se fuerza eliminacion del estado restante o se bloquea la operacion). [V-237] [V-238]
- **Dado** que elimino el estado, **cuando** consulto OPL-ES, **entonces** la enumeracion se actualiza: `**Objeto** puede estar \`estados restantes\`.` [OPL-ES D8]

**Reglas y restricciones:**
- Eliminar es irreversible sin undo (HU-90.xxx).
- Cuando hay enlaces el flujo pasa por EPICA-1C.
- Reaccion al axioma "con estados ≥ 2 estados" ante dejar solo un estado — ver HU-13.008.

**Modelo de datos tocado:**
- `object.states[]` — remove por id — persistente.
- `link.target_state` o `link.source_state` — afectados en cascada.

**Dependencias:**
- Bloqueada por: HU-13.001.
- Bloquea a: HU-13.008.
- Integra: EPICA-1C (Choose Remove Operation).

**Integraciones:**
- Panel OPL-ES.
- Validador del kernel.
- EPICA-1C para scopes de eliminacion con cascada.

**Notas de evidencia:**
- Fuente normativa: [V-237] axioma con estados; [V-238] cardinalidad minima.
- Fuente: §5.2, §10 (menu contextual del estado), §4.1.
- Clase de afirmacion: confirmado en sandbox (§10).

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, kernel, estados, eliminacion, menu-contextual].

---

### HU-13.007 — Suprimir estado no conectado con suppress

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; L (vista) secundaria.
**Superficie UI:** menu contextual del estado (accion `suppress`) o secondary toolbar.
**Gesto canonico:** clic en `suppress`.

**Historia:**
> Como modelador experto, quiero ocultar un estado no conectado con `suppress` para limpiar el diagrama sin eliminar el estado del modelo.

**Contexto de negocio:**
`suppress` es exclusivo de estados (no existe en Objeto ni Proceso; ver §10 del doc fuente). Es una herramienta de vista: el estado permanece en el modelo pero desaparece del render actual. Solo opera sobre estados no conectados — un estado con enlaces no puede ser suprimido, porque ocultarlo dejaria enlaces colgantes visualmente inconsistentes. Es afordancia OPCloud de vista, no exigida por la SSOT.

**Criterios de aceptacion:**
- **Dado** que un estado NO tiene enlaces entrantes ni salientes y abro su menu contextual, **cuando** hago clic en `suppress`, **entonces** el estado desaparece del render del OPD actual pero permanece en el modelo.
- **Dado** que un estado TIENE al menos un enlace, **cuando** intento `suppress`, **entonces** la accion se rechaza con feedback visual (toast, disable, o analogo) — el estado no desaparece.
- **Dado** que un estado esta suprimido, **cuando** consulto el modelo, **entonces** sigue existiendo en `object.states`.
- **Dado** que un estado esta suprimido, **cuando** consulto el OPL-ES, **entonces** **pregunta abierta**: ¿sigue apareciendo en la enumeracion `**Objeto** puede estar ...` o se omite?
- **Dado** que un estado esta suprimido, **cuando** lo restablezco (operacion inversa pendiente de confirmar), **entonces** vuelve a aparecer en el render.

**Reglas y restricciones:**
- Precondicion dura: estado sin enlaces para poder suprimirse.
- `suppress` es operacion de vista, no de modelo.
- Efecto sobre OPL-ES: **pregunta abierta** (§11.3 doc fuente relaciona con supresion masiva).

**Modelo de datos tocado:**
- `state.suppressed` — boolean — persistente (o transitorio por vista — a clarificar).

**Dependencias:**
- Bloqueada por: HU-13.001.
- Relaciona: preguntas abiertas §11.3 doc fuente.

**Integraciones:**
- Renderer JointJS.
- Panel OPL-ES (comportamiento a clarificar).

**Notas de evidencia:**
- Fuente normativa: — (operacion de vista no exigida por SSOT).
- Fuente: §4.1, §5.1 (toolbar object), §10 (menu contextual del estado).
- Transcripcion: "`Suppress` solo opera sobre estados no conectados. Si el estado participa en links, no desaparece".
- Clase de afirmacion: confirmado por transcripcion; pregunta abierta sobre supresion masiva mixta.
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, ui, estados, supresion, menu-contextual, requires-clarification, opcloud-ui].

---

### HU-13.008 — Validar axioma con estados: minimo dos estados por Objeto

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** K (kernel — regla de integridad OPM).
**Superficie UI:** canvas + validador.
**Gesto canonico:** reactivo a cualquier operacion que afecte el conteo de estados.

**Historia:**
> Como modelador, quiero que el sistema aplique el axioma "con estados ≥ 2 estados" automaticamente para no poder producir un Objeto con estados con un solo estado — configuracion ilegal en OPM.

**Contexto de negocio:**
OPM define que un Objeto es con estados si y solo si tiene dos o mas estados enumerados. [Glos 3.68] Un solo estado no agrega informacion (equivaldria a una constante tautologica). [V-237] [V-238] OPCloud codifica el axioma en la UI creando pares por defecto (HU-13.001), y el sistema debe reaccionar ante operaciones que lo violen (eliminar el penultimo estado, agregar un solo estado a un Objeto sin estados previos en workflows irregulares).

**Criterios de aceptacion:**
- **Dado** que un Objeto tiene 2 estados y elimino uno, **cuando** procesa la eliminacion, **entonces** el sistema reacciona: (a) bloquea la eliminacion con mensaje explicativo, o (b) elimina tambien el estado restante volviendo al Objeto sin estados. **Comportamiento exacto**: pregunta abierta, a resolver con SSOT. [V-237] [V-238]
- **Dado** que intento crear un solo estado sobre Objeto sin estados (via API anomala), **cuando** se procesa, **entonces** el validador rechaza o completa automaticamente con un segundo estado por defecto.
- **Dado** que un Objeto tiene 0 estados (sin estados), **cuando** consulto su comportamiento, **entonces** es valido — el axioma aplica solo cuando el Objeto decide ser con estados.
- **Dado** que viola el axioma por cualquier razon interna, **cuando** el validador corre, **entonces** emite error `V-STATEFUL-MIN-2` (o analogo) e impide persistencia.

**Reglas y restricciones:**
- Axioma declarativo: `∀ objeto. objeto.estados.length ∈ {0} ∪ [2, ∞)`. [V-237] [V-238]
- Aplicable en creacion, eliminacion, importacion desde archivo externo.
- SSOT: `opm-iso-19450-es.md` y `metodologia-opm-es.md` son fuente.

**Modelo de datos tocado:**
- `object.states[]` — invariante de cardinalidad.

**Dependencias:**
- Relaciona: HU-13.001 (creacion en par), HU-13.006 (eliminacion).
- Bloquea a: operaciones batch que manipulen estados.

**Integraciones:**
- Validador del kernel (`src/nucleo/validacion/`).
- UI: feedback visual al usuario si la operacion se rechaza.

**Notas de evidencia:**
- Fuente normativa: [V-237] axioma con estados; [V-238] cardinalidad minima (≥ 2 o 0); [Glos 3.68] estado de objeto.
- Fuente: inferido de §3.1 (par por defecto) y transcripcion ("la primera operacion crea automaticamente `state1` y `state2`").
- Clase de afirmacion: inferido + confirmado parcialmente por transcripcion. El comportamiento ante eliminacion del penultimo estado es pregunta abierta.
- Etiqueta: `requires-clarification` (reaccion exacta).

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [canvas, kernel, estados, validacion, axioma, con-estados, requires-clarification].

---

### HU-13.009 — Distinguir estados de values (enum fijo) y designaciones

**Actor primario:** AD (autor de dominio).
**Actores secundarios:** ME, MN.
**Tipo:** opm-semantica.
**Nivel categorico:** K (conceptual, afecta tipos del modelo) primario; L (OPL-ES diferencia emision).
**Superficie UI:** kernel + eventual panel o indicador en toolbar contextual.
**Gesto canonico:** ninguno (distincion conceptual + eventual toggle de tipo).

**Historia:**
> Como autor de dominio, quiero distinguir claramente estados (ciclo de vida del Objeto) de `values` (valor de un atributo enum) y de `designaciones` (rol semantico de un estado) para modelar correctamente segun la gramatica OPM.

**Contexto de negocio:**
OPM usa tres conceptos adyacentes que se confunden:
- estados: elementos del ciclo de vida de un Objeto (p.ej. `Call` tiene estados `requested`, `online`). [Glos 3.68]
- `values`: valores enumerados de un atributo (p.ej. `Color` tiene valores `red`, `green`, `blue`).
- `designaciones`: etiquetas semanticas aplicables a un estado (`Inicial`, `Final`, `Actual declarado`, `Por defecto`). [V-4] [V-5] [V-6]

OPCloud maneja los tres de forma adyacente en la UI, pero sus semanticas son distintas. Un `value` es un estado especial de un Objeto que es atributo escalar enumerable; estados se refieren al ciclo de vida; designaciones son metadata del estado. La distincion importa para OPL-ES, para exportadores y para el validador.

**Criterios de aceptacion:**
- **Dado** que creo estados en un Objeto, **cuando** consulto su tipo interno, **entonces** son `state` (no `value`).
- **Dado** que un Objeto funciona como atributo enum (p.ej. `Status` con valores `draft/published/archived`), **cuando** su naturaleza es `value`, **entonces** la representacion interna lo refleja y el OPL-ES emite `**Objeto** es \`value\`.` en lugar de `**Objeto** puede estar \`estados\`.` [Glos 3.68]
- **Dado** que selecciono un estado, **cuando** abro la barra superior, **entonces** veo `Inicial`, `Final`, `Actual declarado`, `Por defecto` como designaciones aplicables. [V-4] [V-5] [V-6]
- **Dado** que un modelo tiene mezcla de estados y values, **cuando** lo exporto, **entonces** el formato distingue ambos tipos inequivocamente.
- **Dado** que este comportamiento no esta del todo documentado en OPCloud y la SSOT, **cuando** se construye la distincion, **entonces** se cita `metodologia-opm-es.md` y la ISO 19450 como fuentes.

**Reglas y restricciones:**
- `state` ⊂ elementos subordinados del Objeto. [Glos 3.68]
- `value` es un tipo especial de estado usado cuando el Objeto es atributo escalar enum.
- `designacion` es metadata booleana aplicable a un estado, no un tipo aparte. [V-4] [V-5] [V-6]
- **Pregunta abierta**: ¿OPCloud expone un toggle para marcar un estado como `value`? Si no, es distincion interna que el producto hereda por contexto.
- La SSOT OPM debe ser consultada para resolver ambiguedad final.

**Modelo de datos tocado:**
- `state.kind` — `"state" | "value"` — persistente.
- `state.designations` — set de `"Initial" | "Final" | "Current" | "Default"` — persistente.

**Dependencias:**
- Relaciona: HU-13.001, HU-13.010–HU-13.013, EPICA-17 (atributos).

**Integraciones:**
- Kernel OPM (`src/nucleo/tipos.ts`).
- OPL-ES renderer (emision diferenciada).
- Exportadores.

**Notas de evidencia:**
- Fuente normativa: [Glos 3.68] estado de objeto; [V-4] a [V-6] designaciones; [V-237] cardinalidad de estados.
- Fuente: inferido del doc 13 (que no menciona `values` explicitamente) + SSOT OPM que si los distingue.
- Clase de afirmacion: hipotesis basada en SSOT + abierto en UX de OPCloud.
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [canvas, kernel, estados, values, designaciones, requires-clarification].

---

### HU-13.010 — Marcar estado como Inicial con barra de designaciones

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** K (designacion persistente) primario; V (render destacado) secundaria.
**Superficie UI:** barra-designaciones (parte superior del canvas).
**Gesto canonico:** clic en boton `Inicial` de la barra con un estado seleccionado.

**Historia:**
> Como modelador, quiero marcar un estado como `Inicial` para indicar que el Objeto se crea en ese estado por defecto en el ciclo de vida.

**Contexto de negocio:**
`Inicial` es la designacion que denota el estado de nacimiento del Objeto. Es la contraparte de `Final`. La designacion es persistente (no solo visual) porque informa al validador, a simulacion y a exportadores que este estado tiene rol especial. [V-4] La narracion del doc fuente lo define: "estado en que el objeto es creado".

**Criterios de aceptacion:**
- **Dado** que selecciono un estado `s` de un Objeto, **cuando** aparece la barra de designaciones en la parte superior del canvas, **entonces** veo las cuatro opciones `Inicial`, `Final`, `Actual declarado`, `Por defecto`. [V-4] [V-5] [V-6]
- **Dado** que hago clic en `Inicial`, **cuando** se procesa, **entonces** `s.designations` incluye `"Initial"` y el render visual del estado se destaca con indicador especifico (p.ej. borde o icono). [V-4]
- **Dado** que otro estado ya era `Inicial` en el mismo Objeto, **cuando** marco un nuevo `Inicial`, **entonces** **pregunta abierta**: ¿se reemplaza (exclusividad) o se permiten multiples? Inferencia preferida: exclusividad semantica (un Objeto tiene un solo estado inicial).
- **Dado** que marco `Inicial` y guardo, **cuando** recargo, **entonces** la designacion persiste.
- **Dado** que el estado tiene designacion `Inicial`, **cuando** consulto OPL-ES, **entonces** aparece oracion adicional: `\`s\` es inicial.` [OPL-ES D5]

**Reglas y restricciones:**
- Un Objeto tiene como mucho un estado `Inicial` (inferido). [V-4]
- `Inicial` es persistente, no transitorio.
- Render visual distintivo en el estado marcado (pendiente de SSOT visual).

**Modelo de datos tocado:**
- `state.designations` — set con `"Initial"` — persistente.

**Dependencias:**
- Bloqueada por: HU-13.001.
- Relaciona: HU-13.011 (Final), HU-13.013 (Actual declarado), HU-13.018 (OPL-ES de transicion).

**Integraciones:**
- Panel OPL-ES.
- Validador (exclusividad).
- Simulacion (punto de partida).

**Notas de evidencia:**
- Fuente normativa: [V-4] designacion Inicial; [Glos 3.68] estado de objeto; [OPL-ES D5] plantilla OPL-ES de estado inicial.
- Fuente: §3.4, §5.2.
- Transcripcion: "`Initial`: estado en que el objeto es creado".
- Clase de afirmacion: confirmado por transcripcion + confirmado por SSOT; pregunta abierta sobre exclusividad.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [canvas, kernel, estados, designaciones, inicial].

---

### HU-13.011 — Marcar estado como Final con barra de designaciones

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario; V secundaria.
**Superficie UI:** barra-designaciones.
**Gesto canonico:** clic en boton `Final`.

**Historia:**
> Como modelador, quiero marcar un estado como `Final` para indicar que es terminal o de cierre del ciclo de vida del Objeto.

**Contexto de negocio:**
`Final` es la contraparte semantica de `Inicial`. [V-5] Indica que un Objeto en ese estado ha concluido su ciclo y no transiciona a otro estado (o transiciona a uno especial de termino). Informa simulacion y exportadores.

**Criterios de aceptacion:**
- **Dado** que selecciono un estado `s`, **cuando** hago clic en `Final`, **entonces** `s.designations` incluye `"Final"` y el render muestra indicador distintivo. [V-5]
- **Dado** que otro estado era `Final`, **cuando** marco uno nuevo, **entonces** **pregunta abierta**: ¿exclusividad como `Inicial` o multiples permitidos? Probable que multiples finales sean validos (un proceso puede terminar en varios estados terminales: `completed`, `cancelled`, `failed`).
- **Dado** que un estado es `Final`, **cuando** consulto OPL-ES, **entonces** aparece oracion que denota terminalidad: `\`s\` es final.` [OPL-ES D6]
- **Dado** que el estado esta marcado como `Final`, **cuando** hay enlaces que salen de el, **entonces** el validador emite warning (estado final no deberia tener salidas) — comportamiento exacto a confirmar con SSOT.

**Reglas y restricciones:**
- Multiples `Final` permitidos (hipotesis; a confirmar con SSOT). [V-5]
- Un estado puede combinar designaciones (`Inicial` + `Por defecto`, por ejemplo). Combinacion `Inicial` + `Final` es extrana pero no imposible.
- Render visual distintivo.

**Modelo de datos tocado:**
- `state.designations` — set con `"Final"` — persistente.

**Dependencias:**
- Bloqueada por: HU-13.001.
- Relaciona: HU-13.010, HU-13.018.

**Integraciones:**
- Panel OPL-ES.
- Validador.
- Simulacion.

**Notas de evidencia:**
- Fuente normativa: [V-5] designacion Final; [Glos 3.68] estado de objeto; [OPL-ES D6] plantilla OPL-ES de estado final.
- Fuente: §3.4, §5.2.
- Transcripcion: "`Final`: estado terminal o de cierre".
- Clase de afirmacion: confirmado por transcripcion + confirmado por SSOT; pregunta abierta sobre cardinalidad.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [canvas, kernel, estados, designaciones, final].

---

### HU-13.012 — Marcar estado como Por defecto

**Actor primario:** ME.
**Actores secundarios:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario.
**Superficie UI:** barra-designaciones.
**Gesto canonico:** clic en boton `Por defecto`.

**Historia:**
> Como modelador, quiero marcar un estado como `Por defecto` para distinguir el estado en que el Objeto se crea la mayoria de las veces, cuando ese estado no es necesariamente el `Inicial`.

**Contexto de negocio:**
`Por defecto` es el estado "usual" de creacion. [V-6] La narracion del doc fuente lo define: "estado por defecto al crearse el objeto la mayoria de las veces". Puede coincidir con `Inicial` pero tambien divergir: un Objeto puede modelar un estado inicial formal distinto del estado por defecto pragmatico.

**Criterios de aceptacion:**
- **Dado** que selecciono un estado, **cuando** hago clic en `Por defecto`, **entonces** `s.designations` incluye `"Default"` con render destacado. [V-6]
- **Dado** que un Objeto tiene `Inicial` y `Por defecto` marcados en estados distintos, **cuando** consulto OPL-ES, **entonces** emite ambas oraciones diferenciadas.
- **Dado** que marco `Por defecto` en otro estado, **cuando** se procesa, **entonces** **pregunta abierta**: ¿exclusividad o multiples? Inferencia preferida: exclusividad (un solo `Por defecto` por Objeto). [V-6]
- **Dado** que `Por defecto` e `Inicial` coinciden en el mismo estado, **cuando** miro el render, **entonces** ambas designaciones se muestran sin conflicto.

**Reglas y restricciones:**
- Relacion semantica con `Inicial`: `Por defecto` puede o no coincidir.
- Exclusividad: 1 por Objeto (inferido). [V-6]
- Render visual distintivo, acumulable con otras designaciones del mismo estado.

**Modelo de datos tocado:**
- `state.designations` — set con `"Default"` — persistente.

**Dependencias:**
- Bloqueada por: HU-13.001.
- Relaciona: HU-13.010.

**Integraciones:**
- Panel OPL-ES.
- Exportadores.

**Notas de evidencia:**
- Fuente normativa: [V-6] designacion Por defecto; [Glos 3.68] estado de objeto; [OPL-ES D7] plantilla OPL-ES de estado por defecto.
- Fuente: §3.4, §5.2, §9.
- Transcripcion: "`Default`: estado por defecto al crearse el objeto la mayoria de las veces".
- Clase de afirmacion: confirmado por transcripcion; pregunta abierta sobre exclusividad e interaccion con `Inicial`.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, kernel, estados, designaciones, por-defecto].

---

### HU-13.013 — Marcar estado como Actual declarado y ver eco en simulacion

**Actor primario:** IS (ingeniero de simulacion).
**Actores secundarios:** ME.
**Tipo:** mixto.
**Nivel categorico:** K (persistencia ambigua) + V (render en vivo) + D (integracion con simulacion B0).
**Superficie UI:** barra-designaciones + canvas durante simulacion.
**Gesto canonico:** clic en `Actual declarado` (fuera de simulacion); actualizacion automatica (dentro de simulacion).

**Historia:**
> Como ingeniero de simulacion, quiero ver marcado el estado `Actual declarado` del Objeto durante la simulacion conceptual para identificar la traza de ejecucion en vivo.

**Contexto de negocio:**
`Actual declarado` tiene semantica ambigua segun la transcripcion: "estado actual en simulacion". La SSOT [Glos 3.68] reconoce el concepto de estado actual pero no prescribe si es persistente o calculado. No esta claro si es persistente (el modelador marca `Actual declarado` manualmente, como una designacion mas) o si es calculado por la simulacion (al correr B0, se marca automaticamente el estado en que esta el Objeto). El doc fuente deja la ambiguedad abierta en §11.1: "si `Current` se persiste o se calcula solo durante simulacion".

**Criterios de aceptacion:**
- **Dado** que selecciono un estado fuera de simulacion, **cuando** hago clic en `Actual declarado`, **entonces** **ruta A**: se persiste como designacion (`state.designations` += `"Current"`) con render distintivo, o **ruta B**: el sistema rechaza la accion indicando que `Actual declarado` es solo runtime.
- **Dado** que corro una simulacion conceptual (EPICA-B0), **cuando** la simulacion avanza a un estado `s`, **entonces** `s` se visualiza marcado como `Actual declarado` en el canvas en tiempo real (eco visual).
- **Dado** que la simulacion termina, **cuando** consulto el estado `Actual declarado`, **entonces** **pregunta abierta**: ¿se mantiene el marcador o se limpia?
- **Dado** que dos Objetos tienen estados `Actual declarado` distintos simultaneamente, **cuando** corre simulacion paralela, **entonces** el render los distingue.

**Reglas y restricciones:**
- Semantica de persistencia de `Actual declarado` es pregunta abierta (§11.1 doc fuente).
- Integracion con EPICA-B0 (simulacion conceptual) es necesaria para el comportamiento completo.
- Render visual debe ser notorio (la simulacion depende de este feedback).

**Modelo de datos tocado:**
- `state.designations` incluye `"Current"` — **pregunta abierta**: persistente vs transitorio.
- Alternativa: `simulation.currentStateByObjectId[objectId] = stateId` — transitorio.

**Dependencias:**
- Bloqueada por: HU-13.001, EPICA-B0 (simulacion conceptual).
- Relaciona: HU-13.010, HU-13.011, HU-13.018.

**Integraciones:**
- Motor de simulacion (EPICA-B0).
- Renderer en vivo.
- Panel OPL-ES (emision diferenciada en simulacion).

**Notas de evidencia:**
- Fuente normativa: [Glos 3.68] estado de objeto (admite estado actual).
- Fuente: §3.4, §5.2, §9, §11.1.
- Transcripcion: "`Current`: estado actual en simulacion".
- Clase de afirmacion: confirmado por transcripcion parcial; ambiguedad de persistencia abierta.
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [canvas, estados, designaciones, actual-declarado, simulacion, render-vivo, requires-clarification].

---

### HU-13.014 — Crear enlace entrante/saliente dirigido a estado especifico

**Actor primario:** ME.
**Actores secundarios:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario; V (render de port a estado) secundaria.
**Superficie UI:** canvas + link-table (doc 10 §5.2).
**Gesto canonico:** arrastre desde un proceso al estado especifico de un Objeto (no al Objeto como un todo).

**Historia:**
> Como modelador experto, quiero crear enlaces que terminen o salgan de un estado especifico (no del Objeto completo) para capturar transiciones semanticas precisas del ciclo de vida.

**Contexto de negocio:**
Un enlace normal va de Objeto A a Proceso P (o viceversa). Un enlace a estado especifico va de Proceso P al estado `online` del Objeto `Call`, lo que comunica una transicion: "P lleva `Call` a `online`". Esta precision es central al modelado OPM de ciclos de vida. [V-237] [Glos 3.68] El doc fuente ejemplifica: "arrastrar directamente desde un estado al proceso destino".

**Criterios de aceptacion:**
- **Dado** que un Objeto tiene estados visibles, **cuando** hago arrastre desde el borde de un estado especifico hacia un Proceso, **entonces** se inicia un enlace cuya `source_state` es el estado, no el Objeto. [V-61]
- **Dado** que soltar sobre un Proceso P, **cuando** se abre la link table, **entonces** aparece la opcion `Par de enlaces entrada-salida` (ver HU-13.015/016) junto a las otras del picker.
- **Dado** que creo el enlace, **cuando** consulto el modelo, **entonces** `link.source_state = s1.id` y `link.target = P.id` (no `link.source = Object.id`).
- **Dado** que consulto OPL-ES, **cuando** emite la oracion, **entonces** refleja transicion especifica: `*P* cambia **Objeto** de \`origen\` a \`destino\`.` (ver HU-13.018). [OPL-ES D8..D13]
- **Dado** que elimino un estado con enlaces, **cuando** procesa, **entonces** flujo de EPICA-1C dispara cascada.

**Reglas y restricciones:**
- Un enlace puede tener `source_state` y `target_state` null (referencia al Objeto completo) o no-null (referencia a estado especifico). [V-61]
- La zona magnet en el borde del estado debe ser suficientemente sensible.
- El OPL-ES debe diferenciar enlace a Objeto completo vs enlace a estado. [OPL-ES D8..D13]

**Modelo de datos tocado:**
- `link.source_state` — ID de state nullable — persistente.
- `link.target_state` — ID de state nullable — persistente.

**Dependencias:**
- Bloqueada por: HU-13.001, HU-10.007 (mecanica de arrastre de enlaces).
- Bloquea a: HU-13.018.

**Integraciones:**
- Link table (EPICA-10).
- Panel OPL-ES.
- Validador (tipos de enlace validos a estados).

**Notas de evidencia:**
- Fuente normativa: [V-61] anatomia formal de enlace; [V-237] estados en enlaces; [Glos 3.68] estado de objeto.
- Fuente: §3.3, §6 (modelo implicito).
- Frames: frame_00030.
- Clase de afirmacion: observado + confirmado.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [canvas, kernel, enlaces, estados, arrastre, transicion].

---

### HU-13.015 — Convertir effect link existente en Par de enlaces entrada-salida

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario; U (icono de intercambio) secundaria.
**Superficie UI:** toolbar contextual del enlace o menu contextual del enlace.
**Gesto canonico:** clic en icono de intercambio/conversion sobre un effect link existente.

**Historia:**
> Como modelador experto, quiero convertir un effect link ya creado en un `Par de enlaces entrada-salida` para especializar la transicion entre estados sin borrar el enlace y rehacerlo.

**Contexto de negocio:**
Un `effect link` conecta Proceso y Objeto genericamente. Convertirlo en un `Par de enlaces entrada-salida` significa anclar source_state y target_state a estados especificos del Objeto. OPCloud ofrece dos caminos para crear un par: (1) convertir effect existente, (2) crear directo desde un estado al proceso (HU-13.014). Convertir existente es la ruta de refactorizacion. Es afordancia OPCloud, no exigida por la SSOT.

**Criterios de aceptacion:**
- **Dado** que existe un effect link entre Proceso P y Objeto `Call`, **cuando** selecciono el enlace y abro su toolbar/menu contextual, **entonces** veo un icono de intercambio (swap/convert).
- **Dado** que hago clic en el icono, **cuando** se procesa, **entonces** se abre un dialogo para elegir `source_state` (p.ej. `requested`) y `target_state` (p.ej. `online`).
- **Dado** que confirmo source y target, **cuando** se procesa, **entonces** el enlace original se reemplaza por un Par de enlaces entrada-salida persistido con esos estados.
- **Dado** que converti el enlace, **cuando** consulto OPL-ES, **entonces** emite oracion de transicion (HU-13.018).
- **Dado** que cancelo la conversion, **cuando** cierro el dialogo, **entonces** el enlace original se mantiene intacto.

**Reglas y restricciones:**
- Conversion preserva semantica OPM (no crea enlace ilegal).
- Reversibilidad: convertir de Par de enlaces entrada-salida a effect link es pregunta abierta.
- El icono de intercambio es especifico del contexto de enlace seleccionado.

**Modelo de datos tocado:**
- `link` — mutacion de `source_state` y `target_state` de null a IDs.
- `link.kind` — transicion de `"effect"` a `"in-out-pair"` (o analogo en el schema).

**Dependencias:**
- Bloqueada por: HU-13.001, HU-10.011 (enlace existente).
- Relaciona: HU-13.014, HU-13.016.

**Integraciones:**
- Kernel (mutacion de enlace).
- Panel OPL-ES.

**Notas de evidencia:**
- Fuente normativa: — (afordancia OPCloud, no exigida por SSOT).
- Fuente: §3.3 ("convertir un effect link ya existente mediante el icono de intercambio").
- Clase de afirmacion: observado.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, kernel, enlaces, estados, par-entrada-salida, conversion, opcloud-ui].

---

### HU-13.016 — Ver selector con Par de enlaces entrada-salida, Condicion, Evento, Split Input

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; K (validacion) secundaria.
**Superficie UI:** modal-link-table en contexto estado.
**Gesto canonico:** ninguno (render inmediato post-drop sobre estado).

**Historia:**
> Como modelador experto, quiero ver en el selector de enlace los cuatro tipos especializados cuando el origen o destino es un estado (Par de enlaces entrada-salida, Condicion, Evento, Split Input Link Pair) para elegir con precision el tipo de transicion.

**Contexto de negocio:**
Los enlaces que tocan estados tienen un sub-picker especializado con cuatro tipos:
- `Par de enlaces entrada-salida`: transicion bidireccional estado-inicial/estado-final.
- `Condicion`: transicion condicional.
- `Evento`: transicion disparada por evento externo.
- `Split Input Link Pair`: pair con input que se bifurca.

Cada tipo tiene semantica distinta y OPL-ES propia. El selector es parte de la link table extendida (doc 10 §5.2) cuando el arrastre involucra un estado. Es afordancia OPCloud de selector, no exigida por la SSOT.

**Criterios de aceptacion:**
- **Dado** que hago drop de un arrastre cuyo origen o destino es un estado, **cuando** se abre la link table, **entonces** veo las cuatro opciones especializadas junto a (o en lugar de) las opciones estandar.
- **Dado** que cada opcion tiene OPL-ES preview (como HU-10.009), **cuando** paso sobre una fila, **entonces** veo la oracion OPL-ES que se emitira.
- **Dado** que elijo `Par de enlaces entrada-salida`, **cuando** confirmo, **entonces** se crea el par con source y target state.
- **Dado** que elijo `Condicion`, **cuando** confirmo, **entonces** se crea un enlace condicional (delegado a EPICA-B4).
- **Dado** que elijo `Evento`, **cuando** confirmo, **entonces** se crea un enlace de evento.
- **Dado** que elijo `Split Input Link Pair`, **cuando** confirmo, **entonces** se crea el enlace con bifurcacion.

**Reglas y restricciones:**
- Los cuatro tipos son mutuamente exclusivos por enlace.
- `Condicion` relaciona con EPICA-B4 (simulation conditions/loops).
- `Evento` relaciona con runtime externo (EPICA-C0).

**Modelo de datos tocado:**
- `link.kind` — enum incluye `"in-out-pair" | "condition" | "event" | "split-input-pair"` — persistente.

**Dependencias:**
- Bloqueada por: HU-13.014 o HU-13.015.
- Relaciona: EPICA-B4, EPICA-C0.

**Integraciones:**
- Link table (EPICA-10).
- Panel OPL-ES renderer.
- Validador.

**Notas de evidencia:**
- Fuente normativa: — (afordancia OPCloud de UI, no exigida por SSOT).
- Fuente: §3.3 tabla de opciones.
- Clase de afirmacion: observado + confirmado.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, ui, link-table, estados, par-entrada-salida, condicion, evento, split-input, opcloud-ui].

---

### HU-13.017 — Ver eco OPL-ES de estados posibles al crear estados

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** L (lente OPL-ES).
**Superficie UI:** panel OPL-ES.
**Gesto canonico:** ninguno (actualizacion automatica).

**Historia:**
> Como modelador novato, quiero ver en el OPL-ES la enumeracion de estados posibles del Objeto apenas los creo para aprender la gramatica OPM mientras modelo.

**Contexto de negocio:**
El eco OPL-ES inmediato es el mecanismo pedagogico central (identico principio que HU-10.016). Al crear estados en un Objeto, el sistema emite la oracion canonica `**Objeto** puede estar \`estado1\` o \`estado2\`.` Esta oracion ensena el patron de enumeracion y refuerza el axioma "con estados ≥ 2 estados". [OPL-ES D8..D13]

**Criterios de aceptacion:**
- **Dado** que acabo de crear los primeros dos estados `estado1` y `estado2` sobre `Call`, **cuando** consulto el OPL-ES, **entonces** aparece la oracion `**Call** puede estar \`estado1\` o \`estado2\`.` [OPL-ES D8]
- **Dado** que renombro los estados a `requested` y `online`, **cuando** consulto OPL-ES, **entonces** la oracion se actualiza a `**Call** puede estar \`requested\` o \`online\`.` [OPL-ES D8]
- **Dado** que agrego un tercer estado `completed`, **cuando** consulto OPL-ES, **entonces** la oracion se actualiza a `**Call** puede estar \`requested\`, \`online\`, o \`completed\`.` (uso de coma Oxford + `o`). [OPL-ES D8..D13]
- **Dado** que elimino un estado, **cuando** consulto OPL-ES, **entonces** se re-enumera.
- **Dado** que un Objeto tiene 0 estados (sin estados), **cuando** consulto OPL-ES, **entonces** NO aparece la oracion `**Objeto** puede estar ...` (solo aparece si hay enumeracion).

**Reglas y restricciones:**
- Formato canonico: `**Objeto** puede estar \`estados separados por coma\`, o \`ultimo\`.` [OPL-ES D8..D13]
- Orden de enumeracion: `state.order` ascendente.
- Eco OPL-ES se regenera desde modelo sin cache.
- Conjuncion final: `o` (no `y` — son alternativas, no simultaneas).

**Modelo de datos tocado:**
- Lectura de `object.states`.

**Dependencias:**
- Bloqueada por: HU-13.001.
- Relaciona: HU-13.003 (agregacion), HU-13.018 (transiciones).

**Integraciones:**
- Motor OPL-ES (`src/render/opl-renderer.ts`).
- Kernel (modelo de estados).

**Notas de evidencia:**
- Fuente normativa: [OPL-ES D8..D13] plantillas OPL-ES de estados; [Glos 3.68] estado de objeto.
- Fuente: §3.1 paso 5 (`Call can be state1 or state2.`), §7.2.
- Clase de afirmacion: observado + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [canvas, opl-es, estados, lente, pedagogico].

---

### HU-13.018 — Ver eco OPL-ES de transicion entre estados con Par de enlaces entrada-salida

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** L.
**Superficie UI:** panel OPL-ES.
**Gesto canonico:** ninguno (actualizacion automatica tras crear Par de enlaces entrada-salida).

**Historia:**
> Como modelador, quiero ver en el OPL-ES la oracion que describe la transicion entre estados cuando creo un Par de enlaces entrada-salida para confirmar que capture la semantica correcta del ciclo de vida.

**Contexto de negocio:**
Cuando un Proceso P lleva a un Objeto Call desde `requested` a `online`, OPL-ES emite `*Call Transmitting* cambia **Call** de \`requested\` a \`online\`.` (ejemplo textual del doc fuente). Esta oracion verbaliza la transicion de forma natural y es critica para validar que el modelo capture la intencion. [OPL-ES D8..D13]

**Criterios de aceptacion:**
- **Dado** que creo un Par de enlaces entrada-salida desde `estado=requested` de `Call` hacia Proceso `CallTransmitting` y de vuelta a `estado=online`, **cuando** consulto OPL-ES, **entonces** aparece `*Call Transmitting* cambia **Call** de \`requested\` a \`online\`.` [OPL-ES D8..D13] [V-237]
- **Dado** que cambio el source_state a `initiated`, **cuando** se actualiza el enlace, **entonces** la oracion OPL-ES se actualiza en vivo.
- **Dado** que el proceso se renombra, **cuando** confirmo el rename, **entonces** la oracion OPL-ES refleja el nuevo nombre del proceso.
- **Dado** que creo un enlace de Condicion, **cuando** consulto OPL-ES, **entonces** aparece una oracion con semantica de condicion (ver EPICA-B4).
- **Dado** que creo un enlace de Evento, **cuando** consulto OPL-ES, **entonces** aparece una oracion con semantica de evento.
- **Dado** que creo un enlace de Condicion, **cuando** consulto OPL-ES, **entonces** aparece una oracion con semantica condicional.

**Reglas y restricciones:**
- Formato canonico: `*Proceso* cambia **Objeto** de \`estado_origen\` a \`estado_destino\`.` [OPL-ES D8..D13]
- Variantes por tipo de enlace (Condicion, Evento) tienen formatos propios — ver EPICA-B4 y EPICA-C0.
- Panel OPL-ES se regenera desde modelo.

**Modelo de datos tocado:**
- Lectura de `link.source_state`, `link.target_state`, `link.kind`.

**Dependencias:**
- Bloqueada por: HU-13.014, HU-13.015, HU-13.016.
- Relaciona: HU-13.017.

**Integraciones:**
- Motor OPL-ES.

**Notas de evidencia:**
- Fuente normativa: [OPL-ES D8..D13] plantillas OPL-ES de transicion de estados; [V-237] enlaces a estados; [Glos 3.68] estado de objeto.
- Fuente: §3.3 ejemplo (`Call Transmitting changes Call from requested to online.`), §7.2.
- Clase de afirmacion: observado + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [canvas, opl-es, estados, transicion, lente, par-entrada-salida].

---

### HU-13.019 — Alinear estados internamente con layout horizontal o vertical

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** V (render y layout).
**Superficie UI:** toolbar contextual del Objeto (alineacion interna).
**Gesto canonico:** clic en boton de alineacion (izquierda, arriba, derecha, abajo).

**Historia:**
> Como modelador experto, quiero alinear los estados dentro de un Objeto horizontal o verticalmente para controlar la legibilidad del diagrama segun la densidad y la intencion visual.

**Contexto de negocio:**
OPCloud ofrece al menos dos layouts para estados (horizontal y vertical; §4.3 doc fuente). La alineacion interna es un control del Objeto contenedor que reubica los estados sin modificar su orden semantico. Es afordancia OPCloud de layout visual, no exigida por la SSOT.

**Criterios de aceptacion:**
- **Dado** que un Objeto tiene estados en layout horizontal, **cuando** hago clic en alineacion vertical desde la toolbar contextual, **entonces** los estados se reordenan verticalmente (de arriba a abajo).
- **Dado** que los estados estaban en vertical, **cuando** hago clic en horizontal, **entonces** se reordenan izquierda a derecha.
- **Dado** que cambie el layout, **cuando** agrego un nuevo estado (HU-13.003), **entonces** el estado nuevo se agrega siguiendo el layout actual.
- **Dado** que el layout es una propiedad del Objeto, **cuando** guardo y recargo, **entonces** el layout persiste.
- **Dado** que cambio el layout interno, **cuando** consulto OPL-ES, **entonces** la oracion no cambia (layout es visual, no semantico).

**Reglas y restricciones:**
- Layouts soportados: horizontal (LTR), vertical (TTB) — minimo dos.
- Layout del Objeto con estados: propiedad persistida.
- El layout interno NO afecta el orden semantico (`state.order`) — solo la distribucion visual.
- Render responsive: si el Objeto no tiene espacio para el layout elegido, el Objeto redimensiona.

**Modelo de datos tocado:**
- `object.statesLayout` — `"horizontal" | "vertical"` — persistente.

**Dependencias:**
- Bloqueada por: HU-13.001.
- Relaciona: HU-13.003.

**Integraciones:**
- Renderer JointJS.
- Layout engine (`src/render/layout/`).

**Notas de evidencia:**
- Fuente normativa: — (afordancia OPCloud de layout visual, no exigida por SSOT).
- Fuente: §4.3, §5.1.
- Frames: frame_00060.
- Transcripcion: "OPCloud admite al menos dos layouts: horizontal, vertical. No fuerza una unica disposicion".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** M.
**Etiquetas:** [canvas, render, layout, estados, alineacion, opcloud-ui].

---

### HU-13.020 — Asignar duracion temporal a un estado con set-time-duration

**Actor primario:** IS (ingeniero de simulacion).
**Actores secundarios:** ME.
**Tipo:** mixto.
**Nivel categorico:** K (atributo nuevo) primario; D (integracion con simulacion) secundaria.
**Superficie UI:** menu contextual del estado (accion `set-time-duration`).
**Gesto canonico:** clic en accion `set-time-duration` del menu contextual + escritura de valor en dialogo.

**Historia:**
> Como ingeniero de simulacion, quiero anotar cuanto dura un estado en el tiempo para modelar la permanencia (no solo la duracion de procesos) y alimentar simulaciones temporales.

**Contexto de negocio:**
OPM clasico asocia duracion a procesos (HU-B0.xxx). OPCloud extiende la duracion tambien a estados: un estado `online` puede durar 5 minutos, un estado `idle` puede durar hasta evento externo. La accion `set-time-duration` esta en el menu contextual del estado (doc fuente §10), a diferencia de Objeto y Proceso donde la duracion vive en otra superficie. Es una extension de OPCloud sobre la SSOT OPM. [Glos 3.68] no prescribe duracion en estados.

**Criterios de aceptacion:**
- **Dado** que selecciono un estado y abro su menu contextual, **cuando** hago clic en `set-time-duration`, **entonces** se abre un dialogo para ingresar valor de duracion (numero + unidad).
- **Dado** que ingreso `5 minutes` y confirmo, **cuando** se persiste, **entonces** `state.duration = { value: 5, unit: "minutes" }`.
- **Dado** que una duracion esta asignada, **cuando** consulto OPL-ES, **entonces** **pregunta abierta (§11.4 doc fuente)**: ¿emite oracion `El estado X tiene duracion Y`?
- **Dado** que el Objeto esta dentro de un proceso con duracion propia, **cuando** corre simulacion, **entonces** la interaccion entre ambas duraciones es pregunta abierta (§11.4).
- **Dado** que limpio la duracion (reset a null), **cuando** confirmo, **entonces** el estado vuelve a no tener duracion asignada.

**Reglas y restricciones:**
- Unidades permitidas: a definir (probablemente segundos, minutos, horas, etc.; ver EPICA-B0).
- Valor por default: sin duracion (null).
- Interaccion con duracion del proceso contenedor: pregunta abierta.
- OPL-ES especifica: pregunta abierta.

**Modelo de datos tocado:**
- `state.duration.value` — numero — persistente nullable.
- `state.duration.unit` — string enum — persistente nullable.

**Dependencias:**
- Bloqueada por: HU-13.001.
- Relaciona: EPICA-B0 (simulation conceptual).

**Integraciones:**
- Motor de simulacion (EPICA-B0).
- Panel OPL-ES (comportamiento a clarificar).

**Notas de evidencia:**
- Fuente normativa: [Glos 3.68] estado de objeto (no prescribe duracion).
- Fuente: §10.1, §11.4.
- Clase de afirmacion: confirmado en sandbox (§10 menu contextual del estado); preguntas abiertas sobre OPL-ES e interaccion con proceso contenedor.
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, estados, duracion, simulacion, menu-contextual, requires-clarification].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q13.1**: Si `Actual declarado` se persiste o se calcula solo durante simulacion (cf. HU-13.013). Marcada `requires-clarification`.
- **Q13.2**: Si un estado puede combinar varias designaciones a la vez (`Inicial` + `Por defecto`, `Inicial` + `Final`, etc.). Afecta HU-13.010, HU-13.011, HU-13.012, HU-13.013.
- **Q13.3**: Que sucede si se aplica `Suppress` a un conjunto grande de estados con mezcla de conectados y no conectados (cf. HU-13.007). Marcada `requires-clarification`.
- **Q13.4**: Si `set-time-duration` sobre un estado produce OPL-ES especifica (p.ej. `El estado X tiene duracion Y`) y como interactua con la duracion del proceso contenedor (cf. HU-13.020). Marcada `requires-clarification`.
- **Q13.5**: Comportamiento exacto ante eliminacion del penultimo estado: ¿bloqueo, cascada, o retorno a sin estados? (cf. HU-13.006, HU-13.008). Marcada `requires-clarification`.
- **Q13.6**: Distincion operativa entre `state` y `value` en la UI de OPCloud — ¿existe toggle explicito? (cf. HU-13.009). Marcada `requires-clarification`.
- **Q13.7**: Comportamiento exacto de la cadena de edicion serial ante `Update` vs `Enter` (cf. HU-13.005).
- **Q13.8**: Reversibilidad de la conversion Par de enlaces entrada-salida → effect link (cf. HU-13.015).
- **Q13.9**: Exclusividad de `Por defecto` e `Inicial` entre si y entre ellos y otros estados (cf. HU-13.010, HU-13.012).
- **Q13.10**: Comportamiento del OPL-ES cuando un estado esta `suppressed`: ¿se enumera o se omite? (cf. HU-13.007, HU-13.017).

## Referencias cruzadas

- Doc fuente: `opcloud-reverse/13-canvas-estados.md`.
- Epicas que dependen de esta: **EPICA-11** (modelado basico — enlaces tocan estados), **EPICA-12** (inzooming — estados viven en refinables), **EPICA-1C** (validaciones — remove con cascada), **EPICA-50** (panel OPL-ES — eco de estados y transiciones), **EPICA-B0** (simulation conceptual — `Actual declarado` y duracion temporal), **EPICA-B4** (conditions/loops — enlace de Condicion), **EPICA-C0** (runtime MQTT — enlace de Evento).
- Epicas que bloquean a esta: **EPICA-10** (creacion de Objeto, menu contextual, link table), **EPICA-12** (Objeto refinable donde viven estados en el ejemplo `Call`).
- Invariantes del repo: `src/nucleo/tipos.ts` (Object, State, designaciones), `src/nucleo/validacion/` (axioma con estados ≥ 2, compatibilidad de enlaces a estados), `src/render/jointjs/` (fabrica de rectangulo redondeado, render de designaciones, render de enlaces con source_state/target_state), `src/render/opl-renderer.ts` (eco de enumeracion y transiciones), `src/render/layout/` (layout horizontal vs vertical de estados internos).
- Fuente normativa SSOT: `opm-iso-19450-es.md` (axioma con estados [Glos 3.68] [V-237] [V-238]), `metodologia-opm-es.md` (estados vs values vs designaciones), `opm-visual-es.md` (render de rectangulos redondeados, designaciones, dashed vs solid), `opm-opl-es.md` (oraciones canonicas de enumeracion y transicion [OPL-ES D5..D13]).
