---
urn: urn:fxsl:kb:reglas-opm-estrictas-es
nombre: reglas-opm-estrictas-es
version: 2.0.0
estado: publicado
descripcion: "Reglas OPM estrictas según ISO/PAS 19450:2015, en español: ontología, clases de enlace y su validez, modificadores de control, abanicos, refinamiento, bimodalidad OPD↔OPL y consistencia de hechos."
fuente: "ISO/PAS 19450:2015, revisión cláusula por cláusula (2026-10-10); sustituye la sincronización KB previa"
autor: FS
creado: 2026-05-31
lang: es
tags: [opm, canon, opd, opl, strict-rules, prescriptive, iso-19450]
familia: bok
depende: []
cita: [urn:fxsl:kb:spec-forja-opd-es, urn:fxsl:kb:spec-forja-opl-es, urn:fxsl:kb:metodologia-forja-opm-es]
---

# Reglas OPM estrictas (ISO 19450) en español

## Definición

Este documento fija, en español, las reglas de OPM que establece ISO/PAS 19450:2015: qué es una cosa, un estado y un enlace; qué enlaces son válidos entre qué extremos; cómo actúan los modificadores de control, los abanicos lógicos y la multiplicidad; cómo se refina y se abstrae un modelo; y qué exige la bimodalidad OPD↔OPL y la consistencia de hechos. Su alcance es sólo lo que la norma funda o lo que se integra orgánicamente a ella (la localización española de OPL). No contiene reglas de herramienta, de interfaz, de persistencia ni de método propio de un producto.

## Precedencia

- Dentro del canon: reglas > spec-OPD / spec-OPL > metodología. Este documento es el dueño de la semántica y de la validez; spec-OPD es dueño de la notación gráfica, spec-OPL de la realización OPL-ES y metodología del método. Cuando una regla se define aquí, los demás documentos la citan por ID.
- Ante duda sobre el sentido de una regla, manda la norma (ISO/PAS 19450:2015). Si el canon y la norma divergen sin declaración, se corrige el canon.
- El perfil OpForja (`perfil/reglas-opforja`) se subordina a este canon: puede endurecerlo o extenderlo de forma declarada, nunca contradecirlo.

## Convenciones

- Cita: `ISO §x.y` remite a la cláusula de ISO/PAS 19450:2015 con su numeración; «Tabla n», «Figura n» y «Anexo X» remiten a esa misma edición. El Anexo A (sintaxis OPL) es normativo; los Anexos B, C y D, las NOTAS y los EJEMPLOS son informativos.
- Modalidad: shall → DEBE; shall not → NO DEBE; should → DEBERÍA; should not → NO DEBERÍA; may → PUEDE. Lo descriptivo («can», definiciones) se escribe en indicativo, sin palabra modal en mayúsculas.
- Marcas: `[informativo]` = la regla sólo la funda un anexo informativo, una NOTA o un EJEMPLO; nunca lleva DEBE. `[localización]` = realización española de OPL sin contraparte literal en la norma; no cambia el hecho del modelo. `[guía]` = método que aplica construcciones ISO sin agregar reglas. «No verificable» = la fuente disponible está resumida o le falta la figura que decide la regla.
- Referencias cruzadas: por ID, o por documento y sección (`reglas §5.2`, `spec-OPL §11.1`). Una regla definida en otro documento se cita como `- **ID**: ver <doc> §n.`; una regla fusionada con otra, como `- **ID** = <ID>.`
- Términos: un concepto, un término, según el glosario de la norma (cláusula 3). «Aparición» es cada presencia de una cosa en un OPD; «instancia» sólo significa instancia de modelo o instancia operacional (ISO §3.28, §3.29).
- La numeración de secciones conserva la de la versión 1.x; los huecos son secciones trasladadas.

Secciones trasladadas al perfil: Mapa de familia Forja, Definiciones, §3.6, §4.1, §4.17, §7.6, §8.3, §8.7, §10 (salvo §10.1), §12 y Anexo C; parcialmente §2.3, §2.8, §2.9, §3.12, §8.6, §8.10, §8.11, §9.3, §11 y Anexos A y B.

### Conformidad OPM

| Nivel de conformidad | Regla |
|---|---|
| Parcial simbólico | R-CONF-1 |
| Completo | R-CONF-2 |
| Herramienta | R-CONF-3 |

- **R-CONF-1** (ISO §5): la conformidad parcial (simbólica) DEBE usar sólo los símbolos de ISO §4 y los elementos de ISO §7 a §12 con el significado que la norma les asigna.
- **R-CONF-2** (ISO §5, §6, §14): la conformidad completa DEBE cumplir R-CONF-1 y aplicar el enfoque y el esquema de modelado de ISO §6 y §14.
- **R-CONF-3** (ISO §5, Anexo A): la conformidad de herramienta DEBE cumplir R-CONF-1, guiar y ayudar al usuario a cumplir R-CONF-2 y soportar OPL según la EBNF del Anexo A. OPL-ES es la adaptación española de esa EBNF (R-OPL-EBNF-1).
- **R-CONF-4** (ISO §5): una implementación que usa o persiste símbolos sin la semántica OPM asignada no es conforme como herramienta OPM.
- **R-CONF-5** (ISO §5): una herramienta que no guía ni ayuda al usuario a cumplir la conformidad completa no es conforme como herramienta.

### Principios de modelado

- **R-PRIN-1** (ISO §6.1.1, §14.1): la función del sistema y el propósito de modelado DEBEN guiar el alcance y el grado de detalle del modelo.
- **R-PRIN-2** (ISO §6.1.1, §14.1): toda decisión de alcance DEBE derivarse de la función del sistema, del propósito de modelado y de los interesados relevantes.
- **R-PRIN-3** (ISO §6.1.2, §3.43): un modelo OPM DEBE unificar función, estructura y comportamiento en un único formalismo; un hecho OPM NO DEBE expresarse en una notación externa.
- **R-PRIN-4** (ISO §3.23, §6.1.3): el proceso que provee el valor funcional DEBE expresar la función del sistema tal como la percibe su beneficiario principal.
- **R-PRIN-5** (ISO §6.1.4): el modelador DEBERÍA distinguir la función (valor para el beneficiario) del comportamiento (cómo opera el sistema).
- **R-PRIN-6** (ISO §6.1.5, §7.3.3, §7.3.4): el límite del sistema separa las cosas sistémicas de las ambientales; toda cosa tiene afiliación, sistémica por defecto.
- **R-PRIN-7** (ISO §6.1.5, §7.3.3): las cosas ambientales DEBEN formar una colección de cosas fuera del sistema que pueden interactuar con él.
- **R-PRIN-8** (ISO §6.1.6, §14.1, §14.2.1): el grado de detalle DEBE equilibrar claridad y completitud mediante los mecanismos de refinamiento y abstracción.
- **R-PRIN-9** (ISO §6.1.1, §14.2.3): todo OPD, también el orientado a un interesado, pertenece al mismo modelo y NO DEBE contradecir hechos de otro OPD.

---

## 2. Ontología de cosas y estados

### 2.1 Cosas (ISO §3.76, §7.3.1)

Una cosa es exactamente de una de dos clases:

| Clase | Glosario | Símbolo | Perseverancia (ISO §3.50) |
|---|---|---|---|
| Objeto | ISO §3.39 | rectángulo | estática (en OPL, «persistente», ISO A.4.4.2) |
| Proceso | ISO §3.58 | elipse | dinámica (en OPL, «transitoria», ISO A.4.4.2) |

- **R-COSA-1** (ISO §7.3.1, §6.2.2): una cosa DEBE ser un objeto o un proceso; no existe otra clase de cosa.
- **R-COSA-2** (ISO §3.50, §7.3.3, A.4.4.2): la perseverancia es la propiedad genérica que distingue la clase: estática para el objeto, dinámica para el proceso. No es un atributo gráfico ni un valor que se elija aparte de la clase.
- **R-COSA-3** (ISO §3.76, §3.68): el estado no es una cosa: pertenece a un objeto y es una de las posiciones posibles de ese objeto (R-EST-1).
- **R-COSA-4** (ISO §7.3.2): un sustantivo denota un proceso si cumple los tres criterios de la prueba objeto-proceso: asociación temporal, asociación verbal y transformación de al menos un objeto; si no los cumple, denota un objeto.

### 2.2 Objetos (ISO §3.39)

- **R-OBJ-1** (ISO §3.39, §7.1.1): un objeto es una cosa que existe, o puede existir, física o informacionalmente.
- **R-OBJ-2** (ISO §3.66, §3.67, §3.2, §3.15, §3.17): un objeto es con estados (al menos un estado) o sin estados. Un objeto sin estados no puede ser afectado: como transformado sólo puede crearse o consumirse; puede además ser habilitador.
- **R-OBJ-3** (ISO §7.3.3, §7.3.4, A.4.4.2): toda cosa tiene tres propiedades genéricas: perseverancia (fijada por la clase, R-COSA-2), esencia ∈ {física, informacional}, con valor por defecto informacional, y afiliación ∈ {sistémica, ambiental}, con valor por defecto sistémica.
- **R-OBJ-4** (ISO A.3.2, A.4.4.3): un objeto PUEDE declarar tipo ∈ {`boolean`, `string`, `integer` (con prefijo opcional `unsigned`), `float`, `double`, `short`, `long`, `enumerated`}; la oración es D18.
- **R-OBJ-5** (ISO §3.55, §7.3.4, A.4.4.2): la esencia por defecto de una cosa es informacional; la esencia primaria del sistema es la de la mayoría de sus cosas.
- **R-OBJ-8** (ISO §7.1.1): desde el punto de vista temporal, la existencia de un objeto persiste salvo que un proceso actúe sobre él.

### 2.3 Procesos (ISO §3.58)

- **R-PROC-1** (ISO §3.58, §7.2.1, §6.2.3): un proceso transforma uno o más objetos.
- **R-PROC-2** (ISO §7.2.1, §7.3.2, §3.17): todo proceso DEBE transformar al menos un objeto por consumo, resultado o efecto; un habilitador no satisface este requisito.
- **R-PROC-3** (ISO §7.2.1): un proceso tiene duración positiva.
- **R-PROC-4** (ISO §3.68) [informativo]: los procesos no tienen estados; para representar sus fases se PUEDE descomponer el proceso en subprocesos (ISO §3.68 NOTA 1).

### 2.4 Nombres válidos (OPL-ES)

- **R-NOM-OBJ-1** (ISO A.3.3, B.6.2, B.6.5): un nombre de objeto DEBE ser una frase nominal capitalizada y DEBERÍA ser singular.
- **R-NOM-OBJ-2** (ISO B.6.2) [informativo]: un objeto de varios miembros DEBERÍA nombrarse con el núcleo «Conjunto de» (inanimados) o «Grupo de» (humanos) seguido del nombre de los miembros.
- **R-NOM-PROC-1** (ISO A.3.3, B.6.3) [localización]: un nombre de proceso DEBE ser una frase capitalizada (verbal o nominal, ISO A.3.3) y DEBERÍA realizar el gerundio inglés que recomienda ISO B.6.3 con un infinitivo o un sustantivo deverbal que denote la acción (`Despachar`, `Despacho`, `Fabricación`); el gerundio español no se usa en nombres.
- **R-NOM-PROC-2** (ISO B.6.3) [informativo]: un nombre de proceso DEBERÍA tener a lo sumo cuatro palabras.
- **R-NOM-PROC-3** (ISO A.3.3, B.6.5) [localización]: las palabras léxicas de los nombres de cosa DEBEN ir capitalizadas; los artículos y las preposiciones breves PUEDEN ir en minúscula.
- **R-NOM-EST-1** (ISO A.4.2, B.6.4): un nombre de estado DEBE comenzar en minúscula y DEBERÍA usar forma pasiva o descriptiva.
- **R-NOM-ETIQ-1** (ISO A.4.2, B.6.5): una etiqueta de enlace estructural DEBE ser una frase que comienza en minúscula; su uso en la oración lo fija R-OPL-SE-1.

### 2.5 Qué no puede ser una cosa

| No es cosa | Por qué |
|---|---|
| Un estado aislado | El estado pertenece siempre a un objeto (ISO §3.76, §3.68). |
| Un enlace | Elemento es cosa o enlace; son clases disjuntas (ISO §3.16, §6.2.2). |
| Un atributo sin exhibidor | Un atributo es un objeto que caracteriza una cosa mediante exhibición-caracterización (ISO §3.4, §10.3.1). |

### 2.6 Estados (ISO §3.68)

- **R-EST-1** (ISO §3.68, §7.3.5.2): un estado existe sólo dentro de su objeto dueño; no hay estados sin objeto.
- **R-EST-2** (ISO §7.3.5.3, §7.3.5.4, A.4.4.4): un estado PUEDE designarse inicial, final o por defecto; los demás estados no llevan designación.

| Designación | Símbolo (ISO §7.3.5.4) | Cuántos por objeto |
|---|---|---|
| Inicial | contorno grueso | uno o varios (ISO A.4.4.4) |
| Final | contorno doble | uno o varios (ISO A.4.4.4) |
| Por defecto | flecha diagonal abierta hacia el estado | a lo sumo uno (ISO A.4.4.4 sólo tiene la oración singular) |
| Sin designación | contorno simple | — |

- **R-EST-3** (ISO §7.3.5.3, A.4.4.4): un mismo estado PUEDE ser inicial y final a la vez (D10).

### 2.7 Instancias

