---
epica: "EPICA-15"
titulo: "Canvas — enlaces avanzados (multiplicidad, rutas, XOR/O, condición/evento/NO, invocación)"
slug: "canvas-enlaces-avanzados"
doc_fuente: "opcloud-reverse/15-canvas-enlaces-avanzados.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "M1"
hu_emitidas: 25
hu_canonicas: 23
hu_stubs: 2
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Repertorio avanzado de enlaces: multiplicidades paramétricas, etiquetas de ruta sobre ramas a estados específicos, abanicos lógicos O/XOR construidos por proximidad, modificadores condición/evento/NO, invocación y auto-invocación con demora, edición fina con joint-tools (vértices, segmentos, arrowheads, button). Asume EPICA-10/11; eleva el poder expresivo del modelador.

## 2. Tabla de HU

| ID | Título | Actor | Prioridad | Tamaño | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-15.001 | Abrir propiedades de enlace [absorbida en HU-11.013] | — | — | — | — | — |
| HU-15.002 | Asignar multiplicidad numérica a un enlace procedural | ME | M0 | S | opm-semantica | [Glos 3.60] [OPL-ES T1] |
| HU-15.003 | Renderizar etiqueta de multiplicidad sobre la línea | MN | M0 | XS | opm-semantica | [Glos 3.60] |
| HU-15.004 | Verbalizar multiplicidad en OPL-ES con pluralización canónica | MN | M0 | S | opm-semantica | [OPL-ES T1] |
| HU-15.005 | Definir etiqueta de ruta de texto libre sobre rama a estado | ME | M0 | S | opm-semantica | [Glos 3.60] |
| HU-15.006 | Renderizar etiqueta de ruta apoyada sobre la línea | MN | M1 | XS | mixto | — |
| HU-15.007 | Verbalizar etiqueta de ruta en OPL-ES (`por ruta X...`) | MN | M0 | S | opm-semantica | [Glos 3.60] |
| HU-15.008 | Crear segunda rama sobre el mismo puerto para formar abanico | ME | M0 | M | opm-semantica | [V-239] |
| HU-15.009 | Alternar operador lógico del abanico entre O y XOR | ME | M0 | S | opm-semantica | [V-239] |
| HU-15.010 | Renderizar conector XOR sobre el abanico | MN | M0 | S | mixto | [V-239] |
| HU-15.011 | Renderizar conector curvo de O sobre el abanico | MN | M0 | S | mixto | [V-239] |
| HU-15.012 | Distinguir OPL-ES entre XOR y O | MN | M0 | S | opm-semantica | — |
| HU-15.013 | Dirigir ramas de abanico a estados distintos | ME | M1 | M | opm-semantica | [V-239] |
| HU-15.014 | Aplicar subtipo Condición [absorbida en HU-11.027] | — | — | — | — | — |
| HU-15.015 | Aplicar subtipo Evento [especializa HU-11.027] | ME | M0 | S | opm-semantica | [V-240] |
| HU-15.016 | Aplicar modificador NO [especializa HU-11.027] | ME | M0 | S | opm-semantica | [V-240] |
| HU-15.017 | Sustituir conexión manual por NO sobre estado excluido | ME | M1 | S | mixto | — |
| HU-15.018 | Ver probabilidad en enlace evento cuando está definida | ME | S | S | opcloud-ui | [Glos 3.60] |
| HU-15.019 | Crear enlace de invocación entre dos procesos | ME | M0 | M | opm-semantica | [V-240] [V-61] |
| HU-15.020 | Crear auto-invocación con demora por defecto | ME | M1 | M | opm-semantica | [V-240] |
| HU-15.021 | Visualizar proceso de espera derivado de demora | RV | S | S | opcloud-ui | [V-240] |
| HU-15.022 | Mover puerto de un enlace existente | ME | M1 | S | opcloud-ui | [V-61] |
| HU-15.023 | Remover relación existente desde diálogo Mover Puerto | ME | M1 | XS | mixto | [V-61] |
| HU-15.024 | Editar vértices de enlace con joint-tools | ME | M1 | S | mixto | [V-61] [JOYAS §7] |
| HU-15.025 | Advertencia semántica al consumir dos veces el mismo objeto | MN | S | S | opm-semantica | [V-239] |

23 canónicas, 2 stubs.

## 3. Historias de usuario

