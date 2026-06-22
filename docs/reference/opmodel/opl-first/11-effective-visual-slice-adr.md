# ADR-004: Effective Visual Slice as canonical web visual boundary

| Campo | Valor |
|-------|-------|
| Fecha | 2026-04-09 |
| Estado | **Vigente con alcance reducido** — actualizado 2026-04-16 |
| Precede | ADR-003 (Arquitectura categorial para isomorfismo OPL ↔ OPD) |
| Complementado por | ADR-008 (19-jointjs-renderer-adr) |
| Autor | Felix (Ominono) + steipete |

> **Actualizacion 2026-04-16**
>
> ADR-008 (JointJS como renderer adapter) sustituye al renderer SVG manual y absorbe varios de los problemas que motivaron este ADR (OpdCanvas como "mini-engine", layout pipeline opaco). Sin embargo, `EffectiveVisualSlice` **sigue siendo la frontera canonica por OPD** — ahora consumida principalmente por:
>
> 1. `kernelToVisualRenderSpec()` (convierte slice + atlas a spec)
> 2. `visual-render-verifier` (audita sobre la vista efectiva, no sobre semantica total)
>
> Los invariantes I1 (unicidad), I2 (auditoria sobre vista efectiva), I3 (`internal` preservado), I4 (patches composicionales) se mantienen. I5 (relaxation como politica) e I6 (canvas sin logica semantica ad hoc) se cumplen por construccion en JointJS: el layout lo resuelve dagre/elk; la logica semantica vive exclusivamente en `VisualRenderSpec`.
>
> **Superficies afectadas del ADR original** — estado post ADR-008:
>
> | Archivo | Estado |
> |---------|--------|
> | `packages/web/src/lib/projection-view.ts` | Se mantiene. Alimenta el slice que consume el generador de spec |
> | `packages/web/src/lib/spatial-layout.ts` | Deprecated post Fase 4 de plan JointJS. JointJS layout lo reemplaza |
> | `packages/web/src/lib/visual-report.ts` | Se mantiene como auditoria textual/JSON sobre slice |
> | `packages/web/src/lib/visual-lint.ts` | Se mantiene como lint pre-render |
> | `packages/web/src/components/OpdCanvas.tsx` | Deprecated post Fase 4. Reemplazado por `JointDiagramPreview.tsx` |
>
> El texto original se conserva abajo sin cambios.

---

## Texto original (2026-04-09)

## Problema

La web visual de OPModel ya avanzó hacia `projection-view`, pero todavía conserva una frontera inestable entre:

- proyección semántica
- slice patchable por OPD
- layout suggestion
- routing / overlays
- auditoría visual / scoring
- canvas final

El resultado es que distintos consumidores pueden mirar versiones ligeramente distintas del mismo OPD:

- canvas renderiza una vista
- visual report audita otra
- screenshots/captures usan otra
- layout parte de otra base efectiva

Eso produce regresiones sistémicas que parecen "de canvas" pero nacen antes:

- ocurrencias equivocadas por OPD
- mezcla entre vista efectiva y universo semántico disponible
- pérdida de metadatos visuales como `internal`
- composición ambigua de múltiples patches por `thing`
- relajación global que destruye topologías deliberadas

## Decisión

Introducir y canonizar un artefacto explícito y único para la capa web visual:

```text
EffectiveVisualSlice(opdId)
```

Ese artefacto será la **única frontera canónica** que consumen:

- `OpdCanvas`
- `visual-report`
- `visual-lint`
- tooling de screenshot / visual audit
- layout incremental del OPD

## Regla central

Para un `opdId` dado, todos los consumidores visuales deben operar sobre la misma vista efectiva, no sobre reconstrucciones paralelas.

```text
projection -> EffectiveVisualSlice -> layout/routing/overlays -> canvas/report/audit
```

## Tesis operativa

