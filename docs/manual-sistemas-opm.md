# Manual de opforja para transformar sistemas

Guía transversal para llevar evidencia del dominio, ideas y necesidades hasta una
intervención verificable, su adopción, aprendizaje y retiro. Sirve para sistemas
organizacionales, operacionales, públicos, físicos, digitales o mixtos. Los
manuales de salud y software aplican este ciclo y agregan solo sus diferencias.

## 0. Contrato y ruta de lectura

### Qué enseña

Este manual enseña a usar opforja como **mesa semántica de transformación de
sistemas**. La mesa conserva la función, la frontera, los estados, las decisiones y
la trazabilidad conceptual. El trabajo real se ejecuta en los sistemas que
correspondan: una organización, una planta, un servicio, un repositorio, un
pipeline, un establecimiento o una red.

No enseña nuevamente:

- la sintaxis y semántica de OPM: están en el
  [manual de OPM puro](manual-opm-puro.md);
- el método Forja, el Taller y la interacción humano-agente: están en el
  [manual de opforja](manual-opforja.md);
- los botones, atajos y persistencia de la aplicación: están en
  [Uso productivo](uso-productivo.md).

### A quién sirve

- a una persona responsable de entender o cambiar un sistema;
- a especialistas de dominio que deben validar su significado;
- a equipos que comparan alternativas o coordinan una intervención;
- a agentes de IA que preparan, modelan, implementan o verifican trabajo;
- a quien mantiene un sistema existente y necesita decidir qué conservar,
  modernizar o retirar.

### Prerrequisitos y autoridad

Para operar la aplicación basta [Uso productivo](uso-productivo.md). Para editar
un modelo con rigor, lee primero el [manual de opforja](manual-opforja.md). Cuando
una duda sea semántica OPM, manda el
[manual de OPM puro](manual-opm-puro.md) y el corpus resuelto por
[resolutor del canon OPM](canon-opm/resolutor-urn.json).

Este manual es propietario del ciclo transversal:

`evidencia → AS-IS → necesidad → alternativas → TO-BE → intervención →`
`adopción → evidencia → aprendizaje → mantenimiento o retiro`

Los perfiles de dominio no deben volver a definir ese ciclo: lo especializan.

### Vocabulario de capacidad

Las etiquetas forman un vocabulario cerrado:

| Etiqueta | Significado |
|---|---|
| **IMPLEMENTADO** | Existe en la aplicación o su toolchain y cuenta con respaldo en código, tests o documentación operativa vigente. |
| **PROPUESTO** | Es una hipótesis de incremento acotado y preliminarmente compatible; todavía no existe ni implica factibilidad validada, prioridad o compromiso. |
| **EXTERNO** | Lo ejecuta o conserva otro sistema; opforja puede modelarlo, pero no lo realiza. |

El [handoff vigente](handoff-2026-07-12.md) fecha el estado operativo y el
[roadmap vigente](roadmap/roadmap-2026-07-12.md) fecha la dirección. Una etiqueta
**PROPUESTO** no equivale a prioridad.

### Ruteo por necesidad

| Necesidad | Sección |
|---|---|
| Tengo documentos, entrevistas o datos dispersos | §2 |
| El sistema ya existe y debo comprenderlo | §2.5 y §3.4 |
| Tengo una idea, pero no sé cuál es la necesidad | §3.5 |
| Debo comparar soluciones | §4 |
| Quiero delegar trabajo a agentes | §5 |
| Debo introducir el cambio en el mundo real | §6 |
| Necesito verificar valor, aprender o responder a un incidente | §7 |
| Debo modernizar o retirar un sistema | §8 |
| Quiero saber qué puede hacer opforja realmente | §9 |
| Necesito ver un ejemplo no software | §10 |
| Solo necesito una receta corta | §11 |

---

## 1. Dónde vive opforja en el trabajo real

### 1.1 Una mesa semántica, no el sistema ejecutor

opforja permite responder de forma compartida:

- qué sistema observamos o queremos cambiar;
- qué transformación entrega valor y a quién;
- qué objetos cambian y entre qué estados;
- quién actúa, qué instrumento usa y qué queda fuera;
- qué alternativas preservan la función;
- qué requisito cubre cada parte;
- qué evidencia permitiría aceptar o refutar el cambio.

No contrata personas, no mueve pacientes, no fabrica piezas, no ejecuta políticas,
no modifica repositorios y no despliega servicios. Modela esos procesos y conserva
el contrato que permite coordinarlos.

La distinción es productiva: una mesa semántica buena reduce ambigüedad; un sistema
ejecutor bueno cambia la realidad. Confundirlos produce diagramas que aparentan
haber realizado trabajo que nadie ejecutó.

### 1.2 Cadena de autoridad por artefacto

Cada afirmación necesita un dueño. “Todo es fuente de verdad” significa que ninguna
fuente lo es.

| Plano | Autoridad operativa | Papel de opforja |
|---|---|---|
| Evidencia | documentos, observación, entrevistas, normativa, datos y mediciones | estructura afirmaciones, procedencia, hipótesis y preguntas relevantes |
| Significado del dominio | especialista o grupo humano autorizado | vuelve explícitos términos, función, reglas, estados y frontera |
| Intención de cambio | patrocinador o responsable de la decisión | conserva necesidad, resultado, restricciones y criterios de aceptación |
| Diseño del sistema | modelo OPM, decisiones y contratos especializados | compara alternativas y describe el TO-BE elegido |
| Ejecución | herramientas, equipos y sistemas propios del dominio | realiza la intervención; opforja no los sustituye |
| Verificación | mediciones, inspecciones, pruebas, auditorías o controles externos | entrega el veredicto; el modelo declara qué debía observarse |
| Operación | responsables, registros, telemetría e incidentes | devuelve evidencia para mantener, corregir o retirar el modelo |

