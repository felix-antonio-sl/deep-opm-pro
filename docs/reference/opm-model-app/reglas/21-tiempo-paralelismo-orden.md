# 21 — Tiempo, paralelismo y orden en descomposición

**Alcance**: línea temporal arriba→abajo en descomposición de proceso, paralelismo por misma altura, activación asincrónica por eventos, descomposición de objeto no codifica tiempo, invocación implícita por posición vertical.
**Capa SSOT propietaria**: `opm-visual-es.md` §9.2, §10.4; `opm-iso-19450-es.md` §Árboles OPD
**Aplicación en la app**: `src/render/layout/pass-dagre-internos.ts`, `pass-stack-vertical-sin-cadena.ts`, motor de simulación.

## Reglas

### R-1000: V-35 — Línea temporal arriba → abajo

- Enunciado: en descomposición de proceso, la línea temporal fluye **de arriba hacia abajo**. La posición vertical determina la secuencia de ejecución.
- Referencia SSOT: V-35
- Aplicación en código: `pass-dagre-internos.ts` usa `rankdir: "TB"`; el layout respeta Y del fixture si está declarado.

### R-1001: V-55 — Tiempo fluye arriba→abajo en edición Y simulación

- Enunciado: el tiempo fluye de arriba hacia abajo dentro de la descomposición de un proceso. Las posiciones verticales de los subprocesos determinan el orden temporal. Esta regla rige **tanto en edición como en simulación**.
- Referencia SSOT: V-55
- Aplicación en código: cualquier reordenamiento manual en canvas debe actualizar el orden semántico y viceversa.

### R-1002: V-31 — Invocación implícita por posición

- Enunciado: la terminación de un subproceso invoca al subproceso **inmediatamente inferior** (cuyo punto superior de elipse está debajo). NO hay enlace explícito.
- Referencia SSOT: V-31
- Aplicación en código: el motor de simulación infiere la cadena de invocación desde el orden vertical.

### R-1003: V-32 — Paralelismo por misma altura

- Enunciado: subprocesos cuyos **puntos superiores de elipse** están a la misma altura se ejecutan en paralelo. El último en terminar inicia al siguiente nivel.
- Referencia SSOT: V-32
- Aplicación en código:
  - el motor agrupa subprocesos por Y con tolerancia (ej. ±2 px por snap)
  - el último en terminar, según duración, desbloquea al siguiente rank

### R-1004: Paralelismo implícito vs explícito

- Enunciado: cuando dos o más subprocesos tienen el borde superior de sus elipses a la misma altura, DEBEN interpretarse como ejecutándose en paralelo. OPL usa `en paralelo` para expresar concurrencia.
- Referencia SSOT: `metodologia-opm-es.md` §7.1; plantilla CX2
- Aplicación en código: generador OPL emite `se descompone en paralelo *A* y *B*` cuando la altura coincide.

### R-1005: V-77 — Invocación implícita solo en descomposición de proceso

- Enunciado: la invocación implícita por posición vertical (V-31, V-32) solo aplica a descomposición de proceso (`process in-zooming`). En descomposición de objeto NO hay orden temporal entre componentes.
- Referencia SSOT: V-77
- Aplicación en código: desactivar invocación implícita cuando el contenedor es un objeto.

### R-1006: V-78 — Posición codifica disposición en objeto

- Enunciado: en descomposición de objeto, la posición espacial de los componentes codifica **disposición semántica** (ubicación física en una sala, secciones de un artículo, campos de un registro), NO invocación temporal.
- Referencia SSOT: V-78
- Aplicación en código: el renderer respeta Y del fixture pero no infiere flujo temporal.

### R-1007: V-59 — Activación asincrónica por eventos

