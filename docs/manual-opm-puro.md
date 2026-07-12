# Manual de OPM puro — de las bases al uso avanzado

**Paquete educativo agnóstico de herramienta** · Object-Process Methodology (ISO/PAS 19450)
Compañero de bolsillo: `docs/cheatsheets/opm-puro.html`

> Este manual enseña **OPM como teoría**, con rigor académico y vocación didáctica,
> sin depender de ningún modelador concreto. Todo lo afirmado se ancla al corpus
> canónico OPM-ES: `urn:fxsl:kb:opm-es` (semántica), `urn:fxsl:kb:opl-es` (texto),
> `urn:fxsl:kb:opd-es` (gráfica), `urn:fxsl:kb:manual-metodologico-opm-es` (método)
> y `urn:fxsl:kb:reglas-opm-estrictas-es` (canon prescriptivo). La lente de lectura
> es el marco de las 52 tensiones del modelado (`urn:fxsl:kb:tensiones-modelamiento`).
> La trazabilidad declarada es al corpus local OPM-ES; este paquete no sustituye
> una auditoría independiente, cláusula por cláusula, del texto de ISO/PAS 19450.

---

## Índice

- **Parte 0 — Orientación**: por qué modelar, qué congela un formalismo, dónde se sitúa OPM.
- **Parte I — Fundamentos ontológicos**: cosas, estados, propiedades genéricas, función.
- **Parte II — Bimodalidad**: el hecho único y sus dos proyecciones, OPD y OPL.
- **Parte III — Enlaces**: las cinco familias base, la extensión de excepción, control y operadores lógicos.
- **Parte IV — Complejidad**: refinamiento, abstracción, distribución, composición.
- **Parte V — Método**: clasificación del sistema, construcción del SD, niveles, heurísticas, anti-patrones.
- **Parte VI — Dinámica**: ejecución, simulación, tiempo y excepciones.
- **Parte VII — OPM entre los formalismos**: tensiones, MBSE, metamodelo, conformidad.
- **Apéndices**: A glosario · B plantillas OPL-ES · C autoevaluación resuelta · D mapa tensión→resolución · E fuentes.

Cada parte cierra con **preguntas de autoevaluación**; las respuestas razonadas están en el Apéndice C.

---

# Parte 0 — Orientación

## 0.1 Propósito, audiencia y cómo leer este manual

Este manual existe para una sola cosa: que quien lo estudie **aprenda OPM bien
aprendido** — sus fundamentos ontológicos, su lenguaje bimodal, su método y su
semántica de ejecución — *antes* de tocar herramienta alguna. La herramienta se
aprende en una tarde; la teoría mal aprendida se paga durante años en modelos
que compilan pero no dicen la verdad.

La audiencia es un lector culto, no necesariamente informático: alguien capaz de
razonar con precisión sobre conceptos, al que no hay que simplificarle las ideas
sino explicárselas completas. Por eso el manual:

1. **define antes de usar** — ningún término aparece sin su qué;
2. **justifica antes de prescribir** — ninguna regla aparece sin su porqué;
3. **muestra antes de abstraer** — dos ejemplos canónicos recorren todo el texto:
   el *Lavado de Platos* (el clásico de la literatura OPM) y la *Preparación de
   Empanadas* (el ejemplo canónico del corpus en español);
4. **evalúa lo aprendido** — cada parte cierra con preguntas cuya respuesta
   razonada está en el Apéndice C.

**Ruta de estudio sugerida.** Lectura secuencial de las Partes 0–III (son el
núcleo conceptual, no se saltan); la Parte V puede leerse antes que la IV si el
lector prefiere «hacer» antes que «componer»; las Partes VI y VII son
profundización. El cheat sheet acompañante condensa las tablas para el repaso.

## 0.2 El acto de modelar como navegación de tensiones

Antes de OPM, una tesis general sobre *todo* modelado, tomada del marco de las
52 tensiones (`urn:fxsl:kb:tensiones-modelamiento`):

> Todo acto de modelado — en cualquier formalismo — es **navegación de
> tensiones**: decisiones entre dos polos, cada una con su pregunta.

Las 52 tensiones se organizan en tres capas anidadas:

```text
C: CONTEXTO      (condiciones que modulan)       12 tensiones
  B: PRAXIS      (cómo decide el modelador)      16 tensiones
    A: SUSTANTIVAS (qué debe decidirse)          24 tensiones
```

La clave de lectura, que este manual adopta como columna vertebral didáctica:

> Un **formalismo es un sistema de resoluciones congeladas de las tensiones
> sustantivas** (capa A): elige de antemano cómo resolver «objeto o evento»,
> «todo o partes», y ofrece primitivas que encarnan esa elección. Las tensiones
> de **praxis** (B) y de **contexto** (C) no las resuelve ningún formalismo:
> las navega el modelador, nombrándolas.

Esto reordena qué significa «aprender OPM». No es memorizar símbolos: es
entender **qué decisiones OPM ya tomó por ti** (y por qué son buenas
decisiones), y **qué decisiones siguen siendo tuyas** aunque domines toda la
sintaxis. El contexto (capa C) modula profundidad, alcance y ritmo — jamás la
corrección: un modelo pequeño tiene derecho a ser menos profundo, no a estar
mal formado.

## 0.3 Qué congela OPM: el mapa de resoluciones

Esta tabla es el mapa del manual. Cada fila es una tensión sustantiva de la
capa A y la primitiva con que OPM la resuelve; la última columna indica dónde
se estudia. La versión completa y comentada está en el Apéndice D.

| Tensión (capa A) | Resolución congelada de OPM | Se estudia en |
|---|---|---|
| Entidad ↔ Evento | Dos clases de cosa: **objeto** (persiste) y **proceso** (ocurre); prueba objeto-proceso | §1 |
| Concreto ↔ Abstracto | Propiedad genérica **esencia**: física / informacional | §2 |
| Token ↔ Type | Relación **clasificación-instanciación**; instancias operacionales | §13, §24 |
| Todo ↔ Partes | Relación **agregación-participación**; descomposición | §13, §15 |
| General ↔ Particular | Relación **generalización-especialización** + herencia total | §13 |
| Simétrico ↔ Asimétrico | Enlaces etiquetados unidireccional / bidireccional / recíproco | §13 |
| Estático ↔ Dinámico | Partición enlaces **estructurales** (invariantes) vs **procedimentales** (temporales) | §8 |
| Instantáneo ↔ Durativo | Proceso con **duración positiva**; evento como instante | §11, §24 |
| Secuencial ↔ Paralelo | **Línea de tiempo vertical** en la descomposición; paralelismo por altura | §12, §15 |
| Causa ↔ Efecto | Enlaces **transformadores** (consumo, resultado, efecto) e **invocación** | §9, §12 |
| Agente ↔ Paciente | **Habilitador** (agente/instrumento) vs **transformado**; unicidad de rol | §10 |
| Determinista ↔ Probabilista | Abanicos probabilísticos `Pr=p`; distribución de duración | §14, §24 |
| Conocido ↔ Desconocido | **Colecciones incompletas** («…y al menos otra parte») | §13 |
| AND ↔ OR ↔ XOR | **Abanicos lógicos** con semántica gráfica y textual propia | §14 |
| Visual ↔ Textual | **Disuelta, no elegida**: bimodalidad OPD ↔ OPL, un solo hecho, dos proyecciones | §5–§7 |
| Formal ↔ Informal | OPL: lenguaje natural controlado **con gramática formal (EBNF)** — ambos polos | §7 |
| Detalle ↔ Abstracción | Jerarquía de OPDs; pares refinamiento/abstracción | §15–§17 |
| Modular ↔ Monolítico | Composición inter-modelo por **sub-modelos** | §18 |

Las tensiones que OPM **no** congela — Incluir↔Omitir, Top-down↔Bottom-up,
Completar↔Entregar, Fidelidad↔Utilidad y todas las de praxis y contexto —
reaparecen en la Parte V (método) y la Parte VII, porque ahí es donde el
modelador las navega con nombre y criterio.

## 0.4 Qué es OPM y dónde se sitúa

**OPM (Object-Process Methodology)** es un lenguaje formal **bimodal** — gráfico
y textual — más una metodología, para especificar sistemas complejos y
multidisciplinarios (glosario 3.43 de `urn:fxsl:kb:opm-es`). Fue concebido por
Dov Dori (Technion) y estandarizado como **ISO/PAS 19450**. Sus dos compromisos
distintivos frente a otros lenguajes de modelado:

1. **Minimalismo ontológico.** Todo se dice con dos clases de cosa (objetos y
   procesos), estados dentro de los objetos, y un repertorio cerrado de enlaces.
   Donde UML/SysML despliegan más de una docena de tipos de diagrama, OPM usa
   **un solo tipo** (el OPD) replicado en jerarquía.
2. **Unificación de función, estructura y comportamiento** en el mismo
   formalismo y el mismo diagrama, en vez de fragmentarlos en vistas separadas
   que luego hay que reconciliar.

El corpus canónico en español que este manual sigue está estratificado en
capas editoriales con responsabilidades excluyentes — cada hecho tiene un solo
dueño documental:

| Capa | URN | Responsabilidad |
|---|---|---|
| Núcleo conceptual | `urn:fxsl:kb:opm-es` | Semántica, ontología, principios, glosario |
| OPL-ES | `urn:fxsl:kb:opl-es` | Superficie textual canónica en español, plantillas, EBNF |
| OPD | `urn:fxsl:kb:opd-es` | Gramática visual: geometría, marcadores, composición |
| Manual metodológico | `urn:fxsl:kb:manual-metodologico-opm-es` | Procedimiento, heurísticas, verificación |
| Reglas estrictas | `urn:fxsl:kb:reglas-opm-estrictas-es` | Canon prescriptivo: validez, severidades, anti-patrones |

Cuando este manual cita una regla `R-*` o una plantilla con ID (`T1`, `RF3`,
`CX1`…), la traza apunta a esas capas.

### Preguntas de autoevaluación — Parte 0

**P0.1** ¿Por qué «un formalismo es un sistema de resoluciones congeladas» y
qué implica eso para distinguir a un experto en sintaxis de un experto en
modelar?
**P0.2** El marco de tensiones afirma que el contexto «modula profundidad,
alcance y ritmo; jamás la corrección». Dé un ejemplo de la diferencia.
**P0.3** ¿Cuáles son los dos compromisos distintivos de OPM frente a la familia
UML/SysML?

---

# Parte I — Fundamentos ontológicos

## §1 La ontología mínima: cosas, objetos, procesos

### 1.1 Dos clases de cosa, y nada más

OPM parte de una decisión ontológica radical, que resuelve la tensión
Entidad↔Evento («¿es algo, o sucede?»):

> Un **elemento** del modelo es una **cosa** o un **enlace**. Una **cosa** es
> exactamente una de dos clases: **objeto** o **proceso** (R-COSA-1, R-META-14).

- Un **objeto** es una cosa que existe o puede existir, física o
  informacionalmente. Su persistencia se asume por defecto hasta que un proceso
  actúe sobre él. Se representa con un **rectángulo**.
- Un **proceso** es una transformación de uno o más objetos: los crea, los
  consume o cambia su estado. Tiene **duración positiva**. Se representa con
  una **elipse**.

No existen en OPM «actores», «entidades», «nodos», «componentes» ni
«actividades» como clases ontológicas independientes: todo lo que en otros
lenguajes recibe una caja especial, en OPM es un objeto, un proceso, un estado
o un enlace. Este cierre es deliberado: menos clases primitivas significa menos
decisiones arbitrarias de clasificación y más consistencia entre modeladores.

### 1.2 La prueba objeto-proceso

¿Cómo decidir si algo del dominio es objeto o proceso? El corpus da tres
criterios conjuntos (la **prueba objeto-proceso**):

1. **Asociación con el tiempo**: el proceso *ocurre a lo largo del tiempo*; el
   objeto *persiste en el tiempo*.
2. **Asociación verbal**: el nombre del proceso expresa acción o
   transformación.
3. **Transformación**: el proceso debe **transformar al menos un objeto** —
   crearlo, consumirlo o cambiarle el estado (R-PROC-1, R-PROC-2).

El tercer criterio es el más potente y el menos intuitivo: si un candidato a
proceso no transforma ningún objeto, **no es un proceso OPM** — es un objeto
mal clasificado, una relación estructural disfrazada, o ruido. Esta exigencia
de «cierre transformador» es la vacuna de OPM contra los diagramas de cajas
que fluyen sin que nada cambie.

### 1.3 El estado no es una cosa

Un **estado** es una situación o posición posible de un objeto (glosario 3.68).
Vive **exclusivamente dentro de su objeto propietario** — se dibuja como un
rectángulo redondeado (*rountangle*) contenido en el rectángulo del objeto — y
no existe suelto (R-EST-1). Un estado es atómico: no contiene cosas ni estados.

Consecuencia mayor, que sorprende a quien viene de las máquinas de estados:
**OPM no admite estados de proceso** («iniciado», «en curso», «terminado») —
los estados se reservan a los objetos (R-PROC-4). Si el dominio exige modelar
fases de un proceso, se **descompone** el proceso en subprocesos (*Iniciar*,
*Procesar*, *Finalizar*). La razón ontológica: un proceso *es* devenir; sus
«fases» son sub-devenires, no situaciones estables de algo que persiste.

### 1.4 Procesos persistentes: el caso límite

La adaptación canónica reconoce procesos cuyo aporte no es un cambio neto sino
una **condición mantenida en el tiempo**: *Existir*, *Sostener*, *Mantener*,
*Esperar*. Son legítimos **solo si** la temporalidad o el esfuerzo sostenido
forman parte del hecho que se quiere modelar (R-PROC-5): el vuelo estacionario
de un helicóptero requiere propulsión activa — es proceso. La cimentación que
soporta una casa no «se esfuerza» — es una relación estructural etiquetada
(`**Cimentación** soporta **Casa**`), no un proceso (heurística §22.1). Un
proceso persistente que queda explícito debe declarar el objeto afectado y la
invariancia neta: su OPL canónico reutiliza la plantilla de cambio con estado
de entrada igual al de salida — `*Mantener Presión* cambia **Tanque** de
`presurizado` a `presurizado`.` (R-OPL-PERSIST-2).

## §2 Propiedades genéricas y frontera del sistema

Toda cosa OPM porta tres **propiedades genéricas**, cada una resolviendo una
tensión sustantiva:

| Propiedad | Valores | Default | Tensión que resuelve | Realización visual |
|---|---|---|---|---|
| **Perseverancia** | persistente (objeto) / transitoria (proceso) | fijada por el tipo | Entidad ↔ Evento | rectángulo / elipse |
| **Esencia** | física / informacional | informacional | Concreto ↔ Abstracto | con sombra / plana |
| **Afiliación** | sistémica / ambiental | sistémica | Situado ↔ Universal (frontera) | contorno sólido / discontinuo |

