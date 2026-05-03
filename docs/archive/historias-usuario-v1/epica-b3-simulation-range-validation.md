---
epica: "EPICA-B3"
titulo: "Simulacion — validacion de rango, tipo primitivo y aplicacion suave/dura"
doc_fuente: "opcloud-reverse/b3-simulation-range-validation.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "S"
hu_emitidas: 18
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "epica-10-canvas-creacion-cosas.md (piloto SSOT)"
---

## Resumen

Esta epica cubre la capa de **validacion cuantitativa** sobre objetos computacionales:
declarar rangos admisibles, fijar un tipo primitivo, derivar el atributo `Type`
y evaluar cada asignacion de valor con semantica cromatica **azul base / verde lima /
rojo coral**. El alcance incluye tanto el flujo local `Set Range` como la gobernanza
global `Model Validation Options`, ademas de la interaccion con estereotipos tipo
property set que entregan rangos heredados.

La SSOT OPM define el slot de valor [V-163, V-164] como contenedor mutable que puede
exhibir placeholder `value`, escalar, cadena o lista de intervalos y las marcas de
validacion [V-218, V-219] bajo politica de canvas limpio. OPCloud extiende ese nucleo
con notacion multi-intervalo explícita, tipo primitivo y validacion cromatica suave/dura.
Esta epica evalua cada HU contra la SSOT, separando lo que es semantica OPM de lo que
es afordance OPCloud.

La epica no inventa mecanicas de edicion de valor ni de navegacion al modal global
fuera de lo observado. Cuando el documento fuente deja huecos sobre feedback, ruta
de apertura o combinatoria exacta, se preservan como preguntas abiertas explicitas
o como HU con etiqueta `requires-clarification`.

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-B3.001 | Abrir popover `Set Range` desde `Entities Extensions` | IS | S | S | opcloud-ui | [V-163] [V-218] |
| HU-B3.002 | Declarar rango literal en el textbox `Set Range` | IS | S | M | mixto | [§2.3 SSOT] [OPL-ES §12] |
| HU-B3.003 | Seleccionar tipo primitivo en `Values type:` | IS | S | S | mixto | [§2.3 SSOT] [OPL-ES §12] |
| HU-B3.004 | Aplicar `Set Range` y reemplazar `value` por estado-rango azul | IS | S | M | mixto | [V-164] [V-166] |
| HU-B3.005 | Autogenerar atributo derivado `Type` con exhibicion y cinco sub-estados | IS | S | M | opcloud-ui | [OPL-ES §12] |
| HU-B3.006 | Marcar el tipo activo con pin azul sobre `Type` | IS | S | XS | opcloud-ui | — |
| HU-B3.007 | Ver proyeccion OPL de rango, tipos posibles y current state | IS | S | S | mixto | [OPL-ES §12] [OPL-ES §14] |
| HU-B3.008 | Reabrir `Set Range` con rango y tipo previamente cargados | IS | S | S | opcloud-ui | — |
| HU-B3.009 | Mostrar valor en verde lima cuando cumple rango y tipo bajo Soft Validation | IS | S | S | mixto | [V-219] |
| HU-B3.010 | Mostrar valor en rojo coral cuando viola rango o tipo bajo Soft Validation | IS | S | S | mixto | [V-219] [V-220] |
| HU-B3.011 | Revelar el rango original con tooltip `Range:` al hover | IS | S | XS | opcloud-ui | — |
| HU-B3.012 | Configurar `Enforcement level` en `Model Validation Options` | IS | S | S | opcloud-ui | [V-218] |
| HU-B3.013 | Impedir insertar valores invalidos bajo Hard Validation | IS | S | S | mixto | [V-219] [V-226] |
| HU-B3.014 | Configurar `Validation Time` a nivel de modelo | IS | S | S | opcloud-ui | — |
| HU-B3.015 | Declarar un valor por defecto embebido dentro del rango | IS | S | S | opcloud-ui | [OPL-ES §14] |
| HU-B3.016 | Heredar rangos preempacados desde `<<Embedded Device Property Set>>` | IS | S | M | mixto | [V-163] |
| HU-B3.017 | Restringir la re-definicion de un rango heredado a sub-rangos validos | IS | S | M | mixto | [§2.3 SSOT] [V-29] |
| HU-B3.018 | Validar valores contra el sub-rango efectivo heredado/refinado | IS | S | S | mixto | [V-58] [OPL-ES §14] |

Total: **18 historias de usuario** (0 opm-semantica, 8 opcloud-ui, 10 mixto).

## Historias de usuario

### HU-B3.001 — Abrir popover `Set Range` desde `Entities Extensions`

**Actor primario:** IS (ingeniero de simulacion).
**Actores secundarios:** ME (modelador experto que prepara el objeto antes de simular).
**Tipo:** opcloud-ui.
**Nivel categorico:** U (popover y toolbar contextual) primario; K (requiere objeto computacional seleccionable) secundario.
**Superficie UI:** toolbar secundaria `Entities Extensions` + tooltip `Set Range` + popover `Set Range`.
**Gesto canonico:** seleccionar objeto computacional y hacer clic en el icono `Set Range`.

**Historia:**
> Como ingeniero de simulacion, quiero abrir un popover compacto `Set Range` desde la toolbar contextual del objeto para definir restricciones cuantitativas sin abandonar el canvas.

**Contexto de negocio:**
`Range Validation` es una edicion local sobre un objeto ya preparado como computacional.
La SSOT OPM define el slot de valor [V-163] como primitiva visible distinta del estado,
y [V-164] permite exhibir intervalos o lista de intervalos. OPCloud materializa esa
capacidad como popover anclado, no como modal bloqueante, para mantener visible el
objeto objetivo y reducir el costo cognitivo de una operacion frecuente. El tooltip
explicito `Set Range` es el affordance clave que revela la herramienta dentro de
`Entities Extensions`.

**Criterios de aceptacion:**
- **Dado** que tengo seleccionado un objeto computacional, **cuando** se despliega `Entities Extensions`, **entonces** aparece el icono `Set Range` dentro del grupo contextual.
- **Dado** que hago hover sobre el icono, **cuando** el cursor permanece sobre el, **entonces** se muestra un tooltip negro con el texto `Set Range`.
- **Dado** que hago clic en el icono `Set Range`, **cuando** el popover se abre, **entonces** queda anclado bajo el objeto seleccionado sin oscurecer el canvas completo.
- **Dado** que el popover esta abierto por primera vez, **cuando** inspecciono sus controles, **entonces** veo un textbox multi-linea, un selector `Values type:` y un boton `Set`.

**Reglas y restricciones:**
- El flujo observado presupone que el objeto ya fue convertido a computacional y ya tiene unidad y alias asignados.
- La ruta para habilitar `Set Range` cuando faltan unidad o alias no esta documentada; queda abierta.
- El popover es una edicion local no-modal, distinto del modal global `Model Validation Options`.
- Conforme a [V-163], el slot de valor es una primitiva visible distinta del estado cualitativo.

**Modelo de datos tocado:**
- Ninguno directo; la apertura del popover no muta el modelo.

**Dependencias:**
- **Bloqueada por:** HU-B1.001 (el objeto debe ser computacional), HU-B1.003 (unidad visible), HU-B1.004 (alias visible).
- **Bloquea a:** HU-B3.002, HU-B3.003, HU-B3.004, HU-B3.008.

**Integraciones:**
- Toolbar contextual / `Entities Extensions`.
- Tooltip de ayuda contextual.

**Notas de evidencia:**
- Fuente normativa: [V-163] slot de valor como primitiva visible distinta del estado; [V-218] familias de validacion.
- Fuente OPCloud: `opcloud-reverse/b3-simulation-range-validation.md` §1.1, §2, §3.1, §5.1.
- Frames: frame_00006, frame_00008, frame_00010.
- Transcripcion: "the control activator is literally Set Range and lives in the Entities Extensions group".
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [range-validation, ui, popover, toolbar, entities-extensions, opcloud-ui].

---

### HU-B3.002 — Declarar rango literal en el textbox `Set Range`

**Actor primario:** IS.
**Tipo:** mixto.
**Nivel categorico:** K (parser y persistencia de `RangeSpec`) primario; U (textarea) secundario.
**Superficie UI:** textbox del popover `Set Range`.
**Gesto canonico:** escribir sintaxis de rango libre en el textbox.

