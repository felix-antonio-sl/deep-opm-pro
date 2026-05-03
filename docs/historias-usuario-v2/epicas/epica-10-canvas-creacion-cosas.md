---
epica: "EPICA-10"
titulo: "Canvas — creación de cosas (proceso, objeto, enlace inicial, afiliación, esencia)"
slug: "canvas-creacion-cosas"
doc_fuente: "opcloud-reverse/10-canvas-creacion-cosas.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "M0"
hu_emitidas: 22
hu_canonicas: 17
hu_stubs: 5
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
fuente_modelo: "app/src/modelo/tipos.ts"
---

## 1. Resumen

Cubre el arranque mínimo de modelado OPM: crear procesos y objetos como `entidad`, nombrarlos con diálogo emergente, conectarlos con un enlace básico, y gestionar los dos ejes ontológicos (esencia y afiliación) [V-1]. Todas las HU semánticas se anclan a la SSOT OPM; las afordancias UI heredadas de OPCloud se marcan `opcloud-ui` y pueden divergir.

Tras la refactorización v2: 17 HU canónicas vivas, 5 stubs absorbidos en patrones shared o fusionados.

## 2. Tabla de HU

| ID | Título | Actor | Prioridad | Tamaño | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-10.001 | Crear proceso por arrastre desde barra principal | MN | M0 | M | opm-semantica | [V-1] [Glos 3.58] |
| HU-10.002 | Crear objeto por arrastre desde barra principal | MN | M0 | M | opm-semantica | [V-1] [Glos 3.39] |
| HU-10.003 | Nombrar cosa recién creada con diálogo emergente | MN | M0 | S | mixto | [Glos 3.76] |
| HU-10.004 | Editar descripción opcional | MN | S | XS | opcloud-ui | — |
| HU-10.005 | Confirmar nombre con Enter o botón [fusionada en HU-10.003] | — | — | — | — | — |
| HU-10.006 | Preservar capitalización exacta desactivando Auto Format | ME | M1 | XS | opcloud-ui | — |
| HU-10.007 | Iniciar enlace desde borde de cosa | MN | M0 | M | opm-semantica | [V-61] |
| HU-10.008 | Ver solo tipos de enlace válidos en tabla | MN | M0 | M | opm-semantica | [V-239] [V-240] |
| HU-10.009 | Ver previsualización OPL-ES por tipo de enlace | MN | M1 | S | mixto | [OPL-ES T1] [OPL-ES T2] [OPL-ES T3] |
| HU-10.010 | Filtrar agente cuando objeto no es físico | ME | M1 | S | opm-semantica | [Glos 3.3] [V-1] |
| HU-10.011 | Confirmar tipo de enlace y cerrar tabla | MN | M0 | XS | opm-semantica | [V-61] |
| HU-10.012 | Cambiar afiliación con alternador instantáneo | MN | M0 | S | opm-semantica | [V-1] [Glos 3.5] |
| HU-10.013 | Cambiar esencia con alternador instantáneo | MN | M0 | S | opm-semantica | [V-1] [V-124] |
| HU-10.014 | Ver distinción visual de esencia física | MN | M0 | XS | opm-semantica | [V-124] [JOYAS §1] |
| HU-10.015 | Ver distinción visual de afiliación ambiental | MN | M0 | XS | opm-semantica | [V-1] [JOYAS §1] |
| HU-10.016 | Ver eco OPL-ES al crear cosa [absorbida en HU-SHARED-007] | — | — | — | — | — |
| HU-10.017 | Ver cosa en biblioteca lateral | MN | M1 | S | opcloud-ui | — |
| HU-10.018 | Ver cosa en navegador OPD | MN | M1 | XS | opcloud-ui | — |
| HU-10.019 | Abrir menú contextual de cosa [absorbida en HU-SHARED-001] | — | — | — | — | — |
| HU-10.020 | Acceder acciones del menú contextual [absorbida en HU-SHARED-001] | — | — | — | — | — |
| HU-10.021 | Descomposición de objeto en el mismo diagrama | ME | C | M | opcloud-ui | — |
| HU-10.022 | Ver indicador de modelo no guardado [absorbida en HU-SHARED-006] | — | — | — | — | — |

Total: 22 IDs, 17 canónicas vivas, 5 stubs.

## 3. Historias de usuario

### HU-10.001 — Crear proceso por arrastre desde barra principal

**Actor primario:** MN (modelador novato).
**Actores secundarios:** ME.
**Tipo:** opm-semantica.
**Nivel categórico:** K primario; V, U secundarios.
**Superficie UI:** barra principal + canvas-OPD + diálogo de nombre.
**Gesto canónico:** arrastrar el icono de proceso desde la barra hasta una posición del canvas.

**Historia:**
> Como modelador novato, quiero arrastrar el icono de proceso desde la barra al canvas para crear un proceso OPM con un solo gesto y nombrarlo de inmediato.

**Contexto de negocio:**
El arranque del modelado es el momento más frágil de la adopción. La SSOT [Glos 3.58] define proceso como transformación de uno o más objetos. OPCloud implementa la creación por arrastre desde la barra; un solo gesto que combina creación con invitación a nombrar reduce la fricción cognitiva.

**Criterios de aceptación:**
- **Dado** que estoy en un OPD vacío o con otros elementos, **cuando** arrastro el icono de proceso desde la barra hasta una posición `(x, y)`, **entonces** se crea una `entidad` con `tipo = "proceso"`, `esencia = "informacional"`, `afiliacion = "sistemica"`, `nombre = "Un Proceso"` (o `"Un Proceso N"` si colisiona, ver HU-SHARED-009), y una `apariencia` con `(x, y)`, `width = 135`, `height = 60`. [V-1] [JOYAS §2]
- **Dado** que se creó la entidad, **cuando** se renderiza, **entonces** se abre automáticamente el diálogo de nombre (HU-10.003) con el texto preseleccionado.
- **Dado** que se creó la entidad, **cuando** consulto el panel OPL-ES, **entonces** aparece la oración: `*Un Proceso* es un proceso informacional y sistémico.` [OPL-ES D1]
- **Dado** que el modo es read-only, **cuando** intento arrastrar, **entonces** la creación es no-op (HU-SHARED-003).