### HU-15.001 — Abrir propiedades de enlace [absorbida en HU-11.013]

**Estado:** absorbida (2026-05-03). **Canónica:** HU-11.013.

---

### HU-15.002 — Asignar multiplicidad numérica a un enlace procedural

**Actor primario:** ME. **Tipo:** opm-semantica. **Nivel:** K primario.
**Historia:** Como modelador experto, quiero asignar multiplicidad numérica (1, 2..N, *) a un enlace procedural para expresar cardinalidad.
**Criterios:**
- **Dado** un enlace `agente`, **cuando** asigno `multiplicidadOrigen = 2`, **entonces** OPL-ES emite `2 **Conductores** manejan *Conducir*.` con pluralización [OPL-ES T1].
- **Dado** sintaxis inválida, **cuando** confirmo, **entonces** la operación falla.
**Modelo:** `enlace.multiplicidadOrigen` `[propuesta]`.
**Patrones:** HU-SHARED-002, HU-SHARED-007. **Deps:** Bloqueada por HU-11.013.
**Evidencia:** [Glos 3.60]; [OPL-ES T1]. Clase: confirmado por SSOT.
**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [kernel, enlace, multiplicidad].

---

### HU-15.003 — Renderizar etiqueta de multiplicidad sobre la línea

**Actor primario:** MN. **Tipo:** opm-semantica. **Nivel:** V.
**Historia:** Como modelador, quiero ver la multiplicidad cerca del extremo correspondiente del enlace.
**Criterios:** **Dado** multiplicidad `2..N`, **cuando** se renderiza, **entonces** se muestra `2..N` cerca del extremo origen, en tipografía Arial 12px.
**Modelo:** lente derivada. **Deps:** Bloqueada por HU-15.002.
**Evidencia:** [Glos 3.60]. Clase: confirmado.
**Prioridad:** M0. **Tamaño:** XS. **Etiquetas:** [render, enlace, multiplicidad].

---

### HU-15.004 — Verbalizar multiplicidad en OPL-ES con pluralización canónica

**Actor primario:** MN. **Tipo:** opm-semantica. **Nivel:** L.
**Historia:** Como modelador, quiero que la multiplicidad active pluralización en la oración OPL-ES (Conductor → Conductores) cuando aplica.
**Criterios:**
- **Dado** multiplicidad `> 1`, **cuando** OPL-ES emite, **entonces** el sustantivo del objeto se pluraliza usando reglas del español (HU-50 catálogo).
- **Dado** multiplicidad `1`, **cuando** OPL-ES emite, **entonces** el sustantivo se mantiene singular.
**Modelo:** lente con `addPlural` (JOYAS §9).
**Patrones:** HU-SHARED-007. **Deps:** Bloqueada por HU-15.002.
**Evidencia:** [OPL-ES T1]. [JOYAS §9]. Clase: confirmado.
**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [opl, multiplicidad, pluralizacion].

---

### HU-15.005 — Definir etiqueta de ruta de texto libre sobre una rama a estado

**Actor primario:** ME. **Tipo:** opm-semantica. **Nivel:** K primario.
**Historia:** Como modelador experto, quiero etiquetar una rama de un enlace de efecto que llega a un estado específico para indicar bajo qué condición la rama se sigue.
**Criterios:**
- **Dado** un par entrada-salida con varias salidas a estados, **cuando** edito una rama y le asigno etiqueta "exitoso", **entonces** la rama se renderiza con etiqueta cerca del punto de bifurcación.
- **Dado** la etiqueta, **cuando** OPL-ES emite, **entonces** se incluye `por ruta exitoso` en la oración correspondiente.
**Modelo:** `enlace.rutaEtiqueta` `[propuesta]`.
**Patrones:** HU-SHARED-007. **Deps:** Bloqueada por HU-13.014.
**Evidencia:** [Glos 3.60]. Clase: confirmado.
**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [kernel, enlace, ruta, estado].

---

### HU-15.006 — Renderizar etiqueta de ruta apoyada sobre la línea

**Actor primario:** MN. **Tipo:** mixto. **Nivel:** V.
**Historia:** Como modelador, quiero ver la etiqueta de ruta cerca de la línea sin intersectarla para legibilidad.
**Criterios:** la etiqueta se posiciona automáticamente sobre el segmento de la rama, evitando solapar con otros elementos.
**Modelo:** lente derivada. **Deps:** Bloqueada por HU-15.005.
**Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [render, ruta].

