# Dossier normativo: reglas-opm-estrictas-es v1.5.0, tramo B (l. 876–1523)

- **Fuente**: `scratchpad/canon/reglas-opm-estrictas-es/content.md` (v1.5.0, 1523 líneas).
- **Tramo cubierto**: §6 Modificadores y combinaciones, §7 Abanicos XOR/OR, §8 Refinamiento, §9 Bisimetría OPD↔OPL, §10 Escenarios de edición/importación/bloqueo, §11 Anti-patrones, §12 Aplicación a deep-opm-pro, Anexos A/B/C y cierre.
- **Lectura**: el tramo se leyó completo en dos pasadas (876–1215 y 1216–1523). Además se hojearon las l. 1–150 para los IDs y se buscaron los IDs citados desde el tramo: R-ROL-UNIC-1 (l. 872), R-INV-1/1A/2/2A/2B/2C/2D (l. 802–812), R-EFE-3 (l. 777), R-EST-1/2 (l. 212–222), R-OPL-RANGO-3 (l. 703), R-OPL-CONJ-1 (l. 704), plantillas §4 (l. 495–640) y familias §5.1 (l. 750–756).
- **Regla de lectura**: rige solo el texto de los 4 documentos del canon. Las citas `SSOT-*`, `V-*` y `glosario` indican procedencia y no se siguen.

## Leyenda

**Obligación**: se copia tal como la expresa el canon (DEBE / NO DEBE / PUEDE / "ESTÁ PROHIBIDA" / "DEBE bloquearse" / "DEBE reportarse"). Cuando el texto es declarativo y no tiene verbo modal, se marca `inferido` junto a la fuerza deducida.

**Consecuencia para la herramienta**:

| Código | Significado |
|---|---|
| IMPEDIR | bloquear antes de persistir, o persistir solo como error estructural recuperable (R-EDIT-8, R-ESC-OP-4) |
| ADVERTIR | informar sin bloquear |
| GEN-OPL | generar OPL |
| PARSE-OPL | parsear OPL |
| RENDER | realización visual en el canvas o en el export |
| OPERACIÓN | soportar una operación de edición (descomponer, recomponer, integrar...) |
| DATOS | exigencia sobre el modelo de datos o el kernel |
| EXPORT/IMPORT | contrato de export o import |
| MÉTODO | solo método humano, no es chequeable mecánicamente |
| N/A | no aplica a la herramienta (gobernanza documental, simulación no implementada, etc.) |

**Marca de alcance** (propuesta de este dossier para la versión "más simple"):
- `[NÚCLEO]`: imprescindible para un modelador OPD↔OPL conforme.
- `[COND]`: aplica solo si la herramienta ofrece la capacidad. Si no la ofrece, se declara como diferida en el registro de conformidad (R-CONF-7, l. 133), y el importador responde `unsupported-canonical` (R-IMPORT-5).
- `[SOBRE]`: sobreingeniería o circunstancial (ver §(a)).

**Niveles de decisión del canon** (l. 110–118), usados por las tablas de este tramo:

| Estado | Significado operativo |
|---|---|
| **Canónico** | Se puede crear, serializar, importar y editar bidireccionalmente. |
| **Canónico condicionado** | Se puede usar solo si se cumplen las condiciones indicadas; si faltan, la herramienta debe pedir datos o advertir. |
| **No canonizado** | La SSOT no lo define. No se debe inventar como OPM nuclear; solo puede existir como extensión declarada. |
| **Prohibido** | Contradice una regla de la SSOT. La herramienta debe bloquearlo o reportarlo como error estructural. |
| **UI / vista** | Puede existir en pantalla, pero no es hecho OPM nuclear ni debe emitir OPL nuclear. |

"Las **tablas son normativas**. La prosa fuera de tablas solo es válida si formula una regla aplicable." (l. 120)

---

## §6 Modificadores y combinaciones

### 6.1 Naturaleza de los modificadores

Texto normativo (l. 880): "Los modificadores **`e`** (evento) y **`c`** (condición) son **anotaciones sobre un enlace base** transformador o habilitador. NO constituyen una familia de enlace adicional. La semántica del enlace base se preserva; el modificador agrega control."

Tabla textual:

| Modificador | Efecto sobre la precondición | Si falla |
|---|---|---|
| `e` (evento) | El objeto/estado DISPARA la evaluación de la precondición; el evento se pierde tras la evaluación incluso si falla | Proceso no se ejecuta; evento consumido |
| `c` (condición) | Introduce **bypass condicional**: el objeto/estado se requiere para ejecutar | Proceso se **omite** (no espera); control pasa al siguiente |
| (ninguno) | Enlace transformador/habilitador base | Si el objeto no existe, proceso **espera** indefinidamente |

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| (l. 880) | inferido DEBE | `e`/`c` son un atributo del enlace base transformador/habilitador, no un tipo de enlace. | DATOS `[NÚCLEO]`: el enlace lleva `control ∈ {ninguno, e, c}` y la familia no cambia. |
| R-ECA-1 | inferido DEBE | Un proceso comienza solo cuando ocurre el evento iniciador, si existe, y se satisface la precondición. | N/A mientras no haya simulación. Fija la semántica documental. |
| R-ECA-2 | DEBE | El conjunto previo al proceso DEBE incluir consumidos, afectados y habilitadores necesarios antes de iniciar. | DATOS: clasificación Pre(P). |
| R-ECA-3 | DEBE | El conjunto posterior DEBE incluir resultantes y afectados después de completar. | DATOS: clasificación Post(P). |
| R-ECA-4 | NO DEBE | Un modificador `e` o `c` NO agrega cosa ni enlace; la cardinalidad del constructo básico se conserva. | DATOS `[NÚCLEO]`: marcar un modificador no crea nodos ni aristas. En OPL, ET1 "**O** inicia *P*, que consume **O**" es un solo hecho. |

### 6.2 Lado de aplicación: solo entrada (INPUT-only)

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-MOD-0A | inferido (definición) | Pre(P) agrupa consumidos, afectados pre-transición y habilitadores requeridos antes de iniciar. | DATOS: predicado `esLadoEntrada(enlace)`. |
| R-MOD-0B | inferido (definición) | Post(P) agrupa resultantes y afectados post-transición después de completar. | DATOS. |

### 6.3 Asimetría consumo/resultado bajo `e` y `c` (matriz de extremos permitidos)

| Enlace base | `+ e` válido | `+ c` válido | Razón |
|---|---|---|---|
| Consumo | **SÍ** (ET1, ETS1) | **SÍ** (CT1, CS1) | el consumido existe en Pre(P) → puede ser disparador y precondición |
| Resultado | **NO** | **NO** | el resultado **no existe antes** del proceso; no puede ser precondición ni disparador |
| Efecto (objeto con estados) | **SÍ** (ET2, ETS2–4) | **SÍ** (CT2, CS2–4) | el afectado existe en Pre(P) con su estado de entrada |
| Agente | **SÍ** (EH1, EHS1) | **SÍ** (CH1, CS5) | el agente existe en Pre(P) |
| Instrumento | **SÍ** (EH2, EHS2) | **SÍ** (CH2, CS6) | el instrumento existe en Pre(P) |

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-MOD-1 | inferido NO DEBE | No existen variantes de evento de resultado ni de condición de resultado. | IMPEDIR `[NÚCLEO]` (= AP-01/AP-02). |
| R-MOD-2 | inferido PUEDE | El consumo admite `e` y `c`. | OPERACIÓN: permitir el modificador en consumo. |
| R-MOD-3 | inferido NO DEBE | El resultado no admite `e` ni `c`. | IMPEDIR `[NÚCLEO]`. |
| R-MOD-4 | NO DEBE (NO admite) | Post(P) NO admite evento ni condición; `e`/`c` aplican exclusivamente a Pre(P). | IMPEDIR `[NÚCLEO]`. En la UI, el selector de modificador se desactiva para resultados. |
| R-MOD-5 | NO DEBE | La matriz de fuerza semántica NO DEBE contener niveles de evento de resultado ni de condición de resultado. | DATOS: la tabla de 12 niveles (§6.5) no los tiene. |

### 6.4 Otras combinaciones de modificadores

| Combinación | Estado canónico | Notas |
|---|---|---|
| `c` + estado especificado | Canónico (CS1–CS6) | Restringe la condición a un estado concreto del objeto/agente/instrumento |
| `e` + estado especificado | Canónico (ETS1–ETS4, EHS1–EHS2) | El estado específico del objeto dispara |
| `c` + `e` sobre el mismo enlace | NO definido en SSOT | No aparece en gramática OPL ni en geometría visual. Tratar como no canonizado |
| Modificador sobre enlace estructural | Prohibido (error de categoría) | `c` y `e` anotan solo enlaces transformador/habilitador; un enlace estructural queda fuera de ese alcance (AP-09) |
| Modificador sobre invocación | Prohibido (error de categoría) | Los modificadores anotan solo enlaces transformador/habilitador; la invocación es familia autónoma (proceso→proceso) y queda fuera de ese alcance. Alternativa canónica: nodo de decisión booleano (AP-10) |
| Modificador sobre enlace escindido (TS4/TS5) | **PROHIBIDO** | "Saltar un subproceso de una escisión distorsionaría la semántica del efecto" |

Consecuencias:
- DATOS `[NÚCLEO]`: el modificador sobre estado especificado es canónico, así que el extremo de estado debe ser combinable con `e`/`c`.
- `c`+`e`: el control es excluyente (radio `ninguno | e | c`). Así la combinación no puede construirse, lo que es lo más simple y conforme (AP-28 solo la tolera como extensión o como estado de edición).
- Estructural, invocación y excepción: IMPEDIR `[NÚCLEO]`.
- Fragmento escindido: IMPEDIR, pero solo para el fragmento escindido (ver R-ESCIND-0 y GAP-1).

### 6.5 Resolución de colisión de rol por fuerza semántica

Texto normativo (l. 927): "Al **recomponer o abstraer** subprocesos (out-zoom, plegado), cuando un objeto tendría dos enlaces procedimentales hacia el mismo proceso (violando R-ROL-UNIC-1), prevalece el de mayor fuerza. En **edición directa**, la colisión NO se auto-resuelve: se trata por R-EDIT-8 (bloqueo o error estructural recuperable). Esta resolución por fuerza es, pues, regla de recomposición (consistente con §5.8), no de auto-resolución universal."

```
consumo = resultado > efecto > agente > instrumento
```
```
evento > sin control > condición
```

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

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| (l. 927) | inferido DEBE / NO DEBE | La fuerza se usa solo al recomponer o abstraer. En edición directa no se auto-resuelve. | Edición: IMPEDIR `[NÚCLEO]` un segundo enlace procedimental entre el mismo objeto y el mismo proceso (R-ROL-UNIC-1). Recomposición: OPERACIÓN `[COND]`. |
| R-FUERZA-1 | DEBE / NO DEBE | Los niveles 1 y 3 contienen solo consumo; el resultado NO DEBE aparecer con modificador. | DATOS. |
| R-FUERZA-2 | inferido | La condición de instrumento es el enlace más débil del sistema. | DATOS (orden). |
| R-FUERZA-3 | DEBE | El modificador de condición DEBE debilitar la fuerza respecto del enlace base. | DATOS (orden). |
| R-FUERZA-4 | DEBE | El modificador de evento DEBE fortalecer la fuerza respecto del enlace base. | DATOS (orden). |

### 6.6 Matriz de precedencia transformadora (recomposición)

| B↔P1 \ B↔P2 | Efecto | Resultado | Consumo |
|---|---|---|---|
| **Efecto** | Efecto | Resultado | Consumo |
| **Resultado** | Resultado | **Inválido** | Efecto |
| **Consumo** | Consumo | Efecto | **Inválido** |

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-PREC-1 | inferido NO DEBE ("son inválidos") | Resultado+Resultado y Consumo+Consumo sobre el mismo objeto son inválidos. | IMPEDIR la recomposición (= AP-30) `[COND: recomposición]`. |
| R-PREC-2 | DEBE | Resultado+Consumo (en cualquier orden) DEBE recomponerse como Efecto solo si hay continuidad de identidad y estados trazables. | OPERACIÓN `[COND]`. |
| R-PREC-3 | DEBE | Si no hay continuidad, DEBE reportarse como conflicto. | ADVERTIR/IMPEDIR al recomponer. |
| R-PREC-4 | NO DEBE | La herramienta NO DEBE colapsar automáticamente la tensión matriz/prosa sin evidencia de continuidad. | OPERACIÓN: sin evidencia, se pregunta al usuario. |
| R-PREC-5 | inferido DEBE ("SIEMPRE prevalece") | Un enlace transformador siempre prevalece sobre un habilitador al recomponer. | OPERACIÓN `[COND]`. |

