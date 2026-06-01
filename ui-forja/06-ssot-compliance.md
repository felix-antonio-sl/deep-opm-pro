# Codex — Mapa de Cumplimiento contra la SSOT OPM-ES

**Producto:** OpForja (editor OPM)
**Propuesta:** Codex · v1.0
**SSOT versión revisada:** OPM-ES corpus v3.0.0 (2026-04-27)

Este documento mapea cada decisión de diseño relevante de Codex a una regla canónica de la SSOT. Sirve como auditoría — si una decisión de implementación entra en conflicto con la SSOT, debe revertirse.

Las cuatro capas canónicas referenciadas:

| Capa | URN | Archivo |
|---|---|---|
| Semántica | `urn:fxsl:kb:opm-es` | `opm-iso-19450-es.md` |
| Visual | `urn:fxsl:kb:opd-es` | `opm-visual-es.md` |
| Textual | `urn:fxsl:kb:opl-es` | `opm-opl-es.md` |
| Metodológica | `urn:fxsl:kb:manual-metodologico-opm-es` | `metodologia-opm-es.md` |

**Regla de precedencia (cf. README SSOT):** semántica > visual > textual > metodológica. Codex no contradice ninguna capa.

---

## 1. Capa Visual (`opd-es`)

### V-63 — Colores canónicos

> *"Los colores no codifican semántica por sí mismos; la semántica se fija por forma, contorno y sombreado. El siguiente esquema de colores es solo una convención de referencia: Objeto verde, Proceso azul oscuro, Estado verde oliva, Enlaces negro."*

| Decisión Codex | Token | Cumple |
|---|---|---|
| Objetos con borde verde `#27613f` | `--cx-opm-green` | ✓ |
| Procesos con borde azul oscuro `#1d3f78` | `--cx-opm-blue` | ✓ |
| Estados con borde verde oliva `#68711f` + fill gris claro `#dedacb` | `--cx-opm-olive`, `--cx-state-fill` | ✓ |
| Todos los enlaces (estructurales y procedimentales) en negro `#171511` | `--cx-ink` | ✓ |
| Pills/contadores del chrome usan los colores canónicos por clase | footer keys: verde objeto, azul proceso, olive estado | ✓ refuerza |

### V-129 — Triángulo estructural

> *"Todo triángulo estructural DEBE conectar por línea visible al menos con el refinable por el vértice y con un refinador por la base."*

| Decisión Codex | Cumple |
|---|---|
| Triángulos de agregación renderizados con stroke 1.2px ink, fill `none`, con líneas explícitas al refinable (arriba) y refinadores (abajo) | ✓ |

### V-130 — Triángulos UI vs semánticos

> *"Si el canvas editable muestra triángulos auxiliares que desaparecen en export, deben distinguirse perceptualmente de los triángulos semánticos."*

| Decisión Codex | Cumple |
|---|---|
| Codex NO usa triángulos como UI. Los únicos triángulos son semánticos. | ✓ (sin posibilidad de confusión) |

### V-132 — Proceso activo vs refinable

> *"El canal visual reservado al proceso activo no puede coincidir exactamente con el canal del refinable."*

| Decisión Codex | Cumple |
|---|---|
| Proceso activo (in-flight): no se mockeó explícitamente en v1, pero el design system reserva `var(--cx-crimson)` y `var(--cx-opm-olive)` como canales distintos. El borde de proceso es siempre `var(--cx-opm-blue)`; un proceso activo se distinguiría con un canal adicional (halo, marca de pin) — a definir en v1.1. | ⚠ pendiente |

### V-191 — Handles de edición vs piruletas semánticas

> *"Los handles de edición y puntos de anclaje UI no pueden ser visualmente idénticos a las piruletas de §1.5 en el canon-diagrama."*

| Decisión Codex | Cumple |
|---|---|
| Codex no usa círculos como handles. La selección se indica con subrayado crimson. | ✓ |

### V-202 — Elementos UI no semánticos

> *"Handles de selección, puntos de rotación, menús radiales, toasts, backdrops modales y marcadores transitorios de creación no pertenecen a la gramática OPM y deben omitirse en los exports."*

| Decisión Codex | Cumple |
|---|---|
| Subrayado crimson, barra emergente, command palette, marcas `※`, `△` — todos viven en una capa "UI" y deben omitirse al exportar SVG/JSON del OPD. | ✓ (responsabilidad de implementación) |

### V-203 — Canal visual reservado a UI

> *"Los elementos UI de edición deben usar un canal visual reservado y no ambiguo respecto de §1, §2, §3, §8, §10, §17, §19, §20 y §23. Se recomienda color de interfaz diferenciado."*

| Decisión Codex | Token | Cumple |
|---|---|---|
| Crimson `#8e2a2e` es el único color de UI usado y NO aparece en ninguna semántica OPM (que usa verde/azul/olive/negro) | `--cx-crimson` | ✓ |

### V-209 — Cosas de igual clase comparten base cromática/tipográfica

