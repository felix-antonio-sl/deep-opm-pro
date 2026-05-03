---
epica: "EPICA-16"
titulo: "Canvas — enlaces: propiedades, Tabla de Enlaces y estilo"
doc_fuente: "opcloud-reverse/16-canvas-enlaces-propiedades.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "M1"
hu_emitidas: 22
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
ultima_actualizacion: 2026-04-23
---

## Resumen

Esta épica cubre la edición fina de enlaces una vez creados: la **Tabla de Enlaces del modelo** (listado tabular de todas las relaciones), el **panel de propiedades** al seleccionar un enlace, la edición de **Multiplicidad de Origen/Destino**, la edición de la **etiqueta** (controls, relates to, communicates via), el **Panel de Estilo** (color, grosor, patrón) y las operaciones de **Copiar Estilo / Pegar Estilo / Restablecer Estilo / Apply to all similar**. Es la superficie que transforma un enlace genérico en una relación semánticamente precisa.

La creación inicial del enlace y la elección del tipo se cubren en EPICA-10 (tabla de enlace contextual al soltar) y EPICA-15 (variantes avanzadas de enlaces). Esta épica asume que el enlace ya existe en el modelo y el modelador quiere **editarlo, estilizarlo o navegarlo** desde vistas tabulares.

Las HU se numeran siguiendo la aparición en el doc fuente, agrupadas por superficie UI (Tabla de Enlaces global, panel de propiedades, Panel de Estilo). El mapa con el doc fuente se documenta en cada HU. Varias propiedades procedimentales (Path, Probability, Rate, Units, NOT, In-Out) se delegan a EPICA-15 cuando son variantes avanzadas; aquí se cubren los atributos base comunes a cualquier enlace.

## Tabla de HU de la épica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|
| HU-16.001 | Abrir Tabla de Enlaces global del modelo | ME | M1 | M | opcloud-ui | [V-61] |
| HU-16.002 | Listar todos los enlaces del modelo en la tabla | ME | M1 | S | opcloud-ui | [V-61] |
| HU-16.003 | Mostrar columnas origen, destino, tipo, etiqueta, multiplicidad | ME | M1 | S | opcloud-ui | [V-61] [Glos 3.60] |
| HU-16.004 | Filtrar Tabla de Enlaces por tipo de enlace | ME | S | S | opcloud-ui | [V-239] |
| HU-16.005 | Ordenar Tabla de Enlaces por columna | ME | S | S | opcloud-ui | — |
| HU-16.006 | Navegar al enlace del canvas haciendo clic desde la tabla | ME | M1 | S | opcloud-ui | [V-61] |
| HU-16.007 | Editar propiedades de enlace desde la Tabla de Enlaces | ME | S | M | mixto | [V-61] [Glos 3.60] |
| HU-16.008 | Abrir panel de propiedades al seleccionar enlace en canvas | MN | M0 | M | opcloud-ui | [Glos 3.60] |
| HU-16.009 | Editar etiqueta del enlace desde panel de propiedades | MN | M0 | S | opm-semantica | [V-61] [Glos 3.60] [OPL-ES TS1..TS5] |
| HU-16.010 | Seleccionar etiqueta canónica de lista (controls, relates to, communicates via) | MN | M1 | S | opm-semantica | [V-239] [OPL-ES §2] |
| HU-16.011 | Editar Multiplicidad de Origen con selector | ME | M1 | S | opm-semantica | [V-61] [Glos 3.60] |
| HU-16.012 | Elegir multiplicidad canónica (1, 0..1, N, 0..N, custom) | ME | M1 | S | opm-semantica | [V-61] [Glos 3.60] |
| HU-16.013 | Ingresar multiplicidad custom con validación | ME | M1 | M | opm-semantica | [V-61] [Glos 3.60] |
| HU-16.014 | Editar Multiplicidad de Destino con selector análogo | ME | M1 | S | opm-semantica | [V-61] [Glos 3.60] |
| HU-16.015 | Abrir Panel de Estilo de un enlace | ME | S | S | opcloud-ui | — |
| HU-16.016 | Cambiar color del enlace desde Panel de Estilo | ME | S | S | opcloud-ui | — |
| HU-16.017 | Cambiar grosor (width) del enlace | ME | S | S | opcloud-ui | — |
| HU-16.018 | Cambiar patrón (pattern) del enlace (sólido, discontinuo, punteado) | ME | S | S | opcloud-ui | — |
| HU-16.019 | Copiar estilo de un enlace (Copiar Estilo) | ME | S | S | opcloud-ui | — |
| HU-16.020 | Pegar estilo en otro enlace (Pegar Estilo) | ME | S | S | opcloud-ui | — |
| HU-16.021 | Restablecer estilo por defecto (Restablecer Estilo) | ME | S | XS | opcloud-ui | — |
| HU-16.022 | Aplicar estilo a todos los enlaces similares (Apply to all similar) | ME | S | M | opcloud-ui | — |

Total: **22 historias de usuario**.

## Historias de usuario

### HU-16.001 — Abrir Tabla de Enlaces global del modelo

**Actor primario:** ME (modelador experto).
**Actores secundarios:** RV (revisor — también la consulta).
**Tipo:** opcloud-ui.
**Nivel categórico:** L (lente) primario; U (UI) secundario.
**Superficie UI:** main-menu + dialogo-modal-tabla-de-enlaces.
**Gesto canónico:** clic en menú (p.ej. `View → Tabla de Enlaces`) o shortcut documentado.

**Historia:**
> Como modelador experto, quiero abrir una tabla global con todos los enlaces del modelo para revisar y editar relaciones sin tener que buscarlas visualmente en el canvas.

**Contexto de negocio:**
En modelos con decenas o cientos de enlaces, la vista canvas es insuficiente para auditoría. Una tabla ordenable y filtrable es la única forma escalable de inspeccionar la red de relaciones de un sistema. Es también el backbone para edición masiva y validación cruzada con la SSOT.

**Criterios de aceptación:**
- **Dado** que hay al menos un enlace en el modelo, **cuando** activo la acción `Open Tabla de Enlaces`, **entonces** se abre un dialogo modal con el listado tabular.
- **Dado** que no hay enlaces aún, **cuando** abro la tabla, **entonces** aparece un mensaje de estado vacío (`No enlaces in this model`) sin filas.
- **Dado** que la tabla está abierta, **cuando** cierro con botón `x` o ESC, **entonces** vuelvo al canvas sin alterar el modelo.
- **Dado** que la tabla está abierta, **cuando** modifico el canvas en paralelo (acción que agrega enlace), **entonces** la tabla refleja el nuevo enlace sin cerrarse.

**Reglas y restricciones:**
- La tabla es **vista**, no cache — se genera al abrir desde el modelo en memoria.
- Shortcut exacto: **pregunta abierta** (no observado en el doc fuente).
- Una sola instancia activa por modelo (no multi-tabla).

**Modelo de datos tocado:**
- Ninguno directo — lectura pura.

**Dependencias:**
- Bloqueada por: HU-10.011 (debe existir al menos un enlace creado).
- Bloquea a: HU-16.002, HU-16.006, HU-16.007.

**Integraciones:**
- Lente del modelo: se alimenta de `modelo.enlaces[]`.

**Notas de evidencia:**
- Fuente: `opcloud-reverse/16-canvas-enlaces-propiedades.md` §2 tabla superficies, §7.1 (OPL como segunda entrada — la Tabla de Enlaces es paralela).
- Clase de afirmación: inferido (la carpeta fuente se llama "The Enlaces table of OPCloud in-depth" y los frames muestrean una tabla enriquecida, pero el activador exacto desde menú no se transcribe).
- Etiqueta: `requires-clarification` sobre activador.

