---
epica: "EPICA-33"
titulo: "Persistencia — plantillas (plantillas reutilizables, ámbitos Private/Organizational/Global, insertar, guardar, editar)"
doc_fuente: "opcloud-reverse/33-persistencia-templates.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "S"
hu_emitidas: 22
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "PILOTO-EPICA-10.md"
---

## Resumen

Esta épica cubre el ciclo de vida completo de las **plantillas** como artefactos paralelos al modelo: concepto, guardado, inserción con fusión, edición desacoplada, organización jerárquica en tres ámbitos (Private / Organizational / Global), anidamiento en carpetas, favoritas, previsualización por hover, búsqueda y resolución automática de colisiones de nombre por sufijo `_n`. La inserción es una **operación de copia profunda + merge** que extiende tanto el OPD activo como el árbol OPD del modelo huésped; tras la inserción la plantilla y su copia quedan **detached** (actualizar la plantilla no propaga cambios al modelo huésped). Las HU se numeran siguiendo la aparición en el doc fuente, sin reordenar por prioridad.

El valor de esta épica es **diferencial** frente a la creación ad-hoc: permite a los modeladores acumular capital reutilizable (patrones OPM, fragmentos de dominio, plantillas de organización) y compartirlo a escala de persona, organización o sistema. Es un habilitador de adopción: un modelador novato puede arrancar desde una plantilla y un admin puede estandarizar patrones de la organización.

## Tabla de HU de la épica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-33.001 | Disponer de plantillas como artefacto de primer nivel | MN | S | XS | opcloud-ui | — |
| HU-33.002 | Guardar el modelo actual como plantilla | MN | S | M | opcloud-ui | — |
| HU-33.003 | Guardar una plantilla en ámbito Private | MN | S | S | opcloud-ui | — |
| HU-33.004 | Guardar una plantilla en ámbito Organizational | AO | S | S | opcloud-ui | — |
| HU-33.005 | Guardar una plantilla en ámbito Global | AO | C | S | opcloud-ui | — |
| HU-33.006 | Insertar una plantilla en el OPD actual | MN | S | L | opcloud-ui | — |
| HU-33.007 | Hacer merge recursivo de sub-OPDs bajo el OPD activo | ME | S | M | opcloud-ui | — |
| HU-33.008 | Resolver colisiones de nombre con sufijo `_n` al insertar | ME | S | M | opcloud-ui | — |
| HU-33.009 | Preservar nombres de Exhibition links al reinsertar | ME | S | S | opcloud-ui | — |
| HU-33.010 | Destacar visualmente los elementos recién insertados | MN | C | S | opcloud-ui | — |
| HU-33.011 | Ver previsualización miniatura de plantilla en hover | MN | C | M | opcloud-ui | — |
| HU-33.012 | Buscar plantillas por nombre en el modal | MN | S | S | opcloud-ui | — |
| HU-33.013 | Extender búsqueda a subcarpetas con checkbox | ME | C | XS | opcloud-ui | — |
| HU-33.014 | Navegar carpetas de plantillas con breadcrumb | MN | S | S | opcloud-ui | — |
| HU-33.015 | Ver carpeta vacía con mensaje `No Models` | MN | M1 | XS | opcloud-ui | — |
| HU-33.016 | Editar una plantilla existente en modo Plantilla | AD | S | M | opcloud-ui | — |
| HU-33.017 | Ver prefijo `<<Plantilla>>` en modo edición de plantilla | AD | M1 | XS | opcloud-ui | — |
| HU-33.018 | Ver que plantilla y copias quedan desacopladas post-insert | ME | S | S | opcloud-ui | — |
| HU-33.019 | Ver solo ámbitos permitidos en Guardar según rol | AO | S | S | opcloud-ui | — |
| HU-33.020 | Marcar plantilla como favorita con estrella | ME | C | S | opcloud-ui | — |
| HU-33.021 | Cortar carpeta de plantillas para reorganizar | AO | C | M | opcloud-ui | — |
| HU-33.022 | Cancelar modal de plantilla sin efecto colateral | MN | M1 | XS | opcloud-ui | — |

Total: **22 historias de usuario** (22 opcloud-ui).

## Historias de usuario

### HU-33.001 — Disponer de plantillas como artefacto de primer nivel

**Actor primario:** MN (modelador novato).
**Actores secundarios:** ME, AD, AO.
**Tipo:** opcloud-ui.
**Nivel categórico:** P (persistencia) primario; U (menu) secundario.
**Superficie UI:** main-menu-hamburguesa → `Plantillas ▶` (submenu con `Editar plantilla`, `Guardar plantilla`).
**Gesto canónico:** clic en `Plantillas` del main menu.

**Historia:**
> Como modelador, quiero que las plantillas aparezcan como artefacto hermano de `Nuevo modelo` / `Cargar modelo` / `Guardar` en el main menu para tratarlas como ciudadanos de primer nivel, no como opción escondida.

**Contexto de negocio:**
La transcripción confirma que las plantillas son un **artefacto paralelo al modelo**, no un subtipo de exportación. Entrada en el main menu a la altura de las operaciones de modelo canónicas refuerza esa ontología y permite descubrir la funcionalidad sin tutorial.

**Criterios de aceptación:**
- **Dado** que abro el main menu, **cuando** reviso las entradas, **entonces** `Plantillas` aparece junto a `Nuevo modelo`, `Cargar modelo`, `Guardar`, `Guardar como`.
- **Dado** que paso el cursor sobre `Plantillas`, **cuando** se expande la flecha `▶`, **entonces** veo dos subentradas: `Editar plantilla` y `Guardar plantilla`.
- **Dado** que el usuario no ha guardado ninguna plantilla, **cuando** abre el submenu, **entonces** `Editar plantilla` sigue disponible (abre modal con lista vacía).

**Reglas y restricciones:**
- `Plantillas` siempre visible (no condicional al rol — el filtrado es por ámbitos, no por existencia de menu).
- Hermano, no hijo, de `Guardar como` — no debe aparecer como opción de exportación.

**Modelo de datos tocado:**
- Ninguno directo; es afordance de navegación.

**Dependencias:**
- Bloquea a: HU-33.002, HU-33.006, HU-33.016 (todos los flujos de plantilla).

**Integraciones:**
- Main menu (EPICA-30 save-load hermano).

**Notas de evidencia:**
- Fuente normativa primaria: —
- Fuente OPCloud: `opcloud-reverse/33-persistencia-templates.md` §2 (submenú `Templates`), §7.5.
- Frames: frame_00025.
- Clase de afirmación: observado + confirmado por transcripción.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [plantillas, concepto, persistencia, main-menu, opcloud-ui].

---

### HU-33.002 — Guardar el modelo actual como plantilla

**Actor primario:** MN.
**Actores secundarios:** ME, AD, AO.
**Tipo:** opcloud-ui.
**Nivel categórico:** P primario; U (modal) secundario.
**Superficie UI:** main-menu → `Plantillas` → `Guardar plantilla` + modal-guardar-plantilla.
**Gesto canónico:** clic en `Guardar plantilla` del submenu + edición del formulario + clic en `Guardar`.

**Historia:**
> Como modelador, quiero guardar el modelo actual como plantilla reutilizable para capitalizar patrones recurrentes sin reconstruirlos cada vez.

**Contexto de negocio:**
El valor de las plantillas se materializa en el momento de guardar: es la puerta de entrada al corpus reutilizable. La spec observa un flujo en tres gestos (menu → formulario → guardar) con valores precargados desde el modelo actual para reducir fricción.

**Criterios de aceptación:**
- **Dado** que tengo un modelo abierto, **cuando** clic en `Plantillas` → `Guardar plantilla`, **entonces** se abre el modal `Guardar plantilla`.
- **Dado** que el modal se abre, **cuando** inspecciono `Nombre del modelo`, **entonces** aparece pre-llenado con el nombre del modelo actual (p.ej. `A Processing`).
- **Dado** que el modal se abre, **cuando** inspecciono `Descripción`, **entonces** aparece vacío (campo opcional).
- **Dado** que completé nombre + descripción + carpeta, **cuando** clic en `Guardar`, **entonces** la plantilla persiste y el modal se cierra.
- **Dado** que cancelo con `Cancelar` o `Escape`, **cuando** cierra el modal, **entonces** no se persiste nada (ver HU-33.022).