**Historia:**
> Como ingeniero de simulacion, quiero escribir la sintaxis literal del rango en un textbox libre para expresar intervalos simples, multiples o semi-abiertos sin depender de un constructor grafico.

**Contexto de negocio:**
La SSOT OPM [§2.3] define sintaxis base `qmin..qmax` y admite delimitadores de inclusion
y exclusion `[`/`]`, `(`/`)` asi como listas de intervalos separadas por comas y `*` como
extremo abierto. OPCloud implementa esa gramatica como textbox libre que prioriza
expresividad sobre asistencia visual. Esa flexibilidad es la base que despues consumen
la validacion cromatica, la OPL [OPL-ES §12] y los rangos heredados de estereotipos.

**Criterios de aceptacion:**
- **Dado** que abri `Set Range`, **cuando** escribo `[1..10]` en el textbox y luego aplico `Set`, **entonces** el rango persistido representa un intervalo cerrado entre 1 y 10.
- **Dado** que escribo `[1..10],[20..30]` y aplico `Set`, **cuando** el modelo queda actualizado, **entonces** el rango persistido representa la union de ambos intervalos.
- **Dado** que escribo `(0..*]` y aplico `Set`, **cuando** el modelo queda actualizado, **entonces** el rango persistido representa una cota inferior abierta y una cota superior no acotada.
- **Dado** que escribo un rango valido, **cuando** todavia no presiono `Set`, **entonces** el textbox conserva el texto literal sin validacion en vivo observada.

**Reglas y restricciones:**
- La notacion observada admite `[` y `]` como cerrado, `(` como abierto y `*` como cota superior infinita. Conforme a [§2.3 SSOT].
- La coma entre intervalos expresa union y se observa sin espacios: `[1..10],[20..30]`.
- El parser se aplica al confirmar con `Set`, no durante la escritura.
- El comportamiento exacto ante sintaxis malformada queda abierto.

**Modelo de datos tocado:**
- `object.valueState.rangeSpec.intervals` — lista de intervalos `{lower, upper, lowerOpen, upperOpen}` — persistente.
- `object.valueState.rangeSpec.literal` — string de la notacion original — persistente.

**Dependencias:**
- **Bloqueada por:** HU-B3.001.
- **Bloquea a:** HU-B3.004, HU-B3.009, HU-B3.010, HU-B3.011, HU-B3.015.

**Integraciones:**
- Parser de rangos del kernel.
- Tooltip `Range:` y OPL reutilizan la literal original.

**Notas de evidencia:**
- Fuente normativa: [§2.3 SSOT] sintaxis de rango, multi-intervalo, delimitadores; [OPL-ES §12] produccion formal de expresion de rango.
- Fuente OPCloud: `opcloud-reverse/b3-simulation-range-validation.md` §1, §1.1, §2, §3.1 paso 5, §5.1, §5.3.
- Frames: frame_00013, frame_00015, frame_00020, frame_00040, frame_00050.
- Transcripcion: "first we'll use the inclusion bracket ... then we'll add another range".
- Clase de afirmacion: observado + confirmado por transcripcion + confirmado por SSOT.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [range-validation, kernel, syntax, intervals, multi-interval, wildcard, mixto].

---

### HU-B3.003 — Seleccionar tipo primitivo en `Values type:`

**Actor primario:** IS.
**Tipo:** mixto.
**Nivel categorico:** U (dropdown) primario; K (campo `primitiveType`) secundario.
**Superficie UI:** dropdown `Values type:` dentro del popover `Set Range`.
**Gesto canonico:** abrir dropdown y elegir uno de los tipos primitivos.

**Historia:**
> Como ingeniero de simulacion, quiero fijar el tipo primitivo del valor junto con el rango para que la validacion combine dominio numerico y clase de dato.

**Contexto de negocio:**
La SSOT OPM [§2.3] establece que un objeto puede declarar tipo computacional: `boolean`,
`string`, `integer`, `float`, `double`, `short`, `long` y `enumerated`. OPCloud
operacionaliza un subconjunto de cinco (`int`, `float`, `string`, `char`, `boolean`)
como dropdown dentro del popover de rango. No basta con que un valor caiga dentro
del intervalo numerico: tambien debe respetar el tipo elegido. Esa segunda dimension
permite distinguir `2` de `2.5` cuando el tipo es `int`, y prepara la extension a
mas tipos sin cambiar el gesto ni el modelo mental.

**Criterios de aceptacion:**
- **Dado** que abri `Set Range`, **cuando** inspecciono `Values type:`, **entonces** veo `int` como valor por defecto la primera vez.
- **Dado** que despliego `Values type:`, **cuando** reviso las opciones, **entonces** encuentro exactamente `int`, `float`, `string`, `char` y `boolean`.
- **Dado** que selecciono uno de esos tipos y presiono `Set`, **cuando** el rango queda aplicado, **entonces** el objeto persiste ese `primitiveType` como parte del `RangeSpec`.
- **Dado** que el tipo activo es `int`, **cuando** luego se valida `2.5`, **entonces** ese valor se considera invalido aunque caiga dentro del intervalo numerico observado.

**Reglas y restricciones:**
- El conjunto de tipos primitivos es fijo y cerrado a cinco opciones (SSOT admite mas, OPCloud recorta).
- La transcripcion sugiere que el tipo queda "set permanently"; el comportamiento exacto al intentar cambiarlo en re-edicion queda abierto.
- La validacion combina rango + tipo, no solo la pertenencia al intervalo.

**Modelo de datos tocado:**
- `object.valueState.rangeSpec.primitiveType` — `int | float | string | char | boolean` — persistente.

**Dependencias:**
- **Bloqueada por:** HU-B3.001.
- **Bloquea a:** HU-B3.005, HU-B3.006, HU-B3.009, HU-B3.010.

**Integraciones:**
- Atributo derivado `Type`.
- Validador de rango/tipo.

**Notas de evidencia:**
- Fuente normativa: [§2.3 SSOT] declaracion de tipo computacional; [OPL-ES §12] oracion de tipo de dato.
- Fuente OPCloud: `opcloud-reverse/b3-simulation-range-validation.md` §1.1, §2, §3.1 paso 6, §3.2 paso 5, §5.1.
- Frames: frame_00010, frame_00013, frame_00035.
- Transcripcion: "integer float ... string ... character ... boolean value ... those kind of values will be set permanently".
- Clase de afirmacion: observado + confirmado por transcripcion + SSOT amplia pero OPCloud recorta a 5.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [range-validation, ui, primitive-type, dropdown, type-system, mixto].

---

### HU-B3.004 — Aplicar `Set Range` y reemplazar `value` por estado-rango azul

**Actor primario:** IS.
**Tipo:** mixto.
**Nivel categorico:** K (nace el `RangeSpec`) primario; V (nuevo estado-rango azul) y U (boton `Set`) secundarios.
**Superficie UI:** boton `Set` + estado interno del objeto en canvas.
**Gesto canonico:** clic en boton `Set` del popover.

**Historia:**
> Como ingeniero de simulacion, quiero confirmar el rango con `Set` para que el estado interno del objeto deje de ser `value` generico y pase a representar explicitamente su restriccion cuantitativa.

**Contexto de negocio:**
La SSOT [V-164] permite que un slot de valor contenga "placeholder literal `value`" o
"intervalo o lista de intervalos cuando el dominio permitido deba hacerse visible".
OPCloud implementa esa transicion de `value` a `range-state`, haciendo visible que
el objeto ya no es una celda escalar abierta sino una magnitud acotada. [V-166]
establece que cuando el slot exhibe un rango permitido, los delimitadores `[]`/`()`
y la coma entre intervalos forman parte del token visible y no deben normalizarse
ni colapsarse como simple valor de runtime.

Ese paso se materializa como un rectangulo redondeado con la literal del rango y una
cromatica azul clara que indica "definido pero todavia no evaluado". Esa marca
intermedia separa semanticamente la declaracion del rango de la evaluacion posterior.

