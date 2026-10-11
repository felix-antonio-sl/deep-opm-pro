# Reglas OpForja (perfil de reglas-opm-estrictas-es)

Este perfil reúne las reglas propias de OpForja que salieron de `reglas-opm-estrictas-es` v1.5.0 al publicar el canon 2.0.0: gobernanza documental, reglas de herramienta (edición, importación, exportación, persistencia, simulación, interfaz), extensiones y endurecimientos.

- **Subordinación**: este perfil no contradice el canon. Cuando una regla es más estricta que ISO 19450 se marca `[endurecimiento]` y su brecha se declara en `docs/conformidad.md`; cuando extiende la norma, `[extensión]`. Las referencias a reglas que quedaron en el canon se escriben `canon reglas §n` o por ID.
- **Procedencia**: cada bloque conserva el ID y el texto de canon v1.5.0 en la sección de mismo número (canon v1.x §n). Los «fragmentos retirados» son la parte de producto de una regla que sigue definida en el canon; se citan sin repetir el ID como definición.
- **Correcciones**: sólo donde el texto chocaba con el canon 2.0.0; cada una está anotada en el bloque y en `mapa-reglas-opm-estrictas-es.json`.

Los apartados Definición, Mapa de familia Forja, Definiciones, Precedencia y Convenciones son el preámbulo de canon v1.x, conservado como gobernanza documental de OpForja; el canon 2.0.0 los sustituye por su propio preámbulo.

## Definición

Este artefacto es la SSOT **primaria**, **prescriptiva** y **referencialmente autónoma** del canon operativo OPM de OPFORJA. Gobierna, para opforja/deep-opm-pro, las reglas estrictas de validez OPD/OPL: clases de cosas, estados, enlaces, refinamiento, modificadores, abanicos, contexto, políticas de herramienta, severidades, defaults, extensiones declaradas, gates ejecutables y condiciones de bimodalidad OPD<->OPL.

La audiencia primaria son arquitectos OPM, mantenedores del modelador `deep-opm-pro` y agentes que validan, generan, importan, editan o auditan hechos OPM en la familia Forja.

Este artefacto es autocontenido: un agente conforme NO DEBE necesitar abrir `opm-iso-19450-es.md`, `opm-opl-es.md`, `opm-visual-es.md`, `metodologia-opm-es.md` ni puentes locales para decidir una regla operativa ordinaria. Las obligaciones, prohibiciones, condiciones, defaults y severidades necesarias DEBEN aparecer aquí. La procedencia a las capas base se expresa con citas `SSOT-*`, IDs `V-*`, `R-*` o `Rationale:` cuando haga falta, pero esas citas no sustituyen la regla local.

Es la hermana prescriptiva de `metodologia-forja-es` (`urn:fxsl:kb:metodologia-forja-opm-es`), `spec-forja-opd-es` (`urn:fxsl:kb:spec-forja-opd-es`) y `spec-forja-opl-es` (`urn:fxsl:kb:spec-forja-opl-es`). Juntas forman la familia Forja OPM: este documento decide validez y severidad; `metodologia-forja` decide método de modelamiento; `spec-forja-opd` decide realización visual; `spec-forja-opl` decide realización textual y roundtrip.

## Mapa de familia Forja

Esta tabla es la norma anti-duplicación del corpus operativo. Cada artefacto DEBE ser autocontenido dentro de su alcance, pero NO DEBE re-legislar el alcance propietario de un hermano; debe citarlo por URN y delegar la decisión.

| Artefacto | Propiedad primaria | Debe contener | No debe duplicar |
| --- | --- | --- | --- |
| `reglas-opm-estrictas-es` | Validez, severidad, defaults, extensiones declaradas y gates de canon operativo. | Reglas prescriptivas aplicables a hechos OPD/OPL, niveles de canonicidad, políticas de herramienta y anexos ejecutables. Las tablas de plantilla de §4/§7.3/§9.2 viven aquí como **gate de validez** (R-BI-TAB-1): son criterio de bisimetría, no superficie operativa. | Geometría completa, la **superficie operativa OPL** (tokenización, parseo, variantes, edición — propiedad de `spec-forja-opl-es`), método paso a paso o explicación categorial extendida. |
| `metodologia-forja-es` | Método de modelamiento y calidad de construcción. | Procedimiento, heurísticas, lecciones forja, criterios de decisión y uso humano/agente del método. | Validez nuclear, severidades, glifos detallados, gramática OPL completa o leyes categoriales como vocabulario de modelador. |
| `spec-forja-opd-es` | Realización visual/OPD. | Geometría, marcadores, layout, interacción visual, canvas, export visual y trazabilidad renderer. | Taxonomía normativa general de cosas/enlaces si ya está en reglas, plantillas OPL textuales o método de construcción. |
| `spec-forja-opl-es` | Realización textual/OPL y roundtrip textual. | Vocabulario, plantillas, tokenización, parseo, edición OPL, panel textual, errores y fixtures de bisimetría. | Gramática visual OPD, severidad normativa general o método de modelamiento. |
| `opm-categorial-es` | Puente formal ICAS-BoK bajo la superficie. | Lectura categorial, trazabilidad a ICAS y correspondencia con leyes verificables. | Reglas nuevas para modeladores, UI, glifos, plantillas OPL o método operativo. |

Una regla que cambie canonicidad DEBE vivir en este documento. Una regla que cambie solo superficie visual DEBE vivir en `spec-forja-opd-es`; si altera validez, debe citar y respetar este documento. Una regla que cambie solo superficie textual DEBE vivir en `spec-forja-opl-es`; si altera validez, debe citar y respetar este documento. Una regla metodológica que recomiende cómo modelar DEBE vivir en `metodologia-forja-es`; si bloquea o permite un hecho, debe elevarse a este documento. Una afirmación categorial que se vuelva operativa DEBE tener regla propietaria en este documento o en la spec modal correspondiente, más ley verificable. **Desempate de plantilla**: ante divergencia de una plantilla OPL entre este documento (tablas-gate) y `spec-forja-opl-es` (superficie operativa), manda este documento — es validez —; `spec-forja-opl-es` se corrige.

## Definiciones

| Término | Definición |
| --- | --- |
| Regla estricta | Obligación, prohibición, condición, default, severidad o política ejecutable que decide si un hecho, vista o operación es aceptable en opforja. |
| SSOT primaria | Artefacto que manda dentro de su alcance operativo y no requiere consultar otra fuente para aplicar una decisión ordinaria. |
| Referencialmente autónomo | Las fuentes se citan para procedencia, trazabilidad o arbitraje, pero la regla aplicable vive localmente en este documento. |
| Capa base | Corpus OPM general (`opm-es`, `opd-es`, `opl-es`, `manual-metodologico-opm-es`) que define semántica, gramática visual/textual y método tool-agnostic. |
| Familia Forja OPM | Conjunto operativo formado por este canon prescriptivo, `metodologia-forja-es`, `spec-forja-opd-es` y `spec-forja-opl-es`. |
| Extensión declarada | Capacidad de opforja que no pertenece al núcleo ISO/OPM base, pero se admite si queda tipificada, trazada, verificable y no contradice la semántica OPM. |
| Gate ejecutable | Checker, test, ley, validador o política de import/export que aplica una regla sin depender de interpretación humana. |
| Severidad | Clasificación operativa de incumplimiento: bloqueo, advertencia, mejora metodológica, vista/UI o extensión pendiente, según la tabla local correspondiente. |
| Bimodalidad | Invariante por el cual un hecho OPM editado en OPD puede realizarse en OPL y una oración OPL canónica puede volver al mismo hecho. |

## Precedencia (canon v1.x)

Este documento DEBE mandar sobre el canon prescriptivo operativo de OPFORJA: validación de hechos, severidades, defaults, políticas de herramienta, reglas de import/export, reglas de roundtrip y decisión de si una capacidad se trata como canónica, condicionada, UI/vista, extensión declarada, no canonizada o prohibida.

`spec-forja-opd-es` y `spec-forja-opl-es` DEBEN quedar bajo este documento para el canon OPM nuclear: ante conflicto sobre qué es una cosa, un enlace, un estado, una relación, una prohibición, una severidad o una extensión declarada, prevalece este documento. Esas specs son SSOT primarias dentro de su modalidad: OPD/visual para `spec-forja-opd-es`, OPL/textual para `spec-forja-opl-es`.

`metodologia-forja-es` es SSOT primaria del método de modelamiento. Ante conflicto entre una recomendación metodológica y una regla de validez, prevalece este documento; ante una decisión sobre orden de trabajo, heurística o calidad de construcción que no cambia validez, prevalece `metodologia-forja-es`.

Las capas base `urn:fxsl:kb:opm-es`, `urn:fxsl:kb:opd-es`, `urn:fxsl:kb:opl-es` y `urn:fxsl:kb:manual-metodologico-opm-es` siguen siendo autoridad semántica general de OPM. Este documento las operacionaliza para opforja: si una regla local contradice una capa base sin declararse como restricción, perfil o extensión local, DEBE abrirse corrección documental. Las capacidades de herramienta NO redefinen semántica OPM por sí solas.

**Equivalencia archivo<->URN**: `opm-iso-19450-es.md` = `urn:fxsl:kb:opm-es`; `opm-opl-es.md` = `urn:fxsl:kb:opl-es`; `opm-visual-es.md` = `urn:fxsl:kb:opd-es`; `metodologia-opm-es.md` = `urn:fxsl:kb:manual-metodologico-opm-es`. La notación `SSOT-iso` / `SSOT-opl` / `SSOT-visual` / `SSOT-metod` refiere a esas cuatro capas.

**OPCloud (la implementación comercial de referencia) NO es autoritativo.** El análisis del corpus OPCloud sirve como insumo de comparación, no como fuente de validez. Los hechos divergentes de OPCloud DEBEN arbitrarse como canon, afordance UI, extensión declarada o no canonizados según esta SSOT.

## Convenciones (canon v1.x)

### Convención de citas

Cada regla en este documento cita su fuente. Notación:
- `SSOT-iso §X` → sección de `opm-iso-19450-es.md`.
- `SSOT-opl §X` → sección/tabla de `opm-opl-es.md` (ej. `SSOT-opl §7.1 CT1`).
- `SSOT-visual V-N` → regla numerada de `opm-visual-es.md` (ej. `V-37`, `V-43`).
- `SSOT-metod §X` → sección de `metodologia-opm-es.md`.
- `glosario 3.N` → entrada `N` del glosario de SSOT-iso.

Cuando una regla aparece en varias capas se cita primero la propietaria, luego las realizaciones.

