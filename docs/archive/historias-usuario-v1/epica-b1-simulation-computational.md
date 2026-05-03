---
epica: "EPICA-B1"
titulo: "Simulacion computacional — valores escalares, firmas invocables y sorteo probabilistico"
doc_fuente: "opcloud-reverse/b1-simulation-computational.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "S"
hu_emitidas: 27
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "DIAGNOSTICO-PILOTO-EPICA-10.md"
---

## Resumen

Esta epica cubre la transicion del modelo OPM de **portador de estados discretos** (simulacion
conceptual, EPICA-B0) a **portador de magnitudes escalares** con **firmas invocables**. Introduce
tres primitivas nuevas sobre el nucleo:

1. El objeto **computacional** deja de ser un contenedor de estados discretos y pasa a ser un
   *portador de valor* con unidad fisica entre corchetes `[...]`, alias entre llaves `{...}` y un
   rectangulo-estado interno con `displayText` mutable (`value` → numero → texto).
2. El proceso **computacional** deja de ser una transicion narrada y pasa a ser una *firma
   invocable* con parentesis `( )` detras del nombre y una **categoria** elegida en el grid 3x3
   (Predefined, User Defined, External, ROS, MQTT, Python, SQL, Gen AI).
3. La simulacion puede **sustituir** el valor determinista manualmente asignado por un **valor
   sorteado** segun distribucion probabilistica (7 opciones: Uniforme, Normal, Bernoulli, Geometrica,
   Poisson, Exponencial, Binomial) o por **pares texto:peso**, ejecutandose en modo `Async Execute`
   con export XLSX y multiples ejecuciones.

El alcance del documento fuente cubre principalmente la variante **Predefined/Adding**. Las variantes
`User Defined`, `External`, `ROS`, `MQTT`, `Python`, `SQL`, `Gen AI` aparecen en el menu pero se
delegan a EPICA-B2, EPICA-C0, EPICA-C1, EPICA-C2 y EPICA-A2. La integracion con sensores MQTT se
referencia cruzadamente a EPICA-C0.

Las HU se numeran siguiendo la aparicion en el doc fuente (§1 → §9). Cada HU cita su seccion fuente
y clase de afirmacion heredada.

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-B1.001 | Convertir objeto en computacional con boton del halo | IS | S | M | mixto | — |
| HU-B1.002 | Renderizar rectangulo-estado value dentro del objeto computacional | IS | S | S | mixto | [V-1 §1.2] |
| HU-B1.003 | Asignar unidad fisica al objeto con sintaxis `[...]` | IS | S | S | opcloud-ui | — |
| HU-B1.004 | Abrir popup Edit Alias desde boton ↑Alias | IS | S | S | opcloud-ui | — |
| HU-B1.005 | Renderizar alias como segunda linea `{alias}` en objeto | IS | S | XS | opcloud-ui | — |
| HU-B1.006 | Convertir proceso en computacional con boton del halo | IS | S | M | mixto | — |
| HU-B1.007 | Renderizar firma `( )` detras del nombre del proceso computacional | IS | S | XS | opcloud-ui | — |
| HU-B1.008 | Elegir categoria de computacion en grid 3x3 | IS | S | M | opcloud-ui | — |
| HU-B1.009 | Seleccionar operacion Predefined (p.ej. Adding) | IS | S | S | opcloud-ui | — |
| HU-B1.010 | Ver tooltip con operacion predefinida al hover sobre proceso | IS | S | XS | opcloud-ui | — |
| HU-B1.011 | Conectar objeto computacional a proceso con enlace Instrument | IS | S | S | opm-semantica | [V-239] [V-240] |
| HU-B1.012 | Renderizar circulo abierto como punto de lectura de valor | IS | S | S | opcloud-ui | — |
| HU-B1.013 | Conectar proceso a objeto resultado con enlace Result | IS | S | S | opm-semantica | [V-239] [V-240] |
| HU-B1.014 | Asignar valor manual al estado-value antes de ejecutar | IS | S | S | opcloud-ui | — |
| HU-B1.015 | Ejecutar simulacion sync determinista y ver resultado en tiempo real | IS | S | M | opcloud-ui | — |
| HU-B1.016 | Abrir modal Simulated Elements con lista de cosas simulables | IS | S | S | opcloud-ui | — |
| HU-B1.017 | Marcar objeto como elemento simulable via casilla | IS | S | XS | opcloud-ui | — |
| HU-B1.018 | Definir valor numerico sorteado con distribucion de probabilidad | IS | S | M | opcloud-ui | — |
| HU-B1.019 | Definir valor textual sorteado con pares texto:peso | IS | S | M | opcloud-ui | — |
| HU-B1.020 | Configurar Number Of Simulation Runs en barra de simulacion | IS | S | XS | opcloud-ui | — |
| HU-B1.021 | Configurar Download CSV File After This Number Of Runs | IS | S | XS | opcloud-ui | — |
| HU-B1.022 | Ejecutar simulacion async con valores sorteados | IS | S | M | opcloud-ui | — |
| HU-B1.023 | Descartar valor preasignado cuando el objeto esta marcado como simulado | IS | S | S | opcloud-ui | — |
| HU-B1.024 | Actualizar displayText del estado-value en tiempo real durante ejecucion | IS | S | S | opcloud-ui | — |
| HU-B1.025 | Exportar resultados de ejecuciones a archivo XLSX | IS | S | M | opcloud-ui | — |
| HU-B1.026 | Ver OPL de cuatro campos con alias y unidad | IS | S | S | mixto | [OPL-ES §2] |
| HU-B1.027 | Conectar proceso computacional a sensor MQTT como categoria | IR | W | L | opcloud-ui | — |

Total: **27 historias de usuario** (20 opcloud-ui, 3 opm-semantica, 4 mixto).

## Historias de usuario

### HU-B1.001 — Convertir objeto en computacional con boton del halo

**Actor primario:** IS (ingeniero de simulacion).
**Actores secundarios:** ME (modelador experto que modela el dominio antes de simular).
**Tipo:** mixto.
**Nivel categorico:** K (nuevo indicador `computational` en objeto) primario; V (render del rectangulo-estado) y U (halo) secundarios.
**Superficie UI:** halo del objeto + boton `computation`.
**Gesto canonico:** clic en boton `computation` del halo con un objeto seleccionado.

**Historia:**
> Como ingeniero de simulacion, quiero convertir un objeto OPM en objeto computacional con un clic del halo para habilitar su rol como portador de magnitud escalar sin rehacer el modelo.

**Contexto de negocio:**
La transicion de modelo conceptual a modelo computacional es el primer paso de la simulacion cuantitativa. Exponer el alternador en el halo minimiza la friccion: el modelador puede empezar en modo conceptual y promover objetos individualmente cuando necesite valores. El indicador es la raiz de toda la mecanica que sigue (unidad, alias, estado-value, simulacion).

**Criterios de aceptacion:**
- **Dado** que tengo un objeto seleccionado sin indicador computacional, **cuando** hago clic en `computation` del halo, **entonces** el objeto queda con `computational=true` y se renderiza el rectangulo-estado interno con etiqueta `value` (ver HU-B1.002).
- **Dado** que un objeto es computacional, **cuando** abro el halo, **entonces** el boton `computation` aparece en estado activo/alternado.
- **Dado** que hago clic de nuevo en `computation`, **cuando** el indicador se revierte, **entonces** el rectangulo-estado desaparece y la unidad/alias quedan en estado "pregunta abierta" (ver §11 fuente Q3).
- **Dado** que cree el objeto computacional, **cuando** consulto OPL, **entonces** aparece la oracion `<Nombre> is value.` (sin alias ni unidad todavia).

**Reglas y restricciones:**
- Por defecto al crear objeto: `computational=false`.
- El alternador actua sobre un unico objeto (no masivo).
- Requiere seleccion previa — el boton solo aparece en halo contextual.
- La reversion del indicador con estado-value ya poblado: comportamiento de la persistencia del `currentValue` pendiente (§11 Q3 fuente).

**Modelo de datos tocado:**
- `objeto.computational` — boolean — persistente — por defecto `false`.
- `objeto.valueState` — `{displayText: string, currentValue: number|string|null}` — persistente — creado al activar indicador.

**Dependencias:**
- Bloqueada por: HU-10.002 (objeto debe existir).
- Bloquea a: HU-B1.002, HU-B1.003, HU-B1.004, HU-B1.014, HU-B1.016.

**Integraciones:**
- Halo JointJS.
- Renderizador: agrega shape interno.
- Panel OPL: emite plantilla computacional.

**Notas de evidencia:**
- Fuente normativa: — (extension OPCloud sin respaldo en SSOT).
- Fuente OPCloud: `opcloud-reverse/b1-simulation-computational.md` §2 tabla, §3.1 paso 2.
- Fotogramas: frame_5.
- Transcripcion: implicita en flujo demo.
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [simulacion-computacional, nucleo, halo, alternador, indicador-computacional].

---

### HU-B1.002 — Renderizar rectangulo-estado value dentro del objeto computacional

**Actor primario:** IS.
**Tipo:** mixto.
**Nivel categorico:** V (render).
**Superficie UI:** canvas-render del objeto computacional.
**Gesto canonico:** ninguno (render declarativo post-alternador).

**Historia:**
> Como ingeniero de simulacion, quiero ver un rectangulo-estado con etiqueta `value` dentro del objeto computacional para identificar a simple vista que objeto porta magnitud escalar.

**Contexto de negocio:**
El rectangulo-estado visual reutiliza la primitiva OPM de estado discreto (contorno oliva, radio redondeado pequeno, texto oliva) pero la resemantiza como celda de valor. Esta decision de diseno hace que la transicion de "cosa con estados" a "cosa con valor" sea visual y homotopicamente consistente.

**Criterios de aceptacion:**
- **Dado** que converti un objeto en computacional, **cuando** se renderiza, **entonces** dentro del rectangulo del objeto aparece un rectangulo interno con contorno oliva, radio redondeado pequeno y texto oliva `value`.
- **Dado** que el `valueState.displayText` es `"value"`, **cuando** miro el render, **entonces** el texto interior del rectangulo-estado es literalmente la palabra `value`.
- **Dado** que el `valueState.displayText` cambia a un numero (p.ej. `15`), **cuando** ocurre el cambio, **entonces** el rectangulo mantiene su estilo (oliva, misma tipografia) pero la etiqueta pasa a ser el numero.
- **Dado** que el objeto pierde el indicador computacional, **cuando** se re-renderiza, **entonces** el rectangulo-estado desaparece del shape.

