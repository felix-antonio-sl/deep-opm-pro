# L1 — Tokens & tipografía Codex (FUNDACIÓN)

> **Ronda**: codex · **Base commit**: `a4b8abf` (main) · **Rama**: `linea-1-codex-wip`
> **Ola**: 0 (paralelo con L4) · **Merge order**: 1.º (antes que todo el chrome)
> **Riesgo**: alto — define el contrato de tokens que L2/L3/L5/L6 consumen.
> **Lecturas previas obligatorias**: `ronda-codex/README.md` (reglas duras §2, colisiones §5, orden §6), `ui-forja/01-design-spec.md §3-§6 y §11`, `ui-forja/tokens.css`, `ui-forja/tokens.json`.

---

## 1. Misión

Reescribir `app/src/ui/tokens.ts` del contrato Bauhaus (Ronda 28) al **contrato de tokens Codex** y self-hostear las fuentes **Inria Serif + Inria Sans** vía fontsource. Es la capa fundacional: el resto del chrome (L2/L3/L5/L6) lee de aquí.

**Slice mínimo**: `tokens.ts` expone (a) un nuevo bloque canónico Codex (`paper/ink-scale/crimson/opm/font/fs/ls/lh/hairline/stroke`) **y** (b) un **compat-shim completo** que mantiene todas las claves que el código vivo consume hoy, remapeadas a la paleta Codex. `main.tsx` importa las 3 familias self-hosted. `package.json` declara los paquetes Inria. `tokens.test.ts` se reescribe a los valores Codex.

**Qué queda fuera (NO tocar)**:
- Componentes que consumen tokens (Inspector, Toolbar, App.tsx, árbol, menús, mobile, mapa). Los re-pielan L2/L3/L5/L6 **en sus propias rondas**. L1 solo garantiza que **siguen compilando** con las claves nuevas.
- `src/render/jointjs/constantes.ts` y la paleta `colors.canvas.*` del canvas → eso es **L4** (CANON-V3). L1 deja `colors.canvas.*` **intacto bit a bit** (ver §6).
- CSS globales (`focus.css`, `menus.css`, `arbol.css`, `toolbar.css`, `jointjs.css`): no referencian tokens TS hoy (verificado: cero `font-family`/`--cx` en ellos); L1 no los toca.
- Cualquier lógica, store, modelo, OPL, serialización, persistencia.

---

## 2. HU base

| HU | Path absoluto | Aporte a esta línea |
|---|---|---|
| HU-81.011 — Configurar sincronización de colores entre OPL y OPD | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-81-config-defaults-estilo.md` | La tabla de tokens debe preservar un vocabulario cromático coherente entre canvas, OPL y chrome, sin usar crimson como semántica. |
| HU-81.012 — Fijar default de estilo por clase | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-81-config-defaults-estilo.md` | Justifica `colors.opm.object/process/state/stateFill` como contrato consumible por L4 y por el inspector. |
| HU-14.004 — Cambiar familia tipográfica del rótulo | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-14-canvas-styling.md` | Obliga a que las familias tipográficas queden centralizadas y no hard-codeadas en componentes. |
| HU-50.016 — Colorear tokens OPL-ES por clase de cosa | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | Soporta los helpers tipográficos/cromáticos que L3 usará para `OplObj/OplProc/OplState`. |

**Contrato Codex + SSOT:**

**Spec eje**: `ui-forja/01-design-spec.md` §3 (paleta), §4 (tipografía), §5 (letter-spacing), §6 (hairlines), §7 (strokes canvas), §11 (lo que NO hay). Contrato literal de valores: `ui-forja/tokens.css` + `ui-forja/tokens.json`.

**Reglas SSOT que respalda esta línea** (citar en el commit / comentarios cuando aplique):
- **V-63 (colores canónicos OPM)** — `opm-visual-es`: Objeto verde `#3a6b4d`, Proceso azul `#26467a`, Estado oliva `#7e8338` + state-fill `#ece9e1`. En Codex viven en `colors.opm.*` (los consume JointJS vía L4; en el chrome solo aparecen en pills/contadores de clase). Verificado en `ui-forja/06-ssot-compliance.md §1`.
- **V-203 (crimson UI-only)** — `opm-visual-es`: `--cx-crimson #8e2a2e` es **canal UI exclusivo** (selección/hover/alertas/marcas tipográficas). **Nunca** codifica semántica OPM. En tokens: `colors.crimson`.
- **V-209 / V-211 (tipografía)** — `opm-visual-es`: las etiquetas dentro de símbolos OPM y el cuerpo OPL usan **Inria Serif**; identificadores/shortcuts usan **JetBrains Mono**; kickers/micro-controles usan **Inria Sans** (uppercase tracked). Sin mezcla de familias dentro de un mismo rol (§11). Sin truncamiento silencioso (V-212) — irrelevante para tokens, lo aplica el chrome.

