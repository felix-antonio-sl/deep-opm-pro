---
epica: "EPICA-12"
titulo: "Canvas — descomposicion (in-zooming) de procesos"
doc_fuente: "opcloud-reverse/12-canvas-inzooming.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "M0"
hu_emitidas: 34
ultima_actualizacion: 2026-04-23
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
---

## Resumen

Esta epica cubre el mecanismo de **descomposicion** (in-zooming) de OPCloud: el gesto por el cual un proceso del OPD padre se transforma en un contenedor-envolvente que aloja sus subprocesos y objetos internos en un OPD hijo jerarquicamente ligado. Es el mecanismo primario de descomposicion y control de complejidad en OPM, y requiere coordinacion entre: gesto de activacion (menu contextual, barra contextual, atajos), creacion automatica de OPD hijo con denominacion `SDn`, preservacion de entidad unica a traves de apariencias [V-97], render de refinable con contorno grueso [V-33], edicion dentro del contenedor (anadir subprocesos, objetos internos, concurrencia), semantica temporal codificada en coordenada Y [V-35], distincion formal sincronica (`se descompone en` [OPL-ES CX1]) vs asincronica (`se despliega en` [OPL-ES CX3]), modo alternativo en diagrama, e integracion con arbol OPD, panel OPL-ES, biblioteca lateral y mini-navegador.

Las HU se numeran siguiendo la aparicion en el doc fuente. Cada HU es una unidad atomica de valor observable; los flows multi-paso se descomponen en HUs independientes.

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-12.001 | Activar menu contextual con boton "..." sobre proceso seleccionado | ME | M0 | S | mixto | — |
| HU-12.002 | Identificar opcion In-Zoom en menu contextual con tooltip | MN | M0 | XS | opcloud-ui | — |
| HU-12.003 | Ejecutar descomposicion desde el menu contextual y crear OPD hijo | ME | M0 | L | opm-semantica | [Glos 3.20] [V-62] [V-79] |
| HU-12.004 | Crear nodo SDn automaticamente en el arbol OPD | MN | M0 | S | mixto | [Glos 3.20] |
| HU-12.005 | Denominar nodo hijo con patron "SDn: <Proceso> descompuesto" | MN | M0 | XS | opcloud-ui | — |
| HU-12.006 | Cambiar area visible al OPD hijo tras ejecutar descomposicion | ME | M0 | S | mixto | — |
| HU-12.007 | Preservar entidad unica del proceso refinado a traves de OPDs | ME | M0 | M | opm-semantica | [V-95] [V-96] [V-97] |
| HU-12.008 | Renderizar proceso refinado como contenedor-envolvente | MN | M0 | M | opm-semantica | [V-33] [V-34] [V-79] [JOYAS §1] |
| HU-12.009 | Etiquetar contenedor con nombre en posicion superior-centro interior | MN | M0 | XS | opcloud-ui | [JOYAS §3] |
| HU-12.010 | Render de fase 1 "Mostrar contenido" con externos parciales | MN | S | M | opm-semantica | [V-62] [V-80] |
| HU-12.011 | Completar fase 2 "Refinar enlaces" con externos restantes | ME | S | L | mixto | [V-62] |
| HU-12.012 | Emitir oracion OPL-ES "se descompone en" al ejecutar descomposicion | MN | M0 | M | opm-semantica | [OPL-ES CX1] [OPL-ES CX4] |
| HU-12.013 | Anadir clausula "en esa secuencia" en OPL-ES de descomposicion | MN | M0 | S | opm-semantica | [OPL-ES CX1] [V-35] |
| HU-12.014 | Distinguir verbos OPL-ES de refinamiento | ME | M0 | M | opm-semantica | [Glos 3.20] [Glos 3.83] [OPL-ES CX1..CX3] |
| HU-12.015 | Crear subproceso dentro del contenedor por arrastre | MN | M0 | M | opm-semantica | [V-79] [Glos 3.20] [Glos 3.58] |
| HU-12.016 | Codificar orden temporal por coordenada Y del subproceso | MN | M0 | M | opm-semantica | [V-35] [V-77] |
| HU-12.017 | Crear subprocesos concurrentes en misma Y y emitir "paralelo" en OPL-ES | ME | M0 | M | opm-semantica | [V-32] [OPL-ES CX2] |
| HU-12.018 | Crear objeto interno dentro del contenedor | MN | M0 | M | opm-semantica | [V-84] [V-85] [Glos 3.39] |
| HU-12.019 | Emitir conector OPL-ES para objetos internos | MN | M0 | S | mixto | [OPL-ES CX1] |
| HU-12.020 | Restringir objeto interno al interior del contenedor | ME | M1 | L | opm-semantica | [V-84] [V-85] |
| HU-12.021 | Expandir contenedor al intentar sacar objeto interno hacia afuera | ME | M1 | L | opcloud-ui | — |
| HU-12.022 | Conectar subproceso interno con objeto interno | ME | M0 | S | opm-semantica | [V-61] [V-239] [V-240] |
| HU-12.023 | Renombrar subproceso in situ con dialogo emergente | MN | M0 | S | mixto | [Glos 3.76] [V-97] |
| HU-12.024 | Propagar rename de subproceso a biblioteca lateral y OPL-ES | ME | M0 | S | opm-semantica | [V-97] |
| HU-12.025 | Navegar entre OPDs cliqueando nodos del arbol | MN | M0 | S | opcloud-ui | — |
| HU-12.026 | Navegar al OPD hijo existente al re-ejecutar descomposicion | ME | M0 | S | opm-semantica | [V-62] |
| HU-12.027 | Eliminar descomposicion y revertir proceso refinable a proceso simple | ME | S | L | opm-semantica | [V-84] |
| HU-12.028 | Acceder a descomposicion de objeto en diagrama desde barra contextual | ME | S | L | opcloud-ui | — |
| HU-12.029 | Respetar afiliacion ambiental dentro del SD hijo | ME | M1 | M | opm-semantica | [V-71] [V-95] [JOYAS §1] |
| HU-12.030 | Restringir ambiental al interior del contenedor del SD hijo | ME | S | M | mixto | [V-84] [V-85] |
| HU-12.031 | Render "parentesis" del contorno: enlace al borde distribuye a subprocesos | ME | S | L | mixto | [V-91] [V-92] |
| HU-12.032 | Actualizar mini-navegador al cambiar de OPD | MN | M1 | S | opcloud-ui | — |
| HU-12.033 | Poblar biblioteca lateral con subprocesos y objetos internos nuevos | MN | M0 | S | opcloud-ui | — |
| HU-12.034 | Serializar relacion padre-hijo entre OPDs al guardar el modelo | ME | M0 | M | opm-semantica | [V-62] |

Total: **34 historias de usuario** (18 opm-semantica, 8 opcloud-ui, 8 mixto).


## Historias de usuario

### HU-12.001 — Activar menu contextual con boton "..." sobre proceso seleccionado

**Actor primario:** ME (modelador experto).
**Actores secundarios:** MN (novato — lo descubre al seleccionar).
**Tipo:** mixto.
**Nivel categorico:** U primario.
**Superficie UI:** menu-contextual (JointJS) + boton `pie-toggle`.
**Gesto canonico:** seleccionar cosa + clic en boton `...` de la seleccion.

**Historia:**
> Como modelador, quiero abrir el menu contextual con las acciones principales del proceso pulsando los tres puntos tras seleccionarlo, para acceder a descomposicion y otras acciones sin viajar a la barra.

**Contexto de negocio:**
La necesidad de un menu contextual proximo a la seleccion es generica (no es especifica de OPCloud). OPCloud implementa el halo radial con clases `joint-halo pie type-element animate`. La transcripcion del sandbox confirma que el halo no se abre por hover prolongado sino al **seleccionar** la cosa y pulsar **los tres puntos**. Es el portal de entrada a la descomposicion (in-zooming) y a otras acciones clave. La implementacion visual puede divergir del halo radial; el concepto "menu contextual con acciones frecuentes" es el requisito.

**Criterios de aceptacion:**
- **Dado** que hay un proceso en el canvas, **cuando** lo selecciono con clic simple, **entonces** aparece el boton `...` (pie-toggle) junto a la seleccion.
- **Dado** que la seleccion muestra el boton `...`, **cuando** hago clic en el, **entonces** se abre el menu contextual con iconos distribuidos circularmente sobre el proceso.
- **Dado** que el menu contextual esta abierto, **cuando** hago clic en el icono de cierre, **entonces** el menu se cierra sin aplicar accion.
- **Dado** que el menu esta abierto, **cuando** hago clic fuera del menu, **entonces** el menu se cierra sin aplicar accion.

**Reglas y restricciones:**
- La apertura requiere **seleccion previa + clic en boton**, no hover prolongado. [Evidencia OPCloud: transcripcion §1.1]
- La implementacion visual puede divergir de OPCloud (no requiere halo radial especificamente).
- La posicion del boton `...` es derivada de la bounding box de la seleccion.

**Modelo de datos tocado:**
- Ninguno (interaccion transitoria de UI).

**Dependencias:**
- Bloqueada por: HU-10.001 (proceso creado).
- Relacionada: HU-10.019 (menu contextual de cosa).
- Bloquea a: HU-12.002, HU-12.003.

**Integraciones:**
- JointJS halo (o implementacion alternativa de menu contextual).
- Barra contextual (alternativa no radial).

**Notas de evidencia:**
- Fuente normativa: necesidad generica de menu contextual, no exigida por la SSOT.
- Fuente OPCloud: `opcloud-reverse/12-canvas-inzooming.md` §1.1, §3.1 paso 2, §5.3.
- Frames: frame_00010 (carpeta 04).
- Clase de afirmacion: confirmado por transcripcion.
- Etiqueta: `mixto` — la necesidad es generica, la implementacion es referencial.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [canvas, ui, menu-contextual, descomposicion, seleccion].

---


### HU-12.002 — Identificar opcion In-Zoom en menu contextual con tooltip

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** menu-contextual + tooltip negro.
**Gesto canonico:** hover sobre icono `(i)` del menu contextual.

**Historia:**
> Como modelador novato, quiero reconocer inequivocamente el boton "In-Zoom" en el menu contextual mediante tooltip, para no confundirlo con otros iconos del menu.

**Contexto de negocio:**
El menu contextual tiene 8 iconos distribuidos circularmente en OPCloud. Sin tooltips, el usuario novato no puede distinguir "In-Zoom" (descomposicion) de despliegue (unfolding) o de otras acciones. El tooltip negro con texto blanco ("In-Zoom") confirma la accion al hover. Es una afordance OPCloud; la implementacion puede divergir del tooltip negro especifico.

