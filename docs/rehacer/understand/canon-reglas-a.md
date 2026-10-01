# Dossier normativo — `reglas-opm-estrictas-es` v1.5.0 · tramo A (líneas 1–875)

Fuente: `canon/reglas-opm-estrictas-es/content.md` (1523 líneas) + `object.yaml`. Tramo leído completo, en bloques de 300 líneas o menos: 1–300, 300–599, 600–879.
Cubre: frontmatter, Definición, Mapa de familia, Definiciones, Precedencia, Convenciones (citas, exhaustividad R-DOC, niveles de decisión, conformidad R-CONF, principios R-PRIN), §2 Ontología, §3 Reglas visuales OPD, §4 Gramática OPL-ES, §5 Taxonomía de enlaces. El tramo termina en el encabezado de §6.1 (línea 878), que no está cubierto.

Convenciones de este dossier:
- **Oblig.** usa la palabra del canon. Si el canon no usa una palabra normativa y hay que deducirla, se marca `inferido (DEBE)` o `inferido (NO DEBE)`. Las tablas son normativas por declaración del propio canon (línea 120: «Las **tablas son normativas**»).
- **Consecuencia** para la herramienta: `impedir`, `advertir`, `generar OPL`, `parsear OPL`, `renderizar`, `operación`, `modelo de datos`, `export/import`, `solo método`, `no aplica`.
- Cuando la severidad sale de otra parte del mismo documento (por ejemplo la tabla AP de §11, líneas 1338–1367), se indica con «(sev. AP-nn, fuera de tramo)».

---

## 0. Metadatos (object.yaml + frontmatter)

- `id: urn:fxsl:kb:reglas-opm-estrictas-es`, `kind: knowledge`, `publication.status: legacy`, `provenance.legacy_state: publicado`.
- `requires`/`depende`: `opm-es`, `opl-es`, `opd-es`, `manual-metodologico-opm-es` son capas base, **fuera del canon entregado**.
- `cita`: `metodologia-forja-opm-es`, `spec-forja-opd-es` y `spec-forja-opl-es` (los tres hermanos del canon); `opm-categorial-es` y los `icas-*` quedan **fuera del canon**.
- El frontmatter declara `version: 1.5.0`, `estado: publicado`, `autor: FS`, `creado: 2026-05-31`. El campo `fuente` narra la procedencia: re-sync desde «la bestia (~/kora)», decisión HITL 2026-06-15 («pneuma toma la posta como SSOT viva»), deltas v1.4.0 y v1.4.1 (R-INV-2D, R-IDP-0A), enmienda v1.5.0 del 2026-07-27 («gate de Bocetos por régimen documental; separa integración, graduación, export y validación humana»).
- **Consecuencia**: ninguna para la herramienta; es procedencia. Hay una discrepancia entre `object.yaml` (`status: legacy`) y el frontmatter (`estado: publicado`), sin efecto operativo.

---

## 1. Claves de lectura normativas (aplican a todo el canon)

### 1.1 Niveles de decisión (líneas 110–118), copia textual

| Estado | Significado operativo |
|---|---|
| **Canónico** | Se puede crear, serializar, importar y editar bidireccionalmente. |
| **Canónico condicionado** | Se puede usar solo si se cumplen las condiciones indicadas; si faltan, la herramienta debe pedir datos o advertir. |
| **No canonizado** | La SSOT no lo define. No se debe inventar como OPM nuclear; solo puede existir como extensión declarada. |
| **Prohibido** | Contradice una regla de la SSOT. La herramienta debe bloquearlo o reportarlo como error estructural. |
| **UI / vista** | Puede existir en pantalla, pero no es hecho OPM nuclear ni debe emitir OPL nuclear. |

La tabla fija el contrato de comportamiento: lo **prohibido** se bloquea o se reporta como error estructural; lo **condicionado** pide datos o advierte; lo que es **UI/vista** no emite OPL nuclear.

### 1.2 Definiciones con efecto (líneas 43–55)

- **Gate ejecutable**: «Checker, test, ley, validador o política de import/export que aplica una regla sin depender de interpretación humana.»
- **Bimodalidad**: «Invariante por el cual un hecho OPM editado en OPD puede realizarse en OPL y una oración OPL canónica puede volver al mismo hecho.» Es el invariante central del producto: OPD→OPL→OPD (y OPL→OPD→OPL) conserva el hecho.
- **Extensión declarada**: «Capacidad de opforja que no pertenece al núcleo ISO/OPM base, pero se admite si queda tipificada, trazada, verificable y no contradice la semántica OPM.»
- **Severidad**: «bloqueo, advertencia, mejora metodológica, vista/UI o extensión pendiente». Son 5 niveles de diagnóstico.

### 1.3 Precedencia y desempate (líneas 29–69)

- Reparto de propiedad: este documento decide **validez y severidad**; `metodologia-forja` decide el **método**; `spec-forja-opd` la **realización visual**; `spec-forja-opl` la **realización textual y el roundtrip**.
- **Desempate de plantilla** (línea 41, textual): «ante divergencia de una plantilla OPL entre este documento (tablas-gate) y `spec-forja-opl-es` (superficie operativa), manda este documento — es validez —; `spec-forja-opl-es` se corrige.» Consecuencia: las plantillas de §4 de este tramo son el **gate de validez** de lo que la herramienta genera y parsea (R-BI-TAB-1, fuera de tramo, línea 1229).
- `spec-forja-opd-es` y `spec-forja-opl-es` quedan subordinadas a este documento para el canon nuclear (qué es una cosa, un enlace, un estado, una prohibición o una severidad).
- «Las capacidades de herramienta NO redefinen semántica OPM por sí solas.»
- «**OPCloud (la implementación comercial de referencia) NO es autoritativo.**» Consecuencia: no copiar comportamiento de OPCloud por sí mismo.

### 1.4 Contrato de exhaustividad (R-DOC-1..8): gobernanza documental

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-DOC-1 | El documento formula reglas, no historia ni tutorial. | DEBE | no aplica |
| R-DOC-2 | Todo contenido se clasifica como obligación/prohibición/condición/default/severidad/política/matriz/gate. | DEBE | no aplica |
| R-DOC-3 | Todo ejemplo es patrón permitido o prohibido. | DEBE | no aplica; útil como fixtures |
| R-DOC-4/4A/4B | Cobertura local de las capas base; la remisión PUEDE conservar la EBNF completa, pero NO DEBE sustituir la regla local; sin índices que dupliquen reglas. | DEBE / PUEDE / NO DEBE | no aplica (ver GAP-01 sobre la EBNF) |
| R-DOC-4C | Simulación, MBSE/PDR y ejecución computacional DEBEN vivir fuera del canon salvo que alteren canonicidad o roundtrip. | DEBE | no aplica (ver CONTRA-06) |
| R-DOC-5 | Una divergencia no declarada con la capa base abre corrección documental. | DEBE | no aplica |
| R-DOC-6 | No copiar prosa sin efecto operativo. | NO DEBE | no aplica |
| R-DOC-7 | Una capacidad de herramienta no canonizada se clasifica como `UI / vista`, `No canonizado` o `extensión declarada`, nunca como OPM nuclear. | DEBE | **modelo de datos**: todo lo que la app agregue fuera del canon (notas, handles, colores de UI) no emite OPL nuclear |
| R-DOC-8 | Redacción normativa en español con acentos, salvo código/identificadores/tokens. | DEBE | no aplica |

---

## 2. Conformidad y principios

### 2.1 Conformidad (líneas 122–133), tabla textual

| Nivel de conformidad | Reglas obligatorias |
|---|---|
| Parcial simbólico | **R-CONF-1**: usar exclusivamente símbolos OPM y elementos con semántica asignada. |
| Completo | **R-CONF-2**: cumplir R-CONF-1 y aplicar consistentemente principios, contexto, refinamiento, dualidad OPD↔OPL y consistencia de hechos. |
| Herramienta | **R-CONF-3**: cumplir R-CONF-1/R-CONF-2, soportar validación de conformidad completa y soportar OPL-ES conforme a EBNF. |

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-CONF-1 | Solo símbolos OPM y elementos con semántica asignada. | inferido (DEBE) | **impedir**: la paleta del lienzo no ofrece primitivas sin semántica OPM |
| R-CONF-2 | Principios, contexto, refinamiento, dualidad OPD↔OPL y consistencia de hechos, aplicados de forma consistente. | inferido (DEBE) | **impedir/advertir** + **generar/parsear OPL** |
| R-CONF-3 | Una herramienta conforme soporta validación de conformidad completa y OPL-ES conforme a la EBNF. | inferido (DEBE) | **operación**: validador integrado + **parsear/generar OPL** según la EBNF |
| R-CONF-4 | Persistir símbolos sin semántica OPM ⇒ la implementación no es conforme. | inferido (NO DEBE) | **modelo de datos**: el modelo persistido solo contiene cosas, estados y enlaces OPM (más metadatos de UI marcados como tales) |
| R-CONF-5 | Sin validar refinamiento, contexto ni consistencia OPD↔OPL, la implementación es solo «parcial». | inferido (DEBE validar) | **impedir/advertir**: el validador cubre refinamiento, contexto y OPD↔OPL |
| R-CONF-6 | OPL aceptado fuera de la EBNF se clasifica como legacy, extensión o error; NO DEBE presentarse como OPL-ES canónico. | DEBE / NO DEBE | **parsear OPL**: una línea que no cae en la gramática se reporta (error o extensión), nunca se acepta en silencio como canónica |
| R-CONF-7 | Toda regla DEBE con tráfico operativo (export canónico, OPL consumido, render) es deuda exigible. Una regla DEBE sin tráfico PUEDE programarse (en un **registro de conformidad** de la herramienta, fuera del canon) o enmendarse (en la spec). La brecha silenciosa está **PROHIBIDA**. | DEBE / PUEDE / PROHIBIDO | **no aplica al runtime**; obliga al repo a mantener un registro de conformidad (reglas DEBE diferidas y declaradas). Ver SOBRE-02 |

### 2.2 Principios de modelado (R-PRIN-1..9)

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-PRIN-1 | Todo modelo declara su propósito antes de fijar alcance o detalle. | DEBE | **solo método**; como mucho un campo opcional «propósito» en el modelo (inferido) |
| R-PRIN-2 | El alcance se deriva de función, propósito e interesados. | DEBE | solo método |
| R-PRIN-3 | Función, estructura y comportamiento en un mismo formalismo; no separar comportamiento en una notación externa. | DEBE / NO DEBE | **modelo de datos**: un solo modelo OPM; sin diagramas paralelos no-OPM |
| R-PRIN-4 | La función se expresa como proceso que entrega valor a un beneficiario. | DEBE | solo método |
| R-PRIN-5 | Función y comportamiento se mantienen distinguibles. | DEBE | solo método |
| R-PRIN-6 | El límite del sistema declara qué es sistémico y qué es ambiental. | DEBE | **modelo de datos**: afiliación por cosa (sistémica/ambiental) |
| R-PRIN-7 | El entorno son cosas fuera del sistema; NO DEBE mezclarse sin contorno o afiliación correctos. | DEBE / NO DEBE | **renderizar**: contorno discontinuo para lo ambiental |
| R-PRIN-8 | Detalle vía jerarquía de OPDs; un OPD sobrecargado DEBE refinarse, simplificarse o convertirse en vista tipificada. | DEBE | **advertir** (enlaza con R-LAY-1) |
| R-PRIN-9 | La vista para un interesado es vista del mismo modelo, no una copia divergente. | DEBE | **modelo de datos**: los OPD referencian las mismas entidades (apariencias), nunca copias |

---

## 3. §2 Ontología de entidades

### 3.1 Cosas (§2.1), tabla textual