---

### HU-15.007 — Verbalizar etiqueta de ruta en OPL-ES (`por ruta X...`)

**Actor primario:** MN. **Tipo:** opm-semantica. **Nivel:** L.
**Historia:** Como modelador, quiero que la oración OPL-ES contenga `por ruta <etiqueta>` para reflejar la ramificación.
**Criterios:** **Dado** un par entrada-salida con dos rutas etiquetadas "exitoso" y "fallido", **cuando** OPL-ES emite, **entonces** aparecen dos oraciones distintas con cláusula `por ruta exitoso` o `por ruta fallido`.
**Patrones:** HU-SHARED-007. **Deps:** Bloqueada por HU-15.005.
**Evidencia:** [Glos 3.60]. Clase: confirmado.
**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [opl, ruta].

---

### HU-15.008 — Crear segunda rama sobre el mismo puerto para formar abanico

**Actor primario:** ME. **Tipo:** opm-semantica. **Nivel:** K primario.
**Historia:** Como modelador experto, quiero crear una segunda rama desde el mismo puerto de un proceso para formar un abanico lógico O/XOR.
**Criterios:**
- **Dado** un enlace existente desde puerto P, **cuando** arrastro otra rama desde el mismo puerto, **entonces** se crea segundo enlace y el render fusiona en abanico.
**Modelo:** múltiples `enlace` con mismo `enlace.origenId` y mismo puerto.
**Patrones:** HU-SHARED-002. **Deps:** Bloqueada por HU-10.011.
**Evidencia:** [V-239]. Clase: confirmado.
**Prioridad:** M0. **Tamaño:** M. **Etiquetas:** [kernel, abanico, ramificacion].

---

### HU-15.009 — Alternar operador lógico del abanico entre O y XOR

**Actor primario:** ME. **Tipo:** opm-semantica. **Nivel:** K primario.
**Historia:** Como modelador experto, quiero alternar el operador del abanico entre O (al menos uno) y XOR (exactamente uno).
**Criterios:** **Dado** un abanico, **cuando** elijo operador, **entonces** `abanico.operador = "O" | "XOR"` `[propuesta]` y el render se actualiza (HU-15.010/011).
**Modelo:** `[propuesta]` agrupación de enlaces compartiendo puerto.
**Patrones:** HU-SHARED-002. **Deps:** Bloqueada por HU-15.008.
**Evidencia:** [V-239]. Clase: confirmado.
**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [kernel, abanico, logica].

---

### HU-15.010 — Renderizar conector XOR sobre el abanico

**Actor primario:** MN. **Tipo:** mixto. **Nivel:** V.
**Historia:** Como modelador, quiero un triangulito conector visible que distinga visualmente el XOR.
**Criterios:** **Dado** abanico XOR, **cuando** se renderiza, **entonces** aparece un triángulo pequeño cerca del puerto de origen.
**Modelo:** lente derivada. **Deps:** Bloqueada por HU-15.009.
**Evidencia:** [V-239]. Clase: confirmado.
**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [render, abanico, xor].

---

### HU-15.011 — Renderizar conector curvo de O sobre el abanico

**Actor primario:** MN. **Tipo:** mixto. **Nivel:** V.
**Historia:** Como modelador, quiero una abrazadera curva que distinga visualmente el O lógico.
**Criterios:** **Dado** abanico O, **cuando** se renderiza, **entonces** una abrazadera curva agrupa las ramas cerca del puerto.
**Modelo:** lente derivada. **Deps:** Bloqueada por HU-15.009.
**Evidencia:** [V-239]. Clase: confirmado.
**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [render, abanico, o].

---

### HU-15.012 — Distinguir OPL-ES entre XOR y O

**Actor primario:** MN. **Tipo:** mixto. **Nivel:** L.
**Historia:** Como modelador, quiero que el OPL-ES distinga `exactamente uno de X o Y` (XOR) de `al menos uno de X o Y` (O).
**Criterios:** **Dado** abanico XOR, **cuando** OPL-ES emite, **entonces** la cláusula es `exactamente uno de`. **Dado** O, **entonces** `al menos uno de`.
**Patrones:** HU-SHARED-007. **Deps:** Bloqueada por HU-15.009.
**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [opl, abanico].

---

### HU-15.013 — Dirigir ramas de abanico a estados distintos

