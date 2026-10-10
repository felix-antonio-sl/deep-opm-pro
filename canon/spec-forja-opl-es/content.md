---
urn: urn:fxsl:kb:spec-forja-opl-es
nombre: spec-forja-opl-es
version: 2.0.0
estado: publicado
descripcion: "Especificación OPL-ES: realización en español de la OPL de ISO 19450 (vocabulario reservado, plantillas de oración por construcción y gramática EBNF traducida del Anexo A)."
fuente: "ISO/PAS 19450:2015, revisión cláusula por cláusula (2026-10-10); sustituye la sincronización KB previa"
autor: FS
creado: 2026-05-26
lang: es
tags: [opl, spec, bimodal]
familia: bok
depende: [urn:fxsl:kb:reglas-opm-estrictas-es]
refina: []
cita: [urn:fxsl:kb:spec-forja-opd-es, urn:fxsl:kb:metodologia-forja-opm-es]
---

# Especificación OPL-ES (ISO 19450) en español

## Definición

Esta especificación fija la realización en español (OPL-ES) del lenguaje OPL de ISO 19450: el vocabulario reservado (spec-OPL §1), las oraciones de descripción de cosas y estados (spec-OPL §2), la plantilla de cada clase de enlace (spec-OPL §3–§6), las oraciones de gestión de contexto (spec-OPL §7), la composición de abanicos, modificadores de control, probabilidades y rutas (spec-OPL §8), la composición AND en una sola oración (spec-OPL §9), la multiplicidad de objetos (spec-OPL §10), las etiquetas de ruta (spec-OPL §11), la OPL por OPD (spec-OPL §12) y la gramática EBNF de OPL-ES (spec-OPL §18), que traduce el Anexo A de la norma.

Su alcance es sólo lo que ISO 19450 funda. La validez de los modelos y sus reglas semánticas pertenecen a `reglas-opm-estrictas-es`; la notación gráfica, a `spec-forja-opd-es`; el método, a `metodologia-forja-opm-es`. El catálogo de plantillas por ID vive en reglas §4; este documento desarrolla cada plantilla con el mismo texto, carácter a carácter, y fija su gramática (spec-OPL §18). Los demás documentos las citan por ID.

## Precedencia

reglas > spec-OPD / spec-OPL > metodología. Ante duda manda la norma (ISO/PAS 19450:2015). El perfil OpForja (`perfil/opl-opforja`) se subordina a este documento: puede endurecerlo o extenderlo de forma declarada, nunca contradecirlo.

## Convenciones

- Cita: `ISO §x.y` remite a ISO/PAS 19450:2015 con su numeración. «ISO Tabla n» y «ISO Figura n» remiten a sus tablas y figuras. El Anexo A es normativo; los Anexos B, C y D, las NOTE y los EXAMPLE son informativos.
- Modalidad: shall → DEBE; shall not → NO DEBE; should → DEBERÍA; should not → NO DEBERÍA; may → PUEDE. Sin palabra modal en mayúsculas, el texto describe.
- Marcas: `[informativo]` = lo funda sólo un anexo informativo, una NOTE, un EXAMPLE o una figura (nunca DEBE); `[localización]` = decisión de la realización española que no cambia el hecho expresado; `[guía]` = orientación no normativa; «no verificable» = la fuente local está resumida o falta la figura que lo decide.
- Formato de regla: `- **ID** (ISO §x.y): enunciado.` Una plantilla se identifica por su ID (D*, T*, TS*, H*, HS*, E*, C*, EX*, IV*, RF*, RX*, RH*, SE*, SSE*, CX*).
- Notación de los ejemplos: el objeto va en negrita, el proceso en cursiva y el estado entre comillas invertidas. Es notación de lectura de este documento y no forma parte de la gramática (spec-OPL §18), que opera sobre el texto sin marcas (ISO §A.3.3). ISO sólo pide que el valor de atributo vaya destacado y sin mayúscula (ISO §11.3).
- Cuando una oración de ejemplo en inglés fija una equivalencia, se cita entre comillas angulares y con su cláusula.
- Términos: los del contrato terminológico del canon (cosa, objeto, proceso, estado, enlace, abanico, refinado, despliegue, plegado, descomposición, recomposición…).

Secciones trasladadas al perfil: §13, §14, §15, §16, §17, §19, §20, §22, §23, §24, Apéndice B y Apéndice C completas; Apéndice A.3; de §1–§12, §18 y §21, los campos de generación, parseo, roundtrip, trazabilidad a código, estado de implementación y las extensiones de producto.

## Definiciones

| Término | Definición |
| --- | --- |
| Hecho del modelo | Relación entre dos cosas o estados del modelo (ISO §3.38). Una oración OPL expresa uno o más hechos. |
| Párrafo OPL | Secuencia de oraciones OPL separadas por salto de línea; cada OPD tiene el suyo (ISO §6.2.1, §A.4.1). |
| Esencia | Propiedad genérica de una cosa: física o informacional; por defecto, informacional (ISO §7.3.3, §A.4.4.2). |
| Afiliación | Propiedad genérica de una cosa: sistémica o ambiental; por defecto, sistémica (ISO §7.3.4, §A.4.4.2). |
| Perseverancia | Propiedad genérica: estática (objeto) o dinámica (proceso) (ISO §3.50); su oración es «persistente» o «transitoria», por defecto persistente (ISO §A.4.4.2). |
| Plegado | Abstracción inversa del despliegue: oculta los refinados (partes, rasgos, especializaciones o instancias) de un refinable desplegado (ISO §3.22, §14.2.1.2, §A.4.7.3). |

## §1 Vocabulario reservado

El vocabulario OPL-ES realiza en español las constantes de la gramática OPL: las palabras y frases reservadas que interpretan las configuraciones gráficas y las etiquetas de enlace del OPD (ISO §A.3.1). Los nombres de cosas y estados, las etiquetas de enlace y de ruta, los valores y las unidades son clase abierta (ISO §A.3.1, §A.3.2). La generación DEBE emplear sólo las frases reservadas de esta sección y de las plantillas de spec-OPL §2–§12 (R-§21-OPL-VOCAB). Las construcciones que ISO fija fuera del Anexo A —probabilidad (ISO §12.7), etiqueta de ruta (ISO §13) y oración de refinamiento entre OPD (ISO §14.2.2.6)— forman parte del vocabulario aunque carezcan de EBNF en la norma (ISO §A.1).

Los verbos van en tercera persona del presente de indicativo: en singular con sujeto único y en plural con sujeto lista (ISO §A.4.5.3, «handle»; ISO §12.1). La multiplicidad no pluraliza el verbo de un proceso: se antepone al objeto, que va en plural (spec-OPL §10).

### §1.1 Verbos y cópulas

| Verbo / cópula | Significado | Plantillas | ISO |
| --- | --- | --- | --- |
| consume | el proceso consume (destruye) el objeto | T1, TS1, ET1, ETS1, CT1, CS1 | ISO §9.1.2, §A.4.5.2 |
| genera | el proceso genera (crea) el objeto; realiza «yields» | T2, TS2 | ISO §9.1.3, §9.1.5, §A.4.5.2 |
| afecta | el proceso afecta al objeto sin especificar estados | T3, ET2, CT2 | ISO §9.1.4, §A.4.5.2 |
| cambia … de … a / cambia … de / cambia … a | el proceso cambia el estado del objeto (efecto con estados especificados) | TS3, TS4, TS5 | ISO §9.3.3.2–§9.3.3.4, §A.4.5.2 |
| maneja / manejan | el agente maneja el proceso; realiza «handles» | H1, HS1, CH1, CS5 | ISO §9.2.2, §A.4.5.3 |
| requiere / requieren | el proceso requiere el instrumento | H2, HS2 | ISO §9.2.3, §A.4.5.3 |
| inicia / inicia y maneja | el objeto o el estado inicia el proceso (enlace de evento) | ET*, EH*, ETS*, EHS* | ISO §9.5.2, §A.4.5.4 |
| invoca / se invoca a sí mismo | invocación entre procesos y autoinvocación | IV1, IV2 | ISO §9.5.2.5, §A.4.5.4 |
| ocurre si | el proceso ocurre bajo condición o por excepción | C*, EX1, EX2 | ISO §9.5.3, §9.5.4, §A.4.5.4 |
| existe | el objeto está presente en la evaluación de la precondición | C* | ISO §9.5.3.1, §9.5.3.2 |
| se omite | el proceso no se ejecuta y el control sigue (omisión por condición) | C* | ISO §9.5.3.1 |
| se consume | pasiva refleja del consumo en la rama positiva de la condición | CT1, CS1 | ISO §9.5.3.1, §A.4.5.4 |
| consta de | el todo consta de las partes | RF1, RF1i | ISO §10.3.2, §A.4.6.3 |
| exhibe | el exhibidor exhibe rasgos (atributos u operaciones) que lo caracterizan | RF2, RF2b, RF2c, RF5 | ISO §10.3.3.1, §A.4.6.3 |
| es (valor) | el atributo de la cosa tiene ese valor | ENT-ATR | ISO §11.3, §A.4.6.4 |
| varía de … a | el valor del atributo está en ese rango | ENT-ATR | ISO §11.3, §A.3.2, §A.4.6.4 |
| son / es un / es una / es | especialización: varias, una de objeto, una de proceso (sin artículo) | RF3, RF3b, RF3c | ISO §10.3.4.1, §A.4.6.5 |
| puede ser o bien … o bien … / puede ser uno de | especialización XOR: la especialización es exactamente uno de varios generales | RX1, RX2 | ISO §A.4.6.5 |
| es una instancia de / son instancias de | clasificación-instanciación | RF4, RF4b | ISO §10.3.5.1, §A.4.6.6 |
| se relaciona con / se relacionan con | etiqueta nula unidireccional por defecto | SE2 | ISO §10.2.2, §A.4.6.2 |
| se relacionan | etiqueta nula recíproca por defecto | SE5 | ISO §10.2.4, §A.4.6.2 |
| es de tipo | el objeto declara su tipo de dato | D18 | ISO §A.4.4.3 |
| puede estar | el objeto enumera sus estados posibles | D5, D6 | ISO §7.3.5, §A.4.4.4 |
| está en | el objeto está en un estado (objeto de un solo estado; condición con estado) | D14, CS* | ISO §A.4.4.4, §9.5.3.3 |
| se descompone en | la cosa (proceso u objeto) se descompone (in-zooming) en sus partes | CX1, CX2, CX11, CX12, CX13 | ISO §3.34, §3.35, §14.2.1.3, §A.4.7.4 |
| se despliega en / se despliega por partes, por rasgos, por especialización, por instancias en | despliegue de la cosa en sus refinados | CX3, CX10 | ISO §14.2.1.2, §A.4.7.2 |
| se refina por descomposición de / se refina por despliegue de | refinamiento entre OPD del árbol de procesos | CX4, CX9 | ISO §14.2.2.6 |
| es plegado de | la cosa es el plegado de su OPD hijo (contorno grueso) | CX5, CX6 | ISO §3.22, §A.4.7.3 |
| se recompone desde | recomposición (out-zooming) de la cosa desde su OPD hijo | CX7, CX8 | ISO §3.48, §3.49, §A.4.7.5 |

«existe», «se omite» y «se consume» sólo aparecen dentro de oraciones de condición (ISO §A.4.5.4).

### §1.2 «puede estar» y «puede ser»

- **R-VERB-EST-1** (ISO §7.3.5, §A.4.4.4): la enumeración de los estados de un objeto DEBE usar «puede estar». [localización] El español distingue con «estar» el «can be» de estados.

  Correcto: **Pedido** puede estar `pendiente`, `despachado` o `cerrado`.
  Incorrecto: **Pedido** puede ser `pendiente`, `despachado` o `cerrado`.

- **R-VERB-EST-2** (ISO §A.4.6.5): «puede ser» DEBE reservarse a la especialización XOR (R-EST-GEN-1) y NO DEBE usarse para enumerar estados.

  Correcto: `**Auto Anfibio** puede ser o bien **Vehículo Terrestre** o bien **Vehículo Acuático**.`
  Incorrecto: **Vehículo** puede ser `encendido` o `apagado`.

### §1.3 Palabras y frases reservadas

| Palabra o frase | Significado | Plantillas | ISO |
| --- | --- | --- | --- |
| si | introduce la condición | C*, EX* | ISO §9.5.3, §A.4.5.4 |
| en cuyo caso | introduce la rama positiva | C* | ISO §9.5.3.1 |
| de lo contrario | introduce la rama negativa («otherwise», «else») | C* | ISO §9.5.3.1, §9.5.3.2 |
| Si … entonces … | sintaxis alternativa de la condición | C* | ISO §9.5.3, §A.4.5.4 |
| de / a | estado de entrada / estado de salida; extremos de rango | TS3–TS5, ENT-ATR | ISO §A.4.5.2, §A.3.2 |
| y / e | conjunción de listas AND | todas | ISO §12.1, §A.4.3 |
| o / u | conjunción de listas OR y XOR | abanicos, D5 | ISO §12.2, §A.4.3 |
| así como | separa atributos de operaciones | RF2b, CX1, CX3 | ISO §A.4.6.3, §A.4.7 |
| exactamente uno de | operador XOR | abanicos | ISO §12.2 |
| al menos uno de | operador OR | abanicos | ISO §12.2 |
| uno de | lista XOR en especialización y en la oración de cambio | RX2, R-FAN-5A | ISO §A.4.3, §A.4.6.5 |
| o bien … o bien | especialización XOR de dos generales | RX1 | ISO §A.4.6.5 |
| al menos otra parte / al menos otro atributo / al menos otra operación | colección incompleta | RF1i, RF2 | ISO §A.4.6.3 |
| y otras especializaciones | especialización incompleta | RF3, RF3c | ISO §A.4.6.5 |
| más / ordenados por / en esa secuencia | lista bifurcada abierta u ordenada; orden de descomposición | SE*, CX1, CX13 | ISO §A.4.6.2, §A.4.7.4 |
| paralelo / en paralelo | subprocesos que comienzan a la vez | CX2, CX12 | ISO §14.2.2.2, §A.4.7.4 |
| un/una … opcional; … opcionales; al menos un/una; muchos/muchas | multiplicidad 0..1; 0..*; 1..*; plural sin cota | spec-OPL §10 | ISO §11.1, §A.3.2 |
| a / o (en multiplicidad) | separador de extremos de rango / separador de rangos | spec-OPL §10 | ISO §11.1 |
| donde | introduce la restricción de multiplicidad | spec-OPL §10 | ISO §11.2, §A.3.2 |
| en { … } | pertenencia a conjunto | spec-OPL §10 | ISO §A.3.2 |
| con probabilidad | probabilidad de un enlace de abanico | R-PROB-3 | ISO §12.7 |
| Por ruta | etiqueta de ruta [informativo] | spec-OPL §11 | ISO §13 |
| duración de / excede / es menor que | sobretiempo y subtiempo | EX1, EX2 | ISO §9.5.4.2, §9.5.4.3 |
| inicial / final / por defecto / inicialmente / finalmente | designaciones de estado | D7–D10, D15–D17 | ISO §A.4.4.4 |
| física / informacional / sistémica / ambiental / persistente / transitoria | valores de las propiedades genéricas | D1–D4, D11, D12 | ISO §A.4.4.2 |
| , y otros estados | supresión parcial de estados (ISO §14.2.1.1 escribe «or other states» [informativo]) | D6 | ISO §A.4.4.4 |
| en cualquier estado | evento sobre efecto con sólo estado de salida | ETS4 | ISO §A.4.5.4 |
| que / a sí mismo / el proceso que ocurre | relativo de las oraciones de evento; autoinvocación; abanico con control | E*, IV2, spec-OPL §8 | ISO §A.4.5.4, ISO Tabla 22 |
| objeto / objetos / proceso / procesos | sufijo opcional del identificador | spec-OPL §18 | ISO §A.4.2 |
| en | unidad de medida del objeto; [localización] estado especificado pospuesto | spec-OPL §2.5, TS1, HS1… | ISO §A.4.2, §A.4.3 |
| desde / en (OPD) | OPD padre y OPD hijo en despliegue y descomposición en diagrama nuevo | CX10, CX11 | ISO §A.4.7.2, §A.4.7.4 |

- **R-VERB-KW-1** = R-OPL-KW-1. Las palabras y frases reservadas se emiten como figuran en esta sección y en las plantillas; además de la alternancia de R-OPL-KW-2, llevan mayúscula inicial cuando abren la oración (ISO §A.3.2) y concuerdan en género y número con el nombre al que se refieren (R-OPL-1).
- **R-VERB-KW-2** = R-OPL-KW-2.

### §1.4 Precisiones de vocabulario

- **DIV-1** (ISO §A.4.7.3, §A.4.7.5): el plegado y la recomposición pertenecen al vocabulario porque la norma les da oración: «**Cosa** es plegado de SDn» (CX5, CX6) y «**Cosa** se recompone desde SDn» (CX7, CX8); ambas nombran el OPD hijo.
- **DIV-2** (ISO §A.4.4.4): «inicial», «final», «por defecto», «inicialmente» y «finalmente» no son verbos sino palabras reservadas de las oraciones de descripción de estado (D7–D10, D15–D17).

## §2 Cosas, estados y propiedades genéricas

Esta sección fija las oraciones de descripción de cosas (ISO §A.4.4): propiedades genéricas, tipo de dato, estados y designaciones de estado; además, la oración de valor de atributo (ISO §11.3, §A.4.6.4) y la nominación de instancias. Las oraciones de enlace pertenecen a spec-OPL §3–§7.

### §2.0 Reglas transversales

- **R-ENT-1** = R-COSA-1.
- **D19** (ISO §A.4.4.2): **Cosa** es física, ambiental y transitoria.
- **R-ENT-3** (ISO §A.4.4.2, §7.3.3, §7.3.4): las propiedades genéricas de una cosa (esencia, afiliación y perseverancia) DEBEN expresarse en una sola oración de propiedades genéricas (D19), con a lo sumo un valor de cada propiedad y en cualquier orden. Los valores por defecto (informacional, sistémica, persistente) PUEDEN omitirse; D1–D4, D11 y D12 son sus formas de una sola propiedad. El adjetivo concuerda en género con el nombre de la cosa (R-OPL-1; `**Sensor** es físico`, `**Prueba** es física`).

  Correcto: `**Prueba** es ambiental y física.` (ISO §A.4.4.2: «Testing is environmental and physical»)
  Incorrecto: `**Prueba** es ambiental.` seguido de `**Prueba** es física.` cuando ambas propiedades describen la misma cosa en el mismo párrafo.

### §2.1 Objeto

**ID**: ENT-OBJ.

**Nombre**: sintagma nominal singular con mayúscula inicial (ISO §A.3.3); en plural cuando la multiplicidad admite más de una instancia (ISO §11.1, §A.4.2). [localización] Cada palabra del nombre DEBERÍA llevar mayúscula inicial, salvo artículos y preposiciones breves (ISO §B.6.5 [informativo]): `**Conjunto de Platos**`.

**Oraciones**: el objeto aparece como sujeto o complemento de las oraciones de enlace; su descripción propia la dan la oración de propiedades genéricas (R-ENT-3), la de tipo (D18) y las de estado (spec-OPL §2.3, §2.4). Un objeto cuyas propiedades genéricas son las por defecto, sin estados ni enlaces en el OPD, carece de otra oración; PUEDE enunciar sus valores por defecto para constar en el párrafo de ese OPD (ISO §6.2.1, §A.4.4.2).

### §2.2 Proceso

**ID**: ENT-PROC.

**Nombre**: ISO nombra el proceso con un gerundio o un sintagma nominal con mayúscula inicial (ISO §A.3.3, §B.6.3 [informativo]). [localización] OPL-ES DEBERÍA nombrarlo con infinitivo o sustantivo deverbal (`*Despachar*`, `*Despacho*`); el criterio de nombre es R-NOM-PROC-1 (reglas).

**Oraciones**: el proceso es sujeto o complemento de las oraciones de transformación, habilitación, control y gestión de contexto. Un proceso no tiene estados (ISO §3.68): sus fases se modelan como subprocesos y no como estados del proceso.

