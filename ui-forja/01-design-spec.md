# Codex — Especificación de Diseño Visual

**Producto:** OpForja (editor OPM)
**Propuesta:** Codex
**Versión:** 1.1 — autoridad normativa vigente
**Fecha:** 25 mayo 2026

---

## 0. Scope y división de responsabilidades

Este es el documento maestro del lenguaje visual de Codex. Aquí viven:

- la **filosofía** del diseño,
- el **sistema de tokens** (color, tipografía, hairlines, etc.),
- la **grilla** y composición de la pantalla,
- la **iconografía tipográfica** (no hay iconos vectoriales).

**Codex divide explícitamente el editor en dos capas:**

| Capa | Tecnología | Responsabilidad de este handoff |
|---|---|---|
| **Chrome** (header, footer, columnas, barras emergentes, command palette, inspector, OPL) | HTML/CSS + framework del equipo | Componentes y estilos completos |
| **Canvas** (símbolos OPM, enlaces, marquee, pan/zoom, drag) | **JointJS** | **Solo apariencia** (attrs visuales de shapes/links/highlighters) — la lógica de render es decisión del equipo |

Los detalles por capa:

- Autoridad normativa y precedencia → [`GOVERNANCE.md`](GOVERNANCE.md)
- Tokens visuales globales → [`tokens.css`](tokens.css) / [`tokens.json`](tokens.json)
- Componentes del chrome → [`02-components.md`](02-components.md)
- Estilo de JointJS (shapes, links, highlighters) → [`08-jointjs-styling.md`](08-jointjs-styling.md)
- OPL canónica (texto) → [`04-opl-rendering.md`](04-opl-rendering.md)
- Pantallas (qué hay en cada vista) → [`03-scenes.md`](03-scenes.md)
- Interacciones del chrome (teclado, command palette) → [`05-interactions.md`](05-interactions.md)
- Auditoría contra SSOT OPM-ES → [`06-ssot-compliance.md`](06-ssot-compliance.md)
- Catálogo de glifos Unicode → [`07-glyphs.md`](07-glyphs.md)

---

## 1. Filosofía

> **La página *es* la interfaz.**

Codex trata al editor OPM como un manuscrito anotado: el OPD vive en el centro como figura, la OPL en el margen izquierdo como lectura canónica del modelo, y el árbol de OPDs junto al Inspector en el margen derecho como herramientas de edición. No hay barras laterales pesadas, no hay tabs gruesos, no hay botones cromados. Toda acción visible es texto. Las acciones invisibles viven detrás de `⌘K`.

Cuatro principios:

1. **Tipografía antes que UI.** Si una cosa puede ser texto, es texto. Los toolbars son palabras separadas por `·`. Los toggles son palabras subrayables.
2. **Hairlines, no shadows.** Solo dos pesos de hairline. Cero sombras, cero elevación, cero rounded corners salvo el rountangle canónico del estado.
3. **El canon OPM manda en el OPD.** Objetos verdes, procesos azul oscuro, estados verde oliva (V-63). El chrome alrededor usa una paleta editorial completamente distinta para no competir.
4. **Marginalia como herramienta semántica.** Las validaciones (CRÍTICA/ALTA/MEDIA) aparecen como anotaciones al pie de la oración OPL correspondiente, no como toasts.

---

## 2. Frame general

Todas las pantallas usan el mismo *frame* — tres columnas tipográficas, header arriba, footer abajo.

```
┌───────────────────────────────────────────────────────────────────────────┐
│  Opforja | System Diagram × Modelo × + | sistema · system diagram | meta ⌘K │  60 px
├──────────────┬──────────────────────────────────────────┬─────────────────┤
│  MARGINALIA  │                                          │  ÍNDICE         │
│  OPL         │                                          │  OPDs           │
│              │       [ JointJS Paper mount ]            │                 │
│  01 oración… │       (Codex solo estiliza shapes        │  ▸ SD           │
│  02 oración… │        y links — ver 08-jointjs-         │    SD1          │
│  …           │        styling.md)                       │  + nuevo        │
│              │                                          │                 │
│ copiar · html│                                          │ INSPECTOR       │
├──────────────┴──────────────────────────────────────────┴─────────────────┤
│  23 may · v0.4 · f.s.    O P S R ⌘K       ✓ ningún diagnóstico            │  44 px
└───────────────────────────────────────────────────────────────────────────┘
         360 px                  ~980 px                       360 px
```

**Dimensiones canónicas:**

| Elemento | Dimensión | Token |
|---|---|---|
| Frame total | 1700 × 950 px | `--cx-frame-w` / `--cx-frame-h` |
| Header | 60 px | `--cx-header-h` |
| Footer | 44 px | `--cx-footer-h` |
| Columna izquierda | 360 px | `--cx-col-left` |
| Columna derecha | 360 px | `--cx-col-right` |
| Columna central (donde monta JointJS) | ~980 px | calculado |

Hairlines entre regiones: siempre `1px solid var(--cx-rule)`.

El frame desktop mantiene columnas laterales de 360 px y deja que el canvas central absorba el ancho disponible. En tablet/mobile se activa el modo responsive de la app; no se fuerza letterbox si compromete lectura o targets táctiles.

