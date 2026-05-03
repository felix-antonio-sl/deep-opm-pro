---
epica: "EPICA-B0"
titulo: "Simulación conceptual — conmutación de modo, barra secundaria, ejecución paso a paso y marcas sobre canvas"
doc_fuente: "opcloud-reverse/b0-simulation-conceptual.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "S"
hu_emitidas: 30
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "Pilot: epica-10-canvas-creacion-cosas.md"
---

## Resumen

Esta épica cubre el **baseline** de la familia de simulación (b0–b5): la activación del modo simulación desde la barra principal, la barra secundaria con sus controles (Reproducir/Pausar/Detener, Sync/Async, Randomize, XLSX, contador de pasos, Animation Speed, Headless Runner), las marcas visuales sobre el canvas (contorno cian del proceso activo, tokens verdes animados sobre enlaces, disco verde de estado actual), y el ciclo pedagógico canónico **simular → leer OPL → reordenar → re-simular** que valida el modelo sin valores numéricos.

La simulación conceptual verifica que el modelo se comporta como se espera **antes** de incorporar magnitudes (delegado a EPICA-B1), funciones user-defined (B2), rangos (B3), condiciones/loops (B4) o input de usuario (B5). Las HUs aquí enumeradas son el sustrato común del que todas las demás épicas `b` dependen: quien toque simulación computacional asume que este baseline está implementado.

La SSOT OPM define explícitamente los modelos conceptuales y de ejecución como regímenes distintos [opm-iso-19450-es.md §Modelos conceptuales y de ejecucion]. Esta épica implementa el puente entre ambos regímenes: crea instancias operacionales a partir del modelo conceptual, respetando el orden temporal derivado de la geometría [§Árboles OPD y control implícito] y las convenciones visuales de marcas de ejecución [opm-visual-es.md §V-53..V-55].

Las HUs se numeran siguiendo la aparición en el doc fuente (§2.1 → §2.2 → §2.3 → §2.4 → §3 → §4 → §7 → §9 → §11). Las preguntas abiertas del doc (§11) se reflejan como HUs con etiqueta `requires-clarification` o como notas de evidencia en HUs existentes.

## Tabla de HU de la épica

| ID | Título | Actor | Prioridad | Tamaño | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-B0.001 | Activar modo simulación desde barra principal | IS | S | M | mixto | [§Modelos conceptuales y de ejecucion] |
| HU-B0.002 | Reemplazar barra de edición por barra de simulación | IS | S | S | opcloud-ui | — |
| HU-B0.003 | Volver a modo edición desde simulación | IS | S | XS | mixto | [§Modelos conceptuales y de ejecucion] |
| HU-B0.004 | Ver inventario de controles en barra secundaria detenida | IS | S | S | opcloud-ui | — |
| HU-B0.005 | Iniciar simulación con botón Reproducir | IS | S | M | mixto | [§Modelos conceptuales y de ejecucion] |
| HU-B0.006 | Pausar simulación en curso con botón Pausar | IS | S | S | mixto | [§Modelos conceptuales y de ejecucion] |
| HU-B0.007 | Reanudar simulación pausada | IS | S | S | mixto | [§Modelos conceptuales y de ejecucion] |
| HU-B0.008 | Detener y resetear con botón Detener | IS | S | S | mixto | [§Modelos conceptuales y de ejecucion] |
| HU-B0.009 | Ver mutación de barra: Reproducir → Pausar al iniciar | IS | S | XS | opcloud-ui | — |
| HU-B0.010 | Ocultar controles no aplicables durante ejecución | IS | S | XS | opcloud-ui | — |
| HU-B0.011 | Ajustar velocidad con deslizador Animation Speed | IS | S | S | opcloud-ui | — |
| HU-B0.012 | Ajustar velocidad durante ejecución (en caliente) | IS | C | XS | opcloud-ui | — |
| HU-B0.013 | Ejecutar en modo Sync determinista | IS | S | M | opm-semantica | [§Modelos conceptuales y de ejecucion] [§Árboles OPD y control implícito] |
| HU-B0.014 | Ejecutar en modo Async paralelo | IS | C | M | opm-semantica | [§Modelos conceptuales y de ejecucion] [§Árboles OPD y control implícito] |
| HU-B0.015 | Activar Headless Runner (sin animación) | IS | C | S | opcloud-ui | — |
| HU-B0.016 | Resaltar proceso activo con contorno cian grueso | IS | S | M | mixto | [opm-visual-es.md §17] [JOYAS §9] |
| HU-B0.017 | Animar token verde sobre enlace en uso | IS | S | M | mixto | [opm-visual-es.md] [JOYAS §9] |
| HU-B0.018 | Marcar estado actual con disco verde anclado | IS | S | M | opm-semantica | [opm-visual-es.md §17] [JOYAS §9] |
| HU-B0.019 | Preservar borde oliva grueso del estado inicial | IS | S | XS | opm-semantica | [opm-visual-es.md] [§Estados iniciales, Current, por defecto y finales] |
| HU-B0.020 | Derivar orden de ejecución desde coordenada Y | IS | S | M | opm-semantica | [§Árboles OPD y control implícito] [opm-visual-es.md §17] |
| HU-B0.021 | Actualizar OPL al reordenar subprocesos en Y | IS | S | S | opm-semantica | [§Representación bimodal] [§Acoplamiento de proyección] |
| HU-B0.022 | Cerrar ciclo simular → leer OPL → reordenar → re-simular | IS | S | S | opm-semantica | [§Modelos conceptuales y de ejecucion] |
| HU-B0.023 | Ver contador de pasos en barra secundaria | IS | C | XS | opcloud-ui | — |
| HU-B0.024 | Bloquear edición del modelo durante simulación | IS | S | S | opcloud-ui | — |
| HU-B0.025 | Mantener panel OPL estático durante ejecución | IS | S | XS | opm-semantica | [§Representación bimodal] |
| HU-B0.026 | Navegar entre OPDs durante simulación | IS | C | M | mixto | [§Modelos conceptuales y de ejecucion] [§Navegación de OPD y composición de OPL] |
| HU-B0.027 | Reflejar transiciones de estado de objeto en simulación | IS | S | M | opm-semantica | [§Modelos conceptuales y de ejecucion] [§Estados de objeto] |
| HU-B0.028 | Usar atajo Espacio para Reproducir/Pausar | IS | C | XS | opcloud-ui | — |
| HU-B0.029 | Distinguir cian de refinable vs cian de activo por contexto | IS | S | S | mixto | [opm-visual-es.md] |
| HU-B0.030 | Ver tooltip en controles de simulación | IS | C | XS | opcloud-ui | — |

Total: **30 historias de usuario** (12 opm-semantica, 10 opcloud-ui, 8 mixto).

## Historias de usuario

### HU-B0.001 — Activar modo simulación desde barra principal

**Actor primario:** IS (ingeniero de simulación).
**Actores secundarios:** ME (modelador experto — también lo usa para validar modelos que construye).
**Tipo:** mixto.
**Nivel categórico:** U primario; V secundaria (render toolbar).
**Superficie UI:** barra-principal + barra-secundaria.
**Gesto canónico:** clic en botón `Simulation & Execution`.

**Historia:**
> Como ingeniero de simulación, quiero activar el modo simulación desde la barra principal con un solo clic para empezar a verificar el modelo sin abrir un modal ni cambiar de pantalla.

**Contexto de negocio:**
La entrada al modo simulación debe ser inmediata y reversible. OPCloud expone un único botón `Simulation & Execution` (icono de elipse azul ringed, segundo grupo izquierdo de la barra principal). Un solo clic conmuta la barra secundaria — no aparecen diálogos ni se pierde contexto visual. El canvas base permanece idéntico. La SSOT [§Modelos conceptuales y de ejecucion] establece que los modelos conceptuales describen patrones de estructura y comportamiento, mientras que los modelos de ejecución representan instancias operacionales durante una simulación. Esta HU inicia la transición entre ambos regímenes.

**Criterios de aceptación:**
- **Dado** que tengo un modelo abierto en modo edición, **cuando** hago clic en el botón `Simulation & Execution` de la barra principal, **entonces** la barra secundaria inferior reemplaza la barra de edición por la barra de simulación.
- **Dado** que hice clic, **cuando** se completa la transición, **entonces** el canvas base, panel OPL, árbol de OPDs y mini-mapa permanecen sin cambios visuales.
- **Dado** que activé modo simulación, **cuando** miro la barra secundaria, **entonces** veo los controles Reproducir / Detener / Randomize / XLSX / contador de pasos / Sync Execute / Async Execute / grid / Animation Speed / Headless Runner.
- **Dado** que soy novato en simulación, **cuando** activo el modo, **entonces** no aparece tutorial ni modal bloqueante.

**Reglas y restricciones:**
- El gesto es **clic único**, no doble clic ni arrastre.
- El icono exacto es una elipse azul ringed (segundo grupo izquierdo de la barra principal).
- La transición a modo simulación **no persiste** a sesión — al recargar el modelo se vuelve a modo edición.
- No hay confirmación modal: la transición es inmediata.

**Modelo de datos tocado:**
- `appState.modoSimulacion` — `"edicion" | "simulacion"` — transitorio.

**Dependencias:**
- Bloqueada por: infraestructura de barra (existente en toda EPICA-10).
- Bloquea a: HU-B0.002, HU-B0.004, HU-B0.005.

**Integraciones:**
- Barra principal (visual).
- Barra secundaria (renderizador).

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [§Modelos conceptuales y de ejecucion].
- Fuente OPCloud: `opcloud-reverse/b0-simulation-conceptual.md` §2.1, §3.1 paso 2.
- Frames: frame 3 (pre), frame 4 (post).
- Transcripción: "we'll go to the simulation execution button in the main toolbar and click on it; this will open the simulation toolbar on the secondary toolbar".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [simulacion-conceptual, barra, ui, conmutacion-modo, entrada-modo].

---

### HU-B0.002 — Reemplazar barra de edición por barra de simulación

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categórico:** V primario; U secundaria.
**Superficie UI:** barra-secundaria.
**Gesto canónico:** ninguno (derivado de la conmutación HU-B0.001).

**Historia:**
> Como ingeniero de simulación, quiero que la barra secundaria de edición sea reemplazada por la de simulación (no yuxtapuesta) para no confundir gestos de edición con gestos de simulación.

**Contexto de negocio:**
OPCloud mantiene **una sola barra secundaria** que muta según el modo. Evita la contaminación visual de mostrar gestos de crear (objeto, proceso, enlace) mientras se simula — gestos que de todos modos están bloqueados durante la ejecución. La atomicidad del canal de comandos es lo que garantiza la coherencia del modo.

**Criterios de aceptación:**
- **Dado** que activo modo simulación, **cuando** la barra muta, **entonces** los iconos de `crear proceso`, `crear objeto`, `crear estado` y `crear enlace` desaparecen del espacio secundario.
- **Dado** que estoy en modo simulación, **cuando** miro la barra secundaria, **entonces** los únicos controles visibles son los de simulación.
- **Dado** que vuelvo a modo edición (HU-B0.003), **cuando** ocurre la transición, **entonces** la barra de edición reaparece con todos sus iconos.

