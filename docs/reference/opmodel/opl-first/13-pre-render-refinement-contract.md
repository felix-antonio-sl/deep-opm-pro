# 13 — Pre-render refinement contract

| Estado | **Vigente** — aplica a renderer JointJS (ADR-008) |
|--------|--------|

> Este contrato pre-render es **agnostico del backend visual** y sigue siendo la secuencia obligatoria para cualquier OPD refinado, incluyendo el renderer JointJS introducido por ADR-008. La construccion de slice y la resolucion de ocurrencias preceden a `VisualRenderSpec`, que es consumido por JointJS sin reinterpretacion semantica.

## Intent

Freeze the order of operations before any web rendering for refined OPDs, especially process in-zoom, so visual fixes stop fighting semantic leaks.

## Canonical order

1. Parse/compile OPL into `SemanticKernel`
2. Build `OpdAtlas` slices from refinement rules
3. Resolve occurrences from atlas roles (`context`, `internal`, `duplicate`)
4. Resolve visible links for the OPD from the slice contract
5. Build projection/effective visual slice
6. Apply layout policy
7. Render canvas/report/audit from the same effective slice

## In-zoom slice contract

For a child OPD created by process in-zoom:

- Always include the refined parent thing as context
- Include subprocesses defined by refinement steps
- Include internal objects defined inside the refinement
- Include externals only by pullback from the refined thing in the parent OPD (`R-IE-3`), not by expanding from arbitrary subprocess neighbors
- Procedural links to the refined thing are not shown directly in the child OPD; they are distributed or filtered per `R-LV-2` / `R-LD-*`
- Visual duplication must stay minimal (`R-VI-1`)

## Practical consequence for HODOM

`SD1` must not absorb external processes or broad platform/support context just because internal subprocesses touch them. If an external thing is not a direct neighbor of the refined process in the parent OPD, it does not belong in the child pullback slice.

## Current code anchors

- Slice construction: `packages/core/src/semantic-kernel.ts`
- Link resolution: `packages/core/src/simulation.ts`
- Effective visual slice: `packages/web/src/lib/projection-view.ts`
- Layout policy: `packages/web/src/lib/spatial-layout.ts`
- Visual audit/report: `packages/web/src/lib/visual-report.ts`

## Guardrail

When a visual regression appears in a refinement view, debug in this order:

1. slice membership
2. occurrence roles
3. link resolution/distribution
4. layout policy
5. canvas rendering

Do not start with canvas tweaks if the slice is semantically wrong.