- **R-INS-1** (ISO §10.3.5.1, §3.29) [informativo]: crear una cosa en el modelo conceptual implica que puede existir al menos una instancia operacional de ella o de una de sus especializaciones (ISO §10.3.5.1 NOTA 2).
- **R-INS-2** (ISO §3.28, §3.29, B.4, B.5): DEBE distinguirse la instancia de modelo (ISO §3.28) de la instancia operacional (ISO §3.29); repetir una cosa en otro OPD o en el mismo es una aparición del mismo elemento (ISO B.4, B.5), no una instancia.
- **R-INS-3** (ISO §10.3.5.1) [informativo]: el rótulo de una instancia PUEDE mostrarse como «Instancia : Clase» (ISO §10.3.5.1, Figuras 26–27); su oración es RF4.
- **R-INS-4** (ISO §6.2.6.1): un enlace entre cosas del modelo conceptual no implica comportamiento ejecutado hasta que existen instancias operacionales.
- **R-INS-7** (ISO §10.3.5.2): una clase de objeto y una clase de proceso son clases distintas; una instancia de proceso es una ocurrencia identificable de su clase, con su propio conjunto de instancias de objeto previas y posteriores.

R-INS-6 remite a R-HER-6 (reglas §5.5).

### 2.8 Modelo conceptual y ejecución

- **R-EJEC-1** (ISO §6.2.6.1): el modelo conceptual DEBE describir patrones de estructura y comportamiento; NO DEBE confundirse con una ocurrencia operacional.
- **R-EJEC-7** (ISO §9.5.3.1, §9.5.3.2, §8.2.1): si al activarse el proceso no existe la instancia operacional del objeto enlazado con `c` (o no está en el estado especificado), la precondición falla y el control omite el proceso, sin esperar.
- **R-EJEC-8** (ISO §9.5.3.1, §8.2.2): el proceso sólo se ejecuta si se satisface la precondición de todo su conjunto de objetos previo; la falta de cualquier objeto enlazado con `c` omite el proceso. La precedencia de la omisión frente a la espera no es verificable con la fuente disponible (ISO §8.2.2 está resumida).
- **R-EJEC-9** (ISO §9.5.2.5.1): al completarse un proceso, el control inicia de inmediato el proceso que invoca; la autoinvocación repite el mismo proceso. Un proceso omitido no se completa y no invoca (ISO §9.5.2.5.1 NOTA 1).

### 2.9 Metamodelo OPM

- **R-META-1** (ISO §6.2.1, C.2): un modelo OPM DEBE expresarse como un conjunto de OPDs y su especificación OPL equivalente; la composición detallada del modelo es la del metamodelo informativo (ISO C.2).
- **R-META-2** (ISO C.2, C.3) [informativo]: según el metamodelo, un OPD consta de constructos y cada constructo de un conjunto de cosas y un conjunto de enlaces.
- **R-META-3** (ISO A.4.1, C.2): un párrafo OPL DEBE ser una secuencia de oraciones OPL terminadas en punto; las frases y las frases reservadas son del metamodelo informativo (ISO C.2).
- **R-META-5** (ISO §6.2.1): la dualidad OPD↔OPL DEBE preservarse íntegramente dentro de cada modelo.
- **R-META-10** (ISO C.3) [informativo]: un constructo básico consta de exactamente dos cosas y un enlace.
- **R-META-11** (ISO C.3) [informativo]: un constructo compuesto PUEDE contener abanicos de enlaces o más de dos refinados.
- **R-META-13** (ISO C.4, §3.36) [informativo]: un enlace une dos cosas y consta de origen, destino y conector; el conector consta de línea, símbolo, etiqueta opcional y etiqueta de ruta opcional.
- **R-META-14** = R-COSA-1.
- **R-META-15** (ISO C.4) [informativo]: un objeto con `s` estados representa `s` objetos específicos de estado, cada uno especialización del objeto que refiere a uno de sus estados.
- **R-META-16** (ISO C.4, §10.4.2.3) [informativo]: el objeto específico de estado se enlaza con un enlace estructural etiquetado «refiere a» cuyo destino es el estado (ISO C.4, Figura C.6).

---

## 3. Notación gráfica del OPD

La notación gráfica de la norma (símbolos de cosas y estados, contornos, sombra, puntas y marcas de enlace, triángulos, anotaciones, indicadores, contención y disposición) la define spec-OPD, dueño de ese plano. Este documento conserva los IDs de la versión 1.x como referencias; la validez de cada construcción está en reglas §5 a §9.

### 3.1 Formas cerradas

Ver spec-OPD §2.1 (cosas) y spec-OPD §3.1 (estados).

### 3.2 Forma × contorno × sombra

Ver spec-OPD §2.1: las ocho representaciones de una cosa (clase × afiliación × esencia); el contorno grueso de refinamiento y el símbolo de cosa duplicada son marcas aparte (spec-OPD §10.1, §10.4).

### 3.3 Contorno

- **R-CTRN-1**: ver spec-OPD §2.1.
- **R-CTRN-1A**: ver spec-OPD §2.1.
- **R-CTRN-2**: ver spec-OPD §10.1.

### 3.4 Sombra

- **R-SOMB-1**: ver spec-OPD §2.1.
- **R-SOMB-3** = R-SOMB-1.

### 3.5 Color

- **R-COLOR-1** = R-COLOR-2.
- **R-COLOR-2**: ver spec-OPD §2.1.

### 3.7 Decoraciones de extremo de enlace

Ver spec-OPD §4.1 (transformadores), spec-OPD §5 (habilitadores), spec-OPD §7.2 (etiquetados) y spec-OPD §8.1 (invocación y autoinvocación).

- **R-DEC-1**: ver spec-OPD §5.

### 3.8 Triángulos de las relaciones estructurales fundamentales

- **R-TRI-1**: ver spec-OPD §7.1.
- **R-TRI-1A**: ver spec-OPD §7.1.
- **R-TRI-2**: ver spec-OPD §7.1.
- **R-TRI-2A**: ver spec-OPD §7.1.

### 3.9 Anotaciones sobre enlaces

- **R-MARCA-1**: ver spec-OPD §6.

### 3.10 Indicadores auxiliares

Ver spec-OPD §3.3 (supresión de estados), spec-OPD §7.1 (colección incompleta), spec-OPD §9 (multiplicidad) y spec-OPD §10.4 (cosa duplicada).

### 3.11 Contención

- **R-ANID-1**: ver spec-OPD §10.1.
- **R-ANID-1A**: ver spec-OPD §10.1.

### 3.12 Legibilidad y disposición

- **R-LAY-4**: ver spec-OPD §8.1.

---

## 4. OPL-ES: equivalencia con la OPL de ISO 19450

Esta sección fija qué oraciones OPL-ES expresan cada hecho de la norma (la correspondencia que decide la bimodalidad, R-BI-TAB-1). La superficie operativa del lenguaje (tokenización, análisis, edición, variantes de emisión) es de spec-OPL. En las plantillas, **negrita** marca el hueco de un nombre de objeto, *cursiva* el de un proceso y `monoespacio` el de un estado: es notación de este documento para los huecos, no parte del hecho.

### 4.0 Contrato textual OPL-ES

- **R-OPL-TEXT-1** (ISO A.1, §6.2.1): OPL-ES es la expresión textual en español del OPL de ISO 19450; toda oración canónica DEBE corresponder a una producción del Anexo A (o a una sintaxis de las cláusulas 9 a 14 que la EBNF no recoge, ISO A.1).
- **R-OPL-TEXT-2** (ISO §6.2.1, A.1): OPL-ES fija sólo superficie léxica, sintáctica y plantillas; NO DEBE añadir ni quitar hechos respecto del OPD.
- **R-OPL-TEXT-3** (ISO §6.2.1): toda mención textual de un enlace, un refinamiento, una multiplicidad o un operador DEBE denotar el mismo hecho que su construcción gráfica.
- **R-OPL-TEXT-4** (ISO A.1) [localización]: OPL-ES DEBE preservar la equivalencia semántica bidireccional con la OPL inglesa de la norma: cada oración OPL-ES traduce exactamente una oración ISO y viceversa.

### 4.2 Decisiones de localización OPL-ES

- **R-OPL-1** (ISO A.4.4.2) [localización]: los adjetivos y participios de una plantilla DEBEN concordar en género y número con el nombre de la cosa a la que se refieren (`**Motor** es físico.`, `**Bomba** es física.`); las tablas muestran la forma que concuerda con el hueco genérico.
- **R-OPL-2** (ISO A.4.4.4, §11.3) [localización]: «estar» se usa para los estados de un objeto (`**Objeto** está en `estado``, `puede estar`); «ser», para el valor de atributo (ISO §11.3), el tipo, la especialización y la instanciación.
- **R-OPL-3** (ISO A.4.6.5, §10.3.4.1, §10.3.5.1) [localización]: el artículo «un/una» aparece sólo en la especialización simple de objetos (`es un`) y en la instanciación (`es una instancia de`); la especialización de procesos va sin artículo (`*Cazar* es *Recolectar Alimento*`).
- **R-OPL-4** (ISO §9.3.1, A.4.3) [localización]: el estado especificado se pospone al objeto con «en» (`**Usuario** en `activo` maneja *Procesar*`); realiza el estado antepuesto de la OPL inglesa sin cambiar el hecho.
- **R-OPL-5** (ISO §9.5.3.1) [localización]: la pasiva se expresa con «se» (`se consume`, `se omite`), no con «es consumido».
- **R-OPL-6** (ISO A.4) [localización]: cada plantilla OPL-ES DEBE conservar la correspondencia producción a producción con la sintaxis inglesa de la norma: el orden sujeto-verbo-complemento sólo se altera cuando la gramática española lo exige y nunca de modo que una oración admita dos lecturas.
- **R-OPL-7** = R-OPL-6.
- **R-OPL-8** [localización]: la preposición «a» personal se omite ante el complemento directo de una oración OPL; no altera el hecho.
- **R-OPL-9** (ISO A.4.2): un identificador PUEDE llevar pospuesto «proceso»/«procesos» u «objeto»/«objetos», en singular o plural.
- **R-OPL-10** (ISO A.4.2): un identificador de objeto PUEDE incluir unidad de medida y cláusula de rango; si se escriben, forman parte del identificador.

### 4.3 Vocabulario fijo

| Función | OPL-ES | ISO |
|---|---|---|
| Consumo | consume | §9.1.2 |
| Resultado | genera | §9.1.3 |
| Efecto | afecta | §9.1.4 |
| Cambio de estado | cambia … de … a | §9.3.3.2 |
| Agente | maneja (con sujeto plural: manejan) | §9.2.2, A.4.5.3.2 |
| Instrumento | requiere | §9.2.3 |
| Iniciación (evento) | inicia | §9.5.2.1 |
| Invocación | invoca | §9.5.2.5 |
| Ocurrencia (condición, excepción) | ocurre | §9.5.3.1, §9.5.4.2 |
| Existencia | existe | §9.5.3.1 |
| Omisión | se omite | §9.5.3.1 |
| Consumo (pasiva) | se consume | §9.5.3.1 |
| Agregación | consta de | §10.3.2 |
| Exhibición | exhibe | §10.3.3.1 |
| Especialización plural | son | §10.3.4.1 |
| Especialización singular | es un/una (objetos); es (procesos) | §10.3.4.1, A.4.6.5 |
| Especialización exclusiva | puede ser o bien … o bien …; puede ser uno de … | A.4.6.5 |
| Instanciación | es una instancia de | §10.3.5.1 |
| Relación sin etiqueta | se relaciona con / se relacionan | §10.2.2, A.4.6.2.2 |
| Rango de valor | varía de … a | A.3.2 |
| Tipo | es de tipo | A.4.4.3 |
| Enumeración de estados | puede estar | A.4.4.4 |
| Descomposición | se descompone en … en esa secuencia | §14.2.2.1, A.4.7.4 |
| Despliegue | se despliega en | §14.2.1.2, A.4.7.2 |
| Refinamiento entre OPDs | se refina por descomposición de … en; se refina por despliegue de … en | §14.2.2.6.1.4 |
| Plegado | es plegado de | A.4.7.3 |
| Recomposición | se recompone desde | A.4.7.5 |

- **R-OPL-VERB-1** (ISO A.4.5.2.2, A.4.5.3.2): los verbos fijos van en tercera persona del presente de indicativo, en singular salvo que el sujeto sea una lista (`**A** y **B** manejan *P*`).

**Palabras clave fijas** (ISO A.3.1, A.4.3):

| Función | OPL-ES | ISO |
|---|---|---|
| Condicional | si | §9.5.3.1 |
| Consecuencia | en cuyo caso | §9.5.3.1 |
| Alternativa | de lo contrario | §9.5.3.1, §9.5.3.2 |
| Consecuente de la sintaxis alternativa | entonces | §9.5.3.1 |
| Origen del cambio | de | §9.3.3.2 |
| Destino del cambio | a | §9.3.3.2 |
| OPD padre | desde | A.4.7 |
| Conjunción copulativa | y (e ante sonido /i/: i-, hi- + consonante) | A.4.3, §12.1 |
| Conjunción disyuntiva | o (u ante sonido /o/: o-, ho-) | A.4.3 |
| Adición heterogénea | así como | §10.3.3.1, A.4.7.4 |
| XOR | exactamente uno de | §12.2 |
| OR | al menos uno de | §12.2 |
| Colección incompleta | y al menos otro/otra … | §10.3.2, §10.3.3.1, §10.3.4.1 |
| Estados suprimidos | , y otros estados (frase fija) | A.4.4.4, §14.2.1.1 |
| Multiplicidad | un/una; un/una … opcional; al menos un/una; opcionales; muchos/muchas; n; n a m | §11.1, A.3.2 |
| Ruta | por ruta | §13 |
| Duración | duración de | §9.5.4.2 |
| Sobretiempo | excede | §9.5.4.2 |
| Subtiempo | es menor que | §9.5.4.3 |
| Secuencia | en esa secuencia | §14.2.2.1 |
| Paralelo | en paralelo | §14.2.2.2 |

- **R-OPL-KW-1** (ISO A.3.1): las palabras clave fijas DEBEN escribirse exactamente como en estas tablas, salvo la alternancia y/e y o/u.
- **R-OPL-KW-2** [localización]: la alternancia y/e y o/u se decide por el sonido inicial de la palabra siguiente (`agua y hielo`, `aguja e hilo`, `siete u ocho`).

### 4.4 Plantillas — descripción de cosas (ISO A.4.4)

