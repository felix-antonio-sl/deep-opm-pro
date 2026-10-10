---
urn: urn:fxsl:kb:spec-forja-opd-es
nombre: spec-forja-opd-es
version: 2.0.0
estado: publicado
descripcion: "Notación gráfica del OPD según ISO 19450, en español: símbolos de cosas y estados, puntas y marcas de enlace, triángulos estructurales, operadores lógicos, multiplicidad y representación del refinamiento."
fuente: "ISO/PAS 19450:2015, revisión cláusula por cláusula (2026-10-10); sustituye la sincronización KB previa"
autor: FS
creado: 2026-06-04
lang: es
tags: [opd, spec, visual, gramatica-grafica]
familia: bok
depende: [urn:fxsl:kb:reglas-opm-estrictas-es]
refina: []
cita: [urn:fxsl:kb:spec-forja-opl-es, urn:fxsl:kb:metodologia-forja-opm-es]
---

# Notación OPD (ISO 19450) en español

## Definición

Este documento fija la notación gráfica del diagrama objeto-proceso (OPD) tal como la define ISO/PAS 19450:2015:
el símbolo de cada cosa (forma, sombreado, contorno), los estados y su supresión, las puntas y marcas de cada
enlace, los triángulos de las relaciones estructurales fundamentales, los enlaces etiquetados y sus arpones, los
enlaces con estado especificado, la multiplicidad, los arcos de abanico, las etiquetas de ruta, la representación
del refinamiento y el orden vertical de los subprocesos. Sólo contiene lo fundado en la norma.

La validez de cada construcción (qué combinación es admisible) vive en `reglas-opm-estrictas-es` y aquí se cita por
ID; la oración OPL equivalente vive en `spec-forja-opl-es`. La realización gráfica de OpForja (medidas, colores,
tipografía, capas, lienzo, interacción, edición, simulación, export) vive en el perfil `opd-opforja`.

## Precedencia

1. Reglas (`reglas-opm-estrictas-es`) > especificaciones (este documento y `spec-forja-opl-es`) > metodología
   (`metodologia-forja-opm-es`).
2. Ante duda sobre el contenido, manda la norma (ISO/PAS 19450:2015).
3. El perfil `opd-opforja` se subordina a este documento: lo realiza, lo endurece o lo extiende, y no lo contradice.

## Convenciones

- Cita: `ISO §x.y` con la numeración de ISO/PAS 19450:2015; las tablas y figuras se citan «Tabla n» y «Figura n».
  Toda regla cita al menos una cláusula.
- Modalidad: *shall* → DEBE; *shall not* → NO DEBE; *should* → DEBERÍA; *should not* → NO DEBERÍA; *may* → PUEDE.
  Un enunciado sin palabra modal describe la notación.
- `[informativo]`: lo funda sólo un anexo informativo (B, C, D), una NOTE, un EXAMPLE o una figura; nunca lleva DEBE.
- `[localización]`: realización española de una forma de la norma.
- «no verificable»: la fuente local resume la cláusula o le falta la figura de la que depende el enunciado.
- `- **ID** = R-…`: la definición única de la regla vive en el documento dueño (`reglas` para validez y semántica);
  aquí sólo se registra la remisión.
- Referencias cruzadas sólo por ID o por `<documento> §n` (`reglas §5.2`, `spec-OPL §3`).
- Identificadores: `R-OPD-<ÁREA>-<n>`. Los constructos T1…TS5, H1/HS1, H2/HS2, SE1…SE5, SSE1…SSE7, RF1…RF4, IV1–IV2 y
  EX1–EX2 son los mismos que usa `spec-forja-opl-es`.

Secciones trasladadas al perfil `opd-opforja`: §1, §13, §14, §16, §17, §18, §21, §22, §24, §25, Apéndice A y
Apéndice C completas; la parte de producto de §2, §3, §4, §5, §6, §7, §8, §9, §10, §11, §12, §15, §19, §20 y §23.

## Definiciones

| Término | Definición |
| --- | --- |
| Cosa | Objeto o proceso (ISO §7.3.1). El objeto se dibuja como rectángulo y el proceso como elipse (ISO §7.1.2, §7.2.2). |
| Estado | Condición en que un objeto puede estar, o valor que puede tomar, durante un lapso; se dibuja como rectángulo de esquinas redondeadas dentro de su objeto (ISO §3.68, §7.3.5.2). |
| Marca de enlace | Símbolo que porta el tipo de un enlace: punta cerrada o abierta, arpón, piruleta, triángulo, zigzag, barra, arco, «e»/«c» (ISO §4, §9, §10, §12). |
| Piruleta | Círculo al final de la línea de un enlace habilitador: relleno (negro) para el agente, vacío (blanco) para el instrumento (ISO §9.4.1, §9.4.2). |
| Constructo básico | Dos cosas unidas por un enlace; unidad mínima de correspondencia OPD↔OPL [informativo] (ISO §C.3). |
| Abanico | Dos o más enlaces procedimentales del mismo tipo con un extremo común en la misma cosa, con semántica XOR u OR; el extremo común es el extremo convergente de ISO §12.2. Los enlaces AND no forman abanico (ISO §12.1, §12.2). |
| Esencia | Propiedad genérica de toda cosa: física o informacional (ISO §7.3.3). Su símbolo es el sombreado [informativo] (ISO §4; Figura C.10). |
| Afiliación | Propiedad genérica de toda cosa: sistémica o ambiental (ISO §7.3.3); por defecto, sistémica (ISO §7.3.4). Su símbolo es el contorno continuo o discontinuo [informativo] (ISO §4; Figura C.10). |
| Perseverancia | Propiedad genérica de toda cosa: estática (objeto) o dinámica (proceso) (ISO §7.3.3); no tiene símbolo propio: la porta la forma. |
| Conjunto de objetos previo al proceso, Pre(P) | Objetos consumidos, afectados y habilitadores cuya existencia o estado forma la precondición del proceso (ISO §3.54, §8.2.2). Sólo sus enlaces hacia el proceso admiten «e»/«c» (ISO §9.5.1). |
| Refinable / refinado | Cosa que se refina / cosa que la refina: parte, rasgo, especialización, instancia o subproceso (ISO §3.61, §3.62, §3.35). |
| Contexto de descomposición | Símbolo agrandado del refinable que contiene a sus refinados y a los enlaces entre ellos (ISO §3.33, §14.2.1.3). |
| Aparición | Presencia de una cosa en un OPD; una cosa PUEDE aparecer en varios OPD y varias veces en uno, y sigue siendo la misma cosa [informativo] (ISO §B.4, §B.5). |

