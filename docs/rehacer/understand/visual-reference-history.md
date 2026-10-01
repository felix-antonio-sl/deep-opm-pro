# Dossier: gobierno visual, material de referencia e historia de opforja

Área: `ui-forja/`, `opm-extracted/`, `assets/`, `fixtures/`, `catalog/`, `config/`,
`webroot/`, `.codex/skills`, `.opencode/skills`, `setup.sh` y la historia Git completa
(69 commits), más la prehistoria reconstruida desde la evidencia que el primer commit
importó.

Método: leí completos los 10 `.md` de `ui-forja`, `tokens.json`, `tokens.css`, las
escenas HTML, tres de las cuatro capturas y el índice de componentes de
`src/variant-codex.jsx`. En `opm-extracted` leí `README`, `REFACTOR-NOTES` y los
encabezados de `INDEX` y `MODULES`, y muestreé `models/consistency/*.rules.ts` y
`json.model.ts`. De `assets` y `fixtures` hice el inventario completo, crucé qué usa
la app y revisé el formato. También leí la skill `lineas-paralelas`, `setup.sh`,
`git log --stat` completo, el `CLAUDE.md` y el handoff históricos del commit raíz, y
revisé en `app/` cómo se realiza el sistema visual (`src/ui/tokens.ts`,
`src/ui/codex/*`, `src/render/jointjs/{constantes.codex,linkAssets}.ts`,
`composers/entidad.ts`, `index.html`, `focus.css`) y cómo se aplica
(`scripts/design-governance-audit.mjs`).

No se editó nada del repositorio. La única escritura fue este archivo, además de un
script temporal en el scratchpad para generar el OPL actual del fixture
`System Diagram`.

---

## 0. Resumen ejecutivo

1. **El lenguaje visual "Codex" vale la pena conservarlo casi entero.** Es papel frío
   con tinta cálida, hairlines sin sombras, un único acento crimson reservado a la UI,
   Inria Serif/Sans con JetBrains Mono, glifos Unicode en lugar de iconos, y verde,
   azul y oliva OPM como canal informativo. Es coherente, sobrio y apropiado para un
   editor de lectura y escritura.
2. **Su gobierno es burocrático y autorreferente.** Hay cinco copias de los mismos
   valores (`tokens.css`, `tokens.json`, `app/src/ui/tokens.ts`,
   `render/jointjs/constantes.codex.ts` y `app/index.html`), además de
   `variant-codex.jsx`. El gate `design:governance` sobre todo verifica que ciertos
   documentos contengan ciertas frases y que los números de versión coincidan entre
   documentos. No verifica el producto.
3. **Los documentos `ui-forja/01–08` están desfasados respecto del producto** en al
   menos 12 puntos verificables: header de 60 contra 48 px, footer inexistente,
   columna OPL de 360 contra 240 px, secciones del command palette, "LIVE", índice
   `o.NN`, clasificación OPL colapsada y otros. Algunos tests afirman lo contrario de
   la spec, por ejemplo `footer` con conteo 0 en `e2e/27-visual-compliance-25-05.spec.ts`.
4. **`ui-forja` excede su mandato** porque prescribe sintaxis OPL en `04-opl-rendering.md`,
   que contradice al generador vigente y a OPCloud. La precedencia correcta ya está
   escrita, porque OPL y OPD pertenecen a las specs KORA, pero el documento sigue ahí.
5. **Las reglas OPM visualmente significativas están codificadas en `render/jointjs`**,
   no en `ui-forja`. Son sagradas: sombra de esencia física, contorno discontinuo
   ambiental heredado por exhibición, trazo grueso de refinado, rountangle de estado,
   inicial y final, marcadores de enlace y arcos XOR/OR. Las catalogo en §4 con
   archivo:línea.
6. **`opm-extracted/` (12 MB, unas 164 mil líneas de código OPCloud decompilado) es
   evidencia legalmente delicada y de consumo marginal.** Se cita en comentarios y un
   solo test lo lee en tiempo de ejecución. Tiene valor de estudio: catálogo de 39
   reglas behavioral, 10 structural y 4 consistional, la separación lógico/visual, la
   geometría de marcadores y los radios de abanico. Debe salir del repositorio del
   producto.
7. **De `assets/` (84 archivos) la app usa solo 9 SVG de chrome**, importados en build
   (el Dockerfile copia `assets/`). Los SVG de enlaces solo figuran como strings de
   procedencia. Además, esos iconos contradicen la regla Codex de no usar iconos
   vectoriales.
8. **`fixtures/` no lo carga ningún código.** Las capturas DOM de OPCloud son solo
   observacionales. `fixtures/demo-models/` es la salida de `app/scripts/generar-demos.ts`,
   está desactualizada (verbos `produce`, `usa`, `manipula`) y no coincide con el OPL
   actual.
9. **`catalog/`, `config/`, `webroot/` y `setup.sh`** son restos de la fase de
   ingeniería inversa (abril de 2026). Tienen hashes de bundles OPCloud fijados y nadie
   los consume.
10. **La skill `lineas-paralelas` existe dos veces, de forma idéntica, y apunta a rutas
    que no existen** (`/home/felix/...`, `docs/instrucciones-lineas-dev/ronda3/`,
    `.claude/skills`). Además obliga a revisar a fondo `opm-extracted` antes de crear
    cualquier cosa. Es acreción de proceso.
11. **La historia Git visible (del 26 de julio al 30 de septiembre de 2026) empieza en
    un commit raíz que importa 2.271 archivos y unas 480 mil líneas.** El proyecto venía
    de abril y mayo. De los 69 commits, 24 son solo documentales (handoff, ops y
    cierres). Los dos giros netos son la poda del 9 de agosto (−9,4 mil líneas de
    documentos y código inerte) y el commit big-bang "producto integrado" del 30 de
    septiembre (+24,7 mil líneas, sin desplegar).
12. **Evolución visual:** V1 OPCloud-fiel (lima `#70E483`, cian `#3BC3FF`, Arial), luego
    CANON-V2 "Bauhaus lavada" (Ronda 28, cinabrio, Inter Tight), luego una variante
    "Drafting" con magenta, luego CANON-V3/V4 Codex (25 de mayo y 1 de junio). Quedan
    fósiles de V1 y V2 vivos en `tokens.ts`, `modelo/constantes.bauhaus.ts`, `focus.css`
    e `index.html`.

---

## 1. Inventario del área

| Ruta | Tamaño | Propósito declarado | Consumidor real | Veredicto |
|---|---|---|---|---|
| `ui-forja/*.md` (10) | ~2.700 líneas | Sistema de diseño "Codex" v1.2: filosofía, tokens, componentes, escenas, OPL, interacciones, SSOT, glifos, JointJS | Humanos y el gate `design:governance` (lee frases) | **simplificar**: un solo documento corto con el lenguaje visual y las reglas de chrome |
| `ui-forja/tokens.json` / `tokens.css` | 99 / 170 líneas | "Fuente de valores" | Solo el gate (compara con `tokens.ts`); ningún código importa `tokens.css` | **simplificar**: una sola fuente de tokens ejecutable |
| `ui-forja/scenes/*.html` (4) | 46 líneas cada una | Escenas React y Babel por CDN que cargan `variant-codex.jsx` | Nadie | **cortar** (o archivar fuera) |
| `ui-forja/screenshots/*.png` (4) | ~86 KB | Referencia visual 909×540 | Nadie; muestran un layout invertido y ya histórico | **cortar** o conservar una sola como "moodboard" |
| `ui-forja/src/variant-codex.jsx` | 1.162 líneas | Implementación React de referencia del chrome, con un mock SVG del canvas | Nadie (ya portado a `app/src/ui/codex/`) | **cortar** |
| `opm-extracted/` | 12 MB; 349 archivos; ~164 mil líneas | Código OPCloud decompilado, limpiado y navegable como referencia | Unos 40 comentarios en `app/src` y 1 test (`modelo/paridadOpcloud.test.ts:8`) | **cortar del repo del producto**; mover a un repo de investigación privado |
| `opm-extracted/assets/` | 1,2 MB | Copia de `assets/` más `INDEX.md` | Nadie | **cortar** (duplicado) |
| `assets/svg`, `assets/png` | 84 archivos, 1,2 MB | SVG y PNG del CDN de OPCloud | 9 SVG importados por el chrome (§6); el `Dockerfile` copia `assets` | **simplificar**: reemplazar esos 9 por glifos Unicode y retirar |
| `fixtures/<modelo>/` (7 carpetas) | ~3,3 MB | Capturas DOM, PNG y OPL del sandbox OPCloud | Nadie | **cortar** (o dejar 1 o 2 OPL como golden de referencia) |
| `fixtures/demo-models/` | 21 archivos | JSON, OPL y MD generados por `app/scripts/generar-demos.ts` | Nadie; son salida desactualizada | **cortar**; el origen vive en `app/src/modelo/fixtures.ts` |
| `catalog/` | 28 KB | Lista de 376 clases y módulos webpack (anterior a `opm-extracted`) | Nadie | **cortar** |
| `config/`, `webroot/` | 92 KB | `firebase.json`, `routes.json`, `index.html` y favicon de OPCloud (con gtag) | Nadie | **cortar** |
| `setup.sh` | 181 líneas | Descarga los bundles de OPCloud, los decompila con webcrack y baja los assets | Nadie (hashes de 2026-04 fijados) | **cortar** |
| `.codex/skills/lineas-paralelas`, `.opencode/skills/...` | 216 líneas cada una, idénticas | Particionar trabajo en "líneas" paralelas para agentes | Proceso humano y agente; ignoradas por `.gitignore` pero versionadas | **cortar** |

