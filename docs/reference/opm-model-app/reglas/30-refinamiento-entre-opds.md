# 30 — Refinamiento entre OPDs: descomposición, despliegue, contenedores, externos

**Alcance**: mecanismos de refinamiento canónicos (descomposición / in-zooming, despliegue / unfolding), fases de construcción del OPD hijo, contenedor del refinable, clasificación interno/externo, visibilidad de enlaces, prohibición de refinamiento cíclico.
**Capa SSOT propietaria**: `opm-visual-es.md` §10; `opm-iso-19450-es.md` §Gestión de contexto
**Aplicación en la app**: `src/render/layout/pass-refinable-envelope.ts`, `pass-zonas-externos.ts`, `src/render/jointjs/pass-embed-refinable.ts`.

## Reglas

### R-1100: Cuatro pares canónicos de refinamiento-abstracción

- Enunciado: la SSOT v2 reconoce cuatro pares canónicos de refinamiento-abstracción:

| Par | Refinamiento | Abstracción |
|---|---|---|
| Estados | Expresión de estados | Supresión de estados |
| Estructura | Despliegue (`unfolding`) | Plegado (`folding`) |
| Comportamiento | Descomposición (`in-zooming`) | Recomposición (`out-zooming`) |
| Composición inter-modelo | Sub-model referenciado | Desconexión de sub-model |

- Referencia SSOT: §10.1, V-242
- Aplicación en código: el modelo distingue los cuatro mecanismos.

### R-1101: V-242 — Sub-model como cuarto par canónico

- Enunciado: la composición inter-modelo por sub-model es un mecanismo de refinamiento **explícito**. Se añade a los tres mecanismos clásicos intra-modelo porque cruza la frontera del modelo OPM como unidad de serialización, introduce identidad persistente de vínculo y requiere gobernanza propia documentada en §23.
- Referencia SSOT: V-242
- Aplicación en código: `src/persistencia/` soporta referencias a sub-modelos como mecanismo de primer orden.
- Ver detalle: `42-sub-modelos-inter-modelo.md`.

### R-1102: V-243 — Operadores derivados no son refinamiento

- Enunciado: operaciones como `bring connected things`, `bring links between selected entities` o equivalentes son **operadores derivados** que materializan enlaces o cosas ya existentes en el modelo sobre un OPD distinto. NO constituyen mecanismos de refinamiento ontológico.
- Referencia SSOT: V-243
- Aplicación en código: Bring NO crea cosas nuevas; solo materializa apariencias.
- Ver: `64-operaciones-auxiliares-bring.md`.

### R-1103: Despliegue intradiagrama

- Enunciado: en despliegue intradiagrama, el refinable y los refinadores **comparten OPD**, unidos por enlaces estructurales fundamentales.
- Referencia SSOT: §10.2
- Aplicación en código: agregación/exhibición/generalización/clasificación visibles en mismo OPD; sin OPD hijo.

### R-1104: V-70 — Despliegue intradiagrama NO produce contorno grueso

- Enunciado: el despliegue en el mismo diagrama NO produce contorno grueso, porque el refinable y los refinadores comparten OPD.
- Referencia SSOT: V-70
- Aplicación en código: `crear-cosa.ts` chequea si el despliegue crea OPD hijo antes de aplicar `strokeWidth=3`.

### R-1105: V-33 — Contorno grueso en descomposición a nuevo OPD

- Enunciado: el refinable aparece con contorno grueso tanto en el OPD padre como en el OPD hijo.
- Referencia SSOT: V-33
- Aplicación en código: al crear OPD hijo por in-zooming, propagar `esRefinable=true` a ambas apariencias.

### R-1106: V-69 — Contorno grueso también para despliegue en nuevo OPD

- Enunciado: el contorno grueso aplica a **in-zooming** y a **unfolding** cuando ambos producen OPD hijo. Ambos tipos de refinamiento producen contorno grueso en el refinable.
- Referencia SSOT: V-69
- Aplicación en código: mismo tratamiento para ambos mecanismos.

### R-1107: V-62 — Descomposición en dos fases

- Enunciado: la descomposición en nuevo diagrama se ejecuta en dos fases:
  1. **Mostrar Contenido** — muestra el contenido interno del refinable, produciendo un OPD semidescompuesto
  2. **Refinar Enlaces** — refina los enlaces del OPD padre distribuyéndolos a los subprocesos, produciendo el OPD hijo (SDn+1)