## §2 Cosas: las ocho representaciones

### §2.1 Producto de tres rasgos gráficos

Toda cosa se dibuja con uno de ocho símbolos, producto de tres rasgos gráficos independientes (ISO §4, §7.3.3;
Figuras C.10–C.11 [informativo]):

| Rasgo gráfico | Valores | Denota |
| --- | --- | --- |
| Forma | rectángulo / elipse | objeto / proceso (ISO §7.1.2, §7.2.2) |
| Sombreado | sombreado / plano | esencia física / informacional [informativo] (ISO §4; Figura C.10) |
| Contorno | continuo / discontinuo | afiliación sistémica / ambiental [informativo] (ISO §4; Figura C.10) |

- **R-OPD-COSA-1** (ISO §7.1.2, §7.2.2, §7.3.1, §7.3.3): una cosa es objeto o proceso; el objeto se dibuja como
  rectángulo con su nombre dentro y el proceso como elipse con su nombre dentro. No hay otra clase de cosa dibujable.
  La perseverancia no tiene símbolo propio: la porta la forma.
- **R-OPD-COSA-2** (ISO §7.3.4, §3.55): el valor por defecto de la afiliación es sistémico, de modo que el contorno
  continuo es el de defecto. La esencia primaria del sistema es la de la mayoría de sus cosas. El valor por defecto
  de la esencia de cada cosa es no verificable (la fuente local resume ISO §7.3.4).
- **R-OPD-COSA-3** [informativo] (ISO §4; Figura C.10): el sombreado denota sólo la esencia física: una cosa física
  se dibuja sombreada y una informacional, plana. Una sombra que no denote esencia física NO DEBERÍA aparecer en el
  OPD.
- **R-OPD-COSA-4** (ISO §14.2.3; §B.4 [informativo]): el contorno de una cosa, continuo o discontinuo, es el mismo
  en todo OPD donde aparece: la afiliación es un hecho del modelo y ningún OPD contradice a otro.
- **R-OPD-COSA-7** (ISO §3.68, §7.3.5.2): los estados son de los objetos; dentro de la elipse de un proceso NO DEBE
  dibujarse ningún estado (R-PROC-4).

Ejemplo [informativo] (Figura C.11): un objeto físico ambiental es un rectángulo sombreado de contorno discontinuo.
Incorrecto: denotar la esencia física con un color de relleno en lugar del sombreado.

Bimodal: cambiar cualquiera de los tres rasgos cambia el hecho y su oración de esencia o de afiliación
(ISO §6.2.1, §A.4.4.2; spec-OPL §2.7, §2.8).

## §3 Estados y designaciones

### §3.1 Símbolo y contención

- **R-OPD-EST-1** (ISO §3.68, §7.3.5.2): el estado se dibuja como rectángulo de esquinas redondeadas con su nombre,
  dentro del rectángulo de su objeto dueño. Un estado NO DEBE dibujarse fuera de un objeto (R-EST-1).
- **R-OPD-EST-3** = R-EFE-1 (ISO §3.2).
- **R-OPD-EST-4** (ISO §7.3.5.5, §10.3.3.2, §11.3): los valores de un atributo son estados del objeto atributo y se
  dibujan igual que los estados, dentro del atributo: un valor discreto, un rango de valores o el valor concreto de
  una instancia. Un atributo PUEDE declarar su unidad de medida.

### §3.2 Designaciones

| Designación | Símbolo | Por objeto | Cláusula |
| --- | --- | --- | --- |
| Inicial | contorno grueso | uno o más | ISO §7.3.5.3, §7.3.5.4, §A.4.4.4, §12.7 |
| Final | contorno doble | uno o más | ISO §7.3.5.3, §7.3.5.4, §A.4.4.4 |
| Por defecto | flecha diagonal que apunta al estado | a lo sumo uno | ISO §7.3.5.3, §7.3.5.4 |
| Sin designación | contorno simple | — | ISO §7.3.5.2 |

- **R-OPD-EST-5** [informativo] (ISO §14.2.1.3 Figura 47; §14.2.2.6 Tabla 26): un estado PUEDE ser a la vez
  inicial y final. La forma del símbolo combinado (contorno grueso y doble a la vez) es no verificable (figura
  ausente).
- **R-OPD-EST-7** (ISO §7.3.5.4): la marca del estado por defecto es una flecha diagonal que apunta al estado; la
  forma de su punta es no verificable (figura ausente).

### §3.3 Supresión de estados

- **R-OPD-EST-8** (ISO §14.2.1.1): la supresión de estados es por OPD: en cada OPD el modelador PUEDE suprimir
  cualquier subconjunto de los estados de un objeto. Suprimir no elimina el estado del modelo: el conjunto completo
  de estados de un objeto es la unión de los estados con que aparece en todos los OPD, y el OPL de un OPD expresa
  sólo los estados que ese OPD muestra (R-OPL-TOTAL-4, R-OPL-TOTAL-5).
- **R-OPD-EST-9** (ISO §14.2.1.1, §A.4.4.4): cuando un objeto muestra un subconjunto propio de sus estados (al menos
  uno, no todos), DEBE exhibir en su esquina inferior derecha el símbolo de supresión de estados: un estado pequeño
  rotulado con una elipsis. Su equivalente textual es la frase reservada «, y otros estados» [localización]
  (spec-OPL §2.3, §7.4).

## §4 Enlaces transformadores

### §4.1 Clases de enlace y direcciones

Clasificación (ISO §6.2.4, §8.1.1, §9.5.1, §9.5.2.5, §10.1): todo enlace es procedimental o estructural. Los
procedimentales son transformadores (consumo, resultado, efecto), habilitadores (agente, instrumento) o de control;
los de control son el enlace de evento —del que la invocación es un caso—, el de condición y el de excepción. Los
estructurales son fundamentales (agregación, exhibición, generalización y clasificación) o etiquetados. La
validez de cada clase vive en reglas §5.

