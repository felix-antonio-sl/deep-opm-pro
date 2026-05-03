---
epica: "EPICA-11"
titulo: "Canvas — modelado básico (agregación, multi-selección, enlaces procedurales, propiedades, alineación, borrado)"
slug: "canvas-modelado-basico"
doc_fuente: "opcloud-reverse/11-canvas-modelado-basico.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "M0"
hu_emitidas: 27
hu_canonicas: 22
hu_stubs: 5
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Lleva el modelador desde el caso mínimo (HU-10) hasta un OPD de dominio completo: jerarquía estructural (agregación-participación con bus vertical), roles procedurales (agente, instrumento, consumo, efecto, resultado), enlace estructural etiquetado con vértices manuales, multi-selección y operaciones en lote, y guardado explícito. Aparece por primera vez la **separación entidad / apariencia**: un enlace puede existir una vez en el modelo pero múltiples veces como apariencia en distintos OPDs.

## 2. Tabla de HU

| ID | Título | Actor | Prioridad | Tamaño | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-11.001 | Crear cosa y sus partes en secuencia sobre el mismo OPD | MN | M0 | S | opm-semantica | [V-1] |
| HU-11.002 | Preservar capitalización en lote [absorbida en HU-10.006] | — | — | — | — | — |
| HU-11.003 | Crear enlace de agregación-participación uno a uno | MN | M0 | S | opm-semantica | [V-239] |
| HU-11.004 | Fusionar múltiples enlaces de agregación en bus vertical único | MN | M0 | M | opm-semantica | [V-239] [V-129] |
| HU-11.005 | Multi-seleccionar cosas con Ctrl+clic [absorbida en HU-SHARED-008] | — | — | — | — | — |
| HU-11.006 | Seleccionar cosas por lazo con Shift [absorbida en HU-SHARED-008] | — | — | — | — | — |
| HU-11.007 | Conectar multi-selección al todo con un solo gesto | ME | M1 | M | mixto | [V-239] |
| HU-11.008 | Alinear enlaces seleccionados a la izquierda | ME | M1 | S | opcloud-ui | — |
| HU-11.009 | Crear enlace instrumento objeto → proceso | MN | M0 | S | opm-semantica | [Glos 3.35] [OPL-ES T1] |
| HU-11.010 | Crear enlace agente objeto → proceso sobre objeto físico | MN | M0 | S | opm-semantica | [Glos 3.3] [OPL-ES T1] |
| HU-11.011 | Verbalizar rol de agente en OPL-ES con "maneja" | MN | M0 | XS | opm-semantica | [OPL-ES T1] |
| HU-11.012 | Crear enlace estructural etiquetado unidireccional | MN | M0 | S | opm-semantica | [V-239] |
| HU-11.013 | Editar propiedades de enlace por menú contextual [especializa HU-SHARED-001] | MN | M0 | S | opcloud-ui | — |
| HU-11.014 | Renombrar etiqueta del enlace [especializa HU-SHARED-004] | MN | M0 | S | opm-semantica | — |
| HU-11.015 | Configurar multiplicidad origen y destino del enlace | ME | M1 | S | opm-semantica | [Glos 3.60] |
| HU-11.016 | Ajustar estilo visual del enlace en diálogo de propiedades | ME | S | S | opcloud-ui | — |
| HU-11.017 | Copiar estilo de un enlace a otro | ME | S | S | opcloud-ui | — |
| HU-11.018 | Insertar vértice en enlace por clic sobre la línea | ME | M1 | S | mixto | [V-61] |
| HU-11.019 | Reposicionar vértice arrastrándolo | ME | M1 | XS | mixto | [V-61] |
| HU-11.020 | Reanclar extremo del enlace a otro puerto del shape | ME | M1 | S | mixto | [V-61] [JOYAS §7] |
| HU-11.021 | Borrar un enlace [absorbida en HU-SHARED-005] | — | — | — | — | — |
| HU-11.022 | Decidir alcance de borrado [absorbida en HU-SHARED-005] | — | — | — | — | — |
| HU-11.023 | Borrar varios enlaces seleccionados en lote | ME | M1 | S | opcloud-ui | — |
| HU-11.024 | Guardar modelo explícitamente y ver confirmación | MN | M0 | S | opcloud-ui | — |
| HU-11.025 | Iniciar enlace desde zona de borde respetando handles | ME | M0 | M | opm-semantica | [V-61] [JOYAS §4] |
| HU-11.026 | Ver tabla de tipos de enlace filtrada por dirección y tipos | MN | M0 | L | opm-semantica | [V-239] [V-240] |
| HU-11.027 | Seleccionar subtipo Condición/Evento y modificador NOT en la tabla | ME | M1 | M | opm-semantica | [V-240] |

22 canónicas vivas, 5 stubs.

## 3. Historias de usuario

### HU-11.001 — Crear cosa y sus partes en secuencia sobre el mismo OPD

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** K primario; U secundario.
**Superficie UI:** barra principal + canvas-OPD.
**Gesto canónico:** arrastres sucesivos sobre el mismo OPD.

**Historia:**
> Como modelador novato, quiero crear varias cosas seguidas en el mismo OPD sin que la barra principal cambie de modo, para construir el inventario sin fricción.

**Contexto de negocio:**
La SSOT no prescribe el modo de creación múltiple. OPCloud mantiene la barra "viva" (sin auto-cierre del modo) entre creaciones consecutivas. Reduce gestos para casos de modelado denso.