### 6.7 Multiplicidad y cardinalidad

| Símbolo | Rango | OPL-ES |
|---|---|---|
| `?` | 0..1 | un/una opcional |
| `*` | 0..* | opcional (cero o más) |
| (sin símbolo) | 1..1 | (default) |
| `+` | 1..* | al menos un/una |

Texto normativo: "Rangos canónicos: `qmín..qmáx`. Intervalos con inclusión/exclusión: `[a..b]`, `(a..b]`, `[a..b)`, `(a..b)`. Listas de intervalos: `[1..10], [20..30]`. Asterisco `*` como extremo abierto." y "Restricciones: superficie EBNF normativa `=`, `<`, `>`, `<=`, `>=` y `en {conjunto}` (R-OPL-RANGO-3, R-OPL-CONJ-1). Los glifos Unicode `≠`, `≤`, `≥`, `∈` son superficie de visualización y DEBEN normalizarse a la forma ASCII o declararse como extensión."

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-MULT-1 | inferido DEBE | La multiplicidad aplica a enlaces etiquetados, agregación-participación y enlaces procedimentales. | DATOS `[NÚCLEO]` (atributo de extremo). GEN/PARSE-OPL con la tabla. RENDER con R-VIS-MULT-1. |
| R-MULT-1A | inferido NO DEBE | La multiplicidad NO aplica a procesos directamente. | IMPEDIR. |
| R-MULT-1B | DEBE | La repetición secuencial de un proceso DEBE modelarse con proceso recurrente y contador. | MÉTODO. |
| R-MULT-1C | DEBE | La repetición paralela DEBE modelarse con subprocesos síncronos o asíncronos dentro de una descomposición. | MÉTODO. |
| (restricciones) | DEBEN | `≠ ≤ ≥ ∈` DEBEN normalizarse a ASCII o declararse extensión. | PARSE-OPL: normalizar al parsear. GEN-OPL: emitir ASCII. |
| R-MULT-2 | DEBE | Los nombres de parámetros de multiplicidad DEBEN ser únicos en todo el modelo. | IMPEDIR `[COND: parámetros]`. |

### 6.8 Probabilidad

Texto normativo (l. 999): "`Pr=p` anota cada enlace de un abanico **declarado probabilístico**. Las probabilidades suman 1.0. El default uniforme `1/n` — cada estado o rama sin anotar es equiprobable — es regla de **simulación** (asignación al ejecutar), no obligación de **modelado**: un abanico ordinario de alternativas no exige anotar probabilidades; solo el abanico que el modelador declara probabilístico las exige (ver R-FAN-PROB-1)."

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-PROB-1 | DEBE | Un abanico probabilístico DEBE ser siempre XOR. | IMPEDIR `[COND: Pr]`. |
| R-PROB-1A | DEBE | En un abanico probabilístico exactamente un enlace DEBE activarse por ejecución. | N/A (simulación). |
| (suma) | inferido DEBE | Σ Pr = 1.0 en un abanico declarado probabilístico con pesos. | ADVERTIR/IMPEDIR `[COND]`. |

---

## §7 Abanicos lógicos (XOR / OR)

### 7.1 Geometría

| Operador | Símbolo gráfico | Semántica |
|---|---|---|
| AND | enlaces separados, sin arco | Todos los enlaces del fan se activan |
| XOR | arco discontinuo simple sobre el fan, en el extremo convergente | Exactamente uno de los enlaces se activa |
| OR | dos arcos discontinuos concéntricos sobre el fan | Al menos uno de los enlaces se activa |

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-FAN-GEO-1 | DEBE | El arco lógico DEBE posicionarse en el extremo convergente del abanico. | RENDER `[NÚCLEO]` (ver GAP-6 sobre qué significa "extremo convergente" en un abanico divergente). |
| R-FAN-GEO-2 | DEBE | Todo abanico DEBE clasificarse como convergente o divergente. | DATOS `[NÚCLEO]`: se deriva del extremo común. |

### 7.2 Aplicabilidad por familia

| Familia | Convergente | Divergente |
|---|---|---|
| Consumo | N objetos → 1 proceso | 1 objeto → N procesos |
| Resultado | N procesos → 1 objeto | 1 proceso → N objetos |
| Efecto | N objetos ↔ 1 proceso | N procesos ↔ 1 objeto |
| Agente | N agentes → 1 proceso | 1 agente → N procesos |
| Instrumento | N instrumentos → 1 proceso | 1 instrumento → N procesos |
| Invocación | N procesos → 1 proceso | 1 proceso → N procesos |

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-FAN-HAB-1 | inferido DEBE ("son canónicos. Por defecto son AND") | Los habilitadores convergentes (N agentes o N instrumentos sobre 1 proceso) son canónicos. Por defecto son **AND**: se realizan como enlaces planos al mismo proceso, sin arco. El arco XOR/OR solo se dibuja para el abanico alternativo. | DATOS/RENDER `[NÚCLEO]`: AND es la ausencia de abanico. Solo XOR/OR crean una entidad `abanico`. |

### 7.3 Plantillas OPL-ES de abanico (copia textual)

| Familia | XOR | OR |
|---|---|---|
| Consumo convergente | *P* consume exactamente uno de **A**, **B** o **C**. | *P* consume al menos uno de **A**, **B** o **C**. |
| Consumo divergente | Exactamente uno de *P*, *Q* o *R* consume **B**. | Al menos uno de *P*, *Q* o *R* consume **B**. |
| Resultado convergente | Exactamente uno de *P*, *Q* o *R* genera **B**. | Al menos uno de *P*, *Q* o *R* genera **B**. |
| Resultado divergente | *P* genera exactamente uno de **A**, **B** o **C**. | *P* genera al menos uno de **A**, **B** o **C**. |
| Efecto (objetos) | *P* afecta exactamente uno de **A**, **B** o **C**. | *P* afecta al menos uno de **A**, **B** o **C**. |
| Efecto (procesos) | **B** es afectado por exactamente uno de *P*, *Q* o *R*. | **B** es afectado por al menos uno de *P*, *Q* o *R*. |
| Agente divergente | **B** maneja exactamente uno de *P*, *Q* o *R*. | **B** maneja al menos uno de *P*, *Q* o *R*. |
| Agente convergente | *P* es manejado por exactamente uno de **A**, **B** o **C**. | *P* es manejado por al menos uno de **A**, **B** o **C**. |
| Instrumento divergente | Exactamente uno de *P*, *Q* o *R* requiere **B**. | Al menos uno de *P*, *Q* o *R* requiere **B**. |
| Instrumento convergente | *P* requiere exactamente uno de **A**, **B** o **C**. | *P* requiere al menos uno de **A**, **B** o **C**. |
| Invocación divergente | *P* invoca exactamente uno de *Q* o *R*. | *P* invoca al menos uno de *Q* o *R*. |
| Invocación convergente | Exactamente uno de *P* o *Q* invoca *R*. | Al menos uno de *P* o *Q* invoca *R*. |

Consecuencia: GEN-OPL y PARSE-OPL `[NÚCLEO]` de las 24 celdas. Es gate de validez: por el desempate de la l. 41, esta tabla manda sobre `spec-forja-opl-es`. Enumeración: "A, B o C" (coma y "o" final). Negrita para objetos, cursiva para procesos.

### 7.4 Combinación con modificadores (copia textual)

"**Evento + XOR/OR**: insertar "inicia" antes del verbo principal:
- **B** inicia exactamente uno de *P*, *Q* o *R*, y es afectado por el proceso que ocurre."

"**Condición + XOR/OR**: insertar "ocurre si … existe / está en estado … de lo contrario … se omite":
- Exactamente uno de *P*, *Q* o *R* ocurre si **B** existe, en cuyo caso afecta **B**, de lo contrario se omite."

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| (plantillas 7.4) | inferido DEBE | Regla de inserción de "inicia" y de "ocurre si… de lo contrario… se omite" sobre las plantillas de abanico. | GEN/PARSE-OPL `[NÚCLEO]` (solo ejemplificado para efecto; ver GAP-7). |
| R-FAN-EST-1 | PUEDE | Cada enlace individual del fan PUEDE tener o no estado especificado, de forma independiente. | DATOS: el extremo de estado es por enlace, no por abanico. |
| R-FAN-PROB-1 | DEBE / NO exige / DEBE | Tres casos. **(A)** Abanico declarado probabilístico con pesos conocidos: DEBE declarar `Pr=p` por enlace y suma total `1`. **(B)** Abanico ordinario de alternativas (sin pretensión probabilística): NO exige anotación; sus ramas son alternativas sin peso. **(C)** Abanico declarado probabilístico sin pesos conocidos: el modelador DEBE declarar explícitamente el estado «probabilístico sin pesos», ni número inventado (barro cuantitativo, prohibido) ni default uniforme silencioso. Al simular se asume `1/n`, pero el modelo registra que los pesos quedan pendientes. | DATOS `[COND: Pr]`: `abanico.probabilidad ∈ {ninguna, conPesos, sinPesos}`. IMPEDIR/ADVERTIR si Σ≠1 en (A). NO DEBE inventar pesos por defecto. Ver GAP-9 (sin plantilla OPL para (C)). |

### 7.5 Resultado-fan-XOR como expansión de resultado simple a objeto con estados

Cita normativa: "> Un enlace de resultado simple hacia un objeto con estados es semánticamente equivalente a un abanico XOR de enlaces de resultado con estado especificado, uno por cada estado posible del objeto."

"Es decir: `*P* genera **Obj**` (con n estados) ≡ `*P* genera exactamente uno de **Obj** en `s1`, **Obj** en `s2`, …, **Obj** en `sn``. La probabilidad por estado, sin especificar, es 1/n."

"**Esta equivalencia NO autoriza** modificadores `c`/`e` sobre el abanico, dado que el fan sigue produciendo elementos del conjunto posterior (Post(P))."

Consecuencia: DATOS (equivalencia semántica). La herramienta NO necesita materializar el abanico. IMPEDIR `c`/`e` en cualquier caso. N/A para la simulación 1/n.

### 7.6 m-de-f combinatorial

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-FAN-M-1 | PUEDE | Para `f > 2`, "exactamente m de f" (XOR combinatorial). | `[COND][SOBRE]` |
| R-FAN-M-2 | PUEDE | Para `f > 2`, "al menos m de f" (OR combinatorial). | `[COND][SOBRE]` |
| R-FAN-M-3 | DEBE | `m < f`. | IMPEDIR si se implementa. |
| R-FAN-M-4 | DEBE | `m` DEBE anotarse junto al arco. | RENDER si se implementa. Sin plantilla OPL (GAP-7). |

---

## §8 Refinamiento

### 8.1 Mecanismos canónicos

| Par | Refinamiento | Abstracción | Ámbito |
|---|---|---|---|
| Estados | Expresión de estados | Supresión de estados | estados |
| Estructura | Despliegue (`unfolding`) | Plegado (`folding`) | comportamiento estructural |
| Comportamiento | Descomposición (`in-zooming`) | Recomposición (`out-zooming`) | comportamiento dinámico |
| Composición inter-modelo | Referencia a sub-modelo | Desconexión | cross-model |

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-REF-MEC-1 | DEBE | El despliegue/plegado estructural DEBE aplicarse por relación fundamental: agregación, exhibición, generalización o clasificación. | OPERACIÓN `[NÚCLEO]`: el despliegue elige la relación RF1..RF4. |
| (fila 4) | inferido | La composición inter-modelo es el cuarto par. | `[SOBRE]`: ver R-VIS-FAM-1 y R-VIS-SUB-*. |

### 8.2 Síncrono vs asíncrono

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-REF-SYNC-1 | inferido DEBE | La descomposición de proceso es síncrona: el padre espera a que todos los subprocesos completen. | N/A (semántica). Documenta el sentido de CX1. |
| R-REF-SYNC-2 | inferido NO DEBE | El despliegue es asíncrono respecto del control, revela estructura estática y NO implica secuenciación temporal. | RENDER/GEN-OPL: el despliegue no emite "en esa secuencia". |

