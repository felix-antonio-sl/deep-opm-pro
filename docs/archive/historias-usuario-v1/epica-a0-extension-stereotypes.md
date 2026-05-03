---
epica: "EPICA-A0"
titulo: "Extension — estereotipos OPM (mecanismo generico de ampliacion del lenguaje)"
doc_fuente: "opcloud-reverse/a0-extension-stereotypes.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "M0"
hu_emitidas: 40
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "DIAGNOSTICO-PILOTO-EPICA-A0.md"
---

## Resumen

Esta épica cubre el mecanismo genérico de **estereotipos** de OPCloud: un dispositivo transversal que permite anclar cualquier cosa del modelo (Object o Process) a una plantilla predefinida que aporta prefijo textual `<<Nombre>>`, descomposición canónica de atributos (con unidades, rangos, multiplicidades), propiedades forzadas (p.ej. esencia física), entrada propia en el árbol del panel izquierdo, entidades derivadas auto-generadas en la biblioteca y una toolbar contextual con vocabulario icónico propio (`«s»`, `«s»+`, `«s»` con tacho).

Es la **extensión más transversal** del lenguaje: el estereotipo `<<Requirement>>` (EPICA-A1) es un caso particular de este mecanismo, y las notaciones cuantitativas `[unidad] {símbolo}` de los property-sets son vehículo para la maquinaria de simulación (EPICA-B1). Las HU se estructuran en bloques: (A) diálogo de aplicación, (B) efectos observables post-apply, (C) toolbar contextual, (D) navegación OPD derivado read-only, (E) remoción, (F) composición múltiple y anidamiento, (G) OPL, (H) administración y bibliotecas, (I) integraciones cross-épica, (J) preguntas abiertas como HU `requires-clarification`.

Los estereotipos son **mixtos**: la SSOT OPM [V-1] menciona el mecanismo de extension conceptualmente, pero OPCloud implementa la UX concreta (galeria, toolbar, OPD derivado, entidades derivadas). La mayoria de las HU heredan la solucion OPCloud; una minoria tiene respaldo semantico directo en la SSOT.

## Tabla de HU de la épica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-A0.001 | Ver estereotipo como mecanismo de extensión genérico del lenguaje OPM | MN | S | S | opm-semantica | [V-1] |
| HU-A0.002 | Abrir diálogo `Set Stereotype` desde grupo Entities Extensions | AD | S | S | opcloud-ui | — |
| HU-A0.003 | Ver galería de estereotipos disponibles con tarjetas | AD | S | S | opcloud-ui | — |
| HU-A0.004 | Buscar estereotipo por nombre en el diálogo | AD | S | XS | opcloud-ui | — |
| HU-A0.005 | Marcar estereotipo como favorito con estrella | AD | C | XS | opcloud-ui | — |
| HU-A0.006 | Aplicar estereotipo con doble-clic en la tarjeta | AD | S | XS | mixto | — |
| HU-A0.007 | Aplicar estereotipo con selección + botón Set Stereotype | AD | S | XS | opcloud-ui | — |
| HU-A0.008 | Cancelar aplicación de estereotipo con botón Cancel | MN | S | XS | opcloud-ui | — |
| HU-A0.009 | Aplicar estereotipo indistinto a Object o Process (cross-cutting) | AD | S | M | opm-semantica | [V-1] |
| HU-A0.010 | Ver prefijo `<<Nombre>>` embebido en label del canvas | AD | S | S | mixto | — |
| HU-A0.011 | Ver prefijo `«Nombre»` unicode en OPL pane | AD | S | XS | mixto | [OPL-ES] |
| HU-A0.012 | Ver rama `Stereotypes` autogenerada en árbol OPD | AD | S | S | opcloud-ui | — |
| HU-A0.013 | Ver entidades derivadas en biblioteca `Draggable OPM Things` | AD | S | M | mixto | — |
| HU-A0.014 | Ver esencia física forzada por estereotipo `Sensor` | AD | S | S | opm-semantica | [V-1] [V-124] |
| HU-A0.015 | Ver oración OPL de aplicación del estereotipo | AD | S | S | opm-semantica | [OPL-ES] |
| HU-A0.016 | Ver oración OPL de descomposición del estereotipo | AD | S | S | opm-semantica | [OPL-ES] |
| HU-A0.017 | Navegar al OPD read-only del estereotipo desde árbol | AD | S | S | opcloud-ui | — |
| HU-A0.018 | Ver descomposición canónica del estereotipo con triángulo de agregación | AD | S | S | opm-semantica | [V-61] |
| HU-A0.019 | Ver atributos con notación `[unidad] {símbolo}` | AD | S | S | mixto | — |
| HU-A0.020 | Ver caja-estado con rango, multiplicidad o valor | AD | S | S | mixto | — |
| HU-A0.021 | Bloquear edición en OPD derivado con afordancia visual | AD | S | S | mixto | [V-127] |
| HU-A0.022 | Identificar origen organizacional vs global con badge `G` | AO | C | XS | opcloud-ui | — |
| HU-A0.023 | Aplicar segundo estereotipo a la misma cosa con `«s»+` | AD | S | M | mixto | — |
| HU-A0.024 | Soportar estereotipos anidados (Sensor contiene Property Set) | AD | S | M | opm-semantica | — |
| HU-A0.025 | Remover estereotipo con Unlink (preserva componentes) | AD | S | S | mixto | — |
| HU-A0.026 | Remover estereotipo con Unlink and Remove All Components | AD | S | M | mixto | — |
| HU-A0.027 | Revertir esencia forzada al remover estereotipo | AD | S | S | opm-semantica | [V-124] |
| HU-A0.028 | Ver toolbar contextual ampliada cuando hay estereotipo aplicado | AD | S | S | opcloud-ui | — |
| HU-A0.029 | Traer componentes internos del estereotipo al SD con Bring Connected | AD | S | M | mixto | — |
| HU-A0.030 | Instanciar entidad derivada por drag desde biblioteca | AD | S | S | opcloud-ui | — |
| HU-A0.031 | Validar compatibilidad estereotipo vs tipo de cosa | AD | S | M | opm-semantica | — |
| HU-A0.032 | Serializar aplicación de estereotipo en persistencia del modelo | AD | M1 | M | mixto | — |
| HU-A0.033 | Serializar definición de estereotipo en biblioteca organizacional | AO | S | L | mixto | — |
| HU-A0.034 | Crear nuevo estereotipo en biblioteca organizacional (admin) | AO | C | L | opcloud-ui | — |
| HU-A0.035 | Editar definición de estereotipo y propagar a apariciones | AO | C | L | mixto | — |
| HU-A0.036 | Versionar estereotipo y detectar incompatibilidad en modelo abierto | AO | W | XL | mixto | — |
| HU-A0.037 | Export/import de estereotipos entre organizaciones | AO | W | L | mixto | — |
| HU-A0.038 | Preservar estereotipo en export PDF/SVG | RV | C | S | mixto | — |
| HU-A0.039 | Resolver conflicto de esencias forzadas en estereotipos múltiples | AD | S | S | opm-semantica | — |
| HU-A0.040 | Identificar entidad derivada vs creada manualmente | AD | S | S | mixto | — |

Total: **40 historias de usuario** (9 opm-semantica, 12 opcloud-ui, 19 mixto).

## Historias de usuario

### HU-A0.001 — Ver estereotipo como mecanismo de extensión genérico del lenguaje OPM

**Actor primario:** MN (modelador novato).
**Actores secundarios:** AD (autor de dominio), ME (experto).
**Tipo:** opm-semantica.
**Nivel categórico:** K (kernel — nueva primitiva transversal) primario; L (lente) secundario.
**Superficie UI:** toda la app (el estereotipo es transversal).
**Gesto canónico:** ninguno (concepto arquitectónico).

**Historia:**
> Como modelador, quiero que la noción de estereotipo sea un mecanismo unificado del lenguaje OPM para entender cómo extender el vocabulario de mi modelo sin aprender N extensiones distintas.

**Contexto de negocio:**
El estereotipo es la extensión transversal del lenguaje OPM: un único mecanismo que permite anclar cosas a plantillas predefinidas con atributos canónicos, propiedades forzadas y entradas propias en árbol y biblioteca. Requirements (EPICA-A1) es un caso particular; las notaciones cuantitativas de property-sets son vehículo para simulación (EPICA-B1). Tratar el estereotipo como primitiva arquitectónica del kernel, no como feature aislada, evita la explosión combinatoria de extensiones mutuamente inconsistentes.

**Criterios de aceptación:**
- **Dado** que leo la documentación del modelador, **cuando** busco "extender el lenguaje", **entonces** encuentro una descripción unificada de estereotipos con todos sus efectos observables (prefijo, árbol, biblioteca, forzado de esencia, OPD read-only derivado).
- **Dado** que aplico un estereotipo cualquiera, **cuando** observo sus efectos, **entonces** son consistentes con el conjunto documentado — no hay excepciones "especiales" por estereotipo salvo las declaradas en la plantilla.
- **Dado** que el stack del modelador implementa Requirements (EPICA-A1), **cuando** inspecciono el código, **entonces** Requirements es una instancia concreta del mismo mecanismo de estereotipos, no una rama paralela.

**Reglas y restricciones:**
- El estereotipo es una primitiva kernel que amplía la ecuación categórica del modelo (ver `docs/ARQUITECTURA-CATEGORICA.md` — E1–E13) sin romper invariantes previos.
- Cualquier extensión futura de lenguaje (domain profiles, UML-like tags) se modela como estereotipo, no como entidad paralela.

**Modelo de datos tocado:**
- `stereotype` — nueva entidad del kernel (ver HU-A0.032).
- `thing.stereotypes: StereotypeApplication[]` — lista persistente (ver HU-A0.023 y HU-A0.032).

**Dependencias:**
- Bloquea a: toda la EPICA-A0 (es la HU conceptual de la que derivan las operacionales).
- Bloquea a: EPICA-A1 (Requirements como estereotipo instanciado).

**Integraciones:**
- Kernel categórico (`src/nucleo/`): nueva primitiva `stereotype`.
- `docs/ARQUITECTURA-CATEGORICA.md`: extender constitución con ecuación de estereotipo.

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [V-1] atributos de contorno de cosa (soporte conceptual de extensión).
- Fuente OPCloud: `opcloud-reverse/a0-extension-stereotypes.md` §1 (propósito y alcance).
- Evidencia OPCloud: transcripción — "estereotipos … aporta una plantilla predefinida … propiedades forzadas … entrada propia en el árbol del panel izquierdo … entidades derivadas".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S (es arquitectónica; habilita EPICA-A0, EPICA-A1).
**Tamaño:** S (es definición/arquitectura, el código vive en las otras HU).
**Etiquetas:** [estereotipo, concepto, kernel, arquitectura, transversal].

---

### HU-A0.002 — Abrir diálogo `Set Stereotype` desde grupo Entities Extensions

**Actor primario:** AD (autor de dominio).
**Actores secundarios:** ME, MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** U (ui).
**Superficie UI:** toolbar-contextual → sub-toolbar Entities Extensions → modal Set Stereotype.
**Gesto canónico:** clic en icono Entities Extensions + clic en sub-icono Set Stereotype.

**Historia:**
> Como autor de dominio, quiero abrir el diálogo `Set Stereotype` desde el hub `Entities Extensions` de la toolbar contextual para aplicar un estereotipo a la cosa que tengo seleccionada.

**Contexto de negocio:**
OPCloud agrupa el acceso al estereotipo junto con utilidades de layout (`Toggle Manual Resizing`, `Shrink To Text Size`, `Arrange Connected Links`, `Select Connected Things`) en un sub-toolbar flotante de 5 acciones llamado `Entities Extensions`. Este mismo patrón conviene replicar: el estereotipo es una operación avanzada que comparte hub con manipulaciones de alto nivel, lo que evita inflar la toolbar primaria.

**Criterios de aceptación:**
- **Dado** que tengo una cosa seleccionada en el canvas, **cuando** hago clic en el icono con tooltip `Entities Extensions`, **entonces** se despliega un sub-toolbar flotante con 5 acciones, siendo `Set Stereotype` la última.
- **Dado** que el sub-toolbar está desplegado, **cuando** hago clic en `Set Stereotype`, **entonces** se abre el diálogo modal `Set Stereotype` centrado sobre el canvas con backdrop atenuado.
- **Dado** que no tengo ninguna cosa seleccionada, **cuando** busco el icono `Entities Extensions`, **entonces** no está disponible o está deshabilitado (la toolbar contextual requiere selección).

**Reglas y restricciones:**
- El icono `Entities Extensions` aparece en la toolbar contextual de la cosa, no en la toolbar primaria de la app.
- `Set Stereotype` es una de 5 acciones del hub; el orden DOM observado es `Toggle Manual Resizing`, `Shrink To Text Size`, `Arrange Connected Links`, `Select Connected Things`, `Set Stereotype`.

**Modelo de datos tocado:**
- Ninguno (solo UI).

**Dependencias:**
- Bloquea a: HU-A0.003 (ver galería), HU-A0.023 (agregar segundo estereotipo).
- Relaciona: HU-10.019 (pie menu radial).

**Integraciones:**
- Toolbar contextual (`src/ui/toolbar-contextual.ts` — ubicación hipotética).

**Notas de evidencia:**
- Fuente OPCloud: §1.1, §2 (tabla UI), §3.1 paso 3.
- Frames: frame_00015 (tooltip "Entities Extensions"), frame_00008 (modal abierto).
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [estereotipo, ui, toolbar-contextual, modal, entities-extensions].

---

### HU-A0.003 — Ver galería de estereotipos disponibles con tarjetas

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** V (render).
**Superficie UI:** modal-set-stereotype (sección Favorites + galería).
**Gesto canónico:** ninguno (render al abrir).

