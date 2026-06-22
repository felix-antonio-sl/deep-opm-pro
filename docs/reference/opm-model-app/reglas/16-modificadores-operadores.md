# 16 — Modificadores de control, operadores lógicos, multiplicidad y rutas

**Alcance**: modificadores `e` (evento) y `c` (condición), excepciones temporales `/` y `//`, operadores lógicos AND/XOR/OR, abanicos probabilísticos, multiplicidad y cardinalidad, etiquetas de ruta para trayectorias de ejecución.
**Capa SSOT propietaria**: `opm-visual-es.md` §4, §5, §6, §7; `opm-iso-19450-es.md` (semántica base).
**Aplicación en la app**: `src/render/jointjs/crear-link.ts`, `src/nucleo/validacion/`, generador OPL.

## Reglas

### R-800: Modificador de evento `e`

- Enunciado: el modificador `e` se coloca sobre cualquier enlace transformador o habilitador, cerca del extremo del proceso. Semántica: el objeto (o su estado) **inicia** la evaluación de la precondición del proceso.
- Referencia SSOT: §4.1
- Aplicable a:
  | Enlace base | + evento = |
  |---|---|
  | Consumo | Evento de consumo |
  | Efecto | Evento de efecto |
  | Agente | Evento de agente |
  | Instrumento | Evento de instrumento |

- Aplicación en código: campo `modificador: "e"` en el enlace; renderer dibuja letra "e" junto al extremo del proceso.

### R-801: V-12 — Evento es el segmento objeto→proceso

- Enunciado: el enlace de evento es el segmento desde el objeto/estado hacia el proceso. El segmento desde el proceso hacia el objeto (consumo, efecto) NO es un enlace de evento.
- Referencia SSOT: V-12
- Aplicación en código: la marca `e` NO se aplica a enlaces de resultado ni al segmento "regreso" del efecto.

### R-802: V-13 — Evento se pierde tras evaluación

- Enunciado: un evento se pierde tras la evaluación, incluso si la precondición falla.
- Referencia SSOT: V-13, `opm-iso-19450-es.md` §8.2.1
- Aplicación en código: el motor de simulación consume el token de evento tras evaluar.

### R-803: No hay "evento de resultado" ni "condición de resultado"

- Enunciado: no existen las variantes "evento de resultado" ni "condición de resultado". El resultado no existe antes del proceso (pues es creado por él), por lo que NO puede ser precondición (`c`) ni disparador (`e`).
- Referencia SSOT: `opm-iso-19450-es.md` §Enlaces transformadores, §13.3 Notas
- Aplicación en código: validador rechaza `e` o `c` en enlaces de resultado.

### R-804: Modificador de condición `c`

- Enunciado: el modificador `c` introduce un mecanismo de **omisión condicional** (*bypass*): si la precondición falla, el proceso se omite y el control pasa al siguiente.
- Referencia SSOT: §4.2
- Aplicable a: consumo, efecto, agente, instrumento.
- Aplicación en código: el motor de simulación salta el proceso si la condición `c` no se cumple.

### R-805: `e` vs `c` — semántica distinta

- Enunciado: `e` **dispara** (inicia la evaluación); `c` **filtra** (omite si falla). Un enlace puede portar `e`, `c`, ambas (evento condicional) o ninguna.
- Referencia SSOT: §4
- Aplicación en código: distinguir los dos modificadores en el modelo.

### R-806: Combinación con estado especificado

- Enunciado: los modificadores `e` y `c` se combinan con estado especificado. La geometría resultante: el enlace parte del estado concreto del objeto y lleva la marca `e` o `c` sobre la línea.
- Referencia SSOT: §4.3
- Aplicación en código: el renderer ubica la marca sobre la línea que sale del rountangle.

### R-807: Excepción por sobretiempo `/`

- Enunciado: el enlace de excepción por sobretiempo se marca con una sola barra oblicua (`/`). Dispara cuando la duración real del proceso fuente excede su duración máxima.
- Referencia SSOT: §4.4
- Aplicación en código: el renderer dibuja `/` como marca textual sobre el enlace fuente→manejador.

### R-808: Excepción por subtiempo `//`

