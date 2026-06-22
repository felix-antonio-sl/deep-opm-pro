# 72 — OPL-ES: plantillas estructurales

**Alcance**: enlaces estructurales etiquetados (SE), relaciones estructurales fundamentales (RF), colecciones incompletas, variantes con estado especificado (SSE).
**Capa SSOT propietaria**: `opm-opl-es.md` §9
**Aplicación en la app**: generador OPL para enlaces estructurales.

## Reglas

### R-3200: Plantillas SE — enlaces estructurales etiquetados

- Enunciado:

| ID | Tipo | OPL-EN | OPL-ES |
|---|---|---|---|
| SE1 | Unidireccional etiquetado | Source tag Destination. | **Origen** etiqueta **Destino**. |
| SE2 | Unidireccional sin etiqueta | Source relates to Destination. | **Origen** se relaciona con **Destino**. |
| SE3 | Bidireccional etiquetado | Source f-tag Dest. / Dest b-tag Source. | **Origen** etiqueta-f **Destino**. / **Destino** etiqueta-b **Origen**. |
| SE4 | Recíproco etiquetado | Source and Destination are tag. | **Origen** y **Destino** son etiqueta. |
| SE5 | Recíproco sin etiqueta | Source and Destination are related. | **Origen** y **Destino** se relacionan. |

En SE1, SE3 y SE4, "etiqueta" es la forma definida por el modelador (ej. "emplea", "pertenece a", "supervisa"). La etiqueta actúa como verbo o predicado nominal.

- Referencia SSOT: `opm-opl-es.md` §9.1

### R-3201: Plantillas RF — relaciones estructurales fundamentales

- Enunciado:

| ID | Relación | OPL-EN | OPL-ES |
|---|---|---|---|
| RF1 | Agregación-participación | Whole consists of Part1, Part2 and Part3. | **Todo** consta de **Parte1**, **Parte2** y **Parte3**. |
| RF2 | Exhibición-caracterización (solo atributos) | Exhibitor exhibits Attribute1 and Attribute2. | **Exhibidor** exhibe **Atributo1** y **Atributo2**. |
| RF2b | Exhibición (atributos + operaciones) | Exhibitor exhibits Attribute1 as well as Operation1. | **Exhibidor** exhibe **Atributo1** así como *Operación1*. |
| RF3 | Generalización (compuesto) | Specialization1 and Specialization2 are General. | **Especialización1** y **Especialización2** son **General**. |
| RF3b | Generalización (individual) | Specialization is a General. | **Especialización** es un **General**. |
| RF4 | Clasificación-instanciación | Instance is an instance of Class. | **Instancia** es una instancia de **Clase**. |

- Referencia SSOT: `opm-opl-es.md` §9.2

### R-3202: Colecciones incompletas

- Enunciado:

| OPL-EN | OPL-ES |
|---|---|
| ...and at least one other part. | ...y al menos otra parte. |
| ...and at least one other feature. | ...y al menos otro rasgo. |
| ...and at least one other specialization. | ...y al menos otra especialización. |

- Referencia SSOT: `opm-opl-es.md` §9.3
- Aplicación en código: generador OPL agrega la cláusula cuando `coleccionCompleta === false`.

### R-3203: V-27 — Clasificación sin colección incompleta

- Enunciado: clasificación-instanciación NO admite la construcción de colección incompleta. La marca con barra horizontal bajo el triángulo y la cláusula "y al menos otra instancia" NO aplican a clasificación.
- Referencia SSOT: V-27
- Aplicación en código: validador prohíbe coleccionIncompleta en clasificación.

### R-3204: Plantillas SSE — estructurales con estado especificado

- Enunciado:

| ID | Grupo | OPL-EN | OPL-ES |
|---|---|---|---|
| SSE1 | Estado en origen (uni) | Specified-state Source tag Destination. | **Origen** en `estado` etiqueta **Destino**. |
| SSE2 | Estado en destino (uni) | Source tag specified-state Destination. | **Origen** etiqueta **Destino** en `estado`. |
| SSE3 | Estado en ambos (uni) | Sa Source tag Sb Destination. | **Origen** en `sa` etiqueta **Destino** en `sb`. |
| SSE4 | Estado en origen (bidi, f-tag) | Sa Source f-tag Destination. | **Origen** en `sa` etiqueta-f **Destino**. |
| SSE5 | Estado en origen (bidi, b-tag) | Destination b-tag Sa Source. | **Destino** etiqueta-b **Origen** en `sa`. |
| SSE6 | Estado en ambos (recíproco) | Sa Source and Sb Dest are tag. | **Origen** en `sa` y **Destino** en `sb` son etiqueta. |
| SSE7 | Estado en origen (recíproco) | Dest and Sa Source are tag. | **Destino** y **Origen** en `sa` son etiqueta. |

