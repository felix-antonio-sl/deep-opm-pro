# 60 — UI y afordances del canvas

**Alcance**: cuatro modos de render (estático-exportable, edición, navegación, gestión-modal), handles y chrome de edición, notas y sticky notes, resaltado de búsqueda, tutorial, canales reservados a UI distinguibles de gramática OPM.
**Capa SSOT propietaria**: `opm-visual-es.md` §21; V-190..V-193 (límites con gramática)
**Aplicación en la app**: `src/ui/`, toolbar, paneles, modal, tooltips, selectors.

## Reglas

### R-2400: V-200 — Cuatro modos de render del canvas

- Enunciado: la implementación distingue, como mínimo, **cuatro modos visuales** sobre el canvas:
  - **estático-exportable**
  - **edición**
  - **navegación**
  - **gestión-modal**

Un quinto modo, **runtime**, queda regulado por §17 (simulación).

- Referencia SSOT: V-200
- Aplicación en código: el estado del canvas registra el modo activo.

### R-2401: V-201 — Solo estático-exportable es base de conformidad

- Enunciado: solo el modo **estático-exportable** constituye base de conformidad para el canon-diagrama.
- Referencia SSOT: V-201
- Aplicación en código: la auditoría visual se aplica contra este modo.

### R-2402: V-202 — Handles y chrome omitidos en canon

- Enunciado: handles de selección, puntos de rotación, menús radiales, toasts, backdrops modales y marcadores transitorios de creación NO pertenecen a la gramática OPM y DEBEN omitirse en los exports canónicos.
- Referencia SSOT: V-202
- Aplicación en código: el exportador filtra capas UI.

### R-2403: V-203 — UI en canal visual reservado

- Enunciado: los elementos UI de edición DEBEN usar un **canal visual reservado** y NO ambiguo respecto de §1, §2, §3, §8, §10, §17, §19, §20 y §23. Se recomienda:
  - color de interfaz diferenciado
  - opacidad controlada
  - ubicación fuera del núcleo semántico cuando sea posible
- Referencia SSOT: V-203
- Aplicación en código: paleta UI separada de paleta semántica; ADR documenta el contrato.

### R-2404: V-190 — Piruleta nunca aislada

- Enunciado: una piruleta semántica de agente o instrumento SIEMPRE cuelga del extremo de una línea visible. Un círculo aislado sin línea visible NO se interpreta como piruleta; DEBE tratarse como UI, token runtime o error de render.
- Referencia SSOT: V-190
- Aplicación en código: piruletas solo como `marker-end`/`marker-start` de enlace.

### R-2405: V-191 — Handles UI perceptualmente distintos

- Enunciado: los handles de edición y puntos de anclaje UI NO pueden ser visualmente idénticos a las piruletas de §1.5 en el canon-diagrama. DEBE distinguirse por:
  - color reservado a UI
  - posición
  - tamaño
- Referencia SSOT: V-191
- Aplicación en código: handles en azul claro o gris, ≤ 8 px, fuera de la geometría del enlace.

### R-2406: V-204 — Notas y anotaciones meta

- Enunciado: las notas libres, sticky notes y anotaciones meta pueden coexistir sobre el canvas, pero NO pertenecen a la gramática OPM nuclear. Si la implementación permite exportarlas, DEBE marcarlas como **contenido meta del autor** y no como hecho del modelo.

Si además reserva una morfología por defecto para ellas, esa morfología DEBE permanecer fuera de los canales semánticos de OPM y puede combinar, por ejemplo:
  - fondo amarillo pálido
  - pin rojo
  - anclaje discontinuo corto

siempre que esa combinación no sea reutilizable por estados, enlaces, validaciones o simulación.

- Referencia SSOT: V-204
- Aplicación en código: las notas tienen morfología reservada y flag `esMeta: true` en export.

### R-2407: V-205 — Resaltado de búsqueda en canal reservado

