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

## §5 Modificadores de control

Esta sección canoniza la realización OPL-ES de los **modificadores de control** (evento `e`, condición `c`) sobre enlaces transformadores y habilitadores, y de las dos familias de enlace que el canon trata como autónomas pero coloca junto a los controles por afinidad: **excepción** (sobretiempo `/`, subtiempo `//`) e **invocación** (IV1, IV2). Un modificador NO es una familia de enlace: anota un enlace base preexistente y le agrega semántica de disparo (`e`) o de bypass (`c`) sin alterar el hecho transformador/habilitador subyacente.

Rationale: `reglas §6.1` (R-ECA-1..4, naturaleza de los modificadores), `§6.2`–`§6.3` (lado de aplicación y asimetría), `§4.7`–`§4.9` (plantillas E\*, C\*, EX\*, IV\*) y `opm-opl-es §6`, `§7`, `§8`.

### §5.0 Reglas duras transversales — naturaleza y lado de aplicación

Los modificadores `e` y `c` son **anotaciones INPUT-only**: solo aplican al lado de entrada del proceso (Pre(P)), nunca al de salida (Post(P)).

- **R-MOD-NAT-1**: un modificador `e` o `c` NO DEBE introducirse como cosa ni como enlace nuevo. Anota un enlace base transformador o habilitador y preserva su firma, su verbo y la cardinalidad del constructo. La generación NO DEBE emitir un constructo de control que agregue entidades de modelo.

  Rationale: `reglas §6.1` (R-ECA-4: «un modificador `e` o `c` NO agrega cosa ni enlace»).

- **R-MOD-NAT-2**: la semántica de falla DEBE distinguirse en la superficie. Un enlace con `c` se realiza con la rama `de lo contrario *Proceso* se omite` (bypass: el proceso NO espera). Un enlace SIN modificador NO DEBE emitir esa rama (espera indefinida). El evento `e` se realiza con `inicia` y se pierde tras la evaluación aunque la precondición falle.

  Rationale: `reglas §6.1` (tabla de modificadores: `c` omite, sin control espera, `e` consumido tras evaluación) y `SSOT-metod §10.1`.

- **R-MOD-INPUT-1** (INPUT-only): los modificadores `e`/`c` DEBEN aplicarse exclusivamente sobre enlaces cuyo extremo objeto/estado pertenece a Pre(P) (consumido, afectado pre-transición, agente, instrumento). NO DEBEN aplicarse sobre Post(P) (resultante, afectado post-transición).

  Rationale: `reglas §6.2` (R-MOD-0A, R-MOD-0B) y `§6.3` (R-MOD-4: «Post(P) NO admite evento ni condición»).

- **R-MOD-INPUT-2**: el **resultado** (T2, TS2) NUNCA DEBE portar `e` ni `c`; el resultante no existe antes del proceso, luego no puede ser disparador ni precondición. La generación NO DEBE emitir una oración de evento/condición de resultado y el parser NO DEBE construir un enlace de resultado con modificador.

  Correcto: `**Disparador** inicia *Procesar*, que consume **Disparador**.`
  Incorrecto: `**Resultado** inicia *Procesar*, que genera **Resultado**.`
  Rationale: `reglas §6.3` (R-MOD-1, R-MOD-3, R-MOD-5) y `§3.0` (R-TR-ASIM-2, R-TR-ASIM-4) de esta spec.

- **R-MOD-CAT-1**: un modificador `e`/`c` NO DEBE anotar un enlace **estructural** ni un enlace de **invocación**; ambas son errores de categoría. El control sobre flujo proceso→proceso DEBE expresarse con nodo de decisión booleano, no con `e`/`c` sobre la invocación.

  Rationale: `reglas §6.4` (modificador sobre estructural = AP-09; sobre invocación = AP-10).

- **R-MOD-CAT-2**: un modificador de control NO DEBE anotar un enlace **escindido** (TS4/TS5 como fragmento de un par acoplado); saltar un subproceso de la escisión distorsiona la semántica del efecto.

  Rationale: `reglas §6.4` (`V-41`, `V-110`, `SSOT-metod §7.4`) y `§3.5`–`§3.6` (R-ESC-1) de esta spec.

- **R-MOD-CAT-3**: la combinación `c` + `e` sobre el mismo enlace NO está canonizada; la generación NO DEBE emitirla y el parser NO DEBE construirla.

  Rationale: `reglas §6.4` (`c` + `e` sobre el mismo enlace = no definido en SSOT).

### §5.1 Evento (E\*)

**ID**: ET1 (evento de consumo), ET2 (evento de efecto), EH1 (evento de agente), EH2 (evento de instrumento), ETS1–ETS4 (evento con estado especificado de consumo/cambio), EHS1–EHS2 (evento habilitador con estado).

**Plantilla(s)**:
- ET1 (consumo): `**Objeto** inicia *Proceso*, que consume **Objeto**.`
- ET2 (efecto): `**Objeto** inicia *Proceso*, que afecta **Objeto**.`
- EH1 (agente): `**Agente** inicia y maneja *Proceso*.`
- EH2 (instrumento): `**Instrumento** inicia *Proceso*, que requiere **Instrumento**.`
- ETS1 (consumo en estado): `**Objeto** en \`estado\` inicia *Proceso*, que consume **Objeto**.`
- ETS2 (cambio entrada-salida): `**Objeto** en \`estado-entrada\` inicia *Proceso*, que cambia **Objeto** de \`estado-entrada\` a \`estado-salida\`.`
- ETS3 (solo entrada): `**Objeto** en \`estado-entrada\` inicia *Proceso*, que cambia **Objeto** de \`estado-entrada\`.`
- ETS4 (solo salida): `**Objeto** en cualquier estado inicia *Proceso*, que cambia **Objeto** a \`estado-destino\`.`
- EHS1 (agente en estado): `**Agente** en \`estado\` inicia y maneja *Proceso*.`
- EHS2 (instrumento en estado): `**Instrumento** en \`estado\` inicia *Proceso*, que requiere **Instrumento** en \`estado\`.`

**Emisión**: un enlace transformador (consumo/efecto) o habilitador (agente/instrumento) con modificador `e` emite la oración de evento correspondiente a su tipo. El **objeto**/estado disparador se nombra una vez como sujeto de `inicia` y reaparece en la cláusula relativa que realiza el enlace base. El agente colapsa disparo y habilitación en `inicia y maneja`.

**Supresión**: si origen o destino tienen nombre placeholder, NO se emite (R-ENT-2). Un evento bajo abanico XOR/OR se realiza insertando `inicia` antes del verbo principal en la oración de abanico (`**B** inicia exactamente uno de *P*, *Q* o *R*, que afecta **B**`), no como E\* individual.

**Tokenización**: span del **objeto**/estado disparador con `ref` al extremo Pre(P); `inicia` (e `inicia y maneja` para agente) token-clave de evento; la cláusula relativa reusa los tokens del enlace base (`consume`/`afecta`/`requiere`/`cambia … de … a`); `estado` entre backticks con `ref` (ETS\*, EHS\*). El sufijo de probabilidad (`Pr=p`) es un span con `hint`, no un hecho ontológico nuevo.

**Orden**: disparador → `inicia` [`y maneja` para agente] → *proceso* → (`, que` + verbo base + objeto). El disparador precede al verbo de evento; invertir el orden cambia quién dispara.

**Composabilidad**: múltiples enlaces de evento al mismo *proceso* tienen semántica OR (cualquiera dispara). Un evento NO DEBE coordinarse en un predicado con un enlace sin control del mismo proceso; la rama de evento es estructuralmente distinta.

**Reverse**: la oración de evento se parsea como enlace base con `modificador: "e"`. La forma de consumo con estado (ETS1) y cambio (ETS2) se reconstruye con el estado especificado del extremo Pre(P).

**Roundtrip**: el disparador, el verbo base, el *proceso* y los estados (ETS\*/EHS\*) DEBEN preservarse. GAP-FIXTURE-EVENTO: no hay fixture dedicado de evento en `fixtures-roundtrip.ts`; la simetría se apoya en `oracionEvento` y en la ruta de parseo de eventos.

**Edge cases**:
- El evento de efecto (ET2) sobre un **objeto** con estados es admisible porque el afectado existe en Pre(P) (R-MOD-INPUT-1).
- GAP-EVENTO-RESULTADO: el generador (`procedural.ts·oracionEvento`, caso `resultado`, líneas ~272–276) emite `**X** inicia *Proceso*, que genera **X**`. Esta superficie VIOLA R-MOD-INPUT-2 / R-MOD-1: el resultado NO DEBE portar evento. La emisión actual es OPL no canónica; la spec manda y el generador DEBE corregirse para no producir evento de resultado.
- GAP-EVENTO-INVOCACION: el mismo generador (caso `invocacion`, línea ~283) emite `**X** inicia e invoca *Y*`. Esta superficie VIOLA R-MOD-CAT-1: la invocación es familia autónoma proceso→proceso y NO admite modificador de control. Emisión no canónica; corregir hacia nodo de decisión booleano.

**Traza a código**: generación `app/src/opl/generadores/procedural.ts·oracionEvento` (líneas ~253–287); cambio de estado con evento `oracionTransicionEstados` (línea ~141); despacho del modificador `oracionEnlace` (línea ~178). Parseo `app/src/opl/parser/parsear.ts` (ruta de evento) y `parser.condicionesExcepciones.test.ts`.

Rationale: `reglas §4.7` (ET1–EHS2), `§6.3` (R-MOD-2, asimetría), `§6.5` (niveles 1, 4, 7, 10 de fuerza semántica) y `opm-opl-es §6`.

### §5.2 Condición (C\*)

**ID**: CT1 (condición de consumo), CT2 (condición de efecto), CH1 (condición de agente), CH2 (condición de instrumento), CS1–CS6 (condición con estado especificado).

**Plantilla(s)**:
- CT1 (consumo): `*Proceso* ocurre si **Objeto** existe, en cuyo caso **Objeto** se consume, de lo contrario *Proceso* se omite.`
- CT2 (efecto): `*Proceso* ocurre si **Objeto** existe, en cuyo caso *Proceso* afecta **Objeto**, de lo contrario *Proceso* se omite.`
- CH1 (agente): `**Agente** maneja *Proceso* si **Agente** existe, de lo contrario *Proceso* se omite.`
- CH2 (instrumento): `*Proceso* ocurre si **Instrumento** existe, de lo contrario *Proceso* se omite.`
- CS1 (consumo en estado): `*Proceso* ocurre si **Objeto** está en \`estado\`, en cuyo caso **Objeto** se consume, de lo contrario *Proceso* se omite.`
- CS2 (cambio entrada-salida en estado): `*Proceso* ocurre si **Objeto** está en \`estado-entrada\`, en cuyo caso *Proceso* cambia **Objeto** de \`estado-entrada\` a \`estado-salida\`, de lo contrario *Proceso* se omite.`
- CS3 (cambio solo entrada): `*Proceso* ocurre si **Objeto** está en \`estado-entrada\`, en cuyo caso *Proceso* cambia **Objeto** de \`estado-entrada\`, de lo contrario *Proceso* se omite.`
- CS4 (cambio solo salida): `*Proceso* ocurre si **Objeto** existe, en cuyo caso *Proceso* cambia **Objeto** a \`estado-salida\`, de lo contrario *Proceso* se omite.`
- CS5 (agente en estado): `**Agente** maneja *Proceso* si **Agente** está en \`estado\`, de lo contrario *Proceso* se omite.`
- CS6 (instrumento en estado): `*Proceso* ocurre si **Instrumento** está en \`estado\`, de lo contrario *Proceso* se omite.`

**Estructura de ramas**: una oración de condición DEBE tener una **rama positiva** y una **rama negativa**. La positiva, cuando existe transformación visible, se introduce con `en cuyo caso` y realiza el enlace base (consumo: `**Objeto** se consume`; efecto: `*Proceso* afecta **Objeto**`; cambio: `*Proceso* cambia **Objeto** …`). La negativa se introduce con `de lo contrario` y DEBE ser `*Proceso* se omite` (bypass). El habilitador (CH1/CH2/CS5/CS6) omite la rama positiva porque no transforma: solo afirma la habilitación condicionada y la rama de omisión.

- **R-COND-RAMA-1**: la rama negativa de toda oración de condición DEBE ser `de lo contrario *Proceso* se omite`. NO DEBE expresar espera ni una transformación alterna.

  Rationale: `reglas §6.1` (la condición introduce bypass, el proceso se omite, no espera) y `opm-opl-es §7`.

- **R-COND-RAMA-2**: la rama positiva de consumo DEBE usar la pasiva refleja `se consume` (no `es consumido`); la de efecto y cambio DEBEN usar la voz activa con el *proceso* como sujeto.

  Correcto: `*Procesar* ocurre si **Pedido** existe, en cuyo caso **Pedido** se consume, de lo contrario *Procesar* se omite.`
  Incorrecto: `*Procesar* ocurre si **Pedido** existe, en cuyo caso **Pedido** es consumido, de lo contrario *Procesar* se omite.`
  Rationale: `reglas §4.16` (R-OPL-TRANS-8) y `opm-opl-es §7.1`.

**Emisión**: un enlace transformador (consumo/efecto) o habilitador con modificador `c` emite la oración condicional según su tipo y según si porta estado especificado. Con estado en el extremo Pre(P) se emite la variante CS\* (`está en \`estado\``); sin estado, la variante CT\*/CH\* (`existe`).

**Supresión**: placeholder NO emite (R-ENT-2). Un fan condicional bajo XOR/OR se realiza insertando la cláusula `si … existe/está en estado … de lo contrario … se omite` sobre la oración de abanico, no como C\* individual.

**Tokenización**: span del *proceso* con `ref`; `ocurre si` / `maneja … si` clave de condición; span del extremo Pre(P) con `ref`; `existe` o `está en \`estado\``; `en cuyo caso` (rama positiva, cuando aplica); verbo base + objeto; `de lo contrario` + *proceso* + `se omite`.

**Orden**: para consumo/efecto/instrumento: *proceso* → `ocurre si` → extremo → (`existe` | `está en \`estado\``) → [`en cuyo caso` + transformación] → `de lo contrario` → *proceso* → `se omite`. Para agente: **agente** → `maneja` → *proceso* → `si` → **agente** → (`existe` | `está en \`estado\``) → `de lo contrario` → *proceso* → `se omite`.

**Composabilidad**: múltiples enlaces de condición al mismo *proceso* tienen semántica AND para ejecutar (todas las precondiciones DEBEN cumplirse) y OR para omitir (la ausencia de cualquiera causa el bypass). Una condición NO DEBE coordinarse en un predicado con un enlace sin control.

**Reverse**: la oración condicional se parsea como enlace base con `modificador: "c"`. `parser.condicionesExcepciones.test.ts` cubre CT1 (línea ~94), CT2 (~108), CH2/existencia (~120), CS1 (~143), CS2 con cambio de estado (~157) y CS3/solo-entrada (~171). La forma condicional de agente se reconstruye por `CONDICION_AGENTE_RE`; la de instrumento por `CONDICION_OCURRE_RE` con `base: "instrumento"`.

**Roundtrip**: el *proceso*, el extremo Pre(P), el verbo base, los estados (CS\*) y ambas ramas DEBEN preservarse. La variante alternativa de consumo condicional (`Si **Objeto** existe entonces *Proceso* ocurre y consume **Objeto**, de lo contrario se omite *Proceso*`) DEBE aceptarse en parseo (R-OPL-COND-ALT-1) pero NO DEBE preferirse en emisión: el generador canónico DEBE preferir CT1 (R-OPL-COND-ALT-2).

**Edge cases**:
- La condición de efecto (CT2, CS2–CS4) es admisible porque el afectado existe en Pre(P) (R-MOD-INPUT-1).
- GAP-CONDICION-RESULTADO: el generador (`procedural.ts·oracionCondicion`, caso `resultado`, líneas ~313–316) emite `*Proceso* ocurre si **X** puede generarse, en cuyo caso *Proceso* genera **X**, de lo contrario *Proceso* se omite`. Esta superficie VIOLA R-MOD-INPUT-2 / R-MOD-3: el resultado pertenece a Post(P) y NO admite condición; `puede generarse` no es vocabulario canónico del enum §1.1. Emisión no canónica; la spec manda y el generador DEBE dejar de producir condición de resultado.
- GAP-CONDICION-INVOCACION: el mismo generador (caso `invocacion`, línea ~324) emite `*X* invoca *Y* si *X* ocurre`. VIOLA R-MOD-CAT-1: la invocación no admite modificador de control. Emisión no canónica.

**Traza a código**: generación `app/src/opl/generadores/procedural.ts·oracionCondicion` (líneas ~289–328); cambio de estado condicional `oracionTransicionEstados` (línea ~143); despacho del modificador `oracionEnlace` (línea ~181). Parseo `app/src/opl/parser/parsear.ts` (`CONDICION_AGENTE_RE` línea ~544, `CONDICION_OCURRE_RE`, regex de cambio en contexto CS2 línea ~621); tests `parser.condicionesExcepciones.test.ts`.

Rationale: `reglas §4.8` (CT1–CS6, R-OPL-COND-ALT-1..2, R-OPL-SUP-1), `§6.1` (bypass), `§6.3` (R-MOD-2) y `opm-opl-es §7`.

### §5.3 Excepción — sobretiempo (EX1) y subtiempo (EX2)

**ID**: EX1 (sobretiempo `/`, overtime), EX2 (subtiempo `//`, undertime).

**Plantilla(s)**:
- EX1 (sobretiempo): `*Manejo* ocurre si duración de *Fuente* excede máx-duración unidades-tiempo.`
- EX2 (subtiempo): `*Manejo* ocurre si duración de *Fuente* es menor que mín-duración unidades-tiempo.`
- Variante combinada (extensión local): `*Manejo* ocurre si duración de *Fuente* es menor que mín-duración o excede máx-duración.`

**Naturaleza**: el enlace de excepción NO es un modificador `e`/`c`: es una familia procedimental autónoma proceso→proceso que conecta un *proceso* fuente con un *proceso* de manejo, disparado por desviación temporal. El sobretiempo se marca `/`, el subtiempo `//`.

- **R-EXC-AMBIENTAL-1**: el *proceso* de manejo de excepción DEBE ser **ambiental** (contorno discontinuo, `es ambiental` en §2.8). La fuente pertenece al sistema; el manejo del fallo temporal vive en el entorno.

  Correcto: `*Manejar Excepción* ocurre si duración de *Procesar* excede 5 minutos.` (con *Manejar Excepción* declarado ambiental)
  Rationale: `reglas §5.7` (R-EXC-1A) y `SSOT-visual §4.4`.

- **R-EXC-DUR-1**: un enlace de sobretiempo (EX1) EXIGE duración máxima declarada del *proceso* fuente; uno de subtiempo (EX2) EXIGE duración mínima declarada. Sin la cota correspondiente, la emisión cae al texto de respaldo (`su duración máxima` / `su duración mínima`) en vez de un valor concreto.

  Rationale: `reglas §5.7` (R-EXC-2, R-EXC-3) y la rama de respaldo de `formatoTiempoMaximo`/`formatoTiempoMinimo`.

**Emisión**: un enlace `excepcionSobretiempo` emite `… excede <valor> <unidad>` con el *proceso* de manejo como sujeto (`ocurre`) y el *proceso* fuente tras `duración de`. Un enlace `excepcionSubtiempo` emite `… es menor que <valor> <unidad>`. El valor y la unidad se componen por `formatoTiempo`; si faltan, se emite el respaldo. La unidad temporal del sistema es default; un *proceso* con unidad distinta DEBE declararla (R-EXC-5).

**Supresión**: placeholder NO emite. Un modificador `e`/`c` NUNCA DEBE anotar un enlace de excepción (familia autónoma; aplicar control sobre flujo proceso→proceso es error de categoría, R-MOD-CAT-1).

**Tokenización**: span del *proceso* de manejo con `ref`; `ocurre si duración de` clave de excepción; span del *proceso* fuente con `ref`; `excede` (EX1) o `es menor que` (EX2) clave de cota; `<valor>` y `<unidad>` spans de magnitud temporal con `hint` de presentación.

**Orden**: *manejo* → `ocurre si duración de` → *fuente* → (`excede` | `es menor que`) → valor → unidad. El verbo de cota (`excede` vs `es menor que`) es portador de la dirección del fallo (`/` vs `//`) y NO DEBE intercambiarse.

**Composabilidad**: una misma fuente PUEDE tener simultáneamente sobretiempo y subtiempo; la variante combinada los une con `o`. La excepción no se coordina con enlaces transformadores/habilitadores en un predicado.

**Reverse**: `parser.condicionesExcepciones.test.ts` cubre EX1 (`… excede 5 minutos`, línea ~33) y EX2 (`… es menor que 30 segundos`, línea ~44), reconstruyendo el enlace de excepción con su cota y unidad.

**Roundtrip**: el *manejo*, la *fuente*, la dirección de cota, el valor y la unidad DEBEN preservarse. `parser.condicionesExcepciones.test.ts` defiende ida y vuelta (líneas ~61, ~78).

**Traza a código**: generación `app/src/opl/generadores/procedural.ts·oracionEnlaceSinModificador` (casos `excepcionSobretiempo` ~206, `excepcionSubtiempo` ~208, `excepcionSubSobretiempo` ~210); composición de cota `formatoTiempoMaximo`/`formatoTiempoMinimo`/`formatoTiempo` (líneas ~217–232); metadato de duración `app/src/opl/generadores/duracionMetadata.ts`. Parseo y roundtrip `app/src/opl/parser/parser.condicionesExcepciones.test.ts`.

> GAP-EXC-UNIDADES-LITERAL: la plantilla canónica `opm-opl-es §8.1` usa el literal `unidades-tiempo`; el generador compone valor+unidad concretos vía `formatoTiempo` (p. ej. `excede 5 minutos`) y, sin cota declarada, emite el respaldo `su duración máxima`. La superficie operativa diverge del literal de la plantilla sin contradecir el hecho; se declara como operacionalización local de `unidades-tiempo`.

Rationale: `reglas §4.9` (EX1, EX2), `§5.7` (R-EXC-1..5) y `opm-opl-es §8.1`.

### §5.4 Invocación (IV1) y autoinvocación (IV2)

**ID**: IV1 (invocación), IV2 (autoinvocación).

**Plantilla(s)**:
- IV1 (invocación): `*Invocador* invoca *Invocado*.`
- IV1 con demora (extensión local): `*Invocador* invoca *Invocado* despues de <demora>.`
- IV2 (autoinvocación): `*Invocador* se invoca a sí mismo.`
- IV2 con demora (extensión local): `*Invocador* se invoca a sí mismo despues de <demora>.`
- Abanico XOR divergente: `*P* invoca exactamente uno de *Q* o *R*.`
- Abanico XOR convergente: `Exactamente uno de *P* o *Q* invoca *R*.`

**Naturaleza**: la invocación es **familia procedimental autónoma** con firma proceso→proceso, distinta de transformadora y habilitadora; se decora con rayo (zigzag). La autoinvocación es un bucle del proceso sobre sí mismo.

- **R-IV-1**: la invocación DEBE tener firma *proceso* → *proceso*. NO DEBE conectar un **objeto**.

  Rationale: `reglas §5.4` (R-INV-1, R-INV-1A).