**Actor primario:** ME. **Tipo:** opm-semantica. **Nivel:** K primario.
**Historia:** Como modelador experto, quiero que cada rama del abanico XOR/O termine en un estado distinto del objeto destino.
**Criterios:**
- **Dado** abanico de resultado XOR con dos ramas, **cuando** dirijo cada una a un estado distinto, **entonces** OPL-ES emite oraciones por estado (`*P* genera **O** en estado e1` o `*P* genera **O** en estado e2`).
**Modelo:** `enlace.destinoId` apuntando a `estado.id`. **Deps:** Bloqueada por HU-15.008, HU-13.014.
**Patrones:** HU-SHARED-007. **Evidencia:** [V-239]. Clase: confirmado.
**Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [kernel, abanico, estado].

---

### HU-15.014 — Aplicar subtipo Condición [absorbida en HU-11.027]

**Estado:** absorbida (2026-05-03). **Canónica:** HU-11.027.

---

### HU-15.015 — Aplicar subtipo Evento [especializa HU-11.027]

**Actor primario:** ME. **Tipo:** opm-semantica. **Nivel:** K primario.
**Historia:** Como modelador, quiero marcar un enlace como "Evento" para que dispare el proceso al ocurrir.
**Criterios:** ver HU-11.027 con subtipo "evento". El render incluye marcador "E"; OPL-ES: `*Proceso* es disparado por evento ...`.
**Patrones:** HU-SHARED-007. **Deps:** Bloqueada por HU-11.027.
**Evidencia:** [V-240]. Clase: confirmado.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [kernel, evento].

---

### HU-15.016 — Aplicar modificador NO [especializa HU-11.027]

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** K primario.
**Historia:** Como modelador experto, quiero aplicar el modificador "NO" a un enlace procedural para invertir su condición.
**Criterios:** ver HU-11.027 con NOT activo. Render: `¬` o `NOT`. OPL-ES: incluye negación.
**Deps:** Bloqueada por HU-11.027.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [kernel, no, modificador].

---

### HU-15.017 — Sustituir conexión manual por NO sobre estado excluido

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** K.
**Historia:** Como modelador experto, quiero reemplazar N-1 conexiones a estados con una sola conexión NOT al estado excluido para reducir clutter.
**Criterios:** **Dado** un objeto con 4 estados y 3 conexiones a `e1`, `e2`, `e3`, **cuando** invoco "Reemplazar por NOT e4", **entonces** las 3 conexiones se sustituyen por una conexión NOT a `e4`.
**Modelo:** elimina enlaces, crea uno con NOT. **Patrones:** HU-SHARED-002.
**Deps:** Bloqueada por HU-15.016.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [kernel, optimizacion, no].

---

### HU-15.018 — Ver probabilidad en enlace evento cuando está definida

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador, quiero ver la probabilidad asociada al evento sobre la línea cuando está definida.
**Criterios:** **Dado** evento con `enlace.probabilidad = 0.7` `[propuesta]`, **cuando** se renderiza, **entonces** "70%" aparece cerca del marcador "E".
**Modelo:** `enlace.probabilidad` `[propuesta]`.
**Deps:** Bloqueada por HU-15.015.
**Evidencia:** [Glos 3.60]. Clase: observado.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render, evento, probabilidad].

---

### HU-15.019 — Crear enlace de invocación entre dos procesos

**Actor primario:** ME. **Tipo:** opm-semantica. **Nivel:** K primario.
**Historia:** Como modelador experto, quiero conectar dos procesos con enlace de invocación para expresar que uno dispara al otro.
**Criterios:**
- **Dado** dos procesos, **cuando** elijo "Invocación", **entonces** se crea `enlace.tipo = "invocacion"` con render zigzag y OPL-ES: `*ProcesoA* invoca *ProcesoB*.`
**Patrones:** HU-SHARED-002, HU-SHARED-007. **Deps:** Bloqueada por HU-10.011.
**Evidencia:** [V-240], [V-61]. Clase: confirmado.
**Prioridad:** M0. **Tamaño:** M. **Etiquetas:** [kernel, invocacion].

---

### HU-15.020 — Crear auto-invocación con demora por defecto de 1 segundo