**Reglas y restricciones:**
- Defectos de creación: `esencia = "informacional"`, `afiliacion = "sistemica"`. [V-1]
- Dimensiones canónicas: `apariencia.width = 135`, `apariencia.height = 60`. [JOYAS §2]
- Render: borde `#3BC3FF` (cyan), fondo `#fdffff`, tipografía Arial 14px semibold, `text-anchor: middle`. [JOYAS §1, §3]
- El gesto es arrastre, no clic simple.
- La operación entra al stack undo (HU-SHARED-002) como una sola operación reversible.

**Modelo de datos tocado:**
- `entidad.id` — `Id` — persistente.
- `entidad.tipo` — `"proceso"` — persistente.
- `entidad.nombre` — `string` — persistente.
- `entidad.afiliacion` — `"sistemica"` (defecto) — persistente.
- `entidad.esencia` — `"informacional"` (defecto) — persistente.
- `apariencia.id` — `Id` — persistente.
- `apariencia.entidadId` — referencia — persistente.
- `apariencia.opdId` — referencia — persistente.
- `apariencia.x`, `apariencia.y`, `apariencia.width`, `apariencia.height` — `number` — persistentes.
- `modelo.nextSeq` — incremento si se aplica sufijo serial.

**Patrones aplicados:**
- HU-SHARED-002 (entra al stack undo).
- HU-SHARED-003 (read-only bloquea).
- HU-SHARED-006 (activa dirty state).
- HU-SHARED-007 (panel OPL-ES emite oración).
- HU-SHARED-009 (validación nominal y sufijo serial).

**Dependencias:**
- Bloquea a: HU-10.002, HU-10.007, HU-10.012, HU-10.013.

**Integraciones:**
- Panel OPL-ES, biblioteca lateral, navegador OPD.

**Notas de evidencia:**
- Fuente normativa: [Glos 3.58] proceso; [V-1] valores por defecto.
- Fuente OPCloud: `opcloud-reverse/10-canvas-creacion-cosas.md` §3.1, §5.1, §9.
- Frames: frame_00011, frame_00015, frame_00018.
- Evidencia visual: [JOYAS §1] colores, [JOYAS §2] dimensiones, [JOYAS §3] tipografía.
- Clase de afirmación: confirmado por SSOT + observado.

**Prioridad:** M0.
**Tamaño:** M.
**Etiquetas:** [canvas, kernel, proceso, creacion].

---

### HU-10.002 — Crear objeto por arrastre desde barra principal

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** opm-semantica.
**Nivel categórico:** K primario; V, U secundarios.
**Superficie UI:** barra principal + canvas-OPD + diálogo de nombre.
**Gesto canónico:** arrastrar el icono de objeto desde la barra hasta una posición del canvas.

**Historia:**
> Como modelador, quiero arrastrar el icono de objeto desde la barra al canvas para crear un objeto OPM con la misma mecánica que para procesos.

**Contexto de negocio:**
La SSOT [Glos 3.39] define objeto como elemento del modelo con existencia (potencial o real), física o informacional. La simetría de gesto con HU-10.001 reduce la carga cognitiva. Procesos y objetos son las dos primitivas fundamentales de OPM y deben tratarse con afordancias paralelas.

**Criterios de aceptación:**
- **Dado** que estoy en el canvas, **cuando** arrastro el icono de objeto desde la barra hasta `(x, y)`, **entonces** se crea una `entidad` con `tipo = "objeto"`, `esencia = "informacional"`, `afiliacion = "sistemica"`, `nombre = "Un Objeto"` (o serial), y una `apariencia` con `(x, y)`, `width = 135`, `height = 60`. [V-1] [JOYAS §2]
- **Dado** que se creó la entidad, **cuando** se renderiza, **entonces** se abre el diálogo de nombre.
- **Dado** que se creó la entidad, **cuando** consulto el panel OPL-ES, **entonces** aparece: `**Un Objeto** es un objeto informacional y sistémico.` [OPL-ES D1]
- **Dado** que se creó la entidad, **cuando** consulto la biblioteca lateral, **entonces** aparece la entrada (HU-10.017).
- **Dado** que el modo es read-only, **cuando** intento arrastrar, **entonces** la creación es no-op.

**Reglas y restricciones:**
- Defectos idénticos a HU-10.001: `esencia = "informacional"`, `afiliacion = "sistemica"`. [V-1]
- Dimensiones idénticas: 135 × 60. [JOYAS §2]
- Borde `#70E483` (verde lima), fondo `#fdffff`. [JOYAS §1]
- El rectángulo admite sombreado canónico cuando `esencia = "fisica"`. [V-124]

**Modelo de datos tocado:**
- Igual que HU-10.001 con `entidad.tipo = "objeto"`.

**Patrones aplicados:**
- HU-SHARED-002, HU-SHARED-003, HU-SHARED-006, HU-SHARED-007, HU-SHARED-009.

**Dependencias:**
- Bloqueada por: HU-10.001 (comparte mecánica del diálogo).

**Integraciones:**
- Idénticas a HU-10.001.

**Notas de evidencia:**
- Fuente normativa: [Glos 3.39] objeto; [V-1] valores por defecto; [V-124] sombreado.
- Fuente OPCloud: `opcloud-reverse/10-canvas-creacion-cosas.md` §3.2, §9.
- Evidencia visual: [JOYAS §1, §2].
- Clase de afirmación: confirmado por SSOT + observado.

**Prioridad:** M0.
**Tamaño:** M.
**Etiquetas:** [canvas, kernel, objeto, creacion].

---

### HU-10.003 — Nombrar cosa recién creada con diálogo emergente

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** mixto.
**Nivel categórico:** U primario; K secundario (propaga a `entidad.nombre`).
**Superficie UI:** diálogo de nombre.
**Gesto canónico:** escribir en campo + `Enter`, botón "Aceptar" o `Esc` para cancelar.

**Historia:**
> Como modelador, quiero escribir el nombre de la cosa en el diálogo automático para asignar identidad semántica apenas la creo.

**Contexto de negocio:**
La SSOT [Glos 3.76] exige que cada cosa tenga un nombre. El diálogo inmediato post-creación elimina la tentación de dejar cosas con nombre por defecto, que deterioran la legibilidad del modelo y la calidad OPL. La SSOT no prescribe la mecánica del diálogo; OPCloud implementa un popup inline como afordance efectiva.