- Enunciado: el resaltado de búsqueda o navegación, si existe, DEBE usar un canal reservado distinto de las marcas de simulación y de refinamiento. Su ausencia NO invalida el modelo, pero su presencia NO debe confundirse con actividad o designación.
- Referencia SSOT: V-205
- Aplicación en código: color de highlight reservado (ej. amarillo translúcido).

### R-2408: Mapa del Sistema como familia de navegación

- Enunciado: el Mapa del Sistema pertenece a la misma familia de navegación: puede usar miniaturas de OPDs, flechas meta o marcadores de navegación propios de la vista, siempre que esos elementos NO se presenten como enlaces OPM ni como contenido del modelo.
- Referencia SSOT: V-205 (párrafo final)
- Aplicación en código: miniaturas con estilo distinto de enlaces OPM.

### R-2409: V-206 — Canon evaluado sin tutorial

- Enunciado: el render canónico de un OPD se evalúa con **tutorial, overlays de ayuda y focos pedagógicos desactivados**. Si la implementación ofrece modo tutorial, este pertenece exclusivamente al ecosistema de asistencia.
- Referencia SSOT: V-206
- Aplicación en código: el export desactiva capas de tutorial.

### R-2410: Grid como decoración opcional

- Enunciado: la grid del canvas es decoración opcional de edición. NO pertenece al modelo OPM y DEBE suprimirse en exportaciones canónicas.
- Referencia SSOT: V-196
- Aplicación en código: grid en capa separada, eliminada en export.

### R-2411: V-197 — Snap transparente al modelo

- Enunciado: el snap a grid es transparente al modelo. Dos OPDs con idéntica topología y diferencias de posicionamiento explicables solo por cuantización a grid se consideran visualmente equivalentes.
- Referencia SSOT: V-197

### R-2412: V-198 — Smart-guides reservados

- Enunciado: si la implementación ofrece smart-guides o líneas temporales de alineación, DEBE usar un canal visual reservado a UI. NO puede reutilizar sin distinción el patrón discontinuo reservado a afiliación ambiental.
- Referencia SSOT: V-198
- Aplicación en código: smart-guides con color distintivo, nunca dashed igual al de ambiental.

### R-2413: V-192 — Supresor de enlaces no materializados

- Enunciado: el supresor de enlaces no materializados (`...` en burbuja adyacente) pertenece a la gramática auxiliar del OPD **solo si persiste en el canon-diagrama**. NO debe confundirse con menús contextuales o botones UI con la misma grafía.
- Referencia SSOT: V-192
- Aplicación en código: distinguir supresor persistente (gramática) de menú contextual (UI transitoria).

### R-2414: V-193 — Triángulos compactados anclados

- Enunciado: los triángulos o indicadores estructurales compactados que representen relaciones adicionales hacia cosas ausentes DEBEN quedar anclados geométricamente a la cosa visible correspondiente.
- Referencia SSOT: V-193
- Aplicación en código: el triángulo compactado se embebe como decoración del bounding box, no flotante.

### R-2415: V-130 — Triángulos auxiliares UI distinguibles

- Enunciado: los triángulos auxiliares UI que desaparecen en export DEBEN distinguirse perceptualmente de los triángulos semánticos por tamaño, color reservado a UI o ubicación fuera de la geometría del enlace.
- Referencia SSOT: V-130
- Aplicación en código: handle de "crear enlace estructural" visualmente distinto del símbolo final.

### R-2416: V-221 — Marcador `×` durante edición

- Enunciado: durante operaciones de arrastre o creación, un enlace inválido puede exhibir un marcador transitorio de rechazo, como `×` roja sobre el conector. Ese marcador NO pertenece al canon-diagrama.
- Referencia SSOT: V-221
- Aplicación en código: marker `×` en modo edición, removido al exportar.

### R-2417: V-219 — Política canvas limpio

