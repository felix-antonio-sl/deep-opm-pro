---
epica: "EPICA-A2"
titulo: "Extensión GenerativeAI — AI Reqs Generation (generación asistida de requirements)"
doc_fuente: "opcloud-reverse/a2-extension-generative-ai.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "C"
hu_emitidas: 24
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "EPICA-10-canvas-creacion-cosas.md"
---

## Resumen

Esta épica cubre la capa **GenerativeAI** de OPCloud, específicamente la función **AI Reqs Generation**: un flujo que toma el modelo OPM activo (OPL + triples) y produce un conjunto de requirements clasificados (Structural, Interface, Functional, State) entregados como texto estructurado en modal, planilla Excel multi-hoja y copia al portapapeles. Es **auxiliar a EPICA-A1** (requirements canvas-nativo): A2 genera propuestas IA read-only; A1 materializa requirements como estereotipos `<<Requirement>>` en canvas. El diseño OPCloud observado no tiene round-trip entre ambos regímenes, y esta épica documenta ese límite **más la ampliación necesaria** para convertir A2 en un asistente útil al modelador OPM de este repo (accept/reject/edit workflow, auditoría de origen, provider configuration).

El alcance inventariado abarca el pipeline observado (menú → modal → GO! → spinner → listado → Excel/portapapeles) y las HU derivadas para cerrar preguntas abiertas del doc fuente (§11): re-generación con diff, round-trip hacia A1, manejo de error, idiomas, parámetros LLM, gestión de plantillas de instrucción, historial de generaciones, auditoría humano vs IA y privacidad.

Por tratarse de una extensión que depende de servicio externo (Gemini u otro LLM), la prioridad predominante es **C** (could-have) con anclas **M1** en la integración mínima con A1 (flag de origen, vía `requirement.origin`) y **S** en provider configuration (clave API, modelo). Varias HU se marcan `requires-clarification` porque las respuestas de OPCloud no son observables directamente. La SSOT OPM no regula características de IA generativa; esta épica documenta funcionalidad de superficie de OPCloud.

## Tabla de HU de la épica

| ID | Título | Actor | Prioridad | Tamaño | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-A2.001 | Acceder a AI Reqs Generation desde menú GenerativeAI | AD | C | XS | opcloud-ui | — |
| HU-A2.002 | Abrir modal GenerativeAI con estado inicial y velo sobre canvas | AD | C | S | opcloud-ui | — |
| HU-A2.003 | Disparar generación IA con botón GO! y ver spinner de espera | AD | C | S | opcloud-ui | — |
| HU-A2.004 | Construir instrucción interna desde OPL y triples del modelo activo | AD | S | L | mixto | [OPL-ES §1..§2] |
| HU-A2.005 | Configurar provider LLM y API key desde Update API Key | AO | S | M | opcloud-ui | — |
| HU-A2.006 | Cancelar modal con Close antes o después de GO! | AD | C | XS | opcloud-ui | — |
| HU-A2.007 | Renderizar listado enriquecido de REQ-NNNN en el modal | AD | C | M | opcloud-ui | — |
| HU-A2.008 | Clasificar cada requirement en Structural/Interface/Functional/State | AD | S | M | mixto | [V-239] |
| HU-A2.009 | Completar atributos automáticos (rationale, AC, verification, status) | AD | S | M | opcloud-ui | — |
| HU-A2.010 | Generar jerarquía de requirements con ParentID y sufijos (REQ-0006a) | AD | C | S | opcloud-ui | — |
| HU-A2.011 | Copiar listado completo al portapapeles desde el modal | AD | C | XS | opcloud-ui | — |
| HU-A2.012 | Descargar Excel multi-hoja con Requirements + Stats | AD | C | M | opcloud-ui | — |
| HU-A2.013 | Re-disparar generación y decidir política (reemplazar/diff/acumular) | AD | C | M | opcloud-ui | — |
| HU-A2.014 | Sugerir requirements faltantes contra modelo OPM actual | AD | C | L | mixto | [V-1 §1.2] |
| HU-A2.015 | Revisar redacción de requirement (lint natural-language) | AD | C | M | opcloud-ui | — |
| HU-A2.016 | Configurar idioma de generación (es/en) | AD | C | S | opcloud-ui | — |
| HU-A2.017 | Gestionar plantillas de instrucción nombradas y versionadas | AO | C | L | opcloud-ui | — |
| HU-A2.018 | Ver historial de generaciones por modelo (timestamp, instrucción, output) | AD | C | M | opcloud-ui | — |
| HU-A2.019 | Workflow accept/reject/edit por requirement generado | AD | M1 | L | opcloud-ui | — |
| HU-A2.020 | Materializar requirement aceptado como estereotipo `<<Requirement>>` en canvas | AD | M1 | L | mixto | — |
| HU-A2.021 | Marcar origen IA vs humano en auditoría de requirement | AD | M1 | S | opcloud-ui | — |
| HU-A2.022 | Exponer conteo de tokens y costo estimado por generación | AO | C | M | opcloud-ui | — |
| HU-A2.023 | Garantizar privacy: opt-in al envío del modelo a LLM externo | AO | S | M | opcloud-ui | — |
| HU-A2.024 | Reportar errores de la API IA (timeout, auth, cuota, malformed) | AD | S | S | opcloud-ui | — |

Total: **24 historias de usuario** (20 opcloud-ui, 4 mixto).

## Historias de usuario

### HU-A2.001 — Acceder a AI Reqs Generation desde menú GenerativeAI

**Actor primario:** AD (autor de dominio).
**Actores secundarios:** ME (experto).
**Tipo:** opcloud-ui.
**Nivel categórico:** U (interacción UI).
**Superficie UI:** menú hamburguesa principal + submenú GenerativeAI.
**Gesto canónico:** clic en icono ☰ → hover/clic en `GenerativeAI` → clic en `AI Reqs Generation`.

**Historia:**
> Como autor de dominio, quiero abrir `AI Reqs Generation` desde el submenú GenerativeAI para activar la generación asistida sin buscar el control en otra superficie.

**Contexto de negocio:**
El submenú `GenerativeAI` concentra las funciones IA del producto (AI OPD Summary, AI Model Summary, AI Impact Analysis, AI Reqs Generation, Update API Key). Ubicarlas ahí mantiene el menú principal limpio y facilita la gobernanza de la clave compartida Gemini.

**Criterios de aceptación:**
- **Dado** que estoy con un modelo OPM abierto, **cuando** hago clic en el icono ☰ del header, **entonces** se despliega el menú principal con la entrada `GenerativeAI ▶`.
- **Dado** que el menú principal está abierto, **cuando** hago hover o clic sobre `GenerativeAI`, **entonces** se despliega el submenú con al menos `AI Reqs Generation` y `Update API Key`.
- **Dado** que el submenú está abierto, **cuando** hago clic en `AI Reqs Generation`, **entonces** el menú se cierra y se abre el modal `GenerativeAI - System Requirements Generation`.
- **Dado** que no hay modelo abierto, **cuando** abro el menú, **entonces** la entrada `AI Reqs Generation` queda deshabilitada (pregunta abierta, ver Q-A2.1).

**Reglas y restricciones:**
- El submenú comparte marca `by Gemini AI` con el resto de entradas IA.
- La entrada de menú no porta shortcut de teclado observado.

**Dependencias:**
- Relaciona: HU-A2.002 (apertura del modal), HU-A2.005 (Update API Key).

**Integraciones:**
- Estado del menú principal; enrutamiento a modal.

**Notas de evidencia:**
- Fuente: `opcloud-reverse/a2-extension-generative-ai.md` §2, §3.1, frame_00003.
- Clase de afirmación: observado.

**Prioridad:** C.
**Tamaño:** XS.
**Etiquetas:** [genai, menu, ui].

---

### HU-A2.002 — Abrir modal GenerativeAI con estado inicial y velo sobre canvas

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; V (render velo) secundario.
**Superficie UI:** modal-genai-reqs + overlay sobre canvas.
**Gesto canónico:** ninguno (consecuencia de HU-A2.001).

**Historia:**
> Como autor de dominio, quiero ver el modal de AI Reqs Generation con el estado inicial claro (botones, mensaje de espera, download deshabilitado) para comprender qué va a ocurrir antes de disparar.

**Contexto de negocio:**
El modal es el contenedor único del flujo IA. Abrirlo con affordances visibles pero inactivas (download deshabilitado hasta que haya output) comunica el ciclo de vida sin ocultar controles. El velo translúcido mantiene el canvas legible para orientación del modelador.

**Criterios de aceptación:**
- **Dado** que se abrió el modal, **cuando** miro su contenido, **entonces** veo: título `GenerativeAI - System Requirements Generation`, subtítulo `by Gemini AI`, descripción funcional, tres botones (`GO!` habilitado azul, `Close` habilitado, `Download Reqs Excel` **deshabilitado gris**) y mensaje informativo sobre el tiempo de espera.
- **Dado** que el modal está abierto, **cuando** miro detrás, **entonces** el canvas se mantiene visible bajo un velo translúcido que lo atenúa sin ocultarlo.
- **Dado** que el modal está abierto, **cuando** intento interactuar con el canvas, **entonces** los eventos son capturados por el overlay (no llegan al modelo).
- **Dado** que la sesión ya ejecutó una generación previa, **cuando** abro el modal de nuevo, **entonces** el listado puede estar presente (cache intra-sesión) o vacío (pregunta abierta Q-A2.2).