### Contrato prescriptivo de exhaustividad

- **R-DOC-1**: este documento DEBE formular reglas, no explicación histórica ni tutorial.
- **R-DOC-2**: todo contenido conservado en este documento DEBE poder clasificarse como obligación, prohibición, condición, default, severidad, política de herramienta, matriz normativa o gate ejecutable.
- **R-DOC-3**: todo ejemplo conservado DEBE leerse como patrón permitido o patrón prohibido; si un ejemplo no decide comportamiento, DEBE eliminarse o moverse fuera de este canon.
- **R-DOC-4**: todo elemento prescriptivo de `opm-iso-19450-es.md`, `opm-opl-es.md`, `opm-visual-es.md` y `metodologia-opm-es.md` DEBE tener cobertura local trazable en este documento.
- **R-DOC-4A**: una remisión a la SSOT propietaria PUEDE conservar autoridad de redacción literal, EBNF completa o detalle de origen, pero NO DEBE sustituir la regla local aplicable.
- **R-DOC-4B**: índices exhaustivos, glosarios abreviados, tablas de navegación y resúmenes de cobertura NO DEBEN conservarse en este canon si duplican reglas ya definidas; DEBEN moverse fuera del canon salvo que operen como gate ejecutable.
- **R-DOC-4C**: reglas metodológicas sobre simulación, MBSE/PDR, integración virtual o ejecución computacional DEBEN vivir fuera de este canon salvo que alteren canonicidad OPD/OPL, validación de hechos o roundtrip OPD<->OPL.
- **R-DOC-5**: si una regla local diverge de la capa base sin declararse como restricción operativa, perfil o extensión local, DEBE abrirse corrección documental.
- **R-DOC-6**: si la SSOT contiene prosa informativa sin efecto operativo, este documento NO DEBE copiarla; DEBE extraer solo la obligación, prohibición o condición implementable.
- **R-DOC-7**: si una capacidad de herramienta no está canonizada por la SSOT, DEBE clasificarse como `UI / vista`, `No canonizado` o `extensión declarada`, nunca como OPM nuclear.
- **R-DOC-8**: la redacción normativa DEBE usar español editorialmente consistente; términos acentuables de uso ordinario se escriben con acento salvo dentro de código, identificadores, rutas, tokens OPL literales o citas técnicas.

La exhaustividad prescriptiva se evalúa así:

| Plano | Este documento DEBE cubrir | Fuente propietaria |
|---|---|---|
| Ontología | clases de cosas, estados, enlaces, transformaciones, refinamiento, existencia e identidad | `opm-iso-19450-es.md` |
| OPD | formas, contornos, profundidad, markers, anidamiento, refinamiento visual, vistas, export, UI vs canon | `opm-visual-es.md` |
| OPL-ES | plantillas de oración por familia, EBNF delegada, vocabulario, nombres, roundtrip EN<->ES | `opm-opl-es.md` |
| Metodología | propósito, SD, refinamiento, heurísticas, validación y reglas que cambian canonicidad OPD/OPL | `metodologia-opm-es.md` |
| Bisimetría | reglas para que un hecho editado en OPD sea texto y un texto OPL vuelva al mismo hecho | las cuatro capas |

Este documento SÍ sustituye la necesidad de abrir la fuente base para decidir canonicidad operativa ordinaria. Cuando una implementación necesite la EBNF completa, la redacción literal histórica o el detalle de origen, PUEDE abrir la capa base propietaria; si aparece una divergencia no declarada entre este documento y la capa base, se abre bug documental y se aplica la precedencia de §Precedencia.

Niveles de decisión usados en tablas:

| Estado | Significado operativo |
|---|---|
| **Canónico** | Se puede crear, serializar, importar y editar bidireccionalmente. |
| **Canónico condicionado** | Se puede usar solo si se cumplen las condiciones indicadas; si faltan, la herramienta debe pedir datos o advertir. |
| **No canonizado** | La SSOT no lo define. No se debe inventar como OPM nuclear; solo puede existir como extensión declarada. |
| **Prohibido** | Contradice una regla de la SSOT. La herramienta debe bloquearlo o reportarlo como error estructural. |
| **UI / vista** | Puede existir en pantalla, pero no es hecho OPM nuclear ni debe emitir OPL nuclear. |

Las **tablas son normativas**. La prosa fuera de tablas solo es válida si formula una regla aplicable.

### Conformidad OPM (canon v1.x)

R-CONF-1 a R-CONF-5 siguen en canon reglas, «Conformidad OPM».

- **R-CONF-6**: una implementación que acepta OPL fuera de EBNF DEBE clasificarlo como legacy, extensión o error; NO DEBE presentarlo como OPL-ES canónico.
- **R-CONF-7** (extensión local de gobernanza — régimen constitucional-enmendable): toda regla DEBE de esta SSOT cuya superficie participa del ciclo operativo activo de la herramienta (export canónico, OPL consumido aguas abajo, render consumido por skills) DEBE tratarse como deuda exigible de implementación. Una regla DEBE sin tráfico operativo PUEDE programarse para un corte futuro o enmendarse. La **programación** DEBE declararse en el registro de conformidad de la herramienta (fuera de este canon, conforme a R-APP-0: el canon no contiene inventarios fechados de implementación); la **enmienda** DEBE materializarse en la spec propietaria con nota explícita. La brecha silenciosa — regla DEBE incumplida sin declaración en ninguno de los dos registros — está PROHIBIDA y constituye no-conformidad documental (se trata según R-DOC-5).

## 2. Ontología de entidades

### 2.2 Objetos

> [extensión] No consta en ISO/PAS 19450:2015 (ISO §7.3.3–§7.3.4 resumidas); verificar con la IS 2024; no altera el canon.

- **R-OBJ-6** (`SSOT-iso §Propiedades genéricas`): los atributos de objetos ambientales DEBEN ser ambientales.
- **R-OBJ-7**: los procesos ejecutados por cosas ambientales DEBEN modelarse como procesos ambientales.

- Fragmento retirado de R-OBJ-5 (canon reglas §2.2), política de herramienta: una herramienta PUEDE derivar la esencia por defecto desde el perfil, preset de creación o tipo de sistema declarado; ese default NO DEBE sobrescribir esencia explícita de una cosa.

### 2.3 Procesos

> [extensión] «Proceso persistente» designa en OpForja un proceso que sostiene una condición. No es la perseverancia de ISO §3.50 (canon R-COSA-2: todo proceso es dinámico) y no exime a ningún proceso de R-PROC-2.

- **R-PROC-2A**: un proceso persistente solo satisface cierre canónico si declara objeto afectado e invariancia neta, atributo o condición mantenida conforme a R-PROC-5..7.
- **R-PROC-5** (`SSOT-iso §Procesos`): un proceso persistente solo es canónico si la temporalidad, el esfuerzo sostenido o la condición mantenida forman parte del hecho de modelo.
- **R-PROC-6**: un proceso persistente NO DEBE usarse como escape genérico para eludir el cierre transformador o R-PROC-2A. Si no hay transformación ni condición sostenida relevante, DEBE reemplazarse por enlace estructural etiquetado, atributo o estado.
- **R-PROC-7**: cuando un proceso persistente conserva un objeto en el mismo estado, el modelo DEBE declarar explícitamente el objeto afectado y la invariancia neta (`estado_entrada = estado_salida`) o el atributo/condición mantenida.

- Fragmento retirado de R-PROC-2 (canon reglas §2.3): la v1.x limitaba el requisito de transformación al «proceso explícito no persistente»; esa salvedad sólo vale para la extensión de R-PROC-2A.

### 2.4 Nombres válidos (OPL-ES)

- Fragmento retirado de R-NOM-PROC-1 (canon reglas §2.4): el criterio de forma deverbal incluye los sufijos productivos (`-ción`, `-miento`, `-aje`, `-ura`, `-ncia`) y las nominalizaciones sin sufijo (`Despacho`, `Ingreso`, `Cierre`, `Retiro`, `Traslado`); quedan excluidos los sustantivos no verbales (`Sistema`, `Módulo`, `Gestión` como comodín); el checker es-CL del modelador realiza este criterio.
- Fragmento retirado de R-NOM-PROC-2 (canon reglas §2.4) [endurecimiento]: un nombre de proceso canónico DEBE tener al menos 2 palabras, salvo término de dominio registrado; fuera del rango 2 a 4 la herramienta DEBE emitir advertencia metodológica.

### 2.5 Qué NO puede ser una cosa

| No-cosa | Por qué |
|---|---|
| Un comentario / sticky note | Es contenido meta del autor; no pertenece a gramática nuclear (`V-204`). |
| Un handle de edición / overlay UI | Afordances UI, no gramática (`V-202`, `V-203`). |

### 2.6 Estados

> [extensión] `Current` no es designación de estado en ISO (ISO §7.3.5.3; «current state» es noción de ejecución, ISO §3.69).

| Designación | Marca canónica | Restricción de cardinalidad |
|---|---|---|
| `Current` declarado | glifo externo reservado (pin) | 0..1 |

- **R-EST-4**: el **estado actual de runtime** (durante simulación, glifo `V-54`) y la designación `Current` declarada son distinguibles en serialización y DEBEN distinguirse visualmente (color, halo o glifo auxiliar) aunque compartan la familia de glifo pin (`V-134`, `V-238`; ver `R-VIS-RUN-2`).

- Fragmento retirado de R-EST-3 (canon reglas §2.6), método: los ciclos cerrados DEBEN usar un único estado con doble designación; duplicar estados para separar inicio y fin es anti-patrón (AP-14).

### 2.7 Instancias

- **R-INS-6**: una instancia especializada en ejecución exige su instancia general; la regla normativa es R-HER-6 (§5.5).

### 2.8 Modelo conceptual, ejecución y realización

- **R-EJEC-3**: el estado de runtime NO DEBE persistirse como canon conceptual salvo snapshot declarado.
- **R-EJEC-6**: todo runtime DEBE seguir los enlaces, condiciones, eventos, duración y reglas de transformación declaradas por el modelo conceptual; NO DEBE introducir semántica externa silenciosa.
- **R-EJEC-10**: una herramienta PUEDE acotar bucles no terminales durante simulación con un límite de seguridad y diagnóstico visible; ese límite es política de runtime, NO hecho OPM nuclear ni OPL.

### 2.9 Metamodelo OPM

> [extensión] Sub-modelos, referencias entre modelos e identificadores persistentes no constan en ISO/PAS 19450:2015.