**Criterios de aceptacion:**
- **Dado** que el popover `Set Range` contiene una sintaxis valida y un tipo seleccionado, **cuando** hago clic en `Set`, **entonces** el popover aplica el `RangeSpec` al objeto y se cierra.
- **Dado** que el objeto tenia un estado interno `value`, **cuando** el `Set` se aplica por primera vez, **entonces** ese estado pasa a mostrarse como la literal del rango configurado.
- **Dado** que el rango quedo aplicado y aun no hay valor concreto asignado, **cuando** observo el canvas, **entonces** el estado-rango se renderiza con fondo azul claro/cyan palido.
- **Dado** que el rango aplicado es multi-intervalo, **cuando** miro el estado-rango, **entonces** la etiqueta visible conserva la literal completa `[1..10],[20..30]`.

**Reglas y restricciones:**
- El boton `Set` es el commit explicito del `RangeSpec`.
- El estado azul significa "rango definido sin valor evaluado", no "valido" ni "invalido".
- El placeholder previo `value` desaparece al aplicar el rango.
- Conforme a [V-166]: los delimitadores y comas entre intervalos forman parte del token visible sin normalizacion.

**Modelo de datos tocado:**
- `object.valueState.rangeSpec` — objeto compuesto `{intervals, primitiveType, defaultValue?}` — persistente.
- `object.valueState.currentValue` — `null` mientras no haya valor asignado — persistente/transitorio segun sesion.
- `object.valueState.displayText` — literal de rango cuando `currentValue = null` — persistente.

**Dependencias:**
- **Bloqueada por:** HU-B3.002, HU-B3.003.
- **Bloquea a:** HU-B3.005, HU-B3.007, HU-B3.008, HU-B3.009, HU-B3.010.

**Integraciones:**
- Renderer del objeto computacional.
- OPL pane actualiza la sentencia principal del objeto.

**Notas de evidencia:**
- Fuente normativa: [V-164] contenido del slot de valor; [V-166] token visible del rango.
- Fuente OPCloud: `opcloud-reverse/b3-simulation-range-validation.md` §1, §2, §3.1 paso 7, §5.4.
- Frames: frame_00015, frame_00020, frame_00022, frame_00035.
- Transcripcion: "blue ... neither correct or incorrect because this is just the range".
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [range-validation, kernel, render, state, set-action, blue-base, mixto].

---

### HU-B3.005 — Autogenerar atributo derivado `Type` con exhibicion y cinco sub-estados

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** K (creacion automatica de atributo derivado) primario; V (render del atributo y del triangulo) secundario.
**Superficie UI:** canvas del objeto + atributo `Type` + triangulo de exhibicion.
**Gesto canonico:** ninguno directo; deriva automaticamente al aplicar `Set Range`.

**Historia:**
> Como ingeniero de simulacion, quiero que el sistema genere automaticamente el atributo `Type` al definir un rango para explicitar visualmente y en el modelo el dominio de tipos admitidos por el valor.

**Contexto de negocio:**
La SSOT OPL-ES [§12] define la oracion `**Objeto** es de tipo tipo-id` para declarar el
tipo de dato de un objeto computacional. OPCloud materializa esa declaracion como un
atributo exhibido con cinco sub-estados fijos, vinculado al objeto mediante un triangulo
de exhibicion. Es una decision de OPCloud exteriorizar el tipo como cosa visible en vez
de mantenerlo como metadato interno. Esa exteriorizacion hace auditable el tipo y sirve
de apoyo a la OPL y a la lectura del modelo por terceros.

La SSOT prescribe la declaracion de tipo pero no exige un atributo `Type` con exhibicion
visual. Esta HU es una afordance OPCloud que implementa un requisito SSOT.

**Criterios de aceptacion:**
- **Dado** que aplico `Set Range` por primera vez sobre un objeto, **cuando** el canvas se actualiza, **entonces** se crea automaticamente un atributo `Type` asociado a ese objeto.
- **Dado** que el atributo `Type` existe, **cuando** observo su interior, **entonces** veo cinco sub-rectangulos apilados verticalmente con las etiquetas `int`, `float`, `string`, `char` y `boolean`.
- **Dado** que el atributo `Type` fue creado, **cuando** observo la relacion entre objeto y atributo, **entonces** ambos quedan conectados por un triangulo de exhibicion vacio con ruteo Manhattan.
- **Dado** que el objeto ya tenia rango y `Type`, **cuando** re-edito el rango, **entonces** el atributo `Type` se conserva como derivado del `RangeSpec`.

**Reglas y restricciones:**
- `Type` nace automaticamente al primer `Set Range`; no se crea manualmente por arrastre.
- Los cinco sub-estados son fijos y no editables por el modelador.
- `Type` tiene identidad propia como atributo exhibido del objeto computacional.
- Esta HU es opcloud-ui: la SSOT no exige atributo `Type` con exhibicion; es una afordance de OPCloud.

**Modelo de datos tocado:**
- `object.typeAttribute.id` — UUID — persistente.
- `object.typeAttribute.states` — lista fija `["int", "float", "string", "char", "boolean"]` — persistente/derivada.
- `object.typeAttribute.exhibitedBy` — referencia a `object.id` — persistente.

**Dependencias:**
- **Bloqueada por:** HU-B3.003, HU-B3.004.
- **Bloquea a:** HU-B3.006, HU-B3.007.

**Integraciones:**
- Renderer de atributos y links de exhibicion.
- Biblioteca lateral `Draggable OPM Things` incorpora la nueva cosa `Type`.

**Notas de evidencia:**
- Fuente normativa: [OPL-ES §12] oracion de tipo de dato; la SSOT no exige atributo `Type` con exhibicion.
- Fuente OPCloud: `opcloud-reverse/b3-simulation-range-validation.md` §2, §3.1 paso 7, §5.5, §6, §7.2, §7.4.
- Frames: frame_00015, frame_00020, frame_00022, frame_00025.
- Clase de afirmacion: observado + inferido desde el modelo de datos implicito. SSOT prescribe tipo, OPCloud lo materializa como atributo exhibido.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [range-validation, kernel, render, type-attribute, exhibition, opcloud-ui].

---

### HU-B3.006 — Marcar el tipo activo con pin azul sobre `Type`

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** V (render derivado del current state).
**Superficie UI:** atributo `Type` en canvas.
**Gesto canonico:** ninguno directo; render derivado del `primitiveType`.

**Historia:**
> Como ingeniero de simulacion, quiero ver un marcador explicito sobre el sub-estado activo de `Type` para identificar inmediatamente que tipo gobierna la validacion del valor.

**Contexto de negocio:**
La validacion combina dos ejes: intervalo y tipo. El pin azul convierte el segundo eje
en una marca visual inequivoca, incluso cuando el objeto esta lejos del popover original.
OPCloud usa una tercera modalidad de "current state" no prevista en la SSOT visual:
un pin estilo ubicacion que apunta al sub-estado activo. Esta HU es enteramente
opcloud-ui: la SSOT no prescribe este marcador especifico.

**Criterios de aceptacion:**
- **Dado** que el `primitiveType` del rango es `int`, **cuando** observo el atributo `Type`, **entonces** un pin azul aparece sobre el sub-estado `int`.
- **Dado** que el objeto tiene `Type` visible, **cuando** observo el canvas a distinto zoom, **entonces** el pin permanece sobre el sub-estado activo.
- **Dado** que se re-renderiza el atributo `Type`, **cuando** el `primitiveType` persiste, **entonces** el pin vuelve a colocarse sobre el mismo sub-estado.

**Reglas y restricciones:**
- El pin es un derivado visual del `primitiveType`; no es un marcador editable manualmente.
- El comportamiento exacto del pin si el tipo cambia en re-edicion queda abierto.
- La modalidad visual del pin diverge de las variantes de current state documentadas en la SSOT visual.

**Modelo de datos tocado:**
- `object.typeAttribute.currentState` — referencia al sub-estado activo — derivado/persistente.

**Dependencias:**
- **Bloqueada por:** HU-B3.003, HU-B3.005.
- **Bloquea a:** HU-B3.007.

**Integraciones:**
- Renderer visual de estados actuales.

**Notas de evidencia:**
- Fuente normativa: la SSOT visual no prescribe este marcador de current state.
- Fuente OPCloud: `opcloud-reverse/b3-simulation-range-validation.md` §2, §3.1 paso 7, §5.5.
- Frames: frame_00015, frame_00020, frame_00025, frame_00028, frame_00030.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [range-validation, render, current-state, pin, type-attribute, opcloud-ui].

---