| ID | Plantilla OPL-ES | ISO |
|---|---|---|
| D1 | spec-OPL §2.7 | A.4.4.2 |
| D2 | spec-OPL §2.7 | A.4.4.2 |
| D3 | spec-OPL §2.8 | A.4.4.2 |
| D4 | spec-OPL §2.8 | A.4.4.2, §7.3.4 |
| D5 | spec-OPL §2.3 | A.4.4.4, §9.2.3 |
| D6 | spec-OPL §2.3 | §14.2.1.1, A.4.4.4 |
| D7 | spec-OPL §2.4 | A.4.4.4 |
| D8 | spec-OPL §2.4 | A.4.4.4 |
| D9 | spec-OPL §2.4 | A.4.4.4 |
| D10 | spec-OPL §2.4 | §14.2.2.4.3 (Figura 53) |
| D11 | spec-OPL §2.9 | A.4.4.2 |
| D12 | spec-OPL §2.9 | A.4.4.2 |
| D14 | spec-OPL §2.3 | A.4.4.4 |
| D15 | spec-OPL §2.4 | A.4.4.4 |
| D16 | spec-OPL §2.4 | A.4.4.4 |
| D17 | spec-OPL §2.4 | A.4.4.4 |
| D18 | spec-OPL §2.10 | A.4.4.3 |
| D19 | spec-OPL §2.0 | A.4.4.2 |

- D6 realiza la producción normativa «, and other states» de ISO A.4.4.4 como «, y otros estados» [localización], frase fija. ISO §14.2.1.1 escribe «or other states» [informativo]: la PAS no es uniforme y el canon sigue la EBNF normativa.
- D11 y D12 son la oración literal de ISO A.4.4.2 («Persistent» por defecto, «Transient»). La norma no da a la perseverancia otra semántica que la de ISO §3.50 (estática = objeto, dinámica = proceso): D11 sólo es verdadera de un objeto y D12 sólo de un proceso (R-COSA-2).
- D19 PUEDE omitir cualquiera de las tres propiedades; cada una vale lo mismo que su oración simple (D1–D4, D11–D12).

### 4.5 Plantillas — enlaces transformadores (ISO §9.1, §9.3)

| ID | Tipo | Plantilla | ISO |
|---|---|---|---|
| T1 | Consumo | spec-OPL §3.1 | §9.1.2 |
| T2 | Resultado | spec-OPL §3.2 | §9.1.3 |
| T3 | Efecto | spec-OPL §3.3 | §9.1.4 |
| TS1 | Consumo con estado | spec-OPL §3.1 | §9.3.1 |
| TS2 | Resultado con estado | spec-OPL §3.2 | §9.3.2 |
| TS3 | Efecto con entrada y salida especificadas | spec-OPL §3.4 | §9.3.3.2 |
| TS4 | Efecto con sólo la entrada especificada | spec-OPL §3.5 | §9.3.3.3 |
| TS5 | Efecto con sólo la salida especificada | spec-OPL §3.6 | §9.3.3.4 |

TS4 es el efecto con estado de entrada especificado y TS5 el efecto con estado de salida especificado (ISO §9.3.3.3, §9.3.3.4); en TS4 el estado de salida es el estado por defecto o, si no lo hay, lo decide la distribución de probabilidad de estados (ISO §9.3.3.3). Ambos admiten evento y condición (ETS3, ETS4, CS3, CS4).

Al descomponer un proceso con un TS3, sus dos partes escindidas, la **mitad de entrada** (el subproceso temprano saca al objeto del estado de entrada) y la **mitad de salida** (uno tardío lo pone en el de salida), se escriben con la misma superficie que TS4 y TS5 (ISO Tabla 25). Sólo tienen sentido juntas y la mitad de entrada no tiene versión con modificador de control (ISO Tabla 25 NOTA 1; R-ESC-1). Se reconocen por el contexto descompuesto (R-ESCIND-0).

### 4.6 Plantillas — enlaces habilitadores (ISO §9.2, §9.4)

| ID | Tipo | Plantilla | ISO |
|---|---|---|---|
| H1 | Agente | spec-OPL §4.1 | §9.2.2 |
| H2 | Instrumento | spec-OPL §4.2 | §9.2.3 |
| HS1 | Agente con estado | spec-OPL §4.1 | §9.4.1 |
| HS2 | Instrumento con estado | spec-OPL §4.2 | §9.4.2 |

### 4.7 Plantillas — enlaces de evento (ISO §9.5.2)

| ID | OPL-ES | ISO |
|---|---|---|
| ET1 | spec-OPL §5.1 | §9.5.2.1 |
| ET2 | spec-OPL §5.1 | §9.5.2.1 |
| EH1 | spec-OPL §5.1 | §9.5.2.2 |
| EH2 | spec-OPL §5.1 | §9.5.2.2 |
| ETS1 | spec-OPL §5.1 | §9.5.2.3 |
| ETS2 | spec-OPL §5.1 | §9.5.2.3 |
| ETS3 | spec-OPL §5.1 | §9.5.2.3 |
| ETS4 | spec-OPL §5.1 | §9.5.2.3 |
| EHS1 | spec-OPL §5.1 | §9.5.2.4 |
| EHS2 | spec-OPL §5.1 | §9.5.2.4 |

### 4.8 Plantillas — enlaces de condición (ISO §9.5.3)

| ID | OPL-ES | Sintaxis alternativa | ISO |
|---|---|---|---|
| CT1 | spec-OPL §5.2 | Si **Objeto** existe entonces *Proceso* ocurre y consume **Objeto**, de lo contrario se omite *Proceso*. | §9.5.3.1 |
| CT2 | spec-OPL §5.2 | Si **Objeto** existe entonces *Proceso* ocurre y afecta **Objeto**, de lo contrario se omite *Proceso*. | §9.5.3.1 |
| CH1 | spec-OPL §5.2 | Si **Agente** existe entonces **Agente** maneja *Proceso*, de lo contrario se omite *Proceso*. | §9.5.3.2 |
| CH2 | spec-OPL §5.2 | Si **Instrumento** existe entonces *Proceso* ocurre, de lo contrario se omite *Proceso*. | §9.5.3.2 |
| CS1 | spec-OPL §5.2 | Si **Objeto** en `estado` existe entonces *Proceso* ocurre y consume **Objeto**, de lo contrario se omite *Proceso*. | §9.5.3.3 |
| CS2 | spec-OPL §5.2 | Si **Objeto** está en `estado-entrada` entonces *Proceso* cambia **Objeto** de `estado-entrada` a `estado-salida`, de lo contrario se omite *Proceso*. | §9.5.3.3 |
| CS3 | spec-OPL §5.2 | Si **Objeto** está en `estado-entrada` entonces *Proceso* cambia **Objeto** de `estado-entrada`, de lo contrario se omite *Proceso*. | §9.5.3.3 |
| CS4 | spec-OPL §5.2 | Si **Objeto** existe entonces *Proceso* cambia **Objeto** a `estado-salida`, de lo contrario se omite *Proceso*. | §9.5.3.3 |
| CS5 | spec-OPL §5.2 | Si **Agente** en `estado` existe entonces **Agente** maneja *Proceso*, de lo contrario se omite *Proceso*. | §9.5.3.4.1 |
| CS6 | spec-OPL §5.2 | Si **Instrumento** está en `estado` entonces *Proceso* ocurre, de lo contrario se omite *Proceso*. | §9.5.3.4.2 |

- **R-OPL-COND-ALT-1** (ISO §9.5.3.1, §9.5.3.2, §9.5.3.3, §9.5.3.4): cada oración de condición tiene la sintaxis alternativa de la tercera columna, que la norma fija con la misma fuerza («shall»); ambas expresan el mismo hecho.

Nota: ISO A.4.5.4.3 escribe la condición de agente como «Process occurs if Agent exists»; CH1 sigue la cláusula 9.5.3.2 (discrepancia interna de la norma).

### 4.9 Plantillas — excepción e invocación (ISO §9.5.4, §9.5.2.5)

| ID | OPL-ES | ISO |
|---|---|---|
| EX1 | spec-OPL §5.3 | §9.5.4.2, A.4.5.4.5 |
| EX2 | spec-OPL §5.3 | §9.5.4.3 |
| IV1 | spec-OPL §5.4 | §9.5.2.5.1 |
| IV2 | spec-OPL §5.4 | §9.5.2.5.2 |

### 4.10 Plantillas — enlaces estructurales (ISO §10)

| ID | OPL-ES | ISO |
|---|---|---|
| SE1 | spec-OPL §6.5 | §10.2.1 |
| SE2 | spec-OPL §6.5 | §10.2.2 |
| SE3 | spec-OPL §6.5 | §10.2.3 |
| SE4 | spec-OPL §6.5 | §10.2.4 |
| SE5 | spec-OPL §6.5 | §10.2.4 |
| RF1 | spec-OPL §6.1 | §10.3.2 |
| RF2 | spec-OPL §6.2 | §10.3.3.1 |
| RF2b | spec-OPL §6.2 | §10.3.3.1, A.4.6.3.2 |
| RF2c | spec-OPL §6.2 | §10.3.3.1 |
| RF3 | spec-OPL §6.3 | §10.3.4.1 |
| RF3b | spec-OPL §6.3 | §10.3.4.1, A.4.6.5 |
| RF3c | spec-OPL §6.3 | A.4.6.5 |
| RF4 | spec-OPL §6.4 | §10.3.5.1 |
| RF4b | spec-OPL §6.4 | §10.3.5.1 |
| RF5 | spec-OPL §6.2 | §10.4.1 |
| RX1 | spec-OPL §6.3 | A.4.6.5 |
| RX2 | spec-OPL §6.3 | A.4.6.5 |
| RH1 | spec-OPL §6.3 | A.4.6.5 |

**Colecciones incompletas** (ISO §10.3.2, §10.3.3.1, §10.3.4.1): `… y al menos otra parte`, `… y al menos otro atributo`, `… y al menos otra operación`, `… y al menos otra especialización`.

- **R-OPL-SE-1** (ISO A.4.2, §10.2.1): una etiqueta estructural es una frase que empieza en minúscula y DEBERÍA expresar la relación cuando se lee en la oración.
- **R-OPL-SE-2** (ISO §10.2.1, A.4.6.2.2, §10.3.3.1): los enlaces estructurales etiquetados unen objeto con objeto o proceso con proceso; la mezcla objeto–proceso sólo es válida como exhibición-caracterización.
- **R-OPL-SE-3** (ISO A.4.6.2.2, §11.1): un enlace estructural etiquetado PUEDE llevar multiplicidad en el origen y en el destino.
- **R-OPL-SE-4** (ISO A.4.6.2.2): una oración estructural etiquetada PUEDE tener por complemento una lista de objetos o de procesos, terminada en `y más`, `ordenados por` o `en esa secuencia` cuando la producción lo permite.
- **R-OPL-SE-5** (ISO §10.2.2, §10.2.4, A.4.6.2.2): `se relaciona con` y `se relacionan` son las etiquetas nulas por defecto; el modelador PUEDE fijar otra etiqueta por defecto.
- **R-OPL-SE-6** (ISO §10.4.2.1, §10.4.2.7, §10.4.2.8): un enlace estructural etiquetado con estado especificado y sin etiqueta usa la etiqueta nula por defecto (`se relaciona con`; en el recíproco, `se relacionan`).
- **R-OPL-RF-1** (ISO A.4.6.3, A.4.6.5, A.4.6.6): agregación, caracterización, especialización e instanciación tienen variantes de objeto y de proceso.
- **R-OPL-RF-2** (ISO §10.3.3.1): la caracterización DEBE usar el verbo `exhibe`.
- **R-OPL-RF-3** (ISO A.4.6.5): la especialización de estado se expresa como lista de objetos con estado que son un objeto con estado general (RF3c); ambos extremos llevan estado.
- **R-OPL-RF-4** (ISO §10.3.5.1): la instanciación plural se escribe `son instancias de`.
- **R-OPL-RF-5** (ISO A.4.6.5): la especialización exclusiva se escribe `puede ser o bien … o bien …` (dos generales) o `puede ser uno de …` (tres o más); su sujeto es la especialización (RX1, RX2).
- **R-OPL-RF-6** (ISO A.4.6.5): la herencia múltiple se escribe con la lista de generales precedidos por `un`/`una`.

**Estructurales con estado especificado** (ISO §10.4.2, Tabla 15):

| ID | Tipo | Plantilla | ISO |
|---|---|---|---|
| SSE1 | Unidireccional, estado en origen | spec-OPL §6.6 | §10.4.2.2 |
| SSE2 | Unidireccional, estado en destino | spec-OPL §6.6 | §10.4.2.3 |
| SSE3 | Unidireccional, estado en ambos | spec-OPL §6.6 | §10.4.2.4 |
| SSE4 | Bidireccional, estado en un extremo (oración directa) | spec-OPL §6.6 | §10.4.2.5 |
| SSE5 | Bidireccional, estado en un extremo (oración inversa) | **Destino** etiqueta-inversa **Origen** en `sa`. | §10.4.2.5 |
| SSE6 | Recíproco, estado en ambos | spec-OPL §6.6 | §10.4.2.8 |
| SSE7 | Recíproco, estado en un extremo | spec-OPL §6.6 | §10.4.2.7 |

- El bidireccional con estado en ambos extremos son dos oraciones SSE3, una por sentido (ISO §10.4.2.6).
- Las variantes bidireccional y recíproca existen también con el estado sólo en el destino (ISO §10.4.2.5, §10.4.2.7): SSE4/SSE5 y SSE7 admiten el estado en cualquiera de los dos extremos.

### 4.11 Plantillas — refinamiento (ISO §14.2, A.4.7)