### §2.3 Estados y enumeración de estados

**ID**: ENT-EST (D14, D5, D6).

- **D14** (ISO §A.4.4.4): **Objeto** está en `estado`. — objeto con un solo estado. [localización] Realiza «Object is s».
- **D5** (ISO §A.4.4.4, §7.3.5): **Objeto** puede estar `estado1`, `estado2` o `estado3`. El último estado se une con «o» (R-OPL-KW-2). La EBNF de ISO escribe «and» y sus ejemplos «or»; OPL-ES sigue los ejemplos, con el mismo hecho.
- **D6** (ISO §A.4.4.4, §14.2.1.1): **Objeto** puede estar `estado1`, `estado2`, y otros estados. — supresión parcial de estados: realiza la producción «, and other states» de ISO §A.4.4.4. ISO §14.2.1.1 escribe la frase reservada «or other states»; es una variante de la norma, no adoptada [informativo].

**Oraciones**: el párrafo de un OPD enumera sólo los estados que ese OPD muestra (ISO §14.2.1.1; reglas R-OPL-TOTAL-4); el conjunto completo de estados del objeto es la unión sobre todos los OPD.

**Nombres de estado**: DEBEN ir en minúscula (ISO §A.4.2) y DEBERÍAN tener forma de participio o adjetivo de estado (ISO §B.6.4 [informativo]).

- **R-ENT-EST-1** = R-VERB-EST-1.
- **R-ENT-EST-2** = R-EST-1.

### §2.4 Designación de estado

**ID**: ENT-DESIG (D7–D10, D15–D17).

- **D7** (ISO §A.4.4.4, §7.3.5.3): Estado `s` de **Objeto** es inicial.
- **D8** (ISO §A.4.4.4, §7.3.5.3): Estado `s` de **Objeto** es final.
- **D9** (ISO §A.4.4.4, §7.3.5.3): Estado `s` de **Objeto** es por defecto.
- **D15** (ISO §A.4.4.4): Estados `s1` y `s2` de **Objeto** son iniciales.
- **D16** (ISO §A.4.4.4): Estados `s1` y `s2` de **Objeto** son finales.
- **D17** (ISO §A.4.4.4): **Objeto** está inicialmente en `s1` y finalmente en `s2` o `s3`. — oración combinada.
- **D10** [informativo] (ISO Tabla 25): Estado `s` de **Objeto** es inicial y final. — Sólo la funda el EXAMPLE 2 de ISO Tabla 25; el Anexo A expresa el mismo hecho con D7 y D8. PUEDE emitirse.

**Oraciones**: cada estado designado tiene su oración; un estado sin designación no la tiene (ISO §A.4.4.4). Las designaciones múltiples del mismo objeto PUEDEN reunirse en D15–D17.

### §2.5 Atributo y valor

**ID**: ENT-ATR.

- Valor: **Atributo** de **Objeto** es `valor`. (ISO §11.3, §A.4.6.4)
- Rango: **Atributo** de **Objeto** varía de X a Y. (ISO §A.3.2, §A.4.6.4)
- Rango, forma de ISO §11.3: El rango de **Atributo** de **Objeto** es X a Y. (ISO §11.3: «Attribute of Object range is value-range»; mismo hecho que la anterior)
- Enumeración de valores: **Atributo** de **Objeto** puede estar `valor1`, `valor2` o `valor3`. — los valores son estados del atributo (ISO §7.3.5.5, §10.3.3.2) y se enumeran como D5.

**Oraciones**: la oración de valor es la oración de exhibición de ISO §A.4.6.4, distinta de la caracterización con «exhibe» (spec-OPL §6.2). El valor DEBE escribirse sin mayúscula inicial y destacado (ISO §11.3). En una especialización, el valor del atributo discriminante heredado se expresa con la oración de valor (**Medio de Desplazamiento** de **Auto** es `tierra`.) o con RF5 (ISO §10.3.4.3, §10.4.1); su validez la rige R-HER-3 (reglas).

- **R-ENT-ATR-1** = R-ATR-1.
- **R-ENT-ATR-2** = R-ATR-2.

La unidad de medida de un atributo se escribe en su identificador, tras el nombre y con «en» (R-ATR-3, reglas; ISO §A.4.2, §7.3.5.5): `**Altura** en cm de **Adulto** varía de 120 a 240.`

### §2.6 Instancia

**ID**: ENT-INS.

**Oraciones**: una instancia es una cosa distinta de su clase, nombrada como cualquier cosa; su clase se declara con la oración de clasificación-instanciación RF4/RF4b (`**Jack Robinson** es una instancia de **Adulto**.`, ISO §10.3.5.1, §A.4.6.6). La forma «Instancia : Clase» no es OPL: ISO §10.3.5.1 la muestra sólo como rótulo del OPD (no verificable: aparece en la descripción de figuras).

- **R-ENT-INS-1** (ISO §10.3.5, §3.28, §3.29, §B.5 [informativo]): la oración «es una instancia de» DEBE expresar sólo la clasificación-instanciación entre cosas distintas (ISO §10.3.5). La instancia operacional es de ejecución y no tiene oración (ISO §3.29). La aparición de una misma cosa en otro OPD es una copia de esa cosa, no una instancia (ISO §B.5 [informativo]): no emite oración de instanciación, y sus hechos se expresan en el párrafo de cada OPD donde aparecen (ISO §6.2.1, §14.2.3).

### §2.7 Esencia (física / informacional)

**ID**: ENT-ESENCIA (D1, D2).

- **D1** (ISO §A.4.4.2, §7.3.3): **Cosa** es física.
- **D2** (ISO §A.4.4.2, §7.3.3): **Cosa** es informacional.

**Oraciones**: D1 y D2 son la oración de propiedades genéricas con una sola propiedad (R-ENT-3). La esencia por defecto es informacional (ISO §A.4.4.2); un valor explícito prevalece sobre el defecto.

### §2.8 Afiliación (sistémica / ambiental)

**ID**: ENT-AFILIA (D3, D4).

- **D3** (ISO §A.4.4.2, §7.3.4): **Cosa** es ambiental.
- **D4** (ISO §A.4.4.2, §7.3.4): **Cosa** es sistémica.

**Oraciones**: la afiliación se expresa en la misma oración de propiedades genéricas que la esencia (R-ENT-3). La afiliación por defecto es sistémica (ISO §A.4.4.2).

### §2.9 Perseverancia

**ID**: ENT-PERS (D11, D12).

- **D11** (ISO §A.4.4.2): **Cosa** es persistente.
- **D12** (ISO §A.4.4.2): **Cosa** es transitoria.

**Oraciones**: son la oración literal de ISO §A.4.4.2 y forman parte de la oración de propiedades genéricas (R-ENT-3); el valor por defecto es persistente. La PAS no define la semántica de estos valores más allá de ISO §3.50 (perseverancia estática = objeto, dinámica = proceso).

### §2.10 Tipo de dato

- **D18** (ISO §A.4.4.3, §A.3.2): **Objeto** es de tipo T. — el objeto declara su tipo de dato T: `boolean`, `string`, `integer`, `unsigned integer`, `float`, `double`, `short`, `long` o `enumerated`. Sólo un objeto declara tipo; los nombres de tipo se mantienen como constantes de ISO.

## §3 Enlaces transformadores

Un enlace transformador conecta un proceso con el objeto que transforma: consumo, resultado o efecto (ISO §9.1); el consumo, el resultado y el efecto con estado especificado son sus variantes con estado (ISO §9.3). La oración transformadora DEBE usar uno de los verbos «consume», «genera», «afecta» o «cambia» (ISO §A.4.5.2). El sujeto es siempre el proceso; el objeto transformado es el complemento.

### §3.0 Asimetría de consumo y resultado ante el control

- **R-TR-ASIM-1** = R-MOD-2.
- **R-TR-ASIM-2** = R-MOD-3. No hay oración de evento ni de condición sobre un resultado (R-MOD-1): `**Resultado** inicia *Procesar*, que genera **Resultado**.` no es OPL.
- **R-TR-ASIM-3** (ISO §9.5.2.1, §9.5.2.3, §9.5.3.3): el efecto PUEDE llevar modificador de evento o de condición, porque el afectado existe antes del proceso con su estado de entrada (ET2, ETS2–ETS4, CT2, CS2–CS4).

### §3.1 Consumo (T1, TS1)

- **T1** (ISO §9.1.2, §A.4.5.2): *Procesar* consume **Consumido**.
- **TS1** (ISO §9.3.1, §A.4.5.2): *Proceso* consume **Objeto** en `estado`. [localización] Realiza «Process consumes specified-state Object» con el estado pospuesto.
- Con multiplicidad (ISO §11.1): `*Proceso* consume 3 **Objetos**.` — la multiplicidad precede al objeto, que va en plural; el verbo concuerda con el proceso.
- Con varios consumidos (ISO §12.1, §A.4.5.2): `*Proceso* consume **A** y **B**.` (R-COMP-EJE-3).

**Oración**: el proceso es el sujeto y el consumido el complemento (ISO §9.1.5); con estado especificado en el extremo del consumido se añade «en `estado`». Un consumo que forma parte de un abanico XOR u OR se expresa con la oración del abanico (spec-OPL §8.1), no con T1.

**Interpretación**: el consumo es inmediato al activarse el proceso, salvo que el enlace declare una tasa de consumo y el consumido un atributo de cantidad (ISO §9.3.1).

**Orden**: proceso → «consume» → objeto [→ «en» → estado].

### §3.2 Resultado (T2, TS2)

- **T2** (ISO §9.1.3, §A.4.5.2): *Procesar* genera **Resultante**. — «genera» realiza «yields».
- **TS2** (ISO §9.3.2, §A.4.5.2): *Proceso* genera **Objeto** en `estado`.
- Con multiplicidad (ISO §11.1): `*Proceso* genera 3 **Objetos**.`
- Con varios resultantes (ISO §12.1, §A.4.5.2): `*Proceso* genera **A**, **B** y **C**.`

**Oración**: el proceso es el sujeto y el resultante el complemento (ISO §9.1.5); con estado especificado en el extremo del resultante se añade «en `estado`». La conexión de un resultado a un objeto con estado inicial la rige R-RES-1 (reglas; ISO §9.3.2, DEBERÍA). El estado en que se crea un resultante sin estado especificado lo fijan reglas §7.5 y R-PROB-2 (ISO §12.7).

**Interpretación**: la generación es inmediata al completarse el proceso, salvo que el enlace declare una tasa de generación y el resultante un atributo de cantidad en ese estado (ISO §9.3.2).

**Orden**: proceso → «genera» → objeto [→ «en» → estado].

### §3.3 Efecto (T3)

- **T3** (ISO §9.1.4, §A.4.5.2): *Procesar* afecta **Afectado**.
- Con multiplicidad (ISO §11.1): `*Proceso* afecta 3 **Objetos**.`
- Con varios afectados (ISO §12.1, §A.4.5.2): `*Proceso* afecta **A**, **B** y **C**.`

**Oración**: el efecto sin estados especificados se expresa con «afecta»; el objeto afectado tiene estados (ISO §3.2; R-EFE-1, reglas) aunque la oración no los nombre. Entre el inicio y el fin del proceso el afectado está en transición (ISO §9.3.3.2 NOTE 1 [informativo]). Si el efecto especifica estados, se emite TS3, TS4 o TS5 en lugar de T3 (ISO §9.3.3.1).

**Orden**: proceso → «afecta» → objeto.

### §3.4 Efecto con estados de entrada y salida (TS3)

- **TS3** (ISO §9.3.3.2, §A.4.5.2): *Proceso* cambia **Objeto** de `estado-entrada` a `estado-salida`. Los dos estados DEBEN ser distintos (ISO §9.3.3.2).
- Con evento (ETS2, ISO §9.5.2.3): **Objeto** en `estado-entrada` inicia *Proceso*, que cambia **Objeto** de `estado-entrada` a `estado-salida`.
- Con condición (CS2, ISO §9.5.3.3): *Proceso* ocurre si **Objeto** está en `estado-entrada`, en cuyo caso *Proceso* cambia **Objeto** de `estado-entrada` a `estado-salida`, de lo contrario *Proceso* se omite.
- Con varios afectados (ISO §12.1 Figura 37, §A.4.5.2): *Proceso* cambia **A** de `s1` a `s2` y **B** de `s3` a `s4`.

**Oración**: un efecto con estado de entrada y de salida especificados se expresa con «cambia … de … a»; el modificador de evento o de condición reestructura la oración según ETS2 o CS2 (R-TR-ASIM-3). Varios estados de salida alternativos del mismo objeto se expresan con la oración de abanico de cambio (R-FAN-5, R-FAN-5A).

**Orden**: proceso → «cambia» → objeto → «de» → estado de entrada → «a» → estado de salida. El orden «de … a» lleva la dirección del cambio: invertirlo expresa otro hecho.

**Al descomponer**: si el proceso se descompone en dos o más subprocesos, el TS3 queda subespecificado hasta que el modelador asigna el par de enlaces a uno de los subprocesos o lo escinde en una mitad de entrada, en un subproceso temprano, y una mitad de salida, en uno tardío (ISO §14.2.2.4; R-ESCIND-1, reglas).

### §3.5 Efecto con estado de entrada especificado (TS4)

- **TS4** (ISO §9.3.3.3, §A.4.5.2): *Proceso* cambia **Objeto** de `estado-entrada`. — efecto con estado de entrada especificado: el estado de salida es el estado por defecto del objeto o, sin estado por defecto, el que determina su distribución de probabilidad de estados (ISO §9.3.3.3; R-EFE-3, reglas). Admite evento (ETS3) y condición (CS3).

**Mitad de entrada del par escindido** (ISO §14.2.2.4, ISO Tabla 25): al descomponer un proceso con un TS3, el modelador PUEDE escindir el par en una mitad de entrada, en un subproceso temprano, que saca al objeto del estado de entrada, y una mitad de salida, en un subproceso tardío, que lo pone en el estado de salida. La oración OPL-ES de la mitad de entrada es idéntica a la de TS4: el texto no distingue las dos y el contexto de descomposición las separa (el par conecta subprocesos de un proceso descompuesto cuyo enlace con ese objeto en el OPD padre es TS3). La mitad de entrada no tiene versión con modificador de control (ISO Tabla 25 NOTE 1 [informativo]).

**Orden**: proceso → «cambia» → objeto → «de» → estado de entrada. En la escisión, cada mitad es una oración: *P1* cambia **A** de `s1`. y *P2* cambia **A** a `s2`. (ISO Tabla 25).

### §3.6 Efecto con estado de salida especificado (TS5)

- **TS5** (ISO §9.3.3.4, §A.4.5.2): *Proceso* cambia **Objeto** a `estado-salida`. — efecto con estado de salida especificado; admite evento (ETS4) y condición (CS4) (ISO §9.5.2.3, §9.5.3.3).

**Mitad de salida del par escindido** (ISO Tabla 25): su oración OPL-ES es idéntica a la de TS5; el contexto de descomposición las separa (spec-OPL §3.5). ISO Tabla 25 NOTE 1 sólo niega la versión con control a la mitad de entrada; la mitad de salida es un enlace que sale del proceso, y los modificadores de control sólo marcan enlaces que entran a él (ISO §9.5.1).

**Orden**: proceso → «cambia» → objeto → «a» → estado de salida. La preposición «a» (y no «de») distingue TS5 de TS4.

## §4 Enlaces habilitadores

Un enlace habilitador conecta un objeto habilitador con un proceso: el habilitador está presente para que el proceso ocurra y no se transforma (ISO §9.2, ISO Tabla 2). La oración habilitadora DEBE usar «maneja» (agente) o «requiere» (instrumento) (ISO §A.4.5.3).

### §4.0 Reglas transversales

- **R-HAB-AG-1** = R-AG-1.
- **R-HAB-AG-2** = R-AG-1A.
- **R-HAB-AG-3** = R-AG-2.
- **R-HAB-AG-5** = R-ROL-UNIC-1.

### §4.1 Agente (H1, HS1)

- **H1** (ISO §9.2.2, §A.4.5.3): **Agente** maneja *Proceso*. — «maneja» realiza «handles».
- **HS1** (ISO §9.4.1, ISO Tabla 4): **Agente** en `estado` maneja *Proceso*. [localización] El estado se pospone al agente.
- Con multiplicidad (ISO §11.1): `2 **Agentes** manejan *Proceso*.`
- Con varios agentes (ISO §12.1 Figura 35, §A.4.5.3): `**A** y **B** manejan *Proceso*.`
- Con evento: EH1 y EHS1 (spec-OPL §5.1). Con condición: CH1 y CS5 (spec-OPL §5.2).

**Oración**: el agente es el sujeto y el proceso el complemento (ISO §9.2.2). Un agente que forma parte de un abanico XOR u OR se expresa con la oración del abanico (ISO §12.2, ISO Tabla 20; spec-OPL §8.1).

**Orden**: agente [→ «en» → estado] → «maneja» → proceso.

### §4.2 Instrumento (H2, HS2)

- **H2** (ISO §9.2.3, §A.4.5.3): *Proceso* requiere **Instrumento**.
- **HS2** (ISO §9.4.2, ISO Tabla 4): *Proceso* requiere **Instrumento** en `estado`.
- Con varios instrumentos (ISO §12.1 Figura 35, §A.4.5.3): `*Proceso* requiere **Llave A**, **Llave B** y **Llave C**.`
- Con varios procesos que requieren el mismo instrumento [informativo] (ISO §12.1, ISO Figura 50): `*P1*, *P2* y *P3* requieren **Instrumento**.`
- Con evento: EH2 y EHS2 (spec-OPL §5.1). Con condición: CH2 y CS6 (spec-OPL §5.2).

**Oración**: el proceso es el sujeto y el instrumento el complemento (ISO §9.2.3). Un instrumento que forma parte de un abanico XOR u OR se expresa con la oración del abanico (ISO §12.2, ISO Tabla 20; spec-OPL §8.1).

**Orden**: proceso → «requiere» → instrumento [→ «en» → estado]. El agente es sujeto y el instrumento complemento (ISO §A.4.5.3); esa diferencia de posición no DEBE igualarse.

## §5 Enlaces de control

Los modificadores de control «e» (evento) y «c» (condición) marcan un enlace transformador o habilitador que entra al proceso y lo convierten en el enlace de evento o de condición correspondiente. Evento, condición y excepción son enlaces de control (ISO §9.5.1); la invocación es un enlace de evento entre procesos (ISO §9.5.2.5).

### §5.0 Reglas transversales

Los modificadores de control sólo marcan enlaces que entran al proceso desde un objeto o un estado (ISO §9.5.1).

- **R-MOD-NAT-1** = R-ECA-4.
- **R-MOD-NAT-2** (ISO §9.5.1, §9.5.3.1): la oración DEBE distinguir la semántica de fallo. Con condición, si la precondición falla el proceso se omite y el control sigue: rama «de lo contrario *Proceso* se omite». Sin modificador, el proceso espera a que se cumpla la precondición (ISO §9.5.1 NOTE 2 [informativo]) y no hay rama de omisión. El evento inicia la evaluación de la precondición y se pierde tras ella aunque falle.
- **R-MOD-NAT-3** (ISO §3.18, §9.5.1, §12.1): cuando varios enlaces de evento llegan a un mismo proceso, cada evento inicia por sí solo la evaluación de la precondición; la conjunción AND recae sobre los objetos de la precondición. Por eso cada enlace de evento se expresa con su propia oración de evento.
- **R-MOD-INPUT-1** = R-MOD-4.
- **R-MOD-INPUT-2** = R-MOD-1.
- **R-MOD-CAT-1** (ISO §9.5.1): un modificador de evento o de condición NO DEBE marcar un enlace estructural ni un enlace de invocación.
- **R-MOD-CAT-2** = R-ESC-1.

### §5.1 Evento (E*)

**ID**: ET1, ET2, EH1, EH2, ETS1–ETS4, EHS1, EHS2.

