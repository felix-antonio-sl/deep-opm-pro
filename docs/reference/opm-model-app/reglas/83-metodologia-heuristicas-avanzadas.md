# 83 — Metodología: heurísticas avanzadas de modelado

**Alcance**: patrones canónicos (proceso persistente → enlace estructural, objeto transiente → invocación), dualidad estructural, cambio de rol entre niveles, atributos, atributos discriminantes, esencia mixta, generalización, objetos implícitos, sinónimos/homónimos, co-agentes, estados cíclicos.
**Capa SSOT propietaria**: `metodologia-opm-es.md` §9, §9b
**Aplicación en la app**: guías de modelado, tooltips, validador semántico.

## Reglas

### R-4300: Proceso persistente → enlace estructural etiquetado

- Enunciado: cuando un proceso mantiene un objeto en su estado actual sin introducir cambio neto relevante (*Sostener*, *Mantener*, *Almacenar*, *Contener*, *Conectar*), el modelador DEBERÍA considerar reemplazarlo por un **enlace estructural etiquetado**.
- Referencia SSOT: `metodologia-opm-es.md` §9.1
- **Correcto**: `Cimentación soporta Casa.` (enlace estructural etiquetado)
- **Incorrecto**: *Soportar* como proceso explícito con enlaces múltiples cuando no hay esfuerzo sostenido semánticamente central.
- **Excepción**: si mantener el estado requiere esfuerzo NO trivial (vuelo estacionario de un helicóptero), el proceso DEBE modelarse explícitamente.

### R-4301: Objeto transiente → enlace de invocación

- Enunciado: cuando un proceso crea un objeto que el siguiente proceso consume inmediatamente sin intervención, el modelador DEBERÍA suprimir el objeto transiente y reemplazar el par creación-consumo con un **enlace de invocación**.
- Referencia SSOT: `metodologia-opm-es.md` §9.2
- **Correcto**: `Object Detecting invokes Threat Assessing.` (invocación, Spark suprimido)
- **Incorrecto**: Mantener `Detection Signal` como objeto explícito cuando nunca es observado ni transformado.

### R-4302: Dualidad estructural

- Enunciado: los patrones §9.1 y §9.2 son **duales**:
  - enlaces estructurales etiquetados suprimen procesos que preservan estado innecesarios
  - enlaces de invocación suprimen objetos transientes innecesarios

El modelador DEBE aplicar ambos consistentemente.

- Referencia SSOT: `metodologia-opm-es.md` §9.3

### R-4303: Cambio de rol entre niveles de detalle

- Enunciado: un objeto PUEDE ser **instrumento en un nivel abstracto** (SD) y **afectado en un nivel detallado** (SD1), siempre que el estado inicial y final sean iguales en el nivel abstracto (cambio neto = cero).
- Referencia SSOT: `metodologia-opm-es.md` §9.4, V-42
- **Correcto**: Dishwasher es instrumento de Dish Washing en SD. En SD1: Loading cambia empty→loaded; Unloading cambia loaded→empty (neto = sin cambio).
- **Incorrecto**: Declarar instrumento en SD cuando su estado neto cambia en SD1.

### R-4304: Árbol de decisión de propiedades de atributos

- Enunciado: al definir un atributo, clasificar en cuatro dimensiones binarias:

| Dimensión | Valores | Criterio |
|---|---|---|
| Explicitud | explícito (default) / implícito | ¿Es un objeto separado? |
| Modo | cualitativo (default) / cuantitativo | ¿Valores numéricos? |
| Contacto | duro (default) / blando | ¿Computable desde otros atributos? |
| Emergencia | inherente (default) / emergente | ¿Al menos una parte lo exhibe? |

Atributos blandos son derivables → PUEDEN no requerir seguimiento independiente. Atributos emergentes existen solo a nivel del todo → definen la arquitectura.

- Referencia SSOT: `metodologia-opm-es.md` §9.5

### R-4305: Homogeneidad de enlaces

- Enunciado:
  - Enlaces **estructurales** DEBEN ser homogéneos (objeto↔objeto o proceso↔proceso)
  - Enlaces **procedimentales** DEBEN ser NO homogéneos (objeto↔proceso)
  - Excepción: exhibición-caracterización permite las 4 combinaciones
- Referencia SSOT: `metodologia-opm-es.md` §9.6, V-25

### R-4306: Enlaces estructurales etiquetados con estado especificado

- Enunciado: cuando un estado de un objeto corresponde o se asocia con otro objeto, el modelador DEBERÍA usar un enlace estructural etiquetado con estado especificado (conectando el estado al objeto asociado) en vez de crear procesos o objetos intermedios.
- Referencia SSOT: `metodologia-opm-es.md` §9.7

### R-4307: Atributos discriminantes y caracterización con estado

- Enunciado: cuando las especializaciones se distinguen por un valor de atributo, usar un **atributo discriminante** con enlaces de caracterización con estado especificado. Produce un OPD significativamente más compacto que repetir el atributo para cada especialización.
- Referencia SSOT: `metodologia-opm-es.md` §9.8
- Patrón canónico: ver `72-opl-plantillas-estructurales.md` R-3210.

