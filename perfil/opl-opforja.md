# Perfil OpForja — realización de la OPL (opl-opforja)

**Qué es.** Reglas propias de OpForja sobre la OPL-ES: generadores y su traza a código, tokenización con `ref` e
`hint`, reverse (parser), roundtrip como ley de producto, supresión de placeholders, presentación y plegado del panel,
numeración, interacción OPL↔OPD, edición, configuración, modos de fallo del parser, composición de prosa (oración
compuesta), extensiones de superficie (oración combinada de clasificación, RF2o, sufijo de etiqueta de enlace,
demoras de invocación, variantes negadas, `Current`), GAPs de cobertura, migración, composición por interfaz y
patrones sociotécnicos.

**Subordinación.** Este perfil se subordina al canon: `canon spec-OPL` (spec-forja-opl-es 2.0.0) y `canon reglas`
(reglas-opm-estrictas-es 2.0.0), y se coordina con el perfil reglas-opforja, que es domicilio de D13, CM1–CM3 y
R-OPL-RUTA-3. No los contradice. Donde es más estricto que ISO 19450 lo marca `[endurecimiento]` y su brecha se
declara en `docs/conformidad.md`; donde extiende la norma, `[extensión]`; donde se aparta de un default normativo por
decisión del dueño, `[desviación declarada]` (también con su brecha en `docs/conformidad.md`). Lo no marcado es
realización de producto de una oración del canon. Una forma de producto que el canon no admite como OPL canónica
(por ejemplo, la oración compuesta de §9 o la oración combinada de clasificación de R-ENT-3) es presentación fuera
del canon: su equivalencia se evalúa sobre la OPL canónica (canon spec-OPL R-COMP-CFG-1).

**Procedencia.** Todo el texto viene de spec-forja-opl-es v1.4.1 y conserva su numeración: el §n de este perfil es
el §n de la v1.4.1 y el del canon 2.0.0. Los bloques se trasladan verbatim; las referencias «§n» internas remiten a
esa numeración común (canon o perfil), «esta spec» designa la v1.4.1 y los no terminales EBNF citados por su nombre
v1.4.1 pueden estar renombrados en el canon (`restriccion_de_participacion` → `multiplicidad_de_objeto`). «reglas §n» remite a la misma numeración en canon reglas 2.0.0 o, si esa sección pasó al perfil, en perfil reglas-opforja. Una regla
partida aparece en el canon con su ID y aquí como «(ID, parte de producto)». Las cláusulas que contradecían el canon
2.0.0 no se trasladan; ellas y las correcciones de texto se listan en `mapa-spec-forja-opl-es.json`. Las
plantillas citadas por ID (D*, T*, TS*, H*, E*, C*, RF*, SE*, SSE*, CX*, IV*, EX*) tienen su texto canónico en canon
reglas §4 y canon spec-OPL §2–§7.

## Definición (v1.4.1)

Esta spec es la SSOT OPL **bidireccional** y **operativa** de OPFORJA. Gobierna, para el lenguaje OPL del modelador, las dimensiones de generación (modelo → frases), parseo (frases → mutaciones), presentación, interacción, edición, configuración, manejo de fallos e invariantes de equivalencia.

La audiencia primaria son los agentes de desarrollo de OPFORJA y los agentes de generación/parseo OPL.

Esta spec es autocontenida: un agente conforme NO DEBE necesitar abrir `opm-opl-es` (`urn:fxsl:kb:opl-es`) ni `reglas-opm-estrictas-es §4` para implementar una entrada. Las plantillas, vocabulario y restricciones necesarias DEBEN aparecer en esta spec. La procedencia a esas fuentes se expresa con `Rationale:`.

Frontera documental: esta spec legisla la modalidad textual y el roundtrip desde OPL. La validez nuclear y severidad pertenecen a `reglas-opm-estrictas-es`; la geometría y canvas pertenecen a `spec-forja-opd-es`; el método pertenece a `metodologia-forja-es`; la lectura formal pertenece a `opm-categorial-es`. Esta spec PUEDE citar esos artefactos, pero NO DEBE copiar sus reglas completas salvo lo necesario para que una entrada OPL sea aplicable sin abrir otra fuente.

## Definiciones (v1.4.1)

| Término | Definición |
| --- | --- |
| Oración atómica | Frase OPL que expresa un solo hecho del modelo y no admite descomposición sin perder el hecho. |
| Oración compuesta | Frase OPL que coordina dos o más hechos en una sola realización superficial (p. ej. agregación con varias partes). |
| Sub-span | Tramo contiguo de texto dentro de una oración que mapea a un único token o referencia de modelo. |
| Hecho | Unidad mínima del modelo (cosa, enlace, estado, relación) que una oración OPL realiza textualmente. |
| `ref` | Referencia tipada de un sub-span a la entidad de modelo (cosa, estado, enlace) que representa. |
| `hint` | Anotación no normativa adjunta a un span que orienta presentación, interacción o edición sin alterar el hecho. |
| Token | Unidad léxica de una oración OPL (palabra de objeto, verbo de proceso, valor de estado, conector o puntuación) reconocible por generación y parseo. |
| Esencia | Propiedad genérica de una cosa: física o informacional. |
| Afiliación | Propiedad genérica de una cosa: sistémica o ambiental. |
| Placeholder | Marcador de span pendiente de completar (objeto/proceso/estado sin nombre) emitido para edición guiada. |
| Plegado | Supresión deliberada de hechos refinados en un OPD ascendente, con su realización OPL equivalente. |
| Display-vs-canónico | Distinción entre la forma visible de una oración (presentación) y su forma canónica normalizada (equivalencia y roundtrip). |

## Precedencia (v1.4.1)

Esta spec DEBE mandar sobre la implementación OPL de OPFORJA (generadores, parser, presentación e interacción) y sobre todo texto OPL emitido, parseado o editado por opforja.

Esta spec DEBE quedar **bajo** el canon prescriptivo `reglas-opm-estrictas-es` (`urn:fxsl:kb:reglas-opm-estrictas-es`) para el canon OPM nuclear: ante conflicto sobre qué es una cosa, un enlace, un estado, una relación, una severidad o una extensión declarada, prevalece ese documento.

Esta spec es SSOT primaria de la modalidad OPL operativa. Debe quedar compatible con la SSOT OPM externa (`urn:fxsl:kb:opl-es` y `urn:fxsl:kb:opm-es`): ante conflicto de gramática o semántica base no declarado como restricción local, debe abrirse corrección documental.

Esta spec NO DEBE relajar ningún contrato de las fuentes superiores; solo PUEDE operacionalizarlo, restringirlo o declarar extensiones marcadas.

Rationale: la autoridad semántica del proyecto es la SSOT OPM y el canon prescriptivo Forja, no la herramienta; OPFORJA operacionaliza OPL pero no redefine OPM.

## Convenciones (v1.4.1)

### Tipografía

Un **objeto** DEBE escribirse en negrita; un *proceso* en cursiva; un `estado` o `valor` entre backticks. Esta convención es obligatoria en toda frase OPL y ejemplo de esta spec.

### Esquema de IDs

Las entradas DEBEN reusar los IDs ya canonizados en `urn:fxsl:kb:reglas-opm-estrictas-es`: `D1`–`D13` (designaciones de cosas), `T1`–`T3`/`TS1`–`TS5` (enlaces transformadores), `H*`/`HS*` (habilitadores: agente e instrumento), `E*` (eventos), `C*` (condiciones), `SE*` (estructurales etiquetados), `RF*` (relaciones estructurales fundamentales), `SSE*` (estructurales con estado especificado), `CX*` (refinamiento/gestión de contexto), `CM*` (gestión de complejidad). Las glosas son espejo literal de `reglas §4.4`–`§4.11`. Para hechos no cubiertos por esos rangos, esta spec PUEDE acuñar IDs nuevos, que NO DEBEN colisionar con los existentes.

### Lenguaje de obligación

Las obligaciones DEBEN usar keywords RFC 2119 en es-CL mayúsculas, enum cerrado: DEBE, NO DEBE, DEBERÍA, NO DEBERÍA, PUEDE. El hedging NO DEBE reemplazar una keyword.

### Patrón regla + ejemplo + traza

Toda regla con más de una condición o riesgo de mala lectura DEBE anclarse con `Correcto:` / `Incorrecto:` y cerrar con `Rationale:`.

Correcto: `*Cocinar* consume **Ingrediente**.`

Incorrecto: `Cocinar consume ingrediente.`

Rationale: la tipografía es portadora de tipo; sin ella el parser no distingue objeto de proceso.

### Convención de trazabilidad

La procedencia conceptual DEBE expresarse con `Rationale:`. Esta spec NO DEBE usar `Traces to:`, reservado a la Formal Layer categorial de KORA.

### Cómo leer una entrada

Cada entrada del cuerpo normativo DEBE estructurarse con los campos del esquema, en este orden cuando apliquen: ID, Plantilla, Emisión, Supresión, Tokenización, Orden, Composabilidad, Reverse, Edición, Interacción, Roundtrip, Edge cases, Traza a código, Procedencia.

### Precedencia de fuentes

Cuando dos fuentes informan una entrada, el orden DEBE ser:

1. `urn:fxsl:kb:reglas-opm-estrictas-es` decide validez, severidad y extensión declarada.

2. `urn:fxsl:kb:opl-es` y esta spec deciden gramática textual, vocabulario, plantillas, parseo y roundtrip OPL.

3. `urn:fxsl:kb:spec-forja-opd-es` decide solo la contraparte visual cuando una entrada OPL cruza el puente OPD<->OPL.

4. `urn:fxsl:kb:metodologia-forja-opm-es` decide solo el método de modelamiento; `urn:fxsl:kb:opm-categorial-es` decide solo la explicación formal bajo superficie.

5. El libro de Dori, videos OPCloud y curso pedagógico son evidencia o intuición; no canonizan por sí solos.

Cuando el canon calla, la entrada DEBE marcarse como no-canonizado o extensión declarada; NO DEBE inventar canon.

## §1 Vocabulario fijo de verbos y cópulas

[endurecimiento] El vocabulario OPL-ES es un **enum cerrado**. La generación NO DEBE emitir un verbo o cópula fuera de esta sección; el parseo NO DEBE reconocer como verbo OPL un token ausente de esta sección. Todo verbo DEBE emitirse en tercera persona singular del presente indicativo, salvo que la plantilla imponga otra forma (plural por multiplicidad, negación, pasiva refleja).

Rationale: `reglas §4.3` (R-OPL-VERB-1) y `opm-opl-es §2` cierran la superficie verbal; un verbo libre rompe la bidireccionalidad generación↔parseo.

### §1.1 Enum de verbos y cópulas

| Verbo / cópula | Significado | Familia(s) de oración | Traza a código |
| --- | --- | --- | --- |
| consume | el proceso destruye el objeto | T1, TS1; condición/evento de consumo | `procedural.ts·oracionProcedural` (`consume`) |
| genera | el proceso crea el objeto | T2, TS2; condición/evento de resultado | `procedural.ts·oracionProcedural` (`genera`) |
| afecta | el proceso modifica el objeto sin estados explícitos | T3, TS3 | `procedural.ts·oracionProcedural` (`afecta`) |
| cambia … de … a | el proceso transforma el estado del objeto | cambio de estado; condición/evento de cambio | `procedural.ts·oracionCambioEstado` (`cambia … de … a`) |
| maneja | el agente humano habilita el proceso | agente | `procedural.ts·oracionProcedural` (`maneja`) |
| requiere | el proceso depende del instrumento | instrumento | `procedural.ts·oracionProcedural` (`requiere`) |
| inicia | el objeto/estado dispara el proceso | evento | `procedural.ts·oracionEvento` (`inicia`) |
| invoca | un proceso dispara otro proceso | invocación; autoinvocación | `procedural.ts·oracionProcedural` (`invoca`, `se invoca`) |
| ocurre | el proceso se ejecuta bajo condición o excepción | condición; excepción de duración | `procedural.ts·oracionCondicion` / excepción (`ocurre si`) |
| existe | el objeto está presente como precondición | condición de existencia | `procedural.ts·oracionCondicion` (`… existe`) |
| se omite | el proceso no se ejecuta (rama negativa) | condición (alternativa) | `procedural.ts·oracionCondicion` (`se omite`) |
| se consume | el objeto se destruye (voz pasiva refleja) | condición de consumo | `procedural.ts·oracionCondicion` (`se consume`) |
| consta de | el todo agrega las partes | agregación-participación | `estructural.ts·oracionEstructural` (`consta de` / `constan de`) |
| exhibe | el exhibidor caracteriza atributos/operaciones | exhibición-caracterización | `estructural.ts·oracionEstructural` (`exhibe` / `exhiben`) |
| tiene un … opcional | el exhibidor porta un rasgo de multiplicidad opcional (extensión declarada, §6.2 RF2o) | exhibición con rasgo opcional | `estructural.ts·oracionEnlaceEstructural` (variante opcional) / `parsear.ts` (`tiene un … opcional`, plural `tiene … opcionales`) |
| son | varias especializaciones son la general (plural) | especialización jerárquica | `estructural.ts·oracionEstructural` (`son`) |
| es un / es una | una especialización es la general (singular) | especialización jerárquica | `estructural.ts·oracionEstructural` (`es un`) |
| es una instancia de | la instancia pertenece a la clase | clasificación-instanciación | `estructural.ts·oracionEstructural` (`es una instancia de` / `son instancias de`) |
| se relaciona con | enlace estructural etiquetado nulo | tagged sin etiqueta de usuario | `procedural.ts·oracionEstructuralEtiquetada` (`se relaciona con` / `se relacionan`) |
| varía de … a | el atributo recorre un rango de valores | rango de atributo | GAP-VARIA |
| es de tipo | la cosa declara su tipo | declaración de tipo | GAP-TIPO |
| puede estar | el objeto enumera sus estados posibles | enumeración de estados (D5, D6) | `duracionMetadata.ts·oracionEstados` (`puede estar`) |
| puede ser | la especialización XOR enumera generales mutuamente excluyentes | especialización XOR (RX1, RX2) | GAP-XOR-FEATURE |
| se descompone | el proceso se descompone (in-zooming) en subprocesos | descomposición síncrona | `refinamiento.ts·oracionRefinamiento` (`se descompone en`) |
| se despliega | la cosa se despliega (unfolding) en refinados | despliegue asíncrono | `refinamiento.ts·oracionRefinamiento` (`se despliega en`) |
| se refina | refinamiento explícito entre OPDs por descomposición | refinamiento inter-OPD | GAP-REFINA |
| se pliega | supresión de hechos refinados en OPD ascendente | plegado | GAP-PLIEGA |
| se recompone | recomposición desde refinados | recomposición | GAP-RECOMPONE |

Notas de traza:

- `cambia` aparece además como `hint` de los enlaces consumo/resultado en `refsHints.ts·hintEnlace` y `refsHints.ts` (mapa `consumo`/`resultado`), coherente con la emisión de `oracionCambioEstado`.

- GAP-VARIA, GAP-TIPO, GAP-XOR-FEATURE, GAP-REFINA, GAP-PLIEGA, GAP-RECOMPONE: el verbo es canónico (`reglas §4.3` / `opm-opl-es §2`) pero ningún generador de `app/src/opl/generadores/` lo emite hoy.

Rationale: `reglas §4.3` (tabla de verbos) y `opm-opl-es §2`.

## §2 Entidades

### §2.0 Reglas duras transversales

- **R-ENT-2**: la generación NO DEBE emitir OPL canónica para una cosa con nombre **placeholder** (objeto/proceso sin nombrar) ni para un `estado` con nombre placeholder. La realización canónica solo procede cuando la cosa tiene nombre canónico.

  Rationale: `nombresCanonicos.ts` define `esNombreProcesoPlaceholder` y `esNombreEstadoCanonico`; un nombre placeholder no es un hecho de modelo afirmable.

- **R-ENT-2-APUNTE (excepción de apunte a R-ENT-2)**: en una **especie apunte**, R-ENT-2 NO aplica: las cosas con nombre placeholder (objeto, proceso, `estado`) DEBEN emitir su OPL — oración de existencia y enlaces — en **toda la generación, incluida la canónica**. La excepción es de **régimen por especie**, no de superficie: panel, editor libre, exports (Markdown, documento canónico), puente skill (`mesa pull`/contexto W6.0) y lectura móvil emiten el mismo texto. El **diagnóstico** de nominación (`reglas` R-NOM-PROC-1, observación por-clase en apuntes) sigue emitiéndose: la mesa acompaña e invita a nombrar con forma verbal, sin bloquear. Al **graduar** el apunte a modelo, R-ENT-2 vuelve a regir por sí sola (el régimen lee la especie viva del workspace). La autoría headless (bundles compilados) permanece en régimen riguroso.

  Rationale: en un modelo, un nombre placeholder no es un hecho afirmable; en un **boceto**, el placeholder ES el hecho — afirma que hay una cosa aún sin nombrar, y la bisimetría canvas↔OPL exige contarla. Coherencia doctrinal: el apunte relaja el **rigor de cierre**, no la semántica (`metodologia-forja-opm-es` A1.5, `spec-forja-opd-es` R-OPD-REF-20); R-ENT-2 es rigor de cierre. Neutraliza GAP-PLACEHOLDER-OBJETO para la especie apunte. Roundtrip verificado: el parser no filtra placeholders y el canónico de apunte re-parsea con cero patches (enmienda 2026-07-09, BUG-76af16 deep-opm-pro).

- (R-ENT-3, parte de producto) [extensión] (extensión declarada de superficie — eco OPCloud): la emisión OPFORJA de esencia y afiliación de una cosa DEBE **componerse en UNA sola oración** con el sustantivo de tipo, coordinadas con «y»: `**Cosa** es un {objeto|proceso} {esencia} y {afiliacion}.` Es la forma del eco OPCloud, declarada aquí como **extensión de superficie** que operacionaliza las designaciones atómicas D1–D4 de `reglas §4.4` **sin derogarlas**: D1–D4 siguen siendo las plantillas canónicas de la capa suprema y son entrada reverse VÁLIDA (el parser las acepta, `parsear.ts·parsearClasificacionRasgo`). La perseverancia (persistente/transitoria), si se emite, va en oración aparte. Producción `(* ext §2.0 *)` en §18.

  Preferida en emisión OPFORJA: `**Sensor** es un objeto físico y ambiental.`
  No preferida en emisión (pero canónica por `reglas §4.4` y parseable): `**Sensor** es física.` seguido de `**Sensor** es ambiental.` (forma atómica escindida D1+D3)
  Rationale: `estructural.ts·oracionEntidad` compone la oración combinada (forward); `parsear.ts` acepta tanto la combinada (forma colapsada) como la atómica escindida (G2: aditividad, nunca rechazo de OPL válida). Forma observada en OPCloud: `*Rescatar* es un proceso informacional y sistémico.` (evidencia de producto, no canon). Bajo `solo-difiere` se coordinan solo las propiedades que difieren del default.

### §2.1 Objeto

**Emisión**: la presencia de un **objeto** en un OPD emite, según `oracionEntidad`, las oraciones de esencia y afiliación que apliquen (ver §2.7–§2.8). Un **objeto** sin propiedades divergentes y sin estados PUEDE no producir oración autónoma alguna; existe en el párrafo solo como span dentro de oraciones de enlace.

**Supresión**: un **objeto** con nombre placeholder NO DEBE producir OPL canónica (R-ENT-2). La supresión se decide por `nombresCanonicos.ts`.

**Tokenización**: el nombre del **objeto** es un token de objeto; su `ref` apunta a la entidad. Las palabras léxicas DEBEN capitalizarse; artículos y preposiciones breves PUEDEN quedar en minúscula.

**Reverse**: el span de objeto se parsea como referencia a una cosa existente o como creación de cosa nueva, según el contexto de la oración. El nombre por sí solo no es oración parseable.

**Roundtrip**: el nombre del **objeto** DEBE preservarse íntegro tras generación → parseo → generación.

**Traza a código**: `app/src/opl/generadores/estructural.ts·oracionEntidad`; supresión de placeholder en `app/src/modelo/nombresCanonicos.ts`.

> GAP-PLACEHOLDER-OBJETO: la supresión de placeholder (R-ENT-2) está conectada para *procesos* — `refsHints.ts·entidadOplEsEmitible` (en `generar.ts`) suprime procesos placeholder vía `esNombreProcesoPlaceholder` antes de emitir OPL —, pero los **objetos** placeholder no se filtran (rama objeto de R-ENT-2 sin implementar; `checkers.ts` sí los reconoce) — ver §20. El GAP rige solo en régimen riguroso: la **especie apunte** queda fuera por R-ENT-2-APUNTE (§2.0, v1.3.0).

Rationale: `reglas §2.2` (R-OBJ-1..7) y `opm-opl-es §3`.

### §2.2 Proceso

**Supresión**: un *proceso* con nombre placeholder (`proceso`, `proceso N`, `proceso parte N`) NO DEBE producir OPL canónica (R-ENT-2).

**Tokenización**: el nombre del *proceso* es un token de proceso con `ref` a la entidad.

**Reverse**: el span de proceso se parsea como referencia o creación de *proceso* según contexto.

**Roundtrip**: el nombre del *proceso* DEBE preservarse íntegro.

**Traza a código**: span/clasificación en `app/src/opl/generadores/estructural.ts·oracionEntidad`; supresión en `app/src/modelo/nombresCanonicos.ts·esNombreProcesoPlaceholder`, conectada vía `refsHints.ts·entidadOplEsEmitible` (residual de objetos en GAP-PLACEHOLDER-OBJETO, §20).

Rationale: `reglas §2.3` (R-PROC-1..7) y `§2.4` (nombres), `opm-opl-es §3.4`.

### §2.3 Estado y enumeración de estados

**Supresión**: si algún estado del objeto NO es canónico (placeholder), la enumeración NO se emite; la emisión es atómica (todo-o-nada por objeto). Un estado individual marcado `suprimido` se excluye del listado.

**Reverse**: la oración `puede estar` se parsea como declaración de estados del objeto (reversible).

**Roundtrip**: la lista de estados y su orden DEBEN preservarse; `roundtrip.test.ts` defiende la enumeración.

**Traza a código**: `app/src/opl/generadores/duracionMetadata.ts·oracionEstados` (`puede estar`), re-exportado por `app/src/opl/generadores/designaciones.ts`; canonicidad de nombre de estado en `app/src/modelo/nombresCanonicos.ts·esNombreEstadoCanonico`.

Rationale: `reglas §4.4` (D5, D6), `§2.6` (R-EST-1) y `opm-opl-es §3.2`.

### §2.4 Designación de estado

La designación `declarado \`Current\`` (D13) es extensión de producto; su plantilla vive en perfil reglas-opforja §4.4 [extensión]. El canon spec-OPL §2.4 fija D7–D10 y D15–D17.

**Emisión**: se emite una oración de designación por cada `estado` con designación distinta de normal. Un `estado` PUEDE ser simultáneamente inicial y final (D10); en ese caso se emite una sola oración combinada, no dos.

**Reverse**: la oración de designación se parsea como asignación de designación al estado.

**Roundtrip**: la designación DEBE preservarse.

**Traza a código**: `app/src/opl/generadores/designaciones.ts·oracionDesignacionEstado` y `textoDesignacionEstado`.

Rationale: `reglas §4.4` (D7–D10, D13), `§2.6` (R-EST-2..4) y `opm-opl-es §3.3`.

### §2.5 Atributo y valor

**Emisión**: cuando un **objeto** caracteriza un **atributo** (vía exhibición-caracterización), el **atributo** se realiza como cosa-objeto que pertenece al **objeto** mediante `de`. Si el **atributo** porta un `valorSlot`, se emite la oración `es valor` (con unidad opcional `[unidad]`). Los `valor` enumerados son **estados** del **atributo**, por lo que reusan la plantilla `puede estar` (§2.3).

**Supresión**: un **atributo** sin `valorSlot` no produce la oración `es valor`; un **atributo** placeholder no produce OPL canónica.

**Tokenización**: spans `ref` al atributo, al objeto caracterizado y a cada `valor`/`estado`. La unidad opcional es un span con `hint` de presentación, no un hecho ontológico nuevo.

**Reverse**: la oración `es valor` se parsea como asignación de valor al atributo; la enumeración de valores reusa el parseo de `puede estar`.

**Roundtrip**: atributo, valor y unidad DEBEN preservarse.

**Traza a código**: `app/src/opl/generadores/estructural.ts·oracionValorAtributo` (`es valor`, unidad). El enlace de exhibición-caracterización (`exhibe`) y la plantilla de rango (`varía de … a`) se canonizan en la sección de enlaces estructurales; `varía de … a` no tiene generador hoy (GAP-VARIA, declarado en §1.1).

Rationale: `reglas §4.13` (R-ATR-1, R-ATR-2) y `opm-opl-es §14`.

### §2.6 Instancia

**Tokenización**: el span `NombreInstancia` y el span `NombreClase` llevan `ref` a sus respectivas cosas.

**Reverse**: la relación `es una instancia de` se parsea como enlace de clasificación.

**Traza a código**: `app/src/opl/generadores/estructural.ts·oracionEnlaceEstructural` (caso `clasificacion`: `es una instancia de` / `son instancias de`). El formato de nombre `Instancia : Clase` es designación nominal; no hay generador dedicado que lo componga automáticamente (GAP-NOMBRE-INSTANCIA).

Rationale: `reglas §2.7` (R-INS-1..6) y `opm-opl-es §3`.

### §2.7 Esencia (física / informacional)

**Plantillas**: la esencia se realiza **dentro de la oración combinada de clasificación** con la afiliación (R-ENT-3, extensión declarada; §2.8): `**Cosa** es un {objeto|proceso} {esencia} y {afiliacion}.` Las designaciones atómicas D1 (`es física`) / D2 (`es informacional`) son las plantillas canónicas de `reglas §4.4`, no preferidas en la emisión OPFORJA pero válidas como entrada reverse.

**Emisión**: `oracionEntidad` incluye la esencia en la oración combinada cuando la visibilidad es `siempre`, o cuando la esencia **difiere del default** (informacional). Bajo `solo-difiere`, si solo la esencia difiere, la oración combinada lleva solo la esencia (`**Cosa** es un objeto físico.`).

**Reverse**: la oración de esencia se parsea como asignación de propiedad genérica.

**Roundtrip**: la esencia DEBE preservarse.

**Traza a código**: `app/src/opl/generadores/estructural.ts·oracionEntidad` (vía `textoEsencia` de `refsHints.ts`).

Rationale: `reglas §2.2` (R-OBJ-3, R-OBJ-5..6), `§4.4` (D1, D2) y `opm-opl-es §3.1`.

### §2.8 Afiliación (sistémica / ambiental)

**Plantillas**: la afiliación se realiza **en la misma oración combinada de clasificación** que la esencia (§2.7, R-ENT-3 extensión declarada): `**Cosa** es un {objeto|proceso} {esencia} y {afiliacion}.` D3 (`es ambiental`) / D4 (`es sistémica`) son las plantillas atómicas canónicas de `reglas §4.4`, válidas como entrada reverse.

**Emisión**: `oracionEntidad` incluye la afiliación en la oración combinada cuando la visibilidad es `siempre`, o cuando la afiliación **difiere del default** (sistémica). Bajo `solo-difiere`, si solo la afiliación difiere, la oración lleva solo la afiliación (`**Cosa** es un objeto ambiental.`).