### HU-B3.007 — Ver proyeccion OPL de rango, tipos posibles y current state

**Actor primario:** IS.
**Actores secundarios:** RV (revisor que inspecciona el modelo por OPL).
**Tipo:** mixto.
**Nivel categorico:** L (proyeccion OPL) primario; K secundario.
**Superficie UI:** OPL pane.
**Gesto canonico:** ninguno directo; eco reactivo tras aplicar o evaluar rango.

**Historia:**
> Como ingeniero de simulacion, quiero que la OPL verbalice el rango, los tipos posibles y el tipo activo para poder auditar la configuracion cuantitativa sin depender solo del color o del shape.

**Contexto de negocio:**
La OPL es la capa narrativa que traduce la configuracion cuantitativa a lectura textual.
La SSOT OPL-ES [§12] define la oracion `**Objeto** es de tipo tipo-id` y la produccion
formal de expresion de rango con intervalos y delimitadores. [§14] define `**Atributo**
de **Objeto** varia de X a Y` y `**Atributo** de **Objeto** es valor`. En esta feature,
la proyeccion no se limita al valor: verbaliza tambien el rango literal, la enumeracion
de tipos posibles, el current state del atributo `Type` y la relacion de exhibicion.

**Criterios de aceptacion:**
- **Dado** que aplique un rango a un objeto sin valor concreto, **cuando** consulto la OPL, **entonces** aparece la oracion `<Nombre>, <alias>, is <rango> <unidad>.`
- **Dado** que el atributo `Type` existe, **cuando** consulto la OPL, **entonces** aparece una oracion que enumera los cinco tipos posibles para ese objeto.
- **Dado** que hay un tipo activo marcado, **cuando** consulto la OPL, **entonces** aparece la oracion `Type of <Nombre>, <alias>, is currently at state <tipo>.`
- **Dado** que `Type` fue generado como atributo exhibido, **cuando** consulto la OPL, **entonces** aparece la oracion `<Nombre>, <alias>, exhibits Type.`
- **Dado** que luego se asigna un valor concreto al objeto, **cuando** la OPL se actualiza, **entonces** la sentencia principal reemplaza el rango por el valor observado.

**Reglas y restricciones:**
- Mientras `currentValue` sea `null`, la oracion principal usa la literal del rango.
- Cuando hay valor concreto, la oracion principal usa el valor y el rango queda como metadato no verbalizado en esa sentencia.
- La OPL conserva alias y unidad en la plantilla textual del objeto computacional.
- Las plantillas canonicas de OPL-ES [§12] [§14] gobiernan la proyeccion textual.

**Modelo de datos tocado:**
- Ninguno directo; es una proyeccion derivada de `object.name`, `alias`, `unit`, `rangeSpec`, `currentValue` y `typeAttribute.currentState`.

**Dependencias:**
- **Bloqueada por:** HU-B3.004, HU-B3.005, HU-B3.006, HU-B1.003, HU-B1.004.
- **Bloquea a:** HU-B3.009, HU-B3.010, HU-B3.018.

**Integraciones:**
- OPL pane (`src/render/opl-renderer.ts`).
- Objeto computacional de EPICA-B1.

**Notas de evidencia:**
- Fuente normativa: [OPL-ES §12] tipo de dato y expresion de rango; [OPL-ES §14] oracion de atributo.
- Fuente OPCloud: `opcloud-reverse/b3-simulation-range-validation.md` §2, §3.1 paso 7, §3.2, §6, §7.2.
- Frames: frame_00015, frame_00020, frame_00025, frame_00028, frame_00030, frame_00050.
- Clase de afirmacion: observado + inferido desde el modelo de datos implicito.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [range-validation, opl, lente, type-attribute, projection, mixto].

---

### HU-B3.008 — Reabrir `Set Range` con rango y tipo previamente cargados

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; K secundario.
**Superficie UI:** popover `Set Range` en re-edicion.
**Gesto canonico:** volver a hacer clic en `Set Range` sobre un objeto ya rangeado.

**Historia:**
> Como ingeniero de simulacion, quiero reabrir `Set Range` y encontrar el rango y el tipo ya cargados para refinar una restriccion existente sin reescribirla desde cero.

**Contexto de negocio:**
Los rangos suelen iterarse. Reabrir el mismo popover con el estado previo disminuye
errores de reingreso y hace visible que el rango ya forma parte del modelo. Esta
re-edicion tambien es la puerta para el refinamiento de sub-rangos sobre atributos
heredados desde estereotipos. Es una afordance netamente de UI; la SSOT no prescribe
mecanismo de re-edicion.

**Criterios de aceptacion:**
- **Dado** que un objeto ya tiene rango aplicado, **cuando** vuelvo a abrir `Set Range`, **entonces** el textbox muestra precargada la literal del rango actual.
- **Dado** que un objeto ya tiene rango aplicado, **cuando** vuelvo a abrir `Set Range`, **entonces** el dropdown `Values type:` mantiene seleccionado el tipo previo.
- **Dado** que edito la literal y presiono `Set`, **cuando** el cambio se confirma, **entonces** el rango previo queda sobrescrito por la nueva definicion observada.

**Reglas y restricciones:**
- La precarga aplica tanto a la primera re-edicion del rango como al refinamiento de sub-rangos heredados.
- El cambio exacto de tipo primitivo post-set queda abierto, aunque el valor previo se observe como seleccionado en la re-edicion.

**Modelo de datos tocado:**
- `object.valueState.rangeSpec.literal` — string — persistente.
- `object.valueState.rangeSpec.primitiveType` — enum — persistente.

**Dependencias:**
- **Bloqueada por:** HU-B3.004.
- **Bloquea a:** HU-B3.017.

**Integraciones:**
- Misma UI contextual que HU-B3.001.

**Notas de evidencia:**
- Fuente OPCloud: `opcloud-reverse/b3-simulation-range-validation.md` §3.4, §5.1.
- Frames: frame_00035.
- Clase de afirmacion: observado + hipotesis parcial sobre cambio de tipo.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [range-validation, ui, reedit, popover, preload, opcloud-ui].

---

### HU-B3.009 — Mostrar valor en verde lima cuando cumple rango y tipo bajo Soft Validation

**Actor primario:** IS.
**Tipo:** mixto.
**Nivel categorico:** V (feedback visual derivado de validacion) primario; K secundario.
**Superficie UI:** estado-rango del objeto computacional en canvas.
**Gesto canonico:** asignar un valor concreto valido con `Soft Validation` activo.

**Historia:**
> Como ingeniero de simulacion, quiero que un valor valido se pinte de verde lima para verificar inmediatamente que cumple el rango y el tipo declarados.

**Contexto de negocio:**
El color es el feedback mas rapido de la feature. La SSOT [V-219] establece politica de
"canvas limpio": la validacion no deja marcas persistentes sobre el OPD estatico; el
resultado vive en vistas auxiliares. OPCloud opta por una politica distinta: reutiliza
el propio estado del objeto como superficie de validacion suave, pintandolo de verde
lima cuando cumple. [V-220] permite marcas persistentes siempre que la implementacion
las declare como gramatica de vista separada. Esta HU es mixto: la validacion de kernel
es semantica, el color verde es afordance OPCloud.

**Criterios de aceptacion:**
- **Dado** que un objeto tiene rango definido y `Soft Validation` activo, **cuando** se asigna un valor `5` dentro de `[1..10],[20..30]`, **entonces** el estado-rango cambia su fondo a verde lima y muestra `5` como etiqueta.
- **Dado** que un rango es multi-intervalo, **cuando** se asigna `25` dentro del segundo intervalo, **entonces** el estado tambien se pinta de verde lima.
- **Dado** que el valor valido quedo asignado, **cuando** consulto la OPL, **entonces** la sentencia principal refleja ese valor concreto con su unidad.

**Reglas y restricciones:**
- El verde lima significa cumplimiento simultaneo de intervalo y tipo primitivo.
- El color verde es un derivado visual; no se persiste como dato del modelo.
- La validacion positiva no elimina el rango original; lo mantiene como metadato recuperable por tooltip.

**Modelo de datos tocado:**
- `object.valueState.currentValue` — escalar del tipo elegido — persistente/transitorio segun sesion.
- `object.valueState.validation.valid` — boolean derivado — transitorio.
- `object.valueState.displayText` — string con el valor concreto — persistente/transitorio.