| ID | OPL-ES | ISO |
|---|---|---|
| CX1 | spec-OPL §7.1 | §14.2.2.1, A.4.7.4 |
| CX2 | spec-OPL §7.1 | §14.2.2.2 |
| CX3 | spec-OPL §7.2 | §14.2.1.2, A.4.7.2 |
| CX4 | spec-OPL §7.3 | §14.2.2.6.1.4 |
| CX5 | spec-OPL §7.2 | A.4.7.3 |
| CX6 | spec-OPL §7.2 | A.4.7.3 |
| CX7 | spec-OPL §7.1 | A.4.7.5 |
| CX8 | spec-OPL §7.1 | A.4.7.5 |
| CX9 | spec-OPL §7.3 | §14.2.2.6.1.4 |
| CX10 | spec-OPL §7.2 | A.4.7.2 |
| CX11 | spec-OPL §7.1 | A.4.7.4 |
| CX12 | spec-OPL §7.1 | A.4.7.4, §14.2.2.2 |
| CX13 | spec-OPL §7.1 | A.4.7.4, §14.2.1.3 |

- **R-OPL-CX-1** (ISO A.4.7.2, §14.2.1.2): OPL-ES DEBE expresar el despliegue de objetos y de procesos por partes, rasgos, especializaciones o instancias.
- **R-OPL-CX-2** (ISO §14.2.1.2, A.4.7.2): un despliegue en un OPD nuevo PUEDE declarar OPD padre, OPD hijo y clase de despliegue (CX10); la forma mínima es CX3.
- **R-OPL-CX-3** (ISO A.4.7.4): una descomposición PUEDE ocurrir en el mismo diagrama o en un diagrama nuevo; en un diagrama nuevo, la oración declara OPD padre y OPD hijo (CX11).
- **R-OPL-CX-4** (ISO A.4.7.4, §3.34, §3.35): OPL-ES DEBE expresar la descomposición de procesos y de objetos.
- **R-OPL-CX-5** (ISO §14.2.2.2, A.4.7.4): una descomposición PUEDE ser secuencial, paralela o mixta; la forma mixta conserva qué subprocesos son paralelos dentro de la secuencia (CX12).
- **R-OPL-CX-6** (ISO A.4.7.4): una descomposición PUEDE incluir objetos o procesos internos mediante `así como`.
- **R-OPL-CX-7** (ISO A.4.7.3, A.4.7.5): plegado y recomposición DEBEN referir al OPD hijo.

### 4.12 Etiquetas de ruta (ISO §13)

`Por ruta etiqueta, *Proceso* consume **Objeto**.`
`Por ruta etiqueta, *Proceso* genera **Objeto**.`

La etiqueta de ruta es una propiedad de un enlace procedimental que empareja un par de enlaces (ISO §13); la norma no la restringe a consumo y resultado, y la EBNF del Anexo A no la cubre (ISO A.1). Su emparejamiento es R-VIS-RUTA-1.

- **R-OPL-RUTA-1**: ver spec-OPL §11.1.
- **R-OPL-RUTA-2**: ver spec-OPL §11.1.

### 4.13 Atributos y valores (ISO §10.3.3.2, §11.3)

| OPL-ES | ISO |
|---|---|
| **Atributo** de **Objeto** es `valor`. | §11.3 |
| **Atributo** de **Objeto** varía de X a Y. | A.3.2 |
| El rango de **Atributo** de **Objeto** es X a Y. | §11.3 |
| **Atributo** de **Objeto** puede estar `valor1`, `valor2` o `valor3`. (D5 con el atributo como objeto) | A.4.4.4, §10.3.4.3 |

- **R-ATR-1** (ISO §3.4, §10.3.3.1): un atributo es un objeto que caracteriza una cosa mediante exhibición-caracterización.
- **R-ATR-2** (ISO §10.3.3.2.1, §7.3.5.5): los valores de un atributo son estados del atributo.
- **R-ATR-3** (ISO §7.3.5.5, A.4.2): un atributo PUEDE especificar unidad de medida, escrita `**Atributo** en unidad`.
- **R-ATR-6** (ISO §3.60): una propiedad es una anotación de un elemento del modelo y no un atributo: su valor no cambia durante la ejecución del modelo (ISO §3.60). Multiplicidades, etiquetas estructurales y etiquetas de ruta son propiedades.
- **R-ATR-7** (ISO §11.3): un rango de valores de atributo PUEDE expresarse con la oración de rango; su expresividad es la de la multiplicidad, sin opcionalidad (ISO §11.3 NOTA 2).

### 4.14 EBNF

- **R-OPL-EBNF-1** (ISO A.1, A.3.1): la EBNF del Anexo A de ISO 19450 es normativa; la gramática OPL-ES DEBE corresponderle producción a producción (R-OPL-TEXT-1). La norma declara su EBNF incompleta (probabilidades, rutas y restricciones; ISO A.1).
- **R-OPL-EBNF-4** (ISO A.4.1): un párrafo OPL-ES es una secuencia de oraciones separadas por saltos de línea.
- **R-OPL-EBNF-5** (ISO A.4.1): toda oración OPL-ES formal DEBE terminar en punto.
- **R-OPL-EBNF-6** (ISO A.4.1): una oración formal OPL-ES es de descripción de cosa, procedimental, estructural o de gestión de contexto.
- **R-OPL-LEX-1** (ISO A.3.2) [localización]: el alfabeto de nombres OPL-ES admite, además de las letras A–Z y a–z de ISO A.3.2, las vocales con tilde, la `ü` y la `ñ`, en mayúscula y minúscula. Es una desviación declarada de la EBNF de la norma, necesaria para escribir nombres en español.
- **R-OPL-LEX-2** (ISO A.3.2, B.6.2): un carácter de cadena es una letra, un dígito decimal, `-`, `|`, `&`, `/` o el espacio.
- **R-OPL-LEX-3** (ISO A.3.2): un nombre comienza con una letra.
- **R-OPL-TIPO-1** (ISO A.3.2): un identificador de tipo es `boolean`, `string`, un tipo numérico o `enumerated`.
- **R-OPL-TIPO-2** (ISO A.3.2): el tipo `integer` PUEDE llevar el prefijo `unsigned`.
- **R-OPL-PART-1** (ISO A.3.2, §11.1, Tabla 16): la multiplicidad se escribe antepuesta al nombre del objeto: `un`/`una` (exactamente uno), `un **Objeto** opcional` (0..1), `al menos un`/`una` (1..*), `**Objetos** opcionales` (0..*), `muchos`/`muchas`, un entero, un parámetro o un rango `n a m` (varios rangos unidos por `o`); el nombre va en plural si puede haber más de una instancia (ISO §11.1). `al menos dos` es la realización española del rango 2..* [localización]. Los rangos son siempre cerrados y sólo los objetos llevan multiplicidad (R-MULT-1A).
- **R-OPL-RANGO-1** (ISO A.3.2, §11.1, §11.3): un valor se escribe `es valor`; un rango de valores, `varía de X a Y`; una multiplicidad, `n a m` o `qmin..qmax`, siempre cerrados.
- **R-OPL-RANGO-2** (ISO A.3.2): una restricción de expresión comienza con `donde`.
- **R-OPL-RANGO-3** (ISO A.3.2): los operadores de restricción en OPL son `=`, `<`, `>`, `<=`, `>=`.
- **R-OPL-CONJ-1** (ISO A.3.2): la pertenencia a un conjunto se escribe `en { … }`.
- **R-OPL-LISTA-1** (ISO A.4.3): en una lista, los elementos intermedios se separan con coma y el último con `y` u `o` según la producción, sin coma ante la conjunción salvo en las producciones ISO que la llevan (listas de descomposición de objetos, ISO A.4.7.4).
- **R-OPL-LISTA-2** (ISO A.4.6.2.2): una lista PUEDE terminar en `y más`, `ordenados por criterio` o `en esa secuencia` sólo cuando la producción lo permite.

### 4.15 Equivalencia EN↔ES

- **R-OPL-EQ-1** (ISO A.3.3, B.6.3): un nombre de proceso OPL-ES PUEDE ser una frase de infinitivo (equivalente al gerundio inglés) o una frase nominal singular deverbal (R-NOM-PROC-1).
- **R-OPL-EQ-3** (ISO §6.2.1) [localización]: la traducción EN→ES→EN DEBE preservar el hecho del modelo, no la superficie literal.

### 4.16 Transformación EN→ES

- **R-OPL-TRANS-2** = R-OPL-4.
- **R-OPL-TRANS-3** (ISO A.4.4.4, §9.5.3.3): `Object is state` se traduce `**Objeto** está en `estado``.
- **R-OPL-TRANS-4** (ISO A.4.4.4, A.4.6.5): `can be` seguido de estados se traduce `puede estar`; `can be either … or` y `can be one of` seguidos de cosas se traducen `puede ser o bien … o bien` y `puede ser uno de`.
- **R-OPL-TRANS-5** (ISO §9.3.3.2, A.4.7.2): `from` se traduce `de` en los cambios de estado y `desde` ante un OPD padre; `to`, `a`; `of`, `de`.
- **R-OPL-TRANS-6** (ISO §12.2): `exactly one of` y `at least one of` se traducen `exactamente uno de` y `al menos uno de`.
- **R-OPL-TRANS-7** (ISO §9.5.3.1, §9.5.3.2): `if`, `in which case`, `otherwise`/`else`, `then` y `bypass` se traducen `si`, `en cuyo caso`, `de lo contrario`, `entonces` y `se omite`.
- **R-OPL-TRANS-8** (ISO §9.5.3.1): las pasivas `is consumed` e `is skipped` se traducen `se consume` y `se omite`.
- **R-OPL-TRANS-9** (ISO §13): `Following path` se traduce `Por ruta`.
- **R-OPL-TRANS-10** (ISO A.4.4.4): las designaciones `initial`, `final` y `default` se traducen `inicial`, `final` y `por defecto`.

---

## 5. Enlaces: clases y validez

### 5.1 Clases de enlace (ISO §6.2.4, §8.1.1, §9.5.1, §10.1)

Todo enlace es procedimental o estructural (ISO §6.2.4). Los procedimentales son transformadores, habilitadores o de control (ISO §8.1.1); los de control son de evento (incluida la invocación, que es un evento entre procesos, ISO §9.5.2.5), de condición y de excepción (ISO §9.5.1). Los estructurales son fundamentales o etiquetados (ISO §10.1).

| Clase | Subclase | Firma | Realización |
|---|---|---|---|
| Procedimental transformador | consumo, resultado, efecto | objeto (o estado) ↔ proceso | T1–T3, TS1–TS5 (ISO §9.1.1) |
| Procedimental habilitador | agente, instrumento | objeto (o estado) → proceso | H1, H2, HS1, HS2 (ISO §9.2.1) |
| Procedimental de control: evento | evento sobre un enlace entrante | objeto (o estado) → proceso | ET1–EHS2 (ISO §9.5.2.1–§9.5.2.4) |
| Procedimental de control: evento | invocación, autoinvocación | proceso → proceso | IV1, IV2 (ISO §9.5.2.5) |
| Procedimental de control: condición | condición sobre un enlace entrante | objeto (o estado) → proceso | CT1–CS6 (ISO §9.5.3) |
| Procedimental de control: excepción | sobretiempo, subtiempo | proceso → proceso | EX1, EX2 (ISO §9.5.4) |
| Estructural fundamental | agregación, exhibición, generalización, clasificación | cosa ↔ cosa, con la restricción de R-STRF-1 | RF1–RF5, RX1, RX2, RH1 (ISO §10.3) |
| Estructural etiquetado | unidireccional, bidireccional, recíproco | objeto ↔ objeto o proceso ↔ proceso; con estado especificado, sólo entre objetos y estados | SE1–SE5, SSE1–SSE7 (ISO §10.2, §10.4.2) |

Esta clasificación no cambia la validez de ningún enlace: cada uno conserva sus reglas (reglas §5.2 a reglas §5.8).

### 5.2 Enlaces transformadores (ISO §9.1, §9.3)

| Enlace | Firma | Símbolo | OPL |
|---|---|---|---|
| Consumo | objeto (o estado) → proceso | flecha de punta cerrada hacia el proceso | T1 / TS1 |
| Resultado | proceso → objeto (o estado) | flecha de punta cerrada hacia el objeto | T2 / TS2 |
| Efecto básico | objeto ↔ proceso | flecha de dos puntas cerradas | T3 |
| Efecto con estados especificados | estado → proceso y proceso → estado | par de flechas de una punta (entrada y salida) | TS3 / TS4 / TS5 |

- **R-CONS-1** (ISO §9.1.2, §9.3.1): el consumido es un objeto, con o sin estados.
- **R-CONS-2** (ISO §9.3.1): el consumo es inmediato al activarse el proceso, salvo que el modelador modele un consumo a lo largo del tiempo.
- **R-CONS-3** (ISO §9.3.1): si el consumo ocurre a lo largo del tiempo, el enlace de consumo DEBE tener una propiedad de tasa de consumo y el consumido DEBE tener un atributo de cantidad disponible.
- **R-RES-1** (ISO §9.3.2, §12.7): un enlace de resultado hacia un objeto con estado inicial DEBERÍA unirse al rectángulo del objeto o a un estado distinto del inicial.
- **R-RES-2** (ISO §9.3.2): la generación del resultante es inmediata al completarse el proceso, salvo que se modele a lo largo del tiempo; en ese caso, el enlace de resultado DEBE tener una propiedad de tasa de generación y el resultante DEBE tener un atributo de cantidad disponible en el estado especificado.
- **R-EFE-1** (ISO §9.1.4, §3.2, §3.15): el efecto DEBE unirse a un objeto con al menos un estado.
- **R-EFE-2** (ISO §9.3.3.2) [informativo]: iniciado el proceso, el afectado sale de su estado de entrada (ISO §9.3.3.2 NOTA 1).
- **R-EFE-2A** (ISO §9.3.3.2): el afectado alcanza el estado de salida sólo al completarse el proceso; entretanto está en tránsito entre estados.
- **R-EFE-2B** (ISO §9.3.3.2) [informativo]: si el proceso se interrumpe antes de completarse, el estado del afectado queda indeterminado (ISO §9.3.3.2 NOTA 2).
- **R-EFE-3** (ISO §9.3.3.3, §9.5.3.3.3): en un efecto con estado de entrada especificado (TS4, reglas §4.5), el estado de salida es el estado por defecto o, si no lo hay, el que decide la distribución de probabilidad de estados del objeto.

