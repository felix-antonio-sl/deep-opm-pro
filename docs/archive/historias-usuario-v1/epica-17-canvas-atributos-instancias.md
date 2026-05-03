---
epica: "EPICA-17"
titulo: "Canvas — atributos, instancias y rasgos avanzados del objeto (alias, unidad, descripción, URL, semi-fold, designaciones de estado, time duration)"
doc_fuente: "opcloud-reverse/17-canvas-atributos-instancias.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "M1"
hu_emitidas: 34
ultima_actualizacion: 2026-04-23
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
---

## Resumen

Esta épica cubre las capacidades avanzadas que OPCloud expone sobre el símbolo del objeto una vez superado el modelado básico (EPICA-10, EPICA-13). Se articula en cinco ejes complementarios:

1. **Descripción enriquecida** del objeto (popup compartido con renombrado, marca persistente con hoja 📄, tooltip hover, visibilidad toggleable).
2. **Atributos tipados** que cuelgan del padre por el triángulo de exhibición-caracterización, con sintaxis compuesta del nombre (`Nombre [Unidad] {alias}`), alias OPL, estado-valor placeholder `value` y unidades.
3. **Instancias visuales del mismo objeto** (múltiples apariencias de una sola entidad dentro de un OPD) y navegación clase ↔ features vía árbol OPD, biblioteca lateral y sufijos estructurales (`of <parent>`).
4. **Vistas de refinamiento estructural**: `Show Unfold View`, `In-Diagram In-Zoom` de objeto (delegado a EPICA-10), y **semi-fold** como tercera vista compacta que lista los rasgos dentro del propio rectángulo exhibidor.
5. **Designaciones persistentes de estado** (`Initial | Final | Current | Default`) con regla de exclusión `Current ↔ Default` y compatibilidad `Initial + Final`, más **Time Duration** parametrizada (unidad + mínimo/nominal/máximo).

La épica define **ontología local del objeto** (atributos + estados + URLs + descripción + refinamientos) y abre la puerta al consumo de esa ontología por simulación conceptual (EPICA-B0), stereotype extension (EPICA-A0) y runtime URLs (EPICA-C1).

Las HU se numeran en orden de aparición del doc fuente, sin reordenar por prioridad.

## Tabla de HU de la épica

| ID | Título | Actor | Prioridad | Tamaño | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-17.001 | Abrir popup de edición con doble-clic sobre objeto | MN | M0 | S | opcloud-ui | — |
| HU-17.002 | Expandir campo Description con checkbox desplegable | MN | M1 | S | opcloud-ui | — |
| HU-17.003 | Persistir descripción multi-línea del objeto | MN | M1 | S | opcloud-ui | — |
| HU-17.004 | Ver marca 📄 de descripción en esquina del objeto | MN | M1 | XS | opcloud-ui | — |
| HU-17.005 | Ver tooltip con descripción al hacer hover sobre 📄 | RV | M1 | XS | opcloud-ui | — |
| HU-17.006 | Ocultar descripción sin borrarla (toggle de visibilidad) | ME | S | S | opcloud-ui | — |
| HU-17.007 | Editar alias corto del objeto desde pie menu | ME | M1 | S | opm-semantica | [Glos 3.7] |
| HU-17.008 | Ver alias renderizado entre llaves en canvas | MN | M1 | XS | opcloud-ui | — |
| HU-17.009 | Ver alias verbalizado tras coma en OPL | MN | M1 | XS | opcloud-ui | — |
| HU-17.010 | Alternar visualización del alias con botón Alias de toolbar | ME | S | XS | opcloud-ui | — |
| HU-17.011 | Declarar unidad física entre corchetes en nombre de atributo | AD | M1 | S | opm-semantica | [Glos 3.4] |
| HU-17.012 | Ver sintaxis compuesta `Nombre [Unidad] {alias}` en canvas | AD | M1 | XS | opcloud-ui | — |
| HU-17.013 | Crear atributo del objeto vía exhibition-characterization | AD | M0 | M | opm-semantica | [Glos 3.4] [Glos 3.40] |
| HU-17.014 | Distinguir atributos numéricos de atributos objeto | AD | M1 | XS | opm-semantica | [Glos 3.4] |
| HU-17.015 | Declarar estado-valor placeholder `value` en atributo numérico | AD | M1 | M | opm-semantica | [Glos 3.4] [Glos 3.28] |
| HU-17.016 | Ver OPL `Attr is value <Unit>.` para atributo numérico sin valor | MN | M1 | S | opm-semantica | [Glos 3.4] |
| HU-17.017 | Asignar valor concreto al estado-valor (reemplazar `value` por numérico) | AD | S | M | opm-semantica | [Glos 3.28] [Glos 3.7] |
| HU-17.018 | Abrir modal Add URL Links desde toolbar contextual | ME | S | S | opcloud-ui | — |
| HU-17.019 | Agregar URL tipada (Picture / Video / Articles / Text / OSLC) | AD | S | S | opcloud-ui | — |
| HU-17.020 | Ver marca 🔗 en esquina del objeto cuando tiene URL | MN | S | XS | opcloud-ui | — |
| HU-17.021 | Abrir URL al hacer clic sobre 🔗 del objeto | RV | S | XS | opcloud-ui | — |
| HU-17.022 | Rotar entre múltiples URLs con clics sucesivos | RV | C | S | opcloud-ui | — |
| HU-17.023 | Eliminar fila de URL desde el modal | ME | S | XS | opcloud-ui | — |
| HU-17.024 | Activar vista Semi-fold desde toolbar contextual | ME | S | M | opcloud-ui | — |
| HU-17.025 | Ver rasgos exhibidos como filas interiores en semi-fold | ME | S | S | opcloud-ui | — |
| HU-17.026 | Extraer rasgo de semi-fold al canvas con doble-clic | ME | S | M | opcloud-ui | — |
| HU-17.027 | Ver OPL `lists A and B as features.` en semi-fold | ME | S | XS | opcloud-ui | — |
| HU-17.028 | Navegar a OPD `SDn: <Obj> unfolded` con Show Unfold View | ME | M1 | S | opcloud-ui | — |
| HU-17.029 | Mostrar múltiples apariencias del mismo objeto en un OPD | ME | S | M | opcloud-ui | — |
| HU-17.030 | Navegar de entidad a apariencias desde biblioteca con sufijo `of <parent>` | ME | S | S | opcloud-ui | — |
| HU-17.031 | Designar estado como Initial / Final con botonera contextual | IS | M1 | S | opm-semantica | [Glos 3.28] |
| HU-17.032 | Designar estado como Current / Default (excluyentes) | IS | M1 | S | opm-semantica | [Glos 3.28] |
| HU-17.033 | Permitir Initial + Final simultáneos en un mismo estado | IS | M1 | XS | opm-semantica | [Glos 3.28] |
| HU-17.034 | Configurar Time Duration del estado con unidad + min/nominal/max | IS | S | M | opm-semantica | [Glos 3.28] |

Total: **34 historias de usuario** (11 opm-semantica, 23 opcloud-ui).

## Historias de usuario

### HU-17.001 — Abrir popup de edición con doble-clic sobre objeto

**Actor primario:** MN (modelador novato).
**Actores secundarios:** ME (experto — también lo usa en flujo rápido).
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; K (propaga a `cosa.nombre` al confirmar) secundario.
**Superficie UI:** canvas-opd + popup-auto-format.
**Gesto canónico:** doble-clic sobre el rectángulo del objeto.

**Historia:**
> Como modelador, quiero abrir el popup de edición haciendo doble-clic sobre el objeto para renombrarlo o editar su descripción sin viajar a la toolbar.

**Contexto de negocio:**
El popup de edición es **el mismo** que el popup post-creación (EPICA-10 HU-10.003). Exponerlo vía doble-clic elimina la necesidad de recordar dónde está el botón de edit en la toolbar y responde al principio "gesto directo sobre el objeto que quiero modificar". El narrador confirma: "double-click abre el popup listo para editar".

**Criterios de aceptación:**
- **Dado** que hay un objeto `O` en el canvas, **cuando** hago doble-clic sobre su rectángulo, **entonces** se abre el popup `Auto Format / Description` con el nombre preseleccionado listo para sobreescribir.
- **Dado** que el objeto tiene descripción previa, **cuando** el popup se abre, **entonces** el checkbox `Description ˅` aparece marcado con el texto previo disponible para editar (o al menos accesible al expandir).
- **Dado** que el popup está abierto, **cuando** confirmo con Enter o `Update`, **entonces** los cambios persisten y el popup se cierra.
- **Dado** que hago doble-clic sobre una **zona no-objeto** (canvas vacío, handle de resize), **entonces** NO se abre el popup (el gesto está restringido al rectángulo del objeto).

**Reglas y restricciones:**
- El popup es el mismo componente usado en creación inicial — reutilización.
- El doble-clic es el gesto universal observado, consistente con el popup post-creación.
- No hay confirmación diferida (no hay draft).

**Modelo de datos tocado:**
- `cosa.nombre` — string — persistente (al confirmar).
- `cosa.descripcion` — string nullable — persistente (al confirmar).

**Dependencias:**
- Bloqueada por: HU-10.001 / HU-10.002 (objeto debe existir).
- Relacionada: HU-10.003 (popup post-creación), HU-17.002 (expansión Description).

**Integraciones:**
- Panel OPL-ES: actualiza al confirmar si cambió el nombre.
- Biblioteca lateral: actualiza nombre.

**Notas de evidencia:**
- Fuente: `opcloud-reverse/17-canvas-atributos-instancias.md` §1.1, §3.1, §8.
- Frames: frame_00003, frame_00009.
- Transcripción: "double-click abre el popup listo para editar".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** M0.
**Tamaño:** S.
**Etiquetas:** [canvas, ui, popup-inline, rename, double-click].

---

### HU-17.002 — Expandir campo Description con checkbox desplegable

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** U.
**Superficie UI:** popup-auto-format (checkbox `Description ˅`).
**Gesto canónico:** clic en checkbox.

**Historia:**
> Como modelador, quiero expandir el campo Description marcando el checkbox `Description ˅` en el popup para escribir un texto largo sobre el objeto sin que siempre ocupe espacio.

**Contexto de negocio:**
El popup mantiene una huella mínima cuando solo se edita el nombre, pero ofrece un textarea extenso bajo demanda. El checkbox `Description ˅` con glifo de flecha comunica la naturaleza expansible del campo. Cumple el principio "progressive disclosure".

**Criterios de aceptación:**
- **Dado** que el popup está abierto y `Description ˅` está desmarcado, **cuando** marco el checkbox, **entonces** aparece un textarea multi-línea etiquetado `Description` debajo del campo de nombre.
- **Dado** que el textarea está visible, **cuando** desmarco el checkbox, **entonces** el textarea se oculta pero su contenido **no** se borra.
- **Dado** que el objeto tiene descripción preexistente, **cuando** se abre el popup, **entonces** el checkbox se presenta marcado por defecto **o** el texto previo es recuperable al marcarlo (según observación del frame 9).
- **Dado** que el textarea está vacío y el checkbox desmarcado, **cuando** confirmo el popup, **entonces** `cosa.descripcion` queda `null` o `""`.

**Reglas y restricciones:**
- Default al abrir un popup sin descripción previa: checkbox desmarcado.
- El textarea admite texto libre, URLs crudas, saltos de línea.
- El estado del checkbox no persiste per se; el dato persistente es `cosa.descripcion`.

**Modelo de datos tocado:**
- `cosa.descripcion` — string nullable — persistente.

**Dependencias:**
- Bloqueada por: HU-17.001.
- Relacionada: HU-17.003 (persistencia), HU-17.006 (ocultar sin borrar).

**Integraciones:**
- Ninguna directa con otros subsistemas hasta confirmar (el textarea es solo UI).

**Notas de evidencia:**
- Fuente: §1.1, §3.1, §5.1.
- Frames: frame_00009.
- Transcripción: "checkbox Description ˅ expande un textarea adicional".
- Clase de afirmación: confirmado por transcripción + observado en frame.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [canvas, ui, popup-inline, description, progressive-disclosure].

---