### 8.3 Refinamiento no trivial

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-REF-NTRIV-1 | DEBE | Un proceso descompuesto DEBE contener al menos **2 subprocesos** para cerrar como refinamiento canónico. | ADVERTIR en edición, IMPEDIR en cierre/export `[NÚCLEO]`. |
| R-REF-NTRIV-2 | DEBE | Un despliegue DEBE revelar al menos **2 refinadores** para cerrar. | ídem. |
| R-REF-NTRIV-3 | NO DEBE / PUEDE / DEBE | Un refinamiento con un solo hijo NO DEBE cerrarse ni exportarse como canónico; solo PUEDE persistir como placeholder de edición tipificado y DEBE eliminarse, postergarse o ampliarse antes del cierre. | DATOS (placeholder permitido) + IMPEDIR en export. |

### 8.4 Enlaces escindidos

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-ESCIND-0 | inferido DEBE | TS4/TS5 designan dos hechos distinguibles por procedencia: **(a) fragmento escindido** (mitad de un par acoplado derivado de un TS3 al descomponer) y **(b) efecto parcial standalone** (enlace de efecto completo; TS4 con salida por defecto). La prohibición de modificadores (R-ESC-1) aplica EXCLUSIVAMENTE a (a). (b) admite evento o condición según R-EFE-3, ETS3 y ETS4. "Un fragmento escindido NUNCA se origina por parseo de OPL aislado: solo se produce por la operación de descomposición y persiste con metadato de procedencia." | DATOS `[NÚCLEO si hay descomposición con estados]`: `enlace.procedencia = 'escision'` y referencia al par. PARSE-OPL: TS4/TS5 parseados siempre son standalone (ver GAP-2). |
| R-ESCIND-1 | inferido | Si un TS3 se descompone, el modelo queda subespecificado hasta escindir. | ADVERTIR o forzar la escisión (AP-07 exige bloquear). |
| R-ESCIND-2 | DEBE | El subproceso temprano DEBE recibir el enlace de entrada (TS4) y sacar al objeto del estado de entrada. | OPERACIÓN `[NÚCLEO]` al descomponer. |
| R-ESCIND-3 | DEBE | El subproceso tardío DEBE recibir el enlace de salida (TS5) y colocar al objeto en el estado de salida. | OPERACIÓN `[NÚCLEO]`. |
| R-ESC-1 | inferido NO DEBE ("NO existen") | No existen versiones con modificador de control de los enlaces escindidos. | IMPEDIR (= AP-08). |
| R-ESC-1A | DEBE (extensión local) | La escisión DEBE ser el único mecanismo canónico admitido por `deep-opm-pro` para resolver la subespecificación del efecto al descomponer ("decisión de producto"). | OPERACIÓN `[NÚCLEO]`: no hay alternativa. Mención circunstancial al nombre del producto. |

### 8.5 Distribución de enlaces al descomponer

| Tipo de enlace | Contorno exterior del proceso padre | Distribución |
|---|---|---|
| Consumo | **PROHIBIDO** | Migra al **primer** subproceso |
| Resultado | **PROHIBIDO** | Migra al **último** subproceso |
| Efecto básico (sin estado) | PERMITIDO | A todos los subprocesos |
| Efecto entrada-salida | — | Escisión TS4/TS5 |
| Agente | PERMITIDO | A todos los subprocesos |
| Instrumento | PERMITIDO | A todos los subprocesos |
| Estructural | NO se distribuye | Permanece asociado al contenedor |
| Evento sistémico | **PROHIBIDO** cruzar frontera | — |
| Evento ambiental | Permitido cruzar frontera | Con modelado de contingencia |

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-DIST-1 | NO DEBE | Consumo y resultado NO DEBEN conectarse al contorno exterior de un proceso descompuesto. | IMPEDIR `[NÚCLEO]` (= AP-06). |
| R-DIST-1A | DEBE | Consumo y resultado DEBEN conectarse directamente al subproceso específico. | OPERACIÓN `[NÚCLEO]`: migración automática según la tabla (primero/último), editable después. |
| (tabla) | inferido DEBE | Distribución del efecto básico, el agente y el instrumento a todos los subprocesos. El estructural queda en el contenedor. El evento sistémico no cruza la frontera. | OPERACIÓN `[NÚCLEO]`. IMPEDIR evento sistémico (= AP-21). |

### 8.6 Contenedor y elementos externos

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-HIJO-1 | DEBE | Al crear un OPD hijo, la cosa refinada DEBE aparecer como contenedor interno. | OPERACIÓN/RENDER `[NÚCLEO]`. |
| R-HIJO-2 | DEBE | Las cosas conectadas en el padre DEBEN aparecer en el hijo como externos cuando la regla de copia lo exija. | OPERACIÓN `[NÚCLEO]`. |
| R-HIJO-3 | DEBE | En descomposición de proceso, el hijo DEBE copiar como externos todas las cosas conectadas al padre por cualquier enlace. | OPERACIÓN `[NÚCLEO]`. |
| R-HIJO-4 | DEBE | En despliegue de objeto o proceso, el hijo DEBE copiar solo los hijos estructurales directos. | OPERACIÓN `[NÚCLEO]`. |
| R-HIJO-5 | NO DEBE | Un elemento externo NO DEBE refinarse desde el OPD hijo donde aparece como externo. | IMPEDIR `[NÚCLEO]`. |
| R-HIJO-6 | DEBE | Los objetos internos creados dentro de una descomposición y sin apariencia en el padre DEBEN eliminarse en cascada al eliminar el proceso padre. | OPERACIÓN `[NÚCLEO]`. |

### 8.7 Identidad persistente vs etiqueta visible

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-IDP-0 | DEBE | Orden temporal, orden de navegación e identidad persistente DEBEN mantenerse como canales separados. | DATOS `[NÚCLEO]`. |
| R-IDP-0A | inferido DEBE | El orden temporal es un atributo **declarado** de la descomposición (preorden por bandas con cardinalidad, R-INV-2D). La coordenada vertical lo **realiza**, no es su fuente. Se rige por R-INV-2/R-INV-2A. | DATOS `[NÚCLEO]`: guardar el orden (bandas) en el modelo y derivar la y del render. GEN-OPL "en esa secuencia"/"paralelo". |
| R-IDP-0B | NO DEBE | El orden de navegación se deriva de la posición en el árbol y NO DEBE usarse como identidad persistente. | DATOS. |
| R-IDP-0C | DEBE | La identidad persistente DEBE ser un id estable recuperable en serialización y usado como ancla de referencia externa. | DATOS/EXPORT `[NÚCLEO]`. |
| R-IDP-1 | DEBE | `SDx.y` DEBE tratarse como proyección humana del orden de navegación, NO como identidad. | DATOS: la etiqueta se calcula. |
| R-IDP-1A | PUEDE | `SDx.y` PUEDE mutar bajo reordenamiento o inserción. | RENDER: se recalcula. |
| R-IDP-2 | DEBE | Toda implementación DEBE asignar a cada OPD un id persistente recuperable en serialización, estable bajo renumeración. | DATOS `[NÚCLEO]`. |
| R-IDP-3 | DEBE | Toda referencia externa que cite un OPD DEBE usar el id persistente, NO `SDx.y`. | EXPORT (= AP-17). |

### 8.8 Restricciones de refinamiento

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-REF-1 | NO DEBE ("NO se puede") | No se puede refinar una cosa desde dentro de su propio árbol de refinamiento (chequeo transitivo). Previene loops. | IMPEDIR `[NÚCLEO]` (= AP-16). |
| R-REF-2 | NO DEBE | No se puede crear instancia visual entre tipos diferentes. | IMPEDIR `[NÚCLEO]` (= AP-15). |
| R-REF-3 | inferido NO DEBE | Solo los OPDs jerárquicos **hoja** son eliminables directamente del árbol. | IMPEDIR eliminar un OPD no hoja `[NÚCLEO]`. |
| R-REF-4 | NO DEBE ("NO cambian… invariantes") | Esencia, perseverancia y nombre NO cambian a través del refinamiento. | DATOS `[NÚCLEO]`: son atributos de la cosa, no de la apariencia. |

### 8.9 Cambio de rol entre niveles

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-ROL-1 | PUEDE (condicionado) | Un objeto PUEDE ser instrumento en el nivel abstracto y afectado en el detallado solo si el cambio neto entre entrada y salida del proceso abstracto es cero. | ADVERTIR `[COND]`: chequeo si el estado final es igual al inicial. |
| R-ROL-2 | inferido NO DEBE | El cambio de rol aplica solo a descomposición, no a despliegue. | IMPEDIR/ADVERTIR. |
| R-ROL-3 | DEBE | Si el cambio neto no es cero, el objeto DEBE modelarse como afectado también en el nivel abstracto. | ADVERTIR. |

### 8.10 SD, árboles, Bocetos, OPL completo, vistas

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-SD-1 | DEBE | El SD DEBE modelar interesados, beneficiarios, el proceso que entrega valor y las cosas ambientales/sistémicas indispensables. | MÉTODO (a lo sumo un checklist). |
| R-SD-2 | DEBE | El SD DEBE contener solo cosas centrales e indispensables. | MÉTODO. |
| R-SD-3 | PUEDE | El valor funcional PUEDE aparecer como cambio de estado de un atributo del beneficiario, o implícitamente si el beneficiario es afectado. | MÉTODO. |
| R-SD-4 | inferido DEBE | El SD contiene exactamente un proceso sistémico; puede contener procesos ambientales. | ADVERTIR en edición / IMPEDIR en cierre `[NÚCLEO]` (= R-VIS-SD-1). |
| R-ARB-1 | DEBE | El árbol de procesos DEBE tener raíz `SD` y nodos correspondientes a OPDs creados por descomposición. | DATOS `[NÚCLEO]`. |
| R-ARB-2 | DEBE | El árbol de objetos DEBE tener raíz en un objeto y mostrar su elaboración por refinamiento. | `[COND]`: vista derivada del árbol de despliegues. |
| R-ARB-3 | inferido | `SD`, `SD1`, `SD1.1`... son navegación visible; la identidad es R-IDP-2. | RENDER. |
| R-ARB-4 | DEBE | Cada arista del árbol DEBE tener semántica equivalente a `se refina por descomposición de NombreProceso en` o `se refina por despliegue de NombreCosa en`. | DATOS: arista = {tipo: descomposición/despliegue, cosa refinada}. GEN-OPL posible. |
| R-CAN-BOCETO-1 | DEBE (extensión local) | Un **Boceto** es un OPD no raíz con `padreId = null`, sin slot de refinamiento. Es estado de organización, no primitiva OPM ni error. Sus hechos locales DEBEN conservar bimodalidad OPD↔OPL. | DATOS/GEN-OPL `[SOBRE/COND]`. |
| R-CAN-BOCETO-2 | DEBE / PUEDE / NO | En **régimen Modelo**, uno o más Bocetos DEBEN bloquear el export canónico `canon-diagrama` y `canon-documento` con causa y nombres recuperables. Graduar con pendientes PUEDE dejar Bocetos, pero NO satisface el gate ni los integra. | EXPORT (IMPEDIR) `[SOBRE/COND]`. |
| R-CAN-BOCETO-3 | PUEDE / DEBE / NO DEBE | En **régimen Apunte**, el export PUEDE incluir Bocetos con **marca explícita** de bosquejo y sin afirmar cierre de Modelo. Debe aparecer como observación y NO DEBE bloquear la edición; la integridad estructural y la emisión OPL siguen siendo obligatorias. | EXPORT/ADVERTIR `[SOBRE/COND]`. |
| R-CAN-BOCETO-4 | DEBEN / NO | Integrar (como descomposición o despliegue) y Devolver a Bocetos DEBEN cambiar solo la pertenencia al árbol, preservando identidad y hechos. Graduar a Modelo y Reabrir en Taller DEBEN cambiar solo el régimen documental. Integrar NO gradúa; Graduar NO integra; ninguna de estas operaciones, ni exportar o marcar Biblioteca, certifica validación humana. | OPERACIÓN `[SOBRE/COND]`. |
| R-OPL-TOTAL-1 | DEBE | El OPL completo DEBE obtenerse concatenando los párrafos OPL locales en orden de navegación del árbol. | GEN-OPL `[NÚCLEO]`. |
| R-OPL-TOTAL-2 | NO DEBE / DEBE | El OPL completo NO DEBE describir solo el contexto actual; DEBE cubrir todo el sistema individual cargado. | GEN-OPL `[NÚCLEO]`. |
| R-OPL-TOTAL-3 | inferido DEBE | En modelos compuestos, cada modelo conserva OPL local autocontenido; la composición exige referencias explícitas. | `[SOBRE]`. |
| R-OPL-TOTAL-4 | DEBE | El OPL de un OPD DEBE expresar solo los estados visibles o referenciados en ese OPD. | GEN-OPL `[NÚCLEO]`. |
| R-OPL-TOTAL-5 | DEBE | El conjunto completo de estados de un objeto DEBE calcularse como unión de sus estados en todos los OPDs del modelo. | DATOS/GEN-OPL `[NÚCLEO]`. |
| R-VIEW-1 | PUEDE | Un OPD de vista PUEDE reunir hechos de múltiples OPDs. | `[COND]`. |
| R-VIEW-2 | NO DEBE | Una vista NO DEBE crear hechos OPM nuevos por el solo hecho de materializar apariencias. | DATOS `[COND]`. |
| R-VIEW-3 | DEBE | Una vista DEBE tipificarse como jerárquica, vista anclada o vista ad hoc. | DATOS `[COND]`: `opd.tipo`. |
| R-VIEW-4 | DEBE / NO DEBE | El mapa del sistema DEBE representarse como árbol de procesos que muestra el contenido de cada OPD como nodo; NO DEBE confundirse con un OPD jerárquico. | RENDER `[COND][SOBRE]`. |
| R-BRING-1 | inferido NO DEBE | `bring connected things`, `bring links between selected entities` y equivalentes son operadores derivados de contexto; NO son refinamiento ontológico. | OPERACIÓN `[COND]`. |
| R-SIMP-1 | PUEDE | Un OPD sobrecargado PUEDE simplificarse abstrayendo hacia un constructo superior. | MÉTODO. |
| R-SIMP-2 | NO DEBE ("ESTÁ PROHIBIDA") | La simplificación está prohibida si crea enlaces procedimentales directos entre procesos pares sin semántica OPM. | IMPEDIR al recomponer `[COND]`. |

