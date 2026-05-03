---
epica: "EPICA-32"
titulo: "Persistencia — sub-modelos (subsystem model views, archivos peer, composicion cross-modelo)"
doc_fuente: "opcloud-reverse/32-persistencia-sub-models.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "S"
hu_emitidas: 32
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
ultima_actualizacion: 2026-04-23
---

## Resumen

Esta epica cubre la primitiva **sub-modelo** (tambien llamada *Subsystem Model View*) de OPCloud: un mecanismo de particion que permite romper un modelo OPM grande en un **modelo padre** (parent) y uno o mas **sub-modelos** archivo-peer en el mismo folder, vinculados por **referencia** y no por embed. Es la via disenada para trabajo paralelo de varios modeladores sobre distintos subsistemas del mismo sistema, minimizando la superficie de conflicto cross-modelo.

La feature es **altamente restrictiva por diseno**: regla de seleccion minima (1 proceso + >=1 objeto con E-C + instrumento), un unico proceso en la frontera, cosas candidatas sin refinamiento previo, y conjunto de cosas compartidas **inmutable** tras la creacion (sin capacidad de anadir nuevas cosas compartidas a posteriori). Estas restricciones son deliberadas para "preservar la integrabilidad OPM y la metodologia" (transcripcion del narrador).

Las HU se organizan alrededor de seis ejes:

1. **Creacion del sub-modelo** desde seleccion + validacion de la regla minima (HU-32.001–HU-32.005).
2. **Navegacion y tabs** (apertura en tab nueva, glifo de composicion, Load Modelo con peers) (HU-32.006–HU-32.010).
3. **Render y composicion visual cross-modelo** (cosas compartidas atenuadas, badge en arbol, alias, numeracion relativa) (HU-32.011–HU-32.017).
4. **Sincronizacion lazy** (estados del badge, refresh periodico, unload all, fetch on-demand) (HU-32.018–HU-32.022).
5. **Politicas de edicion cross-modelo** (que se puede y no desde cada lado) (HU-32.023–HU-32.027).
6. **Disconnect, export, integraciones** (disconnect bilateral, Include Unloaded Sub-Modelos en PDF, permisos, folders) (HU-32.028–HU-32.032).

La epica tiene una **tension interna relevante** con la arquitectura categorica del repo: OPCloud implementa esto por archivos peer con referencia externa y estado de sincronia *out-of-band*, lo cual rompe la suposicion de modelo auto-contenido del kernel actual. Las HU estan priorizadas conservadoramente (predominantemente `S` y `C`) porque muchas requieren extensiones del kernel no triviales. Un subconjunto M1 cubre el caso minimo de vista "read-only" del sub-modelo dentro del parent una vez que los archivos existen.

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-32.001 | Habilitar boton "Connect Sub-Modelo" con seleccion valida | ME | S | S | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.002 | Bloquear "Connect Sub-Modelo" si hay cosas ya refinadas en la seleccion | ME | S | S | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.003 | Validar regla minima proceso + objeto + E-C + instrumento | ME | S | M | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.004 | Abrir dialogo Sub Modelo Creation con textbox y nombre sugerido | ME | S | S | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.005 | Crear archivo peer del sub-modelo al confirmar | ME | S | L | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.006 | Emitir nodo arbol `SDx.y: <Nombre> Subsystem Modelo View` en el parent | ME | S | M | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.007 | Abrir menu contextual extendido del nodo sub-modelo | ME | S | S | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.008 | Abrir sub-modelo en tab nueva desde menu contextual | ME | S | M | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.009 | Listar parent y sub-modelo como peers en Load Modelo | RV | S | S | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.010 | Marcar tab del parent con glifo flecha-izq de composicion | MN | C | XS | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.011 | Atenuar render de cosas compartidas dentro del sub-modelo | MN | S | M | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.012 | Atenuar render de cosas compartidas dentro del parent | MN | S | M | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.013 | Restaurar saturacion al refinarse una cosa compartida | ME | C | S | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.014 | Mostrar alias `{id}` local al sub-modelo en etiqueta | ME | C | M | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.015 | Calcular numeracion `SDx.y` relativa al modelo abierto | RV | S | M | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.016 | Renderizar subnodos `(read only)` del sub-modelo bajo nodo del parent | RV | S | M | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.017 | Restringir biblioteca Draggable del sub-modelo a compartidas + nativas | ME | C | S | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.018 | Renderizar badge verde para estado cargado+sincronizado | ME | S | S | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.019 | Mutar badge a amarillo al detectar desincronizacion | ME | S | M | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.020 | Chequear sincronia periodicamente (~30s) | ME | C | M | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.021 | Descargar todos los sub-modelos con boton Unload all | ME | C | S | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.022 | Fetch on-demand al expandir nodo sub-modelo | ME | S | M | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.023 | Permitir renombrar y alias de cosas compartidas desde el sub-modelo | ME | S | M | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.024 | Prohibir anadir estados a cosas compartidas desde el sub-modelo | ME | S | S | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.025 | Prohibir eliminar cosas compartidas desde cualquier lado | ME | S | S | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.026 | Bloquear outgoing fundamental enlaces nuevos desde cosas compartidas en el parent | ME | S | M | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.027 | Prohibir rename desde file manager, exigirlo desde menu del nodo | ME | S | S | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.028 | Disconnect desde menu contextual del nodo en el parent | ME | S | M | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.029 | Disconnect bilateral desde el sub-modelo y guardar ambos | ME | S | M | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.030 | Incluir sub-modelos unloaded en export PDF con fetch automatico | RV | C | M | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.031 | Permisionar sub-modelo de forma independiente del parent | AO | C | M | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |
| HU-32.032 | Mantener sub-modelo en el mismo folder que el parent | AO | S | S | mixto | [opm-iso-19450-es.md §Composicion inter-modelo] |

Total: **32 historias de usuario** (32 mixto).

## Historias de usuario

### HU-32.001 — Habilitar boton "Connect Sub-Modelo" con seleccion valida

**Actor primario:** ME (modelador experto).
**Actores secundarios:** MN (la primera vez aprende la regla).
**Tipo:** mixto.
**Nivel categorico:** U primario; K (pre-validacion) secundario.
**Superficie UI:** toolbar-contextual (aparece a la derecha de la toolbar del canvas al seleccionar).
**Gesto canonico:** seleccion rectangular + hover sobre boton `Connect Sub-Modelo`.

**Historia:**
> Como modelador experto, quiero que el boton `Connect Sub-Modelo` se habilite unicamente cuando mi seleccion cumple la regla minima para no iniciar un flujo invalido y aprender que frontera es aceptable.

**Contexto de negocio:**
La creacion de un sub-modelo es una operacion fuerte (crea archivo peer, altera el parent, es casi irreversible). La toolbar contextual debe gatear el acceso: si la seleccion no cumple la regla minima, el boton no se ofrece o queda deshabilitado. Esto evita que el modelador descubra la restriccion dentro del dialogo tras teclear un nombre.

**Criterios de aceptacion:**
- **Dado** que selecciono un proceso `P` + un objeto `O` con enlace E-C + un enlace instrumento sobre `P`, **cuando** se evalua la toolbar contextual, **entonces** aparece el boton `Connect Sub-Modelo` con tooltip negro `Connect Sub-Modelo`.
- **Dado** que solo seleccione un objeto sin proceso, **cuando** se evalua la toolbar, **entonces** el boton no aparece (o aparece deshabilitado).
- **Dado** que la seleccion contiene dos procesos, **cuando** se evalua la toolbar, **entonces** el boton no aparece (un solo proceso por sub-modelo).
- **Dado** que paso el cursor sobre el boton, **cuando** se dispara el tooltip, **entonces** veo el texto exacto `Connect Sub-Modelo`.

**Reglas y restricciones:**
- El boton es un affordance de intencion, no valida todo: el dialogo posterior puede rechazar por razones derivadas (p.ej. refinamiento previo — ver HU-32.002).
- El tooltip es obligatorio para descubribilidad.

**Modelo de datos tocado:**
- Estado de seleccion en la UI — transitorio.

**Dependencias:**
- Bloqueada por: HU-32.003 (validacion de regla minima).

**Integraciones:**
- Toolbar contextual (superficie compartida con HU-10.012/013).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: `opcloud-reverse/32-persistencia-sub-models.md` §2 tabla "Boton Connect Sub-Modelo", §3.1 pasos 2–3.
- Frames: frame_00025, frame_00115.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [ui, toolbar-contextual, seleccion, validacion, sub-modelo].

---

### HU-32.002 — Bloquear "Connect Sub-Modelo" si hay cosas ya refinadas en la seleccion

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** K (validacion kernel) primario; U (feedback).
**Superficie UI:** toolbar-contextual + eventual mensaje de error.
**Gesto canonico:** intento de activacion del boton `Connect Sub-Modelo`.

**Historia:**
> Como modelador experto, quiero que el sistema rechace la creacion de sub-modelo si alguna cosa seleccionada ya tiene in-zoom o unfold previos para no corromper la invariante OPM de que las cosas compartidas son hojas al momento de compartirse.

**Contexto de negocio:**
Si una cosa ya tiene descendencia en OPDs inferiores, compartirla con un sub-modelo crearia ambiguedad sobre la autoridad de esos OPDs (¿parent? ¿sub-modelo? ¿ambos?). La decision de OPCloud es prevenirlo en UI; el kernel debe replicarla como invariante dura.

**Criterios de aceptacion:**
- **Dado** que uno de los procesos seleccionados ya esta `in-zoomed` en un OPD descendiente, **cuando** intento `Connect Sub-Modelo`, **entonces** el flujo se rechaza con mensaje `You cannot select a thing that is already refined`.
- **Dado** que uno de los objetos seleccionados esta `unfolded` (tiene partes en OPD descendiente), **cuando** intento, **entonces** el flujo se rechaza con el mismo mensaje.
- **Dado** que retiro la cosa refinada de la seleccion y mantengo la regla minima, **cuando** vuelvo a intentar, **entonces** el flujo procede.

**Reglas y restricciones:**
- La verificacion incluye TODA la cadena descendente, no solo el OPD actual.
- El mensaje de error debe nombrar la cosa conflictiva para guiar al usuario.

**Modelo de datos tocado:**
- Lectura de `cosa.refinements` / `cosa.hasInzoom` / `cosa.hasUnfold` — consultado en validador.

**Dependencias:**
- Bloqueada por: HU-32.001.

**Integraciones:**
- Validador kernel (`src/nucleo/validacion/`).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §4.1 "Intento de Connect Sub-Modelo con seleccion invalida".
- Transcripcion: "*you cannot select a thing that is already refined*".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [validacion, kernel, seleccion, pre-condicion, sub-modelo].

---

