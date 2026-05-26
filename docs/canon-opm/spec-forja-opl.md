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

<!-- El cuerpo normativo restante (§2…) y las secciones de cierre se agregan en tareas siguientes. -->