- **R-META-4**: un modelo OPM individual PUEDE referenciar `0..*` sub-modelos; si lo hace, se convierte en modelo OPM compuesto por referencia.
- **R-META-6**: la composición entre modelos NO DEBE colapsar las dualidades OPD↔OPL locales en una única especificación cerrada.
- **R-META-7**: toda composición inter-modelo DEBE regularse por referencias explícitas entre fronteras de modelo y metadatos persistentes.
- **R-META-8**: una referencia externa a una cosa NO crea existencia propietaria nueva; la existencia pertenece al modelo propietario.
- **R-META-9**: toda cosa referenciable desde otro modelo y todo OPD citable externamente DEBEN exponer identificador persistente recuperable.
- **R-META-12**: referencias externas y vínculos entre modelos pertenecen al nivel metamodelo del compuesto; NO alteran la definición de constructo básico.

- Fragmento retirado de R-META-1 (canon reglas §2.9): el modelo individual contiene además metadatos persistentes de identidad.

## 3. Reglas visuales del OPD

### 3.4 Profundidad/sombra

- **R-SOMB-2**: toda sombra decorativa de UI aplicada uniformemente DEBE suprimirse en export canónico.

### 3.5 Colores canónicos

- **R-COLOR-3**: una implementación PUEDE usar la paleta de referencia si preserva sin ambigüedad la topología semántica.

### 3.6 Tipografía y rotulado

- **R-ROT-1** (`V-194`): el rótulo visible permanece íntegro en canon-diagrama. NO se admite truncamiento con elipsis ni corte silencioso.
- **R-ROT-2** (`V-195`): el rótulo permanece inscrito en el bounding box visible de la cosa; wrap, autosize u overflow solo son válidos si el perfil de export los declara y preservan la lectura completa.
- **R-ROT-3** (`V-228`): en canon-diagrama los rótulos dentro del grafo permanecen en negro por defecto. El cromatismo de clase se preserva primariamente en bordes/líneas/decoraciones semánticas, no en el texto.
- **R-ROT-4** (`V-122`): un alias entre paréntesis es decorativo (`Sistema de Turborreactor (str)`). Las llaves `{alias}` se reservan al binding computacional (`SSOT-visual §20.1`).

### 3.7 Decoraciones de extremo de enlace

- **R-DEC-1A**: un círculo aislado NO DEBE interpretarse como piruleta.
- **R-DEC-2** (`V-191`): handles UI NO DEBEN ser visualmente idénticos a piruletas.
- **R-DEC-2A**: handles UI DEBEN distinguirse por color reservado a UI, posición o tamaño.

### 3.8 Símbolos triangulares

- **R-TRI-3** (`V-131`): los símbolos estructurales importados DEBEN preservar topología interna; la retipificación cromática es admisible.

### 3.9 Marcas textuales sobre enlaces

- Fragmento retirado de R-MARCA-1 (canon reglas §3.9) [extensión]: las marcas textuales sobre enlaces PUEDEN incluir extensiones declaradas por perfil; ninguna es OPM nuclear (ISO §5 a)).

### 3.10 Indicadores auxiliares

| Indicador | Representación |
|---|---|
| Supresor de enlaces no materializados | Burbuja adyacente con `...` |

### 3.11 Anidamiento permitido

- Fragmento retirado de la fila «Objeto» (canon reglas §3.11) [extensión]: un objeto PUEDE contener rasgos por semi-plegado de exhibición.

### 3.12 Tamaños, layout y grid

> [endurecimiento] Más estricto que ISO 19450; la brecha se declara en `docs/conformidad.md`.

- **R-LAY-1** (`V-50` + extensión local): `V-50` fija el límite de legibilidad en 20-25 cosas por contexto. *Extensión de implementación de `deep-opm-pro`*: la herramienta DEBE emitir advertencia entre 21 y 25 cosas y DEBE bloquear el export canónico con más de 25 salvo vista tipificada o refinamiento declarado. El umbral graduado y el bloqueo de export son endurecimiento local, no texto de `V-50`.
- **R-LAY-2** (`V-51` + extensión local): `V-51` prescribe no oclusión y minimización de cruces. *Extensión de implementación*: si un re-ruteo automático sin cambio semántico elimina cruces, el export canónico DEBE aplicar el re-ruteo o reportar advertencia. La obligación de re-ruteo automático es endurecimiento local, no texto de `V-51`.
- **R-LAY-3** (`V-196`): la grid es decoración opcional de edición; se suprime en exportaciones canónicas.

## 4. Reglas gramaticales OPL-ES

### 4.1 Convenciones tipográficas Markdown (`SSOT-opl §1.7`)

| Entidad | Convención | Patrón permitido |
|---|---|---|
| Objeto | **negrita** | **Ingrediente** |
| Proceso | *cursiva* | *Cocinar* |
| Estado | `monoespaciado` | `crudo` |

- **R-OPL-TYPO-1**: todo OPL Markdown emitido por el modelador DEBE representar objetos en negrita, procesos en cursiva y estados en monoespaciado.
- **R-OPL-TYPO-2**: colores, contornos, sombreados y atributos visuales NO forman parte del contrato OPL-ES.

### 4.3 Vocabulario fijo de verbos

- **R-OPL-VERB-2**: para detección EN/ES por verbo fijo, aplica R-OPL-LANG-1; esta sección solo define el vocabulario candidato.

### 4.4 Plantillas — cosas

> [extensión] D13 y el «proceso persistente» no constan en ISO; D11/D12 siguen en el canon como oraciones literales de ISO A.4.4.2.

| ID | Plantilla OPL-ES |
|---|---|
| D13 | Estado `s` de **Objeto** es declarado `Current`. |

- **R-OPL-PERSIST-1** (`SSOT-opl §3.4`): OPL-ES NO define familia verbal adicional para procesos persistentes.
- **R-OPL-PERSIST-2**: si un proceso persistente permanece explícito, su realización textual canónica DEBE usar TS3 con estado de entrada igual a estado de salida.
- **R-OPL-PERSIST-3**: si la temporalidad sostenida no es semánticamente central, la superficie textual PUEDE simplificarse mediante enlace estructural etiquetado según la política metodológica de `SSOT-metod-forja §A8` (`urn:fxsl:kb:metodologia-forja-opm-es`).

### 4.5 Plantillas — enlaces transformadores

- Fragmento retirado de la nota TS4/TS5 (canon reglas §4.5): el régimen se determina por procedencia (metadato persistido por la operación de descomposición, R-ESCIND-0 v1.x).

### 4.8 Plantillas — enlaces de condición

> Corregida v2.0: la sintaxis alternativa es ISO (canon R-OPL-COND-ALT-1, columna «Sintaxis alternativa»); aquí queda sólo la preferencia de emisión.

- **R-OPL-COND-ALT-2**: el generador canónico DEBE preferir CT1 sobre la variante alternativa de R-OPL-COND-ALT-1.
- **R-OPL-SUP-1**: el modo de preservación de superficie solo PUEDE activarse durante importación, migración o roundtrip auditado; DEBE persistirse como metadato de superficie y NO DEBE ser el modo default de export canónico.

### 4.11 Plantillas — gestión de contexto

> [extensión] Capacidad de OpForja sin contraparte en ISO 19450; no altera el canon.

| ID | OPL-ES |
|---|---|
| CM1 | SD1.1 es una vista de sub-modelo de Modelo Subsistema. |
| CM2 | SD1.1 referencia el sub-modelo Modelo Subsistema desde SD1. |
| CM3 | **Cosa** en SD1.1 es referencia externa a **Cosa** del modelo propietario Modelo Principal. |

- **R-OPL-CX-ID-1** (`SSOT-opl §10.3`): toda oración de refinamiento entre OPDs que use etiqueta visible `SDx.y` DEBE mapearse al identificador persistente exigido por R-IDP-2.
- **R-OPL-CM-1** (`SSOT-opl §10.4`): las oraciones CM1–CM3 NO reemplazan la gramática interna de cada modelo; solo describen composición entre modelos y referencias externas.

### 4.12 Etiquetas de ruta

> [endurecimiento] Más estricto que ISO 19450; la brecha se declara en `docs/conformidad.md`.

- **R-OPL-RUTA-3** (`SSOT-opl §13`/`A.5` + restricción local): `A.5` admite que `Por ruta` prefije **cualquier** oración procedimental. *Restricción de implementación*: el canon local solo emite consumo/resultado salvo extensión documentada. La restricción a consumo/resultado es decisión de producto, no límite de `A.5`. **Estatuto único**: la etiqueta de ruta sobre habilitadores es construcción canónica-condicionada (canónica por `A.5`, restringida por producto), NO «zona no canonizada» — `R-ZNC-1` exige silencio de la SSOT, y `A.5` no calla. Esta regla es su domicilio único (§11.2 no la lista).

### 4.13 Atributos y valores

> [extensión] Capacidad de OpForja sin contraparte en ISO 19450; no altera el canon.

> **R-ATR-3..R-ATR-6 son extensiones de implementación de `deep-opm-pro`** (modelado computacional/simulación): `SSOT-opl §14` solo canoniza las plantillas textuales de atributo/valor (las tres filas de arriba). Unidades, dominios e intervalos tienen soporte léxico en `SSOT-opl A.2/A.3`, pero las obligaciones siguientes exceden la SSOT textual y se declaran como endurecimiento local.

- **R-ATR-4**: un atributo PUEDE declarar dominio permitido como intervalo simple o lista de intervalos.
- **R-ATR-5**: los intervalos de dominio DEBEN usar límites explícitos y semántica de inclusión/exclusión cuando el límite importe.

- Fragmento retirado de R-ATR-3 (canon reglas §4.13): si se declara la unidad, DEBE persistirse y emitirse de forma recuperable.
- Fragmento retirado de R-ATR-6 (canon reglas §4.13): el criterio operativo «no cambia durante simulación o implementación operacional» como prueba de herramienta.

### 4.14 EBNF normativa

- **R-OPL-EBNF-2**: cualquier divergencia entre `SSOT-opl §17` y Apéndice A DEBE resolverse a favor del Apéndice A.
- **R-OPL-EBNF-3**: los no terminales normativos del Apéndice A DEBEN escribirse en `snake_case`; nombres con espacios de §17 son explicativos.

