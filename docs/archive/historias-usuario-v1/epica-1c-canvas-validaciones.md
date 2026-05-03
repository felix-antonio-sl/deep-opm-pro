---
epica: "EPICA-1C"
titulo: "Canvas — validaciones (pertenencia interior/exterior, nombres duplicados, Methodology Checking, Choose Remove Operation)"
doc_fuente: "opcloud-reverse/1c-canvas-validaciones.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "M1"
hu_emitidas: 22
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "DIAGNOSTICO-PILOTO-EPICA-10.md"
ultima_actualizacion: 2026-04-23
---

## Resumen

Esta epica cubre la **capa de validacion interactiva** del modelador OPM sobre tres ejes que el doc fuente agrupa como feature `canvas-validaciones`:

1. **Pertenencia interior/exterior** en contextos de descomposicion (una cosa no puede existir simultaneamente como parte interna y externa del mismo refinamiento; arrastre hacia adentro no cambia `container_ref`).
2. **Coherencia nominal** con reuso de la misma entidad via `Use Existing Thing` (identidad logica compartida) versus duplicados nominales ambiguos.
3. **Methodology Checking** — panel de chequeo contra axiomas OPM con 5 categorias canonicas, navegacion a elementos invalidos y revalidacion on-demand.

Se agrega como cuarto eje el modal **`Choose Remove Operation`** (§10 del doc fuente), pieza clave del principio "entidad unica ↔ multiples apariencias": tres scopes de borrado (apariencia actual, todas las apariencias del OPD, modelo entero) con tabla `This Element Appears in:` y click-to-focus.

Las HU se numeran siguiendo la aparicion en el doc fuente, sin reordenar por prioridad. La mayoria cae en prioridad **M1** (must-have producto, usable sin esto pero frustrante) salvo la severidad/render que es **M0** por tocar el kernel de validacion.

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-1C.001 | Detectar solapamiento de cosa externa sobre contenedor con descomposicion | ME | M1 | M | opm-semantica | [V-1 §1.2] |
| HU-1C.002 | Expulsar con snap correctivo la cosa externa hacia afuera | ME | M1 | S | mixto | — |
| HU-1C.003 | Mostrar advertencia textual de interior/exterior en esquina superior | MN | M1 | S | opcloud-ui | — |
| HU-1C.004 | Crear cosa interna correcta directamente dentro del contenedor | MN | M0 | S | opm-semantica | [V-1] [Glos 3.23] |
| HU-1C.005 | Crear cosa interna arrastrando desde Draggable OPM Things | ME | M1 | S | opm-semantica | [V-1] |
| HU-1C.006 | Preservar externalidad al agrandar el contenedor sobre una cosa | ME | M1 | S | opm-semantica | [V-1 §1.2] |
| HU-1C.007 | Detectar colision nominal al crear o renombrar una cosa | MN | M0 | M | opm-semantica | [Glos 3.76] |
| HU-1C.008 | Abrir dialogo de nombre duplicado con lista de OPDs existentes | MN | M1 | M | opcloud-ui | — |
| HU-1C.009 | Reusar cosa existente con Use Existing Thing | ME | M1 | M | opm-semantica | [V-1] |
| HU-1C.010 | Renombrar la cosa actual para mantener nombres distintos | MN | M1 | S | opm-semantica | [Glos 3.76] |
| HU-1C.011 | Bloquear Use Existing Thing cuando tipo o refinamiento incompatibles | ME | M1 | S | opm-semantica | [V-239] [V-240] |
| HU-1C.012 | Serializar nombre por defecto ante colision de default | MN | M0 | S | opm-semantica | — |
| HU-1C.013 | Abrir panel Methodological Checking desde toolbar | MN | M1 | S | opcloud-ui | — |
| HU-1C.014 | Ejecutar 5 reglas metodologicas canonicas OPM | IA | M1 | L | opm-semantica | [V-239] [V-240] [Glos 3.39] [Glos 3.58] |
| HU-1C.015 | Indicar severity (error / advertencia / info) con color y simbolo | MN | M1 | S | mixto | — |
| HU-1C.016 | Abrir lista Invalid Things con detalle por regla | IA | M1 | M | opcloud-ui | — |
| HU-1C.017 | Navegar al elemento invalido desde Invalid Things | IA | M1 | S | opcloud-ui | — |
| HU-1C.018 | Revalidar regla on-demand tras correccion del modelo | IA | M1 | S | opm-semantica | — |
| HU-1C.019 | Citar seccion SSOT OPM en cada regla metodologica | MN | M1 | S | opcloud-ui | [V-239] |
| HU-1C.020 | Abrir dialogo Choose Remove Operation para cosa multi-apariencia | ME | M0 | M | mixto | [V-1] |
| HU-1C.021 | Listar apariciones del elemento con click-to-focus en la tabla | ME | M1 | S | opcloud-ui | — |
| HU-1C.022 | Ejecutar los tres scopes de borrado del Choose Remove Operation | ME | M0 | M | opm-semantica | [V-1] |

Total: **22 historias de usuario** (12 opm-semantica, 7 opcloud-ui, 3 mixto).

## Historias de usuario

### HU-1C.001 — Detectar solapamiento de cosa externa sobre contenedor con descomposicion

**Actor primario:** ME (modelador experto).
**Actores secundarios:** MN (novato — recibe advertencia).
**Tipo:** opm-semantica.
**Nivel categorico:** K (kernel — regla de pertenencia sobre `appearance.container_ref`) primario; V (render) y U (feedback) secundarios.
**Superficie UI:** canvas-opd + contenedor-descomposicion.
**Gesto canonico:** ninguno (observacion declarativa al mover una cosa existente externa hacia el interior visual de un contenedor con descomposicion).

**Historia:**
> Como modelador, quiero que el sistema detecte cuando arrastro una cosa externa encima del area interior de un contenedor con descomposicion para distinguir correctamente pertenencia logica de cercania visual.

**Contexto de negocio:**
OPM separa **identidad logica** de **apariencia visual**: una cosa no se vuelve parte interna de un refinamiento porque el cursor pase sobre el rectangulo padre. La deteccion del solape es la condicion de activacion del snap correctivo (HU-1C.002) y de la advertencia (HU-1C.003). Sin ella, los usuarios producen modelos semanticamente incorrectos por puro accidente geometrico.

**Criterios de aceptacion:**
- **Dado** que hay una cosa externa `C1` (con `appearance.container_ref=null` o a otro contenedor) y un contenedor con descomposicion `C2` en el mismo OPD, **cuando** muevo `C1` de modo que su bounding box se solapa con el interior de `C2`, **entonces** el kernel marca la condicion `inner_outer_violation` sin mutar `appearance.container_ref`.
- **Dado** que el solape es parcial (menos del 50% del area de `C1` dentro de `C2`), **cuando** se evalua la regla, **entonces** se considera violacion candidata si el anchor point de `C1` cae dentro de `C2`.
- **Dado** que el solape ocurre sobre el **header** del contenedor (franja superior con el label del refinable), **cuando** se evalua, **entonces** NO se marca violacion — el header no es zona interior.
- **Dado** que `C1` y `C2` ya pertenecen al mismo refinamiento (es decir, `C1` ES interna de `C2`), **cuando** muevo `C1` dentro de `C2`, **entonces** NO se marca violacion.

**Reglas y restricciones:**
- Regla dura: una cosa no puede ser simultaneamente interna y externa del mismo refinable (§4.1 doc fuente).
- La deteccion es **sobre apariencia visual**; la cosa logica no cambia de afiliacion de contenedor al moverse.
- El anchor point (centro o esquina superior-izquierda) es la referencia cuando el overlap es parcial — a cerrar en implementacion.

**Modelo de datos tocado:**
- `appearance.container_ref` — ID de contenedor o `null` — persistente (NO se muta).
- Estado transitorio de validacion: flag `inner_outer_violation` en la apariencia durante el drag.

**Dependencias:**
- Bloqueada por: HU-12.xxx (existencia de descomposicion / contenedores).
- Bloquea a: HU-1C.002, HU-1C.003.

**Integraciones:**
- Validador del kernel (`src/nucleo/validacion/`) aporta la regla.
- Layout engine no reposiciona; el snap (HU-1C.002) es separado.

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [V-1 §1.2] contorno y pertenencia.
- Fuente OPCloud: `opcloud-reverse/1c-canvas-validaciones.md` §3.1, §4.1.
- Frames: `27/frame_00008` (intento de meter externo dentro del contenedor).
- Transcripcion: "si el proceso se agranda y 'traga' visualmente un externo, eso no lo convierte en interno".
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** M.
**Etiquetas:** [canvas, kernel, validacion, inner-outer, descomposicion].

---

### HU-1C.002 — Expulsar con snap correctivo la cosa externa hacia afuera