- Enunciado: cuando subprocesos dentro de una descomposición son activados individualmente por enlaces de evento desde estados distintos de un objeto, se ejecutan de forma **asincrónica e independiente**. NO hay orden secuencial ni paralelo entre ellos: cada subproceso se activa exclusivamente cuando ocurre su evento correspondiente.
- Referencia SSOT: V-59
- Aplicación en código: el motor distingue tres modos de orquestación interna:
  1. secuencial (V-31): cadena vertical
  2. paralelo (V-32): misma altura
  3. asincrónico (V-59): activación por evento

### R-1008: V-139 — Síncrono vs asíncrono en simulación

- Enunciado: en modo síncrono la simulación exhibe como máximo **una marca de proceso activo por hilo de ejecución visible**. En modo asíncrono pueden coexistir múltiples procesos activos si la estructura del OPD los habilita por paralelismo.
- Referencia SSOT: V-139
- Aplicación en código: el motor de simulación declara el modo activo y las marcas se dibujan consecuentemente.

### R-1009: Orden de ejecución con nodo de decisión

- Enunciado: en iteración con condición de terminación, un nodo de decisión booleano evalúa después de cada ciclo:
  - si "No" → enlace de invocación repite el bucle
  - si "Sí" → la ejecución avanza al siguiente subproceso
- Referencia SSOT: `metodologia-opm-es.md` §10.8
- Aplicación en código: el motor soporta este patrón explícitamente.

### R-1010: Principio de invocación cíclica

- Enunciado: los enlaces de invocación modelan comportamiento iterativo o cíclico. Después de cada ciclo, un nodo de decisión booleano evalúa si se vuelve a entrar o se continúa.
- Referencia SSOT: `opm-iso-19450-es.md` §Enlaces de invocación
- Aplicación en código: el renderer permite auto-invocación (zigzag que retorna al mismo proceso).

### R-1011: Y del fixture como peso o tiebreaker en dagre

- Enunciado: cuando el fixture declara Y explícita para subprocesos, el layout DEBE respetarla o usarla como peso/tiebreaker del dagre. NO basarse solo en los enlaces internos.
- Referencia SSOT: V-35
- Estado actual: deuda declarada en `src/render/layout/index.ts` — el orden lo infiere dagre.
- Aplicación en código: añadir pass `pass-orden-vertical-fixture` que use Y como rank hint.

### R-1012: Antipatrón — evento a subproceso no-primero

- Enunciado: el modelador NO DEBERÍA conectar un enlace de evento a un subproceso que NO sea el primero (superior) dentro de una descomposición, excepto si ha verificado que todos los subprocesos anteriores pueden omitirse sin dejar precondiciones insatisfechas.
- Referencia SSOT: `metodologia-opm-es.md` §7.4
- Aplicación en código: validador emite warning `ALTA` en esta configuración.

### R-1013: V-38 — Eventos sistémicos no cruzan límite de descomposición

- Enunciado: los enlaces de evento desde objetos sistémicos NO DEBEN cruzar el límite de la descomposición para iniciar subprocesos.
- Referencia SSOT: V-38
- Aplicación en código: validador rechaza evento sistémico externo → subproceso interno.

### R-1014: V-108 — Eventos ambientales pueden cruzar límite

- Enunciado: los enlaces de evento desde objetos **ambientales** pueden cruzar el límite de la descomposición si se modela contingencia explícita. Esta es una excepción a V-38.
- Referencia SSOT: V-108
- Aplicación en código: la herramienta debe guiar al modelador a declarar la contingencia.

### R-1015: Hilo de ejecución visible

- Enunciado: el **hilo de ejecución visible** es la secuencia de subprocesos consecutivos invocados implícitamente por posición vertical dentro de un mismo padre descompuesto (§11.2, V-59).
- Referencia SSOT: V-139
- Aplicación en código: el motor identifica hilos contiguos para marcar proceso activo.

### R-1016: Principio de línea de tiempo OPM

- Enunciado: la ejecución por defecto sigue el **Principio de Línea de Tiempo de OPM**: el primer subproceso arriba, el último abajo, paralelos a misma altura.
- Referencia SSOT: `metodologia-opm-es.md` §7.1
- Aplicación en código: layout por defecto ordena subprocesos según Y descendente al crearlos.