Dirección de dependencias relevante: la app depende en build de `assets/` (imports
relativos `../../../assets/svg/*.svg` y `COPY assets ./assets` en `Dockerfile:31`) y en
test de `opm-extracted/` (`paridadOpcloud.test.ts`). Nada más del área es necesario
para compilar o ejecutar.

---

## 2. `ui-forja` en detalle

### 2.1 Cadena de precedencia (contrato de autoridad)

Cita textual de `ui-forja/GOVERNANCE.md` §1:

> 1. `urn:fxsl:kb:reglas-opm-estrictas-es` — SSOT suprema para canonicidad OPM/OPD/OPL.
> 2. `urn:fxsl:kb:spec-forja-opd-es` — SSOT de la modalidad OPD operativa: manda en todo lo visualmente significativo OPM.
> 3. `ui-forja/GOVERNANCE.md` — autoridad normativa para diseño de producto (estética, chrome, tokens) …
> 4. `ui-forja/01-design-spec.md` ... `ui-forja/08-jointjs-styling.md` — especificación prescriptiva por capa.
> 5. `ui-forja/tokens.json` y `ui-forja/tokens.css` — fuente de valores de diseño; `app/src/ui/tokens.ts` es el espejo runtime.
> 6. Implementación …  7. Tests …

Esta precedencia es correcta y conviene conservarla como principio: la semántica OPM
manda sobre la estética. Hay un problema operativo, porque **las SSOT 1 y 2 viven fuera
del repositorio**, en KORA (`/home/felix/kora-knowledge`, según
`docs/canon-opm/resolutor-urn.json`), y no están disponibles en este entorno. El repo
solo tiene puentes (`docs/canon-opm/*.md`, de 70 a 100 líneas cada uno, sin contenido
normativo). Una reescritura necesita acceso a esas specs o una copia versionada de las
reglas visuales OPM.

### 2.2 Invariantes de diseño declarados (GOVERNANCE §2)

Cita textual de lo que conviene conservar:

- «La app es un editor OPM de trabajo, no una landing page ni una demo.»
- «El layout desktop vigente es: `OPL ← canvas → Índice + Inspector`.»
- «El chrome usa tipografía, hairlines y espacio editorial; no usa sombras de elevación, tarjetas decorativas ni cajas de botón innecesarias.»
- «La paleta OPM es canal reservado informativo por clase (objeto verde, proceso azul, estado oliva): los colores no codifican semántica por sí mismos — la semántica la portan forma, contorno, sombreado y topología (R-COLOR-1/2, V-63). El acento crimson es UI-only.»
- «La selección visual en canvas es underline crimson bajo la etiqueta, sin doble borde de proceso por selección.»
- «OPL y OPD deben mantenerse sincronizados bidireccionalmente.»

Excepciones permitidas (§4): ring sin blur `0 0 0 …` o `inset`; `dropShadow` solo
como marca semántica de esencia física; `radii.pill/full` para estados, dots y
swatches; aliases legacy `colors.canvas.*`. Esta última excepción protege valores que
**ningún código usa** (ver §2.6).

### 2.3 Lenguaje visual Codex (recomendado: conservar)

**Filosofía** (`01-design-spec.md` §1): «La página *es* la interfaz.» El editor se
concibe como un manuscrito anotado: OPD al centro, OPL como marginalia y herramientas
al margen derecho. Tiene cuatro principios: tipografía antes que UI; hairlines en vez
de sombras; el canon OPM manda en el OPD; y marginalia como herramienta semántica (las
validaciones van al pie de la oración, no en toasts).

**Paleta** (valores idénticos en `tokens.json`, `tokens.css:15-43` y `tokens.ts:13-27`):

| Token | Hex | Rol |
|---|---|---|
| `paper` | `#fafaf8` | fondo principal (off-white frío) |
| `paperWarm` | `#eeece2` | superficies secundarias, hover, ítem activo |
| `ink` | `#171511` | tinta principal (≈16:1 sobre paper) |
| `inkMid` | `#5a564c` | cuerpo secundario, OPL no seleccionada (≈7:1) |
| `inkSoft` | `#6b665c` | metadatos y kickers (≈5,5:1; se subió desde `#807b6e` el 2026-07-27 por AA) |
| `inkFaint` | `#b5b0a4` | separadores `·`, elementos "off" (no apto para texto) |
| `rule` | `#d3cec1` | hairline normal |
| `ruleStrong` | `#aea899` | hairline estructural |
| `opm.object` | `#27613f` | borde de objeto (verde) |
| `opm.process` | `#1d3f78` | borde de proceso (azul oscuro) |
| `opm.state` | `#68711f` | borde de estado (oliva) |
| `opm.stateFill` | `#dedacb` | relleno de estado |
| `crimson` | `#8e2a2e` | **único acento de UI**: selección, foco, alertas, marcas |

Derivados que solo existen en el canvas (`render/jointjs/constantes.codex.ts:13-18`):
`estadoFinalFill #d6d2c6`, `crimsonSuave rgba(142,42,46,.06)` para el marquee, suaves
OPM al 10-16 % y `refinamiento.fill rgba(250,250,248,.96)`.

**Tipografía**: Inria Serif (cuerpo, OPL, títulos y etiquetas de símbolos OPM), Inria
Sans (kickers en mayúsculas con tracking de al menos 0.18em) y JetBrains Mono
(identificadores, atajos y severidades). Escala 9 · 10 · 11 · 12 · **13.5** (cuerpo OPL
13.5/1.55) · 14 · 17 (etiqueta de objeto) · 20 · 22 (wordmark y títulos). Tracking
−0.01em / −0.005em / 0.04 / 0.06 / 0.08 / 0.12 / 0.18 / 0.22em. Pesos 400/500/600/700.

Advertencia técnica (`app/src/main.tsx:2-9`): Inria **solo tiene cuerpos 300/400/700**.
Los pesos 500 y 600 del sistema los sintetiza el navegador, con poca fidelidad. Hoy se
cargan 12 archivos de Inria más JetBrains Mono variable (`main.tsx:10-22`).
Recomendación: usar solo 400/700 (con itálicas) en Inria y dejar 500/600 para Mono.

**Hairlines**: 1px `rule`, 1px `ruleStrong` y 1px dotted. Nunca sombras de elevación.
Transiciones de 100-150 ms solo en color.

**Glifos de chrome** (`07-glyphs.md`, realizados en `app/src/ui/codex/glifos.ts`):
`※` selección única, `△` severidad (mejora/alta), `!` bloqueo, `▸` ítem actual del árbol,
`▢` mini-estado, `·` separador universal, `+` crear, `✕` cerrar, `✓` limpio/on,
`—` vacío, `↵` `⌫` `⌘` `⌃` `⇧` `⌥`, `→` causalidad en marginalia, `▾` caret, `« »` citas.
Prohibidos: `•`, emoji, chevrons `>`, `…` para truncar etiquetas del OPD. Formato
`kbd`: mono 10px, borde `rule`, sin guiones (`⌘⇧A`). En otras plataformas usa
`Ctrl+…` (`glifos.ts:59-64`).

**Tipografía OPL en el producto** (`app/src/ui/codex/oplTipografia.tsx:52-83`, que es
lo que efectivamente se ve):

- Objeto: serif bold con subrayado sólido de 1px en tinta.
- Proceso: serif bold itálica con subrayado discontinuo de 1px.
- Estado: mono 0.86em en oliva sobre `stateFill`, con padding `0 4px`.

Esto amplía `04-opl-rendering.md` §1, que no prescribe subrayados. Los subrayados son
una buena decisión, porque permiten distinguir objeto y proceso sin depender de la
itálica.

**Canvas (JointJS)**: fondo transparente sobre paper, sin grid por defecto, conectores
rectos y hairlines de enlace de 1px en tinta. La etiqueta de objeto es Inria Serif 17
regular; la de proceso es Inria Serif 17 itálica (`composers/entidad.ts:143-146`); la de
estado es Inria Serif 13 itálica (`entidad.ts:915-928`). La selección se marca con un
subrayado crimson bajo la etiqueta.

