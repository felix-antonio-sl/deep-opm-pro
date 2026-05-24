# L1 — OPL canónico (helpers tipográficos + CodexOPLNote + marginalia)

> **Ronda Codex v1 · Ola A (contrato — mergea primero).** Sin dependencias de
> otras líneas; L2 y L3 dependen de los helpers que esta línea exporta.
> Lee `README.md` (reglas §2, colisiones §5, orden §6) y este brief.

---

## 1. Misión

Dar forma canónica al **renderizado OPL** según `ui-forja/04-opl-rendering.md` y
`ui-forja/02-components.md §6-§7`. Tres entregables:

1. **Helpers tipográficos `OplObj` / `OplProc` / `OplState`** (`02 §7`): extraer
   la tipografía OPL hoy **acoplada** dentro de `RenderToken.tsx` a componentes
   inline reutilizables y exportados, para que L2 (inspector) y L3 (diálogos)
   los consuman al mostrar nombres OPM. Objeto = serif bold + subrayado sólido;
   Proceso = serif bold italic + subrayado punteado; Estado = mono oliva sobre
   fill suave.
2. **`CodexOPLNote`** (`02 §6`, `04 §1`): oración OPL numerada con estructura
   formal (número + cuerpo + slots de marginalia), reemplazando el render plano
   actual del panel OPL.
3. **Marginalia de validación** (`04 §6`): nota al pie bajo la oración con
   `△ SEVERIDAD` (kicker JetBrains Mono 9px tracking `0.12em`) + texto italic
   serif 11px, indent 38px. Hoy **ausente**.

Slice mínimo: helpers exportados + `CodexOPLNote` aplicado al panel OPL con la
numeración/selección ya existentes preservadas. Marginalia de validación cierra
el slice. **Fuera de slice**: meta del filtro en formato canónico (`04 §4`,
"filtrado · o.06 · 4/24 ✕") queda como mejora menor si sobra tiempo.

---

## 2. HU base

| HU | Path absoluto | Aporte a esta línea |
|---|---|---|
| EPICA-50 OPL pane | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | Panel OPL, oraciones, filtrado y sincronización sobreviven bajo `CodexOPLNote`. |
| HU-SHARED-007 Eco OPL | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-007-eco-opl.md` | La regeneración de oraciones al editar nombres no cambia; solo cambia la piel del render. |
| HU-SHARED-009 Validación nominal | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-009-validacion-nominal.md` | Las validaciones se exhiben como marginalia, no como toasts intrusivos. |

---

## 3. Anclaje a evidencia (estado actual)

- **SSOT**: `opm-opl-es.md §1.7` (tipografía OPL: objeto bold, proceso bold
  italic, estado), Apéndice A (gramática). Autoridad gramatical: la SSOT manda
  sobre `ui-forja` ante conflicto.
- **Spec**: `ui-forja/04-opl-rendering.md` (todo), `ui-forja/02-components.md §6`
  (CodexOPLNote), `§7` (OplObj/OplProc/OplState), `ui-forja/07-glyphs.md` (`△`).
- **Corpus reusable**: `opm-extracted/src/app/dialogs/opl-dialog/opl-dialog.component.ts`
  (604 líneas — cómo OPCloud estructura la tabla OPL, conceptual; no clonar
  Angular). `opm-extracted/MODULES.md` línea 90.
- **Estado del código**:
  - `app/src/ui/panelOpl/RenderToken.tsx:127-186` — tipografía OPL acoplada
    (`objeto/proceso/estado` → `<strong>/<em>/<code>` + estilos inline). **Es la
    fuente a extraer** a helpers.
  - `app/src/ui/panelOpl/LineaOpl.tsx` — línea OPL con numeración ordinal y
    `style.lineaSeleccionada` (borde crimson). Preservar selección/numeración.
  - `app/src/ui/panelOpl/Bloques.tsx`, `app/src/ui/PanelOpl.tsx` — composición.

---

## 4. Archivos permitidos

```text
app/src/ui/codex/oplTipografia.tsx              NUEVO  (OplObj/OplProc/OplState)
app/src/ui/codex/CodexOplNote.tsx               NUEVO  (CodexOPLNote)
app/src/ui/panelOpl/RenderToken.tsx             EDIT   (consumir helpers)
app/src/ui/panelOpl/LineaOpl.tsx                EDIT   (envolver en CodexOPLNote)
app/src/ui/panelOpl/Bloques.tsx                 EDIT
app/src/ui/PanelOpl.tsx                          EDIT
app/src/ui/panelOpl/*.test.ts(x)                EDIT   (ajustar asserts de estilo)
app/e2e/03-opl-panel.spec.ts                     EDIT opcional si cambia assert visual
LECTURA: app/src/ui/tokens.ts, app/src/ui/codex/glifos.ts
```