---

## 3. Paleta

### 3.1 Papel y tinta (chrome)

Todo el chrome vive en escala neutra fría. Nada de cream warm, nada de sienna — la paleta está expresamente diferenciada de Anthropic Claude.

| Token | Hex | Uso |
|---|---|---|
| `--cx-paper` | `#fafaf8` | fondo principal — gallery off-white frío |
| `--cx-paper-warm` | `#eeece2` | fondos secundarios (alert callout, divisor) — contraste intensificado |
| `--cx-ink` | `#171511` | tinta principal |
| `--cx-ink-mid` | `#5a564c` | cuerpo secundario, etiquetas italic |
| `--cx-ink-soft` | `#807b6e` | metadatos, kickers, números mono — ~4:1 vs paper (AA) |
| `--cx-ink-faint` | `#b5b0a4` | separadores inline (`·`), elementos "off" |
| `--cx-rule` | `#d3cec1` | hairlines normales |
| `--cx-rule-strong` | `#aea899` | hairlines de divisor estructural |

### 3.2 Canon OPM (V-63) — usado por JointJS

Tres colores **semánticos** que codifican la clase del símbolo. JointJS los aplica como `stroke` de los shapes que Codex define en [`08-jointjs-styling.md`](08-jointjs-styling.md).

| Token | Hex | Clase OPM |
|---|---|---|
| `--cx-opm-green` | `#3a6b4d` | Objeto — borde |
| `--cx-opm-blue` | `#26467a` | Proceso — borde |
| `--cx-opm-olive` | `#7e8338` | Estado — borde |
| `--cx-state-fill` | `#ece9e1` | Estado — fill gris paper claro |

En el chrome estos colores aparecen **solo en pills/contadores que refuercen la asociación de clase** (footer keys, identificadores en tree). El chrome general permanece neutro.

### 3.3 Acento editorial (UI-only)

Un solo color de acento, **reservado a UI** por V-203:

| Token | Hex | Uso |
|---|---|---|
| `--cx-crimson` | `#8e2a2e` | highlighter de selección/hover, indicador `● sin guardar`, marcas tipográficas (`※`, `△ alta`), shortcut `⌘K` en kbd activo |

JointJS lo usa en:
- highlighter de selección bajo la etiqueta del símbolo seleccionado
- vertices markers de links durante edición
- marquee de selección (rect con border dashed crimson)

---

## 4. Tipografía