**Criterios de aceptacion:**
- **Dado** que el menu contextual esta abierto, **cuando** hago hover sobre el icono `(i)` en circulo, **entonces** aparece un tooltip con el texto "In-Zoom". [OPCloud §3.1]
- **Dado** que quito el hover del icono, **cuando** el cursor sale, **entonces** el tooltip desaparece.
- **Dado** que paso el cursor sobre otros iconos del menu, **cuando** hover en cada uno, **entonces** veo tooltips correspondientes ("Bring Connected Elements", "Add Time Duration", etc.). [OPCloud §5.3]

**Reglas y restricciones:**
- Tooltip en OPCloud: fondo negro, texto blanco, tipografia estandar del producto.
- El tooltip es flotante sobre el icono, no centrado en el elemento.
- "In-Zoom" se representa con icono `(i)` dentro de circulo en OPCloud.

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-12.001.

**Integraciones:**
- Sistema de tooltips (convencion del producto).

**Notas de evidencia:**
- Fuente OPCloud: `opcloud-reverse/12-canvas-inzooming.md` §3.1 paso 3, §5.3 tabla.
- Frames: frame_00014 (tooltip "In-Zoom" visible), frame_00012, frame_00010.
- Clase de afirmacion: observado.
- Etiqueta: `opcloud-ui` — afordance visual de OPCloud, no exigida por la SSOT.

**Prioridad:** M0.
**Tamano:** XS.
**Etiquetas:** [canvas, ui, menu-contextual, tooltip, descomposicion, pedagogico, opcloud-ui].

---


### HU-12.003 — Ejecutar descomposicion desde el menu contextual y crear OPD hijo

**Actor primario:** ME.
**Actores secundarios:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario (crea OPD hijo, transforma proceso); V, L secundarios.
**Superficie UI:** menu-contextual + canvas + arbol OPD + panel OPL-ES.
**Gesto canonico:** clic en icono "In-Zoom".

**Historia:**
> Como modelador, quiero ejecutar descomposicion con un clic en el menu contextual para crear automaticamente un OPD hijo donde refino el proceso seleccionado.

**Contexto de negocio:**
La SSOT OPM [Glos 3.20] define la descomposicion (in-zooming) como el refinamiento que expone el contenido interno de una cosa en un OPD hijo. El gesto de descomposicion es la operacion fundamental de descomposicion en OPM. Ejecutarlo desencadena una transformacion coordinada: creacion de un nodo en el arbol, cambio de area visible, render de contenedor-envolvente [V-79], emision de OPL-ES [OPL-ES CX1, CX4]. Es un M0 absoluto porque sin el no hay descomposicion.

**Criterios de aceptacion:**
- **Dado** que el menu contextual esta abierto sobre un proceso `P`, **cuando** hago clic en el icono In-Zoom, **entonces** se crea un nuevo OPD hijo vinculado a `P`. [V-62]
- **Dado** que se ejecuto la descomposicion, **cuando** el sistema procesa, **entonces** se dispara la transicion: arbol OPD gana nodo, area visible cambia al OPD hijo, contenedor se renderiza [V-79], OPL-ES se actualiza [OPL-ES CX1, CX4].
- **Dado** que ejecute descomposicion, **cuando** vuelvo al OPD padre (navegando con el arbol), **entonces** `P` sigue existiendo con el mismo ID (entidad unica preservada) [V-97].
- **Dado** que un proceso no estaba refinado, **cuando** ejecuto descomposicion una sola vez, **entonces** se crea exactamente un OPD hijo (idempotencia: cf. HU-12.026).

**Reglas y restricciones:**
- La descomposicion es una operacion **compuesta**: dispara creacion de OPD hijo + cambio de area visible + render + OPL-ES. No hay estado intermedio observable para el usuario. [V-62]
- El proceso `P` mantiene su identidad (`cosa.id`) en ambos OPDs. [V-97]
- Los subprocesos preconfigurados observados (`B Processing`, `C Processing`, `D Processing`) son **hipotesis** sobre el estado inicial post-descomposicion (§3.1 paso 5 doc fuente): esto puede ser un template observado en sandbox, no garantizado por la SSOT.

**Modelo de datos tocado:**
- `opd.id` — string (`SD1`, `SD2`, ...) — persistente.
- `opd.tipo` — `"descompuesto"` — persistente.
- `opd.padre` — ID del OPD padre — persistente.
- `opd.proceso_refinado` — ID del proceso `P` — persistente.
- `cosa.esta_refinado` (derivable) — bool — derivado.

**Dependencias:**
- Bloqueada por: HU-12.001, HU-12.002.
- Bloquea a: HU-12.004, HU-12.005, HU-12.006, HU-12.008, HU-12.012, HU-12.015 (todas las siguientes dependen del OPD hijo existente).

**Integraciones:**
- Arbol OPD: gana nodo (HU-12.004).
- Area visible: cambia (HU-12.006).
- Panel OPL-ES: emite oracion [OPL-ES CX1, CX4] (HU-12.012).
- Mini-navegador: se regenera (HU-12.032).
- Biblioteca lateral: conserva entidad unica (HU-12.033).

**Notas de evidencia:**
- Fuente normativa: [Glos 3.20] Descomposicion; [V-62] dos fases de descomposicion; [V-79] contenedor en OPD hijo.
- Fuente OPCloud: `opcloud-reverse/12-canvas-inzooming.md` §3.1 pasos 4-6.
- Frames: frame_00015, frame_00017.
- Transcripcion: "los dos comandos principales del halo son Unfold e In-Zoom, y si la cosa ya fue refinada el comando navega al OPD existente".
- Clase de afirmacion: confirmado por transcripcion + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** L (toca kernel + render + lente OPL-ES + arbol OPD + persistencia).
**Etiquetas:** [canvas, kernel, descomposicion, opd-tree, opl-es, render].

---


### HU-12.004 — Crear nodo SDn automaticamente en el arbol OPD

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categorico:** K primario; L (arbol OPD es lente del modelo).
**Superficie UI:** panel-izquierdo-opd-tree.
**Gesto canonico:** ninguno (derivado de descomposicion).

**Historia:**
> Como modelador, quiero ver aparecer automaticamente el nuevo OPD hijo en el arbol cuando ejecuto descomposicion, para tener navegacion inmediata al nuevo contexto.

**Contexto de negocio:**
La SSOT [Glos 3.20] define que la descomposicion produce un OPD hijo jerarquicamente ligado. La vista de arbol es una afordance de navegacion que OPCloud implementa; la necesidad de visualizar la jerarquia es generica. Que cada descomposicion agregue un nodo automaticamente mantiene el flujo sin interrupciones. La numeracion correlativa (`SD`, `SD1`, `SD2`, ...) es cosmetica pero importante para orientacion.

**Criterios de aceptacion:**
- **Dado** que ejecute descomposicion sobre un proceso, **cuando** termina la transicion, **entonces** aparece un nuevo nodo hijo bajo el nodo `SD` del arbol.
- **Dado** que el nodo aparece, **cuando** miro el arbol, **entonces** esta resaltado en azul claro (seleccion activa). [OPCloud §3.1]
- **Dado** que hago mas descomposiciones, **cuando** cada una completa, **entonces** los IDs siguen orden correlativo (`SD1`, `SD2`, `SD3`, ...).
- **Dado** que elimino un OPD hijo (HU-12.027), **cuando** borro, **entonces** la numeracion **no recicla IDs** (hipotesis: deja huecos o renumera — **abierto**).

**Reglas y restricciones:**
- Nodos nuevos aparecen como hijos directos del nodo padre en el arbol.
- Numeracion correlativa por orden de creacion; profundidad no se codifica en el numero (un `SD2` puede ser hermano de `SD1` o su hijo, segun jerarquia real).
- Nodo recien creado queda seleccionado automaticamente.

**Modelo de datos tocado:**
- `opd.id` — string correlativo — persistente.
- `opd.orden_creacion` — entero — persistente.
- Arbol: relacion `opd.padre` define la jerarquia.

**Dependencias:**
- Bloqueada por: HU-12.003.
- Bloquea a: HU-12.005, HU-12.025.

**Integraciones:**
- Arbol OPD (panel izquierdo).

**Notas de evidencia:**
- Fuente normativa: [Glos 3.20] descomposicion produce OPD hijo.
- Fuente OPCloud: `opcloud-reverse/12-canvas-inzooming.md` §3.1 paso 4, §9 numeracion de nodos OPD.
- Frames: frame_00015, frame_00017.
- Clase de afirmacion: observado + confirmado.
- Etiqueta: `mixto` — jerarquia de OPDs es SSOT, arbol como widget es OPCloud.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [opd-tree, kernel, naming, correlativo].

---

### HU-12.005 — Denominar nodo hijo con patron "SDn: <Proceso> descompuesto"

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** L (label derivado); V secundario.
**Superficie UI:** panel-izquierdo-opd-tree + panel-opl-es.
**Gesto canonico:** ninguno (label generado automaticamente).

**Historia:**
> Como modelador, quiero que cada nodo hijo se etiquete con `SDn: <Proceso> descompuesto` para identificar de un vistazo que proceso refina y de que tipo es el refinamiento.

**Contexto de negocio:**
La convencion `SD1: Driver Rescuing descompuesto` codifica tres datos: ID del OPD (`SD1`), proceso refinado (`Driver Rescuing`) y tipo de refinamiento (`descompuesto`). El sufijo `descompuesto` distingue de `desplegado`, `desplegado-por-rasgos`, `desplegado-por-especializaciones`. Es la convencion observada en OPCloud y replicable. La SSOT no prescribe este formato de etiqueta; es una convencion OPCloud.

**Criterios de aceptacion:**
- **Dado** que ejecute descomposicion sobre `Driver Rescuing`, **cuando** miro el arbol, **entonces** veo nodo `SD1: Driver Rescuing descompuesto`. [OPCloud §5.4]
- **Dado** que ejecuto descomposicion sobre otro proceso, **cuando** se crea `SD2`, **entonces** la etiqueta es `SD2: <nombre-proceso> descompuesto`.
- **Dado** que renombro el proceso refinado, **cuando** propago rename (HU-12.024), **entonces** la etiqueta del nodo actualiza el nombre del proceso. [V-97]
- **Dado** que el refinamiento es despliegue-por-partes, **cuando** miro el nodo, **entonces** el sufijo es `desplegado` (no `descompuesto`) — regla paralela.

