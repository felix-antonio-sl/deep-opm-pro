---
epica: "EPICA-91"
titulo: "Interacción — Tutorial Mode, tooltips guiados, thumbnails animados y asistencia pedagógica"
doc_fuente: "opcloud-reverse/91-interaccion-tutorial.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "C"
hu_emitidas: 16
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "REVISION-SSOT-EPICA-91"
---

## Resumen

Esta épica cubre el **Tutorial Mode** como modo de ayuda inline del modelador: una
capa pedagógica que acompaña al usuario durante el descubrimiento de la UI. A
diferencia del resto del producto, el tutorial **no altera el modelo OPM ni la
semántica**: es estrictamente una capa de overlays visuales temporales (tooltips
textuales + thumbnails animados) anclados al hover sobre controles, halos, left
pane y OPD tree. La activación es una preferencia binaria de usuario
(`Show` / `Hide`) accesible desde `OPCloud Settings`.

La épica combina:

1. **Activación y persistencia** del modo como preferencia de usuario.
2. **Tooltips textuales básicos** sobre controles (nombre canónico del botón).
3. **Thumbnails animados** con mini-OPDs sintéticos que ilustran el efecto del control.
4. **Cobertura incremental** de superficies UI (secondary toolbar, halo, left pane, OPD tree).
5. **Integración con pie menu radial** y contextos de edición (halo durante selección de cosa).
6. **Pedagogía progresiva** — diferencial del producto como herramienta de aprendizaje OPM.

La prioridad predominante es **C** (Could-have) porque el tutorial es complemento
pedagógico, no primitiva del modelado. Algunas HU de activación básica pueden
escalar a **S** si se prioriza el onboarding del modelador novato. Las HU que
habilitan first-time user experience se marcan como candidatas a MVP-γ.

La spec fuente declara cobertura incremental explícita: `we added animated gif to as
many as we can buttons`, `we are planning of course to add more and more`. Esto invita
a un diseño **extensible**: catálogo de controles con asset opcional, no lista cerrada.

## Tabla de HU de la épica

| ID | Título | Actor | Prioridad | Tamaño | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-91.001 | Activar Tutorial Mode desde OPCloud Settings | PD | S | S | opcloud-ui | — |
| HU-91.002 | Desactivar Tutorial Mode con selector Show/Hide | ME | S | XS | opcloud-ui | — |
| HU-91.003 | Persistir preferencia Tutorial Mode entre sesiones | MN | S | S | opcloud-ui | — |
| HU-91.004 | Ver tooltip textual con nombre canónico del control en hover | MN | S | S | opcloud-ui | — |
| HU-91.005 | Ver thumbnail animado con mini-OPD en hover sostenido | MN | C | M | opcloud-ui | — |
| HU-91.006 | Tutorial Mode sobre secondary toolbar completa | MN | C | M | opcloud-ui | — |
| HU-91.007 | Tutorial Mode sobre pie menu radial (halo) | MN | C | S | opcloud-ui | — |
| HU-91.008 | Tutorial Mode sobre Draggable OPM Things del left pane | MN | C | S | opcloud-ui | — |
| HU-91.009 | Tutorial Mode sobre nodos del OPD tree | MN | C | S | opcloud-ui | — |
| HU-91.010 | Inhibir overlays tutoriales durante gestos activos | ME | C | S | opcloud-ui | — |
| HU-91.011 | Excluir overlays tutoriales de exportaciones PDF/SVG | RV | C | S | opcloud-ui | — |
| HU-91.012 | Activar Tutorial Mode por defecto en first-time user | PD | S | S | opcloud-ui | — |
| HU-91.013 | Mostrar catálogo extensible de controles tutoriales | AO | C | M | opcloud-ui | — |
| HU-91.014 | Acceder a Tutorial Mode desde menú Help | MN | C | XS | opcloud-ui | — |
| HU-91.015 | Mantener tutorial accesible sin interrumpir modelado | ME | C | S | opcloud-ui | — |
| HU-91.016 | Re-ejecutar tutorial guiado bajo demanda | PD | C | M | opcloud-ui | — |

Total: **16 historias de usuario** (0 opm-semantica, 16 opcloud-ui, 0 mixto).

## Historias de usuario

### HU-91.001 — Activar Tutorial Mode desde OPCloud Settings

**Actor primario:** PD (facilitador pedagógico).
**Actores secundarios:** MN (modelador novato — beneficiario directo).
**Tipo:** opcloud-ui.
**Nivel categórico:** C (config) primario; U (UI) secundario.
**Superficie UI:** modal `OPCloud Settings` > panel `User Management` > página `OPCloud Settings` > fila `Tutorial Mode`.
**Gesto canónico:** navegación a settings + selección `Show` en el dropdown.

**Historia:**
> Como facilitador pedagógico, quiero activar Tutorial Mode desde las preferencias del usuario para que los modeladores novatos reciban ayuda inline al explorar la UI del modelador.

**Contexto de negocio:**
El Tutorial Mode es el canal pedagógico principal del modelador para usuarios nuevos. Exponerlo como preferencia de usuario (no de modelo ni de organización) alinea el control con quien más lo usa: el aprendiz. Centralizarlo en `OPCloud Settings` evita dispersión de controles.

**Criterios de aceptación:**
- **Dado** que abro el menú principal, **cuando** navego a `Settings` > `User Management` > `OPCloud Settings`, **entonces** veo la fila `Tutorial Mode` con el selector actual.
- **Dado** que el selector muestra `Hide`, **cuando** lo despliego y elijo `Show`, **entonces** la preferencia queda en `Show` y se cierra el dropdown.
- **Dado** que activé `Show`, **cuando** vuelvo al canvas sin recargar, **entonces** los overlays tutoriales están disponibles inmediatamente al hacer hover sobre controles.
- **Dado** que activé `Show`, **cuando** recargo la página, **entonces** la preferencia persiste (ver HU-91.003).

**Reglas y restricciones:**
- Selector con dos valores únicamente: `Show` y `Hide` (no hay granularidad por zona).
- La activación afecta toda la sesión del usuario, no solo el modelo actual.
- Ámbito: preferencia de usuario individual. No se observa override por organización.
- Default al entrar por primera vez a `OPCloud Settings`: `Show`.

**Modelo de datos tocado:**
- `user.settings.tutorialMode` — `"show" | "hide"` — persistente.

