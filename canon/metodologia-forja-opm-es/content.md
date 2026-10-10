---
urn: urn:fxsl:kb:metodologia-forja-opm-es
nombre: metodologia-forja-opm-es
version: 2.0.0
estado: publicado
descripcion: "Metodología OPM según ISO/PAS 19450:2015 en español: principios de modelado, prueba objeto-proceso, construcción del SD, comprensión del modelo y guías informativas de los Anexos B y D."
fuente: "ISO/PAS 19450:2015, revisión cláusula por cláusula (2026-10-10); sustituye la sincronización KB previa"
autor: FS
creado: 2026-05-31
lang: es
tags: [opm, iso-19450, methodology, modeling-method, system-diagram, refinement, state-suppression, naming-guidelines]
familia: bok
depende: [urn:fxsl:kb:reglas-opm-estrictas-es, urn:fxsl:kb:spec-forja-opd-es, urn:fxsl:kb:spec-forja-opl-es]
cita: [urn:fxsl:kb:reglas-opm-estrictas-es, urn:fxsl:kb:spec-forja-opd-es, urn:fxsl:kb:spec-forja-opl-es]
---

# Metodología OPM (ISO 19450) en español

## 0. Contrato

### 0.1 Definición

Este documento es la capa de método del canon: orienta cómo y en qué orden construir un
modelo OPM conforme a ISO/PAS 19450:2015. Contiene sólo lo que la norma dice sobre el método
—principios de modelado (ISO §6.1), prueba objeto-proceso (ISO §7.3.2), completar el SD
(ISO §14.1), comprensión del modelo (ISO §14.2) y las guías informativas de los Anexos B y D—
y, marcado `[guía]`, el método de Dori y del manual que aplica construcciones ISO sin agregar
reglas. No define validez (reglas), notación gráfica (spec-OPD) ni oraciones OPL (spec-OPL).

### 0.2 Precedencia

reglas > spec-OPD / spec-OPL > metodología. Ante duda manda la norma. Un enunciado `[guía]`
nunca autoriza un hecho que reglas prohíbe ni redefine una construcción ISO. El perfil OpForja
(`perfil/metodo-opforja`) se subordina a este documento: cuando es más estricto que ISO lo
declara `[endurecimiento]`, y cuando extiende ISO, `[extensión]`.

### 0.3 Invariante de pureza

- **0.3** (ISO §6.2.2) [guía]: todo principio del método se enuncia con los elementos OPM —cosas
  (objetos y procesos) y enlaces (procedimentales y estructurales)—, los estados de objeto
  (ISO §7.3.5) y los tres pares de refinamiento-abstracción (ISO §14.2.1). El dominio aparece sólo
  como ejemplo desmontable.

### 0.5 Convenciones

- Cita: `ISO §x.y` remite a ISO/PAS 19450:2015 con su numeración; «Tabla n», «Figura n» y
  «Anexo X» remiten a la misma edición. Anexo A es normativo; Anexos B, C y D son informativos.
- **0.5a** (ISO §6.2.1): modalidad: shall → DEBE; shall not → NO DEBE; should → DEBERÍA;
  should not → NO DEBERÍA; may → PUEDE. Una posibilidad descriptiva (can) se escribe sin palabra
  modal en mayúsculas. En `[guía]` no hay DEBE.
- Marcas: `[informativo]` = contenido de un anexo informativo, NOTA, EXAMPLE o figura (nunca DEBE);
  `[localización]` = realización española de una construcción ISO; `[guía]` = método que aplica
  construcciones ISO sin agregar reglas; «no verificable» = la fuente local está resumida o falta
  la figura que lo decidiría.
- **0.5b** (ISO §6.2.1): los ejemplos se dan en OPL-ES (spec-OPL) y, cuando conviene, con su OPD;
  en este documento los nombres de cosas van en negrita y los estados en negrita minúscula, sin que
  la tipografía porte el tipo de cosa.
- Referencias cruzadas: por ID (`A3.4c`) o por `<doc> §n` (`reglas §6.5`).

Secciones trasladadas al perfil: §0.4, §A0.1, §A0.3, §A0.4, §A1.3, §A1.4, §A1.5, §A2.4, §A2.6,
§A4.4, §A4.6, Frontera rectora, Parte B, Apéndice F y Bitácora; además, partes de §0.1, §0.2,
§0.5, §A1.1, §A1.2, §A2, §A2.1, §A2.3, §A3.1, §A3.3, §A3.4, §A4.1, §A4.2, §A4.3, §A5, §A6, §A7 y §A8.

---

# Parte A — Método

## A0. Antes del SD

### A0.2 Función y comportamiento

- **A0.2a** (ISO §3.23, §6.1.3): la función es el proceso que provee valor funcional al
  beneficiario; no es el valor mismo ni un objeto.
- **A0.2b** (ISO §6.1.4): el modelador DEBERÍA distinguir función y comportamiento para obtener un
  modelo claro y sin ambigüedad. Cruzar un río es la misma función lograda por un puente o por un
  transbordador, con estructura y comportamiento distintos.
- **A0.2c** (ISO §6.1.4) [guía]: mientras existan alternativas de arquitectura vivas, la función se
  nombra sin presuponer ninguna de ellas.

## A1. Principio rector y clasificación

### A1.1 Regla rectora

- **A1.1a** (ISO §6.1.3): el proceso que provee valor funcional DEBE expresar la función del sistema
  tal como la percibe su beneficiario principal; identificar y nombrar ese proceso es el primer paso
  crítico del modelo.
- **A1.1b** (ISO §14.1) [guía]: tras la función, el orden sugerido es valor, agentes, cosas
  ambientales y transformados; después, estructura, control y simulación.
- **A1.1c** (ISO §6.1.6, §14.2.3): la comprensión exige equilibrar claridad y completitud: el exceso
  de detalle reduce la comprensión, y ningún OPD contradice un hecho de otro (A8.3).
- **A1.1d** (ISO §6.2.1) [guía]: toda heurística de este documento se subordina a la equivalencia
  entre OPD y OPL.
