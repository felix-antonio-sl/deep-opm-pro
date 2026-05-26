---
_manifest:
  urn: "urn:opforja:kb:spec-forja-opl"
  provenance:
    created_by: "opforja"
    created_at: "2026-05-26"
    source: "docs/canon-opm/reglas-opm-estrictas.md; ~/kora/.../opm-opl-es.md; opm-libro-curado; transcripciones-videos-opcloud; curso-dov-dori"
version: "1.0.0"
status: borrador
tags: [opl, opforja, spec, generacion, parser]
lang: "es"
extensions:
  opforja:
    family: spec
relations:
  depends:
    - "urn:fxsl:kb:opl-es"
    - "urn:fxsl:kb:opm-es"
  refines:
    - "docs/canon-opm/reglas-opm-estrictas.md"
---

# Spec-forja OPL — SSOT del lenguaje OPL de OPFORJA

## Definición

Esta spec es la SSOT OPL **bidireccional** y **operativa** de OPFORJA. Gobierna, para el lenguaje OPL del modelador, las dimensiones de generación (modelo → frases), parseo (frases → mutaciones), presentación, interacción, edición, configuración, manejo de fallos e invariantes de equivalencia.

La audiencia primaria son los agentes de desarrollo de OPFORJA y los agentes de generación/parseo OPL.

Esta spec es autocontenida: un agente conforme NO DEBE necesitar abrir `opm-opl-es.md` ni `reglas-opm-estrictas.md §4` para implementar una entrada. Las plantillas, vocabulario y restricciones necesarias DEBEN aparecer en esta spec. La procedencia a esas fuentes se expresa con `Rationale:`.

## Definiciones

| Término | Definición |
| --- | --- |
| Oración atómica | Frase OPL que expresa un solo hecho del modelo y no admite descomposición sin perder el hecho. |
| Oración compuesta | Frase OPL que coordina dos o más hechos en una sola realización superficial (p. ej. agregación con varias partes). |
| Sub-span | Tramo contiguo de texto dentro de una oración que mapea a un único token o referencia de modelo. |
| Hecho | Unidad mínima del modelo (cosa, enlace, estado, relación) que una oración OPL realiza textualmente. |
| `ref` | Referencia tipada de un sub-span a la entidad de modelo (cosa, estado, enlace) que representa. |
| `hint` | Anotación no normativa adjunta a un span que orienta presentación, interacción o edición sin alterar el hecho. |
| Token | Unidad léxica de una oración OPL (palabra de objeto, verbo de proceso, valor de estado, conector o puntuación) reconocible por generación y parseo. |
| Esencia | Propiedad genérica de una cosa: física o informática. |
| Afiliación | Propiedad genérica de una cosa: sistémica o ambiental. |
| Placeholder | Marcador de span pendiente de completar (objeto/proceso/estado sin nombre) emitido para edición guiada. |
| Plegado | Supresión deliberada de hechos refinados en un OPD ascendente, con su realización OPL equivalente. |
| Display-vs-canónico | Distinción entre la forma visible de una oración (presentación) y su forma canónica normalizada (equivalencia y roundtrip). |

## Precedencia

Esta spec DEBE mandar sobre la implementación OPL de OPFORJA (generadores, parser, presentación e interacción).

Esta spec DEBE quedar **bajo** `docs/canon-opm/reglas-opm-estrictas.md` para el canon OPM nuclear: ante conflicto sobre qué es una cosa, un enlace, un estado o una relación, prevalece ese documento.

Esta spec DEBE quedar **bajo** la SSOT OPM externa (`urn:fxsl:kb:opl-es` y `urn:fxsl:kb:opm-es`): ante conflicto de gramática o semántica OPL, prevalece la SSOT externa.

Esta spec NO DEBE relajar ningún contrato de las fuentes superiores; solo PUEDE operacionalizarlo, restringirlo o declarar extensiones marcadas.

Rationale: la autoridad semántica del proyecto es la SSOT OPM, no la herramienta; OPFORJA operacionaliza OPL pero no lo redefine.

## Convenciones

### Tipografía

Un **objeto** DEBE escribirse en negrita; un *proceso* en cursiva; un `estado` o `valor` entre backticks. Esta convención es obligatoria en toda frase OPL y ejemplo de esta spec.

### Esquema de IDs

Las entradas DEBEN reusar los IDs ya canonizados en `reglas-opm-estrictas.md`: `D1`–`D13` (designaciones), `T1`–`TS5` (cosas/tipos), `H*` (humanos/agencia), `E*` (eventos), `C*` (condiciones), `SE*` (state-specified enabling), `RF*` (refinamiento), `SSE*` (split state-specified), `CX*` (contexto), `CM*` (gestión de complejidad). Para hechos no cubiertos por esos rangos, esta spec PUEDE acuñar IDs nuevos, que NO DEBEN colisionar con los existentes.

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

1. `reglas-opm-estrictas.md §4`–`§7` y `opm-opl-es` mandan (canon).
2. El libro de Dori llena vacíos no cubiertos por el canon.
3. Los videos OPCloud aportan evidencia observacional.
4. El curso pedagógico aporta intuición.

Cuando el canon calla, la entrada DEBE marcarse como no-canonizado o extensión declarada; NO DEBE inventar canon.

## §1 Vocabulario fijo de verbos y cópulas

El vocabulario OPL-ES es un **enum cerrado**. La generación NO DEBE emitir un verbo o cópula fuera de esta sección; el parseo NO DEBE reconocer como verbo OPL un token ausente de esta sección. Todo verbo DEBE emitirse en tercera persona singular del presente indicativo, salvo que la plantilla imponga otra forma (plural por multiplicidad, negación, pasiva refleja).

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
| son | varias especializaciones son la general (plural) | especialización jerárquica | `estructural.ts·oracionEstructural` (`son`) |
| es un / es una | una especialización es la general (singular) | especialización jerárquica | `estructural.ts·oracionEstructural` (`es un`) |
| es una instancia de | la instancia pertenece a la clase | clasificación-instanciación | `estructural.ts·oracionEstructural` (`es una instancia de` / `son instancias de`) |
| se relaciona con | enlace estructural etiquetado nulo | tagged sin etiqueta de usuario | `procedural.ts·oracionEstructuralEtiquetada` (`se relaciona con` / `se relacionan`) |
| varía de … a | el atributo recorre un rango de valores | rango de atributo | GAP-VARIA |
| es de tipo | la cosa declara su tipo | declaración de tipo | GAP-TIPO |
| puede estar | el objeto enumera sus estados posibles | enumeración de estados (D5, D6) | `duracionMetadata.ts·oracionEstados` (`puede estar`) |
| puede ser | la especialización XOR enumera generales mutuamente excluyentes | especialización XOR (RX1, RX2) | GAP-XOR |
| se descompone | el proceso se descompone (in-zooming) en subprocesos | descomposición síncrona | `refinamiento.ts·oracionRefinamiento` (`se descompone en`) |
| se despliega | la cosa se despliega (unfolding) en refinados | despliegue asíncrono | `refinamiento.ts·oracionRefinamiento` (`se despliega en`) |
| se refina | refinamiento explícito entre OPDs por descomposición | refinamiento inter-OPD | GAP-REFINA |
| se pliega | supresión de hechos refinados en OPD ascendente | plegado | GAP-PLIEGA |
| se recompone | recomposición desde refinados | recomposición | GAP-RECOMPONE |

