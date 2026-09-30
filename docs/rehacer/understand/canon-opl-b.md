# Dossier normativo — spec-forja-opl-es v1.4.1, tramo B (líneas 1425–2196)

Fuente: `canon/spec-forja-opl-es/content.md`, líneas 1425–2196 leídas completas (§8 a §17). Para el contexto de IDs se hojearon las líneas 1–200, y para cotejar se consultaron §3.1 (TS1), §5.0–§5.2 (R-MOD-INPUT, E\*, C\*), §2.7/§2.8 (R-ENT-3) y §7.2/§7.7 (plegado, R-CX-COMP).

Leyenda de CONSECUENCIA PARA LA HERRAMIENTA:
- **impedir**: la herramienta bloquea la construcción (en OPD, OPL o importación).
- **advertir**: la herramienta diagnostica sin bloquear.
- **generar OPL**: obliga al generador (modelo → texto).
- **parsear OPL**: obliga al parser (texto → mutaciones).
- **renderizar**: obliga a la presentación del panel OPL (display).
- **operación**: operación de modelo o de UI que hay que soportar.
- **modelo de datos**: exige una estructura de datos.
- **solo método**: disciplina del modelador humano.
- **no aplica**: no obliga a la herramienta.

La obligación aparece tal como la expresa el canon (DEBE / NO DEBE / DEBERÍA / PUEDE). Cuando el canon la expresa de forma declarativa ("es inválida", "se realiza"), se marca **inferido**.

---

## §8 Combinatoria a nivel de modelo

Espacio combinatorio (textual):

```
rol (consumo | resultado | efecto | agente | instrumento)
  × modificador de control (evento | condición | excepción | ninguno)
  × multiplicidad / cardinalidad (?, *, 1..1, +)
  × abanico (XOR | OR | AND)
  × probabilidad (Pr=p)
  × ruta (por ruta L)
```

"No todas las celdas son válidas. Esta sección fija qué combinaciones son **válidas**, cuáles **inválidas** (error de categoría o de asimetría), y cuáles **no-canonizadas** (silencio de la SSOT)." La fuerza semántica de colisión y la matriz de precedencia de recomposición se delegan a `reglas §6.5`/`§6.6`.

### §8.0 Reglas duras de combinación

| ID | Enunciado | Obligación | Consecuencia |
|---|---|---|---|
| R-COMB-1 | Una combinación NO listada como válida ni como inválida en §8 DEBE clasificarse como **no-canonizada**. La generación NO DEBE emitirla, el parser NO DEBE construirla y NO DEBE inventarse primitiva, verbo ni glifo para llenar el silencio. | DEBE / NO DEBE | impedir (lista blanca de combinaciones en generación y parseo) |
| R-COMB-2 | INPUT-only se conserva bajo combinación: todo modificador `e`/`c` sobre un extremo Post(P) (resultante, afectado post-transición) es **inválido**, sea cual sea el abanico, la multiplicidad, la probabilidad o la ruta. | inferido (NO DEBE) | impedir |
| R-COMB-3 | Un enlace base PUEDE portar **a lo sumo un** modificador de control. `c` + `e` sobre el mismo enlace es no-canonizado. Excepción y `e`/`c` no coexisten en un enlace, porque la excepción es una familia autónoma proceso→proceso. | PUEDE (a lo sumo uno) / inferido NO DEBE (c+e) | modelo de datos (modificador escalar: `ninguno`/`e`/`c`) + impedir |
| R-COMB-4 | Orden superficial estable, textual: `[Por ruta L,] <abanico con cuantificador> <enlace base> [en \`estado\`] [, modificador de evento/condición] [\`Pr=p\`]`. "La ruta precede; la probabilidad cierra. Un orden distinto rompe el roundtrip." | DEBE | generar OPL + parsear OPL (ver contradicciones G1, G2) |
| R-COMB-5 | La ruta gana al agrupamiento de abanico: si **algún** enlace del abanico porta ruta, el abanico NO DEBE agruparse en una oración y DEBE emitirse **una oración por enlace** con prefijo `Por ruta L,`. Ruta y agrupamiento de fan se excluyen en la superficie. | NO DEBE / DEBE | generar OPL |
| R-COMB-6 | La multiplicidad anota un extremo de enlace: no es modificador de control ni altera el rol. PUEDE combinarse con cualquier rol, abanico o modificador admisible, y NO DEBE aplicarse directamente a un *proceso* (R-MULT-1A). | PUEDE / NO DEBE | modelo de datos (multiplicidad por extremo) + impedir (sobre proceso) |

### §8.1 Abanicos lógicos XOR / OR / AND — FAN-XOR, FAN-OR, FAN-AND

Naturaleza: "un abanico agrupa `n ≥ 2` enlaces del **mismo rol** que comparten un puerto convergente o divergente. El operador fija cuántas ramas se activan: **AND** (todas), **XOR** (exactamente una), **OR** (al menos una)." Obligación inferida (DEBE: n ≥ 2, mismo rol, puerto común). Consecuencia: modelo de datos + impedir.

Tabla textual:

| Operador | Marcador OPL | Activación |
| --- | --- | --- |
| AND | (implícito) — una oración por enlace, sin cuantificador | todas las ramas |
| XOR | `exactamente uno de` | exactamente una rama |
| OR | `al menos uno de` | al menos una rama |

| ID | Enunciado | Obligación | Consecuencia |
|---|---|---|---|
| R-FAN-1 | El AND no lleva marcador léxico: se emite **una oración base por enlace** (varias oraciones T1/T2/T3/H\* con el mismo puerto). NO DEBE inventarse `todos de`. Correcto: `*Cocinar* consume **Agua**.` seguido de `*Cocinar* consume **Sal**.` Incorrecto: `*Cocinar* consume todos de **Agua** y **Sal**.` | NO DEBE / inferido DEBE | generar OPL + parsear OPL (el AND no se reconstruye desde el texto: ver G11) |
| R-FAN-2 | El cuantificador va en el extremo del fan. En convergente (N→1) precede la lista de orígenes; en divergente (1→N), la de destinos. | inferido DEBE | generar OPL + parsear OPL |
| R-FAN-3 | Abanico × condición: si TODOS los enlaces portan `c` **del mismo rol**, se usa el patrón condicional sobre la oración de fan (no C\* por rama). Un abanico mixto NO DEBE usar el patrón condicional y recae en la oración de fan directa. | inferido DEBE / NO DEBE | generar OPL + parsear OPL (ver G5, G6) |
| R-FAN-4 | Abanico de **efecto** × evento, con objeto común y procesos alternativos: `**B** inicia exactamente uno de *P*, *Q* o *R*, y es afectado por el proceso que ocurre.` NO DEBE emitirse `**B** ... afecta ... procesos` ni `que afecta el proceso que ocurre`. El evento sobre fan es INPUT-only y NO DEBE aplicarse a un fan de resultado. | DEBE (inferido, plantilla) / NO DEBE | generar OPL + parsear OPL + impedir (evento en fan de resultado) |
| R-FAN-5 | Cada rama PUEDE portar estado especificado propio. Si todas las ramas de un fan de consumo/resultado/efecto difieren solo por el `estado` de un mismo objeto, el fan se realiza como cambio de estado agrupado: `*P* cambia **Obj** a exactamente uno de \`s1\`, \`s2\` o \`s3\`.` (resultado/efecto saliente) o `*P* cambia **Obj** de exactamente uno de \`s1\`, \`s2\`.` (consumo/efecto entrante). | PUEDE / inferido DEBE | generar OPL + parsear OPL (ver G7) |
| R-FAN-5A | Fan XOR/OR de n ≥ 2 enlaces TS3 compactos con el mismo *proceso*, **objeto**, estado de entrada y operador, sin modificador/ruta/probabilidad diferenciadora y con salidas distintas: DEBE realizarse `*P* cambia **Obj** de \`entrada\` a exactamente uno de \`s1\`, \`s2\` o \`s3\`.` (XOR), o con `a al menos uno de` (OR). La entrada común NO DEBE suprimirse. Si varían entrada y salida a la vez, la forma no aplica y la generación DEBE **fallar cerrado** antes de declarar equivalencia de fact-set. Correcto: `*Corregir Desajuste* cambia **Grado de Cobertura Asistencial Efectiva** de \`insuficiente\` a exactamente uno de \`suficiente\` o \`insuficiente\`.` Incorrecto: la misma sin `de \`insuficiente\`` (pierde la entrada común). | DEBE / NO DEBE | generar OPL + impedir (fallo cerrado) |
| R-FAN-5B | El parser de R-FAN-5A DEBE reconstruir un TS3 por salida, repetir la entrada común en cada enlace y crear **un único** abanico con las n ramas y el operador original. El roundtrip se decide por igualdad del fact-set `{proceso, objeto, entrada, salidas, enlaces TS3, operador, membresía del fan}`, no por texto ni por deduplicación de entidad. | DEBE | parsear OPL (verificación por fact-set) |
| R-FAN-6 | `Pr=p` SOLO es canónico **dentro de un abanico probabilístico**, que DEBE ser XOR, con exactamente una rama activa por ejecución y probabilidades que suman `1.0`. `Pr=p` sobre un enlace sin abanico es no-canonizado. | DEBE / SOLO (NO DEBE fuera) | impedir (Pr sin fan o en fan OR/AND) + advertir/impedir (suma ≠ 1.0) + generar OPL (ver G4) |
| R-FAN-7 | Un resultado simple hacia un **objeto** con n estados equivale semánticamente a un fan XOR de resultados con estado (uno por estado, `1/n` por defecto). Esa equivalencia NO autoriza `e`/`c` sobre el fan. | inferido / NO DEBE | no aplica (semántica); el NO DEBE ya queda cubierto por R-COMB-2 |
| R-FAN-8 | Para f > 2, el modelador PUEDE generalizar a `exactamente m de f` / `al menos m de f` con m < f, anotando m junto al arco. Es una extensión declarada, no una primitiva nueva (GAP-FAN-M: sin generador). | PUEDE | opcional; una herramienta simple lo omite |