El producto Forma × Contorno × Profundidad genera exactamente **8
combinaciones** visuales (2 formas × 2 contornos × 2 sombreados) — todo el
vocabulario de cosas de un OPD cabe en esa tabla (§3.2 del canon prescriptivo).

Dos reglas de herencia importantes (R-OBJ-6, R-OBJ-7): los atributos de objetos
ambientales son ambientales, y los procesos ejecutados por cosas ambientales
son procesos ambientales.

**La frontera del sistema** (Principio 5, §4): el **entorno** es el conjunto de
cosas *fuera* del sistema que pueden interactuar con él. Las cosas sistémicas
llevan contorno sólido; las ambientales, discontinuo. Declarar qué queda dentro
y qué queda fuera **no** lo decide OPM — es la tensión de praxis
Incluir↔Omitir, navegada con el criterio del propósito del modelo (Parte V) —
pero OPM obliga a que la decisión quede *visible* en cada cosa: no hay cosas de
afiliación ambigua.

**Clasificación de esencia para cosas mixtas**: cuando una cosa tiene partes
física e informacional, se clasifica como **física** — la esencia dominante del
componente tangible prevalece (heurística metodológica §9.11).

## §3 Estados, designaciones, atributos y valores

### 3.1 Objetos con y sin estados

Un **objeto con estados** declara un conjunto de estados permitidos (`s ≥ 1`);
en cada instante, una instancia del objeto está en un estado o **en transición**
entre estados. Un **objeto sin estados** (`s = 0`) no puede ser *afectado*:
solo puede crearse o consumirse (R-OBJ-2). Esta restricción es puramente
lógica: «afectar» significa cambiar de estado, y no hay estados que cambiar.

La enumeración de estados tiene plantilla textual fija (D5):

> `**Lavavajillas** puede estar `vacío` o `cargado`.`

Obsérvese el verbo: **«puede estar»** — estados son situaciones temporales y
en español se dicen con *estar*. Contrástese con la especialización («puede
ser», §13.4): confundir ambos verbos es confundir ontología con taxonomía.

### 3.2 Las cuatro designaciones de estado

Una **designación** califica el rol persistente de un estado dentro de su
conjunto (glosario 3.71a; R-EST-2):

| Designación | Semántica | Marca visual | Cardinalidad | OPL |
|---|---|---|---|---|
| **Inicial** | estado al crearse el objeto | borde grueso | 0..* | `Estado `s` de **Objeto** es inicial.` (D7) |
| **Final** | estado al consumirse | doble borde | 0..* | `Estado `s` de **Objeto** es final.` (D8) |
| **Por defecto** | el más probable al inspeccionar | flecha diagonal abierta | 0..1 | `Estado `s` de **Objeto** es por defecto.` (D9) |
| **`Current` declarado** | marcado como actual por el modelador | glifo externo (pin) | 0..1 | `Estado `s` de **Objeto** es declarado `Current`.` (D13) |

Un estado **puede ser inicial y final a la vez** (D10) — y ese es el patrón
*correcto* para ciclos cerrados: el lavavajillas parte `vacío` y termina
`vacío`. Duplicar el estado (`vacío_inicio`, `vacío_fin`) para evitar la doble
marca es un anti-patrón (AP-14): introduce un sinónimo falso y rompe la
identidad semántica del estado (§23).

La designación `Current` declarada (persistente, decisión del modelador) se
distingue del **estado actual de runtime** (efímero, durante una simulación):
son canales distintos y las herramientas deben distinguirlos visualmente
(R-EST-4). La distinción reaparece en §24.

### 3.3 Atributos y valores

Un **atributo** es un **objeto** que caracteriza una cosa distinta de sí mismo
(glosario 3.4), conectado a su exhibidor por la relación
exhibición-caracterización (§13.2). Los **valores** de un atributo son
**estados del atributo** (glosario 3.81). No hay en OPM una clase primitiva
«atributo»: es la misma maquinaria objeto+estado, reutilizada.

> `**Conjunto de Platos** exhibe **Limpieza**.`
> `**Limpieza** de **Conjunto de Platos** puede estar `sucia` o `limpia`.`

Un atributo puede declarar unidad de medida, tipo computacional (`boolean`,
`string`, `integer`, `float`, `double`, `short`, `long`, `enumerated`) y
dominio como intervalos con inclusión/exclusión: `[0..100]`, `(0..*)` (§6.7 del
canon; §24). Y una distinción fina con nombre propio: una **propiedad** es una
anotación cuyo valor *no cambia* durante la simulación (cardinalidades,
etiquetas, etiquetas de ruta); un **atributo** sí puede cambiar (R-ATR-6). Lo
mutable es del modelo; lo inmutable, del metamodelo del hecho.

**Simplificación estados-directos** (heurística §9.12): cuando un objeto tiene
un solo atributo relevante, se admite promover los valores a estados directos
del objeto — `**Feto** puede estar `embrión` o `bebé`.` — en vez del par
atributo+valores. Criterio: legibilidad; la forma completa se prefiere cuando
hay varios atributos o el nombre del atributo aporta semántica.

### 3.4 Objetos específicos de estado (avanzado)

Un objeto con `s` estados genera conceptualmente `s` **objetos específicos de
estado**: especializaciones sin estados que «refieren a» un estado concreto
(R-META-15/16). **Producto** con estados `diseñado`, `fabricado`, `probado`
genera **Producto Diseñado**, **Producto Fabricado**, **Producto Probado**,
cada uno enlazado al original con un estructural etiquetado `refiere al estado
de`. El mecanismo permite tratar «el objeto en tal estado» como cosa
referenciable — útil en composición inter-modelo (§18).

## §4 Función, estructura, comportamiento: los seis principios

Los seis principios de modelado del núcleo conceptual gobiernan todo lo demás:

1. **Actividad al servicio de un propósito.** La función del sistema y el
   propósito del modelado definen alcance y nivel de detalle (R-PRIN-1/2).
2. **Unificación de función, estructura y comportamiento.** Estructura
   (objetos + relaciones estructurales) más comportamiento (procesos que
   transforman objetos) **producen** función (R-PRIN-3).
3. **Identificación del valor funcional.** El proceso que entrega valor
   expresa la función tal como la percibe el **beneficiario** principal.
   Identificarlo y nombrarlo es el paso crítico inicial (R-PRIN-4).
4. **Función ≠ comportamiento.** La función es el *valor para el beneficiario*;
   el comportamiento es *cómo opera* el sistema. La misma función puede
   implementarse con estructuras y comportamientos distintos (R-PRIN-5). Un
   ascensor y una escalera mecánica comparten función (elevar personas) con
   comportamientos disjuntos.
5. **Definición del límite del sistema.** Sistémico vs ambiental, visible en
   el contorno (R-PRIN-6/7).
6. **Equilibrio entre claridad y completitud.** Ningún diagrama único puede
   ser claro *y* completo para un sistema real; la solución de OPM es una
   **jerarquía de OPDs** donde cada uno es claro y el conjunto es completo
   (R-PRIN-8). De aquí el límite práctico de 20–25 cosas por OPD.

Vocabulario asociado (glosario): el **beneficiario** es el interesado que
recibe valor de la operación del sistema (3.6); la **función** es el proceso
que entrega ese valor (3.23); el **valor funcional** es el beneficio derivado
(3.82).

### Preguntas de autoevaluación — Parte I

**P1.1** Aplique la prueba objeto-proceso a «Contrato», «Firma del Contrato» y
«Vigencia del Contrato». Clasifique cada uno y justifique.
**P1.2** ¿Por qué OPM prohíbe estados de proceso, y cuál es el sustituto
canónico?
**P1.3** Un lector propone modelar «El estante sostiene los libros» con un
proceso *Sostener*. ¿Qué pregunta decide si eso es correcto, y cuál es la
alternativa?
**P1.4** ¿Puede un objeto sin estados ser afectado? ¿Por qué?
**P1.5** ¿Qué diferencia a una propiedad de un atributo, y por qué importa esa
distinción al simular?

---

# Parte II — Bimodalidad: OPD y OPL

## §5 El principio bimodal: un hecho, dos proyecciones

La tensión Visual↔Textual pregunta: ¿diagrama o lenguaje? OPM la **disuelve**
eligiendo ambos polos con una disciplina estricta:

> Todo modelo OPM se expresa en dos modalidades **semánticamente
> equivalentes**: un conjunto de **OPDs** (Object-Process Diagrams, la
> representación gráfica) y una especificación **OPL** (Object-Process
> Language, la representación textual — en este corpus, **OPL-ES** en
> español). Cada OPD tiene su párrafo OPL correspondiente.

El fundamento cognitivo: la redundancia gráfica/textual explota los dos
canales de procesamiento humano — visual y verbal — de modo que expertos de
dominio sin formación en modelado puedan **leer el modelo en su idioma** sin
pérdida de precisión formal, porque el OPL no es prosa libre: es un lenguaje
natural **controlado**, con gramática formal (EBNF) y plantillas cerradas.

La disciplina que hace esto sostenible es el **principio del hecho único**
(R-BI-0): OPD y OPL **no son dos modelos** — son dos proyecciones del mismo
hecho canónico. Editar el diagrama regenera el texto; editar el texto regenera
el diagrama; jamás divergen en silencio. Toda afirmación gráfica debe ser
reproducible como oración OPL, y toda oración OPL debe reconstruir el mismo
constructo gráfico (R-BI-DUAL-1). A esta ida-y-vuelta la llamamos
**bisimetría**, y su tabla de correspondencias (Apéndice B) funciona como
contrato de equivalencia.

## §6 OPD: el vocabulario visual

### 6.1 Formas y las ocho combinaciones

| Forma cerrada | Representa |
|---|---|
| Rectángulo | Objeto |
| Elipse | Proceso |
| Rectángulo redondeado, dentro de un objeto | Estado |

Con los dos ejes de propiedad visual — contorno (sólido=sistémico,
discontinuo=ambiental) y profundidad (sombra=físico, plano=informacional) —
resultan las 8 combinaciones de §2. Los **defaults** (informacional, sistémico)
no se marcan: un rectángulo plano de borde sólido es el objeto «ordinario».

Regla que ahorra discusiones: **el color es informativo, no normativo**
(R-COLOR-1/2). La semántica visual de OPM viaja en forma, contorno, sombreado
y topología — nunca en el color. Dos herramientas con paletas distintas pueden
producir OPDs canónicamente idénticos.

### 6.2 Decoraciones de extremo de enlace

El tipo de un enlace se reconoce por la decoración de su extremo:

| Decoración | Nombre | Enlace |
|---|---|---|
| Punta cerrada | *arrowhead* | Transformadores (consumo, resultado, efecto) |
| Círculo negro relleno | piruleta negra | **Agente** (en el extremo del proceso) |
| Círculo blanco vacío | piruleta blanca | **Instrumento** (en el extremo del proceso) |
| Zigzag con punta | rayo | **Invocación** |
| Punta abierta | *open arrowhead* | Estructural etiquetado unidireccional |
| Arpón (media punta) | *harpoon* | Estructural bidireccional / recíproco |

### 6.3 Los cuatro triángulos estructurales

Las cuatro relaciones estructurales fundamentales comparten geometría — un
triángulo cuyo **vértice apunta al refinable** y cuya base conecta con los
refinadores (R-TRI-1) — y se distinguen por la **topología interna** del
triángulo, que es canal normativo (R-TRI-2):

| Interior del triángulo | Relación |
|---|---|
| Completamente relleno | Agregación-participación (todo → partes) |
| Triángulo interior | Exhibición-caracterización (exhibidor → rasgos) |
| Vacío | Generalización-especialización (general → especializaciones) |
| Círculo interior | Clasificación-instanciación (clase → instancias) |

### 6.4 Marcas textuales sobre enlaces

| Marca | Significado |
|---|---|
| `e` | Modificador de evento |
| `c` | Modificador de condición |
| `/` | Excepción por sobretiempo |
| `//` | Excepción por subtiempo |
| `Pr=p` | Probabilidad del enlace en abanico probabilístico |
| Texto en itálica sobre el eje | Etiqueta de enlace estructural |
| Texto sobre enlace procedimental | Etiqueta de ruta |

### 6.5 Indicadores auxiliares y anidamiento

- **Colección incompleta**: barra horizontal corta bajo el triángulo («hay más
  refinadores que no se muestran»).
- **Supresión de estados**: `...` en la esquina del objeto (hay estados
  ocultos en esta vista).
- **Contorno grueso**: la cosa está refinada en otro OPD (es la señal de
  navegación entre niveles, §15).

Anidamiento permitido: un objeto puede contener estados, y partes si está
descompuesto; una elipse **inflada** contiene subprocesos y objetos internos;
un estado no contiene **nada** (es atómico).

### 6.6 Legibilidad como regla, no como gusto

El canon fija el límite de legibilidad en **20–25 cosas por OPD** (V-50):
más allá, el diagrama debe refinarse, simplificarse o convertirse en vista.
No-oclusión y minimización de cruces de enlaces son igualmente normativas
(V-51). La claridad no es cosmética: un OPD ilegible es un OPD que ya no
comunica, y comunicar es la mitad del contrato bimodal.

## §7 OPL-ES: el lenguaje textual

### 7.1 Decisiones de diseño del español canónico

OPL-ES traduce el OPL inglés de referencia preservando el orden
sujeto-verbo-complemento de cada plantilla (R-OPL-6). Sus decisiones de diseño
son lecciones de precisión lingüística aplicada:

- **Ser vs estar** (R-OPL-2): *estar* para estados (situaciones temporales:
  `**Objeto** está en `estado``); *ser* para propiedades invariantes
  (`**X** es un **Y**`, `es de tipo`). La gramática española codifica
  exactamente la distinción ontológica de OPM entre situación y esencia.
- **Posición del estado** (R-OPL-4): el estado sigue al objeto con «en» —
  `**Usuario** en `activo` maneja *Procesar*.`
- **Pasiva refleja** (R-OPL-5): «se consume», «se omite» — no «es consumido».
- **Artículos omitidos** salvo mínimos gramaticales: «es un/una», «de lo
  contrario», «al menos» (R-OPL-3).
- **Tipografía canónica** (R-OPL-TYPO-1): **objeto** en negrita, *proceso* en
  cursiva, `estado` en monoespaciado. Este manual la usa en todos sus
  ejemplos.

### 7.2 Nombres válidos

