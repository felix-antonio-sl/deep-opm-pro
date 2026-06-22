# 71 — OPL-ES: plantillas procedimentales

**Alcance**: plantillas T (transformadoras básicas), TS (con estado especificado), H (habilitadoras), HS (con estado), ET (evento transformador), EH (evento habilitador), ETS, EHS, CT (condición transformadora), CH (condición habilitadora), CS (condición con estado), EX (excepción), IV (invocación).
**Capa SSOT propietaria**: `opm-opl-es.md` §4–§8
**Aplicación en la app**: `src/render/opl-renderer.ts`, generador de texto canónico.

## Reglas

### R-3100: Plantillas T — transformadores básicos

- Enunciado:

| ID | Tipo | OPL-EN | OPL-ES |
|---|---|---|---|
| T1 | Consumo | Processing consumes Consumee. | *Procesar* consume **Consumido**. |
| T2 | Resultado | Processing yields Resultee. | *Procesar* genera **Resultado**. |
| T3 | Efecto | Processing affects Affectee. | *Procesar* afecta **Afectado**. |

- Referencia SSOT: `opm-opl-es.md` §4.1
- Aplicación en código: plantilla fija por tipo de enlace.

### R-3101: Plantillas TS — transformadores con estado especificado

- Enunciado:

| ID | Tipo | OPL-EN | OPL-ES |
|---|---|---|---|
| TS1 | Consumo s-s | Process consumes specified-state Object. | *Proceso* consume **Objeto** en `estado`. |
| TS2 | Resultado s-s | Process yields specified-state Object. | *Proceso* genera **Objeto** en `estado`. |
| TS3 | Efecto entrada-salida | Process changes Object from input-state to output-state. | *Proceso* cambia **Objeto** de `estado-entrada` a `estado-salida`. |
| TS4 | Efecto solo entrada | Process changes Object from input-state. | *Proceso* cambia **Objeto** de `estado-entrada`. |
| TS5 | Efecto solo salida | Process changes Object to output-state. | *Proceso* cambia **Objeto** a `estado-salida`. |

- Referencia SSOT: `opm-opl-es.md` §4.2
- Aplicación en código: generador selecciona TS1..TS5 según `estadoOrigen`/`estadoDestino`.
- Nota: TS4 y TS5 son la **realización textual del enlace escindido** en descomposición.

### R-3102: Plantillas H — habilitadores básicos

- Enunciado:

| ID | Tipo | OPL-EN | OPL-ES |
|---|---|---|---|
| H1 | Agente | Agent handles Processing. | **Agente** maneja *Proceso*. |
| H2 | Instrumento | Processing requires Instrument. | *Proceso* requiere **Instrumento**. |

- Referencia SSOT: `opm-opl-es.md` §5.1

### R-3103: Plantillas HS — habilitadores con estado

- Enunciado:

| ID | Tipo | OPL-EN | OPL-ES |
|---|---|---|---|
| HS1 | Agente s-s | Specified-state Agent handles Processing. | **Agente** en `estado` maneja *Proceso*. |
| HS2 | Instrumento s-s | Processing requires specified-state Instrument. | *Proceso* requiere **Instrumento** en `estado`. |

- Referencia SSOT: `opm-opl-es.md` §5.2

### R-3104: Plantillas ET — eventos transformadores

- Enunciado:

| ID | Tipo | OPL-EN | OPL-ES |
|---|---|---|---|
| ET1 | Consumo evento | Object initiates Process, which consumes Object. | **Objeto** inicia *Proceso*, que consume **Objeto**. |
| ET2 | Efecto evento | Object initiates Process, which affects Object. | **Objeto** inicia *Proceso*, que afecta **Objeto**. |

- Referencia SSOT: `opm-opl-es.md` §6.1

### R-3105: Plantillas EH — eventos habilitadores

- Enunciado:

| ID | Tipo | OPL-EN | OPL-ES |
|---|---|---|---|
| EH1 | Agente evento | Agent initiates and handles Process. | **Agente** inicia y maneja *Proceso*. |
| EH2 | Instrumento evento | Instrument initiates Process, which requires Instrument. | **Instrumento** inicia *Proceso*, que requiere **Instrumento**. |

- Referencia SSOT: `opm-opl-es.md` §6.2

### R-3106: Plantillas ETS — eventos transformadores con estado

- Enunciado:

| ID | OPL-EN | OPL-ES |
|---|---|---|
| ETS1 | Specified-state Object initiates Process, which consumes Object. | **Objeto** en `estado` inicia *Proceso*, que consume **Objeto**. |
| ETS2 | Input-state Object initiates Process, which changes Object from input-state to output-state. | **Objeto** en `estado-entrada` inicia *Proceso*, que cambia **Objeto** de `estado-entrada` a `estado-salida`. |
| ETS3 | Input-state Object initiates Process, which changes Object from input-state. | **Objeto** en `estado-entrada` inicia *Proceso*, que cambia **Objeto** de `estado-entrada`. |
| ETS4 | Object in any state initiates Process, which changes Object to destination-state. | **Objeto** en cualquier estado inicia *Proceso*, que cambia **Objeto** a `estado-destino`. |

