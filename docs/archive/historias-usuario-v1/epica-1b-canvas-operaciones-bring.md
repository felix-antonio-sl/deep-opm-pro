---
epica: "EPICA-1B"
titulo: "Canvas — operaciones bring (hidratar OPD con cosas y enlaces existentes no visibles)"
doc_fuente: "opcloud-reverse/1b-canvas-operaciones-bring.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "M1"
hu_emitidas: 16
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "DIAGNOSTICO-PILOTO-EPICA-10.md"
ultima_actualizacion: 2026-04-23
---

## Resumen

Esta epica cubre las operaciones de **hidratacion** del OPD actual: traer al diagrama visible cosas y/o enlaces que **ya existen en el modelo logico** pero **no estan renderizados** en el OPD corriente. Son operaciones puramente de **visibilidad por apariencia**, no de creacion: la entidad logica es unica, sus apariciones en diferentes OPDs son multiples.

La epica materializa dos operaciones principales:

1. **Bring Connected Elements** — seleccionando una cosa, trae las cosas directamente conectadas (filtrables por familia de enlace). Disponible con dos afordances: toolbar contextual (ruta detallada con picker) y halo/pie menu (ruta rapida con default configurado).
2. **Bring Links Between Selected Entities** — con multiples cosas ya visibles en el OPD, trae los enlaces existentes entre ellas en otros OPDs pero aun no renderizados aqui.

El principio rector es **conectividad directa**: no se propaga por jerarquia o herencia. El resultado produce nuevas **apariencias** (aparicion persistente de la cosa en este OPD), nunca nuevas entidades logicas.

Todas las HU asumen la existencia previa del kernel OPM con separacion `entidad logica / apariencia por OPD` (modelo implicito documentado en §6 del doc fuente). La epica es parcialmente dependiente de decisiones aun no tomadas en el repo (modelo de apariencias multiples — ver preguntas abiertas).

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-1B.001 | Activar Bring Connected Elements desde toolbar contextual | ME | M1 | S | mixto | [§Gestion de contexto] |
| HU-1B.002 | Elegir familias de enlace en dialogo Bring | ME | M1 | M | mixto | [§Gestion de contexto] |
| HU-1B.003 | Materializar cosas conectadas directamente al OPD actual | ME | M1 | M | mixto | [§Gestion de contexto] |
| HU-1B.004 | Respetar conectividad directa sin propagar por jerarquia | ME | M1 | S | mixto | [§Gestion de contexto] |
| HU-1B.005 | Activar Bring Connected Elements desde halo con default | ME | M1 | S | mixto | [§Gestion de contexto] |
| HU-1B.006 | Configurar default de Bring Connected Things en settings | ME | S | S | mixto | [§Gestion de contexto] |
| HU-1B.007 | Seleccionar multiples cosas con Ctrl para habilitar bring-links | ME | M1 | S | mixto | [§Gestion de contexto] |
| HU-1B.008 | Activar Bring Links Between Selected Entities desde toolbar | ME | M1 | S | mixto | [§Gestion de contexto] |
| HU-1B.009 | Traer unicamente enlaces internos a la seleccion multiple | ME | M1 | M | mixto | [§Gestion de contexto] |
| HU-1B.010 | Evitar duplicar apariencia si la cosa ya esta visible en el OPD | ME | M1 | S | mixto | [§Gestion de contexto] |
| HU-1B.011 | Recalcular ruteo y posicion de las cosas traidas | ME | M1 | M | mixto | [§Gestion de contexto] |
| HU-1B.012 | Persistir apariencia creada en la sesion del OPD | ME | M1 | M | mixto | [§Gestion de contexto] |
| HU-1B.013 | No generar oraciones OPL-ES nuevas al traer cosa existente | ME | M1 | XS | mixto | [§Gestion de contexto] |
| HU-1B.014 | Ver burbuja "..." sugiriendo contexto relacional oculto | MN | S | S | mixto | [§Gestion de contexto] |
| HU-1B.015 | Ocultar cosa del OPD actual sin borrarla del modelo (reverse) | ME | M1 | M | mixto | [§Gestion de contexto] |
| HU-1B.016 | No producir cambio si ninguna familia coincide con enlaces existentes | ME | M1 | XS | mixto | [§Gestion de contexto] |

Total: **16 historias de usuario** (16 mixto).

## Historias de usuario

### HU-1B.001 — Activar Bring Connected Elements desde toolbar contextual

**Actor primario:** ME (modelador experto).
**Actores secundarios:** MN (lo descubre por presencia visible).
**Tipo:** mixto.
**Nivel categorico:** U primario.
**Superficie UI:** toolbar-contextual (secondary toolbar) + seleccion activa.
**Gesto canonico:** clic en boton `Bring Connected Elements` con una cosa seleccionada.

**Historia:**
> Como modelador, quiero activar `Bring Connected Elements` desde la toolbar contextual para traer al OPD actual cosas conectadas a la seleccionada que esten ocultas en este diagrama.

**Contexto de negocio:**
La toolbar contextual es la ruta **detallada** (con picker de familias). Es el camino recomendado cuando se quiere control fino sobre que familias de enlace traer. Convive con la variante halo (HU-1B.005) que es la ruta rapida. Ambas afordances conviven por diseno (§7.2).

**Criterios de aceptacion:**
- **Dado** que tengo una cosa seleccionada en el OPD actual, **cuando** abro la toolbar contextual, **entonces** aparece el boton `Bring Connected Elements` habilitado.
- **Dado** que no tengo nada seleccionado, **cuando** miro la toolbar contextual, **entonces** el boton `Bring Connected Elements` no esta habilitado (o no aparece).
- **Dado** que tengo una cosa seleccionada, **cuando** hago clic en `Bring Connected Elements`, **entonces** se abre el dialogo flotante de seleccion de familias de enlace (HU-1B.002).
- **Dado** que la cosa seleccionada no tiene conexiones en el modelo logico, **cuando** hago clic en el boton, **entonces** el dialogo igual se abre, pero la confirmacion posterior no producira cambios (ver HU-1B.016).

**Reglas y restricciones:**
- Requiere exactamente una cosa seleccionada; con seleccion multiple se ofrece en su lugar `Bring Links Between Selected Entities` (HU-1B.008).
- La toolbar contextual es la ruta con picker obligatorio; nunca ejecuta sin pasar por el dialogo.

**Modelo de datos tocado:**
- Ninguno en este paso (solo apertura de UI).

**Dependencias:**
- Bloqueada por: HU-10.001/002 (existencia de cosas seleccionables).
- Bloquea a: HU-1B.002, HU-1B.003.