**Criterios de aceptación:**
- **Dado** que arrastré una cosa al canvas (HU-10.001/002), **cuando** la creo y nombro, **entonces** la barra principal sigue activa y permite arrastres adicionales sin reabrir.
- **Dado** que creo varias cosas seguidas, **cuando** invoco deshacer, **entonces** se desfacen una a una (cada creación es un entry separado en el stack, no batch).

**Reglas y restricciones:** la creación atómica delega en HU-10.001/002.

**Modelo de datos tocado:** mismas raíces que HU-10.001/002.

**Patrones aplicados:** HU-SHARED-002, HU-SHARED-006.

**Dependencias:** Bloqueada por HU-10.001/002.

**Notas de evidencia:** Fuente OPCloud: §3.1. Clase: observado.

**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [canvas, kernel, creacion, batch].

---

### HU-11.002 — Preservar capitalización en lote [absorbida en HU-10.006]

**Estado:** absorbida (2026-05-03).
**Canónica:** HU-10.006.
**Razón:** la preferencia "Auto Format desactivado" se conserva por sesión; múltiples creaciones consecutivas heredan el toggle sin acción adicional.
**Fuente OPCloud:** opcloud-reverse/11-canvas-modelado-basico.md §3.2.

---

### HU-11.003 — Crear enlace de agregación-participación uno a uno

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categórico:** K primario.
**Superficie UI:** canvas-OPD + tabla de tipos de enlace.
**Gesto canónico:** arrastrar desde puerto de objeto-todo hacia objeto-parte; elegir "Agregación-Participación".

**Historia:**
> Como modelador, quiero conectar un objeto-todo con un objeto-parte mediante enlace de agregación-participación para expresar relación todo/parte.

**Contexto de negocio:** la SSOT [V-239] define la familia "agregación-participación" como una de las cinco familias estructurales. Render canónico: triángulo isósceles negro relleno apuntando del todo a la parte. [JOYAS §13]

**Criterios de aceptación:**
- **Dado** que arrastré un enlace entre dos objetos y elegí "Agregación-Participación", **cuando** confirmo (HU-10.011), **entonces** se crea `enlace.tipo = "agregacion"` con `origenId` (todo) y `destinoId` (parte), y se renderiza con triángulo agregador 30×30 px en `#586D8C`. [JOYAS §13]
- **Dado** que el enlace se creó, **cuando** el panel OPL-ES se actualiza (HU-SHARED-007), **entonces** se emite: `**Todo** consiste en **Parte**.`
- **Dado** que el origen no es objeto, **cuando** intento crear, **entonces** "Agregación-Participación" no aparece en la tabla (HU-10.008).

**Reglas y restricciones:** geometría del triángulo: base 25.67 px, vértice en `(15.33, 0.76)`. [JOYAS §13]

**Modelo de datos tocado:** `enlace.tipo = "agregacion"`, `enlace.origenId`, `enlace.destinoId`.

**Patrones aplicados:** HU-SHARED-002, HU-SHARED-007.

**Dependencias:** Bloqueada por HU-10.007, HU-10.008, HU-10.011.

**Notas de evidencia:** [V-239] cinco familias estructurales. [JOYAS §13] triángulo. Fuente OPCloud: §4.1. Clase: confirmado por SSOT.

**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [canvas, kernel, enlace, agregacion].

---

### HU-11.004 — Fusionar múltiples enlaces de agregación en bus vertical único

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categórico:** K primario; V secundario.
**Superficie UI:** canvas-OPD.
**Gesto canónico:** crear varios enlaces de agregación con mismo origen, observar la fusión.

**Historia:**
> Como modelador, quiero que múltiples enlaces de agregación con el mismo objeto-todo se rendericen como un único bus vertical con triángulo único, para reducir la complejidad visual.

**Contexto de negocio:** la SSOT [V-129] prescribe la topología de "triángulo + N salidas" para agregación múltiple desde un mismo todo. OPCloud lo implementa fusionando los triángulos automáticamente.

**Criterios de aceptación:**
- **Dado** que existe un enlace `enlace1.origenId = TodoX, enlace1.destinoId = ParteA`, **cuando** creo `enlace2.origenId = TodoX, enlace2.destinoId = ParteB`, **entonces** el render fusiona ambos en un solo triángulo con dos salidas, conectadas por una línea horizontal o vertical compartida.
- **Dado** que elimino uno de los enlaces, **cuando** la operación termina, **entonces** el render se actualiza para mostrar el bus restante.
- **Dado** que solo queda un enlace, **cuando** se renderiza, **entonces** el bus se reduce a un único triángulo + línea.

**Reglas y restricciones:** la fusión es de render, no de modelo; cada `enlace` sigue siendo independiente en `modelo.enlaces`.

**Modelo de datos tocado:** múltiples `enlace.*` con mismo `origenId`. La fusión vive en `aparienciaEnlace.vertices` calculados.

**Patrones aplicados:** HU-SHARED-002.

**Dependencias:** Bloqueada por HU-11.003.

**Notas de evidencia:** [V-129] topología de triángulos múltiples. [V-239]. Fuente OPCloud: §4.2. Clase: confirmado por SSOT + observado.

**Prioridad:** M0. **Tamaño:** M. **Etiquetas:** [canvas, kernel, agregacion, render, bus].

