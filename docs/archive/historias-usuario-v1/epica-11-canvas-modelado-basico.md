---
epica: "EPICA-11"
titulo: "Canvas — modelado basico (agregacion, bus estructural, multi-seleccion, enlaces procedurales basicos, propiedades, alineacion, borrado multiple)"
doc_fuente: "opcloud-reverse/11-canvas-modelado-basico.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "M0"
hu_emitidas: 27
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "00-METODOLOGIA-HU.md"
---

## Resumen

Esta épica lleva el modelador desde el caso mínimo (un proceso, un objeto, un link) hasta un OPD de dominio completo con jerarquía estructural, roles procedurales, link estructural etiquetado con vértices manuales y guardado explícito. Es la **bisagra entre el arranque y el modelado real**: introduce agregación 1→N con bus vertical, multi-selección para operar en lote, picker taxonómico completo con 13 opciones distribuidas por dirección de drag, subtipos Condition/Event, modificador NOT, alineación de links, borrado multi-apariencia con decisión explícita modelo-vs-apariencia, propiedades del link (multiplicity, tag, style) y edición manual de geometría.

A diferencia de EPICA-10 (creación primitiva), aquí la gramática OPM opera a pleno — el modelador debe elegir entre 6 tipos estructurales O→O, 4 procedurales O→P, 3 de salida P→O, cada uno con su OPL preview, y OPCloud filtra dinámicamente según esencia y dirección. Además aparece por primera vez la **separación modelo vs apariencia**: el link puede existir una vez en el modelo pero varias veces como apariencia en distintos OPDs; borrarlo implica una decisión explícita de scope.

La numeración sigue estrictamente el orden del doc fuente (§3.1 → §5.3 → §10). Las preguntas abiertas de §11 se trazan como HUs `requires-clarification` o como notas en HUs existentes. Las integraciones con EPICA-10 (creación), EPICA-12 (inzoom), EPICA-14 (styling), EPICA-16 (propiedades avanzadas del link) y EPICA-50 (panel OPL-ES) se referencian cuando corresponde.

## Tabla de HU de la épica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|---|
| HU-11.001 | Crear cosa y sus partes en secuencia sobre el mismo OPD | MN | M0 | S | opm-semantica | [V-1] |
| HU-11.002 | Preservar capitalizacion con Auto Format desmarcado en lote | ME | M1 | XS | opcloud-ui | — |
| HU-11.003 | Crear enlace Agregacion-Participacion O→O uno a uno | MN | M0 | S | opm-semantica | [V-3] [OPL-ES S1] |
| HU-11.004 | Fusionar multiples enlaces de agregacion en bus vertical unico | MN | M0 | M | opm-semantica | [V-3] [V-129] |
| HU-11.005 | Multi-seleccionar cosas con Ctrl + clic | ME | M1 | S | opcloud-ui | — |
| HU-11.006 | Seleccionar cosas por lazo con Shift | ME | M1 | S | opcloud-ui | — |
| HU-11.007 | Conectar multi-seleccion al todo con un solo gesto | ME | M1 | M | mixto | [V-3] |
| HU-11.008 | Alinear enlaces seleccionados a la izquierda | ME | M1 | S | opcloud-ui | — |
| HU-11.009 | Crear enlace Instrumento O→P | MN | M0 | S | opm-semantica | [Glos 3.30] [OPL-ES T5] |
| HU-11.010 | Crear enlace Agente O→P sobre objeto fisico | MN | M0 | S | opm-semantica | [Glos 3.3] [OPL-ES T5] |
| HU-11.011 | Verbalizar rol de Agente en OPL-ES con maneja | MN | M0 | XS | opm-semantica | [OPL-ES T5] |
| HU-11.012 | Crear Enlace Estructural Etiquetado Unidireccional O→O | MN | M0 | S | opm-semantica | [V-239] [OPL-ES S5] |
| HU-11.013 | Editar propiedades de enlace por clic derecho | MN | M0 | S | opcloud-ui | — |
| HU-11.014 | Renombrar etiqueta del enlace en dialogo de propiedades | MN | M0 | S | opm-semantica | [OPL-ES S5] |
| HU-11.015 | Configurar multiplicidad origen y destino del enlace | ME | M1 | S | opm-semantica | [Glos 3.60] |
| HU-11.016 | Ajustar estilo visual del enlace en dialogo de propiedades | ME | S | S | opcloud-ui | — |
| HU-11.017 | Copiar estilo de un enlace a otro | ME | S | S | opcloud-ui | — |
| HU-11.018 | Insertar vertice en enlace por clic sobre la linea | ME | M1 | S | mixto | [V-61] |
| HU-11.019 | Reposicionar vertice arrastrandolo | ME | M1 | XS | mixto | [V-61] |
| HU-11.020 | Reanclar extremo del enlace a otro puerto del shape | ME | M1 | S | mixto | [V-61] [JOYAS §7] |
| HU-11.021 | Borrar un enlace desde barra contextual | MN | M0 | XS | opm-semantica | [V-61] |
| HU-11.022 | Decidir alcance de borrado (apariencia vs modelo) | MN | M0 | M | opm-semantica | — |
| HU-11.023 | Borrar varios enlaces seleccionados en lote | ME | M1 | S | opcloud-ui | — |
| HU-11.024 | Guardar modelo explicitamente y ver confirmacion | MN | M0 | S | opcloud-ui | — |
| HU-11.025 | Iniciar enlace desde zona de borde respetando handles y desplazamiento | ME | M0 | M | opm-semantica | [V-61] [JOYAS §4] |
| HU-11.026 | Ver tabla de tipos de enlace filtrada por direccion y tipos | MN | M0 | L | opm-semantica | [V-239] [V-240] |
| HU-11.027 | Seleccionar subtipo Condicion/Evento y modificador NOT en la tabla | ME | M1 | M | opm-semantica | [V-239] [OPL-ES §2] |

Total: **27 historias de usuario**.

## Historias de usuario

### HU-11.001 — Crear cosa y sus partes en secuencia sobre el mismo OPD

**Actor primario:** MN (modelador novato).
**Actores secundarios:** ME.
**Tipo:** opm-semantica.

**Nivel categórico:** K (kernel) primario; V (render), U (popup) secundarios.
**Superficie UI:** main-toolbar + canvas-opd + popup-auto-format.
**Gesto canónico:** drags consecutivos desde toolbar al canvas.

**Historia:**
> Como modelador novato, quiero crear el whole y luego varias partes en el mismo OPD en secuencia rápida para armar la descomposición estructural sin cambiar de contexto.

**Contexto de negocio:**
La descomposición estructural (un sistema y sus partes) es el patrón OPM más frecuente. El modelador necesita poder generar un whole y 3–5 parts en menos de un minuto, sin popups que bloqueen el flujo entre creación y creación. El caso canónico del reverse lo ilustra con `OnStar System` + 4 partes (`GPS`, `Cellular Network`, `VCIM`, `OnStar Console`).

**Criterios de aceptación:**
- **Dado** que creé un object `OnStar System` con el flujo base, **cuando** inmediatamente arrastro otro ícono de object al canvas, **entonces** se crea el segundo object sin perder el primero, y el popup de naming aparece para el nuevo.
- **Dado** que creo 4 cosas en secuencia, **cuando** termino, **entonces** las 4 quedan en canvas, las 4 aparecen en biblioteca lateral y las 4 tienen oración OPL.
- **Dado** que estoy en medio del popup de naming de la cosa N, **cuando** confirmo, **entonces** el canvas queda listo para recibir el siguiente drag sin esperar.
- **Dado** que creo cosas con nombres largos (`VCIM - Vehicle Comm & interface Module`), **cuando** miro el canvas, **entonces** el nombre se parte en varias líneas dentro del rectángulo.

**Reglas y restricciones:**
- Cada creación es atómica (HU-10.001/002); esta HU solo asegura que la secuencia es fluida.
- Convención de line-wrap para nombres largos derivada de §9 fuente.

**Modelo de datos tocado:**
- Hereda de HU-10.001/002 (ninguna primitiva nueva).

**Dependencias:**
- Bloqueada por: HU-10.001, HU-10.002, HU-10.003.
- Bloquea a: HU-11.003 (requiere varias cosas para conectar).

**Integraciones:**
- Biblioteca lateral (se actualiza por cada creación).
- panel OPL-ES (acumula oraciones).

**Notas de evidencia:**
**Fuente normativa primaria:** [V-1]
- Fuente: `opcloud-reverse/11-canvas-modelado-basico.md` §3.1.
- Frames: frame_00001, frame_00007, frame_00013.
- Transcripción: "el usuario agrega OnStar System... agrega GPS, Cellular Network, VCIM..."
- Clase de afirmación: observado + confirmado por transcripción.

**Prioridad:** M0.
**Tamaño:** S.
**Etiquetas:** [canvas, kernel, creación, secuencia, line-wrap].

---

### HU-11.002 — Preservar casing de nombres con Auto Format desmarcado en lote

**Actor primario:** ME.
**Tipo:** opcloud-ui.

**Nivel categórico:** U primario; K secundaria.
**Superficie UI:** popup-auto-format.
**Gesto canónico:** desmarcar checkbox Auto Format en cada creación.

**Historia:**
> Como modelador experto, quiero poder desmarcar Auto Format de forma consistente al crear un lote de cosas con casing no convencional (marcas, acrónimos) para que el nombre se respete como lo escribí.

**Contexto de negocio:**
Dominios reales (automotriz, eHealth, tecnología) abundan en nombres con casing no trivial: `OnStar`, `VCIM`, `iOS`, `eBay`. La normalización title-case destruye semántica. El reverse explicita esta fricción: "Auto Format puede ser un obstáculo cuando el dominio necesita casing no convencional". Esta HU cubre el escenario batch; HU-10.006 cubre el caso atómico.

