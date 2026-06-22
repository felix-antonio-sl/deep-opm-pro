# 84 — Metodología: control de flujo avanzado

**Alcance**: esperar vs omitir, precedencia omisión/espera, semántica de eventos vs condiciones múltiples, abanicos XOR/OR, m-de-f combinatorial, NOT por existente/no-existente, etiquetas de ruta, patrones de iteración, semántica temporal, objetos booleanos, escenarios.
**Capa SSOT propietaria**: `metodologia-opm-es.md` §10
**Aplicación en la app**: motor de simulación, validador de enlaces condicionales, patrones de iteración.

## Reglas

### R-4400: Esperar vs omitir — regla de decisión

- Enunciado:

| Tipo de enlace | Si el objeto/estado está ausente | Uso |
|---|---|---|
| Sin condición (sin `c`) | Proceso **ESPERA** indefinidamente | Proceso obligatorio — el sistema se detiene |
| Con condición (con `c`) | Proceso se **SALTA** | Proceso opcional — la ejecución avanza |

**Regla**: usar enlace con `c` cuando el proceso es opcional; usar sin `c` cuando es obligatorio. Error común: usar sin condición para un recurso que puede no aparecer → **deadlock**.

- Referencia SSOT: `metodologia-opm-es.md` §10.1

### R-4401: Precedencia de omisión sobre espera

- Enunciado: cuando el conjunto previo al proceso contiene tanto enlaces de condición como enlaces sin condición, la **omisión DEBE tener precedencia sobre la espera**. Si cualquier objeto/estado vinculado por condición está ausente, el proceso se salta independientemente de la satisfacción de los enlaces sin condición.
- Referencia SSOT: `metodologia-opm-es.md` §10.2
- Aplicación en código: motor evalúa condiciones primero; cualquier falla salta sin esperar.

### R-4402: Semántica de enlaces de evento múltiples

- Enunciado: **múltiples enlaces de evento** al mismo proceso: semántica **OR** (cualquier evento individual basta para disparar).
- Referencia SSOT: `metodologia-opm-es.md` §10.3

### R-4403: Semántica de enlaces de condición múltiples

- Enunciado: **múltiples enlaces de condición** al mismo proceso:
  - semántica **AND** para ejecución (todos deben cumplirse)
  - semántica **OR** para omisión (falla de cualquiera causa omisión)
- Referencia SSOT: `metodologia-opm-es.md` §10.3

### R-4404: XOR vs OR — tabla rápida

- Enunciado:

| Abanico | Símbolo | Semántica | Uso |
|---|---|---|---|
| XOR | Arco discontinuo simple | Exactamente una de las rutas | Decisiones mutuamente excluyentes |
| OR | Arco discontinuo doble | Al menos una de las rutas | Concurrencia condicional |

Para cualquier tamaño de abanico (f ≥ 2):
- XOR → "exactamente uno de"
- OR → "al menos uno de"

- Referencia SSOT: `metodologia-opm-es.md` §10.4

### R-4405: XOR/OR combinatorial m-de-f

- Enunciado: para f > 2, el modelador PUEDE generalizar:
  - "exactamente m de f" (XOR combinatorial)
  - "al menos m de f" (OR combinatorial)

donde m < f. El número `m` se registra junto al arco en el OPD. Modela escenarios como "2 de 3 custodios de llave deben estar presentes".

- Referencia SSOT: `metodologia-opm-es.md` §10.5

### R-4406: NOT mediante existente/no-existente

- Enunciado: OPM NO tiene símbolo NOT dedicado. Para modelar "proceso P ejecuta solo cuando objeto S está ausente":
  1. Crear estados implícitos `existente` y `no-existente` para S
  2. Conectar `no-existente` a P con enlace de instrumento o condición de instrumento
- Referencia SSOT: `metodologia-opm-es.md` §10.6

### R-4407: Etiquetas de ruta para desambiguación de escenarios

- Enunciado: cuando un proceso tiene múltiples enlaces procedimentales entrantes y salientes y se necesita especificar cuál entrada mapea a cuál salida, el modelador DEBE usar etiquetas de ruta. El enlace seguido a la salida es el que tiene la misma etiqueta que el enlace de entrada. Las etiquetas de ruta proveen memoria entre entrada y salida y **eliminan el requisito AND** para objetos previos al proceso: solo objetos con la misma etiqueta deben coexistir.
- Referencia SSOT: `metodologia-opm-es.md` §10.7