### HU-32.003 — Validar regla minima proceso + objeto + E-C + instrumento

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** K primario; U secundario.
**Superficie UI:** (sin superficie propia — logica pre-habilitacion + dialogo si falla posterior).
**Gesto canonico:** chequeo declarativo sobre el conjunto seleccionado.

**Historia:**
> Como modelador experto, quiero que la regla minima "1 proceso + >=1 objeto con E-C + enlace instrumento" se valide explicitamente para no crear sub-modelos semanticamente degenerados.

**Contexto de negocio:**
Esta regla es la que garantiza que el sub-modelo encapsula una unidad funcional legitima (una funcion con su exhibitioned host + insumo). Sin regla, el sub-modelo podria representar cualquier seleccion arbitraria, perdiendo su valor como particion OPM coherente.

**Criterios de aceptacion:**
- **Dado** un conjunto `S` de cosas seleccionadas, **cuando** el validador corre, **entonces** devuelve `valid=true` si y solo si: `|procesos(S)| == 1` ∧ `∃ o ∈ objetos(S), p ∈ procesos(S): exhibitionCharacterization(o, p)` ∧ `∃ instrumentLink(_, p)`.
- **Dado** que hay 0 procesos o 2+ procesos, **cuando** valido, **entonces** `valid=false` con razon `process_count_invalid`.
- **Dado** que falta el enlace E-C, **cuando** valido, **entonces** `valid=false` con razon `missing_exhibition_characterization`.
- **Dado** que falta el enlace instrumento, **cuando** valido, **entonces** `valid=false` con razon `missing_instrument_link`.
- **Dado** que se incluyen objetos adicionales (p.ej. output) sin violar la regla, **cuando** valido, **entonces** `valid=true` — los objetos extra son permitidos.

**Reglas y restricciones:**
- Los enlaces E-C e instrumento deben existir en el OPD donde se hace la seleccion (SD del parent tipicamente).
- El proceso **unico** aplica a cosas **seleccionadas**, no al SD entero.

**Modelo de datos tocado:**
- Consulta de tipo, enlaces y conectividad dentro de la seleccion — transitorio.

**Dependencias:**
- Bloquea a: HU-32.001, HU-32.004.

**Integraciones:**
- Validador kernel; referenciado por HU-32.001 para gating de UI.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §1 "alcance", §3.1 paso 2, §5.1 tabla "Regla de seleccion minima".
- Frames: frame_00025.
- Transcripcion: "*the minimal selection to create a sub-model is one object and one process connected by exhibition-characterization link and an instrument link*".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [kernel, validacion, enlaces, sub-modelo, minimo].

---

### HU-32.004 — Abrir dialogo Sub Modelo Creation con textbox y nombre sugerido

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** U.
**Superficie UI:** modal `Sub Modelo Creation`.
**Gesto canonico:** clic en boton `Connect Sub-Modelo`.

**Historia:**
> Como modelador experto, quiero que al hacer clic en `Connect Sub-Modelo` se abra un dialogo con textbox para nombrar el sub-modelo para asignarle identidad antes de comprometer la creacion.

**Contexto de negocio:**
La asignacion de nombre es la transaccion cognitiva que transforma "seleccion accidental" en "decision de arquitectura". El dialogo previene clic accidental y recoge el unico input requerido.

**Criterios de aceptacion:**
- **Dado** que hago clic en `Connect Sub-Modelo` con seleccion valida, **cuando** se abre el modal, **entonces** veo titulo `Sub Modelo Creation`, texto explicativo "Please enter a name for the sub model. A new OPD with this name will be created as the sub model.", textbox de una linea, botones `Create Sub-Model` y `Cancel`.
- **Dado** que el modal esta abierto, **cuando** escribo texto, **entonces** el textbox refleja mi input en vivo.
- **Dado** que hago clic en `Cancel` o cierro el modal, **cuando** se cierra, **entonces** no se crea ningun sub-modelo ni archivo peer y la seleccion del canvas se mantiene.
- **Dado** que dejo el textbox vacio, **cuando** intento `Create Sub-Model`, **entonces** la accion se bloquea (nombre requerido).

**Reglas y restricciones:**
- El modal bloquea interacciones de fondo hasta decision.
- No hay campo `Description` aqui — solo nombre (el `Description` vive en el popup de cada cosa).

**Modelo de datos tocado:**
- Borrador de nombre del sub-modelo — transitorio.

**Dependencias:**
- Bloqueada por: HU-32.001, HU-32.003.
- Bloquea a: HU-32.005.

**Integraciones:**
- Sistema modal de la app (compartido con `Save As`, `Load Modelo`).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §2 tabla `Dialogo Sub Modelo Creation`, §3.1 paso 4.
- Frames: frame_00027.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [modal, ui, creacion, sub-modelo].

---

### HU-32.005 — Crear archivo peer del sub-modelo al confirmar

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** P primario; K (reestructura modelo).
**Superficie UI:** modal (cierre) + canvas (re-render) + arbol OPD.
**Gesto canonico:** clic en `Create Sub-Model`.

**Historia:**
> Como modelador experto, quiero que al confirmar el nombre se cree un archivo `.opm` peer en el mismo folder y se actualicen parent y sub-modelo para reflejar el vinculo.

**Contexto de negocio:**
Este es el **momento transaccional central** de la epica. La creacion no es un simple registro logico: altera el file system, anade referencia al parent, desata atenuaciones visuales, inicializa el SD del sub-modelo con cosas compartidas, y emite una linea OPL. Debe ser atomico: si falla, no debe quedar estado inconsistente.

**Criterios de aceptacion:**
- **Dado** que confirmo `Create Sub-Model` con nombre `N`, **cuando** se ejecuta, **entonces** se crea un archivo `.opm` peer con nombre canonico `<N> of <Parent> Subsystem` en el mismo folder que el parent.
- **Dado** que se creo el archivo, **cuando** inspecciono el parent, **entonces** tiene una nueva entrada `subModelos: [{ name: N, fileRef: <ruta>, sharedThings: [ids], parentOpdRef: SDx, connectedAt: <ts> }]`.
- **Dado** que se creo el archivo, **cuando** inspecciono el sub-modelo, **entonces** tiene un SD raiz con las cosas compartidas (referenciadas por id estable cross-archivo), el proceso puede estar o no in-zoomed.
- **Dado** que la creacion falla a mitad de camino (p.ej. permisos de folder), **cuando** se aborta, **entonces** no queda ni archivo parcial ni referencia huerfana en el parent (atomicidad).
- **Dado** que ya existe un archivo con ese nombre canonico, **cuando** intento crear, **entonces** se bloquea con mensaje de colision o se propone sufijo (comportamiento a definir — `requires-clarification`).

**Reglas y restricciones:**
- El nombre del archivo es **derivado**, no libre: `<SubName> of <ParentName> Subsystem`.
- El kernel debe soportar identidad estable de cosa cross-archivo para que el id de la cosa compartida coincida entre parent y sub-modelo.
- La creacion escribe en ambos archivos; `save` del parent y del sub-modelo quedan coherentes tras la transaccion.

**Modelo de datos tocado:**
- `parent.subModelos[]` — array — persistente.
- `subModelo.parentRef` — referencia inversa — persistente.
- `sharedThings[].id` — UUID estable cross-archivo — persistente.
- `cosa.affinityModelo` — `"native" | "shared"` — persistente por archivo.

**Dependencias:**
- Bloqueada por: HU-32.004.
- Bloquea a: HU-32.006, HU-32.008, HU-32.011, HU-32.012.

**Integraciones:**
- Persistencia de archivos (`src/persistencia/`).
- Kernel (extension para identidad cross-archivo — presion nueva, evaluar contra `docs/design/patron-dominios-funtor.md`).
- OPL (emite `The selected things, X, Y, Z, are refined in sub model <N> subsystem model view.`).
- Arbol OPD (emite nuevo nodo — HU-32.006).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §3.1 paso 5, §6 "modelo de datos implicito".
- Frames: frame_00035, frame_00115 (OPL line visible).
- Transcripcion: "*the name of the subsystem will always be the name of the subsystem that we're giving it of the name of the main model*".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** L.
**Etiquetas:** [persistencia, sub-modelo, archivo-peer, kernel, transaccion].

---

### HU-32.006 — Emitir nodo arbol `SDx.y: <Nombre> Subsystem Modelo View` en el parent

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** L (navigator) primario; V secundario.
**Superficie UI:** opd-navigator (arbol izquierdo).
**Gesto canonico:** ninguno (render declarativo tras HU-32.005).

**Historia:**
> Como modelador experto, quiero que el arbol del parent muestre el sub-modelo como un nuevo nodo con su propia numeracion `SDx.y` y etiqueta `Subsystem Modelo View` para reconocerlo visualmente como referencia cross-modelo.

**Contexto de negocio:**
El arbol OPD es el mapa de navegacion del modelo. El nodo del sub-modelo debe ser visualmente **distinto** de un OPD regular (vive en otro archivo) pero navegable desde el parent. El badge verde codifica el estado de carga (ver HU-32.018).

**Criterios de aceptacion:**
- **Dado** que se creo el sub-modelo `N` a partir del OPD `SD1` del parent, **cuando** se actualiza el arbol, **entonces** aparece un nodo hijo de `SD1` con etiqueta `SD1.1: <N> Subsystem Modelo View`.
- **Dado** que el nodo aparece, **cuando** lo inspecciono visualmente, **entonces** esta precedido por un badge circular verde con dos flechas curvas (icono de refresh/sync).
- **Dado** que el sufijo canonico es `Subsystem Modelo View`, **cuando** renderizo la etiqueta, **entonces** aparece exactamente con ese texto, no traducido.
- **Dado** que hay varios sub-modelos del mismo OPD, **cuando** se anade uno nuevo, **entonces** se numera `SD1.2`, `SD1.3`, etc.

**Reglas y restricciones:**
- La etiqueta es vista computada; el nombre interno del sub-modelo es `<N>`, no `SDx.y: <N> Subsystem Modelo View`.
- El badge por default es verde (cargado+sincronizado) — su color muta segun estado (HU-32.018/019).

**Modelo de datos tocado:**
- Vista derivada de `parent.subModelos[]` — transitoria, recomputada en cada render del arbol.

**Dependencias:**
- Bloqueada por: HU-32.005.
- Bloquea a: HU-32.007, HU-32.016, HU-32.018.

**Integraciones:**
- Arbol OPD (EPICA-20).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §2 tabla `Nodo del arbol con badge verde`, §3.1 paso 5.
- Frames: frame_00035, frame_00080, frame_00085, frame_00100, frame_00115.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [navigator, opd-tree, sub-modelo, badge].

---