**Integraciones:**
- Dialogo flotante `Bring` (modal UI).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Gestion de contexto] — bring como operador derivado de contexto.
- Fuente OPCloud: `opcloud-reverse/1b-canvas-operaciones-bring.md` §2, §3.1.
- Frames: 41/frame_00005.
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, ui, toolbar-contextual, bring, apariencia].

---

### HU-1B.002 — Elegir familias de enlace en dialogo Bring

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** U primario; V (preview filtrado) secundario.
**Superficie UI:** modal flotante `Bring` con cuatro checkboxes de familias.
**Gesto canonico:** marcar/desmarcar checkboxes + clic en `Bring`.

**Historia:**
> Como modelador, quiero elegir que familias de enlace considerar en el bring (procedural habilitadores, procedural transformadores, estructural fundamental, estructural etiquetada) para traer solo el contexto que me interesa.

**Contexto de negocio:**
La taxonomia de cuatro familias corresponde al esquema de clasificacion OPM de relaciones. Permitir filtrar por familia evita inundar el OPD con contexto no relevante para la tarea actual del modelador. Es la diferencia entre "traer el contexto procedural completo" y "traer solo la estructura compositiva".

**Criterios de aceptacion:**
- **Dado** que el dialogo `Bring` esta abierto, **cuando** miro las opciones, **entonces** veo cuatro checkboxes: `Procedural Enabling Links`, `Procedural Transforming Links`, `Fundamental Structural Links`, `Tagged Structural Links`.
- **Dado** que el dialogo recien se abre, **cuando** miro los checkboxes, **entonces** reflejan el default configurado en settings (ver HU-1B.006), o todas marcadas si no hay default.
- **Dado** que marco/desmarco una familia, **cuando** confirmo con `Bring`, **entonces** la operacion considera unicamente las familias marcadas.
- **Dado** que desmarco todas las familias, **cuando** presiono `Bring`, **entonces** no se traen elementos (ver HU-1B.016).
- **Dado** que cancelo (clic fuera o boton cerrar), **cuando** el modal se cierra, **entonces** no se ejecuta ninguna operacion.

**Reglas y restricciones:**
- Las familias son cuatro y fijas, derivadas de la taxonomia OPM: enabling/transforming (procedurales) y fundamental/tagged (estructurales).
- El cambio dentro del dialogo NO persiste como default del usuario; el default vive en settings (HU-1B.006).
- La etiqueta de cada familia es la literal OPM-EN (termino canonico).

**Modelo de datos tocado:**
- `bring_context.families_selected` — `string[]` — transitorio (solo durante el dialogo).

**Dependencias:**
- Bloqueada por: HU-1B.001.
- Bloquea a: HU-1B.003.

**Integraciones:**
- Lente del kernel para enumerar enlaces existentes por familia.
- Settings del usuario (lee default — HU-1B.006).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Gestion de contexto] — filtrado de enlaces como operacion derivada de contexto.
- Fuente OPCloud: §3.1, §5.1.
- Frames: 41/frame_00005.
- Clase de afirmacion: observado.

**Prioridad:** M1.
**Tamano:** M.
**Etiquetas:** [canvas, ui, modal, bring, picker, familias-enlace].

---

### HU-1B.003 — Materializar cosas conectadas directamente al OPD actual

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** K (crea apariencias) primario; V (render) y L (vista) secundarios.
**Superficie UI:** canvas-opd.
**Gesto canonico:** confirmacion en dialogo `Bring`.

**Historia:**
> Como modelador, quiero que al confirmar el bring se materialicen en el OPD actual las cosas directamente conectadas (segun familias elegidas) para completar el contexto visible sin saltar entre diagramas.

**Contexto de negocio:**
Este es el **outcome central** de la epica: la cosa que antes estaba conectada en el modelo pero invisible aqui, aparece renderizada en este OPD. La operacion es sobre la **capa de apariencias**, no crea nuevas entidades. El modelo logico queda intacto; solo cambia la proyeccion visual del OPD corriente.

**Criterios de aceptacion:**
- **Dado** que confirme el bring con familias marcadas, **cuando** se ejecuta, **entonces** por cada enlace existente en el modelo logico que cumpla el filtro y cuyo otro extremo no este visible, se crea una apariencia de ese extremo en este OPD.
- **Dado** que se materializa una cosa, **cuando** queda renderizada, **entonces** respeta sus atributos del modelo logico (tipo, nombre, esencia, afiliacion, estados, estereotipo).
- **Dado** que se materializa una cosa, **cuando** inspecciono sus datos, **entonces** comparte la misma identidad logica que su apariencia en otros OPDs (mismo `cosa.id`).
- **Dado** que se materializan varias cosas en una sola operacion, **cuando** se renderizan, **entonces** se aplica layout algoritmico para ubicarlas sin superposicion (ver HU-1B.011).
- **Dado** que el extremo conectado ya esta visible en el OPD, **cuando** se ejecuta el bring, **entonces** no se duplica (ver HU-1B.010) pero el enlace si se renderiza si no estaba.

**Reglas y restricciones:**
- La operacion afecta la **capa de apariencias** (`visible_things_in_opd`, `visible_links_in_opd` — §6.2), no el modelo logico.
- Se materializan las dos puntas del enlace visibles: el extremo ya seleccionado (que sirvio de ancla) queda donde esta; el otro extremo aparece nuevo.
- Si el otro extremo esta presente pero el enlace no, se renderiza solo el enlace (sin crear nueva apariencia de cosa).
- Orden de operaciones: primero apariencias de cosas, luego apariencias de enlaces, luego layout.

**Modelo de datos tocado:**
- `opd.visible_things` — `thing_id[]` — persistente (apariencia en el OPD).
- `opd.visible_links` — `link_id[]` — persistente.
- `appearance.thing_id` — referencia al modelo logico — persistente.
- `appearance.position` — `{x, y}` — persistente (asignado por layout).

**Dependencias:**
- Bloqueada por: HU-1B.002.
- Bloquea a: HU-1B.011, HU-1B.012.
- Relaciona: HU-1B.004 (criterio de directamente-conectado), HU-1B.010 (idempotencia).

**Integraciones:**
- Kernel: lectura de grafo logico para encontrar vecinos directos.
- Renderer: creacion de shapes para apariencias nuevas.
- Layout (`src/render/layout/`): posicionamiento de nuevas cosas.
- Persistencia: guardado de apariencias en IndexedDB.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Gestion de contexto] — materializacion como operador derivado de contexto.
- Fuente OPCloud: §3.1 paso 6, §6.2.
- Frames: 41/frame_00008, 41/frame_00014, 41/frame_00023.
- Transcripcion: "materializa en el OPD actual las cosas directamente conectadas que cumplan ese filtro".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** M1.
**Tamano:** M.
**Etiquetas:** [canvas, kernel, bring, apariencia, lente, materializacion].

