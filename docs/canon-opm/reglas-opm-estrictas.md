# Reglas OPM estrictas — Canon operativo exhaustivo OPD/OPL

> Documento canónico destilado de la SSOT autoritativa del corpus OPM-ES KORA v3.0.0.
> Audiencia: arquitectos OPM, mantenedores del modelador `deep-opm-pro` e instancias futuras del mismo.
> Última actualización del corpus referenciado: KORA v3.0.0 (manifiestos `urn:fxsl:kb:opm-es`, `urn:fxsl:kb:opl-es`, `urn:fxsl:kb:opd-es`, `urn:fxsl:kb:manual-metodologico-opm-es`).
> Estado de este documento: canon operativo exhaustivo para decidir que se puede y que no se puede hacer en OPD, OPL-ES y en la sincronizacion bidireccional entre ambos.

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

### 1.3 Contrato de exhaustividad

Este documento es exhaustivo en **superficie operativa**: enumera las clases de hechos OPM, las formas visuales OPD, las oraciones OPL-ES, las combinaciones permitidas, las combinaciones prohibidas, las zonas no canonizadas y la politica de ida y vuelta OPD<->OPL que debe aplicar `deep-opm-pro`.

La exhaustividad se entiende asi:

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

### 1.4 Cómo leer este documento

- Las secciones 2–5 fijan ontología, geometría, gramática y taxonomía de enlaces.
- La sección 6 fija las **reglas de composición de modificadores**, incluida la asimetría `consumo + c/e` vs `resultado + c/e` (el bug que motivó este documento).
- Las secciones 7–9 fijan abanicos lógicos, refinamiento y la bisimetría OPD↔OPL.
- La sección 10 fija escenarios operativos de ida y vuelta OPD<->OPL.
- La sección 11 enumera anti-patrones permitidos por una UI laxa pero NO canónicos.
- La sección 12 mapea estas reglas a `deep-opm-pro` y lista la zona laxa pendiente.
- Los anexos agregan matrices rapidas, glosario, anti-patrones, cobertura visual `V-*`, y checklist de roundtrip.

Las **tablas son normativas**, no ilustrativas. Las descripciones en prosa explican las tablas, no las sustituyen.

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

### 2.3 Procesos (3.58)

- **R-PROC-1**: un proceso transforma uno o más objetos (`glosario 3.58`, `glosario 3.77`).
- **R-PROC-2**: todo proceso explícito DEBE transformar al menos un objeto (`V-115`). Habilitadores no satisfacen este requisito. Excepción única: **procesos persistentes** reconocidos (`SSOT-iso §Procesos`, `SSOT-opl §3.4`), que se modelan como cambio con `estado_entrada = estado_salida`.
- **R-PROC-3**: un proceso tiene duración positiva (`SSOT-iso §Procesos`).
- **R-PROC-4**: **OPM no admite estados de proceso** ("iniciado", "en proceso", "terminado") (`SSOT-iso §Glosario, notas normativas`). Si se requiere modelar esas fases, se descompone en subprocesos *Iniciar*, *Procesar*, *Finalizar*.

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

- **R-EST-3**: un estado puede ser **simultáneamente inicial y final** (`SSOT-metod §9.19`). Patrón canónico para ciclos cerrados (`empty → loaded → empty`). Duplicar estados (`empty_start`, `empty_end`) es anti-patrón.
- **R-EST-4**: el **estado actual de runtime** (durante simulación, glifo `V-54`) y la designación `Current` declarada son distinguibles en serialización aunque coincidan visualmente (`V-134`, `V-238`).

### 2.7 Instancias

- **R-INS-1**: toda cosa en el modelo conceptual implica al menos una instancia operacional posible (`SSOT-iso §Glosario, notas normativas`).
- **R-INS-2**: distinguir **instancia visual** (misma cosa, otra apariencia local en otro OPD — `V-101`, `V-123`) de **instancia lógica** (relación clasificación-instanciación entre cosas distintas, `RF4`).
- **R-INS-3**: nombre de instancia lógica: `NombreInstancia : NombreClase` (`V-58`).

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

**R-CTRN-1** (`V-71`): el tipo de contorno (sólido/discontinuo) persiste a través de niveles. Un objeto ambiental sigue siendo ambiental en todos los OPDs hijos donde aparezca.

**R-CTRN-2** (`V-70`): el despliegue intradiagrama NO produce contorno grueso (refinable y refinadores comparten OPD).

### 3.4 Profundidad/sombra (`§1.3`)

- sombra canónica desplazada abajo-derecha = esencia física;
- plano = esencia informacional.

**R-SOMB-1** (`V-124`, `V-126`): la sombra en canon-diagrama codifica EXCLUSIVAMENTE fisicidad. Toda sombra decorativa de UI aplicada uniformemente DEBE suprimirse en export canónico. La sombra de una cosa colapsa a un mismo resultado semántico visible: presente si y solo si la cosa es física.

### 3.5 Colores canónicos (`§1.1b`)

**Los colores son informativos, NO normativos** (`V-63`). La semántica se fija por forma + contorno + sombreado. Esquema de referencia:

| Elemento | Borde | Fondo |
|---|---|---|
| Objeto | Verde | Transparente/blanco |
| Proceso | Azul oscuro | Transparente/blanco |
| Estado | Verde oliva | Gris claro |
| Enlace estructural | Negro | — |
| Enlace procedimental | Negro | — |

Una implementación puede usar otra paleta legible siempre que preserve sin ambigüedad la topología semántica.

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

**R-DEC-1** (`V-190`): una piruleta siempre cuelga del extremo de una línea visible. Un círculo aislado no es piruleta.
**R-DEC-2** (`V-191`): handles UI no pueden ser visualmente idénticos a piruletas; deben distinguirse por color reservado a UI, posición o tamaño.

### 3.8 Símbolos triangulares (relaciones estructurales fundamentales, `§1.7`)

| Topología interna del triángulo | Relación |
|---|---|
| Interior completamente relleno | Agregación-participación |
| Triángulo interior distinguible | Exhibición-caracterización |
| Vacío (sin interior distinguible) | Generalización-especialización |
| Círculo interior distinguible | Clasificación-instanciación |

**R-TRI-1** (`V-3`): el **vértice** apunta al refinable; la **base** conecta con los refinadores.
**R-TRI-2** (`V-128`): la topología interna del triángulo es canal normativo. Una implementación que elimine, invierta o colapse la decoración interior NO es conforme.
**R-TRI-3** (`V-131`): los símbolos estructurales importados deben preservar topología interna; la retipificación cromática es admisible.

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

**R-ANID-1** (`V-79`): al descomponer, el rectángulo del objeto o la elipse del proceso se agrandan para contener refinadores. Esto es **proceso inflado** (`SSOT-metod §3`).

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

### 4.1 Convenciones tipográficas Markdown (`SSOT-opl §1.7`)

| Entidad | Convención | Ejemplo |
|---|---|---|
| Objeto | **negrita** | **Ingrediente** |
| Proceso | *cursiva* | *Cocinar* |
| Estado | `monoespaciado` | `crudo` |

Obligatorio en todo OPL emitido por el modelador.

### 4.2 Decisiones de diseño OPL-ES (`§1`)

- **R-OPL-1**: género gramatical en masculino default; ajustable a género natural del sustantivo concreto (`§1.4`).
- **R-OPL-2**: **estar** para estados temporales mutables (`**Objeto** está en `estado``); **ser** para propiedades invariantes (`**Objeto** es de tipo X`, `**X** es un **Y**`) (`§1.5`).
- **R-OPL-3**: artículos omitidos salvo donde gramaticalmente requeridos (`§1.6`):
  - "es un/una" en clasificación-instanciación y especialización individual;
  - "de lo contrario" en condiciones;
  - "al menos" en operadores lógicos.
- **R-OPL-4**: posición del estado: en OPL-ES el estado **sigue** al objeto con preposición "en": `**Usuario** en `activo` maneja *Procesar*` (`§1.9`).
- **R-OPL-5**: voz pasiva refleja: `se consume`, `se omite` (no `es consumido`, `es omitido`) (`§1.10`).

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
| Tipo | es de tipo |
| Enumeración de estados | puede estar |
| Descomposición | se descompone en … en esa secuencia |
| Despliegue | se despliega en |
| Refinamiento entre OPDs | se refina por descomposición de … en |

### 4.4 Plantillas — descripción de cosas (`§3`)

| ID | Plantilla OPL-ES |
|---|---|
| D1–D4 | **Cosa** es física / informacional / ambiental / sistémica. |
| D5 | **Objeto** puede estar `estado1`, `estado2` o `estado3`. |
| D6 | **Objeto** puede estar `estado1`, …, y otros estados. |
| D7 | Estado `s` de **Objeto** es inicial. |
| D8 | Estado `s` de **Objeto** es final. |
| D9 | Estado `s` de **Objeto** es por defecto. |
| D10 | Estado `s` de **Objeto** es inicial y final. |
| D11 / D12 | **Cosa** es persistente / transitoria. |
| D13 | Estado `s` de **Objeto** es declarado `Current`. |

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

**Colecciones incompletas** (`§9.3`): `… y al menos otra parte / otro rasgo / otra especialización.`

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

### 4.12 Etiquetas de ruta (`§13`)

`Por ruta etiqueta, *Proceso* consume **Objeto**.`
`Por ruta etiqueta, *Proceso* genera **Objeto**.`

### 4.13 Atributos y valores (`§14`)

| OPL-ES |
|---|
| **Atributo** de **Objeto** es valor. |
| **Atributo** de **Objeto** varía de X a Y. |
| **Atributo** de **Objeto** puede estar `valor1`, `valor2` o `valor3`. |

### 4.14 EBNF normativa

La EBNF formal completa vive en `SSOT-opl Apéndice A` (A.0–A.10). Cualquier divergencia entre §17 (explicativo) y Apéndice A se resuelve a favor del Apéndice (`SSOT-opl §17`).

### 4.15 Equivalencia EN↔ES de ida y vuelta (`§18.4`)

Una sentencia OPL-ES puede usar **infinitivo** o **nominalización -ción**: `Verificar Identidad` y `Verificación de Identidad` son equivalentes en superficie pero deben mapear al mismo nombre canónico interno por cosa. La traducción EN→ES→EN preserva el hecho del modelo, no la superficie literal.

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
| 5 | Estructural etiquetada | Cosa ↔ Cosa | SE1–SE5, SSE1–SSE7 |

