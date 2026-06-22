# 14 — Enlaces estructurales: fundamentales y etiquetados

**Alcance**: relaciones estructurales fundamentales (agregación, exhibición, generalización, clasificación), enlaces estructurales etiquetados (unidireccional, bidireccional, recíproco), topología interna del triángulo, dirección del vértice, herencia.
**Capa SSOT propietaria**: `opm-visual-es.md` §1.7, §8, §1.8 (indicadores auxiliares)
**Aplicación en la app**: `src/render/jointjs/markers.ts` (triángulos simples),
`src/render/jointjs/crear-triangulo-agg.ts` (agregación múltiple como nodo),
`src/render/jointjs/pass-enlaces.ts`, `src/render/jointjs/crear-link.ts`,
`src/nucleo/` (validación estructural).

## Reglas

### R-600: Los cuatro símbolos triangulares

- Enunciado: las cuatro relaciones estructurales fundamentales se distinguen por la **topología interna** del símbolo triangular:

| Símbolo topológico | Relación | Refinable → refinador |
|---|---|---|
| Triángulo con interior **completamente relleno** | Agregación-participación | Todo → Partes |
| Triángulo con **triángulo interior distinguible** | Exhibición-caracterización | Exhibidor → Rasgos |
| Triángulo **vacío** (sin interior distinguible) | Generalización-especialización | General → Especializaciones |
| Triángulo con **círculo interior distinguible** | Clasificación-instanciación | Clase → Instancias |

- Referencia SSOT: §1.7 (`opm-visual-es.md`), §8.2
- Aplicación en código: `markers.ts` define markers de enlaces simples;
  cuando una agregación tiene múltiples partes visibles,
  `pass-enlaces.ts` sintetiza un nodo `opm.TriangleAgg` con el mismo
  triángulo relleno y enlaces planos hacia las partes.
- Estado actual: deuda crítica — `exhibicion` comparte marker con `agregacion`. Ver `docs/design/archive/auditoria-ssot-visual-2026-04-23.md` §2.1 (V-128).

### R-601: V-3 — Vértice del triángulo apunta al refinable

- Enunciado: el vértice del triángulo siempre apunta hacia el **refinable** (todo, exhibidor, general, clase). La **base** conecta con los refinadores (partes, rasgos, especializaciones, instancias).
- Referencia SSOT: V-3 revisada
- Aplicación en código: si el marker estructural va en `marker-end` (vértice en destino), entonces el modelo DEBE representar:
  - agregación: `origen = refinador, destino = refinable` → vértice cae en el todo ✓
  - exhibición: `origen = refinador, destino = refinable` → vértice cae en el exhibidor ✓
  - generalización: `origen = refinador (especialización), destino = refinable (general)` → vértice cae en general ✓
  - clasificación: `origen = refinador (instancia), destino = refinable (clase)` → vértice cae en clase ✓
- Estado actual: deuda crítica — fixtures usan dirección mixta. Ver `docs/design/archive/auditoria-ssot-visual-2026-04-23.md` §2.2.
- Dos vías de resolución (requiere ADR):
  - (a) Normalizar fixtures a convención uniforme `origen=refinador, destino=refinable` e invertir markers
  - (b) Invertir markers estructurales en el renderer usando `marker-start`

### R-602: V-128 — Topología interna es canal normativo

- Enunciado: la presencia, ausencia o tipo de interior distinguible en el triángulo es un **canal normativo**. Una implementación NO es conforme si elimina, invierte o colapsa la decoración interior de exhibición o clasificación hasta volverlas indistinguibles de generalización.
- Referencia SSOT: V-128 (crítico)
- Aplicación en código: requiere marker compuesto vía `markup` de JointJS (dos paths anidados) o decoración mid-line con nodo virtual. No es representable con un único marker SVG estándar.
- Estado actual: deuda declarada en el código.

### R-603: V-129 — Líneas visibles obligatorias

- Enunciado: en un render canónico, todo triángulo estructural DEBE conectar por línea visible al menos con el refinable por el vértice y con un refinador por la base. Un triángulo sin líneas visibles en el canon-diagrama es divergente o debe tratarse como error de render.
- Referencia SSOT: V-129
- Aplicación en código: validador rechaza triángulos flotantes.

### R-604: V-130 — Triángulos auxiliares UI distinguibles

- Enunciado: si el canvas editable muestra triángulos auxiliares que desaparecen en export, esos triángulos son afordances UI y DEBEN distinguirse perceptualmente de los triángulos semánticos por **tamaño**, **color reservado a UI** o **ubicación fuera de la geometría del enlace**.
- Referencia SSOT: V-130
- Aplicación en código: handles de creación de enlace usan triángulo más pequeño o de color distinto.

### R-605: V-131 — Import preserva topología interna

- Enunciado: los símbolos estructurales importados desde otra implementación OPM DEBEN preservar, como mínimo, su **topología interna**. La retipificación cromática es admisible; la pérdida de interior distinguible NO lo es.
- Referencia SSOT: V-131
- Aplicación en código: importador de modelos externos valida topología; un triángulo ambiguo se rechaza o se marca como inválido.