---

### HU-1B.004 — Respetar conectividad directa sin propagar por jerarquia

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** K primario (regla semantica).
**Superficie UI:** ninguna directa (regla de motor).
**Gesto canonico:** ninguno (invariante del algoritmo).

**Historia:**
> Como modelador, quiero que `Bring Connected Elements` traiga solo conexiones directas del modelo logico para no inundar el OPD con cosas relacionadas transitiva o jerarquicamente.

**Contexto de negocio:**
La transcripcion del doc fuente es enfatica: bring opera sobre **conectividad directa**, no sobre propagacion semantica. Si una cosa A esta conectada a un padre P, y P contiene subprocesos Q y R, bring desde A NO trae Q ni R aunque compartan contenedor logico. Esto protege la legibilidad del OPD.

**Criterios de aceptacion:**
- **Dado** que A y B estan conectados por un enlace directo y A es la cosa seleccionada, **cuando** ejecuto bring con la familia correspondiente, **entonces** B se materializa.
- **Dado** que A esta conectada a un padre P via agregacion, y P tiene hijos Q y R sin enlace directo con A, **cuando** ejecuto bring desde A, **entonces** Q y R NO se materializan (aunque si P, si la familia fundamental esta marcada).
- **Dado** que A esta conectada a B y B esta conectada a C, **cuando** ejecuto bring desde A, **entonces** solo B se materializa (C esta a distancia 2).
- **Dado** que A es una especializacion de una clase S, **cuando** ejecuto bring desde A, **entonces** no se materializan los hermanos de especializacion de S.

**Reglas y restricciones:**
- Regla: distancia 1 en el grafo de enlaces logicos. Punto.
- La propagacion recursiva es explicitamente **fuera de alcance** de esta operacion.
- Si el modelador quiere ir a distancia 2, debe ejecutar bring de nuevo sobre una de las cosas traidas (es iterativo, no transitivo automatico).

**Modelo de datos tocado:**
- Ninguno directo; es un invariante del algoritmo de resolucion de vecinos.

**Dependencias:**
- Bloqueada por: HU-1B.003.
- Relaciona: futura HU en EPICA-1B o derivada si alguien pide "bring-transitive".

**Integraciones:**
- Kernel: funcion de enumeracion de vecinos directos (`getDirectNeighbors(cosaId, linkFamilies)`).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Gestion de contexto] — conectividad directa como propiedad del operador derivado.
- Fuente OPCloud: §3.4.
- Transcripcion: "si una cosa esta conectada a un padre... `Bring Connected Elements` no trae esas relaciones heredadas. Opera sobre conectividad directa del modelo, no sobre propagacion semantica".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, kernel, bring, validacion, conectividad-directa].

---

### HU-1B.005 — Activar Bring Connected Elements desde halo con default

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** U primario; K (ejecuta bring) secundario.
**Superficie UI:** halo radial (pie menu) + accion `bring-connected`.
**Gesto canonico:** clic en icono `bring-connected` del halo.

**Historia:**
> Como modelador, quiero ejecutar `Bring Connected Elements` desde el halo para hidratar el OPD con un gesto rapido usando mis familias por defecto, sin abrir el dialogo.

**Contexto de negocio:**
El halo es la ruta **rapida**; se salta el dialogo y usa directamente el default configurado en settings (HU-1B.006). Esta dualidad halo-rapido / toolbar-detallado es la politica consistente de OPCloud (§7.2): mismo outcome, distinta cadencia.

**Criterios de aceptacion:**
- **Dado** que tengo una cosa seleccionada y el halo visible, **cuando** miro las acciones, **entonces** veo el icono `bring-connected`.
- **Dado** que hago clic en el icono de halo, **cuando** se ejecuta, **entonces** NO se abre dialogo: la operacion corre inmediata con las familias configuradas por default.
- **Dado** que no hay default configurado (settings vacias), **cuando** ejecuto desde halo, **entonces** se usan todas las familias marcadas (fallback), o se abre el dialogo como fallback (decision del repo — ver pregunta abierta Q1B.1).
- **Dado** que el bring desde halo ejecuta y materializa cosas, **cuando** termina, **entonces** el resultado es visualmente indistinguible del bring via toolbar (HU-1B.003).

**Reglas y restricciones:**
- La accion `bring-connected` vive en el pie menu radial descrito en HU-10.020.
- No hay confirmacion adicional: el halo confia en el default del usuario.
- El halo de OPM/ISO 19450 es una afordance de proximidad (vive junto a la seleccion).

**Modelo de datos tocado:**
- Ninguno directo adicional sobre HU-1B.003.

**Dependencias:**
- Bloqueada por: HU-10.019, HU-10.020 (pie menu existe).
- Bloqueada por: HU-1B.006 (idealmente hay default).
- Bloqueada por: HU-1B.003 (motor de materializacion).

**Integraciones:**
- Settings del usuario (lee default).
- Motor de bring (comparte con HU-1B.003).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Gestion de contexto] — halo como afordance del operador derivado.
- Fuente OPCloud: §3.2, §7.2.
- Transcripcion: "esta variante no pide categorias: usa el default configurado en settings".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, ui, halo, pie-menu, bring, default, atajo].

---

### HU-1B.006 — Configurar default de Bring Connected Things en settings

**Actor primario:** ME.
**Actores secundarios:** AO (admin organizacion, si el default es de organizacion — ver pregunta abierta).
**Tipo:** mixto.
**Nivel categorico:** C primario (configuracion).
**Superficie UI:** panel-settings.
**Gesto canonico:** marcar/desmarcar checkboxes en settings + guardar.

**Historia:**
> Como modelador, quiero configurar que familias de enlace se usan por defecto en el bring rapido del halo para que mi flujo habitual funcione con un solo clic.

**Contexto de negocio:**
El default configurable convierte el bring del halo en una afordance verdaderamente rapida. Sin default, el halo equivaldria a la toolbar. Con default, se vuelve un atajo significativo para el flujo individual del modelador.