**Reglas y restricciones:**
- Contorno oliva reutiliza la primitiva visual de estado existente [V-1 §1.2].
- El rectangulo-estado es unico por objeto computacional (no hay multiples valores simultaneos).
- El objeto crece verticalmente para alojar el rectangulo-estado.

**Modelo de datos tocado:**
- `objeto.valueState.displayText` — string — transitorio/persistente segun modo simulacion.

**Dependencias:**
- Bloqueada por: HU-B1.001.
- Bloquea a: HU-B1.014, HU-B1.024.

**Integraciones:**
- Renderizador: extiende fabrica de objeto.
- Layout: contempla altura adicional del shape.

**Notas de evidencia:**
- Fuente normativa: [V-1 §1.2] primitiva visual de estado.
- Fuente OPCloud: §3.1 paso 2, §3.4 tabla `displayText`.
- Fotogramas: frame_5, frame_10, frame_22, frame_41.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulacion-computacional, render, estado-value, primitiva-estado].

---

### HU-B1.003 — Asignar unidad fisica al objeto con sintaxis `[...]`

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** K (nuevo campo `objeto.unidad`) primario; V secundario.
**Superficie UI:** popup de nombre del objeto (campo de nombre).
**Gesto canonico:** escribir `[m]`, `[kg]`, `[ms]` dentro del campo de nombre del popup.

**Historia:**
> Como ingeniero de simulacion, quiero anotar la unidad fisica del objeto entre corchetes rectos para dar dimension al valor y documentar la semantica fisica del modelo.

**Contexto de negocio:**
La unidad fisica es un compromiso con la interpretabilidad del modelo. Sin unidad, `Objeto 1 = 37` es un numero sin significado; con `Objeto 1 [m] = 37`, es una magnitud operacional. OPCloud elige los corchetes rectos como zona tipografica dedicada, diferenciada de los nombres y alias.

**Criterios de aceptacion:**
- **Dado** que un objeto es computacional, **cuando** escribo `Objeto 1 [m]` en el campo de nombre del popup, **entonces** `objeto.nombre = "Objeto 1"` y `objeto.unidad = "m"` al confirmar.
- **Dado** que escribi una unidad, **cuando** miro el render, **entonces** la primera linea del objeto muestra `Objeto 1 [m]`.
- **Dado** que dejo los corchetes vacios (`Objeto 1 []`), **cuando** confirmo, **entonces** `objeto.unidad = ""` y se renderiza el sufijo `[]` literal (brecha C-01 fuente).
- **Dado** que no escribo corchetes, **cuando** confirmo, **entonces** `objeto.unidad = null` y el render no muestra sufijo.
- **Dado** que el objeto tiene unidad, **cuando** consulto OPL post-ejecucion, **entonces** aparece la unidad (p.ej. `Objeto 1, o1, is 37 m.`).

**Reglas y restricciones:**
- La sintaxis `[...]` es estricta: corchetes rectos al final del nombre, un solo token por objeto.
- Si hay multiples grupos `[...]`, comportamiento: **pregunta abierta** (no observado).
- La unidad es string libre — no se valida contra catalogo SI.
- El corchete vacio `[]` NO se senala como error visible (advertencia pendiente, brecha C-01).

**Modelo de datos tocado:**
- `objeto.unidad` — string nullable — persistente.

**Dependencias:**
- Bloqueada por: HU-B1.001.
- Bloquea a: HU-B1.026.

**Integraciones:**
- Parser del nombre en popup.
- Renderizador: muestra `[unidad]` tras el nombre.
- OPL: interpola unidad en plantilla de cuatro campos.

**Notas de evidencia:**
- Fuente normativa: — (extension OPCloud, no en SSOT).
- Fuente OPCloud: §3.1 paso 3, §4 flow "Corchetes vacios", §5 controles.
- Fotogramas: frame_10.
- Transcripcion: "then we'll go and add m" (narrador).
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulacion-computacional, ui, unidad, popup-inline, sintaxis-corchetes].

---

### HU-B1.004 — Abrir popup Edit Alias desde boton ↑Alias

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; K (campo `objeto.alias`) secundario.
**Superficie UI:** barra secundaria + boton `↑Alias` + popup `Edit Alias`.
**Gesto canonico:** clic en boton `↑Alias` con objeto computacional seleccionado.

**Historia:**
> Como ingeniero de simulacion, quiero abrir un popup dedicado para asignar alias al objeto computacional para poder referenciarlo sinteticamente en formulas de User Defined donde el nombre completo seria ambiguo.

**Contexto de negocio:**
Cuando el nombre del objeto tiene multiples palabras (`Driving Wheel Angular Velocity`), invocarlo en una formula se vuelve ilegible. El alias corto (`o1`, `θ`, `v_x`) habilita expresiones matematicas compactas. Se fija desde ya aunque la categoria actual sea `Predefined/Adding` (que no lo requiere), porque la transicion futura a `User Defined` lo exigira (→ EPICA-B2).

**Criterios de aceptacion:**
- **Dado** que tengo un objeto computacional seleccionado, **cuando** miro la barra secundaria, **entonces** veo el boton rotulado `↑Alias`.
- **Dado** que hago clic en `↑Alias`, **cuando** se abre el popup, **entonces** veo campo `insert alias` (placeholder) y boton `Update`.
- **Dado** que escribo `o1` y hago clic en `Update`, **cuando** se cierra el popup, **entonces** `objeto.alias = "o1"`.
- **Dado** que confirmo con alias vacio, **cuando** cierra el popup, **entonces** `objeto.alias = null` y la segunda linea del objeto no se renderiza.
- **Dado** que un alias ya esta asignado, **cuando** reabro el popup, **entonces** el campo muestra el alias actual para edicion.

**Reglas y restricciones:**
- El alias es string libre; no hay validacion de unicidad observada (abierta §11).
- Longitud tipica observada: 2–3 caracteres.
- El popup se ancla a la posicion del boton; no es modal de pantalla completa.

**Modelo de datos tocado:**
- `objeto.alias` — string nullable — persistente.

**Dependencias:**
- Bloqueada por: HU-B1.001.
- Bloquea a: HU-B1.005, HU-B1.026, EPICA-B2 (User Defined).

**Integraciones:**
- Popup UI.
- Render: segunda linea del objeto.
- OPL: segundo campo en plantilla de cuatro.

**Notas de evidencia:**
- Fuente normativa: — (extension OPCloud).
- Fuente OPCloud: §2 tabla `Alias`, §3.1 paso 4.
- Fotogramas: frame_8.
- Transcripcion: "alias is used in specific calculation when the object name is more than just one word so you can call it within functions" (narrador).
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulacion-computacional, ui, popup, alias, acortamiento-alias].

---

### HU-B1.005 — Renderizar alias como segunda linea `{alias}` en objeto

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** V.
**Superficie UI:** canvas-render del objeto computacional.
**Gesto canonico:** ninguno (render post-asignacion).

**Historia:**
> Como ingeniero de simulacion, quiero ver el alias renderizado como segunda linea entre llaves `{alias}` dentro del objeto para distinguir visualmente nombre largo, unidad y alias corto de un vistazo.

**Contexto de negocio:**
La separacion tipografica en tres zonas (nombre + unidad en corchetes, alias en llaves, estado-value con contorno oliva) permite que el lector del modelo identifique cada rol sin leer. Las llaves `{}` son convencion exclusiva de objetos computacionales; no aparecen en objetos no computacionales.

**Criterios de aceptacion:**
- **Dado** que `objeto.alias = "o1"`, **cuando** se renderiza el objeto, **entonces** aparece una segunda linea `{o1}` centrada dentro del cuerpo del rectangulo, sin negrita.
- **Dado** que `objeto.alias = null`, **cuando** se renderiza, **entonces** la segunda linea no aparece (ocupacion vertical reducida).
- **Dado** que cambio el alias, **cuando** confirmo el popup, **entonces** la segunda linea se actualiza en vivo.
- **Dado** que el objeto no es computacional, **cuando** se renderiza, **entonces** nunca aparece la segunda linea `{}` (convencion exclusiva).

**Reglas y restricciones:**
- Llaves rizadas `{}` son delimitadores obligatorios del alias en el render.
- Sin negrita, centrado, color consistente con texto del objeto.
- El shape crece verticalmente para alojar las tres zonas (nombre+unidad, alias, estado-value).

**Dependencias:**
- Bloqueada por: HU-B1.004.

**Integraciones:**
- Renderizador: extiende layout interno del objeto.

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: §3.1 paso 4 (las tres zonas tipograficas), §9 convenciones.
- Fotogramas: frame_10.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [simulacion-computacional, render, alias, sintaxis-llaves].

---

### HU-B1.006 — Convertir proceso en computacional con boton del halo

**Actor primario:** IS.
**Tipo:** mixto.
**Nivel categorico:** K (nuevo indicador `computational` en proceso) primario; V y U secundarios.
**Superficie UI:** halo del proceso + boton `computation`.
**Gesto canonico:** clic en boton `computation` del halo con proceso seleccionado.

**Historia:**
> Como ingeniero de simulacion, quiero convertir un proceso OPM en proceso computacional con un clic del halo para transformarlo en una firma invocable que consume entradas y produce salida escalar.

**Contexto de negocio:**
El proceso computacional es la contraparte funcional del objeto computacional. Lo que era "transicion narrada entre estados" se vuelve "funcion con firma y semantica evaluable". El alternador del halo es la puerta de entrada a la eleccion de categoria (Predefined, User Defined, etc.) y a toda la mecanica de invocacion.

**Criterios de aceptacion:**
- **Dado** que tengo un proceso seleccionado sin indicador computacional, **cuando** hago clic en `computation` del halo, **entonces** `proceso.computational=true`.
- **Dado** que el proceso es computacional, **cuando** se renderiza, **entonces** aparece el sufijo `( )` detras del nombre (firma vacia por defecto) y la barra de categoria bajo la elipse (ver HU-B1.008).
- **Dado** que revierto el indicador, **cuando** el proceso pierde la computacionalidad, **entonces** desaparece la firma `( )` y la barra de categoria.
- **Dado** que el proceso es computacional pero sin categoria elegida, **cuando** miro el render, **entonces** la firma se muestra vacia `( )`.

