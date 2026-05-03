---
epica: "EPICA-21"
titulo: "Estructura — Mapa del sistema (meta-vista grafica del arbol de OPDs)"
doc_fuente: "opcloud-reverse/21-estructura-system-map.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "S"
hu_emitidas: 18
ultima_actualizacion: 2026-04-23
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
---

## Resumen

Esta epica cubre el **Mapa del sistema**, una vista auxiliar meta-grafica que complementa al arbol OPD (EPICA-20) renderizando en un unico canvas todos los OPDs del modelo como thumbnails conectados por flechas padre-hijo. Es una **lente de navegacion** (nivel categorico L) — sin mutacion del modelo — y su valor principal es orientativo: un vistazo completo de como esta estructurado el refinamiento del modelo, complementario a la vista lineal del arbol.

El Mapa del sistema es **read-only inferido**: no se observan operaciones de edicion sobre los thumbnails. Su arquitectura canonica responde al patron *lens on OPD tree*: snapshot de estructura + render meta-grafico + salida por navegacion al OPD real.

La SSOT define los mecanismos fundamentales de gestion de contexto (descomposicion, despliegue, expresion de estados, composicion inter-modelo) en [opm-iso-19450-es.md §Gestion de contexto]; el Mapa del sistema es una **vista derivada** de operador de contexto, no un mecanismo ontologico. No es un requisito SSOT — es una afordance OPCloud que puede implementarse de forma distinta o diferirse.

Las HU se numeran siguiendo la aparicion y preguntas abiertas del doc fuente, sin reordenar por prioridad. Cada HU mantiene trazabilidad bidireccional con secciones y frames del doc fuente.

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-21.001 | Activar Mapa del sistema desde Model Options del main menu | RV | S | S | opcloud-ui | — |
| HU-21.002 | Ver entrada Mapa del sistema en el arbol OPD al generarla | RV | S | XS | opcloud-ui | — |
| HU-21.003 | Renderizar meta-grafo con thumbnails y flechas padre-hijo | RV | S | M | mixto | [opm-iso-19450-es §Gestion de contexto] |
| HU-21.004 | Evitar ruteo OPM en el meta-grafo (primitiva de vista) | RV | S | S | opcloud-ui | — |
| HU-21.005 | Mostrar marcadores rojo/verde como anclas de navegacion meta | RV | C | XS | opcloud-ui | — |
| HU-21.006 | Suspender OPL pane durante la vista Mapa del sistema | RV | S | XS | mixto | [opm-iso-19450-es §Gestion de contexto] |
| HU-21.007 | Ocultar OPD Navigator durante la vista Mapa del sistema | RV | S | XS | opcloud-ui | — |
| HU-21.008 | Navegar al OPD real por doble-clic en thumbnail y cerrar la vista | RV | S | S | mixto | [opm-iso-19450-es §Gestion de contexto] |
| HU-21.009 | Hacer zoom in / zoom out sobre el meta-grafo | RV | C | S | opcloud-ui | — |
| HU-21.010 | Hacer pan y scroll para recorrer niveles profundos | RV | S | XS | opcloud-ui | — |
| HU-21.011 | Mostrar tooltip con nombre y metadatos al hover sobre un thumbnail | RV | C | S | opcloud-ui | — |
| HU-21.012 | Filtrar thumbnails visibles por profundidad o rama del arbol | IA | C | M | mixto | — |
| HU-21.013 | Resaltar thumbnails por tipo de cosa contenida (objetos/procesos) | IA | C | M | mixto | — |
| HU-21.014 | Mostrar panel de estadisticas del modelo (conteos de cosas, enlaces, OPDs) | IA | C | S | mixto | — |
| HU-21.015 | Refrescar el Mapa del sistema bajo demanda con accion explicita | RV | S | S | opcloud-ui | — |
| HU-21.016 | Regenerar automaticamente la vista cuando cambia el arbol OPD | RV | C | M | opcloud-ui | — |
| HU-21.017 | Exportar el Mapa del sistema como imagen independiente (PNG/SVG/PDF) | RV | C | M | mixto | — |
| HU-21.018 | Persistir estado de la vista (zoom, pan, filtros) al cambiar de OPD | RV | C | S | mixto | — |

Total: **18 historias de usuario** (9 opcloud-ui, 9 mixto).

## Historias de usuario

### HU-21.001 — Activar Mapa del sistema desde Model Options del main menu

**Actor primario:** RV (revisor / lector).
**Actores secundarios:** ME (experto que explora la estructura de su propio modelo).
**Tipo:** opcloud-ui.
**Fuente normativa primaria:** — (afordance de UI OPCloud; la SSOT no prescribe el Mapa del sistema como mecanismo ontologico — cfr. [opm-iso-19450-es §Gestion de contexto] que enumera descomposicion, despliegue, expresion de estados y composicion inter-modelo como los mecanismos canonicos de gestion de contexto, sin incluir la vista derivada de thumbnails meta-graficos).
**Nivel categorico:** L (lente) primario; U (UI main menu) secundario.
**Superficie UI:** main-menu (hamburguesa arriba-izquierda) + submenu `Model options`.
**Gesto canonico:** clic en `Main menu` → `Model options` → `Mapa del sistema`.

**Historia:**
> Como revisor, quiero activar la vista Mapa del sistema desde la opcion `Model options → Mapa del sistema` del main menu para obtener de un solo gesto la meta-vista grafica completa del modelo.

**Contexto de negocio:**
El Mapa del sistema es una vista derivada, no una accion de edicion, por lo que vive en el menu de opciones globales del modelo (analogo a `Save` o `Export`) y no en la toolbar de creacion. Exponer la activacion en un unico lugar estable reduce la carga cognitiva para el usuario novato que quiere entender la estructura del modelo sin explorar el arbol manualmente.

**Criterios de aceptacion:**
- **Dado** que hay al menos un OPD con refinamientos (in-zoom o unfold), **cuando** abro el main menu y selecciono `Model options → Mapa del sistema`, **entonces** el sistema inicia la generacion de la vista y agrega una entrada nueva al arbol OPD.
- **Dado** que selecciono `Mapa del sistema` en el menu, **cuando** inicia la generacion, **entonces** se muestra un indicador de progreso mientras se computa el meta-grafo (la transcripcion indica "we shall wait a minute").
- **Dado** que la generacion termina, **cuando** se completa, **entonces** el canvas central muestra el meta-grafo resuelto y la entrada `Mapa del sistema` queda seleccionada en el arbol.
- **Dado** que el modelo esta vacio (sin refinamientos), **cuando** activo `Mapa del sistema`, **entonces** la vista muestra solo el thumbnail de SD (pregunta abierta: comportamiento en modelo 100% vacio — ver Q21.3).

**Reglas y restricciones:**
- La accion vive en `Model options`, no en la toolbar ni en el arbol OPD.
- La generacion no es instantanea; aceptar latencia y senalizarla.
- La accion es idempotente: invocarla otra vez regenera (ver HU-21.015 para refresh explicito).

**Modelo de datos tocado:**
- `vista.kind` — `"mapa_del_sistema"` — transitorio o persistente segun decision (ver Q21.1).
- `vista.id` — UUID — persistente si se guarda.
- `vista.generated_at` — ISO-8601 — persistente.

**Dependencias:**
- Bloqueada por: EPICA-20 (arbol OPD debe existir).
- Bloquea a: HU-21.002, HU-21.003, HU-21.015.

