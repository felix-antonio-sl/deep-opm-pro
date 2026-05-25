# L2 — Chrome shell (top-bar + frame + footer)

## Misión
Atacar la **causa raíz** de la auditoría: el chrome de dos capas. Migrar/retirar la toolbar Bauhaus heredada (`ToolbarBase`) al lenguaje Codex y cablear lo que falta en el shell `CodexFrame`. **Dueño único de `App.tsx`.** Línea de mayor blast radius: mergea primera en la Ola 1.

Cierra: **CRÍT-Footer** (leyenda de teclas), **wordmark duplicado**, **botones en cajas**, **header sin breadcrumb/meta**, **tree-header "TOC/OPD tree"→"ÍNDICE/OPDs"**, **footer-right→diagnóstico**. Deja preparado el `App.tsx` para L4 (retira mount de `BarraHerramientasElemento`) y L5 (retira menú lateral `MenuPrincipal`).

## Anclaje a evidencia
- Spec: `ui-forja/01-design-spec.md` (§1 header, wordmark), `02-components.md` (§1 top-bar, §2 col-header, §13 footer-key), `03-scenes.md` (01 header/footer).
- Estado actual (de la auditoría rev2 §05):
  - Wordmark `OPFORJA` en `ui/codex/CodexFrame.tsx:55,100-111` **y** chip en `ui/toolbar/ToolbarBase.tsx:299-305` + `toolbarStyles.ts:46-63` (duplicado).
  - Botones top-bar con `botonBase()` borde 1.5px: `toolbarStyles.ts:437-451`.
  - Header `CodexFrame` solo literal "Codex" (`CodexFrame.tsx:57,117-128`); `ui/Breadcrumb.tsx` existe sin cablear; `app/viewmodels/breadcrumbViewModel.ts` disponible.
  - Tree-header en `App.tsx:230` → `<CodexColHeader kicker="TOC" title="OPD tree">`.
  - `ui/codex/CodexFooterKey.tsx:8-36` reconvertido a label/value; sin leyenda de teclas.
  - Footer-right cableado a marginalia (`App.tsx:227`); diagnóstico en `PanelDiagnostico` (lectura).

## Archivos permitidos
```
app/src/ui/App.tsx                          EDIT (DUEÑO ÚNICO)
app/src/ui/toolbar/ToolbarBase.tsx          EDIT
app/src/ui/toolbar/toolbarStyles.ts         EDIT
app/src/ui/toolbar/toolbar.css              EDIT
app/src/ui/codex/CodexFrame.tsx             EDIT
app/src/ui/codex/CodexColHeader.tsx         EDIT
app/src/ui/codex/CodexFooterKey.tsx         EDIT
app/src/ui/Breadcrumb.tsx                   EDIT (cablear al header)
app/src/app/viewmodels/breadcrumbViewModel.ts   LECTURA
ui-forja/01-design-spec.md, 02-components.md, 03-scenes.md   LECTURA
```

## Restricciones de no-colisión
- **Eres el único que edita `App.tsx`.** En tu paso por App.tsx, además de tu trabajo:
  - **Para L4**: retira el montaje de `BarraHerramientasElemento` del overlay del canvas (deja solo `CodexSelectionAnnotation`; L4 la hará funcional). Documenta el cambio.
  - **Para L5**: retira el menú lateral `MenuPrincipal` como superficie paralela; el botón `☰` debe disparar el command palette (L5 ajusta el handler). Documenta.
- No tocar Inspector*, render/jointjs, tokens.ts, opl/.

## Slice mínimo shippeable
1. **Wordmark único**: dejar un solo "Opforja" en Inria Serif italic ~22px sin chip (en `CodexFrame`); eliminar el chip de `ToolbarBase`.
2. **Botones sin caja**: `Objeto/Proceso/Conectar/Buscar` como palabras + glifo de clase, sin `border` (ajustar `botonBase`/`toolbarStyles`).
3. **Header breadcrumb + meta**: cablear `Breadcrumb` (vía `breadcrumbViewModel`) + meta (`N oraciones · sin guardar · ⌘K`) en `CodexFrame` header; reemplazar el literal "Codex".
4. **Tree-header**: `kicker="ÍNDICE" title="OPDs"` en `App.tsx:230`.
5. **Footer-key**: restaurar leyenda de teclas `O objeto · P proceso · S estado · R relación · ⌘K comandos` con kbd; cablear footer-right al estado de diagnóstico (`✓ ningún diagnóstico` / `△ N críticas`).
6. **Preparar App.tsx** para L4/L5 (mounts retirados según no-colisión).

## Tests obligatorios
- Ajustar/crear unit de `CodexFooterKey`, `CodexColHeader`, `Breadcrumb` cableado.
- Smoke: `e2e/` specs que tocan toolbar/menú (revisar `01`, `02`); que sigan verdes tras retirar duplicados.

## Verificación
```bash
cd app && bun run check && bun run lint && bun run build
```

## Decisiones bloqueadas (no reabrir)
- `App.tsx` lo editas solo vos en esta ronda.
- Conservar las 3 adiciones aprobadas: callout «Aparece en N OPDs», marca CODEX top-right, triángulo △ en árbol.

## Decisiones que tomas vos (documentar en commit)
- Si migrar `ToolbarBase` in-situ o reemplazarla por un top-bar nativo Codex (lo que minimice regresión de testids existentes).
- Formato exacto del breadcrumb/meta dentro del presupuesto de 60px de header.

## Forma del entregable
- Commits `feat(ui): L2 chrome Codex — wordmark único + botones sin caja`, `feat(ui): header breadcrumb+meta`, `feat(ui): footer-key leyenda + diagnóstico`, `chore(ui): App.tsx prepara mounts para L4/L5`.
- Co-author footer. Preservar testids salvo los explícitamente duplicados.