**Reglas y restricciones:**
- Patron literal: `<OPD_ID>: <proceso_refinado_nombre> <sufijo-refinamiento>`.
- Sufijos validos: `descompuesto`, `desplegado`, `desplegado-por-rasgos`, `desplegado-por-especializaciones`.
- Label es derivado; no se persiste, se recalcula en render del arbol.

**Modelo de datos tocado:**
- Ninguno (label derivado de `opd.id` + `opd.proceso_refinado` + `opd.tipo_refinamiento`).

**Dependencias:**
- Bloqueada por: HU-12.003, HU-12.004.

**Integraciones:**
- Arbol OPD (render del label).
- Panel OPL-ES (usa misma nomenclatura).

**Notas de evidencia:**
- Fuente OPCloud: `opcloud-reverse/12-canvas-inzooming.md` §3.1 paso 4, §5.4.
- Frames: frame_00015, frame_00017.
- Clase de afirmacion: observado.
- Etiqueta: `opcloud-ui` — convencion de etiquetado especifica de OPCloud.

**Prioridad:** M0.
**Tamano:** XS.
**Etiquetas:** [opd-tree, naming, opl-es, derivado, opcloud-ui].

---

### HU-12.006 — Cambiar area visible al OPD hijo tras ejecutar descomposicion

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** U primario; V secundario.
**Superficie UI:** canvas principal.
**Gesto canonico:** ninguno (transicion automatica post-descomposicion).

**Historia:**
> Como modelador, quiero que el area visible del canvas cambie automaticamente al OPD hijo recien creado para entrar directamente al contexto de edicion refinado.

**Contexto de negocio:**
Cambiar el area visible ahorra al usuario un clic manual en el arbol. Es la continuacion natural del gesto "quiero refinar esto → muestrame donde". La navegacion entre OPDs es una necesidad generica; la transicion automatica es una afordance de UX de OPCloud que puede implementarse de forma diferente.

**Criterios de aceptacion:**
- **Dado** que ejecute descomposicion, **cuando** termina la transicion, **entonces** el canvas muestra el OPD hijo (no el padre).
- **Dado** que el area visible cambio, **cuando** miro el arbol, **entonces** el nodo hijo aparece resaltado (sincronia area visible ↔ seleccion en arbol). [OPCloud §3.1]
- **Dado** que estoy en el OPD hijo, **cuando** hago clic en el nodo padre del arbol, **entonces** el area visible regresa al padre.

**Reglas y restricciones:**
- Transicion inmediata; no hay animacion obligatoria (hipotesis).
- El cambio de area visible es **atomico con la creacion del OPD hijo** — no hay estado "OPD creado pero no visible".

**Modelo de datos tocado:**
- `appState.opd_activo` — ID del OPD — transitorio (UI state).

**Dependencias:**
- Bloqueada por: HU-12.003.
- Bloquea a: HU-12.025.

**Integraciones:**
- Arbol OPD (sincronia de seleccion).
- Barra contextual (cambia segun OPD, §5.2 doc fuente).

**Notas de evidencia:**
- Fuente OPCloud: `opcloud-reverse/12-canvas-inzooming.md` §3.1 paso 4 bullet 1.
- Frames: frame_00015, frame_00017.
- Clase de afirmacion: observado.
- Etiqueta: `mixto` — navegacion entre OPDs es generica, transicion automatica es OPCloud.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [canvas, navegacion, area-visible, opd-tree].

---

### HU-12.007 — Preservar entidad unica del proceso refinado a traves de OPDs

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** K (axioma de identidad OPM).
**Superficie UI:** ninguna directa (invariante del modelo).
**Gesto canonico:** ninguno (propiedad semantica).

**Historia:**
> Como modelador experto, quiero que el proceso refinado mantenga su identidad (mismo `id`) cuando aparece en padre y en hijo, para que cualquier cambio (nombre, atributos, enlaces) se propague automaticamente a todas sus apariencias.

**Contexto de negocio:**
El axioma OPM de **entidad unica, multiples apariencias** [V-97] es lo que distingue OPM de un mero diagramador. La entidad `Driver Rescuing` es una sola; aparece en SD (como proceso simple) y en SD1 (como contenedor). Cambiar su nombre desde el arbol, desde SD o desde SD1 debe propagar a todas las apariencias instantaneamente [V-97]. La esencia [V-95] y la perseverancia [V-96] tampoco cambian a traves del refinamiento.

**Criterios de aceptacion:**
- **Dado** que ejecute descomposicion sobre `Driver Rescuing`, **cuando** inspecciono el modelo, **entonces** existe una sola entidad `cosa.id = <UUID>` referenciada desde SD y desde SD1. [V-97]
- **Dado** que estoy en el OPD hijo, **cuando** renombro el proceso (desde etiqueta del contenedor), **entonces** el nombre se propaga al SD padre y al nodo del arbol. [V-97]
- **Dado** que cambio la esencia o afiliacion del proceso en SD, **cuando** navego a SD1, **entonces** el contenedor en SD1 refleja el cambio. [V-95]
- **Dado** que elimino el proceso desde la biblioteca lateral, **cuando** confirmo eliminacion, **entonces** desaparece de todos los OPDs donde aparece (cascada). [V-84]

**Reglas y restricciones:**
- `cosa.id` es UUID unico global del modelo. [V-97]
- Cada OPD tiene una coleccion de **apariencias** (refs a entidades con posicion, estilo opcional, etc.) — nunca duplica la entidad.
- Rename en cualquier apariencia propaga a la entidad logica. [V-97]
- La esencia no cambia a traves del refinamiento. [V-95]
- La perseverancia no cambia a traves del refinamiento. [V-96]

**Modelo de datos tocado:**
- `cosa.id` — UUID — persistente.
- `apariencia.cosa_id` — ref a entidad — persistente.
- `apariencia.opd_id` — ref al OPD — persistente.
- `apariencia.posicion` — `{x, y}` — persistente.

**Dependencias:**
- Bloqueada por: HU-12.003.
- Bloquea a: HU-12.024, HU-12.033.

**Integraciones:**
- Biblioteca lateral (lista entidades, no apariencias).
- Panel OPL-ES (menciona entidades una vez por rol).

**Notas de evidencia:**
- Fuente normativa: [V-97] nombres consistentes; [V-95] esencia invariante; [V-96] perseverancia invariante.
- Fuente OPCloud: `opcloud-reverse/12-canvas-inzooming.md` §6 modelo de datos implicito.
- Clase de afirmacion: confirmado por transcripcion + confirmado por SSOT.

**Prioridad:** M0 (axioma OPM).
**Tamano:** M (toca kernel + lente + propagacion).
**Etiquetas:** [kernel, identidad, entidad-unica, apariencia].

---


### HU-12.008 — Renderizar proceso refinado como contenedor-envolvente

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** V primario.
**Superficie UI:** canvas-render.
**Gesto canonico:** ninguno (render declarativo).

**Historia:**
> Como modelador, quiero ver el proceso refinado renderizado como una elipse grande de contorno grueso en el OPD hijo, para identificar visualmente que es un contenedor-envolvente con contenido dentro.

**Contexto de negocio:**
La SSOT [V-33] define que el **refinable** (proceso con descomposicion) se marca con contorno grueso (~3-4x linea normal), tanto en el padre como en el hijo. [V-34] establece que la elipse del proceso refinable se agranda para contener los subprocesos como elipses menores. [V-79] confirma que la cosa refinada aparece como contenedor en el OPD hijo. Es la senal visual inconfundible de "esto tiene dentro".

**Criterios de aceptacion:**
- **Dado** que estoy en el OPD hijo tras una descomposicion, **cuando** miro el canvas, **entonces** el proceso refinado aparece como elipse grande con contorno grueso (~3-4x grosor normal). [V-33] [V-34] [V-79]
- **Dado** que miro el proceso en el OPD padre, **cuando** reviso su borde, **entonces** tambien tiene contorno grueso (consistencia V-33).
- **Dado** que un proceso NO esta refinado, **cuando** miro su borde, **entonces** es linea normal (~2px) con sombra. [JOYAS §2, §4]
- **Dado** que cambio tema/estilo, **cuando** aplico override, **entonces** el contorno grueso se respeta como marcador semantico (no puramente estilistico).

**Reglas y restricciones:**
- Contorno grueso: grosor ~3-4x linea normal. [V-33]
- El refinable aparece con contorno grueso tanto en OPD padre como en OPD hijo. [V-33]
- La elipse se agranda para contener subprocesos. [V-34]
- Color de borde de proceso: `#3BC3FF` (cyan). [JOYAS §1]
- Dimensiones canonicas base: 135x60 px, expandibles para contener subprocesos. [JOYAS §2]

**Modelo de datos tocado:**
- Ninguno persistente; render derivado de `cosa.esta_refinado` (flag derivado).

**Dependencias:**
- Bloqueada por: HU-12.003.
- Bloquea a: HU-12.009, HU-12.010.

**Integraciones:**
- Renderer JointJS.
- Motor de estilo.

**Notas de evidencia:**
- Fuente normativa: [V-33] contorno grueso; [V-34] elipse agrandada; [V-79] contenedor en OPD hijo.
- Fuente OPCloud: `opcloud-reverse/12-canvas-inzooming.md` §3.1 paso 1, §5.5.
- Evidencia visual: JOYAS §1 color `#3BC3FF`, §2 dimensiones 135x60, §4 wrapper+line.
- Frames: frame_00001, frame_00015, frame_00017.
- Clase de afirmacion: observado + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [render, descomposicion, contenedor, visual].

---

### HU-12.009 — Etiquetar contenedor con nombre en posicion superior-centro interior

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** V.
**Superficie UI:** canvas-render.
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador, quiero ver el nombre del proceso refinado en la parte superior-centro interior del contenedor (dentro del ovalo, no sobre el contorno), para distinguirlo visualmente del label de un proceso simple.

**Contexto de negocio:**
La posicion del label cambia entre proceso simple (centrado) y refinable (superior-centro interior). Esto libera el centro para albergar los subprocesos y preserva la semantica "este ovalo es un contenedor". Es una convencion de layout observada en OPCloud; la SSOT no prescribe la posicion exacta del label dentro del contenedor.