- Fragmento retirado de R-OPL-LEX-2 (canon reglas §4.14) [extensión]: `caracter_de_cadena` admite `_` (guion bajo).
- Fragmento retirado de R-OPL-PART-1 (canon reglas §4.14) [extensión]: las restricciones de participación PUEDEN usar `exactamente un/una` y `dos o más`.
- Fragmento retirado de R-OPL-RANGO-1 (canon reglas §4.14) [extensión]: intervalos `[..]`/`(..)` para límites parseables y `*` como límite abierto (ISO §11.1 exige rangos cerrados).
- Fragmento retirado de R-OPL-RANGO-3 (canon reglas §4.14): los símbolos Unicode equivalentes DEBEN normalizarse o declararse como extensión de visualización.

### 4.15 Equivalencia EN↔ES de ida y vuelta

- **R-OPL-EQ-2**: superficies equivalentes DEBEN mapear al mismo nombre canónico interno por cosa cuando así lo declare el modelo.
- **R-OPL-EQ-4**: una herramienta NO DEBE forzar exclusivamente infinitivo; la normalización de superficie DEBE ser política editorial configurable del modelo.
- **R-OPL-EQ-5**: un modelo interno OPD DEBE permanecer invariante ante cambio de idioma OPL.

### 4.16 Transformación sistemática EN→ES

- **R-OPL-TRANS-1**: la transformación EN→ES DEBE aplicar mapeo de verbo principal antes de los demás reemplazos.
- **R-OPL-TRANS-11**: nombres de entidades NO DEBEN traducirse por regla automática salvo política explícita del modelo.

- Fragmento retirado de R-OPL-TRANS-10 (canon reglas §4.16) [extensión]: `declared current` → declarado `Current` (D13).

### 4.17 Política de idioma y modelos mixtos (`SSOT-opl §18`)

- **R-OPL-LANG-1**: una herramienta bilingüe DEBE detectar idioma de una sentencia por verbo principal fijo cuando sea posible.
- **R-OPL-LANG-2**: el idioma OPL canónico DEBE elegirse a nivel de usuario o modelo sin alterar el OPD subyacente.
- **R-OPL-LANG-3**: cambiar idioma OPL DEBE regenerar el párrafo OPL completo, no editar parcialmente una superficie mixta.
- **R-OPL-LANG-4**: una herramienta NO DEBE mezclar OPL-EN y OPL-ES dentro del mismo párrafo generado salvo habilitación explícita del usuario.
- **R-OPL-LANG-5**: modelos mixtos EN/ES solo PUEDEN existir como revisión o migración; NO DEBEN ser estado estable por defecto.
- **R-OPL-LANG-6**: una herramienta multilingüe DEBE mantener OPL local autocontenido por modelo individual cuando existan sub-modelos.
- **R-OPL-LANG-7**: una especificación textual global de modelo compuesto NO DEBE inferirse únicamente desde navegación visible del árbol OPD; DEBE conservar frontera entre modelos e identificador persistente de cada OPD.

## 5. Enlaces — taxonomía estricta

### 5.1 Familias canónicas de enlace

> Corregida v2.0: en el canon la excepción y la invocación son enlaces de control (canon reglas §5.1; ISO §9.5.1, §9.5.2.5). La «sexta familia» queda sólo como agrupación de producto y no co-enmienda ninguna fuente.

`V-239` cierra la taxonomía base en cinco familias y agrupa la excepción bajo «modificadores de control». OPFORJA la promueve a familia por derecho propio (**extensión declarada**, paridad con la invocación `V-240`): igual firma `Proceso → Proceso`, igual naturaleza de control de flujo, distinta realización (rayo de invocación vs marca `/`/`//` de excepción) y semántica (delegación al terminar vs desvío por desviación temporal con manejador ambiental). Las capas base se co-enmiendan en consecuencia (`SSOT-iso §Control como modificador` acota la frase «modificador» a evento/condición; `SSOT-visual §4.4` declara la excepción enlace de control autónomo, no modificador).

### 5.3 Enlaces habilitadores

- **R-AG-1B**: una descripción textual externa PUEDE llamar "agente" a un software, pero el OPD/OPL canónico DEBE clasificarlo como instrumento.

- **R-AG-3** (`SSOT-metod §6.7`, **reclasificación por desgaste**): cuando el desgaste/degradación/amortización del instrumento es relevante al alcance, el instrumento DEBE reclasificarse como afectado.
- **R-AG-4**: si un instrumento se reclasifica por desgaste y el mantenimiento pertenece al alcance declarado, el modelo DEBE agregar atributo de degradación/amortización y proceso de mantenimiento separado; si el mantenimiento queda fuera del alcance, el modelo DEBE declarar esa exclusión.

### 5.4 Enlaces de invocación

> [endurecimiento] Más estricto que ISO 19450; la brecha se declara en `docs/conformidad.md`.
> Corregida v2.0: la semántica del orden es la disposición vertical (canon R-INV-2, R-INV-2A, R-INV-2B, R-INV-2C; ISO §14.2.2.1–§14.2.2.2). El «orden declarado» es la representación de OpForja de ese orden, no otra fuente de verdad.

- Fragmento retirado de R-INV-2B (canon reglas §5.4 conserva la regla ISO) [endurecimiento]: en invocación implícita NO DEBE dibujarse enlace explícito.
- **R-INV-2D** (frontera implícito/explícito de la invocación entre subprocesos; panel deliberativo ratificado 2026-06-14): la fuente de verdad del orden de ejecución de una descomposición es el **orden declarado** de la descomposición (presentación del preorden por bandas con cardinalidad), NO los enlaces de invocación entre hermanos. Un enlace de invocación que repite un orden ya expresado como transición de banda **adyacente** es **doble vara** y viola R-INV-2B. La frontera reparte el orden en clases con realización fija:

  | Caso | Clase | Realización |
  |---|---|---|
  | secuencial 1→1; paralelo a la misma altura (R-INV-2A); AND-join síncrono **total** | **implícito** | orden declarado (bandas con cardinalidad); OPL `en esa secuencia` / `paralelo`; sin rayo (R-INV-2/2A/2B/2C) |
  | reactivo por evento (sistemas reactivos, `SSOT-metod LF-06`) | **explícito por enlace de evento, no rayo** | un enlace de evento por subproceso; sin verticalidad temporal forzada; tratarlo como invocación es error de categoría |
  | autoinvocación/bucle; salto fuera de orden; invocación cross-OPD | **explícito por rayo (IV1/IV2)** | única realización honesta; el rayo sobrevive (R-INV-1) |
  | demora intra-secuencia | **disuelto** | no existe «demora sobre invocación implícita»: la duración es propiedad del proceso (`SSOT-metod`), y la espera entre bandas se reifica como subproceso *Esperar* implícito; `después de <demora>` solo cuelga de un rayo ya-explícito |
  | join parcial o disyuntivo (OR) | **fuera del orden simple** | es abanico/decisión con realización explícita propia; el campo de bandas no lo cubre y NO DEBE forzarse |

  Las ocho clases numeradas (secuencial, paralelo, AND-join total, reactivo-evento, bucle, demora, salto fuera de orden, cross-OPD) cierran la frontera; el join parcial/OR queda deliberadamente fuera de alcance. El orden es atributo de la descomposición, no relación entre pares ni coordenada (mejora R-IDP-0A).

### 5.5 Enlaces estructurales fundamentales

- **R-STRF-4** (`V-57`): las partes de una agregación PUEDEN ser consumidas, afectadas o producidas independientemente sin que el todo lo sea.
- **R-HER-8**: los enlaces heredados NO DEBEN dibujarse como enlaces explícitos duplicados en el OPD salvo que la herramienta los marque como vista derivada no nuclear.

### 5.7 Enlaces de excepción

> [endurecimiento] Más estricto que ISO 19450; la brecha se declara en `docs/conformidad.md`.

- **R-EXC-1A** (`SSOT-visual §4.4`): el proceso de manejo de excepción DEBE ser ambiental.

## 6. Modificadores y combinaciones

### 6.4 Otras combinaciones de modificadores

> [endurecimiento] Más estricto que ISO 19450; la brecha se declara en `docs/conformidad.md`.

| Combinación | Estado canónico | Notas |
|---|---|---|
| `c` + `e` sobre el mismo enlace | NO definido en SSOT | No aparece en gramática OPL ni en geometría visual. Tratar como no canonizado |
| Modificador sobre enlace escindido (TS4/TS5) | **PROHIBIDO** (`V-41`, `V-110`) | "Saltar un subproceso de una escisión distorsionaría la semántica del efecto" (`SSOT-metod §7.4`) |

### 6.6 Matriz de precedencia transformadora (recomposición)

- **R-PREC-3**: Resultado + Consumo o Consumo + Resultado sobre el mismo objeto DEBE reportarse como conflicto si no hay continuidad de identidad y estados trazables.
- **R-PREC-4**: la herramienta NO DEBE colapsar automáticamente la tensión matriz/prosa de `V-43` sin evidencia de continuidad.

- Fragmento retirado de R-PREC-2 (canon reglas §6.6) [endurecimiento]: Resultado + Consumo sobre el mismo objeto se recompone como Efecto solo si hay continuidad de identidad y estados trazables.

### 6.7 Multiplicidad y cardinalidad

- Fragmento retirado del párrafo de rangos (canon R-MULT-4) [extensión]: intervalos con inclusión/exclusión `[a..b]`, `(a..b]`, `[a..b)`, `(a..b)`, listas de intervalos y asterisco `*` como extremo abierto.
- Fragmento retirado del párrafo de restricciones (canon reglas §6.7): los glifos Unicode `≠`, `≤`, `≥`, `∈` DEBEN normalizarse a la forma ASCII o declararse como extensión.

### 6.8 Probabilidad

- Fragmento retirado del párrafo de §6.8 (canon reglas §6.8) [extensión]: `Pr=p` anota cada enlace de un abanico **declarado probabilístico**; el default uniforme `1/n` es regla de simulación, no obligación de modelado; un abanico ordinario de alternativas no exige anotar probabilidades (ver R-FAN-PROB-1, caso C).

## 7. Abanicos lógicos (XOR / OR)

### 7.4 Combinación con modificadores

- Fragmento retirado de R-FAN-PROB-1, caso (C) (canon reglas §7.4 conserva la definición ISO) [extensión]: **(C) Abanico declarado probabilístico sin pesos conocidos**: el modelador DEBE declarar explícitamente el estado «probabilístico sin pesos» — ni número inventado (barro cuantitativo, prohibido por la disciplina hecho↔supuesto) ni default uniforme silencioso; al simular se asume `1/n` (regla de simulación, §6.8), pero el modelo registra que los pesos quedan pendientes.

### 7.6 m-de-f combinatorial (`SSOT-metod §10.5`)

> [extensión] Capacidad de OpForja sin contraparte en ISO 19450; no altera el canon.