**Reglas y restricciones:**
- La transición es **atómica**: no existe un estado intermedio con ambas barras.
- Los iconos heredados (persona, pluma) del modo puntero/draw general quedan visibles — pertenecen al shell de la barra secundaria, no a la edición específica.

**Modelo de datos tocado:**
- Ninguno adicional a HU-B0.001.

**Dependencias:**
- Bloqueada por: HU-B0.001.
- Bloquea a: HU-B0.024 (bloqueo de edición).

**Integraciones:**
- Renderizador de barra secundaria.

**Notas de evidencia:**
- Fuente OPCloud: §2.1 (observación crítica adv-02.7), §7.3.
- Frames: frame 3 vs frame 4 (contraste).
- Clase de afirmación: observado + confirmado.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [simulacion-conceptual, ui, barra-secundaria, atomicidad-modo].

---

### HU-B0.003 — Volver a modo edición desde simulación

**Actor primario:** IS.
**Actores secundarios:** ME.
**Tipo:** mixto.
**Nivel categórico:** U primario; V secundaria.
**Superficie UI:** barra-principal o botón de edición (rectángulo verde).
**Gesto canónico:** clic en botón `Simulation & Execution` de nuevo **o** en el botón edición (rectángulo verde) del primer grupo.

**Historia:**
> Como ingeniero de simulación, quiero volver a modo edición con el mismo gesto simétrico que usé para entrar para corregir el modelo cuando detecto una anomalía.

**Contexto de negocio:**
El ciclo canónico es `simular → reordenar → re-simular`. Volver a edición es el segundo paso del ciclo. La simetría del gesto (mismo botón conmuta) es esperable; sin embargo, el doc fuente declara **pregunta abierta** (§11.1) sobre si el gesto es clic en `Simulation & Execution` de nuevo o en el botón edición (rectángulo verde). La SSOT [§Modelos conceptuales y de ejecucion] distingue régimen conceptual de régimen de ejecución; la transición entre regímenes debe ser explícita.

**Criterios de aceptación:**
- **Dado** que estoy en modo simulación detenida, **cuando** hago clic en el botón `Simulation & Execution` de la barra principal, **entonces** vuelvo a modo edición y la barra secundaria recupera los iconos de crear.
- **Dado** que estoy en modo simulación detenida, **cuando** hago clic en el botón de edición (rectángulo verde), **entonces** vuelvo a modo edición.
- **Dado** que estoy en modo simulación **corriendo**, **cuando** intento volver a edición, **entonces** [pregunta abierta §11.1]: se debe primero detener con Detener, o la transición fuerza una detención implícita.

**Reglas y restricciones:**
- Gesto exacto pendiente de clarificar (§11.1). Etiqueta: `requires-clarification`.
- La salida a edición desde simulación corriendo no está documentada; se infiere detención implícita.

**Modelo de datos tocado:**
- `appState.modoSimulacion` — vuelve a `"edicion"`.
- `sesionSimulacion.modo` — si estaba `ejecutando`/`pausado`, se resetea a `detenido`.

**Dependencias:**
- Bloqueada por: HU-B0.001.

**Integraciones:**
- Barra principal.
- Barra secundaria.

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [§Modelos conceptuales y de ejecucion].
- Fuente OPCloud: §3.3 paso 4, §11.1 (pregunta abierta sobre gesto exacto).
- Clase de afirmación: inferido + abierto.
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [simulacion-conceptual, barra, ui, conmutacion-modo, salida-modo, requires-clarification].

---

### HU-B0.004 — Ver inventario de controles en barra secundaria detenida

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categórico:** V primario; U secundaria.
**Superficie UI:** barra-secundaria.
**Gesto canónico:** ninguno (render declarativo post-activación de modo simulación).

**Historia:**
> Como ingeniero de simulación, quiero ver en la barra secundaria detenida todos los controles de simulación disponibles (Reproducir, Detener, Randomize, XLSX, contador de pasos, Sync/Async, grid, Animation Speed, Headless) para entender qué puedo hacer antes de ejecutar.

**Contexto de negocio:**
La barra secundaria en estado detenido es el **catálogo** de operaciones disponibles. Aunque el narrador enuncia que para simulación conceptual basta con Sync y Detener (§2.2), el catálogo completo está siempre visible — reduce el costo cognitivo de descubrir capacidades.

**Criterios de aceptación:**
- **Dado** que activo modo simulación y no he iniciado ejecución, **cuando** miro la barra secundaria, **entonces** veo en orden, de izquierda a derecha: iconos puntero/pluma (heredados), Reproducir ▶, Detener ■, Randomize 🎲, XLSX ↓, contador de pasos (`1` por defecto), Sync Execute (↻▶), Async Execute (▶△), grid/tabla, Animation Speed (deslizador a `100%` por defecto), Headless Runner (casilla desmarcada por defecto).
- **Dado** que miro la barra secundaria, **cuando** es el primer uso, **entonces** todos los valores por defecto son: paso=`1`, velocidad=`100%`, headless=off, randomize=off, ejecución=sync.

**Reglas y restricciones:**
- Inventario fijo, derivado de §2.2 y §5.1.
- El contador de pasos es editable (entero).
- El deslizador de Animation Speed es editable (0–N%).
- Grid/tabla es **hipótesis** — posiblemente abre vista tabular de log (pendiente confirmar).

**Modelo de datos tocado:**
- `sesionSimulacion.tipoEjecucion` — `"sync"` (por defecto).
- `sesionSimulacion.velocidadAnimacion` — `100` (por defecto).
- `sesionSimulacion.headless` — `false` (por defecto).
- `sesionSimulacion.contadorPasos` — `1` (por defecto).

**Dependencias:**
- Bloqueada por: HU-B0.001, HU-B0.002.

**Integraciones:**
- Renderizador de barra secundaria.

**Notas de evidencia:**
- Fuente OPCloud: §2.2, §5.1 tabla.
- Frames: frame 4, frame 18.
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [simulacion-conceptual, ui, barra-secundaria, inventario, valores-defecto].

---

### HU-B0.005 — Iniciar simulación con botón Reproducir

**Actor primario:** IS.
**Tipo:** mixto.
**Nivel categórico:** K (dispara SesionSimulacion) primario; V secundaria.
**Superficie UI:** barra-secundaria.
**Gesto canónico:** clic en botón Reproducir ▶.

**Historia:**
> Como ingeniero de simulación, quiero iniciar la simulación con un clic en Reproducir para ejecutar el modelo paso a paso sin pasos de configuración adicionales.

**Contexto de negocio:**
El flujo mínimo de simulación conceptual es `Reproducir → observar → Detener`. El narrador confirma: "we're going to use the **sync simulation and stop** — those are sufficient". Reproducir es el disparador universal; no requiere decidir parámetros para arrancar. La SSOT [§Modelos conceptuales y de ejecucion] establece que "quien modela puede simular el comportamiento creando instancias operacionales de cosas y siguiendo el flujo de control de ejecución definido por las conexiones y las reglas semánticas de OPM".

**Criterios de aceptación:**
- **Dado** que estoy en modo simulación detenida, **cuando** hago clic en Reproducir ▶, **entonces** `sesionSimulacion.modo` pasa de `"detenido"` a `"ejecutando"`.
- **Dado** que la simulación arrancó, **cuando** se renderiza el primer paso, **entonces** aparece el primer token verde sobre el enlace de entrada del primer proceso activable (derivado del orden Y — HU-B0.020).
- **Dado** que la simulación arrancó, **cuando** miro la barra, **entonces** Reproducir ▶ se sustituye por Pausar `||` (ver HU-B0.009).
- **Dado** que la simulación arrancó, **cuando** miro la barra, **entonces** los controles Randomize, XLSX, contador de pasos, Sync y Async quedan ocultos (ver HU-B0.010).
- **Dado** que la simulación arrancó, **cuando** miro el canvas, **entonces** el primer proceso activo recibe contorno cian grueso (ver HU-B0.016).

**Reglas y restricciones:**
- No hay fase de "arranque" diferida — Reproducir produce efecto inmediato.
- En modo conceptual no hay valores numéricos que inicializar; no se abre diálogo previo.
- Reproducir usa `tipoEjecucion=sync` por defecto.

**Modelo de datos tocado:**
- `sesionSimulacion.modo` — pasa a `"ejecutando"`.
- `sesionSimulacion.procesosActivosActuales` — inicializa con primer proceso.
- `sesionSimulacion.tokensEnVuelo` — inicializa con primeros tokens.

**Dependencias:**
- Bloqueada por: HU-B0.001, HU-B0.002, HU-B0.004.
- Bloquea a: HU-B0.006, HU-B0.008, HU-B0.009, HU-B0.016, HU-B0.017.

**Integraciones:**
- Renderizador canvas (tokens y contornos).
- Núcleo de simulación (nuevo subsistema).
- Motor OPL (mantiene estado).

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [§Modelos conceptuales y de ejecucion].
- Fuente OPCloud: §2.2 última columna, §3.2 pasos 2-3.
- Frames: frame 11, 12.
- Transcripción: "we're going to use the sync simulation and stop".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [simulacion-conceptual, reproducir, ejecucion, ciclo-arranque].

---

### HU-B0.006 — Pausar simulación en curso con botón Pausar

**Actor primario:** IS.
**Tipo:** mixto.
**Nivel categórico:** U primario; K (estado de sesión).
**Superficie UI:** barra-secundaria.
**Gesto canónico:** clic en botón Pausar `||` (misma posición que Reproducir).

**Historia:**
> Como ingeniero de simulación, quiero pausar la simulación con un clic para congelar los tokens y la marca de proceso activo, y poder inspeccionar sin avanzar.

**Contexto de negocio:**
Pausar comparte slot con Reproducir — la barra mutada muestra `||` cuando la simulación está corriendo. Pausar permite lectura pausada del estado: dónde está el token, cuál es el proceso activo, en qué estado está cada objeto. Es imprescindible para diagnóstico visual de modelos complejos.

**Criterios de aceptación:**
- **Dado** que la simulación está corriendo, **cuando** hago clic en Pausar `||`, **entonces** `sesionSimulacion.modo` pasa de `"ejecutando"` a `"pausado"`.
- **Dado** que pausé, **cuando** miro el canvas, **entonces** los tokens quedan congelados en su posición actual (no avanzan ni vuelven al origen).
- **Dado** que pausé, **cuando** miro el canvas, **entonces** el contorno cian del proceso activo se preserva.
- **Dado** que pausé, **cuando** miro los objetos con discos verdes de estado actual, **entonces** los discos se preservan.
- **Dado** que pausé, **cuando** miro la barra, **entonces** Pausar `||` se sustituye por Reproducir ▶ (para reanudar — ver HU-B0.007).

**Reglas y restricciones:**
- Pausar es **reversible** (HU-B0.007).
- Pausar **no** resetea (HU-B0.008 es Detener).
- Comportamiento de pausa inferido por simetría — no hay frame dedicado (§11.2 pregunta abierta).