- **A1.1e** (ISO §14.2.1, §C.5.1) [guía]: la práctica es de nivel medio hacia ambos lados: se parte
  del nivel mejor comprendido y se refina o abstrae en las dos direcciones (descomposición y
  recomposición son operaciones inversas). La función fija la semilla conceptual; no obliga a
  construir estrictamente de arriba abajo.

### A1.2 Clasificación del sistema

- **A1.2a** (ISO §B.1) [guía]: el modelador puede clasificar el sistema como artificial, natural,
  social o socio-técnico para orientar qué componentes del SD desarrollar; el mismo paradigma sirve
  para sistemas artificiales y naturales, nuevos o existentes. La clasificación no exime del
  contenido mínimo del SD (A2.7).
- **A1.2b** (ISO §14.1, §B.1) [guía]: en un sistema artificial el SD muestra la función con su
  beneficiario, la ocurrencia del problema que la función revierte y los agentes humanos.

### A1.6 Propósito y alcance

- **A1.6** (ISO §6.1.1): la función del sistema y el propósito del modelado DEBEN guiar el alcance
  y la extensión de detalle del modelo. Interesados distintos (beneficiario, dueño, usuarios,
  reguladores) pueden justificar modelos distintos del mismo sistema.

### A1.7 Función, estructura y comportamiento

- **A1.7** (ISO §6.1.2): el modelo de estructura DEBE ser un ensamble de objetos físicos e
  informacionales conectados por relaciones estructurales; el de comportamiento refleja los
  mecanismos que transforman objetos en el tiempo; su combinación permite la función que entrega
  valor funcional a los interesados.

### A1.8 Frontera del sistema

- **A1.8** (ISO §6.1.5, §7.3.4): lo ambiental DEBE ser la colección de cosas fuera del sistema que
  pueden interactuar con él. La afiliación por defecto de una cosa es sistémica.

## A2. Construcción del SD

- **A2** (ISO §14.1) [guía]: el SD se construye por etapas; cada etapa cierra con un hecho explícito
  del modelo o con una decisión registrada fuera de él. Si una etapa no cierra, se vuelve a la que
  la bloquea.

Etapas:

- **A2#0** (ISO §B.1) [guía]: clasificar el sistema (A1.2).
- **A2#1** (ISO §6.1.3, §B.6.3): proceso principal: nombre de una acción transformadora, no de una
  clase ni de una etiqueta (✓ **Carga de Batería**; ✗ **Batería**, ✗ **Proceso Principal**).
- **A2#2** (ISO §3.6, §B.6.2) [informativo]: interesado primario: el beneficiario, con nombre
  singular; un conjunto de humanos se nombra añadiendo «Grupo» a la forma singular, y uno de cosas
  inanimadas, «Conjunto».
- **A2#3** (ISO §14.1): valor a transformar, explícito (estados de entrada y de salida del
  beneficiario, o valores inicial y final de uno o más de sus atributos) o implícito (el
  beneficiario es afectado por la función).
- **A2#4** (ISO §3.23, §6.1.3): operando principal: la función es el proceso principal (A2#1); aquí
  se identifica el transformado que porta el valor y, si hay varios, cuál de ellos lo porta.
- **A2#5** (ISO §3.3, §3.30, §9.2.2): agencia humana: un agente es un humano o un grupo de humanos;
  robots, software e inteligencia artificial son instrumentos. La ausencia de agentes se registra
  como decisión.
- **A2#6a** (ISO §14.2.2.6): delimitar el sistema: el nombre del sistema DEBE ser el nombre del
  modelo OPM que lo especifica.
- **A2#6b** (ISO §10.3.3, §3.46) [guía]: el objeto que representa al sistema exhibe el proceso
  principal como operación (exhibición-caracterización).
- **A2#7** (ISO §3.17, §3.30, §9.2.3): instrumentos: habilitadores no humanos necesarios durante
  toda la ejecución; si un instrumento deja de existir durante el proceso, este se detiene
  (ISO §9.2.3, Ejemplo 3).
- **A2#8** (ISO §7.2.1, §9.1.1, §9.3.3): transformados: consumo, resultado o efecto, con estados de
  entrada y de salida cuando corresponde.
- **A2#9** (ISO §6.1.5, §4, Figura C.10) [informativo]: cosas ambientales; su símbolo de contorno
  discontinuo consta sólo en figuras.
- **A2#10** (ISO §14.2.2.6, §6.1.5) [guía]: ocurrencia del problema: proceso ambiental que causa o
  mantiene el estado problemático (el SD PUEDE contener procesos ambientales, ISO §14.2.2.6). En un
  sistema natural, su no aplicabilidad se registra como decisión.

### A2.1 Desgaste del instrumento

- **A2.1a** (ISO §3.17, Tabla 25 NOTA 2) [guía]: un habilitador no es transformado por el proceso.
  Si el desgaste o la degradación de un instrumento es relevante al alcance, el proceso lo cambia:
  pasa a ser afectado (✓ **Máquina** es afectada por **Corte de Metal** cuando su capacidad cambia;
  ✗ **Máquina** como instrumento cuando su desgaste explica la arquitectura). Un objeto puede ser
  instrumento en el OPD abstracto y afectado en uno descendiente cuando su estado inicial y su
  estado final coinciden (A5.4).

### A2.2 Doble rol

- **A2.2a** (ISO §8.1.2): la unicidad de rol es por proceso: un mismo objeto puede ser agente de un
  proceso y transformado de otro.
- **A2.2b** (ISO §8.1.2, §14.2.4): respecto de un mismo proceso, un objeto o estado DEBE tener
  exactamente un rol; si el beneficiario es también transformado, prevalece el enlace transformador
  sobre el habilitador (ISO §14.2.4).
- **A2.2c** (ISO §7.3.3, §3.3): un agente puede ser ambiental: agencia y afiliación son
  independientes.
- **A2.2d** (ISO §3.3, §3.6) [guía]: un mismo grupo humano puede ser agente y beneficiario; no se
  crean dos objetos («operador» y «usuario») si el dominio no los distingue.

### A2.3 Nombres y esencia por defecto