| Clase | Regla | Ejemplos válidos | Inválidos |
|---|---|---|---|
| Objeto | Sustantivo **singular**, palabras léxicas capitalizadas (R-NOM-OBJ-1) | **Ingrediente**, **Torta de Manzana** | «Ingredientes» |
| Objeto plural | Sufijo **Conjunto** (inanimados) o **Grupo** (humanos) (R-NOM-OBJ-2) | **Conjunto de Platos**, **Grupo de Comensales** | «Los Platos» |
| Proceso | **Forma deverbal**: infinitivo o nominalización deverbal (`-ción`, `-miento`, `-aje`, o sin sufijo: *Despacho*, *Cierre*) (R-NOM-PROC-1); 2–4 palabras (R-NOM-PROC-2) | *Preparar Empanadas*, *Verificación de Identidad* | «Sistema», «Gestión» como comodín |
| Estado | **minúsculas**, forma pasiva o descriptiva (R-NOM-EST-1) | `vacío`, `pre-cortada` | «Vacío» |

La exigencia deverbal para procesos no es purismo: garantiza que el nombre
*denote acción o resultado de acción*, es decir, que la cosa nombrada pase la
prueba objeto-proceso ya desde el léxico.

### 7.3 El vocabulario de verbos fijos

Cada familia de enlace tiene su verbo, en tercera persona del presente:

| Función | Verbo OPL-ES | Función | Verbo OPL-ES |
|---|---|---|---|
| Consumo | **consume** | Agregación | **consta de** |
| Resultado | **genera** | Exhibición | **exhibe** |
| Efecto | **afecta** | Especialización (pl.) | **son** |
| Cambio de estado | **cambia … de … a** | Especialización (sg.) | **es un / es una** |
| Agente | **maneja** | Instanciación | **es una instancia de** |
| Instrumento | **requiere** | Relación sin etiqueta | **se relaciona con** |
| Iniciación (evento) | **inicia** | Enumeración de estados | **puede estar** |
| Invocación | **invoca** | Especialización XOR | **puede ser** |
| Ocurrencia | **ocurre** | Descomposición | **se descompone en … en esa secuencia** |
| Omisión (pasiva) | **se omite** | Despliegue | **se despliega en** |

Palabras clave fijas: `si`, `en cuyo caso`, `de lo contrario`, `exactamente
uno de` (XOR), `al menos uno de` (OR), `así como` (adición heterogénea),
`por ruta`, `en esa secuencia`, `duración de`, `excede`, `es menor que`.

### 7.4 El párrafo OPL de un sistema completo

El SD del sistema de *Preparación de Empanadas* (`urn:fxsl:kb:opl-es` §16)
muestra cómo suena un párrafo OPL-ES. Se presenta aquí en su **versión saneada
provisional**: conserva el ejemplo canónico, pero corrige localmente la firma
estructural Receta→Sistema solicitada al custodio en
`docs/solicitudes-upstream/2026-07-11-tensiones-internas-corpus-base-opl.md`
(Tensión 3). Hasta que esa corrección sea ratificada upstream, no debe citarse
este párrafo como transcripción literal del corpus:

```text
*Preparar Empanadas* afecta **Grupo de Comensales**.
**Grupo de Comensales** exhibe **Nivel de Satisfacción**.
**Nivel de Satisfacción** puede estar `insatisfecho` o `satisfecho`.
Estado `insatisfecho` de **Nivel de Satisfacción** es inicial.
Estado `satisfecho` de **Nivel de Satisfacción** es final.
*Preparar Empanadas* cambia **Nivel de Satisfacción** de `insatisfecho` a `satisfecho`.
**Cocinero** maneja *Preparar Empanadas*.
*Preparar Empanadas* requiere **Horno**.
*Preparar Empanadas* consume **Masa Cruda**.
*Preparar Empanadas* genera **Empanada**.
**Receta** es ambiental.
**Receta** se relaciona con **Sistema de Preparación de Empanadas**.
```

Doce oraciones y el sistema entero de nivel 0 queda dicho: función, valor,
agente, instrumentos, insumos, producto y entorno. Cualquier persona del
dominio puede auditar ese párrafo; cualquier herramienta conforme puede
reconstruir el diagrama desde él. Esa doble legibilidad — humana y mecánica —
es la promesa cumplida de la bimodalidad.

### Preguntas de autoevaluación — Parte II

**P2.1** ¿Qué prohíbe exactamente el principio del hecho único, y qué error de
herramienta lo violaría?
**P2.2** ¿Por qué el color no puede portar semántica en un OPD canónico?
**P2.3** Corrija los nombres inválidos: objeto «Documentos firmados», proceso
*Sistema de Validación*, estado `Aprobado`.
**P2.4** Traduzca a OPL-ES: «El proceso de horneado requiere el horno y cambia
la masa de cruda a horneada» (asuma **Masa** con estados `cruda` y
`horneada`).

---

# Parte III — Enlaces: el sistema circulatorio del modelo

## §8 Panorama: cinco familias base, una extensión y dos leyes transversales

Un **enlace** es la expresión gráfica de una relación estructural o
procedimental (glosario 3.36). La capa base OPM-ES (`urn:fxsl:kb:opm-es`)
distingue **cinco familias canónicas**. El canon prescriptivo de OpForja
promueve la excepción temporal a sexta familia autónoma por paridad con la
invocación; es una **extensión declarada**, no una propiedad de OPM base:

| # | Familia | Firma | Naturaleza |
|---|---|---|---|
| 1 | **Transformadora** | Objeto ↔ Proceso | procedimental: el proceso cambia al objeto |
| 2 | **Habilitadora** | Objeto → Proceso | procedimental: el objeto permite sin cambiar |
| 3 | **Invocación** | Proceso → Proceso | procedimental: un proceso inicia a otro |
| — | **Excepción** · extensión Forja | Proceso → Proceso | control temporal autónomo: desvío por duración anómala |
| 4 | **Estructural fundamental** | Cosa ↔ Cosa | estática: semántica fija (4 relaciones) |
| 5 | **Estructural etiquetada** | Obj↔Obj o Proc↔Proc | estática: semántica definida por el modelador |

Nótese la gran partición que resuelve la tensión Estático↔Dinámico: los
enlaces **procedimentales** (familias 1–3 y la extensión de excepción) expresan
relaciones dependientes del tiempo; los **estructurales** (4–5) expresan relaciones operacionalmente
invariantes — lo que sigue siendo verdad mientras el sistema opera (glosario
3.73). **Firmas:** transformadores y habilitadores conectan objeto↔proceso;
invocación y excepción conectan proceso↔proceso; los estructurales son
homogéneos (objeto↔objeto o proceso↔proceso), salvo las combinaciones canónicas
de exhibición-caracterización (§13.2). La generalización anterior «todo
procedimental es no homogéneo» está elevada para corrección en la solicitud
upstream del 2026-07-11.

Dos leyes transversales gobiernan las familias procedimentales:

1. **Unicidad de rol** (R-ROL-UNIC-1): un objeto (o estado) tiene *exactamente
   un rol* respecto de un proceso enlazado — transformado **o** habilitador,
   nunca ambos a la vez para el mismo proceso. Sin esta ley, la pregunta
   «¿qué le hace este proceso a este objeto?» tendría dos respuestas.
2. **Conjuntos previo y posterior** (R-ECA-2/3): el **conjunto previo al
   proceso**, Pre(P), reúne consumidos + afectados (en su estado de entrada) +
   habilitadores — lo que debe existir *antes*; el **conjunto posterior**,
   Post(P), reúne resultantes + afectados (en su estado de salida) — lo que
   existe *después*. Esta partición temporal explica, entre otras cosas, la
   asimetría de los modificadores de control (§11.3).

El **control evento-condición-acción (ECA)** cierra el panorama: un proceso
comienza cuando (1) ocurre su evento iniciador, si existe, y (2) se satisface
su precondición. Los eventos **se pierden** tras la evaluación, se satisfaga o
no la precondición (R-ECA-1; §11.1).

## §9 Enlaces transformadores: consumo, resultado, efecto

### 9.1 Los tres tipos básicos

| Enlace | Semántica | Dirección | OPL (plantilla) |
|---|---|---|---|
| **Consumo** | el proceso destruye o incorpora el objeto | objeto → proceso | `*Procesar* consume **Consumido**.` (T1) |
| **Resultado** | el proceso crea el objeto | proceso → objeto | `*Procesar* genera **Resultado**.` (T2) |
| **Efecto** | el proceso cambia el estado del objeto | objeto ↔ proceso | `*Procesar* afecta **Afectado**.` (T3) |

Construcción y consumo son transformaciones **más profundas** que el efecto:
cambian la *existencia*, no solo el estado. El **transformado** es el objeto
sobre el que el proceso actúa (consumido, resultante o afectado); junto con
los habilitadores forma el **conjunto de objetos involucrados** del proceso.

### 9.2 Variantes con estado especificado

Los transformadores pueden anclarse a estados concretos, no al objeto entero:

| ID | Variante | OPL |
|---|---|---|
| TS1 | Consumo con estado | `*Proceso* consume **Objeto** en `estado`.` |
| TS2 | Resultado con estado | `*Proceso* genera **Objeto** en `estado`.` |
| TS3 | Efecto entrada-salida | `*Proceso* cambia **Objeto** de `estado-entrada` a `estado-salida`.` |
| TS4 | Efecto solo entrada | `*Proceso* cambia **Objeto** de `estado-entrada`.` |
| TS5 | Efecto solo salida | `*Proceso* cambia **Objeto** a `estado-salida`.` |

TS3 es el caballo de batalla del modelado con estados — del ejemplo canónico:

> `*Lavar y Secar Platos* cambia **Limpieza** de **Conjunto de Platos** de `sucia` a `limpia`.`

TS4/TS5 tienen doble vida: como **efecto parcial** independiente (TS4 sin
salida especificada resuelve el destino al estado *por defecto* del objeto, o
a la distribución de probabilidad si no lo hay — R-EFE-3), y como mitades del
**enlace escindido** que aparece al descomponer un TS3 (§16.2).

### 9.3 Semántica temporal fina

Tres reglas de tiempo con consecuencias directas en la simulación (§24) y en
la disponibilidad de objetos entre subprocesos:

1. El **consumido desaparece al inicio** del proceso, no al final (invariante
   del núcleo conceptual): desde que el proceso arranca, nadie más puede
   usarlo.
2. El **resultante comienza a existir al completarse** el proceso: ningún
   subproceso anterior puede verlo.
3. El **afectado sale de su estado de entrada al iniciar** el proceso y solo
   **alcanza el de salida al completarlo** (R-EFE-2/2A). Entre medio está *en
   transición*: su estado es indeterminado y el objeto está **indisponible**
   para otros procesos. Si el proceso aborta, queda indeterminado salvo que
   exista manejo de excepción (R-EFE-2B; §11.4).

### 9.4 Restricciones no obvias

- **Resultado hacia estado inicial, prohibido** (R-RES-1, AP-04): el enlace de
  resultado se conecta al rectángulo del objeto o a un estado *no inicial* —
  jamás al estado inicial directamente. Razón: el estado inicial ya es «el
  estado al crearse» (designación); apuntar el resultado ahí duplicaría el
  mismo hecho por dos canales, con riesgo de contradicción.
- **Consumo a lo largo del tiempo**: por defecto el consumo es inmediato al
  activarse el proceso; modelar consumo gradual exige declarar *tasa* en el
  enlace y *cantidad* como atributo del consumido, simultáneamente (R-CONS-2/3).

## §10 Enlaces habilitadores: agentes e instrumentos

Un **habilitador** es un objeto necesario para que el proceso ocurra, pero que
**no es transformado** por él (glosario 3.17). Dos clases:

| Enlace | Habilitador | Decoración | OPL |
|---|---|---|---|
| **Agente** | persona o grupo humano con decisión | piruleta **negra** | `**Agente** maneja *Proceso*.` (H1) |
| **Instrumento** | objeto no humano | piruleta **blanca** | `*Proceso* requiere **Instrumento**.` (H2) |

**La regla dura de humanidad** (R-AG-1, AP-05): el enlace de agente se reserva
**exclusivamente** a humanos o grupos humanos. Robots, software, sistemas de
IA — por autónomos que sean — usan enlace de **instrumento** en el modelo
nuclear. La prosa externa puede llamarlos «agentes»; el OPD/OPL canónico, no.
El criterio no es capacidad sino **responsabilidad**: OPM reserva la piruleta
negra para quien responde por sus decisiones.

Reglas y matices de uso:

- **Con estado especificado**: `**Agente** en `estado` maneja *Proceso*.`
  (HS1); `*Proceso* requiere **Instrumento** en `estado`.` (HS2) — el proceso
  ocurre si y solo si el habilitador está en el estado requerido.
- **Desaparición del habilitador** (R-AG-2): si un habilitador deja de existir
  durante la ejecución, el proceso se detiene y el afectado queda en estado
  indeterminado.
- **Reclasificación por desgaste** (R-AG-3/4): si el desgaste del instrumento
  es relevante al alcance (la fresadora se amortiza, la broca se gasta), el
  instrumento debe **reclasificarse como afectado**, con atributo de
  degradación y proceso de mantenimiento separado. Un «instrumento» que se
  gasta en silencio esconde la mitad del sistema.
- **Co-agentes** (heurística §9.18): dos agentes sobre el mismo proceso =
  AND implícito (ambos presentes). No se agrupan en un objeto artificial
  «Grupo de Agentes» si eso pierde su identidad individual.
- **Doble rol en procesos distintos**: un objeto puede ser agente de un
  proceso y transformado de *otro* — el estudiante maneja *Aprender* y a la
  vez su **Nivel de Conocimiento** es afectado. Lo prohibido (unicidad de rol)
  es el doble rol respecto del *mismo* proceso; en esa colisión prevalece el
  rol transformador y la humanidad del beneficiario queda dicha en el nombre y
  la posición, no en un segundo enlace.

## §11 Control: eventos, condiciones, excepciones

### 11.1 La tabla de las tres conductas

Los modificadores `e` (evento) y `c` (condición) **no son enlaces nuevos**:
son anotaciones sobre un enlace base transformador o habilitador (R-ECA-4).
Cambian qué ocurre cuando el objeto requerido falta:

| Enlace de entrada | Si el objeto/estado requerido falta | Lectura |
|---|---|---|
| Sin modificador | el proceso **espera** indefinidamente | requisito obligatorio |
| Con `c` (condición) | el proceso **se omite** (*bypass*) y el control sigue | requisito opcional |
| Con `e` (evento) | el objeto **dispara** la evaluación; el evento **se pierde** tras evaluar, éxito o no | disparador |

Esta tabla es la respuesta de OPM a la pregunta de control más común en
sistemas reales: *esperar o saltar*. El error típico (§23) es usar enlace sin
modificador para un recurso que puede no llegar — resultado: interbloqueo.

Semántica con múltiples enlaces al mismo proceso (R-EJEC-8, §10.3 del manual
metodológico): múltiples **eventos** = OR (cualquiera dispara); múltiples
**condiciones** = AND para ejecutar (todas satisfechas) pero OR para omitir
(la falla de cualquiera omite). Y la **omisión precede a la espera**: si una
condición falla, el proceso se salta aunque sus enlaces sin modificador estén
satisfechos.

### 11.2 Plantillas de evento y condición

