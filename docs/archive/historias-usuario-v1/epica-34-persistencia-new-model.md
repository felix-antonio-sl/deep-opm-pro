---
epica: "EPICA-34"
titulo: "Persistencia — creacion de modelo nuevo (ruta simple + asistente de 12 etapas)"
doc_fuente: "opcloud-reverse/34-persistencia-new-model.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "M1"
hu_emitidas: 28
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "DIAGNOSTICO-PILOTO-EPICA-10.md"
---

## Resumen

Esta epica cubre las **dos rutas canonicas de arranque de un modelo nuevo** observadas en OPCloud: `New Model` (ruta simple, sin siembra) y `New Model by Wizard` (ruta asistida de 12 etapas que pre-pobla un SD con estructura radial "sol"). El doc fuente documenta ambos flujos con 16 frames y transcripcion confirmada (`Intro 37 Create New Model`, `Intro 39 New Model Wizard`).

Las HU se numeran siguiendo el orden de aparicion de las superficies UI, controles y flujos en el doc fuente. La epica cruza varias capas: **chrome** (menu principal, pestañas, modales), **lienzo** (OPD inicial vacio o pre-poblado), **persistencia** (estado `Modelo (No guardado)`) y **pedagogica** (reglas lexicas enforced por el asistente: gerundio, singular + Set/Group).

Cobertura especial: el asistente es el **unico mecanismo observado** en OPCloud que siembra geometria OPM sin intervencion directa del usuario sobre el lienzo. Varias HU aqui trazan patrones que se reusaran en EPICA-33 (plantillas) y EPICA-82 (ontologia de organizacion).

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-34.001 | Activar Nuevo Modelo desde menu principal hamburguesa | MN | M0 | S | opcloud-ui | — |
| HU-34.002 | Activar Nuevo Modelo con boton `+` de la barra de pestañas | ME | M1 | XS | opcloud-ui | — |
| HU-34.003 | Coexistir multiples pestañas `Model (Not Saved)` simultaneas | ME | M1 | S | opcloud-ui | — |
| HU-34.004 | Ver pestaña inicial con literal `Model (Not Saved)` | MN | M0 | XS | opcloud-ui | — |
| HU-34.005 | Ver OPD-tree inicial con nodo unico `SD` | MN | M0 | S | opm-semantica | [V-1] [Glos 3.22] |
| HU-34.006 | Ver lienzo OPD vacio tras Nuevo Modelo | MN | M0 | XS | opcloud-ui | — |
| HU-34.007 | Ver panel OPL-ES vacio tras Nuevo Modelo | MN | M0 | XS | opm-semantica | [§Representacion bimodal] [OPL-ES D1..D4] |
| HU-34.008 | Ver biblioteca `Draggable OPM Things` vacia tras Nuevo Modelo | MN | M0 | XS | opcloud-ui | — |
| HU-34.009 | Panear lienzo vacio con cursor grab | MN | S | XS | opcloud-ui | — |
| HU-34.010 | Activar Nuevo Modelo por Asistente desde menu principal | MN | S | S | opcloud-ui | — |
| HU-34.011 | Ver modal del asistente con barra de progreso `Stage N of 12` | MN | S | S | opcloud-ui | — |
| HU-34.012 | Ver etapa Welcome del asistente con solo Next/Cancel | MN | S | XS | opcloud-ui | — |
| HU-34.013 | Ingresar funcionalidad principal (etapa System Main Functionality) | MN | S | S | opm-semantica | [Glos 3.58] [metodologia-opm-es] |
| HU-34.014 | Ingresar beneficiario (etapa Beneficiary Group) | MN | S | S | opm-semantica | [Glos 3.39] [metodologia-opm-es] |
| HU-34.015 | Ingresar atributo relevante + estados entrada/salida (etapa Beneficiary Relevant Attribute) | MN | S | S | opm-semantica | [V-1] [Glos 3.61] |
| HU-34.016 | Declarar si beneficiario coincide con handler + enablers adicionales (etapa System Handler) | MN | S | S | opm-semantica | [Glos 3.3] [Glos 3.17] |
| HU-34.017 | Ingresar nombre del sistema (etapa System Name) | MN | S | XS | opm-semantica | [Glos 3.76] |
| HU-34.018 | Ingresar tools con marcado fisico (etapa System Tool Set) | MN | S | S | opm-semantica | [V-1] [V-124] |
| HU-34.019 | Ingresar entradas del sistema (etapa Main Input) | MN | S | S | opm-semantica | [V-239] [V-240] |
| HU-34.020 | Ingresar salida con verbo `creates/affects/changes` (etapa Main Output) | MN | S | S | opm-semantica | [V-239] [V-240] [V-61] |
| HU-34.021 | Marcar objetos ambientales entre los ya ingresados (etapa Environmental Objects) | MN | S | S | opm-semantica | [V-1 §1.2] [Glos 3.5] |
| HU-34.022 | Navegar hacia atras con Previous preservando datos | MN | S | S | opcloud-ui | — |
| HU-34.023 | Cancelar asistente desde cualquier etapa | MN | S | XS | opcloud-ui | — |
| HU-34.024 | Confirmar asistente con `Take me to the model` y sembrar SD | MN | S | L | mixto | [V-1] [V-61] [V-239] |
| HU-34.025 | Ver SD pre-poblado con layout radial "sol" tras cerrar asistente | MN | S | L | opcloud-ui | — |
| HU-34.026 | Ver panel OPL-ES pre-poblado con lineas numeradas tras cerrar asistente | MN | S | M | opm-semantica | [§Representacion bimodal] [OPL-ES D1..D4] [OPL-ES T1..T3] |
| HU-34.027 | Ver biblioteca Draggable Things con entradas alfabeticas tras asistente | MN | S | S | opcloud-ui | — |
| HU-34.028 | Continuar modelando post-asistente con estado No guardado | MN | S | XS | opcloud-ui | — |

Total: **28 historias de usuario** (16 opcloud-ui, 11 opm-semantica, 1 mixto).

## Historias de usuario

### HU-34.001 — Activar Nuevo Modelo desde menu principal hamburguesa

**Actor primario:** MN (modelador novato).
**Actores secundarios:** ME, AD.
**Tipo:** opcloud-ui.
**Nivel categorico:** P primario (crea contenedor de modelo); U secundario (abre pestaña).
**Superficie UI:** menu-principal-hamburguesa + barra-pestañas + shell-lienzo.
**Gesto canonico:** click sobre entrada `New Model` del panel lateral izquierdo.

**Historia:**
> Como modelador, quiero activar `New Model` desde el menu principal para abrir una pestaña vacia y empezar a modelar desde cero.

**Contexto de negocio:**
La ruta simple es la puerta de entrada mas frecuente al modelador: un click que instancia una pestaña `Model (Not Saved)` sin obligaciones metodologicas ni siembra. Es el default cuando el usuario ya sabe que va a modelar y quiere empezar a trazar inmediatamente.

**Criterios de aceptacion:**
- **Dado** que el menu principal esta abierto, **cuando** hago click sobre `New Model`, **entonces** se crea una pestaña nueva con literal `Model (Not Saved)` que queda activa.
- **Dado** que se creo la pestaña, **cuando** miro el lienzo central, **entonces** esta vacio (sin grid, sin placeholder, sin marcas de origen).
- **Dado** que se creo la pestaña, **cuando** miro el OPD-tree, **entonces** muestra un unico nodo `SD`.
- **Dado** que se creo la pestaña, **cuando** miro el panel OPL-ES, **entonces** esta vacio (solo el titulo `OPL-ES`).
- **Dado** que se creo la pestaña, **cuando** miro `Draggable OPM Things`, **entonces** esta vacio (titulo + campo Search sin entradas).
- **Dado** que la operacion es determinista, **cuando** la repito, **entonces** produce el mismo resultado sin parametros adicionales.

**Reglas y restricciones:**
- Sin parametros. `New Model` no pide nombre, ubicacion, ni tipo — es una accion de un solo paso.
- El nombre del modelo NO se elige en este paso — queda diferido al primer guardado (ver EPICA-30).
- La ruta simple y el boton `+` de la barra de pestañas producen **el mismo estado determinista** (ver HU-34.002).

**Modelo de datos tocado:**
- `modelo.id` — UUID — transitorio hasta guardado.
- `modelo.nombre` — `null` (representado en UI como `Model (Not Saved)`) — transitorio.
- `modelo.opds` — lista con un OPD inicial `SD` — transitorio.
- `modelo.guardadoEn` — `null` — transitorio.

**Dependencias:**
- Bloquea a: HU-34.004 (indicador de pestaña), HU-34.005 (OPD-tree con SD), HU-34.006 (lienzo vacio).
- Relaciona: EPICA-30 (guardar), EPICA-20 (OPD-tree).

**Integraciones:**
- Sistema de pestañas.
- OPD-tree.
- Shell de lienzo.
- Panel OPL-ES (estado inicial vacio).
- Biblioteca Draggable Things (estado inicial vacio).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [V-1] modelo como contenedor de OPDs.
- Fuente OPCloud: `opcloud-reverse/34-persistencia-new-model.md` §2.1, §3.1, §5.1.
- Frames: frame_00001 video 38.
- Transcripcion: confirmada en `videos-transcripciones-integrado.md::Intro 37 Create New Model`.
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** M0 (sin esta HU, el modelador no existe como producto).
**Tamano:** S.
**Etiquetas:** [persistencia, ui, menu-principal, creacion, nuevo-modelo, pestaña].

---