- **A2.3a** (ISO §B.6.3) [informativo] [localización]: cuatro variantes de nombre de proceso, de
  información creciente: (i) sólo la forma verbal (**Carga**); (ii) objeto y forma verbal (**Carga
  de Batería**); (iii) cualificador y forma verbal (**Carga Automática**); (iv) cualificador, objeto
  y forma verbal (**Carga Automática de Batería**). El nombre de un proceso DEBERÍA tener a lo más
  cuatro palabras con mayúscula. ISO cierra el nombre con el gerundio inglés; en español la forma
  verbal lo encabeza.
- **A2.3b** (ISO §B.6.3) [localización] [guía]: ISO prefiere el gerundio a la nominalización
  (Constructing frente a Construction). En español la forma verbal es el infinitivo (**Cargar
  Batería**) o un sustantivo deverbal (**Carga de Batería**), no el gerundio. El método recomienda
  el sustantivo deverbal y una sola de las dos formas en todo el modelo.
- **A2.3c** (ISO §B.6.1) [guía]: cuando un agregado o un atributo central no tiene término en
  lenguaje natural, el modelador inventa un nombre expresivo; el nombre condiciona la comunicación y
  la legibilidad de la OPL.
- **A2.3d** (ISO §7.3.4, §3.55): la esencia primaria del sistema es la esencia de la mayoría de sus
  cosas.

### A2.5 Ocurrencia del problema

- **A2.5** (ISO §14.2.2.6, §6.1.5) [guía]: en sistemas artificiales, sociales y socio-técnicos, la
  ocurrencia del problema se modela como proceso ambiental que produce o mantiene el estado
  problemático que el sistema transforma. Esta anti-función permite comprobar que la función
  revierte una condición observable y no es una expresión de deseo.

### A2.7 Contenido mínimo del SD

- **A2.7a** (ISO §14.1): la definición del propósito, el alcance y la función del sistema —frontera,
  interesados, precondiciones y postcondiciones— DEBE ser la base para decidir qué otros elementos,
  incluidas las cosas ambientales, aparecen en el modelo.
- **A2.7b** (ISO §14.1): el SD DEBE modelar los interesados, en particular los beneficiarios; un
  proceso que entrega el valor funcional que el beneficiario espera; y las demás cosas sistémicas y
  ambientales necesarias para un párrafo OPL sucinto. Ese párrafo DEBERÍA dar el contexto
  situacional del funcionamiento del sistema.
- **A2.7c** (ISO §14.1): el SD DEBERÍA contener sólo las cosas centrales, indispensables para
  entender la función y el contexto del sistema; el modelador DEBE usar los mecanismos de
  refinamiento para exponer gradualmente el detalle.
- **A2.7d** (ISO §14.2.2.6, §3.75): el SD DEBE contener uno y sólo un proceso sistémico, que
  representa la función; PUEDE contener uno o más procesos ambientales. Los OPD de niveles
  inferiores PUEDEN tener uno o más procesos.

### A2.8 Guías de nombres

- **A2.8a** (ISO §B.6.2) [informativo]: el nombre de un objeto DEBERÍA ser singular; un plural se
  convierte a singular añadiendo «Conjunto» (en general, cosas inanimadas) o «Grupo» (en general,
  humanos).
- **A2.8b** (ISO §B.6.2, §B.6.3) [informativo]: como los nombres son únicos en el modelo, el
  modelador PUEDE usar el nombre del refinable como prefijo del nombre del refinado, o como sufijo
  precedido de «de» (**Tamaño de Conjunto de Relojes** frente a **Tamaño de Conjunto de Pulseras**).
- **A2.8c** (ISO §B.6.2) [informativo]: el nombre de un objeto PUEDE ser una frase de varias
  palabras.
- **A2.8d** (ISO §B.6.4) [informativo] [localización]: los nombres de estado DEBERÍAN reflejar los
  modos relevantes en que puede encontrarse el objeto dueño; se prefieren formas pasivas (participio:
  **pintado**, **inspeccionado**) a la forma de proceso (**pintura**, **inspección**).
- **A2.8e** (ISO §B.6.5) [informativo] [localización]: cada palabra del nombre de una cosa lleva
  mayúscula inicial, salvo artículos y preposiciones breves; los nombres de estados y enlaces van en
  minúscula.

## A3. Refinamiento

### A3.1 Descomposición

- **A3.1a** (ISO §14.2.1.3): en la descomposición de un proceso, su símbolo se agranda para contener
  los subprocesos y los enlaces entre ellos; en la descomposición en diagrama nuevo, el refinable
  DEBE tener contorno grueso tanto en el OPD abstracto como en el nuevo.
- **A3.1b** (ISO §14.2.1.3, §14.2.2.1, §D.4): la línea de tiempo dentro del proceso descompuesto
  DEBE fluir de arriba abajo y representar la secuencia de invocaciones de los subprocesos; la
  posición vertical del punto más alto del símbolo de cada subproceso fija su orden.
- **A3.1c** (ISO §3.58, §A.4.3, §A.4.7.4): todo subproceso transforma al menos un objeto. La norma no
  fija un mínimo de subprocesos: la oración de descomposición admite uno o más.
- **A3.1d** (ISO §C.5.1) [guía]: secuencia de trabajo sugerida: agrandar el proceso, insertar los
  subprocesos, darles nombres del dominio, traer las cosas externas conectadas al padre, crear los
  objetos internos, sus estados y los enlaces internos.
- **A3.1e** (ISO §14.2.2.2, §D.4): subprocesos cuyo punto más alto está a la misma altura (dentro de
  una tolerancia) DEBEN comenzar en paralelo, cada uno al satisfacer su precondición; el que termina
  último inicia el siguiente subproceso o conjunto paralelo.
- **A3.1f** (ISO §14.2.2.5, §14.2.2.1): el refinamiento síncrono de procesos DEBE usar descomposición.
  Frente a la invocación explícita, la invocación implícita de la descomposición expresa lo mismo con
  menos símbolos y con el proceso contenedor como contexto (ISO §14.2.2.1, Figura 48) [informativo].