**Historia:**
> Como autor de dominio, quiero ver los estereotipos disponibles como tarjetas con icono, nombre y estrella de favorito para elegir rápidamente cuál aplicar.

**Contexto de negocio:**
La galería expone el catálogo organizacional + global de estereotipos. Cada tarjeta incluye una estrella (favorito), un icono central tipo "documento con `<<s>>`" que representa la plantilla, y el nombre truncado con elipsis cuando excede el ancho de tarjeta. Presentar los estereotipos como tarjetas visuales (vs lista textual) facilita el reconocimiento y aprovecha el icono de plantilla como ancla mnemotécnica.

**Criterios de aceptación:**
- **Dado** que el diálogo `Set Stereotype` está abierto, **cuando** miro la sección `Favorites:`, **entonces** veo una fila horizontal de tarjetas (4 en el ejemplo observado).
- **Dado** que una tarjeta está en la sección Favorites, **cuando** la miro, **entonces** muestra: estrella arriba-izquierda (favorito), icono central "documento con `<<s>>`", nombre truncado.
- **Dado** que hago clic simple en una tarjeta, **cuando** se selecciona, **entonces** su fondo cambia a azul oscuro saturado (`#1E3A5F` aprox).
- **Dado** que hay estereotipos más allá de los favoritos, **cuando** exploro el diálogo, **entonces** hay una vía para ver todos (scroll, pestaña o sección "All" — pregunta abierta).

**Reglas y restricciones:**
- Tarjeta: estrella, icono, nombre. Si el nombre excede el ancho → elipsis.
- La sección `Favorites:` es preconfigurable por usuario/org; otras secciones son conjetura para corpus mayor.

**Modelo de datos tocado:**
- `stereotype.id` — UUID — persistente.
- `stereotype.nombre` — string — persistente.
- `stereotype.icono` — referencia a asset — persistente.
- `stereotype.favorito_por_usuario` — bool — persistente (por usuario).

**Dependencias:**
- Bloqueada por: HU-A0.002.
- Bloquea a: HU-A0.004 (search), HU-A0.005 (favoritos), HU-A0.006 (doble-clic), HU-A0.007 (confirmar).

**Integraciones:**
- Biblioteca organizacional de estereotipos (EPICA-82 config-organization-ontology).

**Notas de evidencia:**
- Fuente OPCloud: §2 tabla (fila `Tarjetas de estereotipo`), §5.1 tabla.
- Frames: frame_00008 (4 tarjetas visibles: Embedded…, Sensor, Security, Security…).
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [estereotipo, ui, modal, gallery, tarjetas].

---

### HU-A0.004 — Buscar estereotipo por nombre en el diálogo

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** U.
**Superficie UI:** modal-set-stereotype (textbox Search).
**Gesto canónico:** tecleo en input.

**Historia:**
> Como autor de dominio, quiero buscar un estereotipo escribiendo en el campo `Search` del diálogo para encontrarlo rápido cuando la biblioteca tiene muchos.

**Contexto de negocio:**
Cuando la biblioteca organizacional crece (decenas o centenas de estereotipos), scroll + reconocimiento visual deja de escalar. Un search incremental que filtra tarjetas por nombre es la afordancia mínima para mantener la herramienta usable en organizaciones con ontologías maduras.

**Criterios de aceptación:**
- **Dado** que el diálogo está abierto, **cuando** escribo texto en el campo `Search`, **entonces** las tarjetas visibles se filtran incrementalmente para mostrar solo las que matchean (por nombre, case-insensitive).
- **Dado** que borro el texto del search, **cuando** el campo queda vacío, **entonces** la galería vuelve al estado inicial (favoritos visibles).
- **Dado** que ningún estereotipo matchea, **cuando** miro el diálogo, **entonces** se muestra estado vacío amigable (p.ej. "No stereotypes match").

**Reglas y restricciones:**
- Match por prefijo, substring o fuzzy — pregunta abierta (fuente §4.2).
- Search combinable con favoritos o lo sustituye — pregunta abierta.

**Modelo de datos tocado:**
- Ninguno (filtro client-side).

**Dependencias:**
- Bloqueada por: HU-A0.003.

**Integraciones:**
- Pregunta abierta: filtrado por tags/categoría además de nombre.

**Notas de evidencia:**
- Fuente OPCloud: §4.2.
- Frames: frame_00008 (campo Search vacío visible).
- Clase de afirmación: observado (campo presente) + hipótesis (sobre matching exacto).
- Etiqueta: `requires-clarification` (alcance del matching).

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [estereotipo, ui, modal, search, requires-clarification].

---

### HU-A0.005 — Marcar estereotipo como favorito con estrella

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; P (persistencia preferencia) secundario.
**Superficie UI:** modal-set-stereotype (estrella en tarjeta).
**Gesto canónico:** clic en estrella.

**Historia:**
> Como autor de dominio, quiero marcar/desmarcar un estereotipo como favorito con la estrella arriba-izquierda de la tarjeta para priorizar los que uso más en mi dominio.

**Contexto de negocio:**
La sección `Favorites:` actúa como filtro personal sobre la biblioteca global. Para un modelador que trabaja siempre sobre dispositivos IoT, tener `Sensor`, `Embedded Device Property Set` y similares como favoritos reduce el tiempo de localización. La preferencia es por usuario (no por modelo), y persiste entre sesiones.

**Criterios de aceptación:**
- **Dado** que una tarjeta tiene estrella apagada, **cuando** hago clic en la estrella, **entonces** se activa (estrella amarilla) y el estereotipo pasa a aparecer en `Favorites:`.
- **Dado** que una tarjeta tiene estrella activa, **cuando** hago clic en ella, **entonces** se desactiva y el estereotipo sale de `Favorites:`.
- **Dado** que marqué un favorito, **cuando** cierro la app y vuelvo a abrir el diálogo, **entonces** el favorito se preserva.

**Reglas y restricciones:**
- Estrella es toggle por usuario; no afecta visibilidad del estereotipo para otros usuarios.
- Persistencia por cuenta de usuario (no por modelo, no por organización).

**Modelo de datos tocado:**
- `user_preferences.favorite_stereotypes: StereotypeId[]` — persistente por usuario.

**Dependencias:**
- Bloqueada por: HU-A0.003.
- Relaciona: EPICA-80 (config-user-org).

**Integraciones:**
- Preferencias de usuario.

**Notas de evidencia:**
- Fuente OPCloud: §5.1 tabla, §9 (estrella de favorito arriba-izquierda).
- Frames: frame_00008 (estrella amarilla sobre `Embedded…`).
- Clase de afirmación: observado (estrella presente) + inferencia (gesto exacto no capturado).

**Prioridad:** C.
**Tamaño:** XS.
**Etiquetas:** [estereotipo, ui, modal, favoritos, preferencia].

---

### HU-A0.006 — Aplicar estereotipo con doble-clic en la tarjeta

**Actor primario:** AD.
**Tipo:** mixto.
**Nivel categórico:** U primario; K (aplica el estereotipo) secundario.
**Superficie UI:** modal-set-stereotype (tarjeta).
**Gesto canónico:** doble-clic.

**Historia:**
> Como autor de dominio experto, quiero aplicar un estereotipo con doble-clic en su tarjeta para reducir la interacción a un solo gesto (sin viajar al botón Set Stereotype).

**Contexto de negocio:**
El doble-clic es una afordancia de "aplicar directo" consistente con el patrón general de OPCloud (doble-clic en entrada de biblioteca → aplicar al canvas). Para el modelador experto que sabe exactamente qué estereotipo quiere, elimina un clic adicional.

**Criterios de aceptación:**
- **Dado** que el diálogo está abierto, **cuando** hago doble-clic en una tarjeta de estereotipo, **entonces** se aplica a la cosa seleccionada y el diálogo se cierra.
- **Dado** que hice doble-clic, **cuando** vuelvo al canvas, **entonces** la cosa ya tiene el prefijo `<<Nombre>>` + efectos observables (HU-A0.010+).
- **Dado** que hice clic simple en una tarjeta antes de doble-clicar en otra, **cuando** el doble-clic ocurre, **entonces** se aplica la tarjeta del doble-clic (no la seleccionada previamente).

**Reglas y restricciones:**
- Doble-clic es equivalente a seleccionar + clic en botón `Set Stereotype`.
- No hay confirmación diferida en doble-clic.

**Modelo de datos tocado:**
- `thing.stereotypes: StereotypeApplication[]` — append — persistente (ver HU-A0.032).

**Dependencias:**
- Bloqueada por: HU-A0.003.
- Bloquea a: HU-A0.010, HU-A0.012, HU-A0.013 (efectos observables).

**Integraciones:**
- Kernel (muta `thing.stereotypes`).
- Render (actualiza label).

**Notas de evidencia:**
- Fuente OPCloud: §1.1 ("la aplicación se dispara por doble-click sobre la tarjeta o por botón `Set Stereotype`"), §3.1 paso 6.
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [estereotipo, ui, modal, doble-clic, shortcut, aplicación].

---

### HU-A0.007 — Aplicar estereotipo con selección + botón Set Stereotype

**Actor primario:** MN.
**Actores secundarios:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; K secundario.
**Superficie UI:** modal-set-stereotype (botón primario inferior).
**Gesto canónico:** clic en tarjeta + clic en botón.

**Historia:**
> Como modelador novato, quiero aplicar un estereotipo seleccionando la tarjeta y luego haciendo clic en el botón `Set Stereotype` para ver explícitamente qué elegí antes de confirmar.

**Contexto de negocio:**
La vía "selección + botón" es el flujo canónico para novatos que necesitan el refuerzo visual de saber qué estereotipo están a punto de aplicar. Reduce el error de doble-clicar por accidente sobre una tarjeta equivocada.

**Criterios de aceptación:**
- **Dado** que no hay tarjeta seleccionada, **cuando** miro el botón `Set Stereotype`, **entonces** está deshabilitado.
- **Dado** que hago clic simple en una tarjeta, **cuando** queda seleccionada (fondo azul oscuro), **entonces** el botón `Set Stereotype` se habilita.
- **Dado** que el botón está habilitado, **cuando** hago clic en él, **entonces** se aplica la tarjeta seleccionada y el diálogo se cierra.

**Reglas y restricciones:**
- El botón `Set Stereotype` es primario visualmente; `Cancel` es secundario.
- Solo habilitado con al menos una tarjeta seleccionada.

**Modelo de datos tocado:**
- `thing.stereotypes: StereotypeApplication[]` — append — persistente.

**Dependencias:**
- Bloqueada por: HU-A0.003.

**Integraciones:**
- Mismas que HU-A0.006.

**Notas de evidencia:**
- Fuente OPCloud: §5.1 tabla, §3.1 paso 6.
- Frames: frame_00008 (botón visible con Embedded… seleccionado).
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [estereotipo, ui, modal, confirmación, botón-primario].

---

### HU-A0.008 — Cancelar aplicación de estereotipo con botón Cancel

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** U.
**Superficie UI:** modal-set-stereotype (botón secundario).
**Gesto canónico:** clic en Cancel o ESC o clic fuera.

**Historia:**
> Como modelador, quiero cancelar el diálogo `Set Stereotype` con el botón Cancel (o ESC o clic fuera) para cerrar sin aplicar cuando me di cuenta de que no quería aplicar estereotipo.

**Contexto de negocio:**
Abortar un flujo modal sin side effects es un principio universal de UX. El modelador debe poder cambiar de idea sin consecuencias.

**Criterios de aceptación:**
- **Dado** que el diálogo está abierto, **cuando** hago clic en `Cancel`, **entonces** el diálogo se cierra sin aplicar estereotipo.
- **Dado** que el diálogo está abierto, **cuando** presiono ESC, **entonces** se comporta como Cancel.
- **Dado** que el diálogo está abierto, **cuando** hago clic fuera del modal (en el backdrop), **entonces** se comporta como Cancel (comportamiento a validar — pregunta abierta §4.1).
- **Dado** que cancelé, **cuando** vuelvo al canvas, **entonces** la cosa seleccionada no tiene cambios.

**Reglas y restricciones:**
- Cancel siempre habilitado.
- No hay confirmación doble (no hay "¿seguro que quieres cancelar?").

**Modelo de datos tocado:**
- Ninguno (cancel).

**Dependencias:**
- Bloqueada por: HU-A0.002.

**Integraciones:**
- Ninguna adicional.

**Notas de evidencia:**
- Fuente OPCloud: §4.1, §5.1 tabla.
- Frames: frame_00008 (botón Cancel visible).
- Clase de afirmación: observado (botón) + hipótesis (clic fuera).
- Etiqueta: `requires-clarification` (clic-fuera).

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [estereotipo, ui, modal, cancelación, esc].

---

### HU-A0.009 — Aplicar estereotipo indistinto a Object o Process (cross-cutting)

**Actor primario:** AD.
**Tipo:** opm-semantica.
**Nivel categórico:** K primario; V secundario.
**Superficie UI:** canvas + modal.
**Gesto canónico:** selección + apply.

**Historia:**
> Como autor de dominio, quiero aplicar estereotipos sin distinción a Objects (rectángulos) y Processes (elipses) para que el vocabulario de extensión sea transversal al lenguaje, como lo es en OPM canónico.

**Contexto de negocio:**
OPCloud no filtra la galería por tipo de cosa seleccionada: un mismo estereotipo puede aplicarse a Object o Process. El ejemplo de `Security Level Computing` aplicado a un proceso muestra la naturaleza cross-cutting. Esta decisión refuerza que el estereotipo es decoración semántica de la cosa abstracta, no del subtipo concreto.