**Criterios de aceptación:**
- **Dado** que creo 4 cosas en secuencia con nombres de casing no convencional, **cuando** desmarco Auto Format en cada popup, **entonces** los 4 nombres persisten sin alteración.
- **Dado** que acabo de desmarcar Auto Format en un popup, **cuando** abro el siguiente popup (siguiente creación), **entonces** el default vuelve a marcado (no es sticky en sesión, salvo setting global §EPICA-81).
- **Dado** que mezclo cosas con y sin Auto Format en el mismo lote, **cuando** miro el resultado, **entonces** cada cosa refleja su elección individual.

**Reglas y restricciones:**
- Sticky de la preferencia entre popups: **pregunta abierta**; se asume no-sticky por default.
- Setting global de organización: delegado a EPICA-81.

**Modelo de datos tocado:**
- Ninguno directo; `thing.name` se persiste con el casing elegido.

**Dependencias:**
- Bloqueada por: HU-10.006.

**Integraciones:**
- Configuración de organización (EPICA-81) — potencial default global.

**Notas de evidencia:**
**Fuente normativa primaria:** —
- Fuente: §3.1 paso 2, §9.
- Transcripción: "desmarca Auto Format para preservar el casing OnStar".
- Clase de afirmación: observado + confirmado.

**Prioridad:** M1.
**Tamaño:** XS.
**Etiquetas:** [canvas, ui, popup-inline, auto-format, batch].

---

### HU-11.003 — Crear link Agregacion-Participacion O→O uno a uno

**Actor primario:** MN.
**Tipo:** opm-semantica.

**Nivel categórico:** K primario; V secundaria.
**Superficie UI:** canvas + modal-link-table.
**Gesto canónico:** drag desde borde del whole hasta borde de la part + clic en fila `Agregacion-Participacion`.

**Historia:**
> Como modelador, quiero conectar el whole a cada part con un link de Agregacion-Participacion para declarar la composición estructural canónica del sistema.

**Contexto de negocio:**
`X consists of Y.` es la relación OPM más usada para modelar sistemas compuestos. El link Agregacion-Participacion tiene render icónico (triángulo lleno ▲) y semántica fuerte (composición, no solo asociación). Esta HU cubre el caso **un link a la vez**; la fusión en bus está en HU-11.004, y la creación en lote en HU-11.007.

**Criterios de aceptación:**
- **Dado** que tengo dos objects A y B, **cuando** arrastro desde borde de A hasta B y elijo `Agregacion-Participacion` en el picker, **entonces** se crea un link con `type=agregacion-participacion`, `source=A`, `target=B`.
- **Dado** que el link existe, **cuando** consulto OPL, **entonces** aparece `A consists of B.`
- **Dado** que creé el link, **cuando** miro el canvas, **entonces** se renderiza con triángulo lleno ▲ en el extremo A (whole).
- **Dado** que repito el drag de A a un tercer object C, **cuando** elijo Agregacion-Participacion, **entonces** se crea un segundo link independiente (aún sin fusionar en bus — ver HU-11.004).

**Reglas y restricciones:**
- Dirección: el triángulo lleno queda del lado del whole (origen del drag por convención reverse).
- Filtro del picker: esta opción solo aparece cuando ambos extremos son Object (o Process→Process por extensión documentada en EPICA-15).

**Modelo de datos tocado:**
- `link.id` — UUID — persistente.
- `link.type` — `"agregacion-participacion"` — persistente.
- `link.source`, `link.target` — IDs de thing — persistente.

**Dependencias:**
- Bloqueada por: HU-10.007, HU-10.008, HU-10.011.
- Bloquea a: HU-11.004 (fusión en bus), HU-11.007 (batch).

**Integraciones:**
- panel OPL-ES.
- Render de links (funtor V).

**Notas de evidencia:**
**Fuente normativa primaria:** [V-3] [OPL-ES S1]
- Fuente: §3.1 paso 4; §10.2 tabla O→O.
- Frames: frame_00020.
- Clase de afirmación: observado + confirmado.

**Prioridad:** M0.
**Tamaño:** S.
**Etiquetas:** [canvas, kernel, aggregation, links, estructural].

---

### HU-11.004 — Fusionar múltiples links Aggregation en bus vertical único

**Actor primario:** MN.
**Tipo:** opm-semantica.

**Nivel categórico:** V (render) primario; L secundaria.
**Superficie UI:** canvas (post-layout).
**Gesto canónico:** ninguno (emerge del render cuando hay N aggregation-links del mismo whole).

**Historia:**
> Como modelador, quiero que múltiples agregaciones desde el mismo whole se rendericen como un bus vertical único con triángulo compartido para leer el sistema como composición unificada sin saturación visual.

**Contexto de negocio:**
El bus vertical con triángulo único es la **forma compacta canónica** de OPM para representar 1→N aggregation. Sin fusión, N parts generan N triángulos y líneas paralelas difíciles de leer. Con fusión, emerge un peine limpio que visualiza la jerarquía de un vistazo. Es convención no-normativa observada en §9: "el bus estructural vertical se usa como forma compacta estándar de agregación".

**Criterios de aceptación:**
- **Dado** que tengo 4 aggregation-links desde whole `W` a parts `P1..P4`, **cuando** el renderer procesa el layout, **entonces** los 4 links comparten un único triángulo lleno ▲ cerca de W y un bus vertical al que se conectan las 4 parts.
- **Dado** que agrego una 5ª part P5 con aggregation desde W, **cuando** termina la creación, **entonces** P5 se conecta al mismo bus.
- **Dado** que elimino la conexión de P3, **cuando** el render se actualiza, **entonces** el bus se reconfigura (queda P1, P2, P4, P5 conectadas).
- **Dado** que quedan 0 aggregation-links desde W, **cuando** se elimina el último, **entonces** el bus desaparece.
- **Dado** que mezclo aggregation y otra relación (p.ej. tagged link) desde W, **cuando** se renderiza, **entonces** solo los aggregation entran al bus; el resto se ruta independiente.

**Reglas y restricciones:**
- El bus es **derivación visual**, no entidad del modelo. El modelo persiste N links individuales.
- El triángulo compartido queda del lado del whole.
- Comportamiento forzado manual del bus: **pregunta abierta** (§11.2 fuente). Por default emerge solo de aggregation.

**Modelo de datos tocado:**
- Ninguno nuevo; derivación visual del layout.

**Dependencias:**
- Bloqueada por: HU-11.003.

**Integraciones:**
- Pass de layout (`src/render/layout/`) con lógica específica de bus-fusion para aggregation.
- Renderer JointJS.

**Notas de evidencia:**
**Fuente normativa primaria:** [V-3] [V-129]
- Fuente: §3.1 paso final, §9.
- Frames: frame_00027.
- Transcripción: "un bus vertical único con triángulo compartido".
- Clase de afirmación: observado + confirmado.

**Prioridad:** M0.
**Tamaño:** M.
**Etiquetas:** [canvas, render, aggregation, bus-estructural, layout-pass].

---

### HU-11.005 — Multi-seleccionar cosas con Ctrl + clic

**Actor primario:** ME.
**Tipo:** opcloud-ui.

**Nivel categórico:** U.
**Superficie UI:** canvas + selection-halo.
**Gesto canónico:** clic con Ctrl presionado.

**Historia:**
> Como modelador experto, quiero agregar cosas a la selección actual con Ctrl+clic para operar en lote sin reselecionar desde cero.

**Contexto de negocio:**
Multi-selección con Ctrl es afordance universal de software de edición. En modelado OPM es crítico para (a) conectar varias parts al whole con un gesto (HU-11.007), (b) alinear conjuntos (HU-11.008), (c) borrar en lote (HU-11.023). Sin ella, el modelador repite el mismo gesto N veces.

**Criterios de aceptación:**
- **Dado** que tengo una cosa A seleccionada, **cuando** hago Ctrl+clic sobre B, **entonces** la selección pasa a contener {A, B}.
- **Dado** que tengo {A, B} seleccionadas, **cuando** hago Ctrl+clic sobre A de nuevo, **entonces** A se des-selecciona y queda solo {B}.
- **Dado** que tengo {A, B, C} seleccionadas, **cuando** hago clic simple (sin Ctrl) sobre D, **entonces** la selección pasa a solo {D}.
- **Dado** que tengo multi-selección, **cuando** aparecen las acciones disponibles (toolbar contextual), **entonces** solo se muestran las que aplican al conjunto.

**Reglas y restricciones:**
- Mac: se acepta `Cmd` como equivalente a `Ctrl`.
- El halo de selección rodea cada cosa seleccionada (visual individual), no un bounding box único.

**Modelo de datos tocado:**
- `selection` — Set<thing.id> — transitorio (no persistente).

**Dependencias:**
- Bloqueada por: HU-10.001 o HU-10.002.
- Bloquea a: HU-11.007, HU-11.008, HU-11.023.

**Integraciones:**
- AppState (selection es UI state).
- Toolbar contextual.

**Notas de evidencia:**
**Fuente normativa primaria:** —
- Fuente: §3.1.
- Transcripción: "multi-selección con Ctrl".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [canvas, ui, selección, multi-select, ctrl].

---

### HU-11.006 — Seleccionar cosas por lazo con Shift

**Actor primario:** ME.
**Tipo:** opcloud-ui.

**Nivel categórico:** U.
**Superficie UI:** canvas + rubber-band.
**Gesto canónico:** Shift + drag sobre el canvas para dibujar un rectángulo lazo.

**Historia:**
> Como modelador experto, quiero dibujar un lazo rectangular con Shift para seleccionar todas las cosas contenidas en él de un solo gesto.

**Contexto de negocio:**
El lazo (rubber-band) es la afordance para seleccionar regiones densas rápido. Para un peine de 8 parts, hacer Ctrl+clic 8 veces es fricción; un lazo las abarca en 0.5 segundos. Es la segunda vía de multi-selección que la transcripción distingue explícitamente de Ctrl+clic.

