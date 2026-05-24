# Reglas OPM estrictas — Canon prescriptivo OPD/OPL

> Documento canónico destilado de la SSOT autoritativa del corpus OPM-ES KORA v3.0.0.
> Audiencia: arquitectos OPM, mantenedores del modelador `deep-opm-pro` e instancias futuras del mismo.
> Última actualización del corpus referenciado: KORA v3.0.0 (manifiestos `urn:fxsl:kb:opm-es`, `urn:fxsl:kb:opl-es`, `urn:fxsl:kb:opd-es`, `urn:fxsl:kb:manual-metodologico-opm-es`).
> Estado de este documento: canon prescriptivo. Cada entrada debe expresar una obligación, prohibición, condición, default, severidad o política ejecutable de herramienta.

---

## 1. Preámbulo

### 1.1 Autoridad

La fuente única de verdad para canonicidad OPM en este proyecto es el corpus `~/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`, compuesto por cuatro capas en orden de precedencia:

1. **`opm-iso-19450-es.md`** — capa semántica/ontológica. Define qué es una cosa, un enlace, un estado, qué relaciones existen y bajo qué restricciones.
2. **`opm-opl-es.md`** — capa textual canónica. Define la gramática OPL-ES (plantillas, EBNF, vocabulario de verbos).
3. **`opm-visual-es.md`** — capa gráfica canónica. Define geometría, contornos, decoraciones, distribución de enlaces, refinamiento visual y reglas `V-*`.
4. **`metodologia-opm-es.md`** — capa procedimental. Define el asistente de construcción, heurísticas, anti-patrones y criterios de validación.

**Regla de resolución de conflictos** (heredada de manual §1, *Orden de precedencia*):
- contradicción metodológica vs semántica → prevalece capa base (`opm-es`);
- contradicción de superficie textual vs OPL-ES → prevalece `opl-es`;
- contradicción de heurística procedimental vs gramática visual/topológica → prevalece `opd-es`;
- capacidades de herramienta NO redefinen semántica OPM por sí solas.

**OPCloud (la implementación comercial de referencia) NO es autoritativo.** El análisis del corpus OPCloud sirvió como insumo de v3.0.0, pero los hechos divergentes de OPCloud quedaron explícitamente arbitrados por las reglas `V-*` y se desplazaron a "afordance UI" o "extensión declarada" cuando no eran canónicas. La SSOT manda.

### 1.2 Convención de citas

Cada regla en este documento cita su fuente. Notación:
- `SSOT-iso §X` → sección de `opm-iso-19450-es.md`.
- `SSOT-opl §X` → sección/tabla de `opm-opl-es.md` (ej. `SSOT-opl §7.1 CT1`).
- `SSOT-visual V-N` → regla numerada de `opm-visual-es.md` (ej. `V-37`, `V-43`).
- `SSOT-metod §X` → sección de `metodologia-opm-es.md`.
- `glosario 3.N` → entrada `N` del glosario de SSOT-iso.

Cuando una regla aparece en varias capas se cita primero la propietaria, luego las realizaciones.

### 1.3 Contrato prescriptivo de exhaustividad

- **R-DOC-1**: este documento DEBE formular reglas, no explicación histórica ni tutorial.
- **R-DOC-2**: todo contenido conservado en este documento DEBE poder clasificarse como obligación, prohibición, condición, default, severidad, política de herramienta, matriz normativa o gate ejecutable.
- **R-DOC-3**: todo ejemplo conservado DEBE leerse como patrón permitido o patrón prohibido; si un ejemplo no decide comportamiento, DEBE eliminarse o moverse fuera de este canon.
- **R-DOC-4**: todo elemento prescriptivo de `opm-iso-19450-es.md`, `opm-opl-es.md`, `opm-visual-es.md` y `metodologia-opm-es.md` DEBE tener cobertura local trazable en este documento.
- **R-DOC-4A**: una remisión a la SSOT propietaria PUEDE conservar autoridad de redacción literal, EBNF completa o detalle de origen, pero NO DEBE sustituir la regla local aplicable.
- **R-DOC-4B**: índices exhaustivos, glosarios abreviados, tablas de navegación y resúmenes de cobertura NO DEBEN conservarse en este canon si duplican reglas ya definidas; DEBEN moverse fuera del canon salvo que operen como gate ejecutable.
- **R-DOC-4C**: reglas metodológicas sobre simulación, MBSE/PDR, integración virtual o ejecución computacional DEBEN vivir fuera de este canon salvo que alteren canonicidad OPD/OPL, validación de hechos o roundtrip OPD<->OPL.
- **R-DOC-5**: si una regla local diverge de la SSOT, la regla local queda inválida y DEBE abrirse corrección documental.
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

Este documento NO sustituye la SSOT fuente cuando una implementación necesita la EBNF completa o la redacción literal de una regla. Si aparece una divergencia entre este documento y la SSOT, se abre bug documental y se aplica la precedencia de §1.1.

Niveles de decisión usados en tablas:

| Estado | Significado operativo |
|---|---|
| **Canónico** | Se puede crear, serializar, importar y editar bidireccionalmente. |
| **Canónico condicionado** | Se puede usar solo si se cumplen las condiciones indicadas; si faltan, la herramienta debe pedir datos o advertir. |
| **No canonizado** | La SSOT no lo define. No se debe inventar como OPM nuclear; solo puede existir como extensión declarada. |
| **Prohibido** | Contradice una regla de la SSOT. La herramienta debe bloquearlo o reportarlo como error estructural. |
| **UI / vista** | Puede existir en pantalla, pero no es hecho OPM nuclear ni debe emitir OPL nuclear. |

Las **tablas son normativas**. La prosa fuera de tablas solo es válida si formula una regla aplicable.

### 1.4 Conformidad OPM

| Nivel de conformidad | Reglas obligatorias |
|---|---|
| Parcial simbólico | **R-CONF-1**: usar exclusivamente símbolos OPM y elementos con semántica asignada. |
| Completo | **R-CONF-2**: cumplir R-CONF-1 y aplicar consistentemente principios, contexto, refinamiento, dualidad OPD↔OPL y consistencia de hechos. |
| Herramienta | **R-CONF-3**: cumplir R-CONF-1/R-CONF-2, soportar validación de conformidad completa y soportar OPL-ES conforme a EBNF. |

- **R-CONF-4** (`SSOT-iso §Alcance y conformidad`): una implementación que persiste símbolos sin semántica OPM asignada NO es conforme como herramienta OPM.
- **R-CONF-5**: una implementación que permite construir modelos completos pero no valida refinamiento, contexto o consistencia OPD↔OPL solo puede declararse parcial, no herramienta conforme.
- **R-CONF-6**: una implementación que acepta OPL fuera de EBNF DEBE clasificarlo como legacy, extensión o error; NO DEBE presentarlo como OPL-ES canónico.

### 1.5 Principios de modelado como reglas

- **R-PRIN-1** (`SSOT-iso §Principios de modelado`): todo modelo DEBE declarar propósito de modelado antes de fijar alcance o detalle.
- **R-PRIN-2**: toda decisión de alcance DEBE derivarse de la función del sistema, el propósito de modelado y los interesados relevantes.
- **R-PRIN-3**: todo modelo OPM DEBE unificar función, estructura y comportamiento en el mismo formalismo; NO DEBE separar comportamiento en una notación externa si el hecho es OPM nuclear.
- **R-PRIN-4**: la función del sistema DEBE expresarse como proceso que entrega valor funcional a un beneficiario.
- **R-PRIN-5**: función y comportamiento DEBEN mantenerse distinguibles: la función expresa valor para el beneficiario; el comportamiento expresa cómo opera el sistema.
- **R-PRIN-6**: el límite del sistema DEBE declarar qué cosas son sistémicas y qué cosas son ambientales.
- **R-PRIN-7**: el entorno DEBE modelarse como cosas fuera del sistema que interactúan con él; NO DEBE mezclarse con cosas sistémicas sin contorno/afiliación correcta.
- **R-PRIN-8**: el nivel de detalle DEBE balancear claridad y completitud mediante jerarquía de OPDs; un OPD sobrecargado DEBE refinarse, simplificarse o convertirse en vista tipificada.
- **R-PRIN-9**: una vista para un interesado DEBE seguir siendo vista del mismo modelo, no copia divergente.

---

## 2. Ontología de entidades

### 2.1 Cosas (`thing`, glosario 3.76)

Una **cosa** es una de exactamente dos clases (`SSOT-iso §Cosas`):

| Clase | Glosario | Símbolo | Perseverancia (3.50) |
|---|---|---|---|
| Objeto | 3.39 | Rectángulo | persistente |
| Proceso | 3.58 | Elipse | transitoria |

**Reglas estrictas:**

- **R-COSA-1**: solo objetos y procesos son cosas. No existen "entidades", "nodos genéricos", "actores" ni "componentes" como clases ontológicas independientes (`SSOT-iso §Elementos de modelado`).
- **R-COSA-2**: la perseverancia se infiere del tipo y NO es atributo visual (`V-2`). Objetos = persistentes; procesos = transitorios. No hay otras opciones.
- **R-COSA-3**: el estado NO es una cosa. Es una situación de un objeto (`glosario 3.68`); su contención obligatoria vive en R-EST-1.

### 2.2 Objetos (3.39)

- **R-OBJ-1**: un objeto representa una cosa con existencia física o informacional potencial (`SSOT-iso §Objetos`).
- **R-OBJ-2**: un objeto puede ser **con estados** (`s ≥ 1`, glosario 3.66) o **sin estados** (`s = 0`, glosario 3.67). Un objeto sin estados **no puede ser afectado**: solo puede crearse (resultado) o consumirse (consumo) (`V-5`, `SSOT-iso §Estados`).
- **R-OBJ-3**: cada objeto tiene tres propiedades genéricas (`SSOT-iso §Propiedades genéricas`):
  - **perseverancia** = persistente (fija);
  - **esencia** ∈ {física, informacional}, default informacional (`V-1`);
  - **afiliación** ∈ {sistémica, ambiental}, default sistémica (`V-1`).
- **R-OBJ-4**: un objeto puede declarar tipo computacional ∈ {`boolean`, `string`, `integer`, `float`, `double`, `short`, `long`, `enumerated`} (`SSOT-iso §Cardinalidades`, `SSOT-opl §12.1`).
- **R-OBJ-5** (`SSOT-iso §Notas para implementadores`): una herramienta PUEDE derivar la esencia por defecto desde el perfil, preset de creación o tipo de sistema declarado; ese default NO DEBE sobrescribir esencia explícita de una cosa.
- **R-OBJ-6** (`SSOT-iso §Propiedades genéricas`): los atributos de objetos ambientales DEBEN ser ambientales.
- **R-OBJ-7**: los procesos ejecutados por cosas ambientales DEBEN modelarse como procesos ambientales.

### 2.3 Procesos (3.58)

- **R-PROC-1**: un proceso transforma uno o más objetos (`glosario 3.58`, `glosario 3.77`).
- **R-PROC-2**: todo proceso explícito no persistente DEBE transformar al menos un objeto mediante consumo, resultado o efecto (`V-115`). Habilitadores no satisfacen este requisito.
- **R-PROC-2A**: un proceso persistente solo satisface cierre canónico si declara objeto afectado e invariancia neta, atributo o condición mantenida conforme a R-PROC-5..7.
- **R-PROC-3**: un proceso tiene duración positiva (`SSOT-iso §Procesos`).
- **R-PROC-4**: **OPM no admite estados de proceso** ("iniciado", "en proceso", "terminado") (`SSOT-iso §Glosario, notas normativas`). Si se requiere modelar esas fases, se descompone en subprocesos *Iniciar*, *Procesar*, *Finalizar*.
- **R-PROC-5** (`SSOT-iso §Procesos`): un proceso persistente solo es canónico si la temporalidad, el esfuerzo sostenido o la condición mantenida forman parte del hecho de modelo.
- **R-PROC-6**: un proceso persistente NO DEBE usarse como escape genérico para eludir el cierre transformador o R-PROC-2A. Si no hay transformación ni condición sostenida relevante, DEBE reemplazarse por enlace estructural etiquetado, atributo o estado.
- **R-PROC-7**: cuando un proceso persistente conserva un objeto en el mismo estado, el modelo DEBE declarar explícitamente el objeto afectado y la invariancia neta (`estado_entrada = estado_salida`) o el atributo/condición mantenida.

### 2.4 Nombres válidos (OPL-ES)

- **R-NOM-OBJ-1** (`SSOT-opl §1.2`): un nombre de objeto DEBE ser sustantivo singular con palabras léxicas capitalizadas.
- **R-NOM-OBJ-2**: un objeto plural DEBE nombrarse con sufijo **Conjunto** para inanimados o **Grupo** para humanos.
- **R-NOM-PROC-1** (`SSOT-opl §1.1`, `§17.2`): un nombre de proceso DEBE comenzar con infinitivo `-ar` / `-er` / `-ir`, nominalización `-ción` o nominalización `-miento` justificada por dominio.
- **R-NOM-PROC-2**: un nombre de proceso canónico DEBE tener 2 a 4 palabras, salvo término de dominio registrado; si queda fuera de ese rango, la herramienta DEBE emitir advertencia metodológica.
- **R-NOM-PROC-3**: las palabras léxicas de nombres de cosa DEBEN capitalizarse; artículos y preposiciones breves PUEDEN quedar en minúscula.
- **R-NOM-EST-1** (`SSOT-opl §1.3`): un nombre de estado DEBE escribirse en minúsculas y usar forma pasiva o descriptiva.
- **R-NOM-ETIQ-1** (`SSOT-opl §A.3`): la regla operativa de etiqueta estructural es R-OPL-SE-1; esta sección solo conserva la restricción nominal mínima.