**Integraciones:**
- Main menu (EPICA-30 lo aloja).
- Arbol OPD (inserta entrada).
- Canvas principal (cambia de OPD a meta-vista).

**Notas de evidencia:**
- Fuente: `opcloud-reverse/21-estructura-system-map.md` §2, §3.1, §5.1.
- Frames: frame_00011, frame_00012.
- Transcripcion: "we'll go to the main menu then in the model options we have the system map option clicking on it will create a new opd in the opd tree with the opd map we shall wait a minute until it will generate all the opd's".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [mapa-del-sistema, main-menu, activacion, lente].

---

### HU-21.002 — Ver entrada Mapa del sistema en el arbol OPD al generarla

**Actor primario:** RV.
**Tipo:** opcloud-ui.
**Fuente normativa primaria:** — (convencion de UI OPCloud para persistir el nodo de vista derivada en el arbol OPD; la SSOT no define entradas de vista derivada en el arbol OPD).
**Nivel categorico:** L primario; U secundario.
**Superficie UI:** arbol-opd (panel izquierdo).
**Gesto canonico:** ninguno (actualizacion automatica tras HU-21.001).

**Historia:**
> Como revisor, quiero ver la entrada `Mapa del sistema` como un nodo en el arbol OPD para poder reactivarla con un clic sin repetir el camino por el main menu.

**Contexto de negocio:**
Persistir la entrada en el arbol convierte la vista en un elemento re-utilizable del modelo: una vez generado el Mapa del sistema, el usuario puede alternar con un clic entre OPDs convencionales y la meta-vista. El estilo tipografico levemente distinto (sin prefijo `SDx.y`, sin indentacion) comunica que no es un OPD convencional sino una vista derivada.

**Criterios de aceptacion:**
- **Dado** que acabo de generar un Mapa del sistema, **cuando** consulto el arbol OPD, **entonces** aparece una entrada `Mapa del sistema` al final (o debajo de los nodos `SDx.y`).
- **Dado** que la entrada `Mapa del sistema` esta en el arbol, **cuando** hago clic en ella, **entonces** el canvas muestra el meta-grafo y la entrada queda con fondo azul claro (afordance de seleccion estandar del arbol).
- **Dado** que la entrada esta seleccionada, **cuando** miro su estilo, **entonces** carece del prefijo `SDx.y` y no tiene indentacion jerarquica — distintiva de vista meta.
- **Dado** que no se ha generado ningun Mapa del sistema, **cuando** consulto el arbol, **entonces** no hay entrada `Mapa del sistema`.

**Reglas y restricciones:**
- El estilo tipografico distinguible del arbol refuerza que es vista, no OPD convencional.
- Se reutiliza el afordance de fondo azul claro del arbol para seleccion activa.
- Pregunta abierta: participacion en `Remove`, `Cut`, `Rename` (ver Q21.6).

**Modelo de datos tocado:**
- `arbol_opd.vistas[]` — arreglo de `vista` — persistente.

**Dependencias:**
- Bloqueada por: HU-21.001.
- Bloquea a: HU-21.003 (seleccion activa).

**Integraciones:**
- Arbol OPD (EPICA-20): inserta entrada especial.
- Canvas principal: reacciona al seleccionar la entrada.

**Notas de evidencia:**
- Fuente: §2, §3.4, §7.1.
- Frames: frame_00012.
- Transcripcion: "it will create a new opd in the opd tree with the opd map".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [mapa-del-sistema, arbol-opd, entrada-vista, lente].

---

### HU-21.003 — Renderizar meta-grafo con thumbnails y flechas padre-hijo

**Actor primario:** RV.
**Tipo:** mixto.
**Fuente normativa primaria:** [opm-iso-19450-es §Gestion de contexto] — la SSOT define los mecanismos canonicos de gestion de contexto (descomposicion, despliegue, expresion de estados, composicion inter-modelo) como operaciones intra- e inter-modelo. El Mapa del sistema es un operador derivado de contexto que visualiza el resultado de estos mecanismos, no un mecanismo ontologico en si.
**Nivel categorico:** V (render) primario; L secundario.
**Superficie UI:** canvas-central (en modo Mapa del sistema).
**Gesto canonico:** ninguno (render declarativo al seleccionar la vista).

**Historia:**
> Como revisor, quiero ver todos los OPDs del modelo como thumbnails posicionados jerarquicamente (SD arriba, hijos debajo) y conectados por flechas direccionales para leer la estructura de refinamiento de un vistazo.

**Contexto de negocio:**
El meta-grafo es la razon de ser del Mapa del sistema: un diagrama que responde a la pregunta "¿como se descompone el modelo?" con una respuesta visual inmediata. Cada thumbnail es una foto reducida del OPD real; las flechas codifican relaciones padre-hijo observadas en el arbol. El layout es algoritmico y top-down; el usuario no configura parametros.

**Criterios de aceptacion:**
- **Dado** que la entrada `Mapa del sistema` esta activa, **cuando** miro el canvas, **entonces** veo el thumbnail de SD en la parte superior.
- **Dado** que el modelo tiene descendientes in-zoomed (p.ej. `SD1`, `SD1.1`, `SD1.2`), **cuando** miro el canvas, **entonces** cada descendiente aparece un nivel mas abajo que su padre, con una flecha gruesa gris claro apuntando de padre a hijo.
- **Dado** que hay varios hijos del mismo padre, **cuando** miro el canvas, **entonces** los hijos se distribuyen horizontalmente bajo el padre con espaciado generoso.
- **Dado** que un thumbnail representa un OPD real (p.ej. `Reverse Sensing in-zoomed`), **cuando** miro el thumbnail, **entonces** muestra una miniatura fiel del render del OPD con su etiqueta textual (nombre del OPD) adyacente.
- **Dado** que el thumbnail es una miniatura, **cuando** miro su contorno, **entonces** NO tiene frame propio (no es rectangulo contenedor) — se presenta como "ventana recortada".

**Reglas y restricciones:**
- Layout top-down algoritmico; sin parametros expuestos al usuario.
- Alineacion: hijos debajo del padre, dispersos horizontalmente.
- Flechas padre-hijo: gruesas, rellenas, gris claro, direccionales (no negras ni estilizadas como enlaces OPM).
- Thumbnails preservan la gramatica interna del OPD pero no se disfrazan de cosa OPM (sin frame).
- Etiquetas textuales con nombre exacto del OPD (p.ej. `Reverse Sensing in-zoomed`).

**Modelo de datos tocado:**
- `vista.layout` — `{algoritmo: "top-down", nodos: [{opd_id, x, y}], aristas: [{from, to}]}` — transitorio (recalculable) o persistente (si snapshot).
- `vista.snapshot_arbol_opd` — estructura capturada en el momento de generar.

**Dependencias:**
- Bloqueada por: HU-21.001, HU-21.002.
- Bloquea a: HU-21.004, HU-21.005, HU-21.008.

**Integraciones:**
- Render JointJS: shapes especiales para thumbnails.
- Layout engine: algoritmo top-down (potencialmente dagre adaptado con rankdir TB y rank por profundidad).
- Arbol OPD: fuente de la jerarquia.

**Notas de evidencia:**
- Fuente: §2 tabla de superficies, §3.2, §5.3, §9.1, §9.2, §9.5.
- Frames: frame_00013, frame_00015, frame_00016.
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [mapa-del-sistema, render, layout-top-down, thumbnails, flechas-meta].

---

### HU-21.004 — Evitar ruteo OPM en el meta-grafo (primitiva de vista)