**Criterios de aceptacion:**
- **Dado** que entro a settings, **cuando** navego la configuracion, **entonces** encuentro la seccion `Default For Bring Connected Things`.
- **Dado** que estoy en esa seccion, **cuando** miro los controles, **entonces** veo las mismas cuatro familias (enabling, transforming, fundamental, tagged) como checkboxes.
- **Dado** que marco una o mas familias y guardo, **cuando** uso el bring desde halo despues, **entonces** se aplican exactamente esas familias.
- **Dado** que marco en el dialogo de toolbar familias distintas del default, **cuando** confirmo el bring puntual, **entonces** se aplica el override puntual sin modificar el default.
- **Dado** que no tengo default configurado, **cuando** entro por primera vez a settings, **entonces** el estado inicial es **pregunta abierta** (Q1B.1): ¿todas marcadas, ninguna, o las dos procedurales?

**Reglas y restricciones:**
- El dialogo de toolbar no modifica el default; solo la seccion settings lo hace.
- Alcance del default (usuario, organizacion, modelo) es **pregunta abierta Q1B.1** (§11.1 fuente).

**Modelo de datos tocado:**
- `user_settings.bring_default_families` — `string[]` — persistente.
- (Pregunta abierta: si va tambien a `organization_settings` u `opm_model`.)

**Dependencias:**
- Relaciona: HU-1B.005.
- Relaciona: EPICA-80 (config-user-org).

**Integraciones:**
- Persistencia del usuario; lectura por halo y dialogo.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Gestion de contexto] — configuracion del operador derivado.
- Fuente OPCloud: §2, §3.3, §11.1.
- Frames: 41/frame_00019.
- Clase de afirmacion: observado + pregunta abierta sobre alcance.
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, config, settings, bring, default, requires-clarification].

---

### HU-1B.007 — Seleccionar multiples cosas con Ctrl para habilitar bring-links

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** U primario.
**Superficie UI:** canvas-opd.
**Gesto canonico:** `Ctrl+clic` sobre cosas secuencialmente.

**Historia:**
> Como modelador, quiero seleccionar varias cosas manteniendo Ctrl para habilitar operaciones sobre la seleccion multiple, incluida `Bring Links Between Selected Entities`.

**Contexto de negocio:**
La multiseleccion es precondicion de `bring-links`: la operacion necesita un conjunto ≥2 de cosas visibles para calcular enlaces entre ellas. El gesto `Ctrl+clic` es el estandar universal de multi-seleccion y se hereda sin modificacion.

**Criterios de aceptacion:**
- **Dado** que hago clic en una cosa A, **cuando** hago `Ctrl+clic` en otra cosa B, **entonces** ambas quedan seleccionadas (conjunto `{A, B}`).
- **Dado** que tengo seleccion multiple, **cuando** sigo con mas `Ctrl+clic`, **entonces** el conjunto crece.
- **Dado** que tengo seleccion multiple, **cuando** hago `Ctrl+clic` en una cosa ya seleccionada, **entonces** se deselecciona de la seleccion (toggle).
- **Dado** que tengo seleccion multiple, **cuando** hago clic simple en canvas vacio, **entonces** se limpia la seleccion.
- **Dado** que tengo seleccion multiple de ≥2 cosas, **cuando** miro la toolbar contextual, **entonces** aparece `Bring Links Between Selected Entities` (HU-1B.008).

**Reglas y restricciones:**
- `Ctrl+clic` es el shortcut canonico (ver EPICA-90).
- La multi-seleccion es un estado de UI, no persistente entre sesiones.
- Funciona con cualquier cosa visible en el OPD (process, object, state, etc.).

**Modelo de datos tocado:**
- `ui_state.selected_things` — `thing_id[]` — transitorio (solo sesion UI).

**Dependencias:**
- Relaciona: EPICA-90 (shortcuts).

**Integraciones:**
- Renderer: highlight visual de cada cosa seleccionada.
- Toolbar contextual: detecta que la seleccion es ≥2 para mostrar `Bring Links Between Selected Entities`.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Gestion de contexto] — multiseleccion como precondicion del operador de contexto.
- Fuente OPCloud: §3.5, §8.
- Frames: 46/frame_00010.
- Transcripcion: "el usuario selecciona varias cosas manteniendo `Ctrl`".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, ui, seleccion, multi-select, ctrl, shortcut].

---

### HU-1B.008 — Activar Bring Links Between Selected Entities desde toolbar

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** U primario.
**Superficie UI:** toolbar-contextual (secondary toolbar).
**Gesto canonico:** clic en boton `Bring links between selected entities` con ≥2 cosas seleccionadas.

**Historia:**
> Como modelador, quiero activar `Bring Links Between Selected Entities` desde la toolbar contextual para traer los enlaces existentes entre las cosas que ya tengo seleccionadas.

**Contexto de negocio:**
Esta operacion es la variante de bring **restringida al subgrafo de la seleccion**. No trae contexto externo; solo renderiza los enlaces ya existentes en el modelo logico entre las cosas seleccionadas. Util cuando el modelador ya posiciono las cosas en el OPD nuevo y quiere recuperar sus relaciones del otro OPD.

**Criterios de aceptacion:**
- **Dado** que tengo ≥2 cosas seleccionadas, **cuando** miro la toolbar contextual, **entonces** el boton `Bring links between selected entities` esta visible y habilitado.
- **Dado** que tengo una sola cosa seleccionada (o ninguna), **cuando** miro la toolbar, **entonces** ese boton NO esta habilitado (en su lugar aparece el otro `Bring Connected Elements`).
- **Dado** que tengo ≥2 cosas seleccionadas, **cuando** hago clic en el boton, **entonces** se ejecuta la operacion (HU-1B.009) sin dialogo intermedio.
- **Dado** que la seleccion no tiene enlaces entre sus miembros en el modelo, **cuando** ejecuto el boton, **entonces** no cambia nada en el canvas (ver HU-1B.016).

**Reglas y restricciones:**
- No hay picker de familias: trae **todos** los enlaces relevantes entre las cosas seleccionadas.
- La operacion no se abre en halo para multi-seleccion (observacion: halo es por una cosa, no por conjunto).

**Modelo de datos tocado:**
- Ninguno en este paso (solo trigger).

**Dependencias:**
- Bloqueada por: HU-1B.007 (multi-select habilita la operacion).
- Bloquea a: HU-1B.009.

**Integraciones:**
- Toolbar contextual lee estado de seleccion.
- Motor de bring-links.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Gestion de contexto] — bring-links como operador derivado entre seleccion multiple.
- Fuente OPCloud: §3.5, §2 tabla.
- Frames: 46/frame_00011.
- Clase de afirmacion: observado.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, ui, toolbar-contextual, bring-links].

---

