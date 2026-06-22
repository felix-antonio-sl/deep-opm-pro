# 70 — OPL-ES: convenciones y plantillas de cosas/estados

**Alcance**: decisiones de diseño de OPL-ES, convenciones tipográficas Markdown, denominación de procesos/objetos/estados, plantillas D1..D13 (descripción de entidades), política de Ser vs Estar, género gramatical, compatibilidad EN↔ES.
**Capa SSOT propietaria**: `opm-opl-es.md` §1–§3
**Aplicación en la app**: `src/render/opl-renderer.ts`, validador de nombres.

## Reglas

### R-3000: Denominación de procesos — infinitivo o nominalización

- Enunciado: un nombre de proceso OPL-ES válido cumple al menos una de estas condiciones:
  1. La primera palabra está en **infinitivo** y termina en `-ar`, `-er` o `-ir`
  2. La primera palabra termina en **`-ción`**
  3. En dominios que lo justifiquen, la primera palabra termina en **`-miento`**
- Referencia SSOT: `opm-opl-es.md` §1.1
- Aplicación en código: validador de nombre de proceso con regex.
- Ejemplos válidos: "Procesar Datos", "Preparar Empanadas", "Ampliación de Cobertura", "Verificación de Identidad", "Mantenimiento Preventivo".

### R-3001: Patrones de nombre de proceso (paralelos a EN)

- Enunciado:

| Patrón EN | Ejemplo EN | Patrón ES | Ejemplo ES |
|---|---|---|---|
| verb-ing | Making | Infinitivo o nominalización | Hacer / Fabricación |
| noun verb-ing | Cake Making | Infinitivo sustantivo o nominalización | Preparar Torta / Preparación de Torta |
| adj verb-ing | Automatic Responding | Infinitivo + adverbio o nominalización | Responder Automáticamente / Respuesta Automática |
| adj noun verb-ing | Automatic Crash Responding | Infinitivo complejo o nominalización | Responder a Colisión Automáticamente / Atención Automática de Colisión |

- Referencia SSOT: `opm-opl-es.md` §1.1
- Aplicación en código: generador OPL acepta ambas formas; normalizar solo con política declarada.

### R-3002: Longitud de nombre

- Enunciado: preferentemente entre 2 y 4 palabras. Se aceptan nombres más largos cuando el dominio lo exige y no introducen ambigüedad. Se capitalizan las palabras léxicas; artículos y preposiciones breves PUEDEN permanecer en minúscula cuando mejora la naturalidad.
- Referencia SSOT: `opm-opl-es.md` §1.1
- Aplicación en código: warning si nombre > 6 palabras.

### R-3003: Denominación de objetos — singular con sufijo de colectivo

- Enunciado: los objetos son sustantivos singulares con capitalización en las palabras léxicas. Plurales:
  - sufijo **"Conjunto"** para inanimados (EN: "Set")
  - sufijo **"Grupo"** para humanos (EN: "Group")
- Referencia SSOT: `opm-opl-es.md` §1.2
- Aplicación en código: validador emite warning si un nombre de objeto es plural explícito.
- Ejemplos: **Ingrediente**, **Conjunto de Ingredientes**, **Grupo de Comensales**, **Torta de Manzana**.

### R-3004: Denominación de estados — minúsculas

- Enunciado: los estados usan minúsculas, forma pasiva o descriptiva del objeto que los contiene.
- Referencia SSOT: `opm-opl-es.md` §1.3
- Aplicación en código: validador advierte si estado inicia con mayúscula.
- Ejemplos: `pintado`, `inspeccionado`, `pre-cortado`, `vacío`, `cargado`, `satisfecho`.

### R-3005: Género gramatical — masculino por defecto

- Enunciado: las plantillas usan masculino como género por defecto. El modelador ajusta al género natural del sustantivo en instancias concretas. El género afecta artículos y participios pero NO la estructura de la sentencia.
- Referencia SSOT: `opm-opl-es.md` §1.4
- Aplicación en código: plantillas parametrizables por género.
- Ejemplo: "es un **Sistema**" (masc.) → "es una **Máquina**" (fem.).