- El canvas debe ser consumidor, no autoridad semántica.
- `internal` es semántica visual fuerte, no detalle decorativo.
- layout no debe depender de listas ambiguas de patches interpretadas por accidente.
- relaxation no es fase universal, sino política por estrategia.

## Invariantes

### I1. Unicidad de vista efectiva

Para cada `opdId`, existe una sola definición canónica de:

- things visibles
- links visibles
- fans/forks visibles
- states visibles
- implicit things
- roles visuales (`isContainer`, `isRefined`, `hasSuppressedStates`, `internal`)

Ningún consumidor visual debe recomputar una semántica alternativa por fuera de esa frontera.

### I2. Auditoría sobre vista efectiva, no sobre semántica total

`visual-report`, scoring, screenshots y fixtures deben auditar contra lo efectivamente renderizable en el OPD, no contra entidades solo semánticamente disponibles por refinamiento o contexto global.

### I3. `internal` preservado o derivado de forma canónica

`internal` no puede perderse durante merge/apply/diff de layout.

Debe quedar explícito, por cada caso, si:

- se deriva desde contexto de refinamiento/proyección, o
- es override explícito persistido por usuario

### I4. Patches son composicionales

Múltiples patches sobre el mismo `thing` no se interpretan con `find(first)` ni heurística implícita.

Debe existir un paso nombrado y determinista de merge.

### I5. Relaxation es política, no obligación

La relajación posterior al layout se decide por estrategia:

- algunas estrategias la requieren
- otras la prohíben o la restringen

`structural-cluster` y los refinamientos no comparten necesariamente la misma política.

### I6. Canvas sin lógica semántica ad hoc

Si el canvas necesita reconstruir semántica para poder renderizar, la frontera está mal.

La lógica semántica o de composición visual debe vivir antes, en `projection-view` o en la fase explícita de slice/layout.

## Forma del pipeline objetivo

```text
Model / SemanticKernel / Atlas
  -> projection-view
  -> EffectiveVisualSlice
  -> mergeLayoutPatches
  -> applyLayoutPatches
  -> normalizeAutoSizing
  -> relaxLayout(strategy policy)
  -> diffPatchedAppearances
  -> route / overlay prep
  -> canvas / report / audit
```

## Consecuencias

### Positivas

- una sola noción de verdad visual por OPD
- menos regressions cruzadas entre canvas, report y scoring
- mejor separación entre semántica visual, geometría y presentación
- fixtures visuales reutilizables como bench arquitectónico
- `OpdCanvas` puede adelgazar y volverse más testeable

### Costos

- refactor medio-alto en `packages/web`
- contratos nuevos entre `projection-view`, `spatial-layout`, `visual-report` y `OpdCanvas`
- migración de tests actuales a la frontera nueva

## Superficies primarias afectadas

- `packages/web/src/lib/projection-view.ts`
- `packages/web/src/lib/spatial-layout.ts`
- `packages/web/src/lib/visual-report.ts`
- `packages/web/src/lib/visual-lint.ts`
- `packages/web/src/components/OpdCanvas.tsx`

## Lo que esta ADR NO decide todavía

- persistencia nativa final de layout más allá de `Appearance` legacy
- reemplazo del renderer SVG actual
- rediseño visual del producto
- cambios al core semántico fuera de seams estrictamente necesarios

## Criterio de cumplimiento

Esta ADR se considera cumplida cuando:

1. existe un artefacto explícito equivalente a `EffectiveVisualSlice`
2. canvas, visual report y tooling de audit consumen la misma vista efectiva
3. el pipeline de layout separa merge/apply/relax/diff
4. `internal` deja de perderse en el flujo visual
5. el canvas reduce lógica semántica local y actúa como consumidor del pipeline

## Resumen corto

El siguiente paso correcto no es seguir parchando el canvas.

El siguiente paso correcto es fijar una frontera canónica de vista efectiva por OPD y reordenar la capa visual alrededor de esa frontera.