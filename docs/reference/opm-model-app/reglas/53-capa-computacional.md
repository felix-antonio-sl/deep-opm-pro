# 53 — Capa computacional y ejecutable

**Alcance**: alias de binding `{alias}`, unidad dimensional `[u]`, slot de valor, proceso ejecutable `()`, contrato de binding, visibilidad del código, input getter y gemelo digital.
**Capa SSOT propietaria**: `opm-visual-es.md` §20
**Aplicación en la app**: extensión computacional de `src/nucleo/`, renderer (prefijos/sufijos), motor de simulación computacional.

## Reglas

### R-2300: V-158 — Alias de binding `{alias}`

- Enunciado: un alias entre llaves `{alias}` es un identificador de **binding computacional**. Su sintaxis canónica es `[a-zA-Z_][a-zA-Z0-9_]*`.
- Referencia SSOT: V-158
- Aplicación en código: el renderer imprime `{alias}` en el rótulo cuando está declarado.

### R-2301: V-159 — Unicidad de alias por alcance

- Enunciado: los alias de binding DEBEN ser únicos dentro del alcance operativo donde el código ejecutable pueda referenciarlos. Ese alcance DEBE declararse por la implementación y NO puede ser implícito.
- Referencia SSOT: V-159
- Aplicación en código: el modelo declara el alcance (ej. modelo, OPD, proceso).

### R-2302: V-160 — `{alias}` ≠ alias decorativo `(alias)`

- Enunciado: el alias entre llaves NO equivale al alias decorativo entre paréntesis de §16. Cuando coexistan ambos, las llaves se reservan **exclusivamente** para binding computacional.
- Referencia SSOT: V-160
- Aplicación en código: `cosa.aliasComputacional` vs `cosa.aliasDecorativo` como campos distintos.

### R-2303: V-161 — Unidad dimensional `[u]`

- Enunciado: un rótulo puede incluir una unidad dimensional entre corchetes `[u]` inmediatamente después del nombre y **antes del alias de binding**. Los corchetes en este contexto se reservan a unidades, NO a multiplicidad ni rango de estado.
- Referencia SSOT: V-161
- Ejemplo: `Pressure [kPa] {p}`
- Aplicación en código: el renderer construye `Nombre [unidad] {alias}` si corresponde.

### R-2304: V-162 — `[]` vacío como placeholder

- Enunciado: los corchetes vacíos `[]` solo son admisibles como placeholder de edición. DEBEN suprimirse en el canon-diagrama salvo que el modelador los haya confirmado explícitamente como parte del rótulo.
- Referencia SSOT: V-162
- Aplicación en código: exportador omite `[]` vacío.

### R-2305: V-163 — Slot de valor como primitiva visible

- Enunciado: el **slot de valor** es una primitiva visible **distinta del estado** de §2.1, aunque comparta morfología afín. Representa un contenedor de valor mutable asociado a la cosa anfitriona.
- Referencia SSOT: V-163
- Aplicación en código: tipo `SlotValor` separado del tipo `Estado`.

### R-2306: V-164 — Contenidos válidos del slot de valor

- Enunciado: un slot de valor puede contener:
  - placeholder literal `value`
  - escalar numérico
  - cadena textual
  - disyunción textual
  - intervalo o lista de intervalos (cuando el dominio permitido deba hacerse visible)
  - estructura multilínea
- Referencia SSOT: V-164
- Aplicación en código: tipo unión que cubre estos casos.

### R-2307: V-165 — Un slot primario por defecto

- Enunciado: un objeto NO debe exhibir más de **un slot de valor primario** por defecto, salvo que la plantilla computacional lo declare explícitamente.
- Referencia SSOT: V-165
- Aplicación en código: validador emite warning si hay múltiples slots primarios sin declaración de plantilla.

### R-2308: V-166 — Distinguibilidad slot vs estado cualitativo

- Enunciado: cuando un objeto combine estados cualitativos y slot de valor, ambos DEBEN poder distinguirse por al menos uno de los siguientes canales:
  - **posición** (slot separado del cluster de estados) — recomendado
  - **rotulado** (prefijo o etiqueta explícita del slot)
  - **estilo auxiliar** (marca gráfica distintiva reservada al slot)

Si el slot exhibe un rango permitido, los delimitadores `[]` / `()` y la coma entre intervalos forman parte del token visible y NO deben normalizarse ni colapsarse como simple valor de runtime.

- Referencia SSOT: V-166
- Aplicación en código: política documentada en ADR; canal preferente = posición.

### R-2309: V-167 — Proceso ejecutable exhibe `()`

- Enunciado: un proceso con cuerpo ejecutable adjunto exhibe el **sufijo `()`** inmediatamente después del nombre dentro de la elipse.
- Referencia SSOT: V-167
- Aplicación en código: renderer imprime `Nombre()` si `proceso.tieneEjecutable === true`.

