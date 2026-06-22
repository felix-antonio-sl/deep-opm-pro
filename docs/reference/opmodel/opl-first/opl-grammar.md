# OPL Grammar — Canonical Input Subset (Phase 0 / Phase 1)

| Campo | Valor |
|-------|-------|
| Fecha | 2026-04-06 |
| Estado | Initial working subset |
| Scope | Parser foundation only |

## Propósito

Definir el primer subconjunto canónico del OPL aceptado como input.
Este subset está alineado con el output actual de `render()` / `renderAll()` y sirve para implementar el parser inicial con blast radius bajo.

## SSOT obligatoria

Este documento debe leerse junto con el corpus expuesto en:

- [`../ssot/opm-ssot`](../ssot/opm-ssot)

Orden de precedencia:

1. `opm-iso-19450.md`
2. `opm-opl-es.md`
3. `metodologia-modelamiento-opm.md`

## Principios

1. **Canon first**: se acepta primero lo que `render()` ya produce hoy.
2. **Line-oriented**: una sentencia OPL por línea.
3. **Section-oriented**: `renderAll()` organiza por secciones `=== OPD ===`.
4. **Parser incremental**: soportar subset pequeño primero, luego ampliar.
5. **No layout in OPL**: posiciones, tamaños y estilos quedan fuera del lenguaje de autoría.

## Nivel de entrada soportado en esta fase

Este primer subset acepta sentencias canónicas en **inglés** y en **español**, alineadas con:

1. `opm-iso-19450.md` — superficie OPL-EN normativa
2. `opm-opl-es.md` — sustitución de terminales léxicos para OPL-ES

### Estructura de archivo

```text
=== SD ===
Water is an object, physical.
Water can be cold or hot.
State cold of Water is initial and default.
Boiling is a process, physical.
Boiling requires 5min.
Barista handles Boiling.
Boiling changes Water from cold to hot.
```

```text
=== SD ===
Agua es un objeto, físico.
Agua puede estar fría o caliente.
Estado fría de Agua es inicial y por defecto.
Hervir es un proceso, físico.
Hervir requiere 5min.
Barista maneja Hervir.
Hervir cambia Agua de fría a caliente.
```

## Sentencias soportadas

### 1. Section header

```text
=== SD ===
=== SD1 ===
=== Some OPD Name ===
```

Forma:

```ebnf
section-header = "=== ", opd-name, " ===" ;
opd-name       = text ;
```

### 2. Thing declaration

```text
Water is an object, physical.
Boiling is a process, physical.
Cup is an object, physical, environmental.
```

```text
Agua es un objeto, físico.
Hervir es un proceso, físico.
Taza es un objeto, físico, ambiental.
```

Forma:

```ebnf
thing-declaration = name, " is ", article, kind, [ qualifiers ], "." ;
article           = "a " | "an " ;
kind              = "object" | "process" ;
qualifiers        = { ", ", qualifier } ;
qualifier         = essence | affiliation | perseverance ;
essence           = "physical" | "informatical" ;
affiliation       = "systemic" | "environmental" ;
perseverance      = "dynamic" ;
```

### 3. State enumeration

```text
Water can be cold or hot.
Coffee can be ready, warm, or unmade.
```

```text
Agua puede estar fría o caliente.
Café puede estar listo, tibio o sin preparar.
```

Forma:

```ebnf
state-enumeration = thing-name, " can be ", state-list, "." ;
state-list        = state-name, { ", ", state-name }, [ " or ", state-name ] ;
```

### 4. State description

```text
State cold of Water is initial and default.
State ready of Coffee is final.
```

```text
Estado fría de Agua es inicial y por defecto.
Estado listo de Café es final.
```

Forma:

```ebnf
state-description = "State ", state-name, " of ", thing-name, " is ", qualifiers, "." ;
qualifiers        = qualifier, { " and ", qualifier } ;
qualifier         = "initial" | "final" | "default" ;
```

### 5. Duration

```text
Boiling requires 5min.
Coffee Making requires 120s.
```

```text
Hervir requiere 5min.
Preparar Café requiere 120s.
```

Forma:

```ebnf
duration = thing-name, " requires ", number, time-unit, "." ;
time-unit = "ms" | "s" | "min" | "h" | "d" ;
```

### 6. Links — subset inicial

#### agent
```text
Barista handles Boiling.
Barista maneja Hervir.
```

#### instrument
```text
Boiling requires Coffee Machine.
Hervir requiere Máquina de Café.
```

#### consumption
```text
Brewing consumes Ground Coffee.
Brewing consumes hot Water.
Preparar consume Café Molido.
Preparar consume Agua en caliente.
```

#### result
```text
Grinding yields Ground Coffee.
Brewing yields ready Coffee.
Moler genera Café Molido.
Preparar genera Café en listo.
```

#### effect
```text
Boiling changes Water from cold to hot.
Process changes Object from old.
Process changes Object to new.
Hervir cambia Agua de fría a caliente.
Proceso cambia Objeto de viejo.
Proceso cambia Objeto a nuevo.
```

## Constructos explícitamente fuera de scope en esta fase

- grouped structural (`consists of`, `exhibits`, `instances of`)
- modifiers
- fan sentences
- in-zoom sequence
- requirement/assertion/scenario
- refinement edge labels (`SD is refined by ...`)
- Spanish input (`locale = es`)
- layout hints
- metadata/settings en OPL

## Canonicalización

La forma canónica del lenguaje es el output de `render()`.

Objetivo de round-trip para este subset:

```text
canonical OPL -> parse -> OplDocument -> render -> canonical OPL
```

## IDs en el parser

Como el OPL no trae IDs, el parser genera IDs sintéticos estables basados en nombres:

- things: `thing-${slug(name)}`
- states: `state-${slug(thingName)}-${slug(stateName)}`
- links: `link-${counter}`

Estos IDs son provisionales y sirven para el AST parseado y el futuro compiler.

## Notas de implementación

- El parser actual detecta idioma por terminales léxicos principales.
- La forma canónica sigue siendo la que genera `render()` para cada locale.
- Este documento define el subset inicial; no pretende cubrir todavía todo ISO/OPL-ES.

## TODO siguientes fases

1. structural sentences
2. modifiers
3. fan
4. in-zoom / refinement
5. requirement/assertion/scenario
6. Spanish input
7. source-aware diagnostics más ricos