**Criterios de aceptación:**
- **Dado** que el diálogo está abierto tras crear una cosa, **cuando** escribo texto, **entonces** la etiqueta visual de la apariencia se actualiza en vivo.
- **Dado** que el diálogo está abierto, **cuando** confirmo con `Enter`, **entonces** la validación nominal (HU-SHARED-009) se ejecuta y, si es válida, `entidad.nombre` se persiste y el diálogo se cierra.
- **Dado** que el diálogo está abierto, **cuando** clico el botón "Aceptar", **entonces** el comportamiento es idéntico al `Enter`.
- **Dado** que confirmé el nombre, **cuando** consulto canvas, panel OPL-ES y biblioteca lateral, **entonces** los tres muestran el nombre asignado.
- **Dado** que el diálogo está abierto, **cuando** cancelo (`Esc` o clic fuera), **entonces** el nombre por defecto (`Un Proceso`, `Un Objeto`) se mantiene y el diálogo se cierra.
- **Dado** que el nombre escrito viola la validación nominal, **cuando** confirmo, **entonces** se muestra el mensaje de error y el foco vuelve al campo.

**Reglas y restricciones:**
- El diálogo se ancla visualmente a la apariencia recién creada.
- El campo acepta texto libre; las reglas de unicidad se delegan a HU-SHARED-009.
- El diálogo no oscurece el canvas completo.
- Por defecto el campo viene preseleccionado (selección de todo el texto) para sobrescritura rápida.

**Modelo de datos tocado:**
- `entidad.nombre` — `string` — persistente (tras confirmar).

**Patrones aplicados:**
- HU-SHARED-009 (validación nominal).
- HU-SHARED-002 (entra al stack undo).

**Dependencias:**
- Bloqueada por: HU-10.001 o HU-10.002 (entidad debe existir).

**Integraciones:**
- Panel OPL-ES (HU-SHARED-007).
- Biblioteca lateral (HU-10.017).
- Navegador OPD (HU-10.018).

**Notas de evidencia:**
- Fuente normativa: [Glos 3.76] cosa nombrada.
- Fuente OPCloud: §3.1, §5.1; frame_00011.
- Clase de afirmación: observado + canonizado. La SSOT no prescribe el mecanismo; esta HU hereda la solución OPCloud.

**Prioridad:** M0.
**Tamaño:** S.
**Etiquetas:** [canvas, ui, dialogo-nombre].

---

### HU-10.004 — Editar descripción opcional

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** K primario (campo nuevo `[propuesta]`); U secundario.
**Superficie UI:** diálogo de nombre (campo "Descripción").
**Gesto canónico:** escribir en campo "Descripción" del diálogo.

**Historia:**
> Como modelador, quiero agregar una descripción textual a la cosa desde el diálogo para documentar su semántica sin salir del flujo.

**Contexto de negocio:**
Documentación inline es útil en modelos técnicos. OPCloud expone un campo `Description` opcional en el diálogo de nombre. La SSOT no exige descripción — es una conveniencia de OPCloud. Puede omitirse o diferirse sin afectar la conformidad OPM.

**Criterios de aceptación:**
- **Dado** que el diálogo está abierto, **cuando** escribo en el campo "Descripción", **entonces** el texto se preserva y al confirmar se persiste en `entidad.descripcion` `[propuesta]`.
- **Dado** que la descripción está vacía, **cuando** confirmo, **entonces** la entidad no almacena `descripcion` (campo ausente, no string vacío).
- **Dado** que la descripción tiene texto, **cuando** consulto la entidad después, **entonces** la descripción es recuperable (en tooltip, panel lateral o inspector — donde se decida; ver Q10.1).

**Reglas y restricciones:**
- El campo es opcional; vacío es válido.
- Longitud máxima orientativa: 1.000 caracteres.
- La descripción no aparece en el panel OPL-ES (no es parte de la lente textual canónica).

**Modelo de datos tocado:**
- `entidad.descripcion` `[propuesta]` — `string` opcional — persistente.

**Patrones aplicados:**
- HU-SHARED-002 (entra al stack undo).

**Dependencias:**
- Bloqueada por: HU-10.003 (diálogo abierto).

**Integraciones:**
- Inspector / tooltip (a definir; ver Q10.1).

**Notas de evidencia:**
- Fuente OPCloud: campo `Description` observable en sandbox.
- Clase de afirmación: observado; OPM no exige.

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [canvas, ui, descripcion, propuesta].

---

### HU-10.005 — Confirmar nombre con Enter o botón [fusionada en HU-10.003]

**Estado:** fusionada (2026-05-03).
**Canónica:** HU-10.003 §criterios de aceptación (Enter y botón "Aceptar" como afordances de confirmación equivalentes).
**Razón:** subset de HU-10.003 (variante de gesto, no nivel de HU separable).

---

### HU-10.006 — Preservar capitalización exacta desactivando Auto Format

**Actor primario:** ME.
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** K primario (afecta el nombre persistido); U secundario (toggle).
**Superficie UI:** diálogo de nombre (checkbox "Auto Format").
**Gesto canónico:** desmarcar el checkbox antes de confirmar.

**Historia:**
> Como modelador experto, quiero desactivar la capitalización automática para preservar exactamente el casing que escribo (ej. `OnStar`, `iPhone`, `gRPC`).

**Contexto de negocio:**
OPCloud aplica title-case a los nombres por defecto, lo cual rompe identificadores con capitalización significativa (siglas, marcas, identificadores técnicos). El checkbox "Auto Format" permite preservar el texto exacto. La SSOT no prescribe política de capitalización.

**Criterios de aceptación:**
- **Dado** que el diálogo está abierto y "Auto Format" está activado (default), **cuando** escribo `onstar` y confirmo, **entonces** `entidad.nombre = "Onstar"` (title-case).
- **Dado** que el diálogo está abierto y "Auto Format" está desactivado, **cuando** escribo `OnStar` y confirmo, **entonces** `entidad.nombre = "OnStar"` exactamente.
- **Dado** que creo varias cosas seguidas con "Auto Format" desactivado, **cuando** confirmo cada una, **entonces** todas preservan el casing exacto sin requerir desactivar el checkbox repetidamente (preferencia recordada en la sesión).
- **Dado** que el modelador cierra y reabre el modelador, **cuando** crea una cosa nueva, **entonces** el checkbox vuelve al default activado (preferencia no persiste entre sesiones; ver Q10.6).

**Reglas y restricciones:**
- La normalización de espacios y trim se aplica siempre (HU-SHARED-009), independientemente del estado del checkbox.
- La verificación de unicidad se aplica con comparación case-insensitive en ambos casos.
- El checkbox es por sesión, no por modelo.