Evento — el objeto que dispara aparece dos veces, como disparador y en su rol
base:

> `**Objeto** inicia *Proceso*, que consume **Objeto**.` (ET1)
> `**Agente** inicia y maneja *Proceso*.` (EH1)
> `**Objeto** en `estado-entrada` inicia *Proceso*, que cambia **Objeto** de `estado-entrada` a `estado-salida`.` (ETS2)

Condición — la estructura trimembre `ocurre si … en cuyo caso … de lo
contrario se omite`:

> `*Proceso* ocurre si **Objeto** existe, en cuyo caso **Objeto** se consume, de lo contrario *Proceso* se omite.` (CT1)
> `**Agente** maneja *Proceso* si **Agente** existe, de lo contrario *Proceso* se omite.` (CH1)
> `*Proceso* ocurre si **Objeto** está en `estado`, en cuyo caso **Objeto** se consume, de lo contrario *Proceso* se omite.` (CS1)

### 11.3 La asimetría del resultado: por qué no hay `e` ni `c` de resultado

Regla absoluta (R-MOD-1..4; AP-01/02): **el enlace de resultado no admite
modificadores de control**. El fundamento es ontológico, no convencional: el
resultante pertenece a Post(P) — *no existe antes* del proceso, porque el
proceso lo crea. Lo que no existe no puede ser precondición (`c`) ni
disparador (`e`). El consumo sí los admite porque el consumido vive en Pre(P).
Esta asimetría es un excelente test de comprensión: quien la puede explicar
entendió los conjuntos previo/posterior; quien no, memorizó una prohibición.

Combinaciones restantes: `c`+`e` sobre el mismo enlace no está definido por el
canon (zona no canonizada, AP-28); modificadores sobre enlaces estructurales o
sobre invocación son **errores de categoría** (AP-09/10) — lo estructural es
atemporal y la invocación ya es control.

### 11.4 Excepciones temporales: sobretiempo y subtiempo

La **duración** de un proceso puede especializarse en mínima, esperada y
máxima (con distribución opcional). Los enlaces de **excepción** conectan el
proceso fuente con un **proceso de manejo** cuando la duración real sale del
rango — son una familia autónoma con firma proceso→proceso (R-EXC-1B), no un
modificador:

| Enlace | Marca | Dispara cuando | OPL |
|---|---|---|---|
| Sobretiempo | `/` | duración real > máxima | `*Manejo* ocurre si duración de *Fuente* excede máx-duración unidades-tiempo.` (EX1) |
| Subtiempo | `//` | duración real < mínima | `*Manejo* ocurre si duración de *Fuente* es menor que mín-duración unidades-tiempo.` (EX2) |

Patrón fino (§11.2 del manual metodológico): el subtiempo funciona como
**detector de omisión** — un proceso omitido tiene duración efectiva 0, menor
que cualquier mínimo positivo, lo que activa la lógica de recuperación. Es el
mecanismo formal de OPM para «este proceso no se ejecutó». El manejo de
excepción es además el único mecanismo que **resuelve el estado indeterminado**
de un afectado cuyo proceso abortó (§9.3): sin manejadores, el modelo queda
incompleto para simulación.

## §12 Invocación: procesos que inician procesos

La **invocación** modela que un proceso inicia otro (firma proceso→proceso,
decoración de rayo). Semánticamente equivale a un objeto intermedio transitorio
creado por el invocador y consumido de inmediato por el invocado — tan
transitorio que OPM lo suprime y deja el rayo.

| Forma | OPL |
|---|---|
| Invocación | `*Invocador* invoca *Invocado*.` (IV1) |
| Auto-invocación (bucle) | `*Invocador* se invoca a sí mismo.` (IV2) |

### 12.1 Invocación implícita: la línea de tiempo

Dentro de un proceso descompuesto rige el **principio de línea de tiempo**: el
tiempo fluye de arriba hacia abajo, y la terminación de un subproceso **invoca
implícitamente** al que está inmediatamente debajo — sin dibujar enlace alguno
(R-INV-2). Subprocesos cuyos bordes superiores comparten altura **inician en
paralelo** (R-INV-2A), y del grupo paralelo, solo la terminación del último
invoca al siguiente (R-INV-2C).

La fuente de verdad del orden es el **orden declarado** de la descomposición;
la coordenada vertical lo *realiza*, no lo *define* (R-IDP-0A). De ahí una
regla de higiene con nombre propio (R-INV-2D): dibujar un rayo entre
subprocesos adyacentes que ya están ordenados por posición es **doble vara** —
prohibido. El rayo explícito queda reservado para lo que el orden vertical no
puede decir: **bucles** (auto-invocación o retorno al padre), **saltos fuera
de orden** y **invocaciones entre OPDs distintos**.

### 12.2 El objeto transiente y su supresión

Heurística dual de la §22.1 (proceso persistente → estructural etiquetado):
cuando un proceso crea un objeto que el siguiente consume de inmediato **sin
observación intermedia**, ese objeto es **transiente** y debería suprimirse,
reemplazando el par crear-consumir por una invocación (AP-26). *Detectar
Objeto* invoca *Evaluar Amenaza* — la «Señal de Detección» intermedia solo
existía para el diagrama, no para el dominio. Ambas heurísticas son el mismo
principio: **no reificar lo que no se observa**.

## §13 Enlaces estructurales: la anatomía de lo estable

### 13.1 Agregación-participación (todo → partes)

> `**Lavavajillas** consta de **Compartimento de Jabón** y al menos otra parte.`
> `**Todo** consta de **Parte1**, **Parte2** y **Parte3**.` (RF1)

Triángulo relleno, vértice al todo. Las partes pueden ser consumidas,
afectadas o producidas **independientemente** sin que el todo lo sea
(R-STRF-4). La colección incompleta se dice «…y al menos otra parte» y se
dibuja con la barra bajo el triángulo — así el modelo declara honestamente la
tensión Conocido↔Desconocido en vez de fingir completitud.

### 13.2 Exhibición-caracterización (exhibidor → rasgos)

> `**Exhibidor** exhibe **Atributo1** y **Atributo2**.` (RF2)
> `**Exhibidor** exhibe **Atributo1** así como *Operación1*.` (RF2b)

Triángulo con triángulo interior. Un **rasgo** es un atributo (si es objeto) o
una **operación** (si es proceso — lo que la cosa *hace*). Es la **única**
relación estructural que puede conectar objetos con procesos (R-STRF-2): las
cuatro combinaciones válidas son objeto-exhibe-atributo, objeto-exhibe-
operación, proceso-exhibe-atributo, proceso-exhibe-operación. Nótese «así
como»: la adición heterogénea que separa atributos de operaciones en la misma
oración.

### 13.3 Generalización-especialización (general → especializaciones)

> `**Especialización1** y **Especialización2** son **General**.` (RF3)
> `**Especialización** es un **General**.` (RF3b)

Triángulo vacío. Su carga semántica es la **herencia total** (R-HER-1): la
especialización hereda del general *todas* las partes, *todos* los rasgos,
*todos* los estructurales etiquetados y *todos* los enlaces procedimentales.
Los enlaces heredados **no se dibujan** de nuevo (AP-29) — se infieren.
Herencia múltiple permitida: `**Especial** es un **General1** y un
**General2**.` (RH1). Una especialización puede **sobreescribir** un
participante heredado especificando una especialización de este con nombre y
estados propios (R-HER-5). Y en ejecución, la instancia especializada no
existe sin su instancia general (R-HER-6).

El **atributo discriminante** organiza las especializaciones por valores:

> `**Vehículo** exhibe **Medio de Desplazamiento**.`
> `**Medio de Desplazamiento** puede estar `tierra`, `aire` o `superficie acuática`.`
> `**Auto**, **Aeronave** y **Barco** son **Vehículo**.`
> `**Auto** exhibe **Medio de Desplazamiento** en `tierra`.`

Con varios discriminantes, el máximo de especializaciones válidas es el
producto cartesiano de sus valores (R-HER-4).

### 13.4 «Puede ser»: la especialización disyuntiva

Cuando lo que se afirma no es la taxonomía completa sino que una cosa
pertenece a **exactamente una** de varias clases, OPL-ES usa el verbo
**puede ser** (R-OPL-RF-5):

> `**Especial** puede ser **General1** o **General2**.` (RX1)
> `**Especial** puede ser uno de **General1**, **General2** o **General3**.` (RX2)

Aquí conviene fijar la pareja mnemotécnica central de OPL-ES: los **estados**
se enumeran con **«puede estar»** (situación temporal, verbo *estar*); las
alternativas de **especialización** con **«puede ser»** (identidad taxonómica,
verbo *ser*). Dos verbos, dos ontologías.

### 13.5 Clasificación-instanciación (clase → instancias)

> `**Instancia** es una instancia de **Clase**.` (RF4)
> `**Instancia1** e **Instancia2** son instancias de **Clase**.` (RF4b)

Triángulo con círculo interior. A diferencia de las otras tres, **no**
distingue colección completa/incompleta (R-STRF-3): el número de instancias
varía durante la operación. Dos matices que evitan confusiones clásicas:

- **Instancia visual vs instancia lógica** (R-INS-2): que la misma cosa
  aparezca dibujada en dos OPDs son dos *apariencias* de una sola cosa;
  la instanciación lógica es una relación entre *cosas distintas*.
- **Relatividad de instancia** (heurística §9.10): «instancia» es relativo al
  sistema de discurso — «Taurus 2015» es instancia en un estudio comparativo
  de modelos, y clase (con autos individuales por número de chasis) en el
  sistema de un concesionario.

### 13.6 Restricción de perseverancia

Salvo exhibición-caracterización, refinable y refinadores deben compartir
perseverancia (R-STRF-1): un todo-objeto tiene partes-objeto; un
general-proceso tiene especializaciones-proceso. La partición
estático/dinámico se respeta también dentro de las taxonomías.

### 13.7 Enlaces estructurales etiquetados

Para las relaciones estables cuya semántica **define el modelador**:

| Variante | Geometría | OPL |
|---|---|---|
| Unidireccional etiquetado | punta abierta | `**Origen** etiqueta **Destino**.` (SE1) — p. ej. `**Perfil** representa **Usuario**.` |
| Unidireccional sin etiqueta | punta abierta | `**Origen** se relaciona con **Destino**.` (SE2) |
| Bidireccional | arpones, dos etiquetas | `**Origen** etiqueta-f **Destino**.` / `**Destino** etiqueta-b **Origen**.` (SE3) |
| Recíproco | arpones, una etiqueta | `**Origen** y **Destino** son etiqueta.` (SE4) / `**Origen** y **Destino** se relacionan.` (SE5) |

La etiqueta es frase breve en minúscula que funciona como verbo o predicado
(R-OPL-SE-1). Un bidireccional con dos etiquetas idénticas equivale a un
recíproco (R-STRE-1). Existen además variantes **con estado especificado**
(SSE1–SSE7) que anclan la relación a estados concretos del origen y/o destino
— con una restricción de geometría: bidireccional y recíproco no existen para
estado *solo en destino* (AP-11).

## §14 Operadores lógicos: AND, XOR, OR y probabilidad

### 14.1 Las tres semánticas y su geometría

| Operador | Geometría | Semántica | OPL |
|---|---|---|---|
| **AND** | enlaces separados, sin arco | todos se activan | una oración por enlace |
| **XOR** | arco discontinuo simple sobre el abanico | **exactamente uno** | `exactamente uno de` |
| **OR** | dos arcos discontinuos concéntricos | **al menos uno** | `al menos uno de` |

AND no tiene símbolo: es el default de los enlaces múltiples que no se tocan.
Del ejemplo de la caja fuerte: dos llaves requeridas juntas son dos enlaces de
instrumento planos (`*Abrir Caja Fuerte* requiere **Llave A**.` y
`… requiere **Llave B**.`); dos dueños alternativos exigen el arco —
`*Abrir Caja Fuerte* es manejado por exactamente uno de **Propietario A** o
**Propietario B**.`

Un **abanico** (fan) se clasifica como **convergente** (N cosas → 1 extremo
común) o **divergente** (1 cosa → N), y el arco se dibuja en el extremo
convergente (R-FAN-GEO-1/2). XOR y OR aplican a todas las familias
procedimentales — consumo, resultado, efecto, agente, instrumento, invocación
— cada una con su plantilla (Apéndice B).

### 14.2 Probabilidad

Un abanico XOR puede declararse **probabilístico**: cada enlace se anota
`Pr=p` y las probabilidades suman exactamente 1 (R-PROB-1; la suma unitaria,
§6.8 del canon y R-FAN-PROB-1 A). El régimen fino
(R-FAN-PROB-1) distingue tres casos que conviene citar porque enseñan
disciplina epistémica — es la tensión Hecho↔Supuesto aplicada a los números:

- **(A)** abanico probabilístico con pesos conocidos → anotar `Pr=p`, suma 1;
- **(B)** abanico ordinario de alternativas → no se anota nada; las ramas son
  alternativas sin peso;
- **(C)** abanico declarado probabilístico **sin pesos conocidos** → se
  declara explícitamente «probabilístico sin pesos»: ni inventar números ni
  dejar que un default uniforme silencioso se haga pasar por conocimiento.

### 14.3 m-de-f, NOT, rutas y escenarios

- **m-de-f combinatorial**: para abanicos de tamaño f > 2, «exactamente m de
  f» o «al menos m de f» (m < f), con m anotado junto al arco — el patrón «2
  de 3 custodios de llave».
- **NOT por ausencia**: OPM no tiene símbolo de negación. «P ejecuta solo si S
  está ausente» se modela dando a **S** estados `existente`/`no-existente` y
  conectando `no-existente` a *P* como condición o instrumento (§10.6 del
  manual metodológico).
- **Etiquetas de ruta**: cuando un proceso tiene varias entradas y salidas y
  hay que decir *cuál entrada lleva a cuál salida*, las etiquetas de ruta dan
  memoria: al salir se sigue el enlace cuya etiqueta coincide con la de
  entrada. `Por ruta carnívoro, *Preparar Alimento* consume **Carne**.` Un
  **escenario** es un conjunto de etiquetas de ruta que define una variante
  de ejecución; el conjunto de escenarios es el **repertorio de
  comportamiento** del sistema.
- **Objetos booleanos**: un objeto informacional de dos estados (`sí`/`no`)
  generado por un proceso de decisión, cuyos estados alimentan condiciones de
  procesos alternativos — el si-entonces-sino de OPM, generalizable a n
  estados como selección de casos.

### Preguntas de autoevaluación — Parte III

