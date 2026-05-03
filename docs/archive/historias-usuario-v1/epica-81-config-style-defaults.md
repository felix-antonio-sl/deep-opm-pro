---
epica: "EPICA-81"
titulo: "Configuración — por defecto de estilo visual, esencia, OPL, grilla y herencia organizacion/usuario"
doc_fuente: "opcloud-reverse/81-config-style-defaults.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "C"
hu_emitidas: 22
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "DIAGNOSTICO-PILOTO-EPICA-10.md"
---

## Resumen

Esta epica cubre los **predefinidos visuales del modelador**: la capa de configuracion por usuario y por organizacion que altera como se renderiza por defecto cualquier cosa, enlace, oracion OPL o grilla del canvas. Se distingue de su hermana EPICA-14 (estilado por-instancia, aplicado a un elemento concreto con la barra de estilo) y de EPICA-80 (gestion administrativa de usuarios, grupos y perfil).

El corazon de la epica es la tension entre tres niveles de por defecto: (1) por defecto canonico de OPCloud, (2) por defecto de organizacion fijado por admin, (3) override por usuario. Cada panel de Configuracion es independiente y tiene su propio `Restablecer a por defecto`; no existe un restablecimiento global. Un invariante critico observado: cambiar un por defecto de estilo **no re-estila objetos existentes** — el estilado se materializa al crear la cosa, lo que implica que el predefinido activo deja un rastro permanente en el modelo.

Las HU se numeran siguiendo la aparicion en el doc fuente, agrupadas por panel (Language & OPL Settings, Style Settings, Grid Settings, panel OPCloud Settings general) y por comportamiento de herencia/reset. Las preguntas abiertas del doc fuente (§11) se reflejan como HU marcadas `requires-clarification` o como notas de evidencia.

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-81.001 | Acceder a Configuracion desde menu principal o engranaje del encabezado | MN | C | XS | opcloud-ui | — |
| HU-81.002 | Navegar paneles de Configuracion por carril izquierdo | MN | C | XS | opcloud-ui | — |
| HU-81.003 | Cambiar idioma del OPL en Language & OPL Settings | RV | C | S | opcloud-ui | [OPL-ES §1.7] |
| HU-81.004 | Fijar Things Default Essence (Physical/Informatical) | AO | C | S | opm-semantica | [V-1] [Glos 3.25] |
| HU-81.005 | Configurar OPL Essence Sentences (modo de visibilidad) | AO | C | XS | opcloud-ui | [OPL-ES D1..D4] |
| HU-81.006 | Configurar Units Display Options | AO | C | XS | opcloud-ui | — |
| HU-81.007 | Configurar Alias OPL Display Options | AO | C | XS | opcloud-ui | — |
| HU-81.008 | Configurar OPL Numbering sincronizado con alternador del pane | RV | C | S | opcloud-ui | — |
| HU-81.009 | Configurar Auto Format como por defecto de creacion | AO | C | XS | opcloud-ui | — |
| HU-81.010 | Configurar Highlight OPL↔OPD en hover | RV | C | S | opcloud-ui | — |
| HU-81.011 | Configurar Sync Things Colors of OPL and OPD | AO | C | S | opcloud-ui | — |
| HU-81.012 | Fijar por defecto de estilo por clase (Style Settings) | AO | C | M | opcloud-ui | [V-63] [JOYAS §1] [JOYAS §3] |
| HU-81.013 | Preservar estilo existente al cambiar por defecto de estilo | AO | C | S | opm-semantica | [V-63] |
| HU-81.014 | Configurar Grid Mode (On/Off) como por defecto | AO | C | XS | opcloud-ui | — |
| HU-81.015 | Configurar Grid Size, Color, Thickness y Scale Factor | AO | C | S | opcloud-ui | — |
| HU-81.016 | Ver modal de confirmacion SUCCESS al guardar Grid Settings | AO | C | XS | opcloud-ui | — |
| HU-81.017 | Configurar Spell Checking en rotulos | MN | C | XS | opcloud-ui | — |
| HU-81.018 | Configurar visibilidad por defecto de Notes | RV | C | XS | opcloud-ui | — |
| HU-81.019 | Configurar visibilidad por defecto de OPD names en el arbol | RV | C | XS | opcloud-ui | — |
| HU-81.020 | Heredar por defecto de organizacion con override por usuario | AO | C | M | mixto | [V-1] |
| HU-81.021 | Restablecer panel a por defecto canonicos u organizacionales | MN | C | S | mixto | — |
| HU-81.022 | Preservar instantanea del predefinido al crear cada cosa | AO | C | M | opm-semantica | [V-1] |

Total: **22 historias de usuario** (5 opm-semantica, 15 opcloud-ui, 2 mixto).

## Historias de usuario

### HU-81.001 — Acceder a Configuracion desde menu principal o engranaje del encabezado

**Actor primario:** MN (modelador novato).
**Actores secundarios:** AO (admin de organizacion).
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; C (configuracion) secundario.
**Superficie UI:** menu-principal + engranaje-encabezado + pantalla-configuracion.
**Gesto canonico:** clic en Menu principal → Configuracion, o clic en el icono engranaje junto al nombre de usuario en el encabezado.

**Historia:**
> Como modelador, quiero abrir la pantalla de Configuracion desde el menu principal o desde el engranaje del encabezado para ajustar mis predefinidos sin abandonar el flujo de modelado.

**Contexto de negocio:**
Configuracion es el punto unico de entrada a toda la configuracion visual y administrativa. Ofrecer dos caminos (menu principal y engranaje del encabezado) cubre al usuario navegacional y al usuario orientado a accesos directos. El acceso debe ser obvio desde cualquier pantalla del producto.

**Criterios de aceptacion:**
- **Dado** que estoy en el canvas con un modelo cargado, **cuando** hago clic en Menu principal → Configuracion, **entonces** se abre la pantalla de Configuracion con el carril izquierdo visible.
- **Dado** que estoy en cualquier pantalla del producto, **cuando** hago clic en el engranaje junto al nombre de usuario en el encabezado, **entonces** tambien se abre la pantalla de Configuracion.
- **Dado** que acabo de abrir Configuracion, **cuando** miro la pantalla, **entonces** el carril muestra las secciones User Management / Group Management / Organization Management / Analyze Model / OPCloud Manuals.

**Reglas y restricciones:**
- Los dos accesos son equivalentes; no hay diferencia de estado resultante.
- Configuracion es modal-pantalla, no popup: ocupa el area principal y reemplaza al canvas.

**Modelo de datos tocado:**
- Ninguno directo; solo transicion de vista.

**Dependencias:**
- Bloquea a: HU-81.002 y toda la epica (prerrequisito de acceso).

**Integraciones:**
- Navegacion global del producto.

**Notas de evidencia:**
- Fuente: `opcloud-reverse/81-config-style-defaults.md` §2 tabla carril.
- Frames: frame_00001.
- Clase de afirmacion: observado.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [config, ui, configuracion, acceso, opcloud-ui].

---

### HU-81.002 — Navegar paneles de Configuracion por carril izquierdo

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** pantalla-configuracion (carril izquierdo).
**Gesto canonico:** clic en entrada del carril.

**Historia:**
> Como modelador, quiero hacer clic en las entradas del carril izquierdo de Configuracion para alternar entre paneles (Update My Profile, OPL Settings, OPCloud Settings, etc.) y encontrar rapido el parametro que busco.

**Contexto de negocio:**
El carril es el indice navegacional de Configuracion. Las entradas pertenecen a User Management y agrupan paneles semanticamente distintos. El carril es la unica ruta de navegacion; no hay busqueda dentro de Configuracion en la version observada.