**Modelo de datos tocado:**
- `entidad.nombre` — `string` (con casing preservado o normalizado).
- `ui.autoFormatActivo: boolean` — transitorio, sesión.

**Patrones aplicados:**
- HU-SHARED-009 (normalización + unicidad).

**Dependencias:**
- Bloqueada por: HU-10.003 (diálogo).

**Notas de evidencia:**
- Fuente OPCloud: checkbox "Auto Format" observable.
- Clase de afirmación: observado; OPM no exige.
- Nota: HU-11.002 (caso batch) se absorbe en esta HU al refactorizar EPICA-11; el comportamiento batch es consecuencia de la preferencia de sesión.

**Prioridad:** M1.
**Tamaño:** XS.
**Etiquetas:** [canvas, ui, capitalizacion, auto-format].

---

### HU-10.007 — Iniciar enlace desde borde de cosa

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categórico:** K primario; V, U secundarios.
**Superficie UI:** canvas-OPD.
**Gesto canónico:** apuntar al borde de la apariencia hasta que aparece un magnet, arrastrar hacia el destino.

**Historia:**
> Como modelador, quiero iniciar un enlace arrastrando desde el borde de una cosa hasta otra para conectarlas con un solo gesto.

**Contexto de negocio:**
La SSOT [V-61] define el enlace como conexión visible entre dos cosas. OPCloud implementa el inicio del enlace mediante puertos magnéticos en el borde de las apariencias [JOYAS §7].

**Criterios de aceptación:**
- **Dado** que paso el cursor sobre una apariencia, **cuando** me acerco a su borde, **entonces** aparece un puerto magnético (radio 2px, transparente). [JOYAS §7]
- **Dado** que el puerto magnético es visible, **cuando** arrastro desde él hasta otra apariencia destino, **entonces** se crea una `aparienciaEnlace` provisional siguiendo el cursor con routing manhattan. [JOYAS §6]
- **Dado** que suelto sobre una apariencia destino, **cuando** la operación termina, **entonces** se abre la tabla de tipos de enlace (HU-10.008) con los tipos válidos según el par origen/destino.
- **Dado** que suelto sobre zona vacía, **cuando** la operación termina, **entonces** se cancela la creación y la apariencia provisional desaparece.
- **Dado** que el modo es read-only, **cuando** intento arrastrar desde el puerto, **entonces** la operación es no-op.

**Reglas y restricciones:**
- Los puertos viven en `port-group: "aaa"` con `magnet: true`, `r: 2`. [JOYAS §7]
- El routing del enlace provisional es manhattan con `padding: 5`, `step: 11`. [JOYAS §6]
- El enlace usa el patrón wrapper+line: wrapper transparente de 15px (hit area) + línea visible de 2px en `#586D8C`. [JOYAS §4]
- La creación final del `enlace` se efectúa al confirmar tipo (HU-10.011), no al soltar.

**Modelo de datos tocado:**
- `aparienciaEnlace.id`, `aparienciaEnlace.enlaceId`, `aparienciaEnlace.opdId`, `aparienciaEnlace.vertices` — persistentes (tras confirmar).
- `enlace.id`, `enlace.tipo`, `enlace.origenId`, `enlace.destinoId`, `enlace.etiqueta` — persistentes (tras confirmar).

**Patrones aplicados:**
- HU-SHARED-002 (la creación final entra al stack).
- HU-SHARED-003 (read-only bloquea).
- HU-SHARED-006 (activa dirty).

**Dependencias:**
- Bloqueada por: HU-10.001, HU-10.002 (al menos dos entidades existentes).
- Bloquea a: HU-10.008, HU-10.011.

**Integraciones:**
- Tabla de tipos de enlace (HU-10.008).
- Panel OPL-ES (HU-SHARED-007 emite oración tras confirmar).

**Notas de evidencia:**
- Fuente normativa: [V-61] enlace canónico.
- Fuente OPCloud: §4.1; frame_00029.
- Evidencia visual: [JOYAS §4, §6, §7].
- Clase de afirmación: confirmado por SSOT + observado.

**Prioridad:** M0.
**Tamaño:** M.
**Etiquetas:** [canvas, kernel, enlace, creacion].

---

### HU-10.008 — Ver solo tipos de enlace válidos en tabla

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categórico:** K primario; U secundario.
**Superficie UI:** tabla de tipos de enlace.
**Gesto canónico:** consecuencia de soltar el enlace (HU-10.007); inspeccionar la tabla.

**Historia:**
> Como modelador, quiero ver solo los tipos de enlace válidos para el par origen/destino que conecté para no elegir uno semánticamente imposible.

**Contexto de negocio:**
La SSOT define las cinco familias canónicas de enlaces estructurales [V-239] y los enlaces procedurales [V-240], cada una con reglas sobre qué cosas puede conectar. La tabla de tipos en OPCloud filtra dinámicamente los inválidos para el par actual.

**Criterios de aceptación:**
- **Dado** que solté un enlace provisional entre dos apariencias, **cuando** la tabla se renderiza, **entonces** solo aparecen tipos de enlace válidos para el par `(entidad.origen.tipo, entidad.destino.tipo)`.
- **Dado** que origen y destino son procesos, **cuando** la tabla se renderiza, **entonces** aparecen `invocación`, `auto-invocación` y enlaces de generalización-especialización entre procesos. [V-240]
- **Dado** que origen es proceso y destino es objeto, **cuando** la tabla se renderiza, **entonces** aparecen `consumo`, `efecto`, `resultado`. [V-240]
- **Dado** que origen es objeto y destino es proceso, **cuando** la tabla se renderiza, **entonces** aparecen `agente`, `instrumento`. [V-240]
- **Dado** que ambos son objetos o ambos son procesos del mismo nivel, **cuando** la tabla se renderiza, **entonces** aparecen las cinco familias estructurales: agregación-participación, exhibición-característica, generalización-especialización, clasificación-instanciación, etiquetado. [V-239]

**Reglas y restricciones:**
- El filtrado es derivado de la SSOT, no configurable.
- Filtros adicionales por afiliación/esencia se aplican como sub-filtros (ver HU-10.010).

**Modelo de datos tocado:**
- Lente derivada; no persiste hasta confirmación.

**Patrones aplicados:**
- HU-SHARED-003 (read-only nunca llega aquí; el flujo está bloqueado en HU-10.007).

**Dependencias:**
- Bloqueada por: HU-10.007.
- Bloquea a: HU-10.011.