**Dependencias:**
- Bloquea a: HU-91.004, HU-91.005, HU-91.006, HU-91.007, HU-91.008, HU-91.009.
- Relaciona: EPICA-80 (config-user-org) — comparte modal `OPCloud Settings`.

**Integraciones:**
- Módulo de settings de usuario.
- Renderer de overlays (consulta preferencia antes de mostrar).

**Notas de evidencia:**
- Fuente OPCloud: `opcloud-reverse/91-interaccion-tutorial.md` §3.1, §5.1.
- Frames: frame_00011.
- Transcripción: "go to OPCloud settings and turn off the tutorial mode".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S (habilita el canal pedagógico; no es primitiva OPM pero es diferencial).
**Tamaño:** S.
**Etiquetas:** [ui, config, tutorial, settings, preferencia, user-settings].

---

### HU-91.002 — Desactivar Tutorial Mode con selector Show/Hide

**Actor primario:** ME (modelador experto).
**Tipo:** opcloud-ui.
**Nivel categórico:** C primario; U secundario.
**Superficie UI:** modal `OPCloud Settings` > fila `Tutorial Mode`.
**Gesto canónico:** selección `Hide` en el dropdown.

**Historia:**
> Como modelador experto, quiero desactivar Tutorial Mode para que los overlays no interfieran con mi flujo rápido una vez que ya conozco los controles.

**Contexto de negocio:**
El experto no necesita ayuda inline y los overlays son ruido visual. Ofrecer un `Hide` explícito respeta al usuario avanzado y evita que el producto se sienta intrusivo. La simetría `Show`/`Hide` es la afordance canónica de OPCloud para preferencias binarias.

**Criterios de aceptación:**
- **Dado** que Tutorial Mode está en `Show`, **cuando** abro `OPCloud Settings` y cambio el selector a `Hide`, **entonces** los thumbnails animados dejan de aparecer al hacer hover.
- **Dado** que desactivé, **cuando** hago hover sobre un botón, **entonces** aparece solo el tooltip textual básico del sistema (nombre corto), sin mini-OPD.
- **Dado** que desactivé y recargo, **cuando** vuelvo al canvas, **entonces** `Hide` persiste y los overlays no aparecen.

**Reglas y restricciones:**
- `Hide` preserva el tooltip textual básico del sistema (nombre del control); solo oculta el thumbnail animado.
- La acción es instantánea; no requiere confirmación ni recarga.
- No afecta a otros usuarios ni a la preferencia default del espacio.

**Modelo de datos tocado:**
- `user.settings.tutorialMode` — `"hide"` — persistente.

**Dependencias:**
- Bloqueada por: HU-91.001.

**Integraciones:**
- Módulo de settings de usuario.

**Notas de evidencia:**
- Fuente OPCloud: §3.1, §4.1, §5.1.
- Transcripción: "turn off the tutorial mode".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [ui, config, tutorial, settings, toggle, hide].

---

### HU-91.003 — Persistir preferencia Tutorial Mode entre sesiones

**Actor primario:** MN (modelador novato).
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** P (persistencia) primario; C (config) secundario.
**Superficie UI:** ninguna (persistencia transparente).
**Gesto canónico:** ninguno (efecto automático al cambiar la preferencia).

**Historia:**
> Como modelador, quiero que mi preferencia de Tutorial Mode persista entre sesiones para no tener que reconfigurarla cada vez que abro el modelador.

**Contexto de negocio:**
Una preferencia que no persiste es peor que ninguna — genera fricción repetida. La persistencia convierte el setting en un acuerdo de una sola vez entre el usuario y el producto.

**Criterios de aceptación:**
- **Dado** que cambié Tutorial Mode a `Hide` en una sesión, **cuando** cierro la pestaña y vuelvo a abrir el modelador, **entonces** la preferencia sigue en `Hide`.
- **Dado** que estoy en el mismo navegador, **cuando** abro el modelador en otra pestaña, **entonces** la preferencia se comparte (no es per-tab).
- **Dado** que cambio de navegador o dispositivo, **cuando** inicio sesión con mi usuario, **entonces** la preferencia me sigue (sync server-side) — o bien queda en `default` si no hay backend de usuario (degradación aceptable).

**Reglas y restricciones:**
- Almacenamiento: IndexedDB o LocalStorage local; sincronización server-side es deseable pero no estrictamente requerida para MVP.
- Clave: `user.settings.tutorialMode`.
- Valor por defecto si no hay preferencia guardada: `Show` (ver HU-91.012).

**Modelo de datos tocado:**
- `user.settings.tutorialMode` — string enum — persistente.

**Dependencias:**
- Bloqueada por: HU-91.001.
- Relaciona: EPICA-80 (config-user-org) — patrón general de persistencia de preferencias.

**Integraciones:**
- `src/persistencia/` (módulo de settings de usuario).

**Notas de evidencia:**
- Fuente OPCloud: §3.1 paso 5 ("persiste para sesiones siguientes del mismo usuario"), §5.1.
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [persistencia, config, tutorial, user-settings].

---

### HU-91.004 — Ver tooltip textual con nombre canónico del control en hover

**Actor primario:** MN (modelador novato).
**Tipo:** opcloud-ui.
**Nivel categórico:** U (UI).
**Superficie UI:** tooltip flotante anclado al control bajo hover.
**Gesto canónico:** hover del puntero sobre un botón.

**Historia:**
> Como modelador novato, quiero ver el nombre canónico del control (p.ej. `Navigator`, `In-Zoom`, `De-Magnify`) al pasar el puntero sobre un botón para identificar rápidamente qué hace cada ícono.

**Contexto de negocio:**
Los iconos sin texto son opacos al usuario nuevo. El tooltip textual es la primera capa de ayuda — ligera, inmediata y universalmente reconocible. Es también la base sobre la que el thumbnail animado (HU-91.005) añade profundidad.