**Actor primario:** ME.
**Actores secundarios:** MN.
**Tipo:** mixto.
**Nivel categorico:** V primario (layout correctivo); U (feedback de snap) secundaria.
**Superficie UI:** canvas-opd.
**Gesto canonico:** al soltar (`mouseup`) tras drag que dispara `inner_outer_violation`.

**Historia:**
> Como modelador, quiero que el sistema me reposicione la cosa externa hacia afuera del contenedor con descomposicion cuando intento soltarlo adentro para mantener la geometria consistente con la semantica del modelo.

**Contexto de negocio:**
La correccion automatica reduce la friccion: en vez de obligar al modelador a deshacer y reposicionar, OPCloud aplica snap a la posicion libre mas cercana fuera del contenedor. Esto refuerza la regla de no-solapamiento (HU-1C.001) sin dialogo intrusivo y mantiene el flujo.

**Criterios de aceptacion:**
- **Dado** que termina un drag de cosa externa `C1` con `inner_outer_violation` activa, **cuando** ocurre `mouseup`, **entonces** `C1` se reposiciona a la posicion libre mas cercana **fuera** del bounding box del contenedor `C2`.
- **Dado** que `C1` fue expulsada por snap, **cuando** miro el canvas tras el snap, **entonces** `C1` no se solapa con `C2` y el modelo permanece consistente.
- **Dado** que el snap ocurrio, **cuando** consulto `appearance.position`, **entonces** refleja la posicion post-snap (no la posicion del mouseup del usuario).
- **Dado** que la unica posicion libre disponible esta a distancia considerable, **cuando** ocurre el snap, **entonces** el reposicionamiento es animado (<300ms) para que el modelador note el movimiento.

**Reglas y restricciones:**
- El snap es correctivo, no de grilla: elige la posicion **fuera del contenedor** con menor distancia Euclidea al punto de soltado.
- No hay opcion de "forzar adentro" — la regla es dura.
- Si el usuario queria una cosa interna, debe usar HU-1C.004 o HU-1C.005 (caminos canonicos).

**Modelo de datos tocado:**
- `appearance.position` — `{x, y}` — persistente (reescrito por snap).
- `appearance.container_ref` — sin cambio.

**Dependencias:**
- Bloqueada por: HU-1C.001.
- Se coordina con: HU-1C.003 (advertencia explicativa aparece en paralelo al snap).

**Integraciones:**
- Layout engine (post-proceso correctivo).
- Render (re-draw con posicion nueva).

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [V-1 §1.2] pertenencia exterior/interior.
- Fuente OPCloud: §3.1 paso 4, §5.1.
- Frames: `27/frame_00010` (advertencia tras snap).
- Transcripcion: "si la suelta demasiado adentro, el sistema la expulsa otra vez hacia afuera".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, render, layout, validacion, snap, inner-outer, mixto].

---

### HU-1C.003 — Mostrar advertencia textual de interior/exterior en esquina superior

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; L (lente de feedback) secundaria.
**Superficie UI:** advertencia-banner-canvas (esquina superior).
**Gesto canonico:** ninguno (aparece tras violacion + snap).

**Historia:**
> Como modelador novato, quiero ver una advertencia textual explicativa cuando intento crear un interno arrastrando un externo para aprender el camino canonico sin interrumpir mi flujo.

**Contexto de negocio:**
La advertencia convierte un error en oportunidad pedagogica. No es modal — aparece en la esquina superior del canvas, describe que paso, y sugiere los dos caminos canonicos (crear directo adentro o arrastrar desde `Draggable OPM Things`). Se autodescarta tras un timeout o al siguiente gesto.

**Criterios de aceptacion:**
- **Dado** que ocurrio snap correctivo (HU-1C.002), **cuando** termina el reposicionamiento, **entonces** aparece un banner en la esquina superior del canvas con el texto explicativo de interior/exterior.
- **Dado** que el banner esta visible, **cuando** leo, **entonces** veo dos sugerencias canonicas: "crear directamente dentro del contenedor" y "arrastrar desde `Draggable OPM Things` hacia el interior".
- **Dado** que el banner esta visible, **cuando** paso 5 segundos o hago cualquier gesto sobre el canvas, **entonces** el banner desaparece con fade.
- **Dado** que el banner esta visible, **cuando** hago clic en la `x` del banner, **entonces** se cierra inmediatamente.

**Reglas y restricciones:**
- El banner **no bloquea** el canvas — el modelador puede seguir trabajando.
- El texto del banner es generico explicativo, no apunta a una cosa especifica (para mantenerse reusable).
- Timeout default: 5 segundos; a validar.

**Modelo de datos tocado:**
- Ninguno persistente (advertencia es UI transitoria).

**Dependencias:**
- Bloqueada por: HU-1C.002.

**Integraciones:**
- Sistema de toasts/banners del modelador.

**Notas de evidencia:**
- Fuente OPCloud: §3.1 paso 4, §5.1.
- Frames: `27/frame_00010` (advertencia en esquina superior).
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, ui, toast, advertencia, inner-outer, pedagogico, opcloud-ui].

---

### HU-1C.004 — Crear cosa interna correcta directamente dentro del contenedor

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario (crea appearance con `container_ref`); V secundaria.
**Superficie UI:** canvas-opd + contenedor-descomposicion.
**Gesto canonico:** arrastre desde toolbar principal soltando dentro del bounding box del contenedor.

**Historia:**
> Como modelador, quiero crear una cosa interna arrastrando desde la toolbar hasta el interior de un contenedor con descomposicion para poblar el refinamiento con las partes correctas desde el primer gesto.

**Contexto de negocio:**
Este es uno de los dos caminos canonicos para poblar un refinable (el otro es HU-1C.005). A diferencia de HU-1C.001 (mover una cosa existente), la creacion directa nace con `container_ref` apuntando al refinable, y el kernel la trata como interna desde el inicio.

**Criterios de aceptacion:**
- **Dado** que existe un contenedor con descomposicion `C1` en el canvas, **cuando** arrastro un icono desde la toolbar y suelto dentro del bounding box de `C1` (fuera del header), **entonces** se crea una cosa nueva con `appearance.container_ref = C1.id`.
- **Dado** que se creo la cosa interna, **cuando** consulto el panel OPL-ES, **entonces** la oracion refleja la relacion parte/participacion del refinable.
- **Dado** que se creo la cosa interna, **cuando** muevo `C1`, **entonces** la cosa interna se mueve junto a `C1` como parte del refinable.
- **Dado** que solte sobre el header de `C1`, **cuando** ocurre la creacion, **entonces** NO se anida — la cosa se crea fuera del contenedor (el header no es zona interior).

**Reglas y restricciones:**
- La creacion dentro del contenedor es el gesto canonico ensenado en la advertencia (HU-1C.003).
- `container_ref` se fija en el momento de la creacion; cambiarlo despues requiere flujo dedicado (no cubierto aqui).

**Modelo de datos tocado:**
- `cosa.*` — nueva entidad (ver HU-10.001 para estructura).
- `appearance.container_ref` — ID del contenedor — persistente.

**Dependencias:**
- Bloqueada por: HU-10.001, HU-10.002 (creacion de cosas).
- Bloqueada por: HU-12.xxx (existencia de descomposicion).

**Integraciones:**
- Panel OPL-ES — emite oracion de refinamiento.
- Layout — zonas interior/header del contenedor.

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [V-1] pertenencia; [Glos 3.23] descomposicion.
- Fuente OPCloud: §3.1 paso 5.
- Frames: `27/frame_00015` (creacion/uso correcto de interno).
- Transcripcion: "crearla directamente dentro del contenedor".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [canvas, kernel, creacion, interno, descomposicion].

---

### HU-1C.005 — Crear cosa interna arrastrando desde Draggable OPM Things

**Actor primario:** ME.
**Actores secundarios:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario (crea nueva appearance de cosa existente); U (biblioteca) secundaria.
**Superficie UI:** panel-biblioteca-lateral + contenedor-descomposicion.
**Gesto canonico:** arrastre desde entrada de `Draggable OPM Things` soltando dentro del contenedor.

**Historia:**
> Como modelador experto, quiero arrastrar una cosa existente desde la biblioteca `Draggable OPM Things` hasta el interior de un contenedor con descomposicion para reusar la misma entidad logica como parte interna del refinamiento sin duplicarla.

**Contexto de negocio:**
La biblioteca lateral es la **pasarela canonica de reuso** (§7.1 doc fuente). Arrastrar desde ahi al interior de un contenedor crea una **nueva apariencia** del mismo `cosa.id` con `container_ref` apuntando al refinable — preserva identidad logica y poblamiento geometrico a la vez.

