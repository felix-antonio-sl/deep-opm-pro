# L4 — CANON-V3 canvas re-piel (Codex)

> **Ronda Codex** · Base `a4b8abf` · Ola 0 (paralelo con L1, sin bloqueo). Lee primero el [`README.md`](README.md) de la ronda. Esta línea vive **fuera del chrome**: solo toca el adaptador JointJS desechable. No reabre backlog HU.

---

## 1. Misión

Aplicar la apariencia **Codex** (editorial / type-led / liso) a shapes, links, markers y highlighters de JointJS. **Re-piel SIN tocar routing.** Conservas `proyeccion.ts`, `opcloudRouting.ts`, `mapa/proyeccion.ts`, anchors, conectores, puertos y multiplicidad OPCloud **intactos**. Cambias **solo presentación**: colores, strokes, fills, fuentes de etiquetas, grid off, markers por tipo de enlace, highlighter de selección (underline crimson).

**NO** adoptas los conectores rectos del handoff (`defaultConnector: 'straight'`, `defaultRouter: 'normal'` de `08 §0`): eso cruzaría a lógica de routing y es propiedad del router OPCloud que esta línea **lee, no edita**. El handoff §0 lista esas opciones como "checklist de comportamiento que tú decides" — y la decisión del proyecto ya está tomada: routing OPCloud Manhattan se queda.

---

## 2. HU base

| HU | Path absoluto | Aporte a esta línea |
|---|---|---|
| HU-14.002 — Cambiar color de relleno de una cosa con paleta | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-14-canvas-styling.md` | La re-piel Codex debe convivir con overrides existentes de `apariencia.estilo.fill`. |
| HU-14.003 — Cambiar color de borde de una cosa con paleta | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-14-canvas-styling.md` | El stroke canónico por clase no elimina overrides de borde. |
| HU-14.004..007 — Tipografía y color del rótulo | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-14-canvas-styling.md` | Labels pasan a Inria/ink sin romper el contrato de estilo visual del rótulo. |
| HU-14.015 — Resetear estilo al defecto | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-14-canvas-styling.md` | El default post-reset será CANON-V3, preservando semántica. |
| HU-11.016 — Ajustar estilo visual del enlace en diálogo de propiedades | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-11-canvas-modelado-basico.md` | Markers/strokes Codex no pueden romper estilos de enlace editables. |
| HU-1A.006 — Proteger rótulo contra compresión excesiva | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-1a-canvas-grid-resize.md` | Refuerza V-212: sin truncamiento silencioso en etiquetas de símbolos. |
| HU-81.012 — Fijar default de estilo por clase | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-81-config-defaults-estilo.md` | CANON-V3 es el default visual por clase, no una mutación semántica. |

**Contrato Codex + SSOT:**

Fuente de verdad estética: [`ui-forja/08-jointjs-styling.md`](../../../ui-forja/08-jointjs-styling.md) **completo**, más `ui-forja/01-design-spec.md §3.2` (canon OPM) y `§7` (strokes). Reglas SSOT/contrato que respaldan cada cambio:

- **V-63 (colores OPM)** — `08 §1/§2/§3`, `01 §3.2`. Objeto borde verde `#3a6b4d`, proceso borde azul `#26467a`, estado borde oliva `#7e8338` + fill `#ece9e1`, enlaces negro `#171511`. **Los colores codifican CLASE, no decoran.** No se elimina el canal cromático (regla de oro #1 del proyecto + V-63).
- **V-209 (igualdad de clase)** — todos los símbolos de una misma clase OPM comparten exactamente el mismo stroke/fill base. El color discrimina clase; nada más lo altera salvo override de usuario (`apariencia.estilo`).
- **V-211 / V-212 (etiquetas)** — fuente serif Inria en labels (`08 §1.label`); `textWrap.ellipsis: false` **siempre**. Sin truncamiento silencioso: el shape expande o rechaza resize, nunca recorta con `…`.
- **V-203 (crimson UI exclusivo)** — `#8e2a2e` es canal UI: highlighters de selección/hover, vertices markers, marquee. **Nunca** semántica OPM. Ningún shape OPM usa crimson en su borde/fill base.
- **`08 §14` (lo que JointJS NO debe hacer)** — sin `drawGrid: true`, sin `filter: dropShadow` decorativo, sin `rx/ry` en objeto, sin smooth/rounded connector con radio grande.
- **`08 §5.3`** — sin glow / sin shadow: Codex es liso.

