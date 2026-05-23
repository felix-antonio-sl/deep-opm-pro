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
- **R-DOC-2**: todo contenido conservado en este documento DEBE poder clasificarse como obligación, prohibición, condición, default, severidad, política de herramienta, matriz normativa o índice de trazabilidad.
- **R-DOC-3**: todo ejemplo conservado DEBE leerse como patrón permitido o patrón prohibido; si un ejemplo no decide comportamiento, DEBE eliminarse o moverse fuera de este canon.
- **R-DOC-4**: todo elemento normativo de `opm-iso-19450-es.md` DEBE estar cubierto por una regla local o por una delegación explícita a la capa propietaria (`opm-opl-es.md`, `opm-visual-es.md` o `metodologia-opm-es.md`).
- **R-DOC-5**: si una regla local diverge de la SSOT, la regla local queda inválida y DEBE abrirse corrección documental.
- **R-DOC-6**: si la SSOT contiene prosa informativa sin efecto operativo, este documento NO DEBE copiarla; DEBE extraer solo la obligación, prohibición o condición implementable.
- **R-DOC-7**: si una capacidad de herramienta no está canonizada por la SSOT, DEBE clasificarse como `UI / vista`, `No canonizado` o `extensión declarada`, nunca como OPM nuclear.

La exhaustividad prescriptiva se evalúa así:

| Plano | Este documento DEBE cubrir | Fuente propietaria |
|---|---|---|
| Ontologia | clases de cosas, estados, enlaces, transformaciones, refinamiento, existencia e identidad | `opm-iso-19450-es.md` |
| OPD | formas, contornos, profundidad, markers, anidamiento, refinamiento visual, vistas, export, UI vs canon | `opm-visual-es.md` |
| OPL-ES | plantillas de oracion por familia, EBNF delegada, vocabulario, nombres, roundtrip EN<->ES | `opm-opl-es.md` |
| Metodologia | SD, refinamiento, heuristicas, simulacion, requisitos, gobernanza, validacion | `metodologia-opm-es.md` |
| Bisimetria | reglas para que un hecho editado en OPD sea texto y un texto OPL vuelva al mismo hecho | las cuatro capas |

Este documento NO sustituye la SSOT fuente cuando una implementacion necesita la EBNF completa o la redaccion literal de una regla. Si aparece una divergencia entre este documento y la SSOT, se abre bug documental y se aplica la precedencia de §1.1.

Niveles de decision usados en tablas:

| Estado | Significado operativo |
|---|---|
| **Canonico** | Se puede crear, serializar, importar y editar bidireccionalmente. |
| **Canonico condicionado** | Se puede usar solo si se cumplen las condiciones indicadas; si faltan, la herramienta debe pedir datos o advertir. |
| **No canonizado** | La SSOT no lo define. No se debe inventar como OPM nuclear; solo puede existir como extension declarada. |
| **Prohibido** | Contradice una regla de la SSOT. La herramienta debe bloquearlo o reportarlo como error estructural. |
| **UI / vista** | Puede existir en pantalla, pero no es hecho OPM nuclear ni debe emitir OPL nuclear. |

### 1.4 Orden prescriptivo de lectura

- **R-READ-1**: las secciones 2–5 DEBEN usarse para decidir ontología, geometría, gramática y taxonomía de enlaces.
- **R-READ-2**: la sección 6 DEBE usarse para decidir composición de modificadores, incluida la asimetría `consumo + c/e` vs `resultado + c/e`.
- **R-READ-3**: las secciones 7–9 DEBEN usarse para decidir abanicos lógicos, refinamiento y bisimetría OPD↔OPL.
- **R-READ-4**: la sección 10 DEBE usarse para decidir edición, importación, exportación y bloqueo OPD<->OPL.
- **R-READ-5**: la sección 11 DEBE usarse para bloquear anti-patrones y zonas no canonizadas.
- **R-READ-6**: la sección 12 DEBE usarse para clasificar el estado de implementación en `deep-opm-pro`.
- **R-READ-7**: los anexos DEBEN usarse como matrices rápidas, glosario, índices de cobertura y checklist de roundtrip.

Las **tablas son normativas**. La prosa fuera de tablas solo es válida si formula una regla aplicable.

### 1.5 Conformidad OPM

| Nivel de conformidad | Reglas obligatorias |
|---|---|
| Parcial simbólico | **R-CONF-1**: usar exclusivamente símbolos OPM y elementos con semántica asignada. |
| Completo | **R-CONF-2**: cumplir R-CONF-1 y aplicar consistentemente principios, contexto, refinamiento, dualidad OPD↔OPL y consistencia de hechos. |
| Herramienta | **R-CONF-3**: cumplir R-CONF-1/R-CONF-2, soportar validación de conformidad completa y soportar OPL-ES conforme a EBNF. |

- **R-CONF-4** (`SSOT-iso §Alcance y conformidad`): una implementación que persiste símbolos sin semántica OPM asignada NO es conforme como herramienta OPM.
- **R-CONF-5**: una implementación que permite construir modelos completos pero no valida refinamiento, contexto o consistencia OPD↔OPL solo puede declararse parcial, no herramienta conforme.
- **R-CONF-6**: una implementación que acepta OPL fuera de EBNF DEBE clasificarlo como legacy, extensión o error; NO DEBE presentarlo como OPL-ES canónico.

### 1.6 Principios de modelado como reglas

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
- **R-COSA-3**: el estado NO es una cosa. Es una situación de un objeto (`glosario 3.68`). Se renderiza como rectángulo redondeado **contenido** dentro de un objeto (`V-4`).

### 2.2 Objetos (3.39)

- **R-OBJ-1**: un objeto representa una cosa con existencia física o informacional potencial (`SSOT-iso §Objetos`).
- **R-OBJ-2**: un objeto puede ser **con estados** (`s ≥ 1`, glosario 3.66) o **sin estados** (`s = 0`, glosario 3.67). Un objeto sin estados **no puede ser afectado**: solo puede crearse (resultado) o consumirse (consumo) (`V-5`, `SSOT-iso §Estados`).
- **R-OBJ-3**: cada objeto tiene tres propiedades genéricas (`SSOT-iso §Propiedades genéricas`):
  - **perseverancia** = persistente (fija);
  - **esencia** ∈ {física, informacional}, default informacional (`V-1`);
  - **afiliación** ∈ {sistémica, ambiental}, default sistémica (`V-1`).
- **R-OBJ-4**: un objeto puede declarar tipo computacional ∈ {`boolean`, `string`, `integer`, `float`, `double`, `short`, `long`, `enumerated`} (`SSOT-iso §Cardinalidades`, `SSOT-opl §12.1`).
- **R-OBJ-5** (`SSOT-iso §Notas para implementadores`): una herramienta PUEDE permitir esencia primaria de sistema como default de esencia; ese default NO DEBE sobrescribir esencia explícita de una cosa.
- **R-OBJ-6** (`SSOT-iso §Propiedades genéricas`): los atributos de objetos ambientales DEBEN ser ambientales.
- **R-OBJ-7**: los procesos ejecutados por entidades ambientales DEBEN modelarse como procesos ambientales.

### 2.3 Procesos (3.58)

- **R-PROC-1**: un proceso transforma uno o más objetos (`glosario 3.58`, `glosario 3.77`).
- **R-PROC-2**: todo proceso explícito DEBE transformar al menos un objeto (`V-115`). Habilitadores no satisfacen este requisito.
- **R-PROC-3**: un proceso tiene duración positiva (`SSOT-iso §Procesos`).
- **R-PROC-4**: **OPM no admite estados de proceso** ("iniciado", "en proceso", "terminado") (`SSOT-iso §Glosario, notas normativas`). Si se requiere modelar esas fases, se descompone en subprocesos *Iniciar*, *Procesar*, *Finalizar*.
- **R-PROC-5** (`SSOT-iso §Procesos`): un proceso persistente solo es canónico si la temporalidad, el esfuerzo sostenido o la condición mantenida forman parte del hecho de modelo.
- **R-PROC-6**: un proceso persistente NO DEBE usarse como escape genérico para eludir R-PROC-2. Si no hay transformación ni condición sostenida relevante, DEBE reemplazarse por enlace estructural etiquetado, atributo o estado.
- **R-PROC-7**: cuando un proceso persistente conserva un objeto en el mismo estado, el modelo DEBE declarar explícitamente el objeto afectado y la invariancia neta (`estado_entrada = estado_salida`) o el atributo/condición mantenida.

### 2.4 Nombres válidos (OPL-ES)

**Objetos** (`SSOT-opl §1.2`):
- sustantivo singular, palabras léxicas capitalizadas;
- plurales con sufijo: **Conjunto** para inanimados, **Grupo** para humanos (ej. `Conjunto de Ingredientes`, `Grupo de Comensales`).

**Procesos** (`SSOT-opl §1.1`, `§17.2`): un nombre válido cumple **al menos una** de:
1. primera palabra en infinitivo `-ar` / `-er` / `-ir` (`Cocinar`, `Procesar`);
2. primera palabra termina en `-ción` (`Verificación`, `Ampliación`);
3. primera palabra termina en `-miento` (cuando el dominio lo justifique: `Mantenimiento Preventivo`).

Preferencia: 2 a 4 palabras. Capitalización en palabras léxicas; artículos y preposiciones breves pueden quedar en minúscula.

**Estados** (`SSOT-opl §1.3`): minúsculas, forma pasiva o descriptiva (`crudo`, `pre-cortado`, `vacío`).

**Etiquetas** (estructurales): frases breves en minúscula (`SSOT-opl §A.3`).

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
- **R-INS-5**: una simulación DEBE rastrear número e identidad de instancias operacionales de objetos y procesos.
- **R-INS-6**: una instancia especializada NO DEBE existir en ejecución sin la instancia general de la que hereda.

### 2.8 Modelo conceptual, ejecución y realización

- **R-EJEC-1** (`SSOT-iso §Modelos conceptuales y de ejecución`): el modelo conceptual DEBE describir patrones de estructura y comportamiento; NO DEBE confundirse con una ocurrencia operacional.
- **R-EJEC-2**: el modelo de ejecución DEBE representar instancias operacionales durante simulación.
- **R-EJEC-3**: el estado de runtime NO DEBE persistirse como canon conceptual salvo snapshot declarado.
- **R-EJEC-4**: un modelo solo es realizable como simulación si expresa detalle consistente suficiente para activar recursos, ejecutar procesos, transformar objetos y producir valor funcional.
- **R-EJEC-5**: la completitud formal de un modelo ejecutable DEBE evaluarse por capacidad de realización, no por cantidad de diagramas.
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

| Elemento | Borde | Fondo |
|---|---|---|
| Objeto | Verde | Transparente/blanco |
| Proceso | Azul oscuro | Transparente/blanco |
| Estado | Verde oliva | Gris claro |
| Enlace estructural | Negro | — |
| Enlace procedimental | Negro | — |