### 2.4 Documentos 01–08: vigencia y divergencias verificadas con el producto

| Punto | ui-forja dice | Producto real | Evidencia |
|---|---|---|---|
| Altura del header | 60 px (`02-components.md:34,71`; `tokens.json` `layout.headerH`) | 48 px | `app/src/ui/codex/CodexFrame.tsx:44` (`CODEX_HEADER_HEIGHT = 48`) |
| Footer | 44 px con fecha, teclas y estado (`01` §2, `02` §13, `03` §01) | No existe; un test exige que no exista | `e2e/27-visual-compliance-25-05.spec.ts` (`footer` con conteo 0); `CodexFooterKey.tsx` sin importadores |
| Columna OPL | 360 px (`GOVERNANCE.md:36`, `01:86`) | 240 px por defecto (160-400), redimensionable | `store/runtime.ts:64-68` |
| Columna derecha | 360 px | 360 (240-560) ✓ | `store/runtime.ts:57-61` |
| Frame | 1700×950 fijo | fluido, con divisores de 6px | `CodexFrame.tsx:57-62` |
| Command palette | 6 secciones MODELO/CREAR/NAVEGAR/EXPORTAR/VISTA/ASISTENTE (`02` §8) | 3 secciones CONTEXTUAL/CREAR/RECIENTES | `ui/CommandPalette.tsx:81` |
| "Selection · LIVE" | en el divisor del inspector (`03` §04) | prohibido por test | `e2e/27-...spec.ts` (`not.toContainText("LIVE")`) |
| Sub-etiqueta de índice `o.01` bajo el símbolo | obligatoria (`08` §1) | `display: "none"` | `composers/entidad.ts:153` |
| Clasificación OPL | «No collapsar como "es un objeto informacional y sistémico"» (`04:70`, regla R4 `04:245`) | Se colapsa en una oración coordinada (forma OPCloud) | `app/src/opl/generadores/estructural.ts:25-33` |
| Ejemplo precargado (`04` §12) | 24 oraciones con «consta de» y «cambia…» | El fixture real tiene exhibición, instrumento y efecto | salida de `generarOplTexto` sobre `crearSystemDiagramFixture` |
| Iconos | «Codex no usa iconos vectoriales» (`01` §8, §11) | 9 SVG de OPCloud en el chrome y glifos SVG en la toolbar | `ui/panelCarpetas/Tile.tsx:2-5`, `ui/toolbar/ToolbarBase.tsx:40-100` |
| Glifo de estado en la toolbar | (rountangle, por coherencia con el canvas) | rombo `M6 1.5 10.5 6 6 10.5 1.5 6Z` | `ToolbarBase.tsx:95` |
| Semántica del color | «canal informativo, no normativo» (`01` §3.2, enmienda del 2026-06-12) | `tokens.css:26` sigue diciendo «Estos tres colores son SEMÁNTICOS — codifican la clase» | contradicción interna |
| Versión | v1.2 en README, GOVERNANCE, 01 y tokens | `02`, `03` y `05` dicen v1.1; `04`, `06`, `07` y `08` dicen v1.0 | encabezados; el gate solo revisa 5 archivos |
| Capturas | layout "Índice ← canvas → OPL" (izquierda 210 px) | layout invertido `OPL ← canvas → Índice + Inspector` | `screenshots/01-editor.png`, `variant-codex.jsx:72` |

Otros contenidos de `01–08` quedaron derogados de forma explícita por
`spec-forja-opd-es`, pero siguen en el texto como historia inline. Son la
GAP-OPD-UIFORJA-08a/b/c de `08-jointjs-styling.md`: estado como píldora a favor del
rountangle, cuadrado de exhibición y círculo de instanciación a favor de la topología
del triángulo, y routing por familia. `06-ssot-compliance.md` audita contra una SSOT
anterior (OPM-ES v3.0.0, 2026-04-27, reglas V-63…V-212) que ya no gobierna. Su propio
README lo declara «auditoría histórica».

Contenido que **sí** está vigente y es útil, y que conviene conservar condensado:
filosofía (01 §1); paleta y tipografía (01 §3-§6); estados de interacción (01 §9,
05 §3-§4: hover sube de inkMid a ink, foco con outline crimson de 1-2px y offset 2px,
ítem activo `paperWarm` con borde izquierdo crimson de 2px); patrones prohibidos
(02 apéndice: nada de `Button` con fondo, radio y sombra; nada de toasts; nada de
switches con bola; nada de overlay oscuro en modales, cuyo backdrop es paper al 80 %
con blur de 2px); catálogo de glifos (07); y resumen diagnóstico (05 §6: `! N bloqueos`
en crimson, `△ N mejoras` en oliva, `· N observaciones` en inkMid).

### 2.5 El gate `design:governance` (`app/scripts/design-governance-audit.mjs`, 242 líneas)

Qué verifica:

1. Que `ui-forja/GOVERNANCE.md` exista y **contenga las cadenas** `reglas-opm-estrictas.md`,
   `SSOT suprema`, `OPL ← canvas → Índice + Inspector` y `bun run design:governance`
   (líneas 158-161).
2. Que `README.md` enlace a `GOVERNANCE.md`, y que `01-design-spec.md` contenga
   «margen izquierdo» y «herramientas de edición» (líneas 166-171).
3. Que `major.minor` coincida en 5 artefactos de versión (líneas 54-88).
4. Que `tokens.json.layout.colLeft` sea `"360px"` y `tokens.css` contenga
   `--cx-col-left:   360px;` (con tres espacios literales, líneas 173-176). **Compara el
   documento consigo mismo**: el runtime usa 240 px.
5. Que 13 colores, 5 strokes, fs13, fs22 y los pesos 500/600 de `tokens.json` sean
   iguales a los de `tokens.ts` (líneas 180-212).
6. Radios de chrome en 0 y sombras de elevación en `none` (líneas 213-214).
7. Un escaneo por regex de sombras offset en `src/ui` y `src/render/jointjs`
   (líneas 124-155). Es el único control de producto real.
8. Un aviso si cambian los aliases legacy `#70E483` y `#3BC3FF`, que no se usan
   (línea 218).

Juicio: el gate protege la coherencia entre copias, no la experiencia. El resultado
es que una reescritura con una sola fuente de tokens lo vuelve innecesario, salvo el
lint de sombras y colores fuera de tokens, que conviene conservar como regla de eslint
o test de 30 líneas.

### 2.6 Realización en la app: espejos, compat-shims y componentes muertos

**Cinco copias de los tokens**, con deriva:

| Copia | Ubicación | Notas |
|---|---|---|
| A | `ui-forja/tokens.css` | ningún código la importa |
| B | `ui-forja/tokens.json` | la lee solo el gate |
| C | `app/src/ui/tokens.ts` (473 líneas) | fuente runtime real del chrome |
| D | `app/src/render/jointjs/constantes.codex.ts` (52 líneas) | hex duplicados «espejo de ui-forja/tokens.css» |
| E | `app/index.html:8-131` (`:root` con `--ink`, `--paper`, `--ink-50` y otros) | **valores distintos**: `--paper-02 #f4f3ec` (≠ `#eeece2`), `--ink-50 #a39e92` (≠ `#6b665c`), `--ink-15 #e4e0d6` (≠ `#d3cec1`) |
| (F) | `ui-forja/src/variant-codex.jsx:21-37` | copia de referencia |

`tokens.ts` también contiene un **compat-shim desmesurado**: unas 140 claves de color
(líneas 29-207) que colapsan a 13 valores. Por ejemplo, `warning`, `ocre`, `terracota`,
`naranja`, `rojoOpcloud`, `alertaAmbar`, `errorRojo`, `destructivoBase` y `azulAccion`
son todas `crimson`. Hay alrededor de 55 claves sin ningún `colors.<clave>` en el código.
`shadows` tiene 30 claves, casi todas `"none"` (líneas 262-295). `radii` tiene 9 claves,
7 de ellas en 0. `typography` duplica la escala con `sizes`, `size*` y `weight*` (líneas
354-384). `colors.canvas` (líneas 47-57) conserva la paleta V1 de OPCloud sin
consumidores. Son deuda de migraciones sucesivas (Bauhaus y luego Codex) que nunca se
limpió.

**Fósiles de eras visuales anteriores vivos en el código:**

- `app/src/modelo/constantes.bauhaus.ts` (CANON-V2 «Bauhaus lavada», Ronda 28) y
  `modelo/constantes.ts:10-49`. Una paleta visual vive **dentro del kernel**, lo que es
  una violación de capas, y de ella solo se usa `CANON.dims.enlaceHitArea = 15`
  (`render/jointjs/agregacionBus.ts:314`, `autoinvocacionLoop.ts:175`).