### 5.2 Enlaces transformadores (`SSOT-iso §Enlaces transformadores`)

| Enlace | Firma | Decoración fuente | Decoración destino | OPL canónico |
|---|---|---|---|---|
| Consumo | Objeto → Proceso | (ninguna) | punta cerrada en proceso | T1 / TS1 |
| Resultado | Proceso → Objeto | (ninguna) | punta cerrada en objeto | T2 / TS2 |
| Efecto | Objeto ↔ Proceso | punta cerrada | punta cerrada | T3 / TS3 / TS4 / TS5 |

**Restricciones de origen/destino:**

- **R-CONS-1**: el consumido es objeto **con o sin estados** (`V-5`).
- **R-RES-1** (`V-8`): un enlace de resultado hacia un objeto con estado inicial DEBE conectarse al rectángulo del objeto, **NUNCA directamente al estado inicial**. (Razón: el estado inicial pertenece al ciclo de vida ya iniciado del objeto cuando éste es transformado; el resultado lo crea.)
- **R-EFE-1** (`V-7`): efecto requiere objeto **con al menos un estado definido**.
- **R-EFE-2** (`SSOT-iso §Enlaces transformadores`): semántica de transición — una vez iniciado el proceso afector, el afectado sale del estado de entrada; alcanza el estado de salida solo al completarse. Si se aborta antes, el estado queda indeterminado salvo manejo de excepción.
- **R-EFE-3**: efecto con solo estado de entrada (TS4) sin estado de salida especificado → destino = estado por defecto, o distribución de probabilidad de estados si no hay defecto (`V-9`).

### 5.3 Enlaces habilitadores (`SSOT-iso §Enlaces habilitadores`)

| Enlace | Firma | Decoración | Restricción de origen | OPL |
|---|---|---|---|---|
| Agente | Agente humano → Proceso | piruleta NEGRA en extremo proceso | **EXCLUSIVAMENTE humanos o grupos humanos** | H1 / HS1 |
| Instrumento | Objeto no humano → Proceso | piruleta BLANCA en extremo proceso | NO humanos (robots, IA, software, máquinas) | H2 / HS2 |

**R-AG-1** (`glosario 3.3`, `SSOT-metod §6.5`): el enlace de agente y el término "agente" se reservan EXCLUSIVAMENTE para humanos o grupos de humanos. Robots, agentes de software, IA DEBEN usar enlace de instrumento. Un robot puede describirse como "agente software embebido" en prosa, pero en el modelo usa enlace de instrumento.

**R-AG-2** (`SSOT-iso §Enlaces habilitadores`): si un habilitador deja de existir durante la ejecución, el proceso se detiene y el estado del afectado queda indeterminado (`V-10`).

**R-AG-3** (`SSOT-metod §6.7`, **reclasificación por desgaste**): cuando el desgaste/degradación/amortización del instrumento es relevante al alcance, el instrumento DEBE reclasificarse como afectado (agregando atributo `Amortization Level`). Un proceso de mantenimiento separado modela esa transformación.

### 5.4 Enlaces de invocación (`SSOT-iso §Enlaces de invocación`, `V-240`)

| Enlace | Firma | Decoración | OPL |
|---|---|---|---|
| Invocación | Proceso → Proceso | rayo (zigzag con punta) | IV1 |
| Auto-invocación | Proceso → mismo proceso | zigzag de bucle | IV2 |

**R-INV-1** (`V-240`): firma `Proceso → Proceso`, distinta de transformadora/habilitadora. Por eso es familia autónoma.
**R-INV-2** (invocación implícita, `V-31`, `V-32`): dentro de una descomposición, la terminación de un subproceso invoca al inmediatamente inferior (posición vertical). Subprocesos con borde superior a la misma altura inician en paralelo; el último en terminar inicia el siguiente. NO se dibuja enlace explícito.

### 5.5 Enlaces estructurales fundamentales (`SSOT-iso §Enlaces estructurales`)

| Relación | Triángulo (interior) | Vértice → base | Restricción de perseverancia |
|---|---|---|---|
| Agregación-participación | totalmente relleno | Todo → Partes | misma perseverancia obligatoria |
| Exhibición-caracterización | triángulo interior | Exhibidor → Rasgos | **excepción**: única que admite mezcla (objeto exhibe operación, proceso exhibe atributo) |
| Generalización-especialización | vacío | General → Especializaciones | misma perseverancia obligatoria |
| Clasificación-instanciación | círculo interior | Clase → Instancias | misma perseverancia obligatoria |

**R-STRF-1** (`V-24`, `glosario 3.50`): salvo exhibición-caracterización, refinable y refinadores DEBEN tener misma perseverancia.
**R-STRF-2** (`V-25`, `V-26`): exhibición-caracterización es la ÚNICA estructural que conecta objetos con procesos. Cuatro combinaciones: objeto exhibe atributo, objeto exhibe operación, proceso exhibe atributo, proceso exhibe operación.
**R-STRF-3** (`V-27`): clasificación-instanciación NO distingue colección completa/incompleta. El número de instancias varía en operación.
**R-STRF-4** (`V-57`): las partes de una agregación pueden ser consumidas, afectadas o producidas independientemente sin que el todo lo sea.