### HU-34.002 — Activar Nuevo Modelo con boton `+` de la barra de pestañas

**Actor primario:** ME (modelador experto).
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; P secundario.
**Superficie UI:** barra-pestañas + boton `+`.
**Gesto canonico:** click sobre boton `+` a la derecha de la ultima pestaña.

**Historia:**
> Como modelador experto, quiero crear un modelo nuevo con el boton `+` junto a las pestañas para no viajar al menu principal cuando ya tengo un modelo abierto.

**Contexto de negocio:**
El boton `+` es una afordance de proximidad: evita el viaje cognitivo al menu principal cuando el usuario esta en flujo. Observado explicitamente en frames 00008–00012 del video 38 produciendo el mismo efecto que `New Model`.

**Criterios de aceptacion:**
- **Dado** que hay al menos una pestaña abierta, **cuando** hago click sobre el boton `+` a la derecha de la ultima pestaña, **entonces** se crea una nueva pestaña `Model (Not Saved)` equivalente funcional a `New Model`.
- **Dado** que cree la pestaña con `+`, **cuando** inspecciono su estado, **entonces** es identico al de HU-34.001 (lienzo vacio, OPD-tree con SD, panel OPL-ES vacio, biblioteca vacia).
- **Dado** que `+` es persistente, **cuando** miro la UI, **entonces** esta siempre visible bajo la main toolbar azul a la derecha de las pestañas.

**Reglas y restricciones:**
- Equivalencia funcional **exacta** con `New Model` del menu principal — no hay diferencia de estado resultante.
- El boton `+` no abre submenu: no ofrece asistente — es acceso directo a la ruta simple.

**Modelo de datos tocado:**
- Identico a HU-34.001.

**Dependencias:**
- Bloqueada por: HU-34.001 (reutiliza la misma operacion de creacion).
- Bloquea a: HU-34.003 (multi-pestaña).

**Integraciones:**
- Sistema de pestañas.

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — afordance de proximidad heredada de OPCloud.
- Fuente: §2.1 fila "Botón `+`", §3.2.
- Frames: frame_00008, frame_00009, frame_00011, frame_00012 video 38.
- Clase de afirmacion: observado (equivalencia ssot-gap 38.N.4).

**Prioridad:** M1.
**Tamano:** XS.
**Etiquetas:** [persistencia, ui, pestañas, atajo, nuevo-modelo, boton-mas].

---

### HU-34.003 — Coexistir multiples pestañas `Model (Not Saved)` simultaneas

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** P primario; U secundario.
**Superficie UI:** barra-pestañas.
**Gesto canonico:** ninguno (consecuencia de HU-34.001/002 repetidas).

**Historia:**
> Como modelador experto, quiero tener varias pestañas `Model (Not Saved)` abiertas a la vez para trabajar en borradores paralelos antes de decidir cual guardar.

**Contexto de negocio:**
OPCloud no impone unicidad por nombre para modelos no guardados: dos (o mas) pestañas pueden compartir literal `Model (Not Saved)` sin advertencia. Cada una mantiene lienzo, OPD-tree, panel OPL-ES y biblioteca aislados. Esta libertad es deliberada para exploracion no comprometida.

**Criterios de aceptacion:**
- **Dado** que tengo una pestaña `Model (Not Saved)` abierta, **cuando** creo otra con `New Model` o `+`, **entonces** ambas coexisten con el mismo literal sin mensaje de advertencia.
- **Dado** que hay dos pestañas homonimas, **cuando** activo cada una, **entonces** cada pestaña muestra su propio lienzo, OPD-tree, panel OPL-ES y biblioteca, aislados entre si.
- **Dado** que agrego una cosa en una pestaña, **cuando** cambio a la otra, **entonces** la otra pestaña NO refleja el cambio (aislamiento total).
- **Dado** que la UI no desambigua las pestañas por nombre, **cuando** las comparo, **entonces** la unica diferenciacion visible es posicion en la barra de pestañas.

**Reglas y restricciones:**
- No hay limite maximo observado de pestañas `Model (Not Saved)` simultaneas.
- No hay confirmacion ni aviso al crear una segunda pestaña homonima.
- Cada pestaña es una instancia completamente aislada del modelo en memoria.
- Al cerrar una pestaña con `x`, el contenido de esa pestaña se pierde si no fue guardado (comportamiento diferido a EPICA-30 para el detalle).

**Modelo de datos tocado:**
- `espacio-trabajo.pestañas` — lista ordenada de modelos abiertos — transitorio.
- Cada pestaña tiene su propio `modelo` aislado.

**Dependencias:**
- Bloqueada por: HU-34.001 o HU-34.002.
- Relaciona: EPICA-30 (cierre con contenido no guardado).

**Integraciones:**
- Sistema de pestañas (aislamiento por pestaña).

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — comportamiento de pestañas heredado de OPCloud.
- Fuente: §3.2.
- Frames: frame_00008, 00009, 00011, 00012 video 38.
- Clase de afirmacion: observado.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [persistencia, ui, pestañas, multi-pestaña, aislamiento].

---

### HU-34.004 — Ver pestaña inicial con literal `Model (Not Saved)`

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; P (indicador estado).
**Superficie UI:** barra-pestañas.
**Gesto canonico:** ninguno (render automatico).

**Historia:**
> Como modelador, quiero ver el literal `Model (Not Saved)` en la pestaña del modelo recien creado para saber que mis cambios aun no tienen identidad persistente.

**Contexto de negocio:**
El estado de persistencia debe ser **siempre visible**. `Model (Not Saved)` es el signo inequivoco de que el modelo vive solo en memoria volatil. Remocion de ambiguedad es critica porque cerrar la pestaña pierde el trabajo.

**Criterios de aceptacion:**
- **Dado** que se creo un modelo con `New Model`, **cuando** miro la pestaña, **entonces** muestra exactamente `Model (Not Saved)` como literal.
- **Dado** que la pestaña muestra `Model (Not Saved)`, **cuando** miro al lado del literal, **entonces** hay un boton `x` para cerrar la pestaña.
- **Dado** que el modelo pasa a estado guardado (fuera de esta epica), **cuando** ocurra el guardado, **entonces** el literal cambia al nombre del modelo sin sufijo (ver EPICA-30).

**Reglas y restricciones:**
- El literal exacto es `Model (Not Saved)` — con parentesis y espaciado canonico.
- La cabecera de la pestaña y el titulo del OPD-tree comparten el mismo literal mientras no haya nombre — **inferido** que son la misma pieza de datos.

**Modelo de datos tocado:**
- `modelo.nombre` — `null` — transitorio; render deriva en `Model (Not Saved)`.

**Dependencias:**
- Bloqueada por: HU-34.001 o HU-34.002.
- Relaciona: HU-10.022 (ya declarado en EPICA-10), EPICA-30.

**Integraciones:**
- Barra de pestañas.
- OPD-tree (reusa mismo literal).

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — indicador de persistencia heredado de OPCloud.
- Fuente: §2.1 fila "Pestaña `Model (Not Saved)`", §3.1 paso 3.
- Frames: frame_00001, 00006 video 38.
- Clase de afirmacion: observado.

**Prioridad:** M0.
**Tamano:** XS.
**Etiquetas:** [persistencia, ui, pestaña, indicador, no-guardado].

---

### HU-34.005 — Ver OPD-tree inicial con nodo unico `SD`

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** L primario (lente sobre el modelo); P secundario.
**Superficie UI:** panel-izquierdo-opd-tree.
**Gesto canonico:** ninguno (render automatico).

**Historia:**
> Como modelador, quiero ver un arbol OPD con el nodo `SD` creado automaticamente para empezar a modelar sin tener que crear el primer diagrama a mano.

**Contexto de negocio:**
OPM exige un System Diagram (SD) raiz en cada modelo — es el punto de anclaje ontologico. Auto-crearlo al instanciar el modelo evita un paso administrativo y refuerza la convencion. La pastilla azul claro con texto azul marino es el render observado.