**Criterios de aceptación:**
- **Dado** que tengo un Object seleccionado, **cuando** abro el diálogo `Set Stereotype`, **entonces** la galería muestra todos los estereotipos (no filtra por tipo).
- **Dado** que tengo un Process seleccionado, **cuando** abro el diálogo, **entonces** la galería muestra los mismos estereotipos.
- **Dado** que aplico un estereotipo a un Process, **cuando** se renderiza, **entonces** la elipse conserva su forma (borde azul saturado) y recibe el prefijo `<<Nombre>>` en su label.

**Reglas y restricciones:**
- La galería no filtra por compatibilidad semántica — delegado a HU-A0.031 (validación).
- La forma nativa (rectángulo/elipse) no cambia al aplicar estereotipo.

**Modelo de datos tocado:**
- `thing.stereotypes` aplica independientemente de `thing.type`.

**Dependencias:**
- Bloqueada por: HU-A0.006 o HU-A0.007.
- Bloquea a: HU-A0.031 (validación de compatibilidad).

**Integraciones:**
- Render JointJS (factories de Object y Process).

**Notas de evidencia:**
- Fuente normativa: [V-1] atributos de contorno de cosa — aplican a todo Thing.
- Fuente OPCloud: §3.2, brecha `adv-01.A.4` (galería no filtra por tipo).
- Frames: frame_00014 (proceso con `<<Security Level Computing>>`).
- Evidencia visual: JOYAS §1 colores de borde, §2 dimensiones 135x60, §3 tipografía Arial 14px semibold.
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [estereotipo, kernel, aplicación, cross-cutting, object, process].

---

### HU-A0.010 — Ver prefijo `<<Nombre>>` embebido en label del canvas

**Actor primario:** AD.
**Tipo:** mixto.
**Nivel categórico:** V (render).
**Superficie UI:** canvas-render (label de la cosa).
**Gesto canónico:** ninguno (render declarativo).

**Historia:**
> Como autor de dominio, quiero ver el prefijo `<<Nombre Estereotipo>>` embebido en el label de la cosa en canvas para reconocer de un vistazo qué plantilla está aplicada.

**Contexto de negocio:**
El prefijo es la **marca visual primaria** del estereotipo en el canvas. Usa comillas angulares dobles ASCII (`<<`, `>>`), en la misma tipografía que el nombre propio. Si el estereotipo es largo, el label hace wrap en 2–3 líneas. Es decoración de render derivada del estado `is_stereotyped_by(S)`, no parte del nombre canónico de la cosa.

**Criterios de aceptación:**
- **Dado** que una cosa tiene estereotipo `S` aplicado, **cuando** miro el canvas, **entonces** su label muestra `<<S>> <Nombre Original>`.
- **Dado** que el estereotipo es largo (p.ej. `Embedded Device Property Set`), **cuando** el label no cabe en una línea, **entonces** hace wrap en 2 o 3 líneas preservando la separación `<<S>>` del nombre.
- **Dado** que la cosa no tiene estereotipo, **cuando** miro el label, **entonces** solo aparece el nombre propio, sin prefijo.
- **Dado** que aplico/remuevo estereotipo, **cuando** el toggle ocurre, **entonces** el prefijo aparece/desaparece en vivo.

**Reglas y restricciones:**
- Comillas ASCII `<<`, `>>` (no unicode `«»`). Divergencia con OPL documentada (§9, HU-A0.011).
- Prefijo es render, no `thing.name` — se deriva del estado.
- La forma nativa (rectángulo/elipse) no cambia.

**Modelo de datos tocado:**
- Ninguno directo. El prefijo se computa a partir de `thing.stereotypes`.

**Dependencias:**
- Bloqueada por: HU-A0.006 o HU-A0.007.

**Integraciones:**
- Renderer JointJS (label builder).

**Notas de evidencia:**
- Fuente OPCloud: §2 tabla (label cosa con estereotipo), §3.1 paso 7, §5.5 (estilos).
- Frames: frame_00014 (`<<Embedded Device Property Set>> Object 1`), frame_00020 (`<<Sensor>> Object 1`).
- Evidencia visual: JOYAS §3 tipografía Arial 14px semibold.
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [estereotipo, render, label, prefijo, ascii].

---

### HU-A0.011 — Ver prefijo `«Nombre»` unicode en OPL pane

**Actor primario:** AD.
**Tipo:** mixto.
**Nivel categórico:** L (OPL).
**Superficie UI:** opl-pane.
**Gesto canónico:** ninguno.

**Historia:**
> Como autor de dominio, quiero ver el prefijo `«Nombre»` con comillas unicode en el OPL pane para leer el modelo con la notación tipográficamente correcta de UML/SysML.

**Contexto de negocio:**
OPCloud diverge tipográficamente entre canvas (ASCII `<<>>`) y OPL (unicode `«»`). La razón aparente es tradición: UML usa `«»` en su notación textual desde hace décadas. El canvas usa ASCII por portabilidad de fuentes. Respetar ambas convenciones mantiene compatibilidad visual con el estándar OPCloud.

**Criterios de aceptación:**
- **Dado** que una cosa tiene estereotipo `S`, **cuando** consulto el OPL pane, **entonces** las oraciones usan `«S»` (unicode).
- **Dado** que una cosa no tiene estereotipo, **cuando** consulto su OPL, **entonces** no hay comillas angulares.
- **Dado** que comparo canvas vs OPL, **cuando** miro ambos, **entonces** uso ASCII en canvas y unicode en OPL (divergencia intencionada).

**Reglas y restricciones:**
- Caracteres unicode: `«` (U+00AB), `»` (U+00BB).
- Divergencia documentada en SSOT visual (pendiente de formalizar — brecha `adv-01.A.2`).

**Modelo de datos tocado:**
- Ninguno directo.

**Dependencias:**
- Bloqueada por: HU-A0.010.
- Relaciona: HU-A0.015, HU-A0.016.

**Integraciones:**
- OPL renderer (`src/render/opl-renderer.ts`).

**Notas de evidencia:**
- Fuente OPCloud: §2 tabla OPL, §7.3, §9.
- Frames: frame_00022 (OPL con `«Embedded Device Property Set»`).
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [estereotipo, opl, render, unicode, tipografía].

---

### HU-A0.012 — Ver rama `Stereotypes` autogenerada en árbol OPD

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** L primario; U secundario.
**Superficie UI:** panel-izquierdo (árbol OPD, rama `Stereotypes`).
**Gesto canónico:** ninguno (se crea al aplicar primer estereotipo).

**Historia:**
> Como autor de dominio, quiero ver una rama `Stereotypes` en el árbol del panel izquierdo — hermana de `SD` — que liste los estereotipos aplicados en el modelo para navegarlos independientemente del OPD activo.

**Contexto de negocio:**
La rama `Stereotypes` es el **punto de navegación** hacia los OPDs derivados (read-only) de cada estereotipo aplicado. Aparece solo cuando hay al menos un estereotipo aplicado (estado condicional no normado que afecta a cualquier parser del árbol). El patrón "rama por extensión" es general: Requirements (EPICA-A1) añade rama paralela `Requirement Views`.

**Criterios de aceptación:**
- **Dado** que no hay estereotipos aplicados, **cuando** miro el árbol, **entonces** solo aparece la rama `SD`.
- **Dado** que aplico el primer estereotipo, **cuando** el apply termina, **entonces** aparece la rama `Stereotypes` hermana de `SD`, expandible con triángulo `▼`.
- **Dado** que hay estereotipos aplicados, **cuando** expando `Stereotypes`, **entonces** veo un nodo por estereotipo aplicado (y sus anidados transitivamente).
- **Dado** que removí todos los estereotipos, **cuando** el unlink del último termina, **entonces** la rama `Stereotypes` desaparece (vuelve al estado sin rama).

**Reglas y restricciones:**
- La rama es hermana de `SD`, no hija.
- Se crea/destruye dinámicamente según haya o no estereotipos aplicados.
- No aparece en mini-navegador si el viewport está en SD (solo en árbol izquierdo).

**Modelo de datos tocado:**
- `model.stereotype_applications: StereotypeApplication[]` — la rama se deriva de este set.

**Dependencias:**
- Bloqueada por: HU-A0.006 o HU-A0.007.
- Bloquea a: HU-A0.017 (navegar a OPD read-only).

**Integraciones:**
- Árbol OPD (EPICA-20).

**Notas de evidencia:**
- Fuente OPCloud: §2 tabla, §3.1 paso 7, §4.3 (ambigüedad — rama no existe antes de primer apply), §7.1.
- Frames: frame_00014, frame_00022.
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [estereotipo, ui, arbol-opd, lente, rama-dinamica].

---

### HU-A0.013 — Ver entidades derivadas en biblioteca `Draggable OPM Things`

**Actor primario:** AD.
**Tipo:** mixto.
**Nivel categórico:** L primario; K (entidades derivadas en modelo) secundario.
**Superficie UI:** panel-izquierdo (biblioteca Draggable OPM Things).
**Gesto canónico:** ninguno (auto-pobladas al aplicar).

**Historia:**
> Como autor de dominio, quiero ver las entidades derivadas del estereotipo (`Cost of Object 1 [$] {c}`, `Sensor Property Set of Object 1`, etc.) en la biblioteca lateral para poder arrastrarlas al canvas cuando necesite hacerlas visibles en el SD.

**Contexto de negocio:**
Aplicar un estereotipo genera automáticamente N entidades derivadas (una por atributo canónico + agregadores + condiciones) con identidad propia. Estas entidades existen en el modelo pero no necesariamente en el canvas — se listan en la biblioteca para que el modelador pueda traerlas al SD bajo demanda. Es la **afordancia complementaria** a `Bring Connected Elements`.

**Criterios de aceptación:**
- **Dado** que aplico estereotipo `Embedded Device Property Set` a `Object 1`, **cuando** reviso la biblioteca, **entonces** aparecen entradas para `Cost of Object 1 [$] {c}`, `Dimension Set of Object 1`, `Material of Object 1`, `Power Consumption of Object 1 [mA] {pc}`, `Reliability of Object 1 (system Error) [%] {se}`.
- **Dado** que aplico estereotipo `Sensor` a `Object 1`, **cuando** reviso la biblioteca, **entonces** aparecen 10+ derivadas incluyendo `Sensor Property Set of Object 1`, `Accuracy Condition of Object 1`, `Resolution of Object 1`, etc.
- **Dado** que renombro la cosa anfitriona, **cuando** confirmo, **entonces** las derivadas actualizan su nombre (`Cost of <NuevoNombre>`).
- **Dado** que remuevo el estereotipo con Unlink and Remove All Components, **cuando** el remove termina, **entonces** las derivadas desaparecen de la biblioteca (ver HU-A0.026).

**Reglas y restricciones:**
- Patrón de nombrado: `<Atributo> of <T>` + sufijos opcionales `Set` / `Condition`.
- Las derivadas son drag-ready (ver HU-A0.030).
- No hay filtro visual en biblioteca para distinguir derivadas vs creadas manualmente (brecha — HU-A0.040).

**Modelo de datos tocado:**
- `thing[]` — se añaden N entidades con flag `derived_from_stereotype: StereotypeApplicationId`.
- Nombre computado: `<atributo.nombre> of <host.nombre>`.

**Dependencias:**
- Bloqueada por: HU-A0.006 o HU-A0.007.
- Bloquea a: HU-A0.030 (drag desde biblioteca).

**Integraciones:**
- Biblioteca lateral (EPICA-20 o dedicada).
- Renombrador (propaga a derivadas).

**Notas de evidencia:**
- Fuente OPCloud: §2 tabla, §3.1 paso 7, §5.3, §7.2.
- Frames: frame_00014, frame_00020.
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [estereotipo, ui, biblioteca-lateral, derivadas, lente, parametrico].

---

### HU-A0.014 — Ver esencia física forzada por estereotipo `Sensor`

**Actor primario:** AD.
**Tipo:** opm-semantica.
**Nivel categórico:** K primario (muta esencia); V secundario (sombra).
**Superficie UI:** canvas-render + toolbar-contextual.
**Gesto canónico:** ninguno (forzado por apply).

**Historia:**
> Como autor de dominio, quiero que aplicar `Sensor` fuerce automáticamente `esencia=fisica` en la cosa anfitriona para respetar la semántica OPM de que un sensor es físico por definición.

**Contexto de negocio:**
Algunos estereotipos incluyen **propiedades forzadas** en su plantilla: `Sensor` declara que la cosa anfitriona debe ser physical. Al aplicar, el sistema muta `esencia` automáticamente y la sombra aparece. Esto garantiza consistencia ontológica: no puede haber un `<<Sensor>>` informatical. La confirmación explícita en OPL (`<<Sensor>> Object 1 is physical.`) sirve como evidencia de que la mutación ocurrió.

**Criterios de aceptación:**
- **Dado** que tengo `Object 1` con `esencia=informacional`, **cuando** aplico estereotipo `Sensor`, **entonces** `essence` pasa automáticamente a `physical` sin intervención del toggle manual.
- **Dado** que se aplicó `Sensor`, **cuando** miro el canvas, **entonces** el rectángulo tiene sombra gris abajo-derecha (convención physical).
- **Dado** que se aplicó `Sensor`, **cuando** consulto OPL, **entonces** aparece la línea `<<Sensor>> Object 1 is physical.` confirmando el forzado.
- **Dado** que un estereotipo no fuerza essence (p.ej. `Embedded Device Property Set`), **cuando** lo aplico, **entonces** la esencia original se preserva.

**Reglas y restricciones:**
- `esencia_forzada` es campo de la plantilla del estereotipo (nullable).
- La mutación es automática; no pide confirmación.
- Revertir la esencia al remover el estereotipo es HU separada (HU-A0.027).