**P3.1** Explique desde Pre(P)/Post(P) por qué el resultado no admite `e` ni
`c`, y por qué el consumo sí.
**P3.2** Un modelador conecta con enlace de agente al «Módulo de IA
Diagnóstica». ¿Qué regla viola y cuál es la corrección?
**P3.3** ¿Qué diferencia conductual hay entre un enlace de instrumento sin
modificador y uno con `c`, cuando el instrumento falta?
**P3.4** ¿Cuándo es obligatorio el rayo de invocación y cuándo está prohibido?
**P3.5** Escriba el OPL de: «exactamente uno de los procesos *Aprobar* o
*Rechazar* genera el **Dictamen**».
**P3.6** ¿Por qué duplicar el estado `vacío` en `vacío_inicial` y
`vacío_final` es un anti-patrón, y cuál es la forma canónica?

---

# Parte IV — Complejidad: refinamiento, abstracción, composición

## §15 Los cuatro pares de refinamiento-abstracción

La tensión Detalle↔Abstracción no se resuelve eligiendo un nivel: se resuelve
con **mecanismos de ida y vuelta** entre niveles. OPM ofrece cuatro pares
canónicos, cada uno con su ámbito:

| Ámbito | Refinamiento | Abstracción |
|---|---|---|
| Estados | **Expresión de estados** | **Supresión de estados** |
| Estructura | **Despliegue** (*unfolding*) | **Plegado** (*folding*) |
| Comportamiento | **Descomposición** (*in-zooming*) | **Recomposición** (*out-zooming*) |
| Inter-modelo | **Referencia a sub-modelo** | Desconexión de la referencia |

### 15.1 Descomposición vs despliegue: la distinción síncrono/asíncrono

La decisión más importante al refinar un proceso:

- **Descomposición (in-zooming)** es **síncrona**: expone el contenido interno
  temporal — subprocesos ordenados por la línea de tiempo vertical — y el
  proceso padre espera a que todos completen antes de devolver el control
  (R-REF-SYNC-1). Se usa cuando los subprocesos tienen **orden** (total o
  parcial). OPL: `*Proceso* se descompone en *P1*, *P2* y *P3*, en esa
  secuencia.` (CX1); con paralelismo: `*Proceso* se descompone en paralelo
  *P1* y *P2*.` (CX2).
- **Despliegue (unfolding)** es **asíncrono**: revela refinadores por una
  relación estructural (partes, rasgos, especializaciones o instancias) sin
  implicar secuencia temporal alguna (R-REF-SYNC-2). OPL: `**Cosa** se
  despliega en SD1 en **T1**, **T2** y **T3**.` (CX3).

Regla de decisión metodológica: procesos con orden fijo → descomposición
(menos símbolos, OPL más corto, invocación implícita gratis); funciones
independientes que ocurren en cualquier orden (sistemas reactivos, servicios)
→ despliegue por agregación (*Mantener Seguridad del Hogar* consta de
*Atender Robo*, *Proteger contra Incendio* y *Alertar Terremoto* — nadie sabe
en qué orden llegarán). Y si los subprocesos son **variantes** de un mismo
patrón, no partes: generalización-especialización, no agregación.

### 15.2 Reglas duras de todo refinamiento

- **No trivialidad** (R-REF-NTRIV-1..3, AP-13): una descomposición exige ≥ 2
  subprocesos; un despliegue, ≥ 2 refinadores. Un refinamiento de un solo
  hijo no agrega información: se elimina, se pospone o se amplía.
- **Invariantes a través del refinamiento** (R-REF-4): esencia, perseverancia
  y nombre **no cambian** al refinar.
- **Sin ciclos** (R-REF-1, AP-16): nada se refina desde dentro de su propio
  árbol de refinamiento (chequeo transitivo).
- **Contorno grueso**: la cosa refinada en nuevo diagrama lo lleva en ambos
  OPDs — es el ancla visual de navegación. El refinamiento *dentro* del mismo
  diagrama no lo produce.
- **Profundidad justificada** (heurística): si un OPD de nivel N no agrega
  transformados, estados ni enlaces nuevos respecto de su padre, esa
  refinación probablemente sobra.

### 15.3 El árbol de OPDs y la identidad persistente

El **SD** (System Diagram) es el OPD raíz; cada descomposición engendra un
hijo: `SD` → `SD1` → `SD1.1`… El **árbol de procesos OPD** es el mecanismo
principal de navegación del modelo; el OPL completo del sistema se obtiene
concatenando los párrafos locales en el orden de navegación del árbol
(R-OPL-TOTAL-1).

Distinción de ingeniería del conocimiento que OPM legisla explícitamente
(R-IDP-0..3): la etiqueta `SD1.2` es **proyección humana de navegación** — muta
si se reordenan hermanos — y **no** es identidad. Todo OPD debe tener además un
**identificador persistente** estable (URI, UUID o equivalente en la
serialización), y toda referencia externa (documentos, trazabilidad, tests)
debe usar el identificador, no la etiqueta (AP-17). Tres canales separados que
no deben confundirse: orden temporal (declarado en la descomposición), orden
de navegación (derivado del árbol), identidad (persistente).

### 15.4 Expresión y supresión de estados

El mismo objeto puede mostrar estados distintos en OPDs distintos: se
**suprimen** los estados irrelevantes al contexto (marca `...` en el objeto) y
se **expresan** donde se conectan a procesos. Regla de completitud: el OPL de
un OPD expresa solo los estados visibles en ese OPD; el conjunto completo de
estados de un objeto es la **unión** sobre todos los OPDs (R-OPL-TOTAL-4/5).
Metodológicamente: estados suprimidos en el SD, expresados en SD1 donde los
subprocesos los transforman.

## §16 Descomponer sin romper: distribución, escisión, roles

### 16.1 Distribución de enlaces al descomponer

Cuando el proceso *P* enlazado a medio mundo se descompone, ¿qué pasa con sus
enlaces? La tabla normativa:

| Enlace del padre | ¿Puede quedar en el contorno exterior? | Distribución |
|---|---|---|
| Consumo | **PROHIBIDO** (V-37) | migra al **primer** subproceso; reasignar al que consume |
| Resultado | **PROHIBIDO** (V-37) | migra al **último** subproceso; reasignar al que genera |
| Efecto sin estados | permitido | a todos los subprocesos |
| Efecto entrada-salida | — | **escisión** TS4/TS5 (§16.2) |
| Agente / Instrumento | permitido | a todos los subprocesos |
| Estructural | no se distribuye | permanece en el contenedor |
| Evento desde objeto sistémico | **PROHIBIDO cruzar la frontera** (V-38) | — |
| Evento desde objeto ambiental | permitido cruzar | con modelado de contingencia |

El porqué de las prohibiciones: un consumo «al contorno» no dice *cuándo*
desaparece el consumido — y la semántica temporal (§9.3) exige saberlo; un
evento sistémico que salta directo a un subproceso intermedio rompería el
orden temporal prescrito de la descomposición síncrona (el mundo exterior
ambiental, en cambio, no respeta nuestros órdenes — por eso se le permite,
obligando a modelar la contingencia). Conectar un evento a un subproceso no
inicial exige verificar que los previos pueden omitirse sin dejar
precondiciones insatisfechas (AP-27).

### 16.2 Escisión del efecto entrada-salida

Si `*P* cambia **A** de `s1` a `s2`` y *P* se descompone en *P1*…*Pn*, el
modelo queda **subespecificado**: ¿qué subproceso saca a **A** de `s1` y cuál
lo pone en `s2`? La resolución canónica es **escindir** el enlace en un par
acoplado:

> `*P1* cambia **A** de `s1`.` (TS4 — el subproceso temprano saca del estado de entrada)
> `*Pn* cambia **A** a `s2`.` (TS5 — el subproceso tardío pone en el de salida)

Las dos mitades solo tienen sentido juntas y **no admiten modificadores de
control** (AP-08): saltarse una mitad del efecto distorsionaría su semántica.

### 16.3 Cambio de rol entre niveles

Un hallazgo elegante del ejemplo del lavavajillas: **Lavavajillas** es
*instrumento* de *Lavar Platos* en el SD, pero *afectado* en SD1 (*Cargar
Platos* lo cambia de `vacío` a `cargado`; *Descargar Platos* lo devuelve).
¿Contradicción? No — **cambio de rol legítimo** (R-ROL-1): válido si y solo si
el cambio neto del objeto en el nivel abstracto es **cero** (estado inicial =
estado final). El nivel abstracto no miente al llamarlo instrumento: visto
desde fuera, nada le cambió. Si el neto no es cero, debe ser afectado en ambos
niveles (R-ROL-3). Aplica solo a descomposición, no a despliegue.

### 16.4 Recomposición y fuerza semántica

Al abstraer (recomponer), los enlaces de los subprocesos migran al padre — y
pueden **colisionar**: dos subprocesos con enlaces distintos hacia el mismo
objeto competirían por un solo enlace abstracto, violando la unicidad de rol.
La colisión se resuelve por **fuerza semántica** (orden principal:
`consumo = resultado > efecto > agente > instrumento`; el modificador `e`
fortalece, el `c` debilita — 12 niveles en total). Casos notables de la matriz
transformadora: consumo+resultado sobre el mismo objeto se recompone como
**efecto** solo si hay continuidad de identidad y estados trazables;
consumo+consumo y resultado+resultado son **inválidos** (AP-30) — hay que
corregir el nivel hijo antes de abstraer. La fuerza semántica resuelve
colisiones de recomposición; no autoriza fusionar hechos distintos ni borrar
evidencia legítima.

### 16.5 Consistencia de hechos

Principio global (R-CONSIST-1/2): un hecho afirmado en un OPD **no debe
contradecir** un hecho de otro OPD del mismo modelo — pero refinamiento o
abstracción de un hecho **no es** contradicción. El cambio de rol de §16.3 es
exactamente eso: la versión abstracta y la detallada del mismo hecho.

## §17 Vistas, simplificación y el modelo como todo

- **Tipología de vistas**: el **OPD jerárquico** es el único nodo real del
  árbol de refinamiento; la **vista anclada** (mapa del sistema, árboles de
  procesos/objetos) ayuda a navegar; la **vista ad hoc** reúne hechos de
  varios OPDs para explicar un aspecto (el camino crítico, todos los agentes,
  la asignación a módulos). Ninguna vista crea hechos nuevos (R-VIEW-2) ni
  sirve de ancla de identidad.
- **Mapa del sistema**: vista anclada que muestra el contenido de cada OPD
  como nodo navegable; recomendado a partir de ~10 OPDs.
- **Simplificación de un OPD sobrecargado**: identificar el conjunto de cosas
  a extraer → nombrar un proceso interino que las contenga → recomponer en el
  diagrama → crear el OPD descendiente con lo extraído. Restricción
  (R-SIMP-2): prohibida si crearía enlaces procedimentales directos entre
  procesos pares sin semántica OPM.
- **Importancia proporcional** (R-IMP-1): la importancia de una cosa es
  proporcional al OPD más alto donde aparece — lo que está en el SD importa
  más que lo que solo vive en SD1.2.3. El árbol es también un mapa de
  relevancia.

## §18 Composición inter-modelo (avanzado)

Cuando el sistema crece más allá de un modelo — equipos concurrentes,
subsistemas con dueño propio — OPM ofrece el cuarto par: **composición por
referencia a sub-modelos**. Sus reglas esenciales:

- Un modelo individual referencia `0..*` sub-modelos y se vuelve **modelo
  compuesto por referencia** (R-META-4); el conjunto debe formar un **DAG**
  (grafo acíclico dirigido) de modelos.
- La dualidad OPD↔OPL se preserva **dentro** de cada modelo individual; la
  composición **no** colapsa los OPLs locales en un texto global único
  (R-META-5/6): cada modelo conserva su especificación autocontenida y la
  composición se declara con referencias explícitas (CM1–CM3).
- Una **referencia externa** no crea existencia nueva: la existencia pertenece
  al **modelo propietario**; el consumidor solo referencia (R-META-8). El
  consumidor no renombra, no agrega estados, no modifica lo referenciado
  (AP-18).
- El **contrato de interfaz** del sub-modelo se congela al crearlo: sin nuevas
  cosas compartidas, sin renombrar, sin estados nuevos sobre lo compartido; si
  la interfaz nació mal, se destruye y se recrea. Las conexiones entre modelo
  principal y sub-modelos se mantienen mínimas — bajo acoplamiento como
  condición de trabajo concurrente sano.

Es la resolución OPM de la tensión Modular↔Monolítico, y su lección
transferible: la modularidad no es partir el dibujo — es **gobernar la
frontera** (identidad persistente, propiedad, contrato congelado).

### Preguntas de autoevaluación — Parte IV

**P4.1** ¿Qué par de refinamiento usa para (a) las fases ordenadas de
*Facturar*; (b) las partes del **Motor**; (c) los tipos de **Alerta**?
**P4.2** ¿Por qué un consumo no puede quedar conectado al contorno exterior de
un proceso descompuesto?
**P4.3** Descomponga mentalmente `*Revisar* cambia **Informe** de `borrador` a
`aprobado`` en *Leer* y *Firmar*. Escriba las dos oraciones OPL del enlace
escindido.
**P4.4** ¿Bajo qué condición exacta un objeto puede ser instrumento en el SD y
afectado en SD1?
**P4.5** ¿Por qué `SDx.y` no sirve como identificador para trazabilidad
externa?

---

# Parte V — Método: del propósito al modelo verificado

## §19 El principio rector y la clasificación del sistema

Todo el método cuelga de una regla rectora única (§4 del manual metodológico):

> El modelado DEBE comenzar por la **función** del sistema, continuar con la
> delimitación de su **valor, agentes, entorno y transformados**, y solo
> después profundizar en estructura, control, simulación y gobernanza.

La función es la **semilla** del modelo; el SD precede a cualquier
refinamiento. Aquí OPM toma partido en una tensión de praxis — Top-down ↔
Bottom-up — y su criterio es explícito: partir de la visión (función/valor)
evita el vicio de catalogar componentes sin saber para qué existen. (La praxis
matizada: la heurística «desde el nivel medio» de §21 reconoce que a veces se
entra por donde mejor se entiende y se refina en ambas direcciones — el método
es top-down, la exploración puede no serlo.)

**Pre-etapa obligatoria — clasificar el sistema**, porque la clase determina
qué componentes del SD aplican:

| Clase | Propósito | Ocurrencia del problema | Agentes humanos | Ejemplo patrón |
|---|---|---|---|---|
| **Artificial** | sí | sí | sí | *Volar Avión*, *Cargar Batería* |
| **Natural** | **no** → se modela «resultado» | **no** | **no** — solo instrumentos | *Desarrollo Fetal*, *Formación de Tormenta* |
| **Social** | sí | sí | sí (condiciones ambientales con estado especificado) | *Realizar Conferencia* |
| **Socio-técnico** | sí | sí | sí (estructurales etiquetados frecuentes) | *Gestionar Identidad Profesional en Línea* |

Un sistema con partes informacionales sigue siendo físico si la transformación
dominante es física (*Transportar Equipaje* con software de tracking: físico).

## §20 Construcción del SD: el protocolo de doce etapas