**Criterios de aceptacion:**
- **Dado** que cree un modelo nuevo, **cuando** miro el panel izquierdo, **entonces** el OPD-tree muestra un unico nodo `SD`.
- **Dado** que el nodo `SD` existe, **cuando** miro su render, **entonces** es una pastilla con fondo azul muy claro (~#E8EEF7) y texto azul marino centrado.
- **Dado** que es el unico nodo, **cuando** miro la jerarquia, **entonces** no hay hijos ni hermanos.
- **Dado** que el nodo es seleccionable, **cuando** hago click sobre el, **entonces** el lienzo central muestra el OPD correspondiente (vacio en ruta simple).

**Reglas y restricciones:**
- `SD` es el identificador canonico del System Diagram raiz — literal fijo.
- El render del SD difiere del render de OPDs hijos (que tienen fondo blanco) — la distincion visual es parte de la convencion OPCloud.
- El OPD-tree inicial es **determinista**: siempre nace con exactamente un SD.

**Modelo de datos tocado:**
- `modelo.opds[0].id` — UUID — transitorio.
- `modelo.opds[0].etiqueta` — `"SD"` — transitorio.
- `modelo.opds[0].padre` — `null` — transitorio.
- `modelo.opds[0].contenidos` — lista vacia — transitorio.

**Dependencias:**
- Bloqueada por: HU-34.001 o HU-34.002.
- Bloquea a: HU-34.024 (asistente inyecta contenido en este SD).
- Relaciona: EPICA-20 (OPD-tree completo).

**Integraciones:**
- OPD-tree (EPICA-20).
- Lienzo (muestra contenido del SD seleccionado).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [V-1] modelo con al menos un OPD raiz; [Glos 3.22] System Diagram como punto de anclaje; [§Representacion bimodal] OPD como una de las dos caras del modelo.
- Fuente OPCloud: §2.1 fila "OPD-tree con nodo único `SD`", §3.1 paso 3, §7.2.
- Frames: frame_00001 video 38.
- Clase de afirmacion: observado + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [persistencia, lente, opd-tree, sd, auto-creacion].

---

### HU-34.006 — Ver lienzo OPD vacio tras Nuevo Modelo

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario (render); U secundario.
**Superficie UI:** lienzo-opd.
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador, quiero ver el lienzo completamente vacio tras crear un modelo para tener un espacio limpio sobre el que empezar.

**Contexto de negocio:**
El lienzo vacio en OPCloud es literalmente vacio: sin grid, sin placeholder textual, sin marcas de origen. Esta ausencia de affordances "empty state" es deliberada y difiere de otras apps de modelado. Puede parecer frio al novato pero refleja la convencion OPM: el OPD es un espacio geometrico sin implicaciones a priori.

**Criterios de aceptacion:**
- **Dado** que cree un modelo nuevo y estoy en el SD, **cuando** miro el lienzo central, **entonces** es un area de color gris muy claro (~#F2F4F7).
- **Dado** que el lienzo esta vacio, **cuando** lo inspecciono visualmente, **entonces** NO hay grid, NO hay marcas de origen, NO hay placeholder textual.
- **Dado** que no hay contenido, **cuando** hago hover sobre el lienzo, **entonces** el cursor puede cambiar a forma de mano (grab) para pan — ver HU-34.009.

**Reglas y restricciones:**
- Color de fondo lienzo vacio: ~#F2F4F7 (observacion).
- Ausencia explicita de placeholder textual — no hay "Start modeling by dragging a Process".
- La decision de empty-state vacio es parte de la identidad OPCloud; divergencia justificada hacia affordance mas amable es **decision abierta** del modelador core.

**Dependencias:**
- Bloqueada por: HU-34.001 o HU-34.002.
- Relaciona: EPICA-10 (creacion de cosas desde barra o biblioteca).

**Integraciones:**
- Renderizador de lienzo.

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — convencion de render heredada de OPCloud.
- Fuente: §2.1 fila "Canvas OPD vacío", §3.1 paso 3.
- Frames: frame_00001 video 38.
- Clase de afirmacion: observado.

**Prioridad:** M0.
**Tamano:** XS.
**Etiquetas:** [persistencia, render, empty-state, lienzo-vacio].

---

### HU-34.007 — Ver panel OPL-ES vacio tras Nuevo Modelo

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** L primario; V secundario.
**Superficie UI:** panel-opl-es-inferior.
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador, quiero ver el panel OPL-ES vacio tras crear un modelo para confirmar que no hay sentencias derivadas de un modelo que aun no existe.

**Contexto de negocio:**
El panel OPL-ES es **lente**: refleja el estado del modelo. Un modelo sin cosas produce OPL-ES vacio, no error ni mensaje. Esa invariante refuerza la promesa de que OPL-ES es derivado puro del lienzo.

**Criterios de aceptacion:**
- **Dado** que cree un modelo nuevo, **cuando** miro el panel OPL-ES, **entonces** muestra el titulo `OPL-ES` con el area de contenido en blanco.
- **Dado** que el panel esta vacio, **cuando** agrego una cosa al lienzo, **entonces** el panel empieza a mostrar oraciones (integracion con EPICA-10/50).
- **Dado** que el panel no tiene contenido, **cuando** lo inspecciono, **entonces** NO hay mensaje placeholder.

**Reglas y restricciones:**
- El panel OPL-ES es siempre visible (no se oculta por ausencia de contenido).
- OPL-ES se regenera desde el modelo; vacio en modelo implica vacio en panel (invariante).

**Dependencias:**
- Bloqueada por: HU-34.001 o HU-34.002.
- Relaciona: EPICA-50 (panel OPL-ES general).

**Integraciones:**
- Motor OPL-ES (`src/render/opl-renderer.ts`).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Representacion bimodal] todo modelo se expresa en OPD y OPL-ES; `opm-opl-es.md` [OPL-ES D1..D4] propiedades genericas.
- Fuente OPCloud: §2.1 fila "Pane OPL vacío", §7.3.
- Frames: frame_00001 video 38.
- Clase de afirmacion: observado + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** XS.
**Etiquetas:** [persistencia, opl-es, empty-state, lente].

---

### HU-34.008 — Ver biblioteca `Draggable OPM Things` vacia tras Nuevo Modelo

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** L primario; U secundario.
**Superficie UI:** panel-biblioteca-lateral-inferior.
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador, quiero ver la biblioteca `Draggable OPM Things` vacia con su campo Search presente para saber donde apareceran las cosas que cree.

**Contexto de negocio:**
La biblioteca es **vista del modelo**, no paleta estatica: refleja las cosas ya creadas. Al inicio esta vacia pero visible con campo Search para anticipar la funcionalidad.

**Criterios de aceptacion:**
- **Dado** que cree un modelo nuevo, **cuando** miro el panel inferior izquierdo, **entonces** la seccion `Draggable OPM Things` muestra su titulo, un campo `Search` vacio y lista de instancias vacia.
- **Dado** que el panel esta vacio, **cuando** creo una cosa en el lienzo, **entonces** aparece automaticamente en la biblioteca.

**Reglas y restricciones:**
- El campo Search siempre visible (incluso con lista vacia).
- La biblioteca es lente: no mantiene estado propio, no se edita directamente.

**Dependencias:**
- Bloqueada por: HU-34.001 o HU-34.002.
- Relaciona: HU-10.017 (biblioteca actualiza al crear cosas).

**Integraciones:**
- Lente del modelo.

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — panel de biblioteca heredado de OPCloud.
- Fuente: §2.1 fila "`Draggable OPM Things` vacío", §7.4.
- Frames: frame_00001 video 38.
- Clase de afirmacion: observado.

**Prioridad:** M0.
**Tamano:** XS.
**Etiquetas:** [persistencia, ui, biblioteca-lateral, empty-state, lente].

---

### HU-34.009 — Panear lienzo vacio con cursor grab

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** lienzo-opd.
**Gesto canonico:** mousedown + drag sobre lienzo vacio.

**Historia:**
> Como modelador, quiero panear el lienzo vacio con la mano de arrastre para explorar el espacio del lienzo incluso antes de crear cosas.

**Contexto de negocio:**
El lienzo OPM es infinito. Permitir pan en lienzo vacio refuerza la sensacion de espacio disponible. El cursor cambia a `grab` al hover sobre el fondo vacio — señal visual de que se puede arrastrar.

**Criterios de aceptacion:**
- **Dado** que el lienzo esta vacio, **cuando** muevo el cursor sobre el, **entonces** oscila entre flecha estandar y mano de arrastre `grab` segun la posicion.
- **Dado** que el cursor es `grab`, **cuando** hago mousedown y drag, **entonces** el lienzo panea siguiendo el cursor.
- **Dado** que suelto el mouse, **cuando** termina el drag, **entonces** el lienzo queda en la nueva posicion.

**Reglas y restricciones:**
- Pan es funcional incluso sin contenido en el lienzo (observacion ssot-gap 38.refuerzo).
- El cursor debe cambiar visualmente para comunicar la afordance.

**Dependencias:**
- Bloqueada por: HU-34.006.
- Relaciona: EPICA-1A (grid/resize del lienzo).

**Integraciones:**
- Capa de interaccion de lienzo.

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — comportamiento de interaccion heredado de OPCloud.
- Fuente: §3.2 paso 5.
- Frames: frame_00009 video 38.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [persistencia, ui, cursor-feedback, pan, grab].

---

### HU-34.010 — Activar Nuevo Modelo por Asistente desde menu principal

**Actor primario:** MN.
**Actores secundarios:** AD (autor de dominio), PD (facilitador pedagogico).
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; P secundario.
**Superficie UI:** menu-principal-hamburguesa + modal-asistente.
**Gesto canonico:** click sobre entrada `New Model by Wizard`.

**Historia:**
> Como modelador novato, quiero activar `New Model by Wizard` para recibir guia paso a paso en la creacion del primer modelo.

**Contexto de negocio:**
El asistente es la ruta pedagogica: reduce la carga cognitiva del arranque interrogando al usuario sobre el sistema en lugar de exigirle que dibuje de inmediato. Es clave para adopcion de OPM por primera vez. Vive contiguo a `New Model` en el menu principal.

**Criterios de aceptacion:**
- **Dado** que el menu principal esta abierto, **cuando** hago click sobre `New Model by Wizard`, **entonces** se crea una pestaña nueva `Model (Not Saved)` (si no existia) y se abre el modal del asistente sobre el lienzo vacio.
- **Dado** que el modal abrio, **cuando** miro el lienzo de fondo, **entonces** esta oscurecido al 40–60 %.
- **Dado** que el modal abrio, **cuando** miro la UI, **entonces** el resto de la app queda inaccesible hasta cancelar o completar el asistente.

**Reglas y restricciones:**
- Si ya hay una pestaña `Model (Not Saved)` vacia activa, el asistente **reusa esa pestaña** — **inferido**, no observado con certeza (ver §7.6 fuente original).
- Modal ~700×500 px con esquinas redondeadas y sombra suave.

**Modelo de datos tocado:**
- `asistente.estado` — transitorio durante el flujo.

**Dependencias:**
- Relaciona: HU-34.001 (pestaña base).
- Bloquea a: HU-34.011 a HU-34.024 (todas las etapas).

**Integraciones:**
- Menu principal.
- Sistema de pestañas.
- Capa de modal.

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — el asistente es recurso pedagogico de OPCloud, no prescrito por SSOT.
- Fuente: §2.2 fila "Entrada `New Model by Wizard`", §3.3 intro.
- Frames: frame_00005, frame_00010 video 40.
- Transcripcion: `videos-transcripciones-integrado.md::Intro 39 New Model Wizard`.
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** S (diferencial pedagogico, no M0 del modelador core).
**Tamano:** S.
**Etiquetas:** [persistencia, ui, asistente, menu-principal, pedagogico].

---

### HU-34.011 — Ver modal del asistente con barra de progreso `Stage N of 12`

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** modal-asistente (chrome comun).
**Gesto canonico:** ninguno (render en cada etapa).

**Historia:**
> Como modelador, quiero ver la barra de progreso y el indicador `Stage N of 12` para saber cuanto me falta del asistente.

**Contexto de negocio:**
El asistente tiene 12 etapas. Visualizar el progreso reduce la ansiedad del usuario y permite anticipar el esfuerzo restante. Es un patron estandar de asistentes multietapa.

**Criterios de aceptacion:**
- **Dado** que estoy en cualquier etapa del asistente, **cuando** miro el modal, **entonces** veo un rectangulo horizontal con relleno azul marino que avanza etapa a etapa.
- **Dado** que estoy en la etapa N, **cuando** miro debajo de la barra, **entonces** veo el texto `Stage N of 12`.
- **Dado** que avanzo una etapa, **cuando** pulso `Next`, **entonces** la barra crece y el texto cambia a `Stage N+1 of 12`.
- **Dado** que retrocedo, **cuando** pulso `Previous`, **entonces** la barra decrece y el texto cambia a `Stage N-1 of 12`.

**Reglas y restricciones:**
- La barra es rectangular lineal, NO circular — convencion consistente con otros modales multietapa de OPCloud (ej. Import CSV).
- Color azul marino del relleno, consistente con identidad visual OPCloud.

**Dependencias:**
- Bloqueada por: HU-34.010.
- Bloquea a: todas las etapas (HU-34.012 a HU-34.021).

**Integraciones:**
- Shell del modal.

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — patron de interfaz heredado de OPCloud.
- Fuente: §2.2 fila "Barra de progreso".
- Frames: frame_00010, 00015, 00020, 00025, 00030, 00035, 00040, 00045, 00050 video 40.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [persistencia, ui, asistente, modal, barra-progreso].

---

### HU-34.012 — Ver etapa Welcome del asistente con solo Next/Cancel

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** modal-asistente (etapa 1).
**Gesto canonico:** click en `Next` o `Cancel`.

**Historia:**
> Como modelador novato, quiero ver una pantalla de bienvenida introductoria en la etapa 1 del asistente para entender que va a pasar antes de empezar a ingresar datos.

**Contexto de negocio:**
La etapa Welcome establece tono pedagogico ("If you are new to OPM, this wizard will help you..."). Sin input, sin `Previous` — es pura introduccion.

**Criterios de aceptacion:**
- **Dado** que se abrio el asistente, **cuando** miro la etapa 1, **entonces** el titulo es `Welcome!`.
- **Dado** que estoy en Welcome, **cuando** miro el cuerpo del modal, **entonces** hay texto introductorio de 3–4 oraciones.
- **Dado** que estoy en Welcome, **cuando** miro el pie del modal, **entonces** veo solo botones `Next` y `Cancel` (sin `Previous`, porque es la primera etapa).
- **Dado** que hago click en `Next`, **cuando** ocurre el avance, **entonces** paso a la etapa 2.

**Reglas y restricciones:**
- Texto observado: "Hello and welcome to the new model wizard! / If you are new to OPM, this wizard will help you to start modeling a new system. / Just follow the steps as we proceed. / Let's get started!".
- `Previous` NO esta disponible en etapa 1 (es la primera).

**Dependencias:**
- Bloqueada por: HU-34.010, HU-34.011.

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — pantalla introductoria heredada de OPCloud.
- Fuente: §3.3 paso 1.
- Frames: frame_00010 video 40.
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [persistencia, ui, asistente, welcome, etapa-1].

---

### HU-34.013 — Ingresar funcionalidad principal (etapa System Main Functionality)

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** U primario; K (seed del proceso principal).
**Superficie UI:** modal-asistente (etapa 2-3).
**Gesto canonico:** escritura en input principal + `Next`.

**Historia:**
> Como modelador novato, quiero declarar la funcionalidad principal del sistema con el nombre de un proceso en gerundio para fijar el proceso central del modelo antes de cualquier otra decision.

**Contexto de negocio:**
La funcionalidad principal es la **raiz procedimental** del modelo OPM — el `Main Process` alrededor del cual orbitan el resto de las cosas. El asistente enforce la convencion linguistica OPM: procesos terminan en `-ing`.

**Criterios de aceptacion:**
- **Dado** que avance a la etapa System Main Functionality, **cuando** miro el modal, **entonces** veo un campo unico con placeholder `What is the main function of the system?`.
- **Dado** que miro el cuerpo, **cuando** lo leo, **entonces** incluye la regla "It should end with a verb in the gerund form, i.e., end with 'ing'".
- **Dado** que miro la ilustracion lateral, **cuando** la observo, **entonces** veo una elipse azul claro sin sombra rotulada `Main System Doing (main Process)`.
- **Dado** que ingreso `driver rescuing` y pulso `Next`, **cuando** ocurre el avance, **entonces** el valor se persiste en la memoria del asistente para inyectarlo al final.
- **Dado** que ingreso un nombre sin gerundio (p.ej. `driver rescue`), **cuando** pulso `Next`, **entonces** el asistente **NO rechaza** la entrada — solo enuncia la regla como guia.

**Reglas y restricciones:**
- Gerundio `-ing` recomendado, no forzado.
- Capitalizacion se aplica automaticamente al inyectar — ver HU-34.024.

**Modelo de datos tocado:**
- `asistente.funcionalidadPrincipal` — string — transitorio.

**Dependencias:**
- Bloqueada por: HU-34.012.
- Bloquea a: HU-34.024 (inyeccion al SD).

**Integraciones:**
- Ilustracion didactica del modal.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [Glos 3.58] Proceso como transformacion de objetos; `metodologia-opm-es.md` convencion de procesos en gerundio.
- Fuente OPCloud: §3.3 paso 2, §4.4, §5.2 fila etapa 2.
- Frames: frame_00015 video 40 (Stage 3 of 12).
- Clase de afirmacion: observado + confirmado por transcripcion + confirmado por SSOT.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [persistencia, ui, asistente, gerundio, proceso-principal, reglas-linguisticas].

---

### HU-34.014 — Ingresar beneficiario (etapa Beneficiary Group)

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** U primario; K (seed del objeto beneficiario).
**Superficie UI:** modal-asistente (etapa Beneficiary Group).
**Gesto canonico:** escritura en input principal + `Next`.

**Historia:**
> Como modelador, quiero declarar el beneficiario del sistema con un nombre singular para fijar quien recibe el valor del proceso principal.

**Contexto de negocio:**
El beneficiario es la **entidad receptora** del resultado del proceso principal — un concepto clave en OPM pragmatico (¿para quien existe este sistema?). El asistente enforce singular + sufijos canonicos (`Set` para inanimados plurales, `Group` para humanos plurales).

**Criterios de aceptacion:**
- **Dado** que avance a Beneficiary Group, **cuando** miro el modal, **entonces** veo un campo `What is the beneficiary of the system?`.
- **Dado** que miro el cuerpo, **cuando** leo la regla, **entonces** incluye "An OPM object must be singular. To express plural, for inanimate objects use the suffix Set, and for humans use Group".
- **Dado** que miro la ilustracion, **cuando** la observo, **entonces** veo el patron canonico: rectangulo verde `Beneficiary Group` + triangulo (exhibicion-caracterizacion) + `Beneficiary Relevant Attribute {problematic, satisfactory}` + `Main System Doing`.
- **Dado** que ingreso `driver` y pulso `Next`, **cuando** ocurre el avance, **entonces** el valor se persiste.

**Reglas y restricciones:**
- Singular obligatorio por convencion; `Set`/`Group` para plurales.
- El asistente no rechaza violaciones — solo enuncia la regla (ver pregunta abierta Q9 fuente original).

**Modelo de datos tocado:**
- `asistente.beneficiario` — string — transitorio.

**Dependencias:**
- Bloqueada por: HU-34.013.
- Bloquea a: HU-34.015 (el atributo es del beneficiario).

**Integraciones:**
- Ilustracion didactica.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [Glos 3.39] Objeto; `metodologia-opm-es.md` convencion de singular/Set/Group.
- Fuente OPCloud: §3.3 paso 3, §4.4, §5.2 fila etapa 3.
- Frames: frame_00020 video 40.
- Clase de afirmacion: observado + confirmado por transcripcion + confirmado por SSOT.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [persistencia, ui, asistente, singular, beneficiario, reglas-linguisticas].

---

### HU-34.015 — Ingresar atributo relevante + estados entrada/salida (etapa Beneficiary Relevant Attribute)

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** U primario; K (seed del atributo + dos estados).
**Superficie UI:** modal-asistente (etapa Beneficiary Relevant Attribute).
**Gesto canonico:** escritura en 3 campos + `Next`.

**Historia:**
> Como modelador, quiero declarar el atributo relevante del beneficiario y sus estados entrada/salida para modelar que aspecto del beneficiario cambia el proceso principal.

**Contexto de negocio:**
OPM canonico modela el efecto del sistema como **cambio de estado** de un atributo del beneficiario: de un estado problematico (entrada, corto plazo) a uno satisfactorio (salida, largo plazo). Esta etapa captura esa tripla en un solo paso.

**Criterios de aceptacion:**
- **Dado** que avance a Beneficiary Relevant Attribute, **cuando** miro el modal, **entonces** veo 3 campos: `What is the beneficiary of the system?` (redundante con etapa previa, pre-cargado), `What is the input state?`, `And the output state?`.
- **Dado** que miro el cuerpo, **cuando** leo, **entonces** incluye la regla "The Main Process changes the Beneficiary Attribute from its input state (short-term) to its output state (long-term)".
- **Dado** que ingreso atributo `danger status`, entrada `endangered`, salida `safe`, **cuando** pulso `Next`, **entonces** los tres valores se persisten.
- **Dado** que la ilustracion muestra estados, **cuando** la observo, **entonces** veo estados horizontales dentro del rectangulo del atributo (orden canonico: entrada izquierda, salida derecha).

**Reglas y restricciones:**
- Tres campos obligatorios en esta etapa — el doc fuente no indica campos opcionales.
- Los dos estados se renderizan horizontalmente dentro del atributo al cerrar el asistente (ver HU-34.025).

**Modelo de datos tocado:**
- `asistente.atributoBeneficiario` — string — transitorio.
- `asistente.estadoEntrada` — string — transitorio.
- `asistente.estadoSalida` — string — transitorio.

**Dependencias:**
- Bloqueada por: HU-34.014.
- Bloquea a: HU-34.024.

**Integraciones:**
- Ilustracion didactica.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [V-1] estados como entidades con nombre; [Glos 3.61] estado como valor de atributo de objeto.
- Fuente OPCloud: §3.3 paso 4, §5.2 fila etapa 4.
- Frames: frame_00025 video 40.
- Clase de afirmacion: observado + confirmado por transcripcion + confirmado por SSOT.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [persistencia, ui, asistente, atributos, estados, beneficiario].

---

### HU-34.016 — Declarar si beneficiario coincide con handler + enablers adicionales (etapa System Handler)

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** U primario; K (seed de handlers).
**Superficie UI:** modal-asistente (etapa System Handler).
**Gesto canonico:** selector Yes/No + lista multi-linea.

**Historia:**
> Como modelador, quiero declarar si el beneficiario tambien cumple rol de handler y agregar enablers adicionales para modelar quien opera el sistema.

**Contexto de negocio:**
Los `handlers` son agentes que actuan sobre el proceso — humanos u operadores. OPCloud ofrece en esta etapa la opcion de marcar al beneficiario como handler (caso comun en sistemas auto-operados) y agregar hasta 3 handlers adicionales.

**Criterios de aceptacion:**
- **Dado** que avance a System Handler, **cuando** miro el modal, **entonces** veo un selector dropdown `Does the main beneficiary of the system also the system handler?` con opciones Yes/No.
- **Dado** que miro debajo, **cuando** observo, **entonces** veo un campo `If there are more enablers write them here` tipo multi-linea.
- **Dado** que ingreso `onstar advisor` en el campo enablers y pulso `Next`, **cuando** ocurre el avance, **entonces** el handler adicional queda persistido.
- **Dado** que intento agregar mas de 3 handlers con `Enter` como separador, **cuando** llegue al cuarto, **entonces** el asistente limita a 3 (`The wizard is limited to only 3 handlers, separated by Enter`).

**Reglas y restricciones:**
- Limite maximo de 3 handlers adicionales.
- Separador entre handlers: tecla `Enter`.
- El flag `beneficiario = handler?` decide si el beneficiario participa tambien como agente al sembrar el SD.

**Modelo de datos tocado:**
- `asistente.beneficiarioEsHandler` — boolean — transitorio.
- `asistente.handlers[]` — array de strings, max 3 — transitorio.

**Dependencias:**
- Bloqueada por: HU-34.015.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [Glos 3.3] Agente como habilitador que es persona o grupo; [Glos 3.17] Habilitador.
- Fuente OPCloud: §3.3 paso 5, §4.3, §5.2 fila etapa 5.
- Frames: frame_00030 video 40.
- Clase de afirmacion: observado + confirmado por transcripcion + confirmado por SSOT.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [persistencia, ui, asistente, handler, enablers, cardinalidad].

---

### HU-34.017 — Ingresar nombre del sistema (etapa System Name)

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** U primario; P (seed del nombre del modelo).
**Superficie UI:** modal-asistente (etapa System Name).
**Gesto canonico:** escritura en input + `Next`.

**Historia:**
> Como modelador, quiero ingresar el nombre del sistema para que se convierta en el literal de la pestaña al guardar y en el nombre del agregado de partes.

**Contexto de negocio:**
A diferencia de la ruta simple (donde el nombre se fija al primer guardado), el asistente solicita el nombre en una etapa propia. La guia narrada sugiere "take the main functionality and add system at the end" (`OnStar System`, `Driver Rescuing System`).

**Criterios de aceptacion:**
- **Dado** que avance a System Name, **cuando** miro el modal, **entonces** veo un campo `What is the system name?`.
- **Dado** que miro el cuerpo, **cuando** leo la guia, **entonces** sugiere "the best thing is to take the main functionality and add system at the end".
- **Dado** que ingreso `OnStar System` y pulso `Next`, **cuando** ocurre el avance, **entonces** el valor se persiste.

**Reglas y restricciones:**
- Texto libre — el asistente no valida unicidad (ver pregunta abierta Q34.6).
- El nombre del sistema se usa como literal del agregado de partes y como candidato para `modelo.nombre` al guardar.

**Modelo de datos tocado:**
- `asistente.nombreSistema` — string — transitorio.

**Dependencias:**
- Bloqueada por: HU-34.016.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [Glos 3.76] toda cosa OPM debe tener nombre.
- Fuente OPCloud: §3.3 paso 6, §5.2 fila etapa 6.
- Clase de afirmacion: confirmado por transcripcion + confirmado por SSOT.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [persistencia, ui, asistente, nombrado, nombre-sistema].

---

### HU-34.018 — Ingresar tools con marcado fisico (etapa System Tool Set)

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** U primario; K (seed de tools + esencia).
**Superficie UI:** modal-asistente (etapa System Tool Set).
**Gesto canonico:** escritura en campo lista + selector multi-valor.

**Historia:**
> Como modelador, quiero ingresar los tools del sistema y marcar cuales son fisicos para capturar los instrumentos que permiten ejecutar el proceso principal.

**Contexto de negocio:**
Los `tools` son instrumentos del sistema (hardware, software). La distincion fisico vs informacional es un eje ontologico OPM (`esencia`). El asistente pregunta ambos aspectos en una etapa compacta.

**Criterios de aceptacion:**
- **Dado** que avance a System Tool Set, **cuando** miro el modal, **entonces** veo un campo `What are the tools that required for the system?` mas un selector multi-valor `Some of the tools are physical, you can choose them here:`.
- **Dado** que ingreso `gps` y `cellular network` (separados por `Enter`) y marco `gps` como fisico, **cuando** pulso `Next`, **entonces** se persiste la lista con el flag `esFisico` por tool.
- **Dado** que intento agregar mas de 3 tools, **cuando** llegue al cuarto, **entonces** el asistente aplica el limite.

**Reglas y restricciones:**
- Limite maximo de 3 tools.
- Separador entre tools: `Enter`.
- Singular obligatorio + Set/Group para plurales (convencion general del asistente).
- Los tools marcados fisicos se renderizan con sombra al cerrar el asistente.

**Modelo de datos tocado:**
- `asistente.tools[]` — array de `{nombre: string, esFisico: boolean}`, max 3 — transitorio.

**Dependencias:**
- Bloqueada por: HU-34.017.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [V-1] esencia como atributo de cosa; [V-124] sombreado como canal semantico de esencia fisica.
- Fuente OPCloud: §3.3 paso 7, §4.3, §5.2 fila etapa 7.
- Frames: frame_00035 video 40.
- Clase de afirmacion: observado + confirmado por transcripcion + confirmado por SSOT.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [persistencia, ui, asistente, tools, esencia, fisico, cardinalidad].

---

### HU-34.019 — Ingresar entradas del sistema (etapa Main Input)

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** U primario; K (seed de entradas).
**Superficie UI:** modal-asistente (etapa Main Input).
**Gesto canonico:** escritura en campo lista multi-linea.

**Historia:**
> Como modelador, quiero ingresar las entradas del sistema para modelar que consume el proceso principal.

**Contexto de negocio:**
Las `entradas` son objetos que el sistema consume como parte del proceso principal. El asistente las captura como lista separada por `Enter` (hasta 3).

**Criterios de aceptacion:**
- **Dado** que avance a Main Input, **cuando** miro el modal, **entonces** veo un campo `What are the main inputs of the system?`.
- **Dado** que miro el cuerpo, **cuando** leo la nota, **entonces** incluye "If there is one input that effected by the main process, it should be defined later as an output".
- **Dado** que ingreso `crash` y pulso `Next`, **cuando** ocurre el avance, **entonces** el valor se persiste.
- **Dado** que agrego mas de 3 entradas, **cuando** llegue al cuarto, **entonces** el asistente aplica el limite.

**Reglas y restricciones:**
- Limite maximo de 3 entradas.
- Separador: `Enter`.

**Modelo de datos tocado:**
- `asistente.entradas[]` — array de strings, max 3 — transitorio.

**Dependencias:**
- Bloqueada por: HU-34.018.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [V-239] familia transformadora (consumo, resultado, efecto); [V-240] firma de enlaces procedimentales Objeto→Proceso o Proceso→Objeto.
- Fuente OPCloud: §3.3 paso 8, §4.3, §5.2 fila etapa 8.
- Frames: frame_00040 video 40.
- Clase de afirmacion: observado + confirmado por transcripcion + confirmado por SSOT.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [persistencia, ui, asistente, entradas, cardinalidad].

---

### HU-34.020 — Ingresar salida con verbo `creates/affects/changes` (etapa Main Output)

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** U primario; K (seed de la salida + enlace).
**Superficie UI:** modal-asistente (etapa Main Output).
**Gesto canonico:** selector Yes/No + input + selector verbo.

**Historia:**
> Como modelador, quiero declarar la salida principal del sistema junto con su verbo semantico para capturar que produce el sistema y de que tipo es el enlace procedimental.

**Contexto de negocio:**
La salida es **una sola** (cardinalidad fija 1). La tripla `creates/affects/changes` determina la semantica del enlace procedimental al sembrar el SD: `creates` → resultado, `affects` → efecto, `changes` → cambio de estado.

**Criterios de aceptacion:**
- **Dado** que avance a Main Output, **cuando** miro el modal, **entonces** veo 3 controles: selector `Is the main output is also an input?` (Yes/No), campo `What is the main output of the system?`, selector `The system [Select] the output.` con opciones `creates`/`affects`/`changes`.
- **Dado** que elijo `No`, **cuando** persisto, **entonces** `asistente.salida.esTambienEntrada = false`.
- **Dado** que ingreso `help dispatched` y selecciono `creates`, **cuando** pulso `Next`, **entonces** la salida se persiste con su verbo.

**Reglas y restricciones:**
- Cardinalidad de la salida: exactamente 1.
- El verbo seleccionado determina el tipo de enlace procedimental al sembrar (decision inferida).

**Modelo de datos tocado:**
- `asistente.salida.nombre` — string — transitorio.
- `asistente.salida.esTambienEntrada` — boolean — transitorio.
- `asistente.salida.verbo` — `"creates" | "affects" | "changes"` — transitorio.

**Dependencias:**
- Bloqueada por: HU-34.019.

**Integraciones:**
- Motor de sembrado (el verbo se traduce en tipo de enlace al inyectar el SD).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [V-239] cinco familias canonicas de enlace; [V-240] firma Procedimental Proceso→Objeto; [V-61] anatomia formal de enlace.
- Fuente OPCloud: §3.3 paso 9, §5.2 fila etapa 9.
- Frames: frame_00045 video 40.
- Clase de afirmacion: observado + confirmado por transcripcion + confirmado por SSOT.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [persistencia, ui, asistente, salida, creates-affects-changes].

---

### HU-34.021 — Marcar objetos ambientales entre los ya ingresados (etapa Environmental Objects)

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** U primario; K (seed de afiliacion).
**Superficie UI:** modal-asistente (etapa Environmental Objects).
**Gesto canonico:** selector multi-valor sobre objetos previos.

**Historia:**
> Como modelador, quiero marcar que objetos de los ya ingresados son ambientales (externos al sistema) para dibujar la frontera del sistema.

**Contexto de negocio:**
`afiliacion=ambiental` marca objetos que el sistema **no controla** pero con los que interactua. El asistente cierra esta decision en una etapa dedicada, permitiendo seleccionar del conjunto ya declarado. En el render se reflejan con borde discontinuo verde (dashes 8/4 px).

**Criterios de aceptacion:**
- **Dado** que avance a Environmental Objects, **cuando** miro el modal, **entonces** veo un selector multi-valor `You can choose the environmental objects from the objects that you created:`.
- **Dado** que el selector esta poblado, **cuando** lo inspecciono, **entonces** contiene los objetos ingresados en etapas anteriores (beneficiario, tools, entradas, salida).
- **Dado** que selecciono `crash` y pulso `Next`, **cuando** ocurre el avance, **entonces** `crash` queda marcado como ambiental.
- **Dado** que miro la ilustracion, **cuando** la observo, **entonces** veo un rectangulo con borde discontinuo verde rotulado `Environmental Object`.

**Reglas y restricciones:**
- Multi-seleccion: puedo marcar 0, 1 o varios.
- Solo puedo marcar objetos **ya ingresados** — no hay creacion de objetos nuevos aqui.
- El render post-asistente aplica borde discontinuo verde a los marcados.

**Modelo de datos tocado:**
- `asistente.objetosAmbientales[]` — array de IDs/nombres de objetos previos — transitorio.

**Dependencias:**
- Bloqueada por: HU-34.020.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [V-1 §1.2] contorno continuo = sistemico, discontinuo = ambiental; [Glos 3.5] Comportamiento/contexto.
- Fuente OPCloud: §3.3 paso 10, §5.2 fila etapa 10.
- Frames: frame_00050 video 40.
- Clase de afirmacion: observado + confirmado por transcripcion + confirmado por SSOT.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [persistencia, ui, asistente, ambiental, afiliacion, borde-discontinuo].

---

### HU-34.022 — Navegar hacia atras con Previous preservando datos

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** modal-asistente (boton `Previous`).
**Gesto canonico:** click en `Previous`.

**Historia:**
> Como modelador, quiero navegar hacia atras con el boton `Previous` preservando los datos ya ingresados para corregir etapas anteriores sin perder trabajo.

**Contexto de negocio:**
Los asistentes estandar preservan datos al retroceder — requisito basico de usabilidad. El doc fuente marca el comportamiento como inferido (no observado directamente) pero plausible por convencion.

**Criterios de aceptacion:**
- **Dado** que estoy en la etapa N (N ≥ 2), **cuando** miro el pie del modal, **entonces** veo el boton `Previous`.
- **Dado** que hago click en `Previous`, **cuando** ocurre el retroceso, **entonces** paso a la etapa N-1 con todos los campos preservando los valores ingresados previamente.
- **Dado** que hago `Previous` y luego `Next` sin editar, **cuando** vuelvo a la etapa N, **entonces** los valores originales siguen ahi.
- **Dado** que estoy en etapa 1, **cuando** miro el pie, **entonces** `Previous` NO esta disponible.

**Reglas y restricciones:**
- Preservacion de datos es **inferida**, no verificada observacionalmente — marcar como `requires-clarification`.
- `Previous` aparece desde etapa 2 en adelante.

**Dependencias:**
- Bloqueada por: HU-34.011.

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — patron de interfaz heredado de OPCloud.
- Fuente: §2.2 fila "Botón `Previous`", §4.2.
- Clase de afirmacion: inferido (no observado directamente pero convencional).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [persistencia, ui, asistente, navegacion, previous, requires-clarification].

---

### HU-34.023 — Cancelar asistente desde cualquier etapa

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; P (no sembrado).
**Superficie UI:** modal-asistente (boton `Cancel`).
**Gesto canonico:** click en `Cancel`.

**Historia:**
> Como modelador, quiero cancelar el asistente desde cualquier etapa para abortar sin dejar rastro en el lienzo.

**Contexto de negocio:**
El usuario debe poder abandonar el asistente en cualquier punto — es una afordance de escape estandar. `Cancel` cierra el modal sin sembrar nada; el modelo queda como `Model (Not Saved)` con SD vacio (equivalente a ruta simple).

**Criterios de aceptacion:**
- **Dado** que estoy en cualquier etapa del asistente, **cuando** miro el pie del modal, **entonces** veo el boton `Cancel`.
- **Dado** que hago click en `Cancel`, **cuando** ocurre el cierre, **entonces** el modal desaparece y el lienzo queda visible y vacio.
- **Dado** que cancele, **cuando** miro el estado del modelo, **entonces** es identico al resultado de `New Model` simple (lienzo vacio, SD solo, panel OPL-ES vacio, biblioteca vacia, pestaña `Model (Not Saved)`).
- **Dado** que ingrese datos antes de cancelar, **cuando** cancelo, **entonces** los datos se pierden sin confirmacion (inferido — no hay prompt "¿descartar?" observado).

**Reglas y restricciones:**
- **Inferido**: no hay confirmacion "¿descartar lo introducido?" — la UI simplemente cierra y descarta.
- Cancel es simetrico en todas las etapas (1 a 11).
- Comportamiento en etapa 12 Summary — **pregunta abierta**, ver §11.2 fuente original.

**Dependencias:**
- Bloqueada por: HU-34.011.

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — afordance de escape heredada de OPCloud.
- Fuente: §2.2 fila "Botón `Cancel`", §4.1.
- Clase de afirmacion: observado (presencia del boton) + inferido (ausencia de confirmacion).

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [persistencia, ui, asistente, cancelacion, escape].

---

### HU-34.024 — Confirmar asistente con `Take me to the model` y sembrar SD

**Actor primario:** MN.
**Actores secundarios:** AD.
**Tipo:** mixto.
**Nivel categorico:** K primario (siembra kernel); V, P secundarios.
**Superficie UI:** modal-asistente (etapa 12 Summary) + lienzo-opd.
**Gesto canonico:** click en `Take me to the model`.

**Historia:**
> Como modelador, quiero confirmar el asistente con el boton `Take me to the model` para inyectar todas las cosas ingresadas como un OPD completo en el SD y empezar a modelar sobre una base.

**Contexto de negocio:**
Este es el **unico momento** en que OPCloud siembra geometria OPM sin intervencion directa del usuario sobre el lienzo. La transformacion del estado del asistente (texto + flags) en entidades OPM (Things, enlaces, estados, layout) es no-trivial y determinista. El boton tiene un literal coloquial y memorable: `Take me to the model`.

**Criterios de aceptacion:**
- **Dado** que estoy en la etapa 12 Summary, **cuando** miro el pie del modal, **entonces** veo el boton `Take me to the model`.
- **Dado** que hago click en `Take me to the model`, **cuando** ocurre la inyeccion, **entonces**:
  - el modal se cierra,
  - el lienzo del SD muestra las cosas en layout "sol" radial (ver HU-34.025),
  - el panel OPL-ES se pre-pobla con lineas numeradas (ver HU-34.026),
  - la biblioteca `Draggable OPM Things` lista las cosas en orden alfabetico (ver HU-34.027),
  - la pestaña sigue mostrando `Model (Not Saved)` (ver HU-34.028).
- **Dado** que el asistente inyecto, **cuando** inspecciono el modelo, **entonces** contiene: `procesoPrincipal`, `beneficiario`, `atributoBeneficiario` con dos estados `estadoEntrada`/`estadoSalida`, `handlers` (con flag beneficiario-es-handler aplicado), `tools` (con flag fisico por tool), `entradas`, `salida` (con verbo `creates/affects/changes`), `objetosAmbientales` marcados.
- **Dado** que el asistente capitaliza automaticamente, **cuando** inyecta los nombres, **entonces** cada literal tiene la primera letra de cada palabra en mayuscula (`driver rescuing` → `Driver Rescuing`).

**Reglas y restricciones:**
- Capitalizacion automatica en la inyeccion — el asistente no preserva el casing original.
- Layout sembrado es determinista (ver HU-34.025).
- El asistente **NO inyecta** varias cosas que quedan al usuario post-asistente:
  - agregacion explicita entre `System` y tools/parts,
  - designacion fisica del `System` (queda informacional por default),
  - in-zoom automatico del proceso principal,
  - navegacion a SD1 ni creacion de OPDs hijos.

**Modelo de datos tocado:**
- `modelo.opds[0].contenidos` — coleccion completa de cosas y enlaces — persistente al primer guardado.
- `cosa.*` — creadas segun el patron canonico del asistente.
- `enlace.*` — creados segun las relaciones ontologicas (instrumento, agente, consumo, resultado, efecto, exhibicion-caracterizacion).
- `estado.*` — estados del atributo beneficiario.

**Dependencias:**
- Bloqueada por: HU-34.013 a HU-34.021 (todas las etapas deben haberse completado).
- Bloquea a: HU-34.025, HU-34.026, HU-34.027, HU-34.028.
- Relaciona: EPICA-10 (las cosas creadas son las mismas que las creadas a mano), EPICA-13 (estados), EPICA-15 (enlaces avanzados).

**Integraciones:**
- Kernel (`src/nucleo/`) — crea entidades.
- Renderizador — aplica layout "sol".
- Motor OPL-ES — emite lineas sinteticas.
- Biblioteca Draggable Things.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [V-1] valores por defecto de esencia/afiliacion; [V-61] anatomia formal de enlace; [V-239] cinco familias canonicas de enlace.
- Fuente OPCloud: §3.3 paso 12, §3.4, §4.4, §6.
- Frames: frame_00053, 00055, 00059 video 40.
- Transcripcion: "click on take me to the model and here we go".
- Clase de afirmacion: observado + confirmado por transcripcion. El asistente como mecanismo es opcloud-ui; el SD sembrado con entidades OPM es opm-semantica → `mixto`.

**Prioridad:** S (diferencial pedagogico).
**Tamano:** L (toca kernel, render, layout, OPL-ES y biblioteca simultaneamente; es la operacion mas compleja de la epica).
**Etiquetas:** [persistencia, kernel, render, layout, asistente, siembra, take-me-to-the-model, capitalizacion-automatica].

---

### HU-34.025 — Ver SD pre-poblado con layout radial "sol" tras cerrar asistente

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario (layout); K secundario.
**Superficie UI:** lienzo-opd.
**Gesto canonico:** ninguno (render post-inyeccion).

**Historia:**
> Como modelador, quiero ver el SD pre-poblado con una disposicion radial "sol" (proceso al centro + cosas orbitando) tras cerrar el asistente para tener un punto de partida visualmente coherente.

**Contexto de negocio:**
El layout "sol" es la **forma canonica** del SD generado por el asistente: proceso central + 5–8 cosas orbitando alrededor en posiciones deterministas segun su rol (tools arriba-derecha, salida abajo-derecha, entrada izquierda, beneficiario abajo-centro, etc.). Es una decision de diseño: el asistente impone una geometria uniforme para que todos los modelos semilla tengan la misma "silueta" reconocible.

**Criterios de aceptacion:**
- **Dado** que cerre el asistente, **cuando** miro el lienzo del SD, **entonces** veo:
  - **centro**: elipse con el nombre del proceso principal (ej. `Driver Rescuing`) con contorno grueso azul claro;
  - **arriba-centro**: rectangulo con el nombre del sistema (ej. `Onstar System`) conectado al centro por triangulo invertido (aggregation-participation) con bus colector ortogonal hacia los tools;
  - **arriba-derecha**: tools apilados verticalmente (ej. `Gps`, `Cellular Network`) conectados al centro como instrumentos;
  - **abajo-derecha**: salida como rectangulo con flecha saliendo del proceso (ej. `Help Dispatched`);
  - **abajo-centro**: beneficiario con triangulo invertido (exhibicion-caracterizacion) hacia su atributo que contiene estados horizontales;
  - **izquierda**: entradas con borde discontinuo verde si ambientales (ej. `Crash`) conectados como entradas consumidas;
  - **arriba-izquierda**: handlers adicionales conectados al centro como agentes.
- **Dado** que el layout es determinista, **cuando** repito el asistente con los mismos inputs, **entonces** obtengo la misma disposicion geometrica.
- **Dado** que hay tools marcados fisicos, **cuando** miro su render, **entonces** tienen sombra.

**Reglas y restricciones:**
- Layout "sol" es **determinista y reproducible** — no es eleccion manual (ssot-gap 40.N.3).
- El proceso central se renderiza **sin sombra** aunque represente algo fisico — incoherencia observada con la ruta manual (ssot-gap 01-N.2, 40.N.1).
- Triangulos de aggregation y exhibition tienen colores invertidos respecto a SSOT §1.7 (ssot-gap 40.N.2) — **pregunta abierta** si el modelador core reproduce el bug o cumple SSOT.

**Dependencias:**
- Bloqueada por: HU-34.024.
- Relaciona: EPICA-14 (styling), EPICA-1A (layout engine).

**Integraciones:**
- Motor de layout (`src/render/layout/`).
- Renderizador JointJS.

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — el layout "sol" es decision de render de OPCloud, no prescrito por SSOT.
- Fuente: §3.4, §5.3, §9.
- Frames: frame_00053, 00055, 00057, 00059 video 40.
- Clase de afirmacion: observado.
- Etiqueta: `requires-clarification` por ssot-gap 40.N.2 (triangulos).

**Prioridad:** S.
**Tamano:** L (motor de layout dedicado para el patron sol).
**Etiquetas:** [persistencia, render, layout, sol, asistente, siembra, determinista, requires-clarification].

---

### HU-34.026 — Ver panel OPL-ES pre-poblado con lineas numeradas tras cerrar asistente

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** L primario (OPL-ES como lente); V secundario.
**Superficie UI:** panel-opl-es-inferior.
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador, quiero ver el panel OPL-ES con ~15 lineas numeradas describiendo el modelo sembrado para leer una traduccion textual completa inmediatamente.

**Contexto de negocio:**
OPL-ES es el **lenguaje natural derivado** del OPD. Tras la siembra del asistente, el panel refleja el estado completo: designaciones de tipo y esencia, exhibicion-caracterizacion, estados, agentes, instrumentos, consumo, resultado, efecto. Es la via pedagogica de cerrar el bucle "veo diagrama + leo oracion".

**Criterios de aceptacion:**
- **Dado** que cerre el asistente, **cuando** miro el panel OPL-ES, **entonces** aparecen ~15 lineas numeradas con las oraciones canonicas.
- **Dado** que miro las primeras lineas, **cuando** leo, **entonces** veo oraciones como:
  - `Driver is a physical and systemic object.` (beneficiario fisico — regla implicita del asistente para humanos),
  - `Danger Status of Driver is an informatical and systemic object.` (atributo),
  - `Danger Status of Driver can be endangered or safe.` (estados del atributo),
  - `Onstar System is a physical and systemic object.`
- **Dado** que hay handlers, instrumentos, entradas, salida, **cuando** sigo leyendo, **entonces** hay oraciones para cada relacion OPM canonica.
- **Dado** que el OPL-ES es lente puro, **cuando** modifico el modelo post-asistente, **entonces** el OPL-ES se actualiza en vivo.

**Reglas y restricciones:**
- Lineas numeradas (contador ordinal).
- Las oraciones usan los literales capitalizados del asistente.
- OPL-ES no se cachea — se regenera del modelo.

**Dependencias:**
- Bloqueada por: HU-34.024.
- Relaciona: EPICA-50 (panel OPL-ES general), HU-10.016 (eco OPL-ES).

**Integraciones:**
- Motor OPL-ES (`src/render/opl-renderer.ts`).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Representacion bimodal] todo modelo se expresa en OPD y OPL-ES; `opm-opl-es.md` [OPL-ES D1..D4] propiedades genericas; [OPL-ES T1..T3] enlaces transformadores basicos.
- Fuente OPCloud: §3.4, §7.3.
- Frames: frame_00055, 00059 video 40.
- Clase de afirmacion: observado + confirmado por SSOT.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [persistencia, opl-es, asistente, siembra, lente].