Cuando una evidencia contradice el modelo, no se corrige una copia casual: se vuelve
al artefacto propietario y a la persona autorizada.

### 1.3 Portafolio mínimo, no mega-modelo

Un cambio complejo suele necesitar tres modelos hermanos:

1. **Dominio y valor:** qué cambia, para quién y bajo qué reglas.
2. **Sistema de realización:** qué personas, recursos, componentes e interfaces
   producen ese cambio.
3. **Introducción y operación:** cómo el sistema pasa del AS-IS al TO-BE, cómo se
   observa y cómo se recupera.

No son niveles obligatorios de un mismo árbol. Si tienen dueños, ritmos de cambio o
criterios de suficiencia distintos, sepáralos. Conéctalos mediante objetos-frontera
con nombres y estados compartidos.

### 1.4 Cuándo vale la pena modelar

Un modelo es productivo si reduce una incertidumbre que afecta una decisión, una
coordinación o un riesgo. Debe hacer al menos una de estas cosas:

- revelar una transformación o un beneficiario omitido;
- localizar una responsabilidad, interfaz, espera o fallo;
- separar una necesidad de la solución que alguien dio por inevitable;
- permitir comparar alternativas con la misma función;
- entregar a otra persona o agente un contexto verificable;
- declarar qué evidencia cerrará o reabrirá la decisión.

Si el modelo no cambia ninguna decisión, no reduce riesgo y nadie lo consulta,
archívalo. Modelar más no es automáticamente comprender mejor.

---

## 2. Desde la base documental del dominio

### 2.1 La base documental es evidencia, no OPM crudo

La base puede incluir normas, manuales, procedimientos, entrevistas, registros,
planillas, contratos, fotografías, tickets, planos o bases de datos. No se copia
íntegra al modelo. Primero se separa:

| Clase | Pregunta | Tratamiento |
|---|---|---|
| Hecho observado | ¿Qué vimos o medimos y dónde? | conservar fuente y localizador |
| Testimonio | ¿Quién lo afirmó y desde qué rol? | no convertirlo en ley universal |
| Decisión | ¿Quién escogió entre qué alternativas? | registrar autoridad y vigencia |
| Restricción | ¿Qué solución excluye o limita? | hacerla visible antes de diseñar |
| Hipótesis | ¿Qué creemos, pero todavía puede ser falso? | marcar `[RATIFICAR]` o dejar pregunta |
| Término | ¿Qué nombre usa el dominio y qué sinónimos existen? | normalizar con su dueño |
| Pregunta | ¿Qué falta para decidir? | mantener abierta; no rellenar con imaginación |

opforja **no ingiere ni interpreta automáticamente** una carpeta documental. Esa
capacidad es **EXTERNA**. Una persona o agente puede leer las fuentes, pero el dueño
del dominio debe ratificar cualquier significado que sostenga una decisión.

Aplica minimización antes de entregar una fuente a opforja, a un agente o a otra
herramienta: referencia el original mediante un localizador con acceso controlado en
vez de copiarlo; seudonimiza identificadores; excluye contraseñas, tokens, secretos y
datos personales o sensibles que no sean necesarios. Las fuentes crudas, sus
permisos y su retención permanecen en el sistema autorizado, no en el modelo. Si una
tarea exige datos sensibles identificables, una persona responsable debe autorizar
antes el propósito, el acceso, el tratamiento y la retención.

### 2.2 Ledger mínimo de evidencia

Mantén junto a las fuentes un ledger breve:

```markdown
| ID | Fuente y localizador | Afirmación | Fuerza | Destino | Estado |
|---|---|---|---|---|---|
| OBS-01 | visita 2026-07-02, estación 3 | el registro se completa después de la entrega | observación | AS-IS | modelar |
| ENT-02 | entrevista a coordinación, min 14 | la aprobación puede delegarse | testimonio | regla | ratificar |
| DEC-03 | acta 18, acuerdo 4 | se conserva una ventanilla presencial | decisión | restricción | vigente |
```

El ledger no compite con el modelo:

- el ledger conserva procedencia y fuerza epistémica;
- el modelo conserva estructura, comportamiento y decisión;
- la evidencia de resultado conserva lo que ocurrió después.

Las anclas normativas **IMPLEMENTADAS** son para fuentes normativas. No las uses
como contenedor genérico de cualquier entrevista, página o fotografía.

### 2.3 Ficha de trabajo

Antes de cerrar un modelo, registra:

```markdown
### Ficha de trabajo
- Pregunta que habilita:
- Dueño humano de significado:
- Responsable de la decisión:
- Beneficiario:
- Sistema y frontera:
- Base documental y revisión:
- Tipo de modelo: dominio | realización | introducción-operación
- Vida útil: respuesta puntual | referencia viva
- Criterio de suficiencia:
- Criterio de muerte o revisión:
- Pendientes [RATIFICAR]:
```