**Modelo de datos tocado:**
- `sesionSimulacion.modo` — pasa a `"pausado"`.
- `sesionSimulacion.tokensEnVuelo` — se preservan con `posicion` congelada.

**Dependencias:**
- Bloqueada por: HU-B0.005.
- Bloquea a: HU-B0.007.

**Integraciones:**
- Renderizador canvas.
- Núcleo de simulación.

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [§Modelos conceptuales y de ejecucion].
- Fuente OPCloud: §2.3 tabla, §3.5, §11.2 (pregunta abierta sobre congelación exacta).
- Transcripción: no menciona pausa explícitamente.
- Clase de afirmación: inferido por simetría de UI.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [simulacion-conceptual, pausar, ejecucion, inspeccion].

---

### HU-B0.007 — Reanudar simulación pausada

**Actor primario:** IS.
**Tipo:** mixto.
**Nivel categórico:** U primario; K secundaria.
**Superficie UI:** barra-secundaria.
**Gesto canónico:** clic en botón Reproducir ▶ (mismo slot que Pausar).

**Historia:**
> Como ingeniero de simulación, quiero reanudar la simulación desde el punto de pausa haciendo clic en Reproducir para continuar la ejecución sin perder el estado intermedio.

**Contexto de negocio:**
Simétrico a HU-B0.006. La reanudación debe ser indistinguible del arranque inicial desde el punto de vista del usuario (mismo gesto), pero internamente continúa la sesión sin resetear tokens ni procesos activos.

**Criterios de aceptación:**
- **Dado** que la simulación está pausada, **cuando** hago clic en Reproducir ▶, **entonces** `sesionSimulacion.modo` pasa de `"pausado"` a `"ejecutando"`.
- **Dado** que reanudé, **cuando** miro el canvas, **entonces** los tokens continúan su trayectoria desde la posición donde quedaron congelados.
- **Dado** que reanudé, **cuando** miro la barra, **entonces** Reproducir ▶ vuelve a mostrarse como Pausar `||`.

**Reglas y restricciones:**
- Reanudación **no** reinicia desde el principio; continúa.
- Si se cambió Animation Speed durante la pausa (HU-B0.012), la nueva velocidad aplica desde la reanudación.

**Modelo de datos tocado:**
- `sesionSimulacion.modo` — pasa a `"ejecutando"`.

**Dependencias:**
- Bloqueada por: HU-B0.006.

**Integraciones:**
- Renderizador canvas.
- Núcleo de simulación.

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [§Modelos conceptuales y de ejecucion].
- Fuente OPCloud: §3.5.
- Clase de afirmación: inferido.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [simulacion-conceptual, reproducir, reanudacion, continuidad-sesion].

---

### HU-B0.008 — Detener y resetear con botón Detener

**Actor primario:** IS.
**Tipo:** mixto.
**Nivel categórico:** U primario; K (reset de sesión).
**Superficie UI:** barra-secundaria.
**Gesto canónico:** clic en botón Detener ■.

**Historia:**
> Como ingeniero de simulación, quiero detener la simulación y resetearla con un clic en Detener para volver al estado base del canvas y empezar una nueva ejecución desde cero.

**Contexto de negocio:**
Detener es la acción de reset: devuelve el canvas al estado previo a Reproducir. Es distinto de Pausar (que preserva estado intermedio). El narrador recomienda "sync simulation and stop" como los dos únicos botones suficientes para simulación conceptual — Detener es el punto final del ciclo de validación. La SSOT [§Modelos conceptuales y de ejecucion] distingue ocurrencias operacionales efímeras del modelo conceptual persistente; Detener descarta las ocurrencias y retorna al régimen conceptual.

**Criterios de aceptación:**
- **Dado** que la simulación está corriendo o pausada, **cuando** hago clic en Detener ■, **entonces** `sesionSimulacion.modo` pasa a `"detenido"`.
- **Dado** que detuve, **cuando** miro el canvas, **entonces** todos los tokens verdes desaparecen.
- **Dado** que detuve, **cuando** miro el canvas, **entonces** los contornos cian de procesos activos desaparecen (permanecen solo los de refinables — ver HU-B0.029).
- **Dado** que detuve, **cuando** miro los objetos, **entonces** los discos verdes de estado actual desaparecen (permanece solo el borde oliva grueso de estado Inicial — HU-B0.019).
- **Dado** que detuve, **cuando** miro la barra, **entonces** Pausar `||` vuelve a mostrarse como Reproducir ▶ y reaparecen Randomize, XLSX, contador de pasos, Sync, Async.
- **Dado** que detuve, **cuando** miro contador de pasos, **entonces** vuelve a `1`.

**Reglas y restricciones:**
- Detener es **irreversible**: no hay "deshacer detención" que restaure el estado pre-detención.
- El reset es total — todos los campos `procesosActivosActuales`, `tokensEnVuelo`, `estadosActualesObjetos` se vacían.
- Transición visual inmediata o con animación de disipación es **pregunta abierta** (§11.3).

**Modelo de datos tocado:**
- `sesionSimulacion` — reset a valores por defecto.

**Dependencias:**
- Bloqueada por: HU-B0.005.

**Integraciones:**
- Renderizador canvas.
- Núcleo de simulación.

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [§Modelos conceptuales y de ejecucion].
- Fuente OPCloud: §2.2, §3.6, §11.3 (pregunta abierta).
- Clase de afirmación: inferido + confirmado indirectamente.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [simulacion-conceptual, detener, reset, ciclo-fin].

---

### HU-B0.009 — Ver mutación de barra: Reproducir → Pausar al iniciar

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categórico:** V primario; U secundaria.
**Superficie UI:** barra-secundaria.
**Gesto canónico:** ninguno (derivado de HU-B0.005).

**Historia:**
> Como ingeniero de simulación, quiero que el botón Reproducir se transforme en Pausar al iniciar la simulación para leer el estado actual (ejecutando/detenida) directamente del icono sin buscar otro indicador.

**Contexto de negocio:**
Reproducir y Pausar comparten slot físico. El icono es el único índice del estado de la sesión — no hay etiqueta textual ni luz indicadora. La convención icónica (▶ vs `||`) debe ser clara e inmediata.

**Criterios de aceptación:**
- **Dado** que la simulación está detenida, **cuando** miro la barra, **entonces** en la posición de Reproducir veo el icono ▶.
- **Dado** que la simulación arrancó (o se reanudó), **cuando** miro la barra, **entonces** en la posición de Reproducir veo el icono `||` (Pausar).
- **Dado** que la simulación se pausó, **cuando** miro la barra, **entonces** en la posición vuelve a verse ▶.
- **Dado** que la simulación se detuvo, **cuando** miro la barra, **entonces** en la posición vuelve a verse ▶.

**Reglas y restricciones:**
- Un solo slot físico para Reproducir/Pausar. No se muestran ambos simultáneamente.
- No hay etiqueta textual — solo icono.

**Modelo de datos tocado:**
- Ninguno adicional.

**Dependencias:**
- Bloqueada por: HU-B0.005, HU-B0.006.

**Integraciones:**
- Renderizador de barra.

**Notas de evidencia:**
- Fuente OPCloud: §2.3 tabla.
- Frames: frame 4 (Reproducir visible) vs frame 11 (Pausar visible).
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [simulacion-conceptual, ui, barra-secundaria, conmutacion-icono].

---

### HU-B0.010 — Ocultar controles no aplicables durante ejecución

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categórico:** V primario; U secundaria.
**Superficie UI:** barra-secundaria.
**Gesto canónico:** ninguno.

**Historia:**
> Como ingeniero de simulación, quiero que los controles de configuración (Randomize, XLSX, contador de pasos, Sync, Async, grid) queden ocultos durante la ejecución para no distraer mi atención y evitar clics accidentales.

**Contexto de negocio:**
La barra reducida durante ejecución (§2.3) refleja el principio de **atomicidad del modo de interacción**: mientras la simulación se está ejecutando, el único conjunto de gestos sensatos es Pausar, Detener, ajustar velocidad y alternar Headless. El resto se activaría solo al detener.

**Criterios de aceptación:**
- **Dado** que la simulación arranca, **cuando** la barra muta, **entonces** desaparecen Randomize, XLSX, contador de pasos, Sync Execute, Async Execute, grid/tabla.
- **Dado** que la simulación arranca, **cuando** la barra muta, **entonces** permanecen Pausar (en slot de Reproducir), Detener, deslizador Animation Speed, Headless Runner.
- **Dado** que detengo con Detener, **cuando** la barra vuelve al estado detenido, **entonces** reaparecen todos los controles ocultos.

**Reglas y restricciones:**
- La transición de barra es atómica (no progresiva).
- Headless Runner permanece visible pero presumiblemente **bloqueado** durante ejecución (§2.3 nota hipótesis).

**Modelo de datos tocado:**
- Ninguno adicional.

**Dependencias:**
- Bloqueada por: HU-B0.005, HU-B0.008.

**Integraciones:**
- Renderizador de barra.

**Notas de evidencia:**
- Fuente OPCloud: §2.3 tabla completa.
- Frames: frame 11 (barra reducida) vs frame 4 (barra completa).
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [simulacion-conceptual, ui, barra-secundaria, atomicidad-modo].

---

### HU-B0.011 — Ajustar velocidad con deslizador Animation Speed

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; V secundaria.
**Superficie UI:** barra-secundaria (deslizador Animation Speed).
**Gesto canónico:** arrastre de thumb sobre deslizador.

**Historia:**
> Como ingeniero de simulación, quiero ajustar la velocidad de animación con un deslizador antes de ejecutar para decidir cuán rápido quiero leer cada paso de la ejecución.

**Contexto de negocio:**
La velocidad por defecto es `100%` = 1 segundo por operación (narrador: "currently the default time is spending one second for each operation"). Para modelos cortos el valor por defecto puede ser demasiado lento; para modelos largos puede ser demasiado rápido. El deslizador permite calibrar antes de ejecutar — sin abandonar el flujo.

**Criterios de aceptación:**
- **Dado** que estoy en modo simulación detenida, **cuando** arrastro el thumb del deslizador Animation Speed hacia la derecha, **entonces** `sesionSimulacion.velocidadAnimacion` aumenta hacia valores `>100%` (más rápido).
- **Dado** que arrastro el thumb hacia la izquierda, **cuando** suelto, **entonces** `velocidadAnimacion` disminuye hacia valores `<100%` (más lento).
- **Dado** que tomo simulación con `velocidad=100%`, **cuando** ejecuto, **entonces** cada paso dura ~1 segundo.
- **Dado** que miro el deslizador, **cuando** nunca lo toqué, **entonces** la etiqueta marca `100%` (por defecto).

**Reglas y restricciones:**
- Rango exacto del deslizador (`0%` a `N%`) no verificado — se infiere `[0, 200]` o similar, pendiente de UI final.
- La velocidad afecta **solo la animación**, no la semántica de la simulación.
- Persistencia cross-sesión no verificada (§5.2 dice "efímeros por sesión").

**Modelo de datos tocado:**
- `sesionSimulacion.velocidadAnimacion` — number (por defecto `100`) — transitorio.

**Dependencias:**
- Bloqueada por: HU-B0.004.