### 8.11 Descomposición y recomposición como operaciones

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-OPD-OP-1 | DEBE | La descomposición en nuevo diagrama DEBE tratarse como operación OPM que requiere `SDn`, muestra contenido, refina enlaces y genera `SDn+1`. | OPERACIÓN `[NÚCLEO]`. |
| R-OPD-OP-2 | DEBE | La recomposición es la operación inversa: requiere `SDn+1`, abstrae enlaces, oculta contenido y genera `SDn`. | OPERACIÓN `[COND]`. La versión simple borra el refinamiento con confirmación, sin recomposición automática. |
| R-OPD-OP-3 | NO DEBE | Un OPD semidescompuesto es transitorio; NO DEBE persistirse como canónico final salvo recuperación de edición declarada. | DATOS: transacción atómica. |
| R-OPD-OP-4 | DEBE | Toda migración de enlaces al descomponer/recomponer DEBE preservar la identidad de los hechos o declarar eliminación/creación explícita. | OPERACIÓN `[NÚCLEO]`: migrar conservando `enlace.id`. |
| R-OPD-OP-5 | PUEDE / DEBE | La herramienta PUEDE rastrear refinadores y ajustar automáticamente símbolo y OPL; si lo hace, DEBE conservar trazabilidad de cada ajuste. | OPERACIÓN `[COND]`. |
| R-OPD-OP-6 | DEBE | La herramienta DEBE advertir si se intenta incluir un objeto como refinador en más de un contexto cuando pueda crear ambigüedad de pertenencia. | ADVERTIR `[NÚCLEO]`. |
| R-OPD-OP-7 | PUEDE / DEBE | La herramienta PUEDE establecer sintaxis por defecto para nombres de refinadores ambiguos, pero la resolución DEBE ser trazable. | `[COND]`. |

---

## §9 Relación OPD↔OPL (bisimetría)

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-BI-DUAL-1 | DEBE | Cada OPD tiene su contraparte en un párrafo OPL. Toda afirmación gráfica DEBE ser reproducible como OPL y toda oración OPL DEBE ser representable como constructo OPD. | GEN-OPL + PARSE-OPL `[NÚCLEO]`. |
| R-BI-TAB-1 | DEBE | La tabla 9.2 es el gate mínimo de roundtrip: toda construcción listada DEBE emitirse con su plantilla y toda plantilla DEBE reconstruir el mismo hecho nuclear. | Test de roundtrip `[NÚCLEO]`. |

### 9.2 Tabla de bisimetría canónica (copia textual)

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
| Triángulo con triángulo interior, vértice al exhibidor | **Exhibidor** exhibe **Atributo1** y **Atributo2**. (RF2) |
| Triángulo vacío, vértice al general | **Especialización1** y **Especialización2** son **General**. (RF3) |
| Triángulo con círculo interior, vértice a la clase | **Instancia** es una instancia de **Clase**. (RF4) |
| Proceso inflado con subprocesos verticales | *Proceso* se descompone en *P1* y *P2*, en esa secuencia. (CX1) |
| Arco discontinuo simple sobre fan | exactamente uno de … (XOR) |
| Arco doble sobre fan | al menos uno de … (OR) |
| Marca `/` sobre enlace de excepción | *Manejo* ocurre si duración de *Fuente* excede máx-duración. (EX1) |

Consecuencias:
- GEN-OPL, PARSE-OPL y RENDER `[NÚCLEO]` para las filas de cosas, estados, T1–T3, TS3, H1, H2, ET1, CT1, IV1, RF1–RF4, CX1, XOR y OR.
- EX1 es `[COND]` (duraciones).
- La esencia informacional es el default y no emite oración. Hay que definir la política: se omite siempre o se emite "es informacional" (D2, l. 501) cuando se explicita. El parser DEBE aceptar ambas.
- Tipografía obligatoria: **negrita** para objetos, *cursiva* para procesos, `mono` para estados (R-IMPORT-2).

### 9.3 Casos donde la bisimetría se rompe o requiere convención

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-BR-1 | NO DEBE / DEBE | El semi-plegado NO DEBE emitir OPL nuclear; para emitir OPL canónico DEBE desplegarse antes o declararse vista visual. | `[COND][SOBRE]` si no hay semi-plegado. |
| R-BR-2 | DEBEN / DEBE | Eventos OR y condiciones AND sobre el mismo proceso DEBEN conservarse como enlaces separados. Si la combinación no queda literal en OPL, DEBE persistirse como semántica de control tipificada. | DATOS `[COND]` (tipo no definido, GAP-26). |
| R-BR-3 | inferido NO DEBE | Los tokens transitorios de simulación NO pertenecen al canon-diagrama ni al OPL nuclear. | N/A sin simulación. |
| R-BR-4 | inferido NO DEBE ("NO emiten") | Notas y sticky notes son meta del autor; NO emiten OPL nuclear. | GEN-OPL: se excluyen `[COND: notas]`. |
| R-BR-5 | NO DEBEN | Aliases `{alias}` y unidades `[u]` pertenecen a la capa computacional; NO DEBEN confundirse con OPL nuclear. | `[SOBRE]`. |

### 9.4 y 9.5 Consistencia e importancia

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-CONSIST-1 | NO DEBE | Un hecho afirmado en un OPD NO DEBE contradecir un hecho afirmado en otro OPD del mismo modelo. | DATOS `[NÚCLEO]`: con un kernel único, cada hecho existe una sola vez y la contradicción es imposible por construcción. |
| R-CONSIST-2 | inferido | Refinamiento o abstracción no constituye contradicción. | DATOS. |
| R-IMP-1 | DEBE | La importancia relativa de una cosa DEBE considerarse proporcional al OPD más alto donde aparece. | MÉTODO / N/A. |
| R-IMP-2 | DEBE | Una cosa en SD DEBE tratarse como más importante que una que aparece solo en descendientes. | MÉTODO / N/A (a lo sumo, orden del OPL o de la búsqueda). |

---

## §10 Escenarios OPD↔OPL: edición, importación y bloqueo

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-ESC-OP-1 | DEBE | Toda edición OPD válida DEBE proyectarse a OPL-ES canónico o a metadato tipificado. | GEN-OPL `[NÚCLEO]`. |
| R-ESC-OP-2 | DEBE | Toda edición OPL-ES válida DEBE proyectarse a OPD canónico o a metadato tipificado. | PARSE-OPL `[NÚCLEO]`. |
| R-ESC-OP-3 | DEBE | Toda edición ambigua DEBE bloquearse hasta resolver identidad, firma o alcance. | IMPEDIR `[NÚCLEO]`. |
| R-ESC-OP-4 | DEBE | Toda edición prohibida DEBE rechazarse o persistirse solo como error estructural recuperable. | IMPEDIR `[NÚCLEO]`. |
| R-BI-0 | inferido | OPD y OPL NO son dos modelos; son dos proyecciones del mismo hecho canónico. | DATOS `[NÚCLEO]`: kernel único, OPL derivado. |
| R-BI-0A | DEBE | Una edición OPD válida DEBE modificar el hecho canónico y regenerar OPL. | GEN-OPL `[NÚCLEO]`. |
| R-BI-0B | DEBE | Una edición OPL válida DEBE modificar el hecho canónico y regenerar OPD. | PARSE-OPL + RENDER `[NÚCLEO]`. |
| R-BI-1 | NO DEBEN | El kernel es la autoridad de identidad. OPD y OPL NO DEBEN divergir silenciosamente. | DATOS `[NÚCLEO]`. |
| R-BI-2 | DEBE / NO DEBE | Si una oración parseada no puede mapearse a una firma OPD canónica, el parser DEBE rechazarla o clasificarla no soportada; NO DEBE crear un grafo plausible. | PARSE-OPL `[NÚCLEO]`: parser estricto, sin heurística "plausible". |
| R-BI-3 | DEBE | Una forma OPD visible que no emite OPL nuclear DEBE clasificarse como UI/vista/meta/estilo/export y no como hecho. | DATOS/RENDER. |
| R-BI-4 | DEBE / PUEDEN | Todo roundtrip DEBE preservar el hecho, no necesariamente la superficie literal. Las variantes de superficie PUEDEN mapear al mismo proceso solo si el nombre canónico interno así lo declara. | PARSE-OPL: la igualdad se mide sobre hechos. |

### 10.2 Política de importación OPL

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-IMPORT-1 | DEBE | Toda importación OPL-ES DEBE parsearse contra la gramática (texto: "`SSOT-opl Apéndice A`") antes de tocar el modelo. | PARSE-OPL `[NÚCLEO]`: parse completo y luego aplicación atómica. En este canon la EBNF operativa vive en `spec-forja-opl-es` (GAP-32). |
| R-IMPORT-2 | DEBE | Cada nombre DEBE resolverse a una cosa existente, o crear una nueva solo si la tipografía la desambigua: **negrita** objeto, *cursiva* proceso, `mono` estado. | PARSE-OPL `[NÚCLEO]`. |
| R-IMPORT-3 | PUEDE | Si una oración referencia un estado inexistente, el importador PUEDE crearlo solo si el objeto propietario está inequívocamente identificado. | PARSE-OPL. |
| R-IMPORT-4 | DEBE | Si una oración crea un enlace cuya firma contradice tipos existentes, el importador DEBE rechazarla. | PARSE-OPL + IMPEDIR `[NÚCLEO]`. |
| R-IMPORT-5 | DEBE / NO DEBE | Si una oración es canónica pero la app no soporta su familia, DEBE reportar `unsupported-canonical` y NO DEBE degradarla. | PARSE-OPL `[NÚCLEO]`: el código de diagnóstico es literal. Es la válvula de simplicidad. |
| R-IMPORT-6 | DEBE / NO DEBE | Si una oración es no canonizada, DEBE reportar `non-canonical` y NO DEBE convertirla en extensión silenciosa. | PARSE-OPL `[NÚCLEO]`: código literal. |
| R-IMPORT-7 | DEBE | Si una oración cambia el tipo ontológico de una cosa existente, DEBE bloquear y pedir decisión explícita: renombrar, crear cosa nueva o corregir OPL. | PARSE-OPL + IMPEDIR `[NÚCLEO]`. |
| R-IMPORT-8 | DEBE | Si una oración elimina información visual no expresable en OPL, el importador DEBE preservar metadato de layout, vista o estilo salvo normalización explícita. | PARSE-OPL/DATOS `[NÚCLEO]`: el reparse no destruye posiciones. |

