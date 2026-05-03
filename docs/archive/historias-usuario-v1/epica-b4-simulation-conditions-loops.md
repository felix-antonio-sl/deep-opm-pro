---
epica: "EPICA-B4"
titulo: "Simulacion — condiciones y bucles (control-flow sobre la ejecucion)"
doc_fuente: "opcloud-reverse/b4-simulation-conditions-loops.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "S"
hu_emitidas: 26
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
ultima_actualizacion: 2026-04-28
---

## Resumen

Esta epica cubre las primitivas que el modelador usa para controlar el flujo de una simulacion activa mediante dos mecanismos acoplados: **condiciones** sobre enlaces de entrada (marcadas con modificador `c` + piruleta blanca) y **bucles** modelados como auto-invocaciones hacia el ancestro in-zoomed. Tambien incluye el vocabulario visual que la simulacion dibuja sobre el canvas (token verde animado, sufijo `<>` sobre procesos computacionales, tooltip con cuerpo de funcion), el editor inline `Function:`, el dialogo `Please select one of the following values` con pesos yes/no, y la deteccion de bucles infinitos.

El actor predominante es **IS (ingeniero de simulacion)**: alguien que ya tiene el modelo OPM armado y ahora lo ejecuta para validar hipotesis de control-flow. Algunas HU tocan tambien a MN (modelador novato que introduce condiciones por primera vez) y ME (modelador experto que ajusta pesos probabilisticos).

Esta epica **depende** fuertemente de EPICA-B1 (computationality del proceso) y EPICA-B0 (runner basico play/pause/stop). Varias HU se marcan como bloqueadas o con referencias cruzadas. La feature es **S (should-have)** predominantemente — es diferencial frente al OPM canonico pero no es kernel OPM estricto.

La gramatica de condicion en OPL canonico usa las palabras clave `si`, `de lo contrario`, `en cuyo caso`, `ocurre` y `se omite` [OPL-ES §2]. Las plantillas canonicas completas para condiciones con estado especificado se definen en [OPL-ES §7 CS1..CS6]. La invocacion se rige por [OPL-ES §8.2 IV1, IV2].

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-B4.001 | Marcar enlace instrumento como condicional con modificador `c` | IS | S | M | simulacion-opm | [OPL-ES §7 CS1] [V-61] |
| HU-B4.002 | Marcar enlace consumo como condicional con modificador `c` | IS | S | S | simulacion-opm | [OPL-ES §7 CS1] |
| HU-B4.003 | Ver piruleta blanca en extremo-proceso de enlace condicional | IS | S | XS | opcloud-ui | [V-1 §4] [JOYAS §1] |
| HU-B4.004 | Ver letra `c` adyacente a piruleta en enlace condicional | IS | S | XS | opcloud-ui | — |
| HU-B4.005 | Anclar enlace condicional a estado especifico del objeto origen | IS | S | M | simulacion-opm | [OPL-ES §7.3 CS1..CS6] |
| HU-B4.006 | Ver OPL `<Proceso> occurs if <Objeto> is at state <X>, otherwise <Proceso> is skipped.` | IS | S | S | opl-es | [OPL-ES §7 CS1] |
| HU-B4.007 | Distinguir condicion de evento en enlaces entrantes | IS | S | M | simulacion-opm | [OPL-ES §6] [OPL-ES §7] |
| HU-B4.008 | Crear enlace de invocacion hacia ancestro in-zoomed para modelar bucle | IS | S | M | simulacion-opm | [OPL-ES §8.2 IV1] |
| HU-B4.009 | Anclar flecha de invocacion a puerto de estado especifico | IS | S | S | opcloud-ui | — |
| HU-B4.010 | Ver OPL `<Subproceso> invokes <Ancestro>.` al crear enlace de invocacion | IS | S | S | opl-es | [OPL-ES §8.2 IV1] |
| HU-B4.011 | Abrir editor inline `Function:` desde proceso seleccionado | IS | S | M | opcloud-ui | — |
| HU-B4.012 | Guardar funcion con `Update` y ver sufijo `<>` en el nombre | IS | S | S | opcloud-ui | [JOYAS §1] |
| HU-B4.013 | Ver tooltip con cuerpo de funcion al hover sobre proceso computacional | IS | S | S | opcloud-ui | — |
| HU-B4.014 | Reposicionar dialogo `Function:` con asa de arrastre | IS | C | XS | opcloud-ui | — |
| HU-B4.015 | Asignar pesos probabilisticos por etiqueta en Textual Value | IS | S | M | simulacion-opm | — |
| HU-B4.016 | Anadir filas adicionales de etiquetas en Textual Value con boton `+` | IS | S | S | opcloud-ui | — |
| HU-B4.017 | Ver token verde recorriendo enlace activo durante simulacion | IS | S | S | opcloud-ui | — |
| HU-B4.018 | Ejecutar paso a paso con toggle synchronized execution | IS | S | M | simulacion-opm | — |
| HU-B4.019 | Ajustar velocidad de simulacion con slider porcentual | IS | C | XS | opcloud-ui | — |
| HU-B4.020 | Activar modo Headless Runner para suprimir animaciones | IS | C | S | opcloud-ui | — |
| HU-B4.021 | Activar randomize con boton de dados para asignacion aleatoria | IS | S | S | simulacion-opm | — |
| HU-B4.022 | Detectar bucle infinito y permitir freno manual con Stop | IS | S | M | simulacion-opm | — |
| HU-B4.023 | Ver contador de iteraciones avanzando durante bucle | IS | C | XS | opcloud-ui | — |
| HU-B4.024 | Modelar bucles anidados mediante invocaciones cruzadas | IS | C | L | simulacion-opm | [OPL-ES §8.2 IV1] |
| HU-B4.025 | Ejecutar varias simulaciones sobre el mismo modelo con Stop/Play | IS | S | S | simulacion-opm | — |
| HU-B4.026 | Exportar trazo de la simulacion condicional como XLSX | IS | C | S | opcloud-ui | — |

Total: **26 historias de usuario**.

## Historias de usuario

### HU-B4.001 — Marcar enlace instrumento como condicional con modificador `c`

**Actor primario:** IS (ingeniero de simulacion).
**Actores secundarios:** MN (primera exposicion a condiciones).
**Tipo:** simulacion-opm.
**Nivel categorico:** K (kernel — nuevo atributo en enlace) primario; V (render) y L (OPL) secundarios.
**Superficie UI:** modal-tabla-enlaces + canvas-opd.
**Gesto canonico:** seleccionar tipo `instrument condition` en la tabla-enlaces durante creacion del enlace.

**Historia:**
> Como ingeniero de simulacion, quiero marcar un enlace instrumento como condicional para que el subproceso solo se ejecute si el estado del objeto origen coincide con el estado apuntado.

**Contexto de negocio:**
La condicion es el primer primitivo de control-flow que OPCloud expone al modelador. Sin condicion, la simulacion es determinista y todos los subprocesos corren secuencialmente. Con condicion, el modelador puede expresar ramificaciones semanticamente ricas sin abandonar OPM. La combinacion con estados del objeto es la puerta de entrada al control-flow. La gramatica OPL canonica usa `ocurre si`, `de lo contrario` y `se omite` para expresar la semantica de guard [OPL-ES §2].

**Criterios de aceptacion:**
- **Dado** que abro la tabla-enlaces para un drag Object→Process con origen en un estado, **cuando** miro las opciones, **entonces** veo `Instrument Condition` como subtipo disponible dentro de la categoria Instrumento.
- **Dado** que selecciono `Instrument Condition`, **cuando** confirmo, **entonces** el enlace se persiste con `enlace.type="instrument"` y `enlace.condicion=true`.
- **Dado** que el enlace se creo con `condicion=true`, **cuando** miro el canvas, **entonces** veo la piruleta blanca en el extremo-proceso con la letra `c` adyacente (ver HU-B4.003, HU-B4.004).
- **Dado** que existe el enlace condicional, **cuando** consulto el panel OPL, **entonces** aparece la oracion descrita en HU-B4.006.

**Reglas y restricciones:**
- El modificador `c` aplica solo a enlaces instrumento y consumo (§4.2 SSOT, §5.1 doc fuente).
- El atributo `condicion` es booleano independiente del tipo base.
- No se propaga condicionalidad a enlaces aguas abajo (§5.1: D Processing→Object 2 no se marca con `c` aunque semanticamente sea condicional).

**Modelo de datos tocado:**
- `enlace.tipo` — `"instrument"` — persistente.
- `enlace.condicion` — boolean — persistente.

**Dependencias:**
- Bloqueada por: HU-10.007, HU-10.008, HU-10.011 (creacion basica de enlaces).
- Bloquea a: HU-B4.003, HU-B4.004, HU-B4.005, HU-B4.006.

**Integraciones:**
- Validador del kernel (`src/nucleo/validacion/`) debe aceptar `condicion` solo en instrumento/consumo.
- Motor OPL genera oracion "ocurre si / de lo contrario se omite" [OPL-ES §7 CS1..CS6].

**Notas de evidencia:**
- Fuente normativa: [OPL-ES §2] vocabulario clave de condicion; [OPL-ES §7 CS1] plantilla canonica con estado.
- Fuente OPCloud: `opcloud-reverse/b4-simulation-conditions-loops.md` §2.1, §3.1 paso 5, §5.1.
- Frames: frame_00015, frame_00020, frame_00025, frame_00038, frame_00046.
- Transcripcion: "select the instrument condition".
- Clase de afirmacion: confirmado por transcripcion + observado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [simulacion-conceptual, condicion, enlaces, instrumento, kernel, render, opl].

