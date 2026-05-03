---
epica: "EPICA-82"
titulo: "Config — ontologia organizacional (glosario canonico + sugerencia inline + reforzamiento)"
doc_fuente: "opcloud-reverse/82-config-organization-ontology.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "S"
hu_emitidas: 20
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "DIAGNOSTICO-PILOTO-EPICA-10.md"
ultima_actualizacion: 2026-04-23
---

## Resumen

Esta epica cubre la **capa lexica organizacional**: una tabla por-organizacion que mapea sinonimos/alias a formas canonicas, y un mecanismo de sugerencia inline que se dispara al nombrar cosas. El objetivo es que todos los modelos de una organizacion usen el mismo vocabulario, con un nivel de reforzamiento configurable (`None` / `Sugerir` / `Reforzar`) que va desde "apagado" hasta "bloquea al modelador hasta que elija una forma canonica".

La ontologia **no forma parte del modelo ni de la gramatica OPM**: es un artefacto de gobernanza organizacional, mantenido por un admin (AO), que actua sobre el rotulo del thing en el momento de la confirmacion del popup de nombre. Scope cubierto en la spec inversa:

- dialogo `Organizational Ontology suggestsion` durante creacion y renombrado,
- panel admin `Organization Ontology Administration` (CRUD de entradas),
- selector `Ontology Enforcement Level` en `OPCloud Settings`,
- sintaxis de multiples canonicas/alias separados por `;` en ambas columnas,
- impactos colaterales: canvas, biblioteca lateral, OPL pane, navigator,
- interaccion con `Auto Format` cuando el casing canonico es no-estandar.

Las HU se numeran por aparicion en el doc fuente. Esta epica es transversal: toca `src/persistencia/` (organizacion), `src/ui/` (popup + modal), `src/nucleo/` (regla de normalizacion sobre `thing.name`) y `src/render/opl-renderer.ts` (eco tras sustitucion).

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-82.001 | Activar feature Organization Ontology a nivel de organizacion | AO | S | S | opcloud-ui | [opm-iso-19450-es.md §Terminos] |
| HU-82.002 | Definir entrada canonica con alias en panel admin | AO | S | M | opcloud-ui | [opm-iso-19450-es.md §Terminos] |
| HU-82.003 | Declarar multiples formas canonicas con separador `;` | AO | S | S | opcloud-ui | [opm-iso-19450-es.md §Terminos] |
| HU-82.004 | Declarar alias multiples con separador `;` | AO | S | S | opcloud-ui | [opm-iso-19450-es.md §Terminos] |
| HU-82.005 | Editar entrada existente de la ontologia | AO | S | S | opcloud-ui | — |
| HU-82.006 | Eliminar entrada de la ontologia | AO | S | XS | opcloud-ui | — |
| HU-82.007 | Filtrar filas de la tabla por texto | AO | C | XS | opcloud-ui | — |
| HU-82.008 | Guardar cambios con feedback explicito | AO | S | XS | opcloud-ui | — |
| HU-82.009 | Configurar nivel de reforzamiento (None / Sugerir / Reforzar) | AO | S | S | opcloud-ui | [opm-iso-19450-es.md §Terminos] |
| HU-82.010 | Detectar match al confirmar nombre y abrir modal sugerencia | MN | S | M | mixto | [Glos 3.4] [opm-iso-19450-es.md §Terminos] |
| HU-82.011 | Listar formas canonicas disponibles como botones en el modal | MN | S | S | opcloud-ui | — |
| HU-82.012 | Aceptar sugerencia canonica y sustituir rotulo | MN | S | M | mixto | [Glos 3.4] [opm-iso-19450-es.md §Terminos] |
| HU-82.013 | Cerrar sin cambiar bajo reforzamiento Sugerir | MN | S | XS | opcloud-ui | — |
| HU-82.014 | Bloquear cierre sin eleccion bajo reforzamiento Reforzar | ME | S | S | opcloud-ui | — |
| HU-82.015 | Desactivar Auto Format cuando canonica tiene casing no estandar | MN | C | S | mixto | [Glos 3.4] |
| HU-82.016 | Reflejar rotulo canonico en canvas, biblioteca, OPL y navigator | MN | S | S | mixto | [Glos 3.4] |
| HU-82.017 | Aplicar sugerencia tambien al renombrar cosa existente | ME | S | S | mixto | [Glos 3.4] [opm-iso-19450-es.md §Terminos] |
| HU-82.018 | Importar ontologia desde CSV | AO | C | M | opcloud-ui | — |
| HU-82.019 | Exportar ontologia a CSV para respaldo y portabilidad | AO | C | S | opcloud-ui | — |
| HU-82.020 | Auditar historial de sustituciones aceptadas por modelador | AO | W | L | opcloud-ui | — |

Total: **20 historias de usuario** (13 opcloud-ui, 7 mixto).

## Historias de usuario

### HU-82.001 — Activar feature Organization Ontology a nivel de organizacion

**Actor primario:** AO (admin de organizacion).
**Actores secundarios:** MN, ME (reciben el efecto).
**Tipo:** opcloud-ui.
**Nivel categorico:** C (config) primario; P (persistencia organizacional) secundario.
**Superficie UI:** sidebar-settings → `Organization Management` → `Organization Ontology`.
**Gesto canonico:** navegacion + clic.

**Historia:**
> Como admin de organizacion, quiero acceder a la seccion `Organization Ontology` desde el menu Settings para gestionar el glosario canonico de mi organizacion.

**Contexto de negocio:**
La ontologia organizacional existe como subsistema separado del modelo: vive en el espacio de configuracion de la organizacion, no dentro de ningun modelo. El punto de entrada es el menu Settings. Sin este punto de entrada no hay forma de administrar la ontologia; es la HU que "enciende" toda la epica.

**Criterios de aceptacion:**
- **Dado** que soy admin y abri `Settings`, **cuando** expando `Organization Management`, **entonces** veo la entrada `Organization Ontology` como sub-item.
- **Dado** que hago clic en `Organization Ontology`, **cuando** se carga la vista, **entonces** se muestra el panel `Organization Ontology Administration` con la tabla existente (vacia si no hay entradas).
- **Dado** que no soy admin, **cuando** entro a Settings, **entonces** la entrada `Organization Ontology` no es visible o esta deshabilitada (ver HU-40.xxx para permisos).
- **Dado** que la organizacion no tiene ontologia previa, **cuando** abro el panel, **entonces** la tabla esta vacia pero los controles (`Add New Entry`, `Filter`, `Apply`, `Reset`, `Save`) estan visibles.

**Reglas y restricciones:**
- Punto de entrada unico: menu Settings → sidebar azul → acordeon `Organization Management`.
- Solo admin (rol AO) accede al panel (transcripcion: *"only admin can set it up"*).
- No hay acceso programatico fuera del panel admin.

**Modelo de datos tocado:**
- `organization.ontology` — objeto contenedor — persistente a nivel de organizacion.
- `organization.ontology.entries` — array (vacio por default).

**Dependencias:**
- Bloqueada por: HU-80.xxx (roles de organizacion y acceso a Settings).
- Bloquea a: todas las demas HU de la epica.

**Integraciones:**
- Sidebar de Settings: inserta el sub-item.
- Persistencia organizacional (`src/persistencia/` scope organizacion).