---

### HU-34.027 — Ver biblioteca Draggable Things con entradas alfabeticas tras asistente

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** L.
**Superficie UI:** panel-biblioteca-lateral.
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador, quiero ver la biblioteca `Draggable OPM Things` con todas las cosas sembradas listadas alfabeticamente para confirmar el inventario completo del modelo inicial.

**Contexto de negocio:**
La biblioteca es vista del modelo (ver HU-10.017). Tras la siembra del asistente, lista las 8 cosas creadas en orden alfabetico con glifo de cuadrado a la izquierda de cada entrada.

**Criterios de aceptacion:**
- **Dado** que cerre el asistente, **cuando** miro el panel `Draggable OPM Things`, **entonces** veo las cosas creadas listadas en orden alfabetico.
- **Dado** que miro una entrada, **cuando** la observo, **entonces** tiene un pequeño glifo de cuadrado a la izquierda del texto.
- **Dado** que el asistente creo 8 cosas (`Cellular Network`, `Crash`, `Danger Status of Driver`, `Driver`, `Gps`, `Help Dispatched`, `Onstar Advisor`, `Onstar System`), **cuando** cuento entradas, **entonces** hay 8.

**Reglas y restricciones:**
- Orden alfabetico (observado).
- Glifo de cuadrado comun a todas las entradas — no distingue por tipo (pregunta abierta §11 doc 10 sobre el glifo exacto).