### 2.5 Qué NO puede ser una cosa

| No-cosa | Por qué |
|---|---|
| Un estado solo | Estado es situación de un objeto, no entidad autónoma (`V-4`). |
| Un enlace | Los enlaces son relaciones, no cosas (`SSOT-iso §Elementos`). |
| Un atributo "flotante" | Un atributo es siempre objeto que caracteriza otra cosa vía exhibición-caracterización (`glosario 3.4`). |
| Un comentario / sticky note | Es contenido meta del autor; no pertenece a gramática nuclear (`V-204`). |
| Un handle de edición / overlay UI | Afordances UI, no gramática (`V-202`, `V-203`). |

### 2.6 Estados (3.68)

- **R-EST-1**: un estado existe solo dentro de su objeto propietario (`V-4`). No hay estados flotantes.
- **R-EST-2**: cuatro **designaciones** persistentes coexisten en esta adaptación (`SSOT-iso §Estados iniciales, Current, por defecto y finales`, `V-6`):

| Designación | Marca canónica | Restricción de cardinalidad |
|---|---|---|
| Inicial | borde grueso | 0..* |
| Final | doble borde | 0..* |
| Por defecto | flecha diagonal abierta apuntando al estado | 0..1 |
| `Current` declarado | glifo externo reservado (pin) | 0..1 |
| Normal (sin designación) | borde estándar | — |

- **R-EST-3**: un estado PUEDE ser simultáneamente inicial y final (`SSOT-metod §9.19`). Los ciclos cerrados DEBEN usar una única cosa-estado con doble designación; duplicar estados para separar inicio y fin es anti-patrón.
- **R-EST-4**: el **estado actual de runtime** (durante simulación, glifo `V-54`) y la designación `Current` declarada son distinguibles en serialización aunque coincidan visualmente (`V-134`, `V-238`).

### 2.7 Instancias

- **R-INS-1**: toda cosa en el modelo conceptual implica al menos una instancia operacional posible (`SSOT-iso §Glosario, notas normativas`).
- **R-INS-2**: distinguir **instancia visual** (misma cosa, otra apariencia local en otro OPD — `V-101`, `V-123`) de **instancia lógica** (relación clasificación-instanciación entre cosas distintas, `RF4`).
- **R-INS-3**: nombre de instancia lógica: `NombreInstancia : NombreClase` (`V-58`).
- **R-INS-4** (`SSOT-iso §Modelos conceptuales vs modelos de ejecución`): un enlace entre cosas NO implica comportamiento ejecutado hasta que existan instancias operacionales.
- **R-INS-6**: una instancia especializada en ejecución exige su instancia general; la regla normativa es R-HER-6 (§5.5).

### 2.8 Modelo conceptual, ejecución y realización

- **R-EJEC-1** (`SSOT-iso §Modelos conceptuales y de ejecución`): el modelo conceptual DEBE describir patrones de estructura y comportamiento; NO DEBE confundirse con una ocurrencia operacional.
- **R-EJEC-3**: el estado de runtime NO DEBE persistirse como canon conceptual salvo snapshot declarado.
- **R-EJEC-6**: todo runtime DEBE seguir los enlaces, condiciones, eventos, duración y reglas de transformación declaradas por el modelo conceptual; NO DEBE introducir semántica externa silenciosa.

### 2.9 Metamodelo OPM

- **R-META-1** (`SSOT-iso §Metamodelo OPM`): un modelo OPM individual DEBE contener conjunto de OPDs, especificación OPL y metadatos persistentes de identidad.
- **R-META-2**: un conjunto de OPDs DEBE componerse de OPDs; cada OPD DEBE componerse de constructos OPD; cada constructo OPD DEBE componerse de cosas y enlaces.
- **R-META-3**: una especificación OPL DEBE componerse de párrafos OPL, oraciones OPL, frases y nombres reservados.
- **R-META-4**: un modelo OPM individual PUEDE referenciar `0..*` sub-modelos; si lo hace, se convierte en modelo OPM compuesto por referencia.
- **R-META-5**: la dualidad OPD↔OPL DEBE preservarse íntegramente dentro de cada modelo individual.
- **R-META-6**: la composición entre modelos NO DEBE colapsar las dualidades OPD↔OPL locales en una única especificación cerrada.
- **R-META-7**: toda composición inter-modelo DEBE regularse por referencias explícitas entre fronteras de modelo y metadatos persistentes.
- **R-META-8**: una referencia externa a una cosa NO crea existencia propietaria nueva; la existencia pertenece al modelo propietario.
- **R-META-9**: toda cosa referenciable desde otro modelo y todo OPD citable externamente DEBEN exponer identificador persistente recuperable.
- **R-META-10**: un constructo básico DEBE contener exactamente 2 cosas y 1 enlace.
- **R-META-11**: un constructo compuesto PUEDE contener abanicos de enlaces o más de dos refinadores.
- **R-META-12**: referencias externas y vínculos entre modelos pertenecen al nivel metamodelo del compuesto; NO alteran la definición de constructo básico.
- **R-META-13** (`SSOT-iso §Modelo de enlace`): todo enlace DEBE tener origen, destino, conector, línea, símbolo, etiqueta opcional y nombre de ruta opcional.
- **R-META-14** (`SSOT-iso §Modelo de cosa`): una cosa DEBE ser objeto o proceso; NO existe tercera clase de cosa.
- **R-META-15**: un objeto con `s` estados genera `s` objetos específicos de estado; cada objeto específico de estado DEBE ser especialización sin estados que refiere a un estado concreto del objeto original.
- **R-META-16**: un objeto específico de estado DEBE nombrarse de forma trazable al estado y al objeto original, y DEBE enlazarse mediante estructural etiquetado equivalente a `refiere al estado de`.

---

## 3. Reglas visuales del OPD

### 3.1 Primitivas geométricas (`SSOT-visual §1.1`)

| Forma cerrada | Representa |
|---|---|
| Rectángulo | Objeto |
| Elipse | Proceso |
| Rectángulo redondeado (`rountangle`) | Estado (siempre contenido en un objeto) |

### 3.2 Producto cartesiano Forma × Contorno × Profundidad (`V-1`, `§1.4`)

Toda cosa OPM se renderiza como una de exactamente **8** combinaciones:

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

**Defaults**: informacional + sistémico.

### 3.3 Contorno (`§1.2`)

- continuo (sólido) = afiliación sistémica;
- discontinuo (punteado) = afiliación ambiental;
- **grueso** = indicador de refinamiento (cosa refinada en OPD padre Y en OPD hijo) (`V-33`, `V-69`).

- **R-CTRN-1** (`V-71`): el tipo de contorno (sólido/discontinuo) DEBE persistir a través de niveles.
- **R-CTRN-1A**: un objeto ambiental DEBE seguir siendo ambiental en todos los OPDs hijos donde aparezca.

- **R-CTRN-2** (`V-70`): el despliegue intradiagrama NO DEBE producir contorno grueso.

### 3.4 Profundidad/sombra (`§1.3`)

- sombra canónica desplazada abajo-derecha = esencia física;
- plano = esencia informacional.

- **R-SOMB-1** (`V-124`, `V-126`): la sombra en canon-diagrama codifica EXCLUSIVAMENTE fisicidad.
- **R-SOMB-2**: toda sombra decorativa de UI aplicada uniformemente DEBE suprimirse en export canónico.
- **R-SOMB-3**: la sombra de una cosa DEBE colapsar a un único resultado semántico visible: presente si y solo si la cosa es física.

### 3.5 Colores canónicos (`§1.1b`)

- **R-COLOR-1** (`V-63`): los colores son informativos, NO normativos.
- **R-COLOR-2**: la semántica DEBE fijarse por forma, contorno, sombreado y topología interna, no por color.
- **R-COLOR-3**: una implementación PUEDE usar la paleta de referencia si preserva sin ambigüedad la topología semántica.

### 3.6 Tipografía y rotulado

- **R-ROT-1** (`V-194`): el rótulo visible permanece íntegro en canon-diagrama. NO se admite truncamiento con elipsis ni corte silencioso.
- **R-ROT-2** (`V-195`): el rótulo permanece inscrito en el bounding box visible de la cosa; wrap, autosize u overflow solo son válidos si el perfil de export los declara y preservan la lectura completa.
- **R-ROT-3** (`V-228`): en canon-diagrama los rótulos dentro del grafo permanecen en negro por defecto. El cromatismo de clase se preserva primariamente en bordes/líneas/decoraciones semánticas, no en el texto.
- **R-ROT-4** (`V-122`): un alias entre paréntesis es decorativo (`Sistema de Turborreactor (str)`). Las llaves `{alias}` se reservan al binding computacional (`§20`).

### 3.7 Decoraciones de extremo de enlace (`§1.5`)

| Decoración | Nombre | Uso |
|---|---|---|
| Punta cerrada (arrowhead) | punta cerrada | Enlaces transformadores |
| Círculo negro relleno | piruleta negra (black lollipop) | Enlace de agente (extremo proceso) |
| Círculo blanco vacío | piruleta blanca (white lollipop) | Enlace de instrumento (extremo proceso) |
| Línea en zigzag + punta | rayo (lightning bolt) | Enlace de invocación |
| Punta abierta | open arrowhead | Estructural etiquetado unidireccional |
| Arpón (media punta) | harpoon | Estructural etiquetado bidireccional/recíproco |

- **R-DEC-1** (`V-190`): una piruleta DEBE colgar siempre del extremo de una línea visible.
- **R-DEC-1A**: un círculo aislado NO DEBE interpretarse como piruleta.
- **R-DEC-2** (`V-191`): handles UI NO DEBEN ser visualmente idénticos a piruletas.
- **R-DEC-2A**: handles UI DEBEN distinguirse por color reservado a UI, posición o tamaño.

### 3.8 Símbolos triangulares (relaciones estructurales fundamentales, `§1.7`)

| Topología interna del triángulo | Relación |
|---|---|
| Interior completamente relleno | Agregación-participación |
| Triángulo interior distinguible | Exhibición-caracterización |
| Vacío (sin interior distinguible) | Generalización-especialización |
| Círculo interior distinguible | Clasificación-instanciación |

- **R-TRI-1** (`V-3`): el vértice del triángulo DEBE apuntar al refinable.
- **R-TRI-1A**: la base del triángulo DEBE conectar con los refinadores.
- **R-TRI-2** (`V-128`): la topología interna del triángulo DEBE tratarse como canal normativo.
- **R-TRI-2A**: una implementación que elimine, invierta o colapse la decoración interior NO es conforme.
- **R-TRI-3** (`V-131`): los símbolos estructurales importados DEBEN preservar topología interna; la retipificación cromática es admisible.

### 3.9 Marcas textuales sobre enlaces (`§1.6`)

| Marca | Significado |
|---|---|
| `e` | Modificador de evento (objeto inicia el proceso) |
| `c` | Modificador de condición (proceso se omite si la precondición falla) |
| `/` | Excepción por sobretiempo |
| `//` | Excepción por subtiempo |
| `Pr=p` | Probabilidad del enlace en abanico probabilístico |
| Texto itálico sobre el eje | Etiqueta de enlace estructural |
| Texto sobre enlace procedimental | Etiqueta de ruta (path label) |

- **R-MARCA-1** (`SSOT-visual §1.6`): las marcas textuales sobre enlaces canónicos DEBEN limitarse a las filas de esta tabla o a extensiones declaradas por perfil.

### 3.10 Indicadores auxiliares (`§1.8`)

| Indicador | Representación |
|---|---|
| Colección incompleta | Barra horizontal corta bajo el triángulo |
| Cosa duplicada (apariencia visual repetida en mismo OPD) | Silueta desplazada detrás del símbolo |
| Supresión de estados | Rountangle con `...` en esquina inferior derecha del objeto |
| Multiplicidad | Número/expresión junto al extremo del enlace |
| Supresor de enlaces no materializados | Burbuja adyacente con `...` |

### 3.11 Anidamiento permitido

| Contenedor | Puede contener |
|---|---|
| Objeto (rectángulo) | Estados (rountangles); partes (objetos) si está descompuesto; rasgos (semi-plegado de exhibición) |
| Proceso (elipse inflada) | Subprocesos; objetos internos del contexto de descomposición |
| Estado | NADA. Un estado es atómico (no contiene cosas ni estados) |

- **R-ANID-1** (`V-79`): al descomponer, el rectángulo del objeto o la elipse del proceso DEBEN agrandarse para contener refinadores.
- **R-ANID-1A** (`SSOT-metod §3`): una elipse agrandada que contiene subprocesos DEBE tratarse como proceso inflado.

### 3.12 Tamaños, layout y grid

- **R-LAY-1** (`V-50`): un OPD con hasta 20 cosas se considera legible; entre 21 y 25 cosas la herramienta DEBE emitir advertencia de legibilidad; con más de 25 cosas el export canónico DEBE bloquearse salvo vista tipificada o refinamiento declarado.
- **R-LAY-2** (`V-51`): no DEBE haber oclusión entre cosas ni enlaces que atraviesen áreas ocupadas; si un re-ruteo automático sin cambio semántico elimina cruces, el export canónico DEBE aplicar el re-ruteo o reportar advertencia de layout.
- **R-LAY-3** (`V-196`): la grid es decoración opcional de edición; se suprime en exportaciones canónicas.
- **R-LAY-4** (`V-35`, `V-55`): toda herramienta de layout DEBE preservar la semántica temporal vertical definida por R-INV-2/R-INV-2A.