| Clase | Glosario | Símbolo | Perseverancia (3.50) |
|---|---|---|---|
| Objeto | 3.39 | Rectángulo | persistente |
| Proceso | 3.58 | Elipse | transitoria |

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-COSA-1 | Solo objetos y procesos son cosas. No existen «entidades», «nodos genéricos», «actores» ni «componentes» como clases ontológicas. | inferido (DEBE / NO DEBE) | **modelo de datos**: `kind ∈ {objeto, proceso}`, cerrado |
| R-COSA-2 | La perseverancia se infiere del tipo y NO es atributo visual. Objetos = persistentes; procesos = transitorios. «No hay otras opciones.» | inferido (DEBE) | **modelo de datos**: la perseverancia es derivada, no se guarda (ver CONTRA-01) |
| R-COSA-3 | El estado NO es una cosa; es una situación de un objeto. | inferido (NO DEBE) | **modelo de datos**: el estado es hijo de un objeto |

### 3.2 Objetos (§2.2)

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-OBJ-1 | Un objeto representa una cosa con existencia física o informacional potencial. | inferido | no aplica (definición) |
| R-OBJ-2 | Un objeto es con estados (`s ≥ 1`) o sin estados (`s = 0`). **Un objeto sin estados no puede ser afectado**: solo puede crearse (resultado) o consumirse (consumo). | inferido (NO DEBE) | **impedir**: no hay enlace de efecto hacia un objeto sin estados (= R-EFE-1) |
| R-OBJ-3 | Tres propiedades genéricas: **perseverancia** = persistente (fija); **esencia** ∈ {física, informacional}, default **informacional**; **afiliación** ∈ {sistémica, ambiental}, default **sistémica**. | inferido (DEBE) | **modelo de datos** con esos defaults |
| R-OBJ-4 | Un objeto PUEDE declarar tipo computacional ∈ {`boolean`, `string`, `integer`, `float`, `double`, `short`, `long`, `enumerated`}. | PUEDE | modelo de datos opcional (ver SOBRE-06) |
| R-OBJ-5 | La herramienta PUEDE derivar la esencia por defecto desde perfil o preset; el default NO DEBE sobrescribir una esencia explícita. | PUEDE / NO DEBE | **modelo de datos**: distinguir un default de un valor explícito solo si existen presets |
| R-OBJ-6 | Los atributos de objetos ambientales DEBEN ser ambientales. | DEBE | **impedir o advertir** (inferido); lo más simple es propagar la afiliación a los atributos exhibidos |
| R-OBJ-7 | Los procesos ejecutados por cosas ambientales DEBEN modelarse como ambientales. | DEBE | **advertir** (inferido; «ejecutado por» no es mecánicamente decidible sin agente/instrumento) |

### 3.3 Procesos (§2.3)

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-PROC-1 | Un proceso transforma uno o más objetos. | inferido | ver R-PROC-2 |
| R-PROC-2 | Todo proceso explícito no persistente DEBE transformar al menos un objeto mediante consumo, resultado o efecto. **Los habilitadores no satisfacen este requisito.** | DEBE | **advertir** (inferido; en edición el proceso nace sin enlaces) y **bloquear el cierre/export canónico** (inferido) |
| R-PROC-2A | Un proceso persistente satisface el cierre solo si declara objeto afectado e invariancia neta, atributo o condición mantenida (R-PROC-5..7). | inferido (DEBE) | advertir (ver CONTRA-01) |
| R-PROC-3 | Un proceso tiene duración positiva. | inferido (DEBE) | **impedir** una duración ≤ 0 si hay campo de duración |
| R-PROC-4 | **OPM no admite estados de proceso** («iniciado», «en proceso», «terminado»); se descompone en *Iniciar*, *Procesar*, *Finalizar*. | inferido (NO DEBE) | **impedir** (sev. AP-12 «DEBE bloquearse», fuera de tramo): no se pueden agregar estados a una elipse |
| R-PROC-5 | Un proceso persistente solo es canónico si la temporalidad, el esfuerzo sostenido o la condición mantenida forman parte del hecho. | inferido (DEBE) | solo método / advertir |
| R-PROC-6 | El proceso persistente NO DEBE ser un escape genérico; sin transformación ni condición sostenida DEBE reemplazarse por estructural etiquetado, atributo o estado. | NO DEBE / DEBE | solo método / advertir (AP-25, fuera de tramo: «DEBE reportarse») |
| R-PROC-7 | El proceso persistente que conserva un objeto en el mismo estado DEBE declarar objeto afectado e invariancia neta (`estado_entrada = estado_salida`) o el atributo/condición mantenida. | DEBE | **generar OPL**: TS3 con entrada = salida (R-OPL-PERSIST-2) |

### 3.4 Nombres válidos (§2.4)

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-NOM-OBJ-1 | El nombre de objeto es un sustantivo singular con palabras léxicas capitalizadas. | DEBE | **advertir** (inferido; checker léxico) |
| R-NOM-OBJ-2 | Un objeto plural se nombra con sufijo **Conjunto** (inanimados) o **Grupo** (humanos). | DEBE | **advertir** (inferido) |
| R-NOM-PROC-1 | El nombre de proceso es **forma deverbal**: infinitivo (`-ar`/`-er`/`-ir`) o nominalización deverbal (sufijos `-ción`, `-miento`, `-aje`, `-ura`, `-ncia`, o sin sufijo: `Despacho`, `Ingreso`, `Cierre`, `Retiro`, `Traslado`). EXCLUIDOS: sustantivos no verbales (`Sistema`, `Módulo`, `Gestión` como comodín). «El criterio es la derivación verbal y la denotación de acción/resultado, no una lista cerrada de sufijos; el checker es-CL del modelador realiza este criterio.» | DEBE | **advertir** (inferido): heurística es-CL; no puede ser un bloqueo duro porque el criterio no es mecánico |
| R-NOM-PROC-2 | El nombre de proceso canónico tiene 2 a 4 palabras, salvo término de dominio registrado; fuera de rango la herramienta **DEBE emitir advertencia metodológica**. | DEBE | **advertir** |
| R-NOM-PROC-3 | Palabras léxicas capitalizadas; artículos y preposiciones breves PUEDEN ir en minúscula. | DEBE / PUEDE | advertir |
| R-NOM-EST-1 | El nombre de estado va en minúsculas, en forma pasiva o descriptiva. | DEBE | **advertir** (inferido) |
| R-NOM-ETIQ-1 | La regla de la etiqueta estructural es R-OPL-SE-1. | — | ver R-OPL-SE-1 |

### 3.5 Qué NO puede ser una cosa (§2.5), tabla textual

| No-cosa | Por qué |
|---|---|
| Un estado solo | Estado es situación de un objeto, no entidad autónoma (`V-4`). |
| Un enlace | Los enlaces son relaciones, no cosas (`SSOT-iso §Elementos`). |
| Un atributo "flotante" | Un atributo es siempre objeto que caracteriza otra cosa vía exhibición-caracterización (`glosario 3.4`). |
| Un comentario / sticky note | Es contenido meta del autor; no pertenece a gramática nuclear (`V-204`). |
| Un handle de edición / overlay UI | Afordances UI, no gramática (`V-202`, `V-203`). |

Consecuencia: **impedir** estados sin objeto y atributos flotantes. Si hay notas, son UI/vista y **no emiten OPL**.

### 3.6 Estados (§2.6)

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-EST-1 | Un estado existe solo dentro de su objeto propietario. No hay estados flotantes. | inferido (NO DEBE) | **impedir** / **modelo de datos** |
| R-EST-2 | Cuatro designaciones persistentes más el estado normal (tabla abajo). | inferido (DEBE) | **modelo de datos** + **renderizar** + **generar OPL** (D7–D10, D13) |
| R-EST-3 | Un estado PUEDE ser inicial y final a la vez. Los ciclos cerrados DEBEN usar un único estado con doble designación; duplicar estados es anti-patrón. | PUEDE / DEBE | **modelo de datos**: las designaciones son flags independientes. **Advertir o impedir** estados duplicados (AP-14 «DEBE bloquearse», fuera de tramo; la detección de «sinónimo falso» no es mecánica) |
| R-EST-4 | El estado actual de runtime (glifo `V-54`) y la designación `Current` declarada se distinguen en serialización y DEBEN distinguirse visualmente, aunque compartan la familia de glifo pin. | DEBE | **renderizar**, solo si hay simulación (ver SOBRE-04) |

Tabla textual R-EST-2:

| Designación | Marca canónica | Restricción de cardinalidad |
|---|---|---|
| Inicial | borde grueso | 0..* |
| Final | doble borde | 0..* |
| Por defecto | flecha diagonal abierta apuntando al estado | 0..1 |
| `Current` declarado | glifo externo reservado (pin) | 0..1 |
| Normal (sin designación) | borde estándar | — |

Consecuencia adicional: **impedir** más de un estado «por defecto» y más de un `Current` por objeto (cardinalidad 0..1).

### 3.7 Instancias (§2.7)

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-INS-1 | Toda cosa conceptual implica al menos una instancia operacional posible. | inferido | no aplica |
| R-INS-2 | Distinguir **instancia visual** (misma cosa, otra apariencia en otro OPD) de **instancia lógica** (clasificación-instanciación, RF4). | inferido (DEBE) | **modelo de datos**: apariencia ≠ entidad; la instanciación lógica es un enlace |
| R-INS-3 | Nombre de instancia lógica: `NombreInstancia : NombreClase`. | inferido (DEBE) | **renderizar / generar**: rótulo con `:` (ver CONTRA-05 sobre el léxico) |
| R-INS-4 | Un enlace no implica comportamiento ejecutado hasta que existen instancias. | inferido | no aplica (runtime) |
| R-INS-6 | Una instancia especializada en ejecución exige su instancia general (→ R-HER-6). | — | no aplica (runtime) |

(R-INS-5 no existe; la numeración salta de 4 a 6.)

### 3.8 Modelo conceptual, ejecución y realización (§2.8)

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-EJEC-1 | El modelo conceptual describe patrones; NO DEBE confundirse con una ocurrencia. | DEBE / NO DEBE | no aplica |
| R-EJEC-3 | El estado de runtime NO DEBE persistirse como canon conceptual salvo snapshot declarado. | NO DEBE | **modelo de datos**: si hay simulación, su estado no se guarda en el modelo |
| R-EJEC-6 | Todo runtime sigue lo declarado; NO DEBE introducir semántica externa silenciosa. | DEBE / NO DEBE | solo si hay simulación |
| R-EJEC-7 | En simulación, un `c` sobre consumo, efecto, agente o instrumento se evalúa antes de transiciones o salidas; si falla, el proceso se omite por bypass, NO espera. | DEBE | solo si hay simulación |
| R-EJEC-8 | Múltiples condiciones: ejecutar exige AND; la omisión es OR. La omisión precede a cualquier espera. | inferido (DEBE) | solo si hay simulación |
| R-EJEC-9 | Tras terminar un proceso con invocación `Proceso → Proceso`, el invocado es el siguiente paso. La auto-invocación es un bucle. Un proceso omitido NO DEBE disparar sus invocaciones. | DEBE / NO DEBE | solo si hay simulación |
| R-EJEC-10 | La herramienta PUEDE acotar bucles con un límite de seguridad; es política de runtime, no OPM ni OPL. | PUEDE | solo si hay simulación |

(No existen R-EJEC-2, 4 ni 5.) El tramo no contiene ninguna regla que **obligue** a la herramienta a simular; todo §2.8 es condicional a que exista runtime.