- **ET1** (ISO §9.5.2.1, ISO Tabla 5, §A.4.5.4): **Objeto** inicia *Proceso*, que consume **Objeto**.
- **ET2** (ISO §9.5.2.1, ISO Tabla 5, §A.4.5.4): **Objeto** inicia *Proceso*, que afecta **Objeto**.
- **EH1** (ISO §9.5.2.2, ISO Tabla 6, §A.4.5.4): **Agente** inicia y maneja *Proceso*.
- **EH2** (ISO §9.5.2.2, ISO Tabla 6, §A.4.5.4): **Instrumento** inicia *Proceso*, que requiere **Instrumento**.
- **ETS1** (ISO §9.5.2.3, ISO Tabla 7): **Objeto** en `estado` inicia *Proceso*, que consume **Objeto**.
- **ETS2** (ISO §9.5.2.3, ISO Tabla 7, §A.4.5.4): **Objeto** en `estado-entrada` inicia *Proceso*, que cambia **Objeto** de `estado-entrada` a `estado-salida`.
- **ETS3** (ISO §9.5.2.3, §A.4.5.4): **Objeto** en `estado-entrada` inicia *Proceso*, que cambia **Objeto** de `estado-entrada`.
- **ETS4** (ISO §9.5.2.3, §A.4.5.4): **Objeto** en cualquier estado inicia *Proceso*, que cambia **Objeto** a `estado-destino`.
- **EHS1** (ISO §9.5.2.4, ISO Tabla 8): **Agente** en `estado` inicia y maneja *Proceso*.
- **EHS2** (ISO §9.5.2.4, ISO Tabla 8): **Instrumento** en `estado` inicia *Proceso*, que requiere **Instrumento** en `estado`.

**Oración**: un enlace transformador (consumo o efecto) o habilitador con modificador de evento se expresa con la oración de evento de su clase. El objeto o el estado que inicia el proceso es el sujeto de «inicia» y reaparece en la cláusula relativa que expresa el enlace base (ISO §9.5.2.1, §A.4.5.4); el agente reúne inicio y habilitación en «inicia y maneja». Un evento de abanico se expresa con las oraciones de ISO Tablas 22–23 (spec-OPL §8.1, R-FAN-4).

**Orden**: objeto o estado → «inicia» [«y maneja»] → proceso [→ «, que» → verbo base → objeto]. Invertir el orden cambia qué cosa inicia el proceso.

**Varios eventos**: cada enlace de evento se expresa con su propia oración (R-MOD-NAT-3).

**Efecto con evento**: es admisible porque el afectado pertenece al conjunto de objetos previo al proceso (R-MOD-INPUT-1).

### §5.2 Condición (C*)

**ID**: CT1, CT2, CH1, CH2, CS1–CS6.

- **CT1** (ISO §9.5.3.1, §A.4.5.4): *Proceso* ocurre si **Objeto** existe, en cuyo caso **Objeto** se consume, de lo contrario *Proceso* se omite.
- **CT2** (ISO §9.5.3.1, ISO Tabla 10): *Proceso* ocurre si **Objeto** existe, en cuyo caso *Proceso* afecta **Objeto**, de lo contrario *Proceso* se omite.
- **CH1** (ISO §9.5.3.2, ISO Tabla 11): **Agente** maneja *Proceso* si **Agente** existe, de lo contrario *Proceso* se omite.
- **CH2** (ISO §9.5.3.2, ISO Tabla 11): *Proceso* ocurre si **Instrumento** existe, de lo contrario *Proceso* se omite.
- **CS1** (ISO §9.5.3.3, ISO Tabla 12): *Proceso* ocurre si **Objeto** está en `estado`, en cuyo caso **Objeto** se consume, de lo contrario *Proceso* se omite.
- **CS2** (ISO §9.5.3.3, ISO Tabla 12): *Proceso* ocurre si **Objeto** está en `estado-entrada`, en cuyo caso *Proceso* cambia **Objeto** de `estado-entrada` a `estado-salida`, de lo contrario *Proceso* se omite.
- **CS3** (ISO §9.5.3.3, ISO Tabla 12): *Proceso* ocurre si **Objeto** está en `estado-entrada`, en cuyo caso *Proceso* cambia **Objeto** de `estado-entrada`, de lo contrario *Proceso* se omite.
- **CS4** (ISO §9.5.3.3, ISO Tabla 12): *Proceso* ocurre si **Objeto** existe, en cuyo caso *Proceso* cambia **Objeto** a `estado-salida`, de lo contrario *Proceso* se omite.
- **CS5** (ISO §9.5.3.4, ISO Tabla 13): **Agente** maneja *Proceso* si **Agente** está en `estado`, de lo contrario *Proceso* se omite.
- **CS6** (ISO §9.5.3.4, ISO Tabla 13): *Proceso* ocurre si **Instrumento** está en `estado`, de lo contrario *Proceso* se omite.

**Ramas** (ISO §9.5.3): toda oración de condición tiene rama negativa, introducida por «de lo contrario». La de un enlace transformador tiene además rama positiva, introducida por «en cuyo caso», que expresa el enlace base; la de un enlace habilitador no la tiene (ISO §9.5.3.2).

- **R-COND-RAMA-1** (ISO §9.5.1, §9.5.3.1): la rama negativa de toda oración de condición DEBE ser «de lo contrario *Proceso* se omite»; NO DEBE expresar espera ni una transformación alternativa.
- **R-COND-RAMA-2** (ISO §9.5.3.1, ISO Tabla 10): la rama positiva del consumo DEBE usar la pasiva refleja «**Objeto** se consume», que realiza «Object is consumed»; la forma activa «*Proceso* consume **Objeto**» de ISO Tabla 10 expresa el mismo hecho y también es OPL. Las ramas de efecto y de cambio usan la voz activa con el proceso como sujeto.

  Correcto: `*Procesar* ocurre si **Pedido** existe, en cuyo caso **Pedido** se consume, de lo contrario *Procesar* se omite.`
  Incorrecto: `*Procesar* ocurre si **Pedido** existe, en cuyo caso **Pedido** es consumido, de lo contrario *Procesar* se omite.`

Cada oración de condición tiene además la sintaxis alternativa normativa «Si … entonces …, de lo contrario se omite *Proceso*» que fija R-OPL-COND-ALT-1 (reglas §4.8; ISO §9.5.3); ambas expresan el mismo hecho y son OPL. El Anexo A da para el agente y el instrumento la forma «*Proceso* ocurre si **Objeto** existe, de lo contrario *Proceso* se omite», distinta de la de ISO §9.5.3.2 para el agente; es una incoherencia de la PAS y las dos formas son OPL del mismo hecho (spec-OPL §18).

**Oración**: un enlace transformador (consumo o efecto) o habilitador con modificador de condición se expresa con la oración de condición de su clase: «está en `estado`» cuando el enlace parte de un estado y «existe» cuando parte del objeto (ISO §9.5.3.1, §9.5.3.3). Un abanico con condición se expresa con las oraciones de ISO Tablas 22–23 (spec-OPL §8.1, R-FAN-3).

**Orden**: consumo, efecto e instrumento: proceso → «ocurre si» → objeto → («existe» | «está en» estado) → [«, en cuyo caso» → enlace base] → «, de lo contrario» → proceso → «se omite». Agente: agente → «maneja» → proceso → «si» → agente → («existe» | «está en» estado) → «, de lo contrario» → proceso → «se omite» (ISO §9.5.3.1, §9.5.3.2).

**Varias condiciones**: si varios enlaces de condición llegan al mismo proceso, el proceso ocurre sólo si se cumplen todas y se omite si falta cualquiera, porque la precondición se evalúa sobre el conjunto entero (ISO §9.5.3.1, §12.1).

**Efecto con condición**: es admisible porque el afectado pertenece al conjunto de objetos previo al proceso (R-MOD-INPUT-1).

### §5.3 Excepción: sobretiempo (EX1) y subtiempo (EX2)

- **EX1** (ISO §9.5.4.2, §A.4.5.4): *Manejo* ocurre si duración de *Fuente* excede máx-duración unidades-de-tiempo. — «máx-duración unidades-de-tiempo» es el valor y la unidad de tiempo de la duración máxima de la fuente: `*Escalar* ocurre si duración de *Atender* excede 30 minutos.`
- **EX2** (ISO §9.5.4.3, §A.4.5.4): *Manejo* ocurre si duración de *Fuente* es menor que mín-duración unidades-de-tiempo. — «es menor que» realiza «falls short of».

**Naturaleza**: el enlace de excepción es un enlace de control entre procesos: conecta el proceso fuente con el proceso de manejo y se activa por una desviación de la duración de la fuente (ISO §9.5.1, §9.5.4).

- **R-EXC-DUR-1** (ISO §9.5.4.1–§9.5.4.3): la oración de sobretiempo nombra la duración máxima del proceso fuente y la de subtiempo su duración mínima, con su valor y su unidad de tiempo; la obligación de declararlas es R-EXC-2 y R-EXC-3 (reglas).

**Oración**: el proceso de manejo es el sujeto de «ocurre si duración de» y el proceso fuente su complemento. Un modificador de evento o de condición NO DEBE marcar un enlace de excepción, porque une dos procesos (ISO §9.5.1).

**Orden**: manejo → «ocurre si duración de» → fuente → («excede» | «es menor que») → valor → unidad. El verbo de cota distingue sobretiempo de subtiempo y NO DEBE intercambiarse.

**Ambas excepciones**: una misma fuente PUEDE tener enlace de sobretiempo y de subtiempo (ISO §9.5.4.1); cada uno se expresa con su oración.

### §5.4 Invocación (IV1) y autoinvocación (IV2)

- **IV1** (ISO §9.5.2.5, ISO Tabla 9, §A.4.5.4): *Invocador* invoca *Invocado*.
- Con varios invocados (ISO §12.1, §A.4.5.4): `*Invocador* invoca *Q* y *R*.`
- **IV2** (ISO §9.5.2.5, ISO Tabla 9, §A.4.5.4): *Invocador* se invoca a sí mismo.
- Abanico XOR divergente (ISO Tabla 21): `*P* invoca exactamente uno de *Q* o *R*.`
- Abanico XOR convergente (ISO Tabla 21): `Exactamente uno de *P* o *Q* invoca *R*.`

**Naturaleza**: la invocación es un enlace de evento entre procesos (ISO §9.5.2.5).

- **R-IV-1** = R-INV-1.
- **R-IV-2** (ISO §14.2.2.1, §14.2.2.2): la invocación implícita entre los subprocesos de un proceso descompuesto no tiene oración IV1: la expresa el orden de la oración de descomposición (CX1, CX2), y los subprocesos a la misma altura comienzan en paralelo. Su semántica la rigen R-INV-2, R-INV-2A, R-INV-2B y R-INV-2C (reglas).
- **R-IV-3** (ISO §9.5.1): la invocación NO DEBE llevar modificador de evento ni de condición.

**Oración**: un enlace de invocación entre dos procesos distintos se expresa con «invoca»; si origen y destino son el mismo proceso, con «se invoca a sí mismo». Un abanico de invocación se expresa con la oración de abanico de ISO Tabla 21 (spec-OPL §8.1).

**Orden**: invocador → «invoca» → invocado.

## §6 Enlaces estructurales

Un enlace estructural expresa una relación invariante en el tiempo entre cosas (ISO §10.1): las cuatro relaciones fundamentales —agregación-participación (RF1), exhibición-caracterización (RF2), generalización-especialización (RF3, RX1, RX2, RH1) y clasificación-instanciación (RF4)— y los enlaces estructurales etiquetados unidireccional, bidireccional y recíproco (SE1–SE5), con sus variantes de estado especificado (SSE1–SSE7). Las cosas que une tienen la misma perseverancia, salvo en la exhibición-caracterización (ISO §10.1, §10.3.1). La oración estructural DEBE usar las frases reservadas de spec-OPL §1.1 y §1.3 o la etiqueta del modelador (ISO §A.4.6).

### §6.0 Reglas transversales

- **R-EST-PERS-1** = R-STRF-1.
- **R-EST-PERS-2** = R-STRF-2.
- **R-EST-DIR-1** (ISO Tabla 14, §A.4.6.3, §A.4.6.5, §A.4.6.6): la oración estructural fundamental DEBE tomar como sujeto el todo en la agregación y el exhibidor en la exhibición (sentido directo), y la especialización en la generalización y la instancia en la clasificación (sentido inverso).
- **R-EST-HER-1** (ISO §10.3.4.2, §10.3.5.1): lo que la especialización hereda del general (R-HER-1, reglas) está implícito y no se repite en el OPL (ISO §10.3.5.1 NOTE 4 [informativo]).

### §6.1 Agregación-participación (RF1)

- **RF1** (ISO §10.3.2, §A.4.6.3): **Todo** consta de **Parte1**, **Parte2** y **Parte3**. — con una sola parte: **Todo** consta de **Parte**.
- **RF1i** (ISO §10.3.2, §A.4.6.3): **Todo** consta de **Parte1**, **Parte2** y al menos otra parte. — colección incompleta.
- Con multiplicidad (ISO §11.1): `**Fábrica** consta de 3 **Talleres**.` — la multiplicidad se antepone a cada parte, que puede tener la suya; el todo no lleva multiplicidad (ISO §11.1, §A.4.6.3). La agregación-participación es la única relación fundamental con multiplicidad (ISO §11.2 NOTE 1 [informativo]).

**Oración**: el todo es el sujeto de «consta de» y las partes el complemento (R-EST-DIR-1); las partes se separan por coma y la última se une con «y»/«e» (R-OPL-KW-2). Todas las partes de un mismo todo en el OPD DEBEN enumerarse en una sola oración (ISO §A.4.6.3, §12.1; R-COMP-EJE-3). Las partes heredadas por una especialización están implícitas (R-EST-HER-1).

**Orden**: todo → «consta de» → lista de partes.

### §6.2 Exhibición-caracterización (RF2, RF2b, RF2c, RF5)

- **RF2** (ISO §10.3.3.1, §A.4.6.3): **Exhibidor** exhibe **Atributo1** y **Atributo2**.
- **RF2b** (ISO §10.3.3.1, §A.4.6.3): **Exhibidor** exhibe **Atributo1** así como *Operación1*. — exhibidor objeto: atributos primero.
- **RF2c** (ISO §10.3.3.1, §A.4.6.3): *Exhibidor* exhibe *Operación1* así como **Atributo1**. — exhibidor proceso: operaciones primero (ISO §10.3.3.1 NOTE).
- Exhibición incompleta (ISO §10.3.3.1, §A.4.6.3): **Exhibidor** exhibe **Atributo1** y al menos otro atributo. · **Exhibidor** exhibe *Operación1* y al menos otra operación. · **Exhibidor** exhibe **Atributo1** y al menos otro atributo, así como *Operación1* y al menos otra operación.
- **RF5** (ISO §10.4.1): **Especialización** exhibe **Atributo** en `valor`. — caracterización con estado especificado: la especialización tiene sólo ese valor del atributo discriminante que hereda. [localización] Realiza «Specialized-object exhibits value-name Attribute-Name» con el valor pospuesto.

El Anexo A escribe la frase con coma («, as well as», ISO §A.4.6.3); RF2b y RF2c de reglas §4.10 la escriben sin coma. La gramática (spec-OPL §18) acepta ambas grafías.

**Oración**: el exhibidor es el sujeto de «exhibe» y los rasgos (atributos u operaciones) que lo caracterizan son el complemento (ISO §10.3.3.1); «así como» separa los atributos de las operaciones. Todos los rasgos de un mismo exhibidor en el OPD DEBEN enumerarse en una sola oración (ISO §A.4.6.3; R-COMP-EJE-3). El exhibidor no lleva multiplicidad (ISO §11.1). La exhibición-caracterización es la única relación estructural que puede unir cosas de distinta perseverancia: objeto o proceso que exhibe atributos u operaciones (ISO §10.1, §10.3.3.1). La oración de valor de atributo es otra oración (spec-OPL §2.5).

**Orden**: exhibidor → «exhibe» → atributos [→ «, así como» → operaciones]; si el exhibidor es un proceso, operaciones [→ «, así como» → atributos].

### §6.3 Generalización-especialización (RF3, RF3b, RF3c, RX1, RX2, RH1)

- **RF3** (ISO §10.3.4.1, §A.4.6.5): **Especialización1** y **Especialización2** son **General**. El general PUEDE ir en plural (`son **Vehículos**`, ISO §10.3.4.3 EXAMPLE 1 [informativo]).
- **RF3b** (ISO §10.3.4.1, §A.4.6.5): **Especialización** es un **General**. (objeto) / *Especialización* es *General*. (proceso) — para procesos, sin artículo: *Cazar* es *Recolectar Alimento*.
- Especialización incompleta (ISO §A.4.6.5, §10.3.4.1): **Especialización1**, **Especialización2** y otras especializaciones son **General**. ISO §10.3.4.1 usa además «and at least one other specialization»; ambas formas expresan el mismo hecho.
- **RX1** (ISO §A.4.6.5): **Especial** puede ser o bien **General1** o bien **General2**. — especialización XOR de dos generales.
- **RX2** (ISO §A.4.6.5): **Especial** puede ser uno de **General1**, **General2** o **General3**.
- **RH1** (ISO §10.3.4.2, §A.4.6.5): **Especial** es un **General1** y un **General2**. — herencia múltiple.
- **RF3c** (ISO §A.4.6.5): **A** en `s1` y **A** en `s2` son **B** en `s`. — especialización de estados; en singular: **A** en `s1` es un **B** en `s`; incompleta: **A** en `s1`, **A** en `s2` y otras especializaciones son **B** en `s`. Ambos extremos llevan estado (R-OPL-RF-3). [localización] El estado se pospone al objeto.

**Oración**: la especialización es el sujeto y el general el predicado (R-EST-DIR-1): «son» con varias especializaciones, «es un/una» con una de objeto, «es» con una de proceso. Las variantes XOR (RX1, RX2) y de herencia múltiple (RH1) existen para objetos y para procesos (ISO §A.4.6.5). Lo heredado no se repite (R-EST-HER-1).

- **R-EST-GEN-1** = R-OPL-RF-5. La especialización XOR no se expresa con «son»/«es un», que no son exclusivos, ni con «puede estar», que enumera estados (R-VERB-EST-1).

  Correcto: `**Anfibio** puede ser o bien **Vehículo Terrestre** o bien **Embarcación**.`
  Incorrecto: `**Anfibio** puede estar **Vehículo Terrestre** o **Embarcación**.`

- **R-EST-GEN-2** = R-OPL-RF-6.

**Orden**: especializaciones → («son» | «es un» | «es») → general. XOR: especialización → («puede ser o bien» | «puede ser uno de») → generales.

### §6.4 Clasificación-instanciación (RF4, RF4b)

- **RF4** (ISO §10.3.5.1, §A.4.6.6): **Instancia** es una instancia de **Clase**.
- **RF4b** (ISO §10.3.5.1, §A.4.6.6): **Instancia1** y **Instancia2** son instancias de **Clase**. — también para procesos; corrige la errata «are an instance of» del Anexo A.

**Oración**: la instancia es el sujeto y la clase el complemento (R-EST-DIR-1). La clasificación no tiene forma de colección incompleta (ISO §10.3.5.1 NOTE 3 [informativo], §A.4.6.6; R-STRF-3, reglas). Clase e instancias tienen la misma perseverancia (ISO §10.3.1). Una copia de una cosa en otro OPD no es instancia (R-ENT-INS-1).

**Orden**: instancias → («es una instancia de» | «son instancias de») → clase.

### §6.5 Enlaces etiquetados: unidireccional, bidireccional y recíproco (SE1–SE5)