**Supresión**: con visibilidad `oculta` no se emite. [endurecimiento] Un atributo de objeto ambiental DEBE ser ambiental; un *proceso* ejecutado por cosa ambiental DEBE modelarse ambiental.

**Tokenización**: span de la cosa con `ref`; `ambiental`/`sistémica` son palabras clave fijas de designación.

**Reverse**: la oración de afiliación se parsea como asignación de propiedad genérica.

**Roundtrip**: la afiliación DEBE preservarse.

**Edge cases**: esencia y afiliación se **coordinan en una sola oración** con sustantivo de tipo (R-ENT-3, forma OPCloud); la coma de Oxford no se usa (solo dos propiedades → `{esencia} y {afiliacion}`).

**Traza a código**: `app/src/opl/generadores/estructural.ts·oracionEntidad` (vía `textoAfiliacion` de `refsHints.ts`).

Rationale: `reglas §2.2` (R-OBJ-3, R-OBJ-6..7), `§4.4` (D3, D4) y `opm-opl-es §3.1`.

## §3 Enlaces transformadores

### §3.0 Asimetría consumo / resultado bajo modificadores

- **R-TR-ASIM-4**: el generador NO DEBE producir una oración de evento/condición de resultado y el parser NO DEBE construir un enlace de resultado con modificador `e`/`c`; tal entrada es OPL no canónica.

  Rationale: `reglas §6.3` (R-MOD-5: la matriz de fuerza semántica no contiene evento/condición de resultado).

### §3.1 Consumo (T1, TS1)

**Tokenización**: span de *proceso* con `ref` al proceso; `consume` token-verbo del enum §1.1; span de **objeto** con `ref` al objeto consumido; `estado` entre backticks con `ref` al estado (TS1).

**Reverse**: el parser, vía `ABANICO_VERBO_RE_LIST` (`/^(.+?)\s+consume\s+(.+)$/`, `tipo: "consumo"`, `puertoEsOrigen: false`), construye un enlace `consumo` con el **objeto** como origen y el *proceso* como destino; con `en \`estado\`` fija el estado especificado del extremo consumido.

**Roundtrip**: fixture `enlace-consumo-simple` (`fixtures-roundtrip.ts`), bisimetría estricta, oración `*Procesar* consume **Entrada**.`. El nombre del objeto, el verbo y el estado (TS1) DEBEN preservarse.

**Edge cases**: forma pasiva legacy `**Objeto** es consumido por *Proceso*` (`ABANICO_VERBO_RE_LIST`, `puertoEsOrigen: true`) es entrada parseable válida pero NO es la forma canónica emitida; el generador siempre emite la activa.

**Traza a código**: generación `app/src/opl/generadores/procedural.ts·oracionEnlaceSinEtiqueta` (caso `consumo`, línea ~199); parseo `app/src/opl/parser/parsear.ts·ABANICO_VERBO_RE_LIST` (entrada `consume`).

Rationale: `reglas §4.5` (T1, TS1), `§5.2` (R-CONS-1..3) y `opm-opl-es §4.1`, `§4.2`.

### §3.2 Resultado (T2, TS2)

**Tokenización**: span de *proceso* con `ref`; `genera` token-verbo; span de **objeto** con `ref`; `estado` con backticks y `ref` (TS2).

**Composabilidad**: participa en coordinación con sujeto-proceso compartido (preludio §9): `*P* genera **A**.` / `*P* genera **B**.` son coordinables. NO DEBE coordinarse con consumo/efecto en un predicado.

**Reverse**: parser vía `ABANICO_VERBO_RE_LIST` (`/^(.+?)\s+genera\s+(.+)$/`, `tipo: "resultado"`, `puertoEsOrigen: true`): el *proceso* es origen, el **objeto** destino. El resultado NO DEBE parsearse con modificador `e`/`c` (R-TR-ASIM-2, R-TR-ASIM-4).

**Roundtrip**: fixture `enlace-resultado-simple` (`fixtures-roundtrip.ts`), bisimetría estricta, oración `*Procesar* genera **Salida**.`.

**Edge cases**: forma pasiva legacy `**Objeto** es generado por *Proceso*` parseable (`puertoEsOrigen: false`), no canónica como emisión.

**Traza a código**: generación `app/src/opl/generadores/procedural.ts·oracionEnlaceSinEtiqueta` (caso `resultado`, línea ~201); parseo `app/src/opl/parser/parsear.ts·ABANICO_VERBO_RE_LIST` (entrada `genera`).

Rationale: `reglas §4.5` (T2, TS2), `§5.2` (R-RES-1) y `opm-opl-es §4.1`, `§4.2`.

### §3.3 Efecto (T3)

**Tokenización**: span de *proceso* con `ref`; `afecta` token-verbo; span de **objeto** con `ref`.

**Composabilidad**: coordinable por sujeto-proceso compartido (preludio §9); NO DEBE coordinarse con consumo/resultado.

**Reverse**: parser vía `ABANICO_VERBO_RE_LIST` (`/^(.+?)\s+afecta\s+(.+)$/`, `tipo: "efecto"`, `puertoEsOrigen: true`): *proceso* origen, **objeto** destino.

**Roundtrip**: cubierto por `fixtures-roundtrip.ts` (`enlace-efecto-simple`); el verbo y los nombres DEBEN preservarse.

**Traza a código**: generación `app/src/opl/generadores/procedural.ts·oracionEfecto` (caso sin estados, línea ~387); parseo `app/src/opl/parser/parsear.ts·ABANICO_VERBO_RE_LIST` (entrada `afecta`).

Rationale: `reglas §4.5` (T3), `§5.2` (R-EFE-1, R-EFE-2, R-EFE-2A, R-EFE-2B) y `opm-opl-es §4.1`.

### §3.4 Efecto entrada-salida (TS3)

- [extensión] Variante negada (extensión declarada): `*Proceso* no cambia **Objeto** de \`estado-entrada\` a \`estado-salida\`.`

  La variante negada NO es canon ISO: realiza el modificador `no` del kernel (negación del enlace; hecho de modelo: condición/instrumento sobre estado no-existente, enlace NOT compacto). La extensión está declarada en `spec-forja-opd-es` (R-OPD-CTL-5) con kernel en `metodologia-forja-es §NOT`; en OPCloud la negación es flag ortogonal a `c`/`e` (markers `*Negation`), mientras el kernel de la app la trata como tercer modificador excluyente — divergencia declarada. Emisión-only: sin ruta de parseo (GAP-NEGADA-REVERSE, §20). Aplica igual a las variantes negadas de §4.1 y §4.2.

**Tokenización**: span de *proceso* con `ref`; `cambia` + `de` + `a` tokens fijos; span de **objeto** con `ref`; `estado-entrada` y `estado-salida` entre backticks, cada uno con `ref` a su estado.

**Composabilidad**: TS3 NO DEBE coordinarse en un predicado con consumo/resultado; un fan de estados de salida sobre el mismo objeto se realiza vía abanico, no por coordinación copulativa.

**Reverse**: el parseo de cambio de estado completo (`/^(.+?)\s+cambia\s+(.+?)\s+de\s+\`?([^\`]+?)\`?\s+a\s+\`?([^\`]+?)\`?$/`, contexto condición/CS2 en `parsear.ts`) construye un enlace `efecto` con ambos estados especificados. El abanico de cambio se parsea por `ABANICO_CAMBIA_RE`.

**Roundtrip**: el *proceso*, el **objeto** y ambos estados DEBEN preservarse, igual que su orden. `fixtures-roundtrip.ts` incluye `cambio-estado-ts3` y `cambio-estado-ts3-compacto` como fixtures estrictas: el patch preserva arcos y `stateHints`, y el aplicador reconstruye los estados necesarios desde modelo vacío.

**Traza a código**: generación `app/src/opl/generadores/procedural.ts·oracionTransicionEstados` (líneas ~141–147, variantes evento/condición/negada/base); parseo `app/src/opl/parser/parsear.ts` (regex de cambio en contexto condición/CS2, línea ~621; abanico `ABANICO_CAMBIA_RE`, línea ~298).

Rationale: `reglas §4.5` (TS3), `§5.2` (R-EFE-2..2B), `§6.3` (R-TR-ASIM-3) y `opm-opl-es §4.2`.

### §3.5 Efecto escindido / parcial — solo entrada (TS4)

**Tokenización**: span de *proceso*; `cambia` + `de` tokens; span de **objeto**; `estado-entrada` con backticks y `ref`.

**Reverse**: el parser produce el régimen **(b)** efecto parcial standalone; el régimen (a) NUNCA proviene de parseo (R-ESCIND-0). La ruta standalone `cambia … de \`estado\`` está verificada por fixture estricta.

**Roundtrip**: `fixtures-roundtrip.ts` incluye `cambio-estado-ts4-solo-entrada` como fixture estricta. La única salvedad viva es de procedencia: cuando un par escindido se origina desde modelo, la spec aún no exige un metadato normativo que marque la escisión original.

**Traza a código**: generación `app/src/opl/generadores/procedural.ts·oracionEfecto` (rama `estadoOrigen && destino.tipo === "proceso"`, línea ~374: `cambia … de \`…\``). Escisión: `app/src/modelo/` (operación de descomposición; el metadato de procedencia escindido no se rastreó en este pase) — GAP-PROCEDENCIA-ESCIND.

Rationale: `reglas §4.5` (TS4), `§8.4` (R-ESCIND-0..3, R-ESC-1), `§5.2` (R-EFE-3) y `opm-opl-es §4.2`.

### §3.6 Efecto escindido / parcial — solo salida (TS5)

**Tokenización**: span de *proceso*; `cambia` + `a` tokens; span de **objeto**; `estado-salida` con backticks y `ref`.

**Reverse**: el parser acepta la forma standalone output-only `cambia … a \`estado\`` sin `de`; la cobertura está verificada por fixture estricta.

**Roundtrip**: `fixtures-roundtrip.ts` incluye `cambio-estado-ts5-solo-salida` como fixture estricta.

**Traza a código**: generación `app/src/opl/generadores/procedural.ts·oracionEfecto` (rama `estadoDestino && origen.tipo === "proceso"`, línea ~377: `cambia … a \`…\``). Escisión: ver GAP-PROCEDENCIA-ESCIND (§3.5).

Rationale: `reglas §4.5` (TS5), `§8.4` (R-ESCIND-0, R-ESCIND-3, R-ESC-1) y `opm-opl-es §4.2`.

## §4 Enlaces habilitadores

### §4.0 Reglas duras transversales — agente vs instrumento

- **R-HAB-AG-4**: cuando el desgaste, degradación o amortización del **instrumento** es relevante al alcance, el instrumento DEBE reclasificarse como afectado (deja de ser habilitador y pasa a enlace de efecto). En ese caso el modelo DEBERÍA agregar atributo de degradación y *proceso* de mantenimiento separado; si el mantenimiento queda fuera del alcance, el modelo DEBE declarar esa exclusión.

  Rationale: `reglas §5.3` (R-AG-3, R-AG-4); reclasificación por desgaste.

### §4.1 Agente (H1, HS1)

- [extensión] Variante negada (extensión declarada, ver §3.4; emisión-only, GAP-NEGADA-REVERSE): `**Agente** no maneja *Proceso*.`

**Tokenización**: span de **agente** con `ref` al objeto; `maneja`/`manejan` token-verbo del enum §1.1; span de *proceso* con `ref` al proceso; `estado` entre backticks con `ref` al estado (HS1).

**Composabilidad**: participa en coordinación de habilitadores con *proceso* compartido (preludio §9): varias oraciones `**A** maneja *P*.` / `**B** maneja *P*.` con el mismo *proceso* son candidatas a coordinación. La coordinación de habilitadores NO DEBE mezclar agente con instrumento en un solo predicado (verbos distintos, sujetos distintos: agente=sujeto, instrumento=complemento). Un fan de agentes sobre el mismo proceso bajo operador lógico se realiza vía abanico, no por coordinación copulativa.

**Reverse**: el parser, vía `ABANICO_VERBO_RE_LIST` (`/^(.+?)\s+maneja\s+(.+)$/`, `tipo: "agente"`, `puertoEsOrigen: true`), construye un enlace `agente` con el **objeto** como origen y el *proceso* como destino; con `en \`estado\`` fija el estado especificado del extremo agente. La forma condicional se parsea por `CONDICION_AGENTE_RE` (existe / `está en \`estado\``).

**Roundtrip**: fixture `enlace-agente-simple` (`fixtures-roundtrip.ts`), bisimetría estricta, oración `**Operador** maneja *Procesar*.`. El nombre del agente, el verbo y el estado (HS1) DEBEN preservarse.

**Edge cases**: forma pasiva legacy `*Proceso* es manejado por **Agente**` (`ABANICO_VERBO_RE_LIST`, `puertoEsOrigen: false`) es entrada parseable válida pero NO es la forma canónica emitida; el generador siempre emite la activa con el agente como sujeto.

**Traza a código**: generación `app/src/opl/generadores/procedural.ts·oracionEnlaceSinEtiqueta` (caso `agente`, línea ~191-192: `maneja`/`manejan`); estado especificado vía `app/src/opl/generadores/refsHints.ts·nombreOplExtremo` (sufijo `en \`estado\``, línea ~187); evento línea ~264; condición línea ~298-301; negada línea ~342. Parseo `app/src/opl/parser/parsear.ts·ABANICO_VERBO_RE_LIST` (entrada `maneja`, línea ~289) y `CONDICION_AGENTE_RE` (línea ~544).

Rationale: `reglas §4.6` (H1, HS1), `§5.3` (R-AG-1, R-AG-1A, R-AG-1B, R-AG-2) y `opm-opl-es §5`, `§1.9`.

### §4.2 Instrumento (H2, HS2)

- [extensión] Variante negada (extensión declarada, ver §3.4; emisión-only, GAP-NEGADA-REVERSE): `*Proceso* no requiere **Instrumento**.`

**Tokenización**: span de *proceso* con `ref` al proceso; `requiere`/`requieren` token-verbo del enum §1.1; span de **instrumento** con `ref` al objeto; `estado` entre backticks con `ref` al estado (HS2).

**Composabilidad**: participa en coordinación de habilitadores con *proceso*-sujeto compartido (preludio §9): varias oraciones `*P* requiere **A**.` / `*P* requiere **B**.` con el mismo *proceso* son candidatas a coordinación copulativa de complementos. La coordinación NO DEBE mezclar instrumento con agente ni con transformadores (verbos distintos, roles distintos). Un fan de instrumentos sobre el mismo proceso bajo operador lógico se realiza vía abanico.

**Reverse**: el parser, vía `ABANICO_VERBO_RE_LIST` (`/^(.+?)\s+requiere\s+(.+)$/`, `tipo: "instrumento"`, `puertoEsOrigen: false`), construye un enlace `instrumento` con el **objeto** como origen y el *proceso* como destino; con `en \`estado\`` fija el estado especificado del extremo instrumento. La forma condicional se parsea por la ruta `CONDICION_OCURRE_RE` con `base: "instrumento"`.

**Roundtrip**: fixture `enlace-instrumento-simple` (`fixtures-roundtrip.ts`), bisimetría estricta, oración `*Procesar* requiere **Herramienta**.`. El nombre del instrumento, el verbo y el estado (HS2) DEBEN preservarse.

**Edge cases**:

- Forma pasiva legacy `**Instrumento** es requerido por *Proceso*` (`ABANICO_VERBO_RE_LIST`, `puertoEsOrigen: true`) es entrada parseable válida pero NO es la forma canónica emitida.

- Forma posesiva: cuando el verbo del instrumento expresa conducción/manejo de la cosa (`manejar`/`conducir`), `oracionInstrumentoPosesiva` PUEDE emitir una superficie alterna (`procedural.ts·oracionInstrumentoPosesiva`, línea ~390); esta es realización condicionada por el verbo léxico, no la canónica `requiere`.

**Traza a código**: generación `app/src/opl/generadores/procedural.ts·oracionEnlaceSinEtiqueta` (caso `instrumento`, línea ~193-196: `requiere`/`requieren`); estado especificado vía `refsHints.ts·nombreOplExtremo` (línea ~187); evento línea ~266; condición línea ~303; negada línea ~344; posesiva línea ~390. Parseo `app/src/opl/parser/parsear.ts·ABANICO_VERBO_RE_LIST` (entrada `requiere`, línea ~286), ruta condición `base: "instrumento"` (línea ~578) y formas plurales `requieren?` (línea ~908).

Rationale: `reglas §4.6` (H2, HS2), `§5.3` (R-AG-2, R-AG-3, R-AG-4) y `opm-opl-es §5`, `§1.9`.

### §4.3 GAPs de cobertura — habilitadores

- GAP-FIXTURE-HS: cerrado para emisión HS1/HS2 por `fixtures-roundtrip.ts` (`habilitador-con-estado-hs`). Las variantes evento/condición/negada de habilitador siguen cubiertas por tests de parser/generador, no por fixture estricta.

- GAP-FIXTURE-ABANICO-HABILITADOR: la cobertura de parseo del fan de instrumento/agente e inversos está verificada (2026-06-12) — `parsear.ts·ABANICO_VERBO_RE_LIST` (~305–317) mapea `requiere` (instrumento), `es requerido por` (instrumento inverso), `maneja` (agente) y `es manejado por` (agente inverso), y el loop genérico de `parsearAbanicoDirecto` (~357–369) los combina con el cuantificador XOR/OR, espejo de la emisión de `abanico.ts` —, pero ninguna fixture estricta ni test de parser dedicado la defiende contra regresión.

## §5 Modificadores de control

### §5.0 Reglas duras transversales — naturaleza y lado de aplicación

- **R-MOD-CAT-3** [endurecimiento]: la combinación `c` + `e` sobre el mismo enlace NO está canonizada; la generación NO DEBE emitirla y el parser NO DEBE construirla.

  Rationale: `reglas §6.4` (`c` + `e` sobre el mismo enlace = no definido en SSOT).

### §5.1 Evento (E\*)

**Tokenización**: span del **objeto**/estado disparador con `ref` al extremo Pre(P); `inicia` (e `inicia y maneja` para agente) token-clave de evento; la cláusula relativa reusa los tokens del enlace base (`consume`/`afecta`/`requiere`/`cambia … de … a`); `estado` entre backticks con `ref` (ETS\*, EHS\*). El sufijo de probabilidad (`Pr=p`) es un span con `hint`, no un hecho ontológico nuevo.

**Reverse**: la oración de evento se parsea como enlace base con `modificador: "e"`. La forma de consumo con estado (ETS1) y cambio (ETS2) se reconstruye con el estado especificado del extremo Pre(P).

**Roundtrip**: el disparador, el verbo base, el *proceso* y los estados (ETS\*/EHS\*) DEBEN preservarse. GAP-FIXTURE-EVENTO: cerrado para evento canónico básico por `fixtures-roundtrip.ts` (`evento-consumo-canonico`); los eventos con estado se mantienen cubiertos por tests dedicados de parser/generador.

**Edge cases**:

- GAP-EVENTO-RESULTADO: cerrado. `procedural.ts·oracionEvento` degrada un evento sobre resultado a la oración base de resultado; `**X** inicia *Proceso*, que genera **X**` ya no se exporta.

- GAP-EVENTO-INVOCACION: cerrado. `procedural.ts·oracionEvento` degrada un evento sobre invocación a la invocación base; `**X** inicia e invoca *Y*` ya no se exporta.

**Traza a código**: generación `app/src/opl/generadores/procedural.ts·oracionEvento` (líneas ~253–287); cambio de estado con evento `oracionTransicionEstados` (línea ~141); despacho del modificador `oracionEnlace` (línea ~178). Parseo `app/src/opl/parser/parsear.ts` (ruta de evento) y `parser.condicionesExcepciones.test.ts`.

Rationale: `reglas §4.7` (ET1–EHS2), `§6.3` (R-MOD-2, asimetría), `§6.5` (niveles 1, 4, 7, 10 de fuerza semántica) y `opm-opl-es §6`.

### §5.2 Condición (C\*)

**Tokenización**: span del *proceso* con `ref`; `ocurre si` / `maneja … si` clave de condición; span del extremo Pre(P) con `ref`; `existe` o `está en \`estado\``; `en cuyo caso` (rama positiva, cuando aplica); verbo base + objeto; `de lo contrario` + *proceso* + `se omite`.

**Reverse**: la oración condicional se parsea como enlace base con `modificador: "c"`. `parser.condicionesExcepciones.test.ts` cubre CT1 (línea ~94), CT2 (~108), CH2/existencia (~120), CS1 (~143), CS2 con cambio de estado (~157) y CS3/solo-entrada (~171). La forma condicional de agente se reconstruye por `CONDICION_AGENTE_RE`; la de instrumento por `CONDICION_OCURRE_RE` con `base: "instrumento"`.

**Edge cases**:

- GAP-CONDICION-RESULTADO: cerrado. `procedural.ts·oracionCondicion` degrada una condición sobre resultado a la oración base de resultado; la superficie `puede generarse` ya no se exporta.

- GAP-CONDICION-INVOCACION: cerrado. `procedural.ts·oracionCondicion` degrada una condición sobre invocación a la invocación base; `*X* invoca *Y* si *X* ocurre` ya no se exporta.

**Traza a código**: generación `app/src/opl/generadores/procedural.ts·oracionCondicion` (líneas ~289–328); cambio de estado condicional `oracionTransicionEstados` (línea ~143); despacho del modificador `oracionEnlace` (línea ~181). Parseo `app/src/opl/parser/parsear.ts` (`CONDICION_AGENTE_RE` línea ~544, `CONDICION_OCURRE_RE`, regex de cambio en contexto CS2 línea ~621); tests `parser.condicionesExcepciones.test.ts`.

Rationale: `reglas §4.8` (CT1–CS6, R-OPL-COND-ALT-1..2, R-OPL-SUP-1), `§6.1` (bypass), `§6.3` (R-MOD-2) y `opm-opl-es §7`.

### §5.3 Excepción — sobretiempo (EX1) y subtiempo (EX2)

**Plantilla(s)**:

- [extensión] Variante combinada (extensión local): `*Manejo* ocurre si duración de *Fuente* es menor que mín-duración o excede máx-duración.`

- **R-EXC-AMBIENTAL-1** [endurecimiento]: el *proceso* de manejo de excepción DEBE ser **ambiental** (contorno discontinuo, `es ambiental` en §2.8). La fuente pertenece al sistema; el manejo del fallo temporal vive en el entorno.

  Correcto: `*Manejar Excepción* ocurre si duración de *Procesar* excede 5 minutos.` (con *Manejar Excepción* declarado ambiental)
  Rationale: `reglas §5.7` (R-EXC-1A) y `SSOT-visual §4.4`.

**Emisión**: un enlace `excepcionSobretiempo` emite `… excede <valor> <unidad>` con el *proceso* de manejo como sujeto (`ocurre`) y el *proceso* fuente tras `duración de`. Un enlace `excepcionSubtiempo` emite `… es menor que <valor> <unidad>`. El valor y la unidad se componen por `formatoTiempo`; si faltan, se emite el respaldo. La unidad temporal del sistema es default; un *proceso* con unidad distinta DEBE declararla (R-EXC-5).

**Tokenización**: span del *proceso* de manejo con `ref`; `ocurre si duración de` clave de excepción; span del *proceso* fuente con `ref`; `excede` (EX1) o `es menor que` (EX2) clave de cota; `<valor>` y `<unidad>` spans de magnitud temporal con `hint` de presentación.

**Reverse**: `parser.condicionesExcepciones.test.ts` cubre EX1 (`… excede 5 minutos`, línea ~33) y EX2 (`… es menor que 30 segundos`, línea ~44), reconstruyendo el enlace de excepción con su cota y unidad.

**Roundtrip**: el *manejo*, la *fuente*, la dirección de cota, el valor y la unidad DEBEN preservarse. `parser.condicionesExcepciones.test.ts` defiende ida y vuelta (líneas ~61, ~78).

**Traza a código**: generación `app/src/opl/generadores/procedural.ts·oracionEnlaceSinModificador` (casos `excepcionSobretiempo` ~206, `excepcionSubtiempo` ~208, `excepcionSubSobretiempo` ~210); composición de cota `formatoTiempoMaximo`/`formatoTiempoMinimo`/`formatoTiempo` (líneas ~217–232); metadato de duración `app/src/opl/generadores/duracionMetadata.ts`. Parseo y roundtrip `app/src/opl/parser/parser.condicionesExcepciones.test.ts`.

> GAP-EXC-UNIDADES-LITERAL: la plantilla canónica `opm-opl-es §8.1` usa el literal `unidades-tiempo`; el generador compone valor+unidad concretos vía `formatoTiempo` (p. ej. `excede 5 minutos`) y, sin cota declarada, emite el respaldo `su duración máxima`. La superficie operativa diverge del literal de la plantilla sin contradecir el hecho; se declara como operacionalización local de `unidades-tiempo`.

**Nota de realización**: `unidades-tiempo` es metavariable de plantilla. En OPFORJA la superficie exportada DEBE realizarla como `<valor> <unidad>` cuando ambos existen (`formatoTiempo`); si falta la cota, la frase de respaldo preserva el tipo de excepción sin inventar duración.

Rationale: `reglas §4.9` (EX1, EX2), `§5.7` (R-EXC-1..5) y `opm-opl-es §8.1`.

### §5.4 Invocación (IV1) y autoinvocación (IV2)

**Plantilla(s)**:

- [extensión] IV1 con demora (extensión local): `*Invocador* invoca *Invocado* después de <demora>.`

- [extensión] IV2 con demora (extensión local): `*Invocador* se invoca a sí mismo después de <demora>.`

**Tokenización**: span del *invocador* con `ref`; `invoca`/`invocan` (IV1) o `se invoca a sí mismo` (IV2) clave de invocación; span del *invocado* con `ref` (IV1); `después de <demora>` span de magnitud con `hint`. El parser acepta además `despues de` como compatibilidad legacy.

**Reverse**: la oración `*X* invoca *Y*` se parsea como enlace de invocación proceso→proceso; `*X* se invoca a sí mismo` como autoinvocación. El abanico de invocación se parsea por la ruta de abanico.

**Roundtrip**: el *invocador*, el *invocado* y la demora DEBEN preservarse. GAP-FIXTURE-INVOCACION está cerrado: `fixtures-roundtrip.ts` cubre `invocacion-con-demora-tilde` y `autoinvocacion-con-demora-tilde` como fixtures estrictas, y la degradación de evento sobre invocación (`evento-invocacion-degrada-base`).

**Edge cases**:

- La grafía canónica es `después de`. GAP-INVOCACION-TILDE: cerrado en `procedural.ts`; el parser acepta además `despues de` como compatibilidad legacy.

- Las formas `inicia e invoca` (evento) e `invoca … si … ocurre` (condición) VIOLAN R-IV-3 / R-MOD-CAT-1; el generador ya no las exporta y degrada a invocación base (ver GAP-EVENTO-INVOCACION en §5.1 y GAP-CONDICION-INVOCACION en §5.2).

