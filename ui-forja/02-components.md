# Codex — Inventario de Componentes (Chrome)

**Producto:** OpForja (editor OPM)
**Propuesta:** Codex · v1.1

> **Scope crítico:** este documento describe **solo el chrome de la app** — todo lo que NO está dentro del `<div>` donde JointJS renderiza el `paper`. Los símbolos OPM (objetos, procesos, estados, enlaces, triángulos), el marquee de selección, el pan/zoom y los highlighters viven en JointJS y se especifican en [`08-jointjs-styling.md`](08-jointjs-styling.md).

Cada componente listado aquí es **HTML/CSS puro** (renderizado por React, Vue, Svelte o lo que el equipo prefiera). Ninguno requiere SVG ni interacción con JointJS más allá de leer la selección actual (para filtrar OPL, mostrar el inspector, posicionar la barra emergente).

La implementación de referencia vive en `handoff/src/variant-codex.jsx`. Mantén o renombra los componentes al adaptar a tu stack.

---

## Índice

1. [`CodexFrame`](#1-codexframe) — shell de 3 columnas + header + footer
2. [`CodexColHeader`](#2-codexcolheader) — header de columna izquierda/derecha
3. [`CodexTreeRow`](#3-codextreerow) — fila de árbol de OPDs
4. [`CodexCanvasMount`](#4-codexcanvasmount) — montaje del `paper` de JointJS
5. [`CodexSelectionAnnotation`](#5-codexselectionannotation) — barra emergente de selección
6. [`CodexOPLNote`](#6-codexoplnote) — oración OPL en marginalia
7. [`OplObj` / `OplProc` / `OplState`](#7-tipografía-opl) — tipografía inline canónica
8. [Command Palette](#8-command-palette) — overlay de comandos `⌘K`
9. [`CodexInspectSection`](#9-codexinspectsection)
10. [`CodexInspectField`](#10-codexinspectfield)
11. [`CodexInspectInline`](#11-codexinspectinline)
12. [`CodexStateRow`](#12-codexstaterow)
13. [`CodexFooterKey`](#13-codexfooterkey)

---

## 1. CodexFrame

Shell de toda pantalla. Tres columnas (360 / 1fr / 360), header 60px, footer 44px. Todas las hairlines internas son normales (`1px solid var(--cx-rule)`).

### Anatomía

```
┌─────────────── HEAD (60px) ──────────────────┐
│ wordmark │ tabs de modelos │ breadcrumb │ acciones │ meta · ⌘K │
├──────────┼────────────┼──────────────────────┤
│ LEFT     │ CANVAS     │ RIGHT                │
│ 360px    │ ~980px     │ 360px                │
│ (OPL)    │ (JointJS)  │ (Índice / Inspector) │
├──────────┴────────────┴──────────────────────┤
│ fecha · v · iniciales │ keys │ status        │  FOOT (44px)
└──────────────────────────────────────────────┘
```

### Props

```ts
interface CodexFrameProps {
  breadcrumb?: string[];
  meta?: string;
  tabs?: ReactNode;
  leftPanel: ReactNode;     // OPL marginalia
  canvasMount: ReactNode;   // contenedor del paper de JointJS
  rightPanel: ReactNode;    // Índice + Inspector
  floating?: ReactNode;     // overlays HTML absolutos sobre el canvas
  footerCenter?: ReactNode;
  footerRight?: string;
}
```

### Tamaños canónicos

| Token | Valor |
|---|---|
| `--cx-frame-w` / `--cx-frame-h` | 1700 × 950 px |
| `--cx-header-h` | 60 px |
| `--cx-footer-h` | 44 px |
| `--cx-col-left` | 360 px |
| `--cx-col-right` | 360 px |

### Detalle del header

- **Wordmark "Opforja"**: Inria Serif italic 22px, peso 400, tracking `-0.005em`, color ink.
- **Tabs de modelos**: texto serif sin chip; activo con peso 600 y underline crimson.
- **Breadcrumb**: JetBrains Mono 11px en inkSoft, separadores `·` en inkFaint, último item bold + color ink.
- **Meta**: italic Inria Sans 12px en inkMid, seguido del kbd `⌘K` en mono 10px con `1px solid rule`.

### Detalle del footer

3 columnas equidistantes:

- **Izquierda**: fecha mono 10px en inkSoft: `23 may · v0.4 · f.s.`
- **Centro**: leyendas de teclas ([`CodexFooterKey`](#13-codexfooterkey))
- **Derecha**: estado de diagnóstico en italic serif 11px

### Comportamiento

Desktop usa columnas laterales de 360 px y canvas flexible. En tablet/mobile, el shell puede colapsar a navegación por vistas; la jerarquía OPL/canvas/edición se preserva aunque cambie la presentación.

---

## 2. CodexColHeader

Header de columna lateral. Estructura: kicker tracked uppercase + título serif grande + (opcional) número/contador a la derecha.

```ts
interface CodexColHeaderProps {
  kicker: string;        // "Índice", "Marginalia · OPL"
  title: string;         // "OPDs", "System Diagram"
  side?: string;         // "24" — cantidad de oraciones OPL
}
```

- **Kicker:** Inria Sans 10px, `letter-spacing: 0.22em`, uppercase, color inkSoft.
- **Title:** Inria Serif 22px peso 700, color ink, `letter-spacing: -0.01em`.
- **Side:** JetBrains Mono 10px en inkSoft.

**Regla dura:** el `side` NUNCA muestra "cantidad de cosas de un diagrama" (objetos/procesos/estados). Solo cantidad de oraciones OPL o equivalentes macro. Decisión del cliente.

---

## 3. CodexTreeRow

Fila del árbol de OPDs. Tipografía pura, sin íconos de carpeta, sin chevrones.

```ts
interface CodexTreeRowProps {
  code?: string;      // "SD", "SD1" — JetBrains Mono al inicio
  label: string;      // "sistema (raíz)", "in-zoom de o.06"
  level?: number;     // indent × 18px
  current?: boolean;
  marker?: string;    // "▸" visible cuando current
  italic?: boolean;
  mark?: string;      // "+" en acciones de creación
}
```

- Padding: `4px 0`, indent `level × 18px`.
- Hairline-dotted abajo.
- Code en mono 10px, label en serif 14px.
- Current: peso 600, color ink full + marker `▸`.
- No-current: peso 400, color inkMid.

**Reglas duras:**

- NO mostrar contadores por diagrama (`7o · 1p · 8e` — rechazado).
- NO incluir "Mapa del sistema" como entrada del árbol.
- Solo OPDs reales + fila de creación.

---

## 4. CodexCanvasMount

Wrapper de la región central donde vive JointJS. NO renderiza nada del canvas — solo provee el contenedor estilizado donde el `paper` se monta.

### Anatomía

```
┌─ kicker · "SD · OPD raíz" ──────── zoom · "100%" ┐
├──────────────────────────────────────────────────┤
│                                                  │
│              ← JointJS Paper aquí →              │
│                                                  │
└──────────────────────────────────────────────────┘
```

```ts
interface CodexCanvasMountProps {
  label: string;             // "SD · OPD raíz" — kicker arriba
  zoom?: string;             // "100%", "120%" — reflejo del paper.scale()
  paperContainerRef: Ref;    // ref al div donde se monta el paper
  children?: ReactNode;      // overlays HTML opcionales
}
```

### Visual

- Padding del wrapper: `24px 32px 12px`.
- Header row arriba: kicker mono 9.5px uppercase tracked `0.14em` + zoom mono 10px tracked `0.04em` a la derecha.
- Hairline normal entre header row y el paper container.
- El `div` del paper ocupa `flex: 1`. JointJS controla todo lo de adentro.
- **No CSS sobre el SVG del paper** — toda la apariencia OPM viene de los attrs JointJS especificados en [`08-jointjs-styling.md`](08-jointjs-styling.md).

### Configuración mínima del Paper (referencia)

Aplica solo estos overrides; los demás defaults JointJS son apropiados:

```js
new joint.dia.Paper({
  el: paperContainerRef.current,
  model: graph,
  width: '100%',
  height: '100%',
  background: { color: 'transparent' }, // hereda el paper del wrapper
  gridSize: 8,
  drawGrid: false,         // sin grid visible — Codex es liso
  // ... defaults para anchors / connectionPoints / routers / connectors
  // se especifican en 08-jointjs-styling.md §3
});
```

---

## 5. CodexSelectionAnnotation

Barra emergente que aparece cuando JointJS reporta selección. NO es un `elementTool` de JointJS — es un **overlay HTML** posicionado sobre el contenedor del paper. Solo tipografía, sin botones.

### Anatomía

```
※ descomponer ⌘D · desplegar · alias · imagen · inspector
  ────────────────────────────────────────────────────
  o.06 · objeto · informacional · sistémico
```

- **Reference mark** a la izquierda en crimson:
  - Selección única: `※` (U+203B) en serif 20px.
  - Múltiple: dígito en serif 28px bold (la cantidad).
- **Acciones** separadas por `·` en serif 13.5px. Primaria en *italic + bold*. Destructiva en italic crimson con shortcut mono.
- **Hairline** debajo de las acciones.
- **Meta line** en JetBrains Mono 9.5px en inkSoft.

### Props

```ts
interface CodexSelectionAnnotationProps {
  top?: number | string;
  left?: number | string;     // '50%' centra (con translateX(-50%))
  right?: number | string;
  bottom?: number | string;
  mark: string;               // "※" o "3"
  markBig?: boolean;          // true para dígitos
  actions: Array<{
    label: string;
    kbd?: string;             // "⌘D", "⌫"
    primary?: boolean;
    danger?: boolean;
  }>;
  meta: string;
}
```

### Posicionamiento

Calcula posición leyendo la selección del `graph` y proyectando a coords de pantalla:

```js
// pseudo-ejemplo
const bbox = paper.findViewByModel(selectedCell).getBBox(); // local coords
const screenBBox = paper.localToPaperRect(bbox);
// posiciona annotation cerca del borde inferior o lateral del bbox
```

Reglas:

- 1 elemento → debajo del bbox, alineada a un borde.
- 2+ elementos → centrada en el borde inferior del bounding box conjunto.
- Si la selección está cerca del borde inferior del canvas → aparece ARRIBA del bbox.
- NO sigue el cursor. Solo recalcula al cambiar selección.

---

## 6. CodexOPLNote

Una oración OPL como párrafo numerado en marginalia. Componente más usado del UI.

### Anatomía

```
01    System Name es informacional.

05    Beneficiary Group es ambiental.
      △ ALTA   beneficiarios externos al sistema → ambiental
               (metodología §5)
```

```ts
interface CodexOPLNoteProps {
  n: string;               // "01", "02"
  body: ReactNode;         // contenido — usa OplObj/OplProc/OplState
  selected?: boolean;
  marginalia?: string;
  severity?: 'critica' | 'alta';
}
```

### Visual

- **Default**: body serif 13.5px en inkMid (NO ink full), line-height 1.55, número mono 10.5px en inkSoft.
- **Selected**: body color ink, número crimson, body con `border-bottom: 1px solid var(--cx-crimson)55`.
- **Marginalia**: indent 38px desde la izquierda, italic serif 11px.
  - `critica` → crimson
  - `alta` → olive
  - sin severidad (`— nota`) → inkSoft
- Margin-bottom entre notas: 12px.

### Interacción con la selección

- **Click sobre número de oración** → seleccionar el símbolo correspondiente en el `graph` de JointJS.
- **Hover sobre oración** → highlight tenue del símbolo correspondiente (vía `highlighters.stroke` — ver [`08-jointjs-styling.md`](08-jointjs-styling.md#5-highlighters)).

---

## 7. Tipografía OPL

Helpers tipográficos para renderizar nombres de OPM en OPL **siguiendo §1.7 de la SSOT**.

```tsx
<OplObj>System Name</OplObj>           // bold
<OplProc>Main System Doing</OplProc>   // bold italic
<OplState>problematic</OplState>       // monospace small, olive
```

### Implementación

```tsx
const OplObj = ({ children }) =>
  <b style={{ fontWeight: 700, fontStyle: 'normal' }}>{children}</b>;

const OplProc = ({ children }) =>
  <span style={{ fontWeight: 700, fontStyle: 'italic' }}>{children}</span>;

const OplState = ({ children }) =>
  <span style={{
    fontFamily: 'JetBrains Mono, ui-monospace, monospace',
    fontSize: '0.86em',
    color: 'var(--cx-opm-olive)',
    letterSpacing: '0.02em',
  }}>{children}</span>;
```

**Regla:** todo nombre de cosa OPM en cuerpo OPL **debe** usar uno de estos tres. Detalles completos en [`04-opl-rendering.md`](04-opl-rendering.md).

---

## 8. Command Palette

Overlay invocado por `⌘K`. Reemplaza el menú hamburguesa entero.

### Anatomía

```
┌─────────────────────────────────────────────────┐
│ ⌘K  buscar comando…                       esc   │
├─────────────────────────────────────────────────┤
│ MODELO                  │ CREAR                 │
│ ▸ guardar         ⌘S    │   nuevo objeto    O   │
│   guardar como…   ⌘⇧S   │   nuevo proceso   P   │
│   …                     │   …                   │
├─────────────────────────────────────────────────┤
│ NAVEGAR                 │ EXPORTAR              │
│ …                       │ …                     │
├─────────────────────────────────────────────────┤
│ VISTA                   │ ASISTENTE             │
│ …                       │ …                     │
├─────────────────────────────────────────────────┤
│ ↑↓ navegar · ↵ ejecutar · ⌘. ayuda              │
└─────────────────────────────────────────────────┘
```

### Visual

- 620 px de ancho, altura variable hasta 620 px.
- **Backdrop:** paper al 80% (`#fafaf8cc`) + `backdrop-filter: blur(2px)`. NO overlay oscuro.
- Padding del input: `18px 22px`. Separado de secciones por hairline.
- Secciones en grid 2 columnas, hairlines dotted internas.
- **Item activo:** `background: var(--cx-paper-warm)` + `border-left: 2px solid var(--cx-crimson)` + padding-left añade 8px.

### Las 6 secciones canónicas

| Sección | Items mínimos |
|---|---|
| `MODELO` | guardar, guardar como…, nuevo modelo, abrir/importar…, renombrar modelo |
| `CREAR` | nuevo objeto (O), nuevo proceso (P), nuevo estado en objeto seleccionado (S), nueva relación (R), nuevo OPD hijo (`⌘⇧I`) |
| `NAVEGAR` | ir al SD raíz, ir a SD1, mapa del sistema, siguiente OPD |
| `EXPORTAR` | OPD actual como PNG, todos los OPDs como ZIP de PNGs, modelo como JSON, OPL como HTML |
| `VISTA` | alias visibles, descripciones visibles, cuadrícula, biblioteca dock (toggles `✓` / `—`) |
| `ASISTENTE` | iniciar asistente SD (`⌘⇧A`), ir a etapa actual |

Las secciones aparecen siempre en este orden. Cada item es una línea (no chip ni botón).

---

## 9. CodexInspectSection

Sección del inspector. Estructura: kicker uppercase + (opcional) acción a la derecha + contenido. Separadas entre sí por hairline.

```ts
interface CodexInspectSectionProps {
  label: string;        // "VALOR", "ESTADOS"
  right?: ReactNode;    // <span>+ nuevo</span>
  compact?: boolean;    // padding reducido en modo split
  children: ReactNode;
}
```

- Padding top: 12px (compact: 8px). Border-top hairline.
- Kicker: Inria Sans 9.5px tracked `0.22em` uppercase en inkSoft.

---

## 10. CodexInspectField

Campo simple: `clave` italic a la izquierda, `valor` a la derecha. Opcional caret `▾` (select) y/o link.

```ts
interface CodexInspectFieldProps {
  k: string;          // "tipo", "unidad"
  v: string;          // "texto", "—"
  select?: boolean;
  mono?: boolean;
  link?: string;      // "+ agregar"
}
```

- Padding: `4px 0`.
- Clave: italic serif 12.5px en inkMid.
- Valor: serif (o mono si `mono`) 12.5/11px. Si valor es `—` / `off` / `sin adjuntar` → inkSoft.
- Link: Inria Sans 10.5px en ink.

---

## 11. CodexInspectInline

Segmented control inline — opciones separadas por `·`, la activa subrayada y bold.

```ts
interface CodexInspectInlineProps {
  k: string;
  options: string[];   // ['informacional', 'física']
  active: number;
}
```

- Opciones separadas por `·` en inkFaint.
- Activa: peso 600, color ink, `border-bottom: 1px solid var(--cx-ink)`.
- Inactivas: peso 400, color inkSoft.

---

## 12. CodexStateRow

Fila de estado dentro del inspector.

```ts
interface CodexStateRowProps {
  name: string;        // "problematic"
  flags: string[];     // ['inicial', 'actual']
}
```

- Padding: `8px 0`, border-bottom dotted.
- Header: badge 8×8 con border olive + fill stateFill + nombre del estado en italic serif 14px.
- Flags: 6 palabras (`inicial · final · actual · por defecto · duración · suprimir`), gap 8px, sans 11px.
  - Flag activo: peso 600, color ink, underline ink.
  - Flag inactivo: peso 400, color inkSoft.
  - Flag `suprimir` SIEMPRE en crimson.

---

## 13. CodexFooterKey

Leyenda de tecla en el footer.

```ts
interface CodexFooterKeyProps {
  k: string;            // "O", "⌘K"
  label: string;        // "objeto", "comandos"
  color?: string;       // border del kbd (OPM canon cuando aplique)
}
```

- kbd: JetBrains Mono 9.5px, padding `1px 5px`, `border: 1px solid {color || rule}`.
  - `O` → border verde (`--cx-opm-green`)
  - `P` → border azul (`--cx-opm-blue`)
  - `S` → border olive (`--cx-opm-olive`)
  - `R` → border rule
  - `⌘K` → border rule
- Label: Inria Serif italic 11px en inkMid.

---

## Apéndice — Patrones prohibidos

| Patrón | Por qué |
|---|---|
| `Button` con background + radius + shadow | Las acciones son palabras separadas por `·`. |
| `Tooltip` flotante con caret | Usar marginalia al pie de la oración OPL. |
| Overlay oscuro en command palette | Backdrop es paper + blur. |
| Tabs con underline-active gruesa | Usar tree row con marker `▸`. |
| Toasts | Usar marginalia con severidad. |
| Iconos vectoriales (FontAwesome, Lucide, etc.) | Codex usa solo glifos Unicode. Ver [`07-glyphs.md`](07-glyphs.md). |
| `Switch` UI con bola | Usar segmented inline (palabras subrayables). |

---

## Apéndice — Tests visuales

Comparar contra `handoff/screenshots/` (909×540, JointJS renderiza vacío — es la responsabilidad del dev verificar el canvas con sus shapes contra [`08-jointjs-styling.md`](08-jointjs-styling.md)).