- **SE1** (ISO §10.2.1, §A.4.6.2): **Origen** etiqueta **Destino**. — unidireccional con etiqueta del modelador.
- **SE2** (ISO §10.2.2, §A.4.6.2): **Origen** se relaciona con **Destino**. — unidireccional con etiqueta nula; con origen plural, «se relacionan con».
- **SE3** (ISO §10.2.3, §A.4.6.2): **Origen** etiqueta-directa **Destino**. / **Destino** etiqueta-inversa **Origen**. — bidireccional con dos etiquetas: dos oraciones, una por sentido.
- **SE4** (ISO §10.2.4, §A.4.6.2): **Origen** y **Destino** son etiqueta. — recíproco con etiqueta.
- **SE5** (ISO §10.2.4, §A.4.6.2): **Origen** y **Destino** se relacionan. — recíproco sin etiqueta («are related»).

**Naturaleza**: el enlace etiquetado expresa una relación definida por el modelador entre dos cosas de la misma perseverancia (ISO §10.1, §10.2). La etiqueta es una frase del modelador que empieza en minúscula (ISO §A.4.2) y funciona como verbo o predicado de la oración; en texto con formato se distingue tipográficamente (ISO §10.2.1 NOTE [informativo]). El modelador PUEDE fijar para su sistema una etiqueta nula por defecto distinta de «se relaciona con» (ISO §10.2.2, §A.4.6.2).

- **R-EST-TAG-1** = R-OPL-SE-2.
- **R-EST-TAG-2** = R-OPL-SE-5.

**Listas y multiplicidad**: una oración etiquetada PUEDE tener una lista bifurcada de destinos, cerrada con «y más», y ordenada con «, ordenados por <criterio>», al que PUEDE seguir «, en esa secuencia» (ISO §A.4.6.2); origen y destinos PUEDEN llevar multiplicidad y una restricción «, donde …» (ISO §11.1, §11.2, §A.4.6.2).

**Orden**: SE1, SE2: origen → etiqueta → destino. SE4, SE5: origen → «y» → destino → («son» etiqueta | «se relacionan»).

### §6.6 Enlaces etiquetados con estado especificado (SSE1–SSE7)

ISO Tabla 15 distingue siete tipos (ISO §10.4.2):

- **SSE1** (ISO §10.4.2.2): **Origen** en `estado` etiqueta **Destino**. — estado en el origen, unidireccional.
- **SSE2** (ISO §10.4.2.3): **Origen** etiqueta **Destino** en `estado`. — estado en el destino, unidireccional.
- **SSE3** (ISO §10.4.2.4): **Origen** en `sa` etiqueta **Destino** en `sb`. — estado en ambos extremos, unidireccional.
- **SSE4** (ISO §10.4.2.5): **Origen** en `sa` etiqueta-directa **Destino**. — y **SSE5** (ISO §10.4.2.5): **Destino** etiqueta-inversa **Origen** en `sa`. — un solo tipo: bidireccional con estado en un extremo, expresado con dos oraciones.
- Bidireccional con estado en ambos extremos (ISO §10.4.2.6): dos oraciones SSE3, una por sentido: **Origen** en `sa` etiqueta-directa **Destino** en `sb`. / **Destino** en `sb` etiqueta-inversa **Origen** en `sa`.
- **SSE7** (ISO §10.4.2.7): **Destino** y **Origen** en `sa` son etiqueta. — recíproco con estado en un extremo.
- **SSE6** (ISO §10.4.2.8): **Origen** en `sa` y **Destino** en `sb` son etiqueta. — recíproco con estado en ambos extremos.

**Oración**: el extremo fijado a un estado lleva «en `estado`» tras su cosa [localización]; el resto de la oración es la del enlace etiquetado correspondiente (spec-OPL §6.5).

- **R-EST-SSE-1** (ISO §10.4.2.5, §10.4.2.7, ISO Tabla 15): un enlace bidireccional o recíproco con estado en un solo extremo DEBE expresarse con SSE4/SSE5 o SSE7, con el estado en el extremo que lo porta, sea origen o destino (ISO §10.4.2.5, §10.4.2.7); ISO Tabla 15 no lista el caso con estado sólo en el destino.

## §7 Gestión de contexto

La gestión de contexto expresa en OPL la relación de refinamiento entre los OPD de un modelo (ISO §14.2.1): los tres pares refinamiento-abstracción son expresión y supresión de estados, despliegue y plegado, y descomposición (in-zooming) y recomposición (out-zooming). Los refinados y sus enlaces son hechos del modelo y obedecen la consistencia de hechos: un hecho de un OPD puede refinar o abstraer otro, nunca contradecirlo (ISO §14.2.3).

### §7.0 Reglas transversales

- **R-CX-1** = R-REF-4.

### §7.1 Descomposición y recomposición (CX1, CX2, CX7, CX8, CX11–CX13)

- **CX1** (ISO §14.2.1.3, §14.2.2.1, §A.4.7.4): *Proceso* se descompone en *P1*, *P2* y *P3*, en esa secuencia. — «se descompone en» realiza «zooms into».
- **CX2** (ISO §14.2.2.2, §A.4.7.4): *Proceso* se descompone en paralelo *P1* y *P2*.
- **CX12** (ISO §14.2.2.2, §A.4.7.4): *Proceso* se descompone en *P1* y en paralelo *P2* y *P3*, en esa secuencia. — tramo secuencial seguido de un grupo paralelo (tercera alternativa del Anexo A, «and parallel»). ISO Figura 49 muestra además grupos paralelos en cualquier posición de la secuencia: *Proceso* se descompone en *P1*, paralelo *P2* y *P3*, y *P4*, en esa secuencia. — la coma ante «y» cierra el grupo paralelo.
- Con objetos internos (ISO §A.4.7.4): *Proceso* se descompone en *P1* y *P2*, en esa secuencia, así como **Objeto Interno**.
- **CX11** (ISO §14.2.1.3, §A.4.7.4): *Proceso* desde SD se descompone en SD1 en *P1*, *P2* y *P3*, en esa secuencia. — descomposición en diagrama nuevo, con OPD padre y OPD hijo; admite las variantes paralela, mixta y con objetos internos.
- **CX13** (ISO §14.2.1.3, §A.4.7.4): **Objeto** se descompone en **O1**, **O2** y **O3**, en esa secuencia. — descomposición de objeto; «en esa secuencia» expresa aquí el orden espacial o lógico de las partes, no un orden temporal (ISO §14.2.1.3). En diagrama nuevo: **Objeto** desde SD se descompone en SD1 en **O1**, **O2** y **O3**, en esa secuencia. PUEDE añadir «, así como» y los procesos internos.
- **CX7** (ISO §A.4.7.5, §3.48): *Proceso* se recompone desde SD1. — recomposición (out-zooming): realiza «is out zoom from» y nombra el OPD hijo.
- **CX8** (ISO §A.4.7.5, §3.49): **Objeto** se recompone desde SD1.

**Oración**: un proceso descompuesto tiene una sola oración de descomposición, con todos sus subprocesos (ISO §A.4.7.4). El orden de la lista lo da la altura del punto superior de cada subproceso en el OPD hijo, de arriba abajo: la disposición vertical denota la invocación implícita entre subprocesos sucesivos y la misma altura denota comienzo en paralelo (ISO §14.2.2.1, §14.2.2.2, §D.4 [informativo]; R-INV-2, R-INV-2A, reglas). «en esa secuencia» marca la secuencia y «paralelo» el grupo que comienza a la vez. La oración de recomposición equivale en OPL al contorno grueso del proceso u objeto cuya descomposición produce un OPD hijo (ISO §A.4.7.5).

**Orden**: proceso → «se descompone en» → [«paralelo»] subprocesos [→ «, en esa secuencia»] [→ «, así como» → objetos internos] (ISO §A.4.7.4).

**Cambio de rol**: un objeto que es instrumento en el OPD abstracto PUEDE figurar como afectado en el OPD descompuesto si el cambio neto del proceso abstracto sobre él es nulo (ISO Tabla 25 NOTE 2 [informativo]; R-ROL-1, reglas).

### §7.2 Despliegue y plegado (CX3, CX5, CX6, CX10)

- **CX3** (ISO §14.2.1.2, §A.4.7.2): **Cosa** se despliega en **T1**, **T2** y **T3**. — despliegue en diagrama nuevo sin especificar relación ni OPD («unfolds into»); con procesos, «así como» separa los atributos.
- **CX10** (ISO §A.4.7.2): **Cosa** desde SD se despliega por partes en SD1 en **T1**, **T2** y **T3**. — formas específicas, con OPD padre y OPD hijo: «por partes», «por rasgos» (atributos [, así como operaciones]), «por especialización» y «por instancias» («part-, feature-, specialization-, instance-unfolds»).
- **CX5** (ISO §A.4.7.3, §3.22): *Proceso* es plegado de SD1.
- **CX6** (ISO §A.4.7.3, §3.22): **Objeto** es plegado de SD1.

**Oración**: el despliegue en el mismo OPD se expresa con la oración estructural de la relación fundamental que aplica («consta de», «exhibe», «son», «son instancias de»; ISO §14.2.1.2, §A.4.7.1), sin oración propia; el despliegue en un OPD nuevo se expresa con CX3. La oración de plegado sólo existe para una cosa cuyo despliegue produce un OPD hijo, nombra ese OPD hijo y equivale en OPL al contorno grueso de la cosa (ISO §A.4.7.3). El OPL de cada OPD expresa sólo los refinados que ese OPD muestra (ISO §14.2.1.2); el despliegue o plegado parcial se expresa como la relación fundamental incompleta correspondiente (ISO §14.2.1.2 NOTE 3, NOTE 4 [informativo]). Los refinados se unen a la cosa desplegada por enlaces estructurales fundamentales (ISO §14.2.1.2).

- **R-CX-DESP-1** = R-REF-MEC-1.
- **R-CX-DESP-2** (ISO §14.2.1.2, §A.4.7.2): la oración de despliegue no lleva marca temporal («en esa secuencia», «paralelo»): el despliegue revela estructura, sin transferencia de control (ISO §14.2.1.2 NOTE 5 [informativo]). La descomposición de objeto (CX13) sí lleva «en esa secuencia», con sentido espacial o lógico.

  Correcto: `**Pedido** se despliega en **Cabecera** y **Línea**.`
  Incorrecto: `**Pedido** se despliega en **Cabecera** y **Línea**, en esa secuencia.`

**Orden**: CX3: cosa → «se despliega en» → refinados; CX10: cosa → «desde» → OPD padre → «se despliega por» relación «en» → OPD hijo → «en» → refinados (ISO §A.4.7.2). Plegado: cosa → «es plegado de» → OPD hijo (ISO §A.4.7.3).

### §7.3 Refinamiento entre OPD (CX4, CX9)

- **CX4** (ISO §14.2.2.6): SD se refina por descomposición de *Proceso* en SD1. — realiza «is refined by in-zooming».
- **CX9** (ISO §14.2.2.6): SD se refina por despliegue de *Proceso* en SD1. — realiza «is refined by unfolding».

Ambas describen la arista del árbol de procesos OPD entre un OPD de nivel n y su refinamiento de nivel n+1.

**Oración**: cada arista del árbol de procesos OPD tiene la semántica de una oración CX4 o CX9 (ISO §14.2.2.6; R-ARB-4, reglas). La OPL del sistema completo es la sucesión de los párrafos OPL de sus OPD (ISO §14.2.2.6; R-OPL-TOTAL-1, reglas). La norma da esta oración sólo para procesos del árbol de procesos; para el árbol de objetos no hay oración (no verificable).

### §7.4 Expresión y supresión de estados (CX-EST)

**ID**: CX-EST.

**Oraciones**: la expresión de estados es un refinamiento y la supresión de estados su abstracción (ISO §14.2.1, §14.2.1.1). Reusa la enumeración de estados (D5, D6) y las designaciones (spec-OPL §2.4). El OPL de un OPD expresa sólo los estados que ese OPD muestra (ISO §14.2.1.1; R-OPL-TOTAL-4, reglas); el conjunto completo de estados de un objeto es la unión de los que aparecen en todos los OPD.

- **R-CX-EST-1** (ISO §7.3.5, §14.2.1.1): la expresión de estados DEBE usar «puede estar» (R-VERB-EST-1); con supresión parcial, la enumeración DEBE terminar en «, y otros estados» (D6; R-OPL-TOTAL-4).
- **R-CX-EST-2** (ISO §14.2.1.1): la supresión de estados en un OPD NO DEBE borrar los estados del modelo; sólo los omite en el párrafo de ese OPD.

### §7.5 Descomposición síncrona y despliegue asíncrono

**ID**: CX-SYNC.

- **R-CX-SYNC-1** = R-REF-SYNC-1. Su oración de descomposición PUEDE llevar orden temporal («en esa secuencia», «paralelo»).
- **R-CX-SYNC-2** = R-CX-DESP-2.

  Correcto: `*Cocinar* se descompone en *Preparar Masa*, *Preparar Relleno* y *Hornear*, en esa secuencia.`
  Correcto: `**Empanada** se despliega en **Masa** y **Relleno**.`
  Incorrecto: `**Empanada** se despliega en **Masa** y **Relleno**, en esa secuencia.`

### §7.6 Distribución de enlaces al descomponer

- **CX-DIST**: ver reglas §8.5.
- **R-CX-DIST-1** = R-DIST-1.
- **R-CX-DIST-2**: ver reglas §8.5.

En el párrafo del OPD hijo, cada enlace distribuido se expresa con el subproceso al que queda conectado: un consumo o un resultado que estaban conectados al proceso padre se anclan por defecto al primer subproceso, y el modelador los reasigna al que consume o genera (ISO §14.2.2.4, subcláusula 14.2.2.4.1): `*Primer Subproceso* consume **X**.` Una herramienta PUEDE fijar automáticamente ese anclaje por defecto, que el modelador modifica (ISO §14.2.2.4, NOTE 2 [informativo]).

#### §7.6.1 Enlaces escindidos

- **R-CX-ESC-1** = R-ESCIND-1.
- **R-CX-ESC-2** = R-ESCIND-2.
- **R-CX-ESC-3** = R-ESCIND-3.
- **R-CX-ESC-4** = R-ESC-1.

La mitad de entrada y la mitad de salida del par escindido se expresan cada una con su propia oración, en el párrafo del OPD descompuesto: *P1* cambia **A** de `s1`. y *P2* cambia **A** a `s2`. (ISO Tabla 25; spec-OPL §3.5, §3.6).

## §8 Abanicos, control, probabilidad y ruta combinados

Esta sección fija la OPL de las construcciones que combinan un enlace procedimental con abanico lógico, estado especificado, modificador de control, multiplicidad, probabilidad o etiqueta de ruta (ISO §11–§13). Cada combinación se expresa con su plantilla; la que la norma no define no tiene OPL canónica (spec-OPL §8.4).

### §8.0 Reglas de combinación

- **R-COMB-2** (ISO §9.5.1): toda combinación que coloca un modificador de evento o de condición sobre un extremo del conjunto de objetos posterior al proceso (resultante, afectado en su estado de salida) es inválida, sea cual sea el abanico, la multiplicidad, la probabilidad o la ruta que la acompañe (R-MOD-INPUT-1).
- **R-COMB-4** (ISO §12.2, §12.7, §13): en una oración que combina varias marcas, cada una ocupa la posición que fija su plantilla: la etiqueta de ruta prefija la oración (spec-OPL §11), el cuantificador precede a la lista del extremo divergente del abanico (R-FAN-2), el estado acompaña a su objeto, el modificador de control reestructura la oración según spec-OPL §5 y la probabilidad sigue a cada cosa del abanico como «con probabilidad p» (R-PROB-3).
- **R-COMB-5** (ISO §13, ISO Figura 44, §12.1): los enlaces del mismo tipo con la misma etiqueta de ruta que salen del mismo proceso o llegan a él DEBEN expresarse en una sola oración con lista bajo el prefijo de ruta: `Por ruta herbívoro, *Preparar Comida* consume **Pepino** y **Tomate**.` La norma no da OPL para un abanico XOR u OR cuyos enlaces llevan etiqueta de ruta (spec-OPL §8.4).
- **R-COMB-6** (ISO §11.1, §11.2): la multiplicidad restringe el número de instancias de un extremo objeto de un enlace; no es modificador de control ni cambia la clase del enlace, y PUEDE combinarse con cualquier enlace que la admita (spec-OPL §10). No se aplica a procesos (ISO §11.2 NOTE 2 [informativo]; R-MULT-1A, reglas).

### §8.1 Abanicos XOR y OR; conjunción AND

**ID**: FAN-XOR, FAN-OR, FAN-AND.

**Naturaleza**: un abanico agrupa dos o más enlaces procedimentales del mismo tipo con un extremo común, el extremo convergente, sobre el mismo objeto o proceso; el otro es el extremo divergente. Su semántica es XOR (exactamente una de las cosas del extremo divergente existe u ocurre) u OR (al menos una) (ISO §12.2). Varios enlaces del mismo tipo que salen de un proceso o llegan a él sin formar abanico tienen semántica AND y no son un abanico (ISO §12.1).

| Operador | Frase OPL | Semántica |
| --- | --- | --- |
| AND | lista con «y» en una sola oración | todas las cosas |
| XOR | «exactamente uno de» | exactamente una cosa del extremo divergente |
| OR | «al menos uno de» | al menos una cosa del extremo divergente |

- **R-FAN-1** (ISO §12.1): la conjunción AND DEBE expresarse con una lista unida por «y» en una sola oración, no con una oración por enlace; NO DEBE inventarse un cuantificador como «todos de».

  Correcto: `*Cocinar* consume **Agua** y **Sal**.`
  Incorrecto: `*Cocinar* consume **Agua**.` seguido de `*Cocinar* consume **Sal**.`
  Incorrecto: `*Cocinar* consume todos de **Agua** y **Sal**.`

- **R-FAN-2** (ISO §12.2, §12.3, ISO Tablas 17–21, §A.4.5.2–§A.4.5.4): un abanico XOR u OR DEBE expresarse en una sola oración con el cuantificador ante la lista de las cosas del extremo divergente, unidas por «o»/«u». Si el extremo divergente está en el sujeto, el cuantificador abre la oración con mayúscula.

  Correcto (consumo convergente XOR): `*Procesar* consume exactamente uno de **A**, **B** o **C**.`
  Correcto (resultado divergente OR): `*Procesar* genera al menos uno de **A**, **B** o **C**.`
  Correcto (efecto con procesos alternativos): `Exactamente uno de *P*, *Q* o *R* afecta **B**.`
  Incorrecto: `**B** afecta a exactamente uno de los procesos *P*, *Q* o *R*.`

  Los abanicos de agente y de instrumento admiten las dos direcciones, un habilitador hacia varios procesos y varios habilitadores hacia un proceso (R-FAN-HAB-1; ISO §12.2, ISO Figura 38, §A.4.5.3). Las oraciones de cada abanico son las de reglas §7.3.

- **R-FAN-3** (ISO §12.5, §12.6, ISO Tablas 22–23): un abanico cuyos enlaces llevan todos modificador de condición DEBE expresarse con la oración de condición de abanico de su clase («Condición, …» de reglas §7.4), con el objeto común y los procesos en el extremo divergente: `Exactamente uno de *P*, *Q* o *R* ocurre si **B** existe, en cuyo caso el proceso que ocurre afecta **B**; de lo contrario, estos procesos se omiten.` La versión con estado sustituye «existe» por «está en `s2`»; la de instrumento usa «requiere que **B** exista» o «requiere que **B** esté en `s2`» [localización: subjuntivo de «requires that B is s2»].
- **R-FAN-4** (ISO §12.5, §12.6, ISO Tablas 22–23, §9.5.1): un abanico cuyos enlaces llevan todos modificador de evento DEBE expresarse con la oración de evento de abanico de su clase («Evento, …» de reglas §7.4): `**B** inicia exactamente uno de *P*, *Q* o *R*, en cuyo caso el proceso que ocurre afecta **B**.` La versión con estado sustituye **B** por **B** en `s2` (ISO Tabla 23). El evento no se aplica a un abanico de resultado (R-COMB-2). Cada abanico XOR con control tiene su contraparte OR, con «al menos uno de» en lugar de «exactamente uno de» (ISO §12.6).

