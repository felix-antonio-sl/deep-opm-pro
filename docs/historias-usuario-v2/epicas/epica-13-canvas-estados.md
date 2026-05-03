---
epica: "EPICA-13"
titulo: "Canvas — estados (designaciones, par entrada-salida, supresión, layout interno)"
slug: "canvas-estados"
doc_fuente: "opcloud-reverse/13-canvas-estados.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "M0"
hu_emitidas: 20
hu_canonicas: 18
hu_stubs: 2
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Cubre el ciclo completo de estados dentro de un objeto OPM: creación inicial por pares (`estado1`, `estado2`), edición secuencial, designaciones semánticas (inicial, final, Current, default), enlaces que entran y salen de estados específicos (par entrada-salida), supresión condicional, alineación, duración temporal y render visual dentro del objeto contenedor. Axioma OPM gobernante: **objeto con estados ⇒ ≥ 2 estados**: la primera invocación de "Agregar estados" siempre crea dos.

## 2. Tabla de HU

| ID | Título | Actor | Prioridad | Tamaño | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-13.001 | Agregar primeros dos estados desde menú contextual | MN | M0 | M | opm-semantica | [Glos 3.68] [V-237] [OPL-ES D8] |
| HU-13.002 | Agregar primeros dos estados desde toolbar contextual | MN | M0 | S | opcloud-ui | — |
| HU-13.003 | Crear estado adicional individual con "Agregar estado" posterior | MN | M0 | S | opm-semantica | [Glos 3.68] [V-237] |
| HU-13.004 | Renombrar estado con diálogo [especializa HU-SHARED-004] | MN | M0 | S | mixto | [Glos 3.68] |
| HU-13.005 | Editar estados en cadena con Enter saltando al siguiente | ME | M1 | S | opcloud-ui | — |
| HU-13.006 | Eliminar estado [especializa HU-SHARED-005] | ME | M1 | S | opm-semantica | [V-237] [V-238] |
| HU-13.007 | Suprimir estado no conectado | ME | S | S | opcloud-ui | — |
| HU-13.008 | Validar axioma "con estados ⇒ ≥ 2 estados" | MN | M0 | M | opm-semantica | [V-237] [V-238] [Glos 3.68] |
| HU-13.009 | Distinguir estados cualitativos de slot de valor | AD | S | M | opm-semantica | [Glos 3.68] [V-163] |
| HU-13.010 | Designar estado como Inicial | MN | M0 | S | opm-semantica | [V-4] [Glos 3.71a] [OPL-ES D5] |
| HU-13.011 | Designar estado como Final | MN | M0 | S | opm-semantica | [V-5] [Glos 3.71a] [OPL-ES D6] |
| HU-13.012 | Designar estado como Por defecto | ME | M1 | S | opm-semantica | [V-6] [Glos 3.71a] [OPL-ES D7] |
| HU-13.013 | Designar estado como Current y ver eco en simulación | IS | S | M | mixto | [V-237] [Glos 3.71a] |
| HU-13.014 | Crear enlace entrante/saliente dirigido a estado específico | ME | M0 | M | opm-semantica | [V-61] [V-237] [Glos 3.68] |
| HU-13.015 | Convertir enlace de efecto en par entrada-salida | ME | M1 | S | opcloud-ui | — |
| HU-13.016 | Selector con Par entrada-salida, Condición, Evento, Split Input [absorbida en HU-11.027 + HU-13.014] | — | — | — | — | — |
| HU-13.017 | Eco OPL-ES de estados posibles al crear estados | MN | M0 | S | opm-semantica | [OPL-ES D8] [Glos 3.68] |
| HU-13.018 | Eco OPL-ES de transición entre estados con par entrada-salida | MN | M0 | S | opm-semantica | [OPL-ES TS3] [V-237] [Glos 3.68] |
| HU-13.019 | Alinear estados internamente (horizontal o vertical) | ME | M1 | M | opcloud-ui | — |
| HU-13.020 | Asignar duración temporal a un estado [absorbida en HU-17.034] | — | — | — | — | — |