**Criterios de aceptacion:**
- **Dado** que Configuracion esta abierta, **cuando** hago clic en `OPL Settings` (carril), **entonces** el area central muestra el panel titulado `Language & OPL Settings`.
- **Dado** que Configuracion esta abierta, **cuando** hago clic en `OPCloud Settings`, **entonces** el area central muestra Autosave, Time precision, Spell Checking, Notes, OPD names, Log Sharing, External Connections, Style Settings y (si aplica) Grid Settings.
- **Dado** que Configuracion esta abierta, **cuando** hago clic en `Update My Profile`, **entonces** se abre el panel de perfil (fuera de alcance — ver EPICA-80).
- **Dado** que el carril usa etiqueta `OPL Settings` pero el titulo del panel es `Language & OPL Settings`, **cuando** navego, **entonces** no pierdo orientacion — ambos se refieren al mismo panel.

**Reglas y restricciones:**
- Divergencia menor de nomenclatura UI: carril usa `OPL Settings`, titulo usa `Language & OPL Settings`. No es bug, es observado.
- Solo una entrada del carril activa a la vez; cambio de entrada reemplaza el contenido del area central.

**Modelo de datos tocado:**
- Ninguno directo.

**Dependencias:**
- Bloqueada por: HU-81.001.

**Integraciones:**
- Todas las HU de esta epica dependen de esta navegacion.

**Notas de evidencia:**
- Fuente: §2 observacion carril vs titulo.
- Frames: frame_00001, frame_00013.
- Clase de afirmacion: observado.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [config, ui, configuracion, navegacion, opcloud-ui].

---

### HU-81.003 — Cambiar idioma del OPL en Language & OPL Settings

**Actor primario:** RV (revisor / lector).
**Actores secundarios:** MN, AD (autor de dominio multilingüe).
**Tipo:** opcloud-ui.
**Nivel categorico:** C primario; L (lente OPL) secundario.
**Superficie UI:** panel Language & OPL Settings → desplegable `Language`.
**Gesto canonico:** clic en desplegable + seleccion de idioma.

**Historia:**
> Como revisor, quiero elegir el idioma del OPL (English, Chinese, French, German, Korean, …) para leer el modelo en mi idioma sin alterar el OPD.

**Contexto de negocio:**
El lenguaje bimodal de OPM permite localizar el OPL sin tocar el OPD. Cambiar el idioma solo afecta el lexicon de la capa textual — el diagrama sigue identico. Esto habilita equipos multilingües compartiendo el mismo modelo.

**Criterios de aceptacion:**
- **Dado** que estoy en el panel Language & OPL Settings, **cuando** abro el desplegable `Language`, **entonces** veo al menos English, Chinese, French, German, Korean y la lista crece segun builds.
- **Dado** que el idioma actual es English, **cuando** elijo French, **entonces** el pane OPL cambia su lexicon a frances y el OPD permanece sin cambios.
- **Dado** que elegi un idioma nuevo, **cuando** recargo o abro otro modelo, **entonces** el idioma persiste como preferencia de usuario.

**Reglas y restricciones:**
- Por defecto canonico: `English`.
- El cambio afecta solo la **traduccion** del OPL, no los nombres de las cosas (los nombres son del usuario).
- Lista de idiomas se lee de build; no se declara cerrada.

**Modelo de datos tocado:**
- `user.preferences.opl_language` — string enum — persistente.

**Dependencias:**
- Bloqueada por: HU-81.002.

**Integraciones:**
- Motor OPL: consume la preferencia al generar oraciones.

**Notas de evidencia:**
- Fuente: §3.1.
- Transcripcion: "we can select which language you want the opl to be presented".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [config, opl, language, i18n, opcloud-ui].

---

### HU-81.004 — Fijar Things Default Essence (Physical/Informatical)

**Actor primario:** AO.
**Actores secundarios:** ME (modelador experto que crea masivamente cosas fisicas).
**Tipo:** opm-semantica.
**Nivel categorico:** C primario; K (afecta por defecto de creacion del kernel) secundario.
**Superficie UI:** panel Language & OPL Settings → desplegable `Things Default Essence`.
**Gesto canonico:** clic en desplegable + seleccion de `Physical` o `Informatical`.

**Historia:**
> Como admin o modelador experto, quiero fijar la esencia por defecto de las cosas nuevas (Physical o Informatical) para alinear la creacion con el dominio sin tener que alternar cada cosa.

**Contexto de negocio:**
El por defecto canonico (V-1) es `Informatical`, pero dominios como ingenieria industrial, robotica o salud crean mayoritariamente cosas fisicas. Permitir fijar el por defecto reduce clics repetitivos. La decision tiene consecuencia visual (sombra vs plano) y crea una brecha critica: dos usuarios con predefinidos opuestos generan el mismo modelo semantico con render cromatico opuesto.

**Criterios de aceptacion:**
- **Dado** que estoy en Language & OPL Settings, **cuando** abro el desplegable `Things Default Essence`, **entonces** veo los dos valores `Physical` e `Informatical`.
- **Dado** que elijo `Physical`, **cuando** termino la seleccion, **entonces** el valor queda guardado automaticamente sin boton Save (transcripcion: "automatically it is changed and saved").
- **Dado** que fije `Physical` como por defecto, **cuando** creo una cosa nueva por arrastre desde la barra (ver HU-10.001/002), **entonces** nace con `esencia=fisica` y se renderiza con sombra canonica. [V-124] [JOYAS §8]
- **Dado** que fije `Physical` como por defecto, **cuando** miro cosas creadas antes del cambio, **entonces** conservan su esencia original (no se re-estilan).

**Reglas y restricciones:**
- Por defecto canonico: `Informatical` (V-1).
- Guardado automatico, sin boton Save.
- El setting afecta solo **creacion futura**, no cosas existentes.
- Brecha critica (§3.2 fuente): sobrescribe silenciosamente la regla V-1 de la SSOT visual; la HU captura el hecho pero la decision de respetarlo o restringirlo queda abierta.

**Modelo de datos tocado:**
- `user.preferences.things_default_essence` — `"physical" | "informatical"` — persistente.
- Se propaga al por defecto de `thing.essence` en creacion (ver HU-10.001).

**Dependencias:**
- Bloqueada por: HU-81.002.
- Relaciona: HU-10.001, HU-10.002 (consumidores del por defecto), HU-10.013 (alternador manual).

**Integraciones:**
- Kernel de creacion: lee la preferencia al instanciar nueva cosa.
- Renderer: la sombra depende de la esencia, no del predefinido directo.

**Notas de evidencia:**
- Fuente normativa: [V-1] valores por defecto; [V-124] sombreado como canal semantico; [Glos 3.25] Informacional.
- Fuente: §3.2, §5.1.
- Frames: frame_00010, frame_00013, frame_00038.
- Transcripcion: "the default here is physical — getting the organizational default value but you can change it to your own preferences"; "automatically it is changed and saved".
- Evidencia visual: JOYAS §8 drop shadow.
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [config, kernel-preset, esencia, herencia, opm-semantica].

---

### HU-81.005 — Configurar OPL Essence Sentences (modo de visibilidad)

**Actor primario:** AO.
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Nivel categorico:** C primario; L (OPL) secundario.
**Superficie UI:** Language & OPL Settings → desplegable `OPL Essence Sentences`.
**Gesto canonico:** clic en desplegable + seleccion.

**Historia:**
> Como admin, quiero elegir cuando el OPL muestra oraciones de esencia (siempre, nunca, solo no-por-defecto) para calibrar la verbosidad del pane segun la audiencia.

**Contexto de negocio:**
Las oraciones `X es un objeto informacional y sistemico.` inflan el OPL si cada cosa las emite. Modelos grandes prefieren `Show OPL only for non-default Things` para ver solo desviaciones; modelos pedagogicos prefieren `Show all`. La configuracion es global por usuario.