**Criterios de aceptacion:**
- **Dado** que tengo un contenedor en el OPD hijo, **cuando** miro su label, **entonces** el nombre aparece **dentro** del ovalo, alineado al borde superior-centro. [OPCloud §5.5]
- **Dado** que tengo un proceso simple (no refinado), **cuando** miro su label, **entonces** el nombre aparece centrado vertical y horizontalmente.
- **Dado** que el contenedor es pequeno y el nombre largo, **cuando** rendereo, **entonces** el label no debe colisionar visualmente con los subprocesos internos (regla de layout).

**Reglas y restricciones:**
- Posicion: anclada al borde superior interno, centrada horizontalmente.
- El label esta **dentro** del contorno, no sobre ni fuera.
- Tipografia consistente con procesos simples: Arial 14px semibold, text-anchor: middle. [JOYAS §3]

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-12.008.

**Integraciones:**
- Renderer JointJS.
- Pase de layout.

**Notas de evidencia:**
- Fuente OPCloud: `opcloud-reverse/12-canvas-inzooming.md` §2 tabla, §5.5.
- Evidencia visual: JOYAS §3 tipografia Arial 14px semibold.
- Frames: frame_00015, frame_00017.
- Clase de afirmacion: observado.
- Etiqueta: `opcloud-ui` — convencion de layout OPCloud, no exigida por la SSOT.

**Prioridad:** M0.
**Tamano:** XS.
**Etiquetas:** [render, descomposicion, label, layout, opcloud-ui].

---

### HU-12.010 — Render de fase 1 "Mostrar contenido" con externos parciales

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** V primario; L secundario.
**Superficie UI:** canvas-opd-hijo.
**Gesto canonico:** ninguno (render post-descomposicion).

**Historia:**
> Como modelador, quiero que el OPD hijo recien creado muestre solo los externos directamente conectados al proceso refinado, para ver un refinamiento legible sin saturarlo con todos los externos del padre.

**Contexto de negocio:**
La SSOT [V-62] define que la descomposicion se ejecuta en dos fases. [V-80] establece que las cosas conectadas al refinado se copian como elementos externos. La fase 1 prioriza legibilidad.

**Criterios de aceptacion:**
- **Dado** que ejecute descomposicion, **cuando** se renderiza el OPD hijo, **entonces** aparecen solo los externos conectados directamente al proceso refinado en el padre. [V-62] [V-80]
- **Dado** que la fase 1 esta activa, **cuando** reviso la barra, **entonces** hay un modo para completar refinamiento (fase 2, HU-12.011).

**Reglas y restricciones:**
- Determinacion de externos: hay enlace entre el externo y el proceso refinado en el padre. [V-81]
- Los externos heredan su apariencia del padre (borde discontinuo si ambiental, etc.). [V-71]
- **Hipotesis abierta**: quien decide exactamente que entra en fase 1. Etiqueta: `requires-clarification`.

**Modelo de datos tocado:**
- Apariencias en el OPD hijo: creadas para los externos directos. [V-80]

**Dependencias:**
- Bloqueada por: HU-12.003.
- Bloquea a: HU-12.011.

**Notas de evidencia:**
- Fuente normativa: [V-62] dos fases; [V-80] copia de externos; [V-81] todas las cosas conectadas.
- Fuente OPCloud: `opcloud-reverse/12-canvas-inzooming.md` §3.1 paso 5.
- Frames: frame_00015, frame_00017.
- Clase de afirmacion: observado + confirmado por SSOT en su estructura general; hipotesis en detalle.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [render, descomposicion, fase-1, layout, requires-clarification].

---

### HU-12.011 — Completar fase 2 "Refinar enlaces" con externos restantes

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** V primario; L, K secundarios.
**Superficie UI:** canvas-opd-hijo + barra contextual.
**Gesto canonico:** accion del usuario ("Bring Connected Elements" o equivalente — **abierto**).

**Historia:**
> Como modelador experto, quiero completar la fase 2 de la descomposicion trayendo los externos restantes y redistribuyendo enlaces sobre los subprocesos, para construir el refinamiento completo.

**Contexto de negocio:**
La SSOT [V-62] establece la fase 2: Refinar Enlaces. Fase 2 completa el refinamiento: externos ausentes, bus de agregacion, enlaces redistribuidos. El mecanismo exacto es una afordance OPCloud; la necesidad de completar el refinamiento es SSOT.

**Criterios de aceptacion:**
- **Dado** que estoy en OPD hijo fase 1, **cuando** ejecuto la accion de completar, **entonces** aparecen los externos transitivos ausentes. [V-62]
- **Dado** que complete fase 2, **cuando** miro el contenedor de agregacion, **entonces** el peine conserva el triangulo lleno como indicador de agregacion. [OPCloud §3.1]
- **Dado** que un enlace del padre conectaba al proceso refinado, **cuando** completo fase 2, **entonces** el enlace se redistribuye a un subproceso interno.
- **Dado** que fase 2 esta completa, **cuando** consulto panel OPL-ES, **entonces** las oraciones reflejan los externos presentes.

**Reglas y restricciones:**
- La fase 2 es requerida por la SSOT [V-62]; el mecanismo exacto de activacion es OPCloud.
- **Pregunta abierta** (§11 doc fuente Q5): ¿boton explicito o iterativo? Etiqueta: `requires-clarification`.
- La redistribucion respeta la gramatica OPM. [V-239] [V-240]

**Modelo de datos tocado:**
- Apariencias nuevas para externos transitivos.
- Enlaces redirigidos (origen/destino pueden cambiar entre OPDs).

**Dependencias:**
- Bloqueada por: HU-12.010.
- Relacionada: HU-12.031 (parentesis), EPICA-1B (Bring Connected).

**Notas de evidencia:**
- Fuente normativa: [V-62] fase 2 Refinar Enlaces.
- Fuente OPCloud: `opcloud-reverse/12-canvas-inzooming.md` §3.1 paso 6, §11 Q5.
- Frames: frame_00033, frame_00041, frame_00043.
- Clase de afirmacion: observado + hipotesis sobre mecanismo.
- Etiqueta: `mixto` — dos fases son SSOT, mecanismo de activacion es OPCloud.

**Prioridad:** S.
**Tamano:** L.
**Etiquetas:** [render, descomposicion, fase-2, layout, kernel, requires-clarification].

---
### HU-12.012 — Emitir oracion OPL-ES "se descompone en" al ejecutar descomposicion

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** L (lente OPL-ES); K (integridad gramatica).
**Superficie UI:** panel-opl-es.
**Gesto canonico:** ninguno (derivado de descomposicion).

**Historia:**
> Como modelador, quiero ver en el panel OPL-ES la oracion de descomposicion al ejecutarla, para leer la descomposicion en lenguaje natural.

**Contexto de negocio:**
OPL-ES es la lente textual del modelo. La oracion `se descompone en` [OPL-ES CX1] es el operador formal. La SSOT establece la representacion bimodal OPD/OPL-ES.

**Criterios de aceptacion:**
- **Dado** que ejecute descomposicion sobre `Driver Rescuing` creando `SD1` con subprocesos, **cuando** miro el panel OPL-ES, **entonces** veo `*Driver Rescuing* del SD se descompone en SD1 en *B Processing*, *C Processing* y *D Processing*.` [OPL-ES CX1]
- **Dado** que la descomposicion es el primer refinamiento del SD, **cuando** consulto panel OPL-ES, **entonces** tambien aparece: `SD se refina por descomposicion de *Driver Rescuing* en SD1.` [OPL-ES CX4]
- **Dado** que agrego/renombro subprocesos, **cuando** cambio la composicion, **entonces** la oracion se actualiza.

**Reglas y restricciones:**
- Formato OPL-ES: `*Proceso* del <OPD_padre> se descompone en <OPD_hijo> en <lista_subprocesos>, en esa secuencia.` [OPL-ES CX1]
- Formato refinamiento: `SD se refina por descomposicion de *Proceso* en SDn.` [OPL-ES CX4]
- OPL-ES se regenera desde el modelo, sin cache.
- Convenciones: Proceso en *cursiva*, Objeto en **negrita**, Estado en `monoespaciado`.

**Modelo de datos tocado:**
- Ninguno (lente pura).

**Dependencias:**
- Bloqueada por: HU-12.003.
- Bloquea a: HU-12.013, HU-12.014, HU-12.019.

**Notas de evidencia:**
- Fuente normativa: [OPL-ES CX1] descomposicion; [OPL-ES CX4] refinamiento de OPD.
- Fuente OPCloud: `opcloud-reverse/12-canvas-inzooming.md` §3.1 paso 4, §5.4.
- Clase de afirmacion: observado + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [opl-es, lente, descomposicion, vocabulario].
---
### HU-12.013 — Anadir clausula "en esa secuencia" en OPL-ES de descomposicion

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** L.
**Superficie UI:** panel-opl-es.
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador, quiero que la oracion agregue la clausula `en esa secuencia` cuando los subprocesos tienen orden temporal, para diferenciar sincronia de asincronia.

**Contexto de negocio:**
La clausula `en esa secuencia` [OPL-ES CX1] es el marcador de sincronia temporal. Aparece solo con `se descompone en` y solo con orden vertical no concurrente. La SSOT [V-35] define que la linea temporal fluye de arriba hacia abajo.

**Criterios de aceptacion:**
- **Dado** que los subprocesos tienen distintas Y, **cuando** miro el panel OPL-ES, **entonces** aparece `..., en esa secuencia.` [OPL-ES CX1]
- **Dado** que comparten Y (concurrentes), **cuando** miro el panel OPL-ES, **entonces** se usa `en paralelo` (HU-12.017). [OPL-ES CX2]
- **Dado** que el refinamiento es despliegue, **cuando** miro el panel OPL-ES, **entonces** NO aparece la clausula temporal. [OPL-ES CX3]

**Reglas y restricciones:**
- Propia de `se descompone en` [OPL-ES CX1], nunca con despliegue [OPL-ES CX3].
- Infiere del orden Y de los subprocesos. [V-35]

**Modelo de datos tocado:**
- Ninguno (derivado de posiciones Y). [V-35]

**Dependencias:**
- Bloqueada por: HU-12.012.
- Relacionada: HU-12.016.

**Notas de evidencia:**
- Fuente normativa: [OPL-ES CX1] "en esa secuencia"; [V-35] linea temporal.
- Fuente OPCloud: `opcloud-reverse/12-canvas-inzooming.md` §5.4, §5.5.
- Clase de afirmacion: confirmado por sandbox + SSOT.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [opl-es, semantica-temporal, vocabulario].

---