### R-3006: Ser vs Estar — distinción semántica

- Enunciado:
  - **estar** para estados de objetos (condición temporal, mutable): "**Objeto** está en `estado`"
  - **ser** para propiedades invariantes (tipo, clasificación, esencia): "**Objeto** es de tipo X", "**X** es un **Y**"
- Referencia SSOT: `opm-opl-es.md` §1.5
- Aplicación en código: plantillas distinguen los verbos según contexto.

### R-3007: Artículos y preposiciones

- Enunciado: OPL-ES omite artículos en las sentencias salvo donde la gramática los requiere:
  - "es un/una" en clasificación-instanciación y especialización individual
  - "de lo contrario" en condiciones
  - "al menos" en operadores lógicos y cardinalidades

Preposición "a" personal: omitida para objetos directos, ya que las entidades OPM son típicamente inanimadas.

- Referencia SSOT: `opm-opl-es.md` §1.6
- Aplicación en código: generador OPL omite artículos en sujetos/objetos directos.
- Ejemplo: "*Cocinar* consume **Masa**" (NO "consume a Masa").

### R-3008: Convenciones tipográficas Markdown

- Enunciado:

| Entidad | Convención | Ejemplo |
|---|---|---|
| Objeto | **negrita** | **Ingrediente** |
| Proceso | *cursiva* | *Cocinar* |
| Estado | `monoespaciado` | `crudo` |

Estas convenciones aplican a la representación textual en Markdown. Los colores, contornos, sombreados del OPD NO forman parte del contrato OPL-ES.

- Referencia SSOT: `opm-opl-es.md` §1.7
- Aplicación en código: `opl-renderer.ts` aplica Markdown strict.

### R-3009: Orden canónico sujeto-verbo-complemento

- Enunciado: OPL-ES preserva el orden SVC de cada plantilla OPL-EN. NO se reordena la oración. Esto garantiza correspondencia estructural estable entre ambas superficies.
- Referencia SSOT: `opm-opl-es.md` §1.8
- Aplicación en código: las plantillas no permutan sujeto y complemento.

### R-3010: Posición del estado especificado

- Enunciado: en OPL-EN el estado precede al objeto como modificador (`specified-state Object`). En OPL-ES el estado **sigue** al objeto con la preposición "en": **Objeto** en `estado`.
- Referencia SSOT: `opm-opl-es.md` §1.9
- Ejemplo:
  - EN: `active User handles Processing.`
  - ES: **Usuario** en `activo` maneja *Procesar*.

### R-3011: Voz pasiva refleja

- Enunciado: OPL-ES usa la **pasiva refleja** ("se consume", "se omite") en lugar de la pasiva perifrástica ("es consumido"), por naturalidad y concisión.
- Referencia SSOT: `opm-opl-es.md` §1.10
- Aplicación en código: plantillas emiten "se X" consistentemente.

### R-3012: Plantillas D1..D13 — descripción de entidades

- Enunciado:

**Propiedades genéricas:**

| ID | OPL-EN | OPL-ES |
|---|---|---|
| D1 | Thing is Physical. | **Cosa** es física. |
| D2 | Thing is Informatical. | **Cosa** es informacional. |
| D3 | Thing is Environmental. | **Cosa** es ambiental. |
| D4 | Thing is Systemic. | **Cosa** es sistémica. |
| D11 | Thing is Persistent. | **Cosa** es persistente. |
| D12 | Thing is Transient. | **Cosa** es transitoria. |

**Enumeración de estados:**

| ID | OPL-EN | OPL-ES |
|---|---|---|
| D5 | Object can be state1, state2, or state3. | **Objeto** puede estar `estado1`, `estado2` o `estado3`. |
| D6 | Object can be state1, …, and other states. | **Objeto** puede estar `estado1`, …, y otros estados. |

**Designación de estados:**