**Criterios de aceptación:**
- **Dado** que Tutorial Mode está en `Show` y hago hover sobre un botón del secondary toolbar, **cuando** el puntero queda estático sobre el botón, **entonces** aparece una caja rectangular blanca redondeada con sombra abajo-derecha mostrando el nombre canónico del control (p.ej. `Navigator`).
- **Dado** que el tooltip está visible, **cuando** retiro el puntero, **entonces** el tooltip desaparece.
- **Dado** que Tutorial Mode está en `Hide`, **cuando** hago hover, **entonces** aparece solo el tooltip textual básico del sistema (puede ser idéntico o más sobrio).
- **Dado** que hago hover sobre un icono del halo, **cuando** el puntero queda estático, **entonces** también aparece el tooltip con el nombre de la acción (`In-Zoom`, `Unfold`, etc.).

**Reglas y restricciones:**
- Nombres en inglés y en Title Case (`Navigator`, `In-Zoom`, `De-Magnify`, `Unfold`) — consistentes con la documentación oficial OPCloud.
- Caja visual: blanco redondeado, borde sutil, sombra suave abajo-derecha.
- **Cuidado visual**: la sombra abajo-derecha del tooltip comparte convención morfológica con la sombra que codifica esencia física OPM — debe distinguirse claramente (por tamaño, contraste o tipografía) para no confundir.
- Aparición: hover casi inmediato (<200ms estimado).

**Modelo de datos tocado:**
- `control.name` — string — estático (catálogo, no modelo OPM).

**Dependencias:**
- Bloqueada por: HU-91.001.

**Integraciones:**
- Catálogo de controles del modelador.
- Renderer de overlays tutoriales.

**Notas de evidencia:**
- Fuente OPCloud: §2 (tabla superficies UI), §9 (convenciones).
- Frames: frame_00004 (`Navigator`), frame_00006 (`De-Magnify`), frame_00008 (`In-Zoom`).
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [ui, tutorial, tooltip, hover, halo, pedagógico].

---

### HU-91.005 — Ver thumbnail animado con mini-OPD en hover sostenido

**Actor primario:** MN (modelador novato).
**Actores secundarios:** PD (facilitador pedagógico).
**Tipo:** opcloud-ui.
**Nivel categórico:** U (UI).
**Superficie UI:** thumbnail flotante anclado al control bajo hover prolongado.
**Gesto canónico:** hover sostenido (<1s estimado) sobre un botón con tutorial.

**Historia:**
> Como modelador novato, quiero ver un mini-OPD animado que ilustre el efecto del control cuando mantengo el puntero sobre un botón para entender su semántica sin tener que probarlo primero.

**Contexto de negocio:**
Los mini-OPDs animados son el diferencial pedagógico del Tutorial Mode: un GIF corto con un diagrama sintético (`A Processing`, `Object 1`...`Object 4`) que muestra el antes y el después de aplicar el control. Traduce la acción visual a algo comprensible sin necesidad de haber modelado nada todavía. Es coherente con la filosofía OPM de que el diagrama enseña.

**Criterios de aceptación:**
- **Dado** que Tutorial Mode está en `Show` y mantengo hover >1s sobre un botón con thumbnail registrado, **cuando** transcurre el tiempo, **entonces** aparece una caja blanca más grande que el tooltip con un mini-OPD dentro (imagen o GIF animado).
- **Dado** que el botón no tiene thumbnail registrado en el catálogo, **cuando** mantengo hover prolongado, **entonces** aparece solo el tooltip textual; no aparece thumbnail.
- **Dado** que el thumbnail está visible, **cuando** muevo el puntero a otro botón, **entonces** el thumbnail actual desaparece y puede aparecer el del nuevo botón (tras el hover sostenido).
- **Dado** que el thumbnail muestra un mini-OPD, **cuando** lo observo, **entonces** los elementos son sintéticos (`A Processing`, `Object 1`...`Object 4`) y NO corresponden al modelo activo del canvas.

**Reglas y restricciones:**
- Timing: hover sostenido <1s estimado (no cronometrado en la fuente — inferido).
- Los mini-OPDs son assets estáticos o GIFs embebidos del catálogo, no se generan desde el modelo activo.
- Caja visual: blanco redondeado, sombra, tamaño mayor al tooltip textual.
- Cobertura incremental: no todos los botones tienen thumbnail — el narrador declara `we added animated gif to as many as we can buttons` y `we are planning of course to add more and more`.
- Degradación graciosa: si el asset no carga (modo offline), mostrar solo el tooltip textual.

**Modelo de datos tocado:**
- `control.tutorialAsset` — string (referencia a recurso) — opcional, estático.

**Dependencias:**
- Bloqueada por: HU-91.001, HU-91.004.
- Relaciona: HU-91.013 (catálogo extensible).

**Integraciones:**
- Asset storage (embebido o remoto — ver pregunta abierta Q91.2).
- Renderer de overlays.

**Notas de evidencia:**
- Fuente OPCloud: §2, §5.2, §5.3, §6 (modelo implícito).
- Frames: frame_00005 (thumbnail de `Navigator`), frame_00007 (`In-Zoom`), frame_00009 (left pane con `Object 1`..`Object 4`).
- Transcripción: "we added animated gif to as many as we can buttons".
- Clase de afirmación: observado + confirmado por transcripción.

**Prioridad:** C.
**Tamaño:** M.
**Etiquetas:** [ui, tutorial, thumbnail, animación, hover-sostenido, pedagógico, asset].

---

### HU-91.006 — Tutorial Mode sobre secondary toolbar completa

**Actor primario:** MN (modelador novato).
**Tipo:** opcloud-ui.
**Nivel categórico:** U (UI).
**Superficie UI:** secondary toolbar (banda horizontal sobre el canvas).
**Gesto canónico:** hover sobre cada botón de la toolbar.

**Historia:**
> Como modelador novato, quiero que todos los botones de la secondary toolbar tengan tooltip y thumbnail en Tutorial Mode para descubrir la funcionalidad completa de la barra de contexto del canvas.

**Contexto de negocio:**
La secondary toolbar concentra las acciones más frecuentes sobre el OPD activo (Navigator, Magnify, De-Magnify, In-Zoom, etc.). Cubrirla completamente en el tutorial es la inversión pedagógica de mayor retorno — es el primer lugar donde el usuario mira cuando no sabe qué hacer.