**Notas de evidencia:**
- Fuente: `opcloud-reverse/82-config-organization-ontology.md` §2, [Glos 3.4].
- Frames: frame_00015.
- Transcripcion: "an admin can set it up to be enforced".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [config, ontologia, organizacion, feature-flag, settings].

---

### HU-82.002 — Definir entrada canonica con alias en panel admin

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** C primario; P secundario.
**Superficie UI:** panel `Organization Ontology Administration`.
**Gesto canonico:** clic en `Add New Entry` + escritura + `Save`.

**Historia:**
> Como admin, quiero agregar una nueva entrada a la ontologia escribiendo una forma canonica y una lista de alias para que los modeladores sean guiados hacia el termino correcto.

**Contexto de negocio:**
Cada entrada de la ontologia es un mapeo `alias → canonico`. Es la unidad atomica de gobernanza lexica. El admin la crea con un solo gesto: un clic agrega la fila en blanco, dos campos de texto permiten escribir clave y alias.

**Criterios de aceptacion:**
- **Dado** que estoy en el panel admin, **cuando** hago clic en `Add New Entry`, **entonces** aparece una fila nueva con dos campos de texto editables y botones `Edit`/`Delete` a la derecha.
- **Dado** que la fila esta editable, **cuando** escribo `OPCloud` en la columna izquierda y `opcloud; Opcloud; OPcloud; OP-cloud` en la derecha, **entonces** los valores quedan preparados para persistirse.
- **Dado** que escribi los dos campos, **cuando** hago clic en `Save`, **entonces** la entrada persiste y se refleja el toast `saved successfully`.
- **Dado** que dejo la columna canonica vacia, **cuando** hago `Save`, **entonces** se muestra error (observacion inferida — validacion minima requerida, pregunta abierta).
- **Dado** que dejo alias vacio pero con canonica, **cuando** hago `Save`, **entonces** persiste como entrada con canonica sola (sin alias = no dispara sugerencia).

**Reglas y restricciones:**
- La columna izquierda es **clave canonica** (lo que reemplaza).
- La columna derecha es **alias** (lo que dispara la sugerencia).
- Ninguno de los campos valida sintaxis de caracteres; el unico especial es `;` (separador).
- La convencion de nombrado sigue [opm-iso-19450-es.md §Terminos] para consistencia con la gramatica OPM.
- No hay limite de caracteres observado.

**Modelo de datos tocado:**
- `organization.ontology.entries[N].canonical` — string (con posible `;`) — persistente.
- `organization.ontology.entries[N].aliases` — string (con posible `;`) — persistente.
- `organization.ontology.entries[N].id` — UUID — persistente.

**Dependencias:**
- Bloqueada por: HU-82.001.
- Bloquea a: HU-82.003, HU-82.004, HU-82.005, HU-82.006, HU-82.010.

**Integraciones:**
- Persistencia organizacional.

**Notas de evidencia:**
- Fuente: [Glos 3.4] paso 3–6, §5.1.
- Frames: frame_00020.
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [config, ontologia, panel-admin, crud, creacion].

---

### HU-82.003 — Declarar multiples formas canonicas con separador `;`

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** C primario; P.
**Superficie UI:** panel admin — columna izquierda.
**Gesto canonico:** escritura de texto con `;`.

**Historia:**
> Como admin, quiero declarar mas de una forma canonica por entrada (ej. `LED;led`) para ofrecer al modelador una eleccion entre variantes legitima cuando el caso de uso lo requiera.

**Contexto de negocio:**
El doc fuente registra el caso `LED;led` (frame 00025) con transcripcion explicita: *"let's do it in lowercase, I want to be able to write lead with uppercase and lowercase"*. Esto significa que una entrada puede admitir coexistencia de varias canonicas, y el modal de sugerencia presentara un boton por cada una.

**Criterios de aceptacion:**
- **Dado** que estoy creando una entrada, **cuando** escribo `LED;led` en la columna canonica, **entonces** el sistema interpreta dos canonicas coexistentes: `LED` y `led`.
- **Dado** que la entrada tiene dos canonicas, **cuando** un modelador dispara la sugerencia, **entonces** el modal muestra dos botones lado a lado, uno por cada canonica.
- **Dado** que escribo `LED ; led` con espacios, **cuando** guardo, **entonces** el parseo normaliza espacios (conservativo: trim de cada token).
- **Dado** que escribo `LED;;led` con doble separador, **cuando** guardo, **entonces** los tokens vacios se ignoran.

**Reglas y restricciones:**
- Separador estricto: `;` (punto y coma).
- No hay escape para `;` literal (limitacion conocida; pregunta abierta).
- Orden de los botones en el modal = orden en el campo canonico.

**Modelo de datos tocado:**
- `organization.ontology.entries[N].canonical` persiste con el separador literal; el parseo ocurre al leer.

**Dependencias:**
- Bloqueada por: HU-82.002.
- Bloquea a: HU-82.011.

**Notas de evidencia:**
- Fuente: [Glos 3.4] paso 4.
- Frames: frame_00025.
- Transcripcion: "let's do it in lowercase, I want to be able to write lead with uppercase and lowercase".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [config, ontologia, panel-admin, canonicas-multiples, separador].

---

### HU-82.004 — Declarar alias multiples con separador `;`

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** C primario; P.
**Superficie UI:** panel admin — columna derecha.
**Gesto canonico:** escritura de texto con `;`.

**Historia:**
> Como admin, quiero listar todos los alias que activaran la sugerencia separados por `;` (ej. `opcloud; Opcloud; OPcloud; OP-cloud; OPCLOUD`) para capturar todas las variantes que los modeladores suelen escribir.

**Contexto de negocio:**
El match es **case-sensitive** (evidencia: la entrada alias de `OPCloud` declara `opcloud`, `Opcloud`, `OPcloud`, `OPCLOUD` explicitamente separadas). Esto implica que cada variante debe declararse. El separador `;` es el mecanismo unico para listar multiples alias en una misma entrada.

**Criterios de aceptacion:**
- **Dado** que edito el campo alias, **cuando** escribo `opcloud; Opcloud; OPcloud; OP-cloud;OPCLOUD`, **entonces** el sistema reconoce 5 alias distintos.
- **Dado** que un modelador teclea exactamente cualquiera de los 5 alias, **cuando** confirma el popup, **entonces** se dispara el match.
- **Dado** que un modelador teclea una variante no listada (ej. `op-cloud`), **cuando** confirma, **entonces** NO se dispara match (case-sensitive, HU-82.010).
- **Dado** que escribo alias con espacios antes/despues del `;`, **cuando** guardo, **entonces** se trim cada token.

**Reglas y restricciones:**
- Case-sensitive por default (evidencia inversa mixta — ver §11 pregunta 5).
- No hay wildcards ni regex.
- Separador unico: `;`.

**Modelo de datos tocado:**
- `organization.ontology.entries[N].aliases` — string con separadores.

**Dependencias:**
- Bloqueada por: HU-82.002.
- Bloquea a: HU-82.010.

**Notas de evidencia:**
- Fuente: [Glos 3.4] paso 5, §11 pregunta 5.
- Frames: frame_00020, frame_00025.
- Clase de afirmacion: observado (con pregunta abierta sobre case-sensitivity estricta).
- Etiqueta: `requires-clarification` (pregunta 5).

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [config, ontologia, panel-admin, alias, separador, case-sensitive, requires-clarification].

---

