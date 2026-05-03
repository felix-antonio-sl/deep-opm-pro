---
epica: "EPICA-A1"
titulo: "Extension — OPM Requirements Modeling (requisitos como objetos OPM con trazabilidad, plantilla canonica y vistas proyectadas)"
doc_fuente: "opcloud-reverse/a1-extension-requirements.md"
estado: "revision-piloto"
revision_piloto: "epica-10-canvas-creacion-cosas.md"
last_check: 2026-04-28
prioridad_predominante: "S"
hu_emitidas: 34
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "EPICA-10 revision-piloto (Tipo/SSOT/Fuente)"
---

## Resumen

Esta epica cubre la especializacion del mecanismo generico de estereotipos al dominio **Requirements**: materializa el estereotipo `<<Requirement>>` como una extension completa del lenguaje OPM que permite anclar uno o varios requisitos a cualquier cosa (objeto, proceso o enlace) del modelo, agruparlos en un `Satisfied Requirement Set` canonico, trazarlos via etiqueta `Satisfied_Req#N`, enriquecerlos con una plantilla fija de 5 atributos (Name, ID, Essence, Satisfaction, Description), proyectarlos como **Requirement Views** (OPDs derivados por filtrado) y ocultarlos selectivamente del canvas sin borrarlos del modelo.

El corazon de la epica es la **trazabilidad bidireccional**: el modelo OPM pasa de ser una descripcion de la arquitectura del sistema a ser una descripcion de **que artefactos satisfacen que requisitos**, con proyeccion computacional (vistas) que responde la pregunta "que satisface Req#N?" en un OPD autocontenido. La SSOT OPM [Metod §8.3] reconoce la vista tematica "para revision de un requisito" como vista ad hoc valida, sin imponer formato a la plantilla de atributos, la convencion de etiquetas ni los comandos de menu.

Esta epica **hereda** del mecanismo generico de EPICA-A0 (declaracion de stereotypes, Set/Unlink generico, seccion "Stereotypes" del arbol) y **anade** lo especifico del dominio Requirements. Las HU aqui asumen que A0 esta disponible.

Las HU se numeran siguiendo la aparicion en el doc fuente, sin reordenar por prioridad. El mapa de correspondencia con las secciones del doc fuente se documenta en cada HU.

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-A1.001 | Ver grupo `OPM Requirements` en menu contextual de cosa o enlace | AD | S | XS | opcloud-ui | — |
| HU-A1.002 | Agregar primer requisito a una cosa (crea Set + instancia) | AD | S | M | mixto | — |
| HU-A1.003 | Auto-crear `Satisfied Requirement Set` como agregador canonico | AD | S | S | mixto | — |
| HU-A1.004 | Editar el identificador logico del requisito en la caja-estado `Req#N` | AD | S | S | mixto | — |
| HU-A1.005 | Agregar segundo y sucesivos requisitos reutilizando el Set existente | AD | S | S | mixto | — |
| HU-A1.006 | Re-numerar automaticamente los `#N` tras borrar una instancia | AD | S | S | opcloud-ui | — |
| HU-A1.007 | Diferenciar numeracion del objeto (`#M`) del identificador logico (`Req#N`) | AD | S | XS | mixto | — |
| HU-A1.008 | Compartir identidad logica entre dos instancias con el mismo `Req#N` | AD | S | M | mixto | [Metod §8.3] |
| HU-A1.009 | Agregar requisito sobre un enlace (no solo sobre cosa) | AD | S | M | mixto | — |
| HU-A1.010 | Asociar varios requisitos al mismo enlace separados por `;` | AD | S | S | opcloud-ui | — |
| HU-A1.011 | Mostrar etiqueta `Satisfied_Req#N` italica vertical sobre enlace | AD | S | S | opcloud-ui | — |
| HU-A1.012 | Abrir dialogo de propiedades del enlace con `Target Multiplicity`, `Requirement Set`, `Ordered` | AD | S | M | opcloud-ui | — |
| HU-A1.013 | Marcar el Set como ordenado con checkbox `Ordered` | AD | C | S | opcloud-ui | — |
| HU-A1.014 | Definir multiplicidad destino del enlace de trazabilidad | AD | S | S | mixto | [Glos 3.43] |
| HU-A1.015 | Proteger el nombre `Satisfied Requirement Set` como no editable | AD | S | XS | opcloud-ui | — |
| HU-A1.016 | Ocultar Set + requisitos de una cosa con `Toggle Satisfied Requirement Set` | AD | S | S | opcloud-ui | — |
| HU-A1.017 | Ocultar todos los requisitos del OPD con `Toggle All Model Requirements` | AD | S | S | opcloud-ui | — |
| HU-A1.018 | Ocultar etiqueta `Satisfied_Req#N` sobre enlace con `Toggle Satisfied Requirement on Link` | AD | S | XS | opcloud-ui | — |
| HU-A1.019 | Distinguir oculto-de-borrado (persistir modelo y OPL) | AD | S | XS | mixto | — |
| HU-A1.020 | Abrir dialogo `Create Or Update Requirement View` listando `Req#N` unicos | AD | S | M | mixto | [Metod §8.3] |
| HU-A1.021 | Generar OPD derivado `View of Requirement <Req#N> Satisfying Model Parts` | AD | S | L | mixto | [Metod §8.3] |
| HU-A1.022 | Aplicar cierre transitivo minimo (traer source/target del enlace etiquetado) | AD | S | M | mixto | [Metod §8.3] |
| HU-A1.023 | Mantener Requirement View como OPD read-only re-posicionable | AD | S | M | mixto | [Metod §8.3] |
| HU-A1.024 | Actualizar Requirement View existente desde el dialogo o el arbol | AD | S | S | mixto | [Metod §8.3] |
| HU-A1.025 | Conectar stereotype canonico `<<Requirement>>` con comando especifico | AD | S | S | opcloud-ui | — |
| HU-A1.026 | Desplegar plantilla canonica de 5 atributos via unfolding | AD | S | L | mixto | [Metod §8.1] |
| HU-A1.027 | Editar atributo `Essence` del requisito entre `operational/non-operational/hybrid` | AD | S | S | mixto | — |
| HU-A1.028 | Editar atributo `Satisfaction` del requisito entre `hard/soft` | AD | S | S | mixto | — |
| HU-A1.029 | Ampliar requisito con atributos adicionales mas alla de los 5 canonicos | AD | C | M | mixto | — |
| HU-A1.030 | Advertir perdida de valores al remover stereotype `<<Requirement>>` | AD | S | S | opcloud-ui | — |
| HU-A1.031 | Asociar URL de sistema externo con `Add Hyperlink URL` | AD | S | S | opcloud-ui | — |
| HU-A1.032 | Renderizar eco OPL especifico de requisitos con prefijo `<<Requirement>>` | AD | S | M | mixto | — |
| HU-A1.033 | Navegar rama `Requirement Views` del arbol OPD paralela a `SD` | AD | S | S | opcloud-ui | — |
| HU-A1.034 | Bloquear delete del `Satisfied Requirement #N` desde la vista del Set | AD | S | XS | mixto | — |

Total: **34 historias de usuario** (14 mixto, 20 opcloud-ui).

## Historias de usuario

### HU-A1.001 — Ver grupo `OPM Requirements` en menu contextual de cosa o enlace

**Actor primario:** AD (autor de dominio).
**Actores secundarios:** ME (experto), MN (novato explorando la extension).
**Tipo:** opcloud-ui.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §2, §5.2.
**Nivel categorico:** U (UI) primario; D (dominio) secundario.
**Superficie UI:** menu-contextual (halo `...` o clic derecho sobre cosa/enlace).
**Gesto canonico:** clic derecho o apertura de halo sobre cosa o enlace → expandir grupo.

**Historia:**
> Como autor de dominio, quiero ver un grupo `OPM Requirements` en el menu contextual de cualquier cosa o enlace para acceder a los comandos de agregar requisito y crear vista sin abandonar el canvas.

**Contexto de negocio:**
El grupo canonico centraliza los comandos especificos de la extension de requisitos. Reducir la busqueda visual del usuario a un lugar conocido del menu contextual reduce friccion y ensena la disponibilidad de la feature. El narrador confirma: "there is new group here as called opm requirements".

**Criterios de aceptacion:**
- **Dado** que tengo seleccionada una cosa (objeto o proceso), **cuando** abro el halo `...` o hago clic derecho, **entonces** veo el grupo `OPM Requirements` expandible con al menos dos comandos: `Add Requirement` y `Create Requirement View`.
- **Dado** que tengo seleccionado un enlace, **cuando** abro el menu contextual, **entonces** tambien veo el grupo `OPM Requirements` con los comandos aplicables al enlace (ver HU-A1.009).
- **Dado** que estoy sobre un `Satisfied Requirement #N` ya creado, **cuando** abro el menu contextual, **entonces** aparecen comandos adicionales: `Connect Requirement Stereotype`, `Remove Requirement Stereotype`, `Add Hyperlink URL`.

**Reglas y restricciones:**
- El grupo es siempre visible en cosas y enlaces, independiente de si ya tienen o no requisitos asociados.
- Los comandos adicionales sobre instancias de requisito aparecen solo cuando el stereotype esta o puede estar aplicado.

**Modelo de datos tocado:**
- Ninguno directo; solo render del menu.

**Dependencias:**
- Bloqueada por: EPICA-A0 (mecanismo generico de stereotypes).
- Bloquea a: HU-A1.002, HU-A1.009, HU-A1.020, HU-A1.025.

**Integraciones:**
- Menu contextual generico.

**Notas de evidencia:**
- Fuente: `opcloud-reverse/a1-extension-requirements.md` §2, §5.2.
- Frames: frame_00015 (halo sobre Door).
- Transcripcion: "there is new group here as called opm requirements".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [requirement, ui, context-menu, extension].

---

### HU-A1.002 — Agregar primer requisito a una cosa (crea Set + instancia)

**Actor primario:** AD.
**Actores secundarios:** ME.
**Tipo:** mixto.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §3.1.
**Nivel categorico:** K (kernel — crea entidades y enlaces) primario; V (render), L (OPL) secundarios.
**Superficie UI:** menu-contextual + canvas-opd + opl-pane.
**Gesto canonico:** clic en `OPM Requirements > Add Requirement`.

**Historia:**
> Como autor de dominio, quiero invocar `Add Requirement` sobre una cosa para crear automaticamente el contenedor canonico y el primer requisito satisfactorio anclado a ella.

**Contexto de negocio:**
El flujo de un solo clic que materializa tres entidades (Set, instancia, caja-estado) y dos enlaces (exhibition del Set, aggregation de la instancia al Set) comprime la infraestructura de trazabilidad en un solo gesto. Sin este comando, el modelador tendria que montar manualmente el patron, perdiendo el beneficio de una convencion estable. La SSOT no regula formato de requisitos; la convencion de Set + instancia es OPCloud.

**Criterios de aceptacion:**
- **Dado** que tengo seleccionada una cosa `C` sin requisitos previos, **cuando** hago clic en `Add Requirement`, **entonces** se crean tres entidades: `Satisfied Requirement Set` (objeto), `Satisfied Requirement #1` (objeto, miembro del Set), y una caja-estado interior con contenido por defecto `Req#N` (N correlativo global del modelo).
- **Dado** que se creo la infraestructura, **cuando** consulto los enlaces, **entonces** hay un enlace de exhibition-characterization `C exhibits Satisfied Requirement Set` (triangulo vacio) y uno de aggregation `Satisfied Requirement Set consists of Satisfied Requirement #1` (triangulo solido).
- **Dado** que se creo la caja-estado, **cuando** miro su render, **entonces** usa borde oliva dorado saturado (convencion distintiva, ver §6.6 fuente).
- **Dado** que se creo el primer requisito, **cuando** consulto OPL, **entonces** aparecen las lineas canonicas: `<C> exhibits Satisfied Requirement Set.`, `Satisfied Requirement Set consists of Satisfied Requirement #1.`, `Satisfied Requirement #1 of <C> is Req#N.`

