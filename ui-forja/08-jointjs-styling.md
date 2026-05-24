# Codex — Estilo Visual de JointJS

**Producto:** OpForja (editor OPM)
**Propuesta:** Codex · v1.0
**Versión de JointJS asumida:** v4.0+

Este documento es la **fuente de verdad estética** del canvas: define los atributos visuales que JointJS aplica al renderizar el OPD. **Solo apariencia.** La lógica (anchors, connectors, routers, validación de conexiones, etc.) es decisión del equipo de desarrollo dentro de las opciones de JointJS — Codex no opina sobre eso.

> **Cómo leer este documento:** cada sección describe una clase de objeto JointJS (Shape, Link, Highlighter, ElementTool) y enumera los atributos visuales que deben aplicarse. Los valores remiten a los tokens de [`tokens.css`](tokens.css). NO incluye markup completo — solo los attrs.

---

## 0. Decisiones macro del Paper

Las opciones del `dia.Paper` que afectan apariencia (no las que controlan comportamiento):

```js
new joint.dia.Paper({
  // ── apariencia ──
  background: { color: 'transparent' },     // hereda el paper del wrapper HTML
  drawGrid: false,                          // sin grid visible
  // (gridSize sigue siendo útil para snap en lógica — eso lo decides tú)

  // ── comportamiento (no afecta estética; aquí solo a modo de checklist) ──
  defaultAnchor: { name: 'center' },        // o lo que tu lógica requiera
  defaultConnector: { name: 'straight' },   // estética hairline, sin curvas
  defaultRouter: { name: 'normal' },        // routes simples; sin manhattan ortogonal
  // ...
});
```

**Reglas duras:**

- `drawGrid: false` — Codex es liso (textura tipo papel viene del fondo HTML).
- Connector `'straight'` o `'normal'`, **nunca** `'smooth'` ni `'rounded'` — las curvas no encajan con el lenguaje editorial.
- `background.color: 'transparent'` — el paper hereda el `paper` del wrapper, no inventa un fondo propio.

---

## 1. Shape: Objeto OPM

Recomendación: extender `joint.shapes.standard.Rectangle` o definir un shape custom con markup similar.

### Attrs canónicos

```js
attrs: {
  body: {
    stroke: 'var(--cx-opm-green)',           // #3a6b4d
    strokeWidth: 1.5,
    fill: 'transparent',
    rx: 0,                                    // SIN border-radius
    ry: 0,
  },
  label: {
    fontFamily: 'Inria Serif, Georgia, serif',
    fontSize: 17,
    fontWeight: 400,
    fontStyle: 'normal',
    fill: 'var(--cx-ink)',                    // #171511
    textAnchor: 'middle',
    textVerticalAnchor: 'middle',
    textWrap: { width: -16, height: -16, ellipsis: false }, // ver §1.2
  },
  // Identificador (ej. "o.01") como subelemento adicional debajo
  index: {
    fontFamily: 'JetBrains Mono, ui-monospace, monospace',
    fontSize: 9.5,
    fontWeight: 500,
    fill: 'var(--cx-ink-soft)',               // #a39e92
    letterSpacing: '0.08em',
    textAnchor: 'start',
    refX: 0,
    refY: 'calc(h + 4)',                      // 4px debajo del bbox
  },
}
```

### 1.1 Sizing default

| Propiedad | Valor |
|---|---|
| Tamaño mínimo | 160 × 60 px |
| Tamaño default sugerido | 200 × 78 px |
| Padding interior del label | 8 px lateral |

### 1.2 Wrapping de etiqueta

**Per V-212 (no truncamiento silencioso):**

- `textWrap.ellipsis: false` — NUNCA truncar.
- Cuando el texto no cabe, el shape debe expandirse (vía `textWrap` con `width/height` negativos como padding) o rechazar el resize.

### 1.3 ID/markup mínimo recomendado

