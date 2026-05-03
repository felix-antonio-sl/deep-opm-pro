---
epica: "EPICA-60"
titulo: "Exportar a PDF — pipeline papel, opciones, seleccion de OPDs, integracion Share"
doc_fuente: "opcloud-reverse/60-export-pdf.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "C"
hu_emitidas: 35
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "DIAGNOSTICO-PILOTO-EPICA-10.md"
---

## Resumen

Esta epica cubre el **pipeline canonico papel** del modelador: produccion de un
artefacto documento que condensa todo un modelo OPM — portada, Table of Contents,
OPD Tree, diagramas con OPL, Elements Dictionary y Relations — a partir del
estado actual del canvas.

La SSOT [V-0a] establece que todo modelo OPM debe poder exportarse como
**canon-documento** (artefacto de documento canonico). OPCloud implementa este
requisito como PDF multipagina con opciones configurables. La epica es por tanto
**mixta**: el concepto de exportar un documento del modelo es normativo (SSOT);
la forma especifica como PDF con toggles, resolucion y marca de agua es
implementacion OPCloud.

El doc fuente documenta dos flujos coexistentes: el **original** (modal con 4
toggles, carpeta 11) y el **actualizado** (8 toggles + resolucion + selector
OPDs tri-state + watermark, carpeta 35). La epica trata ambos como capas: HU
fundacionales cubren el flujo original, HU incrementales cubren la ampliacion de
opciones. Tambien cubre por acoplamiento directo el dialogo `Share Model` porque
la `Model URL` que produce se incrusta como metadato textual en la portada del
documento.

La epica es predominantemente **C (could-have)** en la taxonomia MoSCoW del
modelador: utilidad de pulido que eleva productividad y diferencial, pero no es
kernel OPM. Las HU tocan principalmente la capa de **integracion externa (X)**
con soporte de **lente (L)** para computar Elements Dictionary y Relations. El
render del OPD rasterizado depende del renderer vigente (V).

Las HU se numeran siguiendo la aparición en el doc fuente. Cuando una HU toca una feature cubierta por otra épica (Requirement Views en EPICA-A1, procesos computacionales en EPICA-B1), se delega con referencia cruzada sin duplicar detalle.

## Tabla de HU de la épica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|
| HU-60.001 | Activar Export Model to PDF desde main menu Exports | RV | C | XS | mixto | [V-0a] |
| HU-60.002 | Abrir modal Export Model to PDF con configuración por defecto | RV | C | S | mixto | [V-0a] |
| HU-60.003 | Pre-cargar File name con el nombre del modelo | RV | C | XS | mixto | [V-0a] |
| HU-60.004 | Editar File name antes de exportar | RV | C | XS | mixto | [V-0a] |
| HU-60.005 | Sanear File name con caracteres especiales del nombre del modelo | RV | C | XS | opcloud-ui | — |
| HU-60.006 | Ver indicador textual "Downloading might take few minutes" | RV | C | XS | opcloud-ui | — |
| HU-60.007 | Disparar generación del PDF con botón Save | RV | C | M | mixto | [V-0a] |
| HU-60.008 | Descargar PDF y abrirlo en tab externo del navegador | RV | C | S | opcloud-ui | — |
| HU-60.009 | Incluir Model URL en portada (toggle Include Model URL) | RV | C | S | mixto | [V-0a] |
| HU-60.010 | Incluir descripción de entidades (toggle Include Entities Description) | RV | C | S | mixto | [V-0a] |
| HU-60.011 | Incluir tooltips de procesos computacionales (toggle Include Computational Processes Tooltips) | IS | C | S | opcloud-ui | — |
| HU-60.012 | Numerar oraciones del OPL (toggle Number OPL sentences) | RV | C | S | mixto | [OPL-ES §2] |
| HU-60.013 | Generar numeración OPL global continua (flujo actualizado) | RV | C | M | opcloud-ui | — |
| HU-60.014 | Incluir Requirement Views (toggle Include Requirement Views) | AD | C | M | opcloud-ui | — |
| HU-60.015 | Incluir Elements Dictionary (toggle Include Elements Dictionary) | RV | C | S | mixto | [V-0a] |
| HU-60.016 | Agregar marca de agua Confidential (toggle Add Confidential Watermark) | AO | C | S | opcloud-ui | — |
| HU-60.017 | Configurar OPDs Resolution como multiplicador | ME | C | S | opcloud-ui | — |
| HU-60.018 | Abrir sub-modal Select OPDs to Export desde el modal principal | ME | C | S | opcloud-ui | — |
| HU-60.019 | Ver árbol jerárquico tri-state de OPDs en sub-modal | ME | C | M | opcloud-ui | — |
| HU-60.020 | Alternar marca de un OPD con clic de checkbox individual | ME | C | XS | opcloud-ui | — |
| HU-60.021 | Alternar todos los hijos recursivamente con doble-clic en nodo padre | ME | C | S | opcloud-ui | — |
| HU-60.022 | Ver estado semi-marcado del padre cuando hijos están parcialmente marcados | ME | C | S | opcloud-ui | — |
| HU-60.023 | Confirmar selección de OPDs con botón Apply | ME | C | XS | opcloud-ui | — |
| HU-60.024 | Descartar selección con botón Cancel en sub-modal | ME | C | XS | opcloud-ui | — |
| HU-60.025 | Generar portada con metadata del modelo | RV | C | M | opm-semantica | [V-0a] |
| HU-60.026 | Generar Table of Contents con entradas de secciones | RV | C | S | mixto | [V-0a] |
| HU-60.027 | Generar sección OPD Tree con indentación textual | RV | C | S | opm-semantica | [V-0a] |
| HU-60.028 | Generar sección Diagrams & OPL con rasterización por OPD | RV | C | L | opm-semantica | [V-0a] [V-1] |
| HU-60.029 | Generar Elements Dictionary con cromatismo textual por clase | RV | C | M | mixto | [V-0a] |
| HU-60.030 | Generar sección Relations con agrupación por tipo | RV | C | M | mixto | [V-0a] |
| HU-60.031 | Preservar convenciones visuales canvas↔PDF en rasterización | RV | C | M | opm-semantica | [V-124] [V-63] [V-1] |
| HU-60.032 | Abrir modal Share Model con URL copiable | CO | C | S | opcloud-ui | — |
| HU-60.033 | Copiar Model URL al clipboard con botón Copy | CO | C | XS | opcloud-ui | — |
| HU-60.034 | Incluir OPD activo en la URL compartida (toggle Include OPD in URL) | CO | C | S | opcloud-ui | — |
| HU-60.035 | Abrir Share Model desde botón paper-plane de main toolbar | CO | C | XS | opcloud-ui | — |

Total: **35 historias de usuario** (4 opm-semantica, 19 opcloud-ui, 12 mixto).

## Historias de usuario

### HU-60.001 — Activar Export Model to PDF desde main menu Exports

**Actor primario:** RV (revisor / lector).
**Actores secundarios:** MN, ME, AD (cualquier modelador que necesite compartir papel).
**Tipo:** mixto.
**Nivel categorico:** U primario; X (integración externa) secundario.
**Superficie UI:** main-menu + submenú `Exports ▸`.
**Gesto canonico:** clic en hamburguesa → `Exports ▸` → `Export Model to PDF`.

**Historia:**
> Como revisor, quiero activar la exportación a PDF desde el main menu para producir un artefacto papel del modelo sin aprender un flujo dedicado.

**Contexto de negocio:**
El menú principal es el punto canónico de integración de features transversales al modelo (save, load, export, permisos). Colocar `Export Model to PDF` bajo el submenú `Exports ▸` lo agrupa con sus hermanos (`Export OPL`, `Export Model OPDs`), facilita el descubrimiento y mantiene coherencia de IA.

**Criterios de aceptación:**
- **Dado** que estoy en el canvas, **cuando** hago clic en la hamburguesa de main menu, **entonces** se abre el overlay con opciones incluyendo `Exports ▸`.
- **Dado** que main menu está abierto, **cuando** paso el cursor o hago clic sobre `Exports ▸`, **entonces** el submenú se expande mostrando `Export OPL`, `Export Model OPDs`, `Export Model to PDF`.
- **Dado** que el submenú está expandido, **cuando** hago clic en `Export Model to PDF`, **entonces** se abre el modal de configuración del export.
- **Dado** que el menú principal está cerrado, **cuando** miro la UI, **entonces** no hay atajo de teclado dedicado — el flow es clic-only.

**Reglas y restricciones:**
- El submenú `Exports ▸` contiene exactamente tres opciones en el flujo observado: OPL, OPDs (imagen), PDF.
- No existe atajo de teclado para disparar export PDF (confirmado §8).
- La activación desde main menu no depende del OPD activo.

**Modelo de datos tocado:**
- Ninguno (apertura de UI).

**Dependencias:**
- Bloquea a: HU-60.002 (modal se abre desde aquí).

**Integraciones:**
- EPICA-61 (Export SVG) — comparte submenú Exports.
- EPICA-71 (Export CSV) — puede compartir submenú en versión extendida.

**Notas de evidencia:**
- Fuente: §2 tabla, §3.1 paso 1–3, §7.1.
- Frames: frame_00010 (submenú Exports expandido).
- Transcripción: confirmado.
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [export-pdf, ui, main-menu, submenu-exports].

---

### HU-60.002 — Abrir modal Export Model to PDF con configuración por defecto

**Actor primario:** RV.
**Tipo:** mixto.
**Nivel categorico:** U primario.
**Superficie UI:** modal-export-pdf centrado sobre canvas con fondo semi-oscurecido.
**Gesto canonico:** ninguno directo (consecuencia de HU-60.001).

**Historia:**
> Como revisor, quiero ver el modal con valores por defecto sensatos para poder generar un PDF típico sin configurar nada.

**Contexto de negocio:**
Los defaults observados en el flujo actualizado (Model URL on, Computational Tooltips off, Entities Description on, OPL numerado on, Requirement Views on, Elements Dictionary on, Watermark off, Resolution 3) representan el "PDF estándar" que un revisor típico esperaría: completo, legible, sin confidencialidad forzada, sin metainformación de simulación.

**Criterios de aceptación:**
- **Dado** que activé `Export Model to PDF` desde main menu, **cuando** se abre el modal, **entonces** se centra sobre canvas con fondo semi-oscurecido que bloquea interacción con el canvas.
- **Dado** que el modal se abrió, **cuando** miro los toggles, **entonces** están en sus defaults observados (§5.1 tabla: URL=on, Comp.Tooltips=off, Ent.Description=on, Number OPL=on, Req.Views=on, El.Dict=on, Watermark=off, Resolution=3).
- **Dado** que el modal está abierto, **cuando** presiono ESC o hago clic en el área oscurecida externa, **entonces** el modal se cierra sin exportar (**comportamiento inferido** — no observado explícitamente).
- **Dado** que el modal está abierto, **cuando** miro la parte superior, **entonces** veo título `Export Model to PDF` y el texto permanente `Note: Downloading might take few minutes`.