**Traza a código**: generación `app/src/opl/generadores/procedural.ts·oracionEnlaceSinModificador` (autoinvocación línea ~187, invocación línea ~204–205); detección `app/src/modelo/autoinvocacion.ts·esAutoInvocacion`.

Rationale: `reglas §4.9` (IV1, IV2), `§5.4` (R-INV-1..2B) y `opm-opl-es §8.2`.

### §5.5 GAPs de cobertura — modificadores de control

- GAP-EVENTO-RESULTADO / GAP-CONDICION-RESULTADO: cerrados; el generador degrada evento/condición de **resultado** a la oración base, preservando R-MOD-INPUT-2 (Post(P) no admite `e`/`c`).

- GAP-EVENTO-INVOCACION / GAP-CONDICION-INVOCACION: cerrados; el generador degrada evento/condición de invocación a la invocación base, preservando R-MOD-CAT-1 / R-IV-3.

- GAP-FIXTURE-EVENTO / GAP-FIXTURE-INVOCACION: cerrados por `fixtures-roundtrip.ts`; las variantes de invocación/autoinvocación con demora roundtripean de forma estricta.

- GAP-EXC-UNIDADES-LITERAL: cerrado por nota de realización; `unidades-tiempo` es metavariable y `formatoTiempo` realiza valor+unidad concretos (ver §5.3).

- GAP-INVOCACION-TILDE: cerrado; emisión canónica `después de` y parser compatible con legacy (ver §5.4).

## §6 Enlaces estructurales

### §6.1 Agregación-participación (RF1)

**Tokenización**: span del **todo** con `ref`; `consta de`/`constan de` token-verbo del enum §1.1; cada **parte** es span con `ref` a su cosa; comas y `y`/`e` son conectores fijos (§1.3).

**Reverse**: la oración `**Todo** consta de **A**, **B** y **C**` se parsea, vía `parsear.ts·astEstructural` (regex `^(.+?) consta de (.+)$`, `tipo: "agregacion"`), como enlaces `agregacion` con el **todo** como origen y cada **parte** como destino.

**Edición**: agregar una parte a una agregación existente DEBERÍA extender la lista de la oración en su lugar; quitar la última parte de un todo PUEDE colapsar la oración.

**Roundtrip**: el **todo**, el orden de las **partes** y la marca de colección incompleta DEBEN preservarse. La fixture estricta `enlace-estructural-agregacion` (`fixtures-roundtrip.ts`) cubre el caso básico de una parte; el orden de partes múltiples y la marca RF1i de colección incompleta siguen sin fixture (RF1i además sin implementación en `src/opl`).

**Traza a código**: generación `app/src/opl/generadores/estructural.ts·oracionEnlaceEstructural` (caso `agregacion`, línea ~63); parseo `app/src/opl/parser/parsear.ts·astEstructural` (regex `consta de`, línea ~959).

Rationale: `reglas §4.10` (RF1), `§5.5` (R-STRF-1, R-STRF-4) y `opm-opl-es §9.1`.

### §6.2 Exhibición-caracterización (RF2, RF2b)

**Plantilla(s)**:

- **RF2o** [extensión] (rasgo opcional — extensión declarada de producto): `**Exhibidor** tiene un **Rasgo** opcional.` El verbo `tiene` NO existe en `reglas` ni en `opm-opl-es` (la base realiza `?` como restricción de participación `un/una opcional` dentro de la oración existente, R-§18-PART-1); OPFORJA lo declara como extensión de superficie con producción `(* ext §6.2 *)` en §18.

**Emisión**: un enlace de tipo `exhibicion` entre el **exhibidor** (origen) y sus **rasgos** (destino) emite `exhibe`, con el exhibidor como sujeto. Cuando el destino porta multiplicidad opcional (`?`/`0..1`), el generador emite la variante `tiene un **Rasgo** opcional` en vez de `exhibe`. Los rasgos heterogéneos (atributos + operaciones) se unen con `así como` (§1.3).

**Tokenización**: span del **exhibidor** con `ref`; `exhibe`/`exhiben` token-verbo; cada rasgo es span con `ref`; `así como` conector de adición heterogénea; `tiene un … opcional` realiza la opcionalidad como rasgo (la palabra `opcional` es portadora de multiplicidad `?`).

**Reverse**: la oración `**Exhibidor** exhibe **A** así como *Op*` se parsea, vía `parsear.ts·astEstructural` (regex `^(.+?) exhibe(?:n)? (.+)$`, `tipo: "exhibicion"`); la variante `tiene un … opcional` se parsea con multiplicidad `0..1`, y el parser acepta además la variante plural `tiene … opcionales` (`parsear.ts` ~1017), que el generador no emite.

**Roundtrip**: exhibidor, rasgos, orden, opcionalidad y la frontera atributo/operación DEBEN preservarse. GAP-FIXTURE-EXHIBICION: cerrado por `fixtures-roundtrip.ts` (`enlace-estructural-exhibicion`).

**Traza a código**: generación `app/src/opl/generadores/estructural.ts·oracionEnlaceEstructural` (caso `exhibicion`, líneas ~64–68; variante opcional ~65–67); parseo `app/src/opl/parser/parsear.ts·astEstructural` (regex `exhibe`, línea ~961; opcional ~963–966).

Rationale: `reglas §4.10` (RF2, RF2b), `§5.5` (R-STRF-2, R-STRF-2A, R-OPL-RF-2) y `opm-opl-es §9.2`.

### §6.3 Generalización-especialización (RF3, RF3b; XOR RX1, RX2; herencia múltiple RH1)

**Tokenización**: cada **especialización** es span con `ref`; `son`/`es un`/`puede ser`/`puede ser uno de` token-verbo del enum §1.1; el **general** es span con `ref`; `o`/`u` conector XOR; `y`/`e` conector copulativo de especializaciones; `un`/`una` artículos de herencia múltiple.

**Composabilidad**: **destino-enumerado** en el sujeto (varias especializaciones del mismo general en una oración) y en el predicado para herencia múltiple/XOR (varios generales). NO DEBE coordinarse con agregación/exhibición/clasificación. **Zona prohibida de composición en refinamiento/despliegue**: la agrupación de especializaciones NO DEBE aplicarse cuando el enlace participa de descomposición/despliegue, porque colisiona con la realización del refinamiento (despliegue de generalización-especialización, §6 de refinamientos) y borraría tokens/refs por enlace; se emite por enlace (remite §9).

**Reverse**: `parsear.ts·astEstructural` reconoce `^(.+?) es un (.+)$` y `^(.+?) son (.+)$` como `generalizacion` con el general como origen y la(s) especialización(es) como destino. GAP-XOR-PARSER: la superficie `puede ser` / `puede ser uno de` NO tiene regex de parseo estructural dedicada hoy (el verbo es canónico —enum §1.1, marcado GAP-XOR-FEATURE en generación—, pero ni generador ni parser estructural lo realizan); la enumeración XOR de generalización queda como GAP de cobertura bidireccional.

**Roundtrip**: especializaciones, general, exclusividad (XOR vs inclusivo) y herencia múltiple DEBEN preservarse. La fixture estricta `enlace-estructural-generalizacion` (`fixtures-roundtrip.ts`) cubre la forma `es un`; la exclusividad XOR (`puede ser`) queda fuera, cubierta por GAP-XOR-FEATURE / GAP-XOR-PARSER.

**Traza a código**: generación `app/src/opl/generadores/estructural.ts·oracionEnlaceEstructural` (caso `generalizacion`, línea ~70; `son`/`es un`); parseo `app/src/opl/parser/parsear.ts·astEstructural` (regex `es un` ~967, `son` ~969). XOR `puede ser`: GAP-XOR-FEATURE (sin generador, §1.1) y GAP-XOR-PARSER (sin parser estructural).

**Nota de realización**: `app/src/opl/generadores/refinamiento.ts·emitirEspecializacion` emite el hecho individual de generalización como `es un`; NO realiza la superficie XOR parent-centric `puede ser`. GAP-XOR-FEATURE queda reclasificado como feature de especialización exclusiva, junto con GAP-XOR-PARSER.

Rationale: `reglas §4.10` (RF3, RF3b, RX1, RX2, RH1), `§5.5` (R-STRF-1, R-HER-1..8) y `opm-opl-es §9.3`.

### §6.4 Clasificación-instanciación (RF4, RF4b)

**Tokenización**: span de cada **instancia** con `ref`; `es una instancia de`/`son instancias de` token-verbo del enum §1.1; span de la **clase** con `ref`.

**Composabilidad**: **destino-enumerado** en el sujeto (varias instancias de la misma clase en una oración, vía `son instancias de`). NO DEBE coordinarse con las otras tres estructurales. **Zona prohibida de composición en refinamiento/despliegue**: la agrupación de instancias NO DEBE aplicarse en contexto de despliegue de clasificación-instanciación; se emite por enlace (remite §9).

**Reverse**: `parsear.ts·astEstructural` reconoce `^(.+?) es una instancia de (.+)$` (~971) y `^(.+?) son instancias de (.+)$` (~973) como `clasificacion` con la clase como origen y la(s) instancia(s) como destino.

**Roundtrip**: instancias, clase y plural/singular DEBEN preservarse. El formato nominal `Instancia : Clase` (§2.6) es designación de nombre, no oración de instanciación; GAP-NOMBRE-INSTANCIA (declarado en §2.6) sigue vigente. GAP-FIXTURE-CLASIFICACION: cerrado por `fixtures-roundtrip.ts` (`enlace-estructural-clasificacion`).

**Traza a código**: generación `app/src/opl/generadores/estructural.ts·oracionEnlaceEstructural` (caso `clasificacion`, línea ~72); parseo `app/src/opl/parser/parsear.ts·astEstructural` (regex `es una instancia de` ~971, `son instancias de` ~973).

Rationale: `reglas §4.10` (RF4, RF4b, R-OPL-RF-4), `§5.5` (R-STRF-3, R-HER-6) y `opm-opl-es §9`.

### §6.5 Etiquetados — unidireccional, bidireccional y recíproco (SE1–SE5)

**Emisión**: un enlace `etiquetado` emite `**Origen** <tag> **Destino**` con la etiqueta de usuario como verbo; si no hay etiqueta, emite la etiqueta nula `se relaciona con` (SE2). Un enlace `etiquetadoBidireccional` recíproco sin etiqueta diferencial emite `**Origen** y **Destino** se relacionan` (SE5). La bidireccional con dos etiquetas distintas (SE3) emite dos oraciones, una por dirección (f-tag / b-tag); un bidireccional cuyas dos etiquetas coinciden DEBE tratarse como recíproco con esa etiqueta (R-STRE-1).

- **R-EST-TAG-3** [extensión] (extensión declarada — sufijo de etiqueta de enlace): la herramienta PUEDE adjuntar la etiqueta de usuario de un enlace **procedimental o estructural fundamental** como sufijo `[etiqueta: …]` tras el punto terminal de la oración base: `**Todo** consta de **Parte**. [etiqueta: componente critico]`. Es superficie de producto (no figura en `opm-opl-es`); el parser extrae el sufijo antes de cotejar la oración base y la edición lo aplica vía el patch `fijar-etiqueta-enlace` (§15.3–§15.4). Producción `(* ext §6.5 *)` en §18.

  Rationale: `procedural.ts·conEtiquetaEnlace` (~273) emite el sufijo; `parsear.ts·ETIQUETA_SUFIX` (línea 5) lo extrae; `aplicar.ts` lo materializa (`fijar-etiqueta-enlace` → `renombrarEtiquetaEnlace`); `generar.test.ts` (129, 607–608) lo defiende.

**Tokenización**: span del **origen** con `ref`; la etiqueta de usuario o `se relaciona con`/`se relacionan` es token-verbo (la de usuario lleva `hint` de etiqueta editable); span del **destino** con `ref`; `y`/`e` conector en las formas recíprocas.

**Reverse**: la oración con etiqueta de usuario se parsea como enlace `etiquetado` reconstruyendo el tag; `se relaciona con` como etiquetado nulo unidireccional; `se relacionan` como recíproco nulo. GAP-TAG-PARSER: la ruta de parseo estructural de `astEstructural` (`parsear.ts` ~959–973) cubre las cuatro fundamentales pero NO incluye regex dedicada para `se relaciona con` / `se relacionan` ni para etiquetas de usuario arbitrarias; el reverse de etiquetados es GAP de cobertura bidireccional (la generación existe en `procedural.ts`, el parseo estructural no).

**Roundtrip**: origen, destino, dirección (uni/bi/recíproco), etiqueta de usuario y el orden (cuando aplica) DEBEN preservarse. GAP-FIXTURE-TAGGED: no hay fixture dedicado de etiquetado en `fixtures-roundtrip.ts`.

**Edge cases**: SE3 con etiquetas idénticas colapsa a SE4 (R-STRE-1); la restricción V-30 (`reglas §4.10`) prohíbe las variantes bidireccional y recíproco para el caso de estado solo en destino (ver §6.6).

**Traza a código**: generación `app/src/opl/generadores/procedural.ts·oracionEstructuralEtiquetada` (etiquetado/bidireccional, líneas ~152, ~168, ~239–244: `tag`/`se relaciona con`/`se relacionan`); parseo: GAP-TAG-PARSER (sin regex estructural dedicada en `parsear.ts·astEstructural`).

Rationale: `reglas §4.10` (SE1–SE5, R-OPL-SE-1..5), `§5.6` (R-STRE-1) y `opm-opl-es §9.1`.

### §6.6 Estructurales con estado especificado (SSE1–SSE7)

