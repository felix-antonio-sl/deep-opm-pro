# 13 — Taxonomía de enlaces: cinco familias canónicas

**Alcance**: las 5 familias canónicas de enlace (V-239), transformadores (consumo, resultado, efecto), habilitadores (agente, instrumento), invocación, estructural fundamental, estructural etiquetada. Principio de unicidad de rol.
**Capa SSOT propietaria**: `opm-visual-es.md` §3.0–3.5, §9, §8; `opm-iso-19450-es.md` (semántica base)
**Aplicación en la app**: `src/render/jointjs/crear-link.ts`, `src/render/jointjs/pass-enlaces.ts`, `src/nucleo/` (validación de enlaces).

## Reglas

### R-500: V-239 — Cinco familias canónicas

- Enunciado: toda relación expresable por enlace en un OPD conforme pertenece a **una y solo una** de estas cinco familias:

| # | Familia | Semántica | Dominio |
|---|---|---|---|
| 1 | **Transformadora procedimental** | consumo, resultado, efecto | §3.1–3.2, §12 |
| 2 | **Habilitadora procedimental** | agente, instrumento | §3.3–3.4 |
| 3 | **Invocación procedimental** | proceso → proceso | §9 |
| 4 | **Estructural fundamental** | agregación, exhibición, generalización, clasificación | §8.2 |
| 5 | **Estructural etiquetada** | unidireccional, bidireccional, recíproco | §8.1 |

- Referencia SSOT: V-239 (`opm-visual-es.md` §3.0)
- Aplicación en código: el tipo `Enlace` del kernel discrimina por familia; el validador verifica exclusividad.

### R-501: V-240 — Invocación como familia autónoma

- Enunciado: la familia de invocación tiene firma `Proceso → Proceso`, distinta de `Objeto → Proceso` propia de las familias transformadora y habilitadora. Esta distinción de firma justifica el tratamiento como **familia autónoma**, NO como subtipo de habilitación.
- Referencia SSOT: V-240 (D4)
- Aplicación en código: los enlaces de invocación tienen `origen.tipo === "proceso" && destino.tipo === "proceso"`. Rechazar mezclas.

### R-502: V-241 — Extensiones declaradas explícitamente

- Enunciado: cualquier enlace visible en un OPD conforme pertenece a exactamente una de las cinco familias. Si una herramienta expone una categoría adicional, DEBE declararla explícitamente como **extensión de implementación**, NO como familia canónica.
- Referencia SSOT: V-241
- Aplicación en código: cualquier enlace custom (ej. kora:prerequisito) debe marcarse como extensión y no bloquear conformidad nuclear.

### R-503: Familia transformadora — tres variantes

- Enunciado: los enlaces transformadores son:

| Enlace | Dirección | Decoración origen | Decoración destino | Semántica |
|---|---|---|---|---|
| Consumo | objeto → proceso | (ninguna) | punta cerrada | El proceso destruye el objeto |
| Resultado | proceso → objeto | (ninguna) | punta cerrada | El proceso crea el objeto |
| Efecto | objeto ↔ proceso | punta cerrada | punta cerrada | El proceso cambia el estado del objeto |

- Referencia SSOT: §3.1
- Aplicación en código: los markers son `MARKER_PUNTA_CERRADA` para extremos transformadores.

### R-504: V-7 — Efecto requiere estado

- Enunciado: un enlace de efecto requiere que el objeto tenga al menos un estado definido.
- Referencia SSOT: V-7
- Aplicación en código: validador rechaza efecto → objeto sin estados con mensaje "agregue al menos un estado".

### R-505: V-115 — Todo proceso explícito transforma ≥ 1 objeto

- Enunciado: como regla general, todo proceso explícito DEBE transformar (crear, consumir o afectar) al menos un objeto. Los enlaces habilitadores (agente, instrumento) NO satisfacen este requisito.
- Excepción: los **procesos persistentes** reconocidos por la capa base son válidos cuando el hecho del modelo consiste precisamente en mantener una condición o estado relevante en el tiempo (ej. *Existir*, *Sostener*, *Mantener*).
- Referencia SSOT: V-115, `opm-iso-19450-es.md` §Procesos persistentes
- Aplicación en código: validador emite warning `ALTA` si un proceso no tiene enlace transformador y no es persistente declarado.

### R-506: Semántica de consumo — instantáneo al inicio

- Enunciado: el objeto consumido desaparece **al inicio** del proceso, no al final.
- Referencia SSOT: V-49
- Aplicación en código: el motor de simulación remueve el token del origen al inicio del subproceso.

### R-507: Semántica de resultado — al término

- Enunciado: el objeto resultante aparece al completarse el proceso. Un resultado NO existe antes del proceso, por lo que NO admite modificadores `c` ni `e`.
- Referencia SSOT: `opm-iso-19450-es.md` §Enlaces transformadores; V-13 aclaración
- Aplicación en código: el validador rechaza modificadores de control en enlaces de resultado.

### R-508: Semántica de efecto — transición entre estados