- Enunciado: el enlace de excepción por subtiempo se marca con doble barra oblicua (`//`). Dispara cuando la duración real del proceso fuente cae por debajo de su duración mínima.
- Referencia SSOT: §4.4
- Aplicación en código: marca `//` sobre el enlace.

### R-809: Manejador de excepción es ambiental

- Enunciado: estos enlaces conectan un proceso fuente con un proceso de manejo de excepción. El proceso de manejo es **ambiental** (borde discontinuo).
- Referencia SSOT: §4.4
- Aplicación en código: al crear un manejador, auto-declarar afiliación ambiental.

### R-810: V-14 — AND por defecto

- Enunciado: AND es el operador por defecto. Múltiples enlaces del mismo tipo sin arco conector implican AND.
- Referencia SSOT: V-14
- Representación: enlaces separados que no se tocan entre sí. Sin símbolo explícito.
- Aplicación en código: el renderer dibuja los enlaces paralelos sin arco; el OPL genera sentencias separadas (una por enlace).

### R-811: XOR — arco discontinuo simple

- Enunciado: XOR (disyunción exclusiva) se representa con un arco discontinuo simple sobre el abanico de enlaces, con foco en el extremo convergente. Semántica: **exactamente uno** de los enlaces participantes se activa.
- Referencia SSOT: §5.2
- Aplicación en código: dibujar arco simple sobre el cluster del abanico; OPL usa "exactamente uno de".

### R-812: OR — arco discontinuo doble

- Enunciado: OR (disyunción inclusiva) se representa con dos arcos discontinuos concéntricos sobre el abanico. Semántica: **al menos uno** de los enlaces se activa.
- Referencia SSOT: §5.3
- Aplicación en código: dibujar dos arcos paralelos; OPL usa "al menos uno de".

### R-813: V-15 — XOR/OR aplican a todas las familias procedimentales

- Enunciado: XOR y OR aplican a todas las familias de enlaces procedimentales: consumo, resultado, efecto, agente, instrumento e invocación.
- Referencia SSOT: V-15
- Aplicación en código: el validador admite abanicos en cualquier familia procedimental.

### R-814: V-16 — Arco en extremo convergente

- Enunciado: el arco se posiciona en el **extremo convergente** del abanico (el extremo compartido por todos los enlaces).
- Referencia SSOT: V-16
- Aplicación en código: identificar el extremo común antes de dibujar el arco.

### R-815: V-17 — Abanicos convergente o divergente

- Enunciado: un abanico puede ser **convergente** (múltiples fuentes → un destino) o **divergente** (una fuente → múltiples destinos).
- Referencia SSOT: V-17
- Aplicación en código: el modelo distingue convergente vs divergente.

### R-816: Combinatoria de abanicos

- Enunciado: combinaciones posibles:

| Familia | Convergente | Divergente |
|---|---|---|
| Consumo | N objetos → 1 proceso | 1 objeto → N procesos |
| Resultado | N procesos → 1 objeto | 1 proceso → N objetos |
| Efecto | N objetos ↔ 1 proceso | N procesos ↔ 1 objeto |
| Agente | (no aplica) | 1 agente → N procesos |
| Instrumento | (no aplica) | 1 instrumento → N procesos |
| Invocación | N procesos → 1 proceso | 1 proceso → N procesos |

- Referencia SSOT: §5.5
- Aplicación en código: `validación` acepta solo combinaciones válidas; agente/instrumento convergentes se rechazan.

### R-817: Abanicos con modificadores

- Enunciado: cada abanico XOR/OR admite variantes con `e` y `c`. La marca se coloca sobre **cada enlace individual** del abanico (no sobre el arco).
- Referencia SSOT: §5.6
- Aplicación en código: renderer asigna marca al enlace, no al conjunto.

### R-818: V-18 — Probabilístico es siempre XOR

- Enunciado: un abanico probabilístico es siempre **XOR** — exactamente un enlace se activa por ejecución.
- Referencia SSOT: V-18
- Aplicación en código: el modelo rechaza combinación `probabilístico + OR`.

### R-819: Anotación probabilística `Pr=p`

- Enunciado: cada enlace del abanico probabilístico se anota con `Pr=p`. Las probabilidades DEBEN sumar exactamente 1.0. Si no se anotan, la probabilidad por defecto es `1/n` donde n es el número de enlaces.
- Referencia SSOT: §5.8
- Aplicación en código: validador verifica suma = 1.0 (±epsilon); UI sugiere distribución uniforme si faltan anotaciones.