### HU-32.007 — Abrir menu contextual extendido del nodo sub-modelo

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** U.
**Superficie UI:** popover horizontal sobre el nodo del arbol.
**Gesto canonico:** clic derecho sobre el nodo `SDx.y: <N> Subsystem Modelo View`.

**Historia:**
> Como modelador experto, quiero que el clic derecho sobre el nodo sub-modelo muestre las cuatro opciones regulares (`Rename | Expand All | Collapse All | Hide Names`) mas dos especificas (`Open Sub Modelo In New Tab | Disconnect Sub Modelo`) para acceder a las operaciones cross-modelo sin dejar el arbol.

**Contexto de negocio:**
Las operaciones cross-modelo (abrir en tab, disconnect) son especificas de sub-modelos y no aplican a OPDs regulares. Extender el menu contextual es la via menos invasiva; el usuario mantiene el mapa mental del arbol.

**Criterios de aceptacion:**
- **Dado** que hago clic derecho sobre un nodo `SDx.y: <N> Subsystem Modelo View`, **cuando** se abre el popover, **entonces** veo las 6 opciones en orden: `Rename`, `Expand All`, `Collapse All`, `Hide Names`, `Open Sub Modelo In New Tab`, `Disconnect Sub Modelo`.
- **Dado** que hago clic derecho sobre un nodo OPD regular (no sub-modelo), **cuando** se abre el popover, **entonces** veo solo las primeras 4 opciones.
- **Dado** que hago clic fuera del popover, **cuando** se cierra, **entonces** no se ejecuta ninguna accion.
- **Dado** que selecciono `Rename`, **cuando** confirmo, **entonces** el nombre canonico del sub-modelo se actualiza en ambos archivos (parent y sub-modelo) — ver HU-32.027 para regla de unicidad de rename.

<!-- no `requires-clarification` aqui, la regla del menu esta observada integra. -->

**Reglas y restricciones:**
- Las dos opciones especificas no aparecen si el nodo no es sub-modelo.
- `Expand All` / `Collapse All` operan sobre el subarbol del sub-modelo (incluyendo sus sub-sub-modelos si los hay).

**Modelo de datos tocado:**
- Ninguno directo (gatea acciones).

**Dependencias:**
- Bloqueada por: HU-32.006.
- Bloquea a: HU-32.008, HU-32.028.

**Integraciones:**
- Arbol OPD; sistema de menus contextuales.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §2 tabla `Menu contextual del nodo sub-modelo`, §3.2 paso 1.
- Frames: frame_00035.
- Transcripcion: confirma las 6 opciones.
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [ui, opd-tree, context-menu, sub-modelo].

---

### HU-32.008 — Abrir sub-modelo en tab nueva desde menu contextual

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** U primario; P (carga archivo).
**Superficie UI:** barra de tabs + canvas del sub-modelo.
**Gesto canonico:** clic en `Open Sub Modelo In New Tab` del menu contextual.

**Historia:**
> Como modelador experto, quiero abrir el sub-modelo en una tab nueva para editarlo en paralelo al parent sin perder el contexto del padre.

**Contexto de negocio:**
El trabajo paralelo parent + sub-modelo es el caso de uso central. Una tab nueva permite alternar con `Ctrl+Tab` (HU-32.008 no lo implementa — delegado a shortcuts del navegador), mantiene el estado de ambos modelos vivos, y evita la perdida de contexto del zoom/scroll del parent.

**Criterios de aceptacion:**
- **Dado** que hago clic en `Open Sub Modelo In New Tab`, **cuando** se ejecuta, **entonces** se abre una tab nueva con el sub-modelo cargado y la tab queda activa.
- **Dado** que la tab del sub-modelo esta activa, **cuando** inspecciono su etiqueta, **entonces** dice `<N> of <Parent> Subsystem m...` (truncada segun ancho disponible).
- **Dado** que la tab del sub-modelo no tiene sub-modelos propios, **cuando** inspecciono, **entonces** NO lleva el glifo flecha-izq del parent (ver HU-32.010).
- **Dado** que ya hay una tab con este sub-modelo abierta, **cuando** hago `Open Sub Modelo In New Tab` de nuevo, **entonces** se activa la tab existente en vez de duplicar.
- **Dado** que abro el sub-modelo, **cuando** miro su arbol izquierdo, **entonces** dice `SD` (el sub-modelo tiene su propio SD raiz, no hereda numeracion del parent).

**Reglas y restricciones:**
- El truncado del nombre de tab usa `…` (elipsis) al final.
- Carga del sub-modelo es sincronica si el archivo esta accesible; si no, muestra error.

**Modelo de datos tocado:**
- Estado de tabs — transitorio.

**Dependencias:**
- Bloqueada por: HU-32.007, HU-32.005.
- Bloquea a: HU-32.011, HU-32.022, HU-32.029.

**Integraciones:**
- Sistema de tabs; persistencia (carga de archivo); arbol OPD del sub-modelo.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §2 tabla `Tab del sub-modelo`, §3.2 pasos 1–4.
- Frames: frame_00050, frame_00080, frame_00120.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [tabs, navegacion, sub-modelo, persistencia].

---

### HU-32.009 — Listar parent y sub-modelo como peers en Load Modelo

**Actor primario:** RV (revisor / lector).
**Actores secundarios:** ME.
**Tipo:** mixto.
**Nivel categorico:** U primario; P secundario.
**Superficie UI:** dialogo `Load Modelo`.
**Gesto canonico:** Main Menu → Load.

**Historia:**
> Como revisor, quiero ver el parent y el sub-modelo como archivos peer en el dialogo Load Modelo para poder abrir cualquiera de los dos directamente, sin tener que pasar por el parent.

**Contexto de negocio:**
El sub-modelo es archivo OPM regular desde el punto de vista del file system — comparte folder y metadatos con el parent. Exponerlo como peer en el dialogo Load respeta esa naturaleza y permite abrirlo aislado (p.ej. para revision de un subsistema sin cargar el padre completo).

**Criterios de aceptacion:**
- **Dado** que abro Main Menu → Load, **cuando** se lista el folder, **entonces** veo el parent y cada sub-modelo como filas peer con las mismas columnas (`Name`, `Description`, `Date`, `Author`).
- **Dado** que el sub-modelo se llama `<N> of <Parent> Subsystem`, **cuando** lo veo en la lista, **entonces** aparece con ese nombre exacto.
- **Dado** que selecciono el sub-modelo, **cuando** confirmo Load, **entonces** se abre en tab nueva (equivalente a HU-32.008).
- **Dado** que abro el sub-modelo sin abrir el parent primero, **cuando** lo veo, **entonces** las cosas compartidas se renderizan igual atenuadas (el sub-modelo sabe cuales son sus cosas compartidas por metadatos internos).

**Reglas y restricciones:**
- El listado es plano; no hay jerarquia visual parent→sub-modelo en este dialogo (la jerarquia vive en el arbol interno del parent).
- Los metadatos del sub-modelo son independientes (fecha propia de save, autor propio si distinto).

**Modelo de datos tocado:**
- Lectura de metadatos de archivos — transitoria.

**Dependencias:**
- Relaciona: EPICA-30 (persistencia-save-load).

**Integraciones:**
- Dialogo Load del modelador (EPICA-30).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §2 tabla `Dialogo Load Modelo`, §3.2 paso 3.
- Frames: frame_00040.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [modal, load, sub-modelo, folder].

---

### HU-32.010 — Marcar tab del parent con glifo flecha-izq de composicion

**Actor primario:** MN (modelador novato).
**Actores secundarios:** ME.
**Tipo:** mixto.
**Nivel categorico:** V primario; U secundario.
**Superficie UI:** tab superior del parent.
**Gesto canonico:** ninguno (render declarativo).

**Historia:**
> Como modelador, quiero que la tab del parent muestre un glifo distintivo cuando el modelo tiene sub-modelos conectados para identificar de un vistazo que no es un modelo atomico.

**Contexto de negocio:**
Con multiples tabs abiertas, distinguir cual es parent vs sub-modelo reduce errores de edicion (p.ej. intentar crear un sub-modelo desde un sub-modelo). El glifo flecha-izq + marco ofrece la marca visual minima. No se anade a las tabs de sub-modelos.

**Criterios de aceptacion:**
- **Dado** que el modelo de una tab tiene >=1 sub-modelo conectado, **cuando** inspecciono la tab, **entonces** entre la `x` de cerrar y el nombre aparece un glifo flecha-izquierda dentro de un marco (similar a icono de login/entrada).
- **Dado** que el modelo de una tab no tiene sub-modelos, **cuando** inspecciono, **entonces** no lleva glifo.
- **Dado** que desconecto el ultimo sub-modelo de un parent, **cuando** se actualiza la tab, **entonces** el glifo desaparece.
- **Dado** que el modelo de la tab es en si un sub-modelo (aunque tenga sub-sub-modelos), **cuando** inspecciono, **entonces** igualmente lleva el glifo si tiene sub-modelos propios (regla recursiva — `requires-clarification` si diverge en OPCloud).

**Reglas y restricciones:**
- El glifo es estrictamente visual; no es interactivo.
- Color/forma exactos a validar contra SSOT visual (no documentado ahi todavia).

**Modelo de datos tocado:**
- Ninguno (derivado del conteo de `subModelos[]`).

**Dependencias:**
- Bloqueada por: HU-32.005.

**Integraciones:**
- Sistema de tabs.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §2 tabla `Tab del parent con glifo`, §3.1 paso 5, §9 "Convenciones no-normativas".
- Frames: frame_00050, frame_00060, frame_00080, frame_00115, frame_00125.
- Clase de afirmacion: observado.
- Etiqueta: `requires-clarification` (forma exacta del glifo).

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [ui, tabs, glifo, sub-modelo, visual, requires-clarification].

---

### HU-32.011 — Atenuar render de cosas compartidas dentro del sub-modelo

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categorico:** V.
**Superficie UI:** canvas del sub-modelo.
**Gesto canonico:** ninguno (render declarativo).

**Historia:**
> Como modelador, quiero que las cosas heredadas del parent se rendericen atenuadas (gris claro) dentro del sub-modelo para distinguirlas de las cosas nativas del sub-modelo y saber donde esta la frontera.

**Contexto de negocio:**
La distincion visual compartida vs nativa es la pista inmediata sobre que se puede editar libremente (nativa) y que tiene restricciones cross-modelo (compartida). Sin ella, el modelador pierde la nocion de frontera y puede intentar ediciones prohibidas.

**Criterios de aceptacion:**
- **Dado** que abro el sub-modelo en su tab, **cuando** miro el canvas, **entonces** las cosas compartidas (heredadas del parent) se renderizan con borde gris claro (≈30–40% opacidad vs canonico).
- **Dado** que el mismo canvas tiene cosas nativas (p.ej. `Total Cost`), **cuando** miro, **entonces** las nativas mantienen saturacion canonica (verde para objeto, azul para proceso).
- **Dado** que renderizo el sub-modelo sin conexion al parent (el archivo parent no esta accesible), **cuando** cargo, **entonces** igual renderizo cosas compartidas atenuadas usando los metadatos internos del sub-modelo.