### HU-12.014 — Distinguir verbos OPL-ES de refinamiento

**Actor primario:** ME.
**Actores secundarios:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** L; K.
**Superficie UI:** panel-opl-es.
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador experto, quiero que el panel OPL-ES distinga los verbos de refinamiento (`se descompone en`, `se despliega en`, y variantes) para leer la semantica exacta.

**Contexto de negocio:**
La SSOT [Glos 3.20] define descomposicion; [Glos 3.83] define despliegue (unfolding). Cuatro tipos con semantica distinta: descomposicion (contenedor envolvente), despliegue-por-partes (triangulo lleno), despliegue-por-rasgos (triangulo con linea interna), despliegue-por-especializaciones (triangulo vacio).

**Criterios de aceptacion:**
- **Dado** que ejecute descomposicion, **cuando** leo OPL-ES, **entonces** el verbo es `se descompone en`. [OPL-ES CX1]
- **Dado** que ejecute despliegue-por-partes, **cuando** leo OPL-ES, **entonces** el verbo es `se despliega en`. [OPL-ES CX3]
- **Dado** que ejecute despliegue-por-rasgos, **cuando** leo OPL-ES, **entonces** el verbo es `exhibe` / `se despliega por rasgos en`.
- **Dado** que ejecute despliegue-por-especializaciones, **cuando** leo OPL-ES, **entonces** el verbo es `se despliega por especializaciones en`.
- **Dado** que miro el arbol OPD, **cuando** comparo con OPL-ES, **entonces** el sufijo coincide con el verbo OPL-ES.

**Modelo de datos tocado:**
- `opd.tipo_refinamiento` — enum `"descompuesto" | "desplegado" | "desplegado-por-rasgos" | "desplegado-por-especializaciones"` — persistente.

**Dependencias:**
- Bloqueada por: HU-12.012.
- Relacionada: epicas de despliegue.

**Notas de evidencia:**
- Fuente normativa: [Glos 3.20] Descomposicion; [Glos 3.83] Despliegue; [OPL-ES CX1..CX3].
- Fuente OPCloud: §5.4 tabla + sandbox.
- Clase de afirmacion: confirmado en sandbox + SSOT.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [opl-es, vocabulario, semantica, refinamiento].

---

### HU-12.015 — Crear subproceso dentro del contenedor por arrastre

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** K; V; U.
**Superficie UI:** canvas-opd-hijo + biblioteca-lateral + dialogo emergente.
**Gesto canonico:** arrastre desde barra o biblioteca al interior del contenedor.

**Historia:**
> Como modelador, quiero arrastrar un icono de proceso al interior del contenedor para crear un subproceso de la descomposicion.

**Contexto de negocio:**
[V-79] establece que la cosa refinada aparece como contenedor en el OPD hijo. La creacion reutiliza el gesto de arrastre de EPICA-10. El kernel registra el subproceso como hijo estructural del refinable [Glos 3.20] [Glos 3.58], disparando inclusion en OPL-ES [OPL-ES CX1].

**Criterios de aceptacion:**
- **Dado** que estoy en el OPD hijo con contenedor visible, **cuando** arrastro el icono de proceso al interior, **entonces** se crea un subproceso con `cosa.tipo=proceso`, ubicado dentro. [V-79]
- **Dado** que cree el subproceso, **cuando** se renderiza, **entonces** aparece el dialogo emergente para nombrarlo.
- **Dado** que confirme el nombre, **cuando** consulto panel OPL-ES, **entonces** el subproceso aparece en `se descompone en`. [OPL-ES CX1]
- **Dado** que cree el subproceso, **cuando** consulto la biblioteca lateral, **entonces** aparece como entrada.

**Reglas y restricciones:**
- El subproceso es hijo estructural del refinable. [Glos 3.20]
- Coordenadas: locales al contenedor (pregunta abierta).
- Valores por defecto: `esencia=informacional`, `afiliacion=sistemica`. [V-1]

**Modelo de datos tocado:**
- `cosa.id` — UUID — persistente.
- `cosa.tipo` — `"proceso"` — persistente.
- `cosa.padre_refinable_id` — UUID — persistente.
- `apariencia.opd_id = SDn`, `apariencia.posicion = (x, y)`.

**Dependencias:**
- Bloqueada por: HU-12.003, HU-10.001.
- Bloquea a: HU-12.016, HU-12.017, HU-12.022, HU-12.033.

**Notas de evidencia:**
- Fuente normativa: [Glos 3.20] Descomposicion; [V-79] contenedor; [Glos 3.58] Proceso.
- Fuente OPCloud: `opcloud-reverse/12-canvas-inzooming.md` §3.2.
- Frames: carpeta 05 frames 1-10.
- Clase de afirmacion: observado + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [canvas, kernel, descomposicion, subproceso, arrastre, creacion].

---

### HU-12.016 — Codificar orden temporal por coordenada Y del subproceso

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario; V.
**Superficie UI:** canvas-opd-hijo.
**Gesto canonico:** arrastre/reubicacion vertical de subprocesos.

**Historia:**
> Como modelador, quiero que Y codifique orden temporal (Y creciente = mas tarde) para expresar secuencia sin enlaces adicionales.

**Contexto de negocio:**
[V-35]: linea temporal fluye de arriba hacia abajo. [V-77]: invocacion por posicion vertical solo en descomposicion de proceso. Afecta la semantica OPL-ES (`en esa secuencia` [OPL-ES CX1]). Invariante: sin coords hardcodeadas.

**Criterios de aceptacion:**
- **Dado** que A (Y=100), B (Y=200), C (Y=300) en un contenedor, **cuando** consulto panel OPL-ES, **entonces** orden A, B, C con `en esa secuencia`. [OPL-ES CX1] [V-35]
- **Dado** que muevo B a Y=50, **cuando** termina el arrastre, **entonces** OPL-ES reordena a B, A, C.
- **Dado** que dos comparten Y, **cuando** consulto panel OPL-ES, **entonces** concurrencia con `en paralelo` (HU-12.017). [V-32] [OPL-ES CX2]
- **Dado** que hay subprocesos y objetos mezclados, **cuando** calculo orden, **entonces** orden temporal solo para subprocesos. [V-77]

**Reglas y restricciones:**
- V-35: Y creciente = mas tarde.
- V-77: invocacion vertical solo en descomposicion de proceso.
- Tolerancia de Y igual: banda (`|ΔY| < ε`) para concurrencia.

**Modelo de datos tocado:**
- `apariencia.posicion.y` — numero — persistente.
- Orden derivado en OPL-ES.

**Dependencias:**
- Bloqueada por: HU-12.015.
- Bloquea a: HU-12.013, HU-12.017.

**Notas de evidencia:**
- Fuente normativa: [V-35] linea temporal; [V-77] solo en descomposicion de proceso.
- Fuente OPCloud: §3.2 paso 3, §6, §9.
- Clase de afirmacion: observado + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [render, layout, semantica-temporal].

---

### HU-12.017 — Crear subprocesos concurrentes en misma Y y emitir "paralelo" en OPL-ES

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario; V, L secundarios.
**Superficie UI:** canvas-opd-hijo + panel-opl-es.
**Gesto canonico:** arrastre de subproceso a misma banda Y.

**Historia:**
> Como modelador experto, quiero colocar subprocesos en misma Y para expresar concurrencia, y que OPL-ES emita `en paralelo`.

**Contexto de negocio:**
[V-32]: subprocesos a misma altura se ejecutan en paralelo. [OPL-ES CX2]: `*Proceso* se descompone en paralelo *P1* y *P2*.`

**Criterios de aceptacion:**
- **Dado** que tengo `Call Transmitting` a Y=200 y arrastro `Vehicle Location Calculating` a Y=200, **cuando** se completa, **entonces** se renderizan lado-a-lado. [V-32]
- **Dado** que dos son concurrentes, **cuando** consulto panel OPL-ES, **entonces** `..., en paralelo *Call Transmitting* y *Vehicle Location Calculating*, ...`. [OPL-ES CX2]
- **Dado** que muevo uno a distinta Y, **cuando** termina el arrastre, **entonces** OPL-ES regresa a secuencia lineal. [OPL-ES CX1]
- **Dado** que tres comparten Y, **cuando** consulto panel OPL-ES, **entonces** los tres en grupo `en paralelo`.

**Reglas y restricciones:**
- Concurrencia por banda Y compartida. [V-32]
- Conector OPL-ES: `en paralelo`. [OPL-ES CX2]
- Disposicion horizontal respetada por layout.

**Modelo de datos tocado:**
- `apariencia.posicion.y` — clave de agrupacion.

**Dependencias:**
- Bloqueada por: HU-12.015, HU-12.016.

**Notas de evidencia:**
- Fuente normativa: [V-32] paralelismo; [OPL-ES CX2] plantilla de concurrencia.
- Fuente OPCloud: §3.5. Frames: frame_00025-030.
- Clase de afirmacion: observado + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [canvas, opl-es, concurrencia, paralelo, layout, semantica].

---

### HU-12.018 — Crear objeto interno dentro del contenedor

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** K; V; U.
**Superficie UI:** canvas-opd-hijo + dialogo emergente.
**Gesto canonico:** arrastre de objeto al interior del contenedor.

**Historia:**
> Como modelador, quiero crear objetos dentro del contenedor para modelar datos o recursos que circulan entre subprocesos internos.

**Contexto de negocio:**
[V-84] define objetos internos (creados en descomposicion, sin apariencia en el OPD padre). [V-85] los distingue de objetos externos. Objetos internos como `Call`, `Vehicle Location` son recursos locales al proceso refinado.

**Criterios de aceptacion:**
- **Dado** que estoy en el OPD hijo, **cuando** arrastro el icono de objeto al interior del contenedor, **entonces** se crea un objeto con `cosa.tipo=objeto`. [V-84] [Glos 3.39]
- **Dado** que cree el objeto, **cuando** se renderiza, **entonces** aparece el dialogo emergente.
- **Dado** que confirme el nombre, **cuando** consulto panel OPL-ES, **entonces** se incluye en la clausula de objetos internos. [OPL-ES CX1]
- **Dado** que cree el objeto, **cuando** consulto biblioteca lateral, **entonces** aparece.

**Reglas y restricciones:**
- Render: rectangulo, borde `#70E483` [JOYAS §1], sombra si fisico [V-124].
- `objeto.padre_refinable_id` [V-84].
- Valores por defecto identicos a HU-10.002. [V-1]