### R-4308: Alcance de herencia OPM

- Enunciado: cada especialización DEBE heredar del general:
  1. todas las partes (agregación-participación)
  2. todos los rasgos (exhibición)
  3. todos los enlaces estructurales etiquetados
  4. todos los enlaces procedimentales

Los estados también se heredan. Una especialización PUEDE sobreescribir estados heredados especificando estados propios.

- Referencia SSOT: `metodologia-opm-es.md` §9.9

### R-4309: Relatividad de instancia

- Enunciado: "instancia" es **relativo al sistema de discurso**. Lo que es instancia en un sistema (ej. "Taurus 2015" en comparación de autos) PUEDE ser clase con especializaciones en otro sistema (ej. autos individuales con VIN en un concesionario).
- Referencia SSOT: `metodologia-opm-es.md` §9.10

### R-4310: Instancia visual vs instancia lógica (resumen operativo)

- Enunciado: el modelador NO DEBE confundir una nueva apariencia de la misma cosa (instancia visual) con una relación clasificación-instanciación entre cosas distintas (instancia lógica). Ver V-101 y V-102.
- Referencia SSOT: `metodologia-opm-es.md` §9.10, V-101..V-102

### R-4311: Clasificación de esencia para cosas mixtas

- Enunciado: cuando una cosa tiene partes física e informacional, el modelador DEBE clasificarla como **física**. La esencia dominante del componente tangible prevalece.
- Referencia SSOT: `metodologia-opm-es.md` §9.11
- Ejemplo: un sistema de *Transportar Equipaje* tiene componentes informacionales (seguimiento) pero se clasifica como físico porque el proceso involucra transporte físico.

### R-4312: Estados directos vs atributo + valores

- Enunciado: cuando un objeto tiene un solo atributo relevante, el modelador PUEDE simplificar asignando los valores del atributo como **estados directos del objeto**, eliminando el atributo intermedio.
- Referencia SSOT: `metodologia-opm-es.md` §9.12
- **Correcto (simplificado)**: `Fetus can be embryo or baby.`
- **Correcto (completo)**: `Fetus exhibits Developmental Stage. Developmental Stage can be embryo or baby.`
- Regla de decisión: usar forma simplificada cuando el objeto tiene un solo atributo relevante y la legibilidad mejora.

### R-4313: Generalización como abstracción del SD

- Enunciado: cuando múltiples objetos específicos del SD1 compartirían el mismo tipo de relación con el proceso principal en el SD, crear un objeto **general** que los englobe y agregar solo ese al SD, manteniendo los específicos en SD1.
- Referencia SSOT: `metodologia-opm-es.md` §9.13
- **Correcto**: Road Danger Representation (general) en SD; Vehicle-in-Front / Pedestrian-in-Front / Lane Set Representation (específicos) en SD1 vía generalización.
- **Incorrecto**: Las tres representaciones específicas en SD.

### R-4314: Hacer explícitos los objetos implícitos

- Enunciado: al modelar sistemas a partir de texto, el modelador DEBE identificar y modelar explícitamente los objetos que el texto menciona implícitamente. En documentos orientados a procesos, los objetos transformados frecuentemente no se nombran. El acto de forzar la pregunta "¿qué objeto transforma este proceso?" revela entidades críticas omitidas.
- Referencia SSOT: `metodologia-opm-es.md` §9.14

### R-4315: Detección de sinónimos y homónimos

- Enunciado: OPM exige correspondencia 1:1 entre cosas y **nombres canónicos**. El modelador DEBE usar este formalismo para detectar:
  - **sinónimos** (múltiples palabras para mismo concepto)
  - **homónimos** (misma palabra para conceptos distintos)

Cada sinónimo DEBE resolverse eligiendo un término canónico. Las variantes de superficie admitidas por OPL-ES pueden coexistir editorialmente pero DEBEN mapear al mismo nombre canónico interno. Cada homónimo DEBE resolverse creando cosas separadas con nombres distintos.

- Referencia SSOT: `metodologia-opm-es.md` §9.15
- Aplicación en código: validador de unicidad + detección léxica.

### R-4316: Detección de inconsistencias texto-diagrama

- Enunciado: el modelado OPM de un documento existente produce como subproducto la detección de inconsistencias entre texto principal y diagramas. Documentar como hallazgos de calidad.
- Referencia SSOT: `metodologia-opm-es.md` §9.16
- Ejemplo: un mismo recuadro puede representar "sistemas" en un diagrama y "procesos" en otro sin justificación.

### R-4317: Etiquetado de OPD por cláusula de referencia

- Enunciado: al modelar documentos normativos, el modelador DEBERÍA etiquetar los OPDs con las cláusulas del documento fuente (ej. `[5.2.2] System`, `[6.1] Acquisition`). Permite trazabilidad directa.
- Referencia SSOT: `metodologia-opm-es.md` §9.17
- Aplicación en código: campo `clausulaFuente` en OPD.

### R-4318: Co-agentes (AND implícito)