**Reglas y restricciones:**
- La atenuacion afecta borde y relleno.
- El color exacto y la opacidad exacta son convenciones observadas, pendientes de ingreso a SSOT visual.

**Modelo de datos tocado:**
- Lectura de `cosa.affinityModelo === "shared"` — persistente.

**Dependencias:**
- Bloqueada por: HU-32.005.
- Relaciona: HU-32.013 (excepcion al refinarse).

**Integraciones:**
- Renderer JointJS (`src/render/jointjs/`).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §2 tabla `Cosas compartidas atenuadas (gris)`, §3.2 paso 4, §9.
- Frames: frame_00050, frame_00060, frame_00065, frame_00090, frame_00100, frame_00105.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [render, visual, sub-modelo, cosas-compartidas].

---

### HU-32.012 — Atenuar render de cosas compartidas dentro del parent

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categorico:** V.
**Superficie UI:** canvas del parent.
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador, quiero que las cosas compartidas con un sub-modelo aparezcan atenuadas tambien en el parent para saber de un vistazo que su edicion tiene restricciones y que hay otro modelo que las refina.

**Contexto de negocio:**
La atenuacion bidireccional refuerza la nocion de frontera: las cosas compartidas no son "propiedad" de ningun modelo — son la union. Marcarlas en ambos lados evita que el modelador del parent edite casualmente cosas que ahora tienen autoridad en el sub-modelo.

**Criterios de aceptacion:**
- **Dado** que el parent tiene un sub-modelo conectado con cosas compartidas `{S1, S2, S3}`, **cuando** miro el SD del parent, **entonces** esas tres cosas se renderizan atenuadas.
- **Dado** que el parent tiene una cosa `X` que NO es compartida, **cuando** miro el SD del parent, **entonces** `X` mantiene saturacion canonica.
- **Dado** que un segundo sub-modelo del mismo parent comparte `{S4, S5}`, **cuando** miro el SD del parent, **entonces** `{S1, S2, S3, S4, S5}` aparecen atenuadas.
- **Dado** que desconecto el sub-modelo, **cuando** se completa el disconnect, **entonces** las cosas compartidas de ese sub-modelo pierden atenuacion y vuelven a canonico.

**Reglas y restricciones:**
- La atenuacion es union sobre todos los sub-modelos conectados.
- Misma convencion visual que HU-32.011.

**Modelo de datos tocado:**
- Derivado: `cosa.isSharedWithAny = parent.subModelos.some(sm => sm.sharedThings.includes(cosa.id))`.

**Dependencias:**
- Bloqueada por: HU-32.005.

**Integraciones:**
- Renderer JointJS.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §2 tabla `Cosas compartidas atenuadas en el parent`, §3.1 paso 5.
- Frames: frame_00115 (muestra `Sub System 1` atenuado junto a `Sub System 2` canonico).
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [render, visual, sub-modelo, cosas-compartidas, bidireccional].

---

### HU-32.013 — Restaurar saturacion al refinarse una cosa compartida

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** V.
**Superficie UI:** canvas del sub-modelo.
**Gesto canonico:** ninguno (derivado del estado de refinamiento).

**Historia:**
> Como modelador experto, quiero que una cosa compartida recupere su saturacion canonica cuando actua como contenedor de un in-zoom dentro del sub-modelo para no confundir el rol visual de refinable con el de compartida.

**Contexto de negocio:**
La atenuacion indica "es compartida" pero no debe obstaculizar el rol visual de un refinable in-zoomed. OPCloud resuelve la tension asignando la atenuacion al **rol en ese OPD** y no a la identidad del objeto. Si `First Processing` esta in-zoomed dentro del sub-modelo, recupera contorno azul saturado; si aparece como compartida en otro OPD del sub-modelo, se ve atenuada.

**Criterios de aceptacion:**
- **Dado** que una cosa compartida `P` esta in-zoomed en un OPD `SD1` del sub-modelo, **cuando** miro `P` como contenedor en `SD1`, **entonces** se renderiza con saturacion canonica (azul grueso si es proceso).
- **Dado** que el mismo `P` aparece en `SD` (raiz del sub-modelo) como compartida, **cuando** miro, **entonces** se renderiza atenuada.
- **Dado** que `P` es unfolded dentro del sub-modelo, **cuando** miro el contenedor unfolded, **entonces** la regla se aplica analogamente.

**Reglas y restricciones:**
- La atenuacion es propiedad del **rol en el OPD**, no de la identidad de la cosa.
- Regla potencialmente contraintuitiva: documentar en SSOT visual o en el diccionario visual.

**Modelo de datos tocado:**
- Ninguno nuevo; logica en renderer.

**Dependencias:**
- Bloqueada por: HU-32.011.

**Integraciones:**
- Renderer.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §3.3 paso 1 "observacion critica".
- Frames: frame_00065 (contorno azul al in-zoom).
- Clase de afirmacion: observado.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [render, inzoom, sub-modelo, visual].

---

### HU-32.014 — Mostrar alias `{id}` local al sub-modelo en etiqueta

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** V primario; K (scope del alias).
**Superficie UI:** etiqueta del objeto en canvas del sub-modelo.
**Gesto canonico:** ninguno (render derivado de `alias`).

**Historia:**
> Como modelador experto, quiero que los alias cortos (`{ss1o}`, `{tc}`) aparezcan en las etiquetas de las cosas dentro del sub-modelo y permanezcan ocultos en el parent hasta un unload+reload para tener identificadores compactos en el contexto donde los necesito sin contaminar la vista del padre.

**Contexto de negocio:**
Los alias cortos son necesarios para referenciar cosas compartidas en contextos computacionales (p.ej. formulas de `Total Cost {tc} = ...`). Que sean locales al sub-modelo evita que el parent acumule decoracion visual especifica del trabajo del subsistema. La asimetria de visibilidad esta documentada explicitamente.

**Criterios de aceptacion:**
- **Dado** que anado alias `{ss1o}` a `Sub System 1 Output` desde el sub-modelo, **cuando** miro la etiqueta en el sub-modelo, **entonces** dice `Sub System 1 Output {ss1o}`.
- **Dado** que el mismo objeto aparece en el parent, **cuando** miro su etiqueta sin haber unload+reload, **entonces** dice solo `Sub System 1 Output` (sin alias).
- **Dado** que hago unload all + reload del parent, **cuando** vuelvo a ver, **entonces** el alias aparece (si la politica de OPCloud es hacerlo visible post-reload — pendiente de verificar si es persistente global o solo pull diferido).
- **Dado** que el alias se edita de nuevo en el sub-modelo, **cuando** guardo, **entonces** el cambio se propaga con la misma asimetria.

**Reglas y restricciones:**
- `alias` es propiedad scoped por modelo, no global de la cosa.
- Marcadores visuales: `{` y `}` rodeando el alias, espacio simple entre nombre y alias.
- Pregunta abierta: ¿es persistente como propiedad del `parent.subModelos[].sharedThings[].alias` o vive solo en el sub-modelo?

**Modelo de datos tocado:**
- `sharedThingReference.localAlias` — string nullable — persistente en el modelo donde se definio.

**Dependencias:**
- Bloqueada por: HU-32.011.

**Integraciones:**
- Renderer; motor OPL (el alias aparece en oraciones OPL del sub-modelo).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §2 tabla `Alias entre llaves`, §3.3 paso 3, §6 "modelo de datos implicito".
- Frames: frame_00075, frame_00080, frame_00090, frame_00105.
- Transcripcion: confirma asimetria de visibilidad.
- Clase de afirmacion: observado + confirmado.
- Etiqueta: `requires-clarification` (scope exacto del alias).

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [render, alias, sub-modelo, asimetria-modelo, requires-clarification].

---

### HU-32.015 — Calcular numeracion `SDx.y` relativa al modelo abierto

**Actor primario:** RV.
**Actores secundarios:** ME.
**Tipo:** mixto.
**Nivel categorico:** L.
**Superficie UI:** arbol OPD + etiquetas de OPD.
**Gesto canonico:** ninguno.

**Historia:**
> Como revisor, quiero que la numeracion `SDx.y` de un mismo OPD sea distinta segun desde que modelo raiz lo miro para tener una navegacion coherente con mi contexto actual sin cruzar fronteras accidentalmente.

**Contexto de negocio:**
La numeracion `SDx.y` es **vista computada**, no id persistente. Un mismo OPD que vive en el sub-modelo como `SD1` aparece como `SD1.1.1` cuando se lo ve como descendiente read-only desde el parent. Esto preserva la invariante de "ruta desde la raiz del modelo abierto" y evita que el usuario asuma que los numeros son identidades globales.

**Criterios de aceptacion:**
- **Dado** que el sub-modelo tiene un OPD propio con numeracion `SD1` en su tab, **cuando** lo abro desde el arbol del parent (nodo read-only bajo `SD1.1: ... Subsystem Modelo View`), **entonces** el mismo OPD se etiqueta `SD1.1.1` en esa vista.
- **Dado** que un sub-sub-modelo anidado aparece en el arbol del parent, **cuando** lo miro, **entonces** su numeracion se concatena con el prefijo del parent (`SD1.1.1.1.1`…).
- **Dado** que vuelvo a la tab del sub-modelo, **cuando** miro el mismo OPD, **entonces** vuelve a llamarse `SD1`.
- **Dado** que cito un OPD por `SDx.y`, **cuando** comparto la referencia cross-modelo, **entonces** la cita es valida solo en el contexto del modelo donde se computo (documentar como convencion).

**Reglas y restricciones:**
- La numeracion NO se persiste; es derivada en cada render.
- La identidad estable del OPD es su UUID interno, no `SDx.y`.

**Modelo de datos tocado:**
- `opd.id` — UUID — persistente.
- `opd.path` — derivada en render — transitoria.

**Dependencias:**
- Bloqueada por: HU-32.006, HU-32.016.

**Integraciones:**
- Arbol OPD; OPL pane (que cita `SDx.y`).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §4.6 "Numeracion relativa al modelo en que se abre".
- Frames: frame_00075 (parent), frame_00090 (sub-modelo), frame_00100 (sub-modelo).
- Transcripcion: confirma el recalculo relativo.
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [opd-tree, numeracion, view-opd, sub-modelo].

---

### HU-32.016 — Renderizar subnodos `(read only)` del sub-modelo bajo nodo del parent

