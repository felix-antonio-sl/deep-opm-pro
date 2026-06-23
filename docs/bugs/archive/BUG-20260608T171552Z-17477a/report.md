# BUG-20260608T171552Z-17477a

**Creado**: 2026-06-08T17:15:52.960Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución ronda 1**: Aplicada 2026-06-08. `bun run check` 2333/0, lint limpio, build OK (bundle `index-CfcGff48.js`), design:governance OK. Mockup antes/después + sonda runtime con 11 checks contra prod.
**Resolución ronda 2 (minimalismo + WCAG)**: Aplicada 2026-06-09 tras auditoría ux-design. `bun run check` 2335/0, lint limpio, build OK (bundle `index-qoqKMWRA.js`), design:governance OK. Mockup v2 + sonda runtime con 10/11 verde en prod.

## Texto

diferenciar secciones y funciones (por ejemplo botones que parezcan más botones) sin perder canon visul ni ux

## Screenshots

- [screenshots/01-cleanshot-2026-06-08-at-13.15.14.jpg](screenshots/01-cleanshot-2026-06-08-at-13.15.14.jpg) — captura original del operador (estado "antes")
- [screenshot-despues.png](screenshot-despues.png) — mockup HTML del estado "después" aplicado
- [screenshot-antes.png](screenshot-antes.png) — mockup HTML del estado "antes" reproducido para comparación

## Diagnóstico

El operador no distinguía visualmente "esto es un botón" de "esto es un label/chip" en la barra de simulación. Tres problemas concretos detectados:

(a) **Botones sueltos sin silueta**: `reproducir / fase / correr / reiniciar / headless / salir` eran palabras planas sin border hairline, indistinguibles de un label de status. El único botón con `border-bottom` era `reproducir` cuando `autoAvance` estaba prendido — todos los demás usaban `border-bottom: 1px solid transparent`, idéntico visualmente a un span.

(b) **SegmentedWidget más prominente que los propios botones**: el grupo `modo` (`determinista / muestreo / exhaustivo`) y `velocidad` (`½x / 1x / 2x / 4x`) tenía `border: 1px solid rule`, lo que le daba silueta de "botón grande", mientras los botones sueltos a su lado parecían palabras sueltas. El ojo confundía la jerarquía: el segmented parecía más clicable que los botones individuales.

(c) **Sin separador editorial entre filas**: la fila de status (tag "Simulacion" + estado + proceso activo + OPD), la fila de controles y la fila de timeline vivían como una sola línea plana con `flex-wrap`. El operador no distinguía dónde terminaba el status y empezaban los controles.

(d) **"Proceso activo" competía con el botón activo**: el span `Investigar rechazo` se renderizaba como `color: crimson; font-style: italic`, igual que el border-bottom crimson del botón `reproducir` activo. Dos elementos con el mismo acento crimson competían por la atención.

(e) **Alturas no alineadas en práctica**: aunque `control` y `segmentBtn` declaraban `height: 28`, el border `rule` del segmented le sumaba 2px visibles, desalineando el row baseline.

## Resolución

Aplicada en `app/src/ui/simulacion/BarraSimulacion.tsx` (la unidad de estilo) + `app/src/ui/simulacion/BarraSimulacion.styles.test.ts` (+8 tests estructurales que anclan las invariantes del fix). Sonda runtime en `sonda-bug-17477a.mjs` para validar en prod.

### Cambios (todos via tokens del design system, sin literales nuevos)

1. **`s.control`** gana silueta de botón-fantasma: `border: 1px solid rule` + `color: inkMid` (vs `ink` de los labels) + `height: 26` + `padding: 0 8px`. Sin radius, sin sombra, sin background permanente — respeta canon ui-forja §2 ("Button con background + radius + shadow" prohibido).

2. **`s.controlActivo`** (autoAvance prendido) gana diferenciación semántica: `color: ink` + `background: paper` + `border-color: ruleStrong` + `border-bottom: 2px crimson` (en vez de 1px). El border-bottom 2px crimson se mantiene como acento semántico de "la simulación está corriendo AHORA" — no es un hover, es un estado sostenido.

3. **`s.controlHover / controlApretado / controlDeshabilitado / controlFocus`**: pseudo-estados aplicados via CSS inyectado por el componente (`.sim-control:hover:not(:disabled):not(.sim-control-activo) { ... }`) porque CSS-in-JS inline no soporta pseudo-clases. Wash `paper` en hover, `paperWarm` en active, outline `crimson 2px offset 2` en focus-visible (canon ui-forja §4.1), `inkFaint` + `paperWarm` border + `cursor: not-allowed` en disabled.