**Dependencias:**
- Bloqueada por: HU-34.024.
- Relaciona: HU-10.017.

**Integraciones:**
- Lente del modelo.

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — panel de biblioteca heredado de OPCloud.
- Fuente: §7.4.
- Frames: frame_00055, 00059 video 40 (panel izquierdo).
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [persistencia, ui, biblioteca-lateral, asistente, alfabetico].

---

### HU-34.028 — Continuar modelando post-asistente con estado No guardado

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** P primario; U secundario.
**Superficie UI:** barra-pestañas + lienzo.
**Gesto canonico:** ninguno (transicion de estado).

**Historia:**
> Como modelador, quiero continuar modelando tras cerrar el asistente sobre el modelo ya sembrado para enlazar partes faltantes, in-zoom el proceso principal o refinar segun necesidad.

**Contexto de negocio:**
El asistente NO deja el modelo "terminado" — solo **sembrado**. La pestaña sigue siendo `Model (Not Saved)` hasta el primer guardado. El usuario queda libre de seguir modelando a mano: agregar agregacion explicita entre system y tools, marcar el system como fisico, in-zoom el proceso principal, crear OPDs hijos, etc.

**Criterios de aceptacion:**
- **Dado** que cerre el asistente, **cuando** miro la pestaña, **entonces** sigue mostrando `Model (Not Saved)`.
- **Dado** que el modelo fue sembrado, **cuando** creo una cosa nueva con drag desde la barra, **entonces** se agrega al lienzo como cualquier otra cosa (flujo estandar EPICA-10).
- **Dado** que quiero guardar, **cuando** pulso Ctrl+S o el boton Save, **entonces** se abre el modal de guardado (EPICA-30) para asignar nombre.
- **Dado** que quiero hacer mas decoraciones, **cuando** selecciono el `Onstar System`, **entonces** puedo cambiarle esencia a fisico con el alternador (HU-10.013).