Notas de traza:
- `cambia` aparece además como `hint` de los enlaces consumo/resultado en `refsHints.ts·hintEnlace` y `refsHints.ts` (mapa `consumo`/`resultado`), coherente con la emisión de `oracionCambioEstado`.
- `existe`, `se omite` y `se consume` solo se emiten dentro de plantillas condicionales/excepción, no como oración autónoma.
- GAP-VARIA, GAP-TIPO, GAP-XOR, GAP-REFINA, GAP-PLIEGA, GAP-RECOMPONE: el verbo es canónico (`reglas §4.3` / `opm-opl-es §2`) pero ningún generador de `app/src/opl/generadores/` lo emite hoy.

Rationale: `reglas §4.3` (tabla de verbos) y `opm-opl-es §2`.

### §1.2 Reglas duras de `puede estar` vs `puede ser`

- **R-VERB-EST-1**: la enumeración de **estados** de un objeto DEBE usar **puede estar**.

  Correcto: `**Pedido** puede estar \`pendiente\`, \`despachado\` o \`cerrado\`.`
  Incorrecto: `**Pedido** puede ser \`pendiente\`, \`despachado\` o \`cerrado\`.`
  Rationale: `reglas §4.3` (Enumeración de estados → `puede estar`) y D5/D6 de `opm-opl-es §3.2`.

- **R-VERB-EST-2**: **puede ser** DEBE reservarse a **especialización XOR** (generales mutuamente excluyentes); NO DEBE usarse para enumerar estados.

  Correcto: `**Vehículo** puede ser **Auto** o **Camión**.`
  Incorrecto: `**Vehículo** puede ser \`encendido\` o \`apagado\`.`
  Rationale: `reglas §4.3` (RX1, RX2) y R-OPL-RF-5 (`especialización XOR DEBE emitirse con \`puede ser\` o \`puede ser uno de\``).

### §1.3 Palabras clave y conectores fijos

| Conector / clave | Significado | Familia(s) | Notas |
| --- | --- | --- | --- |
| si | introduce condición | condición, excepción | — |
| en cuyo caso | introduce consecuencia positiva | condición | — |
| de lo contrario | introduce rama negativa | condición | — |
| de | origen de estado/rango | cambio, rango | — |
| a | destino de estado/rango | cambio, rango | — |
| y / e | conjunción copulativa | enumeraciones AND | `e` ante `i-` / `hi-` |
| o / u | conjunción disyuntiva | enumeraciones OR/XOR | `u` ante `o-` / `ho-` |
| así como | adición heterogénea | exhibición mixta | atributos + operaciones |
| exactamente uno de | operador XOR | abanico XOR | — |
| al menos uno de | operador OR | abanico OR | — |
| al menos otro/a | colección incompleta | agregación/especialización parcial | — |
| un/una opcional | opcionalidad `?` (0..1) | multiplicidad | — |
| al menos un/una | cardinalidad inferior `+` (1..\*) | multiplicidad | — |
| por ruta | etiqueta de ruta | rutas/escenarios | — |
| duración de | magnitud temporal de la fuente | excepción | — |
| excede | sobretiempo | excepción overtime | — |
| es menor que | subtiempo | excepción undertime | — |
| en esa secuencia | orden temporal explícito | descomposición síncrona, tagged ordenado | — |

- **R-VERB-KW-1**: las palabras clave fijas DEBEN emitirse exactamente como aparecen, salvo la alternancia morfofonológica `y/e` y `o/u`.
- **R-VERB-KW-2**: la alternancia `y/e` y `o/u` DEBE decidirse solo por la condición fonética del término siguiente.

Rationale: `reglas §4.3` (R-OPL-KW-1, R-OPL-KW-2) y `opm-opl-es §2` (Palabras Clave Fijas).

### §1.4 Divergencias entre fuentes canónicas

Ambas fuentes son canon; donde difieren, esta spec lo declara explícitamente y resuelve por precedencia (`reglas §4.3` y `opm-opl-es §2` mandan al mismo nivel; donde una amplía a la otra sin contradecirla, se conserva la unión).

- **DIV-1 — Plegado y recomposición**: `reglas §4.3` incluye `se pliega en` (Plegado) y `se recompone desde` (Recomposición); `opm-opl-es §2` NO los lista (cierra en `se refina`). Resolución: ambos verbos PERTENECEN al enum (los aporta `reglas §4.3`, que opera al mismo nivel canónico); quedan marcados GAP-PLIEGA y GAP-RECOMPONE por ausencia de generador.
- **DIV-2 — Designaciones de estado como cópulas**: `opm-opl-es §2` lista `es inicial`, `es final`, `es por defecto`, `es inicial y final` entre las palabras clave; `reglas §4.3` las trata como plantillas D7–D10, no como verbos. Resolución: NO son verbos del enum §1.1; se canonizan como plantillas de designación (D7–D13) en la sección de cosas, no como vocabulario verbal.

Rationale: la unión de ambas tablas canónicas maximiza cobertura sin relajar contratos; las divergencias se declaran, no se silencian.

## §2 Entidades

Esta sección canoniza la realización OPL-ES de cada **constructo de entidad** del modelo: las dos cosas (**objeto**, *proceso*), el `estado`, el par **atributo**/`valor`, la **instancia**, la designación de estado, y las propiedades genéricas **esencia** y **afiliación**. Cada entrada fija la(s) plantilla(s), cuándo se emite, cuándo se suprime, cómo se tokeniza, si es reversible y su traza a código.

Las plantillas de enlace transformador, habilitador, estructural, evento, condición, excepción, invocación, refinamiento, abanico y multiplicidad NO pertenecen a esta sección; se canonizan en secciones posteriores. Aquí solo vive la **descripción de entidades** (`opm-opl-es §3`, `§14`).

Rationale: `opm-opl-es §3` (descripción de entidades) y `reglas §4.4` separan la realización de cosas/estados/atributos de la realización de enlaces; esta spec conserva esa frontera.

### §2.0 Reglas duras transversales

- **R-ENT-1**: una entidad de modelo DEBE ser **objeto** o *proceso*; NO existe tercera clase de cosa. Un `estado`, un enlace, un **atributo** flotante, un comentario o un afordance de UI NO son cosas.

  Rationale: `reglas §2.1` (R-COSA-1) y `§2.5`.

- **R-ENT-2**: la generación NO DEBE emitir OPL canónica para una cosa con nombre **placeholder** (objeto/proceso sin nombrar) ni para un `estado` con nombre placeholder. La realización canónica solo procede cuando la cosa tiene nombre canónico.

  Rationale: `nombresCanonicos.ts` define `esNombreProcesoPlaceholder` y `esNombreEstadoCanonico`; un nombre placeholder no es un hecho de modelo afirmable.

- **R-ENT-3**: cada hecho de clasificación de una cosa (esencia, afiliación, perseverancia) DEBE ir en **oración separada**. NO DEBE colapsarse «**X** es un objeto informacional y sistémico» — no es OPL-ES canónica.

  Correcto: `**Sensor** es física.` seguido de `**Sensor** es ambiental.`
  Incorrecto: `**Sensor** es física y ambiental.`
  Rationale: `estructural.ts·oracionEntidad` emite una línea por hecho; `opm-opl-es §3.1` lista una plantilla (D1–D4) por propiedad.

### §2.1 Objeto

**ID**: ENT-OBJ.

**Plantilla**: el **objeto** se nombra como sustantivo singular en negrita; su mención léxica es el span de objeto dentro de cualquier oración. La descripción autónoma de un **objeto** se realiza mediante sus propiedades genéricas (§2.7, §2.8) y, si tiene estados, su enumeración (§2.3).