### HU-82.005 — Editar entrada existente de la ontologia

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** C primario; P.
**Superficie UI:** panel admin — boton `Edit` por fila.
**Gesto canonico:** clic en `Edit` + edicion + `Save`.

**Historia:**
> Como admin, quiero editar una entrada existente de la ontologia para actualizar alias o canonicas a medida que el vocabulario organizacional evoluciona.

**Contexto de negocio:**
La ontologia no es estatica. A medida que la organizacion descubre nuevos sinonimos usados en la practica (por auditoria o por feedback), el admin debe poder agregar alias sin recrear la entrada. El boton `Edit` habilita la fila para edicion inline.

**Criterios de aceptacion:**
- **Dado** que hay una entrada en la tabla, **cuando** hago clic en `Edit` de esa fila, **entonces** los dos campos pasan a modo editable.
- **Dado** que modifique el campo alias agregando un nuevo token, **cuando** hago `Save`, **entonces** el nuevo alias queda registrado.
- **Dado** que edite una canonica existente, **cuando** guardo, **entonces** los modelos existentes que ya tengan el rotulo canonico anterior **no** se actualizan automaticamente (la sustitucion es destructiva en el momento, no retroactiva — inferencia).
- **Dado** que salgo del panel sin guardar, **cuando** vuelvo, **entonces** los cambios se descartan.

**Reglas y restricciones:**
- La edicion es atomica por fila; `Save` global persiste toda la tabla.
- No hay "unsaved changes" warning observado (pregunta abierta).
- Cambios retroactivos sobre modelos existentes: no observados → inferencia: no se aplican.

**Modelo de datos tocado:**
- Misma estructura que HU-82.002; mutacion sobre `entries[N]`.

**Dependencias:**
- Bloqueada por: HU-82.002.

**Notas de evidencia:**
- Fuente: [Glos 3.4] paso 7, §5.1.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [config, ontologia, panel-admin, edicion, crud].

---

### HU-82.006 — Eliminar entrada de la ontologia

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** C primario; P.
**Superficie UI:** panel admin — boton `Delete` por fila.
**Gesto canonico:** clic en `Delete`.

**Historia:**
> Como admin, quiero eliminar una entrada obsoleta de la ontologia para retirar un mapeo que ya no aplica.

**Contexto de negocio:**
El vocabulario evoluciona; entradas viejas (marcas descontinuadas, reorganizaciones) deben poder retirarse. El delete es por fila.

**Criterios de aceptacion:**
- **Dado** que hay una entrada, **cuando** hago clic en `Delete` de esa fila, **entonces** la fila se elimina de la tabla.
- **Dado** que elimine la entrada, **cuando** hago `Save`, **entonces** la eliminacion persiste.
- **Dado** que elimine una entrada, **cuando** un modelador teclea un alias que antes disparaba match, **entonces** ya no se dispara sugerencia.
- **Dado** que los modelos existentes tienen el rotulo canonico de la entrada eliminada, **cuando** miro esos modelos, **entonces** los rotulos permanecen intactos (no se revierten a alias).

**Reglas y restricciones:**
- Sin confirmacion modal observada (pregunta abierta — buena practica sugeriria confirmacion).
- Delete retroactivo sobre modelos: no.
- Pregunta abierta: ¿se registra auditoria del delete? (cf. HU-82.020).

**Modelo de datos tocado:**
- Remocion de `entries[N]`.

**Dependencias:**
- Bloqueada por: HU-82.002.

**Notas de evidencia:**
- Fuente: [Glos 3.4] paso 8, §5.1.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [config, ontologia, panel-admin, delete, crud].

---

### HU-82.007 — Filtrar filas de la tabla por texto

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; C.
**Superficie UI:** panel admin — campo `Filter:` + botones `Apply`/`Reset`.
**Gesto canonico:** escritura en input + clic en `Apply` (y `Reset` para limpiar).

**Historia:**
> Como admin de organizacion con ontologia grande, quiero filtrar la tabla escribiendo una porcion del termino para encontrar rapido la entrada que necesito editar.

**Contexto de negocio:**
En organizaciones maduras la ontologia puede tener cientos de entradas. Sin filtro, la tabla se vuelve inmanejable. El filtro busca en ambas columnas (canonica y alias) por substring.

**Criterios de aceptacion:**
- **Dado** que tengo la tabla con varias entradas, **cuando** escribo `OPC` en el campo `Filter` y hago clic en `Apply`, **entonces** solo quedan visibles las filas cuya canonica o alias contengan `OPC`.
- **Dado** que el filtro esta activo, **cuando** hago clic en `Reset`, **entonces** el filtro se limpia y todas las filas vuelven a ser visibles.
- **Dado** que el filtro no matchea ninguna fila, **cuando** aplico, **entonces** la tabla aparece vacia con los controles intactos.
- **Dado** que aplico filtro y edito una fila visible, **cuando** hago `Save`, **entonces** los cambios persisten sobre la fila real (no sobre una vista filtrada corrupta).

**Reglas y restricciones:**
- Filtro por substring, case-sensitive (inferencia por paralelo con match de alias).
- Se aplica en cliente (performance no critica para tamanos observados).

**Dependencias:**
- Bloqueada por: HU-82.001.

**Notas de evidencia:**
- Fuente: §5.1 tabla.
- Clase de afirmacion: observado (controles presentes; comportamiento inferido del uso estandar de filtros admin).

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [config, ontologia, panel-admin, filter, productividad].

---

### HU-82.008 — Guardar cambios con feedback explicito

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; P.
**Superficie UI:** panel admin — boton `Save`.
**Gesto canonico:** clic en `Save`.

**Historia:**
> Como admin, quiero ver un feedback explicito `saved successfully` tras guardar cambios en la ontologia para confirmar que la persistencia fue exitosa.

**Contexto de negocio:**
La edicion de configuracion organizacional es "peligrosa" — afecta a todos los modeladores de la organizacion. Un feedback claro reduce la ansiedad del admin y confirma que los cambios estan vivos.

**Criterios de aceptacion:**
- **Dado** que hice cambios (add/edit/delete) y hago clic en `Save`, **cuando** la persistencia tiene exito, **entonces** aparece mensaje/toast `saved successfully`.
- **Dado** que hago `Save` sin cambios, **cuando** se ejecuta, **entonces** el feedback se muestra igual (no hay distincion no-op).
- **Dado** que la persistencia falla (ej. error de red), **cuando** se reporta, **entonces** aparece un mensaje de error diferenciado (inferido; no observado explicitamente).
- **Dado** que acabo de guardar, **cuando** miro la tabla, **entonces** los cambios quedan reflejados visualmente sin necesidad de recargar.

**Reglas y restricciones:**
- El feedback es no-bloqueante (toast, no modal).
- La persistencia es a nivel de organizacion, no de modelo.

**Dependencias:**
- Bloqueada por: HU-82.002.

**Notas de evidencia:**
- Fuente: [Glos 3.4] paso 6.
- Transcripcion: `saved successfully`.
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [config, ontologia, panel-admin, save, toast, feedback].

---

### HU-82.009 — Configurar nivel de reforzamiento (None / Sugerir / Reforzar)

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** C primario; P.
**Superficie UI:** `OPCloud Settings` → seccion `Nivel de Reforzamiento Ontologico`.
**Gesto canonico:** seleccion en control (dropdown o radio) + apply.