**Modelo de datos tocado:**
- `cosa.id`, `cosa.tipo="objeto"`, `cosa.padre_refinable_id` — persistentes.
- Apariencia en OPD hijo.

**Dependencias:**
- Bloqueada por: HU-12.003, HU-10.002.
- Bloquea a: HU-12.019, HU-12.020, HU-12.022.

**Notas de evidencia:**
- Fuente normativa: [V-84] objetos internos; [V-85] objetos externos; [Glos 3.39] Objeto.
- Fuente OPCloud: §3.3. Frames: frame_00008.
- Clase de afirmacion: observado + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [canvas, kernel, descomposicion, objeto-interno, arrastre, creacion].

---

### HU-12.019 — Emitir conector OPL-ES para objetos internos

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categorico:** L.
**Superficie UI:** panel-opl-es.
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador, quiero que el panel OPL-ES distinga objetos internos de subprocesos en la oracion de descomposicion, manteniendo la distincion semantica procesos/objetos.

**Contexto de negocio:**
La SSOT exige que OPL-ES refleje la distincion subprocesos/objetos [OPL-ES CX1]. OPCloud usa `as well as` en ingles. La implementacion OPL-ES usa el conector canonico equivalente en espanol. La necesidad de distinguir es SSOT; el conector especifico es de implementacion.

**Criterios de aceptacion:**
- **Dado** que la descomposicion tiene subprocesos y objetos internos, **cuando** consulto panel OPL-ES, **entonces** la oracion tiene estructura con distincion sintactica entre ambos. [OPL-ES CX1]
- **Dado** que hay un solo objeto interno, **cuando** consulto panel OPL-ES, **entonces** se incluye en la oracion.
- **Dado** que hay multiples objetos, **cuando** consulto panel OPL-ES, **entonces** se unen con `y`.
- **Dado** que no hay objetos internos, **cuando** consulto panel OPL-ES, **entonces** no aparece la clausula.

**Reglas y restricciones:**
- La distincion sintactica es requerida por [OPL-ES CX1]; el conector especifico es de implementacion.
- Dentro de la lista de objetos se usa `y` como separador.

**Dependencias:**
- Bloqueada por: HU-12.012, HU-12.018.

**Notas de evidencia:**
- Fuente normativa: [OPL-ES CX1] distincion subprocesos/objetos.
- Fuente OPCloud: §3.3 paso 4, §5.4.
- Clase de afirmacion: observado en OPCloud; SSOT en necesidad.
- Etiqueta: `mixto` — distincion es SSOT, conector de OPCloud es referencial.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [opl-es, vocabulario, objeto-interno].

---

### HU-12.020 — Restringir objeto interno al interior del contenedor

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario.
**Superficie UI:** canvas-opd-hijo.
**Gesto canonico:** arrastre del objeto hacia fuera.

**Historia:**
> Como modelador experto, quiero que un objeto interno no pueda existir dentro y fuera del contenedor simultaneamente.

**Contexto de negocio:**
[V-84]: objetos internos se eliminan en cascada con el proceso padre. [V-85]: objetos externos existen independientemente. La transcripcion confirma que al intentar sacarlos, OPCloud expande el contenedor.

**Criterios de aceptacion:**
- **Dado** que tengo objeto interno `O` dentro del contenedor, **cuando** arrastro `O` hacia fuera, **entonces** el contenedor se expande manteniendo `O` interno. [V-84]
- **Dado** que `O` cruza el contorno, **cuando** el arrastre continua, **entonces** el contenedor absorbe la expansion (HU-12.021).
- **Dado** que intento duplicar `O` fuera, **cuando** ejecuto, **entonces** no se permite o crea entidad distinta. [V-85]

**Reglas y restricciones:**
- Invariante [V-84]: `objeto.padre_refinable_id != null` ⇒ objeto interno sin apariencia en padre.
- Para convertir en externo: remover y recrear afuera.

**Modelo de datos tocado:**
- `objeto.padre_refinable_id` — UUID — persistente.

**Dependencias:**
- Bloqueada por: HU-12.018.
- Bloquea a: HU-12.021.

**Notas de evidencia:**
- Fuente normativa: [V-84] objetos internos; [V-85] objetos externos.
- Fuente OPCloud: §1.1, §4.5.
- Clase de afirmacion: confirmado por transcripcion + SSOT.

**Prioridad:** M1.
**Tamano:** L.
**Etiquetas:** [kernel, geometria, restriccion, objeto-interno, semantica].

---

### HU-12.021 — Expandir contenedor al intentar sacar objeto interno

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; K secundario.
**Superficie UI:** canvas-opd-hijo.
**Gesto canonico:** arrastre del objeto interno hasta cruzar borde.

**Historia:**
> Como modelador experto, quiero que el contenedor crezca automaticamente al arrastrar un objeto interno mas alla de su borde, manteniendolo interno.

**Contexto de negocio:**
Continuacion de HU-12.020: el contenedor es elastico. OPCloud expande el contenedor en vez de rechazar el arrastre. Es una afordance UX de OPCloud; la SSOT no prescribe expansion elastica.

**Criterios de aceptacion:**
- **Dado** que contenedor con borde en Y=500, **cuando** arrastro objeto a Y=550, **entonces** el contenedor crece para incluir Y=550. [OPCloud §1.1]
- **Dado** que crecio, **cuando** miro externos, **entonces** su posicion relativa se preserva.
- **Dado** que suelto, **cuando** termina el arrastre, **entonces** la nueva geometria queda persistida.

**Reglas y restricciones:**
- Expansion automatica sin confirmacion. [OPCloud §1.1]
- Padding minimo entre objeto y borde.

**Modelo de datos tocado:**
- `refinable.containerBounds` — `{x, y, w, h}` — persistente.

**Dependencias:**
- Bloqueada por: HU-12.020.

**Notas de evidencia:**
- Fuente OPCloud: §1.1 transcripcion.
- Clase de afirmacion: confirmado por transcripcion.
- Etiqueta: `opcloud-ui` — expansion elastica es afordance OPCloud.

**Prioridad:** M1.
**Tamano:** L.
**Etiquetas:** [render, layout, auto-expansion, contenedor, opcloud-ui].

---

### HU-12.022 — Conectar subproceso interno con objeto interno

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** K (enlace).
**Superficie UI:** canvas-opd-hijo + tabla-enlaces.
**Gesto canonico:** arrastre desde borde de subproceso hasta borde de objeto.

**Historia:**
> Como modelador experto, quiero conectar subprocesos con objetos internos mediante enlaces regulares para modelar el flujo de datos interno.

**Contexto de negocio:**
[V-61] define anatomia de enlace. [V-239] cinco familias canonicas. Subprocesos interactuan con objetos internos como en cualquier OPD. Tabla de enlaces de EPICA-10 aplica.

**Criterios de aceptacion:**
- **Dado** que tengo `Call Making` y `Call` en el contenedor, **cuando** arrastro borde a borde, **entonces** se abre tabla de enlaces con opciones validas. [V-239] [V-240]
- **Dado** que elijo `Resultado`, **cuando** confirmo, **entonces** se crea enlace origen=`Call Making`, destino=`Call`.
- **Dado** que el enlace existe, **cuando** consulto panel OPL-ES, **entonces** `*Call Making* genera **Call**.` [OPL-ES T2]

**Reglas y restricciones:**
- Tabla aplica mismas reglas EPICA-10. [V-239] [V-240]
- Enlaces intra-contenedor: cortos y rectos (§9 doc fuente).
- Wrapper+line: hit area 15px transp + linea 2px. [JOYAS §4]

**Modelo de datos tocado:**
- `enlace.origen`, `enlace.destino`, `enlace.tipo` — persistentes.

**Dependencias:**
- Bloqueada por: HU-12.015, HU-12.018.
- Reutiliza: HU-10.007, HU-10.008, HU-10.011.

**Notas de evidencia:**
- Fuente normativa: [V-61] anatomia; [V-239] familias; [V-240] firma invocacion.
- Fuente OPCloud: §3.4. Frames: 20-28.
- Evidencia visual: JOYAS §4 wrapper+line, §6 routing, §7 puertos.
- Clase de afirmacion: observado + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [canvas, kernel, enlaces, descomposicion, interno].
---
### HU-12.023 — Renombrar subproceso in situ con dialogo emergente

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categorico:** U primario; K.
**Superficie UI:** dialogo emergente.
**Gesto canonico:** doble-clic sobre subproceso.

**Historia:**
> Como modelador, quiero renombrar un subproceso con doble-clic y dialogo emergente para pasar del nombre por defecto al nombre significativo.

**Contexto de negocio:**
La SSOT [Glos 3.76] exige nombres significativos. El dialogo emergente con doble-clic es una afordance OPCloud; la necesidad de renombrar es SSOT. [V-97] asegura propagacion a todas las apariencias.

**Criterios de aceptacion:**
- **Dado** que tengo subproceso `C Processing`, **cuando** doble-clic, **entonces** se abre dialogo con texto resaltado. [OPCloud §3.6]
- **Dado** que escribo "Call Transmitting" y confirmo, **cuando** confirmo, **entonces** el subproceso cambia de nombre. [V-97]
- **Dado** que renombre, **cuando** consulto panel OPL-ES y biblioteca, **entonces** muestran el nuevo nombre.

**Reglas y restricciones:**
- Renombrado es destructivo de entidad, no crea alias (hipotesis §3.6, tension con V-97/V-101).
- Doble-clic abre dialogo; clic simple selecciona.

**Modelo de datos tocado:**
- `cosa.nombre` — string — persistente. [V-97]

**Dependencias:**
- Bloqueada por: HU-12.015, HU-10.003.
- Bloquea a: HU-12.024.

**Notas de evidencia:**
- Fuente normativa: [Glos 3.76] Nombre; [V-97] consistencia.
- Fuente OPCloud: §3.6. Frames: 20-25.
- Clase de afirmacion: observado + hipotesis.
- Etiqueta: `mixto` — renombrar es SSOT, dialogo emergente es OPCloud.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [ui, dialogo-emergente, rename, doble-clic, subproceso].

---

### HU-12.024 — Propagar rename de subproceso a biblioteca lateral y OPL-ES

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** L.
**Superficie UI:** biblioteca-lateral + panel-opl-es + opd-tree.
**Gesto canonico:** ninguno (propagacion automatica).

**Historia:**
> Como modelador experto, quiero que al renombrar un subproceso el cambio se propague a biblioteca, panel OPL-ES, arbol OPD y todas las apariencias.

