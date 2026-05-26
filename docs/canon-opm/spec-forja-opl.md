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

<!-- El cuerpo normativo restante (§3…) y las secciones de cierre se agregan en tareas siguientes. -->