| Tipo | ID | Símbolo | Cláusula |
| --- | --- | --- | --- |
| Consumo | T1 | flecha con punta cerrada del objeto al proceso | ISO §9.1.2, §9.1.5 |
| Consumo con estado | TS1 | flecha con punta cerrada del estado al proceso | ISO §9.3.1 |
| Resultado | T2 | flecha con punta cerrada del proceso al objeto | ISO §9.1.3, §9.1.5 |
| Resultado con estado | TS2 | flecha con punta cerrada del proceso al estado | ISO §9.3.2 |
| Efecto | T3 | flecha bidireccional con punta cerrada en cada extremo | ISO §9.1.4, §9.5.2.1 |
| Efecto entrada-salida | TS3 | par de flechas de punta cerrada: estado de entrada → proceso y proceso → estado de salida | ISO §9.3.3.2 |
| Efecto con estado de entrada | TS4 | par de flechas: estado de entrada → proceso y proceso → objeto, sin estado | ISO §9.3.3.3 |
| Efecto con estado de salida | TS5 | par de flechas: objeto, sin estado → proceso y proceso → estado de salida | ISO §9.3.3.4 |

- **R-OPD-TR-1** (ISO §9.1, §9.3, §9.5.2.5): consumo, resultado y efecto usan la misma punta cerrada; el tipo lo
  portan la dirección y el anclaje de la flecha, no el color. La invocación también termina en punta cerrada, pero
  su tipo lo porta el trazo en zigzag (R-OPD-INV-1).
- **R-OPD-TR-2** (ISO §9.1.5): origen y destino de la flecha fijan el tipo de transformación; invertir la flecha
  cambia el hecho (consumo ↔ resultado).
- **R-OPD-TR-3** = R-RES-1 (ISO §9.3.2, Figura 10).
- **R-OPD-TR-4** = R-EFE-3 (ISO §9.3.3.3).
- **R-OPD-TR-5** = R-ROL-UNIC-1 (ISO §8.1.2); al recomponer rige R-OPD-REF-13.
- **R-OPD-TR-8** = R-PROC-2 (ISO §7.2.1, §7.3.2).

### §4.2 Enlaces con estado especificado

- **R-OPD-TR-6** (ISO §8.1.3, §9.3.1, §9.3.2, §9.3.3): el extremo con estado especificado se ancla al estado, no al
  rectángulo del objeto. En los efectos con estado sólo de entrada (TS4) o sólo de salida (TS5), el otro enlace del
  par se ancla al rectángulo del objeto. El anclaje porta el hecho.
- **R-OPD-TR-7** (ISO §14.2.2.4.3, Tabla 25): al descomponer un proceso que cambia un objeto de un estado de entrada
  a uno de salida, el OPD queda subespecificado hasta que el modelador asigna el par de forma temporalmente
  factible: ambos enlaces a un mismo subproceso, o escindidos, con la mitad de entrada (desde el estado de entrada)
  en un subproceso anterior y la mitad de salida (hacia el estado de salida) en uno posterior. Ninguna mitad
  escindida lleva modificador de control: la de entrada no tiene versión de control (Tabla 25 NOTE 1) y la de salida
  sale del proceso (ISO §9.5.1). Validez: R-ESCIND-1..3, R-ESC-1.

Bimodal: T1 ↔ «consume», T2 ↔ «genera», T3 ↔ «afecta», TS3 ↔ «cambia … de … a …»; las mitades escindidas ↔
«cambia … de …» y «cambia … a …» (ISO §9.1.2–§9.1.4, Tabla 25; spec-OPL §3).

## §5 Enlaces habilitadores

| Tipo | ID | Símbolo | Origen |
| --- | --- | --- | --- |
| Agente | H1 / HS1 | línea del agente (o de su estado) al proceso, con piruleta negra (círculo relleno) en el extremo del proceso | humano o grupo de humanos (ISO §9.2.2, §9.4.1) |
| Instrumento | H2 / HS2 | línea del instrumento (o de su estado) al proceso, con piruleta blanca (círculo vacío) en el extremo del proceso | habilitador no humano (ISO §9.2.3, §9.4.2) |

- **R-OPD-HAB-1** = R-AG-1A (ISO §9.2.2, §9.2.3).
- **R-OPD-HAB-2** (ISO §9.4.1, §9.4.2): la piruleta es el círculo terminal de una línea que va del habilitador al
  proceso; un círculo sin línea no denota agente ni instrumento.
- **R-OPD-HAB-3** (ISO §9.4.1, §9.4.2): el habilitador con estado especificado (HS1, HS2) parte del estado: habilita
  el proceso sólo cuando el objeto está en ese estado.
- **R-OPD-HAB-4** = R-ROL-UNIC-1 (ISO §8.1.2, §14.2.4.1).

Bimodal: H1 ↔ «maneja», H2 ↔ «requiere»; con estado especificado, el estado califica al habilitador
(ISO §9.2.2, §9.2.3, §9.4.1, §9.4.2; spec-OPL §4).

## §6 Enlaces de control y operadores lógicos

### §6.1 Modificadores de control «e» y «c»

- **R-OPD-CTL-1** (ISO §3.13, §8.1.1, §9.5.1): un modificador de control, «e» (evento) o «c» (condición), se dibuja
  junto a un enlace transformador o habilitador que entra al proceso y lo convierte en el enlace de control
  correspondiente; no agrega cosas ni enlaces (R-ECA-4).
- **R-OPD-CTL-2** (ISO §9.5.2.1, §9.5.3.1, §9.5.3.2): «e» y «c» se escriben en minúscula, cerca de la punta o del
  extremo del proceso del enlace que modifican.
- **R-OPD-CTL-3** (ISO §9.5.1): el modificador sólo se dibuja junto a un enlace del objeto o de un estado al proceso:
  consumo, efecto, agente o instrumento, con o sin estado especificado. NO DEBE dibujarse junto a un resultado, un
  enlace estructural, una invocación ni una mitad escindida (R-MOD-1..4, R-ECA-4, R-OPD-TR-7).
- **R-OPD-CTL-4** (ISO §3.18, §9.5.1, §9.5.2.1): el enlace de evento va del objeto o del estado al proceso; la
  ocurrencia del evento inicia la evaluación de la precondición y el evento se pierde tras la evaluación, la
  satisfaga o no. Si varios enlaces de evento llegan a un mismo proceso, cada evento inicia por sí solo la
  evaluación; la conjunción (ISO §12.1) recae sobre los objetos de la precondición.