Ejemplos normativos de R-FAN-2 (textuales):
- Correcto (consumo convergente XOR): `*Procesar* consume exactamente uno de **A**, **B** o **C**.`
- Correcto (resultado divergente OR): `*Procesar* genera al menos uno de **A**, **B** o **C**.`
- Correcto (efecto con objeto común y procesos alternativos): `**B** es afectado por exactamente uno de *P*, *Q* o *R*.`
- Incorrecto: `**B** afecta a exactamente uno de los procesos *P*, *Q* o *R*.`

Ejemplo normativo de R-FAN-3: `*Procesar* ocurre si exactamente uno de **A**, **B** o **C** existe, en cuyo caso *Procesar* consume exactamente uno de **A**, **B** o **C**, de lo contrario *Procesar* se omite.`

### §8.2 Multiplicidad en combinación — MULT-COMB

Plantillas, textuales: "`?` → `un/una opcional`; `*` → `opcional (cero o más)`; `1..1` → sin marcador (default); `+` → `al menos un/una`. Rangos `qmín..qmáx`; intervalos `[a..b]`, `(a..b]`, `[a..b)`, `(a..b)`; listas `[1..10], [20..30]`; `*` como extremo abierto."

| ID | Enunciado | Obligación | Consecuencia |
|---|---|---|---|
| R-MULT-COMB-1 | La multiplicidad anota un **extremo** (origen o destino) y concuerda en número con el verbo cuando fuerza plural (`*Procesos* generan **Objeto**`). PUEDE coexistir con cualquier rol y con su modificador admisible. | PUEDE / inferido DEBE (concordancia) | generar OPL (ver G9) |
| R-MULT-COMB-2 | En un abanico, la multiplicidad se realiza rama por rama en su extremo. La multiplicidad del fan no sustituye al cuantificador XOR/OR: cuántas ramas y cuántas instancias por rama son dimensiones ortogonales. | inferido DEBE | modelo de datos (multiplicidad por extremo de cada rama) + generar OPL |
| R-MULT-COMB-3 | Los nombres de parámetros de multiplicidad DEBEN ser únicos en todo el modelo. La repetición secuencial de un *proceso* NO DEBE expresarse con multiplicidad sobre el proceso (usar proceso recurrente + contador), ni tampoco la paralela (usar subprocesos síncronos/asíncronos). | DEBE / NO DEBE | impedir (unicidad; multiplicidad en proceso) + solo método (recurrencia/paralelismo) |

### §8.3 Matriz de combinaciones relevantes

Estatus declarado ∈ {válida, inválida, no-canonizada}. Tabla textual, normativa: define la lista blanca y la lista negra de R-COMB-1.

| # | Combinación (rol × modificador × abanico × otros) | Estatus | Plantilla OPL compuesta | Resolución / regla |
| --- | --- | --- | --- | --- |
| C-01 | consumo × evento × — | válida | `**A** inicia *P*, que consume **A**.` | A∈Pre(P); §5.1 |
| C-02 | consumo × condición × — | válida | `*P* ocurre si **A** existe, en cuyo caso **A** se consume, de lo contrario *P* se omite.` | §5.2 |
| C-03 | resultado × evento × — | **inválida** | — | R-COMB-2; Post(P) no admite `e` (GAP-EVENTO-RESULTADO) |
| C-04 | resultado × condición × — | **inválida** | — | R-COMB-2; Post(P) no admite `c` (GAP-CONDICION-RESULTADO) |
| C-05 | efecto × evento × — (objeto con estado) | válida | `**A** inicia *P*, que afecta **A**.` | afectado∈Pre(P); ET2 |
| C-06 | efecto × condición × — | válida | `*P* ocurre si **A** existe, en cuyo caso *P* afecta **A**, de lo contrario *P* se omite.` | CT2 |
| C-07 | agente × evento × — | válida | `**Agente** inicia y maneja *P*.` | EH1; agente solo humano |
| C-08 | agente × condición × — | válida | `**Agente** maneja *P* si **Agente** existe, de lo contrario *P* se omite.` | CH1 |
| C-09 | instrumento × evento × — | válida | `**Instrumento** inicia *P*, que requiere **Instrumento**.` | EH2 |
| C-10 | instrumento × condición × — | válida | `*P* ocurre si **Instrumento** existe, de lo contrario *P* se omite.` | CH2 |
| C-11 | consumo × — × XOR (convergente) | válida | `*P* consume exactamente uno de **A**, **B** o **C**.` | R-FAN-2 |
| C-12 | consumo × — × OR (convergente) | válida | `*P* consume al menos uno de **A**, **B** o **C**.` | R-FAN-2 |
| C-13 | resultado × — × XOR (divergente) | válida | `*P* genera exactamente uno de **A**, **B** o **C**.` | R-FAN-2 |
| C-14 | efecto × — × XOR/OR | válida | `*P* afecta exactamente uno de **A**, **B** o **C**.` | R-FAN-2 |
| C-15 | agente × — × XOR | válida | `**Agente** maneja exactamente uno de *P*, *Q* o *R*.` | R-FAN-2 |
| C-16 | instrumento × — × XOR (divergente) | válida | `Exactamente uno de *P*, *Q* o *R* requiere **B**.` | R-FAN-2 |
| C-17 | invocación × — × XOR/OR | válida | `*P* invoca exactamente uno de *Q* o *R*.` | R-FAN-2; invocación es proceso→proceso |
| C-18 | consumo/efecto/instr × condición × XOR/OR (todas las ramas `c`, mismo tipo) | válida | `*P* ocurre si exactamente uno de **A**, **B** o **C** existe, en cuyo caso *P* consume exactamente uno de **A**, **B** o **C**, de lo contrario *P* se omite.` | R-FAN-3; abanico mixto recae en fan directo |
| C-19 | efecto × evento × XOR/OR (objeto común, procesos alternativos, INPUT-only) | válida / implementada | `**B** inicia exactamente uno de *P*, *Q* o *R*, y es afectado por el proceso que ocurre.` | R-FAN-4; `abanico.ts` + `parser.test` |
| C-19b | otros transformadores/habilitadores × evento × XOR/OR (INPUT-only) | válida (canon) / GAP código | plantilla específica por rol | R-FAN-4; GAP-FAN-EVENTO |
| C-20 | resultado × condición × XOR/OR | **inválida** | — | R-COMB-2; GAP-FAN-RESULTADO-COND cerrado: `abanico.ts` degrada a fan base sin `puede generarse` |
| C-21 | consumo/resultado/efecto × — × XOR (ramas = estados de un objeto) | válida | `*P* cambia **Obj** a exactamente uno de \`s1\`, \`s2\` o \`s3\`.` | R-FAN-5; R-FAN-7 |
| C-21b | efecto TS3 × — × XOR/OR (entrada común; ramas = salidas distintas del mismo objeto) | válida | `*P* cambia **Obj** de \`s0\` a exactamente uno de \`s1\`, \`s2\` o \`s3\`.` | R-FAN-5A; R-FAN-5B |
| C-22 | resultado × — × XOR × probabilidad (fan probabilístico) | válida | `*P* genera exactamente uno de **A** \`Pr=0.6\`, **B** \`Pr=0.4\`.` | R-FAN-6; suma=1; GAP-PROB-SUPERFICIE cerrado |
| C-23 | cualquier rol × — × — × probabilidad (sin fan) | **no-canonizada** | — | R-FAN-6; `reglas §11.2` (probabilístico fuera de fan sin canonicidad) |
| C-24 | consumo/resultado × modificador/abanico/multiplicidad × **ruta** | válida | `Por ruta L1, *P* consume **A**.` | R-COMB-5; una oración por enlace, ruta degrada el fan |
| C-25 | agente/instrumento × — × ruta | **canónica-condicionada** | (no emitida por producto) | `reglas §4.12` R-OPL-RUTA-3 (canónica por `A.5`; OPFORJA restringe la emisión a consumo/resultado como extensión declarada de producto) |
| C-26 | cualquier enlace × `c` + `e` (mismo enlace) | **no-canonizada** | — | R-COMB-3; §8.4 |
| C-27 | estructural × `e`/`c` | **inválida** | — | error de categoría (R-MOD-CAT-1, AP-09) |
| C-28 | invocación × `e`/`c` | **inválida** | — | error de categoría (R-MOD-CAT-1, AP-10); usar nodo de decisión booleano |
| C-29 | enlace escindido TS4/TS5 × `e`/`c` | **inválida** | — | R-MOD-CAT-2 (`V-41`, `V-110`) |
| C-30 | colisión de rol — dos enlaces procedimentales objeto↔mismo proceso | resolución | (prevalece el de mayor fuerza) | R-FUERZA-1..4 (`reglas §6.5`; §8.3.1) |
| C-31 | recomposición — dos subprocesos, distinto rol hacia el mismo objeto | resolución | (matriz de precedencia) | R-PREC-1..5 (`reglas §6.6`; §8.3.1) |