**Criterios de aceptación:**
- **Dado** que estoy en zona vacía del canvas, **cuando** inicio drag con Shift presionado, **entonces** aparece un rectángulo lazo semi-transparente que sigue al cursor.
- **Dado** que el lazo cubre parcial o totalmente N cosas, **cuando** suelto, **entonces** la selección pasa a {esas N cosas}.
- **Dado** que había selección previa, **cuando** hago Shift-lazo, **entonces** **comportamiento canónico**: la selección previa se preserva y las cosas del lazo se agregan (unión, no reemplazo).
- **Dado** que el lazo está vacío (no cubre cosas), **cuando** suelto, **entonces** la selección queda como estaba.

**Reglas y restricciones:**
- Umbral de inclusión: basta con intersección (no se requiere contención total).
- Lazo solo selecciona things; para links hay gesto separado (ver HU-11.023).
- Conflicto con pan del canvas: Shift activa lazo, drag sin modificador hace pan.

**Modelo de datos tocado:**
- `selection` — Set<thing.id> — transitorio.

**Dependencias:**
- Bloqueada por: HU-10.001 o HU-10.002.

**Integraciones:**
- AppState selection.
- Gesto pan del canvas (EPICA-1A).

**Notas de evidencia:**
**Fuente normativa primaria:** —
- Fuente: §3.1.
- Transcripción: "selección por lazo usando Shift".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [canvas, ui, selección, lazo, shift, rubber-band].

---

### HU-11.007 — Conectar multi-selección al whole con un solo gesto

**Actor primario:** ME.
**Tipo:** mixto.

**Nivel categórico:** K primario; U secundaria.
**Superficie UI:** canvas + modal-link-table.
**Gesto canónico:** drag desde borde del whole al grupo multi-seleccionado (o variante documentada).

**Historia:**
> Como modelador experto, quiero conectar varias parts al whole con un solo gesto después de haberlas multi-seleccionado para construir la agregación completa sin repetir el drag N veces.

**Contexto de negocio:**
Cuando hay 4+ parts, crear aggregation link una por una es tedioso. La transcripción explicita tres vías: "una por una, multi-selección con Ctrl, selección por lazo". El batch conversion es M1 (mejora de productividad sobre un flujo M0 ya funcional).

**Criterios de aceptación:**
- **Dado** que tengo parts P1..PN multi-seleccionadas (con Ctrl o lazo), **cuando** arrastro desde el borde del whole W hasta el conjunto y elijo `Agregacion-Participacion`, **entonces** se crean N links en una sola transacción, uno por cada Pi con `source=W, target=Pi`.
- **Dado** que se crearon los N links, **cuando** se renderiza, **entonces** emergen en bus único (HU-11.004).
- **Dado** que una de las Pi ya estaba conectada a W con aggregation, **cuando** hago el batch, **entonces** no se duplica (idempotencia por pareja whole-part).
- **Dado** que el picker aparece después del drag batch, **cuando** elijo otro tipo de link, **entonces** todos los N links se crean con ese tipo (no solo aggregation).

**Reglas y restricciones:**
- Operación atómica: si una de las N creaciones falla, se revierten todas (transacción kernel).
- Gesto exacto sujeto a confirmación: lazo previo + drag desde whole es una opción; otra es drag desde whole + soltar sobre multi-selección pre-existente.

**Modelo de datos tocado:**
- N links creados atómicamente (hereda shape de HU-11.003).

**Dependencias:**
- Bloqueada por: HU-11.003, HU-11.005 o HU-11.006.
- Bloquea a: HU-11.004 (el bus emerge naturalmente post-batch).

**Integraciones:**
- Kernel transaccional (aplicador de cambios atómico).

**Notas de evidencia:**
**Fuente normativa primaria:** [V-3]
- Fuente: §3.1.
- Transcripción: "tres maneras de conectar: una por una, multi-selección Ctrl, lazo Shift".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** M1.
**Tamaño:** M.
**Etiquetas:** [canvas, kernel, aggregation, multi-select, batch, transacción].

---

### HU-11.008 — Alinear links seleccionados to-the-left

**Actor primario:** ME.
**Tipo:** opcloud-ui.

**Nivel categórico:** V primario; U secundaria.
**Superficie UI:** toolbar (botones de alineación).
**Gesto canónico:** multi-selección + clic en botón `Align Left`.

**Historia:**
> Como modelador experto, quiero alinear los links de un bus a la izquierda con un botón de alineación para limpiar el peine sin dejar todo al autolayout.

**Contexto de negocio:**
§3.2 explicita: "OPCloud no deja toda la geometría al autolayout: el modelador puede limpiar el peine manualmente". El modelador profesional necesita control fino sobre la distribución visual. Alineación a izquierda/derecha/centro/distribuir es el toolkit mínimo.

**Criterios de aceptación:**
- **Dado** que tengo varios links seleccionados, **cuando** hago clic en `Align Left`, **entonces** todos se alinean usando el punto de conexión más a la izquierda del conjunto como referencia.
- **Dado** que la alineación ocurre, **cuando** miro el canvas, **entonces** el peine queda ordenado (los links visualmente alineados por su coordenada X de entrada al bus).
- **Dado** que hay un único link seleccionado, **cuando** hago clic en Align Left, **entonces** no ocurre cambio visible (nada con qué alinear).
- **Dado** que alineo links con vértices manuales previos, **cuando** se aplica, **entonces** los vértices se ajustan coherentemente.

**Reglas y restricciones:**
- La alineación edita la **apariencia** del link (vértices/ruteo), no la estructura del modelo.
- Se documenta solo `Align Left` en el reverse; otras variantes (right, center, distribute) son extensión natural.
- Conflicto con autolayout: si se ejecuta autolayout posterior, la alineación manual puede perderse — trade-off documentado en EPICA-1A.

**Modelo de datos tocado:**
- `link.vertices` — Array<{x, y}> — persistente (apariencia).

**Dependencias:**
- Bloqueada por: HU-11.005 o HU-11.006.
- Bloquea a: HU-11.018 (vértices manuales).

**Integraciones:**
- Renderer (aplicar vértices).
- Autolayout (trade-off con manual).

**Notas de evidencia:**
**Fuente normativa primaria:** —
- Fuente: §3.2, §5.3.
- Clase de afirmación: observado.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [canvas, ui, alineación, layout-manual, links].

---

### HU-11.009 — Crear link Instrument O→P con rol procedural

**Actor primario:** MN.
**Tipo:** opm-semantica.

**Nivel categórico:** K primario; V secundaria.
**Superficie UI:** canvas + modal-link-table.
**Gesto canónico:** drag desde object al process + clic en `Instrument`.

**Historia:**
> Como modelador, quiero conectar un object a un process como instrument para declarar que el object es requerido para ejecutar el process.

**Contexto de negocio:**
Instrument (`Y requires X.`) es uno de los 4 links procedurales O→P. Es la forma canónica de decir "X es necesario (no consumido) para que el proceso Y ocurra". Render: línea con círculo hueco en el extremo del process. Ejemplo del reverse: `OnStar System` → `Driver Rescuing` como instrument.

**Criterios de aceptación:**
- **Dado** que tengo object `OnStar System` y process `Driver Rescuing`, **cuando** arrastro de O a P y elijo `Instrument`, **entonces** se crea un link con `type=instrument`, `source=OnStar System`, `target=Driver Rescuing`.
- **Dado** que se creó el link, **cuando** consulto OPL, **entonces** aparece `Driver Rescuing requires OnStar System.`
- **Dado** que se creó el link, **cuando** miro el canvas, **entonces** el extremo en P tiene círculo hueco (ícono OPM canónico).
- **Dado** que el object origen es physical, **cuando** abro el picker, **entonces** `Agent` también aparece como opción (diferenciado de Instrument — ver HU-11.010).

**Reglas y restricciones:**
- `Instrument` es tipo base; Instrument Condition e Instrument Event son subtipos (HU-11.027).
- El sentido del link es O→P: el process requiere el object, no al revés.

**Modelo de datos tocado:**
- `link.type` — `"instrument"` — persistente.
- `link.subtype` — opcional — persistente.
- `link.modifier` — `"None" | "NOT"` — persistente.

**Dependencias:**
- Bloqueada por: HU-10.007, HU-10.008, HU-10.011.
- Integra: HU-11.027 (subtipos y modificador).

**Integraciones:**
- OPL.
- Picker filtrado por dirección (HU-11.026).

**Notas de evidencia:**
**Fuente normativa primaria:** [Glos 3.30] [OPL-ES T5]
- Fuente: §3.3, §10.2 tabla O→P.
- Frames: frame_00033.
- Clase de afirmación: observado + confirmado.

**Prioridad:** M0.
**Tamaño:** S.
**Etiquetas:** [canvas, kernel, instrument, links, procedural].

---

### HU-11.010 — Crear Agent link O→P sobre objeto físico

**Actor primario:** MN.
**Tipo:** opm-semantica.

**Nivel categórico:** K primario.
**Superficie UI:** canvas + modal-link-table.
**Gesto canónico:** drag desde object físico al process + clic en `Agent`.

**Historia:**
> Como modelador, quiero conectar un object físico (actor humano) al process como agent para declarar que es el responsable humano de ejecutar el process.

**Contexto de negocio:**
Agent es la especialización de Instrument restringida a `esencia=physical` (típicamente humanos u operadores). OPM lo distingue visual y verbalmente (`handles` vs `requires`). Ejemplo del reverse: `OnStar Advisor` → `Driver Rescuing` como agent. Esto contrasta con HU-11.009, donde `OnStar System` es instrument (sistema, no persona).