18 canónicas, 2 stubs.

## 3. Historias de usuario

### HU-13.001 — Agregar primeros dos estados desde menú contextual

**Actor primario:** MN. **Tipo:** opm-semantica.
**Nivel:** K primario; V, U secundarios.
**Superficie:** menú contextual del objeto.
**Gesto:** elegir "Agregar estados" en menú contextual.

**Historia:** Como modelador, quiero crear los primeros dos estados de un objeto con un solo gesto para cumplir el axioma "con estados ⇒ ≥ 2 estados".

**Criterios:**
- **Dado** un objeto sin estados, **cuando** elijo "Agregar estados", **entonces** se crean simultáneamente `estado1` y `estado2` dentro del objeto, ambos con designaciones vacías.
- **Dado** que se crearon los dos estados, **cuando** OPL-ES emite (HU-SHARED-007), **entonces** aparece: `**Objeto** puede ser \`estado1\` o \`estado2\`.` [OPL-ES D8]
- **Dado** que el objeto se renderiza, **cuando** el render se actualiza, **entonces** los estados aparecen como cápsulas internas en la parte inferior del rectángulo. [JOYAS §10]

**Reglas:** axioma "≥ 2 estados" [V-237], [V-238].
**Modelo:** `[propuesta]` `estado.id`, `estado.entidadId`, `estado.nombre` — persistente.
**Patrones:** HU-SHARED-001, HU-SHARED-002, HU-SHARED-007.
**Deps:** Bloqueada por HU-10.002.
**Evidencia:** [Glos 3.68], [V-237], [V-238]. Fuente OPCloud: §3.1. Clase: confirmado por SSOT.
**Prioridad:** M0. **Tamaño:** M. **Etiquetas:** [canvas, kernel, estado, propuesta].

---

### HU-13.002 — Agregar primeros dos estados desde toolbar contextual

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** U.
**Historia:** Como modelador, quiero agregar estados desde la toolbar contextual de la cosa para alternativa al menú radial.

**Criterios:**
- **Dado** un objeto seleccionado, **cuando** clico el botón "Estados" en toolbar contextual, **entonces** procede como HU-13.001.

**Modelo:** ver HU-13.001. **Patrones:** HU-SHARED-002.
**Deps:** Bloqueada por HU-13.001 (mecánica común).
**Evidencia:** Clase: observado.
**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [canvas, ui, estado, toolbar].

---

### HU-13.003 — Crear estado adicional individual con "Agregar estado" posterior

**Actor primario:** MN. **Tipo:** opm-semantica. **Nivel:** K primario.

**Historia:** Como modelador, quiero agregar estados adicionales (3°, 4°...) al objeto que ya tiene 2 estados, para refinar el modelo de comportamiento.

**Criterios:**
- **Dado** un objeto con ≥ 2 estados, **cuando** elijo "Agregar estado", **entonces** se crea un nuevo `estado` con `nombre = "estadoN"` (siguiente índice) sin afectar los existentes.
- **Dado** que existen 3 estados, **cuando** OPL-ES emite, **entonces**: `**Objeto** puede ser \`e1\`, \`e2\` o \`e3\`.` [OPL-ES D8]

**Modelo:** `estado.*` `[propuesta]`. **Patrones:** HU-SHARED-001, HU-SHARED-002, HU-SHARED-007.
**Deps:** Bloqueada por HU-13.001.
**Evidencia:** [Glos 3.68], [V-237]. Clase: confirmado por SSOT.
**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [canvas, kernel, estado].

---

### HU-13.004 — Renombrar estado con diálogo [especializa HU-SHARED-004]

**Actor primario:** MN. **Tipo:** mixto. **Nivel:** K primario.

**Historia:** Como modelador, quiero renombrar un estado individual con la mecánica del diálogo unificado.