**Criterios de aceptación:**
- **Dado** que Tutorial Mode está en `Show`, **cuando** hago hover sobre cualquier botón de la secondary toolbar, **entonces** aparece el tooltip textual con el nombre canónico.
- **Dado** que Tutorial Mode está en `Show` y mantengo hover sostenido sobre un botón cubierto, **cuando** transcurre el tiempo, **entonces** aparece el thumbnail animado correspondiente.
- **Dado** que un botón específico no tiene thumbnail registrado todavía, **cuando** hago hover sostenido, **entonces** aparece solo el tooltip — sin error ni caja vacía.
- **Dado** que cambio el foco del canvas a otro OPD, **cuando** la toolbar permanece visible, **entonces** los overlays siguen funcionando normalmente.

**Reglas y restricciones:**
- Cobertura **debe** incluir: `Navigator`, `Magnify`, `De-Magnify`, `In-Zoom`, `Unfold` — observados en frames.
- Cobertura declarada incremental: agregar thumbnails conforme se producen los assets.
- No hay override por botón: la preferencia es global.

**Modelo de datos tocado:**
- Ninguno (consulta al catálogo de controles, que es estático).

**Dependencias:**
- Bloqueada por: HU-91.001, HU-91.004, HU-91.005.

**Integraciones:**
- Secondary toolbar (render + data-action hooks).
- Catálogo de controles.

**Notas de evidencia:**
- Fuente OPCloud: §2 (tabla), §3.2, §5.2 tabla.
- Frames: frame_00001 (estado base), frame_00004, frame_00005, frame_00006, frame_00007.
- Transcripción: "this is true both for the secondary toolbar and also to the halo".
- Clase de afirmación: observado + confirmado por transcripción.

**Prioridad:** C.
**Tamaño:** M.
**Etiquetas:** [ui, tutorial, secondary-toolbar, cobertura, incremental].

---

### HU-91.007 — Tutorial Mode sobre pie menu radial (halo)

**Actor primario:** MN (modelador novato).
**Tipo:** opcloud-ui.
**Nivel categórico:** U (UI).
**Superficie UI:** halo / menu radial contextual sobre cosa seleccionada.
**Gesto canónico:** clic sobre cosa + hover sobre icono del halo.

**Historia:**
> Como modelador novato, quiero que los iconos del pie menu radial tengan tooltip y thumbnail al hacer hover para aprender el menú contextual mientras modelo.

**Contexto de negocio:**
El halo es afordance de proximidad (HU-10.019 en EPICA-10) y concentra las acciones frecuentes junto al cursor. Si el halo no tiene ayuda inline, el usuario novato lo ignorará y seguirá viajando a la toolbar. El tutorial sobre halo cierra esta brecha pedagógica y fomenta el modelado fluido.

**Criterios de aceptación:**
- **Dado** que tengo una cosa seleccionada y el halo está visible, **cuando** hago hover sobre un icono del halo (p.ej. lupa), **entonces** aparece el tooltip con el nombre (`In-Zoom` para proceso, `Unfold` para objeto).
- **Dado** que mantengo hover sostenido sobre un icono con thumbnail registrado, **cuando** transcurre el tiempo, **entonces** aparece el thumbnail animado.
- **Dado** que el halo oclude una decoración de la cosa (sombra de essence física, estados adyacentes), **cuando** hago hover sobre icono del halo, **entonces** el tooltip no agrava la oclusión — se posiciona lejos del halo o se muestra con opacidad adecuada.
- **Dado** que selecciono un Object, **cuando** el halo muestra icono de `Unfold`, **entonces** el tooltip dice `Unfold` (no `In-Zoom`) — consistente con el tipo.
- **Dado** que selecciono un Process, **cuando** el halo muestra icono de lupa, **entonces** el tooltip dice `In-Zoom`.

**Reglas y restricciones:**
- Cobertura parcial declarada en la fuente (`thumbnail animado: parcial observado para algunos iconos`).
- Los iconos del halo varían según el tipo de cosa (Object vs Process) — los tooltips deben respetar esa variación.
- No se observa que los overlays del halo interfieran con el clic en el icono (el overlay no roba el evento).

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-91.001, HU-91.004, HU-91.005, HU-10.019 (halo básico existente).

**Integraciones:**
- Halo JointJS (`joint-halo pie type-element`).
- Catálogo de controles para iconos del halo.

**Notas de evidencia:**
- Fuente OPCloud: §2 tabla, §3.3, §5.2 tabla.
- Frames: frame_00008 (halo sobre `Driver Rescuing` con tooltip `In-Zoom` visible).
- Transcripción: "if we select an object you are able to see that we have in zoom option and if we select the process we can also see the unfold this is true both for the secondary toolbar and also to the halo".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** C.
**Tamaño:** S.
**Etiquetas:** [ui, tutorial, halo, pie-menu, contextual, hover].

---

### HU-91.008 — Tutorial Mode sobre Draggable OPM Things del left pane

**Actor primario:** MN (modelador novato).
**Tipo:** opcloud-ui.
**Nivel categórico:** U (UI).
**Superficie UI:** panel lateral `Draggable OPM Things`.
**Gesto canónico:** hover sobre item de la biblioteca.

**Historia:**
> Como modelador novato, quiero que los items de la biblioteca `Draggable OPM Things` tengan tooltip explicando cómo arrastrar cosas al canvas para aprender el gesto canónico de creación.

**Contexto de negocio:**
El drag-from-library es un gesto no obvio para quien nunca modeló OPM. Muchos usuarios novatos hacen clic esperando creación por clic, cuando en realidad deben arrastrar. El tutorial en el left pane desbloquea esa fricción inicial.

**Criterios de aceptación:**
- **Dado** que Tutorial Mode está en `Show`, **cuando** hago hover sobre un item del panel `Draggable OPM Things`, **entonces** aparece un tooltip con el nombre de la cosa (p.ej. `Process`) y un texto breve explicando el gesto (`Drag to canvas to create`).
- **Dado** que mantengo hover sostenido sobre el item, **cuando** transcurre el tiempo, **entonces** puede aparecer thumbnail animado mostrando el drag (parcial según cobertura).
- **Dado** que empiezo el drag de un item, **cuando** el drag está activo, **entonces** el tooltip se oculta (inhibición por gesto activo — ver HU-91.010).

**Reglas y restricciones:**
- Cobertura parcial declarada.
- El tooltip no debe bloquear el drag — debe desaparecer al iniciar mousedown sobre el item.

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-91.001, HU-91.004.
- Relaciona: HU-91.010 (inhibición durante drag).

**Integraciones:**
- Panel `Draggable OPM Things` (left pane).