### HU-17.003 — Persistir descripción multi-línea del objeto

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** K primario (nuevo campo `cosa.descripcion`); V (marca visual) secundaria.
**Superficie UI:** popup-auto-format + canvas-render.
**Gesto canónico:** ninguno (persistencia al confirmar).

**Historia:**
> Como modelador, quiero que la descripción que escribo en el popup se guarde con el objeto para documentar su semántica y recuperarla más tarde.

**Contexto de negocio:**
`cosa.descripcion` es el primer campo textual largo del núcleo. Se convierte en un hook para otros sistemas: tooltip hover, export PDF, análisis de informatividad (EPICA-D1). El valor debe persistir fiel — sin truncamiento, sin normalización silenciosa.

**Criterios de aceptación:**
- **Dado** que escribo un texto multi-línea en el campo Description, **cuando** confirmo con `Update` o Enter, **entonces** el texto completo se persiste en `cosa.descripcion`.
- **Dado** que la descripción contiene saltos de línea, caracteres unicode y URLs crudas, **cuando** cierro y reabro el modelo, **entonces** el texto se recupera idéntico.
- **Dado** que vuelvo a abrir el popup del mismo objeto, **cuando** expando `Description ˅`, **entonces** veo el texto previamente guardado.
- **Dado** que vacío el textarea y confirmo, **cuando** consulto el modelo, **entonces** `cosa.descripcion` queda `null` o `""` (tratamiento equivalente por consumidores).

**Reglas y restricciones:**
- No hay límite de longitud observado (el narrador no lo menciona; dejar abierto en V0).
- Soporte de markdown: **pregunta abierta** (§11 doc fuente).
- URLs dentro de la descripción: se persisten como texto plano; el icono 🔗 cubre URLs tipadas (ver HU-17.018+).

**Modelo de datos tocado:**
- `cosa.descripcion` — string nullable — persistente.

**Dependencias:**
- Bloqueada por: HU-17.002.
- Bloquea a: HU-17.004 (marca 📄 depende de que exista el campo), HU-17.005 (tooltip).

**Integraciones:**
- Renderer: emite marca 📄 si hay descripción (HU-17.004).
- Export PDF (EPICA-60): incluye descripción.
- Análisis de informatividad (EPICA-D1): potencialmente usa descripciones como señal.

**Notas de evidencia:**
- Fuente: §1.1, §3.1, §6.
- Transcripción: "persiste el texto ingresado".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [canvas, kernel, description, persistencia].

---

### HU-17.004 — Ver marca 📄 de descripción en esquina del objeto

**Actor primario:** MN.
**Actores secundarios:** RV (lector también depende de esta señal).
**Tipo:** opcloud-ui.
**Nivel categórico:** V.
**Superficie UI:** canvas-render (esquina superior-derecha del rectángulo).
**Gesto canónico:** ninguno (render automático).

**Historia:**
> Como modelador o lector, quiero ver un icono de hoja (📄) en la esquina del objeto cuando tiene descripción para saber de un vistazo que hay documentación adjunta.

**Contexto de negocio:**
La marca de descripción es **persistente, no invasiva**. El narrador enfatiza que la hoja **no es una afordance de edición** — es una marca informativa. Al moverse por un modelo grande, el lector escanea rápidamente qué objetos están documentados sin abrir popups.

**Criterios de aceptación:**
- **Dado** que un objeto tiene `cosa.descripcion` no-vacía, **cuando** se renderiza el canvas, **entonces** aparece un icono 📄 en la esquina superior-derecha del rectángulo.
- **Dado** que el objeto no tiene descripción, **cuando** se renderiza, **entonces** el icono 📄 NO aparece.
- **Dado** que agrego descripción vía popup, **cuando** confirmo, **entonces** la marca 📄 aparece sin recargar.
- **Dado** que borro la descripción (vaciar + confirmar), **cuando** se re-renderiza, **entonces** la marca 📄 desaparece.
- **Dado** que la descripción está oculta (`descripcion_visible=false`), **cuando** se renderiza, **entonces** la marca 📄 **pregunta abierta**: ¿sigue apareciendo o se oculta junto con la descripción? (ver HU-17.006).

**Reglas y restricciones:**
- Posición canónica: esquina superior-derecha del rectángulo.
- La marca coexiste sin solaparse con la marca 🔗 (esquina superior-izquierda, ver HU-17.020).
- El icono es de solo-presencia (no clickable).

**Dependencias:**
- Bloqueada por: HU-17.003.
- Bloquea a: HU-17.005 (tooltip depende de que exista marca).

**Integraciones:**
- Renderer JointJS (`src/render/jointjs/`): factory agrega el icono por composición.

**Notas de evidencia:**
- Fuente: §1.1, §3.1 paso 5, §9.
- Frames: frame_00009 y frames subsiguientes (marca persistente).
- Transcripción: "aparece un pequeño icono de hoja (📄) en la esquina del objeto".
- Clase de afirmación: confirmado por transcripción + observado.

**Prioridad:** M1.
**Tamaño:** XS.
**Etiquetas:** [canvas, render, description, marca-persistente, esquina].

---

### HU-17.005 — Ver tooltip con descripción al hacer hover sobre 📄

**Actor primario:** RV (revisor / lector).
**Actores secundarios:** MN, ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** U.
**Superficie UI:** canvas + tooltip.
**Gesto canónico:** hover sobre icono 📄.

**Historia:**
> Como lector del modelo, quiero ver la descripción completa al pasar el mouse sobre el icono 📄 para leer la documentación sin abrir popup.

**Contexto de negocio:**
El tooltip hover es la vía **no-intrusiva** de consumo de descripción. El lector no pierde el contexto del canvas; la descripción se muestra en capa flotante y desaparece al mover el cursor. Consistente con affordance universal "hover para info".

**Criterios de aceptación:**
- **Dado** que un objeto tiene marca 📄, **cuando** hago hover sobre el icono, **entonces** aparece un tooltip con el texto completo de `cosa.descripcion`.
- **Dado** que muevo el cursor fuera del icono, **cuando** se sale, **entonces** el tooltip desaparece tras un debounce corto (<500ms).
- **Dado** que la descripción es muy larga, **cuando** se muestra el tooltip, **entonces** el contenido se ajusta sin truncar (wrap) hasta un ancho razonable.
- **Dado** que la descripción está oculta (`descripcion_visible=false`), **cuando** hago hover, **entonces** **pregunta abierta**: el tooltip no aparece o muestra indicador de "oculta" (ver HU-17.006).

**Reglas y restricciones:**
- El tooltip es render puro; no permite editar.
- Posicionamiento: cerca del icono, sin tapar el objeto completo.
- Delay de aparición: estándar (400–600ms).

**Dependencias:**
- Bloqueada por: HU-17.004.

**Integraciones:**
- Sistema de tooltips del canvas (si existe framework compartido) o widget JointJS específico.

**Notas de evidencia:**
- Fuente: §1.1, §3.1 paso 6, §8.
- Transcripción: "hover shows the tooltip with the text".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** M1.
**Tamaño:** XS.
**Etiquetas:** [canvas, ui, tooltip, description, hover].

---

### HU-17.006 — Ocultar descripción sin borrarla (toggle de visibilidad)

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; K (nuevo flag `descripcion_visible`) secundario.
**Superficie UI:** **pregunta abierta** — probablemente popup-auto-format o settings del objeto.
**Gesto canónico:** clic en toggle (ubicación por clarificar).

**Historia:**
> Como modelador experto, quiero ocultar la descripción de un objeto sin borrarla para limpiar visualmente el canvas en revisiones sin perder la documentación escrita.

**Contexto de negocio:**
El narrador menciona explícitamente la opción "do not show the description field" como toggle **no destructivo**. Permite mantener la documentación en el modelo (exportable, auditable) pero reducir el ruido visual del icono 📄 cuando se presenta ante una audiencia. Es una separación entre "dato" y "presencia visual del dato".

**Criterios de aceptación:**
- **Dado** que un objeto tiene descripción, **cuando** activo el toggle `do not show the description field`, **entonces** el icono 📄 desaparece del canvas pero `cosa.descripcion` permanece intacto.
- **Dado** que el toggle está activo, **cuando** desactivo el toggle, **entonces** el icono 📄 reaparece y el tooltip vuelve a mostrar la descripción.
- **Dado** que el toggle está activo, **cuando** abro el popup de edición, **entonces** puedo seguir leyendo y editando la descripción (la ocultación es solo de la marca visual, no del editor).
- **Dado** que cierro y recargo el modelo, **cuando** el toggle estaba activo, **entonces** el estado del toggle persiste.

**Reglas y restricciones:**
- Default al crear descripción: `descripcion_visible = true`.
- El toggle es por-objeto (no global de modelo).
- Ubicación del control: **pregunta abierta Q17.2** (popup, settings del objeto, o engranaje global).

**Modelo de datos tocado:**
- `cosa.descripcion_visible` — boolean — persistente (default `true`).

**Dependencias:**
- Bloqueada por: HU-17.003.
- Afecta a: HU-17.004, HU-17.005.

**Integraciones:**
- Renderer condiciona marca 📄 a `descripcion_visible`.

**Notas de evidencia:**
- Fuente: §1.1, §4.3.
- Transcripción: "no show the description field — oculta pero no borra".
- Clase de afirmación: confirmado por transcripción sobre comportamiento; ubicación de control abierta.
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [canvas, ui, description, visibility, toggle, requires-clarification].

---

### HU-17.007 — Editar alias corto del objeto desde pie menu

**Actor primario:** ME.
**Actores secundarios:** AD (autor de dominio — usa aliases sistemáticamente).
**Tipo:** opm-semantica.
**Nivel categórico:** K (nuevo campo `cosa.alias`); V (render en canvas); L (OPL) secundarios.
**Superficie UI:** halo (pie menu) + popup de edición de alias.
**Gesto canónico:** clic en acción `edit-alias` del pie menu.

**Historia:**
> Como modelador, quiero asignar un alias corto (p.ej. `tes`, `dgs`, `tgt`) a un objeto desde el pie menu para referenciarlo de forma compacta en el canvas y en el OPL.

**Contexto de negocio:**
El alias es la **etiqueta breve** del objeto — útil cuando el nombre completo es largo (`Turbojet Engine System`) o cuando la densidad del diagrama exige compresión. OPCloud renderiza el alias entre llaves en canvas (`{tes}`) y tras coma en OPL (`, tes,`). Es **identificador secundario**, no sustituto del nombre.

**Criterios de aceptación:**
- **Dado** que tengo un objeto seleccionado, **cuando** abro el pie menu y hago clic en `edit-alias`, **entonces** se abre un popup/campo de edición para el alias.
- **Dado** que el popup de alias está abierto, **cuando** escribo `tes` y confirmo, **entonces** `cosa.alias = "tes"` se persiste.
- **Dado** que el objeto tiene alias asignado, **cuando** abro de nuevo el pie menu, **entonces** `edit-alias` muestra el alias actual para editar.
- **Dado** que borro el alias (string vacío) y confirmo, **cuando** consulto el modelo, **entonces** `cosa.alias` queda `null` o `""` sin error.
- **Dado** que hay dos objetos con el mismo alias, **cuando** confirmo el segundo, **entonces** **pregunta abierta**: ¿valida unicidad? (delegada a EPICA-1C).

**Reglas y restricciones:**
- Alias admite solo texto corto (convencionalmente 2–6 caracteres minúscula, aunque el narrador no fuerza regla).
- El alias es opcional — no todos los objetos lo tienen.
- Acceso principal vía pie menu (HU-10.020 action `edit-alias`); ruta alternativa desde toolbar contextual (HU-17.010) es solo de **visualización**, no de edición.

**Modelo de datos tocado:**
- `cosa.alias` — string nullable — persistente.

**Dependencias:**
- Bloqueada por: HU-10.019, HU-10.020 (pie menu disponible).
- Bloquea a: HU-17.008, HU-17.009.

**Integraciones:**
- Renderer: muestra `{alias}` junto al nombre.
- Panel OPL-ES: inserta `, alias,` tras el nombre.
- Biblioteca lateral: puede mostrar nombre + alias.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [Glos 3.7] Clase — el alias es identificador secundario de clase.
- Fuente: §5.3, §5.7.
- Frames: frame_00003 (muestra alias `{tes}`, `{eg}`), frame_00020 (múltiples aliases), frame_00030 (atributos con alias).
- Clase de afirmación: observado + pie-menu confirmado en EPICA-10.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [canvas, kernel, alias, pie-menu, edit-alias].