### 3.6 Tipografía y rotulado

- **R-ROT-1** (`V-194`): el rótulo visible permanece íntegro en canon-diagrama. NO se admite truncamiento con elipsis ni corte silencioso.
- **R-ROT-2** (`V-195`): el rótulo permanece inscrito en el bounding box visible de la cosa, salvo estilos tipificados.
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

### 3.12 Refinamiento visual (`SSOT-visual §10`, resumen)

| Mecanismo | Ámbito | Marca visual |
|---|---|---|
| Descomposición (in-zooming) | Comportamiento (procesos), espacial (objetos) | Cosa refinada inflada en OPD hijo; contorno grueso en padre Y hijo |
| Recomposición (out-zooming) | inverso | — |
| Despliegue (unfolding) intradiagrama | Estructura (vía relación fundamental) | Sin contorno grueso (mismo OPD) |
| Despliegue (unfolding) en nuevo diagrama | Estructura | Contorno grueso en padre Y hijo |
| Plegado (folding) | inverso del despliegue | — |
| Expresión / Supresión de estados | Estados | Estado visible / supresor `...` |
| Composición inter-modelo | Cross-model | Sub-modelo referenciado; distintivo de vínculo externo (`V-183`) |

### 3.13 Tamaños, layout y grid

- **R-LAY-1** (`V-50`): un OPD legible NO supera 20–25 cosas por contexto.
- **R-LAY-2** (`V-51`): no debe haber oclusión entre cosas; los enlaces no atraviesan áreas ocupadas; minimizar cruces.
- **R-LAY-3** (`V-196`): la grid es decoración opcional de edición; se suprime en exportaciones canónicas.
- **R-LAY-4** (`V-35`, `V-55`): dentro de una descomposición de proceso, **la línea de tiempo fluye de arriba hacia abajo**. La posición vertical determina secuencia.

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
- **R-OPL-VERB-2**: el parser DEBE tratar el primer verbo conjugado fijo como ancla léxica primaria para detectar idioma EN/ES.

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

**Nota crítica**: TS4/TS5 son la realización textual del **enlace escindido** producido al descomponer un efecto entrada-salida (TS3) en múltiples subprocesos (`V-40`, `V-110`).

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

**Crítico**: NO existen `ET3` (evento de resultado) ni `ETS5/6` (evento de resultado con estado). El resultado NO existe antes del proceso (ver §6.3).

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

**Crítico**: NO existen `CT3` (condición de resultado simple) ni `CS-resultado` (condición de resultado con estado). La SSOT-OPL §7 NO contiene plantilla CT/CS para resultado (esta es la regla que motivó este documento).

- **R-OPL-COND-ALT-1** (`A.6`): el parser OPL-ES DEBE aceptar la variante de consumo condicional `Si **Objeto** existe entonces *Proceso* ocurre y consume **Objeto**, de lo contrario se omite *Proceso*.`.
- **R-OPL-COND-ALT-2**: el generador canónico DEBE preferir CT1 sobre la variante alternativa de R-OPL-COND-ALT-1, salvo modo de preservación de superficie.

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

- **R-OPL-CX-ID-1** (`SSOT-opl §10.3`): toda oración de refinamiento entre OPDs que use etiqueta visible `SDx.y` DEBE mapearse a identificador persistente recuperable en serialización.
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
- **R-OPL-RANGO-1** (`A.2`): un rango textual DEBE usar `valor`, `varía de X a Y`, o intervalos `[..]`/`(..)` con extremo abierto `*` cuando aplique.
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
- **R-EFE-3**: efecto con solo estado de entrada (TS4) sin estado de salida especificado → destino = estado por defecto, o distribución de probabilidad de estados si no hay defecto (`V-9`).

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
- **R-AG-4**: si un instrumento se reclasifica por desgaste, el modelo DEBE agregar atributo de degradación/amortización y proceso de mantenimiento separado cuando aplique.

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

Un objeto/estado tiene **exactamente un rol** respecto de un proceso enlazado: transformado O habilitador, NUNCA ambos simultáneamente para el mismo enlace. Resolución de colisión por **fuerza semántica** (§6.5).

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

**Crítico**: `e` y `c` son **modificadores del lado de entrada** (`input-side`). Aplican al **conjunto previo al proceso** (Pre(P) — consumidos, afectados pre-transición, habilitadores requeridos). El conjunto posterior (Post(P) — resultantes, afectados post-transición) NO admite ni evento ni condición.

Esta restricción es **absoluta** (`SSOT-iso §Enlaces transformadores`, nota normativa explícita).

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
- **R-MOD-4**: el conjunto posterior al proceso NO admite precondiciones.
- **R-MOD-5** (`V-43`): la matriz de fuerza semántica NO DEBE contener niveles de evento de resultado ni condición de resultado.

### 6.4 Otras combinaciones de modificadores

| Combinación | Estado canónico | Notas |
|---|---|---|
| `c` + estado especificado | Canónico (CS1–CS6) | Restringe la condición a un estado concreto del objeto/agente/instrumento |
| `e` + estado especificado | Canónico (ETS1–ETS4, EHS1–EHS2) | El estado específico del objeto dispara |
| `c` + `e` sobre el mismo enlace | NO definido en SSOT | No aparece en gramática OPL ni en geometría visual. Tratar como no canonizado |
| Modificador sobre enlace estructural | NO existe | `c` y `e` son modificadores procedimentales exclusivamente |
| Modificador sobre invocación | NO existe en SSOT | La invocación es proceso→proceso; no admite `c` ni `e` en `SSOT-opl §8.2` |
| Modificador sobre enlace escindido (TS4/TS5) | **PROHIBIDO** (`V-41`, `V-110`) | "Saltar un subproceso de una escisión distorsionaría la semántica del efecto" (`SSOT-metod §7.4`) |

### 6.5 Resolución de colisión de rol — fuerza semántica

Cuando un objeto tendría dos enlaces procedimentales hacia el mismo proceso (violando `V-11`), prevalece el de mayor fuerza. Orden principal (`SSOT-visual §13.3`):

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

Restricciones: `=`, `≠`, `<`, `≤`, `≥`, `∈ {conjunto}`.

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

Cuatro pares de despliegue-plegado, uno por relación fundamental: agregación, exhibición, generalización, clasificación (`SSOT-iso §Mecanismos`).

### 8.2 Descomposición síncrona vs despliegue asíncrono

- **Descomposición** (`in-zooming`): síncrona. El proceso padre espera a que todos los subprocesos completen antes de devolver control (`SSOT-iso §Mecanismos`). Aplica cuando los subprocesos tienen orden fijo (`SSOT-metod §7.1`).
- **Despliegue** (`unfolding`): asíncrono respecto del flujo de control del proceso. Revela estructura estática sin implicar secuenciación temporal. Aplica cuando los subprocesos son independientes y pueden ocurrir en cualquier orden (`SSOT-metod §7.2`).

### 8.3 Refinamiento no trivial (`SSOT-metod §7.1`)

Un proceso descompuesto DEBE contener al menos **2 subprocesos**. Un despliegue DEBE revelar al menos **2 refinadores**. Un refinamiento con un solo elemento hijo no agrega información y DEBERÍA eliminarse o postergarse.

### 8.4 Línea de tiempo (`V-35`, `V-55`)

Dentro de un proceso descompuesto (in-zoomed), **el tiempo fluye de arriba hacia abajo**. La posición vertical de un subproceso determina su secuencia. Subprocesos cuyo borde superior está a la misma altura **se ejecutan en paralelo**; el último en terminar inicia al siguiente nivel.

### 8.5 Enlaces escindidos (`V-40`, `V-110`, `SSOT-iso §Enlaces transformadores escindidos`, `SSOT-opl §4.2 nota TS4/TS5`)

- **R-ESCIND-1**: cuando un efecto entrada-salida (TS3) se descompone en subprocesos, el modelo queda subespecificado hasta escindir el enlace.
- **R-ESCIND-2**: el subproceso temprano DEBE recibir el enlace de entrada (TS4) y sacar al objeto del estado de entrada.
- **R-ESCIND-3**: el subproceso tardío DEBE recibir el enlace de salida (TS5) y colocar al objeto en el estado de salida.

- **R-ESC-1** (`V-41`, `V-110`, `SSOT-metod §7.4`): NO existen versiones con modificador de control de los enlaces escindidos.
- **R-ESC-1A**: la escisión DEBE ser el único mecanismo canónico para resolver subespecificación de efecto al descomponer.

### 8.6 Distribución de enlaces al descomponer (`SSOT-visual §11`, `SSOT-metod §7.4`)

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

### 8.7 Contenedor y elementos externos (`V-79`–`V-85`)

Al crear OPD hijo:
- la cosa refinada aparece como **contenedor** (interno);
- las cosas conectadas vía enlaces en el padre se copian como **elementos externos** (`V-80`);
- en **descomposición** se copian TODAS las cosas conectadas vía cualquier enlace (`V-81`);
- en **despliegue** se copian SOLO los hijos estructurales directos (`V-82`);
- los elementos externos NO son refinables en su propio OPD hijo (`V-83`);
- objetos internos (creados dentro de la descomposición, sin apariencia en padre) son eliminados en cascada cuando se elimina el proceso padre (`V-84`).

### 8.8 Identidad persistente vs etiqueta visible (`V-246`–`V-250`)

Tres canales distinguibles:

1. **Orden temporal** — coordenada vertical de subprocesos dentro de descomposición.
2. **Orden de navegación** — posición en el árbol de OPDs.
3. **Identidad persistente** — identificador estable (UUID, URI, slug) usado como ancla de referencia cruzada externa.

- **R-IDP-1** (`V-247`): la etiqueta `SDx.y` DEBE tratarse como proyección humana del orden de navegación, NO como identidad persistente.
- **R-IDP-1A**: la etiqueta `SDx.y` PUEDE mutar bajo reordenamiento o inserción de nodos.

- **R-IDP-2** (`V-248`): toda implementación conforme DEBE asignar a cada OPD un identificador persistente recuperable en la serialización, estable bajo renumeración.

- **R-IDP-3** (`V-249`): toda referencia externa al modelo que cite un OPD concreto (documentos, trazabilidad, tests) DEBE usar el identificador persistente, NO `SDx.y`.

### 8.9 Restricciones de refinamiento

- **R-REF-1** (`V-100`): NO se puede refinar una cosa desde dentro de su propio árbol de refinamiento (chequeo transitivo). Previene loops.
- **R-REF-2** (`V-101`, `V-102`): NO se puede crear instancia visual entre tipos diferentes (objeto no es instancia visual de proceso).
- **R-REF-3** (`V-113`): solo OPDs jerárquicos **hoja** son eliminables directamente del árbol jerárquico.
- **R-REF-4** (`V-95`, `V-96`, `V-97`): esencia, perseverancia y nombre NO cambian a través de refinamiento. Son invariantes.