- Enunciado: cuando un proceso requiere la participación simultánea de dos o más agentes humanos, conectar múltiples enlaces de agente al mismo proceso. Semántica: AND implícito.
- Referencia SSOT: `metodologia-opm-es.md` §9.18
- **Correcto**: `Driver and OnStar Advisor handle Call Handling.`
- **Incorrecto**: Crear un objeto general "Agent Group" para agrupar agentes distintos — pierde identidad individual.
- Regla de decisión: usar co-agentes cuando participan en la misma actividad simultáneamente; si participan en momentos distintos, descomponer el proceso.

### R-4319: Estado cíclico (inicial Y final simultáneo)

- Enunciado: un estado PUEDE ser simultáneamente inicial Y final, modelando objetos que retornan a su estado original tras un ciclo completo de vida. NO es un error.
- Referencia SSOT: `metodologia-opm-es.md` §9.19
- **Correcto**: Dishwasher con estado `empty` marcado inicial Y final (empty → loaded → running → empty).
- **Incorrecto**: Duplicar estados (`empty_start`, `empty_end`) — introduce sinónimo falso.

### R-4320: Atributos cuantitativos con unidad y tipo

- Enunciado: todo atributo cuantitativo DEBERÍA declarar unidad de medida y tipo de dato. Convención recomendada: nombre + unidad entre corchetes + alias entre llaves: `Pressure [kPa] {p}`.

Tipos válidos: boolean, string, integer, float, double, short, long, enumerated.

Rangos: convención canónica con `..` y delimitadores de inclusión/exclusión (ej. `[0..100]`, `(0..*)`, `[1..10], [20..30]`).

Cuando un atributo hereda un rango desde una plantilla, una ocurrencia más concreta PUEDE restringirlo con sub-rango compatible; NO DEBERÍA ampliarlo silenciosamente sin declarar override explícito.

- Referencia SSOT: `metodologia-opm-es.md` §9.20
- Ver: `53-capa-computacional.md`.

### R-4321: Preferencia por estados discretos sobre rangos continuos

- Enunciado: cuando el comportamiento del sistema depende de umbrales discretos (ej. "lleno", "vacío"), preferir estados cualitativos sobre valores continuos en slots. Reservar los slots para magnitudes que participan en cálculos.
- Referencia SSOT: implícita en §9.12 y §20
- Aplicación en código: tooltip de buena práctica.

### R-4322: Sobreescritura explícita de estados heredados

- Enunciado: una especialización PUEDE sobreescribir estados heredados del general especificando estados propios. Esta sobreescritura DEBE ser explícita, no por omisión.
- Referencia SSOT: `metodologia-opm-es.md` §9.9
- Aplicación en código: campo `estadosOverride` en especialización.

## Checklist

- [ ] Procesos persistentes triviales reemplazados por enlaces estructurales
- [ ] Objetos transientes reemplazados por invocación
- [ ] Dualidad aplicada consistentemente
- [ ] Cambio de rol instrumento→afectado válido solo con cambio neto = 0
- [ ] Atributos clasificados en 4 dimensiones binarias
- [ ] Homogeneidad de enlaces preservada (excepto exhibición)
- [ ] Atributos discriminantes con caracterización de estado
- [ ] Herencia completa de partes, rasgos, enlaces
- [ ] Esencia mixta clasificada como física
- [ ] Estados directos cuando hay un solo atributo relevante
- [ ] Generalización usada para abstraer SD
- [ ] Objetos implícitos del texto fuente identificados
- [ ] Sinónimos resueltos a nombre canónico
- [ ] Homónimos separados en cosas distintas
- [ ] OPDs etiquetados con cláusula fuente (documentos normativos)
- [ ] Co-agentes como múltiples enlaces, no Agent Group artificial
- [ ] Estados cíclicos (inicial + final) permitidos
- [ ] Atributos cuantitativos con unidad, tipo y rango
- [ ] Sobreescritura de estados heredados explícita

## Antipatrones

- *Sostener* como proceso con instrumento + afectado para preservación estructural trivial
- Objeto transiente explícito sin observador
- Cambio de rol instrumento→afectado con cambio neto ≠ 0
- Enlace estructural objeto↔proceso fuera de exhibición
- Múltiples agentes agrupados en "Agent Group" genérico
- Duplicar estados `start`/`end` para evitar ciclo
- Modelar documento sin marcar objetos implícitos
- Sinónimos múltiples para mismo concepto sin resolver
- Atributo cuantitativo sin unidad ni tipo
- Herencia incompleta (olvidar enlaces procedimentales del general)

## Referencias cruzadas

- Enlaces y familias: `13-enlaces-taxonomia-familias.md`
- Estructurales y herencia: `14-enlaces-estructurales.md`
- Estados: `11-estados-designaciones.md`
- Descomposición: `81-metodologia-sd1-descomposicion.md`
- Capa computacional: `53-capa-computacional.md`
- Validación: `62-validacion-marcas-error.md`
- Invariantes entre niveles: `35-invariantes-entre-niveles.md`