---

### HU-B4.002 — Marcar enlace consumo como condicional con modificador `c`

**Actor primario:** IS.
**Tipo:** simulacion-opm.
**Nivel categorico:** K primario; V y L secundarios.
**Superficie UI:** modal-tabla-enlaces + canvas-opd.
**Gesto canonico:** seleccionar `Consumption Condition` en la tabla-enlaces.

**Historia:**
> Como ingeniero de simulacion, quiero marcar un enlace consumo como condicional para que la consumicion del objeto solo ocurra si el estado requerido se cumple.

**Contexto de negocio:**
Analogo a HU-B4.001 pero sobre el tipo de enlace consumo (el proceso consume el objeto, no solo lo usa como instrumento). La semantica de control-flow es identica: el subproceso se ejecuta solo si el estado coincide; de lo contrario se omite. Las palabras clave OPL `ocurre si` y `de lo contrario se omite` [OPL-ES §2] aplican por igual a ambas familias de enlaces.

**Criterios de aceptacion:**
- **Dado** que abro la tabla-enlaces para un drag Object→Process, **cuando** miro las opciones, **entonces** veo `Consumption Condition` como subtipo.
- **Dado** que selecciono `Consumption Condition`, **cuando** confirmo, **entonces** el enlace se persiste con `enlace.tipo="consumption"` y `enlace.condicion=true`.
- **Dado** que el enlace existe, **cuando** miro el canvas, **entonces** veo la piruleta + `c` igual que para instrumento condicion.
- **Dado** que el enlace existe, **cuando** consulto OPL, **entonces** la oracion "ocurre si / de lo contrario se omite" usa el verbo correspondiente a consumo (`consume` / `se consume`).

**Reglas y restricciones:**
- Diferencia semantica con HU-B4.001: el objeto se consume (deja de existir tras el proceso) si la condicion se cumple; no solo se usa como instrumento [OPL-ES §7 CT1, CS1].
- Mismo render visual que instrumento condicion — la diferencia queda implicita en el tipo base del enlace.

**Modelo de datos tocado:**
- `enlace.tipo` — `"consumption"` — persistente.
- `enlace.condicion` — boolean — persistente.

**Dependencias:**
- Bloqueada por: HU-10.007, HU-10.011, HU-B4.001 (mismo patron).

**Integraciones:**
- Validador kernel.
- Motor OPL.

**Notas de evidencia:**
- Fuente normativa: [OPL-ES §7 CT1] condicion con consumo; [OPL-ES §2] verbos `consume`/`se consume`.
- Fuente OPCloud: §5.1 "aplicable a enlaces instrumento y consumo".
- Clase de afirmacion: inferido por simetria con HU-B4.001 (frames muestran solo instrumento condicion, la spec SSOT §4.2 autoriza ambos).
- Etiqueta: `requires-clarification` (no observado directamente).

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulacion-conceptual, condicion, enlaces, consumo, kernel, requires-clarification].

---

### HU-B4.003 — Ver piruleta blanca en extremo-proceso de enlace condicional

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** V.
**Superficie UI:** canvas-opd.
**Gesto canonico:** ninguno (render declarativo).

**Historia:**
> Como ingeniero de simulacion, quiero ver un circulo blanco (piruleta) en el extremo-proceso del enlace condicional para identificar visualmente que el enlace tiene semantica de instrumento/consumo.

**Contexto de negocio:**
La piruleta blanca es la afordance visual canonica OPM para marcar el extremo-proceso de un enlace instrumento (§4 SSOT). Sin ella, el modelador no puede distinguir de un vistazo un enlace instrumento/consumo de otros tipos. Es pre-requisito visual para que `c` (HU-B4.004) tenga sentido.

**Criterios de aceptacion:**
- **Dado** que un enlace tiene `tipo=instrument` o `tipo=consumption`, **cuando** miro el canvas, **entonces** veo un circulo blanco vacio (~6-8 px) en el extremo del enlace que toca el proceso.
- **Dado** que el enlace tiene `condicion=true`, **cuando** miro el canvas, **entonces** la piruleta permanece con la misma geometria y se acompana de `c` (HU-B4.004).
- **Dado** que el enlace es de otro tipo (efecto, resultado, agente), **cuando** miro el canvas, **entonces** **no** se dibuja piruleta.

**Reglas y restricciones:**
- Diametro aproximado: 6-8 px (§2.1).
- Color: blanco (fill), borde del mismo color que el enlace.
- Posicion: extremo del enlace mas cercano al proceso, no al objeto.

**Modelo de datos tocado:**
- Derivado de `enlace.tipo`; no hay campo dedicado.

**Dependencias:**
- Bloqueada por: HU-B4.001 o HU-B4.002.

**Integraciones:**
- Renderer JointJS (`src/render/jointjs/`): factory de enlace instrumento con marker.

**Notas de evidencia:**
- Fuente normativa: [V-1 §4] piruleta como marcador de extremo-proceso.
- Fuente OPCloud: §2.1 tabla, §5.1. Evidencia visual: JOYAS §1 colores.
- Frames: frame_00015, frame_00020, frame_00038, frame_00046.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [render, condicion, instrumento, piruleta, visual].

---

### HU-B4.004 — Ver letra `c` adyacente a piruleta en enlace condicional

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** V.
**Superficie UI:** canvas-opd.
**Gesto canonico:** ninguno.

**Historia:**
> Como ingeniero de simulacion, quiero ver la letra `c` minuscula junto a la piruleta blanca en enlaces condicionales para distinguir rapidamente enlaces con guard de enlaces sin guard.

**Contexto de negocio:**
La `c` es la marca explicita de condicionalidad. Sin ella, la piruleta blanca sola solo indica instrumento/consumo, no guard. La combinacion `c` + piruleta es el vocabulario visual que OPCloud usa para exponer control-flow. La semantica subyacente se corresponde con las plantillas `ocurre si ... de lo contrario ... se omite` [OPL-ES §2, §7].

**Criterios de aceptacion:**
- **Dado** que un enlace tiene `condicion=true`, **cuando** miro el canvas, **entonces** veo la letra `c` minuscula (~9 px, tipografia del canvas, sin color distintivo) a la derecha de la piruleta.
- **Dado** que cambio `condicion` a false, **cuando** el render se actualiza, **entonces** la `c` desaparece conservando la piruleta.
- **Dado** que hay varios enlaces condicionales en el mismo OPD, **cuando** miro, **entonces** cada uno tiene su propia `c` posicionada consistentemente.

**Reglas y restricciones:**
- Posicion: adyacente a la piruleta, lado derecho (convencion observada §5.1, no prescrita por SSOT §4.2).
- Tamano: 9 px aprox.
- Sin control para mover la letra a otro lado (pregunta abierta §11 doc fuente).

**Modelo de datos tocado:**
- Derivado de `enlace.condicion`; sin campo dedicado para posicion.

**Dependencias:**
- Bloqueada por: HU-B4.003.

**Integraciones:**
- Renderer JointJS: marker con label `c`.

**Notas de evidencia:**
- Fuente OPCloud: §2.1, §5.1, §9. Evidencia visual: JOYAS §1.
- Frames: frame_00015, frame_00020, frame_00032, frame_00038, frame_00046.
- Transcripcion: "select the instrument condition" (introduce la `c` como consecuencia).
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [render, condicion, c-modifier, visual].

---

### HU-B4.005 — Anclar enlace condicional a estado especifico del objeto origen

**Actor primario:** IS.
**Tipo:** simulacion-opm.
**Nivel categorico:** K primario; V secundario.
**Superficie UI:** canvas-opd + handle de anclaje.
**Gesto canonico:** drag del extremo-objeto del enlace sobre un estado (rectangulo interno del objeto).

**Historia:**
> Como ingeniero de simulacion, quiero anclar el extremo del enlace condicional a un estado especifico del objeto (yes, no, etc.) para declarar que la ejecucion depende de ese estado concreto.

**Contexto de negocio:**
La condicionalidad adquiere su semantica solo cuando el enlace apunta a un estado concreto del objeto. Si apunta a la caja general del objeto, la simulacion elige el estado aleatoriamente (50/50 en un enum binario); si apunta a un estado, la simulacion fuerza ese valor. Esta distincion es crucial — aparece explicitamente en §3.2 vs §3.3 del doc fuente. La gramatica OPL refleja esta distincion con `ocurre si Objeto esta en estado` [OPL-ES §7.3 CS1..CS6].

**Criterios de aceptacion:**
- **Dado** que tengo un objeto con estados `yes` y `no` y un enlace condicional Object→Process, **cuando** arrastro el extremo del enlace sobre el estado `yes`, **entonces** el enlace se ancla al estado y `enlace.sourceState="yes"`.
- **Dado** que el enlace esta anclado a `yes`, **cuando** ejecuto la simulacion, **entonces** el proceso solo se ejecuta cuando Object esta en estado `yes`.
- **Dado** que muevo el extremo a la caja general del objeto, **cuando** confirmo el drag, **entonces** `enlace.sourceState` queda `null` y la simulacion elige aleatoriamente el estado de Object si randomize esta activo (HU-B4.021).
- **Dado** que el objeto no tiene estados definidos, **cuando** creo un enlace condicional, **entonces** `enlace.sourceState` es `null` por defecto.

**Reglas y restricciones:**
- `enlace.sourceState` es opcional; `null` significa "cualquier estado" o "seleccion aleatoria".
- El extremo del enlace debe engancharse visualmente al estado (no solo superponerse).
- Si el estado se elimina del objeto, el enlace pierde su `sourceState` y pasa a `null`.