### HU-1B.009 — Traer unicamente enlaces internos a la seleccion multiple

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** K primario (crea apariencias de enlace); V (render).
**Superficie UI:** canvas-opd.
**Gesto canonico:** resultado automatico de HU-1B.008.

**Historia:**
> Como modelador, quiero que `Bring Links Between Selected Entities` traiga solo los enlaces que conectan pares de cosas dentro de mi seleccion, no las que salen hacia cosas no seleccionadas.

**Contexto de negocio:**
El subgrafo inducido es el criterio exacto: para todo par `(A, B)` en la seleccion, si existe un enlace logico entre A y B en el modelo y no esta visible en este OPD, se renderiza. Enlaces de A hacia cosas fuera de la seleccion NO se traen — eso es trabajo de `Bring Connected Elements` (HU-1B.003).

**Criterios de aceptacion:**
- **Dado** que tengo seleccionadas tres cosas `{A, B, C}`, **cuando** ejecuto bring-links, **entonces** se traen los enlaces `A-B`, `A-C`, `B-C` existentes en el modelo que aun no esten renderizados.
- **Dado** que existe un enlace A-D donde D NO esta en la seleccion, **cuando** ejecuto bring-links, **entonces** ese enlace NO se trae (ni se trae D).
- **Dado** que entre A y B existen **varios** enlaces en el modelo (p.ej. fundamental + procedural), **cuando** ejecuto bring-links, **entonces** se materializan todos los que corresponda (§3.5 fuente: "un enlace fundamental y un enlace procedural").
- **Dado** que un enlace ya esta visible en el OPD entre dos cosas seleccionadas, **cuando** ejecuto bring-links, **entonces** no se duplica.
- **Dado** que la seleccion es identica a cosas ya visibles y todos los enlaces entre ellas ya estan visibles, **cuando** ejecuto bring-links, **entonces** el canvas no cambia (no-op — HU-1B.016).

**Reglas y restricciones:**
- Criterio exacto: **enlaces del modelo cuyos dos extremos pertenecen a la seleccion actual** y que **aun no tienen apariencia visible** en este OPD.
- No hay filtrado por familia (toma todos los tipos).
- La operacion sobre enlaces es analoga a la de cosas en HU-1B.003: crea apariencias, no entidades.

**Modelo de datos tocado:**
- `opd.visible_links` — `link_id[]` — persistente (crece con los enlaces traidos).
- `appearance.link_id` — referencia — persistente.

**Dependencias:**
- Bloqueada por: HU-1B.008.
- Bloqueada por: HU-1B.003 (comparte motor de apariencias).
- Bloquea a: HU-1B.011 (ruteo).

**Integraciones:**
- Kernel: funcion `getLinksInSubgraph(thingIds[])`.
- Renderer: creacion de apariencias de enlace.
- Layout: ruteo de los nuevos enlaces.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Gestion de contexto] — subgrafo inducido como operador derivado.
- Fuente OPCloud: §3.5.
- Frames: 46/frame_00014.
- Transcripcion: "trae todas las relaciones relevantes entre ese conjunto seleccionado. No trae cualquier cosa conectada al resto del modelo".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** M.
**Etiquetas:** [canvas, kernel, bring-links, apariencia, subgrafo].

---

### HU-1B.010 — Evitar duplicar apariencia si la cosa ya esta visible en el OPD

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** K primario (invariante).
**Superficie UI:** canvas-opd (consecuencia observable).
**Gesto canonico:** ninguno directo (garantia de idempotencia).

**Historia:**
> Como modelador, quiero que el bring NO duplique una apariencia si la cosa o el enlace ya esta visible en el OPD actual para preservar el principio "una entidad, una apariencia por OPD".

**Contexto de negocio:**
El principio del modelo es "entidad unica, apariencias multiples **entre OPDs**" — dentro del **mismo** OPD, cada entidad tiene a lo mas una apariencia. Es una invariante del kernel de apariencias. Sin esta invariante, el canvas podria llenarse de duplicados por ejecuciones sucesivas de bring.

**Criterios de aceptacion:**
- **Dado** que A ya tiene apariencia en el OPD actual, **cuando** ejecuto bring desde B y A es vecino directo, **entonces** A NO se duplica; el enlace B-A si se renderiza si no estaba.
- **Dado** que ejecuto bring dos veces consecutivas con los mismos parametros, **cuando** se completa la segunda, **entonces** no hay diferencia visible: la operacion es idempotente.
- **Dado** que el enlace A-B ya esta renderizado, **cuando** ejecuto bring-links con ambos en la seleccion, **entonces** el enlace NO se duplica.
- **Dado** que hubo un intento de duplicar por un bug, **cuando** se detecta, **entonces** el motor rechaza la creacion sin error visible al usuario (invariante se preserva silenciosamente).

**Reglas y restricciones:**
- Invariante: `∀ opd ∈ model, ∀ entity ∈ logical_model: |appearances(entity, opd)| ≤ 1`.
- El motor de bring consulta la tabla de apariencias antes de crear cada una.
- La idempotencia vale para cosas y para enlaces por igual.

**Modelo de datos tocado:**
- Consulta a `opd.visible_things` y `opd.visible_links`; no altera en caso de duplicado potencial.

**Dependencias:**
- Bloqueada por: HU-1B.003, HU-1B.009.

**Integraciones:**
- Kernel de apariencias.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Gestion de contexto] — idempotencia como invariante del operador derivado.
- Fuente OPCloud: §4.2, §6.
- Transcripcion: "La operacion trae apariencias o relaciones visibles al OPD. No crea una cosa nueva del modelo".
- Clase de afirmacion: confirmado por transcripcion (por contraposicion explicita).

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [canvas, kernel, bring, idempotencia, apariencia, invariante].

---

### HU-1B.011 — Recalcular ruteo y posicion de las cosas traidas

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** V primario; L (layout).
**Superficie UI:** canvas-opd.
**Gesto canonico:** ninguno directo (secuela automatica del bring).

**Historia:**
> Como modelador, quiero que las cosas y enlaces traidos se ubiquen con posicion y ruteo calculados algoritmicamente para que el OPD resultante sea legible sin trabajo manual posterior.

**Contexto de negocio:**
El bring no copia la geometria del OPD origen: recalcula posicion y ruteo en el OPD destino. Esto alinea con el principio del repo: el layout es **siempre algoritmico**, nunca hardcodeado en fixtures. El resultado es un OPD con ruteo limpio, no el ruteo historico de otro OPD.