**Notas de evidencia:**
- Fuente normativa: [V-239] cinco familias estructurales; [V-240] enlaces procedurales.
- Fuente OPCloud: §4.2.
- Clase de afirmación: confirmado por SSOT + observado.

**Prioridad:** M0.
**Tamaño:** M.
**Etiquetas:** [canvas, kernel, enlace, validacion].

---

### HU-10.009 — Ver previsualización OPL-ES por tipo de enlace

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** mixto.
**Nivel categórico:** L primario; U secundario.
**Superficie UI:** tabla de tipos de enlace (columna OPL).
**Gesto canónico:** pasar el cursor o seleccionar una fila de la tabla.

**Historia:**
> Como modelador novato, quiero ver la oración OPL-ES que generaría cada tipo de enlace antes de confirmarlo, para elegir el que expresa la semántica que busco.

**Contexto de negocio:**
La OPL-ES es la lente textual canónica del modelo. Mostrar la oración previa a confirmar el enlace es un afordance pedagógico de OPCloud que reduce el costo de equivocarse. La SSOT define las plantillas pero no la previsualización.

**Criterios de aceptación:**
- **Dado** que la tabla está abierta, **cuando** paso el cursor sobre una fila, **entonces** se muestra la oración OPL-ES con los nombres de origen y destino sustituidos.
- **Dado** que la fila es "agente", **cuando** se renderiza, **entonces** muestra `**Origen** maneja *Destino*.` [OPL-ES T1]
- **Dado** que la fila es "consumo", **cuando** se renderiza, **entonces** muestra `*Origen* consume **Destino**.` [OPL-ES T1]
- **Dado** que la fila es "agregación-participación", **cuando** se renderiza, **entonces** muestra `**Todo** consiste en **Parte**.`
- **Dado** que cambio el cursor a otra fila, **cuando** la previsualización se actualiza, **entonces** la oración refleja la nueva selección.

**Reglas y restricciones:**
- Las plantillas son las de SSOT (T1–T3, D1–D13, TS1–TS5, etc.).
- Las convenciones tipográficas se respetan: **negrita** objetos, *cursiva* procesos, `monoespaciado` estados.

**Modelo de datos tocado:**
- Lente derivada; no persiste.

**Patrones aplicados:**
- HU-SHARED-007 (formato de oraciones).

**Dependencias:**
- Bloqueada por: HU-10.008.

**Notas de evidencia:**
- Fuente normativa: [OPL-ES T1], [OPL-ES T2], [OPL-ES T3], [OPL-ES T1].
- Fuente OPCloud: §4.2 (preview).
- Clase de afirmación: observado + confirmado por SSOT (plantillas).

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [canvas, opl, ux, pedagogico].

---

### HU-10.010 — Filtrar agente cuando objeto no es físico

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel categórico:** K primario.
**Superficie UI:** tabla de tipos de enlace.
**Gesto canónico:** observación pasiva del filtrado.

**Historia:**
> Como modelador experto, quiero que el tipo "agente" se oculte automáticamente cuando el objeto origen no es físico, porque solo entidades físicas pueden ser agentes humanos.

**Contexto de negocio:**
La SSOT [Glos 3.3] define agente como habilitador humano, lo que implica `entidad.esencia = "fisica"`. Conectar un objeto informacional como agente sería semánticamente inválido. OPCloud filtra dinámicamente.

**Criterios de aceptación:**
- **Dado** que origen es un objeto con `esencia = "informacional"` y destino es un proceso, **cuando** la tabla se renderiza, **entonces** "agente" no aparece en la lista.
- **Dado** que origen es un objeto con `esencia = "fisica"` y destino es un proceso, **cuando** la tabla se renderiza, **entonces** "agente" aparece en la lista.
- **Dado** que cambio la esencia del origen a "fisica" mientras la tabla está abierta, **cuando** se actualiza, **entonces** "agente" reaparece.
- **Dado** que el origen es un proceso, **cuando** la tabla se renderiza, **entonces** "agente" no aparece (regla independiente: agentes son objetos).

**Reglas y restricciones:**
- El filtro es derivado de la SSOT; no configurable.
- "Instrumento" no se filtra por esencia (puede ser informacional o físico). [Glos 3.35]

**Modelo de datos tocado:**
- Lente derivada de `entidad.esencia` y `entidad.tipo`.

**Dependencias:**
- Bloqueada por: HU-10.008.

**Notas de evidencia:**
- Fuente normativa: [Glos 3.3] agente como habilitador humano; [V-1] esencia.
- Fuente OPCloud: §4.2.
- Clase de afirmación: confirmado por SSOT.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [canvas, kernel, validacion, agente].

---

### HU-10.011 — Confirmar tipo de enlace y cerrar tabla

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categórico:** K primario; U secundario.
**Superficie UI:** tabla de tipos de enlace.
**Gesto canónico:** clic en una fila + botón "Aceptar" o doble clic en la fila.

**Historia:**
> Como modelador, quiero seleccionar un tipo de enlace en la tabla y confirmarlo para crear el enlace persistente con su semántica.

**Contexto de negocio:**
La confirmación cierra el ciclo iniciado en HU-10.007. Es el momento en que el `enlace` y su `aparienciaEnlace` se persisten en `modelo.enlaces` y `opd.enlaces`.

**Criterios de aceptación:**
- **Dado** que selecciono una fila y clico "Aceptar" (o doble clic en la fila), **cuando** la operación termina, **entonces** se crea un `enlace` con `tipo` correspondiente, `origenId` y `destinoId` referidos, `etiqueta = ""`, y una `aparienciaEnlace` con `vertices` calculados por routing manhattan.
- **Dado** que el enlace se creó, **cuando** se renderiza, **entonces** aparece en el canvas con wrapper+line y el panel OPL-ES emite la oración correspondiente.
- **Dado** que la tabla está abierta, **cuando** clico "Cancelar" o `Esc`, **entonces** no se crea enlace y la apariencia provisional de HU-10.007 desaparece.
- **Dado** que la creación entra al stack, **cuando** invoco deshacer (HU-SHARED-002), **entonces** el enlace y su apariencia se eliminan.

**Reglas y restricciones:**
- Una sola operación de undo elimina el enlace y la apariencia (atomicidad).

**Modelo de datos tocado:**
- `enlace.id`, `enlace.tipo`, `enlace.origenId`, `enlace.destinoId`, `enlace.etiqueta` — persistentes.
- `aparienciaEnlace.id`, `aparienciaEnlace.enlaceId`, `aparienciaEnlace.opdId`, `aparienciaEnlace.vertices` — persistentes.