**Notas de evidencia:**
- Fuente OPCloud: §2 tabla, §3.4.
- Frames: frame_00009 (thumbnail de mini-OPD con `Object 1`..`Object 4` junto al left pane).
- Transcripción: "we also have the option in the left pane where we hover on top of the things and you can see how things are done".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** C.
**Tamaño:** S.
**Etiquetas:** [ui, tutorial, left-pane, biblioteca-lateral, drag].

---

### HU-91.009 — Tutorial Mode sobre nodos del OPD tree

**Actor primario:** MN (modelador novato).
**Tipo:** opcloud-ui.
**Nivel categórico:** U (UI).
**Superficie UI:** OPD tree del left pane (bloques `SD`, `SD1`, ...).
**Gesto canónico:** hover sobre nodo del árbol.

**Historia:**
> Como modelador novato, quiero que al hacer hover sobre un nodo del OPD tree (p.ej. `SD`, `SD1`) aparezca un tooltip explicando cómo operar el menú del OPD tree.

**Contexto de negocio:**
El OPD tree es la navegación jerárquica del modelo. Sus nodos tienen menú contextual con operaciones no obvias (rename, duplicate, delete, set as root). Sin ayuda inline, el usuario novato puede no descubrirlo. El tutorial convierte el árbol en un espacio auto-explicado.

**Criterios de aceptación:**
- **Dado** que Tutorial Mode está en `Show`, **cuando** hago hover sobre un nodo del OPD tree, **entonces** aparece tooltip con el nombre del nodo y una explicación breve de cómo acceder al menú.
- **Dado** que el nodo es `SD` (root OPD), **cuando** hago hover, **entonces** el tooltip describe operaciones específicas del nodo raíz.
- **Dado** que el nodo es `SDx` (OPD hijo), **cuando** hago hover, **entonces** el tooltip describe operaciones de OPDs descendientes.

**Reglas y restricciones:**
- Cobertura parcial (declarada en la fuente).
- El tooltip no debe interferir con el clic que abre el menú contextual.

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-91.001, HU-91.004.
- Relaciona: EPICA-20 (estructura-opd-tree).

**Integraciones:**
- OPD tree (left pane).

**Notas de evidencia:**
- Fuente OPCloud: §2 tabla, §3.4.
- Transcripción: "if you're standing on the opd3 you will see an option on how to use the opd3 menu".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** C.
**Tamaño:** S.
**Etiquetas:** [ui, tutorial, opd-tree, left-pane, navegación].

---

### HU-91.010 — Inhibir overlays tutoriales durante gestos activos

**Actor primario:** ME (modelador experto).
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** U (UI).
**Superficie UI:** toda superficie con tutorial.
**Gesto canónico:** ninguno (comportamiento pasivo durante interacción activa).

**Historia:**
> Como modelador, quiero que los overlays tutoriales desaparezcan automáticamente mientras estoy haciendo drag, dibujando un link o editando texto in-place para que no ocluyan la operación en curso.

**Contexto de negocio:**
Un overlay que aparece durante drag arruina la interacción. La inhibición es una regla de cortesía de UI: el tutorial es secundario al gesto activo. Respetar este principio es crítico para que el modo no sea molesto.

**Criterios de aceptación:**
- **Dado** que Tutorial Mode está en `Show` y hay un tooltip visible, **cuando** empiezo un drag (mousedown + move), **entonces** el tooltip desaparece inmediatamente.
- **Dado** que hago hover sobre un botón durante un drag activo, **cuando** el puntero queda sobre el botón, **entonces** no aparece tooltip ni thumbnail (inhibidos mientras dure el gesto).
- **Dado** que estoy dibujando un link (drag desde borde de shape), **cuando** paso sobre otros elementos, **entonces** no aparecen overlays tutoriales sobre esos elementos.
- **Dado** que estoy en edición in-place de texto (doble clic para renombrar), **cuando** el input está activo, **entonces** no aparecen overlays.
- **Dado** que termina el gesto activo, **cuando** vuelvo a hacer hover, **entonces** los overlays vuelven a funcionar normalmente.

**Reglas y restricciones:**
- Inhibición durante: drag de shape, drag de creación desde biblioteca, dibujo de link, edición in-place de texto, apertura de modales.
- La inhibición NO requiere input del usuario — es automática.
- El mecanismo exacto (z-index del puntero vs inhibición explícita) es **hipótesis inferida** — pregunta abierta Q91.4.

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-91.001, HU-91.004.

**Integraciones:**
- Sistema de overlays (debe escuchar eventos de gesto global).

**Notas de evidencia:**
- Fuente OPCloud: §4.3.
- Clase de afirmación: hipótesis inferida.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamaño:** S.
**Etiquetas:** [ui, tutorial, inhibición, drag, edición, requires-clarification].

---

### HU-91.011 — Excluir overlays tutoriales de exportaciones PDF/SVG

**Actor primario:** RV (revisor / lector).
**Actores secundarios:** PD.
**Tipo:** opcloud-ui.
**Nivel categórico:** X (integración externa) primario; U secundario.
**Superficie UI:** pipeline de export (ver EPICA-60, EPICA-61).
**Gesto canónico:** ninguno (filtro automático en export).

**Historia:**
> Como revisor, quiero que los overlays tutoriales no aparezcan en los PDFs o SVGs exportados del modelo para que el entregable sea limpio y profesional.

**Contexto de negocio:**
Un export con tooltip pegado sería defectuoso. Los exports deben representar el modelo, no el estado transitorio de la UI. Este filtro es un invariante implícito: overlays son UI circundante, no parte del OPD.

**Criterios de aceptación:**
- **Dado** que Tutorial Mode está en `Show` y hay un thumbnail visible sobre un botón, **cuando** exporto a PDF, **entonces** el PDF resultante NO contiene el thumbnail ni el tooltip.
- **Dado** que Tutorial Mode está en `Show`, **cuando** exporto a SVG, **entonces** el SVG resultante contiene solo el OPD (sin overlays tutoriales).
- **Dado** que el pipeline de export renderiza canvas limpio (sin UI circundante), **cuando** el PDF se genera, **entonces** el filtrado es automático y no requiere desactivar el tutorial previamente.

