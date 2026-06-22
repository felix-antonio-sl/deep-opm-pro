# 85 — Metodología: manejo de errores temporales y modelado cuantitativo

**Alcance**: excepciones por sobretiempo y subtiempo, resolución de estado indeterminado, tasa de transformación, computación con OPM, distribuciones de duración, flujos computacionales, validación de rangos, integración externa (MQTT, ROS, CSV), espacio de estados compuesto.
**Capa SSOT propietaria**: `metodologia-opm-es.md` §11, §12
**Aplicación en la app**: capa de simulación, validación de rangos, integraciones.

## Reglas

### R-4500: Excepciones por sobretiempo — regla de uso

- Enunciado: cuando un proceso tiene duración máxima, el modelador DEBERÍA adjuntar un enlace de **excepción por sobretiempo** a un proceso de manejo. Si el proceso excede su tiempo máximo, el manejador se activa y resuelve los objetos en transición a estados permisibles.
- Referencia SSOT: `metodologia-opm-es.md` §11.1

### R-4501: Excepciones por subtiempo — regla de uso

- Enunciado: cuando un proceso tiene duración mínima, el modelador DEBERÍA adjuntar un enlace de **excepción por subtiempo** a un proceso de manejo. Si el proceso se completa antes del mínimo (o es omitido, duración = 0), el manejador se activa.
- Referencia SSOT: `metodologia-opm-es.md` §11.2

### R-4502: Subtiempo como detector de omisión

- Enunciado: un enlace de excepción por subtiempo en un proceso con duración mínima detecta cuando el proceso NO se ejecutó (duración efectiva = 0 < mínimo positivo), activando lógica de recuperación. Esto provee un mecanismo formal para "proceso no ejecutado".
- Referencia SSOT: `metodologia-opm-es.md` §11.2

### R-4503: Resolución de estado indeterminado obligatoria

- Enunciado: todo afectado en transición durante un proceso activo permanece en estado indeterminado si el proceso falla. Los manejadores de excepciones (sobretiempo/subtiempo) DEBEN resolver el objeto a un estado permisible. Sin manejo de excepciones, el objeto queda indefinido y el modelo es **incompleto para simulación**.
- Referencia SSOT: `metodologia-opm-es.md` §11.3

### R-4504: Tasa de transformación

- Enunciado: cuando consumo, creación o cambio de estado ocurre como **flujo continuo** u operación multiunidad en el tiempo, el modelador DEBERÍA asignar una propiedad de tasa al enlace procedimental relevante. Tres especializaciones:
  - tasa de consumo
  - tasa de generación
  - tasa de efecto
- Referencia SSOT: `metodologia-opm-es.md` §12.1
- Aplicación en código: campo opcional en enlaces.

### R-4505: Computación con OPM — roles de operandos

- Enunciado: cuando se modelan operaciones aritméticas **no conmutativas** (*Dividir*, *Restar*), el modelador DEBE designar explícitamente los roles de operandos (dividendo vs divisor, minuendo vs sustraendo). OPM puede incrustar fórmulas en nombres de proceso (ej. `Calcular Residuo (residuo=il-u)`) para concisión.
- Referencia SSOT: `metodologia-opm-es.md` §12.2

### R-4506: Distribución de duración para simulación estocástica

- Enunciado: el modelador PUEDE especificar una distribución de duración (normal, uniforme, exponencial, etc.) en la propiedad de duración. En ejecución, cada instancia del proceso muestrea su duración **independientemente**. Sin distribución, todas ejecutan en la duración esperada exacta (irrealista para sistemas reales).
- Referencia SSOT: `metodologia-opm-es.md` §12.3

### R-4507: Flujo computacional de 5 pasos