**Prioridad:** M1.
**Tamano:** M.
**Etiquetas:** [canvas, ui, tabla-de-enlaces, lente, dialogo modal, requires-clarification].

---

### HU-16.002 — Listar todos los enlaces del modelo en la tabla

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** L primario; V secundario.
**Superficie UI:** dialogo-modal-tabla-de-enlaces.
**Gesto canónico:** ninguno (render al abrir).

**Historia:**
> Como modelador experto, quiero ver en una sola lista todos los enlaces del modelo, independiente del OPD en que aparezcan, para tener visión completa de la red de relaciones.

**Contexto de negocio:**
Los enlaces son **entidades únicas del modelo**, aunque se dibujen en varios OPDs (principio OPM "entidad única, múltiples apariencias"). La Tabla de Enlaces debe listar entidades, no apariencias — cada enlace aparece una vez con independencia de cuántas veces se renderice.

**Criterios de aceptación:**
- **Dado** que el modelo tiene N enlaces, **cuando** abro la tabla, **entonces** veo N filas, una por `enlace.id` único.
- **Dado** que un enlace aparece en varios OPDs, **cuando** miro la tabla, **entonces** aparece una sola vez.
- **Dado** que elimino un enlace desde el canvas, **cuando** la tabla está abierta, **entonces** la fila correspondiente desaparece.
- **Dado** que creo un nuevo enlace en el canvas, **cuando** la tabla está abierta, **entonces** una nueva fila aparece al final (o según ordenación activa).

**Reglas y restricciones:**
- Identidad de fila: `enlace.id`. No hay duplicados.
- El orden por default es por orden de creación (equivalente a inserción).

**Modelo de datos tocado:**
- Lectura pura de `modelo.enlaces[]`.

**Dependencias:**
- Bloqueada por: HU-16.001.
- Bloquea a: HU-16.003, HU-16.004, HU-16.005.

**Integraciones:**
- Lente OPL (eco paralelo — comparten modelo).

**Notas de evidencia:**
- Fuente: §2 tabla superficies, §5.1–5.2 (propiedades por enlace).
- Frames: frame_00015 (tabla enriquecida).
- Clase de afirmación: inferido del título de la carpeta "The Enlaces table" + frames que muestran tabla.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, ui, tabla-de-enlaces, lente].

---

### HU-16.003 — Mostrar columnas origen, destino, tipo, etiqueta, multiplicidad

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** V primario; L secundario.
**Superficie UI:** dialogo-modal-tabla-de-enlaces.
**Gesto canónico:** ninguno (render).

**Historia:**
> Como modelador experto, quiero que la Tabla de Enlaces exponga al menos las columnas origen, destino, tipo, etiqueta y multiplicidad para auditar cada relación en una sola línea.

**Contexto de negocio:**
Las cinco columnas son el mínimo irreductible para describir una relación OPM: las dos cosas conectadas (origen/destino), la clase semántica del enlace (tipo), la etiqueta natural (etiqueta) y la cardinalidad (multiplicidad). Con esas cinco celdas un modelador reconstruye mentalmente la relación sin abrir el canvas.

**Criterios de aceptación:**
- **Dado** que la tabla está abierta, **cuando** miro el encabezado, **entonces** veo al menos las columnas `Origen`, `Destino`, `Tipo`, `Etiqueta`, `Multiplicidad de Origen`, `Multiplicidad de Destino`.
- **Dado** que una fila corresponde a enlace estructural sin etiqueta, **cuando** miro la celda `Etiqueta`, **entonces** queda vacía o muestra `—`.
- **Dado** que una fila tiene multiplicidad por defecto (`1` / `1`), **cuando** miro la tabla, **entonces** los valores se muestran explícitos o queda vacío según convención canónica.
- **Dado** que un enlace tiene `tipo=Exhibition-Characterization` con subtipo, **cuando** miro la celda `Tipo`, **entonces** se muestra tipo + subtipo concatenados (`Exhibition · Characterization`).

**Reglas y restricciones:**
- Columnas mínimas obligatorias: origen, destino, tipo, etiqueta, origen_multiplicidad, destino_multiplicidad.
- Columnas adicionales opcionales (modificador NOT, Path, Probability, Rate, Units) se delegan a EPICA-15 si se muestran aquí.
- Los valores de origen/destino son **nombres** de cosas, no IDs.

**Modelo de datos tocado:**
- Lectura de `enlace.origen`, `enlace.destino`, `enlace.tipo`, `enlace.subtipo`, `enlace.etiqueta`, `enlace.origen_multiplicidad`, `enlace.destino_multiplicidad`.

**Dependencias:**
- Bloqueada por: HU-16.002.
- Bloquea a: HU-16.004, HU-16.005, HU-16.007.

**Integraciones:**
- Renderer OPL comparte formato canónico de etiqueta.

**Notas de evidencia:**
- Fuente: §5.1 propiedades estructurales (`Multiplicidad de Origen`, `Multiplicidad de Destino`, `tag`, `Ordered`), §6 modelo de datos implícito.
- Frames: frame_00015, frame_00020 (variantes visibles).
- Clase de afirmación: observado en frames + inferido (columnas exactas no detalladas en transcripción).

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, ui, tabla-de-enlaces, columnas, lente].

---

### HU-16.004 — Filtrar Tabla de Enlaces por tipo de enlace

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** L primario; U secundario.
**Superficie UI:** dialogo-modal-tabla-de-enlaces (control de filtro por columna).
**Gesto canónico:** clic en encabezado de columna `Tipo` + selección de valor.

**Historia:**
> Como modelador experto, quiero filtrar la tabla por tipo de enlace (Aggregation, Exhibition, Instrument, Result, …) para enfocar la auditoría en una clase de relación por vez.

**Contexto de negocio:**
En modelos grandes hay muchos tipos mezclados. Revisar solo los Aggregation (p.ej.) permite auditar si la descomposición es correcta sin distraerse con Instrument o Effect. Es patrón estándar en editores tabulares.

**Criterios de aceptación:**
- **Dado** que la tabla tiene múltiples tipos, **cuando** selecciono el valor `Aggregation` en el filtro de `Tipo`, **entonces** solo se muestran filas con ese tipo.
- **Dado** que tengo un filtro activo, **cuando** limpio el filtro, **entonces** vuelven a mostrarse todas las filas.
- **Dado** que combino filtros (p.ej. `Tipo=Instrument` + filtro por etiqueta `controls`), **cuando** aplico, **entonces** solo aparecen filas que cumplan ambos.
- **Dado** que ningún enlace matchea el filtro, **cuando** aplico, **entonces** aparece mensaje `No enlaces match current filters`.

**Reglas y restricciones:**
- El filtro opera sobre la vista; no altera el modelo.
- Los filtros se pierden al cerrar la tabla (no hay persistencia de vista — salvo pregunta abierta).

**Modelo de datos tocado:**
- Ninguno directo.

**Dependencias:**
- Bloqueada por: HU-16.003.

**Integraciones:**
- Lente de enlaces.

**Notas de evidencia:**
- Fuente: §2 tabla superficies (tabla enriquecida con filtros).
- Frames: frame_00015 tabla.
- Clase de afirmación: inferido (filtrado no se narra explícitamente, pero es afordance estándar y la tabla se describe como "enriquecida").
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, ui, tabla-de-enlaces, filtro, requires-clarification].

---

### HU-16.005 — Ordenar Tabla de Enlaces por columna

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** L primario; U secundario.
**Superficie UI:** dialogo-modal-tabla-de-enlaces (encabezados cliceables).
**Gesto canónico:** clic en encabezado de columna.