### 3.9 Metamodelo (§2.9)

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-META-1 | Un modelo individual contiene un conjunto de OPDs, una especificación OPL y metadatos persistentes de identidad. | DEBE | **modelo de datos**: `Modelo{id, opds[], ...}`; el OPL puede ser derivado |
| R-META-2 | Conjunto de OPDs → OPDs → constructos → cosas y enlaces. | DEBE | modelo de datos |
| R-META-3 | Especificación OPL → párrafos → oraciones → frases y nombres reservados. | DEBE | **generar OPL** estructurado por párrafos/oraciones |
| R-META-4 | El modelo PUEDE referenciar 0..* sub-modelos (pasa a ser compuesto por referencia). | PUEDE | opcional (ver SOBRE-05) |
| R-META-5 | La dualidad OPD↔OPL se preserva íntegra dentro de cada modelo. | DEBE | **generar + parsear OPL** con roundtrip |
| R-META-6/7/8/12 | La composición entre modelos no colapsa dualidades locales; referencias explícitas; una referencia externa no crea existencia propietaria; las referencias viven en el metamodelo del compuesto. | NO DEBE / DEBE | solo si hay sub-modelos |
| R-META-9 | Toda cosa referenciable desde otro modelo y todo OPD citable externamente DEBEN exponer un identificador persistente recuperable. | DEBE | **modelo de datos**: IDs estables en cosas y OPDs (es barato y además lo exige R-IDP-2, fuera de tramo) |
| R-META-10 | Un constructo básico contiene exactamente 2 cosas y 1 enlace. | DEBE | no aplica (definición) |
| R-META-11 | Un constructo compuesto PUEDE contener abanicos o más de dos refinadores. | PUEDE | modelo de datos |
| R-META-13 | Todo enlace DEBE tener **origen, destino, conector, línea, símbolo, etiqueta opcional y nombre de ruta opcional**. | DEBE | **modelo de datos**: `Enlace{id, tipo, origen, destino, etiqueta?, ruta?}`; conector, línea y símbolo se derivan del tipo |
| R-META-14 | Una cosa es objeto o proceso; no hay tercera clase. | DEBE | = R-COSA-1 |
| R-META-15 | Un objeto con `s` estados genera `s` objetos específicos de estado, cada uno especialización sin estados que refiere a un estado. | DEBE | **no materializar** (inferido; ver SOBRE-07) |
| R-META-16 | El objeto específico de estado se nombra de forma trazable y se enlaza con estructural etiquetado equivalente a `refiere al estado de`. | DEBE | idem |

---

## 4. §3 Reglas visuales del OPD

Este tramo **no contiene** geometría numérica, paths SVG de marcadores ni tokens de color. Solo hay un path en `spec-forja-opd-es` (línea 249, piruleta), que ese dossier debe recoger. §3.5 declara que el color **no es normativo**.

### 4.1 Primitivas (§3.1), tabla textual

| Forma cerrada | Representa |
|---|---|
| Rectángulo | Objeto |
| Elipse | Proceso |
| Rectángulo redondeado (`rountangle`) | Estado (siempre contenido en un objeto) |

### 4.2 Forma × Contorno × Profundidad (§3.2), tabla textual

«Toda cosa OPM se renderiza como una de exactamente **8** combinaciones:»

| # | Forma | Contorno | Profundidad | Cosa |
|---|---|---|---|---|
| 1 | Rect | sólido | sombreado | Objeto físico sistémico |
| 2 | Rect | sólido | plano | Objeto informacional sistémico (default) |
| 3 | Rect | discontinuo | sombreado | Objeto físico ambiental |
| 4 | Rect | discontinuo | plano | Objeto informacional ambiental |
| 5 | Elipse | sólido | sombreado | Proceso físico sistémico |
| 6 | Elipse | sólido | plano | Proceso informacional sistémico (default) |
| 7 | Elipse | discontinuo | sombreado | Proceso físico ambiental |
| 8 | Elipse | discontinuo | plano | Proceso informacional ambiental |

**Defaults**: informacional + sistémico. Consecuencia: **renderizar** exactamente estas 8 combinaciones como función pura de `(kind, esencia, afiliación)`.

### 4.3 Contorno, sombra, color, rótulo (§3.3–§3.6)

Contorno (textual): «continuo (sólido) = afiliación sistémica; discontinuo (punteado) = afiliación ambiental; **grueso** = indicador de refinamiento (cosa refinada en OPD padre Y en OPD hijo)».
Sombra (textual): «sombra canónica desplazada abajo-derecha = esencia física; plano = esencia informacional».

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-CTRN-1 | El tipo de contorno (sólido/discontinuo) persiste a través de niveles. | DEBE | **modelo de datos**: la afiliación vive en la entidad, no en la apariencia |
| R-CTRN-1A | Un objeto ambiental sigue siendo ambiental en todos los OPD hijos. | DEBE | idem |
| R-CTRN-2 | El despliegue intradiagrama NO DEBE producir contorno grueso. | NO DEBE | **renderizar**: el grueso solo aparece si la cosa tiene refinamiento en **otro** OPD |
| R-SOMB-1 | La sombra en canon-diagrama codifica EXCLUSIVAMENTE fisicidad. | inferido (DEBE) | **renderizar** |
| R-SOMB-2 | Toda sombra decorativa de UI uniforme DEBE suprimirse en el export canónico. | DEBE | **renderizar**: lo más simple es no usar nunca sombras decorativas |
| R-SOMB-3 | Sombra presente si y solo si la cosa es física. | DEBE | renderizar |
| R-COLOR-1 | Los colores son informativos, NO normativos. | inferido | — |
| R-COLOR-2 | La semántica se fija por forma, contorno, sombreado y topología interna, no por color. | DEBE | **renderizar**: el diagrama se entiende en escala de grises |
| R-COLOR-3 | PUEDE usarse la paleta de referencia si preserva la topología. | PUEDE | renderizar (la paleta no está en este tramo) |
| R-ROT-1 | El rótulo visible permanece íntegro en canon-diagrama; no hay truncamiento con elipsis ni corte silencioso. | inferido (NO DEBE) | **renderizar**: sin `text-overflow: ellipsis`; AP-23 bloquea el export (fuera de tramo) |
| R-ROT-2 | El rótulo queda inscrito en el bounding box de la cosa; wrap, autosize u overflow solo si el perfil de export los declara y preservan la lectura completa. | inferido (DEBE) | **renderizar**: autoajustar el tamaño del nodo al texto |
| R-ROT-3 | En canon-diagrama los rótulos van en negro por defecto; el cromatismo va en bordes y decoraciones, no en el texto. | inferido (DEBE) | renderizar |
| R-ROT-4 | El alias entre paréntesis es decorativo (`Sistema de Turborreactor (str)`); las llaves `{alias}` se reservan al binding computacional. | inferido | **parsear**: tratar `(…)` como parte del rótulo; no aceptar `{…}` en nombres (ver CONTRA-05) |

### 4.4 Decoraciones de extremo (§3.7), tabla textual

| Decoración | Nombre | Uso |
|---|---|---|
| Punta cerrada (arrowhead) | punta cerrada | Enlaces transformadores |
| Círculo negro relleno | piruleta negra (black lollipop) | Enlace de agente (extremo proceso) |
| Círculo blanco vacío | piruleta blanca (white lollipop) | Enlace de instrumento (extremo proceso) |
| Línea en zigzag + punta | rayo (lightning bolt) | Enlace de invocación |
| Punta abierta | open arrowhead | Estructural etiquetado unidireccional |
| Arpón (media punta) | harpoon | Estructural etiquetado bidireccional/recíproco |

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-DEC-1 | La piruleta cuelga siempre del extremo de una línea visible. | DEBE | renderizar |
| R-DEC-1A | Un círculo aislado NO DEBE interpretarse como piruleta. | NO DEBE | renderizar/import |
| R-DEC-2 | Los handles UI NO DEBEN ser visualmente idénticos a piruletas. | NO DEBE | **renderizar**: handles cuadrados o con color de UI |
| R-DEC-2A | Los handles UI se distinguen por color reservado a UI, posición o tamaño. | DEBE | renderizar |

### 4.5 Triángulos estructurales (§3.8), tabla textual

| Topología interna del triángulo | Relación |
|---|---|
| Interior completamente relleno | Agregación-participación |
| Triángulo interior distinguible | Exhibición-caracterización |
| Vacío (sin interior distinguible) | Generalización-especialización |
| Círculo interior distinguible | Clasificación-instanciación |

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-TRI-1 | El vértice del triángulo apunta al refinable. | DEBE | renderizar |
| R-TRI-1A | La base conecta con los refinadores. | DEBE | renderizar |
| R-TRI-2 | La topología interna es canal normativo. | DEBE | renderizar |
| R-TRI-2A | Eliminar, invertir o colapsar la decoración interior ⇒ no conforme. | inferido (NO DEBE) | renderizar (AP-20 bloquea, fuera de tramo) |
| R-TRI-3 | Los símbolos importados preservan la topología interna; la retipificación cromática es admisible. | DEBE | export/import |

### 4.6 Marcas textuales sobre enlaces (§3.9), tabla textual

| Marca | Significado |
|---|---|
| `e` | Modificador de evento (objeto inicia el proceso) |
| `c` | Modificador de condición (proceso se omite si la precondición falla) |
| `/` | Excepción por sobretiempo |
| `//` | Excepción por subtiempo |
| `Pr=p` | Probabilidad del enlace en abanico probabilístico |
| Texto itálico sobre el eje | Etiqueta de enlace estructural |
| Texto sobre enlace procedimental | Etiqueta de ruta (path label) |

- **R-MARCA-1** (DEBE): las marcas textuales sobre enlaces canónicos se limitan a esta tabla o a extensiones declaradas. Consecuencia: **renderizar/impedir**; no hay otros rótulos libres sobre enlaces.

### 4.7 Indicadores auxiliares (§3.10), tabla textual (normativa)

| Indicador | Representación |
|---|---|
| Colección incompleta | Barra horizontal corta bajo el triángulo |
| Cosa duplicada (apariencia visual repetida en mismo OPD) | Silueta desplazada detrás del símbolo |
| Supresión de estados | Rountangle con `...` en esquina inferior derecha del objeto |
| Multiplicidad | Número/expresión junto al extremo del enlace |
| Supresor de enlaces no materializados | Burbuja adyacente con `...` |

Oblig.: inferido (DEBE, porque la tabla es normativa). Consecuencia: **renderizar**. La supresión de estados corresponde a D6 en OPL.

### 4.8 Anidamiento (§3.11), tabla textual

| Contenedor | Puede contener |
|---|---|
| Objeto (rectángulo) | Estados (rountangles); partes (objetos) si está descompuesto; rasgos (semi-plegado de exhibición) |
| Proceso (elipse inflada) | Subprocesos; objetos internos del contexto de descomposición |
| Estado | NADA. Un estado es atómico (no contiene cosas ni estados) |

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| (tabla) | Contenedores permitidos. | inferido (DEBE) | **impedir**: nada dentro de un estado; ningún estado dentro de un proceso |
| R-ANID-1 | Al descomponer, el rectángulo o la elipse se agrandan para contener a los refinadores. | DEBE | **renderizar/operación** |
| R-ANID-1A | Una elipse agrandada con subprocesos se trata como proceso inflado. | DEBE | renderizar |

### 4.9 Tamaños, layout y grid (§3.12)

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-LAY-1 | `V-50`: legibilidad de 20–25 cosas por contexto. *Extensión de `deep-opm-pro`*: la herramienta DEBE **advertir entre 21 y 25 cosas** y DEBE **bloquear el export canónico con más de 25**, salvo vista tipificada o refinamiento declarado. | DEBE | **advertir** + **impedir export** (ver SOBRE-03) |
| R-LAY-2 | `V-51`: sin oclusión y con mínimos cruces. *Extensión*: si un re-ruteo automático sin cambio semántico elimina cruces, el export canónico DEBE aplicarlo o reportar advertencia. | DEBE | **advertir** es la vía mínima (ver SOBRE-03) |
| R-LAY-3 | La grid es decoración opcional de edición y se suprime en exportaciones canónicas. | inferido (DEBE) | renderizar/export |
| R-LAY-4 | Toda herramienta de layout DEBE preservar la semántica temporal vertical (R-INV-2/2A). | DEBE | **operación**: el auto-layout no reordena verticalmente los subprocesos (ver CONTRA-02) |

---