- Referencia SSOT: `opm-opl-es.md` §9.4

### R-3205: V-30 — Bidireccional/recíproco sin estado-solo-en-destino

- Enunciado: las variantes bidireccional y recíproco NO existen para el caso de estado solo en destino.
- Referencia SSOT: V-30
- Aplicación en código: validador rechaza esta combinación.

### R-3206: V-25 — Exhibición permite mixto objeto-proceso

- Enunciado: exhibición-caracterización es la única relación estructural que puede conectar objetos con procesos. El rasgo es **atributo** si es objeto, **operación** si es proceso.
- Referencia SSOT: V-25
- Aplicación en código: exhibición admite las 4 combinaciones (V-26).

### R-3207: Especialización individual con artículo

- Enunciado: RF3b usa "es un/una" según género del general. Ejemplo:
  - `**Auto** es un **Vehículo**.` (masculino)
  - `**Cafetera** es una **Máquina**.` (femenino)
- Referencia SSOT: `opm-opl-es.md` §9.2 RF3b, §1.4
- Aplicación en código: generador OPL aplica género correcto.

### R-3208: Especialización plural

- Enunciado: RF3 usa "son" sin artículo explícito:
  - `**Auto**, **Aeronave** y **Barco** son **Vehículo**.`
- Referencia SSOT: `opm-opl-es.md` §9.2 RF3
- Aplicación en código: generador OPL para lista de especializaciones.

### R-3209: Instanciación con "es una instancia de"

- Enunciado: RF4 usa "es una instancia de" literal:
  - `**Ejemplo Alpha** es una instancia de **Clase Ejemplo**.`
- Referencia SSOT: `opm-opl-es.md` §9.2 RF4

### R-3210: Atributo discriminante

- Enunciado: patrón canónico para atributo discriminante (SSE2 + RF3):
  - `**Vehículo** exhibe **Medio de Desplazamiento**.`
  - `**Medio de Desplazamiento** puede estar \`tierra\`, \`aire\` o \`superficie acuática\`.`
  - `**Auto**, **Aeronave** y **Barco** son **Vehículo**.`
  - `**Auto** exhibe **Medio de Desplazamiento** en \`tierra\`.`
  - `**Aeronave** exhibe **Medio de Desplazamiento** en \`aire\`.`
  - `**Barco** exhibe **Medio de Desplazamiento** en \`superficie acuática\`.`
- Referencia SSOT: `opm-iso-19450-es.md` §Ejemplo de vehículos
- Aplicación en código: patrón emitido al declarar atributo discriminante.

### R-3211: Cadena de exhibición

- Enunciado: el patrón de exhibición con estado especificado:
  - `**Limpieza** de **Conjunto de Platos** puede estar \`sucio\` o \`limpio\`.`
  - `Estado \`sucio\` de **Limpieza** de **Conjunto de Platos** es inicial.`
- Referencia SSOT: `opm-opl-es.md` §14
- Aplicación en código: generador OPL para atributos anidados.

### R-3212: Bidireccional con dos oraciones

- Enunciado: SE3 emite **dos oraciones** separadas, una por cada dirección. Las etiquetas `f-tag` y `b-tag` son definidas por el modelador.
- Referencia SSOT: `opm-opl-es.md` §9.1 SE3
- Aplicación en código: generador OPL produce ambas.

### R-3213: Recíproco con "son"

- Enunciado: SE4 usa "son" + etiqueta (nominal):
  - `**Juan** y **María** son amigos.`
- Referencia SSOT: `opm-opl-es.md` §9.1 SE4
- Aplicación en código: el generador respeta la morfología nominal de la etiqueta.

### R-3214: Sin etiqueta canónica = "se relaciona con"