- **A3.1g** (ISO §14.2.1.3, §14.2.2.1, §D.4): el orden vertical es semántico: determina el orden de
  ejecución, salvo las indicaciones de desvío de A3.8.

### A3.2 Despliegue

- **A3.2a** (ISO §14.2.2.5, §10.3.1): el refinamiento asíncrono de procesos DEBE usar agregación, sea
  por despliegue en el mismo diagrama o en uno nuevo. Cada relación fundamental refina un refinable en
  uno o más refinados.
- **A3.2b** (ISO §14.2.1.2): las cuatro relaciones fundamentales admiten despliegue y plegado:
  agregación (expone las partes del todo) y participación (las oculta); exhibición (expone los rasgos
  del exhibidor) y caracterización (los oculta); generalización (expone las especializaciones del
  general) y especialización (las oculta); clasificación (expone las instancias de la clase) e
  instanciación (las oculta).
- **A3.2c** (ISO §10.3.2, §10.3.4) [guía]: ¿cada refinado es variante del mismo patrón? →
  generalización-especialización. ¿El todo necesita todas sus partes? → agregación-participación.
- **A3.2d** (ISO §14.2.1.2, §10.3.5.1): el modelador PUEDE elegir qué refinados mostrar; la OPL del OPD
  DEBE expresar sólo los refinados que aparecen en él. Un despliegue o plegado parcial se representa
  como relación fundamental parcial, con el símbolo de colección incompleta (ISO §14.2.1.2, NOTAS 3–4)
  [informativo], salvo en clasificación-instanciación, que no distingue colección completa de
  incompleta.

### A3.3 Identidad de la descomposición

- **A3.3a** (ISO §14.2.1.3): el contexto de un proceso descompuesto DEBE incluir sus subprocesos, que
  son partes de él, y posiblemente objetos internos que son atributos del proceso. Un objeto que entra
  al contexto desde fuera conserva su identidad y no es atributo del proceso. Simétricamente, la
  descomposición de un objeto expone partes y posiblemente procesos internos que son operaciones del
  objeto.
- **A3.3b** (ISO §14.2.1.3, §3.34): en la descomposición de un objeto, la disposición de los
  objetos contenidos DEBE indicar orden espacial o lógico, no temporal (por ejemplo, un vector o una
  matriz), y no transfiere control de ejecución.
- **A3.3c** (ISO §14.2.1.3, §C.5.1): el alcance de un proceso descompuesto DEBE ser el refinable, sus
  subprocesos, atributos y enlaces tal como el OPD los muestra; un objeto interno sólo es reconocible
  en ese contexto. Si se necesita fuera de él, se modela fuera de la descomposición.

### A3.4 Distribución de enlaces al descomponer

- **A3.4a** (ISO §14.2.2.4): un enlace procedimental anclado al contorno de un proceso descompuesto
  tiene semántica distributiva: se aplica a cada subproceso. Los enlaces de agente, de instrumento y de
  efecto sin estados especificados admiten el contorno.
- **A3.4b** (ISO §14.2.2.4): un enlace de efecto con estado de entrada y estado de salida
  especificados no se distribuye: al descomponer DEBE escindirse (A3.4f).
- **A3.4c** (ISO §14.2.2.4): los enlaces de consumo y de resultado NO DEBEN anclarse al contorno de un
  proceso descompuesto. Al descomponer, DEBEN asignarse inicialmente, por defecto, al primer
  subproceso; el modelador los reasigna al subproceso que corresponda. Una herramienta puede
  establecer ese defecto automáticamente (NOTA 2); la reasignación habitual se da como guía en A3.4k.
- **A3.4k** (ISO §14.2.2.4) [guía]: el resultado se reasigna al subproceso que lo genera, que en una
  secuencia es normalmente el último; el consumo, al que lo consume, normalmente el primero.
- **A3.4d** (ISO §14.2.2.4): un enlace de evento desde un objeto o estado sistémico NO DEBE cruzar el
  contorno de un proceso descompuesto desde fuera para iniciar ninguno de sus subprocesos, en ningún
  nivel. Si el evento proviene de un objeto o estado ambiental, el modelador DEBERÍA modelar cómo se
  maneja esa contingencia.
- **A3.4e** (ISO §14.2.2.4): cada enlace transformador se reasigna al subproceso que realmente
  consume, genera o completa el cambio.
- **A3.4f** (ISO §14.2.2.4, Tabla 25): si **P** cambia **A** de **s1** a **s2** y se descompone en más
  de un subproceso, el modelador DEBE anclar el enlace de entrada y el de salida a subprocesos de modo
  temporalmente factible; el par escindido se lee «**P1** cambia **A** de **s1**» y «**P2** cambia
  **A** a **s2**».
- **A3.4g** (Tabla 25 NOTA 1) [informativo]: no existen versiones de control (e, c) de la mitad
  escindida de entrada.
- **A3.4h** (ISO §14.2.2.4, §D.4): no hay excepción «por verificación» a A3.4d: sólo los eventos
  internos al contexto pueden desviar la línea de tiempo (A3.8).
- **A3.4i** (ISO §14.2.4, §8.1.2): al recomponer o plegar, los enlaces procedimentales entre refinados
  y cosas externas DEBEN migrar al OPD del refinable; si quedan varios enlaces entre un mismo objeto y
  un mismo proceso, el modelador DEBE resolver el conflicto por fuerza semántica: consumo = resultado >
  efecto > agente > instrumento; los de estado especificado preceden a los básicos; dentro de cada
  clase, evento > enlace sin modificador > condición (ISO §14.2.4.4–§14.2.4.5). La matriz de la Tabla 27
  está en reglas §6.5–§6.6 y es no verificable: depende de figuras ausentes en la fuente.

### A3.5 Invocación implícita

- **A3.5** (ISO §14.2.2.1): al llegar al contexto de un proceso descompuesto, el control DEBE pasar de
  inmediato al subproceso (o subprocesos) más alto; al terminar cada subproceso se invoca el siguiente;
  al terminar el más bajo, el control DEBE volver al proceso descompuesto. Como la invocación es un
  evento, cada subproceso requiere satisfacer su precondición. La invocación implícita no tiene
  símbolo: la denota la disposición vertical.