### §6.2 Enlaces de excepción

| Excepción | ID | Símbolo | Se activa cuando |
| --- | --- | --- | --- |
| Sobretiempo | EX1 | una barra corta, oblicua a la línea entre el proceso fuente y el de manejo, junto a este último | la duración de la ejecución supera la Duración máxima (ISO §9.5.4.2) |
| Subtiempo | EX2 | dos barras cortas paralelas, oblicuas a esa línea, junto al proceso de manejo | la ejecución dura menos que la Duración mínima (ISO §9.5.4.3) |

- **R-OPD-CTL-6** (ISO §9.5.4.1, §9.5.4.2, §9.5.4.3): el enlace de excepción es una línea del proceso fuente al
  proceso de manejo, con las barras junto al proceso de manejo. El sobretiempo se refiere a la Duración máxima del
  proceso fuente y el subtiempo, a su Duración mínima (R-EXC-1..3). La decoración del extremo de la línea es no
  verificable (figura ausente).

### §6.3 Operadores lógicos AND, XOR y OR

| Operador | Símbolo | Semántica |
| --- | --- | --- |
| AND | ningún arco: enlaces del mismo tipo que no se tocan en el contorno del proceso (ISO §12.1) | todos; en OPL, una sola oración con «y» (ISO §12.1) |
| XOR | un arco discontinuo que cruza los enlaces del abanico, con su foco en el extremo común (ISO §12.2) | exactamente uno de los del extremo no común |
| OR | dos arcos discontinuos concéntricos, con el mismo foco (ISO §12.2; §12.6 lo llama doble arco punteado) | al menos uno de los del extremo no común |

- **R-OPD-CTL-7** (ISO §12.2, §12.3, Tablas 17–21, Figura 38, §A.4.5.3): el arco DEBE tener su foco en el extremo
  común del abanico (el extremo convergente de ISO §12.2). En consumo, resultado e invocación el abanico es
  convergente si el extremo común es el destino y divergente si es el origen (Tablas 17, 18 y 21). En el efecto,
  que es bidireccional, la distinción es entre varios objetos y varios procesos (Tabla 19). Los abanicos de agente
  e instrumento admiten ambas direcciones: varios habilitadores hacia un proceso y un habilitador hacia varios
  procesos (ISO §12.2 Figura 38, §A.4.5.3); la Tabla 20 muestra sólo la segunda.
- **R-OPD-CTL-8** (ISO §9.5.1, §12.3, §12.4, §12.5): hay abanicos XOR y OR de consumo, resultado, efecto, agente,
  instrumento e invocación (Tablas 17–21), y cada rama PUEDE tener o no estado especificado (ISO §12.4). Los
  modificadores «e»/«c» de un abanico van sobre cada enlace y sólo en los abanicos cuyos enlaces entran al proceso
  (R-OPD-CTL-3): los abanicos de resultado y de invocación no los llevan. ISO §12.5 nombra un abanico de resultado
  con modificador de control; es una incoherencia de la norma y prevalece ISO §9.5.1.

  Correcto: abanico XOR de resultados con estado especificado, sin modificadores de control.
  Incorrecto: abanico XOR de resultados con «c» en cada rama: el resultado pertenece al conjunto de objetos
  posterior al proceso y ningún enlace que sale del proceso lleva modificador (ISO §9.5.1).
- **R-OPD-CTL-10** (ISO §12.7): en un abanico probabilístico cada enlace lleva la marca «Pr=p», con p numérico o
  parámetro, y la suma de las probabilidades DEBE ser exactamente 1; la probabilidad es propiedad de los enlaces de
  un abanico XOR divergente (R-PROB-1, R-FAN-PROB-1). La norma fija la equiprobabilidad sólo para el caso de
  R-OPD-CTL-11.
- **R-OPD-CTL-11** (ISO §12.7, Figura 40): un resultado hacia un objeto con n estados, sin estado especificado,
  equivale a un abanico XOR de resultados hacia cada estado, con probabilidad 1/n para cada uno, salvo que el objeto
  tenga estado inicial: entonces lo crea en ese estado con probabilidad 1 y, si tiene m estados iniciales (m < n),
  en uno de ellos con probabilidad 1/m.
- **R-OPD-CTL-13** (ISO §12.5, §12.6, Tablas 22–23): todo abanico XOR de consumo, efecto, agente o instrumento tiene
  su versión de evento y de condición, con «e» o «c» en cada enlace; todas ellas, salvo la de efecto, tienen versión
  con estado especificado; y cada una tiene su contraparte OR, dibujada con el doble arco.

### §6.4 Etiquetas de ruta

- **R-OPD-CTL-12** (ISO §13): la etiqueta de ruta es una propiedad de enlace que se dibuja como texto junto a un
  par de enlaces procedimentales. Cuando la precondición involucra enlaces con etiqueta de ruta y el conjunto de
  objetos posterior al proceso admite más de un destino, se sigue el enlace de salida con la misma etiqueta que el
  de entrada. Bimodal: «Por ruta L, …» (spec-OPL §11).

## §7 Enlaces estructurales

### §7.1 Relaciones fundamentales: figura del triángulo

| Relación | ID | Triángulo | Vértice → base |
| --- | --- | --- | --- |
| Agregación-participación | RF1 | negro relleno (ISO §10.3.2) | todo → partes |
| Exhibición-caracterización | RF2 | vacío, con un triángulo negro menor dentro (ISO §10.3.3.1) | exhibidor → rasgos |
| Generalización-especialización | RF3 | vacío (ISO §10.3.4.1) | general → especializaciones |
| Clasificación-instanciación | RF4 | vacío, con un pequeño círculo negro dentro (ISO §10.3.5.1) | clase → instancias |

- **R-OPD-STR-1** (ISO §10.3.2, §10.3.3.1, §10.3.4.1, §10.3.5.1): la relación la portan el relleno y la figura
  interior del triángulo, no el color. Un triángulo cuya figura interior no distinga la exhibición o la
  clasificación de la generalización no denota la relación.
- **R-OPD-STR-2** (ISO §10.3.2, §10.3.3.1, §10.3.4.1, §10.3.5.1): el vértice del triángulo se une por una línea al
  refinable y los refinados se unen por líneas a la base opuesta; un triángulo sin esas líneas no denota relación.
