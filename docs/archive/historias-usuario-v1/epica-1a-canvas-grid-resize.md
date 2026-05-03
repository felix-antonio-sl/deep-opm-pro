---
epica: "EPICA-1A"
titulo: "Canvas — cuadricula, iman, redimension manual/automático y alineación"
doc_fuente: "opcloud-reverse/1a-canvas-grid-resize.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "M1"
hu_emitidas: 18
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
---

## Resumen

Esta épica cubre la **capa geométrica de maquetación** del canvas: tamaño de las cosas (redimension manual vía handles, fit-to-text, auto-sizing), cuantización espacial mediante cuadricula opt-in, y — como extensión razonable no observada directamente en OPCloud pero congruente con el ecosistema de modelado — las operaciones de alineación y distribución entre múltiples cosas.

Dos grandes bloques componen la épica:

1. **Redimension de cosa** (§3.1–§3.4 doc fuente): tamaño mínimo por defecto, `Fit to Text`, `Toggle Auto Sizing`, handles de borde/esquina, protección del rótulo ante compresión extrema.
2. **Cuadricula y iman** (§3.5–§3.6 doc fuente): toggle opt-in, parámetros configurables (`Mode`, `Cuadricula Size`, `Cuadricula Color`, `Cuadricula Thickness`, `Scale Factor`), cuantización de movimiento.
3. **Alineación y distribución** (extensión): no observada explícitamente en OPCloud (§4.4 doc fuente: "no se observan smart guides"), pero incluida como bloque `requires-clarification` por ser pedido explícito de producto y por ser conceptualmente simétrica con iman-a-cuadricula.

Las HU derivadas del doc fuente se marcan con clase de afirmación `observado` o `confirmado por transcripción`. Las HU de extensión (alineación/distribución, aspect-ratio lock, redimension multi-selección) se marcan con clase `hipótesis` o `abierto` y etiqueta `requires-clarification` — entran al backlog pero no se activan hasta resolver la decisión de producto.

## Tabla de HU de la épica

| ID | Título | Actor | Prioridad | Tamaño | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-1A.001 | Crear cosa con tamaño mínimo por defecto en auto-sizing | MN | M0 | S | opcloud-ui | — |
| HU-1A.002 | Ajustar cosa a su rótulo con `Fit to Text` | MN | M1 | S | opcloud-ui | — |
| HU-1A.003 | Pasar cosa a modo manual con `Toggle Auto Sizing` | ME | M1 | S | opcloud-ui | — |
| HU-1A.004 | Redimensionar cosa arrastrando handle lateral | ME | M1 | M | opcloud-ui | — |
| HU-1A.005 | Redimensionar cosa arrastrando handle de esquina | ME | M1 | M | opcloud-ui | — |
| HU-1A.006 | Proteger rótulo contra compresión excesiva en manual sizing | ME | M1 | S | opcloud-ui | — |
| HU-1A.007 | Volver a auto-sizing preservando contenido | ME | M1 | XS | opcloud-ui | — |
| HU-1A.008 | Persistir ancho, alto y modo de sizing por cosa | ME | M0 | S | opcloud-ui | — |
| HU-1A.009 | Activar cuadricula ortogonal con toggle `Cuadricula` | ME | M1 | S | opcloud-ui | — |
| HU-1A.010 | Cuantizar movimiento de cosa al paso de cuadricula | ME | M1 | M | opcloud-ui | — |
| HU-1A.011 | Configurar `Cuadricula Size` como incremento del iman | ME | S | S | opcloud-ui | — |
| HU-1A.012 | Configurar `Cuadricula Color` y `Cuadricula Thickness` de la reticula | AO | C | S | opcloud-ui | — |
| HU-1A.013 | Configurar `Scale Factor` de la cuadricula | AO | C | S | opcloud-ui | — |
| HU-1A.014 | Persistir preferencias de cuadricula fuera del diagrama exportado | ME | S | S | opcloud-ui | — |
| HU-1A.015 | Redimensionar multi-seleccion preservando modo de sizing por cosa | ME | S | M | opcloud-ui | — |
| HU-1A.016 | Bloquear relacion de aspecto durante redimension con Shift | ME | C | S | opcloud-ui | — |
| HU-1A.017 | Alinear cosas seleccionadas por eje (izq/centro/der/top/middle/bottom) | ME | S | M | opcloud-ui | — |
| HU-1A.018 | Distribuir cosas seleccionadas con spacing uniforme (horizontal/vertical) | ME | S | M | opcloud-ui | — |
Total: **18 historias de usuario** (18 opcloud-ui).

Distribución por prioridad: 1 M0 · 8 M1 · 5 S · 3 C · 1 cruzada (HU-1A.001 también toca persistencia).
Distribución por clase de afirmación: 9 observado/confirmado · 9 `requires-clarification` (hipótesis o abierto).

## Historias de usuario

### HU-1A.001 — Crear cosa con tamaño mínimo por defecto en auto-sizing

**Actor primario:** MN (modelador novato).
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Fuente normativa primaria:** —.
**Nivel categórico:** V (render) primario; K (nuevo campo `thing.auto_sizing`) secundario.
**Superficie UI:** canvas-opd.
**Gesto canónico:** ninguno (regla activa al crear cualquier cosa).

**Historia:**
> Como modelador, quiero que cada cosa nueva nazca con un tamaño mínimo legible en modo auto-sizing para no tener que preocuparme por dimensiones al crearla.

**Contexto de negocio:**
El arranque de cada cosa debe ser legible sin intervención. Un tamaño mínimo por defecto, combinado con auto-sizing activo, garantiza que el rótulo siempre quepa y que el modelador novato no termine con cajas degeneradas. Es la base geométrica sobre la que se apoyan todos los gestos posteriores de redimension.

**Criterios de aceptación:**
- **Dado** que arrastro un proceso u objeto al canvas, **cuando** se crea, **entonces** tiene `width` y `height` por encima de un umbral mínimo definido por la SSOT visual.
- **Dado** que una cosa acaba de ser creada, **cuando** miro sus propiedades, **entonces** `thing.auto_sizing = true` por default.
- **Dado** que una cosa está en auto-sizing, **cuando** intento reducir su tamaño por debajo del umbral mínimo sin cambiar de modo, **entonces** la operación se rechaza o se acota al mínimo.
- **Dado** que el rótulo por default es breve (`A Processing`, `An Object`), **cuando** la cosa se renderiza, **entonces** el texto cabe completo dentro de la forma sin truncar.

**Reglas y restricciones:**
- Umbral mínimo es consistente entre Object y Process (transcripción §3.1 doc fuente).
- El mínimo depende del rótulo actual — si el rótulo cambia, el mínimo también.
- Default `auto_sizing = true`.

**Modelo de datos tocado:**
- `thing.width` — number (pixeles lógicos) — persistente.
- `thing.height` — number — persistente.
- `thing.auto_sizing` — boolean (default `true`) — persistente.

**Dependencias:**
- Bloquea a: HU-1A.002 (fit-to-text opera sobre modo auto), HU-1A.003 (toggle requiere modo inicial), HU-1A.004/005 (handles operan sobre tamaño existente).