**Contexto de negocio:**
Consecuencia del axioma entidad unica [V-97]. La SSOT establece que los nombres no cambian a traves del refinamiento.

**Criterios de aceptacion:**
- **Dado** que renombre `C Processing` → `Call Transmitting`, **cuando** consulto biblioteca y panel OPL-ES, **entonces** muestran el nuevo nombre.
- **Dado** que la entidad aparece en otro OPD, **cuando** navego ahi, **entonces** la apariencia refleja el nuevo nombre. [V-97]
- **Dado** que el subproceso refinado de otro OPD, **cuando** renombro en arbol, **entonces** el label `SDn: <nombre> descompuesto` se actualiza (HU-12.005).

**Reglas y restricciones:**
- Propagacion sincrona sin cache.

**Modelo de datos tocado:**
- `cosa.nombre` — persistente. [V-97]

**Dependencias:**
- Bloqueada por: HU-12.007, HU-12.023.

**Notas de evidencia:**
- Fuente normativa: [V-97] nombres no cambian en refinamiento.
- Fuente OPCloud: §3.6 paso 4, §7.3.
- Clase de afirmacion: observado + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [lente, propagacion, rename, entidad-unica].

---

### HU-12.025 — Navegar entre OPDs cliqueando nodos del arbol

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U; V.
**Superficie UI:** panel-izquierdo-opd-tree + canvas.
**Gesto canonico:** clic sobre nodo del arbol.

**Historia:**
> Como modelador, quiero hacer clic en cualquier nodo del arbol OPD para cambiar el area visible al OPD correspondiente.

**Contexto de negocio:**
El arbol es la via primaria de navegacion en OPCloud. Es una afordance especifica; la SSOT no prescribe mecanismo de navegacion entre OPDs.

**Criterios de aceptacion:**
- **Dado** que estoy en `SD1`, **cuando** hago clic en `SD`, **entonces** el area visible cambia al OPD padre. [OPCloud §7.1]
- **Dado** que navego al OPD `X`, **cuando** termina, **entonces** el nodo `X` esta resaltado.

**Reglas y restricciones:**
- Cambio de area visible sin confirmacion.
- Seleccion del nodo = area visible activo.

**Dependencias:**
- Bloqueada por: HU-12.004.
- Bloquea a: HU-12.026.

**Notas de evidencia:**
- Fuente OPCloud: §7.1.
- Clase de afirmacion: observado.
- Etiqueta: `opcloud-ui` — navegacion por arbol es afordance OPCloud.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [opd-tree, navegacion, area-visible, ui, opcloud-ui].

---

### HU-12.026 — Navegar al OPD hijo existente al re-ejecutar descomposicion

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** K; U.
**Superficie UI:** menu-contextual + canvas + arbol OPD.
**Gesto canonico:** clic en "In-Zoom" sobre proceso ya refinado.

**Historia:**
> Como modelador, quiero que al ejecutar descomposicion sobre un proceso ya refinado navegue al OPD hijo existente en vez de crear uno nuevo (idempotencia).

**Contexto de negocio:**
La SSOT [V-62] define que la descomposicion produce un OPD hijo unico. Idempotencia: re-ejecutar navega al existente. Confirmado por transcripcion.

**Criterios de aceptacion:**
- **Dado** que `Driver Rescuing` ya fue descompuesto a `SD1`, **cuando** hago clic en "In-Zoom", **entonces** el area visible cambia a `SD1`. [V-62]
- **Dado** que re-ejecute, **cuando** reviso el arbol, **entonces** NO hay `SD2` nuevo.
- **Pregunta abierta**: ¿feedback visual distinto en el menu contextual? (§11 Q11)

**Reglas y restricciones:**
- Idempotencia: nunca duplica OPD hijo. [V-62]
- Etiqueta: `requires-clarification` para feedback visual.

**Notas de evidencia:**
- Fuente normativa: [V-62] OPD hijo unico.
- Fuente OPCloud: §1.1, §4.4, §11 Q11.
- Clase de afirmacion: confirmado (accion); abierto (feedback).

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [kernel, navegacion, idempotencia, descomposicion, requires-clarification].

---

### HU-12.027 — Eliminar descomposicion y revertir proceso refinable a proceso simple

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario; V, L secundarios.
**Superficie UI:** menu contextual / barra / dialogo modal confirmacion.
**Gesto canonico:** accion de eliminacion.

**Historia:**
> Como modelador experto, quiero eliminar la descomposicion de un proceso para revertirlo a proceso simple (operacion inversa).

**Contexto de negocio:**
[V-84] establece que objetos internos se eliminan en cascada con el proceso padre. Operacion inversa a la descomposicion. UX de confirmacion es pregunta abierta.

**Criterios de aceptacion:**
- **Dado** que un proceso tiene OPD hijo, **cuando** ejecuto eliminar descomposicion, **entonces** se presenta confirmacion.
- **Dado** que confirmo, **cuando** se procesa, **entonces** OPD hijo se elimina, subprocesos/objetos en cascada [V-84], proceso vuelve a render simple.
- **Dado** que el proceso tenia enlaces externos, **cuando** elimino, **entonces** enlaces vuelven al proceso simple (o se pregunta destino — abierto).
- **Dado** que elimino desde nodo del arbol `SDn`, **cuando** confirmo, **entonces** equivalente a eliminar descomposicion.

**Reglas y restricciones:**
- Cascada: [V-84] exige borrado; UX exacta abierta.
- Reversible solo con deshacer (EPICA-90).
- Etiqueta: `requires-clarification`.

**Modelo de datos tocado:**
- `opd` hijo — removido.
- `cosa.padre_refinable_id` — cascada. [V-84]
- Enlaces redirigidos.

**Dependencias:**
- Bloqueada por: HU-12.003.
- Relacionada: EPICA-1C, EPICA-90.

**Notas de evidencia:**
- Fuente normativa: [V-84] cascada.
- Fuente OPCloud: §11 Q10.
- Clase de afirmacion: abierto (UX) + confirmado por SSOT (cascada).

**Prioridad:** S.
**Tamano:** L.
**Etiquetas:** [kernel, eliminacion, descomposicion, cascada, requires-clarification].

---

### HU-12.028 — Acceder a descomposicion de objeto en diagrama desde barra contextual

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** K; V.
**Superficie UI:** barra-contextual.
**Gesto canonico:** clic en accion.

**Historia:**
> Como modelador experto, quiero ejecutar descomposicion en diagrama desde la barra contextual para descomponer dentro del OPD actual sin crear OPD hijo en el arbol.

**Contexto de negocio:**
OPCloud ofrece dos variantes: clasica (crea OPD hijo) [V-62] y en-diagrama (expande in situ). Esta ultima no esta normada por la SSOT [Glos 3.20] que define descomposicion como OPD hijo. Es una extension OPCloud.

**Criterios de aceptacion:**
- **Dado** que tengo seleccionado un proceso u objeto, **cuando** abro barra contextual, **entonces** veo "Object In-Diagram In-Zooming". [OPCloud §5.6]
- **Dado** que hago clic, **cuando** se ejecuta, **entonces** el elemento se expande in situ, **sin nodo nuevo en arbol**.
- **Dado** que active, **cuando** agrego subprocesos/objetos, **entonces** se dibujan dentro del contenedor en el OPD actual.

**Reglas y restricciones:**
- No modifica el arbol OPD.
- Semantica OPL-ES exacta: **pregunta abierta**.
- Etiqueta: `requires-clarification`, `opcloud-ui`.

**Notas de evidencia:**
- Fuente normativa: [Glos 3.20] define descomposicion como OPD hijo. Esta variante no esta en la SSOT.
- Fuente OPCloud: §5.6; HU-10.021.
- Clase de afirmacion: observado + abierto.
- Etiqueta: `opcloud-ui` — extension OPCloud no normada.

**Prioridad:** S.
**Tamano:** L.
**Etiquetas:** [canvas, ui, descomposicion-embebida, barra-contextual, requires-clarification, opcloud-ui].

---

### HU-12.029 — Respetar afiliacion ambiental dentro del SD hijo

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** V; K.
**Superficie UI:** canvas-opd-hijo.
**Gesto canonico:** ninguno (render).

**Historia:**
> Como modelador experto, quiero ver que los externos ambientales se renderizan con borde discontinuo dentro del SD hijo igual que en el padre.

**Contexto de negocio:**
[V-71]: tipo de contorno persiste en todos los niveles de refinamiento. [V-95]: esencia no cambia. Afiliacion es propiedad de la entidad, no de la apariencia. Color: `#70E483` [JOYAS §1].

**Criterios de aceptacion:**
- **Dado** que `Driver` es ambiental en SD, **cuando** navego a SD1, **entonces** tiene borde discontinuo. [V-71]
- **Dado** que cambio `Driver` a sistemico, **cuando** navego a SD1, **entonces** refleja borde solido. [V-95]
- **Dado** que creo cosa ambiental en el contenedor, **cuando** renderiza, **entonces** borde discontinuo. [V-1 §1.2]

**Dependencias:**
- Bloqueada por: HU-12.003, HU-10.015.

**Notas de evidencia:**
- Fuente normativa: [V-71] persistencia contorno; [V-95] esencia invariante; [V-1 §1.2] solido/discontinuo.
- Fuente OPCloud: §5.5.
- Evidencia visual: JOYAS §1 `#70E483`.
- Clase de afirmacion: observado + confirmado por SSOT.

**Prioridad:** M1.
**Tamano:** M.
**Etiquetas:** [kernel, render, afiliacion, entidad-unica, consistencia].

---

### HU-12.030 — Restringir ambiental al interior del contenedor del SD hijo

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** K; V.
**Superficie UI:** canvas-opd-hijo.
**Gesto canonico:** marcar cosa como ambiental dentro del SD hijo.

**Historia:**
> Como modelador experto, quiero que elementos ambientales declarados en el SD hijo queden restringidos al interior del contenedor.

**Contexto de negocio:**
[V-84] define objetos internos; [V-85] define objetos externos. Distincion entre ambiental global (apariencias en hijos) y ambiental local (solo en SDn).

**Criterios de aceptacion:**
- **Dado** que creo objeto dentro del contenedor y lo marco ambiental, **cuando** navego al SD padre, **entonces** NO aparece en SD. [V-84]
- **Dado** que tiene `padre_refinable_id=P`, **cuando** consulto panel OPL-ES, **entonces** aparece en clausula de objetos. [OPL-ES CX1]
- **Dado** que `Driver` es ambiental global en SD, **cuando** lo uso en SD1, **entonces** es apariencia, no instancia nueva. [V-97]