### 10.3 Política de edición OPD

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-EDIT-1 | DEBE | Validar firma antes de crear enlace. | IMPEDIR `[NÚCLEO]`. |
| R-EDIT-2 | DEBE | Validar extremo de estado antes de anclar. | IMPEDIR `[NÚCLEO]`. |
| R-EDIT-3 | DEBE | Si se cambia el tipo de cosa, recalcular perseverancia y revisar todos los enlaces afectados. | OPERACIÓN/IMPEDIR `[NÚCLEO]`. |
| R-EDIT-4 | DEBE | Si se mueve una cosa entre OPDs, preservar identidad y emitir solo cambios de apariencia. | DATOS `[NÚCLEO]`. |
| R-EDIT-5 | NO DEBE | Al crear una vista o usar `Bring`, NO crear hechos nuevos salvo enlaces o cosas explícitamente nuevos. | DATOS `[COND]`. |
| R-EDIT-6 | NO DEBE | Un cambio visual que solo afecta estilo autoral NO DEBE cambiar OPL nuclear. | GEN-OPL. |
| R-EDIT-7 | DEBE | Un cambio visual que afecta contorno, sombra, forma, marker, triángulo o estado DEBE cambiar el hecho y su OPL. | DATOS/GEN-OPL `[NÚCLEO]`: esos canales visuales son vistas de atributos semánticos, no estilo. |
| R-EDIT-8 | DEBE | Si la acción genera una combinación prohibida, DEBE bloquearse antes de persistir o marcarse error estructural recuperable. | IMPEDIR `[NÚCLEO]`. Lo más simple es bloquear siempre. |

---

## §11 Anti-patrones: reglas de prohibición

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-AP-0 | NO DEBE | Una UI puede exponer construcciones laxas solo como estado de edición; NO DEBE persistirlas como canónicas. | DATOS. |
| R-AP-0A | DEBE | Todo anti-patrón DEBE citar regla SSOT primaria o silencio SSOT. | N/A (documental). Ver GAP-15. |
| R-AP-0B | DEBE | Todo anti-patrón DEBE declarar sustituto canónico o política de rechazo. | Mensajes de error: el diagnóstico debe incluir la "Acción canónica". |
| R-AP-0C | NO DEBE / DEBEN | Un AP que cite silencio SSOT NO DEBE redactarse con verbo de prohibición ontológica; aplica el régimen no canonizado (R-APP-5). Solo los AP con contradicción explícita o error de categoría DEBEN ordenar bloqueo. | Diagnósticos: separar "Prohibido" de "No canonizado". |

### 11.1 Tabla maestra de anti-patrones (copia textual + consecuencia)

| # | Construcción no canónica | Regla de rechazo | Acción canónica | Consecuencia herramienta |
|---|---|---|---|---|
| AP-01 | **Resultado + modificador `c`** (sobre T2/TS2) | DEBE bloquearse: resultado pertenece a Post(P), no puede ser precondición; no contiene plantilla. | Mover el control al lado de entrada mediante consumo, efecto, agente o instrumento condicional. | IMPEDIR `[NÚCLEO]` |
| AP-02 | **Resultado + modificador `e`** | DEBE bloquearse: resultado pertenece a Post(P), no puede ser disparador; no contiene plantilla. | Colocar el evento sobre consumo, efecto, agente o instrumento. | IMPEDIR `[NÚCLEO]` |
| AP-03 | **Abanico XOR / OR de resultado + `c` o `e`** | DEBE bloquearse: cada enlace del fan sigue siendo resultado y hereda AP-01/AP-02. | Mover control al lado de entrada o usar fan probabilístico sin `c/e`. | IMPEDIR `[NÚCLEO]` |
| AP-04 | **Resultado conectado directamente al estado inicial** | DEBE bloquearse. | Conectar al rectángulo del objeto o a un estado no inicial. | IMPEDIR `[NÚCLEO]` |
| AP-05 | **Agente conectado a robot, software, IA o máquina** | DEBE bloquearse. | Usar enlace de instrumento. | MÉTODO/ADVERTIR (no hay rasgo "humano" en el modelo, GAP-14) |
| AP-06 | **Consumo o resultado en contorno exterior de proceso descompuesto** | DEBE bloquearse. | Reasignar consumo al primer subproceso y resultado al último. | IMPEDIR + OPERACIÓN `[NÚCLEO]` |
| AP-07 | **Efecto entrada-salida sin escisión al descomponer** | DEBE bloquearse. | Reemplazar por TS4 en subproceso temprano y TS5 en tardío. | OPERACIÓN (escisión automática) `[NÚCLEO]` |
| AP-08 | **Enlace escindido TS4/TS5 (par acoplado) + `c` o `e`** | DEBE bloquearse; no aplica a ETS3/ETS4 standalone (R-ESCIND-0). | Modelar opcionalidad sobre el efecto entrada-salida completo o con control externo. | IMPEDIR `[NÚCLEO]` (usa `procedencia`) |
| AP-09 | **`c` o `e` sobre enlace estructural** | DEBE bloquearse: los modificadores son procedimentales y lo estructural es invariante temporal. | Usar enlace estructural con estado especificado solo cuando la variante con estado esté definida. | IMPEDIR `[NÚCLEO]` |
| AP-10 | **`c` o `e` sobre invocación** | DEBE bloquearse: los modificadores anotan exclusivamente transformador/habilitador; la invocación es familia autónoma (R-INV-1A): error de categoría. | Usar nodo de decisión booleano, fan de invocación u objeto booleano / condición sobre proceso previo. | IMPEDIR `[NÚCLEO]` |
| AP-11 | **Bidireccional o recíproco con estado solo en destino** | DEBE bloquearse. | Usar unidireccional con estado en destino o agregar estado en origen. | IMPEDIR `[NÚCLEO si hay SE/SSE]` |
| AP-12 | **Estados de proceso** | DEBE bloquearse: OPM reserva estados para objetos. | Descomponer en subprocesos o usar atributo exhibido `Estado del Proceso`. | IMPEDIR/DATOS `[NÚCLEO]` (el proceso no tiene estados) |
| AP-13 | **Refinamiento con un solo subproceso o refinador** | DEBE bloquearse en cierre/export canónico; PUEDE persistir solo como placeholder tipificado. | Eliminar, postergar o ampliar a ≥ 2 hijos. | ADVERTIR en edición; IMPEDIR en export `[NÚCLEO]` |
| AP-14 | **Duplicar estados para evitar inicial+final simultáneo** | DEBE bloquearse como sinónimo falso. | Marcar el estado único como inicial y final. | DATOS (permitir inicial+final) + MÉTODO (no es detectable, GAP-15) |
| AP-15 | **Instancia visual entre tipos distintos** | DEBE bloquearse. | Usar apariencia del mismo tipo o clasificación-instanciación lógica. | IMPEDIR `[NÚCLEO]` |
| AP-16 | **Refinamiento cíclico transitivo** | DEBE bloquearse. | Romper el ciclo. | IMPEDIR `[NÚCLEO]` |
| AP-17 | **`SDx.y` como identificador estable externo** | DEBE bloquearse. | Usar identificador persistente. | DATOS/EXPORT `[NÚCLEO]` |
| AP-18 | **Modificar referencia externa en modelo consumidor** | DEBE bloquearse. | Modificar en modelo propietario o crear cosa distinta. | `[COND: sub-modelos][SOBRE]` |
| AP-19 | **Sombra decorativa en cosa informacional** | DEBE suprimirse en canon-diagrama. | Reservar sombra a esencia física. | RENDER `[NÚCLEO]` |
| AP-20 | **Triángulo estructural sin topología interna requerida** | DEBE bloquearse. | Renderizar triángulo interior o círculo interior según relación. | RENDER `[NÚCLEO]` |
| AP-21 | **Evento sistémico cruzando frontera de descomposición** | DEBE bloquearse. | Mover evento dentro de la descomposición o reclasificar como ambiental si corresponde. | IMPEDIR `[NÚCLEO]` |
| AP-22 | **Sinónimos múltiples para la misma cosa** | DEBE reportarse por violar unicidad nominal. | Elegir nombre canónico y mapear variantes de superficie. | DATOS (nombre único por tipo en el modelo) + MÉTODO (sinónimos) |
| AP-23 | **Truncamiento silencioso de rótulo en export canónico** | DEBE bloquearse. | Ajustar bounding box, layout o tamaño antes de exportar. | RENDER/EXPORT `[NÚCLEO]` (autoajuste del tamaño) |
| AP-24 | **Reutilizar canales semánticos para UI/validación** | DEBE bloquearse. | Usar canal visual reservado a UI. | RENDER `[NÚCLEO]` (selección y errores con color/halo reservado) |
| AP-25 | **Proceso explícito para soporte/mantenimiento sin esfuerzo sostenido relevante** | DEBE reportarse como mala clasificación metodológica. | Usar enlace estructural etiquetado. | MÉTODO |
| AP-26 | **Objeto transiente creado y consumido sin observación intermedia** | DEBE reportarse como objeto artificial. | Usar enlace de invocación. | ADVERTIR (heurística: objeto con exactamente 1 T2 y 1 T1 y nada más) `[COND]` |
| AP-27 | **Evento a subproceso intermedio sin justificar omisión previa** | DEBE bloquearse si los previos tienen efectos obligatorios no omitibles; DEBE advertirse si son opcionales y la omisión está declarada. | Conectar al primer subproceso o declarar omisión válida de previos. | IMPEDIR/ADVERTIR `[COND]` |
| AP-28 | **`c` y `e` simultáneamente sobre el mismo enlace** | DEBE clasificarse No canonizado: NO DEBE emitirse como OPL-ES nuclear; PUEDE persistir solo como extensión declarada o estado de edición. | Modelar control externo explícito. | DATOS: control excluyente, así no puede construirse `[NÚCLEO]` |
| AP-29 | **Enlaces heredados dibujados como explícitos** | DEBE bloquearse salvo vista derivada no nuclear. | Inferirlos por herencia desde generalización-especialización. | IMPEDIR `[COND: herencia]` |
| AP-30 | **Resultado+resultado o consumo+consumo sobre el mismo objeto al recomponer** | DEBE bloquearse. | Corregir el nivel hijo antes de recomponer. | IMPEDIR `[COND: recomposición]` |

### 11.2 Zonas no canonizadas

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-ZNC-1 | DEBE | Una construcción que no aparece explícitamente prohibida ni canonizada DEBE clasificarse como no canonizada. | PARSE-OPL (`non-canonical`) / DATOS. |
| R-ZNC-2 | NO DEBE | La herramienta NO DEBE inventar regla OPM nuclear para una zona no canonizada. | Disciplina de implementación. |

| Zona | Estado |
|---|---|
| Combinación `c + e` sobre el mismo enlace | No definida. Tratar como NO canonizada (AP-28). |
| Enlace probabilístico sin fan | `Pr=p` se define solo dentro de abanicos; fuera no tiene canonicidad. |

Consecuencia: `Pr` es atributo de un enlace que pertenece a un abanico XOR declarado probabilístico. `Pr` sin abanico se reporta como `non-canonical`.

---