**Emisión**: la presencia de un **objeto** en un OPD emite, según `oracionEntidad`, las oraciones de esencia y afiliación que apliquen (ver §2.7–§2.8). Un **objeto** sin propiedades divergentes y sin estados PUEDE no producir oración autónoma alguna; existe en el párrafo solo como span dentro de oraciones de enlace.

**Supresión**: un **objeto** con nombre placeholder NO DEBE producir OPL canónica (R-ENT-2). La supresión se decide por `nombresCanonicos.ts`.

**Tokenización**: el nombre del **objeto** es un token de objeto; su `ref` apunta a la entidad. Las palabras léxicas DEBEN capitalizarse; artículos y preposiciones breves PUEDEN quedar en minúscula.

**Reverse**: el span de objeto se parsea como referencia a una cosa existente o como creación de cosa nueva, según el contexto de la oración. El nombre por sí solo no es oración parseable.

**Roundtrip**: el nombre del **objeto** DEBE preservarse íntegro tras generación → parseo → generación.

**Traza a código**: `app/src/opl/generadores/estructural.ts·oracionEntidad`; supresión de placeholder en `app/src/modelo/nombresCanonicos.ts`.

> GAP-PLACEHOLDER-ENTIDAD: `nombresCanonicos.ts` expone `esNombreProcesoPlaceholder`, pero `refsHints.ts·entidadOplEsEmitible` retorna `true` para toda entidad; la supresión de cosas placeholder en generación (R-ENT-2) NO está conectada hoy.

Rationale: `reglas §2.2` (R-OBJ-1..7) y `opm-opl-es §3`.

### §2.2 Proceso

**ID**: ENT-PROC.

**Plantilla**: el *proceso* se nombra en cursiva, comenzando con infinitivo `-ar`/`-er`/`-ir` o nominalización `-ción`/`-miento`. Su mención léxica es el span de proceso dentro de oraciones de enlace.

**Emisión**: igual que el **objeto**, un *proceso* emite sus oraciones de esencia/afiliación divergentes (§2.7–§2.8) y aparece como span en oraciones de transformación, habilitación, evento, condición, refinamiento e invocación. **OPM no admite estados de proceso**; «iniciado»/«en proceso»/«terminado» NO DEBEN modelarse como estados, sino como subprocesos.

**Supresión**: un *proceso* con nombre placeholder (`proceso`, `proceso N`, `proceso parte N`) NO DEBE producir OPL canónica (R-ENT-2).

**Tokenización**: el nombre del *proceso* es un token de proceso con `ref` a la entidad.

**Reverse**: el span de proceso se parsea como referencia o creación de *proceso* según contexto.

**Roundtrip**: el nombre del *proceso* DEBE preservarse íntegro.

**Edge cases**: un *proceso* persistente (mantiene estado sin cambio neto) NO tiene familia verbal propia; su realización canónica reusa TS3 con `estado-entrada = estado-salida` (remite a la sección de enlaces transformadores y a `opm-opl-es §3.4`).

**Traza a código**: span/clasificación en `app/src/opl/generadores/estructural.ts·oracionEntidad`; supresión en `app/src/modelo/nombresCanonicos.ts·esNombreProcesoPlaceholder` (ver GAP-PLACEHOLDER-ENTIDAD).

Rationale: `reglas §2.3` (R-PROC-1..7) y `§2.4` (nombres), `opm-opl-es §3.4`.

### §2.3 Estado y enumeración de estados

**ID**: ENT-EST (enumeración: D5, D6).

**Plantilla**:
- D5: `**Objeto** puede estar \`estado1\`, \`estado2\` o \`estado3\`.`
- D6 (colección incompleta): `**Objeto** puede estar \`estado1\`, …, y otros estados.`

**Emisión**: cuando un **objeto** tiene `s ≥ 1` estados no suprimidos y todos son canónicos, se emite una sola oración de enumeración con `puede estar`. El último estado se une con `o`/`u` según fonética.

**Supresión**: si algún estado del objeto NO es canónico (placeholder), la enumeración NO se emite; la emisión es atómica (todo-o-nada por objeto). Un estado individual marcado `suprimido` se excluye del listado.

**Tokenización**: el span del objeto lleva `ref` a la entidad; cada `estado` lleva `ref` al estado. Los valores de estado van entre backticks, en minúscula, forma pasiva/descriptiva.

**Reglas duras**:
- **R-ENT-EST-1**: la enumeración de estados DEBE usar **puede estar**, NUNCA **puede ser** (remite a §1.2 R-VERB-EST-1).

  Correcto: `**Pedido** puede estar \`pendiente\`, \`despachado\` o \`cerrado\`.`
  Incorrecto: `**Pedido** puede ser \`pendiente\`, \`despachado\` o \`cerrado\`.`
- **R-ENT-EST-2**: un `estado` NO existe fuera de su **objeto** propietario; NO DEBE haber estados flotantes ni estados de *proceso*.

**Reverse**: la oración `puede estar` se parsea como declaración de estados del objeto (reversible).

**Roundtrip**: la lista de estados y su orden DEBEN preservarse; `roundtrip.test.ts` defiende la enumeración.

**Traza a código**: `app/src/opl/generadores/duracionMetadata.ts·oracionEstados` (`puede estar`), re-exportado por `app/src/opl/generadores/designaciones.ts`; canonicidad de nombre de estado en `app/src/modelo/nombresCanonicos.ts·esNombreEstadoCanonico`.

Rationale: `reglas §4.4` (D5, D6), `§2.6` (R-EST-1) y `opm-opl-es §3.2`.

### §2.4 Designación de estado

**ID**: ENT-DESIG (D7–D10, D13).

**Plantilla**: `Estado \`s\` de **Objeto** es <designación>.`, con designación ∈ {`inicial` (D7), `final` (D8), `por defecto` (D9), `inicial y final` (D10), `declarado \`Current\`` (D13)}.

**Emisión**: se emite una oración de designación por cada `estado` con designación distinta de normal. Un `estado` PUEDE ser simultáneamente inicial y final (D10); en ese caso se emite una sola oración combinada, no dos.

**Supresión**: un `estado` sin designación (normal) NO produce oración de designación. Un `estado` placeholder no la produce.

**Tokenización**: el span `s` lleva `ref` al estado; el span del objeto lleva `ref` a la entidad. `inicial`/`final`/`por defecto`/`declarado Current` son palabras clave fijas de designación, no verbos del enum §1.1 (ver DIV-2).

**Reverse**: la oración de designación se parsea como asignación de designación al estado.

**Roundtrip**: la designación DEBE preservarse.

**Traza a código**: `app/src/opl/generadores/designaciones.ts·oracionDesignacionEstado` y `textoDesignacionEstado`.

Rationale: `reglas §4.4` (D7–D10, D13), `§2.6` (R-EST-2..4) y `opm-opl-es §3.3`.

### §2.5 Atributo y valor

**ID**: ENT-ATR.

**Plantillas** (`opm-opl-es §14`):
- Valor puntual: `**Atributo** de **Objeto** es valor.`
- Rango: `**Atributo** de **Objeto** varía de X a Y.`
- Enumeración de valores: `**Atributo** de **Objeto** puede estar \`valor1\`, \`valor2\` o \`valor3\`.`