**Reglas y restricciones:**
- Hipótesis inferida: los exports de OPCloud renderizan canvas limpio, no la UI circundante, por lo que los overlays no contaminan el PDF/SVG de forma nativa.
- Confirmación explícita pendiente — pregunta abierta Q91.3.
- Si se descubre que el export sí captura overlays, añadir filtro explícito en el pipeline.

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Relaciona: EPICA-60 (export-pdf), EPICA-61 (export-svg).

**Integraciones:**
- Pipeline de export.

**Notas de evidencia:**
- Fuente OPCloud: §4.4, §7.4.
- Clase de afirmación: hipótesis inferida.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamaño:** S.
**Etiquetas:** [ui, tutorial, export, limpieza, pdf, svg, requires-clarification].

---

### HU-91.012 — Activar Tutorial Mode por defecto en first-time user

**Actor primario:** PD (facilitador pedagógico).
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** C (config) primario; U (UI) secundario.
**Superficie UI:** ninguna (aplicación de default al primer arranque).
**Gesto canónico:** ninguno.

**Historia:**
> Como facilitador pedagógico, quiero que el Tutorial Mode esté activado por defecto para usuarios nuevos que nunca han configurado la preferencia para que reciban ayuda inline sin tener que descubrir el setting primero.

**Contexto de negocio:**
Los defaults comunican intención del producto. Activar el tutorial por defecto señala que el producto está diseñado para acompañar al novato; el experto puede desactivarlo explícitamente cuando decida. Es la opción menos hostil al onboarding.

**Criterios de aceptación:**
- **Dado** que soy un usuario nuevo sin preferencia guardada, **cuando** abro el modelador por primera vez, **entonces** Tutorial Mode está en `Show` por default.
- **Dado** que es mi primer arranque y hago hover sobre un botón, **cuando** el puntero queda estático, **entonces** aparecen los overlays tutoriales (sin haber tenido que configurarlos).
- **Dado** que cambio explícitamente la preferencia a `Hide`, **cuando** vuelvo a abrir el modelador, **entonces** la preferencia persiste en `Hide` (ver HU-91.003).
- **Dado** que es mi primera sesión, **cuando** reviso `OPCloud Settings`, **entonces** el selector muestra `Show` (reflejo del default efectivo).

**Reglas y restricciones:**
- Default observado en la fuente: `Show` al entrar por primera vez a `OPCloud Settings` (§5.1).
- El default aplica solo si no hay preferencia persistida — una vez fijada, respeta la elección del usuario.

**Modelo de datos tocado:**
- `user.settings.tutorialMode` — `"show"` (default implícito si no hay valor) — persistente una vez fijado.

**Dependencias:**
- Bloqueada por: HU-91.001, HU-91.003.

**Integraciones:**
- Módulo de settings de usuario (lógica de default).

**Notas de evidencia:**
- Fuente OPCloud: §5.1 ("Default observado al entrar a `OPCloud Settings`: `Show`").
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [ui, tutorial, onboarding, first-run, default, pedagógico].

---

### HU-91.013 — Mostrar catálogo extensible de controles tutoriales

**Actor primario:** AO (admin de organización — mantenedor del catálogo).
**Actores secundarios:** PD.
**Tipo:** opcloud-ui.
**Nivel categórico:** C (config) primario; U secundario.
**Superficie UI:** ninguna (catálogo interno del producto).
**Gesto canónico:** ninguno.

**Historia:**
> Como admin del producto, quiero un catálogo extensible de controles con tooltip y asset opcional para poder agregar nuevos tutoriales progresivamente sin cambiar el código del modelador.

**Contexto de negocio:**
La spec declara cobertura incremental explícita (`we are planning of course to add more and more`). Un catálogo estructurado (no cableado en código) permite agregar thumbnails sin tocar lógica de UI. Es el habilitador arquitectónico de la cobertura incremental.

**Criterios de aceptación:**
- **Dado** que el producto tiene un catálogo de controles, **cuando** consulto su estructura, **entonces** cada entrada tiene al menos `control.id`, `control.name` (tooltip textual) y `control.tutorialAsset?` (asset opcional).
- **Dado** que un control nuevo se agrega al catálogo con tooltip pero sin asset, **cuando** el usuario hace hover sostenido, **entonces** aparece solo el tooltip — sin error ni caja vacía.
- **Dado** que se agrega un asset a un control existente, **cuando** el catálogo se recarga, **entonces** el thumbnail aparece en el próximo hover sostenido.
- **Dado** que el catálogo incluye controles de secondary toolbar, halo, left pane y OPD tree, **cuando** se consulta, **entonces** cada zona tiene su subconjunto identificable.

**Reglas y restricciones:**
- Catálogo estático en build time — no se edita en runtime por el usuario final.
- El asset puede ser URL relativa (asset local) o remota — pregunta abierta Q91.2.
- Nombres en inglés y Title Case por convención.
- Internacionalización de nombres pendiente — pregunta abierta Q91.6.

**Modelo de datos tocado:**
- `control.id` — string — estático.
- `control.name` — string (Title Case) — estático.
- `control.tutorialAsset?` — string (URL/ref) — estático, opcional.
- `control.zone` — `"secondary-toolbar" | "halo" | "left-pane" | "opd-tree"` — estático.

**Dependencias:**
- Bloquea a: HU-91.004, HU-91.005, HU-91.006, HU-91.007, HU-91.008, HU-91.009.

**Integraciones:**
- Sistema de overlays (consume el catálogo).
- Asset storage.

**Notas de evidencia:**
- Fuente OPCloud: §5.2 tabla, §6 (modelo implícito).
- Transcripción: "we added animated gif to as many as we can buttons", "we are planning of course to add more and more".
- Clase de afirmación: inferido.

**Prioridad:** C.
**Tamaño:** M.
**Etiquetas:** [ui, tutorial, catálogo, extensibilidad, arquitectura].

---

### HU-91.014 — Acceder a Tutorial Mode desde menú Help

**Actor primario:** MN (modelador novato).
**Tipo:** opcloud-ui.
**Nivel categórico:** U (UI).
**Superficie UI:** menú Help / ayuda (si existe en el modelador).
**Gesto canónico:** clic en entrada del menú Help.

**Historia:**
> Como modelador novato, quiero acceder al setting de Tutorial Mode desde un menú Help visible en la UI principal para no tener que buscar en `OPCloud Settings` cuando quiero activarlo o desactivarlo.