- `app/src/ui/focus.css:5` documenta `--focus = #1F3FA6 ultramar (paleta Bauhaus L1)`,
  pero `index.html:34` define `--focus: #8e2a2e`.
- 61 menciones de «Bauhaus» y 34 de «cinabrio» en comentarios de `app/src`, `docs` y
  `ui-forja`.

**Componentes `app/src/ui/codex/`** (3.246 líneas incluidos los tests):

| Componente | Uso | Nota |
|---|---|---|
| `CodexFrame` | App | grid del shell; conservar la idea |
| `CodexCanvasMount` (377 líneas) | App | monta el paper, la barra de simulación y la anotación |
| `CodexSelectionAnnotation` (917 líneas) | vía `CodexCanvasMount` | la barra emergente tipográfica; demasiado grande |
| `CodexColHeader`, `CodexOplNote`, `CodexInspectSection`, `CodexInspectInline`, `CodexStateRow` | en uso | piezas pequeñas y buenas |
| `oplTipografia` y `glifos` | en uso | **alta calidad; portar tal cual** |
| `CodexInspectField` (100 líneas) | **solo su test** | muerto |
| `CodexFooterKey` (166 líneas) | **solo su test** | muerto (no hay footer) |

CSS fuera de tokens en superficies nuevas del 2026-09-30: `ui/portable/portable.css`
define su propia paleta (`--portable-ink #202421`, `--portable-paper #fbfcfa` y
`#667b6b`, `#395e47` en líneas 47, 74 y 109), y `ui/review/review.css` usa `#7b211d`.
Esto indica que el gobierno visual no alcanzó al último incremento.

### 2.7 Qué conservar del sistema visual (propuesta para la reescritura)

- Un único `tokens.ts` o `tokens.css` de unas 30 variables: 13 colores, 3 familias,
  unos 7 tamaños, 3 pesos, 4 trackings, 2 hairlines y 1 transición. El canvas y el
  chrome deben leer la misma fuente (la opción B de `08-jointjs-styling.md` §12 es
  correcta: leer variables CSS al definir los shapes).
- Principios: tipografía primero; hairlines sin sombras; crimson solo para UI; verde,
  azul y oliva solo en el canvas y en pills de clase; glifos Unicode; backdrop de papel
  con blur; foco visible crimson.
- Tipografía OPL de `oplTipografia.tsx` y catálogo de glifos de `glifos.ts`.
- Reglas de accesibilidad: texto mínimo de 11px (los 9 y 9,5 px actuales son
  demasiado pequeños), AA real y target de 24px. El contraste debe verificarse en el
  producto, no en la tabla del documento.
- Descartar la columna de 360 px fija, el frame de 1700×950, el footer y las 6
  secciones del palette. El producto ya demostró algo mejor: paneles redimensionables
  y un palette contextual.

---

## 3. Reglas OPM codificadas (sagradas) que tocan el área

Estas reglas **no** son estética. La reescritura debe preservarlas exactamente. Su
autoridad es `spec-forja-opd-es` y `reglas-opm-estrictas-es` (KORA, externas). Su
realización actual está en `render/jointjs`, y `ui-forja` solo las menciona.

### 3.1 Símbolos de cosas y estados (canvas)

| Regla | Realización | Ubicación |
|---|---|---|
| Objeto = rectángulo **sin radio**; proceso = elipse | `rect rx:0 ry:0` / `ellipse` | `app/src/render/jointjs/composers/entidad.ts:118,137-139` |
| Esencia **física** = sombra desplazada abajo a la derecha (canal semántico, se preserva en el export) | `filter dropShadow {dx:6, dy:6, blur:2, color: rgba(23,21,17,.68)}` | `entidad.ts:123-133`; la preservación del alfa en el export está en `mapaExport.ts:355-365` |
| Afiliación **ambiental** = contorno discontinuo, **heredado por la cadena de exhibición** (V-6 / R-OPD-STR-13); la discontinuidad codifica solo la afiliación (R-CTRN-1) | `strokeDasharray "8 4"` si `esAfiliacionEfectivaAmbiental` | `entidad.ts:102-113` |
| Cosa **refinada** = contorno grueso, no discontinuo | `strokeBase = refinada ? 4 : 1.5` | `entidad.ts:99` |
| El contorno de in-zoom (descomposición) contiene partes; el despliegue (unfold) no | `contornoRefinamiento` solo si el OPD activo es el de descomposición | `entidad.ts:88-97` |
| Estado = **rountangle de radio fijo** (no píldora; GAP-OPD-UIFORJA-08a) | `rx = ry = ESTADOS.radius = 8`; alto de 24 | `entidad.ts:878-885`, `composers/estados.ts:177-187` |
| Estado **inicial** = contorno grueso | `strokeWidth 3` | `entidad.ts:888` |
| Estado **final** = doble contorno (y relleno algo más oscuro) | `stateFinalInner` con inset de 3px y `estadoFinalFill #d6d2c6` | `entidad.ts:886,902-913` |
| Estado **por defecto** = marca `↗`; estado **actual** = marca `●` | texto SVG en la esquina de la cápsula | `entidad.ts:930-955` |
| Estados layout-managed dentro del objeto (no se sacan del contorno) | proyección ignora x/y manuales extremos | bugs `BUG-20260605T041307Z-eb3b17` y `BUG-20260605T035637Z-b91e85` (`docs/bugs/HISTORY.md`) |
| Etiqueta nunca truncada en silencio (V-212) | `textWrap … ellipsis:false` | `constantes.codex.ts:31-33`, `entidad.ts:147,926` |
| Afordances UI (índice `o.NN`, `data-*`, halos, handles) no se exportan al canon (V-202) | `index display:none`, `data-cap-rol` | `constantes.codex.ts:34-43`, `entidad.ts:890-898` |
| La grid de edición nunca aparece en el export canónico (R-OPD-LAY-3) | `drawGrid:false` por defecto; grid como preferencia | `08-jointjs-styling.md` §0, §14 |

### 3.2 Marcadores de enlace (`app/src/render/jointjs/linkAssets.ts`)

| Familia | Marcador | Línea |
|---|---|---|
| Consumo y resultado | swallowtail cerrado `M 0 0 L 23 8 L 12 0 L 23 -8 Z`, relleno paper y trazo ink; la dirección distingue consumo de resultado | 24, 43-57 |
| Efecto | el mismo swallowtail en origen **y** destino (bidireccional) | 58-63 |
| Agente | lollipop **lleno** (círculo r=5 relleno ink con palito de 7px) | 28-35 |
| Instrumento | lollipop **vacío** (relleno paper) | 36-42 |
| Invocación | rayo o zigzag en el tramo más swallowtail en destino | 64-70 |
| Excepción de sobretiempo, subtiempo y sub/sobre | polilíneas de 1, 2 y 3 trazos | 71-82 |
| Etiquetado uni y bidireccional | polilínea abierta | 83-90 |
| Agregación | triángulo **lleno** | 93-97 |
| Exhibición | triángulo con triángulo interior | 98-102 |
| Generalización | triángulo **vacío** (relleno paper) | 103-110 |
| Clasificación/instanciación | triángulo vacío con **punto interior** (r=4) | 111-117 |
| Abanicos lógicos | XOR con un arco de r=30; OR con dos arcos concéntricos de r=30 y r=35 | 118-125; `abanicoOverlay.ts:7-10` |

Todos los enlaces van en tinta: la distinción es por marcador y nunca por color (V-63).
El hit-area del enlace es de 15px (`modelo/constantes.ts:44`, evidencia en JOYAS §4).

Esta tabla es **material de alta calidad para portar casi tal cual**: son geometrías
normalizadas desde los SVG canónicos de OPCloud, verificadas por tests
(`proyeccion.test.ts` y `composers/markers.test.ts`).

### 3.3 Reglas de OPL que menciona `ui-forja` (verificar contra `spec-forja-opl-es`)

- Tipografía canónica: objeto en **bold**, proceso en ***bold itálica***, estado en
  `mono` (`04-opl-rendering.md` §1, «§1.7 opm-opl-es»). Está realizada y es correcta.
- Verbos ES: consume, **genera** (no «produce»), afecta, cambia…de…a, maneja,
  requiere, **consta de** (no «consiste en») y exhibe (`04:37-48`).
- «puede **estar**» para estados y «es» para propiedades invariantes (`04:53`).
- El estado va después del objeto con «en»: «requiere **Horno** en `precalentado`»
  (`04:120-126`).
- Un modelo tiene una sola lengua OPL activa; cambiarla regenera todo (`04:207-210`).
- **Conflicto abierto**: `04:70` y R4 (`04:245`) prohíben colapsar la clasificación,
  pero `opl/generadores/estructural.ts:25-33` la colapsa a propósito («forma
  OPCloud»), igual que OPCloud (`fixtures/onstar-system/*-opl.txt`: «Driver is a
  physical and environmental object.»). Lo decide `spec-forja-opl-es`, no `ui-forja`.
  La reescritura debe sacar la sintaxis OPL de cualquier documento visual.