---

### HU-11.005 — Multi-seleccionar cosas con Ctrl+clic [absorbida en HU-SHARED-008]

**Estado:** absorbida-en-shared (2026-05-03).
**Canónica:** HU-SHARED-008 — Selección y deselección de canvas.
**Especialización local:** Ctrl+clic agrega/quita una apariencia de la selección preservando el resto.
**Fuente OPCloud:** opcloud-reverse/11-canvas-modelado-basico.md §5.1.

---

### HU-11.006 — Seleccionar cosas por lazo con Shift [absorbida en HU-SHARED-008]

**Estado:** absorbida-en-shared (2026-05-03).
**Canónica:** HU-SHARED-008.
**Especialización local:** arrastre con Shift desde zona vacía dibuja un rectángulo de selección que respeta selección previa (suma).
**Fuente OPCloud:** opcloud-reverse/11-canvas-modelado-basico.md §5.2.

---

### HU-11.007 — Conectar multi-selección al todo con un solo gesto

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categórico:** K primario; U secundario.
**Superficie UI:** canvas-OPD.
**Gesto canónico:** seleccionar varias partes con Ctrl+clic, arrastrar enlace de agregación desde una al todo; el resto se conecta automáticamente.

**Historia:**
> Como modelador experto, quiero conectar varios objetos-parte a un mismo objeto-todo con un solo gesto, en lugar de crear N enlaces a mano.

**Contexto de negocio:** acelera modelado denso. La SSOT no prescribe el gesto; OPCloud lo provee como afordance batch.

**Criterios de aceptación:**
- **Dado** que tengo `[ParteA, ParteB, ParteC]` seleccionadas, **cuando** arrastro un enlace desde una de ellas hasta `TodoX` y elijo "Agregación-Participación", **entonces** se crean tres enlaces de agregación, uno por parte seleccionada.
- **Dado** que la operación termina, **cuando** invoco deshacer, **entonces** los tres enlaces se eliminan en un solo undo (atomicidad).
- **Dado** que una de las partes ya está conectada al todo, **cuando** confirmo, **entonces** los duplicados no se crean (idempotencia).

**Reglas y restricciones:** la operación atómica entra al stack como una sola entrada (HU-SHARED-002).

**Modelo de datos tocado:** N × `enlace.*` con mismo `destinoId` (todo).

**Patrones aplicados:** HU-SHARED-002, HU-SHARED-008.

**Dependencias:** Bloqueada por HU-11.003, HU-SHARED-008.

**Notas de evidencia:** [V-239]. Fuente OPCloud: §5.3. Clase: observado + canonizado.

**Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [canvas, kernel, batch, agregacion].

---

### HU-11.008 — Alinear enlaces seleccionados a la izquierda

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** V primario; U secundario.
**Superficie UI:** menú contextual de selección + acción "Alinear".
**Gesto canónico:** seleccionar enlaces, elegir "Alinear izquierda".

**Historia:**
> Como modelador experto, quiero alinear los puntos de inicio o fin de varios enlaces a una misma coordenada para que el OPD luzca ordenado.

**Contexto de negocio:** estética; no exigida por SSOT.

**Criterios de aceptación:**
- **Dado** que tengo varios enlaces seleccionados, **cuando** elijo "Alinear izquierda", **entonces** los puntos de inicio (o fin, según contexto) se alinean a la coordenada `x` mínima del conjunto.
- **Dado** que la alineación termina, **cuando** invoco deshacer, **entonces** las posiciones previas se restauran.

**Reglas y restricciones:** la alineación es por `aparienciaEnlace.vertices`, no afecta `enlace`.

**Modelo de datos tocado:** `aparienciaEnlace.vertices`.

**Patrones aplicados:** HU-SHARED-002, HU-SHARED-008, HU-SHARED-001.

**Dependencias:** Bloqueada por HU-11.018, HU-SHARED-008.

**Notas de evidencia:** Fuente OPCloud: §5.4. Clase: observado.

**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [canvas, ui, alineacion, batch].

---

### HU-11.009 — Crear enlace instrumento objeto → proceso

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categórico:** K primario.
**Superficie UI:** canvas-OPD + tabla de tipos.
**Gesto canónico:** arrastrar enlace desde objeto a proceso, elegir "Instrumento".

**Historia:**
> Como modelador, quiero conectar un objeto a un proceso como instrumento para expresar que el proceso requiere ese objeto sin consumirlo.

**Contexto de negocio:** [Glos 3.35] define instrumento como habilitador no humano. La SSOT [V-240] lo lista entre los procedurales.

**Criterios de aceptación:**
- **Dado** que arrastré enlace desde objeto a proceso, **cuando** elijo "Instrumento", **entonces** se crea `enlace.tipo = "instrumento"` y el render muestra circle marker (relleno blanco con borde) en el extremo objeto. [JOYAS §5]
- **Dado** que se creó, **cuando** el panel OPL-ES emite (HU-SHARED-007), **entonces** aparece: `**Objeto** requiere *Proceso*.` [OPL-ES T1]

**Reglas y restricciones:** marker dinámico generado en `<defs>` con ID único. [JOYAS §5]

**Modelo de datos tocado:** `enlace.tipo = "instrumento"`.

**Patrones aplicados:** HU-SHARED-002, HU-SHARED-007.

**Dependencias:** Bloqueada por HU-10.007, HU-10.011.