La recomposición (`out-zooming`) es el inverso:
  1. **Abstraer Enlaces** — abstrae los enlaces de los subprocesos
  2. **Ocultar Contenido** — oculta el contenido interno, restaurando el OPD padre (SDn)

- Referencia SSOT: V-62
- Aplicación en código: el flujo de in-zooming/out-zooming implementa ambas fases como transformaciones distinguibles.

### R-1108: V-79 — Refinable como contenedor

- Enunciado: en el OPD hijo, la cosa refinada aparece como **contenedor** (elemento interno):
  - en descomposición de proceso: elipse agrandada que contiene subprocesos
  - en descomposición de objeto: rectángulo agrandado que contiene componentes

- Referencia SSOT: V-79
- Aplicación en código: `pass-embed-refinable.ts` embebe subprocesos dentro del refinable; `pass-refinable-envelope.ts` calcula el envelope.

### R-1109: V-80 — Cosas conectadas como elementos externos

- Enunciado: las cosas conectadas al refinado vía enlaces en el OPD padre se **copian como elementos externos** en el OPD hijo. Un elemento externo mantiene sus propiedades (esencia, contorno, estados) pero su posición se recalcula.
- Referencia SSOT: V-80
- Aplicación en código: `pass-zonas-externos.ts` ubica externos en anillo alrededor del refinable.

### R-1110: V-81 — Descomposición copia todas las conectadas

- Enunciado: en la descomposición, se copian al OPD hijo **todas** las cosas conectadas vía cualquier enlace a la cosa refinada que tengan apariencia en el OPD padre.
- Referencia SSOT: V-81
- Aplicación en código: al crear SDn+1, iterar sobre enlaces del padre y materializar todas las contrapartes.

### R-1111: V-82 — Despliegue copia solo hijos estructurales directos

- Enunciado: en el despliegue, se copian al OPD hijo **solo** los hijos estructurales directos (destinos de agregación y exhibición).
- Referencia SSOT: V-82
- Aplicación en código: distinción en la lógica de construcción del OPD hijo según mecanismo.

### R-1112: V-83 — Elementos externos no se refinan

- Enunciado: NO se puede refinar un elemento externo (apariencia con `interno=false`). Solo el **contenedor** es refinable en su propio OPD hijo.
- Referencia SSOT: V-83
- Aplicación en código: la UI de refinamiento se desactiva para cosas marcadas como externas.

### R-1113: V-84 — Cascada al eliminar refinable

- Enunciado: objetos internos — creados dentro de una descomposición, sin apariencia en el OPD padre — se eliminan cuando el proceso padre se elimina (cascada). La eliminación de la cosa refinada elimina el OPD hijo y todos sus contenidos.
- Referencia SSOT: V-84
- Aplicación en código: al eliminar el refinable, cascada sobre el OPD hijo y sus objetos internos.

### R-1114: V-85 — Objetos externos existen independientemente

- Enunciado: objetos externos — creados en el SD u otro OPD superior — existen independientemente del refinamiento y son referenciables desde cualquier OPD del modelo.
- Referencia SSOT: V-85
- Aplicación en código: el alcance de un objeto NO cambia por ubicación visual; reposicionar un objeto dentro de un proceso inflado NO lo convierte en interno.

### R-1115: V-34 — Elipse del proceso refinable agrandada

- Enunciado: la elipse del proceso refinable se agranda para contener los subprocesos como elipses menores.
- Referencia SSOT: V-34
- Aplicación en código: `pass-refinable-envelope.ts` calcula el tamaño de la elipse inflada.

### R-1116: Descomposición de objeto

- Enunciado: el rectángulo del objeto refinable se agranda para mostrar objetos constituyentes. La posición espacial de los constituyentes puede tener significado semántico (V-78).
- Referencia SSOT: §10.5
- Aplicación en código: distinción entre descomposición de objeto (layout espacial) y de proceso (layout temporal).

### R-1117: V-91 — Enlaces estructurales visibles en OPD hijo

- Enunciado: los enlaces **estructurales** al contenedor son visibles en el OPD hijo; definen la estructura del despliegue o descomposición.
- Referencia SSOT: V-91
- Aplicación en código: renderer preserva triángulos estructurales en OPD hijo.