### R-820: V-19 — Equivalencia resultado-XOR con estados

- Enunciado: un enlace de resultado simple hacia un objeto con estados es semánticamente equivalente a un abanico XOR de resultados con estado especificado, uno por estado.
- Referencia SSOT: V-19
- Aplicación en código: equivalencia en el validador; ambas formas son intercambiables.

### R-821: Multiplicidad — símbolos canónicos

- Enunciado: los símbolos de opcionalidad son:

| Símbolo | Límites | Significado |
|---|---|---|
| `?` | 0..1 | Opcional (cero o una instancia) |
| `*` | 0..* | Opcional, cero a muchos |
| (sin símbolo) | 1..1 | Exactamente uno (por defecto) |
| `+` | 1..* | Al menos uno |

- Referencia SSOT: §7.1
- Aplicación en código: el modelo admite `multiplicidad: "?" | "*" | "+" | "1..1" | RangoExpr`.

### R-822: Rangos y expresiones de multiplicidad

- Enunciado: la multiplicidad soporta:
  - rangos: `3..5`, `8..10`
  - rangos múltiples separados por coma: `3..5, 8..10`
  - expresiones aritméticas: `2`, `3*n`
  - restricciones: `n<=4`, `e >= 1`, `b in {0, 1}`
  - operadores de restricción: `=`, `!=`, `<`, `<=`, `>=`, `in {conjunto}`
  - delimitadores de inclusión/exclusión: `[1..10]`, `(0..*)`, `[1..10], [20..30]`

- Referencia SSOT: §7.2, `opm-opl-es.md` §12
- Aplicación en código: parser de expresiones de multiplicidad; el validador verifica sintaxis.

### R-823: V-21 — Unicidad de nombres de parámetro de multiplicidad

- Enunciado: los nombres de parámetros de multiplicidad (ej. `n`, `b`) DEBEN ser únicos en todo el modelo.
- Referencia SSOT: V-21
- Aplicación en código: tabla global de parámetros; validador detecta colisiones.

### R-824: V-22 — Posicionamiento de multiplicidad

- Enunciado: la multiplicidad se coloca como anotación **junto al extremo del enlace** o cerca del refinador en relaciones estructurales.
- Referencia SSOT: V-22
- Aplicación en código: renderer ubica la etiqueta adyacente al anchor correspondiente.

### R-825: V-23 — Multiplicidad no aplica a procesos

- Enunciado: la multiplicidad aplica a enlaces etiquetados, agregación-participación y enlaces procedimentales. NO aplica a procesos directamente.
- Referencia SSOT: V-23
- Aplicación en código: UI no ofrece multiplicidad en procesos.
- Nota: la repetición secuencial de un proceso se modela con proceso recurrente y contador; la repetición paralela con subprocesos síncronos/asíncronos.

### R-826: Etiquetas de ruta

- Enunciado: una **etiqueta de ruta** (path label) es texto colocado sobre un enlace procedimental que resuelve ambigüedad cuando un proceso tiene múltiples combinaciones entrada/salida.
- Referencia SSOT: §6.1
- Aplicación en código: el renderer imprime el label de ruta tal cual viene del modelo.

### R-827: V-20 — Regla de coincidencia de ruta

- Enunciado: al ejecutarse un proceso, se sigue la trayectoria cuya etiqueta de ruta de entrada coincide con la etiqueta de ruta de salida. Todos los enlaces de consumo/resultado con la misma etiqueta forman una trayectoria.
- Referencia SSOT: V-20
- Aplicación en código: el motor empareja por string exacto de etiqueta.

### R-828: Escenarios

- Enunciado: un **escenario** es un conjunto de etiquetas de ruta que define una variante concreta de ejecución. Evita crear un OPD adicional por cada variante.
- Referencia SSOT: §6.3
- Aplicación en código: modelo de "escenario" como subconjunto seleccionado de rutas.

### R-829: AND + OR + XOR pueden coexistir en el mismo OPD

- Enunciado: un OPD puede contener múltiples abanicos simultáneamente (ej. un proceso con abanico XOR de consumos y AND de instrumentos).
- Referencia SSOT: §5 implícito
- Aplicación en código: el renderer y validador consideran cada abanico de forma independiente.