**Integraciones:**
- Renderer JointJS (`src/render/jointjs/`) aplica `width`/`height` al shape.
- Layout algorítmico (`src/render/layout/`) respeta el tamaño al posicionar.

**Notas de evidencia:**
- Fuente: `opcloud-reverse/1a-canvas-grid-resize.md` §3.1, §6.1.
- Frames: `31/frame_00005` (tamaño mínimo inicial).
- Transcripción: "El estado inicial es auto-sized y el mínimo aplica tanto a objetos como a procesos".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** M0 (sin tamaño mínimo no hay render legible).
**Tamaño:** S.
**Etiquetas:** [canvas, render, redimension, auto-sizing, min-size, kernel].

---

### HU-1A.002 — Ajustar cosa a su rótulo con `Fit to Text`

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Fuente normativa primaria:** —.
**Nivel categórico:** V primario; U (botón).
**Superficie UI:** toolbar-contextual (Entities Extension Group) → botón `Fit to Text`.
**Gesto canónico:** clic único.

**Historia:**
> Como modelador, quiero ejecutar `Fit to Text` para encoger la cosa hasta el tamaño mínimo compatible con su rótulo y eliminar espacio vacío visual.

**Contexto de negocio:**
Durante el modelado, los nombres cambian. Tras varias ediciones, la caja puede quedar sobredimensionada respecto al texto real. `Fit to Text` re-centra la cosa a su contenido sin salir del modo auto-sizing, manteniendo la coherencia visual del diagrama.

**Criterios de aceptación:**
- **Dado** que tengo una cosa seleccionada con espacio vacío alrededor del rótulo, **cuando** abro el grupo de entidades y hago clic en `Fit to Text`, **entonces** `width` y `height` se recalculan al mínimo compatible con el rótulo actual.
- **Dado** que hice `Fit to Text`, **cuando** miro el modo, **entonces** `thing.auto_sizing = true` (si no lo estaba, la acción lo re-activa — hipótesis sujeta a confirmación).
- **Dado** que hice `Fit to Text`, **cuando** el rótulo cambie después, **entonces** la cosa vuelve a adaptarse automáticamente porque sigue en auto-sizing.

**Reglas y restricciones:**
- `Fit to Text` es una acción, no un modo — se ejecuta una vez.
- Relación con `auto_sizing`: la acción implica estar en auto (pregunta abierta: si se ejecuta en manual, ¿cambia el modo?).
- No afecta al modo de wrapping del texto.

**Modelo de datos tocado:**
- `thing.width` — number — persistente.
- `thing.height` — number — persistente.

**Dependencias:**
- Bloqueada por: HU-1A.001.
- Relaciona: EPICA-14 (styling) para font-size y wrapping del texto.

**Integraciones:**
- Renderer JointJS.
- Motor de métricas de texto (canvas text measurement).

**Notas de evidencia:**
- Fuente: §3.2, §5.1.
- Transcripción: "Pulsa `Fit to Text` → OPCloud encoge la caja hasta el mínimo compatible con el rotulo".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [canvas, ui, redimension, fit-to-text, auto-sizing].

---

### HU-1A.003 — Pasar cosa a modo manual con `Toggle Auto Sizing`

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente normativa primaria:** —.
**Nivel categórico:** K (cambia `thing.auto_sizing`) primario; U (botón).
**Superficie UI:** toolbar-contextual (Entities Extension Group) → botón `Toggle Auto Sizing`.
**Gesto canónico:** clic único (toggle).

**Historia:**
> Como modelador experto, quiero desactivar auto-sizing con `Toggle Auto Sizing` para deformar la cosa libremente (más ancha, más angosta, más alta) cuando la composición visual lo requiera.

**Contexto de negocio:**
Auto-sizing es excelente para modelado cotidiano, pero ciertos usos (presentaciones, énfasis visual, casos extremos) requieren tomar control manual. El toggle es la puerta a ese modo. La transcripción §3.3 diferencia claramente: `manual` = libertad de forma, peor wrapping; `automatic` = mejores proporciones, menos libertad.

**Criterios de aceptación:**
- **Dado** que tengo una cosa con `auto_sizing=true` seleccionada, **cuando** hago clic en `Toggle Auto Sizing`, **entonces** `thing.auto_sizing` pasa a `false`.
- **Dado** que `auto_sizing=false`, **cuando** arrastro un handle (HU-1A.004/005), **entonces** el tamaño cambia libremente sin que el sistema lo corrija.
- **Dado** que `auto_sizing=false`, **cuando** el rótulo se actualiza, **entonces** la caja **no** se re-ajusta automáticamente (manual preserva tamaño).
- **Dado** que `auto_sizing=false`, **cuando** vuelvo a hacer clic en `Toggle Auto Sizing`, **entonces** vuelve a `true` (HU-1A.007).

**Reglas y restricciones:**
- Default: `auto_sizing = true`.
- El toggle no altera `width`/`height` actuales — solo cambia el modo.
- Mientras esté en manual, el rótulo **no puede ocultarse permanentemente** (ver HU-1A.006 para protección).

**Modelo de datos tocado:**
- `thing.auto_sizing` — boolean — persistente.

**Dependencias:**
- Bloqueada por: HU-1A.001.
- Bloquea a: HU-1A.004, HU-1A.005 (los handles toman relevancia plena en manual), HU-1A.007 (volver a auto).

**Integraciones:**
- Renderer (deshabilita recálculo automático de dimensiones).

**Notas de evidencia:**
- Fuente: §3.3, §5.1.
- Frames: `31/frame_00011` (`Toggle Auto Sizing` visible), `31/frame_00013` (deformación manual tras toggle), `31/frame_00016` (aspecto extremo permitido).
- Transcripción: "`manual`: libertad de forma, peor wrapping; `automatic`: mejores proporciones y wrapping, menos libertad formal".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [canvas, ui, redimension, toggle, manual-sizing, kernel].

---

### HU-1A.004 — Redimensionar cosa arrastrando handle lateral

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente normativa primaria:** —.
**Nivel categórico:** U primario; V, K (actualiza `width`/`height`) secundarios.
**Superficie UI:** canvas (handles laterales sobre cosa seleccionada).
**Gesto canónico:** mouse-down en handle lateral + arrastre + release.

**Historia:**
> Como modelador, quiero arrastrar un handle lateral (norte, sur, este u oeste) de la cosa seleccionada para modificar solo una dimensión (alto o ancho) sin afectar la otra.

**Contexto de negocio:**
Los handles laterales dan control dimensional independiente: estirar horizontalmente sin cambiar altura, o viceversa. Es la herramienta precisa cuando se quiere respetar una dimensión y solo ajustar la otra. Complementa a los handles de esquina (HU-1A.005) que cambian ambas.