### R-1017: Orden OPL sigue orden de navegación del árbol

- Enunciado: la secuencia de párrafos OPL sigue en general el orden de navegación del árbol, comenzando desde `SD`. Este orden puede proyectarse desde el layout del padre, pero NO sustituye la identidad persistente del OPD.
- Referencia SSOT: `opm-iso-19450-es.md` §OPL del sistema completo
- Aplicación en código: el generador OPL recorre en orden de navegación.

### R-1018: Acoplamiento de proyección vs identidad

- Enunciado: la posición vertical de un subproceso en el canvas, el orden de navegación del árbol y el orden textual del OPL son **acoplamiento de proyección**, NO de identidad. Ninguno sustituye al identificador persistente.
- Referencia SSOT: V-250, `opm-iso-19450-es.md` §Acoplamiento de proyección
- Aplicación en código: identificador persistente del OPD separado de posición visual.

### R-1019: Subproceso mínimo = 2

- Enunciado: un proceso descompuesto DEBE contener al menos **2 subprocesos**. Un despliegue DEBE revelar al menos 2 refinadores.
- Referencia SSOT: `metodologia-opm-es.md` §7.1 "Refinamiento no trivial"
- Aplicación en código: validador emite error al crear descomposición con 1 subproceso.

### R-1020: Elaboración progresiva de SD1

- Enunciado: la construcción del OPD hijo DEBERÍA seguir esta secuencia:
  1. Inflar el proceso principal (contorno grueso en padre e hijo)
  2. Agregar subprocesos (mínimo 2) en posición vertical según línea de tiempo
  3. Renombrar subprocesos con nombres de dominio significativos
  4. Traer elementos externos conectados al proceso padre
  5. Crear objetos internos necesarios
  6. Agregar estados a los objetos que participan en transformaciones
  7. Crear enlaces internos entre subprocesos y objetos
- Referencia SSOT: `metodologia-opm-es.md` §7.1
- Aplicación en código: asistente de construcción de OPD hijo sigue esta secuencia.

## Checklist

- [ ] rankdir = TB para descomposición de proceso
- [ ] Subprocesos paralelos tienen borde superior de elipse a la misma altura
- [ ] Subprocesos secuenciales tienen Y estrictamente ordenada (arriba→abajo)
- [ ] Invocación implícita solo aplica a descomposición de proceso
- [ ] En descomposición de objeto, no hay orden temporal
- [ ] Activación asincrónica por eventos usa V-59
- [ ] Sin eventos a subproceso no-primero (salvo justificación)
- [ ] Eventos sistémicos no cruzan límite de descomposición
- [ ] Eventos ambientales SÍ pueden cruzar con contingencia
- [ ] Máximo 1 proceso activo por hilo en síncrono
- [ ] Y del fixture respetada por el layout
- [ ] Descomposición mínima = 2 subprocesos
- [ ] Identidad persistente separada de posición visual

## Antipatrones

- Subprocesos paralelos a alturas ligeramente distintas por descuido (se interpretan como secuenciales)
- Inferir orden temporal entre partes de un objeto descompuesto
- Evento sistémico cruzando borde del refinable
- Descomposición con un solo subproceso
- Usar `SDx.y` como ID estable para trazabilidad externa
- Dagre inferiendo orden libremente sin respetar Y del fixture (deuda actual)

## Referencias cruzadas

- Invocación: `13-enlaces-taxonomia-familias.md`
- Descomposición: `30-refinamiento-entre-opds.md`
- Distribución de enlaces: `31-distribucion-enlaces-descomposicion.md`
- Simulación: `50-simulacion-runtime-visual.md`
- Navegación y identidad: `40-navegacion-arbol-identidad.md`
- Metodología SD1: `81-metodologia-sd1-descomposicion.md`
- Control de flujo: `84-metodologia-control-flujo.md`