**Historia:**
> Como modelador experto, quiero ordenar la tabla por cualquier columna (origen, destino, tipo, etiqueta) para inspeccionar por criterio consistente.

**Contexto de negocio:**
Ordenar por origen agrupa las relaciones salientes de cada cosa. Ordenar por tipo agrupa por clase semántica. La ordenación múltiple es una afordance esperada de cualquier tabla no trivial.

**Criterios de aceptación:**
- **Dado** que la tabla está abierta, **cuando** hago clic en el encabezado `Origen`, **entonces** las filas se ordenan alfabéticamente por nombre de source ascendente.
- **Dado** que una columna ya está ordenada ascendente, **cuando** vuelvo a hacer clic, **entonces** pasa a descendente.
- **Dado** que una columna está descendente, **cuando** vuelvo a hacer clic, **entonces** vuelve al orden original (inserción).
- **Dado** que ordeno por `Tipo`, **cuando** hay empates, **entonces** el tiebreaker es por origen alfabético.

**Reglas y restricciones:**
- Solo una columna ordenada activa a la vez (no multi-sort salvo pregunta abierta).
- Ordenación es puramente visual; no altera el modelo.

**Modelo de datos tocado:**
- Ninguno directo.

**Dependencias:**
- Bloqueada por: HU-16.003.

**Notas de evidencia:**
- Fuente: §2 tabla superficies.
- Clase de afirmación: inferido (afordance estándar de tablas; no observado explícitamente).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, ui, tabla-de-enlaces, ordenación, requires-clarification].

---

### HU-16.006 — Navegar al enlace del canvas haciendo clic desde la tabla

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; V secundario.
**Superficie UI:** dialogo-modal-tabla-de-enlaces + canvas-opd.
**Gesto canónico:** clic (o doble clic) en fila.

**Historia:**
> Como modelador experto, quiero ir al enlace correspondiente en el canvas desde una fila de la tabla para pasar de la vista agregada a la inspección visual en un gesto.

**Contexto de negocio:**
La tabla es útil para escaneo; el canvas es útil para contexto geométrico. Navegar entre ambas vistas sin perder la referencia es crítico para modelos grandes. El clic en fila debe resolver: (a) a qué OPD navegar si el enlace aparece en varios, (b) cómo resaltar el enlace.

**Criterios de aceptación:**
- **Dado** que la tabla está abierta, **cuando** hago clic (o doble clic) en una fila, **entonces** la tabla se cierra y el canvas navega al OPD donde ese enlace aparece por primera vez, con el enlace resaltado.
- **Dado** que el enlace aparece en varios OPDs, **cuando** hago clic, **entonces** se abre un selector para elegir el OPD destino (análogo al selector de rama desde OPL §7.1).
- **Dado** que el enlace está en el OPD actual, **cuando** hago clic, **entonces** solo se resalta (no cambia de OPD).
- **Dado** que el resaltado está activo, **cuando** clico en zona vacía del canvas, **entonces** el resaltado se limpia.

**Reglas y restricciones:**
- Resaltado temporal (p.ej. 2 seg) o persistente hasta clic fuera — **pregunta abierta**.
- Si el enlace aparece en 0 OPDs (inconsistencia), se muestra warning.

**Modelo de datos tocado:**
- Ninguno directo.

**Dependencias:**
- Bloqueada por: HU-16.002.
- Relaciona: HU de EPICA-20 (OPD tree) para navegación entre OPDs.

**Integraciones:**
- Canvas selección.
- OPD Navigator.

**Notas de evidencia:**
- Fuente: §2 tabla superficies ("Apertura desde OPL" — patrón análogo), §3.5 (doble clic desde OPL abre propiedades de la relación).
- Frames: frame_00050 carpeta 24 (selector de rama).
- Clase de afirmación: inferido por analogía con el flujo de apertura desde OPL, que sí se narra.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, ui, tabla-de-enlaces, navegación, selector-rama].

---

### HU-16.007 — Editar propiedades de enlace desde la Tabla de Enlaces

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categórico:** K primario (mutación directa); V secundario.
**Superficie UI:** dialogo-modal-tabla-de-enlaces (celdas editables).
**Gesto canónico:** doble clic en celda + escritura/selección.

**Historia:**
> Como modelador experto, quiero editar etiqueta y multiplicidad directamente desde la tabla para hacer ajustes masivos sin abrir el canvas ni el panel de propiedades.

**Contexto de negocio:**
La edición in-place en tabla es la afordance estándar para edición masiva (pensar en planillas). Cambiar etiqueta de 20 enlaces desde una tabla es mucho más rápido que hacerlo uno por uno vía panel de propiedades.

**Criterios de aceptación:**
- **Dado** que la tabla está abierta, **cuando** hago doble clic en la celda `Etiqueta` de una fila, **entonces** la celda entra en modo edición con un input o selector.
- **Dado** que edito la celda `Multiplicidad de Origen`, **cuando** selecciono `N`, **entonces** el modelo actualiza `enlace.origen_multiplicidad` y el canvas refleja el cambio en tiempo casi real.
- **Dado** que edito y confirmo (`Enter` o blur), **cuando** el valor es válido, **entonces** se persiste; **cuando** es inválido, **entonces** se revierte y se muestra warning.
- **Dado** que edito y cancelo (ESC), **cuando** salgo del modo edición, **entonces** el valor original se mantiene.

**Reglas y restricciones:**
- Solo ciertas celdas son editables: etiqueta, origen_multiplicidad, destino_multiplicidad. Origen/Destino son **read-only** (cambiar origen/destino = cambiar el enlace — se hace en canvas).
- Tipo es read-only en tabla; cambiar tipo = reemplazar enlace desde canvas.

**Modelo de datos tocado:**
- `enlace.etiqueta` — string — persistente.
- `enlace.origen_multiplicidad` — string — persistente.
- `enlace.destino_multiplicidad` — string — persistente.

**Dependencias:**
- Bloqueada por: HU-16.003.
- Relaciona: HU-16.009, HU-16.011, HU-16.014 (edición análoga desde panel de propiedades).

**Integraciones:**
- Renderer canvas (actualización de etiqueta visible).
- panel OPL-ES (frase actualizada).

**Notas de evidencia:**
- Fuente: §2 tabla superficies + §7.1 (OPL es "segundo punto de entrada para editar enlaces, no solo salida" — por simetría, la tabla es tercer punto).
- Clase de afirmación: inferido.
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [canvas, kernel, tabla-de-enlaces, edición-in-place, bulk, requires-clarification].

---

### HU-16.008 — Abrir panel de propiedades al seleccionar enlace en canvas

**Actor primario:** MN (modelador novato).
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; V secundario.
**Superficie UI:** canvas-opd + panel-de-propiedades (lateral o dialogo).
**Gesto canónico:** clic derecho sobre enlace (o clic + abrir panel).

**Historia:**
> Como modelador, quiero que al seleccionar un enlace del canvas se me ofrezca un panel de propiedades con sus atributos editables para cambiar etiqueta, multiplicidad y otras propiedades sin salir del contexto visual.

**Contexto de negocio:**
El panel de propiedades es la superficie principal de edición fina de un enlace. Centraliza todos los atributos (etiqueta, multiplicidad, path, probability, rate, units, ordered, NOT, in-out) en un único lugar junto al enlace. Es simétrico al panel de propiedades de cosas.