**Criterios de aceptación:**
- **Dado** que tengo object `OnStar Advisor` con `esencia=physical` y process `Driver Rescuing`, **cuando** arrastro O→P y abro el picker, **entonces** `Agent` aparece como opción (filtrado habilita — HU-10.010 inverso).
- **Dado** que elijo `Agent`, **cuando** se crea, **entonces** `link.type=agent`, `source=Advisor`, `target=Driver Rescuing`.
- **Dado** que se creó el agent link, **cuando** consulto OPL, **entonces** aparece `OnStar Advisor handles Driver Rescuing.` (verbo `handles`, no `requires`).
- **Dado** que se creó el link, **cuando** miro el canvas, **entonces** el extremo tiene el ícono específico de agent (círculo relleno u otro distintivo — ver SSOT).

**Reglas y restricciones:**
- `esencia=physical` es pre-requisito del source.
- Si se cambia esencia a informacional post-creación, el validador debe marcar el link como inconsistente (ver EPICA-1C).

**Modelo de datos tocado:**
- `link.type` — `"agent"` — persistente.
- Hereda `source`, `target`.

**Dependencias:**
- Bloqueada por: HU-10.010 (filtrado), HU-10.013 (toggle esencia).
- Bloquea a: HU-11.011 (verbalización OPL).

**Integraciones:**
- Kernel (validación compatibilidad esencia).
- OPL.

**Notas de evidencia:**
**Fuente normativa primaria:** [Glos 3.3] [OPL-ES T5]
- Fuente: §3.3.
- Transcripción: "OnStar Advisor se conecta al proceso con agent link... el OPL lo verbaliza con handles".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** M0.
**Tamaño:** S.
**Etiquetas:** [canvas, kernel, agent, links, physical, procedural].

---

### HU-11.011 — Verbalizar rol Agent en OPL con handles

**Actor primario:** MN.
**Tipo:** opm-semantica.

**Nivel categórico:** L (lente OPL).
**Superficie UI:** opl-pane.
**Gesto canónico:** ninguno (actualización automática).

**Historia:**
> Como modelador novato, quiero ver la oración OPL del agent link usar el verbo `handles` para distinguir claramente el rol humano del rol de instrumento.

**Contexto de negocio:**
OPL diferencia verbalmente agent vs instrument: `handles` vs `requires`. Esta distinción pedagógica enseña al novato la semántica profunda OPM (agent es humano/físico, instrument es cualquier recurso). Sin el verbo distinto, el eco OPL perdería su valor formativo.

**Criterios de aceptación:**
- **Dado** que existe agent link de `Advisor` a `Rescuing`, **cuando** miro OPL, **entonces** leo `OnStar Advisor handles Driver Rescuing.`
- **Dado** que existe instrument link de `System` a `Rescuing`, **cuando** miro OPL, **entonces** leo `Driver Rescuing requires OnStar System.`
- **Dado** que cambio un link de instrument a agent (si aplica), **cuando** ocurre el cambio, **entonces** la OPL pasa de `requires` a `handles`.

**Reglas y restricciones:**
- Orden del sujeto en la oración: el agent/instrument queda como **sujeto del verbo** (`Advisor handles Rescuing`); el process es complemento.
- Discrepancia sutil: para instrument el sujeto es el process (`Rescuing requires System`). OPL canónico respeta ambas formas.

**Dependencias:**
- Bloqueada por: HU-11.010.

**Integraciones:**
- Motor OPL (`src/render/opl-renderer.ts`).

**Notas de evidencia:**
**Fuente normativa primaria:** [OPL-ES T5]
- Fuente: §3.3 paso 4, §7.1.
- Transcripción: "el OPL lo verbaliza con handles".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** M0.
**Tamaño:** XS.
**Etiquetas:** [canvas, opl, agent, pedagógico, handles].

---

### HU-11.012 — Crear Unidirectional Tagged Link O→O con tag default

**Actor primario:** MN.
**Tipo:** opm-semantica.

**Nivel categórico:** K primario; V secundaria.
**Superficie UI:** canvas + modal-link-table.
**Gesto canónico:** drag O→O + clic en `Unidirectional Tagged Link`.

**Historia:**
> Como modelador, quiero crear un link tagged unidireccional entre dos objects para declarar una relación semántica ad-hoc (comunicación, pertenencia, uso) que no está cubierta por los 5 tipos estructurales formales.

**Contexto de negocio:**
Los 5 links estructurales OPM (Aggregation, Exhibition, Generalization, Classification, Bidirectional Tagged) cubren las relaciones canónicas. El **Unidirectional Tagged Link** es la válvula de escape para relaciones específicas del dominio (comunicación entre subsistemas, uso, referencia). El tag default `relates to` es intencionalmente neutro para que el modelador lo especialice después (HU-11.014).

**Criterios de aceptación:**
- **Dado** que tengo objects A y B, **cuando** arrastro A→B y elijo `Unidirectional Tagged Link`, **entonces** se crea un link con `type=unidirectional-tagged`, `tag="relates to"`, `source=A`, `target=B`.
- **Dado** que existe, **cuando** consulto OPL, **entonces** leo `A relates to B.`
- **Dado** que existe, **cuando** miro canvas, **entonces** se renderiza como flecha etiquetada con el texto del tag visible sobre la línea.

**Reglas y restricciones:**
- Tag default: `relates to` (verbo genérico).
- El tag es editable en el popup de propiedades (HU-11.014).
- Dirección: el tag se lee de source a target.

**Modelo de datos tocado:**
- `link.type` — `"unidirectional-tagged"` — persistente.
- `link.tag` — string — persistente (default `"relates to"`).

**Dependencias:**
- Bloqueada por: HU-10.007, HU-10.008, HU-10.011.
- Bloquea a: HU-11.014 (rename tag).

**Integraciones:**
- OPL.
- Render (texto sobre línea).

**Notas de evidencia:**
**Fuente normativa primaria:** [V-239] [OPL-ES S5]
- Fuente: §3.4 paso 2, §10.2 tabla O→O.
- Clase de afirmación: observado + confirmado.

**Prioridad:** M0.
**Tamaño:** S.
**Etiquetas:** [canvas, kernel, tagged-link, estructural, unidireccional].

---

### HU-11.013 — Editar propiedades de link por clic derecho

**Actor primario:** MN.
**Tipo:** opcloud-ui.

**Nivel categórico:** U.
**Superficie UI:** canvas + popup-link-properties.
**Gesto canónico:** clic derecho sobre línea del link.

**Historia:**
> Como modelador, quiero abrir un popup de propiedades del link haciendo clic derecho sobre la línea para editar tag, multiplicity, estilo y operaciones relacionadas.

**Contexto de negocio:**
El clic derecho es la afordance universal para "propiedades / operaciones avanzadas". Sobre un link concentra las operaciones no triviales: renombrar tag, multiplicity, estilo. Evita contaminar la toolbar principal con opciones contextuales específicas del link.

**Criterios de aceptación:**
- **Dado** que existe un link visible, **cuando** hago clic derecho sobre su línea, **entonces** se abre un popup con campos: `Source Multiplicity`, `Target Multiplicity`, `tag`, `Style`, `Copy Style`.
- **Dado** que el popup está abierto, **cuando** edito cualquier campo y confirmo, **entonces** el cambio se persiste en el link.
- **Dado** que el popup está abierto, **cuando** hago clic fuera o presiono ESC, **entonces** se cierra sin cambios.
- **Dado** que el link es de tipo aggregation (no tagged), **cuando** abro el popup, **entonces** los campos irrelevantes (p.ej. tag) pueden estar deshabilitados o no aparecer.

**Reglas y restricciones:**
- Los campos disponibles dependen del tipo del link (no todos los links tienen tag o multiplicity).
- El popup se ancla al punto del clic.

**Modelo de datos tocado:**
- Ver HU-11.014, HU-11.015, HU-11.016 (campos específicos).

**Dependencias:**
- Bloqueada por: HU-11.003, HU-11.009, HU-11.010 o HU-11.012 (necesita link existente).
- Bloquea a: HU-11.014, HU-11.015, HU-11.016, HU-11.017.

**Integraciones:**
- Renderer link.
- OPL.

**Notas de evidencia:**
**Fuente normativa primaria:** —
- Fuente: §2 tabla superficies, §3.4 paso 4, §5.2.
- Clase de afirmación: observado.

**Prioridad:** M0.
**Tamaño:** S.
**Etiquetas:** [canvas, ui, context-menu, link-properties, popup].

---

### HU-11.014 — Renombrar tag del link en popup de propiedades

**Actor primario:** MN.
**Tipo:** opm-semantica.

**Nivel categórico:** K primario; L (OPL) secundaria.
**Superficie UI:** popup-link-properties (campo tag).
**Gesto canónico:** escritura en campo tag + confirmar.

**Historia:**
> Como modelador, quiero renombrar el tag del link de `relates to` a un verbo específico del dominio (p.ej. `communicates via`) para que el OPL describa la relación con precisión semántica.

**Contexto de negocio:**
El tag default `relates to` es intencionalmente vago. En modelos reales, el modelador lo sustituye por verbos de dominio: `communicates via`, `depends on`, `synchronizes with`, `inherits from`. El ejemplo del reverse: `Driver relates to OnStar Console` → `Driver communicates via OnStar Console`.

**Criterios de aceptación:**
- **Dado** que el popup de propiedades está abierto sobre un tagged link con tag `relates to`, **cuando** edito el campo tag a `communicates via` y confirmo, **entonces** `link.tag="communicates via"` y la OPL pasa a leer `Driver communicates via OnStar Console.`
- **Dado** que el tag cambió, **cuando** miro el canvas, **entonces** el texto sobre la línea muestra el nuevo tag.
- **Dado** que dejo el tag vacío, **cuando** confirmo, **entonces** se rechaza (tag es requerido) o se restaura el default (comportamiento a validar — marcar como abierto).
- **Dado** que el link es Bidirectional Tagged, **cuando** renombro el tag, **entonces** la OPL usa estructura `A <tag> B.` bidireccional (p.ej. `are equivalent.`).