**Decisión de adaptación del handoff** (avalada por README §2 y la decisión bloqueada de esta línea): el handoff carga Inria de **Google Fonts CDN** (`01 §4`); opforja **self-hostea** vía fontsource, coherente con el patrón actual (`@fontsource-variable/inter-tight` + `jetbrains-mono` en `main.tsx`). El stack de valores (familias, pesos, tamaños) **no cambia** — solo el mecanismo de carga.

---

## 3. Anclaje a evidencia

**SSOT externa**: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/` (`opm-visual-es.md` para V-63/V-203/V-209/V-211). Auditoría de cumplimiento ya hecha: `ui-forja/06-ssot-compliance.md §1` confirma que Codex no contradice la SSOT.

**Revisión de insumos preexistentes (obligatoria, resultado)**:
- `opm-extracted/INDEX.md` + `MODULES.md`: 486 clases, ninguna es un *design-token system* reutilizable. El único material cromático es `opmStyle.colorPalette` en `_raw/1185.js` (paleta de inspector de OPCloud: naranjas/cyan/violetas/grises) — **no aplicable** a Codex (paleta editorial neutra distinta por diseño, `01 §3.1`). `core.mjs` tiene `setTheme` pero es del runtime JointJS, no tokens de producto.
- `docs/JOYAS.md §1` (colores canónicos) y `§3` (tipografía): confirman la paleta **del canvas** (`#70E483`/`#3BC3FF`/`#586D8C`/`#fdffff`/`#000002`, font Arial) — eso es `colors.canvas.*`, que L1 **no toca** (es L4). No hay un sistema de tokens de chrome reutilizable.
- `assets/svg/` + `assets/png/`: assets visuales de símbolos/markers, no tokens.
- **Conclusión declarada**: no existe sistema de tokens Codex preexistente que reciclar. El único contrato de tokens del repo es el propio `tokens.ts` Bauhaus a reemplazar y los archivos `ui-forja/tokens.{css,json}` que son el destino. No se inventa nada fuera de esos archivos.

**Estado actual (paths/líneas concretas)**:
- `app/src/ui/tokens.ts` (599 líneas): paleta Bauhaus. Bloques: `colors` (líneas 92-310, con ~88 claves vivas vía compat-shim + `colors.canvas` líneas 300-309), `spacing` (316-323), `radii` (338-348), `stroke` (354-358), `shadows` (375-411), `transitions` (417-421), `typography` (436-485), `bibliotecaDock` (491-497), `inspectorTabs` (503-520), `editorOplHonesto` (526-560), `mobileNav` (566-581), agregado `tokens` (587-599).
- `app/src/main.tsx` líneas 5-6: `import "@fontsource-variable/inter-tight"` + `import "@fontsource-variable/jetbrains-mono"`. Render en línea 17.
- `app/src/ui/tokens.test.ts` (188 líneas): **asierta literales Bauhaus** (`ink === "#0A0A0A"`, `accent === "#C8392F"`, `familyChrome` empieza con `"Inter Tight"`, etc.) → **se reescribe en esta línea**.
- `app/src/ui/tokenInterpolation.test.ts`: **NO es de design-tokens** — es un lint que detecta interpolación `${tokens.*}` mal escrita dentro de strings. **No tocar**; debe seguir verde.