---

### HU-17.008 — Ver alias renderizado entre llaves en canvas

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** V.
**Superficie UI:** canvas-render (texto del rectángulo).
**Gesto canónico:** ninguno.

**Historia:**
> Como modelador, quiero ver el alias del objeto entre llaves debajo o junto al nombre para identificarlo rápido cuando el diagrama está denso.

**Contexto de negocio:**
El alias entre llaves es una convención visual consistente con literatura OPM y con OPCloud. Entregan compresión visual sin destruir identidad semántica. El lector identifica rápido la entidad por alias (3–5 caracteres) cuando mover el ojo al nombre completo es costoso.

**Criterios de aceptación:**
- **Dado** que un objeto tiene `cosa.alias="tes"`, **cuando** se renderiza en canvas, **entonces** aparece el texto `{tes}` junto al nombre (posición canónica: debajo o al lado).
- **Dado** que `cosa.alias` es `null` o vacío, **cuando** se renderiza, **entonces** NO aparecen llaves en el texto del objeto.
- **Dado** que edito el alias, **cuando** confirmo, **entonces** el texto del canvas se actualiza en vivo.
- **Dado** que el objeto está en semi-fold, unfolded o in-zoom, **cuando** se renderiza, **entonces** el alias se muestra consistentemente en todas las vistas.

**Reglas y restricciones:**
- Delimitadores: `{` y `}` exactos (no paréntesis, no corchetes).
- Posición: convención observada (debajo del nombre en rectángulos normales, en línea tras el nombre en atributos compactos).
- La visualización puede ser toggleada (ver HU-17.010).

**Dependencias:**
- Bloqueada por: HU-17.007.

**Integraciones:**
- Renderer JointJS: factory del label compone `nombre\n{alias}`.

**Notas de evidencia:**
- Fuente: §5.7, §9.
- Frames: frame_00003 (`{tes}`, `{eg}`), frame_00020 (múltiples aliases en unfolded).
- Clase de afirmación: observado.

**Prioridad:** M1.
**Tamaño:** XS.
**Etiquetas:** [canvas, render, alias, llaves].

---

### HU-17.009 — Ver alias verbalizado tras coma en OPL

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** L (lente OPL-ES).
**Superficie UI:** panel-opl-es.
**Gesto canónico:** ninguno.

**Historia:**
> Como modelador, quiero que el alias del objeto aparezca tras coma en las oraciones OPL para que el lenguaje natural incluya la etiqueta corta.

**Contexto de negocio:**
OPL con alias genera oraciones con aposición: `Turbojet Engine System, tes, is physical and systemic.`. El alias aparece como información secundaria entre comas, emulando el uso humano de aclaraciones entre comas. Refuerza la comprensión del modelador y del lector no-técnico.

**Criterios de aceptación:**
- **Dado** que un objeto tiene `cosa.alias="tes"` y nombre `Turbojet Engine System`, **cuando** consulto el panel OPL-ES, **entonces** la oración base es `Turbojet Engine System, tes, is <essence> and <affiliation>.`.
- **Dado** que el objeto participa en otras líneas OPL (p.ej. `consists of`, `exhibits`), **cuando** miro esas líneas, **entonces** el alias aparece donde corresponda (pregunta abierta: ¿siempre o solo en la declarativa principal?).
- **Dado** que el alias es `null`, **cuando** miro OPL, **entonces** la oración omite las comas del alias (`Turbojet Engine System is physical and systemic.`).
- **Dado** que edito el alias, **cuando** confirmo, **entonces** todas las oraciones OPL que lo usan se actualizan en vivo.

**Reglas y restricciones:**
- Formato: `<Nombre>, <alias>, <resto-de-oración>.`
- El alias se separa por **coma + espacio** (no paréntesis).
- Convención consistente en todas las plantillas OPL del objeto.

**Dependencias:**
- Bloqueada por: HU-17.007.

**Integraciones:**
- Motor OPL (`src/render/opl-renderer.ts`).

**Notas de evidencia:**
- Fuente: §5.7, §7.3.
- Frames: múltiples (panel OPL-ES visible en casi todos los frames de esta feature).
- Clase de afirmación: observado.

**Prioridad:** M1.
**Tamaño:** XS.
**Etiquetas:** [opl, alias, verbalización, aposición].

---

### HU-17.010 — Alternar visualización del alias con botón Alias de toolbar

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; V (oculta/muestra `{alias}`) secundaria.
**Superficie UI:** toolbar-contextual (botón `↑Alias`).
**Gesto canónico:** clic en botón.

**Historia:**
> Como modelador experto, quiero ocultar/mostrar el alias visible en canvas con un botón dedicado de la toolbar para limpiar la presentación cuando mi audiencia no necesita verlo.

**Contexto de negocio:**
Análogo al toggle de descripción (HU-17.006) pero sobre la presencia visual del alias en canvas. El alias sigue en el modelo (y en OPL); solo desaparece del label del canvas. Útil para presentaciones donde la compresión visual es prioritaria o donde el alias distrae.

**Criterios de aceptación:**
- **Dado** que tengo un objeto con alias `{tes}` renderizado, **cuando** hago clic en el botón `↑Alias` de la toolbar contextual, **entonces** el alias desaparece del label del canvas.
- **Dado** que el alias está oculto en canvas, **cuando** hago clic de nuevo en `↑Alias`, **entonces** el alias reaparece.
- **Dado** que el toggle está activo, **cuando** consulto el panel OPL-ES, **entonces** el alias sigue apareciendo en OPL (el toggle afecta solo canvas).
- **Dado** que cierro y recargo, **cuando** el toggle estaba activo, **entonces** el estado persiste (scope por-objeto o por-modelo, **pregunta abierta**).

**Reglas y restricciones:**
- El toggle es de **presentación**, no de datos: `cosa.alias` no cambia.
- Scope exacto del toggle (per-objeto / per-OPD / per-modelo): **pregunta abierta Q17.3**.
- Icono canónico `↑Alias` (texto + flecha) observado en toolbar contextual.

**Modelo de datos tocado:**
- `cosa.mostrar_alias` — boolean — persistente. **Pregunta abierta** sobre granularidad.

**Dependencias:**
- Bloqueada por: HU-17.008.

**Integraciones:**
- Renderer.
- Persistencia.

**Notas de evidencia:**
- Fuente: §5.2 (ítem 14 de toolbar).
- Clase de afirmación: observado (presencia del botón); semántica exacta abierta.
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [canvas, ui, toolbar-contextual, alias, toggle, requires-clarification].

---

### HU-17.011 — Declarar unidad física entre corchetes en nombre de atributo

**Actor primario:** AD (autor de dominio).
**Actores secundarios:** IS (ingeniero de simulación — consumirá la unidad).
**Tipo:** opm-semantica.
**Nivel categórico:** K (nuevo campo `cosa.unidad`); V (render); L (OPL) secundarios.
**Superficie UI:** popup-auto-format (nombre) o pie-menu (edit-alias si unit se edita junto).
**Gesto canónico:** escritura en campo de nombre del popup.

**Historia:**
> Como autor de dominio, quiero declarar la unidad física de un atributo numérico (p.ej. `Temperature [F]`, `Pressure [kPa]`) para que la unidad aparezca junto al nombre en canvas y en OPL.

**Contexto de negocio:**
Modelos de ingeniería requieren unidades explícitas. OPCloud adopta la convención `Nombre [Unidad]` — corchetes rectos rodean la unidad, separados del nombre por un espacio. La unidad se **declara en el nombre** del objeto; no hay campo separado observado en UI, pero el sistema debe parsearla (o mantenerla como campo separado internamente) para renderizar el OPL `is value <Unidad>`.

**Criterios de aceptación:**
- **Dado** que creo o edito un atributo y escribo `Temperature [F]`, **cuando** confirmo, **entonces** el objeto se persiste con `nombre="Temperature"` y `unidad="F"` (o con string compuesto — ver pregunta abierta Q17.1).
- **Dado** que el atributo tiene unidad declarada, **cuando** se renderiza, **entonces** aparece `Nombre [Unidad]` en el label.
- **Dado** que el atributo tiene unidad y además alias, **cuando** se renderiza, **entonces** aparece `Nombre [Unidad] {alias}` (orden fijo: nombre → corchetes → llaves).
- **Dado** que quiero un atributo **sin** unidad (p.ej. `Air Gas`), **cuando** escribo solo el nombre, **entonces** no aparecen corchetes.

**Reglas y restricciones:**
- Orden canónico del name compuesto: `Nombre [Unidad] {alias}` — sin variantes.
- Delimitadores: corchetes rectos `[ ]` para unidad, llaves `{ }` para alias.
- Validación de unidades (p.ej. tabla cerrada SI): **pregunta abierta Q17.4**.
- El campo `unidad` es opcional y puede ser null.

**Modelo de datos tocado:**
- `cosa.nombre` — string — persistente.
- `cosa.unidad` — string nullable — persistente.
- Decisión de diseño: parsing al guardar vs persistir string compuesto. **Pregunta abierta Q17.1**.

**Dependencias:**
- Bloqueada por: HU-17.001 (popup de edición disponible).
- Bloquea a: HU-17.012, HU-17.015, HU-17.016.

**Integraciones:**
- Renderer: compone label.
- OPL: usa `cosa.unidad` en plantillas `is value <Unidad>`.
- Simulación (EPICA-B0): consume unidad para validar rangos.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [Glos 3.4] Atributo — la unidad es componente semántico del atributo.
- Fuente: §5.7, §9.
- Frames: frame_00020 (`Temperature [F]`, `Pressure [kPa]`), frame_00030.
- Clase de afirmación: observado.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [canvas, kernel, unidad, atributos, nombre-compuesto].

---

### HU-17.012 — Ver sintaxis compuesta `Nombre [Unidad] {alias}` en canvas

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** V.
**Superficie UI:** canvas-render.
**Gesto canónico:** ninguno.

**Historia:**
> Como autor de dominio, quiero ver el nombre, la unidad y el alias del atributo renderizados con la sintaxis `Nombre [Unidad] {alias}` para comunicar el tipo y la compresión de referencia de un vistazo.

**Contexto de negocio:**
La sintaxis compuesta es **la firma visual del atributo tipado**. El lector experto reconoce inmediatamente que `Temperature [F] {tgt}` es una variable numérica en Fahrenheit referenciada como `tgt`. Es una convención de literatura OPM y de OPCloud.

**Criterios de aceptación:**
- **Dado** que un atributo tiene `nombre="Temperature"`, `unidad="F"`, `alias="tgt"`, **cuando** se renderiza, **entonces** el label es `Temperature [F] {tgt}`.
- **Dado** que un atributo tiene solo unidad (sin alias), **cuando** se renderiza, **entonces** el label es `cp_cold [F]`.
- **Dado** que un atributo tiene solo alias (sin unidad), **cuando** se renderiza, **entonces** el label es `Turbojet Engine System {tes}`.
- **Dado** que un atributo tiene solo nombre, **cuando** se renderiza, **entonces** el label es `Thrust`.
- **Dado** que el orden se altera, **cuando** se intenta renderizar, **entonces** el renderer fuerza el orden canónico: nombre → corchetes → llaves.

**Reglas y restricciones:**
- Orden estricto; no se admiten variantes.
- El nombre puede incluir espacios y mayúsculas; la unidad no (convención).
- Si unit está vacía y el usuario escribió `[ ]` en el nombre: **pregunta abierta** sobre el parsing.

**Dependencias:**
- Bloqueada por: HU-17.011 (unit), HU-17.007 (alias).

**Integraciones:**
- Renderer JointJS: factory compone label.

**Notas de evidencia:**
- Fuente: §5.7, §9.
- Frames: frame_00020, frame_00030.
- Clase de afirmación: observado.

**Prioridad:** M1.
**Tamaño:** XS.
**Etiquetas:** [canvas, render, atributos, nombre-compuesto, sintaxis].

---