- **R-FAN-M-1** (`SSOT-metod §10.5`): para fan-size `f > 2`, el modelador PUEDE generalizar a "exactamente m de f" en XOR combinatorial.
- **R-FAN-M-2**: para fan-size `f > 2`, el modelador PUEDE generalizar a "al menos m de f" en OR combinatorial.
- **R-FAN-M-3**: el valor `m` DEBE cumplir `m < f`.
- **R-FAN-M-4**: el valor `m` DEBE anotarse junto al arco.

## 8. Refinamiento

### 8.1 Mecanismos canónicos

> Corregida v2.0: ISO §14.2.1 define exactamente tres pares (canon reglas §8.1). La referencia a sub-modelo es una operación de producto, no un cuarto par de refinamiento.

> [extensión] Capacidad de OpForja sin contraparte en ISO 19450; no altera el canon.

| Par | Refinamiento | Abstracción | Ámbito |
|---|---|---|---|
| Composición inter-modelo | Referencia a sub-modelo | Desconexión | cross-model |

### 8.3 Refinamiento no trivial (`SSOT-metod §7.1`)

> [endurecimiento] Más estricto que ISO 19450; la brecha se declara en `docs/conformidad.md`.

- **R-REF-NTRIV-1**: un proceso descompuesto DEBE contener al menos **2 subprocesos** para cerrar como refinamiento canónico.
- **R-REF-NTRIV-2**: un despliegue DEBE revelar al menos **2 refinadores** para cerrar como refinamiento canónico.
- **R-REF-NTRIV-3**: un refinamiento con un solo elemento hijo NO DEBE cerrarse ni exportarse como refinamiento canónico; solo PUEDE persistir como placeholder de edición tipificado y DEBE eliminarse, postergarse o ampliarse antes del cierre.

### 8.4 Enlaces escindidos

- **R-ESC-1A** (extensión local): `SSOT-metod §7.4` describe la escisión como *la* resolución de la subespecificación de efecto al descomponer, pero no afirma exclusividad. *Endurecimiento de implementación*: la escisión DEBE ser el único mecanismo canónico admitido por `deep-opm-pro` para esa resolución. La cláusula de unicidad es decisión de producto, no texto de `SSOT-metod §7.4`.

- Fragmento retirado de R-ESCIND-0 (canon reglas §8.4): un fragmento escindido NUNCA se origina por parseo de OPL aislado: solo se produce por la operación de descomposición y persiste con metadato de procedencia.

### 8.5 Distribución de enlaces al descomponer

> [extensión] ISO §14.2.2.4.1 sólo da semántica distributiva a los enlaces procedimentales; la fila siguiente es convención de OpForja.

| Tipo de enlace | Contorno exterior del proceso padre | Distribución |
|---|---|---|
| Estructural | NO se distribuye (`V-105`) | Permanece asociado al contenedor |

> [desviación declarada] Del valor por defecto normativo (ISO §14.2.2.4.1: consumo y resultado se anclan inicialmente o por defecto al primer subproceso; canon R-DIST-3). ISO §14.2.2.4.1 NOTA 2 admite que la herramienta fije valores por defecto que el modelador modifica: OpForja ancla por defecto el resultado al ÚLTIMO subproceso (decisión del dueño). Brecha declarada en `docs/conformidad.md`.

| Tipo de enlace | Contorno exterior del proceso padre | Distribución |
|---|---|---|
| Resultado | **PROHIBIDO** (`V-37`, `V-103`) | Migra al **último** subproceso |

- Regla de producto de AP-06 (acción; canon reglas §11 conserva la construcción inválida y la corrección ISO) [desviación declarada, ISO §14.2.2.4.1 y NOTA 2]: Reasignar consumo al primer subproceso y resultado al último subproceso.

### 8.6 Contenedor y elementos externos

- **R-HIJO-2** (`V-80`): las cosas conectadas en el OPD padre DEBEN aparecer en el OPD hijo como elementos externos cuando la regla de copia correspondiente lo exija.
- **R-HIJO-3** (`V-81`): en descomposición de proceso, el OPD hijo DEBE copiar como externos todas las cosas conectadas al padre por cualquier enlace.
- **R-HIJO-4** (`V-82`): en despliegue de objeto o proceso, el OPD hijo DEBE copiar solo los hijos estructurales directos.
- **R-HIJO-5** (`V-83`): un elemento externo NO DEBE refinarse desde el OPD hijo donde aparece como externo.
- **R-HIJO-6** (`V-84`): los objetos internos creados dentro de una descomposición y sin apariencia en el padre DEBEN eliminarse en cascada cuando se elimina el proceso padre.

### 8.7 Identidad persistente vs etiqueta visible (`V-246`–`V-250`)

- **R-IDP-0** (`V-246`–`V-250`): orden temporal, orden de navegación e identidad persistente DEBEN mantenerse como canales separados.
- **R-IDP-0A**: el orden temporal es un atributo **declarado** de la descomposición (presentación del preorden por bandas con cardinalidad, R-INV-2D); la coordenada vertical de los subprocesos lo **realiza**, no es su fuente. Se rige por R-INV-2/R-INV-2A.
- **R-IDP-0B**: el orden de navegación se deriva de la posición en el árbol de OPDs y NO DEBE usarse como identidad persistente.
- **R-IDP-0C**: la identidad persistente DEBE ser un identificador estable recuperable en serialización y usado como ancla de referencia cruzada externa.

- **R-IDP-1** (`V-247`): la etiqueta `SDx.y` DEBE tratarse como proyección humana del orden de navegación, NO como identidad persistente.
- **R-IDP-1A**: la etiqueta `SDx.y` PUEDE mutar bajo reordenamiento o inserción de nodos.

- **R-IDP-2** (`V-248`): toda implementación conforme DEBE asignar a cada OPD un identificador persistente recuperable en la serialización, estable bajo renumeración.

- **R-IDP-3** (`V-249`): toda referencia externa al modelo que cite un OPD concreto (documentos, trazabilidad, tests) DEBE usar el identificador persistente, NO `SDx.y`.

### 8.8 Restricciones de refinamiento

- **R-REF-2** (`V-101`, `V-102`): NO se puede crear instancia visual entre tipos diferentes (objeto no es instancia visual de proceso).
- **R-REF-3** (`V-113`): solo OPDs jerárquicos **hoja** son eliminables directamente del árbol jerárquico.

### 8.9 Cambio de rol entre niveles

> [endurecimiento] Más estricto que ISO 19450; la brecha se declara en `docs/conformidad.md`.

- **R-ROL-2** (`V-112`): el cambio de rol aplica solo a descomposición, no a despliegue.

### 8.10 SD, árboles, vistas y OPL completo

> [extensión] Capacidad de OpForja sin contraparte en ISO 19450; no altera el canon.

- **R-CAN-BOCETO-1** (extensión local de herramienta): un **Boceto** es un
  OPD no raíz con `padreId = null`, todavía sin un slot de refinamiento que lo
  sitúe en el árbol. Es estado de organización del componente, no primitiva OPM,
  especie documental ni error de integridad. Sus hechos locales DEBEN conservar
  bimodalidad OPD↔OPL.
- **R-CAN-BOCETO-2**: en **régimen Modelo**, la presencia de uno o más Bocetos
  DEBE bloquear el export canónico `canon-diagrama` y `canon-documento` con
  causa y nombres recuperables. Graduar con pendientes PUEDE dejar Bocetos en
  un Modelo, pero NO satisface este gate ni los integra implícitamente.
- **R-CAN-BOCETO-3**: en **régimen Apunte**, el perfil de export PUEDE incluir
  Bocetos si lleva una **marca explícita** de bosquejo y no afirma cierre de
  Modelo. La condición DEBE aparecer como observación y NO DEBE bloquear la
  edición; la integridad estructural y la emisión OPL de los hechos siguen
  siendo obligatorias.
- **R-CAN-BOCETO-4**: Integrar como descomposición o despliegue y Devolver a
  Bocetos DEBEN cambiar solo la pertenencia del OPD al árbol, preservando
  identidad y hechos. Graduar a Modelo y Reabrir en Taller DEBEN cambiar solo
  el régimen documental. Integrar NO gradúa; Graduar NO integra; ninguna de
  estas operaciones, ni exportar o marcar Biblioteca, certifica validación
  humana.
- **R-OPL-TOTAL-3**: en modelos compuestos, cada modelo individual conserva OPL local autocontenido y la composición entre modelos exige referencias explícitas.
- **R-VIEW-2**: una vista NO DEBE crear hechos OPM nuevos por el solo hecho de materializar apariencias.
- **R-VIEW-3**: una vista DEBE tipificarse como jerárquica, vista anclada o vista ad hoc.
- **R-BRING-1** (`SSOT-iso §Gestión de contexto`): `bring connected things`, `bring links between selected entities` y operaciones equivalentes son operadores derivados de contexto; NO son mecanismos ontológicos de refinamiento.

### 8.11 Descomposición y recomposición como operaciones de herramienta

- **R-OPD-OP-3**: un OPD semidescompuesto es transitorio; NO DEBE persistirse como estado canónico final salvo recuperación de edición declarada.
- **R-OPD-OP-4**: toda migración de enlaces durante descomposición/recomposición DEBE preservar identidad de hechos o declarar eliminación/creación explícita.
- **R-OPD-OP-5**: la herramienta PUEDE rastrear refinadores y ajustar automáticamente símbolo gráfico y OPL; si lo hace, DEBE conservar trazabilidad de cada ajuste automático.
- **R-OPD-OP-6**: la herramienta DEBE advertir si se intenta incluir un objeto como refinador en más de un contexto cuando ello pueda crear ambigüedad de pertenencia.
- **R-OPD-OP-7**: la herramienta PUEDE establecer sintaxis por defecto para nombres de refinadores ambiguos, pero DEBE hacer la resolución trazable.

## 9. Relación OPD↔OPL (bisimetría)

### 9.2 Tabla de bisimetría

- Fragmento retirado de R-BI-TAB-1 (canon reglas §9.2): la tabla opera como gate mínimo de roundtrip OPD<->OPL del producto.

### 9.3 Casos donde la bisimetría se rompe / requiere convención