**Notas de evidencia:** [Glos 3.35]; [V-240]; [OPL-ES T1]. Clase: confirmado por SSOT.

**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [canvas, kernel, enlace, instrumento].

---

### HU-11.010 — Crear enlace agente objeto → proceso sobre objeto físico

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categórico:** K primario.
**Superficie UI:** canvas-OPD + tabla de tipos.
**Gesto canónico:** arrastrar enlace desde objeto físico a proceso, elegir "Agente".

**Historia:**
> Como modelador, quiero conectar un objeto físico a un proceso como agente para expresar que un humano lo ejecuta.

**Contexto de negocio:** [Glos 3.3] define agente como habilitador humano (esencia física). HU-10.010 garantiza que el tipo solo aparece si origen es objeto físico.

**Criterios de aceptación:**
- **Dado** que origen es objeto con `esencia = "fisica"` y destino es proceso, **cuando** elijo "Agente", **entonces** se crea `enlace.tipo = "agente"` y el render muestra circle marker relleno (lollipop) en el extremo objeto. [JOYAS §5]
- **Dado** que se creó, **cuando** el panel OPL-ES emite, **entonces** aparece: `**Conductor** maneja *Conducir*.` [OPL-ES T1]
- **Dado** que cambio la esencia del agente a "informacional", **cuando** la operación termina, **entonces** se emite advertencia: el enlace agente requiere objeto físico (Q11.4).

**Reglas y restricciones:** ver HU-10.010.

**Modelo de datos tocado:** `enlace.tipo = "agente"`.

**Patrones aplicados:** HU-SHARED-002, HU-SHARED-007.

**Dependencias:** Bloqueada por HU-10.007, HU-10.010, HU-10.011.

**Notas de evidencia:** [Glos 3.3]; [V-240]; [OPL-ES T1]. Clase: confirmado por SSOT.

**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [canvas, kernel, enlace, agente].

---

### HU-11.011 — Verbalizar rol de agente en OPL-ES con "maneja"

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categórico:** L primario.
**Superficie UI:** panel OPL-ES.
**Gesto canónico:** observación pasiva del eco.

**Historia:**
> Como modelador, quiero que la oración OPL-ES de un enlace agente use el verbo "maneja" para que la lectura natural del modelo sea clara.

**Contexto de negocio:** [OPL-ES T1] prescribe verbo "maneja" para agente. Esta HU canoniza la verificación.

**Criterios de aceptación:**
- **Dado** que existe `enlace.tipo = "agente"` desde `Conductor` a `Conducir`, **cuando** el panel OPL-ES se renderiza, **entonces** la oración exacta es: `**Conductor** maneja *Conducir*.` con tipografía SSOT (negrita objeto, cursiva proceso).
- **Dado** que existen múltiples agentes para el mismo proceso, **cuando** se renderiza, **entonces** las oraciones se concatenan en líneas separadas.

**Reglas y restricciones:** la conjugación es invariante; "maneja" no cambia con multiplicidad.

**Modelo de datos tocado:** lente derivada.

**Patrones aplicados:** HU-SHARED-007.

**Dependencias:** Bloqueada por HU-11.010.

**Notas de evidencia:** [OPL-ES T1]. Clase: confirmado por SSOT.

**Prioridad:** M0. **Tamaño:** XS. **Etiquetas:** [opl, kernel, agente].

---

### HU-11.012 — Crear enlace estructural etiquetado unidireccional

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categórico:** K primario.
**Superficie UI:** canvas-OPD + tabla de tipos + diálogo de etiqueta.
**Gesto canónico:** arrastrar entre dos objetos, elegir "Etiquetado unidireccional", escribir etiqueta.

**Historia:**
> Como modelador, quiero crear un enlace estructural genérico con etiqueta personalizada cuando ninguna familia canónica encaja con la relación que quiero expresar.

**Contexto de negocio:** [V-239] lista "etiquetado" como quinta familia estructural. Útil para relaciones de dominio (ej. "depende de", "contiene").

**Criterios de aceptación:**
- **Dado** que arrastré entre dos objetos, **cuando** elijo "Etiquetado unidireccional", **entonces** se abre un diálogo para ingresar etiqueta.
- **Dado** que escribí "depende de" y confirmo, **cuando** la operación termina, **entonces** se crea el enlace con `enlace.etiqueta = "depende de"` y el render muestra la etiqueta sobre la línea.
- **Dado** que se creó, **cuando** el panel OPL-ES emite, **entonces** aparece: `**Origen** depende de **Destino**.`

**Reglas y restricciones:** la etiqueta no puede estar vacía en este tipo. La validación nominal (HU-SHARED-009) no aplica aquí — la etiqueta es libre.

**Modelo de datos tocado:** `enlace.tipo = "etiquetado"` `[propuesta]`, `enlace.etiqueta`.

**Patrones aplicados:** HU-SHARED-002, HU-SHARED-007, HU-SHARED-009.

**Dependencias:** Bloqueada por HU-10.007.

**Notas de evidencia:** [V-239] etiquetado. Clase: confirmado por SSOT.

**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [canvas, kernel, enlace, etiquetado, propuesta].

---

### HU-11.013 — Editar propiedades de enlace por menú contextual [especializa HU-SHARED-001]

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; K secundario.
**Superficie UI:** menú contextual sobre enlace.
**Gesto canónico:** clic derecho sobre enlace, elegir "Propiedades".