**Reglas y restricciones:**
- El prefijo `<<Requirement>>` en OPL aparece **solo** despues de anclar el stereotype (HU-A1.025); antes, la linea es sin prefijo.
- El Set es 1..1 con el owner: cada cosa tiene a lo sumo un Set.
- N del contenido `Req#N` es correlativo global del modelo (no per-owner).

**Modelo de datos tocado:**
- `satisfiedRequirementSet.id` — UUID — persistente.
- `satisfiedRequirementSet.owner` — FK cosa/enlace — persistente.
- `satisfiedRequirementSet.ordered` — boolean (default false) — persistente.
- `satisfiedRequirementInstance.id` — UUID — persistente.
- `satisfiedRequirementInstance.setId` — FK Set — persistente.
- `satisfiedRequirementInstance.requirementLogicalId` — string (contenido caja-estado) — persistente.
- `satisfiedRequirementInstance.visible` — boolean (default true) — persistente.

**Dependencias:**
- Bloqueada por: HU-A1.001, EPICA-10 (creacion de cosa base), EPICA-A0.
- Bloquea a: HU-A1.004, HU-A1.005, HU-A1.011, HU-A1.025.

**Integraciones:**
- OPL pane: emite tres lineas sinteticas.
- Arbol OPD: sin cambio a SD salvo que el Set aparezca en biblioteca.
- Biblioteca Draggable Things: aparece entrada del Set y de la instancia.

**Notas de evidencia:**
- Fuente: §3.1 pasos 1–6.
- Frames: frame_00015, frame_00025, frame_00030.
- Transcripcion: "it creates automatically a satisfied requirement set and inside it a satisfied requirement number one with a state box".
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [requirement, kernel, aggregation, exhibition, opl-eco].

---

### HU-A1.003 — Auto-crear `Satisfied Requirement Set` como agregador canonico

**Actor primario:** AD.
**Tipo:** mixto.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §3.1, §4.2, §6.3.
**Nivel categorico:** K primario; V secundaria.
**Superficie UI:** canvas-opd.
**Gesto canonico:** ninguno (efecto lateral de HU-A1.002).

**Historia:**
> Como autor de dominio, quiero que el `Satisfied Requirement Set` se cree automaticamente al agregar el primer requisito para no tener que instanciar el contenedor manualmente.

**Contexto de negocio:**
La aparicion del Set es una **consecuencia**, no una accion explicita del usuario. El producto asume que todo requisito vive dentro de un Set de su owner. Automatizar la creacion elimina 2 gestos (crear Set + conectarlo) y asegura que la estructura del modelo sea siempre conforme a la convencion.

**Criterios de aceptacion:**
- **Dado** que invoco `Add Requirement` sobre cosa sin Set previo, **cuando** se ejecuta, **entonces** se crea el Set con nombre exacto `Satisfied Requirement Set` y enlace de exhibition al owner.
- **Dado** que ya existe el Set, **cuando** invoco `Add Requirement` de nuevo, **entonces** NO se crea un segundo Set — se reutiliza el existente (ver HU-A1.005).
- **Dado** que el Set se creo, **cuando** consulto su nombre, **entonces** es exactamente `Satisfied Requirement Set` (ver HU-A1.015 para no-editabilidad).

**Reglas y restricciones:**
- Un owner tiene 0 o 1 Set. Nunca multiples.
- El Set no se crea vacio: siempre nace con al menos 1 miembro.
- Si se borra el ultimo miembro del Set, **ciclo de vida abierto** (Q4 fuente): ¿desaparece el Set?

**Modelo de datos tocado:**
- `satisfiedRequirementSet.*` (ver HU-A1.002).

**Dependencias:**
- Bloqueada por: HU-A1.002.
- Relaciona: HU-A1.015 (nombre no editable).

**Integraciones:**
- OPL pane.

**Notas de evidencia:**
- Fuente: §3.1, §6.3, §4.2.
- Clase de afirmacion: observado + confirmado.
- Pregunta abierta: Q4 sobre ciclo de vida del Set vacio.
- Etiqueta: `requires-clarification` (parcial).

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [requirement, kernel, contenedor, auto-creacion].

---

### HU-A1.004 — Editar el identificador logico del requisito en la caja-estado `Req#N`

**Actor primario:** AD.
**Tipo:** mixto.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §3.1, §6.1.
**Nivel categorico:** U primario; K (propaga a `requirementLogicalId`).
**Superficie UI:** caja-estado interior del `Satisfied Requirement #N`.
**Gesto canonico:** doble clic en caja-estado + edicion + Enter/confirmar.

**Historia:**
> Como autor de dominio, quiero editar el contenido de la caja-estado del requisito para asignarle un identificador logico significativo (p. ej. `Req#5`, `SYS-REQ-014`, etc.).

**Contexto de negocio:**
El identificador logico es la **clave de unicidad** del requisito en el modelo. Dos instancias con el mismo identificador se tratan como el mismo requisito conceptual; por eso el contenido de la caja no es mero cosmetica, es la identidad. El default `Req#N` con N correlativo es solo una sugerencia editable.

**Criterios de aceptacion:**
- **Dado** que tengo un `Satisfied Requirement #N` recien creado, **cuando** hago doble clic en su caja-estado, **entonces** el contenido entra en modo edicion con el texto preseleccionado.
- **Dado** que escribo `Req#5` y confirmo, **cuando** la caja sale de edicion, **entonces** `requirementLogicalId = "Req#5"` y el render de la caja muestra `Req#5`.
- **Dado** que edito el contenido, **cuando** consulto OPL, **entonces** la linea `Satisfied Requirement #N of <C> is <nuevo valor>.` refleja el cambio.
- **Dado** que tengo dos instancias del mismo identificador, **cuando** edito una, **entonces** el cambio **solo afecta esa instancia** (no propaga al otro requisito logico automaticamente — decision del modelador).

**Reglas y restricciones:**
- Igualdad estricta textual: `Req#1` ≠ `Req #1` (espacio extra crea duplicado — ver HU-A1.020).
- No hay normalizacion automatica (Auto Format sobre `Req#N` es **pregunta abierta**: Q12 fuente).
- La caja-estado acepta texto libre; no hay regex forzado observado.

**Modelo de datos tocado:**
- `satisfiedRequirementInstance.requirementLogicalId` — string — persistente.

**Dependencias:**
- Bloqueada por: HU-A1.002.
- Bloquea a: HU-A1.008, HU-A1.020.

**Integraciones:**
- OPL pane.
- Dialogo `Create Requirement View` (lista los `Req#N` unicos).

**Notas de evidencia:**
- Fuente: §3.1 paso 5, §6.1.
- Frames: frame_00025 (valor `Req#1` visible).
- Clase de afirmacion: observado + confirmado.
- Pregunta abierta Q12 sobre Auto Format.
- Etiqueta: `requires-clarification` (parcial).

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [requirement, ui, estado, rename, identidad].

---

### HU-A1.005 — Agregar segundo y sucesivos requisitos reutilizando el Set existente

**Actor primario:** AD.
**Tipo:** mixto.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §3.3.
**Nivel categorico:** K primario; V secundaria.
**Superficie UI:** menu-contextual + canvas.
**Gesto canonico:** clic en `Add Requirement` sobre cosa que ya tiene Set.

**Historia:**
> Como autor de dominio, quiero invocar `Add Requirement` varias veces sobre la misma cosa para sumar mas requisitos al Set existente sin duplicar el contenedor.

**Contexto de negocio:**
Muchas cosas del sistema satisfacen simultaneamente varios requisitos. El comando debe ser idempotente respecto del contenedor: sigue funcionando tras la primera invocacion, anadiendo miembros al Set. Esta simetria es critica para la ergonomia del modelado.

**Criterios de aceptacion:**
- **Dado** que una cosa `C` ya tiene `Satisfied Requirement Set` con 1 miembro, **cuando** invoco `Add Requirement` de nuevo, **entonces** se crea `Satisfied Requirement #2` dentro del mismo Set (no se crea un segundo Set).
- **Dado** que invoco `Add Requirement` tres veces sobre la misma cosa, **cuando** miro el Set, **entonces** contiene `#1`, `#2`, `#3` con cajas `Req#1`, `Req#2`, `Req#3` (defaults).
- **Dado** que agregue varios, **cuando** consulto OPL, **entonces** aparece `Satisfied Requirement Set consists of Satisfied Requirement #1, Satisfied Requirement #2, Satisfied Requirement #3.` (forma canonica de aggregation multiple).

**Reglas y restricciones:**
- El sufijo `#N` del objeto OPM es correlativo dentro del Set (local al Set), no global del modelo.
- El contenido de la caja `Req#N` usa N correlativo global (diferente semantica — ver HU-A1.007).

**Modelo de datos tocado:**
- Incremento de `satisfiedRequirementSet.members`.

**Dependencias:**
- Bloqueada por: HU-A1.002, HU-A1.003.
- Bloquea a: HU-A1.006, HU-A1.007.

**Integraciones:**
- OPL pane.
- Biblioteca Draggable Things.

**Notas de evidencia:**
- Fuente: §3.3 pasos 1–2.
- Frames: frame_00075 (multiples `Satisfied Requirement #N` coexisten).
- Transcripcion: "the set is reused and a new number two is added".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [requirement, kernel, aggregation, idempotente].

---

### HU-A1.006 — Re-numerar automaticamente los `#N` tras borrar una instancia

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §3.3.
**Nivel categorico:** K.
**Superficie UI:** canvas + arbol.
**Gesto canonico:** ninguno (efecto lateral de borrar).

**Historia:**
> Como autor de dominio, quiero que al borrar un `Satisfied Requirement #N` los restantes se re-numeren densamente para no dejar huecos en la secuencia del Set.

**Contexto de negocio:**
La numeracion densa mantiene el modelo limpio y evita ambiguedades visuales (nunca existe `#1, #3` sin `#2`). Es una decision de OPCloud explicitamente confirmada por el narrador. El identificador logico (`Req#N` del contenido) es independiente y no se re-numera.

**Criterios de aceptacion:**
- **Dado** que un Set tiene `#1`, `#2`, `#3`, **cuando** borro `#2`, **entonces** el Set queda con `#1`, `#2` (el antiguo `#3` pasa a ser `#2`).
- **Dado** que hago la re-numeracion, **cuando** consulto el contenido de las cajas, **entonces** `requirementLogicalId` de cada instancia **no cambia** (solo cambia el sufijo `#N` del objeto OPM).
- **Dado** que borro el unico miembro del Set, **cuando** consulto el Set, **entonces** **pregunta abierta** Q4: ¿desaparece el Set con su enlace de exhibition?

**Reglas y restricciones:**
- Numeracion densa: siempre `#1..#K` sin huecos.
- Re-numeracion es atomica: no hay estado intermedio observable.
- El identificador logico (caja-estado) es inmune a la re-numeracion.

**Modelo de datos tocado:**
- `satisfiedRequirementInstance.ordinal` (derivable) — transitorio.

**Dependencias:**
- Bloqueada por: HU-A1.005, HU-A1.034.
- Relaciona: Q4 abierta (ciclo del Set vacio).

**Integraciones:**
- OPL pane (lineas se reordenan).

**Notas de evidencia:**
- Fuente: §3.3 paso 3.
- Transcripcion: "the numbers are automatically and if i will delete one of them it will go back to be number one or number two according to our needs".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [requirement, kernel, numeracion, auto-re-numeracion].

---

### HU-A1.007 — Diferenciar numeracion del objeto (`#M`) del identificador logico (`Req#N`)

**Actor primario:** AD.
**Tipo:** mixto.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §3.3.
**Nivel categorico:** K.
**Superficie UI:** canvas + caja-estado.
**Gesto canonico:** ninguno (regla de modelo).