- **R-FAN-5** (ISO §12.4, §A.4.5.2): cada enlace de un abanico PUEDE especificar un estado, con independencia de los demás (R-FAN-EST-1). El abanico conserva el verbo de su clase:

  Correcto (resultado): *P* genera exactamente uno de **Obj** en `s1`, **Obj** en `s2` u **Obj** en `s3`.
  Correcto (efecto, estados de salida alternativos): *P* cambia **Obj** a exactamente uno de `s1`, `s2` o `s3`.
  Correcto (efecto, estados de entrada alternativos): *P* cambia **Obj** de exactamente uno de `s1` o `s2` a `s3`.
  Incorrecto: *P* cambia **Obj** a exactamente uno de `s1`, `s2` o `s3`. como abanico de resultado: «cambia» expresa un efecto, no una creación.

- **R-FAN-5A** (ISO §A.4.5.2, §12.4): un abanico XOR u OR de efectos con el mismo estado de entrada y estados de salida distintos del mismo objeto DEBE expresarse con la entrada común: *P* cambia **Obj** de `entrada` a exactamente uno de `s1`, `s2` o `s3`. (XOR) o `… a al menos uno de …` (OR). La entrada común NO DEBE suprimirse. El Anexo A escribe la variante XOR «to one of», sin «exactly»; ISO §12.2 exige la frase «exactly one of»; ambas expresan el mismo abanico (spec-OPL §18).

  Correcto: *Corregir* cambia **Cobertura** de `insuficiente` a exactamente uno de `suficiente` o `parcial`.
  Incorrecto para este hecho: *Corregir* cambia **Cobertura** a exactamente uno de `suficiente` o `parcial`. — pierde la entrada común y expresa otro abanico.

- **R-FAN-6** = R-PROB-3. Ejemplo: `*P* genera **A** con probabilidad 0.6 o **B** con probabilidad 0.4.` La anotación «Pr=p» es la notación del OPD, no de la OPL.
- **R-FAN-7**: ver reglas §7.5.

### §8.2 Multiplicidad combinada con abanico y control

**ID**: MULT-COMB.

**Frases** (ISO §11.1, ISO Tabla 16, §A.3.2): `?` → «un/una … opcional»; `*` → «… opcionales» con el nombre en plural; `1..1` → sin marca; `+` → «al menos un/una»; rango «qmín a qmáx» y varios rangos unidos por «o»; los rangos son cerrados (spec-OPL §10).

- **R-MULT-COMB-1** = R-OPL-PART-1. Ejemplos: `2 **Agentes** manejan *P*.`, `*P* genera 3 **Productos**.`
- **R-MULT-COMB-3** = R-MULT-2.

### §8.3 Combinaciones y su OPL

Para cada combinación con relevancia semántica: su validez según ISO, la oración OPL y la regla que la funda.

| # | Combinación | Validez (ISO) | Oración OPL | Fundamento |
| --- | --- | --- | --- | --- |
| C-01 | consumo × evento | válida | `**A** inicia *P*, que consume **A**.` | ISO §9.5.2.1; ET1 |
| C-02 | consumo × condición | válida | `*P* ocurre si **A** existe, en cuyo caso **A** se consume, de lo contrario *P* se omite.` | ISO §9.5.3.1; CT1 |
| C-03 | resultado × evento | inválida | — | ISO §9.5.1; R-COMB-2 |
| C-04 | resultado × condición | inválida | — | ISO §9.5.1; R-COMB-2 |
| C-05 | efecto × evento | válida | `**A** inicia *P*, que afecta **A**.` | ISO §9.5.2.1; ET2 |
| C-06 | efecto × condición | válida | `*P* ocurre si **A** existe, en cuyo caso *P* afecta **A**, de lo contrario *P* se omite.` | ISO §9.5.3.1; CT2 |
| C-07 | agente × evento | válida | `**Agente** inicia y maneja *P*.` | ISO §9.5.2.2; EH1 |
| C-08 | agente × condición | válida | `**Agente** maneja *P* si **Agente** existe, de lo contrario *P* se omite.` | ISO §9.5.3.2; CH1 |
| C-09 | instrumento × evento | válida | `**Instrumento** inicia *P*, que requiere **Instrumento**.` | ISO §9.5.2.2; EH2 |
| C-10 | instrumento × condición | válida | `*P* ocurre si **Instrumento** existe, de lo contrario *P* se omite.` | ISO §9.5.3.2; CH2 |
| C-11 | consumo × XOR convergente | válida | `*P* consume exactamente uno de **A**, **B** o **C**.` | ISO Tabla 17; R-FAN-2 |
| C-12 | consumo × OR convergente | válida | `*P* consume al menos uno de **A**, **B** o **C**.` | ISO Tabla 17; R-FAN-2 |
| C-13 | resultado × XOR/OR divergente | válida | `*P* genera exactamente uno de **A**, **B** o **C**.` · `*P* genera al menos uno de **A**, **B** o **C**.` | ISO Tabla 18; R-FAN-2 |
| C-14 | efecto × XOR/OR | válida | `*P* afecta exactamente uno de **A**, **B** o **C**.` · `Exactamente uno de *P*, *Q* o *R* afecta **B**.` | ISO Tabla 19; R-FAN-2 |
| C-15 | agente × XOR/OR divergente | válida | `**Agente** maneja exactamente uno de *P*, *Q* o *R*.` | ISO Tabla 20; R-FAN-2 |
| C-16 | instrumento × XOR/OR divergente | válida | `Exactamente uno de *P*, *Q* o *R* requiere **B**.` | ISO Tabla 20; R-FAN-2 |
| C-17 | invocación × XOR/OR | válida | `*P* invoca exactamente uno de *Q* o *R*.` · `Exactamente uno de *P* o *Q* invoca *R*.` | ISO Tabla 21; R-FAN-2 |
| C-18 | consumo, agente o instrumento × condición × XOR/OR | válida | oraciones de R-FAN-3 | ISO §12.5, §12.6, ISO Tablas 22–23 |
| C-19 | efecto × evento × XOR/OR | válida | `**B** inicia exactamente uno de *P*, *Q* o *R*, en cuyo caso el proceso que ocurre afecta **B**.` | ISO Tabla 22; R-FAN-4 |
| C-19b | consumo, agente o instrumento × evento × XOR/OR | válida | `**B** inicia exactamente uno de *P*, *Q* o *R*, que consume **B**.` · `**B** inicia y maneja exactamente uno de *P*, *Q* o *R*.` · `**B** inicia exactamente uno de *P*, *Q* o *R*, que requiere **B**.` | ISO §12.5, §12.6, ISO Tabla 23; R-FAN-4 |
| C-20 | resultado × condición × XOR/OR | inválida | — | ISO §9.5.1; R-COMB-2 |
| C-21 | resultado, consumo o efecto × XOR/OR con estado por rama | válida | el abanico conserva su verbo: R-FAN-5 | ISO §12.4; R-FAN-5, R-FAN-EST-1 |
| C-21b | efecto × XOR/OR con entrada común y salidas distintas | válida | *P* cambia **Obj** de `s0` a exactamente uno de `s1`, `s2` o `s3`. | ISO §A.4.5.2; R-FAN-5A |
| C-22 | resultado × XOR divergente × probabilidad | válida | `*P* genera **A** con probabilidad 0.6 o **B** con probabilidad 0.4.` | ISO §12.7; R-PROB-3 |
| C-23 | cualquier enlace × probabilidad sin abanico XOR divergente | sin OPL en ISO | — | ISO §12.7; spec-OPL §8.4 |
| C-24 | enlaces del mismo tipo × ruta | válida | `Por ruta L1, *P* consume **A** y **B**.` | ISO §13, ISO Figura 44; R-COMB-5 |
| C-25 | agente o instrumento × ruta | válida | `Por ruta L1, **A** maneja *P*.` | ISO §13; R-OPL-RUTA-2 |
| C-27 | estructural × evento o condición | inválida | — | ISO §9.5.1, §10.1; R-MOD-CAT-1 |
| C-28 | invocación × evento o condición | inválida | — | ISO §9.5.1; R-IV-3 |
| C-29 | mitad de entrada del par escindido × evento o condición | sin versión con control | — | ISO Tabla 25 NOTE 1 [informativo]; R-MOD-CAT-2 |
| C-30 | dos enlaces procedimentales entre el mismo objeto y el mismo proceso | inválida en un OPD; al abstraer, prevalece uno | — | ISO §8.1.2, §14.2.4; spec-OPL §8.3.1 |
| C-31 | recomposición de subprocesos con distinto rol hacia el mismo objeto | resolución por precedencia | — | ISO §14.2.4, ISO Tabla 27; spec-OPL §8.3.1 |
| C-32 | resultado × XOR/OR convergente | válida | `Exactamente uno de *P*, *Q* o *R* genera **B**.` · `Al menos uno de *P*, *Q* o *R* genera **B**.` | ISO Tabla 17; R-FAN-2 |
| C-33 | consumo × XOR/OR divergente | válida | `Exactamente uno de *P*, *Q* o *R* consume **B**.` · `Al menos uno de *P*, *Q* o *R* consume **B**.` | ISO Tabla 18; R-FAN-2 |
| C-34 | agente × XOR/OR convergente | válida | `Exactamente uno de **A** o **B** maneja *P*.` · `Al menos uno de **A** o **B** maneja *P*.` | ISO §12.2, ISO Figura 38, §A.4.5.3; R-FAN-2 |
| C-35 | instrumento × XOR/OR convergente | válida | `*P* requiere exactamente uno de **A** o **B**.` · `*P* requiere al menos uno de **A** o **B**.` | ISO §A.4.5.3; R-FAN-2 |

#### §8.3.1 Colisión de rol y precedencia al recomponer

La resolución de la colisión de enlaces al abstraer y la precedencia de enlaces al recomponer son reglas de validez: ver reglas §6.5 y §6.6 (ISO §14.2.4, ISO Tabla 27; no verificable: depende de figuras ausentes en la fuente). La OPL expresa el enlace que resulta de esa resolución.

### §8.4 Combinaciones sin OPL en ISO

- La probabilidad de un enlace fuera de un abanico XOR divergente: ISO §12.7 sólo la define dentro de él (C-23).
- Un abanico XOR u OR cuyos enlaces llevan etiqueta de ruta: ISO §13 no da su oración (R-COMB-5).
- La combinación de evento y condición sobre un mismo enlace: ISO §9.5.1 no la define (R-§21-OPL-MOD).

Un abanico de resultado con condición no es un silencio sino una combinación inválida (C-20).

## §9 Composición AND en una oración

Varios enlaces del mismo tipo que salen de un mismo proceso o llegan a él tienen semántica AND, y su sintaxis DEBE ser una sola oración con «y», no una oración por enlace (ISO §12.1). Del mismo modo, los refinados de una misma relación estructural fundamental con el mismo vértice se enumeran en una sola oración bifurcada (ISO §A.4.6). Esta sección fija esa composición; los abanicos XOR y OR son spec-OPL §8.1.

### §9.1 Ejes de composición

| Eje | Patrón | Plantilla |
| --- | --- | --- |
| (b) lista tras un verbo | un sujeto y un verbo, varios complementos del mismo tipo de enlace | `**A** consta de **B**, **C** y **D**.` · `*P* consume **A**, **B** y **C**.` |
| (c) sujeto lista | varios agentes de un proceso; varias especializaciones o instancias de un general o una clase | `**A** y **B** manejan *P*.` · `**A** y **B** son **G**.` |
| (e) abanico XOR u OR | cuantificador ante la lista del extremo divergente | `*P* consume exactamente uno de **A**, **B** o **C**.` (spec-OPL §8.1) |

- **R-COMP-EJE-1** = R-OPL-LISTA-1. Además de las comas que R-OPL-LISTA-1 admite, la forma mixta de descomposición de ISO Figura 49 lleva coma ante «y» para cerrar un grupo paralelo (spec-OPL §7.1).

  Correcto: `*P* consume **A**, **B** y **C**.`
  Incorrecto: `*P* consume **A**, **B**, y **C**.`

- **R-COMP-EJE-3** (ISO §12.1, §10.3.2, §10.3.3, §10.3.4, §A.4.5, §A.4.6): los enlaces del mismo tipo que comparten proceso (procedimentales AND: consumo, resultado, efecto, cambio, agente, instrumento, invocación) o vértice (estructurales fundamentales) DEBEN expresarse en una sola oración con lista. La gramática del Anexo A no coordina en una oración enlaces de tipos distintos (ISO §A.4.5); una oración que los coordine no es OPL canónica y, si un producto la ofrece, es una presentación fuera del canon (R-COMP-CFG-1).

  Correcto: `**Auto** consta de **Motor**, **Chasis** y **Rueda**.`
  Correcto: `*Abrir Caja Fuerte* requiere **Llave A**, **Llave B** y **Llave C**.`
  Correcto: *Subir Tasa* cambia **Tipo de Cambio** de `bajo` a `alto`, **Índice de Precios** de `bajo` a `alto` y **Tasa de Interés** de `baja` a `alta`.

- **R-COMP-EJE-4** (ISO §12.1, §A.4.5.3, §A.4.6.5, §A.4.6.6): el sujeto lista DEBE usarse cuando varios agentes manejan el mismo proceso y cuando varias especializaciones o instancias comparten general o clase; no existe para consumo, resultado, efecto ni instrumento, cuyo sujeto es el proceso. La única excepción es la lista de procesos que requieren un mismo instrumento [informativo] (spec-OPL §4.2).
- **R-COMP-EJE-5** (ISO §12.2): la coordinación XOR u OR es el abanico de spec-OPL §8.1; esta sección no redefine su cuantificador.

### §9.3 Composición y refinamiento

- **R-COMP-ZP-1** (ISO §10.3.4, §A.4.6.5, §14.2.1.2): las especializaciones de un mismo general en un OPD DEBEN expresarse con una sola oración (`**Auto** y **Camión** son **Vehículo**.`); el despliegue en el mismo OPD no añade otra oración, porque equivale a la oración estructural (ISO §14.2.1.2). Lo mismo vale para partes, rasgos e instancias.

### §9.5 Oración canónica

- **R-COMP-CFG-1** (ISO §12.1, §6.2.1): para enlaces AND del mismo tipo, la OPL canónica es una sola oración con lista (R-COMP-EJE-3); una presentación de una oración por enlace no es OPL conforme y, si un producto la ofrece, es una vista fuera del canon.

## §10 Multiplicidad de objetos

La multiplicidad de un objeto restringe el número de instancias operacionales del objeto en un extremo de enlace: no es una cosa, ni un enlace, ni un modificador de control (ISO §11.1). Sin multiplicidad, cada extremo designa una sola instancia operacional (ISO §11.1).

### §10.1 Símbolo, rango y frase OPL-ES

| Símbolo | Rango | Significado | Frase OPL-ES | ISO |
| --- | --- | --- | --- | --- |
| `?` | `0..1` | cero o uno | `un/una **Objeto** opcional` | ISO §11.1, ISO Tabla 16 («an optional») |
| `*` | `0..*` | cero o más | `**Objetos** opcionales` | ISO §11.1, ISO Tabla 16 («optional») |
| (ninguno) | `1..1` | exactamente uno | sin frase | ISO §11.1, ISO Tabla 16 |
| `+` | `1..*` | uno o más | `al menos un/una **Objeto**` | ISO §11.1, ISO Tabla 16 («at least one») |
| entero o parámetro | `n`, `k` | n, k instancias | `3 **Objetos**`, `k **Objetos**` | ISO §11.1 |
| rango | `qmín..qmáx` | entre qmín y qmáx | `2 a 4 **Objetos**` | ISO §11.1 |
| varios rangos | `3..5, 8..10` | en alguno de los rangos | `3 a 5 o 8 a 10 **Objetos**` | ISO §11.1 |
| — | — | plural sin cota declarada | `muchos/muchas **Objetos**` | ISO §A.3.2, ISO Figura 33 [informativo] |

[localización] «opcional» y «opcionales» se posponen al nombre, como adjetivo español; el hecho es el de la frase de ISO antepuesta. Al abrir la oración, la frase lleva mayúscula inicial: `Un **Ingeniero** opcional maneja *Inspeccionar*.` (ISO §A.3.2).

- **R-MULT-1**: ver reglas §6.7.
- **R-MULT-1A**: ver reglas §6.7.
- **R-MULT-1B**: ver reglas §6.7.
- **R-MULT-1C**: ver reglas §6.7.
- **R-MULT-2**: ver reglas §6.7.

La realización textual es la de R-OPL-PART-1 (reglas): la multiplicidad (frase, entero, parámetro o rango) va antes del nombre del objeto, que va en plural si admite más de una instancia; «opcional» y «opcionales» van tras el nombre (spec-OPL §10.1). Los símbolos del OPD no aparecen en la OPL.

  Correcto: `*Cocinar* requiere al menos una **Olla**.`
  Incorrecto: `*Cocinar* requiere 1..* **Olla**.`

### §10.2 Rangos, expresiones y restricciones

Los rangos, enteros, parámetros y expresiones aritméticas de multiplicidad los fija R-MULT-4 (reglas; ISO §11.1, §11.2): los rangos son cerrados, «..» se lee «a» y la coma entre rangos «o» (`**Centro de Mecanizado** controla 3 a 5 o 8 a 10 **Máquinas**.`). La restricción de multiplicidad va en la OPL tras el objeto al que se aplica, con la forma «, donde <restricción>» (ISO §11.2; R-OPL-RANGO-2, R-OPL-RANGO-3, R-OPL-CONJ-1): `**Avión** consta de **Cuerpo**, 2 **Alas** y e **Motores**, donde e >= 1.` Las expresiones aritméticas usan `+`, `-`, `*`, `/`, `(` y `)` con su lectura habitual (`2 o 3*n **Máquinas**, donde n <= 4`); si un parámetro tiene varias restricciones, se separan por punto y coma (ISO §11.2).

La multiplicidad combinada con abanicos y control es spec-OPL §8.2. La multiplicidad de un objeto con unidad de medida cuenta unidades de esa medida (ISO §11.1 NOTE 2 [informativo]).

## §11 Etiquetas de ruta [informativo]

Una etiqueta de ruta es una propiedad de un enlace procedimental que alinea un par de enlaces: cuando la precondición del proceso usa enlaces con etiqueta de ruta y el conjunto posterior admite varios destinos, el destino es el del enlace con la misma etiqueta (ISO §13). La norma no da EBNF de rutas (ISO §A.1); su OPL sólo consta en un ejemplo (ISO §13 EXAMPLE 2, ISO Figura 44), por lo que las plantillas de esta sección son [informativo].

### §11.1 Plantillas

| Plantilla |
| --- |
| `Por ruta etiqueta, *Proceso* consume **Objeto**.` |
| `Por ruta etiqueta, *Proceso* genera **Objeto**.` |
| `Por ruta etiqueta, <oración procedimental>.` |

[localización] «Por ruta» realiza «Following path»; la etiqueta prefija la oración y una coma la separa del resto. Bajo una misma etiqueta, los enlaces del mismo tipo forman una lista (R-COMB-5): `Por ruta herbívoro, *Preparar Comida* consume **Pepino** y **Tomate**.`

- **R-OPL-RUTA-1** [informativo] (ISO §13): la oración de un enlace con etiqueta de ruta DEBERÍA comenzar con la frase fija «Por ruta <etiqueta>,», sin flexión ni sinónimos.

  Correcto: `Por ruta rápida, *Cocinar* consume **Agua**.`
  Incorrecto: `Por la ruta rápida, *Cocinar* consume **Agua**.`

- **R-OPL-RUTA-2** [informativo] (ISO §13): la etiqueta de ruta es una propiedad del enlace procedimental, puesta por el modelador; los enlaces con la misma etiqueta se corresponden (entrada y salida de una misma ruta), y una etiqueta de ruta PUEDE anotar cualquier enlace procedimental, cuya oración se prefija con «Por ruta <etiqueta>,».

El emparejamiento por etiqueta de ruta es R-VIS-RUTA-1 (reglas; ISO §13).

## §12 OPL por OPD