### 3.4 Canal UI reservado

- Crimson solo para UI (V-203): selección, foco, marquee (borde dashed crimson más
  relleno al 6 %), vértices en edición, alertas. Olive **nunca** marca selección,
  porque es semántica de estado (`04:162`).
- Rojo, amarillo y verde de alerta no se reutilizan como semántica tácita en el OPD
  (V-210, `06:118-126`).

---

## 4. `opm-extracted/` — la ingeniería inversa de OPCloud

**Qué es.** Son 349 archivos `.ts/.js` (unas 164,8 mil líneas y 7,8 MiB) reconstruidos
desde el bundle público de producción de `opcloud.systems` (webcrack, luego
`tools/extract.mjs`, `tools/refactor.mjs` y `tools/build-index.mjs`). Replica la
estructura Angular original: `models/` (unas 55 mil líneas),
`dialogs/` (71 carpetas, unas 35,5 mil líneas), `modules/`, `rappid-components/`,
`services/dcm`, `sysml-converters`, `ImportOPX`, `database` (Firebase y MSAL), más
`_raw/` (14 chunks originales), `assets/` (copia) e `INDEX.md` y `MODULES.md`
generados.

**Estatus legal** (`opm-extracted/README.md` §Política y `NOTICE.md`): es código de
OPCloud Ltd. El repo lo declara «derivado curado» y **no** fork autorizado, y prohíbe
copiar bloques a `app/`. No hay licencia repo-wide. **Riesgo**: versionar 12 MB de
código propietario decompilado en el repositorio del producto no aporta a la
ejecución y es un pasivo legal y de peso.

**Consumo real**: unos 40 comentarios «Ref:» en `app/src` que citan rutas, por ejemplo
`modelo/tipos/*.ts`, `modelo/checkers.ts:21-26`, `render/jointjs/linkAssets.ts:121` y
`modelo/integridadReferencial.ts:22-24`. Este último cita rutas absolutas
`/home/felix/projects/...`. Hay además **un test acoplado**,
`app/src/modelo/paridadOpcloud.test.ts:8`, que lee
`opm-extracted/src/app/models/consistency/behavioral.rules.ts` para confirmar que la
lista `OPCLOUD_BEHAVIORAL_RULES` (`modelo/paridadOpcloud.ts:1-41`) enumera las 39
clases y declara que 7 están implementadas y 32 pendientes. La regeneración necesita
`decompiled/`, que está ignorado y ausente, y `setup.sh` con hashes de abril.

**Valor de estudio** (lo que la reescritura debería extraer una vez a una nota de
referencia propia y luego soltar):

1. **La separación lógico/visual/dibujado**: `LogicalPart` (`OpmLogicalObject/Process/State`)
   frente a `VisualPart` (`OpmVisual*` por OPD) frente a `DrawnPart` (celdas Rappid).
   opforja ya la adoptó como `entidades` + `apariencias` por OPD.
2. **Catálogo de reglas de consistencia de OPCloud** (referencia, **no canon**; la SSOT
   manda):
   - *Structural* (`models/consistency/structural.rules.ts`):
     `StateCannotConnectToFather` (16), `ObjectAndStateCannotConnectToThemeselfs` (38),
     `StateCannotConnectToFatherStates` (59), `ObjectCannotBeConnectedToItsStates` (81),
     `ThingCannotConnectToFather` (103), `InzoomedProcessCannotConnectToIsSubProcess` (124),
     `Semifoldinglinks` (148), `CannotLinkToValueTypeObjec` (172),
     `CannotLinkToRequirementObject` (205), `SourceAndTargetOnSameOPD` (276).
   - *Behavioral* (`behavioral.rules.ts`, 39 clases): proceso sin enlaces
     procedimentales a sí mismo (13); a lo sumo un enlace entre dos entidades (41, 77,
     116, 1052); no conectar lo ya consumido (152, 194); no usar como instrumento antes
     de su creación (245, 287); invocación y autoinvocación de procesos con in-zoom
     (329, 359); ningún enlace procedimental objeto↔objeto (389); una parte física no
     puede serlo de un todo informático (416, 449); exhibición a física (478);
     advertencia de consumo legal (525); matriz tipo↔tipo por enlace (558-742); cosa
     con in-zoom sin estructurales explícitos a sus hijos salvo agregación (765);
     excepciones temporales solo proceso→proceso (791-845); un solo nivel de
     instanciación (872, 901); la especialización de algo físico es física (930);
     submodelo compartido (959, 988); exhibición recursiva prohibida (1017); instrumento
     desde objeto y estados, donde persiste el del objeto (1085, 1114); agente e
     instrumento excluyentes sobre el mismo objeto (1140, 1184).
   - *Consistional* (`consistional.rules.ts`): `BaseConsistency` (23),
     `AgentConsistency` (54), `FundamentalConsistency` (91),
     `ProceduralConsistency` (118).
3. **Checkers metodológicos** (`dialogs/methodological-checking-dialog/checkers/*`):
   nombres de proceso en gerundio (-ing), nombres de objeto en singular, contenido
   in-zoomed y unfolded, proceso transformador y función principal sistémica. Ya
   reimplementados en `app/src/modelo/checkers.ts`.
4. **Geometría y convenciones visuales**: markers (`shared.ts`), arcos XOR/OR
   (`shared.ts:5908-5914`), `opmStyle` (colores V1) y dimensiones de 135×60 (JOYAS §2).
5. **Formato de intercambio OPCloud** (`models/json.model.ts`, `JsonModel.toJson`):
   útil solo si algún día se importa desde OPCloud. La épica EPICA-70, importación
   OPCAT, está **descartada** según el `CLAUDE.md` histórico.

**Recomendación**: **cortar** del repo del producto. Antes, (a) dejar la lista de
reglas OPCloud (ya existe en `paridadOpcloud.ts`) y eliminar el test que lee el
archivo decompilado; (b) reescribir los comentarios «Ref: opm-extracted…» como
referencias a la SSOT o eliminarlos; (c) archivar el directorio en un repo privado de
investigación. `docs/JOYAS.md` (302 líneas, en docs) ya destila lo esencial.

---

## 5. `assets/`

84 archivos: SVG de toolbar, halos, archivos y marcadores de enlaces (con las
variantes Condition, Event y Negation) y PNG del wizard y de iconos. Todos se bajaron
del CDN de OPCloud con `setup.sh` (líneas 76-168). `opm-extracted/assets/` es una copia
casi idéntica: `diff -rq` solo difiere en `INDEX.md` y `links/logical/`, que existe
únicamente en `assets/` y es un placeholder propio de un triángulo `#586D8C`.

**Uso real en la app** (imports en build):

| SVG | Importado por |
|---|---|
| `regFile.svg` | `ui/panelCarpetas/Tile.tsx:3`, `ui/PanelCarpetas.tsx:3`, `ui/DialogoSubmodelo.tsx:2`, `ui/DialogoComposicion.tsx:2` |
| `folder.svg`, `autosave.svg`, `verFile.svg` | `Tile.tsx:2-5`, `DialogoCargarModelo.tsx:3-6`, `DialogoGuardarComo.tsx:3` |
| `delete.svg` | `MenuContextualArbol.tsx:2`, `MenuContextualEntidad.tsx:2` |
| `editAlias.svg`, `editUnits.svg` | `inspector/SeccionAtributo.tsx:2-3`, `DialogoCargarModelo.tsx:4` |
| `lock.svg` | `DialogoCargarModelo.tsx:5` |
| `objectDrag.svg` | `toolbar/ToolbarBase.tsx:10` |

Los 17 SVG de `links/**` figuran solo como string `source:` de procedencia en
`linkAssets.ts:29-124`. La geometría efectiva está incrustada como paths. Los otros 58
archivos no tienen ningún uso.

Estos iconos son de marca OPCloud: por ejemplo, `delete.svg` es un círculo con relleno
`#1A3763` al 80 %, en su paleta y no en la de Codex. **Contradicen** la regla de
glifos Unicode (`01-design-spec.md:281`). `Dockerfile:31` copia `assets` porque el
build de Vite los resuelve.

**Recomendación**: **simplificar y luego cortar**. Reemplazar los 9 iconos por glifos
(`⌫`, `+`, `▸` y otros) o por SVG propios de 1px en tinta; eliminar
`COPY assets` y el directorio.

---

## 6. `fixtures/`

Hay dos familias con formatos distintos, y **ningún código carga ninguna de las dos**
(verificado con grep en `app/src`, `app/scripts` y `app/e2e`).