**Criterios:** ver HU-SHARED-004 con scope = estado dentro de objeto. La unicidad es local al objeto contenedor.

**Modelo:** `estado.nombre`. **Patrones:** HU-SHARED-004, HU-SHARED-009 (scope objeto).
**Deps:** Bloqueada por HU-13.001, HU-SHARED-004.
**Evidencia:** [Glos 3.68]. Clase: especialización.
**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [canvas, estado, renombrar].

---

### HU-13.005 — Editar estados en cadena con Enter saltando al siguiente

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** U.

**Historia:** Como modelador experto, quiero que al confirmar el nombre de un estado con Enter, el foco salte al siguiente estado para edición rápida en cadena.

**Criterios:**
- **Dado** que tengo 3 estados nuevos, **cuando** estoy editando el primero y presiono Enter, **entonces** se confirma y el diálogo abre en el segundo automáticamente.
- **Dado** que el último estado se confirma, **cuando** Enter se presiona, **entonces** el diálogo se cierra.

**Modelo:** UI transitoria. **Patrones:** HU-SHARED-004.
**Deps:** Bloqueada por HU-13.004.
**Evidencia:** Clase: observado.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [ui, estado, batch, ux].

---

### HU-13.006 — Eliminar estado [especializa HU-SHARED-005]

**Actor primario:** ME. **Tipo:** opm-semantica. **Nivel:** K primario.

**Historia:** Como modelador, quiero eliminar un estado individual del objeto, respetando el axioma "≥ 2 estados".

**Criterios:**
- **Dado** un objeto con 3 estados, **cuando** elimino uno, **entonces** quedan 2 y la cascada elimina enlaces que tocaban ese estado específico.
- **Dado** un objeto con 2 estados, **cuando** intento eliminar uno, **entonces** la operación falla con explicación o se ofrece "Quitar estados del objeto" (todos a la vez) [V-237], [V-238].

**Modelo:** `estado.*`, enlaces incidentes. **Patrones:** HU-SHARED-005, HU-SHARED-002.
**Deps:** Bloqueada por HU-13.001.
**Evidencia:** [V-237], [V-238]. Clase: confirmado por SSOT.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [canvas, kernel, estado, eliminar].

---

### HU-13.007 — Suprimir estado no conectado

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.

**Historia:** Como modelador experto, quiero ocultar visualmente un estado que no está conectado a procesos para reducir clutter sin eliminarlo.

**Criterios:**
- **Dado** un estado sin enlaces incidentes, **cuando** elijo "Suprimir", **entonces** `estado.suprimido = true` `[propuesta]` y deja de renderizarse en el canvas.
- **Dado** que el estado está suprimido, **cuando** el OPL-ES emite, **entonces** sigue apareciendo en `[OPL-ES D8]` (la supresión es de render, no semántica).
- **Dado** que el estado está suprimido, **cuando** elijo "Restaurar visualización", **entonces** `estado.suprimido = false`.

**Modelo:** `estado.suprimido` `[propuesta]`. **Patrones:** HU-SHARED-002, HU-SHARED-007.

**Deps:** Bloqueada por HU-13.003.
**Evidencia:** Clase: observado.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [canvas, ui, estado, supresion, propuesta].

---

### HU-13.008 — Validar axioma "con estados ⇒ ≥ 2 estados"

**Actor primario:** MN. **Tipo:** opm-semantica. **Nivel:** K primario.

**Historia:** Como modelador, quiero que el sistema impida configurar un objeto con un solo estado para preservar el axioma OPM.

**Criterios:**
- **Dado** un objeto con 2 estados, **cuando** elimino uno (HU-13.006), **entonces** la operación se bloquea o se ofrece eliminar ambos.
- **Dado** un objeto sin estados, **cuando** invoco "Agregar estados" (HU-13.001), **entonces** se crean 2 simultáneamente.
- **Dado** un objeto con N ≥ 2 estados, **cuando** valido el modelo, **entonces** la regla pasa.