- **R-OPD-STR-3** (ISO §10.1, §10.3.1, §10.3.3.1): la igualdad de perseverancia entre refinable y refinados la fija
  R-STRF-1; la exhibición-caracterización admite las cuatro combinaciones de exhibidor y rasgo (R-STRF-2): el
  atributo se dibuja como objeto y la operación como proceso.
- **R-OPD-STR-4** (ISO §10.3.2, §10.3.3.1, §10.3.4.1, §10.3.5.1 NOTE 3): la colección incompleta de refinados se
  denota con una barra horizontal corta que cruza la línea vertical bajo el triángulo de agregación, de exhibición o
  de generalización. La clasificación-instanciación no distingue colección completa e incompleta (R-STRF-3).
- **R-OPD-STR-6** (ISO §10.3.4.2, §10.3.4.3): los elementos heredables del general —partes, rasgos, enlaces
  etiquetados y enlaces procedimentales— aplican a cada especialización por herencia aunque no se dibujen en ella;
  lo mismo vale para la herencia múltiple y para el atributo discriminante (R-HER-1..8).
- **R-OPD-STR-14** (ISO §10.4.1, Figura 28): el enlace de caracterización con estado especificado es el triángulo
  de exhibición con el vértice en el objeto especializado y la base unida al valor del atributo discriminante,
  dibujado como estado; denota que la especialización tiene sólo ese valor del atributo que hereda. El OPD
  DEBERÍA mostrar también la exhibición del atributo discriminante por el general [informativo] (ISO §10.4.1 NOTE).

### §7.2 Enlaces estructurales etiquetados

| Variante | ID | Símbolo | Etiquetas |
| --- | --- | --- | --- |
| Unidireccional | SE1 | flecha con punta abierta (ISO §10.2.1) | una etiqueta junto al eje |
| Unidireccional nulo | SE2 | igual, sin etiqueta (ISO §10.2.2) | etiqueta por defecto «se relaciona con» [localización] |
| Bidireccional | SE3 | línea con arpones en lados opuestos en ambos extremos (ISO §10.2.3) | dos etiquetas, una por dirección |
| Recíproco | SE4 / SE5 | igual que el bidireccional (ISO §10.2.4) | una etiqueta o ninguna; por defecto «se relacionan» [localización] |

- **R-OPD-STR-7** = R-STRE-1 (ISO §10.2.3, §10.2.4).
- **R-OPD-STR-15** (ISO §10.2.3, §10.4.2.5, §10.4.2.7): en el bidireccional, cada etiqueta DEBE ir del lado de la
  flecha por el que sobresale el filo del arpón, lo que fija la dirección a la que se aplica; en el recíproco, la
  única etiqueta se alinea con la flecha.
- **R-OPD-STR-9** (ISO §10.4.2.1–§10.4.2.8, Tabla 15): los enlaces estructurales etiquetados con estado
  especificado son siete: unidireccional con estado en el origen, en el destino o en ambos; bidireccional y
  recíproco con estado en un extremo cualquiera o en ambos. En el bidireccional y en el recíproco no se distingue
  «sólo en el origen» de «sólo en el destino» (Tabla 15).

### §7.3 Despliegue y plegado parciales

Bimodal: el despliegue parcial se dibuja igual que la relación fundamental incompleta (barra de R-OPD-STR-4)
[informativo] (ISO §14.2.1.2 NOTE 3) y el plegado parcial es su complemento [informativo] (ISO §14.2.1.2 NOTE 4).
El OPL del OPD expresa sólo los refinados que el OPD muestra (ISO §14.2.1.2) y la colección incompleta emite
«y al menos otro/otra …» [localización] (ISO §10.3.2, §A.4.6.3; spec-OPL §7.2).

## §8 Invocación, tiempo y duración

### §8.1 Invocación y orden de los subprocesos

- **R-OPD-INV-1** (ISO §9.5.1, §9.5.2.5): la invocación (IV1) es un enlace de evento de proceso a proceso: una línea
  en zigzag (rayo) del proceso que invoca al invocado, con punta cerrada en el invocado. La autoinvocación (IV2) es
  un par de enlaces de invocación que salen del proceso, se unen punta con cola y vuelven a él. La invocación no
  lleva «e» ni «c» (R-OPD-CTL-3). Firma: R-INV-1.
- **R-OPD-INV-2** (ISO §14.2.2.1, §14.2.2.2; §D.4 [informativo]): dentro de un proceso descompuesto ningún símbolo
  denota la invocación implícita: la denota la disposición de arriba abajo de los puntos superiores de las elipses
  de los subprocesos; al terminar un subproceso se invocan los inmediatamente inferiores. Los subprocesos cuyos
  puntos superiores están a la misma altura (dentro de la tolerancia admisible) se inician en paralelo, cada uno al
  satisfacer su precondición, y el último en terminar invoca el nivel siguiente. Sólo aplica a la descomposición de
  proceso.
- **R-OPD-INV-10** (ISO §14.2.2.1; §D.4 [informativo]): al llegar a un proceso descompuesto, el control pasa de
  inmediato al subproceso o subprocesos de punto superior más alto; al terminar el de punto superior más bajo,
  vuelve al proceso descompuesto. [informativo] La línea de tiempo se desvía cuando un evento interno causa un
  bucle o cuando se invoca el proceso cuyo nombre es o termina en «Exception Exiting»: en ese caso el proceso
  descompuesto termina de inmediato, sea cual sea la posición de ese proceso (ISO §D.4).
- **R-OPD-INV-3** (ISO §14.2.2.5, §14.2.2.4.2): el refinamiento síncrono DEBE modelarse por descomposición y el
  asíncrono, por despliegue de agregación-participación, en el mismo OPD o en uno nuevo. Cuando subprocesos
  asíncronos se inician por eventos independientes, cada uno recibe su propio enlace de evento [informativo]
  (Figura 54).
- **R-OPD-INV-4** [informativo] (ISO §9.5.2.5.1 NOTE 2): una invocación PUEDE reemplazar un objeto transitorio que
  el proceso que invoca crea y el invocado consume de inmediato.

### §8.2 Duración