**Modelo de datos tocado:**
- `enlace.sourceState` — string nullable — persistente.

**Dependencias:**
- Bloqueada por: HU-B4.001.
- Relacionada: EPICA-13 (estados de objeto).

**Integraciones:**
- Renderer: debe dibujar el enlace partiendo del borde del rectangulo del estado, no del contorno general del objeto.
- OPL: la oracion incluye el estado (`is at state yes`).

**Notas de evidencia:**
- Fuente normativa: [OPL-ES §7.3 CS1] plantilla con estado especificado: `ocurre si Objeto esta en estado`.
- Fuente OPCloud: §3.1 paso 5, §3.3 "mover el enlace entrante para que apunte directamente al estado no".
- Frames: frame_00015, frame_00020.
- Transcripcion: "each time simulation will be run we will get the same result" (cuando se ancla a estado fijo).
- Clase de afirmacion: confirmado por transcripcion + observado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [condicion, estado, kernel, enlaces, anclaje, simulacion-conceptual].

---

### HU-B4.006 — Ver OPL `<Proceso> occurs if <Objeto> is at state <X>, otherwise <Proceso> is skipped.`

**Actor primario:** IS.
**Actores secundarios:** MN, RV.
**Tipo:** opl-es.
**Nivel categorico:** L.
**Superficie UI:** panel-opl.
**Gesto canonico:** ninguno (render declarativo).

**Historia:**
> Como ingeniero de simulacion, quiero ver la oracion OPL de la condicion para confirmar la semantica exacta del guard antes de ejecutar.

**Contexto de negocio:**
El OPL es el arbitro gramatical. Si el OPL no refleja `ocurre si / de lo contrario se omite` [OPL-ES §2, §7], el modelador no puede confirmar que el producto entendio su intencion. La oracion tambien ensena la semantica al modelador novato.

**Criterios de aceptacion:**
- **Dado** que existe un enlace condicional de `Object3.yes → CProcessing`, **cuando** consulto el panel OPL, **entonces** aparece `C Processing occurs if Object 3 is at state yes, otherwise C Processing is skipped.`
- **Dado** que cambio el estado anclado de `yes` a `no`, **cuando** se actualiza el OPL, **entonces** la oracion usa el nuevo estado.
- **Dado** que desmarco la condicionalidad (`condicion=false`), **cuando** se actualiza OPL, **entonces** la oracion desaparece y queda solo la del enlace instrumento base.
- **Dado** que el enlace condicional no esta anclado a estado, **cuando** consulto OPL, **entonces** la oracion omite el estado (forma abierta — pregunta de comportamiento).

**Reglas y restricciones:**
- Formato canonico: `<Proceso> occurs if <Objeto> is at state <estado>, otherwise <Proceso> is skipped.` [OPL-ES §7 CS1].
- El OPL **no** muestra token verde ni sufijo `<>` (§3.6: OPL permanece puramente gramatical).
- Idioma OPL: ingles canonico (literatura OPM).

**Modelo de datos tocado:**
- Ninguno; OPL es derivacion pura del modelo.

**Dependencias:**
- Bloqueada por: HU-B4.001 y HU-B4.005.

**Integraciones:**
- Motor OPL (`src/render/opl-renderer.ts`).

**Notas de evidencia:**
- Fuente normativa: [OPL-ES §7 CS1] plantilla canonica de condicion con estado.
- Fuente OPCloud: §3.1 paso 5, §3.6.
- Frames: frame_00015, frame_00020.
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [opl, condicion, lente, simulacion-conceptual].

---

### HU-B4.007 — Distinguir condicion de evento en enlaces entrantes

**Actor primario:** IS.
**Actores secundarios:** AD.
**Tipo:** simulacion-opm.
**Nivel categorico:** K primario; V secundario.
**Superficie UI:** modal-tabla-enlaces + canvas-opd.
**Gesto canonico:** seleccionar subtipo en tabla-enlaces.

**Historia:**
> Como ingeniero de simulacion, quiero distinguir un enlace `condicion` (guard evaluado al entrar) de un enlace `evento` (trigger que dispara la ejecucion) para expresar semanticas de control-flow diferenciadas segun OPM canonico.

**Contexto de negocio:**
OPM distingue **evento** (disparador: cuando el objeto cambia a X, ejecuta el proceso) de **condicion** (guard: al iniciar el proceso, verifica que el objeto este en X; si no, skip). Ambos se renderizan con piruleta en el extremo-proceso pero con marcadores distintos (`e` vs `c`). En OPL, el evento usa `inicia` mientras que la condicion usa `ocurre si` [OPL-ES §2, §6 vs §7]. La distincion es critica para simulaciones reactivas vs condicionales. El doc fuente sugiere la distincion en §11 ("guard vs trigger") pero no la observa en los frames; es hipotesis pendiente.

**Criterios de aceptacion:**
- **Dado** que abro la tabla-enlaces, **cuando** miro los subtipos, **entonces** veo tanto `Instrument Condition` como `Instrument Event` (y equivalentes de consumo).
- **Dado** que selecciono `Instrument Event`, **cuando** confirmo, **entonces** el enlace se persiste con `enlace.modificador="event"` (en vez de `condicion`).
- **Dado** que el enlace tiene `modificador="event"`, **cuando** miro el canvas, **entonces** veo la piruleta con `e` adyacente (analogo a `c` en HU-B4.004).
- **Dado** que el enlace tiene `modificador="event"`, **cuando** consulto OPL, **entonces** la oracion usa el verbo apropiado (`inicia` o similar) [OPL-ES §6 ET1..EHS2].
- **Dado** que la simulacion corre, **cuando** el estado del objeto transiciona a X, **entonces** el evento dispara el proceso (semantica reactiva, no solo guard).

**Reglas y restricciones:**
- **Pregunta abierta**: los frames observados muestran solo `c`, no `e`. La distincion evento vs condicion es hipotesis basada en OPM SSOT, no confirmada en OPCloud.
- Hipotesis: OPCloud colapsa ambos al mismo visual `c` y distingue solo en semantica de runner — verificar contra SSOT y spec ISO 19450.
- Etiqueta: `requires-clarification`.

**Modelo de datos tocado:**
- `enlace.modificador` — `"condicion" | "evento" | null` — persistente.

**Dependencias:**
- Bloqueada por: HU-B4.001.
- Bloqueada por decision: definir si OPCloud soporta evento distinto de condicion.

**Integraciones:**
- Validador kernel.
- Runner de simulacion: dos trayectorias distintas (reactiva para evento, determinista para condicion).

**Notas de evidencia:**
- Fuente normativa: [OPL-ES §2] verbos `ocurre` vs `inicia`; [OPL-ES §6] plantillas de evento; [OPL-ES §7] plantillas de condicion.
- Fuente OPCloud: §11 "guard vs trigger" (preguntas abiertas), SSOT §4.2.
- Clase de afirmacion: hipotesis.
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [condicion, evento, semantica, kernel, enlaces, requires-clarification].

---

### HU-B4.008 — Crear enlace de invocacion hacia ancestro in-zoomed para modelar bucle

**Actor primario:** IS.
**Tipo:** simulacion-opm.
**Nivel categorico:** K primario; V y L secundarios.
**Superficie UI:** modal-tabla-enlaces + canvas-opd in-zoomed.
**Gesto canonico:** drag desde subproceso hasta estado interno del ancestro + seleccionar `Invocation` en tabla-enlaces.

**Historia:**
> Como ingeniero de simulacion, quiero dibujar un enlace de invocacion desde un subproceso hacia el ancestro in-zoomed para modelar un bucle que reinicia la descomposicion completa cuando el subproceso termina.

**Contexto de negocio:**
En OPM, los bucles no son una primitiva dedicada — se modelan como auto-invocaciones. El subproceso termina y dispara la reejecucion del proceso ancestro (que lo contiene via in-zoom). La descomposicion completa se reinicia, incluyendo la condicion que puede cortar el bucle. Es el mecanismo OPCloud canonico para bucles while/until/do-while — no hay sintaxis `while` ni `for each`. La plantilla OPL canonica para invocacion es `<Invocador> invoca <Invocado>.` [OPL-ES §8.2 IV1].

**Criterios de aceptacion:**
- **Dado** que estoy dentro del OPD in-zoomed de `A Processing` con subproceso `C Processing`, **cuando** arrastro desde `C Processing` hasta el interior de `A Processing` (ancestro) y selecciono `Invocation`, **entonces** se crea un enlace con `enlace.tipo="invocation"`, `source=C Processing`, `target=A Processing`.
- **Dado** que el enlace existe, **cuando** ejecuto la simulacion y el subproceso `C Processing` termina, **entonces** el runner reinicia `A Processing` (reejecuta toda su descomposicion: B + condicion + rama).
- **Dado** que el enlace existe, **cuando** consulto OPL, **entonces** aparece `C Processing invokes A Processing.` (ver HU-B4.010).
- **Dado** que la descomposicion incluye condicion que filtra, **cuando** se reinicia el bucle, **entonces** la condicion se evalua de nuevo y puede cortar el ciclo.

**Reglas y restricciones:**
- Invocacion es enlace Process→Process (ancestro debe ser proceso).
- El ancestro debe estar in-zoomed (el subproceso vive dentro de su descomposicion).
- Geometria observada: flecha recta, sin zigzag canonico del SSOT §9.1 (divergencia observada).
- Runtime: al completar el subproceso, se dispara la re-entrada; durante el ciclo vivo, no se dispara.