**Integraciones:**
- Renderizador canvas (velocidad de tokens).

**Notas de evidencia:**
- Fuente OPCloud: §2.2, §3.2 paso 1, §5.1 tabla, §9.
- Frames: frame 9 (deslizador al mínimo con tooltip visible).
- Transcripción: "currently the default time is spending one second for each operation".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [simulacion-conceptual, ui, control-velocidad, deslizador, animacion].

---

### HU-B0.012 — Ajustar velocidad durante ejecución (en caliente)

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; V secundaria.
**Superficie UI:** barra-secundaria (deslizador).
**Gesto canónico:** arrastre de thumb durante ejecución.

**Historia:**
> Como ingeniero de simulación, quiero poder ajustar la velocidad **durante** la ejecución para acelerar cuando reconozco un patrón o frenar cuando quiero observar con cuidado.

**Contexto de negocio:**
El deslizador es editable en caliente — el doc fuente confirma que durante ejecución el deslizador sigue disponible (§2.3 tabla). Esta capacidad es diferencial frente a herramientas de simulación rígidas: permite adaptar el ritmo a la atención del usuario sin interrumpir la ejecución.

**Criterios de aceptación:**
- **Dado** que la simulación está corriendo, **cuando** arrastro el thumb del deslizador, **entonces** la nueva velocidad aplica desde el siguiente tick de animación sin pausar la ejecución.
- **Dado** que ajusto velocidad en caliente, **cuando** miro la posición del token actual, **entonces** continúa sin "saltar" ni reiniciar su recorrido.
- **Dado** que la simulación está pausada, **cuando** ajusto velocidad, **entonces** la nueva velocidad queda registrada y aplica al reanudar.

**Reglas y restricciones:**
- No hay pausa implícita al mover el deslizador.
- El thumb sigue respondiendo al mouse durante ejecución.

**Modelo de datos tocado:**
- `sesionSimulacion.velocidadAnimacion` — editable en caliente.

**Dependencias:**
- Bloqueada por: HU-B0.005, HU-B0.011.

**Integraciones:**
- Renderizador canvas (reactivo a cambios de velocidad).

**Notas de evidencia:**
- Fuente OPCloud: §2.3, §3.4.
- Frames: frame 11 durante ejecución mantiene deslizador editable.
- Clase de afirmación: observado.

**Prioridad:** C.
**Tamaño:** XS.
**Etiquetas:** [simulacion-conceptual, ui, control-velocidad, en-caliente].

---

### HU-B0.013 — Ejecutar en modo Sync determinista

**Actor primario:** IS.
**Tipo:** opm-semantica.
**Nivel categórico:** K primario; V secundaria.
**Superficie UI:** barra-secundaria (botón Sync Execute).
**Gesto canónico:** clic en Sync Execute o uso de Reproducir con modo sync por defecto.

**Historia:**
> Como ingeniero de simulación, quiero ejecutar la simulación en modo Sync (determinista, un paso a la vez) para leer con claridad el orden exacto de ejecución derivado del orden Y de los subprocesos.

**Contexto de negocio:**
El modo Sync es la ejecución **determinista**: un solo token visible a la vez, un solo subproceso con contorno cian a la vez. El narrador confirma: "it will do each call at one time". Es el modo recomendado para simulación conceptual — permite seguir la secuencia con la mirada. La SSOT [§Árboles OPD y control implícito] prescribe que "la línea temporal dentro de un proceso descompuesto fluye de arriba hacia abajo" y que la invocación implícita se da "cuando un subproceso invoca al subproceso inmediatamente inferior cuando termina".

**Criterios de aceptación:**
- **Dado** que estoy en modo simulación detenida, **cuando** hago clic en Sync Execute (o en Reproducir con modo sync por defecto), **entonces** `sesionSimulacion.tipoEjecucion` se fija en `"sync"` y arranca.
- **Dado** que la simulación está ejecutándose en modo Sync, **cuando** miro el canvas, **entonces** veo **un solo** proceso con contorno cian grueso en cada instante.
- **Dado** que la simulación está ejecutándose en modo Sync, **cuando** miro los enlaces, **entonces** veo **un solo** token verde en tránsito a la vez.
- **Dado** que termina un subproceso, **cuando** empieza el siguiente, **entonces** el contorno cian se traslada al nuevo subproceso y el token anterior se consume.

**Reglas y restricciones:**
- El orden de ejecución se deriva geométricamente de la coordenada Y (HU-B0.020).
- No hay aleatoriedad en Sync — el orden es reproducible dado el mismo modelo.
- Sync es el valor por defecto al hacer Reproducir sin especificar modo.

**Modelo de datos tocado:**
- `sesionSimulacion.tipoEjecucion` — `"sync"`.
- `sesionSimulacion.procesosActivosActuales` — conjunto con **un solo** elemento en cada paso.

**Dependencias:**
- Bloqueada por: HU-B0.004, HU-B0.005, HU-B0.020.

**Integraciones:**
- Renderizador canvas.
- Núcleo de simulación.
- Motor de orden Y.

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [§Árboles OPD y control implícito], [§Modelos conceptuales y de ejecucion].
- Fuente OPCloud: §2.2 tabla, §3.7, §9.
- Frames: frame 8 (tooltip Sync Execute), frame 16 (solo `Call Transmitting` cian).
- Transcripción: "it will do each call at one time".
- Clase de afirmación: confirmado por transcripción + confirmado por SSOT.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [simulacion-conceptual, sync, determinista, ejecucion, orden-y].

---

### HU-B0.014 — Ejecutar en modo Async paralelo

**Actor primario:** IS.
**Actores secundarios:** ME.
**Tipo:** opm-semantica.
**Nivel categórico:** K primario; V secundaria.
**Superficie UI:** barra-secundaria (botón Async Execute).
**Gesto canónico:** clic en Async Execute.

**Historia:**
> Como ingeniero de simulación, quiero ejecutar la simulación en modo Async (paralelo) para ver simultáneamente todos los subprocesos que podrían activarse a la vez según el modelo.

**Contexto de negocio:**
El modo Async permite múltiples tokens y múltiples subprocesos cian simultáneos. Útil cuando el modelo tiene ramas paralelas legítimas y se quiere ver el frente de ejecución completo. La SSOT [§Árboles OPD y control implícito] define el "conjunto de invocación implícita paralela" cuando "varios subprocesos comienzan juntos cuando sus puntos superiores están alineados a la misma altura". Narrador b1 menciona "click async which will run all the options" — inferencia por analogía (no observado frame explícito en b0).

**Criterios de aceptación:**
- **Dado** que estoy en modo simulación detenida, **cuando** hago clic en Async Execute, **entonces** `sesionSimulacion.tipoEjecucion` se fija en `"async"` y arranca.
- **Dado** que la simulación está ejecutándose en modo Async, **cuando** miro el canvas, **entonces** veo **múltiples** procesos con contorno cian grueso simultáneamente (si el orden Y lo permite — procesos con mismo Y son paralelos).
- **Dado** que la simulación está ejecutándose en modo Async, **cuando** miro los enlaces, **entonces** veo **múltiples** tokens verdes en tránsito simultáneo sobre enlaces diferentes.

**Reglas y restricciones:**
- El paralelismo se deriva de **igualdad de Y** entre subprocesos (§6 afirmación 2).
- Sincronización: no se observa frame dedicado a Async — convención visual es **hipótesis** (§11.8).
- Etiqueta: `requires-clarification`.

**Modelo de datos tocado:**
- `sesionSimulacion.tipoEjecucion` — `"async"`.
- `sesionSimulacion.procesosActivosActuales` — conjunto con múltiples elementos posibles.

**Dependencias:**
- Bloqueada por: HU-B0.013 (comparte infraestructura).

**Integraciones:**
- Renderizador canvas (múltiples marcas simultáneas).
- Núcleo de simulación.

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [§Árboles OPD y control implícito], [§Modelos conceptuales y de ejecucion].
- Fuente OPCloud: §2.2, §3.7, §11.8 (pregunta abierta sobre asimetría visual).
- Frames: frame 7 (tooltip Async Execute) — sin ejecución visible.
- Clase de afirmación: inferido + abierto.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamaño:** M.
**Etiquetas:** [simulacion-conceptual, async, paralelo, ejecucion, requires-clarification].

---

### HU-B0.015 — Activar Headless Runner (sin animación)

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; V secundaria.
**Superficie UI:** barra-secundaria (casilla Headless Runner).
**Gesto canónico:** clic en casilla.

**Historia:**
> Como ingeniero de simulación, quiero activar Headless Runner para ejecutar la simulación sin el render animado del canvas y obtener solo los efectos finales, útil cuando tengo muchas iteraciones o quiero observar solo el desenlace.

**Contexto de negocio:**
Headless Runner suprime la animación — la simulación se ejecuta en background. Para simulación conceptual (sin valores) el efecto observable es **nulo**, por lo que es inútil en este modo — pero aporta en EPICA-B1 (computacional) cuando el objetivo son valores finales, no la progresión visual. Se incluye como HU en B0 porque el control existe en la barra secundaria de este baseline.

**Criterios de aceptación:**
- **Dado** que estoy en modo simulación detenida, **cuando** hago clic en la casilla Headless Runner, **entonces** `sesionSimulacion.headless` pasa a `true`.
- **Dado** que Headless está activo, **cuando** inicio la simulación, **entonces** no aparecen tokens verdes ni contornos cian de procesos activos en el canvas.
- **Dado** que Headless está activo en simulación conceptual, **cuando** termina la ejecución, **entonces** el canvas queda idéntico al estado inicial (sin valores que mostrar).
- **Dado** que Headless está activo, **cuando** la simulación termina, **entonces** el contador de pasos vuelve a `1` (si aplica) sin mostrar progresión intermedia.

**Reglas y restricciones:**
- En simulación conceptual pura, Headless es "inútil" pero disponible — la combinación no se deshabilita explícitamente (§11.10 pregunta abierta).
- El flag es persistente por sesión.

**Modelo de datos tocado:**
- `sesionSimulacion.headless` — `boolean` (por defecto `false`) — transitorio.

**Dependencias:**
- Bloqueada por: HU-B0.004.

**Integraciones:**
- Renderizador canvas (condicional en `headless`).
- Núcleo de simulación.

**Notas de evidencia:**
- Fuente OPCloud: §2.2 tabla, §3.8, §11.10 (pregunta abierta).
- Clase de afirmación: observado + inferido.

**Prioridad:** C.
**Tamaño:** S.
**Etiquetas:** [simulacion-conceptual, headless, rendimiento, render-condicional].

---

### HU-B0.016 — Resaltar proceso activo con contorno cian grueso

**Actor primario:** IS.
**Tipo:** mixto.
**Nivel categórico:** V primario.
**Superficie UI:** canvas-render.
**Gesto canónico:** ninguno (render reactivo al paso de simulación).

**Historia:**
> Como ingeniero de simulación, quiero ver el proceso que está "ocurriendo en este instante" con contorno cian grueso para identificar de un vistazo dónde está la simulación.