Consecuencia por fila:
- **Válidas** (C-01, C-02, C-05–C-18, C-19, C-21, C-21b, C-22, C-24): generar y parsear OPL con la plantilla indicada.
- **Inválidas** (C-03, C-04, C-20, C-27, C-28, C-29): impedir en OPD, OPL e importación. C-20 y los GAP-EVENTO/CONDICION-RESULTADO dicen que el código "degrada" a la base; una herramienta simple debe impedir la combinación en origen.
- **No-canonizadas** (C-23, C-26): impedir, o bien declarar extensión local marcada (R-ZNC-COMB-1).
- C-25: el canon admite `Por ruta` sobre agente/instrumento. La herramienta PUEDE restringir la emisión, pero debe declarar la restricción como decisión de producto.
- C-30 y C-31: operación de modelo (kernel), no de la capa OPL.

#### §8.3.1 Colisión de rol y precedencia de recomposición (delegación)

Textual: "R-FUERZA-1..4: orden de 12 niveles, `consumo = resultado > efecto > agente > instrumento`, con `evento > sin control > condición` dentro de cada clase" y "R-PREC-1..5: matriz 3×3 de recomposición; Resultado+Resultado y Consumo+Consumo inválidos; transformador prevalece sobre habilitador". La spec NO re-legisla ni acuña IDs paralelos. La capa OPL "solo refleja el resultado ya resuelto por el kernel" y **no tiene obligación** de emitir un reporte narrativo de colisión o precedencia.

- Obligación: NO DEBE re-legislar (documental). Para la herramienta: la resolución es una operación de modelo cuya ley está en el dossier de `reglas §6.5/§6.6`. La OPL NO necesita un reporte de colisión.

### §8.4 Zonas no-canonizadas explícitas

Textual: "la generación NO DEBE emitirlas, el parser NO DEBE construirlas, y NUNCA DEBE inventarse primitiva para llenarlas."

| Zona no-canonizada | Estado | Fundamento |
| --- | --- | --- |
| `c` + `e` sobre el **mismo** enlace | No definida en gramática OPL ni en geometría visual | `reglas §6.4`, `§11.2` (AP-28); R-COMB-3 |
| `Pr=p` sobre un enlace **sin** abanico | `Pr=p` solo se define dentro de fans XOR (`V-18`); fuera no tiene canonicidad | `reglas §11.2`; R-FAN-6 |
| Fan de **resultado** bajo condición (`puede generarse`) | Histórico cerrado: el código degrada a fan base y ya no emite `puede generarse`; la combinación sigue inválida por R-COMB-2 | C-20; viola R-COMB-2 |
| Fan **mixto** (algunas ramas `c`, otras sin control) bajo patrón condicional | El canon no define la realización condicional de un fan parcialmente condicional | R-FAN-3 (recae en fan directo, no en patrón condicional) |

| ID | Enunciado | Obligación | Consecuencia |
|---|---|---|---|
| R-ZNC-COMB-1 | Ante una zona no-canonizada, la herramienta DEBE rechazar la entrada como no-canónica o declararla **extensión local marcada**. NO DEBE silenciarla emitiendo una superficie inventada como si fuera canon. | DEBE / NO DEBE | impedir (lo más simple: rechazar) |

### §8.5 GAPs de cobertura — combinatoria (estado del producto v0)

- GAP-FAN-EVENTO: parcial. Solo existe el caso efecto objeto común ↔ procesos alternativos.
- GAP-FAN-RESULTADO-COND: cerrado (degradación a fan base; `puede generarse` retirado).
- GAP-PROB-SUPERFICIE: cerrado (`Pr=p` emitido; el parser lo "trata como anotación de superficie y preserva el hecho base").
- GAP-FAN-M: sin generador para m-de-f.
- GAP-COL-RESOLUCION: cerrado por ajuste-spec (la resolución vive en el kernel).

Consecuencia: no aplica como requisito. Son estado del código anterior, útiles solo como mapa de riesgos.

---

## §9 Composición de oraciones y prosa OPL

Principio (textual): "La composición es una transformación de superficie: fusiona el **texto**, NUNCA el **mapeo a modelo**. Cada hecho coordinado conserva su `ref` y su sub-span."

### §9.0 Regla maestra

| ID | Enunciado | Obligación | Consecuencia |
|---|---|---|---|
| R-COMP-MAESTRA-1 | Una oración compuesta DEBE ser **UNA línea con N sub-spans**, y cada hecho conserva su `ref` y su `hint`. La composición opera a nivel de token y NUNCA DEBE producir una fusión opaca. | DEBE / NUNCA DEBE | modelo de datos (línea = texto + tokens con ref) + generar OPL |
| R-COMP-MAESTRA-2 | `refs` de la línea = **unión** sin duplicados por `tipo:id` de los refs de los hechos. `hints` = un sub-span por hecho (verbo, objeto, estado). NO DEBE quedar un hecho sin `ref` ni `hint`. | DEBE / NO DEBE | modelo de datos + generar OPL |
| R-COMP-MAESTRA-3 | Hover, filtrado, navegación y clasificación de edición DEBEN resolver al **hecho individual**. Clic/hover sobre un sub-span devuelve la `ref` de ese sub-span, no la primera de la línea. | DEBE | renderizar + operación (interacción) |

Ejemplo normativo: Correcto: `*Cocinar* consume **Agua**, genera **Sopa** y requiere **Olla**.` con refs = { enlace-consumo, enlace-resultado, enlace-instrumento, *Cocinar*, **Agua**, **Sopa**, **Olla** } y un sub-span por verbo y por objeto. Incorrecto: la misma línea con un único token y `refs = []` (fusión opaca).

### §9.1 Ejes de coordinación (tabla textual)

| Eje | Patrón | Plantilla |
| --- | --- | --- |
| (a) sujeto compartido / predicado coordinado | un *proceso* sujeto, varios predicados procedimentales | `*P* consume **A**, genera **B** y requiere **C**.` |
| (b) predicado compartido / destino enumerado | un sujeto y verbo, varios destinos | `**A** exhibe **B**, **C** y **D**.` |
| (c) sujeto coordinado | varios sujetos, un predicado (solo si canónico) | `**A** y **B** consumen **C**.` |
| (d) condicional / temporal / causal | coordinación donde el canon lo soporte | `*P* ocurre si **A** existe, en cuyo caso *P* consume **A**, de lo contrario *P* se omite.` |
| (e) operadores lógicos XOR / OR | abanico — remite §8.1 | `*P* consume exactamente uno de **A**, **B** o **C**.` |

| ID | Enunciado | Obligación | Consecuencia |
|---|---|---|---|
| R-COMP-EJE-1 | Coordinación serial es-CL: coma entre los primeros miembros y `y`/`o` antes del último, **sin coma de Oxford**. La alternancia `e`/`u` depende de la fonética del término siguiente. Correcto: `*P* consume **A**, genera **B** y requiere **C**.` Incorrecto: `*P* consume **A**, genera **B**, y requiere **C**.` | DEBE | generar OPL + parsear OPL (aceptar `e`/`u`) |
| R-COMP-EJE-2 | Eje (a): oraciones procedimentales con el mismo *proceso* sujeto PUEDEN coordinarse en una línea, repitiendo el verbo por hecho. Cada par verbo+complemento conserva su sub-span y su ref. | PUEDE | opcional (GAP-COMPOSICION); una herramienta simple lo omite |
| R-COMP-EJE-3 | Eje (b): una relación estructural con un exhibidor/todo/general y varios destinos del mismo tipo DEBE coordinar los destinos tras un solo verbo, con una ref de enlace por destino. Correcto: `**Auto** consta de **Motor**, **Chasis** y **Rueda**.` | DEBE | generar OPL + parsear OPL (descomponer la lista) |
| R-COMP-EJE-4 | Eje (c): la coordinación de sujetos SOLO PUEDE emitirse cuando el canon define el plural concordado (multiplicidad / fan divergente de habilitador). Fuera de eso, NO DEBE coordinarse el sujeto. | PUEDE (restringido) / NO DEBE | generar OPL (por defecto, atómico) |
| R-COMP-EJE-5 | Eje (e): XOR/OR no se canoniza en §9 sino en §8.1. §9 NO DEBE duplicar ni redefinir el cuantificador. | NO DEBE | no aplica (documental) |

