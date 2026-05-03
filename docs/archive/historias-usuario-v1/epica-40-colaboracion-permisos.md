---
epica: "EPICA-40"
titulo: "Colaboracion — permisos de modelo, token de edicion y auto-lectura desde carpeta"
doc_fuente: "opcloud-reverse/40-colaboracion-permisos.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "W"
hu_emitidas: 25
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "DIAGNOSTICO-PILOTO-EPICA-10.md"
---

## Resumen

Esta epica cubre la **gestion colaborativa de permisos a nivel de modelo individual** mas el atajo de lectura automatica desde la carpeta contenedora. Define quien puede leer, editar o administrar un modelo, como se reparte la autoria efectiva entre un unico `Propietario del Modelo` (llave), un unico `Editor Actual` (pluma) y multiples `Lectores`/`Escritores` no activos, y como el checkbox `Automatic Model Read Permission` de la carpeta se superpone sobre el ACL del modelo.

La feature vive en dos superficies:

- modal **Configuracion de Permisos del Modelo** (abierto desde el boton `share permissions` junto al nombre del modelo),
- checkbox **Automatic Model Read Permission** dentro de `Permisos de Carpeta` (overlap con EPICA-31).

Regla transversal **dura**: *"You cannot share model between organizations even if other modelers have a user in a different organization using OPCloud"*. El alcance de compartir es **intra-organizacion**.