- **R-OPD-INV-6** (ISO §9.5.4.1; §D.7 [informativo]): la duración de un proceso y su especialización en Duración
  mínima, esperada y máxima, con distribución opcional, son las de R-EXC-4 y R-EXC-5. [informativo] En el OPD esas
  propiedades PUEDEN expresarse con enlaces de exhibición y de especialización, o de forma compacta en el símbolo del
  proceso: la unidad de tiempo entre corchetes tras el nombre, uno, dos o tres valores de duración y el nombre y los
  parámetros de la distribución (Figuras D.5–D.6). La forma compacta exacta es no verificable (figura ausente).
- **R-OPD-INV-8** [informativo] (ISO §D.5, Figura D.2): un objeto reloj del sistema con un valor de tiempo PUEDE
  iniciar un proceso mediante un enlace de evento; no tiene símbolo propio.

## §9 Multiplicidad

| Símbolo | Rango | Frase OPL (spec-OPL §10.1) |
| --- | --- | --- |
| `?` | 0..1 | «un/una … opcional» [localización] (ISO §11.1) |
| `*` | 0..* | «… opcionales» [localización] (ISO §11.1) |
| sin símbolo | 1..1 | sin frase (ISO §11.1, Tabla 16) |
| `+` | 1..* | «al menos un/una …» [localización] (ISO §11.1) |
| entero, parámetro, rango `qmín..qmáx`, conjunto de rangos | según la anotación | número o parámetro ante el nombre en plural; «a» por `..`, «o» por la coma (ISO §11.1); `2..*` ↔ «al menos dos» [localización] |

- **R-OPD-MUL-1** (ISO §11.1, §11.2 NOTE 1–2): la multiplicidad se anota junto al extremo del enlace al que se
  aplica y sólo en extremos de objeto: enlaces etiquetados, partes de una agregación-participación y objetos de
  enlaces procedimentales. La agregación-participación es la única relación fundamental que la admite. NO DEBE
  anotarse en un extremo de proceso (R-MULT-1, R-MULT-1A).
- **R-OPD-MUL-2** (ISO §11.1, §11.2): la multiplicidad es un entero, un parámetro, una expresión aritmética (`+`,
  `-`, `*`, `/`, paréntesis), un rango `qmín..qmáx` cerrado o un conjunto de rangos separados por coma; `0..*` deja
  abierta la cota superior. Las restricciones sobre una expresión van tras un punto y coma, y varias restricciones
  sobre un parámetro forman una lista separada por punto y coma. Los nombres de parámetro DEBEN ser únicos en todo el
  modelo (R-MULT-2).
- **R-OPD-MUL-3** (ISO §11.2): las restricciones usan los símbolos «=», «≠», «<», «≤», «≥», las llaves «{ }» para
  conjuntos y el operador de pertenencia «in» (∈).
- **R-OPD-MUL-4** (ISO §3.60, §13): multiplicidad, etiqueta y etiqueta de ruta son propiedades del enlace, no
  atributos: no se dibujan como estados.
- **R-OPD-MUL-5** (ISO §9.3.1, §9.3.2): la tasa de consumo o de generación es una propiedad del enlace de consumo o
  de resultado, y el objeto lleva un atributo con la cantidad disponible; sin tasa, el consumo es inmediato al
  activarse el proceso y la generación, al completarse.
- **R-OPD-MUL-6** (ISO §11.3): un enlace estructural o procedimental que conecta con un atributo de valor real PUEDE
  llevar una restricción de valor: un número o un parámetro anotado junto al extremo del atributo, alineado con el
  enlace. Es distinta de la multiplicidad. El rango de valores de un atributo tiene la misma expresividad que la
  multiplicidad, salvo la opcionalidad [informativo] (ISO §11.3 NOTE 2).

## §10 Refinamiento y contexto

### §10.1 Los tres pares refinamiento-abstracción

| Par (ISO §14.2.1) | Refina | Abstrae | Naturaleza |
| --- | --- | --- | --- |
| Expresión ↔ supresión de estados | muestra estados | oculta estados | por OPD (R-OPD-EST-8; ISO §14.2.1.1) |
| Despliegue ↔ plegado | muestra los refinados de una relación fundamental | los oculta | las cuatro relaciones; sin transferencia de control (ISO §14.2.1.2 NOTE 5) |
| Descomposición ↔ recomposición | muestra subprocesos u objetos constituyentes dentro del refinable | restaura el refinable | agregación y exhibición con semántica adicional; en el proceso, orden temporal (ISO §14.2.1.3) |

- **R-OPD-REF-1** (ISO §14.2.1.2, §14.2.1.3): en la descomposición, en el mismo OPD o en uno nuevo, el símbolo del
  refinable se agranda para contener a sus refinados y los enlaces entre ellos: la elipse para los subprocesos y el
  rectángulo para los objetos constituyentes. En la descomposición y en el despliegue en un OPD nuevo, el refinable
  lleva contorno grueso en el OPD más abstracto y en el nuevo; el despliegue en el mismo OPD no lleva contorno grueso
  y equivale a dibujar las relaciones fundamentales (R-CTRN-2).
- **R-OPD-REF-2** (ISO §14.2.1.3, §14.2.2.1; §D.4 [informativo]): en la descomposición de un proceso, la línea de
  tiempo va de arriba abajo de la elipse agrandada y la disposición vertical de los subprocesos denota su orden
  (R-OPD-INV-2). En la descomposición de un objeto, la disposición de los objetos constituyentes denota orden
  espacial o lógico, no tiempo, y no transfiere el control.
- **R-OPD-REF-3** [informativo] (ISO §C.5.1, Figuras C.19–C.20): la descomposición en un OPD nuevo PUEDE describirse
  en dos fases —mostrar el contenido y refinar los enlaces, con un OPD semidescompuesto intermedio—; la
  recomposición invierte el orden: abstraer los enlaces y ocultar el contenido.
- **R-OPD-REF-8** = R-REF-1 (ISO §3.45, §14.2.2.6.1.1).
- **R-OPD-REF-9** (ISO §14.2.3; §B.2, §B.4 [informativo]): una cosa conserva su símbolo (forma, sombreado, contorno)
  y su nombre en todo OPD donde aparece, y ningún OPD afirma un hecho que contradiga otro; refinar o abstraer no es
  contradecir (R-REF-4, R-CONSIST-1, R-CONSIST-2). La importancia de una cosa es en general proporcional al OPD más
  alto donde aparece [informativo] (R-IMP-1).