**Criterios de aceptacion:**
- **Dado** que estoy en Language & OPL Settings, **cuando** abro `OPL Essence Sentences`, **entonces** veo al menos los valores `Show OPL only for non-default Things`, `Show all` y `Hide all`.
- **Dado** que elijo `Show OPL only for non-default Things`, **cuando** consulto el pane OPL, **entonces** solo aparecen oraciones de esencia para cosas cuya esencia difiere del por defecto.
- **Dado** que elijo `Show all`, **cuando** consulto el pane, **entonces** toda cosa emite su oracion de esencia.

**Reglas y restricciones:**
- Por defecto canonico inferido: `Show OPL only for non-default Things` (§5.1).
- Opciones alternativas (`Show all`, `Hide all`) inferidas por simetria; pendiente confirmar nombre exacto.

**Modelo de datos tocado:**
- `user.preferences.opl_essence_sentences_mode` — string enum — persistente.

**Dependencias:**
- Bloqueada por: HU-81.002.

**Integraciones:**
- Motor OPL.

**Notas de evidencia:**
- Fuente: §3.3, §5.1.
- Frames: frame_00010.
- Clase de afirmacion: observado + parcialmente inferido.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [config, opl, sentences, opcloud-ui].

---

### HU-81.006 — Configurar Units Display Options

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** C primario; L secundario.
**Superficie UI:** Language & OPL Settings → desplegable `Units Display Options`.
**Gesto canonico:** clic + seleccion.

**Historia:**
> Como admin, quiero elegir cuando el OPL muestra unidades (siempre, nunca, solo si aplica) para controlar el ruido visual segun el dominio.

**Contexto de negocio:**
Modelos computacionales con atributos numericos tienen unidades (kg, m/s, °C). Mostrarlas siempre asegura rigor; ocultarlas limpia la lectura. El admin de dominio elige el balance.

**Criterios de aceptacion:**
- **Dado** que estoy en Language & OPL Settings, **cuando** abro `Units Display Options`, **entonces** veo `Always show units`, `Hide`, `Show only when applicable`.
- **Dado** que elijo `Always show units`, **cuando** consulto el pane OPL de un modelo con atributos unitarios, **entonces** cada atributo muestra su unidad.
- **Dado** que elijo `Hide`, **cuando** consulto el pane, **entonces** las unidades se omiten.

**Reglas y restricciones:**
- Por defecto canonico inferido: `Always show units` (§5.1).
- Interactua con EPICA-B1 (computational attributes).

**Modelo de datos tocado:**
- `user.preferences.units_display_mode` — string enum — persistente.

**Dependencias:**
- Bloqueada por: HU-81.002.

**Integraciones:**
- Motor OPL; EPICA-B1 (unidades en atributos).

**Notas de evidencia:**
- Fuente: §3.3, §5.1.
- Frames: frame_00010.
- Clase de afirmacion: observado.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [config, opl, units, opcloud-ui].

---

### HU-81.007 — Configurar Alias OPL Display Options

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** C primario; L secundario.
**Superficie UI:** Language & OPL Settings → desplegable `Alias OPL Display Options`.
**Gesto canonico:** clic + seleccion.

**Historia:**
> Como admin, quiero elegir cuando el OPL muestra alias de las cosas (siempre, nunca, solo si aplica) para aclarar terminologia sin contaminar lecturas simples.

**Contexto de negocio:**
Alias permite que una cosa tenga un nombre corto y uno canonico; mostrar ambos en el OPL puede ser pedagogico o redundante segun el dominio. La configuracion centraliza la decision.

**Criterios de aceptacion:**
- **Dado** que estoy en Language & OPL Settings, **cuando** abro `Alias OPL Display Options`, **entonces** veo `Always`, `Never`, `Show only when applicable`.
- **Dado** que elijo `Show only when applicable`, **cuando** una cosa tiene alias definido, **entonces** la oracion OPL incluye el alias; si no tiene, no.

**Reglas y restricciones:**
- Por defecto canonico inferido: `Show only when applicable` (§5.1).
- Depende de la presencia de alias, definida en EPICA-17.

**Modelo de datos tocado:**
- `user.preferences.alias_display_mode` — string enum — persistente.

**Dependencias:**
- Bloqueada por: HU-81.002.
- Relaciona: EPICA-17 (edit alias).

**Integraciones:**
- Motor OPL; EPICA-17.

**Notas de evidencia:**
- Fuente: §3.3, §5.1.
- Frames: frame_00010.
- Clase de afirmacion: observado.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [config, opl, alias, opcloud-ui].

---

### HU-81.008 — Configurar OPL Numbering sincronizado con alternador del pane

**Actor primario:** RV.
**Actores secundarios:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** C primario; U (sincronizacion bidireccional con alternador del pane).
**Superficie UI:** Language & OPL Settings → alternador `OPL Numbering` y boton numeracion en pane OPL.
**Gesto canonico:** clic en alternador (en cualquiera de los dos lugares).

**Historia:**
> Como revisor, quiero que la numeracion del OPL se configure por defecto y ademas pueda alternarse desde el pane OPL con sincronizacion bidireccional para no duplicar controles.

**Contexto de negocio:**
La numeracion del OPL ayuda a referir oraciones especificas en reuniones. La sincronizacion entre el predefinido global y el alternador local evita estados divergentes: si activo numeracion en el pane, se persiste como por defecto. Detalle pedagogico confirmado en transcripcion.

**Criterios de aceptacion:**
- **Dado** que estoy en Language & OPL Settings, **cuando** cambio `OPL Numbering` a `True`, **entonces** las oraciones del pane OPL aparecen numeradas.
- **Dado** que alterno numeracion desde el boton del pane OPL, **cuando** abro Configuracion, **entonces** el predefinido `OPL Numbering` refleja el mismo valor.
- **Dado** que alterno desde Configuracion, **cuando** miro el pane OPL, **entonces** el boton del pane refleja el mismo valor.

**Reglas y restricciones:**
- Por defecto canonico: `True` (§5.1).
- Los dos alternadores (Configuracion y pane) son **el mismo estado subyacente**, no dos settings independientes.
- Consecuencia: configurar por sesion tambien altera el predefinido global.

**Modelo de datos tocado:**
- `user.preferences.opl_numbering` — boolean — persistente.
- Unica fuente de verdad para ambos alternadores.

**Dependencias:**
- Bloqueada por: HU-81.002.
- Relaciona: EPICA-50 (OPL pane).

**Integraciones:**
- Motor OPL; pane OPL (EPICA-50).

**Notas de evidencia:**
- Fuente: §3.3, §5.4.
- Transcripcion: confirma que `OPL Numbering` en Configuracion y el boton del pane OPL son el mismo alternador.
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [config, opl, numbering, sync-toggle, opcloud-ui].

---

### HU-81.009 — Configurar Auto Format como por defecto de creacion

**Actor primario:** AO.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** C primario; U (afecta popup de creacion).
**Superficie UI:** Language & OPL Settings → alternador `Auto Format`.
**Gesto canonico:** clic en alternador.

**Historia:**
> Como admin, quiero configurar si `Auto Format` (capitalizacion de cada palabra) viene marcado por defecto al crear cosas para alinear la politica de naming del equipo.

**Contexto de negocio:**
`Auto Format` en el popup de creacion (HU-10.006) esta marcado por defecto. Permitir configurar este por defecto como `False` ayuda a dominios donde el casing literal (marcas, acronimos) es la norma. Evita desmarcar la casilla en cada creacion.