### 5.6 Enlaces estructurales etiquetados (`SSOT-iso §Enlaces estructurales`, `§8.1`)

| Variante | Geometría | Decoración | Etiqueta |
|---|---|---|---|
| Unidireccional con etiqueta | línea con punta abierta en destino | open arrowhead | itálica sobre la línea |
| Unidireccional sin etiqueta (null-tagged) | igual | open arrowhead | por defecto: "se relaciona con" |
| Bidireccional (etiquetas distintas) | línea con arpones en ambos extremos | harpoon | dos etiquetas independientes (f-tag / b-tag) |
| Recíproco (misma etiqueta o sin) | línea con arpones | harpoon | una sola etiqueta o sin etiqueta |

**R-STRE-1** (`V-56`): un bidireccional cuyas dos etiquetas son idénticas es semánticamente equivalente a un recíproco con esa misma etiqueta.

### 5.7 Enlaces de excepción (`SSOT-iso §Enlaces de control: condiciones y excepciones`)

| Enlace | Marca | Dispara | OPL |
|---|---|---|---|
| Sobretiempo | `/` | duración real > duración máxima | EX1 |
| Subtiempo | `//` | duración real < duración mínima | EX2 |

**R-EXC-1**: conectan proceso fuente con proceso de manejo. El proceso de manejo es ambiental (`SSOT-visual §4.4`).

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

**Cita normativa** (`SSOT-iso §Enlaces transformadores`):

> **Restricción sobre modificadores de control del enlace de resultado:** no existen las variantes "evento de resultado" ni "condición de resultado". La razón es que el resultado no existe antes del proceso, pues es creado por él, por lo que no puede ser precondición (`c`) ni disparador (`e`). El consumo sí admite ambos modificadores porque el objeto consumido existe en el conjunto previo al proceso. Esta asimetría entre consumo y resultado es inherente a la ontología OPM: el consumo opera sobre el conjunto previo; el resultado opera sobre el conjunto posterior.
>
> **Nota de capa base:** el conjunto posterior al proceso no admite precondiciones, por lo que los modificadores `c` y `e` no aplican a enlaces de resultado. Esta restricción es absoluta y no admite excepciones.

**Refuerzo desde SSOT-visual `V-43`**: en la matriz de precedencia transformadora, los niveles 1 (evento de consumo) y 3 (condición de consumo) existen, pero **no existen** evento ni condición de resultado.

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

Observaciones:
- niveles 1 y 3 contienen consumo ÚNICAMENTE; resultado NO aparece con modificador (consistente con §6.3);
- condición de instrumento (12) es el enlace más débil del sistema; existe formalmente (CH2, CS6) aunque raramente se usa;
- la condición **debilita**; el evento **fortalece**.

### 6.6 Matriz de precedencia transformadora (recomposición)

`SSOT-visual §13.1`: al recomponer subprocesos en un padre, si dos subprocesos tienen distintos enlaces hacia el mismo objeto:

| B↔P1 \ B↔P2 | Efecto | Resultado | Consumo |
|---|---|---|---|
| **Efecto** | Efecto | Resultado | Consumo |
| **Resultado** | Resultado | **Inválido** | Efecto |
| **Consumo** | Consumo | Efecto | **Inválido** |

**R-PREC-1** (`V-43`): Resultado + Resultado y Consumo + Consumo sobre el mismo objeto son inválidos. La matriz `V-43` tambien muestra que Resultado + Consumo y Consumo + Resultado recomponen como Efecto; sin embargo, la prosa de `V-43` declara "resultado + consumo sobre el mismo objeto" invalido. **Arbitraje operativo local**: no colapsar automaticamente esa oposicion. Si hay continuidad de identidad y estados trazables, se modela como Efecto; si solo hay creacion y destruccion del mismo nombre sin estado/identidad que justifique continuidad, se reporta conflicto y se corrige en el OPD hijo.
**R-PREC-2** (`V-44`): un enlace transformador SIEMPRE prevalece sobre un habilitador al recomponer.

### 6.7 Multiplicidad y cardinalidad (`SSOT-iso §Cardinalidades`, `SSOT-opl §12`)

| Símbolo | Rango | OPL-ES |
|---|---|---|
| `?` | 0..1 | un/una opcional |
| `*` | 0..* | opcional (cero o más) |
| (sin símbolo) | 1..1 | (default) |
| `+` | 1..* | al menos un/una |

**R-MULT-1** (`V-23`): la multiplicidad aplica a enlaces etiquetados, agregación-participación y enlaces procedimentales. **NO aplica a procesos directamente** — la repetición secuencial se modela con un proceso recurrente y contador; la paralela con subprocesos síncronos/asíncronos.

Rangos canónicos: `qmín..qmáx`. Intervalos con inclusión/exclusión: `[a..b]`, `(a..b]`, `[a..b)`, `(a..b)`. Listas de intervalos: `[1..10], [20..30]`. Asterisco `*` como extremo abierto.

Restricciones: `=`, `≠`, `<`, `≤`, `≥`, `∈ {conjunto}`.

**R-MULT-2** (`V-21`): los nombres de parámetros de multiplicidad son únicos en todo el modelo.