**Criterios de aceptación:**
- **Dado** que una cosa está seleccionada, **cuando** miro su bounding box, **entonces** veo 4 handles laterales (N, S, E, W) visibles.
- **Dado** que tengo `auto_sizing=false`, **cuando** arrastro el handle E hacia la derecha, **entonces** solo `width` aumenta; `height` permanece igual.
- **Dado** que tengo `auto_sizing=false`, **cuando** arrastro el handle S hacia abajo, **entonces** solo `height` aumenta; `width` permanece igual.
- **Dado** que tengo `auto_sizing=true`, **cuando** intento arrastrar un handle que reduciría la caja por debajo del mínimo del rótulo, **entonces** el redimension se acota al mínimo (no reduce más).
- **Dado** que suelto el handle, **cuando** termina el arrastre, **entonces** el nuevo `width`/`height` persiste.

**Reglas y restricciones:**
- Handle lateral cambia **una** dimensión; handle de esquina cambia **dos** (HU-1A.005).
- Ancla del redimension: el lado opuesto queda fijo (arrastre de E estira a la derecha, el lado W queda fijo).
- En manual, no hay mínimo geométrico salvo protección del rótulo (HU-1A.006).
- En auto, el mínimo del rótulo es respetado.

**Modelo de datos tocado:**
- `thing.width` — number — persistente.
- `thing.height` — number — persistente.

**Dependencias:**
- Bloqueada por: HU-1A.001 (cosa existe), HU-1A.003 (para libertad total de manual).
- Interactúa con: HU-1A.010 (si la cuadricula está activa, el handle iman-ea al paso).

**Integraciones:**
- JointJS Paper + `elementTools` para handles.
- Renderer para redibujar en vivo durante el arrastre.

**Notas de evidencia:**
- Fuente: §2 tabla ("Handles de redimension"), §3.3, §5.1.
- Frames: `31/frame_00013` (deformación manual).
- Clase de afirmación: observado.

**Prioridad:** M1.
**Tamaño:** M (afecta JointJS elementTools + persistencia + iman).
**Etiquetas:** [canvas, ui, redimension, arrastre, handle-lateral, render].

---

### HU-1A.005 — Redimensionar cosa arrastrando handle de esquina

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente normativa primaria:** —.
**Nivel categórico:** U primario; V, K secundarios.
**Superficie UI:** canvas (handles de esquina sobre cosa seleccionada).
**Gesto canónico:** mouse-down en handle de esquina + arrastre + release.

**Historia:**
> Como modelador, quiero arrastrar un handle de esquina (NE, NW, SE, SW) para cambiar ancho y alto simultáneamente con un solo gesto.

**Contexto de negocio:**
Los handles de esquina son el gesto natural para "agrandar la caja". Cambian dos dimensiones a la vez siguiendo el puntero. Son especialmente útiles cuando la cosa está en manual-sizing y se quiere componer visualmente (p.ej. para diagramas de presentación).

**Criterios de aceptación:**
- **Dado** que una cosa está seleccionada, **cuando** miro su bounding box, **entonces** veo 4 handles de esquina (NE, NW, SE, SW) visibles.
- **Dado** que tengo `auto_sizing=false`, **cuando** arrastro el handle SE hacia abajo-derecha, **entonces** `width` y `height` aumentan proporcionalmente al movimiento del cursor (sin bloqueo de aspecto por default).
- **Dado** que arrastro el handle NW, **cuando** muevo, **entonces** el lado opuesto (SE) queda fijo como ancla.
- **Dado** que suelto el handle, **cuando** termina el arrastre, **entonces** `width` y `height` nuevos persisten.
- **Dado** que mantengo `Shift` durante el arrastre (HU-1A.016), **cuando** arrastro, **entonces** la relación de aspecto se preserva (comportamiento `requires-clarification`).

**Reglas y restricciones:**
- Handle de esquina cambia **dos** dimensiones simultáneamente.
- Ancla: esquina diametralmente opuesta.
- Default: sin bloqueo de aspecto (mover libre en x e y).
- `Shift`: ver HU-1A.016 — modificador para aspect-ratio lock (extensión no observada).

**Modelo de datos tocado:**
- `thing.width` — number — persistente.
- `thing.height` — number — persistente.

**Dependencias:**
- Bloqueada por: HU-1A.001.
- Bloquea a: HU-1A.016 (aspect-ratio requiere mecánica base).
- Interactúa con: HU-1A.010 (iman-a-cuadricula).

**Integraciones:**
- JointJS Paper + `elementTools`.
- Renderer.

**Notas de evidencia:**
- Fuente: §2 tabla, §3.3, §5.1.
- Frames: `31/frame_00013`, `31/frame_00016` (aspecto extremo).
- Clase de afirmación: observado (presencia de handles) + hipótesis (comportamiento exacto de ancla).

**Prioridad:** M1.
**Tamaño:** M.
**Etiquetas:** [canvas, ui, redimension, arrastre, handle-esquina, render].

---

### HU-1A.006 — Proteger rótulo contra compresión excesiva en manual sizing

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente normativa primaria:** —.
**Nivel categórico:** V primario; K (regla de invariante).
**Superficie UI:** canvas-render.
**Gesto canónico:** ninguno (invariante activo durante y después del redimension manual).

**Historia:**
> Como modelador, quiero que aunque esté en manual sizing OPCloud me muestre el rótulo si intento comprimir la caja por debajo del texto para no perder información accidentalmente.

**Contexto de negocio:**
La libertad de manual sizing es deseable, pero tiene un límite: el nombre de la cosa es parte del modelo, no decoración. Si la caja se hace tan pequeña que el rótulo no cabe, el sistema no debe sobrescribir ni esconder permanentemente el texto. La transcripción §3.3 lo formula: "el texto no desaparece definitivamente: si se intenta comprimir demasiado, OPCloud vuelve a mostrarlo".

**Criterios de aceptación:**
- **Dado** que tengo una cosa en `auto_sizing=false`, **cuando** arrastro un handle hasta que la caja sea más pequeña que el rótulo, **entonces** el rótulo se mantiene legible (overflow visual, salida del bounding box, o re-expansión parcial de la caja — comportamiento exacto `requires-clarification`).
- **Dado** que redujo la caja por debajo del rótulo, **cuando** termino el arrastre, **entonces** **no** se pierde ni se oculta permanentemente el texto.
- **Dado** que el rótulo es largo y la caja es pequeña, **cuando** se renderiza, **entonces** el texto tiene algún mecanismo de visibilidad (tooltip, overflow, ellipsis) — a definir con SSOT visual.

**Reglas y restricciones:**
- Invariante dura: el rótulo **nunca** se pierde permanentemente por redimension manual.
- Estrategia concreta (overflow vs re-expansión vs ellipsis + tooltip): pregunta abierta, necesita decisión de SSOT visual.

**Modelo de datos tocado:**
- Ninguno directo — regla de render.

**Dependencias:**
- Bloqueada por: HU-1A.003 (manual sizing existe), HU-1A.004/005 (redimension opera).

**Integraciones:**
- Renderer JointJS (lógica de clipping/overflow de texto).
- SSOT visual (`ssot/opm-visual-es.md`) debe fijar la convención.