### A3.6 Expresión y supresión de estados

- **A3.6a** (ISO §14.2.1.1): el modelador PUEDE suprimir en cada OPD cualquier subconjunto de los
  estados de un objeto que no sean necesarios en el contexto de ese OPD; la expresión de estados es la
  operación inversa.
- **A3.6b** (ISO §14.2.1.1, §14.2.3): qué estados se muestran se decide por OPD y no cambia la
  identidad del objeto. Un estado al que llega o del que sale un enlace en un OPD es necesario en ese
  contexto y no se suprime allí: un enlace no existe sin sus extremos (ISO §14.2.3, NOTA).
- **A3.6c** (ISO §B.6.4, §D.6) [informativo]: mientras el proceso ocurre, el afectado está en
  transición: ya salió de su estado de entrada y aún no entra al de salida.

### A3.7 Habilitador en el contorno

- **A3.7** (ISO §14.2.2.4): un habilitador conectado al contorno de un proceso descompuesto DEBE
  conectar al menos uno de sus subprocesos.

### A3.8 Desvíos de la línea de tiempo

- **A3.8a** (ISO §D.4) [informativo]: por defecto la línea de tiempo empieza arriba y termina abajo,
  salvo indicaciones de desvío: eventos internos al contexto del proceso que pueden causar bucles, y un
  proceso cuyo nombre es o termina en la frase reservada inglesa «Exception Exiting» (su realización
  española la fija spec-OPL). Si ese proceso se invoca, el proceso contenedor termina de inmediato e
  incondicionalmente, sea cual sea su posición.
- **A3.8b** (ISO §D.4) [informativo]: el punto más alto del símbolo del proceso es la referencia: el
  que está más arriba comienza antes; los que están a la misma altura, dentro de unas pocas unidades
  gráficas de tolerancia, comienzan simultáneamente y en paralelo.

### A3.9 Conjunto completo de estados

- **A3.9a** (ISO §14.2.1.1): el conjunto completo de estados de un objeto DEBE ser la unión de los
  estados de ese objeto en todos los OPD del modelo; la OPL de un OPD DEBE expresar los estados sólo
  como ese OPD los muestra.
- **A3.9b** (ISO §14.2.1.1) [localización]: un objeto que muestra un subconjunto propio de sus estados
  DEBE llevar el símbolo de supresión de estados (un estado pequeño con elipsis en su esquina inferior
  derecha); su equivalente textual DEBE ser la frase reservada, que en español es «, y otros estados»
  (EBNF de ISO A.4.4.4; §14.2.1.1 dice «or other states»).

### A3.10 Conflicto entre consumo y resultado al abstraer

- **A3.10** (ISO §14.2.4.2): consumo y resultado tienen la misma fuerza semántica; cuando compiten al
  abstraer, DEBE prevalecer el enlace de efecto, que puede leerse como cambio implícito entre existente
  y no existente.

## A4. Comprensión del modelo

### A4.1 Mecanismos de refinamiento-abstracción

- **A4.1a** (ISO §14.2.1): los mecanismos de refinamiento-abstracción DEBEN ser tres pares:
  descomposición y recomposición (expone u oculta el contenido interno; procesos síncronos, objetos con
  partes ordenadas); despliegue y plegado (expone u oculta refinados; procesos asíncronos, partes,
  rasgos, especializaciones, instancias); expresión y supresión de estados (simplificación por OPD,
  A3.6).
- **A4.1b** (ISO §14.2.2.6, §14.2.1): las vistas de modelo (mapa del sistema, árbol de procesos OPD,
  árboles de objetos OPD y vistas por criterio) dan acceso al contenido del modelo; no son mecanismos
  de refinamiento ni crean hechos.

### A4.2 Profundidad y claridad

- **A4.2a** (ISO §3.63, §B.3) [guía]: el refinamiento aumenta el detalle; si un OPD no agrega
  transformados, estados ni enlaces respecto de su padre, no aporta refinamiento.
- **A4.2b** (ISO §B.3) [informativo]: un OPD DEBERÍA no contener más de 20–25 cosas.

### A4.3 Importancia y altitud

- **A4.3** (ISO §B.2) [informativo]: la importancia relativa de una cosa es, en general, proporcional
  al OPD más alto de la jerarquía donde aparece; el proceso de nivel superior es la función. Por eso lo
  nuclear se ubica en el SD y lo secundario en OPD descendientes (A2.7c).

### A4.5 Simplificación de un OPD sobrecargado

- **A4.5** (ISO §C.5.2) [informativo]: cuando un OPD queda sobrecargado, el modelador PUEDE agrupar un
  conjunto de cosas bajo un proceso intermedio mediante recomposición en el mismo diagrama y luego
  refinarlo por descomposición en un OPD nuevo; así reduce la carga cognitiva a costa de un OPD más.

### A4.7 Contenido de un OPD nuevo

- **A4.7** (ISO §B.3) [informativo]: reglas prácticas para decidir cuándo crear un OPD y mantenerlo
  legible: un OPD DEBERÍA caber en una página o en una pantalla de tamaño medio; DEBERÍA no contener más
  de 20–25 cosas (A4.2b); las cosas no se ocluyen (o están contenidas en otra, como en la
  descomposición, o no se solapan); los enlaces DEBERÍAN ser aproximadamente tantos como las cosas; un
  enlace DEBERÍA no cruzar el área de una cosa; y los cruces entre enlaces DEBERÍAN minimizarse.

### A4.8 Representación de elementos y copias múltiples

- **A4.8a** (ISO §B.4, §14.2.3) [informativo]: un elemento que aparece en un OPD PUEDE aparecer en
  cualquier otro como el mismo elemento, cuantas veces resulte útil; para mostrar un enlace deben estar
  presentes sus dos cosas. Por claridad, conviene incluir en cada OPD sólo los elementos necesarios para
  el aspecto que muestra.