## §12 Aplicación a `deep-opm-pro`

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-APP-0 | DEBE | El canon DEBE contener reglas estables, no inventarios fechados de implementación. | N/A (documental). |
| R-APP-1 | DEBE | El estado vivo de implementación DEBE documentarse fuera del canon: `docs/HANDOFF.md`, `docs/roadmap/` o ledger de bugs. | N/A (repo) `[SOBRE]`. Choca con el AGENTS.md del repo, que exige un único `HANDOFF.md` raíz. |
| R-APP-2 | DEBE | El estado de implementación de cada regla DEBE clasificarse como `enforzado`, `parcial`, `no implementado` o `zona laxa pendiente`. | Registro de conformidad (fuera del canon), requerido por R-CONF-7. |
| R-APP-3 | NO DEBE | Una regla parcialmente enforzada NO DEBE considerarse cerrada hasta cubrir UI, kernel, importación, generación OPL y exportación aplicables. | Criterio de "hecho": cada regla implementada se cubre en las 5 superficies. |
| R-APP-4 | DEBE | Si la UI permite una construcción no canónica, la herramienta DEBE restringir por defecto, bloquear persistencia canónica o persistirla solo como error estructural recuperable. | IMPEDIR `[NÚCLEO]`. |
| R-APP-5 | DEBE / NO DEBE | Cuando la SSOT calle, la UI DEBE clasificar la construcción como `No canonizado` o `extensión declarada`; NO DEBE presentarla como prohibición ontológica ni como OPM nuclear. | Diagnósticos `[NÚCLEO]`. |
| R-APP-6 | DEBE | Todo commit que modifique validación de canonicidad DEBE citar las reglas `R-*` afectadas y, si deriva de SSOT, la regla primaria. | N/A (proceso git) `[SOBRE]`. |
| R-APP-7 | DEBE | Toda divergencia OPCloud → SSOT DEBE resolverse a favor de la SSOT salvo justificación registrada en `docs/auditorias/`. | N/A `[SOBRE]`. |

---

## Anexo A: checklist de cierre OPD↔OPL (copia textual)

- **R-ANEXO-CHECK-1** (DEBE): la lista DEBE usarse para revisar cambios de modelado, parser, generador OPL, import/export o render canónico. Consecuencia: suite de tests o gates `[NÚCLEO]`.

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

Notas:
- "Firma" deja un invariante mínimo de tipos: procedural ⇒ objeto↔proceso (salvo invocación y excepción, proceso→proceso); structural ⇒ no conecta estados (salvo las variantes SSE con estado en §4, fuera del tramo); invocación ⇒ no toca objetos.
- "Estado" prohíbe el doble default y la serialización de `Current` runtime.
- "Modificadores" se redacta sin la distinción de R-ESCIND-0 (GAP-1).
- "Refinamiento" incluye "replica layout" como falla: el OPD hijo no debe clonar el layout del padre sin agregar detalle. Es chequeable solo de forma heurística (MÉTODO).

---

## Anexo B: desarrollo prescriptivo de cobertura visual

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-ANEXO-VIS-1 | inferido DEBE | Las filas del anexo SON reglas locales, no notas. | Aplica a todo el anexo. |
| R-ANEXO-VIS-2 | DEBE | Una fila que cite `V-*` conserva la fuerza normativa de la capa visual base. | N/A (externa). La fuerza se lee del verbo local. |
| R-ANEXO-VIS-3 | DEBE | Si la `V-*` también está en el cuerpo, el anexo es precisión, no reemplazo. | Lectura. |
| R-ANEXO-VIS-4 | DEBE | Una fila que agrupa varias `V-*` se descompone en cláusulas testeables separadas. | Tests. |

| ID | Obligación | Enunciado (textual, resumido solo en redacción) | Consecuencia | Alcance |
|---|---|---|---|---|
| R-VIS-EXP-1 | DEBE | La gramática visual conforme se define por lo que persiste en un export canónico declarado; lo visible solo en canvas editable es UI o vista. | RENDER/EXPORT | NÚCLEO |
| R-VIS-EXP-2 | DEBE | Toda herramienta conforme DEBE declarar al menos los perfiles `canon-diagrama` y `canon-documento`. | EXPORT: 2 perfiles mínimos (p. ej. SVG limpio + documento OPL) | NÚCLEO |
| R-VIS-EXP-3 | DEBE | Todo elemento persistente en `canon-diagrama` DEBE estar cubierto por una regla visual. | RENDER: sin decoraciones inventadas en el export | NÚCLEO |
| R-VIS-EXP-4 | DEBE / NO DEBE | Lo que desaparece de ambos perfiles es UI transitoria y NO DEBE reutilizar canales semánticos. | RENDER | NÚCLEO |
| R-VIS-EXP-5 | DEBE | Un elemento persistente solo en un perfil DEBE declararse atributo de perfil. | EXPORT | COND |
| R-VIS-EXP-6 | NO DEBE | Una captura de edición, navegación, modal o simulación pausada NO DEBE aceptarse como evidencia de canonicidad. | MÉTODO de verificación | N/A |
| R-VIS-CAPA-1 | DEBE | La capa visual DEBE fijar símbolos, contornos, decoraciones, marcas, composición, precedencia, distribución, comportamiento entre OPDs, export, extensiones y composición inter-modelo. | N/A (documental) | — |
| R-VIS-CAPA-2 | NO DEBE | La capa visual NO DEBE redefinir semántica, OPL ni método. | Arquitectura: el render consume el modelo | NÚCLEO |
| R-VIS-CAPA-3 | DEBE | La numeración `V-*` es estable por familia, no orden lineal. | N/A | — |
| R-VIS-CAPA-4 | DEBEN | `contorno`, `borde` y `línea` son traza perimetral; solo las variantes explícitas (discontinuo, doble, grueso, zigzag) agregan semántica. | RENDER | NÚCLEO |
| R-VIS-PRIM-1 | DEBE | El vocabulario visual nuclear DEBE limitarse a formas cerradas, contornos, sombreados, decoraciones de extremo y marcas textuales definidas. | RENDER | NÚCLEO |
| R-VIS-TRI-1 | DEBE | Todo triángulo estructural DEBE conectar por línea visible con el refinable (vértice) y con al menos un refinador (base). | RENDER | NÚCLEO |
| R-VIS-TRI-2 | DEBE | Un triángulo auxiliar de edición no persistente DEBE distinguirse por tamaño, color UI reservado o ubicación. | RENDER | COND |
| R-VIS-AUX-1 | inferido | El supresor `...` solo es gramática auxiliar si persiste en `canon-diagrama`. | RENDER | COND/SOBRE |
| R-VIS-AUX-2 | DEBE | Un indicador compactado hacia cosa ausente DEBE anclarse a la cosa visible. | RENDER | COND/SOBRE |
| R-VIS-CONSTRUCT-1 | DEBE | Un OPD se compone de constructos; el constructo básico = dos cosas + un enlace; el enlace = origen, destino y conector con línea, símbolo, etiqueta opcional y ruta opcional. | DATOS | NÚCLEO |
| R-VIS-EST-1 | DEBE | Los estados cumplen R-EST-1; toda apariencia flotante DEBE bloquearse. | IMPEDIR | NÚCLEO |
| R-VIS-EST-2 | DEBEN | Los valores de atributo DEBEN renderizarse como estados del objeto-atributo (discretos, rangos, valores de instancia). | DATOS/RENDER | NÚCLEO (discretos); COND (rangos) |
| R-VIS-FAN-1 | DEBEN | Varios enlaces del mismo tipo sin arco se interpretan como AND. | DATOS/PARSE | NÚCLEO |
| R-VIS-RUTA-1 | DEBE | Con etiquetas de ruta, consumo y resultado se emparejan por coincidencia exacta de etiqueta. | DATOS | COND |
| R-VIS-MULT-1 | DEBE | La multiplicidad se coloca junto al extremo del enlace o cerca del refinador estructural. | RENDER | NÚCLEO |
| R-VIS-HER-1 | DEBEN | Herencia múltiple, atributo discriminante y herencia por despliegue se aplican aunque los heredados no se dibujen. | DATOS (inferencia) | COND/SOBRE |
| R-VIS-HER-2 | DEBE / PUEDE / DEBEN | La afiliación se hereda por cadena estructural; una especialización PUEDE sobrescribir un participante heredado; los enlaces comunes DEBEN migrar al general al crearlo desde especializaciones. | OPERACIÓN | COND/SOBRE |
| R-VIS-REF-1 | DEBE | La descomposición DEBE inflar la elipse; la invocación implícita vertical (R-INV-2/2A) aplica solo a esa descomposición; la descomposición de objeto codifica disposición, no tiempo. | RENDER/OPERACIÓN | NÚCLEO |
| R-VIS-CTRL-1 | DEBE | Si una condición omite un subproceso, el control pasa al siguiente subproceso secuencial aplicable. | N/A (ejecución) | SOBRE |
| R-VIS-DUR-1 | DEBEN | Las duraciones se muestran dentro de la elipse, bajo el nombre, con formato `{min, esperada, max}`. | RENDER | COND |
| R-VIS-DUR-2 | DEBE / NO DEBE | La distribución de duración se emite solo si está declarada; sin ella, NO se genera placeholder. | EXPORT | COND |
| R-VIS-SD-1 | DEBE / PUEDEN | El SD DEBE contener exactamente un proceso sistémico; los ambientales PUEDEN aparecer. | ADVERTIR/IMPEDIR en cierre | NÚCLEO |
| R-VIS-NOM-1 | DEBE | Toda apariencia se renderiza sin ambigüedad respecto de su cosa; la unicidad nominal se evalúa a nivel de modelo. | DATOS | NÚCLEO |
| R-VIS-REDIR-1 | DEBE | Las citas legacy a `V-48` se redirigen a `V-4`. | N/A | — |
| R-VIS-CONS-1 | DEBE | En ejecución/animación, el consumido desaparece al inicio del proceso. | N/A (simulación) | SOBRE |
| R-VIS-APP-1 | PUEDE / NO DEBE | Un elemento PUEDE aparecer en cualquier número de OPDs; eliminar una apariencia NO DEBE eliminar la cosa. | DATOS/OPERACIÓN (separar "quitar de este OPD" de "eliminar del modelo") | NÚCLEO |
| R-VIS-ASYNC-1 | DEBEN | Subprocesos activados por eventos desde estados distintos se ejecutan de forma asíncrona. | N/A (ejecución) | SOBRE |
| R-VIS-INZOOM-1 | DEBE | La descomposición = `Mostrar Contenido` y luego `Refinar Enlaces`; la recomposición = fases inversas. | OPERACIÓN | NÚCLEO |
| R-VIS-MODELO-1 | DEBE | Un modelo contiene `1..*` OPDs, `1..*` párrafos OPL y `0..*` referencias a sub-modelos; la clausura OPD↔OPL es local a cada modelo. | DATOS | NÚCLEO (sin sub-modelos) |
| R-VIS-SUPR-1 | inferido DEBE | La supresión de estados aplica solo a descomposición; "estados no referenciados NO se suprimen"; varios OPDs hijo combinan supresiones por unión. | RENDER/GEN-OPL | COND (ver GAP-4: redacción probablemente invertida) |
| R-VIS-HIJO-1 | DEBEN / NO DEBEN | En un OPD hijo: los estructurales al contenedor se ven; los procedimentales al contenedor NO se ven directamente; los enlaces entre internos se ven; los enlaces que no tocan contenedor ni internos se ocultan. | RENDER | NÚCLEO |
| R-VIS-DIST-1 | inferido PUEDE | Sin subprocesos, un enlace puede mostrarse al contenedor solo como respaldo temporal; distribución y frontera aplican solo a descomposición, no a despliegue. | RENDER/OPERACIÓN | NÚCLEO |
| R-VIS-SEMI-1 | DEBE | El semi-plegado es por refinador, su indicador cuenta los refinadores ocultos y su estado es local por apariencia/OPD. | RENDER | SOBRE |
| R-VIS-SOMB-1 | DEBE / NO DEBEN | Un contenedor refinado de cosa física preserva la fisicidad; los reforzadores de canvas NO persisten en `canon-diagrama`. | RENDER | NÚCLEO |
| R-VIS-LEX-1 | DEBE / NO DEBE | El nombre de proceso hereda la política léxica textual; la capa visual NO introduce política paralela. | Arquitectura (una sola validación de nombres) | NÚCLEO |
| R-VIS-RUN-1 | DEBE | El proceso activo usa una marca reservada distinta del contorno grueso de refinamiento. | N/A (simulación) | SOBRE |
| R-VIS-RUN-2 | inferido / DEBE | Glifo de estado actual runtime: pin/gota externa; una alternativa DEBE separarse de inicial/final/default/`Current`. | N/A | SOBRE |
| R-VIS-RUN-3A | DEBEN | Los tokens runtime se omiten del `canon-diagrama` salvo snapshot declarado. | N/A | SOBRE |
| R-VIS-RUN-3B | DEBEN | Los estados operacionales no activos usan marcas reservadas distintas. | N/A | SOBRE |
| R-VIS-RUN-3C | NO DEBE | Un estado suspendido NO debe parecer inactivo en snapshot. | N/A | SOBRE |
| R-VIS-RUN-3E | NO DEBE | El modo headless NO altera la gramática estática. | N/A | SOBRE |
| R-VIS-STEREO-1 | DEBE / PUEDE / NO DEBE | Un estereotipo declara aplicabilidad; en canvas se ve `<<Nombre>>`; en OPL PUEDE usar `«Nombre»`; su condición no se oculta en el artefacto canónico. | RENDER/GEN-OPL | SOBRE |
| R-VIS-STEREO-2 | DEBE / NO DEBE | Propiedades forzadas por estereotipo recuperables; removerlo no deja residuos; estructura derivada trazable; export identifica la cosa estereotipada; sombra forzada = fisicidad efectiva. | DATOS | SOBRE |
| R-VIS-REQ-1 | DEBEN / NO DEBE | Entidades derivadas con patrón `<Rol> of <HostThing>` y ciclo de vida dependiente del host; `<<Requirement>>` como objeto estereotipado con `Name`, `ID`, `Requirement Essence`, `Satisfaction`, `Description`; `Requirement Essence` ≠ esencia física/informacional. | DATOS | SOBRE |
| R-VIS-COMP-1 | DEBEN / PUEDE | Alias `{alias}` únicos y distintos de alias decorativos; unidad `[u]` después del nombre; `[]` vacío solo si se confirmó. | DATOS/RENDER | SOBRE |
| R-VIS-COMP-2 | PUEDE / NO DEBE | Slot de valor (placeholder, escalar, cadena, disyunción, intervalo, multilínea); no más de un slot primario por objeto. | DATOS | SOBRE |
| R-VIS-COMP-3 | PUEDEN / DEBEN | Aliases, slots, entradas tipadas y nombres reservados como metadato; código fuera del canvas; integraciones por estereotipo/distintivo/metadato. | DATOS | SOBRE |
| R-VIS-SUB-1 | DEBE | Modelo compuesto = DAG de modelos; cada sub-modelo con OPL autocontenida; referencia simétrica padre/hijo. | DATOS | SOBRE |
| R-VIS-SUB-2 | DEBE / PUEDE | La vista de sub-modelo es vista anclada, se diferencia en metadato y PUEDE ser de solo lectura. | DATOS | SOBRE |
| R-VIS-SUB-3 | DEBEN / PUEDE | Atenuación cross-model es gramática de vista; una vista de sub-modelo PUEDE violar el proceso sistémico único si declara criterio; el export compuesto declara sub-modelos no cargados, resolución y desconexión. | EXPORT | SOBRE |
| R-VIS-LAYOUT-1 | DEBE | El snap a grid es transparente al modelo; el export autoajusta el viewport sin huérfanos ni recortes. | RENDER/EXPORT | NÚCLEO |
| R-VIS-MODO-1 | DEBE | El canvas distingue los modos estático-exportable, edición, navegación y gestión-modal; solo el estático fundamenta conformidad; búsqueda y tutorial usan canal reservado y se desactivan para canon. | RENDER | NÚCLEO (edición vs export); resto COND |
| R-VIS-AUTOR-1 | PUEDE / DEBEN | El estilado autoral solo si no colisiona con gramática, simulación, validación ni UI; los defaults convergen al esquema canónico; igual clase = igual base visual; rótulo legible con contraste. | RENDER | COND (lo más simple es no tener estilado autoral) |
| R-VIS-AUTOR-2 | DEBEN / NO DEBE | Tamaño y proporción preservan legibilidad, contención y decoraciones; la normalización léxica no es silenciosa; el export canónico normaliza el estilado autoral salvo perfil contrario. | RENDER/EXPORT | NÚCLEO (tamaño) |
| R-VIS-VAL-1 | DEBE / NO | Por defecto el OPD estático queda limpio de validación persistente; los marcadores de edición inválida no son canon; la unicidad nominal se resuelve explícitamente; metodología y sugerencias son vistas derivadas. | RENDER/EXPORT | NÚCLEO |
| R-VIS-EXPORT-1A | DEBE | Todo perfil de export declara un default; `canon-diagrama` preserva la gramática visible sin chrome. | EXPORT | NÚCLEO |
| R-VIS-EXPORT-1B | DEBEN | Listados textuales cromáticos y export parcial se declaran como perfil o modo, no como evidencia de canonicidad. | EXPORT | COND |
| R-VIS-EXPORT-1C | DEBEN / NO DEBEN | Anexos y rasterización conservan trazabilidad y no reemplazan el perfil canónico. | EXPORT | COND |
| R-VIS-EXPORT-1D | DEBE | El viewport exportado evita recortar símbolos, rótulos y decoraciones. | EXPORT | NÚCLEO |
| R-VIS-EXPORT-1E | DEBEN / NO DEBEN | Los overlays de export se declaran y no ocluyen semántica. | EXPORT | COND |
| R-VIS-FAM-1 | DEBE | Toda categoría adicional de enlace se declara como extensión; `sub-model` es el cuarto par de refinamiento; Bring y equivalentes son operadores derivados. | DATOS | NÚCLEO (lo primero); SOBRE (sub-model) |
| R-VIS-XMODEL-1 | DEBE | Toda cosa referenciable cross-model expone URI/handle persistente; las marcas cross-model son vista; el ciclo de carga es propiedad de la referencia. | DATOS | SOBRE |
| R-VIS-BRING-1A | DEBE | Una operación auxiliar inter-OPD materializa apariencias o enlaces existentes sin crear semántica nueva. | OPERACIÓN | COND |
| R-VIS-BRING-1B | DEBE | `Bring connected things` filtra por familia y conectividad declaradas. | OPERACIÓN | COND |
| R-VIS-BRING-1C | DEBE | El resultado de Bring es indistinguible de un OPD manual equivalente. | DATOS | COND |
| R-VIS-BRING-1D | DEBE | `Bring links between selected things` materializa solo enlaces existentes entre las cosas seleccionadas. | OPERACIÓN | COND |
| R-VIS-BRING-1E | PUEDEN | Los supresores `...` quedan solo si el perfil los declara. | RENDER | SOBRE |
| R-VIS-BRING-1F | DEBEN | Los OPDs derivados por Bring se clasifican como vista anclada o ad hoc. | DATOS | COND |
| R-VIS-BRING-1G | DEBE | Toda operación Bring es reversible o acotada por alcance declarado. | OPERACIÓN (undo) | COND |