**Reglas y restricciones:**
- Por defecto al crear proceso: `computational=false`.
- El alternador actua sobre un unico proceso.
- Revertir el indicador descarta la categoria y operacion previamente asignadas (comportamiento inferido, §11 fuente no observa caso).

**Modelo de datos tocado:**
- `proceso.computational` — boolean — persistente — por defecto `false`.
- `proceso.sufijoFirma` — `"" | " "` — derivado de `computational`.
- `proceso.categoria` — enum opcional — persistente tras elegir.

**Dependencias:**
- Bloqueada por: HU-10.001 (proceso debe existir).
- Bloquea a: HU-B1.007, HU-B1.008, HU-B1.011.

**Integraciones:**
- Halo JointJS.
- Renderizador: agrega sufijo y barra de categoria.

**Notas de evidencia:**
- Fuente normativa: — (extension OPCloud, no en SSOT).
- Fuente OPCloud: §2 tabla, §3.2 paso 2.
- Fotogramas: frame_14.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [simulacion-computacional, nucleo, halo, alternador, proceso, indicador-computacional].

---

### HU-B1.007 — Renderizar firma `( )` detras del nombre del proceso computacional

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** V.
**Superficie UI:** canvas-render de la elipse del proceso.
**Gesto canonico:** ninguno.

**Historia:**
> Como ingeniero de simulacion, quiero ver los parentesis redondos `( )` detras del nombre del proceso computacional para identificar visualmente que es una firma invocable, igual que en notacion funcional estandar.

**Contexto de negocio:**
El parentesis es universal para "funcion". Cualquier programador o ingeniero reconoce `Calculating( )` como firma. La marca persiste aun vacia para indicar "este proceso espera ser invocado con argumentos".

**Criterios de aceptacion:**
- **Dado** que `proceso.computational=true`, **cuando** se renderiza la elipse, **entonces** el nombre muestra sufijo ` ` con dos parentesis redondos.
- **Dado** que no he configurado firma especifica, **cuando** miro el render, **entonces** los parentesis estan vacios `( )`.
- **Dado** que `proceso.computational=false`, **cuando** se renderiza, **entonces** el sufijo `( )` no aparece.
- **Dado** que cambio la categoria del proceso (Predefined, ROS, MQTT, etc.), **cuando** el render se actualiza, **entonces** la firma `( )` NO cambia — no hay decoracion distintiva por categoria (regla observada §9).

**Reglas y restricciones:**
- Parentesis redondos `()`, NO corchetes ni llaves.
- Persiste vacio como firma no poblada.
- Ninguna marca visual diferencia entre `Predefined/Adding`, `ROS`, `MQTT`, etc. — solo la firma ` `.

**Dependencias:**
- Bloqueada por: HU-B1.006.

**Integraciones:**
- Renderizador: extiende capa de nombre del proceso.

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: §3.2 paso 3, §9 convencion.
- Fotogramas: frame_16+.
- Clase de afirmacion: observado + inferido (persistencia vacia).

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [simulacion-computacional, render, firma, sintaxis-parentesis].

---

### HU-B1.008 — Elegir categoria de computacion en grid 3x3

**Actor primario:** IS.
**Actores secundarios:** IR (ingeniero de runtime para ROS/MQTT).
**Tipo:** opcloud-ui.
**Nivel categorico:** K (nueva metadata `proceso.categoria`) primario; U (menu grid) secundario.
**Superficie UI:** grid 3x3 flotante bajo la elipse del proceso computacional.
**Gesto canonico:** clic en celda del grid.

**Historia:**
> Como ingeniero de simulacion, quiero elegir la categoria de computacion del proceso en un grid 3x3 para indicar si la ejecucion viene de una funcion preempaquetada, definida por usuario, o de un runtime externo (ROS, MQTT, Python, SQL, Gen AI).

**Contexto de negocio:**
El grid 3x3 (actualizacion 2026-04-18 vs 5 pestanas historicas) acepta 8 categorias. Esta eleccion es la "puerta" a subflows muy diferentes: Predefined abre un desplegable local (HU-B1.009); User Defined abre un editor de expresion (EPICA-B2); ROS/MQTT abren configuracion de runtime (EPICA-C0/C2); Gen AI abre parametrizacion LLM (EPICA-A2).

**Criterios de aceptacion:**
- **Dado** que tengo un proceso computacional seleccionado, **cuando** miro debajo de la elipse, **entonces** aparece un grid 3x3 con las 8 categorias: `Predefined`, `User Defined`, `External`, `ROS`, `MQTT`, `Python`, `SQL`, `Gen AI` (celda 3x3 vacia reservada).
- **Dado** que hago clic en `Predefined`, **cuando** se activa, **entonces** `proceso.categoria = "Predefined"` y aparece el desplegable de operaciones predefinidas (HU-B1.009).
- **Dado** que hago clic en `User Defined`, **cuando** se activa, **entonces** `proceso.categoria = "UserDefined"` y se delega el subflow a EPICA-B2.
- **Dado** que hago clic en `MQTT`, **cuando** se activa, **entonces** `proceso.categoria = "MQTT"` y se delega la configuracion a EPICA-C0.
- **Dado** que deselecciono el proceso, **cuando** pierdo foco, **entonces** el grid se cierra; la categoria elegida persiste.

**Reglas y restricciones:**
- El grid no es modal — se ancla al proceso y se cierra con deseleccion.
- Solo una categoria puede estar activa simultaneamente (comportamiento radio).
- La celda 3x3 vacia (fila 3, col 3) esta reservada para futuro (§2.1 fuente).
- `Python` y `SQL` son probablemente subespecializaciones de `External`/`User Defined` (hipotesis fuente).

**Modelo de datos tocado:**
- `proceso.categoria` — enum `"Predefined" | "UserDefined" | "External" | "ROS" | "MQTT" | "Python" | "SQL" | "GenAI"` — persistente.

**Dependencias:**
- Bloqueada por: HU-B1.006.
- Bloquea a: HU-B1.009, HU-B1.010.
- Delega a: EPICA-B2 (User Defined), EPICA-C0 (MQTT), EPICA-C2 (ROS), EPICA-A2 (Gen AI), EPICA-C1 (External/URL).

**Integraciones:**
- UI grid.
- Nucleo: valida categoria vs compatibilidad del proceso.
- Delega subflows a epicas correspondientes.

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: §2.1 grid 3x3 actualizado, §3.2 paso 2.
- Fotogramas: frame_14 (version 5 pestanas historica).
- Exploracion directa sandbox 2026-04-18 captura las 8 opciones.
- Clase de afirmacion: observado (version actual) + historico (5 pestanas).

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [simulacion-computacional, ui, menu-grid, categoria, delegacion-epicas].

---

### HU-B1.009 — Seleccionar operacion Predefined (p.ej. Adding)

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** K (metadata `proceso.operacionPredefinida`) primario; U secundario.
**Superficie UI:** desplegable al elegir celda Predefined.
**Gesto canonico:** clic en celda Predefined + seleccion en desplegable + `Update`.

**Historia:**
> Como ingeniero de simulacion, quiero elegir la operacion predefinida (p.ej. Adding) desde un desplegable para asignar semantica incorporada al proceso sin escribir formula.

**Contexto de negocio:**
Las operaciones predefinidas cubren el 80% de los casos tipicos: suma, producto, promedio, max/min, etc. Al exponerlas como catalogo cerrado, OPCloud garantiza evaluacion determinista sin que el modelador escriba codigo. El ejemplo canonico es `Adding`, que suma los valores de todos los objetos conectados como Instrument.

**Criterios de aceptacion:**
- **Dado** que elegi `Predefined` como categoria, **cuando** se abre el desplegable, **entonces** veo la lista de operaciones disponibles (observado: `Adding`; otras: pregunta abierta §11 Q2).
- **Dado** que selecciono `Adding` y confirmo con `Update`, **cuando** se aplica, **entonces** `proceso.operacionPredefinida = "Adding"`.
- **Dado** que asigne `Adding`, **cuando** conecto N objetos como Instrument y ejecuto, **entonces** el objeto Result recibe la suma de los N valores.
- **Dado** que asigne `Adding` y conecto un objeto con valor textual, **cuando** ejecuto: comportamiento indefinido — pregunta abierta §11 Q6 (error, NaN, coercion).
- **Dado** que cambio la operacion predefinida, **cuando** confirmo, **entonces** la firma ` ` se mantiene pero `operacionPredefinida` se actualiza y el tooltip refleja nueva operacion.

**Reglas y restricciones:**
- `operacionPredefinida` solo es valido si `categoria = "Predefined"`.
- Otras operaciones del catalogo: pregunta abierta (§11 Q2).
- Operaciones incorporadas probables: matematicas (add, sub, mul, div, avg, max, min), logicas (and, or, not), string (concat, slice).

**Modelo de datos tocado:**
- `proceso.operacionPredefinida` — enum `"Adding" | ...` — persistente — nullable.

**Dependencias:**
- Bloqueada por: HU-B1.008.

**Integraciones:**
- Motor de simulacion: ejecuta la operacion sobre valores de entradas al invocar.
- OPL: no necesariamente refleja la operacion — `adv-03` §C-09 senala brecha.

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: §3.2 paso 3, §11 Q2.
- Fotogramas: frame_14, frame_17.
- Clase de afirmacion: observado (Adding) + abierto (otras operaciones).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulacion-computacional, ui, predefinido, desplegable, requires-clarification].

---

### HU-B1.010 — Ver tooltip con operacion predefinida al hover sobre proceso

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** tooltip sobre elipse del proceso.
**Gesto canonico:** hover del cursor sobre la elipse del proceso computacional.

**Historia:**
> Como ingeniero de simulacion, quiero ver un tooltip con el nombre de la operacion predefinida al pasar el cursor sobre el proceso para recuperar la semantica exacta sin entrar a su configuracion.

**Contexto de negocio:**
Como la firma `( )` no distingue entre operaciones (todas se ven iguales: `Calculating( )`), el tooltip es la unica via visible en tiempo real para saber si esta activa `Adding`, `Multiplying`, `Max`, etc. Sin el tooltip, el modelador tendria que reabrir el grid para verificar.