### R-2310: V-168 — Ausencia de `()` no impide simulación conceptual

- Enunciado: la ausencia de `()` indica que el proceso NO exhibe cuerpo ejecutable visible, aunque pueda participar en la simulación conceptual del modelo.
- Referencia SSOT: V-168
- Aplicación en código: distinguir simulación conceptual vs ejecución computacional.

### R-2311: V-169 — Contrato de binding

- Enunciado: el código ejecutable adjunto a un proceso solo puede referenciar:
  - aliases `{...}` declarados por §20.1
  - slots de valor asociados a esos aliases
  - entradas explícitamente tipadas por la implementación
  - nombres reservados documentados por la propia herramienta
- Referencia SSOT: V-169
- Aplicación en código: validador de código ejecutable verifica referencias.

### R-2312: V-170 — Trazabilidad enlace ↔ parámetro

- Enunciado: la relación entre enlaces OPM y parámetros de la función ejecutable DEBE ser trazable. Una implementación puede resolverla por **alias**, por **orden de enlace** o por **contrato declarado**, pero NO puede dejarla totalmente implícita.
- Referencia SSOT: V-170
- Aplicación en código: declarar mecanismo de resolución en el ADR.

### R-2313: V-171 — Cuerpo del código fuera del OPD nuclear

- Enunciado: el cuerpo del código ejecutable NO forma parte del OPD nuclear y NO tiene por qué estar inscrito en el canvas. No obstante, su existencia SÍ es parte del modelo y DEBE reflejarse por `()` y por metadato recuperable en export.
- Referencia SSOT: V-171
- Aplicación en código: el canvas muestra `()`; el código vive en metadato.

### R-2314: V-172 — Canon-documento con salida recuperable

- Enunciado: si el canon-documento omite el cuerpo del código ejecutable inline, DEBE ofrecer al menos una de estas salidas recuperables:
  - tooltip o anexo computacional
  - tabla de bindings
  - referencia persistente al artefacto ejecutable (URI, hash, versión, identificador interno)

No se exige embutir el cuerpo del código en el formato de intercambio; sí se exige que sea recuperable por referencia estable.

- Referencia SSOT: V-172
- Aplicación en código: exportador incluye referencia persistente a código.

### R-2315: V-173 — Input getter y procesos externos

- Enunciado: un proceso que obtiene input desde usuario, API, broker o middleware externo sigue siendo proceso OPM. La condición de externidad se expresa por su **contrato computacional**, NO por una clase gráfica distinta de la elipse.
- Referencia SSOT: V-173
- Aplicación en código: no hay forma gráfica especial; la diferencia es el contrato.

### R-2316: V-174 — Integraciones externas vía estereotipo

- Enunciado: las integraciones externas como URL, MQTT o ROS pueden materializarse mediante estereotipo, distintivo o metadato de export, pero la gramática nuclear mínima sigue siendo el proceso ejecutable `()` enlazado a cosas OPM.
- Referencia SSOT: V-174
- Aplicación en código: estereotipos `<<MQTT>>`, `<<ROS>>`, `<<HTTP>>` como extensiones.

### R-2317: V-175 — Gemelo digital recuperable

- Enunciado: cuando una cosa OPM represente un gemelo digital o una entidad enlazada a un sistema externo, esa condición DEBE ser recuperable en el modelo mediante estereotipo, alias, distintivo o metadato canónico. NO puede depender solo de convenciones de color o de interfaz.
- Referencia SSOT: V-175
- Aplicación en código: campo declarado en el modelo, no solo visual.

### R-2318: Flujo computacional en 5 pasos (metodológico)

- Enunciado: cuando se implementa el modelo en una herramienta con soporte computacional, el modelador DEBE seguir este patrón:
  1. **Definir objetos** con atributos computacionales (tipo: `boolean`, `string`, `integer`, `float`, `double`, `short`, `long`, `enumerated`)
  2. **Asignar alias** a cada atributo computacional (ej. `x1`, `y1`)
  3. **Crear proceso de cálculo** representado con llaves `{}` en el OPD
  4. **Definir fórmula** usando los alias (ej. `pendiente = (y2-y1)/(x2-x1)`)
  5. **Conectar proceso** a objetos vía enlace de consumo/efecto para flujo de datos
- Referencia SSOT: `metodologia-opm-es.md` §12.4
- Aplicación en código: wizard de creación de proceso computacional.

### R-2319: Validación de rangos en runtime

- Enunciado: el modelador DEBERÍA asignar rangos a atributos computacionales para validación durante simulación. Sintaxis:
  - `[incluido..incluido]`
  - `(exclusivo..exclusivo)`
  - combinaciones mixtas
  - múltiples rangos: `[1..10], [20..30]`
  - `*` como extremo abierto