**Contexto de negocio:**
El contorno cian grueso (~3–4× el grosor base, fill blanco) es la marca canónica del proceso activo observada en OPCloud. La SSOT visual [opm-visual-es.md §17] incluye convenciones de marcas de ejecución. Esta HU implementa la señalización visual del régimen de ejecución sobre el canvas que en régimen conceptual muestra solo la estructura estática del modelo.

**Criterios de aceptación:**
- **Dado** que la simulación está corriendo, **cuando** un proceso `P` se vuelve activo, **entonces** `P` recibe contorno cian grueso con fill blanco.
- **Dado** que `P` termina y el siguiente proceso `Q` se vuelve activo, **cuando** ocurre la transición, **entonces** el contorno cian se traslada de `P` a `Q`.
- **Dado** que la simulación está pausada, **cuando** miro el canvas, **entonces** el proceso activo preserva su contorno cian.
- **Dado** que la simulación se detiene con Detener, **cuando** miro el canvas, **entonces** el contorno cian de activo desaparece (permanecen solo los cian de refinables — ver HU-B0.029).

**Reglas y restricciones:**
- Color cian (aproximado `#4FC3F7`, hex sin verificar — §9 hipótesis).
- Grosor ~3–4× el base del shape.
- Fill blanco (no sólido).
- **Divergencia declarada con V-53** del canon visual SSOT que prescribe relleno sólido — el repo debe elegir entre seguir OPCloud (contorno) o la SSOT (sólido) — decisión pendiente de `opm-visual-es.md`.
- La marca es **transitoria**: se muestra solo durante `modo == "ejecutando"` o `"pausado"`.

**Modelo de datos tocado:**
- Ninguno adicional; render derivado de `sesionSimulacion.procesosActivosActuales`.

**Dependencias:**
- Bloqueada por: HU-B0.005.
- Relaciona: HU-B0.029 (desambiguación con refinable).

**Integraciones:**
- Renderizador JointJS.
- SSOT visual (potencialmente afectada por la decisión contorno vs sólido).

**Notas de evidencia:**
- Fuente normativa: `opm-visual-es.md` [§17 marcas de ejecución]; `opm-iso-19450-es.md` [§Modelos conceptuales y de ejecucion].
- Fuente OPCloud: §2.4 tabla primera fila, §9.
- Evidencia visual: JOYAS §9.
- Frames: frame 13 (`Call Transmitting` cian), frame 14 (`Call Making` cian), frame 16 (`Call Transmitting` cian).
- Clase de afirmación: observado + divergencia con SSOT documentada.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [simulacion-conceptual, render, resaltado, proceso-activo, divergencia-ssot].

---

### HU-B0.017 — Animar token verde sobre enlace en uso

**Actor primario:** IS.
**Tipo:** mixto.
**Nivel categórico:** V primario.
**Superficie UI:** canvas-render.
**Gesto canónico:** ninguno.

**Historia:**
> Como ingeniero de simulación, quiero ver un token verde animado desplazándose sobre el enlace que está "siendo usado" para entender qué enlace del modelo está llevando flujo ahora.

**Contexto de negocio:**
El token verde (disco relleno ~6–8 px, color verde-amarillento ~`#7CB342`) se desplaza a lo largo del enlace mientras la simulación consume el instrumento, efecto o consumo asociado. Narrador confirma: "the tokens are running across the line". Es la marca más característica de la simulación y la que diferencia render dinámico del estático. La SSOT [opm-visual-es.md] gobierna la representación gráfica de estas marcas transitorias de ejecución.

**Criterios de aceptación:**
- **Dado** que la simulación está corriendo, **cuando** un subproceso `P` se activa y consume un instrumento desde `O`, **entonces** aparece un token verde sobre el enlace `O → P` que se desplaza desde `O` hacia `P`.
- **Dado** que el token alcanza el destino, **cuando** la transición termina, **entonces** el token desaparece y el proceso destino pasa a activo (contorno cian).
- **Dado** que simulación está ejecutándose en modo Sync, **cuando** miro los enlaces, **entonces** hay **un solo** token a la vez.
- **Dado** que simulación está ejecutándose en modo Async, **cuando** miro los enlaces, **entonces** puede haber **múltiples** tokens simultáneos.
- **Dado** que la simulación está pausada, **cuando** miro el token, **entonces** está congelado a mitad del enlace, preservando su posición `[0..1]`.

**Reglas y restricciones:**
- Color verde amarillento (~`#7CB342`, hex sin verificar — §9 hipótesis).
- Tamaño 6–8 px, sin borde.
- Velocidad derivada de `sesionSimulacion.velocidadAnimacion`.
- **Pregunta abierta §11.11**: ¿los tokens aparecen también sobre efectos y agentes, o solo instrumentos y consumos?
- Morfológicamente colisiona con piruleta de Effect y con puntos de anclaje (§9) — la distinción depende del contexto.

**Modelo de datos tocado:**
- Ninguno nuevo en el modelo persistente.
- `sesionSimulacion.tokensEnVuelo` — array transitorio con `{idEnlace, posicion}`.

**Dependencias:**
- Bloqueada por: HU-B0.005.
- Relaciona: HU-B0.006 (pausa congela tokens).

**Integraciones:**
- Renderizador JointJS (animación de tokens sobre enlaces).
- Núcleo de simulación.

**Notas de evidencia:**
- Fuente normativa: `opm-visual-es.md` [marcas de ejecución]; `opm-iso-19450-es.md` [§Modelos conceptuales y de ejecucion].
- Fuente OPCloud: §2.4 tabla, §6 modelo.
- Evidencia visual: JOYAS §9.
- Frames: frame 11, 12 (token sobre `Driver → Driver Rescuing`), frame 16 (tokens sobre enlaces laterales).
- Transcripción: "the tokens are running across the line".
- Clase de afirmación: observado + confirmado por transcripción.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [simulacion-conceptual, render, token, enlace, animacion].

---

### HU-B0.018 — Marcar estado actual con disco verde anclado

**Actor primario:** IS.
**Tipo:** opm-semantica.
**Nivel categórico:** V primario; L secundaria (lente de estado).
**Superficie UI:** canvas-render (estados de objeto).
**Gesto canónico:** ninguno.

**Historia:**
> Como ingeniero de simulación, quiero ver el estado actual de cada objeto marcado con un disco verde sobre el borde del rectángulo de estado para saber en qué estado está cada instancia durante la simulación.

**Contexto de negocio:**
El disco verde sobre el borde del estado es la marca **transitoria** real de "aquí está el objeto ahora" (§2.4 tabla tercera fila, §9 convenciones). Se distingue del borde oliva grueso (estado Inicial, persistente — HU-B0.019). La SSOT [opm-visual-es.md §17] incluye convenciones de marca de estado actual en régimen de ejecución, en consonancia con la distinción entre estado `Current` declarado (régimen conceptual) y estado actual de runtime (régimen de ejecución).

**Criterios de aceptación:**
- **Dado** que la simulación está corriendo y un objeto `O` tiene una instancia en estado `s1`, **cuando** miro el rectángulo de `s1`, **entonces** aparece un disco verde anclado al borde inferior del rectángulo.
- **Dado** que el objeto transita de `s1` a `s2`, **cuando** la transición ocurre, **entonces** el disco verde se mueve del borde de `s1` al borde de `s2`.
- **Dado** que la simulación está pausada, **cuando** miro el disco, **entonces** permanece anclado al estado actual.
- **Dado** que la simulación se detiene con Detener, **cuando** miro el canvas, **entonces** el disco verde desaparece (permanece solo el borde oliva de Inicial).

**Reglas y restricciones:**
- Disco verde idéntico al token (misma morfología).
- Anclaje al borde **inferior** del rectángulo de estado (observado en frame 16 sobre `requested`).
- Marca derivada, no persistida en modelo — solo existe durante la sesión de simulación.
- Respeta la semántica de estado actual de runtime en la SSOT [opm-visual-es.md §17].

**Modelo de datos tocado:**
- `sesionSimulacion.estadosActualesObjetos` — `Map<IdObjeto, IdEstado>` — transitorio.

**Dependencias:**
- Bloqueada por: HU-B0.005.
- Relaciona: HU-B0.019 (estado Inicial vs actual), HU-B0.027 (transiciones).

**Integraciones:**
- Renderizador JointJS.
- Núcleo de simulación.

**Notas de evidencia:**
- Fuente normativa: `opm-visual-es.md` [§17]; `opm-iso-19450-es.md` [§Modelos conceptuales y de ejecucion] [§Estados iniciales, Current, por defecto y finales].
- Fuente OPCloud: §2.4 tabla tercera fila, §9 convenciones.
- Evidencia visual: JOYAS §9.
- Frames: frame 16 (disco verde en borde inferior de `requested`).
- Clase de afirmación: observado + hipótesis fuerte.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [simulacion-conceptual, render, estado-actual, objeto, disco-verde].

---

### HU-B0.019 — Preservar borde oliva grueso del estado inicial

**Actor primario:** IS.
**Tipo:** opm-semantica.
**Nivel categórico:** V primario.
**Superficie UI:** canvas-render (estados de objeto).
**Gesto canónico:** ninguno.

**Historia:**
> Como ingeniero de simulación, quiero que el borde oliva grueso del estado **Inicial** se mantenga igual en modo edición y en modo simulación para no confundirlo con la marca de estado actual (disco verde) durante la ejecución.

**Contexto de negocio:**
El borde oliva grueso es la designación **Inicial** de la SSOT [§Estados iniciales, Current, por defecto y finales], **persistente** a través de modos. No es marca de "estado actual". La colisión con "borde grueso = activo" se resuelve porque OPCloud usa contorno cian del **proceso** (no borde oliva del **estado**) para activo — el compromiso implícito es que el disco verde marca actual durante simulación, y el borde oliva queda reservado a Inicial.

**Criterios de aceptación:**
- **Dado** que un estado `s` tiene designación Inicial, **cuando** miro el canvas en modo edición, **entonces** `s` se renderiza con borde oliva grueso (~2× el normal).
- **Dado** que entro en modo simulación, **cuando** miro el canvas, **entonces** el borde oliva de Inicial **se preserva** sin cambios.
- **Dado** que la simulación está corriendo y el objeto `O` está actualmente en `s` (Inicial), **cuando** miro el canvas, **entonces** veo simultáneamente el borde oliva grueso (Inicial, persistente) Y el disco verde (actual, transitorio).

**Reglas y restricciones:**
- Color oliva (tonalidad específica sin hex verificado).
- Grosor ~2× del borde normal.
- Marca persistente — no se oculta ni cambia en ningún modo.
- La colisión con "borde grueso = activo" se documenta (§9 convenciones; colisión semántica).

**Modelo de datos tocado:**
- `estado.inicial` — `boolean` — persistente en modelo.

**Dependencias:**
- Bloqueada por: EPICA-13 (estados).
- Relaciona: HU-B0.018.

**Integraciones:**
- Renderizador JointJS.
- SSOT visual.

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [§Estados iniciales, Current, por defecto y finales]; `opm-visual-es.md`.
- Fuente OPCloud: §2.4 tabla cuarta fila, §9 (colisión semántica).
- Frames: frame 1, 13, 14 (`safe`, `requested` con borde oliva).
- Clase de afirmación: observado + colisión documentada.

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [simulacion-conceptual, render, estado-inicial, persistente, colision-visual].