**Modelo de datos tocado:**
- `enlace.tipo` — `"invocation"` — persistente.
- `enlace.source` — ID subproceso — persistente.
- `enlace.target` — ID proceso ancestro — persistente.
- `enlace.targetState` — string opcional (ver HU-B4.009).

**Dependencias:**
- Bloqueada por: HU-10.007, HU-10.011, EPICA-12 (in-zoom debe estar disponible).
- Bloquea a: HU-B4.009, HU-B4.010, HU-B4.022 (bucle infinito).

**Integraciones:**
- Kernel validador: aceptar invocation con target en ancestro (no en cualquier proceso).
- Runner (EPICA-B0/B1): interpretar invocation como re-entrada del ancestro.
- Motor OPL.

**Notas de evidencia:**
- Fuente normativa: [OPL-ES §8.2 IV1] `Invocador invoca Invocado.`
- Fuente OPCloud: §3.1 paso 6, §5.2.
- Frames: frame_00018, frame_00020, frame_00025, frame_00038, frame_00046.
- Transcripcion: "connect it with invocation link... point it to a specific port".
- Clase de afirmacion: confirmado por transcripcion + observado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [bucle, invocacion, enlaces, inzoom, kernel, simulacion-conceptual].

---

### HU-B4.009 — Anclar flecha de invocacion a puerto de estado especifico

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario; V secundario.
**Superficie UI:** canvas-opd + handle de anclaje + sistema de puertos.
**Gesto canonico:** drag del extremo-destino del enlace sobre un estado interno del ancestro.

**Historia:**
> Como ingeniero de simulacion, quiero anclar el extremo de la flecha de invocacion a un puerto especifico de un estado interno del ancestro para hacer explicita la condicion de reentrada.

**Contexto de negocio:**
El transcript destaca literalmente "point it to a specific port so it will be easier to see". El anclaje a puerto de estado es una afordance visual que deja claro cual es la ruta de reentrada. Aunque el OPL colapsa a proceso→proceso (ignorando el estado) [OPL-ES §8.2], el render mantiene la informacion para el lector humano.

**Criterios de aceptacion:**
- **Dado** que creo un enlace de invocacion, **cuando** arrastro el extremo-destino sobre el estado `yes` de Object 3 (interno a A Processing), **entonces** el enlace se ancla al puerto del estado y `enlace.targetState="yes"`.
- **Dado** que el enlace esta anclado al estado, **cuando** miro el canvas, **entonces** la flecha termina visualmente en el rectangulo del estado, no en el contorno del ancestro.
- **Dado** que muevo el extremo a otro estado o al contorno del ancestro, **cuando** confirmo, **entonces** `targetState` se actualiza o pasa a `null`.
- **Dado** que el enlace esta anclado, **cuando** consulto OPL, **entonces** la oracion reduce a proceso→proceso (no menciona el estado; §5.2 "OPL resuelve como invocacion proceso→proceso ignorando el estado de destino").

**Reglas y restricciones:**
- El anclaje a puerto es afordance visual; el OPL lo ignora [OPL-ES §8.2 IV1].
- El puerto del estado debe estar visible en el canvas (convencion observada).
- **Pregunta abierta §11**: ¿puede apuntar al contorno del ancestro cuando no hay objeto con estados? En los frames, siempre a estado.

**Modelo de datos tocado:**
- `enlace.targetState` — string nullable — persistente.
- `enlace.targetPort` — identificador opcional — persistente (inferido).

**Dependencias:**
- Bloqueada por: HU-B4.008.
- Relaciona: sistema de puertos del renderer (EPICA-11 o subsecuente).

**Integraciones:**
- Renderer JointJS: puertos en estados.

**Notas de evidencia:**
- Fuente OPCloud: §3.1 paso 6, §5.2. Evidencia visual: JOYAS §7 puertos.
- Frames: frame_00018, frame_00025, frame_00038, frame_00046.
- Transcripcion: "point it to a specific port".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [bucle, invocacion, puerto, estado, ui, anclaje].

---

### HU-B4.010 — Ver OPL `<Subproceso> invokes <Ancestro>.` al crear enlace de invocacion

**Actor primario:** IS.
**Actores secundarios:** MN, RV.
**Tipo:** opl-es.
**Nivel categorico:** L.
**Superficie UI:** panel-opl.
**Gesto canonico:** ninguno.

**Historia:**
> Como ingeniero de simulacion, quiero ver la oracion `<Subproceso> invokes <Ancestro>.` en el OPL al crear el enlace de invocacion para confirmar la semantica de bucle sin ambiguedades.

**Contexto de negocio:**
El OPL comprime la informacion visual (flecha a estado especifico) en una relacion proceso→proceso. Esto es deliberado: OPM trata la invocacion como relacion entre procesos, no entre proceso y estado [OPL-ES §8.2]. El estado es solo afordance visual.

**Criterios de aceptacion:**
- **Dado** que creo un enlace invocation de `C Processing` a estado `yes` de Object 3 dentro de `A Processing`, **cuando** consulto OPL, **entonces** aparece `C Processing invokes A Processing.`
- **Dado** que el enlace apunta al contorno del ancestro (sin estado), **cuando** consulto OPL, **entonces** la oracion es identica (`C Processing invokes A Processing.`).
- **Dado** que elimino el enlace, **cuando** se actualiza OPL, **entonces** la oracion desaparece.

**Reglas y restricciones:**
- Formato: `<Source> invokes <Target>.` — verbo canonico [OPL-ES §8.2 IV1].
- El OPL nunca menciona el estado de destino aunque el canvas lo muestre.
- Idioma OPL: ingles canonico.

**Modelo de datos tocado:**
- Ninguno; derivado.

**Dependencias:**
- Bloqueada por: HU-B4.008.

**Integraciones:**
- Motor OPL.

**Notas de evidencia:**
- Fuente normativa: [OPL-ES §8.2 IV1] `Invocador invoca Invocado.`; [OPL-ES §2] verbo `invoca`.
- Fuente OPCloud: §3.1 paso 6, §3.6, §5.2.
- Clase de afirmacion: confirmado por transcripcion (OPL reconstruido en §3.6).

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [opl, bucle, invocacion, lente].

---

### HU-B4.011 — Abrir editor inline `Function:` desde proceso seleccionado

**Actor primario:** IS.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; K (guarda function body) secundario.
**Superficie UI:** popup-function-inline.
**Gesto canonico:** accion `set-computation` o `edit function` desde menu contextual o pie menu.

**Historia:**
> Como ingeniero de simulacion, quiero abrir un editor inline compacto sobre el proceso seleccionado para escribir el cuerpo de una funcion computacional sin dejar el canvas.

**Contexto de negocio:**
El editor inline `Function:` es la version minima del editor completo de user-functions (EPICA-B2). Permite al modelador asignar una funcion trivial (`return 'yes';`, `return 'no';`) sin abrir un modal pesado. Es el camino rapido para introducir computationality en un proceso.

**Criterios de aceptacion:**
- **Dado** que tengo un proceso seleccionado con bandera `computational=true`, **cuando** ejecuto la accion `set-computation` o `edit function`, **entonces** se abre un dialogo flotante compacto titulado `Function:` sobre el proceso.
- **Dado** que el dialogo esta abierto, **cuando** miro, **entonces** veo un textarea de una sola linea y botones `Update` y cancelar.
- **Dado** que escribo `return 'no';` y hago clic en `Update`, **cuando** el dialogo se cierra, **entonces** el proceso persiste la funcion y el nombre pasa a mostrarse con sufijo `<>` (ver HU-B4.012).
- **Dado** que cancelo, **cuando** el dialogo se cierra, **entonces** no se guarda cambio.

**Reglas y restricciones:**
- El dialogo es flotante, no modal pesado; puede coexistir con seleccion del canvas.
- La computationality del proceso debe estar activada (bandera previa) — si no, la accion no aparece (ver EPICA-B1).
- Body: texto libre; validacion sintactica no observada.

**Modelo de datos tocado:**
- `proceso.function.body` — string — persistente.

**Dependencias:**
- Bloqueada por: EPICA-B1 (computationality del proceso).
- Bloquea a: HU-B4.012, HU-B4.013, HU-B4.014.

**Integraciones:**
- Kernel: atributo `function` en nodo proceso.
- Render: sufijo `<>` (HU-B4.012).
- Editor completo (EPICA-B2): comparte body persistido.

**Notas de evidencia:**
- Fuente OPCloud: §2.3, §3.4 paso 2.
- Frames: frame_00032.
- Transcripcion: "we can use the update computation directly".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [simulacion-computacional, ui, popup, funcion, editor-inline].

---

### HU-B4.012 — Guardar funcion con `Update` y ver sufijo `<>` en el nombre

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; K (side-effect render).
**Superficie UI:** canvas-opd (elipse del proceso).
**Gesto canonico:** clic `Update` en dialogo `Function:`.

**Historia:**
> Como ingeniero de simulacion, quiero ver el sufijo `<>` en el nombre del proceso apenas guardo la funcion para distinguir de un vistazo los procesos computacionales de los puramente conceptuales.

**Contexto de negocio:**
El sufijo `<>` es la convencion tipo JavaScript/C que OPCloud adopto para marcar procesos con funcion asociada. Es **render derivado** — no parte del nombre OPL ni del `thing.name`. El OPL sigue leyendo `B Processing`, no `B Processing <>`.