### HU-17.013 — Crear atributo del objeto vía exhibition-characterization

**Actor primario:** AD.
**Actores secundarios:** ME.
**Tipo:** opm-semantica.
**Nivel categórico:** K primario; V (render triángulo), L (OPL) secundarios.
**Superficie UI:** canvas-opd + enlace-table.
**Gesto canónico:** drag de enlace tipo `Exhibition-Characterization` entre dos objetos O_padre y O_attr.

**Historia:**
> Como autor de dominio, quiero adjuntar un atributo a un objeto usando el enlace de exhibition-characterization para construir la ontología local del objeto (sus rasgos propios).

**Contexto de negocio:**
El triángulo de **exhibition-characterization** es el enlace estructural OPM que declara: "O_padre **exhibe** el rasgo O_attr que lo **caracteriza**". Este es el mecanismo **único** para crear atributos; no hay "attribute panel" separado. La ontología local del objeto emerge de la topología de enlaces, no de un editor de propiedades.

**Criterios de aceptación:**
- **Dado** que tengo dos objetos `O_padre` y `O_attr` en el canvas, **cuando** hago drag de O_padre a O_attr e invoco la enlace table, **entonces** `Exhibition-Characterization` aparece como opción válida (para combinación Objeto→Objeto).
- **Dado** que elijo `Exhibition-Characterization`, **cuando** confirmo, **entonces** se crea un enlace con triángulo relleno, O_padre como exhibidor y O_attr como rasgo.
- **Dado** que el enlace se creó, **cuando** consulto OPL, **entonces** aparece `<O_padre> exhibits <O_attr>.` (o plural `exhibits A and B.` si hay múltiples).
- **Dado** que tengo N atributos exhibidos y N ≤ M_visible, **cuando** consulto OPL, **entonces** ve `exhibits A, B, C` sin `and more`. Si N > M_visible, aparece `and <n> more operations` (ver §9 doc fuente y HU-17.025 para semi-fold).
- **Dado** que elimino el enlace de exhibición, **cuando** confirmo el delete, **entonces** O_attr deja de ser atributo de O_padre (sigue existiendo como objeto independiente si ninguna otra relación lo ata).

**Reglas y restricciones:**
- El enlace `Exhibition-Characterization` es el único mecanismo de atributo (invariante semántico OPM).
- Direccionalidad: `source=exhibidor`, `target=rasgo`.
- Un mismo rasgo puede ser atributo de varios padres (aporta al sufijo biblioteca `of A and B`).

**Modelo de datos tocado:**
- `enlace.tipo` — `"exhibition-characterization"` — persistente.
- `enlace.origen` — ID del exhibidor — persistente.
- `enlace.destino` — ID del rasgo — persistente.

**Dependencias:**
- Bloqueada por: HU-10.007, HU-10.008, HU-10.011 (creación de enlace genérico).
- Bloquea a: HU-17.014, HU-17.025 (semi-fold depende de enlaces de exhibición).

**Integraciones:**
- Enlace table: `Exhibition-Characterization` en picker.
- OPL: plantillas `exhibits`, `and n more operations`.
- Árbol OPD: el rasgo aparece en `SDn: <Padre> unfolded`.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [Glos 3.4] Atributo — rasgo que caracteriza a una cosa; [Glos 3.40] Clase de objeto — patrón para objetos con misma estructura.
- Fuente: §3.6, §9 (dígito suelto `2` como "operations more").
- Frames: frame_00003 (triángulo con `2`), frame_00020 (bus de exhibiciones).
- Clase de afirmación: observado + estándar OPM.

**Prioridad:** M0.
**Tamaño:** M.
**Etiquetas:** [canvas, kernel, atributos, exhibition, characterization, enlaces].

---

### HU-17.014 — Distinguir atributos numéricos de atributos objeto

**Actor primario:** AD.
**Tipo:** opm-semantica.
**Nivel categórico:** V primario; K (clasificación implícita por presencia de unidad) secundaria.
**Superficie UI:** canvas-render.
**Gesto canónico:** ninguno (render declarativo).

**Historia:**
> Como autor de dominio, quiero que los atributos numéricos (con unidad) se distingan visualmente de los atributos objeto (composicionales) para identificar rápidamente variables medibles vs agregaciones.

**Contexto de negocio:**
Un atributo con `unidad != null` es **numérico** (candidato a estado-valor, simulación, validación de rango). Un atributo sin unidad es **objeto** (agregación de información compleja). Ambos son Objects en el núcleo, pero su **rol semántico** difiere. La SSOT visual puede decidir señalar la diferencia (borde verde claro saturado observado en frame 20 correlaciona con atributos numéricos).

**Criterios de aceptación:**
- **Dado** que un atributo tiene `unidad != null`, **cuando** se renderiza, **entonces** se marca visualmente como numérico (convención observada: borde verde claro saturado o estado-valor `value` interior).
- **Dado** que un atributo no tiene unidad, **cuando** se renderiza, **entonces** usa el estilo de objeto estándar.
- **Dado** que cambio `cosa.unidad` de null a `"F"`, **cuando** confirmo, **entonces** el render se actualiza.

**Reglas y restricciones:**
- La diferenciación es **lectura derivada** de `unidad`, no un flag independiente.
- Convención visual: [hipótesis] borde verde claro saturado — a validar contra SSOT visual V-xx.
- Coexiste con los dos ejes ontológicos normales (esencia, afiliación).

**Dependencias:**
- Bloqueada por: HU-17.011.

**Integraciones:**
- Renderer JointJS: regla condicional por `unidad`.
- SSOT visual: consultar V-xx sobre diferenciación de atributos.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [Glos 3.4] Atributo — distinción entre atributos numéricos (con unidad medible) y atributos objeto.
- Fuente: §7.7 (correlación observada borde verde claro ↔ atributo numérico), §9.
- Clase de afirmación: hipótesis + observado.

**Prioridad:** M1.
**Tamaño:** XS.
**Etiquetas:** [canvas, render, atributos, numéricos, diferenciación].

---

### HU-17.015 — Declarar estado-valor placeholder `value` en atributo numérico

**Actor primario:** AD.
**Actores secundarios:** IS.
**Tipo:** opm-semantica.
**Nivel categórico:** K primario (extiende `estado`); V secundaria.
**Superficie UI:** canvas-render (subrectángulo interior).
**Gesto canónico:** ninguno directo — emerge del atributo numérico sin valor asignado.

**Historia:**
> Como autor de dominio, quiero que un atributo numérico sin valor asignado muestre el placeholder `value` dentro de su rectángulo para marcar que es una variable sin instancia todavía.

**Contexto de negocio:**
`value` es un **nombre de estado reservado** que actúa como "hueco por llenar". Indica que el atributo es clase, no instancia. Es la semilla de una ontología donde las instancias concretas asignan valores al placeholder. El render genera un subrectángulo redondeado dentro del rectángulo padre del atributo con el literal `value`.

**Criterios de aceptación:**
- **Dado** que creo un atributo `Temperature [F]` sin asignar valor, **cuando** se renderiza, **entonces** aparece un subrectángulo interior redondeado con el texto literal `value`.
- **Dado** que el atributo tiene unidad y `value` placeholder, **cuando** consulto OPL, **entonces** aparece `Temperature is value F.` (ver HU-17.016).
- **Dado** que un atributo no tiene unidad, **cuando** se renderiza, **entonces** NO aparece el placeholder `value` (el placeholder es específico de atributos numéricos).
- **Dado** que asigno un valor concreto (p.ej. `185`), **cuando** la asignación sucede, **entonces** el placeholder cambia a `185` (ver HU-17.017).

**Reglas y restricciones:**
- `value` es literal reservado; no debe usarse como nombre de estado ad-hoc para otros fines.
- Posición: zona inferior interior del rectángulo del atributo.
- El estado-valor y estados enumerados (`state1 | state2`) no coexisten en los frames observados para el mismo objeto.

**Modelo de datos tocado:**
- `cosa.estados` — lista con un estado `{nombre: "value", es_placeholder: true}` — persistente.

**Dependencias:**
- Bloqueada por: HU-17.011 (unidad).
- Bloquea a: HU-17.016, HU-17.017.

**Integraciones:**
- Renderer: factory de subrectángulo interior.
- OPL: plantilla `is value <Unidad>`.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [Glos 3.4] Atributo; [Glos 3.28] Instancia — el placeholder marca el atributo como clase sin instancia con valor concreto.
- Fuente: §3.7, §6.
- Frames: frame_00030 (`Temperature [F] {tgt}` con `value` interior).
- Clase de afirmación: observado.

**Prioridad:** M1.
**Tamaño:** M.
**Etiquetas:** [canvas, kernel, estado-valor, placeholder, atributos].

---

### HU-17.016 — Ver OPL `Attr is value <Unit>.` para atributo numérico sin valor

**Actor primario:** MN.
**Actores secundarios:** AD.
**Tipo:** opm-semantica.
**Nivel categórico:** L.
**Superficie UI:** panel-opl-es.
**Gesto canónico:** ninguno.

**Historia:**
> Como modelador, quiero ver la oración OPL `<Attr> is value <Unit>.` cuando un atributo numérico tiene estado-valor placeholder para leer la intención de la variable en lenguaje natural.

**Contexto de negocio:**
El OPL de atributo placeholder es pedagógico: comunica al lector que la variable existe, tiene unidad declarada, pero aún no tiene valor. El patrón `is value` es la marca lingüística del placeholder.

**Criterios de aceptación:**
- **Dado** que el atributo `Temperature [F]` tiene estado-valor placeholder, **cuando** consulto OPL, **entonces** aparece `Temperature is value F.`.
- **Dado** que el atributo tiene alias `{tgt}`, **cuando** consulto OPL, **entonces** aparece `Temperature, tgt, is value F.`.
- **Dado** que el atributo tiene unit `kJ` y alias `pow`, **cuando** consulto OPL, **entonces** aparece `Power, pow, is value kJ.`.
- **Dado** que asigno un valor concreto (HU-17.017), **cuando** ocurre, **entonces** la oración OPL cambia (p.ej. `Power is 185 kJ.` — **pregunta abierta** sobre plantilla exacta).

**Reglas y restricciones:**
- Plantilla canónica: `<Nombre>[, <alias>,] is value <Unidad>.`
- `value` literal sin interpolar; `<Unidad>` es el string de `cosa.unidad`.

**Dependencias:**
- Bloqueada por: HU-17.015.

**Integraciones:**
- Motor OPL.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [Glos 3.4] Atributo — OPL verbaliza la semántica del atributo con su unidad.
- Fuente: §3.7, §7.3.
- Frames: frame_00030 OPL línea 42 "Power, pow, is value kJ.".
- Clase de afirmación: observado.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [opl, atributos, estado-valor, placeholder].

---

### HU-17.017 — Asignar valor concreto al estado-valor (reemplazar `value` por numérico)

**Actor primario:** AD.
**Actores secundarios:** IS.
**Tipo:** opm-semantica.
**Nivel categórico:** K.
**Superficie UI:** **pregunta abierta** — probablemente popup del estado o campo al designar Current.
**Gesto canónico:** **pregunta abierta** — observación no capturada en frames.

**Historia:**
> Como autor de dominio, quiero asignar un valor concreto (p.ej. `185`) al estado-valor para transformar el atributo de clase a instancia con valor.

**Contexto de negocio:**
El paso de placeholder a valor concreto es la transición **clase → instancia**. Transforma un modelo conceptual (define variables) en un modelo con datos reales (instancias). Conecta al modelador OPM con simulación conceptual (EPICA-B0) y runtime (EPICA-C0).

**Criterios de aceptación:**
- **Dado** que un atributo tiene estado-valor placeholder, **cuando** asigno el valor `185` (mecanismo por clarificar), **entonces** el placeholder muestra `185` en vez de `value`.
- **Dado** que el atributo tiene valor asignado, **cuando** consulto OPL, **entonces** la oración refleja el valor concreto.
- **Dado** que borro el valor, **cuando** confirmo, **entonces** el placeholder vuelve a mostrar `value`.