**Reglas y restricciones:**
- `Nombre del modelo` pre-llenado pero editable.
- `Descripción` es texto libre, monolínea (límite abierto — ver Q33.5).
- El snapshot persistido incluye el modelo completo con todos sus OPDs hijos (copia profunda), no solo el OPD activo.
- Sin selección de carpeta, la plantilla va a raíz del ámbito.

**Modelo de datos tocado:**
- `plantilla.id` — UUID — persistente.
- `plantilla.name` — string — persistente.
- `plantilla.descripcion` — string nullable — persistente.
- `plantilla.scope` — `"private" | "organizational" | "global"` — persistente (ver HU-33.003–005).
- `plantilla.folder_path` — string path — persistente.
- `plantilla.content` — snapshot profundo del modelo — persistente.
- `plantilla.owner` — user_id | org_id — persistente.
- `plantilla.created_at` — timestamp — persistente.

**Dependencias:**
- Bloqueada por: HU-33.001.
- Bloquea a: HU-33.003, HU-33.004, HU-33.005, HU-33.006, HU-33.016, HU-33.019.

**Integraciones:**
- Persistencia (`src/persistencia/` — extensión para plantillas como artefacto separado).
- Árbol de carpetas del ámbito elegido.

**Notas de evidencia:**
- Fuente normativa primaria: —
- Fuente OPCloud: §3.3, §5.2.
- Frames: frame_00025.
- Transcripción: "you can create your templates and use them".
- Clase de afirmación: observado + confirmado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [plantillas, guardar, persistencia, modal, copia-profunda, opcloud-ui].

---

### HU-33.003 — Guardar una plantilla en ámbito Private

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** P primario; C (scope) secundario.
**Superficie UI:** modal-guardar-plantilla tab `Private`.
**Gesto canónico:** clic en tab `Private` + `Guardar`.

**Historia:**
> Como modelador, quiero guardar una plantilla en mi ámbito `Private` para que quede visible solo para mí sin exponerla a mi organización.

**Contexto de negocio:**
`Private` es el ámbito default y único siempre disponible: todo modelador regular tiene acceso a guardar plantillas privadas. Es la puerta de entrada al capital reutilizable personal antes de proponer estandarización organizacional.

**Criterios de aceptación:**
- **Dado** que abro `Guardar plantilla`, **cuando** miro los tabs, **entonces** `Private` siempre aparece visible.
- **Dado** que estoy en tab `Private`, **cuando** guardo una plantilla, **entonces** queda con `plantilla.scope="private"` y `plantilla.owner=user_id` del autor.
- **Dado** que guardé una plantilla privada, **cuando** otro usuario abre `Insertar plantilla`, **entonces** esa plantilla no aparece en su lista.
- **Dado** que guardé una plantilla privada, **cuando** yo mismo abro `Insertar plantilla` tab `Private`, **entonces** la plantilla aparece.

**Reglas y restricciones:**
- `Private` es el scope default si el usuario no cambia de tab.
- Solo el owner puede leer, editar y borrar su plantilla privada.
- No hay compartición cross-user dentro de `Private`.

**Modelo de datos tocado:**
- `plantilla.scope = "private"` — persistente.
- `plantilla.owner = user_id` — persistente.

**Dependencias:**
- Bloqueada por: HU-33.002.
- Bloquea a: HU-33.006 (lectura), HU-33.016 (edición).

**Integraciones:**
- Permisos (EPICA-40).

**Notas de evidencia:**
- Fuente normativa primaria: —
- Fuente OPCloud: §1, §2 (tabs), §3.3, §4.1.
- Transcripción: "if you only have a permission as a regular modeler you'll only be able to save private templates for your use only".
- Frames: frame_00025 (muestra solo `Private` en sesión de modelador regular).
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [plantillas, guardar, private, scope, opcloud-ui].

---

### HU-33.004 — Guardar una plantilla en ámbito Organizational

**Actor primario:** AO (admin de organización).
**Actores secundarios:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** P primario; C, X (permisos) secundarios.
**Superficie UI:** modal-guardar-plantilla tab `Organizational`.
**Gesto canónico:** clic en tab `Organizational` + `Guardar`.

**Historia:**
> Como admin de organización, quiero guardar plantillas en el ámbito `Organizational` para estandarizar patrones OPM entre los modeladores de mi organización.

**Contexto de negocio:**
El scope organizacional es la vía de estandarización: permite que un admin publique fragmentos canónicos (vocabulario del negocio, workflows recurrentes) que aparezcan automáticamente a todos los modeladores de la organización. Es el mecanismo de gobernanza ligera del corpus OPM de una empresa.

**Criterios de aceptación:**
- **Dado** que soy `organizational admin`, **cuando** abro `Guardar plantilla`, **entonces** el tab `Organizational` está visible y habilitado.
- **Dado** que soy modelador regular, **cuando** abro `Guardar plantilla`, **entonces** el tab `Organizational` NO aparece (o aparece deshabilitado).
- **Dado** que guardo en tab `Organizational`, **cuando** se persiste, **entonces** queda con `plantilla.scope="organizational"` y `plantilla.owner=org_id`.
- **Dado** que guardé una plantilla organizacional, **cuando** cualquier modelador de la misma organización abre `Insertar plantilla` tab `Organizational`, **entonces** la plantilla aparece.

**Reglas y restricciones:**
- Visibilidad del tab en `Guardar plantilla` condicionada por rol.
- Lectura abierta a todos los miembros de la organización.
- Escritura/edición restringida a organizational admins (ver HU-33.019).

**Modelo de datos tocado:**
- `plantilla.scope = "organizational"` — persistente.
- `plantilla.owner = org_id` — persistente.

**Dependencias:**
- Bloqueada por: HU-33.002, HU-33.019.

**Integraciones:**
- Permisos (EPICA-40): consulta rol.
- Ontología organizacional (EPICA-82).

**Notas de evidencia:**
- Fuente normativa primaria: —
- Fuente OPCloud: §1, §3.3, §4.1, §7.6.
- Transcripción: "if you're an organization on the main you'll be able to save it as an organizational admin template".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [plantillas, guardar, organizational, scope, permisos, opcloud-ui].

---

### HU-33.005 — Guardar una plantilla en ámbito Global

**Actor primario:** AO (system admin, subclase de AO con scope global).
**Tipo:** opcloud-ui.
**Nivel categórico:** P primario; C, X secundarios.
**Superficie UI:** modal-guardar-plantilla tab `Global`.
**Gesto canónico:** clic en tab `Global` + `Guardar`.

**Historia:**
> Como system admin, quiero guardar plantillas en el ámbito `Global` para compartir patrones genéricos a todos los modeladores de todas las organizaciones.

**Contexto de negocio:**
El scope global es el **corpus canónico** del producto: plantillas genéricas lo suficientemente abstractas para servir a cualquier dominio (p.ej. patrones de control-flow, de entrada/salida, de feedback). Es el nivel más restringido en escritura y más amplio en lectura.

**Criterios de aceptación:**
- **Dado** que soy `system admin`, **cuando** abro `Guardar plantilla`, **entonces** el tab `Global` está visible y habilitado.
- **Dado** que NO soy system admin, **cuando** abro `Guardar plantilla`, **entonces** el tab `Global` no aparece (o aparece deshabilitado).
- **Dado** que guardo en tab `Global`, **cuando** se persiste, **entonces** queda con `plantilla.scope="global"` y `plantilla.owner=system`.
- **Dado** que guardé una plantilla global, **cuando** cualquier modelador de cualquier organización abre `Insertar plantilla` tab `Global`, **entonces** la plantilla aparece.

**Reglas y restricciones:**
- Solo system admin escribe.
- Todos los usuarios leen.
- Criterio de aceptación de una plantilla global: "generic enough" (transcripción) — política editorial, no regla automatizada.

**Modelo de datos tocado:**
- `plantilla.scope = "global"` — persistente.
- `plantilla.owner = "system"` — persistente.

**Dependencias:**
- Bloqueada por: HU-33.002, HU-33.019.

**Integraciones:**
- Permisos de system admin (EPICA-40 o fuera del scope del modelador core).

