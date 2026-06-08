# BUG-20260608T171552Z-17477a

**Creado**: 2026-06-08T17:15:52.960Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: Aplicada 2026-06-08. Verificación: `bun run check` 2333/0, `bun run lint` limpio, `bun run build` OK, `bun run design:governance` OK, mockup comparativo antes/después adjunto.

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