### 6.8 Probabilidad (`SSOT-iso §Operadores lógicos`)

`Pr=p` anota cada enlace de un abanico probabilístico. Las probabilidades suman 1.0. Por defecto sin abanico: si un proceso produce un objeto con `n` estados sin especificación, cada estado tiene probabilidad `1/n` (`SSOT-metod §10.10`).

**R-PROB-1** (`V-18`): un abanico probabilístico es SIEMPRE XOR — exactamente un enlace se activa por ejecución.

---

## 7. Abanicos lógicos (XOR / OR)

### 7.1 Geometría (`SSOT-visual §5`)

| Operador | Símbolo gráfico | Semántica |
|---|---|---|
| AND | enlaces separados, sin arco | Todos los enlaces del fan se activan |
| XOR | arco discontinuo simple sobre el fan, en el extremo convergente | Exactamente uno de los enlaces se activa |
| OR | dos arcos discontinuos concéntricos sobre el fan | Al menos uno de los enlaces se activa |

**Descripción ASCII conceptual de un XOR convergente (3 objetos → 1 proceso)**:

```
[Obj A] ──╮
[Obj B] ──┼─╮
[Obj C] ──╯ ╰ )))   ← arco discontinuo simple
              ╰──→ ( Proceso )
```

El arco se posiciona en el extremo convergente (`V-16`).

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

**Estado especificado en abanico** (`V-15`, `V-237` aplicado a fans): cada enlace individual del fan puede tener o no estado especificado independientemente.

**Probabilístico**: `Pr=p` por enlace; suma = 1 (`§11.5`).

### 7.5 Resultado-fan-XOR como expansión de resultado simple a objeto con estados (`V-19`)

> Un enlace de resultado simple hacia un objeto con estados es semánticamente equivalente a un abanico XOR de enlaces de resultado con estado especificado, uno por cada estado posible del objeto.

Es decir: `*P* genera **Obj**` (con n estados) ≡ `*P* genera exactamente uno de **Obj** en `s1`, **Obj** en `s2`, …, **Obj** en `sn``. La probabilidad por estado, sin especificar, es 1/n.

**Esta equivalencia NO autoriza** modificadores `c`/`e` sobre el abanico, dado que el fan sigue produciendo elementos del conjunto posterior (Post(P)).

### 7.6 m-de-f combinatorial (`SSOT-metod §10.5`)

Para fan-size `f > 2`, el modelador PUEDE generalizar:
- "exactamente m de f" (XOR combinatorial);
- "al menos m de f" (OR combinatorial),

con `m < f`. El número `m` se anota junto al arco. Ejemplo: "2 de 3 custodios de llave deben estar presentes".

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

Cuando un efecto entrada-salida (TS3) se descompone en subprocesos, el modelo queda subespecificado. **Único mecanismo canónico de resolución**:

1. El subproceso **temprano** recibe el enlace de entrada (TS4): `*P1* cambia **A** de `s1``. → saca al objeto del estado de entrada.
2. El subproceso **tardío** recibe el enlace de salida (TS5): `*P2* cambia **A** a `s2``. → coloca al objeto en el estado de salida.

**R-ESC-1** (`V-41`, `V-110`, `SSOT-metod §7.4`): NO existen versiones con modificador de control de los enlaces escindidos. La escisión es el único mecanismo; no hay alternativa.

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

**R-DIST-1** (`V-37`): consumo y resultado **NO pueden conectarse al contorno exterior** de un proceso descompuesto; conectan directamente al subproceso específico.

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

**R-IDP-1** (`V-247`): la etiqueta `SDx.y` es **proyección humana** del orden de navegación. NO es identidad persistente. Puede mutar bajo reordenamiento o inserción de nodos.

**R-IDP-2** (`V-248`): toda implementación conforme DEBE asignar a cada OPD un identificador persistente recuperable en la serialización, estable bajo renumeración.

**R-IDP-3** (`V-249`): toda referencia externa al modelo que cite un OPD concreto (documentos, trazabilidad, tests) DEBE usar el identificador persistente, NO `SDx.y`.

### 8.9 Restricciones de refinamiento

- **R-REF-1** (`V-100`): no se puede refinar una cosa desde dentro de su propio árbol de refinamiento (chequeo transitivo). Previene loops.
- **R-REF-2** (`V-101`, `V-102`): no se puede crear instancia visual entre tipos diferentes (objeto no es instancia visual de proceso).
- **R-REF-3** (`V-113`): solo OPDs jerárquicos **hoja** son eliminables directamente del árbol jerárquico.
- **R-REF-4** (`V-95`, `V-96`, `V-97`): esencia, perseverancia y nombre NO cambian a través de refinamiento. Son invariantes.

### 8.10 Cambio de rol entre niveles (`V-42`, `V-111`, `V-112`, `SSOT-metod §9.4`)

Un objeto PUEDE ser instrumento en nivel abstracto y afectado en nivel detallado, siempre que el cambio neto entre entrada y salida del proceso a nivel abstracto sea **cero** (estado inicial = estado final). Ejemplo canónico: `Dishwasher` es instrumento en SD pero afectado en SD1 (`empty → loaded → empty`).

**R-ROL-1** (`V-112`): el cambio de rol aplica solo a descomposición, no a despliegue.

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