**Notas de evidencia:**
- Fuente: §3.3, §4.1.
- Frames: implícito en `31/frame_00016` (aspecto extremo permitido sin perder texto).
- Transcripción: "el texto no desaparece definitivamente: si se intenta comprimir demasiado, OPCloud vuelve a mostrarlo".
- Clase de afirmación: confirmado por transcripción (regla); abierto (mecánica exacta).
- Etiqueta: `requires-clarification`.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [canvas, render, redimension, label, overflow, manual-sizing, requires-clarification].

---

### HU-1A.007 — Volver a auto-sizing preservando contenido

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente normativa primaria:** —.
**Nivel categórico:** K primario; V secundaria.
**Superficie UI:** toolbar-contextual → `Toggle Auto Sizing`.
**Gesto canónico:** clic único (segundo toggle).

**Historia:**
> Como modelador, quiero volver a activar auto-sizing con un segundo toggle para recuperar las proporciones regulares y buen wrapping después de una edición manual.

**Contexto de negocio:**
Después de composiciones manuales, el modelador a menudo quiere volver a modo automático para seguir trabajando con proporciones regulares. El mismo botón `Toggle Auto Sizing` es bidireccional. El siguiente ajuste (p.ej. cambio de nombre) respeta proporciones y wrapping.

**Criterios de aceptación:**
- **Dado** que tengo una cosa con `auto_sizing=false`, **cuando** hago clic en `Toggle Auto Sizing`, **entonces** `auto_sizing` pasa a `true`.
- **Dado** que acabo de volver a auto, **cuando** el contenido cambia (rótulo o estado), **entonces** la caja se re-ajusta automáticamente.
- **Dado** que volví a auto, **cuando** una dimensión manual era menor al mínimo del rótulo, **entonces** la caja crece al mínimo requerido al re-entrar en auto.

**Reglas y restricciones:**
- Transición manual→auto **no** resetea `width`/`height` a defaults; se re-ajusta al mínimo del contenido actual.
- El toggle es idempotente: aplicarlo dos veces vuelve al estado original.

**Modelo de datos tocado:**
- `thing.auto_sizing` — boolean — persistente.
- `thing.width`, `thing.height` — potencialmente re-calculados al volver a auto.

**Dependencias:**
- Bloqueada por: HU-1A.003.

**Integraciones:**
- Renderer (recalcula dimensiones).

**Notas de evidencia:**
- Fuente: §3.4, §5.1.
- Transcripción: "La cosa recupera el comportamiento automatico. El siguiente ajuste respeta proporciones y wrapping".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** M1.
**Tamaño:** XS.
**Etiquetas:** [canvas, ui, redimension, toggle, auto-sizing].

---

### HU-1A.008 — Persistir ancho, alto y modo de sizing por cosa

**Actor primario:** ME.
**Actores secundarios:** RV (al reabrir modelo).
**Tipo:** opcloud-ui.
**Fuente normativa primaria:** —.
**Nivel categórico:** P (persistencia) primario; K (forma de datos).
**Superficie UI:** ninguna (comportamiento transversal).
**Gesto canónico:** save/load.

**Historia:**
> Como modelador, quiero que el tamaño y modo de sizing de cada cosa se guarden con el modelo para que al reabrirlo el diagrama se vea idéntico a como lo dejé.

**Contexto de negocio:**
Las dimensiones y el modo de sizing son parte de la **apariencia persistente** de la cosa (§6.1 doc fuente). Sin persistencia, cada reapertura forzaría re-ajustar tamaños. La sección §6.1 del doc fuente es explícita en que `thing.width`, `thing.height` y `thing.auto_sizing` son campos del shape persistente.

**Criterios de aceptación:**
- **Dado** que redimensioné una cosa manualmente a `(150, 80)`, **cuando** guardo el modelo y lo recargo, **entonces** la cosa se renderiza con `width=150`, `height=80`, `auto_sizing=false`.
- **Dado** que ajusté una cosa con `Fit to Text`, **cuando** guardo y recargo, **entonces** el tamaño persistido refleja el ajuste y `auto_sizing=true`.
- **Dado** que la cosa está en auto-sizing, **cuando** se guarda, **entonces** se persisten los valores efectivos actuales de `width`/`height` (no solo `auto_sizing=true`).
- **Dado** que una cosa tiene varias apariencias en diferentes OPDs (ver EPICA-20), **cuando** se persisten, **entonces** `width`/`height`/`auto_sizing` son **por apariencia**, no por entidad lógica.

**Reglas y restricciones:**
- `width`, `height`, `auto_sizing` son parte del shape persistente de cada **apariencia** (consistente con invariante "una entidad, varias apariencias" de OPM).
- Formato serialización: alineado con la SSOT del kernel (`src/nucleo/serializacion.ts`).

**Modelo de datos tocado:**
- `thing.apariencia[opdId].width` — number — persistente.
- `thing.apariencia[opdId].height` — number — persistente.
- `thing.apariencia[opdId].auto_sizing` — boolean — persistente.

**Dependencias:**
- Bloqueada por: HU-1A.001, HU-1A.003.
- Relaciona: EPICA-30 (save/load), EPICA-20 (apariencias por OPD).

**Integraciones:**
- Serialización del kernel.
- IndexedDB de sesión (`src/persistencia/`).

**Notas de evidencia:**
- Fuente: §6.1.
- Clase de afirmación: observado (los tamaños persisten tras cerrar/abrir en OPCloud) + hipótesis (por-apariencia vs por-entidad es inferencia alineada con la categórica del repo).

**Prioridad:** M0 (sin persistencia, el redimension pierde todo valor entre sesiones).
**Tamaño:** S.
**Etiquetas:** [canvas, persistencia, kernel, redimension, apariencia].

---

### HU-1A.009 — Activar cuadricula ortogonal con toggle `Cuadricula`

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente normativa primaria:** —.
**Nivel categórico:** V primario; U (toggle).
**Superficie UI:** toolbar secundaria sin selección → botón `Cuadricula`.
**Gesto canónico:** clic único (toggle).

**Historia:**
> Como modelador, quiero activar una cuadricula ortogonal visible en el canvas cuando lo necesito para alinear cosas con precisión.

**Contexto de negocio:**
La cuadricula es un ayudante de edición opt-in (§4.3 doc fuente). Default `off`, no aparece hasta que el usuario la enciende. Se justifica especialmente en in-ampliacion de procesos (§7.1 doc fuente), donde la altura relativa de subprocesos comunica el orden de ejecución.

**Criterios de aceptación:**
- **Dado** que no tengo elementos seleccionados, **cuando** miro la toolbar secundaria, **entonces** aparece el toggle `Cuadricula`.
- **Dado** que la cuadricula está apagada (default), **cuando** hago clic en `Cuadricula`, **entonces** se muestra una retícula ortogonal sobre el canvas.
- **Dado** que la cuadricula está activa, **cuando** hago clic de nuevo en `Cuadricula`, **entonces** la retícula desaparece.
- **Dado** que cambio de OPD dentro del mismo modelo, **cuando** se abre el nuevo OPD, **entonces** la preferencia de cuadricula se mantiene (global por sesión — hipótesis sujeta a HU-1A.014).

