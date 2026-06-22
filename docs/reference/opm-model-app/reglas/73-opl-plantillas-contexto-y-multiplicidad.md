# 73 — OPL-ES: gestión de contexto, inter-modelo, multiplicidad, rutas, atributos

**Alcance**: plantillas CX (contexto: descomposición, despliegue, plegado, recomposición), CM (composición inter-modelo), operadores lógicos, multiplicidad y cardinalidad, etiquetas de ruta, valores de atributo, reglas R1..R21 de transformación EN↔ES.
**Capa SSOT propietaria**: `opm-opl-es.md` §10–§15; Apéndice A
**Aplicación en la app**: generador OPL, parser OPL.

## Reglas

### R-3300: CX1 — Descomposición con secuencia

- Enunciado:
  - EN: `Process zooms into P1, P2 and P3, in that sequence.`
  - ES: `*Proceso* se descompone en *P1*, *P2* y *P3*, en esa secuencia.`
- Referencia SSOT: `opm-opl-es.md` §10.1

### R-3301: CX2 — Descomposición en paralelo

- Enunciado:
  - EN: `Process zooms into parallel P1 and P2.`
  - ES: `*Proceso* se descompone en paralelo *P1* y *P2*.`
- Referencia SSOT: `opm-opl-es.md` §10.1

### R-3302: Descomposición mixta (secuencial + paralela)

- Enunciado: patrón admitido:
  - `*Proceso* se descompone en *A*, paralelo *B* y *C*, y *D*, en esa secuencia.`
- Referencia SSOT: `opm-opl-es.md` §10
- Aplicación en código: generador OPL soporta mezcla.

### R-3303: CX3 — Despliegue

- Enunciado:
  - EN: `Thing unfolds in SD1 into T1, T2 and T3.`
  - ES: `**Cosa** se despliega en SD1 en **T1**, **T2** y **T3**.`
- Referencia SSOT: `opm-opl-es.md` §10.2

### R-3304: CX4 — Refinamiento entre OPDs

- Enunciado:
  - EN: `SD is refined by in-zooming Process in SD1.`
  - ES: `SD se refina por descomposición de *Proceso* en SD1.`
- Referencia SSOT: `opm-opl-es.md` §10.3
- Nota: las etiquetas `SD`, `SD1`, etc., son referencias humanas de navegación, no identidad persistente. Toda oración de refinamiento DEBE mapearse a un identificador persistente recuperable.

### R-3305: CX5–CX8 — Plegado y recomposición

- Enunciado:

| ID | OPL-EN | OPL-ES |
|---|---|---|
| CX5 | Process folds into parent OPD. | *Proceso* se pliega en el OPD padre. |
| CX6 | Object folds into parent OPD. | **Objeto** se pliega en el OPD padre. |
| CX7 | Process recomposes from diagram. | *Proceso* se recompone desde `diagrama`. |
| CX8 | Object recomposes from diagram. | **Objeto** se recompone desde `diagrama`. |

- Referencia SSOT: `opm-opl-es.md` §10.5

### R-3306: CM1..CM3 — Composición inter-modelo

- Enunciado:

| ID | OPL-EN | OPL-ES |
|---|---|---|
| CM1 | SD1.1 is a sub-model view of Subsystem Model. | SD1.1 es una vista de sub-modelo de Modelo Subsistema. |
| CM2 | SD1.1 references sub-model Subsystem Model from SD1. | SD1.1 referencia el sub-modelo Modelo Subsistema desde SD1. |
| CM3 | Thing in SD1.1 is an external reference to Thing of owner model Main Model. | **Cosa** en SD1.1 es referencia externa a **Cosa** del modelo propietario Modelo Principal. |

- Referencia SSOT: `opm-opl-es.md` §10.4
- Aplicación en código: generador OPL para sub-modelos y referencias externas.

### R-3307: Operadores lógicos — AND implícito