**Criterios de aceptacion:**
- **Dado** que el panel `Draggable OPM Things` lista una cosa `C1` existente, **cuando** arrastro la entrada de `C1` y suelto dentro del contenedor `C2`, **entonces** se crea una **nueva apariencia** de `C1` con `appearance.container_ref = C2.id`, sin crear nueva entidad.
- **Dado** que cree la apariencia interna, **cuando** consulto `C1.appearances`, **entonces** la lista incluye la nueva apariencia ademas de las previas.
- **Dado** que cree la apariencia interna, **cuando** renombro `C1` en cualquier OPD, **entonces** todas las apariencias (incluida la interna) reflejan el nuevo nombre.
- **Dado** que suelto sobre el header del contenedor, **cuando** ocurre la creacion, **entonces** la apariencia se crea fuera — el header no es zona interior.

**Reglas y restricciones:**
- Este gesto NO duplica la entidad; la identidad logica (`cosa.id`) es compartida.
- La biblioteca es lista de entidades, no de apariencias (HU-10.017).
- El arrastre desde biblioteca es el camino preferido cuando la intencion del modelador es reuso explicito.

**Modelo de datos tocado:**
- `appearance.*` — nueva entidad con `cosa_ref = C1.id`, `container_ref = C2.id`, `position` — persistente.
- `cosa.*` — sin cambios.

**Dependencias:**
- Bloqueada por: HU-10.017 (biblioteca), HU-12.xxx (descomposicion).

**Integraciones:**
- Biblioteca lateral.
- Validador — regla de compatibilidad tipo-contenedor.
- Panel OPL-ES — emite oracion refinable-parte.

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [V-1] entidad unica y sus apariencias.
- Fuente OPCloud: §3.1 paso 5 (segundo camino), §7.1.
- Transcripcion: "arrastrarla desde `Draggable OPM Things` hacia el interior".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, ui, biblioteca-lateral, reuso, interno, appearance].

---

### HU-1C.006 — Preservar externalidad al agrandar el contenedor sobre una cosa

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** V primario (invariante geometrico); K secundaria (proteccion de `container_ref`).
**Superficie UI:** canvas-opd.
**Gesto canonico:** resize del contenedor (drag de handle) hasta solapar con cosa externa.

**Historia:**
> Como modelador experto, quiero que una cosa externa siga siendo externa aunque yo agrande el contenedor con descomposicion hasta engullirlo visualmente para proteger la semantica del modelo contra accidentes de layout.

**Contexto de negocio:**
La transcripcion es explicita: "si el proceso se agranda y 'traga' visualmente un externo, eso no lo convierte en interno. En cuanto se mueve, salta de nuevo hacia afuera". Este invariante asegura que `container_ref` se mantiene estable bajo operaciones geometricas sobre el contenedor.

**Criterios de aceptacion:**
- **Dado** que existe una cosa externa `C1` (con `container_ref != C2.id`) y un contenedor `C2`, **cuando** agrando `C2` por drag de handle hasta que `C1` queda dentro del bounding box de `C2`, **entonces** `C1.appearance.container_ref` NO cambia.
- **Dado** que `C1` quedo visualmente dentro de `C2` por resize, **cuando** muevo `C1` (incluso un pixel), **entonces** el sistema activa snap correctivo (HU-1C.002) y expulsa `C1` hacia afuera.
- **Dado** que `C1` quedo visualmente dentro de `C2`, **cuando** consulto el panel OPL-ES, **entonces** la oracion refleja que `C1` NO es parte de `C2` (externalidad preservada).
- **Dado** que `C1` quedo visualmente dentro tras resize, **cuando** consulto el modelo logico, **entonces** `C1` sigue siendo externo — el render no refleja un estado de pertenencia real.

**Reglas y restricciones:**
- Invariante duro: resize del contenedor no muta `container_ref` de ninguna cosa.
- El efecto visual de solape por resize es **tolerado** pero **inestable**: cualquier movimiento de `C1` activa la correccion.

**Modelo de datos tocado:**
- `appearance.container_ref` — sin cambios por resize.
- `container.size` — persistente (si cambia por resize).

**Dependencias:**
- Bloqueada por: HU-1C.001, HU-1C.002.
- Relaciona: EPICA-1A (grid/resize).

**Integraciones:**
- Layout correctivo al mover `C1`.
- Kernel protege `container_ref` contra mutaciones derivadas de resize.

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [V-1 §1.2] invarianza de pertenencia.
- Fuente OPCloud: §3.1 nota, §4.1.
- Transcripcion: "si el proceso se agranda y 'traga' visualmente un externo, eso no lo convierte en interno. En cuanto se mueve, salta de nuevo hacia afuera".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, render, layout, inner-outer, invariante, resize].

---

### HU-1C.007 — Detectar colision nominal al crear o renombrar una cosa

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario (regla de unicidad nominal global); U (dispara dialogo) secundaria.
**Superficie UI:** dialogo-auto-format + kernel.
**Gesto canonico:** ninguno (evaluacion on-confirm del dialogo o rename).

**Historia:**
> Como modelador, quiero que el sistema detecte cuando asigno un nombre ya usado por otra cosa del modelo para evitar duplicados nominales ambiguos.

**Contexto de negocio:**
OPM exige nombres globalmente unicos por tipo (o, en casos compatibles, identidad compartida). La deteccion de colision nominal es la puerta de entrada al flujo de resolucion (HU-1C.008, HU-1C.009, HU-1C.010). Sin ella, dos `Driver Rescuing` coexistirian ambiguos.

**Criterios de aceptacion:**
- **Dado** que existe una cosa `C1` con nombre `N`, **cuando** creo una cosa `C2` y confirmo el nombre `N` en el dialogo, **entonces** el kernel detecta colision y dispara el flujo de nombre duplicado (HU-1C.008).
- **Dado** que existe una cosa `C1` con nombre `N`, **cuando** renombro una cosa `C2` distinta al mismo nombre `N`, **entonces** se dispara el mismo flujo.
- **Dado** que la colision es contra mi propio nombre anterior (renombrar `C1` a su nombre actual), **cuando** confirmo, **entonces** NO se dispara flujo — es no-op.
- **Dado** que la colision ocurre entre tipos distintos (`C1` es Object y `C2` es Process), **cuando** se evalua, **entonces** se dispara el flujo pero con la ruta `incompatibilidad de tipos` (HU-1C.011).

**Reglas y restricciones:**
- El espacio de nombres es **global al modelo**, no por OPD.
- Comparacion de nombres: case-sensitive (a confirmar); default `Auto Format` normaliza el casing antes del match.
- La deteccion ocurre **al confirmar** el nombre, no en vivo mientras se tipea.

**Modelo de datos tocado:**
- Lectura: `cosa.nombre` en todo el modelo.
- Estado transitorio: flag `name_collision_candidate` durante el flujo del dialogo.

**Dependencias:**
- Bloqueada por: HU-10.003 (dialogo Auto Format).
- Bloquea a: HU-1C.008, HU-1C.009, HU-1C.010, HU-1C.011, HU-1C.012.

**Integraciones:**
- Dialogo Auto Format (dispara al confirmar).
- Dialogo duplicate name (consume la deteccion).

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [Glos 3.76] nombre de cosa.
- Fuente OPCloud: §3.2, §5.2.
- Frames: `45/frame_00007` (dialogo de nombre duplicado).
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [canvas, kernel, validacion, nombres, duplicate].

---

### HU-1C.008 — Abrir dialogo de nombre duplicado con lista de OPDs existentes

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; L (lente de apariciones) secundaria.
**Superficie UI:** dialogo-nombre-duplicado (centrado).
**Gesto canonico:** ninguno (se abre al detectar colision en HU-1C.007).

**Historia:**
> Como modelador, quiero ver un dialogo con la lista de OPDs donde ya existe la cosa colisionante para entender el contexto antes de decidir si reuso o renombro.

**Contexto de negocio:**
La lista de OPDs es el contexto clave. Un nombre duplicado puede ser reuso legitimo (la misma entidad aparece en otro OPD) o error accidental. Mostrar donde vive la entidad previa ayuda al modelador a tomar la decision correcta.

**Criterios de aceptacion:**
- **Dado** que se detecto colision nominal (HU-1C.007), **cuando** el dialogo se abre, **entonces** veo el titulo y una lista de OPDs donde ya existe la cosa con ese nombre (al menos nombre del OPD + referencia).
- **Dado** que el dialogo esta abierto, **cuando** miro los botones, **entonces** veo al menos tres opciones: `Use Existing Thing`, `Rename Current Thing`, `Close`.
- **Dado** que la cosa existente es incompatible (tipo o refinamiento), **cuando** el dialogo se abre, **entonces** `Use Existing Thing` esta deshabilitado (HU-1C.011).
- **Dado** que el dialogo esta abierto, **cuando** hago clic en un OPD de la lista, **entonces** el comportamiento es abierto (posible click-to-focus a validar en implementacion).