> *"Cosas de igual clase comparten base cromática/tipográfica en OPD."*

| Decisión Codex | Cumple |
|---|---|
| Todos los objetos: stroke verde, etiqueta serif regular 17px | ✓ |
| Todos los procesos: stroke azul, etiqueta serif italic 17px | ✓ |
| Todos los estados: stroke olive, fill gris, etiqueta serif italic 13px | ✓ |

### V-210 — Estilado autoral

> *"El estilado autoral no puede reutilizar sin distinción rojo, amarillo de alerta o verde de conformidad como semántica tácita."*

| Decisión Codex | Cumple |
|---|---|
| Crimson (rojo) en Codex se reserva a UI (selección, alertas, marcas) — no se usa como "semántica tácita" en el OPD. | ✓ |
| Amarillo: no se usa en Codex. | ✓ |
| Verde: solo aparece como color canónico de Objeto (V-63). | ✓ |

### V-211 — Tipografía del rótulo

> *"La familia tipográfica, peso, tamaño, color y alineación del rótulo pertenecen a la capa autoral. Sin embargo, el rótulo no puede salir del bounding box visible ni perder legibilidad."*

| Decisión Codex | Cumple |
|---|---|
| Etiquetas dentro de símbolos: Inria Serif 17px, centradas. Bounding box dimensionado para contener la etiqueta sin truncamiento. | ✓ |

### V-212 — No truncamiento silencioso

> *"El canon-diagrama no admite truncamiento silencioso del rótulo. La herramienta debe expandir, reubicar o rechazar el resize antes que exportar una elipsis no declarada."*

| Decisión Codex | Cumple |
|---|---|
| El editor debe **rechazar resize** si la etiqueta no cabe, o **expandir** automáticamente. Codex NO usa `text-overflow: ellipsis` en etiquetas del OPD. | ✓ (responsabilidad de implementación) |

---

## 2. Capa Textual (`opl-es`)

### §1.5 — Ser vs Estar

> *"`estar` para estados de objetos (condición temporal, mutable). `ser` para propiedades invariantes (tipo, clasificación, esencia)."*

| Plantilla Codex | Verbo | Cumple |
|---|---|---|
| Estados de un objeto | `puede estar` | ✓ |
| Clasificación esencia/afiliación | `es` | ✓ |
| Instanciación (RF4) | `es una instancia de` | ✓ |

### §1.7 — Convenciones tipográficas

> *"Objeto en **bold**, Proceso en ***bold italic***, Estado en `monospace`."*

| Implementación Codex | Cumple |
|---|---|
| `<OplObj>` → `font-weight: 700`, `font-style: normal` | ✓ |
| `<OplProc>` → `font-weight: 700`, `font-style: italic` | ✓ |
| `<OplState>` → `font-family: JetBrains Mono`, `font-size: 0.86em`, `color: olive` | ✓ |

### §1.9 — Posición del Estado

> *"En OPL-ES el estado sigue al objeto con la preposición 'en': **Objeto** en `estado`."*

| Plantilla Codex | Cumple |
|---|---|
| `requiere Horno en precalentado` | ✓ |
| `consume Empanada en cruda` | ✓ |

### §2 — Vocabulario de verbos

| Verbo canónico | Codex usa | Cumple |
|---|---|---|
| consume | `consume` | ✓ |
| genera (no "produce") | `genera` | ✓ |
| afecta | `afecta` | ✓ |
| cambia ... de ... a | `cambia ... de ... a` | ✓ |
| maneja | `maneja` | ✓ |
| requiere | `requiere` | ✓ |
| consta de (no "consiste en") | `consta de` | ✓ |
| exhibe | `exhibe` | ✓ |

### §18.5 — Política de modelos mixtos

> *"Un modelo con prosa de apoyo en español y OPL canónica en inglés es aceptable como artefacto editorial."*

| Decisión Codex | Cumple |
|---|---|
| Ejemplo precargado: nombres en EN (`System Name`, etc.) + verbos OPL en ES (`consume`, `genera`). Aceptable como artefacto editorial. | ✓ |
| Switcher de lengua OPL: a definir en v1.1 — regeneración completa, no edit parcial. | ⚠ pendiente |

---

## 3. Capa Metodológica (`manual-metodologico-opm-es`)

### §5 — Clasificación del sistema

> *"Beneficiarios externos al sistema → ambiental."*

| Decisión Codex | Cumple |
|---|---|
| Marginalia en oración 05 del editor scene: `△ ALTA · beneficiarios externos al sistema → ambiental (metodología §5)` | ✓ |

### §6 — Asistente Agnóstico de Construcción del SD

> *"El asistente del SD es un protocolo de interacción agnóstico de herramienta. Cualquier implementación válida DEBE guiar al modelador a cerrar las decisiones mínimas del SD."*