- Enunciado: AND se expresa implícitamente mediante sentencias OPL **separadas** para cada enlace. NO hay operador explícito.
- Referencia SSOT: `opm-opl-es.md` §11.1
- Ejemplo AND de agentes:
  - `**Dueño de Caja Fuerte A** maneja *Abrir Caja Fuerte*.`
  - `**Dueño de Caja Fuerte B** maneja *Abrir Caja Fuerte*.`

### R-3308: XOR — "exactamente uno de"

- Enunciado: XOR emite la forma:
  - `*P* consume exactamente uno de **A**, **B** o **C**.`
- Referencia SSOT: `opm-opl-es.md` §11.2

### R-3309: OR — "al menos uno de"

- Enunciado: OR emite la forma:
  - `*P* consume al menos uno de **A**, **B** o **C**.`
- Referencia SSOT: `opm-opl-es.md` §11.3

### R-3310: XOR/OR con modificadores de control

- Enunciado:
  - **Evento + XOR**: insertar "inicia" antes del verbo principal
  - **Condición + XOR**: insertar "si ... existe/está en estado ... de lo contrario ... se omite"
  - Reemplazar "exactamente" por "al menos" para OR
- Referencia SSOT: `opm-opl-es.md` §11.4

### R-3311: Probabilístico — Pr=p

- Enunciado: cada enlace del abanico probabilístico se anota con `Pr=p`. Suma de probabilidades = 1. Notación numérica universal sin cambio EN↔ES.
- Referencia SSOT: `opm-opl-es.md` §11.5

### R-3312: Cardinalidades canónicas

- Enunciado:

| Símbolo | Rango | OPL-EN | OPL-ES |
|---|---|---|---|
| ? | 0..1 | an optional | un/una opcional |
| * | 0..* | optional (none to many) | opcional (cero o más) |
| (sin) | 1..1 | (default) | (por defecto) |
| + | 1..* | at least one | al menos un/una |

- Referencia SSOT: `opm-opl-es.md` §12

### R-3313: Rangos y restricciones

- Enunciado: rango parametrizado base: `qmín..qmáx`. Delimitadores de inclusión/exclusión admitidos: `[qmín..qmáx]`, `(qmín..qmáx]`, `[qmín..qmáx)`, `(qmín..qmáx)`. Listas de intervalos separadas por coma. `*` como extremo abierto. Restricciones: `=`, `≠`, `<`, `≤`, `≥`, `∈`.
- Referencia SSOT: `opm-opl-es.md` §12
- Aplicación en código: parser de expresiones de multiplicidad.

### R-3314: Declaración de tipo

- Enunciado: OPL-ES emite:
  - EN: `Object is of type type-id.`
  - ES: `**Objeto** es de tipo tipo-id.`

Tipos válidos: `boolean`, `string`, `integer`, `float`, `double`, `short`, `long`, `enumerated`.

- Referencia SSOT: `opm-opl-es.md` §12.1

### R-3315: Etiquetas de ruta

- Enunciado: plantilla de ruta:
  - EN: `Following path label, Process consumes Object.`
  - ES: `Por ruta etiqueta, *Proceso* consume **Objeto**.`

"Por ruta" es fijo. La etiqueta es definida por el modelador.

- Referencia SSOT: `opm-opl-es.md` §13

### R-3316: Valores de atributo

- Enunciado:

| OPL-EN | OPL-ES |
|---|---|
| Attribute of Object is value. | **Atributo** de **Objeto** es valor. |
| Attribute of Object ranges from X to Y. | **Atributo** de **Objeto** varía de X a Y. |
| Attribute of Object can be value1, value2, or value3. | **Atributo** de **Objeto** puede estar `valor1`, `valor2` o `valor3`. |

- Referencia SSOT: `opm-opl-es.md` §14

### R-3317: Reglas R1..R21 de transformación sistemática EN→ES

- Enunciado:

| # | Regla | EN | ES |
|---|---|---|---|
| R1 | Verbo principal | consumes, yields, affects, handles, requires, initiates, invokes, occurs, exists | consume, genera, afecta, maneja, requiere, inicia, invoca, ocurre, existe |
| R2 | State-specified: posición | `state Object` | **Objeto** en `estado` |
| R3 | Estado condicional | Object is state | **Objeto** está en `estado` |
| R4 | Declaración de estados | can be | puede estar |
| R5 | Conjunción copulativa | and | y (e ante i-/hi-) |
| R6 | Conjunción disyuntiva | or | o (u ante o-/ho-) |
| R7 | Preposición de origen | from | de |
| R8 | Preposición de destino | to | a |
| R9 | Preposición posesiva | of | de |
| R10 | Cuantificador XOR | exactly one of | exactamente uno de |
| R11 | Cuantificador OR | at least one of | al menos uno de |
| R12 | Condicional | if … exists | si … existe |
| R13 | Consecuencia | in which case | en cuyo caso |
| R14 | Alternativa | otherwise / else | de lo contrario |
| R15 | Pasiva refleja | is consumed / is skipped | se consume / se omite |
| R16 | Ruta | Following path | Por ruta |
| R17 | Artículo en instanciación | is an instance of | es una instancia de |
| R18 | Artículo en especialización (sg.) | is a | es un/una |
| R19 | Secuencia | in that sequence | en esa secuencia |
| R20 | Designación de estado | is initial / is final / is default / is declared current | es inicial / es final / es por defecto / es declarado `Current` |
| R21 | Nombres de entidad | (sin cambio) | (sin cambio) |

- Referencia SSOT: `opm-opl-es.md` §15
- Aplicación en código: parser/generador bidireccional.

### R-3318: Orden OPL sigue orden de navegación

- Enunciado: la secuencia de párrafos OPL sigue en general el orden de navegación del árbol, comenzando desde `SD`. Ese orden puede proyectarse desde el layout del padre, pero NO sustituye la identidad persistente del OPD.
- Referencia SSOT: `opm-iso-19450-es.md` §OPL del sistema completo
- Aplicación en código: generador recorre en pre-orden.

### R-3319: OPL del sistema completo

- Enunciado: el OPL del sistema completo es la especificación textual total obtenida al recorrer el árbol OPD y concatenar los párrafos OPL locales en orden de navegación. En modelos compuestos, cada modelo individual conserva su OPL local autocontenido.
- Referencia SSOT: `opm-iso-19450-es.md` §OPL del sistema completo

### R-3320: Preservar frontera cross-model

- Enunciado: en modelos compuestos, la especificación textual global NO debe inferirse únicamente desde la navegación visible del árbol OPD. DEBE conservar explícitamente la frontera entre modelos individuales y el vínculo entre etiqueta visible de OPD e identificador persistente.
- Referencia SSOT: `opm-opl-es.md` §18.2
- Aplicación en código: OPL emitir declaraciones CM1..CM3 para transiciones.

### R-3321: Identificador persistente en OPL

- Enunciado: toda oración de refinamiento entre OPDs DEBE mapearse a un identificador persistente recuperable en la serialización del modelo (URI, handle persistente).
- Referencia SSOT: `opm-opl-es.md` §10.3
- Aplicación en código: serialización incluye tanto etiqueta `SDx.y` como ID persistente.

### R-3322: Reglas de soporte de herramienta multilingüe

- Enunciado: una herramienta OPM multilingüe DEBERÍA:
  1. Elegir idioma OPL a nivel de usuario/modelo sin alterar el OPD
  2. Mostrar todas las sentencias o solo las de esencia no predeterminada
  3. Alternar numeración y proyección de rótulos computacionales sin afectar la semántica OPL
  4. Regenerar el párrafo OPL completo al cambiar idioma
  5. Asociar cada referencia visible a OPD (`SD`, `SD1`, ...) con un identificador persistente
  6. Mantener OPL local autocontenido por modelo individual cuando existan sub-modelos
  7. Emitir composición inter-modelo mediante oraciones explícitas o metadatos equivalentes
  8. Preservar frontera propietario/consumidor cuando una cosa aparezca como referencia externa