**Tokenización**: spans de **origen**/**destino** con `ref`; cada `estado` entre backticks con `ref` al estado; la etiqueta como token-verbo; `en` precede al estado (posición de estado es post-cosa, no pre, §convenciones OPL-ES).

**Composabilidad**: igual que §6.5; la **zona prohibida de composición en refinamiento/despliegue** aplica idéntica (remite §9).

**Reverse**: GAP-SSE-PARSER: las variantes con estado especificado heredan el GAP-TAG-PARSER de §6.5; no hay regex de parseo estructural dedicada hoy.

**Roundtrip**: origen, destino, etiqueta, dirección y cada `estado` especificado DEBEN preservarse. GAP-FIXTURE-SSE: sin fixture dedicado.

**Traza a código**: generación `app/src/opl/generadores/procedural.ts·oracionEstructuralEtiquetada` (composición del sufijo de estado en el extremo etiquetado); parseo GAP-SSE-PARSER.

Rationale: `reglas §4.10` (SSE1–SSE7, V-30) y `opm-opl-es §9.4`.

### §6.7 GAPs de cobertura — enlaces estructurales

- GAP-XOR-FEATURE / GAP-XOR-PARSER: la especialización XOR (`puede ser` / `puede ser uno de`, RX1/RX2) tiene verbo canónico (enum §1.1) pero ningún generador de `app/src/opl/generadores/` la emite ni regex de `parsear.ts·astEstructural` la reconoce; cobertura bidireccional ausente.

- GAP-TAG-PARSER / GAP-SSE-PARSER: la generación de etiquetados (SE1–SE5) y de estructurales con estado (SSE1–SSE7) existe en `procedural.ts·oracionEstructuralEtiquetada`, pero `parsear.ts·astEstructural` no incluye regex dedicada para `se relaciona con` / `se relacionan` ni para etiquetas de usuario; el reverse de etiquetados es GAP.

- GAP-NOMBRE-INSTANCIA: el formato nominal `Instancia : Clase` (§2.6) no tiene generador dedicado que lo componga automáticamente; vigente desde §2.6.

- GAP-FIXTURE-ESTRUCTURALES: cerrado para las cuatro relaciones fundamentales (agregación, exhibición, generalización, clasificación) por `fixtures-roundtrip.ts`; etiquetados siguen fuera por GAP-TAG-PARSER / GAP-FIXTURE-TAGGED.

## §7 Refinamiento / gestión de contexto

Cada mecanismo aparea un **refinamiento** (revelar detalle) con su **abstracción** (suprimirlo); la spec realiza ambos sentidos. El refinamiento del modelo es un canal separado de la etiqueta visible `SDx.y`: la generación PUEDE emitir la etiqueta de navegación como `hint` de presentación, pero NO DEBE tratarla como identidad persistente (R-IDP-1, R-IDP-2).

Rationale: `reglas §4.11` (CX1–CX8, CM1–CM3), `§8` (mecanismos, síncrona/asíncrona, escindidos, distribución) y `opm-opl-es §10`.

### §7.0 Reglas duras transversales de refinamiento

- **R-CX-0** (no-trivialidad): un refinamiento NO DEBE emitir oración de gestión de contexto cuando el hijo tiene **menos de 2** refinadores; un nodo con un solo hijo NO es refinamiento canónico (R-REF-NTRIV-1..3) y solo PUEDE persistir como placeholder de edición.

  Rationale: `reglas §8.3` (R-REF-NTRIV-1, R-REF-NTRIV-2, R-REF-NTRIV-3).

- **R-CX-2** (identidad vs etiqueta): la oración de refinamiento entre OPDs (CX3, CX4) PUEDE mostrar la etiqueta `SDx.y` como superficie de navegación, pero el `ref` del span de OPD DEBE anclar al identificador persistente del OPD, no a la etiqueta mutable.

  Correcto: `**Pedido** se despliega en SD1 en **Cabecera** y **Línea**.` (span `SD1` con `ref` al OPD persistente)
  Incorrecto: usar `SD1` como clave de modelo para resolver el hijo en serialización.
  Rationale: `reglas §8.7` (R-IDP-1, R-IDP-2, R-IDP-3) y `opm-opl-es §10.3`.

### §7.1 Descomposición / recomposición de proceso (in-zoom / out-zoom, CX1, CX2)

**Supresión**: padre o subproceso con nombre placeholder NO emite (R-ENT-2). Un OPD semidescompuesto (transitorio) NO DEBE emitir oración canónica de descomposición (R-OPD-OP-3). Si el hijo no llega a 2 refinadores, NO se emite (R-CX-0).

**Tokenización**: span del *proceso* padre con `ref`; `se descompone en` token-verbo del enum §1.1; cada *subproceso* es span con `ref`; `paralelo` clave de coetaneidad; `en esa secuencia` clave de orden temporal; `así como` adición de objetos internos; `y`/`e`, `o`/`u` conectores según fonética.

**Reverse**: la oración `se descompone en` se parsea (`parsear.ts·parsearContexto`) como AST de contexto y `planificar.ts·planificarContexto` emite el patch `crear-refinamiento` (idempotente; `aplicar.ts` lo materializa vía `descomponerProceso`/`desplegarObjeto`), creando el refinamiento con OPD hijo vacío. Los miembros enumerados NO se crean ni se mueven automáticamente (diagnóstico `info` deliberado anti-pérdida-silenciosa; el alta de subprocesos sigue siendo gesto de canvas, `parsear.ts:1157`). **GAP-CX-PARSER (orden): cerrado** — la marca de secuencia/paralelo (`en esa secuencia`/`paralelo`) SÍ se reconstruye sobre el refinamiento existente: el AST de contexto captura las bandas (`bandasNombres`, dirigido por el marcador `paralelo`; el doble rol de «y» se desambigua porque el forward es determinista) y `planificar.ts·planificarOrdenInzoom` resuelve nombres→ids contra los subprocesos del OPD hijo y emite el patch `set-orden-inzoom` que setea `opd.ordenInzoom`, con **verificación por inversa** (re-emite el orden resuelto con la lógica forward y, si difiere de la entrada, rechaza ruidosamente con `warning` y sin patch — seguro ante subprocesos con « y »/«,» en el nombre). El residual de GAP-CX-PARSER queda acotado a la materialización de la **lista de refinadores**, intencionalmente por gesto. Defendido por `opl/parser/orden-inzoom.test.ts`, `leyes/opl-reverse.test.ts` y `parser.test.ts`.

**Roundtrip**: el padre, la lista de subprocesos, el orden temporal (secuencia/paralelo) y los objetos internos DEBEN preservarse. **GAP-FIXTURE-DESCOMPOSICION (orden): cerrado** — `leyes/invocacion-implicita-bimodal.test.ts` defiende el roundtrip estricto forward→reverse→forward del orden de descomposición (CX1 secuencial, CX2 paralelo, mixta) sobre `opd.ordenInzoom` y **sin** rayos de invocación. No se añade fixture al catálogo genérico `fixtures-roundtrip.ts` por diseño: la oración de descomposición no recrea los subprocesos del OPD hijo (sus miembros «no se crean»), así que un fixture que revierte desde modelo vacío sería irrecuperable; la simetría del orden se defiende sobre el modelo con el refinamiento y el campo. El residual queda acotado a la materialización de miembros, apoyada en el generador y, parcialmente, en `parser.designacionesPlegado.test.ts`.

**Traza a código**: generación `app/src/opl/generadores/refinamiento.ts·oracionDescomposicion` (verbo `se descompone en`, líneas ~93, ~102) y `oracionParalelo` (~106, `ocurren en paralelo`); orden temporal en `describirProcesosTemporales` / `compararOrdenTemporal` (~150). Parseo: `parsear.ts·parsearContexto` (~1115) / `planificar.ts·planificarContexto` (~96–126) / `aplicar.ts` caso `crear-refinamiento` (~115).

Rationale: `reglas §4.11` (CX1, CX2), `§8.1`–`§8.2`, `§8.9` y `opm-opl-es §10.1`.

### §7.2 Despliegue / plegado de cosa (unfolding / folding, CX3, CX5, CX6)

**Emisión**: cuando una **cosa** porta un refinamiento `despliegue` con `≥ 2` refinadores (R-CX-0), se emite la oración de despliegue. El **modo** se resuelve por la relación fundamental dominante en el OPD hijo (agregación, exhibición, generalización, clasificación) según `modoDespliegue`; si el modo es una de las cuatro fundamentales, la superficie emitida reusa el verbo de esa relación (`consta de`/`se despliega en`, `exhibe`, `son`/`es un`, `son instancias de`), no una forma genérica `se despliega`. El despliegue revela estructura estática y NO implica orden temporal (R-REF-SYNC-2): NUNCA DEBE añadir `en esa secuencia`.

**Tokenización**: span de la **cosa** desplegada con `ref`; verbo de la relación fundamental (token del enum §1.1); span de cada **refinador** con `ref`; `así como` separa atributos de operaciones en exhibición; el span `SD1` (CX3) lleva `ref` al OPD persistente, no a la etiqueta (R-CX-2). En plegado: `se pliega en` token-verbo (GAP-PLIEGA); `el OPD padre` referencia al ascendente.

**Composabilidad**: la lista de refinadores es **destino-enumerado** dentro de la única oración de despliegue. Aplica la **zona prohibida de composición en contexto de despliegue** (§7.7): los enlaces estructurales de los refinadores NO se fusionan en plural al desplegar; cada enlace conserva su token-verbo y `ref`. NO DEBE coordinarse con descomposición ni con enlaces procedimentales.

**Reverse**: la oración de despliegue por relación fundamental se parsea por las regex estructurales de §6 (`consta de`, `exhibe`, `son`, `son instancias de`) reconstruyendo el refinamiento `despliegue`. `parser.designacionesPlegado.test.ts` defiende el reverse del plegado parcial (designaciones de estado bajo plegado). GAP-PLIEGA: la oración autónoma `se pliega en el OPD padre` (CX5/CX6) tiene verbo canónico pero ningún generador la emite; el parser la reconoce (`parsear.ts·parsearContexto`, familia `plegado`, warning `unsupported-kernel`) sin aplicar plegado (diseño de corte), y la rama `plegado` del parser carece de test propio.

**Roundtrip**: la cosa desplegada, el modo (relación fundamental), la lista de refinadores y el estado de plegado parcial DEBEN preservarse. El plegado parcial (mostrar N partes y suprimir el resto con `al menos otro/a`) se realiza en `plegado.ts·oracionPlegadoParcial` y se defiende en `parser.designacionesPlegado.test.ts`.

**Traza a código**: generación `app/src/opl/generadores/refinamiento.ts·oracionDespliegue` (modo agregación `se despliega en` ~76; exhibición `exhibe` ~77; generalización `son`/`es un` ~78; clasificación `son instancias de`/`es una instancia de` ~79), `emitirDespliegueOcurren` como emisor de despliegue con ocurrencia contextual y `modoDespliegue`/`modoPorTipoEnlace` (~109, ~120); plegado parcial `app/src/opl/generadores/plegado.ts·oracionPlegadoParcial`; agrupación por OPD en `app/src/opl/bloquesJerarquicos.ts·agruparOracionesPorOpd`; reverse de plegado `app/src/opl/parser/parser.designacionesPlegado.test.ts`. GAP-PLIEGA para `se pliega en` autónomo.

Rationale: `reglas §4.11` (CX3, CX5, CX6), `§8.1`–`§8.2`, `§8.5`–`§8.6` y `opm-opl-es §10.2`, `§10.5`.

### §7.3 Refinamiento explícito entre OPDs (CX4)

**Supresión**: NO se emite para un nodo que no cierra como refinamiento canónico (R-CX-0).

**Tokenización**: span `SD`/`SD1` con `ref` al OPD persistente (R-CX-2); `se refina por descomposición de`/`se refina por despliegue de` token-verbo (enum §1.1, GAP-REFINA); span de la cosa refinada con `ref`.

**Reverse**: GAP-REFINA: el verbo `se refina` es canónico pero ningún generador de `app/src/opl/generadores/` lo emite como oración autónoma ni regex de `parsear.ts` lo parsea; el árbol OPD se materializa por la estructura del modelo, no por oraciones CX4 emitidas. Cobertura bidireccional ausente.

**Roundtrip**: si se materializara, el OPD padre, el OPD hijo y la cosa refinada DEBERÍAN preservarse vía identidad persistente. Hoy GAP-REFINA.

**Traza a código**: la jerarquía de OPDs se ordena en `app/src/opl/bloquesJerarquicos.ts·ordenarOpdsParaOpl` / `profundidadOpd`; no hay generador de la oración CX4 (GAP-REFINA).

Rationale: `reglas §4.11` (CX4), `§8.10` (R-ARB-4, R-OPL-TOTAL-1..5) y `opm-opl-es §10.3`.

### §7.4 Expresión / supresión de estados como refinamiento

**Tokenización**: igual que §2.3 (span de objeto con `ref`, cada `estado` con `ref`).

**Reverse**: igual que §2.3 (`puede estar` parseable como declaración de estados del objeto).

**Roundtrip**: el conjunto de estados visibles por OPD DEBE preservarse; el roundtrip por-OPD respeta R-OPL-TOTAL-4.

**Traza a código**: `app/src/opl/generadores/duracionMetadata.ts·oracionEstados` (vía §2.3); visibilidad por OPD en `bloquesJerarquicos.ts·agruparOracionesPorOpd`.

**Metadatos inline**: `duracionMetadata.ts·oracionesUnidadDescripcionEstados` compone la descripción de entidad, estados y metadatos inline de presentación (`formatearAliasInline`, `formatearUnidadInline`, `formatearDescripcionInline`, `formatearDuracion`). Estos formateadores son realización local de §2.5/§5: no introducen una plantilla OPL nueva, solo agregan alias, unidad, descripción o duración cuando el modelo los declara.

Rationale: `reglas §8.1` (expresión/supresión de estados), `§8.10` (R-OPL-TOTAL-4, R-OPL-TOTAL-5) y `opm-opl-es §3.2`.

### §7.5 Descomposición síncrona vs despliegue asíncrono

**Traza a código**: la distinción se materializa en el bucle de `refinamiento.ts·oracionesRefinamiento` (itera `["descomposicion", "despliegue"]`); solo la descomposición de proceso consulta `describirProcesosTemporales` y emite `en esa secuencia`/`paralelo`; el despliegue (`oracionDespliegue`) nunca añade marca temporal.

Rationale: `reglas §8.2` (R-REF-SYNC-1, R-REF-SYNC-2) y `opm-opl-es §10.1`–`§10.2`.

### §7.6 Distribución de enlaces al descomponer

(CX-DIST, parte de producto) [desviación declarada] Realización de la distribución al descomponer en OpForja (v1.4.1); la fila de resultado se aparta del defecto ISO (ver R-CX-DIST-1, parte de producto):

| Tipo de enlace | Contorno exterior del padre | Distribución al hijo |
| --- | --- | --- |
| Resultado (T2, TS2) | **PROHIBIDO** | migra al **último** subproceso |
| Estructural | NO se distribuye | permanece en el contenedor |

- (R-CX-DIST-1, parte de producto) [desviación declarada] (decisión del dueño, 2026-10-10; ISO §14.2.2.4, subcláusula 14.2.2.4.1 y su NOTE 2 [informativo]): al descomponer, OpForja ancla por defecto el enlace de resultado al **último** subproceso (y el de consumo al primero). La norma fija como defecto el primer subproceso para consumo y resultado y deja la reasignación al modelador (canon spec-OPL §7.6, CX-DIST; canon reglas §8.5); la NOTE 2 permite que la herramienta establezca un defecto que el modelador modifica. La diferencia con el defecto ISO se declara en `docs/conformidad.md`.

**Efecto en OPL**: la migración de un enlace al subproceso correcto cambia el **sujeto/complemento** de la oración transformadora en el OPL del OPD hijo: `*ProcesoPadre* consume **X**` (en el padre) se realiza como `*PrimerSubproceso* consume **X**` (en el hijo). La identidad del hecho (mismo enlace) DEBE preservarse a través de la migración (R-OPD-OP-4).

#### §7.6.1 Enlaces escindidos (remite §3 TS4/TS5)

**Traza a código**: la distribución y migración de enlaces es operación de modelo (descomposición como operación de herramienta, `reglas §8.11`); la realización OPL por OPD se proyecta vía `bloquesJerarquicos.ts·agruparOracionesPorOpd`, que asigna cada oración transformadora al OPD donde reside su enlace. La escisión TS4/TS5 se canoniza en §3.

Rationale: `reglas §8.4`–`§8.5`, `§8.11` y `opm-opl-es §10`.

### §7.7 Zona prohibida de composición en contexto de refinamiento / despliegue

**Reglas duras**:

- **R-CX-COMP-1**: los enlaces de los refinadores (subprocesos de una descomposición, partes/especializaciones/instancias/rasgos de un despliegue) NO DEBEN fusionarse en una oración plural única; cada enlace DEBE emitirse en su propia oración, preservando su **token-verbo** y su **`ref` por enlace**.

  Correcto: en contexto de despliegue de generalización, los **enlaces** se emiten por enlace — `**Auto** es un **Vehículo**.` seguido de `**Camión** es un **Vehículo**.` (un enlace, una oración, refs preservados) — y COEXISTEN con la oración de despliegue `**Auto** y **Camión** son **Vehículo**.` (un hecho de refinamiento con refs de entidad, refinadores y enlaces; §7.2, R-CX-COMP-3), tal como emite el generador vigente (`refinamiento.ts·oracionDespliegue` + `estructural.ts·oracionEnlaceEstructural`).
  Incorrecto (zona prohibida): fusionar las N oraciones de enlace a `**Auto** y **Camión** son **Vehículo**.` **en reemplazo de** su emisión atómica, porque la agrupación borra el token-verbo y la `ref` por enlace que el refinamiento necesita para mapear cada refinador a su arista.
  Rationale: BUG-f897bc — el transformador que REEMPLAZABA las oraciones por enlace con la fusión plural borró tokens/refs por enlace y rompió la bisimetría del refinamiento; la oración de despliegue es un hecho distinto (R-CX-COMP-3) y nunca fue el bug; remite §9.

- **R-CX-COMP-2**: la coordinación copulativa de §9 (predicados con sujeto-proceso compartido, destino-enumerado de estructurales) DEBE excluir explícitamente el contexto de refinamiento/despliegue de su dominio de aplicación. La detección de candidatos a coordinación NO DEBE activarse sobre enlaces que pertenecen a un OPD hijo de refinamiento.

  Rationale: la composabilidad de §3, §5 y §6 declara «zona prohibida de composición en refinamiento/despliegue» precisamente para sellar esta colisión; §9 canoniza la coordinación general bajo esa exclusión.

- **R-CX-COMP-3**: dentro de la **propia** oración de refinamiento (CX1–CX3), la lista de refinadores SÍ es un destino-enumerado legítimo — un solo verbo de refinamiento, sea explícito (`se descompone en`/`se despliega en`) o **reusado de la relación fundamental** del modo de despliegue (`exhibe`, `son`/`es un`, `son instancias de`; §7.2 Emisión), varios spans con `ref` —; lo prohibido es coordinar **los enlaces de esos refinadores entre sí** en una oración plural **en reemplazo de** su emisión atómica. La oración de despliegue superficie-idéntica (p. ej. `**Auto** y **Camión** son **Vehículo**.` como realización del refinamiento) es canónica y COEXISTE con las oraciones por enlace.

  Rationale: distinguir la enumeración de refinadores (un hecho de refinamiento) de la fusión de enlaces hijos (varios hechos de enlace) evita reintroducir BUG-f897bc por sobre-aplicación de R-CX-COMP-1; un verificador literal que ignore los verbos reusados de §7.2 marcaría como zona prohibida la salida canónica del generador (falso positivo).

**Traza a código**: la agrupación por OPD (`bloquesJerarquicos.ts·agruparOracionesPorOpd`) mantiene cada enlace hijo como oración independiente dentro del bloque del OPD; la oración de refinamiento (`refinamiento.ts·oracionDescomposicion`/`oracionDespliegue`) enumera refinadores pero NO coordina sus enlaces. GAP-COMP-GUARDA queda no-aplicable hasta que exista GAP-COMPOSICION: hoy la protección es por construcción atómica (cada enlace genera su propia oración), sin transformador que pueda fusionarlos.

Rationale: BUG-f897bc, `reglas §9` (bisimetría OPD↔OPL) y las cláusulas «zona prohibida» de §3.1–§3.3, §6.3–§6.6.

### §7.8 GAPs de cobertura — refinamiento / gestión de contexto

- GAP-CX-PARSER: **orden cerrado** — `se descompone en`/`se despliega en` se parsean (`parsear.ts·parsearContexto`) y el patch `crear-refinamiento` (`planificar.ts·planificarContexto`, `aplicar.ts`) crea el refinamiento idempotente con OPD hijo vacío; los miembros enumerados no se crean (diagnóstico `info` deliberado). La marca de secuencia/paralelo SÍ se reconstruye → `opd.ordenInzoom` vía `planificar.ts·planificarOrdenInzoom` + patch `set-orden-inzoom`, con verificación por inversa (§7.1, `orden-inzoom.test.ts`). Residual acotado: la materialización de la lista de refinadores, intencionalmente por gesto de canvas.

- GAP-PLIEGA: el verbo `se pliega en` (CX5/CX6) es canónico (enum §1.1) pero ningún generador emite la oración autónoma de plegado total; el parser la reconoce (`parsear.ts·parsearContexto`, familia `plegado`, warning `unsupported-kernel`) sin aplicar plegado (diseño de corte) y sin test propio de la rama; solo existe el plegado **parcial** (`plegado.ts·oracionPlegadoParcial`, defendido por `parser.designacionesPlegado.test.ts`).

- GAP-DESPLIEGUE-DEDICADO: las superficies dedicadas de la base A.10 (`se despliega por partes/especialización/instanciación/rasgos en SDx en …`) están derivadas en la EBNF §18 pero sin generador ni declaración de sustitución; la emisión vigente reusa el verbo de la relación fundamental (§7.2).

- GAP-RECOMPONE: el verbo `se recompone desde` (CX7/CX8) es canónico pero sin generador ni parser.

- GAP-REFINA: la oración explícita `se refina por descomposición/despliegue de … en` (CX4) es canónica pero sin generador autónomo ni parser; el árbol OPD se materializa por estructura del modelo.

- GAP-FIXTURE-DESCOMPOSICION: **orden cerrado** — el orden de descomposición tiene roundtrip estricto en `leyes/invocacion-implicita-bimodal.test.ts` (CX1/CX2/mixta sobre `opd.ordenInzoom`, sin rayos); no se añade al catálogo genérico `fixtures-roundtrip.ts` por diseño (los miembros del OPD hijo no se recrean desde la oración). Residual: la materialización de miembros, apoyada en los generadores de `refinamiento.ts` y en `parser.designacionesPlegado.test.ts`.

- GAP-COMP-GUARDA: cerrado-no-aplica hasta que exista GAP-COMPOSICION; la salida actual es atómica por construcción y no coordina enlaces hijos en contexto de refinamiento.

## §8 Combinatoria a nivel de modelo

```
rol (consumo | resultado | efecto | agente | instrumento)
  × modificador de control (evento | condición | excepción | ninguno)
  × multiplicidad / cardinalidad (?, *, 1..1, +)
  × abanico (XOR | OR | AND)
  × probabilidad (Pr=p)
  × ruta (por ruta L)
```

No todas las celdas son válidas. Esta sección fija qué combinaciones son **válidas**, cuáles **inválidas** (error de categoría o de asimetría), y cuáles **no-canonizadas** (silencio de la SSOT). La fuerza semántica de colisión de rol y la matriz de precedencia transformadora de recomposición son validez nuclear: viven en `reglas §6.5`/`§6.6` y esta spec las cita sin re-legislarlas (§8.3.1).

Rationale: `reglas §6.4`–`§6.8`, `§7`, `§11.2` y `opm-opl-es §11`–`§13`; un constructo aislado es legible por su sección, pero su combinación con otro abre celdas que ninguna sección individual gobierna.

### §8.0 Reglas duras de combinación

- **R-COMB-1**: una combinación NO listada como válida ni como inválida en esta sección DEBE clasificarse como **no-canonizada**; la generación NO DEBE emitirla y el parser NO DEBE construirla. NO DEBE inventarse primitiva, verbo ni glifo nuevo para llenar el silencio.

  Rationale: `reglas §11.2` (R-ZNC-1, R-ZNC-2): la herramienta NO inventa canon OPM nuclear para una zona no canonizada.

- **R-COMB-3** (un solo modificador por enlace): un enlace base PUEDE portar **a lo sumo un** modificador de control. La combinación `c` + `e` sobre el mismo enlace es **no-canonizada** (§8.4); excepción y modificador (`e`/`c`) no coexisten sobre el mismo enlace porque la excepción es familia autónoma proceso→proceso, no anotación de enlace.

  Rationale: `reglas §6.4` (`c` + `e` = no definido), `§11.2` (AP-28) y §5.3 (naturaleza de la excepción).

### §8.1 Abanicos lógicos XOR / OR / AND

- **R-FAN-5B** (inversa y fact-set): el parser de R-FAN-5A DEBE reconstruir un enlace TS3 por estado de salida, repetir el estado de entrada común en cada enlace y crear un único abanico con las `n` ramas y el operador original. El roundtrip se decide por igualdad del fact-set `{proceso, objeto, entrada, salidas, enlaces TS3, operador, membresía del fan}`, no por igualdad superficial de texto ni por deduplicación de entidad.

  Rationale: §9 R-COMP-REV-2 y el contrato de bimodalidad exigen recuperar cada hecho coordinado; deduplicar por **objeto** antes de leer los estados colapsa ramas distintas.

- **R-FAN-8** (m-de-f combinatorial): para fan-size `f > 2`, el modelador PUEDE generalizar a `exactamente m de f` (XOR combinatorial) o `al menos m de f` (OR combinatorial), con `m < f`, anotando `m` junto al arco. Es extensión declarada del cuantificador, no primitiva nueva.

  Rationale: `reglas §7.6` (R-FAN-M-1..4). GAP-FAN-M: sin generador para `m de f`; `abanico.ts` solo emite `exactamente uno de` / `al menos uno de`.

### §8.2 Multiplicidad / cardinalidad en combinación con rol y abanico

- **R-MULT-COMB-2**: dentro de un abanico, la multiplicidad de cada rama se realiza por extremo vía `nombreOplExtremo`; la multiplicidad del fan **no** sustituye al cuantificador XOR/OR. Cuantificador (cuántas ramas) y multiplicidad (cuántas instancias por rama) son dimensiones ortogonales.

  Rationale: `abanico.ts·extremoOpuestoAbanico` (líneas 244–254) propaga `multiplicidadOrigen`/`multiplicidadDestino` por rama; `nombreOplExtremo` (importado en línea 6).

### §8.3 Matriz de combinaciones relevantes

(Matriz C-nn, parte de producto) Filas de producto de la matriz de combinaciones (v1.4.1); el resto de la matriz es canon spec-OPL §8.3.

| # | Combinación (rol × modificador × abanico × otros) | Estatus | Plantilla OPL compuesta | Resolución / regla |
| --- | --- | --- | --- | --- |
| C-25 (parte de producto) | agente/instrumento × — × ruta | no emitida por producto | — | restricción de producto R-OPL-RUTA-3 (perfil reglas-opforja §4.12); el canon la declara válida (canon spec-OPL §8.3, C-25) |
| C-26 | cualquier enlace × `c` + `e` (mismo enlace) | **no-canonizada** | — | R-COMB-3; §8.4 |

#### §8.3.1 Colisión de rol y precedencia de recomposición (delegación a `reglas §6.5`/`§6.6`)

La resolución de colisión de rol (dos enlaces procedimentales entre el mismo **objeto** y el mismo *proceso*) y la precedencia transformadora al recomponer son **validez nuclear**: su ley vive en `urn:fxsl:kb:reglas-opm-estrictas-es` §6.5 (R-FUERZA-1..4: orden de 12 niveles, `consumo = resultado > efecto > agente > instrumento`, con `evento > sin control > condición` dentro de cada clase) y §6.6 (R-PREC-1..5: matriz 3×3 de recomposición; Resultado+Resultado y Consumo+Consumo inválidos; transformador prevalece sobre habilitador). Esta spec NO re-legisla esas tablas ni acuña IDs paralelos: la capa OPL solo refleja el resultado ya resuelto por el kernel (`modelo/**`, ver GAP-COL-RESOLUCION en §8.5) y no tiene obligación de emitir un reporte narrativo de colisión o precedencia.

Rationale: `reglas §Mapa de familia` — cada regla vive una vez en su capa propietaria; las demás capas citan por URN y delegan la decisión.

### §8.4 Zonas no-canonizadas explícitas

Las siguientes combinaciones son **silencios de la SSOT** (`reglas §11.2`, R-ZNC-1/2): NO están prohibidas explícitamente ni canonizadas. Se marcan **no-canonizadas**; la generación NO DEBE emitirlas, el parser NO DEBE construirlas, y NUNCA DEBE inventarse primitiva para llenarlas.

| Zona no-canonizada | Estado | Fundamento |
| --- | --- | --- |
| `c` + `e` sobre el **mismo** enlace | No definida en gramática OPL ni en geometría visual | `reglas §6.4`, `§11.2` (AP-28); R-COMB-3 |
| Fan **mixto** (algunas ramas `c`, otras sin control) bajo patrón condicional | El canon no define la realización condicional de un fan parcialmente condicional | R-FAN-3 (recae en fan directo, no en patrón condicional) |

- **R-ZNC-COMB-1**: ante una de estas zonas, la herramienta DEBE o bien rechazar la entrada como no-canónica, o bien declararla **extensión local marcada**; NO DEBE silenciarla emitiendo una superficie inventada como si fuera canon.

  Rationale: `reglas §11.2` (R-ZNC-2): la herramienta NO inventa regla OPM nuclear para una zona no canonizada.

### §8.5 GAPs de cobertura — combinatoria

- GAP-FAN-EVENTO: parcial. `app/src/opl/generadores/abanico.ts` ya emite y `parsear.ts` ya reconoce el caso de efecto con objeto común y procesos alternativos (`**B** inicia exactamente uno de *P*, *Q* o *R*, y es afectado por el proceso que ocurre.`). Permanecen sin generador los otros roles bajo evento con fan.

- GAP-FAN-RESULTADO-COND: cerrado. `abanico.ts·oracionAbanicoCondicional` degrada resultado+condición+fan a fan base; `puede generarse` ya no se exporta.

- GAP-PROB-SUPERFICIE: cerrado. `procedural.ts·sufijoProbabilidad` y `abanico.ts` emiten `Pr=p`; `parsear.ts` lo trata como anotación de superficie y preserva el hecho base.

- GAP-FAN-M: no hay generador para `exactamente m de f` / `al menos m de f` (R-FAN-8 / C-30 sentido m-de-f); `abanico.ts` solo emite el caso `m=1`.

- GAP-COL-RESOLUCION: cerrado por ajuste-spec. La resolución de colisión de rol por fuerza semántica y la precedencia de recomposición (`reglas §6.5`/`§6.6`, citadas en §8.3.1) son operaciones de modelo; la resolución vive en el kernel de modelo, no en la capa OPL.

  Estado: alineado por ubicación arquitectónica. La OPL puede reflejar el resultado ya resuelto del kernel, pero NO tiene obligación de emitir un reporte narrativo de colisión o precedencia.

## §9 Composición de oraciones y prosa OPL

[extensión] Las secciones §2–§8 canonizan la realización **atómica**: una oración, un hecho. Esta sección canoniza el **álgebra de composición** que coordina dos o más oraciones atómicas en una **prosa OPL más rica** mediante cópulas y conectores, sin perder direccionabilidad por hecho. La composición es una transformación de superficie: fusiona el **texto**, NUNCA el **mapeo a modelo**. Cada hecho coordinado conserva su `ref` y su sub-span.

Rationale: el operador requiere prosa OPL más prosaica con conectores; BUG-f897bc demostró que la fusión ingenua (colapsar enlaces en una línea opaca) rompe el resaltado bidireccional, el filtrado y la edición. §9 fija cómo componer **preservando** la direccionabilidad por hecho.

### §9.0 Regla maestra — composición a nivel de token, nunca fusión opaca

- **R-COMP-MAESTRA-1**: una oración compuesta DEBE ser **UNA línea de texto con N sub-spans**, donde cada hecho coordinado conserva **su propia `ref` y su propio `hint`**. La composición DEBE operar a nivel de token (concatena texto, preserva mapeo); NUNCA DEBE producir una fusión opaca que descarte los tokens/refs de los hechos individuales.

  Correcto: `*Cocinar* consume **Agua**, genera **Sopa** y requiere **Olla**.` — una línea; `refs` = { enlace-consumo, enlace-resultado, enlace-instrumento, *Cocinar*, **Agua**, **Sopa**, **Olla** }; `hints` = un sub-span por cada verbo (`consume`/`genera`/`requiere`) y un sub-span por cada objeto, cada uno con su `ref`. El hover sobre `genera` resalta el enlace-resultado; el filtrado por **Olla** conserva la línea; la edición sobre `consume **Agua**` clasifica al enlace-consumo.
  Incorrecto: una línea `*Cocinar* consume **Agua**, genera **Sopa** y requiere **Olla**.` con un único token de texto y `refs = []` (o solo el proceso) — fusión opaca; el hover, el filtrado y la edición ya no resuelven al hecho individual.
  Rationale: BUG-f897bc fusionó los enlaces hijos en una línea plural que colapsó los tokens/refs por enlace, rompiendo el resaltado bidireccional y la edición; la regla maestra prohíbe exactamente esa pérdida.

- **R-COMP-MAESTRA-2**: en una oración compuesta, `refs` de la línea DEBE ser la **unión** (sin duplicados por `tipo:id`, vía `refsUnicasPorTipoId`) de los `refs` de los hechos coordinados, y `hints` DEBE contener **un sub-span por hecho** (verbo, objeto, estado). NO DEBE existir un hecho coordinado sin su `ref` y su `hint` en la línea.

  Rationale: `interaccion.ts·crearLineaOplInteractiva` ya construye `refs` como conjunto único y `tokens` por ubicación de `hints`; `lineaTocaReferencia` y `filtrarLineasPorReferencia` resuelven al hecho solo si su `ref` está en la unión.

- **R-COMP-MAESTRA-3**: hover, filtrado, navegación y clasificación de edición DEBEN resolver al **hecho individual**, no a la oración completa. Un clic/hover sobre un sub-span DEBE devolver la `ref` de ese sub-span (vía `referenciaEnlaceEspecifico`), no la primera `ref` de la línea.

  Rationale: `interaccion.ts·referenciaEnlaceEspecifico` ya resuelve la `ref` de enlace por posición de token; la composición DEBE poblar los tokens de modo que esa resolución siga funcionando span a span.

### §9.1 Ejes de coordinación y conectores

(Ejes de composición, parte de producto) [extensión] Ejes de la oración compuesta de producto (v1.4.1); los ejes canónicos son canon spec-OPL §9.1.

| Eje | Patrón | Plantilla |
| --- | --- | --- |
| (a) sujeto compartido / predicado coordinado | un *proceso* sujeto, varios predicados procedimentales | `*P* consume **A**, genera **B** y requiere **C**.` |
| (d) condicional / temporal / causal | coordinación donde el canon lo soporte | `*P* ocurre si **A** existe, en cuyo caso *P* consume **A**, de lo contrario *P* se omite.` |

- **R-COMP-EJE-2** [extensión] (eje a — predicado coordinado; presentación fuera del canon, canon spec-OPL R-COMP-CFG-1): varias oraciones procedimentales con el **mismo *proceso* sujeto** PUEDEN coordinarse en una línea, repitiendo el verbo por hecho. Cada par verbo+complemento conserva su sub-span y su `ref` de enlace. La composabilidad declarada en §3.1, §3.2, §3.3, §4 habilita este eje.

### §9.2 Reglas de elegibilidad

- **R-COMP-ELEG-1** (mismo eje): solo PUEDEN coordinarse hechos que compartan **exactamente un** eje de §9.1. Mezclar ejes (p. ej. predicado coordinado con destino enumerado de otra relación) en una sola línea NO DEBE realizarse.

- **R-COMP-ELEG-2** (misma familia semántica): el eje (a) NO DEBE coordinar familias incompatibles que el canon separa: un predicado transformador (`consume`/`genera`/`afecta`/`cambia`) PUEDE coordinarse con habilitadores (`requiere`/`maneja`) bajo sujeto-proceso compartido, pero NUNCA DEBE coordinar consumo con resultado **sobre el mismo objeto** ni mezclar la designación de clasificación genérica (esencia/afiliación) con oraciones de enlace. La esencia y la afiliación entre sí **SÍ se coordinan** en la oración combinada de clasificación (R-ENT-3, extensión declarada; §2.7/§2.8); lo prohibido es coordinarlas con predicados de enlace.

  Rationale: §3.1/§3.2 prohíben coordinar consumo con resultado en un predicado sobre el mismo objeto; R-ENT-3 coordina esencia+afiliación en una sola oración de designación, distinta de las oraciones de enlace.

- **R-COMP-ELEG-3** (orden determinista estable): el orden de los hechos coordinados DEBE ser **determinista y estable** entre emisiones; DEBERÍA seguir el orden de fuerza semántica (consumo, resultado, efecto, agente, instrumento) en el eje (a) y el orden de modelo de los destinos en el eje (b). Un orden inestable rompe el roundtrip y la diffabilidad del texto.

  Rationale: R-COMB-4 fija orden de marcadores superficiales estable; la composición hereda esa exigencia.

- **R-COMP-ELEG-4** (preservación obligatoria de tokens): una coordinación es elegible SOLO si la línea resultante puede poblar `hints` con un sub-span por hecho sin solापamiento ambiguo. Si dos hechos producirían el **mismo** texto de span sin ancla de posición que los distinga, la coordinación NO DEBE realizarse; los hechos DEBEN emitirse atómicos.

  Rationale: `interaccion.ts·tokenizarConHints` ubica cada hint por `indexOf` y ordena por posición; spans idénticos sin desambiguación posicional colisionarían, perdiendo direccionabilidad — exactamente la pérdida que la regla maestra prohíbe.

### §9.3 Zonas prohibidas de composición

- **R-COMP-ZP-2** (toda composición que pierda refs/hints): cualquier coordinación que no satisfaga R-COMP-MAESTRA-1/2/3 (sub-span por hecho, unión de refs, resolución al hecho individual) está **prohibida**, sin importar el eje. La prosa más rica NUNCA justifica perder direccionabilidad.

- **R-COMP-ZP-3** (lo que el parser no descompone): NO DEBE emitirse una oración compuesta que el parser no pueda descomponer a sus hechos atómicos (R-COMP-REV-1). Composición sin reverse equivalente está prohibida.

  Rationale: la bisimetría OPL (`reglas §9`) exige que toda forma emitida sea parseable; una composición no parseable rompe el roundtrip.

### §9.4 Reverse / roundtrip

- **R-COMP-REV-1** (descomposición obligatoria): el parser DEBE descomponer una oración compuesta en sus hechos atómicos, reconstruyendo un enlace/relación por sub-span coordinado. El parseo de la línea coordinada DEBE producir el **mismo conjunto de mutaciones** que el parseo de las oraciones atómicas equivalentes.

  Rationale: el parser ya descompone el abanico (`parsear.ts·ABANICO_VERBO_RE_LIST`) en un enlace por miembro; la coordinación de §9 extiende esa descomposición a predicados/destinos enumerados.

- **R-COMP-REV-2** (invariante de identidad): **componer → parsear = identidad sobre el conjunto de hechos**. Sea `F = {f1, …, fn}` el conjunto de hechos atómicos; `parsear(componer(F)) = F` como conjunto (no necesariamente como orden de líneas). El roundtrip se defiende sobre el conjunto de hechos, no sobre la cadena de texto.

  Rationale: `roundtrip.test.ts` / `fixtures-roundtrip.ts` defienden bisimetría sobre hechos; la composición es display y NO DEBE alterar el conjunto de hechos recuperado.

### §9.5 Configuración display-vs-canónico

- **R-COMP-CFG-2**: el contrato display-vs-canónico de la composición DEBE ser el **mismo** que el del resto de la spec: la presentación PUEDE reordenar/coordinar; la equivalencia se evalúa sobre la forma canónica normalizada. La opción de prosa NO DEBE introducir un canon paralelo.

### §9.6 Traza a código y GAPs

**Estado actual**: los generadores de `app/src/opl/generadores/` emiten hoy oraciones **atómicas** por hecho procedimental (`procedural.ts·oracionEnlaceSinEtiqueta`), salvo dos casos ya coordinados: la **enumeración estructural de destinos** (`estructural.ts·oracionEstructural`, eje b) y el **abanico** (`abanico.ts` + `refsHints.ts·refsAbanico`/`hintsAbanico`, eje e). La coordinación de **predicados con sujeto-proceso compartido** (eje a) es **capacidad nueva**.

- **GAP-COMPOSICION**: no existe hoy un generador que coordine predicados de distinto verbo bajo un sujeto-proceso compartido (eje a, R-COMP-EJE-2). El punto de implementación es una capa de composición que, **sobre el resultado atómico** de `procedural.ts·oracionEnlaceSinEtiqueta`, agrupe `OplLineaPendiente` por sujeto-proceso y produzca una `OplLineaPendiente` única con:
  - `texto` = predicados concatenados con conector serial es-CL (§9.1 R-COMP-EJE-1);
  - `refs` = unión de los `refsEnlace` de cada predicado (R-COMP-MAESTRA-2, vía el `refsUnicasPorTipoId` que `crearLineaOplInteractiva` ya aplica);
  - `hints` = concatenación de los `hintsEnlace` de cada predicado, un sub-span por verbo/objeto/estado (R-COMP-MAESTRA-1).
  El patrón de referencia es `refsHints.ts·refsAbanico`/`hintsAbanico`: ya construye una línea con unión de refs y un hint por enlace hijo; el eje (a) lo reusa para predicados heterogéneos.

- **GAP-COMP-GUARDA** (remite §7.7): no-aplicable hasta que exista GAP-COMPOSICION. Cuando se implemente la capa de composición del eje (a), DEBE materializar este guard: antes de coordinar, descartar candidatos cuyos enlaces pertenezcan a un OPD hijo de refinamiento, y descartar la fusión si rompería R-COMP-ELEG-4 (spans ambiguos).

  Estado actual: no-aplicable hasta que exista la capa de composición GAP-COMPOSICION. Mientras la salida se mantenga atómica por construcción, los enlaces hijos de refinamiento no se coordinan porque no hay transformador que los fusione.

- **GAP-COMP-REVERSE**: el parser (`parsear.ts`) descompone hoy el abanico (`ABANICO_VERBO_RE_LIST`) y la enumeración estructural, pero NO una línea de predicados coordinados de distinto verbo bajo un sujeto compartido (eje a). R-COMP-REV-1 exige una regla de descomposición que segmente la línea por conector serial y reparse cada predicado contra el sujeto compartido; sin ella, el eje (a) NO DEBE emitirse (R-COMP-ZP-3).

Rationale: BUG-f897bc, `interaccion.ts` (tokens/refs/hints), `refsHints.ts` (`OplLineaPendiente`, `refsAbanico`/`hintsAbanico`), `reglas §9` (bisimetría OPD↔OPL) y §7.7 (zona prohibida en refinamiento).

## §10 Multiplicidad y cardinalidad

### §10.2 Rangos, intervalos y restricciones

- **R-MULT-3** (normalización Unicode): los glifos Unicode `≠`, `≤`, `≥`, `∈` son **visualización** y DEBEN normalizarse a su forma ASCII (`<>`/`!=`, `<=`, `>=`, `en {…}`) en el texto canónico, o declararse explícitamente como extensión de producto. El texto que alimenta al parser NO DEBE contener glifos Unicode de restricción sin normalizar.

  Rationale: el texto canónico es la forma que alimenta parser y roundtrip; los glifos son presentación, igual que el contrato display-vs-canónico del resto de la spec.

### §10.3 Combinatoria

La combinación de multiplicidad con rol y abanico remite a §8.2. Esta sección NO DEBE redefinir esa combinatoria; SOLO aporta la realización de la cardinalidad por participación.

| Campo | Valor |
| --- | --- |
| ID | `R-MULT-1`–`R-MULT-3`, `R-MULT-1A/1B/1C` |
| Plantilla | `<frase-cardinalidad> <sustantivo>` antepuesta al destino del enlace |
| Tokenización | la frase de cardinalidad DEBE ser un sub-span propio, distinto del sub-span del objeto |
| Orden | la cardinalidad precede al sustantivo; sin coma de Oxford en listas (remite §9.1 R-COMP-EJE-1) |
| Composabilidad | combina con rol/abanico vía §8.2 |
| Reverse | el parser DEBE reconstruir el rango desde la frase de cardinalidad y normalizar Unicode a ASCII |
| Roundtrip | `parsear(emitir(rango)) = rango` sobre el rango normalizado |
| Traza a código | `app/src/opl/generadores/refsHints.ts·nombreOplExtremo` |
| Procedencia | `urn:fxsl:kb:reglas-opm-estrictas-es §6.7` |

Rationale: `urn:fxsl:kb:reglas-opm-estrictas-es §6.7` canoniza la tabla símbolo→rango→OPL y los rangos/intervalos; `refsHints.ts·nombreOplExtremo` realiza el nombre de extremo cuantificado.

## §11 Etiquetas de ruta

### §11.1 Plantillas

R-OPL-RUTA-3 (restricción de producto de `Por ruta` a consumo y resultado) se define en perfil reglas-opforja §4.12 [endurecimiento]; R-OPL-RUTA-1 y R-OPL-RUTA-2 son canon spec-OPL §11.1 [informativo].

(R-OPL-RUTA-1, R-OPL-RUTA-2, parte de producto)

| Campo | Valor |
| --- | --- |
| Tokenización | `Por ruta` = token fijo; `<etiqueta>` = sub-span con `ref` a la ruta nombrada |
| Composabilidad | combina con consumo/resultado (extensión de producto); canon admite toda oración procedimental |
| Reverse | el parser DEBE detectar el prefijo `Por ruta <etiqueta>,` y asociar la etiqueta de ruta al enlace resultante |
| Roundtrip | la etiqueta DEBE preservarse: `parsear(emitir(ruta)) = ruta` |
| Traza a código | generación `app/src/opl/generadores/procedural.ts·oracionEnlaceConRuta` (prefijo `Por ruta L,`); parseo `parsear.ts·RUTA_PREFIJO_RE` (línea 25); aplicación reverse `aplicar.ts` → `modelo/rutas·definirRutaEtiqueta`; defendido por `parser.test.ts` (rutaEtiqueta en reverse). Sin fixture bisimétrica estricta: GAP-FIXTURE-RUTA (§20) |
| Procedencia | `urn:fxsl:kb:reglas-opm-estrictas-es §4.12` |

Rationale: `urn:fxsl:kb:reglas-opm-estrictas-es §4.12` canoniza la etiqueta de ruta y la regla `A.5`; `procedural.ts` es el punto de emisión procedimental donde el prefijo de ruta se ancla.

## §12 Plegado y despliegue de OPL (display)

Esta sección canoniza la **presentación** de la OPL completa de un modelo: cómo se agrupan las oraciones por OPD, el orden de los OPDs y el **plegado parcial** en OPDs ascendentes. El plegado es **display**: NUNCA altera el texto canónico que alimenta parser y roundtrip.

### §12.1 Agrupación y orden de la OPL completa

R-OPL-DISP-1 y R-OPL-DISP-3: ver canon spec-OPL §12.1 y §12.2.

- **R-OPL-DISP-2**: el orden de los OPDs en la OPL completa DEBE ser **determinista y estable** entre emisiones, para preservar la diffabilidad del texto y la equivalencia del roundtrip.

  Rationale: un orden inestable de bloques rompe la diffabilidad y la comparación de la OPL completa, igual que el orden inestable de hechos coordinados (§9.2 R-COMP-ELEG-3).

### §12.2 Plegado parcial

- **R-OPL-DISP-4** (display-vs-canónico): el plegado parcial es **presentación**. NO DEBE alterar el texto canónico que alimenta al parser ni al roundtrip. La forma plegada y la forma expandida DEBEN parsear al **mismo conjunto de hechos**.

  Correcto: un OPD ascendente pliega los subprocesos de *Cocinar*; la OPL desplegada del OPD hijo y la plegada del padre parsean al mismo conjunto de hechos.
  Incorrecto: el plegado descarta enlaces del conjunto de hechos recuperado por el parser.
  Rationale: §Convenciones (Display-vs-canónico) y §9.5 R-COMP-CFG-1: la presentación se normaliza a la forma canónica para equivalencia; el plegado NO introduce un canon paralelo.

| Campo | Valor |
| --- | --- |
| ID | `R-OPL-DISP-1`–`R-OPL-DISP-4` |
| Emisión | bloques por OPD, orden determinista; hechos refinados plegados en OPD ascendente |
| Composabilidad | combina con la composición de §9 y el refinamiento de §7 |
| Reverse | el parser DEBE recuperar el mismo conjunto de hechos desde la forma plegada o la expandida |
| Roundtrip | `parsear(plegada) = parsear(expandida)` sobre el conjunto de hechos |
| Traza a código | `app/src/opl/bloquesJerarquicos.ts·agruparOracionesPorOpd` / `ordenarOpdsParaOpl`; `app/src/opl/generadores/plegado.ts·oracionPlegadoParcial` |
| Procedencia | §Convenciones (Display-vs-canónico); §7 (refinamiento); `reglas §9` (bisimetría) |

Rationale: `bloquesJerarquicos.ts·agruparOracionesPorOpd`/`ordenarOpdsParaOpl` realizan la agrupación y el orden de la OPL completa; `aplanarBloquesOpl`, `chevronEstadoBloque` y `togglearColapsoBloque` realizan la mecánica display de colapso/expansión de bloques; `plegado.ts·oracionPlegadoParcial` realiza el plegado parcial; el contrato display-vs-canónico hereda de §Convenciones y §9.5.

## §13 Presentación del panel OPL

Esta sección canoniza la **presentación** del panel OPL: el orden global de las oraciones, la numeración, el plegado-display, la visibilidad de esencia y el minimizado del panel. Toda regla de esta sección es **display**: la presentación NUNCA altera el texto canónico que alimenta al parser ni al roundtrip (remite §Convenciones, §12). El derivado del panel se computa en `panel.ts·derivarPanelOpl`, que produce dos pases: el **pase canónico** (`textoOplActual`, siempre con `VISIBILIDAD_OPL_DEFAULT`) y el **pase display** (`lineas`), que aplica las preferencias de presentación.

### §13.1 Orden global de las oraciones

- **R-OPL-PANEL-1**: el panel DEBE presentar las oraciones agrupadas **por OPD** y ordenadas según el orden jerárquico de los OPDs del modelo. El orden DEBE ser determinista y estable entre emisiones (remite §12 R-OPL-DISP-1, R-OPL-DISP-2).

  Rationale: `panel.ts·derivarPanelOpl` ordena los OPDs con `ordenarOpdsParaOpl` y agrupa las oraciones en bloques con `agruparOracionesPorOpd`; un orden inestable rompería la diffabilidad del texto y la equivalencia del roundtrip.

- **R-OPL-PANEL-2**: cada bloque del panel DEBE quedar rotulado con el OPD que lo origina, preservando su profundidad jerárquica para el sangrado-display. El rótulo DEBE derivar de `opdId`/`opdNombre`/`opdProfundidad` de cada línea interactiva.

  Rationale: `interaccion.ts·OplLineaInteractiva` porta `opdId`, `opdNombre` y `opdProfundidad`; `panel.ts` deriva `bloques` a partir de esos metadatos para componer la jerarquía visible del panel.

### §13.2 Numeración

- **R-OPL-PANEL-3**: el panel DEBE ofrecer un conmutador de numeración on/off. La numeración es **display**: activarla o desactivarla NO DEBE alterar el texto canónico ni el conjunto de hechos recuperado por el parser.

  Correcto: con numeración activa el panel antepone el `ordinal` a cada línea; con numeración inactiva muestra solo el texto.
  Incorrecto: la numeración se incrusta en `textoOplActual` y el parser intenta leer el número como token OPL.
  Rationale: el comportamiento observado de OPCloud expone un toggle de numeración tanto en el panel OPL como en los settings; el número es ordinal de presentación, no un token canónico. `interaccion.ts·OplLineaInteractiva` porta `ordinal` justamente para sostener esta presentación sin contaminar el texto.

### §13.3 Plegado-display

- **R-OPL-PANEL-4**: el panel DEBE renderizar la forma **plegada** de los hechos refinados en OPDs ascendentes (remite §12 R-OPL-DISP-3). El plegado-display NO DEBE alterar el texto canónico (remite §12 R-OPL-DISP-4); la forma plegada y la expandida DEBEN parsear al mismo conjunto de hechos.

  Rationale: el plegado vive en el pase display; `panel.ts·derivarPanelOpl` agrupa siempre desde `lineas` (pase display) y deja `textoOplActual` intacto para el roundtrip (remite §12).

### §13.4 Visibilidad de esencia

- **R-OPL-PANEL-5**: el panel DEBE respetar la preferencia de visibilidad de esencia al renderizar las líneas display, sin afectar el texto canónico. El detalle del enum de visibilidad (`siempre` / `solo-difiere` / `oculta`) se canoniza en §16.

  Rationale: `panel.ts·derivarPanelOpl` recibe `visibilidad` (`VisibilidadOpl`, ver `opciones.ts`) y la aplica **solo** al pase display: cuando `visibilidad.esencia` difiere del default regenera `lineas` con `generarOplInteractivo(modelo, id, visibilidad)`; `textoOplActual` se genera siempre con `VISIBILIDAD_OPL_DEFAULT`. El enum corresponde a §16, no a esta sección.

### §13.5 Minimizar el panel

- **R-OPL-PANEL-6**: el panel OPL DEBE poder minimizarse. Minimizado, el panel DEBERÍA detener el renderizado de las oraciones para liberar espacio y carga en OPDs densos; restaurarlo DEBE recuperar la presentación íntegra sin pérdida de hechos.

  Rationale: comportamiento observado de OPCloud — "we can minimize the opl pane; this will stop rendering the opl" para dar un entorno OPD más limpio en diagramas saturados. La minimización es estado de UI; NO DEBE alterar el conjunto de hechos del modelo.

| Campo | Valor |
| --- | --- |
| ID | `R-OPL-PANEL-1`–`R-OPL-PANEL-6` |
| Conducta | orden por OPD jerárquico; rótulo de bloque; toggle de numeración; plegado-display; visibilidad de esencia; minimizar |
| Emisión | dos pases: canónico (`textoOplActual`) y display (`lineas`/`bloques`) |
| Orden | determinista y estable por `ordenarOpdsParaOpl`; agrupación por `agruparOracionesPorOpd` |
| Reverse | ningún ajuste de presentación (numeración, plegado, esencia, minimizado) altera el conjunto de hechos parseado |
| Traza a código | `app/src/opl/panel.ts·derivarPanelOpl`; `app/src/opl/bloquesJerarquicos.ts·agruparOracionesPorOpd` / `ordenarOpdsParaOpl` / `aplanarBloquesOpl` / `chevronEstadoBloque` / `togglearColapsoBloque`; `app/src/opl/interaccion.ts·OplLineaInteractiva` (`ordinal`/`opdProfundidad`); `app/src/opl/opciones.ts·VisibilidadOpl` (detalle §16) |
| Procedencia | §12 (display-vs-canónico); §16 (visibilidad de esencia); videos OPCloud (numeración, minimizar) — precedencia 3 |

Rationale: `panel.ts·derivarPanelOpl` es el punto único de derivación de la presentación; separa el pase canónico del display para que numeración, plegado, esencia y minimizado nunca contaminen el roundtrip. La numeración y el minimizado se sostienen sobre evidencia observacional de OPCloud, no sobre canon.

## §14 Interacción OPL↔OPD

Esta sección canoniza la **interacción bidireccional** entre las oraciones del panel OPL y los elementos del canvas OPD: el modelo de tokens y referencias, el resaltado recíproco al hacer hover, la navegación por click, el filtrado de líneas por selección, y la **resolución por sub-span** en oraciones compuestas. La interacción se apoya en el modelo de tokens de `interaccion.ts`; NUNCA altera el conjunto de hechos del modelo.

### §14.1 Modelo de tokens y referencias

- **R-OPL-INT-1**: cada línea interactiva DEBE descomponerse en **tokens** (`OplToken`), y cada token portador de un elemento del modelo DEBE llevar una **referencia** (`OplReferencia`) discriminada por tipo: `entidad`, `enlace` o `estado`. Los tokens sin referencia DEBEN tener rol `texto`.

  Rationale: `interaccion.ts·OplReferencia` define el coproducto `entidad | enlace | estado` (cada variante con su `Id`); `OplToken` porta `rol` (`texto`/`nombre`/`verbo`/`estado`) y `ref` opcional. La tokenización con hints (`crearLineaOplInteractiva` → `tokenizarConHints`) ubica cada hint sobre el texto y asigna su `ref`.

- **R-OPL-INT-2**: las referencias de una línea DEBEN ser únicas por par `tipo:id`. La deduplicación DEBE preservar el orden de primera aparición.

  Rationale: `crearLineaOplInteractiva` normaliza `refs` con `refsUnicasPorTipoId`, que conserva la primera aparición y descarta duplicados por clave `tipo:id`; esto sostiene un filtrado y un resaltado deterministas.

### §14.2 Hover bidireccional

- **R-OPL-INT-3**: el hover DEBE ser **bidireccional**. Al posar el cursor sobre un elemento del canvas, el panel DEBE resaltar las líneas cuyas referencias tocan ese elemento; al posar el cursor sobre una línea OPL, el canvas DEBE resaltar los elementos referidos por esa línea.

  Correcto: hover sobre el objeto **Llamada** resalta toda línea cuya `refs` contiene `{ tipo: "entidad", id: <Llamada> }`.
  Incorrecto: el hover resalta por coincidencia textual del nombre en vez de por referencia tipada.
  Rationale: `interaccion.ts·lineaTocaReferencia` resuelve la pertenencia comparando `refs` con la referencia activa vía `mismaReferencia` (igualdad por `tipo` e `id`). Comportamiento observado de OPCloud: "when I'm hovering over an element in opd the opl will be highlighted and when I'm hovering on an opl the opd will be highlighted" (precedencia 3).

### §14.3 Navegación por click

- **R-OPL-INT-4**: el click sobre un token con referencia DEBE navegar al elemento referido en el canvas (foco/selección). El click NO DEBE mutar el modelo; es navegación, no edición.

  Rationale: el token portador expone su `ref` (`OplToken.ref`); la navegación resuelve el destino desde esa referencia tipada. La edición inline de propiedades de elementos/enlaces (doble-click) es un canal distinto, no cubierto por esta regla. La capa OPL pura solo entrega tokens y referencias; el handler click→foco vive en la UI del panel (`app/src/ui`) y no debe buscarse ni implementarse dentro de `app/src/opl/**`.

### §14.4 Filtrado por selección/referencia

- **R-OPL-INT-5**: el panel DEBE poder **filtrar** sus líneas para mostrar solo las que tocan la referencia activa (selección). Sin referencia activa, el filtro DEBE devolver todas las líneas.

  Rationale: `interaccion.ts·filtrarLineasPorReferencia` devuelve la lista completa cuando `ref` es `null`, y en caso contrario retiene las líneas que satisfacen `lineaTocaReferencia`. `panel.ts·derivarPanelOpl` aplica este filtro cuando `filtroActivo` está activo, derivando la referencia de selección con `referenciaSeleccionada` (`enlaceSeleccionId` tiene precedencia sobre `seleccionId`).

### §14.5 Resolución por sub-span en oraciones compuestas

- **R-OPL-INT-6**: en una oración **compuesta** (múltiples enlaces coordinados, remite §9), la interacción DEBE resolverse por **sub-span**: el punto de hover/click sobre un token específico DEBE seleccionar el enlace asociado a ese sub-span, no el conjunto entero de la oración.

  Correcto: en una oración que coordina varios enlaces, hacer hover sobre el nombre de un objeto resuelve el enlace que ese sub-span realiza.
  Incorrecto: hacer hover sobre cualquier parte de la oración compuesta selecciona indistintamente todos sus enlaces.
  Rationale: `interaccion.ts·referenciaEnlaceEspecifico(linea, posicionToken)` resuelve el enlace por posición de token: si el token apunta a un `enlace`, lo devuelve directo; si apunta a una `entidad`, busca la referencia de enlace **inmediatamente previa** en `linea.refs` y la devuelve. Esto operacionaliza el sub-span de §9 (oraciones de composición/coordinación) y reproduce el comportamiento observado de OPCloud: en una oración con varios enlaces, el doble-click "will show me which link I want to select to edit" (precedencia 3).

| Campo | Valor |
| --- | --- |
| ID | `R-OPL-INT-1`–`R-OPL-INT-6` |
| Conducta | tokens+referencias tipadas; hover bidireccional; navegación por click; filtrado por selección; resolución por sub-span |
| Tokenización | `crearLineaOplInteractiva` → `tokenizarConHints` ubica hints y asigna `ref`; `refsUnicasPorTipoId` deduplica por `tipo:id` |
| Reverse | la interacción es navegación/resaltado; NUNCA muta el conjunto de hechos (la edición inline es canal aparte) |
| Traza a código | `app/src/opl/interaccion.ts·OplToken` / `OplReferencia` / `OplTokenHint`; `·crearLineaOplInteractiva`; `·lineaTocaReferencia`; `·filtrarLineasPorReferencia`; `·referenciaEnlaceEspecifico`; `·mismaReferencia`; `app/src/opl/panel.ts·derivarPanelOpl` / `referenciaSeleccionada` |
| Procedencia | §9 (oraciones compuestas/sub-span); videos OPCloud (hover bidireccional, edición de enlace en oración compuesta) — precedencia 3 |

Rationale: el modelo de tokens de `interaccion.ts` es el sustrato único de la bidireccionalidad OPL↔OPD; la igualdad por referencia tipada (`mismaReferencia`) y la resolución por posición (`referenciaEnlaceEspecifico`) permiten resaltar, navegar y filtrar con precisión de sub-span, sin recurrir a coincidencia textual ni a mutar el modelo.

## §15 Edición de OPL

La edición de OPL es el canal **reverse** del panel: el operador modifica texto OPL-ES y la forja deriva mutaciones sobre el modelo. La edición NO DEBE confundirse con la interacción de navegación de §14 (selección/hover, que nunca muta hechos). El sustrato de la edición libre es la **clasificación por línea** que `clasificadorEdicion.ts·clasificarEdicionOpl` produce sobre la previsualización del planificador (`PrevisualizacionOplReverse`), sin reescribir el parser ni mutar el modelo en seco.

Rationale: `clasificadorEdicion.ts` consume el output de `parser`/`planificar` y agrupa patches y diagnósticos por línea; `aplicar.ts·aplicarPatchesOpl` materializa los patches aprobados. La separación clasificar→aplicar mantiene la edición honesta: el operador ve qué hará cada línea antes de comprometerla.

### §15.1 Clasificación de líneas editadas

- **R-OPL-EDIT-1**: cada línea del editor libre DEBE clasificarse en exactamente uno de cuatro estados estables (`EstadoLineaOpl`):

  | Estado | Condición canónica | Acción |
  | --- | --- | --- |
  | `ignorada-vacia` | la línea es solo whitespace tras `trim` | se descarta; NO produce patch ni diagnóstico |
  | `aplicable` | la línea tiene ≥1 patch propuesto | se ofrece para aplicar; `cambioId` apunta al primer patch; `descripcionCambio` lo resume |
  | `no-aplicable` | sin patches y con diagnóstico `severidad=error` | se bloquea con una `RazonNoAplicable` canónica |
  | `sin-cambio` | sin patches y sin error (parseada, consistente con el modelo, o warning/info) | se reconoce pero NO muta |

  Rationale: `clasificarEdicionOpl` aplica el criterio en ese orden de precedencia (vacía → aplicable → error → sin-cambio); el orden DEBE respetarse porque una línea con patch jamás es no-aplicable, y una línea parseada sin mutación es `sin-cambio`, no error.

- **R-OPL-EDIT-2**: el conteo del `ResumenClasificacion` (`total`, `aplicables`, `noAplicables`, `ignoradas`, `sinCambio`) DEBE ser estable y derivado de la clasificación línea a línea. El botón de aplicar DEBE rotularse con `etiquetaBotonAplicar(aplicables)`: `Aplicar N cambio(s)` cuando `aplicables>0`, y `Sin cambios aplicables` cuando `aplicables<=0`.

  Rationale: `etiquetaBotonAplicar` es puro y testeable sin DOM; el rótulo honesto evita prometer aplicación cuando no hay nada que mutar.

### §15.2 Razones de no-aplicabilidad

- **R-OPL-EDIT-3**: cuando una línea es `no-aplicable`, la razón DEBE provenir del enum cerrado `RazonNoAplicable`, derivado del código de diagnóstico del parser:

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

  Rationale: `razonDesdeDiagnostico` realiza el mapeo cerrado; el enum NO DEBE crecer sin canonizar el diagnóstico correspondiente.

- **R-OPL-EDIT-4**: una línea **ausente** NO DEBE borrar un hecho del modelo. La ausencia se trata como `no-delete-by-absence` (info), y de escalar a error se clasifica como `inversa-no-soportada`.

  Rationale: la edición reverse es aditiva/mutadora explícita, no diferencial; borrar por omisión rompería la bidireccionalidad porque el texto display de §16 puede ocultar hechos sin que el operador los borre.

### §15.3 Mapeo edición → mutación

- **R-OPL-EDIT-5**: cada patch `aplicable` DEBE mapearse a la mutación de modelo que `aplicar.ts·aplicarPatchesOpl` ejecuta en tres fases ordenadas: (1) patches no-enlace, (2) patches de enlace, (3) abanicos. El orden DEBE respetarse: los enlaces dependen de entidades creadas en la fase 1; los abanicos requieren que los enlaces de sus ramas ya existan.

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

  Rationale: las dos funciones de aplicación (`aplicarPatchesOpl` para el editor libre por patches; `edicionCanvas.ts·aplicarEdicionOpl` para intenciones inline acotadas) comparten las mismas operaciones de modelo, garantizando que la edición OPL no abra mutaciones fuera del kernel.

- **R-OPL-EDIT-6**: la creación de enlace DEBE ser **idempotente**: si ya existe un enlace con la misma tripla (tipo, origen, destino), `aplicarPatchEnlace` lo reusa para aplicar modificador/tiempos en vez de duplicar.

  Rationale: `buscarEnlaceCon` localiza la tripla y `aplicarMetadatosCondicionExcepcion` actualiza metadatos in situ; sin idempotencia, reaplicar una línea duplicaría hechos.

### §15.4 Editable inline vs bloqueado

- **R-OPL-EDIT-7**: el canal **inline** (`edicionCanvas.ts·IntencionEdicionOpl`) DEBE limitarse a un enum cerrado de cuatro intenciones acotadas, y cada una DEBE validar la existencia del id antes de mutar:

  | `IntencionEdicionOpl.tipo` | Mutación | Editable inline |
  | --- | --- | --- |
  | `renombrar-entidad` | `renombrarEntidad` | sí (nombre de objeto/proceso) |
  | `renombrar-estado` | `renombrarEstado` | sí (nombre de estado) |
  | `fijar-etiqueta-enlace` | `renombrarEtiquetaEnlace` | sí (etiqueta de enlace) |
  | `abrir-inspector-enlace` | ninguna (señal al store) | no muta; delega al inspector |

  Toda mutación inline más rica que un renombrado/etiquetado (cambiar tipo de enlace, esencia, designaciones, abanicos) DEBE bloquearse en el canal inline y derivarse al editor libre por patches (§15.1–§15.3) o al inspector. `abrir-inspector-enlace` NO DEBE mutar el modelo; solo señala al store que abra el inspector del enlace.

  Rationale: `aplicarEdicionOpl` retorna `fallo` si el id no existe y `ok(modelo)` sin cambios para `abrir-inspector-enlace`; restringir lo inline a renombrados/etiquetas evita que un edit de texto cambie la topología sin pasar por el flujo deliberado de patches.

### §15.5 Edición de nombres y propiedades de enlace

- **R-OPL-EDIT-8**: la edición de la **propiedad de un enlace** (etiqueta, condición/excepción, modificador, tiempos) DEBE pasar por `renombrarEtiquetaEnlace` (etiqueta) o por `aplicarMetadatosCondicionExcepcion` (modificador y tiempos máximo/mínimo, vía `aplicarModificador` y `definirTiempoExcepcionEnlace`). La edición NO DEBE escribir esos atributos por fuera de las operaciones de modelo validadas.

  Rationale: OPCloud (observacional) permite editar la etiqueta de enlace y abrir su inspector desde el texto; la forja reproduce esa conducta encauzándola por operaciones que validan compatibilidad (`aplicarModificador` exige enlace procedural; `definirTiempoExcepcionEnlace` exige enlace de excepción temporal — SSOT §6-§7 condición, §8.1 excepción).

### §15.6 Edición de oraciones compuestas

- **R-OPL-EDIT-9**: editar una **oración compuesta** (múltiples hechos coordinados, remite §9) DEBE descomponerse en **mutación por hecho**: cada sub-span editado mapea al patch del enlace/hecho que ese sub-span realiza, no a la oración entera. La aplicación DEBE mutar solo los hechos cuyos sub-spans cambiaron.

  Correcto: en una oración que coordina varios enlaces, cambiar el nombre del destino de un sub-span produce un patch sobre ese enlace; los demás hechos de la oración quedan intactos.
  Incorrecto: una edición en cualquier parte de la oración compuesta reescribe o reemplaza todos sus hechos.
  Rationale: la resolución por sub-span de §14.5 (`interaccion.ts·referenciaEnlaceEspecifico`, traza confirmada 2026-06-12) identifica el hecho objetivo; la mutación por hecho preserva la composabilidad de §9 y evita efectos colaterales sobre hechos no tocados. La mecánica exacta de re-tokenización por sub-span en el editor libre se traza a §9 y §14.5, no a una función nueva de edición compuesta.

| Campo | Valor |
| --- | --- |
| ID | `R-OPL-EDIT-1`–`R-OPL-EDIT-9` |
| Conducta | clasificación de 4 estados; razones cerradas; mapeo patch→operación en 3 fases; inline acotado vs bloqueado; propiedades de enlace; compuestas por hecho |
| Reverse | clasificar (sin mutar) → aplicar patches aprobados; ausencia NO borra |
| Edge cases | idempotencia de enlace; dimensión de clasificación escindida conserva default; ausencia no-delete |
| Traza a código | `app/src/opl/clasificadorEdicion.ts·clasificarEdicionOpl` / `etiquetaBotonAplicar` / `RazonNoAplicable` / `razonDesdeDiagnostico`; `app/src/opl/edicionCanvas.ts·aplicarEdicionOpl` / `IntencionEdicionOpl`; `app/src/opl/parser/aplicar.ts·aplicarPatchesOpl` / `aplicarPatchEnlace` / `aplicarMetadatosCondicionExcepcion` / `aplicarPatchAbanico` |
| Procedencia | §9 (compuestas/sub-span); §14.5 (resolución por sub-span); videos OPCloud (edición de etiqueta/inspector de enlace) — precedencia 3 |

## §16 Configuración/opciones que afectan OPL

Las opciones de presentación del OPL afectan **solo el display**. NO DEBEN alterar el **texto canónico** que alimenta el parser y el roundtrip. Esta es la frontera display-vs-canónico de §Convenciones, aplicada al panel OPL.

Rationale: `opciones.ts` documenta explícitamente que las opciones "NO afectan el texto canónico (parser/roundtrip)"; sus consumidores son el panel (display) y los generadores interactivos, nunca el sustrato de bidireccionalidad.

### §16.1 Visibilidad de esencia

- **R-OPL-CFG-1**: la visibilidad de esencia DEBE ofrecer exactamente tres modos (`EsenciaVisibilidad`), con default `siempre`:

  | Modo | Conducta de display |
  | --- | --- |
  | `siempre` (default) | la esencia (físico/informacional) se anota en toda frase donde aplique |
  | `solo-difiere` | la esencia se anota solo cuando difiere del default del tipo |
  | `oculta` | la esencia nunca se anota en el display |

  El valor por defecto DEBE ser `VISIBILIDAD_OPL_DEFAULT = { esencia: "siempre" }`.

  Rationale: `opciones.ts` define `EsenciaVisibilidad` y el default; la visibilidad recorta ruido en el display sin tocar el modelo ni el canónico.

- **R-OPL-CFG-2**: cualquiera de los tres modos NO DEBE alterar el texto canónico. El canónico que alimenta `parser`/`roundtrip` DEBE generarse con la esencia que el hecho posee, con independencia del modo de display elegido.

  Correcto: con `esencia: "oculta"`, el panel muestra `*Cocinar* consume **Ingrediente**.` mientras el canónico conserva la marca de esencia para el roundtrip.
  Incorrecto: ocultar la esencia en el display y omitirla también del canónico, rompiendo el roundtrip.
  Rationale: la equivalencia gráfico-texto (§Convenciones, principio 7) exige que el canónico sea completo; el display es una proyección recortable.

### §16.2 Modo prosa atómica vs compuesta

- **R-OPL-CFG-3**: el modo de prosa (atómica = una frase por hecho; compuesta = frases coordinadas por objeto/proceso, remite §9) DEBE ser una opción de **display**. El modo compuesto NO DEBE introducir un canon paralelo: la presentación compuesta se normaliza a la forma canónica para equivalencia. La opción no alcanza a los enlaces AND del mismo tipo: su OPL canónica es siempre una sola oración con lista (canon spec-OPL R-COMP-CFG-1; ISO §12.1), y la presentación de una oración por enlace es una vista fuera del canon.

  Rationale: §9.5 (R-COMP-CFG-1) ya fija que la presentación se normaliza al canónico; el plegado/coordinación NO introduce canon nuevo. La opción de prosa es presentación, no semántica.

### §16.3 Numeración

- **R-OPL-CFG-4**: la numeración de líneas/oraciones (remite §13) DEBE ser display. Activar o desactivar numeración NO DEBE alterar el texto canónico ni el orden de hechos que consume el parser.

  Rationale: §13 gobierna numeración y agrupación display; el canónico es independiente del adorno de numeración.

| Campo | Valor |
| --- | --- |
| ID | `R-OPL-CFG-1`–`R-OPL-CFG-4` |
| Conducta | visibilidad de esencia (3 modos, default `siempre`); prosa atómica/compuesta; numeración — todo display |
| Invariante | display-vs-canónico: ninguna opción altera el texto que alimenta parser/roundtrip |
| Traza a código | `app/src/opl/opciones.ts·EsenciaVisibilidad` / `VisibilidadOpl` / `VISIBILIDAD_OPL_DEFAULT`; consumidores: panel OPL (display), `generarOpl`/`generarOplInteractivo` (barrel) |
| Procedencia | §Convenciones (display-vs-canónico); §9 / §9.5 (compuestas); §13 (numeración) |

Rationale: el contrato display-vs-canónico es el invariante rector de §16; cualquier opción futura de presentación DEBE heredarlo, recortando el display sin tocar el canónico.

## §17 Modos de fallo, validación y ambigüedad

El parser y el aplicador exponen un contrato de error explícito. La validación distingue lo que se **rechaza** (no se aplica, con razón) de lo que se **suspende** (queda parcialmente aplicado o pendiente de desambiguación). El sustrato es el `Resultado<Modelo>` discriminado (`ok` / `error`) y el conjunto de códigos de diagnóstico que `clasificadorEdicion.ts` traduce a `RazonNoAplicable` (§15.2).

Rationale: `aplicar.ts` retorna `Resultado<Modelo>` y aborta la cadena de patches ante el primer `fallo`; `clasificadorEdicion.ts·razonDesdeDiagnostico` mapea los códigos del parser a razones visibles. El contrato es cerrado: no hay error sin código ni código sin razón.

### §17.1 Contrato de error del parser

- **R-OPL-FALLO-1**: el parser DEBE reportar fallos como diagnósticos tipados con `codigo`, `severidad` (`error`/`warning`/`info`) y `linea`. Solo `severidad=error` bloquea la aplicación de esa línea; `warning`/`info` NO DEBEN bloquear.

  Rationale: `clasificarEdicionOpl` solo marca `no-aplicable` ante un diagnóstico `severidad=error`; warnings/info caen a `sin-cambio`.

- **R-OPL-FALLO-2**: la aplicación de patches (`aplicarPatchesOpl`) DEBE ser **fail-fast por cadena**: ante el primer `fallo` de una operación de modelo, la cadena se aborta y se retorna `Resultado.error`, sin aplicar patches posteriores.

  Rationale: cada fase de `aplicarPatchesOpl` retorna inmediatamente si una operación falla; esto evita estados intermedios inconsistentes (p. ej. enlace creado contra entidad que luego falla).

### §17.2 Oraciones no parseables y ambiguas

- **R-OPL-FALLO-3**: una oración cuya forma no reconoce el parser DEBE producir `forma-no-reconocida` (`syntax-error` genérico). Una oración válida pero sin punto final DEBE producir `puntuacion-faltante`.

  Rationale: `razonDesdeDiagnostico` separa el `syntax-error` con marca de punto (`/punto/i`) de la forma no reconocida; la SSOT OPL-ES exige punto terminal.

- **R-OPL-FALLO-4**: una referencia que matchea **más de una** entidad DEBE producir `referencia-ambigua` (`ambiguous-symbol`); el operador DEBE desambiguar por código de entidad. La línea ambigua se **rechaza** (no-aplicable), NO se aplica a una entidad arbitraria.

  Rationale: V-201 (unicidad de nombres) obliga a 1:1 nombre↔cosa para aplicar; aplicar a un match arbitrario violaría la unicidad. La desambiguación por código es la salida canónica.

### §17.3 Colisión de nombre desde OPL

- **R-OPL-FALLO-5**: una entidad referida que no existe DEBE producir `entidad-no-existe` (`unknown-symbol`); una firma de enlace inválida para los participantes DEBE producir `enlace-invalido-firma` (`type-mismatch`). Ambas se rechazan.

  Rationale: `crearEnlace` valida la firma (V-180+); el parser no puede inventar entidades ni aceptar enlaces con firma inválida sin romper el modelo.

- **R-OPL-FALLO-6**: dos patches incompatibles sobre el **mismo hecho** DEBEN producir `conflicto-patches` (`patch-conflict`) y rechazarse, en vez de aplicarse en orden arbitrario.

  Rationale: `razonDesdeDiagnostico` mapea `patch-conflict` a `conflicto-patches`; aplicar ambos dejaría el hecho en estado dependiente del orden, no determinista.

### §17.4 Partial-parse: rechazo vs suspensión

- **R-OPL-FALLO-7**: el editor DEBE soportar **partial-parse**: un documento con líneas mezcladas (aplicables, no-aplicables, sin-cambio) NO DEBE bloquearse en bloque. Las líneas `aplicable` se ofrecen para aplicar; las `no-aplicable` se **rechazan** individualmente con su razón; las `sin-cambio`/`ignorada-vacia` se **suspenden** sin error.

  | Clase de línea | Tratamiento |
  | --- | --- |
  | `aplicable` | se aplica (sujeto a fail-fast de §17.1 al materializar) |
  | `no-aplicable` | se rechaza con `RazonNoAplicable`; no muta |
  | `sin-cambio` | se suspende: parseada, sin mutación |
  | `ignorada-vacia` | se suspende: descartada silenciosamente |

  Rationale: `clasificarEdicionOpl` clasifica línea a línea de forma independiente; el partial-parse es la consecuencia directa de esa granularidad. La aplicación de las `aplicable` sigue siendo fail-fast (§17.1) en el momento de materializar la cadena de patches.

- **R-OPL-FALLO-8**: una edición inversa no soportada por el kernel DEBE producir `inversa-no-soportada` (`unsupported-kernel`), y la ausencia de una línea DEBE producir `no-delete-by-absence` (info, no borra). Ambas se rechazan/suspenden, NUNCA borran hechos por omisión.

  Rationale: §15.2 y `razonDesdeDiagnostico` tratan ausencia y kernel no soportado sin destruir hechos; la edición reverse es aditiva/mutadora explícita, nunca diferencial-destructiva.

| Campo | Valor |
| --- | --- |
| ID | `R-OPL-FALLO-1`–`R-OPL-FALLO-8` |
| Conducta | diagnósticos tipados; fail-fast por cadena; no-parseable/ambiguo/colisión rechazados; partial-parse por línea; inversa no soportada/ausencia no borran |
| Rechaza | forma-no-reconocida, puntuacion-faltante, referencia-ambigua, entidad-no-existe, enlace-invalido-firma, conflicto-patches, inversa-no-soportada |
| Suspende | sin-cambio, ignorada-vacia (sin error) |
| Traza a código | `app/src/opl/parser/aplicar.ts·aplicarPatchesOpl` (`Resultado<Modelo>` fail-fast); `app/src/opl/clasificadorEdicion.ts·razonDesdeDiagnostico` / `RazonNoAplicable`; `parser` (`DiagnosticoOpl` con `codigo`/`severidad`/`linea`) |
| Procedencia | §15 (clasificación/razones); V-180+ (firma de enlace); V-201 (unicidad); OPL-ES sintaxis (punto terminal) |

Rationale: el contrato de fallo es cerrado y determinista — todo error tiene código, todo código tiene razón visible, y la cadena de aplicación es fail-fast — lo que permite un editor honesto que rechaza lo inaplicable, suspende lo inerte y aplica lo válido sin estados intermedios inconsistentes.

## §18 EBNF formal OPL-ES

```ebnf
(* Producciones de extensión de producto (v1.4.1). Se añaden a la EBNF del canon spec-OPL §18;
   los no terminales no definidos aquí son los del canon (o su nombre v1.4.1). [extensión] *)
oracion_formal_opl_es_producto = oracion_formal_opl_es
 | oracion_compuesta ;  (* ext §9 *)

prefijo = "unsigned " | "signed " ;
(* [extensión] «signed»: el Anexo A sólo define «unsigned» *)
(* [extensión] intervalos de rango con delimitadores: sin producción en el Anexo A *)
limite_de_rango = nombre_de_valor | "*" ;
delimitador_inferior_de_rango = "[" | "(" ;
delimitador_superior_de_rango = "]" | ")" ;
intervalo_de_rango = delimitador_inferior_de_rango, limite_de_rango, "..", limite_de_rango, delimitador_superior_de_rango ;
expresion_de_rango = intervalo_de_rango, { ", ", intervalo_de_rango } ;

oracion_de_descripcion_de_cosa_producto = oracion_de_clasificacion_combinada | oracion_de_estado_current ;
(* ext §2.0 — clasificación combinada eco-OPCloud (R-ENT-3): esencia y afiliación en UNA oración
   con sustantivo de tipo; los adjetivos concuerdan con el sustantivo, no con la cosa. *)
oracion_de_clasificacion_combinada = identificador_de_cosa, " es un ", ( "objeto" | "proceso" ), " ",
 ( esencia_combinada | afiliacion_combinada | ( esencia_combinada, " y ", afiliacion_combinada ) ) ;  (* ext §2.0 *)
esencia_combinada = "físico" | "informacional" ;  (* ext §2.0 *)
afiliacion_combinada = "sistémico" | "ambiental" ;  (* ext §2.0 *)
oracion_de_estado_current = "Estado ", identificador_de_estado, " de ", identificador_de_objeto, " es declarado `Current`" ;
(* D13: perfil reglas-opforja §4.4 [extensión] *)

(* ext §6.2 — RF2o rasgo opcional: extensión declarada de producto; el reverse acepta además
   la variante plural « tiene … opcionales » que el generador no emite. *)
oracion_de_rasgo_opcional = identificador_de_cosa, " tiene ", ( "un " | "una " ),
 identificador_de_objeto, " opcional" ;  (* ext §6.2 *)

oracion_de_gestion_de_contexto_producto = oracion_de_composicion_intermodelo | oracion_de_referencia_externa ;
oracion_de_composicion_intermodelo = opd_hijo, " es una vista de sub-modelo de ", nombre_de_modelo
 | opd_hijo, " referencia el sub-modelo ", nombre_de_modelo, " desde ", opd_padre ;
oracion_de_referencia_externa = identificador_de_objeto, " en ", opd_hijo, " es referencia externa a ",
 identificador_de_objeto, " del modelo propietario ", nombre_de_modelo ;
nombre_de_modelo = nombre ;
(* CM1–CM3: perfil reglas-opforja [extensión] *)

(* ===== ext §9 — Oración compuesta / coordinada ===== *)
(* Extensión de esta spec: NO figura en Apéndice A de opm-opl-es. Coordina N hechos
   atómicos en UNA línea con sub-spans; cada hecho conserva ref+hint propios. *)
oracion_compuesta = oracion_compuesta_predicado_coordinado
 | oracion_compuesta_destino_enumerado
 | oracion_compuesta_sujeto_coordinado ;
conector_serial = ", " | " y " | " e " | " o " | " u " ;
oracion_compuesta_predicado_coordinado = identificador_de_proceso, " ",
 predicado_procedimental, { ", ", predicado_procedimental }, conector_final, predicado_procedimental ;
predicado_procedimental = ( "consume ", objeto_con_opcion_de_estado )
 | ( "genera ", objeto_con_opcion_de_estado )
 | ( "afecta ", lista_de_objetos )
 | ( "requiere ", objeto_con_opcion_de_estado )
 | ( "cambia ", frase_de_cambio_entrada_salida )
 | ( "consume ", operador_de_fan, " ", lista_de_objetos ) ;
oracion_compuesta_destino_enumerado = ( identificador_de_objeto, " exhibe ", lista_de_objetos )
 | ( identificador_de_objeto, " consta de ", lista_de_partes_objeto ) ;
oracion_compuesta_sujeto_coordinado = lista_de_objetos, " ", verbo_concordado_plural,
 " ", objeto_con_opcion_de_estado ;
verbo_concordado_plural = "consumen" | "generan" | "afectan" | "requieren" | "manejan" ;
conector_final = " y " | " e " | " o " | " u " ;
(* auxiliares v1.4.1 de la oración compuesta *)
operador_de_fan = "exactamente uno de" | "al menos uno de" ;
lista_de_partes_objeto = parte_objeto, [ { ", ", parte_objeto } ], " y ", ( parte_objeto | "al menos otra parte" ) ;

(* ===== ext §6.5 — Sufijo de etiqueta de enlace ===== *)
(* Extensión declarada de producto: el generador adjunta la etiqueta de usuario de un enlace
   (procedimental o estructural fundamental) como sufijo tras el punto terminal de la oración
   base; el parser extrae el sufijo antes de cotejar la oración. Traza: procedural.ts·conEtiquetaEnlace
   (~273) / parsear.ts·ETIQUETA_SUFIX (línea 5) / aplicar.ts (patch fijar-etiqueta-enlace). *)
sufijo_de_etiqueta_de_enlace = " [etiqueta: ", expresion_de_etiqueta, "]" ;  (* ext §6.5 *)
oracion_con_etiqueta_de_enlace = oracion_opl_es, sufijo_de_etiqueta_de_enlace ;  (* ext §6.5 *)
```

Restricciones (RFC 2119):

- **R-§18-NORM-1**: el parser NORMALIZA la entrada a la forma ASCII canónica antes de cotejar producciones; los caracteres del alfabeto extendido (acentos, `ñ`, `ü`) SE PRESERVAN en los nombres pero las operaciones lógicas y delimitadores SE NORMALIZAN a ASCII.

- **R-§18-EXT-1** (ext `§9`): la `oracion_compuesta` es extensión de esta spec, no del Apéndice A. Coordina N hechos atómicos en UNA línea; cada hecho coordinado CONSERVA su `ref` y su sub-span (`hint`). NO SE ADMITE la fusión opaca que descarte tokens/refs por hecho. La coordinación de sujeto SOLO SE EMITE cuando el canon define el plural concordado.

GAPs de derivación sin soporte (producciones derivables de esta EBNF sin generador ni parser hoy):

- GAP-DONDE-EXPRESION (§18·A.7): la `restriccion_de_expresion` (`donde …`) es derivable pero sin generador ni parser (`donde` solo aparece en comentarios de `parsear.ts`); derivación-sin-soporte.

- GAP-RANGO-TEXTUAL (§18·A.2): los intervalos de rango (`intervalo_de_rango`/`expresion_de_rango`, `[..]`/`(..)`) y la `clausula_de_rango` son derivables pero sin generador ni parser; GAP-VARIA cubre solo el verbo `varía de … a`.

Trazabilidad de parser: `app/src/opl/parser/parsear.ts` reconoce el **subconjunto soportado** de producciones (el detalle vive en la tabla §20); las producciones derivables sin soporte llevan GAP nombrado (GAP-DONDE-EXPRESION, GAP-RANGO-TEXTUAL, GAP-DESPLIEGUE-DEDICADO, GAP-RECOMPONE, GAP-PLIEGA). Tipos de la superficie reconocida en `app/src/opl/parser/tipos.ts`.

Rationale: `opm-opl-es A.0–A.10` (gramática formal OPL-ES) + `reglas §4.14` (EBNF normativa). La extensión `oracion_compuesta` traza a §9 de esta spec.

## §19 Roundtrip, bisimetría e invariantes de equivalencia

OPFORJA mantiene una correspondencia bidireccional entre el OPD (modelo) y el panel OPL (texto). Esta sección fija qué significa esa correspondencia, dónde es total y dónde es parcial.

### §19.1 Simetría global OPD↔OPL

- **R-§19-SIM-1**: el generador OPL (`generadores/`, fachada `generar.ts`) DEBE producir, para todo modelo válido, una prosa OPL que el parser reverse (`parser/`) reconozca sin emitir diagnósticos de severidad `error`. La dirección forward (modelo→texto) es total sobre el kernel cubierto.

- **R-§19-SIM-2**: la dirección reverse (texto→modelo) es total SOLO sobre el subconjunto de producciones que el aplicador soporta (`parser/aplicar.ts`). Las producciones reconocibles pero no aplicables DEBEN diagnosticarse con `unsupported-kernel` (severidad `warning`) y NO DEBEN mutar el modelo.

- **R-§19-SIM-3**: un fixture marcado `bisimetricaEstricta` EXIGE igualdad línea-por-línea entre `generar(modelo)` y `generar(aplicar(parsear(generar(modelo))))` partiendo de un modelo vacío. La cobertura bisimétrica se amplía agregando fixtures, no tocando el framework.

### §19.2 Parseado vs solo-display

- **R-§19-DISP-1**: las líneas OPL clasificadas como **solo-display** (plegado/despliegue de §12, presentación de §13) SE GENERAN para lectura pero NO SE REVIERTEN como mutaciones de kernel. Editarlas en el panel NO DEBE producir patches; el parser DEBE tratarlas como ruido informativo, no como hechos.

- **R-§19-DISP-2**: las líneas **parseables** (hechos atómicos de §3–§8 y composición de §9) SON las únicas portadoras de mutación reverse. La frontera display/parseable DEBE ser explícita en el clasificador del parser.

### §19.3 Ley `safe-lens`

La ley `law-opl-safe-lens` (`leyes/opl-reverse.test.ts`) gobierna el lente reverse:

- **R-§19-LENS-1**: la **ausencia** de una línea en el texto editado NO DEBE borrar el hecho correspondiente del modelo. El planificador DEBE emitir el diagnóstico `no-delete-by-absence` (severidad `info`) y NO generar patches destructivos por omisión. El borrado es una acción explícita, nunca inferida por sustracción de prosa.

- **R-§19-LENS-2**: `planificarEdicionOplLibre` (preview) NO DEBE mutar el modelo aunque proponga patches; el modelo solo cambia al aplicar (`aplicarPatchesOpl`). El preview es puro.

- **R-§19-LENS-3**: al aplicar un conjunto de patches no destructivos, los hechos omitidos en el texto (enlaces, entidades, estados) DEBEN preservarse idénticos. `exportarModelo(aplicar(modelo, patchesVacíos)) == exportarModelo(modelo)`.

### §19.4 Invariante de descomposición de prosa compuesta

- **R-§19-COMP-1** (remite a §9.4): componer N hechos atómicos en una `oracion_compuesta` y luego parsearla DEBE rendir exactamente el mismo conjunto de hechos —ni más, ni menos—. La composición es una transformación de **superficie**, identidad sobre el conjunto de hechos subyacente.

- **R-§19-COMP-2**: cada hecho coordinado DEBE conservar su `ref` y su sub-span (`hint`); la coordinación NO DEBE fusionar opacamente tokens que impidan re-derivar cada hecho individual. La descomposición de la prosa compuesta es inversa exacta de su composición.

### §19.5 Dónde se rompe la bisimetría

| Caso | Estado | Convención |
|------|--------|------------|
| Producción reconocida sin aplicador | parcial | `unsupported-kernel` (warning), sin mutación; bisimetría no exigida hasta cubrir el aplicador |
| Línea solo-display editada | no aplica | tratada como ruido; sin patch |
| Reordenamiento de líneas equivalentes | tolerado | el conjunto de hechos es invariante al orden; el generador reimpone orden canónico (§16) |
| Variante léxica de superficie (display) normalizable | tolerado | el parser normaliza a ASCII canónico (§18) antes de cotejar |

- **R-§19-ROT-1**: cuando la bisimetría sea parcial, la spec DEBE declararlo explícitamente y el fixture correspondiente DEBE marcarse no-estricto (`bisimetricaEstricta=false`), validando solo la dirección forward hasta cerrar la brecha.

Rationale: `leyes/opl-reverse.test.ts` (ley `law-opl-safe-lens`: no-borrado-por-ausencia, preview puro, preservación de hechos, unsupported-kernel sin mutación) + `roundtrip.test.ts` (framework bisimétrico build→generar→parsear+aplicar→generar) + `fixtures-roundtrip.ts` (catálogo de fixtures estrictos/no-estrictos). Remite a §9.4 (composición), §12–§13 (display), §16 (orden canónico), §18 (normalización léxica).

## §20 Trazabilidad y gaps

Esta sección CONSOLIDA, en una tabla maestra única, las trazas a código y los marcadores `GAP-*` que cada sección §1–§18 escribió por entrada. Es el insumo directo de la auditoría de alineación posterior (no de esta spec).

**R-§20-AUD-1 (RFC 2119)**: la tabla §20 ES el punto de partida de la auditoría de alineación spec↔código. Toda fila con estado `GAP-*` DEBE resolverse en esa auditoría —cerrando el código, corrigiendo la emisión no canónica, añadiendo el fixture, o reclasificando el hecho—. Ninguna fila `GAP-*` se resuelve dentro de esta spec.

**Nota de vigencia (2026-06-12)**: el último pase forward completo de esta tabla es **anterior al 2026-06-11** (frente reverse de opforja). La auditoría de coherencia del corpus 2026-06-12 consolidó abajo los cierres puntuales verificados (descomposición reverse, fixtures de agregación/generalización, ruta, fan de habilitadores, placeholder de procesos), pero el re-forward completo de §20 (spec→código y código→spec, incluida la cabecera obsoleta de `fixtures-roundtrip.ts`) queda en backlog (`deep-opm-pro/docs/HANDOFF.md`).

Leyenda de **Estado**:

- `alineado` — la oración canónica tiene generador y, cuando aplica, parser/fixture confirmados.

- `GAP-código` — oración canónica sin generador y/o sin parser que la realice.

- `GAP-spec` — símbolo de `app/src/opl/**` sin entrada trazada en la spec.

- `GAP-VERIFY` — traza declarada pero no confirmada en este pase (regex, handler UI o función a verificar).

### §20.1 Tabla maestra

| Sección | Constructo / Regla | Generador (archivo·símbolo) | Parser (archivo·símbolo) | Fixture / Ley | Estado |
|---------|--------------------|-----------------------------|--------------------------|---------------|--------|
| §1.1 | Enum verbal `varía de … a` (rango) | — | — | — | GAP-VARIA |
| §1.1 | Enum verbal `es de tipo` | — | — | — | GAP-TIPO |
| §1.1 | Enum verbal `puede ser` (especialización XOR) | — | — | — | GAP-XOR-FEATURE |
| §1.1 | Enum verbal `se refina` (refinamiento inter-OPD) | — | — | — | GAP-REFINA |
| §1.1 | Enum verbal `se pliega` (plegado) | — | — | — | GAP-PLIEGA |
| §1.1 | Enum verbal `se recompone` (recomposición) | — | — | — | GAP-RECOMPONE |
| §2.1 | Entidad (objeto/proceso) | `estructural.ts·oracionEntidad` | — | — | alineado |
| §2.1 | Supresión de placeholder (R-ENT-2) | `refsHints.ts·entidadOplEsEmitible` + `nombresCanonicos.ts·esNombreProcesoPlaceholder` (conectado en `generar.ts`) | — | `refsHints.test.ts` / `generar.test.ts` | alineado (procesos) · GAP-PLACEHOLDER-OBJETO |
| §2.3 | Estados `puede estar` | `duracionMetadata.ts·oracionEstados` | — | — | alineado |
| §2.4 | Designación de estado | `designaciones.ts·oracionDesignacionEstado` / `textoDesignacionEstado` | — | — | alineado |
| §2.5 | Valor de atributo `es valor` | `estructural.ts·oracionValorAtributo` | — | — | alineado |
| §2.6 | Formato nominal `Instancia : Clase` | — (sin generador dedicado) | — | — | GAP-NOMBRE-INSTANCIA |
| §2.7 | Esencia (física/informacional) | `estructural.ts·oracionEntidad` (vía `refsHints.ts·textoEsencia`) | — | — | alineado |
| §2.8 | Afiliación (sistémica/ambiental) | `estructural.ts·oracionEntidad` (vía `refsHints.ts·textoAfiliacion`) | — | — | alineado |
| §3.1 | Consumo `consume` | `procedural.ts·oracionEnlaceSinEtiqueta` | `parsear.ts·ABANICO_VERBO_RE_LIST` (`consume`) | `enlace-…` | alineado |
| §3.2 | Resultado `genera` | `procedural.ts·oracionEnlaceSinEtiqueta` | `parsear.ts·ABANICO_VERBO_RE_LIST` (`genera`) | — | alineado |
| §3.3 | Efecto `afecta` | `procedural.ts·oracionEfecto` | `parsear.ts·ABANICO_VERBO_RE_LIST` (`afecta`) | `enlace-efecto-simple` | alineado |
| §3.4 | Cambio de estado TS3 (`de … a …`) | `procedural.ts·oracionTransicionEstados` | `parsear.ts·ABANICO_CAMBIA_RE` / regex CS2 | `cambio-estado-ts3` / `cambio-estado-ts3-compacto` (estrictas) | alineado |
| §3.5 | Efecto parcial TS4 (`de \`estado\``) | `procedural.ts·oracionEfecto` (rama origen) | regex standalone verificada | `cambio-estado-ts4-solo-entrada` (estricta) | alineado · GAP-PROCEDENCIA-ESCIND |
| §3.6 | Efecto parcial TS5 (`a \`estado\``) | `procedural.ts·oracionEfecto` (rama destino) | regex standalone verificada | `cambio-estado-ts5-solo-salida` (estricta) | alineado |
| §4.1 | Agente `maneja` (+ estado/evento/cond/negada) | `procedural.ts·oracionEnlaceSinEtiqueta` / `refsHints.ts·nombreOplExtremo` | `parsear.ts·ABANICO_VERBO_RE_LIST` (`maneja`) / `CONDICION_AGENTE_RE` | `enlace-agente-simple` | alineado · GAP-NEGADA-REVERSE (negada emisión-only) |
| §4.2 | Instrumento `requiere` (+ estado/evento/cond/negada) | `procedural.ts·oracionEnlaceSinEtiqueta` / `refsHints.ts·nombreOplExtremo` | `parsear.ts·ABANICO_VERBO_RE_LIST` (`requiere`) | `enlace-instrumento-simple` | alineado · GAP-NEGADA-REVERSE (negada emisión-only) |
| §4.x | Habilitador con estado especificado (HS1/HS2) | `refsHints.ts·nombreOplExtremo` (sufijo `en \`estado\``) | `ABANICO_VERBO_RE_LIST` | `habilitador-con-estado-hs` (estricta) | alineado |
| §4.x | Abanico de instrumento/agente inverso | `abanico.ts` | `parsear.ts·ABANICO_VERBO_RE_LIST` (`requiere` ~308, `es requerido por` ~314, `es manejado por` ~316) + loop genérico `parsearAbanicoDirecto` (~357–369) | — | alineado · GAP-FIXTURE-ABANICO-HABILITADOR |
| §5.1 | Evento `inicia` | `procedural.ts·oracionEvento` | `parsear.ts` (ruta evento) | `evento-consumo-canonico` | alineado |
| §5.1 | Evento sobre **resultado** (no canónico) | `procedural.ts·oracionEvento` degrada a base | — | `procedural.test.ts` | cerrado |
| §5.1 | Evento sobre **invocación** (no canónico) | `procedural.ts·oracionEvento` degrada a base | — | `procedural.test.ts` | cerrado |
| §5.2 | Condición `ocurre si … en cuyo caso … de lo contrario` | `procedural.ts·oracionCondicion` | `parsear.ts·CONDICION_OCURRE_RE` / `CONDICION_AGENTE_RE` | `parser.condicionesExcepciones.test.ts` | alineado |
| §5.2 | Condición sobre **resultado** (no canónico) | `procedural.ts·oracionCondicion` degrada a base | — | `procedural.test.ts` | cerrado |
| §5.2 | Condición sobre **invocación** (no canónico) | `procedural.ts·oracionCondicion` degrada a base | — | `procedural.test.ts` | cerrado |
| §5.3 | Excepción sobre/sub/sub-sobretiempo | `procedural.ts·oracionEnlaceSinModificador` / `formatoTiempo*` / `duracionMetadata.ts` | `parser.condicionesExcepciones.test.ts` | (test) | alineado |
| §5.4 | Invocación / autoinvocación | `procedural.ts·oracionEnlaceSinModificador` / `modelo/autoinvocacion.ts·esAutoInvocacion` | `parsear.ts` (`despu[eé]s`, rehidrata demora) | `invocacion-con-demora-tilde` / `autoinvocacion-con-demora-tilde` (estrictas) / `evento-invocacion-degrada-base` | alineado |
| §6.1 | Agregación `consta de` | `estructural.ts·oracionEnlaceEstructural` (agregación) | `parsear.ts·astEstructural` (`consta de`) | `enlace-estructural-agregacion` (estricta) | alineado |
| §6.2 | Exhibición `exhibe` / `así como` | `estructural.ts·oracionEnlaceEstructural` (exhibición) | `parsear.ts·astEstructural` (`exhibe`) | `enlace-estructural-exhibicion` | alineado |
| §6.3 | Generalización `son` / `es un` | `estructural.ts·oracionEnlaceEstructural` (generalización) | `parsear.ts·astEstructural` (`es un` / `son`) | `enlace-estructural-generalizacion` (estricta) | alineado |
| §6.3 | Generalización XOR `puede ser` | — (feature pendiente; `emitirEspecializacion` emite `es un`) | — (sin regex estructural) | — | GAP-XOR-FEATURE · GAP-XOR-PARSER |
| §6.4 | Clasificación `es una instancia de` / `son instancias de` | `estructural.ts·oracionEnlaceEstructural` (clasificación) | `parsear.ts·astEstructural` (`es una instancia de` / `son instancias de`) | `enlace-estructural-clasificacion` | GAP-NOMBRE-INSTANCIA |
| §6.5 | Etiquetado `tag` / `se relaciona con` / `se relacionan` (SE1–SE5) | `procedural.ts·oracionEstructuralEtiquetada` | — (sin regex en `astEstructural`) | (sin fixture) | GAP-TAG-PARSER · GAP-FIXTURE-TAGGED |
| §6.5 | Sufijo de etiqueta `[etiqueta: …]` (extensión declarada, R-EST-TAG-3) | `procedural.ts·conEtiquetaEnlace` | `parsear.ts·ETIQUETA_SUFIX` / `aplicar.ts` (`fijar-etiqueta-enlace`) | `generar.test.ts` | alineado |
| §6.6 | Etiquetado con estado especificado (SSE1–SSE7) | `procedural.ts·oracionEstructuralEtiquetada` (sufijo de estado) | — | (sin fixture) | GAP-SSE-PARSER · GAP-FIXTURE-SSE |
| §7.1 | Descomposición `se descompone en` / `paralelo` (CX1/CX2) | `refinamiento.ts·oracionDescomposicion` / `oracionParalelo` / `describirProcesosTemporales` | `parsear.ts·parsearContexto` / `planificar.ts·planificarContexto` (`crear-refinamiento`) + `planificarOrdenInzoom` (`set-orden-inzoom`) | `orden-inzoom.test.ts` / `invocacion-implicita-bimodal.test.ts` / `opl-reverse.test.ts` / `parser.test.ts` | orden cerrado (GAP-CX-PARSER orden + GAP-FIXTURE-DESCOMPOSICION orden); residual: materialización de miembros |
| §7.1 | Recomposición `se recompone desde` (CX7/CX8) | — | — | — | GAP-RECOMPONE |
| §7.2 | Despliegue por relación fundamental (CX3) | `refinamiento.ts·oracionDespliegue` / `modoDespliegue` / `modoPorTipoEnlace` | regex estructurales de §6 | `parser.designacionesPlegado.test.ts` | alineado |
| §7.2 | Plegado parcial | `plegado.ts·oracionPlegadoParcial` / `bloquesJerarquicos.ts·agruparOracionesPorOpd` | `parser.designacionesPlegado.test.ts` | (test) | alineado |
| §7.2 | Plegado total `se pliega en el OPD padre` (CX5/CX6) | — | `parsear.ts·parsearContexto` (reconoce con warning `unsupported-kernel`; el reverse no aplica plegado) | — | GAP-PLIEGA |
| §7.3 | Refinamiento autónomo `se refina por …` (CX4) | — (jerarquía vía `bloquesJerarquicos.ts·ordenarOpdsParaOpl` / `profundidadOpd`) | — | — | GAP-REFINA |
| §7.4 | Visibilidad de estados por OPD | `duracionMetadata.ts·oracionEstados` / `bloquesJerarquicos.ts·agruparOracionesPorOpd` | — | — | alineado |
| §7.5 | Marca temporal solo en descomposición de proceso | `refinamiento.ts·oracionesRefinamiento` / `describirProcesosTemporales` | — | — | alineado |
| §8 | Distribución/migración de enlaces por OPD | `bloquesJerarquicos.ts·agruparOracionesPorOpd` (operación de modelo, `reglas §8.11`) | — | — | alineado |
| §8.3 | Resolución de colisión de rol / precedencia recomposición | kernel `modelo/**` (fuera de capa OPL) | — | — | alineado |
| §7.7 / §9 | Guard anti-coordinación de enlaces en refinamiento | no-aplicable hasta GAP-COMPOSICION; protección por construcción | — | — | cerrado-no-aplica |
| §7.6 | Fan bajo evento `inicia` + cuantificador (C-19) | `abanico.ts` parcial: efecto con objeto común y procesos alternativos | `parsear.ts·parsearAbanicoEvento` parcial | `generar.test` / `parser.test` | parcial; GAP-FAN-EVENTO restante |
| §7.6 | Fan resultado+condición (C-20, `puede generarse`) | `abanico.ts·oracionAbanicoCondicional` degrada a fan base | — | `abanico.test.ts` | cerrado |
| §7.6 | Fan probabilístico `Pr=p` por rama (C-22) | `abanico.ts` / `procedural.ts·sufijoProbabilidad` (`Pr=p`) | `parsear.ts` descarta `Pr=p` como anotación | `abanico.test.ts` / `procedural.test.ts` | alineado |
| §7.6 | Fan `m de f` (R-FAN-8) | — (`abanico.ts` solo `m=1`) | — | — | GAP-FAN-M |
| §9 | Composición eje (a) — predicados coordinados | — (capa de composición ausente) | — (descomposición serial ausente) | — | GAP-COMPOSICION · GAP-COMP-REVERSE |
| §11 | Etiqueta de ruta (path label) | `procedural.ts·oracionEnlaceConRuta` / `oracionProcedimentalParaRuta` | `parsear.ts·RUTA_PREFIJO_RE` / `aplicar.ts` → `modelo/rutas·definirRutaEtiqueta` | `parser.test.ts` (rutaEtiqueta reverse) / `generar.test.ts` (forward) | alineado · GAP-FIXTURE-RUTA |
| §12–§13 | Display por OPD / orden / bloques | `bloquesJerarquicos.ts·agruparOracionesPorOpd` / `ordenarOpdsParaOpl` / `plegado.ts·oracionPlegadoParcial` | — | — | alineado |
| §14.x | Panel OPL interactivo / tokens / referencias | `panel.ts·derivarPanelOpl` / `interaccion.ts·OplToken` / `crearLineaOplInteractiva` / `referenciaEnlaceEspecifico` | — | — | alineado |
| §14.5 | Navegación click→foco (handler UI) | `interaccion.ts` (`OplToken.ref`) + handler en `app/src/ui` | — | — | alineado-fuera-opl |
| §15 | Edición OPL clasificada / aplicación | `clasificadorEdicion.ts·clasificarEdicionOpl` / `edicionCanvas.ts·aplicarEdicionOpl` | `aplicar.ts·aplicarPatchesOpl` / `aplicarPatchEnlace` / `aplicarPatchAbanico` | — | alineado |
| §15.x | Mutación por hecho (re-tokenización sub-span) | — (se traza a §9 y §14.5, no a función nueva) | `interaccion.ts·referenciaEnlaceEspecifico` (confirmada; cableada en `ui/panelOpl/Bloques.tsx`) | — | alineado |
| §16 | Visibilidad de esencia / orden canónico | `opciones.ts·VisibilidadOpl` / `VISIBILIDAD_OPL_DEFAULT` | — | — | alineado |
| §18 | Diagnóstico / fail-fast | — | `aplicar.ts·aplicarPatchesOpl` (`Resultado<Modelo>`) / `clasificadorEdicion.ts·razonDesdeDiagnostico` / parser `DiagnosticoOpl` | — | alineado |

### §20.2 Índice de GAPs

Lista consolidada de todos los marcadores `GAP-*` (sección de origen · descripción de una línea). La auditoría de alineación los cierra; aquí solo se enumeran.

| GAP | Origen | Descripción |
|-----|--------|-------------|
| GAP-VARIA | §1.1 | `varía de … a` canónico, sin generador. |
| GAP-TIPO | §1.1 | `es de tipo` canónico, sin generador. |
| GAP-XOR-FEATURE | §1.1 / §6.3 | `puede ser` (especialización XOR) canónico, reclasificado como feature pendiente; `es un` ya cubre la generalización individual. |
| GAP-XOR-PARSER | §6.3 | `puede ser` sin regex estructural en `astEstructural`. |
| GAP-REFINA | §1.1 / §7.3 | `se refina por …` (CX4) canónico, sin generador autónomo ni parser. |
| GAP-PLIEGA | §1.1 / §7.2 | `se pliega en` (plegado total CX5/CX6) canónico, sin generador; el parser lo reconoce (`parsear.ts·parsearContexto`, familia `plegado`, warning `unsupported-kernel`) pero el reverse no aplica plegado por diseño de corte (`planificar.ts·planificarContexto` solo aplica descomposición/despliegue). Existe plegado parcial. |
| GAP-RECOMPONE | §1.1 / §7.1 | `se recompone desde` (CX7/CX8) canónico, sin generador ni parser. |
| GAP-PLACEHOLDER-OBJETO | §2.1 | Rama objeto de R-ENT-2 sin implementar: `entidadOplEsEmitible` retorna `true` para objetos placeholder (`checkers.ts` sí los reconoce: `Objeto`/`Objeto_N`); la supresión de procesos placeholder está cerrada (`esNombreProcesoPlaceholder` conectado en `generar.ts`). |
| GAP-NOMBRE-INSTANCIA | §2.6 / §6.4 | Formato nominal `Instancia : Clase` sin generador dedicado. |
| GAP-FIXTURE-EFECTO | §3.3 | Cerrado: `enlace-efecto-simple`. |
| GAP-FIXTURE-TS3 | §3.4 | Cerrado: `cambio-estado-ts3` y `cambio-estado-ts3-compacto` son fixtures estrictas. |
| GAP-PARSE-TS4 | §3.5 | Cerrado: regex de `cambia … de \`estado\`` sin `a` verificada por fixture estricta. |
| GAP-FIXTURE-TS4 | §3.5 | Cerrado: `cambio-estado-ts4-solo-entrada` es fixture estricta. |
| GAP-PROCEDENCIA-ESCIND | §3.5 | Metadato de procedencia escindido no rastreado en este pase. |
| GAP-PARSE-TS5 | §3.6 | Cerrado: regex de `cambia … a \`estado\`` sin `de` verificada por fixture estricta. |
| GAP-FIXTURE-TS5 | §3.6 | Cerrado: `cambio-estado-ts5-solo-salida` es fixture estricta. |
| GAP-FIXTURE-HS | §4.x | Cerrado: `habilitador-con-estado-hs` es fixture estricta. |
| GAP-NEGADA-REVERSE | §3.4 / §4.1 / §4.2 | La variante negada (extensión declarada, ver §3.4) es emisión-only: `procedural.ts` la emite pero no existe ruta de parseo; sin bisimetría. |
| GAP-FIXTURE-ABANICO-HABILITADOR | §4.x | Cobertura de parseo del fan de instrumento/agente e inversos verificada (2026-06-12, `ABANICO_VERBO_RE_LIST` + `parsearAbanicoDirecto`), pero sin fixture ni test de parser dedicado que la defienda contra regresión. |
| GAP-FIXTURE-EVENTO | §5.1 | Cerrado: `evento-consumo-canonico`. |
| GAP-EVENTO-RESULTADO | §5.1 | Cerrado: evento sobre resultado degrada a resultado base. |
| GAP-EVENTO-INVOCACION | §5.1 | Cerrado: evento sobre invocación degrada a invocación base. |
| GAP-CONDICION-RESULTADO | §5.2 | Cerrado: condición sobre resultado degrada a resultado base; `puede generarse` retirado. |
| GAP-CONDICION-INVOCACION | §5.2 | Cerrado: condición sobre invocación degrada a invocación base. |
| GAP-EXC-UNIDADES-LITERAL | §5.3 | Cerrado por ajuste-spec: `unidades-tiempo` es metavariable realizada como valor+unidad. |
| GAP-FIXTURE-INVOCACION | §5.4 | Cerrado: `invocacion-con-demora-tilde`, `autoinvocacion-con-demora-tilde` y `evento-invocacion-degrada-base`. |
| GAP-INVOCACION-TILDE | §5.4 | Cerrado: emisión canónica `después de`; parser acepta grafía legacy sin tilde. |
| GAP-FIXTURE-AGREGACION | §6.1 | Cerrado: `enlace-estructural-agregacion` (estricta). |
| GAP-FIXTURE-EXHIBICION | §6.2 | Cerrado: `enlace-estructural-exhibicion`. |
| GAP-FIXTURE-GENERALIZACION | §6.3 | Cerrado: `enlace-estructural-generalizacion` (estricta). |
| GAP-FIXTURE-CLASIFICACION | §6.4 | Cerrado: `enlace-estructural-clasificacion`. |
| GAP-TAG-PARSER | §6.5 | `se relaciona con` / `se relacionan` / etiquetas de usuario sin regex en `astEstructural`. |
| GAP-FIXTURE-TAGGED | §6.5 | Sin fixture roundtrip dedicado de etiquetado. |
| GAP-SSE-PARSER | §6.6 | Etiquetados con estado especificado heredan GAP-TAG-PARSER (sin regex). |
| GAP-FIXTURE-SSE | §6.6 | Sin fixture dedicado de estructural con estado especificado. |
| GAP-FIXTURE-ESTRUCTURALES | §6.x | Cerrado para relaciones fundamentales; etiquetado sigue separado en GAP-TAG-PARSER / GAP-FIXTURE-TAGGED. |
| GAP-CX-PARSER | §7.1 | Orden cerrado: `parsear.ts·parsearContexto` + patch `crear-refinamiento` reconstruyen el refinamiento (idempotente, OPD hijo vacío; miembros no se crean: diagnóstico `info`); la marca `en esa secuencia`/`paralelo` SÍ se reconstruye → `opd.ordenInzoom` (`planificarOrdenInzoom` + `set-orden-inzoom`, verificación por inversa). Residual: materialización de la lista de refinadores (intencional, por gesto). |
| GAP-FIXTURE-DESCOMPOSICION | §7.1 | Orden cerrado: roundtrip estricto del orden en `leyes/invocacion-implicita-bimodal.test.ts` (CX1/CX2/mixta sobre `opd.ordenInzoom`). Sin fixture en `fixtures-roundtrip.ts` por diseño (miembros del hijo irrecuperables desde modelo vacío). |
| GAP-DESPLIEGUE-DEDICADO | §7.2 / §18 | Superficies dedicadas A.10 (`se despliega por partes/especialización/instanciación/rasgos en`) derivadas en §18 pero sin generador ni declaración de sustitución; la emisión vigente reusa el verbo de la relación fundamental. |
| GAP-COMP-GUARDA | §7.7 / §9 | Cerrado-no-aplica: guard pendiente solo cuando exista GAP-COMPOSICION; hoy la protección es por construcción atómica. |
| GAP-FAN-EVENTO | §7.6 | Parcial: efecto con objeto común y procesos alternativos cerrado; otros roles bajo evento siguen sin generador. |
| GAP-FAN-RESULTADO-COND | §7.6 | Cerrado: fan resultado+condición degrada a fan base; `puede generarse` retirado. |
| GAP-PROB-SUPERFICIE | §7.6 | Cerrado: export OPL emite `Pr=p` y retira el sufijo porcentual legacy. |
| GAP-FAN-M | §7.6 | Sin generador para `exactamente m de f` / `al menos m de f` (solo `m=1`). |
| GAP-COL-RESOLUCION | §8.3 | Cerrado por ajuste-spec: vive en kernel `modelo/**`, no exige generador OPL de reporte. |
| GAP-COMPOSICION | §9 | Sin capa que coordine predicados de distinto verbo bajo sujeto-proceso compartido (eje a). |
| GAP-COMP-REVERSE | §9 | Parser no descompone una línea de predicados coordinados de distinto verbo (R-COMP-REV-1). |
| GAP-FIXTURE-RUTA | §11 | Sin fixture bisimétrica estricta de ruta en `fixtures-roundtrip.ts`; forward y reverse confirmados (`oracionEnlaceConRuta` / `RUTA_PREFIJO_RE` / `definirRutaEtiqueta`), defendidos por `parser.test.ts`. |
| GAP-DONDE-EXPRESION | §18 | `restriccion_de_expresion` (`donde …`) derivable de la EBNF, sin generador ni parser; derivación-sin-soporte. |
| GAP-RANGO-TEXTUAL | §18 | Intervalos de rango (`[..]`/`(..)`, `expresion_de_rango`, `clausula_de_rango`) derivables, sin generador ni parser; GAP-VARIA cubre solo el verbo `varía de … a`. |

### §20.3 Cobertura inversa

Barrido de los exports de `app/src/opl/**` para detectar símbolos sin entrada trazada en §1–§18 (`GAP-spec`) o ya cubiertos.

| Símbolo | Archivo | Estado |
|---------|---------|--------|
| `oracionEnlaceConRuta` | `generadores/procedural.ts` | cubierto §11 (etiqueta de ruta; reverse `RUTA_PREFIJO_RE`/`definirRutaEtiqueta`) |
| `oracionProcedimentalParaRuta` | `generadores/procedural.ts` | cubierto §11 |
| `transicionesEstado` / `transicionesEstadoInteractivo` | `generadores/procedural.ts` | cubierto §3.4 (helpers de cambio de estado) |
| `oracionesAbanicoInteractivo` / `oracionesAbanico` / `oracionAbanico` | `generadores/abanico.ts` | cubierto §7.6 (fan); ramas evento/m/prob en GAP-FAN-* |
| `emitirDespliegueOcurren` | `generadores/refinamiento.ts` | cubierto §7.2 (emisor contextual de despliegue con ocurrencia) |
| `emitirEspecializacion` | `generadores/refinamiento.ts` | cubierto §6.3: emite generalización individual `es un`; XOR `puede ser` queda en GAP-XOR-FEATURE / GAP-XOR-PARSER |
| `oracionRefinamiento` / `oracionesRefinamiento` | `generadores/refinamiento.ts` | cubierto §7.1–§7.5 |
| `oracionesUnidadDescripcionEstados` / `formatearAliasInline` / `formatearUnidadInline` / `formatearDescripcionInline` | `generadores/duracionMetadata.ts` | cubierto §7.4 (realización local de metadatos inline) |
| `formatearDuracion` / `nombreEstadoOpl` | `generadores/duracionMetadata.ts` | cubierto §2.3 / §5.3 |
| `pluralizarCanonico` / `multiplicidadPlural` / `verbo` / `listarOpl` / `listarEstadosOpl` / `listarDesignaciones` / `nombreOplConMultiplicidad` | `generadores/refsHints.ts` | cubierto (utilitarios de superficie; multiplicidad §10, listas en cada familia) |
| `codigoOpd` | `generadores/refsHints.ts` | cubierto §7 / §12 (código de OPD) |
| `entidadOplEsEmitible` / `estadoOplEsEmitible` / `extremoOplEsEmitible` / `enlaceOplEsEmitible` | `generadores/refsHints.ts` | cubierto §2.1 (emitibilidad; procesos placeholder suprimidos, residual GAP-PLACEHOLDER-OBJETO) |
| `extraerMultiplicidad` | `parser/parsear.ts` | cubierto §10 (multiplicidad reverse) |
| `parsearParrafoOpl` / `normalizarLineas` / `normalizarNombreOpl` / `claveNombre` | `parser/parsear.ts` | cubierto §18 (normalización) / §19 (parseo) |
| `planificarEdicionOplLibre` | `parser/planificar.ts` | cubierto §15 (planificación de edición) |
| `aplanarBloquesOpl` / `chevronEstadoBloque` / `togglearColapsoBloque` | `bloquesJerarquicos.ts` | cubierto §12–§13 (mecánica display de colapso/expansión de bloques) |
| `OplReferencia` / `OplToken` / `OplLineaInteractiva` / `OplTokenHint` (tipos) | `interaccion.ts` | cubierto §14 (modelo de tokens) |
| `RazonNoAplicable` / `EstadoLineaOpl` / `LineaClasificada` / `ResultadoClasificacion` (tipos) | `clasificadorEdicion.ts` | cubierto §15 / §18 |
| `OracionOplAst` / `PatchOplPropuesto` / `ReferenciaEntidadPatch` / `PrevisualizacionOplReverse` (tipos) | `parser/tipos.ts` | cubierto §15 / §19 (AST y patches) |
| `oracionPlegadoParcial` | `generadores/plegado.ts` | cubierto §7.2 / §12 |
| `leyes/opl-reverse.test.ts` (ley `law-opl-safe-lens`) | `leyes/` | cubierto §19 |

`GAP-spec` detectados (0) tras la reclasificación: `emitirDespliegueOcurren`, `emitirEspecializacion`, los formateadores inline de `duracionMetadata.ts` y la mecánica de colapso de bloques quedan trazados en §7.2, §6.3, §7.4 y §12–§13 respectivamente. El sufijo `[etiqueta: …]` (`conEtiquetaEnlace`/`ETIQUETA_SUFIX`), detectado como GAP-spec en la auditoría 2026-06-12, queda trazado como extensión declarada en §6.5 (R-EST-TAG-3) y §18 `(* ext §6.5 *)`.

Rationale: §20 materializa la disciplina de trazabilidad bidireccional (spec→código vía §20.1/§20.2; código→spec vía §20.3) declarada por el esquema de entrada (§0, campo `Traza a código`) y por la política de auditoría de alineación. Remite a `app/src/opl/**` y a `leyes/opl-reverse.test.ts` como superficie auditada.

## §21 Invariantes

### §21.1 Invariantes prescriptivos del documento

Esta spec, como artefacto KORA/MD familia `spec`, DEBE preservar los siguientes invariantes del perfil prescriptivo (spec-md §9):

| Invariante | Enunciado | Verificación |
|------------|-----------|--------------|
| **R-§21-PRESC-CONS** Consistencia interna | NO DEBEN coexistir reglas incompatibles sin una cláusula de precedencia explícita. Ante conflicto, la regla más específica o la cláusula declarada manda. | manual |
| **R-§21-PRESC-AUTO** Auto-suficiencia de regla | Cada regla DEBE ser entendible con su contexto local (su sección y sus `Rationale:`), sin obligar a reconstruir el documento entero. | manual |
| **R-§21-PRESC-CIRC** No-circularidad | Una regla NO DEBE justificarse remitiendo solo a otra regla opaca; toda cadena de remisión DEBE terminar en una fuente sustantiva (SSOT, ley, test). | manual |
| **R-§21-PRESC-LANG** Preservación de idioma | El documento DEBE redactarse en es-CL; los anglicismos SE ADMITEN solo para términos técnicos inevitables (p. ej. `roundtrip`, `lens`, `display`, `EBNF`). | lint/manual |
| **R-§21-PRESC-ENF** Enforcement declarado | Toda tabla de validación DEBE incluir la columna `Enforcement`. | lint |
| **R-§21-PRESC-INTEG** Integridad del perfil prescriptivo | El documento DEBE cerrar con la tríada Invariantes → Validación → Migración y usar `Rationale:` (nunca `Traces to:`) para trazabilidad. | manual |

### §21.2 Invariantes OPL del dominio

(Invariantes OPL, parte de producto) R-§21-OPL-VOCAB y R-§21-OPL-MOD son canon spec-OPL §21.2.

| Invariante | Enunciado | Origen |
|------------|-----------|--------|
| **R-§21-OPL-TIPO** Tipografía portadora de tipo | El tipo de cada token (objeto, proceso, estado) SE CODIFICA tipográficamente: **objeto** (negrita), *proceso* (cursiva), `estado` (monoespaciado). La tipografía es semántica, no decorativa. | §2, §13 |
| **R-§21-OPL-SPAN** Preservación de sub-span | La composición de prosa DEBE preservar el `ref` y el sub-span (`hint`) de cada hecho coordinado; sin fusión opaca. | §9 |
| **R-§21-OPL-DISP** Display vs canónico | Existe una forma canónica (parseable, ordenada por §16) y formas de display (plegado, presentación); ambas DEBEN ser distinguibles y la canónica es la única autoritativa para reverse. | §16, §19.2 |

Rationale: spec-md §9 (perfil prescriptivo: consistencia, auto-suficiencia, no-circularidad, idioma, enforcement, integridad) para §21.1; §1·§2·§8·§9·§13·§16 de esta spec + §19 (display-vs-canónico) para §21.2.

## §22 Validación

Toda regla de esta spec se verifica por alguno de los mecanismos declarados. Valores de `Enforcement` (gobernanza KORA §7): `schema` (validación estructural automática), `lint` (regla estática sobre el texto/código), `runtime` (chequeo en ejecución de la app), `eval` (test ejecutable que evalúa comportamiento), `manual` (revisión humana).

| Clase de regla | Cómo se verifica | Artefacto | Enforcement |
|----------------|------------------|-----------|-------------|
| Plantillas y vocabulario fijo (§1–§8) | unit sobre el generador: que las frases emitidas coincidan con las plantillas y usen solo el vocabulario cerrado | `app/src/opl/generadores/*.test.ts` | lint, eval |
| Roundtrip bisimétrico (§19.1, §19.4) | framework build→generar→parsear+aplicar→generar; igualdad línea-por-línea en fixtures estrictos | `app/src/opl/roundtrip.test.ts`, `fixtures-roundtrip.ts` | eval |
| Bisimetría / ley `safe-lens` (§19.3) | leyes ejecutables: no-borrado-por-ausencia, preview puro, preservación de hechos, unsupported-kernel sin mutación | `app/src/leyes/opl-reverse.test.ts` | eval |
| Estilo prescriptivo: RFC 2119, sin grasa, sin EN↔ES (§21.1) | lint de redacción donde sea automatizable + revisión humana del resto | gate de docs + revisión | lint, manual |
| Cobertura de GAPs (huecos de canon abiertos) | rastreo de GAPs declarados contra fixtures/leyes que los cierren | revisión de seguimiento de GAPs | manual |
| Conformidad KORA/MD familia `spec` (§21.1·INTEG) | tríada Invariantes→Validación→Migración presente; frontmatter y trazabilidad `Rationale:` correctos | revisión contra gobernanza KORA | manual |

- **R-§22-ENF-1**: toda fila de toda tabla de validación de esta spec DEBE declarar su `Enforcement`. Una regla sin enforcement declarado es un defecto del documento (viola R-§21-PRESC-ENF).

- **R-§22-ENF-2**: los enforcement `eval`/`lint`/`schema`/`runtime` DEBEN apuntar a un artefacto ejecutable concreto; `manual` DEBE nombrar el procedimiento de revisión.

Rationale: gobernanza KORA §7 (taxonomía de Enforcement) + §19 (leyes y roundtrip como artefactos de evaluación) + §21.1·PRESC-ENF (obligatoriedad de la columna).

## §23 Migración

Esta spec es un **major bump 1.0.0**: consolida en un solo documento autoritativo lo que antes vivía disperso, y cambia la fuente de verdad operativa de OPL en OPFORJA.

### §23.1 Qué cambia respecto del canon disperso previo

| Antes | Ahora |
|-------|-------|
| OPL repartido entre `opm-opl-es` (gramática OPL-ES) y `reglas-opm-estrictas-es §4` (reglas de canon) | `spec-forja-opl-es` es la SSOT OPL bidireccional/operativa única de OPFORJA |
| Para resolver una duda OPL había que cruzar dos fuentes y reconciliarlas a mano | una sola fuente con trazabilidad `Rationale:` hacia ambas |
| La implementación (generadores/parser/leyes) se alineaba contra canon implícito | la implementación se alinea contra esta spec, vía la tabla de trazabilidad §20 |

### §23.2 Qué migrar

- **R-§23-MIG-1**: la implementación (`app/src/opl/`) DEBE alinearse contra esta spec usando la tabla de trazabilidad §20 (regla→artefacto). Toda divergencia entre código y spec es deuda a cerrar; ante conflicto, la SSOT de canon (`urn:fxsl:kb:reglas-opm-estrictas-es`) sigue por encima de esta spec.

- **R-§23-MIG-2**: los GAPs abiertos heredados del canon disperso DEBEN re-rastrearse contra esta spec y cerrarse vía fixtures/leyes (§22), no vía notas sueltas.

### §23.3 Qué se deprecia

- **R-§23-DEP-1**: SE DEPRECIA consultar dos fuentes dispersas (`opm-opl-es` + `reglas §4`) como ruta primaria para resolver OPL en OPFORJA. Esas fuentes SE CONSERVAN como SSOT de canon OPM general y como `Rationale:` de esta spec, pero la ruta operativa primaria para OPL es ahora este documento.

- **R-§23-DEP-2**: NO SE ADMITE redactar reglas OPL nuevas fuera de esta spec; toda regla nueva ENTRA aquí con su `Rationale:` y su `Enforcement`.

Rationale: `urn:fxsl:kb:reglas-opm-estrictas-es` como SSOT prescriptiva y `opm-opl-es` como SSOT textual base + tabla de trazabilidad §20 (alineación implementación↔spec) + §22 (cierre de GAPs por evaluación). Bump major 1.0.0 por cambio de fuente operativa.

## §24 Composición por interfaz (modelo ∘ modelo)

La composición une dos modelos identificando entidades de **interfaz

compartida**. «Horizontal» distingue este gesto del refinamiento vertical; no

afirma dualidad categorial. NO introduce verbo OPL nuevo: el OPL compuesto es

la unión deduplicada de párrafos, con la entidad compartida una sola vez.

- **R-§24-COMP-1**: dos modelos PUEDEN componerse identificando un conjunto de entidades compartidas (mapeo `entidad_B → entidad_A`). La sugerencia por defecto empareja por **nombre normalizado + mismo tipo OPM**; la identidad por id solo vale si el nombre también coincide. *(Rationale operativo: unión por interfaz; pushout / structured cospan solo como formalización candidata sujeta a universalidad, `urn:fxsl:kb:icas-universales`; `reglas-opm-estrictas-es §Anexo C / R-CAT-COMP-1`.)*

- **R-§24-COMP-2**: en el OPL del compuesto, una entidad compartida DEBE emitir sus oraciones de designación **una sola vez**; sus enlaces provenientes de ambos modelos fuente DEBEN consolidarse bajo esa identidad sin duplicar la entidad ni su apariencia. Las entidades no compartidas del modelo B se namespacean para evitar colisión de ids, conservando su nombre OPL. *(Enforcement: `law-composicion-no-duplica`, `law-composicion-sin-refs-colgantes`.)*

- **R-§24-COMP-3**: la composición DEBE ser asociativa módulo namespacing (`(A∘B)∘C` y `A∘(B∘C)` producen el mismo OPL salvo ids) y NO DEBE introducir oraciones OPL inválidas que no estuvieran ya en A o B. *(Enforcement: `law-composicion-asociativa`, `law-composicion-bien-tipada`.)*

- **R-§24-COMP-4**: la composición es **no-bloqueante y reversible**; si la fusión crea un conflicto de recurso lineal (un objeto `lineal` consumido por procesos de ambos modelos), DEBE advertirse —no impedirse— en el resultado. *(Enforcement: `law-composicion-respeta-lineal`; ver `reglas-opm-estrictas-es §Anexo C / R-CAT-LIN-2`.)*

**Traza a código**: operación `app/src/modelo/composicion/componer.ts`

(`componerModelos`: namespacing + dedup + remapeo), preview de interfaz y

tests citados. Estos verifican invariantes operativos; no prueban la propiedad

universal de pushout.

Rationale: el eje horizontal de OPM (composición de modelos) carecía de tratamiento OPL operativo; esta sección lo fija como **unión deduplicada de párrafos sobre interfaz compartida**, trazable a la capacidad implementada y verificada en deep-opm-pro y a la regla normativa `reglas-opm-estrictas-es §Anexo C / R-CAT-COMP`. Adición compatible (minor bump 1.1.0): no altera familias OPL existentes.

## Apéndice A — Ejemplo end-to-end (parte de producto)

El ejemplo canónico es canon spec-OPL Apéndice A [informativo]; aquí queda la forma compuesta de producto (A.3) del ejemplo v1.4.1.

### A.3 OPL prosaica / compuesta (§9) del mismo modelo

La forma compuesta coordina hechos con eje compartido en una sola línea, **preservando un sub-span y una `ref` por hecho** (R-COMP-MAESTRA-1/2):

- Eje (a) — predicado coordinado, sujeto-proceso compartido (**forma objetivo**; hoy sin generador, `GAP-COMPOSICION` §9.6):
  `*Despachar* consume **Embalaje**, genera **Guía** y afecta **Inventario**.`

- Eje (b) — destino enumerado estructural:
  `**Sistema De Despacho** consta de **Furgón**, **Repartidor** e **Inventario**.`

**Anotación de tokens/refs (§9.0) sobre la oración compuesta del eje (a):**

| sub-span | tipo de hecho | `ref` |
| --- | --- | --- |
| `*Despachar*` | proceso (sujeto compartido) | proceso:despachar |
| `consume **Embalaje**` | transformador consumo | enlace:consumo · objeto:embalaje |
| `genera **Guía**` | transformador resultado | enlace:resultado · objeto:guia |
| `afecta **Inventario**` | transformador efecto | enlace:efecto · objeto:inventario |

`refs` de la línea = unión sin duplicados de las cuatro filas (R-COMP-MAESTRA-2, vía `refsUnicasPorTipoId`); el hover sobre `genera` resuelve `enlace:resultado`, no la primera `ref` (R-COMP-MAESTRA-3). Orden estable por fuerza semántica consumo→resultado→efecto (R-COMP-ELEG-3). Los enlaces de instrumento no se coordinan aquí: viven bajo el abanico XOR de A.2, y un fan se realiza como oración de abanico, no por coordinación copulativa (§4.2). `parsear(componer(F)) = F` como conjunto (R-COMP-REV-2).

## Apéndice B — Patrones OPL sociotécnicos y agénticos

Patrones recurrentes del runtime sociotécnico/agéntico de OPFORJA, expresados **siempre como composición de constructos canónicos** de §2–§9. Anclados a `app/src/modelo/simulacion/sociotecnico.ts`. Ninguna primitiva nueva: cada patrón reusa entidad+estado, habilitador, abanico, condición/evento, excepción e invocación. Estatus etiquetado por patrón: `canon` (composición pura de §2–§9) · `extensión declarada` (superficie operativa sobre el canon, ya declarada en la spec) · `no-canonizado` (aún sin realización canónica cerrada).

### B.1 Actor–rol–autoridad — estatus `canon`

El actor (`ActorSim.tipo` = humano/equipo/servicio/sistema-externo) es un **objeto**; el rol se realiza vía habilitador (§4): **agente** si el actor es humano (`R-HAB-AG-1`, agente exclusivo de humanos), **instrumento** si es servicio/sistema-externo. La disponibilidad (`EstadoDisponibilidadActorSim`) son **estados** (§2.5).

- **Repartidor** es físico. **Repartidor** puede estar `disponible`, `ocupado` o `no-disponible`.

- **Repartidor** maneja *Despachar*. (actor humano → habilitador agente; rol = participación en el proceso)

- **Servicio De Ruteo** maneja *Calcular Ruta*. → **incorrecto**; un servicio NO es humano. Forma canónica:
  `*Calcular Ruta* requiere **Servicio De Ruteo**.` (actor no humano → habilitador instrumento)

- Disponibilidad como condición de habilitación (CS5/CS6, §5.2):
  `**Repartidor** maneja *Despachar* si **Repartidor** está en \`disponible\`, de lo contrario *Despachar* se omite.`

Composición: objeto + estado + habilitador + condición con estado. El equipo (`tipo:equipo`) se nombra **Grupo** (plural humano, §1).

### B.2 Agente–autonomía — estatus `canon`

El agente (`AgenteSim`) es un **objeto informacional** (R-OBJ-1) vinculado a su actor por estructural (§6); el nivel de autonomía (`NivelAutonomiaSim`) son **estados**; la política (`PoliticaAutonomiaSim` con `porDefecto`/`acciones`/`herramientas`) se realiza como **atributo** (exhibición §6.2) y se refina (§7) en política por acción y por herramienta.

- **Agente** es informacional. **Agente** puede estar `bloqueado`, `requiere-aprobación` o `autónomo`.

- **Actor** consta de **Agente**. (vínculo `AgenteSim.actorId` → agregación)

- **Agente** exhibe **Política**.

- **Política** se descompone en **Política Por Defecto**, **Política Por Acción** y **Política Por Herramienta**. (refinamiento del atributo)

Composición: objeto informacional + estados + estructural + exhibición + refinamiento. Sin primitiva nueva.

### B.3 Decisión — estatus `canon`

La decisión (`DecisionSim`) es un **proceso**; el resultado (`EstadoResultadoDecisionSim`) es un **estado** de la decisión bajo **abanico XOR** (§8.1); la precedencia de política (`resolverNivelAutonomia`: herramienta > acción > porDefecto) se realiza como **condición** (§5.2).

- *Decidir* cambia **Decisión** a exactamente uno de `permitida`, `suspendida` o `bloqueada`.

- *Decidir* ocurre si **Política** está en `autónomo`, en cuyo caso *Decidir* cambia **Decisión** a `permitida`, de lo contrario *Decidir* se omite. (precedencia como condición de estado)

Composición: proceso + abanico XOR de estado-salida + condición con estado. Mapea `evaluarDecisionSociotecnica`.

### B.4 Efecto pendiente — estatus `extensión declarada`

El efecto (`TipoEfectoSim` = ask-human/tool-call/http/python/mqtt/sql/ros/genai) es un **proceso invocado** vía **enlace de invocación** (§5.4, IV1); la aprobación humana es **condición/evento**; el escalamiento por demora es **excepción/sobretiempo** (§5.3, EX1).

- *Decidir* invoca *Llamar Herramienta*. (IV1: proceso→proceso; un proceso de efecto por `TipoEfectoSim`)

- *Decidir* invoca exactamente uno de *Preguntar Humano* o *Llamar Herramienta*. (abanico XOR de invocación, §5.4)

- *Aprobar* maneja *Preguntar Humano*. → HITL (agente humano, ver B.5)

- *Escalar* ocurre si duración de *Preguntar Humano* excede 30 minutos. (sobretiempo; *Escalar* ambiental, R-EXC-AMBIENTAL-1)

Estatus `extensión declarada`: la familia de efectos `ask-human/tool-call/http/python/mqtt/sql/ros/genai` se nombra como conjunto de *procesos* invocados; la invocación, el abanico y la excepción son canon, pero la **taxonomía de tipos de efecto** es nomenclatura operativa del runtime, no un constructo OPL nuevo. La forma `invoca … si … ocurre` VIOLA R-IV-3/R-MOD-CAT-1 y ya no se exporta: GAP-CONDICION-INVOCACION está cerrado por degradación a invocación base (§5.2).

### B.5 Supervisión humana HITL — estatus `canon`

La aprobación humana = **condición** (§5.2) + **agente humano** (§4, R-HAB-AG-1). El `EfectoSim` de tipo `ask-human` que `crearEfectoAprobacion` produce se realiza como proceso *Preguntar Humano* manejado por un actor humano.

- **Supervisor** es físico. **Supervisor** puede estar `disponible` o `no-disponible`.

- **Supervisor** maneja *Aprobar*. (agente humano; HITL)

- *Aprobar* ocurre si **Decisión** está en `suspendida`, en cuyo caso *Aprobar* cambia **Decisión** de `suspendida` a `permitida`, de lo contrario *Aprobar* se omite.

- **Supervisor** inicia *Aprobar*, que afecta **Decisión**. (evento de disparo, §5.1)

Composición: objeto humano + estados + habilitador agente + condición con estado + evento. Sin primitiva nueva; HITL es composición pura.

Rationale: `sociotecnico.ts` (tipos `ActorSim`/`AgenteSim`/`DecisionSim`/`EfectoSim`/`ResultadoDecisionSim`); §2 (entidad/estado), §4 (habilitador agente/instrumento, R-HAB-AG-1), §5.1–§5.4 (evento/condición/excepción/invocación), §6 (estructural/exhibición), §7 (refinamiento), §8.1 (abanico XOR), §9 (composición). Todo patrón es composición de constructos canónicos; ninguna primitiva nueva.

## Apéndice C — Índice de IDs

Familias de identificadores de regla y de oración usados en §1–§23, con su sección de origen. Las IDs de oración (D*, T*/TS*, H*/HS*, E*, C*, RF*/RX*/RH*, SE*/SSE*, CX*, EX*, IV*) etiquetan hechos OPL atómicos; las IDs de regla (`R-*`) etiquetan normas con `Rationale:`/`Enforcement`.