**Reglas y restricciones:**
- Tag es string libre; no hay vocabulario controlado por default.
- El tag aparece textualmente sobre la línea.
- Comportamiento de tag vacío: **pregunta abierta**.

**Modelo de datos tocado:**
- `link.tag` — string — persistente.

**Dependencias:**
- Bloqueada por: HU-11.012, HU-11.013.

**Integraciones:**
- OPL (la oración cambia textualmente).
- Renderer (el texto sobre línea se re-rotula).

**Notas de evidencia:**
**Fuente normativa primaria:** [OPL-ES S5]
- Fuente: §3.4 pasos 3 y 5, §5.2.
- Frames: frame_00047.
- Transcripción: "cambia tag de relates to a communicates via".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** M0.
**Tamaño:** S.
**Etiquetas:** [canvas, kernel, tagged-link, rename, opl].

---

### HU-11.015 — Configurar Source y Target Multiplicity del link

**Actor primario:** ME.
**Tipo:** opm-semantica.

**Nivel categórico:** K primario; V secundaria.
**Superficie UI:** popup-link-properties (campos Multiplicity).
**Gesto canónico:** escritura en campo multiplicity + confirmar.

**Historia:**
> Como modelador experto, quiero asignar Source y Target Multiplicity al link (p.ej. `1`, `*`, `1..N`) para capturar cardinalidad de la relación y que el OPL/render lo refleje.

**Contexto de negocio:**
Multiplicity es estándar en modelado estructural (UML, ER, OPM). Permite expresar que un whole tiene N parts (`1..*`), o que una relación es exclusiva (`1..1`). OPCloud expone este control en el popup de propiedades.

**Criterios de aceptación:**
- **Dado** que el popup está abierto, **cuando** ingreso `*` en Source Multiplicity, **entonces** se persiste en `link.sourceMultiplicity`.
- **Dado** que establezco `1..N` en Target Multiplicity, **cuando** consulto OPL, **entonces** la oración refleja la cardinalidad (formato exacto delegado a SSOT OPL — observación abierta).
- **Dado** que la multiplicity es no-trivial (distinta de 1), **cuando** miro el canvas, **entonces** aparece un rótulo pequeño cerca del extremo correspondiente con el valor.
- **Dado** que dejo los campos vacíos, **cuando** confirmo, **entonces** la multiplicity es implícita (1 por default).

**Reglas y restricciones:**
- Sintaxis aceptada: `N`, `N..M`, `*`, `0..*`, `1..*` (convención OPM estándar).
- Validación de sintaxis: sí; rechazo de valores malformados.
- Render del rótulo: cerca del endpoint, no sobre el tag (colisión visual evitada).

**Modelo de datos tocado:**
- `link.sourceMultiplicity` — string — persistente.
- `link.targetMultiplicity` — string — persistente.

**Dependencias:**
- Bloqueada por: HU-11.013.

**Integraciones:**
- OPL (formato de cardinalidad).
- Renderer (rótulos de multiplicity).
- Validador (sintaxis).

**Notas de evidencia:**
**Fuente normativa primaria:** [Glos 3.60]
- Fuente: §5.2.
- Clase de afirmación: observado.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [canvas, kernel, link-properties, multiplicity, cardinalidad].

---

### HU-11.016 — Ajustar Style visual del link en popup de propiedades

**Actor primario:** ME.
**Tipo:** opcloud-ui.

**Nivel categórico:** V primario.
**Superficie UI:** popup-link-properties (campo Style).
**Gesto canónico:** selección/edición en campo Style + confirmar.

**Historia:**
> Como modelador experto, quiero ajustar el estilo visual del link (color, grosor, posiblemente tipo de línea) desde el popup para diferenciar categorías de relaciones visualmente en el diagrama.

**Contexto de negocio:**
En modelos densos, el color y grosor del link sirven de capa de categorización: `communicates via` en azul, `controls` en rojo, `depends on` en gris. Es un recurso visual sin cambio semántico.

**Criterios de aceptación:**
- **Dado** que el popup está abierto, **cuando** edito Style (color o grosor), **entonces** el cambio se persiste en `link.style`.
- **Dado** que cambié el style, **cuando** miro el canvas, **entonces** el link refleja el nuevo estilo.
- **Dado** que el style afecta decoraciones de extremos, **cuando** confirmo: **pregunta abierta** (§11.1 fuente) — se asume que style cubre solo color/grosor salvo extensión documentada en EPICA-14.

**Reglas y restricciones:**
- Style NO cambia semántica (ningún campo tipado se afecta).
- Delegación a EPICA-14 (styling avanzado) para extensiones.
- Alcance exacto de Style (color, grosor, dash pattern, decoraciones) es parcialmente abierto.

**Modelo de datos tocado:**
- `link.style` — objeto con `{color, strokeWidth, ...}` — persistente.

**Dependencias:**
- Bloqueada por: HU-11.013.
- Relaciona: EPICA-14 (styling).

**Integraciones:**
- Renderer.

**Notas de evidencia:**
**Fuente normativa primaria:** —
- Fuente: §5.2, §11.1 (pregunta abierta).
- Clase de afirmación: observado + parcialmente abierto.
- Etiqueta: `requires-clarification` (alcance exacto de Style).

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [canvas, render, link-properties, style, requires-clarification].

---

### HU-11.017 — Copiar Style de un link a otro con Copy Style

**Actor primario:** ME.
**Tipo:** opcloud-ui.

**Nivel categórico:** V primario; U secundaria.
**Superficie UI:** popup-link-properties (botón Copy Style).
**Gesto canónico:** clic en Copy Style sobre link A + (gesto por confirmar) aplicación a link B.

**Historia:**
> Como modelador experto, quiero copiar el style de un link a otros para homogenizar la apariencia visual por categoría sin reeditar cada uno.

**Contexto de negocio:**
Cuando hay 10 links de `communicates via` que quiero todos en azul, reeditar uno por uno es fricción. Copy Style (comando de apariencia) permite propagar el estilo de un link "plantilla" a otros.

**Criterios de aceptación:**
- **Dado** que tengo link A con style custom, **cuando** hago clic en `Copy Style` sobre su popup, **entonces** el estilo se copia al clipboard de estilos (o modo pegar).
- **Dado** que copié style y selecciono link B, **cuando** aplico paste-style (vía popup o shortcut), **entonces** B adopta el style de A.
- **Dado** que tengo multi-selección de links, **cuando** aplico Copy Style, **entonces** todos adoptan el estilo del clipboard.

**Reglas y restricciones:**
- Copy Style es comando de apariencia, no de semántica.
- Scope de lo que se copia: misma ambigüedad que HU-11.016 (color/grosor seguro, decoraciones a confirmar).
- Gesto exacto de pegar: podría ser un botón espejo, un shortcut o automatic-on-paste — abierto.

**Modelo de datos tocado:**
- `link.style` del target — persistente (overwrite).

**Dependencias:**
- Bloqueada por: HU-11.016.

**Integraciones:**
- AppState (clipboard de estilos).
- Multi-selección (HU-11.005/006).

**Notas de evidencia:**
**Fuente normativa primaria:** —
- Fuente: §5.2, §11.1.
- Clase de afirmación: observado + parcialmente abierto.
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [canvas, render, link-properties, copy-style, clipboard, requires-clarification].

---

### HU-11.018 — Insertar vértice en link por clic sobre la línea

**Actor primario:** ME.
**Tipo:** mixto.

**Nivel categórico:** V (render) primario.
**Superficie UI:** canvas (línea del link).
**Gesto canónico:** clic simple (o doble clic) sobre la línea del link en posición libre.

**Historia:**
> Como modelador experto, quiero insertar un vértice en un link con clic para doblar la línea y evitar que cruce otros elementos del diagrama.

**Contexto de negocio:**
El ruteo automático a veces cruza elementos o genera líneas visualmente confusas. El modelador profesional necesita control fino: insertar un vértice "ancla" y mover el ruteo a voluntad. El reverse describe los vértices como "puntos negros sobre la línea" (frame_00047).

**Criterios de aceptación:**
- **Dado** que existe un link, **cuando** hago clic sobre un punto libre de la línea, **entonces** se inserta un vértice en ese punto, representado como un marcador visible.
- **Dado** que inserté un vértice, **cuando** miro el modelo persistido, **entonces** `link.vertices` contiene la lista ordenada de vértices.
- **Dado** que inserté múltiples vértices, **cuando** miro el canvas, **entonces** el ruteo respeta el orden de los vértices entre source y target.
- **Dado** que doble clic elimina el vértice: comportamiento a validar (observación abierta).

**Reglas y restricciones:**
- Vértices afectan **apariencia**, no semántica (el link sigue siendo `source → target`).
- Eliminación de vértice: por doble clic o contextual; gesto exacto abierto.
- Compatibilidad con autolayout: los vértices manuales se preservan salvo reset explícito.

**Modelo de datos tocado:**
- `link.vertices` — Array<{x, y}> — persistente.

**Dependencias:**
- Bloqueada por: HU-11.003 o HU-11.009 o HU-11.012 (link existente).
- Bloquea a: HU-11.019 (reposicionar).

**Integraciones:**
- Renderer JointJS (API de vértices).

**Notas de evidencia:**
**Fuente normativa primaria:** [V-61]
- Fuente: §3.4 paso 6, §5.1.
- Frames: frame_00047.
- Transcripción: "reacomoda la geometría creando vértices negros sobre la línea".
- Clase de afirmación: observado + confirmado.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [canvas, render, vértices, geometría-manual].

---

### HU-11.019 — Reposicionar vértice arrastrándolo

**Actor primario:** ME.
**Tipo:** mixto.

**Nivel categórico:** V.
**Superficie UI:** canvas (marcador de vértice).
**Gesto canónico:** drag sobre marcador del vértice.