**Notas de evidencia:**
- Fuente normativa primaria: —
- Fuente OPCloud: §1, §3.3.
- Transcripción: "general template created by the system admin shared between all models if it is generic enough".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** C (relevante pero fuera del núcleo del modelador local; depende de infra multi-org).
**Tamano:** S.
**Etiquetas:** [plantillas, guardar, global, scope, permisos, system-admin, opcloud-ui].

---

### HU-33.006 — Insertar una plantilla en el OPD actual

**Actor primario:** MN.
**Actores secundarios:** ME, AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** K (muta modelo) primario; V, U, P secundarios.
**Superficie UI:** secondary-toolbar botón `Insertar plantilla` + modal-insertar-plantilla.
**Gesto canónico:** clic en botón `Insertar plantilla` + selección de plantilla + clic en `Cargar` (o doble clic).

**Historia:**
> Como modelador, quiero insertar una plantilla en el OPD actual del modelo abierto para incorporar fragmentos pre-hechos sin reescribirlos a mano.

**Contexto de negocio:**
La inserción es el punto de valor de las plantillas. Reduce la construcción de modelos a composición: el modelador combina fragmentos validados en lugar de trazar cada primitiva. Es la diferencia entre "dibujar" y "componer" un modelo.

**Criterios de aceptación:**
- **Dado** que tengo un modelo abierto con al menos un OPD, **cuando** clic en `Insertar plantilla` de la secondary toolbar, **entonces** se abre el modal `Insertar plantilla`.
- **Dado** que el modal se abre, **cuando** miro los tabs, **entonces** el tab por defecto es `Private`.
- **Dado** que navego a una carpeta y selecciono una plantilla, **cuando** clic en `Cargar`, **entonces** la plantilla se copia al OPD actual.
- **Dado** que selecciono una plantilla, **cuando** doble-clic en la fila, **entonces** es equivalente a seleccionar + `Cargar`.
- **Dado** que la plantilla se insertó, **cuando** inspecciono el canvas, **entonces** los nodos aparecen en el OPD activo; si la plantilla tiene sub-OPDs, se crean bajo el OPD activo (ver HU-33.007).
- **Dado** que la plantilla se insertó, **cuando** consulto OPL, **entonces** las proposiciones de los nodos insertados aparecen en el pane.
- **Dado** que la plantilla se insertó, **cuando** consulto la biblioteca `Draggable OPM Things`, **entonces** los nuevos nodos aparecen como entidades independientes.

**Reglas y restricciones:**
- La operación es **copia profunda + merge**, no referencia viva.
- Target de la inserción = OPD activo del modelo huésped.
- Si hay colisión de nombres, aplica HU-33.008 (`_n`).
- Sub-OPDs de la plantilla se anidan bajo el OPD activo (ver HU-33.007).
- Post-inserción: la plantilla y las copias quedan desacopladas (HU-33.018).

**Modelo de datos tocado:**
- `cosa.*`, `enlace.*`, `opd.*` — todos los nodos copiados se agregan al modelo huésped con IDs nuevos.
- `plantilla` — no se muta.

**Dependencias:**
- Bloqueada por: HU-33.002 (plantilla debe existir).
- Bloquea a: HU-33.007, HU-33.008, HU-33.010, HU-33.018.

**Integraciones:**
- OPD tree (EPICA-20): se extiende con sub-OPDs.
- OPL pane (EPICA-50): nuevos renglones.
- Biblioteca lateral (HU-10.017).
- Navigator (HU-10.018).
- Secondary toolbar (EPICA-1A o análoga).

**Notas de evidencia:**
- Fuente normativa primaria: —
- Fuente OPCloud: §1, §3.1, §6.
- Frames: frame_00001, frame_00008, frame_00012, frame_00017.
- Transcripción: "click load double click will work as well".
- Clase de afirmación: observado + confirmado.

**Prioridad:** S.
**Tamano:** L.
**Etiquetas:** [plantillas, insert, merge, cargar, toolbar-secondary, copia-profunda, opcloud-ui].

---

### HU-33.007 — Hacer merge recursivo de sub-OPDs bajo el OPD activo

**Actor primario:** ME.
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** K primario; L (opd-tree) secundario.
**Superficie UI:** canvas + opd-navigator + opd-tree.
**Gesto canónico:** ninguno (consecuencia automática de HU-33.006).

**Historia:**
> Como modelador, quiero que al insertar una plantilla con sub-OPDs, el árbol OPD del huésped se extienda con nuevos nodos bajo el OPD activo para preservar la jerarquía de la plantilla dentro del modelo receptor.

**Contexto de negocio:**
Las plantillas no son árboles aislados; frecuentemente contienen descomposiciones (in-zoom, unfold) que deben integrarse al árbol del huésped sin aplastar la jerarquía. La regla canónica observada es: los sub-OPDs se anidan bajo el OPD activo del huésped en el momento de la inserción.

**Criterios de aceptación:**
- **Dado** que la plantilla T tiene OPDs `SD`, `SD1`, `SD1.1`, `SD1.2`, **cuando** la inserto bajo el OPD activo `SD2` del huésped, **entonces** el árbol del huésped crece con nodos hijos de `SD2` que replican la estructura de T.
- **Dado** que inserté una plantilla con estructura de 4 OPDs, **cuando** consulto el árbol, **entonces** todos los OPDs nuevos cuelgan del OPD activo al momento del `Cargar`, no de la raíz.
- **Dado** que los sub-OPDs nuevos tienen nombres propios de la plantilla, **cuando** se renumeran para el huésped, **entonces** respetan la convención SDx.y del huésped.
- **Dado** que la plantilla se inserta varias veces, **cuando** miro los sub-OPDs, **entonces** cada inserción genera ramas independientes del árbol con `_n` en los nombres de cosas (ver HU-33.008) y renumeración de SDs (regla exacta: pregunta abierta Q33.2).

**Reglas y restricciones:**
- Anclaje: OPD activo = punto de inserción, siempre.
- Renumeración de SDs: pregunta abierta (Q33.2 en doc fuente §11).
- Los OPDs insertados mantienen integridad (aristas, estados, anotaciones) del snapshot original.

**Modelo de datos tocado:**
- `opd.parent` — se asigna al OPD activo del huésped.
- `opd.children` — se extiende con los nuevos OPDs de la plantilla.
- `opd.id` — IDs nuevos, no reutilizados de la plantilla.

**Dependencias:**
- Bloqueada por: HU-33.006.
- Relaciona: EPICA-20 (OPD tree).

**Integraciones:**
- OPD tree (EPICA-20): refresh tras inserción.
- Layout: re-layout del OPD activo tras merge.

**Notas de evidencia:**
- Fuente normativa primaria: —
- Fuente OPCloud: §3.1 paso 8, §7.1.
- Transcripción: "as this template has another opd it will be created under the current opd that we're in".
- Frames: frame_00019 (muestra SD1 con merge), frame_00030/32 (árbol completo en edición de plantilla).
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [plantillas, insert, opd-tree, merge, recursivo, requires-clarification, opcloud-ui].

---

### HU-33.008 — Resolver colisiones de nombre con sufijo `_n` al insertar

**Actor primario:** ME.
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** K primario; V (render nombre) secundario.
**Superficie UI:** canvas + opl-pane + opd-navigator.
**Gesto canónico:** ninguno (automático al insertar).

**Historia:**
> Como modelador, quiero que al insertar la misma plantilla dos veces, el sistema renombre automáticamente las cosas con sufijo `_n` para evitar colisiones de nombre sin interrumpirme con un prompt.

**Contexto de negocio:**
La regla `_n` es el mecanismo de desambiguación directo y silencioso. No aparece modal ni warning: la herramienta resuelve la colisión a favor del usuario. Elimina fricción sin perder trazabilidad (el sufijo hace explícita la relación entre copias).