El **asistente agnóstico de construcción del SD** es un protocolo de
interacción — válido como entrevista, formulario, checklist o flujo humano —
cuya regla central es exigente: cada etapa cierra con un **hecho del modelo
decidido**, no con una vaga comprensión. El asistente no termina cuando el
modelador «entiende» el sistema; termina cuando los hechos mínimos del SD
quedaron decididos.

| Etapa | Objetivo | Salida mínima |
|---|---|---|
| 0 | Clasificar el sistema | artificial / natural / social / socio-técnico |
| 1 | Fijar el proceso principal | nombre canónico deverbal (*Preparar Empanadas*) |
| 2 | Identificar el interesado primario | el grupo beneficiario, como objeto físico |
| 3 | Fijar el valor a transformar | atributo del beneficiario + estados entrada/salida |
| 4 | Fijar la función principal | el objeto proveedor de beneficio |
| 5 | Resolver la agencia humana | agentes válidos, o declaración explícita de ausencia |
| 6 | Delimitar el sistema | nombre del sistema + exhibición del proceso principal |
| 7 | Identificar habilitadores no humanos | conjunto de instrumentos |
| 8 | Fijar transformados | consumidos, afectados (con transición), resultantes |
| 9 | Delimitar el contexto externo | objetos/procesos ambientales |
| 10 | Modelar la ocurrencia del problema | proceso ambiental que causa el estado negativo — o `NO APLICA` explícito (naturales) |
| 11 | Compuerta de consistencia | verificación SD `PASA/FALLA` |

Detalles con más carga conceptual:

- **Etapa 3 — el valor como transición de estados.** El propósito se
  materializa como un atributo informacional del beneficiario con dos estados
  — el problemático y el mejorado: `*Preparar Empanadas* cambia **Nivel de
  Satisfacción** de **Grupo de Comensales** de `insatisfecho` a `satisfecho`.`
  Esto convierte el «para qué» — habitualmente prosa aspiracional — en un
  hecho verificable del modelo.
- **Etapa 4 — el objeto proveedor de beneficio.** Cuando el proceso transforma
  varios objetos, solo uno define la función; los demás se modelan pero no
  *son* la función.
- **Etapa 6 — exhibición.** El proceso principal se modela como **operación
  del sistema** vía exhibición-caracterización: `**Sistema de Preparación de
  Empanadas** exhibe *Preparar Empanadas*.` — el sistema es la cosa; su
  función, un rasgo que exhibe.
- **Etapa 10 — la ocurrencia del problema.** Imagen espejo del propósito: el
  proceso ambiental que causa el estado problemático (*Cocinar sin Sistema*
  causa `insatisfecho`). Modela por qué el sistema merece existir.

La **compuerta de verificación** del SD (etapa 11) revisa: propósito definido
(CRÍTICA), función definida (CRÍTICA), ≥1 habilitador (ALTA), entorno
identificado (MEDIA), ocurrencia del problema si aplica (MEDIA), OPL legible
(ALTA), nombres conformes (ALTA), exhibición presente (ALTA), ningún
instrumento con enlace de agente (ALTA).

## §21 Los niveles siguientes: SD1 y más allá

### 21.1 Elaboración progresiva de SD1

1. Inflar el proceso principal (contorno grueso en padre e hijo).
2. Agregar subprocesos (mínimo 2) en vertical según la línea de tiempo.
3. Renombrarlos con nombres de dominio significativos.
4. Traer los elementos externos conectados al padre.
5. Crear los objetos internos necesarios (operandos locales).
6. Agregar estados a los objetos transformados.
7. Crear los enlaces internos y **reasignar** consumos/resultados al
   subproceso específico (§16.1).

Verificación de SD1: cada subproceso conectado a ≥1 transformado (CRÍTICA —
el cierre transformador se hereda hacia abajo); consumo/resultado no en el
contorno (CRÍTICA); escisiones resueltas (ALTA); estados relevantes expresados
(ALTA); refinamiento del tipo correcto — síncrono→descomposición,
asíncrono→despliegue (ALTA).

### 21.2 Alcance interior vs exterior

Un **objeto interior** (creado dentro de un proceso descompuesto, sin
apariencia en el padre) existe solo en ese alcance y se elimina en cascada con
el padre. Un **objeto exterior** (nivel SD) existe con independencia. Mover
visualmente un objeto exterior dentro de la elipse inflada **no** lo vuelve
interior: el alcance es semántico, no posicional.

### 21.3 Estrategias de recorrido

- **Desde el nivel medio**: entrar por el nivel que mejor se entiende y
  refinar/abstraer en ambas direcciones.
- **En profundidad para documentos**: al modelar normas o estándares, agotar
  una cláusula antes de pasar a la siguiente — descubre inconsistencias
  locales más rápido que el barrido en anchura.
- **Cerrar la brecha objeto-proceso**: los documentos suelen separar la
  descripción de estructura y la de procesos sin integrarlas; el modelador
  conecta ambas vistas preguntando sistemáticamente «¿qué objeto transforma
  este proceso?» — la pregunta revela los **objetos implícitos** que el texto
  omite (heurística §9.14).

## §22 Heurísticas que separan al modelador del dibujante

1. **Proceso persistente → estructural etiquetado** (§9.1): si mantener el
   estado no requiere esfuerzo relevante, la relación es estructural
   (`**Cimentación** soporta **Casa**.`); si lo requiere (vuelo estacionario),
   es proceso.
2. **Objeto transiente → invocación** (§9.2): lo creado y consumido sin
   observación intermedia se suprime a favor del rayo.
3. **Dualidad de 1 y 2** (§9.3): la primera suprime *procesos* innecesarios;
   la segunda, *objetos* innecesarios. Aplicarlas juntas es la poda mínima que
   todo modelo merece.
4. **Estados directos vs atributo+valores** (§9.12): un solo atributo
   relevante → estados directos; varios atributos o semántica en el nombre →
   forma completa.
5. **Generalización como abstracción del SD** (§9.13): si varios específicos
   de SD1 tendrían la misma relación con el proceso principal, sube al SD un
   general que los englobe.
6. **Sinónimos y homónimos** (§9.15): OPM exige 1:1 entre cosas y nombres
   canónicos — cada sinónimo se resuelve eligiendo término canónico; cada
   homónimo, separando cosas.
7. **Emergencia como validación arquitectural** (§8.6): la arquitectura
   (estructura+comportamiento) debe producir al menos una capacidad
   **emergente** — que el todo exhibe y ninguna parte posee. Sin emergencia no
   hay sistema; hay una colección de piezas.
8. **Co-agentes y descomposición** (§9.18): agentes simultáneos → varios
   enlaces al mismo proceso; agentes en momentos distintos → descomponer y
   asignar cada uno a su subproceso.

## §23 Anti-patrones: el catálogo de los errores con nombre

Curado del canon (AP-*) a los errores más instructivos para quien aprende —
cada uno con su porqué:

| Anti-patrón | Por qué está mal | Corrección canónica |
|---|---|---|
| Estados de proceso («iniciado», «terminado») | los estados son de objetos; el proceso *es* devenir | descomponer en *Iniciar*, *Procesar*, *Finalizar* (AP-12) |
| Agente conectado a software/robot/IA | el agente se reserva a humanos responsables | enlace de instrumento (AP-05) |
| `e` o `c` sobre un resultado | el resultante no existe antes del proceso | mover el control al lado de entrada (AP-01/02) |
| Consumo/resultado en el contorno de un proceso descompuesto | no dice cuándo desaparece/aparece el objeto | reasignar al subproceso específico (AP-06) |
| Efecto entrada-salida sin escindir al descomponer | modelo subespecificado | par TS4/TS5 (AP-07) |
| Duplicar estados para evitar inicial+final | sinónimo falso; rompe la identidad del estado | doble designación en el estado único (AP-14) |
| Refinamiento de un solo hijo | no agrega información | ≥ 2 hijos, o eliminar/postergar (AP-13) |
| `c`/`e` sobre estructural o invocación | error de categoría: lo estructural es atemporal; la invocación ya es control | estado especificado estructural / nodo de decisión booleano (AP-09/10) |
| Evento sistémico cruzando la frontera de descomposición | rompe el orden temporal prescrito | mover el evento adentro, o reclasificar como ambiental (AP-21) |
| Sinónimos múltiples para la misma cosa | rompe la unicidad nominal | nombre canónico + variantes mapeadas (AP-22) |
| Proceso «de soporte» sin esfuerzo sostenido | reificación innecesaria | estructural etiquetado (AP-25) |
| Objeto transiente sin observación | reificación innecesaria | invocación (AP-26) |
| `SDx.y` como identificador externo | la etiqueta muta con el árbol | identificador persistente (AP-17) |

### Preguntas de autoevaluación — Parte V

**P5.1** ¿Por qué el método prohíbe modelar «propósito» en sistemas naturales
y qué se modela en su lugar?
**P5.2** ¿Qué distingue la salida de una etapa del asistente del SD de «haber
entendido» esa etapa?
**P5.3** En el SD de un sistema de telemedicina, ¿quién es el objeto proveedor
de beneficio si el proceso principal afecta al **Paciente**, consume
**Insumo Clínico** y genera **Registro de Atención**?
**P5.4** Un diagrama muestra *Almacenar* como proceso permanente entre
**Bodega** y **Mercadería**, sin atributo mantenido. ¿Qué heurística aplica y
qué produce?
**P5.5** ¿Qué es la emergencia y por qué funciona como criterio de validación
arquitectural?

---

# Parte VI — Dinámica: ejecución y simulación

## §24 Del modelo conceptual a la ejecución

### 24.1 Conceptual vs operacional

Distinción cardinal (R-EJEC-1): el **modelo conceptual** describe *patrones*
de estructura y comportamiento; una **instancia operacional** es una
ocurrencia identificable de una cosa durante la operación o simulación. Crear
una cosa en el modelo implica que al menos una instancia operacional suya (o
de una especialización) *puede* existir (R-INS-1) — pero un enlace entre cosas
**no implica comportamiento** hasta que existan instancias operacionales
(R-INS-4). El comportamiento vive en las instancias; el modelo, en los
patrones. Un modelo con nivel de detalle consistente es **realizable**:
implementable como simulación capaz de activar recursos, transformar objetos y
producir el valor funcional — ese es el criterio formal de completitud.

### 24.2 El ciclo de ejecución de un proceso

La semántica ECA completa, en orden:

1. **Evento**: si el proceso tiene disparadores, alguno debe ocurrir (OR).
   El evento se consume al evaluar, con o sin éxito.
2. **Condiciones**: se evalúan **antes** que todo lo demás; si alguna falla,
   el proceso **se omite** (bypass) y el control pasa al siguiente — la
   omisión precede a la espera (R-EJEC-7/8).
3. **Precondición**: Pre(P) completo — consumidos presentes, afectados en su
   estado de entrada, habilitadores disponibles. Si falta algo no condicional,
   el proceso **espera**.
4. **Inicio**: los consumidos desaparecen; los afectados salen de su estado de
   entrada (quedan *en transición*, indisponibles).
5. **Ejecución**: la duración transcurre (muestreada de la distribución si la
   hay); si excede la máxima o no llega a la mínima, disparan las excepciones.
6. **Término**: los resultantes comienzan a existir; los afectados entran a su
   estado de salida; las invocaciones de salida disparan (un proceso omitido
   **no** dispara sus invocaciones — R-EJEC-9).

El corpus modela este ciclo **con OPM mismo** — el modelo autorreferencial de
*Control del Desempeño de Procesos* (`opm-es` §Modelo de control), que
descompone *Controlar Desempeño* en *Iniciar Proceso* (evaluar precondición →
cancelar o iniciar) y *Ejecutar Proceso* (salida de estados de entrada y
consumo en paralelo → ciclo principal con comparación de tiempo → generación
de resultantes, entrada a estados de salida y notificación en paralelo). Vale
la pena estudiarlo: es a la vez lección de semántica y demostración de que OPM
alcanza para especificarse a sí mismo.

### 24.3 Tiempo, duración y estocasticidad

- La **duración** `(mín, esperada, máx)` se muestra dentro de la elipse con su
  unidad: `Procesar [min] (30.0, 45.6, 60.0)`.
- Con **distribución** declarada (normal, uniforme, exponencial…), cada
  instancia muestrea su duración; sin ella, toda instancia dura exactamente lo
  esperado — advertencia metodológica: eso es irreal para sistemas físicos.
- **Eventos temporizados**: objetos tipo reloj con valores concretos inician
  procesos en instantes definidos.
- **No-determinismo por defecto**: si un proceso genera un objeto con n
  estados sin especificar cuál, cada estado recibe probabilidad 1/n — regla de
  *simulación*, no licencia de modelado: para determinismo se conecta el
  resultado a un estado específico; para pesos reales, abanico probabilístico.

### 24.4 Herramientas conceptuales de análisis dinámico

- **Diagrama de vida útil**: para cualquier instante, qué objetos existen, en
  qué estado está cada uno y qué procesos están activos.
- **Espacio de estados compuesto**: el producto cartesiano de los conjuntos de
  estados de atributos y partes; no todo punto es factible, y los infactibles
  se identifican modelando los procesos que (no) pueden alcanzarlos.
- **Simulación conceptual vs ejecución computacional**: la primera anima el
  flujo de tokens para validar orden, precondiciones y cobertura; la segunda
  corre fórmulas y actualiza valores. Si el orden observado no coincide con el
  esperado: revisar alturas relativas, enlaces de control y condiciones.
- **Recorrido en profundidad**: la ejecución de un modelo desciende
  recursivamente al subproceso más profundo y retorna al padre al completar el
  último; en modelos compuestos, el cruce a un sub-modelo es una **transición
  explícita de frontera**, no la continuación de un árbol global imaginario.

### Preguntas de autoevaluación — Parte VI

**P6.1** ¿En qué momento exacto desaparece un consumido y aparece un
resultante, y qué implica para la disponibilidad entre subprocesos?
**P6.2** Un proceso fue omitido por condición. ¿Dispara sus invocaciones de
salida? ¿Y qué mecanismo permitiría detectar la omisión?
**P6.3** ¿Qué diferencia hay entre el estado `Current` declarado y el estado
actual de runtime?
**P6.4** ¿Por qué simular sin distribuciones de duración es «irreal», y qué
cambia al declararlas?

---

# Parte VII — OPM entre los formalismos

## §25 Lo que OPM congela, lo que deja en tus manos

Cerramos el arco abierto en la Parte 0. El Apéndice D da la tabla completa;
aquí, la lectura de conjunto en tres estratos:

**Lo congelado (capa A).** OPM tomó 24 decisiones sustantivas por ti, y las
tomó con un sesgo reconocible: *minimalismo con cierre*. Dos cosas y no
veinte; cinco familias base de enlace —más la extensión Forja explícita de
excepción— y no un vocabulario abierto; bimodalidad
obligatoria y no diagramas con leyenda opcional; herencia total y no herencia
à la carte. Cada cierre sacrifica flexibilidad superficial a cambio de algo
más valioso para sistemas complejos: **consistencia inter-modelador** — dos
personas competentes modelando el mismo dominio producen modelos comparables.

**Lo que sigue siendo tuyo (capa B — praxis).** Ningún formalismo decide
Incluir↔Omitir (qué es relevante), Ahora↔Después (qué postergar),
Compromiso↔Exploración, Fidelidad↔Utilidad, Completar↔Entregar. OPM, eso sí,
te da *instrumentos* para navegarlas con disciplina: el propósito declarado
(R-PRIN-1) disciplina el Incluir↔Omitir; las colecciones incompletas y el
«probabilístico sin pesos» permiten postergar *declarando* la deuda; las
compuertas de verificación convierten el «¿cuándo paro?» en criterio
explícito. La marca del buen modelador OPM no es que resuelve estas tensiones
«bien», sino que las resuelve **nombrándolas**.

**Lo que modula (capa C — contexto).** Un modelo exploratorio de una tarde y
la especificación de un sistema crítico difieren en profundidad, alcance y
ritmo — no en corrección. Un SD de seis cosas puede ser impecable; un modelo
de 400 entidades puede estar mal formado. El contexto jamás compra
indulgencias ontológicas.

**Comparación con otros formalismos, como método.** La forma disciplinada de
comparar OPM con ERD, BPMN, máquinas de estados o SysML no es la lista de
features: es preguntar **qué tensiones sustantivas congela cada uno, y cómo**.
ERD congela el ser (entidades, relaciones) y calla el devenir; BPMN congela el
devenir (flujo, compuertas) y trata el ser como anotación (data objects); las
máquinas de estados congelan Estático↔Dinámico *dentro* de un solo objeto;
SysML reparte las resoluciones en diagramas separados que el modelador debe
mantener coherentes a mano. OPM es de los pocos que congela ser **y** devenir
en la misma primitiva de diagrama, con la coherencia garantizada por
construcción (hecho único) y no por disciplina del equipo. Elegir formalismo
es elegir qué quieres que esté garantizado y qué estás dispuesto a vigilar tú.

## §26 OPM en la ingeniería de sistemas basada en modelos (MBSE)

MBSE reemplaza las especificaciones textuales — sin lenguaje estandarizado ni
verificación formal — por modelos conceptuales. El repertorio OPM para esa
práctica:

- **Conceptos alternativos de solución**: generar ≥ 3 modelos conceptuales
  distintos, destilar el **concepto** central de cada arquitectura (su
  principio físico o lógico rector) y explicitar los supuestos implícitos —
  antes de comprometerse (la tensión Compromiso↔Exploración, con protocolo).
- **Revisión preliminar de diseño (PDR)** con ocho secciones: portada,
  formulación del problema, propósito y motivación, supuestos y restricciones,
  soluciones alternativas, solución seleccionada con justificación, costos y
  cronograma de ciclo de vida, riesgos y mitigación.
- **Profundidad típica**: los modelos detallados abarcan **5 a 10 niveles**
  del árbol de procesos — el SD es la punta de un iceberg gobernado.
- **OPM como plano común**: especificación neutral entre disciplinas que
  hablan lenguajes distintos (mecánica, software, clínica…), precisamente
  porque el OPL se lee en lenguaje natural y el OPD no exige pericia previa.
- **Integración virtual**: modelos conceptuales de hardware controlados por
  software ejecutable real, para validar antes del prototipo físico.

## §27 El metamodelo y la conformidad (avanzado)

### 27.1 Tres capas y el constructo básico

El **metamodelo** de OPM (el modelo del lenguaje mismo) organiza todo modelo
individual en tres capas:

```text
Modelo OPM individual = conjunto de OPDs + especificación OPL + metadatos de identidad
Conjunto de OPDs → OPDs → constructos OPD → cosas + enlaces
Especificación OPL → párrafos → oraciones → frases y nombres reservados
```

El átomo del lenguaje es el **constructo básico**: exactamente **2 cosas + 1
enlace** (R-META-10). Todo OPD, por complejo que sea, se factoriza en
constructos; los abanicos y refinamientos múltiples son constructos
compuestos. Un enlace, a su vez, consta de origen, destino, conector, línea,
símbolo, etiqueta opcional y ruta opcional (R-META-13).

### 27.2 Niveles de conformidad

| Nivel | Exige |
|---|---|
| **Parcial (simbólico)** | usar exclusivamente símbolos OPM con semántica asignada |
| **Completo** | parcial + aplicación consistente de principios, contexto, refinamiento, dualidad OPD↔OPL y consistencia de hechos |
| **Herramienta** | completo + validación de conformidad + OPL según EBNF |

La escala también sirve al estudiante como vara de autoexigencia: dibujar
rectángulos y elipses correctos es conformidad *parcial*; mantener la
dualidad, el refinamiento sano y la consistencia de hechos en un modelo de
varios niveles es conformidad *completa* — y es ahí donde se demuestra que se
aprendió OPM y no solo su iconografía.

### Preguntas de autoevaluación — Parte VII

**P7.1** Formule con la lente de tensiones la diferencia esencial entre
modelar un dominio con BPMN y con OPM.
**P7.2** ¿Qué garantiza «por construcción» OPM que SysML deja a la disciplina
del equipo?
**P7.3** ¿Qué es el constructo básico y por qué importa que esté definido?
**P7.4** ¿Qué le falta a un modelo «simbólicamente» conforme para ser
completamente conforme?

---

# Apéndice A — Glosario esencial

Selección curada del glosario canónico (`urn:fxsl:kb:opm-es` §Glosario); el
número es la entrada canónica. Algunas definiciones se glosan levemente para
coherencia didáctica (p. ej. 3.78 se amplía con sus tres subtipos); ante
cualquier duda, manda la letra del corpus.

| Término | Definición | # |
|---|---|---|
| Cosa | Objeto o proceso | 3.76 |
| Objeto | Cosa con existencia física o informacional potencial | 3.39 |
| Proceso | Transformación de uno o más objetos | 3.58 |
| Estado | Situación o posición posible de un objeto | 3.68 |
| Transformación | Creación, consumo o cambio de estado de un objeto | 3.77 |
| Transformado | Objeto afectado, consumido o generado por un proceso | 3.78 |
| Afectado | Transformado cuyo estado cambia; debe tener estados | 3.2 |
| Consumido | Transformado que el proceso elimina | 3.10 |
| Resultante | Transformado que el proceso crea | 3.64 |
| Habilitador | Objeto que permite un proceso sin ser transformado | 3.17 |
| Agente | Habilitador humano (persona o grupo) | 3.3 |
| Instrumento | Habilitador no humano | 3.30 |
| Atributo | Objeto que caracteriza una cosa distinta de sí mismo | 3.4 |
| Valor de atributo | Estado de un atributo | 3.81 |
| Rasgo | Atributo u operación | 3.21 |
| Operación | Proceso que caracteriza una cosa (lo que hace) | 3.46 |
| Perseverancia | Persistente (objeto) / transitoria (proceso) | 3.50 |
| Función | Proceso que entrega valor funcional a un beneficiario | 3.23 |
| Beneficiario | Interesado que recibe valor de la operación del sistema | 3.6 |
| Valor funcional | Beneficio derivado de la función | 3.82 |
| Evento | Instante de creación de un objeto o de entrada a un estado que puede iniciar la evaluación de una precondición | 3.18 |
| Precondición | Condición para iniciar un proceso | 3.53 |
| Conjunto previo al proceso — Pre(P) | Objetos evaluados antes de iniciar | 3.54 |
| Conjunto posterior al proceso — Post(P) | Objetos que permanecen o resultan al completar | 3.52 |
| Refinable | Cosa susceptible de refinamiento: todo, exhibidor, general o clase | 3.61 |
| Refinador | Parte, rasgo, especialización o instancia | 3.62 |
| Refinamiento | Elaboración que incrementa detalle y completitud | 3.63 |
| Abstracción | Disminución del grado de detalle para mejorar comprensión | 3.1 |
| OPD | Representación gráfica OPM de un modelo o parte de él | 3.41 |
| OPL | Representación textual de OPM | 3.42 |
| SD (Diagrama de Sistema) | OPD raíz: función del sistema y contexto de máximo nivel | 3.75 |
| Contexto | Porción del modelo representada por un OPD y su párrafo OPL | 3.11 |
| Hecho de modelo | Relación entre dos cosas OPM o entre estados | 3.38 |
| Instancia operacional | Cosa identificable de forma única durante operación o simulación | 3.29 |
| Metamodelo | Modelo de un lenguaje de modelado | 3.37 |

# Apéndice B — Resumen de plantillas OPL-ES

Referencia rápida por familia; la fuente canónica es `urn:fxsl:kb:opl-es` y
las tablas-gate del canon prescriptivo. Tipografía: **objeto**, *proceso*,
`estado`.

**Descripción de cosas y estados**

| ID | Plantilla |
|---|---|
| D1–D4 | **Cosa** es física / informacional / ambiental / sistémica. |
| D11/D12 | **Cosa** es persistente / transitoria. |
| D5 | **Objeto** puede estar `e1`, `e2` o `e3`. |
| D7/D8/D9/D13 | Estado `s` de **Objeto** es inicial / es final / es por defecto / es declarado `Current`. |
| D10 | Estado `s` de **Objeto** es inicial y final. |

**Transformadores**

| ID | Plantilla |
|---|---|
| T1 | *Procesar* consume **Consumido**. |
| T2 | *Procesar* genera **Resultado**. |
| T3 | *Procesar* afecta **Afectado**. |
| TS1/TS2 | *Proceso* consume/genera **Objeto** en `estado`. |
| TS3 | *Proceso* cambia **Objeto** de `entrada` a `salida`. |
| TS4/TS5 | *Proceso* cambia **Objeto** de `entrada`. / a `salida`. |

**Habilitadores**

| ID | Plantilla |
|---|---|
| H1 / HS1 | **Agente** [en `estado`] maneja *Proceso*. |
| H2 / HS2 | *Proceso* requiere **Instrumento** [en `estado`]. |

**Eventos** (disparador + rol base)

| ID | Plantilla |
|---|---|
| ET1/ET2 | **Objeto** inicia *Proceso*, que consume/afecta **Objeto**. |
| EH1 | **Agente** inicia y maneja *Proceso*. |
| EH2 | **Instrumento** inicia *Proceso*, que requiere **Instrumento**. |
| ETS2 | **Objeto** en `entrada` inicia *Proceso*, que cambia **Objeto** de `entrada` a `salida`. |

**Condiciones** (bypass)

| ID | Plantilla |
|---|---|
| CT1 | *Proceso* ocurre si **Objeto** existe, en cuyo caso **Objeto** se consume, de lo contrario *Proceso* se omite. |
| CT2 | *Proceso* ocurre si **Objeto** existe, en cuyo caso *Proceso* afecta **Objeto**, de lo contrario *Proceso* se omite. |
| CH1 | **Agente** maneja *Proceso* si **Agente** existe, de lo contrario *Proceso* se omite. |
| CH2 | *Proceso* ocurre si **Instrumento** existe, de lo contrario *Proceso* se omite. |
| CS1–CS6 | variantes con `está en `estado`` |

**Excepción e invocación**

| ID | Plantilla |
|---|---|
| EX1 | *Manejo* ocurre si duración de *Fuente* excede máx-duración unidades-tiempo. |
| EX2 | *Manejo* ocurre si duración de *Fuente* es menor que mín-duración unidades-tiempo. |
| IV1 / IV2 | *Invocador* invoca *Invocado*. / *Invocador* se invoca a sí mismo. |

**Estructurales**

| ID | Plantilla |
|---|---|
| RF1 | **Todo** consta de **Parte1**, **Parte2** y **Parte3**. |
| RF2 / RF2b | **Exhibidor** exhibe **Atributo1** y **Atributo2** [así como *Operación1*]. |
| RF3 / RF3b | **E1** y **E2** son **General**. / **E** es un **General**. |
| RX1 / RX2 | **Especial** puede ser **G1** o **G2**. / puede ser uno de **G1**, **G2** o **G3**. |
| RH1 | **Especial** es un **General1** y un **General2**. |
| RF4 / RF4b | **Instancia** es una instancia de **Clase**. / **I1** e **I2** son instancias de **Clase**. |
| SE1 / SE2 | **Origen** etiqueta **Destino**. / **Origen** se relaciona con **Destino**. |
| SE4 / SE5 | **Origen** y **Destino** son etiqueta. / se relacionan. |
| — | Colección incompleta: «… y al menos otra parte / otro rasgo / otra especialización.» |

**Gestión de contexto**

| ID | Plantilla |
|---|---|
| CX1 | *Proceso* se descompone en *P1*, *P2* y *P3*, en esa secuencia. |
| CX2 | *Proceso* se descompone en paralelo *P1* y *P2*. |
| CX3 | **Cosa** se despliega en SD1 en **T1**, **T2** y **T3**. |
| CX4 | SD se refina por descomposición de *Proceso* en SD1. |

**Operadores y otros**

| Construcción | Plantilla ejemplo |
|---|---|
| XOR convergente (consumo) | *P* consume exactamente uno de **A**, **B** o **C**. |
| OR divergente (resultado) | *P* genera al menos uno de **A**, **B** o **C**. |
| XOR agente convergente | *P* es manejado por exactamente uno de **A** o **B**. |
| Ruta | Por ruta etiqueta, *Proceso* consume **Objeto**. |
| Atributo (valores) | **Atributo** de **Objeto** puede estar `v1`, `v2` o `v3`. |
| Atributo (rango) | **Atributo** de **Objeto** varía de X a Y. |
| Tipo | **Objeto** es de tipo tipo-id. |

# Apéndice C — Autoevaluación resuelta

**P0.1** Porque el formalismo trae decididas de antemano las tensiones
sustantivas (qué es cosa, cómo se compone, cómo se hereda), encarnadas en sus
primitivas. El experto en sintaxis conoce las primitivas; el experto en
modelar sabe además *qué tensión resuelve cada una* y navega con criterio las
que el formalismo no decide (praxis: qué incluir, cuándo parar, para quién).

**P0.2** Un SD exploratorio de 6 cosas para una conversación de pasillo
(contexto: poco tiempo, vida corta) es legítimamente poco profundo — pero si
un rectángulo lleva estados de proceso o un agente conecta a un software, está
*mal formado*, y ningún contexto lo excusa. Profundidad negociable; corrección
no.

**P0.3** (1) Minimalismo ontológico: dos clases de cosa y un solo tipo de
diagrama, contra la proliferación de tipos de caja y de diagramas. (2)
Unificación de función, estructura y comportamiento en el mismo formalismo,
contra su fragmentación en vistas separadas a reconciliar manualmente.