---

## 4. Reglas gramaticales OPL-ES

### 4.0 Contrato textual OPL-ES (`SSOT-opl §0`)

- **R-OPL-TEXT-1**: OPL-ES es la capa textual canónica del corpus OPM-ES; toda superficie textual generada o aceptada como canónica DEBE obedecer `SSOT-opl`.
- **R-OPL-TEXT-2**: OPL-ES DEBE fijar solo superficie léxica, sintáctica y plantillas textuales; NO DEBE redefinir semántica OPM ni gramática visual OPD.
- **R-OPL-TEXT-3**: toda mención textual de enlaces, refinamientos, cardinalidades u operadores DEBE heredar semántica de `opm-iso-19450-es.md` y geometría de `opm-visual-es.md`.
- **R-OPL-TEXT-4**: OPL-ES DEBE preservar equivalencia semántica bidireccional entre OPL-EN y OPL-ES.

### 4.1 Convenciones tipográficas Markdown (`SSOT-opl §1.7`)

| Entidad | Convención | Patrón permitido |
|---|---|---|
| Objeto | **negrita** | **Ingrediente** |
| Proceso | *cursiva* | *Cocinar* |
| Estado | `monoespaciado` | `crudo` |

- **R-OPL-TYPO-1**: todo OPL Markdown emitido por el modelador DEBE representar objetos en negrita, procesos en cursiva y estados en monoespaciado.
- **R-OPL-TYPO-2**: colores, contornos, sombreados y atributos visuales NO forman parte del contrato OPL-ES.

### 4.2 Decisiones de diseño OPL-ES (`§1`)

- **R-OPL-1**: género gramatical en masculino default; ajustable a género natural del sustantivo concreto (`§1.4`).
- **R-OPL-2**: **estar** para estados temporales mutables (`**Objeto** está en `estado``); **ser** para propiedades invariantes (`**Objeto** es de tipo X`, `**X** es un **Y**`) (`§1.5`).
- **R-OPL-3**: artículos omitidos salvo donde gramaticalmente requeridos (`§1.6`):
  - "es un/una" en clasificación-instanciación y especialización individual;
  - "de lo contrario" en condiciones;
  - "al menos" en operadores lógicos.
- **R-OPL-4**: posición del estado: en OPL-ES el estado **sigue** al objeto con preposición "en": `**Usuario** en `activo` maneja *Procesar*` (`§1.9`).
- **R-OPL-5**: voz pasiva refleja: `se consume`, `se omite` (no `es consumido`, `es omitido`) (`§1.10`).
- **R-OPL-6** (`§1.8`): OPL-ES DEBE preservar el orden sujeto-verbo-complemento de cada plantilla OPL-EN.
- **R-OPL-7**: OPL-ES NO DEBE reordenar la oración si ello rompe correspondencia estructural con OPL-EN o análisis bidireccional.
- **R-OPL-8** (`§1.6`): la preposición personal `a` DEBE omitirse para objetos directos OPM.
- **R-OPL-9** (`A.3`): un identificador de proceso PUEDE aparecer como `nombre_singular_de_proceso` o `nombre_singular_de_proceso proceso`.
- **R-OPL-10** (`A.3`): un identificador de objeto PUEDE incluir unidad de medida y cláusula de rango; si se emiten, DEBEN parsearse como parte del identificador textual del objeto.

### 4.3 Vocabulario fijo de verbos (`§2`)

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

- **R-OPL-VERB-1**: los verbos fijos DEBEN emitirse en tercera persona singular del presente indicativo cuando la plantilla no indique otra forma.
- **R-OPL-VERB-2**: para detección EN/ES por verbo fijo, aplica R-OPL-LANG-1; esta sección solo define el vocabulario candidato.

**Palabras clave fijas (`SSOT-opl §2`):**

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

- **R-OPL-KW-1**: las palabras clave fijas DEBEN emitirse exactamente como tokens OPL-ES, salvo alternancia morfofonológica `y/e` y `o/u`.
- **R-OPL-KW-2**: la alternancia `y/e` y `o/u` DEBE aplicarse solo por condición fonética del siguiente término.

### 4.4 Plantillas — cosas (`§3`)

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

- **R-OPL-PERSIST-1** (`SSOT-opl §3.4`): OPL-ES NO define familia verbal adicional para procesos persistentes.
- **R-OPL-PERSIST-2**: si un proceso persistente permanece explícito, su realización textual canónica DEBE usar TS3 con estado de entrada igual a estado de salida.
- **R-OPL-PERSIST-3**: si la temporalidad sostenida no es semánticamente central, la superficie textual PUEDE simplificarse mediante enlace estructural etiquetado según la política metodológica.

### 4.5 Plantillas — enlaces transformadores (`§4`)

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

**Nota crítica**: TS4/TS5 tienen dos realizaciones distinguibles que comparten superficie textual; el régimen se determina por procedencia (ver R-ESCIND-0):
- **(a) enlace escindido** — par acoplado producido al descomponer un efecto entrada-salida (TS3) en subprocesos: TS4 temprano saca del estado de entrada, TS5 tardío pone en el de salida (`V-40`, `V-110`). Las dos mitades solo tienen sentido juntas y NO admiten modificadores de control.
- **(b) efecto parcial standalone** — enlace de efecto completo en sí mismo: TS4 solo-entrada cuya salida, si no se especifica, se resuelve al estado por defecto o a la distribución de probabilidad de estados (`V-9`); TS5 solo-salida. Admite evento/condición (ETS3, ETS4).

### 4.6 Plantillas — enlaces habilitadores (`§5`)

| ID | Tipo | OPL-ES |
|---|---|---|
| H1 | Agente | **Agente** maneja *Proceso*. |
| H2 | Instrumento | *Proceso* requiere **Instrumento**. |
| HS1 | Agente con estado | **Agente** en `estado` maneja *Proceso*. |
| HS2 | Instrumento con estado | *Proceso* requiere **Instrumento** en `estado`. |

### 4.7 Plantillas — enlaces de evento (`§6`)

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

### 4.8 Plantillas — enlaces de condición (`§7`)

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

- **R-OPL-COND-ALT-1** (`A.6`): el parser OPL-ES DEBE aceptar la variante de consumo condicional `Si **Objeto** existe entonces *Proceso* ocurre y consume **Objeto**, de lo contrario se omite *Proceso*.`.
- **R-OPL-COND-ALT-2**: el generador canónico DEBE preferir CT1 sobre la variante alternativa de R-OPL-COND-ALT-1.
- **R-OPL-SUP-1**: el modo de preservación de superficie solo PUEDE activarse durante importación, migración o roundtrip auditado; DEBE persistirse como metadato de superficie y NO DEBE ser el modo default de export canónico.

### 4.9 Plantillas — excepción e invocación (`§8`)

| ID | OPL-ES |
|---|---|
| EX1 | *Manejo* ocurre si duración de *Fuente* excede máx-duración unidades-tiempo. |
| EX2 | *Manejo* ocurre si duración de *Fuente* es menor que mín-duración unidades-tiempo. |
| IV1 | *Invocador* invoca *Invocado*. |
| IV2 | *Invocador* se invoca a sí mismo. |

### 4.10 Plantillas — enlaces estructurales (`§9`)

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

**Colecciones incompletas** (`§9.3`): `… y al menos otra parte / otro rasgo / otra especialización.`

- **R-OPL-SE-1** (`SSOT-opl §9.1`, `A.8`): una etiqueta estructural definida por el modelador DEBE ser frase breve en minúscula y funcionar como verbo o predicado nominal de la oración.
- **R-OPL-SE-2** (`A.8`): los enlaces estructurales etiquetados OPL-ES DEBEN emitirse como objeto↔objeto o proceso↔proceso; mezclas objeto↔proceso pertenecen a exhibición-caracterización cuando son canónicas.
- **R-OPL-SE-3**: los estructurales etiquetados PUEDEN incluir restricciones de participación en origen y destino.
- **R-OPL-SE-4**: una oración estructural etiquetada PUEDE ser bifurcada hacia listas de objetos o procesos, con `ordenados por` o `en esa secuencia` cuando el orden sea parte de la superficie.
- **R-OPL-SE-5** (`A.8`): `se relaciona con` y `se relacionan` son etiquetas nulas canónicas; una etiqueta nula definida por usuario solo es válida si conserva trazabilidad como etiqueta de usuario.
- **R-OPL-RF-1** (`A.9`): agregación, caracterización, especialización e instanciación DEBEN soportar variantes de objeto y de proceso cuando la semántica OPM lo permita.
- **R-OPL-RF-2**: la caracterización DEBE usar `exhibe`; el alias `exhibición` NO DEBE introducir una producción adicional que genere ambigüedad.
- **R-OPL-RF-3**: especialización de estado DEBE expresarse como lista de objetos con estado que son un objeto con estado general.
- **R-OPL-RF-4**: instanciación plural DEBE emitirse como `son instancias de`.
- **R-OPL-RF-5**: especialización XOR DEBE emitirse con `puede ser` o `puede ser uno de`.
- **R-OPL-RF-6**: herencia múltiple textual DEBE emitirse con una lista de generales unidos por artículos `un/una`.

**Estructurales con estado especificado** (`§9.4`, `SSE1`–`SSE7`):

| ID | Grupo | OPL-ES |
|---|---|---|
| SSE1 | Estado en origen, unidireccional | **Origen** en `estado` etiqueta **Destino**. |
| SSE2 | Estado en destino, unidireccional | **Origen** etiqueta **Destino** en `estado`. |
| SSE3 | Estado en ambos, unidireccional | **Origen** en `sa` etiqueta **Destino** en `sb`. |
| SSE4 | Estado en origen, bidireccional f-tag | **Origen** en `sa` etiqueta-f **Destino**. |
| SSE5 | Estado en origen, bidireccional b-tag | **Destino** etiqueta-b **Origen** en `sa`. |
| SSE6 | Estado en ambos, recíproco | **Origen** en `sa` y **Destino** en `sb` son etiqueta. |
| SSE7 | Estado en origen, recíproco | **Destino** y **Origen** en `sa` son etiqueta. |

**Restricción `V-30`**: las variantes **bidireccional** y **recíproco** NO existen para el caso de estado solo en destino.

### 4.11 Plantillas — gestión de contexto (`§10`)

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

- **R-OPL-CX-ID-1** (`SSOT-opl §10.3`): toda oración de refinamiento entre OPDs que use etiqueta visible `SDx.y` DEBE mapearse al identificador persistente exigido por R-IDP-2.
- **R-OPL-CM-1** (`SSOT-opl §10.4`): las oraciones CM1–CM3 NO reemplazan la gramática interna de cada modelo; solo describen composición entre modelos y referencias externas.
- **R-OPL-CX-1** (`A.10`): OPL-ES DEBE soportar despliegue de objeto y de proceso por partes, especialización, instanciación o rasgos.
- **R-OPL-CX-2**: un despliegue en nuevo OPD DEBE declarar OPD padre, OPD hijo y lista de refinadores.
- **R-OPL-CX-3**: una descomposición PUEDE ocurrir en el mismo diagrama o en nuevo diagrama; si ocurre en nuevo diagrama, DEBE declarar OPD padre y OPD hijo.
- **R-OPL-CX-4**: OPL-ES DEBE soportar descomposición de procesos y objetos.
- **R-OPL-CX-5**: una descomposición PUEDE ser secuencial, paralela o mixta; la forma mixta DEBE preservar qué subprocesos están en paralelo dentro de la secuencia.
- **R-OPL-CX-6**: una descomposición PUEDE incluir objetos o procesos internos de zoom mediante `así como`.
- **R-OPL-CX-7**: plegado DEBE referir al OPD padre; recomposición DEBE referir al OPD hijo origen.

### 4.12 Etiquetas de ruta (`§13`)

`Por ruta etiqueta, *Proceso* consume **Objeto**.`
`Por ruta etiqueta, *Proceso* genera **Objeto**.`

- **R-OPL-RUTA-1** (`SSOT-opl §13`): `Por ruta` es expresión fija.
- **R-OPL-RUTA-2**: la etiqueta de ruta DEBE ser nombre definido por el modelador.
- **R-OPL-RUTA-3** (`A.5`): una oración de ruta PUEDE prefijar una oración procedimental; el canon local solo emite consumo/resultado salvo extensión documentada.

### 4.13 Atributos y valores (`§14`)

| OPL-ES |
|---|
| **Atributo** de **Objeto** es valor. |
| **Atributo** de **Objeto** varía de X a Y. |
| **Atributo** de **Objeto** puede estar `valor1`, `valor2` o `valor3`. |

- **R-ATR-1** (`SSOT-iso §Valores de atributos`): un atributo DEBE modelarse como objeto que caracteriza una cosa vía exhibición-caracterización.
- **R-ATR-2**: los valores de atributo DEBEN modelarse como estados del atributo.
- **R-ATR-3**: un atributo cuantitativo PUEDE declarar unidad de medida; si se declara, la unidad DEBE persistirse y emitirse de forma recuperable.
- **R-ATR-4**: un atributo PUEDE declarar dominio permitido como intervalo simple o lista de intervalos.
- **R-ATR-5**: los intervalos de dominio DEBEN usar límites explícitos y semántica de inclusión/exclusión cuando el límite importe.
- **R-ATR-6**: una propiedad no es atributo si su valor no cambia durante simulación o implementación operacional; cardinalidades, etiquetas y etiquetas de ruta DEBEN tratarse como propiedades, no atributos.

### 4.14 EBNF normativa