**Reglas y restricciones:**
- El modal es persistente hasta Save/Cancel/ESC (§2 tabla).
- El modal no se cierra automáticamente durante la generación (§4.1).
- Los defaults pueden ser configurables a nivel organización (delegar a EPICA-81).

**Modelo de datos tocado:**
- `exportPdfConfig` (estado transitorio del modal, no persistente entre sesiones salvo organización).

**Dependencias:**
- Bloqueada por: HU-60.001.
- Bloquea a: todas las HU de toggles (HU-60.009 a HU-60.016), HU-60.007 (Save).

**Integraciones:**
- EPICA-81 (defaults por organización) — candidata a proveer valores iniciales.

**Notas de evidencia:**
- Fuente: §2 tabla, §3.1 paso 3–4, §3.2, §5.1 tabla.
- Frames: frame_00005, frame_00020 (dos versiones del modal).
- Clase de afirmación: observado.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [export-pdf, ui, modal, defaults].

---

### HU-60.003 — Pre-cargar File name con el nombre del modelo

**Actor primario:** RV.
**Tipo:** mixto.
**Nivel categorico:** U primario.
**Superficie UI:** modal-export-pdf, campo `File name` en parte superior.
**Gesto canonico:** ninguno (auto-llenado).

**Historia:**
> Como revisor, quiero que el campo File name venga pre-cargado con el nombre del modelo para no tener que escribirlo manualmente.

**Contexto de negocio:**
El nombre del archivo por defecto replica el título del tab (`OnStar Example`, `<<OPM Example Model>>`). Reduce fricción: el caso típico es "exportar con el nombre del modelo", el caso excepcional es renombrar.

**Criterios de aceptación:**
- **Dado** que se abre el modal de export, **cuando** miro el campo `File name`, **entonces** muestra el nombre del modelo vigente (sin extensión `.pdf`).
- **Dado** que el modelo se llama `OnStar Example`, **cuando** miro el campo, **entonces** dice exactamente `OnStar Example`.
- **Dado** que el modelo no tiene nombre asignado (`Model (Not Saved)`), **cuando** miro el campo, **entonces** muestra un fallback (hipótesis: `Model` sin sufijo — **abierto**).

**Reglas y restricciones:**
- El default es el nombre del tab (§2 tabla).
- La extensión `.pdf` se agrega automáticamente al generar el archivo, no se muestra en el campo.

**Modelo de datos tocado:**
- `exportPdfConfig.fileName` — string — transitorio.

**Dependencias:**
- Bloqueada por: HU-60.002.
- Relaciona: EPICA-30 (nombre del modelo persistido).

**Notas de evidencia:**
- Fuente: §2 tabla (`File name … pre-cargado con nombre del modelo`), §3.1 paso 3.
- Frames: frame_00017, frame_00020.
- Clase de afirmación: observado.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [export-pdf, ui, file-name, auto-pre-load].

---

### HU-60.004 — Editar File name antes de exportar

**Actor primario:** RV.
**Tipo:** mixto.
**Nivel categorico:** U.
**Superficie UI:** modal-export-pdf, campo `File name` editable.
**Gesto canonico:** escritura en input.

**Historia:**
> Como revisor, quiero poder editar el File name antes de exportar para guardar el PDF con un nombre distinto al del modelo (p. ej. con fecha o versión).

**Contexto de negocio:**
Exportar una misma versión del modelo para distintos destinatarios o ciclos requiere distinguir archivos por nombre. Editar el campo es más rápido que renombrar tras descargar.

**Criterios de aceptación:**
- **Dado** que el modal está abierto, **cuando** hago clic en el campo `File name`, **entonces** puedo editar el texto libremente.
- **Dado** que edité el nombre a `OnStar Example v2`, **cuando** hago clic en `Save`, **entonces** el archivo descargado se llama `OnStar Example v2.pdf`.
- **Dado** que dejé el campo vacío, **cuando** intento exportar, **entonces** comportamiento es **pregunta abierta**: ¿validación de campo requerido o fallback al nombre del modelo?

**Reglas y restricciones:**
- El editor acepta texto libre sujeto al saneamiento de HU-60.005.
- La extensión `.pdf` no se agrega en el input; se agrega al archivo descargado.

**Modelo de datos tocado:**
- `exportPdfConfig.fileName` — string — transitorio hasta que se dispara Save.

**Dependencias:**
- Bloqueada por: HU-60.003.

**Notas de evidencia:**
- Fuente: §2 tabla (`Texto editable`).
- Clase de afirmación: observado (editable) + abierto (comportamiento con vacío).

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [export-pdf, ui, file-name, edición].

---

### HU-60.005 — Sanear File name con caracteres especiales del nombre del modelo

**Actor primario:** RV.
**Tipo:** opcloud-ui.
**Nivel categorico:** X primario.
**Superficie UI:** modal-export-pdf + pipeline de descarga.
**Gesto canonico:** ninguno (transformacion automatica al generar).

**Historia:**
> Como revisor, quiero que el nombre del archivo reemplace caracteres inválidos del sistema de archivos para que la descarga no falle cuando el modelo tiene delimitadores especiales.

**Contexto de negocio:**
Modelos con nombre `<<OPM Example Model>> Dishwasher ...` contienen caracteres ilegales en NTFS/ext4 (`<`, `>`). OPCloud sanea reemplazándolos por `_` y trunca a ~60 caracteres. Evita descargas corruptas y nombres que el SO rechace.