**Historia:**
> Como modelador experto, quiero arrastrar un vértice existente a otra posición para afinar el ruteo después de haberlo insertado.

**Contexto de negocio:**
Insertar un vértice y dejarlo donde cayó es raramente óptimo. El ajuste fino por drag es la continuación natural de HU-11.018.

**Criterios de aceptación:**
- **Dado** que existe un vértice en (x, y), **cuando** lo arrastro a (x', y'), **entonces** su posición se actualiza en `link.vertices[i]`.
- **Dado** que el drag ocurre, **cuando** miro el canvas, **entonces** el ruteo se recalcula en vivo siguiendo el drag.
- **Dado** que suelto el vértice, **cuando** el drag termina, **entonces** la posición final se persiste.

**Reglas y restricciones:**
- El drag no cambia el orden de los vértices.
- Snap a grid: delegado a EPICA-1A (si aplica).

**Modelo de datos tocado:**
- `link.vertices[i]` — `{x, y}` — persistente.

**Dependencias:**
- Bloqueada por: HU-11.018.

**Integraciones:**
- Renderer (drag handler).

**Notas de evidencia:**
**Fuente normativa primaria:** [V-61]
- Fuente: §5.1 "reposicionamiento manual".
- Clase de afirmación: observado.

**Prioridad:** M1.
**Tamaño:** XS.
**Etiquetas:** [canvas, render, vértices, drag].

---

### HU-11.020 — Reanclar extremo del link a otro puerto del shape

**Actor primario:** ME.
**Tipo:** mixto.

**Nivel categórico:** V primario; U secundaria.
**Superficie UI:** canvas (endpoint del link).
**Gesto canónico:** drag sobre el endpoint hasta otro punto del mismo shape (o shape distinto).

**Historia:**
> Como modelador experto, quiero reanclar el endpoint de un link a otro puerto del mismo shape (o a un shape distinto) para corregir conexiones sin recrearlas.

**Contexto de negocio:**
A veces el endpoint se conectó a un lado del shape que genera ruteo feo, o se conectó al shape equivocado. Reanclar evita borrar y recrear el link (con la pérdida de propiedades y vértices que implicaría).

**Criterios de aceptación:**
- **Dado** que existe un link de A a B, **cuando** arrastro el endpoint desde B hasta B' (otro punto de B), **entonces** el link preserva source/target pero el punto de conexión cambia (afecta ruteo).
- **Dado** que arrastro el endpoint a un shape distinto C, **cuando** suelto sobre C, **entonces** `link.target` pasa a `C` (cambio semántico).
- **Dado** que el nuevo target es semánticamente incompatible (p.ej. convertiría instrument O→P en P→P inválido), **cuando** suelto, **entonces** se rechaza con feedback visual (snap-back).
- **Dado** que reanclé con cambio de target, **cuando** consulto OPL, **entonces** la oración se actualiza.

**Reglas y restricciones:**
- Reanclaje conserva propiedades (tag, style, multiplicity, vértices compatibles).
- Validación de compatibilidad: el kernel evalúa como si fuera un nuevo link; rechaza si es ilegal.
- Distinción visual: reanclaje sobre mismo shape (cambio de puerto) vs distinto shape (cambio semántico).

**Modelo de datos tocado:**
- `link.source` / `link.target` — ID — persistente (si cambia target).
- `link.connectionPoint` — metadata opcional — persistente.

**Dependencias:**
- Bloqueada por: HU-11.003 o HU-11.009 o HU-11.012.

**Integraciones:**
- Validador.
- OPL.
- Renderer.

**Notas de evidencia:**
**Fuente normativa primaria:** [V-61] [JOYAS §7]
- Fuente: §5.1 "reanclaje a otro puerto".
- Transcripción: "conectar al centro o a un puerto específico cambia la alineación del link".
- Clase de afirmación: observado + confirmado.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [canvas, render, link-endpoint, reanclaje, validación].

---

### HU-11.021 — Borrar un link desde toolbar contextual

**Actor primario:** MN.
**Tipo:** opm-semantica.

**Nivel categórico:** K.
**Superficie UI:** toolbar-contextual-link (botón remove).
**Gesto canónico:** selección del link + clic en botón `Remove`.

**Historia:**
> Como modelador, quiero borrar un link seleccionándolo y haciendo clic en un botón de eliminación para eliminarlo cuando la relación es errónea.

**Contexto de negocio:**
La eliminación de links es operación frecuente. Con un solo link seleccionado, el flujo es directo (caso feliz). Con varios apariciones, aparece el popup de 2 modos (HU-11.022). Esta HU cubre el caso de una sola apariencia.

**Criterios de aceptación:**
- **Dado** que seleccioné un link que aparece en un único OPD, **cuando** hago clic en `Remove`, **entonces** el link se elimina directamente del modelo sin diálogo.
- **Dado** que seleccioné un link con múltiples apariciones, **cuando** hago clic en `Remove`, **entonces** se abre el popup de 2 modos (HU-11.022).
- **Dado** que el link fue eliminado, **cuando** consulto OPL, **entonces** su oración desaparece.
- **Dado** que el link fue eliminado, **cuando** miro el canvas, **entonces** la línea ya no está.

**Reglas y restricciones:**
- Delete key del teclado es equivalente al botón (delegado a EPICA-90).
- Undo del delete: delegado a EPICA-1B o similar.
- Eliminación del único link de una pareja no elimina las things, solo el link.

**Modelo de datos tocado:**
- `link` — eliminado — persistente.

**Dependencias:**
- Bloqueada por: HU-11.003 o HU-11.009 o HU-11.012.
- Bloquea a: HU-11.022.

**Integraciones:**
- OPL.
- Renderer.

**Notas de evidencia:**
**Fuente normativa primaria:** [V-61]
- Fuente: §4.1.
- Clase de afirmación: observado.

**Prioridad:** M0.
**Tamaño:** XS.
**Etiquetas:** [canvas, kernel, eliminación, links].

---

### HU-11.022 — Decidir scope de borrado con popup 2 modos (apariencia vs modelo)

**Actor primario:** MN.
**Tipo:** opm-semantica.

**Nivel categórico:** K primario; U secundaria.
**Superficie UI:** modal-choose-remove-operation.
**Gesto canónico:** remove sobre link con múltiples apariencias → modal → clic en opción.

**Historia:**
> Como modelador, quiero decidir explícitamente si el borrado es solo de la apariencia actual (visual) o de la relación en todo el modelo para evitar destruir relaciones válidas en otros OPDs por accidente.

**Contexto de negocio:**
Este es el primer encuentro del modelador con el **principio modelo-vs-apariencia**: una relación del modelo puede tener múltiples apariencias (una por OPD donde se muestra). Borrar la apariencia aquí no siempre significa borrar la relación. OPCloud obliga a una decisión consciente con un popup de 2 modos; sin él, la ambigüedad llevaría a pérdidas de datos silenciosas.

**Criterios de aceptación:**
- **Dado** que un link aparece en 2+ OPDs y hago Remove, **cuando** el sistema detecta múltiples apariencias, **entonces** se abre un modal `Choose Remove Operation` con 2 opciones: `Remove appearance only` / `Remove from model`.
- **Dado** que el modal está abierto, **cuando** elijo `Remove appearance only`, **entonces** la apariencia en el OPD actual desaparece pero el link persiste en el modelo y en otros OPDs.
- **Dado** que elijo `Remove from model`, **cuando** confirmo, **entonces** el link se elimina completamente (todas las apariencias, en todos los OPDs).
- **Dado** que el link tiene una única apariencia, **cuando** hago Remove, **entonces** se elimina directo sin modal (HU-11.021).
- **Dado** que cancelo el modal con `x`, **cuando** cierro, **entonces** no ocurre borrado.

**Reglas y restricciones:**
- Default: **pregunta abierta** (§11.3 fuente) — ¿cuál opción está pre-seleccionada?
- El modal es análogo al de remove de thing (EPICA-1C) pero con 2 opciones en vez de 3.
- Trazabilidad: el modelo mantiene consistencia (si se borra la última apariencia con `Remove appearance only`, puede quedar huérfana en el modelo sin render — pregunta abierta).

**Modelo de datos tocado:**
- `link.appearances[]` — colección — persistente.
- `link` — eliminado condicionalmente — persistente.

**Dependencias:**
- Bloqueada por: HU-11.021.
- Relaciona: EPICA-1C (análogo en things), EPICA-12 (apariencias en inzoom).

**Integraciones:**
- Kernel (aplicador con scope).
- Modelo de apariencias (separación modelo-vs-OPD).

**Notas de evidencia:**
**Fuente normativa primaria:** —
- Fuente: §2 tabla, §4.1, §6, §11.3 (pregunta abierta sobre default).
- Clase de afirmación: observado (modal existe) + abierto (default).
- Etiqueta: `requires-clarification`.

**Prioridad:** M0.
**Tamaño:** M.
**Etiquetas:** [canvas, kernel, eliminación, apariencia-vs-modelo, modal, requires-clarification].

---

### HU-11.023 — Borrar varios links seleccionados en lote

**Actor primario:** ME.
**Tipo:** opcloud-ui.

**Nivel categórico:** K primario; U secundaria.
**Superficie UI:** toolbar-contextual + modal-choose-remove-operation.
**Gesto canónico:** multi-selección de links + clic en `Remove`.

**Historia:**
> Como modelador experto, quiero eliminar varios links en un solo gesto después de multi-seleccionarlos para limpiar ramas erróneas sin repetir el remove N veces.

**Contexto de negocio:**
La transcripción §4.1 detalla este flujo: "se seleccionan varios links, se pulsa borrar, aparece popup con dos modos". Es multi-selección aplicada a eliminación, otra pieza de la productividad en lote.