- Enunciado: en ausencia de declaración contraria, la validación NO deja marcas persistentes sobre el OPD estático una vez cerrado el diálogo o panel de validación. El resultado de validación vive en vistas auxiliares.
- Referencia SSOT: V-219
- Aplicación en código: resultados en panel lateral, no sobre el canvas.

### R-2418: Canales reservados — rojo/amarillo/verde

- Enunciado: el estilado autoral NO puede reutilizar sin distinción rojo, amarillo de alerta o verde de conformidad como semántica tácita (V-210).
- Referencia SSOT: V-210
- Aplicación en código: reservar estos colores a validación/alerta/conformidad si se usan.

### R-2419: Overlays modales con backdrop

- Enunciado: modales pueden tener backdrop sobre el canvas, pero NO modificar el modelo. El backdrop se remueve al cerrar el modal.
- Referencia SSOT: V-202
- Aplicación en código: modal con backdrop en capa superior.

### R-2420: Búsqueda asistida

- Enunciado: operaciones como buscar, traer conectados y traer filtrado DEBERÍAN usarse para inspección localizada de un subgrafo antes de editar, especialmente en modelos con alta densidad de enlaces.
- Referencia SSOT: `metodologia-opm-es.md` §8.8
- Aplicación en código: barra de búsqueda disponible en UI.

### R-2421: Canales de UI declarados en ADR

- Enunciado: la implementación DEBE documentar en un ADR los canales visuales reservados a UI (colores, opacidades, tamaños) y cómo se diferencian de la gramática semántica.
- Referencia SSOT: V-203, V-198
- Aplicación en código: `docs/adr/ADR-XXX-canales-ui.md`.

### R-2422: Modo tutorial no altera render canónico

- Enunciado: el modo tutorial pertenece al ecosistema de asistencia. Su UI (focos, flechas pedagógicas, etiquetas explicativas) NO debe persistir en el canon-diagrama.
- Referencia SSOT: V-206
- Aplicación en código: tutorial en capa separada del SVG exportado.

## Checklist

- [ ] Cuatro modos de render distinguibles (estático, edición, navegación, modal)
- [ ] Solo estático-exportable es base de conformidad
- [ ] Handles, chrome, overlays omitidos en canon
- [ ] Canal visual de UI reservado y documentado en ADR
- [ ] Piruletas nunca aisladas
- [ ] Handles distinguibles de piruletas por color/tamaño/posición
- [ ] Notas meta con morfología reservada, flag `esMeta` en export
- [ ] Resaltado de búsqueda en canal distinto de simulación/refinamiento
- [ ] Mapa del Sistema con miniaturas sin apariencia de enlaces OPM
- [ ] Tutorial desactivado en export
- [ ] Grid suprimida en canon
- [ ] Smart-guides con color reservado (no dashed semántico)
- [ ] Supresor `...` persistente vs menú contextual distinguibles
- [ ] Triángulos compactados anclados a cosa visible
- [ ] `×` de rechazo solo en edición
- [ ] Canvas limpio tras cerrar validación
- [ ] Rojo/amarillo/verde reservados a validación/alerta

## Antipatrones

- Handle de selección del mismo color que piruleta de agente
- Sticky note con fondo blanco y contorno negro (colisiona con objeto OPM)
- Smart-guide con patrón dashed igual al de ambiental
- Tutorial que persiste en SVG exportado
- Mapa del Sistema con flechas idénticas a enlaces OPM
- `×` de rechazo persistente en canon
- Grid visible en canon-diagrama

## Referencias cruzadas

- Canon y export: `01-canon-exportacion.md`, `63-exportacion-canonica.md`
- Layout visual: `20-layout-visual-opd.md`
- Estilado autoral: `61-estilado-autoral.md`
- Validación: `62-validacion-marcas-error.md`
- Decoraciones: `12-enlaces-decoraciones-marcas.md`
- Navegación: `40-navegacion-arbol-identidad.md`