**Criterios de aceptación:**
- **Dado** que el huésped tiene `Object 1`, **cuando** inserto una plantilla que también trae `Object 1`, **entonces** el nuevo se renombra a `Object 1_2`.
- **Dado** que el huésped ya tiene `Object 1_2`, **cuando** inserto de nuevo, **entonces** el siguiente se renombra a `Object 1_3`.
- **Dado** que la plantilla contiene un OPD hijo, **cuando** se renombra en colisión, **entonces** el nombre del OPD también refleja el sufijo (p.ej. `SD1.2: A Processing_2 in-zoomed`).
- **Dado** que la plantilla contiene states, **cuando** el objeto padre colisiona, **entonces** los states siguen al padre renombrado.
- **Dado** que se aplicó el sufijo, **cuando** consulto OPL, **entonces** las proposiciones respetan los nuevos nombres (`Object 1_2 is ...`).
- **Dado** que se insertó sin colisión, **cuando** reviso los nombres, **entonces** no aparece sufijo alguno (el primero preserva el nombre original).

**Reglas y restricciones:**
- Sufijo comienza en `_2` (el primero no recibe sufijo).
- Aplica a Things (Objects, Processes) y States.
- NO aplica a Exhibition links (ver HU-33.009).
- Resolución es determinista: `_n+1` donde `n` es el máximo sufijo existente.
- Sin intervención del usuario: "la inserción es directa y silenciosa".

**Modelo de datos tocado:**
- `cosa.name` — string con posible sufijo — persistente.
- `state.name` — string con posible sufijo — persistente.
- `opd.name` — string con posible sufijo — persistente.

**Dependencias:**
- Bloqueada por: HU-33.006, HU-33.007.
- Bloquea a: HU-33.009 (excepción).

**Integraciones:**
- Validador de unicidad del kernel (EPICA-1C).
- OPL regeneration.

**Notas de evidencia:**
- Fuente normativa primaria: —
- Fuente OPCloud: §3.2, §4.4, §9.
- Transcripción: "it will update the names to add them a suffix to differentiate between the previous template".
- Frames: frame_00019 (`Object 1_2`, `A Processing_2`, `Object 2_2`).
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [plantillas, insert, validación, rename, colisión, sufijo, opcloud-ui].

---

### HU-33.009 — Preservar nombres de Exhibition links al reinsertar

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** K.
**Superficie UI:** canvas + opl-pane.
**Gesto canónico:** ninguno (automático al insertar).

**Historia:**
> Como modelador, quiero que los Exhibition links conserven su nombre original al insertar la misma plantilla varias veces porque su identidad está ligada al aspecto exhibido, no a la instancia.

**Contexto de negocio:**
En OPM, los Exhibition links (Exhibition-Characterization) nombran aspectos que pueden repetirse legítimamente a través de un modelo (p.ej. "weight" como exhibido atributo de varios objetos). Renombrarlos con `_n` rompería la semántica: dos cosas distintas exhibiendo "weight" deben compartir la etiqueta, no diverger.

**Criterios de aceptación:**
- **Dado** que el huésped tiene un Exhibition link con label `weight`, **cuando** inserto una plantilla que también contiene un Exhibition link con label `weight`, **entonces** el nuevo link conserva el label `weight` (NO se renombra a `weight_2`).
- **Dado** que la regla `_n` aplica a Things, **cuando** un Thing padre se renombra, **entonces** los Exhibition links asociados mantienen el mismo label original.
- **Dado** que inserto la misma plantilla 3 veces, **cuando** consulto todos los Exhibition links, **entonces** puede haber N nodos compartiendo el mismo label de exhibition sin conflicto.

**Reglas y restricciones:**
- Excepción dura a la regla `_n` de HU-33.008.
- Semántica OPM: exhibition links no identifican instancias; identifican aspectos reutilizables.
- No afecta a otros tipos de link (aggregation, generalization, tagged, etc.) — regla específica de exhibition.

**Modelo de datos tocado:**
- `link.type = "exhibition_characterization"` — trigger de excepción.
- `link.label` — preserva original.

**Dependencias:**
- Bloqueada por: HU-33.008 (excepción).

**Integraciones:**
- Validador kernel: reconoce excepción.
- OPL: no duplica `... exhibits weight.` aunque existan N copias.

**Notas de evidencia:**
- Fuente normativa primaria: —
- Fuente OPCloud: §3.2 (transcripción explícita), §9.
- Transcripción: "if the model had an exhibition link it would have not changed the name as exhibition name can be across the model and be reused".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [plantillas, insert, exhibition, rename, excepción, opcloud-ui].

---

### HU-33.010 — Destacar visualmente los elementos recién insertados

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** V primario.
**Superficie UI:** canvas-render (estilo transitorio).
**Gesto canónico:** ninguno (render automático post-inserción).

**Historia:**
> Como modelador, quiero ver los elementos recién insertados con un marcador visual transitorio para identificar inmediatamente qué acaba de entrar en mi modelo.

**Contexto de negocio:**
La inserción puede traer decenas de nodos; sin retroalimentación visual el usuario se desorienta. OPCloud usa un **borde naranja discontinuo + bounding box naranja** transitorios como marcador. Pregunta abierta: duración del marcador (ver Q33.1 en doc fuente).

**Criterios de aceptación:**
- **Dado** que acabo de insertar una plantilla, **cuando** se completa el merge, **entonces** los nodos insertados aparecen con borde discontinuo naranja y un bounding box naranja envolvente.
- **Dado** que hay nodos del huésped no afectados, **cuando** miro el canvas, **entonces** conservan su borde original (sólido verde / dashed verde según affiliation).
- **Dado** que el marcador naranja está activo, **cuando** deselecciono o ejecuto el siguiente gesto, **entonces** el marcador naranja desaparece y el borde vuelve a reflejar solo los axiomas OPM (esencia, afiliación).
- **Dado** que el SSOT visual establece `borde discontinuo = ambiental`, **cuando** inserto plantillas, **entonces** el marcador naranja NO debe confundirse con ambiental — el color naranja es el diferenciador clave.

**Reglas y restricciones:**
- Color distintivo (naranja) para evitar colisión semántica con dashed verde = ambiental.
- El marcador es **transitorio**, no persistente (hipótesis fuerte del doc fuente).
- Duración del marcador: **pregunta abierta** (Q33.1).
- Etiqueta `requires-clarification`.

**Modelo de datos tocado:**
- Ninguno persistente; es estilo transitorio de render (selección o marca post-inserción).

**Dependencias:**
- Bloqueada por: HU-33.006.

**Integraciones:**
- Renderer JointJS (`src/render/jointjs/`): mecanismo de estilo temporal.
- Potencialmente: mecanismo de selección múltiple.

**Notas de evidencia:**
- Fuente normativa primaria: —
- Fuente OPCloud: §3.1 paso 9, §5.3, §9, §11 Q1.
- Frames: frame_00019.
- Clase de afirmación: observado + abierto (duración).

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [plantillas, render, insert, naranja, marker-transitorio, requires-clarification, opcloud-ui].

---

### HU-33.011 — Ver previsualización miniatura de plantilla en hover

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** L (lente) primario; U (hover) secundario.
**Superficie UI:** modal-insertar-plantilla + pop-over flotante.
**Gesto canónico:** hover sostenido sobre una fila del listado.

**Historia:**
> Como modelador, quiero ver una miniatura con los OPDs de la plantilla al pasar el cursor sobre su fila para decidir si es la correcta sin abrirla.

**Contexto de negocio:**
El nombre y la descripción son insuficientes para evaluar una plantilla compleja con múltiples OPDs. La miniatura permite inspección visual rápida antes del commit, reduciendo inserciones erróneas. Es un patrón de "previsualización antes de commit" bien establecido.

**Criterios de aceptación:**
- **Dado** que estoy en el modal `Insertar plantilla` con una lista de plantillas, **cuando** hover sobre una fila sostenidamente, **entonces** aparece un pop-over flotante junto al nombre.
- **Dado** que el pop-over apareció, **cuando** inspecciono, **entonces** muestra los OPDs de la plantilla en miniatura (p.ej. 4 OPDs si la plantilla los tiene).
- **Dado** que las miniaturas aparecen, **cuando** observo, **entonces** respetan la gramática OPM (esencia, afiliación, enlaces correctos) en escala reducida.
- **Dado** que las miniaturas no tienen leyenda ni escala, **cuando** las interpreto, **entonces** son solo guía visual, no rendering auditable.
- **Dado** que muevo el cursor fuera de la fila, **cuando** termina el hover, **entonces** el pop-over desaparece.