---

### HU-B0.020 — Derivar orden de ejecución desde coordenada Y

**Actor primario:** IS.
**Tipo:** opm-semantica.
**Nivel categórico:** K primario; V secundaria (consecuencia visual).
**Superficie UI:** canvas + núcleo de simulación.
**Gesto canónico:** ninguno (inferencia automática).

**Historia:**
> Como ingeniero de simulación, quiero que el orden de ejecución de los subprocesos se derive automáticamente de su coordenada Y en el OPD para no tener que declarar metadatos de orden explícitos.

**Contexto de negocio:**
La SSOT [§Árboles OPD y control implícito] prescribe que la línea temporal dentro de un proceso descompuesto fluye de arriba hacia abajo, con invocación implícita entre subprocesos ordenados verticalmente. OPCloud explota esta convención para **inferir el orden** de ejecución sin necesidad de metadatos — el modelador solo mueve los subprocesos en Y para cambiar el orden. Esta economía es la que hace que el flujo "reordenar → re-simular" (§3.3) sea tan fluido.

**Criterios de aceptación:**
- **Dado** que un proceso refinable tiene subprocesos `A`, `B`, `C` con coordenadas Y `Ya < Yb < Yc`, **cuando** ejecuto simulación Sync, **entonces** el orden de activación es `A → B → C`.
- **Dado** que dos subprocesos `B` y `B'` tienen la misma coordenada Y (`Yb == Yb'`), **cuando** ejecuto simulación, **entonces** (modo Sync: orden estable por X o por inserción; modo Async: ambos activos en paralelo — [§Árboles OPD y control implícito]).
- **Dado** que reordeno arrastrando `C` encima de `A` (nueva `Yc < Ya`), **cuando** ejecuto simulación, **entonces** `C` se activa antes que `A`.

**Reglas y restricciones:**
- No existe metadato explícito de orden — cambiar Y es la única forma de cambiar el orden (§6 afirmación 1).
- Paralelismo se deriva de igualdad de Y.
- La geometría es la fuente de verdad del orden temporal dentro de refinables.

**Modelo de datos tocado:**
- `cosa.posicion.y` — number — persistente (ya existía en núcleo).
- Lógica derivada del núcleo de simulación consulta `y` para construir secuencia.

**Dependencias:**
- Bloqueada por: EPICA-12 (in-zoom con subprocesos).
- Bloquea a: HU-B0.013, HU-B0.022.

**Integraciones:**
- Núcleo de simulación (función "orden de ejecución").
- Renderizador canvas (consecuencia visual).

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [§Árboles OPD y control implícito]; `opm-visual-es.md` [§17 V-55].
- Fuente OPCloud: §1.1, §3.3, §6 afirmación 1 (inferida fuerte, confirmada por transcripción).
- Transcripción: "in OPM the processes are performed in order they are in the in-zoomed process".
- Clase de afirmación: confirmado por transcripción + confirmado por SSOT.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [simulacion-conceptual, nucleo, orden-y, geometria-temporal].

---

### HU-B0.021 — Actualizar OPL al reordenar subprocesos en Y

**Actor primario:** IS.
**Actores secundarios:** MN.
**Tipo:** opm-semantica.
**Nivel categórico:** L primario; V secundaria.
**Superficie UI:** panel-opl.
**Gesto canónico:** ninguno (reactivo a cambio en Y).

**Historia:**
> Como ingeniero de simulación, quiero que el panel OPL refleje el nuevo orden de subprocesos apenas los reordeno en el canvas para verificar el cambio **antes** de re-simular.

**Contexto de negocio:**
El OPL es la verbalización estructural del modelo. El orden de subprocesos aparece en el conector de la oración de descomposición. Reordenar los subprocesos en Y cambia el orden de nombres en esta oración — el narrador confirma: "we can see it in the OPL down below; if we change the order we can see that the OPL was updated". La SSOT [§Acoplamiento de proyección] establece que "la posición vertical de un subproceso en el canvas, el orden de navegación del árbol y el orden textual del OPL pueden derivarse coherentemente entre sí".

**Criterios de aceptación:**
- **Dado** que un proceso `P` con subprocesos `A`, `B`, `C` tiene OPL con orden `A, B, C`, **cuando** muevo `C` por encima de `A` en Y, **entonces** el OPL pasa a reflejar el orden `C, A, B`.
- **Dado** que reordeno, **cuando** el cambio ocurre en modo edición, **entonces** el OPL se actualiza inmediatamente (sin necesidad de re-simular).
- **Dado** que reordeno durante simulación pausada, **cuando** cambio Y, **entonces** [hipótesis]: el OPL se actualiza pero la simulación en curso usa el orden antiguo; re-iniciar con Reproducir usaría el nuevo orden. [pregunta abierta]

**Reglas y restricciones:**
- El OPL se regenera desde modelo, no por evento; invariante: sin caché intermedio.
- La conexión OPL ↔ orden Y es directa (no hay metadato intermedio).

**Modelo de datos tocado:**
- Ninguno nuevo; reutiliza `cosa.posicion.y` y motor OPL.

**Dependencias:**
- Bloqueada por: HU-B0.020.
- Relaciona: HU-B0.022.

**Integraciones:**
- Motor OPL.
- Núcleo (orden derivado).

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [§Representación bimodal] [§Acoplamiento de proyección].
- Fuente OPCloud: §3.3 paso 6, §7.1.
- Frames: frame 13 (OPL antes) vs frame 16 (OPL después de reordenar).
- Transcripción: "if we change the order we can see that the OPL was updated".
- Clase de afirmación: confirmado por transcripción + confirmado por SSOT.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [simulacion-conceptual, opl, reordenacion, reactividad, pedagogico].

---

### HU-B0.022 — Cerrar ciclo simular → leer OPL → reordenar → re-simular

**Actor primario:** IS.
**Tipo:** opm-semantica.
**Nivel categórico:** U primario (flujo de validación); K, L, V secundarios.
**Superficie UI:** canvas + panel-opl + barra-secundaria.
**Gesto canónico:** composición de gestos de los pasos 3.2 → 3.3.

**Historia:**
> Como ingeniero de simulación, quiero cerrar el ciclo "simular → detectar error de orden → volver a editar → reordenar en Y → re-simular" para validar iterativamente que el modelo refleja el comportamiento esperado.

**Contexto de negocio:**
Este ciclo es la **unidad de validación** de la simulación conceptual (§3.3, §6 afirmación fuerte). No hay asertos, breakpoints ni depurador — la verificación es visual y narrativa. El narrador declara: "thus we know that our model is done correctly — this is what we use simulation for". Diseñar el producto para favorecer este ciclo (gestos fluidos, sin fricciones modales entre modos) es el objetivo de diseño principal de la épica. La SSOT [§Modelos conceptuales y de ejecucion] establece que "la presencia de ocurrencias de cosas traduce el modelo conceptual abstracto en una forma concreta de ejecución" — este ciclo opera precisamente en la frontera entre ambos regímenes.

**Criterios de aceptación:**
- **Dado** que tengo un modelo refinable, **cuando** ejecuto simulación Sync, **entonces** puedo observar el orden real de activación de subprocesos.
- **Dado** que detecto una discrepancia entre el orden esperado y el observado, **cuando** detengo con Detener, **entonces** puedo volver a edición.
- **Dado** que estoy en edición, **cuando** muevo un subproceso en Y, **entonces** el OPL se actualiza (HU-B0.021) y puedo confirmar el cambio **antes** de re-simular.
- **Dado** que re-simulo después de reordenar, **cuando** ejecuto Sync, **entonces** el orden de activación coincide con el nuevo orden en Y.
- **Dado** que el ciclo completo se cierra en <30 segundos, **cuando** el modelo es pequeño (5–10 subprocesos), **entonces** el ciclo es usable sin fricción.

**Reglas y restricciones:**
- No requiere infraestructura adicional — es composición de HUs previas.
- Diseño de UX debe minimizar fricción entre modos (HU-B0.001, HU-B0.003).

**Modelo de datos tocado:**
- Ninguno nuevo.

**Dependencias:**
- Bloqueada por: HU-B0.001, HU-B0.003, HU-B0.005, HU-B0.008, HU-B0.020, HU-B0.021.

**Integraciones:**
- Flujo transversal: barra, canvas, panel-opl, núcleo.

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [§Modelos conceptuales y de ejecucion].
- Fuente OPCloud: §1.1, §3.3 completo, §6 afirmación fuerte.
- Frames: frame 13 (OPL orden antiguo) → frame 16 (orden nuevo).
- Transcripción: "thus we know that our model is done correctly — this is what we use simulation for".
- Clase de afirmación: confirmado por transcripción + confirmado por SSOT.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [simulacion-conceptual, metodologia, ciclo-validacion, flujo-transversal, pedagogico].

---

### HU-B0.023 — Ver contador de pasos en barra secundaria

**Actor primario:** IS.
**Tipo:** opcloud-ui.
**Nivel categórico:** V primario; U secundaria.
**Superficie UI:** barra-secundaria (contador de pasos).
**Gesto canónico:** edición del campo numérico.

**Historia:**
> Como ingeniero de simulación, quiero ver el contador de pasos en la barra secundaria con valor por defecto `1` para saber que por defecto se ejecuta una sola iteración del modelo.

**Contexto de negocio:**
El contador de pasos es un campo entero que representa el **número de iteraciones** a ejecutar (input). En simulación conceptual queda en `1` siempre (§5.1 tabla, §11.9 pregunta abierta). En EPICA-B1 (computacional) y EPICA-B4 (conditions/loops) gana sentido — permite ejecutar N iteraciones seguidas para ver distribución de resultados o acumular iteraciones de loops.

**Criterios de aceptación:**
- **Dado** que activo modo simulación, **cuando** miro la barra secundaria, **entonces** veo el contador de pasos con valor por defecto `1`.
- **Dado** que hago clic en el campo, **cuando** edito el valor, **entonces** acepto solo enteros positivos.
- **Dado** que ingreso `5`, **cuando** hago Reproducir en modo Sync, **entonces** la simulación ejecuta 5 iteraciones seriales del mismo flujo (comportamiento en conceptual: **pregunta abierta §11.9**).

**Reglas y restricciones:**
- Valor por defecto `1`.
- Campo solo visible en estado detenido (oculto durante ejecución — HU-B0.010).
- En conceptual puro el efecto de N>1 no está documentado — etiqueta `requires-clarification` hasta clarificar con B1/B4.

**Modelo de datos tocado:**
- `sesionSimulacion.contadorPasos` — integer (por defecto `1`) — transitorio.

**Dependencias:**
- Bloqueada por: HU-B0.004.

**Integraciones:**
- Renderizador barra.
- Núcleo de simulación (consume al arrancar).

**Notas de evidencia:**
- Fuente OPCloud: §2.2, §5.1, §11.9 (pregunta abierta).
- Frames: frame 4, 18 (valor `1`).
- Clase de afirmación: observado + abierto.