**Reglas y restricciones:**
- Mecanismo exacto: **pregunta abierta Q17.5** (mismo popup de estado, campo adicional al designar Current, popup de Time Duration extendido).
- Validación de tipo (número vs texto): a clarificar (probablemente la unidad fuerza tipo numérico).

**Modelo de datos tocado:**
- `estado.valor` — number | string — persistente.
- `estado.es_placeholder` — boolean — false al asignar valor.

**Dependencias:**
- Bloqueada por: HU-17.015.
- Relaciona: HU-17.032 (designación Current podría ser el trigger).
- Etiqueta: `requires-clarification`.

**Integraciones:**
- Renderer: actualiza subrectángulo interior.
- OPL: cambia plantilla.
- Simulación: consume valores asignados.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [Glos 3.28] Instancia — paso de clase a instancia al asignar valor concreto; [Glos 3.7] Clase — la clase define rangos, la instancia asigna valores.
- Fuente: §3.7 observación + §11 Q2.
- Clase de afirmación: hipótesis + abierto.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [canvas, kernel, estado-valor, instancia, clase-instancia, requires-clarification].

---

### HU-17.018 — Abrir modal Add URL Links desde toolbar contextual

**Actor primario:** ME.
**Actores secundarios:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** U.
**Superficie UI:** toolbar-contextual-extensión + modal-url.
**Gesto canónico:** clic en icono 🔗 URL Link del grupo extensión.

**Historia:**
> Como modelador, quiero abrir el modal de gestión de URLs desde el botón 🔗 de la toolbar contextual de extensiones para adjuntar recursos externos al objeto.

**Contexto de negocio:**
URL Links es una extensión (no primitiva): activa vía "entities extension" mechanism (EPICA-A0 stereotype extension). OPCloud la promociona en la toolbar contextual cuando el objeto tiene el stereotype correspondiente. El modal es draggable (icono de cruz en cabecera) y se cierra con `X` o `Close`.

**Criterios de aceptación:**
- **Dado** que tengo un objeto seleccionado con extensión URL habilitada, **cuando** miro la toolbar contextual, **entonces** aparece el icono 🔗 URL Link en el grupo de extensiones.
- **Dado** que hago clic en 🔗, **cuando** se ejecuta, **entonces** se abre el modal `Add URL Links` centrado.
- **Dado** que el modal está abierto, **cuando** hago drag de la cabecera (icono de cruz), **entonces** el modal se mueve.
- **Dado** que el modal está abierto, **cuando** hago clic en `X` de cabecera o botón `Close`, **entonces** se cierra sin persistir cambios pendientes.

**Reglas y restricciones:**
- La extensión URL puede **no estar** habilitada por defecto (depende de stereotype extension).
- El modal es modal-bloqueante del canvas mientras está abierto.

**Dependencias:**
- Bloqueada por: HU-10.001 (objeto existe).
- Relaciona: EPICA-A0 (stereotype extension).

**Integraciones:**
- Extensión entities (EPICA-A0) activa el botón.

**Notas de evidencia:**
- Fuente: §1.1, §3.2, §5.4, §7.5.
- Frames: frame_00012 (modal abierto), frame_00015 (botón 🔗 visible).
- Transcripción: "entities extension activa View URL".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [canvas, ui, url, modal, entities-extension, toolbar-contextual].

---

### HU-17.019 — Agregar URL tipada (Picture / Video / Articles / Text / OSLC)

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** K (nuevo campo `cosa.urls`); V (icono 🔗) secundaria.
**Superficie UI:** modal-url.
**Gesto canónico:** seleccionar tipo + pegar URL + botón `Save`.

**Historia:**
> Como autor de dominio, quiero agregar al objeto URLs tipadas (picture, video, articles, text, OSLC) para enlazar recursos externos categorizados.

**Contexto de negocio:**
El tipo enumerado permite procesar URLs diferentemente según su naturaleza: picture → preview de imagen, OSLC → integración con servidores de enlace. Categorizar al adjuntar facilita el consumo posterior (preview, export, runtime). `OSLC` es el guiño a integración de lifecycle management.

**Criterios de aceptación:**
- **Dado** que el modal URL está abierto con una fila vacía, **cuando** selecciono `Picture` en el combo, **entonces** el tipo de esa fila es `"picture"`.
- **Dado** que pego una URL válida en el campo, **cuando** la URL pasa validación (protocolo válido), **entonces** se almacena como string.
- **Dado** que agrego nota en el textarea inferior, **cuando** guardo, **entonces** la nota se persiste junto con tipo y URL.
- **Dado** que hago clic en `Add New Link`, **cuando** se ejecuta, **entonces** aparece una nueva fila vacía para agregar otra URL.
- **Dado** que hago clic en `Save`, **cuando** se ejecuta, **entonces** las URLs editadas se persisten en `cosa.urls` y el modal se cierra.

**Reglas y restricciones:**
- Tipos enumerados: `picture | video | articles | text | OSLC`. Valores fuera del set rechazados.
- El combo default: `Picture`.
- Número máximo de URLs: no observado (presumiblemente ilimitado).

**Modelo de datos tocado:**
- `cosa.urls` — lista de `{tipo, url, notas}` — persistente.

**Dependencias:**
- Bloqueada por: HU-17.018.
- Bloquea a: HU-17.020, HU-17.021, HU-17.022.

**Integraciones:**
- Renderer: muestra 🔗 cuando `cosa.urls.length > 0`.
- Runtime URLs (EPICA-C1): consume URLs tipadas.

**Notas de evidencia:**
- Fuente: §1.1, §3.2, §5.4.
- Frames: frame_00012 (combo Picture + URL + textarea).
- Transcripción: "tipo enumerado — picture, video, articles, text, OSLC".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [canvas, kernel, url, tipo-enum, extensión].

---

### HU-17.020 — Ver marca 🔗 en esquina del objeto cuando tiene URL

**Actor primario:** MN.
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Nivel categórico:** V.
**Superficie UI:** canvas-render (esquina superior-izquierda del rectángulo interior).
**Gesto canónico:** ninguno.

**Historia:**
> Como lector del modelo, quiero ver el icono 🔗 en la esquina del objeto cuando tiene URLs adjuntas para saber que hay recursos externos enlazados.

**Contexto de negocio:**
Marca persistente análoga a 📄 (descripción) pero para URLs. El icono 🔗 aparece en la esquina **superior-izquierda** (mientras 📄 va en la superior-derecha), estableciendo una convención de zonas de marca.

**Criterios de aceptación:**
- **Dado** que un objeto tiene `cosa.urls.length > 0`, **cuando** se renderiza, **entonces** aparece 🔗 en la esquina superior-izquierda del rectángulo.
- **Dado** que `cosa.urls` es vacío, **cuando** se renderiza, **entonces** la marca 🔗 NO aparece.
- **Dado** que agrego URL vía modal, **cuando** confirmo `Save`, **entonces** la marca aparece sin recargar.
- **Dado** que el objeto tiene descripción y URLs, **cuando** se renderiza, **entonces** 🔗 (izq) y 📄 (der) coexisten sin solaparse.

**Reglas y restricciones:**
- Posición: esquina superior-izquierda interior del rectángulo.
- El icono es clickable (dispara HU-17.021).
- Cursor cambia al pasar sobre el icono (afordance link).

**Dependencias:**
- Bloqueada por: HU-17.019.
- Bloquea a: HU-17.021, HU-17.022.

**Integraciones:**
- Renderer JointJS.

**Notas de evidencia:**
- Fuente: §1.1, §3.2 paso 6, §9.
- Frames: frame_00003, frame_00009, frame_00015, frame_00025 (🔗 visible persistente).
- Transcripción: "el icono 🔗 es la marca visual de `este objeto tiene URLs adjuntas`".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [canvas, render, url, marca-persistente, esquina].

---

### HU-17.021 — Abrir URL al hacer clic sobre 🔗 del objeto

**Actor primario:** RV.
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; X (integración externa browser) secundaria.
**Superficie UI:** canvas + browser externo.
**Gesto canónico:** clic simple sobre icono 🔗.

**Historia:**
> Como lector, quiero abrir la URL primaria del objeto al hacer clic sobre el icono 🔗 para navegar al recurso externo sin pasar por el modal.

**Contexto de negocio:**
Clic directo sobre la marca es el gesto más rápido. El modelador pasa de leer el modelo a consultar el recurso en una acción. Tab externo típicamente (delegar al browser).

**Criterios de aceptación:**
- **Dado** que el objeto tiene ≥1 URL, **cuando** hago clic sobre 🔗, **entonces** se abre la URL primaria (primera de `cosa.urls`) en nueva pestaña/ventana del browser.
- **Dado** que la URL es inválida, **cuando** clic ocurre, **entonces** el browser gestiona el error (sin crash del modelador).
- **Dado** que el objeto no tiene URLs, **cuando** (imposible por HU-17.020) 🔗 no está visible.
- **Dado** que paso el cursor sobre 🔗, **cuando** hover ocurre, **entonces** el cursor cambia a forma de link (pointer).

**Reglas y restricciones:**
- Apertura en nueva pestaña/ventana (target=_blank o equivalente).
- Primaria = primera URL en `cosa.urls` (orden de inserción).

**Dependencias:**
- Bloqueada por: HU-17.020.

**Integraciones:**
- Browser del usuario.

**Notas de evidencia:**
- Fuente: §1.1, §3.2 paso 7, §8.
- Transcripción: "clic sobre 🔗 abre la URL enlazada; cursor cambia".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [canvas, ui, url, click, browser-externo].

---

### HU-17.022 — Rotar entre múltiples URLs con clics sucesivos

**Actor primario:** RV.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; X secundaria.
**Superficie UI:** canvas + browser externo.
**Gesto canónico:** clics sucesivos sobre icono 🔗.

**Historia:**
> Como lector, quiero que clics sucesivos sobre 🔗 abran la siguiente URL de la lista para rotar por todos los recursos enlazados sin usar el modal.

**Contexto de negocio:**
Un objeto puede tener N URLs (picture + video + article). Rotar con clics permite un **paseo rápido** por todos los recursos. El narrador confirma: "multiple clicks will toggle and rotate throughout the links". El ciclo es cerrado (tras la última vuelve a la primera).

**Criterios de aceptación:**
- **Dado** que el objeto tiene 3 URLs `[U1, U2, U3]`, **cuando** hago clic sobre 🔗, **entonces** se abre `U1`.
- **Dado** que acabo de abrir `U1`, **cuando** hago clic de nuevo, **entonces** se abre `U2`.
- **Dado** que estoy en `U3`, **cuando** hago clic de nuevo, **entonces** se abre `U1` (ciclo cerrado).
- **Dado** que hay solo 1 URL, **cuando** hago clics sucesivos, **entonces** se abre siempre la misma URL.
- **Dado** que reabro el modal y reordeno (o elimino), **cuando** salgo del modal, **entonces** el índice de rotación se resetea a 0 (**pregunta abierta Q17.6**).

**Reglas y restricciones:**
- Orden de rotación: por orden de inserción en `cosa.urls` (presumiblemente — **pregunta abierta Q17.6**: ¿alfabético, por tipo, por inserción?).
- Índice de rotación: estado transitorio del UI, no persiste en el modelo.

**Dependencias:**
- Bloqueada por: HU-17.021.
- Etiqueta: `requires-clarification`.

**Integraciones:**
- Browser.

**Notas de evidencia:**
- Fuente: §1.1, §3.2 paso 8, §11 Q5.
- Transcripción: "clics sucesivos rotan entre las URLs definidas".
- Clase de afirmación: confirmado por transcripción; orden exacto abierto.

**Prioridad:** C.
**Tamaño:** S.
**Etiquetas:** [canvas, ui, url, rotación, ciclo, requires-clarification].

---

### HU-17.023 — Eliminar fila de URL desde el modal

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** K (elimina entrada de `cosa.urls`); U secundaria.
**Superficie UI:** modal-url (botón `X` junto a `Preview`).
**Gesto canónico:** clic en `X`.

**Historia:**
> Como modelador, quiero eliminar una fila de URL con un clic en la `X` junto a Preview para quitar un recurso obsoleto sin borrar todo el modelo de URLs.

**Contexto de negocio:**
El borrado inline sin confirmación es rápido; la confirmación queda diferida al `Save` del modal (se puede cancelar con `Close` si fue error).