**Criterios de aceptacion:**
- **Dado** que guardo una funcion en el proceso via `Update`, **cuando** el dialogo se cierra, **entonces** el nombre dentro de la elipse pasa de `B Processing` a `B Processing <>`.
- **Dado** que el proceso tiene funcion, **cuando** consulto OPL, **entonces** la oracion usa `B Processing` sin `<>` (el sufijo es solo render).
- **Dado** que borro la funcion, **cuando** el cambio se confirma, **entonces** el `<>` desaparece del render.
- **Dado** que el proceso tiene parentesis en el nombre (`f(x)`), **cuando** asigno funcion, **entonces** **pregunta abierta §11**: ¿se renderiza `f(x) <>` o se colapsa?

**Reglas y restricciones:**
- El `<>` es parte del texto renderizado dentro de la elipse, no afuera.
- El nombre OPL/persistente NO incluye `<>`.
- Edge case con parentesis en nombre: pregunta abierta.

**Modelo de datos tocado:**
- Derivado; no hay campo dedicado.

**Dependencias:**
- Bloqueada por: HU-B4.011.

**Integraciones:**
- Renderer JointJS: logica de texto dentro de shape.

**Notas de evidencia:**
- Fuente OPCloud: §2.1 tabla, §5.3. Evidencia visual: JOYAS §1.
- Frames: frame_00025, frame_00035, frame_00038, frame_00043, frame_00046, frame_00048, frame_00050.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulacion-computacional, render, sufijo, visual].

---

### HU-B4.013 — Ver tooltip con cuerpo de funcion al hover sobre proceso computacional

**Actor primario:** IS.
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; V secundario.
**Superficie UI:** tooltip-flotante.
**Gesto canonico:** hover del cursor sobre el proceso.

**Historia:**
> Como ingeniero de simulacion, quiero ver el cuerpo de la funcion al hover sobre el proceso sin abrir el editor para inspeccionar rapidamente que retorna cada proceso computacional.

**Contexto de negocio:**
El tooltip elimina la friccion de abrir el editor para leer una linea simple (`return 'no';`). Es afordance de lectura, no de edicion. Contraste visual invertido (caja negra) para marcar la naturaleza "codigo" del contenido.

**Criterios de aceptacion:**
- **Dado** que un proceso tiene funcion asignada, **cuando** paso el cursor sobre la elipse y mantengo, **entonces** aparece tooltip flotante a la derecha con el body exacto (p.ej. `return 'yes';`).
- **Dado** que el cursor se aleja, **cuando** pasa un umbral, **entonces** el tooltip desaparece.
- **Dado** que el proceso no tiene funcion, **cuando** hover, **entonces** no aparece tooltip de funcion.
- **Dado** que cambio el body via editor, **cuando** hover de nuevo, **entonces** el tooltip muestra el body actualizado.

**Reglas y restricciones:**
- Color de fondo del tooltip: negro (contraste invertido, §9 convencion).
- Texto: body literal sin formateo adicional.
- Posicion: a la derecha de la elipse; si no hay espacio, se reubica (inferido).

**Modelo de datos tocado:**
- Ninguno; derivado de `proceso.function.body`.

**Dependencias:**
- Bloqueada por: HU-B4.012.

**Integraciones:**
- Renderer: capa de tooltips.

**Notas de evidencia:**
- Fuente OPCloud: §2.1, §9 convenciones.
- Frames: frame_00038, frame_00050.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulacion-computacional, tooltip, hover, ui].

---

### HU-B4.014 — Reposicionar dialogo `Function:` con asa de arrastre

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** popup-function-inline (asa).
**Gesto canonico:** drag sobre asa (icono `++` en esquina superior derecha).

**Historia:**
> Como ingeniero de simulacion, quiero arrastrar el dialogo `Function:` para reposicionarlo cuando tapa el proceso que estoy editando.

**Contexto de negocio:**
El dialogo flotante se ancla inicialmente sobre el proceso, lo que puede tapar contexto necesario para escribir la funcion (otros procesos, objetos con sus estados). El asa permite reubicacion manual sin complicar el ancho del popup.

**Criterios de aceptacion:**
- **Dado** que el dialogo `Function:` esta abierto, **cuando** miro la esquina superior derecha, **entonces** veo icono de asa (`++` o similar).
- **Dado** que arrastro desde el asa, **cuando** muevo, **entonces** el dialogo sigue al cursor hasta soltar.
- **Dado** que suelto fuera del viewport, **cuando** termina el drag, **entonces** **pregunta abierta §4.3 doc fuente**: no se observa comportamiento de snap ni limites.

**Reglas y restricciones:**
- Sin snap a grid ni a bordes.
- Sin limites de arrastre documentados — puede quedar fuera de viewport (posible bug).

**Modelo de datos tocado:**
- Ninguno (posicion transitoria).

**Dependencias:**
- Bloqueada por: HU-B4.011.

**Integraciones:**
- UI layer (positioning manager).

**Notas de evidencia:**
- Fuente OPCloud: §2.3, §4.3.
- Frames: frame_00032.
- Clase de afirmacion: observado.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [ui, drag, popup, funcion].

---

### HU-B4.015 — Asignar pesos probabilisticos por etiqueta en Textual Value

**Actor primario:** IS.
**Actores secundarios:** ME.
**Tipo:** simulacion-opm.
**Nivel categorico:** K primario (serializa pesos); U y V secundarios.
**Superficie UI:** modal-please-select-values.
**Gesto canonico:** seleccionar radio `Textual Value` + edicion numerica + clic `Save Values`.

**Historia:**
> Como ingeniero de simulacion, quiero asignar pesos porcentuales a cada etiqueta textual de retorno (yes/no, etc.) para ejecutar simulaciones estocasticas con distribucion controlada.

**Contexto de negocio:**
Los pesos probabilisticos son el mecanismo por el cual la simulacion deja de ser 50/50 aleatoria o deterministica (retorno constante) y pasa a ser **distribucion controlada por modelador**. Permite explorar escenarios tipo "yes 20%, no 80%" sin cambiar el codigo de la funcion.

**Criterios de aceptacion:**
- **Dado** que abro el dialogo `Please select one of the following values` sobre un proceso con funcion, **cuando** selecciono el radio `Textual Value`, **entonces** se activa la seccion con lista de pares `<etiqueta>: <peso %>`.
- **Dado** que estoy en Textual Value, **cuando** escribo `yes: 20` y `no: 80`, **entonces** los pesos quedan editables.
- **Dado** que hago clic en `Save Values`, **cuando** se cierra el modal, **entonces** los pesos se persisten en `proceso.function.weights = [{label:"yes", weight:20}, {label:"no", weight:80}]`.
- **Dado** que ejecuto la simulacion con randomize activo (HU-B4.021), **cuando** el proceso computacional se dispara, **entonces** retorna `yes` o `no` segun la distribucion guardada.
- **Dado** que la suma de pesos no es 100, **cuando** hago `Save Values`, **entonces** **pregunta abierta §11 doc fuente**: ¿validacion o warning? No observado.

**Reglas y restricciones:**
- Pesos: enteros 0-100.
- No se observa validacion explicita de suma = 100 (§5.4).
- `Reset Values` limpia sin cerrar; `Close` cierra sin guardar; `Save Values` persiste y cierra.

**Modelo de datos tocado:**
- `proceso.function.returnMode` — `"textual" | "numerical"` — persistente.
- `proceso.function.weights` — `Array<{label: string, weight: number}>` — persistente (cuando `textual`).

**Dependencias:**
- Bloqueada por: HU-B4.011, HU-B4.012.
- Relaciona: EPICA-B3 (range validation — comparte modal y radio `Numerical Value`).

**Integraciones:**
- Runner (EPICA-B0/B1): usar distribucion en retorno estocastico.
- Modal compartido con EPICA-B3.

**Notas de evidencia:**
- Fuente OPCloud: §2.4, §3.5.
- Frames: frame_00040.
- Transcripcion: "yes... no... we have the percentage of the result you want to get"; ejemplos 50/50, 80/20, 0/100.
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [simulacion-computacional, probabilidad, modal, funcion, pesos].

---

### HU-B4.016 — Anadir filas adicionales de etiquetas en Textual Value con boton `+`

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; K secundario.
**Superficie UI:** modal-please-select-values.
**Gesto canonico:** clic en boton `+` dentro de Textual Value.

**Historia:**
> Como ingeniero de simulacion, quiero anadir mas etiquetas de retorno (mas alla de yes/no) para modelar dominios enumerables multi-valor (p.ej. `low`, `medium`, `high`).

**Contexto de negocio:**
Aunque los frames solo muestran el caso binario yes/no, el dialogo expone boton `+` para extender el dominio. Esto permite modelar procesos estocasticos con enumeraciones ricas sin limitarse a binarias.

**Criterios de aceptacion:**
- **Dado** que estoy en Textual Value con dos filas, **cuando** hago clic en `+`, **entonces** aparece una nueva fila vacia para nueva etiqueta y peso.
- **Dado** que anadi tres filas (`low: 20`, `medium: 50`, `high: 30`), **cuando** hago `Save Values`, **entonces** `weights` persiste con tres entradas.
- **Dado** que elimino una fila (si hay boton de borrar — pregunta abierta), **cuando** se actualiza, **entonces** el array se reduce.

**Reglas y restricciones:**
- Sin limite superior observado al numero de filas.
- Etiquetas pueden ser cualquier string (inferido — no validacion observada).
- **Pregunta abierta**: boton de eliminar fila no observado en los frames.

**Modelo de datos tocado:**
- `proceso.function.weights` — Array de longitud variable — persistente.

**Dependencias:**
- Bloqueada por: HU-B4.015.

**Integraciones:**
- Runner: debe soportar distribucion con N etiquetas.