**Criterios de aceptación:**
- **Dado** que hay un enlace en el canvas, **cuando** hago clic derecho sobre él, **entonces** se abre el panel de propiedades con todos sus atributos visibles.
- **Dado** que el panel está abierto, **cuando** selecciono otro enlace, **entonces** el panel cambia su contenido al nuevo enlace sin cerrarse (si el panel es lateral).
- **Dado** que el panel está abierto, **cuando** hago clic en zona vacía del canvas, **entonces** el panel se cierra (si es dialogo) o queda vacío (si es lateral).
- **Dado** que el enlace tiene subtipos válidos (p.ej. Instrument Condition), **cuando** miro el panel, **entonces** expone el control para cambiar subtipo.

**Reglas y restricciones:**
- Activador por defecto: clic derecho (§2 tabla superficies: "Clic derecho sobre un enlace → Selección de relación").
- El panel muestra **todas** las propiedades aplicables al tipo de enlace (no solo las definidas). Propiedades vacías aparecen con placeholder.
- Ubicación (lateral vs dialogo flotante): **pregunta abierta**.

**Modelo de datos tocado:**
- Ninguno directo (solo lectura para mostrar estado).

**Dependencias:**
- Bloqueada por: HU-10.011 (enlace debe existir).
- Bloquea a: HU-16.009, HU-16.011, HU-16.014, HU-16.015.

**Integraciones:**
- Panel de Estilo (HU-16.015) se abre desde el panel de propiedades o es parte del mismo.
- Ayuda contextual `?` junto a cada campo (§2 tabla superficies).

**Notas de evidencia:**
- Fuente: §2 tabla superficies, §3.1 (flujo clic derecho → cambia etiqueta → multiplicidad).
- Frames: frame_00001 (baseline de propiedades), frame_00008 (primeras propiedades visibles).
- Clase de afirmación: observado + confirmado por transcripción.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [canvas, ui, panel-de-propiedades, selección, enlaces, clic-derecho].

---

### HU-16.009 — Editar etiqueta del enlace desde panel de propiedades

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categórico:** K primario; V secundario.
**Superficie UI:** panel-de-propiedades (campo Etiqueta).
**Gesto canónico:** escritura en input o selección de dropdown.

**Historia:**
> Como modelador, quiero editar la etiqueta de un enlace (texto corto visible sobre la línea) para darle nombre semántico a la relación más allá de su tipo OPM.

**Contexto de negocio:**
El tipo OPM (Instrument, Effect, etc.) es la clase semántica; la etiqueta es la **etiqueta natural** que el modelador pone para especificar la relación ("controls", "sends message to", "measures"). Sin etiqueta, dos Instruments paralelos son indistinguibles para el lector.

**Criterios de aceptación:**
- **Dado** que un enlace tiene `etiqueta=""` y el panel está abierto, **cuando** escribo `controls` en el campo Etiqueta y confirmo, **entonces** el canvas imprime `controls` sobre la línea del enlace.
- **Dado** que un enlace ya tiene etiqueta `controls`, **cuando** cambio a `monitors` y confirmo, **entonces** el canvas actualiza.
- **Dado** que confirmo con etiqueta vacío, **cuando** el canvas re-renderiza, **entonces** no se imprime ninguna etiqueta.
- **Dado** que cambié la etiqueta, **cuando** consulto OPL, **entonces** la frase refleja el nueva etiqueta (p.ej. `Driver controls Car` en lugar de relación genérica).

**Reglas y restricciones:**
- Confirmación: `Enter` o blur.
- Cancelación: `ESC` revierte.
- Longitud: sin límite estricto observado; convención práctica 2–4 palabras.
- Caracteres especiales: permitidos.

**Modelo de datos tocado:**
- `enlace.etiqueta` — string — persistente.

**Dependencias:**
- Bloqueada por: HU-16.008.
- Relaciona: HU-16.010 (etiquetas canónicas).

**Integraciones:**
- Renderer (dibuja la etiqueta sobre línea del enlace).
- panel OPL-ES (verbaliza etiqueta en la frase).

**Notas de evidencia:**
- Fuente: §3.1 paso 2 ("Cambia `tag` a `controls`"), §5.1 (etiqueta en propiedades estructurales).
- Frames: frame_00018 (etiqueta), frame_00024 (continuidad estructural).
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [canvas, kernel, enlaces, etiqueta, panel-de-propiedades].

---

### HU-16.010 — Seleccionar etiqueta canónica de lista (controls, relates to, communicates via)

**Actor primario:** MN.
**Actores secundarios:** AD (autor de dominio — amplía la lista).
**Tipo:** opm-semantica.
**Nivel categórico:** U primario; K secundario.
**Superficie UI:** panel-de-propiedades (dropdown del campo Etiqueta).
**Gesto canónico:** selección desde dropdown.

**Historia:**
> Como modelador novato, quiero elegir la etiqueta desde una lista de valores canónicos (controls, relates to, communicates via, sends, measures, …) para usar vocabulario consistente y reducir errores de naming.

**Contexto de negocio:**
Un dropdown con etiquetas canónicas enseña gramática de dominio y asegura consistencia terminológica en equipos grandes. Complementa la escritura libre (HU-16.009) sin bloquearla. El set canónico inicial se inspira en OPM SSOT (relates to, consists of) y en vocabulario de systems engineering (controls, measures, actuates, senses).

**Criterios de aceptación:**
- **Dado** que el panel de propiedades está abierto, **cuando** hago clic en el campo Etiqueta, **entonces** aparece un dropdown con etiquetas canónicas sugeridas y opción `Custom...` al final.
- **Dado** que selecciono una etiqueta canónica (p.ej. `communicates via`), **cuando** confirmo, **entonces** la etiqueta se asigna al enlace.
- **Dado** que selecciono `Custom...`, **cuando** aparece el input, **entonces** puedo escribir cualquier string (mismo flujo que HU-16.009).
- **Dado** que una etiqueta custom usada previamente, **cuando** abro otro enlace dropdown, **entonces** la etiqueta aparece sugerida al final de la lista canónica (sección `Recently used`).

**Reglas y restricciones:**
- Lista canónica base: al menos `controls`, `relates to`, `communicates via`. Extensible por ontología de organización (EPICA-82).
- Las etiquetas custom no se auto-promueven a canónicas; deben registrarse vía ontología de org.
- La lista canónica depende del tipo de enlace (algunas etiquetas no aplican a Aggregation, por ejemplo).

**Modelo de datos tocado:**
- `enlace.etiqueta` — string — persistente.
- `org.tag_vocabulary[]` — array — persistente (delegado a EPICA-82).

**Dependencias:**
- Bloqueada por: HU-16.009.
- Relaciona: EPICA-82 (organization ontology) para ampliar vocabulario.

**Integraciones:**
- Ontología de organización (read).

**Notas de evidencia:**
- Fuente: §3.1 (ejemplo concreto `controls`).
- Clase de afirmación: inferido (el vocabulario se ilustra con un ejemplo, pero la lista canónica completa no se enumera).
- Etiqueta: `requires-clarification`.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, ui, enlaces, etiqueta, ontología, requires-clarification].

---

### HU-16.011 — Editar Multiplicidad de Origen con selector

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categórico:** K primario; V secundario.
**Superficie UI:** panel-de-propiedades (campo Multiplicidad de Origen).
**Gesto canónico:** selección en dropdown o escritura.

**Historia:**
> Como modelador experto, quiero editar la multiplicidad del extremo source del enlace para precisar la cardinalidad de la relación (cuántos sources por destino).