- **R-IV-2**: la invocación implícita (terminación de un subproceso que dispara al inmediatamente inferior por posición vertical dentro de una descomposición) NO DEBE dibujarse como enlace explícito ni emitir oración IV1 propia; subprocesos con borde superior a la misma altura inician en paralelo.

  Rationale: `reglas §5.4` (R-INV-2, R-INV-2A, R-INV-2B).

- **R-IV-3**: la invocación NO DEBE portar modificador `e`/`c` (familia autónoma; error de categoría). El control de flujo entre procesos DEBE expresarse con nodo de decisión booleano.

  Rationale: `reglas §6.4` (modificador sobre invocación = AP-10) y R-MOD-CAT-1.

**Emisión**: un enlace `invocacion` entre dos *procesos* distintos emite `*Invocador* invoca *Invocado*` (`invocan` en plural por multiplicidad). Si el enlace porta `demora`, se añade `despues de <demora>`. Cuando origen y destino son el mismo *proceso* (`esAutoInvocacion`), se emite `se invoca a sí mismo`.

**Supresión**: placeholder NO emite (R-ENT-2). La invocación implícita de descomposición NO emite (R-IV-2). Un fan de invocación bajo XOR/OR se realiza con la oración de abanico (`invoca exactamente uno de …` / `exactamente uno de … invoca …`), no como IV1 individual.

**Tokenización**: span del *invocador* con `ref`; `invoca`/`invocan` (IV1) o `se invoca a sí mismo` (IV2) clave de invocación; span del *invocado* con `ref` (IV1); `despues de <demora>` span de magnitud con `hint`.

**Orden**: *invocador* → `invoca` → *invocado* [→ `despues de` → demora]. En autoinvocación el invocado es el propio invocador y no se nombra dos veces.

**Composabilidad**: varias invocaciones desde el mismo *invocador* son oraciones IV1 separadas; bajo operador lógico se realizan vía abanico. La invocación NO se coordina con transformadores/habilitadores.

**Reverse**: la oración `*X* invoca *Y*` se parsea como enlace de invocación proceso→proceso; `*X* se invoca a sí mismo` como autoinvocación. El abanico de invocación se parsea por la ruta de abanico.

**Roundtrip**: el *invocador*, el *invocado* y la demora DEBEN preservarse. GAP-FIXTURE-INVOCACION: no hay fixture dedicado de invocación/autoinvocación en `fixtures-roundtrip.ts`; la simetría se apoya en `oracionEnlaceSinModificador` y `esAutoInvocacion`.

**Edge cases**:
- La grafía `despues de` (sin tilde) es la emisión actual del generador; la forma canónica es `después de`. GAP-INVOCACION-TILDE: corregir la grafía en `procedural.ts` (líneas ~187, ~205) para concordar con la ortografía es-CL de la spec.
- Las formas `inicia e invoca` (evento) e `invoca … si … ocurre` (condición) emitidas por el generador VIOLAN R-IV-3 / R-MOD-CAT-1 (ver GAP-EVENTO-INVOCACION en §5.1 y GAP-CONDICION-INVOCACION en §5.2); son OPL no canónica.

**Traza a código**: generación `app/src/opl/generadores/procedural.ts·oracionEnlaceSinModificador` (autoinvocación línea ~187, invocación línea ~204–205); detección `app/src/modelo/autoinvocacion.ts·esAutoInvocacion`.

Rationale: `reglas §4.9` (IV1, IV2), `§5.4` (R-INV-1..2B) y `opm-opl-es §8.2`.

### §5.5 GAPs de cobertura — modificadores de control

- GAP-EVENTO-RESULTADO / GAP-CONDICION-RESULTADO: el generador emite evento y condición de **resultado** (`oracionEvento`/`oracionCondicion`, caso `resultado`), superficie que VIOLA R-MOD-INPUT-2 (Post(P) no admite `e`/`c`). La spec manda: el generador DEBE dejar de producir estas oraciones.
- GAP-EVENTO-INVOCACION / GAP-CONDICION-INVOCACION: el generador emite `inicia e invoca` e `invoca … si … ocurre`, superficie que VIOLA R-MOD-CAT-1 / R-IV-3 (la invocación no admite modificador de control).
- GAP-FIXTURE-EVENTO / GAP-FIXTURE-INVOCACION: no hay fixtures roundtrip dedicados de evento ni de invocación/autoinvocación en `fixtures-roundtrip.ts`; la simetría se apoya solo en los generadores y en `parser.condicionesExcepciones.test.ts` (que cubre condición y excepción, no evento ni invocación).
- GAP-EXC-UNIDADES-LITERAL: la operacionalización de `unidades-tiempo` por `formatoTiempo` diverge del literal de la plantilla `opm-opl-es §8.1` (ver §5.3).
- GAP-INVOCACION-TILDE: grafía `despues de` sin tilde en la emisión de invocación (ver §5.4).

## §6 Enlaces estructurales

Esta sección canoniza la realización OPL-ES de los enlaces **estructurales**: las cuatro relaciones fundamentales —**agregación-participación** (RF1), **exhibición-caracterización** (RF2/RF2b), **generalización-especialización** (RF3/RF3b) con su variante **XOR** (RX1/RX2) y herencia múltiple (RH1), **clasificación-instanciación** (RF4/RF4b)— y los **etiquetados** unidireccional, bidireccional y recíproco (SE1–SE5), con sus variantes de estado especificado (SSE1–SSE7).

Un enlace estructural es **invariante en el tiempo** y conecta cosa↔cosa (no proceso↔objeto, salvo exhibición-caracterización). Su firma fija el extremo origen (vértice del triángulo: todo, exhibidor, general, clase) y el extremo destino (base: partes, rasgos, especializaciones, instancias). La generación NO DEBE emitir un verbo estructural fuera de {`consta de`, `exhibe`, `es un`/`son`, `puede ser`/`puede ser uno de`, `es una instancia de`/`son instancias de`, etiqueta-de-usuario, `se relaciona con`/`se relacionan`}; el parseo NO DEBE reconocer otro verbo como estructural.

Rationale: `reglas §4.10` (SE1–RH1, SSE1–SSE7), `§5.5` (R-STRF-1..4, R-HER-1..8), `§5.6` (R-STRE-1) y `opm-opl-es §9`.

### §6.0 Reglas duras transversales — perseverancia, firma y herencia

- **R-EST-PERS-1**: salvo exhibición-caracterización, refinable y refinadores DEBEN tener la misma **perseverancia**: agregación de objetos agrega objetos, agregación de procesos agrega procesos; igual para generalización y clasificación. NO DEBE agregarse un *proceso* a un **objeto** ni viceversa.

  Rationale: `reglas §5.5` (R-STRF-1) y `glosario 3.50`.

- **R-EST-PERS-2**: la exhibición-caracterización es la ÚNICA estructural que PUEDE mezclar perseverancias. Las únicas mezclas válidas son **objeto** exhibe atributo, **objeto** exhibe operación, *proceso* exhibe atributo y *proceso* exhibe operación.

  Rationale: `reglas §5.5` (R-STRF-2, R-STRF-2A).

- **R-EST-DIR-1**: la oración estructural fundamental DEBE emitirse en la dirección del vértice → base, pero la superficie OPL-ES invierte el sujeto según la relación: agregación y exhibición ponen al vértice como sujeto (`**Todo** consta de …`, `**Exhibidor** exhibe …`); generalización y clasificación ponen la **base** como sujeto (`**Especialización** es un **General**`, `**Instancia** es una instancia de **Clase**`). El generador DEBE respetar esta inversión por relación.

  Rationale: `estructural.ts·oracionEnlaceEstructural` (casos `agregacion`/`exhibicion` emiten `origen verbo destino`; `generalizacion`/`clasificacion` emiten `destino … origen`) y `opm-opl-es §9`.

- **R-EST-HER-1**: una especialización hereda del general todas las partes, rasgos, enlaces estructurales etiquetados y enlaces procedimentales; los enlaces heredados NO DEBEN dibujarse como enlaces explícitos duplicados ni emitir OPL propia, salvo que la herramienta los marque como vista derivada no nuclear.

  Rationale: `reglas §5.5` (R-HER-1, R-HER-8).

### §6.1 Agregación-participación (RF1)

**ID**: RF1 (básico), RF1i (colección incompleta).

**Plantilla(s)**:
- RF1: `**Todo** consta de **Parte1**, **Parte2** y **Parte3**.`
- Plural por multiplicidad del todo: `**Todos** constan de **Parte1** y **Parte2**.`
- RF1i (colección incompleta): `**Todo** consta de **Parte1**, **Parte2** y al menos otra parte.`

**Emisión**: un enlace de tipo `agregacion` entre el **todo** (origen, vértice) y sus **partes** (destino, base) emite `consta de`, con el **todo** como sujeto. El verbo concuerda con el sujeto (`consta`/`constan`). Las partes enumeradas se separan por coma y la última se une con `y`/`e` según fonética.

**Supresión**: si el **todo** o alguna **parte** tienen nombre placeholder, NO se emite (R-ENT-2). Un enlace heredado por especialización NO emite (R-EST-HER-1).

**Tokenización**: span del **todo** con `ref`; `consta de`/`constan de` token-verbo del enum §1.1; cada **parte** es span con `ref` a su cosa; comas y `y`/`e` son conectores fijos (§1.3).

**Orden**: **todo** → `consta de` → lista de **partes**. Invertir sujeto/predicado cambia qué cosa es el todo.

**Composabilidad**: la agregación es **destino-enumerado**: múltiples enlaces `agregacion` desde el mismo **todo** se realizan en una sola oración con la lista de partes coordinada (no como RF1 individuales por parte). NO DEBE coordinarse con exhibición, generalización ni clasificación en una sola oración (verbos distintos). **Zona prohibida de composición en refinamiento/despliegue**: la enumeración estructural de partes NO DEBE agruparse cuando el enlace participa de un contexto de descomposición/despliegue (`se descompone en` / `se despliega en`), porque colisiona con la realización del refinamiento y borraría tokens/refs por enlace; en ese contexto la agregación se emite por enlace, sin coordinar (remite §9).

**Reverse**: la oración `**Todo** consta de **A**, **B** y **C**` se parsea, vía `parsear.ts·astEstructural` (regex `^(.+?) consta de (.+)$`, `tipo: "agregacion"`), como enlaces `agregacion` con el **todo** como origen y cada **parte** como destino.

**Edición**: agregar una parte a una agregación existente DEBERÍA extender la lista de la oración en su lugar; quitar la última parte de un todo PUEDE colapsar la oración.

**Roundtrip**: el **todo**, el orden de las **partes** y la marca de colección incompleta DEBEN preservarse. GAP-FIXTURE-AGREGACION: no hay fixture dedicado de agregación en `fixtures-roundtrip.ts`; la simetría se apoya en `oracionEnlaceEstructural` y la regex de `astEstructural`.

**Traza a código**: generación `app/src/opl/generadores/estructural.ts·oracionEnlaceEstructural` (caso `agregacion`, línea ~63); parseo `app/src/opl/parser/parsear.ts·astEstructural` (regex `consta de`, línea ~959).

Rationale: `reglas §4.10` (RF1), `§5.5` (R-STRF-1, R-STRF-4) y `opm-opl-es §9.1`.

### §6.2 Exhibición-caracterización (RF2, RF2b)

**ID**: RF2 (atributos homogéneos), RF2b (mixto atributo + operación), RF2o (rasgo opcional).

**Plantilla(s)**:
- RF2: `**Exhibidor** exhibe **Atributo1** y **Atributo2**.`
- RF2b (heterogénea): `**Exhibidor** exhibe **Atributo1** así como *Operación1*.`
- RF2o (rasgo opcional): `**Exhibidor** tiene un **Rasgo** opcional.`
- Plural por multiplicidad del exhibidor: `**Exhibidores** exhiben **Rasgo**.`

**Emisión**: un enlace de tipo `exhibicion` entre el **exhibidor** (origen) y sus **rasgos** (destino) emite `exhibe`, con el exhibidor como sujeto. Cuando el destino porta multiplicidad opcional (`?`/`0..1`), el generador emite la variante `tiene un **Rasgo** opcional` en vez de `exhibe`. Los rasgos heterogéneos (atributos + operaciones) se unen con `así como` (§1.3).

**Supresión**: placeholder NO emite. La exhibición es la única estructural que ADMITE mezcla de perseverancias (R-EST-PERS-2); las cuatro mezclas válidas son objeto/proceso × atributo/operación.

**Tokenización**: span del **exhibidor** con `ref`; `exhibe`/`exhiben` token-verbo; cada rasgo es span con `ref`; `así como` conector de adición heterogénea; `tiene un … opcional` realiza la opcionalidad como rasgo (la palabra `opcional` es portadora de multiplicidad `?`).

**Orden**: **exhibidor** → `exhibe` → lista de rasgos [con `así como` ante el bloque heterogéneo].

**Composabilidad**: **destino-enumerado** (varios rasgos del mismo exhibidor en una oración). NO DEBE coordinarse con agregación/generalización/clasificación. **Zona prohibida de composición en refinamiento/despliegue**: igual que §6.1, la enumeración de rasgos NO DEBE agruparse cuando el enlace participa de un contexto de descomposición/despliegue; se emite por enlace (remite §9).

**Reverse**: la oración `**Exhibidor** exhibe **A** así como *Op*` se parsea, vía `parsear.ts·astEstructural` (regex `^(.+?) exhibe(?:n)? (.+)$`, `tipo: "exhibicion"`); la variante `tiene un … opcional` se parsea con multiplicidad `0..1`.

**Roundtrip**: exhibidor, rasgos, orden, opcionalidad y la frontera atributo/operación DEBEN preservarse. GAP-FIXTURE-EXHIBICION: no hay fixture dedicado de exhibición en `fixtures-roundtrip.ts`.

**Edge cases**: el caso atributo-con-valor (`**Atributo** de **Objeto** es valor`) NO es exhibición sino entidad-atributo (§2.5); el generador lo separa (`estructural.ts` comenta esa frontera).

**Traza a código**: generación `app/src/opl/generadores/estructural.ts·oracionEnlaceEstructural` (caso `exhibicion`, líneas ~64–68; variante opcional ~65–67); parseo `app/src/opl/parser/parsear.ts·astEstructural` (regex `exhibe`, línea ~961; opcional ~963–966).

Rationale: `reglas §4.10` (RF2, RF2b), `§5.5` (R-STRF-2, R-STRF-2A, R-OPL-RF-2) y `opm-opl-es §9.2`.

### §6.3 Generalización-especialización (RF3, RF3b; XOR RX1, RX2; herencia múltiple RH1)

**ID**: RF3 (plural), RF3b (singular), RX1/RX2 (XOR), RH1 (herencia múltiple).

**Plantilla(s)**:
- RF3 (plural): `**Especialización1** y **Especialización2** son **General**.`
- RF3b (singular): `**Especialización** es un **General**.`
- RX1 (XOR, dos generales): `**Especial** puede ser **General1** o **General2**.`
- RX2 (XOR, lista): `**Especial** puede ser uno de **General1**, **General2** o **General3**.`
- RH1 (herencia múltiple): `**Especial** es un **General1** y un **General2**.`
- Colección incompleta: `**Especialización1**, **Especialización2** y al menos otra especialización son **General**.`

**Emisión**: un enlace de tipo `generalizacion` pone la **base** (especializaciones) como sujeto y el **general** como predicado nominal: con destino plural emite `son **General**`, con destino singular `es un **General**`. La variante **XOR** (generales mutuamente excluyentes) emite `puede ser` / `puede ser uno de` (remite a §1.2 R-VERB-EST-2). La herencia múltiple coordina los generales con artículos `un/una`.

**Supresión**: placeholder NO emite. Los enlaces heredados por la especialización NO se duplican (R-EST-HER-1). Misma perseverancia obligatoria (R-EST-PERS-1).

**Reglas duras**:
- **R-EST-GEN-1**: la especialización XOR DEBE emitirse con `puede ser` o `puede ser uno de`, NUNCA con `son`/`es un` (que son inclusivos) ni con `puede estar` (que es enumeración de estados, §1.2 R-VERB-EST-1).

  Correcto: `**Vehículo** puede ser **Auto** o **Camión**.`
  Incorrecto: `**Vehículo** puede estar **Auto** o **Camión**.`
  Rationale: `reglas §4.10` (RX1, RX2, R-OPL-RF-5) y §1.2 R-VERB-EST-2.

- **R-EST-GEN-2**: la herencia múltiple DEBE emitirse con la lista de generales unida por artículos `un/una` (`es un **G1** y un **G2**`), preservando la trazabilidad de cada general.

  Rationale: `reglas §4.10` (RH1, R-OPL-RF-6), `§5.5` (R-HER-2).

**Tokenización**: cada **especialización** es span con `ref`; `son`/`es un`/`puede ser`/`puede ser uno de` token-verbo del enum §1.1; el **general** es span con `ref`; `o`/`u` conector XOR; `y`/`e` conector copulativo de especializaciones; `un`/`una` artículos de herencia múltiple.

**Orden**: lista de **especializaciones** → (`son` | `es un`) → **general**. XOR: **especial** → (`puede ser` | `puede ser uno de`) → lista de **generales**.

**Composabilidad**: **destino-enumerado** en el sujeto (varias especializaciones del mismo general en una oración) y en el predicado para herencia múltiple/XOR (varios generales). NO DEBE coordinarse con agregación/exhibición/clasificación. **Zona prohibida de composición en refinamiento/despliegue**: la agrupación de especializaciones NO DEBE aplicarse cuando el enlace participa de descomposición/despliegue, porque colisiona con la realización del refinamiento (despliegue de generalización-especialización, §6 de refinamientos) y borraría tokens/refs por enlace; se emite por enlace (remite §9).

**Reverse**: `parsear.ts·astEstructural` reconoce `^(.+?) es un (.+)$` y `^(.+?) son (.+)$` como `generalizacion` con el general como origen y la(s) especialización(es) como destino. GAP-XOR-PARSER: la superficie `puede ser` / `puede ser uno de` NO tiene regex de parseo estructural dedicada hoy (el verbo es canónico —enum §1.1, marcado GAP-XOR en generación—, pero ni generador ni parser estructural lo realizan); la enumeración XOR de generalización queda como GAP de cobertura bidireccional.

**Roundtrip**: especializaciones, general, exclusividad (XOR vs inclusivo) y herencia múltiple DEBEN preservarse. GAP-FIXTURE-GENERALIZACION: no hay fixture dedicado.

**Traza a código**: generación `app/src/opl/generadores/estructural.ts·oracionEnlaceEstructural` (caso `generalizacion`, línea ~70; `son`/`es un`); parseo `app/src/opl/parser/parsear.ts·astEstructural` (regex `es un` ~967, `son` ~969). XOR `puede ser`: GAP-XOR (sin generador, §1.1) y GAP-XOR-PARSER (sin parser estructural).

Rationale: `reglas §4.10` (RF3, RF3b, RX1, RX2, RH1), `§5.5` (R-STRF-1, R-HER-1..8) y `opm-opl-es §9.3`.

### §6.4 Clasificación-instanciación (RF4, RF4b)

**ID**: RF4 (singular), RF4b (plural).

**Plantilla(s)**:
- RF4 (singular): `**Instancia** es una instancia de **Clase**.`
- RF4b (plural): `**Instancia1** y **Instancia2** son instancias de **Clase**.`

**Emisión**: un enlace de tipo `clasificacion` pone la **instancia** (base) como sujeto y la **clase** (vértice) como complemento: con destino singular emite `es una instancia de`, con plural `son instancias de`. La clasificación NO distingue colección completa/incompleta (R-STRF-3): NO DEBE emitirse marca de colección incompleta para instanciación.

**Supresión**: placeholder NO emite. Una **instancia visual** (misma cosa con apariencia local en otro OPD) NO emite oración de instanciación (§2.6 R-ENT-INS-1); solo la **instancia lógica** (cosas distintas relacionadas por clasificación) la emite. Misma perseverancia obligatoria (R-EST-PERS-1).

**Tokenización**: span de cada **instancia** con `ref`; `es una instancia de`/`son instancias de` token-verbo del enum §1.1; span de la **clase** con `ref`.

**Orden**: lista de **instancias** → (`es una instancia de` | `son instancias de`) → **clase**.

**Composabilidad**: **destino-enumerado** en el sujeto (varias instancias de la misma clase en una oración, vía `son instancias de`). NO DEBE coordinarse con las otras tres estructurales. **Zona prohibida de composición en refinamiento/despliegue**: la agrupación de instancias NO DEBE aplicarse en contexto de despliegue de clasificación-instanciación; se emite por enlace (remite §9).

**Reverse**: `parsear.ts·astEstructural` reconoce `^(.+?) es una instancia de (.+)$` (~971) y `^(.+?) son instancias de (.+)$` (~973) como `clasificacion` con la clase como origen y la(s) instancia(s) como destino.

**Roundtrip**: instancias, clase y plural/singular DEBEN preservarse. El formato nominal `Instancia : Clase` (§2.6) es designación de nombre, no oración de instanciación; GAP-NOMBRE-INSTANCIA (declarado en §2.6) sigue vigente. GAP-FIXTURE-CLASIFICACION: no hay fixture dedicado.

**Traza a código**: generación `app/src/opl/generadores/estructural.ts·oracionEnlaceEstructural` (caso `clasificacion`, línea ~72); parseo `app/src/opl/parser/parsear.ts·astEstructural` (regex `es una instancia de` ~971, `son instancias de` ~973).

Rationale: `reglas §4.10` (RF4, RF4b, R-OPL-RF-4), `§5.5` (R-STRF-3, R-HER-6) y `opm-opl-es §9`.

### §6.5 Etiquetados — unidireccional, bidireccional y recíproco (SE1–SE5)

**ID**: SE1 (unidireccional con etiqueta de usuario), SE2 (unidireccional nulo), SE3 (bidireccional, dos etiquetas), SE4 (recíproco con etiqueta), SE5 (recíproco nulo).

**Plantilla(s)**:
- SE1 (unidireccional, etiqueta de usuario): `**Origen** etiqueta **Destino**.`
- SE2 (unidireccional, etiqueta nula): `**Origen** se relaciona con **Destino**.`
- SE3 (bidireccional, etiquetas distintas): `**Origen** etiqueta-f **Destino**.` seguido de `**Destino** etiqueta-b **Origen**.` (dos oraciones)
- SE4 (recíproco con etiqueta): `**Origen** y **Destino** son etiqueta.`
- SE5 (recíproco nulo): `**Origen** y **Destino** se relacionan.`

**Naturaleza**: el enlace etiquetado es estructural **no fundamental**: expresa una relación arbitraria definida por el modelador entre dos cosas de la misma perseverancia (objeto↔objeto o proceso↔proceso, R-OPL-SE-2). La **etiqueta** de usuario es frase breve en minúscula que funciona como verbo o predicado nominal (R-OPL-SE-1).