- **R-OPL-EBNF-1** (`SSOT-opl Apéndice A`): la EBNF formal completa de OPL-ES es normativa para parseo y generación.
- **R-OPL-EBNF-2**: cualquier divergencia entre `SSOT-opl §17` y Apéndice A DEBE resolverse a favor del Apéndice A.
- **R-OPL-EBNF-3**: los no terminales normativos del Apéndice A DEBEN escribirse en `snake_case`; nombres con espacios de §17 son explicativos.
- **R-OPL-EBNF-4** (`A.1`): un párrafo OPL-ES DEBE ser una secuencia de oraciones OPL-ES separadas por saltos de línea.
- **R-OPL-EBNF-5**: toda oración OPL-ES formal DEBE terminar con punto.
- **R-OPL-EBNF-6**: una oración formal OPL-ES DEBE pertenecer a descripción de cosa, procedimental, estructural o gestión de contexto.
- **R-OPL-LEX-1** (`A.2`): el alfabeto léxico OPL-ES DEBE admitir letras ASCII, vocales acentuadas, `ñ` y `ü` en mayúscula/minúscula.
- **R-OPL-LEX-2**: `caracter_de_cadena` DEBE limitarse a letra, dígito decimal, guion y guion bajo.
- **R-OPL-LEX-3**: `nombre_simple` DEBE comenzar con letra.
- **R-OPL-TIPO-1** (`A.2`, `A.4`): `tipo-id` DEBE ser `boolean`, `string`, tipo numérico o `enumerated`.
- **R-OPL-TIPO-2**: un tipo numérico PUEDE usar prefijo `unsigned` o `signed`.
- **R-OPL-PART-1** (`A.2`): restricciones de participación textuales DEBEN usar `un/una`, `un/una opcional`, `al menos un/una`, `exactamente un/una`, `al menos dos`, `dos o más`, o límites numéricos/paramétricos.
- **R-OPL-RANGO-1** (`A.2`): un rango textual DEBE usar `valor` para valor exacto, `varía de X a Y` para rango cerrado narrativo, intervalos `[..]`/`(..)` para límites parseables y `*` exclusivamente para límite abierto.
- **R-OPL-RANGO-2** (`A.7`): una restricción de expresión DEBE iniciar con `donde`.
- **R-OPL-RANGO-3**: operaciones lógicas ASCII `=`, `<`, `>`, `<=`, `>=` son la superficie EBNF normativa; símbolos Unicode equivalentes DEBEN normalizarse o declararse como extensión de visualización.
- **R-OPL-CONJ-1** (`A.7`): restricciones de pertenencia a conjunto DEBEN emitirse con `en { ... }`.
- **R-OPL-LISTA-1** (`A.3`, `A.7`): listas OPL-ES DEBEN separar elementos intermedios con coma y el último con `y` u `o` según la producción.
- **R-OPL-LISTA-2**: listas bifurcadas PUEDEN terminar en `más`, `ordenados por criterio` o `en esa secuencia` solo cuando la producción lo permita.

### 4.15 Equivalencia EN↔ES de ida y vuelta (`§18.4`)

- **R-OPL-EQ-1**: una sentencia OPL-ES PUEDE usar infinitivo o nominalización `-ción`.
- **R-OPL-EQ-2**: superficies equivalentes DEBEN mapear al mismo nombre canónico interno por cosa cuando así lo declare el modelo.
- **R-OPL-EQ-3**: la traducción EN→ES→EN DEBE preservar el hecho del modelo, no la superficie literal.
- **R-OPL-EQ-4**: una herramienta NO DEBE forzar exclusivamente infinitivo; la normalización de superficie DEBE ser política editorial configurable del modelo.
- **R-OPL-EQ-5**: un modelo interno OPD DEBE permanecer invariante ante cambio de idioma OPL.

### 4.16 Transformación sistemática EN→ES (`SSOT-opl §15`)

- **R-OPL-TRANS-1**: la transformación EN→ES DEBE aplicar mapeo de verbo principal antes de los demás reemplazos.
- **R-OPL-TRANS-2**: un modificador de estado que precede al objeto en EN DEBE moverse después del objeto con `en` en ES.
- **R-OPL-TRANS-3**: `Object is state` DEBE transformarse en `**Objeto** está en `estado``.
- **R-OPL-TRANS-4**: `can be` DEBE transformarse en `puede estar`.
- **R-OPL-TRANS-5**: `from`, `to` y `of` DEBEN transformarse en `de`, `a` y `de`, respectivamente.
- **R-OPL-TRANS-6**: `exactly one of` y `at least one of` DEBEN transformarse en `exactamente uno de` y `al menos uno de`.
- **R-OPL-TRANS-7**: `if`, `in which case` y `otherwise/else` DEBEN transformarse en `si`, `en cuyo caso` y `de lo contrario`.
- **R-OPL-TRANS-8**: pasivas `is consumed` e `is skipped` DEBEN transformarse en `se consume` y `se omite`.
- **R-OPL-TRANS-9**: `Following path` DEBE transformarse en `Por ruta`.
- **R-OPL-TRANS-10**: las designaciones `initial`, `final`, `default` y `declared current` DEBEN transformarse en `inicial`, `final`, `por defecto` y `declarado `Current``.
- **R-OPL-TRANS-11**: nombres de entidades NO DEBEN traducirse por regla automática salvo política explícita del modelo.

### 4.17 Política de idioma y modelos mixtos (`SSOT-opl §18`)

- **R-OPL-LANG-1**: una herramienta bilingüe DEBE detectar idioma de una sentencia por verbo principal fijo cuando sea posible.
- **R-OPL-LANG-2**: el idioma OPL canónico DEBE elegirse a nivel de usuario o modelo sin alterar el OPD subyacente.
- **R-OPL-LANG-3**: cambiar idioma OPL DEBE regenerar el párrafo OPL completo, no editar parcialmente una superficie mixta.
- **R-OPL-LANG-4**: una herramienta NO DEBE mezclar OPL-EN y OPL-ES dentro del mismo párrafo generado salvo habilitación explícita del usuario.
- **R-OPL-LANG-5**: modelos mixtos EN/ES solo PUEDEN existir como revisión o migración; NO DEBEN ser estado estable por defecto.
- **R-OPL-LANG-6**: una herramienta multilingüe DEBE mantener OPL local autocontenido por modelo individual cuando existan sub-modelos.
- **R-OPL-LANG-7**: una especificación textual global de modelo compuesto NO DEBE inferirse únicamente desde navegación visible del árbol OPD; DEBE conservar frontera entre modelos e identificador persistente de cada OPD.

---

## 5. Enlaces — taxonomía estricta

### 5.1 Familias canónicas de enlace (`V-239`)

Toda relación expresable por enlace en un OPD conforme pertenece a **exactamente una** de cinco familias:

| # | Familia | Firma | Realización canónica |
|---|---|---|---|
| 1 | Transformadora procedimental | Objeto ↔ Proceso | T1–T3, TS1–TS5 |
| 2 | Habilitadora procedimental | Objeto → Proceso | H1, H2, HS1, HS2 |
| 3 | Invocación procedimental | Proceso → Proceso | IV1, IV2 |
| 4 | Estructural fundamental | Cosa ↔ Cosa (con restricciones) | RF1–RF4 |
| 5 | Estructural etiquetada | Objeto ↔ Objeto o Proceso ↔ Proceso | SE1–SE5, SSE1–SSE7 |

### 5.2 Enlaces transformadores (`SSOT-iso §Enlaces transformadores`)

| Enlace | Firma | Decoración fuente | Decoración destino | OPL canónico |
|---|---|---|---|---|
| Consumo | Objeto → Proceso | (ninguna) | punta cerrada en proceso | T1 / TS1 |
| Resultado | Proceso → Objeto | (ninguna) | punta cerrada en objeto | T2 / TS2 |
| Efecto | Objeto ↔ Proceso | punta cerrada | punta cerrada | T3 / TS3 / TS4 / TS5 |

**Restricciones de origen/destino:**

- **R-CONS-1**: el consumido es objeto **con o sin estados** (`V-5`).
- **R-CONS-2** (`SSOT-iso §Enlaces transformadores con estado especificado`): el consumo se interpreta como inmediato al activarse el proceso salvo que el enlace declare propiedad de tasa y el consumido declare atributo de cantidad.
- **R-CONS-3**: si el consumo ocurre a lo largo del tiempo, el modelo DEBE declarar simultáneamente tasa de consumo en el enlace y cantidad consumible como atributo del objeto consumido.
- **R-RES-1** (`V-8`): un enlace de resultado hacia un objeto con estado inicial DEBE conectarse al rectángulo del objeto o a un estado distinto del inicial; NUNCA directamente al estado inicial.
- **R-EFE-1** (`V-7`): efecto REQUIERE objeto con al menos un estado definido.
- **R-EFE-2** (`SSOT-iso §Enlaces transformadores`): una vez iniciado el proceso afector, el afectado DEBE salir del estado de entrada.
- **R-EFE-2A**: el afectado solo DEBE alcanzar el estado de salida al completarse el proceso.
- **R-EFE-2B**: si el proceso se aborta antes de completarse, el estado del afectado queda indeterminado salvo manejo de excepción.
- **R-EFE-3**: efecto con solo estado de entrada (TS4) sin estado de salida especificado → destino = estado por defecto, o distribución de probabilidad de estados si no hay defecto (`V-9`); es el régimen *efecto parcial standalone* de R-ESCIND-0, distinto del fragmento escindido.

### 5.3 Enlaces habilitadores (`SSOT-iso §Enlaces habilitadores`)

| Enlace | Firma | Decoración | Restricción de origen | OPL |
|---|---|---|---|---|
| Agente | Agente humano → Proceso | piruleta NEGRA en extremo proceso | **EXCLUSIVAMENTE humanos o grupos humanos** | H1 / HS1 |
| Instrumento | Objeto no humano → Proceso | piruleta BLANCA en extremo proceso | NO humanos (robots, IA, software, máquinas) | H2 / HS2 |

- **R-AG-1** (`glosario 3.3`, `SSOT-metod §6.5`): el enlace de agente y el término "agente" se reservan EXCLUSIVAMENTE para humanos o grupos de humanos.
- **R-AG-1A**: robots, agentes de software e IA DEBEN usar enlace de instrumento en el modelo OPM nuclear.
- **R-AG-1B**: una descripción textual externa PUEDE llamar "agente" a un software, pero el OPD/OPL canónico DEBE clasificarlo como instrumento.

- **R-AG-2** (`SSOT-iso §Enlaces habilitadores`): si un habilitador deja de existir durante la ejecución, el proceso DEBE detenerse y el estado del afectado queda indeterminado (`V-10`).

- **R-AG-3** (`SSOT-metod §6.7`, **reclasificación por desgaste**): cuando el desgaste/degradación/amortización del instrumento es relevante al alcance, el instrumento DEBE reclasificarse como afectado.
- **R-AG-4**: si un instrumento se reclasifica por desgaste y el mantenimiento pertenece al alcance declarado, el modelo DEBE agregar atributo de degradación/amortización y proceso de mantenimiento separado; si el mantenimiento queda fuera del alcance, el modelo DEBE declarar esa exclusión.

### 5.4 Enlaces de invocación (`SSOT-iso §Enlaces de invocación`, `V-240`)

| Enlace | Firma | Decoración | OPL |
|---|---|---|---|
| Invocación | Proceso → Proceso | rayo (zigzag con punta) | IV1 |
| Auto-invocación | Proceso → mismo proceso | zigzag de bucle | IV2 |

- **R-INV-1** (`V-240`): la invocación DEBE tener firma `Proceso → Proceso`.
- **R-INV-1A**: la invocación DEBE tratarse como familia autónoma distinta de transformadora/habilitadora.
- **R-INV-2** (invocación implícita, `V-31`, `V-32`): dentro de una descomposición, la terminación de un subproceso DEBE invocar al inmediatamente inferior por posición vertical.
- **R-INV-2A**: subprocesos con borde superior a la misma altura DEBEN iniciar en paralelo.
- **R-INV-2B**: en invocación implícita NO DEBE dibujarse enlace explícito.

### 5.5 Enlaces estructurales fundamentales (`SSOT-iso §Enlaces estructurales`)

| Relación | Triángulo (interior) | Vértice → base | Restricción de perseverancia |
|---|---|---|---|
| Agregación-participación | totalmente relleno | Todo → Partes | misma perseverancia obligatoria |
| Exhibición-caracterización | triángulo interior | Exhibidor → Rasgos | **excepción**: única que admite mezcla (objeto exhibe operación, proceso exhibe atributo) |
| Generalización-especialización | vacío | General → Especializaciones | misma perseverancia obligatoria |
| Clasificación-instanciación | círculo interior | Clase → Instancias | misma perseverancia obligatoria |