### 5.3 Enlaces habilitadores (ISO §9.2, §9.4)

| Enlace | Firma | Símbolo | Origen | OPL |
|---|---|---|---|---|
| Agente | agente → proceso | círculo negro relleno en el extremo del proceso | sólo un humano o un grupo de humanos (ISO §3.3) | H1 / HS1 |
| Instrumento | instrumento → proceso | círculo blanco en el extremo del proceso | un habilitador no humano (ISO §3.30) | H2 / HS2 |

- **R-AG-1** (ISO §3.3, §9.2.2): el enlace de agente y el término «agente» se reservan a humanos y grupos de humanos.
- **R-AG-1A** (ISO §3.30, §9.2.3): un habilitador no humano (robot, máquina, software autónomo) se une al proceso con enlace de instrumento.
- **R-AG-2** (ISO §9.2.3, §9.4.1, §9.4.2, §9.3.3.2) [informativo]: si un habilitador deja de existir durante la ejecución, el proceso se detiene y el afectado queda en estado indeterminado (ISO §9.2.3 EJEMPLO 3; §9.3.3.2 NOTA 2).

### 5.4 Enlaces de invocación (ISO §9.5.2.5)

| Enlace | Firma | Símbolo | OPL |
|---|---|---|---|
| Invocación | proceso → proceso | línea en zigzag con punta | IV1 |
| Autoinvocación | proceso → el mismo proceso | par de enlaces de invocación que salen del proceso, se unen cabeza con cola y vuelven a él | IV2 |

- **R-INV-1** (ISO §9.5.2.5.1): la invocación DEBE tener firma proceso → proceso.
- **R-INV-1A** (ISO §9.5.1, §9.5.2.5.1): la invocación es un enlace de control de la clase evento: al completarse el proceso invocador, inicia el invocado. Es distinta de los transformadores y los habilitadores.
- **R-INV-2** (ISO §14.2.2.1): dentro de un proceso descompuesto, la disposición de arriba abajo de los puntos superiores de los subprocesos denota invocación implícita: al completarse un subproceso se invoca al inmediatamente inferior.
- **R-INV-2A** (ISO §14.2.2.1, §14.2.2.2): los subprocesos cuyos puntos superiores están a la misma altura (dentro de la tolerancia admisible) DEBEN iniciar en paralelo, cada uno al satisfacer su precondición.
- **R-INV-2C** (ISO §14.2.2.1, §14.2.2.2): de un grupo de subprocesos paralelos, el que termina último (sincronización) DEBE iniciar el subproceso o el grupo siguiente.
- **R-INV-3** (ISO §14.2.2.1): como la invocación es un evento, cada subproceso invocado implícitamente sólo se ejecuta si satisface su precondición. Al llegar al proceso descompuesto, el control pasa de inmediato al subproceso (o grupo) más alto; tras completarse el último subproceso habilitado, el control vuelve al proceso descompuesto.

- **R-INV-2B** (ISO §14.2.2.1): la invocación implícita no tiene símbolo: no requiere enlace dibujado. Un enlace de invocación explícito entre subprocesos sucesivos expresa el mismo hecho (ISO Figura 48) y no es inválido.

### 5.5 Enlaces estructurales fundamentales (ISO §10.3)

| Relación | Triángulo | Vértice → base | Perseverancia de los extremos |
|---|---|---|---|
| Agregación-participación | negro relleno | todo → partes | la misma (ISO §10.3.1) |
| Exhibición-caracterización | vacío con triángulo negro interior | exhibidor → rasgos | admite mezcla: un objeto exhibe operaciones y un proceso exhibe atributos (ISO §10.3.3.1, §10.1) |
| Generalización-especialización | vacío | general → especializaciones | la misma (ISO §10.3.1) |
| Clasificación-instanciación | vacío con círculo negro interior | clase → instancias | la misma (ISO §10.3.1) |

- **R-STRF-1** (ISO §10.3.1): salvo en la exhibición-caracterización, el refinable y sus refinados DEBEN tener la misma perseverancia.
- **R-STRF-2** (ISO §10.1): la exhibición-caracterización es la única relación estructural fundamental que PUEDE unir un objeto con un proceso.
- **R-STRF-2A** (ISO §10.3.3.1): un exhibidor objeto o proceso PUEDE tener atributos (rasgos objeto) y operaciones (rasgos proceso); las combinaciones mixtas son objeto que exhibe operación y proceso que exhibe atributo.
- **R-STRF-3** (ISO §10.3.5.1) [informativo]: la clasificación-instanciación no distingue colección completa e incompleta (ISO §10.3.5.1 NOTA 3).
- **R-STRF-5** (ISO §10.3.2, §10.3.3.1, §10.3.4.1): en la agregación, la exhibición y la generalización, una colección incompleta de refinados DEBE señalarse con la barra horizontal bajo el triángulo y con la frase `y al menos otro/otra …` en OPL.
- **R-HER-1** (ISO §10.3.4.2): una especialización DEBE heredar del general todas sus partes, rasgos, enlaces estructurales etiquetados y enlaces procedimentales; también hereda los valores posibles de los atributos (ISO §10.3.4.3 NOTA).
- **R-HER-2** (ISO §10.3.4.2): una cosa PUEDE heredar de más de un general.
- **R-HER-3** (ISO §10.3.4.3): un atributo discriminante restringe los valores válidos de las especializaciones.
- **R-HER-4** (ISO §10.3.4.3): con varios atributos discriminantes, el número máximo de especializaciones es el producto cartesiano de sus valores; algunas combinaciones pueden no ser válidas.
- **R-HER-5** (ISO §10.3.4.2): una especialización PUEDE reemplazar un participante heredado sólo especificando una especialización de ese participante, con nombre y conjunto de estados propios.
- **R-HER-6** (ISO §10.3.4.2) [informativo]: en ejecución, la instancia de una especialización no existe sin la instancia general correspondiente (ISO §10.3.4.2 NOTA).
- **R-HER-7** (ISO §10.3.4.2): para crear un general a partir de especializaciones existentes, el modelador DEBE identificar los rasgos y participantes comunes, crear el general, unir a él las especializaciones, eliminar los duplicados heredados y trasladar al general los enlaces comunes.

### 5.6 Enlaces estructurales etiquetados (ISO §10.2, §10.4)

| Variante | Símbolo | Etiqueta |
|---|---|---|
| Unidireccional con etiqueta | flecha de punta abierta hacia el destino | junto al trazo (ISO §10.2.1) |
| Unidireccional sin etiqueta | igual | por defecto «se relaciona con» (ISO §10.2.2) |
| Bidireccional | línea con arpones en ambos extremos | dos etiquetas, una por sentido (ISO §10.2.3) |
| Recíproco | línea con arpones | una sola etiqueta o ninguna; sin etiqueta, por defecto «se relacionan» (ISO §10.2.4) |

- **R-STRE-1** (ISO §10.2.4): un bidireccional cuyas dos etiquetas son idénticas equivale a un recíproco con esa etiqueta.
- **R-STRE-2** (ISO §10.4.1, §10.4.2.1, Tabla 15): un enlace estructural PUEDE unir estados: son válidos la caracterización con estado especificado (un objeto especializado exhibe un valor de un atributo discriminante de su general, RF5) y los siete enlaces etiquetados con estado especificado de la Tabla 15 (unidireccional, bidireccional y recíproco con el estado en el origen, en el destino o en ambos; SSE1–SSE7). La especialización de estado (RF3c) también une estados.

### 5.7 Enlaces de excepción (ISO §9.5.4)

| Enlace | Símbolo | Se dispara si | OPL |
|---|---|---|---|
| Sobretiempo | una barra corta oblicua junto al proceso destino | la duración real excede la duración máxima | EX1 |
| Subtiempo | dos barras cortas oblicuas paralelas junto al proceso destino | la duración real es menor que la mínima | EX2 |

- **R-EXC-1** (ISO §9.5.4.2, §9.5.4.3): un enlace de excepción DEBE unir el proceso fuente con el proceso de manejo; al producirse la excepción, un evento inicia el proceso de manejo.
- **R-EXC-1B** (ISO §9.5.1, §3.13): la excepción es un enlace de control proceso → proceso; `e` y `c` sólo anotan enlaces entrantes objeto → proceso, nunca una excepción.
- **R-EXC-2** (ISO §9.5.4.2): un enlace de sobretiempo DEBE tener declarada la duración máxima del proceso fuente.
- **R-EXC-3** (ISO §9.5.4.3): un enlace de subtiempo DEBE tener declarada la duración mínima del proceso fuente.
- **R-EXC-4** (ISO §9.5.4.1): la duración de un proceso PUEDE especializarse en mínima, esperada y máxima, y PUEDE tener la propiedad distribución de duración; la mínima y la máxima DEBERÍAN ser las cotas admisibles y la esperada DEBERÍA ser la media estadística.
- **R-EXC-4A** (ISO §9.5.4.1): si se declara distribución de duración, ésta determina la duración efectiva de cada instancia del proceso.
- **R-EXC-5** (ISO D.7, §9.5.4.2) [informativo]: la unidad temporal del sistema es la unidad por defecto; un proceso con otra unidad DEBERÍA declararla.

### 5.8 Unicidad del enlace procedimental (ISO §8.1.2, §14.2.4.1)

- **R-ROL-UNIC-1** (ISO §8.1.2, §14.2.4.1): un objeto o un estado DEBE tener exactamente un rol respecto de un proceso al que se enlaza, y se une a él por un solo enlace procedimental. Las dos flechas de un efecto con estados especificados son un único efecto (ISO §9.3.3.2). Cuando la abstracción reúne en un OPD enlaces de clases distintas entre el mismo objeto y el mismo proceso, el modelador DEBE resolver el conflicto por fuerza semántica (reglas §6.5).

---

## 6. Modificadores de control y combinaciones

### 6.1 Naturaleza de los modificadores (ISO §3.13, §9.5.1, §8.1.1)

Los modificadores de control `e` (evento) y `c` (condición) anotan un enlace transformador o habilitador entrante (de un objeto o estado a un proceso) y lo convierten en el enlace de control correspondiente, de evento o de condición. El enlace conserva su semántica base y gana la de control.

| Modificador | Efecto sobre la precondición | Si la precondición falla |
|---|---|---|
| `e` (evento) | El objeto o estado inicia la evaluación de la precondición; el evento se pierde tras la evaluación, tenga éxito o no (ISO §9.5.1) | El proceso no se ejecuta hasta que otro evento lo active (ISO §9.5.1) |
| `c` (condición) | Introduce un mecanismo de omisión: el objeto o estado es necesario para ejecutar | El proceso se omite y el control pasa al siguiente (ISO §9.5.1) |
| (ninguno) | Enlace transformador o habilitador sin control | El proceso espera a que se satisfaga la precondición (ISO §9.3.1; §9.5.1 NOTA 2) |

- **R-ECA-1** (ISO §8.2.1): un proceso comienza sólo cuando ocurre el evento que lo inicia, si lo hay, y se satisface su precondición.
- **R-ECA-2** (ISO §8.2.2, §3.54): el conjunto de objetos previo al proceso incluye los consumidos, los afectados y los habilitadores necesarios para iniciarlo.
- **R-ECA-3** (ISO §8.2.2, §3.52): el conjunto de objetos posterior al proceso incluye los resultantes y los afectados tras completarlo.
- **R-ECA-4** (ISO C.4, §9.5.2.1.1) [informativo]: un modificador `e` o `c` anota un enlace existente: no agrega cosa ni enlace al constructo.

### 6.2 Lado de aplicación: sólo enlaces entrantes (ISO §9.5.1)

- **R-MOD-0A** = R-ECA-2.
- **R-MOD-0B** = R-ECA-3.

La restricción misma es R-MOD-4.

### 6.3 Asimetría consumo / resultado bajo `e` y `c`

| Enlace base | Con `e` | Con `c` | Razón |
|---|---|---|---|
| Consumo | sí (ET1, ETS1) | sí (CT1, CS1) | el consumido está en el conjunto previo |
| Resultado | no | no | el resultante no existe antes del proceso (ISO §9.5.1; las Tablas 5 a 13 no tienen variante de resultado) |
| Efecto (incluidos TS4 y TS5) | sí (ET2, ETS2–ETS4) | sí (CT2, CS2–CS4) | el afectado está en el conjunto previo |
| Agente | sí (EH1, EHS1) | sí (CH1, CS5) | el agente está en el conjunto previo |
| Instrumento | sí (EH2, EHS2) | sí (CH2, CS6) | el instrumento está en el conjunto previo |

- **R-MOD-1** (ISO §9.5.1, §9.5.2, §9.5.3, §12.5): no existen enlaces de evento ni de condición sobre un resultado. ISO §12.5 nombra literalmente abanicos de resultado con modificador de control; es una incoherencia interna de la norma y prevalece ISO §9.5.1.
- **R-MOD-2** (ISO §9.5.1, §8.2.2): el consumo admite `e` y `c` porque el consumido pertenece al conjunto previo.
- **R-MOD-3** (ISO §9.5.1, §8.2.2): el resultado no admite `e` ni `c` porque el resultante pertenece sólo al conjunto posterior.
- **R-MOD-4** (ISO §9.5.1, §9.5.2.1.3): `e` y `c` sólo anotan enlaces entrantes al proceso, de un objeto o estado al proceso.
- **R-MOD-5** = R-FUERZA-1.

### 6.4 Otras combinaciones de modificadores