**Actor primario:** RV.
**Tipo:** opcloud-ui.
**Fuente normativa primaria:** — (decision arquitectonica de OPCloud para separar visualmente la capa de vistas meta del lenguaje OPM; la SSOT no regula el ruteo de vistas derivadas no-ontologicas).
**Nivel categorico:** V (render).
**Superficie UI:** canvas-mapa-del-sistema.
**Gesto canonico:** ninguno.

**Historia:**
> Como revisor, quiero que el meta-grafo del Mapa del sistema use flechas propias (gruesas, grises) y no el ruteo canonico de enlaces OPM para entender de un vistazo que miro una vista meta, no un diagrama OPM.

**Contexto de negocio:**
Mezclar primitivas de vista (flechas padre-hijo del meta-grafo) con primitivas del lenguaje OPM (enlaces procedimentales/estructurales negros, con ruteo complejo) confundiria al usuario. OPCloud resuelve esto dandole a las flechas meta un grosor 5-8x mayor que cualquier enlace OPM y color gris claro, separandolas visualmente del lenguaje. Esta decision es **arquitectonica**: las flechas meta viven en la capa de vistas (V-114 de la SSOT), no en la capa del lenguaje OPM.

**Criterios de aceptacion:**
- **Dado** que miro una flecha padre-hijo del meta-grafo, **cuando** comparo con un enlace procedimental OPM tipico, **entonces** la flecha meta es 5-8 veces mas gruesa y de color gris claro (no negro).
- **Dado** que el meta-grafo se renderiza, **cuando** reviso el codigo, **entonces** las flechas NO pasan por el algoritmo de ruteo OPM (sin ortogonalizacion obligatoria, sin respeto a zonas interno/externo).
- **Dado** que una flecha padre-hijo conecta thumbnails, **cuando** la miro, **entonces** su trayectoria es directa (recta o curva suave), sin rutas ortogonales.
- **Dado** que el sistema renderiza el meta-grafo, **cuando** reviso la estructura, **entonces** no hay agrupacion por afinidad OPM (essence/affiliation no aplica en vistas meta).

**Reglas y restricciones:**
- Flechas meta tienen grosor minimo visible (convencion: `strokeWidth: 5–8`).
- Color gris claro distintivo (convencion observada §9.2).
- El ruteo respeta layout top-down, no las convenciones OPM de enlaces.
- Decision arquitectonica: separacion capa lenguaje / capa vistas (alineacion con doc `docs/ARQUITECTURA-CATEGORICA.md`).

**Modelo de datos tocado:**
- `vista.rendering.edge_style` — constante — transitorio.

**Dependencias:**
- Bloqueada por: HU-21.003.

**Integraciones:**
- Render JointJS: factory de flecha meta separada del factory de enlace OPM.
- Layout engine: meta-layout independiente del layout OPM.

**Notas de evidencia:**
- Fuente: §9.2, §9.4, §9.5, §5.4.
- Frames: frame_00013, frame_00015.
- Clase de afirmacion: observado + inferido (decision arquitectonica).

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [mapa-del-sistema, render, separacion-capas, flechas-meta].

---

### HU-21.005 — Mostrar marcadores rojo/verde como anclas de navegacion meta

**Actor primario:** RV.
**Tipo:** opcloud-ui.
**Fuente normativa primaria:** — (convencion grafica idiosincratica de OPCloud sin contraparte en la SSOT; los colores rojo/verde no tienen semantica OPM normada para navegacion).
**Nivel categorico:** V.
**Superficie UI:** thumbnail (esquina superior-izquierda).
**Gesto canonico:** ninguno (render declarativo).

**Historia:**
> Como revisor, quiero ver un par de circulos rojo-verde en el borde superior-izquierdo de cada thumbnail (excepto SD) para identificar visualmente las anclas de entrada y salida de las flechas meta.

**Contexto de negocio:**
Los pares rojo/verde actuan como **marcadores estructurales** de la vista, no de validacion. Es una convencion grafica de OPCloud: rojo arriba = salida hacia el padre; verde abajo = entrada desde el padre. El SD raiz no los muestra porque no tiene padre. La eleccion del par rojo/verde es inusual porque OPCloud **no** los usa para validacion (ver EPICA-1C), lo que hace la convencion idiosincratica pero consistente dentro del Mapa del sistema.

**Criterios de aceptacion:**
- **Dado** que un thumbnail no es el SD raiz, **cuando** miro su esquina superior-izquierda, **entonces** veo un par de circulos (uno rojo, uno verde).
- **Dado** que el thumbnail es el SD raiz, **cuando** miro su esquina superior-izquierda, **entonces** NO hay pareja rojo/verde.
- **Dado** que miro el rojo de un thumbnail, **cuando** sigo la flecha saliente, **entonces** conecta hacia arriba (al padre).
- **Dado** que miro el verde de un thumbnail, **cuando** sigo la flecha entrante, **entonces** viene desde arriba (desde el padre).

**Reglas y restricciones:**
- Convencion grafica no documentada en tooltip ni en UI (§9.3).
- No configurable por el usuario.
- Paleta rojo/verde reservada a meta-navegacion — colisiona semanticamente con convenciones web estandar de validacion, pero OPCloud mantiene esa reserva (§9.4).

**Modelo de datos tocado:**
- Ninguno directo; los marcadores se derivan de la existencia de `parent_id` del OPD representado.

**Dependencias:**
- Bloqueada por: HU-21.003.

**Integraciones:**
- Render JointJS: decoracion del thumbnail.

**Notas de evidencia:**
- Fuente: §2 tabla, §4.3, §5.4, §9.3, §9.4.
- Frames: frame_00013, frame_00015.
- Clase de afirmacion: observado + inferido (semantica).

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [mapa-del-sistema, render, marcadores, meta-navegacion].

---

### HU-21.006 — Suspender OPL pane durante la vista Mapa del sistema

**Actor primario:** RV.
**Tipo:** mixto.
**Fuente normativa primaria:** [opm-iso-19450-es §Gestion de contexto] — el contrato OPD⇄OPL es bimodal por modelo individual; la SSOT no prescribe OPL para vistas meta derivadas no ontologicas. Suspender OPL es semantica correcta porque el Mapa del sistema no es un OPD.
**Nivel categorico:** L (contrato OPD⇄OPL).
**Superficie UI:** opl-pane (debajo del canvas).
**Gesto canonico:** ninguno.

**Historia:**
> Como revisor, quiero que el OPL pane quede vacio al activar el Mapa del sistema para entender que la vista es meta y no genera oraciones OPL.

**Contexto de negocio:**
OPL es el canal textual del lenguaje OPM — traduccion natural de un diagrama OPD. El Mapa del sistema **no es un OPD**: es una vista meta sobre la coleccion de OPDs. Emitir OPL aqui seria semanticamente incorrecto. Suspender el contrato OPD⇄OPL comunica la diferencia de capas.

**Criterios de aceptacion:**
- **Dado** que activo la vista Mapa del sistema, **cuando** consulto el OPL pane, **entonces** esta vacio.
- **Dado** que la vista Mapa del sistema esta activa, **cuando** interactuo con thumbnails (hover, seleccion parcial), **entonces** el OPL pane sigue vacio.
- **Dado** que navego desde un thumbnail a un OPD real (HU-21.008), **cuando** el Mapa del sistema se cierra, **entonces** el OPL pane se restaura con las oraciones del OPD destino.