- **R-STRF-1** (`V-24`, `glosario 3.50`): salvo exhibición-caracterización, refinable y refinadores DEBEN tener misma perseverancia.
- **R-STRF-2** (`V-25`, `V-26`): exhibición-caracterización es la ÚNICA estructural que PUEDE conectar objetos con procesos.
- **R-STRF-2A**: las únicas combinaciones de exhibición-caracterización mixtas válidas son objeto exhibe atributo, objeto exhibe operación, proceso exhibe atributo y proceso exhibe operación.
- **R-STRF-3** (`V-27`): clasificación-instanciación NO DEBE distinguir colección completa/incompleta.
- **R-STRF-4** (`V-57`): las partes de una agregación PUEDEN ser consumidas, afectadas o producidas independientemente sin que el todo lo sea.
- **R-HER-1** (`SSOT-iso §Herencia`): una especialización DEBE heredar del general todas las partes, rasgos, enlaces estructurales etiquetados y enlaces procedimentales.
- **R-HER-2**: la herencia múltiple está permitida y DEBE resolverse preservando trazabilidad de cada general.
- **R-HER-3**: un atributo discriminante DEBE restringir los valores válidos para las especializaciones.
- **R-HER-4**: con varios atributos discriminantes, el número máximo de especializaciones válidas DEBE calcularse como producto cartesiano de los valores posibles.
- **R-HER-5**: una especialización PUEDE reemplazar un participante heredado solo especificando una especialización de ese participante con nombre y conjunto de estados propios.
- **R-HER-6**: una instancia especializada NO DEBE existir en ejecución sin la instancia general correspondiente.
- **R-HER-7**: para crear un general desde especializaciones existentes, la herramienta o el modelador DEBE identificar rasgos y participantes comunes, crear la cosa general, conectar especializaciones, eliminar duplicados heredados y migrar enlaces comunes al general.
- **R-HER-8**: los enlaces heredados NO DEBEN dibujarse como enlaces explícitos duplicados en el OPD salvo que la herramienta los marque como vista derivada no nuclear.

### 5.6 Enlaces estructurales etiquetados (`SSOT-iso §Enlaces estructurales`, `§8.1`)

| Variante | Geometría | Decoración | Etiqueta |
|---|---|---|---|
| Unidireccional con etiqueta | línea con punta abierta en destino | open arrowhead | itálica sobre la línea |
| Unidireccional sin etiqueta (null-tagged) | igual | open arrowhead | por defecto: "se relaciona con" |
| Bidireccional (etiquetas distintas) | línea con arpones en ambos extremos | harpoon | dos etiquetas independientes (f-tag / b-tag) |
| Recíproco (misma etiqueta o sin) | línea con arpones | harpoon | una sola etiqueta o sin etiqueta |

- **R-STRE-1** (`V-56`): un bidireccional cuyas dos etiquetas son idénticas DEBE tratarse como semánticamente equivalente a un recíproco con esa misma etiqueta.

### 5.7 Enlaces de excepción (`SSOT-iso §Enlaces de control: condiciones y excepciones`)

| Enlace | Marca | Dispara | OPL |
|---|---|---|---|
| Sobretiempo | `/` | duración real > duración máxima | EX1 |
| Subtiempo | `//` | duración real < duración mínima | EX2 |

- **R-EXC-1**: un enlace de excepción DEBE conectar proceso fuente con proceso de manejo.
- **R-EXC-1A** (`SSOT-visual §4.4`): el proceso de manejo de excepción DEBE ser ambiental.
- **R-EXC-2** (`SSOT-iso §Enlaces de excepción`): un enlace de sobretiempo exige duración máxima declarada del proceso fuente.
- **R-EXC-3**: un enlace de subtiempo exige duración mínima declarada del proceso fuente.
- **R-EXC-4**: la duración de proceso PUEDE especializarse en mínima, esperada, máxima y distribución.
- **R-EXC-4A**: si se declara distribución de duración, esta DEBE determinar el valor efectivo por instancia.
- **R-EXC-5**: la unidad temporal del sistema es default para todos los procesos; cualquier proceso con unidad distinta DEBE declararla explícitamente.

### 5.8 Principio de unicidad del enlace procedimental (`V-11`, `SSOT-iso §Panorama de enlaces`)

- **R-ROL-UNIC-1** (`V-11`): un objeto/estado tiene exactamente un rol respecto de un proceso enlazado: transformado O habilitador, NUNCA ambos simultáneamente para el mismo enlace. Toda colisión DEBE resolverse por fuerza semántica (§6.5).

---

## 6. Modificadores y combinaciones

### 6.1 Naturaleza de los modificadores (`SSOT-iso §Enlaces de control`, `V-12`)

Los modificadores **`e`** (evento) y **`c`** (condición) son **anotaciones sobre un enlace base** transformador o habilitador. NO constituyen una familia de enlace adicional. La semántica del enlace base se preserva; el modificador agrega control.

| Modificador | Efecto sobre la precondición | Si falla |
|---|---|---|
| `e` (evento) | El objeto/estado DISPARA la evaluación de la precondición; el evento se pierde tras la evaluación incluso si falla (`V-13`) | Proceso no se ejecuta; evento consumido |
| `c` (condición) | Introduce **bypass condicional**: el objeto/estado se requiere para ejecutar | Proceso se **omite** (no espera); control pasa al siguiente |
| (ninguno) | Enlace transformador/habilitador base | Si el objeto no existe, proceso **espera** indefinidamente (`SSOT-metod §10.1`) |

- **R-ECA-1** (`SSOT-iso §Control evento-condición-acción`): un proceso comienza solo cuando ocurre el evento iniciador, si existe, y se satisface la precondición.
- **R-ECA-2**: el conjunto previo al proceso DEBE incluir consumidos, afectados y habilitadores necesarios antes de iniciar.
- **R-ECA-3**: el conjunto posterior al proceso DEBE incluir resultantes y objetos afectados después de completar.
- **R-ECA-4** (`SSOT-iso §Modelo de constructo procedimental`): un modificador `e` o `c` NO agrega cosa ni enlace; la cardinalidad del constructo básico se conserva.

### 6.2 Lado de aplicación: INPUT-only

- **R-MOD-0A**: Pre(P) agrupa consumidos, afectados pre-transición y habilitadores requeridos antes de iniciar el proceso.
- **R-MOD-0B**: Post(P) agrupa resultantes y afectados post-transición después de completarlo.

### 6.3 Asimetría consumo / resultado bajo `e` y `c`

| Enlace base | `+ e` válido | `+ c` válido | Razón |
|---|---|---|---|
| Consumo | **SÍ** (ET1, ETS1) | **SÍ** (CT1, CS1) | el consumido existe en Pre(P) → puede ser disparador y precondición |
| Resultado | **NO** | **NO** | el resultado **no existe antes** del proceso; no puede ser precondición ni disparador |
| Efecto (objeto con estados) | **SÍ** (ET2, ETS2–4) | **SÍ** (CT2, CS2–4) | el afectado existe en Pre(P) con su estado de entrada |
| Agente | **SÍ** (EH1, EHS1) | **SÍ** (CH1, CS5) | el agente existe en Pre(P) |
| Instrumento | **SÍ** (EH2, EHS2) | **SÍ** (CH2, CS6) | el instrumento existe en Pre(P) |

- **R-MOD-1** (`SSOT-iso §Enlaces transformadores`): no existen variantes de evento de resultado ni condición de resultado.
- **R-MOD-2**: el consumo admite `e` y `c` porque el consumido pertenece a Pre(P).
- **R-MOD-3**: el resultado no admite `e` ni `c` porque el resultante pertenece a Post(P).
- **R-MOD-4** (`SSOT-iso §Enlaces transformadores`): el conjunto posterior al proceso (Post(P)) NO admite evento ni condición; los modificadores `e`/`c` aplican exclusivamente al lado de entrada (Pre(P)).
- **R-MOD-5** (`V-43`): la matriz de fuerza semántica NO DEBE contener niveles de evento de resultado ni condición de resultado.

### 6.4 Otras combinaciones de modificadores

| Combinación | Estado canónico | Notas |
|---|---|---|
| `c` + estado especificado | Canónico (CS1–CS6) | Restringe la condición a un estado concreto del objeto/agente/instrumento |
| `e` + estado especificado | Canónico (ETS1–ETS4, EHS1–EHS2) | El estado específico del objeto dispara |
| `c` + `e` sobre el mismo enlace | NO definido en SSOT | No aparece en gramática OPL ni en geometría visual. Tratar como no canonizado |
| Modificador sobre enlace estructural | Prohibido (error de categoría) | `c` y `e` anotan solo enlaces transformador/habilitador; un enlace estructural queda fuera de ese alcance (AP-09) |
| Modificador sobre invocación | Prohibido (error de categoría) | Los modificadores anotan solo enlaces transformador/habilitador (`SSOT-iso §Control como modificador`); la invocación es familia autónoma (proceso→proceso) y queda fuera de ese alcance. Alternativa canónica: nodo de decisión booleano (AP-10) |
| Modificador sobre enlace escindido (TS4/TS5) | **PROHIBIDO** (`V-41`, `V-110`) | "Saltar un subproceso de una escisión distorsionaría la semántica del efecto" (`SSOT-metod §7.4`) |

### 6.5 Resolución de colisión de rol — fuerza semántica

Cuando un objeto tendría dos enlaces procedimentales hacia el mismo proceso (violando R-ROL-UNIC-1), prevalece el de mayor fuerza. Orden principal (`SSOT-visual §13.3`):

```
consumo = resultado > efecto > agente > instrumento
```

Orden secundario por modificador de control (dentro de cada clase):

```
evento > sin control > condición
```

Orden completo de **12 niveles** (`SSOT-visual §13.5`):

| Nivel | Enlace |
|---|---|
| 1 | Evento de consumo |
| 2 | Consumo = Resultado |
| 3 | Condición de consumo |
| 4 | Evento de efecto |
| 5 | Efecto |
| 6 | Condición de efecto |
| 7 | Evento de agente |
| 8 | Agente |
| 9 | Condición de agente |
| 10 | Evento de instrumento |
| 11 | Instrumento |
| 12 | Condición de instrumento |

- **R-FUERZA-1**: los niveles 1 y 3 contienen consumo únicamente; resultado NO DEBE aparecer con modificador.
- **R-FUERZA-2**: condición de instrumento es el enlace más débil del sistema.
- **R-FUERZA-3**: el modificador de condición DEBE debilitar la fuerza semántica respecto del enlace base.
- **R-FUERZA-4**: el modificador de evento DEBE fortalecer la fuerza semántica respecto del enlace base.

### 6.6 Matriz de precedencia transformadora (recomposición)

`SSOT-visual §13.1`: al recomponer subprocesos en un padre, si dos subprocesos tienen distintos enlaces hacia el mismo objeto:

| B↔P1 \ B↔P2 | Efecto | Resultado | Consumo |
|---|---|---|---|
| **Efecto** | Efecto | Resultado | Consumo |
| **Resultado** | Resultado | **Inválido** | Efecto |
| **Consumo** | Consumo | Efecto | **Inválido** |

- **R-PREC-1** (`V-43`): Resultado + Resultado y Consumo + Consumo sobre el mismo objeto son inválidos.
- **R-PREC-2**: Resultado + Consumo o Consumo + Resultado sobre el mismo objeto DEBE recomponerse como Efecto solo si hay continuidad de identidad y estados trazables.
- **R-PREC-3**: Resultado + Consumo o Consumo + Resultado sobre el mismo objeto DEBE reportarse como conflicto si no hay continuidad de identidad y estados trazables.
- **R-PREC-4**: la herramienta NO DEBE colapsar automáticamente la tensión matriz/prosa de `V-43` sin evidencia de continuidad.
- **R-PREC-5** (`V-44`): un enlace transformador SIEMPRE prevalece sobre un habilitador al recomponer.

### 6.7 Multiplicidad y cardinalidad (`SSOT-iso §Cardinalidades`, `SSOT-opl §12`)

| Símbolo | Rango | OPL-ES |
|---|---|---|
| `?` | 0..1 | un/una opcional |
| `*` | 0..* | opcional (cero o más) |
| (sin símbolo) | 1..1 | (default) |
| `+` | 1..* | al menos un/una |

- **R-MULT-1** (`V-23`): la multiplicidad aplica a enlaces etiquetados, agregación-participación y enlaces procedimentales.
- **R-MULT-1A**: la multiplicidad NO aplica a procesos directamente.
- **R-MULT-1B**: la repetición secuencial de proceso DEBE modelarse con proceso recurrente y contador.
- **R-MULT-1C**: la repetición paralela de proceso DEBE modelarse con subprocesos síncronos o asíncronos dentro de una descomposición.

Rangos canónicos: `qmín..qmáx`. Intervalos con inclusión/exclusión: `[a..b]`, `(a..b]`, `[a..b)`, `(a..b)`. Listas de intervalos: `[1..10], [20..30]`. Asterisco `*` como extremo abierto.

Restricciones: superficie EBNF normativa `=`, `<`, `>`, `<=`, `>=` y `en {conjunto}` (`SSOT-opl A.7`; R-OPL-RANGO-3, R-OPL-CONJ-1). Los glifos Unicode `≠`, `≤`, `≥`, `∈` son superficie de visualización y DEBEN normalizarse a la forma ASCII o declararse como extensión.

- **R-MULT-2** (`V-21`): los nombres de parámetros de multiplicidad DEBEN ser únicos en todo el modelo.

### 6.8 Probabilidad (`SSOT-iso §Operadores lógicos`)

`Pr=p` anota cada enlace de un abanico probabilístico. Las probabilidades suman 1.0. Por defecto sin abanico: si un proceso produce un objeto con `n` estados sin especificación, cada estado tiene probabilidad `1/n` (`SSOT-metod §10.10`).

- **R-PROB-1** (`V-18`): un abanico probabilístico DEBE ser siempre XOR.
- **R-PROB-1A**: en un abanico probabilístico exactamente un enlace DEBE activarse por ejecución.

---

## 7. Abanicos lógicos (XOR / OR)

### 7.1 Geometría (`SSOT-visual §5`)

| Operador | Símbolo gráfico | Semántica |
|---|---|---|
| AND | enlaces separados, sin arco | Todos los enlaces del fan se activan |
| XOR | arco discontinuo simple sobre el fan, en el extremo convergente | Exactamente uno de los enlaces se activa |
| OR | dos arcos discontinuos concéntricos sobre el fan | Al menos uno de los enlaces se activa |