**Reglas y restricciones:**
- Default: `cuadricula.enabled = false`.
- El toggle solo es visible cuando no hay selección — §2 tabla doc fuente.
- La retícula es puramente visual, no afecta el modelo OPM.

**Modelo de datos tocado:**
- `cuadricula.enabled` — boolean — preferencia de render (no parte del diagrama persistido — ver HU-1A.014).

**Dependencias:**
- Bloquea a: HU-1A.010 (iman solo tiene sentido con cuadricula activo), HU-1A.011–013 (parámetros solo visibles cuando cuadricula existe).

**Integraciones:**
- Renderer JointJS Paper con `drawCuadricula`.

**Notas de evidencia:**
- Fuente: §2 tabla, §3.5, §4.3.
- Frames: `42/frame_00007` (caso sin cuadricula), `42/frame_00019` (cuadricula visible).
- Transcripción: "el default es `off`"; "es una ayuda de edicion que se enciende cuando se necesita".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [canvas, ui, cuadricula, toggle, opt-in, render].

---

### HU-1A.010 — Cuantizar movimiento de cosa al paso de cuadricula

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente normativa primaria:** —.
**Nivel categórico:** V primario; U (arrastre).
**Superficie UI:** canvas con cuadricula activa.
**Gesto canónico:** arrastre de cosa (mouse-down + move + release).

**Historia:**
> Como modelador, quiero que al arrastrar una cosa con la cuadricula activada el movimiento salte en incrementos discretos para alinear las cosas con precisión sin hacer ajustes manuales.

**Contexto de negocio:**
La utilidad primaria de la cuadricula es **iman-a-cuadricula**: cuantización del movimiento. La transcripción §3.5 lo precisa: "Al arrastrar cosas, el movimiento queda cuantizado segun el paso configurado". Esto es especialmente valioso en in-ampliacion, donde las alturas relativas de subprocesos comunican orden de ejecución — alinearlas a la cuadricula garantiza lectura unívoca.

**Criterios de aceptación:**
- **Dado** que la cuadricula está activa y `cuadricula.size = 10`, **cuando** arrastro una cosa, **entonces** la posición final cae en un múltiplo de 10 en ambos ejes.
- **Dado** que la cuadricula está inactiva, **cuando** arrastro una cosa, **entonces** la posición es libre (sin iman).
- **Dado** que la cuadricula está activa, **cuando** cambio `cuadricula.size` mientras una cosa está siendo arrastrada, **entonces** el nuevo tamaño aplica al siguiente movimiento (o en el actual si el renderer soporta live update — detalle a decidir).
- **Dado** que la cuadricula está activa y redimensiono con un handle, **cuando** termino el arrastre, **entonces** las dimensiones también quedan cuantizadas al paso de cuadricula (hipótesis alineada con el comportamiento esperado de JointJS).

**Reglas y restricciones:**
- Iman aplica a **movimiento** y — por consistencia — **redimension** cuando la cuadricula está activa.
- Iman **no** aplica a creación (el drop inicial respeta la posición del cursor pero se cuantiza al soltar).
- La cuantización usa `cuadricula.size` como paso en ambos ejes (cuadricula cuadrada, §5.2 doc fuente no menciona ejes separados).

**Modelo de datos tocado:**
- `thing.apariencia[opdId].position.x` / `.y` — cuantizados al guardar.

**Dependencias:**
- Bloqueada por: HU-1A.009, HU-1A.011.

**Integraciones:**
- JointJS Paper con `cuadriculaSize` activo + listener de `pointermove`.
- Interacción con HU-1A.004/005 (redimension con iman).

**Notas de evidencia:**
- Fuente: §3.5, §7.1.
- Frames: `42/frame_00021` (alineación de subprocesos con retícula).
- Transcripción: "el movimiento queda cuantizado segun el paso configurado".
- Clase de afirmación: confirmado por transcripción (movimiento); hipótesis (redimension también iman-ea).

**Prioridad:** M1.
**Tamaño:** M.
**Etiquetas:** [canvas, render, cuadricula, iman-a-cuadricula, arrastre].

---

### HU-1A.011 — Configurar `Cuadricula Size` como incremento del iman

**Actor primario:** ME.
**Actores secundarios:** AO (para defaults de organización).
**Tipo:** opcloud-ui.
**Fuente normativa primaria:** —.
**Nivel categórico:** C (config) primario; V (efecto en render).
**Superficie UI:** Settings → OPCloud/Style Settings → `Cuadricula Settings` → campo `Cuadricula Size`.
**Gesto canónico:** edición de input numérico.

**Historia:**
> Como modelador, quiero definir el paso de la cuadricula en píxeles para que el iman se ajuste a la densidad del diagrama que estoy construyendo.

**Contexto de negocio:**
No hay un tamaño de cuadricula universal: modelos densos requieren paso fino; modelos amplios se benefician de paso grueso. `Cuadricula Size` es el parámetro dominante del comportamiento de iman (§3.6 doc fuente).

**Criterios de aceptación:**
- **Dado** que abro `Cuadricula Settings`, **cuando** miro el formulario, **entonces** hay un campo numérico `Cuadricula Size` con valor actual.
- **Dado** que cambio `Cuadricula Size` a `20` y aplico, **cuando** vuelvo al canvas con la cuadricula activa, **entonces** la retícula muestra celdas de 20px y el iman usa 20 como paso.
- **Dado** que `Cuadricula Size=20`, **cuando** arrastro una cosa, **entonces** la posición final es múltiplo de 20 en ambos ejes.
- **Dado** que ingreso un valor inválido (negativo, no numérico, 0), **cuando** intento aplicar, **entonces** el sistema rechaza el cambio con feedback.

**Reglas y restricciones:**
- `Cuadricula Size` es un entero positivo ≥1.
- Sin límite superior documentado; valores muy altos degradan a "no hay iman útil".
- Default observado: pendiente de identificar (probablemente 10 u 8 — abierto).

**Modelo de datos tocado:**
- `cuadricula.size` — integer (>0) — preferencia de render.

**Dependencias:**
- Bloqueada por: HU-1A.009.
- Bloquea a: HU-1A.010 (iman depende de este parámetro).

**Integraciones:**
- Panel de Settings (EPICA-80 / EPICA-81).
- Renderer JointJS.

**Notas de evidencia:**
- Fuente: §3.6, §5.2, §6.2.
- Frames: `42/frame_00024` (ajustes tras cambiar parámetros), `42/frame_00026` (panel `Cuadricula Settings`).
- Transcripción: "`Cuadricula Size` controla cuanto se mueve una cosa en cada paso cuando la cuadricula esta activa".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [canvas, config, cuadricula, cuadricula-size].

---

### HU-1A.012 — Configurar `Cuadricula Color` y `Cuadricula Thickness` de la retícula

**Actor primario:** AO (admin de organización).
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Fuente normativa primaria:** —.
**Nivel categórico:** C primario; V.
**Superficie UI:** Settings → `Cuadricula Settings` → campos `Cuadricula Color` y `Cuadricula Thickness`.
**Gesto canónico:** selección de color y edición numérica.