**Emisión**: cuando un **objeto** caracteriza un **atributo** (vía exhibición-caracterización), el **atributo** se realiza como cosa-objeto que pertenece al **objeto** mediante `de`. Si el **atributo** porta un `valorSlot`, se emite la oración `es valor` (con unidad opcional `[unidad]`). Los `valor` enumerados son **estados** del **atributo**, por lo que reusan la plantilla `puede estar` (§2.3).

**Reglas duras**:
- **R-ENT-ATR-1**: un **atributo** DEBE modelarse como **objeto** que caracteriza una cosa vía exhibición-caracterización; NO existe atributo flotante.

  Rationale: `reglas §4.13` (R-ATR-1) y `glosario 3.4`.
- **R-ENT-ATR-2**: los **valores** de un **atributo** DEBEN modelarse como **estados** del atributo, y por tanto enumerarse con **puede estar**, no con **puede ser**.

  Correcto: `**Limpieza** de **Conjunto de Platos** puede estar \`sucia\` o \`limpia\`.`
  Incorrecto: `**Limpieza** de **Conjunto de Platos** puede ser \`sucia\` o \`limpia\`.`
  Rationale: `reglas §4.13` (R-ATR-2) y `opm-opl-es §14`.

**Supresión**: un **atributo** sin `valorSlot` no produce la oración `es valor`; un **atributo** placeholder no produce OPL canónica.

**Tokenización**: spans `ref` al atributo, al objeto caracterizado y a cada `valor`/`estado`. La unidad opcional es un span con `hint` de presentación, no un hecho ontológico nuevo.

**Reverse**: la oración `es valor` se parsea como asignación de valor al atributo; la enumeración de valores reusa el parseo de `puede estar`.

**Roundtrip**: atributo, valor y unidad DEBEN preservarse.

**Traza a código**: `app/src/opl/generadores/estructural.ts·oracionValorAtributo` (`es valor`, unidad). El enlace de exhibición-caracterización (`exhibe`) y la plantilla de rango (`varía de … a`) se canonizan en la sección de enlaces estructurales; `varía de … a` no tiene generador hoy (GAP-VARIA, declarado en §1.1).

Rationale: `reglas §4.13` (R-ATR-1, R-ATR-2) y `opm-opl-es §14`.

### §2.6 Instancia

**ID**: ENT-INS.

**Plantilla** (clasificación-instanciación, realización autónoma de la instancia): el nombre de una instancia lógica DEBE escribirse `NombreInstancia : NombreClase`. La oración de relación (`es una instancia de`) se canoniza en la sección de enlaces estructurales.

**Emisión**: una **instancia** lógica se realiza como cosa con nombre `Instancia : Clase`; la relación con su clase se emite vía `es una instancia de` / `son instancias de`.

**Reglas duras**:
- **R-ENT-INS-1**: DEBE distinguirse **instancia visual** (misma cosa con apariencia local en otro OPD) de **instancia lógica** (relación de clasificación-instanciación entre cosas distintas). La instancia visual NO produce oración de instanciación; solo reaparece como span de la misma cosa.

  Rationale: `reglas §2.7` (R-INS-2).

**Supresión**: una instancia visual NO emite oración propia de instanciación (la cosa ya se realizó en su OPD origen, por R-PRIN-9 / hecho único).

**Tokenización**: el span `NombreInstancia` y el span `NombreClase` llevan `ref` a sus respectivas cosas.

**Reverse**: la relación `es una instancia de` se parsea como enlace de clasificación.

**Traza a código**: `app/src/opl/generadores/estructural.ts·oracionEnlaceEstructural` (caso `clasificacion`: `es una instancia de` / `son instancias de`). El formato de nombre `Instancia : Clase` es designación nominal; no hay generador dedicado que lo componga automáticamente (GAP-NOMBRE-INSTANCIA).

Rationale: `reglas §2.7` (R-INS-1..6) y `opm-opl-es §3`.

### §2.7 Esencia (física / informática)

**ID**: ENT-ESENCIA (D1, D2).

**Plantillas**: `**Cosa** es física.` (D1) · `**Cosa** es informacional.` (D2).

**Emisión**: `oracionEntidad` emite la oración de esencia cuando la visibilidad es `siempre`, o cuando la esencia **difiere del default** (informacional). Una cosa informacional con visibilidad por divergencia NO emite oración de esencia (el default se sobreentiende).

**Supresión**: con visibilidad `oculta`, NO se emite oración alguna de clasificación. El default informacional puede derivarse de perfil/preset, pero ese default NO DEBE sobrescribir esencia explícita.

**Tokenización**: el span de la cosa lleva `ref`; `física`/`informacional` son palabras clave fijas de designación.

**Reverse**: la oración de esencia se parsea como asignación de propiedad genérica.

**Roundtrip**: la esencia DEBE preservarse.

**Traza a código**: `app/src/opl/generadores/estructural.ts·oracionEntidad` (vía `textoEsencia` de `refsHints.ts`).

Rationale: `reglas §2.2` (R-OBJ-3, R-OBJ-5..6), `§4.4` (D1, D2) y `opm-opl-es §3.1`.

### §2.8 Afiliación (sistémica / ambiental)

**ID**: ENT-AFILIA (D3, D4).

**Plantillas**: `**Cosa** es ambiental.` (D3) · `**Cosa** es sistémica.` (D4).

**Emisión**: `oracionEntidad` emite la oración de afiliación cuando la visibilidad es `siempre`, o cuando la afiliación **difiere del default** (sistémica).

**Supresión**: con visibilidad `oculta` no se emite. Un atributo de objeto ambiental DEBE ser ambiental; un *proceso* ejecutado por cosa ambiental DEBE modelarse ambiental.

**Tokenización**: span de la cosa con `ref`; `ambiental`/`sistémica` son palabras clave fijas de designación.

**Reverse**: la oración de afiliación se parsea como asignación de propiedad genérica.

**Roundtrip**: la afiliación DEBE preservarse.

**Edge cases**: esencia y afiliación se emiten en **oraciones separadas** (R-ENT-3); nunca se coordinan en una sola frase.

**Traza a código**: `app/src/opl/generadores/estructural.ts·oracionEntidad` (vía `textoAfiliacion` de `refsHints.ts`).

Rationale: `reglas §2.2` (R-OBJ-3, R-OBJ-6..7), `§4.4` (D3, D4) y `opm-opl-es §3.1`.

## §3 Enlaces transformadores

Esta sección canoniza la realización OPL-ES de los enlaces **transformadores**: las tres formas básicas **consumo** (T1), **resultado** (T2) y **efecto** (T3), más las formas de efecto con estado especificado **TS3** (entrada-salida), **TS4** (solo entrada) y **TS5** (solo salida). El consumo y resultado con estado (TS1, TS2) se realizan con el sufijo `en \`estado\`` sobre T1/T2 y se tratan dentro de §3.1 y §3.2.

Un enlace transformador conecta un *proceso* con un **objeto** transformado; su firma fija quién es origen y quién destino del span en la oración. La generación NO DEBE emitir un verbo transformador fuera de {`consume`, `genera`, `afecta`, `cambia … de … a`}; el parseo NO DEBE reconocer otro verbo como transformador.

Rationale: `reglas §4.5` (T1–TS5), `§5.2` (R-CONS/R-RES/R-EFE) y `opm-opl-es §4`.

### §3.0 Asimetría consumo / resultado bajo modificadores

- **R-TR-ASIM-1**: el **consumo** (T1, TS1) PUEDE portar modificador de evento (`e`) o condición (`c`) porque el consumido pertenece a Pre(P).