**Historia:**
> Como autor de dominio, quiero que el sufijo `#M` del objeto OPM y el identificador logico `Req#N` de la caja-estado sean independientes para poder asignar al segundo `Satisfied Requirement #2` el identificador `Req#3` sin conflicto.

**Contexto de negocio:**
Separar "posicion ordinal en el Set" de "identidad logica del requisito" es la clave para que el mismo requisito pueda aparecer con `#M` distinto en dos owners distintos. La independencia de los dos contadores es una decision semantica, no un accidente.

**Criterios de aceptacion:**
- **Dado** que tengo `Satisfied Requirement #2` dentro del Set, **cuando** edito la caja-estado a `Req#3`, **entonces** el objeto OPM sigue siendo `Satisfied Requirement #2` y el identificador logico es `Req#3` — el OPL refleja ambos.
- **Dado** que dos instancias en owners distintos tienen la misma caja `Req#1`, **cuando** las comparo, **entonces** una puede ser `Satisfied Requirement #1 de Door`, la otra `Satisfied Requirement #1 de Peephole` (mismo sufijo pero distintos owners), o incluso `#1` y `#2` si los owners tienen distinta cantidad de requisitos.

**Reglas y restricciones:**
- `#M` es local al Set; `Req#N` es global al modelo pero sin contador automatico (el usuario puede saltar, ver HU-A1.020).

**Modelo de datos tocado:**
- `satisfiedRequirementInstance.ordinal` — derivable — transitorio.
- `satisfiedRequirementInstance.requirementLogicalId` — string — persistente.

**Dependencias:**
- Bloqueada por: HU-A1.005, HU-A1.006.

**Integraciones:**
- OPL pane: ambos aparecen en lineas distintas.

**Notas de evidencia:**
- Fuente: §3.3 paso 4.
- Frames: frame_00075 (tres instancias con combinaciones mixtas).
- Transcripcion: "the number of the requirement is automatic internal number of the object".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [requirement, kernel, independencia, identidad].

---

### HU-A1.008 — Compartir identidad logica entre dos instancias con el mismo `Req#N`

**Actor primario:** AD.
**Tipo:** mixto.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §3.1, §6.1.
**Nivel categorico:** K primario; L secundario.
**Superficie UI:** canvas + dialogo `Create Requirement View`.
**Gesto canonico:** ninguno (regla de modelo).

**Historia:**
> Como autor de dominio, quiero que dos `Satisfied Requirement #M` anclados a cosas distintas con el mismo contenido de caja-estado se traten como el mismo requisito logico para poder generar vistas agregadas del requisito.

**Contexto de negocio:**
Este es el **corazon del mecanismo de trazabilidad**. Sin identidad compartida, la Requirement View no podria recolectar todos los artefactos que satisfacen `Req#N`: cada instancia seria unica y las vistas serian triviales. La identidad compartida habilita la lente derivada. La SSOT [Metod §8.3] respalda el concepto de vista tematica por requisito.

**Criterios de aceptacion:**
- **Dado** que creo un requisito con caja `Req#1` anclado a `Door`, y otro con caja `Req#1` anclado a `Peephole`, **cuando** abro el dialogo `Create Requirement View`, **entonces** veo **una sola entrada** `Req#1` (no dos).
- **Dado** que genero la vista de `Req#1`, **cuando** la abro, **entonces** incluye tanto `Door` como `Peephole` como satisfactores del mismo requisito.
- **Dado** que dos instancias tienen cajas con contenidos que solo difieren en espacios/casing (`Req#1` vs `Req #1`), **cuando** el sistema compara, **entonces** las trata como DISTINTAS (igualdad textual estricta — ver HU-A1.020).

**Reglas y restricciones:**
- La clave logica del requisito es el **contenido textual exacto** de la caja-estado.
- No hay normalizacion: `Req#1` ≠ `Req #1` ≠ `req#1`.
- La edicion del identificador en una instancia **no propaga** a otras con el mismo identificador (propagar seria una feature distinta, no observada).

**Modelo de datos tocado:**
- `requirement.id` (identificador logico) — string — derivado de `instances[*].requirementLogicalId`.
- `requirement.instances` — coleccion de FK — derivable.

**Dependencias:**
- Bloqueada por: HU-A1.004.
- Bloquea a: HU-A1.020, HU-A1.021, HU-A1.022.

**Integraciones:**
- OPL pane.
- Dialogo Create Requirement View.

**Notas de evidencia:**
- Fuente: §3.1 variante final, §6.1.
- Frames: frame_00075 (dos `#1` con contenidos distintos).
- Transcripcion: "the key is the state box content, not the object name".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [requirement, kernel, trazabilidad, identidad-logica, requirement-logico].

---

### HU-A1.009 — Agregar requisito sobre un enlace (no solo sobre cosa)

**Actor primario:** AD.
**Tipo:** mixto.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §2, §3.1.
**Nivel categorico:** K primario; V, U secundarios.
**Superficie UI:** menu-contextual sobre enlace.
**Gesto canonico:** clic derecho sobre enlace + `OPM Requirements > Add Requirement`.

**Historia:**
> Como autor de dominio, quiero invocar `Add Requirement` sobre un enlace (no solo sobre una cosa) para anotar con trazabilidad una relacion en si misma cuando el requisito no es sobre un artefacto sino sobre la interaccion entre dos.

**Contexto de negocio:**
Muchos requisitos son sobre relaciones: "la comunicacion entre A y B debe usar TLS", "la agregacion de X a Y no debe exceder 1..10". Anclar el requisito al enlace (no a A ni a B) captura con precision su semantica. OPM trata los enlaces como entidades de primera clase, asi que anotar uno con un Set es consistente.

**Criterios de aceptacion:**
- **Dado** que hago clic derecho sobre un enlace, **cuando** abro el menu contextual, **entonces** aparece un menu analogo al de cosas con opcion `New requirement set` y checkbox para decidir si se muestra o no la etiqueta sobre el enlace.
- **Dado** que confirmo, **cuando** se ejecuta, **entonces** se crea un `Satisfied Requirement Set` **anclado al enlace** (no a uno de los extremos) con su primer miembro, igual que para cosas.
- **Dado** que el requisito quedo sobre el enlace, **cuando** consulto el render, **entonces** aparece la etiqueta `Satisfied_Req#N` italica vertical sobre el enlace (ver HU-A1.011).

**Reglas y restricciones:**
- El owner del Set puede ser una cosa O un enlace; el modelo debe soportar ambos.
- Cuando el owner es un enlace, el Set no se renderiza como un nodo visible independiente en el canvas — se muestra solo la etiqueta (divergencia visual respecto a owner=cosa, ver §3.1 variante).

**Modelo de datos tocado:**
- `satisfiedRequirementSet.ownerType` — `"thing" | "link"` — persistente.
- `satisfiedRequirementSet.ownerId` — FK — persistente.

**Dependencias:**
- Bloqueada por: HU-A1.001, HU-A1.002.
- Bloquea a: HU-A1.010, HU-A1.011, HU-A1.018.

**Integraciones:**
- OPL pane (linea para enlace anotado).
- Renderer (etiqueta sobre enlace).

**Notas de evidencia:**
- Fuente: §3.1 variante final, §2 ("Requirement sobre un enlace").
- Transcripcion: "this option will display the requirement set on the link".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [requirement, kernel, links, trazabilidad, link-anotado].

---

### HU-A1.010 — Asociar varios requisitos al mismo enlace separados por `;`

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §3.1, §3.2.
**Nivel categorico:** K primario; U secundario.
**Superficie UI:** dialogo propiedades del enlace, campo `Requirement Set`.
**Gesto canonico:** escritura en campo con `;` como separador.

**Historia:**
> Como autor de dominio, quiero introducir varios identificadores separados por punto y coma en el campo `Requirement Set` del enlace para trazar multiples requisitos a la misma relacion sin duplicar enlaces.

**Contexto de negocio:**
La convencion `;` como separador es la eleccion sintactica de OPCloud. Permite expresar "este enlace satisface Req#1, Req#3 y Req#7" sin atomizar en tres enlaces redundantes. La delimitacion es critica porque determina el parser.

**Criterios de aceptacion:**
- **Dado** que el dialogo del enlace esta abierto, **cuando** escribo `Req#1; Req#3; Req#7` en el campo `Requirement Set` y confirmo, **entonces** el enlace queda asociado a tres requisitos logicos.
- **Dado** que asocie tres requisitos, **cuando** miro el canvas, **entonces** puede haber una etiqueta compuesta o tres etiquetas (**pregunta abierta** sobre render exacto — no observado con >1).
- **Dado** que uso coma en vez de punto y coma, **cuando** confirmo, **entonces** el sistema lo trata como parte del identificador (no split) — la convencion es `;` estricta.

**Reglas y restricciones:**
- Separador fijo: `;`.
- Trim de espacios alrededor de cada token esperable (pregunta abierta — no confirmado).
- Cada identificador resultante puede reutilizar la identidad logica con cosas existentes (HU-A1.008).

**Modelo de datos tocado:**
- `linkAnnotation.requirementIds` — array de string — persistente.

**Dependencias:**
- Bloqueada por: HU-A1.009, HU-A1.012.

**Integraciones:**
- Parser del campo.
- Renderer (etiquetas multiples — abierto).

**Notas de evidencia:**
- Fuente: §3.1 variante enlace, §3.2.
- Transcripcion: "we should use the separating semicolon".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [requirement, kernel, links, parser, separador].

---

### HU-A1.011 — Mostrar etiqueta `Satisfied_Req#N` italica vertical sobre enlace

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §2, §9.4.
**Nivel categorico:** V.
**Superficie UI:** canvas — render de enlace.
**Gesto canonico:** ninguno (render declarativo).

**Historia:**
> Como autor de dominio, quiero ver una etiqueta italica vertical `Satisfied_Req#N` sobre el enlace anotado para leer de un vistazo que requisitos satisface la relacion.

**Contexto de negocio:**
La etiqueta italica vertical es la convencion OPCloud para distinguir trazabilidad de otras anotaciones del enlace (multiplicidad, nombre de relacion). El prefijo `Satisfied_` funciona como namespace semantico. Sin la etiqueta, la trazabilidad en enlaces seria invisible en el canvas.

**Criterios de aceptacion:**
- **Dado** que un enlace tiene asociado un requisito logico `Req#N`, **cuando** miro el canvas, **entonces** veo la etiqueta `Satisfied_Req#N` con estilo italica y orientacion vertical sobre el enlace.
- **Dado** que la visibilidad de la etiqueta esta activa (default), **cuando** consulto el render, **entonces** la etiqueta es legible sin solapamiento grave con el enlace.
- **Dado** que desactivo la visibilidad con toggle (HU-A1.018), **cuando** vuelvo a mirar, **entonces** la etiqueta desaparece del canvas pero el enlace sigue anotado.

**Reglas y restricciones:**
- Formato: `Satisfied_<id>` (con underscore, no espacio).
- Italica + orientacion vertical son convenciones visuales fijas.
- Default de visibilidad: activada.

**Modelo de datos tocado:**
- Ninguno adicional; proyeccion visual de `linkAnnotation.requirementIds` + `linkAnnotation.visible`.

**Dependencias:**
- Bloqueada por: HU-A1.009.

**Integraciones:**
- Renderer JointJS.

**Notas de evidencia:**
- Fuente: §2, §9.4.
- Frames: frame_00030 (`Satisfied_Req#1` italica vertical visible), frame_00100.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [requirement, render, links, etiqueta, italica].

---

### HU-A1.012 — Abrir dialogo de propiedades del enlace con `Target Multiplicity`, `Requirement Set`, `Ordered`

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §3.2, §5.3.
**Nivel categorico:** U primario; K secundario.
**Superficie UI:** modal flotante anclado al enlace.
**Gesto canonico:** crear enlace a requisito o editar enlace existente.

