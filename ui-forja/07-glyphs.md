# Codex — Iconografía tipográfica

**Producto:** OpForja (editor OPM)
**Propuesta:** Codex · v1.0

Codex **no usa iconos vectoriales**. Toda señal gráfica está hecha con caracteres Unicode. Esta es una decisión deliberada: refuerza el carácter editorial y elimina la dependencia de una librería de iconos.

---

## 1. Catálogo completo

| Glifo | Unicode | Nombre Unicode | Rol en Codex | Familia |
|---|---|---|---|---|
| `※` | U+203B | REFERENCE MARK | Selección única — barra emergente | serif |
| `△` | U+25B3 | WHITE UP-POINTING TRIANGLE | Severidad de validación (acompaña `ALTA`/`CRÍTICA`) | serif/mono |
| `▸` | U+25B8 | BLACK RIGHT-POINTING SMALL TRIANGLE | Marker del item actual en tree | mono |
| `▢` | U+25A2 | WHITE SQUARE WITH ROUNDED CORNERS | Mini-badge de estado en inspector (usado en `CodexStateRow`) | sans |
| `·` | U+00B7 | MIDDLE DOT | Separador inline omnipresente | serif/mono |
| `+` | U+002B | PLUS SIGN | Acciones de creación (`+ nuevo OPD hijo`, `+ nuevo estado`) | sans |
| `−` | U+2212 | MINUS SIGN | (Reservado para v1.1 — eliminar individual sin confirmación) | — |
| `✕` | U+2715 | MULTIPLICATION X | Cerrar / dismiss / limpiar filtro | sans |
| `✓` | U+2713 | CHECK MARK | Estado limpio (`✓ ningún diagnóstico`), toggles "on" | serif italic |
| `—` | U+2014 | EM DASH | Valor vacío (`unidad: —`), separador de nota sin severidad | serif |
| `↵` | U+21B5 | DOWNWARDS ARROW WITH CORNER LEFTWARDS | Confirmar (`↵ ejecutar`) | mono |
| `⌫` | U+232B | ERASE TO THE LEFT | Eliminar (acción + shortcut) | mono |
| `⌘` | U+2318 | PLACE OF INTEREST SIGN | Modificador macOS Command | mono |
| `⌃` | U+2303 | UP ARROWHEAD | Modificador Control | mono |
| `⇧` | U+21E7 | UPWARDS WHITE ARROW | Modificador Shift | mono |
| `⌥` | U+2325 | OPTION KEY | Modificador Option (alt) | mono |
| `→` | U+2192 | RIGHTWARDS ARROW | Flecha de causa-efecto en marginalia (`beneficiarios externos → ambiental`) | serif |
| `↑` `↓` | U+2191 / U+2193 | UP/DOWN ARROW | Navegación en command palette | mono |
| `▾` | U+25BE | BLACK DOWN-POINTING SMALL TRIANGLE | Caret de select (`tipo: texto ▾`) | sans |
| `«` `»` | U+00AB / U+00BB | LEFT/RIGHT DOUBLE ANGLE QUOTATION MARK | Citas SSOT en el índice | serif |
| `°` | U+00B0 | DEGREE SIGN | (Reservado para v1.1 — etiquetas técnicas) | — |

---

## 2. Reglas de uso por glifo

### `※` (reference mark)

- **Solo en barra emergente de selección única.** Renderizado en serif 20px, color `var(--cx-crimson)`, posicionado a la izquierda de las acciones.
- No usar en otros contextos.

### `△` (warning triangle)

- **Solo en kickers de severidad** dentro de marginalia:
  - `△ CRÍTICA` (color crimson)
  - `△ ALTA` (color olive)
  - `△ N sugerencias` en footer (color inkMid, italic)
- En JetBrains Mono 9px tracked 0.12em uppercase.
- No usar como ícono "warning" genérico.

### `▸` (current marker)

- **Solo en tree rows** que representan el OPD actualmente activo.
- En JetBrains Mono o equivalente, color ink (no soft).
- Si se quiere expresar "actual" en otros contextos, NO reusar este símbolo — usar peso de fuente o subrayado.

### `▢` (mini-stadium)