**Actor primario:** RV.
**Actores secundarios:** ME.
**Tipo:** mixto.
**Nivel categorico:** L primario; V secundario.
**Superficie UI:** arbol OPD del parent.
**Gesto canonico:** expandir el nodo `SDx.y: <N> Subsystem Modelo View`.

**Historia:**
> Como revisor, quiero expandir el nodo del sub-modelo desde el arbol del parent y ver sus OPDs descendientes como `(read only)` en color grisado para consultar el contenido del subsistema sin cambiar de tab y sin riesgo de editarlo accidentalmente.

**Contexto de negocio:**
Navegar cross-modelo sin cambiar de tab es un requisito de ergonomia — acelera la revision. El sufijo `(read only)` y el color grisado codifican inequivocamente que esa rama no se edita desde esta tab; para editar hay que cambiar a la tab del sub-modelo.

**Criterios de aceptacion:**
- **Dado** que el sub-modelo esta cargado y tiene un OPD `SD1: First Processing in-zoomed`, **cuando** expando el nodo del sub-modelo en el arbol del parent, **entonces** veo un subnodo `SD1.1.1: First Processing in-zoomed (read only)` en color grisado.
- **Dado** que hago clic sobre ese subnodo, **cuando** se ejecuta, **entonces** el canvas del parent muestra ese OPD en modo read-only (no editable).
- **Dado** que intento editar algo en ese canvas read-only, **cuando** intento, **entonces** la operacion se bloquea con mensaje "switch to sub-modelo tab to edit".
- **Dado** que el sub-modelo no esta cargado (unloaded), **cuando** expando el nodo, **entonces** no veo los descendientes hasta que se complete el fetch on-demand (HU-32.022).

**Reglas y restricciones:**
- El sufijo `(read only)` es parte de la etiqueta computada, no se persiste.
- El color grisado aplica al texto del nodo y al canvas al abrirlo.

**Modelo de datos tocado:**
- Lectura cross-archivo del SD y descendientes del sub-modelo — cacheado en sesion tras fetch.

**Dependencias:**
- Bloqueada por: HU-32.006, HU-32.022.

**Integraciones:**
- Arbol OPD; renderer (modo read-only del canvas).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §2 tabla `Nodo descendiente (read only)`, §3.5 "Ver cosas del sub-modelo dentro del parent".
- Frames: frame_00075, frame_00085.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [opd-tree, read-only, sub-modelo, navegacion].

---

### HU-32.017 — Restringir biblioteca Draggable del sub-modelo a compartidas + nativas

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** L.
**Superficie UI:** panel biblioteca `Draggable OPM Things` en tab del sub-modelo.
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador experto, quiero que la biblioteca lateral del sub-modelo liste solo las cosas compartidas + las nativas del sub-modelo para no poder arrastrar cosas del parent que no son parte de mi alcance.

**Contexto de negocio:**
El sub-modelo tiene su propio universo de cosas — compartidas (heredadas) + nativas (creadas en el sub-modelo). Listar cosas del parent no-compartidas en la biblioteca del sub-modelo seria inconsistente y habilitaria drags ilegitimos. La restriccion respeta la invariante de scope.

**Criterios de aceptacion:**
- **Dado** que estoy en la tab del sub-modelo, **cuando** miro la biblioteca lateral, **entonces** veo solo: (a) cosas compartidas del parent, (b) cosas nativas creadas en el sub-modelo.
- **Dado** que el parent tiene `Main Input` no compartida, **cuando** miro la biblioteca del sub-modelo, **entonces** `Main Input` NO aparece.
- **Dado** que creo una cosa nativa `Total Cost` en el sub-modelo, **cuando** miro la biblioteca, **entonces** `Total Cost` aparece al final de la lista.
- **Dado** que busco por nombre en la biblioteca, **cuando** escribo "Main Input", **entonces** no se encuentra (no existe en el scope).

**Reglas y restricciones:**
- La biblioteca es vista del modelo actual, no del parent.
- Drag desde la biblioteca del sub-modelo solo produce apariencias dentro del sub-modelo (o estados del sub-modelo).

**Modelo de datos tocado:**
- Lectura de `subModelo.things[]` + `subModelo.sharedThings[]` — derivada.

**Dependencias:**
- Bloqueada por: HU-32.008.

**Integraciones:**
- Biblioteca lateral (compartida con EPICA-10/11).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §2 tabla `Biblioteca Draggable OPM Things`.
- Frames: frame_00040, frame_00060, frame_00090.
- Transcripcion: confirma la restriccion de scope.
- Clase de afirmacion: observado + confirmado.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [ui, biblioteca-lateral, sub-modelo, scope].

---

### HU-32.018 — Renderizar badge verde para estado cargado+sincronizado

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** V primario; P secundario.
**Superficie UI:** arbol OPD del parent (badge junto al nodo).
**Gesto canonico:** ninguno (render declarativo).

**Historia:**
> Como modelador experto, quiero ver un badge verde con flechas de refresh junto al nodo sub-modelo cuando esta cargado y sincronizado para saber a simple vista que lo que veo refleja el estado real del archivo del subsistema.

**Contexto de negocio:**
El estado de sincronia es invisible sin una senal. El badge verde es la afirmacion "todo al dia". Junto con los otros dos estados (amarillo = desincronizado, gris/ausente = unloaded) forma un ternario que resume la relacion parent↔sub-modelo.

**Criterios de aceptacion:**
- **Dado** que acabo de crear el sub-modelo o acabo de fetchearlo, **cuando** miro el nodo en el arbol, **entonces** veo badge circular verde con dos flechas curvas de refresh.
- **Dado** que el sub-modelo fue modificado pero aun no se ha detectado la desincronizacion, **cuando** miro el badge (dentro de la ventana de 30s), **entonces** el badge puede seguir verde hasta el proximo chequeo.
- **Dado** que el sub-modelo no tiene modificaciones pendientes y esta cargado, **cuando** miro, **entonces** el badge es verde.

**Reglas y restricciones:**
- El icono es fijo (flechas curvas de refresh); solo el color cambia.
- Verde = `#???` (color exacto a definir en SSOT visual; convencion `requires-clarification`).

**Modelo de datos tocado:**
- Estado de sesion: `subModeloState.loaded = true` + `subModeloState.syncedAt = timestamp`.

**Dependencias:**
- Bloqueada por: HU-32.006.
- Relaciona: HU-32.019, HU-32.020.

**Integraciones:**
- Arbol OPD; sistema de polling (HU-32.020).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §2 tabla `Nodo del arbol con badge verde`, §3.4 paso 1, §5.2 tabla de estados.
- Frames: frame_00035, frame_00100.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [render, badge, sub-modelo, estado, visual].

---

### HU-32.019 — Mutar badge a amarillo al detectar desincronizacion

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** V primario; P secundario.
**Superficie UI:** badge en arbol OPD del parent.
**Gesto canonico:** ninguno (mutacion automatica).

**Historia:**
> Como modelador experto, quiero que el badge cambie de verde a amarillo cuando el sub-modelo fue modificado para saber que necesito refrescar si quiero ver el estado mas reciente.

**Contexto de negocio:**
Sin senal de desincronizacion, el modelador del parent podria operar sobre datos obsoletos del sub-modelo (p.ej. valores computacionales cacheados). El badge amarillo es el aviso visual minimo. Al usuario le corresponde decidir cuando refrescar (HU-32.021).

**Criterios de aceptacion:**
- **Dado** que el sub-modelo esta cargado + sincronizado, **cuando** se guarda una modificacion del sub-modelo en su tab (o en otra sesion), **entonces** dentro de los proximos <=30s el badge en el arbol del parent muta a amarillo (frame 00080 lo evidencia tras `Successfully saved`).
- **Dado** que el badge es amarillo, **cuando** hago unload + fetch on-demand, **entonces** el badge vuelve a verde.
- **Dado** que varios sub-modelos se desincronizan, **cuando** miro el arbol, **entonces** cada uno tiene su propio badge con su propio color.

**Reglas y restricciones:**
- La transicion es automatica; no requiere accion del modelador del parent.
- No hay tercer estado documentado (rojo / loading) en este video — `requires-clarification` (pregunta abierta 11.1 del doc fuente).

**Modelo de datos tocado:**
- `subModeloState.syncedAt` se compara con `file.modifiedAt`; si `modifiedAt > syncedAt` → `out_of_sync = true`.

**Dependencias:**
- Bloqueada por: HU-32.018, HU-32.020.

**Integraciones:**
- Polling de sincronia; arbol OPD.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §2, §3.4 paso 2, §5.2.
- Frames: frame_00080.
- Transcripcion: "*we have it unloaded, we have it loaded and synchronized, and loaded and unsynchronized*".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [sync, badge, sub-modelo, estado].

---

### HU-32.020 — Chequear sincronia periodicamente (~30s)

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** P primario; U (senal).
**Superficie UI:** (interna) → badge (HU-32.019).
**Gesto canonico:** ninguno (temporizado).

**Historia:**
> Como modelador experto, quiero que el sistema compruebe cada ~30s si los sub-modelos cargados siguen sincronizados para actualizar el badge sin que yo tenga que pedirlo explicitamente.

**Contexto de negocio:**
La sincronia no es instantanea — OPCloud declara 30s como ventana aceptable. Es un trade-off entre feedback rapido y carga de red/CPU. Para el modelador del parent, 30s es una espera razonable antes de asumir que su vista esta al dia.

**Criterios de aceptacion:**
- **Dado** que hay >=1 sub-modelo cargado, **cuando** transcurren ~30s, **entonces** se dispara un chequeo de sincronia que compara `file.modifiedAt` contra `subModeloState.syncedAt` de cada sub-modelo.
- **Dado** que un sub-modelo cambio, **cuando** el chequeo lo detecta, **entonces** su badge se actualiza a amarillo (HU-32.019).
- **Dado** que varios sub-modelos estan cargados, **cuando** corre el chequeo, **entonces** se procesan todos en el mismo tick (sin polling escalonado).
- **Dado** que no hay sub-modelos cargados, **cuando** corre el ticker, **entonces** el chequeo es no-op (sin cost network).

**Reglas y restricciones:**
- Intervalo 30s es el observado; no se evidencia configurabilidad.
- El chequeo debe ser ligero: ideal comparacion de timestamps, no descarga completa.

**Modelo de datos tocado:**
- `subModeloState.syncedAt` — timestamp de sesion.
- `file.modifiedAt` — metadato persistente.

**Dependencias:**
- Bloqueada por: HU-32.005.

**Integraciones:**
- Persistencia (lectura de metadata); arbol OPD (mutacion de badge).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §3.4 paso 4.
- Transcripcion: "*the checking if the submodel is synchronized or not on the main model is up to 30 seconds, so it is not instantaneous*".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [sync, polling, sub-modelo, performance].