- Referencia SSOT: `opm-opl-es.md` §6.3

### R-3107: Plantillas EHS — eventos habilitadores con estado

- Enunciado:

| ID | OPL-EN | OPL-ES |
|---|---|---|
| EHS1 | Specified-state Agent initiates and handles Processing. | **Agente** en `estado` inicia y maneja *Proceso*. |
| EHS2 | Specified-state Instrument initiates Processing, which requires specified-state Instrument. | **Instrumento** en `estado` inicia *Proceso*, que requiere **Instrumento** en `estado`. |

- Referencia SSOT: `opm-opl-es.md` §6.4

### R-3108: Plantillas CT — condiciones transformadoras

- Enunciado:

| ID | OPL-EN | OPL-ES |
|---|---|---|
| CT1 | Process occurs if Object exists, in which case Object is consumed, otherwise Process is skipped. | *Proceso* ocurre si **Objeto** existe, en cuyo caso **Objeto** se consume, de lo contrario *Proceso* se omite. |
| CT2 | Process occurs if Object exists, in which case Process affects Object, otherwise Process is skipped. | *Proceso* ocurre si **Objeto** existe, en cuyo caso *Proceso* afecta **Objeto**, de lo contrario *Proceso* se omite. |

- Referencia SSOT: `opm-opl-es.md` §7.1

### R-3109: Plantillas CH — condiciones habilitadoras

- Enunciado:

| ID | OPL-EN | OPL-ES |
|---|---|---|
| CH1 | Agent handles Process if Agent exists, else Process is skipped. | **Agente** maneja *Proceso* si **Agente** existe, de lo contrario *Proceso* se omite. |
| CH2 | Process occurs if Instrument exists, else Process is skipped. | *Proceso* ocurre si **Instrumento** existe, de lo contrario *Proceso* se omite. |

- Referencia SSOT: `opm-opl-es.md` §7.2

### R-3110: Plantillas CS — condiciones con estado

- Enunciado:

| ID | OPL-EN | OPL-ES |
|---|---|---|
| CS1 | Process occurs if Object is specified-state, in which case Object is consumed, otherwise Process is skipped. | *Proceso* ocurre si **Objeto** está en `estado`, en cuyo caso **Objeto** se consume, de lo contrario *Proceso* se omite. |
| CS2 | ... changes Object from input-state to output-state, otherwise skipped. | *Proceso* ocurre si **Objeto** está en `estado-entrada`, en cuyo caso *Proceso* cambia **Objeto** de `estado-entrada` a `estado-salida`, de lo contrario *Proceso* se omite. |
| CS3 | ... changes Object from input-state, otherwise skipped. | *Proceso* ocurre si **Objeto** está en `estado-entrada`, en cuyo caso *Proceso* cambia **Objeto** de `estado-entrada`, de lo contrario *Proceso* se omite. |
| CS4 | ... changes Object to output-state, otherwise skipped. | *Proceso* ocurre si **Objeto** existe, en cuyo caso *Proceso* cambia **Objeto** a `estado-salida`, de lo contrario *Proceso* se omite. |
| CS5 | Agent handles Process if Agent is specified-state, else skipped. | **Agente** maneja *Proceso* si **Agente** está en `estado`, de lo contrario *Proceso* se omite. |
| CS6 | Process occurs if Instrument is specified-state, otherwise skipped. | *Proceso* ocurre si **Instrumento** está en `estado`, de lo contrario *Proceso* se omite. |

- Referencia SSOT: `opm-opl-es.md` §7.3

### R-3111: Plantillas EX — excepciones

- Enunciado:

| ID | Tipo | OPL-EN | OPL-ES |
|---|---|---|---|
| EX1 | Sobretiempo | Handling occurs if duration of Source exceeds max-duration time-units. | *Manejo* ocurre si duración de *Fuente* excede máx-duración unidades-tiempo. |
| EX2 | Subtiempo | Handling occurs if duration of Source falls short of min-duration time-units. | *Manejo* ocurre si duración de *Fuente* es menor que mín-duración unidades-tiempo. |

- Referencia SSOT: `opm-opl-es.md` §8.1

### R-3112: Plantillas IV — invocación

- Enunciado:

| ID | Tipo | OPL-EN | OPL-ES |
|---|---|---|---|
| IV1 | Invocación | Invoking invokes Invoked. | *Invocador* invoca *Invocado*. |
| IV2 | Auto-invocación | Invoking invokes itself. | *Invocador* se invoca a sí mismo. |