- **A4.8b** (ISO §B.5) [informativo]: para evitar enlaces largos que crucen el OPD, un OPD PUEDE
  contener varias copias de una misma cosa; el modelador PUEDE marcarlas con el símbolo de duplicado
  (una figura pequeña que asoma detrás de la cosa repetida). Esta alternativa DEBERÍA usarse con
  moderación, porque obliga al lector a recordar los enlaces que no se muestran.

### A4.9 Despliegue en el mismo diagrama o en uno nuevo

- **A4.9** (ISO §14.2.1.2): el despliegue en el mismo diagrama equivale a usar los enlaces
  fundamentales; en el despliegue en diagrama nuevo, el refinable DEBE tener contorno grueso en ambos
  OPD. La elección DEBERÍA sopesar el desorden que se agrega al OPD actual frente a crear un OPD nuevo.

### A4.10 Árbol OPD y mapa del sistema

- **A4.10a** (ISO §14.2.2.6, §3.45): el árbol de procesos OPD DEBE partir del SD; cada arista
  apunta del OPD padre al OPD hijo que refina un proceso por descomposición (síncrono) o por despliegue
  de agregación (asíncrono), y DEBE llevar una etiqueta que exprese ese refinamiento (en ISO, «is
  refined by in-zooming … in» o «is refined by unfolding … in»; la oración española la fija spec-OPL).
- **A4.10b** (ISO §14.2.2.6, §3.44): los árboles de objetos OPD forman un bosque, uno por cada objeto
  refinable, y encapsulan la información del objeto como jerarquía.
- **A4.10c** (ISO §14.2.2.6): un mapa del sistema DEBE ser un árbol de procesos OPD que muestra el
  contenido de cada OPD. Las vistas de modelo DEBEN incluir la lista de cosas con los OPD donde
  aparecen, el árbol de procesos y los árboles de objetos; un conjunto de herramientas DEBERÍA permitir
  crear vistas por criterio (camino crítico, agentes e instrumentos, cosas de una clase de enlace).

## A5. Heurísticas de modelado

### A5.1 Relación persistente sin transformación

- **A5.1a** (ISO §3.58, §3.73, §10.2) [guía]: un candidato a proceso del tipo sostener, mantener,
  almacenar o contener que no transforma ningún objeto no es proceso: se modela como enlace estructural
  etiquetado entre los objetos (✓ **Cimentación** soporta **Casa**). Si el sostener exige un esfuerzo
  que sí transforma objetos (un vuelo estacionario consume combustible), se modela como proceso.

### A5.2 Objeto transitorio e invocación

- **A5.2** (ISO §9.5.2.5) [informativo]: un objeto transitorio que un proceso crea y otro consume de
  inmediato, sin otra observación, puede reemplazarse por un enlace de invocación (ISO §9.5.2.5, NOTA 2).

### A5.4 Cambio de rol entre niveles

- **A5.4** (ISO §14.2.2.4, Tabla 25 NOTA 2, Figura 53) [informativo]: un objeto que es instrumento en
  el OPD abstracto puede ser afectado en un OPD descendiente cuando su estado inicial y su estado final
  coinciden (**Lavavajillas**: **vacío** → **cargado** → **vacío**).

### A5.5 Clasificación de atributos

- **A5.5** (ISO §3.4, §7.3.5.5) [guía]: cuatro dimensiones binarias orientan el tratamiento de un
  atributo: explícito o implícito, cualitativo o cuantitativo, duro o blando (computable o no),
  inherente o emergente. Los blandos pueden no requerir seguimiento; los emergentes orientan la
  arquitectura.

### A5.6 Extremos de los enlaces

- **A5.6** (ISO §10.1, §10.3.3, §9.5.1, §6.2.4): un enlace estructural conecta objetos con objetos o
  procesos con procesos, no un objeto con un proceso, salvo la exhibición-caracterización, que admite las
  cuatro combinaciones de exhibidor y rasgo (objeto o proceso que exhibe un atributo o una operación).
  Un enlace procedimental conecta un objeto o estado con un proceso, salvo los enlaces de control entre
  procesos: invocación y excepción (ISO §9.5.1, §9.5.2.5, §9.5.4).

### A5.8 Atributo discriminante

- **A5.8** (ISO §10.3.4.3, §10.4.1): especializaciones que difieren por el valor de un atributo heredado
  se expresan con un atributo discriminante y una caracterización con estado especificado; el OPD
  resulta más compacto.

### A5.9 Herencia

- **A5.9** (ISO §10.3.4.2): una especialización hereda del general todas sus partes, todos sus rasgos,
  todos sus enlaces estructurales etiquetados y todos sus enlaces procedimentales; se admite herencia
  múltiple. El modelador PUEDE sustituir un participante heredado especificando una especialización de
  ese participante con otro nombre y otro conjunto de estados.

### A5.11 Esencia de cosas mixtas

- **A5.11** (ISO §7.3.3, §3.25) [guía]: una cosa con aspectos físicos e informacionales se clasifica por
  su esencia tangible dominante: física.

### A5.12 Estados directos o atributo con valores

- **A5.12a** (ISO §7.3.5.5, §3.4) [guía]: si un solo atributo es relevante, se usan estados directos
  del objeto (**Feto** puede estar **embrión** o **bebé**); si hay varios atributos, o el nombre del
  atributo es informativo, se modela el atributo con sus valores.
- **A5.12b** (ISO §3.4, §10.3.3): un rasgo de una cosa se modela como atributo exhibido (un objeto que
  caracteriza a la cosa), no como proceso (**Tener**, **Poseer**) ni como estado conjuntivo.

### A5.13 Generalización

- **A5.13a** (ISO §10.3.4.2) [guía]: si varios objetos específicos de un OPD descendiente tienen la misma
  relación con el proceso principal, el SD muestra el objeto general y el OPD descendiente sus
  especializaciones; así no se sobrecarga el SD.
- **A5.13b** (ISO §10.3.4.2): para crear un general a partir de una o más especializaciones candidatas,
  los elementos heredables comunes DEBEN migrar al general: (1) combinar los rasgos y las partes comunes
  en un general nuevo; (2) conectarlo por generalización-especialización; (3) quitar de las
  especializaciones lo que ahora heredan; (4) migrar al general los enlaces etiquetados y procedimentales
  comunes a todas ellas.