- Enunciado: cuando se implementa el modelo en una herramienta con soporte computacional, el modelador DEBE seguir:
  1. **Definir objetos** con atributos computacionales (tipo: boolean, string, integer, float, double, short, long, enumerated)
  2. **Asignar alias** a cada atributo (ej. `x1`, `y1`)
  3. **Crear proceso de cálculo** representado con `{}` en el OPD
  4. **Definir fórmula** usando los alias (ej. `pendiente = (y2-y1)/(x2-x1)`)
  5. **Conectar proceso** a objetos vía enlace de consumo/efecto
- Referencia SSOT: `metodologia-opm-es.md` §12.4

### R-4508: Estereotipos computacionales

- Enunciado: plantillas de parámetros reutilizables para patrones computacionales comunes. La herramienta puede distinguir niveles global y organizacional. Al remover un estereotipo, el modelador DEBE elegir:
  - desenlazar (conservar componentes)
  - desenlazar y eliminar (eliminar componentes agregados)
- Referencia SSOT: `metodologia-opm-es.md` §12.4

### R-4509: Validación de rangos

- Enunciado: el modelador DEBERÍA asignar rangos a atributos computacionales para validación durante simulación. Sintaxis canónica:
  - `[incluido..incluido]`, `(exclusivo..exclusivo)`, combinaciones mixtas
  - múltiples rangos: `[1..10], [20..30]`
  - `*` como extremo abierto

El sistema valida automáticamente que los valores permanezcan en rangos válidos, distinguiendo declaración persistente del rango del valor concreto de runtime.

- Referencia SSOT: `metodologia-opm-es.md` §12.5

### R-4510: Flujo de simulación con entrada de usuario (6 pasos)

- Enunciado:
  1. Crear usuario como objeto físico
  2. Conectar usuario al proceso vía **enlace de agente**
  3. Marcar proceso para recibir entrada de usuario durante simulación
  4. Crear objeto de entrada computacional para recibir valores
  5. Conectar proceso al objeto de entrada vía **enlace de efecto** (requerido para actualizar objetos computacionales)
  6. En la computación, usar función **Entrada de Usuario** de la API predefinida

Sin los pasos 5-6, el objeto entrada NO recibirá valores durante simulación.

- Referencia SSOT: `metodologia-opm-es.md` §12.6

### R-4511: Semántica operacional en contextos descompuestos

- Enunciado: ejecutar un proceso con contexto descompuesto transfiere control **recursivamente** al subproceso superior del nivel más profundo. El control retorna al proceso descompuesto tras la terminación del último subproceso.
- Referencia SSOT: `metodologia-opm-es.md` §12.7

### R-4512: Espacio de estados compuesto

- Enunciado: el **espacio de estados** de un objeto es el producto cartesiano de los conjuntos de estados de todos sus atributos y partes con estados. El modelador DEBE reconocer que NO todos los puntos del espacio son factibles; los estados compuestos **infactibles** DEBERÍAN identificarse mediante modelado de procesos.

Para precondiciones compuestas que abarcan múltiples atributos, el modelador DEBE usar sentencias OPL con múltiples cláusulas de condición, con cláusulas XOR numeradas conectadas por AND lógico.

- Referencia SSOT: `metodologia-opm-es.md` §12.8

### R-4513: Integración externa — MQTT

- Enunciado: **MQTT** adecuado para sensores y actuadores IoT con tópicos de publicación/suscripción. Requiere configurar servidor base y servidor MQTT. Usar para acoplar variables computacionales a telemetría o comandos ligeros.
- Referencia SSOT: `metodologia-opm-es.md` §12.9

### R-4514: Integración externa — ROS

- Enunciado: **ROS** adecuado para robots y sistemas con maestro ROS. Flujo mínimo:
  - definición de mensaje
  - publicación
  - suscripción
  - manejo del bucle de retroalimentación vía condiciones o iteración
- Referencia SSOT: `metodologia-opm-es.md` §12.9

### R-4515: Integración externa — Importación CSV

- Enunciado: útil para carga masiva de instancias y valores de atributos. Restricción: el objeto destino NO DEBE ser una instancia conectada vía clasificación-instanciación. El modelador DEBERÍA previsualizar la importación y decidir si:
  - ignora existentes
  - crea atributos faltantes