**Patrones aplicados:**
- HU-SHARED-002, HU-SHARED-006, HU-SHARED-007.

**Dependencias:**
- Bloqueada por: HU-10.007, HU-10.008.

**Notas de evidencia:**
- Fuente normativa: [V-61] enlace canónico.
- Fuente OPCloud: §4.3.
- Clase de afirmación: confirmado + observado.

**Prioridad:** M0.
**Tamaño:** XS.
**Etiquetas:** [canvas, kernel, enlace, confirmacion].

---

### HU-10.012 — Cambiar afiliación con alternador instantáneo

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categórico:** K primario; V, U secundarios.
**Superficie UI:** menú contextual de cosa (HU-SHARED-001) o atajo.
**Gesto canónico:** acción "Sistémica ↔ Ambiental" en menú contextual.

**Historia:**
> Como modelador, quiero alternar la afiliación de una cosa entre sistémica y ambiental con un solo gesto para reflejar si pertenece al sistema o a su entorno.

**Contexto de negocio:**
La SSOT [V-1] define afiliación como uno de los dos ejes ontológicos de toda cosa. Sistémica = interna al sistema; ambiental = externa. [Glos 3.5] El cambio debe ser reversible y propagar al render visual y al panel OPL-ES.

**Criterios de aceptación:**
- **Dado** que selecciono una entidad y elijo "Cambiar a ambiental" en el menú contextual, **cuando** la operación termina, **entonces** `entidad.afiliacion = "ambiental"` y la apariencia se rerrenderiza con borde discontinuo (HU-10.015).
- **Dado** que la entidad ahora es ambiental, **cuando** el panel OPL-ES se actualiza (HU-SHARED-007), **entonces** la oración cambia a `**Nombre** es un objeto informacional y ambiental.` [OPL-ES D1]
- **Dado** que invoco la acción inversa, **cuando** la operación termina, **entonces** `entidad.afiliacion = "sistemica"` y el render vuelve al borde continuo.
- **Dado** que el modo es read-only, **cuando** intento alternar, **entonces** la acción no aparece en el menú contextual.

**Reglas y restricciones:**
- El cambio entra al stack undo (HU-SHARED-002).
- La afiliación se renderiza como borde continuo (sistémica) o discontinuo (ambiental). [V-1]

**Modelo de datos tocado:**
- `entidad.afiliacion: "sistemica" | "ambiental"` — persistente.

**Patrones aplicados:**
- HU-SHARED-001, HU-SHARED-002, HU-SHARED-003, HU-SHARED-006, HU-SHARED-007.

**Dependencias:**
- Bloqueada por: HU-10.001 o HU-10.002 (entidad existente).

**Notas de evidencia:**
- Fuente normativa: [V-1] afiliación; [Glos 3.5] ambiental.
- Fuente OPCloud: §6.1.
- Clase de afirmación: confirmado + observado.

**Prioridad:** M0.
**Tamaño:** S.
**Etiquetas:** [canvas, kernel, afiliacion, alternador].

---

### HU-10.013 — Cambiar esencia con alternador instantáneo

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categórico:** K primario; V, U secundarios.
**Superficie UI:** menú contextual o atajo.
**Gesto canónico:** acción "Informacional ↔ Física" en menú contextual.

**Historia:**
> Como modelador, quiero alternar la esencia de una cosa entre informacional y física con un solo gesto para reflejar la naturaleza de su existencia.

**Contexto de negocio:**
La SSOT [V-1] define esencia como el segundo eje ontológico. Informacional = información pura; física = existencia material. [V-124] La esencia física se distingue por sombreado canónico.

**Criterios de aceptación:**
- **Dado** que selecciono una entidad y elijo "Cambiar a física" en el menú contextual, **cuando** la operación termina, **entonces** `entidad.esencia = "fisica"` y la apariencia se rerrenderiza con sombreado (HU-10.014).
- **Dado** que la entidad ahora es física, **cuando** el panel OPL-ES se actualiza, **entonces** la oración cambia a `**Nombre** es un objeto físico y sistémico.`
- **Dado** que invoco la acción inversa, **cuando** la operación termina, **entonces** `entidad.esencia = "informacional"` y el sombreado desaparece.

**Reglas y restricciones:**
- El cambio entra al stack undo.
- La esencia física se renderiza con sombreado canónico [V-124]; informacional sin sombreado.
- Cambiar a "informacional" en un objeto que es agente de un proceso podría requerir desconectar el agente (ver HU-10.010); en ese caso, el cambio se ofrece con confirmación o se bloquea con explicación (ver Q10.4).

**Modelo de datos tocado:**
- `entidad.esencia: "informacional" | "fisica"` — persistente.

**Patrones aplicados:**
- HU-SHARED-001, HU-SHARED-002, HU-SHARED-003, HU-SHARED-006, HU-SHARED-007.

**Dependencias:**
- Bloqueada por: HU-10.001 o HU-10.002.

**Notas de evidencia:**
- Fuente normativa: [V-1] esencia; [V-124] sombreado físico.
- Fuente OPCloud: §6.2.
- Clase de afirmación: confirmado + observado.

**Prioridad:** M0.
**Tamaño:** S.
**Etiquetas:** [canvas, kernel, esencia, alternador].

---

### HU-10.014 — Ver distinción visual de esencia física

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categórico:** V primario; K secundario.
**Superficie UI:** canvas-OPD.
**Gesto canónico:** observación pasiva.

**Historia:**
> Como modelador, quiero distinguir visualmente las cosas físicas de las informacionales para reconocer la naturaleza de cada cosa de un vistazo.

**Contexto de negocio:**
La SSOT [V-124] establece el sombreado como canal semántico para esencia: las cosas físicas tienen sombreado canónico, las informacionales no. La distinción es normativa, no estética.

**Criterios de aceptación:**
- **Dado** que `entidad.esencia = "fisica"`, **cuando** la apariencia se renderiza, **entonces** el rectángulo (objeto) o elipse (proceso) muestra sombreado canónico (drop-shadow).
- **Dado** que `entidad.esencia = "informacional"`, **cuando** la apariencia se renderiza, **entonces** el rectángulo o elipse no muestra sombreado.
- **Dado** que cambio la esencia (HU-10.013), **cuando** la operación termina, **entonces** el render se actualiza en el siguiente frame.