**Contexto de negocio:**
Multiplicidad es una propiedad estructural OPM crítica (§5.1): dice si la relación es 1:1, 1:N, N:N, etc. Se aplica sobre enlaces estructurales (Aggregation, Exhibition, Generalization) y también puede marcarse en enlaces procedurales con semántica específica. El canvas renderiza la multiplicidad junto al extremo correspondiente.

**Criterios de aceptación:**
- **Dado** que un enlace estructural está seleccionado y el panel abierto, **cuando** cambio Multiplicidad de Origen a `N`, **entonces** el canvas dibuja `N` junto al extremo source del enlace.
- **Dado** que cambio Multiplicidad de Origen, **cuando** consulto OPL, **entonces** la frase se pluraliza consistentemente (`N controllers control ...` en lugar de `1 controller controls ...`).
- **Dado** que el tipo de enlace no admite multiplicidad (pregunta abierta — §11.2 doc fuente), **cuando** abro el panel, **entonces** el campo Multiplicidad de Origen aparece deshabilitado.
- **Dado** que dejo multiplicidad por defecto (1), **cuando** miro el canvas, **entonces** no se imprime texto (convención: 1 es implícito).

**Reglas y restricciones:**
- Default: `1`.
- La anotación visual se dibuja junto al extremo correspondiente (source en HU-16.011; target en HU-16.014).
- Si ambos extremos son 1, no se imprime nada; si solo uno es distinto de 1, solo se imprime ese.

**Modelo de datos tocado:**
- `enlace.origen_multiplicidad` — string — persistente.

**Dependencias:**
- Bloqueada por: HU-16.008.
- Bloquea a: HU-16.012, HU-16.013.

**Integraciones:**
- Renderer (anotación visual).
- panel OPL-ES (pluralización).

**Notas de evidencia:**
- Fuente: §3.1 paso 3, §5.1, §6.
- Frames: frame_00034 (multiplicidad en agregación), frame_00038 (variación de cuantificadores).
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, kernel, enlaces, multiplicidad, panel-de-propiedades].

---

### HU-16.012 — Elegir multiplicidad canónica (1, 0..1, N, 0..N, custom)

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categórico:** U primario; K secundario.
**Superficie UI:** panel-de-propiedades (dropdown de multiplicidad).
**Gesto canónico:** selección en dropdown.

**Historia:**
> Como modelador experto, quiero elegir la multiplicidad de una lista de valores canónicos (1, 0..1, N, 0..N, 1..N, custom) para cubrir los casos comunes sin tener que escribir sintaxis.

**Contexto de negocio:**
La multiplicidad canónica OPM/UML usa un set cerrado de valores frecuentes. Exponerlos como dropdown reduce errores de sintaxis y enseña las convenciones. La opción `custom` abre la puerta a rangos paramétricos (HU-16.013).

**Criterios de aceptación:**
- **Dado** que abro el dropdown de Multiplicidad de Origen, **cuando** miro las opciones, **entonces** veo al menos: `1`, `0..1`, `N`, `0..N`, `1..N`, `?`, `*`, `+`, `Custom...`.
- **Dado** que selecciono `0..N`, **cuando** confirmo, **entonces** el canvas imprime `0..N` junto al source.
- **Dado** que selecciono `*`, **cuando** consulto OPL, **entonces** la frase refleja "cero o más" apropiadamente.
- **Dado** que selecciono `Custom...`, **cuando** aparece el input, **entonces** paso a HU-16.013.

**Reglas y restricciones:**
- Abreviaturas canónicas (§3.2 doc fuente):
  - `1` literal,
  - `0..1` — opcional (equivalente a `?`),
  - `N`, `0..N`, `1..N` — rangos con `..`,
  - `?` — opcional (alias de `0..1`),
  - `*` — cero o muchos (alias de `0..N`),
  - `+` — uno o muchos (alias de `1..N`).
- Orden del dropdown: numéricos simples primero, luego símbolos, luego Custom.
- Selección cambia `enlace.origen_multiplicidad` a la representación canónica elegida (no a su alias).

**Modelo de datos tocado:**
- `enlace.origen_multiplicidad` — string canónico — persistente.

**Dependencias:**
- Bloqueada por: HU-16.011.

**Integraciones:**
- Renderer.
- panel OPL-ES (pluralización).

**Notas de evidencia:**
- Fuente: §3.2 (lista explícita de abreviaturas).
- Frames: frame_00038 (variación de cuantificadores).
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, ui, enlaces, multiplicidad, dropdown].

---

### HU-16.013 — Ingresar multiplicidad custom con validación

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categórico:** K primario; V secundario.
**Superficie UI:** panel-de-propiedades (input Custom multiplicidad).
**Gesto canónico:** escritura + confirmación.

**Historia:**
> Como modelador experto, quiero escribir una expresión paramétrica de multiplicidad (`n`, `n..m`, `n<=4`) para modelar restricciones cuantitativas precisas.

**Contexto de negocio:**
La transcripción confirma soporte de "expresiones paramétricas con restricción (`n<=4`)". Esto es necesario para dominios donde la cardinalidad no es un valor fijo sino una variable acotada. Es un diferencial fuerte del lenguaje.

**Criterios de aceptación:**
- **Dado** que selecciono `Custom...`, **cuando** escribo `3` y confirmo, **entonces** el canvas imprime `3` y el OPL usa cardinalidad fija.
- **Dado** que escribo `2..5` y confirmo, **cuando** se renderiza, **entonces** el canvas imprime `2..5` y el OPL dice `between 2 and 5`.
- **Dado** que escribo `n<=4` y confirmo, **cuando** se renderiza, **entonces** el canvas imprime `n<=4` y el OPL dice `where n<=4` (anotación de restricción).
- **Dado** que escribo una expresión inválida (p.ej. `3..1` con rango invertido), **cuando** intento confirmar, **entonces** se muestra warning rojo y el valor no se persiste hasta corregir.

**Reglas y restricciones:**
- Gramática aceptada:
  - número entero positivo,
  - rango `n..m` con `n <= m`,
  - variable con restricción `var OP valor` con `OP ∈ {<=, <, =, >, >=}`,
  - símbolos `?`, `*`, `+`.
- Validador rechaza: rangos invertidos, caracteres no permitidos, expresiones ambiguas.
- Serialización: string tal como fue ingresada; la validación es en escritura (input gate), no en lectura.

**Modelo de datos tocado:**
- `enlace.origen_multiplicidad` — string — persistente.
- `enlace.origen_multiplicidad_constraint` — string opcional — persistente (cuando se usa `where`).

**Dependencias:**
- Bloqueada por: HU-16.012.

**Integraciones:**
- Validador de kernel (gramática de multiplicidad).
- panel OPL-ES (verbalización de restricción).

**Notas de evidencia:**
- Fuente: §3.2 (expresiones paramétricas con restricción), §9 convención no normativa (la restricción cuantitativa usa `;`).
- Clase de afirmación: confirmado por transcripción (la expresión `n<=4` es cita textual).
- Etiqueta pregunta abierta: cómo se serializa internamente la restricción `where` (§11.3 doc fuente). Etiqueta `requires-clarification`.

**Prioridad:** M1.
**Tamano:** M.
**Etiquetas:** [canvas, kernel, enlaces, multiplicidad, custom, validación, requires-clarification].

---

### HU-16.014 — Editar Multiplicidad de Destino con selector análogo

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categórico:** K primario; V secundario.
**Superficie UI:** panel-de-propiedades (campo Multiplicidad de Destino).
**Gesto canónico:** selección en dropdown o escritura.

**Historia:**
> Como modelador experto, quiero editar la multiplicidad del extremo target del enlace con la misma afordance que el source para definir cardinalidad bidireccional (n:m).