### §9.2 Elegibilidad

| ID | Enunciado | Obligación | Consecuencia |
|---|---|---|---|
| R-COMP-ELEG-1 | Solo PUEDEN coordinarse hechos que comparten **exactamente un** eje. Mezclar ejes en una línea NO DEBE realizarse. | PUEDE / NO DEBE | generar OPL |
| R-COMP-ELEG-2 | El eje (a) NUNCA DEBE coordinar consumo con resultado **sobre el mismo objeto**, ni mezclar la clasificación (esencia/afiliación) con oraciones de enlace. Transformador + habilitador bajo el mismo sujeto-proceso SÍ PUEDE. Esencia y afiliación entre sí SÍ se coordinan (R-ENT-3). | NUNCA DEBE / PUEDE | generar OPL |
| R-COMP-ELEG-3 | El orden de los hechos coordinados DEBE ser determinista y estable entre emisiones. DEBERÍA seguir la fuerza semántica (consumo, resultado, efecto, agente, instrumento) en el eje (a) y el orden de modelo de los destinos en el eje (b). | DEBE / DEBERÍA | generar OPL (orden estable; modelo de datos con orden de partes) |
| R-COMP-ELEG-4 | Una coordinación es elegible SOLO si la línea admite un sub-span por hecho sin solapamiento ambiguo. Si dos hechos producen el mismo texto de span sin ancla de posición, la coordinación NO DEBE hacerse y los hechos DEBEN emitirse atómicos. | NO DEBE / DEBE | generar OPL |

### §9.3 Zonas prohibidas

| ID | Enunciado | Obligación | Consecuencia |
|---|---|---|---|
| R-COMP-ZP-1 | NO DEBE fusionarse en plural los enlaces de los refinadores en contexto de refinamiento/despliegue. La detección de candidatos NO DEBE activarse sobre enlaces de un OPD hijo de refinamiento. Correcto: `**Auto** es un **Vehículo**.` + `**Camión** es un **Vehículo**.`, que COEXISTEN con la oración de despliegue `**Auto** y **Camión** son **Vehículo**.` Incorrecto: la fusión **en reemplazo** de la emisión atómica. | NO DEBE | generar OPL |
| R-COMP-ZP-2 | Toda coordinación que no cumpla R-COMP-MAESTRA-1/2/3 está prohibida, sea cual sea el eje. | inferido NO DEBE | generar OPL |
| R-COMP-ZP-3 | NO DEBE emitirse una oración compuesta que el parser no pueda descomponer en sus hechos atómicos. | NO DEBE | generar OPL (solo formas con reverse) |

### §9.4 Reverse / roundtrip

| ID | Enunciado | Obligación | Consecuencia |
|---|---|---|---|
| R-COMP-REV-1 | El parser DEBE descomponer una oración compuesta en sus hechos atómicos (un enlace/relación por sub-span coordinado) y producir el **mismo conjunto de mutaciones** que las oraciones atómicas equivalentes. | DEBE | parsear OPL |
| R-COMP-REV-2 | Invariante, textual: "**componer → parsear = identidad sobre el conjunto de hechos**. Sea `F = {f1, …, fn}` el conjunto de hechos atómicos; `parsear(componer(F)) = F` como conjunto (no necesariamente como orden de líneas)." | DEBE (invariante) | parsear OPL + prueba de roundtrip por fact-set |

### §9.5 Display vs canónico

| ID | Enunciado | Obligación | Consecuencia |
|---|---|---|---|
| R-COMP-CFG-1 | Prosa atómica vs compuesta es una **opción de presentación**. NO DEBE alterar el texto canónico, y ambas formas DEBEN parsear al mismo conjunto de hechos. | NO DEBE / DEBE | renderizar (si existe la opción) |
| R-COMP-CFG-2 | El contrato display-vs-canónico es el mismo del resto de la spec: la presentación PUEDE reordenar/coordinar y la equivalencia se evalúa sobre la forma canónica. NO DEBE haber un canon paralelo. | DEBE / PUEDE / NO DEBE | renderizar |

### §9.6 GAPs

- GAP-COMPOSICION: el eje (a) no existe (capacidad nueva).
- GAP-COMP-GUARDA: cuando exista el eje (a), DEBE descartar candidatos de un OPD hijo de refinamiento y fusiones que violen R-COMP-ELEG-4. Obligación condicional, que no aplica si no se implementa el eje (a).
- GAP-COMP-REVERSE: sin descomposición de predicados coordinados, el eje (a) NO DEBE emitirse (R-COMP-ZP-3).

Consecuencia para una herramienta simple: **mantener la salida atómica**, con los ejes (b) y (e) canónicos y (d) como plantilla atómica propia. Así, R-COMP-EJE-2, GAP-COMP-GUARDA y GAP-COMP-REVERSE quedan vacíos por construcción.

---

## §10 Multiplicidad y cardinalidad

Principio: "La multiplicidad es un modificador de superficie que cuantifica una participación; NUNCA es una cosa ni un enlace propio."

### §10.1 Tabla canónica (textual)

| Símbolo | Rango | Cardinalidad | Realización OPL-ES |
| --- | --- | --- | --- |
| `?` | `0..1` | opcional, a lo sumo uno | `un/una opcional` |
| `*` | `0..*` | opcional, cero o más | `opcional (cero o más)` |
| (sin símbolo) | `1..1` | exactamente uno (default) | (sin marca; emisión implícita) |
| `+` | `1..*` | obligatorio, uno o más | `al menos un/una` |

| ID | Enunciado | Obligación | Consecuencia |
|---|---|---|---|
| R-MULT-1 | La multiplicidad DEBE aplicarse SOLO a enlaces etiquetados, agregación-participación y enlaces procedimentales. La emisión DEBE anteponer la frase de cardinalidad al sustantivo, concordando género. Correcto: `*Cocinar* requiere al menos una **Olla**.` Incorrecto: `*Cocinar* requiere 1..* **Olla**.` (símbolo crudo). | DEBE | impedir (multiplicidad en otros estructurales) + generar OPL + parsear OPL |
| R-MULT-1A | La multiplicidad NO DEBE aplicarse directamente a un *proceso*. | NO DEBE | impedir |
| R-MULT-1B | La repetición secuencial de un proceso NO DEBE expresarse como multiplicidad; DEBE modelarse como proceso recurrente + **contador**. | NO DEBE / DEBE | impedir (multiplicidad en proceso) + solo método |
| R-MULT-1C | La repetición paralela NO DEBE expresarse como multiplicidad; DEBE modelarse con subprocesos síncronos/asíncronos. | NO DEBE / DEBE | solo método |
| R-MULT-2 | Los nombres de parámetros de multiplicidad DEBEN ser únicos en el modelo, y dos participaciones NO DEBEN compartir un parámetro nombrado. | DEBE / NO DEBE | impedir o advertir (solo si se soportan parámetros; ver G13) |

### §10.2 Rangos, intervalos, restricciones

| ID | Enunciado | Obligación | Consecuencia |
|---|---|---|---|
| §10.2-a | Rangos `qmín..qmáx`. Intervalos en las cuatro formas `[a..b]`, `(a..b]`, `[a..b)`, `(a..b)`. Listas separadas por coma: `[1..10],[20..30]`. Extremo abierto `*`. | DEBE | modelo de datos + generar/parsear (sin plantilla OPL en prosa: G12) |
| §10.2-b | La EBNF de restricción de cardinalidad DEBE usar los operadores ASCII `=`, `<`, `>`, `<=`, `>=` y `en {conjunto}`. | DEBE | parsear OPL |
| R-MULT-3 | Los glifos `≠`, `≤`, `≥`, `∈` son visualización y DEBEN normalizarse a ASCII (`<>`/`!=`, `<=`, `>=`, `en {…}`) en el texto canónico, o declararse extensión de producto. El texto que alimenta al parser NO DEBE contener glifos sin normalizar. | DEBE / NO DEBE | parsear OPL (normalizar a la entrada) + generar OPL canónico en ASCII |

### §10.3 Ficha (textual)

| Campo | Valor |
| --- | --- |
| ID | `R-MULT-1`–`R-MULT-3`, `R-MULT-1A/1B/1C` |
| Plantilla | `<frase-cardinalidad> <sustantivo>` antepuesta al destino del enlace |
| Tokenización | la frase de cardinalidad DEBE ser un sub-span propio, distinto del sub-span del objeto |
| Orden | la cardinalidad precede al sustantivo; sin coma de Oxford en listas (remite §9.1 R-COMP-EJE-1) |
| Composabilidad | combina con rol/abanico vía §8.2 |
| Reverse | el parser DEBE reconstruir el rango desde la frase de cardinalidad y normalizar Unicode a ASCII |
| Roundtrip | `parsear(emitir(rango)) = rango` sobre el rango normalizado |

Consecuencias: la tokenización exige un sub-span propio de cardinalidad (renderizar/interacción), el parser DEBE reconstruir el rango, y el roundtrip del rango es invariante.

---

## §11 Etiquetas de ruta

Plantillas (textual):