**Consumo actual del módulo (medido)**: ~88 claves distintas de `colors.*`, ~57 claves distintas de no-color (`spacing/radii/stroke/shadows/transitions/typography/...`), repartidas en ~74 archivos `.ts(x)`. Las más usadas: `colors.ink` (262), `colors.paper` (167), `typography.familyChrome` (165), `colors.ink15` (132), `typography.sizes.sm` (93), `radii.sm` (92), `spacing.sm` (88). **L1 no refactoriza esos consumidores** → el compat-shim es obligatorio.

---

## 4. Archivos permitidos

```
app/src/ui/tokens.ts        EDIT / reescritura completa  (OWNER único)
app/src/ui/tokens.test.ts   EDIT / reescritura a valores Codex
app/src/main.tsx            EDIT aditivo (imports de fuentes)
app/package.json            EDIT aditivo (deps fontsource Inria)
app/bun.lock                generado por `bun add` (commit del lockfile)
─────────────────────────────────────────────────────────────────────
todo lo demás               LECTURA
```

Cualquier necesidad de tocar un componente, CSS, `constantes.ts` o `colors.canvas.*` → **detenerse y reportar**: significa que el shim no fue completo o que se cruzó a scope de otra línea.

---

## 5. Restricciones de no-colisión

Según `README.md §5`: **solo L1** edita `tokens.ts`, `tokens.test.ts`, `main.tsx` (fuentes), `package.json` y `bun.lock`. Las demás líneas los leen (`R`). Reglas operativas:
- **No renombrar/eliminar** ninguna clave que el código vivo consuma sin proveer alias (ver §6 y §10). Romper una clave = romper la compilación de chrome que L2-L6 aún no han migrado.
- `colors.canvas.*` queda **byte-idéntico** (es territorio de L4; cambiarlo rompería el merge order).
- No tocar `jointjs.css` ni los CSS globales.
- Commits con scope estricto a los 4-5 archivos listados.

---

## 6. Slice mínimo shippeable — estructura del nuevo `tokens.ts`

Estrategia: **dos capas en `colors`** — (a) canónicos Codex nuevos + (b) compat-shim que remapea las ~88 claves vivas a la paleta Codex. El objeto agregado `tokens` mantiene su forma. Cada constante deriva de `ui-forja/tokens.css`.

### 6.1 Constantes base (derivadas de `tokens.css`)

```ts
// ─── Papel y tinta (chrome) — 01 §3.1 ───
const paper      = "#fafaf8"; // fondo principal (era #FAFAFA Bauhaus)
const paperWarm  = "#f4f3ec"; // superficies secundarias, callouts
const ink        = "#171511"; // tinta principal (era #0A0A0A)
const inkMid     = "#5a564c"; // cuerpo secundario, italics
const inkSoft    = "#a39e92"; // metadatos, kickers, números mono
const inkFaint   = "#cfcbc1"; // separadores inline (·), "off"
const rule       = "#e4e0d6"; // hairline normal
const ruleStrong = "#c7c2b6"; // hairline divisor estructural

// ─── Canon OPM (V-63) — 01 §3.2 — usados por JointJS (L4) ───
const opmGreen = "#3a6b4d";  // Objeto
const opmBlue  = "#26467a";  // Proceso
const opmOlive = "#7e8338";  // Estado
const stateFill = "#ece9e1"; // Estado fill

// ─── Acento editorial UI-only (V-203) — 01 §3.3 ───
const crimson = "#8e2a2e";
```

### 6.2 `colors` — canónicos Codex + shim