**Historia:**
> Como autor de dominio, quiero un dialogo unificado con los tres campos clave (Target Multiplicity, Requirement Set, Ordered) al crear o editar el enlace de trazabilidad para configurarlo en un solo gesto.

**Contexto de negocio:**
Concentrar los tres parametros en un dialogo evita el viaje a panels secundarios y garantiza que el usuario los vea siempre juntos. La multiplicidad del extremo-destino es central para modelos OPM rigurosos; `Ordered` es una decision que debe tomarse temprano.

**Criterios de aceptacion:**
- **Dado** que creo un enlace entre cosa y Set, **cuando** se crea, **entonces** se abre automaticamente el dialogo con los campos listados y tres botones: `Update`, `Style`, `Copy Style`, mas icono `?` azul.
- **Dado** que el dialogo esta abierto, **cuando** introduzco valores y presiono `Update`, **entonces** los valores quedan persistidos.
- **Dado** que el dialogo tiene el icono `?`, **cuando** hago hover, **entonces** aparece tooltip con ayuda contextual.

**Reglas y restricciones:**
- `Target Multiplicity`: numerico, default vacio.
- `Requirement Set`: texto, default `Req#N` siguiente disponible.
- `Ordered`: checkbox, default desmarcado.
- `Style` / `Copy Style` delegan a panel de estilo general (fuera de scope A1).

**Modelo de datos tocado:**
- `linkAnnotation.targetMultiplicity` — number nullable — persistente.
- `linkAnnotation.requirementIds` — array de string — persistente.
- `linkAnnotation.ordered` — boolean — persistente.

**Dependencias:**
- Bloqueada por: HU-A1.009.
- Bloquea a: HU-A1.010, HU-A1.013, HU-A1.014.

**Integraciones:**
- Panel de estilo del enlace (EPICA-14).

**Notas de evidencia:**
- Fuente: §3.2, §5.3.
- Frames: frame_00025.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [requirement, ui, modal, links, propiedades].

---

### HU-A1.013 — Marcar el Set como ordenado con checkbox `Ordered`

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §3.2, §11 Q1.
**Nivel categorico:** K primario.
**Superficie UI:** dialogo propiedades del enlace, checkbox `Ordered`.
**Gesto canonico:** marcar/desmarcar checkbox + confirmar.

**Historia:**
> Como autor de dominio, quiero marcar el `Satisfied Requirement Set` como ordenado para expresar que el orden de los requisitos en el Set es semanticamente relevante.

**Contexto de negocio:**
Algunos requisitos tienen precedencia ordinal (p. ej. "antes cumplir el de seguridad, luego el de performance"). El checkbox `Ordered` captura esa distincion gramatical. El narrador no activa `Ordered` en ningun frame, asi que el efecto visible es **pregunta abierta** Q1.

**Criterios de aceptacion:**
- **Dado** que el dialogo esta abierto, **cuando** marco el checkbox `Ordered` y confirmo, **entonces** `satisfiedRequirementSet.ordered = true` persiste.
- **Dado** que `ordered = true`, **cuando** consulto OPL, **entonces** la linea puede cambiar (hipotesis: agrega palabra `ordered` o `sequence`, **no observado** — Q1 fuente).
- **Dado** que `ordered = true`, **cuando** miro canvas, **entonces** **pregunta abierta**: ¿hay numeracion visible adicional sobre los miembros?

**Reglas y restricciones:**
- Default: desmarcado.
- Efecto visible/OPL sin observacion (Q1).
- Es bit persistente del Set, no per-miembro.

**Modelo de datos tocado:**
- `satisfiedRequirementSet.ordered` — boolean (default false) — persistente.

**Dependencias:**
- Bloqueada por: HU-A1.012.

**Integraciones:**
- OPL pane (posible, no confirmado).
- Renderer (posible, no confirmado).

**Notas de evidencia:**
- Fuente: §3.2, §11 Q1.
- Clase de afirmacion: observado (checkbox) + hipotesis (efecto).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [requirement, kernel, ordered, requires-clarification].

---

### HU-A1.014 — Definir multiplicidad destino del enlace de trazabilidad

**Actor primario:** AD.
**Tipo:** mixto.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §3.2.
**Nivel categorico:** K primario; V secundaria.
**Superficie UI:** dialogo propiedades del enlace, campo `Target Multiplicity`.
**Gesto canonico:** input numerico + confirmar.

**Historia:**
> Como autor de dominio, quiero definir la multiplicidad del extremo-destino del enlace de trazabilidad para expresar cuantas instancias del Set participan de la relacion (p. ej. `2` indica dos requisitos obligatorios).

**Contexto de negocio:**
La multiplicidad OPM es una anotacion clasica; el dialogo la expone directamente para que no requiera pase secundario. Se renderiza visualmente junto al triangulo del extremo-destino. La SSOT [Glos 3.43] define participacion como cuantificacion de enlace.

**Criterios de aceptacion:**
- **Dado** que introduzco `2` en `Target Multiplicity` y confirmo, **cuando** miro canvas, **entonces** aparece el numeral `2` junto al triangulo de exhibition.
- **Dado** que el campo queda vacio, **cuando** confirmo, **entonces** no se muestra ningun numeral (default implicito `1..*` o `0..*`, no confirmado).
- **Dado** que edito la multiplicidad, **cuando** consulto OPL, **entonces** la linea puede reflejar la multiplicidad en forma verbal (**pregunta abierta**).

**Reglas y restricciones:**
- Acepta valores numericos simples; rangos (`2..5`) **no observados** — abierto.
- Render: numeral junto al triangulo del destino.

**Modelo de datos tocado:**
- `linkAnnotation.targetMultiplicity` — number nullable — persistente.

**Dependencias:**
- Bloqueada por: HU-A1.012.

**Integraciones:**
- Renderer JointJS (numeral).
- OPL pane.

**Notas de evidencia:**
- Fuente: §3.2.
- Frames: frame_00065 (numeral `1` junto al triangulo), frame_00135 (numeral `2`).
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [requirement, kernel, multiplicidad, links].

---

### HU-A1.015 — Proteger el nombre `Satisfied Requirement Set` como no editable

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §4.2.
**Nivel categorico:** K primario; U secundaria.
**Superficie UI:** canvas — intento de rename.
**Gesto canonico:** intentar editar el nombre del Set.

**Historia:**
> Como autor de dominio, quiero que el nombre `Satisfied Requirement Set` este protegido contra edicion para preservar la convencion canonica y evitar que modelos divergentes rompan la semantica de trazabilidad.

**Contexto de negocio:**
El nombre fijo funciona como **marker canonico**: cualquier parser o lente que busque requisitos puede confiar en ese string. Permitir edicion romperia la reversibilidad del modelo y el vinculo con la convencion OPCloud.

**Criterios de aceptacion:**
- **Dado** que hago doble clic sobre el nombre del Set para editar, **cuando** intento cambiarlo, **entonces** el sistema rechaza la edicion (input disabled o rollback automatico).
- **Dado** que edito el nombre del Set via API, **cuando** valida el aplicador, **entonces** lanza error de invariante (si se expone API editorial).

**Reglas y restricciones:**
- Nombre fijo: `Satisfied Requirement Set` literal.
- Restriccion dura del kernel cuando se aplica el stereotype.
- Los miembros (`Satisfied Requirement #N`) SI son editables en sufijo (via re-numeracion auto) pero el nombre base tambien se considera protegido (confirmar Q).

**Modelo de datos tocado:**
- Ninguno; es validacion del aplicador.

**Dependencias:**
- Bloqueada por: HU-A1.003.

**Integraciones:**
- Validador del kernel.

**Notas de evidencia:**
- Fuente: §4.2.
- Transcripcion: "it is automatically named satisfying requirement set and we cannot change it".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [requirement, kernel, invariante, proteccion].

---

### HU-A1.016 — Ocultar Set + requisitos de una cosa con `Toggle Satisfied Requirement Set`

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §3.4, §5.1.
**Nivel categorico:** V primario; U secundario.
**Superficie UI:** toolbar secundaria, boton `Toggle Satisfied Requirement Set`.
**Gesto canonico:** clic sobre boton.

**Historia:**
> Como autor de dominio, quiero ocultar la maquinaria de requisitos (Set + miembros) de una cosa especifica con un solo clic para simplificar el canvas sin perder la informacion del modelo.

**Contexto de negocio:**
Los requisitos inflan el diagrama visualmente. Oculto ≠ borrado: el modelo persiste completo, solo se oculta visualmente. Esta separacion entre "modelo" y "vista" es clave para diagramas grandes.

**Criterios de aceptacion:**
- **Dado** que tengo una cosa con Set y requisitos renderizados, **cuando** hago clic en `Toggle Satisfied Requirement Set`, **entonces** el Set y sus miembros se ocultan del canvas pero persisten en el modelo.
- **Dado** que el toggle esta en estado oculto, **cuando** hago clic de nuevo, **entonces** se vuelven a mostrar.
- **Dado** que oculte, **cuando** consulto OPL, **entonces** **pregunta abierta**: ¿las lineas correspondientes tambien se ocultan? La spec sugiere que el OPL puede seguir mostrandolas (§3.4 final).

**Reglas y restricciones:**
- Scope del toggle: cosa seleccionada (Set + miembros de ESA cosa).
- No afecta requisitos de otras cosas.
- Persistencia del flag: per-OPD o global — **pregunta abierta** Q9.

**Modelo de datos tocado:**
- `satisfiedRequirementSet.visible` — boolean — persistente (scope Q9).

**Dependencias:**
- Bloqueada por: HU-A1.002.

**Integraciones:**
- Renderer.
- Toolbar secundaria (condicional a seleccion).

**Notas de evidencia:**
- Fuente: §3.4, §5.1.
- Frames: frame_00030 (tooltip visible).
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [requirement, ui, toggle, visibilidad].

---

### HU-A1.017 — Ocultar todos los requisitos del OPD con `Toggle All Model Requirements`

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §3.4, §5.1.
**Nivel categorico:** V.
**Superficie UI:** toolbar secundaria, boton `Toggle All Model Requirements`.
**Gesto canonico:** clic.

**Historia:**
> Como autor de dominio, quiero un toggle masivo que oculte todos los requisitos del OPD actual de un solo clic para revisar la arquitectura del sistema sin la capa de trazabilidad.

**Contexto de negocio:**
Cuando el modelador revisa el sistema "como sistema" (ignorando requisitos), necesita silencio visual total. Toggleando requisito por requisito seria tedioso; este boton resuelve en un gesto.

**Criterios de aceptacion:**
- **Dado** que el OPD tiene varias cosas con requisitos, **cuando** hago clic en `Toggle All Model Requirements`, **entonces** TODOS los Set + miembros del OPD se ocultan en un solo paso.
- **Dado** que ya estan ocultos, **cuando** hago clic de nuevo, **entonces** se muestran todos.
- **Dado** que hago el toggle masivo, **cuando** navego a otro OPD, **entonces** el scope es solo el OPD inicial (no afecta los demas — asumiendo Q9 per-OPD).

**Reglas y restricciones:**
- Scope: OPD actual.
- Es macro del toggle individual (HU-A1.016) aplicado a todos los Sets del OPD.

**Modelo de datos tocado:**
- Mismo campo que HU-A1.016 aplicado en bulk.

**Dependencias:**
- Bloqueada por: HU-A1.016.

**Integraciones:**
- Renderer.

**Notas de evidencia:**
- Fuente: §3.4, §5.1.
- Transcripcion: "toggle all model requirements hides the whole thing".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [requirement, ui, toggle, visibilidad, masivo].

---

### HU-A1.018 — Ocultar etiqueta `Satisfied_Req#N` sobre enlace con `Toggle Satisfied Requirement on Link`

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §3.4, §5.1.
**Nivel categorico:** V.
**Superficie UI:** toolbar secundaria (con enlace seleccionado).
**Gesto canonico:** clic.