**Modelo de datos tocado:**
- `thing.essence` — se muta si `stereotype.essence_forzada` != null.
- `stereotype.essence_forzada: "physical" | "informatical" | null` — persistente en definición.

**Dependencias:**
- Bloqueada por: HU-A0.006 o HU-A0.007.
- Bloquea a: HU-A0.027, HU-A0.039 (conflicto de esencias forzadas múltiples).

**Integraciones:**
- Kernel (muta esencia).
- Render (sombra).
- OPL.

**Notas de evidencia:**
- Fuente normativa: [V-1] esencia informacional/física; [V-124] sombreado como canal semántico; [V-126] tres orígenes de sombra.
- Fuente OPCloud: §1.1 (transcripción: "anchoring it to the main thing will also change its essence as a sensor is a physical"), §3.3.
- Frames: frame_00020 (sombra visible), frame_00022.
- Evidencia visual: JOYAS §8 drop shadow de `decompiled/28258.js`.
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [estereotipo, kernel, essence, forzada, fisica, sensor].

---

### HU-A0.015 — Ver oración OPL de aplicación del estereotipo

**Actor primario:** AD.
**Tipo:** opm-semantica.
**Nivel categórico:** L.
**Superficie UI:** opl-pane.
**Gesto canónico:** ninguno.

**Historia:**
> Como autor de dominio, quiero ver en el OPL pane una oración de aplicación cuando asocio un estereotipo a una cosa para leer explícitamente la relación.

**Contexto de negocio:**
El OPL es espejo textual del modelo. Aplicar estereotipo es un cambio semántico que merece expresión verbal. La forma exacta depende de si el estereotipo fuerza essence (`<<S>> T is physical.`) o es decorativo (`T exhibits <<S>> ...`).

**Criterios de aceptación:**
- **Dado** que aplico `Sensor` (que fuerza physical), **cuando** consulto OPL, **entonces** aparece `<<Sensor>> Object 1 is physical.`.
- **Dado** que aplico `Embedded Device Property Set` (sin forzado), **cuando** consulto OPL, **entonces** aparece una oración del tipo `<<Embedded Device Property Set>> Object 1 ...` indicando la aplicación.
- **Dado** que remuevo el estereotipo, **cuando** el unlink termina, **entonces** la línea OPL desaparece.

**Reglas y restricciones:**
- Formato canónico: `«S» T is <essence>.` cuando fuerza essence; `«S» T <conector> ...` en otros casos.
- Usa unicode `«»` en OPL (ver HU-A0.011).

**Modelo de datos tocado:**
- Ninguno directo (OPL es lente).

**Dependencias:**
- Bloqueada por: HU-A0.011.
- Relaciona: HU-A0.014 (forzado), HU-A0.016 (descomposición).

**Integraciones:**
- OPL renderer.

**Notas de evidencia:**
- Fuente OPCloud: §2 tabla OPL, §3.3, §7.3.
- Frames: frame_00020 (línea 1), frame_00022.
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [estereotipo, opl, apply, oracion].

---

### HU-A0.016 — Ver oración OPL de descomposición del estereotipo

**Actor primario:** AD.
**Tipo:** opm-semantica.
**Nivel categórico:** L.
**Superficie UI:** opl-pane.
**Gesto canónico:** ninguno.

**Historia:**
> Como autor de dominio, quiero ver en OPL una oración de descomposición que liste los atributos aportados por el estereotipo para leer la estructura completa sin navegar al OPD derivado.

**Contexto de negocio:**
Una descomposición canónica (p.ej. `Sensor` exhibe Property Set + Accuracy Set + Resolution + ...) se expresa en OPL con `exhibits ... as well as ...` cuando hay mezcla de objetos y procesos, o `consists of ... ` para agregación pura. Esto permite al lector entender la estructura sin abrir el OPD read-only.

**Criterios de aceptación:**
- **Dado** que aplico `Embedded Device Property Set`, **cuando** consulto OPL, **entonces** aparece la oración `Embedded Device Property Set consists of Cost, c, Dimension Set, Material, Power Consumption, pc, and Reliability, se` (o análoga).
- **Dado** que aplico `Sensor`, **cuando** consulto OPL, **entonces** aparece la oración `Sensor exhibits <<Embedded Device Property Set>> Sensor Property Set, Accuracy Set, Maximum Voltage, mv, ..., as well as Sensing.`.
- **Dado** que el estereotipo tiene atributos cuantitativos con símbolo, **cuando** la oración se genera, **entonces** los símbolos aparecen entre comas (`Cost, c, ...`).

**Reglas y restricciones:**
- `consists of` para agregación pura (solo atributos-objetos).
- `exhibits ... as well as <proceso>` cuando hay mezcla de objetos-atributo y procesos.
- Símbolos entre comas después del nombre del atributo (convención observada).

**Modelo de datos tocado:**
- Ninguno directo.

**Dependencias:**
- Bloqueada por: HU-A0.015.

**Integraciones:**
- OPL renderer.

**Notas de evidencia:**
- Fuente OPCloud: §2 tabla, §3.3 (línea 10), §7.3.
- Frames: frame_00011 (línea 6), frame_00022 (líneas 2 y 10).
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [estereotipo, opl, descomposicion, agregacion, exhibits].

---

### HU-A0.017 — Navegar al OPD read-only del estereotipo desde árbol

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; L secundario.
**Superficie UI:** panel-izquierdo (rama Stereotypes) + canvas (OPD derivado).
**Gesto canónico:** clic en nodo del árbol.

**Historia:**
> Como autor de dominio, quiero hacer clic en un nodo de la rama `Stereotypes` para navegar al OPD derivado del estereotipo y revisar su descomposición canónica.

**Contexto de negocio:**
El OPD derivado es la **vista de la plantilla** instanciada para esta cosa anfitriona. Permite al modelador entender exactamente qué estructura aportó el estereotipo sin leer documentación externa. Es read-only (la plantilla es canónica), pero navegable, seleccionable y con tooltips.

**Criterios de aceptación:**
- **Dado** que la rama `Stereotypes` tiene nodo `Sensor`, **cuando** hago clic en él, **entonces** el viewport del canvas cambia al OPD derivado del `Sensor`.
- **Dado** que estoy en el OPD derivado, **cuando** quiero volver al SD, **entonces** hago clic en nodo `SD` del árbol y regreso.
- **Dado** que navego al OPD derivado, **cuando** observo la barra de breadcrumbs o indicador de viewport, **entonces** sé claramente que estoy en el OPD del estereotipo (no en el SD).

**Reglas y restricciones:**
- Navegación bidireccional: SD ↔ OPDs de estereotipos vía árbol.
- El OPD derivado es read-only (ver HU-A0.021).

**Modelo de datos tocado:**
- `viewport.current_opd` — transitorio (ID del OPD activo).

**Dependencias:**
- Bloqueada por: HU-A0.012.
- Bloquea a: HU-A0.018, HU-A0.019, HU-A0.020, HU-A0.021.

**Integraciones:**
- Árbol OPD (EPICA-20).
- Canvas viewport.

**Notas de evidencia:**
- Fuente OPCloud: §3.4 (flow navegación).
- Frames: frame_00011 (OPD derivado `Embedded Device Property Set`), frame_00022 (OPD derivado `Sensor`).
- Clase de afirmación: observado + confirmado por transcripción ("you cannot change the stereotype, this is just a view").

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [estereotipo, ui, arbol-opd, navegacion, read-only].

---

### HU-A0.018 — Ver descomposición canónica del estereotipo con triángulo de agregación

**Actor primario:** AD.
**Tipo:** opm-semantica.
**Nivel categórico:** V.
**Superficie UI:** canvas (OPD derivado).
**Gesto canónico:** ninguno.

**Historia:**
> Como autor de dominio, quiero ver la descomposición del estereotipo como objeto-raíz conectado con triángulo de agregación-participación a sus atributos para entender la estructura de plantilla con notación OPM canónica.

**Contexto de negocio:**
El OPD derivado del estereotipo usa el **mismo patrón visual que cualquier in-zoom o unfold de modelado básico**: triángulo de agregación con bus colector vertical (peine) hacia los atributos. Esto confirma que los estereotipos no introducen relaciones nuevas — solo instancian patrones existentes. Mantener la notación canónica facilita la lectura sin aprender sintaxis adicional.

**Criterios de aceptación:**
- **Dado** que navego al OPD derivado del estereotipo `S`, **cuando** miro la disposición, **entonces** veo el objeto-raíz (nombre del estereotipo) conectado por triángulo de agregación + peine vertical a N atributos.
- **Dado** que el estereotipo tiene atributos-objeto y procesos (como `Sensor` con `Sensing`), **cuando** miro el OPD, **entonces** los procesos aparecen como elipses (no rectángulos) pero están en el mismo peine.
- **Dado** que el estereotipo contiene sub-estereotipos (como `Sensor` ⊃ `Embedded Device Property Set`), **cuando** miro, **entonces** el sub-estereotipo aparece con su prefijo `<<...>>` en el peine.

**Reglas y restricciones:**
- Patrón de render: triángulo de agregación-participación (§5.4).
- Reutiliza notación OPM canónica (no introduce glifos nuevos).
- Layout canónico es parte de la definición de plantilla (no editable).

**Modelo de datos tocado:**
- `stereotype.descomposicion: Attribute[]` — definición persistente en biblioteca.
- No persiste layout del OPD derivado en el modelo del usuario.

**Dependencias:**
- Bloqueada por: HU-A0.017.

**Integraciones:**
- Renderer (reutiliza factories de agregación).

**Notas de evidencia:**
- Fuente normativa: [V-61] anatomía formal de enlace (agregación como enlace estructural).
- Fuente OPCloud: §3.1 paso 7, §5.4, §9 (triángulo + peine).
- Frames: frame_00011, frame_00022.
- Evidencia visual: JOYAS §13 triángulo agregador 30×30, `getTriangleSVG()` con `#586D8C`.
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [estereotipo, render, agregacion, opd-derivado, triangulo, peine].

---

### HU-A0.019 — Ver atributos con notación `[unidad] {símbolo}`

**Actor primario:** AD.
**Tipo:** mixto.
**Nivel categórico:** V primario; K (definición de atributo cuantitativo) secundario.
**Superficie UI:** canvas (OPD derivado + label de atributo).
**Gesto canónico:** ninguno.

**Historia:**
> Como autor de dominio, quiero ver los atributos cuantitativos con su notación `[unidad] {símbolo}` (p.ej. `Cost [$] {c}`) para leer dimensión y alias de una sola mirada.

**Contexto de negocio:**
La notación estándar de OPCloud para atributos cuantitativos es `<Nombre> [<unidad>] {<símbolo>}`. La unidad entre corchetes (p.ej. `[$]`, `[mA]`, `[ms]`, `[V]`, `[%]`) y el símbolo como alias de variable entre llaves (p.ej. `{c}`, `{pc}`, `{se}`) conectan la especificación del modelo a la maquinaria cuantitativa (simulación computacional, EPICA-B1). Esta notación es el vehículo de parametrización dimensional.

**Criterios de aceptación:**
- **Dado** que el estereotipo tiene atributo `Cost` con unidad `$` y símbolo `c`, **cuando** miro el atributo en el OPD derivado, **entonces** el label muestra `Cost [$] {c}`.
- **Dado** que un atributo no tiene unidad (p.ej. `Material`), **cuando** miro su label, **entonces** muestra solo el nombre (sin corchetes).
- **Dado** que un atributo tiene calificador (p.ej. `Reliability (system Error)`), **cuando** miro su label, **entonces** incluye el calificador entre paréntesis: `Reliability (system Error) [%] {se}`.

**Reglas y restricciones:**
- Orden: `<Nombre> [<calificador>] [<unidad>] {<símbolo>}` — paréntesis antes, corchetes, llaves.
- Corchetes para unidad; llaves para alias; paréntesis para calificador.

**Modelo de datos tocado:**
- `attribute.name` — string — persistente.
- `attribute.unidad` — string nullable — persistente.
- `attribute.simbolo` — string nullable — persistente.
- `attribute.calificador` — string nullable — persistente.

**Dependencias:**
- Bloqueada por: HU-A0.018.
- Bloquea a: EPICA-B1 (simulación computacional — usa unidad y símbolo).

**Integraciones:**
- Simulación (EPICA-B1) consume la notación.

**Notas de evidencia:**
- Fuente OPCloud: §5.3, §5.4, §5.5, §9 (patrón `[unidad] {símbolo}`).
- Frames: frame_00011, frame_00022.
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [estereotipo, render, cuantitativo, notacion, unidad, simbolo].

---

### HU-A0.020 — Ver caja-estado con rango, multiplicidad o valor

**Actor primario:** AD.
**Tipo:** mixto.
**Nivel categórico:** V primario; K secundario.
**Superficie UI:** canvas (OPD derivado, caja-estado en atributo).
**Gesto canónico:** ninguno.

**Historia:**
> Como autor de dominio, quiero ver una caja-estado oliva-dorada en cada atributo del estereotipo que contenga su rango (`[0..100]`), multiplicidad (`(0..*)`, `(1..*)`) o etiqueta (`value`) para entender los constraints cuantitativos heredados.

**Contexto de negocio:**
La caja-estado es un rectángulo interior al atributo que porta información adicional: rango, multiplicidad o placeholder `value`. Tiene borde oliva-dorado saturado característico. El mismo símbolo visual soporta cuatro roles semánticos distintos (rango, multiplicidad, valor placeholder, ID como `Req#1`), lo que es fuente de ambigüedad (brecha `34.N.2`).