| ID | OPL-EN | OPL-ES |
|---|---|---|
| D7 | State s of Object is initial. | Estado `s` de **Objeto** es inicial. |
| D8 | State s of Object is final. | Estado `s` de **Objeto** es final. |
| D9 | State s of Object is default. | Estado `s` de **Objeto** es por defecto. |
| D10 | State s of Object is initial and final. | Estado `s` de **Objeto** es inicial y final. |
| D13 | State s of Object is declared current. | Estado `s` de **Objeto** es declarado `Current`. |

- Referencia SSOT: `opm-opl-es.md` §3.1–§3.3
- Aplicación en código: generador OPL emite exactamente estas formas.

### R-3013: Procesos persistentes con plantilla de cambio

- Enunciado: un proceso persistente puede declararse como oración de cambio con **estado de entrada = estado de salida**:
  - `*Mantener Presión* cambia **Tanque** de \`presurizado\` a \`presurizado\`.`

NO existe una familia verbal adicional exclusiva para procesos persistentes.

- Referencia SSOT: `opm-opl-es.md` §3.4
- Aplicación en código: reutilizar plantilla TS3 con estados iguales.

### R-3014: Vocabulario de verbos OPL-ES

- Enunciado: verbos fijos de la gramática, en tercera persona singular:

| Función | EN | ES | Infinitivo |
|---|---|---|---|
| Consumo | consumes | consume | consumir |
| Resultado | yields | genera | generar |
| Efecto | affects | afecta | afectar |
| Cambio de estado | changes ... from ... to | cambia ... de ... a | cambiar |
| Agente | handles | maneja | manejar |
| Instrumento | requires | requiere | requerir |
| Iniciación | initiates | inicia | iniciar |
| Invocación | invokes | invoca | invocar |
| Ocurrencia | occurs | ocurre | ocurrir |
| Existencia | exists | existe | existir |
| Omisión | is skipped | se omite | omitir |
| Consumo pasivo | is consumed | se consume | consumir |
| Agregación | consists of | consta de | constar |
| Exhibición | exhibits | exhibe | exhibir |
| Especialización plural | are | son | ser |
| Especialización singular | is a | es un/una | ser |
| Instanciación | is an instance of | es una instancia de | ser |
| Relación | relates to | se relaciona con | relacionar |
| Variación | ranges from ... to | varía de ... a | variar |
| Tipo | is of type | es de tipo | ser |
| Declaración | can be | puede estar | poder+estar |
| Descomposición | zooms into ... in that sequence | se descompone en ... en esa secuencia | descomponerse |
| Despliegue | unfolds into | se despliega en | desplegarse |
| Refinamiento | is refined by in-zooming ... in | se refina por descomposición de ... en | refinarse |

- Referencia SSOT: `opm-opl-es.md` §2
- Aplicación en código: diccionario fijo de verbos.

### R-3015: Palabras clave fijas

- Enunciado: palabras clave canónicas:

| EN | ES |
|---|---|
| if | si |
| in which case | en cuyo caso |
| otherwise / else | de lo contrario |
| from | de |
| to | a |
| and | y (e ante i-, hi-) |
| or | o (u ante o-, ho-) |
| as well as | así como |
| exactly one of | exactamente uno de |
| at least one of | al menos uno de |
| at least one other | al menos otro/a |
| an optional | un/una opcional |
| at least one | al menos un/una |
| following path | por ruta |
| duration of | duración de |
| exceeds | excede |
| falls short of | es menor que |
| in that sequence | en esa secuencia |
| can be | puede estar |
| is initial | es inicial |
| is final | es final |
| is default | es por defecto |
| is initial and final | es inicial y final |

- Referencia SSOT: `opm-opl-es.md` §2

### R-3016: V-47 — Unicidad nominal global

- Enunciado: la unicidad nominal se evalúa a nivel de modelo; toda apariencia visual DEBE renderizarse sin ambigüedad respecto de la cosa a la que refiere.
- Referencia SSOT: V-47
- Aplicación en código: validador global.

### R-3017: Resolución de sinónimos y homónimos

- Enunciado: OPM exige correspondencia 1:1 entre cosas y nombres canónicos. Cada sinónimo DEBE resolverse eligiendo un término canónico. Las variantes de superficie admitidas por OPL-ES pueden coexistir editorialmente pero DEBEN mapear al mismo nombre canónico interno. Cada homónimo DEBE resolverse creando cosas separadas con nombres distintos.
- Referencia SSOT: `metodologia-opm-es.md` §9.15
- Aplicación en código: validador semántico.