**Historia:**
> Como autor de dominio, quiero conmutar la visibilidad de la etiqueta `Satisfied_Req#N` de un enlace especifico sin romper la asociacion logica para aligerar el canvas conservando el modelo.

**Contexto de negocio:**
Analogo al toggle del Set pero aplicado a etiquetas de trazabilidad sobre enlaces. Asegura que la visibilidad es una capa independiente del modelo.

**Criterios de aceptacion:**
- **Dado** que tengo un enlace con etiqueta visible, **cuando** hago clic en el toggle con el enlace seleccionado, **entonces** la etiqueta desaparece pero la asociacion `linkAnnotation.requirementIds` persiste.
- **Dado** que la etiqueta esta oculta, **cuando** abro el dialogo de propiedades, **entonces** sigo viendo los `Req#N` asociados.
- **Dado** que hago toggle de nuevo, **cuando** miro canvas, **entonces** la etiqueta regresa.

**Reglas y restricciones:**
- Scope: enlace seleccionado.
- No afecta el modelo logico.

**Modelo de datos tocado:**
- `linkAnnotation.labelVisible` — boolean — persistente.

**Dependencias:**
- Bloqueada por: HU-A1.011.

**Integraciones:**
- Renderer.

**Notas de evidencia:**
- Fuente: §3.4, §5.1.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [requirement, ui, toggle, links].

---

### HU-A1.019 — Distinguir oculto-de-borrado (persistir modelo y OPL)

**Actor primario:** AD.
**Tipo:** mixto.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §3.4.
**Nivel categorico:** K primario; V, L secundarios.
**Superficie UI:** ninguna (invariante de modelo).
**Gesto canonico:** ninguno.

**Historia:**
> Como autor de dominio, quiero que los toggles de visibilidad afecten solo el render (canvas + posiblemente OPL) sin borrar datos del modelo para poder restaurar la vista cuando quiera.

**Contexto de negocio:**
Invariante fundamental del producto: **render ≠ modelo**. Ocultar es una decision de presentacion, no semantica. Cualquier export, simulacion o vista derivada debe considerar el modelo completo, no el renderizado.

**Criterios de aceptacion:**
- **Dado** que oculte todos los requisitos con toggle, **cuando** guardo y recargo, **entonces** el estado oculto persiste (si el flag es persistente — Q9) pero el modelo logico sigue intacto.
- **Dado** que oculte requisitos, **cuando** genero Requirement View, **entonces** la vista **si** los incluye (se construye sobre modelo, no render).
- **Dado** que oculte requisitos, **cuando** export PDF (**pregunta abierta** Q7 fuente), **entonces** probablemente no aparecen en export.

**Reglas y restricciones:**
- Invariante dura: toggle no muta datos.
- Vistas derivadas leen modelo, no render.

**Modelo de datos tocado:**
- Solo flags `visible` en los nodos del render.

**Dependencias:**
- Bloqueada por: HU-A1.016, HU-A1.017, HU-A1.018.

**Integraciones:**
- Todas las lentes (OPL, views, export).

**Notas de evidencia:**
- Fuente: §3.4 final.
- Transcripcion: "the OPL may still show even hidden".
- Clase de afirmacion: observado + hipotesis.
- Etiqueta: `requires-clarification` (Q9).

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [requirement, kernel, invariante, visibilidad, requires-clarification].

---

### HU-A1.020 — Abrir dialogo `Create Or Update Requirement View` listando `Req#N` unicos

**Actor primario:** AD.
**Tipo:** mixto.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §3.5, §4.3.
**Nivel categorico:** L primario; U secundario.
**Superficie UI:** modal central `Create Or Update Requirement View`.
**Gesto canonico:** clic en boton `Create Requirement View` de toolbar principal o menu contextual.

**Historia:**
> Como autor de dominio, quiero abrir un dialogo central que liste los `Req#N` unicos del modelo para generar (o actualizar) la vista proyectada de cualquiera con un solo clic.

**Contexto de negocio:**
El dialogo es el **punto de entrada** al subsistema de vistas. Al listar identificadores unicos en vez de instancias, hace evidente la identidad logica compartida. Boton por fila = accion inmediata sin pasos intermedios. La SSOT [Metod §8.3] clasifica este tipo de vista como "vista ad hoc" para "revision de un requisito".

**Criterios de aceptacion:**
- **Dado** que el modelo tiene requisitos con identificadores `Req#1`, `Req#2`, `Req#3`, `Req#5`, **cuando** abro el dialogo, **entonces** veo cuatro filas (una por cada `Req#` unico) con titulo en mayusculas.
- **Dado** que dos instancias comparten `Req#1`, **cuando** miro la lista, **entonces** aparece UNA sola entrada `Req#1` (consolidacion por identidad logica — HU-A1.008).
- **Dado** que hay un typo (`Req#1` vs `Req #1`), **cuando** miro la lista, **entonces** aparecen DOS entradas distintas (igualdad estricta — §4.3).
- **Dado** que cada fila tiene un boton `Create Requirement View`, **cuando** hago clic, **entonces** genera o actualiza la vista (ver HU-A1.021, HU-A1.024).
- **Dado** que el dialogo esta abierto, **cuando** hago clic en `Close`, **entonces** cancela sin efecto.

**Reglas y restricciones:**
- Lista paginada si hay muchos requisitos — hipotesis, no observada con >4.
- Saltos de numeracion (p. ej. falta `Req#4`) son respetados: no se auto-completan.
- Igualdad textual estricta en consolidacion.

**Modelo de datos tocado:**
- Derivado de `satisfiedRequirementInstance[*].requirementLogicalId` (set unico).

**Dependencias:**
- Bloqueada por: HU-A1.008, HU-A1.001.
- Bloquea a: HU-A1.021, HU-A1.024.

**Integraciones:**
- Dialogo modal generico (UI).

**Notas de evidencia:**
- Fuente: §3.5, §4.3.
- Frames: frame_00090.
- Transcripcion: "if you see two things that looks the same but are not on the same thing it means that we have some kind of an error a typo".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [requirement, ui, modal, vistas, consolidacion].

---

### HU-A1.021 — Generar OPD derivado `View of Requirement <Req#N> Satisfying Model Parts`

**Actor primario:** AD.
**Tipo:** mixto.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §3.5, §6.5, §9.5.
**Nivel categorico:** L (lente).
**Superficie UI:** canvas (nuevo OPD) + arbol OPD (rama `Requirement Views`).
**Gesto canonico:** clic en `Create Requirement View` de fila del dialogo.

**Historia:**
> Como autor de dominio, quiero generar un OPD derivado que muestre solo las cosas que satisfacen `Req#N` para revisar su cumplimiento sin la distraccion del resto del modelo.

**Contexto de negocio:**
La Requirement View es la **proyeccion computada** del modelo: el output estrella de esta epica. Responde en UI a la pregunta "que satisface este requisito?" sin que el modelador tenga que buscar manualmente por el SD. Es la forma pura del principio "lente sin mutacion". La SSOT [Metod §8.3] reconoce este tipo de vista como "vista ad hoc" tematica: reune hechos existentes para explicar un aspecto concreto.

**Criterios de aceptacion:**
- **Dado** que hago clic en `Create Requirement View` para `Req#N`, **cuando** se genera, **entonces** aparece un nuevo OPD con nombre exacto `View of Requirement <Req#N> Satisfying Model Parts` bajo la rama `Requirement Views` del arbol.
- **Dado** que se genero la vista, **cuando** la abro, **entonces** contiene **solo** las cosas cuyas Set incluyen `Req#N`, junto con los enlaces entre ellas y vecinos minimos del cierre transitivo (ver HU-A1.022).
- **Dado** que cada enlace de trazabilidad se renderiza, **cuando** lo miro, **entonces** lleva etiqueta `Satisfied_Req#N` italica vertical.
- **Dado** que la vista incluye procesos, **cuando** miro el render, **entonces** las elipses pueden tener contorno doble (convencion tipografica §9.5).

**Reglas y restricciones:**
- Nombre del OPD fijo: `View of Requirement <Req#N> Satisfying Model Parts`.
- Read-only respecto a contenido (HU-A1.023).
- No anida con `SD`: es jerarquia paralela (§7.2).

**Modelo de datos tocado:**
- `requirementView.id` — UUID — persistente.
- `requirementView.requirementId` — FK Req#N — persistente.
- `requirementView.treeNodeId` — FK nodo del arbol — persistente.
- `requirementView.layout` — objeto posiciones manualmente ajustables — persistente.

**Dependencias:**
- Bloqueada por: HU-A1.020.
- Bloquea a: HU-A1.022, HU-A1.023, HU-A1.024.

**Integraciones:**
- Arbol OPD (rama `Requirement Views`).
- OPL pane de la vista.

**Notas de evidencia:**
- Fuente: §3.5, §6.5, §9.5.
- Frames: frame_00095, frame_00100, frame_00105, frame_00125.
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** L.
**Etiquetas:** [requirement, lente, vistas, filtrado, OPD-derivado].

---

### HU-A1.022 — Aplicar cierre transitivo minimo (traer source/target del enlace etiquetado)

**Actor primario:** AD.
**Tipo:** mixto.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §3.5.
**Nivel categorico:** L.
**Superficie UI:** ninguna (regla de generacion).
**Gesto canonico:** ninguno.

**Historia:**
> Como autor de dominio, quiero que la Requirement View incluya automaticamente source y target de los enlaces etiquetados con el requisito, aunque esas cosas no tengan el requisito directamente, para que la vista sea visualmente coherente.

**Contexto de negocio:**
Un enlace no puede dibujarse sin sus extremos. Si `Req#5` esta sobre el enlace `Viewer → Approaching Visitor Viewing` y `Viewer` no tiene el requisito directamente, la vista DEBE traer `Viewer` para que el enlace sea renderizable. Es una regla de consistencia visual, no una extension semantica.

**Criterios de aceptacion:**
- **Dado** que `Req#5` anota el enlace `A → B`, **cuando** se genera la vista, **entonces** incluye A y B aunque ninguno tenga `Req#5` como satisfactor directo.
- **Dado** que `A` tiene otros enlaces a `C`, `D` sin `Req#5`, **cuando** se genera la vista, **entonces** NO se incluyen C ni D (cierre minimo, no expansivo).
- **Dado** que hay cierre transitivo extendido (e.g. `C` tiene `Req#5`), **cuando** se analiza, **entonces** C se incluye por su propia pertenencia (no por C–A).

**Reglas y restricciones:**
- Regla explicita: enlace etiquetado → source + target obligatorio.
- No propaga a vecinos adicionales (**pregunta abierta** Q5 sobre limites del cierre).
- Garantiza que toda arista renderizada tiene sus dos nodos.

**Modelo de datos tocado:**
- Derivado; no persistente independiente.

**Dependencias:**
- Bloqueada por: HU-A1.021, HU-A1.009.
- Relaciona Q5 abierta.

**Integraciones:**
- Generator de vistas.

**Notas de evidencia:**
- Fuente: §3.5 paso 4.
- Frames: frame_00100, frame_00105.
- Transcripcion: "opm a link cannot be displayed without a source and the target".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [requirement, lente, vistas, cierre-transitivo, consistencia-visual].

---

### HU-A1.023 — Mantener Requirement View como OPD read-only re-posicionable

**Actor primario:** AD.
**Actores secundarios:** RV (revisor).
**Tipo:** mixto.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §3.5.
**Nivel categorico:** L primario; V secundaria.
**Superficie UI:** canvas del OPD derivado.
**Gesto canonico:** intentar editar vs mover.

**Historia:**
> Como revisor, quiero leer la Requirement View sin riesgo de editar el modelo accidentalmente pero poder re-posicionar los elementos para legibilidad.