## 5. §4 Gramática OPL-ES

### 5.1 Contrato textual (§4.0) y tipografía (§4.1)

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-OPL-TEXT-1 | Toda superficie textual canónica obedece a `SSOT-opl`. | DEBE | generar/parsear (en el canon cerrado, `SSOT-opl` se sustituye por `spec-forja-opl-es`; ver GAP-01) |
| R-OPL-TEXT-2 | OPL-ES fija solo superficie léxica, sintáctica y plantillas; NO DEBE redefinir semántica ni gramática visual. | DEBE / NO DEBE | arquitectura: el OPL es una proyección del modelo |
| R-OPL-TEXT-3 | Toda mención textual hereda semántica ISO y geometría visual. | DEBE | no aplica |
| R-OPL-TEXT-4 | OPL-ES DEBE preservar equivalencia bidireccional con OPL-EN. | DEBE | solo si hay OPL-EN (ver SOBRE-01) |
| R-OPL-TYPO-1 | Todo OPL Markdown emitido representa objetos en **negrita**, procesos en *cursiva* y estados en `monoespaciado`. | DEBE | **generar OPL** (y parsear esas marcas) |
| R-OPL-TYPO-2 | Colores, contornos, sombreados y atributos visuales NO forman parte del contrato OPL-ES. | inferido (NO DEBE) | generar |

Tabla textual §4.1:

| Entidad | Convención | Patrón permitido |
|---|---|---|
| Objeto | **negrita** | **Ingrediente** |
| Proceso | *cursiva* | *Cocinar* |
| Estado | `monoespaciado` | `crudo` |

### 5.2 Decisiones de diseño (§4.2)

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-OPL-1 | Género gramatical masculino por defecto, ajustable al género natural del sustantivo. | inferido (DEBE default) | **generar**: artículos `un/una`; lo mínimo es el masculino, y el ajuste por género requiere un campo o heurística |
| R-OPL-2 | **estar** para estados mutables (`**Objeto** está en `estado``); **ser** para propiedades invariantes (`**Objeto** es de tipo X`, `**X** es un **Y**`). | inferido (DEBE) | generar/parsear (ver CONTRA-04) |
| R-OPL-3 | Artículos omitidos salvo donde se requieren: «es un/una» en clasificación-instanciación y especialización individual; «de lo contrario» en condiciones; «al menos» en operadores lógicos. | inferido (DEBE) | generar |
| R-OPL-4 | El estado **sigue** al objeto con la preposición «en»: `**Usuario** en `activo` maneja *Procesar*`. | inferido (DEBE) | generar/parsear |
| R-OPL-5 | Voz pasiva refleja: `se consume`, `se omite` (no `es consumido`, `es omitido`). | inferido (DEBE) | generar |
| R-OPL-6 | Se preserva el orden sujeto-verbo-complemento de cada plantilla OPL-EN. | DEBE | generar |
| R-OPL-7 | NO DEBE reordenarse la oración si ello rompe la correspondencia con OPL-EN o el análisis bidireccional. | NO DEBE | generar |
| R-OPL-8 | La preposición personal `a` DEBE omitirse ante objetos directos OPM. | DEBE | **generar** (`maneja` / `requiere` / `consume` sin «a») |
| R-OPL-9 | Un identificador de proceso PUEDE aparecer como `nombre_singular_de_proceso` o `nombre_singular_de_proceso proceso`. | PUEDE | **parsear**: aceptar el sufijo « proceso» (inferido) |
| R-OPL-10 | Un identificador de objeto PUEDE incluir unidad de medida y cláusula de rango; si se emiten, DEBEN parsearse como parte del identificador. | PUEDE / DEBE | parsear (ver CONTRA-05) |

### 5.3 Vocabulario fijo de verbos (§4.3), tabla textual

| Función | OPL-ES |
|---|---|
| Consumo | consume |
| Resultado | genera |
| Efecto | afecta |
| Cambio de estado | cambia … de … a |
| Agente | maneja |
| Instrumento | requiere |
| Iniciación (evento) | inicia |
| Invocación | invoca |
| Ocurrencia (condicional/excepción) | ocurre |
| Existencia | existe |
| Omisión (pasiva) | se omite |
| Consumo (pasiva) | se consume |
| Agregación | consta de |
| Exhibición | exhibe |
| Especialización plural | son |
| Especialización singular | es un / es una |
| Instanciación | es una instancia de |
| Relación sin etiqueta | se relaciona con |
| Variación de rango | varía de … a |
| Tipo | es de tipo |
| Enumeración de estados | puede estar |
| Descomposición | se descompone en … en esa secuencia |
| Despliegue | se despliega en |
| Refinamiento entre OPDs | se refina por descomposición de … en |
| Plegado | se pliega en |
| Recomposición | se recompone desde |

- **R-OPL-VERB-1** (DEBE): verbos en 3.ª persona singular del presente indicativo salvo que la plantilla indique otra forma. Consecuencia: **generar**.
- **R-OPL-VERB-2**: la detección EN/ES por verbo es R-OPL-LANG-1.

### 5.4 Palabras clave fijas (§4.3), tabla textual

| Función | OPL-ES |
|---|---|
| Condicional | si |
| Consecuencia | en cuyo caso |
| Alternativa | de lo contrario |
| Origen | de |
| Destino | a |
| Conjunción copulativa | y / e ante `i-` o `hi-` |
| Conjunción disyuntiva | o / u ante `o-` o `ho-` |
| Adición heterogénea | así como |
| XOR | exactamente uno de |
| OR | al menos uno de |
| Colección incompleta | al menos otro/a |
| Opcionalidad | un/una opcional |
| Cardinalidad inferior | al menos un/una |
| Ruta | por ruta |
| Duración | duración de |
| Sobretiempo | excede |
| Subtiempo | es menor que |
| Secuencia | en esa secuencia |

- **R-OPL-KW-1** (DEBE): las palabras clave se emiten exactamente como tokens, salvo la alternancia `y/e`, `o/u`. Consecuencia: **generar/parsear**.
- **R-OPL-KW-2** (DEBE): la alternancia se aplica solo por la condición fonética del término siguiente. Consecuencia: **generar**; el parser acepta ambas formas (inferido). Ver GAP-07.

### 5.5 Plantillas: cosas (§4.4, D1–D13), tabla textual

| ID | Plantilla OPL-ES |
|---|---|
| D1 | **Cosa** es física. |
| D2 | **Cosa** es informacional. |
| D3 | **Cosa** es ambiental. |
| D4 | **Cosa** es sistémica. |
| D5 | **Objeto** puede estar `estado1`, `estado2` o `estado3`. |
| D6 | **Objeto** puede estar `estado1`, …, y otros estados. |
| D7 | Estado `s` de **Objeto** es inicial. |
| D8 | Estado `s` de **Objeto** es final. |
| D9 | Estado `s` de **Objeto** es por defecto. |
| D10 | Estado `s` de **Objeto** es inicial y final. |
| D11 | **Cosa** es persistente. |
| D12 | **Cosa** es transitoria. |
| D13 | Estado `s` de **Objeto** es declarado `Current`. |

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-OPL-PERSIST-1 | OPL-ES NO define una familia verbal adicional para procesos persistentes. | inferido (NO DEBE) | generar |
| R-OPL-PERSIST-2 | Un proceso persistente explícito se realiza con TS3 con estado de entrada = estado de salida. | DEBE | generar |
| R-OPL-PERSIST-3 | Si la temporalidad sostenida no es central, PUEDE simplificarse a estructural etiquetado. | PUEDE | solo método |

Este tramo no dice si D2 y D4 (los defaults) se emiten siempre o solo cuando difieren del default. Ver GAP-04.

### 5.6 Plantillas: transformadores (§4.5), tabla textual

| ID | Tipo | OPL-ES |
|---|---|---|
| T1 | Consumo | *Procesar* consume **Consumido**. |
| T2 | Resultado | *Procesar* genera **Resultado**. |
| T3 | Efecto | *Procesar* afecta **Afectado**. |
| TS1 | Consumo con estado | *Proceso* consume **Objeto** en `estado`. |
| TS2 | Resultado con estado | *Proceso* genera **Objeto** en `estado`. |
| TS3 | Efecto entrada-salida | *Proceso* cambia **Objeto** de `estado-entrada` a `estado-salida`. |
| TS4 | Efecto solo entrada (enlace de entrada) | *Proceso* cambia **Objeto** de `estado-entrada`. |
| TS5 | Efecto solo salida (enlace de salida) | *Proceso* cambia **Objeto** a `estado-salida`. |

**Nota crítica (textual)**: «TS4/TS5 tienen dos realizaciones distinguibles que comparten superficie textual; el régimen se determina por procedencia (ver R-ESCIND-0):
- **(a) enlace escindido** — par acoplado producido al descomponer un efecto entrada-salida (TS3) en subprocesos: TS4 temprano saca del estado de entrada, TS5 tardío pone en el de salida (`V-40`, `V-110`). Las dos mitades solo tienen sentido juntas y NO admiten modificadores de control.
- **(b) efecto parcial standalone** — enlace de efecto completo en sí mismo: TS4 solo-entrada cuya salida, si no se especifica, se resuelve al estado por defecto o a la distribución de probabilidad de estados (`V-9`); TS5 solo-salida. Admite evento/condición (ETS3, ETS4).»

Consecuencia: **modelo de datos**. El enlace de efecto necesita `estadoEntrada?` y `estadoSalida?`, y además una marca de procedencia «escindido (par acoplado)» frente a «standalone», porque la superficie OPL no distingue los dos casos. El parser OPL no puede recuperar esa marca solo desde el texto (ver GAP-05). **Impedir** `e`/`c` sobre el par escindido (AP-08, fuera de tramo).

### 5.7 Plantillas: habilitadores (§4.6), tabla textual

| ID | Tipo | OPL-ES |
|---|---|---|
| H1 | Agente | **Agente** maneja *Proceso*. |
| H2 | Instrumento | *Proceso* requiere **Instrumento**. |
| HS1 | Agente con estado | **Agente** en `estado` maneja *Proceso*. |
| HS2 | Instrumento con estado | *Proceso* requiere **Instrumento** en `estado`. |

### 5.8 Plantillas: evento (§4.7), tabla textual

| ID | OPL-ES |
|---|---|
| ET1 | **Objeto** inicia *Proceso*, que consume **Objeto**. |
| ET2 | **Objeto** inicia *Proceso*, que afecta **Objeto**. |
| EH1 | **Agente** inicia y maneja *Proceso*. |
| EH2 | **Instrumento** inicia *Proceso*, que requiere **Instrumento**. |
| ETS1 | **Objeto** en `estado` inicia *Proceso*, que consume **Objeto**. |
| ETS2 | **Objeto** en `estado-entrada` inicia *Proceso*, que cambia **Objeto** de `estado-entrada` a `estado-salida`. |
| ETS3 | **Objeto** en `estado-entrada` inicia *Proceso*, que cambia **Objeto** de `estado-entrada`. |
| ETS4 | **Objeto** en cualquier estado inicia *Proceso*, que cambia **Objeto** a `estado-destino`. |
| EHS1 | **Agente** en `estado` inicia y maneja *Proceso*. |
| EHS2 | **Instrumento** en `estado` inicia *Proceso*, que requiere **Instrumento** en `estado`. |

Consecuencia: el modificador `e` es un flag del enlace (consumo, efecto, agente o instrumento) y cambia la plantilla emitida. No hay plantilla de evento sobre resultado; AP-02 lo bloquea (fuera de tramo).

### 5.9 Plantillas: condición (§4.8), tabla textual