**Reglas y restricciones:**
- El asistente no auto-guarda el modelo — transicion a "guardado" requiere accion explicita del usuario.
- No hay "modo asistente" post-siembra — el modelo es un modelo normal editable.

**Dependencias:**
- Bloqueada por: HU-34.024.
- Relaciona: EPICA-10 (edicion manual), EPICA-30 (guardar), EPICA-12 (in-zoom).

**Integraciones:**
- Todas las epicas de edicion de modelo.

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — flujo post-siembra heredado de OPCloud.
- Fuente: §3.5.
- Transcripcion: "you can save it and then decide whether you want to add more things".
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [persistencia, asistente, continuacion, no-guardado, post-siembra].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q34.1**: ¿Que muestra la etapa 2 del asistente? Los frames saltan de Stage 1 (Welcome) a Stage 3 (System Main Functionality) — existe una etapa intermedia no observada. **Hipotesis**: confirmacion de tipo de sistema o pantalla de contexto. HU candidata no emitida hasta clarificar.
- **Q34.2**: ¿La etapa 12 Summary muestra el OPD preview o solo listado textual? Marca HU-34.024 como parcialmente abierta.
- **Q34.3**: ¿`Previous` preserva valores tipeados? HU-34.022 marcada como `requires-clarification`.
- **Q34.4**: ¿Existe atajo `Ctrl+N` para `New Model`? No observado, no emitida HU.
- **Q34.5**: ¿Que pasa si se abre el asistente sobre una pestaña `Model (Not Saved)` con contenido ya modelado manualmente? ¿Sobreescribe o agrega? No observado. Relevante para HU-34.010.
- **Q34.6**: ¿El asistente valida unicidad del nombre del sistema contra modelos existentes? No observado en HU-34.017.
- **Q34.7**: ¿Por que el asistente NO auto-enlaza `Onstar System` con `Gps`/`Cellular Network` como partes? Decision de diseño abierta (§6 "lo que no inyecta el asistente"). Posible HU futura de "asistente extendido".
- **Q34.8**: ¿Aplica semantica diferenciada de punta de flecha para `creates`/`affects`/`changes` en el render? La resolucion del frame 59 no permite confirmar. Relevante para HU-34.020 y HU-34.025.
- **Q34.9**: ¿Se puede relanzar el asistente sobre un modelo existente para añadir estructura? No observado; **hipotesis**: solo para modelo nuevo.
- **Q34.10**: ¿Que pasa si el usuario ingresa handlers/tools/entradas sin respetar singular + Set/Group? ¿Rechazo o aceptacion silenciosa? No observado — relevante para HU-34.014, 34.016, 34.018, 34.019.
- **Q34.11**: Marcador circular gris `...` arriba-centro del lienzo tras cerrar asistente (frame 59) — **pregunta compartida con `30-persistencia-save-load.md`** sobre si es el mismo afordance. No emitida HU dedicada aqui.
- **Q34.12**: Incoherencia de render entre ilustraciones didacticas (sin sombra) y output del asistente (con sombra en fisico) — ssot-gap 40.N.6. Decision del modelador core: reproducir ambiguedad o imponer consistencia.
- **Q34.13**: Triangulos de aggregation/exhibition con colores invertidos respecto a SSOT (ssot-gap 40.N.2) — el modelador core debera decidir si reproduce el bug OPCloud o aplica SSOT. Afecta HU-34.025.