**Dependencias:**
- **Bloqueada por:** HU-B1.014, HU-B3.002, HU-B3.003, HU-B3.004, HU-B3.012.
- **Bloquea a:** HU-B3.011.

**Integraciones:**
- OPL pane.
- Mecanica de asignacion de valor documentada en EPICA-B1.

**Notas de evidencia:**
- Fuente normativa: [V-219] politica de canvas limpio (OPCloud diverge al pintar el estado mismo).
- Fuente OPCloud: `opcloud-reverse/b3-simulation-range-validation.md` §2, §3.2, §5.4, §6.
- Frames: frame_00028, frame_00047.
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [range-validation, render, soft-validation, in-range, green-state, mixto].

---

### HU-B3.010 — Mostrar valor en rojo coral cuando viola rango o tipo bajo Soft Validation

**Actor primario:** IS.
**Tipo:** mixto.
**Nivel categorico:** V primario; K secundario.
**Superficie UI:** estado-rango del objeto computacional en canvas.
**Gesto canonico:** asignar un valor concreto invalido con `Soft Validation` activo.

**Historia:**
> Como ingeniero de simulacion, quiero que un valor invalido se pinte de rojo coral pero siga visible para detectar y depurar rapidamente una violacion de rango o de tipo.

**Contexto de negocio:**
El modo suave de validacion privilegia la continuidad del modelado y de la simulacion:
deja pasar el valor infractor pero lo hace evidente. Ese compromiso permite observar
el dato que causo el problema sin abortar el flujo. La SSOT [V-220] permite que una
implementacion mantenga distintivos de validacion sobre el canvas si los declara como
gramatica de vista separada. OPCloud usa color rojo como senal tanto para violaciones
del intervalo como para incompatibilidades de tipo, por ejemplo `2.5` cuando el tipo
activo es `int`.

**Criterios de aceptacion:**
- **Dado** que un objeto tiene rango definido y `Soft Validation` activo, **cuando** se asigna `-2` fuera de `[1..10],[20..30]`, **entonces** el estado-rango cambia su fondo a rojo coral y muestra `-2` como etiqueta.
- **Dado** que el tipo activo es `int`, **cuando** se asigna `2.5` dentro del intervalo numerico, **entonces** el valor se considera invalido y el estado se muestra en rojo.
- **Dado** que un valor invalido quedo aceptado bajo `Soft Validation`, **cuando** consulto la OPL, **entonces** la sentencia principal muestra el valor infractor realmente asignado.

**Reglas y restricciones:**
- Bajo `Soft Validation` la consecuencia visible observada es color rojo + tooltip del rango; no se bloquea el submit del valor.
- La violacion puede deberse al intervalo o al tipo; ambos casos comparten el mismo feedback cromatico.
- El color rojo es derivado y no se persiste como dato del modelo.

**Modelo de datos tocado:**
- `object.valueState.currentValue` — escalar potencialmente invalido — persistente/transitorio.
- `object.valueState.validation.valid` — `false` derivado — transitorio.
- `object.valueState.displayText` — string con el valor infractor — persistente/transitorio.

**Dependencias:**
- **Bloqueada por:** HU-B1.014, HU-B3.002, HU-B3.003, HU-B3.004, HU-B3.012.
- **Bloquea a:** HU-B3.011, HU-B3.013.

**Integraciones:**
- OPL pane.
- Mecanica de asignacion de valor documentada en EPICA-B1.

**Notas de evidencia:**
- Fuente normativa: [V-220] marcas de validacion como gramatica de vista separada.
- Fuente OPCloud: `opcloud-reverse/b3-simulation-range-validation.md` §1.1, §2, §3.2, §5.4, §6.
- Frames: frame_00030.
- Transcripcion: "will accept out of range values but indicates that it's out of range with red color" y "even if ... two and a half it will still be out of range".
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [range-validation, render, soft-validation, out-of-range, type-mismatch, mixto].

---

### HU-B3.011 — Revelar el rango original con tooltip `Range:` al hover

**Actor primario:** IS.
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; L secundario.
**Superficie UI:** tooltip flotante sobre estado-rango con valor asignado.
**Gesto canonico:** hover sobre el estado-rango verde o rojo.

**Historia:**
> Como ingeniero de simulacion, quiero ver el rango original al pasar el cursor sobre el valor evaluado para recordar la restriccion sin perder el dato actualmente asignado.

**Contexto de negocio:**
Una vez que el estado muestra un valor concreto, la literal del rango desaparece del
canvas principal. El tooltip `Range:` devuelve esa informacion contextual exactamente
donde hace falta, evitando navegar de vuelta al popover o leer la OPL. Su valor es
mayor cuando el dato esta en rojo, porque ayuda a diagnosticar por que el valor
incumple. Es una afordance de UI sin correlato en la SSOT.

**Criterios de aceptacion:**
- **Dado** que un estado-rango tiene un valor valido y se ve en verde, **cuando** hago hover sobre el, **entonces** aparece un tooltip negro con texto `Range: <literal original>`.
- **Dado** que un estado-rango tiene un valor invalido y se ve en rojo, **cuando** hago hover sobre el, **entonces** aparece el mismo tooltip `Range: <literal original>`.
- **Dado** que el rango original es multi-intervalo, **cuando** hago hover, **entonces** el tooltip muestra la literal completa `[1..10],[20..30]`.

**Reglas y restricciones:**
- El tooltip usa la literal original del rango, no una reescritura normalizada.
- El tooltip se observa solo cuando ya existe un valor concreto asignado.
- El comportamiento del tooltip en export PDF/SVG queda abierto.

**Modelo de datos tocado:**
- Ninguno directo; lee `object.valueState.rangeSpec.literal`.

**Dependencias:**
- **Bloqueada por:** HU-B3.004, HU-B3.009 o HU-B3.010.

**Integraciones:**
- Tooltip UI.
- Export PDF/SVG queda pendiente de confirmacion.

**Notas de evidencia:**
- Fuente OPCloud: `opcloud-reverse/b3-simulation-range-validation.md` §2, §3.2, §7.6.
- Frames: frame_00028, frame_00030.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [range-validation, ui, tooltip, hover, literal-range, opcloud-ui].

---

### HU-B3.012 — Configurar `Enforcement level` en `Model Validation Options`

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** C (configuracion de modelo) primario; U (modal) secundario.
**Superficie UI:** modal `Model Validation Options` + dropdown `Enforcement level:`.
**Gesto canonico:** abrir el modal global, desplegar `Enforcement level:` y seleccionar una opcion.

**Historia:**
> Como ingeniero de simulacion, quiero elegir entre `Soft Validation` y `Hard Validation` para decidir si los valores invalidos se aceptan con marca visual o se bloquean al momento de ingreso.

**Contexto de negocio:**
La validacion de rangos no es solo una propiedad del objeto; es una politica del modelo.
La SSOT [V-218] define familias de validacion pero no prescribe un modal global de
configuracion. OPCloud materializa esa gobernanza como un modal con dropdown binario
(`Soft Validation` por defecto). El control permite mover el comportamiento entre un
modo permisivo para exploracion y uno estricto para ejecucion confiable. Es una
afordance de configuracion sin correlato exacto en la SSOT.

**Criterios de aceptacion:**
- **Dado** que el modal `Model Validation Options` esta abierto, **cuando** despliego `Enforcement level:`, **entonces** veo exactamente las opciones `Soft Validation` y `Hard Validation`.
- **Dado** que el modal esta abierto por defecto, **cuando** observo `Enforcement level:`, **entonces** el valor seleccionado es `Soft Validation`.
- **Dado** que selecciono `Hard Validation` y confirmo con `Apply`, **cuando** la configuracion queda aplicada, **entonces** el modelo pasa a evaluar los futuros ingresos de valor bajo modo duro.
- **Dado** que selecciono `Soft Validation` y confirmo con `Apply`, **cuando** la configuracion queda aplicada, **entonces** los futuros ingresos de valor vuelven a comportarse en modo suave.

**Reglas y restricciones:**
- `Enforcement level` es ortogonal a `Validation Time`.
- La ruta exacta para abrir `Model Validation Options` no esta capturada en frames muestreados.
- El alcance exacto de persistencia se infiere como configuracion del modelo, no del usuario ni de un objeto aislado.