**Modelo:** validación sobre `estado.*`. **Patrones:** ninguno.
**Deps:** Bloqueada por HU-13.001.
**Evidencia:** [V-237], [V-238], [Glos 3.68]. Clase: confirmado por SSOT.
**Prioridad:** M0. **Tamaño:** M. **Etiquetas:** [kernel, validacion, axioma].

---

### HU-13.009 — Distinguir estados cualitativos de slot de valor

**Actor primario:** AD. **Tipo:** opm-semantica. **Nivel:** K primario.

**Historia:** Como diseñador de dominio, quiero distinguir estados cualitativos (`crudo`, `cocido`) de slot de valor numérico (`temperatura: 25 °C`) porque OPM los trata como primitivas distintas.

**Criterios:**
- **Dado** un objeto con estados cualitativos, **cuando** se renderiza, **entonces** los estados son cápsulas con texto. [JOYAS §10]
- **Dado** un objeto con slot de valor (atributo numérico), **cuando** se renderiza, **entonces** se muestra como atributo separado con `Nombre [Unidad]` (HU-17.011, HU-17.013).
- **Dado** que un objeto tiene ambos, **cuando** se renderiza, **entonces** estados y slot conviven sin mezclarse.

**Modelo:** `estado.tipo: "cualitativo" | "valor"` `[propuesta]`. **Patrones:** ninguno.
**Deps:** Bloqueada por HU-13.001, EPICA-17.
**Evidencia:** [Glos 3.68], [V-163]. Clase: confirmado por SSOT.
**Prioridad:** S. **Tamaño:** M. **Etiquetas:** [kernel, estado, valor, distincion].

---

### HU-13.010 — Designar estado como Inicial

**Actor primario:** MN. **Tipo:** opm-semantica. **Nivel:** K primario.

**Historia:** Como modelador, quiero marcar un estado como "Inicial" para indicar el punto de entrada del objeto al ciclo de vida.

**Criterios:**
- **Dado** un estado, **cuando** elijo "Designar Inicial", **entonces** `estado.designaciones += "inicial"` y el render muestra marcador específico (línea de entrada). [V-4]
- **Dado** que OPL-ES emite, **cuando** se renderiza, **entonces** aparece: `\`estado1\` es el estado inicial de **Objeto**.` [OPL-ES D5]
- **Dado** que ya existe un estado inicial en el objeto, **cuando** designo otro, **entonces** se ofrece reemplazar (un solo inicial por objeto, ver Q13.1) o se permite multi-inicial (configurable).

**Modelo:** `estado.designaciones: Array<"inicial" | "final" | "default" | "current">` `[propuesta]`. **Patrones:** HU-SHARED-007, HU-SHARED-002.
**Deps:** Bloqueada por HU-13.001.
**Evidencia:** [V-4], [Glos 3.71a], [OPL-ES D5]. Clase: confirmado por SSOT.
**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [kernel, estado, designacion, inicial].

---

### HU-13.011 — Designar estado como Final

**Actor primario:** MN. **Tipo:** opm-semantica. **Nivel:** K primario.

**Historia:** Como modelador, quiero marcar un estado como "Final" para indicar el punto de salida del objeto al ciclo de vida.

**Criterios:** análogos a HU-13.010 con designación "final" y render con marcador de salida [V-5]. OPL-ES: `\`estadoN\` es el estado final de **Objeto**.` [OPL-ES D6]

**Modelo:** `estado.designaciones += "final"`. **Patrones:** HU-SHARED-007.
**Deps:** Bloqueada por HU-13.001.
**Evidencia:** [V-5], [OPL-ES D6]. Clase: confirmado por SSOT.
**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [kernel, estado, designacion, final].

---

### HU-13.012 — Designar estado como Por defecto

**Actor primario:** ME. **Tipo:** opm-semantica. **Nivel:** K primario.