**Historia:**
> Como admin, quiero elegir entre `None`, `Sugerir` y `Reforzar` como nivel de reforzamiento de la ontologia para calibrar cuanto obliga el sistema a los modeladores a usar vocabulario canonico.

**Contexto de negocio:**
El mismo vocabulario soporta tres regimenes: sin accion (`None`), sugerencia blanda (`Sugerir`, default) y obligacion dura (`Reforzar`). Esta graduacion permite a la organizacion ir endureciendo politicas gradualmente sin cambiar la tabla.

**Criterios de aceptacion:**
- **Dado** que estoy en `OPCloud Settings`, **cuando** scrolleo a la seccion `Nivel de Reforzamiento Ontologico`, **entonces** veo un control con tres valores: `None`, `Sugerir`, `Reforzar`.
- **Dado** que selecciono `None` y guardo, **cuando** un modelador escribe un alias, **entonces** NO se dispara el modal.
- **Dado** que selecciono `Sugerir` y guardo, **cuando** un modelador escribe un alias, **entonces** se dispara el modal **y** aparece el enlace `Close Without Changing`.
- **Dado** que selecciono `Reforzar` y guardo, **cuando** un modelador escribe un alias, **entonces** se dispara el modal **y** el enlace `Close Without Changing` esta ausente (HU-82.014).
- **Dado** que el default de una organizacion recien creada es `Sugerir`.

**Reglas y restricciones:**
- El nivel vive en `OPCloud Settings`, **no** en `Organization Ontology` — separacion explicita de *tabla de datos* y *flag de comportamiento* (§7.5 doc fuente).
- Default: `Sugerir`.
- El cambio aplica a toda la organizacion, todos los modelos, todos los usuarios.

**Modelo de datos tocado:**
- `organization.ontology.enforcement_level` — `"None" | "Sugerir" | "Reforzar"` — persistente.

**Dependencias:**
- Bloqueada por: HU-82.001.
- Bloquea a: HU-82.010, HU-82.013, HU-82.014.

**Integraciones:**
- OPCloud Settings; el resto de la epica lee este flag.

**Notas de evidencia:**
- Fuente: §3.5, §5.3, §7.5.
- Frames: frame_00030 (pagina de OPCloud Settings, seccion mencionada fuera del viewport).
- Transcripcion: "this is only done when the organization ontology is marked as suggested; an admin can set it up to be enforced".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [config, ontologia, reforzamiento, opcloud-settings, none-sugerir-reforzar].

---

### HU-82.010 — Detectar match al confirmar nombre y abrir modal sugerencia

**Actor primario:** MN (modelador novato).
**Actores secundarios:** ME.
**Tipo:** mixto.
**Nivel categorico:** U primario; K (normalizacion sobre `thing.name` pre-commit); C (lee reforzamiento).
**Superficie UI:** popup-auto-format → modal `Organizational Ontology suggestsion`.
**Gesto canonico:** clic en `Update` (o `Enter`) del popup de nombre.

**Historia:**
> Como modelador, quiero que al confirmar un nombre que coincide con un alias registrado se abra automaticamente el modal de sugerencia para ser guiado hacia la forma canonica organizacional.

**Contexto de negocio:**
Este es el **disparador central** de la epica. La deteccion ocurre en el momento exacto de la confirmacion del popup de nombre (HU-10.003/005). El texto tecleado se compara contra la union de alias + canonicas de la ontologia; si hay match, se intercepta la confirmacion y se abre el modal en lugar de persistir el nombre. La convencion de terminos sigue [opm-iso-19450-es.md §Terminos].

**Criterios de aceptacion:**
- **Dado** que `enforcement_level != None` y tecleo `Opcloud` en el popup de nombre, **cuando** hago clic en `Update` (o `Enter`), **entonces** se intercepta la confirmacion y se abre el modal `Organizational Ontology suggestsion`.
- **Dado** que se abrio el modal, **cuando** miro el contenido, **entonces** veo:
  - etiqueta `Your text is:` seguida del texto literal tecleado,
  - etiqueta `The phrase <alias-normalizado> can match your organization ontology.`,
  - instruccion `Choose from the following phrases to match the organization onlology:`.
- **Dado** que tecleo un texto sin match (no esta en alias ni en canonicas), **cuando** confirmo, **entonces** NO se dispara el modal y el nombre persiste normalmente.
- **Dado** que `enforcement_level = None`, **cuando** tecleo un alias y confirmo, **entonces** NO se dispara el modal.
- **Dado** que el texto coincide con una canonica directamente (no con un alias), **cuando** confirmo, **entonces** NO se dispara el modal (la canonica ya es canonica).

**Reglas y restricciones:**
- El match es **case-sensitive** por default (evidencia: alias explicitamente repetidos en variantes de caja).
- La deteccion ocurre **antes** de la escritura en `thing.name`.
- El flujo bloquea la confirmacion original hasta que el modal se resuelva.
- El modal es central sobre el canvas, no anclado al thing.
- Textos entre el modelador y el match: no se normalizan (trim, collapse spaces) por default — pregunta abierta.

**Modelo de datos tocado:**
- Lectura: `organization.ontology.entries[*]`, `organization.ontology.enforcement_level`.
- Escritura diferida: `thing.name` queda sin persistir hasta resolucion.

**Dependencias:**
- Bloqueada por: HU-82.002, HU-82.004, HU-82.009.
- Bloquea a: HU-82.011, HU-82.012, HU-82.013, HU-82.014, HU-82.015, HU-82.016, HU-82.017.

**Integraciones:**
- Popup de nombre (HU-10.003, HU-10.005).
- Kernel validador/normalizador.
- Lectura de config organizacional.

**Notas de evidencia:**
- Fuente: §3.1, §3.2, §5.2, §11 (preguntas 5–7); [Glos 3.4].
- Frames: frame_00007, frame_00012.
- Clase de afirmacion: observado + confirmado.
- Etiquetas: `requires-clarification` sobre case-sensitivity estricta (§11 p.5) y sobre si aplica a processes/states/links (§11 p.7).

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [config, ontologia, popup-inline, normalizacion, modal, requires-clarification].

---

### HU-82.011 — Listar formas canonicas disponibles como botones en el modal

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; U.
**Superficie UI:** modal `Organizational Ontology suggestsion`.
**Gesto canonico:** ninguno (render declarativo).

**Historia:**
> Como modelador, quiero ver todas las formas canonicas validas como botones en el modal para elegir rapido la variante que aplica a mi caso.

**Contexto de negocio:**
Cuando una entrada tiene varias canonicas (HU-82.003, ej. `LED;led`), el modelador debe poder elegir entre ellas. Cada canonica se renderiza como un boton independiente, permitiendo un clic para aceptar.

**Criterios de aceptacion:**
- **Dado** que el modal esta abierto para una entrada con una sola canonica, **cuando** miro el contenido, **entonces** veo un unico boton con la canonica.
- **Dado** que el modal esta abierto para una entrada con dos o mas canonicas (`LED;led`), **cuando** miro, **entonces** veo varios botones lado a lado, uno por canonica, en el orden declarado.
- **Dado** que los botones tienen estilo gris neutro con texto centrado, **cuando** paso el cursor, **entonces** cambian a estado hover (inferido visual standard).
- **Dado** que la entrada tiene N canonicas, **cuando** se abre el modal, **entonces** aparecen exactamente N botones — ni mas (no se agrega "Cancel" como boton) ni menos.