- Referencia SSOT: `opm-opl-es.md` §18.2
- Aplicación en código: features listadas como objetivos de producto.

### R-3323: Frase de cambio entrada-salida

- Enunciado: la frase de cambio de estado tiene las variantes:
  - `**Objeto** de **estado-entrada** a **estado-salida**` (TS3)
  - `**Objeto** de **estado-entrada**` (TS4)
  - `**Objeto** a **estado-salida**` (TS5)
- Referencia SSOT: `opm-opl-es.md` §4.2, Apéndice A §A.5

### R-3324: Auto-invocación — "se invoca a sí mismo"

- Enunciado: la auto-invocación usa la expresión canónica `*Proceso* se invoca a sí mismo.`
- Referencia SSOT: `opm-opl-es.md` §8.2 IV2

### R-3325: Sub-modelos anidados

- Enunciado: los sub-modelos PUEDEN anidarse recursivamente. Cada nivel declara sus referencias CM1..CM3 con identificadores persistentes distintos.
- Referencia SSOT: `metodologia-opm-es.md` §8.2
- Aplicación en código: árbol de sub-modelos con profundidad arbitraria.

### R-3326: Patrón de descomposición asincrónica

- Enunciado: para descomposición asincrónica (V-59), la plantilla equivalente es descomposición + enlaces de evento:
  - `*Proceso* se descompone en *P1*, *P2* y *P3*.` (sin "en esa secuencia")
  - `*P1* ocurre si **Objeto** está en \`s1\`, ...`
  - `*P2* ocurre si **Objeto** está en \`s2\`, ...`
- Referencia SSOT: implícito por V-59
- Aplicación en código: ausencia de "en esa secuencia" señala asincrónico.

### R-3327: OPL plano (flat-model)

- Enunciado: una herramienta puede generar el OPL plano concatenando párrafos en orden de navegación, eliminando sentencias duplicadas.
- Referencia SSOT: `metodologia-opm-es.md` §8.2 "OPD Último"
- Aplicación en código: opción de export.

## Checklist

- [ ] Plantillas CX1–CX8 implementadas
- [ ] Plantillas CM1–CM3 para composición inter-modelo
- [ ] AND implícito (sentencias separadas)
- [ ] XOR con "exactamente uno de"
- [ ] OR con "al menos uno de"
- [ ] Evento/condición + XOR/OR combinados
- [ ] Probabilidades con Pr=p, suma 1
- [ ] Cardinalidades ?, *, +, (ninguno)
- [ ] Rangos con delimitadores [] ()
- [ ] Tipos canónicos en "es de tipo"
- [ ] Etiqueta de ruta "Por ruta X, ..."
- [ ] Valores de atributo como estados
- [ ] Reglas R1..R21 aplicadas por el generador/parser
- [ ] Orden OPL = orden de navegación del árbol
- [ ] OPL local autocontenido por modelo en compuestos
- [ ] Identificador persistente serializado junto con etiqueta visible
- [ ] Cambio de idioma por re-generación completa

## Antipatrones

- "Proceso se descompone en P1 y P2" sin "en esa secuencia" interpretado como secuencial
- Probabilidades que no suman 1
- OPL global que ignora fronteras de sub-modelos
- Usar `SDx.y` como identidad persistente
- Mezclar OPL-EN y OPL-ES sin habilitación explícita
- Orden OPL arbitrario (no basado en árbol)

## Referencias cruzadas

- Convenciones y D1..D13: `70-opl-convenciones-y-plantillas-cosa-estado.md`
- Procedimentales: `71-opl-plantillas-procedimentales.md`
- Estructurales: `72-opl-plantillas-estructurales.md`
- Refinamiento: `30-refinamiento-entre-opds.md`
- Sub-modelos: `42-sub-modelos-inter-modelo.md`
- Navegación e identidad: `40-navegacion-arbol-identidad.md`
- Operadores y multiplicidad: `16-modificadores-operadores.md`