| ID | OPL-ES |
|---|---|
| CT1 | *Proceso* ocurre si **Objeto** existe, en cuyo caso **Objeto** se consume, de lo contrario *Proceso* se omite. |
| CT2 | *Proceso* ocurre si **Objeto** existe, en cuyo caso *Proceso* afecta **Objeto**, de lo contrario *Proceso* se omite. |
| CH1 | **Agente** maneja *Proceso* si **Agente** existe, de lo contrario *Proceso* se omite. |
| CH2 | *Proceso* ocurre si **Instrumento** existe, de lo contrario *Proceso* se omite. |
| CS1 | *Proceso* ocurre si **Objeto** está en `estado`, en cuyo caso **Objeto** se consume, de lo contrario *Proceso* se omite. |
| CS2 | *Proceso* ocurre si **Objeto** está en `estado-entrada`, en cuyo caso *Proceso* cambia **Objeto** de `estado-entrada` a `estado-salida`, de lo contrario *Proceso* se omite. |
| CS3 | *Proceso* ocurre si **Objeto** está en `estado-entrada`, en cuyo caso *Proceso* cambia **Objeto** de `estado-entrada`, de lo contrario *Proceso* se omite. |
| CS4 | *Proceso* ocurre si **Objeto** existe, en cuyo caso *Proceso* cambia **Objeto** a `estado-salida`, de lo contrario *Proceso* se omite. |
| CS5 | **Agente** maneja *Proceso* si **Agente** está en `estado`, de lo contrario *Proceso* se omite. |
| CS6 | *Proceso* ocurre si **Instrumento** está en `estado`, de lo contrario *Proceso* se omite. |

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-OPL-COND-ALT-1 | El parser DEBE aceptar la variante: `Si **Objeto** existe entonces *Proceso* ocurre y consume **Objeto**, de lo contrario se omite *Proceso*.` | DEBE | **parsear OPL** (única variante alternativa exigida en este tramo) |
| R-OPL-COND-ALT-2 | El generador canónico DEBE preferir CT1. | DEBE | **generar** |
| R-OPL-SUP-1 | El modo de preservación de superficie solo PUEDE activarse en importación, migración o roundtrip auditado; DEBE persistirse como metadato de superficie; NO DEBE ser el default del export. | PUEDE / DEBE / NO DEBE | opcional: lo más simple es no implementarlo (ver SOBRE-08) |

### 5.10 Plantillas: excepción e invocación (§4.9), tabla textual

| ID | OPL-ES |
|---|---|
| EX1 | *Manejo* ocurre si duración de *Fuente* excede máx-duración unidades-tiempo. |
| EX2 | *Manejo* ocurre si duración de *Fuente* es menor que mín-duración unidades-tiempo. |
| IV1 | *Invocador* invoca *Invocado*. |
| IV2 | *Invocador* se invoca a sí mismo. |

Consecuencia: **modelo de datos**. El proceso necesita `duración{mín?, máx?, unidad?}` para poder emitir EX1 y EX2 (R-EXC-2/3/5).

### 5.11 Plantillas: estructurales (§4.10), tabla textual

| ID | OPL-ES |
|---|---|
| SE1 | **Origen** etiqueta **Destino**. |
| SE2 | **Origen** se relaciona con **Destino**. |
| SE3 | **Origen** etiqueta-f **Destino**. / **Destino** etiqueta-b **Origen**. (bidireccional, dos oraciones) |
| SE4 | **Origen** y **Destino** son etiqueta. (recíproco con etiqueta) |
| SE5 | **Origen** y **Destino** se relacionan. (recíproco sin etiqueta) |
| RF1 | **Todo** consta de **Parte1**, **Parte2** y **Parte3**. |
| RF2 | **Exhibidor** exhibe **Atributo1** y **Atributo2**. |
| RF2b | **Exhibidor** exhibe **Atributo1** así como *Operación1*. |
| RF3 | **Especialización1** y **Especialización2** son **General**. |
| RF3b | **Especialización** es un **General**. |
| RF4 | **Instancia** es una instancia de **Clase**. |
| RF4b | **Instancia1** y **Instancia2** son instancias de **Clase**. |
| RX1 | **Especial** puede ser **General1** o **General2**. |
| RX2 | **Especial** puede ser uno de **General1**, **General2** o **General3**. |
| RH1 | **Especial** es un **General1** y un **General2**. |

**Colecciones incompletas** (textual): «`… y al menos otra parte / otro rasgo / otra especialización.`»

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-OPL-SE-1 | La etiqueta estructural del modelador es una frase breve en minúscula que funciona como verbo o predicado nominal. | DEBE | **advertir** (inferido) |
| R-OPL-SE-2 | Los estructurales etiquetados se emiten como objeto↔objeto o proceso↔proceso; las mezclas objeto↔proceso son exhibición cuando son canónicas. | DEBE | **impedir** estructural etiquetado entre objeto y proceso |
| R-OPL-SE-3 | Los etiquetados PUEDEN incluir restricciones de participación en origen y destino. | PUEDE | opcional |
| R-OPL-SE-4 | La oración etiquetada PUEDE bifurcarse hacia listas, con `ordenados por` o `en esa secuencia` cuando el orden es parte de la superficie. | PUEDE | opcional |
| R-OPL-SE-5 | `se relaciona con` y `se relacionan` son etiquetas nulas canónicas; una etiqueta nula definida por el usuario solo vale si conserva trazabilidad como etiqueta de usuario. | inferido (DEBE) | **modelo de datos**: `etiqueta` vacía ⇒ SE2/SE5 |
| R-OPL-RF-1 | Agregación, caracterización, especialización e instanciación soportan variantes de objeto y de proceso cuando la semántica lo permite. | DEBE | generar/parsear con cursiva o negrita según el tipo |
| R-OPL-RF-2 | La caracterización usa `exhibe`; el alias `exhibición` NO DEBE introducir una producción ambigua. | DEBE / NO DEBE | generar/parsear |
| R-OPL-RF-3 | La especialización de estado se expresa como lista de objetos con estado que son un objeto con estado general. | DEBE | generar (sin plantilla con ID en este tramo; ver GAP-06) |
| R-OPL-RF-4 | La instanciación plural se emite como `son instancias de`. | DEBE | generar (RF4b) |
| R-OPL-RF-5 | La especialización XOR se emite con `puede ser` o `puede ser uno de`. | DEBE | generar (RX1/RX2) |
| R-OPL-RF-6 | La herencia múltiple se emite como lista de generales con artículos `un/una`. | DEBE | generar (RH1) |

**Estructurales con estado (§4.10, SSE1–SSE7)**, tabla textual:

| ID | Grupo | OPL-ES |
|---|---|---|
| SSE1 | Estado en origen, unidireccional | **Origen** en `estado` etiqueta **Destino**. |
| SSE2 | Estado en destino, unidireccional | **Origen** etiqueta **Destino** en `estado`. |
| SSE3 | Estado en ambos, unidireccional | **Origen** en `sa` etiqueta **Destino** en `sb`. |
| SSE4 | Estado en origen, bidireccional f-tag | **Origen** en `sa` etiqueta-f **Destino**. |
| SSE5 | Estado en origen, bidireccional b-tag | **Destino** etiqueta-b **Origen** en `sa`. |
| SSE6 | Estado en ambos, recíproco | **Origen** en `sa` y **Destino** en `sb` son etiqueta. |
| SSE7 | Estado en origen, recíproco | **Destino** y **Origen** en `sa` son etiqueta. |

**Restricción `V-30`** (textual): «las variantes **bidireccional** y **recíproco** NO existen para el caso de estado solo en destino.» Consecuencia: **impedir** (AP-11 «DEBE bloquearse», fuera de tramo).

### 5.12 Plantillas: gestión de contexto (§4.11), tabla textual

| ID | OPL-ES |
|---|---|
| CX1 | *Proceso* se descompone en *P1*, *P2* y *P3*, en esa secuencia. |
| CX2 | *Proceso* se descompone en paralelo *P1* y *P2*. |
| CX3 | **Cosa** se despliega en SD1 en **T1**, **T2** y **T3**. |
| CX4 | SD se refina por descomposición de *Proceso* en SD1. |
| CX5 | *Proceso* se pliega en el OPD padre. |
| CX6 | **Objeto** se pliega en el OPD padre. |
| CX7 | *Proceso* se recompone desde `diagrama`. |
| CX8 | **Objeto** se recompone desde `diagrama`. |
| CM1 | SD1.1 es una vista de sub-modelo de Modelo Subsistema. |
| CM2 | SD1.1 referencia el sub-modelo Modelo Subsistema desde SD1. |
| CM3 | **Cosa** en SD1.1 es referencia externa a **Cosa** del modelo propietario Modelo Principal. |

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-OPL-CX-ID-1 | Toda oración de refinamiento entre OPDs con etiqueta visible `SDx.y` se mapea al identificador persistente (R-IDP-2). | DEBE | **modelo de datos**: `OPD{id persistente, etiqueta derivada SDx.y}`; el parser resuelve la etiqueta al id |
| R-OPL-CM-1 | CM1–CM3 no reemplazan la gramática interna; solo describen la composición entre modelos. | inferido | solo si hay sub-modelos |
| R-OPL-CX-1 | OPL-ES DEBE soportar el despliegue de objeto y de proceso por partes, especialización, instanciación o rasgos. | DEBE | generar/parsear (ver GAP-06: CX3 no distingue la clase) |
| R-OPL-CX-2 | Un despliegue en OPD nuevo declara OPD padre, OPD hijo y lista de refinadores. | DEBE | modelo de datos + generar |
| R-OPL-CX-3 | Una descomposición PUEDE ocurrir en el mismo diagrama o en uno nuevo; en uno nuevo DEBE declarar padre e hijo. | PUEDE / DEBE | operación: descomposición in-situ o en OPD nuevo |
| R-OPL-CX-4 | OPL-ES soporta descomposición de procesos y de objetos. | DEBE | generar/parsear |
| R-OPL-CX-5 | Descomposición secuencial, paralela o mixta; la mixta preserva qué subprocesos van en paralelo dentro de la secuencia. | PUEDE / DEBE | **modelo de datos**: orden como lista de bandas `[[P1],[P2,P3],[P4]]` (ver GAP-06: sin plantilla mixta) |
| R-OPL-CX-6 | Una descomposición PUEDE incluir objetos o procesos internos mediante `así como`. | PUEDE | generar/parsear |
| R-OPL-CX-7 | El plegado refiere al OPD padre; la recomposición al OPD hijo de origen. | DEBE | generar |

### 5.13 Etiquetas de ruta (§4.12), plantillas textuales

`Por ruta etiqueta, *Proceso* consume **Objeto**.`
`Por ruta etiqueta, *Proceso* genera **Objeto**.`

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-OPL-RUTA-1 | `Por ruta` es expresión fija. | inferido (DEBE) | generar/parsear |
| R-OPL-RUTA-2 | La etiqueta de ruta es un nombre definido por el modelador. | DEBE | modelo de datos (`enlace.ruta`) |
| R-OPL-RUTA-3 | `A.5` admite `Por ruta` en cualquier oración procedimental; *restricción de producto*: solo se emite en consumo o resultado salvo extensión documentada. Sobre habilitadores es «canónica-condicionada», NO «zona no canonizada». | inferido (DEBE, restricción) | **generar** solo en consumo/resultado; el parse sobre otros tipos queda ambiguo (ver GAP-08) |

### 5.14 Atributos y valores (§4.13), tabla textual

| OPL-ES |
|---|
| **Atributo** de **Objeto** es valor. |
| **Atributo** de **Objeto** varía de X a Y. |
| **Atributo** de **Objeto** puede estar `valor1`, `valor2` o `valor3`. |

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-ATR-1 | Un atributo es un objeto que caracteriza una cosa vía exhibición. | DEBE | modelo de datos (sin campo «atributos» propio) |
| R-ATR-2 | Los valores de atributo son estados del atributo. | DEBE | modelo de datos |
| R-ATR-3..6 | «**extensiones de implementación de `deep-opm-pro`** (modelado computacional/simulación)»: unidad (PUEDE; si se declara, DEBE persistirse), dominio por intervalos (PUEDE), límites explícitos (DEBE), «propiedad ≠ atributo» (DEBE). | PUEDE / DEBE | fuera del núcleo (ver SOBRE-04) |