**Reglas y restricciones:**
- Los botones son clicables; no hay `Enter` implicito si hay una sola opcion (§8 no hay shortcut).
- Orden: igual al orden declarado en el campo canonico del admin.
- Estilo: gris neutro, sin iconografia (§9 convencion observada).

**Dependencias:**
- Bloqueada por: HU-82.010, HU-82.003.
- Bloquea a: HU-82.012.

**Integraciones:**
- Render del modal.

**Notas de evidencia:**
- Fuente: §3.1 paso 5, §5.2, §9.
- Frames: frame_00007, frame_00025.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [config, ontologia, modal, opciones, render].

---

### HU-82.012 — Aceptar sugerencia canonica y sustituir rotulo

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** mixto.
**Nivel categorico:** K (muta `thing.name`) primario; V, L.
**Superficie UI:** modal `Organizational Ontology suggestsion` — boton canonico.
**Gesto canonico:** clic en boton canonico.

**Historia:**
> Como modelador, quiero aceptar la forma canonica con un clic para que el rotulo de la cosa se sustituya automaticamente por el termino oficial de la organizacion.

**Contexto de negocio:**
La aceptacion es **destructiva a nivel visual**: el rotulo queda indistinguible de uno tecleado directamente en forma canonica. No hay marca residual tipo "(Opcloud) → OPCloud" ni indicador de sustitucion. Esto es una decision deliberada — el modelo final es "limpio", sin rastro del proceso de normalizacion. La sustitucion opera sobre atributos del thing segun [Glos 3.4].

**Criterios de aceptacion:**
- **Dado** que el modal esta abierto con el boton `OPCloud`, **cuando** hago clic en ese boton, **entonces**:
  - el modal se cierra,
  - `thing.name` se persiste con el valor `OPCloud` (no con el texto originalmente tecleado),
  - el canvas se re-renderiza con el nuevo rotulo,
  - la biblioteca lateral actualiza la entrada,
  - el OPL pane actualiza la oracion.
- **Dado** que habia multiples canonicas y elegi `led`, **cuando** confirmo, **entonces** `thing.name = "led"` y los demas canales reflejan `led`.
- **Dado** que acepte, **cuando** consulto el modelo persistido, **entonces** NO hay registro de cual fue el alias original (§6 doc fuente).

**Reglas y restricciones:**
- La sustitucion es irreversible sin undo (pregunta abierta: ¿undo restaura el texto tecleado o el canonico?).
- No persiste metadato `original_text` en el thing.
- Render sin animacion intermedia ni marca residual (§4.3).

**Modelo de datos tocado:**
- `thing.name` — string — persistente (valor canonico, NO valor tecleado).

**Dependencias:**
- Bloqueada por: HU-82.010, HU-82.011.
- Bloquea a: HU-82.015, HU-82.016.

**Integraciones:**
- Renderer canvas.
- Biblioteca lateral (HU-10.017).
- OPL pane (HU-10.016).
- Navigator (HU-10.018).

**Notas de evidencia:**
- Fuente: [Glos 3.4] paso 7, §4.3, §6, §7.1–7.4.
- Frames: frame_00012, frame_00033.
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [config, ontologia, modal, sustitucion, kernel, destructivo].

---

### HU-82.013 — Cerrar sin cambiar bajo reforzamiento Sugerir

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; C (condicional a reforzamiento).
**Superficie UI:** modal — enlace `Close Without Changing`.
**Gesto canonico:** clic en enlace textual.

**Historia:**
> Como modelador, quiero poder rechazar la sugerencia y preservar exactamente el texto que teclee cuando el reforzamiento es `Sugerir` para mantener autonomia cuando el alias es intencional.

**Contexto de negocio:**
Bajo `Sugerir`, la ontologia es una guia, no una ley. El modelador puede tener razones legitima para usar un alias (contexto historico, cita literal, ironia). El enlace `Close Without Changing` materializa esta opcion.

**Criterios de aceptacion:**
- **Dado** que `enforcement_level = Sugerir` y el modal esta abierto, **cuando** miro el pie del modal, **entonces** veo el enlace `Close Without Changing`.
- **Dado** que hago clic en `Close Without Changing`, **cuando** se ejecuta, **entonces**:
  - el modal se cierra,
  - `thing.name` persiste con el texto literal tecleado (ej. `Opcloud`, sin reescribir a `OPCloud`),
  - el OPL refleja el texto literal tecleado.
- **Dado** que `enforcement_level = Reforzar`, **cuando** miro el modal, **entonces** NO veo el enlace `Close Without Changing` (HU-82.014).
- **Dado** que cerre sin cambiar, **cuando** vuelvo a renombrar esa misma cosa con el mismo texto alias, **entonces** el modal **vuelve a abrirse** (la ontologia no "recuerda" el rechazo — §3.2).

**Reglas y restricciones:**
- El enlace solo existe bajo `Sugerir`, nunca bajo `None` (no hay modal) ni bajo `Reforzar`.
- Rechazar no persiste preferencia ni marca la cosa como "exenta".
- Texto literal se preserva caracter por caracter (no se trim ni normaliza).

**Dependencias:**
- Bloqueada por: HU-82.010, HU-82.009.

**Integraciones:**
- Popup de nombre (completa el flujo).

**Notas de evidencia:**
- Fuente: §3.3, §5.2.
- Transcripcion: "this is only done when the organization ontology is marked as suggested".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [config, ontologia, modal, close-without-changing, sugerir, autonomia].

---

### HU-82.014 — Bloquear cierre sin eleccion bajo reforzamiento Reforzar

**Actor primario:** ME.
**Actores secundarios:** MN (puede frustrarse).
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; C.
**Superficie UI:** modal `Organizational Ontology suggestsion`.
**Gesto canonico:** intento de cerrar (ESC, clic fuera, boton X si hubiera).

**Historia:**
> Como modelador bajo reforzamiento `Reforzar`, quiero que el modal me obligue a elegir una forma canonica antes de continuar para que la politica organizacional sea efectiva.

**Contexto de negocio:**
Bajo `Reforzar`, la ontologia es una ley dura. Permitir escape equivale a desactivarla. La ausencia del enlace `Close Without Changing` y el bloqueo de ESC/clic-fuera son los mecanismos que sostienen la politica.

**Criterios de aceptacion:**
- **Dado** que `enforcement_level = Reforzar` y el modal esta abierto, **cuando** miro el pie, **entonces** NO aparece el enlace `Close Without Changing`.
- **Dado** que presiono `ESC`, **cuando** el modal esta abierto en `Reforzar`, **entonces** el modal NO se cierra.
- **Dado** que hago clic fuera del modal, **cuando** esta en `Reforzar`, **entonces** NO se cierra.
- **Dado** que hago clic en un boton canonico, **cuando** se ejecuta, **entonces** sigue el flujo de HU-82.012 (sustitucion) y el modal se cierra.
- **Dado** que no hay canonica valida disponible (entrada corrupta), **cuando** se presenta el modal, **entonces** comportamiento = pregunta abierta (§4.5, §11 p.8).

**Reglas y restricciones:**
- Modal bloqueante: no se puede bypassar.
- Pregunta abierta (§11 p.8): ¿se bloquea la creacion completamente o se puede cancelar con `Escape` / cerrar tab?
- Pregunta abierta (§4.5): ¿que ocurre si no hay opcion canonica valida?