### R-830: Semántica de múltiples enlaces de evento al mismo proceso

- Enunciado: múltiples enlaces de evento al mismo proceso: semántica **OR** (cualquier evento individual basta para disparar).
- Referencia SSOT: `metodologia-opm-es.md` §10.3
- Aplicación en código: el motor de simulación dispara el proceso al ocurrir cualquiera de los eventos.

### R-831: Semántica de múltiples enlaces de condición al mismo proceso

- Enunciado: múltiples enlaces de condición al mismo proceso:
  - semántica **AND** para ejecución (todos deben cumplirse para ejecutar)
  - semántica **OR** para omisión (falla de cualquiera causa omisión)
- Referencia SSOT: `metodologia-opm-es.md` §10.3
- Aplicación en código: motor aplica AND al evaluar; cualquier falla salta el proceso.

### R-832: Precedencia de omisión sobre espera

- Enunciado: cuando el conjunto previo al proceso contiene tanto enlaces de condición como enlaces sin condición, la omisión DEBE tener precedencia sobre la espera. Si cualquier objeto vinculado por `c` está ausente, el proceso se salta.
- Referencia SSOT: `metodologia-opm-es.md` §10.2
- Aplicación en código: el motor evalúa primero las condiciones; si alguna falla, omite sin esperar los no-condicionales.

### R-833: XOR/OR combinatorial m-de-f

- Enunciado: para `f > 2`, el modelador PUEDE generalizar:
  - "exactamente m de f" (XOR combinatorial)
  - "al menos m de f" (OR combinatorial)

El número `m` se registra junto al arco.

- Referencia SSOT: `metodologia-opm-es.md` §10.5
- Aplicación en código: el modelo admite `operador: { tipo, m?: number }`.

### R-834: NOT mediante existente/no-existente

- Enunciado: OPM NO tiene símbolo NOT dedicado. Para modelar "proceso P ejecuta solo cuando objeto S está ausente", crear estados `existente` y `no-existente` para S, y conectar `no-existente` a P con enlace de instrumento o condición de instrumento.
- Referencia SSOT: `metodologia-opm-es.md` §10.6
- Aplicación en código: patrón metodológico, no regla de renderer.

## Checklist

- [ ] `e` y `c` son marcas textuales, no nuevos enlaces
- [ ] `e` solo en segmento objeto→proceso
- [ ] `c` implementa omisión condicional, no espera
- [ ] Resultado NO admite `e` ni `c`
- [ ] Excepción `/` = sobretiempo; `//` = subtiempo
- [ ] Manejador de excepción es ambiental
- [ ] AND es default sin símbolo
- [ ] XOR usa arco simple; OR usa arco doble
- [ ] Arco se ubica en extremo convergente
- [ ] Abanicos válidos por familia (agente/instrumento solo divergente)
- [ ] Probabilidades suman 1.0; default uniforme 1/n
- [ ] Probabilístico es siempre XOR
- [ ] Multiplicidad: `?`, `*`, `+` o rango explícito
- [ ] Nombres de parámetros de multiplicidad únicos en el modelo
- [ ] Multiplicidad NO aplica a procesos
- [ ] Etiquetas de ruta coinciden entrada↔salida
- [ ] Múltiples eventos = OR; múltiples condiciones = AND ejecución / OR omisión
- [ ] Omisión prevalece sobre espera

## Antipatrones

- Usar color rojo para marcar "condición" en lugar de `c`
- Abanico XOR entre agente convergente (imposible por familia)
- Probabilidades que no suman 1.0 sin distribución uniforme declarada
- Usar línea discontinua como NOT
- Etiquetas de ruta en itálica (confunde con etiqueta estructural)
- Multiplicidad en nodos de proceso
- `e` en enlace de resultado

## Referencias cruzadas

- Decoraciones y markers: `12-enlaces-decoraciones-marcas.md`
- Familias de enlace: `13-enlaces-taxonomia-familias.md`
- Paralelismo y orden: `21-tiempo-paralelismo-orden.md`
- Control de flujo avanzado: `84-metodologia-control-flujo.md`
- OPL plantillas T/H y CT/CH: `71-opl-plantillas-procedimentales.md`
- Duración y excepciones: `51-duracion-proceso.md`