**Reglas y restricciones:**
- Renderizado al vuelo desde `plantilla.content`.
- Escala y layout del preview puede diferir del render normal (compacto).
- Sin interacción dentro del pop-over (no clic en miniatura).

**Modelo de datos tocado:**
- Ninguno; solo lectura de `plantilla.content`.

**Dependencias:**
- Bloqueada por: HU-33.006 (modal debe existir).

**Integraciones:**
- Renderer (modo compact).
- Lente del modelo aplicada sobre contenido de plantilla.

**Notas de evidencia:**
- Fuente normativa primaria: —
- Fuente OPCloud: §2 (pop-over preview), §3.1 paso 6, §5.3.
- Frames: frame_00026.
- Clase de afirmación: observado.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [plantillas, preview, hover, miniatura, pedagógico, opcloud-ui].

---

### HU-33.012 — Buscar plantillas por nombre en el modal

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** L.
**Superficie UI:** modal-insertar-plantilla + campo `Buscar`.
**Gesto canónico:** escritura en input de búsqueda.

**Historia:**
> Como modelador, quiero filtrar las plantillas escribiendo en un campo `Buscar` del modal para encontrarlas rápido cuando hay muchas.

**Contexto de negocio:**
Las bibliotecas de plantillas crecen con el tiempo. Sin búsqueda, navegar por carpetas se vuelve impráctico pasado cierto umbral. La búsqueda textual por nombre es la afordance mínima.

**Criterios de aceptación:**
- **Dado** que el modal está abierto, **cuando** escribo texto en el campo `Buscar`, **entonces** la tabla de plantillas filtra en vivo por coincidencia en el nombre.
- **Dado** que el campo `Buscar` está vacío, **cuando** inspecciono, **entonces** la lista muestra todas las plantillas del scope/carpeta actual.
- **Dado** que borro el texto de `Buscar`, **cuando** el campo queda vacío, **entonces** la lista vuelve a mostrar todos los resultados.
- **Dado** que escribo un texto sin coincidencias, **cuando** espera el filtrado, **entonces** la tabla muestra lista vacía (similar a HU-33.015).
- **Dado** que el tab activo es `Private`, **cuando** busco, **entonces** la búsqueda se restringe a ese scope (salvo que se extienda a subcarpetas — HU-33.013).

**Reglas y restricciones:**
- Filtrado por substring case-insensitive (asumido — validar).
- Sin búsqueda en descripción por default (solo nombre).
- Scope de búsqueda: carpeta actual + scope actual; extensible a subcarpetas con checkbox (HU-33.013).

**Modelo de datos tocado:**
- Ninguno; filtrado de lectura.

**Dependencias:**
- Bloqueada por: HU-33.006 (modal debe existir).

**Integraciones:**
- Árbol de carpetas (afecta scope).

**Notas de evidencia:**
- Fuente normativa primaria: —
- Fuente OPCloud: §2 (`Search` en cabecera del modal), §5.1.
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [plantillas, search, modal, filtro, opcloud-ui].

---

### HU-33.013 — Extender búsqueda a subcarpetas con checkbox

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** L.
**Superficie UI:** modal-insertar-plantilla + checkbox `Incluir todas las subcarpetas`.
**Gesto canónico:** clic en checkbox.

**Historia:**
> Como modelador experto, quiero marcar `Incluir todas las subcarpetas` para que la búsqueda sea recursiva a través de subcarpetas sin tener que entrar manualmente en cada una.

**Contexto de negocio:**
Cuando las plantillas se organizan en jerarquías profundas, buscar dentro de una sola carpeta es insuficiente. El checkbox convierte la búsqueda en recursiva con un clic.

**Criterios de aceptación:**
- **Dado** que estoy en una carpeta con subcarpetas, **cuando** el checkbox está desmarcado y escribo en `Buscar`, **entonces** filtro solo las plantillas de la carpeta actual.
- **Dado** que marco `Incluir todas las subcarpetas`, **cuando** escribo en `Buscar`, **entonces** el filtro incluye plantillas de la carpeta actual y todas sus descendientes recursivamente.
- **Dado** que el checkbox está marcado, **cuando** los resultados aparecen, **entonces** cada fila indica (o al menos permite navegar a) su carpeta de origen.
- **Dado** que cambio de carpeta mediante breadcrumb, **cuando** el checkbox sigue marcado, **entonces** el nuevo scope aplica recursivamente desde la nueva carpeta.

**Reglas y restricciones:**
- Default: desmarcado (búsqueda solo en carpeta actual).
- Estado del checkbox es por-sesión (no persiste entre aperturas — asunción).

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-33.012.

**Integraciones:**
- Árbol de carpetas: exploración recursiva.

**Notas de evidencia:**
- Fuente normativa primaria: —
- Fuente OPCloud: §2 (`Include All Subfolders` junto a Search), §5.1.
- Frames: frame_00008.
- Clase de afirmación: observado.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [plantillas, search, recursivo, checkbox, opcloud-ui].

---

### HU-33.014 — Navegar carpetas de plantillas con breadcrumb

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** L primario; U (nav) secundario.
**Superficie UI:** modal-insertar-plantilla + modal-guardar-plantilla (breadcrumb `< Plantillas / Models Parts`).
**Gesto canónico:** clic en flecha `<` del breadcrumb, clic en segmento del breadcrumb, o doble-clic en carpeta del árbol.

**Historia:**
> Como modelador, quiero navegar carpetas de plantillas con un breadcrumb para subir a la carpeta padre o saltar a niveles superiores sin retroceso manual.

**Contexto de negocio:**
Las jerarquías de carpetas necesitan un mecanismo de navegación bidireccional (entrar y salir). El breadcrumb tradicional con flecha `<` para subir + segmentos clickables para saltar directo es el patrón estándar.

**Criterios de aceptación:**
- **Dado** que estoy en la raíz `Plantillas`, **cuando** inspecciono el breadcrumb, **entonces** muestra `Plantillas`.
- **Dado** que entro a la carpeta `Models Parts`, **cuando** inspecciono el breadcrumb, **entonces** muestra `< Plantillas / Models Parts`.
- **Dado** que el breadcrumb muestra la jerarquía, **cuando** clic en la flecha `<`, **entonces** subo a la carpeta padre.
- **Dado** que el breadcrumb tiene múltiples segmentos (p.ej. `< Plantillas / Carpeta A / Carpeta B`), **cuando** clic en `Carpeta A`, **entonces** salto directo a `Carpeta A`.
- **Dado** que estoy en la raíz, **cuando** la flecha `<` no tiene destino, **entonces** está deshabilitada o ausente.

**Reglas y restricciones:**
- Breadcrumb muestra path completo desde la raíz del scope.
- Cada segmento es clickable excepto el último (que es la ubicación actual).

**Modelo de datos tocado:**
- Ninguno; solo navegación.

**Dependencias:**
- Bloqueada por: HU-33.006 (modal).

**Integraciones:**
- Árbol de carpetas.

**Notas de evidencia:**
- Fuente normativa primaria: —
- Fuente OPCloud: §2 (`Breadcrumb`), §5.1.
- Frames: frame_00008, frame_00014.
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [plantillas, navegación, breadcrumb, folders, opcloud-ui].

---

### HU-33.015 — Ver carpeta vacía con mensaje `No Models`

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** U.
**Superficie UI:** modal-insertar-plantilla + modal-guardar-plantilla.
**Gesto canónico:** ninguno (render automático).

**Historia:**
> Como modelador, quiero ver un mensaje explícito `No Models` cuando una carpeta de plantillas está vacía para confirmar que no hay contenido sin confundir con un estado de carga.

**Contexto de negocio:**
Una carpeta vacía sin mensaje puede parecer bug o estado de carga pendiente. El mensaje explícito `No Models` confirma al usuario que el listado terminó de cargar y la carpeta efectivamente no tiene plantillas.