**Prioridad:** C.
**Tamaño:** XS.
**Etiquetas:** [simulacion-conceptual, ui, contador-pasos, iteracion, requires-clarification].

---

### HU-B0.024 — Bloquear edición del modelo durante simulación

**Actor primario:** IS.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; K secundaria.
**Superficie UI:** canvas + barra-secundaria.
**Gesto canónico:** ninguno (bloqueo implícito por reemplazo de barra).

**Historia:**
> Como ingeniero de simulación, quiero que la edición del modelo esté bloqueada mientras la simulación se está ejecutando (o está pausada) para preservar la consistencia entre lo que ejecuto y lo que veo.

**Contexto de negocio:**
El bloqueo de edición durante simulación es **implícito** por reemplazo de barra (§7.3 afirmación inferida). No se observan intentos de crear objetos/procesos/enlaces durante simulación — los gestos no están expuestos. Pero el doc fuente marca como **pregunta abierta §11.6** si los gestos de renombrar vía diálogo o de arrastre de posición quedan también bloqueados.

**Criterios de aceptación:**
- **Dado** que estoy en modo simulación (ejecutando, pausada o detenida con sesión activa), **cuando** intento arrastrar desde barra secundaria, **entonces** no hay iconos de crear disponibles.
- **Dado** que estoy en modo simulación, **cuando** intento arrastrar un shape existente, **entonces** [pregunta abierta §11.6]: el arrastre puede permitirse pero no guardar, o bloquearse completamente.
- **Dado** que estoy en modo simulación, **cuando** intento renombrar con doble clic, **entonces** [pregunta abierta §11.6]: similar al arrastre.
- **Dado** que vuelvo a modo edición (HU-B0.003), **cuando** ocurre la transición, **entonces** todos los gestos de edición vuelven a estar disponibles.

**Reglas y restricciones:**
- Bloqueo total de gestos de edición durante simulación — decisión de diseño a confirmar.
- La confirmación requiere intento explícito en OPCloud o decisión de producto local.
- Etiqueta: `requires-clarification` hasta confirmación.

**Modelo de datos tocado:**
- Ninguno; flag de estado afectaría la UI (`appState.modoSimulacion`).

**Dependencias:**
- Bloqueada por: HU-B0.002.

**Integraciones:**
- Renderizador canvas (gestos condicionales).
- Barra secundaria.

**Notas de evidencia:**
- Fuente OPCloud: §4.3, §7.3, §11.6 (pregunta abierta).
- Clase de afirmación: inferido + abierto.
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [simulacion-conceptual, bloqueo, integridad, requires-clarification].

---

### HU-B0.025 — Mantener panel OPL estático durante ejecución

**Actor primario:** IS.
**Actores secundarios:** RV (revisor).
**Tipo:** opm-semantica.
**Nivel categórico:** L primario; V secundaria.
**Superficie UI:** panel-opl.
**Gesto canónico:** ninguno.

**Historia:**
> Como ingeniero de simulación, quiero que el panel OPL permanezca con la verbalización **estructural** del modelo durante la ejecución para poder comparar la narrativa estructural con la ejecución visual lado a lado.

**Contexto de negocio:**
El OPL durante simulación **no se anima** — permanece con la verbalización estática del modelo (§7.1). Esta decisión de OPCloud respeta el rol del OPL como **lente estructural**, no como log de ejecución. La SSOT [§Representación bimodal] establece que "todo modelo OPM individual se expresa en dos formas equivalentes: OPD y OPL-ES" — el OPL es la verbalización de la estructura, no del comportamiento en ejecución. Consecuencia: el OPL no resalta la oración correspondiente al subproceso activo — funcionalidad que sería útil pero no está implementada (§7.1 hipótesis).

**Criterios de aceptación:**
- **Dado** que la simulación está corriendo, **cuando** miro el panel OPL, **entonces** muestra las mismas oraciones que en modo edición (estructura del modelo).
- **Dado** que la simulación activa el subproceso `A`, **cuando** miro el OPL, **entonces** NO hay resaltado específico de la oración correspondiente a `A`.
- **Dado** que reordeno subprocesos fuera de simulación, **cuando** el OPL se actualiza (HU-B0.021), **entonces** el cambio persiste al entrar a simulación.

**Reglas y restricciones:**
- El OPL es lente, no log.
- Cross-highlight canvas ↔ OPL durante simulación es **pregunta abierta §11.12** — funcionalidad inexistente en OPCloud.

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: existencia de panel OPL (EPICA-50).

**Integraciones:**
- Motor OPL.

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [§Representación bimodal].
- Fuente OPCloud: §7.1, §11.12 (pregunta abierta).
- Clase de afirmación: observado + confirmado por SSOT.

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [simulacion-conceptual, opl, panel, estatico, lente-estructural].

---

### HU-B0.026 — Navegar entre OPDs durante simulación

**Actor primario:** IS.
**Tipo:** mixto.
**Nivel categórico:** L primario; U secundaria.
**Superficie UI:** arbol-opds + canvas.
**Gesto canónico:** clic en nodo del árbol de OPDs.

**Historia:**
> Como ingeniero de simulación, quiero navegar entre el OPD padre (SD) y el OPD hijo descompuesto (SD1) durante la simulación para ver el detalle interno sin pausar ni reiniciar.

**Contexto de negocio:**
La simulación se **ejecuta sobre el modelo completo**, pero el render animado ocurre solo en el OPD visible (§4.2). Si el usuario está en SD y la simulación está "dentro" del contenedor, solo ve el token entrante y el contorno cian del contenedor — para ver el detalle interno debe navegar a SD1. La SSOT [§Navegación de OPD y composición de OPL] provee los mecanismos de vinculación entre diagramas y la capa prescribe la vinculación canónica entre etiquetas visibles de navegación y OPDs relacionados. **Pregunta abierta §11.5**: ¿la simulación pausa automáticamente al cambiar de OPD, o sigue ejecutándose silenciosamente?

**Criterios de aceptación:**
- **Dado** que estoy simulando en SD y el proceso refinable `Driver Rescuing` está activo, **cuando** hago clic en SD1 en el árbol de OPDs, **entonces** navego al OPD hijo y veo los subprocesos internos con sus marcas de simulación (contorno cian del activo, tokens, discos verdes).
- **Dado** que navegué a SD1 durante simulación, **cuando** miro la barra secundaria, **entonces** la simulación sigue ejecutándose — no se pausa automáticamente [hipótesis inferida].
- **Dado** que vuelvo de SD1 a SD, **cuando** miro el canvas, **entonces** veo las marcas visibles del nivel padre (token en enlace entrante, contorno cian del contenedor).

**Reglas y restricciones:**
- La simulación es global al modelo; la vista depende del OPD seleccionado.
- Comportamiento de pausa automática al cambiar de OPD es **pregunta abierta §11.5** — etiqueta `requires-clarification`.

**Modelo de datos tocado:**
- `appState.opdActivo` — ID de OPD actualmente visible — transitorio.

**Dependencias:**
- Bloqueada por: EPICA-20 (árbol de OPDs), EPICA-12 (in-zoom).
- Relaciona: HU-B0.016, HU-B0.017, HU-B0.018.

**Integraciones:**
- Árbol de OPDs.
- Renderizador canvas.
- Núcleo de simulación.

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [§Modelos conceptuales y de ejecucion] [§Navegación de OPD y composición de OPL].
- Fuente OPCloud: §4.2, §7.2, §11.5 (pregunta abierta).
- Clase de afirmación: inferido + abierto.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamaño:** M.
**Etiquetas:** [simulacion-conceptual, navegacion, opd, vista-global, requires-clarification].

---

### HU-B0.027 — Reflejar transiciones de estado de objeto en simulación

**Actor primario:** IS.
**Tipo:** opm-semantica.
**Nivel categórico:** V primario; K, L secundarias.
**Superficie UI:** canvas-render.
**Gesto canónico:** ninguno (derivado de la ejecución).

**Historia:**
> Como ingeniero de simulación, quiero ver las transiciones de estado de los objetos reflejadas visualmente durante la simulación para entender cómo cambia el estado global del modelo paso a paso.

**Contexto de negocio:**
OPM modela estados como elementos de primer orden. Un proceso puede transicionar un objeto de un estado a otro (enlace de efecto en OPM). Durante la simulación, estas transiciones deben reflejarse: el disco verde se mueve de un estado a otro en sincronía con la ejecución del proceso que dispara la transición. La SSOT [§Estados de objeto] establece que "en cada instante, una instancia del objeto está en un estado o en transición entre estados" — esta HU hace visible esa transición en el régimen de ejecución.

**Criterios de aceptación:**
- **Dado** que el objeto `Call` tiene estados `requested` y `online`, y hay un proceso `P` que transiciona `Call` de `requested` a `online`, **cuando** la simulación ejecuta `P`, **entonces** el disco verde se mueve del rectángulo `requested` al rectángulo `online`.
- **Dado** que la transición ocurre, **cuando** hay token verde entrante al proceso `P`, **entonces** el token se "consume" al iniciar la transición.
- **Dado** que la transición ocurre, **cuando** hay token verde saliente del proceso `P`, **entonces** el token aparece después de la transición.
- **Dado** que hay múltiples instancias (no observadas en b0 — delegado a B1), **cuando** ocurren transiciones simultáneas, **entonces** [pregunta abierta pendiente de B1].

**Reglas y restricciones:**
- La transición de estado implica `PasoSimulacion.transicionesEstado` registrando `{objeto, estadoOrigen, estadoDestino}` (§6 modelo).
- El disco verde es **una sola marca por objeto** (en b0 conceptual — multi-instancia se difiere a B1).

**Modelo de datos tocado:**
- `sesionSimulacion.estadosActualesObjetos` — `Map<IdObjeto, IdEstado>`.
- `PasoSimulacion.transicionesEstado` — array efímero.

**Dependencias:**
- Bloqueada por: HU-B0.018, HU-B0.005, EPICA-13 (estados).

**Integraciones:**
- Renderizador canvas.
- Núcleo de simulación.

**Notas de evidencia:**
- Fuente normativa: `opm-iso-19450-es.md` [§Modelos conceptuales y de ejecucion] [§Estados de objeto].
- Fuente OPCloud: §6 modelo (SimulationStep.stateTransitions), §2.4 disco verde.
- Frames: frame 16 (disco verde sobre `requested`).
- Clase de afirmación: inferido + observado parcialmente + confirmado por SSOT.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [simulacion-conceptual, estado, transicion, objeto, multi-estado].

---

### HU-B0.028 — Usar atajo Espacio para Reproducir/Pausar

**Actor primario:** IS.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** U.
**Superficie UI:** canvas + barra-secundaria (atajo).
**Gesto canónico:** presión de tecla Espacio.

**Historia:**
> Como ingeniero de simulación experto, quiero usar la tecla Espacio como atajo de Reproducir/Pausar para no tener que apuntar a la barra cada vez que quiero pausar una ejecución.