### R-4408: Patrón Conjunto-Miembro (iteración)

- Enunciado: adjuntar dos enlaces procedimentales del mismo tipo a un proceso — uno a un conjunto de n miembros y otro a un miembro — produce **iteración automática n veces**.
- Referencia SSOT: `metodologia-opm-es.md` §10.8

### R-4409: Patrón Bucle

- Enunciado: un enlace de invocación desde el último subproceso hacia el proceso padre descompuesto crea un **bucle**. Para intervalos entre iteraciones, insertar un proceso *Esperar* con restricciones de tiempo.
- Referencia SSOT: `metodologia-opm-es.md` §10.8

### R-4410: Patrón Nodo de Decisión

- Enunciado: para iteración con condición de terminación, usar un **nodo de decisión booleano** que evalúa después de cada ciclo:
  - si "No" → enlace de invocación repite el bucle
  - si "Sí" → la ejecución avanza al siguiente subproceso
- Referencia SSOT: `metodologia-opm-es.md` §10.8

### R-4411: Semántica temporal de enlaces transformadores

- Enunciado: la semántica temporal se define en `opm-iso-19450-es.md` §Enlaces transformadores e §Instancias operacionales. Consecuencias metodológicas:
  - un objeto consumido NO está disponible para subprocesos posteriores
  - un objeto resultante NO está disponible para subprocesos anteriores
- Referencia SSOT: `metodologia-opm-es.md` §10.9
- Aplicación en código: motor de simulación respeta disponibilidad temporal.

### R-4412: Objetos booleanos y ramificación

- Enunciado: un **objeto booleano** es un objeto informacional de doble estado generado por un proceso de decisión. Sus estados forman un par booleano (sí/no, verdadero/falso, aprobado/denegado, `≥x`/`‹x`). Cada estado se conecta vía enlaces de condición a procesos alternativos subsiguientes, implementando control si-entonces-sino.

Generalización: cualquier objeto con n estados funciona como una selección de casos — cada estado PUEDE servir como origen de un enlace de condición o de instrumento para un proceso subsiguiente distinto.

- Referencia SSOT: `metodologia-opm-es.md` §10.10

### R-4413: No-determinismo por defecto

- Enunciado: cuando un proceso produce un objeto con n estados y NO se especifica qué estado asignar (sin enlace de resultado con estado especificado), cada estado tiene probabilidad **1/n por defecto**. Para forzar determinismo, el modelador DEBE conectar el enlace de resultado a un estado específico. Para probabilidades distintas, DEBE usar un abanico XOR con anotaciones `Pr=p`.
- Referencia SSOT: `metodologia-opm-es.md` §10.10

### R-4414: Escenarios y repertorio de comportamiento

- Enunciado: un **escenario** (hilo de ejecución) es una ruta específica a través de la jerarquía de procesos del sistema, trazada siguiendo el estado de cada objeto. En cada punto de ramificación (objeto booleano, enlaces de condición, abanico XOR), exactamente una ruta se materializa. El conjunto completo de escenarios constituye el **repertorio de comportamiento** del sistema.
- Referencia SSOT: `metodologia-opm-es.md` §10.11

### R-4415: Enlaces transformadores condicionales — taxonomía

- Enunciado:

| Enlace | Semántica | OPL-ES |
|---|---|---|
| Consumo condicional | Si consumido existe → consume; si no → se omite | `*Proceso* ocurre si **Objeto** existe, en cuyo caso **Objeto** se consume, de lo contrario *Proceso* se omite.` |
| Efecto condicional | Si afectado existe → afecta; si no → se omite | `*Proceso* ocurre si **Objeto** existe, en cuyo caso *Proceso* afecta **Objeto**, de lo contrario *Proceso* se omite.` |
| Agente condicional | Si agente existe → opera; si no → se omite | `**Agente** maneja *Proceso* si **Agente** existe, de lo contrario *Proceso* se omite.` |
| Instrumento condicional | Si instrumento existe → opera; si no → se omite | `*Proceso* ocurre si **Instrumento** existe, de lo contrario *Proceso* se omite.` |