**Reglas y restricciones:**
- Dialogo centrado, bloquea interaccion con el canvas hasta decision.
- La lista de OPDs muestra el nombre + path cuando hay estructura de carpetas.

**Modelo de datos tocado:**
- Lectura: `cosa.appearances` y `appearance.opd_ref`.

**Dependencias:**
- Bloqueada por: HU-1C.007.
- Bloquea a: HU-1C.009, HU-1C.010.

**Integraciones:**
- Lente de apariciones (enumera OPDs).
- Kernel de validacion (determina si `Use Existing Thing` esta habilitado).

**Notas de evidencia:**
- Fuente OPCloud: §3.2, §5.2.
- Frames: `45/frame_00007`.
- Clase de afirmacion: observado + confirmado.

**Prioridad:** M1.
**Tamano:** M.
**Etiquetas:** [canvas, ui, dialogo, duplicate-name, opcloud-ui].

---

### HU-1C.009 — Reusar cosa existente con Use Existing Thing

**Actor primario:** ME.
**Actores secundarios:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario (fusiona en identidad logica, crea nueva appearance).
**Superficie UI:** dialogo-nombre-duplicado (boton).
**Gesto canonico:** clic en `Use Existing Thing`.

**Historia:**
> Como modelador, quiero elegir `Use Existing Thing` en el dialogo de nombre duplicado para fusionar mi creacion provisional con la entidad ya existente y obtener una nueva apariencia de la misma cosa logica.

**Contexto de negocio:**
Esta es la afirmacion operativa del principio "entidad unica ↔ multiples apariencias". `Use Existing Thing` transforma lo que seria un duplicado en una apariencia adicional, preservando identidad logica y el espacio de nombres coherente.

**Criterios de aceptacion:**
- **Dado** que el dialogo esta abierto y `Use Existing Thing` esta habilitado, **cuando** hago clic, **entonces** la cosa provisional `C2` se descarta y se crea una nueva `appearance` de la cosa existente `C1` en el OPD actual con la posicion y tipo que tenia `C2`.
- **Dado** que se ejecuto `Use Existing Thing`, **cuando** consulto `C1.appearances`, **entonces** la lista incluye la nueva apariencia.
- **Dado** que se ejecuto `Use Existing Thing`, **cuando** consulto el panel OPL-ES, **entonces** la oracion `C1 is ...` no se duplica — se mantiene una sola definicion.
- **Dado** que se ejecuto `Use Existing Thing`, **cuando** renombro `C1` en cualquier OPD, **entonces** el nuevo nombre se propaga a todas las apariencias.

**Reglas y restricciones:**
- `Use Existing Thing` solo disponible si tipo y refinamiento son compatibles (HU-1C.011).
- La operacion es reversible solo por undo (ver EPICA-90).
- La cosa provisional `C2` no deja rastro en el modelo tras la fusion.

**Modelo de datos tocado:**
- `cosa.*` (provisional `C2`) — eliminada.
- `appearance.*` — nueva con `cosa_ref = C1.id`.

**Dependencias:**
- Bloqueada por: HU-1C.008, HU-1C.011 (validacion de compatibilidad).

**Integraciones:**
- Kernel — fusion de identidad.
- Panel OPL-ES — re-render.
- Biblioteca lateral — sin cambios (ya listaba `C1`).

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [V-1] principio de entidad unica.
- Fuente OPCloud: §3.2 paso 3-4, §5.2.
- Transcripcion: "esa opcion no crea una cosa nueva: crea otra apariencia visual del mismo thing logico".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** M.
**Etiquetas:** [canvas, kernel, reuso, appearance, duplicate].

---

### HU-1C.010 — Renombrar la cosa actual para mantener nombres distintos

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** U primario; K (propaga `cosa.nombre`).
**Superficie UI:** dialogo-nombre-duplicado (boton + input).
**Gesto canonico:** clic en `Rename Current Thing` + escritura + confirm.

**Historia:**
> Como modelador, quiero elegir `Rename Current Thing` en el dialogo de nombre duplicado para conservar mi creacion como entidad separada con un nombre distinto.

**Contexto de negocio:**
Cuando la colision fue accidental (el modelador queria una cosa nueva pero eligio un nombre ocupado), renombrar es la salida limpia. Mantiene el modelo coherente sin forzar fusion.

**Criterios de aceptacion:**
- **Dado** que el dialogo esta abierto, **cuando** hago clic en `Rename Current Thing`, **entonces** el dialogo reemplaza su cuerpo por un input de renombre pre-poblado con el nombre actual.
- **Dado** que el input esta visible, **cuando** escribo un nombre nuevo `N'` distinto y confirmo, **entonces** `C2.nombre = N'` y el dialogo se cierra.
- **Dado** que escribo un nombre que tambien colisiona, **cuando** confirmo, **entonces** se vuelve a disparar el flujo de nombre duplicado (HU-1C.007).
- **Dado** que escribo un nombre vacio, **cuando** confirmo, **entonces** el boton de confirm esta deshabilitado o muestra error.

**Reglas y restricciones:**
- El rename final debe pasar la misma validacion que HU-1C.007.
- Cancelar durante el rename vuelve al dialogo inicial o cierra completamente (a definir).

**Modelo de datos tocado:**
- `cosa.nombre` — string — persistente.

**Dependencias:**
- Bloqueada por: HU-1C.008.

**Integraciones:**
- Panel OPL-ES — re-render con nuevo nombre.
- Biblioteca lateral — actualiza entrada.

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [Glos 3.76] nombre de cosa.
- Fuente OPCloud: §3.2 paso 5, §3.3, §5.2.
- Transcripcion: "renombrar, o cerrar y mantener un nombre distinto" (cuando no aplica Use Existing).
- Clase de afirmacion: observado + confirmado.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, ui, dialogo, rename, duplicate].

---

### HU-1C.011 — Bloquear Use Existing Thing cuando tipo o refinamiento incompatibles

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario (regla de compatibilidad); U (deshabilita boton) secundaria.
**Superficie UI:** dialogo-nombre-duplicado.
**Gesto canonico:** ninguno (evaluacion al abrir el dialogo).

**Historia:**
> Como modelador experto, quiero que `Use Existing Thing` este deshabilitado cuando mi cosa provisional no es compatible con la existente para no producir fusiones semanticamente invalidas.

**Contexto de negocio:**
La fusion solo tiene sentido entre entidades del mismo tipo con refinamiento compatible. OPCloud prohibe explicitamente fusionar (a) tipos distintos (p.ej. Process con Object) y (b) refinamientos incompatibles (p.ej. dos Objects con estados mutuamente excluyentes o con descomposiciones incompatibles).

**Criterios de aceptacion:**
- **Dado** que la cosa provisional `C2` es Object y la existente `C1` es Process (o viceversa), **cuando** se evalua el dialogo, **entonces** `Use Existing Thing` esta deshabilitado con tooltip explicativo.
- **Dado** que `C1` tiene descomposicion con un refinamiento incompatible con `C2`, **cuando** se evalua, **entonces** `Use Existing Thing` esta deshabilitado.
- **Dado** que `Use Existing Thing` esta deshabilitado, **cuando** miro el dialogo, **entonces** solo puedo usar `Rename Current Thing` o `Close`.
- **Dado** que el boton esta deshabilitado, **cuando** paso el cursor por encima, **entonces** aparece tooltip con la razon (`different type` o `incompatible refinement`).

**Reglas y restricciones:**
- Criterios de incompatibilidad (§3.3 doc fuente):
  1. tipos distintos;
  2. refinamientos incompatibles (descomposicion o unfold divergentes).
- Lista exacta de incompatibilidades de refinamiento: a detallar contra SSOT OPM.

**Modelo de datos tocado:**
- Lectura: `C1.tipo`, `C2.tipo`, `C1.refinamiento`, `C2.refinamiento`.

**Dependencias:**
- Bloqueada por: HU-1C.008.

**Integraciones:**
- Kernel de validacion — regla de compatibilidad.

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [V-239] familias canonicas de enlace; [V-240] firmas de enlace.
- Fuente OPCloud: §3.3.
- Frames: `45/frame_00015` (caso sin `Use Existing Thing`).
- Transcripcion: "si la cosa existente es de otro tipo, no se puede fundir; si el conflicto involucra refinamientos incompatibles, tampoco".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, kernel, validacion, duplicate, incompatibilidad].

---

### HU-1C.012 — Serializar nombre por defecto ante colision de default

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario (regla de naming automatico); V secundaria.
**Superficie UI:** dialogo-auto-format (input pre-poblado).
**Gesto canonico:** ninguno (pre-poblado automatico al crear).