```ts
export const colors = {
  // ─── Canónicos Codex (públicos nuevos) ───
  paper, paperWarm, ink, inkMid, inkSoft, inkFaint, rule, ruleStrong,
  crimson,
  opm: { object: opmGreen, process: opmBlue, state: opmOlive, stateFill },

  // ─── Canvas semántico OPM [JOYAS §1] — INVARIANTE (territorio L4) ───
  canvas: {
    objeto: "#70E483", objetoSuave: "#70e483",
    proceso: "#3BC3FF", procesoSuave: "#3bc3ff",
    enlace: "#586D8C", enlaceSuave: "#586d8c",
    fill: "#fdffff", texto: "#000002",
  },

  // ─── Compat-shim: ~88 claves vivas remapeadas a la paleta Codex ───
  // ink-scale legacy → tinta/rule Codex (la escala monocromática Bauhaus
  // colapsa a la rampa editorial neutra)
  ink90: inkMid, ink70: inkMid, ink50: inkSoft, ink30: inkFaint,
  ink15: rule, ink08: rule, ink04: paperWarm, ink02: ink,
  paper02: paperWarm,
  // acentos: cinabrio/ultramar Bauhaus → crimson Codex (único acento UI)
  accent: crimson, accentSoft: paperWarm, accentDark: crimson,
  focus: crimson, focusSoft: paperWarm,
  acentoUi: crimson, acentoUiSuave: paperWarm, acentoSecundario: ink,
  // chrome neutros
  chromeNeutral: inkMid, chromeNeutralSuave: paperWarm,
  // fondos
  fondoChrome: paper, fondoApp: paper, fondoInput: paper, fondoTabla: paper,
  fondoPanel: paper, fondoCard: paperWarm, fondoElevado: paperWarm,
  fondoPanelSuave: paperWarm, fondoMuted: paperWarm, fondoNeutral: paperWarm,
  fondoDeshabilitado: paperWarm, fondoWorkbench: paperWarm,
  fondoLineaTiempo: paperWarm,
  // bordes
  bordeSuave: rule, bordeChrome: rule, bordeIntermedio: rule,
  bordeControl: ruleStrong, bordeInput: ruleStrong, bordeTabla: rule,
  bordeSlate: ruleStrong, bordeNeutral: rule, bordePanel: rule,
  bordeFila: rule, bordeGestion: rule, mapaBorde: rule, oplBorde: rule,
  // textos
  textoPrimario: ink, textoSecundario: inkMid, textoTerciario: inkSoft,
  textoControl: ink, textoSlate: inkMid, textoDeshabilitado: inkFaint,
  textoCasiNegro: ink, negro: ink,
  // estados semánticos (en Codex la severidad es tipográfica/crimson, no color)
  errorBase: crimson, errorRojo: crimson, errorTexto: crimson,
  errorOscuro: crimson, errorFondo: paperWarm, errorFondoIntenso: paperWarm,
  errorBorde: crimson, errorBordeSuave: rule, errorBordeFuerte: crimson,
  warning: crimson, alertaTexto: crimson, advertenciaFondo: paperWarm,
  advertenciaBorde: ruleStrong, alertaAmbar: crimson,
  exitoBase: opmGreen, exitoTexto: opmGreen, exitoFondo: paperWarm,
  // info → tinta (Codex no tiene azul info; el ultramar Bauhaus se retira)
  infoBorde: ruleStrong, infoTextoOscuro: inkMid, infoFondo: paperWarm,
  infoFondoClaro: paperWarm, infoFondoAlterno: paper, infoBordeSuave: rule,
  infoMuySuave: paperWarm,
  // azules/verdes/naranjas/violetas legacy → rampa Codex
  azulInfo: inkMid, azulAccion: crimson, azulProfundo: ink,
  azulMuySuave: paperWarm,
  verdeObjetoOscuro: opmGreen, verdeOpl: opmGreen, objetoFondo: paperWarm,
  enlaceTexto: crimson, naranja: crimson, ambarOscuro: crimson,
  violeta: inkMid, rojoOpcloud: crimson, resaltadoTemporal: paperWarm,
  neutralBadge: paperWarm,
  // árbol / timeline / opl
  arbolSeleccion: paperWarm, arbolSeleccionBorde: crimson, carpetaFondo: paperWarm,
  timelineActivo: inkSoft, timelineBorde: rule, timelineFondo: paper,
  timelineFondoSuave: paperWarm,
  oplTokenBorde: rule, oplTokenTexto: inkSoft, oplFondo: paper,
  fondoIcono: paperWarm,
} as const;
```

> El listado anterior es **derivativo, no exhaustivo-literal**: el implementador DEBE generar el set completo de claves vivas con
> `grep -rohE 'colors\.[a-zA-Z0-9_]+' app/src | sort -u`
> y garantizar que **cada** clave resultante existe en el nuevo `colors`. Cero claves huérfanas (typecheck lo atrapa: las propiedades inexistentes sobre `as const` fallan).

### 6.3 Tipografía Codex (familias + escala + tracking + line-height + pesos)

