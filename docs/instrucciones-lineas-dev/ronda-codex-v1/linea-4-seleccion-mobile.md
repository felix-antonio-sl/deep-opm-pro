# L4 — Selección emergente + chrome de canvas + mobile

> **Ronda Codex v1 · Ola B (paralela a L2/L3/L5).** Lee `CodexFrame`/`CodexCanvasMount`
> de L2 (solo lectura de su API). Lee `README.md` (reglas §2, colisiones §5) y este brief.

---

## 1. Misión

Tres piezas de chrome de la **zona del canvas** que la spec define y la app aún
no tiene:

1. **`CodexSelectionAnnotation`** (`02-components §5`, `README §6.8`): barra
   emergente HTML que aparece sobre el canvas al seleccionar, posicionada con la
   transformación de coordenadas del paper JointJS (`localToPaperRect`). Marca
   `※`/dígito, acciones separadas por `·`, hairline + metaline. **Ausente hoy.**
2. **Header de `CodexCanvasMount`** (`02-components §4`): fila superior del canvas
   con label `SD · OPD raíz` (kicker Codex) + display de zoom. Hoy el wrapper
   monta el paper pero no rinde ese header.
3. **Re-piel ligera de `ModoRevisionMobile`** (`ui-forja` mobile): confirmar
   glifos y subrayado activo Codex; barra de tabs y aviso "Editar en escritorio".

Slice mínimo: `CodexSelectionAnnotation` funcional sobre selección simple +
header del CanvasMount. Mobile cierra el slice (ya está en tokens nuevos → toque
ligero).

---

## 2. HU base

| HU | Path absoluto | Aporte a esta línea |
|---|---|---|
| HU-SHARED-008 selección canvas | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-008-seleccion-canvas.md` | La barra emergente lee la selección existente; no la redefine. |
| EPICA-90 shortcuts | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-90-interaccion-shortcuts.md` | Acciones de la barra reflejan atajos ya registrados. |
| HU-SHARED-003 permisos/read-only | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-003-permisos-readonly.md` | Acciones no permitidas no aparecen/están disabled en la barra. |

---

## 3. Anclaje a evidencia (estado actual)

- **Spec**: `ui-forja/02-components.md §4` (CodexCanvasMount header), `§5`
  (CodexSelectionAnnotation), `ui-forja/03-scenes.md` escena 03 (multi-select),
  `ui-forja/screenshots/03-multi-select.png`.
- **Corpus reusable**: `opm-extracted/src/app/configuration/rappidEnviromentFunctionality/selectionConfiguration.ts`
  (`selectionConfiguration`, 65 líneas — cómo OPCloud configura la selección en
  Rappid; conceptual). `MODULES.md` L21.
- **Estado del código**:
  - `app/src/ui/codex/CodexCanvasMount.tsx` — wrapper + floating layer; **falta el
    header row**.
  - `app/src/ui/App.tsx:181` — `onAdapterChange={setCanvasAdapter}`: el adaptador
    del canvas (con la transformación de coordenadas) vive en el store; léelo de
    ahí para posicionar la barra. **No edites `App.tsx`.**
  - `app/src/ui/ModoRevisionMobile.tsx:42-168` — 4 tabs, glifos Unicode; ya en
    tokens nuevos.
  - Store de selección: `seleccionId/enlaceSeleccionId/estadoSeleccionId` (solo
    lectura).

---

## 4. Archivos permitidos

```text
app/src/ui/codex/CodexSelectionAnnotation.tsx    NUEVO
app/src/ui/codex/CodexCanvasMount.tsx            EDIT (header row del canvas)
app/src/ui/ModoRevisionMobile.tsx                EDIT (re-piel ligera)
app/src/ui/codex/*.test.ts(x)                    NUEVO/EDIT
app/e2e/22-responsive-review.spec.ts             EDIT opcional si cambia assert visual
app/e2e/08-mvp-alpha-residual.spec.ts            EDIT opcional si cambia assert visual
LECTURA: app/src/ui/codex/CodexFrame.tsx, tokens.ts, glifos.ts, store de selección
```

---

## 5. Restricciones de no-colisión

- **NO** editar `App.tsx` (lo posee la integración del frame). `CodexSelectionAnnotation`
  se monta **vía portal** dentro de la zona del canvas (contenedor
  `data-testid="canvas-pane"` o el floating layer que `CodexCanvasMount` ya
  expone) y se suscribe a la selección del store + al adaptador del canvas. Si
  necesitas un slot que no existe, **detente y coordina** (no fuerces `App.tsx`/
  `CodexFrame.tsx`).
- **NO** tocar `JointCanvas.tsx`, `proyeccion.ts`, `opcloudRouting.ts`, anchors ni
  el render del paper: solo **lees** la transformación de coordenadas
  (`localToPaperRect`) que el adaptador ya expone.
- **NO** tocar el SVG/markers del canvas (eso es L5).
- Importa glifos de `codex/glifos.ts` (`※` `GLIFO_REF`, `·` `GLIFO_SEP`).

---

## 6. Slice mínimo shippeable

1. **`CodexSelectionAnnotation`**: portal sobre el canvas; lee selección del store
   y posición vía `localToPaperRect` del adaptador. Barra: marca `※` + dígito
   (cantidad seleccionada), acciones como palabras `·`, hairline + metaline. Se
   oculta sin selección.
2. **Header de `CodexCanvasMount`** (`§4`): kicker `SD · OPD raíz` (del OPD activo,
   lectura) + display de zoom. Sin tocar el montaje del paper.
3. **Mobile**: confirmar subrayado activo Codex en tabs y glifos; aviso "Editar en
   escritorio o tablet" en tipografía Codex.

---

## 7. Tests obligatorios

- Unit: `CodexSelectionAnnotation.test.tsx` (visible con selección, oculto sin
  ella, render de acciones; ~6 expect).
- E2E: `e2e/22-responsive-review.spec.ts` (mobile) verde; `e2e/08-mvp-alpha-residual.spec.ts`
  verde. testIds `canvas-pane`, `mobile-tab-*` **inmutables**.

---

## 8. Verificación

```bash
cd app
bun run check
bun run lint
bunx playwright test e2e/22-responsive-review.spec.ts e2e/08-mvp-alpha-residual.spec.ts
```

---

## 9. Decisiones bloqueadas (no reabrir)

- La barra emergente es **chrome HTML**, posicionada sobre el canvas; no es un
  shape JointJS (V-202: affordance UI, no gramática OPM).
- No editar `App.tsx`/`CodexFrame.tsx` (montaje vía portal/API existente).
- Mobile mantiene `ModoRevisionMobile`; no se rediseña su arquitectura.

---

## 10. Decisiones que tomas vos (documentar en commit)

- Contenedor exacto del portal (canvas-pane vs floating layer del CanvasMount) —
  el que minimice acoplamiento.
- Acciones que muestra la barra (subset de las del menú contextual de selección).
- Formato del display de zoom (porcentaje, pasos) dentro de `02 §4`.

---

## 11. Forma del entregable

- Rama `linea-4-codex-seleccion-wip` (worktree propio).
- Commits `feat(ui)` para `CodexSelectionAnnotation`/header; `style(ui)` para
  mobile. Co-author footer del operador.
- **No tocar**: render del paper, routing, anchors, `App.tsx`, `CodexFrame.tsx`,
  `tokens.ts`, store, `HANDOFF.md`.
- testIds y roles ARIA inmutables.