### R-606: V-63 ampliada — Colores en decoraciones internas

- Enunciado: los colores son informativos también para las decoraciones internas de símbolos estructurales. Una implementación puede emplear azul, negro u otra paleta legible siempre que preserve **sin ambigüedad** la topología semántica.
- Referencia SSOT: V-63 ampliada
- Aplicación en código: el interior del triángulo puede ser cualquier color; la distinción es por **forma** (relleno / triángulo interior / vacío / círculo), no por color.

### R-607: Enlaces estructurales etiquetados

- Enunciado: las cuatro variantes de enlaces estructurales etiquetados son:

| Variante | Geometría | Decoración |
|---|---|---|
| Unidireccional | Línea con **punta abierta** en destino | Etiqueta itálica sobre la línea |
| Unidireccional sin etiqueta | Línea con punta abierta | Sin etiqueta (semántica por defecto: "se relaciona con") |
| Bidireccional | Línea con **arpones** en ambos extremos | Dos etiquetas (ida y vuelta) |
| Recíproco | Línea con arpones | Una sola etiqueta o sin etiqueta |

- Referencia SSOT: §8.1
- Aplicación en código: `markers.ts` define `MARKER_PUNTA_ABIERTA` y `MARKER_ARPON`.

### R-608: V-56 — Bidireccional con etiquetas iguales = recíproco

- Enunciado: un enlace bidireccional cuyas dos etiquetas son idénticas es semánticamente equivalente a un enlace recíproco con esa misma etiqueta. Ambas representaciones son intercambiables.
- Referencia SSOT: V-56
- Aplicación en código: el generador OPL emite la forma recíproca cuando detecta etiquetas idénticas.

### R-609: V-24 — Misma perseverancia en refinable y refinadores

- Enunciado: salvo en exhibición-caracterización, el refinable y los refinadores DEBEN tener la **misma perseverancia** (ambos objetos o ambos procesos).
- Referencia SSOT: V-24
- Aplicación en código: validador rechaza agregación/generalización/clasificación heterogénea.

### R-610: V-25 — Exhibición permite mixto objeto-proceso

- Enunciado: exhibición-caracterización es la única relación estructural que puede conectar objetos con procesos. El rasgo es **atributo** si es objeto y **operación** si es proceso.
- Referencia SSOT: V-25
- Aplicación en código: exhibición se trata como caso especial en el validador de homogeneidad.

### R-611: V-26 — Cuatro combinaciones exhibidor-rasgo válidas

- Enunciado: las cuatro combinaciones son válidas:
  - objeto exhibe atributo (objeto)
  - objeto exhibe operación (proceso)
  - proceso exhibe atributo (objeto)
  - proceso exhibe operación (proceso)
- Referencia SSOT: V-26
- Aplicación en código: admitir los cuatro casos.

### R-612: V-27 — Clasificación no distingue colección completa

- Enunciado: clasificación-instanciación NO distingue entre colección completa e incompleta (el número de instancias varía en operación).
- Referencia SSOT: V-27
- Aplicación en código: no se usa la barra horizontal bajo el triángulo para clasificación.

### R-613: V-57 — Partes transformables independientemente

- Enunciado: las partes de una agregación pueden ser consumidas, afectadas o producidas de forma independiente sin que el todo sea consumido, afectado o producido. Los enlaces transformadores pueden conectar subprocesos con partes individuales del todo.
- Referencia SSOT: V-57
- Aplicación en código: el validador no fuerza que una operación sobre el todo aplique a todas las partes.

### R-614: V-58 — Clase vs instancia — rangos vs valores

- Enunciado: en clasificación-instanciación:
  - la **clase** muestra atributos con rangos de valores (estados de rango como `120..240`)
  - la **instancia** muestra los mismos atributos con valores concretos (estados de valor como `185`)

La instancia se nombra con el formato `NombreInstancia : NombreClase`.

- Referencia SSOT: V-58
- Aplicación en código: el renderer distingue display de clase vs instancia.

### R-615: Indicador de colección incompleta

- Enunciado: cuando una agregación, exhibición o generalización tiene refinadores no mostrados, se indica con una **barra horizontal corta** bajo el triángulo.
- Referencia SSOT: §1.8, `opm-iso-19450-es.md` (colecciones incompletas)
- Aplicación en código: `crear-link.ts` dibuja el indicador como label
  bajo markers simples; `crear-triangulo-agg.ts` lo dibuja dentro del
  nodo `opm.TriangleAgg` cuando la agregación agrupada declara
  `incompleto`.

### R-616: Herencia — alcance de atributos

- Enunciado: las especializaciones heredan del general:
  - todas las partes (agregación)
  - todos los rasgos (exhibición)
  - todos los enlaces estructurales etiquetados
  - todos los enlaces procedimentales
- Referencia SSOT: §8.4, V-28 (herencia múltiple permitida)
- Aplicación en código: el kernel calcula herencia al resolver consultas de "¿qué enlaces tiene esta especialización?".