**a) Capturas del sandbox de OPCloud** (`onstar-system/`, `opm-meta-model/`, `sd-async/`,
`sd-sync/`, `system-diagram/`, `empty-model/`, `meta/`). Son scrapes del DOM, no
modelos. Cada JSON trae `{cells[], linkPaths[], triangleAggs[], defs[], types{}, oplText}`,
con celdas `opm.Process/Object/State/Link/TriangleAgg`, coordenadas y SVG, más el PNG del
OPD y el OPL inglés (`*-opl.txt`), por ejemplo «OnStar System consists of Cellular
Network, GPS, …». `meta/` guarda la estructura del DOM y la toolbar de OPCloud. Valor:
golden **visual y textual** de OPCloud (la forma de OPL EN que imita el generador).

**b) `demo-models/`**: 7 modelos × {`.json`, `.opl.txt`, `.md`}, generados por
`app/scripts/generar-demos.ts:15` desde `app/src/modelo/fixtures.ts` (625 líneas, usado
solo por tests y por ese script). Formato (contrato persistido actual, cita de
`app/src/serializacion/json.ts:19-25`):

```ts
const FORMATO = "deep-opm-pro.modelo.v0";

export interface DocumentoModelo {
  formato: typeof FORMATO;
  modelo: Modelo;
  carpetaId?: Id | null;
}
```

Forma observada de `modelo` en `fixtures/demo-models/System_Diagram.json`:
`{ id, nombre, opdRaizId, entidades{ "o-1": {id,tipo:"objeto"|"proceso",nombre,esencia:"informacional"|"fisica",afiliacion:"sistemica"|"ambiental"} }, estados{ "s-17": {id,entidadId,nombre,esInicial?,esFinal?} }, nextSeq, opds{ "opd-1": {id,nombre:"SD",padreId, apariencias{ "a-2": {id,entidadId,opdId,x,y,width,height} }, enlaces{ "ae-20": {id,enlaceId,opdId,vertices[]} } } }, enlaces{ "e-19": {id,tipo:"exhibicion"|"efecto"|…,origenId:{kind:"entidad",id},destinoId:{kind,id},etiqueta} }, abanicos{} }`.

El formato completo y sus extensiones (familias por preestado, mesa, piezas y
declaraciones no nucleares) pertenecen al dossier de serialización. Otros
identificadores de formato vigentes son `deep-opm-pro.log-decisiones.v0`,
`deep-opm-pro.mesa-exploracion.v1` y `opforja.piece.v1`.

**Desactualización comprobada**: el `.opl.txt` versionado dice «Main System Doing
produce Main Output», «usa System Name», «System Handler manipula…», «esta inicialmente
en problematic». El generador actual, ejecutado sobre el mismo fixture, emite «*Main
System Doing* genera **Main Output**», «requiere **System Name** y **System Tool
Set**», «**System Handler** maneja *Main System Doing*» y «Estado `problematic` de
**Beneficiary Relevant Attribute** es inicial». Los artefactos no se regeneraron
desde el commit raíz.

**Recomendación**: **cortar** `fixtures/` entero del repo del producto. Si se quiere un
golden, conservar 2 o 3 casos de la familia (a) como `*.opl.txt` bajo
`app/test/golden/`, con su procedencia. Las demos deben generarse en build o test,
nunca versionarse como salida.

---

## 7. `catalog/`, `config/`, `webroot/`, `setup.sh`

- `catalog/classes.txt` (376 clases) y `catalog/modules.md` (17 filas con chunk, tamaño y
  clases). Es el índice previo a `opm-extracted/INDEX.md`, que lo supera (486 clases).
  **Cortar.**
- `config/routes.json` (rutas Angular de OPCloud: login, dsm, graph-insights, nlp…),
  `firebase.json`, `edx.config.json` y `assets.json`. Muestran cuánto más grande es
  OPCloud (organizaciones, DSM, SysML, NLP). Sirven como contraste de alcance, no como
  contrato. **Cortar.**
- `webroot/index.html` (index de OPCloud con Google Tag Manager `G-Z8Y7TVP1HK`) y
  `favicon.ico`. **Cortar**; no conviene versionar el index de terceros con tracking.
- `setup.sh`: `set -e`; descarga `main.a8737ee2a8ed30eb.js` y otros cuatro bundles
  (hashes fijados, líneas 16-20), ejecuta `npx webcrack` y descarga unos 60 SVG y 12 PNG
  con `curl`. No es reproducible si OPCloud cambió el deploy, y no se usa. **Cortar**
  junto con `opm-extracted`.

---

## 8. Skills `.codex/skills/lineas-paralelas` y `.opencode/skills/lineas-paralelas`

Ambos archivos son idénticos (verificado con `diff`) y tienen 216 líneas. Instruyen
particionar pendientes en N «líneas» paralelas, con `README` maestro, un brief de 11
secciones obligatorias por línea y un `prompt-asignacion.md` bajo
`docs/instrucciones-lineas-dev/<ronda>/`.

Problemas:

- Apunta a rutas inexistentes: `docs/instrucciones-lineas-dev/ronda3/` fue borrado en
  `557c7ec`; `/home/felix/projects/deep-opm-pro/opm-extracted/` es una ruta absoluta de
  otra máquina; la SSOT fuente está en `~/kora/artifacts/skills/...`; y declara
  despliegue en `.claude/skills/`, que no existe.
- Impone «Reuso obligatorio … especialmente `opm-extracted` … Buscar ahí en
  profundidad antes de crear soluciones nuevas; reciclar código», lo que choca con la
  política legal de `opm-extracted/README` («No copiar bloques tal cual»).
- Es la herramienta del proceso por «rondas» y «líneas» (Ronda 1…28+, Codex L1–L6) que
  generó gran parte de la acreción documental.
- `.gitignore` ignora `.codex/` y `.opencode/`, pero se versionan igual.

**Recomendación**: **cortar**. No aporta capacidad al producto.

---

## 9. Historia

### 9.1 Prehistoria (antes del Git visible), reconstruida desde la evidencia importada

El Git visible empieza el 2026-07-26 con `56bab8d`, un commit raíz que importa **2.271
archivos y unas 480 mil líneas**. Los hashes que citan los documentos (`bfb6c6c3`,
`4cacc33f`, `cf27104d`, `92dbbaa7`, etc.) pertenecen a una historia anterior que no se
conserva. Con fechas en nombres de archivo, bugs y documentos, se reconstruye así:

| Fecha | Hito | Evidencia |
|---|---|---|
| ~2026-04 | Ingeniería inversa de OPCloud: `setup.sh`, `decompiled/`, `catalog/`, capturas del sandbox en `fixtures/`, `JOYAS.md` (2026-04-28) | `docs/JOYAS.md:3`, `setup.sh` |
| 2026-04/05 | `opm-extracted/` curado y versionado; kernel propio en Bun, Vite, Preact, Zustand y JointJS core | `opm-extracted/README.md`, `.gitignore` |
| 2026-05 | MVP alpha, luego beta1 (búsqueda, tabla de enlaces, validación metodológica) y beta2 (modo simulación); command palette; capturador de bugs (primer bug el 2026-05-13) | nombres `e2e/08-mvp-alpha…`, `11-beta1-*`, `12-beta2-*`, `docs/bugs/HISTORY.md` |
| ≤2026-05 | Era visual V1 fiel a OPCloud (`#70E483`, `#3BC3FF`, `#586D8C`, Arial 14/600) y luego CANON-V2 «Bauhaus» (Ronda 28: fills lavados, ink `#0A0A0A`, cinabrio `#C8392F`, ultramar `#1F3FA6`, Inter Tight) | `modelo/constantes.bauhaus.ts:1-23`, `focus.css:5` |
| 2026-05-23…26 | Propuesta «Codex» (variante 4, reemplaza el magenta de «Drafting»), `ui-forja` v1.0→1.2 (25 de mayo); ráfaga de unos 60 bugs visuales; auditoría de alineación OPL (26 de mayo) | `variant-codex.jsx:1,35`, `01-design-spec.md:6`, `e2e/27-visual-compliance-25-05` |
| 2026-06-01 | CANON-V4: Codex con punta cerrada swallowtail de OPCloud | `linkAssets.ts:5` |
| 2026-06-04…09 | Acta «mesa ↔ dominio», persistencia backend (Postgres), **backend-only** sin localStorage (6 de junio), tormenta de bugs de estados (5 de junio, que termina retirando la geometría libre de estados), paneles ocultables y redimensionables (8 de junio) | `docs/auditorias/2026-06-04-*`, `HISTORY.md` |
| 2026-06-11/12 | Auditoría integral y auditoría SSOT del corpus; `GOVERNANCE` v1.2 interpone `spec-forja-opd-es` y deroga partes de `08` | `GOVERNANCE.md:8`, `08-jointjs-styling.md:9-11` |
| 2026-06-14/15 | Invocación implícita bimodal y `ordenInzoom`; KORA-pneuma pasa a ser la SSOT viva | `docs/specs/2026-06-1{4,5}-*`, `CLAUDE.md` histórico |
| 2026-06-22 | Decommission de los repos legados `opmodel` (OPL-first, ADR de isomorfismo) y `opm-model-app` (formalización categórica, 263 reglas); opforja queda como sucesor | `docs/reference/PROCEDENCIA.md` |
| 2026-06-24…30 | Anclaje, Calcar y Pieza, Centinela de drift, modo Apunte | `docs/auditorias/2026-06-2*`, `docs/superpowers/specs/2026-06-*` |
| 2026-07-06…09 | Apuntes y Taller, puente mesa↔skill, chrome de gestión, reauditoría UX diagramática; bugs de breadcrumb, atajo R y OPL de proceso en apunte | specs 2026-07-06, `HISTORY.md` |
| 2026-07-18…22 | Roadmap del 18 de julio; Tutor contextual (21 de julio); «convergencia integral a `main`» (22 de julio) | handoff histórico `docs/handoff-2026-07-21.md` en `56bab8d` |