### 8.10 Cambio de rol entre niveles (`V-42`, `V-111`, `V-112`, `SSOT-metod §9.4`)

- **R-ROL-1** (`SSOT-iso §Enlaces transformadores escindidos`, `V-42`, `V-111`, `V-112`): un objeto PUEDE ser instrumento en nivel abstracto y afectado en nivel detallado solo si el cambio neto entre entrada y salida del proceso abstracto es cero.
- **R-ROL-2** (`V-112`): el cambio de rol aplica solo a descomposición, no a despliegue.
- **R-ROL-3**: si el cambio neto no es cero, el objeto DEBE modelarse como afectado también en el nivel abstracto.

### 8.11 SD, árboles, vistas y OPL completo

- **R-SD-1** (`SSOT-iso §Completar el SD`): el SD DEBE modelar interesados, beneficiarios, proceso que entrega valor y cosas ambientales/sistémicas indispensables.
- **R-SD-2**: el SD DEBE contener solo cosas centrales e indispensables para un OPL breve y claro.
- **R-SD-3**: el valor funcional PUEDE aparecer como cambio de estado de un atributo del beneficiario o implícitamente si el beneficiario es afectado.
- **R-SD-4** (`SSOT-iso §Etiquetas OPD y navegación`): el SD contiene exactamente un proceso sistémico que expresa la función del sistema; puede contener procesos ambientales.
- **R-ARB-1** (`SSOT-iso §Árboles OPD`): el árbol de procesos OPD DEBE tener raíz `SD` y nodos correspondientes a OPDs creados por descomposición de procesos.
- **R-ARB-2**: el árbol de objetos OPD DEBE tener raíz en un objeto y mostrar su elaboración por refinamiento.
- **R-ARB-3**: las etiquetas `SD`, `SD1`, `SD1.1` y análogas son navegación visible; NO son identidad persistente.
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

### 8.12 Descomposición y recomposición como operaciones de herramienta

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

Cada OPD tiene su contraparte en un párrafo OPL. La dualidad es **bidireccional**: toda afirmación gráfica DEBE ser reproducible como OPL, y toda oración OPL DEBE ser representable como constructo OPD.

### 9.2 Tabla de bisimetría (canónica)

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

### 9.3 Casos donde la bisimetría es perfecta

- T1–T3 (transformadores básicos);
- H1–H2 (habilitadores básicos);
- RF1–RF4 (estructurales fundamentales);
- CX1–CX8 (gestión de contexto);
- IV1–IV2 (invocación).

### 9.4 Casos donde la bisimetría se rompe / requiere convención

- **R-BR-1** (`V-116`–`V-120`): el semi-plegado NO DEBE emitir OPL nuclear; para emitir OPL canónico DEBE desplegarse previamente o declararse como vista visual.
- **R-BR-2** (`SSOT-metod §10.3`): eventos OR y condiciones AND sobre el mismo proceso DEBEN conservarse como enlaces separados; si la combinación no queda expresada literalmente en OPL, DEBE persistirse como semántica de control tipificada.
- **R-BR-3** (`V-135`): tokens transitorios de flujo durante simulación NO pertenecen al canon-diagrama estático ni a OPL nuclear.
- **R-BR-4** (`V-204`): notas y sticky notes son contenido meta del autor; NO emiten OPL nuclear.
- **R-BR-5**: aliases `{alias}` y unidades `[u]` en rótulos pertenecen a capa computacional; NO DEBEN confundirse con OPL nuclear.

### 9.5 Principio de consistencia de hechos (`V-98`, `SSOT-iso §Principio de consistencia`)

- **R-CONSIST-1** (`V-98`, `SSOT-iso §Principio de consistencia`): un hecho afirmado en un OPD NO DEBE contradecir un hecho afirmado en otro OPD del mismo modelo.
- **R-CONSIST-2**: refinamiento o abstracción NO constituye contradicción.

### 9.6 Importancia proporcional (`V-99`)

- **R-IMP-1** (`V-99`): la importancia relativa de una cosa DEBE considerarse proporcional al OPD más alto del árbol donde aparece.
- **R-IMP-2**: una cosa que aparece en SD DEBE tratarse como más importante que una cosa que aparece solo en OPDs descendientes.

---

## 10. Escenarios OPD<->OPL — reglas de edición, importación y bloqueo

- **R-ESC-OP-1**: toda edición OPD válida DEBE proyectarse a OPL-ES canónico o metadato tipificado.
- **R-ESC-OP-2**: toda edición OPL-ES válida DEBE proyectarse a OPD canónico o metadato tipificado.
- **R-ESC-OP-3**: toda edición ambigua DEBE bloquearse hasta resolver identidad, firma o alcance.
- **R-ESC-OP-4**: toda edición prohibida DEBE rechazarse o persistirse únicamente como error estructural recuperable.

### 10.1 Principio de hecho unico

- **R-BI-0**: OPD y OPL NO son dos modelos; son dos proyecciones del mismo hecho OPM canónico.
- **R-BI-0A**: una edición OPD válida DEBE modificar el hecho OPM canónico y regenerar OPL.
- **R-BI-0B**: una edición OPL válida DEBE modificar el hecho OPM canónico y regenerar OPD.

- **R-BI-1**: el kernel del modelo es la autoridad de identidad. OPD y OPL NO DEBEN divergir silenciosamente.

- **R-BI-2**: si una oracion OPL-ES parseada no puede mapearse a una firma OPD canonica, el parser DEBE rechazarla o clasificarla como no soportada; NO DEBE crear un grafo plausible.

- **R-BI-3**: si una forma OPD visible no emite OPL nuclear, DEBE estar clasificada como UI/vista/meta/estilo/export y NO como hecho OPM.

- **R-BI-4**: todo roundtrip DEBE preservar el hecho, no necesariamente la superficie literal. Variantes de superficie PUEDEN mapear al mismo proceso solo si el nombre canonico interno asi lo declara.

### 10.2 Estados de roundtrip

| Estado | OPD -> OPL | OPL -> OPD | Politica |
|---|---|---|---|
| Roundtrip perfecto | una forma visual produce una oracion unica | esa oracion reconstruye el mismo hecho | canonico |
| Roundtrip con metadato | la forma visual necesita IDs, perfil, vista o estado de export | la oracion necesita resolver identidad persistente | canonico condicionado |
| OPL informativo | OPL describe una propiedad no visible por defecto | OPD puede no cambiar o debe mostrar metadato | permitido si hay serializacion recuperable |
| OPD vista/UI | visible en canvas pero no hecho nuclear | no emite OPL nuclear | permitido como vista |
| Ambiguo | varias firmas posibles | requiere pregunta o seleccion del usuario | bloquear hasta resolver |
| Prohibido | contradice firma, ontologia o visual canonica | no se importa | error estructural |

### 10.3 Matriz de entidades, estados y nombres

| Escenario | Se puede hacer | No se puede hacer | OPL bidireccional |
|---|---|---|---|
| Crear objeto | Rectangulo; esencia y afiliacion declaradas o default | Crear "entidad" generica sin tipo | D1-D4 opcionales; D11 persistente opcional |
| Crear proceso | Elipse; debe transformar al menos un objeto salvo persistente valido | Proceso aislado con solo agente/instrumento | D1-D4 opcionales; D12 transitorio opcional; enlaces T/TS requeridos para cierre |
| Estado de objeto | Rountangle contenido en objeto | Estado flotante o estado dentro de proceso | D5-D10/D13 segun designacion |
| Objeto sin estados | Puede consumirse o generarse | Ser afectado por enlace de efecto | T1/T2; nunca T3/TS3 |
| Objeto con estados | Puede participar en efecto, resultado con estado, consumo con estado | Conectar resultado directamente al estado inicial | TS1-TS5, D5-D13 |
| Estado inicial y final simultaneo | Permitido para ciclos cerrados | Duplicar `empty_start`/`empty_end` para esquivar la marca doble | D10 |
| `Current` declarado | Permitido como designacion persistente | Confundirlo con runtime actual de simulacion | D13; runtime no es D13 salvo snapshot declarado |
| Alias decorativo | Parentesis en rotulo, reversible | Usar parentesis como binding computacional | No altera OPL nuclear |
| Alias computacional | `{alias}` unico en alcance declarado | Reusar alias o mezclarlo con alias decorativo | Metadato canonico; OPL nuclear puede omitir si export conserva referencia |
| Unidad | `[u]` despues del nombre en atributo cuantitativo | Interpretar `[]` como multiplicidad de enlace | Metadato/OPL de atributo si perfil lo declara |
| Nombre pobre | Puede existir solo como decision declarada temporal | Aceptarlo como canon sin supuesto | Reporte metodologico; OPL preserva nombre canonico elegido |

### 10.4 Matriz de enlaces procedimentales

| Familia | OPD canonico | OPL canonico | Permitido | Prohibido |
|---|---|---|---|---|
| Consumo | Objeto -> Proceso, punta cerrada en proceso | T1/TS1 | objeto con o sin estados; con `c`/`e`; con estado origen | proceso->objeto; estado destino; resultado disfrazado |
| Resultado | Proceso -> Objeto, punta cerrada en objeto | T2/TS2 | objeto con o sin estados; estado destino no inicial | `c`/`e`; conectar directo a estado inicial |
| Efecto | Objeto <-> Proceso, dos puntas cerradas | T3/TS3/TS4/TS5 | objeto con estados; cambio entrada-salida; escision al descomponer | objeto sin estados; TS4/TS5 con `c`/`e` |
| Agente | Objeto humano -> Proceso, piruleta negra | H1/HS1 | humano o grupo humano; multiples co-agentes AND | software/robot/IA como agente; mismo objeto como agente e instrumento del mismo proceso |
| Instrumento | Objeto no humano -> Proceso, piruleta blanca | H2/HS2 | herramienta, software, robot, sistema, recurso no humano | usar instrumento si el objeto se transforma relevantemente; ahi debe ser afectado |
| Invocacion | Proceso -> Proceso, rayo | IV1/IV2 | proceso invoca proceso; autoinvocacion como bucle | objeto->proceso; `c`/`e` nuclear; transformacion oculta por objeto transiente observable |
| Excepcion temporal | Proceso fuente -> Proceso manejador ambiental, `/` o `//` | EX1/EX2 | sobretiempo/subtiempo con duracion declarada | conectar a objeto/estado; usar como condicion generica |

### 10.5 Matriz de modificadores y control