**Criterios de aceptación:**
- **Dado** que hay una fila en el modal URL, **cuando** hago clic en `X` adyacente a `Preview`, **entonces** la fila desaparece del modal.
- **Dado** que eliminé una fila, **cuando** hago clic en `Save`, **entonces** la eliminación se persiste en `cosa.urls`.
- **Dado** que eliminé una fila, **cuando** hago clic en `Close`, **entonces** la eliminación se descarta (se conserva en `cosa.urls`).
- **Dado** que eliminé la última fila, **cuando** guardo, **entonces** `cosa.urls` queda vacío y la marca 🔗 desaparece del canvas.

**Reglas y restricciones:**
- La eliminación es **por fila**, no por modal completo.
- Se persiste al `Save` — hay buffer temporal durante la edición.

**Modelo de datos tocado:**
- `cosa.urls[i]` — eliminación — persistente al Save.

**Dependencias:**
- Bloqueada por: HU-17.019.

**Integraciones:**
- Renderer: si `urls.length` pasa a 0, desaparece marca 🔗.

**Notas de evidencia:**
- Fuente: §4.5, §5.4.
- Frames: frame_00012 (`X` visible junto a Preview).
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [canvas, ui, url, eliminación, modal].

---

### HU-17.024 — Activar vista Semi-fold desde toolbar contextual

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** V primario; U (toolbar) secundaria.
**Superficie UI:** toolbar-contextual-extensión + canvas-render.
**Gesto canónico:** clic en icono `Semi-fold` del grupo extensión.

**Historia:**
> Como modelador, quiero activar la vista semi-fold de un objeto para ver sus rasgos exhibidos listados dentro del propio rectángulo sin ir a otro OPD.

**Contexto de negocio:**
Semi-fold es la **tercera vista** del objeto, intermedia entre SD (totalmente plegado) y unfolded (OPD separado). El narrador lo define: "here I have a more compact view which will show me what it includes but in a compact way". Útil para densificar un diagrama sin crear OPD hijo.

**Criterios de aceptación:**
- **Dado** que tengo un objeto con ≥1 rasgo exhibido, **cuando** hago clic en `Semi-fold` de la toolbar contextual, **entonces** el rectángulo del objeto se expande verticalmente y muestra filas interiores con los rasgos.
- **Dado** que el objeto está en semi-fold, **cuando** hago clic en el mismo botón, **entonces** vuelve al estado plegado (SD).
- **Dado** que el objeto no tiene rasgos exhibidos, **cuando** (no debería habilitarse) — **pregunta abierta**: ¿el botón se deshabilita o activa con rectángulo vacío expandido?
- **Dado** que activé semi-fold, **cuando** el rectángulo se expande, **entonces** las filas interiores **no son símbolos independientes**: no tienen handle propio, no admiten enlace directo, no aparecen en árbol OPD.

**Reglas y restricciones:**
- Semi-fold es una **vista** del mismo objeto — no crea nuevo OPD ni nuevo nodo de árbol.
- El botón `Semi-fold` vive en el grupo de extensión de la toolbar contextual.
- El icono canónico: rectángulo con líneas internas (observado en frame 15).

**Modelo de datos tocado:**
- `cosa.modo_vista` o similar — enum `"collapsed" | "semi_fold" | "unfolded"` — persistente por apariencia.
- **Pregunta abierta Q17.7**: ¿el view mode es por apariencia o por entidad?

**Dependencias:**
- Bloqueada por: HU-17.013 (tiene que haber rasgos para semi-plegar).
- Bloquea a: HU-17.025, HU-17.026, HU-17.027.

**Integraciones:**
- Renderer: layout vertical de filas interiores.
- OPL: cambia plantilla a `lists A and B as features`.

**Notas de evidencia:**
- Fuente: §1.1, §3.4, §5.2 (grupo extensión).
- Frames: frame_00015 (icono semi-fold), frame_00025 (semi-fold activo).
- Transcripción: "tercera vista intermedia; the narrator calls it semi-fold".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [canvas, render, semi-fold, refinamiento, toolbar-contextual].

---

### HU-17.025 — Ver rasgos exhibidos como filas interiores en semi-fold

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** V.
**Superficie UI:** canvas-render (filas interiores del rectángulo padre).
**Gesto canónico:** ninguno (render automático tras activar semi-fold).

**Historia:**
> Como modelador, quiero ver los rasgos exhibidos listados como filas dentro del rectángulo del padre (con triángulo `▲` como viñeta) para identificar los atributos sin cambiar de OPD.

**Contexto de negocio:**
Las filas interiores son **representaciones livianas** de los rasgos — la semántica estructural (quién exhibe a quién) se comunica por el contenedor, no por enlaces separados. El triángulo relleno `▲` como viñeta codifica "exhibición-caracterización en forma compacta".

**Criterios de aceptación:**
- **Dado** que el objeto está en semi-fold con rasgos `[A, B]`, **cuando** se renderiza, **entonces** aparecen dos filas interiores debajo del nombre: `▲ A`, `▲ B`.
- **Dado** que el número de rasgos es N, **cuando** se renderiza, **entonces** aparecen N filas apiladas verticalmente.
- **Dado** que agrego o elimino un rasgo del objeto, **cuando** la operación se confirma, **entonces** la lista de filas se actualiza en vivo.
- **Dado** que las filas interiores están visibles, **cuando** intento seleccionarlas individualmente, **entonces** NO tienen handle de selección propio (no son símbolos independientes).

**Reglas y restricciones:**
- Viñeta: `▲` pequeño relleno gris-azul.
- Orden de las filas: por convención (inserción o alfabético — a definir).
- Colisión visual con `▲` externo de agregación: distinguir por contexto (dentro=exhibición compacta, fuera=agregación).

**Dependencias:**
- Bloqueada por: HU-17.024.
- Bloquea a: HU-17.026, HU-17.027.

**Integraciones:**
- Renderer: compone layout interno del rectángulo expandido.

**Notas de evidencia:**
- Fuente: §3.4 paso 3, §9.
- Frames: frame_00025 (`▲ Air Gas Property Set`, `▲ Design Goal Set`).
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [canvas, render, semi-fold, rasgos, filas-interiores, viñeta].

---

### HU-17.026 — Extraer rasgo de semi-fold al canvas con doble-clic

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** V primario; U secundaria.
**Superficie UI:** canvas + fila-interior-semi-fold.
**Gesto canónico:** doble-clic sobre fila interior.

**Historia:**
> Como modelador, quiero extraer un rasgo específico del semi-fold al canvas haciendo doble-clic sobre su fila para que se convierta en símbolo independiente y pueda trabajar con él.

**Contexto de negocio:**
Semi-fold permite **selección granular**: no es un toggle todo-o-nada. Se puede sacar solo uno de los rasgos, dejando el resto dentro. Esto enriquece la composición del diagrama: algunos atributos visibles, otros compactados. El narrador describe el gesto: "double-click sobre la fila interior extrae el rasgo".

**Criterios de aceptación:**
- **Dado** que el objeto está en semi-fold con fila `▲ A`, **cuando** hago doble-clic sobre la fila, **entonces** A emerge como símbolo independiente (rectángulo propio) fuera del padre.
- **Dado** que A fue extraído, **cuando** se renderiza, **entonces** se dibuja un enlace de exhibición-caracterización (triángulo) conectando el padre con A desde fuera.
- **Dado** que A está fuera, **cuando** hago doble-clic de vuelta sobre A externo (o gesto equivalente), **entonces** A se reinserta al semi-fold.
- **Dado** que extraje todos los rasgos, **cuando** no queda ninguna fila interior, **entonces** el objeto **pregunta abierta**: ¿sale automáticamente de semi-fold o queda vacío con rectángulo expandido?

**Reglas y restricciones:**
- Gesto de extracción: doble-clic.
- Gesto de reinserción: **pregunta abierta Q17.8** — el narrador dice "clicking it back in" sin precisar (clic simple, doble-clic, drag).
- El enlace de exhibición se crea/destruye automáticamente al extraer/reinsertar.

**Modelo de datos tocado:**
- `cosa.apariencias[aparienciaId].modo` — `"interior_semi_fold" | "independent"` — persistente.

**Dependencias:**
- Bloqueada por: HU-17.025.

**Integraciones:**
- Renderer: layout se recompone al extraer.
- OPL: cambia plantilla al reducir el conjunto de `lists … as features`.

**Notas de evidencia:**
- Fuente: §3.5, §4.6.
- Transcripción: "double-click sobre la fila extrae el rasgo; if I want to reinsert it I'm clicking it back in".
- Clase de afirmación: confirmado por transcripción (extracción); reinserción abierta.
- Etiqueta: `requires-clarification` (reinserción).

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [canvas, semi-fold, doble-click, refinamiento, apariencias].

---

### HU-17.027 — Ver OPL `lists A and B as features.` en semi-fold

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** L.
**Superficie UI:** panel-opl-es.
**Gesto canónico:** ninguno.

**Historia:**
> Como modelador, quiero que el panel OPL-ES muestre `<Obj> lists A and B as features.` cuando el objeto está en semi-fold para que el lenguaje natural refleje el modo compacto.

**Contexto de negocio:**
El OPL distingue entre `exhibits` (vista expandida o unfolded) y `lists … as features` (vista semi-fold). Es una convención lingüística que comunica que hay "resumen" y no despliegue completo.

**Criterios de aceptación:**
- **Dado** que el objeto `Turbojet Engine System` está en semi-fold con rasgos `Air Gas Property Set` y `Design Goal Set`, **cuando** consulto OPL, **entonces** aparece `Turbojet Engine System, tes, lists Air Gas Property Set and Design Goal Set as features.`.
- **Dado** que hay un solo rasgo en semi-fold, **cuando** consulto OPL, **entonces** aparece `<Obj> lists <A> as a feature.` (singular — **pregunta abierta**).
- **Dado** que extraigo un rasgo (HU-17.026), **cuando** ocurre, **entonces** la lista de features del OPL se reduce.
- **Dado** que desactivo semi-fold, **cuando** el objeto vuelve a colapsar, **entonces** la línea `lists … as features` reemplaza/cambia por `exhibits …`.

**Reglas y restricciones:**
- Plantilla: `<Obj>[, <alias>,] lists <A1>[, <A2>,...] and <An> as features.`
- Alternativa `as feature` (singular) no confirmada — **pregunta abierta**.

**Dependencias:**
- Bloqueada por: HU-17.024, HU-17.025.

**Integraciones:**
- Motor OPL.

**Notas de evidencia:**
- Fuente: §3.4 paso 4, §7.3.
- Frames: frame_00025 (OPL con `lists Air Gas Property Set and Design Goal Set as features`).
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [opl, semi-fold, features, plantilla].

---

### HU-17.028 — Navegar a OPD `SDn: <Obj> unfolded` con Show Unfold View

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; L (navegación árbol) secundaria.
**Superficie UI:** halo (pie menu) + árbol-opd.
**Gesto canónico:** clic en `Show Unfold View` del pie menu.

**Historia:**
> Como modelador, quiero navegar al OPD `SDn: <Obj> unfolded` con la acción `Show Unfold View` del halo para trabajar con todos los atributos del objeto en un OPD dedicado.

**Contexto de negocio:**
`Show Unfold View` es el equivalente para Object de `In-Zoom` para Process. Si el OPD unfolded ya existe, **navega**; si no existe, presumiblemente **crea** (no observado). La regla "si ya existe, navegar" es consistente con doc 12 §1.1 sobre el halo del proceso.

**Criterios de aceptación:**
- **Dado** que tengo un objeto `O` con OPD unfolded existente (`SDn: O unfolded`), **cuando** hago clic en `Show Unfold View` del pie menu, **entonces** el viewport cambia al OPD `SDn` y el árbol OPD lo resalta.
- **Dado** que el objeto no tiene OPD unfolded, **cuando** hago clic en `Show Unfold View`, **entonces** se crea un OPD `SDn: O unfolded` con el objeto y sus rasgos (**hipótesis** — no observado).
- **Dado** que el OPD unfolded existe, **cuando** navego, **entonces** el árbol marca el nodo con color azul claro.
- **Dado** que `O` también tiene OPD in-zoomed, **cuando** ambos refinamientos existen, **entonces** aparecen como nodos hermanos del árbol (`SDn: O unfolded` y `SDm: O in-zoomed`).