**Historia:**
> Como modelador novato, quiero que el sistema asigne nombres por defecto serializados (`A Processing`, `A Processing 2`, `A Processing 3`…) cuando creo varias cosas sin renombrar para poder avanzar sin detenerme en cada nombre y sin chocar con el flujo de nombre duplicado.

**Contexto de negocio:**
El nombre por defecto (`A Processing`, `An Object`, …) es la semilla para el primer modelado. Si creo dos processes seguidos sin renombrar, el segundo no debe dispararme el dialogo de nombre duplicado — debe tomar `A Processing 2` automaticamente. Esto preserva la fluidez del modelado exploratorio.

**Criterios de aceptacion:**
- **Dado** que no existe ninguna cosa con nombre `A Processing`, **cuando** creo un proceso y no renombro, **entonces** el nombre asignado es `A Processing`.
- **Dado** que ya existe `A Processing`, **cuando** creo un segundo proceso, **entonces** el dialogo se pre-puebla con `A Processing 2`.
- **Dado** que ya existen `A Processing` y `A Processing 2`, **cuando** creo un tercer proceso, **entonces** el dialogo se pre-puebla con `A Processing 3`.
- **Dado** que el usuario escribe un nombre distinto en el dialogo y confirma, **cuando** se persiste, **entonces** el contador de defaults no avanza — solo se consumen cuando el default se mantiene.
- **Dado** que el usuario elimina `A Processing 2` y crea un cuarto proceso, **cuando** se pre-puebla, **entonces** el nombre asignado es `A Processing 2` (reutiliza el hueco) o `A Processing 4` — comportamiento a definir.

**Reglas y restricciones:**
- La serializacion solo aplica a nombres por defecto (`A Processing`, `An Object`, etc.).
- La serializacion NO reemplaza el flujo de nombre duplicado (HU-1C.007) para nombres escritos por el usuario.
- El contador es por tipo (`A Processing N` es independiente de `An Object N`).

**Modelo de datos tocado:**
- `cosa.nombre` — string — persistente.
- Contador interno de defaults — puede ser transitorio (derivable) o persistente (optimizacion).

**Dependencias:**
- Bloqueada por: HU-10.001, HU-10.002.
- Coordina con: HU-1C.007 (evita disparar dialogo por defaults).

**Integraciones:**
- Dialogo Auto Format — pre-pobla el input.
- Kernel — genera el nombre siguiente.

**Notas de evidencia:**
- Fuente OPCloud: inferido desde HU-10.001 CA serial + §3.2 coherencia.
- Clase de afirmacion: inferido (OPCloud lo hace en la practica; la regla exacta de hueco vs contador monotono es abierta).
- Etiqueta: `requires-clarification` (sobre reuso de huecos tras eliminar).

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [canvas, kernel, naming, default, serializacion, requires-clarification].

---

### HU-1C.013 — Abrir panel Methodological Checking desde toolbar

**Actor primario:** MN.
**Actores secundarios:** IA (analista).
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario.
**Superficie UI:** secondary-toolbar + panel-methodology.
**Gesto canonico:** clic en boton `Methodological Checking`.

**Historia:**
> Como modelador, quiero abrir el panel `Methodological Checking` con un clic desde la toolbar para ejecutar el chequeo de axiomas OPM on-demand sobre mi modelo.

**Contexto de negocio:**
El checking metodologico es un diferencial de OPM: no es lint generico, son axiomas que vienen de la SSOT (proceso terminado en `ing`, objeto singular, refinamientos con ≥2 partes, procesos transformadores con al menos un objeto afectado). Exponerlo como panel accesible refuerza el valor pedagogico y operativo.

**Criterios de aceptacion:**
- **Dado** que el modelo esta cargado, **cuando** miro la secondary toolbar, **entonces** veo un boton `Methodological Checking` identificable.
- **Dado** que hago clic en el boton, **cuando** se ejecuta, **entonces** se abre un panel con la lista de reglas y el estado de cada una.
- **Dado** que el panel ya esta abierto, **cuando** hago clic en el boton de nuevo, **entonces** el panel se cierra (toggle).
- **Dado** que el panel esta abierto, **cuando** hago clic fuera, **entonces** el panel permanece abierto (no se cierra por click-outside — requiere toggle explicito).

**Reglas y restricciones:**
- El chequeo se ejecuta al abrir el panel (cold start) o por accion `Revalidate` (HU-1C.018).
- La ubicacion exacta del boton (toolbar dedicada vs secondary) se define en implementacion.

**Modelo de datos tocado:**
- Estado transitorio: `methodology_panel.is_open`.

**Dependencias:**
- Bloqueada por: existencia del modelo (cualquier cosa creada).
- Bloquea a: HU-1C.014, HU-1C.015, HU-1C.016.

**Integraciones:**
- Kernel de validacion metodologica.
- UI de panel.

**Notas de evidencia:**
- Fuente OPCloud: §2 tabla UI, §3.4 paso 1.
- Frames: `47/frame_00011` (dialogo metodologico).
- Clase de afirmacion: observado.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, ui, methodology, toolbar, opcloud-ui].

---

### HU-1C.014 — Ejecutar 5 reglas metodologicas canonicas OPM

**Actor primario:** IA (analista de modelo).
**Actores secundarios:** MN, ME.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario (axiomas OPM); L (lente sobre el modelo) secundaria.
**Superficie UI:** panel-methodology.
**Gesto canonico:** automatico al abrir el panel o por `Revalidate`.

**Historia:**
> Como analista de modelo, quiero que el panel ejecute las 5 reglas metodologicas canonicas OPM para detectar violaciones de axiomas sin tener que revisar el modelo a mano.

**Contexto de negocio:**
El doc fuente confirma (§5.3) las cinco categorias activas en OPCloud:
1. proceso terminado en `ing`,
2. nombre de objeto en singular; usar `Set` o `Group` para pluralidad,
3. unfolding con al menos dos partes/atributos,
4. descomposicion con al menos dos subprocesos o elementos internos relevantes,
5. proceso transformador con al menos un objeto afectado, consumido o creado.

Estas cinco reglas son el nucleo inicial; son ampliables a futuro via configuracion de ontologia (EPICA-82).

**Criterios de aceptacion:**
- **Dado** que el panel `Methodological Checking` esta abierto, **cuando** se ejecuta el chequeo, **entonces** veo las 5 reglas con su estado individual (aprobada / con incidencias).
- **Dado** que hay un process sin sufijo `ing` (p.ej. `Driver Rescue`), **cuando** corre la regla 1, **entonces** esa regla reporta `con incidencias` y lista al process como invalido.
- **Dado** que hay un object con nombre plural (p.ej. `Drivers`), **cuando** corre la regla 2, **entonces** esa regla reporta incidencia y sugiere usar `Driver Set` o `Driver Group`.
- **Dado** que un unfolding tiene solo 1 parte, **cuando** corre la regla 3, **entonces** esa regla reporta incidencia.
- **Dado** que una descomposicion tiene solo 1 subproceso, **cuando** corre la regla 4, **entonces** esa regla reporta incidencia.
- **Dado** que un proceso transformador no tiene result, consumption ni effect, **cuando** corre la regla 5, **entonces** esa regla reporta incidencia.
- **Dado** que un proceso transformador tiene effect (no solo result), **cuando** corre la regla 5, **entonces** NO reporta incidencia (§4.3 doc fuente).
- **Dado** que un subprocess satisface el chequeo del padre, **cuando** corre la regla 5 sobre el padre, **entonces** NO reporta incidencia (§4.4 doc fuente).

**Reglas y restricciones:**
- Regla 5 acepta `result`, `consumption` o `effect` como formas validas de transformacion.
- La regla 5 puede satisfacerse en subprocess dentro de descomposicion, no requiere dibujo redundante en el OPD padre.
- Sufijo `ing`: aceptar variantes (`-ing`, `ed`, casos especificos como gerundios irregulares) — a detallar contra SSOT.

**Modelo de datos tocado:**
- Lectura: `cosa.nombre`, `cosa.tipo`, `refinamiento.*`, `enlace.*`.
- Escritura transitoria o persistente: `methodology_checks.rule_id.status` + `invalid_elements_by_rule.rule_id = [appearance_ref]`.

**Dependencias:**
- Bloqueada por: HU-1C.013.
- Bloquea a: HU-1C.015, HU-1C.016, HU-1C.017, HU-1C.018.

**Integraciones:**
- Kernel de validacion.
- Panel OPL-ES (lectura de nombres, estructura).

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [V-239] familias canonicas; [V-240] firmas; [Glos 3.39] Objeto; [Glos 3.58] Proceso.
- Fuente OPCloud: §3.4, §4.3, §4.4, §5.3.
- Frames: `47/frame_00018` (singular), `47/frame_00027` (refinamiento), `47/frame_00033` (transformador), `47/frame_00040` (correccion relacional).
- Transcripcion: confirma las 5 categorias activas.
- Clase de afirmacion: confirmado por transcripcion + observado.