**Modelo de datos tocado:**
- `model.validationOptions.enforcementLevel` — `soft | hard` — persistente.

**Dependencias:**
- **Bloqueada por:** ninguna dentro de la epica; la navegacion al modal es global.
- **Bloquea a:** HU-B3.009, HU-B3.010, HU-B3.013, HU-B3.014.

**Integraciones:**
- Modal global de validacion.
- Motor de validacion de valores.

**Notas de evidencia:**
- Fuente normativa: [V-218] familias de validacion; la SSOT no prescribe modal global de configuracion.
- Fuente OPCloud: `opcloud-reverse/b3-simulation-range-validation.md` §1, §1.1, §2, §3.3, §5.2.
- Frames: frame_00025.
- Transcripcion: "soft validation ... hard validation".
- Clase de afirmacion: observado + confirmado por transcripcion, con alcance global inferido.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [range-validation, config, modal, enforcement, model-options, opcloud-ui].

---

### HU-B3.013 — Impedir insertar valores invalidos bajo Hard Validation

**Actor primario:** IS.
**Tipo:** mixto.
**Nivel categorico:** K (regla de validacion) primario; U (feedback de ingreso) secundario.
**Superficie UI:** mecanica de edicion del valor del estado bajo `Hard Validation`.
**Gesto canonico:** intentar ingresar un valor fuera de rango o de tipo invalido con `Hard Validation` activo.

**Historia:**
> Como ingeniero de simulacion, quiero que el sistema impida aceptar valores invalidos cuando el modelo esta en `Hard Validation` para evitar que el estado computacional quede en un valor ilegal.

**Contexto de negocio:**
Mientras el modo suave prioriza exploracion, el modo duro eleva el rango a restriccion
operativa. La SSOT [V-219] permite que la validacion bloquee operaciones; [V-226] exige
que cada implementacion declare un perfil para el canon-diagrama y otro para el
canon-documento. El modo duro de OPCloud es un perfil de validacion aplicado: un valor
invalido "will not allow us to insert". Esa rigidez es importante para ejecucion
controlada, input de usuario y pipelines donde un valor fuera de dominio no deberia
circular. La HU es mixto: la restriccion es semantica, el feedback de rechazo es UI.

**Criterios de aceptacion:**
- **Dado** que `Enforcement level` esta en `Hard Validation`, **cuando** intento ingresar un valor fuera del rango declarado, **entonces** el sistema no permite insertarlo.
- **Dado** que `Enforcement level` esta en `Hard Validation` y el tipo activo es `int`, **cuando** intento ingresar `2.5`, **entonces** el sistema no permite insertarlo.
- **Dado** que `Enforcement level` esta en `Hard Validation`, **cuando** ingreso un valor que si cumple rango y tipo, **entonces** el sistema lo acepta normalmente.

**Reglas y restricciones:**
- La fuente confirma el bloqueo del submit, pero no documenta el feedback visual exacto ni el estado final del input rechazado.
- El bloqueo aplica tanto a violaciones de intervalo como a violaciones de tipo.
- Esta HU requiere clarificacion adicional para UI/UX detallada del rechazo.

**Modelo de datos tocado:**
- `object.valueState.currentValue` — solo se actualiza con valores validos bajo duro — persistente/transitorio.
- `object.valueState.validation.valid` — boolean derivado — transitorio.

**Dependencias:**
- **Bloqueada por:** HU-B1.014, HU-B3.003, HU-B3.004, HU-B3.012.

**Integraciones:**
- Editor de valor del objeto computacional.
- Motor de simulacion y runtime de entrada.
- EPICA-B2 y EPICA-B5 consumen esta regla cuando emiten o solicitan valores en runtime.

**Notas de evidencia:**
- Fuente normativa: [V-219] politica de canvas limpio; [V-226] perfiles de implementacion.
- Fuente OPCloud: `opcloud-reverse/b3-simulation-range-validation.md` §1.1, §3.3, §4.3, §11.
- Frames: frame_00025 (opcion visible); sin frame dedicado del rechazo.
- Transcripcion: "will not allow us to insert an out of range value".
- Clase de afirmacion: confirmado por transcripcion + abierto en feedback.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [range-validation, validation, hard-validation, requires-clarification, value-assignment, mixto].

---

### HU-B3.014 — Configurar `Validation Time` a nivel de modelo

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** C primario; U secundario.
**Superficie UI:** modal `Model Validation Options` + dropdown `Validation Time:`.
**Gesto canonico:** abrir el modal global y elegir una opcion en `Validation Time:`.

**Historia:**
> Como ingeniero de simulacion, quiero fijar cuando se aplica la validacion de rangos para adaptar la severidad del modelo a diseno, ejecucion o ambos.

**Contexto de negocio:**
El tiempo de validacion separa dos momentos distintos del trabajo: construir el modelo
y ejecutarlo. OPCloud expone esa decision en el mismo modal que el enforcement. La SSOT
no prescribe un control de tiempo de validacion; es una afordance de configuracion de
OPCloud. El documento fuente deja ambiguedad sobre la combinatoria exacta entre ambos
ejes. Aun asi, la existencia del dropdown y del valor observado
`Design time & Execution Time` esta bien documentada.

**Criterios de aceptacion:**
- **Dado** que el modal `Model Validation Options` esta abierto, **cuando** observo `Validation Time:`, **entonces** el valor visible por defecto es `Design time & Execution Time`.
- **Dado** que despliego `Validation Time:`, **cuando** recorro las opciones documentadas, **entonces** encuentro `Design time`, `Execution time`, `Simulation` y `Design time & Execution Time`.
- **Dado** que selecciono uno de los valores y confirmo con `Apply`, **cuando** la configuracion queda persistida, **entonces** el modelo guarda ese `validationTime` para evaluaciones posteriores.

**Reglas y restricciones:**
- La relacion exacta entre `Validation Time` y `Enforcement level` queda abierta: la fuente no confirma si ambos se combinan como un unico par activo o como politicas independientes por momento.
- El valor observado por frame es `Design time & Execution Time`.
- La ruta de apertura del modal sigue abierta.

**Modelo de datos tocado:**
- `model.validationOptions.validationTime` — enum — persistente.

**Dependencias:**
- **Bloqueada por:** ninguna dentro de la epica; el modal es global.

**Integraciones:**
- Configuracion global del modelo.
- Pipeline de simulacion y asignacion de valores.
- EPICA-B1, EPICA-B2, EPICA-B4 y EPICA-B5 heredan este contexto temporal de validacion.

**Notas de evidencia:**
- Fuente OPCloud: `opcloud-reverse/b3-simulation-range-validation.md` §1, §1.1, §2, §3.3, §5.2, §11.
- Frames: frame_00025.
- Transcripcion: "design time or execution time or simulation or both".
- Clase de afirmacion: observado + confirmado por transcripcion + abierto en combinatoria.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [range-validation, config, modal, validation-time, requires-clarification, opcloud-ui].

---

### HU-B3.015 — Declarar un valor por defecto embebido dentro del rango

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario; U secundario.
**Superficie UI:** textbox `Set Range` + flow de reset del valor.
**Gesto canonico:** escribir `<rango> <default>` en el textbox y luego resetear el valor.

**Historia:**
> Como ingeniero de simulacion, quiero embutir un valor por defecto dentro de la sintaxis del rango para que el objeto recupere automaticamente un valor inicial valido al resetearse.

**Contexto de negocio:**
El valor por defecto reduce friccion en simulaciones iterativas donde ciertos objetos
vuelven una y otra vez a un baseline conocido. La SSOT OPL-ES [§14] permite que un
atributo exhiba un valor concreto (`**Atributo** de **Objeto** es valor`). OPCloud
no lo modela como campo separado: lo incrusta en la misma literal del rango
(`[1..10] 3`), preservando la economia del popover. La funcionalidad esta confirmada
por transcripcion, aunque su render exacto antes del primer reset no quedo capturado.

**Criterios de aceptacion:**
- **Dado** que escribo `[1..10] 3` en `Set Range` y confirmo con `Set`, **cuando** el rango queda aplicado, **entonces** el `RangeSpec` persiste `[1..10]` y registra `3` como valor por defecto.
- **Dado** que un objeto tiene un valor por defecto embebido, **cuando** el valor actual se resetea mediante el affordance existente del runtime, **entonces** el objeto reapuebla automaticamente `3`.
- **Dado** que el valor por defecto embebido debe ser valido, **cuando** el sistema valida el `RangeSpec`, **entonces** el default debe caer dentro del rango declarado.