**Actor primario:** ME. **Tipo:** opm-semantica. **Nivel:** K primario.
**Historia:** Como modelador experto, quiero crear auto-invocación de un proceso con demora configurable.
**Criterios:**
- **Dado** un proceso, **cuando** elijo "Auto-invocación", **entonces** se crea `enlace.tipo = "auto-invocacion"` `[propuesta]` con `enlace.demora = "1s"` por defecto.
**Modelo:** `enlace.demora` `[propuesta]`. **Patrones:** HU-SHARED-002.
**Deps:** Bloqueada por HU-10.011. **Evidencia:** [V-240]. Clase: confirmado.
**Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [kernel, auto-invocacion, demora, propuesta].

---

### HU-15.021 — Visualizar proceso de espera derivado de demora

**Actor primario:** RV. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como revisor, quiero ver visualmente la espera asociada a la demora de auto-invocación.
**Criterios:** render con anotación `delay 1s` cerca del lazo.
**Modelo:** lente. **Deps:** Bloqueada por HU-15.020.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render, demora].

---

### HU-15.022 — Mover puerto de un enlace existente con diálogo "Mover Puerto"

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** K primario.
**Historia:** Como modelador experto, quiero mover el extremo de un enlace de un puerto a otro con un diálogo dedicado para casos donde el reanclaje directo es impreciso.
**Criterios:**
- **Dado** un enlace, **cuando** elijo "Mover Puerto", **entonces** se abre diálogo con lista de puertos disponibles del shape destino.
- **Dado** elijo otro puerto, **cuando** confirmo, **entonces** `enlace.origenId` o `destinoId` se actualiza al puerto seleccionado.
**Modelo:** `enlace.origenId` o `destinoId`. **Patrones:** HU-SHARED-002.
**Deps:** Bloqueada por HU-11.020. **Evidencia:** [V-61]. Clase: observado.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [ui, enlace, puerto].

---

### HU-15.023 — Remover relación existente desde diálogo Mover Puerto

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** K.
**Historia:** Como modelador experto, quiero eliminar la relación desde el mismo diálogo de Mover Puerto.
**Criterios:** botón "Eliminar relación" dentro del diálogo invoca HU-SHARED-005.
**Patrones:** HU-SHARED-005. **Deps:** Bloqueada por HU-15.022.
**Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [ui, eliminar].

---

### HU-15.024 — Editar vértices de un enlace polyline con joint-tools

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** V.
**Historia:** Como modelador experto, quiero editar vértices con la herramienta joint-tools incorporada.
**Criterios:** ver HU-11.018, HU-11.019; esta HU integra el toolset visual completo.
**Modelo:** `aparienciaEnlace.vertices`.
**Patrones:** HU-SHARED-002. **Deps:** Bloqueada por HU-11.018.
**Evidencia:** [V-61]; [JOYAS §7]. Clase: observado.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [render, joint-tools, vertice].

---

### HU-15.025 — Advertencia semántica al consumir dos veces el mismo objeto

**Actor primario:** MN. **Tipo:** opm-semantica. **Nivel:** K primario.
**Historia:** Como modelador, quiero recibir advertencia si dos procesos consumen el mismo objeto, porque el consumo es destructivo y solo puede ocurrir una vez.
**Criterios:**
- **Dado** que dos enlaces de consumo apuntan al mismo objeto, **cuando** valido (HU-1C.014), **entonces** se reporta advertencia metodológica con cita SSOT.
**Patrones:** HU-1C.014. **Deps:** Bloqueada por HU-11.003.
**Evidencia:** [V-239]; [Glos 3.20]. Clase: confirmado.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [kernel, validacion, consumo].

---

## 4. Preguntas abiertas derivadas

| Código | Pregunta | Bloquea |
|---|---|---|
| Q15.1 | Sintaxis canónica para multiplicidad custom (rangos, listas, *). | HU-15.002 |
| Q15.2 | ¿XOR/O se permite mezclar (algunas ramas X, otras O) o es uniforme por puerto? | HU-15.009 |
| Q15.3 | Probabilidad: ¿solo numérica o admite rangos? | HU-15.018 |
| Q15.4 | Demora de auto-invocación: ¿unidades fijas o configurables? | HU-15.020 |

## 5. Referencias cruzadas

- Patrones: HU-SHARED-002, HU-SHARED-007.
- Bloqueada por: EPICA-10, EPICA-11, EPICA-13.
- Bloquea a: EPICA-B0, EPICA-B4 (condiciones y loops).