**Reglas y restricciones:**
- OPL pane es render derivado del OPD activo; si el activo no es OPD (sino vista), OPL queda vacio.
- No hay mensaje placeholder "no OPL para vistas meta" — simplemente vacio.
- Invariante: OPL no consulta `vista.*` para generar oraciones.

**Modelo de datos tocado:**
- Ninguno (efecto de render).

**Dependencias:**
- Bloqueada por: HU-21.001, HU-21.003.

**Integraciones:**
- Motor OPL (`src/render/opl-renderer.ts`): gating por `vista.kind`.

**Notas de evidencia:**
- Fuente: §2 tabla, §4.2, §7.3.
- Frames: frame_00013–frame_00016.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [mapa-del-sistema, opl, lente, suspension].

---

### HU-21.007 — Ocultar OPD Navigator durante la vista Mapa del sistema

**Actor primario:** RV.
**Tipo:** opcloud-ui.
**Fuente normativa primaria:** — (decision de UI OPCloud para evitar redundancia visual; la SSOT no regula la coexistencia de minimapas en vistas derivadas).
**Nivel categorico:** U.
**Superficie UI:** opd-navigator (minimapa inferior izquierdo).
**Gesto canonico:** ninguno.

**Historia:**
> Como revisor, quiero que el OPD Navigator desaparezca al activar el Mapa del sistema porque la vista ya es un minimapa de todo el modelo — tener dos minimapas seria redundante.

**Contexto de negocio:**
El OPD Navigator es el minimapa del OPD activo para orientarse dentro de el. El Mapa del sistema es, por naturaleza, un minimapa del **modelo completo**. Superponer dos minimapas es redundante y ruidoso. OPCloud resuelve ocultando el Navigator mientras la vista meta esta activa.

**Criterios de aceptacion:**
- **Dado** que activo la vista Mapa del sistema, **cuando** miro la esquina inferior izquierda, **entonces** el OPD Navigator esta ausente.
- **Dado** que navego desde un thumbnail a un OPD real, **cuando** el Mapa del sistema se cierra, **entonces** el OPD Navigator reaparece con la miniatura del OPD destino.

**Reglas y restricciones:**
- Ocultar es diferente de deshabilitar: el widget no se renderiza.
- El Navigator sigue existiendo en el DOM para OPDs convencionales.

**Dependencias:**
- Bloqueada por: HU-21.001, HU-21.003.

**Integraciones:**
- OPD Navigator (EPICA-20): gating por `vista.kind`.

**Notas de evidencia:**
- Fuente: §2 tabla, §4.2, §7.4.
- Frames: frame_00013–frame_00016.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [mapa-del-sistema, navigator, suspension].

---

### HU-21.008 — Navegar al OPD real por doble-clic en thumbnail y cerrar la vista

**Actor primario:** RV.
**Actores secundarios:** ME (navegacion rapida del modelo).
**Tipo:** mixto.
**Fuente normativa primaria:** [opm-iso-19450-es §Gestion de contexto] — el Mapa del sistema opera como un radar de navegacion entre contextos, materializando la operacion de cambio de contexto (OPD activo) definida en los mecanismos de gestion contextual de la SSOT.
**Nivel categorico:** L primario; U secundario.
**Superficie UI:** canvas-mapa-del-sistema (thumbnail) → canvas-central (OPD destino).
**Gesto canonico:** doble-clic sobre un thumbnail (posiblemente clic simple tambien; ver HU-21.011).

**Historia:**
> Como revisor, quiero hacer doble-clic sobre un thumbnail para saltar directamente al OPD real que representa y que la vista Mapa del sistema se cierre automaticamente, convirtiendola en un radar de navegacion.

**Contexto de negocio:**
El Mapa del sistema es un **radar de navegacion**, no un lugar de estancia prolongada: su proposito es orientar al usuario y llevarlo al OPD destino de interes. Cerrar la vista automaticamente tras el doble-clic refuerza ese modelo mental — el usuario no tiene que hacer un segundo gesto para "volver". El canvas y el OPL se restauran al modo estandar.

**Criterios de aceptacion:**
- **Dado** que el Mapa del sistema esta activo, **cuando** hago doble-clic sobre un thumbnail (p.ej. `Audible Visual Messaging in-zoomed`), **entonces** el canvas central cambia al OPD real y la vista Mapa del sistema se cierra.
- **Dado** que la vista se cierra tras navegar, **cuando** miro el arbol, **entonces** el nodo del OPD destino queda seleccionado (no la entrada `Mapa del sistema`).
- **Dado** que la vista se cierra, **cuando** miro el OPL pane, **entonces** se restaura con las oraciones del OPD destino.
- **Dado** que la vista se cierra, **cuando** miro la esquina inferior izquierda, **entonces** el OPD Navigator reaparece (HU-21.007).
- **Dado** que quiero volver al Mapa del sistema, **cuando** hago clic en la entrada `Mapa del sistema` del arbol, **entonces** la vista se reactiva sin regenerar el meta-grafo (si no hubo cambios) — ver HU-21.016.

**Reglas y restricciones:**
- Gesto canonico es **doble-clic** segun transcripcion; clic simple podria mostrar tooltip o preview (ver HU-21.011).
- Al cerrar la vista, cambia la seleccion del arbol del `Mapa del sistema` al OPD destino.
- La entrada `Mapa del sistema` permanece en el arbol; puede reactivarse.

**Modelo de datos tocado:**
- `app_state.active_opd_id` — ID del OPD activo — transitorio.
- `app_state.active_view` — `"opd" | "mapa_del_sistema"` — transitorio.

**Dependencias:**
- Bloqueada por: HU-21.003.
- Integra: EPICA-20 (seleccion del arbol).

**Integraciones:**
- Canvas principal: reemplaza render.
- OPL pane: reactivacion.
- OPD Navigator: reactivacion.

**Notas de evidencia:**
- Fuente: §3.3, §4.4, §5.2.
- Frames: frame_00017.
- Transcripcion: "if you want to go into a specific diagram you just need to click it and automatically double click it and automatically it will go back and it will close the system map option".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [mapa-del-sistema, navegacion, doble-clic, salida].

---

### HU-21.009 — Hacer zoom in / zoom out sobre el meta-grafo

**Actor primario:** RV.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Fuente normativa primaria:** — (afordance estandar de navegacion en canvas 2D; la SSOT no regula interacciones de zoom en vistas derivadas meta-graficas).
**Nivel categorico:** U primario; V secundaria.
**Superficie UI:** canvas-mapa-del-sistema.
**Gesto canonico:** rueda del mouse con `Ctrl` (convencion estandar); botones `+` / `-` (opcional); pinch en trackpad.

**Historia:**
> Como revisor, quiero hacer zoom in/out sobre el meta-grafo para acercarme y leer detalles de un thumbnail o alejarme para abarcar todo el modelo de un vistazo.

**Contexto de negocio:**
En modelos grandes (decenas o cientos de OPDs), el layout del meta-grafo puede superar la ventana visible. Zoom es la afordance estandar para explorar espacios 2D grandes; complementa al pan (HU-21.010). Sin zoom, los thumbnails mas profundos serian ilegibles o requeririan scrolls largos. Pregunta abierta en el doc fuente sobre la existencia explicita del gesto — lo inferimos de la observacion implicita del canvas OPCloud que admite zoom estandar.