| Escenario | Canonico | Regla |
|---|---|---|
| `c` sobre consumo | Si el consumido existe o esta en estado, el proceso ocurre; si no, se omite | CT1/CS1 |
| `e` sobre consumo | El objeto/estado dispara la evaluacion y luego se consume si procede | ET1/ETS1 |
| `c` sobre efecto | El afectado debe existir o estar en estado; si falla, se omite | CT2/CS2-CS4 |
| `e` sobre efecto | El afectado/estado inicia el proceso de cambio | ET2/ETS2-ETS4 |
| `c` sobre agente | Agente existe/esta en estado; si falla, se omite | CH1/CS5 |
| `e` sobre agente | Agente inicia y maneja | EH1/EHS1 |
| `c` sobre instrumento | Instrumento existe/esta en estado; si falla, se omite | CH2/CS6 |
| `e` sobre instrumento | Instrumento inicia y habilita | EH2/EHS2 |
| `c` o `e` sobre resultado | Prohibido | resultado pertenece a Post(P), no a Pre(P) |
| `c` o `e` sobre estructural | Prohibido | estructural es invariante temporal |
| `c` o `e` sobre invocacion | No canonizado en OPL-ES nuclear | usar abanico de invocacion, objeto booleano o condicion sobre proceso previo |
| `c` + `e` mismo enlace | No canonizado | modelar control externo explicito |
| `no` / NOT | No hay simbolo nuclear dedicado | usar objeto con estados `existente`/`no-existente` o booleano |

### 10.6 Matriz de enlaces estructurales

| Relacion | OPD | OPL | Se puede | No se puede |
|---|---|---|---|---|
| Agregacion-participacion | Triangulo lleno, vertice al todo | RF1 | todo y partes con misma perseverancia; coleccion incompleta | mezclar objeto/proceso; invertir vertice; borrar interior del triangulo |
| Exhibicion-caracterizacion | Triangulo con triangulo interior | RF2/RF2b | cuatro combinaciones objeto/proceso; atributos y operaciones | usar atributo flotante sin exhibidor; colapsar a generalizacion |
| Generalizacion-especializacion | Triangulo vacio | RF3/RF3b | misma perseverancia; herencia de rasgos, partes, estados y enlaces | herencia visible duplicada como enlace explicito; generalizar objeto con proceso |
| Clasificacion-instanciacion | Triangulo con circulo interior | RF4 | clase->instancia; instancia con valores concretos | cadena de instanciacion sin justificacion; confundir instancia visual con logica |
| Etiquetado unidireccional | Linea con punta abierta | SE1/SE2/SSE1-SSE3 | relaciones invariantes con etiqueta; estado origen/destino segun SSE | usar como proceso encubierto cuando hay transformacion |
| Bidireccional | Arpones en ambos extremos | SE3/SSE4-SSE5 | etiquetas f/b distintas | estado solo en destino; etiquetas iguales sin reconocer reciprocidad |
| Reciproco | Arpones con una etiqueta | SE4/SE5/SSE6-SSE7 | relacion simetrica | estado solo en destino; direccion semantica oculta |

### 10.7 Matriz de abanicos y rutas

| Escenario | Se puede | No se puede | OPL |
|---|---|---|---|
| AND | Enlaces separados sin arco | Dibujar arco AND inventado | oraciones separadas |
| XOR | Arco discontinuo simple en extremo convergente | Ubicar arco en extremo no compartido | "exactamente uno de" |
| OR | Doble arco discontinuo | Usar doble arco para probabilidad | "al menos uno de" |
| Probabilistico | `Pr=p` en cada enlace de abanico XOR; suma 1 | `Pr=p` fuera de abanico o en OR como canon nuclear | §11.5 |
| m-de-f | `m` junto al arco para f>2 | `m >= f` o sin declarar operador base | "exactamente m de f" / "al menos m de f" como extension controlada |
| Resultado simple a objeto con estados | Equivale a XOR de resultados por estado | Usar esa equivalencia para permitir `c`/`e` en resultado | V-19 |
| Etiqueta de ruta | Misma etiqueta en entrada/salida para trazar escenario | Usarla como label estructural o sobre habilitador sin declararlo no canonizado | "Por ruta etiqueta, ..." |

### 10.8 Matriz de refinamiento y contexto

| Escenario | Se puede hacer | No se puede hacer | OPL / identidad |
|---|---|---|---|
| SD raiz | Un proceso sistemico principal con contexto de alto nivel | Multiples procesos sistemicos compitiendo en SD ordinario | SD compone OPL raiz |
| Descomposicion de proceso | Elipse inflada en OPD hijo; subprocesos arriba->abajo | Refinamiento con un solo subproceso; enlaces padre-subproceso explicitos | CX1/CX2/CX4 |
| Despliegue de objeto | Rectangulo inflado o nuevo OPD de estructura | Interpretar posicion como tiempo | CX3 |
| Expresion de estados | Revelar estados suprimidos relevantes en hijo | Suprimir estados por despliegue no procedural | D5-D13 + reglas V-86-V-90 |
| Consumo/resultado al descomponer | Reasignar a primer/ultimo subproceso | Mantenerlos en contorno exterior del proceso descompuesto | distribucion V-37/V-103 |
| Efecto entrada-salida al descomponer | Escindir TS4/TS5 | Mantener TS3 sin resolver cuando el detalle importa | TS4/TS5 |
| Agente/instrumento al descomponer | Distribuir a todos los subprocesos si aplica | Usar habilitador como transformado sin cambio de rol declarado | H/HS |
| Evento sistemico | No cruza frontera de descomposicion | Disparar subproceso interno desde objeto sistemico externo | V-38 |
| Evento ambiental | Puede cruzar con contingencia explicita | Usarlo para ocultar dependencia sistemica | V-108 |
| OPD hoja | Eliminable si jerarquico hoja | Eliminar OPD no hoja sin resolver descendientes | identidad persistente V-248 |
| Vista anclada/ad hoc | Permitida como vista, con metadato | Confundirla con refinamiento jerarquico ordinario | V-114/V-244/V-245 |
| Sub-modelo | DAG de modelos; referencias externas persistentes | Duplicar existencia como espejo mutable | CM1-CM3 |

### 10.9 Matriz de visualidad, export y UI

| Elemento visible | Clase | OPL nuclear | Regla |
|---|---|---|---|
| Forma, contorno, sombra, estado, enlace, triangulo | Gramatica OPD | Si expresa hecho, si | canonico |
| Color de clase | Informativo | No por si mismo | V-63 |
| Grid, snap, handles, selection, chrome, toast | UI | No | V-196/V-202/V-203 |
| Marcas de validacion | Vista auxiliar | No salvo perfil declarado | V-218-V-224 |
| Notas/sticky notes | Meta del autor | No nuclear | V-204 |
| Bitmap interior | Decorativo salvo extension declarada | No nuclear | V-213/V-214 |
| Sombra decorativa | Prohibida en canon-diagrama | No | V-124/V-126 |
| Canon-diagrama | Export vectorial por OPD | Deriva de hechos visibles | V-225-V-228 |
| Canon-documento | Export documental completo | Incluye OPD + OPL + diccionarios | V-229-V-236 |

### 10.10 Matriz de simulacion, computacion y requisitos

| Escenario | Permitido | No permitido | Relacion OPD/OPL |
|---|---|---|---|
| Simulacion conceptual | Tokens, proceso activo, estado actual runtime | Persistir marcas runtime como canon sin snapshot declarado | runtime separado de OPL nuclear |
| Snapshot runtime | Export declarado con estado operacional | Confundir `Current` declarado con runtime | V-134/V-141/V-238 |
| Proceso ejecutable | `()` y metadato recuperable | Cambiar la elipse por clase grafica nueva | V-167-V-172 |
| Alias computacional | `{alias}` unico y trazable | Alias implicito por posicion o nombre ambiguo | V-158-V-170 |
| Slot de valor | Distinto de estado cualitativo | Usarlo como estado sin declarar canal | V-163-V-166 |
| Integracion externa | Estereotipo/distintivo/metadato | Tratar API/MQTT/ROS como clase OPM nueva | V-173-V-175 |
| Requisito | Estereotipo `<<Requirement>>` o vista de requisitos | Conectarlo procedimentalmente como si transformara | V-142-V-157/V-254-V-255 |
| Vista de requisitos | Solo lectura sobre OPDs fuente | Duplicar OPD como modelo nuevo sin referencia | V-254-V-255 |

- **R-SIM-1** (`SSOT-iso §Dinámica y simulación`): una simulación OPM DEBE ejecutar el modelo en un entorno de software sin alterar el modelo conceptual.
- **R-SIM-2**: los modos de transformación ejecutables DEBEN limitarse a construcción, efecto y consumo.
- **R-SIM-3**: construcción y consumo DEBEN tratarse como transformaciones de existencia; efecto DEBE tratarse como transformación de estado con identidad preservada.
- **R-SIM-4**: la línea temporal por defecto en descomposición DEBE fluir de arriba hacia abajo.
- **R-SIM-5**: subprocesos a la misma altura DEBEN ejecutarse en paralelo.
- **R-SIM-6**: un proceso de salida por excepción PUEDE provocar salida inmediata sin importar su posición gráfica.
- **R-SIM-7**: un evento temporizado DEBE modelarse mediante objeto reloj/temporizador o estado temporal que inicia proceso.
- **R-SIM-8**: un diagrama de vida útil DEBE mostrar, para cada instante representado, objetos existentes, estado de cada objeto y procesos activos.
- **R-SIM-9**: el simulador DEBE evaluar evento iniciador, precondición, transformación inicial, ejecución, transformación final y excepciones según las reglas del modelo.
- **R-SIM-10**: eventos DEBEN perderse tras evaluación de precondición aunque la precondición falle.
- **R-SIM-11**: si una precondición condicional falla, el proceso DEBE omitirse y el control pasa al siguiente proceso aplicable.
- **R-SIM-12**: si un habilitador deja de existir durante la ejecución, el proceso DEBE detenerse y el estado del afectado queda indeterminado salvo manejo explícito.

### 10.11 Politica de importacion OPL

Al editar o importar OPL-ES:

1. Parsear contra `SSOT-opl Apéndice A` antes de tocar el modelo.
2. Resolver cada nombre a una cosa existente o crear una cosa nueva solo si la tipografia OPL la desambigua: **negrita** objeto, *cursiva* proceso, `mono` estado.
3. Si una oracion referencia estado inexistente, crear el estado solo si el objeto propietario esta inequívocamente identificado.
4. Si una oracion crea un enlace cuya firma contradice tipos existentes, rechazarla.
5. Si una oracion es canonica pero la app aun no soporta su familia, reportar `unsupported-canonical`, no degradarla.
6. Si una oracion es no canonizada, reportar `non-canonical`, no convertirla a extension silenciosa.
7. Si una oracion cambia el tipo ontologico de una cosa existente, bloquear y pedir decision: renombrar, crear cosa nueva o corregir OPL.
8. Si una oracion elimina informacion visual no expresable en OPL (layout, vista, estilo), preservar metadato salvo que el usuario pida normalizacion.

### 10.12 Politica de edicion OPD

Al editar OPD:

1. Validar firma antes de crear enlace.
2. Validar extremo de estado antes de anclar.
3. Si se cambia tipo de cosa, recalcular perseverancia y revisar todos los enlaces.
4. Si se mueve una cosa entre OPDs, preservar identidad persistente y emitir solo cambios de apariencia.
5. Si se crea una vista o se usa `Bring`, no crear nuevos hechos semanticos salvo enlaces/cosas explicitamente nuevos.
6. Si un cambio visual solo afecta estilo autoral, NO DEBE cambiar OPL nuclear.
7. Si un cambio visual afecta contorno, sombra, forma, marker, triangulo o estado, DEBE cambiar el hecho y su OPL.
8. Si la accion genera una combinacion prohibida, DEBE bloquearse antes de persistir o marcarse como error estructural recuperable.

### 10.13 Casos de ruptura controlada de bisimetria

| Ruptura | Por que ocurre | Politica |
|---|---|---|
| Layout no textual | Posicion, routing, viewport y grid no son OPL nuclear | preservar en metadato OPD |
| Vista parcial | Un OPD puede ocultar hechos visibles en otro OPD | OPL del sistema completo se compone desde todos los OPDs y hechos |
| Estilo autoral | Color/fuente/tamano pueden no ser semanticos | normalizar en canon-diagrama si perfil lo exige |
| UI/transitorio | Handles, overlays y tutorial no son modelo | suprimir en export e ignorar en OPL |
| Runtime | Simulacion es estado de ejecucion, no modelo conceptual | exportar solo si snapshot declarado |
| Sub-modelos no cargados | Referencias pueden existir sin contenido local | export declara resolucion y completitud |

### 10.14 MBSE, alternativas, PDR e integración virtual

- **R-MBSE-1** (`SSOT-iso §Ingeniería de sistemas basada en modelos con OPM`): cuando OPM se use como MBSE, el modelo DEBE funcionar como especificación formal bimodal verificable entre disciplinas.
- **R-MBSE-2**: para generar conceptos alternativos de solución, se DEBEN crear al menos tres modelos conceptuales distintos.
- **R-MBSE-3**: cada concepto alternativo DEBE declarar su principio físico o lógico central.
- **R-MBSE-4**: cada alternativa DEBE explicitar supuestos implícitos antes de compararse.
- **R-MBSE-5**: una PDR basada en OPM DEBE incluir portada, formulación del problema, propósito y motivación, supuestos y restricciones, soluciones alternativas, solución seleccionada con justificación, costos/ciclo de vida/cronograma, y riesgos con mitigación.
- **R-MBSE-6**: OPM usado como plano común NO DEBE traducir hechos nucleares a formalismos disciplinares sin mantener trazabilidad al hecho OPM original.
- **R-MBSE-7**: modelos detallados de sistemas complejos PUEDEN abarcar 5 a 10 niveles de detalle; si se excede esa profundidad, la herramienta DEBE exigir navegación, vistas o composición por sub-modelos.
- **R-VIRT-1** (`SSOT-iso §Integración virtual`): una integración virtual DEBE distinguir modelo conceptual de hardware, software ejecutable real y vínculo de control entre ambos.
- **R-VIRT-2**: el software que controla virtualmente modelos de hardware DEBE representarse como proceso, instrumento, integración externa o metadato computacional trazable; NO DEBE introducir clase gráfica OPM nueva.

## 11. Anti-patrones — reglas de prohibición

- **R-AP-0**: una UI puede exponer construcciones laxas solo como estado de edición; NO DEBE persistirlas como canónicas.
- **R-AP-0A**: todo anti-patrón DEBE citar regla SSOT primaria o silencio SSOT que justifica bloqueo/no canonicidad.
- **R-AP-0B**: todo anti-patrón DEBE declarar sustituto canónico o política de rechazo.

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
| AP-08 | **Enlace escindido TS4/TS5 + `c` o `e`** | DEBE bloquearse por `V-41`, `V-110` y `SSOT-metod §7.4`. | Modelar opcionalidad sobre el efecto entrada-salida completo o con control externo. |
| AP-09 | **`c` o `e` sobre enlace estructural** | DEBE bloquearse: los modificadores son procedimentales y estructural es invariante temporal. | Usar enlace estructural con estado especificado si aplica. |
| AP-10 | **`c` o `e` sobre invocación** | DEBE rechazarse como no canonizado en OPL-ES nuclear. | Usar fan de invocación, objeto booleano o condición sobre proceso previo. |
| AP-11 | **Bidireccional o recíproco con estado solo en destino** | DEBE bloquearse por `V-30`. | Usar unidireccional con estado en destino o agregar estado en origen. |
| AP-12 | **Estados de proceso** | DEBE bloquearse: OPM reserva estados para objetos. | Descomponer en subprocesos o usar atributo exhibido `Estado del Proceso`. |
| AP-13 | **Refinamiento con un solo subproceso o refinador** | DEBE reportarse como refinamiento trivial. | Eliminar, postergar o ampliar a ≥ 2 hijos. |
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
| AP-27 | **Evento a subproceso intermedio sin justificar omisión previa** | DEBE advertirse o bloquearse según severidad. | Conectar al primer subproceso o declarar omisión válida de previos. |
| AP-28 | **`c` y `e` simultáneamente sobre el mismo enlace** | DEBE rechazarse como no canonizado. | Modelar control externo explícito. |
| AP-29 | **Enlaces heredados dibujados como explícitos** | DEBE bloquearse salvo vista derivada no nuclear. | Inferirlos por herencia desde generalización-especialización. |
| AP-30 | **Resultado+resultado o consumo+consumo sobre el mismo objeto al recomponer** | DEBE bloquearse por `V-43`. | Corregir el nivel hijo antes de recomponer. |

### 11.2 Zonas no canonizadas (silencios de la SSOT)

- **R-ZNC-1**: una construcción que no aparece explícitamente prohibida ni canonizada por la SSOT DEBE clasificarse como no canonizada.
- **R-ZNC-2**: la herramienta NO DEBE inventar regla OPM nuclear para una zona no canonizada.

| Zona | Estado |
|---|---|
| Combinación `c + e` sobre el mismo enlace | No definida. Tratar como NO canonizada (AP-28). |
| `Pr=p` sobre fan no-XOR (ej. fan OR con probabilidades) | `V-18` declara fan probabilístico ≡ XOR; la combinación con OR no se canoniza. |
| Modificadores sobre enlace estructural etiquetado | No definidos en SSOT-OPL §9; tratar como no canónicos (AP-09). |
| Enlace probabilístico sin fan | `Pr=p` se define solo dentro de abanicos (`V-18`); fuera no tiene canonicidad. |
| Multiplicidad sobre procesos directamente | `V-23`: NO aplica a procesos. Usar contador de iteración. |
| Etiquetas de ruta sobre enlaces habilitadores | SSOT-opl §13 solo canoniza consumo/resultado. No canonizadas sobre agente/instrumento. |

---

## 12. Aplicación a `deep-opm-pro`

- **R-APP-0**: el estado de implementación DEBE clasificarse como enforzado, parcial, no implementado o zona laxa pendiente.
- **R-APP-0A**: una regla parcialmente enforzada NO DEBE considerarse cerrada hasta cubrir UI, kernel, importación, generación OPL y exportación aplicables.

### 12.1 Reglas enforzadas o parcialmente cerradas hoy (vigentes en `app/` al 2026-05-23)

| Regla | Estado | Mecanismo |
|---|---|---|
| R-COSA-1, R-COSA-2: solo objeto/proceso como cosa | Enforzado | tipos `ThingKind` en modelo de datos |
| R-AG-1: agente solo a humanos | Parcial | validación exige objeto físico; no prueba humanidad semántica real |
| R-EST-1: estado dentro de objeto | Enforzado | rountangles renderizados como hijos del rect del objeto |
| AP-01: resultado + `c` prohibido | Parcial | UI no ofrece `Condición` nueva para `tipo === "resultado"`; kernel/OPL legacy aún deben cerrarse |
| AP-02: resultado + `e` prohibido | Parcial | UI no ofrece `Evento` nuevo para `tipo === "resultado"`; kernel/OPL legacy aún deben cerrarse |
| AP-12: estados de proceso prohibidos | Enforzado | el modelo no admite estados sobre procesos |
| AP-13: refinamiento no trivial ≥ 2 hijos | Enforzado parcial | validación al descomponer; revisar imports/modelos legacy |
| R-DEC-1: piruletas solo con línea | Enforzado visual | render de enlaces JointJS canónico |
| R-LAY-4: línea de tiempo arriba->abajo | Parcial | autolayout HODOM denso; usuario aún puede mover y producir secuencia visual ambigua |
| AP-06: consumo/resultado prohibido en contorno exterior | Parcial | distribución automática al descomponer; validar edición manual/import |
| Reglas de OPL: convención **negrita** / *cursiva* / `mono` | Enforzado parcial | emisor OPL textual; parser tolera variantes legacy |
| R-IDP-1, R-IDP-2: identidad persistente vs etiqueta visible | Parcial | OPDs tienen IDs persistentes; exports todavía pueden exponer `SDx.y` como referencia visible |

### 12.2 Zona laxa pendiente (futuros tickets)

| Regla / anti-patrón | Estado actual en `deep-opm-pro` | Severidad para canonicidad |
|---|---|---|
| AP-04: resultado conectado a estado inicial | UI no chequea destino del enlace de resultado | ALTA |
| AP-07: efecto entrada-salida sin escindir al descomponer | UI permite mantener enlaces no escindidos | ALTA — afecta semántica de SD1 |
| AP-08: escindido + modificador | UI no bloquea modificadores sobre TS4/TS5 | ALTA |
| AP-10: modificador sobre invocación | UI permite anotar `c`/`e` sobre rayo | MEDIA |
| AP-11: bidireccional/recíproco con estado solo en destino | UI no chequea esta combinatoria | MEDIA |
| AP-21: evento sistémico cruzando frontera de descomposición | UI permite enlaces de evento cruzando | MEDIA |
| AP-27: evento a subproceso no-primero | UI permite; no hay advertencia | MEDIA |
| AP-28: `c` + `e` simultáneo | UI permite ambos modificadores en el mismo enlace | BAJA (no canonizada en SSOT) |
| AP-01/AP-02 cierre kernel | `aplicarModificador` todavía valida por naturaleza procedural, no por input-side/result-side | ALTA |
| OPL legacy de resultado condicional | Parser/generador conserva forma de resultado + condición + abanico de rondas previas | ALTA |
| Familias tagged/bidirectional avanzadas (SSE3–SSE7) | Soporte parcial — pendientes en doc `docs/audits/opcloud-enlaces-pendientes/` | ALTA (mencionado en memoria del proyecto) |
| Semi-plegado (`V-116`–`V-120`) | No implementado | BAJA — funcionalidad de simplificación visual |
| Identificador persistente vs `SDx.y` en exports | Identificador interno existe; exports aún usan `SDx.y` como referencia visible | MEDIA |
| Multiplicidad parametrizada con restricciones (`donde n ≤ 4`, `e ∈ {0,1}`) | Soporte limitado | MEDIA |
| Estereotipos (`<<Requirement>>`, `<<Test>>`) | No implementados — EPICA descartada o postergada | BAJA |
| Capa computacional `{alias}`, `[unidad]`, `()` para procesos ejecutables | No implementada | BAJA |
| Composición inter-modelo (sub-modelos referenciados) | No implementada | BAJA — requiere arquitectura multi-modelo |
| Tokens de simulación, modo runtime | No implementado | BAJA — fuera del scope inmediato del modelador |