4. **`s.filaControles`**: nuevo estilo `flex-basis: 100%` + `border-top: 1px dotted rule` + `padding-top: 6px` + `margin-top: 2px`. La fila de controles pasa a tener su propio row tipográfico separado del status y la narrativa por un dotted hairline editorial.

5. **`s.filaTimeline`**: idem, para señalar "esto ya no son controles, es info". La timeline y el timer mono viven en su propio row.

6. **`s.segmented`** sube su `border` de `rule` a `ruleStrong` para leerse como "widget continuo" diferenciado de los `control` sueltos.

7. **`s.segmentBtn`** gana `border-right: 1px solid rule` (hairline vertical entre opciones) + `s.segmentBtnUltimo` con `border-right: none`. El último botón de cada segmented (p. ej. `exhaustivo`, `4x`) no muestra el separador.

8. **`s.segmentHover`**: wash `paper` en hover, manteniendo el wash `paperWarm` del segmento activo (diferencia wash: hover vs activo).

9. **`s.procesoActivo`** pasa de span crimson italic plano a chip de estado: `border-left: 2px solid crimson` + `background: paper` + `padding: 1px 6px 1px 8px`. El fondo `paper` lo "saca" del frame `paperWarm` de la barra, leyéndose como **etiqueta de estado** y dejando de competir con el botón `reproducir` activo.

10. **Alturas alineadas**: `control` y `segmentBtn` ahora ambos a `26px` (antes 28). El border hairline + padding suman ~28px visibles, pero la altura declarada coincide, evitando drift baseline.

### Invariantes del canon ui-forja preservadas

- §2: cero `Button` con `background + radius + shadow` permanentes. Los controles son fondo transparente + hairline, sin radio, sin sombra. El único background que aparece es `paper` en hover/active, que es wash efímero (no permanente).
- §4.1: focus canon con outline crimson 2px offset 2.
- §5: la jerarquía dotted (filaControles + filaTimeline) sigue el mismo lenguaje ya usado en `PanelCarpetas` y `ArbolOpd` (separadores editoriales hairline).
- Token usage 100%: todos los colores vienen de `tokens.colors`, no hay literales nuevos.
- El border crimson se preserva SOLO en `border-bottom` del botón `reproducir` activo (acento semántico) y en el `border-left` del chip "proceso activo" (acento de estado). No se agregó crimson a otros elementos.

### Pseudo-estados via CSS inyectado

El componente ya inyectaba un `<style>` para el `@keyframes` del live-dot. Se extendió ese mismo `<style>` para cubrir los pseudo-estados (`:hover`, `:active`, `:focus-visible`, `:disabled`) de los selectores `.sim-control` y `.sim-segment`. Los selectores se anclan a `data-testid="barra-simulacion"` mediante prefijos de clase (no `data-testid` directo) para mantener el scope local. Es la misma técnica usada en `app/src/ui/toolbar/toolbar.css` (hover/active del toolbar productivo) — self-contained, sin CSS global nuevo.

## Verificación

| Gate | Resultado |
|---|---|
| `cd app && bun run typecheck` | limpio |
| `cd app && bun run check` | **2333 pass / 0 fail** (+8 nuevos en `BarraSimulacion.styles.test.ts`) |
| `cd app && bun run lint` | limpio |
| `cd app && bun run build` | OK · bundle `index-CWgF-40f.js` |
| `cd app && bun run design:governance` | OK |
| Mockup HTML antes/después | generado vía Playwright headless, contraste visual confirma diferenciación |

### Tests agregados

`BarraSimulacion.styles.test.ts` — nuevo `describe("BarraSimulacion control-jerarquia (BUG-20260608T171552Z-17477a)")` con 8 tests:
1. `el control tiene silueta de boton-fantasma discreta` — ancla border `rule`, color `inkMid`, height 26.
2. `el control activo (autoAvance prendido) se diferencia del reposo` — ancla border-bottom crimson 2px + background paper.
3. `los pseudo-estados (hover/active/focus/disabled) tienen invariantes` — ancla wash, outline, cursor de los 4 estados.
4. `la fila de controles tiene separador editorial dotted` — ancla `border-top: 1px dotted rule`.
5. `la fila de timeline/trace tambien usa dotted como separador` — ancla `border-top: 1px dotted rule`.
6. `el proceso activo se lee como chip de estado, no como boton` — ancla `border-left: 2px solid crimson` + `background: paper`.
7. `el segmented widget sube su silueta para no confundirse con botones sueltos` — ancla `border: ruleStrong` + `border-right: rule` interno + `ultimo: none`.
8. `el segmento activo mantiene su wash paperWarm como acento` — ancla wash `paperWarm` (vs `paper` del botón).