**Dependencias:**
- Bloqueada por: HU-82.009, HU-82.010.

**Integraciones:**
- Popup de nombre: el flujo original queda suspendido hasta que el modal resuelva.

**Notas de evidencia:**
- Fuente: §3.5, §4.5, §5.2, §5.3, §11 p.8.
- Transcripcion: "an admin can set it up to be enforced".
- Clase de afirmacion: confirmado por transcripcion (enforcement existe) + inferido (detalles de bloqueo ESC/clic).
- Etiqueta: `requires-clarification` sobre comportamiento exacto ante escape.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [config, ontologia, modal, reforzar, blocking, requires-clarification].

---

### HU-82.015 — Desactivar Auto Format cuando canonica tiene casing no estandar

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categorico:** U primario; K.
**Superficie UI:** popup-auto-format (checkbox `Auto Format`).
**Gesto canonico:** ninguno (efecto lateral de aceptar canonica).

**Historia:**
> Como modelador, quiero que el sistema desactive `Auto Format` automaticamente cuando la canonica tiene casing no estandar (ej. `OPCloud`, `LED`) para que la capitalizacion organizacional sobreviva al titulo automatico.

**Contexto de negocio:**
`Auto Format` (HU-10.006) capitaliza cada palabra al confirmar. Si la canonica es `OPCloud`, aplicar Auto Format la convertiria en `Opcloud`, destruyendo la intencion ontologica. El sistema detecta casing no estandar y desactiva automaticamente el checkbox del popup al aceptar la canonica, preservando el casing autoritativo. Esta interaccion sobre atributos del thing esta cubierta por [Glos 3.4].

**Criterios de aceptacion:**
- **Dado** que acepto canonica `OPCloud` con Auto Format inicialmente marcado, **cuando** se ejecuta la sustitucion, **entonces** `thing.name = "OPCloud"` (no `Opcloud`) y `Auto Format` queda desmarcado para esa confirmacion.
- **Dado** que la canonica tiene casing estandar (`Driver`, `Agent`), **cuando** acepto, **entonces** `Auto Format` permanece marcado (no hay conflicto).
- **Dado** que acepte una canonica no estandar y Auto Format quedo desmarcado, **cuando** vuelvo a editar el nombre y re-marco `Auto Format` manualmente, **entonces** el casing se normaliza y se pierde la forma ontologica (§4.2).
- **Dado** que `enforcement_level = Reforzar`, **cuando** re-marco Auto Format y confirmo, **entonces** vuelve a dispararse el modal ontologico (el rotulo re-formateado matchea como alias) — inferencia.

**Reglas y restricciones:**
- Casing "no estandar" detectado heuristicamente: al menos una letra mayuscula no-inicial (`OPCloud`, `LED`, `iOS`).
- La desactivacion aplica solo al popup actual; no persiste como preferencia.
- Reactivar manualmente Auto Format revierte el casing.

**Modelo de datos tocado:**
- `thing.name` — persistente.
- `popup.auto_format_checkbox` — transitorio (estado UI del popup).

**Dependencias:**
- Bloqueada por: HU-82.012.
- Relaciona: HU-10.006.

**Notas de evidencia:**
- Fuente: §4.2, [Glos 3.4].
- Frames: frame_00007, frame_00033.
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [config, ontologia, auto-format, casing, interaccion-popup].

---

### HU-82.016 — Reflejar rotulo canonico en canvas, biblioteca, OPL y navigator

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categorico:** V primario; L.
**Superficie UI:** canvas + panel `Draggable OPM Things` + OPL pane + OPD Navigator.
**Gesto canonico:** ninguno (reactivo al cambio de `thing.name`).

**Historia:**
> Como modelador, quiero que la sustitucion de rotulo por la forma canonica se propague instantaneamente a todos los canales visuales para que el modelo sea consistente de inmediato.

**Contexto de negocio:**
El thing.name es una fuente unica; sus vistas son multiples (canvas, biblioteca lateral, OPL, navigator). La propagacion ya esta cubierta por HU-10.016 (OPL), HU-10.017 (biblioteca) y HU-10.018 (navigator). Esta HU explicita que la sustitucion ontologica dispara el mismo flujo de propagacion que cualquier rename — no requiere codigo especial. La propagacion de atributos sigue [Glos 3.4].

**Criterios de aceptacion:**
- **Dado** que acepte la canonica `OPCloud`, **cuando** miro el canvas, **entonces** el rectangulo muestra `OPCloud`.
- **Dado** que acepte la canonica, **cuando** miro la biblioteca lateral, **entonces** la entrada muestra `OPCloud` (no el alias original).
- **Dado** que acepte la canonica, **cuando** miro el OPL pane, **entonces** aparece `OPCloud is informatical and systemic object.` (actualizado desde `Object 1 is …`).
- **Dado** que acepte la canonica, **cuando** miro el OPD Navigator (miniatura), **entonces** se ve reflejado el nuevo rotulo en cuasi-tiempo-real (<500ms).
- **Dado** que el rotulo canonico sobrevive a guardar/cargar, **cuando** guardo y recargo, **entonces** los cuatro canales siguen mostrando `OPCloud`.

**Reglas y restricciones:**
- Ninguna marca residual visual ni metadato visible sobre "este rotulo vino de ontologia".
- La propagacion es sincrona con el cierre del modal.
- Esta HU **no** introduce codigo nuevo — valida que el pipeline de rename existente funcione end-to-end con sustitucion ontologica.

**Modelo de datos tocado:**
- Lectura reactiva sobre `thing.name`; sin escritura adicional.

**Dependencias:**
- Bloqueada por: HU-82.012.
- Relaciona: HU-10.016, HU-10.017, HU-10.018.

**Integraciones:**
- Renderer canvas.
- Biblioteca lateral.
- OPL pane (`src/render/opl-renderer.ts`).
- Navigator.

**Notas de evidencia:**
- Fuente: §7.1–7.4, [Glos 3.4].
- Frames: frame_00012, frame_00033.
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [config, ontologia, opl, biblioteca, navigator, lente, propagacion].

---

### HU-82.017 — Aplicar sugerencia tambien al renombrar cosa existente

**Actor primario:** ME.
**Actores secundarios:** MN.
**Tipo:** mixto.
**Nivel categorico:** U primario; K.
**Superficie UI:** popup-auto-format reabierto sobre thing existente → modal.
**Gesto canonico:** doble clic (o accion rename) sobre thing + escritura + `Update`.

**Historia:**
> Como modelador experto, quiero que la sugerencia ontologica se dispare tambien al renombrar una cosa ya existente para que el reforzamiento aplique a todo el ciclo de vida del rotulo, no solo a la creacion.

**Contexto de negocio:**
Si la ontologia solo actuara en creacion, seria trivial bypassear: crear con nombre A y luego renombrar a alias B. El reforzamiento debe ser consistente; cualquier confirmacion de nombre dispara el match. La convencion de terminos sigue [opm-iso-19450-es.md §Terminos].

