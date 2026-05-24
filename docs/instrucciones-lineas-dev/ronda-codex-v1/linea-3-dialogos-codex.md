# L3 — Diálogos Codex (Dialogo.tsx base + 15 modales)

> **Ronda Codex v1 · Ola B (paralela a L2/L4/L5).** Depende del merge de **L1**
> (helpers OPL, soft, para diálogos que muestran nombres OPM).
> Lee `README.md` (reglas §2, colisiones §5, orden §6) y este brief. Hereda el
> alcance de diálogos del brief histórico `ronda-codex/linea-5-scope.md §6.2`.

---

## 1. Misión

Re-pielar a lenguaje Codex el **diálogo base** y los **15 modales** existentes —
re-piel pura, cero pérdida de funcionalidad, cero lógica nueva. La spec relevante
es `ui-forja/02-components.md` (apéndice de patrones prohibidos: nada de botones
cromados, pills, switches, radius) y el lenguaje de `01-design-spec.md`.

Re-pelar `Dialogo.tsx` base **primero** propaga a los 15: backdrop token Codex
(no negro puro `rgba(10,10,10,.30)` actual), borde `ruleStrong`, **sin radius**,
título Inria Serif, acciones como **palabras separadas por `·`** (no botones
cromados). Luego revisar caso por caso los densos.

Slice mínimo: base + simples (Confirmación, GuardarComo, CargarModelo). **Fuera
de slice si excede**: los densos (Configuración, Plantillas, ImportarExportar,
Versiones, BuscarGlobal) se cierran en orden, pero la base debe quedar aplicada
a todos.

---

## 2. HU base

| HU | Path absoluto | Aporte a esta línea |
|---|---|---|
| HU-SHARED-004 renombrar | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-004-renombrar.md` | Diálogos de renombrar conservan comportamiento; solo cambia piel. |
| HU-SHARED-005 eliminar con scope | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-005-eliminar-con-scope.md` | Diálogos de eliminación conservan opciones de alcance y cancelación. |
| HU-SHARED-003 permisos/read-only | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-003-permisos-readonly.md` | La re-piel no puede ocultar estados disabled ni acciones no permitidas. |

---

## 3. Anclaje a evidencia (estado actual)

- **Spec**: `ui-forja/02-components.md` (patrones de overlay y apéndice de
  prohibidos), `ui-forja/01-design-spec.md §3-§6` (tokens, hairlines).
- **Corpus reusable**: `opm-extracted/src/app/configuration/rappidEnviromentFunctionality/shared.ts`
  (`ConfirmDialogDialogComponent`, `EnterValueDialogComponent` — patrón de
  confirmación/entrada de valor; conceptual, OPCloud usa Angular MatDialog, NO
  clonar). Ya citado en `app/src/ui/Dialogo.tsx:18-22`.
- **Estado del código**:
  - `app/src/ui/Dialogo.tsx:183-202` — base común: backdrop `rgba(10,10,10,0.30)`
    (Bauhaus, **a reemplazar**), `borderRadius:0` (OK), portal + foco + Esc.
  - 12 `Dialogo*.tsx`: `BuscarCosas, BuscarGlobal, CargarModelo, Configuracion,
    Confirmacion, EstiloEnlace, GuardarComo, ImportarExportarJson, MoverPuerto,
    Plantillas, TraerConectados, Versiones`.
  - 3 `Modal*.tsx`: `DuracionEstado, ImagenObjeto, UrlsObjeto`.

---

## 4. Archivos permitidos

```text
app/src/ui/Dialogo.tsx                           EDIT (base común — primero)
app/src/ui/Dialogo*.tsx                          EDIT (12 listados en §3)
app/src/ui/Modal*.tsx                            EDIT (3 listados en §3)
app/e2e/11-dialogo-layout-regression.spec.ts     EDIT opcional si cambia assert visual
app/e2e/01-carga-y-workspace.spec.ts             EDIT opcional si cambia assert visual
LECTURA: app/src/ui/codex/oplTipografia.tsx (L1), tokens.ts, glifos.ts
```

---

## 5. Restricciones de no-colisión

- **NO** tocar la lógica que los diálogos invocan (persistencia, serialización,
  acciones de store): solo su presentación.
- **NO** tocar `Inspector*` (L2) ni `PanelOpl*` (L1).
- Si un diálogo muestra nombres OPM (p. ej. EstiloEnlace, TraerConectados),
  importa `OplObj/OplProc/OplState` de L1 — no redefinas la tipografía.
- Importa glifos de `codex/glifos.ts` (`✕` cerrar, `↵` enter, etc.).

---

## 6. Slice mínimo shippeable

Orden de re-piel (cada paso cierra con `bun run check` verde):

1. **`Dialogo.tsx` base**: backdrop a token Codex (paper translúcido o ink suave
   por token, no negro puro), borde `ruleStrong`, sin radius, título Inria Serif,
   acciones como palabras separadas por `·`.
2. **Simples**: `DialogoConfirmacion`, `DialogoGuardarComo`, `DialogoCargarModelo`.
3. **Densos**: `DialogoConfiguracion`, `DialogoPlantillas`, `DialogoImportarExportarJson`,
   `DialogoVersiones`, `DialogoBuscarGlobal`, `DialogoBuscarCosas` — quitar
   pills/switches/botones cromados, segmented inline donde aplique.
4. **Modales de entidad**: `ModalDuracionEstado`, `ModalImagenObjeto`,
   `ModalUrlsObjeto`.
5. **Especializados**: `DialogoEstiloEnlace`, `DialogoMoverPuerto`,
   `DialogoTraerConectados`.

---

## 7. Tests obligatorios

- E2E: `e2e/11-dialogo-layout-regression.spec.ts` verde (regresión de layout tras
  re-piel del base). `e2e/01-carga-y-workspace.spec.ts` (carga/guardado) verde.
- Unit: ajustar cualquier test de diálogo que asserte estilo Bauhaus concreto.

---

## 8. Verificación

```bash
cd app
bun run check
bun run lint
bunx playwright test e2e/11-dialogo-layout-regression.spec.ts e2e/01-carga-y-workspace.spec.ts
```

---

## 9. Decisiones bloqueadas (no reabrir)

- Preservar TODOS los diálogos (no se eliminan).
- Acciones como **palabras separadas por `·`**, no botones cromados (patrón
  prohibido en `02`).
- Sin radius, sin shadows (hairlines, filosofía Codex).

---

## 10. Decisiones que tomas vos (documentar en commit)

- Valor exacto del backdrop Codex (paper translúcido vs ink suave) dentro del
  lenguaje de `01 §3`.
- Cómo se mapean los controles densos (selects/checkboxes) a segmented inline o
  listas tipográficas sin perder función.
- Orden real de cierre de los densos si no caben todos en el slice.

---

## 11. Forma del entregable

- Rama `linea-3-codex-dialogos-wip` (worktree propio).
- Commits `style(ui)` para re-piel pura. Co-author footer del operador.
- **No tocar**: persistencia, serialización, store, inspector, panelOpl,
  `tokens.ts`, `HANDOFF.md`. Bugs ajenos → patch a `/tmp`, fuera del WIP.
- testIds y roles ARIA inmutables.