**Criterios de aceptacion:**
- **Dado** que se materializan cosas nuevas via bring, **cuando** se renderizan, **entonces** sus posiciones las asigna el motor de layout (`src/render/layout/`) respetando las cosas ya visibles.
- **Dado** que se materializan enlaces nuevos, **cuando** se renderizan, **entonces** su ruteo es calculado (no copiado de otro OPD).
- **Dado** que hay apariencias previas en el OPD, **cuando** se ejecuta el bring, **entonces** las apariencias **previas no se reubican** (solo las traidas ocupan posiciones nuevas).
- **Dado** que el layout produce superposiciones, **cuando** se renderiza, **entonces** el motor las resuelve con desplazamiento — no se permite render con colision visible.

**Reglas y restricciones:**
- No hay coordenadas hardcodeadas en las apariencias traidas (invariante del repo).
- El layout respeta las reglas OPM ya codificadas (zonas interno/externo, rankdir, afiliacion ambiental, etc. — ver `reference_layout_algoritmico`).
- El ruteo de enlaces traidos usa el mismo algoritmo que los enlaces creados en el OPD actual.

**Modelo de datos tocado:**
- `appearance.position` — `{x, y}` — persistente (calculado, no heredado).
- `appearance.vertices` — `{x, y}[]` — persistente para enlaces (ruteo).

**Dependencias:**
- Bloqueada por: HU-1B.003, HU-1B.009.

**Integraciones:**
- Motor de layout (`src/render/layout/`) con sus 9 passes.
- Renderer JointJS.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Gestion de contexto] — layout y ruteo como aspectos del operador derivado.
- Fuente OPCloud: §4.3, §9.
- Transcripcion: "OPCloud no solo enciende el enlace escondido: tambien le asigna ruteo, puertos y posicion de simbolos en el canvas actual".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** M1.
**Tamano:** M.
**Etiquetas:** [canvas, layout, bring, ruteo, algoritmico].

---

### HU-1B.012 — Persistir apariencia creada en la sesion del OPD

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** P (persistencia) primario.
**Superficie UI:** ninguna directa.
**Gesto canonico:** ninguno directo (secuela automatica del bring + autosave/save).

**Historia:**
> Como modelador, quiero que las apariencias creadas por bring queden persistidas junto al OPD para que al recargar el modelo siga mostrandolas sin tener que volver a ejecutar bring.

**Contexto de negocio:**
La apariencia es parte del estado persistente del OPD. Sin persistencia, bring seria ornamental. El bring materializa apariencias; esas apariencias deben sobrevivir al ciclo de save/load igual que las apariencias creadas por arrastre directo.

**Criterios de aceptacion:**
- **Dado** que ejecute bring y hay nuevas apariencias visibles, **cuando** guardo el modelo, **entonces** la lista de apariencias del OPD incluye las nuevas.
- **Dado** que guarde y recargo, **cuando** abro el OPD donde ejecute bring, **entonces** las cosas traidas siguen visibles con su posicion y ruteo.
- **Dado** que hice bring y no guarde explicitamente, **cuando** depende de la politica de autosave del repo, **entonces** la apariencia igualmente se persiste en IndexedDB (coherente con persistencia de capa 1 del modelador).
- **Dado** que una cosa traida se renombra en otro OPD, **cuando** abro el OPD con la apariencia traida, **entonces** el nombre mostrado es el actualizado (la apariencia no replica datos, solo referencia).

**Reglas y restricciones:**
- La apariencia almacena `thing_id` (referencia) y datos de presentacion (`position`, `vertices`), nunca copia datos logicos.
- Integracion con capa de persistencia IndexedDB del repo (ver `project_mvp_editable`).
- Reverse equivalente: HU-1B.015 ocultar cosa del OPD sin borrar del modelo.

**Modelo de datos tocado:**
- `opd.appearances` — tabla de apariencias — persistente (IndexedDB).

**Dependencias:**
- Bloqueada por: HU-1B.003.
- Relaciona: EPICA-30 (save/load), persistencia de capa 1 ya implementada.

**Integraciones:**
- `src/persistencia/` — sesion IndexedDB, workspace.
- Save/Load (EPICA-30).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Gestion de contexto] — persistencia de apariencias del operador derivado.
- Fuente OPCloud: §6.2 (implicito: `visible_things_in_opd` y `visible_links_in_opd` como capa persistente).
- Clase de afirmacion: inferido (la transcripcion no lo dice explicito pero es invariante del modelo implicito).

**Prioridad:** M1.
**Tamano:** M.
**Etiquetas:** [canvas, persistencia, apariencia, bring, indexeddb].

---

### HU-1B.013 — No generar oraciones OPL-ES nuevas al traer cosa existente

**Actor primario:** ME.
**Actores secundarios:** RV (lector de OPL-ES).
**Tipo:** mixto.
**Nivel categorico:** L (lente OPL-ES) primario.
**Superficie UI:** panel OPL-ES.
**Gesto canonico:** ninguno directo (consecuencia observable).

**Historia:**
> Como modelador, quiero que el panel OPL-ES NO emita oraciones nuevas para cosas o enlaces que ya existian en el modelo logico y solo se materializaron visualmente para preservar la verdad del OPL-ES como eco del modelo, no del render.

**Contexto de negocio:**
El OPL-ES es traduccion natural del **modelo logico**, no del **render por OPD**. Si una cosa y sus enlaces ya existen en el modelo, su OPL-ES ya se emitio cuando se creo; traerlas a un OPD adicional no re-emite oraciones. Este es el principio de unicidad semantica del OPL-ES.

**Criterios de aceptacion:**
- **Dado** que ejecuto bring y materializo cosa A y enlace A-B, **cuando** consulto el panel OPL-ES, **entonces** NO aparecen oraciones nuevas para A ni para A-B (ya estaban desde antes en otro OPD).
- **Dado** que el panel OPL-ES se filtra por OPD (si aplica, ver EPICA-50), **cuando** visualizo el OPL-ES del OPD actual tras bring, **entonces** A si aparece en la vista filtrada del OPD actual, pero como **presentacion**, no como nueva emision.
- **Dado** que se elimina la apariencia traida (hide — HU-1B.015), **cuando** consulto OPL-ES, **entonces** la oracion original NO desaparece (sigue viva porque la entidad sigue en el modelo).
- **Dado** que bring no crea entidades, **cuando** comparo OPL-ES antes/despues del bring, **entonces** el contenido global del OPL-ES es identico.

**Reglas y restricciones:**
- Invariante: OPL-ES ⟂ OPD (el OPL-ES no depende del OPD activo salvo filtros de presentacion).
- El OPL-ES emite por entidad/enlace logico, no por apariencia.
- Esta HU es esencialmente una **HU de no-comportamiento**: valida que bring NO tenga efectos OPL-ES indebidos.