**Notas de evidencia:**
- Fuente normativa: [V-84] [V-85].
- Clase de afirmacion: inferido.
- Etiqueta: `mixto` — contencion es SSOT, distincion local/global es implementacion.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [kernel, restriccion, ambiental, ambito, requires-clarification].

---

### HU-12.031 — Render "parentesis" del contorno: enlace al borde distribuye a subprocesos

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** V; K.
**Superficie UI:** canvas-opd-hijo.
**Gesto canonico:** crear enlace al borde del contenedor.

**Historia:**
> Como modelador experto, quiero que un enlace al borde del contenedor implique conexion con todos los subprocesos internos (funcion "parentesis"), hasta distribucion explicita.

**Contexto de negocio:**
[V-91]: enlaces estructurales al contenedor visibles en OPD hijo. [V-92]: enlaces procedimentales al contenedor se distribuyen a subprocesos. Transcripcion confirma funcionalidad "parentesis".

**Criterios de aceptacion:**
- **Dado** que externo `E` conectado a `P_refinable` en SD, **cuando** navego a SD1, **entonces** enlace apunta al borde del contenedor. [V-92]
- **Dado** que enlace esta al borde, **cuando** consulto panel OPL-ES, **entonces** se interpreta como implicito a cada subproceso.
- **Dado** que usuario arrastra endpoint a subproceso especifico, **cuando** termina, **entonces** enlace apunta al subproceso.
- **Dado** que hay puntos de anclaje visibles, **cuando** inspecciono, **entonces** circulos abiertos sobre el contorno.

**Modelo de datos tocado:**
- `enlace.rol_destino` — `"borde_refinable" | "subproceso_especifico"` — persistente.

**Dependencias:**
- Bloqueada por: HU-12.008, HU-12.011.

**Notas de evidencia:**
- Fuente normativa: [V-91] enlaces estructurales; [V-92] enlaces procedimentales.
- Fuente OPCloud: §1.1, §2.
- Clase de afirmacion: confirmado por transcripcion.
- Etiqueta: `mixto` — distribucion es SSOT, metafora "parentesis" es OPCloud.

**Prioridad:** S.
**Tamano:** L.
**Etiquetas:** [render, enlaces, parentesis, distribucion, semantica].

---

### HU-12.032 — Actualizar mini-navegador al cambiar de OPD

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** L.
**Superficie UI:** panel-izquierdo-opd-navigator.
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador, quiero que el mini-navegador regenere su thumbnail al cambiar de OPD para orientacion visual.

**Contexto de negocio:**
El mini-navegador es mapa de contexto. La SSOT no lo prescribe; es afordance OPCloud.

**Criterios de aceptacion:**
- **Dado** que estoy en SD, **cuando** navego a SD1, **entonces** thumbnail se regenera mostrando SD1. [OPCloud §7.4]
- **Dado** que cambio de vuelta, **cuando** transicion, **entonces** thumbnail vuelve al SD anterior.
- **Dado** que paneo en canvas, **cuando** el area visible se desplaza, **entonces** recuadro del navigator se mueve (HU-10.018).

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [ui, navigator, lente, area-visible, opcloud-ui].

---

### HU-12.033 — Poblar biblioteca lateral con subprocesos y objetos internos nuevos

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** L.
**Superficie UI:** panel-izquierdo-biblioteca-lateral.
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador, quiero que cada subproceso u objeto interno creado aparezca en la biblioteca lateral.

**Contexto de negocio:**
Biblioteca lateral como vista derivada del modelo. Afordance OPCloud que refuerza entidad unica; la SSOT no prescribe este panel.

**Criterios de aceptacion:**
- **Dado** que cree `Call Making` en OPD hijo, **cuando** consulto biblioteca, **entonces** aparece. [OPCloud §7.3]
- **Dado** que el objeto aparece en SD1 y SD2, **cuando** reviso, **entonces** una sola entrada. [V-97]
- **Dado** que arrastro desde biblioteca a otro OPD, **cuando** suelto, **entonces** nueva apariencia de la misma entidad.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [ui, biblioteca-lateral, lente, entidad-unica, opcloud-ui].

---

### HU-12.034 — Serializar relacion padre-hijo entre OPDs al guardar el modelo

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** P (persistencia); K.
**Superficie UI:** ninguna directa.
**Gesto canonico:** ninguno (derivado de guardar).

**Historia:**
> Como modelador experto, quiero que al guardar el modelo se serialice correctamente la jerarquia padre-hijo entre OPDs para reabrir con la misma estructura.

**Contexto de negocio:**
La SSOT [V-62] define que la descomposicion produce OPD hijo. Persistencia de jerarquia es critica. Formato: `opd.id`, `opd.padre`, `opd.proceso_refinado`, `opd.tipo_refinamiento`, apariencias con posiciones.

**Criterios de aceptacion:**
- **Dado** que cree `SD1: Driver Rescuing descompuesto`, **cuando** guardo, **entonces** archivo incluye jerarquia `SD → SD1`. [V-62]
- **Dado** que guardado tiene OPDs anidados (SD → SD1 → SD3), **cuando** recargo, **entonces** jerarquia completa se restaura.
- **Dado** que guardo y recargo, **cuando** navego al OPD hijo, **entonces** apariencias, posiciones, enlaces restaurados identicos.
- **Dado** que biblioteca tiene entidades unicas, **cuando** recargo, **entonces** no se duplican (UUID preservado).

**Reglas y restricciones:**
- Formato: JSON (IndexedDB Capa 1 + serializacion de archivo).
- Invariante: deserializacion idempotente.
- Coordenadas (x, y) preservadas como estan.

**Modelo de datos tocado:**
- Arbol OPD completo: `opd[]`, `cosa[]`, `apariencia[]`, `enlace[]`.

**Dependencias:**
- Bloqueada por: HU-12.003, HU-12.004, HU-12.005, HU-12.007, HU-12.015, HU-12.018.
- Relacionada: EPICA-30 (persistencia).

**Notas de evidencia:**
- Fuente normativa: [V-62] descomposicion produce OPD hijo.
- Fuente OPCloud: §6 modelo de datos.
- Clase de afirmacion: inferido por necesidad operativa.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [persistencia, opd-tree, serializacion, kernel].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q12.1**: Gesto exacto de apertura del menu contextual (resuelto: seleccion + clic en `...`). Integrado en HU-12.001.
- **Q12.2**: Funcion del segundo icono opuesto a In-Zoom (presumiblemente despliegue). `requires-clarification` en HU candidata de EPICA de despliegue.
- **Q12.3**: Bring Connected Elements en contexto descomposicion — ¿copia externos faltantes en fase 2? (HU-12.011).
- **Q12.4**: Semicirculo `...` sobre contorno — funcion exacta. HU candidata no emitida.
- **Q12.5**: Mecanismo explicito de fase 2 (boton vs iterativo). HU-12.011 `requires-clarification`.
- **Q12.6**: Auto Format — reglas tipograficas (delegada a EPICA-10).
- **Q12.7**: Numeracion `Object 8/9` — global vs OPD-scoped; ¿se reciclan huecos?
- **Q12.8**: Indicador visual de "ya descompuesto" — ¿insignia o solo contorno grueso? (HU-12.026).
- **Q12.9**: Concurrencia + enlaces compartidos — distribucion con subprocesos en misma Y.
- **Q12.10**: Cascada al eliminar contenedor — ¿dialogo o silencioso? [V-84] exige cascada. HU-12.027 `requires-clarification`.
- **Q12.11**: Re-ejecutar descomposicion con feedback visual diferenciado (HU-12.026).
- **Q12.12**: Atajo de teclado para descomposicion — delegado a EPICA-90.
- **Q12.13**: Coordenadas internas al contenedor — locales vs globales.
- **Q12.14**: Relacion de renombrado destructivo con V-97/V-101 (hipotesis §3.6). HU-12.023.

## Referencias cruzadas

- **Doc fuente:** `opcloud-reverse/12-canvas-inzooming.md`.
- **Epicas que dependen de esta:**
  - **EPICA-11** (modelado basico) — despliegue paralelo a descomposicion.
  - **EPICA-13** (estados) — objetos con estados dentro del contenedor.
  - **EPICA-15** (enlaces avanzados) — distribucion cruzando contenedor.
  - **EPICA-18** (semi-plegado) — variante visual de la descomposicion.
  - **EPICA-1B** (bring connected) — mecanismo de fase 2.
  - **EPICA-1C** (validaciones) — cascada y restricciones.
  - **EPICA-20** (OPD tree) — consumidor del arbol generado.
  - **EPICA-30** (guardar/cargar) — serializacion (HU-12.034).
  - **EPICA-50** (panel OPL-ES) — consumidor de OPL-ES emitida.
- **Epicas que bloquean esta:**
  - **EPICA-10** (creacion de cosas) — HU-10.001, HU-10.002, HU-10.003, HU-10.007, HU-10.015, HU-10.019.
- **Invariantes del repo tocados:**
  - `src/nucleo/tipos.ts` — `OPD`, `Cosa`, `Apariencia`, relacion `seDescomponeEn`, `padre_refinable_id`.
  - `src/nucleo/validacion/` — cascada, contencion, idempotencia descomposicion.
  - `src/render/jointjs/` — shape del contenedor (V-33), label superior-centro interior.
  - `src/render/layout/` — eje temporal Y, concurrencia por misma Y, auto-expansion.
  - `src/render/opl-renderer.ts` — verbos `se descompone en`, `se despliega en`, etc.; conectores `y`, `en paralelo`; clausula `en esa secuencia`.
  - `src/persistencia/` — serializacion de arbol OPD.
- **SSOT:** [V-33] contorno grueso; [V-34] elipse agrandada; [V-35] eje temporal vertical; [V-62] doble fase; [V-71] persistencia contorno; [V-77] invocacion vertical; [V-79] contenedor; [V-80] [V-81] copia externos; [V-84] cascada; [V-85] externos; [V-91] [V-92] enlaces al contenedor; [V-95] [V-96] [V-97] identidad; [OPL-ES CX1..CX4] plantillas de refinamiento.
- **Evidencia visual:** JOYAS §1 colores (`#70E483`, `#3BC3FF`, `#586D8C`), §2 dimensiones (135x60), §3 tipografia (Arial 14px semibold), §4 patron wrapper+line, §6 routing, §7 puertos.