**Criterios de aceptacion:**
- **Dado** que tengo una cosa existente con nombre `X`, **cuando** la renombro a un alias registrado y confirmo con `Update`, **entonces** se dispara el modal de sugerencia (mismo flujo que HU-82.010).
- **Dado** que rechace (Close Without Changing) el modal al renombrar, **cuando** vuelvo a editar el nombre con el mismo texto, **entonces** el modal **vuelve a aparecer** (la sugerencia no guarda estado por-cosa).
- **Dado** que estaba con `enforcement_level = Reforzar`, **cuando** renombro a un alias, **entonces** aplica el bloqueo total (HU-82.014).
- **Dado** que renombro una cosa a un texto sin match, **cuando** confirmo, **entonces** NO se dispara el modal y el rename procede normal.
- **Dado** que la cosa ya tenia un rotulo canonico y teclee el mismo canonico, **cuando** confirmo, **entonces** NO se dispara el modal (no hay match, canonica ≠ alias).

**Reglas y restricciones:**
- La deteccion en rename usa el **texto nuevo** (post-edicion), no el texto previo de la cosa.
- Bug potencial: ¿se aplica a renames via import OPC? — pregunta abierta (§11 p.6 orienta pero no cierra).

**Dependencias:**
- Bloqueada por: HU-82.010.
- Relaciona: HU-10.003 (rename via popup).

**Notas de evidencia:**
- Fuente: §3.2, [Glos 3.4].
- Transcripcion: "tras volver a abrir el editor de nombre y seleccionar de nuevo una forma sugerida, la sustitucion se reaplica".
- Clase de afirmacion: confirmado por transcripcion.
- Pregunta abierta §11 p.6: ¿aplica tambien a rename masivo o a import? — etiqueta `requires-clarification`.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [config, ontologia, rename, modal, reforzamiento, requires-clarification].

---

### HU-82.018 — Importar ontologia desde CSV

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** X (integracion externa) primario; C, P.
**Superficie UI:** panel admin — boton `Import CSV` (hipotetico, no observado en frames).
**Gesto canonico:** clic + selector de archivo + confirmacion.

**Historia:**
> Como admin, quiero importar una ontologia completa desde un archivo CSV para poblar rapido mi organizacion con un glosario existente sin tener que teclear entrada por entrada.

**Contexto de negocio:**
Las organizaciones suelen tener glosarios previos en Excel, sistemas de gestion de terminologia o exports de otras herramientas. Poder cargarlos via CSV acelera la adopcion masiva de la ontologia, en especial para organizaciones grandes. **Esta HU no esta observada en los frames** de OPCloud pero es solicitud directa del caller y resuelve un caso legitimo de producto.

**Criterios de aceptacion:**
- **Dado** que estoy en el panel admin, **cuando** hago clic en `Import CSV`, **entonces** se abre un selector de archivo.
- **Dado** que selecciono un CSV con columnas `canonical,aliases`, **cuando** confirmo, **entonces** las filas del CSV se agregan a la tabla.
- **Dado** que el CSV tiene una entrada con canonica ya existente en la ontologia, **cuando** importo, **entonces** aplica la politica de colision: **pregunta abierta** (¿sobrescribe, fusiona alias, descarta, pregunta al usuario?).
- **Dado** que el CSV esta malformado, **cuando** importo, **entonces** se muestra un error con la linea ofensora y la ontologia NO cambia.
- **Dado** que importe N entradas, **cuando** miro la tabla, **entonces** veo N filas nuevas en modo editable (pendientes de `Save`).

**Reglas y restricciones:**
- Formato CSV estandar: primera linea header (`canonical,aliases`), siguientes lineas datos.
- Dentro de la columna `aliases` el separador interno sigue siendo `;` (paralelo con panel manual).
- Escape de `;` y `,` dentro de tokens: pregunta abierta.
- No se observo en frames; HU derivada del caller, contextualmente razonable.

**Modelo de datos tocado:**
- Carga masiva sobre `organization.ontology.entries[]`.

**Dependencias:**
- Bloqueada por: HU-82.002.
- Bloquea a: HU-82.019 (round-trip export-import).

**Integraciones:**
- Parser CSV (inferido: usar libreria estandar del stack; vendor o Bun stdlib).
- Persistencia organizacional.

**Notas de evidencia:**
- Fuente: **no observado en doc fuente**; solicitado por caller.
- Clase de afirmacion: hipotesis (feature nueva razonable, pendiente de decision de producto).
- Etiqueta: `requires-clarification` (colision + escape + UI exacta).

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [config, ontologia, import, csv, integracion-externa, requires-clarification, hipotesis].

---

### HU-82.019 — Exportar ontologia a CSV para respaldo y portabilidad

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** X primario; C.
**Superficie UI:** panel admin — boton `Export CSV` (hipotetico, no observado).
**Gesto canonico:** clic en boton.

**Historia:**
> Como admin, quiero descargar la ontologia completa de mi organizacion como CSV para respaldo, auditoria o migracion a otra instancia de OPCloud.

**Contexto de negocio:**
El export complementa al import (HU-82.018) — sin el la ontologia queda cautiva del sistema. Es especialmente critico para auditoria externa, para compartir el glosario con contratistas, o para migraciones entre instancias (tenants). **Tampoco observado en frames**; derivada del caller.

**Criterios de aceptacion:**
- **Dado** que tengo la ontologia poblada, **cuando** hago clic en `Export CSV`, **entonces** se descarga un archivo `.csv` con columnas `canonical,aliases` y una fila por entrada.
- **Dado** que exporte, **cuando** abro el CSV en Excel/LibreOffice, **entonces** se lee correctamente (UTF-8, headers, separador `,`).
- **Dado** que exporte y re-importe en otra instancia, **cuando** comparo ontologias, **entonces** son identicas (round-trip integro).
- **Dado** que la ontologia esta vacia, **cuando** exporto, **entonces** el archivo contiene solo el header.

**Reglas y restricciones:**
- Encoding: UTF-8.
- Separador externo: `,` (CSV estandar).
- Separador interno en columna `aliases`: `;` (coherente con el panel manual).
- Quote de campos con comas internas: siguiendo RFC 4180.
- No observado en frames.

**Modelo de datos tocado:**
- Lectura de `organization.ontology.entries[]`.

**Dependencias:**
- Relaciona: HU-82.018.

**Integraciones:**
- Generador CSV.
- Descarga de archivo (blob URL, etc.).

**Notas de evidencia:**
- Fuente: **no observado en doc fuente**; solicitado por caller.
- Pregunta abierta §11 p.2: "¿la tabla se exporta con el modelo?" — esta HU apunta a export **independiente del modelo**, no dentro del OPC.
- Clase de afirmacion: hipotesis.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [config, ontologia, export, csv, integracion-externa, requires-clarification, hipotesis].

---

### HU-82.020 — Auditar historial de sustituciones aceptadas por modelador

**Actor primario:** AO.
**Actores secundarios:** MN, ME (sujetos).
**Tipo:** opcloud-ui.
**Nivel categorico:** P primario; C, X.
**Superficie UI:** panel admin — tab `Audit Log` (hipotetico).
**Gesto canonico:** navegacion + filtros.

**Historia:**
> Como admin de organizacion con politicas de trazabilidad, quiero ver un historial de quien acepto que sugerencia y cuando para auditar el cumplimiento de la politica ontologica y detectar patrones de resistencia (muchos `Close Without Changing` sobre una entrada especifica).

**Contexto de negocio:**
La pregunta abierta §11 p.9 del doc fuente es explicita: *"¿Se registra auditoria de que modelador acepto que sugerencia?"*. Responder afirmativamente esta HU abre un canal de gobernanza clave: permite detectar alias obsoletos (muchos rechazos), modeladores desalineados con la politica, y mejorar la ontologia por feedback observado. **No observado en frames** — es una extension razonable.