**Reglas y restricciones:**
- El sombreado usa `feDropShadow` o fallback `feGaussianBlur + feOffset`. [JOYAS §8]
- Parámetros canónicos del drop-shadow: definidos en `app/src/ui/render/sombras.ts` `[propuesta]` o equivalente, alineados con OPCloud.

**Modelo de datos tocado:**
- Render derivado de `entidad.esencia`; no persiste.

**Notas de evidencia:**
- Fuente normativa: [V-124] sombreado canónico; [V-125], [V-126], [V-127] (subreglas de aplicación).
- Fuente OPCloud: módulo `28258.js` drop-shadow. [JOYAS §8]
- Clase de afirmación: confirmado por SSOT + observado.

**Prioridad:** M0.
**Tamaño:** XS.
**Etiquetas:** [canvas, render, esencia].

---

### HU-10.015 — Ver distinción visual de afiliación ambiental

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categórico:** V primario; K secundario.
**Superficie UI:** canvas-OPD.
**Gesto canónico:** observación pasiva.

**Historia:**
> Como modelador, quiero distinguir visualmente las cosas ambientales de las sistémicas para identificar fronteras del sistema.

**Contexto de negocio:**
La SSOT [V-1] define el borde discontinuo como canal semántico para afiliación: las cosas ambientales tienen borde discontinuo, las sistémicas borde continuo.

**Criterios de aceptación:**
- **Dado** que `entidad.afiliacion = "ambiental"`, **cuando** la apariencia se renderiza, **entonces** el contorno usa stroke-dasharray (típicamente `8,4` o equivalente).
- **Dado** que `entidad.afiliacion = "sistemica"`, **cuando** la apariencia se renderiza, **entonces** el contorno es continuo.
- **Dado** que cambio la afiliación (HU-10.012), **cuando** la operación termina, **entonces** el render se actualiza.

**Reglas y restricciones:**
- Color del borde determinado por tipo de entidad: `#70E483` (objeto) o `#3BC3FF` (proceso). [JOYAS §1]
- El patrón discontinuo es estable entre objetos y procesos.

**Modelo de datos tocado:**
- Render derivado de `entidad.afiliacion`; no persiste.

**Notas de evidencia:**
- Fuente normativa: [V-1] afiliación.
- Fuente OPCloud: render observable. [JOYAS §1]
- Clase de afirmación: confirmado por SSOT + observado.

**Prioridad:** M0.
**Tamaño:** XS.
**Etiquetas:** [canvas, render, afiliacion].

---

### HU-10.016 — Ver eco OPL-ES al crear cosa [absorbida en HU-SHARED-007]

**Estado:** absorbida-en-shared (2026-05-03).
**Canónica:** HU-SHARED-007 — Eco OPL-ES sincronizado.
**Especialización local:**
- Disparo: tras HU-10.001 o HU-10.002.
- Plantillas aplicables: [OPL-ES D1] para procesos y objetos.
- Forma esperada: `*Un Proceso* es un proceso informacional y sistémico.` o `**Un Objeto** es un objeto informacional y sistémico.`
**Citas SSOT preservadas:** [OPL-ES D1].
**Fuente OPCloud:** opcloud-reverse/10-canvas-creacion-cosas.md §5.

---

### HU-10.017 — Ver cosa en biblioteca lateral

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** L primario; U secundario.
**Superficie UI:** panel lateral "Cosas del modelo".
**Gesto canónico:** observación pasiva; consulta directa.

**Historia:**
> Como modelador, quiero ver una lista lateral con todas las cosas del modelo para encontrarlas y arrastrarlas a otros OPDs sin redibujarlas.

**Contexto de negocio:**
OPCloud expone una "Draggable Things Library" como afordance para reutilizar entidades existentes en otros OPDs (descomposición). La SSOT no exige el panel; es una vista derivada del catálogo `modelo.entidades`.

**Criterios de aceptación:**
- **Dado** que el panel está abierto, **cuando** existe una entidad en el modelo, **entonces** aparece como entrada en el panel con su nombre y un icono según `entidad.tipo`.
- **Dado** que el panel está abierto, **cuando** creo una entidad nueva (HU-10.001/002), **entonces** aparece automáticamente como entrada.
- **Dado** que renombro una entidad, **cuando** la operación termina, **entonces** la entrada se actualiza con el nuevo nombre.
- **Dado** que arrastro una entrada de la biblioteca al canvas, **cuando** suelto, **entonces** se crea una `apariencia` adicional para esa `entidad` en el OPD actual (la entidad no se duplica).
- **Dado** que elimino la entidad, **cuando** la operación termina, **entonces** la entrada desaparece.

**Reglas y restricciones:**
- La biblioteca es lente derivada de `modelo.entidades`.
- El arrastre crea apariencia, no entidad.

**Modelo de datos tocado:**
- Lente; al arrastrar: `apariencia.id`, `apariencia.entidadId`, `apariencia.opdId`, `apariencia.x`, `apariencia.y`, `apariencia.width`, `apariencia.height` — persistentes.

**Patrones aplicados:**
- HU-SHARED-002 (al crear apariencia adicional).

**Dependencias:**
- Bloqueada por: HU-10.001, HU-10.002.

**Notas de evidencia:**
- Fuente OPCloud: panel "Draggable Things" observable.
- Clase de afirmación: observado.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [canvas, lente, biblioteca].

---

### HU-10.018 — Ver cosa en navegador OPD

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** L primario.
**Superficie UI:** miniatura del navegador OPD.
**Gesto canónico:** observación pasiva.

**Historia:**
> Como modelador, quiero ver una miniatura del OPD que muestre todas las cosas y enlaces para tener una vista panorámica.

**Contexto de negocio:**
OPCloud expone un OPD Navigator (mini-mapa) para orientación en OPDs grandes. Vista derivada; no exigida por la SSOT.

**Criterios de aceptación:**
- **Dado** que el navegador está visible, **cuando** existe una apariencia en el OPD activo, **entonces** se renderiza miniaturizada en proporción al canvas.
- **Dado** que muevo una apariencia, **cuando** la operación termina, **entonces** la miniatura se actualiza.
- **Dado** que clico una zona del navegador, **cuando** la acción termina, **entonces** el viewport del canvas se desplaza a esa zona (preserva zoom).

**Reglas y restricciones:**
- La miniatura es lente derivada del OPD activo.

**Modelo de datos tocado:**
- Lente; estado UI: `ui.viewport: { x, y, zoom }` — transitorio.