| Combinación | Estatus | Fundamento |
|---|---|---|
| `c` con estado especificado | válida (CS1–CS6) | ISO §9.5.3.3, §9.5.3.4 |
| `e` con estado especificado | válida (ETS1–ETS4, EHS1–EHS2) | ISO §9.5.2.3, §9.5.2.4 |
| Modificador sobre enlace estructural | inválida | los modificadores sólo anotan enlaces procedimentales entrantes (ISO §9.5.1, §3.13) |
| Modificador sobre invocación | inválida | `e` y `c` sólo se definen sobre enlaces entrantes objeto → proceso y la invocación ya es un enlace de evento (ISO §9.5.1, §9.5.2.5.1) |
| Modificador sobre excepción | inválida | R-EXC-1B |
| Modificador sobre la mitad de entrada de un efecto escindido | no definida | ISO Tabla 25 NOTA 1 [informativo]; R-ESC-1 |
| Modificador sobre TS4 o TS5 | válida (ETS3, ETS4, CS3, CS4) | ISO §9.5.2.3, §9.5.3.3 |
| `c` y `e` sobre el mismo enlace | no definida por la norma | ISO §9.5.1 no la define |

### 6.5 Fuerza semántica y precedencia al abstraer (ISO §14.2.4)

Al abstraer (recomponer o plegar), los enlaces procedimentales entre refinados y cosas que no son refinados migran al OPD del refinable; si un objeto queda unido al mismo proceso por dos enlaces de clases distintas, el de mayor fuerza semántica prevalece (ISO §14.2.4.1). Orden principal (ISO §14.2.4.3):

```
consumo = resultado > efecto > agente > instrumento
```

Los enlaces con estado especificado preceden a los básicos (R-FUERZA-5). Orden secundario por modificador de control, dentro de cada clase (ISO §14.2.4.4):

```
evento > sin control > condición
```

Orden completo (ISO §14.2.4.5):

| Nivel | Enlace |
|---|---|
| 1 | Evento de consumo |
| 2 | Consumo = Resultado |
| 3 | Condición de consumo |
| 4 | Evento de efecto |
| 5 | Efecto |
| 6 | Condición de efecto |
| 7 | Evento de agente |
| 8 | Agente |
| 9 | Condición de agente |
| 10 | Evento de instrumento |
| 11 | Instrumento |
| 12 | Condición de instrumento |

- **R-FUERZA-1** (ISO §14.2.4.5, §9.5.1): los niveles 1 y 3 sólo contienen consumo; el resultado no aparece con modificador.
- **R-FUERZA-2** (ISO §14.2.4.5): la condición de instrumento es el enlace procedimental más débil.
- **R-FUERZA-3** (ISO §14.2.4.4): el modificador de condición debilita la fuerza semántica respecto del enlace base.
- **R-FUERZA-4** (ISO §14.2.4.4): el modificador de evento la fortalece respecto del enlace base.
- **R-FUERZA-5** (ISO §14.2.4.3): un enlace con estado especificado DEBE tener precedencia sobre el enlace básico de la misma clase que no especifica estados.

### 6.6 Precedencia entre transformadores al recomponer (ISO §14.2.4.2, Tabla 27)

Al recomponer subprocesos en su padre, si dos subprocesos tienen enlaces distintos hacia el mismo objeto:

| B↔P1 \ B↔P2 | Efecto | Resultado | Consumo |
|---|---|---|---|
| **Efecto** | Efecto | Resultado | Consumo |
| **Resultado** | Resultado | **Inválido** | Efecto |
| **Consumo** | Consumo | Efecto | **Inválido** |

No verificable: esta matriz depende de las figuras de la Tabla 27, ausentes en la fuente disponible; la Tabla 27 distingue P1 (arriba) de P2 y muestra cuatro celdas inválidas. Se conserva la matriz vigente hasta revisarla con ISO 19450:2024. Lo verificable en el texto de ISO §14.2.4.2 es que el resultado o el consumo prevalecen sobre el efecto y que, cuando compiten resultado y consumo, prevalece el efecto.

- **R-PREC-1** (ISO §14.2.4.2, Tabla 27): resultado más resultado y consumo más consumo sobre el mismo objeto son inválidos al recomponer. No verificable (ver la nota anterior).
- **R-PREC-2** (ISO §14.2.4.2): cuando resultado y consumo compiten sobre el mismo objeto, prevalece el efecto.
- **R-PREC-5** (ISO §14.2.4.3, Tabla 25): al recomponer, un enlace transformador DEBE prevalecer sobre uno habilitador, y el agente sobre el instrumento; la excepción es el objeto cuyo cambio neto en el proceso abstracto es nulo (estado inicial igual al final): en el OPD abstracto PUEDE figurar como instrumento (R-ROL-1; ISO Tabla 25 NOTA 2 [informativo]).

### 6.7 Multiplicidad (ISO §11)

| Símbolo | Rango | OPL-ES |
|---|---|---|
| `?` | 0..1 | un/una … opcional |
| `*` | 0..* | … opcionales (nombre en plural) |
| (sin símbolo) | 1..1 | (por defecto) |
| `+` | 1..* | al menos un/una |

- **R-MULT-1** (ISO §11.1): la multiplicidad se especifica en los extremos de enlaces procedimentales, de enlaces estructurales etiquetados y de la agregación-participación (cada parte puede tener la suya); la agregación es la única relación fundamental con multiplicidad (ISO §11.2 NOTA 1).
- **R-MULT-1A** (ISO §11.1, §11.2): la multiplicidad es de objetos; no se aplica a procesos.
- **R-MULT-1B** (ISO §11.2) [informativo]: la repetición secuencial de un proceso se expresa con un proceso recurrente y un contador (ISO §11.2 NOTA 2).
- **R-MULT-1C** (ISO §11.2) [informativo]: los subprocesos paralelos, síncronos o asíncronos, de un proceso descompuesto son otro mecanismo de iteración (ISO §11.2 NOTA 2).
- **R-MULT-2** (ISO §11.2): los nombres de parámetros de multiplicidad DEBEN ser únicos en todo el modelo.
- **R-MULT-4** (ISO §11.1): sin especificación de multiplicidad, cada extremo de un enlace denota una sola instancia operacional. La multiplicidad PUEDE ser un entero, un parámetro, una expresión aritmética, un rango `qmín..qmáx` o varios rangos separados por coma; todo rango DEBE ser cerrado (incluye sus límites); en OPL `..` se lee `a` y la coma se lee `o`. El `*` sólo aparece en 0..* y 1..*.

Restricciones de multiplicidad (ISO §11.2): en el OPD van tras un punto y coma y usan `=`, `≠`, `<`, `≤`, `≥`, llaves para conjuntos y el operador de pertenencia `∈`; en OPL se escriben con `donde` y los operadores de R-OPL-RANGO-3 y R-OPL-CONJ-1 (la desigualdad no tiene forma en la EBNF de ISO A.3.2).

### 6.8 Probabilidad (ISO §12.7)

`Pr=p` anota cada enlace de un abanico probabilístico; `p` es un número o un parámetro. Un resultado sin estado especificado hacia un objeto de `n` estados sin estado inicial equivale a un abanico XOR de resultado hacia cada estado con probabilidad `1/n` (ISO §12.7); es semántica del modelo, no una regla aparte de simulación.

- **R-PROB-1** (ISO §12.7): un abanico probabilístico DEBE ser un abanico XOR divergente.
- **R-PROB-1A** (ISO §12.2, §12.7): en un abanico probabilístico se sigue exactamente un enlace en cada ejecución.
- **R-PROB-2** (ISO §12.7): si el objeto con estados que genera un resultado sin estado especificado tiene un estado inicial, el proceso lo crea en ese estado con probabilidad 1; si tiene `m` estados iniciales (`m < n`), lo crea en uno de ellos con probabilidad `1/m`.
- **R-PROB-3** (ISO §12.7): la oración de un abanico probabilístico es la del abanico XOR divergente sin la frase «exactamente uno de» y con «con probabilidad p» tras cada cosa anotada.

---

## 7. Abanicos lógicos (XOR / OR)

### 7.1 Símbolos y semántica (ISO §12.1, §12.2)

Un abanico es un grupo de dos o más enlaces procedimentales de la misma clase que salen de un punto común, o llegan a él, en la misma cosa (ISO §12.2). El extremo común es el extremo convergente; el otro, el divergente.

| Operador | Símbolo | Semántica |
|---|---|---|
| AND | enlaces separados, sin arco | todos los enlaces se activan; en OPL, una sola oración con «y» (R-VIS-FAN-1; ISO §12.1) |
| XOR | un arco discontinuo con su foco en el extremo convergente | exactamente una de las cosas del extremo divergente existe u ocurre (ISO §12.2) |
| OR | dos arcos discontinuos concéntricos con su foco en el extremo convergente | al menos una de las cosas del extremo divergente existe u ocurre (ISO §12.2) |

- **R-FAN-GEO-1** (ISO §12.2): el arco lógico DEBE tener su foco en el extremo común (convergente) del abanico.
- **R-FAN-GEO-2** (ISO §12.3): todo abanico es convergente o divergente según qué cosa está en el extremo común; el de efecto, que es bidireccional, se distingue en cambio por unir varios objetos o varios procesos (ISO Tabla 19).

### 7.2 Aplicabilidad por clase de enlace (ISO §12.3)

| Clase | Varias cosas → una (convergente) | Una cosa → varias (divergente) |
|---|---|---|
| Consumo | N objetos → 1 proceso | 1 objeto → N procesos |
| Resultado | N procesos → 1 objeto | 1 proceso → N objetos |
| Efecto | varios objetos ↔ 1 proceso | varios procesos ↔ 1 objeto (ISO Tabla 19) |
| Agente | N agentes → 1 proceso | 1 agente → N procesos |
| Instrumento | N instrumentos → 1 proceso | 1 instrumento → N procesos |
| Invocación | N procesos → 1 proceso | 1 proceso → N procesos |

- **R-FAN-HAB-1** (ISO §12.1, §12.2, §12.3, A.4.5.3.2, A.4.5.3.3, Figura 38): varios habilitadores hacia un mismo proceso sin arco son AND (todos necesarios). El abanico XOR u OR de agentes o de instrumentos admite ambas direcciones: varios habilitadores → un proceso (ISO §12.2 EJEMPLO, Figura 38; A.4.5.3.2–A.4.5.3.3) y un habilitador → varios procesos (ISO Tabla 20). Nota: ISO §12.3 y la Tabla 20 sólo muestran la dirección divergente; es una incoherencia interna de la norma, resuelta a favor de la EBNF normativa y de la Figura 38.

### 7.3 Plantillas OPL-ES de abanicos (ISO §12.2, §12.3, A.4.5)

| Abanico | XOR | OR | ISO |
|---|---|---|---|
| Consumo convergente | *P* consume exactamente uno de **A**, **B** o **C**. | *P* consume al menos uno de **A**, **B** o **C**. | Tabla 17 |
| Consumo divergente | Exactamente uno de *P*, *Q* o *R* consume **B**. | Al menos uno de *P*, *Q* o *R* consume **B**. | Tabla 18 |
| Resultado convergente | Exactamente uno de *P*, *Q* o *R* genera **B**. | Al menos uno de *P*, *Q* o *R* genera **B**. | Tabla 17 |
| Resultado divergente | *P* genera exactamente uno de **A**, **B** o **C**. | *P* genera al menos uno de **A**, **B** o **C**. | Tabla 18 |
| Efecto (varios objetos) | *P* afecta exactamente uno de **A**, **B** o **C**. | *P* afecta al menos uno de **A**, **B** o **C**. | Tabla 19 |
| Efecto (varios procesos) | Exactamente uno de *P*, *Q* o *R* afecta **B**. | Al menos uno de *P*, *Q* o *R* afecta **B**. | Tabla 19 |
| Agente divergente | **B** maneja exactamente uno de *P*, *Q* o *R*. | **B** maneja al menos uno de *P*, *Q* o *R*. | Tabla 20 |
| Agente convergente | Exactamente uno de **A**, **B** o **C** maneja *P*. | Al menos uno de **A**, **B** o **C** maneja *P*. | §12.2, A.4.5.3.2 |
| Instrumento divergente | Exactamente uno de *P*, *Q* o *R* requiere **B**. | Al menos uno de *P*, *Q* o *R* requiere **B**. | Tabla 20 |
| Instrumento convergente | *P* requiere exactamente uno de **A**, **B** o **C**. | *P* requiere al menos uno de **A**, **B** o **C**. | A.4.5.3.3 |
| Invocación divergente | *P* invoca exactamente uno de *Q* o *R*. | *P* invoca al menos uno de *Q* o *R*. | Tabla 21 |
| Invocación convergente | Exactamente uno de *P* o *Q* invoca *R*. | Al menos uno de *P* o *Q* invoca *R*. | Tabla 21 |

### 7.4 Abanicos con estado y con modificador de control (ISO §12.4, §12.5, §12.6)

| Abanico con control | OPL-ES (XOR; el OR cambia «exactamente» por «al menos») | ISO |
|---|---|---|
| Evento, efecto | **B** inicia exactamente uno de *P*, *Q* o *R*, en cuyo caso el proceso que ocurre afecta **B**. | Tabla 22 |
| Condición, efecto | Exactamente uno de *P*, *Q* o *R* ocurre si **B** existe, en cuyo caso el proceso que ocurre afecta **B**; de lo contrario, estos procesos se omiten. | Tabla 22 |
| Evento, consumo | **B** inicia exactamente uno de *P*, *Q* o *R*, que consume **B**. | Tabla 23 |
| Condición, consumo | Exactamente uno de *P*, *Q* o *R* ocurre si **B** existe, en cuyo caso el proceso que ocurre consume **B**; de lo contrario, estos procesos se omiten. | Tabla 23 |
| Evento, agente | **B** inicia y maneja exactamente uno de *P*, *Q* o *R*. | Tabla 23 |
| Condición, agente | **B** maneja exactamente uno de *P*, *Q* o *R* si **B** existe; de lo contrario, estos procesos se omiten. | Tabla 23 |
| Evento, instrumento | **B** inicia exactamente uno de *P*, *Q* o *R*, que requiere **B**. | Tabla 23 |
| Condición, instrumento | Exactamente uno de *P*, *Q* o *R* requiere que **B** exista; de lo contrario, estos procesos se omiten. | Tabla 23 |