**Historia:**
> Como admin de organización, quiero personalizar el color y grosor de las líneas de la cuadricula para adaptarlas al contraste del tema visual (claro/oscuro) o a preferencias de legibilidad.

**Contexto de negocio:**
La cuadricula debe ser visible pero no invasiva. El default usa colores tenues; admins o usuarios con preferencias de accesibilidad (bajo contraste, modo oscuro) pueden necesitar ajustarlos. Son parámetros puramente estéticos, no afectan al iman.

**Criterios de aceptación:**
- **Dado** que abro `Cuadricula Settings`, **cuando** miro el formulario, **entonces** hay un selector de color (`Cuadricula Color`) y un input numérico (`Cuadricula Thickness`).
- **Dado** que cambio `Cuadricula Color` a azul claro y aplico, **cuando** la cuadricula es visible, **entonces** las líneas se muestran en azul claro.
- **Dado** que cambio `Cuadricula Thickness` a `2` y aplico, **cuando** la cuadricula es visible, **entonces** las líneas se renderizan con 2px de grosor.
- **Dado** que cambio color/thickness, **cuando** el iman opera, **entonces** la funcionalidad del iman no cambia (solo estética).

**Reglas y restricciones:**
- `Cuadricula Color`: string hex, CSS color, o similar.
- `Cuadricula Thickness`: entero positivo, rango razonable (1–5 px sugerido).
- Cambios solo afectan render, no persistencia del diagrama.

**Modelo de datos tocado:**
- `cuadricula.color` — string — preferencia.
- `cuadricula.thickness` — integer — preferencia.

**Dependencias:**
- Bloqueada por: HU-1A.009.

**Integraciones:**
- Renderer JointJS (stroke del `drawCuadricula`).
- Panel Settings (EPICA-81).

**Notas de evidencia:**
- Fuente: §3.6, §5.2, §6.2.
- Frames: `42/frame_00026` (panel `Cuadricula Settings` con controles).
- Clase de afirmación: observado (presencia de controles); hipótesis (valores exactos del default).

**Prioridad:** C.
**Tamaño:** S.
**Etiquetas:** [canvas, config, cuadricula, estilo, color, thickness].

---

### HU-1A.013 — Configurar `Scale Factor` de la cuadricula

**Actor primario:** AO.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Fuente normativa primaria:** —.
**Nivel categórico:** C primario; V.
**Superficie UI:** Settings → `Cuadricula Settings` → campo `Scale Factor`.
**Gesto canónico:** edición numérica.

**Historia:**
> Como admin, quiero configurar el `Scale Factor` de la cuadricula para — hipotéticamente — controlar cómo la retícula interactúa con el nivel de ampliacion del canvas.

**Contexto de negocio:**
`Scale Factor` es un parámetro observado en el panel `Cuadricula Settings` (§3.6 y §5.2 doc fuente). La transcripción no aclara su semántica exacta. Dos interpretaciones plausibles:

1. Multiplicador del `cuadricula.size` que se aplica al hacer ampliacion (la cuadricula "respira" con la ampliacion).
2. Valor independiente de la ampliacion que define el render absoluto de la retícula.

La §11.2 del doc fuente lista explícitamente esta pregunta como abierta.

**Criterios de aceptación:**
- **Dado** que abro `Cuadricula Settings`, **cuando** miro el formulario, **entonces** hay un campo `Scale Factor`.
- **Dado** que cambio `Scale Factor`, **cuando** aplico, **entonces** el comportamiento de la cuadricula al hacer ampliacion cambia (semántica a decidir).
- **Pregunta abierta**: definir si `Scale Factor` es multiplicador de ampliacion o valor independiente — §11.2 doc fuente.

**Reglas y restricciones:**
- Semántica exacta: **pregunta abierta**.
- Rango: número positivo.

**Modelo de datos tocado:**
- `cuadricula.scale_factor` — number — preferencia.

**Dependencias:**
- Bloqueada por: HU-1A.009 y por resolución de §11.2.

**Integraciones:**
- Renderer (ampliacion + cuadricula).

**Notas de evidencia:**
- Fuente: §3.6, §5.2, §6.2, §11.2 (pregunta abierta).
- Frames: `42/frame_00026` (control visible).
- Clase de afirmación: observado (presencia); abierto (semántica).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamaño:** S.
**Etiquetas:** [canvas, config, cuadricula, scale-factor, requires-clarification].

---

### HU-1A.014 — Persistir preferencias de cuadricula fuera del diagrama exportado

**Actor primario:** ME.
**Actores secundarios:** AO, RV.
**Tipo:** opcloud-ui.
**Fuente normativa primaria:** —.
**Nivel categórico:** P primario; X (export) secundario.
**Superficie UI:** ninguna directa.
**Gesto canónico:** save/load, export.

**Historia:**
> Como modelador, quiero que las preferencias de cuadricula (enabled, size, color, thickness, scale factor) no queden embebidas en el diagrama exportado para que la cuadricula sea solo una ayuda de edición y no contamine la salida PDF/SVG.

**Contexto de negocio:**
§4.3 doc fuente: la cuadricula es infraestructura de layout, no semántica del modelo. §7.3: no hay evidencia de que se exporte, y el comportamiento razonable es suprimirla. §11.1 y §11.3 plantean la pregunta abierta: ¿las preferencias son por usuario, por modelo o por sesión? Y ¿siempre se suprimen al exportar?

**Criterios de aceptación:**
- **Dado** que tengo la cuadricula activa, **cuando** exporto a PDF/SVG, **entonces** la salida **no** contiene las líneas de la retícula.
- **Dado** que guardo un modelo con la cuadricula activa y otro usuario lo abre, **cuando** ese usuario abre el modelo, **entonces** **pregunta abierta**: ¿hereda el estado de cuadricula del autor o usa sus propias preferencias?
- **Dado** que configuré `cuadricula.size=20` como preferencia personal, **cuando** cambio de modelo en la misma sesión, **entonces** `cuadricula.size` se conserva (preferencia global).

**Reglas y restricciones:**
- La cuadricula es ayuda de edición, no diagrama.
- Export siempre suprime la retícula (hipótesis inicial, pendiente §11.3).
- Alcance de persistencia (usuario / modelo / sesión): **pregunta abierta** §11.1.

**Modelo de datos tocado:**
- `cuadricula.*` — preferencia (no parte del modelo OPM).
- Por definir: ubicación (localStorage / IndexedDB / user profile en server).

**Dependencias:**
- Bloqueada por: HU-1A.009, HU-1A.011–013.
- Relaciona: EPICA-60 (export PDF), EPICA-61 (export SVG), EPICA-80 (config usuario).

**Integraciones:**
- Exportadores.
- Panel Settings.

**Notas de evidencia:**
- Fuente: §4.3, §6.2, §7.3, §11.1, §11.3.
- Clase de afirmación: hipótesis (suprimir en export); abierto (alcance de persistencia).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [canvas, persistencia, cuadricula, export, preferencias, requires-clarification].