### 5.15 EBNF normativa (§4.14)

**El tramo NO contiene la EBNF.** Solo trae reglas sobre ella; la EBNF «formal completa» vive en `SSOT-opl Apéndice A` (`opm-opl-es`, **fuera del canon entregado**). En el canon cerrado de 4 documentos, la EBNF consolidada está en `spec-forja-opl-es` §18 (línea 2197 en adelante de ese documento). Ver GAP-01.

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-OPL-EBNF-1 | La EBNF formal completa de OPL-ES es normativa para parseo y generación. | inferido (DEBE) | **parsear + generar** contra la gramática |
| R-OPL-EBNF-2 | Una divergencia entre §17 y el Apéndice A se resuelve a favor del Apéndice A. | DEBE | no aplica en el canon cerrado |
| R-OPL-EBNF-3 | Los no terminales normativos van en `snake_case`. | DEBE | implementación del parser |
| R-OPL-EBNF-4 | Un párrafo OPL-ES es una secuencia de oraciones separadas por saltos de línea. | DEBE | **generar/parsear**: una oración por línea |
| R-OPL-EBNF-5 | Toda oración formal termina en punto. | DEBE | generar/parsear |
| R-OPL-EBNF-6 | Toda oración pertenece a una de 4 clases: descripción de cosa, procedimental, estructural o gestión de contexto. | DEBE | parsear (clasificador de 4 ramas) |
| R-OPL-LEX-1 | Alfabeto: letras ASCII, vocales acentuadas, `ñ` y `ü`, en mayúscula y minúscula. | DEBE | parsear |
| R-OPL-LEX-2 | `caracter_de_cadena` = letra, dígito decimal, guion o guion bajo. | DEBE | parsear (ver CONTRA-05) |
| R-OPL-LEX-3 | `nombre_simple` comienza con letra. | DEBE | parsear; **impedir/advertir** nombres que empiezan con dígito |
| R-OPL-TIPO-1 | `tipo-id` ∈ `boolean`, `string`, tipo numérico, `enumerated`. | DEBE | solo si hay tipos (SOBRE-06) |
| R-OPL-TIPO-2 | Un tipo numérico PUEDE llevar `unsigned` o `signed`. | PUEDE | idem |
| R-OPL-PART-1 | Participación: `un/una`, `un/una opcional`, `al menos un/una`, `exactamente un/una`, `al menos dos`, `dos o más`, o límites numéricos/paramétricos. | DEBE | generar/parsear multiplicidad |
| R-OPL-RANGO-1 | Rango: `valor` exacto, `varía de X a Y` narrativo, intervalos `[..]`/`(..)` parseables y `*` solo para límite abierto. | DEBE | parsear si se soportan rangos |
| R-OPL-RANGO-2 | Una restricción de expresión inicia con `donde`. | DEBE | idem (spec-forja-opl registra GAP-DONDE-EXPRESION) |
| R-OPL-RANGO-3 | La superficie normativa usa ASCII `=`, `<`, `>`, `<=`, `>=`; los símbolos Unicode se normalizan o se declaran como visualización. | DEBE | parsear/normalizar |
| R-OPL-CONJ-1 | La pertenencia a conjunto se emite con `en { ... }`. | DEBE | idem |
| R-OPL-LISTA-1 | En las listas, comas entre los elementos intermedios y `y`/`o` antes del último, según la producción. | DEBE | **generar/parsear** (ver GAP-07 sobre D6) |
| R-OPL-LISTA-2 | Las listas bifurcadas PUEDEN terminar en `más`, `ordenados por criterio` o `en esa secuencia` solo si la producción lo permite. | PUEDE | parsear |

### 5.16 Equivalencia EN↔ES, transformación y política de idioma (§4.15–§4.17)

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-OPL-EQ-1 | Una sentencia OPL-ES PUEDE usar infinitivo o nominalización `-ción`. | PUEDE | parsear ambas (consistente con R-NOM-PROC-1) |
| R-OPL-EQ-2 | Superficies equivalentes mapean al mismo nombre canónico interno cuando el modelo lo declara. | DEBE | opcional (tabla de alias) |
| R-OPL-EQ-3 | EN→ES→EN preserva el hecho, no la superficie. | DEBE | solo si hay EN |
| R-OPL-EQ-4 | La herramienta NO DEBE forzar exclusivamente el infinitivo; la normalización es política editorial configurable. | NO DEBE / DEBE | **impedir** que el checker bloquee nominalizaciones; «configurable» es sobreingeniería mínima (SOBRE-01) |
| R-OPL-EQ-5 | El modelo interno OPD es invariante al cambio de idioma OPL. | DEBE | arquitectura (el OPL es derivado) |
| R-OPL-TRANS-1..11 | Transformación sistemática EN→ES. Textual: verbo principal primero; el estado prefijado en EN pasa detrás del objeto con `en`; `Object is state`→`**Objeto** está en `estado``; `can be`→`puede estar`; `from/to/of`→`de/a/de`; `exactly one of/at least one of`→`exactamente uno de/al menos uno de`; `if/in which case/otherwise`→`si/en cuyo caso/de lo contrario`; `is consumed/is skipped`→`se consume/se omite`; `Following path`→`Por ruta`; `initial/final/default/declared current`→`inicial/final/por defecto/declarado `Current``; los nombres de entidad NO DEBEN traducirse automáticamente. | DEBE / NO DEBE | solo si hay OPL-EN (SOBRE-01) |
| R-OPL-LANG-1 | Una herramienta **bilingüe** detecta el idioma por verbo principal. | DEBE (condicional) | solo si es bilingüe |
| R-OPL-LANG-2 | El idioma OPL se elige a nivel de usuario o modelo sin alterar el OPD. | DEBE | trivial con ES único |
| R-OPL-LANG-3 | Cambiar de idioma regenera el párrafo completo. | DEBE | idem |
| R-OPL-LANG-4 | NO DEBE mezclarse EN y ES en un mismo párrafo generado salvo habilitación explícita. | NO DEBE | **generar**: solo ES |
| R-OPL-LANG-5 | Los modelos mixtos EN/ES solo existen como revisión o migración. | NO DEBE (estado estable) | idem |
| R-OPL-LANG-6/7 | OPL autocontenido por modelo individual con sub-modelos; el OPL de un compuesto no se infiere solo del árbol OPD. | DEBE / NO DEBE | solo si hay sub-modelos |

---

## 6. §5 Enlaces: taxonomía estricta

### 6.1 Seis familias (§5.1), tabla textual

| # | Familia | Firma | Realización canónica |
|---|---|---|---|
| 1 | Transformadora procedimental | Objeto ↔ Proceso | T1–T3, TS1–TS5 |
| 2 | Habilitadora procedimental | Objeto → Proceso | H1, H2, HS1, HS2 |
| 3 | Invocación procedimental | Proceso → Proceso | IV1, IV2 |
| 4 | Excepción procedimental | Proceso → Proceso | EX1, EX2 |
| 5 | Estructural fundamental | Cosa ↔ Cosa (con restricciones) | RF1–RF4 |
| 6 | Estructural etiquetada | Objeto ↔ Objeto o Proceso ↔ Proceso | SE1–SE5, SSE1–SSE7 |

«Toda relación expresable por enlace en un OPD conforme pertenece a **exactamente una** de seis familias». La excepción es una **extensión declarada** de OPFORJA; `V-239` base tiene 5 familias.
Consecuencia: **modelo de datos**. `tipo de enlace` es un enum cerrado que pertenece a una sola familia, y la firma de la familia se **impide** en la creación. Tipos mínimos derivados: `consumo`, `resultado`, `efecto`, `agente`, `instrumento`, `invocación`, `sobretiempo`, `subtiempo`, `agregación`, `exhibición`, `generalización`, `clasificación`, `etiquetado-uni`, `etiquetado-bi`, `recíproco`.

### 6.2 Transformadores (§5.2), tabla textual

| Enlace | Firma | Decoración fuente | Decoración destino | OPL canónico |
|---|---|---|---|---|
| Consumo | Objeto → Proceso | (ninguna) | punta cerrada en proceso | T1 / TS1 |
| Resultado | Proceso → Objeto | (ninguna) | punta cerrada en objeto | T2 / TS2 |
| Efecto | Objeto ↔ Proceso | punta cerrada | punta cerrada | T3 / TS3 / TS4 / TS5 |

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-CONS-1 | El consumido es un objeto con o sin estados. | inferido (PUEDE) | permitir |
| R-CONS-2 | El consumo es inmediato salvo tasa declarada en el enlace y cantidad como atributo. | inferido | runtime (SOBRE-04) |
| R-CONS-3 | Consumo a lo largo del tiempo ⇒ tasa en el enlace + cantidad consumible como atributo. | DEBE | runtime (SOBRE-04) |
| R-RES-1 | Un resultado hacia un objeto con estado inicial se conecta al rectángulo o a un estado no inicial; **NUNCA directamente al estado inicial**. | DEBE / NUNCA | **impedir** (AP-04 «DEBE bloquearse», fuera de tramo); el parser rechaza TS2 con estado inicial |
| R-EFE-1 | El efecto REQUIERE un objeto con al menos un estado. | inferido (DEBE) | **impedir** (ver GAP-09 sobre T3 al parsear) |
| R-EFE-2/2A/2B | Semántica temporal del afectado: sale de la entrada al iniciar, llega a la salida al completar; si se aborta, queda indeterminado. | DEBE | runtime |
| R-EFE-3 | TS4 sin salida ⇒ destino = estado por defecto, o distribución de probabilidad si no hay defecto; régimen standalone, distinto del escindido. | inferido | runtime + modelo de datos (flag escindido/standalone) |

### 6.3 Habilitadores (§5.3), tabla textual

| Enlace | Firma | Decoración | Restricción de origen | OPL |
|---|---|---|---|---|
| Agente | Agente humano → Proceso | piruleta NEGRA en extremo proceso | **EXCLUSIVAMENTE humanos o grupos humanos** | H1 / HS1 |
| Instrumento | Objeto no humano → Proceso | piruleta BLANCA en extremo proceso | NO humanos (robots, IA, software, máquinas) | H2 / HS2 |

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-AG-1 | Agente = EXCLUSIVAMENTE humanos o grupos de humanos. | inferido (DEBE) | **impedir/advertir** (AP-05 «DEBE bloquearse», fuera de tramo); ver GAP-02 (no hay dato «humano») |
| R-AG-1A | Robots, software e IA DEBEN usar instrumento. | DEBE | idem |
| R-AG-1B | Una descripción externa PUEDE decir «agente», pero el OPD/OPL canónico DEBE clasificarlo como instrumento. | PUEDE / DEBE | idem |
| R-AG-2 | Si el habilitador deja de existir durante la ejecución, el proceso se detiene y el afectado queda indeterminado. | DEBE | runtime |
| R-AG-3 | Si el desgaste del instrumento es relevante, DEBE reclasificarse como afectado. | DEBE | solo método |
| R-AG-4 | Reclasificado por desgaste con mantenimiento en alcance ⇒ atributo de degradación + proceso de mantenimiento separado; fuera de alcance ⇒ declarar la exclusión. | DEBE | solo método |

### 6.4 Invocación (§5.4), tabla textual