```js
joint.dia.Element.define('codex.Object', {
  size: { width: 200, height: 78 },
  attrs: { /* ver arriba */ },
}, {
  markup: [
    { tagName: 'rect', selector: 'body' },
    { tagName: 'text', selector: 'label' },
    { tagName: 'text', selector: 'index' },
  ],
});
```

---

## 2. Shape: Proceso OPM

Recomendación: extender `joint.shapes.standard.Ellipse`.

### Attrs canónicos

```js
attrs: {
  body: {
    stroke: 'var(--cx-opm-blue)',            // #26467a
    strokeWidth: 1.5,
    fill: 'transparent',
  },
  label: {
    fontFamily: 'Inria Serif, Georgia, serif',
    fontSize: 17,
    fontWeight: 400,
    fontStyle: 'italic',                      // ← clave: procesos en italic incluso en el OPD
    fill: 'var(--cx-ink)',
    textAnchor: 'middle',
    textVerticalAnchor: 'middle',
  },
  index: {
    fontFamily: 'JetBrains Mono, ui-monospace, monospace',
    fontSize: 9.5,
    fontWeight: 500,
    fill: 'var(--cx-ink-soft)',
    letterSpacing: '0.08em',
    textAnchor: 'start',
    refX: 'calc(-1*rx)',
    refY: 'calc(ry + 4)',
  },
}
```

### 2.1 Sizing default

| Propiedad | Valor |
|---|---|
| Radios mínimos | rx 100, ry 40 |
| Radios default | rx 160, ry 62 |

**Nota:** el italic de la etiqueta refuerza la convención OPL §1.7 (procesos en *bold italic*). En el OPD es solo italic regular (peso 400) — el bold queda para OPL.

---

## 3. Shape: Estado OPM

Stadium / rountangle. No hay equivalente directo en `shapes.standard`; defínelo con `path` o `rect` con `rx: calc(h/2)`.

### Attrs canónicos

```js
attrs: {
  body: {
    stroke: 'var(--cx-opm-olive)',           // #7e8338
    strokeWidth: 1.2,                         // ← más fino que objeto/proceso
    fill: 'var(--cx-state-fill)',             // #ece9e1
    rx: 'calc(h/2)',                          // stadium pill
    ry: 'calc(h/2)',
  },
  label: {
    fontFamily: 'Inria Serif, Georgia, serif',
    fontSize: 13,
    fontWeight: 400,
    fontStyle: 'italic',                      // ← estados en italic
    fill: 'var(--cx-ink)',
    textAnchor: 'middle',
    textVerticalAnchor: 'middle',
  },
}
```

### 3.1 Sizing default

| Propiedad | Valor |
|---|---|
| Alto fijo | 42 px |
| Ancho mínimo | 100 px |
| Ancho típico | 130 px |
| Padding lateral del label | 16 px |

---

## 4. Links (enlaces y arrows)

Todos los enlaces — procedimentales (consume, genera, afecta, cambia…) y estructurales (agregación, exhibición, generalización…) — usan **negro** (`var(--cx-ink)`) por V-63.

La distinción entre tipos de enlace se hace por **marker** (cabeza/cola), NO por color.

### 4.1 Link default

```js
attrs: {
  line: {
    stroke: 'var(--cx-ink)',                  // #171511
    strokeWidth: 1,
    fill: 'none',
    targetMarker: {                           // flecha simple por defecto
      type: 'path',
      d: 'M 9 -4 0 0 9 4 z',
      fill: 'var(--cx-ink)',
      stroke: 'none',
    },
    sourceMarker: null,
  },
}
```

Connector recomendado: `'straight'` con `cornerType: 'point'` (sin redondeo).

### 4.2 Markers por tipo de enlace