**Criterios de aceptación:**
- **Dado** que un atributo tiene rango definido (p.ej. `Reliability: [0..100]`), **cuando** lo miro, **entonces** su caja-estado muestra `[0..100]`.
- **Dado** que un atributo tiene multiplicidad (p.ej. `Cost: (0..*)`), **cuando** lo miro, **entonces** su caja-estado muestra `(0..*)`.
- **Dado** que un atributo tiene valor placeholder (p.ej. `Dimension Set: value`), **cuando** lo miro, **entonces** su caja-estado muestra `value`.
- **Dado** que la caja-estado es común a 4 roles, **cuando** mi herramienta decide su contenido, **entonces** lo deriva de la plantilla del estereotipo sin ambigüedad.

**Reglas y restricciones:**
- Borde oliva-dorado saturado (convención §5.5).
- Cuatro roles semánticos con el mismo símbolo visual (ambigüedad declarada).

**Modelo de datos tocado:**
- `attribute.caja_estado: { rango?, multiplicidad?, valor?, id? }` — al menos uno declarado — persistente.

**Dependencias:**
- Bloqueada por: HU-A0.018.

**Integraciones:**
- Renderer.
- Simulación (EPICA-B1).

**Notas de evidencia:**
- Fuente OPCloud: §2 tabla, §5.4, §5.5, brecha `34.N.2`.
- Frames: frame_00011, frame_00022.
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [estereotipo, render, caja-estado, cuantitativo, ambiguedad].

---

### HU-A0.021 — Bloquear edición en OPD derivado con afordancia visual

**Actor primario:** AD.
**Tipo:** mixto.
**Nivel categórico:** V primario; K (bloquea edición) secundario.
**Superficie UI:** canvas (OPD derivado).
**Gesto canónico:** ninguno.

**Historia:**
> Como autor de dominio, quiero que el OPD derivado del estereotipo sea read-only con afordancia visual (borde verde-menta tenue) para que no edite accidentalmente una plantilla organizacional.

**Contexto de negocio:**
La transcripción es explícita: "you cannot change the stereotype, this is just a view". El OPD derivado es vista, no edición. Las operaciones que requieren modificar la plantilla (delete, rename, reposicionar libre) están deshabilitadas. La afordancia visual (borde verde-menta muy tenue en todos los elementos) comunica esto sin texto.

**Criterios de aceptación:**
- **Dado** que estoy en el OPD derivado de un estereotipo, **cuando** intento eliminar un atributo con Delete, **entonces** la acción está deshabilitada.
- **Dado** que estoy en el OPD derivado, **cuando** intento renombrar un atributo, **entonces** no puedo editar su label.
- **Dado** que estoy en el OPD derivado, **cuando** intento arrastrar un atributo a nueva posición, **entonces** no se mueve.
- **Dado** que estoy en el OPD derivado, **cuando** hago clic en un atributo, **entonces** puedo seleccionarlo (y ver tooltips) pero no editarlo.
- **Dado** que miro los elementos del OPD derivado, **cuando** los comparo con elementos editables del SD, **entonces** veo el borde verde-menta tenue característico de read-only.

**Reglas y restricciones:**
- Read-only total: ni delete, ni rename, ni move libre.
- Afordancia visual: borde verde-menta muy tenue (§5.5).
- Selección y hover permitidos (no bloquea exploración).

**Modelo de datos tocado:**
- Ninguno (la plantilla no muta por gesto de usuario en OPD derivado).

**Dependencias:**
- Bloqueada por: HU-A0.017.

**Integraciones:**
- Renderer (estilo read-only).
- Kernel (bloquea comandos mutation en OPD derivado).

**Notas de evidencia:**
- Fuente normativa: [V-127] reforzadores de canvas deben diferenciarse de sombra semántica.
- Fuente OPCloud: §1.1 (transcripción), §3.4 paso 4, §5.5.
- Frames: frame_00022.
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [estereotipo, render, read-only, afordancia, verde-menta].

---

### HU-A0.022 — Identificar origen organizacional vs global con badge `G`

**Actor primario:** AO (admin de organización).
**Actores secundarios:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** V.
**Superficie UI:** modal-set-stereotype (tarjetas + badge).
**Gesto canónico:** ninguno.

**Historia:**
> Como admin de organización, quiero distinguir estereotipos globales (provistos por el sistema) de los organizacionales (creados por mi org) con un badge `G` sobre el icono para saber cuáles puedo modificar.

**Contexto de negocio:**
La biblioteca de estereotipos mezcla aportes del sistema (globales, inmutables) con aportes de la organización (editables por admin). Distinguirlos visualmente evita confusiones al admin que intenta editar un estereotipo global por error. El badge `G` (letra pequeña sobrepuesta al icono) es la convención observada.

**Criterios de aceptación:**
- **Dado** que un estereotipo es global, **cuando** miro su tarjeta en la galería, **entonces** tiene un badge `G` pequeño sobrepuesto al icono central.
- **Dado** que un estereotipo es organizacional, **cuando** miro su tarjeta, **entonces** el icono no tiene badge `G`.
- **Dado** que soy admin y quiero editar un estereotipo, **cuando** miro los candidatos, **entonces** filtro o distingo rápidamente los editables (sin `G`) de los inmutables (con `G`).

**Reglas y restricciones:**
- Badge `G` es convención, no normada en SSOT.
- Origen se persiste en la definición del estereotipo.

**Modelo de datos tocado:**
- `stereotype.origen: "organizational" | "global"` — persistente.

**Dependencias:**
- Bloqueada por: HU-A0.003.
- Relaciona: HU-A0.034, HU-A0.035, HU-A0.037.

**Integraciones:**
- Admin UI (EPICA-82).

**Notas de evidencia:**
- Fuente OPCloud: §1.1 (Advance 4 transcripción: "the g which is global"), §4.5, §9.
- Frames: frame_00008 (sin resolución suficiente para ver `G`).
- Clase de afirmación: confirmado por transcripción + inferencia visual.

**Prioridad:** C.
**Tamaño:** XS.
**Etiquetas:** [estereotipo, ui, origen, global, organizational, badge].

---

### HU-A0.023 — Aplicar segundo estereotipo a la misma cosa con `«s»+`

**Actor primario:** AD.
**Tipo:** mixto.
**Nivel categórico:** K primario; U secundario.
**Superficie UI:** toolbar-contextual (icono `«s»+`) + modal.
**Gesto canónico:** clic en `«s»+`.

**Historia:**
> Como autor de dominio, quiero añadir un segundo estereotipo a una cosa que ya tiene uno aplicado usando el icono `«s»+` de la toolbar contextual para componer múltiples extensiones sobre la misma entidad.

**Contexto de negocio:**
Una cosa puede tener múltiples estereotipos simultáneos (documentado en §6 del doc fuente). El icono `«s»+` de la toolbar contextual (visible en frames 17, 19, 20) reabre el diálogo `Set Stereotype` en modo "añadir". Cada estereotipo aplicado aparece como nodo independiente en la rama `Stereotypes` y añade sus propias entidades derivadas.

**Criterios de aceptación:**
- **Dado** que tengo una cosa con estereotipo `S1` aplicado, **cuando** hago clic en `«s»+` de la toolbar contextual, **entonces** se reabre el diálogo `Set Stereotype`.
- **Dado** que selecciono `S2` en el diálogo, **cuando** confirmo, **entonces** la cosa queda con ambos estereotipos aplicados.
- **Dado** que la cosa tiene `S1` y `S2`, **cuando** consulto la rama `Stereotypes` del árbol, **entonces** veo ambos nodos hermanos.
- **Dado** que la cosa tiene `S1` y `S2`, **cuando** miro el label en canvas, **entonces** (pregunta abierta §11.1) el label muestra `<<S1>> <<S2>> T`, `<<S1, S2>> T`, o solo el último — comportamiento pendiente de observación.

**Reglas y restricciones:**
- Cada estereotipo añade sus derivadas independientemente.
- Composición por adición (no anidamiento — ese es diferente, ver HU-A0.024).
- Label con múltiples estereotipos: pregunta abierta (etiqueta `requires-clarification`).

**Modelo de datos tocado:**
- `thing.stereotypes: StereotypeApplication[]` — array (no solo un ID) — persistente.

**Dependencias:**
- Bloqueada por: HU-A0.006 o HU-A0.007 (primer apply).
- Bloquea a: HU-A0.039 (conflicto de essences).

**Integraciones:**
- Kernel (array de aplicaciones).
- Toolbar contextual.

**Notas de evidencia:**
- Fuente OPCloud: §3.5, §6, §11 preguntas 1.
- Frames: frame_00017, frame_00019, frame_00020 (icono `«s»+` visible).
- Clase de afirmación: observado (icono + transcripción implícita) + hipótesis (concatenación exacta).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [estereotipo, ui, toolbar-contextual, composicion, multiple, requires-clarification].

---

### HU-A0.024 — Soportar estereotipos anidados (Sensor contiene Property Set)

**Actor primario:** AD.
**Tipo:** opm-semantica.
**Nivel categórico:** K.
**Superficie UI:** canvas + árbol + biblioteca.
**Gesto canónico:** ninguno (anidamiento es parte de la definición).

**Historia:**
> Como autor de dominio, quiero que los estereotipos puedan contener otros estereotipos en su definición (p.ej. `Sensor` incluye `Embedded Device Property Set`) para componer plantillas reusables sin duplicar estructura.

**Contexto de negocio:**
El anidamiento es la **herencia composicional** del sistema de estereotipos. La transcripción confirma: "the sensor itself has within it another stereotype the property set". El anidamiento es parte de la **definición de la plantilla** (no del apply-site), lo que significa que al aplicar `Sensor`, automáticamente se "aplica" también `Embedded Device Property Set` transitivamente — ambos aparecen en la rama `Stereotypes` y sus derivadas se materializan.

**Criterios de aceptación:**
- **Dado** que `Sensor` contiene `Embedded Device Property Set` en su definición, **cuando** aplico `Sensor` a `Object 1`, **entonces** la rama `Stereotypes` muestra **dos** nodos: `Sensor` y `Embedded Device Property Set`.
- **Dado** que aplico `Sensor`, **cuando** consulto la biblioteca, **entonces** veo derivadas de **ambos** estereotipos (las de Sensor + las del Property Set heredado).
- **Dado** que navego al OPD derivado de `Sensor`, **cuando** miro la descomposición, **entonces** veo `<<Embedded Device Property Set>> Sensor Property Set` en el peine, confirmando la inclusión explícita.

**Reglas y restricciones:**
- Anidamiento es transitividad de aplicación.
- La relación se declara en la plantilla, no en el apply.
- Remover el estereotipo anidado independientemente del padre: pregunta abierta (§11.11).

**Modelo de datos tocado:**
- `stereotype.estereotipos_anidados: StereotypeId[]` — persistente en definición.

**Dependencias:**
- Bloqueada por: HU-A0.006.
- Bloquea a: HU-A0.026 (remove all components cascade).

**Integraciones:**
- Kernel (transitivity en apply).
- Árbol (nodos transitivos).

**Notas de evidencia:**
- Fuente OPCloud: §1.1 (transcripción "two stereotypes were added … the sensor itself has within it another stereotype the property set"), §3.3, §5.4.
- Frames: frame_00022 (Sensor con Property Set embebido).
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [estereotipo, kernel, anidamiento, herencia, composicion, transitividad].

---

### HU-A0.025 — Remover estereotipo con Unlink (preserva componentes)

**Actor primario:** AD.
**Tipo:** mixto.
**Nivel categórico:** K primario; U secundario.
**Superficie UI:** toolbar-contextual (icono `«s»` con tacho).
**Gesto canónico:** clic en `«s»` con tacho.

**Historia:**
> Como autor de dominio, quiero remover un estereotipo con `Unlink` para desvincular la plantilla de la cosa pero preservar los componentes que ya traje al diagrama como entidades independientes.

**Contexto de negocio:**
`Unlink` es la modalidad **no-destructiva** de remoción. Desvincula la relación `thing × stereotype` pero preserva cualquier componente que el modelador haya traído al canvas vía `Bring Connected Elements`. Útil cuando el modelador usó el estereotipo como andamiaje y luego quiere independizarse de la plantilla sin perder trabajo.

**Criterios de aceptación:**
- **Dado** que tengo `Object 1` con estereotipo `S` y traje `Cost of Object 1` al canvas, **cuando** hago clic en `«s»` con tacho (Remove Stereotype), **entonces** el prefijo `<<S>>` desaparece del label, el nodo se va de la rama `Stereotypes`, pero `Cost of Object 1` permanece en el canvas como cosa independiente.
- **Dado** que removí el estereotipo con Unlink, **cuando** consulto la biblioteca, **entonces** las derivadas que no traje al canvas también se retiran de la biblioteca.
- **Dado** que removí el último estereotipo, **cuando** miro el árbol, **entonces** la rama `Stereotypes` desaparece.

**Reglas y restricciones:**
- Tooltip literal: `Remove Stereotype` (confirmado frame 17).
- Unlink preserva componentes ya materializados en canvas.
- Reversión de esencia forzada: pregunta abierta (HU-A0.027).

**Modelo de datos tocado:**
- `thing.stereotypes` — remove entry — persistente.
- Entidades derivadas no-usadas: se retiran del modelo.
- Entidades derivadas usadas (en canvas): persisten como cosas independientes (se rompe el link `derived_from`).

**Dependencias:**
- Bloqueada por: HU-A0.006 o HU-A0.007.
- Bloquea a: HU-A0.027 (revert essence).

**Integraciones:**
- Kernel (remove application).
- Biblioteca.
- Árbol.