- **Semi-plegado** (`V-116`–`V-120`, `V-703` en visual): NO existe plantilla OPL canónica. Es exclusivamente visual (`V-703`). Para emitir OPL se debe desplegar previamente.
- **Eventos OR vs condiciones AND** sobre el mismo proceso: gráficamente son enlaces separados sin marca lógica; el OPL emite oraciones separadas, y la semántica de combinación (OR para eventos, AND para condiciones, OR para omisión) NO es expresada literalmente en OPL — debe documentarse en prosa (`SSOT-metod §10.3`).
- **Tokens transitorios de flujo** durante simulación (`V-135`): NO pertenecen a canon-diagrama estático ni a OPL; son marcadores de runtime.
- **Notas y sticky notes** (`V-204`): contenido meta del autor, no hecho del modelo. No emiten OPL.
- **Aliases `{alias}`** y unidades `[u]` en rótulos: parte de la capa computacional, no de OPL nuclear (`§20`).

### 9.5 Principio de consistencia de hechos (`V-98`, `SSOT-iso §Principio de consistencia`)

Un hecho afirmado en un OPD no puede contradecir un hecho afirmado en otro OPD del mismo modelo. Refinamiento o abstracción NO constituye contradicción.

### 9.6 Importancia proporcional (`V-99`)

La importancia relativa de una cosa es proporcional al OPD más alto del árbol donde aparece. Cosas en SD son más importantes que cosas que aparecen solo en SDn.

---

## 10. Escenarios OPD<->OPL — que se puede y que no se puede hacer

Esta seccion es la capa operativa para implementadores. Responde: si el usuario dibuja algo en OPD, que OPL debe salir; si escribe OPL, que OPD debe crearse o modificarse; y cuando una de las dos direcciones debe bloquearse.

### 10.1 Principio de hecho unico

OPD y OPL no son dos modelos. Son dos proyecciones de un mismo **hecho de modelo**:

```
hecho OPM canonico -> proyeccion OPD
hecho OPM canonico -> proyeccion OPL-ES
edicion OPD valida -> mismo hecho OPM canonico -> OPL actualizado
edicion OPL valida -> mismo hecho OPM canonico -> OPD actualizado
```

**R-BI-1**: el kernel del modelo es la autoridad de identidad. OPD y OPL nunca deben divergir silenciosamente.

**R-BI-2**: si una oracion OPL-ES parseada no puede mapearse a una firma OPD canonica, el parser debe rechazarla o clasificarla como no soportada; no debe crear un grafo plausible.

**R-BI-3**: si una forma OPD visible no emite OPL nuclear, debe estar clasificada como UI/vista/meta/estilo/export y no como hecho OPM.

**R-BI-4**: todo roundtrip debe preservar el hecho, no necesariamente la superficie literal. `*Verificar Identidad*` y `*Verificacion de Identidad*` pueden mapear al mismo proceso si el nombre canonico interno asi lo declara.

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
6. Si un cambio visual solo afecta estilo autoral, no debe cambiar OPL nuclear.
7. Si un cambio visual afecta contorno, sombra, forma, marker, triangulo o estado, debe cambiar el hecho y su OPL.
8. Si la accion genera una combinacion prohibida, bloquear antes de persistir o marcar error estructural recuperable.

### 10.13 Casos de ruptura controlada de bisimetria

| Ruptura | Por que ocurre | Politica |
|---|---|---|
| Layout no textual | Posicion, routing, viewport y grid no son OPL nuclear | preservar en metadato OPD |
| Vista parcial | Un OPD puede ocultar hechos visibles en otro OPD | OPL del sistema completo se compone desde todos los OPDs y hechos |
| Estilo autoral | Color/fuente/tamano pueden no ser semanticos | normalizar en canon-diagrama si perfil lo exige |
| UI/transitorio | Handles, overlays y tutorial no son modelo | suprimir en export e ignorar en OPL |
| Runtime | Simulacion es estado de ejecucion, no modelo conceptual | exportar solo si snapshot declarado |
| Sub-modelos no cargados | Referencias pueden existir sin contenido local | export declara resolucion y completitud |

## 11. Anti-patrones — lo que NO se puede hacer

Esta sección enumera construcciones que una UI laxa puede permitir pero NO son canónicas. Cada anti-patrón cita la regla de la SSOT que lo prohíbe.

### 11.1 Tabla maestra de anti-patrones