| Enlace | Firma | Decoración | OPL |
|---|---|---|---|
| Invocación | Proceso → Proceso | rayo (zigzag con punta) | IV1 |
| Auto-invocación | Proceso → mismo proceso | zigzag de bucle | IV2 |

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-INV-1 | La invocación tiene firma `Proceso → Proceso`. | DEBE | **impedir** |
| R-INV-1A | La invocación es una familia autónoma. | DEBE | modelo de datos |
| R-INV-2 | En una descomposición, la terminación de un subproceso DEBE invocar al inmediatamente inferior por posición vertical. | DEBE | semántica; **renderizar** el orden de arriba abajo (ver CONTRA-02) |
| R-INV-2A | Subprocesos con el borde superior a la misma altura DEBEN iniciar en paralelo. | DEBE | idem |
| R-INV-2B | En la invocación implícita NO DEBE dibujarse enlace explícito. | NO DEBE | **impedir/advertir**: un rayo entre hermanos de bandas adyacentes es «doble vara» |
| R-INV-2C | En un grupo paralelo, solo la terminación del **último** miembro invoca al siguiente. | DEBE | runtime/semántica (AND-join) |
| R-INV-2D | La fuente de verdad del orden es el **orden declarado** de la descomposición (bandas con cardinalidad), NO los enlaces entre hermanos. Un rayo que repite una transición de banda adyacente es doble vara y viola R-INV-2B. | DEBE / NO DEBE | **modelo de datos**: `descomposición.orden = [[...], [...]]`; el layout vertical se deriva de ahí |

Tabla textual R-INV-2D:

| Caso | Clase | Realización |
|---|---|---|
| secuencial 1→1; paralelo a la misma altura (R-INV-2A); AND-join síncrono **total** | **implícito** | orden declarado (bandas con cardinalidad); OPL `en esa secuencia` / `paralelo`; sin rayo (R-INV-2/2A/2B/2C) |
| reactivo por evento (sistemas reactivos, `SSOT-metod LF-06`) | **explícito por enlace de evento, no rayo** | un enlace de evento por subproceso; sin verticalidad temporal forzada; tratarlo como invocación es error de categoría |
| autoinvocación/bucle; salto fuera de orden; invocación cross-OPD | **explícito por rayo (IV1/IV2)** | única realización honesta; el rayo sobrevive (R-INV-1) |
| demora intra-secuencia | **disuelto** | no existe «demora sobre invocación implícita»: la duración es propiedad del proceso (`SSOT-metod`), y la espera entre bandas se reifica como subproceso *Esperar* implícito; `después de <demora>` solo cuelga de un rayo ya-explícito |
| join parcial o disyuntivo (OR) | **fuera del orden simple** | es abanico/decisión con realización explícita propia; el campo de bandas no lo cubre y NO DEBE forzarse |

«Las ocho clases numeradas (secuencial, paralelo, AND-join total, reactivo-evento, bucle, demora, salto fuera de orden, cross-OPD) cierran la frontera; el join parcial/OR queda deliberadamente fuera de alcance. El orden es atributo de la descomposición, no relación entre pares ni coordenada (mejora R-IDP-0A).»

### 6.5 Estructurales fundamentales (§5.5), tabla textual

| Relación | Triángulo (interior) | Vértice → base | Restricción de perseverancia |
|---|---|---|---|
| Agregación-participación | totalmente relleno | Todo → Partes | misma perseverancia obligatoria |
| Exhibición-caracterización | triángulo interior | Exhibidor → Rasgos | **excepción**: única que admite mezcla (objeto exhibe operación, proceso exhibe atributo) |
| Generalización-especialización | vacío | General → Especializaciones | misma perseverancia obligatoria |
| Clasificación-instanciación | círculo interior | Clase → Instancias | misma perseverancia obligatoria |

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-STRF-1 | Salvo exhibición, refinable y refinadores tienen la misma perseverancia. | DEBE | **impedir** agregación, generalización o clasificación entre objeto y proceso (con R-COSA-2, «misma perseverancia» = mismo `kind`) |
| R-STRF-2 | La exhibición es la ÚNICA estructural que PUEDE conectar objetos con procesos. | PUEDE (solo ella) | impedir en las demás |
| R-STRF-2A | Mixtas válidas: objeto exhibe atributo, objeto exhibe operación, proceso exhibe atributo, proceso exhibe operación. | inferido | permitir las 4 |
| R-STRF-3 | La clasificación NO DEBE distinguir colección completa/incompleta. | NO DEBE | **impedir** la barra o «al menos otra» en instanciación |
| R-STRF-4 | Las partes PUEDEN transformarse independientemente del todo. | PUEDE | permitir |
| R-HER-1 | La especialización hereda del general partes, rasgos, etiquetados y procedimentales. | DEBE | validación derivada (inferido); no duplicar |
| R-HER-2 | Herencia múltiple permitida, con trazabilidad de cada general. | DEBE | modelo de datos (varios enlaces de generalización) |
| R-HER-3/4 | El atributo discriminante restringe valores; el máximo de especializaciones es el producto cartesiano. | DEBE | ver SOBRE-09 |
| R-HER-5 | Reemplazar un participante heredado solo especificando una especialización con nombre y estados propios. | PUEDE (condicionado) | solo método |
| R-HER-6 | Una instancia especializada NO DEBE existir en ejecución sin la general. | NO DEBE | runtime |
| R-HER-7 | Crear un general desde especializaciones: identificar lo común, crear el general, conectar, eliminar duplicados y migrar enlaces. «la herramienta o el modelador DEBE». | DEBE (alternativo) | **solo método** es suficiente (SOBRE-09) |
| R-HER-8 | Los heredados NO DEBEN dibujarse como explícitos duplicados salvo vista derivada no nuclear. | NO DEBE | **advertir/impedir** (AP-29 «DEBE bloquearse», fuera de tramo); no detectable mecánicamente sin R-HER-1 derivado |

### 6.6 Estructurales etiquetados (§5.6), tabla textual

| Variante | Geometría | Decoración | Etiqueta |
|---|---|---|---|
| Unidireccional con etiqueta | línea con punta abierta en destino | open arrowhead | itálica sobre la línea |
| Unidireccional sin etiqueta (null-tagged) | igual | open arrowhead | por defecto: "se relaciona con" |
| Bidireccional (etiquetas distintas) | línea con arpones en ambos extremos | harpoon | dos etiquetas independientes (f-tag / b-tag) |
| Recíproco (misma etiqueta o sin) | línea con arpones | harpoon | una sola etiqueta o sin etiqueta |

- **R-STRE-1** (DEBE): un bidireccional con dos etiquetas idénticas equivale a un recíproco con esa etiqueta. Consecuencia: **modelo de datos/generar**; normalizar a recíproco (SE4) o emitir SE3 con dos oraciones iguales (inferido; la regla no fija cuál se emite).

### 6.7 Excepción (§5.7), tabla textual

| Enlace | Marca | Dispara | OPL |
|---|---|---|---|
| Sobretiempo | `/` | duración real > duración máxima | EX1 |
| Subtiempo | `//` | duración real < duración mínima | EX2 |

| ID | Enunciado | Oblig. | Consecuencia |
|---|---|---|---|
| R-EXC-1 | La excepción conecta el proceso fuente con el proceso de manejo. | DEBE | **impedir** otra firma |
| R-EXC-1A | El proceso de manejo DEBE ser **ambiental**. | DEBE | **impedir o advertir** (inferido); lo más simple es advertir |
| R-EXC-1B | La excepción es una familia de control autónoma; un `e`/`c` NUNCA DEBE aplicarse a un enlace de excepción. | NUNCA DEBE | **impedir** |
| R-EXC-2 | El sobretiempo exige duración máxima declarada en la fuente. | inferido (DEBE) | **impedir/pedir dato** (canónico condicionado) |
| R-EXC-3 | El subtiempo exige duración mínima declarada en la fuente. | inferido (DEBE) | idem |
| R-EXC-4 | La duración PUEDE especializarse en mínima, esperada, máxima y distribución. | PUEDE | modelo de datos: mín y máx bastan para EX1/EX2 |
| R-EXC-4A | Con distribución declarada, esta determina el valor por instancia. | DEBE | runtime |
| R-EXC-5 | La unidad temporal del sistema es el default; un proceso con otra unidad DEBE declararla. | DEBE | **modelo de datos**: `modelo.unidadTiempo` + override por proceso |

### 6.8 Unicidad del enlace procedimental (§5.8)

- **R-ROL-UNIC-1** (inferido, DEBE): «un objeto/estado tiene exactamente un rol respecto de un proceso enlazado: transformado O habilitador, NUNCA ambos simultáneamente para el mismo enlace». La resolución por fuerza semántica (§6.5, fuera de tramo: `consumo = resultado > efecto > agente > instrumento`) aplica solo al **recomponer**; en edición directa NO se auto-resuelve (línea 927, R-EDIT-8). Consecuencia: **impedir** un segundo enlace procedimental entre el mismo objeto (o estado) y el mismo proceso en edición directa.

---

## 7. Núcleo mínimo exigible del tramo

Lista de lo que la herramienta simple **debe** hacer según este tramo, sin extras:

1. **Modelo de datos**: Modelo{id, unidadTiempo?, opds[]}; OPD{id persistente, etiqueta SDx.y derivada, padre?, refinado?}; Cosa{id, kind∈{objeto,proceso}, nombre, esencia=informacional, afiliación=sistémica, duración{mín?,máx?,unidad?} solo en procesos}; Estado{id, objeto, nombre, inicial, final, porDefecto(≤1), current(≤1)}; Enlace{id, tipo (enum de 6 familias), origen, destino (cosa o estado), etiqueta?, etiquetaB?, ruta?, e?, c?, escindido?}; Descomposición{orden: bandas}; Apariencia{cosa, opd, x, y, w, h}.
2. **Impedir**: firmas inválidas por familia; efecto a objeto sin estados; resultado al estado inicial; estados en procesos o dentro de estados; estructural fundamental (salvo exhibición) entre objeto y proceso; etiquetado objeto↔proceso; bidireccional o recíproco con estado solo en destino; `e`/`c` sobre excepción (y, fuera de tramo, sobre resultado, estructural e invocación); >1 estado por defecto o >1 `Current`; doble rol del mismo objeto con el mismo proceso; excepción sin duración mín/máx; cualquier cosa que no sea objeto ni proceso.
3. **Advertir**: nombres (R-NOM-*); proceso sin transformación (R-PROC-2); 21–25 cosas por OPD; cruces (R-LAY-2); rayo redundante entre bandas adyacentes; agente no humano (si hay dato); manejador de excepción no ambiental; propagación ambiental (R-OBJ-6/7).
4. **Renderizar**: 8 combinaciones forma×contorno×sombra; contorno grueso solo si la cosa está refinada en otro OPD; marcas de estado (grueso, doble, flecha por defecto, pin `Current`); 6 decoraciones de extremo; 4 triángulos con topología interna; marcas `e`, `c`, `/`, `//`, `Pr=p`, etiqueta y ruta; indicadores auxiliares; rótulo íntegro sin elipsis, en negro; handles distinguibles de las piruletas; export canónico sin grid ni sombras decorativas.
5. **Generar OPL**: plantillas D, T/TS, H/HS, ET/EH/ETS/EHS, CT/CH/CS, EX, IV, SE/RF/RX/RH/SSE, CX y ruta, en Markdown (**obj**, *proc*, `estado`), una oración por línea terminada en punto, alternancia y/e y o/u, CT1 preferida sobre la variante alternativa, solo ES.
6. **Parsear OPL**: las mismas plantillas más la variante R-OPL-COND-ALT-1, el sufijo « proceso» (R-OPL-9), infinitivo o nominalización (R-OPL-EQ-1), y `SDx.y` resuelto a su id persistente. Lo que cae fuera de la gramática se reporta como error o extensión y nunca se acepta en silencio (R-CONF-6).
7. **Roundtrip**: el hecho OPD→OPL→OPD es idéntico (R-META-5, bimodalidad).

---

## 8. (a) Sobreingeniería o circunstancial para una herramienta simple