### §10.2 Distribución y escisión de enlaces

| Enlace en el contorno del proceso descompuesto | Notación | Cláusula |
| --- | --- | --- |
| Consumo, con o sin estado | NO DEBE anclarse al contorno; al descomponer se ancla al primer subproceso y el modelador lo reasigna | ISO §14.2.2.4.1 |
| Resultado, con o sin estado | NO DEBE anclarse al contorno; al descomponer se ancla al primer subproceso y el modelador lo reasigna | ISO §14.2.2.4.1 |
| Efecto sin estado | PUEDE anclarse al contorno: se distribuye a cada subproceso | ISO §14.2.2.4.1 |
| Efecto entrada-salida | asignación temporalmente factible: el par en un subproceso o escindido (R-OPD-TR-7) | ISO §14.2.2.4.3 |
| Agente, instrumento | PUEDE anclarse al contorno: se distribuye a cada subproceso (R-OPD-REF-21) | ISO §14.2.2.4.1 |
| Evento desde un objeto o estado sistémico | NO DEBE cruzar el contorno desde fuera para iniciar un subproceso | ISO §14.2.2.4.2 |
| Evento desde un objeto o estado ambiental | PUEDE cruzar el contorno; el modelador DEBERÍA modelar cómo se maneja esa contingencia | ISO §14.2.2.4.2 |

- **R-OPD-REF-11** (ISO §14.2.2.4.1, §14.2.1.3): un enlace procedimental anclado al contorno de un proceso
  descompuesto tiene semántica distributiva: equivale a anclarlo a cada subproceso, como un paréntesis algebraico.
  Consumo y resultado NO DEBEN anclarse al contorno (R-DIST-1). La distribución sólo aplica a la descomposición de
  proceso.
- **R-OPD-REF-21** (ISO §14.2.2.4.1): un habilitador anclado al contorno exterior de un proceso descompuesto DEBE
  conectar con al menos uno de sus subprocesos.
- **R-OPD-REF-12** (ISO §14.2.2.4.2): si se omite un proceso dentro de un contexto de descomposición y hay un proceso
  siguiente en ese contexto, el control lo inicia; si no, vuelve al proceso descompuesto.

### §10.3 Precedencia de recomposición

- **R-OPD-REF-13** (ISO §8.1.2, §14.2.4.1–§14.2.4.5, Tabla 27): al recomponer o plegar, cuando entre un objeto (o un
  estado) y el proceso abstracto compiten varios enlaces procedimentales, el OPD abstracto DEBE mostrar uno solo: el
  de mayor fuerza semántica. El orden primario es consumo = resultado > efecto > agente > instrumento, y los enlaces
  con estado especificado preceden a los básicos; dentro de cada tipo, el evento es más fuerte y la condición más
  débil que el enlace sin modificador, con el orden completo de doce niveles de ISO §14.2.4.5, cuyo nivel más débil
  es la condición de instrumento. Entre transformadores, consumo y resultado prevalecen sobre el efecto y, cuando
  compiten consumo y resultado, prevalece el efecto (ISO §14.2.4.2); un transformador prevalece sobre un habilitador
  (ISO §14.2.4.3). La matriz de la Tabla 27, con resultado+resultado y consumo+consumo inválidos (R-PREC-1), se
  conserva tal como estaba: no verificable, depende de figuras ausentes en la fuente; revisar con la IS 2024. La
  semántica de colisión vive en reglas §6.5–§6.6 (R-PREC-1..5).

### §10.4 Árbol de OPD, apariciones y vistas

- **R-OPD-REF-14** = R-SD-4 (ISO §14.2.2.6.1.3).
- **R-OPD-REF-15** (ISO §14.2.2.6.1.1, §14.2.2.6.1.3, §14.2.2.6.1.4): las etiquetas SD, SD1, SD1.1… designan los OPD
  del árbol de procesos OPD, cuya raíz es el SD; cada arista del árbol es una relación de refinamiento con su
  oración OPL. La política de identidad de los OPD la fijan R-IDP-1 y R-ARB-3.
- **R-OPD-REF-16** (ISO §14.2.2.6.1.5): el mapa del sistema es el árbol de procesos OPD que muestra el contenido de
  cada OPD. Una herramienta DEBERÍA permitir crear vistas: OPD con su OPL que reúnen cosas y enlaces según un
  criterio. Una vista no crea hechos (R-VIEW-2).
- **R-OPD-REF-17** [informativo] (ISO §B.4, §B.5; §14.2.3 NOTE): una cosa PUEDE aparecer en cualquier número de OPD
  y más de una vez en el mismo OPD; cada aparición es la misma cosa (R-REF-2). Una cosa repetida en un mismo OPD
  PUEDE dibujarse con el símbolo de duplicado: un objeto o proceso pequeño que asoma detrás del símbolo repetido; el
  modelador DEBERÍA usarlo con mesura. Un enlace sólo aparece si aparecen las dos cosas que une.
- **R-OPD-REF-18** (ISO §6.2.1, §14.2.2.6.2): un modelo OPM es el conjunto de sus OPD con sus párrafos OPL, uno por
  OPD; la equivalencia OPD↔OPL es por OPD y la sucesión de párrafos forma la especificación del sistema.

Bimodal: «se descompone en …, en esa secuencia», «… en paralelo …», «se despliega en …» y la oración de arista del
árbol «se refina por descomposición / despliegue de … en …» [localización] (ISO §14.2.1.2, §14.2.1.3, §14.2.2.2,
§14.2.2.6.1.4; spec-OPL §7).

## §11 Legibilidad del OPD

- **R-OPD-LAY-1** [informativo] (ISO §B.3): las cosas NO DEBERÍAN ocluirse —o se contienen por completo, como en la
  descomposición, o no se solapan—; un enlace NO DEBERÍA cruzar el área de una cosa; el número de enlaces DEBERÍA
  rondar el de cosas; los cruces entre enlaces DEBERÍAN minimizarse; y un OPD NO DEBERÍA exceder una página o una
  pantalla media.
- **R-OPD-LAY-2** [informativo] (ISO §B.3): un OPD NO DEBERÍA contener más de 20 a 25 cosas.

## §12 Rotulado