### R-617: V-28 — Herencia múltiple

- Enunciado: se permite herencia múltiple. Una especialización puede heredar de varios generales.
- Referencia SSOT: V-28
- Aplicación en código: el árbol de generalización admite DAG, no solo árbol.

### R-618: V-29 — Atributo discriminante

- Enunciado: un atributo discriminante restringe los valores válidos de un atributo para cada especialización. Cada especialización exhibe exactamente un valor del atributo discriminante.
- Referencia SSOT: V-29
- Ejemplo canónico:
  - **Vehículo** exhibe **Medio de Desplazamiento** (`tierra`, `aire`, `superficie acuática`)
  - **Auto** es un **Vehículo**, exhibe **Medio de Desplazamiento** en `tierra`
  - **Aeronave** es un **Vehículo**, exhibe **Medio de Desplazamiento** en `aire`
  - **Barco** es un **Vehículo**, exhibe **Medio de Desplazamiento** en `superficie acuática`

- Aplicación en código: el kernel soporta atributo discriminante con estado único por especialización.

### R-619: V-72 — Herencia aplica a través de refinamiento por despliegue

- Enunciado: cuando un general se despliega en especializaciones, cada especialización hereda automáticamente los enlaces del general en todos los OPDs donde participe.
- Referencia SSOT: V-72
- Aplicación en código: la vista de una especialización en cualquier OPD refleja enlaces heredados.

### R-620: V-73 — Enlaces heredados no visibles pero activos

- Enunciado: los enlaces heredados NO son visibles explícitamente en el OPD, pero aplican semánticamente. NO se dibujan líneas para enlaces heredados; su efecto se infiere del árbol de generalización-especialización.
- Referencia SSOT: V-73
- Aplicación en código: el renderer no duplica enlaces en especializaciones; el validador y el OPL los consideran.

### R-621: V-74 — Herencia de afiliación

- Enunciado: los atributos de objetos ambientales son automáticamente **ambientales**. Los procesos de entidades ambientales son **ambientales**. La afiliación se hereda por la cadena estructural.
- Referencia SSOT: V-74
- Aplicación en código: al agregar una parte/rasgo, el kernel propaga afiliación del contenedor salvo declaración explícita.

### R-622: V-75 — Sobreescritura

- Enunciado: una especialización puede reemplazar un participante heredado con una especialización diferente del mismo participante.
- Referencia SSOT: V-75
- Aplicación en código: el modelo admite `overrides` declarados por especialización.

### R-623: V-76 — Migración al crear general desde especializaciones

- Enunciado: al crear un general a partir de especializaciones existentes, los enlaces **comunes** a todas las especializaciones se mueven al general.
- Referencia SSOT: V-76
- Aplicación en código: operación "crear general" identifica enlaces comunes y los promueve.

### R-624: V-30 — Bidireccional y recíproco no admiten estado-solo-en-destino

- Enunciado: las variantes bidireccional y recíproco NO existen para el caso de estado solo en destino en enlaces etiquetados con estado especificado.
- Referencia SSOT: V-30
- Aplicación en código: validador rechaza combinación bidireccional/recíproco + estado-solo-en-destino.

## Checklist

- [ ] Cada una de las 4 relaciones fundamentales tiene marker único con topología interna distinguible
- [ ] Vértice del triángulo apunta al refinable
- [ ] Exhibición y clasificación tienen interior distinguible (triángulo interior / círculo)
- [ ] Triángulos conectan por línea visible a ambos extremos
- [ ] Agregación/generalización/clasificación homogéneas en perseverancia
- [ ] Exhibición admite las 4 combinaciones objeto/proceso × atributo/operación
- [ ] Punta abierta para etiquetados unidireccionales; arpones para bi/recíproco
- [ ] Bidireccional con etiquetas iguales se trata como recíproco
- [ ] Indicador de colección incompleta presente cuando aplica (no aplica a clasificación)
- [ ] Atributo discriminante asigna estado único por especialización
- [ ] Enlaces heredados no duplicados en OPD pero activos en validación
- [ ] Afiliación heredada del contenedor salvo override explícito

## Antipatrones

- Agregación y exhibición con el mismo marker (deuda actual)
- Vértice del triángulo cayendo en la parte en lugar del todo (deuda actual)
- Triángulo sin interior distinguible para exhibición (colisiona con generalización)
- Usar colores como único canal de distinción entre agregación y exhibición
- Dibujar enlaces heredados manualmente en cada especialización
- Clasificación-instanciación con barra de colección incompleta (no aplica)
- Agregación entre objeto y proceso (viola V-24)
- Bidireccional etiquetado con estado solo en destino

## Referencias cruzadas

- Decoraciones y markers: `12-enlaces-decoraciones-marcas.md`
- Familias canónicas: `13-enlaces-taxonomia-familias.md`
- Estado especificado: `15-enlaces-estado-especificado.md`
- Refinamiento: `30-refinamiento-entre-opds.md`
- Semi-plegado: `34-semi-plegado.md`
- OPL plantillas estructurales: `72-opl-plantillas-estructurales.md`