**Contexto de negocio:**
Separar "editar modelo" de "ajustar visualizacion" protege la integridad de la fuente de verdad. El modelador puede invertir layout manual en la vista sin alterar el SD. Las vistas ad hoc segun la SSOT [Metod §8.3] "NO DEBEN editarse cuando eso altere hechos cuyo origen pertenece a OPDs jerarquicos".

**Criterios de aceptacion:**
- **Dado** que estoy en la Requirement View, **cuando** intento anadir una cosa nueva, **entonces** el sistema lo bloquea (no hay affordance o falla silenciosa — a definir en UI).
- **Dado** que intento renombrar una cosa de la vista, **cuando** hago doble clic, **entonces** el rename esta deshabilitado (modo read-only).
- **Dado** que intento eliminar una cosa, **cuando** presiono Delete, **entonces** nada sucede.
- **Dado** que arrastro una cosa en la vista, **cuando** suelto, **entonces** su posicion dentro de esta vista se guarda — pero no afecta el SD ni otras vistas.

**Reglas y restricciones:**
- Contenido semantico: read-only.
- Layout de la vista: mutable y persistente per-view.
- Al actualizar la vista (HU-A1.024), el layout manual **pregunta abierta** Q7: ¿se preserva o se regenera?

**Modelo de datos tocado:**
- `requirementView.layout` — per-view — persistente.

**Dependencias:**
- Bloqueada por: HU-A1.021.
- Relaciona: Q7 abierta.

**Integraciones:**
- Renderer (modo read-only).

**Notas de evidencia:**
- Fuente: §3.5 paso 5.
- Transcripcion: "the view is read only i can only adjust how i want to see it".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [requirement, lente, read-only, layout-per-view].

---

### HU-A1.024 — Actualizar Requirement View existente desde el dialogo o el arbol

**Actor primario:** AD.
**Tipo:** mixto.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §3.5, §4.4.
**Nivel categorico:** L.
**Superficie UI:** dialogo `Create Or Update` O menu contextual del nodo en arbol.
**Gesto canonico:** clic en `Create Requirement View` (update) o clic derecho en arbol → `Update`.

**Historia:**
> Como autor de dominio, quiero actualizar una Requirement View existente para reflejar los cambios del modelo posteriores a su creacion, eligiendo entre dos vias equivalentes (dialogo o arbol).

**Contexto de negocio:**
Las vistas NO se actualizan automaticamente cuando cambia el modelo (§4.4). El usuario debe invocarlo explicitamente. Dos vias (dialogo y arbol) cubren contextos distintos: cuando piensa en "requisito" (dialogo) vs cuando piensa en "vista existente" (arbol).

**Criterios de aceptacion:**
- **Dado** que ya existe la vista de `Req#N`, **cuando** abro el dialogo y hago clic en `Create Requirement View` de su fila, **entonces** el sistema regenera (actualiza) la vista con los cambios del modelo.
- **Dado** que hago clic derecho sobre el nodo `View of Requirement Req#N Satisfying Model Parts` en el arbol, **cuando** expando el menu, **entonces** veo `Update` y `Remove`.
- **Dado** que selecciono `Update`, **cuando** se ejecuta, **entonces** la vista se regenera equivalente a pasar por el dialogo.
- **Dado** que selecciono `Remove`, **cuando** se ejecuta, **entonces** el nodo y el OPD derivado desaparecen.
- **Dado** que actualizo la vista, **cuando** el layout manual existia, **entonces** **pregunta abierta** Q7: ¿se preserva?

**Reglas y restricciones:**
- No hay actualizacion automatica ni badge "out of date" (§4.4).
- `Update` es equivalente a `Create` de nuevo sobre un `Req#N` ya asociado.

**Modelo de datos tocado:**
- Regeneracion de `requirementView.content`; `layout` preservado o resetado (abierto).

**Dependencias:**
- Bloqueada por: HU-A1.021.
- Relaciona: Q7.

**Integraciones:**
- Arbol OPD (menu contextual del nodo).
- Dialogo modal.

**Notas de evidencia:**
- Fuente: §3.5 paso 6, §4.4.
- Transcripcion: "Create Or Update".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [requirement, lente, vistas, update, arbol-menu].

---

### HU-A1.025 — Conectar stereotype canonico `<<Requirement>>` con comando especifico

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §2, §3.6, §5.2.
**Nivel categorico:** D (dominio) primario; K (aplicador de stereotype).
**Superficie UI:** menu-contextual sobre `Satisfied Requirement #N`.
**Gesto canonico:** clic en `Connect Requirement Stereotype`.

**Historia:**
> Como autor de dominio, quiero anclar el stereotype canonico `<<Requirement>>` a un requisito existente con un comando especifico de la feature para materializar la plantilla de 5 atributos sin pasar por el flujo generico `Set Stereotype`.

**Contexto de negocio:**
El comando especifico `Connect Requirement Stereotype` es un shortcut del mecanismo generico A0. Reduce friccion (el usuario no elige entre N stereotypes disponibles, es directo) y evidencia la especializacion del dominio.

**Criterios de aceptacion:**
- **Dado** que tengo un `Satisfied Requirement #N` seleccionado, **cuando** abro menu contextual, **entonces** aparece el comando `Connect Requirement Stereotype`.
- **Dado** que hago clic, **cuando** se ejecuta, **entonces** el stereotype `Requirement` queda anclado al objeto-requisito, habilitando unfolding (HU-A1.026) y prefijo `<<Requirement>>` en OPL (HU-A1.032).
- **Dado** que ya esta anclado, **cuando** abro menu de nuevo, **entonces** aparece tambien `Remove Requirement Stereotype`.

**Reglas y restricciones:**
- Solo aplica sobre objetos de tipo `Satisfied Requirement #N` (no sobre cosas arbitrarias del modelo).
- Delegate al mecanismo generico A0 de Set Stereotype con preset `Requirement`.

**Modelo de datos tocado:**
- `satisfiedRequirementInstance.stereotypeApplied` — boolean — persistente.

**Dependencias:**
- Bloqueada por: HU-A1.002, EPICA-A0.
- Bloquea a: HU-A1.026, HU-A1.032, HU-A1.030.

**Integraciones:**
- Mecanismo generico A0.
- OPL pane (cambio de prefijo).

**Notas de evidencia:**
- Fuente: §2, §3.6, §5.2.
- Frames: frame_00115, frame_00120.
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [requirement, stereotype, canonical, dominio].

---

### HU-A1.026 — Desplegar plantilla canonica de 5 atributos via unfolding

**Actor primario:** AD.
**Tipo:** mixto.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §3.6.
**Nivel categorico:** K primario (materializa 5 atributos OPM); L, V secundarios.
**Superficie UI:** canvas del OPD hijo (unfolded).
**Gesto canonico:** `unfold` sobre un `Satisfied Requirement #N` con stereotype aplicado.

**Historia:**
> Como autor de dominio, quiero hacer unfolding de un requisito con stereotype anclado para ver y editar sus 5 atributos canonicos (Name, ID, Essence, Satisfaction, Description) en un OPD derivado.

**Contexto de negocio:**
La plantilla canonica captura los atributos minimos de cualquier requisito en ingenieria de sistemas. Materializarlos como objetos OPM con sus enumerados (para Essence y Satisfaction) integra el metamodelo de requisitos en el mismo lenguaje del sistema — no son datos paralelos. La SSOT [Metod §8.1] define unfolding como mecanismo de refinamiento OPM; la plantilla de 5 atributos es una extension OPCloud del concepto.

**Criterios de aceptacion:**
- **Dado** que un `Satisfied Requirement #N` tiene stereotype aplicado, **cuando** hago unfold, **entonces** aparece un nuevo OPD hijo con nombre `SD<k>: Satisfied Requirement #N of <owner> unfolded`.
- **Dado** que abro el OPD hijo, **cuando** miro el canvas, **entonces** veo los 5 atributos como objetos/cajas: `Name of Satisfied Requirement #N`, `ID of Satisfied Requirement #N`, `Essence of Satisfied Requirement #N`, `Satisfaction of Satisfied Requirement #N`, `Description of Satisfied Requirement #N`.
- **Dado** que miro el canvas, **cuando** detallo `Essence`, **entonces** veo tres cajas-estado enumeradas: `operational`, `non-operational`, `hybrid`.
- **Dado** que miro `Satisfaction`, **cuando** lo detallo, **entonces** veo dos cajas: `hard`, `soft`.
- **Dado** que remuevo el stereotype (HU-A1.030), **cuando** regresa el objeto a sin-stereotype, **entonces** el OPD unfolded desaparece O debe haberse removido antes.

**Reglas y restricciones:**
- Plantilla minima, no cerrada: se pueden anadir atributos adicionales (HU-A1.029).
- El OPD unfolded es parte del modelo (no es read-only como las Requirement Views).
- `Name` del requisito puede contener el `Req#N` de la caja-estado (ejemplo frame_00120).

**Modelo de datos tocado:**
- `requirementStereotypeData.nameId` — FK objeto `Name of ...` — persistente.
- `requirementStereotypeData.idText` — string — persistente.
- `requirementStereotypeData.essence` — enum `operational | non-operational | hybrid` — persistente.
- `requirementStereotypeData.satisfaction` — enum `hard | soft` — persistente.
- `requirementStereotypeData.description` — string — persistente.

**Dependencias:**
- Bloqueada por: HU-A1.025, EPICA-12 (unfolding mecanica).
- Bloquea a: HU-A1.027, HU-A1.028, HU-A1.029, HU-A1.030.

**Integraciones:**
- Arbol OPD (nueva entrada `SD<k>`).
- OPL pane (lineas del OPD unfolded).

**Notas de evidencia:**
- Fuente: §3.6 pasos 4–5.
- Frames: frame_00120, frame_00125.
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** L.
**Etiquetas:** [requirement, kernel, unfold, plantilla, 5-atributos].

---

### HU-A1.027 — Editar atributo `Essence` del requisito entre `operational/non-operational/hybrid`

**Actor primario:** AD.
**Tipo:** mixto.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §3.6.
**Nivel categorico:** K primario; V secundaria.
**Superficie UI:** canvas del OPD unfolded, caja-estado de `Essence of ...`.
**Gesto canonico:** clic en caja-estado (estado actual) → cambia a otra.

**Historia:**
> Como autor de dominio, quiero seleccionar entre `operational`, `non-operational` e `hybrid` para el atributo `Essence` del requisito para clasificarlo en la taxonomia canonica.

**Contexto de negocio:**
`Essence` del requisito (distinto del `essence` fisico/informatical de la cosa) clasifica si el requisito es sobre comportamiento operativo, sobre propiedades estaticas, o mezcla. Es distinto del `essence` del dominio OPM base; compartir el termino puede confundir — **nota de ambiguedad**.

**Criterios de aceptacion:**
- **Dado** que el OPD unfolded muestra `Essence of Req#N` con tres cajas-estado, **cuando** hago clic sobre `operational`, **entonces** la caja `operational` pasa a ser el estado actual y el OPL refleja `Essence of Req#N ... is operational`.
- **Dado** que cambio el estado, **cuando** consulto el canvas, **entonces** hay un indicador visual de cual es el estado actual (a definir segun SSOT visual).
- **Dado** que cambio a `hybrid`, **cuando** leo la linea OPL de posibles valores, **entonces** menciona los tres (`can be hybrid, non-operational or operational`).

**Reglas y restricciones:**
- Enum cerrado: tres valores observados; extension no observada.
- Colision nominal con `essence` fisico/informatical — documentar claramente.

**Modelo de datos tocado:**
- `requirementStereotypeData.essence` — enum — persistente.

**Dependencias:**
- Bloqueada por: HU-A1.026.

**Integraciones:**
- OPL pane.

**Notas de evidencia:**
- Fuente: §3.6 tabla de atributos.
- Frames: frame_00120 (tres cajas visibles).
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [requirement, kernel, essence-req, enumerado, unfolded].

---

### HU-A1.028 — Editar atributo `Satisfaction` del requisito entre `hard/soft`