---

## 5. Restricciones de no-colisión

- **NO** tocar `app/src/opl/generadores/**` ni `app/src/opl/parser/**`: el
  contenido de las oraciones (qué dice el OPL) es lógica; tú solo cambias **cómo
  se ve**. Lee el modelo de tokens que ya produce el panel.
- **NO** tocar `store/**`, `proyeccion.ts` ni ViewModels de datos (`panelOplViewModel`
  solo lectura).
- **NO** redefinir glifos: importa `△` (`GLIFO_WARN`) de `codex/glifos.ts`.
- Exporta los helpers con una API estable (`OplObj/OplProc/OplState` con prop
  `children`); L2/L3 los importan. No cambies su firma tras mergear.

---

## 6. Slice mínimo shippeable

En orden, cada paso cierra con `bun run check` verde:

1. **`oplTipografia.tsx`** — extraer de `RenderToken.tsx:161-186` a helpers:
   ```tsx
   export const OplObj   = ({ children }: { children: ComponentChildren }) => (...)  // serif bold, subrayado sólido, ink
   export const OplProc  = ({ children }: { children: ComponentChildren }) => (...)  // serif bold italic, subrayado punteado
   export const OplState = ({ children }: { children: ComponentChildren }) => (...)  // mono, oliva canon (tokens.colors.opm.state), fill suave
   ```
   `RenderToken.tsx` pasa a consumir estos helpers (no duplicar estilos inline).
2. **`CodexOplNote.tsx`** — estructura: número (mono, crimson cuando la línea
   está seleccionada — `04 §5`) + cuerpo (serif) + slot de marginalia. Migrar
   `LineaOpl.tsx` para envolver cada oración. Preservar numeración ordinal,
   `data-*` y comportamiento de selección/filtrado existentes.
3. **Marginalia de validación** (`04 §6`) — bajo la oración con aviso: `△ SEVERIDAD`
   (kicker mono 9px, tracking `0.12em`) + descripción italic serif 11px, indent
   38px. Conecta con los avisos que el panel ya recibe (lectura).

---

## 7. Tests obligatorios

- Unit: `oplTipografia.test.tsx` (3 helpers renderizan el markup/clase esperada,
  ~6 expect). Ajustar `RenderToken.test.tsx` al nuevo consumo.
- E2E: `app/e2e/03-opl-panel.spec.ts` sigue verde (numeración, selección,
  filtrado). testIds del panel **inmutables**.

---

## 8. Verificación

```bash
cd app
bun run check        # GATE
bun run lint
bunx playwright test e2e/03-opl-panel.spec.ts   # dev server apagado
```

---

## 9. Decisiones bloqueadas (no reabrir)

- Tipografía OPL la fija la SSOT `§1.7` (objeto bold / proceso bold italic /
  estado). `ui-forja` la operacionaliza; ante conflicto manda la SSOT.
- Estado en mono **oliva canon** (`tokens.colors.opm.state` `#7e8338`), no en
  crimson (crimson es canal UI, V-203).
- Validación como **marginalia** (nota al pie), no como toast ni pill (`§10` de
  la filosofía: "las validaciones son notas al pie").

---

## 10. Decisiones que tomas vos (documentar en commit)

- Si los helpers se exponen como componentes o como funciones que devuelven
  `vnode` (elige lo que minimice fricción para L2/L3).
- Densidad exacta de la marginalia (line-height, separación de la oración)
  dentro del rango de `04 §6`.
- Si el color del número ordinal sube a crimson solo en selección o también en
  hover (`04 §5` lo pide en selección; hover es opcional).

---

## 11. Forma del entregable

- Rama `linea-1-codex-opl-wip` (worktree propio).
- Commits `style(ui)` para re-piel pura; `feat(ui)` si `CodexOPLNote` introduce
  estructura nueva. Co-author footer del operador.
- **No tocar**: generadores/parser OPL, store, proyección, ViewModels de datos,
  `tokens.ts`, `HANDOFF.md`.
- testIds y roles ARIA inmutables.