**Reglas y restricciones:**
- Ancho observado ~520 px; diseño responsive abierto a ajuste.
- El velo translúcido es convención UI de OPCloud para modales bloqueantes.
- El mensaje de tiempo advierte: "AI Generating Requirements of the model takes time, and for a larger model it can take a few minutes."

**Modelo de datos tocado:**
- Estado UI transitorio `modalState.genaiReqs = { status: "idle" | "loading" | "populated" | "error" }`.

**Dependencias:**
- Bloqueada por: HU-A2.001.
- Bloquea a: HU-A2.003, HU-A2.006.

**Integraciones:**
- Capa de modales del shell UI.
- Canvas (pasivamente, bajo velo).

**Notas de evidencia:**
- Fuente: §2, §3.1, §4 (velo), frames 5, 10, 14, 18, 25.
- Clase de afirmación: observado.

**Prioridad:** C.
**Tamaño:** S.
**Etiquetas:** [genai, modal, ui, velo].

---

### HU-A2.003 — Disparar generación IA con botón GO! y ver spinner de espera

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; X (integración externa) secundario.
**Superficie UI:** modal-genai-reqs (botón GO! + panel de resultados).
**Gesto canónico:** clic en `GO!`.

**Historia:**
> Como autor de dominio, quiero disparar la generación de requirements con un clic en `GO!` y ver un spinner mientras se procesa para saber que la operación está en curso.

**Contexto de negocio:**
La generación IA es una operación asíncrona con latencia alta (minutos en modelos grandes). El spinner tile (cuadrados grises agrupándose) es la iconografía estándar de "operación IA en curso" y debe estar presente hasta que llegue el output.

**Criterios de aceptación:**
- **Dado** que el modal está en estado inicial, **cuando** hago clic en `GO!`, **entonces** el panel de resultados muestra un tile-spinner animado centrado.
- **Dado** que se está esperando respuesta, **cuando** miro los botones, **entonces** `GO!` permanece habilitado (re-disparo tolerado), `Close` habilitado, `Download Reqs Excel` sigue deshabilitado.
- **Dado** que se está esperando, **cuando** el LLM responde, **entonces** el spinner se reemplaza por el listado enriquecido (HU-A2.007) y `Download Reqs Excel` se habilita.
- **Dado** que se está esperando, **cuando** cierro el modal con `Close`, **entonces** la operación pendiente se cancela (o se deja correr en background — pregunta abierta Q-A2.3).
- **Dado** que ocurre un error, **cuando** el LLM rechaza o falla, **entonces** el spinner se reemplaza por un mensaje de error (ver HU-A2.024).

**Reglas y restricciones:**
- El spinner no bloquea la interacción con `Close` ni con `GO!`.
- Timeout de fachada: sugerido 2 min, configurable en provider config (HU-A2.005). Pregunta abierta si OPCloud lo expone.

**Modelo de datos tocado:**
- `modalState.genaiReqs.status` — transitorio.
- `modalState.genaiReqs.jobId` — transitorio (si se implementa cancelación).

**Dependencias:**
- Bloqueada por: HU-A2.002, HU-A2.004, HU-A2.005.
- Bloquea a: HU-A2.007, HU-A2.012, HU-A2.024.

**Integraciones:**
- Adapter de proveedor LLM (Gemini inicialmente).
- Lector de modelo OPM (OPL + triples).

**Notas de evidencia:**
- Fuente: §3.1 pasos 5-6, frames 10, 12.
- Clase de afirmación: observado + confirmado por transcripción ("this may take several minutes").

**Prioridad:** C.
**Tamaño:** S.
**Etiquetas:** [genai, modal, async, spinner].

---

### HU-A2.004 — Construir instrucción interna desde OPL y triples del modelo activo

**Actor primario:** AD.
**Tipo:** mixto.
**Nivel categórico:** X primario (integración externa); L (lente OPL) secundario.
**Superficie UI:** ninguna (pipeline interno).
**Gesto canónico:** ninguno (automático post-GO!).

**Historia:**
> Como autor de dominio, quiero que el sistema arme la instrucción IA a partir del OPL completo y los triples del modelo para que el LLM tenga el contexto OPM sin que yo tenga que redactarlo.

**Contexto de negocio:**
El valor del flujo depende de que el LLM reciba una representación fiel del modelo. OPL + triples es el contexto canónico OPM (texto bimodal + grafo dirigido) [OPL-ES §1..§2]. La transcripción confirma que OPCloud arma la instrucción internamente con OPL + triples + guidelines de redacción INCOSE-like.

**Criterios de aceptación:**
- **Dado** que el modelo tiene N entidades y M links, **cuando** disparo GO!, **entonces** la instrucción construida incluye: (a) OPL completo como bloque de texto, (b) lista de triples `(source, relation, target)`, (c) guidelines de redacción de requirements (tono, estructura `<sistema> shall <acción>`, categorías).
- **Dado** que el modelo está vacío, **cuando** disparo GO!, **entonces** el modal muestra mensaje "Model has no content to analyze" y no envía instrucción (pregunta abierta Q-A2.4).
- **Dado** que el modelo es muy grande (>50k tokens), **cuando** disparo GO!, **entonces** el sistema trunca, resume o rechaza con mensaje claro (pregunta abierta Q-A2.5).
- **Dado** que la generación completó, **cuando** consulto el historial (HU-A2.018), **entonces** la instrucción enviada queda registrada (si historial está habilitado).

**Reglas y restricciones:**
- La instrucción es **no-editable** desde la UI del modal en el diseño OPCloud observado. Ampliación posible: HU-A2.017 permite definir plantillas de instrucción alternativas.
- Guidelines de redacción son internos a OPCloud; en este repo serán **parametrizables** vía plantilla.
- OPL y triples se toman del modelo activo en memoria, no de la última versión guardada.

**Modelo de datos tocado:**
- Transitorio: estructura de la instrucción antes de envío.
- Persistente si historial activo (HU-A2.018): `genaiGeneration.instruccionPayload`.

**Dependencias:**
- Bloqueada por: lector de OPL (EPICA-50) y generador de triples (implícito en kernel).
- Bloquea a: HU-A2.003 (la instrucción debe existir antes de enviar).

**Integraciones:**
- Motor OPL (`src/render/opl-renderer.ts`).
- Extractor de triples (a definir en `src/nucleo/consultas/`).
- Adapter LLM.

**Notas de evidencia:**
- Fuente: §3.2 (pipeline narrado).
- Fuente normativa: [OPL-ES §1..§2] formato y vocabulario OPL.
- Clase de afirmación: confirmado por transcripción (no observado directamente en UI) + confirmado por SSOT.

**Prioridad:** S (sin esto no funciona la extensión completa).
**Tamaño:** L.
**Etiquetas:** [genai, llm, instruccion, integración, triples, opl].

---

### HU-A2.005 — Configurar provider LLM y API key desde Update API Key

**Actor primario:** AO (admin de organización).
**Actores secundarios:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** C (configuración); X (integración externa).
**Superficie UI:** diálogo `Update API Key` (inferido, no observado directamente).
**Gesto canónico:** clic en `Update API Key` del submenú GenerativeAI → ingreso de credenciales.

**Historia:**
> Como admin de organización, quiero configurar la clave API y el modelo del proveedor LLM desde un diálogo dedicado para habilitar todas las funciones IA del producto con una única acción de gobernanza.

**Contexto de negocio:**
Las funciones `AI OPD Summary`, `AI Model Summary`, `AI Impact Analysis` y `AI Reqs Generation` comparten la misma clave. Centralizarla en `Update API Key` simplifica el ciclo de rotación y evita duplicación. En este repo conviene ampliar para permitir varios providers (Gemini, Anthropic, OpenAI) con selección explícita.

**Criterios de aceptación:**
- **Dado** que abro `Update API Key`, **cuando** se renderiza el diálogo, **entonces** veo campos: `Provider` (select: Gemini, Anthropic, OpenAI, …), `API Key` (password-masked), `Model` (select dependiente del provider), `Endpoint URL` (opcional).
- **Dado** que guardo una clave válida, **cuando** confirma, **entonces** queda persistida en almacenamiento seguro del usuario/organización y todas las funciones IA usan esa clave.
- **Dado** que intento `GO!` sin clave configurada, **cuando** se dispara, **entonces** el modal muestra mensaje `API key missing — configure in GenerativeAI > Update API Key` (ver HU-A2.024).
- **Dado** que la clave es inválida, **cuando** el LLM rechaza auth, **entonces** se reporta error de autenticación (HU-A2.024) y se sugiere re-configurar.
- **Dado** que hay clave configurada, **cuando** consulto el diálogo, **entonces** el campo muestra mask (`••••••••`) con opción `Replace` pero no la clave en claro.

**Reglas y restricciones:**
- La clave se persiste cifrada (no en texto plano). Detalle exacto delegado a capa de persistencia segura.
- El scope de la clave puede ser usuario u organización (decisión de diseño; en OPCloud parece por usuario).
- La clave no se exporta en backups del modelo.

**Modelo de datos tocado:**
- `genaiProviderConfig.provider` — enum — persistente (secure storage).
- `genaiProviderConfig.apiKey` — string cifrado — persistente.
- `genaiProviderConfig.model` — string — persistente.
- `genaiProviderConfig.endpoint` — string nullable — persistente.

**Dependencias:**
- Bloquea a: HU-A2.003 (sin key no hay GO!), HU-A2.022 (costos), HU-A2.023 (privacy).

**Integraciones:**
- Capa de configuración segura (fuera del event log de modelo).
- EPICA-80 (config-user-org) — convivencia con otras settings.