**Criterios de aceptación:**
- **Dado** que tengo N links seleccionados, **cuando** hago clic en `Remove`, **entonces** aparece el popup de 2 modos (aplicado a todo el lote).
- **Dado** que elijo `Remove appearance only` en el lote, **cuando** confirmo, **entonces** las N apariencias se eliminan atómicamente.
- **Dado** que elijo `Remove from model`, **cuando** confirmo, **entonces** los N links se eliminan completamente, y el canvas + OPL se actualizan en una sola transacción.
- **Dado** que algunos links del lote tienen múltiples apariencias y otros no, **cuando** se evalúa el scope: **pregunta abierta** — ¿se aplica el scope a todos o se ofrece una decisión por link?

**Reglas y restricciones:**
- Operación transaccional: si falla en medio, se revierten todas las eliminaciones.
- Default del scope en lote: abierto (heredado de HU-11.022).

**Modelo de datos tocado:**
- N `links` eliminados atómicamente.

**Dependencias:**
- Bloqueada por: HU-11.005 o HU-11.006, HU-11.022.

**Integraciones:**
- Kernel (transacción).

**Notas de evidencia:**
**Fuente normativa primaria:** —
- Fuente: §4.1.
- Transcripción: "se seleccionan varios links... se pulsa borrar... aparece popup con dos modos".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [canvas, kernel, eliminación, batch, multi-select, transacción].

---

### HU-11.024 — Guardar modelo explícitamente y ver toast de éxito

**Actor primario:** MN.
**Tipo:** opcloud-ui.

**Nivel categórico:** P (persistencia) primario; U secundaria.
**Superficie UI:** toolbar-save + toast-superior-derecha.
**Gesto canónico:** clic en botón Save o shortcut equivalente.

**Historia:**
> Como modelador, quiero guardar el modelo explícitamente y recibir confirmación no-bloqueante de que se guardó para tener tranquilidad sin perder contexto de modelado.

**Contexto de negocio:**
Guardado explícito es el contrato fundamental de persistencia: el usuario decide cuándo cortar. El feedback tiene que ser rápido y no-bloqueante — un modal "Saved OK" sería obstrucción; un toast efímero es la forma correcta. Mensaje canónico del reverse: `Successfully saved model [OnStar Example].`

**Criterios de aceptación:**
- **Dado** que el modelo tiene cambios sin guardar, **cuando** hago clic en Save, **entonces** el modelo se persiste y aparece un toast superior-derecha con mensaje `Successfully saved model [<nombre>].`
- **Dado** que el toast apareció, **cuando** pasan unos segundos, **entonces** el toast se desvanece solo (no modal, no requiere dismiss manual).
- **Dado** que guardo un modelo sin nombre (primer save), **cuando** ejecuto Save: **pregunta abierta** sobre si abre modal Save As o guarda con nombre default. Delegación a EPICA-30.
- **Dado** que el save fue exitoso, **cuando** miro el tab superior, **entonces** ya no aparece `(Not Saved)` o indicador dirty.
- **Dado** que el save falla (red, permisos), **cuando** se detecta el error, **entonces** aparece un toast de error (no success).

**Reglas y restricciones:**
- Toast es efímero (no modal).
- Duración recomendada: 2–4 segundos.
- Delegación a EPICA-30 para Save As, nombres, ubicación.

**Modelo de datos tocado:**
- `workspace.lastSaved` — timestamp — persistente.
- `workspace.dirty` — bool — transitorio.

**Dependencias:**
- Bloqueada por: HU-10.022 (indicador Not Saved).
- Relaciona: EPICA-30.

**Integraciones:**
- Capa de persistencia (`src/persistencia/`).
- Tab superior (eco estado persistencia).

**Notas de evidencia:**
**Fuente normativa primaria:** —
- Fuente: §2 tabla, §4.2.
- Frames: frame_00047.
- Transcripción: "el guardado produce toast efímero y no modal".
- Clase de afirmación: observado + confirmado.

**Prioridad:** M0.
**Tamaño:** S.
**Etiquetas:** [canvas, persistencia, save, toast].

---

### HU-11.025 — Iniciar link desde zona de borde respetando handles y pan

**Actor primario:** ME.
**Actores secundarios:** MN.
**Tipo:** opm-semantica.

**Nivel categórico:** U primario; V secundaria.
**Superficie UI:** canvas + cursor-feedback.
**Gesto canónico:** mouse-down en zona de borde del shape + drag.

**Historia:**
> Como modelador, quiero que el canvas distinga con feedback de cursor las 4 zonas del shape (interior, handles, borde link-magnet, exterior) para iniciar el gesto correcto sin errores accidentales.

**Contexto de negocio:**
§10 del doc fuente es explícito: la ventana de borde "link-magnet" es estrecha y requiere feedback de cursor para ser usable. Sin esta disciplina, el usuario iniciaría links por accidente al mover shapes o al hacer pan. Es la base gestual sobre la que se monta todo el modelado de relaciones.

**Criterios de aceptación:**
- **Dado** que muevo el cursor sobre el **interior** de un shape, **cuando** paso sobre él, **entonces** el cursor toma forma de mover (crosshair u hand), y drag mueve el shape.
- **Dado** que muevo el cursor sobre un **handle blanco** de resize, **cuando** paso sobre él, **entonces** el cursor toma forma de resize (SE/E/S), y drag redimensiona.
- **Dado** que muevo el cursor al **borde exterior pixel-perfect** (entre handle y exterior), **cuando** paso, **entonces** el cursor cambia a forma de link (cruz u otra), y drag inicia un link.
- **Dado** que muevo el cursor **fuera** del shape (canvas vacío), **cuando** paso, **entonces** el cursor es el default, y drag hace pan del canvas.

**Reglas y restricciones:**
- Las 4 zonas son disjuntas y completas.
- El cursor visual es **el mecanismo principal** de descubrimiento de la zona link-magnet.
- Tolerancia pixel: configurable, pero estrecha por design.

**Modelo de datos tocado:**
- Ninguno; es puro comportamiento UI.

**Dependencias:**
- Bloqueada por: HU-10.001 o HU-10.002.
- Bloquea a: HU-10.007, HU-11.026, HU-11.003, HU-11.009, HU-11.012.

**Integraciones:**
- JointJS (handlers por zona).
- Canvas (pan).

**Notas de evidencia:**
**Fuente normativa primaria:** [V-61] [JOYAS §4]
- Fuente: §10 completo.
- Transcripción: "la ventana de borde link-magnet es estrecha; a usuario humano le funciona porque el cursor cambia de forma al acercarse al borde".
- Clase de afirmación: confirmado por transcripción + sandbox.

**Prioridad:** M0.
**Tamaño:** M.
**Etiquetas:** [canvas, ui, links, drag, cursor-feedback, zonas, discovery].

---

### HU-11.026 — Ver picker "Select the link kind" filtrado por dirección y tipos

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** opm-semantica.

**Nivel categórico:** V primario; K (filtrado semántico) secundaria.
**Superficie UI:** modal-link-table (`Select the link kind from X to Y`).
**Gesto canónico:** ninguno (render inmediato post-drop).

**Historia:**
> Como modelador, quiero que el picker me muestre la lista completa y canónica de tipos de link válidos según la dirección del drag y los tipos de los extremos para elegir la relación correcta sin saber de memoria la gramática OPM.

**Contexto de negocio:**
§10.2 del doc fuente enumera explícitamente **13 opciones distribuidas por dirección**: O→P (4: Exhibition, Instrument, Consumption, Effect), P→O (3: Exhibition, Result, Effect), O→O (6: Aggregation, Exhibition, Generalization, Classification, Unidirectional Tagged, Bidirectional Tagged). P→P no aparece en este doc (delegado a EPICA-15). El picker es el corazón pedagógico del modelador: al filtrar solo lo legal, enseña la gramática mientras se modela. §10.3 define la estructura UI canónica del modal.

**Criterios de aceptación:**
- **Dado** que hago drop O→P (object a process), **cuando** se abre el picker, **entonces** veo exactamente 4 filas: Exhibition-Characterization, Instrument (con dropdown subtipo y modificador), Consumption (con dropdown subtipo y modificador), Effect (con dropdown subtipo y modificador).
- **Dado** que hago drop P→O, **cuando** se abre, **entonces** veo exactamente 3 filas: Exhibition-Characterization, Result, Effect. **No aparecen Instrument ni Consumption** (intencional: no aplican en esa dirección).
- **Dado** que hago drop O→O, **cuando** se abre, **entonces** veo exactamente 6 filas: Agregacion-Participacion, Exhibition-Characterization, Generalization-Specialization, Classification-Instantiation, Unidirectional Tagged Link, Bidirectional Tagged Link.
- **Dado** que el picker está abierto, **cuando** miro el título, **entonces** muestra `Select the link kind from <X> to <Y>` con nombres **tipo-coloreados**: verde para Object, azul para Process.
- **Dado** que cada fila presenta: **cuando** la veo, **entonces** tiene ícono OPM canónico + nombre del tipo + OPL preview + (si aplica) dropdown de subtipo + (si aplica) dropdown de modificador.
- **Dado** que el picker está abierto, **cuando** hago clic en botón `x` de esquina superior derecha, **entonces** se cierra sin crear link.
- **Dado** que cambio dropdown de subtipo o modificador en alguna fila, **cuando** se actualiza, **entonces** la OPL preview de esa fila se actualiza dinámicamente.

**Reglas y restricciones:**
- Lista estrictamente cerrada por dirección (no hay "otros" genérico).
- Colores del título son visuales solo; no afectan modelo.
- P→P delegado a EPICA-15 (no incluido en esta HU).
- Filtro por esencia (Agent solo si physical) opera en subtipos de Instrument — HU-10.010 lo cubre.

**Modelo de datos tocado:**
- Ninguno hasta confirmación (el link no existe hasta el clic en fila).