**Prioridad:** M1.
**Tamano:** L (5 reglas, cada una con su logica + lectura completa del modelo).
**Etiquetas:** [canvas, kernel, methodology, axiomas, validacion].

---

### HU-1C.015 — Indicar severity (error / advertencia / info) con color y simbolo

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categorico:** V primario; U secundaria.
**Superficie UI:** panel-methodology (cada fila de regla).
**Gesto canonico:** ninguno (render declarativo del resultado).

**Historia:**
> Como modelador, quiero ver cada regla en el panel con un indicador visual de severidad (error / advertencia / info) para priorizar que corregir primero.

**Contexto de negocio:**
Las 5 reglas canonicas no tienen todas el mismo peso: violar la regla 5 (proceso sin transformacion) es mas grave que tener un object plural. Aunque el doc fuente no enumera severidades explicitamente, la UI debe permitir distinguir — color verde/amarillo/rojo mas simbolo para accesibilidad.

**Criterios de aceptacion:**
- **Dado** que una regla reporta aprobada, **cuando** miro el panel, **entonces** veo un indicador verde con simbolo de check.
- **Dado** que una regla reporta incidencias de severidad `error`, **cuando** miro el panel, **entonces** veo rojo + simbolo de cruz o alerta.
- **Dado** que una regla reporta incidencias de severidad `advertencia`, **cuando** miro el panel, **entonces** veo amarillo + simbolo de triangulo.
- **Dado** que una regla aporta `info` (sugerencia sin violacion dura), **cuando** miro el panel, **entonces** veo azul + simbolo de info.
- **Dado** que la visualizacion es por color, **cuando** el usuario tiene daltonismo, **entonces** el simbolo acompana para redundancia de canal.

**Reglas y restricciones:**
- Mapeo canonico inicial (a ajustar contra SSOT):
  - Regla 5 (proceso transformador sin resultado): `error`.
  - Regla 1 (proceso sin `ing`): `advertencia`.
  - Regla 2 (objeto plural): `advertencia`.
  - Regla 3 (unfold < 2): `advertencia`.
  - Regla 4 (descomposicion < 2): `advertencia`.
- Algunos frames muestran el estado "verde" ambiguo por compresion de captura (§4 nota); el render del producto debe ser **nitido**.

**Modelo de datos tocado:**
- `methodology_checks.rule_id.severity` — `"error" | "advertencia" | "info"` — derivable.

**Dependencias:**
- Bloqueada por: HU-1C.014.

**Integraciones:**
- Renderer del panel (colores y simbolos).

**Notas de evidencia:**
- Fuente OPCloud: §4 nota (el color verde no era nitido en algunos frames), §5.3.
- Clase de afirmacion: inferido + parcialmente observado.
- Etiqueta: `requires-clarification` (mapeo exacto severidad ↔ regla).

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, render, ui, methodology, severity, accesibilidad, mixto].

---

### HU-1C.016 — Abrir lista Invalid Things con detalle por regla

**Actor primario:** IA.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; L secundaria.
**Superficie UI:** dialogo-invalid-things.
**Gesto canonico:** clic en boton `Details` de una regla.

**Historia:**
> Como analista, quiero abrir la lista detallada `Invalid Things` desde el boton `Details` de cada regla para ver que elementos exactos incumplen y en que OPD viven.

**Contexto de negocio:**
El panel metodologico resume. `Invalid Things` detalla. La separacion mantiene el panel compacto y permite inspeccion profunda bajo demanda. Lista elementos + OPD contenedor, habilita navegacion (HU-1C.017).

**Criterios de aceptacion:**
- **Dado** que una regla tiene incidencias, **cuando** hago clic en su boton `Details`, **entonces** se abre un dialogo `Invalid Things` con una tabla de elementos invalidos.
- **Dado** que la tabla esta visible, **cuando** miro cada fila, **entonces** veo: nombre del elemento, tipo (Object / Process), OPD contenedor, y un control para navegar (HU-1C.017).
- **Dado** que no hay incidencias en la regla, **cuando** miro el boton `Details`, **entonces** esta deshabilitado o no aparece.
- **Dado** que cierro el dialogo, **cuando** hago clic en `x` o fuera, **entonces** vuelvo al panel de reglas.

**Reglas y restricciones:**
- El dialogo es independiente por regla (cada `Details` abre su lista especifica).
- La lista se recalcula con cada re-chequeo (HU-1C.018).

**Modelo de datos tocado:**
- Lectura: `invalid_elements_by_rule.rule_id`.

**Dependencias:**
- Bloqueada por: HU-1C.014.
- Bloquea a: HU-1C.017.

**Integraciones:**
- OPD tree (para resolver nombres de OPD contenedor).

**Notas de evidencia:**
- Fuente OPCloud: §2 tabla UI, §3.4 paso 3-4.
- Frames: `47/frame_00011`, `47/frame_00033` (detalle de transformador).
- Clase de afirmacion: observado + confirmado.

**Prioridad:** M1.
**Tamano:** M.
**Etiquetas:** [canvas, ui, dialogo, methodology, invalid-list, opcloud-ui].

---

### HU-1C.017 — Navegar al elemento invalido desde Invalid Things

**Actor primario:** IA.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; L secundaria.
**Superficie UI:** dialogo-invalid-things + canvas-opd.
**Gesto canonico:** clic en fila o control de navegacion de `Invalid Things`.

**Historia:**
> Como analista, quiero hacer clic en una fila de `Invalid Things` para navegar directamente al elemento en el OPD donde vive y corregirlo sin buscarlo a mano.

**Contexto de negocio:**
La navegacion desde la lista al elemento es el puente que convierte el chequeo en flujo de correccion iterativo. Sin ella, el modelador tendria que buscar manualmente en el arbol OPD — rompe la promesa de "detectar + corregir + revalidar".

**Criterios de aceptacion:**
- **Dado** que estoy en el dialogo `Invalid Things`, **cuando** hago clic en una fila, **entonces** el canvas cambia al OPD contenedor de ese elemento y el elemento queda seleccionado.
- **Dado** que se hizo focus, **cuando** miro el canvas, **entonces** el elemento esta visible (no requiere scroll adicional).
- **Dado** que el dialogo era bloqueante, **cuando** ocurre el focus, **entonces** el dialogo se cierra o se minimiza para no obstruir.
- **Dado** que corrijo el elemento, **cuando** vuelvo al panel y revalido (HU-1C.018), **entonces** ese elemento ya no aparece en la lista.

**Reglas y restricciones:**
- Si el elemento aparece en multiples OPDs, se navega a la apariencia referenciada (no a todas).
- El click-to-focus es consistente con el de HU-1C.021.

**Modelo de datos tocado:**
- Estado transitorio: `canvas.active_opd`, `canvas.selection`.

**Dependencias:**
- Bloqueada por: HU-1C.016.

**Integraciones:**
- OPD tree (navegacion entre OPDs).
- Canvas (seleccion y centrado).

**Notas de evidencia:**
- Fuente OPCloud: §3.4 paso 4, §2 tabla (click-to-focus implicito).
- Frames: `47/frame_00040` (ejemplo de correccion relacional — se supone tras navegar).
- Clase de afirmacion: observado + confirmado.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, ui, navigator, methodology, focus, opcloud-ui].

---

### HU-1C.018 — Revalidar regla on-demand tras correccion del modelo

**Actor primario:** IA.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario; V (re-render resultado) secundaria.
**Superficie UI:** panel-methodology (boton `Revalidate` global o por regla).
**Gesto canonico:** clic en `Revalidate`.

**Historia:**
> Como analista, quiero revalidar el chequeo metodologico tras corregir un elemento para ver si la regla ahora aprueba sin recargar el modelo.

**Contexto de negocio:**
La transcripcion describe el ciclo como "revisar, ir al elemento, corregir y volver a chequear". El `Revalidate` es el cierre del ciclo — convierte el chequeo en herramienta iterativa, no one-shot.

**Criterios de aceptacion:**
- **Dado** que corregi un elemento invalido, **cuando** hago clic en `Revalidate`, **entonces** el kernel re-ejecuta las reglas y actualiza los estados del panel.
- **Dado** que la regla que reportaba incidencia ahora aprueba, **cuando** revalido, **entonces** la regla pasa a estado verde / aprobada.
- **Dado** que aparecen nuevas incidencias (porque mi correccion creo un nuevo problema), **cuando** revalido, **entonces** el panel refleja el nuevo estado consistentemente.
- **Dado** que el modelo es grande (>1000 cosas), **cuando** revalido, **entonces** la operacion termina en <2s (performance objetivo, a validar).