Las versiones con estado sustituyen **B** por **B** en `s2` y «existe» por «está en `s2`» (ISO Tabla 23). Los abanicos de control de resultado no existen (R-MOD-1).

- **R-FAN-EST-1** (ISO §12.4, §12.6): cada enlace de un abanico PUEDE tener o no estado especificado, con independencia de los demás; la excepción es el abanico de efecto con modificador de control, que no tiene versión con estado (ISO §12.6).
- **R-FAN-PROB-1** (ISO §12.7): un abanico es probabilístico cuando cada uno de sus enlaces lleva `Pr=p` (número o parámetro) y las probabilidades suman exactamente 1; un abanico XOR u OR sin anotaciones es un abanico ordinario de alternativas y no exige probabilidades.

### 7.5 Resultado a objeto con estados como abanico XOR (ISO §12.7)

Un enlace de resultado sin estado especificado hacia un objeto con `n` estados y sin estado inicial equivale a un abanico XOR de resultados hacia cada estado, con probabilidad `1/n` cada uno: `*P* genera **Obj**` ≡ `*P* genera exactamente uno de **Obj** en `s1`, …, **Obj** en `sn``. Si el objeto tiene estado inicial, se aplica R-PROB-2.

Esta equivalencia no autoriza `c` ni `e` sobre el abanico: sus ramas siguen siendo resultados del conjunto posterior (R-MOD-1; ISO §9.5.1, §12.5).

---

## 8. Refinamiento

### 8.1 Mecanismos de refinamiento y abstracción (ISO §14.2.1)

La norma define exactamente tres pares (ISO §14.2.1):

| Par | Refinamiento | Abstracción | Alcance |
|---|---|---|---|
| Estados | expresión de estados | supresión de estados | estados de un objeto (ISO §14.2.1.1, §3.70, §3.71) |
| Estructura | despliegue | plegado | estructura, sin transferencia de control; se aplica a objetos y procesos; en procesos modela el refinamiento asíncrono (ISO §14.2.1.2, §3.22) |
| Descomposición | descomposición | recomposición | procesos: orden temporal parcial y control; objetos: orden espacial o lógico (ISO §14.2.1.3, §3.34, §3.35) |

- **R-REF-MEC-1** (ISO §14.2.1.2, §10.3.1): el despliegue y el plegado se aplican por cada relación estructural fundamental: despliegue de partes y plegado de participación, de rasgos, de especializaciones y de instancias.
- **R-REF-MEC-2** (ISO §14.2.1.2): el despliegue dentro del diagrama equivale, gráfica, sintáctica y semánticamente, a dibujar los enlaces estructurales fundamentales; el despliegue en un diagrama nuevo muestra el refinable y sus refinados en otro OPD, con contorno grueso en ambos (spec-OPD §10.1). El modelador PUEDE elegir qué refinados aparecen; el OPL del OPD expresa sólo los que aparecen (R-BR-1).

### 8.2 Descomposición síncrona y despliegue asíncrono (ISO §14.2.2.5)

- **R-REF-SYNC-1** (ISO §14.2.2.5, §14.2.2.1): el refinamiento síncrono de un proceso DEBE modelarse con descomposición; el control vuelve al proceso descompuesto al completarse su último subproceso habilitado.
- **R-REF-SYNC-2** (ISO §14.2.2.5, §3.22, §14.2.1.2): el refinamiento asíncrono de un proceso DEBE modelarse con el despliegue por agregación (en el diagrama o en uno nuevo); el despliegue revela estructura y no implica orden temporal (ISO §14.2.1.2 NOTA 5).

### 8.4 Enlaces escindidos (ISO §14.2.2.4.3, Tabla 25)

- **R-ESCIND-0** (ISO §14.2.2.4.3, Tabla 25, §9.3.3.3, §9.3.3.4, §9.5.2.3, §9.5.3.3): TS4 es el efecto con estado de entrada especificado (ISO §9.3.3.3) y TS5 el efecto con estado de salida especificado (ISO §9.3.3.4); ambos admiten evento y condición (R-EFE-3, ETS3, ETS4, CS3, CS4). Al descomponer un TS3, sus dos partes escindidas (Tabla 25) se llaman mitad de entrada y mitad de salida y se escriben con la misma superficie que TS4 y TS5 (reglas §4.5). Sólo la mitad de entrada carece de versión de control (R-ESC-1). Las dos mitades se reconocen por el contexto: unen el mismo objeto con subprocesos distintos del mismo proceso descompuesto.
- **R-ESCIND-1** (ISO §14.2.2.4.3): si un proceso que cambia un objeto de un estado de entrada a uno de salida se descompone en más de un subproceso, el OPD queda subespecificado hasta que el modelador asigne el enlace de entrada y el de salida a subprocesos de forma temporalmente factible: ambos a uno solo, o escindidos (mitad de entrada en uno temprano, mitad de salida en uno tardío).
- **R-ESCIND-2** (ISO Tabla 25): el subproceso temprano recibe la mitad de entrada y saca al objeto del estado de entrada.
- **R-ESCIND-3** (ISO Tabla 25): el subproceso tardío recibe la mitad de salida y pone al objeto en el estado de salida.
- **R-ESC-1** (ISO Tabla 25) [informativo]: no hay versiones con modificador de control de la mitad de entrada de un efecto escindido (ISO Tabla 25 NOTA 1).

### 8.5 Distribución de enlaces al descomponer (ISO §14.2.2.4)

Un enlace procedimental unido al contorno de un proceso descompuesto se distribuye a cada uno de sus subprocesos (ISO §14.2.2.4.1), con estas restricciones:

| Enlace | En el contorno del proceso descompuesto | Distribución |
|---|---|---|
| Consumo | NO DEBE quedar (ISO §14.2.2.4.1) | por defecto se ancla al primer subproceso; el modelador lo reasigna al subproceso que consume |
| Resultado | NO DEBE quedar (ISO §14.2.2.4.1) | por defecto se ancla al primer subproceso; el modelador lo reasigna al subproceso que genera |
| Efecto básico (T3) | PUEDE quedar | se distribuye a todos los subprocesos |
| Efecto con entrada y salida (TS3) | queda subespecificado | se asigna a uno o dos subprocesos de forma temporalmente factible; si son dos, mitad de entrada y mitad de salida (R-ESCIND-1) |
| Agente | PUEDE quedar | se distribuye; DEBE alcanzar al menos un subproceso (R-DIST-2) |
| Instrumento | PUEDE quedar | se distribuye; DEBE alcanzar al menos un subproceso (R-DIST-2) |
| Evento desde un objeto o estado sistémico | NO DEBE cruzar el contorno hacia un subproceso (ISO §14.2.2.4.2) | — |
| Evento desde un objeto o estado ambiental | PUEDE cruzar el contorno | el modelador DEBERÍA modelar cómo se maneja esa contingencia (ISO §14.2.2.4.2) |

- **R-DIST-1** (ISO §14.2.2.4.1): el consumo y el resultado NO DEBEN unirse al contorno de un proceso descompuesto.
- **R-DIST-1A** (ISO §14.2.2.4.1): el consumo y el resultado DEBEN unirse al subproceso que consume o genera (ISO Figura 51).
- **R-DIST-2** (ISO §14.2.2.4.1): un habilitador unido al contorno de un proceso descompuesto DEBE unirse a al menos uno de sus subprocesos.
- **R-DIST-3** (ISO §14.2.2.4.1): al descomponer un proceso, sus enlaces de consumo y de resultado DEBEN anclarse inicialmente, o por defecto, al primer subproceso; el modelador PUEDE reasignarlos (ISO §14.2.2.4.1 EJEMPLO 3). [informativo] Una herramienta puede fijar automáticamente esos valores por defecto, que el modelador modifica (ISO §14.2.2.4.1 NOTA 2).
- **R-DIST-4** (ISO §14.2.2.4): como consecuencia de la distribución, cada instancia operacional consumida deja de existir al comienzo del subproceso más detallado que la consume; cada afectada sale de su estado de entrada al comienzo, y entra en su estado de salida al completarse, el subproceso más detallado que la cambia; cada resultante comienza a existir al completarse el subproceso más detallado que la genera.

### 8.6 Contenedor y refinados (ISO §14.2.1.2, §14.2.1.3)

- **R-HIJO-1** (ISO §14.2.1.3, §14.2.1.2): en una descomposición, el refinable rodea a sus refinados; en un despliegue, aparece unido a ellos por enlaces estructurales fundamentales. En el refinamiento en un OPD nuevo, el refinable lleva contorno grueso en los dos OPDs (ISO §14.2.1.2, §14.2.1.3; spec-OPD §10.1).

### 8.8 Restricciones de refinamiento (ISO §14.2.2.6.1, §14.2.3)

- **R-REF-1** (ISO §14.2.2.6.1.1, §14.2.1.2): el árbol de procesos OPD y la jerarquía de despliegue son árboles: NO DEBEN tener ciclos.
- **R-REF-4** (ISO §14.2.3, B.4): esencia, afiliación, perseverancia y nombre de una cosa no cambian de un OPD a otro, porque toda aparición es el mismo elemento.

### 8.9 Cambio de rol entre niveles (ISO Tabla 25, §14.2.4.3)

- **R-ROL-1** (ISO Tabla 25, §14.2.4.3) [informativo]: un objeto puede figurar como instrumento en el OPD abstracto y como afectado en uno descendiente cuando su estado inicial coincide con el final en ese proceso (ISO Tabla 25 NOTA 2, Figura 53). Es la excepción a la precedencia del transformador sobre el habilitador (R-PREC-5).
- **R-ROL-3** (ISO §14.2.4.3, §14.2.3): si el cambio neto del objeto en el proceso abstracto no es nulo, el objeto DEBE modelarse como afectado también en el OPD abstracto.

### 8.10 SD, árboles, vistas y OPL del sistema (ISO §14.1, §14.2.2.6)

- **R-SD-1** (ISO §14.1): el SD DEBE modelar los interesados, los beneficiarios, el proceso que entrega el valor funcional y las cosas ambientales y sistémicas indispensables.
- **R-SD-2** (ISO §14.1): el SD DEBERÍA contener sólo las cosas centrales, indispensables para comprender la función y el contexto del sistema.
- **R-SD-3** (ISO §14.1): el valor funcional PUEDE ser explícito (estados de entrada y de salida del beneficiario, o valores inicial y final de sus atributos) o implícito (el beneficiario es afectado).
- **R-SD-4** (ISO §14.2.2.6.1.3, §3.75): el SD DEBE contener exactamente un proceso sistémico, que representa la función del sistema; PUEDE contener procesos ambientales.
- **R-ARB-1** (ISO §3.45, §14.2.2.6.1.1): el árbol de procesos OPD DEBE tener raíz SD y por nodos los OPDs creados en un diagrama nuevo por descomposición (subprocesos síncronos) o por despliegue de agregación (subprocesos asíncronos).
- **R-ARB-2** (ISO §3.44, §14.2.2.6.1.2): el árbol de objetos OPD tiene raíz en un objeto y muestra su elaboración por refinamiento; hay un árbol por cada objeto refinable (un bosque).
- **R-ARB-3** (ISO §14.2.2.6.1.3): SD es la etiqueta del OPD raíz; las etiquetas SD1, SD1.1 y análogas nombran los OPDs del árbol.
- **R-ARB-4** (ISO §14.2.2.6.1.4): toda arista del árbol de procesos OPD DEBE tener etiqueta y equivale a un enlace etiquetado `se refina por descomposición de NombreProceso en` o `se refina por despliegue de NombreProceso en`; su oración es CX4 o CX9.
- **R-OPL-TOTAL-1** (ISO §14.2.2.6.2, Tabla 26): la especificación OPL del sistema es la sucesión de los párrafos OPL de todos sus OPDs; el orden habitual (SD y luego en anchura, salvo otro que elija el modelador) es informativo (ISO §14.2.2.6.2 NOTA 2).
- **R-OPL-TOTAL-2** (ISO §14.2.2.6.2): la especificación OPL del sistema DEBE cubrir todo el modelo, no sólo el OPD que se está viendo.
- **R-OPL-TOTAL-4** (ISO §14.2.1.1): el OPL de un OPD DEBE expresar los estados de los objetos sólo como el OPD los muestra; el símbolo de supresión se escribe con la frase reservada «, y otros estados» (D6).
- **R-OPL-TOTAL-5** (ISO §14.2.1.1): el conjunto completo de estados de un objeto es la unión de sus estados en todos los OPDs del modelo.
- **R-OPL-TOTAL-6** (ISO §14.2.2.6.2, Tabla 26, §14.2.2.6.1.4): la especificación OPL del sistema DEBERÍA abrir con un título («Especificación OPL de …»), intercala la oración de refinamiento de cada OPD (CX4, CX9) y cierra con «Fin de la especificación OPL» (ISO Tabla 26).
- **R-VIEW-1** (ISO §14.2.2.6.1.5): una herramienta OPM DEBERÍA permitir crear vistas, como OPDs con sus oraciones OPL, que reúnan objetos y procesos que cumplen un criterio (por ejemplo, el camino crítico o la lista de agentes e instrumentos). Las vistas no son un mecanismo de refinamiento.
- **R-VIEW-4** (ISO §14.2.2.6.1.5): el mapa del sistema es un árbol de procesos OPD que muestra el contenido de cada OPD (nodo); las vistas de modelo DEBEN incluir la lista de todas las cosas con los OPDs donde aparecen, el árbol de procesos OPD y los árboles de objetos OPD.
- **R-SIMP-1** (ISO C.5.2) [informativo]: un OPD sobrecargado PUEDE simplificarse abstrayendo procesos y objetos en un constructo superior.
- **R-SIMP-2** (ISO C.5.2, §9.5.1): la simplificación no puede crear enlaces procedimentales entre procesos, porque ningún enlace procedimental salvo la invocación y la excepción une dos procesos.

### 8.11 Descomposición y recomposición en un diagrama nuevo (ISO C.5.1)