- **R-FAN-GEO-1** (`V-16`): el arco lógico DEBE posicionarse en el extremo convergente del abanico.
- **R-FAN-GEO-2** (`V-17`): todo abanico DEBE clasificarse como convergente o divergente.

### 7.2 Aplicabilidad por familia (`V-15`, `SSOT-visual §5.5`)

| Familia | Convergente | Divergente |
|---|---|---|
| Consumo | N objetos → 1 proceso | 1 objeto → N procesos |
| Resultado | N procesos → 1 objeto | 1 proceso → N objetos |
| Efecto | N objetos ↔ 1 proceso | N procesos ↔ 1 objeto |
| Agente | (no aplica AND-equivalente convergente) | 1 agente → N procesos |
| Instrumento | (no aplica) | 1 instrumento → N procesos |
| Invocación | N procesos → 1 proceso | 1 proceso → N procesos |

### 7.3 Plantillas OPL-ES (`SSOT-opl §11.2`, `§11.3`)

| Familia | XOR | OR |
|---|---|---|
| Consumo convergente | *P* consume exactamente uno de **A**, **B** o **C**. | *P* consume al menos uno de **A**, **B** o **C**. |
| Consumo divergente | Exactamente uno de *P*, *Q* o *R* consume **B**. | Al menos uno de *P*, *Q* o *R* consume **B**. |
| Resultado convergente | Exactamente uno de *P*, *Q* o *R* genera **B**. | Al menos uno de *P*, *Q* o *R* genera **B**. |
| Resultado divergente | *P* genera exactamente uno de **A**, **B** o **C**. | *P* genera al menos uno de **A**, **B** o **C**. |
| Efecto (objetos) | *P* afecta exactamente uno de **A**, **B** o **C**. | *P* afecta al menos uno de **A**, **B** o **C**. |
| Efecto (procesos) | Exactamente uno de *P*, *Q* o *R* afecta **B**. | Al menos uno de *P*, *Q* o *R* afecta **B**. |
| Agente | **B** maneja exactamente uno de *P*, *Q* o *R*. | **B** maneja al menos uno de *P*, *Q* o *R*. |
| Instrumento | Exactamente uno de *P*, *Q* o *R* requiere **B**. | Al menos uno de *P*, *Q* o *R* requiere **B**. |
| Invocación divergente | *P* invoca exactamente uno de *Q* o *R*. | *P* invoca al menos uno de *Q* o *R*. |
| Invocación convergente | Exactamente uno de *P* o *Q* invoca *R*. | Al menos uno de *P* o *Q* invoca *R*. |

### 7.4 Combinación con modificadores (`SSOT-opl §11.4`)

**Evento + XOR/OR** — insertar "inicia" antes del verbo principal:

- *B* inicia exactamente uno de *P*, *Q* o *R*, que afecta **B**.

**Condición + XOR/OR** — insertar "ocurre si … existe / está en estado … de lo contrario … se omite":

- Exactamente uno de *P*, *Q* o *R* ocurre si **B** existe, de lo contrario se omite.

- **R-FAN-EST-1** (`V-15`, `V-237` aplicado a fans): cada enlace individual del fan PUEDE tener o no estado especificado independientemente.
- **R-FAN-PROB-1** (`§11.5`): un abanico probabilístico DEBE declarar `Pr=p` por enlace y suma total `1`.

### 7.5 Resultado-fan-XOR como expansión de resultado simple a objeto con estados (`V-19`)

> Un enlace de resultado simple hacia un objeto con estados es semánticamente equivalente a un abanico XOR de enlaces de resultado con estado especificado, uno por cada estado posible del objeto.

Es decir: `*P* genera **Obj**` (con n estados) ≡ `*P* genera exactamente uno de **Obj** en `s1`, **Obj** en `s2`, …, **Obj** en `sn``. La probabilidad por estado, sin especificar, es 1/n.

**Esta equivalencia NO autoriza** modificadores `c`/`e` sobre el abanico, dado que el fan sigue produciendo elementos del conjunto posterior (Post(P)).

### 7.6 m-de-f combinatorial (`SSOT-metod §10.5`)

- **R-FAN-M-1** (`SSOT-metod §10.5`): para fan-size `f > 2`, el modelador PUEDE generalizar a "exactamente m de f" en XOR combinatorial.
- **R-FAN-M-2**: para fan-size `f > 2`, el modelador PUEDE generalizar a "al menos m de f" en OR combinatorial.
- **R-FAN-M-3**: el valor `m` DEBE cumplir `m < f`.
- **R-FAN-M-4**: el valor `m` DEBE anotarse junto al arco.

---

## 8. Refinamiento

### 8.1 Mecanismos canónicos (`SSOT-iso §Gestión de contexto`, `SSOT-visual §10.1`, `SSOT-metod §8.1`)

| Par | Refinamiento | Abstracción | Ámbito |
|---|---|---|---|
| Estados | Expresión de estados | Supresión de estados | estados |
| Estructura | Despliegue (`unfolding`) | Plegado (`folding`) | comportamiento estructural |
| Comportamiento | Descomposición (`in-zooming`) | Recomposición (`out-zooming`) | comportamiento dinámico |
| Composición inter-modelo | Referencia a sub-modelo | Desconexión | cross-model |

- **R-REF-MEC-1** (`SSOT-iso §Mecanismos`): los mecanismos de despliegue/plegado estructural DEBEN aplicarse por relación fundamental: agregación, exhibición, generalización o clasificación.

### 8.2 Descomposición síncrona vs despliegue asíncrono

- **R-REF-SYNC-1** (`SSOT-iso §Mecanismos`, `SSOT-metod §7.1`): una descomposición (`in-zooming`) de proceso es síncrona; el proceso padre espera a que todos los subprocesos completen antes de devolver control.
- **R-REF-SYNC-2** (`SSOT-metod §7.2`): un despliegue (`unfolding`) es asíncrono respecto del flujo de control del proceso; revela estructura estática y NO implica secuenciación temporal.

### 8.3 Refinamiento no trivial (`SSOT-metod §7.1`)

- **R-REF-NTRIV-1**: un proceso descompuesto DEBE contener al menos **2 subprocesos** para cerrar como refinamiento canónico.
- **R-REF-NTRIV-2**: un despliegue DEBE revelar al menos **2 refinadores** para cerrar como refinamiento canónico.
- **R-REF-NTRIV-3**: un refinamiento con un solo elemento hijo NO DEBE cerrarse ni exportarse como refinamiento canónico; solo PUEDE persistir como placeholder de edición tipificado y DEBE eliminarse, postergarse o ampliarse antes del cierre.

### 8.4 Enlaces escindidos (`V-40`, `V-110`, `SSOT-iso §Enlaces transformadores escindidos`, `SSOT-opl §4.2 nota TS4/TS5`)

- **R-ESCIND-0**: la superficie TS4/TS5 designa dos hechos distinguibles por procedencia: **(a) fragmento escindido** (mitad de un par acoplado derivado de un TS3 al descomponer) y **(b) efecto parcial standalone** (enlace de efecto completo; TS4 con salida por defecto vía `V-9`). La prohibición de modificadores de control (R-ESC-1, `V-41`) aplica EXCLUSIVAMENTE al fragmento escindido (a); el efecto parcial standalone (b) admite evento o condición según R-EFE-3, ETS3 y ETS4. Un fragmento escindido NUNCA se origina por parseo de OPL aislado: solo se produce por la operación de descomposición y persiste con metadato de procedencia.
- **R-ESCIND-1**: cuando un efecto entrada-salida (TS3) se descompone en subprocesos, el modelo queda subespecificado hasta escindir el enlace.
- **R-ESCIND-2**: el subproceso temprano DEBE recibir el enlace de entrada (TS4) y sacar al objeto del estado de entrada.
- **R-ESCIND-3**: el subproceso tardío DEBE recibir el enlace de salida (TS5) y colocar al objeto en el estado de salida.

- **R-ESC-1** (`V-41`, `V-110`, `SSOT-metod §7.4`): NO existen versiones con modificador de control de los enlaces escindidos.
- **R-ESC-1A**: la escisión DEBE ser el único mecanismo canónico para resolver subespecificación de efecto al descomponer.

### 8.5 Distribución de enlaces al descomponer (`SSOT-visual §11`, `SSOT-metod §7.4`)

| Tipo de enlace | Contorno exterior del proceso padre | Distribución |
|---|---|---|
| Consumo | **PROHIBIDO** (`V-37`, `V-103`) | Migra al **primer** subproceso |
| Resultado | **PROHIBIDO** (`V-37`, `V-103`) | Migra al **último** subproceso |
| Efecto básico (sin estado) | PERMITIDO (`V-104`) | A todos los subprocesos |
| Efecto entrada-salida | — | Escisión TS4/TS5 (`V-104`, `V-40`) |
| Agente | PERMITIDO (`V-36`, `V-104`) | A todos los subprocesos |
| Instrumento | PERMITIDO (`V-36`, `V-104`) | A todos los subprocesos |
| Estructural | NO se distribuye (`V-105`) | Permanece asociado al contenedor |
| Evento sistémico | **PROHIBIDO** cruzar frontera (`V-38`) | — |
| Evento ambiental | Permitido cruzar frontera (`V-108`) | Con modelado de contingencia |

- **R-DIST-1** (`V-37`): consumo y resultado NO DEBEN conectarse al contorno exterior de un proceso descompuesto.
- **R-DIST-1A**: consumo y resultado DEBEN conectarse directamente al subproceso específico.

### 8.6 Contenedor y elementos externos (`V-79`–`V-85`)

- **R-HIJO-1** (`V-79`): al crear un OPD hijo, la cosa refinada DEBE aparecer como contenedor interno.
- **R-HIJO-2** (`V-80`): las cosas conectadas en el OPD padre DEBEN aparecer en el OPD hijo como elementos externos cuando la regla de copia correspondiente lo exija.
- **R-HIJO-3** (`V-81`): en descomposición de proceso, el OPD hijo DEBE copiar como externos todas las cosas conectadas al padre por cualquier enlace.
- **R-HIJO-4** (`V-82`): en despliegue de objeto o proceso, el OPD hijo DEBE copiar solo los hijos estructurales directos.
- **R-HIJO-5** (`V-83`): un elemento externo NO DEBE refinarse desde el OPD hijo donde aparece como externo.
- **R-HIJO-6** (`V-84`): los objetos internos creados dentro de una descomposición y sin apariencia en el padre DEBEN eliminarse en cascada cuando se elimina el proceso padre.

### 8.7 Identidad persistente vs etiqueta visible (`V-246`–`V-250`)

- **R-IDP-0** (`V-246`–`V-250`): orden temporal, orden de navegación e identidad persistente DEBEN mantenerse como canales separados.
- **R-IDP-0A**: el orden temporal se deriva de la coordenada vertical de subprocesos dentro de una descomposición y se rige por R-INV-2/R-INV-2A.
- **R-IDP-0B**: el orden de navegación se deriva de la posición en el árbol de OPDs y NO DEBE usarse como identidad persistente.
- **R-IDP-0C**: la identidad persistente DEBE ser un identificador estable recuperable en serialización y usado como ancla de referencia cruzada externa.

- **R-IDP-1** (`V-247`): la etiqueta `SDx.y` DEBE tratarse como proyección humana del orden de navegación, NO como identidad persistente.
- **R-IDP-1A**: la etiqueta `SDx.y` PUEDE mutar bajo reordenamiento o inserción de nodos.

- **R-IDP-2** (`V-248`): toda implementación conforme DEBE asignar a cada OPD un identificador persistente recuperable en la serialización, estable bajo renumeración.

- **R-IDP-3** (`V-249`): toda referencia externa al modelo que cite un OPD concreto (documentos, trazabilidad, tests) DEBE usar el identificador persistente, NO `SDx.y`.

### 8.8 Restricciones de refinamiento

- **R-REF-1** (`V-100`): NO se puede refinar una cosa desde dentro de su propio árbol de refinamiento (chequeo transitivo). Previene loops.
- **R-REF-2** (`V-101`, `V-102`): NO se puede crear instancia visual entre tipos diferentes (objeto no es instancia visual de proceso).
- **R-REF-3** (`V-113`): solo OPDs jerárquicos **hoja** son eliminables directamente del árbol jerárquico.
- **R-REF-4** (`V-95`, `V-96`, `V-97`): esencia, perseverancia y nombre NO cambian a través de refinamiento. Son invariantes.

### 8.9 Cambio de rol entre niveles (`V-42`, `V-111`, `V-112`, `SSOT-metod §9.4`)

- **R-ROL-1** (`SSOT-iso §Enlaces transformadores escindidos`, `V-42`, `V-111`, `V-112`): un objeto PUEDE ser instrumento en nivel abstracto y afectado en nivel detallado solo si el cambio neto entre entrada y salida del proceso abstracto es cero.
- **R-ROL-2** (`V-112`): el cambio de rol aplica solo a descomposición, no a despliegue.
- **R-ROL-3**: si el cambio neto no es cero, el objeto DEBE modelarse como afectado también en el nivel abstracto.

### 8.10 SD, árboles, vistas y OPL completo