Las HU de esta epica tienen prioridad predominante **W** (won't-have en el ciclo actual): colaboracion multi-usuario en vivo queda fuera del modelador core del repo segun §7 de la metodologia. Se inventarian igualmente para trazabilidad y para sembrar el diseno del kernel futuro (ACL, propietario, token de edicion). La SSOT OPM no regula la colaboracion; toda HU de esta epica es tipo `opcloud-ui`.

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-40.001 | Abrir modal Configuracion de Permisos del Modelo desde boton junto al nombre | AO | W | S | opcloud-ui | — |
| HU-40.002 | Ver cabecera Model/Organization en el modal de permisos | AO | W | XS | opcloud-ui | — |
| HU-40.003 | Ver lista de grupos expandibles con flecha de colapso | AO | W | S | opcloud-ui | — |
| HU-40.004 | Otorgar lectura a un grupo completo con un checkbox | AO | W | S | opcloud-ui | — |
| HU-40.005 | Expandir grupo para ver usuarios con formato Nombre Apellido (email) | AO | W | S | opcloud-ui | — |
| HU-40.006 | Otorgar lectura a un usuario individual con checkbox por fila | AO | W | S | opcloud-ui | — |
| HU-40.007 | Reconocer al Propietario del Modelo por icono llave con tooltip | AO | W | XS | opcloud-ui | — |
| HU-40.008 | Reconocer al Editor Actual por icono pluma | AO | W | XS | opcloud-ui | — |
| HU-40.009 | Persistir cambios con boton SAVE | AO | W | S | opcloud-ui | — |
| HU-40.010 | Descartar cambios con boton CLOSE sin toast | AO | W | XS | opcloud-ui | — |
| HU-40.011 | Ver toast Permissions successfully changed al guardar | AO | W | XS | opcloud-ui | — |
| HU-40.012 | Ver indicador (read only) junto al titulo cuando pierdo el token | CO | W | XS | opcloud-ui | — |
| HU-40.013 | Transferir token de edicion con doble clic sobre usuario | AO | W | M | opcloud-ui | — |
| HU-40.014 | Impedir asignar escritura sin lectura previa (regla dura) | AO | W | S | opcloud-ui | — |
| HU-40.015 | Impedir compartir modelo entre organizaciones (regla dura) | AO | W | S | opcloud-ui | — |
| HU-40.016 | Impedir quitar lectura al usuario que tiene el token de escritura | AO | W | S | opcloud-ui | — |
| HU-40.017 | Redirigir Save a Save As cuando el usuario tiene solo lectura | CO | W | S | opcloud-ui | — |
| HU-40.018 | Recuperar el token de edicion como Propietario con doble clic sobre si mismo | AO | W | S | opcloud-ui | — |
| HU-40.019 | Ceder el token de escritura desde Escritor a otro lector o al Propietario | CO | W | S | opcloud-ui | — |
| HU-40.020 | Impedir que Escritor no-Propietario quite el token a un tercero | CO | W | S | opcloud-ui | — |
| HU-40.021 | Activar Automatic Model Read Permission desde Permisos de Carpeta | AO | W | S | opcloud-ui | — |
| HU-40.022 | Ver tooltip del checkbox Automatic Model Read Permission | AO | W | XS | opcloud-ui | — |
| HU-40.023 | Calcular lectura efectiva como union ACL modelo + auto-lectura carpeta | AO | W | M | opcloud-ui | — |
| HU-40.024 | Tratar grupo raiz All Org Users como alias organizacional | AO | W | S | opcloud-ui | — |
| HU-40.025 | Preservar canvas pasivo tras modal de permisos (overlay puro) | AO | W | XS | opcloud-ui | — |

Total: **25 historias de usuario** (25 opcloud-ui).

## Historias de usuario

### HU-40.001 — Abrir modal Configuracion de Permisos del Modelo desde boton junto al nombre

**Actor primario:** AO (admin de organizacion / propietario del modelo).
**Actores secundarios:** CO (colaborador editor — si tambien es propietario en otro modelo).
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; C (config colaboracion) secundario.
**Superficie UI:** cabecera-canvas + boton `share permissions` + modal-model-permisos.
**Gesto canonico:** clic en el boton `share permissions` contiguo al nombre del modelo.

**Historia:**
> Como propietario de un modelo, quiero abrir un modal de permisos desde un boton pegado al nombre del modelo para administrar quien puede leer o editar sin salir del canvas.

**Contexto de negocio:**
El punto de entrada debe ser visualmente contiguo al artefacto que se comparte (el modelo, no la carpeta). Colocar el boton junto al nombre del modelo comunica "esto es lo que estas compartiendo". La transcripcion confirma: *"this is near the model name clicking on it will open the model permission setting"*.

**Criterios de aceptacion:**
- **Dado** que tengo un modelo cargado y soy su Propietario, **cuando** observo la cabecera del canvas, **entonces** veo un boton `share permissions` junto al nombre del modelo.
- **Dado** que el boton es visible, **cuando** hago clic, **entonces** se abre un modal centrado titulado `Model Permissions Setting` con el canvas intacto detras.
- **Dado** que el modal esta abierto, **cuando** miro el canvas, **entonces** no se altero su contenido (overlay puro).
- **Dado** que soy un usuario con solo lectura del modelo, **cuando** abro el modal, **entonces** **pregunta abierta (Q9)**: ¿el modal aparece en modo solo lectura o no se abre? — marcar como `requires-clarification`.

**Reglas y restricciones:**
- El boton es el unico activador canonico observado. No se documenta punto de entrada alternativo por main menu (Q4 del doc fuente).
- El modal es modal-overlay: bloquea interaccion con canvas hasta cerrar.

**Modelo de datos tocado:**
- Ninguno directo en apertura; lectura de `model.acl`, `model.owner_id`, `model.current_editor_id` para popular el modal.

**Dependencias:**
- Bloquea a: HU-40.002 (cabecera dentro del modal), HU-40.003 (lista de grupos).

**Integraciones:**
- Kernel de permisos (`model.acl`).
- Render del canvas no debe verse afectado.

**Notas de evidencia:**
- Fuente: `opcloud-reverse/40-colaboracion-permisos.md` §2 (tabla UI), §3.1 paso 1.
- Frames: frame_00005 (modal abierto).
- Transcripcion: *"this is near the model name clicking on it will open the model permission setting"*.
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [colaboracion, ui, modal, permisos, share].

---

### HU-40.002 — Ver cabecera Model/Organization en el modal de permisos

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** V (render informativo).
**Superficie UI:** modal-model-permisos (cabecera).
**Gesto canonico:** ninguno (render declarativo al abrir modal).

**Historia:**
> Como propietario, quiero ver en la cabecera del modal que modelo y que organizacion estoy configurando para no asignar permisos al modelo equivocado.

**Contexto de negocio:**
Al administrar multiples modelos, el contexto debe ser explicito. Mostrar `Model: <nombre>` y `Organization: <Org>` en la cabecera cumple doble funcion: desambiguacion y recordatorio de la regla dura "no cross-organization" (HU-40.015).

**Criterios de aceptacion:**
- **Dado** que el modal `Model Permissions Setting` esta abierto, **cuando** miro la parte superior, **entonces** veo a la izquierda `Model: <nombre del modelo>` y a la derecha `Organization: <nombre de la organizacion>`.
- **Dado** que el modelo se llama `Turbojet Engine System V1_3`, **cuando** abro el modal, **entonces** la cabecera muestra exactamente ese string.
- **Dado** que la organizacion es `MIT`, **cuando** miro la cabecera, **entonces** lee `Organization: MIT`.

**Reglas y restricciones:**
- La cabecera es estatica durante la sesion del modal (no se edita el nombre del modelo ni la organizacion desde aqui).

**Modelo de datos tocado:**
- Lectura: `model.name`, `model.organization_id → organization.name`.

**Dependencias:**
- Bloqueada por: HU-40.001.

**Integraciones:**
- Ninguna. Render puro.

**Notas de evidencia:**
- Fuente: §2 tabla UI (fila "Cabecera del modal").
- Frames: frame_00005.
- Clase de afirmacion: observado.

**Prioridad:** W.
**Tamano:** XS.
**Etiquetas:** [colaboracion, ui, modal, permisos, cabecera].

---

### HU-40.003 — Ver lista de grupos expandibles con flecha de colapso

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; V secundario.
**Superficie UI:** modal-model-permisos (cuerpo de grupos).
**Gesto canonico:** clic en flecha `↓`/`↑` de la fila de grupo.

**Historia:**
> Como propietario, quiero colapsar y expandir cada grupo del modal para navegar la lista sin saturarme con todos los usuarios a la vez.

**Contexto de negocio:**
Las organizaciones grandes tienen decenas de grupos y cientos de usuarios. Un arbol plano seria ilegible. El patron expandible por grupo permite trabajar por macro (grupo completo) o por detalle (usuarios individuales) segun la granularidad deseada.

**Criterios de aceptacion:**
- **Dado** que el modal esta abierto, **cuando** miro el cuerpo, **entonces** veo una lista vertical de grupos donde cada fila muestra el nombre del grupo, un checkbox y una flecha `↓` (colapsado) o `↑` (expandido).
- **Dado** que un grupo esta colapsado, **cuando** hago clic en su flecha, **entonces** se expande mostrando los usuarios miembros y la flecha cambia a `↑`.
- **Dado** que un grupo esta expandido, **cuando** hago clic en su flecha, **entonces** se colapsa ocultando a los usuarios y la flecha cambia a `↓`.
- **Dado** que el modal se abre por primera vez, **cuando** miro, **entonces** todos los grupos inician colapsados (default observado §5.1).

**Reglas y restricciones:**
- Ejemplo de grupos observados en MIT: `MIT All Users`, `MITsdm2019`, `16.887/EM.427-F19`, `PGM`, `PEARL`, `16.842-2019A`, `CATSYS`, `MITsdm2020`, `AeroAstrp-ESL`, `AeroAstro`, `IAP OPM Workshop 2021`, `MITsdm2021`, `16.887/EM.427-F21`.
- Anidamiento de subgrupos: inferido pero no expandido en los frames muestreados.

**Modelo de datos tocado:**
- Lectura: `organization.groups[]`, `group.members[]`.
- Estado UI transitorio: `ui.expanded_groups` (local al modal, no persistente).

**Dependencias:**
- Bloqueada por: HU-40.001.
- Bloquea a: HU-40.005 (usuarios aparecen al expandir).

**Integraciones:**
- Ninguna fuera del modal.

**Notas de evidencia:**
- Fuente: §2 tabla UI (fila "Lista de grupos"), §3.2 paso 1.
- Frames: frame_00005 (colapsados), frame_00013 / frame_00016 (expandidos).
- Clase de afirmacion: observado.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [colaboracion, ui, modal, permisos, grupos, expandible].

---

### HU-40.004 — Otorgar lectura a un grupo completo con un checkbox

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario (ACL sobre principal=grupo); U secundario.
**Superficie UI:** modal-model-permisos (checkbox de fila de grupo).
**Gesto canonico:** clic en checkbox del grupo + SAVE.

**Historia:**
> Como propietario, quiero marcar un checkbox en la fila de un grupo para otorgar lectura a todos sus miembros de una sola accion.

**Contexto de negocio:**
Asignar permisos grupo-por-grupo es la heuristica recomendada por manejabilidad (analogo a Intro 24 de folders). Un solo gesto propaga lectura a N usuarios; las altas y bajas del grupo se reflejan automaticamente sin recalibrar el modelo.

**Criterios de aceptacion:**
- **Dado** que el modal esta abierto y un grupo esta listado, **cuando** marco su checkbox, **entonces** el estado del checkbox pasa a ON.
- **Dado** que marque el checkbox de un grupo y pulso `SAVE`, **cuando** el modal se cierra, **entonces** `(group_id, read) ∈ model.acl`.
- **Dado** que `(group_id, read) ∈ model.acl`, **cuando** un usuario `u` pertenece a ese grupo, **entonces** `read(u, M)` resuelve true por pertenencia de grupo (ver HU-40.023 para la formula).
- **Dado** que un usuario `u` entra al grupo despues de haber asignado permiso, **cuando** intenta abrir el modelo, **entonces** obtiene lectura automaticamente (calculo en tiempo de acceso).

**Reglas y restricciones:**
- La asignacion es por **principal = grupo**; no se duplica fila por fila en usuarios individuales.
- El checkbox de grupo es independiente del checkbox de cada usuario (un usuario puede estar con lectura individual y grupal simultaneamente).

**Modelo de datos tocado:**
- `model.acl` — lista de `(principal, permission_type)` — persistente. `principal = group_id`, `permission_type = "read"`.

**Dependencias:**
- Bloqueada por: HU-40.003 (grupo visible), HU-40.009 (SAVE).

**Integraciones:**
- Calculo efectivo de lectura (HU-40.023).

**Notas de evidencia:**
- Fuente: §3.1 pasos 3–5.
- Frames: frame_00005 (grupo `PGM` marcado).
- Transcripcion: *"you can either select entire group which will give a read permission to everyone inside that group"*.
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [colaboracion, permisos, grupos, acl, kernel].

---

### HU-40.005 — Expandir grupo para ver usuarios con formato Nombre Apellido (email)

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** V.
**Superficie UI:** modal-model-permisos (lista de usuarios bajo grupo expandido).
**Gesto canonico:** ninguno (render al expandir el grupo).

**Historia:**
> Como propietario, quiero ver los usuarios de un grupo expandido con su nombre completo y email entre parentesis para desambiguar homonimos antes de asignar.

**Contexto de negocio:**
En organizaciones grandes hay homonimos. Mostrar el email entre parentesis resuelve la ambiguedad sin anadir columna extra ni diseno pesado. El formato `Nombre Apellido (email@dominio)` es convencion observada.

**Criterios de aceptacion:**
- **Dado** que un grupo esta expandido, **cuando** miro sus miembros, **entonces** cada fila muestra `<Nombre> <Apellido> (<email>)` y un checkbox.
- **Dado** que un usuario se llama `Dov Dori` con email `dori@mit.edu`, **cuando** lo veo en la lista, **entonces** el texto es exactamente `Dov Dori (dori@mit.edu)`.
- **Dado** que la lista es larga, **cuando** miro el orden, **entonces** los usuarios estan ordenados alfabeticamente por nombre.
- **Dado** que un usuario tiene email de otro dominio (p.ej. `hanank@technion.ac.il.mit`), **cuando** lo veo, **entonces** se muestra con su dominio real sin normalizar.

**Reglas y restricciones:**
- El email sirve como desambiguador; no es editable desde este modal.
- Orden alfabetico por primer nombre (convencion observada frames 00013/00016).
- Dominios mixtos posibles dentro de una misma organizacion (caso observado: `@mit.edu` y `@technion.ac.il.mit`).

**Modelo de datos tocado:**
- Lectura: `user.full_name`, `user.email`.

**Dependencias:**
- Bloqueada por: HU-40.003.
- Bloquea a: HU-40.006 (checkbox por usuario), HU-40.013 (doble clic sobre usuario).

**Integraciones:**
- Directorio de usuarios.

**Notas de evidencia:**
- Fuente: §2 tabla UI (fila "Usuarios dentro de grupo"), §3.2 paso 2, §9 (convencion email).
- Frames: frame_00013, frame_00016.
- Clase de afirmacion: observado.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [colaboracion, ui, modal, usuarios, formato, email].

---

### HU-40.006 — Otorgar lectura a un usuario individual con checkbox por fila

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario; U secundario.
**Superficie UI:** modal-model-permisos (checkbox por usuario).
**Gesto canonico:** clic en checkbox de fila de usuario + SAVE.

**Historia:**
> Como propietario, quiero marcar el checkbox de un usuario individual para otorgarle lectura sin afectar al grupo completo.

**Contexto de negocio:**
A veces el permiso debe ser excepcion individual (un colaborador externo, un estudiante puntual). Tener el checkbox independiente del grupo permite granularidad sin obligar a crear grupos ad-hoc.

**Criterios de aceptacion:**
- **Dado** que un grupo esta expandido, **cuando** marco el checkbox de un usuario, **entonces** el estado pasa a ON solo para esa fila.
- **Dado** que marque el usuario y pulso `SAVE`, **cuando** el modal se cierra, **entonces** `(user_id, read) ∈ model.acl`.
- **Dado** que el usuario ya tenia lectura por herencia de grupo, **cuando** marco tambien su checkbox individual, **entonces** ambas entradas coexisten; quitar solo la grupal preserva la individual.
- **Dado** que desmarco un usuario que tenia lectura individual, **cuando** pulso `SAVE`, **entonces** `(user_id, read)` se elimina de `model.acl`.

**Reglas y restricciones:**
- El checkbox individual es independiente del grupo.
- La union es con OR (ver HU-40.023 para la formula completa de calculo efectivo).

**Modelo de datos tocado:**
- `model.acl` — entradas `(user_id, "read")` — persistente.

**Dependencias:**
- Bloqueada por: HU-40.005, HU-40.009.

**Integraciones:**
- Calculo efectivo (HU-40.023).

**Notas de evidencia:**
- Fuente: §3.2 pasos 2–4.
- Frames: frame_00013 (`George Lordos` marcado).
- Transcripcion: *"or select a specific user"*.
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [colaboracion, permisos, usuarios, acl, kernel].

---

### HU-40.007 — Reconocer al Propietario del Modelo por icono llave con tooltip

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** V.
**Superficie UI:** modal-model-permisos (indicador junto a usuario propietario).
**Gesto canonico:** hover para tooltip.

**Historia:**
> Como propietario, quiero ver un icono de llave junto al nombre del usuario Propietario para identificarlo de inmediato, incluso si la lista es larga.

**Contexto de negocio:**
El Propietario es un rol ontologico (crea/posee el modelo) que persiste aunque no tenga el token de escritura. El icono llave es la pista visual canonica; el tooltip `Model Owner` lo verbaliza para usuarios que lo ven por primera vez.

**Criterios de aceptacion:**
- **Dado** que un grupo esta expandido y contiene al Propietario del modelo, **cuando** miro la fila, **entonces** veo un icono de llave junto al nombre.
- **Dado** que hago hover sobre el icono llave, **cuando** aparece el tooltip, **entonces** lee `Model Owner`.
- **Dado** que el Propietario es un usuario, **cuando** miro toda la lista, **entonces** solo una fila tiene icono llave (Propietario unico por modelo).

**Reglas y restricciones:**
- Un modelo tiene **un solo Propietario** (§5.3).
- El icono llave es indicador visual, no un control: no se edita el Propietario desde este modal (Q1 del doc fuente).

**Modelo de datos tocado:**
- Lectura: `model.owner_id`.

**Dependencias:**
- Bloqueada por: HU-40.005.

**Integraciones:**
- Ninguna de escritura.

**Notas de evidencia:**
- Fuente: §2 tabla UI (fila "Icono llave"), §5.3 (tabla de roles).
- Frames: frame_00010 (tooltip `Model Owner` sobre `Hanan Kohen`).
- Clase de afirmacion: observado + tooltip textual confirmado.

**Prioridad:** W.
**Tamano:** XS.
**Etiquetas:** [colaboracion, ui, propietario, icono, tooltip, llave].

---

### HU-40.008 — Reconocer al Editor Actual por icono pluma

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** V.
**Superficie UI:** modal-model-permisos (indicador junto al usuario con token).
**Gesto canonico:** ninguno (render declarativo).

**Historia:**
> Como propietario o colaborador, quiero ver un icono de pluma junto al Editor Actual para saber quien tiene el token de escritura ahora mismo.

**Contexto de negocio:**
El token de edicion es unico a nivel modelo. Distinguir "quien edita ahora" (pluma) de "quien es el dueno" (llave) evita confusion entre propiedad ontologica y autoria momentanea.

**Criterios de aceptacion:**
- **Dado** que el modal esta abierto, **cuando** miro la lista expandida, **entonces** solo un usuario tiene icono de pluma.
- **Dado** que el Propietario aun conserva el token, **cuando** miro su fila, **entonces** tiene tanto llave como pluma.
- **Dado** que el token se transfirio a otro usuario (ver HU-40.013), **cuando** abro el modal, **entonces** el Propietario conserva la llave pero la pluma esta junto al nuevo editor.
- **Dado** que ningun usuario muestra pluma, **cuando** intento cerrar el modal, **entonces** **pregunta abierta (Q2)**: ¿es posible que ningun usuario tenga el token? (sesion cerrada, expiracion, etc.)

**Reglas y restricciones:**
- Un modelo tiene **un solo Editor Actual** activo (§5.3).
- Pluma y llave son iconos independientes; pueden coexistir (Propietario + Editor en mismo usuario).

**Modelo de datos tocado:**
- Lectura: `model.current_editor_id`.

**Dependencias:**
- Bloqueada por: HU-40.005.

**Integraciones:**
- Ninguna de escritura desde este render.

**Notas de evidencia:**
- Fuente: §2 tabla UI (fila "Icono pluma"), §5.3.
- Frames: frame_00010 (Propietario con llave+pluma), frame_00016 (Dov Dori con pluma tras transferencia).
- Clase de afirmacion: observado.

**Prioridad:** W.
**Tamano:** XS.
**Etiquetas:** [colaboracion, ui, editor, icono, token, pluma].

---

### HU-40.009 — Persistir cambios con boton SAVE

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** P primario (persistencia); K (muta ACL).
**Superficie UI:** modal-model-permisos (barra inferior).
**Gesto canonico:** clic en boton `SAVE`.

**Historia:**
> Como propietario, quiero pulsar SAVE para persistir todos mis cambios de permisos de una sola vez, evitando escrituras parciales durante la edicion.

**Contexto de negocio:**
La edicion de permisos se acumula en el modal como cambios pendientes. `SAVE` es el commit atomico: antes no hay efecto, despues todos los cambios son visibles. Esta semantica permite cancelar (CLOSE) sin consecuencias y evita estados intermedios inconsistentes.

**Criterios de aceptacion:**
- **Dado** que hice una o mas modificaciones (check/uncheck, doble clic de transferencia), **cuando** pulso `SAVE`, **entonces** todos los cambios se persisten en una sola transaccion.
- **Dado** que no hice cambios, **cuando** pulso `SAVE`, **entonces** el modal se cierra sin tocar `model.acl`.
- **Dado** que `SAVE` fallo por error de servidor, **cuando** recibo feedback, **entonces** **pregunta abierta**: no hay mensaje de error observado en los frames; asumir rollback silencioso y reintento manual.
- **Dado** que `SAVE` tuvo exito, **cuando** el modal se cierra, **entonces** aparece el toast `Permissions successfully changed.` (HU-40.011).

**Reglas y restricciones:**
- Transaccion atomica: commit all-or-nothing.
- Sin `SAVE`, nada se persiste (confirmado por transcripcion: *"I must click save to take effect"*).

**Modelo de datos tocado:**
- `model.acl` — escrita en batch.
- `model.current_editor_id` — escrito si hubo transferencia de token.

**Dependencias:**
- Bloqueada por: HU-40.001.
- Bloquea a: HU-40.011 (toast), HU-40.013 (efecto de transferencia).

**Integraciones:**
- Backend de permisos (fuera del alcance del modelador core del repo).

**Notas de evidencia:**
- Fuente: §2 tabla UI, §3.1 paso 5, §3.3 paso 6.
- Frames: frame_00023 (toast post-SAVE).
- Transcripcion: *"I must click save to take effect"*.
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [colaboracion, modal, permisos, persistencia, save].

---

### HU-40.010 — Descartar cambios con boton CLOSE sin toast

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** modal-model-permisos (barra inferior).
**Gesto canonico:** clic en boton `CLOSE`.

**Historia:**
> Como propietario, quiero cerrar el modal con CLOSE para descartar cambios en curso sin afectar los permisos actuales.

**Contexto de negocio:**
Un escape sin consecuencias es requisito basico de UX para cualquier modal de edicion destructiva. `CLOSE` es la via oficial de cancelacion.

**Criterios de aceptacion:**
- **Dado** que hice cambios en el modal, **cuando** pulso `CLOSE`, **entonces** el modal se cierra sin persistir nada y `model.acl` queda como estaba al abrir.
- **Dado** que pulso `CLOSE`, **cuando** el modal se cierra, **entonces** NO aparece toast de confirmacion.
- **Dado** que no hice cambios, **cuando** pulso `CLOSE`, **entonces** cierra limpio como si hubiera sido `SAVE` sin-deltas pero tambien sin toast.
- **Dado** que hice cambios y pulso `CLOSE`, **cuando** reabro el modal, **entonces** los cambios descartados no estan presentes.

**Reglas y restricciones:**
- `CLOSE` **descarta silenciosamente** (§4.4). No hay dialogo "¿descartar cambios?".
- No hay diff ni rollback explicito.

**Modelo de datos tocado:**
- Ninguno (descarta estado transitorio del modal).

**Dependencias:**
- Bloqueada por: HU-40.001.

**Integraciones:**
- Ninguna.

**Notas de evidencia:**
- Fuente: §2 tabla UI (barra inferior), §4.4.
- Clase de afirmacion: observado (boton visible) + inferido (descarte silencioso sin confirmacion).

**Prioridad:** W.
**Tamano:** XS.
**Etiquetas:** [colaboracion, modal, permisos, cancelar, close].

---

### HU-40.011 — Ver toast Permissions successfully changed al guardar

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** V.
**Superficie UI:** esquina-superior-derecha-canvas (toast global).
**Gesto canonico:** ninguno (post-SAVE automatico).

**Historia:**
> Como propietario, quiero ver un toast de confirmacion despues de guardar permisos para tener feedback explicito de que el commit persistio.

**Contexto de negocio:**
La operacion de permisos es de alto impacto (otorga/revoca capacidad a terceros). Un feedback explicito reduce la incertidumbre del propietario. La posicion esquina superior derecha es consistente con el resto de confirmaciones de OPCloud (§9).

**Criterios de aceptacion:**
- **Dado** que pulse `SAVE` con al menos un cambio, **cuando** la transaccion termina, **entonces** aparece un toast con texto `Permissions successfully changed.` en la esquina superior derecha del canvas.
- **Dado** que el toast esta visible, **cuando** pasa el tiempo de display (tipico 3–5s), **entonces** se oculta automaticamente.
- **Dado** que `SAVE` fue sin cambios, **cuando** el modal cierra, **entonces** **pregunta abierta**: ¿aparece toast igualmente o solo con deltas? (no observado).

**Reglas y restricciones:**
- Texto exacto: `Permissions successfully changed.` (con punto final).
- Posicion: esquina superior derecha del canvas.

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-40.009.

**Integraciones:**
- Sistema de toasts global.

**Notas de evidencia:**
- Fuente: §2 tabla UI, §4.4, §9 (posicion).
- Frames: frame_00023.
- Clase de afirmacion: observado.

**Prioridad:** W.
**Tamano:** XS.
**Etiquetas:** [colaboracion, ui, toast, feedback, confirmacion].

---

### HU-40.012 — Ver indicador (read only) junto al titulo cuando pierdo el token

**Actor primario:** CO (colaborador — ex-editor que perdio token).
**Actores secundarios:** AO (propietario que transfirio el token).
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; L secundario.
**Superficie UI:** tab-superior + arbol-opd (etiqueta/tooltip junto al titulo).
**Gesto canonico:** ninguno (render declarativo).

**Historia:**
> Como colaborador que perdio el token de escritura, quiero ver un indicador `(read only)` junto al nombre del modelo para entender sin ambiguedad que ya no puedo editar.

**Contexto de negocio:**
Cuando el token pasa a otro usuario, todo intento de edicion debe bloquearse — pero el usuario no deberia descubrirlo al intentar editar y fallar. El indicador `(read only)` en el titulo es el canal proactivo que comunica el nuevo contexto editorial.

**Criterios de aceptacion:**
- **Dado** que perdi el token de edicion tras una transferencia, **cuando** miro el tab/titulo del modelo, **entonces** junto al nombre aparece la etiqueta `(read only)` (p.ej. `Turbojet Engine System V1_3 (read only)`).
- **Dado** que vuelvo a tener el token, **cuando** miro el tab, **entonces** el sufijo `(read only)` desaparece.
- **Dado** que nunca tuve el token (soy solo lector), **cuando** miro el tab, **entonces** tambien veo `(read only)`.
- **Dado** que estoy en modo solo lectura, **cuando** intento editar cosas del canvas, **entonces** los gestos de edicion estan deshabilitados o redirigen a `Save As` (ver HU-40.017).

**Reglas y restricciones:**
- El indicador es derivacion directa de `write(u, M)` — si es false, se muestra.
- **Pregunta abierta (Q10)**: ¿es tooltip al hover, badge permanente o ambos? En frame_00018 parece tooltip.

**Modelo de datos tocado:**
- Lectura: `model.current_editor_id`, ACL.
- Calculo: `write(u, M)` derivado (HU-40.023).

**Dependencias:**
- Bloqueada por: HU-40.013 (transferencia que detona la perdida).

**Integraciones:**
- Arbol OPD, tab superior, renderer del canvas (bloqueo de gestos).

**Notas de evidencia:**
- Fuente: §2 tabla UI (fila "Indicador read only"), §3.3 paso 7, §7.2.
- Frames: frame_00018.
- Clase de afirmacion: observado.
- Etiqueta: `requires-clarification` por Q10.

**Prioridad:** W.
**Tamano:** XS.
**Etiquetas:** [colaboracion, ui, tab, solo-lectura, indicador, requires-clarification].

---

### HU-40.013 — Transferir token de edicion con doble clic sobre usuario

**Actor primario:** AO (propietario con token).
**Actores secundarios:** CO (receptor del token).
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario (muta `model.current_editor_id`); U secundario.
**Superficie UI:** modal-model-permisos (fila de usuario).
**Gesto canonico:** doble clic sobre el nombre del usuario destinatario + `SAVE`.

**Historia:**
> Como propietario, quiero transferir el token de edicion a otro colaborador con doble clic sobre su nombre para delegar autoria activa sin dejar de ser Propietario.

**Contexto de negocio:**
La colaboracion en OPCloud usa un **token unico** de escritura en lugar de concurrencia multi-usuario. Transferir el token es el gesto critico de la feature: cambia quien puede editar ahora mismo. El doble clic es la unica gestura no trivial de la epica; su eleccion (vs boton explicito) privilegia la compactacion visual del modal.

**Criterios de aceptacion:**
- **Dado** que un usuario `U` tiene lectura marcada (condicion dura — HU-40.014), **cuando** hago doble clic sobre su nombre, **entonces** el icono pluma aparece junto a `U` en el modal.
- **Dado** que hice doble clic, **cuando** el cambio aun no fue persistido, **entonces** aparece feedback inmediato (icono) pero `SAVE` sigue siendo obligatorio.
- **Dado** que pulso `SAVE` tras la transferencia, **cuando** el modal cierra, **entonces** `model.current_editor_id = U.id`, el toast HU-40.011 aparece, y el Propietario pasa a ver `(read only)` (HU-40.012).
- **Dado** que intento hacer doble clic sobre un usuario sin lectura marcada, **cuando** ocurre el gesto, **entonces** **no se transfiere** y la UI debe feedback (HU-40.014).
- **Dado** que el narrador reporto un toast tipo `Dov Dori Is now the current model editor`, **cuando** ocurre la transferencia en el modal, **entonces** **hipotesis**: se emite un feedback inline del modal (no capturado en los 25 frames, inferido de la narracion).

**Reglas y restricciones:**
- Doble clic es el gesto unico; no hay boton explicito "Transfer token".
- Sin `SAVE` no hay efecto (coherente con HU-40.009).
- Un token unico activo por modelo en todo momento (§5.3).

**Modelo de datos tocado:**
- `model.current_editor_id` — user_id — persistente.

**Dependencias:**
- Bloqueada por: HU-40.005 (usuario visible), HU-40.014 (lectura previa requerida), HU-40.009 (SAVE).
- Bloquea a: HU-40.012 (indicador solo lectura), HU-40.018 (recuperar token), HU-40.019 (ceder token).

**Integraciones:**
- Kernel de permisos.
- Canvas/tab (indicador solo lectura).
- Sistema de toasts (si confirma el editor switch — hipotesis).

**Notas de evidencia:**
- Fuente: §3.3 (secuencia completa), §8 (shortcuts).
- Frames: frame_00010 (Propietario con pluma), frame_00016 (Dov Dori con pluma tras transferencia), frame_00018 (solo lectura post-save).
- Transcripcion: *"I must click save to take effect"*.
- Clase de afirmacion: observado + confirmado (mecanica doble clic + SAVE).

**Prioridad:** W.
**Tamano:** M.
**Etiquetas:** [colaboracion, kernel, token, doble-clic, editor, transferencia].

---

### HU-40.014 — Impedir asignar escritura sin lectura previa (regla dura)

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** K (regla del kernel de permisos).
**Superficie UI:** modal-model-permisos (bloqueo UI).
**Gesto canonico:** ninguno (validacion automatica al gesto de transferencia).

**Historia:**
> Como propietario, quiero que el sistema impida otorgar escritura a un usuario que no tenga lectura previa para mantener la consistencia del modelo de permisos.

**Contexto de negocio:**
La regla es dura y ontologica: escritura sin lectura carece de sentido (no podrias siquiera ver lo que editas). La transcripcion la confirma: *"a person cannot have writing permission without reading permission"*.

**Criterios de aceptacion:**
- **Dado** que un usuario `U` **no** tiene su checkbox de lectura marcado, **cuando** intento transferirle el token con doble clic (HU-40.013), **entonces** la transferencia se rechaza sin efecto.
- **Dado** que se rechazo el gesto, **cuando** ocurre, **entonces** **pregunta abierta**: ¿se muestra mensaje inline, tooltip o simplemente no pasa nada? (no observado explicitamente).
- **Dado** que marco primero el checkbox de lectura de `U` y luego hago doble clic, **cuando** el orden es correcto, **entonces** la transferencia se acepta.
- **Dado** que un usuario tiene lectura por pertenencia a grupo pero sin checkbox individual, **cuando** intento transferir el token, **entonces** **pregunta abierta**: ¿la pertenencia grupal basta para satisfacer la condicion "tiene lectura"? (hipotesis: si, segun la formula HU-40.023).

**Reglas y restricciones:**
- Invariante: `write(u, M) ⇒ read(u, M)` (implicacion dura).
- La UI debe prevenir el gesto; el validador del kernel debe reforzarla incluso si la UI falla (defense in depth).

**Modelo de datos tocado:**
- Ninguno (validacion).

**Dependencias:**
- Bloqueada por: HU-40.013.

**Integraciones:**
- Validador del kernel de permisos.

**Notas de evidencia:**
- Fuente: §4.1 tabla (fila "Dar escritura sin lectura previa").
- Transcripcion: *"a person cannot have writing permission without reading permission"*.
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [colaboracion, kernel, validacion, acl, regla-dura].

---

### HU-40.015 — Impedir compartir modelo entre organizaciones (regla dura)

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** K.
**Superficie UI:** modal-model-permisos (filtrado de lista).
**Gesto canonico:** ninguno (filtrado estructural).

**Historia:**
> Como propietario, quiero que solo vea usuarios y grupos de mi organizacion en el modal para no poder compartir accidentalmente con una organizacion distinta.

**Contexto de negocio:**
La regla es transversal a toda la feature: el ambito de compartir es **intra-organizacion**. Aunque un modeler tenga cuenta OPCloud en otra org, no puede aparecer en el modal de permisos de mi modelo. La restriccion es estructural, no contingente.

**Criterios de aceptacion:**
- **Dado** que el modelo pertenece a la organizacion `Org_A`, **cuando** abro el modal, **entonces** la cabecera muestra `Organization: Org_A` y la lista de grupos solo contiene grupos de `Org_A`.
- **Dado** que un usuario `U` pertenece solo a `Org_B`, **cuando** busco `U` en el modal de mi modelo en `Org_A`, **entonces** `U` NO aparece en ningun grupo.
- **Dado** que un usuario tiene cuentas en multiples organizaciones, **cuando** aparece en el modal, **entonces** aparece solo como miembro de los grupos de `Org_A`.
- **Dado** que intentase manipular el backend para asignar `(user_id_Org_B, read) ∈ model.acl_Org_A`, **cuando** el kernel valida, **entonces** el intento se rechaza.

**Reglas y restricciones:**
- Invariante: `principal ∈ acl(M) ⇒ principal.organization_id = M.organization_id`.
- No hay UI de override. Aun admin de la organizacion no puede saltarsela desde este modal (Q3).

**Modelo de datos tocado:**
- Ninguno mutado (validacion).

**Dependencias:**
- Bloqueada por: HU-40.002.

**Integraciones:**
- Validador del kernel de permisos.

**Notas de evidencia:**
- Fuente: §1 regla transversal, §4.1 tabla (fila "Compartir con usuario de otra organizacion").
- Transcripcion: *"You cannot share model between organizations even if other modelers have a user in a different organization using OPCloud"*.
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [colaboracion, kernel, validacion, organizaciones, regla-dura].

---

### HU-40.016 — Impedir quitar lectura al usuario que tiene el token de escritura

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** K.
**Superficie UI:** modal-model-permisos (checkbox de lectura).
**Gesto canonico:** ninguno (bloqueo UI).

**Historia:**
> Como propietario, quiero que el sistema impida desmarcar la lectura del usuario que tiene el token de edicion actual, para evitar estados inconsistentes.

**Contexto de negocio:**
Si se pudiera quitar la lectura al Editor Actual, se violaria la invariante `write ⇒ read` (HU-40.014). OPCloud fuerza al propietario a revocar primero el token (doble clic para recuperar o ceder) antes de poder desmarcar la lectura.

**Criterios de aceptacion:**
- **Dado** que el usuario `U` tiene el token de edicion (pluma) y lectura marcada, **cuando** intento desmarcar su checkbox de lectura, **entonces** la UI rechaza el cambio.
- **Dado** que la UI rechazo, **cuando** ocurre, **entonces** el checkbox se muestra como solo lectura o aparece mensaje `the read permission is now read-only i cannot remove it`.
- **Dado** que primero recupero el token (HU-40.018) o lo cedo a otro (HU-40.019), **cuando** `U` ya no es Editor Actual, **entonces** puedo desmarcar su lectura.
- **Dado** que salto la UI (manipulacion backend), **cuando** el kernel valida, **entonces** rechaza la escritura.

**Reglas y restricciones:**
- Invariante local: `u = current_editor_id ⇒ (u, read) ∈ acl(M)`.
- La UI debe prevenir; el kernel debe reforzar.

**Modelo de datos tocado:**
- Ninguno mutado.

**Dependencias:**
- Bloqueada por: HU-40.006, HU-40.013.

**Integraciones:**
- Validador del kernel.

**Notas de evidencia:**
- Fuente: §4.1 tabla (fila "Quitar lectura a un usuario que tiene el token de escritura").
- Transcripcion: *"the read permission is now read-only i cannot remove it"*.
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [colaboracion, kernel, validacion, solo-lectura-forzado, token].

---

### HU-40.017 — Redirigir Save a Save As cuando el usuario tiene solo lectura

**Actor primario:** CO (colaborador con solo lectura).
**Actores secundarios:** RV (revisor que decide bifurcar).
**Tipo:** opcloud-ui.
**Nivel categorico:** P primario (persistencia); K secundaria (dueno cambia a `u`).
**Superficie UI:** menu-save + modal-save-as.
**Gesto canonico:** clic en `Save` (o `Ctrl+S`) en un modelo solo lectura.

**Historia:**
> Como colaborador con solo lectura, quiero que `Save` se redirija automaticamente a `Save As` para poder conservar una copia propia sin perder mi trabajo.

**Contexto de negocio:**
La lectura se convierte asi en un **canal legitimo de bifurcacion controlada**. El usuario que explora un modelo compartido puede bifurcar legalmente sin violar los permisos originales. La transcripcion lo confirma: *"if I have a read permission and I will click on the save it will automatically will open the save as and I can save the model and to be as my own"*.

**Criterios de aceptacion:**
- **Dado** que tengo solo lectura del modelo `M`, **cuando** activo `Save` (menu o shortcut), **entonces** se abre el modal `Save As` (EPICA-30/31) en lugar de guardar sobre `M`.
- **Dado** que el modal `Save As` esta abierto, **cuando** completo nombre y destino, **entonces** se crea un nuevo modelo `M'` con `M'.owner_id = u.id` y `M'.current_editor_id = u.id`.
- **Dado** que guarde `M'`, **cuando** miro, **entonces** el modelo `M` original no fue modificado.
- **Dado** que `u` no tiene permisos de escritura en ninguna carpeta donde podria salvar, **cuando** abre `Save As`, **entonces** **pregunta abierta**: ¿ve solo carpetas validas o ve error? (delegado a EPICA-31).

**Reglas y restricciones:**
- La redireccion es automatica; el usuario no elige `Save` vs `Save As`.
- El modelo original queda intacto.
- `M'` hereda contenido de `M` pero no los permisos ni el propietario.

**Modelo de datos tocado:**
- Creacion de nuevo registro `model` con `owner_id = u.id`.

**Dependencias:**
- Bloqueada por: HU-40.012 (usuario ya sabe que esta en solo lectura).
- Relaciona: EPICA-30 (Save/Load), EPICA-31 (permisos de carpeta para destino).

**Integraciones:**
- Subsistema Save/Save As.

**Notas de evidencia:**
- Fuente: §4.3.
- Transcripcion: *"if I have a read permission and I will click on the save it will automatically will open the save as and I can save the model and to be as my own"*.
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [colaboracion, persistencia, save-as, solo-lectura, bifurcacion].

---

### HU-40.018 — Recuperar el token de edicion como Propietario con doble clic sobre si mismo

**Actor primario:** AO (Propietario).
**Tipo:** opcloud-ui.
**Nivel categorico:** K.
**Superficie UI:** modal-model-permisos (fila del propio Propietario).
**Gesto canonico:** doble clic sobre el propio nombre + `SAVE`.

**Historia:**
> Como Propietario, quiero recuperar el token de edicion con doble clic sobre mi propio nombre para retomar autoria activa cuando la necesite, incluso si otro usuario lo tenia.

**Contexto de negocio:**
El Propietario conserva una capacidad asimetrica respecto al resto: **puede** tomarse el token a voluntad. Esto evita bloqueos donde el Editor Actual desaparece o abandona el modelo sin ceder el token. La transcripcion confirma que el Propietario puede identificar su propia fila por el icono llave: *"it's easy with the key"*.

**Criterios de aceptacion:**
- **Dado** que soy el Propietario y otro usuario `U` tiene el token, **cuando** abro el modal y hago doble clic sobre mi propio nombre (fila con llave), **entonces** el icono pluma se mueve de `U` a mi.
- **Dado** que hice la recuperacion, **cuando** pulso `SAVE`, **entonces** `model.current_editor_id = owner_id`.
- **Dado** que no soy Propietario sino Escritor no-Propietario, **cuando** intento "recuperar" el token desde otro Escritor, **entonces** la operacion se rechaza (cubierto por HU-40.020).
- **Dado** que el Propietario recupera el token, **cuando** `U` abre el modelo, **entonces** `U` ve `(read only)` (HU-40.012).

**Reglas y restricciones:**
- Asimetria propietario vs escritor: solo el Propietario puede tomar el token a voluntad (§3.4).
- La recuperacion requiere `SAVE` como cualquier otro cambio.

**Modelo de datos tocado:**
- `model.current_editor_id` — user_id — persistente.

**Dependencias:**
- Bloqueada por: HU-40.007 (Propietario visible), HU-40.013 (mecanica de doble clic), HU-40.009.

**Integraciones:**
- Kernel de permisos.

**Notas de evidencia:**
- Fuente: §3.4 (secuencia completa).
- Transcripcion: *"a modeler that got the write permission can pass it on to other modeler who already have a read permission or to give it back, but he cannot take it from another modeler who already has the write permission"*.
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [colaboracion, kernel, token, propietario, recuperar, asimetria].

---

### HU-40.019 — Ceder el token de escritura desde Escritor a otro lector o al Propietario

**Actor primario:** CO (Escritor no-Propietario que cede).
**Actores secundarios:** AO, otros CO (receptores).
**Tipo:** opcloud-ui.
**Nivel categorico:** K.
**Superficie UI:** modal-model-permisos.
**Gesto canonico:** doble clic sobre usuario destinatario + `SAVE`.

**Historia:**
> Como Escritor no-Propietario con el token activo, quiero ceder el token a otro lector o devolverselo al Propietario para liberar la autoria sin tener que cerrar el modelo.

**Contexto de negocio:**
Completar la matriz de transiciones del token: el escritor activo puede pasar la pluma a cualquier otro usuario con lectura previa (incluido el Propietario). Esto permite colaboracion secuencial sin depender siempre del Propietario.

**Criterios de aceptacion:**
- **Dado** que soy Escritor no-Propietario con token activo, **cuando** abro el modal y hago doble clic sobre otro usuario `V` con lectura marcada, **entonces** el icono pluma se mueve a `V`.
- **Dado** que hice el cambio y pulso `SAVE`, **cuando** persiste, **entonces** `model.current_editor_id = V.id` y yo paso a `(read only)`.
- **Dado** que hago doble clic sobre el Propietario, **cuando** cedo, **entonces** el Propietario recupera el token por via Escritor (caso especial de este flujo).
- **Dado** que hago doble clic sobre un usuario sin lectura, **cuando** intento ceder, **entonces** se rechaza (HU-40.014).

**Reglas y restricciones:**
- Direccion permitida para Escritor no-Propietario: ceder a cualquier usuario con lectura.
- Direccion prohibida para Escritor no-Propietario: tomar el token de otro Escritor (HU-40.020).

**Modelo de datos tocado:**
- `model.current_editor_id`.

**Dependencias:**
- Bloqueada por: HU-40.013.

**Integraciones:**
- Kernel.

**Notas de evidencia:**
- Fuente: §3.4.
- Transcripcion: *"a modeler that got the write permission can pass it on to other modeler who already have a read permission or to give it back"*.
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [colaboracion, kernel, token, delegacion, escritor].

---

### HU-40.020 — Impedir que Escritor no-Propietario quite el token a un tercero

**Actor primario:** CO (Escritor no-Propietario intentando "robar" token).
**Tipo:** opcloud-ui.
**Nivel categorico:** K.
**Superficie UI:** modal-model-permisos.
**Gesto canonico:** ninguno (bloqueo automatico).

**Historia:**
> Como Escritor no-Propietario sin el token activo, quiero que el sistema impida que haga doble clic para tomarme el token de otro usuario que ya lo tiene, para proteger la autoria legitima del Editor Actual.

**Contexto de negocio:**
La asimetria Propietario vs Escritor se establece aqui: solo el Propietario puede arrebatar el token. Un Escritor no-Propietario esta sujeto al consentimiento del Editor Actual para recibir el token. La transcripcion lo confirma: *"but he cannot take it from another modeler who already has the write permission"*.

**Criterios de aceptacion:**
- **Dado** que soy Escritor no-Propietario y no tengo el token, **cuando** hago doble clic sobre el Editor Actual (otro Escritor) para tomarlo, **entonces** la UI rechaza el gesto.
- **Dado** que soy Escritor no-Propietario, **cuando** doble clic sobre mi propio nombre, **entonces** **pregunta abierta**: ¿puedo tomar el token si nadie mas lo tiene (offline/expirado)? (Q2 del doc fuente).
- **Dado** que soy Propietario, **cuando** hago doble clic sobre mi propio nombre, **entonces** SI tomo el token incluso de otro Escritor (HU-40.018) — este es el caso asimetrico.
- **Dado** que soy admin de organizacion pero no Propietario, **cuando** intento saltarme la regla, **entonces** **pregunta abierta (Q3)**: ¿puede el admin quitar el token a un Escritor no-Propietario? Hipotesis: si, pero no observado.

**Reglas y restricciones:**
- Invariante: Escritor no-Propietario puede mover el token **hacia si mismo solo si proviene de si mismo (no-op)** o si el Propietario se lo pasa; puede mover el token desde si mismo hacia cualquiera con lectura.
- Asimetria documentada: Propietario > Escritor en capacidad de tomar token.

**Modelo de datos tocado:**
- Ninguno mutado (validacion).

**Dependencias:**
- Bloqueada por: HU-40.013.

**Integraciones:**
- Validador del kernel.

**Notas de evidencia:**
- Fuente: §3.4, §4.1.
- Transcripcion: *"he cannot take it from another modeler who already has the write permission"*.
- Clase de afirmacion: confirmado por transcripcion; Q3 abierto.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [colaboracion, kernel, validacion, token, asimetria, escritor].

---

### HU-40.021 — Activar Automatic Model Read Permission desde Permisos de Carpeta

**Actor primario:** AO.
**Actores secundarios:** CO (beneficiarios al obtener lectura automatica).
**Tipo:** opcloud-ui.
**Nivel categorico:** P primario; K secundario (afecta calculo de lectura efectiva).
**Superficie UI:** modal-permisos-carpeta (banda superior, checkbox unico).
**Gesto canonico:** clic en checkbox `Automatic Model Read Permission`.

**Historia:**
> Como admin de organizacion, quiero activar el checkbox `Automatic Model Read Permission` de una carpeta para que todos los modelers con permiso a la carpeta puedan abrir sus modelos sin asignar permisos uno por uno.

**Contexto de negocio:**
Es el **atajo operativo** para evitar micro-gestion de permisos por modelo cuando una carpeta es visible a un colectivo (clase de cursos, equipo de proyecto). Actua como union sobre el ACL individual de cada modelo (HU-40.023), no como reemplazo.

**Criterios de aceptacion:**
- **Dado** que abro `Permisos de Carpeta` de una carpeta `F` (via `Current Folder Permissions` desde `Load Model` — ver EPICA-31), **cuando** miro la banda superior, **entonces** veo un checkbox `Automatic Model Read Permission` junto a su tooltip.
- **Dado** que el checkbox esta OFF, **cuando** lo marco, **entonces** `F.automatic_model_read_permission = true`.
- **Dado** que el checkbox estaba marcado, **cuando** lo desmarco, **entonces** `F.automatic_model_read_permission = false`; las lecturas derivadas desaparecen pero las individuales persisten (HU-40.023).
- **Dado** que marco el checkbox en el modal, **cuando** cierro, **entonces** **pregunta abierta (Q7)**: ¿se requiere `Save` explicito o el checkbox persiste al instante? En frame_00009 solo hay `Close`; en frames de EPICA-31 (frame_00015) hay `Save`. Asumir que el modal compartido requiere `Save`.

**Reglas y restricciones:**
- Default: OFF (§5.2).
- El checkbox es **por carpeta**, no recursivo a subcarpetas (*"in it"* sugiere no recursivo — Q6).
- No afecta escritura: un modeler con auto-lectura sigue necesitando escritura explicita sobre el modelo.

**Modelo de datos tocado:**
- `folder.automatic_model_read_permission` — booleano — persistente.

**Dependencias:**
- Relaciona: EPICA-31 (Permisos de Carpeta es superficie de esa epica; aqui solo el overlap con lectura de modelo).
- Bloquea a: HU-40.023 (calculo efectivo).

**Integraciones:**
- Resolver de lectura efectiva.
- Subsistema Load Model (los modelos pasan a ser abribles por auto-lectura).

**Notas de evidencia:**
- Fuente: §3.5 (secuencia), §4.5.
- Frames: frame_00009 (checkbox + tooltip visibles), frame_00012 / frame_00015 (ruta de acceso desde Load Model).
- Transcripcion: sin transcripcion explicita para Intro 29 (solo tooltip).
- Clase de afirmacion: observado + inferido (persistencia exacta Q7 abierta).

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [colaboracion, persistencia, carpeta, auto-lectura, checkbox, requires-clarification].

---

### HU-40.022 — Ver tooltip del checkbox Automatic Model Read Permission

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** V.
**Superficie UI:** modal-permisos-carpeta (tooltip flotante).
**Gesto canonico:** hover sobre el checkbox.

**Historia:**
> Como admin, quiero leer un tooltip explicativo del checkbox `Automatic Model Read Permission` para entender su alcance antes de activarlo.

**Contexto de negocio:**
El checkbox tiene consecuencias amplias (otorga lectura a todos los modelos de la carpeta para todos los principals con permiso de carpeta). Un tooltip explicito evita activaciones por error. El texto esta fijado en la spec (§2 tabla UI).

**Criterios de aceptacion:**
- **Dado** que el modal `Permisos de Carpeta` esta abierto, **cuando** hago hover sobre el checkbox `Automatic Model Read Permission`, **entonces** aparece un tooltip con el texto exacto `When checked, all modelers with permissions to this folder will be able to view and open the models in it`.
- **Dado** que muevo el cursor fuera, **cuando** el tooltip desaparece, **entonces** no queda residuo en UI.
- **Dado** que el idioma del producto es ingles (OPCloud), **cuando** miro el tooltip en este repo, **entonces** **nota**: el tooltip canonico es ingles; version ES-CL para este repo es HU separada (pendiente localizacion).

**Reglas y restricciones:**
- Texto exacto canonico observado: `When checked, all modelers with permissions to this folder will be able to view and open the models in it`.
- Tooltip estatico, no configurable por usuario.

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-40.021.

**Integraciones:**
- Ninguna.

**Notas de evidencia:**
- Fuente: §2 tabla UI, §3.5 paso 5.
- Frames: frame_00009.
- Clase de afirmacion: observado (texto literal del tooltip).

**Prioridad:** W.
**Tamano:** XS.
**Etiquetas:** [colaboracion, ui, tooltip, carpeta, auto-lectura].

---

### HU-40.023 — Calcular lectura efectiva como union ACL modelo + auto-lectura carpeta

**Actor primario:** AO (decisor de permisos).
**Actores secundarios:** CO, RV (consumidores de la capacidad).
**Tipo:** opcloud-ui.
**Nivel categorico:** L primario (lente derivada); K secundario (referencia ACL).
**Superficie UI:** ninguna directa (funcion del kernel).
**Gesto canonico:** ninguno (evaluacion en tiempo de acceso).

**Historia:**
> Como propietario, quiero que el sistema calcule la lectura efectiva sobre un modelo `M` en carpeta `F` uniendo el ACL del modelo, la pertenencia a grupos y la auto-lectura de la carpeta, para que las dos superficies de permisos sean predecibles.

**Contexto de negocio:**
La feature define dos capas de permisos que **no se heredan** automaticamente una de otra (§7.1). El unico puente es el checkbox `Automatic Model Read Permission`. Formalizar el calculo efectivo evita ambiguedades y provee base al validador del kernel.

**Criterios de aceptacion:**
- **Dado** un usuario `u`, un modelo `M` en carpeta `F`, **cuando** se evalua `read(u, M)`, **entonces** retorna true si y solo si:
  - `(u, read) ∈ acl(M)` **o**
  - existe `g ∈ groups(u)` con `(g, read) ∈ acl(M)` **o**
  - `F.automatic_model_read_permission = true` **y** `read(u, F) = true`.
- **Dado** que `u` tiene lectura individual, **cuando** `F.automatic_model_read_permission` cambia de true a false, **entonces** `read(u, M)` sigue true (se pierde solo la derivacion automatica).
- **Dado** que `u` no tiene ACL en `M` ni en grupos con ACL, **cuando** `F.automatic_model_read_permission` pasa a true y `u` tiene permiso de carpeta, **entonces** `read(u, M)` pasa a true sin escribir en `model.acl`.
- **Dado** un usuario `u` de **otra organizacion**, **cuando** se evalua `read(u, M)`, **entonces** retorna false incluso si existiera entrada (regla HU-40.015 prevalece).
- **Dado** que `write(u, M)` se evalua, **cuando** se calcula, **entonces** requiere `read(u, M) ∧ (u ∈ acl(M, write) ∨ g con acl write) ∧ u = M.current_editor_id` para edicion activa (§6 del doc fuente).

**Reglas y restricciones:**
- Invariante: `write(u, M) ⇒ read(u, M)`.
- La auto-lectura **no** materializa entradas en `model.acl` — se calcula en tiempo de acceso (hipotesis §4.5).
- Las dos capas (modelo y carpeta) son independientes; solo el checkbox las cruza explicitamente para lectura.

**Modelo de datos tocado:**
- Lectura: `model.acl`, `folder.automatic_model_read_permission`, `folder.acl`, `user.groups`, `user.organization_id`.

**Dependencias:**
- Bloqueada por: HU-40.004, HU-40.006, HU-40.021, HU-40.024.
- Relaciona: EPICA-31 §7.2.

**Integraciones:**
- Validador del kernel.
- Lente de visualizacion de modelos disponibles (Load Model).

**Notas de evidencia:**
- Fuente: §6 (formula exacta), §4.5 (semantica auto-lectura), §7.1 (no herencia cruzada).
- Clase de afirmacion: confirmado (formula literal del doc) + inferido (materializacion vs calculo en acceso).

**Prioridad:** W.
**Tamano:** M.
**Etiquetas:** [colaboracion, kernel, acl, carpeta, lente, formula].

---

### HU-40.024 — Tratar grupo raiz All Org Users como alias organizacional

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario (definicion estructural); V secundaria.
**Superficie UI:** modal-model-permisos (grupo raiz en lista).
**Gesto canonico:** ninguno (estructura de datos).

**Historia:**
> Como admin, quiero que el grupo `<Org> All Users` funcione como alias automatico de la organizacion entera, para poder compartir con "toda la org" en un gesto sin mantenerlo manualmente.

**Contexto de negocio:**
El grupo raiz `<Org> All Users` no es un grupo editable como los demas: es un **macro ontologico**. La transcripcion lo confirma describiendolo como *"the first group in each organization"*. Todos los usuarios de la organizacion pertenecen automaticamente; marcarlo otorga lectura a todos.

**Criterios de aceptacion:**
- **Dado** que abro el modal de una organizacion `Org_X`, **cuando** miro la lista de grupos, **entonces** la primera fila es `<Org_X> All Users` (ej. `MIT All Users`, `Technion All Users`).
- **Dado** que marco el checkbox de `<Org_X> All Users`, **cuando** pulso `SAVE`, **entonces** todos los usuarios actuales de `Org_X` tienen `read(u, M) = true`.
- **Dado** que un nuevo usuario se da de alta en `Org_X`, **cuando** intenta abrir `M`, **entonces** tiene lectura automatica sin re-asignar.
- **Dado** que `<Org_X> All Users` aparece, **cuando** lo intento editar (miembros manuales), **entonces** **hipotesis**: no es editable — es derivado de `user.organization_id = Org_X`.

**Reglas y restricciones:**
- Grupo raiz es automatico, derivado del `organization_id`.
- No se puede "remover" miembros; es macro, no grupo real.
- Aparece como primera fila por convencion.

**Modelo de datos tocado:**
- `organization.root_group_id` (virtual; puede no existir como registro).
- Derivacion: `members(root_group) = {u : u.organization_id = org.id}`.

**Dependencias:**
- Bloqueada por: HU-40.003.
- Relaciona: HU-40.004 (otorgar a grupo).

**Integraciones:**
- Directorio de usuarios/organizacion.

**Notas de evidencia:**
- Fuente: §3.2 paso 1 (*"the first group in each organization"*), §6 (modelo de datos organization/group).
- Frames: frame_00005 (`MIT All Users` como primera fila en MIT), frame_00009 (`All Technion Users` en Permisos de Carpeta de Technion).
- Clase de afirmacion: confirmado por transcripcion + observado en frames.

**Prioridad:** W.
**Tamano:** S.
**Etiquetas:** [colaboracion, kernel, grupos, organizaciones, alias, macro].

---

### HU-40.025 — Preservar canvas pasivo tras modal de permisos (overlay puro)

**Actor primario:** AO.
**Actores secundarios:** cualquier actor mirando el canvas de fondo.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** modal-model-permisos + canvas-opd (fondo).
**Gesto canonico:** ninguno (render invariante).

**Historia:**
> Como propietario, quiero que el canvas debajo del modal de permisos no se modifique durante la gestion de permisos, para separar la edicion del modelo de la edicion de permisos.

**Contexto de negocio:**
La separacion de concerns entre modelo (canvas) y permisos (modal) es una decision de diseno importante: los 25 frames muestran el mismo OPD SD1 `Turbojet Engine Operating` in-zoomed detras del modal sin cambios. Nada se edita hasta cerrar el modal. Esto evita efectos colaterales inesperados (p.ej. creacion accidental de cosas al clicar pasando por el canvas).

**Criterios de aceptacion:**
- **Dado** que abro el modal `Model Permissions Setting`, **cuando** el modal esta activo, **entonces** el canvas detras queda bloqueado para interaccion (sin scroll, sin drag, sin clic efectivo).
- **Dado** que realizo cambios en el modal, **cuando** persiste o descarta, **entonces** el contenido del OPD sigue identico al previo (ninguna cosa o link creado/modificado).
- **Dado** que cierro el modal, **cuando** vuelvo al canvas, **entonces** todas las interacciones normales del canvas quedan disponibles.
- **Dado** que el modal se cierra tras una transferencia de token, **cuando** vuelvo al canvas, **entonces** veo el indicador `(read only)` si perdi la escritura (HU-40.012) pero no cambio el OPD.

**Reglas y restricciones:**
- Modal es overlay puro: bloquea interaccion pero no altera modelo.
- El modal NO debe emitir eventos al kernel de modelo (solo al kernel de permisos).

**Modelo de datos tocado:**
- Ninguno del modelo OPM; solo `model.acl` / `model.current_editor_id`.

**Dependencias:**
- Bloqueada por: HU-40.001.

**Integraciones:**
- Ninguna cross-subsistema; el modal es aislado.

**Notas de evidencia:**
- Fuente: §7.3 (canvas pasivo durante interaccion de permisos).
- Frames: los 25 frames de la carpeta 12 muestran el canvas invariante.
- Clase de afirmacion: observado.

**Prioridad:** W.
**Tamano:** XS.
**Etiquetas:** [colaboracion, ui, modal, overlay, aislamiento, separacion-concerns].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q40.1**: Transferencia de **propiedad** (llave) a otro usuario — ¿existe en el modal o es accion administrativa? No observado. (cf. HU-40.007).
- **Q40.2**: Que ocurre con el token cuando Editor Actual cierra sesion o se desconecta mid-edit. (cf. HU-40.008, HU-40.020).
- **Q40.3**: Admin de organizacion — ¿puede saltarse la regla "no tomar token de otro Escritor"? Hipotesis: si, pero no observado. (cf. HU-40.020).
- **Q40.4**: Notificacion al usuario receptor/pierde permisos al guardar. No observado. (cf. HU-40.009).
- **Q40.5**: `Automatic Model Read Permission` dinamismo — ¿aplica solo a modelos presentes al marcar o tambien a creados/movidos despues? Hipotesis: dinamico (calculo en acceso). (cf. HU-40.021, HU-40.023).
- **Q40.6**: Propagacion a subcarpetas de `Automatic Model Read Permission`. Tooltip dice "in it" — hipotesis no-recursivo. (cf. HU-40.021).
- **Q40.7**: `Permisos de Carpeta` con solo checkbox de auto-lectura — ¿requiere `Save` explicito o persiste al instante? Frame_00009 solo muestra `Close`; otros frames muestran `Save`. (cf. HU-40.021).
- **Q40.8**: Auditoria `who changed permissions when`. No observada en UI.
- **Q40.9**: Apertura de `Configuracion de Permisos del Modelo` por usuario sin Propietario ni escritura — ¿modo solo lectura del modal o bloqueo? (cf. HU-40.001).
- **Q40.10**: Indicador `(read only)` junto al titulo — ¿tooltip, badge permanente o ambos? Frame_00018 sugiere tooltip. (cf. HU-40.012).
- **Q40.11**: Feedback inline en el modal al hacer doble clic de transferencia (toast tipo `<User> Is now the current model editor`) — narrado pero no capturado en los 25 frames. (cf. HU-40.013).

## Referencias cruzadas

- Doc fuente: `opcloud-reverse/40-colaboracion-permisos.md`.
- Fuente normativa: `opm-iso-19450-es.md` — la SSOT OPM no regula la colaboracion; esta epica es opcloud-ui.
- Epicas relacionadas:
  - **EPICA-30** (persistencia save-load): `Save` con solo lectura redirige a `Save As` (HU-40.017).
  - **EPICA-31** (persistencia folders): matriz O/W/R de carpetas documentada ahi; aqui solo el overlap de `Automatic Model Read Permission` (HU-40.021, HU-40.022, HU-40.023).
  - **EPICA-35** (persistencia move-search): indicador `(read only)` en arbol OPD (HU-40.012).
  - **EPICA-41** (colaboracion chat): permisos de modelo afectan quien puede abrir/editar; chat sigue accesible a lectores.
  - **EPICA-42** (colaboracion notes): notes hereda permisos de edicion del modelo.
  - **EPICA-80** (config-user-org): reglas de organizacion, usuarios y grupos (prerequisito estructural).
- Invariantes del repo:
  - **Kernel de permisos** — no existe aun en `src/nucleo/`; esta epica informa el diseno futuro (`model.acl`, `model.owner_id`, `model.current_editor_id`).
  - **Validador** — las reglas duras (HU-40.014, HU-40.015, HU-40.016, HU-40.020) deben enforcarse en `src/nucleo/validacion/`.
  - **Lente de lectura efectiva** (HU-40.023) — formula en §6 doc fuente, candidata a pass dedicado.
  - Prioridad predominante **W**: colaboracion multi-usuario queda fuera del alcance del modelador core del repo actual. Las HU quedan deferred; inventario preserva trazabilidad para futuro habilitamiento.