- **R-TR-ASIM-2**: el **resultado** (T2, TS2) NO DEBE portar modificador de evento ni de condición; el resultante pertenece a Post(P) y no existe antes del proceso, luego no puede ser disparador ni precondición.

  Correcto: `**Disparador** inicia *Procesar*, que consume **Disparador**.`
  Incorrecto: `**Resultado** inicia *Procesar*, que genera **Resultado**.`
  Rationale: `reglas §6.3` (R-MOD-1, R-MOD-3, R-MOD-4) y `SSOT-iso §Enlaces transformadores`; Post(P) NO admite `e`/`c`.

- **R-TR-ASIM-3**: el **efecto** (T3, TS3) sobre un **objeto** con estados PUEDE portar `e` o `c` porque el afectado existe en Pre(P) con su estado de entrada (ET2, CT2).

- **R-TR-ASIM-4**: el generador NO DEBE producir una oración de evento/condición de resultado y el parser NO DEBE construir un enlace de resultado con modificador `e`/`c`; tal entrada es OPL no canónica.

  Rationale: `reglas §6.3` (R-MOD-5: la matriz de fuerza semántica no contiene evento/condición de resultado).

### §3.1 Consumo (T1, TS1)

**ID**: T1 (básico), TS1 (con estado).

**Plantilla(s)**:
- T1: `*Proceso* consume **Objeto**.`
- TS1: `*Proceso* consume **Objeto** en \`estado\`.`
- Plural por multiplicidad: `*Proceso* consumen **Objetos**.` (verbo concuerda con el sujeto-proceso múltiple).

**Emisión**: un enlace de tipo `consumo` entre *proceso* (destino del enlace) y **objeto** (origen) emite la oración con `consume`, sujeto = *proceso*, objeto directo = **objeto** consumido. Con estado especificado en el extremo del consumido (TS1) se añade `en \`estado\``.

**Supresión**: si *proceso* u **objeto** tienen nombre placeholder, NO se emite (R-ENT-2). Un consumo bajo abanico XOR/OR se realiza con la oración de abanico, no como T1 individual.

**Tokenización**: span de *proceso* con `ref` al proceso; `consume` token-verbo del enum §1.1; span de **objeto** con `ref` al objeto consumido; `estado` entre backticks con `ref` al estado (TS1).

**Orden**: *proceso* → `consume` → **objeto** [→ `en` → `estado`]. El sujeto es el *proceso* (a diferencia del resultado, donde el sujeto es el proceso pero el orden lo emite con el objeto como complemento). El consumo se interpreta inmediato salvo declaración simultánea de tasa de consumo en el enlace y atributo de cantidad en el objeto.

**Composabilidad**: participa en coordinación de predicados con sujeto compartido (preludio §9): varias oraciones `*P* consume **A**.` / `*P* consume **B**.` con el mismo *proceso* sujeto son candidatas a coordinación copulativa. La coordinación NO DEBE mezclar consumo con resultado/efecto en un solo predicado.

**Reverse**: el parser, vía `ABANICO_VERBO_RE_LIST` (`/^(.+?)\s+consume\s+(.+)$/`, `tipo: "consumo"`, `puertoEsOrigen: false`), construye un enlace `consumo` con el **objeto** como origen y el *proceso* como destino; con `en \`estado\`` fija el estado especificado del extremo consumido.

**Roundtrip**: fixture `enlace-consumo-simple` (`fixtures-roundtrip.ts`), bisimetría estricta, oración `*Procesar* consume **Entrada**.`. El nombre del objeto, el verbo y el estado (TS1) DEBEN preservarse.

**Edge cases**: forma pasiva legacy `**Objeto** es consumido por *Proceso*` (`ABANICO_VERBO_RE_LIST`, `puertoEsOrigen: true`) es entrada parseable válida pero NO es la forma canónica emitida; el generador siempre emite la activa.

**Traza a código**: generación `app/src/opl/generadores/procedural.ts·oracionEnlaceSinEtiqueta` (caso `consumo`, línea ~199); parseo `app/src/opl/parser/parsear.ts·ABANICO_VERBO_RE_LIST` (entrada `consume`).

Rationale: `reglas §4.5` (T1, TS1), `§5.2` (R-CONS-1..3) y `opm-opl-es §4.1`, `§4.2`.

### §3.2 Resultado (T2, TS2)

**ID**: T2 (básico), TS2 (con estado).

**Plantilla(s)**:
- T2: `*Proceso* genera **Objeto**.`
- TS2: `*Proceso* genera **Objeto** en \`estado\`.`
- Plural por multiplicidad: `*Procesos* generan **Objeto**.`

**Emisión**: un enlace de tipo `resultado` entre *proceso* (origen del enlace) y **objeto** (destino) emite la oración con `genera`, sujeto = *proceso*. Con estado especificado en el extremo del resultante (TS2) se añade `en \`estado\``.

**Supresión**: placeholder NO emite (R-ENT-2). Un enlace de resultado hacia un **objeto** con estado inicial NUNCA DEBE conectarse directamente al estado inicial (R-RES-1); la emisión refleja la conexión al rectángulo o a un estado distinto del inicial.

**Tokenización**: span de *proceso* con `ref`; `genera` token-verbo; span de **objeto** con `ref`; `estado` con backticks y `ref` (TS2).

**Orden**: *proceso* → `genera` → **objeto** [→ `en` → `estado`].

**Composabilidad**: participa en coordinación con sujeto-proceso compartido (preludio §9): `*P* genera **A**.` / `*P* genera **B**.` son coordinables. NO DEBE coordinarse con consumo/efecto en un predicado.

**Reverse**: parser vía `ABANICO_VERBO_RE_LIST` (`/^(.+?)\s+genera\s+(.+)$/`, `tipo: "resultado"`, `puertoEsOrigen: true`): el *proceso* es origen, el **objeto** destino. El resultado NO DEBE parsearse con modificador `e`/`c` (R-TR-ASIM-2, R-TR-ASIM-4).

**Roundtrip**: fixture `enlace-resultado-simple` (`fixtures-roundtrip.ts`), bisimetría estricta, oración `*Procesar* genera **Salida**.`.

**Edge cases**: forma pasiva legacy `**Objeto** es generado por *Proceso*` parseable (`puertoEsOrigen: false`), no canónica como emisión.

**Traza a código**: generación `app/src/opl/generadores/procedural.ts·oracionEnlaceSinEtiqueta` (caso `resultado`, línea ~201); parseo `app/src/opl/parser/parsear.ts·ABANICO_VERBO_RE_LIST` (entrada `genera`).

Rationale: `reglas §4.5` (T2, TS2), `§5.2` (R-RES-1) y `opm-opl-es §4.1`, `§4.2`.

### §3.3 Efecto (T3)

**ID**: T3.

**Plantilla(s)**:
- T3: `*Proceso* afecta **Objeto**.`
- Plural por multiplicidad: `*Procesos* afectan **Objeto**.`

**Emisión**: un enlace de tipo `efecto` sin estado especificado en ningún extremo emite `afecta`, con el *proceso* como sujeto. El efecto REQUIERE un **objeto** con al menos un estado definido (R-EFE-1); aunque la oración T3 no nombre estados, el modelo subyacente sí los tiene. Una vez iniciado el proceso afector, el afectado DEBE salir del estado de entrada (R-EFE-2) y solo alcanza el de salida al completarse (R-EFE-2A).