- **R-SD-1** (`SSOT-iso §Completar el SD`): el SD DEBE modelar interesados, beneficiarios, proceso que entrega valor y cosas ambientales/sistémicas indispensables.
- **R-SD-2**: el SD DEBE contener solo cosas centrales e indispensables para un OPL breve y claro.
- **R-SD-3**: el valor funcional PUEDE aparecer como cambio de estado de un atributo del beneficiario o implícitamente si el beneficiario es afectado.
- **R-SD-4** (`SSOT-iso §Etiquetas OPD y navegación`): el SD contiene exactamente un proceso sistémico que expresa la función del sistema; puede contener procesos ambientales.
- **R-ARB-1** (`SSOT-iso §Árboles OPD`): el árbol de procesos OPD DEBE tener raíz `SD` y nodos correspondientes a OPDs creados por descomposición de procesos.
- **R-ARB-2**: el árbol de objetos OPD DEBE tener raíz en un objeto y mostrar su elaboración por refinamiento.
- **R-ARB-3**: las etiquetas `SD`, `SD1`, `SD1.1` y análogas son navegación visible; la política de identidad persistente es R-IDP-2.
- **R-ARB-4**: cada arista del árbol OPD DEBE tener semántica de refinamiento equivalente a `se refina por descomposición de NombreProceso en` o `se refina por despliegue de NombreCosa en`.
- **R-OPL-TOTAL-1** (`SSOT-iso §OPL del sistema completo`): el OPL completo del sistema DEBE obtenerse concatenando los párrafos OPL locales en orden de navegación del árbol OPD.
- **R-OPL-TOTAL-2**: el OPL completo NO DEBE describir solo el contexto actual; DEBE cubrir la totalidad del sistema individual cargado.
- **R-OPL-TOTAL-3**: en modelos compuestos, cada modelo individual conserva OPL local autocontenido y la composición entre modelos exige referencias explícitas.
- **R-OPL-TOTAL-4** (`SSOT-iso §Notas para implementadores`): el OPL correspondiente a un OPD DEBE expresar solo los estados de objeto visibles o referenciados en ese OPD.
- **R-OPL-TOTAL-5**: el conjunto completo de estados de un objeto DEBE calcularse como unión de sus estados a través de todos los OPDs del modelo individual.
- **R-VIEW-1** (`SSOT-iso §Mecanismos de refinamiento`): un OPD de vista PUEDE reunir hechos provenientes de múltiples OPDs para explicar un fenómeno o enfatizar un aspecto.
- **R-VIEW-2**: una vista NO DEBE crear hechos OPM nuevos por el solo hecho de materializar apariencias.
- **R-VIEW-3**: una vista DEBE tipificarse como jerárquica, vista anclada o vista ad hoc.
- **R-VIEW-4**: el mapa del sistema DEBE representarse como árbol de procesos OPD que muestra contenido de cada OPD como nodo; NO DEBE confundirse con un OPD jerárquico ordinario.
- **R-BRING-1** (`SSOT-iso §Gestión de contexto`): `bring connected things`, `bring links between selected entities` y operaciones equivalentes son operadores derivados de contexto; NO son mecanismos ontológicos de refinamiento.
- **R-SIMP-1** (`SSOT-iso §Simplificación de un OPD`): un OPD sobrecargado PUEDE simplificarse abstrayendo procesos y objetos hacia un constructo superior.
- **R-SIMP-2**: la simplificación de un OPD ESTÁ PROHIBIDA si crea enlaces procedimentales directos entre procesos pares sin semántica OPM.

### 8.11 Descomposición y recomposición como operaciones de herramienta

- **R-OPD-OP-1** (`SSOT-iso §Modelos de descomposición y recomposición en nuevo diagrama`): la descomposición en nuevo diagrama DEBE tratarse como operación OPM de herramienta que requiere `SDn`, realiza mostrar contenido, refina enlaces y genera `SDn+1`.
- **R-OPD-OP-2**: la recomposición en nuevo diagrama DEBE tratarse como operación inversa que requiere `SDn+1`, abstrae enlaces, oculta contenido y genera `SDn`.
- **R-OPD-OP-3**: un OPD semidescompuesto es transitorio; NO DEBE persistirse como estado canónico final salvo recuperación de edición declarada.
- **R-OPD-OP-4**: toda migración de enlaces durante descomposición/recomposición DEBE preservar identidad de hechos o declarar eliminación/creación explícita.
- **R-OPD-OP-5**: la herramienta PUEDE rastrear refinadores y ajustar automáticamente símbolo gráfico y OPL; si lo hace, DEBE conservar trazabilidad de cada ajuste automático.
- **R-OPD-OP-6**: la herramienta DEBE advertir si se intenta incluir un objeto como refinador en más de un contexto cuando ello pueda crear ambigüedad de pertenencia.
- **R-OPD-OP-7**: la herramienta PUEDE establecer sintaxis por defecto para nombres de refinadores ambiguos, pero DEBE hacer la resolución trazable.

---

## 9. Relación OPD↔OPL (bisimetría)

### 9.1 Principio (`V-65`, `SSOT-iso §Representación bimodal`)

- **R-BI-DUAL-1** (`V-65`, `SSOT-iso §Representación bimodal`): cada OPD tiene su contraparte en un párrafo OPL. La dualidad es bidireccional: toda afirmación gráfica DEBE ser reproducible como OPL, y toda oración OPL DEBE ser representable como constructo OPD.

### 9.2 Tabla de bisimetría (canónica)

- **R-BI-TAB-1**: esta tabla opera como gate mínimo de roundtrip OPD<->OPL; toda construcción visual listada DEBE emitirse con la plantilla indicada y toda plantilla indicada DEBE reconstruir el mismo hecho nuclear.

| Construcción visual | Plantilla OPL canónica |
|---|---|
| Rectángulo con sombra | **Cosa** es física. |
| Rectángulo sin sombra (default) | (default — no se emite oración salvo si se quiere explicitar) |
| Rectángulo punteado | **Cosa** es ambiental. |
| Elipse con sombra | *Cosa* es física. |
| Estado dentro de objeto | **Objeto** puede estar `estado1`, `estado2` o `estado3`. |
| Estado con borde grueso | Estado `s` de **Objeto** es inicial. |
| Estado con doble borde | Estado `s` de **Objeto** es final. |
| Estado con flecha diagonal | Estado `s` de **Objeto** es por defecto. |
| Estado con borde grueso + doble borde simultáneo | Estado `s` de **Objeto** es inicial y final. |
| Flecha objeto→proceso con punta cerrada | *Proceso* consume **Objeto**. (T1) |
| Flecha proceso→objeto con punta cerrada | *Proceso* genera **Objeto**. (T2) |
| Flecha bidireccional con puntas cerradas | *Proceso* afecta **Objeto**. (T3) |
| Flecha desde estado origen + flecha hacia estado destino | *Proceso* cambia **Objeto** de `entrada` a `salida`. (TS3) |
| Línea con piruleta negra (lollipop) en proceso | **Agente** maneja *Proceso*. (H1) |
| Línea con piruleta blanca en proceso | *Proceso* requiere **Instrumento**. (H2) |
| Anotación `e` sobre consumo | **Objeto** inicia *Proceso*, que consume **Objeto**. (ET1) |
| Anotación `c` sobre consumo | *Proceso* ocurre si **Objeto** existe, en cuyo caso **Objeto** se consume, de lo contrario *Proceso* se omite. (CT1) |
| Rayo proceso→proceso | *Invocador* invoca *Invocado*. (IV1) |
| Triángulo lleno con vértice al todo | **Todo** consta de **Parte1**, **Parte2** y **Parte3**. (RF1) |
| Triángulo con triángulo interior, vértice al exhibidor | **Exhibidor** exhibe **Atributo1**, **Atributo2**. (RF2) |
| Triángulo vacío, vértice al general | **Especialización1** y **Especialización2** son **General**. (RF3) |
| Triángulo con círculo interior, vértice a la clase | **Instancia** es una instancia de **Clase**. (RF4) |
| Proceso inflado con subprocesos verticales | *Proceso* se descompone en *P1*, *P2*, en esa secuencia. (CX1) |
| Arco discontinuo simple sobre fan | exactamente uno de … (XOR) |
| Arco doble sobre fan | al menos uno de … (OR) |
| Marca `/` sobre enlace de excepción | *Manejo* ocurre si duración de *Fuente* excede máx-duración. (EX1) |

### 9.3 Casos donde la bisimetría se rompe / requiere convención

- **R-BR-1** (`V-116`–`V-120`): el semi-plegado NO DEBE emitir OPL nuclear; para emitir OPL canónico DEBE desplegarse previamente o declararse como vista visual.
- **R-BR-2** (`SSOT-metod §10.3`): eventos OR y condiciones AND sobre el mismo proceso DEBEN conservarse como enlaces separados; si la combinación no queda expresada literalmente en OPL, DEBE persistirse como semántica de control tipificada.
- **R-BR-3** (`V-135`): tokens transitorios de flujo durante simulación NO pertenecen al canon-diagrama estático ni a OPL nuclear.
- **R-BR-4** (`V-204`): notas y sticky notes son contenido meta del autor; NO emiten OPL nuclear.
- **R-BR-5**: aliases `{alias}` y unidades `[u]` en rótulos pertenecen a capa computacional; NO DEBEN confundirse con OPL nuclear.

### 9.4 Principio de consistencia de hechos (`V-98`, `SSOT-iso §Principio de consistencia`)

- **R-CONSIST-1** (`V-98`, `SSOT-iso §Principio de consistencia`): un hecho afirmado en un OPD NO DEBE contradecir un hecho afirmado en otro OPD del mismo modelo.
- **R-CONSIST-2**: refinamiento o abstracción NO constituye contradicción.

### 9.5 Importancia proporcional (`V-99`)

- **R-IMP-1** (`V-99`): la importancia relativa de una cosa DEBE considerarse proporcional al OPD más alto del árbol donde aparece.
- **R-IMP-2**: una cosa que aparece en SD DEBE tratarse como más importante que una cosa que aparece solo en OPDs descendientes.

---

## 10. Escenarios OPD<->OPL — reglas de edición, importación y bloqueo

- **R-ESC-OP-1**: toda edición OPD válida DEBE proyectarse a OPL-ES canónico o metadato tipificado.
- **R-ESC-OP-2**: toda edición OPL-ES válida DEBE proyectarse a OPD canónico o metadato tipificado.
- **R-ESC-OP-3**: toda edición ambigua DEBE bloquearse hasta resolver identidad, firma o alcance.
- **R-ESC-OP-4**: toda edición prohibida DEBE rechazarse o persistirse únicamente como error estructural recuperable.

### 10.1 Principio de hecho único

- **R-BI-0**: OPD y OPL NO son dos modelos; son dos proyecciones del mismo hecho OPM canónico.
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