### 12.3 Política operativa derivada de este documento

1. Cada vez que se descubra un anti-patrón nuevo permitido por la UI, se cita en este documento (sección 11.1) **antes** de cerrar el ticket que lo arregla.
2. Las reglas `V-*` deben citarse en commits que modifican validación de canonicidad (formato sugerido: `fix(opl): cierra AP-02 — bloquea resultado+e en panel (V-43, SSOT-iso §Enlaces transformadores)`).
3. Cuando la SSOT calle (zona no canonizada), la UI **restringe por defecto** (cierra por seguridad) y la restricción se documenta como NO-canonizada, no como prohibición ontológica.
4. Las divergencias OPCloud → SSOT se resuelven a favor de SSOT salvo justificación explícita registrada en `docs/audits/`.

---

## Anexos

### Anexo A — Mapeo rápido modificador × familia × canonicidad

```
                    ┌──────────────┬─────────────┬─────────────┐
                    │ Sin modif.   │ + e (evento)│ + c (cond.) │
┌───────────────────┼──────────────┼─────────────┼─────────────┤
│ Consumo (T1/TS1)  │ Canónico     │ ET1/ETS1    │ CT1/CS1     │
│ Resultado (T2/TS2)│ Canónico     │ NO CANON    │ NO CANON    │
│ Efecto (T3/TS3-5) │ Canónico     │ ET2/ETS2-4  │ CT2/CS2-4   │
│ Agente (H1/HS1)   │ Canónico     │ EH1/EHS1    │ CH1/CS5     │
│ Instrum.(H2/HS2)  │ Canónico     │ EH2/EHS2    │ CH2/CS6     │
│ Invocación (IV1-2)│ Canónico     │ NO CANON    │ NO CANON    │
│ Escindido (TS4-5) │ Canónico     │ PROHIBIDO   │ PROHIBIDO   │
│ Estructural fund. │ Canónico     │ NO APLICA   │ NO APLICA   │
│ Estructural etiq. │ Canónico     │ NO APLICA   │ NO APLICA   │
└───────────────────┴──────────────┴─────────────┴─────────────┘
```

### Anexo B — Glosario operativo (subconjunto)

| Término | Definición operativa | Cita |
|---|---|---|
| Pre(P) | conjunto previo al proceso: consumidos + afectados (estado entrada) + habilitadores requeridos | `glosario 3.54` |
| Post(P) | conjunto posterior al proceso: resultantes + afectados (estado salida) | `glosario 3.52` |
| Cosa refinable | todo, exhibidor, general o clase | `glosario 3.61` |
| Cosa refinador | parte, rasgo, especialización o instancia | `glosario 3.62` |
| Objeto Específico de Estado | especialización sin estados que refiere a un estado concreto del original (`Producto Diseñado` ≡ `Producto` en `diseñado`) | `V-67`, `V-68` |
| Beneficiario | interesado que recibe valor funcional | `glosario 3.6` |
| Función | proceso que entrega valor funcional al beneficiario | `glosario 3.23` |
| Operación | proceso que caracteriza una cosa | `glosario 3.46` |
| Rasgo | atributo (objeto) u operación (proceso) | `glosario 3.21` |
| Escenario | conjunto de etiquetas de ruta que define una variante concreta de ejecución | `SSOT-iso §Trayectorias` |

### Anexo C — Citación rápida por anti-patrón → regla SSOT

| AP | Cita primaria |
|---|---|
| AP-01 | SSOT-iso §Enlaces transformadores (nota normativa absoluta); SSOT-visual V-43 §13.5 |
| AP-02 | mismo bloque que AP-01 |
| AP-03 | derivado de AP-01 + V-19 |
| AP-04 | V-8 |
| AP-05 | glosario 3.3; SSOT-metod §6.5 |
| AP-06 | V-37, V-103; SSOT-iso §Distribución |
| AP-07 | V-40, V-110; SSOT-opl §4.2 nota |
| AP-08 | V-41, V-110; SSOT-metod §7.4 |
| AP-09 | SSOT-iso §Enlaces de control (procedimental only) |
| AP-10 | SSOT-opl §8.2 (sin variantes) |
| AP-11 | V-30 |
| AP-12 | SSOT-iso §Glosario notas normativas |
| AP-13 | SSOT-metod §7.1 |
| AP-14 | SSOT-metod §9.19 |
| AP-15 | V-102 |
| AP-16 | V-100 |
| AP-17 | V-247, V-248, V-249; SSOT-metod §8.2 |
| AP-18 | V-184; SSOT-metod §15 |
| AP-19 | V-124 |
| AP-20 | V-128 |
| AP-21 | V-38, V-108 |
| AP-22 | SSOT-metod §9.15 |
| AP-23 | V-194, V-212 |
| AP-24 | V-198, V-203, V-220, V-224 |
| AP-25 | SSOT-metod §9.1 |
| AP-26 | SSOT-metod §9.2 |
| AP-27 | SSOT-metod §7.4 antipatrón explícito |
| AP-28 | silencio SSOT (zona no canonizada) |
| AP-29 | V-73 |
| AP-30 | V-43 matriz |

### Anexo D — Índice exhaustivo de cobertura `V-*`

- **R-ANEXO-D-1**: este índice DEBE cubrir todas las reglas visuales declaradas por `opm-visual-es.md` v3.0.0.
- **R-ANEXO-D-2**: la columna "Resumen" DEBE tratarse como entrada operativa corta; la redacción completa vive en la SSOT visual.
- **R-ANEXO-D-3**: si una regla aparece aquí pero no tiene sección desarrollada en el cuerpo, DEBE aplicarse por referencia directa a la SSOT.
- **R-ANEXO-D-4**: toda regla visual aplicada por referencia DEBE incorporarse al cuerpo cuando se implemente o se audite en `deep-opm-pro`.