| # | Construcción no-canónica | Por qué no canon | Sustituto canónico |
|---|---|---|---|
| AP-01 | **Resultado + modificador `c`** (sobre enlace de resultado base T2/TS2) | `SSOT-iso §Enlaces transformadores`: "el resultado no existe antes del proceso, no puede ser precondición. Esta restricción es absoluta y no admite excepciones." `V-43` matriz §13.5 confirma ausencia de niveles "condición de resultado". No hay plantilla en `SSOT-opl §7` | Si la lógica requiere "este proceso solo produce X si ocurre Y", modelar Y como condición de **consumo** o **efecto** en el lado de entrada del proceso. La existencia del resultado se condiciona implícitamente a la ejecución del proceso |
| AP-02 | **Resultado + modificador `e`** | Misma razón que AP-01: el resultado no existe en Pre(P), no puede ser disparador. SSOT-OPL §6 no incluye plantilla `ET-resultado`/`ETS-resultado` | El evento debe colocarse sobre el lado de entrada (consumo, efecto, agente o instrumento) |
| AP-03 | **Abanico XOR / OR de resultado + modificador `c` o `e`** | El fan multiplica enlaces de resultado; cada uno individualmente cae bajo AP-01/AP-02. Resultado-fan-XOR (`V-19`) es expansión de estados, no autoriza `c`/`e` | Mover el control al lado de entrada o usar fan probabilístico (`Pr=p`) sin `c`/`e` |
| AP-04 | **Enlace de resultado conectado directamente al estado inicial** | `V-8`: "el resultado debe conectarse al rectángulo del objeto o a un estado distinto del inicial, nunca directamente al estado inicial" | Conectar al rectángulo del objeto o a un estado no-inicial |
| AP-05 | **Enlace de agente conectado a robot, software, IA, máquina** | `glosario 3.3`, `SSOT-metod §6.5`: "el término 'agente' y el enlace de agente se reservan exclusivamente para humanos o grupos humanos" | Usar enlace de instrumento (piruleta blanca) |
| AP-06 | **Enlace de consumo o resultado en el contorno exterior de un proceso descompuesto** | `V-37`, `V-103`: prohibido. Deben conectarse al subproceso específico | Reasignar al primer subproceso (consumo) o al último (resultado) |
| AP-07 | **Enlace de efecto entrada-salida sin escisión** al descomponer | `V-40`, `V-110`: la escisión es el único mecanismo válido | Reemplazar por TS4 (en subproceso temprano) + TS5 (en subproceso tardío) |
| AP-08 | **Enlace escindido (TS4/TS5) + modificador `c` o `e`** | `V-41`, `V-110`, `SSOT-metod §7.4`: "saltar un subproceso de una escisión distorsionaría la semántica del efecto" | NO permitido. Si el efecto es opcional, modelar como condición sobre el efecto entrada-salida completo (CS2), no sobre los escindidos |
| AP-09 | **Modificador `c` o `e` sobre enlace estructural** | Los modificadores son procedimentales (`SSOT-iso §Enlaces de control`). Los enlaces estructurales son time-invariant (`glosario 3.73`); no admiten precondiciones | Si se necesita restringir a un estado, usar enlace estructural con estado especificado (SSE1–SSE7) |
| AP-10 | **Modificador `c` o `e` sobre enlace de invocación** | SSOT-OPL §8.2 (IV1/IV2) no provee plantillas con modificadores. La invocación es proceso→proceso, no objeto→proceso | Para invocación condicional, usar fan XOR/OR de invocación o nodo de decisión booleano |
| AP-11 | **Bidireccional o recíproco con estado solo en destino** | `V-30`: las variantes bidireccional y recíproco NO existen para estado solo en destino | Usar unidireccional con estado en destino (SSE2) o agregar estado en origen también |
| AP-12 | **Modelar "iniciado", "en proceso", "terminado" como estados de un proceso** | `SSOT-iso §Glosario, notas normativas`: "OPM reserva los estados para objetos. No usa estados de proceso" | Descomponer en subprocesos *Iniciar*, *Procesar*, *Finalizar*; o usar atributo `Estado del Proceso` (objeto exhibido) con estados |
| AP-13 | **Refinamiento con un solo subproceso o un solo refinador** | `SSOT-metod §7.1`: refinamiento no trivial exige ≥ 2 hijos | Eliminar el refinamiento o postergar hasta identificar más elementos |
| AP-14 | **Duplicar estados para evitar el inicial+final simultáneo** (ej. `empty_start`, `empty_end`) | `SSOT-metod §9.19`: "el estado cíclico es el patrón correcto; duplicar introduce sinónimo falso" | Marcar el estado único como inicial Y final simultáneamente (D10) |
| AP-15 | **Crear instancia visual entre tipos distintos** (objeto como instancia visual de proceso) | `V-102`: prohibido | Usar nueva apariencia del mismo tipo; o relación clasificación-instanciación lógica si son cosas distintas |
| AP-16 | **Refinar una cosa desde dentro de su propio árbol de refinamiento (ciclo)** | `V-100`: chequeo transitivo prohíbe loops | Romper el ciclo refactorizando la jerarquía |
| AP-17 | **Usar `SDx.y` como identificador estable para trazabilidad externa** | `V-247`, `V-248`, `V-249`, `SSOT-metod §8.2`: las etiquetas son proyección humana, no identidad persistente | Usar identificador persistente (UUID/URI/slug) declarado por la implementación |
| AP-18 | **Renombrar o agregar estados a una referencia externa en el modelo consumidor** | `SSOT-metod §15` invariante, `V-184`: la existencia pertenece al modelo propietario; el consumidor solo referencia | Modificar la cosa en el modelo propietario, o crear cosa distinta en el consumidor |
| AP-19 | **Sombra aplicada uniformemente a cosas informacionales como decoración UI** | `V-124`: la sombra codifica EXCLUSIVAMENTE esencia física en canon-diagrama | Suprimir la sombra decorativa en export canónico; reservar sombra a cosas físicas |
| AP-20 | **Triángulo estructural sin interior distinguible cuando representa exhibición o clasificación** | `V-128`: "no es conforme si elimina, invierte o colapsa la decoración interior hasta volverlas indistinguibles de generalización" | Renderizar topología interna correcta (triángulo interior para exhibición, círculo interior para clasificación) |
| AP-21 | **Enlace de evento desde objeto sistémico cruzando frontera de descomposición** | `V-38`: prohibido | Mover el evento dentro de la descomposición, o cambiar el objeto a ambiental si corresponde (V-108) |
| AP-22 | **Sinónimos múltiples para el mismo concepto en el mismo modelo** | `SSOT-metod §9.15`: OPM exige 1:1 entre cosa y nombre canónico interno | Elegir un nombre canónico; variantes de superficie pueden coexistir editorialmente pero mapean al mismo canónico interno |
| AP-23 | **Truncamiento silencioso del rótulo con elipsis en export canónico** | `V-194`, `V-212`: no se admite truncamiento; la herramienta debe expandir/reubicar/rechazar resize | Ajustar bounding box o tamaño antes de exportar |
| AP-24 | **Reutilizar canales visuales reservados (borde discontinuo, contorno grueso, halo de simulación) para UI o validación** | `V-198`, `V-203`, `V-220`, `V-224`: prohibido reutilizar canales semánticos para UI | Usar canal visual reservado a UI distinguible |
| AP-25 | **Modelar "Soportar", "Mantener", "Contener" como proceso explícito cuando no hay esfuerzo sostenido relevante** | `SSOT-metod §9.1`: heurística — preferir enlace estructural etiquetado | `**Cimentación** soporta **Casa**.` (etiquetado SE1) en lugar de `*Soportar*` como proceso con instrumento y afectado |
| AP-26 | **Mantener objeto transiente explícito** cuando es creado e inmediatamente consumido sin observación intermedia | `SSOT-metod §9.2`: heurística — usar enlace de invocación | `*Detectar* invoca *Evaluar*.` en lugar de `Spark` como objeto entre los dos procesos |
| AP-27 | **Conectar un evento a un subproceso intermedio (no el primero) de una descomposición** sin justificación | `SSOT-metod §7.4` antipatrón explícito: "salta los anteriores, potencialmente dejando el sistema en estado inconsistente" | Conectar el evento al primer subproceso; o justificar que todos los previos pueden omitirse |
| AP-28 | **`c` y `e` simultáneamente sobre el mismo enlace** | NO definido en SSOT-OPL ni en SSOT-visual; no aparece en ninguna plantilla canónica | No usar. Si se requiere semántica conjunta, modelar control externo (objeto booleano + nodo de decisión, `SSOT-metod §10.10`) |
| AP-29 | **Enlaces estructurales heredados dibujados explícitamente en el OPD** | `V-73`: "los enlaces heredados no son visibles explícitamente en el OPD; su efecto se infiere del árbol" | No dibujar; el sistema OPL los emite por inferencia desde la cadena de generalización-especialización |
| AP-30 | **Resultado + resultado o Consumo + consumo sobre el mismo objeto durante recomposición** | `V-43`: marcadas como **inválidas** en matriz de precedencia transformadora | Corregir en el nivel hijo (los dos subprocesos no pueden ambos crear o ambos consumir el mismo objeto del nivel abstracto) |