**Criterios de aceptacion:**
- **Dado** que un proceso tiene `operacionPredefinida = "Adding"`, **cuando** paso el cursor sobre la elipse, **entonces** aparece un globito/tooltip con el texto `Adding`.
- **Dado** que el proceso es computacional pero sin `operacionPredefinida`, **cuando** hago hover, **entonces** el tooltip muestra el nombre de la categoria (p.ej. `ROS`, `MQTT`) o nada (comportamiento a validar).
- **Dado** que saco el cursor de la elipse, **cuando** pierde hover, **entonces** el tooltip desaparece.

**Reglas y restricciones:**
- Tooltip es solo lectura; no edita metadata.
- Retardo de hover: estandar del sistema (probablemente 300–500ms).
- Para categorias `ROS`/`MQTT`/`External`, el tooltip posiblemente muestre configuracion asociada (no observado explicitamente).

**Dependencias:**
- Bloqueada por: HU-B1.009.

**Integraciones:**
- Sistema de tooltips del canvas.

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: §3.2 paso 4.
- Fotogramas: frame_17 (tooltip `Adding`).
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [simulacion-computacional, ui, tooltip, hover].

---

### HU-B1.011 — Conectar objeto computacional a proceso con enlace Instrument

**Actor primario:** IS.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario (crea enlace con semantica computacional); V secundario.
**Superficie UI:** canvas + modal tipo-enlace.
**Gesto canonico:** arrastre desde borde del objeto al proceso + elegir `Instrument` en modal.

**Historia:**
> Como ingeniero de simulacion, quiero conectar objetos computacionales al proceso con enlace Instrument para que sus valores alimenten la firma del proceso como argumentos.

**Contexto de negocio:**
El enlace Instrument ya existia en OPM conceptual (condicion de ejecucion). En el modo computacional se **resemantiza**: no solo habilita la ejecucion, tambien **transporta un escalar** que se consume como argumento. La transcripcion lo confirma: "as it's an instrument we'll need it to do the computation".

**Criterios de aceptacion:**
- **Dado** que tengo un objeto computacional `O1` y un proceso computacional `P`, **cuando** hago arrastre de `O1` a `P` y elijo `Instrument`, **entonces** se crea `enlace {origen: O1, destino: P, tipo: "instrument"}`.
- **Dado** que el enlace Instrument existe, **cuando** se renderiza, **entonces** aparece ademas un circulo abierto (punto-lectura) sobre la linea (ver HU-B1.012).
- **Dado** que ejecuto la simulacion, **cuando** el proceso invoca su firma, **entonces** recibe el `currentValue` de `O1` como argumento posicional.
- **Dado** que `P.operacionPredefinida = "Adding"` y tengo 2 Instruments entrantes, **cuando** ejecuto, **entonces** el resultado es `O1.valor + O2.valor`.

**Reglas y restricciones:**
- El enlace Instrument mantiene la semantica OPM original (condicion) **y** agrega la semantica computacional (transporte de valor). [V-239] [V-240]
- La resolucion de parametros es posicional por orden de creacion (inferencia fuerte — no observado explicito).
- Si el objeto de entrada no es computacional, el enlace se crea pero el valor es `null` — comportamiento pendiente (§11).

**Modelo de datos tocado:**
- `enlace.tipo` — `"instrument"` — persistente.
- `enlace.origen`, `enlace.destino` — IDs — persistente.

**Dependencias:**
- Bloqueada por: HU-10.007, HU-B1.001, HU-B1.006.
- Bloquea a: HU-B1.012, HU-B1.015.

**Integraciones:**
- Renderizador del enlace + punto-lectura.
- Motor de simulacion: resuelve argumentos al invocar.
- OPL: `Calculating requires Object 1, o1, and Object 2, o2.`

**Notas de evidencia:**
- Fuente normativa: [V-239] familias canonicas de enlace; [V-240] firma Instrument.
- Fuente OPCloud: §2 link-kind, §3.3 paso 1.
- Fotogramas: frame_16.
- Transcripcion: "as it's an instrument we'll need it to do the computation".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulacion-computacional, nucleo, enlaces, instrument, resemantizacion].

---

### HU-B1.012 — Renderizar circulo abierto como punto de lectura de valor

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** V.
**Superficie UI:** canvas-render del enlace Instrument.
**Gesto canonico:** ninguno.

**Historia:**
> Como ingeniero de simulacion, quiero ver un circulo pequeno abierto sobre la linea del enlace Instrument para distinguir visualmente los enlaces que transportan valor de los que son solo condicion de ejecucion.

**Contexto de negocio:**
El circulo abierto (~6 px, hueco) es la marca visual que OPCloud usa para "punto de lectura de escalar". Aparece sobre enlaces que alimentan un proceso con firma `( )`, diferenciando simulacion computacional de simulacion conceptual. No figura en el inventario oficial de decoraciones SSOT (§1.5 corpus).

**Criterios de aceptacion:**
- **Dado** que existe un enlace Instrument entre objeto computacional y proceso computacional, **cuando** se renderiza el enlace, **entonces** aparece un circulo abierto (~6 px, hueco) en el punto donde la linea toca el contorno superior de la elipse del proceso.
- **Dado** que el circulo abierto existe, **cuando** deselecciono el enlace, **entonces** el circulo persiste (no es decoracion de seleccion).
- **Dado** que el proceso NO es computacional, **cuando** se renderiza el enlace Instrument, **entonces** el circulo abierto NO aparece.
- **Dado** que el objeto origen NO es computacional, **cuando** se renderiza el enlace, **entonces** el comportamiento del circulo es pregunta abierta (§11 Q1, no observado).

**Reglas y restricciones:**
- Circulo abierto (hueco), no lleno.
- Aproximadamente 6 px de diametro.
- Ubicado en el punto medio-superior del enlace, donde toca la elipse del proceso.
- No figura en SSOT visual oficial — es extension del lenguaje visual para simulacion (§9 fuente).

**Dependencias:**
- Bloqueada por: HU-B1.011.

**Integraciones:**
- Renderizador: decoracion terminal de enlace.

**Notas de evidencia:**
- Fuente normativa: — (extension visual no oficial en SSOT).
- Fuente OPCloud: §3.3 paso 2, §9 convencion, §11 Q1 (abierta para ROS/MQTT/External).
- Fotogramas: frame_20, frame_22, frame_33, frame_41.
- Clase de afirmacion: observado (para Predefined) + hipotesis (mecanismo "punto de lectura de valor") + abierto (otras categorias).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulacion-computacional, render, punto-lectura, extension-ssot, requires-clarification].

---

### HU-B1.013 — Conectar proceso a objeto resultado con enlace Result

**Actor primario:** IS.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario (enlace con semantica de salida).
**Superficie UI:** canvas + modal tipo-enlace.
**Gesto canonico:** arrastre desde borde del proceso al objeto resultado + elegir `Result`.

**Historia:**
> Como ingeniero de simulacion, quiero conectar el proceso computacional al objeto resultado con enlace Result para que el valor producido por la firma se almacene en el objeto destino.

**Contexto de negocio:**
El enlace Result materializa la salida de la invocacion. Sin el, la firma evalua pero el resultado no tiene donde residir. Este patron completa el triptico: entradas (Instrument) → funcion (proceso con firma) → salida (Result hacia objeto).

**Criterios de aceptacion:**
- **Dado** que tengo un proceso computacional `P` y un objeto computacional `O3`, **cuando** hago arrastre de `P` a `O3` y elijo `Result`, **entonces** se crea `enlace {origen: P, destino: O3, tipo: "result"}`.
- **Dado** que ejecuto la simulacion, **cuando** `P` invoca su firma y produce un escalar, **entonces** ese escalar se escribe en `O3.valueState.currentValue`.
- **Dado** que `O3` no es computacional, **cuando** el enlace Result existe, **entonces** el valor no tiene donde almacenarse — escenario probablemente rechazado o silente (pregunta abierta).
- **Dado** que el enlace Result existe, **cuando** consulto OPL, **entonces** aparece `Calculating yields Object 3, o3.`

**Reglas y restricciones:**
- El enlace Result entre proceso y objeto es el patron OPM canonico — no se redefine aqui, solo se resemantiza. [V-239]
- Un proceso puede tener multiples Results (multisalida) — comportamiento especifico: pregunta abierta.

**Modelo de datos tocado:**
- `enlace.tipo` — `"result"` — persistente.

**Dependencias:**
- Bloqueada por: HU-10.007, HU-B1.001, HU-B1.006.
- Bloquea a: HU-B1.015, HU-B1.024.

**Integraciones:**
- Motor de simulacion: escribe `currentValue` al completar ejecucion.
- OPL: emite oracion `yields`.

**Notas de evidencia:**
- Fuente normativa: [V-239] familias canonicas de enlace.
- Fuente OPCloud: §3.3 paso 4.
- Fotogramas: frame_20.
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulacion-computacional, nucleo, enlaces, result, salida].

---

### HU-B1.014 — Asignar valor manual al estado-value antes de ejecutar

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** K (mutacion `valueState.currentValue`) primario; U secundario.
**Superficie UI:** rectangulo-estado del objeto computacional (clic directo).
**Gesto canonico:** clic en estado-value + escribir numero + confirmar.

**Historia:**
> Como ingeniero de simulacion, quiero asignar un valor manual al estado-value de un objeto computacional antes de ejecutar para probar la simulacion con entradas deterministas conocidas.

**Contexto de negocio:**
Antes de usar sorteo probabilistico, el modelador tipicamente quiere verificar la logica del modelo con valores fijos (p.ej. `5 + 10 = 15`). El clic directo sobre el estado-value es la afordancia de "pruebalo con este numero".

**Criterios de aceptacion:**
- **Dado** que un objeto es computacional y su `displayText = "value"`, **cuando** hago clic en el estado-value, **entonces** se abre edicion de texto inline (similar al popup de nombre).
- **Dado** que escribo `5` y confirmo, **cuando** el popup cierra, **entonces** `valueState.displayText = "5"` y `valueState.currentValue = 5`.
- **Dado** que asigne `5`, **cuando** consulto el render, **entonces** el rectangulo-estado muestra `5` en vez de `value`.
- **Dado** que ejecuto la simulacion sync, **cuando** el proceso consume el valor, **entonces** recibe el numero asignado.
- **Dado** que reseteo el modelo o desactivo computacional y vuelvo a activarlo, **cuando** consulto: pregunta abierta — ¿se preserva el valor o vuelve a `value`? (§11 Q3).

**Reglas y restricciones:**
- Valor escalar acepta numero (entero/decimal) o string (caso textual).
- Si es string y la firma espera numero: pregunta abierta (§11 Q6).
- Valor vacio se mantiene como `value` placeholder.