### C.1 IDs de oración (hechos atómicos)

| Familia | Significado | Sección |
| --- | --- | --- |
| D1–D13 | Designaciones de entidad (esencia/afiliación/perseverancia) | §2 |
| T1–T3 / TS1–TS5 | Transformadores: T1 consumo, T2 resultado, T3 efecto; TS* variantes con estado | §3 |
| H1–H2 / HS1–HS2 | Habilitadores: H1 agente, H2 instrumento; HS* con estado | §4 |
| ET1–ET2 / EH1–EH2 / ETS* / EHS* | Eventos: transformador/habilitador, con/sin estado | §5.1 |
| CT1–CT2 / CH1–CH2 / CS1–CS6 | Condiciones: transformador/habilitador/con estado | §5.2 |
| EX1–EX2 | Excepción: EX1 sobretiempo, EX2 subtiempo | §5.3 |
| IV1–IV2 | Invocación / autoinvocación | §5.4 |
| RF1–RF4 (+RF2b/RF3b/RF4b) / RX1–RX2 / RH1 | Relaciones estructurales fundamentales: RF1 agregación, RF2 exhibición, RF3 generalización (RX* XOR, RH1 herencia múltiple), RF4 clasificación | §6 |
| SE1–SE5 | Estructurales etiquetados: etiqueta de usuario, `se relaciona con`/`se relacionan`, bidireccional, recíproco | §6.5 |
| SSE1–SSE7 | Estructurales con estado especificado | §6 |
| CX1–CX8 | Refinamiento / gestión de contexto (in-zoom, despliegue, escisión) | §7 |
| CL | Token de composición / línea OPL | §9 |
| EBNF | Producciones de la gramática formal | §18 |