**Criterios de aceptacion:**
- **Dado** que el Mapa del sistema esta activo, **cuando** hago `Ctrl + rueda del mouse hacia arriba`, **entonces** el meta-grafo hace zoom in centrado en el cursor.
- **Dado** que el Mapa del sistema esta activo, **cuando** hago `Ctrl + rueda del mouse hacia abajo`, **entonces** el meta-grafo hace zoom out.
- **Dado** que hago zoom in, **cuando** un thumbnail queda ampliado, **entonces** el contenido interno (cosas OPM del OPD representado) gana legibilidad.
- **Dado** que hago zoom out, **cuando** el meta-grafo se aleja, **entonces** la estructura global se lee de un vistazo.
- **Dado** que quiero volver al zoom por defecto, **cuando** uso un atajo (p.ej. `0` o `Fit to view`), **entonces** el meta-grafo se ajusta a la ventana — pregunta abierta sobre atajo exacto.

**Reglas y restricciones:**
- Rango de zoom razonable: minimo 10%–20% (para abarcar modelos grandes); maximo 300%–500% (para leer contenido interno de un thumbnail).
- Zoom respeta el layout top-down; no hay re-layout por zoom.
- El zoom es estado de la vista, no del modelo.

**Modelo de datos tocado:**
- `vista.ui_state.zoom` — numero — transitorio (o persistente segun HU-21.018).

**Dependencias:**
- Bloqueada por: HU-21.003.
- Relaciona: HU-21.018 (persistencia UI).

**Integraciones:**
- Render JointJS: transformacion de escala del paper.

**Notas de evidencia:**
- Fuente: §3.2 (implicito), §5.3, §9.5.
- Clase de afirmacion: inferido (gesto estandar de canvas; no observado explicitamente en frames).
- Etiqueta: `requires-clarification` (¿existe atajo propio del Mapa del sistema?).

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [mapa-del-sistema, zoom, navegacion, requires-clarification].

---

### HU-21.010 — Hacer pan y scroll para recorrer niveles profundos

**Actor primario:** RV.
**Tipo:** opcloud-ui.
**Fuente normativa primaria:** — (afordance estandar de navegacion en canvas; la SSOT no regula interacciones de pan en vistas derivadas).
**Nivel categorico:** U.
**Superficie UI:** canvas-mapa-del-sistema.
**Gesto canonico:** drag en zona vacia del canvas (pan); scroll vertical; scrollbars.

**Historia:**
> Como revisor, quiero hacer pan/scroll sobre el meta-grafo para recorrer niveles profundos (SD1.1.1, SD1.2) que no caben en la ventana inicial.

**Contexto de negocio:**
El layout top-down genera naturalmente grafos alargados verticalmente cuando hay varios niveles de refinamiento. Pan y scroll son las afordances basicas para recorrerlos. El pan complementa al zoom (HU-21.009) cuando el usuario quiere explorar sin cambiar la escala.

**Criterios de aceptacion:**
- **Dado** que el meta-grafo excede la ventana visible verticalmente, **cuando** hago scroll vertical, **entonces** puedo recorrer los niveles mas profundos (p.ej. `Data Preparing in-zoomed`).
- **Dado** que el meta-grafo excede la ventana horizontalmente (varios hijos de un padre), **cuando** hago scroll horizontal o pan, **entonces** puedo recorrer los hermanos.
- **Dado** que hago drag en zona vacia del canvas, **cuando** muevo, **entonces** el meta-grafo se desplaza (pan) en la direccion del drag.
- **Dado** que hago drag sobre un thumbnail, **cuando** muevo, **entonces** NO se desplaza el thumbnail (la vista es read-only — HU-21.004).

**Reglas y restricciones:**
- Pan funciona solo en zona vacia del canvas; sobre thumbnails no se permite (read-only).
- Scroll con teclas de direccion tambien admitido como alternativa.
- El pan es estado de la vista, no del modelo.

**Modelo de datos tocado:**
- `vista.ui_state.pan` — `{x, y}` — transitorio (o persistente segun HU-21.018).

**Dependencias:**
- Bloqueada por: HU-21.003.
- Relaciona: HU-21.009 (zoom), HU-21.018 (persistencia UI).

**Integraciones:**
- Render JointJS: transformacion de translate del paper.

**Notas de evidencia:**
- Fuente: §3.2 ("Scroll o pan revelan niveles mas profundos").
- Frames: frame_00015 (revela nivel 3 tras scroll).
- Clase de afirmacion: confirmado por observacion.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [mapa-del-sistema, pan, scroll, navegacion].

---

### HU-21.011 — Mostrar tooltip con nombre y metadatos al hover sobre un thumbnail

**Actor primario:** RV.
**Tipo:** opcloud-ui.
**Fuente normativa primaria:** — (afordance de UI estandar para informacion contextual; no observada explicitamente en OPCloud ni normada por la SSOT).
**Nivel categorico:** U primario; L secundaria.
**Superficie UI:** canvas-mapa-del-sistema + tooltip emergente.
**Gesto canonico:** hover sostenido sobre thumbnail.

**Historia:**
> Como revisor, quiero ver un tooltip con el nombre completo del OPD y metadatos esenciales (SD-path, conteos de cosas) al hacer hover sobre un thumbnail para obtener informacion sin navegar.

**Contexto de negocio:**
En modelos grandes, la etiqueta textual adyacente al thumbnail puede ser truncada por falta de espacio, o el usuario puede querer decidir si vale la pena navegar sin abandonar la vista meta. Un tooltip es la afordance liviana para dar ese contexto. Complementa a HU-21.014 (panel de estadisticas globales) con informacion por-OPD.

**Criterios de aceptacion:**
- **Dado** que el Mapa del sistema esta activo, **cuando** hago hover sostenido (p.ej. 500ms) sobre un thumbnail, **entonces** aparece un tooltip con el nombre completo del OPD, su SD-path (p.ej. `SD1.1.1`), y conteos (p.ej. `7 cosas, 12 enlaces`).
- **Dado** que muevo el cursor fuera del thumbnail, **cuando** pierde el hover, **entonces** el tooltip se cierra.
- **Dado** que hago clic simple sobre un thumbnail, **cuando** el tooltip esta abierto, **entonces** el clic no activa navegacion pero si puede cerrar el tooltip.
- **Dado** que el tooltip esta abierto, **cuando** hago doble-clic, **entonces** navega al OPD (HU-21.008) y cierra la vista.

**Reglas y restricciones:**
- Delay de aparicion del tooltip: ~500ms para evitar ruido en hovers rapidos.
- Contenido del tooltip debe ser derivado del modelo, no cacheado arbitrariamente.
- Pregunta abierta: clic simple sobre thumbnail — ¿navega (como doble-clic) o muestra tooltip?

**Modelo de datos tocado:**
- Ninguno nuevo; consume agregados derivados del OPD representado.

**Dependencias:**
- Bloqueada por: HU-21.003.
- Relaciona: HU-21.008 (doble-clic navega), HU-21.014 (estadisticas globales).

**Integraciones:**
- Render UI: componente tooltip estandar.
- Lente del modelo: conteos por OPD.

**Notas de evidencia:**
- Fuente: §5.2 (no observado menu contextual), §11 preguntas abiertas.
- Clase de afirmacion: inferido (convencion UI comun; no observado explicitamente en frames).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [mapa-del-sistema, tooltip, hover, requires-clarification].

---

### HU-21.012 — Filtrar thumbnails visibles por profundidad o rama del arbol