| Regla | Resumen |
|---|---|
| V-0 | Canonicidad por exportación: gramática conforme es la que persiste en export canónico |
| V-0a | Dos perfiles obligatorios: canon-diagrama y canon-documento |
| V-0b | Elemento persistente en canon-diagrama debe tener regla `V-*` o capítulo explícito |
| V-0c | Elemento no canónico es UI transitoria y no reutiliza canales semánticos |
| V-0d | Elemento específico de perfil se declara como atributo de perfil |
| V-0e | Captura de pantalla no es evidencia suficiente de canonicidad |
| V-1 | Valores por defecto: informacional y sistémico; presets no alteran semántica sin serialización |
| V-2 | Perseverancia no es visual, se infiere del tipo |
| V-3 | Vértice del triángulo apunta al refinable |
| V-4 | Los estados no existen fuera de su objeto |
| V-5 | Objeto sin estados: solo creado o destruido |
| V-6 | Máximo un defecto y un `Current`; múltiples iniciales/finales permitidos |
| V-7 | Efecto requiere objeto con al menos un estado |
| V-8 | Resultado no conecta directamente al estado inicial |
| V-9 | Efecto solo-entrada sin salida: destino es estado por defecto |
| V-10 | Habilitador desaparece: proceso se detiene |
| V-11 | Unicidad de rol: transformado XOR habilitador |
| V-12 | Evento es solo el segmento objeto->proceso |
| V-13 | Evento se pierde tras evaluación |
| V-14 | AND es el operador por defecto (sin arco) |
| V-15 | XOR/OR aplican a todas las familias procedimentales |
| V-16 | Arco en extremo convergente del abanico |
| V-17 | Abanicos: convergente o divergente |
| V-18 | Probabilístico es siempre XOR |
| V-19 | Resultado simple equivale a XOR de resultados con estado |
| V-20 | Coincidencia de etiquetas de ruta fija trayectoria |
| V-21 | Parámetros de multiplicidad: nombres únicos |
| V-22 | Multiplicidad: anotación junto al extremo del enlace |
| V-23 | Multiplicidad no aplica a procesos directamente |
| V-24 | Misma perseverancia en refinable y refinadores (excepto exhibición) |
| V-25 | Exhibición puede conectar objetos con procesos |
| V-26 | Cuatro combinaciones exhibidor-rasgo válidas |
| V-27 | Clasificación no distingue colección completa/incompleta |
| V-28 | Herencia múltiple permitida |
| V-29 | Atributo discriminante: un valor por especialización |
| V-30 | Bidireccional/recíproco no existen con estado solo en destino |
| V-31 | Invocación implícita: posición vertical determina secuencia |
| V-32 | Misma altura = ejecución paralela |
| V-33 | In-zooming: contorno grueso en padre e hijo |
| V-34 | Descomposición: elipse agrandada contiene subprocesos |
| V-35 | Línea temporal: arriba -> abajo |
| V-36 | Agente/instrumento en contorno exterior se distribuyen |
| V-37 | Consumo/resultado NO en contorno exterior de descomposición |
| V-38 | Eventos sistémicos no cruzan límite de descomposición |
| V-39 | Condición omite subproceso: control pasa al siguiente |
| V-40 | Enlace escindido: temprano saca de s1, tardío pone en s2 |
| V-41 | No hay enlaces escindidos con modificador de control |
| V-42 | Cambio de rol instrumento->afectado válido si estados coinciden |
| V-43 | Resultado + consumo sobre mismo objeto requiere arbitraje por matriz/prosa; ver §6.6 |
| V-44 | Transformador prevalece sobre habilitador |
| V-45 | Duración dentro de la elipse: {min, esp, max} |
| V-46 | SD contiene exactamente un proceso sistémico |
| V-47 | Unicidad nominal evaluada a nivel de modelo para cualquier cosa (objeto, proceso, estado) |
| V-48 | Eliminada; ver V-4 |
| V-49 | Consumido desaparece al inicio del proceso |
| V-50 | Máximo 20-25 cosas por OPD |
| V-51 | Sin oclusión, minimizar cruces |
| V-52 | Un elemento puede aparecer en cualquier número de OPDs |
| V-53 | Proceso activo: marca reservada, no elipse rellena estricta |
| V-54 | Estado actual: glifo externo reservado al borde del estado |
| V-55 | Tiempo fluye arriba -> abajo, en edición y simulación |
| V-56 | Bidireccional con etiquetas iguales equivale a recíproco |
| V-57 | Partes de agregación pueden transformarse independientemente del todo |
| V-58 | Instancias muestran valores concretos; clases muestran rangos |
| V-59 | Activación asincrónica por eventos: subprocesos independientes |
| V-60 | Átomo del OPD: Constructo Básico = 1 enlace + 2 cosas |
| V-61 | Anatomía de enlace: Origen + Destino + Conector + Símbolo + Etiqueta? + Ruta? |
| V-62 | In-zooming en dos fases: Mostrar Contenido + Refinar Enlaces |
| V-63 | Colores informativos; topología interna es canal normativo |
| V-64 | OPM Model = OPD Set + OPL Spec + Sub-models? |
| V-65 | Dualidad OPD <-> OPL: toda afirmación gráfica es reproducible como texto y viceversa |
| V-66 | *Conectar*: conjunto de cosas con conjunto de enlaces como instrumento |
| V-67 | Sin estados vs con estados; con estados deriva objetos específicos de estado |
| V-68 | Objeto Específico de Estado: nombre = estado + nombre del objeto original |
| V-69 | Contorno grueso aplica a descomposición y despliegue en nuevo diagrama |
| V-70 | El despliegue intradiagrama NO produce contorno grueso |
| V-71 | Tipo de contorno persiste en todos los niveles de refinamiento |
| V-72 | Herencia aplica a través de niveles de refinamiento por despliegue |
| V-73 | Enlaces heredados no visibles pero semánticamente activos |
| V-74 | Herencia de afiliación: atributos de objetos ambientales son ambientales |
| V-75 | Sobreescritura: especialización puede reemplazar participante heredado |
| V-76 | Migración de enlaces comunes al crear un general desde especializaciones |
| V-77 | Invocación implícita solo aplica a descomposición de proceso |
| V-78 | Descomposición de objeto: posición codifica disposición, no tiempo |
| V-79 | Refinable aparece como contenedor en OPD hijo |
| V-80 | Cosas conectadas al refinado se copian como elementos externos |
| V-81 | En descomposición se copian todas las cosas conectadas por cualquier enlace |
| V-82 | En despliegue se copian solo hijos estructurales |
| V-83 | No se puede refinar un elemento externo |
| V-84 | Objetos internos se eliminan al eliminar el proceso padre |
| V-85 | Objetos externos existen independientemente del refinamiento |
| V-86 | Estado se suprime cuando un OPD hijo de descomposición lo referencia vía enlace |
| V-87 | Supresión de estados solo aplica a descomposición |
| V-88 | Estados no referenciados en enlaces al refinado no se suprimen |
| V-89 | Supresión desde múltiples OPDs hijo = unión |
| V-90 | Expresión de estados: suprimidos en padre se revelan en hijo |
| V-91 | Enlaces estructurales al contenedor son visibles en OPD hijo |
| V-92 | Enlaces procedimentales al contenedor no son visibles directamente |
| V-93 | Enlaces entre elementos internos del OPD hijo son visibles normalmente |
| V-94 | Enlaces que no tocan contenedor ni internos son invisibles en ese OPD |
| V-95 | Esencia no cambia a través del refinamiento |
| V-96 | Perseverancia no cambia a través del refinamiento |
| V-97 | Nombres no cambian a través del refinamiento |
| V-98 | Consistencia de hechos: un OPD no puede contradecir a otro |
| V-99 | Importancia proporcional al OPD más alto donde aparece la cosa |
| V-100 | Prohibición de refinamiento cíclico transitiva |
| V-101 | Instancia visual no es instancia lógica |
| V-102 | No se puede crear instancia visual entre tipos diferentes |
| V-103 | Consumo/input al primer subproceso; resultado/output al último |
| V-104 | Efecto, agente e instrumento se distribuyen a todos los subprocesos |
| V-105 | Enlaces estructurales no se distribuyen |
| V-106 | Sin subprocesos, enlace al contenedor como respaldo temporal |
| V-107 | Distribución de enlaces solo aplica a descomposición |
| V-108 | Eventos de objetos ambientales pueden cruzar límite con contingencia explícita |
| V-109 | Restricciones de frontera solo aplican a descomposición |
| V-110 | Escisión es el único mecanismo para subespecificación de efecto |
| V-111 | Cambio de rol: objeto muestra estados intermedios en OPD hijo |
| V-112 | Cambio de rol solo aplica a descomposición |
| V-113 | Solo OPDs jerárquicos hoja son eliminables directamente |
| V-114 | Tres categorías de OPD: jerárquico, vista anclada, vista ad hoc |
| V-115 | Todo proceso explícito transforma al menos un objeto; excepción procesos persistentes |
| V-116 | Semi-plegado: partes como iconos de triángulo dentro del todo |
| V-117 | Semi-plegado parcial por refinador |
| V-118 | Indicador numérico de semi-plegado = refinadores ocultos |
| V-119 | Semi-plegado por OPD/apariencia |
| V-120 | Enlaces procedimentales pueden apuntar a refinadores semi-plegados |
| V-121 | El nombre de proceso hereda política léxica de la capa textual activa |
| V-122 | Alias de cosa: paréntesis decorativo o llaves para binding computacional |
| V-123 | Existencia única, apariencias locales múltiples, referencias externas cross-model |
| V-124 | Sombra en canon-diagrama corresponde exclusivamente a esencia física |
| V-125 | La esencia física se preserva en el contenedor refinado |
| V-126 | Fuentes de sombra colapsan a un mismo resultado semántico en canon |
| V-127 | Reforzadores de canvas no persisten en canon-diagrama |
| V-128 | Topología interna del triángulo es canal normativo |
| V-129 | Triángulo estructural requiere líneas visibles al refinable y refinador |
| V-130 | Triángulos auxiliares UI se distinguen de semánticos |
| V-131 | Import preserva topología interna; color puede retipificarse |
| V-132 | Proceso activo vs refinable: canales visuales distintos |
| V-133 | Glifo de estado actual externo anclado al borde |
| V-134 | `Current` declarado vs runtime: serialización los distingue |
| V-135 | Token transitorio en enlace activo, distinto de piruletas |
| V-136 | Tokens runtime no en canon-diagrama salvo snapshot declarado |
| V-137 | Estados operacionales distintos de activo usan marcas reservadas |
| V-138 | Proceso suspendido distinto de inactivo en snapshot |
| V-139 | Síncrono: máximo un activo por hilo; asíncrono: múltiples |
| V-140 | Modo headless: ausencia de runtime no altera gramática estática |
| V-141 | Snapshot de runtime declarado explícitamente en export |
| V-142 | Estereotipo: prefijo textual, propiedades forzadas, estructura derivada |
| V-143 | Estereotipos declaran aplicabilidad |
| V-144 | Sintaxis canvas: `<<Nombre>>` en rótulo o distintivo equivalente |
| V-145 | Sintaxis OPL: `«Nombre»`; `<< >>` y `« »` equivalentes |
| V-146 | Estereotipo no puede ocultarse sin distintivo/metadato |
| V-147 | Propiedades forzadas recuperables en OPL o metadato canónico |
| V-148 | Remoción de estereotipo sin residuos ambiguos |
| V-149 | Descomposición canónica trazable como estructura derivada |
| V-150 | OPD exportado permite identificar visualmente cosa estereotipada |
| V-151 | Estereotipo que fuerza esencia física: sombra es fisicidad efectiva |
| V-152 | Entidades derivadas con patrón reservado `<Rol> of <Host>` |
| V-153 | Ciclo de vida de entidades derivadas depende del host |
| V-154 | `<<Requirement>>`: estereotipo canónico de requisito |
| V-155 | Atributos mínimos: Name, ID, Requirement Essence, Satisfaction, Description |
| V-156 | `Requirement Essence` distinta de esencia física/informacional |
| V-157 | `Satisfied Requirement Set` admitida; orden serializado si aplica |
| V-158 | `{alias}` como identificador de binding computacional |
| V-159 | Alias de binding únicos en alcance operativo declarado |
| V-160 | `{alias}` no equivale a alias decorativo entre paréntesis |
| V-161 | Unidad dimensional `[u]` entre corchetes, después del nombre |
| V-162 | `[]` vacío es placeholder; se suprime salvo confirmación |
| V-163 | Slot de valor: primitiva visible distinta del estado |
| V-164 | Slot de valor: placeholder, escalar, cadena, disyunción, multilínea |
| V-165 | Un slot primario por objeto por defecto |
| V-166 | Slot vs estado cualitativo distinguible por posición/rotulado/estilo |
| V-167 | Proceso con cuerpo ejecutable exhibe `()` |
| V-168 | Ausencia de `()` no impide simulación conceptual |
| V-169 | Código ejecutable referencia solo aliases/slots/entradas tipadas/nombres reservados |
| V-170 | Relación enlace OPM <-> parámetro función trazable |
| V-171 | Cuerpo de código no en canvas, pero reflejado por `()` y metadato |
| V-172 | Si canon-documento omite código, debe haber referencia recuperable |
| V-173 | Proceso que obtiene input externo sigue siendo proceso OPM |
| V-174 | Integraciones externas: estereotipo/distintivo/metadato, no clase grafica distinta |
| V-175 | Gemelo digital recuperable por estereotipo/alias/distintivo/metadato |
| V-176 | Modelo OPM puede referenciar otros como sub-modelos (DAG) |
| V-177 | Cada sub-modelo conserva OPL autocontenida |
| V-178 | Modelo padre declara explícitamente cada sub-modelo |
| V-179 | Sub-modelo declara su origen simétricamente |
| V-180 | `SDx.y: <Nombre> Vista de Sub-modelo`; vista anclada |
| V-181 | Jerárquico/vista anclada/vista ad hoc diferenciadas en metadato |
| V-182 | Sub-modelo desde padre puede presentarse en solo lectura |
| V-183 | Nodo del árbol del padre con distintivo de vínculo externo |
| V-184 | Cross-model = referencia externa a existencia compartida |
| V-185 | Atenuación/alias/distintivos de procedencia: gramática de vista |
| V-186 | Vista de sub-modelo puede no tener proceso sistémico único |
| V-187 | Export declara inclusión de sub-modelos no cargados |
| V-188 | Portabilidad requiere esquema de resolución explícito |
| V-189 | Desconexión de sub-modelo cambia explícitamente estado del vínculo |
| V-190 | Piruleta semántica siempre cuelga de línea visible |
| V-191 | Handles UI distinguibles de piruletas en canon |
| V-192 | Supresor `...` de enlaces no materializados pertenece a gramática si persiste |
| V-193 | Triángulos compactados deben anclar geométricamente a cosa visible |
| V-194 | Rótulo íntegro en canon-diagrama; sin elipsis ni corte silencioso |
| V-195 | Rótulo dentro del bounding box salvo variante tipificada |
| V-196 | Grid del canvas: decoración opcional, suprimida en canon |
| V-197 | Snap transparente al modelo; OPDs con misma topología son equivalentes |
| V-198 | Smart-guides en canal UI reservado |
| V-199 | Auto-ajuste de viewport en export evita recortes huérfanos |
| V-200 | Cuatro modos de canvas: estático, edición, navegación, modal; runtime adicional |
| V-201 | Solo estático-exportable es base de conformidad |
| V-202 | Handles y chrome UI omitidos en canon |
| V-203 | UI en canal reservado, no ambiguo respecto de la gramática OPM |
| V-204 | Notas/sticky notes son meta del autor, no hecho del modelo |
| V-205 | Resaltado de búsqueda en canal reservado distinto de simulación/refinamiento |
| V-206 | Canon evaluado con tutorial/overlays desactivados |
| V-207 | Estilado autoral admisible si no colisiona con canales reservados |
| V-208 | Defaults convergentes al esquema canónico |
| V-209 | Cosas de igual clase comparten base cromática/tipográfica en OPD |
| V-210 | Estilado no reutiliza canales de alerta, discontinuidad o simulación |
| V-211 | Tipografía/color del rótulo pertenecen a autoral; legibilidad obligatoria |
| V-212 | Canon no admite truncamiento silencioso del rótulo |
| V-213 | Bitmap decorativo admisible si no ocluye semántica |
| V-214 | Conflicto refinamiento vs bitmap: prioridad a geometría OPM |
| V-215 | Tamaño de cosa con política de aspect ratio declarada |
| V-216 | Normalización léxica trazable, no silenciosa |
| V-217 | Canon normaliza estilado autoral; capa editable persiste en canvas |
| V-218 | Familias de validación: invalidez, advertencia, unicidad, contención, sugerencia |
| V-219 | Política canvas limpio: sin marcas persistentes de validación en OPD |
| V-220 | Distintivos persistentes opcionales como gramática de vista separada |
| V-221 | Marcador de rechazo durante edición inválida, no en canon |
| V-222 | Conflicto de unicidad nominal resuelto explícitamente |
| V-223 | Metodología y sugerencias son vistas derivadas, no OPD canónico |
| V-224 | Validación no reutiliza canales semánticos |
| V-225 | Tres familias de salida: canon-documento, canon-diagrama, raster |
| V-226 | Perfil por defecto declarado obligatoriamente |
| V-227 | Canon-diagrama preserva gramática visible y omite chrome |
| V-228 | Rótulos en negro por defecto en canon-diagrama |
| V-229 | Canon-documento: portada, índice, árbol, diagramas, OPL, diccionarios, vistas |
| V-230 | Listados textuales admiten cromatismo si el perfil lo declara |
| V-231 | Export parcial declarado e identificado |
| V-232 | Descripciones/tooltips/anexos con referencia recuperable si se omiten |
| V-233 | Canon-diagrama no depende de rasterización para distinciones esenciales |
| V-234 | Ningún export recorta símbolos sin anclaje topológico |
| V-235 | Watermarks/overlays editoriales como capa documental no oclusiva |
| V-236 | Portabilidad: recursos embutidos, referenciados o declarados ausentes |
| V-237 | `Current` como designación persistente declarable y serializada |
| V-238 | `Current` declarada distinta de marca runtime de V-54 |
| V-239 | Cinco familias canónicas de enlace |
| V-240 | Invocación con firma `Proceso->Proceso` como familia autónoma |
| V-241 | Categorías adicionales son extensiones de implementación, no canónicas |
| V-242 | Sub-model como cuarto par canónico de refinamiento-abstracción |
| V-243 | Bring y operaciones auxiliares como operadores derivados |
| V-244 | Tres categorías de OPD con reglas distintas |
| V-245 | Eliminabilidad diferenciada por categoría de OPD |
| V-246 | Tres canales independientes del OPD: temporal, navegación, identidad |
| V-247 | `SDx.y` es proyección humana, no identidad |
| V-248 | Identificador persistente del OPD obligatorio |
| V-249 | Referencias externas citan identificador persistente |
| V-250 | Acoplamiento canvas/OPL/árbol es de proyección, no de identidad |
| V-251 | Clausura OPD<->OPL local; compuesto como DAG autocontenido |
| V-252 | URI/handle persistente obligatorio para cosa referenciable cross-model |
| V-253 | Marcas cross-model son gramática de vista, no nuclear |
| V-254 | Vistas de Requisitos son OPDs de vista anclada |
| V-255 | Vistas de Requisitos son de solo lectura sobre OPDs fuente |
| V-256 | Ciclo de carga cross-model es propiedad de la referencia |
| V-257 | Operación auxiliar inter-OPD materializa apariencias existentes |
| V-258 | Bring connected things filtrada por familia y conectividad directa |
| V-259 | Canon-diagrama indistinguible: Bring vs OPD manual |
| V-260 | Bring links between selected entities materializa enlaces existentes |
| V-261 | Operaciones auxiliares pueden dejar supresores `...` |
| V-262 | OPDs derivados por Bring se clasifican como vista anclada o ad hoc |
| V-263 | Operaciones auxiliares reversibles; no modifican modelo subyacente |