**Notas de evidencia:**
- Fuente OPCloud: §2.4 "Boton `+` para anadir filas".
- Clase de afirmacion: observado (control visible) + inferido (extensibilidad).

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulacion-computacional, probabilidad, modal, enum].

---

### HU-B4.017 — Ver token verde recorriendo enlace activo durante simulacion

**Actor primario:** IS.
**Actores secundarios:** MN, RV.
**Tipo:** opcloud-ui.
**Nivel categorico:** V.
**Superficie UI:** canvas-opd.
**Gesto canonico:** ninguno (animacion durante simulacion corriendo).

**Historia:**
> Como ingeniero de simulacion, quiero ver un token verde animado desplazandose por los enlaces durante la simulacion para seguir visualmente el flujo de ejecucion.

**Contexto de negocio:**
El token verde es la afordance visual que transforma el canvas estatico en vista dinamica durante la simulacion. Sin el token, el modelador no puede percibir la ejecucion — tendria que inferirlo del contador y del OPL. Es critico para debug y para comprension pedagogica del flow.

**Criterios de aceptacion:**
- **Dado** que la simulacion esta corriendo (Play activo) y no esta en modo Headless (HU-B4.020), **cuando** un enlace se activa, **entonces** un circulo verde relleno (~8-10 px) aparece y se desplaza a lo largo del enlace.
- **Dado** que la simulacion pausa, **cuando** presiono Pause, **entonces** el token se detiene en su posicion actual sobre el enlace.
- **Dado** que la simulacion termina (Stop o fin natural), **cuando** concluye, **entonces** los tokens desaparecen del canvas.
- **Dado** que el enlace lleva modificador `c` con piruleta, **cuando** el token pasa, **entonces** hay solapamiento visual temporal (§9 convencion — ambos son circulos de ~8 px).

**Reglas y restricciones:**
- Diametro: 8-10 px.
- Color: verde relleno.
- Se dibuja sobre el trazo del enlace, no desplazado.
- Render transitorio: no se persiste.
- Solapamiento visual con piruleta es aceptado (no se ha observado mejora).

**Modelo de datos tocado:**
- Ninguno (render volatil).

**Dependencias:**
- Bloqueada por: EPICA-B0 (runner basico play/pause/stop).
- Relaciona: HU-B4.020 (Headless suprime el token).

**Integraciones:**
- Renderer JointJS con capa de animacion.
- Runner emite eventos `link.activated` para disparar animacion.

**Notas de evidencia:**
- Fuente OPCloud: §2.1, §3.2, §9. Evidencia visual: JOYAS §1 colores.
- Frames: frame_00022, frame_00028, frame_00043.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulacion-conceptual, render, animacion, token].

---

### HU-B4.018 — Ejecutar paso a paso con toggle synchronized execution

**Actor primario:** IS.
**Tipo:** simulacion-opm.
**Nivel categorico:** U primario; K secundario (runner).
**Superficie UI:** barra-runner (boton `▶△` sync execution).
**Gesto canonico:** clic sobre boton `▶△` + avance manual.

**Historia:**
> Como ingeniero de simulacion, quiero ejecutar la simulacion paso a paso para inspeccionar el estado del modelo despues de cada transicion durante un bucle con condicion.

**Contexto de negocio:**
El modo sincronizado paso-a-paso es critico para debug de modelos con condiciones y bucles. Sin el, las simulaciones rapidas de bucles complejos no permiten observar que rama se eligio en cada iteracion. La ejecucion rapida es util para estadistica, pero el modelador necesita el paso-a-paso para razonar.

**Criterios de aceptacion:**
- **Dado** que estoy en modo simulacion con Play disponible, **cuando** hago clic sobre el toggle `▶△` synchronized execution, **entonces** el modo cambia a sincronizado y el toggle queda activo.
- **Dado** que el modo sincronizado esta activo, **cuando** presiono Play, **entonces** la simulacion avanza un paso (un enlace activado, una rama evaluada) y luego pausa esperando input.
- **Dado** que la simulacion espera, **cuando** presiono Play de nuevo (o shortcut equivalente), **entonces** avanza un paso mas.
- **Dado** que llego al final del flow, **cuando** no hay mas pasos, **entonces** la simulacion termina y emite trace completa.
- **Dado** que desactivo el toggle, **cuando** presiono Play, **entonces** la simulacion corre a velocidad continua (segun slider HU-B4.019).

**Reglas y restricciones:**
- El toggle es binario: rapido vs sincronizado.
- Nombre completo "synchronized execution" tomado de transcripciones hermanas (Advance 9, MQTT) — no visible en los frames de B4.
- **Pregunta abierta**: ¿hay shortcut de teclado para avanzar paso? Frames no lo muestran (§8 doc fuente).

**Modelo de datos tocado:**
- `runner.mode` — `"continuous" | "synchronized"` — transitorio.

**Dependencias:**
- Bloqueada por: EPICA-B0.

**Integraciones:**
- Runner core.
- UI barra superior.

**Notas de evidencia:**
- Fuente OPCloud: §2.2 tabla.
- Frames: frame_00025, frame_00046, frame_00048.
- Clase de afirmacion: observado (boton visible) + inferido (comportamiento exacto).

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [simulacion-conceptual, runner, paso-a-paso, toggle].

---

### HU-B4.019 — Ajustar velocidad de simulacion con slider porcentual

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** barra-runner (slider).
**Gesto canonico:** drag del slider.

**Historia:**
> Como ingeniero de simulacion, quiero ajustar la velocidad de animacion con un slider para balancear legibilidad (lento) vs estadistica (rapido) segun el caso.

**Contexto de negocio:**
Velocidad mayor permite correr muchas iteraciones del bucle rapidamente para observar distribucion estadistica; velocidad menor permite observar una iteracion en detalle. El slider con porcentaje (observado: 130%) es la afordance estandar.

**Criterios de aceptacion:**
- **Dado** que estoy en modo simulacion, **cuando** miro la barra del runner, **entonces** veo slider de velocidad con porcentaje visible (default probable: 100%).
- **Dado** que arrastro el slider a 130%, **cuando** suelto, **entonces** la simulacion avanza 30% mas rapido.
- **Dado** que la simulacion esta corriendo, **cuando** ajusto el slider, **entonces** el cambio se aplica en vivo sin pausar.
- **Dado** que pongo velocidad muy baja, **cuando** observo, **entonces** el token verde (HU-B4.017) se mueve mas lento y es visible frame por frame.

**Reglas y restricciones:**
- Rango exacto no explorado en los frames (§5.5 — solo 130% observado).
- Default: no documentado; probable 100%.

**Modelo de datos tocado:**
- `runner.speedPercent` — number — transitorio.

**Dependencias:**
- Bloqueada por: EPICA-B0.

**Integraciones:**
- Engine de animacion.

**Notas de evidencia:**
- Fuente OPCloud: §2.2, §5.5.
- Frames: frame_00022, frame_00025, frame_00028, frame_00043, frame_00046, frame_00048.
- Transcripcion: "let's give it a little bit more speed".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [simulacion-conceptual, runner, slider, velocidad].

---

### HU-B4.020 — Activar modo Headless Runner para suprimir animaciones

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; V secundario.
**Superficie UI:** barra-runner (checkbox Headless).
**Gesto canonico:** clic en checkbox.

**Historia:**
> Como ingeniero de simulacion, quiero activar el modo Headless para correr simulaciones rapidas sin animaciones cuando solo me interesa la trace final y no la visualizacion.

**Contexto de negocio:**
Headless es critico para ejecutar muchas iteraciones (1000+) sin el costo de renderizar token verde, parpadeo de estados, etc. Util para coleccionar estadistica sobre un modelo con pesos probabilisticos (HU-B4.015). El video no activa el modo — es hipotesis basada en el control visible.

**Criterios de aceptacion:**
- **Dado** que estoy en modo simulacion, **cuando** activo el checkbox `Headless Runner`, **entonces** el modo cambia a headless.
- **Dado** que headless esta activo, **cuando** presiono Play, **entonces** la simulacion corre sin dibujar token verde ni parpadeo de estados.
- **Dado** que la simulacion termina en headless, **cuando** miro la barra, **entonces** el contador refleja el total y puedo exportar XLSX (HU-B4.026).
- **Dado** que desactivo headless, **cuando** corro de nuevo, **entonces** las animaciones reaparecen.

**Reglas y restricciones:**
- Headless suprime render volatil (tokens, parpadeos) pero mantiene update de contador y OPL.
- **Hipotesis §5.5**: "probablemente suprime parpadeo de estados actuales"; comportamiento exacto no observado.

**Modelo de datos tocado:**
- `runner.headless` — boolean — transitorio.

**Dependencias:**
- Bloqueada por: EPICA-B0.

**Integraciones:**
- Renderer (desactivar capa de animacion).
- Performance: simulaciones largas deben ser mucho mas rapidas.

**Notas de evidencia:**
- Fuente OPCloud: §2.2, §5.5.
- Frames: frame_00022, frame_00025, frame_00028, frame_00043, frame_00046, frame_00048.
- Clase de afirmacion: observado (control visible) + hipotesis (comportamiento).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [simulacion-conceptual, runner, headless, performance, requires-clarification].

---

### HU-B4.021 — Activar randomize con boton de dados para asignacion aleatoria

**Actor primario:** IS.
**Tipo:** simulacion-opm.
**Nivel categorico:** U primario; K secundario (runtime).
**Superficie UI:** barra-runner (icono dados).
**Gesto canonico:** toggle sobre boton de dados.