**Modelo de datos tocado:**
- `objeto.valueState.displayText` — string — persistente/transitorio.
- `objeto.valueState.currentValue` — number | string | null — persistente/transitorio.

**Dependencias:**
- Bloqueada por: HU-B1.002.
- Bloquea a: HU-B1.015.

**Integraciones:**
- Renderizador: muestra displayText.
- Motor de simulacion: lee currentValue.

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: §3.4 pasos 2–3, §3.5 regla observada `displayText`.
- Fotogramas: frame_22 (post-asignacion manual).
- Transcripcion: "click on the state and write 5".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulacion-computacional, nucleo, asignacion-valor, edicion-inline].

---

### HU-B1.015 — Ejecutar simulacion sync determinista y ver resultado en tiempo real

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; K (motor) secundario.
**Superficie UI:** barra de simulacion + boton Play sync ▶.
**Gesto canonico:** clic en Play sync en modo simulacion.

**Historia:**
> Como ingeniero de simulacion, quiero ejecutar el modelo en modo sync determinista para ver el resultado de la firma computada con los valores manualmente asignados, en tiempo real sobre el canvas.

**Contexto de negocio:**
Sync execute es el flujo de validacion inmediata: el modelador fija las entradas, dispara play, ve la salida aparecer. Es la version "calculadora" del modelador OPM — rapidez de retroalimentacion para prototipar formulas. No requiere sorteo probabilistico ni multiples ejecuciones.

**Criterios de aceptacion:**
- **Dado** que entre al modo simulacion (EPICA-B0), **cuando** miro la barra superior, **entonces** veo el boton Play sync ▶.
- **Dado** que los objetos `O1=5` y `O2=10` alimentan `Calculating` como Instrument con Predefined/Adding, **cuando** hago clic en Play sync, **entonces** `O3.valueState.displayText` se actualiza a `15`.
- **Dado** que la ejecucion se completo, **cuando** miro el canvas, **entonces** todos los objetos computacionales muestran sus valores finales en sus estados-value.
- **Dado** que no asigne valores (todos en `value`), **cuando** ejecuto, **entonces** "nothing happens" (narrador) — el resultado queda en `value` o vacio.
- **Dado** que el proceso no tiene sombreado durante la ejecucion, **cuando** ejecuto sync, **entonces** la elipse no cambia de color (§11 Q4 abierta — contrasta con modo conceptual).

**Reglas y restricciones:**
- Sync es la ejecucion determinista, una sola pasada.
- No genera archivo de salida (XLSX solo aplica con async).
- No hay bloqueo si faltan valores — el resultado queda vacio (no error modal, §4 fuente).

**Dependencias:**
- Bloqueada por: HU-B1.011, HU-B1.013, HU-B1.014, EPICA-B0 (modo simulacion).
- Bloquea a: HU-B1.024.

**Integraciones:**
- Motor de simulacion.
- Renderizador: actualiza displayText en vivo.
- Pestana de simulacion vs edicion (EPICA-B0).

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: §3.4 paso 3.
- Fotogramas: frame_22.
- Transcripcion: "we'll go to the execute like we've done in the conceptual part and we can just click execute".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [simulacion-computacional, motor, sync, ejecutar, tiempo-real].

---

### HU-B1.016 — Abrir modal Simulated Elements con lista de cosas simulables

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; K (indicador `simulacion.activa`) secundario.
**Superficie UI:** modal `Simulated Elements` (dado 🎲 en barra).
**Gesto canonico:** clic en icono dado 🎲 de la barra de simulacion.

**Historia:**
> Como ingeniero de simulacion, quiero abrir un modal con la lista de todas las cosas simulables del modelo para elegir cuales alimentar con valores sorteados en lugar de valores fijos.

**Contexto de negocio:**
El modal `Simulated Elements` es el punto de entrada a la simulacion probabilistica. Sin el, el modelador solo puede ejecutar con valores fijos. Listar cada elemento con casilla permite simular parcialmente (p.ej. solo `O1` con sorteo, `O2` fijo) — caso frecuente para analisis de sensibilidad.

**Criterios de aceptacion:**
- **Dado** que estoy en modo simulacion, **cuando** hago clic en el dado 🎲 de la barra, **entonces** se abre el modal `Simulated Elements`.
- **Dado** que el modal esta abierto, **cuando** miro, **entonces** veo una fila por cada objeto computacional con formato `[m] {alias}` y un boton `Set Simulation Parameters` por fila.
- **Dado** que el modal tiene N filas, **cuando** miro los controles, **entonces** veo tambien un boton `Close`.
- **Dado** que el modelo no tiene objetos computacionales, **cuando** abro el modal, **entonces** la lista esta vacia (comportamiento pendiente — pregunta abierta).
- **Dado** que cierro con `Close`, **cuando** se cierra el modal, **entonces** las selecciones de simulacion se preservan si hice alguna.

**Reglas y restricciones:**
- El modal enumera solo objetos computacionales (¿o tambien procesos? — narrador sugiere que si puede simularse el proceso, §11 Q7).
- Cada fila muestra el formato visible del objeto: unidad `[m]` y alias `{alias}`.

**Dependencias:**
- Bloqueada por: HU-B1.001 (al menos un objeto computacional).
- Bloquea a: HU-B1.017, HU-B1.018, HU-B1.019.

**Integraciones:**
- Modal UI.
- Lente sobre modelo: enumera objetos computacionales.

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: §2 modales, §3.5 paso 1.
- Fotogramas: frame_25.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulacion-computacional, ui, modal, lista, elementos-simulables].

---

### HU-B1.017 — Marcar objeto como elemento simulable via casilla

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** K (`simulacion.activa`) primario.
**Superficie UI:** modal `Simulated Elements` (casilla por fila).
**Gesto canonico:** clic en casilla de la fila.

**Historia:**
> Como ingeniero de simulacion, quiero marcar un objeto como simulable con casilla para indicar que su valor sera sorteado en cada ejecucion en lugar de usar el valor fijo asignado.

**Contexto de negocio:**
La seleccion granular (casilla por objeto) permite estrategias mixtas: simular solo las variables de interes, mantener el resto fijo como controles. Es la base del analisis de sensibilidad en el modelador.

**Criterios de aceptacion:**
- **Dado** que el modal `Simulated Elements` esta abierto, **cuando** hago clic en la casilla de un objeto, **entonces** `objeto.simulacion.activa = true`.
- **Dado** que marque un objeto y no configure parametros, **cuando** intento ejecutar async, **entonces** se abre primero el modal de parametros (HU-B1.018) o se produce comportamiento por defecto (pendiente).
- **Dado** que desmarco la casilla, **cuando** el indicador cambia, **entonces** el objeto vuelve a usar su `currentValue` manual en ejecuciones subsiguientes.
- **Dado** que marco un objeto, **cuando** cierro y reabro el modal, **entonces** la marca persiste.

**Reglas y restricciones:**
- Casilla solo marca la activacion; los parametros se definen en modal separado (HU-B1.018).
- Estado persistente entre ejecuciones y entre sesiones.
- Por defecto al crear objeto computacional: `simulacion.activa = false`.

**Modelo de datos tocado:**
- `objeto.simulacion.activa` — boolean — persistente.

**Dependencias:**
- Bloqueada por: HU-B1.016.
- Bloquea a: HU-B1.018, HU-B1.019, HU-B1.022.

**Integraciones:**
- Lista del modal.

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: §3.5 paso 2, §6 modelo de datos.
- Fotogramas: frame_25.
- Clase de afirmacion: observado + inferido (persistencia).

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [simulacion-computacional, ui, casilla, simulacion-activa].

---

### HU-B1.018 — Definir valor numerico sorteado con distribucion de probabilidad

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** K (nueva metadata `simulacion.numerico`) primario; U (modal de parametros) secundario.
**Superficie UI:** modal `Please select one of the following values` (submodal numerico).
**Gesto canonico:** radio `Numerical Value` + desplegable `Probability` + entradas `Min/Max` + `Save Values`.

**Historia:**
> Como ingeniero de simulacion, quiero definir la distribucion de probabilidad de un objeto simulable (Uniforme, Normal, Bernoulli, Geometrica, Poisson, Exponencial, Binomial) con rango Min/Max para generar valores realistas durante las ejecuciones.

**Contexto de negocio:**
La riqueza de distribuciones cubre casi todos los casos de modelado estocastico: Uniforme (aleatoriedad pura), Normal (mediciones ruidosas), Bernoulli (eventos binarios), Poisson (conteo de eventos), Exponencial (tiempos entre eventos), etc. Min/Max aplican tipicamente a Uniforme y Binomial; otras distribuciones podrian requerir parametros adicionales (media, desviacion estandar, λ) — pregunta abierta.

**Criterios de aceptacion:**
- **Dado** que hago clic en `Set Simulation Parameters` de un objeto, **cuando** se abre el modal de parametros, **entonces** veo radio `Numerical Value` | `Textual Value` mutuamente excluyentes.
- **Dado** que elijo `Numerical Value`, **cuando** miro los controles, **entonces** veo alternador `Integer value`, desplegable `Probability` con 7 opciones (Uniforme, Normal, Bernoulli, Geometrica, Poisson, Exponencial, Binomial), y campos `Min` / `Max`.
- **Dado** que elijo `Uniforme` + `Integer value` on + `Min=1` + `Max=50`, **cuando** hago clic en `Save Values`, **entonces** `objeto.simulacion.numerico = {entero: true, probabilidad: "Uniform", min: 1, max: 50}`.
- **Dado** que elijo `Normal`, **cuando** miro los controles: pregunta abierta — ¿aparecen `media`/`desviacion` en lugar de Min/Max? (no observado explicitamente).
- **Dado** que hago clic en `Reset Values`, **cuando** los campos limpian, **entonces** `objeto.simulacion.numerico = null` o por defecto.
- **Dado** que cierro con `Close` sin guardar, **cuando** se cierra el modal, **entonces** los cambios no persisten.

**Reglas y restricciones:**
- 7 distribuciones disponibles segun desplegable (§2 modales).
- `Integer value` alternador afecta coercion: off → flotante, on → entero.
- Min/Max son requeridos para Uniforme/Binomial; otras distribuciones: pregunta abierta.
- El modal se alcanza tambien haciendo clic directo sobre un objeto y usando `simulate element` (§3.5 paso 3).