**Dependencias:**
- Bloqueada por: HU-10.007, HU-10.008, HU-10.009, HU-11.025.
- Bloquea a: HU-11.003, HU-11.009, HU-11.010, HU-11.012, HU-11.027.

**Integraciones:**
- Validador del kernel (compatibilidad por dirección).
- Motor OPL (preview por opción).
- Gramática OPM (SSOT).

**Notas de evidencia:**
**Fuente normativa primaria:** [V-239] [V-240]
- Fuente: §10, §10.1, §10.2, §10.3.
- Frames: frame_00029.
- Transcripción: "las opciones del picker cambian según el tipo de cada extremo y la dirección del drag".
- Clase de afirmación: observado + confirmado por transcripción + sandbox.

**Prioridad:** M0.
**Tamaño:** L.
**Etiquetas:** [canvas, ui, link-table, validación, taxonomía-opm, pedagógico, color-coded].

---

### HU-11.027 — Seleccionar subtipo Condition/Event y modificador NOT en el picker

**Actor primario:** ME.
**Actores secundarios:** MN (para aprender).
**Tipo:** opm-semantica.

**Nivel categórico:** K primario; L (OPL preview) secundaria.
**Superficie UI:** modal-link-table (dropdowns de subtipo y modificador).
**Gesto canónico:** cambio de dropdown.

**Historia:**
> Como modelador experto, quiero elegir el subtipo (base, Condition o Event) y el modificador (None o NOT) del link procedural en el picker para capturar semántica procedural condicional o negada sin abrir otro diálogo.

**Contexto de negocio:**
§10.2 distingue subtipos Condition y Event para Instrument, Consumption y Effect:
- **Instrument**: Instrument · Instrument Condition · Instrument Event.
- **Consumption**: Consumption · Consumption Condition · Consumption Event.
- **Effect**: Effect · Effect Condition · Effect Event.

Condition cambia la semántica: el input/efecto es condicional (el process revisa, no actúa automáticamente). Event es activador (dispara el process). NOT es la negación semántica de cualquiera. La OPL exacta por cada combinación es **pregunta abierta** (§11.4 fuente) — se observó la existencia del dropdown y modificador pero no la totalidad de las 18 oraciones resultantes.

**Criterios de aceptación:**
- **Dado** que el picker tiene una fila de `Instrument` con dropdown de subtipo, **cuando** abro el dropdown, **entonces** veo 3 opciones: `Instrument`, `Instrument Condition`, `Instrument Event`.
- **Dado** que elijo `Instrument Condition`, **cuando** se aplica, **entonces** la OPL preview se actualiza (texto exacto por SSOT OPL — abierto).
- **Dado** que la fila tiene dropdown de modificador con `None` / `NOT`, **cuando** elijo `NOT`, **entonces** la OPL preview refleja la negación.
- **Dado** que confirmo la fila con subtipo `Instrument Event` y modificador `NOT`, **cuando** el link se crea, **entonces** `link.subtype="instrument-event"` y `link.modifier="NOT"`.
- **Dado** que aplicable a Consumption y Effect, **cuando** miro esas filas, **entonces** tienen dropdowns análogos con subtipos Consumption/Consumption Condition/Consumption Event y Effect/Effect Condition/Effect Event.
- **Dado** que una fila no admite subtipo (p.ej. Exhibition, Aggregation), **cuando** la miro, **entonces** no tiene dropdown de subtipo ni modificador.

**Reglas y restricciones:**
- Default de subtipo: base (Instrument simple).
- Default de modificador: None.
- Solo Instrument, Consumption, Effect admiten estos controles.
- OPL exacta para cada combinación: delegado a SSOT OPL / EPICA-50. Marcado como abierto.
- Semántica de NOT por tipo: pregunta abierta (§11.5 fuente).

**Modelo de datos tocado:**
- `link.subtype` — enum — persistente.
- `link.modifier` — `"None" | "NOT"` — persistente.

**Dependencias:**
- Bloqueada por: HU-11.026, HU-10.009 (preview OPL).
- Relaciona: EPICA-50 (panel OPL-ES).

**Integraciones:**
- Kernel (persistencia de subtipo y modificador).
- OPL (preview y pane).

**Notas de evidencia:**
**Fuente normativa primaria:** [V-239] [OPL-ES §2]
- Fuente: §10.2 tabla O→P, §10.3, §11.4, §11.5.
- Clase de afirmación: observado (controles visibles) + abierto (OPL exacta).
- Etiqueta: `requires-clarification`.

**Prioridad:** M1.
**Tamaño:** M.
**Etiquetas:** [canvas, kernel, links, subtipo, modificador, condition, event, not, requires-clarification].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q11.1**: Alcance exacto de `Style` y `Copy Style` — ¿cubre solo color/grosor, o también decoraciones de extremos (cabezas de flecha, triángulos)? Afecta HU-11.016 y HU-11.017. Marcadas `requires-clarification`.
- **Q11.2**: ¿El bus colector puede forzarse manualmente en cualquier link estructural o solo emerge de ciertas relaciones (hoy observado solo en Aggregation)? Afecta HU-11.004.
- **Q11.3**: ¿El popup de borrado (`Choose Remove Operation`) tiene defaults diferentes según el número de apariencias (por ejemplo, pre-selecciona `appearance only` si hay 2+)? Afecta HU-11.022 y HU-11.023. Marcadas `requires-clarification`.
- **Q11.4**: OPL exacta de los 6 subtipos procedurales (Instrument Condition, Instrument Event, Consumption Condition, Consumption Event, Effect Condition, Effect Event) para cada combinación con modificador. Afecta HU-11.027. Delegada a SSOT OPL / EPICA-50.
- **Q11.5**: Semántica precisa del modificador `NOT` en cada tipo procedural (¿es negación lógica, condicional o enumerativa?). Afecta HU-11.027. Marcada `requires-clarification`.
- **Q11.6** (derivada HU-11.002): ¿La preferencia de `Auto Format desmarcado` es sticky entre popups de la misma sesión o se resetea cada vez? Observación default: no-sticky. Pendiente validar.
- **Q11.7** (derivada HU-11.014): Comportamiento cuando el tag de un Unidirectional Tagged Link se deja vacío en el popup de propiedades (¿se rechaza, se restaura default, se persiste vacío?).
- **Q11.8** (derivada HU-11.018): Gesto exacto para eliminar un vértice manual del link (doble clic, contextual, otro). Observado que se crean por clic, no observado cómo se borran.
- **Q11.9** (derivada HU-11.023): Cuando el lote mezcla links con y sin múltiples apariencias, ¿el scope del borrado aplica uniformemente o se pide decisión por link?
- **Q11.10** (derivada HU-11.024): Comportamiento del primer Save de un modelo sin nombre (¿abre Save As automáticamente, usa default?). Delegada a EPICA-30.

## Referencias cruzadas

- Doc fuente: `opcloud-reverse/11-canvas-modelado-basico.md` (12 secciones, 8 frames muestreados, transcripción integrada).
- Épicas dependientes (upstream — esta épica las bloquea o usa):
  - **EPICA-10** (creación de cosas): provee primitivas Thing, popup Auto Format, afiliacion/esencia, picker base, HU-10.001/002/007/008/009/010/011.
- Épicas bloqueadas o integradas (downstream — consumen esta épica o comparten escenarios):
  - **EPICA-12** (inzooming): usa el mismo principio modelo-vs-apariencia para OPDs hijos.
  - **EPICA-13** (estados): similar separación aparición/modelo en states.
  - **EPICA-14** (styling): extiende HU-11.016 y HU-11.017 (Style y Copy Style avanzado).
  - **EPICA-15** (enlaces avanzados): cubre dirección P→P no tratada en §10.2.
  - **EPICA-16** (enlaces propiedades): extiende el popup de HU-11.013 con propiedades avanzadas.
  - **EPICA-1A** (grid/resize): interacciona con reanclaje HU-11.020 y vértices HU-11.018/019 (snap).
  - **EPICA-1B** (operaciones bring): usa multi-selección HU-11.005/006 para operaciones en lote.
  - **EPICA-1C** (validaciones): valida compatibilidad de links y consistencia después de cambios de esencia.
  - **EPICA-30** (persistencia save/load): cubre Save As, Save First, y detalles de HU-11.024.
  - **EPICA-50** (panel OPL-ES): resuelve Q11.4 (OPL exacta de subtipos) y consume HU-11.011/014.
  - **EPICA-90** (shortcuts): Delete key para HU-11.021, atajos para multi-selección.
- Invariantes del repo tocados:
  - `src/nucleo/tipos.ts` — definiciones de Link (tipos, subtipos, modificador, tag, multiplicity).
  - `src/nucleo/validacion/` — passes de compatibilidad por dirección y esencia.
  - `src/nucleo/aplicador.ts` — transacciones atómicas para batch (HU-11.007, HU-11.023).
  - `src/render/jointjs/` — factories de link con íconos OPM, popup de propiedades, cursor feedback por zona (HU-11.025).
  - `src/render/layout/` — pass de bus-fusion para Aggregation (HU-11.004), preservación de vértices manuales.
  - `src/render/opl-renderer.ts` — oraciones para agent/instrument, tagged links con tag renombrado, multiplicity.
  - `src/persistencia/` — save explícito con toast (HU-11.024).
  - `src/ui/` — modales `Select the link kind` y `Choose Remove Operation`, popup de propiedades, multi-selección con Ctrl/Shift, toast.
- SSOT OPM relevante:
  - `ssot/opm-visual-es.md` — V-xx para íconos canónicos de cada tipo de link, colores tipo-coloreados del título del modal, render de bus vertical, vértices.
  - `ssot/opm-opl-es.md` — gramática OPL para agent (`handles`), instrument (`requires`), tagged links con tag dinámico, multiplicity, subtipos Condition/Event, modificador NOT.
  - `ssot/opm-iso-19450-es.md` — taxonomía canónica de 13 tipos de link por dirección.