> Ante conflicto Codex↔SSOT, **manda la SSOT** (`/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`). La auditoría `ui-forja/06-ssot-compliance.md` ya verificó que Codex no la contradice.

---

## 3. Anclaje a evidencia (estado actual CANON-V2)

La paleta vigente es **CANON-V2 Bauhaus** (Ronda 28 L4). Su definición central y los puntos donde está hard-codeada:

| Qué | Archivo:línea | Valor actual V2 → objetivo Codex |
|---|---|---|
| **Tabla central de tokens canvas** | `app/src/modelo/constantes.bauhaus.ts:25-113` (`CANON_V2`) | objeto `fill #EFF7EB` / stroke `#0A0A0A`; proceso `fill #E8F0F8`; estado `fill #FAFAFA`; enlace `#0A0A0A`; `fondoCanvas #FAFAFA`; `cuadriculaDots #D2D2D2`; `strokeWidth: 2`; fuente Inter Tight/JetBrains Mono. **→** borde verde/azul/oliva + **fill transparent** (objeto/proceso), estado fill `#ece9e1`; enlace `#171511`; paper `#fafaf8`; strokes 1.5/1.5/1.2/1; serif Inria. |
| **Shim de aliasing** | `app/src/modelo/constantes.ts:33-52` (`CANON`) | re-exporta `CANON_V2`; `dims.enlaceVisible = CANON_V2.strokeWidth (2)`; `fontFamily/fontSize/fontWeight` Bauhaus. |
| **Paleta interacción (paper bg / selección)** | `app/src/render/jointjs/palette.ts:18-22` | `background = CANON_V2.fondoCanvas`; `seleccion = #C8392F`. |
| **Stroke/fill de objeto+proceso (consumidor)** | `app/src/render/jointjs/composers/entidad.ts:37-90` | `stroke = …?? CANON.colores.enlace` (ink, no color de clase); `fill = entidad.tipo==="objeto" ? CANON.colores.objeto : CANON.colores.proceso` (fills lavados); `rx:4,ry:4` en objeto (l.110). |
| **Cápsulas de estado** | `entidad.ts:496-573` + `composers/estados.ts:108-118` | fill `CANON.colores.relleno`, stroke ink, `rx:8`; markers default/current (`↗`/`●`). |
| **Markers por tipo de enlace** | `app/src/render/jointjs/linkAssets.ts:29-147` | `INK="#0A0A0A"`, `PAPER="#FAFAFA"`, `MARKER_STROKE_WIDTH=2`; swallowtail consumo/resultado/efecto, lollipop agente/instrumento, rombo invocación, triángulos estructurales. |
| **Composición markers estructurales** | `composers/markers.ts:28-115` | `stroke = CANON.colores.enlace`; `strokeWidth = CANON.dims.enlaceVisible` (2). |
| **Custom shape (arco abanico)** | `app/src/render/jointjs/customShapes.ts:13-28` | stroke `CANON_V2.enlace.stroke`, `strokeWidth 1.5`. |
| **Halos selección/hover/sim** | `composers/halos.ts` (selección l.11-50 usa `jointCanvasPalette.seleccion`; sim verde `#16a34a` l.119, ámbar `#f59e0b` l.213). | selección = underline crimson (no halo de borde envolvente). |
| **Config del Paper (grid + background)** | `app/src/render/jointjs/jointCanvasAdapter.ts:43-45` (`gridSize:10`, `drawGrid:true`, `background: jointCanvasPalette.background`) + `JointCanvas.tsx:712` (`background: jointCanvasPalette.background`). | `drawGrid:false`; background paper Codex. |
| **Grid composer (dibuja mesh)** | `composers/grid.ts:10-22` | activa `mesh`; con `config.activa=false` ya hace `clearGrid()`. |
| **CSS de vertices/tools/cápsulas** | `app/src/render/jointjs/jointjs.css` (vertex `#c8392f` l.8-13; cápsulas estado l.45-82). | crimson Codex `#8e2a2e`; resto coherente. |