| Tipo | sourceMarker | targetMarker | Notas |
|---|---|---|---|
| **Procedimental** (consume, genera, afecta) | none | arrow simple `M 9 -4 0 0 9 4 z` (fill ink) | default |
| **Cambio de estado** (cambia…de…a) | none | arrow doble (dos arrowheads consecutivos) | distintivo |
| **Agregación** (consta de) | none | triángulo equilátero fill ink (12×12) | el triángulo apunta al refinable |
| **Exhibición** (exhibe) | none | cuadrado outline ink 10×10 | sin fill |
| **Generalización** (es un) | none | triángulo outline ink (sin fill) 12×12 | |
| **Instanciación** (es una instancia de) | none | círculo outline ink 8×8 | |
| **Agente** (maneja) | none | círculo ink fill negro 6×6 | "lollipop" lleno |
| **Instrumento** (requiere) | none | círculo outline ink 8×8 | "lollipop" hueco |

**Trazos:** todos `strokeWidth: 1`. Para enlaces destacados (raro), `1.2px`.

**Dashing:** no usar. Codex prefiere distinguir por marker, no por línea punteada.

### 4.3 Vertices markers (durante edición)

El handler de vértices de JointJS (`linkTools.Vertices`) renderiza puntos en cada vértice. Estilizarlos para mantener coherencia:

```js
new joint.linkTools.Vertices({
  snapRadius: 10,
  redundancyRemoval: true,
  vertexAdding: true,
  // override visual:
  attributes: {
    fill: 'var(--cx-crimson)',                // canal UI
    stroke: 'var(--cx-paper)',
    'stroke-width': 2,
    r: 4,
  },
});
```

---

## 5. Highlighters

JointJS provee `highlighters.stroke`, `highlighters.mask`, `highlighters.opacity`, etc. Codex usa **dos**:

### 5.1 Highlighter de selección

Aplicado cuando un elemento está en la selección activa. **NO redibuja el borde del shape** — solo añade un **underline crimson hairline bajo la etiqueta** (mantiene el canon V-63 visible).

Implementación recomendada: highlighter custom o `mask` que dibuja una línea horizontal bajo el label.

**Especificación visual:**

```
stroke:       var(--cx-crimson)               // #8e2a2e
strokeWidth:  1.2
fill:         none
trazado:      línea horizontal bajo la etiqueta del shape, desde el borde izquierdo
              al derecho del bbox del label, 2px debajo del baseline
opacity:      1
```

Mientras el elemento esté seleccionado, el highlighter es persistente. Al deseleccionar, se remueve.

### 5.2 Highlighter de hover

Aplicado momentáneamente cuando el cursor pasa sobre un elemento (en canvas o desde una oración OPL en marginalia). Más sutil que el de selección.

```
stroke:       var(--cx-crimson)
strokeWidth:  1
fill:         none
opacity:      0.5
trazado:      mismo underline que §5.1, pero al 50% opacity
```

### 5.3 Sin glow / sin shadow