```ts
export const typography = {
  // Familias Codex (01 §4) — self-hosted
  serif: '"Inria Serif", Georgia, serif',
  sans:  '"Inria Sans", system-ui, -apple-system, sans-serif',
  mono:  '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
  // Escala canónica Codex (01 §4.1)
  fs: { fs9: 9, fs10: 10, fs11: 11, fs12: 12, fs13: 13.5, fs14: 14,
        fs17: 17, fs20: 20, fs22: 22 },
  // Tracking (01 §5)
  ls: { tight: "-0.01em", body: "-0.005em", mono: "0.04em", kbd: "0.06em",
        meta: "0.08em", mark: "0.12em", kicker: "0.18em", section: "0.22em" },
  // Line-heights (tokens.css §line-heights)
  lh: { tight: 1.1, body: 1.45, opl: 1.55, quote: 1.5 },
  // Pesos (01 §4.3)
  weights: { regular: 400, medium: 500, semibold: 600, bold: 700,
             normal: 400, light: 300, heavy: 700, display: 700 },

  // ─── Compat-shim: claves de familia/escala/peso vivas ───
  // Inria Serif es la "voz" del producto → familyChrome pasa a serif.
  familyChrome: '"Inria Serif", Georgia, serif',
  fontFamily:   '"Inria Serif", Georgia, serif',
  fontFamilyMono: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
  familyCanvas: "Arial", // [JOYAS §3] canvas SVG invariante — NO tocar
  sizes: { xxs: 10, xs: 11, sm: 12, base: 13.5, md: 13.5, lg: 14, xl: 20, xxl: 22 },
  sizeXxs: 10, sizeXs: 11, sizeSm: 12, sizeMd: 13.5, sizeLg: 14, sizeXl: 20, sizeXxl: 22,
  weightLight: 300, weightNormal: 400, weightMedium: 500, weightSemibold: 600,
  weightBold: 700, weightHeavy: 700, weightDisplay: 700,
} as const;
```

> **Mapeo de `sizes.*` legacy → escala Codex**: las claves Bauhaus (`xxs=10/xs=11/sm=12/base=13/md=13/lg=16/xl=20/xxl=28`) se reasignan a la escala Codex aproximando por rol (10/11/12/13.5/13.5/14/20/22). El implementador decide el redondeo fino (§10), pero **toda clave existente debe persistir**.

### 6.4 Resto de bloques

- `spacing`: preservar las claves `{ xs, sm, md, lg, xl, xxl }`. Codex no especifica escala de espaciado de chrome propia; mantener la escala 4/8/16/24/32/48 (las paddings finas Codex viven en CSS de cada componente, no en tokens) **o** alinear a las paddings de `tokens.css §layout` si el implementador lo justifica (§10). Mantener claves.
- `radii`: Codex §11 = **sin border-radius en chrome** (única excepción: rountangle de estado, dentro de JointJS/L4). Colapsar `xs/sm/control/md/lg/xl` a `0`; conservar `none:0`, `pill:999`, `full:9999` para badges circulares que el chrome aún use.
- `stroke`: mapear a los strokes Codex (`01 §7`): `hairline: 1`, `base: 1.5`, `bold: 1.5`/`2` (objeto/proceso 1.5; estado/triángulo 1.2; link 1). Mantener las 3 claves `hairline/base/bold`. Opcional añadir sub-objeto `opm: { object:1.5, process:1.5, state:1.2, link:1, triangle:1.2 }` para L4 (aditivo, no rompe).
- `shadows`: Codex §11 = **sin sombras** (excepto backdrop del command palette → eso lo maneja L6 en CSS). Reasignar `flat/flatLarge/flatXl` y **todos los aliases semánticos vivos** (`card/popover/menu/modal/dialogo/…`) a `"none"`. Conservar los estados especiales que son outlines de foco/selección (`dropProceso`, `seleccionadoInset`, `panelInset`, `swatchActivo`) reexpresados con `crimson`/`rule` (no son shadows reales, son rings) **o** dejarlos como ring crimson. Mantener todas las claves.
- `transitions`: Codex §9 = `100-150ms ease` solo en color. Mantener `{ fast, base, slow }` → `fast/base: "120ms ease"`, `slow: "150ms ease"`. Mantener claves.
- `bibliotecaDock`, `inspectorTabs`, `editorOplHonesto`, `mobileNav`: **preservar tal cual** (consumen `colors.*`/`typography.*` vía shim, así que se reescalan solos). No cambiar su forma.
- Agregado `tokens`: mantener exactamente las mismas claves (`colors, spacing, radii, stroke, shadows, transitions, typography, bibliotecaDock, inspectorTabs, editorOplHonesto, mobileNav`).