**Reglas y restricciones:**
- La sintaxis observada es `"<rango> <numero>"` separada por un espacio.
- La fuente confirma el caso numerico; la sintaxis equivalente para `string`, `char` o `boolean` queda abierta.
- El render exacto del default antes de la primera evaluacion o reset queda abierto.
- El gesto exacto de reset esta abierto en el documento fuente.

**Modelo de datos tocado:**
- `object.valueState.rangeSpec.defaultValue` — escalar opcional del tipo primitivo — persistente.

**Dependencias:**
- **Bloqueada por:** HU-B3.002, HU-B3.003, HU-B3.004.

**Integraciones:**
- Runtime de simulacion / reset de valor.
- EPICA-B1 y EPICA-B5 pueden consumir el valor por defecto al resetear o repoblar valores.

**Notas de evidencia:**
- Fuente normativa: [OPL-ES §14] oracion de valor de atributo.
- Fuente OPCloud: `opcloud-reverse/b3-simulation-range-validation.md` §1.1, §3.5, §5.1, §5.3, §11.
- Frames: — (solo transcripcion).
- Transcripcion: "writing `[1..10] 3` ... default that will automatically appear when resetting the value during simulation".
- Clase de afirmacion: confirmado por transcripcion + abierto en render.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [range-validation, kernel, default-value, reset, requires-clarification, opcloud-ui].

---

### HU-B3.016 — Heredar rangos preempacados desde `<<Embedded Device Property Set>>`

**Actor primario:** IS.
**Actores secundarios:** AD (autor de dominio que mantiene el catalogo estereotipado).
**Tipo:** mixto.
**Nivel categorico:** D (estereotipo/property set) primario; K (rango heredado) secundario.
**Superficie UI:** aplicacion del estereotipo + OPD read-only del estereotipo + canvas del SD.
**Gesto canonico:** aplicar el estereotipo `<<Embedded Device Property Set>>` a un objeto.

**Historia:**
> Como ingeniero de simulacion, quiero que ciertos estereotipos apliquen rangos cuantitativos predefinidos a sus atributos derivados para reutilizar catalogos de propiedades sin reconfigurar cada restriccion manualmente.

**Contexto de negocio:**
La SSOT [V-163] define el slot de valor como primitiva asociable a una cosa. OPCloud
extiende ese concepto para que los rangos puedan venir empaquetados desde un property
set de dominio. `Embedded Device Property Set` muestra este patron con claridad al
producir atributos cuantitativos ya rangeados como `Reliability`, `Cost` o
`Power Consumption`. La feature convierte al estereotipo en productor de `RangeSpec`,
no solo en decorador nominal. Es mixto: el concepto de slot de valor es SSOT, la
herencia de rangos desde estereotipos es OPCloud.

**Criterios de aceptacion:**
- **Dado** que aplico `<<Embedded Device Property Set>>` a un objeto, **cuando** el sistema materializa los atributos derivados, **entonces** aparecen atributos con rangos heredados como `[0..100]` y `(0..*]` segun la plantilla observada.
- **Dado** que consulto el OPD read-only del estereotipo, **cuando** observo sus atributos cuantitativos, **entonces** veo los rangos canonicos de la plantilla.
- **Dado** que consulto el SD del objeto aplicante, **cuando** observo los atributos derivados, **entonces** esos atributos traen el rango heredado como estado inicial efectivo.

**Reglas y restricciones:**
- Los rangos de la plantilla pertenecen al estereotipo, no al sitio de aplicacion.
- El flujo completo de aplicar el estereotipo se documenta en EPICA-A0; esta HU cubre solo la herencia de `RangeSpec`.
- No todos los atributos derivados del property set son rangeables; algunos permanecen en `value`.

**Modelo de datos tocado:**
- `object.valueState.rangeSpec.inheritedFrom` — `StereotypeID` — persistente.
- `object.valueState.rangeSpec.intervals` — heredados desde plantilla — persistente.

**Dependencias:**
- **Bloqueada por:** HU-B3.004.
- **Bloquea a:** HU-B3.017, HU-B3.018.

**Integraciones:**
- Sistema de estereotipos (EPICA-A0).
- Biblioteca lateral y arbol `Stereotypes`.

**Notas de evidencia:**
- Fuente normativa: [V-163] slot de valor como primitiva asociable.
- Fuente OPCloud: `opcloud-reverse/b3-simulation-range-validation.md` §1, §3.6, §6, §7.1.
- Frames: frame_00040, frame_00045, frame_00050.
- Transcripcion: "property set stereotypes bring predefined immutable ranges".
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [range-validation, stereotype, inherited-range, property-set, domain-profile, mixto].

---

### HU-B3.017 — Restringir la re-definicion de un rango heredado a sub-rangos validos

**Actor primario:** IS.
**Tipo:** mixto.
**Nivel categorico:** K primario; D secundario.
**Superficie UI:** re-edicion `Set Range` sobre atributo heredado de estereotipo.
**Gesto canonico:** reabrir `Set Range` sobre un atributo heredado y proponer un nuevo rango.

**Historia:**
> Como ingeniero de simulacion, quiero poder refinar un rango heredado solo hacia un sub-rango contenido para adaptar la plantilla al caso concreto sin violar las restricciones del catalogo.

**Contexto de negocio:**
La combinacion "plantilla de dominio + ajuste local" exige un limite nitido: el
modelador puede estrechar la admision, pero no ampliarla. Esa asimetria conserva la
autoridad del catalogo estereotipado y evita que un apply-site debilite las garantias
del perfil de dominio. La SSOT [V-29] define que un atributo discriminante restringe
los valores validos para las especializaciones — un patron analogo. [§2.3 SSOT] define
sintaxis de rango. OPCloud hace explicita esta gobernanza mediante un error cuando el
rango propuesto excede al heredado.

**Criterios de aceptacion:**
- **Dado** que un atributo heredo `[0..100]` desde el estereotipo, **cuando** reabro `Set Range` y propongo `[25..95]`, **entonces** el sistema acepta la redefinicion por tratarse de un sub-rango contenido.
- **Dado** que un atributo heredo `[0..100]`, **cuando** propongo `[0..105]`, **entonces** el sistema rechaza la redefinicion con un error de rango invalido.
- **Dado** que el rango heredado es parte de la plantilla, **cuando** el refinamiento local es aceptado, **entonces** el OPD del estereotipo mantiene intacto el rango original.

**Reglas y restricciones:**
- El modelador puede crear sub-rangos dentro del rango padre, pero no ampliarlo ni eliminarlo.
- El texto exacto del error mas alla de "range is not valid" no esta documentado.
- El refinamiento actua sobre el rango efectivo del atributo derivado, no sobre la plantilla read-only del estereotipo.

**Modelo de datos tocado:**
- `object.valueState.rangeSpec.intervals` — valor refinado efectivo — persistente.
- `object.valueState.rangeSpec.parentIntervals` — referencia al rango heredado — persistente/derivada.

**Dependencias:**
- **Bloqueada por:** HU-B3.008, HU-B3.016.
- **Bloquea a:** HU-B3.018.

**Integraciones:**
- Sistema de estereotipos.
- Validador de sub-rangos.

**Notas de evidencia:**
- Fuente normativa: [V-29] restriccion de valores por atributo discriminante; [§2.3 SSOT] sintaxis de rango.
- Fuente OPCloud: `opcloud-reverse/b3-simulation-range-validation.md` §1.1, §3.6, §4.1, §6, §7.1.
- Frames: frame_00050.
- Transcripcion: "you cannot change the range you can only create a sub range in it" y "the range is not valid".
- Clase de afirmacion: confirmado por transcripcion + observado parcialmente.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [range-validation, stereotype, subrange, validation, inherited-range, mixto].

---

### HU-B3.018 — Validar valores contra el sub-rango efectivo heredado/refinado

**Actor primario:** IS.
**Tipo:** mixto.
**Nivel categorico:** V primario; K y D secundarios.
**Superficie UI:** atributo derivado de estereotipo en canvas + OPL.
**Gesto canonico:** asignar un valor concreto a un atributo con sub-rango refinado.

