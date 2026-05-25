# Codex — Especificación de Pantallas

**Producto:** OpForja (editor OPM)
**Propuesta:** Codex · v1.1

Cuatro pantallas canónicas. Cada una usa el mismo [`CodexFrame`](02-components.md#1-codexframe) y solo varía qué llena las tres regiones (OPL izquierda, canvas-mount, índice/inspector derecho) y qué *floating* aparece sobre el canvas.

> **División de responsabilidades:**
> - **Chrome** (OPL, índice, inspector, header, footer, barra emergente, command palette) → HTML/CSS — responsabilidad del equipo de UI.
> - **Canvas** (símbolos OPM, enlaces, marquee de selección, pan/zoom, drag) → **JointJS**. Codex solo especifica los **atributos visuales** vía [`08-jointjs-styling.md`](08-jointjs-styling.md).

Las capturas en `handoff/screenshots/` muestran ambas capas integradas; el HTML standalone en `handoff/scenes/` muestra la composición a alta fidelidad pero **sin JointJS conectado** — el canvas se ve vacío en el standalone porque solo el dev tiene los shapes de JointJS.

---

## 01 · Editor principal

**Archivo:** `handoff/scenes/01-editor.html`
**Componente raíz:** `<CodexEditor/>`
**Screenshot:** `handoff/screenshots/01-editor.png`

![Editor principal](screenshots/01-editor.png)

### Estado modelado

Vista por defecto al abrir el editor. SD raíz cargado. Nada seleccionado.

### Regiones (chrome HTML)

#### Header

- Wordmark: `Opforja`
- Tabs workspace: `System Diagram ×    Modelo ×    +`
- Breadcrumb: `sistema · system diagram` (último en bold)
- Meta: `24 oraciones · sin guardar`
- Shortcut visible: `⌘K`

#### Columna izquierda — Marginalia OPL

```
MARGINALIA
OPL

01 oración…
02 oración…
…

copiar · html · exportar
```

#### Centro — CodexCanvasMount + JointJS

- Wrapper en HTML: label `SD · OPD raíz` + zoom `100%` arriba.
- JointJS Paper monta dentro y dibuja: 7 objetos + 1 proceso + 1 atributo compuesto con 2 estados + agregación + exhibición + 3 enlaces procedimentales.
- Floating hint HTML (top-right, sobre el paper container): `ejemplo precargado · asistente guiado · empezar vacío ✕` — overlay HTML, no `paper.options.background`.

#### Columna derecha — Índice + Inspector

- Top (~30%): `ÍNDICE` / `OPDs` + árbol real de OPDs.
- Hairline-strong + meta line `INSPECTOR · Selection · LIVE`.
- Bottom (~70%): inspector completo si hay selección, o empty state si no la hay.
- La cita SSOT del árbol aparece al pie del bloque de índice cuando hay espacio.

#### Footer

- `23 may · v0.4 · f.s.`
- Keys: `O objeto · P proceso · S estado · R relación · ⌘K comandos`
- Estado: `✓ ningún diagnóstico`

### Lo que tu equipo implementa

- ✅ CodexFrame con las 3 regiones
- ✅ OPL renderizada en marginalia izquierda (lista de oraciones del modelo OPD activo)
- ✅ Tree de OPDs leyendo del modelo en la columna derecha
- ✅ JointJS Paper montado en el centro con los shapes definidos en `08-jointjs-styling.md`
- ✅ Floating hint dismissable (localStorage)

### Lo que NO

- ❌ Lógica de render del OPD — JointJS la maneja
- ❌ Pan/zoom/drag — JointJS Paper options
- ❌ Iconos vectoriales

---

## 02 · Command palette (`⌘K`)

**Archivo:** `handoff/scenes/02-command.html`
**Screenshot:** `handoff/screenshots/02-command.png`

![Command palette](screenshots/02-command.png)

### Estado modelado

`⌘K` invocado. El canvas (incluido JointJS Paper) y los paneles laterales se atenúan al 30% como backdrop, sin desmontarse. El palette aparece centrado en HTML overlay.

### Anatomía del palette

[Detalle en `02-components.md` §8](02-components.md#8-command-palette).

### Comportamiento

- **Invocación:** `⌘K` (macOS) / `Ctrl+K` (Windows/Linux).
- **Cierre:** `Esc` o click fuera.
- **Búsqueda:** filtra items en tiempo real (fuzzy).
- **Navegación:** `↑↓` mueve activo. `↵` ejecuta. `⌘.` ayuda.
- **Backdrop:** paper al 80% + blur 2px.

### Cómo afecta a JointJS

- Cuando el palette está abierto, **deshabilitar interactividad del paper** vía `paper.setInteractivity(false)`. Restaurar al cerrar.
- El blur del backdrop aplica al wrapper que contiene el paper container — JointJS sigue funcional pero "fuera de foco".

### Lo que NO modela JointJS aquí

El palette es overlay HTML 100%. JointJS solo recibe la orden de pausar interactividad mientras dura.

---

## 03 · Selección múltiple en SD1 (in-zoom)

**Archivo:** `handoff/scenes/03-multi-select.html`
**Screenshot:** `handoff/screenshots/03-multi-select.png`

![Multi-select](screenshots/03-multi-select.png)

### Estado modelado

Usuario navegó a SD1. Hay 3 sub-atributos de un compound seleccionados via marquee o `⇧+click`. Aparece la barra emergente.

### Regiones

#### Columna izquierda

OPL filtrada a SD1 (10 oraciones). Oraciones 05–08 marcadas como `selected` (border-bottom crimson). Marginalia ALTA en la 05.

#### Centro

- Label: `SD1 · in-zoom de Beneficiary Relevant Attribute`, zoom `120%`.
- JointJS Paper dibuja el compound `o.06` desplegado con sus 3 sub-atributos + 2 estados.
- **Selección visual** dentro del canvas la maneja JointJS vía un highlighter — ver [`08-jointjs-styling.md` §5.1](08-jointjs-styling.md#51-highlighter-de-selección).
- **Barra emergente HTML** centrada en el borde inferior del canvas mount (overlay), con marca `3` grande crimson y meta `3 seleccionadas · partes de o.06 · profundidad justificada`.

#### Columna derecha

Top: árbol con SD1 marcado como current. Bottom: inspector/empty state según selección.

### División canvas / chrome

| Capa | Maneja |
|---|---|
| Marquee de selección (rectángulo punteado durante el drag) | JointJS (Paper option `interactive.boxSelection` o lógica del equipo) |
| Highlight de elementos seleccionados (subrayado crimson bajo etiqueta) | JointJS highlighter — colors definidos en tokens |
| Barra emergente con las acciones | HTML overlay — `<CodexSelectionAnnotation>` |
| OPL filtrada en columna izquierda | HTML — filtra el modelo OPL por los IDs seleccionados que JointJS reporta |

---

## 04 · Inspector de objeto

**Archivo:** `handoff/scenes/04-inspector.html`
**Screenshot:** `handoff/screenshots/04-inspector.png`

![Inspector](screenshots/04-inspector.png)

### Estado modelado

Un objeto seleccionado (`o.06`). La OPL izquierda muestra el filtro `filtrado · o.06 · 4/24 ✕`; la columna derecha mantiene índice arriba e Inspector abajo.

### Regiones

#### Centro

- JointJS Paper dibuja el SD con el objeto seleccionado.
- Highlighter sobre `o.06` (subrayado crimson bajo etiqueta).
- **Barra emergente HTML** anclada cerca de `o.06`. Marca `※`, acción primaria `inspector`, meta `o.06 · objeto · informacional · sistémico`.

#### Columna derecha — split

**Top (~30%): Índice** — árbol de OPDs, con `SD` current o el OPD activo correspondiente.

**Divider hairline-strong:**
```
INSPECTOR                  Selection · LIVE
```

**Bottom (~70%): Inspector** — secciones formales:

- Header: badge `o.06 · seleccionado`, título `Beneficiary Relevant Attribute`, sub-line `objeto · informacional · sistémico`
- `esencia` (informacional · física) y `afiliación` (sistémica · ambiental) inline
- **VALOR** — tipo, unidad, valor actual, simulación
- **ESTADOS** — problematic y satisfactory con flags
- **OTROS** — dirección de layout, imagen

#### Columna izquierda — OPL filtrada

```
MARGINALIA · OPL              filtrado · o.06 · 4/24 ✕
```

4 oraciones que mencionan `o.06` + footer `limpiar filtro · copiar · html`.

### División canvas / chrome

| Capa | Maneja |
|---|---|
| Highlighter del objeto seleccionado | JointJS |
| Barra emergente | HTML overlay |
| Índice + Inspector split | HTML — leyendo el ID seleccionado del JointJS Graph |
| OPL filtrada izquierda | HTML — leyendo el ID seleccionado del JointJS Graph |

---

## Apéndice — Cómo emergen las vistas

| Acción del usuario | Vista resultante | Quién la dispara |
|---|---|---|
| Abrir un modelo | **01 Editor** | App init |
| Presionar `⌘K` | **02 Command palette** sobre la actual | App keyboard handler |
| Click entrada `SD1` del árbol | **01 Editor** mostrando SD1 | App routing + reload del graph en JointJS |
| Marquee o `⇧+click` en canvas | **03 Multi-select** | JointJS dispara `selection:change`, app actualiza chrome |
| Click en un símbolo | **04 Inspector** | Igual al anterior, con 1 solo seleccionado |
| `Esc` o click vacío | Vuelve a **01 Editor** | JointJS `blank:pointerclick` |

Las 4 vistas son **un solo editor**, no rutas distintas. El frame nunca cambia.

---

## Apéndice — Estados no mockeados (v1.1+)

- **Asistente guiado** — flujo wizard por etapas (§6 metodología); columna derecha como formulario.
- **Empezar vacío** — canvas con placeholder serif italic.
- **Renombrar modelo** — modal pequeño tipo command palette.
- **Diagnóstico expandido** — al hacer click en `△ N sugerencias` del footer.
- **Proceso activo / Estado actual** (§17) — pendiente de definir canal visual sobre JointJS.
- **Sub-modelos / referencias inter-modelo** (§10).