**Actor primario:** AD.
**Tipo:** mixto.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §3.6.
**Nivel categorico:** K primario; V secundaria.
**Superficie UI:** canvas del OPD unfolded, caja-estado de `Satisfaction of ...`.
**Gesto canonico:** clic en caja → selecciona estado.

**Historia:**
> Como autor de dominio, quiero clasificar cada requisito como `hard` o `soft` para distinguir requisitos obligatorios de deseables y enlazar esta clasificacion con simulacion y verificacion futuras.

**Contexto de negocio:**
`hard` implica que el requisito debe cumplirse de forma absoluta; `soft` es deseable. Esta distincion habilita integraciones futuras con simulacion (Q11 fuente): "¿un requisito `hard` rompe la simulacion si no se cumple?".

**Criterios de aceptacion:**
- **Dado** que el OPD unfolded muestra `Satisfaction of Req#N` con dos cajas, **cuando** hago clic en `hard`, **entonces** el estado queda como `hard` y OPL refleja `Satisfaction ... is hard`.
- **Dado** que el enum es binario, **cuando** miro OPL, **entonces** la linea `can be hard or soft` lista ambos valores.
- **Dado** que alterno entre `hard` y `soft`, **cuando** persiste, **entonces** el kernel mantiene el valor tras recarga.

**Reglas y restricciones:**
- Enum cerrado: dos valores (`hard`, `soft`).
- No hay valor default explicito observado (debe confirmarse — abierto).

**Modelo de datos tocado:**
- `requirementStereotypeData.satisfaction` — enum — persistente.

**Dependencias:**
- Bloqueada por: HU-A1.026.
- Relaciona: Q11 sobre integracion con simulacion.

**Integraciones:**
- OPL pane.
- Simulacion futura (EPICA-B0/B1).

**Notas de evidencia:**
- Fuente: §3.6 tabla de atributos.
- Frames: frame_00120.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [requirement, kernel, satisfaction, enumerado, unfolded].

---

### HU-A1.029 — Ampliar requisito con atributos adicionales mas alla de los 5 canonicos

**Actor primario:** AD.
**Tipo:** mixto.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §3.6.
**Nivel categorico:** K primario; D secundaria.
**Superficie UI:** canvas del OPD unfolded.
**Gesto canonico:** agregar objeto nuevo al OPD unfolded via unfolding (como agregacion).

**Historia:**
> Como autor de dominio, quiero anadir atributos adicionales a un requisito mas alla de los 5 canonicos (p. ej. `Priority`, `Source`, `Verification Method`, `Rationale`, `Acceptance Criteria`) para enriquecer su descripcion segun la metodologia de mi organizacion.

**Contexto de negocio:**
La plantilla canonica es un **minimo**, no un cierre. Algunas organizaciones necesitan priority, rationale, verification method, acceptance criteria, source document, version, etc. OPCloud permite extender porque el stereotype es pattern, no contrato rigido.

**Criterios de aceptacion:**
- **Dado** que estoy en el OPD unfolded de un requisito, **cuando** arrastro un nuevo objeto desde toolbar o lo creo con Add Attribute, **entonces** se anade como atributo del requisito (miembro del OPD unfolded) con enlace exhibition desde el requisito.
- **Dado** que agrego un atributo `Priority` con enum `high/medium/low`, **cuando** consulto OPL, **entonces** aparecen lineas `Priority of Req#N can be high, medium or low.` analogas a las canonicas.
- **Dado** que ampliar no destruye los 5 canonicos, **cuando** reviso el OPD, **entonces** los 5 siguen presentes mas el nuevo.

**Reglas y restricciones:**
- Extension es aditiva, no modifica los 5 canonicos.
- Los atributos extendidos se pierden si se remueve el stereotype (HU-A1.030).
- La lista de atributos comunes en ingenieria (priority, source, verification_method, rationale, acceptance, regulatory, version) no esta preformateada en OPCloud — cada organizacion define.

**Modelo de datos tocado:**
- `requirementStereotypeData.extraAttributes` — map string → valor — persistente.

**Dependencias:**
- Bloqueada por: HU-A1.026.

**Integraciones:**
- Unfolding (EPICA-12).
- OPL pane.

**Notas de evidencia:**
- Fuente: §3.6 paso 5.
- Transcripcion: "we can add even newer attributes yes for example we have an attribute so we can add it as a more attribute".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [requirement, kernel, plantilla, extension, abierta].

---

### HU-A1.030 — Advertir perdida de valores al remover stereotype `<<Requirement>>`

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §3.6.
**Nivel categorico:** U primario (feedback); K secundario (destruye datos).
**Superficie UI:** dialogo de confirmacion + ejecucion del comando `Remove Requirement Stereotype`.
**Gesto canonico:** clic en `Remove Requirement Stereotype`.

**Historia:**
> Como autor de dominio, quiero recibir una advertencia explicita antes de que remover el stereotype borre los valores de los 5 atributos canonicos y los adicionales para no perder trabajo editado.

**Contexto de negocio:**
La transcripcion explicita la perdida: "even if you've changed things it will not be expressed in the model". Sin advertencia, el comando es destructivo silencioso. La feature espera que el OPD unfolded sea removido ANTES de remover el stereotype (orden importa).

**Criterios de aceptacion:**
- **Dado** que tengo un requisito con stereotype aplicado y valores editados, **cuando** invoco `Remove Requirement Stereotype`, **entonces** aparece un dialogo de confirmacion advirtiendo la perdida.
- **Dado** que confirmo, **cuando** se ejecuta, **entonces** los 5 atributos canonicos y los adicionales se eliminan del modelo sin posibilidad de undo directo (ver EPICA-90 para undo global).
- **Dado** que cancelo, **cuando** cierra el dialogo, **entonces** nada se modifica.
- **Dado** que existe OPD unfolded, **cuando** intento remover el stereotype sin remover primero el unfolded, **entonces** el sistema puede requerir remover el unfolded primero (**pregunta abierta** — orden observado en transcripcion).

**Reglas y restricciones:**
- Destructivo: sin recuperacion automatica de valores.
- Orden importante: remover unfolded OPD primero (workflow observado).

**Modelo de datos tocado:**
- `requirementStereotypeData.*` — destruido.

**Dependencias:**
- Bloqueada por: HU-A1.025, HU-A1.026.

**Integraciones:**
- Dialogo de confirmacion.
- Kernel.

**Notas de evidencia:**
- Fuente: §3.6 paso 6.
- Transcripcion: "even if you've changed things it will not be expressed in the model".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [requirement, ui, warning, destructivo, confirmacion].

---

### HU-A1.031 — Asociar URL de sistema externo con `Add Hyperlink URL`

**Actor primario:** AD.
**Actores secundarios:** IR (si URL apunta a runtime).
**Tipo:** opcloud-ui.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §3.7, §7.6.
**Nivel categorico:** X (integracion externa).
**Superficie UI:** menu-contextual + dialogo URL.
**Gesto canonico:** clic en `Add Hyperlink URL` → ingresar URL → `Preview` o guardar.

**Historia:**
> Como autor de dominio, quiero asociar una URL externa a un requisito (o a cualquier cosa/enlace) para enlazar el modelo OPM con un sistema de gestion de requisitos externo (DOORS, Polarion, Jira, etc.) sin duplicar datos.

**Contexto de negocio:**
Las organizaciones grandes ya tienen sistemas de gestion de requisitos. OPCloud no pretende reemplazarlos; el hyperlink es un **puente minimo** que permite abrir el requisito externo desde el modelo. Es integracion rudimentaria (solo URL, no fetch de metadatos) — deliberadamente simple para no comprometerse con un protocolo concreto.

**Criterios de aceptacion:**
- **Dado** que tengo una cosa o requisito seleccionado, **cuando** abro menu contextual, **entonces** aparece `Add Hyperlink URL`.
- **Dado** que hago clic, **cuando** se abre el dialogo, **entonces** tiene campo URL libre y boton `Preview`.
- **Dado** que ingreso `https://requirementsystem.com/?id=1234` y hago `Preview`, **cuando** el sistema reacciona, **entonces** abre una nueva pestana con la URL (**pregunta abierta** Q8: ¿preview embebido o solo open-in-new-tab?).
- **Dado** que guardo, **cuando** cierra, **entonces** la URL persiste asociada al objeto/estado/enlace.

**Reglas y restricciones:**
- Input es string libre, no hay validacion URL estricta.
- Multiples URLs por requisito: **pregunta abierta** Q8.
- No hay fetching de metadatos: integracion unidireccional.

**Modelo de datos tocado:**
- `thing.hyperlinks[]` — array de `{url, label?}` — persistente.

**Dependencias:**
- Bloqueada por: HU-A1.002 (para uso tipico sobre requisitos).
- Relaciona: Q8 abierta.

**Integraciones:**
- Navegador (open-in-new-tab).
- Otros sistemas (Doors, Polarion, etc.) como target.

**Notas de evidencia:**
- Fuente: §3.7, §7.6.
- Transcripcion: "add hyperlink url ... requirementsystem.com".
- Clase de afirmacion: observado + confirmado.
- Etiqueta: `requires-clarification` (Q8).

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [requirement, integracion, hyperlink, externo, requires-clarification].

---

### HU-A1.032 — Renderizar eco OPL especifico de requisitos con prefijo `<<Requirement>>`

**Actor primario:** AD.
**Actores secundarios:** RV.
**Tipo:** mixto.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §3.6, §7.1, §9.6.
**Nivel categorico:** L primario; V secundaria.
**Superficie UI:** opl-pane.
**Gesto canonico:** ninguno (actualizacion automatica).

**Historia:**
> Como revisor, quiero leer en el OPL pane las lineas especificas del subsistema de requisitos (con prefijo `<<Requirement>>` cuando el stereotype esta aplicado) para auditar la trazabilidad en lenguaje natural.

**Contexto de negocio:**
El OPL es la **vista dual** del canvas en lenguaje natural. Para requisitos, debe emitir lineas especificas: la creacion del Set, la pertenencia al Set, el identificador logico, y — cuando el stereotype se ancla — las lineas con prefijo `<<Requirement>>` sobre los atributos. Sin el OPL enriquecido, los requisitos serian opacos a lectores no-visuales.

**Criterios de aceptacion:**
- **Dado** que creo un requisito sin stereotype, **cuando** consulto OPL, **entonces** aparecen tres lineas: `<C> exhibits Satisfied Requirement Set.`, `Satisfied Requirement Set consists of Satisfied Requirement #N.`, `Satisfied Requirement #N of <C> is Req#N.`.
- **Dado** que anclo el stereotype, **cuando** consulto OPL, **entonces** el prefijo `<<Requirement>>` aparece delante del nombre del objeto-requisito y aparecen las lineas de atributos (`Essence of Satisfied Requirement #N of <<Requirement>> Satisfied Requirement #N is an informatical and systemic object.`, `... can be hybrid, non-operational or operational.`, analogas para Satisfaction).
- **Dado** que cambio el valor de un atributo canonico, **cuando** consulto OPL, **entonces** la linea `X of Req#N is <value>.` se actualiza en vivo.
- **Dado** que remuevo el stereotype (HU-A1.030), **cuando** consulto OPL, **entonces** desaparecen las lineas con `<<Requirement>>`.

**Reglas y restricciones:**
- Formato de prefijo: `<<Requirement>>` textual, no simbolo grafico.
- El estereotipo es exclusivamente textual en OPL — no hay simbolo visual en canvas (§9.6).
- El orden de las lineas debe seguir la convencion OPL canonica (first-class citizen).

**Modelo de datos tocado:**
- Ninguno adicional; eco del modelo.

**Dependencias:**
- Bloqueada por: HU-A1.002, HU-A1.025, HU-A1.026.

**Integraciones:**
- OPL renderer.