- Referencia SSOT: `metodologia-opm-es.md` §12.9

### R-4516: Tokens computacionales vs conceptuales

- Enunciado:
  - tokens **conceptuales**: evidencian disponibilidad, consumo, creación o cambio de estado
  - tokens **computacionales**: transportan valores numéricos u otros tipos
- Referencia SSOT: `metodologia-opm-es.md` §14.3

### R-4517: Antipatrones de simulación

- Enunciado:
  - Usar enlace sin `c` para recurso opcional (deadlock)
  - Proceso con duración mínima sin manejador de subtiempo
  - Proceso con duración máxima sin manejador de sobretiempo
  - Espacio de estados sin identificar infactibles
- Referencia SSOT: `metodologia-opm-es.md` §11, §12
- Aplicación en código: validador emite warnings.

### R-4518: Proceso de manejo de excepción debe resolver estado

- Enunciado: un manejador de excepción DEBE, por construcción, resolver los objetos afectados a un estado determinado. Si el manejador mismo puede fallar, agregar manejador recursivo o escalar al supervisor.
- Referencia SSOT: `metodologia-opm-es.md` §11.3

### R-4519: Cuantitativo como extensión

- Enunciado: el modelado cuantitativo es **extensión** del conceptual. Un modelo puede ser conceptual puro (sin valores numéricos) y seguir siendo válido. La transición a computacional se hace cuando el propósito lo exige.
- Referencia SSOT: `metodologia-opm-es.md` §12.1, §14.2

### R-4520: Plantillas reusables computacionales

- Enunciado: los estereotipos computacionales son plantillas **reusables** que encapsulan patrones comunes (conversiones de unidad, fórmulas físicas). Reducen redundancia.
- Referencia SSOT: `metodologia-opm-es.md` §12.4

### R-4521: Declaración de tipo en OPL

- Enunciado: cada atributo computacional debe declarar su tipo:
  - EN: `Object is of type type-id.`
  - ES: `**Objeto** es de tipo tipo-id.`

Tipos: boolean, string, integer, float, double, short, long, enumerated.

- Referencia SSOT: `opm-opl-es.md` §12.1

## Checklist

- [ ] Excepción de sobretiempo con manejador para procesos con duración máxima
- [ ] Excepción de subtiempo con manejador para procesos con duración mínima
- [ ] Manejadores resuelven estado indeterminado
- [ ] Tasa de transformación cuando aplica flujo continuo
- [ ] Roles de operandos explícitos en operaciones no conmutativas
- [ ] Distribución de duración para simulación estocástica
- [ ] Flujo computacional de 5 pasos seguido
- [ ] Estereotipos computacionales con política de remoción declarada
- [ ] Rangos canónicos con `..` y delimitadores
- [ ] Flujo de entrada de usuario de 6 pasos
- [ ] Espacio de estados infactibles identificados
- [ ] MQTT / ROS / CSV usados con contratos claros
- [ ] Distinción tokens conceptuales vs computacionales
- [ ] Modelo puede ser solo conceptual si el propósito lo permite
- [ ] Tipo declarado para cada atributo computacional

## Antipatrones

- Proceso con duración mínima/máxima sin manejador de excepción
- Manejador de excepción que no resuelve estado
- Operación no conmutativa con operandos sin rol declarado
- Simulación determinista sin distribución para procesos reales
- CSV import hacia instancia de clasificación
- Espacio de estados con combinaciones infactibles no marcadas

## Referencias cruzadas

- Duración: `51-duracion-proceso.md`
- Simulación runtime: `50-simulacion-runtime-visual.md`
- Control de flujo: `84-metodologia-control-flujo.md`
- Capa computacional: `53-capa-computacional.md`
- Estereotipos: `52-estereotipos-requirement.md`
- Simulación ejecución: `87-metodologia-simulacion-ejecucion.md`