**Reglas y restricciones:**
- `Revalidate` es manual (HU-1C.018); auto-validacion on-change es decision separada (pregunta abierta §11 doc fuente).
- El resultado es determinista: dos ejecuciones sobre el mismo modelo arrojan el mismo resultado.

**Modelo de datos tocado:**
- `methodology_checks.*` — reescrito.
- `invalid_elements_by_rule.*` — reescrito.

**Dependencias:**
- Bloqueada por: HU-1C.014.

**Integraciones:**
- Kernel de validacion.
- Renderer del panel.

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` — reglas axiomaticas derivadas del estandar.
- Fuente OPCloud: §3.4 paso 6.
- Transcripcion: "al volver a chequear, la regla corregida cambia a estado verde".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, kernel, methodology, revalidacion].

---

### HU-1C.019 — Citar seccion SSOT OPM en cada regla metodologica

**Actor primario:** MN.
**Actores secundarios:** AD (autor de dominio).
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; L secundaria.
**Superficie UI:** panel-methodology (tooltip o enlace por regla).
**Gesto canonico:** hover o clic sobre icono de ayuda en cada regla.

**Historia:**
> Como modelador, quiero ver la cita a la seccion SSOT OPM correspondiente a cada regla metodologica para entender el fundamento teorico y no sentir las reglas como arbitrarias.

**Contexto de negocio:**
El diferencial de OPM como lenguaje formal es su trazabilidad con ISO 19450 y la SSOT interna. Cada regla debe poder citarse a una seccion (`§4.2` o `V-xx`); eso convierte el panel en un canal pedagogico pasivo que ensena el estandar mientras corrige el modelo.

**Criterios de aceptacion:**
- **Dado** que una regla esta visible en el panel, **cuando** hago hover o clic en el icono de ayuda, **entonces** veo la seccion SSOT que la fundamenta (p.ej. `Ver ssot/opm-iso-19450-es.md §4.2`).
- **Dado** que hago clic en la cita, **cuando** el enlace es accionable, **entonces** se abre el documento SSOT en la seccion correspondiente.
- **Dado** que una regla no tiene cita clara todavia, **cuando** miro el panel, **entonces** el icono de ayuda muestra "Seccion SSOT pendiente" (no vacio).

**Reglas y restricciones:**
- Cada regla canonica (5 de HU-1C.014) tiene su cita SSOT asignada en configuracion.
- La cita es estable: una vez fijada, el enlace no debe romperse aunque el SSOT se re-edite (anclas por seccion, no por line number).

**Modelo de datos tocado:**
- Configuracion estatica: `methodology_rule.rule_id.ssot_ref` — string.

**Dependencias:**
- Bloqueada por: HU-1C.014.

**Integraciones:**
- SSOT local (`ssot/opm-*.md`).

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [V-239] familias canonicas como referencia trazable.
- Fuente: inferido desde invariante del repo "SSOT OPM es autoridad absoluta" (CLAUDE.md) + principio pedagogico (§7.2).
- Clase de afirmacion: inferido.
- Etiqueta: `requires-clarification` (OPCloud puede no tener esta feature; es aporte del repo).

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, ui, methodology, ssot, pedagogico, requires-clarification, opcloud-ui].

---

### HU-1C.020 — Abrir dialogo Choose Remove Operation para cosa multi-apariencia

**Actor primario:** ME.
**Actores secundarios:** MN.
**Tipo:** mixto.
**Nivel categorico:** U primario; K (evaluacion multi-apariencia) secundaria.
**Superficie UI:** dialogo-choose-remove-operation.
**Gesto canonico:** tecla `Delete` o accion `remove` del pie menu sobre una cosa.

**Historia:**
> Como modelador, quiero que al intentar borrar una cosa que aparece en varios OPDs se me abra el dialogo `Choose Remove Operation` para decidir conscientemente el scope del borrado.

**Contexto de negocio:**
Este dialogo es la **evidencia UX mas explicita** del principio "entidad unica ↔ multiples apariencias" (§10 doc fuente + §13.1 metodologia reverse). Sin el, borrar una cosa podria borrar todas sus apariencias accidentalmente, rompiendo modelos en otros OPDs.

**Criterios de aceptacion:**
- **Dado** que una cosa `C1` aparece en ≥2 OPDs, **cuando** ejecuto `remove` sobre una apariencia, **entonces** se abre el dialogo `Choose Remove Operation`.
- **Dado** que el dialogo esta abierto, **cuando** miro, **entonces** veo titulo `Choose Remove Operation:`, tabla `This Element Appears in:` (HU-1C.021) y tres botones de scope (HU-1C.022) mas un boton `Cancel`.
- **Dado** que la cosa `C1` aparece en un solo OPD, **cuando** ejecuto `remove`, **entonces** el comportamiento es abierto: simplifica a `Remove from the entire model` directo o abre igual el dialogo con opciones reducidas (pregunta abierta §11.4 doc fuente).
- **Dado** que el dialogo esta abierto, **cuando** hago clic en `Cancel` o `x`, **entonces** se cierra sin eliminar nada.
- **Dado** que se abre el dialogo desde un enlace (no cosa), **cuando** se abre, **entonces** el dialogo tiene variante distinta (2 scopes) — ver EPICA-11 §4.1.

**Reglas y restricciones:**
- El dialogo es **bloqueante** — la decision es irreversible (salvo undo).
- Variante para enlace: documentada en `11-canvas-modelado-basico.md` §4.1, fuera del alcance de esta HU.

**Modelo de datos tocado:**
- Lectura: `cosa.appearances`, `appearance.opd_ref`.

**Dependencias:**
- Bloqueada por: HU-10.019 o equivalente (gesto remove).
- Bloquea a: HU-1C.021, HU-1C.022.

**Integraciones:**
- Kernel — evalua multi-apariencia.
- UI — renderiza dialogo.

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [V-1] principio de entidad unica con multiples apariencias.
- Fuente OPCloud: §10 `Modal Choose Remove Operation` (adaptacion explicita en doc fuente).
- Clase de afirmacion: observado (explicitamente documentado en §10).
- Pregunta abierta §11.4: comportamiento si la cosa aparece en un solo OPD.
- Etiqueta: `requires-clarification` sobre simplificacion para 1 OPD.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [canvas, ui, dialogo, remove, appearance, requires-clarification, mixto].

---

### HU-1C.021 — Listar apariciones del elemento con click-to-focus en la tabla

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** L primario (lente de apariciones); U secundaria.
**Superficie UI:** dialogo-choose-remove-operation (tabla `This Element Appears in:`).
**Gesto canonico:** clic en fila de la tabla.

**Historia:**
> Como modelador, quiero ver la tabla `This Element Appears in:` con todas las apariciones de la cosa y hacer click-to-focus en cualquiera para orientarme sobre las consecuencias antes de elegir scope de borrado.

**Contexto de negocio:**
La tabla materializa las apariciones como objetos inspeccionables antes de la decision destructiva. El click-to-focus permite al modelador **ir a ver** cada contexto sin cerrar el dialogo destructivamente, lo que previene errores. Dos columnas: `Element` (nombre + tipo) y `Location (Click To Focus)` (OPD contenedor).

**Criterios de aceptacion:**
- **Dado** que el dialogo `Choose Remove Operation` esta abierto, **cuando** miro, **entonces** veo una tabla con columnas `Element` y `Location (Click To Focus)`, una fila por apariencia.
- **Dado** que la tabla esta visible, **cuando** hago clic en una fila, **entonces** el canvas navega al OPD de esa apariencia y resalta el elemento (similar a HU-1C.017).
- **Dado** que hice click-to-focus, **cuando** vuelvo al modelo, **entonces** el dialogo sigue abierto — no se descarta mi contexto de decision.
- **Dado** que la cosa aparece en 10 OPDs, **cuando** miro la tabla, **entonces** es scrolleable dentro del dialogo (no empuja los botones fuera de vista).

**Reglas y restricciones:**
- El click-to-focus es no destructivo: solo navega.
- La tabla ordena por OPD (ascendente por path/nombre) — a validar.

**Modelo de datos tocado:**
- Lectura: `cosa.appearances`, `appearance.opd_ref`, `opd.path`.

**Dependencias:**
- Bloqueada por: HU-1C.020.
- Relaciona: HU-1C.017 (mismo patron click-to-focus).

**Integraciones:**
- OPD tree.
- Canvas.

**Notas de evidencia:**
- Fuente OPCloud: §10 doc fuente: "tabla `This Element Appears in:` con dos columnas (`Element`, `Location (Click To Focus)`). Cada fila lista una aparicion del elemento con click-to-focus para navegar al OPD correspondiente".
- Clase de afirmacion: observado.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, ui, dialogo, remove, navigator, appearance, opcloud-ui].

---

### HU-1C.022 — Ejecutar los tres scopes de borrado del Choose Remove Operation

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario (mutacion del modelo); V secundaria.
**Superficie UI:** dialogo-choose-remove-operation (tres botones de scope).
**Gesto canonico:** clic en uno de los tres botones.

**Historia:**
> Como modelador experto, quiero ejecutar tres scopes de borrado distintos (`this appearance only`, `all appearances from this OPD`, `from the entire model`) para controlar con precision el impacto del delete.

**Contexto de negocio:**
Los tres scopes materializan la separacion entre apariencia visual y entidad logica:
1. **`Remove this appearance only`** — preserva identidad logica, solo borra el dibujo actual.
2. **`Remove all appearance from this OPD`** — borra todas las apariciones en el OPD activo (si hay varias de la misma entidad alli), pero conserva la entidad y sus apariencias en otros OPDs.
3. **`Remove from the entire model`** — borra la entidad completa y todas sus apariencias en todo el modelo.

**Criterios de aceptacion:**
- **Dado** que la cosa `C1` tiene 3 apariencias: `A1` en OPD1, `A2` en OPD1, `A3` en OPD2. **Cuando** elijo `Remove this appearance only` sobre `A1`, **entonces** se elimina `A1` pero `A2`, `A3` y `C1` persisten.
- **Dado** el mismo escenario, **cuando** elijo `Remove all appearance from this OPD`, **entonces** se eliminan `A1` y `A2` pero `A3` y `C1` persisten.
- **Dado** el mismo escenario, **cuando** elijo `Remove from the entire model`, **entonces** se eliminan `A1`, `A2`, `A3` y la entidad `C1`.
- **Dado** que ejecute cualquier scope, **cuando** consulto el panel OPL-ES, **entonces** la vista refleja el nuevo estado (oraciones eliminadas si la entidad dejo de existir; apariciones desaparecidas si fue parcial).
- **Dado** que ejecute cualquier scope, **cuando** hago undo, **entonces** el estado anterior se restaura completamente (delegado a EPICA-90).

**Reglas y restricciones:**
- Scope 2 (`all appearances from this OPD`) solo es significativo cuando hay >1 apariencia en el OPD activo; puede ocultarse si hay una sola.
- Scope 3 (`from the entire model`) es el unico que muta `cosa.*` (elimina la entidad).
- La operacion es irreversible sin undo.
- Enlaces asociados a apariencias borradas se eliminan consistentemente (cascade).

**Modelo de datos tocado:**
- `appearance.*` — eliminadas parcial o totalmente segun scope.
- `cosa.*` — eliminado solo en scope 3.
- `enlace.*` — cascade si source/target desaparecen.

**Dependencias:**
- Bloqueada por: HU-1C.020.

**Integraciones:**
- Kernel — ejecuta la mutacion.
- Panel OPL-ES — re-render.
- Biblioteca lateral — actualiza (elimina entrada en scope 3).
- OPD tree — si el ultimo OPD de la cosa queda vacio, evalua cierre.

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [V-1] principio de entidad unica; mutacion controlada del modelo.
- Fuente OPCloud: §10 doc fuente (lista explicita de los 3 scopes).
- Clase de afirmacion: observado.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [canvas, kernel, remove, scope, appearance, cascade].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q1C.1 (§11.1 doc)**: ¿Los resultados de `Methodological Checking` se persisten o se recalculan siempre desde cero? Impacta HU-1C.014 (modelo de datos `methodology_checks`) y HU-1C.018 (performance de revalidacion).
- **Q1C.2 (§11.2 doc)**: ¿El estado "verde" de regla corregida tiene un color estable o algunos frames lo degradan por compresion? Impacta HU-1C.015 (render nitido de severity).
- **Q1C.3 (§11.3 doc)**: ¿Existe API o export estructurado de incidencias metodologicas aparte del dialogo? HU nueva candidata: HU-1C.023 (deferred hasta clarificar — export JSON/CSV de incidencias para revision offline).
- **Q1C.4 (§11.4 doc)**: Comportamiento del dialogo `Choose Remove Operation` cuando la cosa aparece en un solo OPD. Impacta HU-1C.020 (simplificacion del dialogo).
- **Q1C.5**: ¿Auto-validacion on-change (HU adicional) o solo revalidacion manual (HU-1C.018)? Tradeoff: latencia de feedback vs distraccion. Candidata HU-1C.024 marcada como diferida.
- **Q1C.6**: ¿Existe la accion `Suppress Warning` para callar una incidencia especifica aceptada (p.ej. un `Driver Rescue` que es process pero nombre propio)? Candidata HU-1C.025 — no observada en OPCloud pero es afordance ACL comun.
- **Q1C.7**: ¿`Use Existing Thing` es disponible cross-tipo si la `esencia` y `afiliacion` coinciden? §3.3 prohibe cross-tipo pero el detalle de la regla se delega a SSOT.
- **Q1C.8**: Comparacion case-sensitive vs insensitive en HU-1C.007 (colision de nombres).
- **Q1C.9**: ¿Se detectan ciclos de dependencia (circulos de enlace `A→B→C→A`) como regla adicional? No observado en las 5 canonicas pero relevante OPM — candidata HU-1C.026 diferida.
- **Q1C.10**: ¿Hay quick-fix suggestion ejecutable (p.ej. "Add `ing` suffix") desde el panel? Observada solo como sugerencia textual, no como accion — candidata HU-1C.027 diferida.
- **Q1C.11**: ¿Existe `Methodology Report` exportable (PDF/markdown) con el resumen de chequeo? Candidata HU-1C.028 diferida (relaciona con EPICA-60/61 export).
- **Q1C.12**: ¿Se valida que un enlace entre dos cosas no duplique un enlace existente del mismo tipo (enlace duplicado)? Candidata HU-1C.029 diferida.

## Referencias cruzadas

- Doc fuente: `opcloud-reverse/1c-canvas-validaciones.md`.
- Fuente normativa: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md`.
- Evidencia OPCloud: `JOYAS.md`, `sandbox-data/`, `assets/svg/`, `decompiled/`.
- Epicas que dependen de esta:
  - **EPICA-10** (creacion de cosas) — HU-10.001, HU-10.003 disparan HU-1C.007 al confirmar nombre; HU-10.012 (alternador afiliacion) interactua con validacion interior/exterior.
  - **EPICA-11** (modelado basico) — `§4.1` detalla variante del `Choose Remove Operation` para enlaces.
  - **EPICA-12** (descomposicion) — pre-requisito para HU-1C.001 a HU-1C.006 (requiere contenedores con descomposicion).
  - **EPICA-13** (estados) — la regla "objeto stateful ≥2 estados" podria agregarse como sexta regla metodologica (candidata).
  - **EPICA-1A** (grid/resize) — HU-1C.006 toca resize de contenedor.
  - **EPICA-1B** (bring operations) — bring-connected puede reactivar apariciones tras scope 1 de HU-1C.022.
  - **EPICA-20** (OPD tree) — HU-1C.017 y HU-1C.021 navegan al OPD contenedor.
  - **EPICA-50** (panel OPL-ES) — HU-1C.009, HU-1C.014 (regla `ing`), HU-1C.022 requieren re-render de OPL-ES.
  - **EPICA-82** (organization ontology) — ampliar reglas metodologicas con reglas de dominio.
  - **EPICA-90** (shortcuts) — `Delete` dispara HU-1C.020; undo restaura tras HU-1C.022.
  - **EPICA-A0** (stereotypes) — extensiones que pueden introducir reglas custom.
- Invariantes del repo:
  - `src/nucleo/validacion/` — 14 passes actuales, se amplian con reglas metodologicas (HU-1C.014) y de interior/exterior (HU-1C.001) y nombre duplicado (HU-1C.007).
  - `src/nucleo/tipos.ts` — `Cosa`, `Apariencia`, `Refinamiento` como estructuras base.
  - `src/render/layout/` — post-proceso correctivo de snap (HU-1C.002).
  - `src/render/jointjs/` — zonas header/interior del contenedor (HU-1C.004).
  - `src/persistencia/` — evaluar si `methodology_checks` es transitorio (recomendado) o persistente.
- SSOT OPM-ES:
  - `opm-iso-19450-es.md` — axiomas citados por HU-1C.019.
  - `metodologia-opm-es.md` — 5 reglas canonicas de HU-1C.014.
  - `opm-visual-es.md` — V-xx a citar para severity colors (HU-1C.015) y dashed border de advertencia (HU-1C.003).
- Arquitectura categorica: principio "entidad unica ↔ multiples apariencias" es la manifestacion UX del funtor `Reveal` en `docs/ARQUITECTURA-CATEGORICA.md` (relaciona E-xx — a identificar).