- Enunciado: cuando un enlace unidireccional no tiene etiqueta explícita, se usa la plantilla SE2: "se relaciona con".
- Referencia SSOT: `opm-opl-es.md` §9.1 SE2
- Aplicación en código: default para enlaces sin etiqueta.

### R-3215: V-56 — Bidireccional con etiquetas iguales = recíproco

- Enunciado: un enlace bidireccional cuyas dos etiquetas son idénticas es semánticamente equivalente a recíproco. El generador OPL DEBE emitir la forma recíproca (SE4) en este caso.
- Referencia SSOT: V-56
- Aplicación en código: normalizar antes de emitir.

### R-3216: Exhibición con "así como"

- Enunciado: cuando la exhibición incluye atributos (objetos) y operaciones (procesos), se usa RF2b con el conector "así como":
  - `**Exhibidor** exhibe **Atributo1** así como *Operación1*.`
- Referencia SSOT: `opm-opl-es.md` §9.2 RF2b

### R-3217: Lista de elementos con coma + "y" final

- Enunciado: las listas OPL-ES usan coma como separador y "y" (o "e" ante i-/hi-) antes del último:
  - `**A**, **B** y **C**.`
  - `**Italia** e **Iraq**.` (con "e" ante i-)
- Referencia SSOT: `opm-opl-es.md` §15 R5
- Aplicación en código: regla de conjunción alternada y/e y o/u.

### R-3218: Multiplicidad parametrizada

- Enunciado: la multiplicidad parametrizada se emite como número o parámetro + sustantivo:
  - EN: `Jet Engine consists of b Installed Blades.`
  - ES: **Motor a Reacción** consta de b **Paletas Instaladas**.
- Referencia SSOT: `opm-opl-es.md` §12

### R-3219: Herencia múltiple

- Enunciado: plantilla de herencia múltiple:
  - `**Especialización** es un **General1**, un **General2** y un **General3**.`
- Referencia SSOT: `opm-opl-es.md` Apéndice A §A.7 `oracion_de_herencia_multiple_objeto`
- Aplicación en código: generador OPL para DAG de generalización.

### R-3220: Estructural NO admite modificadores de control

- Enunciado: los enlaces estructurales NO admiten modificadores `e`, `c`, excepciones ni estados especificados adicionales más allá de las variantes SSE. La modificación procedimental es exclusiva de enlaces procedimentales.
- Referencia SSOT: implícito por taxonomía V-239
- Aplicación en código: validador rechaza esta combinación.

## Checklist

- [ ] Plantillas SE1–SE5 implementadas
- [ ] Plantillas RF1–RF4 (con RF2b y RF3b) implementadas
- [ ] Colecciones incompletas con cláusulas canónicas
- [ ] Clasificación NO admite colección incompleta
- [ ] Plantillas SSE1–SSE7 implementadas
- [ ] Bidireccional/recíproco no combinan con estado-solo-en-destino
- [ ] Exhibición mixta objeto-proceso (RF2b)
- [ ] Especialización individual con artículo de género correcto
- [ ] Especialización plural con "son"
- [ ] Instanciación con "es una instancia de"
- [ ] Atributo discriminante emite patrón canónico
- [ ] Bidireccional emite dos oraciones
- [ ] Bidireccional con etiquetas iguales se normaliza a recíproco
- [ ] Sin etiqueta → SE2 "se relaciona con"
- [ ] Conjunciones y/e y o/u alternadas
- [ ] Multiplicidad parametrizada como prefijo

## Antipatrones

- Clasificación con "al menos otra instancia"
- Agregación entre objeto y proceso (viola V-24)
- Etiqueta estructural sin capitalización correcta
- Bidireccional con etiquetas idénticas sin normalizar a recíproco
- Enlace estructural con modificador `c`
- Exhibición que mezcla atributos y operaciones sin "así como"

## Referencias cruzadas

- Enlaces estructurales: `14-enlaces-estructurales.md`
- Estado especificado estructural: `15-enlaces-estado-especificado.md`
- Convenciones OPL: `70-opl-convenciones-y-plantillas-cosa-estado.md`
- Plantillas procedimentales: `71-opl-plantillas-procedimentales.md`
- Contexto (descomposición, despliegue): `73-opl-plantillas-contexto-y-multiplicidad.md`