**Notas de evidencia:**
- Fuente OPCloud: §1.1 (transcripción "unlink the stereotype"), §3.6 modalidad 1, §5.2.
- Frames: frame_00017 (tooltip "Remove Stereotype"), frame_00019 (post-remoción).
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [estereotipo, ui, remocion, unlink, no-destructiva].

---

### HU-A0.026 — Remover estereotipo con Unlink and Remove All Components

**Actor primario:** AD.
**Tipo:** mixto.
**Nivel categórico:** K primario; U secundario.
**Superficie UI:** toolbar-contextual o submenú.
**Gesto canónico:** clic en `Unlink and Remove All Components`.

**Historia:**
> Como autor de dominio, quiero remover un estereotipo con `Unlink and Remove All Components` para eliminar no solo la vinculación sino también todas las entidades derivadas del canvas, retornando al estado pre-apply.

**Contexto de negocio:**
Esta modalidad es **destructiva**: además de desvincular, borra del canvas todas las partes que venían de la plantilla. Útil cuando el modelador descubre que aplicó el estereotipo por error y quiere rollback completo. Debe solicitar confirmación (pregunta abierta §11.3) porque la acción es destructiva e irreversible sin undo.

**Criterios de aceptación:**
- **Dado** que tengo `Object 1` con estereotipo `S` y 5 derivadas, 3 de ellas en canvas, **cuando** elijo `Unlink and Remove All Components`, **entonces** el prefijo desaparece, el nodo del árbol se va, y las 5 derivadas (las 3 en canvas y las 2 en biblioteca) se eliminan.
- **Dado** que la acción es destructiva, **cuando** la invoco, **entonces** el sistema pide confirmación con detalle de qué se va a eliminar (pregunta abierta §11.3).
- **Dado** que el estereotipo está anidado (contiene otros), **cuando** hago Remove All Components, **entonces** las derivadas de los anidados también se eliminan.
- **Dado** que cancelo en la confirmación, **cuando** el modal se cierra, **entonces** nada cambia.

**Reglas y restricciones:**
- Modalidad destructiva; cancelable antes de confirmar.
- Cascade por anidamiento.
- Confirmación con detalle: pregunta abierta.

**Modelo de datos tocado:**
- `thing.stereotypes` — remove entry.
- Entidades derivadas: remove todas (sean visibles o no).

**Dependencias:**
- Bloqueada por: HU-A0.006 o HU-A0.007.
- Relaciona: HU-A0.024 (cascade por anidamiento).

**Integraciones:**
- Kernel (cascade delete).
- Modal de confirmación.
- Undo (EPICA-90).

**Notas de evidencia:**
- Fuente OPCloud: §1.1 (transcripción "unlink and remove all the components"), §3.6 modalidad 2, §11.3.
- Frames: no captura confirmación.
- Clase de afirmación: confirmado por transcripción + abierto (forma del prompt).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [estereotipo, ui, remocion, destructiva, cascade, requires-clarification].

---

### HU-A0.027 — Revertir esencia forzada al remover estereotipo

**Actor primario:** AD.
**Tipo:** opm-semantica.
**Nivel categórico:** K.
**Superficie UI:** canvas-render + OPL.
**Gesto canónico:** ninguno (automático post-remove).

**Historia:**
> Como autor de dominio, quiero que al remover un estereotipo que forzó esencia (p.ej. `Sensor` → `physical`), la esencia revierta automáticamente a su valor previo para que el modelo refleje mi intención original.

**Contexto de negocio:**
`Sensor` fuerza `physical` al aplicarse. Si el modelador remueve `Sensor`, la expectativa natural es que la esencia regrese a lo que era antes (típicamente `informatical`). La transcripción no lo especifica explícitamente (§3.6 pregunta abierta); esta HU propone el comportamiento esperado y lo marca para validación.

**Criterios de aceptación:**
- **Dado** que `Object 1` tenía essence `informatical` y apliqué `Sensor` (forzó `physical`), **cuando** remuevo `Sensor` (cualquier modalidad), **entonces** essence vuelve a `informatical`.
- **Dado** que la esencia revirtió, **cuando** miro el canvas, **entonces** la sombra desaparece.
- **Dado** que la esencia revirtió, **cuando** consulto OPL, **entonces** la línea `... is physical.` se reemplaza por la de la esencia original.
- **Dado** que la esencia fue cambiada manualmente después del apply (p.ej. modelador toggleó a `fisica` independientemente), **cuando** remuevo el estereotipo, **entonces** la esencia se mantiene en `physical` (el toggle manual prevalece — pregunta abierta).

**Reglas y restricciones:**
- Requiere tracking de `essence_antes_de_estereotipo` en `StereotypeApplication` o política "último toggle gana".
- Pregunta abierta §11.2.

**Modelo de datos tocado:**
- `StereotypeApplication.essence_previa: "physical" | "informatical" | null` — persistente.
- `thing.essence` — revertido al remove.

**Dependencias:**
- Bloqueada por: HU-A0.014, HU-A0.025.
- Etiqueta: `requires-clarification`.

**Integraciones:**
- Kernel.
- Render (sombra).
- OPL.

**Notas de evidencia:**
- Fuente OPCloud: §3.6 ("[Abierto] Si el estereotipo forzó esencia física … ¿la remoción revierte automáticamente …?"), §11.2.
- Clase de afirmación: hipótesis + abierto.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [estereotipo, kernel, essence, revert, requires-clarification].

---

### HU-A0.028 — Ver toolbar contextual ampliada cuando hay estereotipo aplicado

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** V primario; U secundario.
**Superficie UI:** toolbar-contextual (barra flotante adaptativa).
**Gesto canónico:** ninguno (adaptativa según estado).

**Historia:**
> Como autor de dominio, quiero que la toolbar contextual muestre iconos adicionales (`«s»`, `«s»+`, `«s»` con tacho, y en casos el binario `011/001/110`) cuando la cosa seleccionada tiene al menos un estereotipo aplicado para acceder a las operaciones relevantes.

**Contexto de negocio:**
La toolbar contextual es **adaptativa**: su composición cambia según el estado de la cosa seleccionada. Sin estereotipo aplicado muestra 2 iconos mínimos (árbol/red + link). Con estereotipo aplicado se expande a ≥5 iconos incluyendo los propios del vocabulario de estereotipo. Con estereotipo + esencia forzada se observa variante ampliada de 6 iconos (frame 20) incluyendo `011/001/110` (binario) cuya semántica exacta es hipótesis.

**Criterios de aceptación:**
- **Dado** que tengo una cosa sin estereotipo, **cuando** miro la toolbar contextual, **entonces** muestra 2 iconos: `[árbol/red]`, `[link]`.
- **Dado** que tengo una cosa con estereotipo aplicado, **cuando** miro la toolbar contextual, **entonces** muestra ≥5 iconos incluyendo `«s»`, `«s»+`, `«s»` con tacho.
- **Dado** que tengo una cosa con estereotipo + esencia forzada, **cuando** miro la toolbar, **entonces** puede aparecer un icono extra `011/001/110` (binario — semántica pendiente de clarificación).

**Reglas y restricciones:**
- Composición: `[árbol]`, `[link]`, `«s»`, `«s»+`, `«s»` tacho, opcional `011/001/110`.
- Icono `011/001/110`: hipótesis → export/gen-code (§5.2).

**Modelo de datos tocado:**
- Ninguno directo.

**Dependencias:**
- Bloqueada por: HU-A0.006.
- Bloquea a: HU-A0.023 (`«s»+`), HU-A0.025 (`«s»` tacho).

**Integraciones:**
- Toolbar contextual.

**Notas de evidencia:**
- Fuente OPCloud: §2 tabla (tres variantes: cero, estándar, ampliada), §5.2 inventario icónico.
- Frames: frame_00015 (zero), frame_00017 (estándar), frame_00020 (ampliada).
- Clase de afirmación: observado + hipótesis (binario).
- Etiqueta parcial: `requires-clarification` (binario).

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [estereotipo, ui, toolbar-contextual, adaptativa, vocabulario-iconico].

---

### HU-A0.029 — Traer componentes internos del estereotipo al SD con Bring Connected

**Actor primario:** AD.
**Tipo:** mixto.
**Nivel categórico:** U primario; K secundario.
**Superficie UI:** canvas SD + toolbar (Bring Connected Elements).
**Gesto canónico:** clic en icono Bring Connected sobre cosa anfitriona.

**Historia:**
> Como autor de dominio, quiero traer componentes del estereotipo (atributos, sub-estereotipos) al SD usando `Bring Connected Elements` desde la cosa anfitriona para materializar selectivamente las partes que me interesan.

**Contexto de negocio:**
El OPD del estereotipo es read-only, así que el modelador no puede "sacar" componentes de ahí. En vez, usa `Bring Connected Elements` sobre la cosa anfitriona desde el SD: el sistema propone los candidatos (que coinciden con las entidades derivadas listadas en la biblioteca) y el modelador elige cuáles traer al canvas. Es el flujo complementario a la biblioteca (HU-A0.030).

**Criterios de aceptación:**
- **Dado** que `Object 1` tiene estereotipo `S` aplicado, **cuando** selecciono `Object 1` en SD y activo `Bring Connected Elements`, **entonces** el sistema propone los atributos/partes del estereotipo como candidatos.
- **Dado** que elijo algunos candidatos, **cuando** confirmo, **entonces** se materializan en el SD como rectángulos/elipses con sus labels paramétricos (`Cost of Object 1 [$] {c}`).
- **Dado** que traje un componente al SD, **cuando** lo miro, **entonces** es editable (mover, renombrar, conectar) — el SD no es read-only aunque el OPD del estereotipo sí.

**Reglas y restricciones:**
- Bring Connected desde cosa anfitriona, no desde OPD derivado.
- Los traídos son editables en el SD.

**Modelo de datos tocado:**
- Entidad derivada pasa de "solo biblioteca" a "con posición en SD".

**Dependencias:**
- Bloqueada por: HU-A0.013.
- Relaciona: EPICA-1B (bring-connected).

**Integraciones:**
- Bring Connected (EPICA-1B).

**Notas de evidencia:**
- Fuente OPCloud: §1.1 (transcripción "bring them to my diagram I should use the bring connected thing"), §3.4 paso 5, §7.4.
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [estereotipo, ui, bring-connected, integracion, materializacion].

---

### HU-A0.030 — Instanciar entidad derivada por drag desde biblioteca

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; K (instanciación) secundario.
**Superficie UI:** panel-izquierdo (biblioteca) → canvas.
**Gesto canónico:** drag desde entrada de biblioteca al canvas.

**Historia:**
> Como autor de dominio, quiero arrastrar una entidad derivada desde la biblioteca lateral al canvas para instanciarla sin pasar por `Bring Connected Elements`.

**Contexto de negocio:**
La biblioteca lateral lista las derivadas como entradas drag-ready. El drag al canvas es equivalente a `Bring Connected` pero con afordancia directa: el modelador ve el candidato, lo toma, lo suelta donde quiere.

**Criterios de aceptación:**
- **Dado** que la biblioteca muestra `Cost of Object 1 [$] {c}` como entrada, **cuando** hago drag de la entrada al canvas, **entonces** se instancia como rectángulo en la posición donde solté.
- **Dado** que instancié la derivada, **cuando** la miro en canvas, **entonces** tiene su nombre paramétrico y es editable.
- **Dado** que instancié la derivada, **cuando** consulto OPL, **entonces** aparece la oración correspondiente (igual que via Bring Connected).

**Reglas y restricciones:**
- Drag desde biblioteca al canvas: gesto canónico OPCloud para instanciar entidad.
- El resultado es idéntico al de Bring Connected (no hay diferencia semántica).

**Modelo de datos tocado:**
- Entidad derivada pasa a tener `position` en el SD actual.

**Dependencias:**
- Bloqueada por: HU-A0.013.
- Relaciona: HU-A0.029.

**Integraciones:**
- Biblioteca lateral + drag handler.

**Notas de evidencia:**
- Fuente OPCloud: §7.2 ("Las derivadas son drag-ready").
- Clase de afirmación: inferencia consistente con HU-10.xxx (drag desde biblioteca).

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [estereotipo, ui, drag, biblioteca-lateral, instanciacion].

---

### HU-A0.031 — Validar compatibilidad estereotipo vs tipo de cosa

**Actor primario:** AD.
**Tipo:** opm-semantica.
**Nivel categórico:** K (validación).
**Superficie UI:** modal-set-stereotype (warning o disabled) o post-apply.
**Gesto canónico:** ninguno (automático).

**Historia:**
> Como autor de dominio, quiero que el sistema avise o impida aplicar un estereotipo conceptualmente incompatible con el tipo de cosa (p.ej. `Sensor` a un Process) para evitar estados ontológicamente inconsistentes.

**Contexto de negocio:**
OPCloud no filtra la galería por tipo de cosa (observación brecha `adv-01.A.4`), lo que permite aplicar `Sensor` (conceptualmente objeto físico) a un Process. El comportamiento ante incompatibilidad semántica no está capturado. Esta HU propone una estrategia de validación: dejar que el estereotipo declare compatibilidad en su plantilla (p.ej. `aplicable_a: ["object"]`) y warning o bloqueo en la aplicación.

**Criterios de aceptación:**
- **Dado** que `Sensor` declara `aplicable_a: ["object"]`, **cuando** intento aplicarlo a un Process, **entonces** el sistema muestra warning explicando la incompatibilidad ontológica.
- **Dado** que el modelador insiste, **cuando** confirma el warning, **entonces** se aplica (no se bloquea — modelador tiene el control).
- **Dado** que un estereotipo es cross-cutting (p.ej. `Security Level Computing` aplica a ambos), **cuando** lo aplico a cualquier tipo, **entonces** no hay warning.
- **Dado** que aplico un estereotipo que fuerza essence a un Process (cuya ontología usa categorías distintas), **cuando** el forzado ocurre, **entonces** el comportamiento es validado separadamente (pregunta abierta §4.4).