JointJS soporta `filter` con `dropShadow`, etc. **NO usar**. Codex es liso por filosofía (ver [`01-design-spec.md` §11](01-design-spec.md#11-lo-que-no-hay-en-codex)).

---

## 6. ElementTools y LinkTools

Cuando un elemento o link está seleccionado, JointJS puede mostrar "tools" flotantes a su alrededor (handles de resize, botón remove, vertices markers). Codex los reemplaza casi todos por su **barra emergente HTML** ([`CodexSelectionAnnotation`](02-components.md#5-codexselectionannotation)).

### 6.1 Tools que SÍ usar

| Tool | Cuándo | Estilo |
|---|---|---|
| `linkTools.Vertices` | siempre que un link esté seleccionado | ver §4.3 |
| `linkTools.SourceArrowhead` / `TargetArrowhead` | mientras se reconecta un endpoint | herencia del marker (§4.2) |
| `elementTools.Boundary` (custom) | dimensionar el bbox de selección para que el HTML overlay sepa dónde anclar | invisible — solo trazar bbox bound |

### 6.2 Tools que NO usar

| Tool | Por qué |
|---|---|
| `elementTools.Remove` (el botón rojo flotante) | Reemplazado por `eliminar ⌫` en la barra emergente HTML |
| `elementTools.Connect` | El comando `R` + click sobre destino lo cubre |
| Cualquier control con `Button` flotante | Convención: la barra emergente HTML concentra todas las acciones |

### 6.3 Si necesitas un tool flotante

Si decides usar un `elementTools.Button` por excepción, estilízalo:

```js
new joint.elementTools.Button({
  // ...
  markup: [
    {
      tagName: 'circle',
      selector: 'button',
      attributes: {
        r: 8,
        fill: 'var(--cx-paper)',
        stroke: 'var(--cx-ink)',
        'stroke-width': 1,
        cursor: 'pointer',
      },
    },
    {
      tagName: 'text',
      selector: 'icon',
      attributes: {
        // glifo Unicode (ver 07-glyphs.md), nunca un ícono vectorial
        text: '⌫',
        'font-family': 'JetBrains Mono, monospace',
        'font-size': 10,
        fill: 'var(--cx-ink)',
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
      },
    },
  ],
});
```

**Reglas:** outline 1px solid ink, fill paper, glifo Unicode dentro. Sin shadows.

---

## 7. Marquee de selección (drag rectangle)

JointJS no incluye marquee selection en el core (lo provee JointJS+ Rappid). Si el equipo usa el core, debe implementarlo. Estilo del rectángulo:

```css
.codex-marquee {
  position: absolute;
  border: 1px dashed var(--cx-crimson);
  background: var(--cx-crimson, #8e2a2e);
  background-color: rgba(142, 42, 46, 0.06);   /* tint sutil */
  pointer-events: none;
}
```

- Línea punteada 1px crimson.
- Fill crimson al 6% opacity.
- Sin bordes redondeados.

---

## 8. Pan & zoom

JointJS no aplica estilos al pan/zoom — son transformaciones del paper. Codex solo pide:

- **Sin animaciones de pan/zoom** (no smooth scrolling) — `paper.scale()` y `paper.translate()` directos.
- **Cursor durante pan** (Space + drag): `cursor: grab` mientras Space está pressed, `cursor: grabbing` durante drag.
- **El indicador de zoom** (`100%`, `120%`, `FIT`) NO vive sobre el canvas — vive en el header de [`CodexCanvasMount`](02-components.md#4-codexcanvasmount).

---

## 9. Triángulos estructurales standalone

Los triángulos de agregación/generalización aparecen tanto como **marker de link** (§4.2) como **elementos standalone** en algunas topologías OPM (ej. una agregación con múltiples hijos comparte un solo triángulo central).

Cuando se usan standalone, son elementos JointJS propios:

```js
joint.dia.Element.define('codex.StructuralTriangle', {
  size: { width: 24, height: 18 },
  attrs: {
    body: {
      refPoints: '12,0 24,18 0,18',         // triángulo equilátero
      stroke: 'var(--cx-ink)',
      strokeWidth: 1.2,
      fill: 'transparent',                   // outline; alternativa: 'var(--cx-ink)'
    },
  },
}, {
  markup: [{ tagName: 'polygon', selector: 'body' }],
});
```

**Fill:** preferir `transparent` (outline) por la sensación editorial. Para distinguir agregación (fill) de generalización (outline) per V-129b, usar `fill: 'var(--cx-ink)'` en agregación y `transparent` en generalización.

---

## 10. Cuadrado de exhibición standalone

Igual que §9 pero un cuadrado pequeño en el medio de un enlace de exhibición:

```js
attrs: {
  body: {
    width: 20, height: 20,
    stroke: 'var(--cx-ink)',
    strokeWidth: 1.2,
    fill: 'transparent',
  },
}
```

---

## 11. Etiquetas de link (labels)

JointJS soporta labels sobre los links (ej. cardinalidad, tipo de relación). Codex los estiliza así:

```js
labels: [{
  position: 0.5,
  attrs: {
    text: {
      text: 'consume',
      fontFamily: 'Inria Serif, Georgia, serif',
      fontSize: 12,
      fontStyle: 'italic',
      fill: 'var(--cx-ink-mid)',
      textAnchor: 'middle',
    },
    rect: {
      fill: 'var(--cx-paper)',                // background bloqueante
      stroke: 'none',
      ref: 'text',
      refX: -4, refY: -2,
      refWidth: 8, refHeight: 4,              // padding del fondo
    },
  },
}]
```

- Italic serif 12px en inkMid.
- Background `paper` opaco (bloquea el link debajo).
- Sin border alrededor.

**Reglas:**

- Solo mostrar labels cuando el tipo de enlace lo requiere semánticamente (cf. opl-es: la mayoría de los verbos son inferibles del marker).
- Una label por link (no múltiples).

---

## 12. Tokens visuales que JointJS necesita

JointJS no consume CSS custom properties directamente desde los attrs SVG. Hay dos opciones:

### Opción A: hard-code de hex en defaults de shape (más rápido)

```js
const TOKENS = {
  opmGreen: '#3a6b4d',
  opmBlue: '#26467a',
  opmOlive: '#7e8338',
  stateFill: '#ece9e1',
  ink: '#171511',
  inkSoft: '#a39e92',
  crimson: '#8e2a2e',
  paper: '#fafaf8',
};

joint.dia.Element.define('codex.Object', {
  attrs: {
    body: { stroke: TOKENS.opmGreen, /* ... */ },
  },
});
```

### Opción B: leer las CSS vars y inyectar al definir shapes (más mantenible)

```js
const css = getComputedStyle(document.documentElement);
const TOKENS = {
  opmGreen: css.getPropertyValue('--cx-opm-green').trim(),
  // ...
};
```

Recomendamos **opción B** para mantener la fuente de verdad en `tokens.css`. Re-leer si se permite cambio de tema (ej. dark mode futuro).

---

## 13. Resumen — Mapa de tokens → JointJS attrs

| Token | Aplica a | Atributo |
|---|---|---|
| `--cx-opm-green` | shape `codex.Object` | `body.stroke` |
| `--cx-opm-blue` | shape `codex.Process` | `body.stroke` |
| `--cx-opm-olive` | shape `codex.State` | `body.stroke` |
| `--cx-state-fill` | shape `codex.State` | `body.fill` |
| `--cx-ink` | links, triángulos, labels de shape | `line.stroke`, `body.fill/stroke`, `label.fill` |
| `--cx-ink-soft` | identificadores (`o.01`, `p.01`) | `index.fill` |
| `--cx-ink-mid` | labels de link | `labels[].attrs.text.fill` |
| `--cx-crimson` | highlighters de selección/hover, vertices markers, marquee | `stroke`, `fill` (con opacity) |
| `--cx-paper` | background bloqueante de labels de link, button-tools | `rect.fill`, `circle.fill` |

---

## 14. Apéndice — Lo que JointJS NO debe hacer

Recordatorios:

- ❌ NO usar `drawGrid: true` — Codex es liso.
- ❌ NO usar `defaultConnector: 'smooth'` o `'rounded'` con radio grande.
- ❌ NO usar `filter: dropShadow` ni equivalentes.
- ❌ NO usar `rx`/`ry` en `codex.Object` (rectángulos cuadrados, sin redondeo).
- ❌ NO usar `elementTools.Remove` ni `elementTools.Connect` (cubre la barra emergente HTML).
- ❌ NO mezclar shapes de `joint.shapes.standard` sin reestilizar — los defaults de JointJS no son Codex.

---

## 15. Apéndice — Estados visuales pendientes (v1.1+)

| Caso | Decisión visual pendiente |
|---|---|
| **Proceso activo / in-flight** (V-132, §17) | Posible: highlighter de halo crimson con `strokeWidth: 1.5` + `opacity: 0.5`. A confirmar. |
| **Estado actual** (§17.2) | Posible: pin externo (círculo crimson outline 6px) anclado al borde superior del stadium del estado. A confirmar. |
| **Símbolo refinado (in-zoomed)** | Marca tipográfica en el index: `o.06 ▾` con caret hacia abajo en mono. |
| **Símbolo bloqueado** (`⌘L`) | Possible: opacity 0.7 del body + ningún cursor pointer al hover. |

Estos quedan abiertos para iterar en v1.1 con el equipo de devs y el corpus OPM.