- **SOBRE-01. Bilingüismo EN↔ES** (R-OPL-TEXT-4, §4.15 EQ-2/3, §4.16 TRANS-1..11, §4.17 LANG-1/2/3/6/7, R-OPL-6/7 «correspondencia con OPL-EN»). El canon lo condiciona a una «herramienta bilingüe». Una herramienta solo es-CL cumple con R-OPL-LANG-4/5 (no mezclar) y R-OPL-EQ-5 (el OPD es invariante). La «política editorial configurable» de R-OPL-EQ-4 también sobra: basta con no forzar el infinitivo.
- **SOBRE-02. Gobernanza documental**: Mapa de familia, Precedencia, R-DOC-1..8 y el **registro de conformidad** de R-CONF-7. No son funciones de la app. R-CONF-7 obliga al repo a declarar las reglas DEBE diferidas, y para eso basta una lista en un doc del repo.
- **SOBRE-03. Endurecimientos locales de `deep-opm-pro`**: R-LAY-1 (advertir 21–25, bloquear el export >25) y R-LAY-2 (re-ruteo automático o advertencia). El propio canon los declara «endurecimiento local, no texto de V-50/V-51». La vía mínima es un contador de cosas y una advertencia; el re-ruteo automático sobra.
- **SOBRE-04. Simulación/runtime**: R-EST-4 (pin runtime vs `Current`), R-EJEC-3/6/7/8/9/10, R-INS-4, R-CONS-2/3 (tasas), R-EFE-2/2A/2B, R-EFE-3 (distribución de probabilidad de estados), R-AG-2, R-EXC-4A (distribuciones), R-HER-6, R-ATR-3..6 («extensiones de implementación de deep-opm-pro»). Ninguna regla del tramo obliga a simular, y R-DOC-4C dice que estas reglas deberían estar fuera del canon.
- **SOBRE-05. Composición multi-modelo**: R-META-4/6/7/8/12, CM1–CM3, R-OPL-CM-1, R-OPL-LANG-6/7. Todo es PUEDE o condicional a tener sub-modelos. De ahí solo conviene conservar los IDs persistentes (R-META-9), que además exige R-IDP-2.
- **SOBRE-06. Tipado computacional y rangos**: R-OBJ-4, R-OPL-TIPO-1/2, R-OPL-RANGO-1..3, R-OPL-CONJ-1, R-OPL-10 (unidad y rango en el identificador), `{alias}` para binding (R-ROT-4). Son opcionales (PUEDE); si no se implementan, el parser debe reportarlos como no soportados.
- **SOBRE-07. Objetos específicos de estado** (R-META-15/16). Es una lectura metamodelo; materializarlos como cosas duplicaría el modelo.
- **SOBRE-08. Modo de preservación de superficie** (R-OPL-SUP-1). Es PUEDE; lo más simple es no tenerlo y regenerar siempre la forma canónica.
- **SOBRE-09. Herencia avanzada**: R-HER-3/4 (discriminantes, producto cartesiano) y R-HER-7 (operación «crear general»; el canon admite «o el modelador»). R-HER-1 como validación derivada es costoso; basta con R-HER-8 como advertencia.
- **SOBRE-10. Referencias circunstanciales**: «la bestia (~/kora)», pneuma, decisiones HITL, sha256 y commits, «deep-opm-pro» como nombre de producto, «régimen constitucional-enmendable», co-enmiendas de capas base (SSOT-iso, SSOT-visual), citas `V-nnn`, `SSOT-*`, `glosario 3.N`, OPCloud (declarado no autoritativo) y `R-ANEXO-CAT` categorial. Ninguna tiene efecto en la herramienta.
- **SOBRE-11. Designación `Current` declarada** (D13, pin, 0..1). El canon la presenta como parte de «esta adaptación». Es barata (un flag), pero solo tiene valor con runtime. Es canónica, así que se conserva si la gramática la exige.

---

## 9. (b) GAPs y contradicciones internas

- **GAP-01. La EBNF normativa no está en el documento.** R-OPL-EBNF-1 y R-IMPORT-1 (línea 1305) remiten a `SSOT-opl Apéndice A` (`opm-opl-es`), que está fuera del canon entregado. R-DOC-4A permite esa delegación, y la Definición (línea 25) dice que el documento es «autocontenido». En el canon cerrado, la única EBNF está en `spec-forja-opl-es` §18, que además añade extensiones «que no figuran en el Apéndice A» (`oracion_compuesta`, clasificación eco-OPCloud, rasgo opcional, sufijo de etiqueta). R-OPL-EBNF-2 («a favor del Apéndice A») no se puede aplicar. Hay además una colisión de nombres: `spec-forja-opl-es` tiene su propio «Apéndice A — Ejemplo end-to-end». **Decisión necesaria**: tomar `spec-forja-opl-es` §18 como gramática y usar las tablas de §4 de este tramo como gate de desempate.
- **CONTRA-01. Perseverancia de procesos.** R-COSA-2 («Objetos = persistentes; procesos = transitorios. No hay otras opciones.») y R-OBJ-3 («persistente (fija)») contradicen R-PROC-2A/5/6/7, R-OPL-PERSIST-1..3 y D11/D12 («**Cosa** es persistente/transitoria»), que admiten «procesos persistentes». No queda claro si el modelo de datos lleva `perseverancia` en los procesos. Lo mínimo coherente: no hay campo; D11/D12 son redundantes; el proceso «persistente» es un patrón metodológico (TS3 con entrada = salida).
- **CONTRA-02. Fuente del orden temporal.** R-INV-2, R-INV-2A y R-LAY-4 atan la semántica a la **posición vertical**. R-INV-2D (y R-IDP-0A, fuera de tramo) dicen que la verdad es el **orden declarado** y que la coordenada solo lo realiza. Falta decidir si arrastrar un subproceso en vertical cambia el orden declarado o si el layout queda restringido. Propuesta mínima: guardar las bandas en el modelo; al soltar tras un arrastre vertical, recalcular las bandas (o bloquear el cruce de bandas).
- **CONTRA-03. Monoespaciado sobrecargado.** §4.1 reserva `monoespaciado` para **estados**, pero CX7/CX8 usan `` `diagrama` `` (nombre de OPD) en monoespaciado. El parser no puede distinguir un estado de un OPD solo por la tipografía. CX1–CX6 y CM1–CM3 usan `SD1` sin marca.
- **CONTRA-04. «es» o «está» para valores de atributo.** R-OPL-2 fija **estar** para estados mutables, y R-ATR-2 dice que los valores de atributo **son estados**. Sin embargo, §4.13 trae `**Atributo** de **Objeto** es valor.` (con «es»).
- **CONTRA-05. Léxico estrecho frente a nombres admitidos.** R-OPL-LEX-2 (`caracter_de_cadena` = letra, dígito, `-`, `_`) choca con alias entre paréntesis (R-ROT-4, `Sistema de Turborreactor (str)`), `NombreInstancia : NombreClase` (R-INS-3, con `:`), unidad y rango en el identificador (R-OPL-10) y nombres de varias palabras (espacios). El tramo no dice cómo un nombre de varias palabras se compone de `nombre_simple`.
- **GAP-02. Agente humano sin dato.** R-AG-1 (y AP-05 «DEBE bloquearse») exige distinguir humanos, pero el modelo de cosa (R-OBJ-3) no tiene propiedad «humano». `spec-forja-opd-es` lo confirma: `GAP-OPD-AGENTE-HUMANO`, aproximado por esencia física (línea 723). Hay que decidir entre un flag `humano` en el objeto, la heurística del sufijo «Grupo» (R-NOM-OBJ-2), o solo una advertencia.
- **GAP-03. Numeración de familias.** El `fuente` y el título de §5.1 hablan de la «6.ª familia» (Excepción), pero la tabla la numera como #4 y la estructural etiquetada queda como #6. Es inocuo, pero confunde las referencias.
- **GAP-04. Emisión de defaults.** Existen D2 «es informacional» y D4 «es sistémica», pero el tramo no dice si se emiten siempre o solo cuando no son default. Afecta al roundtrip: si se omiten, el parser debe asumir los defaults.
- **GAP-05. TS4/TS5 ambiguos en el parseo.** La nota crítica dice que la superficie es idéntica para el par escindido y el standalone, y que el régimen «se determina por procedencia». Un OPL importado no trae procedencia, así que el parser no puede recuperar `escindido` solo desde el texto. Hace falta una convención (por ejemplo: es escindido si TS4 y TS5 sobre el mismo objeto caen en subprocesos hermanos de una descomposición cuyo padre tiene TS3).
- **GAP-06. Plantillas faltantes para conceptos exigidos.** (i) Descomposición **mixta** (R-OPL-CX-5 exige preservar el paralelo dentro de la secuencia; CX1 y CX2 solo cubren los casos puros). (ii) Despliegue diferenciado por partes, especialización, instanciación o rasgos (R-OPL-CX-1, frente a CX3 único; `spec-forja-opl-es` lo registra como GAP-DESPLIEGUE-DEDICADO). (iii) Declaración de tipo `es de tipo` (está en el vocabulario, sin ID D). (iv) Especialización de estado (R-OPL-RF-3, sin ID). (v) SSE con estado en ambos extremos **bidireccional** (no lo prohíbe V-30 y no tiene plantilla). (vi) Combinaciones de designaciones distintas de «inicial y final» (por ejemplo inicial + por defecto). (vii) `después de <demora>` (R-INV-2D) sin plantilla. (viii) Multiplicidad y participación (R-OPL-PART-1) sin plantillas en este tramo; probablemente estén en §6.7, fuera de tramo.
- **GAP-07. Detalles morfológicos.** R-OPL-KW-2 («e ante `i-` o `hi-`»), aplicada literalmente, produce «e hielo» y «e hierro»; en español es «y» ante «hie-» y ante diptongo. Además, D6 escribe `` `estado1`, …, y otros estados `` con coma antes de «y», contra R-OPL-LISTA-1.
- **GAP-08. Ruta sobre habilitadores.** R-OPL-RUTA-3 la declara «canónica-condicionada» pero restringida por producto a consumo y resultado. No dice si el parser debe aceptar `Por ruta …, *P* requiere **X**.` (es canónica por A.5) aunque el generador no la emita.
- **GAP-09. T3 al parsear.** `*Procesar* afecta **Afectado**.` exige que el objeto tenga estados (R-EFE-1, R-OBJ-2). Si el OPL crea un objeto nuevo sin estados, el tramo no dice si se rechaza, si se piden datos (la regla de «canónico condicionado»: «pedir datos o advertir») o si se crea con estados implícitos.
- **CONTRA-06. Autocontradicción de alcance.** R-DOC-4C manda sacar del canon la simulación y la ejecución computacional, pero §2.8 (R-EJEC-7..10), R-EST-4, R-CONS-2/3, R-EXC-4A y R-ATR-3..6 son reglas de runtime o simulación dentro del canon.
- **GAP-10. «Grueso» en dos canales.** El estado inicial se marca con «borde grueso» (R-EST-2) y el refinamiento con «contorno grueso» (§3.3). No es contradictorio (estado frente a cosa), pero el mismo canal visual se reutiliza. Además, §3.2 dice «exactamente 8 combinaciones» sin contar el grueso de refinamiento como superposición.
- **GAP-11. Numeración con huecos.** No existen R-INS-5, R-EJEC-2, R-EJEC-4 ni R-EJEC-5. Es inocuo, pero indica reglas retiradas sin nota.
- **GAP-12. Discrepancia de metadatos.** `object.yaml` dice `publication.status: legacy`; el frontmatter dice `estado: publicado`.

---

## 10. Referencias cruzadas que salen del tramo

Existen en el mismo documento y otro tramo debe cubrirlas: R-ESCIND-0 (línea 1105), R-IDP-0A (1142), R-IDP-2 (1149), R-BI-TAB-1 (1229), R-IMPORT-1 (1305), tabla AP-01..AP-30 (1338–1367), R-ZNC-1 (1371), R-APP-0 (1383), R-VIS-RUN-2 (1466), R-ECA-1..4 (888 en adelante), §6.5 matriz de fuerza (925), R-FAN-PROB-1 (1060), §7.3 plantillas de abanico (1032) y §9.2 tabla de bisimetría (1227).