**P1.1** **Contrato**: persiste, no ocurre → objeto (informacional). *Firma
del Contrato*: ocurre en el tiempo, nombre deverbal, transforma al contrato
(de `borrador` a `firmado`) → proceso. **Vigencia del Contrato**: no ocurre ni
transforma; caracteriza al contrato → atributo (objeto) con valores, p. ej.
`vigente`/`expirada`.

**P1.2** Porque el estado es una situación estable de algo que *persiste*, y
un proceso es puro devenir: sus «fases» no son situaciones de una entidad sino
sub-devenires. El sustituto canónico es descomponer el proceso en subprocesos
(*Iniciar*, *Procesar*, *Finalizar*) — o, si de verdad se necesita un estado,
un atributo exhibido del tipo **Estado del Proceso** (AP-12).

**P1.3** La pregunta: ¿mantener ese estado exige esfuerzo/temporalidad
relevante al modelo? El estante no «se esfuerza»: relación estructural
etiquetada — `**Estante** sostiene **Conjunto de Libros**.` Si fuera un dron
sosteniendo la carga en vuelo estacionario, sería proceso persistente con
invariancia declarada.

**P1.4** No. «Afectar» es cambiar de estado (glosario 3.15); sin estados no
hay qué cambiar. Un objeto sin estados solo puede crearse (resultado) o
consumirse (consumo) — R-OBJ-2.

**P1.5** La propiedad no cambia durante la simulación (cardinalidades,
etiquetas, rutas); el atributo sí puede cambiar (sus valores son estados). Al
simular, solo los atributos participan de la dinámica; tratar una propiedad
como atributo introduce mutabilidad espuria, y lo inverso congela lo que debía
evolucionar.

**P2.1** Prohíbe que OPD y OPL sean dos modelos con vida propia: son
proyecciones de un único hecho canónico. Lo violaría una herramienta donde
editar el texto no regenere el diagrama (o viceversa), o donde el parser, ante
una oración ambigua, «invente» un grafo plausible en vez de rechazarla
(R-BI-2).

**P2.2** Porque la semántica debe viajar en canales normativos — forma,
contorno, sombreado, topología (R-COLOR-2) — de modo que el modelo sobreviva a
cambios de paleta, impresión en blanco y negro y daltonismo, y de que dos
herramientas distintas rendericen el mismo canon.

**P2.3** Objeto: **Conjunto de Documentos Firmados** (singular colectivo con
«Conjunto», capitalizado). Proceso: *Validar Documento* o *Validación de
Documento* (deverbal; «Sistema de Validación» nombra una cosa, no una acción).
Estado: `aprobado` (minúsculas).

**P2.4** `*Hornear* requiere **Horno**.` y `*Hornear* cambia **Masa** de
`cruda` a `horneada`.` (H2 + TS3; dos hechos, dos oraciones).

**P3.1** Los modificadores `e`/`c` operan sobre la *precondición*, que se
evalúa contra Pre(P) — lo que existe antes. El consumido pertenece a Pre(P):
puede disparar y condicionar. El resultante pertenece a Post(P): no existe
antes del proceso, luego no puede ser ni disparador ni precondición. La
prohibición no es convención: es consecuencia de la flecha del tiempo del
proceso.

**P3.2** Viola R-AG-1 (el agente se reserva a humanos; AP-05). Corrección:
enlace de instrumento — `*Diagnosticar* requiere **Módulo de IA
Diagnóstica**.` La prosa puede seguir llamándolo «agente»; el modelo, no.

**P3.3** Sin modificador: el proceso **espera** indefinidamente a que el
instrumento exista (requisito obligatorio; riesgo de interbloqueo si puede no
llegar). Con `c`: el proceso **se omite** y el control sigue (requisito
opcional).

**P3.4** Obligatorio: bucles (auto-invocación, retorno al padre), saltos fuera
del orden vertical y cruces entre OPDs. Prohibido: entre subprocesos
adyacentes ya ordenados por la línea de tiempo — sería doble vara (R-INV-2D):
el orden declarado de la descomposición ya dice eso.

**P3.5** `Exactamente uno de *Aprobar* o *Rechazar* genera **Dictamen**.`
(abanico XOR de resultado, convergente).

**P3.6** Porque crea dos nombres para la misma situación (sinónimo falso): el
`vacío` inicial y el final son *el mismo estado* del mismo objeto, y partirlo
rompe su identidad semántica (y toda consulta sobre él). Forma canónica: un
solo estado con doble designación — `Estado `vacío` de **Lavavajillas** es
inicial y final.` (D10, AP-14).

**P4.1** (a) Fases ordenadas → descomposición (síncrona, línea de tiempo).
(b) Partes del **Motor** → despliegue por agregación-participación.
(c) Tipos de **Alerta** → despliegue por generalización-especialización
(variantes de un patrón, no partes de un todo).

**P4.2** Porque el consumo tiene semántica temporal precisa — el consumido
desaparece al *inicio* del proceso que lo consume — y el contorno exterior no
identifica cuál subproceso lo consume ni cuándo. El modelo quedaría
subespecificado; el canon lo prohíbe (V-37) y exige reasignarlo al subproceso
específico.

**P4.3** `*Leer* cambia **Informe** de `borrador`.` (TS4, subproceso temprano)
y `*Firmar* cambia **Informe** a `aprobado`.` (TS5, subproceso tardío).

**P4.4** Que su cambio neto en el nivel abstracto sea cero: estado inicial =
estado final a través del proceso completo (R-ROL-1). El nivel detallado puede
moverlo por estados intermedios; visto desde arriba, nada cambió — el rótulo
«instrumento» sigue siendo verdad.

**P4.5** Porque `SDx.y` es una etiqueta de navegación que muta al reordenar o
insertar hermanos en el árbol. La trazabilidad externa exige el identificador
persistente del OPD, estable bajo renumeración (R-IDP-1..3).

**P5.1** Porque el propósito presupone intención, y los sistemas naturales no
la tienen: se modela el **resultado** (que puede ser beneficioso o
perjudicial), sin ocurrencia del problema y sin agentes humanos — solo
instrumentos.

**P5.2** La salida es un **hecho del modelo decidido y representable** en
OPD/OPL (un nombre canónico, una transición de estados, un conjunto de
agentes). «Entender» es estado mental; el asistente cierra etapas con
compromisos verificables.

**P5.3** El **Paciente** (o su atributo de salud): es quien recibe el valor
funcional. El **Registro de Atención** es un resultante necesario pero no es
la función; el **Insumo Clínico** es un consumido. Solo el objeto proveedor de
beneficio define la función (etapa 4).

**P5.4** Heurística proceso-persistente→estructural (§22.1): si almacenar no
exige esfuerzo sostenido relevante, produce `**Bodega** almacena
**Mercadería**.` — un estructural etiquetado, en vez de un pseudo-proceso con
instrumento y afectado.

**P5.5** Capacidad que el sistema completo exhibe y ninguna parte posee
aisladamente. Valida la arquitectura porque justifica que las partes formen
*ese* todo: si no emerge nada, no hay sistema — hay inventario.

**P6.1** El consumido desaparece **al inicio** del proceso que lo consume; el
resultante aparece **al completarse** el que lo genera. Entre subprocesos:
nada posterior puede usar lo ya consumido, nada anterior puede ver lo aún no
generado — el orden de la descomposición es también un orden de
disponibilidad.

**P6.2** No — un proceso omitido no dispara sus invocaciones de salida
(R-EJEC-9). La omisión puede detectarse con un enlace de excepción por
**subtiempo**: duración efectiva 0 < mínimo positivo → se activa el manejador.

**P6.3** `Current` declarado es una **designación persistente** decidida por
el modelador (parte del modelo conceptual, cardinalidad 0..1); el estado
actual de runtime es la posición **efímera** de una instancia durante una
simulación. Canales distintos, marcas visuales distintas (R-EST-4).

**P6.4** Sin distribución, toda instancia dura exactamente la duración
esperada — un mundo sin varianza que ningún sistema físico habita. Declarar la
distribución hace que cada instancia muestree su duración, habilitando
análisis estocástico honesto (colas, sobretiempos, percentiles).

**P7.1** BPMN congela el devenir — flujo, compuertas, eventos — y deja el ser
como anotación marginal (data objects sin ontología fuerte); OPM congela ser y
devenir en la misma primitiva, obligando a cada proceso a declarar qué objetos
transforma. Modelar en BPMN responde «¿en qué orden pasan las cosas?»; en OPM,
además, «¿qué es lo que cambia, y de qué estado a cuál?».

**P7.2** La coherencia entre vistas. En SysML, estructura (BDD/IBD),
comportamiento (actividades, estados) y requisitos viven en diagramas
separados cuya consistencia mantiene el equipo; en OPM el hecho es único y
OPD/OPL son proyecciones regeneradas — la divergencia silenciosa es imposible
por construcción (R-BI-0/1).

**P7.3** Exactamente 2 cosas + 1 enlace (R-META-10): el átomo en que se
factoriza todo OPD. Importa porque da unidad de análisis (validación, conteo,
comparación de modelos) y porque define el grano de la bisimetría: cada
constructo mapea a oraciones OPL y viceversa.

**P7.4** La conformidad parcial solo exige símbolos correctos. La completa
añade la aplicación consistente de los principios (propósito, límite del
sistema), la gestión de contexto y refinamiento sanos, la dualidad OPD↔OPL
mantenida y la consistencia de hechos entre OPDs — es decir, todo lo que no se
ve en un diagrama aislado.

# Apéndice D — Mapa completo tensión → resolución OPM

Las 24 tensiones sustantivas (`urn:fxsl:kb:tensiones-modelamiento`, capa A) y
la postura de OPM ante cada una. «Resuelta» = primitiva dedicada; «apoyada» =
OPM da instrumentos sin decidir; «delegada» = queda a la praxis.

| # | Tensión | Postura | Resolución / instrumento OPM |
|---|---|---|---|
| A1.1 | Entidad ↔ Evento | resuelta | objeto vs proceso; prueba objeto-proceso; perseverancia |
| A1.2 | Concreto ↔ Abstracto | resuelta | esencia física/informacional (sombra) |
| A1.3 | Token ↔ Type | resuelta | clasificación-instanciación; instancia operacional vs cosa |
| A1.4 | Todo ↔ Partes | resuelta | agregación-participación; descomposición/recomposición |
| A1.5 | General ↔ Particular | resuelta | generalización-especialización; herencia total; discriminantes |
| A1.6 | Simétrico ↔ Asimétrico | resuelta | etiquetados uni/bidireccional/recíproco |
| A2.1 | Estático ↔ Dinámico | resuelta | estructurales (invariantes) vs procedimentales (temporales) |
| A2.2 | Instantáneo ↔ Durativo | resuelta | proceso con duración positiva; evento como instante |
| A2.3 | Secuencial ↔ Paralelo | resuelta | línea de tiempo vertical; paralelismo por altura; CX1/CX2 |
| A2.4 | Causa ↔ Efecto | resuelta | transformadores; invocación; ECA |
| A2.5 | Agente ↔ Paciente | resuelta | habilitador vs transformado; unicidad de rol |
| A2.6 | Determinista ↔ Probabilista | resuelta | abanicos `Pr=p`; distribución de duración; default 1/n |
| A3.1 | Conocido ↔ Desconocido | apoyada | colecciones incompletas; supresión de estados |
| A3.2 | Cierto ↔ Incierto | apoyada | «probabilístico sin pesos» declarado (R-FAN-PROB-1 C) |
| A3.3 | Hecho ↔ Supuesto | delegada | disciplina del modelador; OPM exige declarar, no verifica |
| A3.4 | Explícito ↔ Tácito | apoyada | cierre transformador fuerza a explicitar objetos implícitos |
| A3.5 | Situado ↔ Universal | resuelta | afiliación sistémico/ambiental; contexto por OPD |
| A3.6 | AND ↔ OR ↔ XOR | resuelta | abanicos lógicos con arco; m-de-f |
| A4.1 | Visual ↔ Textual | **disuelta** | bimodalidad OPD↔OPL: ambos polos, hecho único |
| A4.2 | Formal ↔ Informal | **disuelta** | OPL: lenguaje natural controlado con EBNF |
| A4.3 | Compacto ↔ Verboso | apoyada | mecanismos de abstracción; 20–25 cosas/OPD; heurísticas de poda |
| A4.4 | Prescriptivo ↔ Descriptivo | delegada | OPM modela ambos; la clasificación del sistema orienta (propósito vs resultado) |
| A4.5 | Detalle ↔ Abstracción | resuelta | jerarquía de OPDs; cuatro pares refinamiento/abstracción |
| A4.6 | Modular ↔ Monolítico | resuelta | sub-modelos por referencia; contrato de interfaz congelado |

Las 16 tensiones de praxis (B) y 12 de contexto (C) no aparecen aquí porque
**ningún formalismo las resuelve** — véanse §0.2, §25 y, para navegarlas con
protocolo, la skill `pensamiento-modelador` sobre el kb
`urn:fxsl:kb:tensiones-modelamiento`.

# Apéndice E — Fuentes y trazabilidad

| Fuente | URN | Aporta a este manual |
|---|---|---|
| OPM — Núcleo conceptual | `urn:fxsl:kb:opm-es` (v3.0.x) | ontología, principios, glosario, semántica de enlaces, metamodelo, ejemplos canónicos |
| OPL-ES | `urn:fxsl:kb:opl-es` (v3.0.x) | plantillas textuales, vocabulario, decisiones de diseño del español |
| OPD — Gramática visual | `urn:fxsl:kb:opd-es` | geometría, marcadores, reglas `V-*` (citadas vía canon prescriptivo) |
| Manual metodológico | `urn:fxsl:kb:manual-metodologico-opm-es` (v3.0.x) | método del SD, refinamiento, heurísticas, verificación, control de flujo |
| Reglas OPM estrictas | `urn:fxsl:kb:reglas-opm-estrictas-es` (v1.4.x) | reglas `R-*`, anti-patrones `AP-*`, tablas-gate de bisimetría |
| Tensiones del modelamiento | `urn:fxsl:kb:tensiones-modelamiento` (v1.0.0) | marco de las 52 tensiones (Partes 0, VII, Apéndice D) |
| ISO/PAS 19450 | — | estándar de referencia de OPM (operacionalizado por el corpus) |

**Nota de alcance.** El núcleo didáctico de este manual es deliberadamente
**agnóstico de herramienta**: ninguna operación depende de una interfaz o de
un modelador concreto. Las extensiones propias de Forja se declaran y etiquetan
como tales; pueden omitirse sin perder el aprendizaje ni la práctica de OPM
base. Quien, ya formado en la teoría, quiera usar esas extensiones y operar OPM
en la mesa opforja, continúa en `docs/manual-opforja.md` (método Forja) y
`docs/uso-productivo.md` (operación).

*Fin del manual.*