- **Solo en `CodexStateRow`** como mini-badge antes del nombre del estado.
- En sans 8px con border olive + fill stateFill — emula visualmente un stadium pequeño.

### `·` (middle dot)

- **Separador inline universal.**
- Color: inkFaint (`#b5b0a4`) entre items secundarios, inkSoft entre identificadores meta.
- Spacing: `padding: 0 6px` o gap flex 6-8px.
- NO usar `•` (bullet U+2022 — más grueso, indica lista). NO usar `,` para separar metadatos.

### `+`

- **Solo acciones de creación.** Color: `var(--cx-crimson)` cuando es acción primaria, `var(--cx-ink)` cuando es link inline.
- NO usar para sumar valores.

### `✕`

- **Solo cerrar / dismiss.** Color inkSoft o inkMid (no crimson — crimson está reservado a marcas más fuertes).
- Tamaño 14-16px.

### `✓`

- **Solo estado verde-conformidad TÁCITO** — `✓ ningún diagnóstico` en footer.
- También para toggles "on" en command palette (`alias visibles ✓`).
- Color: `var(--cx-ink-mid)` en italic serif. NO usar verde — no hay verde en chrome (verde es semántico OPM).

### `—`

- **Valor vacío** en inspector fields (`unidad: —`, `valor actual: —`).
- En mono cuando el valor es identificador, en serif cuando es prosa.
- Color inkSoft.

### Teclas modificadoras

`⌘`, `⌃`, `⇧`, `⌥` se combinan en `kbd` sin espacios: `⌘⇧A`, `⌃S`, `⌥H`. En JetBrains Mono 10px con tracking 0.06em.

Los `kbd` van envueltos en una caja con `1px solid var(--cx-rule)` y padding `2px 5px`. NO usar background distinto al paper.

---

## 3. Glifos prohibidos

Estos glifos **NO** se usan en Codex y deben evitarse:

| Glifo | Por qué no |
|---|---|
| `•` (bullet) | Implica lista — Codex usa hairlines + numeración mono |
| `★` `☆` | Decorativo |
| `❤` `💚` | Emoji |
| `📁` `📄` `🔍` | Pictogramas — Codex es tipográfico |
| Cualquier emoji | Sin excepciones |
| `>` `<` (chevrons) | Codex no usa chevrones (`>` para "expandir", etc.) |
| `→` excepto en marginalia | Solo OK en frases tipo "X → Y" como conector lógico |
| `…` (ellipsis) excepto en placeholders | NO usar para truncar etiquetas del OPD (V-212) |

---

## 4. Render de kbds (atajos de teclado)

Formato canónico de un kbd:

```html
<kbd style="
  font-family: var(--cx-font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  padding: 2px 5px;
  border: 1px solid var(--cx-rule);
  color: var(--cx-ink-mid);
">⌘K</kbd>
```

Ejemplos:

- `⌘K` (sin guion entre teclas)
- `⌘⇧A`
- `⌃S`
- `⌥H`
- `O` (tecla única, también con borde)
- `↵`

**Reglas:**

- Sin guiones, sin signos `+` entre teclas. La concatenación visual es por contigüidad.
- Las teclas alfabéticas van en MAYÚSCULA (`O`, no `o`).
- El kbd va en línea, no en bloque.

---

## 5. Caracteres editoriales en citas

Las citas SSOT en el índice izquierdo y en marginalia usan comillas españolas:

- Apertura: `«` (U+00AB)
- Cierre: `»` (U+00BB)

Ejemplo:

```
«El SD precede a cualquier refinamiento; debe ser
simple y claro, con mínimos detalles técnicos.»
                                metodología §6
```

NO usar `"..."` (comillas inglesas rectas) ni `“..."` (typographic quotes inglesas). Las citas SON en español, las comillas también.

---

## 6. Symbol fonts (futuro)

Si en v1.1 se necesita un glifo que no existe en Unicode (improbable), considerar:

1. Crear un símbolo SVG inline como excepción documentada.
2. NO importar una font icon (FontAwesome, Material Icons, etc.) — rompe el principio "todo es tipografía".

Para v1, todos los glifos requeridos están en este catálogo.