**Actor primario:** IA (analista de modelo).
**Actores secundarios:** ME.
**Tipo:** mixto.
**Fuente normativa primaria:** — (operacion de lente propia del modelador de este repo; la SSOT no define filtrado sobre vistas derivadas meta-graficas, aunque el concepto de recorte de contexto es analogo a las operaciones de gestion de contexto de [opm-iso-19450-es §Gestion de contexto]).
**Nivel categorico:** L (lente).
**Superficie UI:** canvas-mapa-del-sistema + panel-filtros (lateral o superior).
**Gesto canonico:** seleccion de criterio de filtrado (dropdown, slider, check).

**Historia:**
> Como analista, quiero filtrar los thumbnails visibles del Mapa del sistema por profundidad maxima o por rama del arbol para concentrarme en una zona del modelo sin el ruido del resto.

**Contexto de negocio:**
En modelos grandes, ver todos los OPDs simultaneamente puede saturar al usuario. Filtrar por profundidad (p.ej. "solo hasta SD1.x") o por rama (p.ej. "solo descendientes de `Reverse Sensing`") convierte al Mapa del sistema en una herramienta analitica dirigida. Esta HU extiende el Mapa del sistema mas alla de la observacion inicial en OPCloud (no observado); es una mejora propia del modelador de este repo.

**Criterios de aceptacion:**
- **Dado** que el Mapa del sistema esta activo, **cuando** abro un panel de filtros y selecciono profundidad maxima = 2, **entonces** solo se renderizan los thumbnails hasta SDx.y (inclusive).
- **Dado** que selecciono una rama (p.ej. `Reverse Sensing in-zoomed`), **cuando** aplico el filtro, **entonces** solo se muestran el thumbnail seleccionado y sus descendientes.
- **Dado** que aplico un filtro, **cuando** los thumbnails ocultos desaparecen, **entonces** el layout se recomputa para aprovechar el espacio liberado (pregunta abierta: ¿recompute o solo hide con gap?).
- **Dado** que limpio los filtros, **cuando** lo confirmo, **entonces** vuelvo a la vista completa del meta-grafo.

**Reglas y restricciones:**
- Los filtros son estado de vista, no del modelo — no se guardan en `opd.*`.
- Combinaciones de filtros son conjuntivas (AND).
- No hay filtrado que oculte al SD raiz (contradiccion logica).
- Pregunta abierta: ¿persistir filtros entre sesiones? Ver HU-21.018.

**Modelo de datos tocado:**
- `vista.ui_state.filters` — `{profundidad_max: number | null, rama_id: string | null}` — transitorio o persistente.

**Dependencias:**
- Bloqueada por: HU-21.003.
- Relaciona: HU-21.018 (persistencia UI).

**Integraciones:**
- Lente del modelo: filtrado de arbol.
- Layout engine: recompute o hide.

**Notas de evidencia:**
- Fuente: no observado en OPCloud — extension del modelador de este repo.
- Clase de afirmacion: hipotesis (mejora ambiciosa derivada del principio de lente).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [mapa-del-sistema, filtrado, lente, requires-clarification].

---

### HU-21.013 — Resaltar thumbnails por tipo de cosa contenida (objetos/procesos)

**Actor primario:** IA.
**Tipo:** mixto.
**Fuente normativa primaria:** — (operacion de lente propia del modelador de este repo; la SSOT no define resaltado sobre vistas derivadas, aunque se apoya en la taxonomia de cosas de [opm-iso-19450-es §Cosas]).
**Nivel categorico:** L primario; V secundaria.
**Superficie UI:** canvas-mapa-del-sistema + panel-highlight.
**Gesto canonico:** seleccion de criterio de resaltado.

**Historia:**
> Como analista, quiero resaltar los thumbnails que contienen un tipo especifico de cosa (p.ej. solo procesos, solo objetos fisicos) para identificar rapido donde vive cada tipo de entidad en la estructura del modelo.

**Contexto de negocio:**
Un modelo bien estructurado tiende a agrupar tipos por afinidad: OPDs de procesamiento puro, OPDs de estructura de datos, OPDs de dominio fisico. Resaltar thumbnails que contienen un tipo determinado ayuda al analista a identificar violaciones de cohesion o a encontrar patrones. Es complementario al filtrado (HU-21.012) porque el resaltado preserva la visibilidad global pero destaca subconjuntos.

**Criterios de aceptacion:**
- **Dado** que el Mapa del sistema esta activo, **cuando** selecciono `Resaltar: thumbnails con solo procesos`, **entonces** esos thumbnails se renderizan con halo o enfasis visual (p.ej. borde amarillo).
- **Dado** que selecciono `Resaltar: thumbnails con algun objeto fisico`, **cuando** aplico, **entonces** se resaltan los thumbnails que contienen al menos un objeto con `essence=fisica`.
- **Dado** que limpio el resaltado, **cuando** lo confirmo, **entonces** todos los thumbnails vuelven al estilo estandar.
- **Dado** que el filtrado (HU-21.012) y el resaltado estan activos a la vez, **cuando** miro, **entonces** el resaltado aplica solo sobre los thumbnails visibles tras el filtrado.

**Reglas y restricciones:**
- Resaltado es no-exclusivo: los thumbnails no destacados siguen visibles pero mas atenuados.
- Criterios de resaltado observables: tipo de cosa, esencia, afiliacion, presencia de stereotypes.
- Estado de resaltado no persiste en el modelo.

**Modelo de datos tocado:**
- `vista.ui_state.highlight` — `{criterio: enum, valor: any}` — transitorio o persistente.

**Dependencias:**
- Bloqueada por: HU-21.003.

**Integraciones:**
- Lente del modelo: agregados por OPD.
- Render JointJS: decoracion condicional de thumbnails.

**Notas de evidencia:**
- Fuente: no observado en OPCloud — extension propia del modelador.
- Clase de afirmacion: hipotesis.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [mapa-del-sistema, highlight, lente, analisis, requires-clarification].

---

### HU-21.014 — Mostrar panel de estadisticas del modelo (conteos de cosas, enlaces, OPDs)

**Actor primario:** IA.
**Actores secundarios:** RV.
**Tipo:** mixto.
**Fuente normativa primaria:** — (operacion de lente propia del modelador de este repo; la SSOT no define dashboard de estadisticas, aunque los conteos derivan de la taxonomia de [opm-iso-19450-es §Cosas] y [opm-iso-19450-es §Enlaces]).
**Nivel categorico:** L.
**Superficie UI:** panel-estadisticas (lateral o superior del Mapa del sistema).
**Gesto canonico:** ninguno (render automatico al activar la vista).

**Historia:**
> Como analista, quiero ver un panel con estadisticas del modelo (total de OPDs, total de cosas por tipo, total de enlaces) mientras miro el Mapa del sistema para tener un dashboard global ademas del meta-grafo.

**Contexto de negocio:**
El Mapa del sistema responde a la pregunta "¿como se descompone el modelo?". Un panel de estadisticas responde a "¿que magnitud tiene?". Ambas lecturas son complementarias. Para el analista es natural querer ambos datos simultaneamente: estructura grafica + metricas numericas. No se observa en OPCloud pero es una extension natural del principio de lente sobre el modelo.

**Criterios de aceptacion:**
- **Dado** que el Mapa del sistema esta activo, **cuando** miro el panel de estadisticas, **entonces** veo conteos de: total OPDs, total cosas, cosas por tipo (procesos, objetos), enlaces por tipo, cosas con estados.
- **Dado** que cambia el modelo (cosa creada o eliminada en otro OPD antes de activar), **cuando** activo o refresco (HU-21.015) el Mapa del sistema, **entonces** los conteos se actualizan.
- **Dado** que los conteos se computan, **cuando** se muestran, **entonces** son derivados deterministicamente del modelo (sin cache divergente).
- **Dado** que el modelo esta vacio, **cuando** miro las estadisticas, **entonces** todos los conteos son cero o el panel muestra un estado neutro.