El sistema valida automáticamente que los valores permanezcan en rangos válidos, distinguiendo declaración persistente del rango del valor concreto de runtime.

- Referencia SSOT: `metodologia-opm-es.md` §12.5
- Aplicación en código: validador runtime chequea rangos.

### R-2320: Flujo con entrada de usuario (6 pasos)

- Enunciado: para simulación con entrada de usuario:
  1. Crear usuario como objeto físico
  2. Conectar usuario al proceso vía enlace de agente
  3. Marcar proceso para recibir entrada de usuario durante simulación
  4. Crear objeto de entrada computacional para recibir valores
  5. Conectar proceso al objeto de entrada vía enlace de efecto
  6. En la computación, usar función **Entrada de Usuario** de la API predefinida
- Referencia SSOT: `metodologia-opm-es.md` §12.6
- Aplicación en código: patrón soportado por la herramienta.

### R-2321: Integraciones IoT / robótica

- Enunciado: cuando el modelo debe intercambiar datos con entorno externo:
  - **MQTT**: adecuado para sensores y actuadores IoT con tópicos de publicación/suscripción
  - **ROS**: adecuado para robots y sistemas con maestro ROS; requiere definición de mensaje, publicación, suscripción, bucle de retroalimentación
  - **Importación CSV**: útil para carga masiva de instancias y valores; NO DEBE aplicarse a una instancia conectada vía clasificación-instanciación
- Referencia SSOT: `metodologia-opm-es.md` §12.9
- Aplicación en código: adaptadores opcionales.

### R-2322: Computación con OPM — operandos explícitos

- Enunciado: cuando se modelan operaciones aritméticas NO conmutativas (*Dividir*, *Restar*), el modelador DEBE designar explícitamente los roles de operandos (dividendo vs divisor, minuendo vs sustraendo).
- Referencia SSOT: `metodologia-opm-es.md` §12.2
- Aplicación en código: rol explícito en los enlaces.

### R-2323: Espacio de estados compuesto

- Enunciado: el espacio de estados de un objeto es el producto cartesiano de los conjuntos de estados de todos sus atributos y partes con estados. NO todos los puntos del espacio son factibles; los estados compuestos **infactibles** DEBERÍAN identificarse mediante modelado de procesos.
- Referencia SSOT: `metodologia-opm-es.md` §12.8
- Aplicación en código: el motor reconoce estados compuestos.

### R-2324: Distribución de duración para simulación estocástica

- Enunciado: el modelador PUEDE especificar una distribución de duración en la propiedad de duración de un proceso, identificando una función de distribución de probabilidad. En ejecución, cada instancia del proceso muestrea su duración independientemente.
- Referencia SSOT: `metodologia-opm-es.md` §12.3
- Ver: `51-duracion-proceso.md`.

## Checklist

- [ ] `{alias}` reservado para binding computacional
- [ ] Unicidad de alias en alcance declarado
- [ ] `{alias}` ≠ `(alias)` decorativo
- [ ] Unidad dimensional `[u]` antes del alias
- [ ] `[]` vacío suprimido en canon
- [ ] Slot de valor como primitiva distinta del estado
- [ ] Contenido del slot cubre los 6 tipos
- [ ] Un slot primario por defecto
- [ ] Slot vs estado distinguibles por posición/rotulado/estilo
- [ ] Proceso ejecutable exhibe `()`
- [ ] Código referencia solo entradas declaradas
- [ ] Relación enlace↔parámetro trazable
- [ ] Cuerpo del código fuera del OPD pero reflejado en metadato
- [ ] Canon-documento con referencia recuperable al código
- [ ] Input getter / gemelo digital trazables en el modelo
- [ ] Flujo computacional de 5 pasos disponible
- [ ] Validación de rangos en runtime
- [ ] Operandos explícitos en operaciones no conmutativas

## Antipatrones

- Uso de `{alias}` para alias decorativo
- `[]` vacío persistente en canon
- Múltiples slots primarios sin plantilla
- Código ejecutable referenciando variables no declaradas
- Gemelo digital marcado solo por color
- Proceso computacional sin `()`
- Canon-documento que omite el código sin referencia persistente

## Referencias cruzadas

- Estados y slots: `11-estados-designaciones.md`
- Estereotipos (integraciones externas): `52-estereotipos-requirement.md`
- Multiplicidad y rangos: `16-modificadores-operadores.md`
- Duración y simulación estocástica: `51-duracion-proceso.md`
- Simulación: `50-simulacion-runtime-visual.md`
- Metodología cuantitativa: `85-metodologia-errores-simulacion.md`, `87-metodologia-simulacion-ejecucion.md`