**Contexto de negocio:**
Source y Target multiplicidad son **simétricos**: juntas definen la cardinalidad completa (1:1, 1:N, N:M). Deben tener misma afordance para reducir carga cognitiva. La anotación visual va junto al extremo target.

**Criterios de aceptación:**
- **Dado** que el panel está abierto, **cuando** abro el dropdown `Multiplicidad de Destino`, **entonces** veo las mismas opciones que `Multiplicidad de Origen` (HU-16.012).
- **Dado** que selecciono `N` en Multiplicidad de Destino, **cuando** confirmo, **entonces** el canvas dibuja `N` junto al extremo target.
- **Dado** que ambos extremos son distintos de 1 (p.ej. 1..N en source y 0..N en target), **cuando** miro el canvas, **entonces** ambos valores aparecen dibujados en sus respectivos extremos.
- **Dado** que mix source=`*` y target=`1`, **cuando** consulto OPL, **entonces** la frase refleja la cardinalidad asimétrica.

**Reglas y restricciones:**
- Mismas reglas de gramática que HU-16.011/012/013.
- La renderización visual debe **no superponer** con la etiqueta dla etiqueta ni con la multiplicidad del otro extremo.

**Modelo de datos tocado:**
- `enlace.destino_multiplicidad` — string canónico — persistente.
- `enlace.destino_origen_multiplicidad_constraint` — string opcional — persistente.

**Dependencias:**
- Bloqueada por: HU-16.008, HU-16.011.

**Integraciones:**
- Renderer.
- panel OPL-ES.

**Notas de evidencia:**
- Fuente: §5.1 (propiedades estructurales lista ambas multiplicidades).
- Frames: frame_00034 (agregación con multiplicidad en ambos extremos).
- Clase de afirmación: observado + inferido por simetría.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, kernel, enlaces, multiplicidad, target].

---

### HU-16.015 — Abrir Panel de Estilo de un enlace

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; V secundario.
**Superficie UI:** panel-de-propiedades (sección Style) o dialogo Estilo independiente.
**Gesto canónico:** clic en botón `Style` o tab `Style` del panel de propiedades.

**Historia:**
> Como modelador experto, quiero abrir un panel de estilo para un enlace para ajustar color, grosor y patrón sin tener que editar la semántica.

**Contexto de negocio:**
Estilo visual y semántica son ejes ortogonales: dos enlaces pueden ser semánticamente idénticos (mismo tipo, etiqueta, multiplicidad) y visualmente distintos para diferenciar dominios o importancia. El Panel de Estilo es el locus oficial para estas ediciones.

**Criterios de aceptación:**
- **Dado** que un enlace está seleccionado, **cuando** activo `Style` (desde panel de propiedades o menú contextual), **entonces** se abre un panel con controles de color, grosor y patrón.
- **Dado** que el panel de estilo está abierto, **cuando** cierro (clic fuera, ESC), **entonces** el estilo del enlace mantiene lo último aplicado.
- **Dado** que el enlace no tiene estilo custom aún, **cuando** abro el panel, **entonces** los controles muestran los valores por defecto (heredados del tipo de enlace o de la organización — EPICA-81).

**Reglas y restricciones:**
- El Panel de Estilo es subsección del panel de propiedades, o panel propio accesible desde él — **pregunta abierta** sobre ubicación exacta.
- Los cambios son persistentes inmediatamente (no hay botón Save separado).
- Solo afecta este enlace, no todos los del mismo tipo (para eso ver HU-16.022).

**Modelo de datos tocado:**
- Ninguno hasta que se edita (lectura de defaults).

**Dependencias:**
- Bloqueada por: HU-16.008.
- Bloquea a: HU-16.016, HU-16.017, HU-16.018, HU-16.019, HU-16.021.
- Relaciona: EPICA-14 (canvas styling) para cosas; EPICA-81 (estilo defaults) para valores base.

**Integraciones:**
- EPICA-14 comparte la semántica de Panel de Estilo para cosas.
- EPICA-81 (config organizacional) aporta defaults.

**Notas de evidencia:**
- Fuente: §5.3 accesos auxiliares (`Style`, `Copiar Estilo`), §2 tabla superficies.
- Clase de afirmación: observado en listado de accesos auxiliares del doc fuente.
- Etiqueta: `requires-clarification` sobre ubicación exacta.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, ui, panel-de-estilo, enlaces, requires-clarification].

---

### HU-16.016 — Cambiar color del enlace desde Panel de Estilo

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** V primario.
**Superficie UI:** panel-de-estilo (color picker).
**Gesto canónico:** selección en color picker.

**Historia:**
> Como modelador experto, quiero cambiar el color de un enlace para destacarlo visualmente (rojo crítico, verde OK, gris auxiliar) sin tocar su semántica.

**Contexto de negocio:**
Color es el vector de comunicación visual más rápido. Modelos complejos se vuelven legibles cuando grupos de enlaces comparten color. OPCloud expone color como propiedad editable por enlace (y por tipo vía defaults — EPICA-81).

**Criterios de aceptación:**
- **Dado** que el Panel de Estilo está abierto, **cuando** uso el color picker y elijo un color, **entonces** el enlace se redibuja con ese color inmediatamente.
- **Dado** que elijo color hexadecimal custom (ingreso `#FF8800`), **cuando** confirmo, **entonces** el enlace persiste con ese color.
- **Dado** que cambié el color, **cuando** guardo y recargo, **entonces** el color persiste.
- **Dado** que elimino el enlace, **cuando** lo vuelvo a crear por arrastre, **entonces** usa color por defecto (no hereda del eliminado).

**Reglas y restricciones:**
- Formato: hex `#RRGGBB` o named CSS color. Paleta sugerida en picker.
- El color afecta solo al enlace, no a las etiquetas (etiqueta, multiplicidad) — pregunta abierta sobre si las etiquetas heredan.
- Default: color del tipo de enlace heredado de EPICA-81.

**Modelo de datos tocado:**
- `enlace.estilo.color` — string hex — persistente nullable (null = heredar default).

**Dependencias:**
- Bloqueada por: HU-16.015.

**Integraciones:**
- Renderer JointJS (`src/render/jointjs/`).
- EPICA-81 (estilo defaults por organización).

**Notas de evidencia:**
- Fuente: §5.3 accesos auxiliares (Estilo existe), §7.2 canvas como vista final.
- Clase de afirmación: inferido (controles específicos no se enumeran en el doc, pero Estilo y Copiar Estilo sí se listan).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, render, estilo, enlaces, color, requires-clarification].

---

### HU-16.017 — Cambiar grosor (width) del enlace

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** V primario.
**Superficie UI:** panel-de-estilo (slider o input numérico de grosor).
**Gesto canónico:** arrastre de slider o escritura de valor.

**Historia:**
> Como modelador experto, quiero cambiar el grosor de un enlace para jerarquizar visualmente (gruesos = relaciones críticas, finos = secundarias).

**Contexto de negocio:**
Grosor es el segundo vector visual más simple después de color. Permite jerarquizar sin saturar de color. La combinación color + grosor + patrón cubre casi todas las necesidades de diferenciación visual.

**Criterios de aceptación:**
- **Dado** que el Panel de Estilo está abierto, **cuando** cambio el grosor slider de `1` a `3`, **entonces** el enlace se redibuja con línea más gruesa.
- **Dado** que elijo un grosor extremo (muy grueso o muy fino), **cuando** aplico, **entonces** se respeta pero se muestra warning si afecta legibilidad de etiquetas.
- **Dado** que persisto el cambio, **cuando** recargo, **entonces** el grosor persiste.