### Markers / SVG reciclables (regla de oro #2 — revisión hecha)

`assets/svg/links/` contiene la familia OPCloud canónica **ya extraída** (no inventar nada): procedural (`agent.svg`, `instrument.svg`, `consumption.svg`, `result.svg`, `effect.svg`, `invocation.svg`, excepciones temporales `overtimeexception/underTime/underOver.svg`, relaciones `uni/bidirectionalRelation.svg`, variantes condición/evento/negación) + structural (`aggregation.svg`, `exhibition.svg`, `generalization.svg`, `classification.svg`) + logical (`or.svg`, `xor.svg`). `linkAssets.ts` **ya normalizó** estos SVG a paths de marker JointJS — **reciclas esos paths tal cual** y solo cambias `fill/stroke/strokeWidth`. `docs/JOYAS.md §5/§13` documenta el swallowtail, el círculo lollipop (`<image>` href a `agent.svg`) y el triángulo `getTriangleSVG()` 30×30. No hay marcador Codex que no tenga ya su silueta en estos insumos: el mapeo §4.2 del handoff (arrow simple / arrow doble / triángulo fill / cuadrado outline / triángulo outline / lollipop lleno-hueco / rombo) **coincide** con la batería existente. Reciclaje declarado: **100% de markers**; solo cambian atributos de pintura.

---

## 4. Archivos permitidos (OWNER de `src/render/jointjs/**`)

Eres **OWNER** de todo `app/src/render/jointjs/**` **excepto** los tres archivos de routing/proyección que son **LECTURA**. Editables:

```
app/src/render/jointjs/composers/entidad.ts       # stroke/fill por clase, rx→0, label serif
app/src/render/jointjs/composers/estados.ts        # ESTADOS (radius/fontSize) si aplica
app/src/render/jointjs/composers/markers.ts        # fill/stroke/strokeWidth markers estructurales
app/src/render/jointjs/composers/halos.ts          # highlighter selección → underline crimson
app/src/render/jointjs/composers/grid.ts           # ya soporta off; verificar
app/src/render/jointjs/composers/colores.ts        # contraste de texto (revisar para fill transparent)
app/src/render/jointjs/customShapes.ts             # stroke arco abanico
app/src/render/jointjs/linkAssets.ts               # INK/PAPER/MARKER_STROKE_WIDTH + markerFill
app/src/render/jointjs/palette.ts                  # background/seleccion Codex
app/src/render/jointjs/jointCanvasAdapter.ts       # drawGrid:false (l.44)
app/src/render/jointjs/JointCanvas.tsx             # background (l.712) — SOLO el attr de paper
app/src/render/jointjs/jointjs.css                 # crimson Codex, coherencia
app/src/render/jointjs/constantes.codex.ts         # NUEVO (ver §10)
```

Editables también, si lo exige el cambio de pintura: `composers/plegado.ts`, `labelText.ts`, `labelLayout.ts`, `rutaLabels.ts` (solo attrs de fuente/color de label).

**LECTURA (cabecera leída, frontera confirmada):**
```
app/src/render/jointjs/proyeccion.ts        # orquestador: compone composers, no pinta
app/src/render/jointjs/opcloudRouting.ts    # router Manhattan + obstáculos — NO TOCAR
app/src/render/jointjs/mapa/proyeccion.ts   # proyección del mapa-sistema — NO TOCAR
```

**Fuera de scope total:** `src/store/**`, `src/modelo/**` (incluye `modelo/constantes*.ts` — ver §10), `src/opl/**`, `src/serializacion/**`, `src/persistencia/**`, `src/leyes/**`, `src/ui/**`, `src/ui/tokens.ts` (OWNER L1, solo lectura).

---

## 5. Restricciones de no-colisión (frontera dura)