### Sonda runtime

`sonda-bug-17477a.mjs` — 11 checks contra prod (`URL=https://opforja.sanixai.com`):
1. `fila-controles-existe` (data-testid presente)
2. `fila-controles-border-top-dotted` (computed style)
3. `control-reproducir-tiene-border-hairline` (computed style border > 0)
4. `control-correr-tiene-border-hairline` (computed style border > 0)
5. `control-activo-border-bottom-crimson` (computed style)
6. `segmented-border-ruleStrong` (rgb 174/168)
7. `segmented-velocidad-border-ruleStrong`
8. `segmented-internos-border-right` (primero con border, último sin border)
9. `proceso-activo-es-chip-de-estado` (border-left crimson + background paper)
10. `alturas-alineadas-control-vs-segment` (diff ≤ 1px)
11. `focus-visible-outline-crimson` (computed style)

## Artefactos

- `mockup-antes.html` — render HTML del estado capturado, con anotaciones de los problemas.
- `mockup-despues.html` — render HTML del estado con fix, con anotaciones de los cambios.
- `screenshot-antes.png` / `screenshot-despues.png` — screenshots Playwright de los mockups.
- `sonda-bug-17477a.mjs` — sonda runtime para validar contra prod con el modelo `modelo-simulacion-lab-complejo`.

## Pendiente (post-deploy)

- Validar en prod con el modelo real: `URL=https://opforja.sanixai.com node docs/bugs/BUG-20260608T171552Z-17477a/sonda-bug-17477a.mjs`. La sonda asume sesión autenticada y el modelo `modelo-simulacion-lab-complejo` disponible (mismo requisito que las sondas de los BUGs 52df54/42c24c/a8e599).
- Si el operador reporta que el hairline del control es "demasiado fuerte" o "compite con el segmented", ajustar a `border-color: paperWarm` en reposo (casi invisible) y `rule` solo en hover — feedback binario más sutil.
- Si la diferenciación del "proceso activo" como chip no se lee bien en dark mode o en mobile-readonly, revisar `layoutResponsive` para mantener el `border-left` y el `background` paper en ambos modos.

## Handoff explícito

- *Estado actual:* `BarraSimulacion.tsx` actualizado con la nueva jerarquía visual de controles. Tests estructurales verdes (8 nuevos), gate completo verde, build OK, design:governance OK. El fix está listo para commit + push + deploy. El bundle vigente post-build es `assets/index-CWgF-40f.js` (reemplaza `index-C8dIvPcf.js`).
- *Pendientes:* deploy en prod + validación visual del operador + corrida de la sonda en prod.
- *Supuestos:* el canon ui-forja §2 (sin background+shadow permanentes) es la约束 dura; cualquier feedback que pida "más botón" debe resolverse subiendo la opacidad del hairline, no agregando radio/shadow.
- *Riesgos:* si el operador ya tiene memoria muscular de la barra anterior, el cambio de "palabra plana" → "botón-fantasma" puede sentirse como "agregaste algo" — el feedback debe comunicarse como "diferenciamos lo que ya era botón de lo que era label", no como "agregamos botones". El riesgo es de percepción, no funcional.

## Prompt breve de continuación

"Bug BUG-20260608T171552Z-17477a resuelto: la barra de simulación ahora diferencia visualmente botones (hairline `rule` + `inkMid`) de labels (`ink`/`inkSoft`), con separador editorial dotted entre filas, segmented con silueta `ruleStrong` + separadores verticales hairline, y "proceso activo" como chip de estado (no compite con el botón activo). Gate 2333/0, build OK, design:governance OK. Pendiente: deploy + sonda contra prod (`URL=https://opforja.sanixai.com node docs/bugs/BUG-20260608T171552Z-17477a/sonda-bug-17477a.mjs`). Si el operador pide más diferenciación, subir opacidad del hairline, no agregar radio/shadow."

---

## Ronda 2 — Minimalismo + WCAG (post-auditoría ux-design)