- Referencia SSOT: `opm-opl-es.md` §8.2

### R-3113: Resultado no admite evento ni condición

- Enunciado: NO existen variantes de resultado con modificadores de control (evento de resultado, condición de resultado). La restricción es absoluta.
- Referencia SSOT: `opm-iso-19450-es.md` §Enlaces transformadores
- Aplicación en código: generador OPL rechaza esta combinación.

### R-3114: Estado en cualquier estado — comodín

- Enunciado: la forma `**Objeto** en cualquier estado inicia *Proceso*...` (ETS4) es un comodín canónico cuando el evento aplica independientemente del estado.
- Referencia SSOT: `opm-opl-es.md` §6.3 ETS4
- Aplicación en código: mapa especial para `"cualquier estado"`.

### R-3115: Uniformidad de plantilla condicional

- Enunciado: todas las plantillas condicionales siguen el patrón:
  - `*Proceso* ocurre si <condición>, en cuyo caso <acción>, de lo contrario *Proceso* se omite.`

Con variantes específicas cuando la condición involucra habilitador o estado.

- Referencia SSOT: `opm-opl-es.md` §7
- Aplicación en código: constructor de plantillas parametrizado.

### R-3116: Combinación evento + estado inicia

- Enunciado: para eventos con estado, usar el patrón `**Objeto** en <estado> inicia *Proceso*`. El verbo "inicia" captura el modificador `e`.
- Referencia SSOT: `opm-opl-es.md` §6.3
- Aplicación en código: generador OPL usa "inicia" cuando hay modificador `e`.

### R-3117: Escisión TS4/TS5 en descomposición

- Enunciado: cuando un efecto entrada-salida (TS3) se distribuye a descomposición, se escinde en:
  - TS4 en subproceso temprano (saca del estado de entrada)
  - TS5 en subproceso tardío (pone en estado de salida)
- Referencia SSOT: `opm-opl-es.md` §4.2 nota TS4/TS5
- Aplicación en código: al descomponer, reemplazar TS3 por par TS4+TS5 en el OPD hijo.

### R-3118: Palabras clave de excepción

- Enunciado:
  - sobretiempo: "excede" (EN: "exceeds")
  - subtiempo: "es menor que" (EN: "falls short of")
- Referencia SSOT: §2, §8.1

### R-3119: Unidades temporales en excepciones

- Enunciado: las plantillas EX incluyen `unidades-tiempo` para especificar la unidad canónica. Valores válidos: ms, sec, min, hour, day, week, month, year.
- Referencia SSOT: `opm-opl-es.md` §8.1, `opm-visual-es.md` §14.3
- Aplicación en código: validador acepta solo unidades canónicas.

### R-3120: Auto-invocación como bucle

- Enunciado: la auto-invocación IV2 se usa para modelar bucles o iteración. La plantilla canónica es `*Invocador* se invoca a sí mismo.`
- Referencia SSOT: `opm-opl-es.md` §8.2, V-1.5 (rayo)
- Aplicación en código: generador OPL emite esta forma para auto-loops.

## Checklist

- [ ] Plantillas T1–T3 implementadas
- [ ] Plantillas TS1–TS5 implementadas
- [ ] Plantillas H1–H2 y HS1–HS2 implementadas
- [ ] Plantillas ET1–ET2 y EH1–EH2 implementadas
- [ ] Plantillas ETS1–ETS4 y EHS1–EHS2 implementadas
- [ ] Plantillas CT1–CT2 y CH1–CH2 implementadas
- [ ] Plantillas CS1–CS6 implementadas
- [ ] Plantillas EX1–EX2 implementadas
- [ ] Plantillas IV1–IV2 implementadas
- [ ] Resultado nunca con modificador de control
- [ ] Escisión TS4/TS5 en descomposición
- [ ] Unidades temporales canónicas en EX
- [ ] Verbo "inicia" captura modificador `e`

## Antipatrones

- Plantilla ET con resultado (viola "no evento de resultado")
- Condición de resultado como plantilla personalizada
- Descomposición sin escisión TS4/TS5
- Unidad temporal no canónica en EX ("horas", "mins", etc.)
- Confundir H1 (agente) con H2 (instrumento) en generación

## Referencias cruzadas

- Convenciones OPL: `70-opl-convenciones-y-plantillas-cosa-estado.md`
- Enlaces procedimentales: `13-enlaces-taxonomia-familias.md`
- Estado especificado: `15-enlaces-estado-especificado.md`
- Modificadores y excepciones: `16-modificadores-operadores.md`
- Descomposición y escisión: `31-distribucion-enlaces-descomposicion.md`
- Duración y EX: `51-duracion-proceso.md`