**Contexto de negocio:**
Convención web habitual para reproducción de media: Espacio = Reproducir/Pausar. No confirmada en OPCloud (§8 pregunta abierta, §11.4). Se registra como HU candidata para el producto con etiqueta `requires-clarification` — la decisión puede ser adoptar la convención o verificar contra OPCloud.

**Criterios de aceptación:**
- **Dado** que estoy en modo simulación detenida y el canvas tiene foco, **cuando** presiono Espacio, **entonces** inicia la simulación (equivalente a clic en Reproducir).
- **Dado** que la simulación está corriendo, **cuando** presiono Espacio, **entonces** se pausa (equivalente a clic en Pausar).
- **Dado** que la simulación está pausada, **cuando** presiono Espacio, **entonces** se reanuda.
- **Dado** que estoy escribiendo en un campo (ej. renombrando), **cuando** presiono Espacio, **entonces** el espacio se inserta en el texto y NO dispara Reproducir/Pausar.

**Reglas y restricciones:**
- Atajo solo se activa si el foco NO está en un campo de texto.
- Implementación pendiente de convención de atajos (EPICA-90).
- Etiqueta: `requires-clarification`.

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-B0.005, HU-B0.006.
- Relaciona: EPICA-90 (atajos).

**Integraciones:**
- Capa de atajos del canvas.

**Notas de evidencia:**
- Fuente OPCloud: §8, §11.4 (pregunta abierta).
- Clase de afirmación: convención común web + abierto en OPCloud.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamaño:** XS.
**Etiquetas:** [simulacion-conceptual, atajo, espacio, requires-clarification].

---

### HU-B0.029 — Distinguir cian de refinable vs cian de activo por contexto

**Actor primario:** IS.
**Actores secundarios:** MN, RV.
**Tipo:** mixto.
**Nivel categórico:** V primario.
**Superficie UI:** canvas-render.
**Gesto canónico:** ninguno (lectura contextual).

**Historia:**
> Como ingeniero de simulación, quiero distinguir el contorno cian grueso del **refinable** (persistente, estructural) del contorno cian grueso del **proceso activo** (transitorio, de ejecución) para leer correctamente el canvas durante la simulación.

**Contexto de negocio:**
OPCloud usa el mismo color y grosor para dos marcas semánticamente distintas: contenedor refinable y proceso activo en simulación (§2.4). La distinción se resuelve **solo por contexto**: mirando la barra secundaria (si muestra Pausar → ejecutando → los cian gruesos internos son activos; si muestra Reproducir → edición → son solo refinables). El doc fuente declara tres grosores de trazo que conviven durante simulación (§2.4 regla visual). La SSOT [opm-visual-es.md] distingue entre marcas estructurales persistentes y marcas de ejecución transitorias.

**Criterios de aceptación:**
- **Dado** que estoy en modo edición, **cuando** veo un proceso con contorno cian grueso, **entonces** interpreto que es refinable (descompuesto).
- **Dado** que estoy en modo simulación corriendo, **cuando** veo un proceso con contorno cian grueso **dentro** del contenedor, **entonces** interpreto que es el proceso activo en este paso.
- **Dado** que estoy en modo simulación corriendo, **cuando** veo un proceso con contorno cian grueso que es **el contenedor mismo**, **entonces** interpreto que sigue siendo refinable (la marca de refinable persiste durante simulación).
- **Dado** que salgo de modo simulación, **cuando** miro el canvas, **entonces** solo los refinables preservan su contorno cian (los activos ya no se marcan).

**Reglas y restricciones:**
- Misma morfología visual para dos semánticas — decisión de OPCloud.
- El repositorio puede divergir adoptando colores distintos (azul ejecución vs cian refinable), previa decisión en SSOT visual.
- La marca del contenedor no cambia durante simulación (§2.4 regla visual).

**Modelo de datos tocado:**
- Ninguno; render derivado.

**Dependencias:**
- Bloqueada por: HU-B0.016, EPICA-12 (refinables).

**Integraciones:**
- Renderizador JointJS (lógica condicional según `modoSimulacion`).
- SSOT visual (potencialmente afectada si se diverge).

**Notas de evidencia:**
- Fuente normativa: `opm-visual-es.md` [marcas estructurales vs marcas de ejecución].
- Fuente OPCloud: §2.4 regla visual observada, §9 colisión declarada.
- Frames: frame 13 (contenedor `Driver Rescuing` cian + subproceso interno cian).
- Clase de afirmación: observado + colisión documentada.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [simulacion-conceptual, render, ambiguedad-visual, contexto-dependiente, colision-semantica].

---

### HU-B0.030 — Ver tooltip en controles de simulación

**Actor primario:** IS.
**Actores secundarios:** MN (descubrimiento).
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; V secundaria.
**Superficie UI:** barra-secundaria.
**Gesto canónico:** hover sobre icono.

**Historia:**
> Como ingeniero de simulación novato, quiero ver el tooltip al hacer hover sobre los iconos de Sync Execute, Async Execute y Animation Speed para entender qué hace cada control sin tener que abrir documentación.

**Contexto de negocio:**
OPCloud expone tooltips en un subconjunto de controles — observados: `Sync Execute`, `Async Execute`, `Animation Speed`. NO observados: Reproducir, Pausar, Detener, Randomize, Headless Runner (§2.5). Esta asimetría es deuda de discoverability; el repositorio puede optar por tooltips universales.

**Criterios de aceptación:**
- **Dado** que estoy en modo simulación, **cuando** hago hover sobre el icono Sync Execute, **entonces** aparece tooltip con texto `Sync Execute`.
- **Dado** que hago hover sobre el icono Async Execute, **cuando** permanece el mouse, **entonces** aparece tooltip `Async Execute`.
- **Dado** que hago hover sobre el thumb del deslizador Animation Speed, **cuando** permanece el mouse, **entonces** aparece tooltip `Animation Speed`.
- **Dado** que hago hover sobre Reproducir, Pausar, Detener, Randomize o Headless, **cuando** permanece el mouse, **entonces** [OPCloud: sin tooltip observado; decisión local: mostrar tooltip descriptivo].

**Reglas y restricciones:**
- Tooltip: caja blanca con sombra, texto negro, aparece al hover prolongado (~500ms).
- Convención recomendada (decisión de producto local): tooltips en TODOS los controles, no solo los tres observados en OPCloud — mejora discoverability.

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-B0.004.

**Integraciones:**
- Renderizador barra (capa de tooltips).

**Notas de evidencia:**
- Fuente OPCloud: §2.5.
- Frames: frame 7 (tooltip Async), frame 8 (tooltip Sync), frame 9 (tooltip Animation Speed).
- Clase de afirmación: observado (parcial).

**Prioridad:** C.
**Tamaño:** XS.
**Etiquetas:** [simulacion-conceptual, ui, tooltip, discoverability].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q-B0.1**: Gesto exacto de "salir de modo simulación" (cf. HU-B0.003). Origen §11.1. Impacta UX fundamental del ciclo de validación. **Requiere observación adicional en OPCloud o decisión local.**
- **Q-B0.2**: Comportamiento exacto al pausar — ¿tokens congelados o acumulados? (cf. HU-B0.006). Origen §11.2. Frame dedicado ausente.
- **Q-B0.3**: Detener durante ejecución — ¿reset inmediato o transición animada? (cf. HU-B0.008). Origen §11.3.
- **Q-B0.4**: Atajo Espacio para Reproducir/Pausar (cf. HU-B0.028). Origen §11.4. Convención común, no confirmada.
- **Q-B0.5**: Cambio de OPD durante simulación — ¿pausa automática? (cf. HU-B0.026). Origen §11.5.
- **Q-B0.6**: Bloqueo de edición durante simulación — alcance exacto (renombrar, arrastre) (cf. HU-B0.024). Origen §11.6.
- **Q-B0.7**: Fin natural de la simulación — ¿Pausar vuelve a Reproducir automáticamente? Origen §11.7. Sin frame dedicado.
- **Q-B0.8**: Async render — múltiples subprocesos cian simultáneos (cf. HU-B0.014). Origen §11.8. Inferido pero no observado.
- **Q-B0.9**: Contador de pasos en modo conceptual — ¿tiene algún efecto si es >1? (cf. HU-B0.023). Origen §11.9. Delegado a EPICA-B1/B4.
- **Q-B0.10**: Headless + conceptual — combinación inútil. ¿OPCloud deshabilita la casilla? (cf. HU-B0.015). Origen §11.10.
- **Q-B0.11**: Tokens en efectos y agentes — ¿aparecen tokens sobre todos los tipos de enlace o solo instrumentos/consumos? (cf. HU-B0.017). Origen §11.11.
- **Q-B0.12**: Cross-highlight OPL ↔ canvas durante simulación — convención común OPM pero no confirmada (cf. HU-B0.025). Origen §11.12. Potencial diferencial del producto.

## Referencias cruzadas

- **Fuente normativa**: `opm-iso-19450-es.md`, `opm-visual-es.md`, `opm-opl-es.md`.
- **Evidencia OPCloud**: `JOYAS.md`, `sandbox-data/`, `assets/svg/`, `decompiled/`.
- **Doc fuente original**: `opcloud-reverse/b0-simulation-conceptual.md`.
- **Épicas hermanas `b` que extienden este baseline**:
  - **EPICA-B1** (`simulacion-computational`): magnitudes, alias, firmas — extiende con valores reales.
  - **EPICA-B2** (`simulacion-user-functions`): editor IDE TypeScript embebido.
  - **EPICA-B3** (`simulacion-range-validation`): rangos numéricos con enforcement soft/hard.
  - **EPICA-B4** (`simulacion-conditions-loops`): `c` sobre enlaces, loops por invocación, pesos yes/no.
  - **EPICA-B5** (`simulacion-user-input`): diálogo de input durante ejecución.
- **Épicas prerrequisito**:
  - **EPICA-10** (creación de cosas), **EPICA-12** (in-zooming), **EPICA-13** (estados), **EPICA-20** (árbol OPD), **EPICA-50** (panel OPL).
- **Épicas relacionadas**:
  - **EPICA-90** (atajos — HU-B0.028).
  - **EPICA-C0/C1/C2** (runtime MQTT/URLs/ROS — no aplican a conceptual, §7.5).
- **SSOT OPM — Secciones clave referenciadas**:
  - `opm-iso-19450-es.md` [§Modelos conceptuales y de ejecucion] [§Representación bimodal] [§Estados de objeto] [§Árboles OPD y control implícito] [§Navegación de OPD y composición de OPL] [§Acoplamiento de proyección] [§Estados iniciales, Current, por defecto y finales].
  - `opm-visual-es.md` [§17 marcas de ejecución].
- **Invariantes del repositorio**:
  - `src/nucleo/tipos.ts` (Cosa, Proceso, Objeto, Estado) — base para `sesionSimulacion`.
  - `src/nucleo/validacion/` — el núcleo de simulación puede apoyarse en los 14 passes de validación para detectar modelos inejecutables antes de Reproducir.
  - `src/render/jointjs/` — renderizador debe extenderse con marca de proceso activo, token animado sobre enlace y disco de estado actual.
  - `src/render/opl-renderer.ts` — motor OPL debe permanecer reactivo al orden Y (HU-B0.021).