**Historia:** Como modelador, quiero designar un estado como "Por defecto" para indicar el estado asumido cuando no hay información explícita.

**Criterios:**
- **Dado** un estado, **cuando** elijo "Designar Por defecto", **entonces** `estado.designaciones += "default"` y solo un estado del objeto puede ser default a la vez.
- **Dado** que ya existe un default, **cuando** designo otro, **entonces** se reemplaza automáticamente.
- **Dado** que OPL-ES emite, **cuando** se renderiza, **entonces** aparece: `\`estadoX\` es el estado por defecto de **Objeto**.` [OPL-ES D7]

**Modelo:** `estado.designaciones += "default"`. **Patrones:** HU-SHARED-007.
**Deps:** Bloqueada por HU-13.001.
**Evidencia:** [V-6], [OPL-ES D7]. Clase: confirmado por SSOT.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [kernel, estado, designacion, default].

---

### HU-13.013 — Designar estado como Current y ver eco en simulación

**Actor primario:** IS. **Tipo:** mixto. **Nivel:** K primario; X secundario.

**Historia:** Como ingeniero de simulación, quiero marcar un estado como "Current" para indicar el estado actual del objeto durante simulación.

**Criterios:**
- **Dado** un estado, **cuando** elijo "Designar Current", **entonces** `estado.designaciones += "current"` y solo un estado puede ser current a la vez.
- **Dado** que existe Current y Default simultáneamente, **cuando** valido, **entonces** se rechaza por exclusión (Q13.2).
- **Dado** que el simulador (EPICA-B0) ejecuta, **cuando** transita a otro estado, **entonces** Current migra automáticamente.

**Modelo:** `estado.designaciones += "current"`. **Patrones:** HU-SHARED-007.
**Deps:** Bloqueada por HU-13.001.
**Evidencia:** [V-237] Current persistente; [Glos 3.71a]. Clase: confirmado por SSOT.
**Prioridad:** S. **Tamaño:** M. **Etiquetas:** [kernel, estado, current, simulacion].

---

### HU-13.014 — Crear enlace entrante/saliente dirigido a estado específico

**Actor primario:** ME. **Tipo:** opm-semantica. **Nivel:** K primario.

**Historia:** Como modelador, quiero crear enlaces que tengan extremo en un estado específico (no en el objeto entero) para expresar transiciones entre estados.

**Criterios:**
- **Dado** un objeto con 3 estados, **cuando** arrastro enlace a `estado2`, **entonces** se crea `enlace` con `destinoId = estado.id` (no `entidad.id` del objeto).
- **Dado** que el enlace es de efecto y va de un estado a otro del mismo objeto, **cuando** OPL-ES emite, **entonces** aparece: `*Proceso* cambia **Objeto** de \`e1\` a \`e2\`.` [OPL-ES TS3]

**Modelo:** `enlace.origenId` o `enlace.destinoId` apuntando a `estado.id`. **Patrones:** HU-SHARED-007, HU-SHARED-002.
**Deps:** Bloqueada por HU-13.001, HU-10.007.
**Evidencia:** [V-61], [V-237], [OPL-ES TS3]. Clase: confirmado por SSOT.
**Prioridad:** M0. **Tamaño:** M. **Etiquetas:** [kernel, enlace, estado, transicion].

---

### HU-13.015 — Convertir enlace de efecto en par entrada-salida

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** K primario.

**Historia:** Como modelador experto, quiero transformar un enlace de efecto simple en un par entrada-salida (estado origen → proceso → estado destino) para precisión semántica.

**Criterios:**
- **Dado** un enlace de efecto `Proceso → Objeto`, **cuando** elijo "Convertir a par entrada-salida", **entonces** se reemplaza por dos enlaces: `Estado_in → Proceso` (consumo) y `Proceso → Estado_out` (resultado).