- **A5.13c** (ISO §10.3.4.2) [guía]: al especializar, dejar sólo el enlace del general subespecifica
  (cualquier instrumento serviría a cualquier especialización); dejar el del general y los específicos
  sobreespecifica; lo adecuado es reemplazar el del general por los específicos entre las
  especializaciones correspondientes.

### A5.14 Prueba objeto-proceso

- **A5.14a** (ISO §7.3.2): un sustantivo es proceso sólo si cumple tres criterios: está asociado con el
  tiempo, está asociado con un verbo y transforma un objeto (**Vuelo** es proceso porque transforma la
  ubicación de un avión).
- **A5.14b** (ISO §7.3.2) [guía]: al modelar desde un texto, preguntar «¿qué objeto transforma este
  proceso?» revela objetos omitidos. Que un sustantivo sea objeto por defecto es no verificable: la
  fuente local de ISO §7.3.2 está resumida.

### A5.15 Sinónimos, homónimos y apariciones

- **A5.15** (ISO §B.6.2, §B.6.3, §B.4, §B.5) [informativo]: los nombres son únicos en el modelo: los
  sinónimos se reducen a un término y los homónimos del dominio reciben nombres distintos. Repetir una
  cosa en otro OPD o en el mismo es otra aparición del mismo elemento, no una cosa nueva (A4.8).

### A5.18 Varios agentes

- **A5.18a** (ISO §12.1): varios enlaces de agente hacia un mismo proceso tienen semántica AND y DEBEN
  escribirse en una sola oración con «y».
- **A5.18b** (ISO §3.3, §B.6.2): un grupo de humanos puede ser un único agente, nombrado con «Grupo»
  (A2.8a); se modelan agentes separados cuando sus roles o su identidad importan.
- **A5.18c** (ISO §14.2.2.5) [guía]: si los agentes participan en momentos distintos, se descompone el
  proceso y cada agente se enlaza a su subproceso.

### A5.19 Estado inicial y final

- **A5.19** (ISO §7.3.5.3, Figura 53): un estado puede ser a la vez inicial y final, como **vacío** de
  **Lavavajillas**; no se duplica en un estado «de inicio» y otro «de fin».

### A5.20 Atributos cuantitativos

- **A5.20** (ISO §7.3.5.5, §11.3): un atributo cuantitativo declara su unidad de medida y, cuando
  corresponde, su rango de valores (entero, real, cadena o enumerado).

### A5.21 Efecto o cambio de identidad

- **A5.21** (ISO §D.2, §D.3) [guía]: modelar efecto (el mismo objeto conserva su identidad y cambia de
  estado) o consumo y resultado (identidad nueva): si puede definirse un atributo cuyos valores sean los
  estados candidatos y tiene sentido, es efecto; si no, cambio de identidad. La decisión es contextual:
  dos modeladores pueden diferir legítimamente.

### A5.22 Objeto específico de estado

- **A5.22** (Figura C.6) [informativo]: para referirse al «objeto en el estado s» como cosa aparte no se
  duplica el objeto: se deriva un objeto específico de estado, especialización del objeto que refiere a
  ese estado.

### A5.23 Relaciones entre más de dos cosas

- **A5.23** (ISO §3.36, §10.1) [guía]: un enlace une dos cosas; una relación entre tres o más cosas se
  modela como conjunto de enlaces entre pares.

## A6. Control de flujo

- **A6a** (ISO §9.5.1): si la precondición no se satisface, sin enlace de condición el proceso no ocurre
  y espera otro evento; con enlace de condición, el control omite el proceso.
- **A6b** (ISO §9.5.3.1): si falta el objeto (o el estado) enlazado por condición, la evaluación de la
  precondición falla y el control omite el proceso, aunque los enlaces sin condición estén satisfechos:
  la omisión precede a la espera.
- **A6c** (ISO §3.18, §9.5.1, §12.1): con varios enlaces de evento hacia un proceso, cada evento inicia
  por sí solo la evaluación de la precondición; la conjunción AND recae sobre los objetos de la
  precondición. Con varias condiciones, todas DEBEN satisfacerse para ejecutar y basta que una falle
  para omitir.
- **A6d** (ISO §D.5) [informativo]: un evento de estado PUEDE representar un evento temporal; un objeto
  reloj del sistema con un valor puede iniciar un proceso (Figura D.2).
- **A6e** (ISO §12.2, §12.7, §A.4.5.3, Figura 38): en un abanico XOR existe u ocurre exactamente una de
  las cosas del extremo divergente; en un abanico OR, al menos una. En un abanico probabilístico la suma
  de las probabilidades DEBE ser exactamente 1. Los abanicos de agente e instrumento admiten ambas
  direcciones (varios habilitadores hacia un proceso y un habilitador hacia varios procesos); la Tabla 20
  muestra sólo una.
- **A6f** (ISO §13, Figura 44): una etiqueta de ruta alinea un par de enlaces procedimentales: si el
  conjunto de objetos posterior admite más de un destino, se sigue el enlace con la misma etiqueta que el
  de entrada. Los enlaces de entrada de rutas distintas no se exigen juntos (Figura 44) [informativo].
- **A6g** (ISO §9.5.2.5, §11.2, §D.4): la iteración se modela con autoinvocación (el proceso se invoca a
  sí mismo al terminar); la repetición secuencial de un proceso, con un proceso recurrente y un contador
  (ISO §11.2, NOTA 2) [informativo]; y los bucles dentro de un proceso descompuesto, con eventos internos al
  contexto (§D.4) [informativo].
- **A6h** (ISO §9.5.2.5, §9.5.3, §9.5.4) [guía]: patrones que aplican esas construcciones: bucle por
  invocación explícita desde el último subproceso; intervalos mediante un proceso de espera con duración
  especificada; decisión mediante un objeto de dos estados, cada uno de los cuales es condición de un
  proceso alternativo (si-entonces-si no).