---

### HU-32.021 — Descargar todos los sub-modelos con boton Unload all

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** U primario; P secundario.
**Superficie UI:** toolbar del parent (boton dedicado).
**Gesto canonico:** clic.

**Historia:**
> Como modelador experto, quiero un boton "Unload all sub-modelos" en la toolbar del parent para resetear la vista y forzar un fetch fresco cuando sospecho que algo no esta al dia o quiero ahorrar memoria.

**Contexto de negocio:**
La resincronizacion voluntaria (o el descargue de memoria para modelos grandes) requiere una accion explicita. Unload-all es una **operacion de puerta** simple y comprensible. La transcripcion aclara que es **global**: no hay unload selectivo documentado.

**Criterios de aceptacion:**
- **Dado** que el parent tiene >=1 sub-modelo cargado, **cuando** hago clic en `Unload all sub-modelos`, **entonces** todos los sub-modelos pasan a estado unloaded (badge gris/ausente).
- **Dado** que hago hover sobre el boton, **cuando** aparece el tooltip, **entonces** dice exactamente `reset and unload all previously loaded sub-models`.
- **Dado** que tras el unload expando el nodo de un sub-modelo, **cuando** lo hago, **entonces** se dispara fetch on-demand (HU-32.022) y vuelve a cargarse fresco.
- **Dado** que no hay sub-modelos cargados, **cuando** hago clic, **entonces** la accion es no-op sin error (el boton sigue disponible pero no hace nada observable).

**Reglas y restricciones:**
- Unload es global, no selectivo (`requires-clarification`: ¿hay unload por nodo? no observado).
- Unload no altera los archivos en disco — solo descarga memoria de sesion.

**Modelo de datos tocado:**
- `subModeloState.loaded = false` para todos los sub-modelos del parent actual.

**Dependencias:**
- Bloqueada por: HU-32.005.
- Relaciona: HU-32.022.

**Integraciones:**
- Toolbar del parent; arbol OPD; polling.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §2 tabla `Boton Unload all`, §3.4 paso 3.
- Transcripcion: tooltip literal.
- Clase de afirmacion: confirmado por transcripcion.
- Etiqueta: `requires-clarification` (unload selectivo).

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [ui, toolbar, unload, sub-modelo, requires-clarification].

---

### HU-32.022 — Fetch on-demand al expandir nodo sub-modelo

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** P primario; L (arbol) secundario.
**Superficie UI:** arbol OPD del parent.
**Gesto canonico:** clic en triangulo de expansion del nodo sub-modelo.

**Historia:**
> Como modelador experto, quiero que el contenido del sub-modelo se fetchee solo cuando expando su nodo por primera vez (lazy loading) para que la carga inicial del parent no sature con N sub-sub-modelos que tal vez no necesito.

**Contexto de negocio:**
La politica lazy es explicita: al abrir el parent, los sub-modelos NO se cargan. El primer expand dispara el fetch. Motivo declarado: evitar saturacion de arranque cuando hay muchos sub-modelos o sub-sub-modelos anidados.

**Criterios de aceptacion:**
- **Dado** que acabo de abrir el parent en tab, **cuando** inspecciono el estado inicial, **entonces** todos los sub-modelos estan `unloaded` (sin contenido en memoria).
- **Dado** que expando un nodo sub-modelo por primera vez, **cuando** lo hago, **entonces** se dispara fetch del archivo, al completarse el badge pasa a verde y los subnodos `(read only)` aparecen.
- **Dado** que el fetch esta en curso, **cuando** miro el badge, **entonces** muestra un indicador de carga (spinner o estado "loading" — `requires-clarification`: no explicitado en docs).
- **Dado** que el fetch falla (archivo inaccesible), **cuando** se completa con error, **entonces** el badge queda en estado de error (color/simbolo pendiente de definir) y al expandir vuelve a reintentar.

**Reglas y restricciones:**
- Lazy por default. No se conoce flag para forzar carga transitiva al abrir parent.
- Sub-sub-modelos siguen la misma regla — fetch on-demand en cada nivel.

**Modelo de datos tocado:**
- `subModeloState.loaded` transiciona `false → true` tras fetch exitoso.
- `subModeloState.content` se hidrata tras fetch.

**Dependencias:**
- Bloqueada por: HU-32.006.
- Bloquea a: HU-32.016, HU-32.030.

**Integraciones:**
- Persistencia; arbol OPD; renderer.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §3.4 paso 5 "politica lazy loading".
- Transcripcion: justifica por evitar carga de muchos sub-modelos.
- Clase de afirmacion: confirmado por transcripcion.
- Etiqueta: `requires-clarification` (indicador de loading exacto).

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [lazy-loading, sub-modelo, performance, fetch, requires-clarification].

---

### HU-32.023 — Permitir renombrar y alias de cosas compartidas desde el sub-modelo

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** K primario; V (render actualizado).
**Superficie UI:** canvas del sub-modelo + popup `Auto Format`.
**Gesto canonico:** doble clic / edicion desde popup sobre cosa compartida.

**Historia:**
> Como modelador experto, quiero editar nombre y alias de las cosas compartidas desde el sub-modelo para reflejar refinamientos que aprendo en el subsistema sin tener que ir al parent.

**Contexto de negocio:**
El sub-modelo es donde se profundiza un subsistema — es natural que refinamientos de nomenclatura ocurran alli. Permitir rename y alias desde el sub-modelo respeta la dinamica del trabajo distribuido. La propagacion al parent ocurre via sincronizacion (HU-32.019).

**Criterios de aceptacion:**
- **Dado** que una cosa compartida `S` aparece en el sub-modelo, **cuando** la renombro desde su popup, **entonces** el nuevo nombre persiste en el archivo del sub-modelo y se refleja en la proxima sincronizacion del parent.
- **Dado** que anado alias `{x}` a `S` desde el sub-modelo, **cuando** confirmo, **entonces** el alias se persiste scoped por modelo (ver HU-32.014).
- **Dado** que edito `S`, **cuando** cambia su nombre, **entonces** el OPL del sub-modelo lo refleja de inmediato.
- **Dado** que el parent tiene la version antigua cargada, **cuando** el polling detecta la desincronizacion, **entonces** el badge muta a amarillo (HU-32.019).

**Reglas y restricciones:**
- Rename y alias son ediciones **permitidas** sobre cosas compartidas. Otras operaciones (anadir estados, eliminar, outgoing fundamental) estan prohibidas (HU-32.024, HU-32.025, HU-32.026).
- `value` (si es computational) tambien editable desde el sub-modelo.

**Modelo de datos tocado:**
- `cosa.name` — string — persistente en el archivo donde se edita.
- `cosaRef.localAlias` — string nullable — persistente scoped.

**Dependencias:**
- Bloqueada por: HU-32.008, HU-32.011.
- Relaciona: HU-32.019, HU-32.024, HU-32.025.

**Integraciones:**
- Renderer; OPL; sincronizacion.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §3.3 paso 6, §5.4 "Politica de edicion de cosas compartidas".
- Frames: frame_00105.
- Transcripcion: "*you can change its value, you can change the name, you cannot add states to the shared things, you cannot delete them*".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [edicion, cosas-compartidas, sub-modelo, alias, rename].

---

### HU-32.024 — Prohibir anadir estados a cosas compartidas desde el sub-modelo

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** K primario; U (feedback).
**Superficie UI:** toolbar contextual / pie menu sobre cosa compartida.
**Gesto canonico:** intento de `add-state`.

**Historia:**
> Como modelador experto, quiero que la operacion `add-state` sobre una cosa compartida este bloqueada con mensaje explicito para no alterar la estructura ontologica de un objeto que pertenece al alcance compartido con el parent.

**Contexto de negocio:**
Anadir estados a un objeto cambia su ontologia OPM (pasa de stateless a stateful). Esa decision debe tomarse en el contexto del parent, no del sub-modelo. Permitirla desde el sub-modelo abriria la puerta a que un modelador de subsistema altere la forma del objeto global sin que el modelador del parent lo vea.

**Criterios de aceptacion:**
- **Dado** que tengo una cosa compartida `O` seleccionada en el sub-modelo, **cuando** abro el pie menu y veo las opciones, **entonces** `add-state` aparece deshabilitado o no aparece.
- **Dado** que intento ejecutar `add-state` programaticamente, **cuando** el validador corre, **entonces** la operacion se rechaza con mensaje `cannot add states to shared things`.
- **Dado** que el mismo objeto `O` no fuera compartido (fuera nativo del sub-modelo), **cuando** intento `add-state`, **entonces** procede normalmente.

**Reglas y restricciones:**
- La regla aplica a cosas compartidas, no a nativas del sub-modelo.
- El mensaje de error debe ser especifico para que el usuario entienda la razon.

**Modelo de datos tocado:**
- Consulta de `cosa.affinityModelo`.

**Dependencias:**
- Bloqueada por: HU-32.011.

**Integraciones:**
- Validador kernel; pie menu.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §5.4.
- Transcripcion: confirma prohibicion explicita.
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [validacion, cosas-compartidas, kernel, sub-modelo].

---

### HU-32.025 — Prohibir eliminar cosas compartidas desde cualquier lado

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** K.
**Superficie UI:** canvas + menu contextual / pie menu.
**Gesto canonico:** intento de `remove` / `delete` sobre cosa compartida.

**Historia:**
> Como modelador experto, quiero que la eliminacion de cosas compartidas este bloqueada tanto desde el parent como desde el sub-modelo para mantener la invariante de que la frontera compartida no puede modificarse post-creacion.

**Contexto de negocio:**
Eliminar una cosa compartida romperia la referencia cruzada. La politica de OPCloud es prevenirlo y obligar al usuario a `Disconnect` si quiere cambiar la frontera (la unica via "limpia" documentada). Este bloqueo es la contraparte operativa del diseno restrictivo de la feature.

**Criterios de aceptacion:**
- **Dado** que intento `remove` sobre una cosa compartida en el parent, **cuando** el validador corre, **entonces** se rechaza con mensaje `cannot delete shared thing. Disconnect sub-modelo first`.
- **Dado** que intento lo mismo en el sub-modelo, **cuando** el validador corre, **entonces** se rechaza con el mismo mensaje.
- **Dado** que desconecto el sub-modelo (HU-32.028/029), **cuando** vuelvo a intentar eliminar la cosa (que ya no es compartida), **entonces** procede.

**Reglas y restricciones:**
- Bloqueo simetrico en ambos modelos.
- El mensaje orienta al usuario hacia la via legitima (disconnect primero).

**Modelo de datos tocado:**
- `cosa.affinityModelo === "shared"` → prohibe delete.

**Dependencias:**
- Bloqueada por: HU-32.011.