**Modelo de datos tocado:**
- Ninguno (verificacion de invariante).

**Dependencias:**
- Bloqueada por: HU-1B.003, HU-10.016.
- Relaciona: EPICA-50 (panel OPL-ES).

**Integraciones:**
- Motor OPL-ES (`src/render/opl-renderer.ts`).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Gestion de contexto] — OPL-ES invariante ante operador derivado; `opm-opl-es.md` para uso de plantillas.
- Fuente OPCloud: §4.2 (por inferencia del principio "no crea cosa nueva del modelo").
- Clase de afirmacion: inferido (invariante logico; no hay evidencia directa en el doc fuente).

**Prioridad:** M1.
**Tamano:** XS.
**Etiquetas:** [canvas, opl-es, lente, bring, no-efecto, invariante].

---

### HU-1B.014 — Ver burbuja "..." sugiriendo contexto relacional oculto

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** mixto.
**Nivel categorico:** U primario; V (render) secundario.
**Superficie UI:** canvas-opd — pista visual pequena junto a la cosa.
**Gesto canonico:** ninguno (presencia declarativa).

**Historia:**
> Como modelador novato, quiero ver una burbuja `...` junto a las cosas que tienen relaciones no renderizadas en este OPD para saber que hay mas contexto disponible sin tener que ejecutar bring a ciegas.

**Contexto de negocio:**
La burbuja `...` es una afordance de descubrimiento: senala pasivamente que la cosa tiene vecinos ocultos. Convierte bring en una operacion **invitada** en lugar de ciega. Es especialmente valiosa para modeladores novatos que no conocen la estructura completa del modelo.

**Criterios de aceptacion:**
- **Dado** que una cosa visible tiene ≥1 enlace logico cuyo extremo opuesto no esta visible en este OPD, **cuando** se renderiza, **entonces** aparece una pequena burbuja `...` junto a ella.
- **Dado** que una cosa visible tiene **todos** sus enlaces y vecinos visibles en este OPD, **cuando** se renderiza, **entonces** no aparece burbuja.
- **Dado** que ejecuto bring y materializo vecinos, **cuando** ya no hay vecinos ocultos, **entonces** la burbuja desaparece en vivo.
- **Dado** que hago hover o clic en la burbuja, **cuando** ocurre el gesto, **entonces** **pregunta abierta** (Q1B.2): ¿abre el dialogo de bring directo? ¿muestra tooltip con el conteo de ocultos? No observado con claridad.

**Reglas y restricciones:**
- Es una **pista pasiva**, no un control de accion primaria.
- La interactividad de la burbuja (clickeable o solo visual) es **pregunta abierta**.
- Si la burbuja se considera UI de edicion (§11.3 fuente), ¿se exporta o se elimina en export PDF/SVG? pregunta abierta Q1B.3.

**Modelo de datos tocado:**
- Ninguno (derivado por lente).

**Dependencias:**
- Bloqueada por: estructura de apariencias y grafo logico (HU-1B.003).

**Integraciones:**
- Lente: calculo de vecinos ocultos por cosa.
- Renderer: badge pequeno adjacente al shape.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Gestion de contexto] — pista pasiva como afordance del operador derivado.
- Fuente OPCloud: §2, §9.
- Transcripcion: "la burbuja `...` funciona como pista de que hay relacion oculta disponible para traer".
- Preguntas abiertas: §11.2, §11.3.
- Clase de afirmacion: observado + abierto (comportamiento exacto al interactuar).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, ui, affordance, burbuja, hint, requires-clarification].

---

### HU-1B.015 — Ocultar cosa del OPD actual sin borrarla del modelo (reverse)

**Actor primario:** ME.
**Actores secundarios:** RV (lector).
**Tipo:** mixto.
**Nivel categorico:** K primario (apariencia); U secundario.
**Superficie UI:** toolbar-contextual o pie-menu + accion `hide` o `remove-from-opd`.
**Gesto canonico:** clic en `hide from this OPD` (nombre exacto por definir).

**Historia:**
> Como modelador, quiero ocultar una cosa del OPD actual sin borrarla del modelo logico para simplificar la vista sin perder la entidad ni sus enlaces en otros OPDs.

**Contexto de negocio:**
Esta HU es el **reverso logico** de bring. Si bring agrega una apariencia, hide la elimina **sin tocar la entidad**. Respeta la separacion modelo/apariencia. Es prerrequisito de un modelo sano: sin hide, una vez materializada una cosa seria imposible volver a tener el OPD limpio salvo eliminandola del modelo completo (destructivo).

Se integra con la HU-10.020 (pie-menu `remove` que abre `Choose Remove Operation` modal con 3 scopes — ver EPICA-1C). El scope "solo en este OPD" es exactamente esta HU.

**Criterios de aceptacion:**
- **Dado** que tengo una cosa A visible en el OPD actual y tambien en al menos otro OPD, **cuando** elijo `remove from this OPD` (o equivalente), **entonces** A desaparece del OPD actual pero sigue en el modelo y en otros OPDs.
- **Dado** que A estaba conectada a B por un enlace visible, **cuando** oculto A, **entonces** el enlace A-B tambien se oculta del OPD actual (no se puede renderizar con un solo extremo).
- **Dado** que A solo aparecia en este OPD, **cuando** intento `remove from this OPD`, **entonces** **pregunta abierta** (Q1B.4): ¿se fuerza a elegir otro scope? ¿se oculta y queda "huerfana" del render? Hipotesis: se delega al flow de `Choose Remove Operation` de EPICA-1C.
- **Dado** que oculte A, **cuando** ejecuto bring desde otra cosa conectada, **entonces** A puede volver a materializarse en este OPD (ciclo reversible).
- **Dado** que oculte A, **cuando** consulto OPL-ES, **entonces** las oraciones de A siguen presentes (la entidad existe).

**Reglas y restricciones:**
- La operacion afecta `opd.visible_things` y `opd.visible_links`, no el modelo logico.
- Es el inverso exacto de HU-1B.003; el par bring/hide define la dinamica reversible de apariencias.
- Se integra con el flow `Choose Remove Operation` de 3 scopes (ver EPICA-1C).

**Modelo de datos tocado:**
- `opd.visible_things` — `thing_id[]` — persistente (se remueve el ID).
- `opd.visible_links` — `link_id[]` — persistente (se remueven los enlaces con un extremo ahora oculto).

**Dependencias:**
- Relaciona: EPICA-1C (validaciones, `Choose Remove Operation`).
- Inversa de: HU-1B.003.
- Bloqueada por: estructura de apariencias.