**Notas de evidencia:**
- Fuente: §2 (entrada submenú), §5 (parámetros no expuestos), §7 (dependencia operativa).
- Clase de afirmación: inferido (no se observó el diálogo).
- Etiqueta: `requires-clarification` para diseño exacto del diálogo OPCloud.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [genai, config, provider, api-key, requires-clarification].

---

### HU-A2.006 — Cancelar modal con Close antes o después de GO!

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** U.
**Superficie UI:** modal-genai-reqs (botón `Close`).
**Gesto canónico:** clic en `Close` o ESC.

**Historia:**
> Como autor de dominio, quiero cerrar el modal en cualquier momento con `Close` para descartar el flujo IA sin afectar el canvas.

**Contexto de negocio:**
El modal es siempre cancelable. Cerrar antes de `GO!` descarta la intención; cerrar después descarta el listado vigente (o lo cachea, dependiendo de Q-A2.2). El canvas permanece intacto en cualquier caso porque la extensión es read-only.

**Criterios de aceptación:**
- **Dado** que el modal está abierto en estado inicial, **cuando** hago clic en `Close`, **entonces** el modal cierra, el velo desaparece y el canvas queda intacto.
- **Dado** que el modal está en loading, **cuando** hago clic en `Close`, **entonces** la operación pendiente se cancela o queda en background (pregunta abierta Q-A2.3) y el modal cierra.
- **Dado** que el modal tiene resultados poblados, **cuando** hago clic en `Close`, **entonces** el modal cierra; el listado se preserva para la próxima apertura (si cache intra-sesión está implementado).
- **Dado** que el modal está abierto, **cuando** presiono `ESC`, **entonces** equivale a `Close`.

**Reglas y restricciones:**
- `Close` nunca modifica el canvas ni el modelo persistente.
- El estado intra-sesión se rige por cache configurable (HU-A2.013).

**Dependencias:**
- Bloqueada por: HU-A2.002.

**Notas de evidencia:**
- Fuente: §4 (cancelación observada en frame 5).
- Clase de afirmación: observado indirectamente.

**Prioridad:** C.
**Tamaño:** XS.
**Etiquetas:** [genai, modal, ui, cancelación].

---

### HU-A2.007 — Renderizar listado enriquecido de REQ-NNNN en el modal

**Actor primario:** AD.
**Actores secundarios:** RV (revisor).
**Tipo:** opcloud-ui.
**Nivel categórico:** V primario (render); L (lente sobre output LLM).
**Superficie UI:** modal-genai-reqs (panel scrollable).
**Gesto canónico:** ninguno (render post-respuesta LLM).

**Historia:**
> Como autor de dominio, quiero ver el listado generado en formato enriquecido (ID, categoría, enunciado, AC, rationale, source) para revisarlo sin salir del modal.

**Contexto de negocio:**
El modal es el primer punto de consumo del output. Formato rico con iconografía inline (✅ para AC, 💡 para Note) ayuda a la lectura rápida. Scroll vertical tolera listados largos. Este formato es **distinto** del Excel (que usa columnas sin iconos).

**Criterios de aceptación:**
- **Dado** que el LLM respondió, **cuando** se renderiza el listado, **entonces** cada requirement muestra: `REQ-NNNN <Category>` (cabecera), `The <sujeto> shall <acción>` (enunciado), `Verification: <Tipo> | Status: Proposed`, `✅ <AC>`, `💡 <Rationale/Note>`, `Source: <referencia>`.
- **Dado** que el listado excede el alto del modal, **cuando** scrolleo, **entonces** la cabecera del modal (título, botones) queda sticky y solo scrollea el panel de resultados.
- **Dado** que el listado se renderiza, **cuando** miro los íconos, **entonces** ✅ (verde) precede al AC y 💡 (amarillo) precede a la Note, consistentemente.
- **Dado** que una categoría no aplica (p. ej. Interface vacía), **cuando** el LLM no emite filas de esa categoría, **entonces** el listado la omite sin sección vacía.

**Reglas y restricciones:**
- Formato de cabecera de requirement: `REQ-NNNN <Category>` con zero-padding 4 dígitos.
- Iconos inline son convención del modal; no se transfieren al Excel.
- Status default: `Proposed`.
- Verification default por categoría: Structural→Inspection, Functional→Test, State→Inspection/Test, Interface→Test.

**Modelo de datos tocado:**
- Transitorio (o persistente si historial activo): array `generation.requirements[]` con schema: `{ id, parentId, category, statement, verification, status, acceptanceCriterion, rationale, source }`.

**Dependencias:**
- Bloqueada por: HU-A2.003, HU-A2.008, HU-A2.009.
- Bloquea a: HU-A2.011, HU-A2.012, HU-A2.019.

**Integraciones:**
- Parser de la respuesta LLM (estructurada).
- Renderer del modal (iconografía inline).

**Notas de evidencia:**
- Fuente: §3.1 paso 7, frames 14, 16, 18, 25.
- Clase de afirmación: observado + confirmado por transcripción.

**Prioridad:** C.
**Tamaño:** M.
**Etiquetas:** [genai, modal, render, opl, listado].

---

### HU-A2.008 — Clasificar cada requirement en Structural/Interface/Functional/State

**Actor primario:** AD.
**Tipo:** mixto.
**Nivel categórico:** X primario (LLM); L secundario (regla de clasificación).
**Superficie UI:** modal + Excel (columna Category).
**Gesto canónico:** ninguno (clasificación automática en el output).

**Historia:**
> Como autor de dominio, quiero que cada requirement generado venga clasificado en una de las cuatro categorías INCOSE-like (Structural, Interface, Functional, State) para filtrar y agrupar por naturaleza.

**Contexto de negocio:**
La taxonomía INCOSE-like es un **mapeo desde OPM al vocabulario de ingeniería de sistemas**: Structural ↔ agregación/composición; Interface ↔ links de comunicación; Functional ↔ procesos; State ↔ transiciones. El LLM hace esta traducción con guía de la instrucción. Las cinco familias canónicas de enlace [V-239] son la base conceptual de este mapeo, aunque la SSOT no prescribe la taxonomía INCOSE para requirements.

**Criterios de aceptación:**
- **Dado** que el modelo tiene un link de agregación entre A y B, **cuando** el LLM emite el requirement, **entonces** la categoría asignada es `Structural`.
- **Dado** que el modelo tiene un process P con instruments, **cuando** el LLM emite requirements sobre P, **entonces** al menos un requirement es `Functional`.
- **Dado** que el modelo tiene un object O con states, **cuando** el LLM emite requirements sobre O, **entonces** al menos uno es `State`.
- **Dado** que el modelo tiene links de comunicación (Consumption/Effect bidireccionales entre agentes), **cuando** el LLM emite requirements, **entonces** al menos uno es `Interface`.
- **Dado** que miro la hoja `Stats` del Excel, **cuando** cuento por categoría, **entonces** los totales coinciden con los de la hoja `Requirements`.

**Reglas y restricciones:**
- Las cuatro categorías son un enum cerrado; el LLM no puede inventar nuevas.
- La clasificación es **no determinista** (la transcripción recuerda que la IA no garantiza cobertura completa); se tolera variación entre corridas.
- Verification por default se infiere de la categoría (ver HU-A2.007).

**Modelo de datos tocado:**
- `requirement.category` — enum `"Structural" | "Interface" | "Functional" | "State"` — persistente en Excel.

**Dependencias:**
- Bloqueada por: HU-A2.004 (instrucción con guidelines).

**Integraciones:**
- Parser de respuesta LLM.
- Hoja Stats del Excel (HU-A2.012).

**Notas de evidencia:**
- Fuente: §6 (taxonomía), §5 (Verification típica por categoría).
- Fuente normativa: [V-239] cinco familias canónicas de enlace OPM.
- Clase de afirmación: observado + confirmado por transcripción + anclado a SSOT.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [genai, llm, clasificación, incose, taxonomía].

---

### HU-A2.009 — Completar atributos automáticos (rationale, AC, verification, status)

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** X primario.
**Superficie UI:** modal + Excel.
**Gesto canónico:** ninguno (completado automático).

**Historia:**
> Como autor de dominio, quiero que el LLM complete rationale, acceptance criterion, verification y status por cada requirement para obtener un artefacto listo para revisión sin campos en blanco críticos.

**Contexto de negocio:**
Un requirement sin rationale ni AC es solo una frase. El valor del flujo IA depende de que devuelva **requirements completos**, incluso si el modelador luego los edita. Los campos Priority y Risk se dejan vacíos porque son decisión humana; los demás se rellenan.

**Criterios de aceptación:**
- **Dado** que el LLM responde, **cuando** miro un requirement en el listado, **entonces** tiene obligatoriamente: `statement`, `rationale`, `acceptanceCriterion`, `verification`, `status`.
- **Dado** que el LLM responde, **cuando** miro el Excel, **entonces** las columnas `Priority` y `Risk` están **vacías** (reservadas a humano).
- **Dado** que un requirement es jerárquico (child), **cuando** miro ParentID, **entonces** apunta a otro `REQ-NNNN` válido (HU-A2.010).
- **Dado** que el LLM no pudo generar rationale, **cuando** miro el campo, **entonces** no queda vacío sino con marcador `[rationale not generated]` (pregunta abierta Q-A2.6; en OPCloud no se observó el caso).