---

### HU-1A.015 — Redimensionar multi-selección preservando modo de sizing por cosa

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente normativa primaria:** —.
**Nivel categórico:** U primario; V, K secundarios.
**Superficie UI:** canvas con múltiples cosas seleccionadas + handles del bounding box conjunto.
**Gesto canónico:** selección múltiple + arrastre de handle del bounding box.

**Historia:**
> Como modelador experto, quiero redimensionar varias cosas a la vez arrastrando un handle del bounding box de la selección para escalar composiciones completas sin tocar cada cosa por separado.

**Contexto de negocio:**
Extensión **no observada** en OPCloud (el doc fuente §3 describe redimension solo por cosa individual). Incluida como HU candidata por ser pedido explícito de producto y por ser funcionalidad estándar en herramientas de modelado modernas. Marca `requires-clarification` hasta validar contra comportamiento objetivo del modelador.

**Criterios de aceptación:**
- **Dado** que tengo 3 cosas seleccionadas, **cuando** arrastro un handle del bounding box conjunto, **entonces** las 3 cosas se escalan proporcionalmente.
- **Dado** que una de las 3 cosas está en `auto_sizing=true` y otras en `false`, **cuando** escalo el grupo, **entonces** **pregunta abierta**: ¿todas pasan a manual? ¿las auto-sizing ignoran el redimension?
- **Dado** que escalo el grupo, **cuando** termina el arrastre, **entonces** las posiciones relativas entre cosas se preservan (spacing escala con el grupo).

**Reglas y restricciones:**
- **Pregunta abierta**: comportamiento con cosas en modos de sizing mixtos.
- **Pregunta abierta**: si el handle existe siquiera en la visión de producto (OPCloud no lo muestra).
- Debe interactuar razonablemente con iman-a-cuadricula (HU-1A.010).

**Modelo de datos tocado:**
- `thing.apariencia[opdId].width` / `.height` / `.position` — múltiples cosas.

**Dependencias:**
- Bloqueada por: HU-1A.001, HU-1A.004/005, decisión de producto sobre multi-selección geométrica.
- Relaciona: EPICA-11 (modelado básico, selección múltiple).

**Integraciones:**
- JointJS Paper (`CellView` collection).
- Renderer.

**Notas de evidencia:**
- Fuente: **no observado** en doc fuente; extensión de producto.
- Clase de afirmación: abierto.
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [canvas, ui, redimension, multi-selección, requires-clarification].

---

### HU-1A.016 — Bloquear relación de aspecto durante redimension con Shift

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente normativa primaria:** —.
**Nivel categórico:** U primario; V.
**Superficie UI:** canvas con handle de esquina + modificador de teclado.
**Gesto canónico:** arrastre de handle de esquina + `Shift` presionado.

**Historia:**
> Como modelador, quiero mantener `Shift` presionado durante un redimension por handle de esquina para preservar la relación de aspecto original de la cosa.

**Contexto de negocio:**
Extensión **no observada** en OPCloud (§3.3 y §4.1 doc fuente describen manual sizing como libre; no se menciona modificador de teclado). Incluida como HU candidata por ser convención estándar en editores visuales. `Shift` como modificador de aspect-ratio es idioma de UX compartido (Figma, Illustrator, Inkscape).

**Criterios de aceptación:**
- **Dado** que tengo `auto_sizing=false` y `Shift` no presionado, **cuando** arrastro el handle SE, **entonces** `width` y `height` cambian independientemente.
- **Dado** que presiono `Shift` antes o durante el arrastre, **cuando** arrastro el handle SE, **entonces** `width` y `height` escalan manteniendo la razón inicial.
- **Dado** que suelto `Shift` durante el arrastre, **cuando** sigo arrastrando, **entonces** el comportamiento vuelve a libre (aspect-ratio se pierde).
- **Dado** que estoy en auto-sizing, **cuando** presiono `Shift` y arrastro, **entonces** **pregunta abierta**: ¿el modificador desactiva auto temporalmente? ¿se ignora?

**Reglas y restricciones:**
- Modificador: `Shift`. (Alternativa: `Ctrl`/`Cmd` — decisión de producto pendiente).
- **Pregunta abierta**: convención exacta — si Felix quiere Shift estándar o alguna tecla distinta.
- Interacción con iman-a-cuadricula: al tener aspect-ratio bloqueado, el iman podría violar la razón; decisión de producto.

**Modelo de datos tocado:**
- Ninguno directo (solo comportamiento del gesto).

**Dependencias:**
- Bloqueada por: HU-1A.005.

**Integraciones:**
- JointJS Paper + keyboard listener.

**Notas de evidencia:**
- Fuente: **no observado** en doc fuente.
- Clase de afirmación: abierto.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamaño:** S.
**Etiquetas:** [canvas, ui, redimension, aspect-ratio, shift, modificador, requires-clarification].

---

### HU-1A.017 — Alinear cosas seleccionadas por eje (izq/centro/der/top/middle/bottom)

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente normativa primaria:** —.
**Nivel categórico:** U primario; V.
**Superficie UI:** toolbar-contextual de multi-selección → botones de alineación.
**Gesto canónico:** clic en botón de alineación con selección múltiple activa.

**Historia:**
> Como modelador, quiero alinear varias cosas seleccionadas por su izquierda, centro, derecha, top, middle o bottom para producir composiciones ordenadas sin ajustes manuales píxel-perfecto.

**Contexto de negocio:**
Extensión **no observada** en OPCloud: §4.4 del doc fuente es explícito — "No se observan smart guides. La alineacion visible depende de la reticula y del iman implicito; no aparecen guias dinamicas entre cosas". Sin embargo, las operaciones de alineación por botón son **distintas** a las smart guides: operan sobre selección explícita y no requieren feedback dinámico durante el arrastre. Por eso se incluyen como HU candidatas de extensión razonable de producto.

**Criterios de aceptación:**
- **Dado** que tengo ≥2 cosas seleccionadas, **cuando** miro la toolbar contextual, **entonces** veo 6 botones de alineación (left, center-h, right, top, middle-v, bottom).
- **Dado** que tengo 3 cosas seleccionadas con `x` distintos, **cuando** hago clic en `Align Left`, **entonces** todas adoptan el `x` mínimo de la selección.
- **Dado** que tengo 3 cosas seleccionadas, **cuando** hago clic en `Align Center Horizontal`, **entonces** todas adoptan la misma coordenada x de su centro, igual al promedio o a un ancla por definir.
- **Dado** que la cuadricula está activa, **cuando** aplico una alineación, **entonces** las posiciones resultantes caen en la cuadricula (iman se compone con alineación).
- **Dado** que solo hay 1 cosa seleccionada, **cuando** miro la toolbar, **entonces** los botones de alineación están deshabilitados.

**Reglas y restricciones:**
- **Pregunta abierta**: ancla de la alineación — ¿primer elemento seleccionado? ¿promedio? ¿bounding box?
- Alineación opera sobre posición, no sobre tamaño (no cambia `width`/`height`).
- Reversibilidad: alineación es un commando con undo (EPICA-90).