**Reglas y restricciones:**
- Rango: `1..8` pixels (convención práctica).
- Default: `1` (o valor heredado de EPICA-81).
- Valores fraccionarios: permitidos (p.ej. `1.5`).

**Modelo de datos tocado:**
- `enlace.estilo.grosor` — number — persistente nullable.

**Dependencias:**
- Bloqueada por: HU-16.015.

**Integraciones:**
- Renderer.

**Notas de evidencia:**
- Fuente: §5.3 (Style).
- Clase de afirmación: inferido.
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, render, estilo, enlaces, grosor, requires-clarification].

---

### HU-16.018 — Cambiar patrón (pattern) del enlace (sólido, discontinuo, punteado)

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** V primario.
**Superficie UI:** panel-de-estilo (selector de patrón).
**Gesto canónico:** selección en dropdown.

**Historia:**
> Como modelador experto, quiero elegir el patrón del enlace (sólido, discontinuo, punteado) para distinguir grupos de relaciones con el mismo color.

**Contexto de negocio:**
Patrón es el tercer vector visual. Útil cuando color ya está saturado o cuando el documento se imprime en blanco y negro. Dashed reserva convencional para relaciones "débiles" o "ambientales"; sólido para "fuertes"; punteado para "especulativas".

**Criterios de aceptación:**
- **Dado** que el Panel de Estilo está abierto, **cuando** selecciono `discontinuo` en el dropdown Patrón, **entonces** el enlace se redibuja con línea discontinuo.
- **Dado** que opciones disponibles son `sólido`, `discontinuo`, `punteado` (mínimo), **cuando** abro el dropdown, **entonces** veo esas tres al menos.
- **Dado** que persisto el cambio, **cuando** recargo, **entonces** el patrón persiste.
- **Dado** que el tipo de enlace ya usa discontinuo por semántica (p.ej. alguna convención OPM específica), **cuando** cambio patrón, **entonces** el Estilo override sobrescribe el default pero aparece warning sobre pérdida de pista semántica.

**Reglas y restricciones:**
- Valores canónicos: `sólido`, `discontinuo`, `punteado`. Variantes custom (dash patrón) pueden agregarse como `custom` — pregunta abierta.
- Default: `sólido`.

**Modelo de datos tocado:**
- `enlace.estilo.patrón` — `"sólido" | "discontinuo" | "punteado"` — persistente nullable.

**Dependencias:**
- Bloqueada por: HU-16.015.

**Integraciones:**
- Renderer.

**Notas de evidencia:**
- Fuente: §5.3 (Style).
- Clase de afirmación: inferido.
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, render, estilo, enlaces, patrón, requires-clarification].

---

### HU-16.019 — Copiar estilo de un enlace (Copiar Estilo)

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario.
**Superficie UI:** panel-de-estilo (botón Copiar Estilo) o menú contextual.
**Gesto canónico:** clic en Copiar Estilo.

**Historia:**
> Como modelador experto, quiero copiar el estilo de un enlace (color, grosor, patrón) para pegarlo en otros enlaces y lograr coherencia visual.

**Contexto de negocio:**
Copy/Paste de estilo es la afordance estándar para propagar decisiones visuales sin configurar cada enlace una y otra vez. Critical para modelos grandes donde grupos de enlaces deben verse iguales.

**Criterios de aceptación:**
- **Dado** que un enlace está seleccionado y tiene estilo custom, **cuando** hago clic en `Copiar Estilo`, **entonces** el estilo se guarda en un buffer temporal (clipboard interno).
- **Dado** que hice Copiar Estilo, **cuando** consulto visualmente, **entonces** aparece confirmación (toast `Estilo copied` o cursor cambia indicando paste-ready).
- **Dado** que no hice Copiar Estilo aún, **cuando** intento Pegar Estilo, **entonces** el botón Paste aparece deshabilitado.
- **Dado** que hice Copiar Estilo y luego cierro el modelo, **cuando** abro otro modelo, **entonces** el buffer **no** persiste entre sesiones (pregunta abierta).

**Reglas y restricciones:**
- Copia completa: color, grosor, patrón. Propiedades semánticas (etiqueta, multiplicidad) NO se copian.
- Un solo buffer activo (último copy gana).
- No cambia el modelo, solo el clipboard interno.

**Modelo de datos tocado:**
- `app.styleClipboard` — objeto transitorio — **no persistente**.

**Dependencias:**
- Bloqueada por: HU-16.015, HU-16.016, HU-16.017, HU-16.018 (debe existir estilo custom que copiar).
- Bloquea a: HU-16.020.

**Integraciones:**
- AppState (buffer de estilo).

**Notas de evidencia:**
- Fuente: §5.3 accesos auxiliares (`Copiar Estilo` listado explícitamente).
- Clase de afirmación: observado en listado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, ui, estilo, copy-paste, clipboard].

---

### HU-16.020 — Pegar estilo en otro enlace (Pegar Estilo)

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** V primario; U secundario.
**Superficie UI:** menú contextual o panel-de-estilo (botón Pegar Estilo).
**Gesto canónico:** clic en Pegar Estilo.

**Historia:**
> Como modelador experto, quiero pegar el estilo previamente copiado en otro enlace para aplicar rápido el mismo look.

**Contexto de negocio:**
Complemento directo de HU-16.019. Sin Paste, Copy no tiene valor. Juntas cierran el bucle de propagación visual.

**Criterios de aceptación:**
- **Dado** que tengo un estilo en el buffer y un enlace seleccionado, **cuando** activo `Pegar Estilo`, **entonces** el enlace destino recibe color, grosor, patrón del buffer.
- **Dado** que el enlace destino ya tenía estilo custom, **cuando** Paste sobrescribe, **entonces** el estilo previo se pierde (sin undo específico de paste, usa undo global).
- **Dado** que hago Paste en N enlaces consecutivos, **cuando** todos reciben el mismo estilo, **entonces** el buffer permanece disponible (no se consume).
- **Dado** que el buffer está vacío, **cuando** intento Paste, **entonces** el botón aparece deshabilitado y no hay acción.

**Reglas y restricciones:**
- Paste aplica solo si source y destino son del mismo dominio visual (enlace). Paste de estilo de enlace sobre cosa: no aplica (o se filtran propiedades — pregunta abierta).
- La operación es atómica y soporta undo (se integra con HU-90.xxx).

**Modelo de datos tocado:**
- `enlace.estilo.color`, `enlace.estilo.grosor`, `enlace.estilo.patrón` — persistentes (se sobrescriben desde el buffer).

**Dependencias:**
- Bloqueada por: HU-16.019.

**Integraciones:**
- Undo/redo (EPICA-90).
- Renderer.

**Notas de evidencia:**
- Fuente: inferido por simetría con `Copiar Estilo` (§5.3 listado — solo Copy se nombra, Paste es corolario).
- Clase de afirmación: inferido.
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, ui, estilo, copy-paste, requires-clarification].

---

### HU-16.021 — Restablecer estilo por defecto (Restablecer Estilo)

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** K primario; V secundario.
**Superficie UI:** panel-de-estilo (botón Restablecer Estilo).
**Gesto canónico:** clic en Restablecer Estilo.

**Historia:**
> Como modelador experto, quiero restablecer el estilo de un enlace al default de su tipo para deshacer personalizaciones sin tener que reabrir cada control y limpiarlo.

**Contexto de negocio:**
Sin un Reset, los estilos custom se acumulan y la limpieza toma muchos clics. Reset es el "deshacer visual" rápido: devuelve el enlace al aspecto heredado de su tipo / organización.