### 6.5 `main.tsx` (aditivo)

Reemplazar el import de Inter Tight por Inria (mantener JetBrains Mono). Inria **no tiene variable font** → importar pesos estáticos necesarios:

```ts
// Codex: Inria Serif (cuerpo/títulos/OPL/labels OPM) + Inria Sans (kickers).
// Inria no tiene variable font → pesos estáticos. JetBrains Mono se conserva.
import "@fontsource/inria-serif/300.css";
import "@fontsource/inria-serif/400.css";
import "@fontsource/inria-serif/700.css";
import "@fontsource/inria-serif/400-italic.css";
import "@fontsource/inria-serif/700-italic.css";
import "@fontsource/inria-sans/400.css";
import "@fontsource/inria-sans/700.css";
import "@fontsource/inria-sans/400-italic.css";
import "@fontsource-variable/jetbrains-mono";
```

> El implementador confirma los archivos de peso/italic disponibles tras `bun add` (estructura `@fontsource/inria-serif/<peso>[-italic].css`). Cargar **solo** los pesos que el contrato usa (300/400/700 serif; 400/700 sans; italic 400/700). Eliminar el import de `@fontsource-variable/inter-tight`.

### 6.6 `package.json` (aditivo)

`bun add @fontsource/inria-serif @fontsource/inria-sans` (v5.x, disponibles — ver §reporte). Remover `@fontsource-variable/inter-tight` de `dependencies` solo si ningún otro archivo lo importa (verificado: solo `main.tsx`).

---

## 7. Tests obligatorios

- **`tokens.test.ts` SE REESCRIBE** (no es opcional): hoy asierta literales Bauhaus (`ink==="#0A0A0A"`, `accent==="#C8392F"`, `familyChrome` empieza con `"Inter Tight"`, `radii.sm===2`, etc.) que cambian. Nueva batería, preservando la **intención** original:
  1. `colors.canvas.*` permanece invariante (`#70E483/#3BC3FF/#586D8C/#fdffff/#000002`) — territorio L4.
  2. Paleta Codex base: `colors.paper==="#fafaf8"`, `colors.ink==="#171511"`, `colors.crimson==="#8e2a2e"`, `colors.opm.object==="#3a6b4d"`, `colors.opm.process==="#26467a"`, `colors.opm.state==="#7e8338"`, `colors.opm.stateFill==="#ece9e1"`.
  3. Crimson UI-only no colisiona con canon canvas (`crimson !== canvas.proceso`, `crimson !== opm.process`).
  4. WCAG: `contraste(ink, paper) ≥ 7` (AAA); `contraste(inkMid, paper) ≥ 4.5`; `contraste(crimson, paper) ≥ 4.5`. (Mantener los helpers `contraste/luminancia/rgb` existentes.)
  5. Tipografía Codex: `typography.serif` empieza con `"Inria Serif"`, `typography.mono` con `"JetBrains Mono"`, `familyCanvas==="Arial"`.
  6. Shim íntegro: spot-check de claves de alta frecuencia (`colors.ink15`, `colors.fondoChrome`, `typography.familyChrome` empieza con `"Inria Serif"`, `radii.sm===0`, `shadows.card==="none"`).
  7. `tokens` agregado expone los 11 sub-módulos.
- **`tokenInterpolation.test.ts`**: NO tocar. Debe seguir verde (es un lint de interpolación, ajeno a la paleta).
- **typecheck** (`tsc --noEmit`) es el gate fuerte de cobertura del shim: cualquier consumidor que use una clave que el nuevo `tokens.ts` no exponga **falla la compilación**. Si typecheck pasa, el shim está completo.
- No introducir tests de los componentes (eso es de L2-L6).

---

## 8. Verificación