**Integraciones:**
- Validador kernel; comando `remove`.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §5.4, §5.5.
- Transcripcion: "*you cannot delete them*".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [validacion, cosas-compartidas, kernel, sub-modelo].

---

### HU-32.026 — Bloquear outgoing fundamental enlaces nuevos desde cosas compartidas en el parent

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** K primario; U.
**Superficie UI:** canvas del parent + modal tabla de enlaces + warning.
**Gesto canonico:** drag desde cosa compartida en el parent hacia otra cosa con intento de fundamental enlace.

**Historia:**
> Como modelador experto, quiero que cualquier intento de anadir un outgoing fundamental enlace (aggregation, exhibition, generalization, classification) desde una cosa compartida en el parent se bloquee con warning para preservar la responsabilidad del sub-modelo sobre la estructura fundamental de esa cosa.

**Contexto de negocio:**
Los fundamental enlaces definen la estructura jerarquica de la cosa (que partes, que atributos, que especializaciones). Si el parent pudiera agregarlos sobre cosas compartidas, estaria compitiendo con el sub-modelo por la autoridad sobre esa estructura. El bloqueo preserva la regla implicita: "estructura fundamental de cosas compartidas = autoridad del sub-modelo".

**Criterios de aceptacion:**
- **Dado** que arrastro desde una cosa compartida `S` del parent hacia una cosa `X`, **cuando** la tabla de enlaces se abre, **entonces** los tipos fundamental (aggregation-participation, exhibition-characterization, generalization-specialization, classification) NO aparecen, con nota explicativa.
- **Dado** que si se puede conectar con un **procedural enlace** (regular process/data flow), **cuando** elijo ese tipo, **entonces** procede normalmente.
- **Dado** que la cosa compartida es de un tipo no-compatible con cualquier tipo del origen, **cuando** intento arrastrar, **entonces** recibo el warning general "cannot do it" (transcripcion).

**Reglas y restricciones:**
- La distincion fundamental vs procedural debe operacionalizarse en el validador (pregunta abierta 11.7 del doc fuente).
- El bloqueo aplica solo al **parent** (desde el sub-modelo si puede agregar fundamental enlaces, con propagacion restringida).

**Modelo de datos tocado:**
- Validacion en `enlace.create` considerando `source.affinityModelo === "shared"` + `enlace.category === "fundamental"`.

**Dependencias:**
- Bloqueada por: HU-32.011, HU-32.012.

**Integraciones:**
- Validador kernel; modal tabla de enlaces.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §4.3 "Intento de outgoing fundamental enlace".
- Transcripcion: "*if I want to add an object and then connect it from here, you see that there is a warning: you cannot do it*".
- Clase de afirmacion: confirmado por transcripcion.
- Etiqueta: `requires-clarification` (lista exacta de "fundamental" vs "procedural").

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [validacion, enlaces, cosas-compartidas, fundamental, requires-clarification].

---

### HU-32.027 — Prohibir rename desde file manager, exigirlo desde menu del nodo

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** P primario; U secundario.
**Superficie UI:** file manager de Main Menu + menu contextual del nodo sub-modelo.
**Gesto canonico:** intento de rename desde file manager; rename desde menu contextual.

**Historia:**
> Como modelador experto, quiero que el rename del archivo del sub-modelo solo sea posible desde el menu contextual del nodo en el arbol del parent para que el nombre canonico `<Sub> of <Parent> Subsystem` se mantenga consistente.

**Contexto de negocio:**
El nombre del archivo del sub-modelo es **derivado** (depende del nombre del parent). Si se renombra desde el file manager sin pasar por el menu del nodo, se rompe la sincronizacion entre `subModeloFile.name` y `<Sub> of <Parent> Subsystem`. La transcripcion advierte que esto "causara problemas".

**Criterios de aceptacion:**
- **Dado** que intento renombrar el archivo del sub-modelo desde Main Menu → file manager → Rename, **cuando** lo intento, **entonces** la accion se bloquea o se oculta con mensaje `rename sub-modelos via the sub-modelo node in the parent's tree`.
- **Dado** que renombro desde el menu contextual del nodo (opcion `Rename` del popover), **cuando** confirmo un nuevo nombre `N'`, **entonces** el archivo se renombra a `<N'> of <Parent> Subsystem` y la referencia en el parent se actualiza.
- **Dado** que el parent se renombra, **cuando** se completa el rename del parent, **entonces** todos sus sub-modelos ajustan su nombre canonico automaticamente (`<Sub> of <ParentNuevo> Subsystem`).

**Reglas y restricciones:**
- El rename desde menu del nodo es la unica via legal.
- Rename del parent cascadea a todos sus sub-modelos.

**Modelo de datos tocado:**
- `subModeloFile.name` — derivado — persistente.
- `parent.subModelos[].fileRef` — actualizado en cascada.

**Dependencias:**
- Bloqueada por: HU-32.007.

**Integraciones:**
- File manager; menu contextual; persistencia.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §4.4 "Rename desde Main Menu".
- Transcripcion: "*otherwise you will have problem*".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [validacion, rename, sub-modelo, file-manager].

---

### HU-32.028 — Disconnect desde menu contextual del nodo en el parent

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** P primario; K secundario.
**Superficie UI:** menu contextual del nodo + prompt de confirmacion.
**Gesto canonico:** clic derecho → `Disconnect Sub Modelo` → confirmar.

**Historia:**
> Como modelador experto, quiero desconectar un sub-modelo desde el arbol del parent con prompt de confirmacion para deshacer la vinculacion cuando ya no tiene sentido y recuperar libertad de edicion sobre las cosas compartidas.

**Contexto de negocio:**
`Disconnect` es la unica operacion "destructiva" de vinculo. Es explicitamente **irreversible**: no se puede reconectar un modelo existente como sub-modelo. El prompt de confirmacion es esencial para prevenir disparos accidentales.

**Criterios de aceptacion:**
- **Dado** que hago clic derecho en el nodo del sub-modelo, **cuando** selecciono `Disconnect Sub Modelo`, **entonces** aparece prompt de confirmacion con mensaje que aclara irreversibilidad.
- **Dado** que confirmo, **cuando** se ejecuta, **entonces** (a) el nodo desaparece del arbol, (b) las cosas compartidas pierden atenuacion en el parent, (c) el tab del parent puede perder glifo flecha-izq si era su unico sub-modelo, (d) la entrada `parent.subModelos[]` de ese sub-modelo se elimina.
- **Dado** que cancelo el prompt, **cuando** se cierra, **entonces** no hay cambios.
- **Dado** que se completo disconnect en el lado parent, **cuando** el sub-modelo sigue abierto en otra tab, **entonces** muestra indicador "pending disconnect bilateral" (HU-32.029).

**Reglas y restricciones:**
- Disconnect es irreversible en el sentido de que no existe "reconnect existing model as sub-modelo".
- El contenido del sub-modelo NO se elimina — el archivo sigue existiendo.

**Modelo de datos tocado:**
- `parent.subModelos[]` — eliminacion de entrada — persistente.

**Dependencias:**
- Bloqueada por: HU-32.007.
- Bloquea a: HU-32.029.

**Integraciones:**
- Arbol OPD; renderer; tabs; persistencia.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §2 tabla `Boton Disconnect (parent)`, §3.7 paso 1–2.
- Frames: frame_00035.
- Transcripcion: "*it is unreversible, meaning you will not be able to reconnect*".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [sub-modelo, disconnect, irreversible, persistencia].

---

### HU-32.029 — Disconnect bilateral desde el sub-modelo y guardar ambos

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** P primario; U.
**Superficie UI:** toolbar del sub-modelo (boton dedicado).
**Gesto canonico:** clic en boton `Disconnect` desde la tab del sub-modelo.

**Historia:**
> Como modelador experto, quiero completar el disconnect tambien desde la tab del sub-modelo y guardar ambos archivos para dejar el sub-modelo como modelo OPM regular sin estado inconsistente.

**Contexto de negocio:**
El disconnect es una transaccion de dos lados: parent elimina referencia, sub-modelo elimina su campo `parentRef`. Si solo uno se actualiza, el archivo queda inconsistente. OPCloud requiere disconnect bilateral + save bilateral. Es una friccion consciente que asegura consistencia.

**Criterios de aceptacion:**
- **Dado** que ya hice disconnect desde el parent (HU-32.028), **cuando** abro la tab del sub-modelo, **entonces** veo un boton `Disconnect` especifico en la toolbar del sub-modelo.
- **Dado** que hago clic en ese boton, **cuando** confirmo, **entonces** el campo `subModelo.parentRef` se elimina.
- **Dado** que complete disconnect bilateral, **cuando** guardo ambos modelos (save parent + save sub-modelo), **entonces** el sub-modelo pasa a ser modelo OPM regular en el folder.
- **Dado** que el parent ya desconecto pero el sub-modelo aun tiene `parentRef`, **cuando** miro el sub-modelo, **entonces** muestra estado visual de inconsistencia (atenuaciones confusas, advertencia).

**Reglas y restricciones:**
- Requiere save explicito de ambos archivos.
- Tras disconnect completo, el sub-modelo se comporta como cualquier modelo OPM (se puede editar, renombrar libremente, mover, borrar).

**Modelo de datos tocado:**
- `subModelo.parentRef` — eliminacion — persistente.

**Dependencias:**
- Bloqueada por: HU-32.008, HU-32.028.

**Integraciones:**
- Toolbar del sub-modelo; persistencia.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §2 tabla `Boton Disconnect (sub-modelo)`, §3.7 paso 3–4.
- Transcripcion: "*you have to make disconnect in both sides and save both models*".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [sub-modelo, disconnect, bilateral, save].

---

### HU-32.030 — Incluir sub-modelos unloaded en export PDF con fetch automatico

**Actor primario:** RV.
**Actores secundarios:** ME.
**Tipo:** mixto.
**Nivel categorico:** X (integracion export) primario; P secundario.
**Superficie UI:** dialogo `Export Modelo to PDF`.
**Gesto canonico:** marcar checkbox `Include Unloaded Sub-Modelos` + `Save`.

**Historia:**
> Como revisor, quiero exportar un PDF del parent que incluya sub-modelos aun no cargados (fetch automatico) para generar documentacion completa sin tener que abrir manualmente cada sub-modelo primero.

**Contexto de negocio:**
El PDF es la salida de documentacion/comunicacion formal. Si el export solo incluyera lo ya cargado, el revisor tendria que recordar abrir cada sub-modelo. El checkbox `Include Unloaded Sub-Modelos ✓` automatiza el fetch y garantiza un PDF exhaustivo.