Cada OPD tiene un párrafo OPL equivalente, y la OPL del modelo es el conjunto de esos párrafos (ISO §6.2.1, §A.4.1). La equivalencia entre OPD y OPL y la consistencia de hechos entre OPD son principios de reglas §9 (ISO §6.2.1, §14.2.3); esta sección fija su realización textual.

### §12.1 Párrafo de cada OPD

- **R-OPL-DISP-1** = R-BI-DUAL-1. El párrafo es una oración por línea, cada una terminada en punto (R-OPL-EBNF-4, R-OPL-EBNF-5); el orden de los párrafos es el de la OPL del sistema completo (R-OPL-TOTAL-1).

### §12.2 Hechos refinados en el OPD abstracto

- **R-OPL-DISP-3** (ISO §6.2.1, §14.2.1.2, §14.2.3, §A.4.7.3, §A.4.7.5): el párrafo de cada OPD DEBE expresar sólo los hechos visibles en ese OPD y no contradecir los de los demás párrafos. En el OPD más abstracto, la cosa refinada en un OPD nuevo lleva su oración de plegado (CX5, CX6) o de recomposición (CX7, CX8), que equivale a su contorno grueso; los hechos de sus refinados se expresan en el párrafo del OPD hijo.

## §18 EBNF de OPL-ES

Esta gramática traduce al español, producción a producción, la sintaxis formal OPL del Anexo A de ISO 19450 (ISO §A.1–§A.4), con la notación de ISO/IEC 14977 que fija ISO §A.3.1: «,» concatena, «|» separa alternativas y la concatenación liga más que la alternativa; «[ ]» es opcional, «{ }» repetición y «? ?» secuencia especial. Los nombres de las producciones van en español. Cada desviación del Anexo A lleva un comentario: `(* [localización] … *)` para una decisión de la realización española, `(* errata ISO: … *)` para una corrección de una errata evidente del Anexo A y `(* fuera del Anexo A: ISO §n *)` para una construcción que la norma fija en su texto sin EBNF (ISO §A.1 declara la EBNF incompleta). La gramática opera sobre el texto sin marcas tipográficas (Convenciones) y sobregenera como la del Anexo A: la validez de cada oración la deciden reglas y spec-OPL §2–§12.