Tres familias. Cargar de Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Inria+Serif:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Inria+Sans:ital,wght@0,300;0,400;0,700;1,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet"/>
```

| Familia | Rol | Token |
|---|---|---|
| **Inria Serif** | wordmark, títulos de columna, cuerpo OPL, **etiquetas dentro de símbolos OPM** (vía JointJS), citas SSOT | `--cx-font-serif` |
| **Inria Sans** | kickers, footer keys, micro-controles, "ver más" links | `--cx-font-sans` |
| **JetBrains Mono** | identificadores (`SD`, `o.06`, `p.01`), shortcuts (`⌘K`, `⌫`), severidades | `--cx-font-mono` |

### 4.1 Escala de tamaños

| Token | Tamaño | Uso |
|---|---|---|
| `--cx-fs-9` | 9 px | footer mono, severidades |
| `--cx-fs-10` | 10 px | shortcuts, kicker uppercase |
| `--cx-fs-11` | 11 px | metadatos sans, OPL marginalia |
| `--cx-fs-12` | 12 px | cuerpo secundario, inspector fields |
| `--cx-fs-13` | 13.5 px | **cuerpo principal OPL** — Inria Serif 13.5/1.55 |
| `--cx-fs-14` | 14 px | tree-row label |
| `--cx-fs-17` | 17 px | etiqueta dentro de objeto OPM (JointJS) |
| `--cx-fs-20` | 20 px | etiqueta dentro de proceso/compound (JointJS) |
| `--cx-fs-22` | 22 px | wordmark, títulos de columna, input del command palette |

### 4.2 Reglas de uso

- **Cuerpo OPL en serif a 13.5/1.55** con `text-wrap: pretty` y `letter-spacing: -0.005em`. Voz del producto.
- **Inria Sans solo para uppercase tracked** (kickers, etiquetas de columna). Tracking mínimo `0.18em`.
- **JetBrains Mono solo para identificadores y shortcuts.** No para cuerpo.
- **Italic = secundario o estado descriptivo**: tree rows no-actuales, citas, palabras "secundarias" del inspector.
- **Bold solo para títulos y nombres de objetos OPM** dentro de OPL.

### 4.3 Pesos canónicos

| Peso | Token | Uso |
|---|---|---|
| 400 | `--cx-fw-400` | body default |
| 500 | `--cx-fw-500` | tree-row current numbers, mono semibold |
| 600 | `--cx-fw-600` | segmented active option |
| 700 | `--cx-fw-700` | títulos serif, objetos OPL |

---

## 5. Letter-spacing

Codex usa el tracking como instrumento. Ocho valores:

| Token | Valor | Uso |
|---|---|---|
| `--cx-ls-tight` | `-0.01em` | títulos serif 22px |
| `--cx-ls-body` | `-0.005em` | cuerpo serif OPL |
| `--cx-ls-mono` | `0.04em` | mono inline pequeño |
| `--cx-ls-kbd` | `0.06em` | shortcuts dentro de `kbd` |
| `--cx-ls-meta` | `0.08em` | identificadores mono junto a texto serif |
| `--cx-ls-mark` | `0.12em` | severidades mono uppercase |
| `--cx-ls-kicker` | `0.18em` | kickers cortos sans |
| `--cx-ls-section` | `0.22em` | kickers de sección uppercase sans |

---

## 6. Hairlines

Solo dos pesos. **No usar shadows.** No usar elevación.

| Token | Valor | Uso |
|---|---|---|
| `--cx-hairline` | `1px solid var(--cx-rule)` | bordes de columna, separadores entre OPL notes, fields del inspector |
| `--cx-hairline-strong` | `1px solid var(--cx-rule-strong)` | divisor de split (Inspector ↔ OPL filtrado), borde del command palette modal |
| `--cx-hairline-dotted` | `1px dotted var(--cx-rule)` | sub-separadores dentro del inspector |

---

## 7. Strokes en el canvas (JointJS)

Estos valores se aplican como `strokeWidth` en los attrs de JointJS — no en CSS del chrome.

| Token | Valor | Aplica a |
|---|---|---|
| `--cx-opm-stroke-object` | `1.5px` | borde de rectángulo de objeto |
| `--cx-opm-stroke-process` | `1.5px` | borde de elipse de proceso |
| `--cx-opm-stroke-state` | `1.2px` | borde de stadium de estado |
| `--cx-opm-stroke-link` | `1px` | enlaces (líneas, flechas) |
| `--cx-opm-stroke-triangle` | `1.2px` | triángulos estructurales (agregación, generalización) |

Detalle completo de cada shape/link en [`08-jointjs-styling.md`](08-jointjs-styling.md).

---

## 8. Iconografía

**Codex no usa iconos vectoriales.** Todo glifo es Unicode tipográfico.

| Glifo | Uso |
|---|---|
| `※` | reference mark — selección única en barra emergente |
| `△` | warning triangle — severidad |
| `▸` | pointer — item actual en tree |
| `·` | middle dot — separador inline |
| `+` | acción de creación |
| `⌫` | eliminar |
| `↵` | confirmar |
| `⌘` `⌃` `⇧` `⌥` | modificadores de teclado |

Catálogo completo y reglas de uso en [`07-glyphs.md`](07-glyphs.md).

---

## 9. Estados de interacción

Codex es minimalista — los estados de hover/focus son sutiles. Solo aplican al chrome HTML; los estados sobre los símbolos del canvas los maneja JointJS (ver [`08-jointjs-styling.md` §5](08-jointjs-styling.md#5-highlighters)).

| Estado | Tratamiento |
|---|---|
| **Hover en acción de texto** | `color: var(--cx-ink)` (sube de inkMid → ink) |
| **Active/selected en segmented** | `font-weight: 600` + `border-bottom: 1px solid var(--cx-ink)` |
| **Selected en OPL note** | número crimson, body con border-bottom crimson 50% |
| **Current item en tree** | peso 600 + marker `▸` + ink full |
| **Focus en command palette item** | `background: paper-warm` + `border-left: 2px crimson` |

Transición: `100ms ease` en color únicamente.

---

## 10. Accesibilidad

- **Cuerpo ink sobre paper:** ratio ~16:1. WCAG AAA.
- **inkMid sobre paper:** ratio ~7.1:1. AA cuerpo.
- **inkSoft sobre paper:** ratio ~3.0:1. **Solo para texto ≥ 12px medium o ≥ 14px regular**.
- **Crimson sobre paper:** ratio ~8.4:1. AA pasa.
- El selected underline crimson SIEMPRE se acompaña de otra señal (color del número, marca `※`).
- Todos los elementos interactivos focusables por teclado.

---

## 11. Lo que **NO** hay en Codex

- ❌ Iconos vectoriales (todo glifo es Unicode)
- ❌ Sombras / `box-shadow` (excepto backdrop del command palette)
- ❌ Border-radius en chrome (los rountangles de estado son la única excepción, dentro de JointJS)
- ❌ Gradientes
- ❌ Animaciones decorativas (transiciones < 150ms en color)
- ❌ Colores fuera de tokens
- ❌ Mezcla de familias tipográficas
- ❌ Modo "compact" / "comfortable" — un solo modo
- ❌ Dark mode (v1.1+)

---

## 12. Versionado

Esta especificación v1.0 corresponde a los archivos del folder `handoff/` con hash de los documentos. Cualquier cambio de:

- **token** (color, fuente, tamaño) → minor bump (v1.1)
- **frame layout** → major bump (v2.0)
- **componente nuevo** → minor bump
- **fix de bug visual** → patch (v1.0.1)

Última actualización: 23 mayo 2026 — refactor a scope JointJS (solo apariencia, sin lógica de render).