**Respuesta puntual** sirve para una decisión y puede archivarse después.
**Referencia viva** sostiene una tarea recurrente y necesita dueño y criterio de
revisión. “Instrumento” no se usa aquí como tipo documental: en OPM ya significa
un objeto no humano que habilita un proceso.

La ficha cabe en la descripción del modelo, en la cabecera de un proto o en el
registro externo de la iniciativa. Su valor no depende del lugar, sino de que exista
un solo ejemplar vigente.

### 2.4 Del documento al primer fragmento

Secuencia mínima:

1. formula la decisión que el modelo debe habilitar;
2. congela solo las fuentes necesarias para esa pregunta;
3. construye el ledger y normaliza términos;
4. identifica el fragmento mejor comprendido;
5. abre un **apunte** y bosqueja ese fragmento en el Taller;
6. lee el OPL con el dueño de significado;
7. registra huecos y contradicciones sin inventar puentes;
8. reconcilia el SD y adopta los OPDs sueltos cuando su relación sea conocida;
9. gradúa solo cuando el modelo ya puede asumir rigor de referencia.

La interfaz de graduación **muestra** los problemas con severidad de modelo, pero
deja la decisión a la persona. El método, en cambio, no considera cerrado un modelo
con bloqueos semánticos o portabilidad pendiente. Interfaz permisiva y criterio de
cierre no son lo mismo.

### 2.5 Entrar por un sistema existente

Cuando el sistema existe, usa ingeniería inversa basada en modelos:

`observación → hipótesis de requisito → AS-IS → brecha → predicción → prueba`

1. fija una revisión o ventana de observación;
2. registra función, contexto, estados, interfaces, responsables, fallos y
   restricciones;
3. distingue lo observado, documentado, decidido e inferido;
4. empieza *middle-out* en el nivel mejor entendido;
5. sube al propósito o baja al detalle solo cuando la pregunta lo exige;
6. formula una predicción que pueda ser refutada;
7. pide aceptación humana del AS-IS antes de usarlo para diseñar el TO-BE.

Un sistema heredado casi nunca coincide con su procedimiento escrito. La diferencia
no es ruido: puede ser el hallazgo principal.

---

## 3. Del dominio al cambio deseado

### 3.1 La brújula de cinco preguntas

Antes de profundizar, responde:

1. **Propósito:** ¿para qué existe o cambiará el sistema?
2. **Beneficiario:** ¿quién recibe el valor o evita el daño?
3. **Función:** ¿qué transformación produce el sistema?
4. **Transformee:** ¿qué objeto cambia de estado?
5. **Frontera:** ¿qué está dentro y qué pertenece al entorno?

Si dos participantes responden distinto, todavía no hay un problema compartido.
Ese desacuerdo debe resolverse o conservarse explícito antes de delegar.

### 3.2 SD primero cuando la función está clara

Si existe acuerdo sobre propósito y frontera:

1. declara el proceso principal;
2. identifica su transformee y resultado;
3. ubica agentes humanos e instrumentos;
4. declara entradas y salidas de frontera;
5. refina solo la parte que porta la decisión.

El SD no es un índice decorativo. Es la promesa funcional que los refinamientos
deben preservar.

### 3.3 Middle-out cuando el sistema está enredado

Si el conocimiento comienza en una operación concreta, no inventes un SD perfecto.
Bosqueja el fragmento conocido y pregunta:

- ¿qué proceso mayor explica que esto exista?;
- ¿qué entrada recibe y qué salida entrega?;
- ¿qué objeto es transformado?;
- ¿qué cosa existente refina este OPD?;
- ¿es in-zoom o unfold?

Los OPDs sueltos pueden vivir en un apunte. Para que el modelo sea portable deben
adoptarse o reconciliarse con una cosa del modelo; graduar es otro eje y no corrige
por sí solo una estructura huérfana.

### 3.4 AS-IS y TO-BE no son versiones del mismo dibujo

Mantén separados:

- **AS-IS:** sistema observado, incluidas excepciones, trabajo informal y fallos;
- **TO-BE:** sistema elegido, sus supuestos y sus nuevas responsabilidades;
- **TRANSICIÓN:** procesos que cambian personas, recursos, reglas, datos y
  capacidades entre ambos.

Superponerlos borra qué existe y qué se desea. La comparación debe declarar:

| Pregunta | AS-IS | TO-BE | Transición |
|---|---|---|---|
| ¿Qué función preserva? | observada | prometida | protegida durante el cambio |
| ¿Qué estados cambian? | reales | objetivo | intermedios y reversibles |
| ¿Quién responde? | responsable actual | responsable futuro | dueño de migración |
| ¿Qué puede fallar? | fallos conocidos | riesgos nuevos | gatillos de pausa o reversa |
| ¿Qué evidencia decide? | línea base | umbral esperado | gate de avance |

### 3.5 Necesidad antes que solución

“Necesitamos una plataforma”, “necesitamos centralizar” o “necesitamos IA” son
soluciones anticipadas. Reescribe la necesidad como:

`beneficiario + cambio de estado + condición + medida`

Ejemplo:

> Las personas usuarias necesitan obtener una herramienta disponible sin repetir
> su solicitud, con confirmación antes del retiro.

Eso permite comparar una agenda manual mejorada, una regla operacional o una
aplicación. Si el nombre de una tecnología es imprescindible, debe aparecer como
restricción o decisión, no disfrazado de propósito.