**Criterios de aceptacion:**
- **Dado** que la feature de auditoria esta activa, **cuando** un modelador acepta una sustitucion, **entonces** se registra un evento `ontology.substitution.accepted` con `{user_id, model_id, thing_id, original_text, canonical, timestamp}`.
- **Dado** que un modelador cierra sin cambiar, **cuando** ocurre bajo `Sugerir`, **entonces** se registra `ontology.substitution.rejected` con el mismo payload.
- **Dado** que soy admin, **cuando** abro el tab `Audit Log`, **entonces** veo una tabla filtrable por usuario, entrada ontologica, fecha, accion (accepted/rejected).
- **Dado** que aplico filtro "entrada = OPCloud, accion = rejected", **cuando** aplico, **entonces** veo solo los eventos de rechazo sobre esa entrada.
- **Dado** que hay N rechazos sobre una entrada en el ultimo mes, **cuando** superan un umbral configurable, **entonces** aparece un indicador `Alerta: entrada con alta tasa de rechazo` en el panel admin (hipotetico).
- **Dado** que un evento es antiguo (>retention), **cuando** se ejecuta el rollover, **entonces** se purga con politica definida.

**Reglas y restricciones:**
- Retention: pregunta abierta (90 dias por default propuesto).
- GDPR / compliance: los registros incluyen `user_id`; politica de retencion y right-to-erase son **pregunta abierta**.
- No se registra el contexto semantico (que modelo, que seccion) mas alla del `model_id + thing_id`.

**Modelo de datos tocado:**
- `organization.ontology.audit_log[*]` — append-only — persistente.
- Campos: `id, type, user_id, model_id, thing_id, entry_id, original_text, canonical_chosen, timestamp`.

**Dependencias:**
- Bloqueada por: HU-82.012, HU-82.013, HU-82.014, HU-82.017.
- Relaciona: HU-40.xxx (permisos admin), EPICA-D0 (analisis).

**Integraciones:**
- Event log de persistencia (`src/persistencia/`).
- Panel admin con nueva vista.
- Posible export del log como CSV (paralelo a HU-82.019).

**Notas de evidencia:**
- Fuente: **no observado en doc fuente**; derivado de §11 pregunta 9 + solicitud del caller.
- Clase de afirmacion: hipotesis.
- Etiqueta: `requires-clarification` (retention, GDPR, umbral, UI exacta).

**Prioridad:** W (won't-have en el ciclo actual — requiere infraestructura de event log organizacional).
**Tamano:** L.
**Etiquetas:** [config, ontologia, auditoria, persistencia, event-log, gobernanza, requires-clarification, hipotesis].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q82.1** (§11 p.1): ¿Como se comporta un modelo al abrirse en otra organizacion con tabla distinta? ¿los rotulos se vuelven a normalizar, o se preservan como tecleados? — Impacta HU-82.012 (sustitucion destructiva vs metadato). Potencial HU-82.021 futura.
- **Q82.2** (§11 p.2): ¿La tabla se exporta con el modelo (OPC/JSON) o queda externa? — Relaciona HU-82.019 (export independiente) con EPICA-70 (interop-opcat).
- **Q82.3** (§11 p.3): ¿Existe scoping por folder, por modelo o por rol? Hoy el reforzamiento es a nivel de organizacion (HU-82.009). Scoping fino es extension futura.
- **Q82.4** (§11 p.4): Colision — ¿que pasa si un alias aparece en dos entradas distintas? Afecta HU-82.011 (¿se muestran canonicas de ambas entradas?).
- **Q82.5** (§11 p.5): Case-sensitivity del match. Evidencia mixta. Afecta HU-82.004, HU-82.010.
- **Q82.6** (§11 p.6): ¿`Sugerir` y `Reforzar` aplican a rename ademas de creacion? Transcripcion sugiere ambos; HU-82.017 asume si con etiqueta `requires-clarification`.
- **Q82.7** (§11 p.7): ¿El match aplica a procesos, estados, links, ademas de objetos? Los ejemplos observados son solo objetos. Afecta cobertura de HU-82.010.
- **Q82.8** (§11 p.8): Bajo `Reforzar` con rechazos multiples, ¿se bloquea completamente o se puede cancelar con `Escape`/cerrar tab? Afecta HU-82.014.
- **Q82.9** (§11 p.9): Auditoria de sustituciones — respondida parcialmente por HU-82.020 (hipotetica).
- **Q82.10** (derivada): Separador `;` sin escape — ¿como declarar un alias que contenga literalmente `;`? Afecta HU-82.003, HU-82.004.
- **Q82.11** (derivada): Undo despues de aceptar sustitucion — ¿restaura el alias tecleado o el canonico? No observado.
- **Q82.12** (§9): Erratas literales en el modal (`suggestsion`, `onlology`). Al reimplementar en este repo, se corrigen o se preservan como homenaje/fidelidad. Decision de producto.

## Referencias cruzadas

- Doc fuente: `opcloud-reverse/82-config-organization-ontology.md`.
- Fuente normativa SSOT: `opm-iso-19450-es.md` [Glos 3.4] atributos, [opm-iso-19450-es.md §Terminos] convenciones de nombrado.
- Evidencia OPCloud: `JOYAS.md`, `sandbox-data/`, `assets/svg/`, `decompiled/`.
- Epicas relacionadas:
  - **EPICA-10** (canvas-creacion-cosas) — HU-10.003, HU-10.005 (popup de nombre donde se intercepta el match); HU-10.006 (Auto Format que interactua con HU-82.015); HU-10.016/17/18 (OPL, biblioteca, navigator que reflejan la sustitucion).
  - **EPICA-40** (colaboracion-permisos) — rol AO y gating del panel admin.
  - **EPICA-70** (interop-opcat) — relaciona con Q82.2 (export de ontologia con el modelo).
  - **EPICA-71** (interop-csv) — relaciona con HU-82.018, HU-82.019 (import/export CSV).
  - **EPICA-80** (config-user-org) — Settings como superficie donde vive el sub-item `Organization Ontology` y `OPCloud Settings`.
  - **EPICA-81** (config-style-defaults) — patron paralelo de defaults a nivel organizacional.
  - **EPICA-A0** (extension-stereotypes) — pregunta no explicita pero relacionada: ¿mapeo thing → termino canonico debe cruzarse con mapeo thing → stereotype? Escalable a futuro.
  - **EPICA-D0** (analysis-missing-knowledge) — auditoria HU-82.020 alimenta analisis de gaps ontologicos.
- Invariantes del repo:
  - `src/nucleo/tipos.ts` — `thing.name` es el unico campo mutado; sin metadato adicional en kernel.
  - `src/nucleo/validacion/` — potencial nuevo pass `normalizacionOntologica` que lea config y aplique match antes del commit.
  - `src/persistencia/` — scope de organizacion (separado de workspace/modelo), nueva entidad `organization.ontology`.
  - `src/ui/` — nuevo modal ontologico + nueva vista de panel admin.
  - `src/render/opl-renderer.ts` — sin cambios (consume `thing.name` canonico igual que cualquier rename).
  - SSOT OPM: la ontologia organizacional **no extiende la gramatica OPM** — es capa externa. No cita `V-xx` del SSOT visual.