**Reglas y restricciones:**
- Compatibilidad declarada en plantilla: `aplicable_a: ("object" | "process")[]`.
- Warning no bloqueante (el modelador tiene última palabra).
- Pregunta abierta §4.4: esencia forzada sobre Process.

**Modelo de datos tocado:**
- `stereotype.aplicable_a: ThingType[]` — persistente en definición.

**Dependencias:**
- Bloqueada por: HU-A0.009.
- Etiqueta: `requires-clarification`.

**Integraciones:**
- Validador del kernel.

**Notas de evidencia:**
- Fuente OPCloud: brecha `adv-01.A.4`, §4.4, §11.8.
- Clase de afirmación: hipótesis + abierto.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [estereotipo, kernel, validacion, compatibilidad, requires-clarification].

---

### HU-A0.032 — Serializar aplicación de estereotipo en persistencia del modelo

**Actor primario:** AD.
**Tipo:** mixto.
**Nivel categórico:** P primario; K secundario.
**Superficie UI:** ninguna directa.
**Gesto canónico:** save/load.

**Historia:**
> Como autor de dominio, quiero que las aplicaciones de estereotipo se serialicen correctamente al guardar el modelo y se restauren al cargar para no perder el trabajo al cerrar la sesión.

**Contexto de negocio:**
Las aplicaciones de estereotipo son estado persistente del modelo. Serializarlas correctamente requiere persistir: (a) el ID del estereotipo aplicado, (b) el ID de la cosa anfitriona, (c) la esencia previa (para revert — HU-A0.027), (d) las entidades derivadas generadas (con flag `derived_from_stereotype`). Al cargar, el sistema debe regenerar la rama `Stereotypes`, el prefijo del label, las derivadas de la biblioteca, etc.

**Criterios de aceptación:**
- **Dado** que aplico estereotipo `S` a `Object 1` y guardo el modelo, **cuando** recargo, **entonces** `Object 1` tiene el mismo estado: prefijo, rama en árbol, derivadas en biblioteca.
- **Dado** que el modelo serializado referencia estereotipo `S` por ID, **cuando** cargo en un entorno que tiene `S` en biblioteca, **entonces** la carga es exitosa.
- **Dado** que el modelo referencia un estereotipo `S` que no está en la biblioteca del entorno actual, **cuando** cargo, **entonces** el sistema avisa con error o warning (pregunta abierta — HU-A0.036 sobre versioning).
- **Dado** que cargo un modelo con estereotipo anidado (Sensor ⊃ Property Set), **cuando** termina la carga, **entonces** ambos aparecen en la rama.

**Reglas y restricciones:**
- Serialización por ID (no por definición completa).
- Falta de estereotipo referenciado: error o fallback — pregunta abierta.
- Formato: JSON canónico del modelo.

**Modelo de datos tocado:**
- `StereotypeApplication { stereotype_id, thing_id, essence_previa, derived_things_ids[] }` — persistente.
- `thing.stereotypes: StereotypeApplication[]` — persistente.

**Dependencias:**
- Bloqueada por: HU-A0.006.
- Bloquea a: HU-A0.033 (biblioteca organizacional serializada).

**Integraciones:**
- Serialización kernel (`src/nucleo/serializacion/`).

**Notas de evidencia:**
- Fuente OPCloud: §6 (modelo de datos implícito).
- Clase de afirmación: inferido del funcionamiento observado (aplicaciones persisten).

**Prioridad:** M1 (sin esto los estereotipos no sobreviven al save/load — crítico).
**Tamaño:** M.
**Etiquetas:** [estereotipo, persistencia, serializacion, kernel].

---

### HU-A0.033 — Serializar definición de estereotipo en biblioteca organizacional

**Actor primario:** AO.
**Tipo:** mixto.
**Nivel categórico:** P primario; D (dominio organizacional) secundario.
**Superficie UI:** admin settings (EPICA-82).
**Gesto canónico:** save en editor de biblioteca.

**Historia:**
> Como admin de organización, quiero que las definiciones de estereotipo (plantilla, descomposición, esencia forzada, anidamientos) se persistan en la biblioteca organizacional para que todos los usuarios de mi org las compartan.

**Contexto de negocio:**
La biblioteca organizacional de estereotipos es un artefacto persistente compartido. Vive probablemente en `OPCloud Settings` (EPICA-80) o `Organization Ontology` (EPICA-82) según transcripción §11.12. Su schema debe incluir: `{id, nombre, origen, icono, descomposicion[], essence_forzada?, estereotipos_anidados[]}`. Serialización independiente de modelos concretos — los modelos referencian por ID.

**Criterios de aceptación:**
- **Dado** que admin define un estereotipo nuevo en la biblioteca, **cuando** guarda, **entonces** la definición persiste con schema completo (nombre, descomposición, essence, anidamientos).
- **Dado** que un modelo de usuario usa el estereotipo, **cuando** se carga el modelo, **entonces** la definición se resuelve por ID contra la biblioteca organizacional.
- **Dado** que la biblioteca organizacional tiene 50 estereotipos, **cuando** admin exporta, **entonces** se puede producir un JSON/YAML con todas las definiciones para migrar a otra org (ver HU-A0.037).

**Reglas y restricciones:**
- Schema completo versionable.
- ID estable (no depende de nombre).
- Separación: biblioteca de definiciones vs aplicaciones en modelos.

**Modelo de datos tocado:**
- `stereotype` — entidad de biblioteca con schema completo — persistente (scope organizacional).

**Dependencias:**
- Bloqueada por: HU-A0.032.
- Bloquea a: HU-A0.034, HU-A0.037.

**Integraciones:**
- Admin UI (EPICA-82).
- Persistencia organizacional.

**Notas de evidencia:**
- Fuente OPCloud: §6, §11.12.
- Transcripción: "stereotypes are not created lightly … an admin should create".
- Clase de afirmación: confirmado por transcripción + inferido (schema).

**Prioridad:** S.
**Tamaño:** L.
**Etiquetas:** [estereotipo, persistencia, biblioteca, admin, organizacional].

---

### HU-A0.034 — Crear nuevo estereotipo en biblioteca organizacional (admin)

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categórico:** D (dominio) primario; U secundario.
**Superficie UI:** admin-settings (EPICA-82 config-organization-ontology).
**Gesto canónico:** formulario de creación.

**Historia:**
> Como admin de organización, quiero crear un estereotipo nuevo desde la sección Organization Ontology definiendo su nombre, icono, descomposición, esencia forzada y anidamientos para extender el vocabulario de modelado de mi organización.

**Contexto de negocio:**
La creación de estereotipos es operación de admin ("stereotypes are not created lightly"). La UI de administración vive fuera del modelador de usuario, en `OPCloud Settings` o `Organization Ontology`. El flujo exacto (formulario + preview + save) es pregunta abierta (§11.12) — esta HU es el placeholder para integrar con EPICA-82.

**Criterios de aceptación:**
- **Dado** que soy admin, **cuando** navego a `Organization Ontology → Stereotypes`, **entonces** veo la lista de estereotipos organizacionales con botón `New Stereotype`.
- **Dado** que hago clic en `New Stereotype`, **cuando** se abre el editor, **entonces** puedo definir nombre, icono, descomposición (atributos con unidad/símbolo/rango/multiplicidad), esencia forzada, y anidamientos.
- **Dado** que guardo la definición, **cuando** vuelvo al modelador, **entonces** el estereotipo aparece en la galería del diálogo `Set Stereotype` con origen "organizational".

**Reglas y restricciones:**
- Solo admins pueden crear (permiso verificado).
- Estereotipos globales (con badge `G`) no son creables por org — vienen del sistema.
- UI exacta: pregunta abierta §11.12.

**Modelo de datos tocado:**
- `stereotype` nuevo — append a biblioteca organizacional — persistente.

**Dependencias:**
- Bloqueada por: HU-A0.033.
- Relaciona: EPICA-40 (permisos), EPICA-82 (ontología).
- Etiqueta: `requires-clarification`.

**Integraciones:**
- Admin UI.
- Sistema de permisos.

**Notas de evidencia:**
- Fuente OPCloud: §1 fuera de alcance ("creación/edición del estereotipo como plantilla de biblioteca"), §11.12.
- Transcripción: confirma rol de admin.
- Clase de afirmación: confirmado + abierto (UI).

**Prioridad:** C.
**Tamaño:** L.
**Etiquetas:** [estereotipo, admin, biblioteca, creacion, organizational, requires-clarification].

---

### HU-A0.035 — Editar definición de estereotipo y propagar a apariciones

**Actor primario:** AO.
**Tipo:** mixto.
**Nivel categórico:** D primario; K (propagación) secundario.
**Superficie UI:** admin-settings (EPICA-82).
**Gesto canónico:** edición de formulario + save.

**Historia:**
> Como admin de organización, quiero editar la definición de un estereotipo (p.ej. añadir un atributo nuevo a `Embedded Device Property Set`) y que el cambio se propague a todas las cosas que ya tienen aplicado el estereotipo para mantener consistencia.

**Contexto de negocio:**
Cuando admin añade `Lifetime` a `Embedded Device Property Set`, todas las `Object X` que ya tenían el estereotipo aplicado deben ver automáticamente la nueva derivada `Lifetime of Object X` en su biblioteca. La propagación es el requisito de consistencia; sin ella, estereotipos editados quedan desfasados de sus aplicaciones. La propagación es inherentemente compleja si modelos están guardados en varios lugares — pregunta abierta §11.12.

**Criterios de aceptación:**
- **Dado** que admin edita estereotipo `S` añadiendo atributo `A`, **cuando** guarda, **entonces** todas las aplicaciones existentes de `S` obtienen la derivada `A of T`.
- **Dado** que admin edita `S` removiendo atributo `A`, **cuando** guarda, **entonces** las derivadas `A of T` se retiran de las aplicaciones (con confirmación si `A of T` está en canvas).
- **Dado** que admin cambia `esencia_forzada` de `S`, **cuando** guarda, **entonces** las cosas con `S` aplicado revisan su essence según la nueva regla.
- **Dado** que un modelo está guardado pero no abierto, **cuando** admin edita, **entonces** la propagación ocurre al próximo load (lazy propagation) — pregunta abierta.

**Reglas y restricciones:**
- Propagación eager (modelos abiertos) vs lazy (modelos cerrados): pregunta abierta.
- Retiro de derivada con uso en canvas: pide confirmación.
- Conflictos con edits locales: pregunta abierta.

**Modelo de datos tocado:**
- `stereotype.descomposicion` — mutable por admin.
- Aplicaciones existentes: se actualizan por propagación.

**Dependencias:**
- Bloqueada por: HU-A0.033, HU-A0.034.
- Relaciona: HU-A0.036 (versioning).
- Etiqueta: `requires-clarification`.

**Integraciones:**
- Admin UI.
- Sistema de propagación.

**Notas de evidencia:**
- Fuente OPCloud: inferencia sobre §1 fuera de alcance.
- Clase de afirmación: hipótesis.

**Prioridad:** C.
**Tamaño:** L.
**Etiquetas:** [estereotipo, admin, edicion, propagacion, requires-clarification].

---

### HU-A0.036 — Versionar estereotipo y detectar incompatibilidad en modelo abierto

**Actor primario:** AO.
**Actores secundarios:** AD.
**Tipo:** mixto.
**Nivel categórico:** P primario; K (migración) secundario.
**Superficie UI:** modal de incompatibilidad al cargar modelo.
**Gesto canónico:** ninguno (automático al load).

**Historia:**
> Como admin de organización, quiero versionar los estereotipos para que cuando un modelo antiguo referencie una versión obsoleta, el sistema detecte la incompatibilidad y ofrezca migración o apertura read-only.

**Contexto de negocio:**
Los estereotipos evolucionan. Un modelo guardado hace 6 meses referenciaba `Sensor v1.0`; hoy la biblioteca tiene `Sensor v1.3` con atributos distintos. El sistema debe detectar la discrepancia, ofrecer al usuario: (a) migrar al nuevo schema (con warning de cambios), (b) abrir read-only, (c) mantener la versión antigua si está archivada. Es maquinaria de migración compleja, probablemente fuera del MVP.

**Criterios de aceptación:**
- **Dado** que cargo un modelo que referencia `Sensor v1.0`, **cuando** la biblioteca actual tiene `Sensor v1.3`, **entonces** se muestra un modal informando la diferencia de versiones y opciones.
- **Dado** que elijo migrar, **cuando** la migración termina, **entonces** el modelo está actualizado a `v1.3` con warning si hubo pérdida de datos.
- **Dado** que elijo read-only, **cuando** abro, **entonces** el modelo se abre pero no puedo editar las aplicaciones del estereotipo.
- **Dado** que la biblioteca ya no contiene el estereotipo (renombrado/eliminado), **cuando** cargo, **entonces** el sistema muestra error con detalles.

**Reglas y restricciones:**
- Versionado explícito: `stereotype.version: semver`.
- Migración: script automatizable con review manual.
- Fuera del MVP (alcance avanzado).

**Modelo de datos tocado:**
- `stereotype.version: string` — persistente.
- `StereotypeApplication.stereotype_version: string` — persistente.

**Dependencias:**
- Bloqueada por: HU-A0.033.
- Etiqueta: `requires-clarification`.

**Integraciones:**
- Save/Load (EPICA-30).
- Admin UI.

**Notas de evidencia:**
- Fuente OPCloud: inferencia (no en doc).
- Clase de afirmación: hipótesis.