**Criterios de aceptacion:**
- **Dado** que estoy en Language & OPL Settings, **cuando** cambio `Auto Format` a `False`, **entonces** el proximo popup de creacion abrira con la casilla desmarcada por defecto.
- **Dado** que `Auto Format = True` como por defecto, **cuando** creo una cosa y escribo `onstar system`, **entonces** se guarda como `Onstar System` (casing titulo).
- **Dado** que `Auto Format = False` como por defecto, **cuando** creo una cosa y escribo `OnStar System`, **entonces** se guarda exactamente como `OnStar System`.

**Reglas y restricciones:**
- Por defecto canonico: `True` (§5.1).
- La casilla del popup puede sobrescribirse por-creacion (ver HU-10.006); este setting solo define el valor inicial.

**Modelo de datos tocado:**
- `user.preferences.opl_auto_format` — boolean — persistente.

**Dependencias:**
- Bloqueada por: HU-81.002.
- Relaciona: HU-10.006 (casilla por-popup).

**Integraciones:**
- Popup de creacion (HU-10.003).

**Notas de evidencia:**
- Fuente: §3.3, §5.1.
- Frames: frame_00010.
- Clase de afirmacion: observado.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [config, ui, auto-format, rename, opcloud-ui].

---

### HU-81.010 — Configurar Highlight OPL↔OPD en hover

**Actor primario:** RV.
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** C primario; U (hover feedback) secundario.
**Superficie UI:** Language & OPL Settings → alternadores `Highlight OPL when Hovering on OPD` y `Highlight OPD when Hovering on OPL`.
**Gesto canonico:** clic en cada alternador independiente.

**Historia:**
> Como revisor, quiero activar o desactivar el resaltado cruzado OPL↔OPD al hacer hover para encontrar rapido la correspondencia entre diagrama y texto sin ruido visual cuando no lo necesito.

**Contexto de negocio:**
El resaltado cruzado es la afordancia pedagogica que une los dos modos bimodales de OPM. Util para aprender y revisar; molesto para quien modela intensivamente y quiere hover sin feedback. Los dos alternadores son independientes (direccion OPD→OPL vs OPL→OPD).

**Criterios de aceptacion:**
- **Dado** que `Highlight OPL when Hovering on OPD = True`, **cuando** hago hover sobre una cosa en el canvas, **entonces** la oracion OPL correspondiente se resalta en el pane.
- **Dado** que `Highlight OPD when Hovering on OPL = True`, **cuando** hago hover sobre una oracion en el pane OPL, **entonces** la cosa correspondiente se resalta en el canvas.
- **Dado** que desactivo ambos, **cuando** hago hover en cualquier lado, **entonces** no hay efecto cruzado.
- **Dado** que los dos alternadores son independientes, **cuando** activo solo uno, **entonces** solo esa direccion funciona.

**Reglas y restricciones:**
- Por defecto canonico: ambos `True` (§5.1).
- Son dos preferencias independientes, no un solo alternador.

**Modelo de datos tocado:**
- `user.preferences.highlight_opl_on_opd_hover` — boolean — persistente.
- `user.preferences.highlight_opd_on_opl_hover` — boolean — persistente.

**Dependencias:**
- Bloqueada por: HU-81.002.
- Relaciona: EPICA-50 (OPL pane).

**Integraciones:**
- Pane OPL; renderer canvas.

**Notas de evidencia:**
- Fuente: §3.4, §5.1.
- Frames: frame_00020.
- Clase de afirmacion: observado.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [config, opl, highlight, hover, opcloud-ui].

---

### HU-81.011 — Configurar Sync Things Colors of OPL and OPD

**Actor primario:** AO.
**Actores secundarios:** ME (modelador avanzado que estiliza fuerte el OPD).
**Tipo:** opcloud-ui.
**Nivel categorico:** C primario; V (render color) secundario.
**Superficie UI:** Language & OPL Settings → alternador `Sync Things Colors of OPL and OPD`.
**Gesto canonico:** clic en alternador.

**Historia:**
> Como admin, quiero configurar si los colores de las cosas en el OPD se sincronizan con el fragmento OPL correspondiente para permitir estilado visual fuerte en el diagrama sin contaminar el OPL exportado.

**Contexto de negocio:**
Con `Sync = True`, modificar el color del texto de un objeto en el OPD se refleja en el fragmento OPL. Con `Sync = False`, el color puede diverger. Es el setting para el modelador avanzado que exporta el modelo para documentacion formal: el OPD tiene emphasis cromatico pero el OPL se mantiene neutral.

**Criterios de aceptacion:**
- **Dado** que `Sync = True`, **cuando** cambio el color de texto de un objeto en el OPD, **entonces** el fragmento OPL correspondiente tambien cambia de color.
- **Dado** que `Sync = False`, **cuando** cambio el color del objeto en el OPD, **entonces** el OPL mantiene su color sin cambio.
- **Dado** que `Sync = False`, **cuando** exporto el OPL (ver EPICA-60), **entonces** el OPL no refleja emphasis cromatico del diagrama.

**Reglas y restricciones:**
- Por defecto canonico: `True` (§5.1).
- Pregunta abierta (§11.6 fuente): ¿es propiedad de vista o del documento? Si es del documento, alternarlo altera render de modelos ya creados.

**Modelo de datos tocado:**
- `user.preferences.sync_things_colors_opl_opd` — boolean — persistente.
- Alternativamente, `model.settings.sync_colors` — abierto.

**Dependencias:**
- Bloqueada por: HU-81.002.
- Relaciona: EPICA-14 (estilado por-instancia), EPICA-60 (export).

**Integraciones:**
- Motor OPL; renderer; exportadores.

**Notas de evidencia:**
- Fuente: §3.4, §5.1, §11.6.
- Frames: frame_00020.
- Transcripcion: "this is for more advanced user they want to export their model and show that emphasize on the diagram will not be reflected in the opl".
- Clase de afirmacion: confirmado por transcripcion; ambito vista/documento abierto.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [config, opl, render, sync-colors, requires-clarification, opcloud-ui].

---

### HU-81.012 — Fijar por defecto de estilo por clase (Style Settings)

**Actor primario:** AO.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** C primario; V (render) secundario.
**Superficie UI:** OPCloud Settings → seccion Style Settings (tabla Categories × Object/Process).
**Gesto canonico:** clic en celda + edicion del control (desplegable / swatch).

**Historia:**
> Como admin de organizacion, quiero fijar los por defecto de estilo (Tipografia, Tamano de tipografia, Color de texto, Color de relleno, Color de borde) por clase Object y Process para que todas las cosas nuevas del equipo arranquen con el estilo corporativo.

**Contexto de negocio:**
La tabla Style Settings es el control cromatico principal. Tiene cinco filas por dos columnas (Object y Process), cubriendo los pares de atributos visuales canonicos. La asimetria Object/Process vs el silencio sobre estados, enlaces, ambiental y esencia es intencional — esas clases se estilan por-instancia o por otros predefinidos. La SSOT [V-63] establece que los colores son informativos, no normativos; los valores canonicos de OPCloud se documentan en [JOYAS §1] (colores) y [JOYAS §3] (tipografia).

**Criterios de aceptacion:**
- **Dado** que estoy en OPCloud Settings, **cuando** hago scroll hasta Style Settings, **entonces** veo una tabla con columnas `Categories`, `Object Style Settings`, `Process Style Settings` y cinco filas: Font size, Font, Text Color, Fill Color, Border Color.
- **Dado** que estoy en la tabla, **cuando** cambio `Font size` de Object a 16, **entonces** se guarda y afecta a objetos creados a partir de ese momento.
- **Dado** que cambio `Border Color` de Process a rojo, **cuando** creo un proceso nuevo, **entonces** su borde es rojo.
- **Dado** que la tabla usa los por defecto canonicos, **cuando** consulto: Tipografia=Arial, Tamano de tipografia=14, Color de texto=negro, Color de relleno=blanco `#fdffff`, Color de borde=verde `#70E483` (Object) / cyan `#3BC3FF` (Process). [JOYAS §1] [JOYAS §3]
- **Dado** que estados, enlaces y la dimension environmental/physical no tienen columna, **cuando** los miro, **entonces** son **herencia del contenedor** o por-instancia (ver HU-14.xxx).