**Supresión**: placeholder NO emite. Si el efecto porta estados especificados, NO se emite T3 sino TS3/TS4/TS5 (§3.4–§3.6).

**Tokenización**: span de *proceso* con `ref`; `afecta` token-verbo; span de **objeto** con `ref`.

**Orden**: *proceso* → `afecta` → **objeto**.

**Composabilidad**: coordinable por sujeto-proceso compartido (preludio §9); NO DEBE coordinarse con consumo/resultado.

**Reverse**: parser vía `ABANICO_VERBO_RE_LIST` (`/^(.+?)\s+afecta\s+(.+)$/`, `tipo: "efecto"`, `puertoEsOrigen: true`): *proceso* origen, **objeto** destino.

**Roundtrip**: cubierto por el roundtrip de efecto; el verbo y los nombres DEBEN preservarse. GAP-FIXTURE-EFECTO: no hay fixture dedicado de efecto básico en `fixtures-roundtrip.ts` (los fixtures cubren consumo, resultado e instrumento); la simetría de `afecta` se apoya solo en la tabla de parseo y el generador.

**Edge cases**: un *proceso* persistente (mantiene estado sin cambio neto) reusa la realización TS3 con `estado-entrada = estado-salida` (R-OPL-PERSIST-2), no T3.

**Traza a código**: generación `app/src/opl/generadores/procedural.ts·oracionEfecto` (caso sin estados, línea ~387); parseo `app/src/opl/parser/parsear.ts·ABANICO_VERBO_RE_LIST` (entrada `afecta`).

Rationale: `reglas §4.5` (T3), `§5.2` (R-EFE-1, R-EFE-2, R-EFE-2A, R-EFE-2B) y `opm-opl-es §4.1`.

### §3.4 Efecto entrada-salida (TS3)

**ID**: TS3 (cambio de estado).

**Plantilla(s)**:
- TS3: `*Proceso* cambia **Objeto** de \`estado-entrada\` a \`estado-salida\`.`
- Variante evento: `**Objeto** en \`estado-entrada\` inicia *Proceso*, que cambia **Objeto** de \`estado-entrada\` a \`estado-salida\`.`
- Variante condición: `*Proceso* ocurre si **Objeto** está en \`estado-entrada\`, en cuyo caso *Proceso* cambia **Objeto** de \`estado-entrada\` a \`estado-salida\`, de lo contrario *Proceso* se omite.`
- Variante negada: `*Proceso* no cambia **Objeto** de \`estado-entrada\` a \`estado-salida\`.`

**Emisión**: un efecto con estado especificado tanto en entrada como en salida emite el verbo compuesto `cambia … de … a`. El modificador `e`/`c` reescribe la superficie según las variantes (admisible por R-TR-ASIM-3: el afectado está en Pre(P)).

**Supresión**: placeholder NO emite. Bajo abanico XOR/OR de estados de destino se emite la oración de abanico (`cambia … a exactamente uno de …`), no TS3 individual.

**Tokenización**: span de *proceso* con `ref`; `cambia` + `de` + `a` tokens fijos; span de **objeto** con `ref`; `estado-entrada` y `estado-salida` entre backticks, cada uno con `ref` a su estado.

**Orden**: *proceso* → `cambia` → **objeto** → `de` → `estado-entrada` → `a` → `estado-salida`. El orden `de … a` es fijo y portador de dirección; invertirlo cambia el hecho.

**Composabilidad**: TS3 NO DEBE coordinarse en un predicado con consumo/resultado; un fan de estados de salida sobre el mismo objeto se realiza vía abanico, no por coordinación copulativa.

**Reverse**: el parseo de cambio de estado completo (`/^(.+?)\s+cambia\s+(.+?)\s+de\s+\`?([^\`]+?)\`?\s+a\s+\`?([^\`]+?)\`?$/`, contexto condición/CS2 en `parsear.ts`) construye un enlace `efecto` con ambos estados especificados. El abanico de cambio se parsea por `ABANICO_CAMBIA_RE`.

**Roundtrip**: el *proceso*, el **objeto** y ambos estados DEBEN preservarse, igual que su orden. GAP-FIXTURE-TS3: no hay fixture dedicado de cambio de estado en `fixtures-roundtrip.ts`.

**Edge cases**: si el modelo se descompone, TS3 se escinde en TS4+TS5 (§3.5, §3.6) y deja de emitirse como una sola oración.

**Traza a código**: generación `app/src/opl/generadores/procedural.ts·oracionTransicionEstados` (líneas ~141–147, variantes evento/condición/negada/base); parseo `app/src/opl/parser/parsear.ts` (regex de cambio en contexto condición/CS2, línea ~621; abanico `ABANICO_CAMBIA_RE`, línea ~298).

Rationale: `reglas §4.5` (TS3), `§5.2` (R-EFE-2..2B), `§6.3` (R-TR-ASIM-3) y `opm-opl-es §4.2`.

### §3.5 Efecto escindido / parcial — solo entrada (TS4)

**ID**: TS4.

**Plantilla**: `*Proceso* cambia **Objeto** de \`estado-entrada\`.`

**Doble régimen** (R-ESCIND-0; misma superficie, distinta procedencia):
- **(a) fragmento escindido**: mitad temprana de un par acoplado producido al descomponer un TS3; saca al **objeto** del `estado-entrada`. Solo tiene sentido junto a su TS5 tardío. NO DEBE portar modificador de control (R-ESC-1). NUNCA se origina por parseo de OPL aislado: solo por la operación de descomposición, y persiste con metadato de procedencia.
- **(b) efecto parcial standalone**: enlace de efecto completo cuya salida, si no se especifica, se resuelve al estado por defecto del objeto o, en su ausencia, a la distribución de probabilidad de estados (R-EFE-3). Admite evento/condición (ETS3, ETS4).

**Emisión**: efecto con estado especificado solo en el extremo de entrada (origen) emite `cambia … de \`estado\`` sin destino.

**Supresión**: el fragmento escindido (a) NO DEBE emitirse con modificadores de control.

**Tokenización**: span de *proceso*; `cambia` + `de` tokens; span de **objeto**; `estado-entrada` con backticks y `ref`.

**Orden**: *proceso* → `cambia` → **objeto** → `de` → `estado-entrada`.

**Composabilidad**: el fragmento escindido (a) DEBE acoplarse con su TS5; no se coordina como predicado independiente.

**Reverse**: el parser produce el régimen **(b)** efecto parcial standalone; el régimen (a) NUNCA proviene de parseo (R-ESCIND-0). GAP-PARSE-TS4: no se verificó una regex dedicada de `cambia … de \`estado\`` sin `a` en `parsear.ts` (la rama de cambio detectada exige `… a …`); el parseo de TS4 standalone podría depender de la ruta de abanico o no estar conectado — marcar como GAP de cobertura de parseo.

**Roundtrip**: GAP-FIXTURE-TS4: sin fixture dedicado.

**Traza a código**: generación `app/src/opl/generadores/procedural.ts·oracionEfecto` (rama `estadoOrigen && destino.tipo === "proceso"`, línea ~374: `cambia … de \`…\``). Escisión: `app/src/modelo/` (operación de descomposición; el metadato de procedencia escindido no se rastreó en este pase) — GAP-PROCEDENCIA-ESCIND.

Rationale: `reglas §4.5` (TS4), `§8.4` (R-ESCIND-0..3, R-ESC-1), `§5.2` (R-EFE-3) y `opm-opl-es §4.2`.

### §3.6 Efecto escindido / parcial — solo salida (TS5)

