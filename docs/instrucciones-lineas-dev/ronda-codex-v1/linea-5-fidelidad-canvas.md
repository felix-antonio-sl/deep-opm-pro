# L5 — Fidelidad JointJS (attrs visuales del canvas)

> **Ronda Codex v1 · Ola B (paralela a L2/L3/L4).** Sin dependencia de otras
> líneas (dominio `render/jointjs/**`, disjunto del chrome).
> Lee `README.md` (reglas §2 — **frontera chrome↔canvas**, colisiones §5) y este brief.

---

## 1. Misión

Aplicar al canvas los **atributos visuales** que `ui-forja/08-jointjs-styling.md`
declara y aún no están — **solo apariencia**, dentro de las opciones de JointJS,
sin tocar routing/anchors/proyección semántica (`ui-forja/README §0`):

1. **Index labels** (`08 §1.3`): selector `index` bajo cada shape con `o.01` /
   `p.01` / `s.01` en mono 9.5px 500 inkSoft, `letterSpacing 0.08em`, offset 4px
   debajo del label. **Ausente hoy.**
2. **Highlighter de selección/hover** (`08 §5`): subrayado crimson hairline bajo
   el label (selección 1.2px persistente; hover 1px opacity 0.5), en lugar del
   fill/opacity actual.
3. **Markers de enlace por tipo** (`08 §4.2`): confirmar los 8 tipos (procedimental
   arrow, cambio doble, agregación triángulo fill, exhibición cuadrado outline,
   etc.) y completar los que falten desde `LINK_ASSETS`/`markers.ts`.

Slice mínimo: index labels + highlighter underline. Markers cierra el slice
(auditar los 8, completar faltantes). **Fuera de slice**: marquee de selección
(`08 §7`) y lectura de CSS vars en runtime (`08 §12` opción B) si exceden.

---

## 2. HU base

| HU | Path absoluto | Aporte a esta línea |
|---|---|---|
| EPICA-14 canvas styling | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-14-canvas-styling.md` | Estilo de shapes/links/highlighters del canvas bajo attrs Codex. |
| EPICA-15 enlaces avanzados | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-15-canvas-enlaces-avanzados.md` | Markers por tipo de enlace conservan su semántica visual canónica. |

---

## 3. Anclaje a evidencia (estado actual)

- **SSOT**: `opm-visual-es.md` (V-63 colores canon; V-9/V-40/V-41 markers;
  identificadores `o.NN`/`p.NN`/`s.NN`). La SSOT manda sobre `ui-forja`.
- **Spec**: `ui-forja/08-jointjs-styling.md` (todo), `ui-forja/01-design-spec.md`
  (fuentes/colores).
- **Corpus reusable**: `opm-extracted/src/app/configuration/elementsFunctionality/graphFunctionality.ts`
  (`updateFundamentalLinkFromTriengle`, manejo de markers/handles) y
  `linkDrawing.ts` (`uniteResults`/`uniteConsumptions` — cómo OPCloud dibuja los
  enlaces; conceptual, no clonar Angular). `assets/svg/` para markers canónicos.
- **Estado del código**:
  - `app/src/render/jointjs/constantes.codex.ts` — colores/strokes/fuentes Codex
    (ya cubre canon + strokes). Punto de extensión para el selector `index`.
  - `app/src/render/jointjs/composers/entidad.ts:74-105` — markup de objeto/proceso;
    **falta el selector `index`** bajo el label.
  - `app/src/render/jointjs/composers/markers.ts` + `linkAssets.ts` — markers por
    tipo desde assets (auditar cobertura de los 8).
  - `app/src/render/jointjs/composers/halos.ts` — highlighters (hoy fill/opacity;
    falta underline crimson canónico).

---

## 4. Archivos permitidos