- **R-OPD-OP-1** (ISO C.5.1) [informativo]: la descomposición en un diagrama nuevo puede describirse como una operación que parte de `SDn`, muestra el contenido del refinable, refina sus enlaces y produce `SDn+1` (ISO Figuras C.19–C.20).
- **R-OPD-OP-2** (ISO C.5.1) [informativo]: la recomposición es la operación inversa: parte de `SDn+1`, abstrae los enlaces, oculta el contenido y produce `SDn`.

---

## 9. Bimodalidad OPD↔OPL y consistencia

### 9.1 Principio (ISO §6.2.1)

- **R-BI-DUAL-1** (ISO §6.2.1): cada OPD DEBE tener un párrafo OPL equivalente. La correspondencia es bidireccional: todo hecho gráfico se expresa en OPL y toda oración OPL se representa como constructo OPD.

### 9.2 Tabla de correspondencia

- **R-BI-TAB-1** (ISO §6.2.1): la correspondencia entre construcción gráfica y oración de esta tabla, y la de las plantillas de reglas §4 y reglas §7.3–§7.4, es normativa: cada construcción se expresa con su plantilla y cada plantilla denota esa misma construcción.

| Construcción gráfica | Plantilla OPL-ES |
|---|---|
| Rectángulo con sombra | D1: **Cosa** es física. |
| Rectángulo sin sombra (por defecto) | D2: **Cosa** es informacional. (PUEDE omitirse: es el valor por defecto) |
| Rectángulo o elipse con contorno discontinuo (a trazos) | D3: **Cosa** es ambiental. |
| Elipse con sombra | D1: *Cosa* es física. |
| Estados dentro de un objeto | D5: **Objeto** puede estar `estado1`, `estado2` o `estado3`. |
| Estado con contorno grueso | D7: Estado `s` de **Objeto** es inicial. |
| Estado con contorno doble | D8: Estado `s` de **Objeto** es final. |
| Estado con flecha diagonal | D9: Estado `s` de **Objeto** es por defecto. |
| Estado con contorno grueso y doble a la vez | D10: Estado `s` de **Objeto** es inicial y final. |
| Flecha de punta cerrada de objeto a proceso | T1: *Proceso* consume **Objeto**. |
| Flecha de punta cerrada de proceso a objeto | T2: *Proceso* genera **Objeto**. |
| Flecha de dos puntas cerradas | T3: *Proceso* afecta **Objeto**. |
| Flecha desde el estado de entrada y flecha hacia el estado de salida | TS3: *Proceso* cambia **Objeto** de `entrada` a `salida`. |
| Línea con círculo negro en el proceso | H1: **Agente** maneja *Proceso*. |
| Línea con círculo blanco en el proceso | H2: *Proceso* requiere **Instrumento**. |
| Anotación `e` sobre un consumo | ET1: **Objeto** inicia *Proceso*, que consume **Objeto**. |
| Anotación `c` sobre un consumo | CT1: *Proceso* ocurre si **Objeto** existe, en cuyo caso **Objeto** se consume, de lo contrario *Proceso* se omite. |
| Zigzag de proceso a proceso | IV1: *Invocador* invoca *Invocado*. |
| Triángulo negro con el vértice en el todo | RF1: **Todo** consta de **Parte1**, **Parte2** y **Parte3**. |
| Triángulo con triángulo negro interior, vértice en el exhibidor | RF2: **Exhibidor** exhibe **Atributo1** y **Atributo2**. |
| Triángulo vacío, vértice en el general | RF3: **Especialización1** y **Especialización2** son **General**. |
| Triángulo con círculo negro interior, vértice en la clase | RF4: **Instancia** es una instancia de **Clase**. |
| Proceso agrandado con subprocesos dispuestos de arriba abajo | CX1: *Proceso* se descompone en *P1* y *P2*, en esa secuencia. |
| Proceso agrandado con subprocesos a la misma altura | CX2: *Proceso* se descompone en paralelo *P1* y *P2*. |
| Un arco discontinuo sobre un abanico | exactamente uno de … (XOR) |
| Dos arcos discontinuos concéntricos sobre un abanico | al menos uno de … (OR) |
| Una barra oblicua junto al proceso destino de un enlace proceso → proceso | EX1: *Manejo* ocurre si duración de *Fuente* excede máx-duración unidades-de-tiempo. |
| Dos barras oblicuas paralelas junto al proceso destino | EX2: *Manejo* ocurre si duración de *Fuente* es menor que mín-duración unidades-de-tiempo. |

### 9.3 Casos que requieren convención

- **R-BR-1** (ISO §14.2.1.2, §10.3.2): el plegado o despliegue parcial expresa en OPL sólo los refinados visibles, con la frase de colección parcial (`y al menos otra parte`, ISO §14.2.1.2 NOTAS 3–4).

### 9.4 Consistencia de hechos (ISO §14.2.3)

- **R-CONSIST-1** (ISO §14.2.3): un hecho del modelo que aparece en un OPD DEBE ser verdadero para todo el conjunto de OPDs del modelo, y ningún OPD DEBE contener un hecho que contradiga otro hecho del mismo OPD o de otro OPD.
- **R-CONSIST-2** (ISO §14.2.3): un hecho que refina o abstrae un hecho de otro OPD no lo contradice.

### 9.5 Importancia de las cosas (ISO B.2)

- **R-IMP-1** (ISO B.2) [informativo]: la importancia relativa de una cosa la indica, en general, el OPD más alto de la jerarquía en que aparece.

---

## 10. Hecho único (ISO §6.2.1)

### 10.1 Principio de hecho único

- **R-BI-0** (ISO §6.2.1, C.2): OPD y OPL no son dos modelos: son dos expresiones semánticamente equivalentes del mismo modelo.

---

## 11. Construcciones inválidas

| # | Construcción | Regla | Corrección |
|---|---|---|---|
| AP-01 | Resultado con modificador `c` | No existe enlace de condición de resultado: `c` sólo anota enlaces entrantes (R-MOD-1; ISO §9.5.1). | Llevar la condición a un enlace de entrada: consumo, efecto, agente o instrumento. |
| AP-02 | Resultado con modificador `e` | No existe enlace de evento de resultado (R-MOD-1; ISO §9.5.1). | Llevar el evento a un consumo, efecto, agente o instrumento. |
| AP-03 | Abanico XOR u OR de resultado con `c` o `e` | Cada rama sigue siendo un resultado (R-MOD-1; ISO §9.5.1, §12.5). | Llevar el control al lado de entrada o usar un abanico probabilístico sin control. |
| AP-04 | Resultado unido directamente al estado inicial | DEBERÍA unirse al rectángulo o a un estado no inicial (R-RES-1; ISO §9.3.2). | Unirlo al rectángulo del objeto o a un estado no inicial. |
| AP-05 | Agente no humano (robot, máquina, software) | Un agente es un humano o un grupo de humanos; lo no humano es instrumento (R-AG-1, R-AG-1A; ISO §3.3, §9.2.2). | Usar enlace de instrumento. |
| AP-06 | Consumo o resultado en el contorno de un proceso descompuesto | R-DIST-1 (ISO §14.2.2.4.1). | Anclarlo por defecto al primer subproceso y reasignarlo al subproceso que consume o genera (R-DIST-3). |
| AP-07 | Efecto con entrada y salida que queda subespecificado al descomponer | R-ESCIND-1 (ISO §14.2.2.4.3). | Asignar entrada y salida a un subproceso o escindirlas: mitad de entrada en uno temprano y mitad de salida en uno tardío. |
| AP-08 | Mitad de entrada de un efecto escindido con `c` o `e` [informativo] | R-ESC-1 (ISO Tabla 25 NOTA 1); no se aplica a TS4 ni a TS5 (R-ESCIND-0). | Poner el control sobre el efecto completo antes de escindir o sobre otro enlace de entrada. |
| AP-09 | `c` o `e` sobre un enlace estructural | Los modificadores sólo anotan enlaces procedimentales entrantes (ISO §9.5.1, §3.13). | Llevar el control a un enlace procedimental de entrada del proceso correspondiente. |
| AP-10 | `c` o `e` sobre una invocación | `e` y `c` sólo anotan enlaces entrantes objeto → proceso; la invocación ya es un enlace de evento entre procesos (ISO §9.5.1, §9.5.2.5.1). | Un proceso previo que genera un objeto cuyos estados condicionan a los procesos alternativos, o un abanico de invocación. |
| AP-12 | Estados de proceso | Los estados sólo son de objetos (ISO §7.3.5.1, A.4.4.4, §3.70). | Descomponer el proceso en subprocesos (R-PROC-4). |
| AP-16 | Refinamiento cíclico | R-REF-1 (ISO §14.2.2.6.1.1). | Romper el ciclo. |
| AP-20 | Triángulo estructural sin su interior | La exhibición lleva un triángulo negro interior y la clasificación un círculo negro interior (R-TRI-2; ISO §10.3.3.1, §10.3.5.1). | Dibujar el interior que corresponde a la relación. |
| AP-21 | Evento desde una cosa sistémica que cruza el contorno de un proceso descompuesto | NO DEBE ocurrir (ISO §14.2.2.4.2). | Llevar el evento dentro de la descomposición o, si la cosa es ambiental, modelar la contingencia. |
| AP-30 | Resultado más resultado, o consumo más consumo, sobre el mismo objeto al recomponer | R-PREC-1 (ISO §14.2.4.2, Tabla 27). No verificable: las figuras de la Tabla 27 faltan en la fuente. | Corregir el nivel hijo antes de recomponer. |

### 11.2 Probabilidad fuera de un abanico

`Pr=p` sólo anota los enlaces de un abanico probabilístico (ISO §12.7). Un resultado sin estado especificado hacia un objeto con estados no es un enlace probabilístico aislado: equivale a un abanico XOR hacia sus estados con probabilidad `1/n` cada uno, salvo estado inicial (R-PROB-2, reglas §7.5).

---

## Anexos

### Anexo A — Comprobaciones de cierre

- **R-ANEXO-CHECK-1** (ISO §5, §6.2.1): un modelo conforme satisface cada comprobación de esta tabla; cada fila resume reglas del cuerpo y no añade reglas.

| Comprobación | Regla | Falla si |
|---|---|---|
| Firma | Cada enlace respeta su clase, su dirección y los tipos de sus extremos (reglas §5; ISO §8, §9, §10). | un procedimental une objeto con objeto; un estructural une un estado fuera de la caracterización con estado, de los etiquetados con estado (ISO §10.4.1–§10.4.2) y de la especialización de estado (R-STRE-2); una invocación o una excepción tocan un objeto. |
| Estado | Todo estado tiene objeto dueño y designaciones válidas (R-EST-1, R-EST-2; ISO §7.3.5, A.4.4.4). | hay un estado sin objeto o más de un estado por defecto en un objeto. |
| OPL | Todo hecho del OPD tiene su oración OPL-ES y toda oración denota el mismo constructo OPD (R-BI-DUAL-1; ISO §6.2.1). | un hecho visible no tiene oración, o una oración no reconstruye el mismo hecho. |
| Modificadores | `e` y `c` sólo anotan enlaces transformadores o habilitadores entrantes (R-MOD-4; ISO §9.5.1, Tabla 25 NOTA 1). | un resultado, un estructural, una invocación, una excepción o la mitad de entrada de un efecto escindido llevan `e` o `c`. |
| Refinamiento | Todo OPD hijo agrega detalle y no contradice al padre (R-CONSIST-1, R-REF-1, R-REF-4; ISO §14.2.3, §14.2.2.6.1.1). | un OPD contradice a otro, el árbol de OPDs tiene un ciclo o cambian el nombre, la esencia, la afiliación o la perseverancia de una cosa. |
| Distribución | Al descomponer, los enlaces del padre se distribuyen según la norma (reglas §8.5; ISO §14.2.2.4). | un consumo o un resultado quedan en el contorno; un habilitador del contorno no alcanza ningún subproceso; un TS3 queda subespecificado (sin asignar entrada y salida a uno o dos subprocesos de forma temporalmente factible); un evento sistémico cruza el contorno. |

### Anexo B — Reglas gráficas

La notación gráfica es de spec-OPD; los IDs de la versión 1.x que la fase de revisión dejó en el canon se conservan aquí como referencias, salvo los que fijan semántica sin contraparte en spec-OPD.

- **R-VIS-TRI-1**: ver spec-OPD §7.1.
- **R-VIS-EST-1**: ver spec-OPD §3.1.
- **R-VIS-EST-2**: ver spec-OPD §3.1.
- **R-VIS-FAN-1**: ver spec-OPD §6.3 (semántica AND y oración única con «y», ISO §12.1; reglas §7.1).
- **R-VIS-RUTA-1**: ver spec-OPD §6.4.
- **R-VIS-MULT-1**: ver spec-OPD §9.
- **R-VIS-HER-1**: ver spec-OPD §7.1.
- **R-VIS-REF-1**: ver spec-OPD §10.1.
- **R-VIS-CTRL-1** (ISO §14.2.2.4.2): si una condición omite un subproceso, el control pasa al subproceso siguiente del contexto de descomposición; si no lo hay, vuelve al proceso descompuesto.
- **R-VIS-SD-1** = R-SD-4.
- **R-VIS-NOM-1** (ISO B.6.2, B.6.3, §14.2.2.6.1.4) [informativo]: los nombres de cosa DEBERÍAN ser únicos en el modelo, para que cada aparición remita sin ambigüedad a su cosa.
- **R-VIS-MODELO-1**: ver spec-OPD §10.4.
- **R-VIS-SUPR-1**: ver spec-OPD §3.3.
- **R-VIS-CONSTRUCT-1** = R-META-10, R-META-13.
- **R-VIS-APP-1**: ver spec-OPD §10.4.
- **R-VIS-ASYNC-1**: ver spec-OPD §8.1.
- **R-VIS-INZOOM-1** = R-OPD-OP-1, R-OPD-OP-2.

---

Fin del documento.