**Emisión**: un enlace `etiquetado` emite `**Origen** <tag> **Destino**` con la etiqueta de usuario como verbo; si no hay etiqueta, emite la etiqueta nula `se relaciona con` (SE2). Un enlace `etiquetadoBidireccional` recíproco sin etiqueta diferencial emite `**Origen** y **Destino** se relacionan` (SE5). La bidireccional con dos etiquetas distintas (SE3) emite dos oraciones, una por dirección (f-tag / b-tag); un bidireccional cuyas dos etiquetas coinciden DEBE tratarse como recíproco con esa etiqueta (R-STRE-1).

**Supresión**: placeholder NO emite. Una etiqueta nula definida por usuario solo es válida si conserva trazabilidad como etiqueta de usuario (R-OPL-SE-5).

**Reglas duras**:
- **R-EST-TAG-1**: un enlace etiquetado DEBE conectar cosas de la misma perseverancia (objeto↔objeto o proceso↔proceso); las mezclas objeto↔proceso pertenecen a exhibición-caracterización cuando son canónicas, no a etiquetado.

  Rationale: `reglas §4.10` (R-OPL-SE-2).

- **R-EST-TAG-2**: `se relaciona con` (unidireccional) y `se relacionan` (recíproco) son las etiquetas nulas canónicas; el generador DEBE emitirlas cuando el enlace no porta etiqueta de usuario.

  Rationale: `reglas §4.10` (R-OPL-SE-5) y `procedural.ts` (líneas ~240, ~244).

**Tokenización**: span del **origen** con `ref`; la etiqueta de usuario o `se relaciona con`/`se relacionan` es token-verbo (la de usuario lleva `hint` de etiqueta editable); span del **destino** con `ref`; `y`/`e` conector en las formas recíprocas.

**Orden**: SE1/SE2: **origen** → tag → **destino**. SE4/SE5: **origen** → `y` → **destino** → (`son` tag | `se relacionan`).

**Composabilidad**: el etiquetado PUEDE bifurcarse hacia listas de objetos o procesos con `ordenados por` o `en esa secuencia` cuando el orden sea parte de la superficie (R-OPL-SE-4) y PUEDE incluir restricciones de participación en origen y destino (R-OPL-SE-3). NO DEBE coordinarse con las estructurales fundamentales. **Zona prohibida de composición en refinamiento/despliegue**: el etiquetado NO DEBE coordinarse cuando participa de un contexto de descomposición/despliegue (remite §9).

**Reverse**: la oración con etiqueta de usuario se parsea como enlace `etiquetado` reconstruyendo el tag; `se relaciona con` como etiquetado nulo unidireccional; `se relacionan` como recíproco nulo. GAP-TAG-PARSER: la ruta de parseo estructural de `astEstructural` (`parsear.ts` ~959–973) cubre las cuatro fundamentales pero NO incluye regex dedicada para `se relaciona con` / `se relacionan` ni para etiquetas de usuario arbitrarias; el reverse de etiquetados es GAP de cobertura bidireccional (la generación existe en `procedural.ts`, el parseo estructural no).

**Roundtrip**: origen, destino, dirección (uni/bi/recíproco), etiqueta de usuario y el orden (cuando aplica) DEBEN preservarse. GAP-FIXTURE-TAGGED: no hay fixture dedicado de etiquetado en `fixtures-roundtrip.ts`.

**Edge cases**: SE3 con etiquetas idénticas colapsa a SE4 (R-STRE-1); la restricción V-30 (`reglas §4.10`) prohíbe las variantes bidireccional y recíproco para el caso de estado solo en destino (ver §6.6).

**Traza a código**: generación `app/src/opl/generadores/procedural.ts·oracionEstructuralEtiquetada` (etiquetado/bidireccional, líneas ~152, ~168, ~239–244: `tag`/`se relaciona con`/`se relacionan`); parseo: GAP-TAG-PARSER (sin regex estructural dedicada en `parsear.ts·astEstructural`).

Rationale: `reglas §4.10` (SE1–SE5, R-OPL-SE-1..5), `§5.6` (R-STRE-1) y `opm-opl-es §9.1`.

### §6.6 Estructurales con estado especificado (SSE1–SSE7)

**ID**: SSE1–SSE7 (`reglas §4.10`, `opm-opl-es §9.4`).

**Plantilla(s)**:
- SSE1 (estado en origen, unidireccional): `**Origen** en \`estado\` etiqueta **Destino**.`
- SSE2 (estado en destino, unidireccional): `**Origen** etiqueta **Destino** en \`estado\`.`
- SSE3 (estado en ambos, unidireccional): `**Origen** en \`sa\` etiqueta **Destino** en \`sb\`.`
- SSE4 (estado en origen, bidireccional f-tag): `**Origen** en \`sa\` etiqueta-f **Destino**.`
- SSE5 (estado en origen, bidireccional b-tag): `**Destino** etiqueta-b **Origen** en \`sa\`.`
- SSE6 (estado en ambos, recíproco): `**Origen** en \`sa\` y **Destino** en \`sb\` son etiqueta.`
- SSE7 (estado en origen, recíproco): `**Destino** y **Origen** en \`sa\` son etiqueta.`

**Emisión**: un enlace estructural etiquetado cuyo extremo está fijado a un `estado` específico (no a la cosa entera) añade el sufijo `en \`estado\`` sobre la plantilla SE correspondiente, en el extremo que porta el estado.

**Reglas duras**:
- **R-EST-SSE-1** (`V-30`): las variantes **bidireccional** y **recíproco** NO existen para el caso de estado solo en destino; solo aplican SSE1–SSE7 según la tabla. NO DEBE emitirse una forma bidireccional/recíproca con estado únicamente en el destino.

  Rationale: `reglas §4.10` (restricción V-30).