**Historia:**
> Como modelador, quiero abrir un diálogo con propiedades del enlace seleccionado para cambiar etiqueta, multiplicidad y estilo.

**Contexto de negocio:** especialización de HU-SHARED-001 con contexto = enlace.

**Criterios de aceptación:**
- **Dado** que hago clic derecho sobre un enlace, **cuando** la acción "Propiedades" se invoca, **entonces** se abre un diálogo con campos: `enlace.etiqueta`, `enlace.multiplicidadOrigen` `[propuesta]`, `enlace.multiplicidadDestino` `[propuesta]`, estilo visual.
- **Dado** que cambio un campo y confirmo, **cuando** la operación termina, **entonces** el cambio se persiste y el render se actualiza.
- **Dado** que cancelo, **cuando** el diálogo se cierra, **entonces** ningún campo se altera.
- **Dado** que el modo es read-only (HU-SHARED-003), **cuando** abro el diálogo, **entonces** los campos están deshabilitados.

**Reglas y restricciones:** patrón shared HU-SHARED-001; este es el contexto "enlace".

**Modelo de datos tocado:** `enlace.etiqueta`, `enlace.multiplicidad*` `[propuesta]`.

**Patrones aplicados:** HU-SHARED-001, HU-SHARED-002, HU-SHARED-003.

**Dependencias:** Bloqueada por HU-10.011.

**Notas de evidencia:** Fuente OPCloud: §6.1. Clase: observado.

**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [canvas, ui, enlace, propiedades].

---

### HU-11.014 — Renombrar etiqueta del enlace [especializa HU-SHARED-004]

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categórico:** K primario; U secundario.
**Superficie UI:** diálogo de propiedades del enlace.
**Gesto canónico:** editar campo "Etiqueta" en el diálogo.

**Historia:**
> Como modelador, quiero cambiar la etiqueta de un enlace existente para corregir o refinar la relación.

**Contexto de negocio:** especialización de HU-SHARED-004 con scope = enlace. La validación nominal en este contexto no requiere unicidad (las etiquetas pueden repetirse).

**Criterios de aceptación:**
- **Dado** que abrí propiedades del enlace y cambio la etiqueta, **cuando** confirmo, **entonces** `enlace.etiqueta` se actualiza y el render + OPL-ES se sincronizan.
- **Dado** que el enlace es estructural canónico (agregación, agente, instrumento, consumo, efecto, resultado), **cuando** edito etiqueta, **entonces** la etiqueta es tag adicional, no reemplaza el verbo OPL canónico.
- **Dado** que el enlace es "etiquetado" (HU-11.012), **cuando** edito etiqueta vacía, **entonces** la operación falla con error "La etiqueta no puede estar vacía".

**Reglas y restricciones:** patrón shared HU-SHARED-004 con scope = enlace; sin unicidad obligatoria.

**Modelo de datos tocado:** `enlace.etiqueta`.

**Patrones aplicados:** HU-SHARED-004 (especializado), HU-SHARED-007, HU-SHARED-009.

**Dependencias:** Bloqueada por HU-11.013.

**Notas de evidencia:** [OPL-ES §2] uso de tag. Clase: inferido + canonizado.

**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [canvas, kernel, enlace, etiqueta].

---

### HU-11.015 — Configurar multiplicidad origen y destino del enlace

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categórico:** K primario.
**Superficie UI:** diálogo de propiedades.
**Gesto canónico:** editar campos "Multiplicidad origen" / "Multiplicidad destino".

**Historia:**
> Como modelador experto, quiero configurar multiplicidad (1, m, m..n, *) en cada extremo del enlace para expresar cardinalidad de la relación.

**Contexto de negocio:** [Glos 3.60] define multiplicidad. Render: la cardinalidad aparece como anotación cerca del extremo correspondiente.

**Criterios de aceptación:**
- **Dado** que abrí propiedades, **cuando** ingreso `1` en origen y `m..n` en destino, **entonces** el render muestra "1" en origen y "m..n" en destino, y el OPL-ES emite la oración con multiplicidad explícita.
- **Dado** que la sintaxis es inválida, **cuando** confirmo, **entonces** la operación falla con error explícito.

**Reglas y restricciones:** sintaxis válida: enteros, rangos `m..n`, `*`, `1`, `0..1`.

**Modelo de datos tocado:** `enlace.multiplicidadOrigen` `[propuesta]`, `enlace.multiplicidadDestino` `[propuesta]`.

**Patrones aplicados:** HU-SHARED-007.

**Dependencias:** Bloqueada por HU-11.013.

**Notas de evidencia:** [Glos 3.60] multiplicidad. Clase: confirmado por SSOT.

**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [canvas, kernel, enlace, multiplicidad, propuesta].

---

### HU-11.016 — Ajustar estilo visual del enlace en diálogo de propiedades

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** V primario.
**Superficie UI:** diálogo de propiedades + selector de estilo.
**Gesto canónico:** elegir color, grosor o patrón de línea en el diálogo.

**Historia:**
> Como modelador experto, quiero ajustar grosor, color y estilo de línea del enlace para destacarlo o agruparlo visualmente.

**Contexto de negocio:** estética; no exigida por SSOT. La SSOT es estricta sobre semántica visual canónica (colores y estilos de afiliación/esencia); el styling adicional no debe alterar señales semánticas.