---

## Anexo C: extensión categorial de opforja

| ID | Obligación | Enunciado | Consecuencia |
|---|---|---|---|
| R-ANEXO-CAT-0 | NUNCA / DEBE | Capa OPFORJA de extensiones formales (eje horizontal: composición, equivalencia, linealidad); NO modifica la base. La lectura categorial "NUNCA se expone al modelador". Cada regla DEBE ser ejecutable por una ley o checker verificable, identificado en el registro de conformidad. | `[SOBRE]`. Si se implementa, no aparece en la UI. |
| R-CAT-LIN-1 | PUEDE / NO DEBE | Un objeto PUEDE designarse `lineal` (recurso que se consume y no se duplica). No es designación ISO y NO DEBE alterar la gramática visual ni OPL base. | DATOS `[SOBRE]`. |
| R-CAT-LIN-2 | DEBE | Un objeto `lineal` consumido por ≥2 procesos sin ruta exclusiva (XOR) DEBE señalarse como conflicto de linealidad. Severidad: mejora metodológica (no bloqueo). DEBE existir una ley verificable. | ADVERTIR `[SOBRE]`. |
| R-CAT-EQ-1 | inferido | Dos realizaciones con la misma firma de frontera (roles netos `entidad\|tipoEnlace\|rol`) son equivalentes solo respecto de esos observables; es condición necesaria, no prueba de identidad. | N/A `[SOBRE]`. |
| R-CAT-EQ-2 | PUEDE / DEBE | opforja PUEDE verificar la igualdad de firma entre realizaciones hermanas; si coincide, el resultado DEBE rotular su alcance. Severidad: mejora metodológica. | ADVERTIR `[SOBRE]`. |
| R-CAT-EQ-3 | DEBE | Toda descomposición DEBE preservar la firma de frontera de su proceso abstracto; checker navegable pasivo. Severidad: mejora metodológica. | ADVERTIR `[COND]`: coincide en espíritu con R-ROL-*, R-DIST-*. |
| R-CAT-COMP-1 | PUEDEN | Dos modelos PUEDEN componerse identificando entidades de interfaz compartida (por defecto, nombre normalizado + mismo tipo; id solo si el nombre coincide). | OPERACIÓN `[SOBRE]`. |
| R-CAT-COMP-2 | NO DEBE / DEBE / DEBEN | La composición NO duplica la entidad compartida ni deja referencias colgantes, es asociativa módulo namespacing y no introduce avisos nuevos; DEBEN existir 4 leyes verificables (no-duplicación, sin referencias colgantes, asociatividad, buen tipado). | OPERACIÓN + tests `[SOBRE]`. |
| R-CAT-COMP-3 | inferido DEBE / NO | La composición es no bloqueante y reversible (undo); un conflicto de linealidad resultante DEBE advertirse, NO impedir. | `[SOBRE]`. |

Cierre (l. 1523): "Fin del documento. Mantener sincronizado con la SSOT KORA `v3.0.0` y siguientes." Es circunstancial y contradice el frontmatter (GAP-30).

---

## (a) Exigencias sobreingenieriles o circunstanciales para una herramienta simple

1. **Anexo C completo** (linealidad, firma de frontera, composición por pushout/cospan, 4 leyes verificables). El propio canon dice que "NUNCA se expone al modelador" y que su severidad es "mejora metodológica". Para una herramienta simple basta declararlo diferido en el registro de conformidad (R-CONF-7).
2. **Bocetos y regímenes documentales** (R-CAN-BOCETO-1..4: Modelo/Apunte, Taller, Graduar, Reabrir, Integrar como…, Devolver a Bocetos, Biblioteca). Es una "extensión local de herramienta" de gestión documental, no OPM. Además fija `padreId = null`, un nombre de campo de implementación.
3. **Composición inter-modelo y sub-modelos**: §8.1 fila 4, R-OPL-TOTAL-3, R-VIS-MODELO-1 (0..* referencias), R-VIS-SUB-1..3, R-VIS-XMODEL-1, R-VIS-FAM-1 (sub-model como "cuarto par canónico"), AP-18.
4. **Simulación/runtime**: R-ECA-1..3 como semántica de ejecución, R-PROB-1A, 1/n de simulación (§6.8, §7.5), R-BR-3, R-VIS-CONS-1, R-VIS-ASYNC-1, R-VIS-CTRL-1, R-VIS-RUN-1/2/3A/3B/3C/3E (pin, halo, headless, suspendido), `Current` runtime.
5. **Estereotipos y requisitos**: R-VIS-STEREO-1/2 y R-VIS-REQ-1, con el patrón en inglés `<Rol> of <HostThing>` y atributos `Name`, `ID`, `Requirement Essence`...
6. **Capa computacional**: R-BR-5, R-VIS-COMP-1..3 (alias `{alias}`, unidades `[u]`, slots, entradas tipadas, código).
7. **Vistas y Bring**: R-VIEW-1..4, mapa del sistema, R-BRING-1, R-EDIT-5, R-VIS-BRING-1A..1G, supresores `...` (R-VIS-AUX-1/2, R-VIS-BRING-1E), R-ARB-2 (árbol de objetos).
8. **Semi-plegado** (R-BR-1, R-VIS-SEMI-1).
9. **Recomposición automática con fuerza de 12 niveles y matriz de precedencia** (§6.5, §6.6, R-PREC-*, AP-30, R-SIMP-2). Solo es exigible si se ofrece out-zoom automático. La versión simple elimina el refinamiento con confirmación.
10. **Herencia inferida** (R-VIS-HER-1/2, AP-29) y migración automática de enlaces comunes al general.
11. **Duraciones/excepción temporal** (R-VIS-DUR-1/2, EX1/EX2 en la tabla 9.2) y **m-de-f** (R-FAN-M-1..4). Esto último es PUEDE.
12. **Probabilidades** (R-PROB-*, R-FAN-PROB-1 con tres estados, `Pr=p`). Solo aplica si se ofrece `Pr`.
13. **Estilado autoral y perfiles de export múltiples** (R-VIS-AUTOR-1/2, R-VIS-EXPORT-1B/1C/1E, R-VIS-EXP-5, overlays, anexos, rasterización).
14. **Gobernanza del repo** (R-APP-0..7): `docs/HANDOFF.md`, `docs/roadmap/`, `docs/auditorias/`, commits que citan `R-*`, taxonomía `enforzado/parcial/no implementado/zona laxa pendiente`, divergencias con OPCloud y el nombre `deep-opm-pro` en R-ESC-1A y en el título de §12. Son circunstanciales.
15. **Meta-reglas documentales**: R-AP-0A, R-ANEXO-VIS-1..4, R-VIS-CAPA-1/3, R-VIS-REDIR-1 (citas legacy a `V-48`), R-IMP-1/2 (importancia proporcional, sin efecto operativo), R-VIS-EXP-6 (evidencia de tests).
16. **Cierre "Mantener sincronizado con la SSOT KORA v3.0.0"**: circunstancial.