| Plantilla |
| --- |
| `Por ruta etiqueta, *Proceso* consume **Objeto**.` |
| `Por ruta etiqueta, *Proceso* genera **Objeto**.` |

| ID | Enunciado | Obligación | Consecuencia |
|---|---|---|---|
| R-OPL-RUTA-1 | `Por ruta` es una expresión fija: NO DEBE flexionarse ni sustituirse (`por la ruta`, `vía ruta`). Correcto: `Por ruta rápida, *Cocinar* consume **Agua**.` Incorrecto: `Por la ruta rápida, *Cocinar* consume **Agua**.` | DEBE / NO DEBE | generar OPL + parsear OPL (ancla léxica) |
| R-OPL-RUTA-2 | La `etiqueta` DEBE ser un nombre definido por el modelador y NO DEBE ser un literal genérico ni autogenerado. Es referencia a una ruta nombrada del modelo. | DEBE / NO DEBE | modelo de datos (ruta nombrada) + impedir (autogenerar etiquetas) |
| R-OPL-RUTA-3 | Por `A.5`, `Por ruta` PUEDE prefijar **cualquier** oración procedimental. Limitarlo a consumo/resultado es una extensión declarada de producto, no un límite del canon, y un agente conforme NO DEBE presentar esa restricción como canon. | PUEDE / NO DEBE | generar/parsear OPL; si se restringe, declararlo |

Ficha (textual): Plantilla `Por ruta <etiqueta>, <oración procedimental>`. Emisión: "el prefijo `Por ruta <etiqueta>,` precede a la oración procedimental, con coma de separación". Tokenización: "`Por ruta` = token fijo; `<etiqueta>` = sub-span con `ref` a la ruta nombrada". Reverse: "el parser DEBE detectar el prefijo `Por ruta <etiqueta>,` y asociar la etiqueta de ruta al enlace resultante". Roundtrip: "la etiqueta DEBE preservarse: `parsear(emitir(ruta)) = ruta`". EBNF de §18 (cotejo): `oracion_de_ruta = "Por ruta ", cadena_etiqueta, ", ", oracion_procedimental ;`

---

## §12 Plegado y despliegue de OPL (display)

"El plegado es **display**: NUNCA altera el texto canónico que alimenta parser y roundtrip."

| ID | Enunciado | Obligación | Consecuencia |
|---|---|---|---|
| R-OPL-DISP-1 | La OPL completa DEBE agrupar las oraciones **por OPD**, en bloques ordenados según el orden de los OPDs del modelo. | DEBE | generar OPL + renderizar |
| R-OPL-DISP-2 | El orden de los OPDs en la OPL completa DEBE ser determinista y estable entre emisiones. | DEBE | generar OPL |
| R-OPL-DISP-3 | En un OPD ascendente DEBEN suprimirse los hechos **refinados** en OPDs descendientes, y su realización DEBE quedar **plegada** (hecho agregado, no expandido). | DEBE | generar OPL por OPD + renderizar (ver G15) |
| R-OPL-DISP-4 | El plegado parcial es presentación: NO DEBE alterar el texto canónico, y las formas plegada y expandida DEBEN parsear al mismo conjunto de hechos. Incorrecto: "el plegado descarta enlaces del conjunto de hechos recuperado por el parser". | NO DEBE / DEBE | renderizar + parsear OPL (invariante `parsear(plegada) = parsear(expandida)`) |

---

## §13 Presentación del panel OPL

Dos pases, textual: "el **pase canónico** (`textoOplActual`, siempre con `VISIBILIDAD_OPL_DEFAULT`) y el **pase display** (`lineas`), que aplica las preferencias de presentación."

| ID | Enunciado | Obligación | Consecuencia |
|---|---|---|---|
| R-OPL-PANEL-1 | El panel DEBE presentar las oraciones agrupadas por OPD, en orden jerárquico de OPDs, determinista y estable. | DEBE | renderizar |
| R-OPL-PANEL-2 | Cada bloque DEBE llevar el rótulo del OPD que lo origina y preservar su profundidad jerárquica para el sangrado. El rótulo DEBE derivar de `opdId`/`opdNombre`/`opdProfundidad` de cada línea. | DEBE | renderizar + modelo de datos (línea con metadatos de OPD) |
| R-OPL-PANEL-3 | El panel DEBE ofrecer un conmutador de numeración on/off. La numeración es display y NO DEBE alterar el canónico ni el fact-set. Incorrecto: el número se incrusta en `textoOplActual`. | DEBE / NO DEBE | renderizar (evidencia OPCloud: ver S3) |
| R-OPL-PANEL-4 | El panel DEBE renderizar la forma plegada de los hechos refinados en OPDs ascendentes, sin alterar el canónico. | DEBE | renderizar |
| R-OPL-PANEL-5 | El panel DEBE respetar la preferencia de visibilidad de esencia (`siempre` / `solo-difiere` / `oculta`, §16) sin afectar el canónico. | DEBE | renderizar |
| R-OPL-PANEL-6 | El panel DEBE poder minimizarse. Minimizado, DEBERÍA detener el renderizado de las oraciones, y restaurarlo DEBE recuperar la presentación íntegra sin pérdida de hechos. NO DEBE alterar el fact-set. | DEBE / DEBERÍA / NO DEBE | operación de UI (evidencia OPCloud: ver S3) |

Ficha: Reverse, textual: "ningún ajuste de presentación (numeración, plegado, esencia, minimizado) altera el conjunto de hechos parseado".

---

## §14 Interacción OPL↔OPD

| ID | Enunciado | Obligación | Consecuencia |
|---|---|---|---|
| R-OPL-INT-1 | Cada línea interactiva DEBE descomponerse en **tokens**. Cada token portador de un elemento DEBE llevar una **referencia** discriminada por tipo: `entidad`, `enlace` o `estado`. Los tokens sin referencia DEBEN tener rol `texto` (roles: `texto`/`nombre`/`verbo`/`estado`). | DEBE | modelo de datos (línea = tokens con ref tipada) |
| R-OPL-INT-2 | Las referencias de una línea DEBEN ser únicas por par `tipo:id`, y la deduplicación DEBE preservar el orden de primera aparición. | DEBE | modelo de datos |
| R-OPL-INT-3 | El hover DEBE ser bidireccional: hover en el canvas resalta las líneas cuyas refs tocan el elemento, y hover en una línea resalta en el canvas los elementos referidos. Incorrecto: resaltar por coincidencia textual en vez de por referencia tipada. | DEBE | renderizar + operación (UI) |
| R-OPL-INT-4 | El clic sobre un token con referencia DEBE navegar al elemento en el canvas (foco/selección) y NO DEBE mutar el modelo. La edición inline (doble clic) es otro canal. | DEBE / NO DEBE | operación (UI) |
| R-OPL-INT-5 | El panel DEBE poder **filtrar** sus líneas a las que tocan la referencia activa (selección). Sin referencia activa, DEBE devolver todas. La selección de enlace tiene precedencia sobre la de entidad. | DEBE | operación (UI) + renderizar |
| R-OPL-INT-6 | En una oración compuesta, hover/clic sobre un token DEBE seleccionar el enlace de ese sub-span, no todos los enlaces de la oración. Mecánica de la traza: token→`enlace` directo, o token→`entidad`, que toma "la referencia de enlace **inmediatamente previa** en `linea.refs`". | DEBE | operación (UI) + modelo de datos |

Ficha: Reverse, textual: "la interacción es navegación/resaltado; NUNCA muta el conjunto de hechos (la edición inline es canal aparte)".

---

## §15 Edición de OPL

El canal reverse va de clasificar (sin mutar) a aplicar los patches aprobados. La edición NO DEBE confundirse con la navegación de §14.

### §15.1 Clasificación

R-OPL-EDIT-1: cada línea del editor libre DEBE clasificarse en exactamente uno de cuatro estados (`EstadoLineaOpl`). Obligación: DEBE. Consecuencia: parsear OPL + renderizar (vista previa por línea). Tabla textual:

| Estado | Condición canónica | Acción |
| --- | --- | --- |
| `ignorada-vacia` | la línea es solo whitespace tras `trim` | se descarta; NO produce patch ni diagnóstico |
| `aplicable` | la línea tiene ≥1 patch propuesto | se ofrece para aplicar; `cambioId` apunta al primer patch; `descripcionCambio` lo resume |
| `no-aplicable` | sin patches y con diagnóstico `severidad=error` | se bloquea con una `RazonNoAplicable` canónica |
| `sin-cambio` | sin patches y sin error (parseada, consistente con el modelo, o warning/info) | se reconoce pero NO muta |

Orden de precedencia (DEBE respetarse): vacía → aplicable → error → sin-cambio.

R-OPL-EDIT-2: el conteo `ResumenClasificacion` (`total`, `aplicables`, `noAplicables`, `ignoradas`, `sinCambio`) DEBE ser estable y derivarse línea a línea. El botón DEBE rotularse `Aplicar N cambio(s)` si `aplicables>0` y `Sin cambios aplicables` si `aplicables<=0`. Obligación: DEBE. Consecuencia: renderizar.

### §15.2 Razones de no-aplicabilidad