**Historia:**
> Como ingeniero de simulacion, quiero que la validacion use el sub-rango efectivo del atributo derivado y no solo el rango original de la plantilla para verificar correctamente el caso especifico del objeto.

**Contexto de negocio:**
Una vez que el modelador refina un rango heredado, ese refinamiento debe volverse la
verdad operativa del objeto aplicante. La SSOT [V-58] establece que las instancias
muestran valores concretos mientras las clases muestran rangos. OPCloud lo demuestra
con `Reliability of Microcontroller`: aunque el estereotipo define `[0..100]`, el
sitio de aplicacion trabaja con `[25..95]`. La validacion suave/dura y la OPL
[OPL-ES §14] deben seguir el rango efectivo, no el de la plantilla.

**Criterios de aceptacion:**
- **Dado** que `Reliability of Microcontroller` fue refinado a `[25..95]`, **cuando** se asigna `52.2`, **entonces** el atributo se muestra en verde lima por estar dentro del sub-rango efectivo.
- **Dado** que el mismo atributo fue refinado a `[25..95]`, **cuando** se asigna `10`, **entonces** el atributo se considera fuera de rango aunque `10` pertenezca al rango original `[0..100]`.
- **Dado** que el rango efectivo del atributo es `[25..95]`, **cuando** consulto la OPL del SD, **entonces** la oracion principal del atributo usa `[25..95]` como rango visible en reposo.

**Reglas y restricciones:**
- La validacion se hace contra el rango efectivo del apply-site.
- El OPD read-only del estereotipo conserva su rango canonico original y no participa en la validacion del SD.
- El ejemplo documentado usa `Soft Validation`; el comportamiento equivalente bajo `Hard Validation` queda cubierto por HU-B3.013 y preguntas abiertas.

**Modelo de datos tocado:**
- `object.valueState.rangeSpec.intervals` — sub-rango efectivo — persistente.
- `object.valueState.currentValue` — escalar evaluado — persistente/transitorio.
- `object.valueState.validation.valid` — boolean derivado — transitorio.

**Dependencias:**
- **Bloqueada por:** HU-B3.009, HU-B3.010, HU-B3.016, HU-B3.017.

**Integraciones:**
- OPL pane.
- Sistema de estereotipos y property sets.

**Notas de evidencia:**
- Fuente normativa: [V-58] instancias con valores concretos, clases con rangos; [OPL-ES §14] oracion de atributo.
- Fuente OPCloud: `opcloud-reverse/b3-simulation-range-validation.md` §3.6, §5.3, §7.1.
- Frames: frame_00047, frame_00050.
- Transcripcion: "if i'll change it and now i will put the value 10 it will be out of range the sub range is only 25 to 95".
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [range-validation, stereotype, effective-range, soft-validation, opl, mixto].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q-B3.1**: Ruta exacta para abrir `Model Validation Options` (cf. HU-B3.012, HU-B3.014). Origen §11.1. No capturada en frames muestreados.
- **Q-B3.2**: Combinatoria exacta `Validation Time x Enforcement` (cf. HU-B3.012, HU-B3.014). Origen §11.2. La transcripcion sugiere independencia, pero el modal observado no la prueba. [V-218] [V-226].
- **Q-B3.3**: Gesto exacto para editar el valor del estado-rangeado (cf. HU-B3.009, HU-B3.010, HU-B3.013). Origen §11.3. No hay frame dedicado.
- **Q-B3.4**: Feedback UI exacto del rechazo bajo `Hard Validation` (cf. HU-B3.013). Origen §11.4. No se sabe si hay toast, borde rojo o descarte silencioso. [V-220].
- **Q-B3.5**: Render del default embebido antes del primer reset o primera simulacion (cf. HU-B3.015). Origen §11.5.
- **Q-B3.6**: Cambio de tipo primitivo post-set y coherencia del pin (cf. HU-B3.003, HU-B3.006, HU-B3.008). Origen §11.6.
- **Q-B3.7**: Persistencia del tooltip `Range:` en export PDF/SVG (cf. HU-B3.011). Origen §11.7. [V-232].
- **Q-B3.8**: Sintaxis de default para `string`, `char` y `boolean` (cf. HU-B3.015). Origen §11.8.
- **Q-B3.9**: Validacion dimensional por unidad entre objetos computacionales enlazados (cf. HU-B3.007). Origen §11.9. El documento solo confirma validacion escalar y de tipo.
- **Q-B3.10**: Comportamiento de `Hard@Execution` cuando una user-defined function emite valor invalido (cf. HU-B3.013). Origen §11.10. Impacta EPICA-B2 y EPICA-B5.
- **Q-B3.11**: Color/estado visual tras resetear un valor previamente verde o rojo (cf. HU-B3.004, HU-B3.015). Origen §11.11.
- **Q-B3.12**: Encadenamiento de sub-rangos en mas de un nivel de herencia/refinamiento (cf. HU-B3.017, HU-B3.018). Origen §11.12. [V-29].
- **Q-B3.13**: Mensaje exacto y ubicacion del feedback ante sintaxis de rango malformada (cf. HU-B3.002). Origen §11.13.
- **Q-B3.14**: Semantica exacta de `*` como cota superior para `int` vs `float` (cf. HU-B3.002). Origen §11.14.

## Referencias cruzadas

- **Doc fuente**: `opcloud-reverse/b3-simulation-range-validation.md`.
- **Fuente normativa SSOT**:
  - `opm-iso-19450-es.md` §2.3: sintaxis de rango, multi-intervalo, delimitadores, declaracion de tipo computacional.
  - `opm-visual-es.md` §20: capa computacional y ejecutable. V-158 a V-166 (binding computacional, slot de valor).
  - `opm-visual-es.md` §24: marcas de validacion. V-218 a V-226.
  - `opm-opl-es.md` §12: tipo de dato, expresion de rango, produccion formal.
  - `opm-opl-es.md` §14: oracion de atributo con valor y rango.
  - `opm-visual-es.md` V-29 (atributo discriminante), V-58 (instancias con valores, clases con rangos), V-232 (canon-documento con tooltips).
- **Epicas prerrequisito**:
  - **EPICA-B1** (`simulation-computational`): objeto computacional, unidad, alias y asignacion de valor.
  - **EPICA-A0** (`extension-stereotypes`): aplicacion de `<<Embedded Device Property Set>>` y property sets.
  - **EPICA-50** (`opl-pane`): proyeccion textual reactiva del modelo.
- **Epicas hermanas y consumidoras**:
  - **EPICA-B2** (`simulation-user-functions`): emite valores que deben pasar por validacion de rango.
  - **EPICA-B4** (`simulation-conditions-loops`): comparte contexto de simulacion y usa valores computacionales validados.
  - **EPICA-B5** (`simulation-user-input`): necesita `Hard Validation` para inputs en runtime.
  - **EPICA-60** y **EPICA-61** (export): pendiente decidir si el tooltip `Range:` persiste offline.
- **Epicas relacionadas**:
  - **EPICA-1C** (`canvas-validaciones`): las validaciones de rango son ortogonales a las estructurales.
  - **EPICA-90** (`interaccion-shortcuts`): no se observaron shortcuts para esta feature.
- **Brechas SSOT identificadas**:
  - V-54: OPCloud introduce un tercer marcador de current state (pin azul sobre `Type`) no previsto en la SSOT visual.
  - §2.3: OPCloud extiende la gramatica de rango SSOT a operacionalizacion concreta (popover, cromatica suave/dura).
  - V-219: OPCloud diverge de la politica "canvas limpio" al pintar el estado mismo de verde/rojo.
  - V-163: los property sets de OPCloud heredan rangos como extension no cubierta por la SSOT.
- **Invariantes del repo**:
  - `src/nucleo/validacion/` — lugar natural para `validate(currentValue, intervals, primitiveType)`.
  - `src/render/jointjs/` — debe renderizar estados azul/verde/rojo, atributo `Type`, triangulo de exhibicion y pin azul.
  - `src/render/opl-renderer.ts` — debe regenerar OPL segun `rangeSpec`, `currentValue`, unidad y alias.
  - `docs/ARQUITECTURA-CATEGORICA.md` — esta epica introduce una capa de validacion derivada sobre objetos computacionales sin alterar las primitivas OPM base.