**ID**: TS5.

**Plantilla**: `*Proceso* cambia **Objeto** a \`estado-salida\`.`

**Régimen**: mitad tardía del par escindido (R-ESCIND-3): pone al **objeto** en el `estado-salida`. Como fragmento escindido NO DEBE portar modificador de control (R-ESC-1). Como efecto parcial standalone solo-salida es válido y PUEDE portar evento/condición.

**Emisión**: efecto con estado especificado solo en el extremo de salida (destino) emite `cambia … a \`estado\`` sin origen de estado.

**Supresión**: fragmento escindido NO DEBE emitirse con modificador de control.

**Tokenización**: span de *proceso*; `cambia` + `a` tokens; span de **objeto**; `estado-salida` con backticks y `ref`.

**Orden**: *proceso* → `cambia` → **objeto** → `a` → `estado-salida`. El token `a` (no `de`) marca el régimen solo-salida; la asimetría con TS4 es portadora del hecho.

**Composabilidad**: como fragmento escindido DEBE acoplarse con su TS4 temprano.

**Reverse**: GAP-PARSE-TS5: análogo a TS4, no se verificó regex dedicada de `cambia … a \`estado\`` sin `de` fuera de la ruta de abanico (`ABANICO_CAMBIA_RE` cubre `… a exactamente uno de …`, no el caso de un único estado de salida). Marcar como GAP de cobertura de parseo.

**Roundtrip**: GAP-FIXTURE-TS5: sin fixture dedicado.

**Traza a código**: generación `app/src/opl/generadores/procedural.ts·oracionEfecto` (rama `estadoDestino && origen.tipo === "proceso"`, línea ~377: `cambia … a \`…\``). Escisión: ver GAP-PROCEDENCIA-ESCIND (§3.5).

Rationale: `reglas §4.5` (TS5), `§8.4` (R-ESCIND-0, R-ESCIND-3, R-ESC-1) y `opm-opl-es §4.2`.

## §4 Enlaces habilitadores

Esta sección canoniza la realización OPL-ES de los enlaces **habilitadores**: **agente** (H1) e **instrumento** (H2), y sus variantes con estado especificado **HS1** (agente en estado) y **HS2** (instrumento en estado). Un enlace habilitador conecta un **objeto** (origen) con un *proceso* (destino): el habilitador DEBE estar presente para que el *proceso* se ejecute, pero NO se transforma. La generación NO DEBE emitir un verbo habilitador fuera de {`maneja`, `requiere`}; el parseo NO DEBE reconocer otro verbo como habilitador.

Rationale: `reglas §4.6` (H1, H2, HS1, HS2), `§5.3` (R-AG-1..4) y `opm-opl-es §5`.

### §4.0 Reglas duras transversales — agente vs instrumento

La distinción agente/instrumento es **ontológica**, no estilística: fija qué clase de cosa habilita y qué decoración porta el enlace.

- **R-HAB-AG-1**: el enlace de **agente** y el término "agente" DEBEN reservarse EXCLUSIVAMENTE para humanos o grupos de humanos. Un **agente** modifica el *qué* del proceso (aporta juicio, decisión, intención).

  Rationale: `reglas §5.3` (R-AG-1), `glosario 3.3`; piruleta NEGRA en el extremo proceso.

- **R-HAB-AG-2**: robots, agentes de software, IA y máquinas DEBEN modelarse como **instrumento**, NUNCA como agente, en el OPD/OPL canónico. Una descripción textual externa PUEDE llamar "agente" a un software, pero la realización canónica DEBE clasificarlo como instrumento.

  Correcto: `*Procesar* requiere **Modelo de Lenguaje**.`
  Incorrecto: `**Modelo de Lenguaje** maneja *Procesar*.`
  Rationale: `reglas §5.3` (R-AG-1A, R-AG-1B); piruleta BLANCA en el extremo proceso.

- **R-HAB-AG-3**: un **instrumento** NO se consume ni cambia de estado por el *proceso* que habilita; DEBE estar presente durante toda la ejecución. Si un habilitador deja de existir durante la ejecución, el *proceso* DEBE detenerse y el estado del afectado queda indeterminado.

  Rationale: `reglas §5.3` (R-AG-2); el habilitador pertenece a la pre-condición persistente, no a Pre(P)∖Post(P).

- **R-HAB-AG-4**: cuando el desgaste, degradación o amortización del **instrumento** es relevante al alcance, el instrumento DEBE reclasificarse como afectado (deja de ser habilitador y pasa a enlace de efecto). En ese caso el modelo DEBERÍA agregar atributo de degradación y *proceso* de mantenimiento separado; si el mantenimiento queda fuera del alcance, el modelo DEBE declarar esa exclusión.

  Rationale: `reglas §5.3` (R-AG-3, R-AG-4); reclasificación por desgaste.

- **R-HAB-AG-5**: un **objeto** y un *proceso* DEBEN conectarse por a lo más un enlace procedimental. Ante colisión de roles, el enlace transformador (consumo/resultado/efecto) tiene mayor fuerza semántica que el habilitador. Un mismo **objeto** NO DEBE ser simultáneamente habilitador y transformado del mismo *proceso* en el mismo nivel.

  Rationale: `reglas §6.3` (matriz de fuerza semántica); unicidad de enlace procedimental.

### §4.1 Agente (H1, HS1)

**ID**: H1 (básico), HS1 (con estado).

**Plantilla(s)**:
- H1: `**Agente** maneja *Proceso*.`
- HS1: `**Agente** en \`estado\` maneja *Proceso*.`
- Plural por multiplicidad: `**Agentes** manejan *Proceso*.` (verbo concuerda con el sujeto-agente múltiple).
- Variante evento (EH1, remite a §6): `**Agente** inicia y maneja *Proceso*.`
- Variante condición (CH1/CS5, remite a §7): `**Agente** maneja *Proceso* si **Agente** existe, de lo contrario *Proceso* se omite.` · `**Agente** maneja *Proceso* si **Agente** está en \`estado\`, de lo contrario *Proceso* se omite.`
- Variante negada: `**Agente** no maneja *Proceso*.`

**Emisión**: un enlace de tipo `agente` entre **objeto** humano (origen del enlace) y *proceso* (destino) emite la oración con `maneja`, sujeto = **agente**, complemento = *proceso*. Con estado especificado en el extremo del agente (HS1) se añade `en \`estado\`` tras el **objeto**.

**Supresión**: si **agente** o *proceso* tienen nombre placeholder, NO se emite (R-ENT-2). Un agente bajo abanico XOR/OR se realiza con la oración de abanico (`maneja exactamente uno de …` / fan inverso), no como H1 individual.

**Tokenización**: span de **agente** con `ref` al objeto; `maneja`/`manejan` token-verbo del enum §1.1; span de *proceso* con `ref` al proceso; `estado` entre backticks con `ref` al estado (HS1).

**Orden**: **agente** [→ `en` → `estado`] → `maneja` → *proceso*. El **agente** es el sujeto y precede al verbo (a diferencia del instrumento, donde el sujeto es el *proceso*). El orden es portador de rol: invertirlo convierte el agente en complemento.

**Composabilidad**: participa en coordinación de habilitadores con *proceso* compartido (preludio §9): varias oraciones `**A** maneja *P*.` / `**B** maneja *P*.` con el mismo *proceso* son candidatas a coordinación. La coordinación de habilitadores NO DEBE mezclar agente con instrumento en un solo predicado (verbos distintos, sujetos distintos: agente=sujeto, instrumento=complemento). Un fan de agentes sobre el mismo proceso bajo operador lógico se realiza vía abanico, no por coordinación copulativa.