**Modelo de datos tocado:**
- `objeto.simulacion.tipo` — `"numerico"` — persistente.
- `objeto.simulacion.numerico.entero` — boolean — persistente.
- `objeto.simulacion.numerico.probabilidad` — enum 7 valores — persistente.
- `objeto.simulacion.numerico.min` — number — persistente.
- `objeto.simulacion.numerico.max` — number — persistente.

**Dependencias:**
- Bloqueada por: HU-B1.017.
- Bloquea a: HU-B1.022.

**Integraciones:**
- Motor de simulacion: usa parametros para sortear por ejecucion.

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: §2 modales, §3.5 paso 2, §5 controles.
- Fotogramas: frame_28 (desplegable 7 distribuciones), frame_30 (Min/Max), frame_38.
- Clase de afirmacion: observado (estructura) + abierto (parametros especificos por distribucion).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [simulacion-computacional, ui, modal, probabilidad, distribucion, requires-clarification].

---

### HU-B1.019 — Definir valor textual sorteado con pares texto:peso

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** K (metadata `simulacion.textual`) primario; U secundario.
**Superficie UI:** modal `Please select one of the following values` (submodal textual).
**Gesto canonico:** radio `Textual Value` + editar pares `texto:% +`.

**Historia:**
> Como ingeniero de simulacion, quiero definir los posibles valores textuales de un objeto simulable con peso probabilistico (p.ej. `yes:50, no:50`) para modelar variables categoricas discretas.

**Contexto de negocio:**
No todas las variables de un modelo son numericas. Un sensor de estado binario (`yes`/`no`), una politica (`approved`/`rejected`/`pending`), un dominio categorico requiere sorteo sobre etiquetas de texto con distribucion de peso. Este modo cubre esa necesidad.

**Criterios de aceptacion:**
- **Dado** que abro el modal de parametros y elijo `Textual Value`, **cuando** miro los controles, **entonces** veo editor de pares `texto: % +` con boton para agregar filas.
- **Dado** que agrego `yes:50` y `no:50`, **cuando** hago clic en `Save Values`, **entonces** `objeto.simulacion.textual = [{texto: "yes", peso: 50}, {texto: "no", peso: 50}]`.
- **Dado** que los pesos no suman 100, **cuando** guardo: comportamiento pendiente — ¿normaliza automaticamente, advierte, o rechaza? (no observado).
- **Dado** que elegi Textual Value, **cuando** el motor sortea, **entonces** produce uno de los textos con probabilidad proporcional a su peso.
- **Dado** que dejo la lista vacia, **cuando** intento guardar: comportamiento pendiente.

**Reglas y restricciones:**
- Lista variable de pares `{texto, peso}`.
- Peso como porcentaje numerico (entero o decimal).
- Suma de pesos normalizada: comportamiento no observado explicitamente.
- Mezcla Textual en objeto que alimenta firma numerica (`Adding`): pregunta abierta §11 Q6 (coercion a NaN, error, o advertencia).

**Modelo de datos tocado:**
- `objeto.simulacion.tipo` — `"textual"` — persistente.
- `objeto.simulacion.textual` — `Array<{texto: string, peso: number}>` — persistente.

**Dependencias:**
- Bloqueada por: HU-B1.017.
- Bloquea a: HU-B1.022.

**Integraciones:**
- Motor de simulacion: selecciona texto por distribucion de peso.

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: §2 modales, §4 flow "Textual Value".
- Fotogramas: implicito en §2 descripcion, no hay fotograma dedicado en muestra.
- Clase de afirmacion: observado (estructura) + abierto (semantica de normalizacion y mezcla).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [simulacion-computacional, ui, modal, textual, seleccion-ponderada, requires-clarification].

---

### HU-B1.020 — Configurar Number Of Simulation Runs en barra de simulacion

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** C (configuracion) primario; U secundario.
**Superficie UI:** entrada `Number Of Simulation Runs` en barra de simulacion.
**Gesto canonico:** escribir numero en entrada.

**Historia:**
> Como ingeniero de simulacion, quiero configurar el numero de ejecuciones totales que se realizaran en modo async para controlar la resolucion estadistica de la simulacion.

**Contexto de negocio:**
Una simulacion estocastica necesita N pasadas para dar estadisticas confiables. N=10 es exploracion rapida; N=1000 es validacion seria. La entrada permite al modelador equilibrar tiempo de ejecucion vs precision estadistica.

**Criterios de aceptacion:**
- **Dado** que estoy en modo simulacion, **cuando** miro la barra, **entonces** veo una entrada numerica rotulada `Number Of Simulation Runs` con tooltip descriptivo.
- **Dado** que escribo `10`, **cuando** confirmo, **entonces** `simulacion.config.numeroDeEjecuciones = 10`.
- **Dado** que ejecuto async, **cuando** la simulacion corre, **entonces** se realizan exactamente 10 pasadas.
- **Dado** que dejo la entrada vacia: por defecto es `1` (§5 controles).
- **Dado** que escribo 0 o negativo: comportamiento pendiente (validacion no observada).

**Reglas y restricciones:**
- Por defecto: `1` (inferido de tabla §5).
- Entero positivo.
- No hay rango maximo observado (¿10000? ¿100000?).

**Modelo de datos tocado:**
- `simulacion.config.numeroDeEjecuciones` — integer — persistente (probablemente por modelo, no global).

**Dependencias:**
- Bloquea a: HU-B1.022.

**Integraciones:**
- Motor de simulacion.

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: §2 barra de simulacion, §5 controles.
- Fotogramas: frame_30 (tooltip visible), frame_36 (valor 10).
- Transcripcion: "if I will keep this kind of configuration I will get 10 excel files".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [simulacion-computacional, ui, ejecuciones, configuracion].

---

### HU-B1.021 — Configurar Download CSV File After This Number Of Runs

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** C primario; X (export) secundario.
**Superficie UI:** entrada `Download CSV File After This Number Of Runs` en barra.
**Gesto canonico:** escribir numero.

**Historia:**
> Como ingeniero de simulacion, quiero configurar cada cuantas ejecuciones se descarga un archivo de resultados para manejar simulaciones largas sin generar un archivo por cada ejecucion.

**Contexto de negocio:**
Si ejecuciones totales = 10 y descarga-cada = 1, se generan 10 archivos (uno por ejecucion). Si descarga-cada = 10, se genera 1 archivo al final con los 10 resultados. La entrada permite granular la exportacion segun el caso de uso: auditoria ejecucion-por-ejecucion vs reporte consolidado.

**Criterios de aceptacion:**
- **Dado** que estoy en modo simulacion, **cuando** miro la barra, **entonces** veo entrada `Download CSV File After This Number Of Runs` con tooltip.
- **Dado** que escribo `10` con ejecuciones totales=10, **cuando** ejecuto async, **entonces** se descarga 1 archivo al final con los 10 resultados.
- **Dado** que escribo `1` con ejecuciones totales=10, **cuando** ejecuto async, **entonces** se descargan 10 archivos (uno por ejecucion).
- **Dado** que el rotulo dice `CSV`, **cuando** se descarga el archivo: a pesar del rotulo, el archivo entregado es `.xlsx` (frame 41, observado).
- **Dado** que configuro `descarga-cada > ejecuciones totales`, **cuando** ejecuto: comportamiento pendiente (¿se descarga al final de todos modos?).

**Reglas y restricciones:**
- Por defecto: `1` (§5 controles).
- Discrepancia documentada entre rotulo `CSV` y formato efectivo `XLSX` (brecha §2 fuente).
- Entero positivo.

**Modelo de datos tocado:**
- `simulacion.config.descargaCadaNEjecuciones` — integer — persistente.

**Dependencias:**
- Bloqueada por: HU-B1.020.
- Relaciona: HU-B1.025.

**Integraciones:**
- Exportador XLSX (HU-B1.025).

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: §2, §5.
- Fotogramas: frame_30 (tooltip), frame_36 (valor 10), frame_41 (archivo XLSX efectivo).
- Transcripcion: "please note this is done in order to find something stuck so for now we'll select 10 meaning that it will only download one excel file at the end".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [simulacion-computacional, ui, csv, descarga, discrepancia-nombre].

---

### HU-B1.022 — Ejecutar simulacion async con valores sorteados

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; K (motor + mutacion masiva) secundario.
**Superficie UI:** boton `Async Execute` ▶△ en barra de simulacion.
**Gesto canonico:** clic en Async Execute.

**Historia:**
> Como ingeniero de simulacion, quiero ejecutar la simulacion en modo async para correr N pasadas con valores sorteados de las distribuciones definidas y obtener un archivo de resultados al final.

**Contexto de negocio:**
Async es el modo estocastico: cada ejecucion sortea nuevos valores de las distribuciones activas, evalua la firma del proceso y acumula resultados. Distinto a sync (determinista, una pasada), async es para analisis de incertidumbre, sensibilidad, Monte Carlo.

**Criterios de aceptacion:**
- **Dado** que tengo al menos un objeto con `simulacion.activa = true` y parametros definidos, **cuando** hago clic en `Async Execute` ▶△, **entonces** la simulacion corre N ejecuciones (N = `numeroDeEjecuciones`).
- **Dado** que la simulacion corre, **cuando** se completa cada ejecucion, **entonces** los `displayText` de los objetos simulados muestran el ultimo valor sorteado (no el acumulado).
- **Dado** que la simulacion termina, **cuando** se cumple el criterio `descargaCadaNEjecuciones`, **entonces** se descarga el archivo XLSX (HU-B1.025).
- **Dado** que no hay objetos con `simulacion.activa = true`, **cuando** hago clic async: comportamiento pendiente (¿equivale a sync? ¿error?).
- **Dado** que ejecuto async vs sync: la diferencia clave es el sorteo por ejecucion.

**Reglas y restricciones:**
- Async descarta los valores preasignados en favor de sorteos (ver HU-B1.023).
- Cada ejecucion es independiente (estado inicializado al inicio).
- El motor marca el canvas como no editable durante async.

**Dependencias:**
- Bloqueada por: HU-B1.017, HU-B1.018 o HU-B1.019, HU-B1.020.
- Bloquea a: HU-B1.023, HU-B1.024, HU-B1.025.