**Criterios de aceptación:**
- **Dado** que abrí propiedades, **cuando** elijo color y grosor, **entonces** el render del enlace se actualiza preservando el patrón wrapper+line. [JOYAS §4]
- **Dado** que el cambio termina, **cuando** invoco deshacer, **entonces** el estilo previo se restaura.

**Reglas y restricciones:** el grosor visible no debe ser menor a 1px ni mayor a 6px (legibilidad); wrapper se mantiene en 15px. [JOYAS §4]

**Modelo de datos tocado:** `enlace.estilo` `[propuesta]`.

**Patrones aplicados:** HU-SHARED-002.

**Dependencias:** Bloqueada por HU-11.013.

**Notas de evidencia:** [JOYAS §4]. Clase: observado.

**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [canvas, ui, enlace, estilo].

---

### HU-11.017 — Copiar estilo de un enlace a otro

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** V primario; U secundario.
**Superficie UI:** menú contextual + acción "Copiar estilo".
**Gesto canónico:** seleccionar enlace fuente, elegir "Copiar estilo", luego clicar enlace destino.

**Historia:**
> Como modelador experto, quiero copiar el estilo de un enlace a otros para mantener consistencia visual.

**Criterios de aceptación:**
- **Dado** que selecciono enlace A y elijo "Copiar estilo", **cuando** clico enlace B, **entonces** B adopta `enlace.estilo` de A.
- **Dado** que repito el clic en C, **entonces** C también adopta el estilo (modo persistente hasta cancelar con `Esc`).

**Modelo de datos tocado:** `enlace.estilo` `[propuesta]`.

**Patrones aplicados:** HU-SHARED-002, HU-SHARED-001.

**Dependencias:** Bloqueada por HU-11.016.

**Notas de evidencia:** Fuente OPCloud: §6.4. Clase: observado.

**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [canvas, ui, enlace, estilo, batch].

---

### HU-11.018 — Insertar vértice en enlace por clic sobre la línea

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categórico:** V primario; U secundario.
**Superficie UI:** canvas-OPD.
**Gesto canónico:** clic sobre la línea del enlace + arrastrar.

**Historia:**
> Como modelador experto, quiero insertar un vértice en un enlace para enrutarlo manualmente alrededor de obstáculos visuales.

**Contexto de negocio:** [V-61] define el enlace como visible. La SSOT no prescribe el enrutamiento; OPCloud usa manhattan + vértices manuales.

**Criterios de aceptación:**
- **Dado** que paso el cursor sobre la línea del enlace, **cuando** clico sobre el wrapper transparente (15px), **entonces** se inserta un vértice en esa posición.
- **Dado** que se insertó el vértice, **cuando** lo arrastro, **entonces** la línea se redibuja respetando el nuevo vértice y los puntos extremos.

**Reglas y restricciones:** vértices se almacenan en `aparienciaEnlace.vertices` ordenados.

**Modelo de datos tocado:** `aparienciaEnlace.vertices`.

**Patrones aplicados:** HU-SHARED-002.

**Dependencias:** Bloqueada por HU-10.011.

**Notas de evidencia:** [V-61]; [JOYAS §4, §6]. Clase: observado.

**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [canvas, render, enlace, vertice].

---

### HU-11.019 — Reposicionar vértice arrastrándolo

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categórico:** V primario.
**Superficie UI:** canvas-OPD.
**Gesto canónico:** arrastrar un vértice existente.

**Historia:**
> Como modelador, quiero arrastrar un vértice existente a otra posición para ajustar el enrutamiento.

**Criterios de aceptación:**
- **Dado** que existe un vértice, **cuando** lo arrastro, **entonces** sus coordenadas en `aparienciaEnlace.vertices` se actualizan y la línea se redibuja en vivo.

**Modelo de datos tocado:** `aparienciaEnlace.vertices[i]`.

**Patrones aplicados:** HU-SHARED-002.

**Dependencias:** Bloqueada por HU-11.018.

**Notas de evidencia:** [V-61]. Clase: observado.

**Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [canvas, render, enlace, vertice].

---

### HU-11.020 — Reanclar extremo del enlace a otro puerto del shape

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categórico:** K primario; V secundario.
**Superficie UI:** canvas-OPD.
**Gesto canónico:** arrastrar el extremo del enlace a otro puerto magnético.

**Historia:**
> Como modelador experto, quiero reanclar el extremo de un enlace a otra cosa o a otro puerto de la misma cosa para corregir conexiones sin recrear el enlace.

**Contexto de negocio:** los puertos viven en `port-group: "aaa"` con `magnet: true`. [JOYAS §7]

**Criterios de aceptación:**
- **Dado** que arrastro el extremo de un enlace y lo suelto sobre otra apariencia, **cuando** la operación termina, **entonces** `enlace.origenId` o `enlace.destinoId` se actualiza.
- **Dado** que la nueva conexión rompe filtros (HU-10.008/010), **cuando** la operación termina, **entonces** se aborta con explicación y la conexión original se restaura.
- **Dado** que cambia origen/destino, **cuando** termina, **entonces** el panel OPL-ES re-emite la oración con los nuevos nombres.

**Modelo de datos tocado:** `enlace.origenId` o `enlace.destinoId`.

**Patrones aplicados:** HU-SHARED-002, HU-SHARED-007.