**Reglas y restricciones:**
- `status` default siempre `Proposed` para output IA.
- `verification` se elige de enum `{ Inspection, Test, Analysis, Demonstration }` según categoría.
- `rationale` es texto libre en español o inglés (HU-A2.016).
- `acceptanceCriterion` es texto libre con convención SMART cuando aplica (guideline de la instrucción).

**Modelo de datos tocado:**
- `requirement.rationale` — string — persistente.
- `requirement.acceptanceCriterion` — string — persistente.
- `requirement.verification` — enum — persistente.
- `requirement.status` — enum — persistente (inicial `Proposed`).

**Dependencias:**
- Bloqueada por: HU-A2.004, HU-A2.008.
- Relaciona: HU-A2.019 (edit workflow).

**Integraciones:**
- Parser estricto de salida LLM (validación de presencia de campos).

**Notas de evidencia:**
- Fuente: §5 (defaults), §6 (schema Excel).
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [genai, llm, atributos, requirement, completado].

---

### HU-A2.010 — Generar jerarquía de requirements con ParentID y sufijos (REQ-0006a)

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** X.
**Superficie UI:** modal + Excel (columna ParentID, ID con sufijo).
**Gesto canónico:** ninguno.

**Historia:**
> Como autor de dominio, quiero que el LLM emita requirements hijos con sufijo alfabético (`REQ-0006a`, `REQ-0006b`) y ParentID apuntando al padre para preservar la descomposición jerárquica OPM-friendly.

**Contexto de negocio:**
Cuando un proceso OPM se descompone en sub-procesos (p. ej. `Driver Rescuing` → `Call Making`), el LLM puede reflejarlo como requirement padre + refinamientos hijos. Este patrón permite trazabilidad vertical sin romper la semántica INCOSE.

**Criterios de aceptación:**
- **Dado** que el modelo tiene un proceso con sub-procesos, **cuando** el LLM genera requirements, **entonces** puede emitir `REQ-NNNN` (padre) + `REQ-NNNNa`, `REQ-NNNNb` (hijos) con `ParentID = REQ-NNNN`.
- **Dado** que miro el Excel, **cuando** inspecciono la columna ParentID, **entonces** contiene IDs válidos del mismo listado o queda vacío.
- **Dado** que un requirement es hijo, **cuando** miro su statement, **entonces** refina semánticamente al padre (no lo contradice).
- **Dado** que hay un padre `REQ-0006`, **cuando** hay hijos, **entonces** se nombran con sufijo alfabético correlativo.

**Reglas y restricciones:**
- Sufijos observados: `a`, `b`, … (alfabético). Profundidad observada: 1 (padre + un nivel de hijos).
- Profundidad mayor (nieto) es **pregunta abierta** Q-A2.7.
- ParentID debe existir en el listado; si no, es error de parseo.

**Modelo de datos tocado:**
- `requirement.id` — pattern `REQ-\d{4}[a-z]?` — persistente.
- `requirement.parentId` — nullable, referencia a otro ID — persistente.

**Dependencias:**
- Bloqueada por: HU-A2.004, HU-A2.008.

**Integraciones:**
- Parser de salida LLM.
- Render modal (puede indentar hijos).

**Notas de evidencia:**
- Fuente: §5 ejemplo `REQ-0006 / REQ-0006a`, frame 20.
- Clase de afirmación: observado.

**Prioridad:** C.
**Tamaño:** S.
**Etiquetas:** [genai, llm, jerarquía, requirement, parentid].

---

### HU-A2.011 — Copiar listado completo al portapapeles desde el modal

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** U.
**Superficie UI:** modal (icono de copia esquina inferior izquierda).
**Gesto canónico:** clic en icono copia.

**Historia:**
> Como autor de dominio, quiero copiar el listado completo al portapapeles con un clic para pegarlo en un editor externo (Notepad, Word, sistema de tickets) sin pasar por Excel.

**Contexto de negocio:**
El portapapeles es vía rápida de consumo para quienes no necesitan Excel. Preserva el mismo formato textual enriquecido con líneas `REQ-NNNN <Category>`, Verification, Status, AC (marcado ✅ o textual), Note (marcado 💡 o textual) y Source.

**Criterios de aceptación:**
- **Dado** que el listado está poblado, **cuando** hago clic en el icono de copia, **entonces** el portapapeles del SO contiene el listado completo en formato texto plano.
- **Dado** que pego en un editor, **cuando** miro el contenido, **entonces** veo `REQ-NNNN <Category>`, `<statement>`, `Verification: <Tipo> | Status: <Status>`, `AC: <AC>`, `Note: <Note>`, `Source: <Source>` para cada requirement.
- **Dado** que el listado está vacío, **cuando** hago clic, **entonces** el icono está inactivo o copia cadena vacía (sin error).
- **Dado** que la copia exitosa, **cuando** termina, **entonces** muestro toast breve `Copied N requirements`.

**Reglas y restricciones:**
- El portapapeles recibe texto plano (sin formato Markdown ni HTML).
- Los iconos inline ✅ / 💡 se convierten a texto (`AC:`, `Note:`).
- El orden de los requirements se preserva.

**Modelo de datos tocado:**
- Ninguno persistente; escritura al portapapeles del SO.

**Dependencias:**
- Bloqueada por: HU-A2.007.

**Integraciones:**
- Clipboard API del navegador.

**Notas de evidencia:**
- Fuente: §3.1 paso 8, frame 16.
- Clase de afirmación: observado + confirmado por transcripción.

**Prioridad:** C.
**Tamaño:** XS.
**Etiquetas:** [genai, modal, portapapeles, export-texto].

---

### HU-A2.012 — Descargar Excel multi-hoja con Requirements + Stats

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** X primario (integración file system); L secundario.
**Superficie UI:** modal (botón `Download Reqs Excel`).
**Gesto canónico:** clic en botón.

**Historia:**
> Como autor de dominio, quiero descargar el listado como Excel multi-hoja (Requirements + Stats) para revisarlo fuera de OPCloud con herramientas de tabla.

**Contexto de negocio:**
Excel es el formato esperado en ingeniería de requirements. Dos hojas (`Requirements` tabular + `Stats` con métricas agregadas) cubren el caso de uso de revisión externa y reporting.

**Criterios de aceptación:**
- **Dado** que hay listado poblado, **cuando** hago clic en `Download Reqs Excel`, **entonces** el navegador descarga un archivo `.xlsx`.
- **Dado** que abro el Excel, **cuando** miro la hoja `Requirements`, **entonces** veo columnas: `ID | ParentID | Category | Priority | Risk | Status | Statement | Rationale | Verification`.
- **Dado** que abro el Excel, **cuando** miro la hoja `Stats`, **entonces** veo métricas: `OPL Lines`, `Triples`, `Refined Count`, y una tabla `Category | Count` con el conteo por categoría.
- **Dado** que no hay listado aún, **cuando** miro el botón, **entonces** está deshabilitado (gris).
- **Dado** que hay listado, **cuando** miro el botón, **entonces** está habilitado (azul).

**Reglas y restricciones:**
- Nombre de archivo por default: `requirements-<modelo>-<timestamp>.xlsx`.
- Priority y Risk se incluyen como columnas **vacías** (reservadas al humano).
- La hoja Stats es read-only (calculada al generar).
- Compatibilidad: formato Excel 2007+ (`.xlsx`, OOXML).

**Modelo de datos tocado:**
- Ninguno persistente en modelo OPM; artefacto externo.

**Dependencias:**
- Bloqueada por: HU-A2.007.

**Integraciones:**
- Librería de generación XLSX (p. ej. `exceljs`, `xlsx-populate`).
- Sistema de archivos del host vía download.

**Notas de evidencia:**
- Fuente: §3.1 paso 9, frames 20, 22, 24.
- Clase de afirmación: observado + confirmado por transcripción ("44 OPL lines, 117 triplets, 4 Structural, 1 Interface, 36 Functional, 5 State").

**Prioridad:** C.
**Tamaño:** M.
**Etiquetas:** [genai, export, excel, xlsx, stats].

---

### HU-A2.013 — Re-disparar generación y decidir política (reemplazar/diff/acumular)

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; X secundario.
**Superficie UI:** modal (botón `GO!` tras resultados).
**Gesto canónico:** clic en `GO!` con listado ya poblado.

**Historia:**
> Como autor de dominio, quiero re-disparar la generación tras editar el modelo y decidir si el nuevo output reemplaza, diffa o acumula con el anterior para no perder progreso.

**Contexto de negocio:**
La generación es no determinista: dos corridas sobre el mismo modelo pueden diferir. Si el modelador editó el modelo entre corridas, el valor está en **ver las diferencias** — requirements nuevos, removidos, cambiados. OPCloud no documenta esta política; es una pregunta abierta a resolver en este repo.

**Criterios de aceptación:**
- **Dado** que hay listado poblado y hago clic en `GO!` de nuevo, **cuando** abre diálogo de confirmación, **entonces** me pregunta entre tres opciones: `Replace` (descartar previo), `Diff` (mostrar comparación), `Accumulate` (agregar sin tocar previos).
- **Dado** que elijo `Replace`, **cuando** llega la nueva respuesta, **entonces** el listado previo se descarta.
- **Dado** que elijo `Diff`, **cuando** llega la respuesta, **entonces** cada requirement muestra marcador `[new]`, `[changed]`, `[unchanged]` o `[removed]`.
- **Dado** que elijo `Accumulate`, **cuando** llega la respuesta, **entonces** se agregan con IDs incrementados para no colisionar (p. ej. si había `REQ-0044`, los nuevos arrancan en `REQ-0045`).
- **Dado** que es la primera corrida, **cuando** hago clic en `GO!`, **entonces** no se muestra el diálogo (no hay qué comparar).