**Modelo:** elimina un `enlace.tipo = "efecto"` y crea dos. **Patrones:** HU-SHARED-002, HU-SHARED-007.
**Deps:** Bloqueada por HU-13.014.
**Evidencia:** Clase: observado.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [kernel, enlace, par-entrada-salida].

---

### HU-13.016 — Selector con Par entrada-salida, Condición, Evento, Split Input [absorbida]

**Estado:** absorbida (2026-05-03).
**Canónica:** HU-11.027 (subtipos Condición/Evento/NOT) y HU-13.014 (par entrada-salida).
**Razón:** los modificadores ya son cubiertos por HU-11.027 y HU-13.014; no requieren HU específica.

---

### HU-13.017 — Eco OPL-ES de estados posibles al crear estados

**Actor primario:** MN. **Tipo:** opm-semantica. **Nivel:** L primario.

**Historia:** Como modelador, quiero ver `**Objeto** puede ser \`e1\` o \`e2\`.` apenas creo estados.

**Criterios:** ver HU-SHARED-007 con plantilla [OPL-ES D8].

**Modelo:** lente. **Patrones:** HU-SHARED-007.
**Deps:** Bloqueada por HU-13.001.
**Evidencia:** [OPL-ES D8]. Clase: confirmado por SSOT.
**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [opl, estado].

---

### HU-13.018 — Eco OPL-ES de transición entre estados con par entrada-salida

**Actor primario:** MN. **Tipo:** opm-semantica. **Nivel:** L primario.

**Historia:** Como modelador, quiero ver la oración OPL-ES de transición de estado tras configurar par entrada-salida.

**Criterios:**
- **Dado** un par entrada-salida `e_in → P → e_out`, **cuando** OPL-ES emite, **entonces** aparece: `*P* cambia **Objeto** de \`e_in\` a \`e_out\`.` [OPL-ES TS3]

**Patrones:** HU-SHARED-007. **Deps:** Bloqueada por HU-13.014.
**Evidencia:** [OPL-ES TS3], [V-237], [Glos 3.68]. Clase: confirmado por SSOT.
**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [opl, estado, transicion].

---

### HU-13.019 — Alinear estados internamente (horizontal o vertical)

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.

**Historia:** Como modelador experto, quiero alternar el layout interno de estados entre horizontal y vertical para legibilidad.

**Criterios:**
- **Dado** un objeto con estados, **cuando** elijo "Layout vertical", **entonces** los estados se redistribuyen verticalmente dentro del rectángulo.
- **Dado** que los estados están horizontalmente, **cuando** alterno a vertical, **entonces** el rectángulo se ajusta dinámicamente.

**Modelo:** `entidad.layoutEstados: "horizontal" | "vertical"` `[propuesta]`. **Patrones:** HU-SHARED-002.
**Deps:** Bloqueada por HU-13.001.
**Evidencia:** Clase: observado.
**Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [render, estado, layout].

---

### HU-13.020 — Asignar duración temporal a un estado [absorbida en HU-17.034]

**Estado:** absorbida (2026-05-03).
**Canónica:** HU-17.034.
**Razón:** la configuración de duración temporal de estados se canoniza en EPICA-17 con scope amplio.

---

## 4. Preguntas abiertas derivadas

| Código | Pregunta | Bloquea |
|---|---|---|
| Q13.1 | ¿Un objeto puede tener múltiples estados Iniciales o solo uno? | HU-13.010 |
| Q13.2 | Exclusión Current ↔ Default: ¿bloqueante o advertencia? | HU-13.013 |
| Q13.3 | Comportamiento de estados al renombrar el objeto contenedor (qué pasa con scope local). | HU-13.004 |

## 5. Referencias cruzadas

- Patrones: HU-SHARED-001, HU-SHARED-002, HU-SHARED-004, HU-SHARED-005, HU-SHARED-007.
- Bloquea a: EPICA-15 (par entrada-salida en enlaces avanzados), EPICA-17 (designaciones avanzadas), EPICA-B0 (simulación con Current).