**Reglas y restricciones:**
- Sufijo del nodo: `unfolded` para Object, `in-zoomed` para Process.
- Navegación si ya existe; creación si no (**pregunta abierta Q17.9** para caso de creación).
- El halo del Object **no** incluye `In-Zoom` (es de Process); incluye `Show Unfold View`.

**Dependencias:**
- Bloqueada por: HU-10.019, HU-10.020 (pie menu).
- Relaciona: EPICA-20 (OPD tree), EPICA-12 (inzooming de proceso).

**Integraciones:**
- Árbol OPD.
- Viewport.

**Notas de evidencia:**
- Fuente: §1.1, §3.3, §5.3, §7.2.
- Frames: frame_00018 (halo con tooltip `Show Unfold View`), frame_00022 (nodo SD2 seleccionado).
- Transcripción: "navega al OPD unfold ya existente cuando el objeto ya fue desplegado".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [canvas, ui, halo, unfold, navegación-opd, show-unfold].

---

### HU-17.029 — Mostrar múltiples apariencias del mismo objeto en un OPD

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** V primario; K (modelo de apariencias) secundario.
**Superficie UI:** canvas-opd.
**Gesto canónico:** ninguno (consecuencia de layout + modelo multi-apariencia).

**Historia:**
> Como modelador, quiero que un mismo objeto pueda aparecer varias veces en un OPD para reducir cruces de enlaces sin duplicar la entidad.

**Contexto de negocio:**
Un modelo OPM complejo a menudo necesita referenciar la misma entidad desde diferentes zonas del OPD — dibujarla una sola vez fuerza líneas cruzadas o rutas largas. OPCloud admite **apariencias múltiples**: varios rectángulos que comparten la misma identidad semántica. Frame 20 muestra dos rectángulos idénticos de `Turbojet Engine System {tes}` sin silueta desplazada que los distinga.

**Criterios de aceptación:**
- **Dado** que tengo un objeto `O` en un OPD, **cuando** invoco `Add Appearance` (mecanismo por clarificar), **entonces** se crea una segunda apariencia del mismo O en posición distinta.
- **Dado** que edito `O.nombre` desde cualquier apariencia, **cuando** confirmo, **entonces** ambas apariencias se actualizan (misma entidad).
- **Dado** que tengo dos apariencias de O, **cuando** elimino una apariencia, **entonces** la entidad persiste mientras exista al menos una apariencia (o persiste siempre, con visibilidad cero — **pregunta abierta**).
- **Dado** que hay dos apariencias del mismo O, **cuando** miro la biblioteca lateral, **entonces** aparece una sola entrada (biblioteca lista entidades, no apariencias).
- **Dado** que las dos apariencias se ven iguales en canvas, **cuando** miro el render, **entonces** **pregunta abierta Q17.10**: ¿hay convención visual para distinguir "primaria" de "secundaria" (silueta desplazada) o se renderizan idénticas?

**Reglas y restricciones:**
- Modelo: `cosa` es la entidad, `apariencia` es la apariencia con `{posicion, modo, visible}`.
- SSOT §1.8 sugiere silueta desplazada; observación de OPCloud muestra dos apariencias idénticas sin silueta — divergencia abierta.
- Mecanismo de creación de segunda apariencia: **pregunta abierta Q17.11** (drag desde biblioteca, menú "Add Appearance", drag-with-alt-key).

**Modelo de datos tocado:**
- `cosa.apariencias[]` — lista de `{id_apariencia, posicion, visible, modo}` — persistente.

**Dependencias:**
- Bloqueada por: HU-10.001/002 (entidad existe).
- Etiqueta: `requires-clarification`.

**Integraciones:**
- Renderer: compone N rectángulos por N apariencias.
- Biblioteca lateral: agrupa por entidad.
- OPL: emite una sola declarativa por entidad (sin duplicar por apariencia).

**Notas de evidencia:**
- Fuente: §1.1, §6, §9.
- Frames: frame_00020 (dos apariencias idénticas de `Turbojet Engine System {tes}`).
- Clase de afirmación: observado + divergencia frente a SSOT.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [canvas, render, apariencias, multi-instancia, requires-clarification].

---

### HU-17.030 — Navegar de entidad a apariencias desde biblioteca con sufijo `of <parent>`

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; L secundaria.
**Superficie UI:** panel-biblioteca-lateral.
**Gesto canónico:** clic o drag en entrada compuesta con sufijo `of <parent>`.

**Historia:**
> Como modelador, quiero ver en la biblioteca lateral entradas compuestas como `Turbojet Engine Operating of Turbojet Engine System` para re-dragar esa combinación pre-configurada a otro OPD.

**Contexto de negocio:**
La biblioteca lateral no solo lista entidades aisladas — también lista **combinaciones estructurales pre-computadas** (`A of B`, `X of Y and Z`). Al dragar una entrada con sufijo, se agrega el contexto estructural al OPD destino sin reconstruirlo manualmente. Es un acelerador para modelos repetidos.

**Criterios de aceptación:**
- **Dado** que `Turbojet Engine Operating` es exhibido por `Turbojet Engine System`, **cuando** consulto la biblioteca, **entonces** aparece una entrada `Turbojet Engine Operating of Turbojet Engine System`.
- **Dado** que `Air Gas Property Set` es compartido por dos padres, **cuando** consulto la biblioteca, **entonces** aparece `Air Gas Property Set of Turbojet Engine System and Air Gas`.
- **Dado** que hago drag de esa entrada a un OPD vacío, **cuando** suelto, **entonces** se crean las apariencias de hijo + padre con enlace de exhibición-caracterización ya establecido.
- **Dado** que hago clic sobre la entrada, **cuando** se ejecuta, **entonces** la entidad hijo se destaca en la biblioteca o se navega a la vista con el contexto (**pregunta abierta** de comportamiento exacto del clic).

**Reglas y restricciones:**
- Sufijo canónico: `of <parent>` o `of <parent1> and <parent2>` cuando es multi-padre.
- Las entradas compuestas son generadas automáticamente por la lente; no se editan manualmente.
- Orden y visibilidad: convención observada — todas las combinaciones están listadas sin filtro.

**Dependencias:**
- Bloqueada por: HU-17.013 (enlaces de exhibición existen).
- Relaciona: HU-10.017 (biblioteca lateral base).

**Integraciones:**
- Biblioteca lateral (lente del modelo).
- Sistema de filtros (search — observado "turbojet" como término).

**Notas de evidencia:**
- Fuente: §7.4.
- Frames: frame_00022 (entradas `Turbojet Engine Operating of Turbojet Engine System`).
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [ui, biblioteca-lateral, apariencias, navegación, sufijo-contextual].

---

### HU-17.031 — Designar estado como Initial / Final con botonera contextual

**Actor primario:** IS (ingeniero de simulación).
**Actores secundarios:** ME.
**Tipo:** opm-semantica.
**Nivel categórico:** K (nuevo campo `estado.designaciones`); U (botonera) secundaria.
**Superficie UI:** toolbar-contextual (botonera cuatro botones cuando hay estado seleccionado).
**Gesto canónico:** clic en botón `Initial` o `Final`.

**Historia:**
> Como ingeniero de simulación, quiero marcar un estado como Initial o Final con un clic en la botonera contextual para declarar el punto de arranque o de cierre de una trayectoria.

**Contexto de negocio:**
Las designaciones de estado son los **hooks de simulación**. Un estado `Initial` es el punto de entrada; `Final` es el terminal. En conjunto definen la trayectoria nominal del objeto. La botonera aparece en la toolbar superior cuando hay un estado seleccionado — es un **modo de toolbar**, no un layout fijo.

**Criterios de aceptación:**
- **Dado** que selecciono un estado de un objeto, **cuando** la toolbar se reconfigura, **entonces** aparecen los botones `Initial | Final | Current | Default` en orden fijo.
- **Dado** que hago clic en `Initial`, **cuando** se ejecuta, **entonces** `estado.designaciones.inicial = true`.
- **Dado** que un estado ya era `Initial`, **cuando** hago clic en `Initial` de nuevo, **entonces** la designación se alterna a `false` (toggle — **pregunta abierta** si es toggle o one-way).
- **Dado** que tengo un estado con `inicial=true`, **cuando** consulto OPL, **entonces** la oración refleja la designación (p.ej. `state1 is the initial state`).

**Reglas y restricciones:**
- Orden fijo en botonera: `Initial | Final | Current | Default`.
- Multiples estados del mismo objeto pueden ser `Initial` — **pregunta abierta Q17.12** sobre unicidad.
- Render del botón: activo cuando la designación está puesta (frame 35 muestra `Default` activo en azul oscuro).

**Modelo de datos tocado:**
- `estado.designaciones.inicial` — boolean — persistente.
- `estado.designaciones.final` — boolean — persistente.

**Dependencias:**
- Bloqueada por: HU-13.xxx (estados existen — EPICA-13).
- Bloquea a: HU-17.032, HU-17.033, HU-17.034.

**Integraciones:**
- Panel OPL-ES: emite líneas de designación.
- Simulación (EPICA-B0): consume designaciones.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [Glos 3.28] Instancia — designaciones de estado definen la trayectoria de la instancia.
- Fuente: §1.1, §3.8, §5.5.
- Frames: frame_00035 (botonera visible con tooltips `Set As Current`, `Set As Default`).
- Transcripción: "un estado puede ser ambos inicial y final".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [canvas, kernel, estado, designación, initial, final, simulación].

---

### HU-17.032 — Designar estado como Current / Default (excluyentes)

**Actor primario:** IS.
**Tipo:** opm-semantica.
**Nivel categórico:** K.
**Superficie UI:** toolbar-contextual (botonera).
**Gesto canónico:** clic en botón `Current` o `Default`.

**Historia:**
> Como ingeniero de simulación, quiero marcar un estado como Current o Default para declarar cuál es el estado "vivo" o el "por defecto" del objeto, respetando que no pueden coexistir en el mismo estado.

**Contexto de negocio:**
`Current` = estado activo en este momento (usado al arrancar simulación). `Default` = estado al que el objeto retorna si no hay otro especificado. Semánticamente conflictivos: un estado puede ser uno u otro, nunca ambos. El narrador es explícito: "I cannot have them both together as they cannot coexist".

**Criterios de aceptación:**
- **Dado** que un estado no tiene designaciones, **cuando** hago clic en `Current`, **entonces** `estado.designaciones.actual = true` y `por_defecto = false`.
- **Dado** que un estado tiene `actual=true`, **cuando** hago clic en `Default`, **entonces** `actual` pasa a `false` y `por_defecto` pasa a `true` (intercambio automático).
- **Dado** que intento marcar `Current` y `Default` simultáneamente, **cuando** la acción ocurre, **entonces** OPCloud rechaza o des-selecciona la anterior (mecanismo exacto **pregunta abierta Q17.13**: ¿toggle silencioso? ¿toast de advertencia?).
- **Dado** que tengo múltiples estados del mismo objeto, **cuando** designo `Current` a uno, **entonces** los otros **pregunta abierta**: ¿se desmarcan automáticamente? (¿Current es único por objeto?).
- **Dado** que el toggle Current/Default se aplicó, **cuando** consulto OPL, **entonces** la oración refleja la designación activa.

**Reglas y restricciones:**
- Invariante dura: `!(actual && por_defecto)` por estado.
- Unicidad de Current por objeto: **pregunta abierta Q17.14**.
- Visualización: el botón activo tiene fondo azul oscuro; inactivos en gris (frame 35).

**Modelo de datos tocado:**
- `estado.designaciones.actual` — boolean — persistente.
- `estado.designaciones.por_defecto` — boolean — persistente.

**Dependencias:**
- Bloqueada por: HU-17.031.
- Etiqueta: `requires-clarification`.