**Dependencias:** Bloqueada por HU-10.011.

**Notas de evidencia:** [V-61]; [JOYAS §7]. Clase: observado.

**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [canvas, kernel, enlace, reanclaje].

---

### HU-11.021 — Borrar un enlace [absorbida en HU-SHARED-005]

**Estado:** absorbida-en-shared (2026-05-03).
**Canónica:** HU-SHARED-005 — Eliminar con scope.
**Especialización local:** scope "modelo" elimina el `enlace` y todas sus apariencias; scope "vista" elimina solo la `aparienciaEnlace` del OPD actual.
**Fuente OPCloud:** opcloud-reverse/11-canvas-modelado-basico.md §7.1.

---

### HU-11.022 — Decidir alcance de borrado [absorbida en HU-SHARED-005]

**Estado:** absorbida-en-shared (2026-05-03).
**Canónica:** HU-SHARED-005.
**Especialización local:** el diálogo "Elegir alcance" aparece cuando el enlace tiene apariencias en múltiples OPDs.
**Fuente OPCloud:** opcloud-reverse/11-canvas-modelado-basico.md §7.2.

---

### HU-11.023 — Borrar varios enlaces seleccionados en lote

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** K primario; U secundario.
**Superficie UI:** canvas-OPD.
**Gesto canónico:** seleccionar varios enlaces, presionar `Delete`.

**Historia:**
> Como modelador experto, quiero borrar varios enlaces seleccionados con un solo gesto para limpiar rápidamente conexiones obsoletas.

**Criterios de aceptación:**
- **Dado** que tengo `[enlaceA, enlaceB, enlaceC]` seleccionados, **cuando** presiono `Delete`, **entonces** se invoca HU-SHARED-005 con scope por defecto y los tres se eliminan en un solo undo.
- **Dado** que la operación termina, **cuando** invoco deshacer, **entonces** los tres enlaces se restauran.

**Reglas y restricciones:** patrón shared HU-SHARED-005 con conjunto múltiple.

**Modelo de datos tocado:** N × `enlace.*` y sus `aparienciaEnlace.*`.

**Patrones aplicados:** HU-SHARED-005, HU-SHARED-008, HU-SHARED-002.

**Dependencias:** Bloqueada por HU-SHARED-005, HU-SHARED-008.

**Notas de evidencia:** Fuente OPCloud: §7.3. Clase: observado.

**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [canvas, batch, eliminar].

---

### HU-11.024 — Guardar modelo explícitamente y ver confirmación

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** P primario; U secundario.
**Superficie UI:** botón "Guardar" en barra superior + atajo `Ctrl+S`.
**Gesto canónico:** clic en botón o `Ctrl+S`.

**Historia:**
> Como modelador, quiero guardar el modelo con un solo gesto y recibir confirmación visible para saber que mi trabajo está seguro.

**Contexto de negocio:** persistencia básica vive en EPICA-30. Esta HU es el gesto de guardado en el contexto del modelado básico; la mecánica de save vive en HU-30.001+.

**Criterios de aceptación:**
- **Dado** que el modelo está dirty (HU-SHARED-006), **cuando** invoco guardar, **entonces** la persistencia se ejecuta (HU-30.001), `ui.dirty = false` y el indicador "(No guardado)" desaparece.
- **Dado** que el guardado fue exitoso, **cuando** termina, **entonces** se muestra un toast "Modelo guardado" durante 2 segundos.
- **Dado** que el guardado falla, **cuando** termina, **entonces** se muestra un toast con el error y `ui.dirty` se mantiene.
- **Dado** que el modo es read-only, **cuando** invoco guardar, **entonces** la operación es no-op.

**Modelo de datos tocado:** todo el `modelo.*` (snapshot).

**Patrones aplicados:** HU-SHARED-003, HU-SHARED-006.

**Dependencias:** Bloqueada por HU-30.001 (mecánica de save).

**Notas de evidencia:** Fuente OPCloud: §8.1. Clase: observado.

**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [persistencia, ui, guardar, atajo].

---

### HU-11.025 — Iniciar enlace desde zona de borde respetando handles

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categórico:** V primario; K secundario.
**Superficie UI:** canvas-OPD.
**Gesto canónico:** acercarse al borde de la apariencia desde fuera; magnet aparece dentro del wrapper de 15px.

**Historia:**
> Como modelador experto, quiero que el inicio del enlace respete una zona de tolerancia (handles) alrededor del borde para no fallar el clic.

**Criterios de aceptación:**
- **Dado** que paso el cursor a menos de 8px del borde de una apariencia, **cuando** la zona de tolerancia se activa, **entonces** los puertos magnéticos se hacen visibles.
- **Dado** que arrastro desde dentro de la zona, **cuando** suelto sobre otra apariencia, **entonces** se crea el enlace siguiendo HU-10.007.
- **Dado** que arrastro desde fuera de la zona, **cuando** intento iniciar enlace, **entonces** la operación es ignorada (clic se interpreta como deselección).

**Reglas y restricciones:** zona de tolerancia: 8px (configurable). Wrapper transparente de 15px. [JOYAS §4]

**Modelo de datos tocado:** ninguno persistente; estado UI.

**Patrones aplicados:** HU-SHARED-008.

**Dependencias:** Bloqueada por HU-10.007.

**Notas de evidencia:** [V-61]; [JOYAS §4, §7]. Clase: observado + canonizado.