**Tokenización**: spans de **origen**/**destino** con `ref`; cada `estado` entre backticks con `ref` al estado; la etiqueta como token-verbo; `en` precede al estado (posición de estado es post-cosa, no pre, §convenciones OPL-ES).

**Orden**: el sufijo `en \`estado\`` sigue inmediatamente a la cosa cuyo estado especifica.

**Composabilidad**: igual que §6.5; la **zona prohibida de composición en refinamiento/despliegue** aplica idéntica (remite §9).

**Reverse**: GAP-SSE-PARSER: las variantes con estado especificado heredan el GAP-TAG-PARSER de §6.5; no hay regex de parseo estructural dedicada hoy.

**Roundtrip**: origen, destino, etiqueta, dirección y cada `estado` especificado DEBEN preservarse. GAP-FIXTURE-SSE: sin fixture dedicado.

**Traza a código**: generación `app/src/opl/generadores/procedural.ts·oracionEstructuralEtiquetada` (composición del sufijo de estado en el extremo etiquetado); parseo GAP-SSE-PARSER.

Rationale: `reglas §4.10` (SSE1–SSE7, V-30) y `opm-opl-es §9.4`.

### §6.7 GAPs de cobertura — enlaces estructurales

- GAP-XOR / GAP-XOR-PARSER: la especialización XOR (`puede ser` / `puede ser uno de`, RX1/RX2) tiene verbo canónico (enum §1.1) pero ningún generador de `app/src/opl/generadores/` la emite ni regex de `parsear.ts·astEstructural` la reconoce; cobertura bidireccional ausente.
- GAP-TAG-PARSER / GAP-SSE-PARSER: la generación de etiquetados (SE1–SE5) y de estructurales con estado (SSE1–SSE7) existe en `procedural.ts·oracionEstructuralEtiquetada`, pero `parsear.ts·astEstructural` no incluye regex dedicada para `se relaciona con` / `se relacionan` ni para etiquetas de usuario; el reverse de etiquetados es GAP.
- GAP-NOMBRE-INSTANCIA: el formato nominal `Instancia : Clase` (§2.6) no tiene generador dedicado que lo componga automáticamente; vigente desde §2.6.
- GAP-FIXTURE-ESTRUCTURALES: no hay fixtures roundtrip dedicados de agregación, exhibición, generalización, clasificación ni etiquetado en `fixtures-roundtrip.ts`; la simetría de las cuatro fundamentales se apoya en `oracionEnlaceEstructural` y las regex de `astEstructural`; la de etiquetados solo en el generador (sin reverse, por GAP-TAG-PARSER).

## §7 Refinamiento / gestión de contexto

Esta sección canoniza la realización OPL-ES de la **gestión de contexto**: cómo el modelo proyecta a frases los mecanismos de refinamiento (descomposición/recomposición, despliegue/plegado, expresión/supresión de estados) y los enlaces que cruzan la frontera de un OPD refinado. La gestión de contexto NO crea hechos OPM nuevos: realiza textualmente la relación jerárquica entre un OPD padre y su(s) hijo(s), o la distribución de un enlace existente sobre subprocesos.

Cada mecanismo aparea un **refinamiento** (revelar detalle) con su **abstracción** (suprimirlo); la spec realiza ambos sentidos. El refinamiento del modelo es un canal separado de la etiqueta visible `SDx.y`: la generación PUEDE emitir la etiqueta de navegación como `hint` de presentación, pero NO DEBE tratarla como identidad persistente (R-IDP-1, R-IDP-2).

Rationale: `reglas §4.11` (CX1–CX8, CM1–CM3), `§8` (mecanismos, síncrona/asíncrona, escindidos, distribución) y `opm-opl-es §10`.

### §7.0 Reglas duras transversales de refinamiento

- **R-CX-0** (no-trivialidad): un refinamiento NO DEBE emitir oración de gestión de contexto cuando el hijo tiene **menos de 2** refinadores; un nodo con un solo hijo NO es refinamiento canónico (R-REF-NTRIV-1..3) y solo PUEDE persistir como placeholder de edición.

  Rationale: `reglas §8.3` (R-REF-NTRIV-1, R-REF-NTRIV-2, R-REF-NTRIV-3).

- **R-CX-1** (invariantes a través del refinamiento): esencia, perseverancia y nombre de la cosa refinada NO cambian al cruzar el refinamiento; la generación NO DEBE emitir una oración de refinamiento que reasigne esas propiedades.

  Rationale: `reglas §8.8` (R-REF-4: `V-95`, `V-96`, `V-97`).

- **R-CX-2** (identidad vs etiqueta): la oración de refinamiento entre OPDs (CX3, CX4) PUEDE mostrar la etiqueta `SDx.y` como superficie de navegación, pero el `ref` del span de OPD DEBE anclar al identificador persistente del OPD, no a la etiqueta mutable.

  Correcto: `**Pedido** se despliega en SD1 en **Cabecera** y **Línea**.` (span `SD1` con `ref` al OPD persistente)
  Incorrecto: usar `SD1` como clave de modelo para resolver el hijo en serialización.
  Rationale: `reglas §8.7` (R-IDP-1, R-IDP-2, R-IDP-3) y `opm-opl-es §10.3`.

### §7.1 Descomposición / recomposición de proceso (in-zoom / out-zoom, CX1, CX2)

**ID**: CX1 (secuencial), CX2 (paralelo); inverso CX7 (recomposición, GAP-RECOMPONE).

**Plantilla(s)**:
- CX1 (secuencial): `*Proceso* se descompone en *P1*, *P2* y *P3*, en esa secuencia.`
- CX2 (paralelo): `*Proceso* se descompone en paralelo *P1* y *P2*.`
- Mixta: `*Proceso* se descompone en *P1*, paralelo *P2* y *P3*, y *P4*, en esa secuencia.` (preserva qué subprocesos van en paralelo dentro de la secuencia, R-OPL-CX-5).
- Con objetos internos de zoom: `… se descompone en *P1* y *P2*, así como **ObjetoInterno**.` (R-OPL-CX-6).

**Emisión**: cuando una entidad *proceso* porta un refinamiento `descomposicion` con `≥ 2` subprocesos (R-CX-0), se emite una oración con `se descompone en`, sujeto = *proceso* padre, complemento = lista de subprocesos. El orden temporal se deriva de la coordenada vertical de los subprocesos en el OPD hijo (R-IDP-0A); si hay secuencia detectable se añade `en esa secuencia`, y los subprocesos coetáneos se agrupan con `paralelo`.

**Supresión**: padre o subproceso con nombre placeholder NO emite (R-ENT-2). Un OPD semidescompuesto (transitorio) NO DEBE emitir oración canónica de descomposición (R-OPD-OP-3). Si el hijo no llega a 2 refinadores, NO se emite (R-CX-0).

**Tokenización**: span del *proceso* padre con `ref`; `se descompone en` token-verbo del enum §1.1; cada *subproceso* es span con `ref`; `paralelo` clave de coetaneidad; `en esa secuencia` clave de orden temporal; `así como` adición de objetos internos; `y`/`e`, `o`/`u` conectores según fonética.

**Orden**: *proceso* padre → `se descompone en` → [`paralelo`] lista de subprocesos [`, así como` lista de objetos internos] [`, en esa secuencia`].

**Composabilidad**: la lista de subprocesos es **destino-enumerado** dentro de la única oración de descomposición; NO se fragmenta en una oración por subproceso. La descomposición NO DEBE coordinarse con oraciones de enlace transformador/habilitador en un solo predicado. Aplica la **zona prohibida de composición en contexto de refinamiento** (§7.7): los enlaces de los subprocesos NO se fusionan al emitir la descomposición.

**Reverse**: la oración `se descompone en` se parsea como creación/actualización del refinamiento `descomposicion` del *proceso*, con la lista de subprocesos como refinadores y la marca de secuencia/paralelo derivada de `en esa secuencia` / `paralelo`. GAP-CX-PARSER: `parsear.ts` no expone hoy una regex dedicada de `se descompone en`; el reverse de la descomposición es GAP de cobertura bidireccional (la generación existe en `refinamiento.ts·oracionDescomposicion`, el parseo estructural no).

**Roundtrip**: el padre, la lista de subprocesos, el orden temporal (secuencia/paralelo) y los objetos internos DEBEN preservarse. GAP-FIXTURE-DESCOMPOSICION: no hay fixture roundtrip dedicado de descomposición en `fixtures-roundtrip.ts`; la simetría se apoya en el generador y, parcialmente, en `parser.designacionesPlegado.test.ts`.

**Edge cases**: la **recomposición** (out-zoom, CX7 `se recompone desde`) tiene verbo canónico (enum §1.1) pero ningún generador la emite: GAP-RECOMPONE. Un objeto que es instrumento en el nivel abstracto PUEDE figurar como afectado en el hijo solo si el cambio neto del proceso abstracto es cero (R-ROL-1); ese cambio de rol aplica a descomposición, no a despliegue (R-ROL-2).

**Traza a código**: generación `app/src/opl/generadores/refinamiento.ts·oracionDescomposicion` (verbo `se descompone en`, líneas ~93, ~102) y `oracionParalelo` (~106, `ocurren en paralelo`); orden temporal en `describirProcesosTemporales` / `compararOrdenTemporal` (~150). Parseo: GAP-CX-PARSER.

Rationale: `reglas §4.11` (CX1, CX2), `§8.1`–`§8.2`, `§8.9` y `opm-opl-es §10.1`.

### §7.2 Despliegue / plegado de cosa (unfolding / folding, CX3, CX5, CX6)

**ID**: CX3 (despliegue), CX5/CX6 (plegado de proceso/objeto, GAP-PLIEGA).

**Plantilla(s)**:
- CX3 (despliegue genérico): `**Cosa** se despliega en SD1 en **T1**, **T2** y **T3**.`
- Despliegue por relación fundamental (la superficie reusa el verbo de la relación, no `se despliega`):
  - agregación: `**Todo** se despliega en **Parte1** y **Parte2**.`
  - exhibición: `**Exhibidor** exhibe **Atributo1**, así como *Operación1*.`
  - generalización: `**Especial1** y **Especial2** son **General**.`
  - clasificación: `**Inst1** y **Inst2** son instancias de **Clase**.`
- CX5/CX6 (plegado): `*Proceso* se pliega en el OPD padre.` · `**Objeto** se pliega en el OPD padre.`

**Emisión**: cuando una **cosa** porta un refinamiento `despliegue` con `≥ 2` refinadores (R-CX-0), se emite la oración de despliegue. El **modo** se resuelve por la relación fundamental dominante en el OPD hijo (agregación, exhibición, generalización, clasificación) según `modoDespliegue`; si el modo es una de las cuatro fundamentales, la superficie emitida reusa el verbo de esa relación (`consta de`/`se despliega en`, `exhibe`, `son`/`es un`, `son instancias de`), no una forma genérica `se despliega`. El despliegue revela estructura estática y NO implica orden temporal (R-REF-SYNC-2): NUNCA DEBE añadir `en esa secuencia`.

**Supresión**: placeholder NO emite. Menos de 2 refinadores NO emite (R-CX-0). El **plegado** (CX5, CX6) suprime los hechos refinados en el OPD ascendente; su oración solo describe la operación de abstracción y NO reemplaza la gramática del hecho interno.

**Reglas duras**:
- **R-CX-DESP-1**: el despliegue DEBE aplicarse **por relación fundamental** (agregación, exhibición, generalización o clasificación); NO DEBE mezclar dos relaciones fundamentales en una sola oración de despliegue.

  Rationale: `reglas §8.1` (R-REF-MEC-1: `SSOT-iso §Mecanismos`).
- **R-CX-DESP-2**: el despliegue NO DEBE portar marca temporal (`en esa secuencia`, `paralelo`); es asíncrono respecto del flujo de control.

  Correcto: `**Pedido** se despliega en **Cabecera** y **Línea**.`
  Incorrecto: `**Pedido** se despliega en **Cabecera** y **Línea**, en esa secuencia.`
  Rationale: `reglas §8.2` (R-REF-SYNC-2).

**Tokenización**: span de la **cosa** desplegada con `ref`; verbo de la relación fundamental (token del enum §1.1); span de cada **refinador** con `ref`; `así como` separa atributos de operaciones en exhibición; el span `SD1` (CX3) lleva `ref` al OPD persistente, no a la etiqueta (R-CX-2). En plegado: `se pliega en` token-verbo (GAP-PLIEGA); `el OPD padre` referencia al ascendente.

**Orden**: **cosa** → verbo de relación → lista de refinadores [`, así como` lista heterogénea]. CX3: **cosa** → `se despliega en` → `SD1` → `en` → lista. Plegado: **cosa** → `se pliega en` → `el OPD padre`.

**Composabilidad**: la lista de refinadores es **destino-enumerado** dentro de la única oración de despliegue. Aplica la **zona prohibida de composición en contexto de despliegue** (§7.7): los enlaces estructurales de los refinadores NO se fusionan en plural al desplegar; cada enlace conserva su token-verbo y `ref`. NO DEBE coordinarse con descomposición ni con enlaces procedimentales.

**Reverse**: la oración de despliegue por relación fundamental se parsea por las regex estructurales de §6 (`consta de`, `exhibe`, `son`, `son instancias de`) reconstruyendo el refinamiento `despliegue`. `parser.designacionesPlegado.test.ts` defiende el reverse del plegado parcial (designaciones de estado bajo plegado). GAP-PLIEGA: la oración autónoma `se pliega en el OPD padre` (CX5/CX6) tiene verbo canónico pero ningún generador la emite ni regex dedicada la parsea.

**Roundtrip**: la cosa desplegada, el modo (relación fundamental), la lista de refinadores y el estado de plegado parcial DEBEN preservarse. El plegado parcial (mostrar N partes y suprimir el resto con `al menos otro/a`) se realiza en `plegado.ts·oracionPlegadoParcial` y se defiende en `parser.designacionesPlegado.test.ts`.

**Edge cases**: en despliegue por agregación las partes viven **fuera** del contenedor del padre y se conectan por enlaces estructurales canónicos; la pertenencia se determina por presencia en el OPD hijo, no por contención espacial (a diferencia de la descomposición, ver `aparienciasInternasDeRefinamiento`). El despliegue NO admite cambio de rol instrumento↔afectado (R-ROL-2).

**Traza a código**: generación `app/src/opl/generadores/refinamiento.ts·oracionDespliegue` (modo agregación `se despliega en` ~76; exhibición `exhibe` ~77; generalización `son`/`es un` ~78; clasificación `son instancias de`/`es una instancia de` ~79) y `modoDespliegue`/`modoPorTipoEnlace` (~109, ~120); plegado parcial `app/src/opl/generadores/plegado.ts·oracionPlegadoParcial`; agrupación por OPD en `app/src/opl/bloquesJerarquicos.ts·agruparOracionesPorOpd`; reverse de plegado `app/src/opl/parser/parser.designacionesPlegado.test.ts`. GAP-PLIEGA para `se pliega en` autónomo.

Rationale: `reglas §4.11` (CX3, CX5, CX6), `§8.1`–`§8.2`, `§8.5`–`§8.6` y `opm-opl-es §10.2`, `§10.5`.

### §7.3 Refinamiento explícito entre OPDs (CX4)

**ID**: CX4 (GAP-REFINA en generación autónoma).

**Plantilla(s)**:
- Descomposición: `SD se refina por descomposición de *Proceso* en SD1.`
- Despliegue: `SD se refina por despliegue de **Cosa** en SD1.`

**Emisión**: la arista del árbol OPD entre un OPD padre y su hijo tiene semántica equivalente a `se refina por descomposición de … en` o `se refina por despliegue de … en` (R-ARB-4). El OPL completo del sistema se obtiene concatenando los párrafos locales en orden de navegación del árbol (R-OPL-TOTAL-1), no describiendo un solo contexto.

**Supresión**: NO se emite para un nodo que no cierra como refinamiento canónico (R-CX-0).

**Tokenización**: span `SD`/`SD1` con `ref` al OPD persistente (R-CX-2); `se refina por descomposición de`/`se refina por despliegue de` token-verbo (enum §1.1, GAP-REFINA); span de la cosa refinada con `ref`.

**Reverse**: GAP-REFINA: el verbo `se refina` es canónico pero ningún generador de `app/src/opl/generadores/` lo emite como oración autónoma ni regex de `parsear.ts` lo parsea; el árbol OPD se materializa por la estructura del modelo, no por oraciones CX4 emitidas. Cobertura bidireccional ausente.

**Roundtrip**: si se materializara, el OPD padre, el OPD hijo y la cosa refinada DEBERÍAN preservarse vía identidad persistente. Hoy GAP-REFINA.

**Traza a código**: la jerarquía de OPDs se ordena en `app/src/opl/bloquesJerarquicos.ts·ordenarOpdsParaOpl` / `profundidadOpd`; no hay generador de la oración CX4 (GAP-REFINA).

Rationale: `reglas §4.11` (CX4), `§8.10` (R-ARB-4, R-OPL-TOTAL-1..5) y `opm-opl-es §10.3`.

### §7.4 Expresión / supresión de estados como refinamiento

**ID**: CX-EST (mecanismo de estados de §8.1).

**Plantilla(s)**: reusa la enumeración de estados de §2.3 (`**Objeto** puede estar \`s1\`, \`s2\` o \`s3\`.`) y la designación de §2.4. La expresión de estados ES el refinamiento; la supresión de estados ES la abstracción correspondiente.

**Emisión**: en un OPD donde un **objeto** tiene estados visibles, se emite la enumeración (§2.3). En un OPD ascendente que abstrae esos estados, la enumeración se suprime (el objeto figura solo como span). El OPL de un OPD DEBE expresar solo los estados **visibles o referenciados en ese OPD** (R-OPL-TOTAL-4); el conjunto completo de estados de un objeto es la unión a través de todos los OPDs del modelo (R-OPL-TOTAL-5).

**Reglas duras**:
- **R-CX-EST-1**: la expresión de estados DEBE usar `puede estar` (remite §1.2 R-VERB-EST-1, §2.3 R-ENT-EST-1); NUNCA `puede ser`.

  Rationale: `reglas §4.3` y `§8.1` (mecanismo de estados).
- **R-CX-EST-2**: la supresión de estados en un OPD ascendente NO DEBE borrar los estados del modelo; solo los oculta en la realización local de ese OPD.

  Rationale: `reglas §8.10` (R-OPL-TOTAL-4, R-OPL-TOTAL-5).

**Tokenización**: igual que §2.3 (span de objeto con `ref`, cada `estado` con `ref`).

**Reverse**: igual que §2.3 (`puede estar` parseable como declaración de estados del objeto).

**Roundtrip**: el conjunto de estados visibles por OPD DEBE preservarse; el roundtrip por-OPD respeta R-OPL-TOTAL-4.

**Traza a código**: `app/src/opl/generadores/duracionMetadata.ts·oracionEstados` (vía §2.3); visibilidad por OPD en `bloquesJerarquicos.ts·agruparOracionesPorOpd`.

Rationale: `reglas §8.1` (expresión/supresión de estados), `§8.10` (R-OPL-TOTAL-4, R-OPL-TOTAL-5) y `opm-opl-es §3.2`.

### §7.5 Descomposición síncrona vs despliegue asíncrono

**ID**: CX-SYNC.

**Distinción normativa**:
- **R-CX-SYNC-1**: la **descomposición** (in-zoom, §7.1) es **síncrona**: el proceso padre espera a que todos los subprocesos completen antes de devolver el control; su realización OPL PUEDE portar orden temporal (`en esa secuencia`, `paralelo`).

  Rationale: `reglas §8.2` (R-REF-SYNC-1).
- **R-CX-SYNC-2**: el **despliegue** (unfold, §7.2) es **asíncrono** respecto del flujo de control: revela estructura estática y NO implica secuenciación; su realización OPL NO DEBE portar orden temporal.

  Correcto: `*Cocinar* se descompone en *Preparar Masa*, *Preparar Relleno* y *Hornear*, en esa secuencia.` (síncrona, ordenada)
  Correcto: `**Empanada** se despliega en **Masa** y **Relleno**.` (asíncrona, sin orden)
  Incorrecto: `**Empanada** se despliega en **Masa** y **Relleno**, en esa secuencia.` (orden temporal en despliegue)
  Rationale: `reglas §8.2` (R-REF-SYNC-2).

**Traza a código**: la distinción se materializa en el bucle de `refinamiento.ts·oracionesRefinamiento` (itera `["descomposicion", "despliegue"]`); solo la descomposición de proceso consulta `describirProcesosTemporales` y emite `en esa secuencia`/`paralelo`; el despliegue (`oracionDespliegue`) nunca añade marca temporal.

Rationale: `reglas §8.2` (R-REF-SYNC-1, R-REF-SYNC-2) y `opm-opl-es §10.1`–`§10.2`.

### §7.6 Distribución de enlaces al descomponer

**ID**: CX-DIST.

**Matriz de distribución** (al descomponer un *proceso* en subprocesos):

| Tipo de enlace | Contorno exterior del padre | Distribución al hijo |
| --- | --- | --- |
| Consumo (T1, TS1) | **PROHIBIDO** | migra al **primer** subproceso |
| Resultado (T2, TS2) | **PROHIBIDO** | migra al **último** subproceso |
| Efecto básico (T3, sin estado) | PERMITIDO | a **todos** los subprocesos |
| Efecto entrada-salida (TS3) | — | **escisión** TS4/TS5 (§7.6.1, remite §3) |
| Agente | PERMITIDO | a **todos** los subprocesos |
| Instrumento | PERMITIDO | a **todos** los subprocesos |
| Estructural | NO se distribuye | permanece en el contenedor |
| Evento sistémico | **PROHIBIDO** cruzar frontera | — |
| Evento ambiental | permitido cruzar | con modelado de contingencia |

**Reglas duras**:
- **R-CX-DIST-1**: consumo y resultado NO DEBEN conectarse al contorno exterior de un *proceso* descompuesto; DEBEN conectarse al subproceso específico (consumo→primero, resultado→último).

  Rationale: `reglas §8.5` (R-DIST-1, R-DIST-1A: `V-37`, `V-103`).
- **R-CX-DIST-2**: un evento **sistémico** NO DEBE cruzar la frontera del proceso descompuesto; un evento ambiental PUEDE cruzarla con modelado de contingencia.

  Rationale: `reglas §8.5` (`V-38`, `V-108`).

**Efecto en OPL**: la migración de un enlace al subproceso correcto cambia el **sujeto/complemento** de la oración transformadora en el OPL del OPD hijo: `*ProcesoPadre* consume **X**` (en el padre) se realiza como `*PrimerSubproceso* consume **X**` (en el hijo). La identidad del hecho (mismo enlace) DEBE preservarse a través de la migración (R-OPD-OP-4).

#### §7.6.1 Enlaces escindidos (remite §3 TS4/TS5)

- **R-CX-ESC-1**: cuando un efecto entrada-salida (TS3) `*P* cambia **A** de \`s1\` a \`s2\`` se descompone, el modelo queda subespecificado hasta **escindir** el enlace en dos fragmentos (TS4/TS5).
- **R-CX-ESC-2**: el subproceso **temprano** recibe el fragmento de entrada (TS4) y saca al objeto del estado de entrada: `*P1* cambia **A** de \`s1\`.`
- **R-CX-ESC-3**: el subproceso **tardío** recibe el fragmento de salida (TS5) y coloca al objeto en el estado de salida: `*P2* cambia **A** a \`s2\`.`
- **R-CX-ESC-4**: los fragmentos escindidos NO DEBEN portar modificador de control (`e`/`c`); la prohibición aplica al fragmento escindido, no al efecto parcial standalone (R-ESCIND-0, remite §3 TS4/TS5).

  Rationale: `reglas §8.4` (R-ESCIND-0..3, R-ESC-1: `V-40`, `V-41`, `V-110`) y §3 (TS4/TS5).

**Traza a código**: la distribución y migración de enlaces es operación de modelo (descomposición como operación de herramienta, `reglas §8.11`); la realización OPL por OPD se proyecta vía `bloquesJerarquicos.ts·agruparOracionesPorOpd`, que asigna cada oración transformadora al OPD donde reside su enlace. La escisión TS4/TS5 se canoniza en §3.

Rationale: `reglas §8.4`–`§8.5`, `§8.11` y `opm-opl-es §10`.

### §7.7 Zona prohibida de composición en contexto de refinamiento / despliegue

Esta subsección es el **preludio de §9** y fija la frontera de la coordinación copulativa cuando un enlace participa de un contexto de refinamiento o despliegue. Es la lección de BUG-f897bc: agrupar enlaces hijos en una oración plural dentro de un contexto de refinamiento colisiona con la realización del refinamiento y borra tokens/refs por enlace.

**Reglas duras**:
- **R-CX-COMP-1**: los enlaces de los refinadores (subprocesos de una descomposición, partes/especializaciones/instancias/rasgos de un despliegue) NO DEBEN fusionarse en una oración plural única; cada enlace DEBE emitirse en su propia oración, preservando su **token-verbo** y su **`ref` por enlace**.

  Correcto:
  `**Especial1** son **General**.` no aplica aquí; en contexto de despliegue de generalización se emite por enlace:
  `**Auto** es un **Vehículo**.` seguido de `**Camión** es un **Vehículo**.` (un enlace, una oración, refs preservados)
  Incorrecto (zona prohibida): fusionar a `**Auto** y **Camión** son **Vehículo**.` cuando el contexto es el **despliegue de generalización-especialización** del refinamiento de **Vehículo**, porque la agrupación borra el token-verbo y la `ref` por enlace que el refinamiento necesita para mapear cada refinador a su arista.
  Rationale: BUG-f897bc — agrupar «A, B y C son X» colisiona con la realización del despliegue (HU-50.015), borra tokens/refs por enlace y rompe la bisimetría del refinamiento; remite §9.

- **R-CX-COMP-2**: la coordinación copulativa de §9 (predicados con sujeto-proceso compartido, destino-enumerado de estructurales) DEBE excluir explícitamente el contexto de refinamiento/despliegue de su dominio de aplicación. La detección de candidatos a coordinación NO DEBE activarse sobre enlaces que pertenecen a un OPD hijo de refinamiento.

  Rationale: la composabilidad de §3, §5 y §6 declara «zona prohibida de composición en refinamiento/despliegue» precisamente para sellar esta colisión; §9 canoniza la coordinación general bajo esa exclusión.

- **R-CX-COMP-3**: dentro de la **propia** oración de refinamiento (CX1–CX3), la lista de refinadores SÍ es un destino-enumerado legítimo (un solo verbo `se descompone en`/`se despliega en`, varios spans con `ref`); lo prohibido es coordinar **los enlaces de esos refinadores entre sí** en una oración plural separada. La enumeración interna de la oración de refinamiento y la coordinación de enlaces hijos son hechos distintos.

  Rationale: distinguir la enumeración de refinadores (un hecho de refinamiento) de la fusión de enlaces hijos (varios hechos de enlace) evita reintroducir BUG-f897bc por sobre-aplicación de R-CX-COMP-1.

**Traza a código**: la agrupación por OPD (`bloquesJerarquicos.ts·agruparOracionesPorOpd`) mantiene cada enlace hijo como oración independiente dentro del bloque del OPD; la oración de refinamiento (`refinamiento.ts·oracionDescomposicion`/`oracionDespliegue`) enumera refinadores pero NO coordina sus enlaces. GAP-COMP-GUARDA: no existe hoy un guard explícito que prohíba programáticamente la coordinación de enlaces en contexto de refinamiento; la protección es por construcción (cada enlace genera su propia oración), no por una aserción dedicada — §9 DEBE materializar el guard.

Rationale: BUG-f897bc, `reglas §9` (bisimetría OPD↔OPL) y las cláusulas «zona prohibida» de §3.1–§3.3, §6.3–§6.6.

### §7.8 GAPs de cobertura — refinamiento / gestión de contexto

- GAP-CX-PARSER: la oración `se descompone en` (CX1/CX2) se genera (`refinamiento.ts·oracionDescomposicion`) pero `parsear.ts` no expone regex dedicada que la reconstruya como refinamiento `descomposicion`; reverse ausente.
- GAP-PLIEGA: el verbo `se pliega en` (CX5/CX6) es canónico (enum §1.1) pero ningún generador emite la oración autónoma de plegado total ni regex la parsea; solo existe el plegado **parcial** (`plegado.ts·oracionPlegadoParcial`, defendido por `parser.designacionesPlegado.test.ts`).
- GAP-RECOMPONE: el verbo `se recompone desde` (CX7/CX8) es canónico pero sin generador ni parser.
- GAP-REFINA: la oración explícita `se refina por descomposición/despliegue de … en` (CX4) es canónica pero sin generador autónomo ni parser; el árbol OPD se materializa por estructura del modelo.
- GAP-FIXTURE-DESCOMPOSICION: no hay fixture roundtrip dedicado de descomposición/despliegue en `fixtures-roundtrip.ts`; la simetría se apoya en los generadores de `refinamiento.ts` y en `parser.designacionesPlegado.test.ts` (solo plegado parcial).
- GAP-COMP-GUARDA: no hay guard programático que prohíba la coordinación de enlaces hijos en contexto de refinamiento (R-CX-COMP-1/2); la protección es por construcción y §9 DEBE materializarla.

## §8 Combinatoria a nivel de modelo

Las secciones §3–§7 canonizan cada constructo por separado. Esta sección canoniza el **producto cartesiano gobernado** de cómo esos constructos coexisten sobre un mismo enlace o sobre un mismo abanico en una situación de modelo real, especialmente las situaciones que aparecen al modelar sistemas sociotécnicos y agénticos complejos. El espacio combinatorio es:

```
rol (consumo | resultado | efecto | agente | instrumento)
  × modificador de control (evento | condición | excepción | ninguno)
  × multiplicidad / cardinalidad (?, *, 1..1, +)
  × abanico (XOR | OR | AND)
  × probabilidad (Pr=p)
  × ruta (por ruta L)
```

No todas las celdas son válidas. Esta sección fija qué combinaciones son **válidas**, cuáles **inválidas** (error de categoría o de asimetría), y cuáles **no-canonizadas** (silencio de la SSOT). Para autosuficiencia, consolida AQUÍ la fuerza semántica de colisión de rol (`reglas §6.5`) y la matriz de precedencia transformadora de recomposición (`reglas §6.6`).

Rationale: `reglas §6.4`–`§6.8`, `§7`, `§11.2` y `opm-opl-es §11`–`§13`; un constructo aislado es legible por su sección, pero su combinación con otro abre celdas que ninguna sección individual gobierna.

### §8.0 Reglas duras de combinación

- **R-COMB-1**: una combinación NO listada como válida ni como inválida en esta sección DEBE clasificarse como **no-canonizada**; la generación NO DEBE emitirla y el parser NO DEBE construirla. NO DEBE inventarse primitiva, verbo ni glifo nuevo para llenar el silencio.

  Rationale: `reglas §11.2` (R-ZNC-1, R-ZNC-2): la herramienta NO inventa canon OPM nuclear para una zona no canonizada.

- **R-COMB-2** (INPUT-only se conserva bajo combinación): cualquier combinación que coloque un modificador `e`/`c` sobre un extremo Post(P) (resultante, afectado post-transición) es **inválida**, sin importar el abanico, la multiplicidad, la probabilidad o la ruta que la acompañen. La combinatoria NO levanta la restricción INPUT-only de §5.0 (R-MOD-INPUT-1/2).

  Rationale: `reglas §6.3` (R-MOD-4), §3.0 y §5.0 de esta spec.

- **R-COMB-3** (un solo modificador por enlace): un enlace base PUEDE portar **a lo sumo un** modificador de control. La combinación `c` + `e` sobre el mismo enlace es **no-canonizada** (§8.4); excepción y modificador (`e`/`c`) no coexisten sobre el mismo enlace porque la excepción es familia autónoma proceso→proceso, no anotación de enlace.

  Rationale: `reglas §6.4` (`c` + `e` = no definido), `§11.2` (AP-28) y §5.3 (naturaleza de la excepción).

- **R-COMB-4** (orden de composición superficial): cuando varias dimensiones coinciden sobre una misma oración, el orden de los marcadores en la superficie DEBE ser estable: `[Por ruta L,] <abanico con cuantificador> <enlace base> [en \`estado\`] [, modificador de evento/condición] [(probabilidad: p)]`. La ruta precede; la probabilidad cierra. Un orden distinto rompe el roundtrip.

  Rationale: `abanico.ts` resuelve primero ruta (líneas 17, 34), luego abanico, luego condicional; `procedural.ts·sufijoProbabilidad` (línea 421) añade la probabilidad como sufijo final.

- **R-COMB-5** (la ruta gana al agrupamiento de abanico): si **algún** enlace de un abanico porta etiqueta de ruta, el abanico NO DEBE realizarse como oración agrupada; DEBE emitirse **una oración por enlace** con prefijo `Por ruta L,`. Ruta y agrupamiento de fan son mutuamente excluyentes en la superficie.

  Rationale: `abanico.ts·oracionesAbanico` (líneas 34–39): la presencia de ruta degrada el fan a emisión por enlace.

- **R-COMB-6** (multiplicidad y rol coexisten sin colisión): la multiplicidad anota un extremo de enlace; NO es un modificador de control ni altera el rol. PUEDE combinarse con cualquier rol, abanico o modificador admisible para ese rol. La multiplicidad NO DEBE aplicarse directamente a un *proceso* (R-MULT-1A).

  Rationale: `reglas §6.7` (R-MULT-1, R-MULT-1A).

### §8.1 Abanicos lógicos XOR / OR / AND

**ID**: FAN-XOR, FAN-OR, FAN-AND.

**Naturaleza**: un abanico agrupa `n ≥ 2` enlaces del **mismo rol** que comparten un puerto convergente o divergente. El operador fija cuántas ramas se activan: **AND** (todas), **XOR** (exactamente una), **OR** (al menos una).

**Plantillas OPL** (cuantificador antes de la lista en el extremo del fan):

| Operador | Marcador OPL | Activación |
| --- | --- | --- |
| AND | (implícito) — una oración por enlace, sin cuantificador | todas las ramas |
| XOR | `exactamente uno de` | exactamente una rama |
| OR | `al menos uno de` | al menos una rama |

- **R-FAN-1** (AND = ausencia de arco): el AND NO se realiza con marcador léxico; se realiza emitiendo **una oración base por enlace** (varias oraciones T1/T2/T3/H\* separadas con el mismo puerto). NO DEBE inventarse un cuantificador `todos de`.

  Correcto: `*Cocinar* consume **Agua**.` seguido de `*Cocinar* consume **Sal**.` (abanico AND de consumo convergente)
  Incorrecto: `*Cocinar* consume todos de **Agua** y **Sal**.`
  Rationale: `reglas §7.1` (AND = enlaces separados sin arco) y `opm-opl-es §11.1`.

- **R-FAN-2** (XOR/OR según puerto): el cuantificador se inserta en el extremo del fan. En fan **convergente** (N→1) el cuantificador precede la lista de orígenes; en **divergente** (1→N) precede la lista de destinos.

  Correcto (consumo convergente XOR): `*Procesar* consume exactamente uno de **A**, **B** o **C**.`
  Correcto (resultado divergente OR): `*Procesar* genera al menos uno de **A**, **B** o **C**.`
  Rationale: `reglas §7.2`–`§7.3`, `abanico.ts·oracionAbanico` (líneas 76, 96–121) y `opm-opl-es §11.2`–`§11.3`.

- **R-FAN-3** (combinación abanico × modificador — condición): un abanico cuyos enlaces TODOS portan `c` **del mismo rol** se realiza con el patrón condicional sobre la oración de fan (no como C\* individuales por rama). Un abanico mixto (algunos `c`, otros sin control) NO DEBE realizarse con el patrón condicional; recae en la oración de fan directa.

  Correcto: `*Procesar* ocurre si exactamente uno de **A**, **B** o **C** existe, en cuyo caso *Procesar* consume exactamente uno de **A**, **B** o **C**, de lo contrario *Procesar* se omite.`
  Rationale: `abanico.ts·oracionAbanico` (líneas 89–94: `todosCondicionales && mismoTipo`) y `oracionAbanicoCondicional` (líneas 145–190); `reglas §7.4` y `opm-opl-es §11.4`.

- **R-FAN-4** (combinación abanico × modificador — evento): un abanico bajo evento se realiza insertando `inicia` antes del verbo de la oración de fan (`**B** inicia exactamente uno de *P*, *Q* o *R*, que afecta **B**`). El evento sobre fan, como todo evento, es INPUT-only (R-COMB-2): NO DEBE aplicarse a un fan de resultado.

  Rationale: `reglas §7.4` (Evento + XOR/OR) y §5.1. GAP-FAN-EVENTO: ningún generador de `app/src/opl/generadores/abanico.ts` emite la forma de fan con `inicia`; solo existe la forma condicional (`oracionAbanicoCondicional`). La forma de evento sobre fan está canonizada pero sin generador.

- **R-FAN-5** (estado especificado por rama): cada enlace de un fan PUEDE portar estado especificado independientemente. Cuando todas las ramas de un fan de consumo/resultado/efecto difieren solo por el `estado` de un mismo objeto, el fan se realiza como cambio de estado agrupado: `*P* cambia **Obj** a exactamente uno de \`s1\`, \`s2\` o \`s3\`.` (resultado/efecto saliente) o `*P* cambia **Obj** de exactamente uno de \`s1\`, \`s2\`.` (consumo/efecto entrante).

  Rationale: `reglas §7.4` (R-FAN-EST-1) y `abanico.ts·oracionAbanicoEstados` (líneas 192–229).

- **R-FAN-6** (probabilidad solo dentro de fan XOR): la anotación de probabilidad `Pr=p` SOLO es canónica **dentro de un abanico probabilístico**, que DEBE ser siempre XOR, con exactamente una rama activa por ejecución y suma de probabilidades `1.0`. Un `Pr=p` sobre un enlace **sin** abanico es **no-canonizado** (§8.4).

  Rationale: `reglas §6.8` (R-PROB-1, R-PROB-1A), `§7.4` (R-FAN-PROB-1), `§11.2` (zona: «enlace probabilístico sin fan no tiene canonicidad»). GAP-PROB-SUPERFICIE: `procedural.ts·sufijoProbabilidad` (línea 421) emite la probabilidad como sufijo `(probabilidad: 40%)`, NO como `Pr=p` por rama; la superficie del código diverge del canon `Pr=p` y no liga la probabilidad a un fan XOR. La spec manda `Pr=p` por rama dentro de fan XOR.

- **R-FAN-7** (resultado-fan-XOR como expansión de resultado a objeto con estados): un resultado simple hacia un **objeto** con `n` estados es semánticamente equivalente a un fan XOR de resultados con estado, uno por estado, cada uno con probabilidad `1/n` por defecto. Esta equivalencia NO autoriza modificadores `e`/`c` sobre el fan: las ramas siguen produciendo elementos de Post(P).

  Rationale: `reglas §7.5` (`V-19`).

- **R-FAN-8** (m-de-f combinatorial): para fan-size `f > 2`, el modelador PUEDE generalizar a `exactamente m de f` (XOR combinatorial) o `al menos m de f` (OR combinatorial), con `m < f`, anotando `m` junto al arco. Es extensión declarada del cuantificador, no primitiva nueva.

  Rationale: `reglas §7.6` (R-FAN-M-1..4). GAP-FAN-M: sin generador para `m de f`; `abanico.ts` solo emite `exactamente uno de` / `al menos uno de`.

### §8.2 Multiplicidad / cardinalidad en combinación con rol y abanico

**ID**: MULT-COMB.

**Plantillas** (`opm-opl-es §12`): `?` → `un/una opcional`; `*` → `opcional (cero o más)`; `1..1` → sin marcador (default); `+` → `al menos un/una`. Rangos `qmín..qmáx`; intervalos `[a..b]`, `(a..b]`, `[a..b)`, `(a..b)`; listas `[1..10], [20..30]`; `*` como extremo abierto.

- **R-MULT-COMB-1**: la multiplicidad anota un **extremo** del enlace (origen o destino) y concuerda en número con el verbo cuando fuerza plural (`*Procesos* generan **Objeto**`). PUEDE coexistir con cualquier rol y con el modificador de control admisible para ese rol.

  Rationale: `reglas §6.7` (R-MULT-1); `procedural.ts` líneas 174–175, 384–387 (`multiplicidadPlural`, `nombreOplExtremo`).

- **R-MULT-COMB-2**: dentro de un abanico, la multiplicidad de cada rama se realiza por extremo vía `nombreOplExtremo`; la multiplicidad del fan **no** sustituye al cuantificador XOR/OR. Cuantificador (cuántas ramas) y multiplicidad (cuántas instancias por rama) son dimensiones ortogonales.

  Rationale: `abanico.ts·extremoOpuestoAbanico` (líneas 244–254) propaga `multiplicidadOrigen`/`multiplicidadDestino` por rama; `nombreOplExtremo` (importado en línea 6).

- **R-MULT-COMB-3**: los nombres de parámetros de multiplicidad DEBEN ser únicos en todo el modelo; la repetición secuencial de un *proceso* NO DEBE expresarse con multiplicidad sobre el proceso, sino con proceso recurrente + contador; la paralela, con subprocesos síncronos/asíncronos.

  Rationale: `reglas §6.7` (R-MULT-2, R-MULT-1A..1C).

### §8.3 Matriz de combinaciones relevantes

Para cada combinación con relevancia semántica/lógica, su **estatus**, la plantilla OPL compuesta y la regla de resolución de colisión. Estatus ∈ {válida, inválida, no-canonizada}.

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
| C-19 | cualquier transformador/habilitador × evento × XOR/OR (INPUT-only) | válida (canon) / GAP código | `**B** inicia exactamente uno de *P*, *Q* o *R*, que afecta **B**.` | R-FAN-4; GAP-FAN-EVENTO |
| C-20 | resultado × condición × XOR/OR | **inválida** | — | R-COMB-2; GAP-FAN-RESULTADO-COND (`abanico.ts` línea 176 emite `puede generarse`, no canónico) |
| C-21 | consumo/resultado/efecto × — × XOR (ramas = estados de un objeto) | válida | `*P* cambia **Obj** a exactamente uno de \`s1\`, \`s2\` o \`s3\`.` | R-FAN-5; R-FAN-7 |
| C-22 | resultado × — × XOR × probabilidad (fan probabilístico) | válida (canon) / GAP superficie | `*P* genera exactamente uno de **A** \`Pr=0.6\`, **B** \`Pr=0.4\`.` | R-FAN-6; suma=1; GAP-PROB-SUPERFICIE |
| C-23 | cualquier rol × — × — × probabilidad (sin fan) | **no-canonizada** | — | R-FAN-6; `reglas §11.2` (probabilístico fuera de fan sin canonicidad) |
| C-24 | consumo/resultado × modificador/abanico/multiplicidad × **ruta** | válida | `Por ruta L1, *P* consume **A**.` | R-COMB-5; una oración por enlace, ruta degrada el fan |
| C-25 | agente/instrumento × — × ruta | **no-canonizada** | — | `reglas §11.2` (ruta sobre habilitadores no canonizada; `opm-opl-es §13` solo consumo/resultado) |
| C-26 | cualquier enlace × `c` + `e` (mismo enlace) | **no-canonizada** | — | R-COMB-3; §8.4 |
| C-27 | estructural × `e`/`c` | **inválida** | — | error de categoría (R-MOD-CAT-1, AP-09) |
| C-28 | invocación × `e`/`c` | **inválida** | — | error de categoría (R-MOD-CAT-1, AP-10); usar nodo de decisión booleano |
| C-29 | enlace escindido TS4/TS5 × `e`/`c` | **inválida** | — | R-MOD-CAT-2 (`V-41`, `V-110`) |
| C-30 | colisión de rol — dos enlaces procedimentales objeto↔mismo proceso | resolución | (prevalece el de mayor fuerza) | R-COL-FUERZA (§8.3.1) |
| C-31 | recomposición — dos subprocesos, distinto rol hacia el mismo objeto | resolución | (matriz de precedencia) | R-COL-PREC (§8.3.2) |

#### §8.3.1 Fuerza semántica de colisión de rol (consolidado de `reglas §6.5`)

Cuando un **objeto** tendría dos enlaces procedimentales hacia el **mismo** *proceso* (violando la unicidad de enlace procedimental), prevalece el de mayor fuerza. Orden principal: `consumo = resultado > efecto > agente > instrumento`. Orden secundario por control dentro de cada clase: `evento > sin control > condición`.

Orden completo de **12 niveles** (de más fuerte a más débil):

| Nivel | Enlace | Nivel | Enlace |
| --- | --- | --- | --- |
| 1 | Evento de consumo | 7 | Evento de agente |
| 2 | Consumo = Resultado | 8 | Agente |
| 3 | Condición de consumo | 9 | Condición de agente |
| 4 | Evento de efecto | 10 | Evento de instrumento |
| 5 | Efecto | 11 | Instrumento |
| 6 | Condición de efecto | 12 | Condición de instrumento |

- **R-COL-FUERZA-1**: ante colisión de rol, la herramienta DEBE conservar el enlace de **menor número de nivel** (mayor fuerza) y reportar el desplazado; los niveles 1 y 3 contienen **consumo** únicamente — el resultado NUNCA DEBE aparecer con modificador (R-COMB-2). La condición de instrumento (nivel 12) es el enlace más débil del sistema.

  Rationale: `reglas §6.5` (R-FUERZA-1..4); el modificador `c` debilita y `e` fortalece respecto del enlace base.

#### §8.3.2 Matriz de precedencia transformadora en recomposición (consolidado de `reglas §6.6`)

Al recomponer (out-zoom) dos subprocesos con distinto enlace hacia el mismo **objeto**, el enlace del padre se determina por:

| B↔P1 \ B↔P2 | Efecto | Resultado | Consumo |
| --- | --- | --- | --- |
| **Efecto** | Efecto | Resultado | Consumo |
| **Resultado** | Resultado | **Inválido** | Efecto |
| **Consumo** | Consumo | Efecto | **Inválido** |

- **R-COL-PREC-1**: Resultado+Resultado y Consumo+Consumo sobre el mismo objeto al recomponer son **inválidos** (`V-43`); el nivel hijo DEBE corregirse antes de recomponer (AP-30).
- **R-COL-PREC-2**: Resultado+Consumo (o Consumo+Resultado) DEBE recomponerse como **Efecto** SOLO si hay continuidad de identidad y estados trazables; en su ausencia DEBE reportarse como conflicto, NO colapsarse automáticamente (R-PREC-2..4).
- **R-COL-PREC-3**: un enlace **transformador** SIEMPRE prevalece sobre un **habilitador** al recomponer (`V-44`).

  Rationale: `reglas §6.6` (R-PREC-1..5).

### §8.4 Zonas no-canonizadas explícitas

Las siguientes combinaciones son **silencios de la SSOT** (`reglas §11.2`, R-ZNC-1/2): NO están prohibidas explícitamente ni canonizadas. Se marcan **no-canonizadas**; la generación NO DEBE emitirlas, el parser NO DEBE construirlas, y NUNCA DEBE inventarse primitiva para llenarlas.

| Zona no-canonizada | Estado | Fundamento |
| --- | --- | --- |
| `c` + `e` sobre el **mismo** enlace | No definida en gramática OPL ni en geometría visual | `reglas §6.4`, `§11.2` (AP-28); R-COMB-3 |
| `Pr=p` sobre un enlace **sin** abanico | `Pr=p` solo se define dentro de fans XOR (`V-18`); fuera no tiene canonicidad | `reglas §11.2`; R-FAN-6 |
| Etiqueta de **ruta** sobre enlace habilitador (agente/instrumento) | `opm-opl-es §13` canoniza ruta solo para consumo/resultado | `reglas §11.2`; C-25 |
| Fan de **resultado** bajo condición (`puede generarse`) | El código emite `puede generarse` (`abanico.ts` línea 176) — vocabulario fuera del enum §1.1 | C-20; viola R-COMB-2 |
| Fan **mixto** (algunas ramas `c`, otras sin control) bajo patrón condicional | El canon no define la realización condicional de un fan parcialmente condicional | R-FAN-3 (recae en fan directo, no en patrón condicional) |

- **R-ZNC-COMB-1**: ante una de estas zonas, la herramienta DEBE o bien rechazar la entrada como no-canónica, o bien declararla **extensión local marcada**; NO DEBE silenciarla emitiendo una superficie inventada como si fuera canon.

  Rationale: `reglas §11.2` (R-ZNC-2): la herramienta NO inventa regla OPM nuclear para una zona no canonizada.

### §8.5 GAPs de cobertura — combinatoria

- GAP-FAN-EVENTO: `app/src/opl/generadores/abanico.ts` NO emite la forma de fan bajo evento (`inicia` + cuantificador, R-FAN-4 / C-19); solo `oracionAbanicoCondicional` cubre la combinación condicional. La forma de evento sobre fan es canónica pero sin generador.
- GAP-FAN-RESULTADO-COND: `abanico.ts·oracionAbanicoCondicional` (línea 176) emite `… puede generarse …` para resultado+condición+fan (C-20). `puede generarse` NO pertenece al enum §1.1 y el resultado NO admite condición (R-COMB-2); emisión no canónica que la spec manda eliminar.
- GAP-PROB-SUPERFICIE: `procedural.ts·sufijoProbabilidad` (línea 421) realiza la probabilidad como sufijo `(probabilidad: 40%)` por enlace, NO como `Pr=p` por rama ligado a un fan XOR (R-FAN-6 / C-22). La superficie del código diverge del canon `Pr=p`; falta validar suma `=1` y exclusividad XOR.
- GAP-FAN-M: no hay generador para `exactamente m de f` / `al menos m de f` (R-FAN-8 / C-30 sentido m-de-f); `abanico.ts` solo emite el caso `m=1`.
- GAP-COL-RESOLUCION: la resolución de colisión de rol por fuerza semántica (§8.3.1) y la precedencia de recomposición (§8.3.2) son operaciones de modelo; no consta en `app/src/opl/generadores/` un generador OPL que materialice el reporte de desplazamiento/conflicto — la resolución vive en el kernel de modelo, no en la capa OPL.

## §9 Composición de oraciones y prosa OPL

Las secciones §2–§8 canonizan la realización **atómica**: una oración, un hecho. Esta sección canoniza el **álgebra de composición** que coordina dos o más oraciones atómicas en una **prosa OPL más rica** mediante cópulas y conectores, sin perder direccionabilidad por hecho. La composición es una transformación de superficie: fusiona el **texto**, NUNCA el **mapeo a modelo**. Cada hecho coordinado conserva su `ref` y su sub-span.

La composición de §9 es la **generalización** del patrón ya implementado para abanicos (`refsHints.ts·refsAbanico`/`hintsAbanico`): una sola línea, `refs` = unión de los enlaces participantes, `hints` = un sub-span por enlace. El abanico es composición de un fan del mismo enlace; §9 extiende esa mecánica a oraciones atómicas que comparten un eje de coordinación.

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

Una oración compuesta coordina hechos que comparten un **eje**. Esta spec canoniza estos ejes:

| Eje | Patrón | Plantilla |
| --- | --- | --- |
| (a) sujeto compartido / predicado coordinado | un *proceso* sujeto, varios predicados procedimentales | `*P* consume **A**, genera **B** y requiere **C**.` |
| (b) predicado compartido / destino enumerado | un sujeto y verbo, varios destinos | `**A** exhibe **B**, **C** y **D**.` |
| (c) sujeto coordinado | varios sujetos, un predicado (solo si canónico) | `**A** y **B** consumen **C**.` |
| (d) condicional / temporal / causal | coordinación donde el canon lo soporte | `*P* ocurre si **A** existe, en cuyo caso *P* consume **A**, de lo contrario *P* se omite.` |
| (e) operadores lógicos XOR / OR | abanico — remite §8.1 | `*P* consume exactamente uno de **A**, **B** o **C**.` |

- **R-COMP-EJE-1** (conector serial es-CL): la coordinación serial DEBE usar coma entre los primeros miembros y `y`/`o` antes del último, **sin coma de Oxford**. La alternancia `e`/`u` DEBE decidirse por la fonética del término siguiente (remite §1.3 R-VERB-KW-2).

  Correcto: `*P* consume **A**, genera **B** y requiere **C**.`
  Incorrecto: `*P* consume **A**, genera **B**, y requiere **C**.` (coma de Oxford)
  Rationale: `opm-opl-es §2` (conector serial es-CL); la coma de Oxford no es es-CL.

- **R-COMP-EJE-2** (eje a — predicado coordinado): varias oraciones procedimentales con el **mismo *proceso* sujeto** PUEDEN coordinarse en una línea, repitiendo el verbo por hecho. Cada par verbo+complemento conserva su sub-span y su `ref` de enlace. La composabilidad declarada en §3.1, §3.2, §3.3, §4 habilita este eje.

- **R-COMP-EJE-3** (eje b — destino enumerado estructural): una relación estructural con **un exhibidor/todo/general** y varios destinos del mismo tipo de relación DEBE coordinar los destinos tras un solo verbo. Es el patrón ya canónico de §6 (`consta de`, `exhibe`): un verbo, N spans de destino, una `ref` de enlace por destino.

  Correcto: `**Auto** consta de **Motor**, **Chasis** y **Rueda**.`
  Rationale: `estructural.ts·oracionEstructural` ya emite la lista; la `ref` de cada parte vive en su sub-span.

- **R-COMP-EJE-4** (eje c — sujeto coordinado): la coordinación de sujetos (`**A** y **B** consumen **C**.`) SOLO PUEDE emitirse cuando el canon define el plural concordado (multiplicidad / fan divergente de habilitador). Fuera de esos casos, NO DEBE coordinarse el sujeto; recae en oraciones atómicas.

  Rationale: el verbo concuerda en número con el sujeto múltiple (R-MULT-COMB-1); el sujeto coordinado sin respaldo canónico inventaría una relación inexistente.

- **R-COMP-EJE-5** (eje e — abanicos): la coordinación XOR/OR NO se canoniza aquí; es el abanico de §8.1 (`exactamente uno de` / `al menos uno de`). §9 NO DEBE duplicar ni redefinir el cuantificador de fan.

  Rationale: el abanico es composición del mismo enlace bajo operador lógico; §8.1 ya lo gobierna.

### §9.2 Reglas de elegibilidad

- **R-COMP-ELEG-1** (mismo eje): solo PUEDEN coordinarse hechos que compartan **exactamente un** eje de §9.1. Mezclar ejes (p. ej. predicado coordinado con destino enumerado de otra relación) en una sola línea NO DEBE realizarse.

- **R-COMP-ELEG-2** (misma familia semántica): el eje (a) NO DEBE coordinar familias incompatibles que el canon separa: un predicado transformador (`consume`/`genera`/`afecta`/`cambia`) PUEDE coordinarse con habilitadores (`requiere`/`maneja`) bajo sujeto-proceso compartido, pero NUNCA DEBE coordinar consumo con resultado **sobre el mismo objeto** ni mezclar clasificación genérica (esencia/afiliación, R-ENT-3) con enlaces.

  Rationale: §3.1/§3.2 prohíben coordinar consumo con resultado en un predicado sobre el mismo objeto; §2 (R-ENT-3) exige oración separada por hecho de clasificación genérica.

- **R-COMP-ELEG-3** (orden determinista estable): el orden de los hechos coordinados DEBE ser **determinista y estable** entre emisiones; DEBERÍA seguir el orden de fuerza semántica (consumo, resultado, efecto, agente, instrumento) en el eje (a) y el orden de modelo de los destinos en el eje (b). Un orden inestable rompe el roundtrip y la diffabilidad del texto.

  Rationale: R-COMB-4 fija orden de marcadores superficiales estable; la composición hereda esa exigencia.

- **R-COMP-ELEG-4** (preservación obligatoria de tokens): una coordinación es elegible SOLO si la línea resultante puede poblar `hints` con un sub-span por hecho sin solापamiento ambiguo. Si dos hechos producirían el **mismo** texto de span sin ancla de posición que los distinga, la coordinación NO DEBE realizarse; los hechos DEBEN emitirse atómicos.

  Rationale: `interaccion.ts·tokenizarConHints` ubica cada hint por `indexOf` y ordena por posición; spans idénticos sin desambiguación posicional colisionarían, perdiendo direccionabilidad — exactamente la pérdida que la regla maestra prohíbe.

### §9.3 Zonas prohibidas de composición

- **R-COMP-ZP-1** (refinamiento / despliegue): la composición NO DEBE fusionar en plural los enlaces de los refinadores en contexto de refinamiento/despliegue (HU-50.015). La detección de candidatos a coordinación NO DEBE activarse sobre enlaces que pertenecen a un OPD hijo de refinamiento. Remite §7.7 (R-CX-COMP-1/2/3).

  Correcto: `**Auto** es un **Vehículo**.` seguido de `**Camión** es un **Vehículo**.` (despliegue de generalización: un enlace, una oración, refs preservados)
  Incorrecto: `**Auto** y **Camión** son **Vehículo**.` cuando el contexto es el despliegue de generalización-especialización del refinamiento de **Vehículo** — la fusión borra el token-verbo y la `ref` por enlace que el refinamiento necesita.
  Rationale: BUG-f897bc; §7.7 sella esta colisión y §9 la materializa como zona prohibida del álgebra.

- **R-COMP-ZP-2** (toda composición que pierda refs/hints): cualquier coordinación que no satisfaga R-COMP-MAESTRA-1/2/3 (sub-span por hecho, unión de refs, resolución al hecho individual) está **prohibida**, sin importar el eje. La prosa más rica NUNCA justifica perder direccionabilidad.

- **R-COMP-ZP-3** (lo que el parser no descompone): NO DEBE emitirse una oración compuesta que el parser no pueda descomponer a sus hechos atómicos (R-COMP-REV-1). Composición sin reverse equivalente está prohibida.

  Rationale: la bisimetría OPL (`reglas §9`) exige que toda forma emitida sea parseable; una composición no parseable rompe el roundtrip.

### §9.4 Reverse / roundtrip

- **R-COMP-REV-1** (descomposición obligatoria): el parser DEBE descomponer una oración compuesta en sus hechos atómicos, reconstruyendo un enlace/relación por sub-span coordinado. El parseo de la línea coordinada DEBE producir el **mismo conjunto de mutaciones** que el parseo de las oraciones atómicas equivalentes.

  Rationale: el parser ya descompone el abanico (`parsear.ts·ABANICO_VERBO_RE_LIST`) en un enlace por miembro; la coordinación de §9 extiende esa descomposición a predicados/destinos enumerados.

- **R-COMP-REV-2** (invariante de identidad): **componer → parsear = identidad sobre el conjunto de hechos**. Sea `F = {f1, …, fn}` el conjunto de hechos atómicos; `parsear(componer(F)) = F` como conjunto (no necesariamente como orden de líneas). El roundtrip se defiende sobre el conjunto de hechos, no sobre la cadena de texto.

  Rationale: `roundtrip.test.ts` / `fixtures-roundtrip.ts` defienden bisimetría sobre hechos; la composición es display y NO DEBE alterar el conjunto de hechos recuperado.

### §9.5 Configuración display-vs-canónico

- **R-COMP-CFG-1**: prosa **atómica** (una oración por hecho) vs **compuesta** (coordinada) es una **opción de presentación**. NO DEBE alterar el **texto canónico** que alimenta al parser ni al roundtrip: ambas formas DEBEN parsear al mismo conjunto de hechos.

  Rationale: §Convenciones (Display-vs-canónico); la forma visible se normaliza a la forma canónica para equivalencia, igual que cualquier otro hecho display.

- **R-COMP-CFG-2**: el contrato display-vs-canónico de la composición DEBE ser el **mismo** que el del resto de la spec: la presentación PUEDE reordenar/coordinar; la equivalencia se evalúa sobre la forma canónica normalizada. La opción de prosa NO DEBE introducir un canon paralelo.

### §9.6 Traza a código y GAPs

**Estado actual**: los generadores de `app/src/opl/generadores/` emiten hoy oraciones **atómicas** por hecho procedimental (`procedural.ts·oracionEnlaceSinEtiqueta`), salvo dos casos ya coordinados: la **enumeración estructural de destinos** (`estructural.ts·oracionEstructural`, eje b) y el **abanico** (`abanico.ts` + `refsHints.ts·refsAbanico`/`hintsAbanico`, eje e). La coordinación de **predicados con sujeto-proceso compartido** (eje a) es **capacidad nueva**.

- **GAP-COMPOSICION**: no existe hoy un generador que coordine predicados de distinto verbo bajo un sujeto-proceso compartido (eje a, R-COMP-EJE-2). El punto de implementación es una capa de composición que, **sobre el resultado atómico** de `procedural.ts·oracionEnlaceSinEtiqueta`, agrupe `OplLineaPendiente` por sujeto-proceso y produzca una `OplLineaPendiente` única con:
  - `texto` = predicados concatenados con conector serial es-CL (§9.1 R-COMP-EJE-1);
  - `refs` = unión de los `refsEnlace` de cada predicado (R-COMP-MAESTRA-2, vía el `refsUnicasPorTipoId` que `crearLineaOplInteractiva` ya aplica);
  - `hints` = concatenación de los `hintsEnlace` de cada predicado, un sub-span por verbo/objeto/estado (R-COMP-MAESTRA-1).
  El patrón de referencia es `refsHints.ts·refsAbanico`/`hintsAbanico`: ya construye una línea con unión de refs y un hint por enlace hijo; el eje (a) lo reusa para predicados heterogéneos.

- **GAP-COMP-GUARDA** (remite §7.7): no existe guard programático que prohíba la coordinación de enlaces hijos en contexto de refinamiento/despliegue (R-COMP-ZP-1). La capa de composición del eje (a) DEBE materializar ese guard: antes de coordinar, descartar candidatos cuyos enlaces pertenezcan a un OPD hijo de refinamiento, y descartar la fusión si rompería R-COMP-ELEG-4 (spans ambiguos).

- **GAP-COMP-REVERSE**: el parser (`parsear.ts`) descompone hoy el abanico (`ABANICO_VERBO_RE_LIST`) y la enumeración estructural, pero NO una línea de predicados coordinados de distinto verbo bajo un sujeto compartido (eje a). R-COMP-REV-1 exige una regla de descomposición que segmente la línea por conector serial y reparse cada predicado contra el sujeto compartido; sin ella, el eje (a) NO DEBE emitirse (R-COMP-ZP-3).

Rationale: BUG-f897bc, `interaccion.ts` (tokens/refs/hints), `refsHints.ts` (`OplLineaPendiente`, `refsAbanico`/`hintsAbanico`), `reglas §9` (bisimetría OPD↔OPL) y §7.7 (zona prohibida en refinamiento).

## §10 Multiplicidad y cardinalidad

Esta sección canoniza la realización OPL de la multiplicidad y la cardinalidad de las cosas y enlaces. La multiplicidad es un modificador de superficie que cuantifica una participación; NUNCA es una cosa ni un enlace propio.

### §10.1 Tabla canónica símbolo → rango → OPL-ES

| Símbolo | Rango | Cardinalidad | Realización OPL-ES |
| --- | --- | --- | --- |
| `?` | `0..1` | opcional, a lo sumo uno | `un/una opcional` |
| `*` | `0..*` | opcional, cero o más | `opcional (cero o más)` |
| (sin símbolo) | `1..1` | exactamente uno (default) | (sin marca; emisión implícita) |
| `+` | `1..*` | obligatorio, uno o más | `al menos un/una` |

- **R-MULT-1**: la multiplicidad DEBE aplicarse SOLO a enlaces etiquetados, agregación-participación y enlaces procedimentales. La emisión OPL DEBE anteponer la frase de cardinalidad al sustantivo cuantificado, concordando género (`un/una`, `al menos un/una`).

  Correcto: `*Cocinar* requiere al menos una **Olla**.`
  Incorrecto: `*Cocinar* requiere 1..* **Olla**.` (símbolo crudo en superficie)
  Rationale: la cardinalidad es portadora de cuantificación; la superficie es prosa es-CL, no glifo.

- **R-MULT-1A**: la multiplicidad NO DEBE aplicarse directamente a un *proceso*. Un *proceso* NO tiene cardinalidad de instancia en la oración.

- **R-MULT-1B**: la repetición **secuencial** de un *proceso* NO DEBE expresarse como multiplicidad; DEBE modelarse como *proceso* recurrente más un **contador** (objeto de iteración).

  Rationale: la repetición temporal es dinámica; la multiplicidad cuantifica participación estática, no ejecuciones.

- **R-MULT-1C**: la repetición **paralela** de un *proceso* NO DEBE expresarse como multiplicidad; DEBE modelarse como subprocesos síncronos o asíncronos en la descomposición (remite §7).

- **R-MULT-2**: los nombres de parámetros de multiplicidad DEBEN ser únicos en todo el modelo. Dos participaciones distintas NO DEBEN compartir el mismo parámetro nombrado.

### §10.2 Rangos, intervalos y restricciones

- Los rangos canónicos DEBEN escribirse `qmín..qmáx`. Los intervalos DEBEN admitir las cuatro formas: `[a..b]`, `(a..b]`, `[a..b)`, `(a..b)`. Las listas de rangos DEBEN separarse por coma: `[1..10],[20..30]`. El extremo abierto DEBE escribirse `*`.

- La superficie EBNF de restricción de cardinalidad DEBE usar los operadores ASCII `=`, `<`, `>`, `<=`, `>=` y la pertenencia a conjunto `en {conjunto}`.

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
| Procedencia | `reglas-opm-estrictas.md §6.7` |

Rationale: `reglas-opm-estrictas.md §6.7` canoniza la tabla símbolo→rango→OPL y los rangos/intervalos; `refsHints.ts·nombreOplExtremo` realiza el nombre de extremo cuantificado.

## §11 Etiquetas de ruta

Esta sección canoniza la realización OPL de las **etiquetas de ruta** (path labels), que desambiguan qué entrada mapea a qué salida en un *proceso* con múltiples rutas.

### §11.1 Plantillas

| Plantilla |
| --- |
| `Por ruta etiqueta, *Proceso* consume **Objeto**.` |
| `Por ruta etiqueta, *Proceso* genera **Objeto**.` |

- **R-OPL-RUTA-1**: `Por ruta` DEBE ser expresión fija. NO DEBE flexionarse ni sustituirse por sinónimos (`por la ruta`, `vía ruta`).

  Correcto: `Por ruta rápida, *Cocinar* consume **Agua**.`
  Incorrecto: `Por la ruta rápida, *Cocinar* consume **Agua**.`
  Rationale: la expresión fija es el ancla léxica que el parser reconoce como prefijo de ruta.

- **R-OPL-RUTA-2**: la `etiqueta` DEBE ser un nombre definido por el modelador. NO DEBE ser un literal genérico ni autogenerado; es referencia a una ruta nombrada del modelo.

- **R-OPL-RUTA-3** (alcance canónico vs extensión): por `A.5`, `Por ruta` PUEDE prefijar **cualquier** oración procedimental. La restricción que limita `Por ruta` a oraciones de consumo o resultado es **extensión declarada de producto**, NO un límite del canon. Un agente conforme NO DEBE presentar esa restricción como canon OPM.

  Rationale: el canon admite el prefijo de ruta sobre toda oración procedimental; OPFORJA PUEDE restringir su superficie a consumo/resultado, pero DEBE declararlo como extensión.

| Campo | Valor |
| --- | --- |
| ID | `R-OPL-RUTA-1`–`R-OPL-RUTA-3` |
| Plantilla | `Por ruta <etiqueta>, <oración procedimental>` |
| Emisión | el prefijo `Por ruta <etiqueta>,` precede a la oración procedimental, con coma de separación |
| Tokenización | `Por ruta` = token fijo; `<etiqueta>` = sub-span con `ref` a la ruta nombrada |
| Composabilidad | combina con consumo/resultado (extensión de producto); canon admite toda oración procedimental |
| Reverse | el parser DEBE detectar el prefijo `Por ruta <etiqueta>,` y asociar la etiqueta de ruta al enlace resultante |
| Roundtrip | la etiqueta DEBE preservarse: `parsear(emitir(ruta)) = ruta` |
| Traza a código | `app/src/opl/generadores/procedural.ts` (etiqueta de ruta); si la función no existe aún, `GAP-VERIFY` |
| Procedencia | `reglas-opm-estrictas.md §4.12` |

Rationale: `reglas-opm-estrictas.md §4.12` canoniza la etiqueta de ruta y la regla `A.5`; `procedural.ts` es el punto de emisión procedimental donde el prefijo de ruta se ancla.

## §12 Plegado y despliegue de OPL (display)

Esta sección canoniza la **presentación** de la OPL completa de un modelo: cómo se agrupan las oraciones por OPD, el orden de los OPDs y el **plegado parcial** en OPDs ascendentes. El plegado es **display**: NUNCA altera el texto canónico que alimenta parser y roundtrip.

### §12.1 Agrupación y orden de la OPL completa

- **R-OPL-DISP-1**: la OPL completa DEBE agrupar las oraciones **por OPD**: cada OPD aporta su bloque de oraciones, y los bloques DEBEN ordenarse según el orden de los OPDs del modelo.

- **R-OPL-DISP-2**: el orden de los OPDs en la OPL completa DEBE ser **determinista y estable** entre emisiones, para preservar la diffabilidad del texto y la equivalencia del roundtrip.

  Rationale: un orden inestable de bloques rompe la diffabilidad y la comparación de la OPL completa, igual que el orden inestable de hechos coordinados (§9.2 R-COMP-ELEG-3).

### §12.2 Plegado parcial

- **R-OPL-DISP-3**: en un OPD ascendente DEBEN suprimirse los hechos **refinados** en OPDs descendientes; su realización OPL DEBE quedar **plegada** (mostrada como hecho agregado, no expandida en sus hijos).

  Rationale: el OPD ascendente expone el nivel de abstracción de ese OPD; expandir los hechos refinados duplicaría información que vive en el OPD hijo (remite §7).

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

Rationale: `bloquesJerarquicos.ts·agruparOracionesPorOpd`/`ordenarOpdsParaOpl` realizan la agrupación y el orden de la OPL completa; `plegado.ts·oracionPlegadoParcial` realiza el plegado parcial; el contrato display-vs-canónico hereda de §Convenciones y §9.5.

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
| Traza a código | `app/src/opl/panel.ts·derivarPanelOpl`; `app/src/opl/bloquesJerarquicos.ts·agruparOracionesPorOpd` / `ordenarOpdsParaOpl`; `app/src/opl/interaccion.ts·OplLineaInteractiva` (`ordinal`/`opdProfundidad`); `app/src/opl/opciones.ts·VisibilidadOpl` (detalle §16) |
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

  Rationale: el token portador expone su `ref` (`OplToken.ref`); la navegación resuelve el destino desde esa referencia tipada. La edición inline de propiedades de elementos/enlaces (doble-click) es un canal distinto, no cubierto por esta regla. GAP-VERIFY: el handler de click→foco vive en la capa UI del panel (`app/src/ui`), fuera de las lecturas permitidas.

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
  Rationale: la resolución por sub-span de §14.5 (`interaccion.ts·referenciaEnlaceEspecifico`) identifica el hecho objetivo; la mutación por hecho preserva la composabilidad de §9 y evita efectos colaterales sobre hechos no tocados. GAP-VERIFY: la spec define la regla de mutación por hecho; la mecánica exacta de re-tokenización por sub-span en el editor libre se traza a §9 y §14.5, no a una función nueva de edición compuesta.

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
  | `siempre` (default) | la esencia (físico/informático) se anota en toda frase donde aplique |
  | `solo-difiere` | la esencia se anota solo cuando difiere del default del tipo |
  | `oculta` | la esencia nunca se anota en el display |

  El valor por defecto DEBE ser `VISIBILIDAD_OPL_DEFAULT = { esencia: "siempre" }`.

  Rationale: `opciones.ts` define `EsenciaVisibilidad` y el default; la visibilidad recorta ruido en el display sin tocar el modelo ni el canónico.

- **R-OPL-CFG-2**: cualquiera de los tres modos NO DEBE alterar el texto canónico. El canónico que alimenta `parser`/`roundtrip` DEBE generarse con la esencia que el hecho posee, con independencia del modo de display elegido.

  Correcto: con `esencia: "oculta"`, el panel muestra `*Cocinar* consume **Ingrediente**.` mientras el canónico conserva la marca de esencia para el roundtrip.
  Incorrecto: ocultar la esencia en el display y omitirla también del canónico, rompiendo el roundtrip.
  Rationale: la equivalencia gráfico-texto (§Convenciones, principio 7) exige que el canónico sea completo; el display es una proyección recortable.

### §16.2 Modo prosa atómica vs compuesta

- **R-OPL-CFG-3**: el modo de prosa (atómica = una frase por hecho; compuesta = frases coordinadas por objeto/proceso, remite §9) DEBE ser una opción de **display**. El modo compuesto NO DEBE introducir un canon paralelo: la presentación compuesta se normaliza a la forma canónica para equivalencia.

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

EBNF normativa consolidada (es-CL, sin transformación de idioma). Cubre todas las familias canonizadas en §1–§12: declaraciones base, identificadores, descripción de cosas, procedimentales (transformadores + habilitadores + control), condición, estructurales, estructuras fundamentales, gestión de contexto, multiplicidad/cardinalidad y ruta. Las producciones con prefijo `(* ext §9 *)` son extensión de esta spec (oración compuesta/coordinada) y no figuran en el Apéndice A de `opm-opl-es`.

```ebnf
(* ===== A.1 — Estructura del documento ===== *)
parrafo_opl_es = oracion_opl_es, { salto_de_linea, oracion_opl_es } ;
oracion_opl_es = oracion_formal_opl_es, "." ;
oracion_formal_opl_es = oracion_de_descripcion_de_cosa
 | oracion_procedimental
 | oracion_estructural
 | oracion_de_gestion_de_contexto
 | oracion_compuesta ;  (* ext §9 *)

(* ===== A.2 — Declaraciones base ===== *)
digito_no_cero = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' ;
digito_decimal = '0' | digito_no_cero ;
entero_positivo = digito_no_cero, {digito_decimal} ;
nombre_simple = letra, {caracter_de_cadena} ;
nombre = nombre_simple, { " ", nombre_simple } ;
segmento_etiqueta_opd = "SD", [entero_positivo] ;
palabra_capitalizada = letra_mayuscula, {caracter_de_cadena} ;
palabra_no_capitalizada = letra_minuscula, {caracter_de_cadena} ;
frase_no_capitalizada = palabra_no_capitalizada, { " ", palabra_no_capitalizada } ;
letra = letra_mayuscula | letra_minuscula ;
letra_mayuscula = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M'
 | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'
 | 'Á' | 'É' | 'Í' | 'Ó' | 'Ú' | 'Ñ' | 'Ü' ;
letra_minuscula = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm'
 | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'
 | 'á' | 'é' | 'í' | 'ó' | 'ú' | 'ñ' | 'ü' ;
caracter_de_cadena = letra | digito_decimal | '-' | '_' ;
identificador_de_tipo = "boolean" | "string" | tipo_numerico | "enumerated" ;
tipo_numerico = [prefijo], "integer" | "float" | "double" | "short" | "long" ;
prefijo = "unsigned " | "signed " ;
restriccion_de_participacion = singular_inferior | singular_superior | plural_inferior | plural_superior
 | ( "0" | limite_de_participacion, [ " a ", limite_de_participacion ] ) ;
singular_inferior = "un" | "una" | "un opcional" | "una opcional" | "al menos un" | "al menos una" ;
singular_superior = "exactamente un" | "exactamente una" ;
plural_inferior = "al menos dos" ;
plural_superior = "dos o más" ;
limite_de_participacion = entero_positivo | nombre_simple ;
unidad_de_medida = nombre_simple ;
numero_decimal = [ "-" ], ( "0" | entero_positivo ), [ ".", digito_decimal, {digito_decimal} ] ;
nombre_de_valor = nombre_simple | numero_decimal ;
limite_de_rango = nombre_de_valor | "*" ;
delimitador_inferior_de_rango = "[" | "(" ;
delimitador_superior_de_rango = "]" | ")" ;
intervalo_de_rango = delimitador_inferior_de_rango, limite_de_rango, "..", limite_de_rango, delimitador_superior_de_rango ;
expresion_de_rango = intervalo_de_rango, { ", ", intervalo_de_rango } ;
clausula_de_rango = " es ", ( nombre_de_valor | expresion_de_rango )
 | " varía de ", nombre_de_valor, " a ", nombre_de_valor ;

(* ===== A.3 — Identificadores ===== *)
identificador_de_objeto = nombre_singular_de_objeto, [ " en ", unidad_de_medida ], [ clausula_de_rango ] ;
identificador_de_proceso = nombre_singular_de_proceso | nombre_singular_de_proceso, " proceso" ;
identificador_de_cosa = identificador_de_objeto | identificador_de_proceso ;
identificador_de_estado = palabra_no_capitalizada ;
expresion_de_etiqueta = frase_no_capitalizada ;
nombre_singular_de_objeto = palabra_capitalizada, { " ", palabra_capitalizada | palabra_no_capitalizada } ;
nombre_singular_de_proceso = palabra_capitalizada, { " ", palabra_capitalizada | palabra_no_capitalizada } ;
estado_de_entrada = identificador_de_estado ;
estado_de_salida = identificador_de_estado ;
objeto_con_opcion_de_estado = identificador_de_objeto, [ " en ", identificador_de_estado ] ;
objeto_origen = identificador_de_objeto ;
objeto_destino = identificador_de_objeto ;
proceso_origen = identificador_de_proceso ;
proceso_destino = identificador_de_proceso ;
objeto_todo = identificador_de_objeto ;
proceso_todo = identificador_de_proceso ;
objeto_general = identificador_de_objeto ;
proceso_general = identificador_de_proceso ;
clase_de_objeto = identificador_de_objeto ;
clase_de_proceso = identificador_de_proceso ;
objeto_especial = identificador_de_objeto ;
objeto_con_estado = identificador_de_objeto, " en ", identificador_de_estado ;
nombre_de_modelo = nombre ;
etiqueta_visible_de_opd = segmento_etiqueta_opd, { ".", entero_positivo } ;
opd_padre = etiqueta_visible_de_opd ;
opd_hijo = etiqueta_visible_de_opd ;
identificador_de_proceso_activo = identificador_de_proceso ;
max_duracion_unidades_tiempo = nombre_de_valor, " unidades-tiempo" ;
min_duracion_unidades_tiempo = nombre_de_valor, " unidades-tiempo" ;
lista_de_estados = identificador_de_estado, { ", ", identificador_de_estado }, [ " o ", identificador_de_estado ] ;
lista_de_objetos = identificador_de_objeto, { ", ", identificador_de_objeto }, [ " y ", identificador_de_objeto ] ;
lista_de_procesos = identificador_de_proceso, { ", ", identificador_de_proceso }, [ " y ", identificador_de_proceso ] ;
lista_de_atributos = identificador_de_objeto, { ", ", identificador_de_objeto }, [ " y ", identificador_de_objeto ] ;
lista_de_operadores = identificador_de_proceso, { ", ", identificador_de_proceso }, [ " y ", identificador_de_proceso ] ;
lista_de_objetos_especiales = lista_de_objetos ;
lista_de_procesos_especiales = lista_de_procesos ;
lista_de_objetos_instancia = lista_de_objetos ;
lista_de_procesos_instancia = lista_de_procesos ;
lista_de_objetos_con_estado = objeto_con_estado, { ", ", objeto_con_estado }, [ " y ", objeto_con_estado ] ;
etiqueta_directa = expresion_de_etiqueta ;
etiqueta_nula_definida_por_usuario = expresion_de_etiqueta ;

(* ===== A.4 — Descripción de cosas ===== *)
oracion_de_descripcion_de_cosa = oracion_de_propiedad_generica
 | oracion_de_enumeracion_de_estados
 | oracion_de_estados_iniciales
 | oracion_de_estados_finales
 | oracion_de_estado_por_defecto
 | oracion_de_estado_current
 | oracion_de_tipo_de_dato ;
oracion_de_tipo_de_dato = identificador_de_objeto, " es de tipo ", identificador_de_tipo ;
oracion_de_propiedad_generica = identificador_de_cosa, " es ", ( esencia | afiliacion | perseverancia ) ;
oracion_de_enumeracion_de_estados = identificador_de_objeto, " puede estar ", lista_de_estados, [", y otros estados"] ;
oracion_de_estados_iniciales = "Estado ", identificador_de_estado, " de ", identificador_de_objeto, " es inicial" ;
oracion_de_estados_finales = "Estado ", identificador_de_estado, " de ", identificador_de_objeto, " es final" ;
oracion_de_estado_por_defecto = "Estado ", identificador_de_estado, " de ", identificador_de_objeto, " es por defecto" ;
oracion_de_estado_current = "Estado ", identificador_de_estado, " de ", identificador_de_objeto, " es declarado `Current`" ;
esencia = "física" | "informacional" ;
afiliacion = "ambiental" | "sistémica" ;
perseverancia = "persistente" | "transitoria" ;

(* ===== A.5 — Procedimentales ===== *)
oracion_procedimental = oracion_transformadora | oracion_habilitadora | oracion_de_invocacion | oracion_de_control ;
oracion_transformadora = oracion_de_consumo | oracion_de_resultado | oracion_de_efecto | oracion_de_cambio ;
oracion_de_consumo = identificador_de_proceso, " consume ", objeto_con_opcion_de_estado ;
oracion_de_resultado = identificador_de_proceso, " genera ", objeto_con_opcion_de_estado ;
oracion_de_efecto = identificador_de_proceso, " afecta ", lista_de_objetos ;
oracion_de_cambio = oracion_de_cambio_entrada_salida | oracion_de_cambio_solo_entrada | oracion_de_cambio_solo_salida ;
frase_de_cambio_entrada_salida = identificador_de_objeto, " de ", estado_de_entrada, " a ", estado_de_salida ;
frase_de_cambio_solo_entrada = identificador_de_objeto, " de ", estado_de_entrada ;
frase_de_cambio_solo_salida = identificador_de_objeto, " a ", estado_de_salida ;
oracion_de_cambio_entrada_salida = identificador_de_proceso, " cambia ", frase_de_cambio_entrada_salida ;
oracion_de_cambio_solo_entrada = identificador_de_proceso, " cambia ", frase_de_cambio_solo_entrada ;
oracion_de_cambio_solo_salida = identificador_de_proceso, " cambia ", frase_de_cambio_solo_salida ;
oracion_habilitadora = oracion_de_agente | oracion_de_instrumento ;
oracion_de_agente = objeto_con_opcion_de_estado, " maneja ", identificador_de_proceso ;
oracion_de_instrumento = identificador_de_proceso, " requiere ", objeto_con_opcion_de_estado ;
oracion_de_control = oracion_de_evento | oracion_de_condicion | oracion_de_excepcion ;
oracion_de_evento = oracion_de_evento_de_consumo | oracion_de_evento_de_efecto
 | oracion_de_evento_de_agente | oracion_de_evento_de_instrumento ;
oracion_de_evento_de_consumo = objeto_con_opcion_de_estado, " inicia ", identificador_de_proceso,
 ", que consume ", identificador_de_objeto ;
oracion_de_evento_de_efecto = identificador_de_objeto, " inicia ", identificador_de_proceso,
 ", que afecta ", identificador_de_objeto ;
oracion_de_evento_de_agente = objeto_con_opcion_de_estado, " inicia y maneja ", identificador_de_proceso ;
oracion_de_evento_de_instrumento = objeto_con_opcion_de_estado, " inicia ", identificador_de_proceso,
 ", que requiere ", objeto_con_opcion_de_estado ;
oracion_de_invocacion = identificador_de_proceso, " invoca ", lista_de_procesos
 | identificador_de_proceso, " se invoca a sí mismo" ;
oracion_de_excepcion = oracion_de_excepcion_por_sobretiempo | oracion_de_excepcion_por_subtiempo ;
oracion_de_excepcion_por_sobretiempo = identificador_de_proceso_activo,
 " ocurre si duración de ", identificador_de_proceso, " excede ", max_duracion_unidades_tiempo ;
oracion_de_excepcion_por_subtiempo = identificador_de_proceso_activo,
 " ocurre si duración de ", identificador_de_proceso, " es menor que ", min_duracion_unidades_tiempo ;
oracion_de_ruta = "Por ruta ", cadena_etiqueta, ", ", oracion_procedimental ;
cadena_etiqueta = nombre ;
(* Abanicos lógicos: el complemento puede coordinar bajo cuantificador de fan *)
operador_de_fan = "exactamente uno de" | "al menos uno de" ;

(* ===== A.6 — Condición ===== *)
oracion_de_condicion = oracion_transformadora_condicional | oracion_habilitadora_condicional ;
oracion_transformadora_condicional = oracion_de_consumo_condicional
 | oracion_de_consumo_condicional_con_estado
 | oracion_de_efecto_condicional ;
oracion_de_consumo_condicional = ( identificador_de_proceso, " ocurre si ", identificador_de_objeto,
 " existe, en cuyo caso ", identificador_de_objeto, " se consume, de lo contrario ",
 identificador_de_proceso, " se omite" )
 | ( "Si ", identificador_de_objeto, " existe entonces ", identificador_de_proceso,
 " ocurre y consume ", identificador_de_objeto, ", de lo contrario se omite ", identificador_de_proceso ) ;
oracion_de_consumo_condicional_con_estado = identificador_de_proceso, " ocurre si ",
 identificador_de_objeto, " está en ", estado_de_entrada, ", en cuyo caso ",
 identificador_de_objeto, " se consume, de lo contrario ", identificador_de_proceso, " se omite" ;
oracion_de_efecto_condicional = oracion_de_efecto_condicional_simple
 | oracion_de_efecto_entrada_salida_condicional
 | oracion_de_efecto_entrada_condicional
 | oracion_de_efecto_salida_condicional ;
oracion_de_efecto_condicional_simple = identificador_de_proceso, " ocurre si ",
 identificador_de_objeto, " existe, en cuyo caso ", identificador_de_proceso,
 " afecta ", identificador_de_objeto, ", de lo contrario ", identificador_de_proceso, " se omite" ;
oracion_de_efecto_entrada_salida_condicional = identificador_de_proceso, " ocurre si ",
 identificador_de_objeto, " está en ", estado_de_entrada, ", en cuyo caso ",
 identificador_de_proceso, " cambia ", identificador_de_objeto, " de ", estado_de_entrada,
 " a ", estado_de_salida, ", de lo contrario ", identificador_de_proceso, " se omite" ;
oracion_de_efecto_entrada_condicional = identificador_de_proceso, " ocurre si ",
 identificador_de_objeto, " está en ", estado_de_entrada, ", en cuyo caso ",
 identificador_de_proceso, " cambia ", identificador_de_objeto, " de ", estado_de_entrada,
 ", de lo contrario ", identificador_de_proceso, " se omite" ;
oracion_de_efecto_salida_condicional = identificador_de_proceso, " ocurre si ",
 identificador_de_objeto, " existe, en cuyo caso ", identificador_de_proceso,
 " cambia ", identificador_de_objeto, " a ", estado_de_salida,
 ", de lo contrario ", identificador_de_proceso, " se omite" ;
oracion_habilitadora_condicional = oracion_de_agente_condicional | oracion_de_instrumento_condicional ;
oracion_de_agente_condicional = ( objeto_con_opcion_de_estado, " maneja ",
 identificador_de_proceso, " si ", identificador_de_objeto, " existe, de lo contrario ",
 identificador_de_proceso, " se omite" )
 | ( objeto_con_opcion_de_estado, " maneja ", identificador_de_proceso, " si ",
 identificador_de_objeto, " está en ", identificador_de_estado, ", de lo contrario ",
 identificador_de_proceso, " se omite" ) ;
oracion_de_instrumento_condicional = ( identificador_de_proceso, " ocurre si ",
 identificador_de_objeto, " existe, de lo contrario ", identificador_de_proceso, " se omite" )
 | ( identificador_de_proceso, " ocurre si ", identificador_de_objeto, " está en ",
 identificador_de_estado, ", de lo contrario ", identificador_de_proceso, " se omite" ) ;

(* ===== A.7 — Multiplicidad, expresión y listas bifurcadas ===== *)
restriccion_de_expresion = "donde ", nombre, ( ( operacion_logica, nombre_de_valor )
 | ( inicio_conjunto, ( nombre | nombre_de_valor ), { ",", ( nombre | nombre_de_valor ) }, fin_conjunto ) ) ;
operacion_logica = "=" | "<" | ">" | "<=" | ">=" ;
inicio_conjunto = " en {" ;
fin_conjunto = "}" ;
conjunto_de_cosas_objeto = cosa_objeto, [ { ", ", cosa_objeto } ], " y ", ( cosa_objeto | "más" ),
 [ ( ", ordenados por ", criterio_de_orden ) | ( ", en esa secuencia" ) ] ;
conjunto_de_cosas_proceso = cosa_proceso, [ { ", ", cosa_proceso } ], " y ", ( cosa_proceso | "más" ),
 [ ( ", ordenados por ", criterio_de_orden ) | ( ", en esa secuencia" ) ] ;
criterio_de_orden = nombre ;
cosa_objeto = [ restriccion_de_participacion, " " ], objeto_con_opcion_de_estado ;
cosa_proceso = [ restriccion_de_participacion, " " ], identificador_de_proceso ;
oracion_de_especializacion_xor_objeto = oracion_basica_xor_objeto | oracion_xor_objeto_separada_por_comas ;
oracion_basica_xor_objeto = objeto_especial, " puede ser ", identificador_de_objeto, " o ", identificador_de_objeto ;
oracion_xor_objeto_separada_por_comas = objeto_especial, " puede ser uno de ",
 identificador_de_objeto, { ", ", identificador_de_objeto }, " o ", identificador_de_objeto ;
oracion_de_herencia_multiple_objeto = objeto_especial, " es ", lista_de_objetos_generales ;
lista_de_objetos_generales = " un ", identificador_de_objeto,
 [ { " un ", identificador_de_objeto } ], " y un ", identificador_de_objeto ;

(* ===== A.8 — Estructurales (enlaces etiquetados) ===== *)
oracion_estructural = oracion_de_enlace_estructural_etiquetado | oracion_de_agregacion
 | oracion_de_caracterizacion | oracion_de_especializacion | oracion_de_instanciacion ;
oracion_de_enlace_estructural_etiquetado = oracion_etiquetado_unidireccional | oracion_etiquetado_bidireccional ;
oracion_etiquetado_unidireccional = oracion_etiquetado_unidireccional_simple | oracion_etiquetado_bifurcada ;
oracion_etiquetado_unidireccional_simple = oracion_etiquetado_nullTag_objeto
 | oracion_etiquetado_nullTag_proceso | oracion_etiquetado_nonNullTag_objeto | oracion_etiquetado_nonNullTag_proceso ;
oracion_etiquetado_nullTag_objeto = [restriccion_de_participacion, " "],
 objeto_origen, etiqueta_nula_unidireccional, [restriccion_de_participacion, " "], objeto_destino ;
oracion_etiquetado_nullTag_proceso = [restriccion_de_participacion, " "],
 proceso_origen, etiqueta_nula_unidireccional, [restriccion_de_participacion, " "], proceso_destino ;
oracion_etiquetado_nonNullTag_objeto = [restriccion_de_participacion, " "],
 objeto_origen, " ", etiqueta_directa, " ", [restriccion_de_participacion, " "], objeto_destino,
 [", ", restriccion_de_expresion] ;
oracion_etiquetado_nonNullTag_proceso = [restriccion_de_participacion, " "],
 proceso_origen, " ", etiqueta_directa, " ", [restriccion_de_participacion, " "], proceso_destino ;
etiqueta_nula_unidireccional = " se relaciona con " | etiqueta_nula_definida_por_usuario ;
oracion_etiquetado_bifurcada = oracion_bifurcada_nullTag_objeto | oracion_bifurcada_nullTag_proceso
 | oracion_bifurcada_nonNullTag_objeto | oracion_bifurcada_nonNullTag_proceso ;
oracion_bifurcada_nullTag_objeto = [restriccion_de_participacion, " "], objeto_origen,
 etiqueta_nula_unidireccional, conjunto_de_cosas_objeto ;
oracion_bifurcada_nullTag_proceso = [restriccion_de_participacion, " "], proceso_origen,
 etiqueta_nula_unidireccional, conjunto_de_cosas_proceso ;
oracion_bifurcada_nonNullTag_objeto = [restriccion_de_participacion, " "], objeto_origen,
 " ", etiqueta_directa, " ", conjunto_de_cosas_objeto ;
oracion_bifurcada_nonNullTag_proceso = [restriccion_de_participacion, " "], proceso_origen,
 " ", etiqueta_directa, " ", conjunto_de_cosas_proceso ;
oracion_etiquetado_bidireccional = oracion_bidireccional_asimetrica_objeto
 | oracion_bidireccional_asimetrica_proceso | oracion_bidireccional_simetrica_objeto
 | oracion_bidireccional_simetrica_proceso ;
oracion_bidireccional_asimetrica_objeto = ( [restriccion_de_participacion, " "],
 objeto_origen, etiqueta_directa_bidireccional, [restriccion_de_participacion, " "], objeto_destino,
 [", ", restriccion_de_expresion] )
 | ( [restriccion_de_participacion, " "], objeto_destino, etiqueta_inversa_bidireccional,
 [restriccion_de_participacion, " "], objeto_origen, [", ", restriccion_de_expresion] ) ;
oracion_bidireccional_simetrica_objeto = ( [restriccion_de_participacion, " "],
 objeto_origen, " y ", [restriccion_de_participacion, " "], objeto_destino, " son ", etiqueta_simetrica )
 | ( [restriccion_de_participacion, " "], objeto_origen, " y ", [restriccion_de_participacion, " "],
 objeto_destino, etiqueta_nula_bidireccional ) ;
oracion_bidireccional_asimetrica_proceso = ( [restriccion_de_participacion, " "],
 proceso_origen, etiqueta_directa_bidireccional, [restriccion_de_participacion, " "], proceso_destino )
 | ( [restriccion_de_participacion, " "], proceso_destino, etiqueta_inversa_bidireccional,
 [restriccion_de_participacion, " "], proceso_origen ) ;
oracion_bidireccional_simetrica_proceso = ( [restriccion_de_participacion, " "],
 proceso_origen, " y ", [restriccion_de_participacion, " "], proceso_destino, " son ", etiqueta_simetrica )
 | ( [restriccion_de_participacion, " "], proceso_origen, " y ", [restriccion_de_participacion, " "],
 proceso_destino, etiqueta_nula_bidireccional ) ;
etiqueta_simetrica = expresion_de_etiqueta ;
etiqueta_directa_bidireccional = expresion_de_etiqueta ;
etiqueta_inversa_bidireccional = expresion_de_etiqueta ;
etiqueta_nula_bidireccional = " se relacionan" | etiqueta_nula_definida_por_usuario ;

(* ===== A.9 — Estructuras fundamentales ===== *)
oracion_de_agregacion = oracion_de_agregacion_objeto | oracion_de_agregacion_proceso ;
oracion_de_agregacion_objeto = objeto_todo, " consta de ", lista_de_partes_objeto ;
oracion_de_agregacion_proceso = proceso_todo, " consta de ", lista_de_partes_proceso ;
lista_de_partes_objeto = parte_objeto, [ { ", ", parte_objeto } ], " y ", ( parte_objeto | "al menos otra parte" ) ;
lista_de_partes_proceso = parte_proceso, [ { ", ", parte_proceso } ], " y ", ( parte_proceso | "al menos otra parte" ) ;
parte_objeto = [restriccion_de_participacion, " "], identificador_de_objeto ;
parte_proceso = [restriccion_de_participacion, " "], identificador_de_proceso ;
oracion_de_caracterizacion = oracion_de_caract_objeto | oracion_de_caract_proceso ;
oracion_de_caract_objeto = identificador_de_objeto, " exhibe ",
 ( lista_de_atributos | lista_de_operadores | lista_de_atributos, ", así como ", lista_de_operadores ) ;
oracion_de_caract_proceso = identificador_de_proceso, " exhibe ",
 ( lista_de_operadores | lista_de_atributos | lista_de_operadores, ", así como ", lista_de_atributos ) ;
oracion_de_especializacion = oracion_de_especializacion_objeto | oracion_de_especializacion_proceso
 | oracion_de_especializacion_estado | oracion_de_especializacion_individual
 | oracion_de_especializacion_xor_objeto | oracion_de_herencia_multiple_objeto ;
oracion_de_especializacion_objeto = lista_de_objetos_especiales, " son ", identificador_de_objeto ;
oracion_de_especializacion_proceso = lista_de_procesos_especiales, " son ", identificador_de_proceso ;
oracion_de_especializacion_estado = lista_de_objetos_con_estado, " son ", objeto_con_estado ;
oracion_de_especializacion_individual = identificador_de_objeto, " es ", articulo, identificador_de_objeto ;
articulo = "un " | "una " ;
oracion_de_instanciacion = oracion_de_instanciacion_objeto | oracion_de_instanciacion_proceso ;
oracion_de_instanciacion_objeto = identificador_de_objeto, " es una instancia de ", identificador_de_objeto
 | lista_de_objetos_instancia, " son instancias de ", identificador_de_objeto ;
oracion_de_instanciacion_proceso = identificador_de_proceso, " es una instancia de ", identificador_de_proceso
 | lista_de_procesos_instancia, " son instancias de ", identificador_de_proceso ;

(* ===== A.10 — Gestión de contexto ===== *)
oracion_de_gestion_de_contexto = oracion_de_despliegue | oracion_de_plegado
 | oracion_de_descomposicion | oracion_de_recomposicion
 | oracion_de_composicion_intermodelo | oracion_de_referencia_externa ;
oracion_de_composicion_intermodelo = opd_hijo, " es una vista de sub-modelo de ", nombre_de_modelo
 | opd_hijo, " referencia el sub-modelo ", nombre_de_modelo, " desde ", opd_padre ;
oracion_de_referencia_externa = identificador_de_objeto, " en ", opd_hijo, " es referencia externa a ",
 identificador_de_objeto, " del modelo propietario ", nombre_de_modelo ;
oracion_de_despliegue = oracion_de_despliegue_objeto | oracion_de_despliegue_proceso ;
oracion_de_despliegue_objeto = oracion_de_despliegue_objeto_inespecificado
 | oracion_de_despliegue_objeto_todo | oracion_de_despliegue_objeto_general
 | oracion_de_despliegue_objeto_clase | oracion_de_despliegue_objeto_exhibidor ;
oracion_de_despliegue_objeto_inespecificado = identificador_de_objeto,
 " se despliega en ", lista_de_atributos, [", así como ", lista_de_operadores] ;
oracion_de_despliegue_objeto_todo = objeto_todo, " desde ", opd_padre,
 " se despliega por partes en ", opd_hijo, " en ", lista_de_partes_objeto ;
oracion_de_despliegue_objeto_general = objeto_general, " desde ", opd_padre,
 " se despliega por especialización en ", opd_hijo, " en ", lista_de_objetos_especiales ;
oracion_de_despliegue_objeto_clase = clase_de_objeto, " desde ", opd_padre,
 " se despliega por instanciación en ", opd_hijo, " en ", lista_de_objetos_instancia ;
oracion_de_despliegue_objeto_exhibidor = identificador_de_objeto, " desde ", opd_padre,
 " se despliega por rasgos en ", opd_hijo, " en ", lista_de_atributos, [", así como ", lista_de_operadores] ;
oracion_de_despliegue_proceso = oracion_de_despliegue_proceso_inespecificado
 | oracion_de_despliegue_proceso_todo | oracion_de_despliegue_proceso_general
 | oracion_de_despliegue_proceso_clase | oracion_de_despliegue_proceso_exhibidor ;
oracion_de_despliegue_proceso_inespecificado = identificador_de_proceso,
 " se despliega en ", lista_de_operadores, [", así como ", lista_de_atributos] ;
oracion_de_despliegue_proceso_todo = proceso_todo, " desde ", opd_padre,
 " se despliega por partes en ", opd_hijo, " en ", lista_de_partes_proceso ;
oracion_de_despliegue_proceso_general = proceso_general, " desde ", opd_padre,
 " se despliega por especialización en ", opd_hijo, " en ", lista_de_procesos_especiales ;
oracion_de_despliegue_proceso_clase = clase_de_proceso, " desde ", opd_padre,
 " se despliega por instanciación en ", opd_hijo, " en ", lista_de_procesos_instancia ;
oracion_de_despliegue_proceso_exhibidor = identificador_de_proceso, " desde ", opd_padre,
 " se despliega por rasgos en ", opd_hijo, " en ", lista_de_operadores, [", así como ", lista_de_atributos] ;
oracion_de_plegado = oracion_de_plegado_objeto | oracion_de_plegado_proceso ;
oracion_de_plegado_objeto = identificador_de_objeto, " se pliega en ", opd_padre ;
oracion_de_plegado_proceso = identificador_de_proceso, " se pliega en ", opd_padre ;
oracion_de_descomposicion = oracion_de_descomposicion_en_diagrama
 | oracion_de_descomposicion_en_nuevo_diagrama | oracion_de_descomposicion_objeto_en_diagrama
 | oracion_de_descomposicion_objeto_en_nuevo_diagrama ;
oracion_de_descomposicion_en_diagrama = ( identificador_de_proceso, " se descompone en ",
 lista_de_procesos, ", en esa secuencia", [", así como ", lista_de_objetos_en_zoom] )
 | ( identificador_de_proceso, " se descompone en paralelo ", lista_de_procesos,
 [", así como ", lista_de_objetos_en_zoom] )
 | ( identificador_de_proceso, " se descompone en ", lista_de_procesos,
 " y en paralelo ", lista_de_procesos, ", en esa secuencia", [", así como ", lista_de_objetos_en_zoom] ) ;
oracion_de_descomposicion_en_nuevo_diagrama = ( identificador_de_proceso, " desde ", opd_padre,
 " se descompone en ", opd_hijo, " en ", lista_de_procesos, ", en esa secuencia",
 [", así como ", lista_de_objetos_en_zoom] )
 | ( identificador_de_proceso, " desde ", opd_padre,
 " se descompone en ", opd_hijo, " en paralelo ", lista_de_procesos, [", así como ", lista_de_objetos_en_zoom] )
 | ( identificador_de_proceso, " desde ", opd_padre,
 " se descompone en ", opd_hijo, " en ", lista_de_procesos,
 " y en paralelo ", lista_de_procesos, ", en esa secuencia", [", así como ", lista_de_objetos_en_zoom] ) ;
oracion_de_descomposicion_objeto_en_diagrama = identificador_de_objeto, " se descompone en ",
 lista_de_objetos, ", en esa secuencia", [", así como ", lista_de_procesos_en_zoom] ;
oracion_de_descomposicion_objeto_en_nuevo_diagrama = identificador_de_objeto, " desde ", opd_padre,
 " se descompone en ", opd_hijo, " en ", lista_de_objetos, ", en esa secuencia",
 [", así como ", lista_de_procesos_en_zoom] ;
lista_de_objetos_en_zoom = lista_de_objetos ;
lista_de_procesos_en_zoom = lista_de_procesos ;
oracion_de_recomposicion = oracion_de_recomposicion_proceso | oracion_de_recomposicion_objeto ;
oracion_de_recomposicion_proceso = identificador_de_proceso, " se recompone desde ", opd_hijo ;
oracion_de_recomposicion_objeto = identificador_de_objeto, " se recompone desde ", opd_hijo ;

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
salto_de_linea = "\n" ;
```

Restricciones (RFC 2119):

- **R-§18-LEX-1** (`opm-opl-es A.2`, `reglas §4.14·R-OPL-LEX-1/2/3`): el alfabeto léxico ADMITE letras ASCII, vocales acentuadas, `ñ`, `ü` (mayúscula/minúscula); `caracter_de_cadena` SE LIMITA a letra, dígito decimal, `-` y `_`; `nombre_simple` COMIENZA con letra. Los no-terminales normativos SE ESCRIBEN en `snake_case`.
- **R-§18-PART-1** (`A.2`, `reglas §4.14·R-OPL-PART-1`): las restricciones de participación textuales PERTENECEN al conjunto cerrado `un/una`, `un/una opcional`, `al menos un/una`, `exactamente un/una`, `al menos dos`, `dos o más`, o límites numéricos/paramétricos (`0`, `m a n`).
- **R-§18-RANGO-1** (`A.2`, `A.7`, `reglas §4.14·R-OPL-RANGO-1/2/3`): el rango textual USA `valor`, `varía de X a Y`, o intervalos `[..]`/`(..)` con `*` exclusivamente como límite abierto; la restricción de expresión INICIA con `donde`; las operaciones lógicas SON el conjunto ASCII `=`, `<`, `>`, `<=`, `>=`. Cualquier símbolo Unicode equivalente DEBE normalizarse a ASCII o declararse como extensión de visualización.
- **R-§18-CONJ-1** (`A.7`, `reglas §4.14·R-OPL-CONJ-1`): la pertenencia a conjunto SE EMITE con `en { ... }`.
- **R-§18-LISTA-1** (`A.3`, `A.7`, `reglas §4.14·R-OPL-LISTA-1/2`): las listas SEPARAN miembros intermedios con coma y el último con `y`/`o` (alternancia `e`/`u` por fonética), SIN coma de Oxford; las listas bifurcadas TERMINAN en `más`, `ordenados por criterio` o `en esa secuencia` solo donde la producción lo permita.
- **R-§18-NORM-1**: el parser NORMALIZA la entrada a la forma ASCII canónica antes de cotejar producciones; los caracteres del alfabeto extendido (acentos, `ñ`, `ü`) SE PRESERVAN en los nombres pero las operaciones lógicas y delimitadores SE NORMALIZAN a ASCII.
- **R-§18-EXT-1** (ext `§9`): la `oracion_compuesta` es extensión de esta spec, no del Apéndice A. Coordina N hechos atómicos en UNA línea; cada hecho coordinado CONSERVA su `ref` y su sub-span (`hint`). NO SE ADMITE la fusión opaca que descarte tokens/refs por hecho. La coordinación de sujeto SOLO SE EMITE cuando el canon define el plural concordado.

Trazabilidad de parser: `app/src/opl/parser/parsear.ts` (reconocimiento de producciones), `app/src/opl/parser/tipos.ts` (tipos de la superficie reconocida).

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
| §1.1 | Enum verbal `puede ser` (especialización XOR) | — | — | — | GAP-XOR |
| §1.1 | Enum verbal `se refina` (refinamiento inter-OPD) | — | — | — | GAP-REFINA |
| §1.1 | Enum verbal `se pliega` (plegado) | — | — | — | GAP-PLIEGA |
| §1.1 | Enum verbal `se recompone` (recomposición) | — | — | — | GAP-RECOMPONE |
| §2.1 | Entidad (objeto/proceso) | `estructural.ts·oracionEntidad` | — | — | alineado |
| §2.1 | Supresión de placeholder (R-ENT-2) | `nombresCanonicos.ts·esNombreProcesoPlaceholder` (no conectado vía `refsHints.ts·entidadOplEsEmitible`) | — | — | GAP-PLACEHOLDER-ENTIDAD |
| §2.3 | Estados `puede estar` | `duracionMetadata.ts·oracionEstados` | — | — | alineado |
| §2.4 | Designación de estado | `designaciones.ts·oracionDesignacionEstado` / `textoDesignacionEstado` | — | — | alineado |
| §2.5 | Valor de atributo `es valor` | `estructural.ts·oracionValorAtributo` | — | — | alineado |
| §2.6 | Formato nominal `Instancia : Clase` | — (sin generador dedicado) | — | — | GAP-NOMBRE-INSTANCIA |
| §2.7 | Esencia (física/informática) | `estructural.ts·oracionEntidad` (vía `refsHints.ts·textoEsencia`) | — | — | alineado |
| §2.8 | Afiliación (sistémica/ambiental) | `estructural.ts·oracionEntidad` (vía `refsHints.ts·textoAfiliacion`) | — | — | alineado |
| §3.1 | Consumo `consume` | `procedural.ts·oracionEnlaceSinEtiqueta` | `parsear.ts·ABANICO_VERBO_RE_LIST` (`consume`) | `enlace-…` | alineado |
| §3.2 | Resultado `genera` | `procedural.ts·oracionEnlaceSinEtiqueta` | `parsear.ts·ABANICO_VERBO_RE_LIST` (`genera`) | — | alineado |
| §3.3 | Efecto `afecta` | `procedural.ts·oracionEfecto` | `parsear.ts·ABANICO_VERBO_RE_LIST` (`afecta`) | (sin fixture) | GAP-FIXTURE-EFECTO |
| §3.4 | Cambio de estado TS3 (`de … a …`) | `procedural.ts·oracionTransicionEstados` | `parsear.ts·ABANICO_CAMBIA_RE` / regex CS2 | (sin fixture) | GAP-FIXTURE-TS3 |
| §3.5 | Efecto parcial TS4 (`de \`estado\``) | `procedural.ts·oracionEfecto` (rama origen) | regex dedicada no verificada | (sin fixture) | GAP-PARSE-TS4 · GAP-FIXTURE-TS4 · GAP-PROCEDENCIA-ESCIND |
| §3.6 | Efecto parcial TS5 (`a \`estado\``) | `procedural.ts·oracionEfecto` (rama destino) | regex dedicada no verificada | (sin fixture) | GAP-PARSE-TS5 · GAP-FIXTURE-TS5 |
| §4.1 | Agente `maneja` (+ estado/evento/cond/negada) | `procedural.ts·oracionEnlaceSinEtiqueta` / `refsHints.ts·nombreOplExtremo` | `parsear.ts·ABANICO_VERBO_RE_LIST` (`maneja`) / `CONDICION_AGENTE_RE` | `enlace-agente-simple` | alineado |
| §4.2 | Instrumento `requiere` (+ estado/evento/cond/negada) | `procedural.ts·oracionEnlaceSinEtiqueta` / `refsHints.ts·nombreOplExtremo` | `parsear.ts·ABANICO_VERBO_RE_LIST` (`requiere`) | `enlace-instrumento-simple` | alineado |
| §4.x | Habilitador con estado especificado (HS1/HS2) | `refsHints.ts·nombreOplExtremo` (sufijo `en \`estado\``) | `ABANICO_VERBO_RE_LIST` (sin sellado) | (sin fixture) | GAP-FIXTURE-HS |
| §4.x | Abanico de instrumento/agente inverso | `abanico.ts` | `parsear.ts` (cobertura no completada) | — | GAP-ABANICO-AGENTE-PARSE |
| §5.1 | Evento `inicia` | `procedural.ts·oracionEvento` | `parsear.ts` (ruta evento) | (sin fixture) | GAP-FIXTURE-EVENTO |
| §5.1 | Evento sobre **resultado** (no canónico) | `procedural.ts·oracionEvento` (caso resultado) | — | — | GAP-EVENTO-RESULTADO |
| §5.1 | Evento sobre **invocación** (no canónico) | `procedural.ts·oracionEvento` (caso invocación) | — | — | GAP-EVENTO-INVOCACION |
| §5.2 | Condición `ocurre si … en cuyo caso … de lo contrario` | `procedural.ts·oracionCondicion` | `parsear.ts·CONDICION_OCURRE_RE` / `CONDICION_AGENTE_RE` | `parser.condicionesExcepciones.test.ts` | alineado |
| §5.2 | Condición sobre **resultado** (no canónico) | `procedural.ts·oracionCondicion` (caso resultado, `puede generarse`) | — | — | GAP-CONDICION-RESULTADO |
| §5.2 | Condición sobre **invocación** (no canónico) | `procedural.ts·oracionCondicion` (caso invocación) | — | — | GAP-CONDICION-INVOCACION |
| §5.3 | Excepción sobre/sub/sub-sobretiempo | `procedural.ts·oracionEnlaceSinModificador` / `formatoTiempo*` / `duracionMetadata.ts` | `parser.condicionesExcepciones.test.ts` | (test) | GAP-EXC-UNIDADES-LITERAL |
| §5.4 | Invocación / autoinvocación | `procedural.ts·oracionEnlaceSinModificador` / `modelo/autoinvocacion.ts·esAutoInvocacion` | — | (sin fixture) | GAP-FIXTURE-INVOCACION · GAP-INVOCACION-TILDE |
| §6.1 | Agregación `consta de` | `estructural.ts·oracionEnlaceEstructural` (agregación) | `parsear.ts·astEstructural` (`consta de`) | (sin fixture) | GAP-FIXTURE-AGREGACION |
| §6.2 | Exhibición `exhibe` / `así como` | `estructural.ts·oracionEnlaceEstructural` (exhibición) | `parsear.ts·astEstructural` (`exhibe`) | (sin fixture) | GAP-FIXTURE-EXHIBICION |
| §6.3 | Generalización `son` / `es un` | `estructural.ts·oracionEnlaceEstructural` (generalización) | `parsear.ts·astEstructural` (`es un` / `son`) | (sin fixture) | GAP-FIXTURE-GENERALIZACION |
| §6.3 | Generalización XOR `puede ser` | — | — (sin regex estructural) | — | GAP-XOR · GAP-XOR-PARSER |
| §6.4 | Clasificación `es una instancia de` / `son instancias de` | `estructural.ts·oracionEnlaceEstructural` (clasificación) | `parsear.ts·astEstructural` (`es una instancia de` / `son instancias de`) | (sin fixture) | GAP-FIXTURE-CLASIFICACION · GAP-NOMBRE-INSTANCIA |
| §6.5 | Etiquetado `tag` / `se relaciona con` / `se relacionan` (SE1–SE5) | `procedural.ts·oracionEstructuralEtiquetada` | — (sin regex en `astEstructural`) | (sin fixture) | GAP-TAG-PARSER · GAP-FIXTURE-TAGGED |
| §6.6 | Etiquetado con estado especificado (SSE1–SSE7) | `procedural.ts·oracionEstructuralEtiquetada` (sufijo de estado) | — | (sin fixture) | GAP-SSE-PARSER · GAP-FIXTURE-SSE |
| §7.1 | Descomposición `se descompone en` / `paralelo` (CX1/CX2) | `refinamiento.ts·oracionDescomposicion` / `oracionParalelo` / `describirProcesosTemporales` | — (sin regex dedicada) | `parser.designacionesPlegado.test.ts` (parcial) | GAP-CX-PARSER · GAP-FIXTURE-DESCOMPOSICION |
| §7.1 | Recomposición `se recompone desde` (CX7/CX8) | — | — | — | GAP-RECOMPONE |
| §7.2 | Despliegue por relación fundamental (CX3) | `refinamiento.ts·oracionDespliegue` / `modoDespliegue` / `modoPorTipoEnlace` | regex estructurales de §6 | `parser.designacionesPlegado.test.ts` | alineado |
| §7.2 | Plegado parcial | `plegado.ts·oracionPlegadoParcial` / `bloquesJerarquicos.ts·agruparOracionesPorOpd` | `parser.designacionesPlegado.test.ts` | (test) | alineado |
| §7.2 | Plegado total `se pliega en el OPD padre` (CX5/CX6) | — | — | — | GAP-PLIEGA |
| §7.3 | Refinamiento autónomo `se refina por …` (CX4) | — (jerarquía vía `bloquesJerarquicos.ts·ordenarOpdsParaOpl` / `profundidadOpd`) | — | — | GAP-REFINA |
| §7.4 | Visibilidad de estados por OPD | `duracionMetadata.ts·oracionEstados` / `bloquesJerarquicos.ts·agruparOracionesPorOpd` | — | — | alineado |
| §7.5 | Marca temporal solo en descomposición de proceso | `refinamiento.ts·oracionesRefinamiento` / `describirProcesosTemporales` | — | — | alineado |
| §8 | Distribución/migración de enlaces por OPD | `bloquesJerarquicos.ts·agruparOracionesPorOpd` (operación de modelo, `reglas §8.11`) | — | — | alineado |
| §8.3 | Resolución de colisión de rol / precedencia recomposición | — (vive en kernel de modelo, no en capa OPL) | — | — | GAP-COL-RESOLUCION |
| §7.7 / §9 | Guard anti-coordinación de enlaces en refinamiento | — (protección por construcción, sin guard) | — | — | GAP-COMP-GUARDA |
| §7.6 | Fan bajo evento `inicia` + cuantificador (C-19) | — (`abanico.ts` solo condicional) | — | — | GAP-FAN-EVENTO |
| §7.6 | Fan resultado+condición (C-20, `puede generarse`) | `abanico.ts·oracionAbanicoCondicional` (no canónico) | — | — | GAP-FAN-RESULTADO-COND |
| §7.6 | Fan probabilístico `Pr=p` por rama (C-22) | `procedural.ts·sufijoProbabilidad` (sufijo `(probabilidad: %)`, no canónico) | — | — | GAP-PROB-SUPERFICIE |
| §7.6 | Fan `m de f` (R-FAN-8) | — (`abanico.ts` solo `m=1`) | — | — | GAP-FAN-M |
| §9 | Composición eje (a) — predicados coordinados | — (capa de composición ausente) | — (descomposición serial ausente) | — | GAP-COMPOSICION · GAP-COMP-REVERSE |
| §11 | Etiqueta de ruta (path label) | `refsHints.ts·nombreOplExtremo` / `procedural.ts` (etiqueta de ruta) | — | — | GAP-VERIFY |
| §12–§13 | Display por OPD / orden / bloques | `bloquesJerarquicos.ts·agruparOracionesPorOpd` / `ordenarOpdsParaOpl` / `plegado.ts·oracionPlegadoParcial` | — | — | alineado |
| §14.x | Panel OPL interactivo / tokens / referencias | `panel.ts·derivarPanelOpl` / `interaccion.ts·OplToken` / `crearLineaOplInteractiva` / `referenciaEnlaceEspecifico` | — | — | alineado |
| §14.5 | Navegación click→foco (handler UI) | `interaccion.ts` (`OplToken.ref`) + handler en `app/src/ui` | — | — | GAP-VERIFY |
| §15 | Edición OPL clasificada / aplicación | `clasificadorEdicion.ts·clasificarEdicionOpl` / `edicionCanvas.ts·aplicarEdicionOpl` | `aplicar.ts·aplicarPatchesOpl` / `aplicarPatchEnlace` / `aplicarPatchAbanico` | — | alineado |
| §15.x | Mutación por hecho (re-tokenización sub-span) | — (se traza a §9 y §14.5, no a función nueva) | `interaccion.ts·referenciaEnlaceEspecifico` | — | GAP-VERIFY |
| §16 | Visibilidad de esencia / orden canónico | `opciones.ts·VisibilidadOpl` / `VISIBILIDAD_OPL_DEFAULT` | — | — | alineado |
| §18 | Diagnóstico / fail-fast | — | `aplicar.ts·aplicarPatchesOpl` (`Resultado<Modelo>`) / `clasificadorEdicion.ts·razonDesdeDiagnostico` / parser `DiagnosticoOpl` | — | alineado |

### §20.2 Índice de GAPs

Lista consolidada de todos los marcadores `GAP-*` (sección de origen · descripción de una línea). La auditoría de alineación los cierra; aquí solo se enumeran.

| GAP | Origen | Descripción |
|-----|--------|-------------|
| GAP-VARIA | §1.1 | `varía de … a` canónico, sin generador. |
| GAP-TIPO | §1.1 | `es de tipo` canónico, sin generador. |
| GAP-XOR | §1.1 / §6.3 | `puede ser` (especialización XOR) canónico, sin generador. |
| GAP-XOR-PARSER | §6.3 | `puede ser` sin regex estructural en `astEstructural`. |
| GAP-REFINA | §1.1 / §7.3 | `se refina por …` (CX4) canónico, sin generador autónomo ni parser. |
| GAP-PLIEGA | §1.1 / §7.2 | `se pliega en` (plegado total CX5/CX6) canónico, sin generador ni parser (existe plegado parcial). |
| GAP-RECOMPONE | §1.1 / §7.1 | `se recompone desde` (CX7/CX8) canónico, sin generador ni parser. |
| GAP-PLACEHOLDER-ENTIDAD | §2.1 | `esNombreProcesoPlaceholder` no conectado a la emisión (R-ENT-2 sin efecto). |
| GAP-NOMBRE-INSTANCIA | §2.6 / §6.4 | Formato nominal `Instancia : Clase` sin generador dedicado. |
| GAP-FIXTURE-EFECTO | §3.3 | Sin fixture roundtrip dedicado de efecto básico. |
| GAP-FIXTURE-TS3 | §3.4 | Sin fixture roundtrip dedicado de cambio de estado. |
| GAP-PARSE-TS4 | §3.5 | Regex de `cambia … de \`estado\`` sin `a` no verificada. |
| GAP-FIXTURE-TS4 | §3.5 | Sin fixture dedicado de efecto parcial TS4. |
| GAP-PROCEDENCIA-ESCIND | §3.5 | Metadato de procedencia escindido no rastreado en este pase. |
| GAP-PARSE-TS5 | §3.6 | Regex de `cambia … a \`estado\`` sin `de` no verificada fuera del abanico. |
| GAP-FIXTURE-TS5 | §3.6 | Sin fixture dedicado de efecto parcial TS5. |
| GAP-FIXTURE-HS | §4.x | Sin fixture de habilitador con estado especificado (HS1/HS2) ni variantes evento/cond/negada. |
| GAP-ABANICO-AGENTE-PARSE | §4.x | Abanico de instrumento y fan inverso sin verificación de cobertura de parseo. |
| GAP-FIXTURE-EVENTO | §5.1 | Sin fixture roundtrip dedicado de evento. |
| GAP-EVENTO-RESULTADO | §5.1 | Generador emite evento de resultado (VIOLA R-MOD-INPUT-2); no canónico. |
| GAP-EVENTO-INVOCACION | §5.1 | Generador emite `inicia e invoca` (VIOLA R-MOD-CAT-1); no canónico. |
| GAP-CONDICION-RESULTADO | §5.2 | Generador emite condición de resultado con `puede generarse` (VIOLA R-MOD-INPUT-2); no canónico. |
| GAP-CONDICION-INVOCACION | §5.2 | Generador emite `invoca … si … ocurre` (VIOLA R-MOD-CAT-1); no canónico. |
| GAP-EXC-UNIDADES-LITERAL | §5.3 | `formatoTiempo` operacionaliza `unidades-tiempo` con valor+unidad concretos; diverge del literal de plantilla. |
| GAP-FIXTURE-INVOCACION | §5.4 | Sin fixture roundtrip dedicado de invocación/autoinvocación. |
| GAP-INVOCACION-TILDE | §5.4 | Grafía `despues de` sin tilde en la emisión. |
| GAP-FIXTURE-AGREGACION | §6.1 | Sin fixture roundtrip dedicado de agregación. |
| GAP-FIXTURE-EXHIBICION | §6.2 | Sin fixture roundtrip dedicado de exhibición. |
| GAP-FIXTURE-GENERALIZACION | §6.3 | Sin fixture roundtrip dedicado de generalización. |
| GAP-FIXTURE-CLASIFICACION | §6.4 | Sin fixture roundtrip dedicado de clasificación. |
| GAP-TAG-PARSER | §6.5 | `se relaciona con` / `se relacionan` / etiquetas de usuario sin regex en `astEstructural`. |
| GAP-FIXTURE-TAGGED | §6.5 | Sin fixture roundtrip dedicado de etiquetado. |
| GAP-SSE-PARSER | §6.6 | Etiquetados con estado especificado heredan GAP-TAG-PARSER (sin regex). |
| GAP-FIXTURE-SSE | §6.6 | Sin fixture dedicado de estructural con estado especificado. |
| GAP-FIXTURE-ESTRUCTURALES | §6.x | Sin fixtures roundtrip dedicados para las estructurales (agregación/exhibición/generalización/clasificación/etiquetado). |
| GAP-CX-PARSER | §7.1 | `se descompone en` se genera pero no hay regex que la reconstruya como refinamiento. |
| GAP-FIXTURE-DESCOMPOSICION | §7.1 | Sin fixture roundtrip dedicado de descomposición/despliegue. |
| GAP-COMP-GUARDA | §7.7 / §9 | Sin guard programático que prohíba coordinar enlaces hijos en refinamiento (R-CX-COMP / R-COMP-ZP-1). |
| GAP-FAN-EVENTO | §7.6 | `abanico.ts` no emite fan bajo evento (`inicia` + cuantificador, C-19). |
| GAP-FAN-RESULTADO-COND | §7.6 | `oracionAbanicoCondicional` emite `puede generarse` para resultado+condición+fan (C-20); no canónico. |
| GAP-PROB-SUPERFICIE | §7.6 | `sufijoProbabilidad` emite sufijo `(probabilidad: %)` por enlace, no `Pr=p` por rama en fan XOR (C-22). |
| GAP-FAN-M | §7.6 | Sin generador para `exactamente m de f` / `al menos m de f` (solo `m=1`). |
| GAP-COL-RESOLUCION | §8.3 | Resolución de colisión de rol / precedencia de recomposición vive en kernel; sin generador OPL de reporte. |
| GAP-COMPOSICION | §9 | Sin capa que coordine predicados de distinto verbo bajo sujeto-proceso compartido (eje a). |
| GAP-COMP-REVERSE | §9 | Parser no descompone una línea de predicados coordinados de distinto verbo (R-COMP-REV-1). |
| GAP-VERIFY | §11 / §14.5 / §15.x | Trazas no confirmadas en este pase: etiqueta de ruta, handler click→foco (UI), mutación por hecho. |

### §20.3 Cobertura inversa

Barrido de los exports de `app/src/opl/**` para detectar símbolos sin entrada trazada en §1–§18 (`GAP-spec`) o ya cubiertos.

| Símbolo | Archivo | Estado |
|---------|---------|--------|
| `oracionEnlaceConRuta` | `generadores/procedural.ts` | trazado §11 (etiqueta de ruta, GAP-VERIFY) |
| `oracionProcedimentalParaRuta` | `generadores/procedural.ts` | trazado §11 (GAP-VERIFY) |
| `transicionesEstado` / `transicionesEstadoInteractivo` | `generadores/procedural.ts` | cubierto §3.4 (helpers de cambio de estado) |
| `oracionesAbanicoInteractivo` / `oracionesAbanico` / `oracionAbanico` | `generadores/abanico.ts` | cubierto §7.6 (fan); ramas evento/m/prob en GAP-FAN-* |
| `emitirDespliegueOcurren` | `generadores/refinamiento.ts` | GAP-spec — emisión de despliegue sin entrada explícita en §7.2 |
| `emitirEspecializacion` | `generadores/refinamiento.ts` | GAP-spec — ligado a `puede ser` / generalización; sin traza explícita (relacionar con GAP-XOR) |
| `oracionRefinamiento` / `oracionesRefinamiento` | `generadores/refinamiento.ts` | cubierto §7.1–§7.5 |
| `oracionesUnidadDescripcionEstados` / `formatearAliasInline` / `formatearUnidadInline` / `formatearDescripcionInline` | `generadores/duracionMetadata.ts` | GAP-spec — metadatos inline de duración/alias/unidad sin entrada dedicada en spec |
| `formatearDuracion` / `nombreEstadoOpl` | `generadores/duracionMetadata.ts` | cubierto §2.3 / §5.3 |
| `pluralizarCanonico` / `multiplicidadPlural` / `verbo` / `listarOpl` / `listarEstadosOpl` / `listarDesignaciones` / `nombreOplConMultiplicidad` | `generadores/refsHints.ts` | cubierto (utilitarios de superficie; multiplicidad §10, listas en cada familia) |
| `codigoOpd` | `generadores/refsHints.ts` | cubierto §7 / §12 (código de OPD) |
| `entidadOplEsEmitible` / `estadoOplEsEmitible` / `extremoOplEsEmitible` / `enlaceOplEsEmitible` | `generadores/refsHints.ts` | cubierto §2.1 (emitibilidad); ligado a GAP-PLACEHOLDER-ENTIDAD |
| `extraerMultiplicidad` | `parser/parsear.ts` | cubierto §10 (multiplicidad reverse) |
| `parsearParrafoOpl` / `normalizarLineas` / `normalizarNombreOpl` / `claveNombre` | `parser/parsear.ts` | cubierto §18 (normalización) / §19 (parseo) |
| `planificarEdicionOplLibre` | `parser/planificar.ts` | cubierto §15 (planificación de edición) |
| `aplanarBloquesOpl` / `chevronEstadoBloque` / `togglearColapsoBloque` | `bloquesJerarquicos.ts` | GAP-spec — mecánica de colapso/expansión de bloques sin entrada dedicada en §12–§13 |
| `OplReferencia` / `OplToken` / `OplLineaInteractiva` / `OplTokenHint` (tipos) | `interaccion.ts` | cubierto §14 (modelo de tokens) |
| `RazonNoAplicable` / `EstadoLineaOpl` / `LineaClasificada` / `ResultadoClasificacion` (tipos) | `clasificadorEdicion.ts` | cubierto §15 / §18 |
| `OracionOplAst` / `PatchOplPropuesto` / `ReferenciaEntidadPatch` / `PrevisualizacionOplReverse` (tipos) | `parser/tipos.ts` | cubierto §15 / §19 (AST y patches) |
| `oracionPlegadoParcial` | `generadores/plegado.ts` | cubierto §7.2 / §12 |
| `leyes/opl-reverse.test.ts` (ley `law-opl-safe-lens`) | `leyes/` | cubierto §19 |

`GAP-spec` detectados (4): `emitirDespliegueOcurren`, `emitirEspecializacion`, los formateadores inline de `duracionMetadata.ts` (`oracionesUnidadDescripcionEstados`/`formatear{Alias,Unidad,Descripcion}Inline`), y la mecánica de colapso de bloques (`aplanarBloquesOpl`/`chevronEstadoBloque`/`togglearColapsoBloque`). La auditoría de alineación DEBE darles entrada en la spec o reclasificarlos como helpers no normativos.

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

| Invariante | Enunciado | Origen |
|------------|-----------|--------|
| **R-§21-OPL-VOCAB** Vocabulario cerrado | Los verbos, cópulas y conectores OPL PERTENECEN a un conjunto cerrado; ningún sinónimo libre es admisible. | §1 |
| **R-§21-OPL-TIPO** Tipografía portadora de tipo | El tipo de cada token (objeto, proceso, estado) SE CODIFICA tipográficamente: **objeto** (negrita), *proceso* (cursiva), `estado` (monoespaciado). La tipografía es semántica, no decorativa. | §2, §13 |
| **R-§21-OPL-MOD** Un modificador por enlace | Cada enlace ADMITE como máximo un modificador de control; la combinación de modificadores en un mismo enlace está PROHIBIDA. | §8 |
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
| OPL repartido entre `opm-opl-es` (gramática OPL-ES) y `reglas-opm-estrictas §4` (reglas de canon) | `spec-forja-opl.md` es la SSOT OPL bidireccional/operativa única de OPFORJA |
| Para resolver una duda OPL había que cruzar dos fuentes y reconciliarlas a mano | una sola fuente con trazabilidad `Rationale:` hacia ambas |
| La implementación (generadores/parser/leyes) se alineaba contra canon implícito | la implementación se alinea contra esta spec, vía la tabla de trazabilidad §20 |

### §23.2 Qué migrar

- **R-§23-MIG-1**: la implementación (`app/src/opl/`) DEBE alinearse contra esta spec usando la tabla de trazabilidad §20 (regla→artefacto). Toda divergencia entre código y spec es deuda a cerrar; ante conflicto, la SSOT de canon (`reglas-opm-estrictas.md`) sigue por encima de esta spec (regla de oro §1 del proyecto).
- **R-§23-MIG-2**: los GAPs abiertos heredados del canon disperso DEBEN re-rastrearse contra esta spec y cerrarse vía fixtures/leyes (§22), no vía notas sueltas.

### §23.3 Qué se deprecia

- **R-§23-DEP-1**: SE DEPRECIA consultar dos fuentes dispersas (`opm-opl-es` + `reglas §4`) como ruta primaria para resolver OPL en OPFORJA. Esas fuentes SE CONSERVAN como SSOT de canon OPM general y como `Rationale:` de esta spec, pero la ruta operativa primaria para OPL es ahora este documento.
- **R-§23-DEP-2**: NO SE ADMITE redactar reglas OPL nuevas fuera de esta spec; toda regla nueva ENTRA aquí con su `Rationale:` y su `Enforcement`.

Rationale: regla de oro §1 del proyecto (`reglas-opm-estrictas.md` SSOT suprema; `opm-opl-es` SSOT externa) + tabla de trazabilidad §20 (alineación implementación↔spec) + §22 (cierre de GAPs por evaluación). Bump major 1.0.0 por cambio de fuente operativa.