**Integraciones:**
- Renderer (elimina shape).
- Persistencia (actualiza la lista de apariencias del OPD).
- Panel OPL-ES (no cambia — HU-1B.013).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Gestion de contexto] — hide como inverso del operador derivado bring.
- Fuente OPCloud: §4.2, §6 (inferido como complementario del bring).
- Clase de afirmacion: inferido — el doc fuente de bring no detalla el reverso, pero el modelo implicito lo requiere. Ver tambien `HU-10.020` scope `remove` que delega al modal de 3 scopes.
- Etiqueta: `requires-clarification` (nombre exacto del control y UX).

**Prioridad:** M1.
**Tamano:** M.
**Etiquetas:** [canvas, kernel, apariencia, remove-scope, hide, reverse-bring, requires-clarification].

---

### HU-1B.016 — No producir cambio si ninguna familia coincide con enlaces existentes

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** U primario (feedback).
**Superficie UI:** canvas-opd (no cambio) + posible toast/status (pregunta abierta).
**Gesto canonico:** ninguno directo.

**Historia:**
> Como modelador, quiero saber cuando el bring no produce ningun cambio porque las familias marcadas no coinciden con ningun enlace existente para no quedar con la duda de si fue no-op o error.

**Contexto de negocio:**
El caso "bring sin efecto" es esperable: el modelador marca familias procedurales cuando solo existen fundamentales, o ejecuta bring-links sobre una seleccion sin relaciones entre sus miembros. Sin feedback explicito, el modelador queda con la duda.

**Criterios de aceptacion:**
- **Dado** que ejecuto bring con familias marcadas que no coinciden con ningun enlace existente del vecino, **cuando** se procesa, **entonces** el canvas no cambia.
- **Dado** que ejecuto bring-links sobre una seleccion sin enlaces entre miembros, **cuando** se procesa, **entonces** el canvas no cambia.
- **Dado** que no se produce cambio, **cuando** se completa la operacion, **entonces** **pregunta abierta** (Q1B.5): ¿se muestra un toast `No hidden connections found`? ¿cambio silencioso? No observado con claridad.
- **Dado** que la operacion falla por error tecnico (no por ausencia), **cuando** ocurre, **entonces** SI se muestra un error distinguible del no-op.

**Reglas y restricciones:**
- No-op es el comportamiento esperado en ausencia de candidatos, no un error.
- Distinguir visualmente no-op de error es importante para la UX.
- El feedback exacto (toast vs silencio) queda abierto.

**Modelo de datos tocado:**
- Ninguno (por definicion del caso).

**Dependencias:**
- Bloqueada por: HU-1B.003, HU-1B.009.

**Integraciones:**
- UI de feedback (toast, status bar, o silencio — por definir).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Gestion de contexto] — no-op como comportamiento valido del operador derivado.
- Fuente OPCloud: §4.1.
- Transcripcion: "si se espera una relacion estructural pero solo estan activas familias procedurales, la operacion no produce cambios visibles".
- Clase de afirmacion: observado (no-cambio) + hipotesis (feedback exacto).
- Etiqueta: `requires-clarification`.

**Prioridad:** M1.
**Tamano:** XS.
**Etiquetas:** [canvas, bring, noop, feedback, requires-clarification].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q1B.1** — ¿Donde se guarda el default de `Bring Connected Things`: por usuario, por organizacion o por modelo? (§11.1 fuente). Afecta HU-1B.006 y, potencialmente, integracion con EPICA-80.
- **Q1B.2** — ¿La burbuja `...` es interactiva? Si se clickea, ¿abre dialogo o tooltip? (§11 inferido, no observado directamente). Afecta HU-1B.014.
- **Q1B.3** — ¿La burbuja `...` se exporta en PDF/SVG o se elimina como ayuda de edicion? (§11.3 fuente). Afecta HU-1B.014 y EPICA-60/61.
- **Q1B.4** — ¿Cual es el comportamiento exacto de `hide from this OPD` cuando la cosa solo aparece en ese OPD? (no observado explicitamente). Afecta HU-1B.015; se apoya en EPICA-1C.
- **Q1B.5** — ¿El bring no-op muestra feedback visible (toast) o es silencioso? (observacion abierta derivada de §4.1). Afecta HU-1B.016.
- **Q1B.6** — ¿OPD retiene traza de que una apariencia fue traida y no creada localmente? (§11.2 fuente). Podria originar HU adicional de metadata de apariencia si se decide afirmativamente.

## Referencias cruzadas

- **Doc fuente:** `opcloud-reverse/1b-canvas-operaciones-bring.md`.
- **Epicas de las que depende:**
  - **EPICA-10** (`canvas-creacion-cosas`): precondicion (existencia de cosas y del pie-menu `bring-connected` en HU-10.020).
  - **EPICA-30** (`persistencia-save-load`): persistencia de apariencias.
  - **EPICA-80** (`config-user-org`): ubicacion del default del bring (Q1B.1).
  - **EPICA-90** (`interaccion-shortcuts`): `Ctrl+clic` para multi-seleccion.
- **Epicas con las que se relaciona:**
  - **EPICA-1C** (`canvas-validaciones`): modal `Choose Remove Operation` y scopes — soporte para HU-1B.015.
  - **EPICA-50** (`opl-pane`): invariante OPL-ES no cambia por bring — HU-1B.013.
  - **EPICA-60/61** (`export-pdf/svg`): decision de si la burbuja `...` se exporta — Q1B.3.
  - **EPICA-20** (`estructura-opd-tree`): el bring opera sobre el OPD actual pero la entidad vive en todo el arbol.
- **Invariantes del repo:**
  - `src/nucleo/` — kernel de entidades logicas (intacto por bring).
  - Capa de apariencias (parte de persistencia de capa 1, ver `project_mvp_editable`).
  - `src/render/layout/` — ruteo algoritmico (HU-1B.011).
  - `src/render/opl-renderer.ts` — OPL-ES como traduccion del modelo logico (HU-1B.013).
- **SSOT OPM:** `opm-iso-19450-es.md` para taxonomia de 4 familias de enlaces y [§Gestion de contexto] para bring como operador derivado. `opm-visual-es.md` para convenciones visuales de las cosas traidas. `opm-opl-es.md` para plantillas OPL-ES.
- **Arquitectura categorica del repo:** el bring es una **lente funtorial** del modelo logico al OPD (no altera kernel), consistente con la constitucion 2-categorica (`docs/ARQUITECTURA-CATEGORICA.md`).