**Criterios de aceptación:**
- **Dado** que navego a una carpeta sin plantillas, **cuando** se completa la carga, **entonces** la tabla muestra el mensaje `No Models`.
- **Dado** que en el modal `Guardar plantilla` la raíz está vacía, **cuando** se abre, **entonces** puede mostrar `No Folders / No Models` (combinación observada).
- **Dado** que la carpeta contiene al menos una plantilla, **cuando** se carga, **entonces** el mensaje NO aparece.
- **Dado** que aplico un filtro `Buscar` sin coincidencias, **cuando** inspecciono, **entonces** el mensaje aparece análogamente (comportamiento por validar — asunción).

**Reglas y restricciones:**
- Texto literal del mensaje: `No Models` (y `No Folders` para Guardar sobre raíz vacía).
- Se muestra en el cuerpo de la tabla, no como toast ni modal.

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-33.006 (modal Insertar) y HU-33.002 (modal Guardar).

**Integraciones:**
- Lista de plantillas.

**Notas de evidencia:**
- Fuente normativa primaria: —
- Fuente OPCloud: §4.3.
- Frames: frame_00008 (Organizational con `Models Parts`), frame_00025 (Guardar raíz).
- Clase de afirmación: observado.

**Prioridad:** M1.
**Tamano:** XS.
**Etiquetas:** [plantillas, modal, vacío, mensaje, empty-state, opcloud-ui].

---

### HU-33.016 — Editar una plantilla existente en modo Plantilla

**Actor primario:** AD (autor de dominio).
**Actores secundarios:** AO, ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** P primario; U (tab prefix), V secundarios.
**Superficie UI:** main-menu → `Plantillas` → `Editar plantilla` + modal-insertar-plantilla (modo edit) + canvas con tab `<<Plantilla>>`.
**Gesto canónico:** clic en `Editar plantilla` + selección de plantilla + `Cargar`.

**Historia:**
> Como autor de dominio, quiero editar una plantilla existente para corregirla, actualizarla o extenderla sin borrarla y recrearla desde cero.

**Contexto de negocio:**
Las plantillas son capital reutilizable; su mantenimiento es tan importante como su creación. El flujo de edición debe ser familiar (misma interacción que abrir un modelo) pero visualmente diferenciado para evitar confusión con la edición de un modelo normal.

**Criterios de aceptación:**
- **Dado** que clic en `Plantillas` → `Editar plantilla`, **cuando** se abre el modal, **entonces** aparece el mismo selector de plantillas que en `Insertar plantilla` (tabs, búsqueda, árbol).
- **Dado** que selecciono una plantilla y `Cargar`, **cuando** se carga, **entonces** el canvas se abre con la plantilla como artefacto editable.
- **Dado** que estoy editando una plantilla, **cuando** inspecciono la pestaña superior, **entonces** muestra el prefijo `x <<Plantilla>> A Proc…` (con el nombre truncado — ver HU-33.017).
- **Dado** que estoy editando una plantilla, **cuando** inspecciono el OPD Navigator, **entonces** el título también muestra el prefijo `<<Plantilla>>`.
- **Dado** que edito y guardo, **cuando** persiste el cambio, **entonces** la plantilla actualizada queda disponible para futuras inserciones.
- **Dado** que actualicé una plantilla, **cuando** un modelo huésped que ya la tenía insertada se abre, **entonces** NO se actualiza (están desacoplados — ver HU-33.018).

**Reglas y restricciones:**
- La edición requiere permisos sobre el scope de la plantilla.
- El canvas se comporta como edición normal — mismas herramientas, mismos gestos.
- El prefijo `<<Plantilla>>` es un indicador visual, no altera el modelo.

**Modelo de datos tocado:**
- `plantilla.content` — snapshot actualizado — persistente.
- `plantilla.updated_at` — timestamp — persistente.

**Dependencias:**
- Bloqueada por: HU-33.002, HU-33.017.
- Bloquea a: HU-33.018 (desacople aplica post-edit también).

**Integraciones:**
- Canvas, OPD tree, OPL pane (todos en modo edición regular).
- Permisos (EPICA-40).

**Notas de evidencia:**
- Fuente normativa primaria: —
- Fuente OPCloud: §3.4.
- Frames: frame_00025 (menu), frame_00030, frame_00032.
- Transcripción: "once a template was inserted into a model you can change it but it will not be updated if the template itself was updated".
- Clase de afirmación: observado + confirmado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [plantillas, edit, desacople, prefijo-stereotype, opcloud-ui].

---

### HU-33.017 — Ver prefijo `<<Plantilla>>` en modo edición de plantilla

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** V primario; U secundario.
**Superficie UI:** canvas-tab + opd-navigator-title.
**Gesto canónico:** ninguno (render declarativo).

**Historia:**
> Como autor de dominio, quiero que la pestaña del canvas y el título del OPD Navigator muestren el prefijo `<<Plantilla>>` cuando edito una plantilla para diferenciar visualmente este modo de la edición normal de modelos.

**Contexto de negocio:**
Sin marcador visual, es fácil confundir edición de plantilla con edición de modelo y hacer cambios destructivos inadvertidos. El prefijo `<<Plantilla>>` usa la iconografía UML de estereotipos — patrón reconocible para modeladores.

**Criterios de aceptación:**
- **Dado** que abrí una plantilla para edición, **cuando** inspecciono la pestaña del canvas, **entonces** muestra `x <<Plantilla>> <nombre_plantilla>` (truncado si es largo).
- **Dado** que abrí una plantilla, **cuando** inspecciono el OPD Navigator (superior izquierda), **entonces** el título también muestra `<<Plantilla>> <nombre>`.
- **Dado** que abrí un modelo normal, **cuando** inspecciono, **entonces** el prefijo `<<Plantilla>>` NO aparece.
- **Dado** que el prefijo se muestra, **cuando** miro el canvas central, **entonces** el prefijo NO se imprime en los OPDs (solo en metadatos UI).
- **Dado** que el nombre de la plantilla es corto, **cuando** se renderiza la pestaña, **entonces** no hay truncamiento con `…`.

**Reglas y restricciones:**
- Prefijo literal: `<<Plantilla>>` (con chevrons dobles).
- Solo visible en UI chrome (tab, navigator), no en canvas.
- Convención tipográfica UML-stereotype: reutiliza iconografía conocida.

**Modelo de datos tocado:**
- Ninguno persistente; es render de artefacto-tipo.

**Dependencias:**
- Bloqueada por: HU-33.016.

**Integraciones:**
- Canvas tab (EPICA-22 tab o análoga).
- OPD Navigator.

**Notas de evidencia:**
- Fuente normativa primaria: —
- Fuente OPCloud: §2 (`Pestaña <<Template>>`), §9.
- Frames: frame_00030, frame_00032.
- Clase de afirmación: observado.

**Prioridad:** M1.
**Tamano:** XS.
**Etiquetas:** [plantillas, edit, render, tab, prefijo, stereotype-visual, opcloud-ui].

---

### HU-33.018 — Ver que plantilla y copias quedan desacopladas post-insert

**Actor primario:** ME.
**Actores secundarios:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** K (semántica) primario.
**Superficie UI:** canvas + opl-pane (sin UI dedicado — regla conceptual).
**Gesto canónico:** ninguno (consecuencia semántica de HU-33.006).

**Historia:**
> Como modelador, quiero que las copias insertadas queden desacopladas de la plantilla original para poder modificarlas libremente sin temor a propagar cambios inversos ni a que la plantilla mute por accidente.

**Contexto de negocio:**
La semántica de copia profunda + desacople es una decisión arquitectónica explícita. Tiene trade-offs: simplicidad operativa y modificabilidad libre, a cambio de perder vinculación vivo entre plantilla y copias. Es coherente con el modelo mental "plantilla = semilla, no referencia".

**Criterios de aceptación:**
- **Dado** que inserté la plantilla T en el modelo M, **cuando** modifico cualquier cosa en M derivada de T, **entonces** T original no se altera.
- **Dado** que edito y actualizo T mediante `Editar plantilla`, **cuando** abro M posteriormente, **entonces** las copias de T en M NO reflejan la actualización.
- **Dado** que inserto T dos veces en M, **cuando** modifico la primera copia, **entonces** la segunda copia NO se altera (cada una es independiente).
- **Dado** que borro T del corpus, **cuando** M se abre, **entonces** las copias insertadas siguen presentes y funcionales (no rompe referencias).
- **Dado** que un modelador espera comportamiento tipo "link vivo", **cuando** descubre el desacople, **entonces** idealmente recibe información clara en la UI (tooltip, doc) — **pregunta abierta** si esto está comunicado.