```text
app/src/render/jointjs/composers/entidad.ts      EDIT (selector index)
app/src/render/jointjs/composers/markers.ts      EDIT (cobertura 8 tipos)
app/src/render/jointjs/composers/halos.ts        EDIT (highlighter underline)
app/src/render/jointjs/constantes.codex.ts       EDIT (attrs del index/highlighter)
app/src/render/jointjs/linkAssets.ts             EDIT (assets de markers faltantes)
app/src/render/jointjs/composers/*.test.ts       EDIT (asserts de attrs)
app/e2e/14-canvas-fidelity.spec.ts               EDIT opcional si cambia assert visual
app/e2e/09-tokens-visual.spec.ts                 EDIT opcional si cambia assert visual
LECTURA: SSOT opm-visual-es.md, ui-forja/08, assets/svg/
```

---

## 5. Restricciones de no-colisión

- **FRONTERA DURA**: solo **attrs/estilo**. **NO** tocar `proyeccion.ts`,
  `proyeccionTipos.ts`, `opcloudRouting.ts`, `agregacionBus.ts`,
  `sortStructuralLinks.ts`, `autoinvocacionLoop.ts`, anchors, multiplicidad ni
  vértices. Si crees necesitar cambiar dónde/cómo se conecta un enlace, **cruzaste
  a routing → detente y reporta**.
- **NO** tocar el chrome (es de L1-L4): nada en `ui/`.
- Index labels y highlighters son **visualización** (V-202): no alteran el modelo
  ni la proyección semántica, solo agregan selectores de texto/decoración.
- Colores estrictamente canon V-63; crimson solo en highlighter UI (V-203).

---

## 6. Slice mínimo shippeable

1. **Index labels** (`08 §1.3`): agregar selector `{ tagName: 'text', selector:
   'index' }` al markup de `entidad.ts` (y estados si aplica), poblado con el
   identificador `o.NN`/`p.NN`/`s.NN` que el modelo ya asigna (lectura). Attrs en
   `constantes.codex.ts`: mono 9.5px 500 inkSoft, `letterSpacing 0.08em`, refX/refY
   4px bajo el label.
2. **Highlighter underline** (`08 §5`): en `halos.ts`, subrayado crimson hairline
   bajo el label — selección 1.2px persistente, hover 1px opacity 0.5 — en lugar
   de fill/opacity.
3. **Markers** (`08 §4.2`): auditar los 8 tipos en `markers.ts`/`linkAssets.ts`,
   completar faltantes desde `assets/svg/` (no inventar marcadores nuevos).

---

## 7. Tests obligatorios

- Unit: `entidad.test.ts` (presencia del selector `index` + attrs), `markers.test.ts`
  (8 tipos resueltos), `halos.test.ts` (underline attrs). ~10 expect nuevos.
- E2E: `e2e/14-canvas-fidelity.spec.ts` y `e2e/09-tokens-visual.spec.ts` verdes.

---

## 8. Verificación

```bash
cd app
bun run check
bun run lint
bunx playwright test e2e/14-canvas-fidelity.spec.ts e2e/09-tokens-visual.spec.ts
```

---

## 9. Decisiones bloqueadas (no reabrir)

- Colores canon V-63 (verde/azul/oliva/tinta); crimson solo highlighter UI (V-203).
- Markers desde `assets/svg/` existentes; no crear marcadores de novo (regla de
  oro 2 del proyecto).
- Routing/anchors/proyección **intactos**: esta línea es solo apariencia.

---

## 10. Decisiones que tomas vos (documentar en commit)

- Si el index label vive como selector del shape o como sub-label (lo que mejor
  respete el sizing sin truncar el label primario, `08 §1.2`).
- Implementación del underline (highlighter JointJS vs attr de un selector
  dedicado).
- Si se aborda `08 §12` (CSS vars en runtime) o se deja como deuda menor.

---

## 11. Forma del entregable

- Rama `linea-5-codex-canvas-wip` (worktree propio).
- Commits `style(render)` para attrs visuales. Co-author footer del operador.
- **No tocar**: `proyeccion*.ts`, `opcloudRouting.ts`, anchors, multiplicidad,
  vértices, chrome (`ui/`), `HANDOFF.md`.
- testIds y roles ARIA inmutables.
