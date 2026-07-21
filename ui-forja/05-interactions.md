# Codex — Interacciones del Chrome

**Producto:** OpForja (editor OPM)
**Propuesta:** Codex · v1.1

> **Scope:** este documento cubre solo las interacciones del **chrome** (command palette, panel toggles, hover/focus states en HTML). Las interacciones del **canvas** (selección, marquee, drag, pan, zoom, edición inline de etiquetas, refinamiento) las maneja JointJS y se especifican en [`08-jointjs-styling.md` §6](08-jointjs-styling.md#6-element-tools-y-link-tools).

---

## 1. Atajos globales que el chrome captura

Estos atajos los maneja el handler global de teclado de la app, NO JointJS:

| Tecla | Acción |
|---|---|
| `⌘K` / `Ctrl+K` | Abre el command palette |
| `Esc` (con palette abierto) | Cierra el palette |
| `Esc` (con palette cerrado y sin foco en input) | Pasa a JointJS — deselecciona |
| `⌘.` | Toggle del panel de marginalia OPL (oculta/muestra columna izquierda) |
| `⌘S` / `⌘⇧S` | Guardar / guardar como (ejecuta acción del modelo, no de JointJS) |
| `⌘Z` / `⌘⇧Z` | Undo / Redo (sobre el `graph` de JointJS) |
| `⌘T` / `⌘W` | Nuevo tab de modelo / cerrar tab activo |
| `⌘1`, `⌘2`, … `⌘9` | Saltar al tab de modelo N |
| `⌘⇧[` / `⌘⇧]` | Tab de modelo anterior / siguiente |
| `⌘↓` / `⌘↑` | Navegar OPDs dentro del modelo activo |

Los atajos de creación (`O`, `P`, `S`, `R`) y manipulación (`⌘D`, `⌘L`, `⌘G`, `⌫`, `Enter`) los maneja JointJS — ver `08-jointjs-styling.md` §6.

---

## 2. Command palette (`⌘K`)

### 2.1 Activación

| Tecla | Acción |
|---|---|
| `⌘K` (macOS) / `Ctrl+K` | Abre |
| `Esc` | Cierra (sin ejecutar) |
| Click fuera del card | Cierra |

Al abrir, **deshabilitar JointJS Paper**: `paper.setInteractivity(false)`. Al cerrar, restaurar al valor previo (recordar el estado anterior por si era distinto del default).

### 2.2 Navegación dentro del palette

| Tecla | Acción |
|---|---|
| Tipear | Filtra items (fuzzy match sobre label + sección + keywords) |
| `↑` / `↓` | Mueve cursor entre items visibles |
| `↵` (Enter) | Ejecuta |
| `⌘↵` | Ejecuta y mantiene el palette abierto |
| `⌘.` | Muestra ayuda contextual del item activo |

### 2.3 Item activo

- `background: var(--cx-paper-warm)` + `border-left: 2px solid var(--cx-crimson)` + padding-left 8px adicional.
- Siempre exactamente uno activo (incluso al abrir).

### 2.4 Búsqueda

- Match exacto > fuzzy.
- Match en label (peso 1.0) > sección (0.5) > keywords (0.3).
- Máximo 12 resultados, ordenados por score.
- Sin resultados: italic serif al pie del palette → `"sin resultados — ⌘. para registrar acción"`.

---

## 3. Hover states (chrome HTML)

Solo aplican a elementos HTML; los hover sobre símbolos del canvas los maneja JointJS:

| Elemento | Default | Hover |
|---|---|---|
| Acción de texto en barra emergente | `color: inkMid` | `color: ink` + underline 1px currentColor |
| Footer key | `color: inkMid` | `color: ink` |
| Tree row | según current | row gana `background: var(--cx-paper-warm)` |
| OPL note (número de oración) | `color: inkSoft` | `color: ink`, cursor pointer |
| Inspector field | clave en inkMid | clave en ink, cursor según editable |
| Segmented inline option inactiva | inkSoft | inkMid |

Transición: `100ms ease` solo en color.

### Hover sobre OPL number ↔ canvas highlight

Cuando el usuario pasa el cursor sobre el número de una oración OPL:

- Resaltar el símbolo OPM correspondiente en el canvas vía un highlighter temporal de JointJS — ver `08-jointjs-styling.md` §5.2 (hover highlighter).
- Al salir el cursor, remover el highlighter.

Cuando el usuario pasa el cursor sobre un símbolo del canvas:

- JointJS dispara `cell:mouseenter` → la app puede resaltar la oración OPL correspondiente con un fondo `paper-warm` momentáneo.

---

## 4. Focus states (teclado)

Solo en HTML:

- **Inputs / text fields:** outline 1px solid `var(--cx-crimson)` con offset 2px.
- **Buttons / acciones de texto:** mismo outline.
- **Tree rows / command palette items:** `background: paper-warm` + `border-left: 2px solid crimson`.

NO usar el outline browser default. NO usar shadows en focus.

---

## 5. Sincronización canvas ↔ OPL (la interacción crítica)

Codex se basa en la **bidireccionalidad** OPD↔OPL. La app debe implementarla:

### 5.1 Cambio de selección en canvas → chrome reacciona

JointJS emite `selection:change` (o `element:pointerclick` + custom selection store):

1. La columna izquierda OPL se transforma según count:
   - 0 seleccionados → mostrar OPL completa del OPD activo
   - 1 → mostrar filtro `filtrado · id · visibles/total ✕`
   - ≥2 → mostrar OPL filtrada a las oraciones relacionadas ([scene 03](03-scenes.md#03--selección-múltiple-en-sd1-in-zoom))
2. La columna derecha mantiene Índice arriba e Inspector abajo; con selección, el Inspector se puebla.
3. La **barra emergente HTML** se reposiciona usando `paper.localToPaperRect(bbox)` y aparece.
4. El footer central puede mostrar info contextual.

### 5.2 Click en oración OPL → canvas reacciona

1. Identifica el cell ID asociado a la oración.
2. Llama `graph.getCell(id)` y selecciónalo (o pásalo a tu selection store).
3. JointJS aplica el highlighter de selección automáticamente.

### 5.3 Edición de nombre de símbolo → regenera OPL

Cuando JointJS dispara `change:attrs` o un evento custom de renombrado:

1. La app regenera las oraciones OPL que mencionan ese símbolo.
2. La columna izquierda re-renderiza la lista.

Este paso NO lo hace JointJS — es lógica de la app sobre el modelo.

---

## 6. Estados del modelo

El meta del header del frame refleja estos estados:

| Estado | Meta line |
|---|---|
| Cambios sin guardar | `· sin guardar` (italic serif) |
| Guardando (in-flight) | `· guardando…` |
| Guardado limpio | `· guardado · hace Ns` |

El encabezado del panel `Diagnóstico`, bajo OPL, refleja el estado del OPD activo:

| Diagnóstico | Resumen compacto |
|---|---|
| Limpio | `sin hallazgos` |
| Con bloqueos | `! N bloqueo(s) · M más` (crimson) |
| Sin bloqueos, con mejoras | `△ N mejora(s) · M más` (olive) |
| Solo estilo/legibilidad | `· N observación(es)` (inkMid) |

Click en el encabezado → expande o colapsa el panel. Solo se muestran secciones no vacías. Cada hallazgo mantiene juntos el mensaje, la navegación a su instancia y un detalle progresivo `Criterio` con fuente, fundamento y acciones. El diagnóstico es reactivo: no requiere un botón de revalidación.

---

## 7. Autoguardado

- **No autoguardado en cloud cada N segundos.** El usuario decide cuándo guardar.
- **Sí** draft local en localStorage cada 5s para recuperación post-crash.
- Si al abrir existe un draft más nuevo que el last-saved: footer single line `borrador local más reciente · ⌘K → recuperar`.

---

## 8. Atajos del asistente SD (v1.1+)

| Tecla | Acción |
|---|---|
| `⌘⇧A` | Inicia asistente |
| Dentro: `↵` | Avanzar de etapa |
| `⌘←` | Volver |
| `⌘.` | Mostrar regla SSOT de la etapa actual |

El asistente NO modaliza el editor — vive en la columna derecha (reemplazando temporalmente el Inspector). El canvas sigue interactivo.

---

## 9. Apéndice — Mapa de atajos por capa

```
CHROME (manejados por la app, fuera de JointJS)
  ⌘K          comandos
  ⌘S / ⌘⇧S    guardar / guardar como
  ⌘N          nuevo modelo
  ⌘O          abrir / importar
  ⌘1 … ⌘9     saltar al tab de modelo N
  ⌘⇧[ / ⌘⇧]   tab anterior / siguiente
  ⌘↓ / ⌘↑     navegar OPDs del modelo activo
  ⌘.          toggle marginalia OPL
  ⌘⇧A         iniciar asistente
  Esc         (con palette) cerrar palette

CANVAS (manejados por JointJS — ver 08-jointjs-styling.md §6)
  O / P / S / R           crear elemento
  ⌘+ / ⌘- / ⌘0            zoom / fit
  ⌘Z / ⌘⇧Z                undo / redo del graph
  ⌘C / ⌘V / ⌘D            copy / paste / duplicate
  ⌘A                      select all
  ⌘L / ⌘G                 lock / group
  ⌘⇧I / ⌘⇧U               in-zoom / unfold
  ⌫                       delete
  Enter (sobre símbolo)   renombrar inline
  Space + drag            pan
  Scroll wheel            pan vertical
  ⌘ + scroll              zoom
```

Esta tabla debe estar accesible desde el command palette (`⌘K` → `mostrar atajos`).