Cada uno tiene versión con estado especificado.

- Referencia SSOT: `metodologia-opm-es.md` §10.12

### R-4416: Enlaces procedimentales con valor especificado

- Enunciado:

| Enlace | Semántica |
|---|---|
| Enlace de establecimiento de valor | Unidireccional; establece valor de atributo independiente del valor previo |
| Enlace de efecto de valor | Bidireccional; cambia valor de atributo de uno no especificado a otro |
| Par entrada-salida especificado | Cambia valor de atributo de entrada específica a salida específica |

Aplican a **valores** (estados de atributos), no a estados de objetos no-atributo.

- Referencia SSOT: `metodologia-opm-es.md` §10.13

### R-4417: Abanicos probabilísticos — suma 1

- Enunciado: en un abanico XOR divergente probabilístico, cada enlace DEBE anotarse con una probabilidad. La suma de todas las probabilidades DEBE ser **exactamente 1**. Por defecto sin abanico: si un proceso crea un objeto con n estados, cada estado tiene probabilidad 1/n.
- Referencia SSOT: `metodologia-opm-es.md` §10.14
- Aplicación en código: validador verifica suma.

### R-4418: Deadlock como antipatrón

- Enunciado: usar enlace sin condición (`c`) para un recurso que puede no aparecer causa **deadlock**. El modelador DEBE declarar explícitamente si el recurso es obligatorio (sin `c`) u opcional (con `c`).
- Referencia SSOT: `metodologia-opm-es.md` §10.1
- Aplicación en código: validador detecta potenciales deadlocks.

### R-4419: Semántica si-entonces-sino (if-then-else)

- Enunciado: el patrón canónico if-then-else se modela con objeto booleano + enlaces de condición desde cada estado:
  1. Proceso A produce objeto booleano con estados `sí` / `no`
  2. Estado `sí` → enlace de condición → Proceso B
  3. Estado `no` → enlace de condición → Proceso C
- Referencia SSOT: `metodologia-opm-es.md` §10.10
- Aplicación en código: plantilla reutilizable.

### R-4420: Memoria entre entrada y salida

- Enunciado: las etiquetas de ruta proveen **memoria** entre entrada y salida: aunque hay múltiples combinaciones posibles, solo coexisten las que tienen la misma etiqueta. Esto simplifica precondiciones compuestas.
- Referencia SSOT: `metodologia-opm-es.md` §10.7

## Checklist

- [ ] Distinción clara entre esperar (sin `c`) y omitir (con `c`)
- [ ] Omisión prevalece sobre espera
- [ ] Múltiples eventos = OR; múltiples condiciones = AND/OR
- [ ] XOR con "exactamente uno de"; OR con "al menos uno de"
- [ ] Combinatorial m-de-f admitido
- [ ] NOT modelado con existente/no-existente
- [ ] Etiquetas de ruta usadas para desambiguar
- [ ] Patrón Conjunto-Miembro para iteración automática
- [ ] Patrón Bucle con invocación + `*Esperar*`
- [ ] Patrón Nodo de Decisión para terminación
- [ ] Consumido no disponible para posteriores; resultante no para anteriores
- [ ] Objeto booleano con enlaces de condición por estado
- [ ] Probabilidad 1/n por defecto; Pr=p para no uniforme
- [ ] Probabilidades suman 1
- [ ] Escenarios como rutas específicas del repertorio
- [ ] Sin deadlocks por uso incorrecto de `c`

## Antipatrones

- Enlace sin `c` hacia recurso que puede no aparecer (deadlock)
- Omitir etiquetas de ruta en procesos con múltiples entradas/salidas
- Probabilidades que no suman 1
- Patrón NOT sin crear estados existente/no-existente
- Objeto booleano sin enlaces de condición por estado
- Usar Pr=p fuera de abanico XOR

## Referencias cruzadas

- Modificadores y operadores: `16-modificadores-operadores.md`
- Taxonomía de enlaces: `13-enlaces-taxonomia-familias.md`
- Estado especificado: `15-enlaces-estado-especificado.md`
- Simulación runtime: `50-simulacion-runtime-visual.md`
- Metodología simulación: `87-metodologia-simulacion-ejecucion.md`
- Capa computacional: `53-capa-computacional.md`