**Criterios de aceptación:**
- **Dado** que el modelo se llama `<<OPM Example Model>> Dishwasher Model with Preparation and Washing`, **cuando** exporto sin editar el campo, **entonces** el archivo descargado se llama `_OPM Example Model_ Dishwasher Model with Preparation and W….pdf` (con truncamiento).
- **Dado** que el nombre contiene otros caracteres reservados (`/`, `\`, `:`, `*`, `?`, `"`, `|`), **cuando** genero el archivo, **entonces** cada uno se reemplaza por `_` (**hipótesis** por simetría).
- **Dado** que el nombre supera ~60 caracteres, **cuando** genero el archivo, **entonces** se trunca con indicador visual `…`.

**Reglas y restricciones:**
- Reglas de saneamiento inferidas: `<>` → `_`, longitud máx ~60 (**inferido** del header del visor §4.2).
- Se respeta espacios y letras acentuadas (sin reemplazo observado).

**Modelo de datos tocado:**
- `exportPdfConfig.fileName` (post-saneamiento, no persistente).

**Dependencias:**
- Bloqueada por: HU-60.003.

**Notas de evidencia:**
- Fuente: §4.2, §9 ("Nombre de archivo: saneamiento…").
- Clase de afirmación: observado + inferido (caracteres exactos no enumerados).
- Etiqueta: `requires-clarification` (tabla exacta de sanitización).

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [export-pdf, ui, file-name, sanitización, requires-clarification].

---

### HU-60.006 — Ver indicador textual "Downloading might take few minutes"

**Actor primario:** RV.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario.
**Superficie UI:** modal-export-pdf, texto permanente bajo el título.
**Gesto canonico:** ninguno.

**Historia:**
> Como revisor, quiero ver un aviso permanente de que la descarga puede tomar minutos para no cancelar prematuramente el flow cuando se demora.

**Contexto de negocio:**
La generación de PDFs grandes (modelo Dishwasher, 55 paginas) puede tardar minutos. Sin aviso, el usuario típico asume que algo falló y cierra el modal. El texto permanente resuelve el problema de expectativa sin requerir spinner activo.

**Criterios de aceptación:**
- **Dado** que el modal está abierto (antes o durante generación), **cuando** miro bajo el título, **entonces** siempre veo el texto `Note: Downloading might take few minutes`.
- **Dado** que pulsé Save y la generación está en curso, **cuando** miro el modal, **entonces** el texto sigue visible y los controles quedan pasivos (**abierto**: loading spinner no observado explícitamente).

**Reglas y restricciones:**
- El texto es permanente, no condicional al estado de generación.
- Durante la generación no se observó spinner — **pregunta abierta** (§4.1).

**Dependencias:**
- Bloqueada por: HU-60.002.

**Notas de evidencia:**
- Fuente: §2 tabla, §3.1 paso 5, §4.1.
- Clase de afirmación: observado (texto) + abierto (spinner).

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [export-pdf, ui, feedback, note].

---

### HU-60.007 — Disparar generación del PDF con botón Save

**Actor primario:** RV.
**Tipo:** mixto.
**Nivel categorico:** X primario; V (rasterización) secundario; L (Elements Dictionary/Relations) secundario.
**Superficie UI:** modal-export-pdf, botón `Save` pie derecho.
**Gesto canonico:** clic.

**Historia:**
> Como revisor, quiero disparar la generación del PDF con un clic para producir el artefacto con la configuración vigente sin pasos adicionales.

**Contexto de negocio:**
El botón Save es el único gesto que dispara el pipeline completo: rasterización de OPDs, composición de portada/ToC/secciones, ensamblaje del archivo, y descarga. Mantener un solo botón de confirmación evita errores por configuraciones parciales.

**Criterios de aceptación:**
- **Dado** que configuré los toggles según mi necesidad, **cuando** hago clic en `Save`, **entonces** el pipeline comienza y el modal permanece abierto durante la generación.
- **Dado** que la generación está en curso, **cuando** miro los controles del modal, **entonces** quedan pasivos (no puedo cambiar toggles mientras se genera — **hipótesis**).
- **Dado** que la generación terminó, **cuando** llega el archivo al navegador, **entonces** el modal se cierra automáticamente (**hipótesis**, no observado explícitamente).
- **Dado** que la generación falla (modelo corrupto, recursos insuficientes), **cuando** el pipeline aborta, **entonces** se muestra un mensaje de error (**abierto** — no hay observación de flow de error).

**Reglas y restricciones:**
- El botón Save usa la configuración vigente en el momento del clic, no un snapshot del modal al abrirse.
- El export toma el estado vigente del canvas (§7.3 — cambios no guardados sí se reflejan — **abierto**).
- La generación es asíncrona; el modal no debe bloquear la app completa (**hipótesis**).

**Modelo de datos tocado:**
- Ninguno persistente — pipeline produce un archivo, no muta el modelo.

**Dependencias:**
- Bloqueada por: HU-60.002.
- Bloquea a: HU-60.008 (descarga), HU-60.025 a HU-60.031 (secciones del PDF).

**Integraciones:**
- Renderer (para rasterizar OPDs).
- Motor OPL (para generar oraciones).
- Lente Elements Dictionary, lente Relations.

**Notas de evidencia:**
- Fuente: §2 tabla (`Botón Save`), §3.1 paso 5, §3.2.
- Frames: frame_00019, frame_00025.
- Clase de afirmación: observado (clic dispara) + hipótesis (comportamiento post-éxito/falla).

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [export-pdf, pipeline, save, generación].

---

### HU-60.008 — Descargar PDF y abrirlo en tab externo del navegador

**Actor primario:** RV.
**Tipo:** opcloud-ui.
**Nivel categorico:** X.
**Superficie UI:** navegador (fuera del modelador) + tab nuevo.
**Gesto canonico:** ninguno (automático post-generación).

**Historia:**
> Como revisor, quiero que el PDF se descargue y se abra automáticamente en una pestaña nueva para revisarlo sin pasos adicionales.

**Contexto de negocio:**
El visor PDF vive fuera del modelador (no hay visor integrado §7.7). El tab nuevo con el PDF cargado es el mecanismo de entrega estándar: aprovecha el visor del navegador (thumbnails, zoom, búsqueda) sin reinventar la rueda.

**Criterios de aceptación:**
- **Dado** que la generación del PDF terminó, **cuando** el navegador recibe el blob, **entonces** descarga el archivo al folder por defecto del sistema.
- **Dado** que el archivo está descargado, **cuando** el navegador procesa la respuesta, **entonces** abre automáticamente un tab nuevo con el PDF cargado.
- **Dado** que el tab nuevo está cargado, **cuando** miro el header, **entonces** muestra `<fileName>.pdf`.
- **Dado** que el tab nuevo está cargado, **cuando** miro el panel izquierdo, **entonces** hay thumbnails numerados de las paginas y un indicador de paginación (`1 / 8`, `4 / 55`, etc.).

**Reglas y restricciones:**
- La política de popups del navegador puede bloquear la apertura automática; fallback no observado — **abierto**.
- El tab nuevo es independiente: cerrar el modelador no cierra el visor PDF.

**Dependencias:**
- Bloqueada por: HU-60.007.

**Integraciones:**
- Navegador del usuario (visor PDF nativo).

**Notas de evidencia:**
- Fuente: §2 tabla (`Visor PDF: Tab externo…`), §3.5, §7.7.
- Frames: frames 00021 (Dishwasher), 00023–00028 (OnStar).
- Clase de afirmación: observado.
- Pregunta abierta: tab persistente vs nuevo (§11.12).

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [export-pdf, descarga, visor, tab-externo].

---

### HU-60.009 — Incluir Model URL en portada (toggle Include Model URL)

**Actor primario:** RV.
**Actores secundarios:** CO (comparte).
**Tipo:** mixto.
**Nivel categorico:** U primario (toggle); X (composición PDF) secundario.
**Superficie UI:** modal-export-pdf, checkbox `Include Model URL`.
**Gesto canonico:** clic en checkbox.

**Historia:**
> Como revisor, quiero incluir la Model URL en la portada del PDF para que quien abra el archivo pueda volver al modelo vivo en OPCloud.

**Contexto de negocio:**
La portada con URL convierte el PDF en **anfibio**: documento estático + puente al modelo vivo. Default on porque el caso típico es compartir con alguien que tiene acceso al modelo en OPCloud.

**Criterios de aceptación:**
- **Dado** que el toggle está marcado, **cuando** genero el PDF, **entonces** la portada incluye la línea `Model URL: https://opcloud.systems/load/<modelId>` en itálica.
- **Dado** que el toggle está desmarcado, **cuando** genero el PDF, **entonces** la portada no incluye la línea `Model URL:`.
- **Dado** que el modelo tiene `modelId` pero aún no fue guardado en servidor, **cuando** pulso el toggle on, **entonces** comportamiento es **pregunta abierta** (¿URL queda vacía? ¿toggle se deshabilita?).

**Reglas y restricciones:**
- Default: on (§2 tabla).
- La URL coincide exactamente con la producida por `Share Model` (§7.8).

**Modelo de datos tocado:**
- `exportPdfConfig.includeModelUrl` — bool — transitorio.
- `model.modelId` — string — persistente (usado para construir la URL).

**Dependencias:**
- Bloqueada por: HU-60.002.
- Integra: HU-60.025 (portada), HU-60.032 (Share Model).

**Integraciones:**
- EPICA-30 (persistencia provee modelId).

**Notas de evidencia:**
- Fuente: §2 tabla, §3.1 paso 7, §5.1 tabla, §7.8.
- Frames: frame_00005, frame_00020, frame_00023.
- Clase de afirmación: observado + confirmado por transcripción.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [export-pdf, portada, share, url, toggle].

---

### HU-60.010 — Incluir descripción de entidades (toggle Include Entities Description)

**Actor primario:** RV.
**Actores secundarios:** AD (documenta dominio).
**Tipo:** mixto.
**Nivel categorico:** U primario; L secundario.
**Superficie UI:** modal-export-pdf, checkbox `Include Entities Description`.
**Gesto canonico:** clic.

**Historia:**
> Como revisor, quiero incluir las descripciones autorales de cada entidad en el PDF para conservar la documentación inline al exportar.

**Contexto de negocio:**
El campo `thing.description` (EPICA-10, HU-10.004) captura intención autoral. En el PDF aparece en Elements Dictionary bajo cada entidad. Default on porque el caso típico es preservar documentación; off sirve para reportes compactos sin metainformación.

**Criterios de aceptación:**
- **Dado** que el toggle está marcado y existen entidades con `description` no vacía, **cuando** genero el PDF, **entonces** cada entidad en Elements Dictionary tiene su línea `Description: <texto>` en itálica.
- **Dado** que el toggle está desmarcado, **cuando** genero el PDF, **entonces** Elements Dictionary no muestra descripciones.
- **Dado** que una entidad tiene `description` vacía, **cuando** genero con toggle on, **entonces** no se imprime línea `Description:` para esa entidad (sin línea vacía).

**Reglas y restricciones:**
- Default: on.
- Solo afecta Elements Dictionary; no afecta OPL.

**Modelo de datos tocado:**
- `exportPdfConfig.includeEntitiesDescription` — bool — transitorio.
- `thing.description` — string nullable — persistente.

**Dependencias:**
- Bloqueada por: HU-60.002.
- Integra: HU-10.004 (edición de description), HU-60.029 (Elements Dictionary).

**Notas de evidencia:**
- Fuente: §2 tabla, §5.1 tabla.
- Frames: frame_00005, frame_00020.
- Clase de afirmación: observado.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [export-pdf, elements-dictionary, description, toggle].

---

### HU-60.011 — Incluir tooltips de procesos computacionales (toggle Include Computational Processes Tooltips)

**Actor primario:** IS (ingeniero de simulación).
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; X secundario.
**Superficie UI:** modal-export-pdf, checkbox `Include Computational Processes Tooltips`.
**Gesto canonico:** clic.

**Historia:**
> Como ingeniero de simulación, quiero incluir los tooltips de procesos computacionales en el PDF para documentar fórmulas y anotaciones de simulación en el artefacto papel.

**Contexto de negocio:**
Los tooltips de procesos computacionales (fórmulas, scripts, anotaciones) son metainformación no-canónica. Default off porque la mayoría de revisores no necesita ese detalle y contamina el PDF. IS lo activa cuando el PDF es para compartir con otros ingenieros de simulación.

**Criterios de aceptación:**
- **Dado** que el toggle está desmarcado (default), **cuando** genero el PDF, **entonces** no hay sección/columna con tooltips de procesos computacionales.
- **Dado** que el toggle está marcado y el modelo contiene procesos computacionales, **cuando** genero el PDF, **entonces** aparecen los tooltips en alguna sección (**hipótesis**: junto al proceso en Elements Dictionary — §11.1).
- **Dado** que el toggle está marcado pero el modelo no tiene procesos computacionales, **cuando** genero, **entonces** la sección se omite silenciosamente (§4.5 hipótesis).
- **Dado** que el toggle se muestra en hover, **cuando** paso el cursor, **entonces** aparece el texto `Check to include computational processes tooltip`.

**Reglas y restricciones:**
- Default: off.
- Ubicación exacta de los tooltips en el PDF — **pregunta abierta** §11.1.
- Requiere la feature de EPICA-B1 (simulation-computational).

**Modelo de datos tocado:**
- `exportPdfConfig.includeComputationalTooltips` — bool — transitorio.
- `process.computationalTooltip` — string nullable — persistente (propuesto, ver EPICA-B1).

**Dependencias:**
- Bloqueada por: HU-60.002.
- Integra: EPICA-B1 (procesos computacionales).

**Notas de evidencia:**
- Fuente: §2 tabla, §4.5, §5.1 tabla, §7.6.
- Frames: frame_00020 (tooltip visible del toggle).
- Clase de afirmación: observado (toggle + tooltip) + hipótesis (ubicación).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [export-pdf, computational-processes, tooltip, toggle, requires-clarification].

---

### HU-60.012 — Numerar oraciones del OPL (toggle Number OPL sentences)

**Actor primario:** RV.
**Tipo:** mixto.
**Nivel categorico:** U primario; L (OPL) secundario.
**Superficie UI:** modal-export-pdf, checkbox `Number OPL sentences` (flujo original) / `Show OPL sentences Numbered` (flujo actualizado).
**Gesto canonico:** clic.

**Historia:**
> Como revisor, quiero numerar las oraciones del OPL en el PDF para poder referenciarlas ("según oración 22…") al discutir el modelo.

**Contexto de negocio:**
La numeración convierte el OPL de prosa en un corpus referenciable. Default on porque los casos de uso típicos (review, comentarios, citaciones externas) requieren identificadores estables.

**Criterios de aceptación:**
- **Dado** que el toggle está marcado (default), **cuando** genero el PDF, **entonces** cada oración OPL lleva prefijo `N. ` con número creciente.
- **Dado** que el toggle está desmarcado, **cuando** genero el PDF, **entonces** las oraciones OPL aparecen sin numeración.
- **Dado** que uso flujo original (4 toggles), **cuando** la numeración está on, **entonces** la numeración **reinicia en cada OPD** (`1. Driver is…`, `2. Danger Status…`, etc. comienza de 1 en cada sección OPD).
- **Dado** que uso flujo actualizado (8 toggles), **cuando** la numeración está on, **entonces** la numeración es **global continua** a través del documento (`22. Dish Set consists of…`, `23. Dishwasher and Sink…`) — ver HU-60.013.

**Reglas y restricciones:**
- Default: on.
- El label del toggle cambia entre flujos: `Number OPL sentences` (original) vs `Show OPL sentences Numbered` (actualizado) — §5.5.
- La estrategia de numeración por-OPD vs global depende del flujo (§3.1 paso 7 vs §3.2).

**Modelo de datos tocado:**
- `exportPdfConfig.numberOplSentences` — bool — transitorio.
- `exportPdfConfig.oplNumberingStrategy` — `"per-opd" | "global"` — transitorio (derivado del flujo).

**Dependencias:**
- Bloqueada por: HU-60.002.
- Integra: HU-60.013 (numeración global), HU-60.028 (Diagrams & OPL).

**Notas de evidencia:**
- Fuente: §2 tabla, §3.1 paso 7 (por-OPD), §3.2 (global), §5.1 tabla.
- Frames: frame_00020 (original), frame_00005 (actualizado), frame_00025 (PDF por-OPD), frame_00021 (PDF global).
- Clase de afirmación: observado + confirmado.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [export-pdf, opl, numeración, toggle].

---

### HU-60.013 — Generar numeración OPL global continua (flujo actualizado)

**Actor primario:** RV.
**Tipo:** opcloud-ui.
**Nivel categorico:** L primario; X secundario.
**Superficie UI:** PDF generado, sección `Diagrams & OPL`.
**Gesto canonico:** ninguno (render automático).

**Historia:**
> Como revisor, quiero que las oraciones OPL del PDF actualizado tengan numeración continua a través del documento para poder referenciarlas con un único índice sin ambigüedad de OPD.

**Contexto de negocio:**
La numeración por-OPD (flujo original) crea ambigüedad en documentos multi-OPD ("oración 3" puede ser de SD o SD1). La numeración global continua resuelve: cada oración tiene identificador único en todo el PDF. Observado explícitamente en frame_00021.

**Criterios de aceptación:**
- **Dado** que estoy en flujo actualizado con numeración on, **cuando** genero un PDF con OPDs múltiples, **entonces** las oraciones OPL llevan numeración creciente sin reinicio (`… 22. Dish Set…, 23. Dishwasher and Sink…, 24. Dishwasher exhibits…`).
- **Dado** que paso de un OPD a otro en el PDF, **cuando** miro el número de la primera oración del nuevo OPD, **entonces** continúa la secuencia del OPD anterior, no reinicia en 1.
- **Dado** que la numeración global es continua, **cuando** referencio "oración 22" en una discusión externa, **entonces** apunta inequívocamente a una oración concreta sin ambigüedad de OPD.

**Reglas y restricciones:**
- Solo aplica en flujo actualizado (§5.5 divergencia explícita).
- El flujo original mantiene numeración por-OPD.
- Referencias cruzadas internas en las oraciones: **pregunta abierta** §11.10.

**Dependencias:**
- Bloqueada por: HU-60.012.
- Bloquea a: HU-60.028 (render de sección).

**Notas de evidencia:**
- Fuente: §3.2, §5.5 tabla.
- Frames: frame_00021 (ejemplo de numeración global `22`, `23`, `24`).
- Clase de afirmación: observado.
- Pregunta abierta: §11.10 (cross-references).

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [export-pdf, opl, numeración-global, flujo-actualizado].

---

### HU-60.014 — Incluir Requirement Views (toggle Include Requirement Views)

**Actor primario:** AD (autor de dominio).
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; X secundario.
**Superficie UI:** modal-export-pdf, checkbox `Include Requirement Views` (solo flujo actualizado).
**Gesto canonico:** clic.

**Historia:**
> Como autor de dominio con requisitos definidos, quiero incluir la sección Requirement Views en el PDF para compartir los requisitos del modelo junto con los diagramas.

**Contexto de negocio:**
Los Requirement Views (EPICA-A1) son una extensión del kernel: tabla de requisitos textuales ligados a entidades. Cuando el modelo los usa, incluirlos en el PDF cierra el ciclo de trazabilidad requisito↔modelo en un solo artefacto.

**Criterios de aceptación:**
- **Dado** que el toggle está marcado y el modelo tiene Requirement Views, **cuando** genero el PDF, **entonces** aparece una sección dedicada `Requirement Views` con el contenido de los requisitos.
- **Dado** que el toggle está marcado pero el modelo no tiene Requirement Views, **cuando** genero el PDF, **entonces** comportamiento es **pregunta abierta** §7.5 (sección vacía o toggle disabled).
- **Dado** que el toggle está desmarcado, **cuando** genero el PDF, **entonces** no hay sección Requirement Views en el documento ni entrada en ToC.
- **Dado** que solo existe en flujo actualizado, **cuando** uso flujo original, **entonces** este toggle no aparece en el modal.

**Reglas y restricciones:**
- Default: on.
- Solo en flujo actualizado (§5.5).
- Requiere EPICA-A1.

**Modelo de datos tocado:**
- `exportPdfConfig.includeRequirementViews` — bool — transitorio.

**Dependencias:**
- Bloqueada por: HU-60.002.
- Integra: EPICA-A1 (extension-requirements).

**Notas de evidencia:**
- Fuente: §2 tabla, §5.1 tabla, §7.5.
- Frames: frame_00005.
- Clase de afirmación: observado + hipótesis (comportamiento sin requisitos).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [export-pdf, requirements, toggle, flujo-actualizado, requires-clarification].

---

### HU-60.015 — Incluir Elements Dictionary (toggle Include Elements Dictionary)

**Actor primario:** RV.
**Tipo:** mixto.
**Nivel categorico:** U primario; L secundario.
**Superficie UI:** modal-export-pdf, checkbox `Include Elements Dictionary` (solo flujo actualizado).
**Gesto canonico:** clic.

**Historia:**
> Como revisor, quiero poder excluir el Elements Dictionary del PDF para generar versiones compactas del modelo enfocadas en diagramas.

**Contexto de negocio:**
El Elements Dictionary ocupa varias páginas en modelos grandes. Revisores que solo necesitan los diagramas + OPL prefieren PDFs más cortos. Default on porque el caso típico es documentación completa; off es optimización.

**Criterios de aceptación:**
- **Dado** que el toggle está marcado (default), **cuando** genero el PDF, **entonces** aparece sección `Elements Dictionary` con Things, Objects, Processes, States.
- **Dado** que el toggle está desmarcado, **cuando** genero el PDF, **entonces** no hay sección Elements Dictionary y ToC omite la entrada.
- **Dado** que hago hover sobre el checkbox, **cuando** miro el tooltip, **entonces** dice `Check to include all model elements dictionary`.

**Reglas y restricciones:**
- Default: on.
- Solo en flujo actualizado (§5.5).
- El toggle tiene tooltip explícito observado en frame_00009.

**Modelo de datos tocado:**
- `exportPdfConfig.includeElementsDictionary` — bool — transitorio.

**Dependencias:**
- Bloqueada por: HU-60.002.
- Bloquea a: HU-60.029.

**Notas de evidencia:**
- Fuente: §2 tabla, §5.1 tabla.
- Frames: frame_00005, frame_00009 (tooltip).
- Clase de afirmación: observado.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [export-pdf, elements-dictionary, toggle, flujo-actualizado].

---

### HU-60.016 — Agregar marca de agua Confidential (toggle Add Confidential Watermark)

**Actor primario:** AO (admin de organización).
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; V (render) secundario.
**Superficie UI:** modal-export-pdf, checkbox `Add Confidential Watermark` (solo flujo actualizado).
**Gesto canonico:** clic.

**Historia:**
> Como admin de organización, quiero agregar una marca de agua "Confidential" al PDF para señalizar modelos sensibles antes de distribuirlos.

**Contexto de negocio:**
Modelos con información propietaria o regulada requieren señalización clara. La marca de agua es control ligero (no criptográfico) pero legal/cultural suficiente en muchos contextos. Default off: el caso típico no es confidencial; AO activa el toggle conscientemente.

**Criterios de aceptación:**
- **Dado** que el toggle está marcado, **cuando** genero el PDF, **entonces** cada pagina lleva una marca de agua "Confidential" (**hipótesis**: diagonal centrada, gris claro — §5.1 tabla).
- **Dado** que el toggle está desmarcado (default), **cuando** genero el PDF, **entonces** no hay marca de agua.
- **Dado** que el toggle está on, **cuando** reviso la portada, **entonces** comportamiento es **pregunta abierta** §11.2 (¿también en portada o solo en paginas de contenido?).

**Reglas y restricciones:**
- Default: off.
- Solo en flujo actualizado (§5.5).
- Posición, color, opacidad, orientación de la marca — **pregunta abierta** §11.2.

**Modelo de datos tocado:**
- `exportPdfConfig.addConfidentialWatermark` — bool — transitorio.

**Dependencias:**
- Bloqueada por: HU-60.002.

**Integraciones:**
- EPICA-81 (style defaults): posible default por organización.

**Notas de evidencia:**
- Fuente: §2 tabla, §5.1 tabla.
- Frames: frame_00005.
- Clase de afirmación: observado (toggle) + hipótesis (render exacto).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [export-pdf, watermark, confidential, toggle, flujo-actualizado, requires-clarification].

---

### HU-60.017 — Configurar OPDs Resolution como multiplicador

**Actor primario:** ME (experto).
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; V (rasterización) secundario.
**Superficie UI:** modal-export-pdf, campo numérico `OPDs Resolution` (solo flujo actualizado).
**Gesto canonico:** edicion numerica.

**Historia:**
> Como modelador experto, quiero configurar la resolución de rasterización de los OPDs para balancear calidad visual vs tamaño del archivo según el contexto.

**Contexto de negocio:**
La rasterización de OPDs (no vectorial, §9) tiene un trade-off inherente: más resolución preserva distinciones finas (dash pattern, grosor del refinable, punta de flechas) pero pesa más. El multiplicador 3 = 300 DPI es el default razonable; valores más altos (p. ej. 6 = 600 DPI) para print pro; más bajos (1 = 100 DPI) para drafts livianos.

**Criterios de aceptación:**
- **Dado** que el campo muestra el default `3`, **cuando** genero el PDF, **entonces** las OPDs se rasterizan a 300 DPI equivalentes.
- **Dado** que cambio el valor a `1`, **cuando** genero, **entonces** las OPDs se rasterizan a 100 DPI (**inferido** por coherencia con la feature Export Model OPDs §7.1).
- **Dado** que cambio el valor a un número muy alto (p. ej. `10`), **cuando** genero, **entonces** el PDF preserva máximo detalle pero el tamaño del archivo crece cuadráticamente (**hipótesis** sin observación §11.3).
- **Dado** que el campo acepta solo números enteros positivos, **cuando** intento ingresar texto o negativo, **entonces** el input rechaza o valida (**abierto**).

**Reglas y restricciones:**
- Default: `3` (equivalente 300 DPI).
- Solo en flujo actualizado (§5.5).
- Campo numérico entero positivo (unidad: multiplicador sobre render base).
- Umbral mínimo para preservar V-* OPM — **pregunta abierta** §11.3.

**Modelo de datos tocado:**
- `exportPdfConfig.opdsResolution` — number — transitorio.

**Dependencias:**
- Bloqueada por: HU-60.002.
- Bloquea a: HU-60.028 (rasterización de OPDs), HU-60.031 (preservación visual).

**Integraciones:**
- Renderer (expone API de rasterización escalada).

**Notas de evidencia:**
- Fuente: §2 tabla, §4.4, §5.2, §7.1 (referencia cruzada `Export Model OPDs`).
- Frames: frame_00005, frame_00019 (valor `3` observado).
- Clase de afirmación: observado (default) + inferido (equivalencia DPI) + abierto (extremos).

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [export-pdf, resolución, rasterización, flujo-actualizado].

---

### HU-60.018 — Abrir sub-modal Select OPDs to Export desde el modal principal

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** modal-export-pdf, botón `Select OPDs to Export` (pie izquierdo) → sub-modal.
**Gesto canonico:** clic en botón.

**Historia:**
> Como modelador experto, quiero abrir el selector de OPDs para elegir específicamente qué OPDs incluir en el PDF sin afectar las demás secciones.

**Contexto de negocio:**
Modelos grandes tienen docenas de OPDs; exportar todos produce documentos inabarcables. El selector tri-state permite generar PDFs focalizados (p. ej. solo SD + SD1) sin tocar el modelo. Flujo actualizado ofrece esta granularidad que el original no tenía.

**Criterios de aceptación:**
- **Dado** que el modal está abierto (flujo actualizado), **cuando** miro el pie, **entonces** veo el botón `Select OPDs to Export` a la izquierda (diferenciado del `Save` a la derecha).
- **Dado** que hago clic en `Select OPDs to Export`, **cuando** se abre el sub-modal, **entonces** queda centrado sobre el modal padre y el modal padre permanece visible (oscurecido) abajo.
- **Dado** que el sub-modal está abierto, **cuando** presiono ESC o `Cancel`, **entonces** el sub-modal se cierra sin aplicar cambios (ver HU-60.024).

**Reglas y restricciones:**
- Solo en flujo actualizado (§3.3, §5.5).
- El modal padre queda inactivo durante la interacción con el sub-modal.

**Dependencias:**
- Bloqueada por: HU-60.002.
- Bloquea a: HU-60.019 a HU-60.024.

**Notas de evidencia:**
- Fuente: §2 tabla, §3.3 paso 1–2.
- Frames: frame_00011, frame_00013, frame_00015.
- Clase de afirmación: observado.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [export-pdf, selector-opds, ui, sub-modal, flujo-actualizado].

---

### HU-60.019 — Ver árbol jerárquico tri-state de OPDs en sub-modal

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** L primario (vista del árbol); U secundario.
**Superficie UI:** sub-modal `Select OPDs to Export:` con árbol.
**Gesto canonico:** ninguno (render).

**Historia:**
> Como modelador experto, quiero ver el árbol jerárquico completo de OPDs con checkboxes para entender qué estoy incluyendo o excluyendo.

**Contexto de negocio:**
El árbol preserva la topología de navegación (SD → SD1 → SD1.1 → SD1.1.1). Ver la jerarquía permite decisiones informadas: "exportar SD1 y descendientes" es un gesto natural que refleja cómo el modelador piensa el modelo.

**Criterios de aceptación:**
- **Dado** que el sub-modal está abierto, **cuando** miro el contenido, **entonces** veo un árbol con indentación jerárquica de todas las OPDs del modelo (`SD`, `SD1: Automated Household Dish Caring in-zoomed`, `SD1.1: Preparing in-zoomed`, etc.).
- **Dado** que cada nodo tiene un checkbox, **cuando** miro el árbol, **entonces** cada OPD tiene su checkbox tri-state (marcado/vacío/semi).
- **Dado** que abro por primera vez el sub-modal, **cuando** miro los checkboxes, **entonces** todos los nodos aparecen marcados (default: exportar todo).
- **Dado** que el árbol es largo, **cuando** miro el sub-modal, **entonces** hay scroll vertical para navegar (**hipótesis**, consistente con modelos grandes).

**Reglas y restricciones:**
- El árbol refleja la estructura del árbol OPD global (EPICA-20).
- Cada OPD aparece con su nombre completo según la convención del OPD Tree.
- Default: todos marcados (§5.3).

**Modelo de datos tocado:**
- `exportPdfConfig.selectedOpds` — `Set<opdId>` — transitorio.

**Dependencias:**
- Bloqueada por: HU-60.018.
- Integra: EPICA-20 (árbol OPD).

**Notas de evidencia:**
- Fuente: §2 tabla, §3.3 paso 2.
- Frames: frame_00011 (árbol completo con SD, SD1.x, SD1.1.x, SD2, SD3).
- Clase de afirmación: observado.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [export-pdf, selector-opds, tri-state, árbol, lente].

---

### HU-60.020 — Alternar marca de un OPD con clic de checkbox individual

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** sub-modal-select-opds, checkboxes individuales.
**Gesto canonico:** clic en checkbox.

**Historia:**
> Como modelador experto, quiero alternar la marca de un OPD individual con un clic para excluir/incluir ese OPD específicamente sin afectar sus hermanos o descendientes.

**Contexto de negocio:**
Granularidad fina: a veces quiero excluir solo un OPD específico (p. ej. un OPD interno de debug) sin perder sus hijos. El clic individual respeta esa precisión.

**Criterios de aceptación:**
- **Dado** que un OPD `X` está marcado, **cuando** hago clic en su checkbox, **entonces** pasa a desmarcado sin afectar hijos, padres ni hermanos.
- **Dado** que un OPD `X` está desmarcado, **cuando** hago clic, **entonces** pasa a marcado con el mismo scope local.
- **Dado** que hice clic individual, **cuando** miro el padre `P` de `X`, **entonces** el padre pasa a estado semi-marcado si `X` y sus hermanos tienen estados mixtos (ver HU-60.022).

**Reglas y restricciones:**
- Clic unico = alternancia exclusiva del nodo cliqueado (§3.3 paso 4).
- No afecta hijos; para acción masiva ver HU-60.021.

**Modelo de datos tocado:**
- `exportPdfConfig.selectedOpds` — set — transitorio.

**Dependencias:**
- Bloqueada por: HU-60.019.

**Notas de evidencia:**
- Fuente: §3.3 paso 4.
- Frames: frame_00013, frame_00015 (cursores entre clics).
- Clase de afirmación: observado.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [export-pdf, selector-opds, checkbox, clic].

---

### HU-60.021 — Alternar todos los hijos recursivamente con doble-clic en nodo padre

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** sub-modal-select-opds, nodos padres con hijos.
**Gesto canonico:** doble-clic sobre el nodo.

**Historia:**
> Como modelador experto, quiero alternar un subárbol completo con doble-clic en el padre para incluir/excluir todo un sub-sistema con un gesto.

**Contexto de negocio:**
Cuando quiero exportar solo SD1 y sus descendientes, no quiero tildar 20 checkboxes uno por uno. El doble-clic es el gesto bulk natural: afecta padre + todos descendientes recursivamente.

**Criterios de aceptación:**
- **Dado** que un nodo `P` tiene hijos `C1…Cn`, **cuando** hago doble-clic sobre `P`, **entonces** si `P` estaba marcado todo se desmarca recursivamente; si no, todo se marca.
- **Dado** que la acción es recursiva, **cuando** `P` tiene nietos, **entonces** los nietos también se alternan.
- **Dado** que paso el cursor sobre el nodo, **cuando** aparece el tooltip, **entonces** dice `Double click to select / unselect all children` (§3.3 paso 3).
- **Dado** que un nodo hoja (sin hijos) recibe doble-clic, **cuando** se procesa, **entonces** el comportamiento equivale a clic simple (alternancia local) — **hipótesis**.

**Reglas y restricciones:**
- Doble-clic en nodo padre = bulk recursivo (§3.3 paso 3).
- Clic unico = alternancia local exclusiva (HU-60.020).
- El tooltip del gesto es observado.

**Modelo de datos tocado:**
- `exportPdfConfig.selectedOpds` — set (bulk update) — transitorio.

**Dependencias:**
- Bloqueada por: HU-60.019.

**Notas de evidencia:**
- Fuente: §3.3 paso 3.
- Clase de afirmación: confirmado por tooltip observado.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [export-pdf, selector-opds, bulk, doble-clic, recursivo].

---

### HU-60.022 — Ver estado semi-marcado del padre cuando hijos están parcialmente marcados

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** V (render tri-state).
**Superficie UI:** sub-modal-select-opds, checkbox del padre.
**Gesto canonico:** ninguno (render reactivo).

**Historia:**
> Como modelador experto, quiero ver el checkbox del padre en estado semi-marcado cuando algunos hijos están marcados y otros no para entender visualmente qué subárbol está parcialmente incluido.

**Contexto de negocio:**
El estado tri-state es la convención estándar de UI para jerarquías: marcado (todo), desmarcado (nada), semi (parcial). Sin el estado semi, el padre perdería información sobre sus hijos y el modelador tendría que expandir el subárbol para verificar.

**Criterios de aceptación:**
- **Dado** que todos los hijos de `P` están marcados, **cuando** miro `P`, **entonces** el checkbox aparece marcado pleno.
- **Dado** que ningún hijo de `P` está marcado, **cuando** miro `P`, **entonces** el checkbox aparece desmarcado.
- **Dado** que algunos hijos están marcados y otros no, **cuando** miro `P`, **entonces** el checkbox aparece en estado semi-marcado (visual distinto, p. ej. cuadrado lleno pequeño o diagonal).
- **Dado** que `P` está semi-marcado, **cuando** hago clic simple sobre `P`, **entonces** comportamiento es **pregunta abierta** (¿marca todos? ¿desmarca todos? ¿alterna el propio padre sin tocar hijos?).

**Reglas y restricciones:**
- Tri-state: on / off / semi (§2 tabla, §3.3 paso 5).
- clic simple vs doble-clic sobre padre semi — **pregunta abierta** (clarificación en HU-60.021 sugiere doble-clic como gesto bulk).

**Dependencias:**
- Bloqueada por: HU-60.020 (produce el estado).

**Notas de evidencia:**
- Fuente: §2 tabla, §3.3 paso 5.
- Clase de afirmación: observado + abierto (clic simple sobre semi).

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [export-pdf, selector-opds, tri-state, render].

---

### HU-60.023 — Confirmar selección de OPDs con botón Apply

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** sub-modal-select-opds, botón `Apply` pie.
**Gesto canonico:** clic.

**Historia:**
> Como modelador experto, quiero confirmar la selección con Apply para que el modal principal reciba el subconjunto elegido.

**Contexto de negocio:**
Apply es el punto de compromiso: antes del clic, los cambios son tentativos y se pueden cancelar (HU-60.024). Esto protege contra selecciones accidentales.

**Criterios de aceptación:**
- **Dado** que el sub-modal está abierto y modifiqué marcas, **cuando** hago clic en `Apply`, **entonces** el sub-modal se cierra y el modal principal "recibe" la nueva selección.
- **Dado** que Apply se procesó, **cuando** re-abro el sub-modal, **entonces** las marcas reflejan el estado confirmado.
- **Dado** que Apply confirmó, **cuando** luego pulso `Save` en el modal principal, **entonces** el PDF contiene solo los OPDs marcados.

**Reglas y restricciones:**
- Apply no dispara la generación del PDF — solo persiste la selección al estado del modal padre.
- Para generar el PDF se requiere Save posterior (HU-60.007).

**Modelo de datos tocado:**
- `exportPdfConfig.selectedOpds` — set — commit del estado temporal.

**Dependencias:**
- Bloqueada por: HU-60.018 a HU-60.022.

**Notas de evidencia:**
- Fuente: §2 tabla, §3.3 paso 6.
- Frames: frame_00011 (botón Apply visible).
- Clase de afirmación: observado.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [export-pdf, selector-opds, apply, confirmación].

---

### HU-60.024 — Descartar selección con botón Cancel en sub-modal

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** sub-modal-select-opds, botón `Cancel` pie.
**Gesto canonico:** clic.

**Historia:**
> Como modelador experto, quiero descartar los cambios de selección con Cancel para revertir a la selección previa sin perder tiempo reconstruyéndola.

**Contexto de negocio:**
Cancel es la ruta de escape: si me equivoqué marcando/desmarcando, Cancel restaura el estado previo al último Apply. Sin Cancel, el único recurso sería remarcar manualmente.

**Criterios de aceptación:**
- **Dado** que el sub-modal está abierto y modifiqué marcas tentativas, **cuando** hago clic en `Cancel`, **entonces** el sub-modal se cierra sin aplicar cambios.
- **Dado** que cancelé, **cuando** re-abro el sub-modal, **entonces** las marcas muestran el último estado confirmado por Apply (o el default si nunca hubo Apply).
- **Dado** que cancelé, **cuando** pulso Save en el modal principal, **entonces** el PDF usa la selección pre-Cancel (último Apply).

**Reglas y restricciones:**
- Cancel descarta el estado tentativo del sub-modal.
- ESC equivale a Cancel (**hipótesis** por convención modal).

**Dependencias:**
- Bloqueada por: HU-60.019.

**Notas de evidencia:**
- Fuente: §2 tabla, §3.3 paso 6.
- Frames: frame_00011 (botón Cancel visible).
- Clase de afirmación: observado.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [export-pdf, selector-opds, cancel].

---

### HU-60.025 — Generar portada con metadata del modelo

**Actor primario:** RV.
**Tipo:** opm-semantica.
**Nivel categorico:** X primario; L (metadata) secundario.
**Superficie UI:** PDF generado, página 1.
**Gesto canonico:** ninguno (render automático).

**Historia:**
> Como revisor, quiero que el PDF abra con una portada identificadora del modelo para saber inmediatamente de qué modelo se trata al hojear el archivo.

**Contexto de negocio:**
La portada es la carátula de contexto: quien recibe el PDF sabe título, autor, descripción, fecha, URL en un vistazo. Sin portada, el PDF sería solo un blob de diagramas sin contexto.

**Criterios de aceptación:**
- **Dado** que el PDF se generó, **cuando** abro la pagina 1, **entonces** muestra el título del modelo (p. ej. `OnStar Example`) en tamaño destacado.
- **Dado** que la portada está, **cuando** miro los campos secundarios, **entonces** veo `Last edited`, `Created by: OPCloud Modeler` (reemplazar por `OPM Model App` cuando corresponda), `Description: <texto>` en itálica.
- **Dado** que `Include Model URL=on`, **cuando** miro la portada, **entonces** hay línea `Model URL: <url>` en itálica.
- **Dado** que hay líneas separadoras, **cuando** miro, **entonces** veo líneas horizontales azul navy separando secciones (bajo título, bajo descripción, bajo Model URL).
- **Dado** que la portada existe, **cuando** miro el pie, **entonces** no hay número de página visible (la numeración del visor empieza en 1 para la portada misma — §9).

**Reglas y restricciones:**
- Campos obligatorios: título, línea separadora.
- Campos condicionales: `Description` si no vacía, `Model URL` si toggle on.
- Tipografía: título negrita grande; secundarios itálica; headings del ToC negrita (§9).

**Modelo de datos tocado:**
- `model.name`, `model.description`, `model.createdBy`, `model.lastEdited`, `model.modelId` — persistentes, solo lectura.

**Dependencias:**
- Bloqueada por: HU-60.007.
- Integra: HU-60.009 (Model URL).

**Notas de evidencia:**
- Fuente: §3.1 paso 7 (bullet pagina 1), §9.
- Frames: frame_00023.
- Clase de afirmación: observado.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [export-pdf, portada, metadata, primera-página].

---

### HU-60.026 — Generar Table of Contents con entradas de secciones

**Actor primario:** RV.
**Tipo:** mixto.
**Nivel categorico:** X primario; L secundario.
**Superficie UI:** PDF generado, sección ToC dentro de la portada.
**Gesto canonico:** ninguno.

**Historia:**
> Como revisor, quiero ver una tabla de contenidos al inicio para navegar a las secciones relevantes sin recorrer el PDF entero.

**Contexto de negocio:**
ToC es navegación: en PDFs grandes (55 paginas) salta directo a la sección de interés. Clickeable idealmente (hyperlinks internos) pero incluso como texto es orientador.

**Criterios de aceptación:**
- **Dado** que el PDF se generó, **cuando** miro el pie de la portada, **entonces** hay heading `Table of contents` con entradas de secciones.
- **Dado** que las secciones estándar están, **cuando** miro el ToC, **entonces** incluye `OPD Tree`, `DIAGRAMS & OPL`, `ELEMENTS DICTIONARY` (con sub-entradas `Things: Objects, Processes`), `Relations: Procedural, Fundamental`.
- **Dado** que flujo actualizado incluye Requirement Views, **cuando** `Include Requirement Views=on`, **entonces** el ToC incluye entrada `Requirement Views`.
- **Dado** que `Include Elements Dictionary=off`, **cuando** miro el ToC, **entonces** la entrada correspondiente no aparece.
- **Dado** que el ToC es clicable, **cuando** hago clic en una entrada, **entonces** el visor PDF salta a la pagina correspondiente (**hipótesis** — no observado explícitamente, depende del renderizador PDF).

**Reglas y restricciones:**
- Las entradas del ToC reflejan las secciones que se materializan según toggles.
- Formato: indentación textual, sub-entradas con sangría adicional (§9).
- Hyperlinks internos — **pregunta abierta** §11.11 (accesibilidad).

**Dependencias:**
- Bloqueada por: HU-60.025.
- Integra: HU-60.014, HU-60.015 (condicionan entradas).

**Notas de evidencia:**
- Fuente: §3.1 paso 7 (pagina 1).
- Frames: frame_00023.
- Clase de afirmación: observado.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [export-pdf, toc, navegación, portada].

---

### HU-60.027 — Generar sección OPD Tree con indentación textual

**Actor primario:** RV.
**Tipo:** opm-semantica.
**Nivel categorico:** X primario; L secundario.
**Superficie UI:** PDF generado, página 2 (después de portada).
**Gesto canonico:** ninguno.

**Historia:**
> Como revisor, quiero ver la jerarquía de OPDs del modelo listada textualmente para entender la estructura de navegación del modelo en papel.

**Contexto de negocio:**
El OPD Tree en el PDF replica el árbol de navegación del modelador (EPICA-20). Permite al lector reconstruir mentalmente la estructura sin abrir OPCloud. Usa indentación simple como único marcador visual.

**Criterios de aceptación:**
- **Dado** que el PDF se generó, **cuando** paso a la pagina 2, **entonces** veo heading `OPD Tree` seguido de lista jerárquica textual.
- **Dado** que hay OPDs anidados, **cuando** miro la lista, **entonces** la indentación simple (espacios) refleja la profundidad (`SD`, ` SD1: Driver Rescuing in-zoomed`, `  SD1.1: …`).
- **Dado** que no hay viñetas ni líneas de árbol, **cuando** miro, **entonces** la indentación textual es el único marcador (§9).
- **Dado** que usé Select OPDs con selección parcial, **cuando** miro el OPD Tree, **entonces** comportamiento es **pregunta abierta** §11.4 (¿el árbol refleja todo el modelo o solo los OPDs seleccionados?).

**Reglas y restricciones:**
- Indentación textual simple (§9).
- Incluye todos los OPDs del modelo, independiente de Select OPDs — **hipótesis** §5.3.
- Nombre del OPD sigue convención del árbol (`SD`, `SD1: <nombre in-zoomed/unfolded>`).

**Dependencias:**
- Bloqueada por: HU-60.007.
- Integra: EPICA-20 (fuente del árbol).

**Notas de evidencia:**
- Fuente: §3.1 paso 7 (pagina 2), §9.
- Frames: implícito en la muestra (no frame dedicado del OPD Tree).
- Clase de afirmación: observado + abierto (comportamiento con Select OPDs parcial).

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [export-pdf, opd-tree, jerarquía, indentación].

---

### HU-60.028 — Generar sección Diagrams & OPL con rasterización por OPD

**Actor primario:** RV.
**Tipo:** opm-semantica.
**Nivel categorico:** X primario; V (rasterización) secundario; L (OPL) secundario.
**Superficie UI:** PDF generado, sección central multi-pagina.
**Gesto canonico:** ninguno.

**Historia:**
> Como revisor, quiero ver cada OPD como imagen seguida de su OPL para leer el modelo en formato papel sin pérdida de legibilidad.

**Contexto de negocio:**
El núcleo del PDF: por cada OPD elegido, una imagen rasterizada del diagrama + el bloque OPL correspondiente. Es donde se materializa la dualidad gráfico-textual de OPM.

**Criterios de aceptación:**
- **Dado** que el PDF se generó, **cuando** paso a la sección `DIAGRAMS & OPL`, **entonces** hay un heading global de la sección.
- **Dado** que por cada OPD hay bloque, **cuando** miro uno, **entonces** tiene: nombre del OPD como headline (p. ej. `SD`), rasterización del OPD como imagen bitmap, bloque OPL numerado abajo.
- **Dado** que `Number OPL sentences=on` y flujo original, **cuando** miro el OPL, **entonces** numera desde 1 en cada OPD (`1. Driver is environmental. 2. Danger Status of Driver is informatical. …`).
- **Dado** que `Number OPL sentences=on` y flujo actualizado, **cuando** miro el OPL, **entonces** la numeración es global continua (HU-60.013).
- **Dado** que `Select OPDs to Export` excluyó algunos, **cuando** miro la sección, **entonces** solo aparecen los OPDs marcados.

**Reglas y restricciones:**
- Rasterización, no vectorial (§9).
- Resolución configurable por HU-60.017.
- OPL mantiene cromatismo textual (HU-60.031).
- Orden: orden del OPD Tree (DFS por defecto — **hipótesis**).

**Modelo de datos tocado:**
- `model.opds` — lista — lectura.
- OPL computado on-the-fly.

**Dependencias:**
- Bloqueada por: HU-60.007, HU-60.017, HU-60.023 (si hay selección parcial).
- Bloquea a: HU-60.031 (preservación visual).

**Integraciones:**
- Renderer JointJS (produce bitmap del OPD).
- Motor OPL (genera oraciones).

**Notas de evidencia:**
- Fuente: §3.1 paso 7 (Páginas siguientes), §3.2, §9.
- Frames: frame_00025 (SD rasterizada + OPL numerado), frame_00021 (OPL global).
- Clase de afirmación: observado.

**Prioridad:** C.
**Tamano:** L.
**Etiquetas:** [export-pdf, diagrams, rasterización, opl, núcleo].

---

### HU-60.029 — Generar Elements Dictionary con cromatismo textual por clase

**Actor primario:** RV.
**Tipo:** mixto.
**Nivel categorico:** X primario; L secundario.
**Superficie UI:** PDF generado, sección Elements Dictionary.
**Gesto canonico:** ninguno.

**Historia:**
> Como revisor, quiero ver un diccionario de elementos con nombres coloreados por clase para reconocer tipos de un vistazo en un listado largo.

**Contexto de negocio:**
El cromatismo textual (verde=objetos, azul=procesos, itálica oliva=estados) replica el cromatismo del canvas. Da continuidad visual entre canvas y papel, refuerza aprendizaje de tipos, y facilita búsqueda rápida en el listado.

**Criterios de aceptación:**
- **Dado** que `Include Elements Dictionary=on`, **cuando** paso a la sección, **entonces** veo heading centrado `ELEMENTS DICTIONARY`.
- **Dado** que el diccionario tiene subsecciones, **cuando** miro, **entonces** veo `Things` con sub-subsecciones `Objects:` y `Processes:`.
- **Dado** que hay objetos, **cuando** miro la lista, **entonces** cada uno aparece como `Object Name: <X>` con `<X>` en **verde**, seguido de `Object Opds: <lista OPDs>` en itálica.
- **Dado** que hay procesos, **cuando** miro, **entonces** cada uno aparece como `Process Name: <Y>` con `<Y>` en **azul**.
- **Dado** que un objeto tiene estados, **cuando** miro bajo el objeto, **entonces** los estados aparecen en itálica oliva (`requested`, `online`, `safe`).
- **Dado** que `Include Entities Description=on`, **cuando** una entidad tiene descripción, **entonces** aparece línea `Description: <texto>` en itálica bajo la entidad.

**Reglas y restricciones:**
- Cromatismo textual: verde (objetos), azul (procesos), oliva itálica (estados) — §9.
- Itálica para valores/campos secundarios.
- Negrita para headings y subheadings con `:` final.

**Modelo de datos tocado:**
- Lente Elements Dictionary: iteración sobre `model.things`.

**Dependencias:**
- Bloqueada por: HU-60.007, HU-60.015 (toggle de inclusión).
- Integra: HU-60.010 (descripción), HU-60.031 (fidelidad visual).

**Notas de evidencia:**
- Fuente: §3.1 paso 7 (bullet Elements Dictionary), §9.
- Frames: frame_00026 (Objects con `Object Name: Driver` verde, `Object Opds:` itálica), frame_00021 (cromatismo textual confirmado).
- Clase de afirmación: observado.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [export-pdf, elements-dictionary, cromatismo, lente].

---

### HU-60.030 — Generar sección Relations con agrupación por tipo

**Actor primario:** RV.
**Tipo:** mixto.
**Nivel categorico:** X primario; L secundario.
**Superficie UI:** PDF generado, sección `Relations`.
**Gesto canonico:** ninguno.

**Historia:**
> Como revisor, quiero ver todas las relaciones del modelo agrupadas por tipo para auditar la gramática de enlaces del modelo.

**Contexto de negocio:**
El listado de relaciones es auditoría: permite verificar que los tipos de link usados son correctos, que no faltan relaciones esperadas, que las direcciones source→target son las pretendidas. Usa esquema grafo (Source/Target) en lugar de lenguaje natural OPL — divergencia intencional §9.

**Criterios de aceptación:**
- **Dado** que el PDF se generó, **cuando** paso a la sección, **entonces** hay heading `Relations`.
- **Dado** que hay relaciones procedurales, **cuando** miro, **entonces** hay subsección `Procedural Relations:` con tipos agrupados (`Effect`, `Instrument`, `Consumption`, `Result`, `Agent`).
- **Dado** que hay relaciones fundamentales, **cuando** miro, **entonces** hay subsección `Fundamental Relations:` con tipos agrupados (`Aggregation`, `Exhibition`, `Generalization`, `Classification`, `Tagged`).
- **Dado** que cada relación se lista, **cuando** miro, **entonces** aparece como `Source Name: <A>` / `Target(s) Name: <B>` en itálica.
- **Dado** que una relación tiene un solo target, **cuando** miro, **entonces** se imprime `Target Name:` (singular) — **hipótesis** §9.
- **Dado** que una relación tiene múltiples targets, **cuando** miro, **entonces** se lista `Target(s) Name: <B1>, <B2>, …` (plural).

**Reglas y restricciones:**
- Agrupación por tipo como header implícito (§9).
- Nomenclatura Source/Target (grafo), no OPL natural (§9 divergencia consciente).
- Pluralización condicional `Target(s)` — hipótesis abierta.

**Dependencias:**
- Bloqueada por: HU-60.007.
- Integra: kernel de validación (tipos de link).

**Notas de evidencia:**
- Fuente: §3.1 paso 7 (Relations bullet), §9.
- Frames: frame_00028 (`Effect` con `Source Name: Driver` / `Target(s) Name: Driver Rescuing`, luego `Instrument` con `Source Name: OnStar System`).
- Clase de afirmación: observado + hipótesis (pluralización singular).

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [export-pdf, relations, agrupación, grafo].

---

### HU-60.031 — Preservar convenciones visuales canvas↔PDF en rasterización

**Actor primario:** RV.
**Tipo:** opm-semantica.
**Nivel categorico:** V primario; X secundario.
**Superficie UI:** PDF generado, imágenes de OPDs.
**Gesto canonico:** ninguno.

**Historia:**
> Como revisor, quiero que las imágenes de OPDs en el PDF preserven las convenciones visuales del canvas para reconocer el modelo idéntico al que vi en vivo.

**Contexto de negocio:**
La continuidad visual canvas↔PDF es crítica para la credibilidad: si el PDF se ve distinto al canvas, el lector duda de cuál es la "verdad". La rasterización debe replicar fielmente cromatismo, dashed patterns, sombras, puntas de flecha, puntos de anchor, contorno grueso del refinable.

**Criterios de aceptación:**
- **Dado** que el OPD canvas tiene cromatismo de bordes (objeto verde, proceso azul oscuro, estado oliva), **cuando** miro la rasterización, **entonces** los mismos colores aparecen.
- **Dado** que una cosa tiene sombra drop-shadow en canvas, **cuando** miro la rasterización, **entonces** la sombra persiste (incluso para cosas informacionales, §4.6).
- **Dado** que un refinable tiene contorno azul claro grueso, **cuando** miro el PDF, **entonces** el contorno se preserva.
- **Dado** que un objeto environmental tiene borde dashed, **cuando** miro el PDF, **entonces** el dashed se preserva (riesgo: resolución baja puede perderlo — §11.3).
- **Dado** que un effect link tiene punta abierta (triángulo vacío), **cuando** miro el PDF, **entonces** la punta mantiene la forma.
- **Dado** que hay puntos de anchor `•` en confluencia de enlaces, **cuando** miro el PDF, **entonces** los puntos persisten.
- **Dado** que el canvas tiene artefactos UI-only (triángulo flotante, anchor circles de selección, handles, grilla), **cuando** miro el PDF, **entonces** estos artefactos NO aparecen (§6.3).

**Reglas y restricciones:**
- Preservación: cromatismo, sombras, dashed, contorno grueso, flechas, anchors de link (§6.3).
- Eliminación: UI-only (selección, handles, grilla, triángulo flotante) (§6.3).
- Cláusula V-0 propuesta: distinguir semántica gramatical vs UI-only decoration.

**Modelo de datos tocado:**
- Ninguno (solo render).

**Dependencias:**
- Bloqueada por: HU-60.007, HU-60.017 (resolución).

**Integraciones:**
- Renderer JointJS debe exportar bitmap fiel al canvas visible.
- SSOT visual (`ssot/opm-visual-es.md` V-xx).

**Notas de evidencia:**
- Fuente: §4.6, §6.3, §9.
- Frames: frame_00017 (sombras y refinable en canvas), frame_00025 (mismas en PDF), frame_00033 (confirmación post-export).
- Clase de afirmación: observado críticamente.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [export-pdf, render, fidelidad-visual, rasterización, cromatismo].

---

### HU-60.032 — Abrir modal Share Model con URL copiable

**Actor primario:** CO (colaborador editor).
**Actores secundarios:** RV, AD.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; X (genera URL) secundario.
**Superficie UI:** modal `Share Model` centrado sobre canvas.
**Gesto canonico:** clic en paper-plane de main toolbar o `Model Options ▸ Copy Link`.

**Historia:**
> Como colaborador, quiero abrir el diálogo Share Model para obtener la URL del modelo y compartirla con otros.

**Contexto de negocio:**
Share Model es el canal canónico para propagar el modelo vía URL. La misma URL aparece como `Model URL` en la portada del PDF (§7.8), por eso se cubre en esta épica aunque estructuralmente sea una feature de colaboración.

**Criterios de aceptación:**
- **Dado** que estoy en el canvas, **cuando** hago clic en el botón paper-plane de main toolbar o en `Model Options ▸ Copy Link`, **entonces** se abre el modal `Share Model`.
- **Dado** que el modal se abrió, **cuando** miro el contenido, **entonces** hay campo pre-cargado con `https://opcloud.systems/load/<modelId>` (equivalente a mi dominio en opm-model-app), el texto está seleccionado para copia rápida.
- **Dado** que el modal está abierto, **cuando** miro los controles, **entonces** veo botón `Copy` a la derecha del campo, checkbox `Include OPD in URL` (default off), y leyenda `Anyone with this link may view the model`.
- **Dado** que el modal está abierto, **cuando** presiono ESC o clic fuera, **entonces** se cierra sin copiar.

**Reglas y restricciones:**
- El modal es equivalente funcional entre ambos activadores (toolbar + Model Options §7.2).
- La URL usa el `modelId` único del modelo persistido.
- Pregunta de permisos: "Anyone with link may view" — acoplado a EPICA-40.

**Modelo de datos tocado:**
- `model.modelId` — persistente, lectura.

**Dependencias:**
- Integra: EPICA-40 (colaboración-permisos).

**Notas de evidencia:**
- Fuente: §2 tabla, §3.4 paso 1–2, §7.2.
- Frames: frame_00032.
- Clase de afirmación: observado.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [share, ui, modal, url].

---

### HU-60.033 — Copiar Model URL al clipboard con botón Copy

**Actor primario:** CO.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; X secundario.
**Superficie UI:** modal `Share Model`, botón `Copy`.
**Gesto canonico:** clic.

**Historia:**
> Como colaborador, quiero copiar la URL al clipboard con un clic para pegarla en chat/email sin manipular el campo de texto.

**Contexto de negocio:**
Copy al clipboard es la acción primaria del modal: elimina el paso manual de seleccionar texto + Ctrl+C. Es el gesto atómico de la feature.

**Criterios de aceptación:**
- **Dado** que el modal `Share Model` está abierto, **cuando** hago clic en `Copy`, **entonces** la URL vigente se escribe al clipboard del sistema.
- **Dado** que copié la URL, **cuando** pego en otra aplicación (chat, email), **entonces** aparece la URL completa sin pérdida.
- **Dado** que el navegador bloquea acceso al clipboard (política de permisos), **cuando** hago clic en Copy, **entonces** el comportamiento es **pregunta abierta** (toast de error, fallback a selección).
- **Dado** que hice clic en Copy, **cuando** miro el modal, **entonces** el modal permanece abierto o cierra (**hipótesis**: permanece abierto para permitir copiar con variantes de toggle Include OPD).

**Reglas y restricciones:**
- El Copy usa la URL que el toggle Include OPD determina en ese momento.
- Requiere permiso de clipboard del navegador (política estándar).

**Dependencias:**
- Bloqueada por: HU-60.032.

**Notas de evidencia:**
- Fuente: §2 tabla, §3.4 paso 4.
- Frames: frame_00032 (botón Copy visible).
- Clase de afirmación: observado.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [share, clipboard, copy, url].

---

### HU-60.034 — Incluir OPD activo en la URL compartida (toggle Include OPD in URL)

**Actor primario:** CO.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; X secundario.
**Superficie UI:** modal `Share Model`, checkbox `Include OPD in URL`.
**Gesto canonico:** clic.

**Historia:**
> Como colaborador, quiero incluir el OPD activo en la URL compartida para que el destinatario aterrice directamente en el OPD que quiero mostrarle.

**Contexto de negocio:**
Dirigir al destinatario a un OPD específico ahorra el paso "navega hasta SD1.1.1". En modelos grandes, eso es navegación crítica. Default off porque el caso típico es compartir el modelo raíz.

**Criterios de aceptación:**
- **Dado** que el toggle está desmarcado (default), **cuando** copio la URL, **entonces** es la URL base `https://opcloud.systems/load/<modelId>`.
- **Dado** que el toggle está marcado y hay un OPD activo, **cuando** copio, **entonces** la URL incluye referencia al OPD activo (**inferido** §5.4, formato exacto **pregunta abierta** §11.5).
- **Dado** que cambio el OPD activo sin cerrar el modal, **cuando** vuelvo al modal, **entonces** la URL se recompone con el nuevo OPD (**hipótesis**).
- **Dado** que el toggle está on pero no hay OPD activo (edge case), **cuando** copio, **entonces** comportamiento es **pregunta abierta**.

**Reglas y restricciones:**
- Default: off (§5.4).
- Formato exacto de la URL con OPD: `?opd=<opdId>` | `#opd=<opdId>` | `/opd/<opdId>` — **pregunta abierta** §11.5.
- La URL generada aparece idénticamente en la portada del PDF si `Include Model URL=on` (§7.8).

**Modelo de datos tocado:**
- `shareConfig.includeOpdInUrl` — bool — transitorio.
- OPD activo del canvas (`appState.activeOpd`) — transitorio.

**Dependencias:**
- Bloqueada por: HU-60.032.
- Integra: HU-60.009 (Model URL en portada PDF).

**Notas de evidencia:**
- Fuente: §3.4 paso 3, §5.4.
- Frames: frame_00032 (checkbox visible).
- Transcripción: "if i want him to be linked directly to a specific opd within the model i can select it" (§3.4).
- Clase de afirmación: confirmado por transcripción + abierto (formato URL exacto).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [share, opd, url, toggle, requires-clarification].

---

### HU-60.035 — Abrir Share Model desde botón paper-plane de main toolbar

**Actor primario:** CO.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** main toolbar azul superior, ícono paper-plane.
**Gesto canonico:** clic.

**Historia:**
> Como colaborador frecuente, quiero un atajo en la toolbar para abrir Share Model sin pasar por main menu.

**Contexto de negocio:**
El botón en toolbar es atajo redundante de `Model Options ▸ Copy Link` (§7.2). Reduce viajes del cursor para una feature que se usa a menudo al colaborar.

**Criterios de aceptación:**
- **Dado** que estoy en el canvas, **cuando** miro la main toolbar azul, **entonces** veo un ícono paper-plane al lado del botón permission.
- **Dado** que hago clic en el paper-plane, **cuando** se procesa, **entonces** se abre el modal `Share Model` (equivalente funcional a HU-60.032).
- **Dado** que uso ambos canales (toolbar y menu), **cuando** comparo los modales abiertos, **entonces** son idénticos.

**Reglas y restricciones:**
- Equivalencia funcional con `Model Options ▸ Copy Link` (§7.2).
- Ícono paper-plane es convención observada.
- Posición: adyacente al botón permission en la toolbar azul.

**Dependencias:**
- Bloquea a: HU-60.032 (modal que abre).

**Notas de evidencia:**
- Fuente: §2 tabla, §3.4 paso 1, §7.2.
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [share, toolbar, atajo, paper-plane].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q60.1**: Ubicación exacta de los tooltips de procesos computacionales en el PDF cuando `Include Computational Processes Tooltips=on`. ¿Junto al proceso en Elements Dictionary, como apéndice, o inline en el OPL? (cf. HU-60.011).
- **Q60.2**: La marca de agua `Confidential` — ¿todas las paginas o solo portada? ¿Color, opacidad, orientación? (cf. HU-60.016). Propuesta de default: diagonal centrada, gris claro opacity 0.2.
- **Q60.3**: Diferencia exacta de `OPDs Resolution` a valores distintos de 3; umbral mínimo para preservar distinciones V-* (dash pattern, grosor refinable). (cf. HU-60.017, HU-60.031).
- **Q60.4**: `Select OPDs to Export` parcial — ¿afecta también Elements Dictionary y Relations, o solo Diagrams & OPL? Si solo este último, el PDF puede ser **internamente inconsistente** (habla de elementos cuya OPD visualizadora fue excluida). (cf. HU-60.027).
- **Q60.5**: Formato exacto de URL cuando `Include OPD in URL=on`. ¿`?opd=…`, `#opd=…`, `/opd/…`? (cf. HU-60.034).
- **Q60.6**: ¿Existe toggle `Include Unloaded Sub-Models`? No observado en frames muestreados; posible versión más reciente o feature en EPICA-32 (cf. §11.6 fuente).
- **Q60.7**: ¿El export requiere que el modelo esté guardado? ¿Se exportan cambios no persistidos? (cf. HU-60.007, §7.3).
- **Q60.8**: ¿Cómo se comporta el export sobre modelo de solo-lectura (permisos read-only)?
- **Q60.9**: ¿Flujo actualizado reemplaza al original en todas las instancias, o coexisten? Transcripción de Intro 34 no integrada completa.
- **Q60.10**: ¿La numeración OPL global preserva cross-references internas ("según oración 22…") o es puramente secuencial? (cf. HU-60.013).
- **Q60.11**: ¿El PDF tiene tags de accesibilidad para screen readers, o es puramente visual? (cf. HU-60.025, HU-60.026).
- **Q60.12**: ¿El tab del PDF es persistente (se recarga en futuras exportaciones) o se abre nuevo cada vez? (cf. HU-60.008).
- **Q60.13**: Comportamiento del botón Save con File name vacío — ¿validación de requerido o fallback? (cf. HU-60.004).
- **Q60.14**: Tabla exacta de saneamiento de caracteres para File name (cf. HU-60.005).
- **Q60.15**: ¿Existe spinner visible durante la generación? (cf. HU-60.006, §4.1).
- **Q60.16**: Comportamiento con selección vacía del árbol de OPDs — ¿PDF solo con portada + ToC + Elements Dict + Relations, o error? (cf. HU-60.023, §4.3).
- **Q60.17**: clic simple sobre nodo padre semi-marcado — ¿marca todos? ¿desmarca todos? ¿alterna solo padre? (cf. HU-60.022).

## Referencias cruzadas

- Doc fuente: `opcloud-reverse/60-export-pdf.md`.
- Épicas que integran esta:
  - **EPICA-30** (persistencia-save-load): provee `modelId`, nombre y metadata del modelo para la portada y URL.
  - **EPICA-20** (estructura-opd-tree): provee el árbol jerárquico para el sub-modal Select OPDs y para la sección OPD Tree del PDF.
  - **EPICA-50** (opl-pane): provee motor OPL para la sección Diagrams & OPL.
  - **EPICA-10/11/15** (canvas): proveen las primitivas Things/Links cuyo render se rasteriza al PDF.
  - **EPICA-A1** (extension-requirements): provee Requirement Views que el toggle puede incluir (HU-60.014).
  - **EPICA-B1** (simulation-computational): provee tooltips de procesos computacionales (HU-60.011).
  - **EPICA-40** (colaboracion-permisos): define quién puede abrir la URL compartida.
  - **EPICA-61** (export-svg): comparte submenú Exports, alternativa vectorial al PDF rasterizado.
  - **EPICA-81** (config-style-defaults): podría definir defaults del modal por organización (incluyendo Watermark permanente).
- Invariantes del repo:
  - `src/render/jointjs/` — renderer debe exponer API de rasterización escalada para HU-60.017, HU-60.028.
  - `src/render/opl-renderer.ts` — motor OPL para HU-60.012, HU-60.013.
  - `src/persistencia/` — expone metadata del modelo para portada (HU-60.025).
  - Lentes (no existen aún como capa explícita): candidatas a aparecer para Elements Dictionary (HU-60.029) y Relations (HU-60.030) siguiendo el patrón `prepararEstado → passes → sink` del repo.
- SSOT:
  - [V-0a] canon-documento: todo modelo OPM debe poder exportarse como artefacto de documento canonico.
  - `ssot/opm-visual-es.md` V-* — convenciones visuales que HU-60.031 debe preservar.
  - Clausula V-0 (distinguir semantica gramatical vs UI-only decoration) aplicable a §6.3 del doc fuente; [V-0a] aplicable a toda la epica.