**Historia:**
> Como ingeniero de simulacion, quiero activar el boton de dados para que la simulacion asigne valores aleatorios en estados alcanzables y en funciones con pesos probabilisticos.

**Contexto de negocio:**
Randomize es el toggle global que convierte simulacion determinista en estocastica. Sin el, la simulacion usa default o primer estado (hipotesis §4.2). Con el, los estados se eligen segun distribucion uniforme o pesos.

**Criterios de aceptacion:**
- **Dado** que estoy en modo simulacion, **cuando** miro la barra, **entonces** veo icono de dados toggleable.
- **Dado** que activo dados, **cuando** corro simulacion 5 veces con Object 3 enlace a caja general (no anclado a estado), **entonces** observo distribucion ~50/50 entre `yes` y `no`.
- **Dado** que activo dados y un proceso tiene pesos 20/80, **cuando** corro N veces, **entonces** la distribucion observada se acerca a 20/80 conforme N crece.
- **Dado** que desactivo dados, **cuando** corro simulacion, **entonces** **pregunta abierta §11**: ¿usa el estado inicial? ¿El primer estado de la lista? ¿Falla? No observado.

**Reglas y restricciones:**
- Toggle global aplica a:
  - estados alcanzables sin funcion (distribucion uniforme — hipotesis);
  - funciones con Textual Value weights (distribucion por pesos).
- El comportamiento con dados off es **pregunta abierta**.

**Modelo de datos tocado:**
- `runner.randomize` — boolean — transitorio.

**Dependencias:**
- Bloqueada por: EPICA-B0.
- Relaciona: HU-B4.015 (pesos).

**Integraciones:**
- Runner: fuente de aleatoriedad.

**Notas de evidencia:**
- Fuente OPCloud: §2.2, §4.2.
- Frames: frame_00022, frame_00025, frame_00028, frame_00038, frame_00043, frame_00046, frame_00048.
- Transcripcion indirecta: "randomly selected".
- Clase de afirmacion: observado + hipotesis (comportamiento off).
- Etiqueta: `requires-clarification` sobre comportamiento con dados off.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulacion-conceptual, runner, randomize, probabilidad].

---

### HU-B4.022 — Detectar bucle infinito y permitir freno manual con Stop

**Actor primario:** IS.
**Actores secundarios:** IA (analista de modelo).
**Tipo:** simulacion-opm.
**Nivel categorico:** U primario; D (validacion de modelo) secundario.
**Superficie UI:** barra-runner (Stop).
**Gesto canonico:** clic en Stop.

**Historia:**
> Como ingeniero de simulacion, quiero detener manualmente la simulacion con el boton Stop cuando detecto que el bucle no termina para cortar la ejecucion sin perder el modelo.

**Contexto de negocio:**
Cuando la funcion computacional retorna siempre la etiqueta que dispara la invocacion (ej. siempre `yes`), la simulacion entra en bucle infinito. OPCloud **no previene** este error de modelado — no hay cutoff automatico, el contador avanza indefinidamente, y no hay warning en el OPL. El modelador es responsable; el producto solo ofrece el Stop manual.

**Criterios de aceptacion:**
- **Dado** que ejecuto una simulacion con funcion `return 'yes';` que dispara bucle, **cuando** observo el contador, **entonces** avanza sin limite.
- **Dado** que detecto el bucle infinito, **cuando** hago clic en Stop, **entonces** la simulacion se detiene y el runner resetea.
- **Dado** que el bucle es infinito, **cuando** consulto OPL, **entonces** **no** aparece warning o advertencia de recursion no terminante.
- **Dado** que corto con Stop, **cuando** miro el modelo, **entonces** el modelo queda intacto (no se corrompe).

**Reglas y restricciones:**
- Sin cutoff automatico por numero de iteraciones (§4.1).
- Sin warning preventivo en OPL o canvas.
- El usuario asume responsabilidad de detectar — es error de modelado, no del runner.
- **HU futura candidata**: cutoff automatico configurable (N max iteraciones) — no observado en OPCloud.

**Modelo de datos tocado:**
- `runner.status` — `"running" | "stopped"` — transitorio.

**Dependencias:**
- Bloqueada por: HU-B4.008 (bucle modelado).

**Integraciones:**
- Runner core.
- Futuro: EPICA-D0 (missing-knowledge analysis) podria detectar bucles potencialmente infinitos antes de correr.

**Notas de evidencia:**
- Fuente OPCloud: §3.4 paso 5, §4.1.
- Transcripcion: "we created an infinite loop we will need to stop the simulation".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [bucle, bucle-infinito, runner, seguridad, stop].

---

### HU-B4.023 — Ver contador de iteraciones avanzando durante bucle

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** barra-runner (contador).
**Gesto canonico:** ninguno (display).

**Historia:**
> Como ingeniero de simulacion, quiero ver un contador numerico en la barra que avance en cada iteracion del bucle para monitorear el progreso y detectar bucles infinitos.

**Contexto de negocio:**
El contador es el unico feedback numerico del runner. En un bucle complejo, observar que el numero se incrementa sin freno es la senal de bucle infinito (§4.1). Tambien ayuda a entender cuantas iteraciones tomo una simulacion estocastica.

**Criterios de aceptacion:**
- **Dado** que corro una simulacion con bucle, **cuando** cada iteracion se completa, **entonces** el contador incrementa en 1.
- **Dado** que la simulacion termina normalmente, **cuando** consulto contador, **entonces** muestra el total final (observados: 1, 5).
- **Dado** que hago Stop, **cuando** reinicia, **entonces** el contador vuelve a su valor inicial o permanece segun comportamiento (no claro).
- **Dado** que el contador es editable, **cuando** escribo un valor, **entonces** **pregunta abierta §5.5**: ¿es guard global ("detener tras N")? Frames sugieren display solo.

**Reglas y restricciones:**
- Valor entero.
- Sin etiqueta explicita (§9 convencion).
- Editable visualmente (campo input), pero rol como guard es hipotesis.
- **Pregunta abierta**: ¿funciona como limite global de iteraciones?

**Modelo de datos tocado:**
- `runner.iterationCount` — number — transitorio.

**Dependencias:**
- Bloqueada por: EPICA-B0.

**Integraciones:**
- Runner core.

**Notas de evidencia:**
- Fuente OPCloud: §2.2, §5.5.
- Frames: frame_00025, frame_00038, frame_00046, frame_00048.
- Clase de afirmacion: observado + hipotesis.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [simulacion-conceptual, runner, contador, display, requires-clarification].

---

### HU-B4.024 — Modelar bucles anidados mediante invocaciones cruzadas

**Actor primario:** IS.
**Actores secundarios:** AD, ME.
**Tipo:** simulacion-opm.
**Nivel categorico:** K primario; V secundario.
**Superficie UI:** canvas-opd multi-nivel (multiple in-zooms).
**Gesto canonico:** enlaces de invocacion apuntando a ancestros distintos en distintos niveles.

**Historia:**
> Como ingeniero de simulacion experto, quiero modelar bucles anidados creando enlaces de invocacion que apuntan a ancestros de distinto nivel para expresar flujos de control con estructura jerarquica (bucle externo + bucle interno).

**Contexto de negocio:**
La semantica OPM de bucles via invocacion se generaliza naturalmente: si un subproceso en nivel N+2 apunta a un ancestro en nivel N+1, forma un bucle interno; si apunta a N, es bucle externo [OPL-ES §8.2 IV1]. Anidacion natural siempre que el ancestro referenciado contenga al invocador. Esta HU captura el patron aunque el video no lo demuestra explicitamente — es extension de HU-B4.008.

**Criterios de aceptacion:**
- **Dado** que tengo dos niveles de in-zoom (A Processing → B Processing → inner processes), **cuando** un inner process invoca a B Processing, **entonces** se crea bucle interno alrededor de B.
- **Dado** que el mismo inner process invoca a A Processing, **cuando** se configura, **entonces** se crea bucle externo que reinicia toda la descomposicion de A.
- **Dado** que ambos bucles coexisten, **cuando** la simulacion corre, **entonces** el bucle interno se ejecuta hasta terminar antes de que el externo decida continuar.
- **Dado** que una invocacion apunta a un proceso que **no** es ancestro (error de modelado), **cuando** el validador corre, **entonces** marca el enlace como invalido.

**Reglas y restricciones:**
- La invocacion requiere que el target sea ancestro del source (el source debe vivir dentro de la descomposicion del target).
- Bucles anidados son composicion natural de HU-B4.008 en multiples niveles.
- **Pregunta abierta**: ¿OPCloud detecta y previene invocacion a proceso no-ancestro? No observado.

**Modelo de datos tocado:**
- Composicion de enlaces `enlace.tipo="invocation"` con targets distintos.

**Dependencias:**
- Bloqueada por: HU-B4.008, EPICA-12 (in-zoom anidado).

**Integraciones:**
- Kernel validador: chequeo de ancestria.
- Runner: stack de bucles activos.
- OPL: multiples oraciones `invokes` [OPL-ES §8.2 IV1].

**Notas de evidencia:**
- Fuente normativa: [OPL-ES §8.2 IV1] semantica de invocacion proceso→proceso.
- Fuente OPCloud: inferencia a partir de §3.1, §5.2.
- Clase de afirmacion: hipotesis (no observado directamente).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** L.
**Etiquetas:** [bucle, anidado, inzoom, invocacion, avanzado, requires-clarification].

---

### HU-B4.025 — Ejecutar varias simulaciones sobre el mismo modelo con Stop/Play