```ebnf
(* ===== ISO §A.3.2 — Declaraciones base ===== *)
digito_no_cero = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' ;
digito_decimal = '0' | digito_no_cero ;
entero_positivo = digito_no_cero, { digito_decimal } ;
numero_real_positivo = { digito_decimal }, '.', digito_decimal, { digito_decimal } ;
letra_mayuscula = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M'
    | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'
    | 'Á' | 'É' | 'Í' | 'Ó' | 'Ú' | 'Ü' | 'Ñ' ;          (* [localización] Á…Ñ; ISO sólo A–Z *)
letra_minuscula = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm'
    | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'
    | 'á' | 'é' | 'í' | 'ó' | 'ú' | 'ü' | 'ñ' ;          (* [localización] á…ñ; ISO sólo a–z *)
letra = letra_mayuscula | letra_minuscula ;
caracter_de_cadena = letra | digito_decimal | '-' | '|' | '&' | '/' | ' ' ;
nombre = letra, { caracter_de_cadena } ;
palabra_capitalizada = letra_mayuscula, { caracter_de_cadena } ;
palabra_no_capitalizada = letra_minuscula, { caracter_de_cadena } ;
frase_no_capitalizada = palabra_no_capitalizada, { " ", ( palabra_no_capitalizada | palabra_capitalizada ) } ;
identificador_de_tipo = "boolean" | "string" | tipo_numerico | "enumerated" ;
prefijo = "unsigned " ;                                   (* errata ISO: «unsigned» sin espacio deriva «unsignedinteger» *)
tipo_numerico = ( [ prefijo ], "integer" ) | "float" | "double" | "short" | "long" ;
limite_de_multiplicidad = entero_positivo | numero_real_positivo
    | nombre ;                                            (* fuera del Anexo A: ISO §11.1, parámetro *)
rango_de_multiplicidad = "0" | ( limite_de_multiplicidad, [ " a ", limite_de_multiplicidad ] ) ;   (* «to» → «a» *)
multiplicidad_de_objeto = singular_minuscula | singular_mayuscula | plural_minuscula | plural_mayuscula
    | rango_de_multiplicidad
    | rango_de_multiplicidad, { ", ", rango_de_multiplicidad }, " o ", rango_de_multiplicidad ;  (* fuera del Anexo A: ISO §11.1, varios rangos *)
(* «lower/upper» del Anexo A = minúscula/mayúscula inicial (esta última al abrir la oración) *)
singular_minuscula = "un" | "una" | "al menos un" | "al menos una" ;
singular_mayuscula = "Un" | "Una" | "Al menos un" | "Al menos una" ;
plural_minuscula = "muchos" | "muchas" ;
plural_mayuscula = "Muchos" | "Muchas" ;
marca_opcional = " opcional" | " opcionales" ;
    (* [localización] «an optional» = «un/una … opcional»; «optional» = «… opcionales»: el adjetivo se pospone *)
expresion_de_restriccion = ", donde ", nombre,
    ( ( operacion_logica, nombre_de_valor )
    | ( inicio_de_conjunto, ( nombre | nombre_de_valor ), { ",", ( nombre | nombre_de_valor ) }, fin_de_conjunto ) ) ;
    (* ISO §11.2 escribe «, where»; el Anexo A omite la coma *)
clausula_de_rango = " es ", nombre_de_valor
    | " varía de ", nombre_de_valor, " a ", nombre_de_valor ;
operacion_logica = "=" | "<" | ">" | "<=" | ">=" ;
inicio_de_conjunto = " en {" ;
fin_de_conjunto = "}" ;

(* ===== ISO §A.3.3 — Secuencias especiales ===== *)
salto_de_linea = ? secuencia de la aplicación que produce un salto de línea y vuelve al primer carácter ? ;
unidad_de_medida = nombre ;      (* concreta ? toda medida especificada o comúnmente entendida de tiempo, espacio, cantidad o calidad ? *)
nombre_de_valor = nombre | numero_decimal ;   (* concreta ? número o nombre adecuado a la unidad de medida asociada ? *)
numero_decimal = [ "-" ], ( "0" | entero_positivo ), [ ".", digito_decimal, { digito_decimal } ] ;
nombre_singular_de_objeto = palabra_capitalizada, { " ", ( palabra_capitalizada | palabra_no_capitalizada ) } ;
    (* concreta ? sintagma nominal singular con mayúscula inicial ?; [localización] artículos y preposiciones en minúscula *)
nombre_plural_de_objeto = palabra_capitalizada, { " ", ( palabra_capitalizada | palabra_no_capitalizada ) } ;
    (* ? sintagma nominal plural con mayúscula inicial ? *)
nombre_singular_de_proceso = palabra_capitalizada, { " ", ( palabra_capitalizada | palabra_no_capitalizada ) } ;
    (* ? sintagma con gerundio o sintagma nominal singular, con mayúscula inicial ?; [localización] infinitivo o sustantivo deverbal *)
nombre_plural_de_proceso = palabra_capitalizada, { " ", ( palabra_capitalizada | palabra_no_capitalizada ) } ;
etiqueta_de_opd = "SD", [ entero_positivo, { ".", entero_positivo } ] ;
    (* concreta parent OPD y child OPD con la etiqueta de ISO §14.2.2.6 *)
opd_padre = etiqueta_de_opd ;     (* OPD desde el que se descompone o despliega en diagrama nuevo *)
opd_hijo = etiqueta_de_opd ;      (* OPD resultante *)
duracion_maxima = nombre_de_valor, " ", unidad_de_medida ;   (* errata ISO: la secuencia especial es valor y unidad de tiempo, no el literal «time units» *)
duracion_minima = nombre_de_valor, " ", unidad_de_medida ;

(* ===== ISO §A.4.1 — Estructura del documento ===== *)
parrafo_opl = oracion_opl, { salto_de_linea, oracion_opl } ;
oracion_opl = oracion_formal_opl, "." ;
oracion_formal_opl = oracion_de_descripcion_de_cosa
    | oracion_procedimental
    | oracion_estructural
    | oracion_de_gestion_de_contexto ;

(* ===== ISO §A.4.2 — Identificadores ===== *)
identificador_de_objeto = nombre_singular_de_objeto, [ " en ", unidad_de_medida ], [ clausula_de_rango ]
    | nombre_singular_de_objeto, " objeto", [ " en ", unidad_de_medida ], [ clausula_de_rango ]
    | nombre_plural_de_objeto, " en ", unidad_de_medida, [ clausula_de_rango ]
    | nombre_plural_de_objeto, " objetos", [ " en ", unidad_de_medida ], [ clausula_de_rango ] ;
identificador_de_proceso = nombre_singular_de_proceso
    | nombre_singular_de_proceso, " proceso"
    | nombre_plural_de_proceso
    | nombre_plural_de_proceso, " procesos" ;
identificador_de_cosa = identificador_de_objeto | identificador_de_proceso ;
identificador_de_estado = palabra_no_capitalizada ;
expresion_de_etiqueta = frase_no_capitalizada ;

(* ===== ISO §A.4.3 — Listas ===== *)
(* [localización] « and » → « y » | « e »; « or » → « o » | « u » (R-VERB-KW-2). errata ISO: el Anexo A no deja espacio tras la coma *)
conjuncion_y = " y " | " e " ;
conjuncion_o = " o " | " u " ;
lista_de_procesos = identificador_de_proceso
    | identificador_de_proceso, { ", ", identificador_de_proceso }, conjuncion_y, identificador_de_proceso ;
lista_o_de_procesos = identificador_de_proceso
    | identificador_de_proceso, { ", ", identificador_de_proceso }, conjuncion_o, identificador_de_proceso ;
lista_xor_de_procesos_al_inicio = "Uno de ", lista_o_de_procesos ;
lista_xor_de_procesos_al_final = "uno de ", lista_o_de_procesos ;   (* errata ISO: «one of» sin espacio *)
lista_de_objetos = identificador_de_objeto
    | identificador_de_objeto, { ", ", identificador_de_objeto }, conjuncion_y, identificador_de_objeto ;
objeto_con_opcion_de_estado = identificador_de_objeto, [ " en ", identificador_de_estado ] ;
    (* [localización] ISO antepone el estado («s1 B»); OPL-ES lo pospone («B en s1») *)
lista_de_objetos_con_opcion_de_estado = objeto_con_opcion_de_estado
    | objeto_con_opcion_de_estado, { ", ", objeto_con_opcion_de_estado }, conjuncion_y, objeto_con_opcion_de_estado ;
lista_o_de_objetos = objeto_con_opcion_de_estado
    | objeto_con_opcion_de_estado, { ", ", objeto_con_opcion_de_estado }, conjuncion_o, objeto_con_opcion_de_estado ;
lista_o_de_objetos_sin_estados = identificador_de_objeto
    | identificador_de_objeto, { ", ", identificador_de_objeto }, conjuncion_o, identificador_de_objeto ;
lista_xor_de_objetos_al_inicio = "Uno de ", lista_o_de_objetos ;
lista_xor_de_objetos_al_final = "uno de ", lista_o_de_objetos ;
lista_xor_de_objetos_sin_estados_al_final = "uno de ", lista_o_de_objetos_sin_estados ;
    (* errata ISO: el Anexo A usa la lista con «and»; ISO Tabla 19 usa «or» *)
lista_de_estados = identificador_de_estado
    | identificador_de_estado, { ", ", identificador_de_estado }, conjuncion_y, identificador_de_estado ;
lista_o_de_estados = identificador_de_estado
    | identificador_de_estado, { ", ", identificador_de_estado }, conjuncion_o, identificador_de_estado ;
lista_xor_de_estados_al_final = "uno de ", lista_o_de_estados ;
(* fuera del Anexo A: ISO §11.1 c) — multiplicidad en los extremos objeto de los enlaces procedimentales *)
objeto_procedimental = [ multiplicidad_de_objeto, " " ], objeto_con_opcion_de_estado, [ marca_opcional ] ;
lista_de_objetos_procedimentales = objeto_procedimental
    | objeto_procedimental, { ", ", objeto_procedimental }, conjuncion_y, objeto_procedimental ;
objeto_con_multiplicidad = [ multiplicidad_de_objeto, " " ], identificador_de_objeto, [ marca_opcional ] ;
lista_de_objetos_con_multiplicidad = objeto_con_multiplicidad
    | objeto_con_multiplicidad, { ", ", objeto_con_multiplicidad }, conjuncion_y, objeto_con_multiplicidad ;
cuantificador_de_abanico = "exactamente uno de " | "al menos uno de " ;
cuantificador_de_abanico_inicial = "Exactamente uno de " | "Al menos uno de " ;

(* ===== ISO §A.4.4 — Descripción de cosas ===== *)
oracion_de_descripcion_de_cosa = oracion_de_propiedades_genericas
    | oracion_de_descripcion_de_tipo
    | oracion_de_descripcion_de_estado ;
oracion_de_propiedades_genericas = identificador_de_cosa, " es ",
    ( propiedad_generica
    | propiedad_generica, conjuncion_y, propiedad_generica
    | propiedad_generica, ", ", propiedad_generica, conjuncion_y, propiedad_generica ) ;
    (* errata ISO: [essence] [affiliation] [perseverance] sin separador; a lo sumo un valor de cada propiedad; R-ENT-3 *)
propiedad_generica = esencia | afiliacion | perseverancia ;
esencia = "física" | "físico" | "informacional" ;                (* [localización] concordancia de género *)
afiliacion = "sistémica" | "sistémico" | "ambiental" ;
perseverancia = "persistente" | "transitoria" | "transitorio" ;
oracion_de_descripcion_de_tipo = identificador_de_objeto, " es de tipo ", identificador_de_tipo ;
oracion_de_descripcion_de_estado = oracion_de_enumeracion_de_estados
    | oracion_de_estados_iniciales
    | oracion_de_estados_finales
    | oracion_de_estado_por_defecto
    | oracion_de_estados_combinada ;
oracion_de_enumeracion_de_estados = identificador_de_objeto, " está en ", identificador_de_estado    (* [localización] «is s» *)
    | identificador_de_objeto, " puede estar ", identificador_de_estado, { ", ", identificador_de_estado },
      conjuncion_o, identificador_de_estado
      (* el Anexo A escribe « and »; los ejemplos de ISO, «or» *)
    | identificador_de_objeto, " puede estar ", identificador_de_estado, { ", ", identificador_de_estado },
      ", y otros estados" ;
      (* D6: «, and other states»; ISO §14.2.1.1 escribe «or other states», variante no adoptada [informativo] *)
oracion_de_estados_iniciales = "Estado ", identificador_de_estado, " de ", identificador_de_objeto, " es inicial"
    | "Estados ", lista_de_estados, " de ", identificador_de_objeto, " son iniciales"
    | "Estado ", identificador_de_estado, " de ", identificador_de_objeto, " es inicial y final" ;
      (* la última: fuera del Anexo A, ISO Tabla 25 EXAMPLE 2 [informativo] *)
oracion_de_estados_finales = "Estado ", identificador_de_estado, " de ", identificador_de_objeto, " es final"
    | "Estados ", lista_de_estados, " de ", identificador_de_objeto, " son finales" ;
oracion_de_estado_por_defecto = "Estado ", identificador_de_estado, " de ", identificador_de_objeto, " es por defecto" ;
oracion_de_estados_combinada = identificador_de_objeto, " está inicialmente en ", identificador_de_estado,
    { conjuncion_y, identificador_de_estado }, " y finalmente en ", lista_o_de_estados ;
    (* errata ISO: la producción del Anexo A está mal formada; se reconstruye «is initially s1 [and s2] and finally s3 or s4» *)
estado_de_entrada = identificador_de_estado ;
estado_de_salida = identificador_de_estado ;
identificador_de_proceso_activo = identificador_de_proceso ;

(* ===== ISO §A.4.5 — Oraciones procedimentales ===== *)
oracion_procedimental = oracion_transformadora
    | oracion_habilitadora
    | oracion_de_control
    | oracion_de_abanico_probabilistico     (* fuera del Anexo A: ISO §12.7 *)
    | oracion_de_ruta ;                     (* fuera del Anexo A: ISO §13 [informativo] *)

(* ----- ISO §A.4.5.2 — Transformaciones ----- *)
oracion_transformadora = oracion_de_consumo | oracion_de_resultado | oracion_de_efecto | oracion_de_cambio ;

oracion_de_consumo = ( identificador_de_proceso, " consume ", lista_de_objetos_procedimentales )
    | oracion_selectiva_de_consumo ;
oracion_selectiva_de_consumo =
      ( identificador_de_proceso, " consume al menos uno de ", lista_o_de_objetos )            (* OR, origen *)
    | ( "Al menos uno de ", lista_o_de_procesos, " consume ", objeto_con_opcion_de_estado )    (* OR, destino *)
    | ( identificador_de_proceso, " consume exactamente ", lista_xor_de_objetos_al_final )     (* XOR, origen *)
    | ( "Exactamente ", lista_xor_de_procesos_al_final, " consume ", objeto_con_opcion_de_estado ) ;   (* XOR, destino *)

oracion_de_resultado = ( identificador_de_proceso, " genera ", lista_de_objetos_procedimentales )
    | oracion_selectiva_de_resultado ;
oracion_selectiva_de_resultado =
      ( "Al menos uno de ", lista_o_de_procesos, " genera ", objeto_con_opcion_de_estado )
    | ( identificador_de_proceso, " genera al menos uno de ", lista_o_de_objetos )
    | ( "Exactamente ", lista_xor_de_procesos_al_final, " genera ", objeto_con_opcion_de_estado )
    | ( identificador_de_proceso, " genera exactamente ", lista_xor_de_objetos_al_final ) ;

oracion_de_efecto = ( identificador_de_proceso, " afecta ", lista_de_objetos_con_multiplicidad )
    | oracion_selectiva_de_efecto ;
oracion_selectiva_de_efecto =
      ( identificador_de_proceso, " afecta al menos uno de ", lista_o_de_objetos_sin_estados )
    | ( "Al menos uno de ", lista_o_de_procesos, " afecta ", identificador_de_objeto )
    | ( identificador_de_proceso, " afecta exactamente ", lista_xor_de_objetos_sin_estados_al_final )
    | ( "Exactamente ", lista_xor_de_procesos_al_final, " afecta ", identificador_de_objeto ) ;

oracion_de_cambio = oracion_de_cambio_entrada_salida
    | oracion_de_cambio_solo_entrada
    | oracion_de_cambio_solo_salida ;
frase_de_cambio_entrada_salida = identificador_de_objeto, " de ", estado_de_entrada, " a ", estado_de_salida ;
frase_de_cambio_solo_entrada = identificador_de_objeto, " de ", estado_de_entrada ;
frase_de_cambio_solo_salida = identificador_de_objeto, " a ", estado_de_salida ;

oracion_de_cambio_entrada_salida =
      ( identificador_de_proceso, " cambia ", frase_de_cambio_entrada_salida,
        [ { ", ", frase_de_cambio_entrada_salida }, conjuncion_y, frase_de_cambio_entrada_salida ] )
    | ( identificador_de_proceso, " cambia ", frase_de_cambio_entrada_salida,
        { ", ", frase_de_cambio_entrada_salida }, conjuncion_o, frase_de_cambio_entrada_salida )   (* OR por objeto *)
    | ( lista_o_de_procesos, " cambia ", frase_de_cambio_entrada_salida )                          (* OR por proceso *)
    | ( identificador_de_proceso, " cambia ", identificador_de_objeto, " de ", lista_o_de_estados, " a ", estado_de_salida )   (* OR por estado de entrada *)
    | ( identificador_de_proceso, " cambia ", identificador_de_objeto, " de ", estado_de_entrada, " a ", lista_o_de_estados )  (* OR por estado de salida *)
    | ( identificador_de_proceso, " cambia uno de ", frase_de_cambio_entrada_salida,
        { ", ", frase_de_cambio_entrada_salida }, conjuncion_o, frase_de_cambio_entrada_salida )   (* XOR por objeto *)
    | ( lista_xor_de_procesos_al_inicio, " cambia ", frase_de_cambio_entrada_salida )              (* XOR por proceso *)
    | ( identificador_de_proceso, " cambia ", identificador_de_objeto, " de ", lista_xor_de_estados_al_final, " a ", estado_de_salida )
    | ( identificador_de_proceso, " cambia ", identificador_de_objeto, " de ", estado_de_entrada, " a ", lista_xor_de_estados_al_final )
      (* errata ISO: «in out specified change state Xor sentence» no es alcanzable en el Anexo A; se engancha aquí *)
    | ( identificador_de_proceso, " cambia ", identificador_de_objeto, " de ",
        ( estado_de_entrada | ( cuantificador_de_abanico, lista_o_de_estados ) ), " a ",
        ( estado_de_salida | ( cuantificador_de_abanico, lista_o_de_estados ) ) ) ;
      (* fuera del Anexo A: ISO §12.2 — frases «exactly one of» / «at least one of»; R-FAN-5, R-FAN-5A *)

oracion_de_cambio_solo_entrada =
      ( identificador_de_proceso, " cambia ", frase_de_cambio_solo_entrada,
        [ { ", ", frase_de_cambio_solo_entrada }, conjuncion_y, frase_de_cambio_solo_entrada ] )
    | ( identificador_de_proceso, " cambia ", frase_de_cambio_solo_entrada,
        { ", ", frase_de_cambio_solo_entrada }, conjuncion_o, frase_de_cambio_solo_entrada )
    | ( lista_o_de_procesos, " cambia ", frase_de_cambio_solo_entrada )
    | ( identificador_de_proceso, " cambia ", identificador_de_objeto, " de ", lista_o_de_estados )
    | ( identificador_de_proceso, " cambia uno de ", frase_de_cambio_solo_entrada,
        { ", ", frase_de_cambio_solo_entrada }, conjuncion_o, frase_de_cambio_solo_entrada )
    | ( lista_xor_de_procesos_al_inicio, " cambia ", frase_de_cambio_solo_entrada )
    | ( identificador_de_proceso, " cambia ", identificador_de_objeto, " de ", lista_xor_de_estados_al_final )
    | ( identificador_de_proceso, " cambia ", identificador_de_objeto, " de ", cuantificador_de_abanico, lista_o_de_estados ) ;
      (* la última: fuera del Anexo A, ISO §12.2 *)

oracion_de_cambio_solo_salida =
      ( identificador_de_proceso, " cambia ", frase_de_cambio_solo_salida,
        [ { ", ", frase_de_cambio_solo_salida }, conjuncion_y, frase_de_cambio_solo_salida ] )
    | ( identificador_de_proceso, " cambia ", frase_de_cambio_solo_salida,
        { ", ", frase_de_cambio_solo_salida }, conjuncion_o, frase_de_cambio_solo_salida )
    | ( lista_o_de_procesos, " cambia ", frase_de_cambio_solo_salida )
    | ( identificador_de_proceso, " cambia ", identificador_de_objeto, " a ", lista_o_de_estados )
    | ( identificador_de_proceso, " cambia uno de ", frase_de_cambio_solo_salida,
        { ", ", frase_de_cambio_solo_salida }, conjuncion_o, frase_de_cambio_solo_salida )
    | ( lista_xor_de_procesos_al_inicio, " cambia ", frase_de_cambio_solo_salida )
    | ( identificador_de_proceso, " cambia ", identificador_de_objeto, " a ", lista_xor_de_estados_al_final )
    | ( identificador_de_proceso, " cambia ", identificador_de_objeto, " a ", cuantificador_de_abanico, lista_o_de_estados ) ;
      (* la última: fuera del Anexo A, ISO §12.2 *)

(* ----- ISO §A.4.5.3 — Habilitadores ----- *)
oracion_habilitadora = oracion_de_agente | oracion_de_instrumento ;
oracion_de_agente = ( lista_de_objetos_procedimentales, ( " maneja " | " manejan " ), identificador_de_proceso )
      (* [localización] concordancia: «maneja» con sujeto único, «manejan» con lista o plural; el Anexo A escribe « handle » *)
    | ( "Al menos uno de ", lista_o_de_objetos, " maneja ", identificador_de_proceso )     (* errata ISO: «handles » sin espacio previo *)
    | ( objeto_con_opcion_de_estado, " maneja al menos uno de ", lista_o_de_procesos )
    | ( "Exactamente ", lista_xor_de_objetos_al_final, " maneja ", identificador_de_proceso )
    | ( objeto_con_opcion_de_estado, " maneja exactamente ", lista_xor_de_procesos_al_final ) ;
oracion_de_instrumento = ( identificador_de_proceso, " requiere ", lista_de_objetos_procedimentales )
    | ( identificador_de_proceso, " requiere al menos uno de ", lista_o_de_objetos )
    | ( "Al menos uno de ", lista_o_de_procesos, " requiere ", objeto_con_opcion_de_estado )
    | ( identificador_de_proceso, " requiere exactamente ", lista_xor_de_objetos_al_final )
    | ( "Exactamente ", lista_xor_de_procesos_al_final, " requiere ", objeto_con_opcion_de_estado )
    | ( lista_de_procesos, " requieren ", objeto_con_opcion_de_estado ) ;
      (* la última: fuera del Anexo A, ISO §12.1, ISO Figura 50 [informativo] *)

(* ----- ISO §A.4.5.4 — Flujo de control ----- *)
oracion_de_control = oracion_de_evento
    | oracion_de_condicion
    | oracion_de_invocacion
    | oracion_de_excepcion
    | oracion_de_abanico_con_control ;      (* fuera del Anexo A: ISO §12.5, §12.6, ISO Tablas 22–23 *)

oracion_de_evento = oracion_de_evento_de_consumo
    | oracion_de_evento_de_efecto
    | oracion_de_evento_de_agente
    | oracion_de_evento_de_instrumento ;
oracion_de_evento_de_consumo = [ multiplicidad_de_objeto, " " ], objeto_con_opcion_de_estado,
    " inicia ", identificador_de_proceso, ", que consume ", identificador_de_objeto ;
oracion_de_evento_de_efecto =
      ( identificador_de_objeto, " inicia ", identificador_de_proceso, ", que afecta ", identificador_de_objeto )
    | ( identificador_de_objeto, " en ", estado_de_entrada, " inicia ", identificador_de_proceso,
        ", que cambia ", frase_de_cambio_entrada_salida )
    | ( identificador_de_objeto, " en ", estado_de_entrada, " inicia ", identificador_de_proceso,
        ", que cambia ", frase_de_cambio_solo_entrada )
    | ( identificador_de_objeto, " en cualquier estado inicia ", identificador_de_proceso,
        ", que cambia ", frase_de_cambio_solo_salida ) ;
oracion_de_evento_de_agente = [ multiplicidad_de_objeto, " " ], objeto_con_opcion_de_estado,
    " inicia y maneja ", identificador_de_proceso ;
oracion_de_evento_de_instrumento = [ multiplicidad_de_objeto, " " ], objeto_con_opcion_de_estado,
    " inicia ", identificador_de_proceso, ", que requiere ", objeto_con_opcion_de_estado ;

oracion_de_condicion = oracion_de_condicion_transformadora | oracion_de_condicion_habilitadora ;
oracion_de_condicion_transformadora = oracion_de_consumo_condicional
    | oracion_de_consumo_condicional_con_estado
    | oracion_de_efecto_condicional ;
oracion_de_consumo_condicional =
      ( identificador_de_proceso, " ocurre si ", identificador_de_objeto, " existe, en cuyo caso ",
        identificador_de_objeto, " se consume, de lo contrario ", identificador_de_proceso, " se omite" )
    | ( "Si ", identificador_de_objeto, " existe entonces ", identificador_de_proceso,
        " ocurre y consume ", identificador_de_objeto, ", de lo contrario se omite ", identificador_de_proceso ) ;
oracion_de_consumo_condicional_con_estado =
      ( identificador_de_proceso, " ocurre si ", identificador_de_objeto, " está en ", estado_de_entrada,
        ", en cuyo caso ", identificador_de_objeto, " se consume, de lo contrario ", identificador_de_proceso, " se omite" )
    | ( "Si ", identificador_de_objeto, " en ", estado_de_entrada, " existe entonces ", identificador_de_proceso,
        " ocurre y consume ", identificador_de_objeto, ", de lo contrario se omite ", identificador_de_proceso ) ;
oracion_de_efecto_condicional = oracion_de_efecto_condicional_simple
    | oracion_de_efecto_condicional_entrada_salida
    | oracion_de_efecto_condicional_solo_entrada
    | oracion_de_efecto_condicional_solo_salida ;
oracion_de_efecto_condicional_simple =
      ( identificador_de_proceso, " ocurre si ", identificador_de_objeto, " existe, en cuyo caso ",
        identificador_de_proceso, " afecta ", identificador_de_objeto, ", de lo contrario ", identificador_de_proceso, " se omite" )
    | ( "Si ", identificador_de_objeto, " existe entonces ", identificador_de_proceso,
        " ocurre y afecta ", identificador_de_objeto, ", de lo contrario se omite ", identificador_de_proceso ) ;
oracion_de_efecto_condicional_entrada_salida =
      ( identificador_de_proceso, " ocurre si ", identificador_de_objeto, " está en ", estado_de_entrada,
        ", en cuyo caso ", identificador_de_proceso, " cambia ", frase_de_cambio_entrada_salida,
        ", de lo contrario ", ( identificador_de_proceso, " se omite" | "se omite ", identificador_de_proceso ) )
      (* el Anexo A alterna «else P is skipped» y «otherwise bypass P» *)
    | ( "Si ", identificador_de_objeto, " está en ", estado_de_entrada, " entonces ", identificador_de_proceso,
        " cambia ", frase_de_cambio_entrada_salida, ", de lo contrario se omite ", identificador_de_proceso ) ;
      (* la segunda: fuera del Anexo A, ISO §9.5.3.3 (sintaxis alternativa) *)
oracion_de_efecto_condicional_solo_entrada =
      ( identificador_de_proceso, " ocurre si ", identificador_de_objeto, " está en ", estado_de_entrada,
        ", en cuyo caso ", identificador_de_proceso, " cambia ", frase_de_cambio_solo_entrada,
        ", de lo contrario ", ( identificador_de_proceso, " se omite" | "se omite ", identificador_de_proceso ) )
    | ( "Si ", identificador_de_objeto, " está en ", estado_de_entrada, " entonces ", identificador_de_proceso,
        " cambia ", frase_de_cambio_solo_entrada, ", de lo contrario se omite ", identificador_de_proceso ) ;
      (* la segunda: fuera del Anexo A, ISO §9.5.3.3 *)
oracion_de_efecto_condicional_solo_salida =
      ( identificador_de_proceso, " ocurre si ", identificador_de_objeto, " existe, en cuyo caso ",
        identificador_de_proceso, " cambia ", frase_de_cambio_solo_salida,
        ", de lo contrario ", ( identificador_de_proceso, " se omite" | "se omite ", identificador_de_proceso ) )
    | ( "Si ", identificador_de_objeto, " existe entonces ", identificador_de_proceso,
        " cambia ", frase_de_cambio_solo_salida, ", de lo contrario se omite ", identificador_de_proceso ) ;
      (* la segunda: fuera del Anexo A, ISO §9.5.3.3 *)
oracion_de_condicion_habilitadora = oracion_de_agente_condicional | oracion_de_instrumento_condicional ;
oracion_de_agente_condicional =
      ( identificador_de_proceso, " ocurre si ", objeto_con_opcion_de_estado, " existe, de lo contrario ",
        ( identificador_de_proceso, " se omite" | "se omite ", identificador_de_proceso ) )
      (* forma del Anexo A *)
    | ( identificador_de_objeto, " maneja ", identificador_de_proceso, " si ", identificador_de_objeto,
        ( " existe" | ( " está en ", identificador_de_estado ) ), ", de lo contrario ", identificador_de_proceso, " se omite" )
    | ( "Si ", objeto_con_opcion_de_estado, " existe entonces ", identificador_de_objeto, " maneja ",
        identificador_de_proceso, ", de lo contrario se omite ", identificador_de_proceso ) ;
      (* fuera del Anexo A: ISO §9.5.3.2, §9.5.3.4 (CH1, CS5 y su alternativa); incoherencia de la PAS con la forma del Anexo A.
         Los dos objetos son el mismo agente *)
oracion_de_instrumento_condicional =
      ( identificador_de_proceso, " ocurre si ", objeto_con_opcion_de_estado, " existe, de lo contrario ",
        ( identificador_de_proceso, " se omite" | "se omite ", identificador_de_proceso ) )
    | ( identificador_de_proceso, " ocurre si ", identificador_de_objeto, " está en ", identificador_de_estado,
        ", de lo contrario ", identificador_de_proceso, " se omite" )
    | ( "Si ", identificador_de_objeto, ( " existe" | ( " está en ", identificador_de_estado ) ),
        " entonces ", identificador_de_proceso, " ocurre, de lo contrario se omite ", identificador_de_proceso ) ;
      (* la segunda y la tercera: fuera del Anexo A, ISO §9.5.3.2, §9.5.3.4 *)

oracion_de_invocacion = ( identificador_de_proceso, " invoca ", lista_de_procesos )
    | ( identificador_de_proceso, " se invoca a sí mismo" )      (* errata ISO: espacio final en « invokes itself » *)
    | ( "Al menos uno de ", lista_o_de_procesos, " invoca ", identificador_de_proceso )
    | ( identificador_de_proceso, " invoca al menos uno de ", lista_o_de_procesos )
    | ( "Exactamente uno de ", lista_o_de_procesos, " invoca ", identificador_de_proceso )
    | ( identificador_de_proceso, " invoca exactamente ", lista_xor_de_procesos_al_final ) ;

oracion_de_excepcion =
      ( identificador_de_proceso_activo, " ocurre si duración de ", identificador_de_proceso, " excede ", duracion_maxima )
    | ( identificador_de_proceso_activo, " ocurre si duración de ", identificador_de_proceso, " es menor que ", duracion_minima ) ;

(* ----- Fuera del Anexo A: abanicos con control (ISO §12.5, §12.6, ISO Tablas 22–23) ----- *)
oracion_de_abanico_con_control =
      ( objeto_con_opcion_de_estado, " inicia ", cuantificador_de_abanico, lista_o_de_procesos,
        ", en cuyo caso el proceso que ocurre afecta ", identificador_de_objeto )
    | ( objeto_con_opcion_de_estado, " inicia ", cuantificador_de_abanico, lista_o_de_procesos,
        ", que consume ", identificador_de_objeto )
    | ( objeto_con_opcion_de_estado, " inicia y maneja ", cuantificador_de_abanico, lista_o_de_procesos )
    | ( objeto_con_opcion_de_estado, " inicia ", cuantificador_de_abanico, lista_o_de_procesos,
        ", que requiere ", objeto_con_opcion_de_estado )
    | ( cuantificador_de_abanico_inicial, lista_o_de_procesos, " ocurre si ", identificador_de_objeto,
        ( " existe" | ( " está en ", identificador_de_estado ) ),
        ", en cuyo caso el proceso que ocurre ", ( "afecta " | "consume " ), identificador_de_objeto,
        "; de lo contrario, estos procesos se omiten" )
    | ( identificador_de_objeto, " maneja ", cuantificador_de_abanico, lista_o_de_procesos, " si ", identificador_de_objeto,
        ( " existe" | ( " está en ", identificador_de_estado ) ), "; de lo contrario, estos procesos se omiten" )
    | ( cuantificador_de_abanico_inicial, lista_o_de_procesos, " requiere que ", identificador_de_objeto,
        ( " exista" | ( " esté en ", identificador_de_estado ) ), "; de lo contrario, estos procesos se omiten" ) ;
      (* [localización] subjuntivo de «requires that B is s2» *)

(* ----- Fuera del Anexo A: abanico probabilístico (ISO §12.7) ----- *)
oracion_de_abanico_probabilistico =
      ( identificador_de_proceso, ( " genera " | " consume " | " afecta " | " requiere " ),
        objeto_con_probabilidad, { ", ", objeto_con_probabilidad }, conjuncion_o, objeto_con_probabilidad )
    | ( identificador_de_objeto, ( " maneja " | " inicia " ), proceso_con_probabilidad,
        { ", ", proceso_con_probabilidad }, conjuncion_o, proceso_con_probabilidad )
    | ( proceso_con_probabilidad, { ", ", proceso_con_probabilidad }, conjuncion_o, proceso_con_probabilidad,
        ( " consume " | " requiere " ), objeto_con_opcion_de_estado ) ;
objeto_con_probabilidad = objeto_con_opcion_de_estado, " con probabilidad ", ( numero_real_positivo | nombre ) ;
proceso_con_probabilidad = identificador_de_proceso, " con probabilidad ", ( numero_real_positivo | nombre ) ;

(* ----- Fuera del Anexo A: etiqueta de ruta (ISO §13, ISO Figura 44) [informativo] ----- *)
oracion_de_ruta = "Por ruta ", etiqueta_de_ruta, ", ", oracion_formal_opl_de_ruta ;
oracion_formal_opl_de_ruta = oracion_transformadora | oracion_habilitadora | oracion_de_control ;
etiqueta_de_ruta = nombre ;

(* ===== ISO §A.4.6 — Oraciones estructurales ===== *)
oracion_estructural = oracion_etiquetada
    | oracion_de_agregacion
    | oracion_de_caracterizacion
    | oracion_de_exhibicion
    | oracion_de_especializacion
    | oracion_de_instanciacion ;

(* ----- ISO §A.4.6.2 — Estructuras etiquetadas ----- *)
oracion_etiquetada = oracion_etiquetada_unidireccional | oracion_etiquetada_bidireccional ;
oracion_etiquetada_unidireccional = oracion_etiquetada_simple | oracion_etiquetada_bifurcada ;
objeto_origen = objeto_con_opcion_de_estado ;          (* SSE1–SSE7: estado opcional en los extremos *)
objeto_destino = objeto_con_opcion_de_estado ;
proceso_origen = identificador_de_proceso ;
proceso_destino = identificador_de_proceso ;
multiplicidad_opcional = [ multiplicidad_de_objeto, " " ] ;
oracion_etiquetada_simple =
      ( multiplicidad_opcional, objeto_origen, etiqueta_nula_unidireccional, multiplicidad_opcional, objeto_destino )
    | ( multiplicidad_opcional, proceso_origen, etiqueta_nula_unidireccional, multiplicidad_opcional, proceso_destino )
    | ( multiplicidad_opcional, objeto_origen, " ", etiqueta_directa, " ", multiplicidad_opcional, objeto_destino, [ expresion_de_restriccion ] )
    | ( multiplicidad_opcional, proceso_origen, " ", etiqueta_directa, " ", multiplicidad_opcional, proceso_destino ) ;
oracion_etiquetada_bifurcada =
      ( multiplicidad_opcional, objeto_origen, etiqueta_nula_unidireccional, dientes_de_objeto )
    | ( multiplicidad_opcional, proceso_origen, etiqueta_nula_unidireccional, dientes_de_proceso )
    | ( multiplicidad_opcional, objeto_origen, " ", etiqueta_directa, " ", dientes_de_objeto )
    | ( multiplicidad_opcional, proceso_origen, " ", etiqueta_directa, " ", dientes_de_proceso ) ;
dientes_de_objeto = diente_objeto
    | ( diente_objeto, { ", ", diente_objeto }, conjuncion_y, ( diente_objeto | "más" ) ),
      [ ", ordenados por ", criterio_de_orden, [ ", en esa secuencia" ] ] ;
dientes_de_proceso = diente_proceso
    | ( diente_proceso, { ", ", diente_proceso }, conjuncion_y, ( diente_proceso | "más" ) ),
      [ ", ordenados por ", criterio_de_orden, [ ", en esa secuencia" ] ] ;
diente_objeto = multiplicidad_opcional, objeto_con_opcion_de_estado ;
diente_proceso = multiplicidad_opcional, identificador_de_proceso ;
criterio_de_orden = nombre ;
etiqueta_nula_unidireccional = " se relaciona con " | " se relacionan con "
    | " ", etiqueta_nula_definida_por_el_modelador, " " ;   (* errata ISO: la etiqueta de usuario va sin espacios *)
etiqueta_directa = expresion_de_etiqueta ;
etiqueta_nula_definida_por_el_modelador = expresion_de_etiqueta ;

oracion_etiquetada_bidireccional = oracion_bidireccional_de_objetos
    | oracion_bidireccional_de_procesos
    | oracion_reciproca_de_objetos
    | oracion_reciproca_de_procesos ;
oracion_bidireccional_de_objetos =
      ( multiplicidad_opcional, objeto_origen, " ", etiqueta_directa_bidireccional, " ", multiplicidad_opcional, objeto_destino,
        [ expresion_de_restriccion ] )
    | ( multiplicidad_opcional, objeto_destino, " ", etiqueta_inversa_bidireccional, " ", multiplicidad_opcional, objeto_origen,
        [ expresion_de_restriccion ] ) ;                  (* errata ISO: etiquetas sin espacios alrededor *)
oracion_bidireccional_de_procesos =
      ( multiplicidad_opcional, proceso_origen, " ", etiqueta_directa_bidireccional, " ", multiplicidad_opcional, proceso_destino )
    | ( multiplicidad_opcional, proceso_destino, " ", etiqueta_inversa_bidireccional, " ", multiplicidad_opcional, proceso_origen ) ;
oracion_reciproca_de_objetos = multiplicidad_opcional, objeto_origen, conjuncion_y, multiplicidad_opcional, objeto_destino,
    ( ( " son ", etiqueta_reciproca ) | etiqueta_nula_reciproca ) ;
oracion_reciproca_de_procesos = multiplicidad_opcional, proceso_origen, conjuncion_y, multiplicidad_opcional, proceso_destino,
    ( ( " son ", etiqueta_reciproca ) | etiqueta_nula_reciproca ) ;
    (* errata ISO: el Anexo A define «symmetric tag» y no lo usa; ISO §10.2.4 da «are reciprocity-tag» *)
etiqueta_reciproca = expresion_de_etiqueta ;
etiqueta_directa_bidireccional = expresion_de_etiqueta ;
etiqueta_inversa_bidireccional = expresion_de_etiqueta ;
etiqueta_nula_reciproca = " se relacionan" | ( " son ", etiqueta_nula_definida_por_el_modelador ) ;

(* ----- ISO §A.4.6.3 — Estructuras fundamentales ----- *)
oracion_de_agregacion = ( objeto_todo, " consta de ", lista_de_partes_de_objeto )
    | ( proceso_todo, " consta de ", lista_de_partes_de_proceso ) ;
objeto_todo = identificador_de_objeto ;
proceso_todo = identificador_de_proceso ;
lista_de_partes_de_objeto = parte_objeto
    | ( parte_objeto, { ", ", parte_objeto }, conjuncion_y, ( parte_objeto | "al menos otra parte" ) ) ;
lista_de_partes_de_proceso = parte_proceso
    | ( parte_proceso, { ", ", parte_proceso }, conjuncion_y, ( parte_proceso | "al menos otra parte" ) ) ;
parte_objeto = multiplicidad_opcional, identificador_de_objeto, [ marca_opcional ] ;
parte_proceso = multiplicidad_opcional, identificador_de_proceso ;

oracion_de_caracterizacion =
      ( identificador_de_objeto, " exhibe ", ( lista_de_atributos | lista_de_operaciones ) )
    | ( identificador_de_objeto, " exhibe ", ( lista_parcial_de_atributos | lista_parcial_de_operaciones ) )
    | ( identificador_de_objeto, " exhibe ", lista_de_atributos, separador_asi_como, lista_de_operaciones )
    | ( identificador_de_objeto, " exhibe ", lista_parcial_de_atributos, separador_asi_como, lista_parcial_de_operaciones )
    | ( identificador_de_proceso, " exhibe ", ( lista_de_operaciones | lista_de_atributos ) )
    | ( identificador_de_proceso, " exhibe ", ( lista_parcial_de_operaciones | lista_parcial_de_atributos ) )
    | ( identificador_de_proceso, " exhibe ", lista_de_operaciones, separador_asi_como, lista_de_atributos )
    | ( identificador_de_proceso, " exhibe ", lista_parcial_de_operaciones, separador_asi_como, lista_parcial_de_atributos )
    | ( identificador_de_objeto, " exhibe ", identificador_de_objeto, " en ", identificador_de_estado ) ;
      (* la última: ISO §10.4.1 (RF5), sin producción en el Anexo A; [localización] valor pospuesto *)
separador_asi_como = ", así como " | " así como " ;
    (* el Anexo A escribe «, as well as»; RF2b y RF2c de reglas §4.10 omiten la coma *)
lista_de_atributos = lista_de_objetos ;
lista_de_operaciones = lista_de_procesos ;
lista_parcial_de_atributos = identificador_de_objeto, { ", ", identificador_de_objeto }, " y al menos otro atributo" ;
lista_parcial_de_operaciones = identificador_de_proceso, { ", ", identificador_de_proceso }, " y al menos otra operación" ;
    (* errata ISO: «list, and at least one other …» repite la conjunción de la lista *)

(* ----- ISO §A.4.6.4 — Oraciones de exhibición ----- *)
oracion_de_exhibicion =
      ( rasgo, " de ", identificador_de_objeto,
        ( clausula_de_rango
        | " es ", ( lista_de_atributos | lista_de_operaciones | ( lista_de_atributos, ", así como ", lista_de_operaciones ) ) ) )
    | ( rasgo, " de ", identificador_de_proceso, " es ",
        ( lista_de_operaciones | lista_de_objetos | ( lista_de_operaciones, ", así como ", lista_de_atributos ) ) ) ;
rasgo = identificador_de_objeto | identificador_de_proceso ;

(* ----- ISO §A.4.6.5 — Especialización ----- *)
oracion_de_especializacion =
      ( objeto_especial, " es ", articulo, objeto_general )
    | ( lista_de_objetos_especiales, " son ", objeto_general )
    | ( lista_de_objetos_especiales, " y otras especializaciones son ", objeto_general )
    | ( objeto_especial, " puede ser o bien ", objeto_general, " o bien ", objeto_general )
    | ( objeto_especial, " puede ser uno de ", objeto_general, { ", ", objeto_general }, conjuncion_o, objeto_general )
    | ( objeto_especial, " es ", lista_de_generales_de_objeto )
    | ( proceso_especial, " es ", proceso_general )
    | ( lista_de_procesos_especiales, " son ", proceso_general )
    | ( lista_de_procesos_especiales, " y otras especializaciones son ", proceso_general )
    | ( proceso_especial, " puede ser o bien ", proceso_general, " o bien ", proceso_general )
    | ( proceso_especial, " puede ser uno de ", proceso_general, { ", ", proceso_general }, conjuncion_o, proceso_general )
    | ( proceso_especial, " es ", lista_de_generales_de_proceso )
    | ( objeto_con_estado, " es ", articulo, objeto_con_estado )
    | ( lista_de_objetos_con_estado, " son ", objeto_con_estado )
    | ( lista_de_objetos_con_estado, " y otras especializaciones son ", objeto_con_estado ) ;
articulo = "un " | "una " ;
objeto_general = identificador_de_objeto ;
objeto_especial = identificador_de_objeto ;
proceso_general = identificador_de_proceso ;
proceso_especial = identificador_de_proceso ;
lista_de_objetos_especiales = lista_de_objetos ;
lista_de_procesos_especiales = lista_de_procesos ;
lista_de_generales_de_objeto = articulo, objeto_general, { ", ", articulo, objeto_general }, conjuncion_y, articulo, objeto_general ;
lista_de_generales_de_proceso = articulo, proceso_general, { ", ", articulo, proceso_general }, conjuncion_y, articulo, proceso_general ;
    (* errata ISO: «a X a Y and a Z» sin comas *)
objeto_con_estado = identificador_de_objeto, " en ", identificador_de_estado ;   (* [localización] estado pospuesto *)
lista_de_objetos_con_estado = objeto_con_estado
    | objeto_con_estado, { ", ", objeto_con_estado }, conjuncion_y, objeto_con_estado ;
    (* errata ISO: «, and» con coma serial inglesa *)

(* ----- ISO §A.4.6.6 — Instanciación ----- *)
oracion_de_instanciacion =
      ( identificador_de_objeto, " es una instancia de ", identificador_de_objeto )
    | ( lista_de_objetos, " son instancias de ", identificador_de_objeto )
    | ( identificador_de_proceso, " es una instancia de ", identificador_de_proceso )
    | ( lista_de_procesos, " son instancias de ", identificador_de_proceso ) ;
      (* errata ISO: «are an instance of» para procesos *)

(* ===== ISO §A.4.7 — Gestión de contexto ===== *)
(* el despliegue en el mismo diagrama equivale a la oración estructural correspondiente (ISO §A.4.7.1) *)
oracion_de_gestion_de_contexto = oracion_de_despliegue
    | oracion_de_plegado
    | oracion_de_descomposicion
    | oracion_de_recomposicion
    | oracion_de_refinamiento_de_opd ;      (* fuera del Anexo A: ISO §14.2.2.6 *)

oracion_de_despliegue =
      ( identificador_de_objeto, " se despliega en ", lista_de_atributos, [ ", así como ", lista_de_operaciones ] )
    | ( objeto_todo, " desde ", opd_padre, " se despliega por partes en ", opd_hijo, " en ", lista_de_partes_de_objeto )
    | ( objeto_general, " desde ", opd_padre, " se despliega por especialización en ", opd_hijo, " en ", lista_de_objetos_especiales )
    | ( identificador_de_objeto, " desde ", opd_padre, " se despliega por instancias en ", opd_hijo, " en ", lista_de_objetos )
    | ( identificador_de_objeto, " desde ", opd_padre, " se despliega por rasgos en ", opd_hijo, " en ", lista_de_atributos,
        [ ", así como ", lista_de_operaciones ] )
    | ( identificador_de_proceso, " se despliega en ", lista_de_operaciones, [ ", así como ", lista_de_atributos ] )
    | ( proceso_todo, " desde ", opd_padre, " se despliega por partes en ", opd_hijo, " en ", lista_de_partes_de_proceso )
    | ( proceso_general, " desde ", opd_padre, " se despliega por especialización en ", opd_hijo, " en ", lista_de_procesos_especiales )
    | ( identificador_de_proceso, " desde ", opd_padre, " se despliega por instancias en ", opd_hijo, " en ", lista_de_procesos )
    | ( identificador_de_proceso, " desde ", opd_padre, " se despliega por rasgos en ", opd_hijo, " en ", lista_de_operaciones,
        [ ", así como ", lista_de_atributos ] ) ;
    (* «unfolds into», «part-, specialization-, instance-, feature-unfolds in … into» *)

oracion_de_plegado = ( identificador_de_objeto, " es plegado de ", opd_hijo )
    | ( identificador_de_proceso, " es plegado de ", opd_hijo ) ;

oracion_de_descomposicion =
      ( identificador_de_proceso, " se descompone en ", lista_de_procesos, ", en esa secuencia",
        [ ", así como ", lista_de_objetos ] )
    | ( identificador_de_proceso, " se descompone en paralelo ", lista_de_procesos, [ ", así como ", lista_de_objetos ] )
    | ( identificador_de_proceso, " se descompone en ", lista_de_procesos, " y en paralelo ", lista_de_procesos,
        ", en esa secuencia", [ ", así como ", lista_de_objetos ] )
      (* CX12: tercera alternativa del Anexo A («and parallel») *)
    | ( identificador_de_proceso, " se descompone en ", lista_de_secuencia_mixta, ", en esa secuencia",
        [ ", así como ", lista_de_objetos ] )
    | ( identificador_de_proceso, " desde ", opd_padre, " se descompone en ", opd_hijo, " en ", lista_de_procesos,
        ", en esa secuencia", [ ", así como ", lista_de_objetos ] )
    | ( identificador_de_proceso, " desde ", opd_padre, " se descompone en ", opd_hijo, " en paralelo ", lista_de_procesos,
        [ ", así como ", lista_de_objetos ] )
    | ( identificador_de_proceso, " desde ", opd_padre, " se descompone en ", opd_hijo, " en ", lista_de_secuencia_mixta,
        ", en esa secuencia", [ ", así como ", lista_de_objetos ] )
    | ( identificador_de_objeto, " se descompone en ", lista_de_objetos, ", en esa secuencia",
        [ ", así como ", lista_de_procesos ] )
    | ( identificador_de_objeto, " desde ", opd_padre, " se descompone en ", opd_hijo, " en ", lista_de_objetos,
        ", en esa secuencia", [ ", así como ", lista_de_procesos ] ) ;
    (* «zooms into … in that sequence»; errata ISO: falta la coma ante «in that sequence» (ISO §14.2.1.3 la lleva) y
       la lista interna repite «in that sequence» *)
elemento_de_secuencia_mixta = identificador_de_proceso | ( "paralelo ", lista_de_procesos ) ;
lista_de_secuencia_mixta = elemento_de_secuencia_mixta, { ", ", elemento_de_secuencia_mixta },
    ( conjuncion_y | ", y " | ", e " ), elemento_de_secuencia_mixta ;
    (* ISO §14.2.2.2, ISO Figura 49: generaliza la tercera alternativa del Anexo A (grupo paralelo sólo al final)
       a grupos paralelos en cualquier posición; la coma ante «y» cierra un grupo paralelo *)

oracion_de_recomposicion = ( identificador_de_proceso, " se recompone desde ", opd_hijo )
    | ( identificador_de_objeto, " se recompone desde ", opd_hijo ) ;
    (* «is out zoom from» *)

oracion_de_refinamiento_de_opd = etiqueta_de_opd, " se refina por ", ( "descomposición" | "despliegue" ), " de ",
    identificador_de_proceso, " en ", etiqueta_de_opd ;
    (* fuera del Anexo A: ISO §14.2.2.6, «is refined by in-zooming / unfolding … in» *)
```