**Integraciones:**
- Motor de simulacion (motor de sorteo + invocacion).
- Renderizador: actualiza displayText en vivo.
- Exportador XLSX.

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: §3.5 paso 6.
- Fotogramas: frame_41 (resultados post-async).
- Transcripcion: "now click async which will run all the options and then we'll have a look at the excel".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [simulacion-computacional, motor, async, ejecutar, monte-carlo].

---

### HU-B1.023 — Descartar valor preasignado cuando el objeto esta marcado como simulado

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** K (regla de precedencia del motor).
**Superficie UI:** ninguna (regla del motor).
**Gesto canonico:** ninguno.

**Historia:**
> Como ingeniero de simulacion, quiero que el motor descarte el valor manualmente asignado cuando un objeto esta marcado como simulado para garantizar que cada ejecucion use un sorteo fresco de la distribucion.

**Contexto de negocio:**
Sin esta regla, un objeto podria tener ambos valores (manual + simulacion) en conflicto y el motor deberia decidir cual usar. La regla declarada por el narrador — "it will disregard the value created" — resuelve la ambiguedad: si `simulacion.activa = true`, el `currentValue` manual se ignora y se sortea uno nuevo por ejecucion.

**Criterios de aceptacion:**
- **Dado** que un objeto tiene `valueState.currentValue = 5` Y `simulacion.activa = true`, **cuando** ejecuto async, **entonces** cada ejecucion sortea un nuevo valor de la distribucion, ignorando el 5.
- **Dado** que un objeto tiene `valueState.currentValue = 5` Y `simulacion.activa = false`, **cuando** ejecuto async, **entonces** el valor 5 se mantiene constante a traves de todas las ejecuciones.
- **Dado** que desmarco `simulacion.activa`, **cuando** vuelvo a ejecutar, **entonces** el valor manual vuelve a ser usado.
- **Dado** que `simulacion.activa = true` sobre el **proceso** mismo (no solo sobre objetos de entrada), **cuando** ejecuto async, **entonces** el resultado del proceso es sorteado tambien — ignora la firma — (comportamiento probable, §11 Q7 abierto).

**Reglas y restricciones:**
- Regla de precedencia: `simulacion.activa === true` ⟹ ignorar `currentValue` manual, usar sorteo.
- La regla aplica por objeto independientemente.
- Caso borde: precedencia cuando se simula proceso **y** sus objetos de entrada: §11 Q7 abierta.

**Modelo de datos tocado:**
- Lectura: `objeto.simulacion.activa`, `objeto.valueState.currentValue`.
- Escritura transitoria durante ejecuciones: `valueState.currentValue` = sorteo.

**Dependencias:**
- Bloqueada por: HU-B1.022.

**Integraciones:**
- Motor de simulacion.

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: §3.5 regla observada, §11 Q7.
- Transcripcion: "it will disregard the value created" (narrador).
- Clase de afirmacion: confirmado por transcripcion + abierto (caso proceso simulado).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulacion-computacional, motor, precedencia, regla-motor, requires-clarification].

---

### HU-B1.024 — Actualizar displayText del estado-value en tiempo real durante ejecucion

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** V (render reactivo).
**Superficie UI:** canvas-render de los rectangulos-estado.
**Gesto canonico:** ninguno (reactivo).

**Historia:**
> Como ingeniero de simulacion, quiero ver como los valores de los objetos se actualizan en vivo durante la simulacion sync/async para observar el comportamiento del modelo paso a paso.

**Contexto de negocio:**
La visualizacion en vivo es el distintivo pedagogico de OPCloud: el modelo "habla" mientras corre. Ver numeros cambiar en el canvas es mas informativo que leer un log al final — el modelador detecta patrones y anomalias en tiempo real.

**Criterios de aceptacion:**
- **Dado** que ejecuto simulacion sync, **cuando** el proceso computa, **entonces** el `displayText` del objeto Result se actualiza inmediatamente con el valor calculado.
- **Dado** que ejecuto async con N ejecuciones, **cuando** cada ejecucion completa, **entonces** los objetos simulados muestran el ultimo valor sorteado de esa ejecucion.
- **Dado** que la simulacion corre rapido, **cuando** N es grande (p.ej. N=1000), **entonces** el render respeta un debouncing para no saturar el canvas (comportamiento esperado, no observado explicito).
- **Dado** que la simulacion termina, **cuando** la ultima ejecucion completa, **entonces** los objetos quedan mostrando los valores de la ultima ejecucion (no se resetean a `value` — §11 Q3 abierta pero sugerencia de frame_41 es que persisten).
- **Dado** que ejecuto con sync, **cuando** termina: los valores persisten — ¿reset al salir de modo simulacion? §11 Q3.

**Reglas y restricciones:**
- El contorno oliva del rectangulo-estado no cambia durante la ejecucion.
- El texto interior es lo unico que muta.
- Render en vivo es responsabilidad del paso de simulacion en el motor.
- El proceso computacional NO muestra sombreado durante la ejecucion (§11 Q4 abierta — contrasta con simulacion conceptual).

**Modelo de datos tocado:**
- `objeto.valueState.displayText` — string — transitorio durante ejecuciones.
- `objeto.valueState.currentValue` — persistente al final.

**Dependencias:**
- Bloqueada por: HU-B1.015 o HU-B1.022.

**Integraciones:**
- Renderizador reactivo.
- Motor de simulacion.

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: §3.4 paso 3, §3.5 paso 7, §11 Q3, §11 Q4.
- Fotogramas: frame_22, frame_41.
- Clase de afirmacion: observado + abierto (reset y sombreado).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulacion-computacional, render, tiempo-real, reactivo, requires-clarification].

---

### HU-B1.025 — Exportar resultados de ejecuciones a archivo XLSX

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** X (export) primario.
**Superficie UI:** boton `XLSX↓` en barra de simulacion + descarga automatica post-ejecuciones.
**Gesto canonico:** automatica al cumplir criterio `descargaCadaNEjecuciones`; o clic manual en `XLSX↓`.

**Historia:**
> Como ingeniero de simulacion, quiero descargar un archivo XLSX con los valores sorteados y resultados computados de todas las ejecuciones para analisis posterior en Excel o scripts.

**Contexto de negocio:**
El analisis estadistico de Monte Carlo requiere exportar los datos crudos. XLSX es el formato universal en entornos de ingenieria. OPCloud lo genera automaticamente al final de una simulacion async, o bajo demanda con el boton `XLSX↓`.

**Criterios de aceptacion:**
- **Dado** que complete una simulacion async con N ejecuciones, **cuando** se cumple `descargaCadaNEjecuciones`, **entonces** se descarga un archivo `Model (Not Saved)...xlsx` automaticamente.
- **Dado** que la descarga se completo, **cuando** abro el archivo, **entonces** contiene N filas (una por ejecucion) con columnas para cada objeto simulado y cada objeto resultado (estructura precisa: pregunta abierta §11 Q5).
- **Dado** que hago clic en `XLSX↓` manualmente, **cuando** no hay ejecucion reciente: comportamiento pendiente (¿error, archivo vacio, ultima-ejecucion?).
- **Dado** que el modelo no esta guardado, **cuando** se descarga, **entonces** el nombre de archivo es `Model (Not Saved)` + timestamp.
- **Dado** que el modelo tiene nombre, **cuando** se descarga: nombre de archivo usa nombre del modelo (inferido, no observado explicito).

**Reglas y restricciones:**
- Formato XLSX real (pese al rotulo CSV de la entrada — brecha).
- Estructura: columnas = objetos simulados + resultados; filas = ejecuciones. Uso de nombre/alias en cabeceras: pregunta abierta §11 Q5.
- Descarga visible como toast en esquina inferior izquierda (frame 41).

**Dependencias:**
- Bloqueada por: HU-B1.022.

**Integraciones:**
- Exportador (nuevo modulo de export).

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: §2 barra, §3.5 paso 5, §7 integraciones, §11 Q5.
- Fotogramas: frame_41 (toast descarga).
- Transcripcion: "those are all random numbers selected by OPCloud and of course here we have the result of our excel".
- Clase de afirmacion: observado + abierto (columnas exactas).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [simulacion-computacional, export, xlsx, descarga, requires-clarification].

---

### HU-B1.026 — Ver OPL de cuatro campos con alias y unidad

**Actor primario:** IS.
**Tipo:** mixto.
**Nivel categorico:** L (lente OPL).
**Superficie UI:** panel-opl.
**Gesto canonico:** ninguno (actualizacion reactiva).

**Historia:**
> Como ingeniero de simulacion, quiero ver en el panel OPL la oracion de cuatro campos `Objeto, alias, is valor unidad.` para tener la narrativa semantica de cada objeto computacional junto a su render visual.

**Contexto de negocio:**
OPL canonico solo tiene plantillas de 2-3 campos para objetos basicos. El modo computacional exige cuatro campos (nombre, alias, valor, unidad). Esta extension es una de las brechas `adv-03` §C-11 — el OPL original no cubre dualidad OPD↔OPL extendida.

**Criterios de aceptacion:**
- **Dado** que un objeto tiene nombre `Object 1`, alias `o1`, valor `37`, unidad `m`, **cuando** consulto OPL, **entonces** aparece `Object 1, o1, is 37 m.`
- **Dado** que el objeto no tiene alias, **cuando** consulto OPL, **entonces** se omite el segundo campo: `Object 1 is 37 m.`
- **Dado** que el objeto no tiene unidad, **cuando** consulto OPL, **entonces** se omite la unidad al final: `Object 1, o1, is 37.`
- **Dado** que el objeto no tiene valor asignado (`displayText = "value"`), **cuando** consulto OPL, **entonces** aparece `Object 1, o1, is value m.` — la palabra literal `value` ocupa el slot.
- **Dado** que los enlaces Instrument y Result existen, **cuando** consulto OPL, **entonces** aparecen `Calculating requires Object 1, o1, and Object 2, o2.` y `Calculating yields Object 3, o3.`.
- **Dado** que ejecuto async, **cuando** los valores cambian por ejecucion, **entonces** la OPL se actualiza reactivamente con cada valor.

**Reglas y restricciones:**
- Plantilla: `<nombre>, <alias>, is <valor> <unidad>.`
- Omisiones condicionales cuando alias/unidad/valor estan vacios. [OPL-ES §2]
- La OPL ya extendida NO es parte de la plantilla base del OPL (brecha documentada §7 fuente + `adv-03` §C-11).

**Dependencias:**
- Bloqueada por: HU-B1.001, HU-B1.003, HU-B1.004, HU-B1.014.