- **R-BR-2** (`SSOT-metod §10.3`): eventos OR y condiciones AND sobre el mismo proceso DEBEN conservarse como enlaces separados; si la combinación no queda expresada literalmente en OPL, DEBE persistirse como semántica de control tipificada.
- **R-BR-3** (`V-135`): tokens transitorios de flujo durante simulación NO pertenecen al canon-diagrama estático ni a OPL nuclear.
- **R-BR-4** (`V-204`): notas y sticky notes son contenido meta del autor; NO emiten OPL nuclear.
- **R-BR-5**: aliases `{alias}` y unidades `[u]` en rótulos pertenecen a capa computacional; NO DEBEN confundirse con OPL nuclear.

### 9.5 Importancia proporcional

- **R-IMP-2**: una cosa que aparece en SD DEBE tratarse como más importante que una cosa que aparece solo en OPDs descendientes.

## 10. Escenarios OPD<->OPL — reglas de edición, importación y bloqueo

- **R-ESC-OP-1**: toda edición OPD válida DEBE proyectarse a OPL-ES canónico o metadato tipificado.
- **R-ESC-OP-2**: toda edición OPL-ES válida DEBE proyectarse a OPD canónico o metadato tipificado.
- **R-ESC-OP-3**: toda edición ambigua DEBE bloquearse hasta resolver identidad, firma o alcance.
- **R-ESC-OP-4**: toda edición prohibida DEBE rechazarse o persistirse únicamente como error estructural recuperable.

### 10.1 Principio de hecho único

R-BI-0 sigue en canon reglas §10.1.

- **R-BI-0A**: una edición OPD válida DEBE modificar el hecho OPM canónico y regenerar OPL.
- **R-BI-0B**: una edición OPL válida DEBE modificar el hecho OPM canónico y regenerar OPD.

- **R-BI-1**: el kernel del modelo es la autoridad de identidad. OPD y OPL NO DEBEN divergir silenciosamente.

- **R-BI-2**: si una oración OPL-ES parseada no puede mapearse a una firma OPD canónica, el parser DEBE rechazarla o clasificarla como no soportada; NO DEBE crear un grafo plausible.

- **R-BI-3**: si una forma OPD visible no emite OPL nuclear, DEBE estar clasificada como UI/vista/meta/estilo/export y NO como hecho OPM.

- **R-BI-4**: todo roundtrip DEBE preservar el hecho, no necesariamente la superficie literal. Variantes de superficie PUEDEN mapear al mismo proceso solo si el nombre canónico interno así lo declara.

### 10.2 Política de importación OPL

Al editar o importar OPL-ES:

- **R-IMPORT-1**: toda importación OPL-ES DEBE parsearse contra `SSOT-opl Apéndice A` antes de tocar el modelo.
- **R-IMPORT-2**: cada nombre DEBE resolverse a una cosa existente o crear una cosa nueva solo si la tipografía OPL la desambigua: **negrita** objeto, *cursiva* proceso, `mono` estado.
- **R-IMPORT-3**: si una oración referencia estado inexistente, el importador PUEDE crear el estado solo si el objeto propietario está inequívocamente identificado.
- **R-IMPORT-4**: si una oración crea un enlace cuya firma contradice tipos existentes, el importador DEBE rechazarla.
- **R-IMPORT-5**: si una oración es canónica pero la app aún no soporta su familia, el importador DEBE reportar `unsupported-canonical` y NO DEBE degradarla.
- **R-IMPORT-6**: si una oración es no canonizada, el importador DEBE reportar `non-canonical` y NO DEBE convertirla en extensión silenciosa.
- **R-IMPORT-7**: si una oración cambia el tipo ontológico de una cosa existente, el importador DEBE bloquear y pedir decisión explícita: renombrar, crear cosa nueva o corregir OPL.
- **R-IMPORT-8**: si una oración elimina información visual no expresable en OPL, el importador DEBE preservar metadato de layout, vista o estilo salvo normalización explícita del usuario.

### 10.3 Política de edición OPD

Al editar OPD:

- **R-EDIT-1**: la herramienta DEBE validar firma antes de crear enlace.
- **R-EDIT-2**: la herramienta DEBE validar extremo de estado antes de anclar.
- **R-EDIT-3**: si se cambia tipo de cosa, la herramienta DEBE recalcular perseverancia y revisar todos los enlaces afectados.
- **R-EDIT-4**: si se mueve una cosa entre OPDs, la herramienta DEBE preservar identidad persistente y emitir solo cambios de apariencia.
- **R-EDIT-5**: si se crea una vista o se usa `Bring`, la herramienta NO DEBE crear nuevos hechos semánticos salvo enlaces o cosas explícitamente nuevos.
- **R-EDIT-6**: si un cambio visual solo afecta estilo autoral, NO DEBE cambiar OPL nuclear.
- **R-EDIT-7**: si un cambio visual afecta contorno, sombra, forma, marker, triángulo o estado, DEBE cambiar el hecho y su OPL.
- **R-EDIT-8**: si la acción genera una combinación prohibida, DEBE bloquearse antes de persistir o marcarse como error estructural recuperable.

## 11. Anti-patrones — reglas de prohibición

- **R-AP-0**: una UI puede exponer construcciones laxas solo como estado de edición; NO DEBE persistirlas como canónicas.
- **R-AP-0A**: todo anti-patrón DEBE citar regla SSOT primaria o silencio SSOT que justifica bloqueo/no canonicidad.
- **R-AP-0B**: todo anti-patrón DEBE declarar sustituto canónico o política de rechazo.
- **R-AP-0C**: un anti-patrón que cite silencio SSOT (zona no canonizada) NO DEBE redactarse con verbo de prohibición ontológica; DEBE aplicar el régimen no-canonizado de R-APP-5 (clasificar, no emitir como nuclear, permitir como extensión declarada). Solo los anti-patrones que citen contradicción SSOT explícita o error de categoría DEBEN ordenar bloqueo.

### 11.1 Tabla maestra de anti-patrones

> Corregida v2.0: AP-11 bloquea construcciones válidas en ISO (§10.4.2.5, §10.4.2.7; canon reglas §4.10): queda como [endurecimiento] de producto. AP-14, AP-22, AP-25 y AP-26 son heurísticas de método.

| # | Construcción no-canónica | Regla de rechazo | Acción canónica |
|---|---|---|---|
| AP-11 | **Bidireccional o recíproco con estado solo en destino** | DEBE bloquearse por `V-30`. | Usar unidireccional con estado en destino o agregar estado en origen. |
| AP-13 | **Refinamiento con un solo subproceso o refinador** | DEBE bloquearse en cierre/export canónico; PUEDE persistir solo como placeholder de edición tipificado. | Eliminar, postergar o ampliar a ≥ 2 hijos. |
| AP-14 | **Duplicar estados para evitar inicial+final simultáneo** | DEBE bloquearse como sinónimo falso. | Marcar el estado único como inicial y final. |
| AP-15 | **Instancia visual entre tipos distintos** | DEBE bloquearse por `V-102`. | Usar apariencia del mismo tipo o clasificación-instanciación lógica. |
| AP-17 | **`SDx.y` como identificador estable externo** | DEBE bloquearse por `V-247`–`V-249`. | Usar identificador persistente. |
| AP-18 | **Modificar referencia externa en modelo consumidor** | DEBE bloquearse por `V-184`. | Modificar en modelo propietario o crear cosa distinta. |
| AP-19 | **Sombra decorativa en cosa informacional** | DEBE suprimirse en canon-diagrama por `V-124`. | Reservar sombra a esencia física. |
| AP-22 | **Sinónimos múltiples para la misma cosa** | DEBE reportarse por violar unicidad nominal. | Elegir nombre canónico y mapear variantes de superficie. |
| AP-23 | **Truncamiento silencioso de rótulo en export canónico** | DEBE bloquearse por `V-194` y `V-212`. | Ajustar bounding box, layout o tamaño antes de exportar. |
| AP-24 | **Reutilizar canales semánticos para UI/validación** | DEBE bloquearse por `V-198`, `V-203`, `V-220` y `V-224`. | Usar canal visual reservado a UI. |
| AP-25 | **Proceso explícito para soporte/mantenimiento sin esfuerzo sostenido relevante** | DEBE reportarse como mala clasificación metodológica. | Usar enlace estructural etiquetado. |
| AP-26 | **Objeto transiente creado y consumido sin observación intermedia** | DEBE reportarse como objeto artificial. | Usar enlace de invocación. |
| AP-27 | **Evento a subproceso intermedio sin justificar omisión previa** | DEBE bloquearse si subprocesos previos tienen efectos obligatorios no omitibles; DEBE advertirse si los previos son opcionales y la omisión está declarada. | Conectar al primer subproceso o declarar omisión válida de previos. |
| AP-28 | **`c` y `e` simultáneamente sobre el mismo enlace** | DEBE clasificarse como No canonizado (silencio SSOT, no contradicción): NO DEBE emitirse como OPL-ES nuclear; PUEDE persistir solo como extensión declarada o estado de edición (`R-AP-0`, `R-APP-5`). | Modelar control externo explícito. |
| AP-29 | **Enlaces heredados dibujados como explícitos** | DEBE bloquearse salvo vista derivada no nuclear. | Inferirlos por herencia desde generalización-especialización. |

### 11.2 Zonas no canonizadas (silencios de la SSOT)

- **R-ZNC-1**: una construcción que no aparece explícitamente prohibida ni canonizada por la SSOT DEBE clasificarse como no canonizada.
- **R-ZNC-2**: la herramienta NO DEBE inventar regla OPM nuclear para una zona no canonizada.

| Zona | Estado |
|---|---|
| Combinación `c + e` sobre el mismo enlace | No definida. Tratar como NO canonizada (AP-28). |

## 12. Aplicación a `deep-opm-pro`

- **R-APP-0**: este canon DEBE contener reglas estables de conformidad, no inventarios fechados de implementación.
- **R-APP-1**: el estado vivo de implementación DEBE documentarse fuera de este canon, en `docs/HANDOFF.md`, `docs/roadmap/` o ledger de bugs según corresponda.
- **R-APP-2**: el estado de implementación de una regla DEBE clasificarse como `enforzado`, `parcial`, `no implementado` o `zona laxa pendiente`.
- **R-APP-3**: una regla parcialmente enforzada NO DEBE considerarse cerrada hasta cubrir UI, kernel, importación, generación OPL y exportación aplicables.
- **R-APP-4**: si la UI permite una construcción no canónica, la herramienta DEBE restringir por defecto, bloquear persistencia canónica o persistirla únicamente como error estructural recuperable.
- **R-APP-5**: cuando la SSOT calle, la UI DEBE clasificar la construcción como `No canonizado` o `extensión declarada`; NO DEBE presentarla como prohibición ontológica ni como OPM nuclear.
- **R-APP-6**: todo commit que modifique validación de canonicidad DEBE citar las reglas locales `R-*` afectadas y, si la regla deriva de SSOT, la regla primaria (`V-*`, sección OPL, ISO o metodología).
- **R-APP-7**: toda divergencia OPCloud -> SSOT DEBE resolverse a favor de la SSOT salvo justificación explícita registrada en `docs/auditorias/`.