Válvula legítima de simplicidad dentro del propio canon: R-CONF-7 (l. 133) permite **programar** una regla DEBE "sin tráfico operativo" para un corte futuro si se declara en el registro de conformidad de la herramienta. Lo prohibido es la brecha silenciosa. R-IMPORT-5 obliga a responder `unsupported-canonical` a las familias no soportadas. El Anexo A, gate "Deuda", exige registrar toda zona no canonizada.

## (b) GAPs y contradicciones internas

- **GAP-1 (contradicción)**: la fila de §6.4 "Modificador sobre enlace escindido (TS4/TS5) → PROHIBIDO" y el gate "Modificadores" del Anexo A ("TS4/TS5 reciben `c/e`" = falla) no distinguen el fragmento escindido del efecto parcial standalone. R-ESCIND-0 y AP-08 limitan la prohibición al fragmento y permiten ETS3/ETS4 standalone. Manda la regla específica (R-ESCIND-0).
- **GAP-2 (bisimetría)**: según R-ESCIND-0, el fragmento escindido "NUNCA se origina por parseo de OPL aislado" y comparte superficie con el TS4/TS5 standalone. El OPL no codifica la procedencia, así que un roundtrip OPD→OPL→OPD pierde el acoplamiento y la prohibición de `c/e` (tensión con R-BI-TAB-1, R-BI-DUAL-1 y R-BI-4). Solución implícita: metadato tipificado (R-ESC-OP-2) conservado en el reparse (R-IMPORT-8).
- **GAP-3 (plantilla divergente)**: EX1 en la tabla 9.2 dice "…excede máx-duración." mientras §4 (l. 582) y spec-forja-opl (l. 851) dicen "…excede máx-duración unidades-tiempo.". El desempate de la l. 41 no resuelve entre dos tablas del mismo documento. Se recomienda la forma con "unidades-tiempo" (coinciden 2 de 3).
- **GAP-4 (probable errata)**: R-VIS-SUPR-1 dice "estados no referenciados NO se suprimen". La metodología (A3.6: "Suprimir en SD los estados **no** conectados"; LF-03: "NO suprimir un estado conectado a un proceso") indica lo contrario: son los referenciados los que no se suprimen. Además, "aplica solo a descomposición" choca con la supresión como "política de vista por OPD" (spec-forja-opd R-OPD-EST-8, metodología LF-03).
- **GAP-5**: la matriz §6.6 da Resultado+Consumo → Efecto de forma incondicional, pero R-PREC-2/3/4 lo condicionan a una "continuidad de identidad y estados trazables" que no se define mecánicamente. El criterio de evidencia queda abierto.
- **GAP-6 (ambigüedad)**: R-FAN-GEO-1 ubica el arco "en el extremo convergente", pero R-FAN-GEO-2 y §7.2 clasifican abanicos convergentes y divergentes. En un abanico divergente (1 objeto → N procesos) no se define cuál es el "extremo convergente". Se interpreta como el extremo común (la cosa compartida).
- **GAP-7**: §7.4 solo ejemplifica evento/condición + XOR/OR para efecto. No hay plantillas de modificador × familia × dirección, ni para "exactamente/al menos m de f" (R-FAN-M-*; spec-forja-opl R-FAN-8 reconoce GAP-FAN-M).
- **GAP-8 (tensión)**: §7.5 afirma "La probabilidad por estado, sin especificar, es 1/n", como hecho de modelo, mientras §6.8 y R-FAN-PROB-1(B) dicen que 1/n es solo regla de simulación y que un abanico ordinario no tiene pesos.
- **GAP-9**: R-FAN-PROB-1(C) exige declarar «probabilístico sin pesos», pero no da plantilla OPL ni marca visual. Ese estado no es bisimétrico según el propio canon.
- **GAP-10**: R-CAN-BOCETO-* usa términos (régimen Modelo/Apunte, Taller, Graduar, Reabrir en Taller, Biblioteca, Integrar como…) que no se definen en este documento, pese a su autocontención declarada (l. 25). Están definidos en metodologia-forja §A1.5 (l. 95–141). El campo `padreId` es detalle de implementación (tensión con R-APP-0 y con el mapa de familia).
- **GAP-11**: R-OPL-TOTAL-1 concatena "en orden de navegación del árbol OPD", pero un Boceto (R-CAN-BOCETO-1) no pertenece al árbol. No se define su posición en el OPL completo ni su etiqueta de navegación (R-ARB-3, R-IDP-1).
- **GAP-12 (tensión)**: R-VIS-REF-1 y R-INV-2 hacen de la posición vertical el disparador de la invocación implícita, mientras R-IDP-0A y R-INV-2D declaran que la fuente es el orden declarado y la coordenada solo lo realiza. Implicación: el modelo guarda el orden (bandas), el render deriva la y y el layout no puede reordenar (R-LAY-4).
- **GAP-13**: R-SD-4 y R-VIS-SD-1 ("exactamente un proceso sistémico") no dicen si aplican en edición o solo en cierre; el arranque bottom-up (Bocetos, sin SD) sugiere solo en cierre. R-VIS-SUB-3 lo relaja para vistas de sub-modelo.
- **GAP-14**: AP-05 exige bloquear un agente conectado a robot/software/IA/máquina, pero el modelo no tiene un rasgo "humano/no humano". Sin una clasificación declarada no es mecánicamente bloqueable, así que queda en advertencia o método.
- **GAP-15 (incumplimiento de R-AP-0A/0C)**: AP-12, AP-14, AP-22, AP-25, AP-26 y AP-29 no citan una regla primaria explícita. AP-14 ordena "DEBE bloquearse" por "sinónimo falso", algo no detectable y que no es contradicción ni error de categoría (R-AP-0C). AP-22 y AP-25 solo "reportan".
- **GAP-16**: R-REF-NTRIV-3 y AP-13 admiten un "placeholder de edición tipificado" sin definir su tipo o marca.
- **GAP-17**: §8.5, "Evento ambiental permitido cruzar frontera con modelado de contingencia": "modelado de contingencia" no está definido.
- **GAP-18**: R-MULT-2 exige unicidad de "parámetros de multiplicidad", pero el tramo no define su sintaxis (variables en rangos).
- **GAP-19**: la tabla 9.2, "gate mínimo", omite construcciones canónicas: elipse punteada (proceso ambiental), D2/D4/D11, TS1/TS2/TS4/TS5, HS*, ET2/EH*, CT2/CH*/CS*, IV2, EX2, SE*/SSE*. "Rectángulo punteado" solo cubre al objeto ambiental. El gate completo exige §4 (fuera del tramo).
- **GAP-20**: la fila "Rectángulo sin sombra (default)" no emite oración "salvo si se quiere explicitar". No hay regla que decida cuándo explicitar D2 "es informacional", y el parser debe aceptar ambas formas.
- **GAP-21**: R-BR-2 pide persistir una "semántica de control tipificada" para eventos OR y condiciones AND sin definir el tipo.
- **GAP-22**: R-ROL-1 depende del "cambio neto cero", que es calculable solo si los estados de entrada y salida están modelados en ambos niveles. No se define el comportamiento sin estados.
- **GAP-23**: el Anexo A, gate "Firma", dice "un structural conecta estado" = falla, pero existen las variantes estructurales con estado SSE1–SSE7 (§4, l. 628–630) y AP-09 las menciona. El gate es más estricto que el canon.
- **GAP-24**: el Anexo A, gate "Refinamiento", declara falla si el hijo "replica layout", criterio no definido operativamente.
- **GAP-25**: R-IMPORT-1 manda parsear contra "`SSOT-opl Apéndice A`", fuente excluida por el mandato ("solo los 4 documentos"). La gramática operativa aplicable es la de `spec-forja-opl-es`.
- **GAP-26**: R-APP-1 fija `docs/HANDOFF.md`, que choca con el AGENTS.md del repo (único `HANDOFF.md` raíz).
- **GAP-27**: R-CONF-7 y el Anexo C remiten los gates a un "registro de conformidad de la herramienta" cuyo formato no se define en el canon.
- **GAP-28**: R-VIS-EST-2 exige renderizar como estados los valores de atributo "rangos o valores concretos de instancia", sin geometría definida en el tramo para rangos.
- **GAP-29**: R-HIJO-2 dice "cuando la regla de copia correspondiente lo exija", y solo R-HIJO-3/4 la concretan. Invocaciones y excepciones del padre no se tratan explícitamente en la tabla §8.5.
- **GAP-30 (contradicción de procedencia)**: el cierre (l. 1523) pide sincronizar con "la SSOT KORA `v3.0.0`", mientras el frontmatter (l. 7) dice que la bestia KORA "ya no [es] SSOT viva" y que pneuma toma la posta.

## Síntesis: núcleo mínimo de este tramo para la herramienta rehecha

1. **Kernel único** (R-BI-0/0A/0B/1, R-CONSIST-1). El OPL se deriva del modelo y el OPL editado se parsea al mismo modelo, con ids persistentes para cosas, estados, enlaces y OPDs (R-IDP-*, Anexo A "Identidad"). Apariencia ≠ cosa (R-VIS-APP-1). Esencia, perseverancia y nombre viven en la cosa (R-REF-4).
2. **Control `ninguno|e|c` excluyente** sobre transformador/habilitador, solo del lado de entrada (§6.1–6.4). Así AP-28 queda imposible por construcción. Bloqueo de AP-01..04, 08..12, 15, 16, 21. Un solo enlace procedimental por par objeto-proceso (R-ROL-UNIC-1).
3. **Abanicos**: AND implícito; XOR/OR como entidad explícita con arco simple o doble en el extremo común; plantillas de §7.3/§7.4; `Pr` y m-de-f diferidos.
4. **Descomposición** atómica (R-OPD-OP-1/3/4, R-VIS-INZOOM-1): contenedor inflado, externos copiados, consumo→primer subproceso, resultado→último, efecto/agente/instrumento→todos, TS3→TS4/TS5 con procedencia, orden declarado en bandas → "en esa secuencia", ≥2 hijos en cierre, sin ciclos, externos no refinables, borrado en cascada, eliminación solo de OPDs hoja. **Despliegue** por RF1..RF4 con hijos estructurales directos.
5. **OPL**: tabla 9.2 + §7.3/§7.4 como gate de roundtrip (R-BI-TAB-1). OPL total concatenado en orden de árbol (R-OPL-TOTAL-1/2). OPL por OPD solo con estados visibles (R-OPL-TOTAL-4/5). Parser estricto (R-BI-2, R-IMPORT-1..8) con diagnósticos literales `unsupported-canonical` / `non-canonical` y bloqueo de cambios de tipo, preservando layout.
6. **Render/export**: sombra solo física, triángulos con topología, rótulos sin truncar, canales UI separados, OPD estático sin marcas de validación. Dos perfiles declarados: `canon-diagrama` (p. ej. SVG) y `canon-documento` (p. ej. OPL) (R-VIS-EXP-1..4, R-VIS-EXPORT-1A/1D, R-VIS-LAYOUT-1).
7. **Registro de conformidad** (R-CONF-7, R-APP-2) que declara como programado todo lo marcado `[COND]`/`[SOBRE]`, para evitar la "brecha silenciosa".