### R-1118: V-92 — Enlaces procedimentales NO visibles directamente

- Enunciado: los enlaces **procedimentales** al contenedor NO son visibles directamente en el OPD hijo — se **distribuyen** a subprocesos (§11) o se filtran.
- Referencia SSOT: V-92
- Aplicación en código: ver `31-distribucion-enlaces-descomposicion.md`.

### R-1119: V-93 — Enlaces entre internos visibles

- Enunciado: los enlaces entre elementos internos del OPD hijo son visibles normalmente.
- Referencia SSOT: V-93

### R-1120: V-94 — Enlaces irrelevantes invisibles

- Enunciado: los enlaces que NO tocan el contenedor ni ningún elemento interno del OPD hijo son invisibles en ese OPD.
- Referencia SSOT: V-94
- Aplicación en código: filtro de enlaces visibles por OPD.

### R-1121: V-100 — Prohibición de refinamiento cíclico

- Enunciado: NO se puede refinar una cosa desde dentro de su propio árbol de refinamiento. El chequeo es **transitivo**: se verifica toda la cadena de ancestros del OPD. Esto previene loops infinitos en la jerarquía de OPDs.
- Referencia SSOT: V-100
- Aplicación en código: validador rechaza in-zooming de una cosa que ya aparece en la cadena ancestral del OPD.

### R-1122: V-101 — Instancia visual ≠ instancia lógica

- Enunciado: una **instancia visual** es la misma entidad del modelo mostrada en un OPD diferente (misma identidad, diferente vista). Una **instancia lógica** es una relación de clasificación o herencia (entidad diferente).
- Referencia SSOT: V-101
- Aplicación en código: duplicar apariencia ≠ crear especialización.

### R-1123: V-102 — No instancia visual entre tipos distintos

- Enunciado: NO se puede crear una instancia visual entre tipos diferentes: un objeto no puede ser instancia visual de un proceso, ni viceversa.
- Referencia SSOT: V-102
- Aplicación en código: validador rechaza esta operación.

### R-1124: V-116 — Semi-plegado

- Enunciado: en una relación de agregación-participación, los refinadores (partes) pueden mostrarse como **íconos de triángulo con el nombre de la parte** dentro del rectángulo del todo, en lugar de entidades separadas conectadas por enlaces estructurales explícitos.
- Referencia SSOT: V-116
- Aplicación en código: ver `34-semi-plegado.md` para detalles.

### R-1125: Alcance interior vs exterior del objeto

- Enunciado: un objeto creado dentro de un proceso descompuesto (objeto interior) existe solo en el alcance de ese proceso y se elimina si el proceso padre se elimina. Un objeto creado a nivel SD (objeto exterior) existe independientemente.
- Referencia SSOT: `metodologia-opm-es.md` §7.3
- Aplicación en código: el alcance se decide al crear el objeto, no por reposicionamiento.

### R-1126: Heurística de profundidad

- Enunciado: si un OPD de nivel N NO agrega transformados, estados ni enlaces nuevos al modelo respecto de su padre, la refinación es probablemente **innecesaria**.
- Referencia SSOT: `metodologia-opm-es.md` §8.1
- Aplicación en código: warning `MEDIA` cuando un OPD hijo no agrega contenido semántico.

### R-1127: Refinamiento dual (ramas hermanas)

- Enunciado: un SD PUEDE tener ramas hermanas de **distinto tipo** de refinamiento. Ejemplo: SD1 como descomposición del proceso principal y SD2 como despliegue del objeto sistema. Ambos son refinamientos del mismo SD pero exploran dimensiones ortogonales.
- Referencia SSOT: `metodologia-opm-es.md` §8.1
- Aplicación en código: árbol OPD admite hermanos con mecanismos distintos.

### R-1128: Semi-plegado por apariencia

- Enunciado: el estado de semi-plegado es **por apariencia** (por OPD): un objeto puede estar semi-plegado en un OPD y completamente desplegado en otro.
- Referencia SSOT: V-119
- Aplicación en código: `apariencias[cosa][opd].semiPlegado: boolean`.

### R-1129: Descomposición síncrona vs despliegue asíncrono

- Enunciado: la descomposición de un proceso es **síncrona**: el proceso padre espera a que todos los subprocesos completen antes de devolver control. El despliegue de una relación estructural es **asíncrono** respecto del flujo de control del proceso: revela estructura estática sin implicar secuenciación temporal.
- Referencia SSOT: `opm-iso-19450-es.md` §Gestión de contexto
- Aplicación en código: el motor aplica sincronía solo a descomposición.