**Reglas y restricciones:**
- Política default configurable (HU-A2.017 plantilla de instrucción puede traerla); default sugerido: `Replace`.
- Diff requiere conservar el listado previo en memoria del modal.
- Accumulate requiere re-numerar IDs de la respuesta nueva para evitar colisión.

**Modelo de datos tocado:**
- `modalState.genaiReqs.previousGeneration` — transitorio (array previo).
- `modalState.genaiReqs.currentGeneration` — transitorio (array actual).

**Dependencias:**
- Bloqueada por: HU-A2.007.
- Relaciona: HU-A2.018 (historial).

**Integraciones:**
- Diff engine sobre arrays de requirements (por `id` o por similitud de statement).

**Notas de evidencia:**
- Fuente: §11 pregunta abierta Q-A2.2, §4 re-disparo no observado.
- Clase de afirmación: hipótesis (OPCloud no documenta esta política).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamaño:** M.
**Etiquetas:** [genai, modal, regeneración, diff, requires-clarification].

---

### HU-A2.014 — Sugerir requirements faltantes contra modelo OPM actual

**Actor primario:** AD.
**Actores secundarios:** IA (analista).
**Tipo:** mixto.
**Nivel categórico:** X primario; L secundario.
**Superficie UI:** modal (sección `Gaps Detected` o botón `Suggest Missing`).
**Gesto canónico:** clic en botón de sugerencia o checkbox en instrucción.

**Historia:**
> Como autor de dominio, quiero que la extensión IA señale qué requirements **faltan** respecto al modelo OPM actual para cerrar gaps, no solo describir lo que ya está modelado.

**Contexto de negocio:**
Generar requirements de lo que ya está en el modelo es un ejercicio descriptivo. **Detectar faltantes** (p. ej. un proceso sin AC, un link sin contraparte verificable, un state sin condición de transición) convierte la IA en asistente crítico. Esta capacidad no está en OPCloud observado; es ampliación del repo. La SSOT [V-1 §1.2] define contornos y alcances del sistema que el gap analysis puede explotar como señales estructurales.

**Criterios de aceptación:**
- **Dado** que activo el modo `Suggest Missing`, **cuando** disparo GO!, **entonces** el LLM recibe una instrucción que pide explícitamente gaps y emite requirements marcados con badge `[suggested-gap]`.
- **Dado** que el LLM sugiere un gap, **cuando** miro el listado, **entonces** el requirement incluye campo `linkedEvidence` apuntando al elemento OPM (proceso/object/state) que motiva la sugerencia.
- **Dado** que una sugerencia se acepta (HU-A2.019), **cuando** se materializa en canvas (HU-A2.020), **entonces** puede opcionalmente crear el elemento OPM faltante (pregunta abierta, probablemente requiere asistencia humana).
- **Dado** que el modo `Suggest Missing` está desactivado, **cuando** disparo GO!, **entonces** el comportamiento es el clásico (solo describir, no sugerir).

**Reglas y restricciones:**
- Modo opt-in: no encender por default porque el output es más ruidoso.
- Los gaps sugeridos heredan `status = Proposed` + badge adicional `[suggested-gap]`.
- Evidencia referenciada debe existir en el modelo (fail de integridad si apunta a ID inexistente).

**Modelo de datos tocado:**
- `requirement.isSuggestedGap` — boolean — persistente.
- `requirement.linkedEvidence` — array de IDs OPM — persistente.

**Dependencias:**
- Bloqueada por: HU-A2.004 (instrucción ampliada).
- Relaciona: EPICA-D0 (missing knowledge analysis).

**Integraciones:**
- EPICA-D0 si existe análisis propio de gaps.
- Canvas (highlight opcional del elemento OPM que motiva el gap).

**Notas de evidencia:**
- Fuente: ampliación del repo; no observado en OPCloud.
- Fuente normativa: [V-1 §1.2] contornos que definen alcance del sistema (señal estructural para detección de gaps).
- Clase de afirmación: hipótesis + inferencia desde capacidades LLM.

**Prioridad:** C.
**Tamaño:** L.
**Etiquetas:** [genai, llm, gap-analysis, sugerencia, missing-knowledge].

---

### HU-A2.015 — Revisar redacción de requirement (lint natural-language)

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** X primario.
**Superficie UI:** modal (badge por requirement con warnings) o panel dedicado.
**Gesto canónico:** automático post-generación o botón `Revisar Redacción`.

**Historia:**
> Como autor de dominio, quiero que la extensión IA revise la redacción de cada requirement contra guidelines estándar (ambigüedad, doble negación, verbos débiles) para subir la calidad del output sin revisión manual exhaustiva.

**Contexto de negocio:**
Requirements mal redactados son fuente de defectos en producto. Guidelines clásicas (INCOSE, ISO 29148) enumeran patrones a evitar: "should", "as appropriate", "etc", dobles negaciones, pasivas ambiguas. Un pase de revisión LLM puede señalar violaciones.

**Criterios de aceptación:**
- **Dado** que tengo un listado poblado, **cuando** el pase de revisión termina, **entonces** cada requirement puede llevar un array `wordingIssues: [{ code, severity, message }]`.
- **Dado** que un requirement tiene `wordingIssues`, **cuando** miro el modal, **entonces** se renderiza un badge `⚠ N issues` inline.
- **Dado** que hago clic en el badge, **cuando** se expande, **entonces** veo la lista de issues con severity (`info` | `warning` | `error`) y mensaje explicativo.
- **Dado** que edito el statement (HU-A2.019), **cuando** confirmo, **entonces** el pase de revisión se re-ejecuta sobre el texto editado (opcional; puede ser manual).

**Reglas y restricciones:**
- Severity enum cerrado.
- Códigos de issue predefinidos: `weak-verb`, `ambiguous-should`, `double-negation`, `passive-voice`, `measurable-criterion-missing`, …
- El pase de revisión puede ser síncrono con la generación principal o diferido (botón aparte).

**Modelo de datos tocado:**
- `requirement.wordingIssues[]` — array — persistente.

**Dependencias:**
- Bloqueada por: HU-A2.007.
- Relaciona: HU-A2.019 (edit workflow).

**Integraciones:**
- LLM con instrucción especializada en lint NLP.

**Notas de evidencia:**
- Fuente: ampliación del repo; no observado en OPCloud.
- Clase de afirmación: hipótesis (funcionalidad estándar en herramientas de requirements maduras).

**Prioridad:** C.
**Tamaño:** M.
**Etiquetas:** [genai, llm, lint, redacción, calidad].

---

### HU-A2.016 — Configurar idioma de generación (es/en)

**Actor primario:** AD.
**Actores secundarios:** AO.
**Tipo:** opcloud-ui.
**Nivel categórico:** C (config).
**Superficie UI:** diálogo provider config (HU-A2.005) o toggle en modal GenAI.
**Gesto canónico:** selección en dropdown.

**Historia:**
> Como autor de dominio, quiero elegir si el output se genera en español o inglés para alinear con el idioma del modelo y el idioma del lector final del artefacto.

**Contexto de negocio:**
El repo es es-CL; los modelos pueden estar en español. Pero muchos modelos industriales legados están en inglés (como el ejemplo OnStar). El idioma del output debe ser configurable y, por default, detectar el idioma del OPL.

**Criterios de aceptación:**
- **Dado** que el modelo está en español, **cuando** disparo GO! con default, **entonces** el output se genera en español.
- **Dado** que el modelo está en inglés, **cuando** disparo GO! con default, **entonces** el output se genera en inglés.
- **Dado** que hay ambigüedad o el usuario quiere override, **cuando** selecciono `Language: English` en el config, **entonces** todos los outputs siguientes usan inglés.
- **Dado** que cambio idioma entre corridas, **cuando** miro el historial (HU-A2.018), **entonces** cada entrada registra su idioma.

**Reglas y restricciones:**
- Idiomas soportados inicialmente: `es`, `en`. Extensible.
- Detección automática basada en heurística del OPL (ratio de palabras en cada idioma).
- La elección aplica al `statement`, `rationale`, `acceptanceCriterion`. El schema (IDs, enums de Category/Verification) queda siempre en inglés por compatibilidad INCOSE.

**Modelo de datos tocado:**
- `genaiProviderConfig.language` — enum `"auto" | "es" | "en"` — persistente.
- `genaiGeneration.language` — registra el idioma efectivo usado — persistente si historial.

**Dependencias:**
- Bloqueada por: HU-A2.005.

**Integraciones:**
- Plantilla de instrucción (HU-A2.017) puede definir language hint explícito.

**Notas de evidencia:**
- Fuente: §11 pregunta abierta Q-A2.7 (idioma).
- Clase de afirmación: observación negativa (solo inglés observado en ejemplo OnStar).

**Prioridad:** C.
**Tamaño:** S.
**Etiquetas:** [genai, idioma, i18n, configuración].

---

### HU-A2.017 — Gestionar plantillas de instrucción nombradas y versionadas

**Actor primario:** AO.
**Actores secundarios:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** C (config) primario; X secundario.
**Superficie UI:** panel `Plantillas de Instrucción GenAI` (modal dedicado en settings).
**Gesto canónico:** CRUD de plantillas.

**Historia:**
> Como admin de organización, quiero definir, versionar y asignar plantillas de instrucción nombradas (p. ej. `default-incose`, `hdos-clinical`, `safety-critical`) para adaptar la generación IA al dominio sin tocar código.