**Contexto de negocio:**
`OPCloud Settings` es un modal denso con muchas preferencias. Un acceso directo desde Help reduce la fricción para toggles rápidos y alinea la ubicación conceptual del control con su función (ayudar).

**Criterios de aceptación:**
- **Dado** que existe un menú `Help` en la UI principal del modelador, **cuando** lo abro, **entonces** veo una entrada para `Tutorial Mode` con indicador del estado actual (`On` / `Off`).
- **Dado** que la entrada Help muestra `Tutorial Mode: On`, **cuando** hago clic, **entonces** se alterna a `Off` y el indicador se actualiza.
- **Dado** que cambié el estado desde Help, **cuando** abro `OPCloud Settings`, **entonces** el selector refleja el mismo estado (fuente única de verdad).

**Reglas y restricciones:**
- La entrada en Help es **espejo** del setting, no una preferencia separada.
- Si no hay menú Help en el modelador, esta HU queda bloqueada — depende de la existencia del menú Help.
- Hipótesis inferida desde requerimientos del enunciado de la épica; NO se observa en frames la entrada Help específica para tutorial.

**Modelo de datos tocado:**
- Ninguno directo; toggle sobre `user.settings.tutorialMode`.

**Dependencias:**
- Bloqueada por: HU-91.001, HU-91.002.

**Integraciones:**
- Menú Help (si existe) — probable EPICA futura o integración con menú principal.

**Notas de evidencia:**
- Fuente OPCloud: no observado en frames; hipótesis derivada del enunciado de la épica para completar cobertura de accesos.
- Clase de afirmación: hipótesis.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamaño:** XS.
**Etiquetas:** [ui, tutorial, help, menu, acceso, requires-clarification].

---

### HU-91.015 — Mantener tutorial accesible sin interrumpir modelado

**Actor primario:** ME (modelador experto).
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** U (UI).
**Superficie UI:** todas las superficies con tutorial.
**Gesto canónico:** ninguno (propiedad transversal).

**Historia:**
> Como modelador, quiero que el Tutorial Mode coexista con mi modelado activo sin modales bloqueantes ni pasos forzados para poder consultarlo cuando lo necesito sin que me obstaculice.

**Contexto de negocio:**
El tutorial es **ayuda contextual**, no un wizard guiado. La diferencia es crítica: un wizard interrumpe el flujo; la ayuda contextual está disponible pero nunca se interpone. El producto respeta la agencia del modelador.

**Criterios de aceptación:**
- **Dado** que Tutorial Mode está en `Show`, **cuando** hago modelado normal (crear procesos, objetos, links), **entonces** la operación no se bloquea por overlays.
- **Dado** que el tutorial está activo, **cuando** el tooltip aparece, **entonces** no tiene botones de "siguiente paso" ni flujo secuencial — es purely hover-triggered.
- **Dado** que el tutorial está activo, **cuando** quiero ignorarlo, **entonces** basta con no hacer hover sostenido para que no aparezca nada visual.
- **Dado** que el tutorial no tiene pasos secuenciales, **cuando** exploro la UI, **entonces** puedo revisar los controles en cualquier orden.

**Reglas y restricciones:**
- Invariante clave: **no hay modal bloqueante** en Tutorial Mode.
- Invariante clave: **no hay pasos secuenciales** — es ayuda reactiva, no proactiva.
- La UX es "pull" (el usuario pide ayuda con hover), no "push" (el producto la empuja).

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-91.001, HU-91.004, HU-91.005.

**Integraciones:**
- Toda la UI del modelador.

**Notas de evidencia:**
- Fuente OPCloud: §1 (Propósito y alcance — "modo de ayuda inline"), §4.3.
- Clase de afirmación: inferido desde diseño observado.

**Prioridad:** C.
**Tamaño:** S.
**Etiquetas:** [ui, tutorial, no-modal, coexistencia, reactivo, invariante].

---

### HU-91.016 — Re-ejecutar tutorial guiado bajo demanda

**Actor primario:** PD (facilitador pedagógico).
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** U (UI).
**Superficie UI:** menú Help (si existe) o entry point dedicado.
**Gesto canónico:** clic en acción `Restart Tutorial` o equivalente.

**Historia:**
> Como facilitador pedagógico, quiero poder re-ejecutar el tutorial guiado bajo demanda para repasar la funcionalidad del modelador con un nuevo usuario o cuando se agreguen nuevos controles al catálogo.

**Contexto de negocio:**
Un tutorial que solo aparece en el primer arranque es pedagógicamente insuficiente: los usuarios vuelven a consultar, los facilitadores re-explican, el catálogo crece. La re-ejecución bajo demanda convierte el tutorial en recurso permanente.

**Criterios de aceptación:**
- **Dado** que existe una acción de re-ejecución de tutorial, **cuando** la invoco, **entonces** el sistema reactiva los overlays tutoriales (equivalente a setear `Tutorial Mode = Show`) o lanza un tour guiado explícito.
- **Dado** que ya activé el tutorial antes, **cuando** hago re-ejecución, **entonces** la acción sigue siendo válida (no es one-shot).
- **Dado** que se agregan nuevos controles al catálogo, **cuando** re-ejecuto el tutorial, **entonces** los nuevos controles también tienen overlays.

**Reglas y restricciones:**
- La semántica exacta ("reactivar overlays" vs "lanzar tour guiado secuencial") es **pregunta abierta** — no se observa tour guiado secuencial en la fuente, que describe el tutorial como hover-triggered.
- Si el modelador no implementa tour guiado secuencial, la re-ejecución se reduce a setear `Tutorial Mode = Show`.
- Esta HU es candidata a descomposición si se decide implementar un tour guiado explícito (con pasos 1/N, progreso, next/prev/skip) — en ese caso se descompone en HU-91.016a (re-activar overlays) + HU-91.016b (tour guiado secuencial) + HU-91.016c (progreso visible).

**Modelo de datos tocado:**
- `user.settings.tutorialMode` — toggle a `"show"` — persistente.
- Opcional si hay tour guiado: `user.tutorial.progress.step` — número — transitorio o persistente.

**Dependencias:**
- Bloqueada por: HU-91.001, HU-91.002.
- Relaciona: HU-91.014 (acceso desde Help).

**Integraciones:**
- Menú Help (si existe).
- Módulo de settings.