### 3.6 Requisitos y evidencia

Un requisito útil declara:

- actor o beneficiario;
- conducta o resultado;
- condiciones y excepciones;
- dureza `hard | soft`;
- forma de satisfacción en el modelo;
- evidencia externa y criterio de veredicto.

opforja **IMPLEMENTA** requisitos estructurados, metacobertura hacia entidades o
enlaces y vistas de requisito. Esa cobertura significa “esta parte del modelo
realiza la intención”; no significa que una prueba haya pasado.

La evidencia ejecutable o empírica es **EXTERNA**:

```markdown
| Requisito | Cobertura en opforja | Evidencia | Veredicto |
|---|---|---|---|
| REQ-04 | Entrega de herramienta + condición de aprobación | registro piloto, muestra 30 | 28/30 sin repetición |
```

### 3.7 Criterio de suficiencia

Un modelo está suficientemente desarrollado cuando:

- responde la pregunta de su ficha;
- su OPL es comprensible para el dueño del dominio;
- la frontera y los objetos transformados son explícitos;
- los refinamientos preservan la función;
- las decisiones, hipótesis y pendientes no se confunden;
- se puede nombrar la evidencia que aceptará o refutará el cambio.

No necesita contener toda la organización. Necesita contener lo suficiente para la
decisión.

---

## 4. Diseñar y escoger la intervención

### 4.1 Comparar alternativas con la misma firma

Dos alternativas son comparables si conservan:

- entradas y resultados de frontera;
- beneficiario y transformación principal;
- restricciones no negociables;
- criterios de aceptación.

Compara después:

| Dimensión | Pregunta |
|---|---|
| Valor | ¿qué resultado entrega y a quién? |
| Coordinación | ¿cuántas responsabilidades o traspasos crea? |
| Recursos | ¿qué consume, requiere o inmoviliza? |
| Riesgo | ¿cómo falla y quién detecta el fallo? |
| Reversibilidad | ¿puede deshacerse sin pérdida intolerable? |
| Adopción | ¿qué práctica, competencia o incentivo debe cambiar? |
| Evidencia | ¿cómo sabremos si funciona? |
| Mantenimiento | ¿quién la sostiene y con qué cadencia? |

Una alternativa que cambia el resultado o exige otra entrada resolvió otro problema.

### 4.2 Personas, software e IA

En OPM:

- un **agente** es exclusivamente una persona o grupo humano;
- software, IA, dispositivos, formularios y registros son **instrumentos** cuando
  habilitan un proceso sin transformarse;
- cualquier cosa puede ser transformee si el proceso la crea, consume o cambia.

“Agente de IA” es una expresión válida en ingeniería agéntica, pero no convierte al
runtime en agente OPM. Dentro del modelo sigue siendo un objeto no humano. La
persona o grupo que autoriza, responde o revisa sí puede manejar el proceso.

Esta distinción conserva responsabilidad: “lo decidió el sistema” nunca basta para
explicar quién responde por la decisión.

### 4.3 Interfaces y objetos-frontera

Cuando dos subsistemas se encuentran, modela:

- el objeto que cruza;
- sus estados y versión;
- quién lo produce y quién lo consume;
- qué significa aceptarlo o rechazarlo;
- qué ocurre si llega tarde, duplicado, incompleto o nunca llega.

Una reunión, una API, una ficha, una orden física o un informe pueden realizar una
interfaz. No confundas el canal con el objeto-frontera.

### 4.4 Fallos y recuperación

Para cada proceso crítico pregunta:

- ¿qué precondición puede faltar?;
- ¿qué recurso puede no estar disponible?;
- ¿qué resultado puede ser inválido?;
- ¿qué espera puede exceder su plazo?;
- ¿quién detecta y quién responde?;
- ¿se reintenta, compensa, escala, pausa o revierte?;
- ¿qué evidencia queda?

El camino feliz no basta para autorizar una intervención irreversible.

### 4.5 Contrato de intervención

Antes de ejecutar, entrega un contrato pequeño:

```markdown
### Contrato de intervención
- Objetivo y requisito:
- Modelo y revisión de base:
- Alcance dentro / fuera:
- Resultado observable:
- Responsable humano:
- Herramientas o equipos autorizados:
- Restricciones:
- Pasos reversibles:
- Gates y evidencia:
- Gatillo de pausa o reversa:
- Entregables:
- Pendientes [RATIFICAR]:
```

Este contrato sirve a una cuadrilla, una unidad administrativa, un equipo clínico o
un agente de desarrollo. Cambia el vocabulario del dominio, no la lógica.

---

## 5. Ingeniería agéntica del trabajo

### 5.1 Qué cambia con agentes

Los agentes reducen el costo de leer, proponer, comparar, implementar y verificar.
No reducen automáticamente el costo de una ambigüedad. Una instrucción vaga puede
producir más trabajo equivocado, más rápido.

opforja aporta un plano común para que el agente reciba:

- propósito y frontera;
- vocabulario del dominio;
- AS-IS y TO-BE separados;
- requisitos y coberturas;
- restricciones y pendientes;
- contrato de intervención;
- evidencia esperada.

### 5.2 Sobre de autonomía

Declara por tarea:

| Zona | El agente puede |
|---|---|
| **Decidir** | sintaxis, layout, serialización, búsquedas, cálculos o cambios mecánicos dentro del contrato |
| **Proponer** | alternativas, hipótesis, descomposición y criterios, siempre con supuestos visibles |
| **Elevar** | significado de dominio, nuevas obligaciones, cruces de escala, riesgo alto y decisiones irreversibles |
| **No hacer** | inventar hechos, ratificar sus propias hipótesis, ampliar alcance o declarar aceptación humana |

El sobre no es una declaración ética abstracta. Debe reflejarse en permisos,
revisiones, tests, gates y posibilidad de reversa.

### 5.3 Paralelizar ejecución, serializar significado

Se puede paralelizar:

- lectura de fuentes independientes;
- búsqueda de evidencia;
- propuestas de alternativas;
- implementación en superficies sin solapamiento;
- pruebas distintas sobre una base congelada.

Se debe serializar:

- cambio del propósito o la frontera;
- normalización del mismo término;
- aceptación de AS-IS o TO-BE;
- ratificación de una hipótesis;
- edición concurrente del mismo modelo.

opforja no ofrece coedición multiusuario. Humano y agente trabajan por turnos,
partiendo de una revisión fresca y revisando el delta antes de continuar.

### 5.4 Unidad mínima delegable

Una tarea agéntica buena incluye:

1. **objetivo** verificable;
2. **contexto congelado**;
3. **archivos, OPDs o procesos dentro de alcance**;
4. **prohibiciones y decisiones que debe elevar**;
5. **prueba o evidencia de término**;
6. **forma de entrega**;
7. **gatillo de detención**.

“Mejora el sistema” no es una tarea. “Reduce el doble registro del paso X,
conserva Y, no cambies la regla Z y demuestra el resultado con la muestra W” sí lo
es.

### 5.5 Loop del agente modelador

1. sincroniza la revisión vigente;
2. declara qué cree haber entendido y qué sigue ambiguo;
3. propone el delta mínimo;
4. valida OPM/OPL y roundtrip;
5. entrega el cambio con preguntas y evidencia;
6. espera ratificación semántica;
7. continúa desde una revisión nueva.

La mesa puede validar forma. Solo el dueño autorizado valida que el modelo
represente el dominio y sirva a la decisión.

### 5.6 Paquete de relevo

Todo relevo humano-agente o agente-agente debería contener:

- enlace o bundle de la revisión del modelo;
- pregunta y criterio de suficiencia;
- ledger o fuentes congeladas;
- decisiones vigentes;
- pendientes `[RATIFICAR]`;
- contrato de intervención;
- evidencia producida y fallos conocidos;
- siguiente acción autorizada.

El paquete evita que el nuevo ejecutor reconstruya intención desde conversaciones
incompletas.

---

## 6. Ejecutar, introducir y adoptar el cambio

### 6.1 La intervención ocurre fuera de opforja

La ejecución puede ser:

- cambiar un procedimiento o una norma interna;
- capacitar y reasignar personas;
- comprar, instalar o retirar un recurso físico;
- modificar una planta o cadena logística;
- implementar software;
- rediseñar una red de atención;
- realizar un piloto de política pública.

El modelo da contexto y criterios. El sistema del dominio conserva órdenes,
permisos, firmas, artefactos y resultados.

### 6.2 Gates proporcionales al riesgo

Un gate responde una pregunta y produce evidencia:

| Gate | Pregunta | Evidencia posible |
|---|---|---|
| Significado | ¿el dueño de dominio acepta función y frontera? | revisión firmada o acta |
| Factibilidad | ¿la alternativa puede realizarse con recursos reales? | prueba, cotización, prototipo |
| Seguridad | ¿riesgos y recuperación son aceptables? | análisis especializado, simulacro |
| Preparación | ¿personas, materiales y canales están listos? | checklist, capacitación, inventario |
| Resultado | ¿el piloto cumple el umbral? | medición pre-registrada |
| Escala | ¿se puede ampliar sin ocultar daño o variación? | evidencia por segmento y capacidad |

Resultados permitidos: `PASS`, `N/A` justificado o `WAIVER` con dueño, razón,
riesgo y vencimiento. “Pendiente” no es un pase.

### 6.3 Piloto y reversibilidad

Antes de escalar:

1. define población, lugar, ventana o volumen del piloto;
2. congela la línea base;
3. registra umbrales de avance, pausa y reversa;
4. conserva una ruta operacional al AS-IS cuando sea posible;
5. nombra quién puede detener la intervención;
6. mide efectos deseados y daños no deseados;
7. decide con evidencia, no con el costo hundido.

### 6.4 Adopción es parte del sistema

Una intervención puede funcionar técnicamente y fracasar socialmente. Modela:

- quién debe aprender o desaprender;
- qué incentivo cambia;
- qué carga o responsabilidad se desplaza;
- qué canal de soporte existe;
- qué excepción seguirá siendo manual;
- qué feedback llega al dueño del sistema.

La capacitación no repara por sí sola un diseño que añade trabajo sin retirar nada.

---

## 7. Evidencia, aprendizaje y mantenimiento

### 7.1 Pre-registrar la evidencia

Antes de ejecutar, declara:

- indicador o señal;
- fórmula o regla de observación;
- unidad y fuente;
- población o contexto;
- línea base;
- umbral;
- ventana;
- responsable de medir;
- decisión que seguirá a cada resultado.

opforja estructura el indicador y su relación con el sistema. El cálculo y la
captura son **EXTERNOS**, salvo simulaciones conceptuales propias de la mesa.