- Enunciado: un enlace de efecto representa la transición del objeto entre estado de entrada y estado de salida. Mientras el proceso está activo, el objeto está en transición y su estado es indeterminado (no disponible para otros procesos).
- Referencia SSOT: `metodologia-opm-es.md` §10.9, `opm-iso-19450-es.md` §Enlaces transformadores
- Aplicación en código: el motor marca el objeto como `estado === "indeterminado"` mientras dura el proceso.

### R-509: Familia habilitadora — agente vs instrumento

- Enunciado: los enlaces habilitadores son:

| Enlace | Dirección | Decoración proceso | Semántica |
|---|---|---|---|
| Agente | agente → proceso | Piruleta negra | Persona o grupo humano que habilita sin ser transformado |
| Instrumento | instrumento → proceso | Piruleta blanca | Objeto inanimado que habilita sin ser transformado |

- Referencia SSOT: §3.3, `opm-iso-19450-es.md` §Enlaces habilitadores
- Aplicación en código: `crear-link.ts` aplica marcador según tipo declarado.

### R-510: Agente es exclusivo para humanos

- Enunciado: el enlace de **agente** (piruleta negra) DEBE usarse exclusivamente para humanos o grupos humanos. Robots, agentes de software y sistemas IA DEBEN usar enlace de instrumento.
- Referencia SSOT: `opm-iso-19450-es.md` glosario 3.3; `metodologia-opm-es.md` §6.5
- Aplicación en código: el validador rechaza asignación de agente a objetos marcados como no-humanos.
- Nota: un robot PUEDE describirse como "agente de software embebido" en prosa, pero en el modelo DEBE usar enlace de instrumento.

### R-511: V-10 — Habilitador que desaparece detiene el proceso

- Enunciado: si un habilitador deja de existir durante la ejecución, el proceso se detiene y el estado del afectado queda indeterminado.
- Referencia SSOT: V-10
- Aplicación en código: el motor de simulación pausa/aborta el proceso si el habilitador deja de existir.

### R-512: V-11 — Unicidad de rol procedimental

- Enunciado: un objeto o estado tiene exactamente **un** rol respecto de un proceso enlazado: es transformado O habilitador, nunca ambos simultáneamente para el mismo enlace.
- Referencia SSOT: V-11
- Aplicación en código: validador rechaza un mismo (origen, destino) con dos enlaces procedimentales conflictivos.

### R-513: Doble rol en procesos distintos

- Enunciado: un objeto PUEDE ser agente de un proceso y transformado de otro proceso distinto simultáneamente. Ejemplo: *Learner* es agente de *MOOC Learning* pero también afectado (su atributo *Knowledge Level* cambia).
- Referencia SSOT: `metodologia-opm-es.md` §6.5
- Aplicación en código: el modelo admite el doble rol en enlaces separados hacia procesos distintos.
- Antipatrón: forzar la colisión agente-afectado en un mismo proceso; resolver por precedencia (ver R-600).

### R-514: Familia de invocación

- Enunciado: los enlaces de invocación conectan proceso con proceso:

| Enlace | Geometría | Semántica |
|---|---|---|
| Invocación | Línea en zigzag (rayo) con punta, proceso → proceso | Al terminar, el proceso invocante inicia el invocado |
| Auto-invocación | Zigzag que sale y regresa al mismo proceso (bucle) | El proceso se invoca a sí mismo al terminar |

- Referencia SSOT: §9.1
- Aplicación en código: marker `MARKER_RAYO` con punta cerrada (ver R-404).

### R-515: V-31 — Invocación implícita por posición vertical

- Enunciado: dentro de un proceso descompuesto, la terminación de un subproceso invoca al subproceso **inmediatamente inferior** (cuyo punto superior de elipse está debajo). NO hay enlace explícito.
- Referencia SSOT: V-31, `opm-iso-19450-es.md` §14
- Aplicación en código: `pass-dagre-internos.ts` o layout interno ordena subprocesos verticalmente; el motor de simulación infiere la secuencia.
- Ver detalle: `21-tiempo-paralelismo-orden.md`.

### R-516: V-32 — Paralelismo por misma altura

- Enunciado: subprocesos cuyos puntos superiores de elipse están a la **misma altura** se ejecutan en paralelo. El último en terminar inicia al siguiente nivel.
- Referencia SSOT: V-32
- Aplicación en código: el motor agrupa subprocesos por Y idéntico o banda de tolerancia (ej. ±2 px).
- Ver: `21-tiempo-paralelismo-orden.md`.

### R-517: V-77 — Invocación implícita solo en descomposición de proceso

- Enunciado: la invocación implícita por posición vertical (V-31, V-32) solo aplica a descomposición de proceso (`process in-zooming`). En descomposición de objeto NO hay orden temporal entre componentes.
- Referencia SSOT: V-77
- Aplicación en código: el motor no aplica invocación implícita cuando el contenedor es un objeto.

### R-518: V-78 — Descomposición de objeto: posición codifica disposición, no tiempo

- Enunciado: en descomposición de objeto, la posición espacial de los componentes codifica **disposición semántica** (ubicación física de componentes en una sala, organización lógica de secciones de un artículo, campos de un registro), NO invocación temporal.
- Referencia SSOT: V-78
- Aplicación en código: el renderer no infiere flujo temporal entre partes de un objeto descompuesto.