**Contexto de negocio:**
La instrucción interna de OPCloud no es editable. En este repo, la gobernanza de instrucciones debe estar en manos del admin: plantillas nombradas, versionadas, asignables por modelo o por usuario. Esto permite dominios especializados (clínico, safety, político) sin bifurcar código.

**Criterios de aceptación:**
- **Dado** que abro `Plantillas de Instrucción GenAI`, **cuando** miro, **entonces** veo la lista de plantillas con `name`, `version`, `updatedAt`, `author`.
- **Dado** que creo una plantilla nueva, **cuando** guardo, **entonces** queda con `version=1`.
- **Dado** que edito una plantilla existente, **cuando** guardo, **entonces** se incrementa `version` y la versión anterior se preserva en historial.
- **Dado** que abro el modal GenAI Reqs, **cuando** elijo plantilla desde dropdown, **entonces** el siguiente `GO!` usa esa plantilla.
- **Dado** que una plantilla tiene placeholders `{{OPL}}`, `{{TRIPLES}}`, `{{LANGUAGE}}`, `{{DOMAIN}}`, **cuando** se arma la instrucción final, **entonces** se sustituyen con valores del modelo activo.

**Reglas y restricciones:**
- Cada plantilla tiene un body con placeholders nombrados.
- La plantilla default (`default-incose`) es read-only (se puede duplicar pero no editar).
- Versionado: las versiones viejas se conservan para reproducibilidad del historial (HU-A2.018).
- Permisos: solo AO edita plantillas; AD las usa.

**Modelo de datos tocado:**
- `plantillaInstruccion.nombre` — string unique — persistente.
- `plantillaInstruccion.version` — int — persistente.
- `plantillaInstruccion.cuerpo` — text — persistente.
- `plantillaInstruccion.placeholders` — array de strings — persistente.
- `plantillaInstruccion.alcance` — enum `"user" | "organization"` — persistente.

**Dependencias:**
- Relaciona: HU-A2.004, HU-A2.005.
- Relaciona: EPICA-80 (config-user-org), EPICA-82 (organization-ontology).

**Integraciones:**
- Motor de sustitución de placeholders antes del envío al LLM.
- Historial (HU-A2.018) registra la plantilla efectiva.

**Notas de evidencia:**
- Fuente: ampliación del repo; en OPCloud la instrucción es opaca.
- Clase de afirmación: hipótesis (capacidad necesaria para gobernanza por dominio).

**Prioridad:** C.
**Tamaño:** L.
**Etiquetas:** [genai, instruccion-plantilla, config, versionado, gobernanza].

---

### HU-A2.018 — Ver historial de generaciones por modelo (timestamp, instrucción, output)

**Actor primario:** AD.
**Actores secundarios:** AO, RV.
**Tipo:** opcloud-ui.
**Nivel categórico:** P (persistencia) primario; L secundario.
**Superficie UI:** panel `GenAI History` (dentro del modal o en settings).
**Gesto canónico:** clic en botón `History` del modal.

**Historia:**
> Como autor de dominio, quiero ver el historial de generaciones IA por modelo (timestamp, instrucción efectiva, output, plantilla usada) para auditar cómo evolucionó el conjunto de requirements y volver a un estado anterior.

**Contexto de negocio:**
La generación IA es no determinista; un rollback puede ser necesario. Un historial persistente permite reproducibilidad: dada una instrucción + versión de modelo + plantilla, el output está capturado. Es la base para auditoría formal y para detectar drift entre corridas.

**Criterios de aceptación:**
- **Dado** que abro `GenAI History` sobre un modelo, **cuando** se renderiza, **entonces** veo una lista de generaciones con `id`, `timestamp`, `plantilla (name + version)`, `language`, `numRequirements`, `cost` (si disponible).
- **Dado** que hago clic en una entrada, **cuando** se expande, **entonces** veo la instrucción enviada, la respuesta cruda y el listado formateado.
- **Dado** que selecciono una entrada y clickeo `Restore`, **cuando** confirmo, **entonces** el modal GenAI muestra ese listado como si fuera el activo.
- **Dado** que purgo el historial, **cuando** confirmo, **entonces** las entradas se borran (solo el admin puede purgar — permiso AO).

**Reglas y restricciones:**
- Retención configurable (default: 30 días o 50 entradas, whichever first).
- El historial se asocia al `modelo.id`, no al archivo exportado.
- Las instrucciones con credenciales embebidas se sanitizan antes de persistir.

**Modelo de datos tocado:**
- `genaiGeneration.id` — UUID — persistente.
- `genaiGeneration.modelId` — FK — persistente.
- `genaiGeneration.timestamp` — ISO 8601 — persistente.
- `genaiGeneration.plantillaRef` — `{ name, version }` — persistente.
- `genaiGeneration.instruccionPayload` — text sanitized — persistente.
- `genaiGeneration.rawResponse` — text — persistente.
- `genaiGeneration.requirements[]` — array — persistente.

**Dependencias:**
- Bloqueada por: HU-A2.003, HU-A2.017.
- Relaciona: EPICA-30 (persistencia-save-load) — el historial viaja con el modelo o en storage aparte.

**Integraciones:**
- Capa de persistencia IndexedDB o event log.

**Notas de evidencia:**
- Fuente: §11 pregunta abierta Q-A2.2 (persistencia intra-sesión).
- Clase de afirmación: hipótesis (OPCloud no lo expone).

**Prioridad:** C.
**Tamaño:** M.
**Etiquetas:** [genai, historial, auditoría, persistencia, reproducibilidad].

---

### HU-A2.019 — Workflow accept/reject/edit por requirement generado

**Actor primario:** AD.
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; K secundario (al aceptar materializa).
**Superficie UI:** modal (acciones por fila) o panel lateral de revisión.
**Gesto canónico:** clic en `Accept` / `Reject` / `Edit` por requirement.

**Historia:**
> Como autor de dominio, quiero aceptar, rechazar o editar cada requirement generado individualmente para construir un conjunto humano-validado a partir del output IA.

**Contexto de negocio:**
El output IA es **propuesta**, no verdad. Un workflow de revisión granular eleva la calidad y genera un dataset de entrenamiento para mejorar instrucciones futuras. Es el puente hacia HU-A2.020 (materializar en canvas). OPCloud no lo tiene; es ampliación crítica.

**Criterios de aceptación:**
- **Dado** que tengo listado poblado, **cuando** miro cada fila, **entonces** hay tres controles: `✔ Accept`, `✘ Reject`, `✎ Edit`.
- **Dado** que clickeo `Accept`, **cuando** confirma, **entonces** el requirement cambia `status` a `Accepted` y queda marcado visualmente (borde verde).
- **Dado** que clickeo `Reject`, **cuando** confirma, **entonces** el requirement cambia `status` a `Rejected` y se tacha visualmente (pero se preserva en historial).
- **Dado** que clickeo `Edit`, **cuando** se abre editor inline, **entonces** puedo modificar `statement`, `rationale`, `acceptanceCriterion`, `category`, `verification`.
- **Dado** que confirmo edición, **cuando** se guarda, **entonces** `status` pasa a `Accepted-Edited` y se preserva la versión original para diff.
- **Dado** que tengo requirements en varios status, **cuando** filtro por status, **entonces** veo solo los seleccionados.

**Reglas y restricciones:**
- Status enum extendido: `Proposed | Accepted | Accepted-Edited | Rejected | Deferred`.
- Los rechazados se preservan en historial (no desaparecen).
- La edición puede re-disparar revisión de redacción (HU-A2.015).
- Acciones son reversibles (un `Reject` puede volver a `Proposed`).

**Modelo de datos tocado:**
- `requirement.status` — enum ampliado — persistente.
- `requirement.originalStatement` — string — persistente (conservado en edición).
- `requirement.editedBy` — userId — persistente.
- `requirement.editedAt` — timestamp — persistente.

**Dependencias:**
- Bloqueada por: HU-A2.007.
- Bloquea a: HU-A2.020 (solo Accepted se materializa).

**Integraciones:**
- EPICA-A1 (requirements canvas-nativo) — HU-A2.020 es el puente.

**Notas de evidencia:**
- Fuente: ampliación del repo; OPCloud solo expone `Proposed`.
- Clase de afirmación: hipótesis (workflow estándar en herramientas maduras).

**Prioridad:** M1.
**Tamaño:** L.
**Etiquetas:** [genai, workflow, requirement, revision, accept-reject-edit].

---

### HU-A2.020 — Materializar requirement aceptado como estereotipo `<<Requirement>>` en canvas

**Actor primario:** AD.
**Tipo:** mixto.
**Nivel categórico:** K primario (crea entidad en canvas); V secundario.
**Superficie UI:** modal (botón `Materialize on Canvas` por requirement aceptado) + canvas (recibe objeto nuevo).
**Gesto canónico:** clic en `Materialize`.

**Historia:**
> Como autor de dominio, quiero materializar un requirement IA aceptado como objeto canvas con estereotipo `<<Requirement>>` para cerrar el round-trip entre A2 (generación IA) y A1 (requirements canvas-nativo).

**Contexto de negocio:**
OPCloud no ofrece este puente — es la brecha más grande documentada. Este repo puede resolverla: un requirement aceptado se convierte en objeto canvas con todos sus atributos (`statement`, `rationale`, `verification`, `status`), opcionalmente enlazado al elemento OPM que le dio origen via Satisfaction Link. La SSOT OPM no regula estereotipos (son extensión de OPCloud via EPICA-A0), por lo que la materialización es responsabilidad del repo.