### C.2 IDs de regla por dominio

| Prefijo de regla | Dominio | Sección |
| --- | --- | --- |
| R-ENT-*, R-OBJ-*, R-PROC-*, R-COSA-* | Entidad / objeto / proceso / cosa | §2 |
| R-EST-*, R-ATR-*, R-VERB-EST-* | Estado / atributo / verbo de estado (`puede estar`) | §2 |
| R-INS-*, R-ENT-INS-*, R-PRIN-9 | Instrumento / principio | §2,§4 |
| R-CONS-*, R-RES-*, R-EFE-*, R-ESC-*, R-ESCIND-* | Transformadores y escisión de cambio de estado | §3 |
| R-TR-ASIM-* | Asimetría transformadora | §3 |
| R-AG-*, R-HAB-AG-*, R-HER-* | Agente (humano) / habilitador / herramienta | §4 |
| R-MOD-*, R-MOD-INPUT-*, R-MOD-CAT-*, R-MOD-NAT-* | Modificadores de control (categoría/input/naturaleza) | §5 |
| R-ECA-*, R-COND-RAMA-*, R-OPL-COND-ALT-*, R-OPL-SUP-* | Evento-condición-acción / ramas de condición | §5.1,§5.2 |
| R-EXC-*, R-EXC-AMBIENTAL-*, R-EXC-DUR-* | Excepción / sobretiempo-subtiempo | §5.3 |
| R-IV-*, R-INV-* | Invocación | §5.4 |
| R-STRE-*, R-STRF-*, R-EST-TAG-*, R-EST-HER-*, R-EST-GEN-*, R-EST-DIR-*, R-EST-PERS-* | Estructurales y sus variantes con estado | §6 |
| R-OPL-SE-* | Realización OPL de estructurales | §6 |
| R-IDP-*, R-ROL-*, R-CX-*, R-REF-*, R-DIST-*, R-ESC-* | Refinamiento / contexto / distribución de enlaces | §7 |
| R-OPL-RF-*, R-OPL-CX-*, R-OPL-TOTAL-* | OPL de refinamiento / despliegue total | §7 |
| R-COMB-*, R-ZNC-*, R-FAN-*, R-FAN-EST-*, R-FAN-PROB-*, R-FAN-M-*, R-PROB-* | Combinatoria / abanicos (XOR/OR/probabilístico) | §8 |
| R-FUERZA-*, R-PREC-* | Colisión de roles / fuerza / precedencia (propiedad de `reglas §6.5`/`§6.6`, citadas en §8.3.1) | §8 |
| R-COMP-MAESTRA-*, R-COMP-EJE-*, R-COMP-ELEG-*, R-COMP-ZP-*, R-COMP-REV-*, R-COMP-CFG-* | Composición de oraciones / prosa OPL | §9 |
| R-MULT-*, R-MULT-COMB-* | Multiplicidad y cardinalidad | §10 |
| R-OPL-RUTA-* | Etiquetas de ruta | §11 |
| R-OPL-DISP-* | Plegado / despliegue de display | §12 |
| R-OPL-PANEL-* | Presentación del panel OPL | §13 |
| R-OPL-INT-* | Interacción OPL↔OPD | §14 |
| R-OPL-EDIT-* | Edición de OPL | §15 |
| R-OPL-CFG-* | Configuración/opciones que afectan OPL | §16 |
| R-OPL-FALLO-* | Modos de fallo / validación / ambigüedad | §17 |
| R-OPL-LEX-*, R-OPL-PART-*, R-OPL-RANGO-*, R-OPL-CONJ-*, R-OPL-LISTA-* | Léxico / partículas / EBNF | §18 |
| R-OPL-VERB-*, R-VERB-KW-*, R-OPL-KW-* | Vocabulario verbal / palabras clave | §1 |
| R-OPL-PERSIST-*, R-OPL-TRANS-* | Persistencia de estado / transformación en OPL | §3,§5 |
| R-ARB-* | Arbitraje canon/OPCloud | §1 |
| R-§23-MIG-*, R-§23-DEP-* | Migración / depreciación | §23 |

Rationale: índice derivado por extracción (`rg` de patrones de ID sobre §1–§23); facilita navegación cruzada regla↔oración↔sección y auditoría de cobertura (§20 trazabilidad, §22 validación). Las IDs sociotécnicas/agénticas del Apéndice B son composiciones de las familias anteriores, no nuevas familias de ID.