**Reglas y restricciones:**
- Desacople es **dura** y **unidireccional**: no hay forma de re-vincular una copia insertada con la plantilla.
- La arquitectura debe garantizar que no queden referencias por ID a la plantilla en las copias.
- Contraste con futura HU potencial: "link vivo" con propagación bidireccional (fuera de alcance — ver Q abierta).

**Modelo de datos tocado:**
- `cosa.id`, `link.id` en M — IDs nuevos, sin FK a `plantilla.id`.
- No hay campo `plantilla.instances_in_models` (no se rastrea).

**Dependencias:**
- Bloqueada por: HU-33.006, HU-33.016.

**Integraciones:**
- Ninguna adicional; es invariante semántica del mecanismo de inserción.

**Notas de evidencia:**
- Fuente normativa primaria: —
- Fuente OPCloud: §3.4, §9 ("Desacople tras inserción").
- Transcripción: "they are detached and no longer connected".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [plantillas, insert, desacople, semántica, invariante, opcloud-ui].

---

### HU-33.019 — Ver solo ámbitos permitidos en Guardar según rol

**Actor primario:** AO.
**Actores secundarios:** MN, AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** C (config permisos) primario; U secundario.
**Superficie UI:** modal-guardar-plantilla (tabs condicionales).
**Gesto canónico:** ninguno (render condicional).

**Historia:**
> Como admin de organización, quiero que el modal `Guardar plantilla` muestre solo los tabs de ámbito que mi rol puede usar para no intentar guardados ilegales ni confundir a modeladores regulares.

**Contexto de negocio:**
La visibilidad condicional de tabs implementa el principio de privilegio mínimo en UI: un modelador regular no ve opciones que no puede usar, evitando confusión y intentos fallidos. Es un patrón de UX basado en permisos que también actúa como información implícita sobre el rol del usuario.

**Criterios de aceptación:**
- **Dado** que soy `regular modeler`, **cuando** abro `Guardar plantilla`, **entonces** veo solo el tab `Private`.
- **Dado** que soy `organizational admin`, **cuando** abro `Guardar plantilla`, **entonces** veo los tabs `Private` y `Organizational`.
- **Dado** que soy `system admin`, **cuando** abro `Guardar plantilla`, **entonces** veo los tres tabs `Private`, `Organizational`, `Global`.
- **Dado** que mi rol cambia (me asignan admin), **cuando** vuelvo a abrir el modal, **entonces** los tabs reflejan el nuevo rol.
- **Dado** que no tengo permiso de ningún ámbito, **cuando** abro el modal, **entonces** aparece un mensaje razonable (pregunta abierta — no observado).

**Reglas y restricciones:**
- Regla de rol a ámbito:
  - regular modeler → `Private` solamente.
  - organizational admin → `Private` + `Organizational`.
  - system admin → `Private` + `Organizational` + `Global`.
- Visibilidad en `Insertar plantilla` es más amplia (lectura): todos ven `Private` propio + `Organizational` de su org + `Global`.

**Modelo de datos tocado:**
- `user.role` — lectura — no mutado aquí.

**Dependencias:**
- Bloqueada por: HU-33.002.
- Bloquea a: HU-33.004, HU-33.005.

**Integraciones:**
- Permisos (EPICA-40): consulta de rol.

**Notas de evidencia:**
- Fuente normativa primaria: —
- Fuente OPCloud: §4.1, §7.6.
- Transcripción: "if you only have a permission as a regular modeler you'll only be able to save private templates...".
- Frames: frame_00025 (solo Private visible).
- Clase de afirmación: confirmado por transcripción + inferido (combinaciones intermedias).

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [plantillas, permisos, scope, rol, guardar, condicional-ui, opcloud-ui].

---

### HU-33.020 — Marcar plantilla como favorita con estrella

**Actor primario:** ME.
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** P primario; U secundario.
**Superficie UI:** modal-insertar-plantilla (icono estrella junto al nombre) + sección `Plantillas favoritas`.
**Gesto canónico:** clic en icono estrella (mecanismo exacto — pregunta abierta).

**Historia:**
> Como modelador, quiero marcar plantillas que uso frecuentemente como favoritas para acceder rápido a ellas sin navegar por carpetas cada vez.

**Contexto de negocio:**
Las favoritas son un patrón UX estándar para atajos personales sobre listas grandes. Reduce la fricción de navegación cuando el modelador tiene un conjunto pequeño de plantillas que usa repetidamente.

**Criterios de aceptación:**
- **Dado** que navego a una carpeta con plantillas, **cuando** miro una fila, **entonces** veo un icono de estrella a la izquierda del nombre.
- **Dado** que una plantilla no es favorita, **cuando** miro la estrella, **entonces** aparece vacía/gris.
- **Dado** que una plantilla es favorita, **cuando** miro la estrella, **entonces** aparece llena/amarilla.
- **Dado** que cambio el estado de favorita, **cuando** se aplica, **entonces** la plantilla aparece en la sección `Plantillas favoritas` del encabezado.
- **Dado** que la sección `Plantillas favoritas` existe, **cuando** inspecciono, **entonces** agrupa las plantillas marcadas como favoritas del scope activo.
- **Dado** que el mecanismo exacto de toggle no fue observado en muestreo, **cuando** se implemente, **entonces** se documenta la decisión (etiqueta `requires-clarification`).

**Reglas y restricciones:**
- Estrella llena = favorita; estrella vacía = no favorita.
- Favoritas son **por-usuario**, no por-plantilla global (asunción razonable — validar).
- Funciona en los tres scopes (Private, Organizational, Global).
- Mecanismo exacto de toggle: **pregunta abierta** Q33.3.

**Modelo de datos tocado:**
- `user.favorite_templates` — lista de plantilla_ids — persistente.

**Dependencias:**
- Bloqueada por: HU-33.006.

**Integraciones:**
- Sección `Plantillas favoritas` del modal.

**Notas de evidencia:**
- Fuente normativa primaria: —
- Fuente OPCloud: §2 (estrella), §4.2, §5.3, §11 Q3.
- Frames: frame_00014, frame_00026.
- Clase de afirmación: observado (existe estrella) + abierto (mecanismo de toggle).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [plantillas, favoritas, estrella, requires-clarification, opcloud-ui].

---

### HU-33.021 — Cortar carpeta de plantillas para reorganizar

**Actor primario:** AO.
**Actores secundarios:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** P primario; U secundario.
**Superficie UI:** modal-insertar-plantilla botón `Cortar carpeta`.
**Gesto canónico:** clic en `Cortar carpeta` + navegación + pegado implícito (mecanismo exacto abierto).

**Historia:**
> Como admin de organización, quiero poder cortar una carpeta de plantillas para reorganizar la jerarquía moviéndola a otro destino sin borrar y recrear.

**Contexto de negocio:**
La organización de plantillas se reorganiza con el crecimiento del corpus. La operación `Cortar carpeta` es el mecanismo observado para mover una carpeta completa a otra ubicación dentro del mismo ámbito. El gesto exacto es inferido por el nombre — puede ser cortar-pegar tipo clipboard o mover directo.

**Criterios de aceptación:**
- **Dado** que selecciono una carpeta en el árbol, **cuando** clic en `Cortar carpeta`, **entonces** la carpeta entra en estado "cortada" (pregunta abierta: indicador visual).
- **Dado** que cortó una carpeta, **cuando** navego a otra carpeta destino dentro del mismo ámbito, **entonces** puedo pegar la carpeta cortada (gesto exacto — pregunta abierta).
- **Dado** que completé la operación, **cuando** inspecciono la jerarquía, **entonces** la carpeta cortada aparece bajo el nuevo destino y desaparece del origen.
- **Dado** que cancelé antes de pegar, **cuando** la operación queda incompleta, **entonces** la carpeta permanece en el origen sin cambios.
- **Dado** que la carpeta contiene plantillas y subcarpetas, **cuando** la corto, **entonces** todo su contenido se mueve con ella (operación atómica).