**Modelo de datos tocado:**
- `thing.apariencia[opdId].position.x` / `.y` — múltiples cosas.

**Dependencias:**
- Bloqueada por: selección múltiple (EPICA-11).
- Relaciona: HU-1A.018 (distribución), HU-1A.010 (iman con alineación).

**Integraciones:**
- Renderer.
- Kernel (comandos batch de move).

**Notas de evidencia:**
- Fuente: **no observado** en doc fuente (§4.4 excluye smart guides); extensión de producto.
- Clase de afirmación: abierto.
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [canvas, ui, alineación, multi-selección, requires-clarification].

---

### HU-1A.018 — Distribuir cosas seleccionadas con spacing uniforme (horizontal/vertical)

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente normativa primaria:** —.
**Nivel categórico:** U primario; V.
**Superficie UI:** toolbar-contextual de multi-selección → botones de distribución.
**Gesto canónico:** clic en botón de distribución con ≥3 cosas seleccionadas.

**Historia:**
> Como modelador, quiero distribuir ≥3 cosas seleccionadas con spacing uniforme en el eje horizontal o vertical para ordenar secuencias o cuadriculas de elementos sin medir a mano.

**Contexto de negocio:**
Extensión **no observada** en OPCloud. Complementaria a HU-1A.017 (alineación). Mientras alineación pone elementos en una misma línea, distribución los espacia uniformemente dentro de un rango. En modelado OPM, es especialmente útil en in-ampliacion vertical (los subprocesos en secuencia) y en layouts horizontales de objetos-instrumentales.

**Criterios de aceptación:**
- **Dado** que tengo 4 cosas seleccionadas con `x` variados, **cuando** hago clic en `Distribute Horizontal`, **entonces** el spacing horizontal entre centros (o bordes, a decidir) es uniforme.
- **Dado** que tengo 4 cosas seleccionadas, **cuando** hago clic en `Distribute Vertical`, **entonces** el spacing vertical es uniforme.
- **Dado** que tengo solo 2 cosas seleccionadas, **cuando** miro los botones de distribución, **entonces** están deshabilitados (se necesitan ≥3 para definir espaciado relativo).
- **Dado** que aplico distribución horizontal, **cuando** ocurre, **entonces** el `x` de la cosa más a la izquierda y el `x` de la más a la derecha se preservan; los intermedios se recolocan.
- **Dado** que la cuadricula está activa, **cuando** aplico distribución, **entonces** las posiciones resultantes se cuantizan al paso de cuadricula (puede perderse uniformidad exacta — decisión de producto).

**Reglas y restricciones:**
- Requiere ≥3 elementos.
- **Pregunta abierta**: distribución por centros vs por bordes (left-to-right-edge spacing).
- **Pregunta abierta**: preservar spacing original (distribuir manteniendo ancho de distribución) vs uniforme entre extremos.
- Reversible con undo.

**Modelo de datos tocado:**
- `thing.apariencia[opdId].position.x` / `.y` — múltiples cosas intermedias.

**Dependencias:**
- Bloqueada por: selección múltiple (EPICA-11).
- Relaciona: HU-1A.017, HU-1A.010.

**Integraciones:**
- Renderer.
- Kernel (comandos batch).

**Notas de evidencia:**
- Fuente: **no observado** en doc fuente; extensión de producto.
- Clase de afirmación: abierto.
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [canvas, ui, distribución, multi-selección, requires-clarification].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente + extensiones)

### Derivadas del doc fuente (§11)

- **Q1A.1** (§11.1): ¿Las preferencias de cuadricula (`cuadricula.*`) son **por usuario**, **por modelo** o **por sesión**? Impacta HU-1A.014.
- **Q1A.2** (§11.2): Semántica exacta de `Scale Factor` — ¿multiplicador de ampliacion o independiente? Impacta HU-1A.013.
- **Q1A.3** (§11.3): ¿La exportación PDF/SVG **siempre** suprime la cuadricula aunque el usuario la tenga activa? Impacta HU-1A.014.

### Derivadas de HU del doc fuente

- **Q1A.4** (HU-1A.002): ¿`Fit to Text` implica pasar a `auto_sizing=true` si no lo estaba?
- **Q1A.5** (HU-1A.006): Estrategia exacta de protección del rótulo en manual — overflow visual, re-expansión forzada, ellipsis+tooltip, u otro.
- **Q1A.6** (HU-1A.008): ¿`width`/`height`/`auto_sizing` son por-apariencia (una por OPD) o por-entidad (una global)?
- **Q1A.7** (HU-1A.010): ¿Iman-a-cuadricula también aplica al redimension con handles, no solo al movimiento?

### Derivadas de las HU de extensión

- **Q1A.8** (HU-1A.015): ¿Existe multi-selección geométrica en la visión del modelador? ¿Comportamiento con modos mixtos de sizing?
- **Q1A.9** (HU-1A.016): ¿Se adopta `Shift` como modificador de aspect-ratio? ¿Interacción con iman-a-cuadricula y con auto-sizing?
- **Q1A.10** (HU-1A.017): Ancla de la alineación — ¿primer elemento seleccionado, promedio, o bounding box?
- **Q1A.11** (HU-1A.018): Distribución — ¿por centros o por bordes? ¿Interacción con cuadricula activa (priorizar uniformidad o iman)?

## Referencias cruzadas

- Doc fuente: `opcloud-reverse/1a-canvas-grid-resize.md`.
- Épicas relacionadas:
  - **EPICA-10** (creación de cosas): `thing.width`/`thing.height`/`thing.auto_sizing` se inicializan en la creación (HU-10.001, HU-10.002).
  - **EPICA-11** (modelado básico): selección múltiple es precondición para HU-1A.015, HU-1A.017, HU-1A.018.
  - **EPICA-12** (ampliacion): la cuadricula se justifica especialmente en in-ampliacion (§7.1 doc fuente).
  - **EPICA-14** (styling): `font-size`, wrapping y posición del texto conviven con redimension (§7.2 doc fuente).
  - **EPICA-20** (OPD tree): apariencia por OPD → persistencia por-apariencia (HU-1A.008).
  - **EPICA-30** (save/load): persistencia del tamaño entre sesiones.
  - **EPICA-60** (export PDF) y **EPICA-61** (export SVG): supresión de cuadricula en export (HU-1A.014).
  - **EPICA-80** (config usuario) y **EPICA-81** (config style defaults): ubicación de las preferencias de cuadricula.
  - **EPICA-90** (shortcuts): undo para alineación/distribución/redimension.
- Invariantes del repo:
  - `src/nucleo/tipos.ts` — Thing.apariencia con `width`/`height`/`auto_sizing`.
  - `src/render/jointjs/` — `drawCuadricula` y `elementTools` (handles).
  - `src/render/layout/` — respeta tamaño al posicionar (no recalcula en auto-layout salvo que se decida lo contrario).
  - `ssot/opm-visual-es.md` — debe definir convención V-xx para protección del rótulo (HU-1A.006) y para rendering de la cuadricula.