R-OPL-EDIT-3: la razón de `no-aplicable` DEBE salir del enum cerrado `RazonNoAplicable`, que NO DEBE crecer sin canonizar el diagnóstico. Obligación: DEBE / NO DEBE. Consecuencia: parsear OPL + advertir (mensajes). Tabla textual:

| `RazonNoAplicable` | Texto visible | Cita SSOT | Diagnóstico origen |
| --- | --- | --- | --- |
| `forma-no-reconocida` | Forma OPL no reconocida | OPL-ES D1-D8, T1-T3 | `syntax-error` (sin marca de punto), default |
| `entidad-no-existe` | La entidad referida no existe en el modelo | Glos 3.55, 3.69 | `unknown-symbol` |
| `referencia-ambigua` | Más de una entidad con ese nombre | V-201 unicidad | `ambiguous-symbol` |
| `enlace-invalido-firma` | Firma de enlace inválida | V-180+ | `type-mismatch` |
| `conflicto-patches` | Cambios incompatibles sobre el mismo hecho | — | `patch-conflict` |
| `inversa-no-soportada` | Edición inversa no soportada / las líneas ausentes no borran hechos | — | `unsupported-kernel`, `no-delete-by-absence` |
| `puntuacion-faltante` | La oración OPL-ES debe terminar en punto | OPL-ES sintaxis | `syntax-error` con mensaje de punto |
| `cambio-ya-presente` | Este cambio ya está aplicado al modelo | — | (línea consistente sin patch ⇒ ver §15.1 `sin-cambio`) |

R-OPL-EDIT-4: una línea **ausente** NO DEBE borrar un hecho. La ausencia es `no-delete-by-absence` (info) y, si escala a error, `inversa-no-soportada`. Rationale: la edición reverse es aditiva/mutadora explícita, no diferencial. Obligación: NO DEBE. Consecuencia: parsear OPL; el borrado desde OPL no existe (ver G21).

### §15.3 Mapeo edición → mutación

R-OPL-EDIT-5: cada patch `aplicable` DEBE mapearse a la mutación de modelo, aplicada en tres fases ordenadas: (1) patches no-enlace, (2) patches de enlace, (3) abanicos. El orden DEBE respetarse. Obligación: DEBE. Consecuencia: operación. Tabla textual:

| `PatchOplPropuesto.tipo` | Operación de modelo | Descripción (`describirPatch`) |
| --- | --- | --- |
| `crear-entidad` | `crearObjeto` / `crearProceso` (+ `cambiarEsencia`/`cambiarAfiliacion` si la dimensión fue declarada) | `crear <tipo> <nombre>` |
| `renombrar-entidad` | `renombrarEntidad` | `renombrar A -> B` |
| `cambiar-esencia` | `cambiarEsencia` | `esencia A -> B` |
| `cambiar-afiliacion` | `cambiarAfiliacion` | `afiliacion A -> B` |
| `sincronizar-estados` | `sincronizarEstados` (crea/renombra estados) | `sincronizar estados (...)` |
| `renombrar-estado` | `renombrarEstado` | `estado A -> B` |
| `aplicar-designacion-estado` | `designarInicial`/`Final`/`Default`/`Current` | `designar estado X como D` |
| `crear-enlace` | `crearEnlace` (+ modificador/tiempos de excepción) | `crear enlace <tipo>` |
| `fijar-etiqueta-enlace` | `renombrarEtiquetaEnlace` | `etiqueta enlace -> X` |
| `crear-abanico` | `formarAbanico` (XOR/OR sobre ramas) | `crear abanico <op> (N ramas)` |

Rationale relevante: la edición OPL y la inline comparten las operaciones del kernel, así que la edición OPL "no abre mutaciones fuera del kernel". En la práctica: una sola API de mutación, usada por OPD y por OPL.

R-OPL-EDIT-6: la creación de enlace DEBE ser **idempotente**. Si ya existe la tripla (tipo, origen, destino), se reusa para aplicar modificador/tiempos en vez de duplicar. Obligación: DEBE. Consecuencia: operación.

### §15.4 Inline vs bloqueado

R-OPL-EDIT-7: el canal inline DEBE limitarse a un enum cerrado de cuatro intenciones, y cada una DEBE validar que el id exista antes de mutar. Obligación: DEBE / NO DEBE. Consecuencia: operación (UI) + impedir. Tabla textual:

| `IntencionEdicionOpl.tipo` | Mutación | Editable inline |
| --- | --- | --- |
| `renombrar-entidad` | `renombrarEntidad` | sí (nombre de objeto/proceso) |
| `renombrar-estado` | `renombrarEstado` | sí (nombre de estado) |
| `fijar-etiqueta-enlace` | `renombrarEtiquetaEnlace` | sí (etiqueta de enlace) |
| `abrir-inspector-enlace` | ninguna (señal al store) | no muta; delega al inspector |

"Toda mutación inline más rica que un renombrado/etiquetado (cambiar tipo de enlace, esencia, designaciones, abanicos) DEBE bloquearse en el canal inline y derivarse al editor libre por patches (§15.1–§15.3) o al inspector. `abrir-inspector-enlace` NO DEBE mutar el modelo".

### §15.5 Propiedades de enlace

R-OPL-EDIT-8: la edición de etiqueta, condición/excepción, modificador y tiempos (máximo/mínimo) DEBE pasar por las operaciones validadas (`renombrarEtiquetaEnlace`; `aplicarModificador`, que exige enlace procedural; `definirTiempoExcepcionEnlace`, que exige enlace de excepción temporal). NO DEBE escribir esos atributos por fuera de ellas. Obligación: DEBE / NO DEBE. Consecuencia: operación + impedir.

### §15.6 Oraciones compuestas

R-OPL-EDIT-9: editar una oración compuesta DEBE descomponerse en **mutación por hecho**: cada sub-span editado mapea al patch de su hecho y solo mutan los hechos cuyos sub-spans cambiaron. Incorrecto: una edición en cualquier parte reescribe todos los hechos. Obligación: DEBE. Consecuencia: parsear OPL + operación.

Edge cases de la ficha (textual): "idempotencia de enlace; dimensión de clasificación escindida conserva default; ausencia no-delete".

---

## §16 Configuración/opciones que afectan OPL

Principio: las opciones afectan **solo el display** y NO DEBEN alterar el texto canónico.

| ID | Enunciado | Obligación | Consecuencia |
|---|---|---|---|
| R-OPL-CFG-1 | La visibilidad de esencia DEBE ofrecer **exactamente tres** modos (`EsenciaVisibilidad`), con default `siempre`, y el default DEBE ser `VISIBILIDAD_OPL_DEFAULT = { esencia: "siempre" }`. | DEBE | renderizar + operación (preferencia) |
| R-OPL-CFG-2 | Ningún modo DEBE alterar el canónico, que DEBE generarse con la esencia que el hecho posee, independiente del display. Correcto: con `esencia: "oculta"`, el panel muestra `*Cocinar* consume **Ingrediente**.` y el canónico conserva la marca de esencia. Incorrecto: omitirla también del canónico. | NO DEBE / DEBE | generar OPL (canónico completo) + renderizar |
| R-OPL-CFG-3 | El modo de prosa (atómica / compuesta) DEBE ser opción de display y NO DEBE introducir un canon paralelo. | DEBE / NO DEBE | renderizar (solo si existe el modo compuesto) |
| R-OPL-CFG-4 | La numeración DEBE ser display y NO DEBE alterar el canónico ni el orden de hechos del parser. | DEBE / NO DEBE | renderizar |

Tabla textual de modos:

| Modo | Conducta de display |
| --- | --- |
| `siempre` (default) | la esencia (físico/informacional) se anota en toda frase donde aplique |
| `solo-difiere` | la esencia se anota solo cuando difiere del default del tipo |
| `oculta` | la esencia nunca se anota en el display |

Invariante (textual, ficha): "display-vs-canónico: ninguna opción altera el texto que alimenta parser/roundtrip". "cualquier opción futura de presentación DEBE heredarlo".

---

## §17 Modos de fallo, validación y ambigüedad

Contrato cerrado: "no hay error sin código ni código sin razón".

