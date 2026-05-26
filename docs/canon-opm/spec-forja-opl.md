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