## Referencias cruzadas

- **Doc fuente**: `opcloud-reverse/34-persistencia-new-model.md`.
- **Epicas que dependen de esta**:
  - **EPICA-30** (persistencia-guardar-cargar): el modelo creado queda `Not Saved` hasta guardado explicito.
  - **EPICA-20** (OPD-tree): el nodo `SD` auto-creado es la base para crecimiento jerarquico.
  - **EPICA-50** (panel OPL-ES): el eco OPL-ES arranca vacio o pre-poblado segun ruta.
  - **EPICA-10** (lienzo-creacion): la continuacion post-asistente usa los gestos de esta epica.
  - **EPICA-13** (estados): los estados entrada/salida del beneficiario se siembran aqui.
  - **EPICA-15** (enlaces avanzados): los enlaces sembrados usan las semanticas de esa epica.
  - **EPICA-14** (styling): los divergentes visuales (triangulos, sombras) interactuan aqui.
- **Epicas contiguas en el menu principal**:
  - **EPICA-33** (plantillas): `Load Example` y `New Model from Template` comparten chrome.
  - **EPICA-30** (guardar/cargar): `Save`, `Save as`, `Load Model` son vecinos inmediatos.
  - **EPICA-32** (sub-modelos): `Save as Sub-Model` es variante relacionada.
- **Invariantes del repo tocadas**:
  - `src/nucleo/tipos.ts` (Thing, Process, Object, State, Link) — crear el modelo sembrado.
  - `src/nucleo/aplicador.ts` — aplicar batch de operaciones atomicas desde el asistente.
  - `src/render/layout/` — nuevo pass para layout "sol" determinista.
  - `src/render/opl-renderer.ts` — emision de las ~15 lineas del OPL-ES pre-poblado.
  - `src/persistencia/` — manejo del estado `No guardado` persistente entre sesiones.
  - `src/ui/` — widgets del modal multietapa con barra de progreso.
- **SSOT OPM**:
  - Designaciones canonicas de esencia/afiliacion: `ssot/opm-iso-19450-es.md` §ontologia.
  - Reglas linguisticas (gerundio, singular, Set/Group): `ssot/opm-metodologia-es.md`.
  - Render de ambiental (borde discontinuo verde): `ssot/opm-visual-es.md` V-xx (afiliacion).
- **Documentos de diseño del repo**:
  - `docs/design/patron-dominios-funtor.md` — patron para instanciar seeders especificos por dominio.
  - `docs/ARQUITECTURA-CATEGORICA.md` — el asistente es una instancia del funtor `Seed` potencial (aspiracional).