**Integraciones:**
- Validador del núcleo: impone exclusión.
- Simulación: consume Current como estado inicial activo.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [Glos 3.28] Instancia — designaciones Current/Default definen el estado operacional de la instancia.
- Fuente: §1.1, §3.8 paso 4, §4.1, §5.5.
- Transcripción: "current and default cannot coexist".
- Clase de afirmación: confirmado por transcripción (exclusión); mecanismo exacto abierto.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [canvas, kernel, estado, designación, current, default, exclusión, requires-clarification].

---

### HU-17.033 — Permitir Initial + Final simultáneos en un mismo estado

**Actor primario:** IS.
**Tipo:** opm-semantica.
**Nivel categórico:** K.
**Superficie UI:** toolbar-contextual (botonera).
**Gesto canónico:** clic en `Initial` + clic en `Final` (independientes).

**Historia:**
> Como ingeniero de simulación, quiero que un mismo estado pueda ser Initial y Final simultáneamente para modelar objetos que arrancan y terminan en el mismo estado tras un ciclo.

**Contexto de negocio:**
La transcripción confirma: "a state can be both the initial state and the final state". Modela sistemas de arranque/parada cíclicos, o objetos que regresan al punto de partida tras un ciclo de operación. Es la **inversa semántica** de Current/Default (estos excluyentes, Initial/Final compatibles).

**Criterios de aceptación:**
- **Dado** que un estado tiene `inicial=true`, **cuando** hago clic en `Final`, **entonces** `final=true` también (ambos activos).
- **Dado** que un estado es Initial y Final, **cuando** consulto OPL, **entonces** la oración refleja ambas designaciones (p.ej. `state1 is the initial and final state`).
- **Dado** que ambos botones están activos, **cuando** miro la botonera, **entonces** ambos se renderizan como activos (fondo resaltado).
- **Dado** que tengo un estado Initial+Final, **cuando** también lo marco como Current, **entonces** las tres designaciones coexisten (Initial, Final, Current) — sujeto a exclusión con Default (HU-17.032).

**Reglas y restricciones:**
- `Initial + Final`: compatibles.
- `Initial + Default`, `Current + Final`, y otras combinaciones: **pregunta abierta Q17.15** (no confirmadas ni rechazadas).

**Modelo de datos tocado:**
- `estado.designaciones` — persistente con combinación permitida.

**Dependencias:**
- Bloqueada por: HU-17.031.

**Integraciones:**
- OPL.
- Validador.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [Glos 3.28] Instancia — compatibilidad Initial+Final define ciclos de vida de instancia.
- Fuente: §1.1, §3.8 paso 4.
- Transcripción: "a state can be both the initial state and the final state".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** M1.
**Tamaño:** XS.
**Etiquetas:** [canvas, kernel, estado, designación, initial-final, compatibilidad, ciclo].

---

### HU-17.034 — Configurar Time Duration del estado con unidad + min/nominal/max

**Actor primario:** IS.
**Actores secundarios:** AD.
**Tipo:** opm-semantica.
**Nivel categórico:** K (nuevo campo `estado.duracion_temporal`); U (popup) secundaria.
**Superficie UI:** popup-time-duration-parameters (anclado al estado).
**Gesto canónico:** clic en `Add Time Duration` del halo o toolbar + rellenar campos + `Update`.

**Historia:**
> Como ingeniero de simulación, quiero configurar la duración temporal de un estado con unidad (min/sec/hour) y valores mínimo/nominal/máximo para alimentar las simulaciones con parámetros realistas.

**Contexto de negocio:**
Time Duration es un **parámetro de simulación** que define cuánto tiempo el objeto permanece en ese estado. Los tres valores (mín/nominal/máx) permiten modelado estocástico (valor más probable + rango de variabilidad). Alimenta simulación conceptual (EPICA-B0) y computacional (EPICA-B1).

**Criterios de aceptación:**
- **Dado** que tengo un estado seleccionado, **cuando** invoco `Add Time Duration` (halo o toolbar), **entonces** se abre el popup `Time Duration Parameters` anclado al estado.
- **Dado** que el popup está abierto, **cuando** elijo unidad en el combo (p.ej. `min`), **entonces** la unidad se asocia a los tres campos numéricos.
- **Dado** que completo `Minimal=1`, `Nominal=5`, `Maximal=10`, **cuando** presiono `Update`, **entonces** `estado.duracion_temporal = {unidad: "min", min: 1, nominal: 5, max: 10}` y el popup se cierra.
- **Dado** que el estado tiene duración configurada, **cuando** consulto OPL, **entonces** aparece una línea dedicada a la duración (formato **pregunta abierta**: presumiblemente `state1 lasts 5 min (range 1-10 min).` o similar).
- **Dado** que el estado tiene duración, **cuando** invoco `Remove Time Duration` (**pregunta abierta Q17.16** sobre gesto), **entonces** la duración se elimina.

**Reglas y restricciones:**
- Unidades observadas: `min`. Otras presumibles: `sec`, `hour`, `day` — no confirmadas.
- Los tres campos admiten valores numéricos positivos; validación `min ≤ nominal ≤ max` es probable pero no observada.
- Remover duración: gesto exacto abierto.

**Modelo de datos tocado:**
- `estado.duracion_temporal.unidad` — string — persistente.
- `estado.duracion_temporal.min` — number — persistente.
- `estado.duracion_temporal.nominal` — number — persistente.
- `estado.duracion_temporal.max` — number — persistente.

**Dependencias:**
- Bloqueada por: HU-13.xxx (estados — EPICA-13).
- Relaciona: EPICA-B0 (simulación conceptual), EPICA-B1 (simulación computacional).

**Integraciones:**
- Panel OPL-ES.
- Simulación.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [Glos 3.28] Instancia — la duración temporal parametriza el comportamiento de la instancia durante simulación.
- Fuente: §1.1, §3.8 paso 5, §3.9, §5.6.
- Frames: frame_00037 (popup Time Duration Parameters con `Units: min`, `Minimal`, `Nominal`, `Maximal`, `Update`).
- Transcripción: "I can remove the time duration".
- Clase de afirmación: confirmado por transcripción (configurar); remover abierto.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [canvas, kernel, estado, time-duration, simulación, popup].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q17.1**: Parsing del nombre compuesto `Nombre [Unidad] {alias}`: ¿OPCloud persiste campos separados o string único con convención de render? Afecta HU-17.011, HU-17.012.
- **Q17.2**: Ubicación exacta del toggle `do not show the description field` (popup, settings del objeto, engranaje global). Afecta HU-17.006.
- **Q17.3**: Scope del toggle `↑Alias` (per-objeto / per-OPD / per-modelo). Afecta HU-17.010.
- **Q17.4**: Validación de unidades (tabla cerrada SI, normalización `kpa → kPa`, unidades compuestas). Afecta HU-17.011.
- **Q17.5**: Mecanismo exacto para asignar valor concreto al estado-valor (reemplazar `value` por `185`). ¿Mismo popup de estado? ¿Campo adicional al designar Current? Afecta HU-17.017.
- **Q17.6**: Orden de rotación de URLs al clicar 🔗 (inserción, alfabético, por tipo). Afecta HU-17.022.
- **Q17.7**: Scope del view mode semi-fold (por apariencia o por entidad). Afecta HU-17.024.
- **Q17.8**: Gesto exacto de reinserción de rasgo extraído al semi-fold (clic simple, doble-clic, drag-in). Afecta HU-17.026.
- **Q17.9**: Comportamiento de `Show Unfold View` cuando no existe OPD unfolded previo (¿crea nuevo OPD? ¿pide confirmación?). Afecta HU-17.028.
- **Q17.10**: Convención visual para distinguir apariencias "primaria" vs "secundaria" (silueta desplazada vs idéntica) — divergencia con SSOT §1.8. Afecta HU-17.029.
- **Q17.11**: Mecanismo exacto para crear una segunda apariencia del mismo objeto (drag desde biblioteca, menú `Add Appearance`, modificador de teclado). Afecta HU-17.029.
- **Q17.12**: Toggle vs one-way de designación `Initial` (al clic repetido, ¿alterna o queda fijo?). Afecta HU-17.031.
- **Q17.13**: Mecanismo de exclusión `Current ↔ Default` (toggle silencioso vs mensaje). Afecta HU-17.032.
- **Q17.14**: Unicidad de `Current` por objeto (¿varios estados pueden ser Current?). Afecta HU-17.032.
- **Q17.15**: Otras combinaciones de designaciones (Initial+Default, Current+Final). Afecta HU-17.033.
- **Q17.16**: Gesto exacto de `Remove Time Duration` (botón en popup, icono en halo). Afecta HU-17.034.
- **Q17.17**: Semi-fold parcial (plegar solo subset de rasgos) vs toggle completo. Relaciona HU-17.024, HU-17.026.
- **Q17.18**: Disposición horizontal vs vertical de estados (observado `state1 | state2` horizontal, `value` interior vertical). Afecta render.
- **Q17.19**: Dígito de multiplicidad (`2 more operations`) — ¿editable por usuario o calculado por lente?
- **Q17.20**: Alcance real de URL tipo `OSLC` (integración OSLC externa). Cruzar EPICA-C1.

## Referencias cruzadas

- Doc fuente: `opcloud-reverse/17-canvas-atributos-instancias.md`.
- Fuente normativa: `opm-iso-19450-es.md`, `opm-visual-es.md`, `opm-opl-es.md`.
- Evidencia OPCloud: `JOYAS.md`, `sandbox-data/`, `assets/svg/`, `decompiled/`.
- Épicas de las que depende:
  - **EPICA-10** (canvas-creacion-cosas) — popup compartido, pie menu, drag, enlace-table.
  - **EPICA-13** (canvas-estados) — estados del objeto, precondición de HU-17.031–034.
  - **EPICA-15** (canvas-enlaces-avanzados) — link exhibition-characterization formal.
  - **EPICA-16** (canvas-enlaces-propiedades) — propiedades de enlaces.
  - **EPICA-18** (canvas-semi-folding) — semi-fold como mecanismo general (esta épica lo usa).
  - **EPICA-A0** (extension-stereotypes) — "entities extension" habilita el botón URL.
- Épicas que dependen de esta:
  - **EPICA-12** (canvas-inzooming) — Show Unfold View navega al OPD unfolded; in-zoom de objeto relaciona.
  - **EPICA-20** (estructura-opd-tree) — nodos SDn con sufijos `unfolded` / `in-zoomed`.
  - **EPICA-50** (opl-pane) — consume todas las plantillas OPL nuevas (alias, unidad, lists as features, is value Unit).
  - **EPICA-60** (export-pdf) — incluye descripción, alias, unidades en exports.
  - **EPICA-B0** (simulation-conceptual) — consume designaciones Initial/Final/Current/Default y Time Duration.
  - **EPICA-B1** (simulation-computational) — consume Time Duration con rangos.
  - **EPICA-C1** (runtime-urls) — consume URLs tipadas (especialmente OSLC).
  - **EPICA-D1** (analysis-informativity) — consume descripción como señal de informatividad.
- Invariantes del repositorio:
  - `src/nucleo/tipos.ts` — nuevos campos `cosa.descripcion`, `cosa.descripcion_visible`, `cosa.alias`, `cosa.unidad`, `cosa.urls[]`, `cosa.apariencias[]`, `estado.designaciones`, `estado.duracion_temporal`, `estado.es_placeholder`, `estado.valor`.
  - `src/nucleo/validacion/` — passes para exclusión `actual ↔ por_defecto`, validación `min ≤ nominal ≤ max`.
  - `src/render/jointjs/` — factories con zonas de marcas (📄 der, 🔗 izq), subrectángulo interior de estado-valor, layout de filas interiores en semi-fold.
  - `src/render/opl-renderer.ts` — plantillas nuevas (`, alias,`, `is value <Unidad>`, `lists A and B as features`, `and n more operations`).
  - `src/ui/` — popup Auto Format expandible, modal Add URL Links, popup Time Duration Parameters, botonera Initial/Final/Current/Default.
- SSOT OPM:
  - `opm-iso-19450-es.md` [Glos 3.4] Atributo, [Glos 3.7] Clase, [Glos 3.28] Instancia, [Glos 3.40] Clase de objeto.
  - `opm-visual-es.md` — V-xx sobre exhibition-characterization, estados, apariencias.
  - `opm-metodologia-es.md` — uso canónico de alias, unidades, placeholders.