**Reglas y restricciones:**
- Estadisticas son lente pura: sin mutacion.
- Actualizacion debe ser consistente con HU-21.015/HU-21.016 (estrategia de refresh).
- Performance: calculo O(N) sobre el modelo; aceptable hasta miles de entidades.

**Modelo de datos tocado:**
- Ninguno nuevo; agregados derivados.

**Dependencias:**
- Bloqueada por: HU-21.003.
- Relaciona: HU-21.015 (refresh), HU-21.016 (auto-refresh).

**Integraciones:**
- Lente del modelo: agregadores de conteos.
- UI: componente panel.

**Notas de evidencia:**
- Fuente: no observado en OPCloud — extension propia del modelador.
- Clase de afirmacion: hipotesis (mejora alineada con principio de lente).

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [mapa-del-sistema, estadisticas, lente, dashboard].

---

### HU-21.015 — Refrescar el Mapa del sistema bajo demanda con accion explicita

**Actor primario:** RV.
**Tipo:** opcloud-ui.
**Fuente normativa primaria:** — (afordance de UI OPCloud; la SSOT no regula el ciclo de vida de vistas derivadas no ontologicas).
**Nivel categorico:** L primario; U secundario.
**Superficie UI:** boton-refresh (toolbar del Mapa del sistema) o entrada del main menu.
**Gesto canonico:** clic en `Refresh` o re-activacion desde `Model options → Mapa del sistema`.

**Historia:**
> Como revisor, quiero refrescar el meta-grafo del Mapa del sistema con una accion explicita para re-calcular la vista despues de haber modificado el arbol OPD (creado o eliminado refinamientos).

**Contexto de negocio:**
El Mapa del sistema es un snapshot generado en un momento dado (recuerdese la transcripcion "we shall wait a minute until it will generate"). Si el modelo cambia despues, la vista podria quedar desactualizada. Un refresh explicito da al usuario control sobre cuando recomputar, evitando recomputos automaticos costosos en modelos grandes. Complementa a HU-21.016 (auto-refresh) como alternativa de menor costo.

**Criterios de aceptacion:**
- **Dado** que ya genere un Mapa del sistema y luego cree un nuevo in-zoom en otro OPD, **cuando** activo `Refresh` del Mapa del sistema, **entonces** el meta-grafo se recomputa e incluye el nuevo thumbnail.
- **Dado** que presiono `Refresh` sin cambios intermedios, **cuando** termina, **entonces** el meta-grafo es identico al anterior (salvo `vista.generated_at`).
- **Dado** que el refresh tarda (modelo grande), **cuando** esta procesando, **entonces** se muestra un indicador de progreso.
- **Dado** que el refresh sobrescribe la vista previa, **cuando** termina, **entonces** la entrada `Mapa del sistema` del arbol permanece (no se duplica — ver Q21.2).

**Reglas y restricciones:**
- Refresh es idempotente si no hay cambios.
- No duplicar entradas en el arbol (invariante).
- Accion disponible solo cuando la vista esta activa.

**Modelo de datos tocado:**
- `vista.generated_at` — ISO-8601 — persistente.
- `vista.snapshot_arbol_opd` — reemplazado.

**Dependencias:**
- Bloqueada por: HU-21.001, HU-21.003.
- Relaciona: HU-21.016 (auto-refresh).

**Integraciones:**
- Motor de generacion del meta-grafo.

**Notas de evidencia:**
- Fuente: §4.1 (latencia), §11 pregunta abierta 1.
- Clase de afirmacion: inferido (necesario ante la ausencia de auto-refresh confirmada).

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [mapa-del-sistema, refresh, snapshot, on-demand].

---

### HU-21.016 — Regenerar automaticamente la vista cuando cambia el arbol OPD

**Actor primario:** RV.
**Tipo:** opcloud-ui.
**Fuente normativa primaria:** — (decision de UI OPCloud sobre estrategia de actualizacion de vistas derivadas; la SSOT no regula la reactividad de vistas no ontologicas).
**Nivel categorico:** L.
**Superficie UI:** canvas-mapa-del-sistema (actualizacion transparente).
**Gesto canonico:** ninguno (reactivo).

**Historia:**
> Como revisor, quiero que el Mapa del sistema se regenere automaticamente cuando cambie el arbol OPD (se agregue o elimine un refinamiento) para siempre ver la estructura vigente sin refrescar manualmente.

**Contexto de negocio:**
El auto-refresh elimina friccion para flujos donde el usuario alterna frecuentemente entre editar OPDs y consultar la estructura. Es la alternativa de mayor comodidad al refresh explicito (HU-21.015), con el costo de recomputar ante cada cambio estructural. En modelos grandes, el recompute puede ser caro — por eso la HU no es M0 y su activacion deberia ser configurable.

**Criterios de aceptacion:**
- **Dado** que el auto-refresh esta habilitado y el Mapa del sistema esta activo, **cuando** creo un nuevo in-zoom en el OPD activo (transitoriamente), **entonces** al volver al Mapa del sistema el meta-grafo ya refleja el cambio.
- **Dado** que el auto-refresh esta deshabilitado, **cuando** modifico el arbol, **entonces** el Mapa del sistema solo se actualiza con refresh explicito (HU-21.015).
- **Dado** que el modelo es grande y el recompute tarda, **cuando** el auto-refresh dispara, **entonces** se muestra feedback no bloqueante (indicador leve).
- **Dado** que el setting de auto-refresh se guarda, **cuando** cierro y reabro la aplicacion, **entonces** el setting persiste.

**Reglas y restricciones:**
- Estrategia de deteccion: observar mutaciones del arbol OPD (`opd.parent_id`, `opd.children`), no de las cosas internas.
- Umbral opcional: solo regenerar si pasaron N cambios acumulados, para evitar recomputos excesivos.
- Si la vista no esta activa, el auto-refresh se difere hasta la proxima activacion.

**Modelo de datos tocado:**
- `configuracion.mapa_del_sistema.auto_refresh` — boolean — persistente (preferencia de usuario).

**Dependencias:**
- Bloqueada por: HU-21.015.
- Relaciona: EPICA-80 (configuracion de usuario).

**Integraciones:**
- Event log del arbol OPD (persistencia).
- Configuracion de usuario.

**Notas de evidencia:**
- Fuente: §11 pregunta abierta 1 ("Si el Mapa del sistema se regenera automaticamente al cambiar el modelo o requiere regeneracion manual").
- Clase de afirmacion: abierto.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [mapa-del-sistema, refresh, auto, reactividad, requires-clarification].

---

### HU-21.017 — Exportar el Mapa del sistema como imagen independiente (PNG/SVG/PDF)

**Actor primario:** RV.
**Actores secundarios:** AO (admin presentando a stakeholders).
**Tipo:** mixto.
**Fuente normativa primaria:** — (funcion de exportacion de vista derivada; la SSOT regula export de OPDs canonicos pero no de vistas meta-graficas no ontologicas. Cfr. [opm-iso-19450-es §Gestion de contexto] para el fundamento de la vista como operador de contexto).
**Nivel categorico:** X (integracion externa) primario; V secundaria.
**Superficie UI:** toolbar-export del Mapa del sistema + modal-opciones-export.
**Gesto canonico:** clic en `Export` + eleccion de formato.