| ID | Enunciado | Obligación | Consecuencia |
|---|---|---|---|
| R-OPL-FALLO-1 | El parser DEBE reportar diagnósticos tipados con `codigo`, `severidad` (`error`/`warning`/`info`) y `linea`. Solo `error` bloquea la línea; `warning`/`info` NO DEBEN bloquear. | DEBE / NO DEBE | parsear OPL + advertir |
| R-OPL-FALLO-2 | La aplicación de patches DEBE ser **fail-fast por cadena**: ante el primer fallo de una operación de modelo, se aborta y se retorna error, sin aplicar patches posteriores. | DEBE | operación (aplicación transaccional recomendada: G22) |
| R-OPL-FALLO-3 | Una forma no reconocida DEBE producir `forma-no-reconocida`. Una oración válida sin punto final DEBE producir `puntuacion-faltante`. | DEBE | parsear OPL |
| R-OPL-FALLO-4 | Una referencia que coincide con más de una entidad DEBE producir `referencia-ambigua`, y el operador DEBE desambiguar por código de entidad. La línea se **rechaza** y NO se aplica a una entidad arbitraria. | DEBE / NO DEBE | parsear OPL + impedir |
| R-OPL-FALLO-5 | Una entidad inexistente DEBE producir `entidad-no-existe` y una firma de enlace inválida DEBE producir `enlace-invalido-firma`. Ambas se rechazan. | DEBE | parsear OPL + impedir (ver G23) |
| R-OPL-FALLO-6 | Dos patches incompatibles sobre el mismo hecho DEBEN producir `conflicto-patches` y rechazarse, no aplicarse en orden arbitrario. | DEBE | parsear OPL + impedir |
| R-OPL-FALLO-7 | El editor DEBE soportar **partial-parse**: un documento con líneas mezcladas NO DEBE bloquearse en bloque. | DEBE / NO DEBE | parsear OPL + renderizar |
| R-OPL-FALLO-8 | Una inversa no soportada DEBE producir `inversa-no-soportada`, y la ausencia de una línea DEBE producir `no-delete-by-absence` (info). NUNCA se borran hechos por omisión. | DEBE / NUNCA | parsear OPL |

Tabla de partial-parse (textual):

| Clase de línea | Tratamiento |
| --- | --- |
| `aplicable` | se aplica (sujeto a fail-fast de §17.1 al materializar) |
| `no-aplicable` | se rechaza con `RazonNoAplicable`; no muta |
| `sin-cambio` | se suspende: parseada, sin mutación |
| `ignorada-vacia` | se suspende: descartada silenciosamente |

Ficha: Rechaza = forma-no-reconocida, puntuacion-faltante, referencia-ambigua, entidad-no-existe, enlace-invalido-firma, conflicto-patches, inversa-no-soportada. Suspende = sin-cambio, ignorada-vacia (sin error).

---

## (a) Sobreingeniería o elementos circunstanciales en este tramo

- **S1 — Traza a código del producto v0.** Todo el tramo nombra archivos, funciones y hasta líneas de `deep-opm-pro` (`abanico.ts` líneas 17/34/76/89–94/145–190/192–229/244–254; `procedural.ts·sufijoProbabilidad`; `panel.ts·derivarPanelOpl`; `interaccion.ts·referenciaEnlaceEspecifico`; `refsUnicasPorTipoId`; `clasificadorEdicion.ts`; `aplicar.ts`; `edicionCanvas.ts`; `opciones.ts`). Impone la forma de la implementación anterior. Para una herramienta rehecha solo cuenta la conducta, no los nombres.
- **S2 — Estado de GAPs del código anterior.** §8.5, §9.6 y las menciones a GAP-EVENTO-RESULTADO, GAP-PROB-SUPERFICIE, BUG-f897bc, la solicitud upstream `deep-opm-pro/docs/solicitudes-upstream/_archivo/2026-07-21-abanico-ts3-entrada-comun.md` y la "degradación" de combinaciones inválidas son historia del producto v0, no requisitos. En particular, "degradar" una combinación inválida a la base es parche de código heredado: lo simple es impedirla en origen.
- **S3 — Evidencia OPCloud elevada a DEBE.** La numeración on/off (R-OPL-PANEL-3), minimizar el panel y detener el render (R-OPL-PANEL-6), y la redacción del hover y del doble clic sobre oración compuesta (R-OPL-INT-3/6) se apoyan en "videos OPCloud". Son conveniencias de UI, circunstanciales.
- **S4 — Maquinaria de edición por patches (§15).** Pide cuatro estados de línea con precedencia, un `ResumenClasificacion` de cinco contadores, rótulos de botón literales, 10 tipos de patch aplicados en 3 fases, un enum de 8 razones y un canal inline separado con 4 intenciones y señal al store. El núcleo irreductible es menor: parsear → previsualizar por línea (aplica / error con razón / sin cambio) → aplicar de forma atómica y aditiva, sin borrado por ausencia, con creación de enlace idempotente.
- **S5 — Dos pases, canónico y display, con tres modos de esencia (§13/§16).** R-OPL-CFG-1 exige "exactamente tres modos" de visibilidad de esencia. Es un DEBE del canon, pero resulta sobreingeniería para una herramienta mínima. Si no hay opciones de display, el pase display coincide con el canónico y todo el aparato de §13.4/§16 se reduce a una constante.
- **S6 — Composición eje (a) (§9, GAP-COMPOSICION/GUARDA/REVERSE).** Es PUEDE y capacidad nueva de alto costo (segmentación del parser, guardas de refinamiento, desambiguación posicional). Una herramienta simple emite atómico y cumple §9 por vacuidad, salvo los ejes (b) y (e), que ya son canónicos.
- **S7 — m-de-f (R-FAN-8).** Es PUEDE y extensión declarada; se omite.
- **S8 — Parámetros de multiplicidad con nombre (R-MULT-2), intervalos abiertos/cerrados, listas de rangos y restricciones con operadores (§10.2).** Son DEBE para quien los soporte, pero exceden a una herramienta simple. La tabla `? * + 1..1` basta para casi todo modelo. El canon no da plantilla OPL en prosa para intervalos, listas ni restricciones (G12).
- **S9 — Restricción de producto de rutas a consumo/resultado (C-25, R-OPL-RUTA-3).** Es decisión circunstancial de OPFORJA v0. Una herramienta simple puede admitir `Por ruta` sobre toda oración procedimental (canon `A.5`), lo que elimina la excepción.
- **S10 — Colisión de rol de 12 niveles y precedencia de recomposición (§8.3.1).** Viven en `reglas §6.5/§6.6`, y la capa OPL queda eximida de reportarlas.
- **S11 — Heurística de sub-span (R-OPL-INT-6).** "ref de enlace inmediatamente previa" es un detalle de implementación. Lo esencial: cada token con ref a entidad dentro de una oración de enlace debe saber a qué enlace pertenece (hint por hecho).
- **S12 — Ejemplo con nombre de dominio real.** "Grado de Cobertura Asistencial Efectiva" (R-FAN-5A) es circunstancial al origen de la solicitud.

## (b) GAPs y contradicciones internas