### 7.2 Verificar y validar

- **Verificar**: ¿la intervención fue ejecutada según el diseño?
- **Validar**: ¿el sistema resultante resuelve la necesidad en su contexto?

Se puede verificar una solución inútil y validar un resultado obtenido por una
práctica distinta de la diseñada. Ambas preguntas son necesarias.

### 7.3 De incidente a aprendizaje

Cuando algo falla:

1. preserva evidencia antes de reinterpretarla;
2. fija el AS-IS del incidente;
3. localiza estado, proceso, interfaz o responsabilidad afectada;
4. distingue desviación de ejecución, supuesto falso y diseño incompleto;
5. corrige primero el artefacto propietario;
6. actualiza pruebas, controles o capacitación;
7. registra qué evidencia confirmará la corrección.

No conviertas automáticamente cada incidente en más detalle. El delta debe explicar
o prevenir algo concreto.

### 7.4 Cuándo actualizar, bifurcar o cerrar

| Acción | Úsala cuando |
|---|---|
| Actualizar | cambió un hecho o decisión, pero la pregunta y frontera siguen vigentes |
| Bifurcar | se comparan alternativas o contextos incompatibles |
| Crear otro modelo | cambió el dueño, el ritmo, la pregunta o la especie de sistema |
| Archivar | la decisión terminó o la referencia dejó de consultarse |
| Retirar | el sistema o contrato ya no debe operar y existe evidencia de cierre |

Git conserva historia documental. El modelo vigente debe ser fácil de identificar;
no mantengas varias copias “final”.

### 7.5 Deuda del modelo

Revisa periódicamente:

- anclas o normas vencidas;
- pendientes `[RATIFICAR]`;
- objetos-frontera sin consumidor;
- requisitos sin evidencia;
- responsables que ya no existen;
- AS-IS superado;
- vistas o piezas que apuntan a revisiones obsoletas;
- modelos vivos sin uso ni criterio de muerte.

La deuda de modelo es peligrosa cuando alguien aún decide con él.

---

## 8. Modernizar o retirar un sistema

### 8.1 Modernización

No modernices desde el TO-BE imaginado. Primero:

1. reconstruye la función vigente y sus usuarios reales;
2. identifica comportamiento accidental que alguien ya depende;
3. fija interfaces y objetos-frontera;
4. distingue obligación, decisión heredada y restricción caducada;
5. define compatibilidad durante la transición;
6. migra por resultados observables, no por componentes completados;
7. conserva reversa hasta que la evidencia autorice el corte.

El legado no es solo tecnología. Puede ser una práctica, contrato, instalación,
formulario, equipo o arreglo informal.

### 8.2 Retiro

Un retiro responsable modela:

- qué función desaparece o migra;
- quién recibirá el servicio restante;
- qué objetos deben transferirse, conservarse o destruirse;
- qué obligación sobrevive;
- qué consumidores deben repuntarse;
- qué evidencia prueba que ya no hay dependencia viva;
- quién autoriza el cierre irreversible.

“Dejar de usar” no equivale a retirar. Un sistema queda vivo mientras alguien
dependa de su resultado, dato, espacio, recurso o autoridad.

### 8.3 Modelo de transición

La transición necesita estados explícitos, por ejemplo:

`vigente → coexistencia → drenaje → solo consulta → retirado`

Para cada estado, declara quién puede escribir, quién puede leer, cómo se detecta
una dependencia tardía y qué activa la reversa.

---

## 9. Frontera de capacidad de opforja

Esta sección es un resumen navegable, no otra fuente de estado. El
[handoff vigente](handoff-2026-07-12.md) tiene precedencia sobre lo implementado y el
[registro de conformidad](roadmap/registro-conformidad-ssot.md), sobre las brechas
respecto del canon. Si divergen de este inventario, se corrige el resumen; no se
reinterpreta el estado desde el manual.

### 9.1 IMPLEMENTADO

La aplicación y su toolchain permiten:

- crear apuntes y graduarlos a modelos;
- bosquejar OPDs sueltos en el Taller;
- adoptar o reconciliar esos OPDs para lograr portabilidad;
- modelar objetos, procesos, estados, enlaces y refinamientos;
- editar y generar OPL, diagnosticar y validar estructura;
- representar requisitos y metacobertura dentro del modelo;
- conservar anclas normativas y pendientes de ratificación;
- usar vistas, piezas, calco, anclaje y bibliotecas gobernadas;
- guardar, versionar, importar y exportar bundles;
- exportar documento canónico Markdown y activos gráficos;
- componer modelos por interfaz y consultar submodelos como vistas;
- operar un puente de revisiones humano-agente, con los
  [límites de concurrencia vigentes](manual-opforja.md#a6-puente-directo-mesaskill-cli);
- ejecutar tests de parser, roundtrip y render reproducible en el repositorio.

La fuente exacta de atajos y operaciones es
[Uso productivo](uso-productivo.md), no este manual.

### 9.2 PROPUESTO a corto plazo

“A corto plazo” significa aquí **alcance conceptual acotado**, no una estimación de
ingeniería. Estas candidatas no tienen factibilidad validada, prioridad, compromiso
ni fecha por el solo hecho de estar documentadas:

1. **Ancla de fuente genérica:** `uri + localizador + revisión/hash` para
   modelo, OPD, entidad o enlace, sin abusar del ancla normativa.
2. **Contexto de trabajo determinista:** manifiesto pequeño que congele revisión,
   fuentes, modelo y alcance para un ejecutor humano o agente.
3. **Targets externos de satisfacción:** referencias tipadas a prueba, control,
   informe, métrica o artefacto con su veredicto.

El perfil software puede añadir un manifiesto de release como propuesta propia.
Una propuesta solo entra al producto mediante análisis de impacto, priorización,
diseño y tests.

### 9.3 EXTERNO

opforja no promete:

- ingerir automáticamente una base documental;
- descubrir por sí solo la verdad del dominio;
- inferir requisitos o ratificar hipótesis sin humano;
- generar o mantener código automáticamente;
- ejecutar intervenciones, pipelines o despliegues;
- capturar telemetría, calcular colas o realizar analítica especializada;
- coeditar un modelo en tiempo real entre varios usuarios;
- federar automáticamente portafolios;
- deshacer automáticamente un in-zoom mediante out-zoom;
- producir por sí solo el informe final de cada disciplina.

Puede modelar cómo esas capacidades externas participan. No debe fingir que las
ejecuta.

---

## 10. Ejemplo no software — Puente Vecinal

Puente Vecinal es un servicio ficticio de préstamo comunitario de herramientas. El
ejemplo existe para demostrar el método; no afirma hechos sobre una organización
real.

### 10.1 Supuestos declarados

- una persona presenta una solicitud;
- un equipo humano aprueba y entrega;
- existe un registro de inventario que informa disponibilidad;
- una herramienta puede estar disponible o prestada;
- el objetivo es evitar aprobaciones de herramientas no disponibles;
- pagos, sanciones, seguridad física y elegibilidad quedan fuera del fragmento.

Pendientes para un caso real: identidad de la persona, reglas de prioridad,
competencia requerida, mantenimiento y responsabilidad por daño.

### 10.2 Pregunta y ficha

> **Pregunta:** ¿qué comportamiento mínimo debe conservar el servicio para aprobar,
> entregar y recuperar una herramienta sin doble asignación?

- **Dueño de significado:** coordinación del servicio.
- **Beneficiario:** persona que necesita usar una herramienta.
- **Transformees:** solicitud, herramienta y préstamo.
- **Frontera:** desde solicitud pendiente hasta devolución registrada.
- **Tipo:** dominio y realización operacional mínima.
- **Suficiencia:** explicitar aprobación/rechazo, entrega, devolución, responsable e
  instrumento de consulta.
- **Muerte:** archivar si cambia la política de asignación o el servicio deja de
  prestar herramientas.

### 10.3 Del AS-IS a la necesidad

AS-IS supuesto: el equipo consulta una planilla tardía; dos solicitudes pueden
recibir promesa sobre la misma herramienta. Necesidad:

> La solicitud debe aprobarse solo con disponibilidad confirmada y la herramienta
> debe cambiar a prestada al entregarse.

Alternativas comparables:

1. tablero físico con reserva exclusiva;
2. registro digital con bloqueo;
3. custodio único con libro foliado.

El modelo de dominio no decide todavía cuál realizar.

### 10.4 Fragmento OPL del TO-BE

La fuente ejecutable es
[puente-vecinal.opl](ejemplos/puente-vecinal.opl). Cada línea es atómica, el parser
la importa sin advertencias y un test exige roundtrip sin pérdida.

```opl
**Solicitud** es un objeto informacional y sistémico.
**Herramienta** es un objeto físico y ambiental.
**Disponibilidad** es un objeto informacional y sistémico.
**Préstamo** es un objeto informacional y sistémico.
**Equipo de préstamo** es un objeto físico y ambiental.
**Registro de inventario** es un objeto informacional y sistémico.
*Validación de disponibilidad* es un proceso informacional y sistémico.
*Aprobación de préstamo* es un proceso informacional y sistémico.
*Rechazo de solicitud* es un proceso informacional y sistémico.
*Entrega de herramienta* es un proceso físico y sistémico.
*Devolución de herramienta* es un proceso físico y sistémico.
**Solicitud** puede estar `pendiente`, `aprobada` o `rechazada`.
**Herramienta** puede estar `disponible` o `prestada`.
**Disponibilidad** puede estar `desconocida`, `disponible` o `no disponible`.
**Préstamo** puede estar `activo` o `cerrado`.
**Herramienta** exhibe **Disponibilidad**.
*Validación de disponibilidad* requiere **Registro de inventario**.
*Validación de disponibilidad* afecta **Disponibilidad**.
**Equipo de préstamo** maneja *Aprobación de préstamo*.
*Aprobación de préstamo* cambia **Solicitud** de `pendiente` a `aprobada`.
*Aprobación de préstamo* ocurre si **Disponibilidad** está en `disponible`, de lo contrario *Aprobación de préstamo* se omite.
*Rechazo de solicitud* cambia **Solicitud** de `pendiente` a `rechazada`.
*Rechazo de solicitud* ocurre si **Disponibilidad** está en `no disponible`, de lo contrario *Rechazo de solicitud* se omite.
**Equipo de préstamo** maneja *Entrega de herramienta*.
*Entrega de herramienta* cambia **Herramienta** de `disponible` a `prestada`.
*Entrega de herramienta* genera **Préstamo**.
*Entrega de herramienta* ocurre si **Solicitud** está en `aprobada`, de lo contrario *Entrega de herramienta* se omite.
**Equipo de préstamo** maneja *Devolución de herramienta*.
*Devolución de herramienta* cambia **Herramienta** de `prestada` a `disponible`.
*Devolución de herramienta* cambia **Préstamo** de `activo` a `cerrado`.
```

La distinción crítica es visible: **Equipo de préstamo** es un grupo humano y
maneja procesos; **Registro de inventario** es un objeto informacional y se usa como
instrumento. El sistema de registro no “aprueba” por sí mismo.

### 10.5 Intervención y evidencia

Contrato mínimo:

- implementar una reserva exclusiva antes de aprobar;
- no cambiar reglas de elegibilidad;
- pilotear con una familia de herramientas durante dos semanas;
- medir doble asignación, tiempo de respuesta y solicitudes abandonadas;
- pausar si aparece una entrega sin responsable identificable;
- conservar el libro anterior como reversa durante el piloto.

El modelo no adjudica entre tablero, registro digital o custodio. La evidencia de
factibilidad y operación permite elegir.

### 10.6 Delegación agéntica

Un agente puede:

- comparar las tres alternativas contra la misma firma;
- revisar consistencia del ledger;
- preparar el OPL y validar roundtrip;
- diseñar una plantilla de medición.

Debe elevar:

- quién tiene autoridad de aprobación;
- qué regla prioriza solicitudes;
- qué riesgo físico es aceptable;
- cuál alternativa se adopta;
- si la evidencia del piloto basta para escalar.

---

## 11. Runbooks mínimos

### A. Iniciar una transformación

1. formula pregunta, dueño y criterio de suficiencia;
2. congela fuentes y crea ledger;
3. identifica función, beneficiario, transformee y frontera;
4. bosqueja un apunte desde el fragmento mejor conocido;
5. valida OPL con el dueño de dominio;
6. separa AS-IS, TO-BE y transición;
7. compara alternativas;
8. gradúa y entrega contrato de intervención.

### B. Comprender un sistema existente

1. fija ventana de observación;
2. modela el AS-IS real;
3. marca observado, documentado e inferido;
4. localiza interfaces, esperas y fallos;
5. formula predicciones falsables;
6. ratifica con especialistas;
7. recién entonces diseña el TO-BE.

### C. Delegar a un agente

1. entrega revisión, propósito y alcance;
2. declara decisiones permitidas y elevaciones;
3. define evidencia y gatillo de detención;
4. exige delta pequeño y trazable;
5. valida forma automáticamente;
6. valida significado humanamente;
7. continúa desde una revisión fresca.

### D. Responder a una desviación o incidente

1. preserva evidencia;
2. reconstruye el AS-IS del evento;
3. clasifica ejecución, supuesto o diseño;
4. corrige el artefacto propietario;
5. actualiza intervención y controles;
6. verifica y valida;
7. registra aprendizaje o retira la hipótesis.

### E. Modernizar o retirar

1. inventaría función y dependencias vivas;
2. fija interfaces y obligaciones;
3. diseña estados de coexistencia y drenaje;
4. migra por resultados observables;
5. prueba ausencia de consumidores;
6. obtiene autorización humana;
7. archiva evidencia y modelo.

---

## 12. Glosario transversal

| Término | Uso en este corpus |
|---|---|
| Base documental | conjunto controlado de fuentes que aporta evidencia al trabajo |
| Ledger | registro liviano de afirmación, fuente, fuerza, destino y estado |
| Ficha de trabajo | contrato que limita pregunta, dueño, frontera, suficiencia y vida del modelo |
| AS-IS | modelo del sistema observado |
| TO-BE | modelo del sistema elegido |
| Transición | sistema temporal que lleva del AS-IS al TO-BE |
| Dueño de significado | persona o grupo autorizado para validar semántica de dominio |
| Responsable de decisión | persona o grupo que acepta una alternativa y sus riesgos |
| Objeto-frontera | objeto cuyo significado y estados conectan subsistemas |
| Sobre de autonomía | decisiones que un ejecutor puede tomar, proponer, elevar o no realizar |
| Gate | pregunta de control con evidencia y veredicto explícitos |
| Respuesta puntual | modelo que muere al cerrar una decisión |
| Referencia viva | modelo mantenido porque sostiene una tarea recurrente |

Los términos OPM —objeto, proceso, estado, agente, instrumento, in-zoom, unfold,
OPD y OPL— pertenecen al
[glosario del manual de OPM puro](manual-opm-puro.md). Los términos de la mesa
—apunte, Taller, graduación, pieza, vista, calco y anclaje— pertenecen al
[manual de opforja](manual-opforja.md).

## 13. Fuentes y siguiente paso

Autoridades:

- [resolutor del canon OPM](canon-opm/resolutor-urn.json);
- `urn:fxsl:kb:metodologia-forja-opm-es`;
- `urn:fxsl:kb:reglas-opm-estrictas-es`;
- `urn:fxsl:kb:spec-forja-opl-es`;
- `urn:fxsl:kb:spec-forja-opd-es`;
- `urn:fxsl:kb:tensiones-modelamiento`.

Continúa según tu contexto:

- [Manual sanitario](manual-sanitarios-opm.md);
- [Manual de ingeniería de software](manual-software-opm.md);
- [Referencia rápida](cheatsheets/README.md);
- [Índice del corpus](README.md).