**Criterios de aceptación:**
- **Dado** que un requirement tiene `status=Accepted` o `Accepted-Edited`, **cuando** hago clic en `Materialize on Canvas`, **entonces** se crea un objeto canvas con estereotipo `<<Requirement>>`, nombre = `Req#N` (N incremental por la convención de EPICA-A1), atributos poblados desde el requirement.
- **Dado** que el requirement tiene `source` apuntando a un elemento OPM, **cuando** se materializa, **entonces** se crea opcionalmente un `Satisfaction Link` entre el objeto origen y el nuevo requirement.
- **Dado** que materialicé un requirement, **cuando** consulto el OPD tree, **entonces** aparece en la rama `Requirement Views` (definida por EPICA-A1).
- **Dado** que materialicé un requirement, **cuando** consulto el objeto en el canvas, **entonces** tiene un badge `[from AI]` con tooltip que muestra `genaiGeneration.id` de origen.
- **Dado** que rechacé un requirement (`Rejected`), **cuando** intento materializarlo, **entonces** el botón está deshabilitado.

**Reglas y restricciones:**
- Nombre del objeto canvas: `Req#N` con contador propio de EPICA-A1.
- El link al `genaiGeneration.id` es persistente para trazabilidad (HU-A2.021).
- La materialización es **one-way**: editar el objeto canvas no retro-propaga al listado IA.
- Si el usuario rechaza y luego revierte a `Accepted`, vuelve a poder materializar.

**Modelo de datos tocado:**
- `thing.stereotype` — `"Requirement"` — persistente (ver EPICA-A0).
- `thing.name` — `"Req#N"` — persistente.
- `thing.attributes.statement` — persistente.
- `thing.attributes.category` — persistente.
- `thing.attributes.origin` — `"ai"` — persistente (HU-A2.021).
- `thing.attributes.genaiGenerationId` — UUID FK — persistente.
- `link.type` — `"SatisfactionLink"` (si se crea) — persistente.

**Dependencias:**
- Bloqueada por: HU-A2.019, EPICA-A1 (requirements canvas-nativo), EPICA-A0 (stereotypes).
- Relaciona: HU-A2.021 (origen IA vs humano).

**Integraciones:**
- Kernel OPM (`src/nucleo/`) — creación de thing con stereotype.
- EPICA-A1 — convención de nombrado y rama OPD tree.
- Auditoría (HU-A2.021).

**Notas de evidencia:**
- Fuente: §1 (gap documentado entre regímenes), §11 preguntas abiertas Q-A2.3, Q-A2.4.
- Clase de afirmación: hipótesis de diseño del repo (no observado en OPCloud).

**Prioridad:** M1 (ancla del valor diferencial).
**Tamaño:** L.
**Etiquetas:** [genai, round-trip, a1, canvas, kernel, materialización].

---

### HU-A2.021 — Marcar origen IA vs humano en auditoría de requirement

**Actor primario:** AD.
**Actores secundarios:** AO, RV.
**Tipo:** opcloud-ui.
**Nivel categórico:** K primario (atributo persistente); L secundario.
**Superficie UI:** canvas (badge en objeto) + panel de atributos.
**Gesto canónico:** ninguno (automático al crear).

**Historia:**
> Como autor de dominio, quiero que cada requirement (canvas-nativo o IA-materializado) tenga un atributo `origin` visible en la auditoría para saber quién lo propuso.

**Contexto de negocio:**
La distinción humano vs IA es materia regulatoria en industrias críticas (salud, safety). El atributo `origin` + referencia a `genaiGenerationId` permite rastrear proveniencia y responsabilizar. Es el mínimo de gobernanza.

**Criterios de aceptación:**
- **Dado** que creo un requirement vía A1 (humano), **cuando** se persiste, **entonces** `origin="human"` y `genaiGenerationId=null`.
- **Dado** que materializo un requirement IA (HU-A2.020), **cuando** se persiste, **entonces** `origin="ai"` y `genaiGenerationId=<UUID>`.
- **Dado** que edito un requirement IA materializado, **cuando** confirmo la edición, **entonces** `origin` pasa a `"ai-edited"` preservando `genaiGenerationId`.
- **Dado** que miro el canvas, **cuando** un requirement tiene `origin="ai"` o `"ai-edited"`, **entonces** el objeto lleva un badge discreto (p. ej. icono 🤖 o color de borde).
- **Dado** que exporto a PDF/SVG, **cuando** se incluye el requirement, **entonces** el badge queda en el render exportado.
- **Dado** que filtro por origen, **cuando** aplico filtro, **entonces** veo solo requirements humanos o solo IA o ambos.

**Reglas y restricciones:**
- `origin` enum: `"human" | "ai" | "ai-edited"`.
- El atributo es kernel (parte de `requirement.attributes`), no solo UI.
- No es editable directamente por el usuario — solo por el flujo de creación/edición.
- En Excel export: columna adicional `Origin`.

**Modelo de datos tocado:**
- `requirement.origin` — enum — persistente.
- `requirement.genaiGenerationId` — UUID nullable — persistente.

**Dependencias:**
- Bloqueada por: HU-A2.020.
- Relaciona: EPICA-A1.

**Integraciones:**
- Renderer badge.
- Exporter PDF/SVG/Excel.

**Notas de evidencia:**
- Fuente: §1 (ausencia total en OPCloud).
- Clase de afirmación: hipótesis de diseño del repo (compliance driven).

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [genai, auditoría, origin, a1, compliance].

---

### HU-A2.022 — Exponer conteo de tokens y costo estimado por generación

**Actor primario:** AO.
**Actores secundarios:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** X primario; C secundario.
**Superficie UI:** modal (pie del panel tras generación) + historial (HU-A2.018).
**Gesto canónico:** ninguno (automático).

**Historia:**
> Como admin de organización, quiero ver cuántos tokens consumió cada generación y el costo estimado para presupuestar y evitar abuso de la API IA.

**Contexto de negocio:**
LLMs de pago se facturan por token. Sin observabilidad de consumo, una generación sobre un modelo grande puede costar inesperadamente. Exponer tokens y costo por corrida es control mínimo de gasto.

**Criterios de aceptación:**
- **Dado** que termina una generación, **cuando** miro el pie del modal, **entonces** veo `Tokens: in=<N> out=<M> | Estimated cost: <$X.XX>`.
- **Dado** que el provider no reporta tokens, **cuando** se calcula, **entonces** se usa estimación heurística local (chars/4) con badge `(estimated)`.
- **Dado** que abro el historial (HU-A2.018), **cuando** miro cada entrada, **entonces** tiene columnas `tokensIn`, `tokensOut`, `costUsd`.
- **Dado** que supero un umbral configurable de costo por corrida (p. ej. `$5`), **cuando** disparo GO!, **entonces** se abre confirmación `Estimated cost: $X. Continue?`.
- **Dado** que superé el umbral diario/mensual por organización, **cuando** intento GO!, **entonces** se bloquea con mensaje claro.

**Reglas y restricciones:**
- Tarifa por token configurable por provider (los providers la publican).
- Umbrales configurables por admin (por corrida, por día, por mes).
- El costo es estimado — factura real la envía el provider aparte.

**Modelo de datos tocado:**
- `genaiGeneration.tokensIn` — int — persistente.
- `genaiGeneration.tokensOut` — int — persistente.
- `genaiGeneration.costUsd` — decimal — persistente.
- `genaiProviderConfig.thresholdPerRunUsd` — decimal — persistente.
- `genaiProviderConfig.thresholdPerDayUsd` — decimal — persistente.
- `genaiProviderConfig.thresholdPerMonthUsd` — decimal — persistente.

**Dependencias:**
- Bloqueada por: HU-A2.005.
- Relaciona: HU-A2.018.

**Integraciones:**
- Adapter LLM — lectura de campo `usage` de la respuesta.

**Notas de evidencia:**
- Fuente: ampliación del repo; OPCloud no lo expone.
- Clase de afirmación: hipótesis (control operativo estándar).

**Prioridad:** C.
**Tamaño:** M.
**Etiquetas:** [genai, costos, tokens, observabilidad, presupuesto].

---

### HU-A2.023 — Garantizar privacy: opt-in al envío del modelo a LLM externo

**Actor primario:** AO.
**Actores secundarios:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** C primario; X secundario.
**Superficie UI:** diálogo de consentimiento pre-primer-GO! + setting persistente.
**Gesto canónico:** aceptación explícita en checkbox.

**Historia:**
> Como admin de organización, quiero que el primer uso de la extensión IA exija consentimiento explícito porque enviar el modelo a un proveedor externo cruza el borde de datos de la organización.

**Contexto de negocio:**
OPM modela sistemas que pueden contener IP sensible (diseños industriales, procesos clínicos, secretos comerciales). Enviar un modelo a Gemini/Anthropic/OpenAI es una decisión de gobernanza de datos, no una operación rutinaria. El opt-in explícito protege al admin y al modelador.