- **G1 — R-COMB-4 no coincide con las plantillas reales de E\* y C\*.** Ubica el modificador de evento/condición como sufijo `[, modificador de evento/condición]`, pero las plantillas de §5.1/§5.2 y C-01/C-02 son envolventes: el evento va como prefijo sujeto (`**A** inicia *P*, que consume **A**.`) y la condición como marco (`*P* ocurre si … en cuyo caso … de lo contrario *P* se omite.`).
- **G2 — R-COMB-4 contra R-COMB-5 y C-22.** R-COMB-4 pone `[Por ruta L,]` y `<abanico con cuantificador>` en la misma oración, mientras R-COMB-5 declara ruta y agrupamiento de fan mutuamente excluyentes. Además, R-COMB-4 dice "la probabilidad cierra" (sufijo final), pero C-22 coloca `Pr=p` tras **cada rama**: `**A** \`Pr=0.6\`, **B** \`Pr=0.4\``.
- **G3 — Conector serial ausente.** C-22 (`**A** \`Pr=0.6\`, **B** \`Pr=0.4\`.`) y la variante entrante de R-FAN-5 (`de exactamente uno de \`s1\`, \`s2\`.`) omiten `o` antes del último miembro, contra R-COMP-EJE-1.
- **G4 — La probabilidad se pierde en el reverse.** Según §8.5 y §8.1 (R-FAN-6), el parser "descarta" o "trata como anotación de superficie" `Pr=p` y "preserva el hecho base". Si `Pr` es un hecho del modelo (suma = 1.0, R-FAN-6), su pérdida en el parseo rompe `parsear(emitir(F)) = F` (R-COMP-REV-2) e impide validar la suma desde OPL. El canon no dice si `Pr` es hecho o solo display.
- **G5 — C-18/R-FAN-3 contra R-COND-RAMA-2.** La rama positiva del fan condicional de consumo usa voz activa (`en cuyo caso *P* consume exactamente uno de …`), mientras R-COND-RAMA-2 (§5.2) exige pasiva refleja para el consumo (`**Objeto** se consume`). Además C-18 declara válidos efecto e instrumento condicionales en fan sin dar su plantilla. Para el instrumento, CH2 no tiene rama positiva, así que la forma queda indeterminada.
- **G6 — Fan mixto y C-19b pierden hechos o no tienen plantilla.** El fan mixto (algunas ramas `c`) "recae en la oración de fan directa", de modo que el `c` de esas ramas no se expresa en OPL y el roundtrip lo pierde. C-19b está marcada "válida (canon)" pero con "plantilla específica por rol" no definida: por R-COMB-1 la herramienta no puede emitirla, aunque sea válida.
- **G7 — R-FAN-5 ambiguo en reverse.** Realizar con `cambia` un fan de **resultado** con estados (`*P* cambia **Obj** a exactamente uno de …`) borra la distinción entre creación (TS2) y cambio (TS3/TS5). Realizar así un fan de **consumo** en estado (`cambia **Obj** de exactamente uno de …`) lo confunde con TS4. El parser no puede decidir el rol original y R-FAN-5 no fija una inversa (sí la tiene R-FAN-5A/5B).
- **G8 — Verbo pasivo fuera del enum cerrado.** R-FAN-2 y R-FAN-4 exigen `es afectado por`, que no figura en el enum de §1.1 ("NO DEBE emitir un verbo o cópula fuera de esta sección").
- **G9 — Plural de proceso contra R-MULT-1A.** R-MULT-COMB-1 ejemplifica `*Procesos* generan **Objeto**` (y §3.1 `*Proceso* consumen **Objetos**`), lo que sugiere multiplicidad o plural en el lado del proceso, mientras R-MULT-1A prohíbe la multiplicidad sobre proceso. No se define qué extremo fuerza el plural del verbo.
- **G10 — R-MULT-1 contra RF2o.** R-MULT-1 limita la multiplicidad a etiquetados, agregación y procedimentales, lo que excluye la exhibición, pero §1.1 canoniza `tiene un … opcional` (multiplicidad `?` sobre exhibición, extensión §6.2 RF2o). Tampoco se dice si generalización o clasificación la admiten (implícitamente no).
- **G11 — AND y abanico en reverse.** El AND se emite como N oraciones sueltas sin marcador (R-FAN-1). El texto no distingue "fan AND con puerto común" de "N enlaces independientes", así que el parser no puede reconstruir la membresía de un fan AND. El canon no dice si el AND es un objeto de modelo o simple ausencia de fan.
- **G12 — Rangos sin plantilla en prosa.** §10.2 exige escribir `qmín..qmáx`, intervalos y listas, pero R-MULT-1 declara incorrecto el símbolo crudo en superficie (`requiere 1..* **Olla**`). No hay plantilla OPL para `2..5`, `[1..10],[20..30]` ni restricciones. Además, `opcional (cero o más)` antepuesto (`requiere opcional (cero o más) **Olla**`) no tiene ejemplo ni regla de número (singular/plural).
- **G13 — R-MULT-2 sin modelo de datos.** Los "parámetros de multiplicidad" no se definen en el tramo (ni sintaxis ni plantilla).
- **G14 — Normalización de `≠` fuera de la lista ASCII.** R-MULT-3 normaliza `≠` a `<>`/`!=`, que no están en la lista ASCII de §10.2 (`=`, `<`, `>`, `<=`, `>=`). Dos formas alternativas hacen además no determinista el canónico.
- **G15 — Referencia a ruta fuera del coproducto.** §11 da a `<etiqueta>` una `ref` a la ruta nombrada, pero R-OPL-INT-1 cierra las referencias a `entidad | enlace | estado`. Falta el tipo `ruta`. Tampoco se dice si el parser debe aceptar `Por ruta` sobre agente/instrumento (canon) aunque el producto no lo emita, ni cómo se prefija una oración condicional o de evento. Además, se llama "extensión declarada" a lo que es una **restricción**.
- **G16 — Plegado: supresión contra equivalencia.** R-OPL-DISP-3 suprime en el OPD ascendente los hechos refinados, pero R-OPL-DISP-4 exige que plegada y expandida "parseen al mismo conjunto de hechos". Un bloque plegado por sí solo no puede recuperar lo suprimido; solo la OPL completa del modelo lo hace. Tampoco se define la "forma plegada" (¿`al menos otro/a` de §7.2? ¿`se pliega en` de CX5/CX6, sin generador por GAP-PLIEGA?).
- **G17 — Precedencia de la evidencia OPCloud.** §13, §14 y §15 citan "videos OPCloud — precedencia 3", pero la §Precedencia de fuentes pone a OPCloud en el nivel 5 ("no canonizan por sí solos"; el nivel 3 es spec-forja-opd-es). Aun así, R-OPL-PANEL-3/6 son DEBE solo con esa evidencia.
- **G18 — Visibilidad de afiliación sin control propio.** §16 define la visibilidad solo para esencia (`{ esencia: "siempre" }`), pero §2.7/§2.8 aplican `siempre`/`solo-difiere` también a la afiliación, sin control propio. El ejemplo de R-OPL-CFG-2 sugiere que la esencia aparece dentro de la oración de enlace (`*Cocinar* consume **Ingrediente**.`), cuando R-ENT-3 la coloca en una oración de clasificación separada. "Default del tipo" se define fuera del tramo (informacional/sistémica).
- **G19 — Valor muerto `cambio-ya-presente`.** Está en `RazonNoAplicable` (razón de no-aplicable), pero §15.1 clasifica la línea consistente sin patch como `sin-cambio`, no como no-aplicable. Es un valor inalcanzable o contradictorio.
- **G20 — "Suspender" con dos sentidos.** La introducción de §17 define suspensión como "queda parcialmente aplicado o pendiente de desambiguación", pero R-OPL-FALLO-4 **rechaza** la ambigüedad y §17.4 llama "suspende" a `sin-cambio`/`ignorada-vacia` (inertes).
- **G21 — Ausencia no borra: OPL solo aditiva.** R-OPL-EDIT-4/R-OPL-FALLO-8 impiden borrar hechos desde OPL, así que el borrado solo existe en OPD/inspector. Hay una asimetría bimodal declarada, y no se define cuándo `no-delete-by-absence` "escala a error".
- **G22 — Partial-parse contra fail-fast.** Si un patch de una línea aplicable falla al materializar, R-OPL-FALLO-2 aborta los posteriores, incluidos los de otras líneas válidas. No se dice si los anteriores se revierten (atomicidad): lo más seguro es aplicar todo o nada sobre un modelo inmutable.
- **G23 — Desambiguación y creación de entidades.** R-OPL-FALLO-4 pide desambiguar "por código de entidad", pero el tramo no define sintaxis OPL para ese código, y V-201 (unicidad de nombres) debería impedir la ambigüedad. R-OPL-FALLO-5 rechaza entidad inexistente, pero §15.3 incluye `crear-entidad`: no se precisa cuándo un nombre desconocido crea entidad y cuándo es `entidad-no-existe`.
- **G24 — ¿El modo atómico parte las listas del eje (b)?** R-COMP-EJE-3 obliga (DEBE) a coordinar destinos estructurales tras un verbo, mientras R-COMP-CFG-1 hace de atómica/compuesta una opción de display. No se define si el "modo atómico" parte `consta de A, B y C`.
- **G25 — Estatus fuera del enum.** §8.3 declara estatus ∈ {válida, inválida, no-canonizada}, pero la tabla usa "válida / implementada", "válida (canon) / GAP código", "canónica-condicionada" y "resolución".
- **G26 — Referencia cruzada rota.** GAP-FAN-M cita "C-30 sentido m-de-f", pero C-30 es colisión de rol.
- **G27 — Errata.** R-COMP-ELEG-4 dice "solापamiento" (caracteres devanagari).
- **G28 — Edición compuesta sin compuestas de eje (a).** R-OPL-EDIT-9 regula la edición de oraciones compuestas, pero hoy solo existen compuestas de eje (b) y abanicos (el eje a no existe). Queda por definir qué significa "sub-span editado" en el texto libre del editor, donde el usuario reescribe la línea entera.

## Síntesis: núcleo mínimo exigido por el tramo

1. **Lista blanca de combinaciones (§8.3).** Impedir C-03, C-04, C-20, C-23, C-26, C-27, C-28 y C-29. Modificador escalar por enlace. Multiplicidad por extremo y nunca sobre proceso. `Pr` solo en fan XOR con suma 1.0.
2. **Plantillas de fan.** `exactamente uno de` / `al menos uno de`; AND = oraciones sueltas; efecto con objeto común en pasiva; fan de estados, con entrada común en TS3 (R-FAN-5A/5B); ruta ⇒ una oración por enlace.
3. **Línea OPL = texto + tokens con referencia tipada** (entidad/enlace/estado, más ruta por G15). Un hint por hecho y refs únicas en orden de aparición.
4. **Emisión atómica, más listas estructurales (eje b) y abanicos (eje e).** Conector serial es-CL sin coma de Oxford, con `e`/`u`. Orden determinista.
5. **Multiplicidad** `?`/`*`/`+`/`1..1` en prosa, con cardinalidad como sub-span propio, reverse del rango y normalización ASCII.
6. **`Por ruta <etiqueta>,`** fijo, con etiqueta definida por el modelador, preservada en el roundtrip.
7. **OPL por OPD** en bloques rotulados, orden jerárquico estable y hechos refinados plegados en el OPD padre.
8. **Panel:** hover bidireccional por referencia, clic que navega sin mutar, filtro por selección y resolución por sub-span. Numeración y minimizar exigidos con respaldo solo OPCloud.
9. **Editor OPL:** clasificación por línea (vacía / aplicable / error con razón cerrada / sin cambio), partial-parse, aplicación fail-fast (idealmente atómica), creación de enlace idempotente, sin borrado por ausencia e inline limitado a renombrar entidad o estado y etiquetar enlace.
10. **Invariante rector:** ninguna opción de display (numeración, plegado, esencia, prosa) altera el texto canónico ni el fact-set. `parsear(componer(F)) = F`.