- **A6i** (ISO §12.7): un proceso que genera un objeto con n estados sin especificar estado lo genera en
  cada estado con probabilidad 1/n; si el objeto tiene un estado inicial, lo genera en él con probabilidad
  1; si tiene m estados iniciales (m < n), en uno de ellos con probabilidad 1/m.
- **A6j** (ISO §12.2, §13) [guía]: un recorrido de ejecución atraviesa el árbol OPD tomando exactamente una
  rama en cada abanico XOR; el repertorio de recorridos de un modelo cubre todas las ramas, no sólo el
  caso esperado.

## A7. Cuantitativo, excepciones y requisitos

- **A7a** (ISO §9.3.1, §9.3.2, §9.5.4.1): para modelar consumo o generación a lo largo del tiempo, el
  enlace DEBE tener una propiedad de tasa y el objeto un atributo de cantidad disponible. Un proceso PUEDE
  tener un atributo de duración, especializable en duración mínima, esperada y máxima, con una
  distribución de probabilidad opcional.
- **A7b** (ISO §9.3.1) [informativo]: el modelador PUEDE crear una excepción si la cantidad del objeto es
  menor que la tasa por la duración esperada del proceso (ISO §9.3.1, NOTA 1).
- **A7c** (ISO §10.3.4.3) [guía]: el espacio de estados compuesto de un objeto es el producto cartesiano
  de los estados de sus atributos o partes; no todos sus puntos son factibles, y los infactibles se
  identifican al modelar los procesos (ISO da ese producto para las especializaciones por varios atributos
  discriminantes, con combinaciones posiblemente inválidas). Una precondición compuesta se escribe como
  cláusulas XOR unidas por AND.
- **A7d** (ISO §9.5.4.2, §9.5.4.3): el enlace de excepción por sobretiempo inicia el proceso de manejo si
  la ejecución excede la duración máxima; el de subtiempo, si termina antes de la duración mínima.
- **A7e** (ISO §9.5.4, §D.7) [guía]: el proceso de manejo lleva al afectado en transición a un estado
  admisible; un modelo pensado para simulación sin manejadores de excepción queda incompleto para ese fin.
- **A7f** (ISO §10.1, §10.2, §3.36, §3.25) [guía]: un requisito puede modelarse como objeto
  informacional, y su traza con otro objeto, como enlace estructural etiquetado entre objetos (p. ej.,
  «satisface»). Un enlace estructural no conecta un proceso con un objeto ni tiene un enlace como extremo,
  así que la traza desde procesos o desde enlaces queda fuera del modelo.

## A8. Invariantes y validación

### A8.1 Validación continua

- **A8.1a** (ISO §6.2.1) [guía]: tras cada edición gráfica se lee la oración OPL resultante; así se
  detecta en el acto el enlace mal elegido (consumo por instrumento: «**Manufactura** consume **Plano**»
  cuando debía ser «**Manufactura** requiere **Plano**»), antes de que el error se propague.

### A8.2 Invariantes nucleares

Índice; la definición de validez vive en reglas.

- **A8.2a** (ISO §14.2.2.6, §3.75): el SD tiene exactamente un proceso sistémico (A2.7d).
- **A8.2b** (ISO §3.3, §3.30): un agente es un humano o un grupo de humanos; un instrumento es un
  habilitador no humano.
- **A8.2c** (ISO §3.17): el proceso no transforma a sus habilitadores.
- **A8.2d** (ISO §10.3.3, §14.2.2.6) [guía]: el objeto que representa al sistema exhibe la función
  (A2#6b).
- **A8.2e** (ISO §4, Figura C.10) [informativo]: los objetos ambientales se dibujan con contorno
  discontinuo.
- **A8.2f** (ISO §14.2.2.4): ni consumo ni resultado se anclan al contorno de un proceso descompuesto
  (A3.4c).
- **A8.2g** (ISO §3.58): todo subproceso transforma al menos un objeto.
- **A8.2h** (ISO §6.2.1): todo OPD tiene un párrafo OPL equivalente.
- **A8.2i** (ISO §6.2.1, §14.2.2.6): todo hecho del modelo aparece en al menos un OPD.
- **A8.2j** (ISO §10.1, §10.3.1): los enlaces estructurales unen cosas de la misma perseverancia, salvo
  la exhibición-caracterización (A5.6).
- **A8.2k** (ISO §3.52, §3.54, §8.2.2): el conjunto de objetos previo al proceso reúne los objetos a
  evaluar antes de iniciarlo (consumidos, afectados y habilitadores); el posterior, los que permanecen o
  resultan al terminar (resultantes y afectados). Si los habilitadores pertenecen también al posterior es
  no verificable: ISO §3.52 («remaining») lo admitiría y la fuente local de ISO §8.2.2 está resumida.
- **A8.2l** (ISO §14.2.2.6, §6.1.5): en el SD, todo proceso distinto de la función es ambiental.
- **A8.2m** (ISO §7.3.5.3): un estado puede ser a la vez inicial y final (A5.19).
- **A8.2n** (ISO §12.7): la generación sin estado especificado sigue A6i (1/n salvo estados iniciales).
- **A8.2o** (ISO §B.3) [informativo]: un OPD DEBERÍA no contener más de 20–25 cosas (A4.2b); es guía de
  legibilidad, no invariante.
- **A8.2p** (ISO §B.6.2, §A.3.3): los nombres de objeto son singulares y cada cosa tiene un nombre único
  en el modelo.

### A8.3 Consistencia de hechos

- **A8.3a** (ISO §14.2.3): un hecho del modelo que aparece en un OPD DEBE ser verdadero para todo el
  conjunto de OPD del modelo, y ningún OPD de los árboles de procesos o de objetos DEBE contener un hecho
  que contradiga otro del mismo OPD o de otro.
- **A8.3b** (ISO §14.2.3): un hecho PUEDE ser refinamiento o abstracción de otro: «**P** afecta **A**» en
  un OPD y «**P** cambia **A** de **s1** a **s2**» en otro no se contradicen; «**P** genera **A**» y
  «**P** consume **A**» sí.