- **No cruzas a routing.** `opcloudRouting.ts`, los anchors (`ANCLAS_RELOJ_ENLACE`, `puertoRelativoAnclaEnlace`), los puertos (`portsEntidad`, `puertosTrianguloEstructural`), el `restrictTranslate` y el bloque `interactive(...)` del Paper son **comportamiento**: no se tocan. Si pintar un marker exige cambiar su geometría de anclaje → te detienes y reportas.
- **No tocas `modelo/constantes*.ts`.** Son `src/modelo/**` (kernel). El pivot de paleta se hace creando `constantes.codex.ts` **dentro de `src/render/jointjs/`** y redirigiendo imports en los composers (§10). El kernel sigue exportando `CANON/CANON_V2` para quien lo lea fuera del render.
- **No tocas `App.tsx` ni tokens.ts** (L2 / L1). Si necesitas el valor de un token Codex, hard-codéalo como hex en `constantes.codex.ts` (`08 §12` autoriza Opción A para arranque rápido sin bloquear por L1).
- **No editas `proyeccion.ts`.** Si un composer nuevo necesita ser registrado allí, es señal de que estás añadiendo lógica, no re-pintando → reportas.
- **`JointCanvas.tsx` solo el attr de background** (l.712). No tocar handlers, efectos ni montaje de tools.
- **El multiplicador/etiquetas de enlace** (labels de cardinalidad, modificadores `c`/`e`/`¬`) cambian solo fuente/color (serif Inria, `--cx-ink-mid`), nunca su posición ni su lógica de cálculo.

---

## 6. Slice mínimo shippeable (attrs por elemento)

### 6.1 Paper (apariencia, `08 §0`)
- `jointCanvasAdapter.ts:44`: `drawGrid: false`.
- `palette.ts`: `background` → paper Codex `#fafaf8`; `seleccion` → crimson `#8e2a2e`.
- `JointCanvas.tsx:712`: hereda el mismo background.
- **NO** tocar `gridSize`, `defaultConnector`, `defaultRouter`, `restrictTranslate`, `interactive`.

### 6.2 Objeto (`08 §1`, `01 §3.2/§7`)
```js
body:  { stroke: TOKENS.opmGreen /*#3a6b4d*/, strokeWidth: 1.5, fill: 'transparent', rx: 0, ry: 0 }
label: { fontFamily: 'Inria Serif, Georgia, serif', fontSize: 17, fontWeight: 400,
         fill: TOKENS.ink /*#171511*/, textWrap: { width: -16, ellipsis: false } }
```
En `entidad.ts`: el `stroke` base pasa de `CANON.colores.enlace` (ink) a **color de clase** (`opmGreen`/`opmBlue`); `fill` base pasa de fill lavado a `'transparent'`; quitar `rx:4/ry:4` (objeto cuadrado). El override `apariencia.estilo?.borderColor/fill` **sigue dominando**.

### 6.3 Proceso (`08 §2`)
```js
body:  { stroke: TOKENS.opmBlue /*#26467a*/, strokeWidth: 1.5, fill: 'transparent' }
label: { fontFamily: 'Inria Serif, …', fontSize: 17, fontWeight: 400, fontStyle: 'italic', fill: TOKENS.ink }
```
Clave: label de proceso en **italic** (refuerza OPL §1.7).

### 6.4 Estado (`08 §3`)
```js
body:  { stroke: TOKENS.opmOlive /*#7e8338*/, strokeWidth: 1.2, fill: TOKENS.stateFill /*#ece9e1*/, rx:'calc(h/2)', ry:'calc(h/2)' }
label: { fontFamily: 'Inria Serif, …', fontSize: 13, fontWeight: 400, fontStyle: 'italic', fill: TOKENS.ink }
```
En `entidad.ts` cápsulas (`attrsConEstados`) + `estados.ts`: stroke ink → oliva; fill paper → `stateFill`. Conservar geometría (stadium pill ya existe via `rx`), markers `↗`/`●` en ink (no semántica de clase).

### 6.5 Markers por tipo de enlace (`08 §4.2`)
Reciclar los paths de `linkAssets.ts`; solo cambiar `INK="#171511"`, `PAPER="#fafaf8"`, `MARKER_STROKE_WIDTH=1`. Mapeo §4.2 ↔ batería existente:

| §4.2 Codex | Asset/marker existente | Ajuste |
|---|---|---|
| Procedimental (consumo/resultado) — arrow simple | swallowtail `M0,0 L10,-5 L6,0 L10,5 z` | fill ink, stroke ink, sw 1 |
| Cambio de estado — arrow doble | (efecto bidireccional) source+target swallowtail | fill ink |
| Agregación — triángulo fill ink | `markers.ts` agregación default | fill ink, sw 1.2 |
| Exhibición — cuadrado outline | `markers.ts` exhibición + inner | fill paper / stroke ink |
| Generalización — triángulo outline | `linkAssets.generalizacion.markerFill = PAPER` | fill paper |
| Instanciación — círculo outline | clasificación (triángulo+dot) o lollipop hueco | fill paper |
| Agente — lollipop lleno | `procedural.agente.marker` | fill ink |
| Instrumento — lollipop hueco | `procedural.instrumento.marker` | fill paper / stroke ink |
| Invocación — rombo | `procedural.invocacion.marker` | fill paper / stroke ink |

> El handoff §4.2 lista "arrow simple" para procedimental, pero el proyecto conserva el **swallowtail canónico OPM/Dori §3.1** ya restaurado (`linkAssets.ts:53-80`): es más fiel a la SSOT que la flecha simple Codex → **manda la SSOT** (regla de oro #1). Documenta esta divergencia consciente; no la silencies.

Triángulos estructurales (`08 §9`): `strokeWidth 1.2`; agregación `fill ink`, generalización `fill transparent`.

### 6.6 Highlighter de selección (`08 §5.1`, V-203)
El estado actual usa **halo de borde envolvente** (`halos.ts:proyectarHaloSeleccion`, rect/ellipse alrededor del shape). Codex pide **underline crimson hairline bajo la etiqueta**, no redibujar el borde (mantiene V-63 visible):
```
stroke: #8e2a2e · strokeWidth: 1.2 · fill: none
trazado: línea horizontal bajo el label, ancho del bbox del label, 2px bajo el baseline
```
Implementación: convertir `proyectarHaloSeleccion` (y `…Estado`) de halo-rect a celda de línea/path crimson bajo el label, o highlighter custom. **Persistente mientras seleccionado.** Hover (`08 §5.2`): mismo underline a `opacity 0.5`, `strokeWidth 1`. **Sin glow/shadow** (`08 §5.3`): eliminar el `filter: drop-shadow` de cápsula en `jointjs.css:62`.

### 6.7 Vertices / marquee / tools (`08 §4.3/§6/§7`)
- `jointjs.css` vertex/segment: crimson `#8e2a2e`, stroke paper `#fafaf8`.
- Marquee (si existe en canvas/overlay): borde dashed crimson 1px + fill crimson 6%.
- Tools flotantes: outline 1px ink + fill paper + glifo Unicode (`08 §6.3`). No introducir `elementTools.Remove/Connect` (eso es lógica; no es tu scope crear tools nuevos).

### 6.8 Fuentes
Todas las etiquetas de símbolo y de enlace migran de Inter Tight / JetBrains Mono a **Inria Serif** (índices `o.01`/`p.01` y labels de enlace mono pueden seguir en JetBrains Mono per `08 §1.index`/§11). Tamaños per handoff (objeto/proceso 17, estado 13, label enlace 12 italic).

---

## 7. Tests

- **Unit de proyección que NO deben cambiar de comportamiento estructural**: `proyeccion.test.ts`, `composers/markers.test.ts`, `composers/enlace.test.ts`, `composers/entidad.test.ts`, `composers/estados.test.ts`, `composers/halos.test.ts`, `composers/colores.test.ts`, `composers/grid.test.ts`. Varios assertan **valores literales** (colores, strokeWidth, markers, `jointCanvasPalette.seleccion`, swallowtail paths). Esos asserts de pintura **sí** cambian (es el objeto del refactor) — actualízalos al nuevo canon Codex. Lo que **no** debe cambiar: estructura del cell (markup, selectores, z-index, endpoints, ports, anchors). Si un test de **geometría/anchor/endpoint** se rompe → has cruzado a lógica, revierte.
- Mantener verde `mapaExport.test.ts`, `mapaSistema.test.ts`, `renderUiBoundary.test.ts`, `opcloudRouting.test.ts`, `beautifyConnectedLinks.test.ts` **sin tocarlos** (son del lado que no editas).
- **Smoke** `e2e/02-*` y `e2e/05-*` (canvas) tienen **flake pre-existente** con dev server en background — no son regresión nueva si fallan intermitentemente. Corre smoke con **dev server apagado**.

---

## 8. Verificación

1. `cd app && bun run check` **verde** (typecheck + unit) antes de cada commit. Es el gate mínimo.
2. `bun run build` verde.
3. **Apagar el dev server** y luego `bun run browser:smoke` — sin regresiones nuevas vs baseline (02/05 flake conocido).
4. Validación **in-vivo** con skill `test-vivo-iterativo-opmkv` contra `ui-forja/screenshots/01-editor.png` y `03-multi-select.png`: confirmar bordes por clase (verde/azul/oliva), fills transparentes, grid ausente, underline crimson de selección, fuentes serif.

---

## 9. Decisiones bloqueadas (no las tomes vos)

- **No tocar routing**: `opcloudRouting.ts`, `mapa/proyeccion.ts`, anchors, puertos, `restrictTranslate`, `interactive`, conectores y multiplicidad OPCloud quedan **idénticos**.
- **No adoptar conectores rectos** (`defaultConnector: 'straight'` / `defaultRouter: 'normal'`): es lógica de routing, fuera de scope. El Manhattan OPCloud se conserva.
- **No editar `proyeccion.ts`** ni el kernel `modelo/constantes*.ts`.
- **No eliminar el canal cromático OPM** (V-63): borde por clase es semántica, no decoración.
- **No usar crimson como color semántico** de ningún shape OPM (V-203).
- **No introducir/quitar tools de JointJS** (lógica de interacción, dominio de otra capa).

---

## 10. Decisiones que tomas vos

- **Archivo nuevo vs in-place** → **archivo nuevo `app/src/render/jointjs/constantes.codex.ts`** + redirigir los imports de los composers editables hacia él. Razón: pivot total limpio; deja el kernel `CANON/CANON_V2` intacto (no es tu scope), evita un diff gigante en `modelo/` y aísla la paleta Codex en la capa render desechable. Exporta un objeto `CODEX` con la forma que consumen los composers (objeto/proceso/estado/enlace/paper/crimson/strokes/fuente) para minimizar el cambio en los call-sites.
- **Hard-code hex vs leer tokens** → `08 §12` recomienda Opción B (leer CSS vars), pero la app define el contrato runtime en `tokens.ts` y esta línea corre en **paralelo** a L1. Decisión: **hard-code de hex en `constantes.codex.ts`** (Opción A), con un comentario `// espejo de ui-forja/tokens.css` por valor. No introducir lectura de CSS vars en esta ronda.
- **Cómo implementar el underline de selección** (highlighter custom vs reescribir `proyectarHaloSeleccion` a celda de línea): a tu criterio; el contrato es el resultado visual de `08 §5.1`.
- **Qué tests de pintura actualizar y a qué valores**: tú fijas los literales Codex, citando handoff.

---

## 11. Forma del entregable

- Rama propia (worktree) `linea-4-codex-wip`. Merge a `main` lo orquesta steipete (orden de README §6: L4 entra en cuanto cierra, tras L1).
- Commits con scope estricto a los archivos de §4. Prefijos: `feat(render)` para el archivo nuevo `constantes.codex.ts` y los markers/highlighter; `style(render)` para ajustes puros de pintura (paper, fuentes, grid off). Co-author footer del operador.
- **No tocar**: `HANDOFF.md` (lo reescribe el operador al cierre), `proyeccion.ts`, `opcloudRouting.ts`, `mapa/proyeccion.ts`, `modelo/constantes*.ts`, `tokens.ts`, `App.tsx`, ni nada fuera de `src/render/jointjs/**`.
- Bugs descubiertos fuera de scope → patch a `/tmp`, no se mezclan con el WIP.
- Cierra con `bun run check` verde + nota de verificación in-vivo (§8) en el commit o en el reporte a steipete.