### 11.2 Zonas no canonizadas (silencios de la SSOT)

Las siguientes construcciones NO aparecen explícitamente prohibidas ni canonizadas. La SSOT guarda silencio, lo que las clasifica como **no canonizadas** (no inventar reglas):

| Zona | Estado |
|---|---|
| Combinación `c + e` sobre el mismo enlace | No definida. Tratar como NO canonizada (AP-28). |
| `Pr=p` sobre fan no-XOR (ej. fan OR con probabilidades) | `V-18` declara fan probabilístico ≡ XOR; la combinación con OR no se canoniza. |
| Modificadores sobre enlace estructural etiquetado | No definidos en SSOT-OPL §9; tratar como no canónicos (AP-09). |
| Enlace probabilístico sin fan | `Pr=p` se define solo dentro de abanicos (`V-18`); fuera no tiene canonicidad. |
| Multiplicidad sobre procesos directamente | `V-23`: NO aplica a procesos. Usar contador de iteración. |
| Etiquetas de ruta sobre enlaces habilitadores | SSOT-opl §13 las ilustra solo sobre consumo/resultado. No canonizadas sobre agente/instrumento. |

---

## 12. Aplicación a `deep-opm-pro`

Esta sección enumera, de forma compacta, qué reglas ya enforza el modelador, cuáles están parcialmente cerradas y qué reglas siguen como zona laxa para tickets futuros.

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
| AP-01/AP-02 cierre kernel | `aplicarModificador` todavia valida por naturaleza procedural, no por input-side/result-side | ALTA |
| OPL legacy de resultado condicional | Parser/generador conserva forma de resultado + condicion + abanico de rondas previas | ALTA |
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
3. Cuando la SSOT calle (zona no canonizada), la UI **restringe por defecto** (cierra por seguridad) y el restriction se documenta como NO-canonizado, no como prohibición ontológica.
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

---

Fin del documento. Mantener sincronizado con la SSOT KORA `v3.0.0` y siguientes.