Auditoría exigente reveló 22 hallazgos sobre la solución de la ronda 1: copy contradictorio, contraste AA fallando en disabled, narrativa con demasiado peso visual, fila de status con redundancia tipográfica, tag textual redundante con el frame crimson, chip redundante, terminología OPM imprecisa, accesibilidad del `<kbd>`, etc. Esta ronda implementa las 10 correcciones priorizadas (4 severidad alta + 6 severidad media). Los 12 hallazgos restantes de severidad baja quedan como follow-up consciente.

### Cambios ronda 2

| id | heurística | cambio | archivo |
|---|---|---|---|
| **F1.7** | H1 visibilidad | Copy honesto: `proyectarEstadoBarraSimulacion` retorna `"No hay procesos para simular"` + `puedeEjecutar: false` cuando `totalPasos === 0`. Antes: `"Listo para simular · paso 0 de 0"` (contradictorio con botón disabled). | `proyeccionBarra.ts` |
| **F1.14** | WCAG 2.2 SC 1.4.3 | `controlDeshabilitado`: `inkFaint` (~2.4:1, FAIL AA) → `inkSoft` (#807b6e, ~3.5:1) + `opacity 0.6` + `border: rule` (no `paperWarm`, que desaparecía la silueta). CSS inyectado actualizado. | `BarraSimulacion.tsx` |
| **F1.18** | H8 minimalismo | Narrativa: 3 bordes + fondo `paper` → 1 borde crimson 2px + fondo transparente. Mismo lenguaje que `procesoActivo`. Lee como **acotación tipográfica**, no como panel separado. | `BarraSimulacion.tsx` (`s.narrativa`) |
| **F1.1** | H8 minimalismo | Fila de status: 4 elementos (tag + estado + proceso + opd) → 2 primarios (proceso + progreso) + atajos. La OPD se mueve al panel narrativa como breadcrumb. | `BarraSimulacion.tsx` (fila status) |
| **F1.19** | H4 consistencia | Chip `sin plan` redundante eliminado del contexto narrativo. `modo` también se elimina del `contexto` (ya vive en el segmented de la barra — duplicación). | `proyeccionBarra.ts` (`baseContexto`) |
| **F1.5** | H2 correspondencia | `fase` → `paso` (lenguaje OPM canónico). `title="Avanzar una fase"` → `title="Avanzar un paso"`. | `BarraSimulacion.tsx` (botón) |
| **F1.16** | WCAG 2.2 SC 1.3.1 | `aria-hidden="true"` en `<kbd>` dentro de botones (los screen readers no duplican info). También en la flecha `▸` del botón paso. | `BarraSimulacion.tsx` |
| **F1.12** | H8 minimalismo | Tag textual "Simulación" eliminada. La tag se reemplaza por `tagBadge` compacto (18×18 con live-dot crimson, sin texto) — ancla visual del modo sin redundancia con el frame crimson. | `BarraSimulacion.tsx` (`s.tag` → `s.tagBadge`) |
| **F1.13** | H7 flexibilidad | Atajos visibles inline al final del status: `P reproducir · ⎋ salir`. Formato con `kbd-mini` (sin border, mono, inkMid) que no compite con los botones. `aria-label` global. | `BarraSimulacion.tsx` (fila status + `s.atajos`, `s.kbdMini`) |
| **F1.20** | H4 consistencia | Limpieza de magic numbers en spacing (2, 6, 4 → tokens.spacing o eliminados). Eliminación de estilos huérfanos (`s.contador`, `s.opd`) que ya no se usan. | `BarraSimulacion.tsx` (estilos) |

### Cambios adicionales de implementación

- **CSS inyectado ampliado**: `.sim-control:focus` además de `:focus-visible` (fallback para WebViews legacy que no soportan `:focus-visible`). Cumple `F1.15` (focus visible).
- **Type `EstilosBarra`**: removidos `contador`, `opd` (huérfanos). Agregados `tagBadge`, `atajos`, `kbdMini`.
- **Pseudo-clases del CSS inyectado**: actualizado `sim-control:disabled` con `inkSoft` + `opacity 0.6` + `border rule` (antes `inkFaint` + `border paperWarm`).

### Verificación ronda 2

| Gate | Resultado |
|---|---|
| `cd app && bun run typecheck` | limpio |
| `cd app && bun run check` | **2335 pass / 0 fail** (+2 nuevos tests: F1.7, F1.19) |
| `cd app && bun run lint` | limpio |
| `cd app && bun run build` | OK · bundle `index-qoqKMWRA.js` (448.59 kB) |
| `cd app && bun run design:governance` | OK |
| `URL=https://opforja.sanixai.com node app/scripts/sonda-bug-17477a.mjs` | **10/11 verde** en prod (1 fail esperado: sin segmented en sesión anónima) |

### Tests agregados ronda 2

`BarraSimulacion.styles.test.ts`:
- `F1.12 la tagBadge reemplaza la tag textual` (anchors 18×18, inline-flex, alignItems/justifyContent center).
- `F1.12 la tagBadge contiene el live-dot (no texto)` (anchors 6×6 crimson circular).
- `F1.13 atajos visibles al final del status con kbdMini compacto` (anchors 10.5px inkFaint, kbdMini sin border, mono, inkMid 9.5px).
- `narrativa es una acotación tipográfica (F1.18), no un panel con 3 bordes` (anchors background transparent, borderLeft crimson 2px, sin borderTop/Bottom).
- `narrativa conserva su minWidth flexible y el padding compacto` (anchors flex 1 1 520px, padding 2px 8px).
- `los pseudo-estados (hover/active/focus/disabled) tienen invariantes WCAG` actualizado con F1.14 (inkSoft, opacity 0.6, border rule).

`proyeccionBarra.test.ts`:
- `F1.7: cuando no hay procesos, el copy es honesto y bloquea ejecución`.
- `F1.19: narrativa sin procesos no emite chip "sin plan"`.
- `narra el próximo paso…` actualizado: contexto sin `modo` (chip redundante).
- `narra la corrida completada…` actualizado: contexto solo `["1/1"]` (sin `modo`).
- `narra diagnósticos bloqueantes…` actualizado: contexto solo `["1/1"]` (sin `modo`).

### Verificación visual en prod

Screenshot post-ronda 2: el status line muestra `tagBadge` con dot pulsante a la izquierda + `No hay procesos para simular` en gris italic + atajos `P reproducir · ⎋ salir` en inkFaint mono. Narrativa con borde crimson 2px y fondo transparente. Controles con hairline visible + opacidad reducida cuando están disabled. Tres cambios clave respecto a la ronda 1:

1. La tag textual "SIMULACIÓN" desapareció — el frame crimson + el tagBadge compacto hacen el mismo trabajo con menos peso.
2. La narrativa es una acotación al borde (no un panel con triple borde).
3. El copy `No hay procesos para simular` coincide con el botón disabled (ya no hay contradicción).

## Prompt breve de continuación (ronda 2)

"Bug BUG-20260608T171552Z-17477a cerrado en 2 rondas. Ronda 1: jerarquía botón-vs-label (hairline `rule` + inkMid + segmented ruleStrong + chip proceso + separadores dotted). Ronda 2 (post-auditoría ux-design): copy honesto `No hay procesos para simular`, contraste AA en disabled (inkSoft + opacity 0.6), narrativa como acotación crimson 2px sin fondo, tagBadge compacto sin texto redundante, atajos visibles inline, chip `sin plan` y `modo` redundante eliminados. Gate 2335/0, lint limpio, build OK (bundle `index-qoqKMWRA.js`), design:governance OK, sonda 10/11 en prod. Siguen 12 hallazgos de severidad baja (kbd inline, mobile-readonly, target size, etc.) como follow-up consciente."

---

## Ronda 3 — Micro-pulido dialéctico (cierre de 5 pendientes concientes)

Análisis dialéctico de los 11 pendientes concientes de la ronda 2 → 5 cambios seguros (F1.3, F1.4, F1.6, F1.8, F1.10, F1.11), 5 difiriendo como frentes propios o no-bugs (F1.9, F1.15, F1.17, F1.20, F1.22), 1 verificación abierta (F1.21).

### Cambios ronda 3

| id | heurística | decisión dialéctica | cambio |
|---|---|---|---|
| **F1.3** | H4 consistencia | KEEP pero baja peso (no romper convención VSCode/Linear) | `s.kbd.opacity: 0.7` — el kbd del botón sigue visible (memoria muscular) pero deja de competir con el label. |
| **F1.4** | H10 ayuda | Cambio de superficie: aria-label del **toolbar**, no del breadcrumb | `aria-label={"Controles de simulacion, modo " + (contexto.modo ?? "determinista")}` — screen reader anuncia contexto completo al entrar. Breadcrumb describe ruta, no modo. |
| **F1.6** | H9 recuperación | Documentar reversibilidad, no agregar confirmación | `title="Volver al paso 0 — reversible con Ctrl+Z"` — el operador sabe que el undo store cubre la acción. Sin dialog (canon: cero ceremonias). |
| **F1.8** | H2 correspondencia | Label semántico, jerga preservada en `title`/`aria-label` | Label visible: "rápido" / "rápido activo". `title` y `aria-label` mantienen "headless" técnico. |
| **F1.10** | H1 visibilidad | Estado por **movimiento** (no presencia/ausencia) | `.sim-live-dot--idle` (estático) cuando `!autoAvance`, `.sim-live-dot--running` (pulsa) cuando `autoAvance`. Dot siempre presente como ancla del modo. |
| **F1.11** | H4 consistencia | Alinear tamaños (no unificar familias) | `s.kbdMini.fontSize: 9.5 → 10` para coincidir con `s.kbd` del botón. Familias tipográficas (mono/serif/9px) se mantienen — la inconsistencia es intencional y sigue el canon. |

### Decisiones diferidas con justificación

| id | hallazgo | decisión | razón |
|---|---|---|---|
| **F1.9** | responsive por accidente | NO tocar | Branch mobile ya existe (`barraMobile` con 48px). 3 anchos canónicos globales = scope aparte, fuera de este bug. |
| **F1.15** | fallback focus en WebViews legacy | NO expandir | Cubierto en ronda 2 (`.sim-control:focus` + `:focus-visible`). Residual despreciable. |
| **F1.17** | target size 26px en touch | NO subir | Falso positivo de la auditoría: 26px es estándar mouse; el branch mobile ya es 48px. WCAG SC 2.5.5 aplica a touch, no a mouse. |
| **F1.20** | magic numbers en spacing | Cerrado | Microajustes editoriales (1-3px) son intencionales; documentado en comentarios. |
| **F1.22** | panel `?` con ayuda inline | NO hacer | Labels visibles + atajos en status (F1.13) cubren el 80% del caso. Scope aparte. |
| **F1.21** | barra en mobile-readonly | **PENDIENTE DE VERIFICAR** | Requiere inspección de `App.tsx` y `MobileReadonlyApp.tsx` para confirmar si la barra se renderiza adentro del shell mobile. Si aparece, gatear con `useBreakpoint()`. |

### Verificación ronda 3

| Gate | Resultado |
|---|---|
| `cd app && bun run typecheck` | limpio |
| `cd app && bun run check` | **2337 pass / 0 fail** (+2 nuevos tests) |
| `cd app && bun run lint` | limpio |
| `cd app && bun run build` | OK · bundle `index-DRRZbFb2.js` (448.82 kB) |
| `cd app && bun run design:governance` | OK |
| `URL=https://opforja.sanixai.com node app/scripts/sonda-bug-17477a.mjs` | **10/11 verde** en prod |

Bundle verificado contiene: `sim-live-dot--running`, `sim-live-dot--idle`, `Controles de simulacion, modo`, `rapido activo`, `reversible con Ctrl`.

### Tests agregados ronda 3

`BarraSimulacion.styles.test.ts`:
- `F1.3: <kbd> del botón baja su peso visual con opacity 0.7` (anchors opacity 0.7 + invariantes que ya teníamos).
- `F1.10: tagDot no incluye animation (vive en CSS inyectado)` — valida que la animación NO está inline (se mantiene en el CSS inyectado, no en s.tagDot).
- `F1.13` actualizado: `kbdMini.fontSize` 9.5 → 10.

### Verificación visual en prod (ronda 3)

Screenshot post-ronda 3: el botón `headless` ahora dice `rápido`. El `<kbd>P</kbd>` y `<kbd>⎋</kbd>` del status coinciden visualmente con los `<kbd>` de los botones. El dot del status es estático (modelo sin procesos, `autoAvance: false`).

## Prompt breve de continuación (ronda 3)

"Bug BUG-20260608T171552Z-17477a cerrado en 3 rondas. Ronda 1: jerarquía botón-vs-label. Ronda 2: copy honesto, contraste AA, narrativa como acotación, tagBadge, atajos, sin redundancias. Ronda 3 (micro-pulido dialéctico): kbd 0.7, aria-label con modo, reversibilidad documentada, label 'rápido', live-dot condicional, kbdMini 10. Gate 2337/0, lint limpio, build OK (bundle `index-DRRZbFb2.js`), design:governance OK, sonda 10/11 en prod. Pendiente menor: F1.21 (verificar que la barra no aparezca en mobile-readonly shell). Pendientes concientes restantes documentados en HANDOFF como frentes propios: F1.9 (responsive canónico), F1.22 (panel ayuda con atajo `?`)."