## Anexos

### Anexo A — Checklist de cierre OPD<->OPL

Gates de producto de la lista de cierre (canon R-ANEXO-CHECK-1, canon reglas Anexo A, reúne los gates fundados en ISO).

| Gate | Regla obligatoria | Falla si | Severidad |
|---|---|---|---|
| Identidad | Cada cosa, estado, enlace y OPD DEBE tener identidad persistente separada de su etiqueta visible. | se usa `SDx.y` o nombre visible como único identificador externo | Alta |
| Parseo | Toda oración OPL aceptada DEBE reconstruir el mismo hecho. | el parser crea entidades plausibles ante ambigüedad | Alta |
| Vistas | Vistas, Bring, sub-modelos y requirement views DEBEN estar tipificados. | una vista se confunde con OPD jerárquico ordinario | Media |
| UI | Handles, overlays, grid, tutorial, validación y runtime DEBEN separarse del canon. | un canal UI reutiliza contorno, sombra, piruleta, triángulo o halo semántico | Alta |
| Export | Todo perfil de export DEBE declarar canon-diagrama/canon-documento y recursos. | captura raster o screenshot se toma como prueba de canonicidad | Media |
| Deuda | Toda zona no canonizada DEBE quedar registrada como extensión, bloqueo o deuda explícita. | se acepta silenciosamente una construcción sin soporte SSOT | Alta |

Severidad de producto de los gates del canon (columna retirada del canon reglas Anexo A): Firma Alta; Estado Alta; OPL Alta; Modificadores Alta; Refinamiento Alta; Distribución Alta.

### Anexo B — Desarrollo prescriptivo de cobertura `SSOT-visual`

Las filas (como definición o como referencia a spec-OPD) R-VIS-TRI-1, R-VIS-EST-1, R-VIS-EST-2, R-VIS-FAN-1, R-VIS-RUTA-1, R-VIS-MULT-1, R-VIS-HER-1, R-VIS-REF-1, R-VIS-CTRL-1, R-VIS-SD-1, R-VIS-NOM-1, R-VIS-MODELO-1, R-VIS-SUPR-1, R-VIS-CONSTRUCT-1, R-VIS-APP-1, R-VIS-ASYNC-1 y R-VIS-INZOOM-1 siguen en canon reglas, Anexo B.

> Corregida v2.0: R-VIS-HIJO-1 se lee junto con la distribución ISO (canon reglas §8.5): los habilitadores y el efecto básico en el contorno son distributivos; la regla sólo rige la presentación de OpForja. R-VIS-FAM-1: el «cuarto par» es operación de producto (canon reglas §8.1).

- **R-ANEXO-VIS-1**: las filas de este anexo SON reglas locales aplicables; NO son notas informativas.
- **R-ANEXO-VIS-2**: toda fila que cite una regla `V-*` DEBE conservar la misma fuerza normativa que `opm-visual-es.md`.
- **R-ANEXO-VIS-3**: cuando una regla `V-*` también aparezca en el cuerpo, este anexo DEBE leerse como precisión de cobertura y no como reemplazo.
- **R-ANEXO-VIS-4**: si una fila agrupa varias reglas `V-*`, cada obligación verificable DEBE quedar expresada como subregla local separada o como cláusula independiente testeable.

| Fuente visual | Regla local prescriptiva |
|---|---|
| §0, `V-0` | **R-VIS-EXP-1**: la gramática visual conforme DEBE definirse por lo que persiste en un export canónico declarado; lo visible solo en canvas editable DEBE clasificarse como UI o vista. |
| `V-0a` | **R-VIS-EXP-2**: toda herramienta conforme DEBE declarar al menos los perfiles `canon-diagrama` y `canon-documento`. |
| `V-0b` | **R-VIS-EXP-3**: todo elemento persistente en `canon-diagrama` DEBE estar cubierto por regla visual `V-*` o capítulo visual explícito. |
| `V-0c` | **R-VIS-EXP-4**: todo elemento que desaparece de `canon-diagrama` y `canon-documento` DEBE tratarse como UI transitoria y NO DEBE reutilizar canales semánticos sin distinción. |
| `V-0d` | **R-VIS-EXP-5**: todo elemento persistente solo en un perfil canónico DEBE declararse como atributo de perfil. |
| `V-0e` | **R-VIS-EXP-6**: una captura de pantalla de edición, navegación, modal o simulación pausada NO DEBE aceptarse como evidencia suficiente de canonicidad. |
| §0 | **R-VIS-CAPA-1**: la capa visual DEBE fijar símbolos, contornos, decoraciones, marcas gráficas, composición visual de enlaces/operadores/estados/refinamientos, precedencia, distribución, comportamiento entre OPDs, export, extensiones tipadas y composición inter-modelo. |
| §0 | **R-VIS-CAPA-2**: la capa visual NO DEBE redefinir semántica base, gramática OPL ni procedimiento metodológico; toda mención visual de esos planos DEBE remitir a la capa propietaria. |
| §0 | **R-VIS-CAPA-3**: la numeración `V-*` DEBE tratarse como estable por familia conceptual e historia editorial, no como orden lineal. |
| §0 | **R-VIS-CAPA-4**: `contorno`, `borde` y `línea` DEBEN interpretarse como traza perimetral o visible; solo variantes explícitas como discontinuo, doble, grueso o zigzag agregan semántica. |
| §1 | **R-VIS-PRIM-1**: el vocabulario visual nuclear DEBE limitarse a formas cerradas, contornos, sombreados, decoraciones de extremo y marcas textuales definidos por la SSOT visual. |
| `V-130` | **R-VIS-TRI-2**: todo triángulo auxiliar de edición que no persista en export DEBE distinguirse por tamaño, color UI reservado o ubicación fuera de la geometría semántica. |
| `V-192` | **R-VIS-AUX-1**: el supresor `...` de enlaces no materializados solo pertenece a la gramática auxiliar si persiste en `canon-diagrama`. |
| `V-193` | **R-VIS-AUX-2**: todo triángulo o indicador compactado de relación hacia cosa ausente DEBE quedar anclado geométricamente a la cosa visible correspondiente. |
| `V-74`, `V-75`, `V-76` | **R-VIS-HER-2**: la afiliación DEBE heredarse por cadena estructural; una especialización PUEDE sobrescribir participante heredado con especialización válida; los enlaces comunes DEBEN migrar al general cuando se crea un general desde especializaciones. |
| `V-45` | **R-VIS-DUR-1**: los valores de duración de proceso DEBEN mostrarse dentro de la elipse bajo el nombre y la unidad temporal con formato `{min, esperada, max}`. |
| `V-45` | **R-VIS-DUR-2**: la distribución de duración DEBE emitirse solo cuando el modelo la declara; si no existe distribución declarada, el export NO DEBE generar placeholder. |
| `V-48` | **R-VIS-REDIR-1**: toda cita legacy a `V-48` DEBE redirigirse a `V-4`; no existe regla visual independiente para estados fuera de objeto. |
| `V-49` | **R-VIS-CONS-1**: durante ejecución o animación, un objeto consumido DEBE desaparecer al inicio del proceso, no al final. |
| `V-91`, `V-92`, `V-93`, `V-94` | **R-VIS-HIJO-1**: en un OPD hijo, enlaces estructurales al contenedor DEBEN verse, enlaces procedimentales al contenedor NO DEBEN verse directamente, enlaces entre internos DEBEN verse, y enlaces que no tocan contenedor ni internos DEBEN ocultarse. |
| `V-106`, `V-107`, `V-109` | **R-VIS-DIST-1**: sin subprocesos, un enlace puede mostrarse al contenedor solo como respaldo temporal; la distribución y restricciones de frontera aplican solo a descomposición, no a despliegue. |
| `V-117`, `V-118`, `V-119` | **R-VIS-SEMI-1**: el semi-plegado DEBE ser por refinador, su indicador numérico DEBE contar refinadores ocultos, y su estado DEBE ser local por apariencia/OPD. |
| `V-125`, `V-127` | **R-VIS-SOMB-1**: un contenedor refinado de cosa física DEBE preservar fisicidad; reforzadores de canvas para fisicidad NO DEBEN persistir en `canon-diagrama`. |
| `V-121` | **R-VIS-LEX-1**: el nombre de proceso DEBE heredar su política léxica desde la capa textual activa; la capa visual NO DEBE introducir política paralela. |
| `V-53`, `V-132` | **R-VIS-RUN-1**: el proceso activo DEBE usar una marca reservada distinta del contorno grueso de refinamiento; si ambos usan refuerzo de contorno, DEBEN diferenciar color, halo o distintivo auxiliar. |
| `V-133` | **R-VIS-RUN-2**: el glifo por defecto para estado actual runtime es pin/gota externa anclada al borde; un glifo alternativo DEBE preservar separación visual respecto de inicial/final/default/`Current`. |
| `V-136` | **R-VIS-RUN-3A**: tokens runtime DEBEN omitirse del `canon-diagrama` salvo snapshot declarado. |
| `V-137` | **R-VIS-RUN-3B**: estados operacionales no activos DEBEN usar marcas reservadas distintas de inicial/final/default/`Current`. |
| `V-138` | **R-VIS-RUN-3C**: un estado suspendido NO DEBE parecer inactivo en snapshot. |
| `V-140` | **R-VIS-RUN-3E**: el modo headless NO DEBE alterar la gramática visual estática. |
| `V-143`, `V-144`, `V-145`, `V-146` | **R-VIS-STEREO-1**: todo estereotipo DEBE declarar aplicabilidad; en canvas DEBE verse como `<<Nombre>>` o distintivo equivalente; en OPL PUEDE usar `«Nombre»`; su condición NO DEBE ocultarse en artefacto canónico. |
| `V-147`, `V-148`, `V-149`, `V-150`, `V-151` | **R-VIS-STEREO-2**: toda propiedad forzada por estereotipo DEBE ser recuperable; remover estereotipo NO DEBE dejar residuos ambiguos; estructura derivada DEBE ser trazable; el OPD exportado DEBE identificar visualmente la cosa estereotipada; sombra forzada por estereotipo DEBE interpretarse como fisicidad efectiva. |
| `V-152`, `V-153`, `V-154`, `V-155`, `V-156`, `V-157` | **R-VIS-REQ-1**: entidades derivadas por estereotipo DEBEN usar patrón reservado `<Rol> of <HostThing>` y ciclo de vida dependiente del host; `<<Requirement>>` DEBE ser objeto OPM estereotipado con atributos mínimos `Name`, `ID`, `Requirement Essence`, `Satisfaction` y `Description`; `Requirement Essence` NO DEBE confundirse con esencia física/informacional. |
| `V-159`, `V-160`, `V-161`, `V-162` | **R-VIS-COMP-1**: alias `{alias}` DEBEN ser únicos en alcance operativo declarado y distintos de alias decorativos; unidad `[u]` DEBE aparecer después del nombre; `[]` vacío solo PUEDE persistir si fue confirmado explícitamente. |
| `V-164`, `V-165` | **R-VIS-COMP-2**: un slot de valor PUEDE contener placeholder, escalar, cadena, disyunción, intervalo o multilínea; por defecto NO DEBE haber más de un slot primario por objeto. |
| `V-168`, `V-169`, `V-171`, `V-174` | **R-VIS-COMP-3**: aliases, slots, entradas tipadas y nombres reservados PUEDEN persistir como metadato computacional tipificado; el cuerpo de código NO pertenece al canvas nuclear; integraciones externas DEBEN expresarse por estereotipo, distintivo o metadato, no por clase gráfica nueva. |
| `V-176`, `V-177`, `V-178`, `V-179` | **R-VIS-SUB-1**: un modelo compuesto DEBE ser DAG de modelos individuales; cada sub-modelo conserva OPL autocontenida; padre e hijo DEBEN declarar simétricamente la referencia. |
| `V-180`, `V-181`, `V-182` | **R-VIS-SUB-2**: una vista de sub-modelo DEBE clasificarse como vista anclada, diferenciarse de OPD jerárquico/ad hoc en metadato, y PUEDE presentarse como solo lectura. |
| `V-185`, `V-186`, `V-187`, `V-188`, `V-189` | **R-VIS-SUB-3**: atenuación o distintivos cross-model DEBEN ser gramática de vista; una vista de sub-modelo PUEDE violar el proceso sistémico único solo si declara criterio de vista; export compuesto DEBE declarar sub-modelos no cargados, esquema de resolución y estado explícito de desconexión. |
| `V-197`, `V-199` | **R-VIS-LAYOUT-1**: el snap a grid DEBE ser transparente al modelo; el export DEBE autoajustar viewport para evitar símbolos huérfanos o recortados. |
| `V-200`, `V-201`, `V-205`, `V-206` | **R-VIS-MODO-1**: canvas DEBE distinguir modos estático-exportable, edición, navegación y gestión-modal; solo estático-exportable fundamenta conformidad; búsqueda/navegación y tutorial DEBEN usar canal reservado y desactivarse para canon. |
| `V-207`, `V-208`, `V-209`, `V-210`, `V-211` | **R-VIS-AUTOR-1**: estilado autoral PUEDE existir solo si no colisiona con gramática, simulación, validación ni UI; defaults DEBEN converger al esquema canónico; cosas de igual clase comparten base visual; rótulo DEBE mantener legibilidad y contraste. |
| `V-215`, `V-216`, `V-217` | **R-VIS-AUTOR-2**: tamaño y proporción DEBEN preservar legibilidad, contención y decoraciones; normalización léxica NO DEBE ser silenciosa; export canónico DEBE normalizar estilado autoral salvo perfil contrario declarado. |
| `V-219`, `V-221`, `V-222`, `V-223` | **R-VIS-VAL-1**: por defecto el OPD estático DEBE quedar limpio de validación persistente; marcadores de edición inválida NO pertenecen al canon; unicidad nominal DEBE resolverse explícitamente; metodología y sugerencias son vistas derivadas. |
| `V-226`, `V-227` | **R-VIS-EXPORT-1A**: todo perfil de export DEBE declarar default y `canon-diagrama` DEBE preservar gramática visible sin chrome. |
| `V-230`, `V-231` | **R-VIS-EXPORT-1B**: listados textuales cromáticos y export parcial DEBEN declararse como perfil o modo de export, no como evidencia implícita de canonicidad. |
| `V-232`, `V-233` | **R-VIS-EXPORT-1C**: anexos y rasterización DEBEN conservar trazabilidad al hecho OPM y NO DEBEN reemplazar el perfil canónico si este es requerido. |
| `V-234` | **R-VIS-EXPORT-1D**: el viewport exportado DEBE evitar recorte de símbolos, rótulos y decoraciones semánticas. |
| `V-235` | **R-VIS-EXPORT-1E**: overlays de export DEBEN declararse y NO DEBEN ocluir semántica OPM. |
| `V-241`, `V-242`, `V-243` | **R-VIS-FAM-1**: toda categoría adicional de enlace DEBE declararse como extensión; `sub-model` DEBE tratarse como cuarto par canónico de refinamiento/abstracción; Bring y equivalentes DEBEN tratarse como operadores derivados, no refinamiento ontológico. |
| `V-252`, `V-253`, `V-256` | **R-VIS-XMODEL-1**: toda cosa referenciable cross-model DEBE exponer URI/handle persistente; marcas cross-model DEBEN ser vista, no gramática nuclear; ciclo de carga DEBE ser propiedad de la referencia. |
| `V-257` | **R-VIS-BRING-1A**: una operación auxiliar inter-OPD DEBE materializar apariencias o enlaces existentes sin crear semántica nueva. |
| `V-258` | **R-VIS-BRING-1B**: `Bring connected things` DEBE filtrar por familia y conectividad declaradas. |
| `V-259` | **R-VIS-BRING-1C**: el resultado canónico de una operación Bring DEBE ser indistinguible de un OPD manual equivalente. |
| `V-260` | **R-VIS-BRING-1D**: `Bring links between selected things` DEBE materializar solo enlaces existentes entre cosas seleccionadas. |
| `V-261` | **R-VIS-BRING-1E**: supresores `...` PUEDEN quedar solo si el perfil los declara como gramática auxiliar. |
| `V-262` | **R-VIS-BRING-1F**: OPDs derivados por Bring DEBEN clasificarse como vista anclada o ad hoc. |
| `V-263` | **R-VIS-BRING-1G**: toda operación Bring DEBE ser reversible o acotada por alcance declarado. |