**Prioridad:** W (won't-have en ciclo actual).
**Tamaño:** XL.
**Etiquetas:** [estereotipo, admin, versioning, migracion, requires-clarification].

---

### HU-A0.037 — Export/import de estereotipos entre organizaciones

**Actor primario:** AO.
**Tipo:** mixto.
**Nivel categórico:** X (integración externa).
**Superficie UI:** admin-settings (export + import de biblioteca).
**Gesto canónico:** botones export/import.

**Historia:**
> Como admin de organización, quiero exportar la biblioteca de estereotipos a un archivo y poder importarla en otra organización para compartir ontología de dominio entre equipos o migrar definiciones.

**Contexto de negocio:**
Una biblioteca organizacional de estereotipos es valor intelectual. Organizaciones consultoras, estándares de industria o equipos federados pueden querer compartir subconjuntos. Export/import con formato estándar (JSON/YAML) habilita este flujo. Pregunta abierta: formato exacto, compatibilidad cross-versión, si importar cosas en modelos que referencian estereotipos externos.

**Criterios de aceptación:**
- **Dado** que soy admin, **cuando** voy a `Organization Ontology → Export`, **entonces** puedo seleccionar estereotipos y descargar un archivo (JSON/YAML).
- **Dado** que recibo un archivo de estereotipos, **cuando** uso `Import`, **entonces** el sistema muestra preview de qué se va a añadir/reemplazar/conflictuar.
- **Dado** que confirmo import, **cuando** termina, **entonces** los estereotipos aparecen en la galería organizacional.
- **Dado** que importo y un estereotipo existente tiene mismo ID pero distinta versión, **cuando** se procesa, **entonces** el sistema pregunta por resolución (overwrite, skip, rename).

**Reglas y restricciones:**
- Formato abierto documentado.
- Conflictos resueltos con prompt.
- Pregunta abierta (§11 parcialmente).

**Modelo de datos tocado:**
- Serialización portable de biblioteca.

**Dependencias:**
- Bloqueada por: HU-A0.033.
- Etiqueta: `requires-clarification`.

**Integraciones:**
- EPICA-70 (interop-opcat) o formato propio.

**Notas de evidencia:**
- Fuente OPCloud: inferencia.
- Clase de afirmación: hipótesis.

**Prioridad:** W.
**Tamaño:** L.
**Etiquetas:** [estereotipo, interop, export, import, requires-clarification].

---

### HU-A0.038 — Preservar estereotipo en export PDF/SVG

**Actor primario:** RV (revisor / lector).
**Tipo:** mixto.
**Nivel categórico:** X primario; V secundario.
**Superficie UI:** export (PDF/SVG).
**Gesto canónico:** export desde menú.

**Historia:**
> Como revisor, quiero que al exportar el modelo a PDF o SVG los estereotipos se preserven visualmente (prefijo `<<Nombre>>`, iconos de plantilla si aplica) para que la salida exportada sea fiel a la vista del modelador.

**Contexto de negocio:**
Export a PDF/SVG es común para documentación, presentaciones, revisiones offline. Los estereotipos son parte crítica del contenido semántico; perderlos degrada el documento. Pregunta abierta §11.6: ¿iconos personalizados se preservan, o solo el texto `<<Nombre>>`?

**Criterios de aceptación:**
- **Dado** que tengo un modelo con estereotipos aplicados, **cuando** exporto a PDF, **entonces** el PDF muestra los prefijos `<<Nombre>>` en los labels.
- **Dado** que exporto a SVG, **cuando** abro el SVG, **entonces** los labels contienen el prefijo.
- **Dado** que los estereotipos tienen iconos personalizados, **cuando** exporto, **entonces** (pregunta abierta) los iconos aparecen o solo el texto.
- **Dado** que exporto el OPD derivado de un estereotipo, **cuando** abro el resultado, **entonces** incluye la descomposición canónica.

**Reglas y restricciones:**
- Prefijo textual siempre.
- Iconos personalizados: pregunta abierta.

**Modelo de datos tocado:**
- Ninguno (export es lente).

**Dependencias:**
- Bloqueada por: HU-A0.010.
- Relaciona: EPICA-60 (export-pdf), EPICA-61 (export-svg).
- Etiqueta: `requires-clarification`.

**Integraciones:**
- Exportadores.

**Notas de evidencia:**
- Fuente OPCloud: §11.6.
- Clase de afirmación: abierto.

**Prioridad:** C.
**Tamaño:** S.
**Etiquetas:** [estereotipo, export, render, pdf, svg, requires-clarification].

---

### HU-A0.039 — Resolver conflicto de esencias forzadas en estereotipos múltiples

**Actor primario:** AD.
**Tipo:** opm-semantica.
**Nivel categórico:** K (validación de consistencia).
**Superficie UI:** modal warning al aplicar segundo estereotipo conflictivo.
**Gesto canónico:** ninguno (automático).

**Historia:**
> Como autor de dominio, quiero que si aplico un segundo estereotipo que fuerza una essence distinta a la del primero, el sistema advierta el conflicto y me ofrezca una política de resolución (último gana, error, warning) para evitar estados inconsistentes.

**Contexto de negocio:**
`Sensor` fuerza physical; un hipotético `Virtual Signal` forzaría informatical. Aplicar ambos a la misma cosa crea conflicto. Pregunta abierta §11.7: ¿error? ¿warning? ¿último gana? Esta HU propone el placeholder para la decisión.

**Criterios de aceptación:**
- **Dado** que `Object 1` tiene `Sensor` aplicado (esencia forzada a physical), **cuando** intento aplicar `Virtual Signal` (que forzaría informatical), **entonces** el sistema muestra warning con opciones: cancelar, aplicar con essence "última gana", aplicar manteniendo la previa.
- **Dado** que elijo "última gana", **cuando** se aplica, **entonces** essence cambia y OPL refleja el nuevo estado.
- **Dado** que elijo "mantener previa", **cuando** se aplica, **entonces** ambos estereotipos conviven pero `esencia_forzada` del segundo se ignora (con marca visual del conflicto).

**Reglas y restricciones:**
- Política configurable (org-level): estricto / permisivo / ask.
- Pregunta abierta §11.7.

**Modelo de datos tocado:**
- `StereotypeApplication.essence_force_honored: bool` — persistente (para conflictos).

**Dependencias:**
- Bloqueada por: HU-A0.023, HU-A0.014.
- Etiqueta: `requires-clarification`.

**Integraciones:**
- Validador del kernel.

**Notas de evidencia:**
- Fuente OPCloud: §11.7.
- Clase de afirmación: abierto.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [estereotipo, kernel, validacion, conflicto, essence, requires-clarification].

---

### HU-A0.040 — Identificar entidad derivada vs creada manualmente

**Actor primario:** AD.
**Tipo:** mixto.
**Nivel categórico:** K (trazabilidad) primario; V (pista visual) secundario.
**Superficie UI:** biblioteca-lateral (badge/icono opcional).
**Gesto canónico:** ninguno.

**Historia:**
> Como autor de dominio, quiero distinguir visualmente en la biblioteca y el canvas las entidades derivadas de un estereotipo (`Cost of Object 1` generada por `Embedded Device Property Set`) de las que yo creé manualmente (un `Cost` que hice drag desde toolbar) para saber qué se va a borrar con `Remove All Components` y qué es trabajo propio.

**Contexto de negocio:**
OPCloud no ofrece marca visual distintiva (§11.5 pregunta abierta). Pero el sistema debe saberlo internamente para el flujo `Unlink and Remove All Components`. Esta HU propone exponer esa trazabilidad al modelador: badge sutil (p.ej. icono de "hereditario") en la entrada de biblioteca y tooltip que revele el estereotipo padre.

**Criterios de aceptación:**
- **Dado** que `Cost of Object 1` es derivada de estereotipo `S`, **cuando** la miro en biblioteca, **entonces** tiene badge sutil o icono indicando origen derivado.
- **Dado** que hago hover en la entrada, **cuando** aparece tooltip, **entonces** indica `Derived from Embedded Device Property Set applied to Object 1`.
- **Dado** que creé manualmente un atributo `Cost` sin estereotipo, **cuando** lo miro, **entonces** no tiene badge de derivada.
- **Dado** que estoy por ejecutar `Remove All Components`, **cuando** miro el prompt de confirmación, **entonces** lista explícitamente las entidades derivadas a eliminar.

**Reglas y restricciones:**
- Trazabilidad interna siempre presente (`thing.derived_from_stereotype: StereotypeApplicationId | null`).
- Exposición visual: pregunta abierta §11.5 (OPCloud no lo muestra).

**Modelo de datos tocado:**
- `thing.derived_from_stereotype: StereotypeApplicationId | null` — persistente.

**Dependencias:**
- Bloqueada por: HU-A0.013.
- Relaciona: HU-A0.026.
- Etiqueta: `requires-clarification`.

**Integraciones:**
- Biblioteca.
- Modal de Remove All Components.

**Notas de evidencia:**
- Fuente OPCloud: §6 ("marca las cosas derivadas como 'heredadas del estereotipo' [hipótesis fuerte]"), §11.5.
- Clase de afirmación: hipótesis + abierto.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [estereotipo, kernel, trazabilidad, derivada, requires-clarification].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **QA0.1** (§11.1) — Concatenación de múltiples estereotipos en mismo label: `<<S1>> <<S2>> T` vs `<<S1, S2>> T` vs último. Cubierta en HU-A0.023.
- **QA0.2** (§11.2) — Reversión de esencia forzada al remover. Cubierta en HU-A0.027.
- **QA0.3** (§11.3) — `Unlink and Remove All Components`: confirmación con detalle. Cubierta en HU-A0.026.
- **QA0.4** (§4.2, §11.4) — Búsqueda en galería: filtrado por tags/categoría además de nombre; combinación con favoritos. Cubierta en HU-A0.004.
- **QA0.5** (§11.5) — Marca visual de atributos heredados de estereotipo vs creados a mano. Cubierta en HU-A0.040.
- **QA0.6** (§11.6) — Export PDF/SVG/OPCAT: preservación de estereotipos con iconos personalizados. Cubierta en HU-A0.038.
- **QA0.7** (§11.7) — Conflicto de esencias forzadas: política. Cubierta en HU-A0.039.
- **QA0.8** (§11.8, §4.4) — Polimorfismo object↔process: filtrado por tipo de cosa en galería. Cubierta en HU-A0.031.
- **QA0.9** (§11.9) — Render read-only: ¿solo afordancia o bloqueo funcional? Cubierta en HU-A0.021.
- **QA0.10** (§11.10) — Icono `011/001/110`: export de código o representación binaria. Cubierta parcialmente en HU-A0.028.
- **QA0.11** (§11.11) — Estereotipos anidados: remoción independiente. Cubierta parcialmente en HU-A0.024 y HU-A0.026.
- **QA0.12** (§11.12) — Administración de plantillas: UI exacta (EPICA-82). Cubierta en HU-A0.034, HU-A0.035.
- **QA0.13** (§1.1) — Origen organizacional vs global: cruce entre organizaciones. Cubierta parcialmente en HU-A0.022, HU-A0.037.
- **QA0.14** (§8) — Shortcuts de teclado para `Set Stereotype`, `Remove Stereotype`, `«s»+`. No cubierta; delegada a EPICA-90.

## Referencias cruzadas

- **Doc fuente:** `opcloud-reverse/a0-extension-stereotypes.md`.
- **Superconcepto:** esta épica define el mecanismo del que **EPICA-A1** (`extension-requirements`) es caso particular. Requirements reusa HU-A0.001–HU-A0.032 y añade sticky-notes, vistas derivadas, satisfacción.
- **Épicas dependientes:**
 - **EPICA-A1** (Requirements como instanciación del mecanismo).
 - **EPICA-B1** (simulación computacional consume notación `[unidad] {símbolo}` de atributos de property-set).
 - **EPICA-82** (config-organization-ontology) provee biblioteca de estereotipos.
 - **EPICA-80** (config-user-org) provee preferencia favoritos por usuario.
 - **EPICA-40** (colaboracion-permisos) gobierna permiso de admin para crear/editar.
 - **EPICA-20** (estructura-opd-tree) gestiona la rama dinámica `Stereotypes`.
 - **EPICA-1B** (canvas-operaciones-bring) interactúa con `Bring Connected Elements` para traer derivadas al SD.
 - **EPICA-60/61** (export PDF/SVG) debe preservar prefijos y OPDs derivados.
 - **EPICA-70** (interop-opcat) interactúa con export de biblioteca.
 - **EPICA-90** (interaccion-shortcuts) puede añadir atajos.
- **Invariantes del repo:**
 - `src/nucleo/tipos.ts` — nueva primitiva `stereotype` y `StereotypeApplication`.
 - `src/nucleo/validacion/` — validadores de compatibilidad, conflictos de essence, anidamientos.
 - `src/nucleo/serializacion/` — serialización estable de aplicaciones y definiciones.
 - `src/render/jointjs/` — builder de label con prefijo, renderer de OPDs derivados read-only.
 - `src/render/opl-renderer.ts` — generador de oraciones OPL con `«»` unicode.
 - `src/ui/` — diálogo `Set Stereotype`, toolbar contextual adaptativa, biblioteca lateral.
 - `docs/ARQUITECTURA-CATEGORICA.md` — posible extensión con ecuación del estereotipo (cómo compone con E1–E13).
- **SSOT OPM:**
 - `ssot/opm-visual-es.md` — convenciones V-xx de prefijo, sombra forzada, caja-estado, borde read-only.
 - `ssot/opm-opl-es.md` — oraciones de aplicación y descomposición.
 - `ssot/opm-iso-19450-es.md` — capítulo extension mechanism (si existe).