### 9.2 Historia Git visible por fases

| Fase | Commits | Qué se hizo | Balance |
|---|---|---|---|
| **A. Cierre del Tutor y ciclo reversible** (26-27 de julio) | 33 (`56bab8d`…`1e1ba35`) | Tutor con fuentes Markdown; OPL de bocetos sueltos; **ciclo de modelado reversible** Apunte/Modelo y Boceto/OPD integrado (`7c4c77e`, +2.687 líneas); integración serializable; a11y (inkSoft `#807b6e`→`#6b665c`, `4537319`); **21 de los 33 commits son solo documentales** (handoff, ops, «cerrar P1…P5», «paridad 28/28») | producto: unas 3,6 mil líneas; burocracia: unos 1,2 mil líneas de handoff reescrito una y otra vez |
| **B. Consolidación y poda** (3-10 de agosto) | 8 (`2e7246a`…`056ff25`) | `CLAUDE.md` (150 líneas) → `AGENTS.md`; `ui-forja` README de 212 a 71 líneas; **−4.928 líneas de docs** (auditorías, handoff de 1.094 líneas, notas, specs muertas); se retira el estado duplicado y el quality-ledger; **−4.123 líneas de código y tooling inerte** (sondas de bugs, `ciclo-visual-*.mjs`, `evaluacion-exhaustiva.mjs`, slices de store compat); palette visible; bug capture con sesión | neto de unas −9,7 mil líneas |
| **C. C04: canon de familias por preestado y refactors** (2-9 de septiembre) | 20 (`9cb55a9`…`07fddc1`) | **Familias de efectos TS3 por preestado** (extensión tipada; no es AND/OR/XOR; round-trip JSON/OPL/Proto; dos segmentos visuales y una identidad lógica); **Mesa de exploración** (fuente→propuesta→hecho OPM con procedencia); tarjetas de declaraciones no nucleares; separación de validadores de serialización, sesión HTTP, reglas del core, diálogos y parser OPL; deploy que verifica salud y SHA; controles de emisiones de skills KORA; merge de la rama `fxai/c04-opforja-canon` con estrategia *ours* | unas +7,8 mil / −3,4 mil |
| **D. Producto integrado** (30 de septiembre) | 6 (`d94ee1f`…`8ada528`) | layout que respeta `ordenInzoom`; IDs estables explícitos; integridad referencial en el kernel; **simulación que explica escenarios** (+2.099); evaluación Jev (+1.202 de docs y evidencia); **`8ada528`, un solo commit con 194 archivos y +24.703 líneas**: agente LLM (MiMo) con operaciones tipadas, recibos e inversas, repositorio local offline, cola de sync y conflictos, revisión compartida por token, paquete portátil con lector y service worker, piezas reutilizables con linaje, Postgres para agente y revisión. **No desplegado**; queda pendiente la credencial de inferencia (`HANDOFF.md`) | unas +28 mil |

### 9.3 Giros y decisiones notables

- **Lo visual se subordinó a la semántica.** Al principio `ui-forja` prescribía
  geometría OPM (píldoras, cuadrado de exhibición, círculo de instanciación). El
  2026-06-12 se interpuso `spec-forja-opd-es` y se derogaron esas partes. Lección para
  la reescritura: separar desde el inicio **tokens estéticos** de **gramática visual
  OPM**.
- **Cambio de paleta tres veces en pocas semanas** (V1, V2 Bauhaus y Codex) sin
  borrar las anteriores. El costo quedó en compat-shims (§2.6).
- **La geometría libre de estados se retiró** tras la tormenta de bugs del 5 de junio.
  Los estados pasaron a ser layout-managed y quedó un feature `BUG-…422d7d` de
  arrastrar cápsulas que convive con eso. Hay una tensión UX por resolver.
- **Doctrina «sin ellipsis» relajada** para los segmentos de breadcrumb (bug
  `BUG-20260708T205824Z-7f09f9`). V-212 se mantiene solo para etiquetas del OPD.
- **Persistencia**: se pasó de localStorage a backend-only (6 de junio) y de nuevo a
  local-first con sync (30 de septiembre, `persistencia/localRepository.ts`,
  `syncQueue.ts`). Es un giro completo de ida y vuelta en cuatro meses.
- **LLM**: primero hubo una decisión de «equilibrio» (el razonamiento asistido queda
  fuera del kernel, en `docs/decisiones/equilibrio-llm.md`) y luego un agente integrado
  con gateway servidor (30 de septiembre). El kernel sigue determinista.
- **Frontera producto↔dominio**: HODOM y gist viven fuera; hay amarras e2e aisladas en
  `playwright.external.config.ts` (`886cd56`).
- **Épicas descartadas**: EPICA-70 (importación OPCAT 4.2) y EPICA-91 (modo tutorial),
  según el `CLAUDE.md` histórico.

### 9.4 Lo que se retiró (visible en Git)

`docs/handoff-2026-07-21.md` (1.094 líneas), `roadmap-2026-07-18/08-09`,
`quality-ledger.md`, 6 auditorías y actas, `opcloud-enlaces-pendientes` (469 líneas),
spec `mobile-readonly-v1-steipete…` (731 líneas), `docs/instrucciones-lineas-dev/` completo,
`memorias-aprendizajes/*`, `solicitudes-upstream/*`, `protocolo-re-pin.md`. En código:
sondas `sonda-bug-*.mjs` (6), `ciclo-visual-*.mjs` (5), `evaluacion-exhaustiva.mjs`
(731 líneas), `helpPort`, `opdReorden` y unas 1.500 líneas de slices de store
(`carpetas`, `enlaces`, `mapa`, `persistencia`, `seleccion`, `uiPanel` y `workspaceMod`,
reducidos de unas 180 a unas 5 líneas cada uno en `db4d376`).

### 9.5 Patrones de proceso observables

- **Ceremonia de cierre**: los commits «docs(ops): cerrar P1…P5», «cerrar observación P5
  en GO», «paridad Tutor productiva 28/28» y los evaluadores nombrados («Steve Jobs …
  `INEVITABLE`», del handoff histórico) dejan evidencia narrativa extensa por cada
  cambio pequeño. 24 de 69 commits son solo documentales.
- **Commits monumentales**: `8ada528` (+24,7 mil líneas) y el raíz (+480 mil) impiden
  bisecar y revisar.
- **Gobierno por gates**: `check`, `lint`, `build`, `design:governance`,
  `cordon:skill`, `cordon:estado`, `quality:gate` (ledger de «leyes» y presupuesto de
  bundle), `browser:smoke` y `gate:refactor`, que los encadena todos
  (`app/package.json:21`). Varios verifican documentos o pins de skills KORA, no el
  producto.
- **Mensajes con contexto, decisión, invariantes y verificación** en los commits
  semánticos de las fases C y D. Es una buena práctica y conviene mantenerla, pero con
  menos volumen.

---

## 10. Olores de sobreingeniería y acreción (ejemplos concretos)

1. **Cinco espejos de tokens** con un gate que los compara en lugar de una fuente
   única (§2.6). `index.html` ya divergió.
2. **Compat-shim de unos 140 aliases de color** (`tokens.ts:29-207`), 30 claves de
   sombra `none` y aliases de tamaño y peso duplicados.
3. **Gate de gobernanza que busca frases literales** en Markdown
   (`design-governance-audit.mjs:158-176`), incluida una cadena con tres espacios
   (`--cx-col-left:   360px;`).
4. **SSOT de versión del sistema de diseño** con un test dedicado
   (`design-governance-audit.test.mjs`) para que 5 documentos digan «1.2».
5. **Documentos normativos que ya no describen el producto** pero siguen en la
   precedencia como nivel 4 (§2.4). Invitan a «corregir» el producto hacia un diseño
   obsoleto.