**Notas de evidencia:**
- Fuente OPCloud: no observado en frames; hipótesis derivada del enunciado de la épica para completar cobertura pedagógica (re-ejecución, pasos 1/N, checkpoints, next/prev/skip).
- Clase de afirmación: hipótesis.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamaño:** M (si se implementa tour guiado secuencial), XS (si se reduce a toggle).
**Etiquetas:** [ui, tutorial, re-ejecución, on-demand, tour-guiado, requires-clarification].

---

## Preguntas abiertas derivadas

- **Q91.1**: ¿Existe un override por modelo u organización que fuerce `Tutorial Mode = Hide` (p.ej. para entornos de demo o exportación)? No observado. Impacto: si se requiere, agregar HU-91.017 con jerarquía de preferencia (organización > usuario).
- **Q91.2**: ¿Los thumbnails animados son GIFs embebidos o se sirven desde assets remotos? Afecta modo offline y cache. Impacto en HU-91.005 y HU-91.013.
- **Q91.3**: ¿La exportación a PDF/SVG captura o no los overlays tutoriales cuando están visibles? Hipótesis: los exports renderizan canvas limpio, overlays no contaminan. Confirmación pendiente. Impacto en HU-91.011.
- **Q91.4**: ¿El tutorial se inhibe explícitamente durante gestos de edición (drag, draw link, in-place edit) o solo por z-index del puntero? Hipótesis: inhibición automática por eventos de gesto activo. Impacto en HU-91.010.
- **Q91.5**: ¿Hay tutorial para los modales grandes (Links Table, OPD Tree Management, Export dialogs) o la cobertura se limita a botones de toolbar/halo/left pane? No observado. Impacto: si se requiere extender cobertura, agregar HU futura.
- **Q91.6**: ¿Los nombres de controles tutorial están internacionalizados cuando la UI está en otro idioma? Impacto en HU-91.013 (catálogo) — decisión i18n.
- **Q91.7**: ¿Existe un tour guiado secuencial (pasos 1/N, progreso visible, next/prev/skip, checkpoints) o solo overlays hover-triggered? Relevante para HU-91.016. La fuente describe solo hover-triggered; el tour guiado sería extensión futura. Si se implementa, descomponer HU-91.016 en sub-HU con progreso explícito.
- **Q91.8**: ¿Hay tutoriales temáticos por funcionalidad (básico, in-zoom, links avanzados, simulación) o el tutorial es uniforme? No observado en la fuente, que describe Tutorial Mode como toggle global. Si se requieren tutoriales por tema, agregar HU futura con catálogo segmentado.

### Cobertura de aspectos solicitados del enunciado

El enunciado solicita cobertura explícita de varios aspectos. La siguiente tabla mapea cada aspecto solicitado con su HU y clase de afirmación:

| Aspecto solicitado | HU | Clase de afirmación |
|---|---|---|
| Activación Tutorial Mode | HU-91.001 | confirmado |
| Pasos guiados progresivos | HU-91.016 (hipótesis) | hipótesis / abierto |
| Highlights visuales contextuales | HU-91.004, HU-91.005 | observado |
| Tooltips informativos | HU-91.004 | observado |
| Navegación next/prev/skip | HU-91.016 (si se implementa tour guiado) | hipótesis / abierto |
| Progreso visible (pasos 1/N) | HU-91.016 (si se implementa tour guiado) | hipótesis / abierto |
| Checkpoints | HU-91.016 (si se implementa tour guiado) | hipótesis / abierto |
| Restaurar contexto al salir | HU-91.015 (coexistencia sin interrupción) | observado |
| Re-ejecutar tutorial | HU-91.016 | hipótesis |
| Tutoriales por tema | no cubierta (fuera de alcance observado — Q91.8) | abierto |
| Integración con Help menu | HU-91.014 | hipótesis |
| Tutorial para first-time user | HU-91.012 | observado |

Los aspectos marcados como "hipótesis / abierto" están fuera del alcance del comportamiento observado en la spec fuente (que describe Tutorial Mode como hover-triggered, no como wizard guiado). Para implementarlos se requerirá decisión de producto explícita — se reflejan como preguntas abiertas y HU con etiqueta `requires-clarification`.

## Referencias cruzadas

- Fuente normativa: el Tutorial Mode no deriva de la SSOT OPM — es capa pedagógica de OPCloud sin contraparte semántica en ISO 19450.
- Evidencia OPCloud: `JOYAS.md`, `sandbox-data/`, `assets/svg/`, `decompiled/`.
- Doc fuente original: `opcloud-reverse/91-interaccion-tutorial.md`.
- Épicas relacionadas:
  - **EPICA-80** (config-user-org): comparte modal `OPCloud Settings` y patrón de preferencias de usuario; HU-91.001 y HU-91.003 se alinean con el patrón general de la épica 80.
  - **EPICA-90** (interaccion-shortcuts): paralelismo con shortcuts como afordance alternativa para experto; no se observan shortcuts para Tutorial Mode (§8).
  - **EPICA-10** (canvas-creacion-cosas): HU-91.007 sobre halo depende de HU-10.019 (halo básico existente).
  - **EPICA-12** (canvas-inzooming): tooltips sobre `In-Zoom` (HU-91.004, HU-91.007) se refieren al control cuya semántica define EPICA-12.
  - **EPICA-20** (estructura-opd-tree): HU-91.009 se apoya en la estructura del árbol OPD.
  - **EPICA-60** (export-pdf), **EPICA-61** (export-svg): HU-91.011 depende del pipeline de export.
- Invariantes del repo:
  - `src/persistencia/` — almacenamiento de `user.settings.tutorialMode`.
  - `src/ui/` — módulo de overlays tutoriales (tooltips + thumbnails).
  - Catálogo de controles (nueva entidad del producto, no existe aún en el repo — ver HU-91.013).
- Invariantes de producto:
  - **Invariante 1**: Tutorial Mode NO altera el modelo OPM. Overlays flotan sobre la UI, no son parte del OPD, no se persisten con el modelo.
  - **Invariante 2**: Coexistencia sin modales bloqueantes (HU-91.015). La ayuda es reactiva, no proactiva.
  - **Invariante 3**: Cobertura incremental del catálogo. El producto tolera controles con tooltip pero sin thumbnail sin error.