- **R-§18-LEX-1** = R-OPL-LEX-1.
- **R-§18-PART-1** = R-OPL-PART-1.
- **R-§18-RANGO-1** = R-OPL-RANGO-1.
- **R-§18-CONJ-1** = R-OPL-CONJ-1.
- **R-§18-LISTA-1** = R-OPL-LISTA-1.

Las reglas léxicas, de multiplicidad, de rango y de listas que esta gramática realiza son R-OPL-LEX-1..3, R-OPL-TIPO-1..2, R-OPL-PART-1, R-OPL-RANGO-1..3, R-OPL-CONJ-1 y R-OPL-LISTA-1..2 (reglas §4.14); el carácter normativo de la EBNF del Anexo A es R-OPL-EBNF-1.

## §21 Invariantes

### §21.2 Invariantes OPL

| Invariante | Enunciado | Origen |
| --- | --- | --- |
| **R-§21-OPL-VOCAB** Vocabulario reservado | Los verbos, cópulas y conectores OPL DEBEN pertenecer al vocabulario reservado de la gramática (ISO §A.3.1, §A.4) y de las construcciones de ISO §12.7, §13 y §14.2.2.6; no se admiten sinónimos. Nombres, etiquetas y valores son clase abierta. | spec-OPL §1 |
| **R-§21-OPL-MOD** Modificadores de control | ISO define enlaces de evento y de condición (ISO §9.5.1); la combinación de ambos sobre un mismo enlace no está definida en la norma y no tiene OPL canónica. | spec-OPL §5, §8.4 |

## Apéndice A — Ejemplo completo [informativo]

Modelo pequeño de **despacho de pedidos** que reúne las plantillas de spec-OPL §2–§10: propiedades genéricas, estados y designaciones, transformación, habilitación, control, estructura, abanico, multiplicidad, composición AND y descomposición. Cada par objeto-proceso tiene un solo enlace procedimental (reglas R-ROL-UNIC-1) y cada oración es una plantilla de este documento.

### A.1 Vocabulario del modelo

- Objetos: **Pedido** (informacional; estados `pendiente`, `despachado`), **Prioridad** (atributo de **Pedido**; estados `normal`, `urgente`), **Inventario** (físico; estados `disponible`, `agotado`), **Embalaje** (físico; consumido), **Bulto** (físico; resultante), **Guía** (informacional; resultante), **Furgón** y **Bicicleta** (físicos; instrumentos alternativos), **Repartidor** (físico; agente humano), **Sistema de Despacho** (informacional), **Zona** con sus especializaciones **Zona Urbana** y **Zona Rural**, y **Zona Centro** (instancia de **Zona Urbana**).
- Proceso: *Despachar*, descompuesto en SD1 en *Preparar*, *Embalar* y *Entregar*.

### A.2 Párrafo de SD

Cosas y estados (spec-OPL §2):

- **Inventario** es físico.
- **Embalaje** es físico.
- **Bulto** es físico.
- **Pedido** puede estar `pendiente` o `despachado`.
- Estado `pendiente` de **Pedido** es inicial.
- **Inventario** puede estar `disponible` o `agotado`.

Estructura (spec-OPL §6):

- **Pedido** exhibe **Prioridad**.
- **Prioridad** de **Pedido** puede estar `normal` o `urgente`.
- **Sistema de Despacho** consta de **Furgón**, **Bicicleta** e **Inventario**.
- **Zona Urbana** y **Zona Rural** son **Zona**.
- **Zona Centro** es una instancia de **Zona Urbana**.
- **Pedido** se relaciona con **Zona**.

Transformación, control y multiplicidad (spec-OPL §3, §5, §10):

- **Embalaje** inicia *Despachar*, que consume **Embalaje**. (ET1: el enlace de consumo lleva evento, por lo que no se escribe además T1)
- *Despachar* genera **Bulto** y al menos una **Guía**. (dos resultados AND en una oración, R-COMP-EJE-3; multiplicidad 1..* de **Guía**)
- *Despachar* cambia **Pedido** de `pendiente` a `despachado`.
- *Despachar* ocurre si **Inventario** está en `disponible`, de lo contrario *Despachar* se omite. (CS6: **Inventario** es instrumento con condición)

Habilitación y abanico (spec-OPL §4, §8.1):

- **Repartidor** maneja *Despachar*.
- *Despachar* requiere exactamente uno de **Furgón** o **Bicicleta**. (abanico XOR convergente de instrumentos, C-35)

Gestión de contexto (spec-OPL §7):

- SD se refina por descomposición de *Despachar* en SD1.
- *Despachar* se recompone desde SD1.

### A.3 Composición AND

Los dos resultados de *Despachar* forman una sola oración con lista (`*Despachar* genera **Bulto** y al menos una **Guía**.`), no dos oraciones (R-FAN-1, R-COMP-EJE-3). La OPL canónica no coordina en una oración enlaces de tipos distintos: el consumo, el cambio y la habilitación de *Despachar* son oraciones separadas.

### A.4 Párrafo de SD1: descomposición síncrona de *Despachar*

- *Despachar* desde SD se descompone en SD1 en *Preparar*, *Embalar* y *Entregar*, en esa secuencia.
- **Embalaje** inicia *Preparar*, que consume **Embalaje**.
- *Preparar* ocurre si **Inventario** está en `disponible`, de lo contrario *Preparar* se omite.
- *Preparar* cambia **Pedido** de `pendiente`.
- *Embalar* genera **Bulto**.
- *Entregar* genera al menos una **Guía**.
- *Entregar* cambia **Pedido** a `despachado`.
- **Repartidor** maneja *Entregar*.
- *Entregar* requiere exactamente uno de **Furgón** o **Bicicleta**.

Al descomponer, el consumo de **Embalaje** y los resultados se anclan por defecto al primer subproceso; el modelador reasignó **Bulto** a *Embalar* y **Guía** a *Entregar* (ISO §14.2.2.4). El TS3 de **Pedido** se escindió en su mitad de entrada (*Preparar*) y su mitad de salida (*Entregar*) (ISO Tabla 25). Los hechos de SD1 refinan los de SD sin contradecirlos (ISO §14.2.3).