### R-3018: Ida y vuelta preserva semántica

- Enunciado: la transformación EN→ES→EN DEBE preservar la semántica original, aunque la superficie española pueda realizarse con infinitivo o nominalización en `-ción` (y `-miento` cuando aplique). La herramienta DEBERÍA respetar la forma elegida por el modelo o normalizarla al registro configurado, pero NO forzar exclusivamente infinitivo.
- Referencia SSOT: `opm-opl-es.md` §18.4
- Aplicación en código: plantilla guarda forma canónica interna; la superficie varía.

### R-3019: Política de modelos mixtos

- Enunciado:
  1. Un idioma OPL canónico por modelo activo
  2. Cambio de idioma mediante **re-generación completa**, no edición parcial
  3. Mezcla EN/ES solo para revisión o migración, nunca como estado estable por defecto
- Referencia SSOT: `opm-opl-es.md` §18.5
- Aplicación en código: idioma activo declarado a nivel de modelo.

### R-3020: Compatibilidad semántica

- Enunciado: OPL-ES NO modifica la semántica OPM. Un modelo creado con OPL-ES es semánticamente idéntico a su equivalente OPL-EN. La traducción es puramente léxica y sintáctica, no semántica.
- Referencia SSOT: `opm-opl-es.md` §18.3
- Aplicación en código: el modelo interno (OPD, constructos, enlaces) permanece invariante al idioma textual.

### R-3021: Detección de idioma por verbo principal

- Enunciado: el verbo principal (R1) es el ancla léxica para detectar el idioma de la sentencia. Un analizador puede determinar EN vs ES verificando si el primer verbo conjugado pertenece al conjunto EN o ES.
- Referencia SSOT: `opm-opl-es.md` §15 R1 (nota)
- Aplicación en código: parser bilingüe detecta idioma.

## Checklist

- [ ] Nombres de proceso cumplen infinitivo / `-ción` / `-miento`
- [ ] Nombres de objeto en singular; colectivos con "Conjunto" o "Grupo"
- [ ] Nombres de estado en minúsculas
- [ ] Convenciones Markdown: **objeto** / *proceso* / `estado`
- [ ] Ser vs Estar según semántica (invariante vs temporal)
- [ ] Artículos omitidos salvo excepciones
- [ ] Preposición "a" personal omitida con objetos directos inanimados
- [ ] Orden SVC preservado
- [ ] Estado sigue al objeto con "en" en ES
- [ ] Pasiva refleja ("se consume")
- [ ] Plantillas D1..D13 correctas
- [ ] Procesos persistentes con TS3 de estados iguales
- [ ] Unicidad global de nombres
- [ ] Sinónimos resueltos a nombre canónico
- [ ] Ida y vuelta EN↔ES preserva semántica
- [ ] Un idioma OPL canónico por modelo

## Antipatrones

- Nombre de proceso "Batería" (no es acción)
- Estado "Inicial" con mayúscula (debe ser minúsculas)
- Objeto "Ingredientes" en plural sin "Conjunto de"
- "Cocinar consume a Masa" (preposición "a" personal)
- Mezclar OPL-EN y OPL-ES en mismo párrafo sin habilitación
- Truncamiento del rótulo en output OPL
- Usar "ser" para estados temporales ("es cargado" debería ser "está cargado")

## Referencias cruzadas

- Metamodelo (nombres): `41-metamodelo-apariencia-existencia.md`
- Primitivas (cosas): `10-primitivas-cosas.md`
- Estados (designaciones): `11-estados-designaciones.md`
- Plantillas procedimentales: `71-opl-plantillas-procedimentales.md`
- Plantillas estructurales: `72-opl-plantillas-estructurales.md`
- Plantillas de contexto: `73-opl-plantillas-contexto-y-multiplicidad.md`
- Metodología (sinónimos): `83-metodologia-heuristicas-avanzadas.md`