**Criterios de aceptación:**
- **Dado** que un enlace tiene `color`, `grosor`, `patrón` custom, **cuando** hago clic en `Restablecer Estilo`, **entonces** todos los overrides se limpian (null) y el enlace vuelve a renderizarse con defaults heredados.
- **Dado** que un enlace ya está en default, **cuando** hago clic en Reset, **entonces** no pasa nada observable (operación idempotente).
- **Dado** que hice Reset, **cuando** miro el Panel de Estilo, **entonces** los controles muestran los valores heredados.
- **Dado** que hice Reset y luego undo, **cuando** consulto, **entonces** los estilos custom previos vuelven.

**Reglas y restricciones:**
- Reset no borra etiqueta, multiplicidad u otras propiedades semánticas — solo `enlace.estilo.*`.
- Undo restaura el estado previo completo.

**Modelo de datos tocado:**
- `enlace.estilo.color`, `enlace.estilo.grosor`, `enlace.estilo.patrón` — set a null — persistente.

**Dependencias:**
- Bloqueada por: HU-16.015.

**Integraciones:**
- Renderer.
- Undo/redo.

**Notas de evidencia:**
- Fuente: inferido (no listado explícito en §5.3 pero corolario natural del Panel de Estilo).
- Clase de afirmación: inferido.
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [canvas, ui, estilo, reset, requires-clarification].

---

### HU-16.022 — Aplicar estilo a todos los enlaces similares (Apply to all similar)

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** V primario; K secundario.
**Superficie UI:** panel-de-estilo (botón Apply to all similar).
**Gesto canónico:** clic en Apply to all similar + confirmación.

**Historia:**
> Como modelador experto, quiero aplicar el estilo actual del enlace seleccionado a todos los enlaces del mismo tipo (o del mismo tipo + etiqueta) para propagar una decisión visual de una sola vez.

**Contexto de negocio:**
Copy/Paste manual es lineal (HU-16.019/020); Apply to all similar es bulk. Para modelos con 50+ enlaces de un tipo, es la única forma escalable de cambiar apariencia global. Se diferencia de EPICA-81 (defaults de organización) en que esta acción es local al modelo, no global.

**Criterios de aceptación:**
- **Dado** que un enlace tiene estilo custom, **cuando** hago clic en `Apply to all similar`, **entonces** aparece diálogo preguntando el scope: `mismo tipo` o `same tipo + misma etiqueta`.
- **Dado** que elijo `mismo tipo`, **cuando** confirmo, **entonces** todos los enlaces del mismo `enlace.tipo` reciben color, grosor, patrón del seleccionado.
- **Dado** que elijo `same tipo + misma etiqueta`, **cuando** confirmo, **entonces** solo los enlaces que coinciden en ambos atributos reciben el estilo.
- **Dado** que aplico, **cuando** hago undo, **entonces** todos los enlaces afectados restauran su estilo previo en un solo paso.

**Reglas y restricciones:**
- Operación atómica bajo undo.
- Similarity criteria: por defecto `mismo tipo`. Variantes: `same tipo + misma etiqueta`, `mismo tipo de origen`, `mismo tipo de destino` — al menos las dos primeras.
- Si no hay otros enlaces similares, el diálogo informa `No similar enlaces found` y no aplica nada.

**Modelo de datos tocado:**
- Múltiples `enlace.estilo.*` actualizados en transacción — persistentes.

**Dependencias:**
- Bloqueada por: HU-16.015, HU-16.016, HU-16.017, HU-16.018.
- Relaciona: EPICA-81 (para promover a default de organización).

**Integraciones:**
- Renderer (bulk re-render).
- Undo/redo (transacción atómica).

**Notas de evidencia:**
- Fuente: inferido por patrón estándar en editores de diagramas.
- Clase de afirmación: inferido (no listado explícito).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [canvas, render, estilo, bulk, requires-clarification].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q16.1**: Shortcut o activador exacto para abrir Tabla de Enlaces global (cf. HU-16.001). El doc fuente no lo transcribe.
- **Q16.2**: Persistencia de filtros y orden entre aperturas de la tabla (cf. HU-16.004, HU-16.005).
- **Q16.3**: Comportamiento exacto del resaltado al navegar desde tabla a canvas: temporal vs persistente (cf. HU-16.006).
- **Q16.4**: Ubicación del panel de propiedades — lateral fijo o dialogo flotante (cf. HU-16.008).
- **Q16.5**: Lista canónica completa de etiquetas y cómo se extiende desde ontología de organización (cf. HU-16.010).
- **Q16.6**: Si Rate y Units existen fuera del dominio de simulación (§11.1 doc fuente — delegado a EPICA-15/B1).
- **Q16.7**: Si `Ordered` puede aplicarse a relaciones no estructurales (§11.2 doc fuente — delegado a EPICA-15).
- **Q16.8**: Cómo se serializa internamente la restricción `where` en multiplicidad custom (§11.3 doc fuente, cf. HU-16.013).
- **Q16.9**: Ubicación exacta del Panel de Estilo (subsección del panel de propiedades vs dialogo independiente) (cf. HU-16.015).
- **Q16.10**: Si el buffer de Copiar Estilo persiste entre sesiones o se pierde al cerrar (cf. HU-16.019).
- **Q16.11**: Si existe un comportamiento explícito documentado para Restablecer Estilo y Apply to all similar (cf. HU-16.021, HU-16.022). El doc fuente solo lista `Style` y `Copiar Estilo` en §5.3 sin detallar reset/bulk.

## Referencias cruzadas

- Doc fuente: `opcloud-reverse/16-canvas-enlaces-propiedades.md`.
- Épicas relacionadas:
  - **EPICA-10** (canvas creación cosas): HU-10.007 a HU-10.011 cubren la creación inicial del enlace y la elección inicial del tipo; esta épica asume ese enlace ya existe.
  - **EPICA-15** (canvas-enlaces-avanzados): variantes avanzadas como NOT, In-Out, Path, Probability, Rate, Units, Ordered — propiedades procedimentales que el panel de propiedades también expone pero que tienen semántica específica en EPICA-15.
  - **EPICA-14** (canvas-styling): Panel de Estilo comparte arquitectura con el estilo de cosas; convenciones visuales viven en EPICA-14.
  - **EPICA-81** (config-style-defaults): valores por defecto de estilos por tipo de enlace, definidos a nivel organización.
  - **EPICA-82** (config-organization-ontology): vocabulario canónico de etiquetas definido a nivel organización (cf. HU-16.010).
  - **EPICA-50** (panel OPL-ES): edición desde OPL por doble clic sobre el nombre del enlace (§3.5 doc fuente); abre el mismo panel de propiedades cubierto aquí.
  - **EPICA-20** (estructura-opd-tree): navegación desde Tabla de Enlaces a OPDs (cf. HU-16.006).
  - **EPICA-90** (interaccion-shortcuts): undo/redo para operaciones Paste, Reset, Apply to all similar.
- Invariantes del repo:
  - `src/nucleo/tipos.ts` — extensión de `Enlace` para incluir `etiqueta`, `origen_multiplicidad`, `destino_multiplicidad`, `estilo`.
  - `src/nucleo/validacion/` — validador de gramática de multiplicidad (`1`, `0..1`, `N`, `n..m`, `var OP valor`).
  - `src/render/jointjs/` — renderer de etiquetas visuales (etiqueta, multiplicidad) sobre enlaces.
  - `src/render/opl-renderer.ts` — pluralización y verbalización de multiplicidad en OPL.
  - `src/ui/` — panel de propiedades, tabla de enlaces dialogo modal, panel de estilo.
  - `src/persistencia/` — serialización de nuevos campos de Enlace.