**Actor primario:** IS.
**Tipo:** simulacion-opm.
**Nivel categorico:** U.
**Superficie UI:** barra-runner.
**Gesto canonico:** secuencia Play → Stop → Play.

**Historia:**
> Como ingeniero de simulacion, quiero correr multiples veces la simulacion con Stop/Play para observar variabilidad estocastica sobre el mismo modelo sin recargarlo.

**Contexto de negocio:**
En simulacion estocastica (HU-B4.021, HU-B4.015), correr una sola vez no es suficiente — el modelador necesita observar la distribucion de resultados. La transcripcion muestra: "if i will run it five times now you will be able to see that each time it will be an o" (§3.3). Stop/Play sucesivos es el patron basico de ensayo.

**Criterios de aceptacion:**
- **Dado** que termine una simulacion (natural o Stop), **cuando** presiono Play de nuevo, **entonces** la simulacion comienza desde el estado inicial del modelo.
- **Dado** que corri 5 veces con dados activos, **cuando** observo los resultados, **entonces** la distribucion refleja la aleatoriedad configurada.
- **Dado** que el modelo no cambio entre runs, **cuando** corro, **entonces** el estado inicial es consistente.
- **Dado** que modifico el modelo (pesos, conexiones) entre runs, **cuando** corro, **entonces** la simulacion usa el modelo actualizado.

**Reglas y restricciones:**
- Cada Play reinicia el estado del modelo al inicial.
- El contador puede resetearse (pregunta abierta HU-B4.023) o acumular.
- No hay modo batch "correr N veces" observado — debe ser manual (ver HU candidata futura de batch mode).

**Modelo de datos tocado:**
- `runner.runs` — lista de traces — transitorio (hipotesis).

**Dependencias:**
- Bloqueada por: EPICA-B0.

**Integraciones:**
- Runner: reset de estado entre runs.
- XLSX export (HU-B4.026): consolida multiples runs (hipotesis).

**Notas de evidencia:**
- Fuente OPCloud: §3.3 "each time simulation will be run", §3.5 "probar 80/20... aparece yes una de cinco veces".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulacion-conceptual, runner, reset, replay].

---

### HU-B4.026 — Exportar trazo de la simulacion condicional como XLSX

**Actor primario:** IS.
**Actores secundarios:** IA.
**Tipo:** opcloud-ui.
**Nivel categorico:** X (integracion externa).
**Superficie UI:** barra-runner (boton XLSX).
**Gesto canonico:** clic en boton `XLSX` con icono de descarga.

**Historia:**
> Como ingeniero de simulacion, quiero exportar el trazo de la simulacion como planilla XLSX para analizar resultados estadisticos fuera de OPCloud.

**Contexto de negocio:**
Simulaciones con bucles y pesos generan datos que se analizan mejor en una planilla (distribucion de resultados, iteraciones por run, transiciones de estado). El XLSX es el puente al mundo analitico (Excel, Sheets, R). El boton solo esta habilitado tras correr al menos una simulacion.

**Criterios de aceptacion:**
- **Dado** que corri una simulacion, **cuando** miro la barra del runner, **entonces** el boton `XLSX` esta habilitado.
- **Dado** que no he corrido nada, **cuando** miro, **entonces** el boton esta deshabilitado (gris).
- **Dado** que hago clic en `XLSX`, **cuando** se procesa, **entonces** se descarga un archivo con columnas mostrando: iteracion, estado de cada objeto, rama ejecutada, retorno de cada funcion, tiempo.
- **Dado** que corri con bucle infinito y lo detuve con Stop, **cuando** exporto, **entonces** el XLSX contiene todas las iteraciones hasta el Stop.

**Reglas y restricciones:**
- Formato: XLSX (no CSV simple).
- Contenido exacto no observado (no se abre en el video para este flow); la spec interna se define en EPICA-B0 o hermana.
- **Pregunta abierta §7 doc fuente**: ¿export del trazo incluye decoraciones del canvas (tokens, piruletas)? Probable no.

**Modelo de datos tocado:**
- Ninguno (export de trace volatil).

**Dependencias:**
- Bloqueada por: EPICA-B0, HU-B4.025.

**Integraciones:**
- Motor de export XLSX (libreria externa).
- Trace del runner.

**Notas de evidencia:**
- Fuente OPCloud: §2.2 tabla, §7.
- Frames: frame_00025, frame_00046, frame_00048.
- Clase de afirmacion: observado (boton visible) + inferido (contenido).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [simulacion-conceptual, export, xlsx, integracion, requires-clarification].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **QB4.1** — Posicion de la letra `c`: ¿expone OPCloud control para moverla a otro lado del enlace? Afecta HU-B4.004. Marcada `requires-clarification`.
- **QB4.2** — Guard vs trigger (condicion vs evento): ¿puede el modelador marcar `c` en un enlace de salida para declarar post-chequeo? ¿Existe subtipo `evento` distinto de `condicion` con marcador `e`? Afecta HU-B4.007. Marcada `requires-clarification`.
- **QB4.3** — Destino alternativo de invocacion: ¿puede la flecha de invocacion apuntar al contorno del proceso ancestro cuando no hay objeto con estados? Afecta HU-B4.009.
- **QB4.4** — Comportamiento con randomize off: ¿estado inicial, primer estado, o falla? Afecta HU-B4.021.
- **QB4.5** — Contador como guarda global: ¿puede el contador definir "detener tras N iteraciones"? Afecta HU-B4.023.
- **QB4.6** — Cierre de bucle con enlace a estado `yes` vs a proceso: ¿distincion semantica? Pregunta central para el capitulo de control-flow.
- **QB4.7** — Validacion de suma de pesos: ¿hay validacion al `Save Values` si suma ≠ 100? Afecta HU-B4.015.
- **QB4.8** — Export con simulacion pausada: ¿PDF/SVG capturan token verde en vuelo? Afecta HU-B4.026 y cross EPICA-60/61.
- **QB4.9** — Sufijo `<>` con nombres que ya tienen parentesis (`f(x)`): ¿se renderiza `f(x) <>` o se colapsa? Afecta HU-B4.012.
- **QB4.10** — Bucles anidados: ¿OPCloud valida que invocacion apunta a ancestro real? Afecta HU-B4.024.
- **QB4.11** — Shortcut de paso a paso: ¿hay atajo de teclado para avanzar en modo sincronizado? Afecta HU-B4.018 y cross EPICA-90.
- **QB4.12** — Consumption condicion: frames muestran solo instrumento condicion. ¿Es legal consumption condicion segun SSOT? Afecta HU-B4.002.

## Referencias cruzadas

- **Doc fuente:** `opcloud-reverse/b4-simulation-conditions-loops.md`.
- **Fuente normativa:** `opm-iso-19450-es.md`, `opm-visual-es.md`, `opm-opl-es.md`.
- **Evidencia OPCloud:** `JOYAS.md`, `sandbox-data/`, `assets/svg/`, `decompiled/`.
- **Epicas hermanas en simulacion:**
  - **EPICA-B0** (`simulacion-conceptual`): runner basico play/pause/stop, estado inicial, reset. Bloquea a la mayoria de HU-B4 (runner es prerequisito).
  - **EPICA-B1** (`simulacion-computacional`): marca `c` en elipse de proceso (computationality), dueno del campo `proceso.computational`.
  - **EPICA-B2** (`simulacion-user-functions`): editor completo de funciones user-defined. HU-B4.011 es su version inline.
  - **EPICA-B3** (`simulacion-range-validation`): comparte modal `Please select one of the following values` con radio `Numerical Value`.
  - **EPICA-B5** (`simulacion-user-input`): alternativa donde el retorno lo da el usuario en vivo, no la funcion.
- **Epicas que dependen de esta:**
  - **EPICA-D0** (missing-knowledge): podria detectar bucles potencialmente infinitos antes de correr.
  - **EPICA-60/61** (export PDF/SVG): comportamiento con simulacion pausada (§QB4.8).
- **Invariantes del repo:**
  - `src/nucleo/tipos.ts`: campos `enlace.condicion`, `enlace.sourceState`, `enlace.targetState`, `enlace.targetPort`, `proceso.function.{body, returnMode, weights}`, `proceso.computational`.
  - `src/nucleo/validacion/`: reglas "condicion solo en instrumento/consumo", "invocation target debe ser ancestro".
  - `src/render/jointjs/`: markers de piruleta, letra `c`, token verde animado, sufijo `<>`.
  - `src/render/opl-renderer.ts`: oraciones `ocurre si` [OPL-ES §7], `invoca` [OPL-ES §8.2].
  - No hay primitiva `while/until/for each` en kernel — los bucles son siempre invocaciones. Consistente con el principio de SSOT: no inventar funcionalidad fuera de OPM.
- **SSOT OPM relevante:**
  - `opm-visual-es.md` §4 (piruleta), §9.1 (zigzag de invocacion — divergencia observada, OPCloud usa flecha recta).
  - `opm-opl-es.md` §2 (vocabulario clave de condicion: `si`, `de lo contrario`, `en cuyo caso`, `ocurre`, `se omite`, `inicia`, `invoca`), §7 (plantillas CS1..CS6), §8.2 (plantillas IV1, IV2).
- **Divergencias OPCloud vs SSOT detectadas:**
  - Flecha de invocacion recta (OPCloud) vs zigzag (SSOT §9.1). Decision pendiente: seguir SSOT o OPCloud.
  - Posicion de `c` no prescrita por SSOT — OPCloud adopta adyacente a piruleta por convencion.
  - OPL colapsa invocacion a proceso→proceso ignorando estado destino (§5.2). Afecta generacion de OPL en motor.