### R-1130: Procedimiento de elaboración progresiva

- Enunciado: la construcción de SD1 DEBERÍA seguir esta secuencia (ver también R-1020):
  1. Inflar el proceso principal (contorno grueso en padre e hijo)
  2. Agregar subprocesos (mínimo 2) según línea de tiempo
  3. Renombrar con nombres de dominio significativos
  4. Traer elementos externos conectados al proceso padre
  5. Crear objetos internos
  6. Agregar estados a objetos que participan en transformaciones
  7. Crear enlaces internos entre subprocesos y objetos
- Referencia SSOT: `metodologia-opm-es.md` §7.1

### R-1131: Descomposición en mismo diagrama vs nuevo

- Enunciado: dos variantes operativas:
  - **En mismo diagrama**: el refinable aparece descompuesto en el mismo OPD (no se crea OPD nuevo). Usar cuando el OPD tiene espacio suficiente y pocos subprocesos.
  - **En diagrama nuevo**: nuevo OPD descendiente; refinable con contorno grueso en ambos OPDs. Caso prevalente.
- Referencia SSOT: `metodologia-opm-es.md` §7.1
- Aplicación en código: la herramienta permite elegir; default = en diagrama nuevo.

### R-1132: Ordenabilidad de partes tras descomposición

- Enunciado: cuando un proceso se descompone, sus subprocesos = partes (agregación-participación + ordenabilidad positiva), y los objetos que el proceso exhibe (vía exhibición-caracterización) = atributos del proceso.
- Referencia SSOT: `metodologia-opm-es.md` §7.1 "Identidad semántica de la descomposición"
- Aplicación en código: el modelo proyecta subprocesos como partes agregadas al hacer descomposición.

## Checklist

- [ ] Los cuatro mecanismos de refinamiento distinguibles en el modelo
- [ ] Sub-model tratado como mecanismo primario
- [ ] Contorno grueso en padre e hijo para in-zooming y unfolding a OPD hijo
- [ ] Despliegue intradiagrama NO produce contorno grueso
- [ ] OPD hijo en dos fases: Mostrar Contenido + Refinar Enlaces
- [ ] Refinable = contenedor en OPD hijo
- [ ] Cosas conectadas → elementos externos en OPD hijo
- [ ] Elementos externos no se pueden refinar
- [ ] Cascada al eliminar refinable: OPD hijo + internos
- [ ] Objetos externos siguen existiendo tras eliminar padre
- [ ] Enlaces estructurales visibles en OPD hijo; procedimentales distribuidos
- [ ] Prohibición de refinamiento cíclico (transitiva)
- [ ] Instancia visual ≠ instancia lógica; no entre tipos distintos
- [ ] Semi-plegado admitido como variante
- [ ] Alcance interior/exterior decidido al crear, no por posición
- [ ] Descomposición de proceso es síncrona; despliegue estructural es asíncrono
- [ ] Ramas hermanas pueden usar mecanismos distintos
- [ ] Mínimo 2 refinadores por refinamiento

## Antipatrones

- Refinar un elemento externo dentro de un OPD donde no es propietario
- Mover un objeto externo dentro del envelope y creer que lo vuelve interno
- Refinamiento cíclico (in-zoom de una cosa que ya aparece en ancestros)
- Despliegue intradiagrama con contorno grueso (confunde con refinamiento a OPD hijo)
- OPD hijo vacío (sin contenido semántico nuevo)
- Descomposición de objeto con orden temporal inferido

## Referencias cruzadas

- Primitivas (contorno grueso): `10-primitivas-cosas.md`
- Distribución de enlaces: `31-distribucion-enlaces-descomposicion.md`
- Precedencia en recomposición: `32-precedencia-recomposicion.md`
- Supresión/expresión de estados: `33-supresion-expresion-estados.md`
- Semi-plegado: `34-semi-plegado.md`
- Propiedades invariantes: `35-invariantes-entre-niveles.md`
- Sub-modelos: `42-sub-modelos-inter-modelo.md`
- Navegación: `40-navegacion-arbol-identidad.md`
- Metodología SD1: `81-metodologia-sd1-descomposicion.md`