**Reglas y restricciones:**
- Por defecto canonico: Arial 14px semibold, texto negro `#000002`, relleno `#fdffff`, borde verde `#70E483` (Object) / cyan `#3BC3FF` (Process). [JOYAS §1] [JOYAS §3]
- Dimensiones canonicas: 135×60 px. [JOYAS §2]
- Solo Object y Process son estilables por-clase. Estados heredan del Object; enlaces se estilan por-instancia (EPICA-14).
- El cambio afecta solo creacion futura (ver HU-81.013).

**Modelo de datos tocado:**
- `organization.defaults.style.object` — `{tipografia, tamano_tipografia, color_texto, color_relleno, color_borde}` — persistente.
- `organization.defaults.style.process` — identico shape — persistente.
- Overridable en `user.preferences.style.*`.

**Dependencias:**
- Bloqueada por: HU-81.002.
- Bloquea a: HU-81.013 (invariante de preservacion).

**Integraciones:**
- Kernel de creacion (consume predefinido al instanciar).
- Renderer (usa atributos materializados en cada cosa).

**Notas de evidencia:**
- Fuente normativa: [V-63] colores informativos, no normativos.
- Fuente: §3.5, §5.2, §9.
- Frames: frame_00029, frame_00030, frame_00032.
- Evidencia visual: JOYAS §1 paleta canonica, JOYAS §2 dimensiones, JOYAS §3 tipografia Arial 14px semibold.
- Clase de afirmacion: observado + confirmado.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [config, estilo, por-clase, object-process, opcloud-ui].

---

### HU-81.013 — Preservar estilo existente al cambiar por defecto de estilo

**Actor primario:** AO.
**Tipo:** opm-semantica.
**Nivel categorico:** C primario; K (instantanea-al-crear) secundario.
**Superficie UI:** panel Style Settings (misma que HU-81.012) — comportamiento observable al inspeccionar cosas antiguas.
**Gesto canonico:** ninguno (invariante de modelo).

**Historia:**
> Como admin, quiero que cambiar un por defecto de estilo NO altere el estilo de las cosas ya creadas para que los modelos existentes mantengan su apariencia original.

**Contexto de negocio:**
Si el sistema re-estilara cosas existentes al cambiar el predefinido, los modelos compartidos entre usuarios con predefinidos distintos se verian diferentes al abrirlos. La decision de OPCloud es **instantanea-al-crear**: el estilo se fija al instanciar la cosa y queda persistido en el modelo. Corolario: un modelo puede tener cosas con estilos heterogeneos si se creo a lo largo de sesiones con distintos predefinidos. La SSOT [V-63] indica que los colores son informativos, no normativos — lo que refuerza que el estilo materializado pertenece a la instancia, no al predefinido activo.

**Criterios de aceptacion:**
- **Dado** que tengo un modelo con cosas creadas bajo por defecto `Tipografia=Arial, size=14`, **cuando** cambio el por defecto a `Tipografia=Times, size=16`, **entonces** las cosas existentes mantienen Arial/14.
- **Dado** que cambie el por defecto, **cuando** creo una cosa nueva en el mismo modelo, **entonces** la nueva nace con Times/16.
- **Dado** que un modelo mezcla cosas de diferentes sesiones, **cuando** lo inspecciono, **entonces** puedo ver cosas con distintos estilos — esto es esperado, no bug.
- **Dado** que abro un modelo creado por otro usuario con predefinido distinto, **cuando** lo veo, **entonces** se renderiza con los estilos fijos al momento de cada creacion, no con los mios.

**Reglas y restricciones:**
- Invariante duro: cada `cosa.estilo` se materializa al crear y se persiste en el modelo.
- El renderer consulta `cosa.estilo` directo, no el predefinido de usuario.
- Predefinido de usuario solo interviene en creacion.

**Modelo de datos tocado:**
- `cosa.estilo` — `{tipografia, tamano_tipografia, color_texto, color_relleno, color_borde}` — persistente por instancia.

**Dependencias:**
- Bloqueada por: HU-81.012.
- Bloquea a: HU-81.022 (instantanea ampliada a todos los predefinidos).

**Integraciones:**
- Renderer; persistencia.

**Notas de evidencia:**
- Fuente normativa: [V-63] colores informativos.
- Fuente: §3.5, §4.2, §6 (modelo de datos inferido).
- Transcripcion: "it will not change previous object and process but only newer created one".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [config, estilo, invariante, instantanea-al-crear, opm-semantica].

---

### HU-81.014 — Configurar Grid Mode (On/Off) como por defecto

**Actor primario:** AO.
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** C primario; V (render canvas) secundario.
**Superficie UI:** Grid Settings → alternador `Mode`.
**Gesto canonico:** clic en alternador.

**Historia:**
> Como admin, quiero fijar si la grilla del canvas es visible por defecto al abrir un modelo para alinear con el estilo de trabajo del equipo.

**Contexto de negocio:**
La grilla ayuda a alinear cosas visualmente. Para equipos que usan layout algoritmico o que prefieren canvas limpio, la grilla es ruido. Fijar el por defecto en Configuracion evita alternar cada sesion. El alternador de la barra del canvas (EPICA-1A) permite alternar por-sesion sin tocar configuracion.

**Criterios de aceptacion:**
- **Dado** que estoy en Grid Settings, **cuando** cambio `Mode` a `On`, **entonces** los modelos nuevos o recien abiertos muestran la grilla por defecto.
- **Dado** que fije `Mode=Off`, **cuando** abro un modelo, **entonces** no se ve la grilla.
- **Dado** que la grilla esta `Off` por defecto, **cuando** alterno desde la barra del canvas, **entonces** la veo en la sesion actual sin alterar el predefinido.

**Reglas y restricciones:**
- Por defecto canonico: `Off` en modelo vacio (§5.3).
- El alternador por-sesion (barra canvas, EPICA-1A) es independiente del predefinido.

**Modelo de datos tocado:**
- `user.preferences.grid.mode` — boolean — persistente.

**Dependencias:**
- Bloqueada por: HU-81.002.
- Relaciona: EPICA-1A (alternador por sesion).

**Integraciones:**
- Renderer canvas.

**Notas de evidencia:**
- Fuente: §3.6, §5.3.
- Frames: carpeta 42 frame_00011.
- Clase de afirmacion: observado.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [config, grilla, canvas, por-defecto, opcloud-ui].

---

### HU-81.015 — Configurar Grid Size, Color, Thickness y Scale Factor

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** C primario; V secundario.
**Superficie UI:** Grid Settings → controles numericos y swatch.
**Gesto canonico:** edicion directa de campo o swatch.

**Historia:**
> Como admin, quiero configurar Grid Size, Grid Color, Grid Thickness y Scale Factor para afinar la apariencia de la grilla segun la densidad visual deseada.

**Contexto de negocio:**
Ademas del alternador On/Off, la grilla tiene cuatro parametros finos. Grid Size controla el espaciado, Color y Thickness controlan la intensidad visual, Scale Factor es el multiplicador relativo al zoom. Los cuatro permiten ajustar la grilla al nivel de detalle tipico del dominio.