**Criterios de aceptacion:**
- **Dado** que abro Main Menu → Export → PDF, **cuando** se muestra el dialogo, **entonces** veo el checkbox `Include Unloaded Sub-Modelos` marcado por defecto entre las otras opciones.
- **Dado** que dejo el checkbox marcado y hago `Save`, **cuando** se ejecuta: (a) los sub-modelos unloaded se fetchean antes de renderizar el PDF, (b) el PDF incluye todos los OPDs (parent + todos los sub-modelos + sub-sub-modelos).
- **Dado** que desmarco el checkbox, **cuando** hago `Save`, **entonces** el PDF incluye solo el parent + sub-modelos ya cargados en sesion.
- **Dado** que un sub-modelo es inaccesible (permisos o archivo faltante), **cuando** el fetch automatico falla, **entonces** el PDF continua sin ese sub-modelo con nota explicita.
- **Dado** que activo `Select OPDs to Export`, **cuando** selecciono OPDs especificos, **entonces** la politica de fetch se respeta para los elegidos.

**Reglas y restricciones:**
- Checkbox por default: ✓ (marcado).
- El fetch es transitivo: si un sub-modelo tiene sub-sub-modelos unloaded, tambien se fetchean.
- La opcion identica existe en export OPL (delegado a EPICA-60 y variante).

**Modelo de datos tocado:**
- Estado de sesion: tras el export, los sub-modelos fetcheados pueden quedar cargados (confirmar en `requires-clarification`).

**Dependencias:**
- Bloqueada por: HU-32.022.
- Relaciona: EPICA-60 (export-pdf).

**Integraciones:**
- Motor de export PDF; fetch on-demand; OPL renderer.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §2 tabla `Dialogo Export Modelo to PDF`, §3.8, §5.3.
- Frames: frame_00125.
- Clase de afirmacion: observado.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [export-pdf, sub-modelo, fetch, configuracion].

---

### HU-32.031 — Permisionar sub-modelo de forma independiente del parent

**Actor primario:** AO (admin de organizacion).
**Actores secundarios:** CO (colaborador).
**Tipo:** mixto.
**Nivel categorico:** X (integracion permisos) primario.
**Superficie UI:** panel de permisos (compartido con EPICA-40).
**Gesto canonico:** asignacion de permisos sobre archivo peer del sub-modelo.

**Historia:**
> Como admin de organizacion, quiero asignar permisos al sub-modelo como cualquier otro archivo OPM para que distintos modeladores trabajen en paralelo sobre sus subsistemas sin compartir necesariamente permisos sobre el parent.

**Contexto de negocio:**
La separacion de permisos es el verdadero rendimiento de la arquitectura archivo-peer: permite que, por ejemplo, el modelador del subsistema `A` tenga escritura sobre el sub-modelo `A` pero solo lectura sobre el parent, y otro modelador tenga lo inverso. Sin esto, la promesa de "trabajo paralelo sobre distintos subsistemas" se degrada.

**Criterios de aceptacion:**
- **Dado** que abro el panel de permisos del sub-modelo (via file manager), **cuando** asigno permisos, **entonces** los permisos se guardan a nivel de archivo peer, independientes del parent.
- **Dado** que un usuario tiene permiso sobre el parent pero no sobre el sub-modelo, **cuando** abre el parent, **entonces** el nodo del sub-modelo aparece en el arbol pero al intentar expandir recibe error de permisos (o el nodo se muestra como "sin acceso").
- **Dado** que un usuario tiene permiso sobre el sub-modelo pero no sobre el parent, **cuando** intenta abrir el parent, **entonces** falla el acceso (el sub-modelo se abre directamente via Load Modelo).
- **Dado** que se cambia el permiso del parent, **cuando** se guarda, **entonces** NO cascadea automaticamente al sub-modelo (requiere cambio explicito en cada archivo peer).

**Reglas y restricciones:**
- Permisos son per-archivo.
- Si hay permisos cascada (heredados de folder — EPICA-31), aplican por separado a cada archivo peer.

**Modelo de datos tocado:**
- `file.permissions` — persistente por archivo.

**Dependencias:**
- Relaciona: EPICA-40 (permisos), EPICA-31 (folders).

**Integraciones:**
- Sistema de permisos.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §7.7 "Con permisos".
- Transcripcion: "*you can give different permissions like you regularly do*".
- Clase de afirmacion: confirmado por transcripcion.
- Etiqueta: `requires-clarification` (comportamiento exacto cuando hay permiso asimetrico — pregunta abierta 11.6).

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [permisos, sub-modelo, archivo-peer, colaboracion, requires-clarification].

---

### HU-32.032 — Mantener sub-modelo en el mismo folder que el parent

**Actor primario:** AO.
**Actores secundarios:** ME.
**Tipo:** mixto.
**Nivel categorico:** P primario.
**Superficie UI:** file manager (Main Menu) + operaciones de move.
**Gesto canonico:** move del parent o del sub-modelo.

**Historia:**
> Como admin, quiero que el sub-modelo permanezca siempre en el mismo folder que el parent y que un move del parent cascadee a los sub-modelos para evitar que se rompa la referencia cross-archivo por reorganizacion de carpetas.

**Contexto de negocio:**
La referencia `parent.subModelos[].fileRef` es una ruta relativa (mismo folder). Si el parent se mueve sin sus sub-modelos, la ruta queda rota. OPCloud impone la regla "mismo folder" como invariante; el move en cascada la mantiene.

**Criterios de aceptacion:**
- **Dado** que el parent esta en `Home/T1/SubSystemExample/`, **cuando** inspecciono el sub-modelo, **entonces** esta en `Home/T1/SubSystemExample/`.
- **Dado** que muevo el parent a `Home/T1/Archive/`, **cuando** se ejecuta el move, **entonces** todos sus sub-modelos se mueven tambien a `Home/T1/Archive/`.
- **Dado** que intento mover solo el sub-modelo a otro folder, **cuando** lo intento, **entonces** la accion se bloquea con mensaje `sub-modelos must remain in the parent's folder. Disconnect first to move independently`.
- **Dado** que desconecto el sub-modelo, **cuando** se completa el disconnect, **entonces** el sub-modelo puede moverse libremente como modelo OPM regular.

**Reglas y restricciones:**
- Move en cascada solo aplica a parent → sub-modelos, no a niveles mas profundos automaticos (aunque si A padre de B padre de C, un move de A debe cascadear a B y por transitividad a C).
- Los archivos siguen siendo peer en el file system — la jerarquia de composicion NO se refleja como subfolders.

**Modelo de datos tocado:**
- `file.path` — actualizado en cascada.

**Dependencias:**
- Relaciona: EPICA-31 (folders), EPICA-35 (move-search).

**Integraciones:**
- File manager; persistencia.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md §Composicion inter-modelo`.
- Fuente: §7.6 "Con folders".
- Clase de afirmacion: observado + inferido (regla).

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [folders, sub-modelo, file-system, regla].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q32.1**: Color exacto del badge amarillo y existencia de tercer estado (rojo = conflicto, loading). Marca HU-32.019 y HU-32.022 como `requires-clarification`.
- **Q32.2**: ¿Unload selectivo por nodo existe, o solo unload-all? No observado. Afecta HU-32.021.
- **Q32.3**: Resolucion de conflicto de edicion simultanea (parent y sub-modelo editados en paralelo por distintos usuarios). Probable last-save-wins pero no confirmado. Impacta HU-32.019 y HU-32.031.
- **Q32.4**: Profundidad maxima de nested sub-modelos. Transcripcion confirma recursion; no hay limite documentado.
- **Q32.5**: Para `Include Unloaded Sub-Modelos ✓`, ¿fetch transitivo completo o solo primer nivel? Probablemente transitivo — HU-32.030 lo asume pero marca como pendiente de verificar.
- **Q32.6**: Cascada de permisos parent ↔ sub-modelo. Pregunta abierta explicita del doc fuente (11.6). HU-32.031 marcada `requires-clarification`.
- **Q32.7**: Definicion exacta de "fundamental" vs "procedural" enlaces para operacionalizar HU-32.026. Abierto explicito (11.7).
- **Q32.8**: Tras disconnect, los OPDs internos del sub-modelo (p.ej. `SD1: First Processing in-zoomed`) ¿se mantienen en el archivo sub-modelo como OPDs regulares? Probable si, sin confirmar. HU-32.029.
- **Q32.9**: Propagacion de valores computacionales cross-sub-modelo (ej. `Total Cost {tc}`). Diferida explicitamente al doc b1 (simulacion computacional).
- **Q32.10**: ¿Una misma cosa puede ser compartida en dos sub-modelos distintos del mismo parent? No confirmado. Afecta posibles HU futuras.
- **Q32.11**: Scope exacto del alias `{id}`: ¿propiedad del `cosaRef` scoped por modelo o propiedad global diferida? HU-32.014 marcada `requires-clarification`.
- **Q32.12**: Indicador visual exacto durante fetch en curso (spinner, pulsacion, estado transitorio del badge). HU-32.022 `requires-clarification`.
- **Q32.13**: Forma geometrica exacta del glifo flecha-izq + marco en la tab del parent. HU-32.010 `requires-clarification`.

## Referencias cruzadas

- Doc fuente: `opcloud-reverse/32-persistencia-sub-models.md` (todas las secciones §1–§12).
- Epicas que dependen de esta:
  - **EPICA-30** (save-load) — Load Modelo lista peers, save del sub-modelo es independiente.
  - **EPICA-31** (folders) — regla ferrea "mismo folder que el parent".
  - **EPICA-35** (move-search) — move en cascada.
  - **EPICA-40** (permisos) — permisionamiento por archivo peer.
  - **EPICA-50** (OPL pane) — emision de lineas `"The selected things... are refined in sub model"` y `"SDx.y is a view OPD, derived from SDx"`.
  - **EPICA-60** (export-pdf) — checkbox `Include Unloaded Sub-Modelos` con fetch.
  - **EPICA-B1** (simulation-computational) — computo cross-sub-modelo (diferida explicita).
  - **EPICA-20** (opd-tree) — nodo tipo nuevo con badge.
  - **EPICA-1C** (validaciones) — reglas minimas + bloqueos cruzados.
- Invariantes del repo afectados (presion kernel nueva, evaluar contra `docs/design/patron-dominios-funtor.md`):
  - identidad estable de cosa cross-archivo (UUID compartido entre dos `.opm`),
  - `cosa.affinityModelo: "native" | "shared"` como atributo persistente,
  - `modelo.subModelos[]` como lista de referencias a archivos peer,
  - `cosaRef.localAlias` como alias scoped por modelo,
  - numeracion `SDx.y` como **vista computada**, no ID.
- Convenciones visuales no cubiertas en SSOT (`ssot/opm-visual-es.md`) que la epica introduce y que deberian formalizarse si se adopta: atenuacion gris de cosas compartidas, badge verde/amarillo del arbol, glifo de composicion en tab.