| Decisión Codex | Cumple |
|---|---|
| Comando `iniciar asistente SD` (`⌘⇧A`) en el command palette | ✓ |
| Cita SSOT del index izquierdo: "«El SD precede a cualquier refinamiento; debe ser simple y claro, con mínimos detalles técnicos.» — metodología §6" | ✓ |
| Implementación del asistente: a mockear en v1.1 (mismo frame, columna derecha como formulario de etapas) | ⚠ pendiente |

### §7.3 — Refinamiento de Objetos

| Decisión Codex | Cumple |
|---|---|
| Comando `in-zoom` (`⌘⇧I`) permite refinar un objeto en sub-componentes | ✓ |
| Scene 03 (multi-select en SD1) muestra un compound object refinado en 3 sub-atributos | ✓ |

### Profundidad justificada (validación global)

> *"Cada nivel de refinamiento agrega ≥ 1 transformado/estado/enlace nuevo respecto del padre."*

| Decisión Codex | Cumple |
|---|---|
| Marginalia en oración 05 de SD1 (scene 03): `△ ALTA · cada nivel de refinamiento debe agregar al menos un transformado, estado o enlace nuevo respecto del padre.` | ✓ |
| Severidades CRÍTICA/ALTA/MEDIA representadas con kicker mono uppercase + color (crimson/olive/inkSoft) | ✓ |

### Refinamiento no trivial

> *"Descomposición ≥ 2 subprocesos; despliegue ≥ 2 refinadores."*

| Decisión Codex | Cumple |
|---|---|
| El editor debe rechazar (con `△ CRÍTICA`) cualquier OPD hijo con un solo refinador | ✓ (responsabilidad de validador) |

### §10 — Composición por referencia inter-modelo

| Decisión Codex | Cumple |
|---|---|
| Fuera de scope para v1. El frame de Codex soporta sub-modelos a futuro vía un nivel adicional en el árbol del índice. | ⚠ v1.1+ |

### §17 — Proceso activo / Estado actual

| Decisión Codex | Cumple |
|---|---|
| Proceso activo (in-flight): se reserva un canal visual adicional (halo crimson sutil o pin). A mockear en v1.1. | ⚠ pendiente |
| Estado actual (current): en el inspector se marca con flag `actual`. En el OPD, el estado actual se marca con un pin/gota externa anclada al borde (cf. V-133). A mockear en v1.1. | ⚠ pendiente |

---

## 4. Capa Semántica (`opm-es`)

La capa semántica define qué SON las cosas; Codex no la contradice porque trabaja con realizaciones (visual + textual), no con la ontología. Cualquier cambio en la ontología (ej. nuevas clases de cosa) requiere actualización del rendering.

---

## 5. Reglas que Codex NO implementa en v1

Estas reglas existen en el corpus pero quedaron fuera del scope v1. Documentar como deuda explícita:

| Regla | Razón | Plan |
|---|---|---|
| V-132 — Canal visual del proceso activo | No se mockeó | v1.1 — definir halo/pin del proceso in-flight |
| §17.2 — Estado actual | No se mockeó | v1.1 — pin externo en el OPD; flag `actual` ya está en el inspector |
| §10 — Sub-modelos / referencias inter-modelo | Scope grande | v1.1+ — agregar nivel adicional al árbol |
| §6 — Asistente SD interactivo | Solo se entra al asistente; el flow no se mockeó | v1.1 — wizard con etapas, columna derecha como formulario |
| §22 — Simulación | Mencionado en SSOT pero fuera del editor base | v2 — modo separado |

---

## 6. Matriz de cobertura por capa

| Capa | Reglas relevantes a UI | Cumplidas en v1 | Pendientes v1.1+ |
|---|---|---|---|
| Visual (`opd-es`) | V-63, V-129, V-130, V-191, V-202, V-203, V-209, V-210, V-211, V-212 | 10/11 | V-132 (proceso activo) |
| Textual (`opl-es`) | §1.5, §1.7, §1.9, §2, §18.5 | 5/5 | switcher de lengua (no breaking) |
| Metodológica (`manual`) | §5, §6, §7.3, profundidad, no trivial, §10, §17 | 4/7 | asistente, sub-modelos, proceso activo |
| Semántica (`opm-es`) | n/a — no contradice | ✓ | — |

---

## 7. Bibliografía mínima para devs

Lectura recomendada antes de implementar Codex, en orden:

1. `README.md` (este folder)
2. `01-design-spec.md` — lenguaje visual
3. `04-opl-rendering.md` — realización OPL
4. `02-components.md` — inventario de componentes
5. `03-scenes.md` — pantallas
6. `05-interactions.md` — teclado y selección
7. Este documento (`06-ssot-compliance.md`) — auditoría

Y del corpus OPM-ES:

- `opm-visual-es.md` §1.1b (esquema de colores), §1.7 (atributos de contorno), §17 (proceso activo / estado actual), §22 (estilado autoral), §23 (UI no semántica)
- `opm-opl-es.md` §1 (decisiones de diseño), §2 (vocabulario de verbos)
- `manual-metodologico-opm-es.md` §6 (asistente SD), §7-§8 (refinamiento y complejidad)