**Integraciones:**
- Motor OPL — requiere nueva plantilla.

**Notas de evidencia:**
- Fuente normativa: [OPL-ES §2] verbos y estructura basica.
- Fuente OPCloud: §7 OPL, §9 convenciones.
- Fotogramas: frame_20 (pre-ejecucion), frame_41 (post-ejecucion), frame_5 (sin alias/unidad).
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [simulacion-computacional, opl, lente, oracion-cuatro-campos, extension-ssot].

---

### HU-B1.027 — Conectar proceso computacional a sensor MQTT como categoria

**Actor primario:** IR (ingeniero de runtime).
**Actores secundarios:** IS.
**Tipo:** opcloud-ui.
**Nivel categorico:** X (integracion externa) primario; K (metadata de categoria) secundario.
**Superficie UI:** grid 3x3 (celda MQTT) + submodal de configuracion MQTT (delegado a EPICA-C0).
**Gesto canonico:** clic en celda MQTT del grid 3x3.

**Historia:**
> Como ingeniero de runtime, quiero asignar la categoria MQTT al proceso computacional para que en lugar de evaluar una formula local consuma el valor publicado por un sensor real en un broker MQTT.

**Contexto de negocio:**
La integracion MQTT transforma el modelo de un simulador off-line a un **gemelo operacional conectado**. El valor del objeto Result ya no es computado en-memoria sino recibido de un sensor fisico via broker. Esta HU es el hook desde EPICA-B1 hacia EPICA-C0 (runtime MQTT completo). La mecanica interna (topic, QoS, credenciales) se delega a C0; aqui solo la seleccion de categoria.

**Criterios de aceptacion:**
- **Dado** que tengo un proceso computacional, **cuando** elijo `MQTT` en el grid 3x3, **entonces** `proceso.categoria = "MQTT"`.
- **Dado** que `categoria = "MQTT"`, **cuando** se abre la configuracion, **entonces** se delega a EPICA-C0 (topic, broker, payload mapping).
- **Dado** que el MQTT esta configurado y el sensor publica, **cuando** ejecuto el modelo, **entonces** el objeto Result recibe el valor publicado en lugar de evaluar una firma local.
- **Dado** que no hay conexion MQTT disponible, **cuando** ejecuto: comportamiento pendiente (fallback, error, advertencia).
- **Dado** que el proceso tiene categoria MQTT, **cuando** miro la elipse: **no hay decoracion visual distintiva** (§9 convencion — solo la firma `( )` es visible).

**Reglas y restricciones:**
- La seleccion de categoria en HU-B1.008 incluye MQTT como una de las 8 opciones.
- La integracion real (broker, topic, subscribe) se especifica en EPICA-C0.
- No hay decoracion visual que distinga MQTT de Predefined en la elipse (brecha §9 fuente).
- El circulo abierto en habilitadores (HU-B1.012) podria cambiar: §11 Q1 abierta.

**Modelo de datos tocado:**
- `proceso.categoria` — `"MQTT"` — persistente.
- Configuracion MQTT especifica: delegada a EPICA-C0.

**Dependencias:**
- Bloqueada por: HU-B1.006, HU-B1.008.
- Delega a: EPICA-C0 (runtime MQTT completo).
- Relaciona: HU-B1.012 (indicador punto-lectura).

**Integraciones:**
- EPICA-C0 runtime-mqtt.
- Renderizador (sin cambio visible en categoria).
- Motor de simulacion: reemplaza evaluacion local por lectura de topic.

**Notas de evidencia:**
- Fuente normativa: —.
- Fuente OPCloud: §2.1 grid 3x3, §7 integraciones, §9 convenciones, §11 Q1.
- Fotogramas: frame_14 (categoria MQTT visible en grid).
- Clase de afirmacion: observado (seleccion) + delegado (mecanica completa).
- Etiqueta: `requires-clarification` (fallback, decoracion, round-trip con sensor).

**Prioridad:** W (fuera de alcance del nucleo modelador; depende de infraestructura MQTT externa).
**Tamano:** L.
**Etiquetas:** [simulacion-computacional, runtime, mqtt, integracion-externa, delegacion-epicas, requires-clarification].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **QB1.1**: ¿El circulo abierto sobre el enlace habilitador aparece tambien cuando la categoria es `External`, `ROS` o `MQTT`, o solo con `Predefined`/`User Defined`? (§11 Q1 fuente). Afecta HU-B1.012, HU-B1.027.
- **QB1.2**: ¿Hay operaciones `Predefined` distintas a `Adding`? — menu no desplegado en fotogramas muestreados (§11 Q2 fuente). Afecta HU-B1.009.
- **QB1.3**: Comportamiento del valor entre corridas: ¿se resetea a `value` al salir de modo simulacion o persiste el ultimo numero? Frame 41 sugiere persistencia pero no observado ciclo completo (§11 Q3 fuente). Afecta HU-B1.002, HU-B1.014, HU-B1.024.
- **QB1.4**: ¿Hay sombreado del proceso `Calculating` durante ejecucion sync/async? En fotogramas observados NO se aprecia, contrasta con simulacion conceptual (§11 Q4 fuente). Afecta HU-B1.024.
- **QB1.5**: Estructura exacta del archivo XLSX exportado: columnas por objeto simulado vs objeto resultado, uso de nombre vs alias en cabeceras (§11 Q5 fuente). Afecta HU-B1.025.
- **QB1.6**: Textual Value sobre un objeto de entrada de firma numerica (`Adding`): ¿coercion a NaN, error modal, error silente? (§11 Q6 fuente). Afecta HU-B1.009, HU-B1.019.
- **QB1.7**: Simulacion simultanea de proceso y sus objetos de entrada: precedencia, narrador sugiere "disregard values in input objects and do its own calculation" pero no observado explicitamente (§11 Q7 fuente). Afecta HU-B1.023.
- **QB1.8**: Parametros especificos por distribucion: ¿Normal muestra `media`/`desviacion` en lugar de Min/Max? ¿Bernoulli muestra `p`? No observado explicitamente. Afecta HU-B1.018.
- **QB1.9**: Unicidad de alias entre objetos computacionales dentro del mismo modelo: no hay validacion observada en HU-B1.004.
- **QB1.10**: Comportamiento de reversion del indicador `computational` en objeto con `valueState` poblado: ¿se preserva `currentValue` o se descarta? Afecta HU-B1.001.
- **QB1.11**: Corchetes vacios `[]` generan advertencia o pasan silentes? Observado pase silente (brecha C-01 fuente). Afecta HU-B1.003.
- **QB1.12**: Hipotesis sobre `Python` y `SQL` como subespecializaciones de `External`/`User Defined`: no verificado en backend. Afecta HU-B1.008 y futuras fichas pendientes de esos tipos.

## Referencias cruzadas

- **Doc fuente**: `opcloud-reverse/b1-simulation-computational.md` (25KB, 284 lineas, 15 fotogramas muestreados).
- **Doc hermano**: `opcloud-reverse/b0-simulation-conceptual.md` (barra de simulacion base, play/stop, sync vs async, modo edicion vs modo simulacion).
- **Fuente normativa**: `opm-iso-19450-es.md`, `opm-visual-es.md`, `opm-opl-es.md`.
- **Evidencia OPCloud**: `JOYAS.md`, `sandbox-data/`, `assets/svg/`, `decompiled/`.
- **Epicas que extienden esta**:
  - **EPICA-B2** `b2-simulation-user-functions.md` — categoria `User Defined` con editor de expresion (linterizador, manejo de errores, funciones matematicas/logicas/string incorporadas, referencia a otros objetos via alias).
  - **EPICA-B3** `b3-simulation-range-validation.md` — validacion de rangos sobre valores computados.
  - **EPICA-B4** `b4-simulation-conditions-loops.md` — logica condicional y bucles en la simulacion.
  - **EPICA-B5** `b5-simulation-user-input.md` — entrada runtime de usuario durante ejecucion.
  - **EPICA-C0** `c0-runtime-mqtt.md` — runtime MQTT completo para HU-B1.027.
  - **EPICA-C1** `c1-runtime-urls.md` — runtime URL (categoria `External`).
  - **EPICA-C2** `c2-runtime-ros.md` — runtime ROS (categoria `ROS`).
  - **EPICA-A2** `a2-extension-generative-ai.md` — categoria `Gen AI`.
- **Epicas de las que depende**:
  - **EPICA-10** — creacion de cosas (objeto, proceso).
  - **EPICA-11** — enlaces Instrument y Result (modelado basico).
  - **EPICA-13** — estados (el rectangulo-value reutiliza primitiva de estado).
  - **EPICA-B0** — barra de simulacion, modo simulacion vs edicion, sync/async base.
  - **EPICA-50** — panel OPL (HU-B1.026 extiende plantilla).
- **Invariantes del repositorio**:
  - `src/nucleo/tipos.ts`: ampliacion de objeto (indicador `computational`, `unidad`, `alias`, `valueState`) y proceso (indicador `computational`, `categoria`, `operacionPredefinida`, `sufijoFirma`). Requiere validacion contra principio de presion multiple (≥2 dominios) antes de tocar nucleo — **presion ya presente**: simulacion B0/B1/B2/B3/B4/B5 + runtime C0/C1/C2 + Gen AI A2.
  - `src/nucleo/validacion/`: nuevas reglas — enlace Instrument con punto-lectura requiere ambos extremos computacionales; enlace Result de proceso a objeto requiere objeto computacional.
  - `src/render/jointjs/`: fabricas extendidas para estado-value interno, segunda linea alias, sufijo ``, circulo abierto en enlace.
  - `src/render/opl-renderer.ts`: plantilla de cuatro campos con omisiones condicionales.
  - Nuevo subsistema: `src/runtime/simulacion/` (no existe aun) con motor determinista (sync) + estocastico (async) + sorteo probabilistico + export XLSX.
- **SSOT OPM**: `ssot/opm-visual-es.md` — el circulo abierto (HU-B1.012) es extension del lenguaje visual NO oficial en la SSOT actual. Documentar decision en ADR antes de implementar.
- **Brechas documentadas (`adv-03`)**:
  - §C-01: corchetes vacios sin advertencia (HU-B1.003).
  - §C-09: categoria del proceso sin decoracion diferencial (HU-B1.008, HU-B1.010).
  - §C-11: plantilla OPL de cuatro campos no en base (HU-B1.026).