**Reglas y restricciones:**
- Mecanismo exacto: **pregunta abierta** Q33.4 — ¿cortar-pegar tipo clipboard interno o mover directo?
- Scope: solo dentro del mismo ámbito (Private o Organizational o Global); cross-scope es abierto.
- Permisos: solo admin del scope correspondiente puede reorganizar carpetas.
- Etiqueta `requires-clarification`.

**Modelo de datos tocado:**
- `folder.parent_id` — mutado — persistente.
- Estructura del árbol de carpetas — mutada.

**Dependencias:**
- Bloqueada por: HU-33.006 (modal), HU-33.019 (permisos de scope).

**Integraciones:**
- Árbol de carpetas.
- Persistencia.

**Notas de evidencia:**
- Fuente normativa primaria: —
- Fuente OPCloud: §2 (botón `Cut Folder`), §4.5, §5.1, §11 Q4.
- Clase de afirmación: observado (existe botón) + inferido (mecanismo).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [plantillas, folders, cut, mover, requires-clarification, opcloud-ui].

---

### HU-33.022 — Cancelar modal de plantilla sin efecto colateral

**Actor primario:** MN.
**Actores secundarios:** ME, AD, AO.
**Tipo:** opcloud-ui.
**Nivel categórico:** U.
**Superficie UI:** modal-insertar-plantilla + modal-guardar-plantilla botón `Cancelar`.
**Gesto canónico:** clic en botón `Cancelar` o tecla `Escape`.

**Historia:**
> Como modelador, quiero cancelar cualquier modal de plantilla sin efecto sobre mi modelo actual para abortar una inserción o guardado sin temor a cambios accidentales.

**Contexto de negocio:**
El cancel "limpio" es invariante de UX: cualquier modal debe poder cerrarse sin consecuencias. Es el escape seguro. Evita bloqueos psicológicos donde el usuario teme abrir un modal por miedo a no poder salir.

**Criterios de aceptación:**
- **Dado** que el modal `Insertar plantilla` está abierto, **cuando** clic en `Cancelar`, **entonces** el modal se cierra y el modelo queda sin cambios.
- **Dado** que el modal `Guardar plantilla` está abierto y completé nombre + descripción, **cuando** clic en `Cancelar`, **entonces** el modal se cierra sin persistir la plantilla.
- **Dado** que un modal está abierto, **cuando** presiono `Escape`, **entonces** equivale a `Cancelar` (asunción consistente con patrón general de modales).
- **Dado** que cancelo, **cuando** el modal cierra, **entonces** el foco regresa al canvas y el estado del modelo es idéntico al previo a abrir el modal.
- **Dado** que cancelo durante una carga (si hubiera latencia), **cuando** cierra el modal, **entonces** no se ejecuta el cargar aunque llegue respuesta tardía.

**Reglas y restricciones:**
- `Cancelar` y `Escape` son equivalentes.
- No hay confirmación de cancelación (no hay "¿seguro que deseas cancelar?").
- Semántica pura: cancel = abort, sin efectos colaterales.

**Modelo de datos tocado:**
- Ninguno; es invariante de que NO se toca nada.

**Dependencias:**
- Bloqueada por: HU-33.006 (modal Insertar), HU-33.002 (modal Guardar).

**Integraciones:**
- Ninguna; es comportamiento de UI local.

**Notas de evidencia:**
- Fuente normativa primaria: —
- Fuente OPCloud: §2 (`Cancel`), §4.5.
- Clase de afirmación: observado.

**Prioridad:** M1.
**Tamano:** XS.
**Etiquetas:** [plantillas, modal, cancel, escape, invariante-ux, opcloud-ui].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q33.1**: Duración del marcador naranja discontinuo post-inserción (¿deselección? ¿siguiente gesto? ¿timeout?). Afecta HU-33.010. Marcada `requires-clarification`.
- **Q33.2**: Mecanismo de desambiguación de numeración `SDx.y` cuando colisiona el árbol OPD entre plantilla y huésped (sufijo `_n` también, renumeración automática, o regla distinta). Afecta HU-33.007.
- **Q33.3**: Mecanismo exacto para marcar/desmarcar plantilla como favorita (clic en estrella, context menu, botón dedicado). Afecta HU-33.020.
- **Q33.4**: Semántica exacta de `Cortar carpeta` (clipboard interno cortar-pegar, o mover directo) y si cruza ámbitos. Afecta HU-33.021.
- **Q33.5**: Existencia de visor/editor extenso para `Descripción` (el campo visible es monolínea). Afecta HU-33.002.
- **Q33.6**: Comportamiento al insertar una plantilla cuyos OPDs hijos requerirían in-zoom sobre una cosa ya in-zoomed en el huésped. Afecta HU-33.007.
- **Q33.7**: Límite de tamaño de plantilla o número de OPDs. Abierto — sin HU dedicada (bandera de performance).
- **Q33.8** (derivada): ¿La UI comunica explícitamente el desacople post-inserción al usuario? Actualmente el desacople es semántico (HU-33.018) pero no se observa información proactiva al modelador.
- **Q33.9** (derivada): ¿Existe HU candidata para **aplicar plantilla a modelo existente como overlay/merge con resolución de conflictos rica** (más allá del `_n` silencioso)? Pedido en brief pero no observado en evidencia — **HU-33.023 candidata, deferred hasta clarificar**.
- **Q33.10** (derivada): ¿Existen **variables/placeholders** en las plantillas (p.ej. `{{nombre_cliente}}` que se reemplacen al insertar)? No observado en evidencia — **HU-33.024 candidata, deferred**.
- **Q33.11** (derivada): ¿Existe **versionado de plantillas** (historial, rollback, diff entre versiones)? No observado en evidencia — **HU-33.025 candidata, deferred**.
- **Q33.12** (derivada): ¿Hay **tags/categorías** además de la jerarquía de carpetas? No observado — **HU candidata deferred**. La categorización observada es solo jerarquía de carpetas + scope + favoritas.
- **Q33.13** (derivada): ¿Existe un concepto separado de **"plantilla de OPD"** vs **"plantilla de modelo completo"**? Evidencia: las plantillas observadas son snapshots del modelo completo con sus OPDs hijos; no se observa un modo "solo este OPD". La distinción es granular en la inserción (se inserta en el OPD activo y se anida el resto), pero la unidad de guardado parece ser siempre el modelo entero. Requiere clarificación.

## Referencias cruzadas

- Doc fuente: `opcloud-reverse/33-persistencia-templates.md`.
- Épicas relacionadas (consumidoras o integradas):
  - **EPICA-20** (OPD tree): la inserción de plantillas extiende el árbol (HU-33.007).
  - **EPICA-31** (persistencia-folders): las plantillas usan su propio espacio de carpetas paralelo.
  - **EPICA-30** (save-load): `Plantillas` es hermano en el main menu (HU-33.001).
  - **EPICA-40** (colaboración-permisos): gobernanza de ámbitos (HU-33.004, HU-33.005, HU-33.019).
  - **EPICA-50** (OPL pane): las proposiciones de las cosas insertadas aparecen en el pane (HU-33.006, HU-33.008).
  - **EPICA-82** (config-organization-ontology): plantillas organizacionales como vector de estandarización.
  - **EPICA-1C** (validaciones): regla de unicidad de nombres (`_n`) subyacente a HU-33.008.
  - **EPICA-10** (canvas-creación-cosas): biblioteca lateral y OPL pane consumen los nodos insertados (HU-10.017, HU-10.018).
- Invariantes del repo:
  - `src/nucleo/tipos.ts` (Thing, OPD — snapshot de plantilla es un subgrafo).
  - `src/persistencia/` (artefacto plantilla paralelo a modelo — separable).
  - `src/render/jointjs/` (estilo transitorio del marcador naranja, HU-33.010).
  - `src/render/opl-renderer.ts` (regeneración OPL tras merge).
- Constitución categórica: la operación de inserción es un morfismo de tipo **copia + merge en la categoría de modelos** con resolución de colisiones por rename; el desacople post-inserción garantiza que no hay morfismo vivo entre plantilla y modelo receptor (HU-33.018 lo enuncia como invariante).
- SSOT visual: el color naranja de HU-33.010 debe diferenciarse semánticamente del dashed verde de ambiental (V-xx afiliación) — validar en SSOT visual antes de implementar.