**Historia:**
> Como revisor, quiero exportar el Mapa del sistema como PNG, SVG o PDF para incluir la meta-vista en documentacion y presentaciones fuera del modelador.

**Contexto de negocio:**
El Mapa del sistema es una vista ideal para documentacion ejecutiva: en una sola imagen describe toda la estructura del modelo. Exportarlo en formatos comunes (PNG para decks, SVG para edicion posterior, PDF para anexos) abre el canal de distribucion fuera del modelador. Comparte mecanismos con EPICA-60 (Export PDF) y EPICA-61 (Export SVG) pero con tratamiento especifico del meta-grafo (sin OPL, sin ruteo OPM).

**Criterios de aceptacion:**
- **Dado** que el Mapa del sistema esta activo, **cuando** activo `Export → PNG`, **entonces** se genera una imagen PNG con el meta-grafo completo (no solo el viewport).
- **Dado** que activo `Export → SVG`, **cuando** termina, **entonces** se genera un archivo SVG con las flechas meta, thumbnails escalables y etiquetas como texto.
- **Dado** que activo `Export → PDF`, **cuando** termina, **entonces** se genera un PDF paginado con el meta-grafo; si es muy grande, se distribuye en varias paginas o se escala a una.
- **Dado** que los thumbnails contienen contenido OPM detallado, **cuando** exporto, **entonces** los thumbnails conservan su fidelidad al tamano del viewport generado.
- **Dado** que el export esta en curso, **cuando** es grande, **entonces** se muestra un indicador de progreso.

**Reglas y restricciones:**
- El export respeta el estado actual de zoom/filtros/highlight (o se exporta un snapshot "full" segun preferencia).
- Los nombres de OPD en los thumbnails son texto, no imagenes rasterizadas (para SVG).
- Pregunta abierta: ¿el export incluye el panel de estadisticas (HU-21.014)?

**Modelo de datos tocado:**
- Ninguno (efecto de salida).

**Dependencias:**
- Bloqueada por: HU-21.003.
- Relaciona: EPICA-60 (export PDF), EPICA-61 (export SVG).

**Integraciones:**
- Motor de exportacion (compartido con EPICA-60/61).
- Renderer JointJS: serializacion a SVG.

**Notas de evidencia:**
- Fuente: §11 pregunta abierta 5 ("Si se exporta a PDF/SVG como un OPD mas o con tratamiento especial").
- Clase de afirmacion: abierto.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [mapa-del-sistema, export, png, svg, pdf, requires-clarification].

---

### HU-21.018 — Persistir estado de la vista (zoom, pan, filtros) al cambiar de OPD

**Actor primario:** RV.
**Tipo:** mixto.
**Fuente normativa primaria:** — (persistencia de estado UI de vista derivada; la SSOT no regula el estado de UI de vistas no ontologicas).
**Nivel categorico:** P (persistencia) primario; U secundario.
**Superficie UI:** canvas-mapa-del-sistema.
**Gesto canonico:** ninguno (guardado/restauracion automatica).

**Historia:**
> Como revisor, quiero que el zoom, pan y filtros del Mapa del sistema se conserven cuando salgo y vuelvo para retomar la exploracion donde la deje sin repetir los gestos.

**Contexto de negocio:**
El Mapa del sistema es una herramienta de exploracion: el usuario entra, ajusta zoom/pan/filtros para encontrar un thumbnail, navega al OPD real, luego quiere volver a la misma vista para continuar explorando. Restaurar el estado UI elimina una fuente de friccion repetida. El estado vive en `vista.ui_state`, separado del modelo OPM.

**Criterios de aceptacion:**
- **Dado** que hice zoom y pan en el Mapa del sistema, **cuando** navego a un OPD real (HU-21.008) y vuelvo al Mapa del sistema, **entonces** zoom y pan estan en los valores anteriores.
- **Dado** que aplique filtros (HU-21.012) o highlight (HU-21.013), **cuando** vuelvo al Mapa del sistema, **entonces** los filtros/highlight estan activos como los deje.
- **Dado** que cierro la aplicacion y la reabro, **cuando** activo el Mapa del sistema, **entonces** el estado UI se restaura desde persistencia local (IndexedDB).
- **Dado** que regenero el Mapa del sistema con refresh (HU-21.015), **cuando** el meta-grafo se recomputa, **entonces** zoom y pan se preservan si los nodos siguen existiendo; si cambio drasticamente, se hace `Fit to view` como fallback.

**Reglas y restricciones:**
- Persistencia en `vista.ui_state` dentro del modelo, o en `app_state.ui_preferences` si es preferencia de usuario.
- Ajustarse al patron de persistencia del repo (IndexedDB, tres capas — ADR-003).
- Invariante: `vista.ui_state` no es parte del modelo OPM semantico (no se exporta a .opcat).

**Modelo de datos tocado:**
- `vista.ui_state` — `{zoom, pan, filters, highlight}` — persistente local.

**Dependencias:**
- Bloqueada por: HU-21.009, HU-21.010, HU-21.012, HU-21.013.

**Integraciones:**
- Persistencia (`src/persistencia/`): Capa 1 (IndexedDB).

**Notas de evidencia:**
- Fuente: §11 pregunta abierta 7 ("Si el layout del meta-grafo es recalculable o se persiste con posiciones fijas") — analoga.
- Clase de afirmacion: inferido (extension del patron de persistencia de UI).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [mapa-del-sistema, persistencia-ui, requires-clarification].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q21.1**: Auto-refresh vs refresh manual del Mapa del sistema al cambiar el modelo. Ver HU-21.015 (manual) y HU-21.016 (auto). Marcadas `requires-clarification`.
- **Q21.2**: Si pueden coexistir multiples Mapas del sistema (distintos snapshots) o solo uno por modelo. Actualmente HU-21.015 asume sobrescritura.
- **Q21.3**: Si el Mapa del sistema incluye arboles de objetos (cuando existen) o solo de procesos in-zoomed. Afecta HU-21.003.
- **Q21.4**: Si los thumbnails son clicables en zonas internas (p.ej. un objeto dentro de un thumbnail) o solo el thumbnail completo actua como hotspot. Afecta HU-21.008 y HU-21.011.
- **Q21.5**: Si se exporta a PDF/SVG como un OPD mas o con tratamiento especial (cf. HU-21.017). Marcada `requires-clarification`.
- **Q21.6**: Si la entrada `Mapa del sistema` del arbol OPD participa de `Remove`, `Cut`, `Rename` como los nodos `SDx.y` o esta protegida por ser vista. Afecta HU-21.002.
- **Q21.7**: Si el layout del meta-grafo es recalculable o se persiste con posiciones fijas. Afecta HU-21.018.
- **Q21.8**: Clic simple sobre un thumbnail — ¿activa tooltip (HU-21.011), navega (como HU-21.008), o muestra preview en modal?

## Referencias cruzadas

- Doc fuente: `opcloud-reverse/21-estructura-system-map.md`.
- Epicas relacionadas:
  - **EPICA-20** (estructura-opd-tree): fuente de la jerarquia renderizada por el Mapa del sistema; la entrada `Mapa del sistema` vive en el arbol OPD.
  - **EPICA-12** (canvas-inzooming): los refinamientos in-zoomed son la principal fuente de nodos del meta-grafo.
  - **EPICA-30** (persistencia-save-load): el main menu aloja la entrada `Model options → Mapa del sistema` (HU-21.001).
  - **EPICA-50** (opl-pane): contrato suspendido durante la vista meta (HU-21.006).