6. **Mock de referencia de 1.162 líneas** (`variant-codex.jsx`) y escenas con React y
   Babel por CDN, sin uso.
7. **Paleta visual en el kernel** (`modelo/constantes.bauhaus.ts`), fósil de otra era,
   con una sola dimensión todavía viva.
8. **Componentes muertos con tests** (`CodexFooterKey`, `CodexInspectField`).
9. **`CodexSelectionAnnotation` de 917 líneas** para una barra de acciones
   tipográfica.
10. **12 MB de código ajeno decompilado** versionado como «referencia», con un test
    que depende de él y una skill que obliga a leerlo.
11. **84 assets de OPCloud** para usar 9, que además contradicen el sistema visual.
12. **Salidas generadas versionadas y desactualizadas** (`fixtures/demo-models`).
13. **Skill duplicada** con rutas absolutas de otra máquina y un directorio de salida
    ya borrado.
14. **Referencias absolutas** a `/home/felix/...` en comentarios
    (`modelo/integridadReferencial.ts:22-24`) y en `resolutor-urn.json`
    (`kora_raiz_default`).
15. **Superficies nuevas fuera del sistema visual** (`portable.css` y `review.css` con
    su propia paleta).

---

## 11. Contratos que una reescritura debe respetar o migrar

| Contrato | Dónde | Acción |
|---|---|---|
| Valores del lenguaje visual (13 colores, 3 familias, escala y tracking) | `ui-forja/tokens.json`, `app/src/ui/tokens.ts:13-27` | **Conservar valores**, con una sola fuente |
| Gramática visual OPM (§3.1-3.2) | `render/jointjs/composers/entidad.ts`, `linkAssets.ts`, `abanicoOverlay.ts` | **Preservar exactamente**; portar `linkAssets.ts` casi tal cual |
| Tipografía OPL (obj/proc/estado) | `ui/codex/oplTipografia.tsx:52-83` | **Portar** |
| Glifos y formato `kbd` | `ui/codex/glifos.ts` | **Portar** |
| Documento persistido `{formato:"deep-opm-pro.modelo.v0", modelo, carpetaId?}` | `serializacion/json.ts:19-25` | **Respetar o migrar con versión**; los modelos de producción existen (Postgres) |
| Otros formatos: `deep-opm-pro.mesa-exploracion.v1`, `deep-opm-pro.log-decisiones.v0`, `opforja.piece.v1` | `serializacion/*`, `modelo/reuse/*` | revisar en el dossier de serialización |
| Dependencia de build de `assets/` (9 SVG) | imports relativos y `Dockerfile:31` | **Eliminar** al sustituir los iconos |
| Precedencia semántica > spec OPD > estética | `GOVERNANCE.md` §1 | **Conservar el principio**; garantizar acceso a las SSOT KORA |
| Accesibilidad declarada: foco visible, target de 24px, WCAG 2.2 AA, sin overflow en 1280×800 ni 390×844 | `GOVERNANCE.md` §5.5 y §8 | **Conservar como criterio**, verificado en el producto |

---

## 12. Piezas de alta calidad para portar casi tal cual

1. `app/src/render/jointjs/linkAssets.ts`: geometría normalizada de todos los
   marcadores OPM.
2. La lógica de símbolos de `composers/entidad.ts:88-160` y `:870-955`: física,
   ambiental heredada, refinado, estados inicial, final, por defecto y actual. Se porta
   la regla, no el archivo de más de 1.100 líneas.
3. `app/src/ui/codex/oplTipografia.tsx` y `glifos.ts`, incluido
   `formatearComboCodex`.
4. La paleta y la escala tipográfica de `tokens.json`, con la corrección AA de inkSoft.
5. Los principios de `01-design-spec.md` §1 y los patrones prohibidos de
   `02-components.md` (apéndice).
6. El resumen diagnóstico por severidad (`05-interactions.md` §6), con distinción por
   forma y color (`!`, `△`, `·`).
7. El catálogo de reglas behavioral y structural de OPCloud como checklist de
   cobertura (§4), contrastado contra la SSOT.

---

## 13. Recomendación keep / simplify / cut por pieza

| Pieza | Recomendación | Justificación |
|---|---|---|
| Lenguaje visual Codex (paleta, fuentes, hairlines, crimson UI y glifos) | **keep** | Coherente, sobrio y ya realizado; lo único que distingue visualmente a opforja |
| `ui-forja/GOVERNANCE.md` | **simplify** | Mantener la precedencia y los invariantes en media página dentro de un único documento de diseño |
| `ui-forja/01`, `02`, `05`, `07` | **simplify** | Fusionar lo vigente (filosofía, tokens, estados, glifos y patrones prohibidos) en un solo `DESIGN.md` de 150 a 250 líneas |
| `ui-forja/03-scenes.md` | **cut** | Describe cuatro pantallas que ya no existen así |
| `ui-forja/04-opl-rendering.md` | **cut** (mover §1 tipografía) | Prescribe sintaxis OPL fuera de su autoridad y contradice al generador |
| `ui-forja/06-ssot-compliance.md` | **cut** | Auditoría histórica contra una SSOT superada |
| `ui-forja/08-jointjs-styling.md` | **simplify** | Conservar solo el mapa tokens→attrs; la gramática OPM va a la spec OPD o a los tests |
| `tokens.json` + `tokens.css` + `tokens.ts` + `constantes.codex.ts` + `index.html :root` | **simplify** | Una sola fuente (CSS vars o TS que las genere); canvas y chrome leen lo mismo |
| Compat-shim de `tokens.ts` y `colors.canvas` | **cut** | Aliases sin consumidores o todos iguales |
| `modelo/constantes.bauhaus.ts` | **cut** | Fósil V2 dentro del kernel; mover el hit-area de 15px al render |
| `design:governance` | **cut** (sustituir) | Reemplazar por una regla de lint de hex fuera de tokens y de sombras offset |
| `scenes/`, `screenshots/`, `src/variant-codex.jsx` | **cut** | Referencia histórica no ejecutable, con layout invertido |
| `ui/codex/CodexFooterKey`, `CodexInspectField` | **cut** | Muertos |
| `ui/codex/CodexSelectionAnnotation` | **simplify** | 917 líneas para una barra tipográfica |
| `opm-extracted/` | **cut** (archivar fuera) | Riesgo legal y peso; valor ya destilado en JOYAS y en tests |
| `modelo/paridadOpcloud.test.ts` | **cut** | Acopla la suite a código decompilado |
| `assets/` | **cut** (tras sustituir 9 iconos) | Iconos OPCloud contrarios al sistema; 75 sin uso |
| `fixtures/` (capturas OPCloud) | **cut** o **keep** mínimo | Conservar 2 o 3 OPL EN como golden si se usan en tests |
| `fixtures/demo-models/` | **cut** | Salida generada y desactualizada |
| `catalog/`, `config/`, `webroot/`, `setup.sh` | **cut** | Restos de la fase de ingeniería inversa, sin uso |
| `.codex/skills`, `.opencode/skills` | **cut** | Duplicado, rutas rotas, proceso burocrático |
| Comentarios «Ref: opm-extracted…» (unos 40) | **simplify** | Citar la SSOT o nada |
| Práctica de mensajes de commit con contexto, decisión, invariantes y verificación | **keep** | Buena trazabilidad, a menor escala |
| Handoffs y ceremonias de cierre documental | **cut** | 24 de 69 commits sin cambio de producto |

---

## 14. Riesgos y preguntas abiertas

- **Acceso a las SSOT**: `reglas-opm-estrictas-es`, `spec-forja-opd-es` y
  `spec-forja-opl-es` no están en el repo ni en este entorno. Sin ellas, la tabla §3 es
  la mejor fuente disponible de la gramática visual y debe validarse contra KORA antes
  de congelarla.
- **Clasificación OPL colapsada o separada**: la debe resolver `spec-forja-opl-es`
  (§3.3).
- **Estados arrastrables o layout-managed**: hay decisiones contradictorias en el
  historial de bugs (§9.3).
- **Glifo de estado en la toolbar (rombo)**: debería ser un rountangle en miniatura,
  por coherencia con el canvas (`ToolbarBase.tsx:95`).
- **Tamaños de 9 y 9,5 px** (kickers, índice y severidades): conviene revisarlos con
  personas para AA real.
- **Licencia**: `NOTICE.md` declara que no hay licencia; los derivados de OPCloud
  (`opm-extracted`, `assets`, `fixtures`, `config`, `webroot`) deben salir antes de
  cualquier distribución.
- **Historia truncada**: la historia anterior al 2026-07-26 vive en otro lugar (bundles
  de decommission y el repo previo). Si se necesita arqueología de decisiones, hay que
  pedir esos bundles.