- **R-OPD-ROT-1** (ISO §7.1.2, §7.2.2): el nombre de una cosa va dentro de su símbolo.
- **R-OPD-ROT-4** [informativo] (ISO §10.3.5.1 EXAMPLE 1, Figura 26): una instancia PUEDE rotularse
  «Instancia : Clase»; la clase muestra sus atributos con rangos de valores y la instancia, los mismos atributos con
  valores concretos.

## §15 Cambios del OPD

- **R-OPD-EDIT-2** (ISO §6.2.1): todo cambio de un símbolo portador de un hecho —forma, sombreado, contorno, punta o
  marca de enlace, triángulo, estado, anclaje o dirección— cambia el hecho y su OPL canónico, aunque el OPL mostrado
  en un OPD con estados suprimidos no varíe.
- **R-OPD-EDIT-5** (ISO §14.2.2.4.1 EXAMPLE 3, NOTE 2): al descomponer un proceso, sus enlaces de consumo y de
  resultado se anclan al primer subproceso y el modelador los reasigna al que corresponda; una herramienta PUEDE
  fijar este valor por defecto.

## §19 Equivalencia bimodal

- **R-OPD-BIM-1** (ISO §6.2.1; §C.3 [informativo]): todo OPD tiene un párrafo OPL semánticamente equivalente: toda
  afirmación gráfica es expresable en OPL y toda oración OPL, en el OPD. El constructo básico —dos cosas y un
  enlace— es la unidad mínima de correspondencia [informativo].
- **R-OPD-BIM-3** (ISO §6.2.1, §14.2.2.1): portan hechos la forma, el sombreado, el contorno, la punta o marca de
  extremo, la figura interior del triángulo, el anclaje a estado, la dirección del enlace, las designaciones de
  estado, los modificadores «e»/«c», los arcos, «Pr=p», la multiplicidad, las etiquetas y la disposición vertical
  de los subprocesos en la descomposición de proceso. Lo que no porta un hecho no pertenece a la notación (R-BI-3).
- **R-OPD-BIM-4** (ISO §6.2.1, §7.3.3): la perseverancia no tiene símbolo propio: la porta la forma. Las marcas de
  ejecución no son hechos del modelo.
- **R-OPD-BIM-5** (ISO §10.2.4, §12.7, §14.2.1.1): son equivalentes un resultado simple hacia un objeto con estados
  y el abanico XOR de resultados hacia cada estado, sólo si el objeto no tiene estado inicial (R-OPD-CTL-11); un
  bidireccional con dos etiquetas idénticas y un recíproco con esa etiqueta (R-OPD-STR-7); y un objeto con todos sus
  estados y el mismo objeto con estados suprimidos, que afirman los mismos hechos (R-OPD-EST-8).

## §20 Semántica de ejecución

- **R-OPD-SIM-5** (ISO §9.5.1, §14.2.2.4 [instancias operacionales]): el consumido deja de existir al comienzo del
  subproceso más detallado que lo consume; el afectado sale de su estado de entrada al comienzo del subproceso más
  detallado que lo cambia y entra en su estado de salida al completarse ese subproceso; el resultante empieza a
  existir al completarse el subproceso más detallado que lo genera; un proceso cuya condición falla se omite
  (R-CONS-2, R-EFE-2, R-EFE-2A, R-ECA-1). Entre esos dos instantes el afectado está en transición [informativo]
  (ISO §D.6).
- **R-OPD-SIM-7** = R-AG-2 (ISO §9.2.3 EXAMPLE 3 [informativo]).

## §23 Invariantes

### §23.2 Invariantes de la notación

- **R-§23-OPD-VOCAB** (ISO §4; cláusulas 7 a 14): el vocabulario gráfico es el de ISO §4 y el de las cláusulas 7 a
  14; todo símbolo adicional es extensión fuera de este documento.
- **R-§23-OPD-TIEMPO** (ISO §14.2.1.3, §14.2.2.1; §D.4 [informativo]): en la descomposición de un proceso, la
  disposición vertical de los subprocesos denota el orden de ejecución, y toda disposición del OPD la preserva.
- **R-§23-OPD-BIM** (ISO §6.2.1): todo hecho que el OPD muestra tiene su expresión OPL.

## Apéndice B — Ejemplo [informativo]

Modelo del sistema de lavado de platos (ISO §14.2.2.4.3 EXAMPLE 2, Figura 53, Tabla 26). Los nombres de proceso
usan infinitivo en lugar del gerundio inglés [localización]; los objetos y procesos se nombran sin marcas tipográficas y los estados, entre comillas.

SD: el objeto Usuario Doméstico maneja Lavar Platos (línea con piruleta negra en la elipse); Lavar Platos
requiere Lavavajillas (piruleta blanca), consume Jabón (flecha de punta cerrada hacia la elipse) y afecta
Conjunto de Platos (flecha bidireccional). Lavar Platos lleva contorno grueso porque se descompone en un OPD
nuevo (R-OPD-REF-1).

SD1: Lavar Platos aparece agrandada, con contorno grueso, y contiene de arriba abajo Cargar Platos, Insertar
Detergente, Limpiar y Secar Platos y Descargar Platos: la disposición vertical denota la secuencia
(R-OPD-INV-2). Lavavajillas consta de Compartimento de Jabón y al menos otra parte (triángulo negro con barra
de colección incompleta, R-OPD-STR-4); sus estados son «vacío» (inicial y final) y «cargado». Conjunto de Platos
exhibe Limpieza (triángulo de exhibición), con estados «sucio» (inicial, contorno grueso) y «limpio» (final,
contorno doble). Usuario Doméstico se ancla al contorno de Lavar Platos y su agente se distribuye a cada
subproceso (R-OPD-REF-11). Cargar Platos cambia Lavavajillas de «vacío» a «cargado» y Descargar Platos, de
«cargado» a «vacío»: como el estado inicial y el final coinciden, en el SD Lavavajillas es instrumento
(ISO Tabla 25 NOTE 2). Insertar Detergente requiere Jabón y cambia Compartimento de Jabón de «vacío» a
«cargado»; Limpiar y Secar Platos requiere Lavavajillas, consume Jabón y cambia Limpieza de Conjunto
de Platos de «sucio» a «limpio» con un par entrada-salida asignado a un solo subproceso (R-OPD-TR-7). El OPL
espejo de cada hecho es el de spec-OPL Apéndice A.