**Criterios de aceptacion:**
- **Dado** que estoy en Grid Settings, **cuando** cambio `Grid Size` a 10, **entonces** la grilla se redibuja con espaciado mayor al guardar.
- **Dado** que cambio `Grid Color` a un swatch mas oscuro, **cuando** miro el canvas, **entonces** la grilla es mas visible.
- **Dado** que cambio `Grid Thickness` a 2, **cuando** miro el canvas, **entonces** las lineas de grilla son mas gruesas.
- **Dado** que cambio `Scale Factor` a 50, **cuando** hago zoom, **entonces** la relacion zoom/grilla se ajusta.
- **Dado** que los por defecto canonicos son `Grid Size=5, Grid Thickness=1, Scale Factor=35, Color=gris medio`, **cuando** consulto valores por primera vez, **entonces** coinciden con esos por defecto.

**Reglas y restricciones:**
- Por defecto canonicos (§5.3): Grid Size=5, Grid Color=gris medio (~#888), Grid Thickness=1, Scale Factor=35.
- Unidades de Grid Size y Scale Factor no estan declaradas en UI; Grid Thickness probablemente px.
- El contrato visual no declarado se documenta en `opcloud-reverse/42-grid-alignment.md §42.2, §42.6`.

**Modelo de datos tocado:**
- `user.preferences.grid.size` — number — persistente.
- `user.preferences.grid.color` — string hex — persistente.
- `user.preferences.grid.thickness` — number — persistente.
- `user.preferences.grid.scale_factor` — number — persistente.

**Dependencias:**
- Bloqueada por: HU-81.014.

**Integraciones:**
- Renderer canvas (grilla como capa de fondo).

**Notas de evidencia:**
- Fuente: §3.6, §5.3.
- Frames: carpeta 42 frame_00011, 00013, 00015, 00018.
- Clase de afirmacion: observado.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [config, grilla, canvas, estilo, opcloud-ui].

---

### HU-81.016 — Ver modal de confirmacion SUCCESS al guardar Grid Settings

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** Grid Settings → modal flotante centrado tras Save.
**Gesto canonico:** ninguno (eco del guardado).

**Historia:**
> Como admin, quiero ver un modal SUCCESS con countdown al guardar Grid Settings para confirmar visualmente la persistencia sin ambigüedad.

**Contexto de negocio:**
Grid Settings es uno de los pocos paneles que muestra feedback explicito de guardado (los otros paneles usan guardado automatico silencioso). Esta asimetria sugiere que Grid Settings tiene un flujo Save distinto — probablemente batch — con confirmacion bloqueante de 3–5 segundos.

**Criterios de aceptacion:**
- **Dado** que cambie uno o mas parametros de Grid Settings, **cuando** guardo, **entonces** aparece un modal flotante centrado con texto `SUCCESS!! Saved — Continue N` donde N es un countdown.
- **Dado** que el modal esta visible, **cuando** N llega a 0, **entonces** el modal se cierra automaticamente.
- **Dado** que el modal esta visible, **cuando** intento interactuar con el fondo, **entonces** el modal bloquea la interaccion.

**Reglas y restricciones:**
- El modal es chrome UI, no semantico.
- Asimetria con otros paneles (que guardan silencioso) es observada; decision de producto no explicada.

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-81.015.

**Integraciones:**
- Ninguna.

**Notas de evidencia:**
- Fuente: §2 tabla + `42-grid-alignment §42.7`.
- Frames: carpeta 42 frame_00018.
- Clase de afirmacion: observado.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [config, grilla, feedback, modal, opcloud-ui].

---

### HU-81.017 — Configurar Spell Checking en rotulos

**Actor primario:** MN.
**Actores secundarios:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** C primario; U (UX rotulos) secundario.
**Superficie UI:** OPCloud Settings → alternador `Spell Checking`.
**Gesto canonico:** clic en alternador.

**Historia:**
> Como modelador, quiero activar o desactivar la correccion ortografica en los rotulos para evitar marcas rojas en acronimos o terminos de dominio.

**Contexto de negocio:**
OPM se usa en dominios tecnicos con vocabulario especifico. La correccion ortografica marca terminos legitimos como errores y contamina la lectura. Desactivarla es util en dominios especializados; activarla ayuda a modeladores en texto general.

**Criterios de aceptacion:**
- **Dado** que estoy en OPCloud Settings, **cuando** cambio `Spell Checking` a `Enabled`, **entonces** los rotulos con palabras no reconocidas muestran subrayado rojo.
- **Dado** que `Spell Checking = Disabled`, **cuando** escribo en rotulos, **entonces** no aparecen marcas de correccion.

**Reglas y restricciones:**
- Motor de correccion: OPCloud propio o del navegador (transcripcion ambigua).
- Por defecto canonico no declarado explicitamente; observado en frame_00025 como control independiente.

**Modelo de datos tocado:**
- `user.preferences.spell_checking` — boolean — persistente.

**Dependencias:**
- Bloqueada por: HU-81.002.

**Integraciones:**
- Editor de rotulos.

**Notas de evidencia:**
- Fuente: §4.4.
- Frames: frame_00025.
- Transcripcion: confirma uso de revisor OPCloud o navegador.
- Clase de afirmacion: observado + confirmado.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [config, ui, spell-checking, opcloud-ui].

---

### HU-81.018 — Configurar visibilidad por defecto de Notes

**Actor primario:** RV.
**Actores secundarios:** CO (colaborador editor).
**Tipo:** opcloud-ui.
**Nivel categorico:** C primario; U secundario.
**Superficie UI:** OPCloud Settings → alternador `Notes`.
**Gesto canonico:** clic en alternador.

**Historia:**
> Como revisor, quiero elegir si las notas se muestran por defecto al abrir modelos para controlar la densidad visual sin tener que alternar desde la barra cada sesion.

**Contexto de negocio:**
Las notas son anotaciones sobre el modelo (EPICA-42). Mostrarlas por defecto es util durante revisiones colaborativas; ocultarlas limpia el canvas para modelado puro. El por defecto se expone como preferencia de usuario.

**Criterios de aceptacion:**
- **Dado** que estoy en OPCloud Settings, **cuando** cambio `Notes` a `Show`, **entonces** los modelos nuevos o recien abiertos muestran notas por defecto.
- **Dado** que `Notes = Hide`, **cuando** abro un modelo con notas, **entonces** las notas existen en el modelo pero no se renderizan.
- **Dado** que el control `Notes` en Configuracion es equivalente al boton de notas en la secondary toolbar, **cuando** cambio uno, **entonces** la sesion actual refleja el cambio.

**Reglas y restricciones:**
- Por defecto canonico no declarado; observado en frame_00025.
- Interactua con EPICA-42 (notes colaborativas).

**Modelo de datos tocado:**
- `user.preferences.notes_visibility` — `"show" | "hide"` — persistente.

**Dependencias:**
- Bloqueada por: HU-81.002.
- Relaciona: EPICA-42.

**Integraciones:**
- Renderer notes; secondary toolbar.

**Notas de evidencia:**
- Fuente: §4.4.
- Frames: frame_00025.
- Clase de afirmacion: observado.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [config, ui, notes, visibilidad, opcloud-ui].

---

### HU-81.019 — Configurar visibilidad por defecto de OPD names en el arbol

**Actor primario:** RV.
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** C primario; L (lente arbol OPD) secundario.
**Superficie UI:** OPCloud Settings → alternador `OPD names`.
**Gesto canonico:** clic en alternador.

**Historia:**
> Como revisor, quiero controlar si los OPD names largos aparecen en el arbol por defecto para elegir entre legibilidad rica o vista compacta.

**Contexto de negocio:**
Cada OPD tiene un nombre corto (ID tipo `SD1`, `SD1.1`) y un nombre largo (`Driver Rescuing in-zoomed`). Mostrar ambos enriquece contexto pero consume espacio vertical en el arbol. Ocultar nombres largos colapsa a ID corto, util en arboles profundos.

**Criterios de aceptacion:**
- **Dado** que estoy en OPCloud Settings, **cuando** cambio `OPD names` a `Hide`, **entonces** el arbol OPD muestra solo IDs cortos (`SD`, `SD1`, `SD1.1`).
- **Dado** que `OPD names = Show`, **cuando** miro el arbol, **entonces** veo IDs cortos + nombres largos.
- **Dado** que cambio el alternador, **cuando** vuelvo al canvas, **entonces** la navegacion por el arbol refleja el cambio.

**Reglas y restricciones:**
- Por defecto canonico no declarado; frame_00037 muestra vista con `Hide`.
- Interactua con EPICA-20 (OPD tree).

**Modelo de datos tocado:**
- `user.preferences.opd_names_visibility` — `"show" | "hide"` — persistente.

**Dependencias:**
- Bloqueada por: HU-81.002.
- Relaciona: EPICA-20.

**Integraciones:**
- Arbol OPD.

**Notas de evidencia:**
- Fuente: §4.4, §7.3.
- Frames: frame_00001, frame_00025, frame_00037.
- Transcripcion: "OPD names or a short name if i don't want to show them".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [config, ui, opd-tree, visibilidad, opcloud-ui].

---

### HU-81.020 — Heredar por defecto de organizacion con override por usuario

**Actor primario:** AO.
**Actores secundarios:** ME, MN (heredan y pueden override).
**Tipo:** mixto.
**Nivel categorico:** C primario; P (persistencia en dos niveles) secundario.
**Superficie UI:** todos los paneles de Configuracion.
**Gesto canonico:** N/A (invariante de arquitectura de preferencias).

**Historia:**
> Como admin de organizacion, quiero fijar por defecto organizacionales que todos los usuarios hereden automaticamente y que cada uno pueda override en sus propias preferencias para alinear el equipo sin imponer rigidez.

**Contexto de negocio:**
La arquitectura de tres niveles (canonico OPCloud → organizacion → usuario) permite que un admin fije politica corporativa (branding cromatico, politica OPL) y cada modelador la ajuste a su flujo. Es un patron estandar de sistemas multiusuario; la HU captura la existencia del mecanismo sin entrar al detalle admin (que vive en EPICA-80). La SSOT [V-1] define los valores por defecto canonicos de esencia y afiliacion; la organizacion puede sobrescribirlos y el usuario puede refinar aun mas.

**Criterios de aceptacion:**
- **Dado** que un admin fijo `Things Default Essence = Physical` a nivel organizacion, **cuando** un usuario nuevo entra por primera vez, **entonces** su preferencia efectiva es `Physical`.
- **Dado** que el usuario override a `Informatical` en sus preferencias, **cuando** crea una cosa, **entonces** nace `Informatical` (gana el override de usuario).
- **Dado** que el usuario no ha fijado preferencia local, **cuando** consulta el valor efectivo, **entonces** ve el por defecto de organizacion.
- **Dado** que el admin cambia el por defecto organizacional, **cuando** un usuario sin override recarga, **entonces** su valor efectivo cambia; usuarios con override mantienen su valor.

**Reglas y restricciones:**
- Precedencia: usuario > organizacion > canonico.
- Admin ve y edita por defecto de organizacion (en EPICA-80, no aqui).
- Usuario nunca edita el por defecto canonico.
- Transcripcion: "the default here is physical — getting the organizational default value but you can change it to your own preferences".

**Modelo de datos tocado:**
- `organization.defaults.*` — todos los parametros — persistente a nivel organizacion.
- `user.preferences.*` — override parcial — persistente a nivel usuario.
- Valor efectivo: `user.preferences.X ?? organization.defaults.X ?? canonical.X`.

**Dependencias:**
- Bloquea a: HU-81.021 (el restablecimiento depende de la herencia).
- Relaciona: EPICA-80 (admin de organizacion).

**Integraciones:**
- Toda la epica depende de esta semantica.
- Kernel de preferencias; auth; organizacion.

**Notas de evidencia:**
- Fuente normativa: [V-1] valores por defecto canonicos.
- Fuente: §1 (herencia), §4.1 (transcripcion), §6 (modelo).
- Transcripcion: confirma los tres niveles.
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [config, herencia, organizacion, usuario, mixto].

---

### HU-81.021 — Restablecer panel a por defecto canonicos u organizacionales

**Actor primario:** MN.
**Actores secundarios:** AO.
**Tipo:** mixto.
**Nivel categorico:** C primario; P secundario.
**Superficie UI:** cada panel de Configuracion → boton `Reset to Default` / `Reset to default` al pie.
**Gesto canonico:** clic en boton restablecer del panel.

**Historia:**
> Como modelador, quiero restablecer un panel entero a sus por defecto con un solo clic para descartar experimentacion fallida sin editar parametro por parametro.

**Contexto de negocio:**
Cada panel (Language & OPL Settings, Style Settings, Grid Settings) tiene su propio boton restablecer. La existencia de restablecimientos granulares por panel sugiere que OPCloud trata cada panel como una unidad independiente; no hay restablecimiento global. Pregunta abierta critica (§11.1): ¿restablecer vuelve al canonico o al organizacional? La transcripcion sugiere herencia, pero no especifica.

**Criterios de aceptacion:**
- **Dado** que modifique parametros en Language & OPL Settings, **cuando** hago clic en `Reset to Default` al pie del panel, **entonces** todos los parametros del panel vuelven a sus valores por defecto (canonico u organizacional — abierto).
- **Dado** que modifique parametros en Style Settings, **cuando** hago clic en `Reset to default`, **entonces** la tabla entera (5 filas × 2 columnas) vuelve a por defecto.
- **Dado** que modifique Grid Settings, **cuando** hago restablecer, **entonces** los 5 parametros vuelven a por defecto.
- **Dado** que el boton es por-panel, **cuando** restablezco Language & OPL, **entonces** Style Settings y Grid Settings NO se restablecen.
- **Dado** que mi organizacion tiene por defecto fijados, **cuando** hago restablecer, **entonces** el resultado depende de la resolucion de la pregunta abierta: probablemente vuelve al por defecto organizacional, no al canonico.

**Reglas y restricciones:**
- No hay restablecimiento global "Reset ALL" — observacion §9.
- Pregunta abierta: nivel al que se restablece (canonico vs organizacional).
- El restablecimiento es instantaneo, sin confirmacion observada.

**Modelo de datos tocado:**
- `user.preferences.*` del panel — se vacia o se sobrescribe con por defecto.

**Dependencias:**
- Bloqueada por: HU-81.020 (herencia).
- Bloqueada por: las HU de cada panel especifico.

**Integraciones:**
- Todos los paneles de Configuracion.

**Notas de evidencia:**
- Fuente: §3.7, §11.1.
- Frames: frame_00020 (Language & OPL), frame_00030, frame_00032 (Style).
- Transcripcion: implica herencia, no clarifica nivel.
- Clase de afirmacion: observado + pregunta abierta.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [config, reset, herencia, requires-clarification, mixto].

---

### HU-81.022 — Preservar instantanea del predefinido al crear cada cosa

**Actor primario:** AO.
**Actores secundarios:** ME.
**Tipo:** opm-semantica.
**Nivel categorico:** C primario; K (cada cosa lleva instantanea) secundario.
**Superficie UI:** N/A (invariante de modelo).
**Gesto canonico:** ninguno (se materializa en cada creacion).

**Historia:**
> Como admin, quiero que cada cosa creada lleve instantanea del predefinido de estilo activo al momento de su creacion para que los modelos sean reproducibles visualmente sin depender del usuario que los abre.

**Contexto de negocio:**
Generalizacion del invariante de HU-81.013 (preservar estilo existente) a todos los parametros estilables. El modelo debe ser autosuficiente visualmente: abrirlo en otro usuario con otros predefinidos no cambia como se ve. La unica forma de lograrlo es materializar el predefinido efectivo en cada cosa al crearla. Corolario derivado (§4.3): `Things Default Essence` queda codificado visualmente (sombra) pero no hay rastro del predefinido que se uso — `esencia` de la cosa si se guarda, pero el predefinido que lo genero no. La SSOT [V-1] define la esencia como atributo persistente de la cosa, no del predefinido de sesion.

**Criterios de aceptacion:**
- **Dado** que creo una cosa con predefinido activo `Tipografia=Arial, size=14`, **cuando** la cosa persiste, **entonces** `cosa.estilo = {tipografia: "Arial", tamano_tipografia: 14, ...}` queda guardado en la instancia.
- **Dado** que otro usuario abre el mismo modelo con predefinido `Tipografia=Times`, **cuando** renderiza la cosa, **entonces** se ve Arial 14 (lee de `cosa.estilo`, no del predefinido).
- **Dado** que `Things Default Essence = Physical` al crear, **cuando** persiste, **entonces** `cosa.esencia = "fisica"` queda en la instancia (pero el predefinido usado no se rastrea — §4.3).
- **Dado** que el modelo viaja entre usuarios, **cuando** se renderiza, **entonces** es reproducible visualmente sin ambigüedad.

**Reglas y restricciones:**
- Invariante duro: renderer lee de `cosa.*`, nunca del predefinido de usuario en el momento del render.
- Predefinido solo interviene en **el instante de creacion**.
- Pregunta abierta (§11.3 fuente): ¿`.opm` exportado incluye el valor efectivo del predefinido activo al crear, o solo el resultado materializado? La segunda opcion es el invariante preferido (mas portable).
- Pregunta abierta (§11.5 fuente): ¿si carga modelo con esencia `Informatical` y crea nueva cosa, hereda del predefinido actual o del original del modelo? Implementacion debe decidir.

**Modelo de datos tocado:**
- `cosa.estilo` — instantanea completa — persistente.
- `cosa.esencia`, `cosa.afiliacion` — instantanea — persistente.
- Predefinido de usuario: NO se rastrea en la cosa.

**Dependencias:**
- Bloqueada por: HU-81.012, HU-81.013.
- Relaciona: toda HU que defina por defecto al crear (HU-10.001, HU-10.002).

**Integraciones:**
- Kernel de creacion; persistencia; renderer.
- Exportadores (`.opm`).

**Notas de evidencia:**
- Fuente normativa: [V-1] esencia y afiliacion como atributos persistentes de la cosa.
- Fuente: §4.2, §4.3, §6 modelo de datos inferido, §11.3, §11.5.
- Clase de afirmacion: confirmado por transcripcion (invariante de preservacion) + abierto en detalles serializacion.
- Etiqueta: `requires-clarification` (para decisiones serializacion).

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [config, kernel, instantanea-al-crear, persistencia, requires-clarification, opm-semantica].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q81.1**: ¿`Reset to Default` vuelve al por defecto canonico o al por defecto organizacional? (cf. HU-81.021). La transcripcion sugiere herencia pero no clarifica nivel. Marcada `requires-clarification`.
- **Q81.2**: ¿Donde vive `Grid Settings` dentro del carril en la version 14? En carpeta 42 aparece bajo Style Settings; en frames de carpeta 14 no es visible — puede haber evolucionado entre versiones. Afecta HU-81.014, HU-81.015.
- **Q81.3**: ¿El `.opm` exportado incluye el valor efectivo de `Things Default Essence` al momento de crear cada cosa, o solo la sombra resultante? (cf. HU-81.022). Marcada `requires-clarification`.
- **Q81.4**: ¿`Fill Color = blanco` es equivalente a transparente o es un blanco opaco que tapa la grilla? Afecta la interaccion entre HU-81.012 y HU-81.014.
- **Q81.5**: ¿Que pasa si una organizacion fija `Things Default Essence = Physical` y un usuario carga un modelo creado con el por defecto canonico `Informatical`? Cosas existentes se respetan; las **nuevas** creadas en ese modelo heredan del predefinido del usuario actual o del creador original? Afecta HU-81.022.
- **Q81.6**: ¿`Sync Things Colors of OPL and OPD` es propiedad de vista o del documento? Si es del documento, alternarlo altera render de modelos ya creados. (cf. HU-81.011). Marcada `requires-clarification`.
- **Q81.7**: ¿La grilla se imprime en export SVG/PDF cuando `Grid Mode = On`? (cf. HU-81.014 + EPICA-60/61). Nueva HU candidata: HU-81.023 (deferred hasta clarificar).
- **Q81.8**: ¿Existe algun parametro global `state style` inferido pero no expuesto, o el estado simplemente hereda del Object contenedor sin override posible? Afecta cobertura de HU-81.012.

## Referencias cruzadas

- Doc fuente: `opcloud-reverse/81-config-style-defaults.md`.
- Epicas relacionadas (consumidoras o proveedoras):
  - **EPICA-10** (canvas-creacion-cosas): HU-10.001, HU-10.002, HU-10.006, HU-10.013 consumen predefinidos de esencia/estilo; HU-81.004, HU-81.009, HU-81.012 los configuran.
  - **EPICA-14** (canvas-styling): estilado por-instancia; coexiste con HU-81.012 como granularidad complementaria.
  - **EPICA-17** (canvas-atributos-instancias): edit alias; HU-81.007 modula su visibilidad.
  - **EPICA-1A** (canvas-grid-resize): alternador grilla por-sesion; complementa HU-81.014 / HU-81.015.
  - **EPICA-20** (estructura-opd-tree): HU-81.019 controla visibilidad de OPD names en el arbol.
  - **EPICA-42** (colaboracion-notes): HU-81.018 controla visibilidad por defecto de notes.
  - **EPICA-50** (opl-pane): toda la seccion Language & OPL Settings acopla con el pane OPL; HU-81.003, HU-81.005–008, HU-81.010, HU-81.011.
  - **EPICA-60/61** (export-pdf/svg): pregunta abierta Q81.7 sobre grilla en export.
  - **EPICA-80** (config-user-org): hermana — gestiona el nivel organizacion (HU-81.020 referencia la herencia).
  - **EPICA-B1** (simulation-computational): HU-81.006 consume unidades de atributos computacionales.
- Evidencia visual: JOYAS §1 colores canonicos `#70E483` / `#3BC3FF` / `#586D8C` / `#fdffff`, JOYAS §2 dimensiones 135×60 px, JOYAS §3 tipografia Arial 14px semibold, JOYAS §4 patron wrapper+line, JOYAS §8 drop shadow.
- Invariantes del repo:
  - `src/persistencia/`: materializacion de instantaneas de predefinido (HU-81.013, HU-81.022).
  - `src/render/jointjs/`: renderer consume `cosa.estilo` materializado, no predefinido de usuario.
  - `src/render/opl-renderer.ts`: consume preferencias de language, numbering, essence sentences, units, alias.
  - `src/nucleo/tipos.ts`: `Cosa.estilo`, `Cosa.esencia`, `Cosa.afiliacion` son campos persistidos por instancia.
- SSOT OPM:
  - V-1 (esencia/sombra): `Things Default Essence = Physical` sobrescribe silenciosamente V-1 — brecha documentada en HU-81.004.
  - V-63 (colores informativos): los colores de borde y relleno no son normativos — la tabla Style Settings es convencion, no requisito.
  - §9 fuente: "default profile canonico no publicado" (Arial 14, borders verde/cyan, Sync=True, Essence=Informatical, Grid Size=5, Thickness=1, Scale Factor=35) funciona como SSOT de facto visual.