**Prioridad:** M0. **Tamaño:** M. **Etiquetas:** [canvas, render, enlace, ux].

---

### HU-11.026 — Ver tabla de tipos de enlace filtrada por dirección y tipos

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categórico:** L primario; U secundario.
**Superficie UI:** tabla de tipos de enlace.
**Gesto canónico:** consecuencia de HU-10.007.

**Historia:**
> Como modelador, quiero que la tabla de tipos muestre la organización completa por dirección (O→O, O→P, P→O, P→P) y familias (estructurales, procedurales) con OPL preview por cada uno.

**Contexto de negocio:** [V-239] cinco familias estructurales; [V-240] enlaces procedurales. Esta HU canoniza la presentación.

**Criterios de aceptación:**
- **Dado** que la tabla se abre con par O→O, **cuando** se renderiza, **entonces** las cinco familias estructurales aparecen en orden: agregación-participación, exhibición-característica, generalización-especialización, clasificación-instanciación, etiquetado.
- **Dado** que la tabla se abre con par O→P, **cuando** se renderiza, **entonces** aparecen agente, instrumento (procedurales).
- **Dado** que la tabla se abre con par P→O, **cuando** se renderiza, **entonces** aparecen consumo, efecto, resultado.
- **Dado** que la tabla se abre con par P→P, **cuando** se renderiza, **entonces** aparecen invocación, auto-invocación.
- **Dado** que cualquier fila, **cuando** la inspecciono, **entonces** muestra el OPL preview correspondiente (HU-10.009).

**Reglas y restricciones:** orden y filtrado derivados de SSOT.

**Modelo de datos tocado:** lente derivada.

**Patrones aplicados:** HU-SHARED-007 (preview).

**Dependencias:** Bloqueada por HU-10.007.

**Notas de evidencia:** [V-239]; [V-240]. Clase: confirmado por SSOT.

**Prioridad:** M0. **Tamaño:** L. **Etiquetas:** [canvas, kernel, enlace, lente].

---

### HU-11.027 — Seleccionar subtipo Condición/Evento y modificador NOT en la tabla

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categórico:** K primario.
**Superficie UI:** tabla de tipos de enlace.
**Gesto canónico:** elegir subtipo dentro de un tipo procedural.

**Historia:**
> Como modelador experto, quiero distinguir un enlace procedural normal de su variante "condición" o "evento", y aplicar el modificador "NOT" cuando aplique.

**Contexto de negocio:** [V-240] define los subtipos. Una condición es un enlace que activa el proceso solo si se cumple; un evento dispara el proceso al ocurrir; el NOT invierte la condición.

**Criterios de aceptación:**
- **Dado** que en la tabla elijo un enlace procedural y selecciono subtipo "Condición", **cuando** confirmo, **entonces** se crea con `enlace.subtipo = "condicion"` `[propuesta]` y el render incluye marcador "C" cerca del extremo.
- **Dado** que selecciono "Evento", **cuando** confirmo, **entonces** `enlace.subtipo = "evento"` `[propuesta]` con marcador "E".
- **Dado** que activo NOT, **cuando** confirmo, **entonces** `enlace.modificadorNot = true` `[propuesta]` con marcador "¬" o "NOT".
- **Dado** que el panel OPL-ES emite (HU-SHARED-007), **cuando** se renderiza, **entonces** la oración refleja el subtipo: `*Proceso* ocurre si **Objeto** está en estado X` (condición), o `*Proceso* es disparado por evento Y` (evento).

**Reglas y restricciones:** subtipos y NOT son ortogonales (combinables).

**Modelo de datos tocado:** `enlace.subtipo` `[propuesta]`, `enlace.modificadorNot` `[propuesta]`.

**Patrones aplicados:** HU-SHARED-002, HU-SHARED-007.

**Dependencias:** Bloqueada por HU-11.026.

**Notas de evidencia:** [V-240]. Fuente OPCloud: §4.4. Clase: confirmado por SSOT + observado.

**Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [canvas, kernel, enlace, condicion, evento, propuesta].

---

## 4. Preguntas abiertas derivadas

| Código | Pregunta | Bloquea |
|---|---|---|
| Q11.1 | Alcance exacto de "Copy Style" entre enlaces de tipos diferentes — ¿se copian solo grosor/color, o también marker? | HU-11.017 |
| Q11.2 | Comportamiento del bus al disolver un triángulo de agregación con un solo destino restante. | HU-11.004 |
| Q11.3 | Multiplicidad: sintaxis exacta canónica vs syntaxis libre. | HU-11.015 |
| Q11.4 | Si un objeto agente cambia esencia a "informacional", ¿se desconecta el agente, se advierte, o se bloquea el cambio? | HU-11.010 |
| Q11.5 | Semántica precisa del modificador NOT: ¿aplica a condición, evento o ambos? | HU-11.027 |

## 5. Referencias cruzadas

- Patrones aplicados: HU-SHARED-001, HU-SHARED-002, HU-SHARED-003, HU-SHARED-004, HU-SHARED-005, HU-SHARED-006, HU-SHARED-007, HU-SHARED-008, HU-SHARED-009.
- Bloqueada por: EPICA-10 (creación de cosas y enlaces básicos).
- Bloquea a: EPICA-12 (descomposición), EPICA-15 (enlaces avanzados), EPICA-16 (propiedades avanzadas).