**Criterios de aceptación:**
- **Dado** que es la primera vez que el usuario/organización usa GenAI, **cuando** se dispara `GO!`, **entonces** se abre un diálogo de consentimiento: `This will send the full model (OPL + triples) to <provider>. Data will be transmitted to a third party. Do you consent?` con checkbox `Don't ask again for this organization` (solo AO).
- **Dado** que el admin marca `Don't ask again` y acepta, **cuando** siguientes usuarios disparan GO!, **entonces** no ven el diálogo nuevamente (hasta cambiar de provider).
- **Dado** que el usuario rechaza, **cuando** cierra el diálogo, **entonces** la generación se cancela sin transmisión.
- **Dado** que el admin habilita `Require per-run consent` en config, **cuando** cada usuario dispara GO!, **entonces** ve el diálogo **cada vez** (override del don't-ask-again).
- **Dado** que el modelo está marcado `classification=confidential`, **cuando** intento GO!, **entonces** el diálogo se refuerza con advertencia explícita sobre la clasificación.

**Reglas y restricciones:**
- El consentimiento se persiste por organización y por provider (distintos providers requieren consentimientos separados).
- Hay dos niveles: `per-org-once`, `per-run`. Default sugerido: `per-org-once` con opción a endurecer.
- El diálogo no es skipeable programáticamente.
- La decisión se audita (quién aceptó, cuándo, qué provider).

**Modelo de datos tocado:**
- `genaiConsent.organizationId` — FK — persistente.
- `genaiConsent.provider` — enum — persistente.
- `genaiConsent.acceptedBy` — userId — persistente.
- `genaiConsent.acceptedAt` — timestamp — persistente.
- `genaiConsent.policy` — enum `"per-org-once" | "per-run"` — persistente.

**Dependencias:**
- Bloqueada por: HU-A2.005.
- Bloquea a: HU-A2.003 (sin consentimiento no hay GO!).

**Integraciones:**
- EPICA-80 (config-user-org) — perfil de organización.
- Auditoría.

**Notas de evidencia:**
- Fuente: ampliación del repo; OPCloud no expone consentimiento explícito.
- Clase de afirmación: hipótesis (requisito regulatorio estándar: GDPR, HIPAA en HDOS).

**Prioridad:** S (bloqueador regulatorio en contextos clínicos).
**Tamaño:** M.
**Etiquetas:** [genai, privacy, consentimiento, seguridad, compliance, gdpr].

---

### HU-A2.024 — Reportar errores de la API IA (timeout, auth, cuota, malformed)

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; X secundario.
**Superficie UI:** modal (reemplazo del spinner por panel de error).
**Gesto canónico:** ninguno (automático al fallar).

**Historia:**
> Como autor de dominio, quiero ver mensajes de error claros y accionables cuando la API IA falla para entender si el problema es de red, credenciales, cuota o formato.

**Contexto de negocio:**
OPCloud no documenta manejo de errores. En producción, cada tipo de fallo requiere respuesta distinta: timeout → reintentar; auth → reconfigurar key; cuota → esperar o cambiar plan; malformed → reportar bug. Mensajes genéricos como "Error" dañan la experiencia.

**Criterios de aceptación:**
- **Dado** que la API no responde en el timeout configurado, **cuando** expira, **entonces** el modal muestra `Request timed out after <N>s. Try again or simplify the model.` con botón `Retry`.
- **Dado** que la API devuelve `401 Unauthorized`, **cuando** ocurre, **entonces** el modal muestra `Invalid API key. Check GenerativeAI > Update API Key.` con botón `Open API Key dialog`.
- **Dado** que la API devuelve `429 Too Many Requests` o equivalente, **cuando** ocurre, **entonces** el modal muestra `Quota exceeded. Contact admin or wait <retry-after>s.`
- **Dado** que la respuesta está malformada (JSON inválido, parseo de requirements falla), **cuando** ocurre, **entonces** el modal muestra `Response format error. Raw response saved to history.` con link al historial.
- **Dado** que hay error de red, **cuando** ocurre, **entonces** el modal muestra `Network error. Check internet connection.` con botón `Retry`.
- **Dado** que un error ocurre, **cuando** se muestra, **entonces** el botón `Close` sigue funcionando y el canvas no se altera.

**Reglas y restricciones:**
- Tipología de errores: `timeout | auth | quota | malformed | network | unknown`.
- Cada error tiene CTA específico.
- Errores se loggean en historial (HU-A2.018) con `status=failed`.
- El raw response malformado se preserva para debugging.

**Modelo de datos tocado:**
- `genaiGeneration.status` — enum con `"failed"` añadido — persistente.
- `genaiGeneration.errorType` — enum — persistente si falló.
- `genaiGeneration.errorMessage` — string — persistente.

**Dependencias:**
- Bloqueada por: HU-A2.003, HU-A2.005.
- Relaciona: HU-A2.018.

**Integraciones:**
- Adapter LLM (mapea códigos HTTP a tipología).

**Notas de evidencia:**
- Fuente: §11 pregunta abierta Q-A2.6 (manejo de errores).
- Clase de afirmación: observación negativa (no observado en OPCloud).

**Prioridad:** S (resiliencia operativa mínima).
**Tamaño:** S.
**Etiquetas:** [genai, error, resiliencia, modal, ux-error].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q-A2.1**: ¿La entrada `AI Reqs Generation` queda deshabilitada si no hay modelo abierto? OPCloud no lo aclara; inferencia razonable (cf. HU-A2.001).
- **Q-A2.2**: ¿El listado IA se cachea por modelo durante la sesión o se descarta al cerrar el modal? (cf. HU-A2.002, HU-A2.006, HU-A2.013, HU-A2.018). Marcada `requires-clarification`.
- **Q-A2.3**: Al cerrar el modal mientras está en loading, ¿la operación se cancela o sigue en background? (cf. HU-A2.003, HU-A2.006).
- **Q-A2.4**: ¿Qué ocurre si disparo GO! con modelo vacío? (cf. HU-A2.004).
- **Q-A2.5**: ¿Cómo maneja OPCloud modelos que exceden el contexto del LLM? Truncado, resumen o rechazo. (cf. HU-A2.004).
- **Q-A2.6**: ¿Cómo maneja OPCloud errores de API IA (timeout, auth, cuota, malformed)? No observado; HU-A2.024 es ampliación del repo.
- **Q-A2.7**: ¿La jerarquía de requirements admite más de un nivel de refinamiento (nieto REQ-0006a1)? No observado. (cf. HU-A2.010).
- **Q-A2.8**: ¿OPCloud ofrece round-trip de un REQ-NNNN IA a un objeto `<<Requirement>>` canvas? No observado; HU-A2.020 asume que no y propone el puente.
- **Q-A2.9**: ¿Status distinto de `Proposed` es editable desde el modal, o solo desde Excel externo? No observado; HU-A2.019 asume que sí en este repo.
- **Q-A2.10**: ¿Los parámetros del LLM (modelo exacto, temperatura, top-p) son expuestos al admin? No observado; HU-A2.005 asume que sí en este repo.
- **Q-A2.11**: ¿Las entradas hermanas del submenú GenerativeAI (AI OPD Summary, AI Model Summary, AI Impact Analysis) comparten historial, plantillas y costos con AI Reqs Generation? (fuera del alcance de esta épica, a documentar en futuras épicas).
- **Q-A2.12**: Idioma del output por default: ¿OPCloud detecta automáticamente desde OPL o es siempre inglés? Todo el ejemplo observado está en inglés (OnStar).

## Referencias cruzadas

- **Doc fuente:** `opcloud-reverse/a2-extension-generative-ai.md`.
- **Épica hermana directa:** **EPICA-A1** (`a1-extension-requirements.md`) — requirements canvas-nativo. HU-A2.019, HU-A2.020 y HU-A2.021 son el puente hacia A1.
- **Épicas que aporta contexto a A2:**
  - **EPICA-A0** (`a0-extension-stereotypes.md`) — A2.020 depende de que `<<Requirement>>` exista como stereotype.
  - **EPICA-50** (`50-opl-pane.md`) — A2.004 consume OPL.
  - **EPICA-80** (`80-config-user-org.md`) — A2.005, A2.017, A2.023 se alojan en settings de organización.
  - **EPICA-82** (`82-config-organization-ontology.md`) — A2.017 (plantillas de instrucción por dominio) puede vivir ahí.
  - **EPICA-30** (`30-persistencia-save-load.md`) — A2.018 (historial) conecta con persistencia del modelo.
  - **EPICA-D0** (`d0-analysis-missing-knowledge.md`) — A2.014 (sugerir faltantes) se complementa con análisis propio del repo.
- **Invariantes del repo:**
  - `src/nucleo/tipos.ts` — extender `Thing` con `stereotype` y `attributes` para A2.020 (coordinación con EPICA-A0 y EPICA-A1).
  - `src/nucleo/validacion/` — regla: `requirement.origin` obligatorio; `genaiGenerationId` debe existir si `origin ∈ {ai, ai-edited}`.
  - `src/persistencia/` — nuevo store `genaiGenerations` y `genaiProviderConfig` (encriptado) — coordinar con ADR de persistencia.
  - `src/render/jointjs/` — badge `[from AI]` sobre objetos `<<Requirement>>` materializados.
  - `ssot/opm-*.md` — esta épica no agrega primitivas OPM; extiende mediante mecanismo de stereotype + attributes, sin tocar SSOT.
  - `docs/historias-usuario/epica-10-canvas-creacion-cosas.md` — piloto metodológico de esta revisión.
- **Constitución categórica (`docs/ARQUITECTURA-CATEGORICA.md`):** la generación IA es un **funtor externo** de `OPM → Requirements`. Su composición con A1 (`Requirements → Canvas`) cierra el round-trip `OPM → AI → Requirements → Canvas → OPM`. E-x: `materialize ∘ accept ∘ generate` debe ser idempotente por `genaiGenerationId` (dos materializaciones del mismo requirement no crean dos objetos canvas).