```bash
cd app
bun add @fontsource/inria-serif @fontsource/inria-sans
bun run typecheck     # debe pasar — valida que el shim cubre TODA clave viva
bun run check         # typecheck + unit (tokens.test reescrito incluido)
bun run build         # confirma que las fuentes se resuelven en el bundle
```

- Verificación de fuentes: tras `build`, confirmar en `app/dist/assets/` que aparecen los `.woff2` de Inria Serif/Sans y JetBrains Mono (las 3 familias cargan). Opcional: `bun run dev` + inspección visual de que el chrome renderiza en serif (no en fallback Georgia/system).
- Smoke (`browser:smoke`, **dev server apagado**) no debería regresar nada nuevo: L1 no cambia DOM ni testids. Correr al cierre de la ola si steipete lo pide.

---

## 9. Decisiones bloqueadas (no reabrir)

- **Pivot TOTAL**: la paleta Bauhaus se **retira**. `tokens.ts` ES Codex; no hay theming conmutable, no hay flag, no hay dark mode (v1.1+).
- **Self-host de Inria** vía fontsource (NO Google Fonts CDN del handoff). JetBrains Mono ya está self-hosted y se conserva.
- **`colors.canvas.*` no se toca** en L1 (es L4 / CANON-V3). Queda byte-idéntico.
- El contrato de valores (hex, familias, escala, tracking) es el de `ui-forja/tokens.{css,json}`. No se inventan valores nuevos.

---

## 10. Decisiones que tomás vos (implementador)

1. **Shim vs renombre**: **decisión recomendada = conservar TODAS las claves Bauhaus como compat-shim** remapeadas a la paleta Codex (no renombrar+migrar consumidores). Razón: ~88 claves de color + ~57 no-color repartidas en ~74 archivos que L2-L6 re-pielan en sus propias rondas; migrarlas aquí cruzaría scope y rompería el merge order. El shim mantiene el contrato y deja que cada línea posterior limpie su superficie. Los nombres canónicos **nuevos** Codex (`paper/inkMid/inkSoft/rule/crimson/opm.*/serif/sans/mono/fs/ls/lh`) se exponen en paralelo para que L2-L6 los consuman.
2. **Nombres exactos de claves canónicas Codex**: los de §6 son la propuesta (alineados a `tokens.json`: `paper/paperWarm/ink/inkMid/inkSoft/inkFaint/rule/ruleStrong/crimson/opm.{object,process,state,stateFill}`). Podés ajustar capitalización/estructura si mantenés fidelidad al handoff y documentás.
3. **Mapeo fino de la escala `sizes.*` legacy** a los 9 fs Codex (redondeos exactos) y de `spacing` (mantener 4/8/16/24/32/48 vs. alinear a paddings `tokens.css`).
4. **Forma de los "rings" que hoy viven en `shadows`** (`dropProceso/seleccionadoInset/panelInset/swatchActivo`): mantenerlos como outlines crimson/rule o colapsarlos. No son sombras Codex; decidí cómo expresarlos sin reintroducir blur.
5. Si una clave viva no tiene mapeo Codex obvio, elegí el equivalente editorial más cercano (tinta/rule/crimson) y comentá el porqué en una línea.

---

## 11. Forma del entregable

Rama `linea-1-codex-wip` (worktree propio). Commits sugeridos (scope estricto a los archivos de §4):

1. `chore(deps): self-host Inria Serif + Inria Sans (Codex), retira Inter Tight`
   — `package.json` + `bun.lock` + `main.tsx` (imports de fuentes).
2. `feat(ui): reescribe tokens.ts al contrato Codex (paleta editorial + tipografía Inria)`
   — `tokens.ts` (canónicos Codex + compat-shim completo).
3. `test(ui): reescribe tokens.test.ts a valores Codex (canvas invariante, crimson UI-only, WCAG)`
   — `tokens.test.ts`.

Footer co-author del operador en cada commit:
```
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

**Qué NO tocar**: cualquier componente/CSS, `constantes.ts`, `colors.canvas.*`, `tokenInterpolation.test.ts`, `HANDOFF.md`, store/modelo/OPL/serialización/persistencia. Entregar con `bun run check` + `bun run build` verdes. Bugs fuera de scope descubiertos en el camino → patch a `/tmp`, **no** se mezclan con la rama.