### R-519: V-59 — Activación asincrónica por eventos

- Enunciado: cuando subprocesos dentro de una descomposición son activados individualmente por enlaces de evento desde estados distintos de un objeto, se ejecutan de forma **asincrónica e independiente**. NO hay orden secuencial ni paralelo entre ellos: cada subproceso se activa exclusivamente cuando ocurre su evento correspondiente. Este patrón modela sistemas reactivos.
- Referencia SSOT: V-59
- Aplicación en código: el motor distingue descomposición secuencial (V-31/V-32) de descomposición asincrónica por eventos (V-59).

### R-520: Enlaces estructurales (superfamilia)

- Enunciado: los enlaces estructurales tienen dos superclases:
  - **Fundamentales** (agregación, exhibición, generalización, clasificación) — semántica fija
  - **Etiquetados** (unidireccional, bidireccional, recíproco) — semántica definida por el modelador

- Referencia SSOT: §8, V-239 familias 4 y 5
- Aplicación en código: ver `14-enlaces-estructurales.md`.

### R-521: Homogeneidad de enlaces

- Enunciado: los enlaces estructurales DEBEN ser homogéneos:
  - objeto ↔ objeto
  - proceso ↔ proceso

Los enlaces procedimentales DEBEN ser **no** homogéneos (objeto ↔ proceso).

Única excepción: **exhibición-caracterización** permite las cuatro combinaciones de perseverancia (objeto exhibe atributo-objeto, objeto exhibe operación-proceso, proceso exhibe atributo-objeto, proceso exhibe operación-proceso).

- Referencia SSOT: V-25, `metodologia-opm-es.md` §9.6
- Aplicación en código: validador rechaza heterogeneidad salvo en exhibición.

### R-522: Constructo OPD mínimo

- Enunciado: un **constructo OPD básico** consiste de exactamente 1 enlace conectando exactamente 2 cosas.
- Variantes:
  - Constructo estructural básico: 2 objetos + 1 enlace estructural
  - Constructo procedimental básico: 1 proceso + 1 objeto + 1 enlace procedimental

- Referencia SSOT: V-60
- Aplicación en código: el validador considera el constructo básico como unidad atómica mínima.

### R-523: Co-agentes (AND implícito)

- Enunciado: cuando un proceso requiere la participación simultánea de dos o más agentes humanos, se conectan múltiples enlaces de agente al mismo proceso. Semántica: AND implícito (todos deben estar presentes).
- Referencia SSOT: `metodologia-opm-es.md` §9.18, V-14
- Aplicación en código: el renderer dibuja piruletas separadas sin arco entre ellas.
- Antipatrón: crear un "Agent Group" artificial para agrupar agentes distintos; pierde identidad individual.

### R-524: Invocación cíclica como iteración

- Enunciado: la invocación cíclica modela comportamiento iterativo. Después de cada ciclo, un nodo de decisión booleano evalúa si se vuelve a entrar o se continúa.
- Referencia SSOT: `opm-iso-19450-es.md` §Enlaces de invocación
- Aplicación en código: `metodologia-opm-es.md` §10.8 describe el patrón bucle; el motor soporta auto-invocación + condición de terminación.

## Checklist

- [ ] Cada enlace se clasifica en exactamente una de las 5 familias canónicas
- [ ] Transformadores tienen punta cerrada
- [ ] Habilitadores tienen piruleta (negra = agente, blanca = instrumento) y origen limpio
- [ ] Invocación tiene zigzag con punta cerrada y conecta proceso → proceso
- [ ] Efecto requiere objeto con ≥ 1 estado
- [ ] Todo proceso explícito tiene ≥ 1 enlace transformador (o es persistente declarado)
- [ ] Agente conecta solo humanos; instrumentos para no-humanos
- [ ] Unicidad de rol: no hay conflicto transformador + habilitador para el mismo enlace
- [ ] Invocación implícita aplica solo a descomposición de proceso
- [ ] Enlaces estructurales homogéneos salvo exhibición
- [ ] Doble rol admitido solo en procesos distintos, no en el mismo
- [ ] Resultado no admite `e` ni `c`

## Antipatrones

- Tratar invocación como subtipo de habilitación (v1 legacy)
- Usar piruleta negra (agente) para un robot o agente de IA
- Misma cosa como agente y afectado del mismo proceso (viola V-11)
- Proceso sin ningún transformado ni declaración de persistente
- Efecto a objeto sin estados
- Modificador `c` en enlace de resultado
- Inferir orden temporal entre partes de un objeto descompuesto

## Referencias cruzadas

- Decoraciones y markers: `12-enlaces-decoraciones-marcas.md`
- Estructurales fundamentales y etiquetados: `14-enlaces-estructurales.md`
- Estado especificado: `15-enlaces-estado-especificado.md`
- Modificadores de control: `16-modificadores-operadores.md`
- Paralelismo y orden temporal: `21-tiempo-paralelismo-orden.md`
- Distribución en descomposición: `31-distribucion-enlaces-descomposicion.md`
- OPL plantillas procedimentales: `71-opl-plantillas-procedimentales.md`