**Reverse**: el parser, vía `ABANICO_VERBO_RE_LIST` (`/^(.+?)\s+maneja\s+(.+)$/`, `tipo: "agente"`, `puertoEsOrigen: true`), construye un enlace `agente` con el **objeto** como origen y el *proceso* como destino; con `en \`estado\`` fija el estado especificado del extremo agente. La forma condicional se parsea por `CONDICION_AGENTE_RE` (existe / `está en \`estado\``).

**Roundtrip**: fixture `enlace-agente-simple` (`fixtures-roundtrip.ts`), bisimetría estricta, oración `**Operador** maneja *Procesar*.`. El nombre del agente, el verbo y el estado (HS1) DEBEN preservarse.

**Edge cases**: forma pasiva legacy `*Proceso* es manejado por **Agente**` (`ABANICO_VERBO_RE_LIST`, `puertoEsOrigen: false`) es entrada parseable válida pero NO es la forma canónica emitida; el generador siempre emite la activa con el agente como sujeto.

**Traza a código**: generación `app/src/opl/generadores/procedural.ts·oracionEnlaceSinEtiqueta` (caso `agente`, línea ~191-192: `maneja`/`manejan`); estado especificado vía `app/src/opl/generadores/refsHints.ts·nombreOplExtremo` (sufijo `en \`estado\``, línea ~187); evento línea ~264; condición línea ~298-301; negada línea ~342. Parseo `app/src/opl/parser/parsear.ts·ABANICO_VERBO_RE_LIST` (entrada `maneja`, línea ~289) y `CONDICION_AGENTE_RE` (línea ~544).

Rationale: `reglas §4.6` (H1, HS1), `§5.3` (R-AG-1, R-AG-1A, R-AG-1B, R-AG-2) y `opm-opl-es §5`, `§1.9`.

### §4.2 Instrumento (H2, HS2)

**ID**: H2 (básico), HS2 (con estado).

**Plantilla(s)**:
- H2: `*Proceso* requiere **Instrumento**.`
- HS2: `*Proceso* requiere **Instrumento** en \`estado\`.`
- Plural por multiplicidad: `*Procesos* requieren **Instrumento**.` (verbo concuerda con el sujeto-proceso múltiple).
- Variante evento (EH2, remite a §6): `**Instrumento** inicia *Proceso*, que requiere **Instrumento**.`
- Variante condición (CH2/CS6, remite a §7): `*Proceso* ocurre si **Instrumento** existe, de lo contrario *Proceso* se omite.` · `*Proceso* ocurre si **Instrumento** está en \`estado\`, de lo contrario *Proceso* se omite.`
- Variante negada: `*Proceso* no requiere **Instrumento**.`

**Emisión**: un enlace de tipo `instrumento` entre **objeto** no humano (origen del enlace) y *proceso* (destino) emite la oración con `requiere`, sujeto = *proceso*, complemento = **instrumento**. Con estado especificado en el extremo del instrumento (HS2) se añade `en \`estado\`` tras el **objeto**.

**Supresión**: placeholder NO emite (R-ENT-2). Un instrumento bajo abanico XOR/OR se realiza con la oración de abanico (`exactamente uno de … requiere **B**`), no como H2 individual. Si el instrumento se reclasifica por desgaste (R-HAB-AG-4), deja de emitirse como `requiere` y pasa a la familia de efecto (§3.3–§3.6).

**Tokenización**: span de *proceso* con `ref` al proceso; `requiere`/`requieren` token-verbo del enum §1.1; span de **instrumento** con `ref` al objeto; `estado` entre backticks con `ref` al estado (HS2).

**Orden**: *proceso* → `requiere` → **instrumento** [→ `en` → `estado`]. El sujeto es el *proceso* (asimetría con el agente, donde el sujeto es el habilitador); esta asimetría sujeto-verbo es portadora de la distinción humano/no-humano y NO DEBE igualarse.

**Composabilidad**: participa en coordinación de habilitadores con *proceso*-sujeto compartido (preludio §9): varias oraciones `*P* requiere **A**.` / `*P* requiere **B**.` con el mismo *proceso* son candidatas a coordinación copulativa de complementos. La coordinación NO DEBE mezclar instrumento con agente ni con transformadores (verbos distintos, roles distintos). Un fan de instrumentos sobre el mismo proceso bajo operador lógico se realiza vía abanico.

**Reverse**: el parser, vía `ABANICO_VERBO_RE_LIST` (`/^(.+?)\s+requiere\s+(.+)$/`, `tipo: "instrumento"`, `puertoEsOrigen: false`), construye un enlace `instrumento` con el **objeto** como origen y el *proceso* como destino; con `en \`estado\`` fija el estado especificado del extremo instrumento. La forma condicional se parsea por la ruta `CONDICION_OCURRE_RE` con `base: "instrumento"`.

**Roundtrip**: fixture `enlace-instrumento-simple` (`fixtures-roundtrip.ts`), bisimetría estricta, oración `*Procesar* requiere **Herramienta**.`. El nombre del instrumento, el verbo y el estado (HS2) DEBEN preservarse.

**Edge cases**:
- Forma pasiva legacy `**Instrumento** es requerido por *Proceso*` (`ABANICO_VERBO_RE_LIST`, `puertoEsOrigen: true`) es entrada parseable válida pero NO es la forma canónica emitida.
- Forma posesiva: cuando el verbo del instrumento expresa conducción/manejo de la cosa (`manejar`/`conducir`), `oracionInstrumentoPosesiva` PUEDE emitir una superficie alterna (`procedural.ts·oracionInstrumentoPosesiva`, línea ~390); esta es realización condicionada por el verbo léxico, no la canónica `requiere`.

**Traza a código**: generación `app/src/opl/generadores/procedural.ts·oracionEnlaceSinEtiqueta` (caso `instrumento`, línea ~193-196: `requiere`/`requieren`); estado especificado vía `refsHints.ts·nombreOplExtremo` (línea ~187); evento línea ~266; condición línea ~303; negada línea ~344; posesiva línea ~390. Parseo `app/src/opl/parser/parsear.ts·ABANICO_VERBO_RE_LIST` (entrada `requiere`, línea ~286), ruta condición `base: "instrumento"` (línea ~578) y formas plurales `requieren?` (línea ~908).

Rationale: `reglas §4.6` (H2, HS2), `§5.3` (R-AG-2, R-AG-3, R-AG-4) y `opm-opl-es §5`, `§1.9`.

### §4.3 GAPs de cobertura — habilitadores

- GAP-FIXTURE-HS: los fixtures `enlace-agente-simple` y `enlace-instrumento-simple` cubren H1 y H2 básicos; NO hay fixture dedicado de **estado especificado** (HS1/HS2) ni de las variantes evento/condición/negada de habilitador en `fixtures-roundtrip.ts`. La emisión y el parseo HS1/HS2 se apoyan en `nombreOplExtremo` (sufijo `en \`estado\``) y en `ABANICO_VERBO_RE_LIST`, pero la simetría no está sellada por un fixture roundtrip propio.
- GAP-ABANICO-AGENTE-PARSE: el parser reconoce el abanico `exactamente uno de … maneja …` (`parsear.ts` línea ~382), pero el abanico de instrumento (`exactamente uno de … requiere …`) y el fan inverso requieren verificación de cobertura no completada en este pase.