### Anexo E — Checklist de cierre OPD<->OPL

- **R-ANEXO-E-1**: esta lista DEBE usarse para revisar cambios de modelado, parser, generador OPL, import/export o render canonico.

| Gate | Pregunta | Falla si |
|---|---|---|
| Identidad | Cada cosa, estado, enlace y OPD tiene identidad persistente separada de su etiqueta visible? | se usa `SDx.y` o nombre visible como unico identificador externo |
| Firma | Cada enlace respeta familia, direccion y tipos de extremos? | un procedural conecta objeto-objeto, un structural conecta estado, o una invocacion toca objeto |
| Estado | Todo estado tiene objeto propietario y designaciones validas? | hay estado flotante, doble default o `Current` runtime serializado como designacion |
| OPL | Todo hecho nuclear visible emite plantilla OPL-ES canonica? | hay forma visual persistente sin plantilla ni metadato de vista |
| Parseo | Toda oracion OPL aceptada reconstruye el mismo hecho? | el parser crea entidades plausibles ante ambiguedad |
| Modificadores | `c/e` solo aparecen en input-side canonico? | resultado, estructural, invocacion o TS4/TS5 reciben `c/e` |
| Refinamiento | OPD hijo agrega detalle motivado y no contradice al padre? | replica layout, crea ciclo o cambia nombre/esencia/perseverancia |
| Distribucion | Al descomponer, enlaces del padre migran segun V-103/V-104/V-105? | consumo/resultado quedan en contorno exterior o TS3 queda sin escindir |
| Vistas | Vistas, Bring, sub-modelos y requirement views estan tipificados? | una vista se confunde con OPD jerarquico ordinario |
| UI | Handles, overlays, grid, tutorial, validacion y runtime se separan del canon? | un canal UI reutiliza contorno, sombra, piruleta, triangulo o halo semantico |
| Export | El perfil declara canon-diagrama/canon-documento y recursos? | captura raster o screenshot se toma como prueba de canonicidad |
| Deuda | Toda zona no canonizada queda registrada como extension o bloqueo? | se acepta silenciosamente una construccion sin soporte SSOT |

### Anexo F — Índice exhaustivo de cobertura `SSOT-opl`

- **R-ANEXO-OPL-1**: este índice DEBE cubrir todas las secciones prescriptivas de `opm-opl-es.md` v3.0.0.
- **R-ANEXO-OPL-2**: si una sección OPL aparece aquí, su regla local DEBE aplicarse aunque no haya una tabla desarrollada en el cuerpo.
- **R-ANEXO-OPL-3**: el Apéndice A de `SSOT-opl` DEBE tratarse como fuente normativa de parseo/generación; el cuerpo explicativo de `SSOT-opl §17` solo orienta adaptación EN→ES.

| Fuente OPL | Cobertura local prescriptiva |
|---|---|
| §0 Alcance y contrato editorial | R-OPL-TEXT-1..4 |
| §1.1 Denominación de procesos | §2.4, R-OPL-9, R-OPL-EQ-1..4 |
| §1.2 Denominación de objetos | §2.4, R-OPL-10 |
| §1.3 Denominación de estados | §2.4, R-OPL-LEX-1..3 |
| §1.4 Género gramatical | R-OPL-1 |
| §1.5 Ser vs estar | R-OPL-2 |
| §1.6 Artículos y preposiciones | R-OPL-3, R-OPL-8 |
| §1.7 Tipografía Markdown | R-OPL-TYPO-1..2 |
| §1.8 Orden canónico | R-OPL-6..7 |
| §1.9 Estado especificado | R-OPL-4, R-OPL-TRANS-2 |
| §1.10 Voz pasiva | R-OPL-5, R-OPL-TRANS-8 |
| §2 Verbos y palabras clave | §4.3, R-OPL-VERB-1..2, R-OPL-KW-1..2 |
| §3 Descripción de entidades | §4.4, R-OPL-PERSIST-1..3 |
| §4 Transformadores | §4.5, R-ESCIND-1..3 |
| §5 Habilitadores | §4.6 |
| §6 Eventos | §4.7, §6.1..6.4 |
| §7 Condiciones | §4.8, R-OPL-COND-ALT-1..2 |
| §8 Excepción e invocación | §4.9, §5.4, §5.7 |
| §9 Estructurales | §4.10, R-OPL-SE-1..5, R-OPL-RF-1..6 |
| §10 Gestión de contexto | §4.11, R-OPL-CX-ID-1, R-OPL-CM-1, R-OPL-CX-1..7 |
| §11 Operadores lógicos | §7.3..7.5, R-FAN-EST-1, R-FAN-PROB-1 |
| §12 Cardinalidad y tipo | §6.7, R-OPL-TIPO-1..2, R-OPL-PART-1, R-OPL-RANGO-1..3 |
| §13 Etiquetas de ruta | §4.12, R-OPL-RUTA-1..3 |
| §14 Atributos y valores | §4.13, R-ATR-1..6 |
| §15 Transformación EN→ES | R-OPL-TRANS-1..11 |
| §16 Ejemplo completo | Cubierto solo como patrón de aplicación; no se incorpora como regla independiente. |
| §17 Adaptaciones EBNF | R-OPL-EBNF-1..3, R-OPL-TRANS-1..11 |
| A.1 Estructura del documento | R-OPL-EBNF-4..6 |
| A.2 Declaraciones base | R-OPL-LEX-1..3, R-OPL-TIPO-1..2, R-OPL-PART-1, R-OPL-RANGO-1..3 |
| A.3 Identificadores | §2.4, R-OPL-9..10, R-OPL-LISTA-1 |
| A.4 Descripción de cosas | §4.4 |
| A.5 Procedimentales | §4.5..4.9, §4.12 |
| A.6 Condición | §4.8, R-OPL-COND-ALT-1..2 |
| A.7 Producciones adicionales | R-OPL-RANGO-2..3, R-OPL-CONJ-1, R-OPL-LISTA-1..2, R-OPL-RF-5..6 |
| A.8 Estructurales etiquetados | R-OPL-SE-1..5 |
| A.9 Estructuras fundamentales | R-OPL-RF-1..6 |
| A.10 Gestión de contexto | R-OPL-CX-1..7 |
| §18 Implementación | R-OPL-LANG-1..7, R-OPL-EQ-4..5 |

---

Fin del documento. Mantener sincronizado con la SSOT KORA `v3.0.0` y siguientes.