**Dependencias:**
- Bloqueada por: HU-10.001 o HU-10.002.

**Notas de evidencia:**
- Fuente OPCloud: OPD Navigator observable.
- Clase de afirmación: observado.

**Prioridad:** M1.
**Tamaño:** XS.
**Etiquetas:** [canvas, lente, navegacion].

---

### HU-10.019 — Abrir menú contextual de cosa [absorbida en HU-SHARED-001]

**Estado:** absorbida-en-shared (2026-05-03).
**Canónica:** HU-SHARED-001 — Menú contextual unificado.
**Especialización local:**
- Contexto: Cosa (entidad + apariencia).
- Acciones-lectura: Inspeccionar, Copiar nombre, Ver en árbol.
- Acciones-escritura: Renombrar (HU-SHARED-004), Cambiar afiliación (HU-10.012), Cambiar esencia (HU-10.013), Aplicar estereotipo (EPICA-A0), Editar descripción (HU-10.004).
- Acciones-destructivas: Eliminar (HU-SHARED-005).
**Fuente OPCloud:** opcloud-reverse/10-canvas-creacion-cosas.md §7.

---

### HU-10.020 — Acceder acciones del menú contextual [absorbida en HU-SHARED-001]

**Estado:** absorbida-en-shared (2026-05-03).
**Canónica:** HU-SHARED-001 — Menú contextual unificado.
**Especialización local:** ver HU-10.019. Las afordancias de selección y ejecución de acción están en HU-SHARED-001 §criterios.
**Fuente OPCloud:** opcloud-reverse/10-canvas-creacion-cosas.md §7.

---

### HU-10.021 — Descomposición de objeto en el mismo diagrama

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** V primario; U secundario.
**Superficie UI:** canvas-OPD.
**Gesto canónico:** acción "Descomponer en diagrama" del menú contextual.

**Historia:**
> Como modelador experto, quiero descomponer un objeto en su mismo OPD (sin abrir un OPD hijo) para mostrar su estructura interna sin perder el contexto.

**Contexto de negocio:**
OPCloud ofrece dos modos de descomposición: tradicional (abre OPD hijo) y "in-diagram" (la apariencia padre se agranda y contiene a las hijas). La SSOT define la descomposición [Glos 3.31] sin prescribir el modo. La SSOT prefiere el modo tradicional; el modo in-diagram es una variante OPCloud.

**Criterios de aceptación:**
- **Dado** que selecciono un objeto y elijo "Descomponer en diagrama", **cuando** la operación termina, **entonces** `apariencia.descomposicionEnDiagrama = true` `[propuesta]` y la apariencia se redimensiona para contener cosas hijas.
- **Dado** que arrastro nuevas cosas dentro del objeto descompuesto, **cuando** sueltos, **entonces** las nuevas apariencias quedan asociadas al objeto padre.
- **Dado** que invoco "Recomponer", **cuando** la operación termina, **entonces** la apariencia vuelve al tamaño normal y las apariencias hijas se redistribuyen (a confirmar; ver Q10.5).

**Reglas y restricciones:**
- La descomposición tradicional (con OPD hijo) vive en EPICA-12 y es la opción preferida [Met §6].
- El modo in-diagram es secundario y diferible.

**Modelo de datos tocado:**
- `apariencia.descomposicionEnDiagrama: boolean` `[propuesta]` — persistente.

**Patrones aplicados:**
- HU-SHARED-002.
- HU-SHARED-001 (mecánica detectada por audit-hu.mjs).

**Dependencias:**
- Bloqueada por: HU-10.002.
- Bloquea a: ninguna (camino alternativo).

**Notas de evidencia:**
- Fuente normativa: [Glos 3.31] descomposición; [Met §6] preferencia.
- Fuente OPCloud: §12 doc fuente.
- Clase de afirmación: observado; OPM no exige el modo.

**Prioridad:** C.
**Tamaño:** M.
**Etiquetas:** [canvas, descomposicion, propuesta].

---

### HU-10.022 — Ver indicador de modelo no guardado [absorbida en HU-SHARED-006]

**Estado:** absorbida-en-shared (2026-05-03).
**Canónica:** HU-SHARED-006 — Estado dirty del modelo.
**Especialización local:**
- Disparo: cualquier operación de HU-10.001..10.021 que entra al stack undo activa dirty.
- Render: `Mi Modelo *(No guardado)` junto al título en barra superior.
**Fuente OPCloud:** opcloud-reverse/10-canvas-creacion-cosas.md §8.

---

## 4. Preguntas abiertas derivadas

| Código | Pregunta | Bloquea |
|---|---|---|
| Q10.1 | ¿Dónde se muestra `entidad.descripcion` `[propuesta]` después de creada (tooltip / panel inspector / hover)? | HU-10.004 |
| Q10.2 | ¿La preferencia "Auto Format desactivado" persiste entre sesiones o solo en sesión? | HU-10.006 |
| Q10.3 | ¿La biblioteca lateral admite filtros (por tipo, por OPD, por usuario)? | HU-10.017 |
| Q10.4 | ¿Cambiar `entidad.esencia` a "informacional" cuando es agente debe bloquearse, advertir o desconectar el agente automáticamente? | HU-10.013 |
| Q10.5 | Semántica exacta de "recomponer" la descomposición en diagrama: ¿qué pasa con apariencias hijas? | HU-10.021 |
| Q10.6 | ¿El sufijo serial respeta el dominio de la cosa (ej. `Un Proceso 2` vs `Un Procesador 2`) o siempre usa `Un Proceso N`? | HU-SHARED-009 (afecta HU-10.001/002) |

## 5. Referencias cruzadas

- Patrones: [HU-SHARED-001](../shared/HU-SHARED-001-menu-contextual.md), [HU-SHARED-002](../shared/HU-SHARED-002-undo-redo.md), [HU-SHARED-003](../shared/HU-SHARED-003-permisos-readonly.md), [HU-SHARED-006](../shared/HU-SHARED-006-dirty-state.md), [HU-SHARED-007](../shared/HU-SHARED-007-eco-opl.md), [HU-SHARED-009](../shared/HU-SHARED-009-validacion-nominal.md).
- Bloquea principalmente a: EPICA-11, EPICA-12, EPICA-13, EPICA-15, EPICA-16, EPICA-1B, EPICA-1C.
- Modelo de datos: `app/src/modelo/tipos.ts` (`Entidad`, `Apariencia`, `Enlace`, `AparienciaEnlace`).