| # | Construcción no-canónica | Regla de rechazo | Acción canónica |
|---|---|---|---|
| AP-01 | **Resultado + modificador `c`** (sobre T2/TS2) | DEBE bloquearse: resultado pertenece a Post(P), no puede ser precondición; `SSOT-opl §7` no contiene plantilla. | Mover el control al lado de entrada mediante consumo, efecto, agente o instrumento condicional. |
| AP-02 | **Resultado + modificador `e`** | DEBE bloquearse: resultado pertenece a Post(P), no puede ser disparador; `SSOT-opl §6` no contiene plantilla. | Colocar el evento sobre consumo, efecto, agente o instrumento. |
| AP-03 | **Abanico XOR / OR de resultado + `c` o `e`** | DEBE bloquearse: cada enlace del fan sigue siendo resultado y hereda AP-01/AP-02. | Mover control al lado de entrada o usar fan probabilístico sin `c/e`. |
| AP-04 | **Resultado conectado directamente al estado inicial** | DEBE bloquearse por `V-8`. | Conectar al rectángulo del objeto o a un estado no inicial. |
| AP-05 | **Agente conectado a robot, software, IA o máquina** | DEBE bloquearse por `glosario 3.3` y `SSOT-metod §6.5`. | Usar enlace de instrumento. |
| AP-06 | **Consumo o resultado en contorno exterior de proceso descompuesto** | DEBE bloquearse por `V-37` y `V-103`. | Reasignar consumo al primer subproceso y resultado al último subproceso. |
| AP-07 | **Efecto entrada-salida sin escisión al descomponer** | DEBE bloquearse por `V-40` y `V-110`. | Reemplazar por TS4 en subproceso temprano y TS5 en subproceso tardío. |
| AP-08 | **Enlace escindido TS4/TS5 (par acoplado) + `c` o `e`** | DEBE bloquearse por `V-41`, `V-110` y `SSOT-metod §7.4`; no aplica a ETS3/ETS4 standalone (ver R-ESCIND-0). | Modelar opcionalidad sobre el efecto entrada-salida completo o con control externo. |
| AP-09 | **`c` o `e` sobre enlace estructural** | DEBE bloquearse: los modificadores son procedimentales y estructural es invariante temporal. | Usar enlace estructural con estado especificado solo cuando la variante estructural con estado esté definida. |
| AP-10 | **`c` o `e` sobre invocación** | DEBE bloquearse: los modificadores de control anotan EXCLUSIVAMENTE enlaces transformador/habilitador (`SSOT-iso §Control como modificador`; canon §6.1, R-ECA-4); la invocación es familia autónoma (R-INV-1A), por lo que el modificador queda fuera de su alcance definicional (error de categoría). | Usar nodo de decisión booleano, fan de invocación, u objeto booleano / condición sobre proceso previo (`SSOT-iso §Invocación cíclica con omisión condicional`). |
| AP-11 | **Bidireccional o recíproco con estado solo en destino** | DEBE bloquearse por `V-30`. | Usar unidireccional con estado en destino o agregar estado en origen. |
| AP-12 | **Estados de proceso** | DEBE bloquearse: OPM reserva estados para objetos. | Descomponer en subprocesos o usar atributo exhibido `Estado del Proceso`. |
| AP-13 | **Refinamiento con un solo subproceso o refinador** | DEBE bloquearse en cierre/export canónico; PUEDE persistir solo como placeholder de edición tipificado. | Eliminar, postergar o ampliar a ≥ 2 hijos. |
| AP-14 | **Duplicar estados para evitar inicial+final simultáneo** | DEBE bloquearse como sinónimo falso. | Marcar el estado único como inicial y final. |
| AP-15 | **Instancia visual entre tipos distintos** | DEBE bloquearse por `V-102`. | Usar apariencia del mismo tipo o clasificación-instanciación lógica. |
| AP-16 | **Refinamiento cíclico transitivo** | DEBE bloquearse por `V-100`. | Romper el ciclo de refinamiento. |
| AP-17 | **`SDx.y` como identificador estable externo** | DEBE bloquearse por `V-247`–`V-249`. | Usar identificador persistente. |
| AP-18 | **Modificar referencia externa en modelo consumidor** | DEBE bloquearse por `V-184`. | Modificar en modelo propietario o crear cosa distinta. |
| AP-19 | **Sombra decorativa en cosa informacional** | DEBE suprimirse en canon-diagrama por `V-124`. | Reservar sombra a esencia física. |
| AP-20 | **Triángulo estructural sin topología interna requerida** | DEBE bloquearse por `V-128`. | Renderizar triángulo interior o círculo interior según relación. |
| AP-21 | **Evento sistémico cruzando frontera de descomposición** | DEBE bloquearse por `V-38`. | Mover evento dentro de la descomposición o reclasificar como ambiental si corresponde. |
| AP-22 | **Sinónimos múltiples para la misma cosa** | DEBE reportarse por violar unicidad nominal. | Elegir nombre canónico y mapear variantes de superficie. |
| AP-23 | **Truncamiento silencioso de rótulo en export canónico** | DEBE bloquearse por `V-194` y `V-212`. | Ajustar bounding box, layout o tamaño antes de exportar. |
| AP-24 | **Reutilizar canales semánticos para UI/validación** | DEBE bloquearse por `V-198`, `V-203`, `V-220` y `V-224`. | Usar canal visual reservado a UI. |
| AP-25 | **Proceso explícito para soporte/mantenimiento sin esfuerzo sostenido relevante** | DEBE reportarse como mala clasificación metodológica. | Usar enlace estructural etiquetado. |
| AP-26 | **Objeto transiente creado y consumido sin observación intermedia** | DEBE reportarse como objeto artificial. | Usar enlace de invocación. |
| AP-27 | **Evento a subproceso intermedio sin justificar omisión previa** | DEBE bloquearse si subprocesos previos tienen efectos obligatorios no omitibles; DEBE advertirse si los previos son opcionales y la omisión está declarada. | Conectar al primer subproceso o declarar omisión válida de previos. |
| AP-28 | **`c` y `e` simultáneamente sobre el mismo enlace** | DEBE clasificarse como No canonizado (silencio SSOT, no contradicción): NO DEBE emitirse como OPL-ES nuclear; PUEDE persistir solo como extensión declarada o estado de edición (`R-AP-0`, `R-APP-5`). | Modelar control externo explícito. |
| AP-29 | **Enlaces heredados dibujados como explícitos** | DEBE bloquearse salvo vista derivada no nuclear. | Inferirlos por herencia desde generalización-especialización. |
| AP-30 | **Resultado+resultado o consumo+consumo sobre el mismo objeto al recomponer** | DEBE bloquearse por `V-43`. | Corregir el nivel hijo antes de recomponer. |

### 11.2 Zonas no canonizadas (silencios de la SSOT)

- **R-ZNC-1**: una construcción que no aparece explícitamente prohibida ni canonizada por la SSOT DEBE clasificarse como no canonizada.
- **R-ZNC-2**: la herramienta NO DEBE inventar regla OPM nuclear para una zona no canonizada.

| Zona | Estado |
|---|---|
| Combinación `c + e` sobre el mismo enlace | No definida. Tratar como NO canonizada (AP-28). |
| Enlace probabilístico sin fan | `Pr=p` se define solo dentro de abanicos (`V-18`); fuera no tiene canonicidad. |
| Etiquetas de ruta sobre enlaces habilitadores | SSOT-opl §13 solo canoniza consumo/resultado. No canonizadas sobre agente/instrumento. |

---

## 12. Aplicación a `deep-opm-pro`

- **R-APP-0**: este canon DEBE contener reglas estables de conformidad, no inventarios fechados de implementación.
- **R-APP-1**: el estado vivo de implementación DEBE documentarse fuera de este canon, en `docs/HANDOFF.md`, `docs/roadmap/` o ledger de bugs según corresponda.
- **R-APP-2**: el estado de implementación de una regla DEBE clasificarse como `enforzado`, `parcial`, `no implementado` o `zona laxa pendiente`.
- **R-APP-3**: una regla parcialmente enforzada NO DEBE considerarse cerrada hasta cubrir UI, kernel, importación, generación OPL y exportación aplicables.
- **R-APP-4**: si la UI permite una construcción no canónica, la herramienta DEBE restringir por defecto, bloquear persistencia canónica o persistirla únicamente como error estructural recuperable.
- **R-APP-5**: cuando la SSOT calle, la UI DEBE clasificar la construcción como `No canonizado` o `extensión declarada`; NO DEBE presentarla como prohibición ontológica ni como OPM nuclear.
- **R-APP-6**: todo commit que modifique validación de canonicidad DEBE citar las reglas locales `R-*` afectadas y, si la regla deriva de SSOT, la regla primaria (`V-*`, sección OPL, ISO o metodología).
- **R-APP-7**: toda divergencia OPCloud -> SSOT DEBE resolverse a favor de la SSOT salvo justificación explícita registrada en `docs/audits/`.

---

## Anexos

### Anexo A — Checklist de cierre OPD<->OPL

- **R-ANEXO-CHECK-1**: esta lista DEBE usarse para revisar cambios de modelado, parser, generador OPL, import/export o render canónico.

| Gate | Regla obligatoria | Falla si | Severidad |
|---|---|---|---|
| Identidad | Cada cosa, estado, enlace y OPD DEBE tener identidad persistente separada de su etiqueta visible. | se usa `SDx.y` o nombre visible como único identificador externo | Alta |
| Firma | Cada enlace DEBE respetar familia, dirección y tipos de extremos. | un procedural conecta objeto-objeto, un structural conecta estado, o una invocación toca objeto | Alta |
| Estado | Todo estado DEBE tener objeto propietario y designaciones válidas. | hay estado flotante, doble default o `Current` runtime serializado como designación | Alta |
| OPL | Todo hecho nuclear visible DEBE emitir plantilla OPL-ES canónica. | hay forma visual persistente sin plantilla ni metadato de vista | Alta |
| Parseo | Toda oración OPL aceptada DEBE reconstruir el mismo hecho. | el parser crea entidades plausibles ante ambigüedad | Alta |
| Modificadores | `c/e` DEBEN aparecer solo en input-side canónico. | resultado, estructural, invocación o TS4/TS5 reciben `c/e` | Alta |
| Refinamiento | Todo OPD hijo DEBE agregar detalle motivado y NO DEBE contradecir al padre. | replica layout, crea ciclo o cambia nombre/esencia/perseverancia | Alta |
| Distribución | Al descomponer, enlaces del padre DEBEN migrar según V-103/V-104/V-105. | consumo/resultado quedan en contorno exterior o TS3 queda sin escindir | Alta |
| Vistas | Vistas, Bring, sub-modelos y requirement views DEBEN estar tipificados. | una vista se confunde con OPD jerárquico ordinario | Media |
| UI | Handles, overlays, grid, tutorial, validación y runtime DEBEN separarse del canon. | un canal UI reutiliza contorno, sombra, piruleta, triángulo o halo semántico | Alta |
| Export | Todo perfil de export DEBE declarar canon-diagrama/canon-documento y recursos. | captura raster o screenshot se toma como prueba de canonicidad | Media |
| Deuda | Toda zona no canonizada DEBE quedar registrada como extensión, bloqueo o deuda explícita. | se acepta silenciosamente una construcción sin soporte SSOT | Alta |

### Anexo B — Desarrollo prescriptivo de cobertura `SSOT-visual`

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
| `V-129` | **R-VIS-TRI-1**: todo triángulo estructural canónico DEBE conectar por línea visible al menos con el refinable por el vértice y con un refinador por la base. |
| `V-130` | **R-VIS-TRI-2**: todo triángulo auxiliar de edición que no persista en export DEBE distinguirse por tamaño, color UI reservado o ubicación fuera de la geometría semántica. |
| `V-192` | **R-VIS-AUX-1**: el supresor `...` de enlaces no materializados solo pertenece a la gramática auxiliar si persiste en `canon-diagrama`. |
| `V-193` | **R-VIS-AUX-2**: todo triángulo o indicador compactado de relación hacia cosa ausente DEBE quedar anclado geométricamente a la cosa visible correspondiente. |
| `V-60`, `V-61`, `V-66` | **R-VIS-CONSTRUCT-1**: un OPD DEBE componerse de constructos; un constructo básico DEBE tener dos cosas y un enlace; el enlace DEBE tener origen, destino y conector con línea, símbolo, etiqueta opcional y ruta opcional. |
| §2.1 | **R-VIS-EST-1**: la renderización de estados DEBE cumplir R-EST-1; toda apariencia flotante DEBE bloquearse como estado inválido. |
| §2.3 | **R-VIS-EST-2**: los valores de atributo DEBEN renderizarse como estados del objeto-atributo cuando se visualicen como valores discretos, rangos o valores concretos de instancia. |
| `V-14` | **R-VIS-FAN-1**: múltiples enlaces del mismo tipo sin arco conector DEBEN interpretarse como AND. |
| `V-20` | **R-VIS-RUTA-1**: un proceso con etiquetas de ruta DEBE emparejar consumo/resultado por coincidencia exacta de etiqueta para formar trayectoria de ejecución. |
| `V-22` | **R-VIS-MULT-1**: toda multiplicidad DEBE colocarse junto al extremo del enlace o cerca del refinador estructural correspondiente. |
| `V-28`, `V-29`, `V-72` | **R-VIS-HER-1**: la herencia múltiple, el atributo discriminante y la herencia por despliegue DEBEN aplicarse aunque los enlaces heredados no se dibujen localmente. |
| `V-74`, `V-75`, `V-76` | **R-VIS-HER-2**: la afiliación DEBE heredarse por cadena estructural; una especialización PUEDE sobrescribir participante heredado con especialización válida; los enlaces comunes DEBEN migrar al general cuando se crea un general desde especializaciones. |
| `V-34`, `V-77`, `V-78` | **R-VIS-REF-1**: una descomposición de proceso DEBE inflar la elipse; la invocación implícita por posición vertical se rige por R-INV-2/R-INV-2A y aplica solo a esa descomposición; una descomposición de objeto codifica disposición, no tiempo. |
| `V-39` | **R-VIS-CTRL-1**: cuando una condición omite un subproceso, el control DEBE pasar al siguiente subproceso secuencial aplicable. |
| `V-45` | **R-VIS-DUR-1**: los valores de duración de proceso DEBEN mostrarse dentro de la elipse bajo el nombre y la unidad temporal con formato `{min, esperada, max}`. |
| `V-45` | **R-VIS-DUR-2**: la distribución de duración DEBE emitirse solo cuando el modelo la declara; si no existe distribución declarada, el export NO DEBE generar placeholder. |
| `V-46` | **R-VIS-SD-1**: el SD DEBE contener exactamente un proceso sistémico; procesos ambientales adicionales PUEDEN aparecer si permanecen ambientales. |
| `V-47` | **R-VIS-NOM-1**: toda apariencia visual DEBE renderizarse sin ambigüedad respecto de la cosa a la que refiere; la unicidad nominal se evalúa a nivel de modelo. |
| `V-48` | **R-VIS-REDIR-1**: toda cita legacy a `V-48` DEBE redirigirse a `V-4`; no existe regla visual independiente para estados fuera de objeto. |
| `V-49` | **R-VIS-CONS-1**: durante ejecución o animación, un objeto consumido DEBE desaparecer al inicio del proceso, no al final. |
| `V-52` | **R-VIS-APP-1**: cualquier elemento del modelo PUEDE aparecer en cualquier número de OPDs; eliminar una apariencia NO DEBE eliminar la existencia de la cosa. |
| `V-59` | **R-VIS-ASYNC-1**: subprocesos activados individualmente por eventos desde estados distintos DEBEN ejecutarse de forma asincrónica e independiente. |
| `V-62` | **R-VIS-INZOOM-1**: la descomposición en nuevo diagrama DEBE ejecutarse como `Mostrar Contenido` y luego `Refinar Enlaces`; la recomposición DEBE ejecutar las fases inversas. |
| `V-64`, `V-251` | **R-VIS-MODELO-1**: un modelo OPM DEBE contener `1..*` OPDs, `1..*` párrafos OPL y `0..*` referencias a sub-modelos; la clausura OPD<->OPL DEBE ser local a cada modelo individual. |
| `V-87`, `V-88`, `V-89` | **R-VIS-SUPR-1**: la supresión de estados aplica solo a descomposición; estados no referenciados NO se suprimen; múltiples OPDs hijo combinan supresiones por unión. |
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

---

Fin del documento. Mantener sincronizado con la SSOT KORA `v3.0.0` y siguientes.