### Anexo C — Extensión categorial de opforja (linealidad, equivalencia funcional, composición)

- **R-ANEXO-CAT-0**: este anexo declara reglas de la CAPA OPFORJA — extensiones formales sobre la base ISO 19450 que operacionalizan el **eje horizontal** de OPM (composición, equivalencia, linealidad). NO modifican ni reemplazan `opm-es`/`opd-es`/`opl-es`. La lectura categorial (teoría de categorías como semántica denotacional verificable *bajo* la superficie) NUNCA se expone al modelador (`metodologia-forja-es.md §0.2-0.3`); su procedencia formal es el corpus ICAS-BoK (`urn:fxsl:kb:icas-sintesis` y familia). Cada regla de este anexo DEBE ser ejecutable por una **ley o checker verificable** en el modelador; la identificación concreta de cada gate (archivo y símbolo) vive en el **registro de conformidad** de la herramienta (`R-APP-1`/`R-CONF-7`), no en este canon (`R-APP-0`).

**C.1 — Linealidad (recurso consumible no clonable)**

- **R-CAT-LIN-1**: un objeto PUEDE designarse `lineal` cuando representa un recurso que se consume y no se duplica (lectura: categoría monoidal no-cartesiana, `urn:fxsl:kb:icas-composicion-estructura`). Es una dimensión designable adicional a esencia y afiliación; NO es designación ISO 19450 y NO DEBE alterar la gramática visual ni OPL base.
- **R-CAT-LIN-2**: un objeto `lineal` consumido por dos o más procesos sin ruta exclusiva (XOR) que los separe DEBE señalarse como conflicto de linealidad. Severidad: mejora metodológica (NO bloqueo estructural ISO). DEBE existir ley verificable que lo realice (gate identificado en el registro de conformidad).

**C.2 — Equivalencia observacional relativa por firma de frontera**

- **R-CAT-EQ-1**: dos realizaciones con la misma FIRMA DE FRONTERA —roles netos `entidad|tipoEnlace|rol`— son equivalentes **respecto de esos observables**. La igualdad es condición necesaria de sustituibilidad en ese contorno, no prueba identidad, bisimulación, equivalencia categorial ni igualdad de efectos no modelados.
- **R-CAT-EQ-2**: opforja PUEDE verificar igualdad de firma entre realizaciones hermanas (gate identificado en el registro de conformidad). Si difieren roles netos, la equivalencia observacional de frontera NO aplica. Si coinciden, el resultado DEBE rotular su alcance: no autoriza sustituibilidad total sin verificar estados, protocolos, errores, timing y demás efectos relevantes. Severidad: mejora metodológica.
- **R-CAT-EQ-3**: verticalmente, toda descomposición DEBE preservar la firma de frontera de su proceso abstracto. La preservación es necesaria para realizar la misma función visible, pero no suficiente para equivalencia conductual. Violación: checker navegable de preservación de frontera (pasivo; gate identificado en el registro de conformidad). Severidad: mejora metodológica.

**C.3 — Composición por interfaz compartida**

- **R-CAT-COMP-1**: dos modelos PUEDEN componerse identificando entidades de interfaz compartida. Un pushout/structured cospan es una formalización candidata y exige propiedad universal; los checks operativos siguientes no la demuestran por sí solos. La identificación por defecto se sugiere por nombre normalizado + mismo tipo; la identidad por id solo vale si el nombre también coincide.
- **R-CAT-COMP-2**: la composición NO DEBE duplicar la entidad compartida —ni en el conjunto de entidades ni en las apariencias de ningún OPD— ni dejar referencias colgantes (enlaces a padre, refinamientos, abanicos). DEBE ser asociativa módulo namespacing de ids y NO DEBE introducir avisos de error que no estuvieran en los modelos fuente. DEBEN existir leyes verificables que realicen estas cuatro propiedades (no-duplicación, sin-referencias-colgantes, asociatividad, buen-tipado; gates identificados en el registro de conformidad).
- **R-CAT-COMP-3**: la composición es no-bloqueante y reversible (undoable); un conflicto de linealidad resultante (R-CAT-LIN-2) DEBE advertirse al operador en el resultado, NO impedir la operación.

## Notas de procedencia (canon v1.x)

Fin del documento. Mantener sincronizado con la SSOT KORA `v3.0.0` y siguientes.