**Notas de evidencia:**
- Fuente: §3.6 lineas OPL, §7.1, §9.6.
- Frames: frame_00120 (OPL visible con `<<Requirement>>`).
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [requirement, opl, stereotype, lente, prefijo].

---

### HU-A1.033 — Navegar rama `Requirement Views` del arbol OPD paralela a `SD`

**Actor primario:** AD.
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §2, §7.2.
**Nivel categorico:** U primario; L secundario.
**Superficie UI:** panel izquierdo (arbol OPD).
**Gesto canonico:** expandir rama + clic en nodo.

**Historia:**
> Como revisor, quiero acceder a las Requirement Views desde una rama dedicada del arbol OPD (paralela a `SD` y a `Stereotypes`) para navegarlas sin interferencia con la jerarquia de SD.

**Contexto de negocio:**
La rama separada es expresion estructural de que las vistas NO son OPDs hijos del SD — son **jerarquia paralela**. Mezclarlas romperia la semantica de `unfolded` e `in-zoomed` que son relaciones de refinamiento semantico del modelo.

**Criterios de aceptacion:**
- **Dado** que tengo al menos una Requirement View creada, **cuando** miro el arbol, **entonces** veo tres ramas raiz: `SD` (+ hijos), `Requirement Views`, `Stereotypes`.
- **Dado** que expando `Requirement Views`, **cuando** miro contenido, **entonces** lista los nodos `View of Requirement <Req#N> Satisfying Model Parts`.
- **Dado** que hago clic en un nodo, **cuando** se abre, **entonces** el canvas muestra el OPD derivado correspondiente.
- **Dado** que remuevo una vista, **cuando** confirma, **entonces** su nodo desaparece del arbol.
- **Dado** que no hay vistas creadas, **cuando** miro el arbol, **entonces** la rama `Requirement Views` **no aparece** (solo tras crear la primera — §5.5).

**Reglas y restricciones:**
- Jerarquia paralela, no anidada a `SD`.
- Rama aparece/desaparece segun haya vistas.

**Modelo de datos tocado:**
- `tree.branches` (derivado) — transitorio.

**Dependencias:**
- Bloqueada por: HU-A1.021.

**Integraciones:**
- Arbol OPD (EPICA-20).

**Notas de evidencia:**
- Fuente: §2, §7.2.
- Frames: frame_00095, frame_00115.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [requirement, ui, arbol, navegacion, jerarquia-paralela].

---

### HU-A1.034 — Bloquear delete del `Satisfied Requirement #N` desde la vista del Set

**Actor primario:** AD.
**Tipo:** mixto.
**Fuente:** `opcloud-reverse/a1-extension-requirements.md` §4.1.
**Nivel categorico:** K primario (invariante); U secundario.
**Superficie UI:** canvas + menu contextual sobre `Satisfied Requirement #N`.
**Gesto canonico:** intento de borrar el objeto directamente.

**Historia:**
> Como autor de dominio, quiero que el intento de borrar un `Satisfied Requirement #N` directamente desde el SD no sea posible, canalizandome a la vista correcta (requisito o Set) donde si puedo hacerlo, para preservar la integridad de la maquinaria.

**Contexto de negocio:**
El narrador lo explicita: "you cannot delete it there is no deletion here in order to delete a specific requirement you need to go to the requirement and delete it". La proteccion evita estados inconsistentes donde el Set tiene miembro referenciado pero sin node visible.

**Criterios de aceptacion:**
- **Dado** que tengo seleccionado un `Satisfied Requirement #N` en el SD, **cuando** abro menu contextual, **entonces** NO aparece el comando `Delete` / `Remove` estandar.
- **Dado** que presiono la tecla Delete sobre el objeto, **cuando** se ejecuta, **entonces** el sistema no elimina (silencioso o notificacion informativa).
- **Dado** que quiero borrar el requisito, **cuando** abro la vista desde el requisito raiz (unfolded o el propio Set), **entonces** hay comando de delete disponible.

**Reglas y restricciones:**
- Restriccion canalizadora: delete solo desde contextos especificos.
- Objetivo: proteger integridad referencial del Set y del requisito logico.

**Modelo de datos tocado:**
- Ninguno; es validacion del comando.

**Dependencias:**
- Bloqueada por: HU-A1.002.
- Relaciona: HU-A1.006 (re-numeracion post-delete valido).

**Integraciones:**
- Validador de comandos.

**Notas de evidencia:**
- Fuente: §4.1.
- Transcripcion: "you cannot delete it there is no deletion here in order to delete a specific requirement you need to go to the requirement and delete it".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [requirement, validacion, delete-scope, integridad].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **QA1.1** (Q1 fuente): `Ordered: true` — ¿que cambia visual y semanticamente? ¿Agrega numeracion explicita sobre los miembros del Set? ¿Fuerza orden en OPL? Relaciona HU-A1.013.
- **QA1.2** (Q2 fuente): Stereotype derivados en el arbol (`Actor Set of`, `Branch of`) — ¿cuando aparecen exactamente? ¿Es al anclar el stereotype o al unfold? ¿Hay otros derivados (`Verification of`, `Validation of`)? Relaciona HU-A1.025, HU-A1.026.
- **QA1.3** (Q3 fuente): Contorno doble de elipses en Requirement View — ¿convencion fija o artefacto de layout? ¿Se aplica tambien a objetos? Relaciona HU-A1.021.
- **QA1.4** (Q4 fuente): Ciclo de vida del `Satisfied Requirement Set` vacio — si borro el ultimo requisito, ¿desaparece el Set y su enlace de exhibicion? Relaciona HU-A1.003, HU-A1.006.
- **QA1.5** (Q5 fuente): Cierre transitivo de la vista — ¿que tan lejos alcanza? Si el enlace etiquetado conecta A→B y A tiene requisito por si mismo, ¿se incluyen tambien los vecinos de A? Relaciona HU-A1.022.
- **QA1.6** (Q6 fuente): Merge de requisitos con mismo id en vistas — dos objetos `Req#1` en dos owners distintos: la vista los incluye a ambos, ¿con algun indicador visual de "mismo requisito"? Relaciona HU-A1.008, HU-A1.021.
- **QA1.7** (Q7 fuente): Update comportamiento sobre vistas — al actualizar una vista existente, ¿se preserva el layout manual que el usuario reorganizo o se regenera desde cero? Relaciona HU-A1.023, HU-A1.024.
- **QA1.8** (Q8 fuente): Hyperlink — ¿soporta multiples URLs por requisito? ¿Hay preview embebido o solo open-in-new-tab? Relaciona HU-A1.031.
- **QA1.9** (Q9 fuente): Persistencia del toggle — el flag `visible` de una `SatisfiedRequirementInstance` ¿es per-OPD o global del modelo? Afecta a como se exporta. Relaciona HU-A1.016, HU-A1.019.
- **QA1.10** (Q10 fuente): Interaccion con sub-models (EPICA-32) — un requisito que cruza la frontera sub-model / main model, ¿se replica? ¿se referencia? Relaciona EPICA-32.
- **QA1.11** (Q11 fuente): Integracion con simulacion (EPICA-B0/B1) — ¿un requisito con `Satisfaction: hard` falla la simulacion si no se cumple? Relaciona HU-A1.028.
- **QA1.12** (Q12 fuente): Auto Format en caja-estado `Req#N` — ¿OPCloud normaliza `req1` → `Req#1`? ¿rechaza caracteres especiales? ¿impone patron regex? Relaciona HU-A1.004.
- **QA1.13** (derivada): ¿Orden de remocion del stereotype vs OPD unfolded? ¿El sistema requiere explicitamente remover el unfolded antes? Relaciona HU-A1.030.
- **QA1.14** (derivada): Integracion con import/export ReqIF/DOORS — ¿existe en OPCloud un canal bidireccional con formatos de requisitos estandar? No observado en este doc fuente; delegar a EPICA-70/71 o futura epica de interop.

## Candidatos a HU deferred (observadas como insinuacion pero no materializadas)

- **HU-A1.CAND-01**: Import desde ReqIF. No observado en OPCloud; pero extension natural. Requiere decision de alcance (¿esta fuera del scope del modelador core OPM o entra como integracion futura?).
- **HU-A1.CAND-02**: Export ReqIF / CSV de requisitos. No observado; analogo al anterior.
- **HU-A1.CAND-03**: Panel tabular "Requirements table" como vista tabular ademas de la vista OPD-proyectada. No observado en OPCloud; extension popular en herramientas de RM.
- **HU-A1.CAND-04**: Status / approval workflow (states: draft/approved/rejected/deprecated). No observado.
- **HU-A1.CAND-05**: Versionado de requisitos (historial, diff entre versiones). No observado; delegar a persistencia generica (EPICA-30).
- **HU-A1.CAND-06**: Dashboard de cobertura (requisitos sin mapping, metricas de completitud). No observado.
- **HU-A1.CAND-07**: Verification matrix (trazabilidad requisito → metodo de verificacion → test case). Parcialmente insinuada por la integracion con EPICA-A2 (Generative AI Requirements).

Estas candidatas **no reciben ID secuencial en esta epica** por no tener evidencia directa en el doc fuente. Se listan como posibles expansiones para un ciclo futuro, alineadas con expectativas de la industria de ingenieria de requisitos (ISO/IEC/IEEE 29148, SysML 1.x requirements modeling, etc.).

## Referencias cruzadas

- **Doc fuente**: `opcloud-reverse/a1-extension-requirements.md`.
- **Doc dependiente**: `opcloud-reverse/a0-extension-stereotypes.md` (mecanismo generico de stereotypes — EPICA-A0).
- **Fuente normativa SSOT**: `opm-ssot-es/metodologia-opm-es.md` — §8.3 (vistas ad hoc para requisitos), §8.1 (mecanismo de unfolding).
- **Epicas que dependen de esta**: ninguna directamente, pero:
  - **EPICA-A2** (Generative AI Requirements Generation) puede consumir el modelo de requisitos de esta epica como input para generar requisitos estructurados en Excel.
  - **EPICA-B0/B1** (simulacion) puede leer `Satisfaction: hard` para marcar fallas.
  - **EPICA-32** (sub-models) se intersecta con la pregunta abierta QA1.10.
  - **EPICA-60/61** (export PDF/SVG) debe considerar como renderizar Requirement Views.
- **Epicas de las que esta depende**:
  - **EPICA-A0** (mecanismo generico de stereotypes) — bloqueante para HU-A1.025 y siguientes.
  - **EPICA-10** (canvas creacion de cosas) — para crear la cosa base antes de anotarla.
  - **EPICA-11** (modelado basico) — para crear enlaces base.
  - **EPICA-12** (inzooming / unfolding) — para HU-A1.026 (unfold del requisito).
  - **EPICA-20** (arbol OPD) — para HU-A1.033 (rama `Requirement Views`).
  - **EPICA-50** (OPL pane) — para HU-A1.032.
- **Invariantes del repo**:
  - `src/nucleo/tipos.ts` — debe admitir tipos `SatisfiedRequirementSet`, `SatisfiedRequirementInstance`, `RequirementView`, `RequirementStereotypeData`.
  - `src/nucleo/validacion/` — compatibilidad de links con `linkAnnotation`; validacion de comando delete scope (HU-A1.034).
  - `src/render/opl-renderer.ts` — lineas canonicas para stereotype `<<Requirement>>` (HU-A1.032).
  - `src/render/jointjs/` — shapes especificos del Set, de la caja-estado oliva dorado, etiqueta italica vertical de enlace.
  - `src/suite/` — candidato natural para alojar el profile `Requirement` como dominio (profile propio siguiendo patron `docs/design/patron-dominios-funtor.md`).
- **SSOT OPM**: este subsistema agrega convenciones **no-canonicas** a OPM (caja-estado oliva dorado, etiqueta `Satisfied_Req#N`, nombres no editables). Debe documentarse como extension OPCloud explicita, no parte del lenguaje OPM SSOT.
