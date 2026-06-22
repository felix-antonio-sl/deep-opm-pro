# opl-first — línea activa de trabajo

Esta carpeta contiene **solo documentos vigentes** que gobiernan el rescate
JointJS y la arquitectura OPL-first. Los documentos históricos que
consolidaban decisiones hoy capturadas en ADR-003 / ADR-008 / plan de
ejecución fueron movidos a [`../archive/opl-first-historico/`](../archive/opl-first-historico/).

## Fuente normativa

**La verdadera fuente de verdad de OPM es externa al repo:**

```
kora/KNOWLEDGE/fxsl/opm/opm-ssot-es/
```

4 capas con URN canónicas: `urn:fxsl:kb:opm-es`, `urn:fxsl:kb:opl-es`,
`urn:fxsl:kb:opd-es`, `urn:fxsl:kb:manual-metodologico-opm-es`.

Ante cualquier conflicto de semántica, **gana la SSOT**. Este repo es
implementación subordinada. Aprendizajes que ameritan volver a SSOT se
registran en [`../ssot/candidate-extensions.md`](../ssot/candidate-extensions.md).

Ver [`../ssot/README.md`](../ssot/README.md) para la regla de subordinación.

## Documentos vigentes

### ADRs vinculantes

| ADR | Archivo | Ámbito |
|-----|---------|--------|
| ADR-003 | [`10-isomorphism-architecture.md`](./10-isomorphism-architecture.md) | **Arquitectura categorial del isomorfismo OPL/~ ≅ SemanticKernel ≅ Atlas/~ · 4 leyes verificables** |
| ADR-004 | [`11-effective-visual-slice-adr.md`](./11-effective-visual-slice-adr.md) | Frontera canónica de vista efectiva por OPD |
| ADR-005 | [`14-opm-graph-generator-adr.md`](./14-opm-graph-generator-adr.md) | OPM Graph Generator (wizard OPL a partir de descripción estructurada) |
| ADR-008 | [`19-jointjs-renderer-adr.md`](./19-jointjs-renderer-adr.md) | **JointJS como renderer adapter determinista · supersede ADR-006/ADR-007** |

### Plan vigente (rescate T0-T4)

| # | Archivo | Estado |
|---|---------|--------|
| 20 | [`20-jointjs-execution-plan.md`](./20-jointjs-execution-plan.md) | Plan ejecutivo 4 fases — T2 cerrado, T3 en curso |
| 21 | [`21-ssot-visual-mapping.md`](./21-ssot-visual-mapping.md) | Mapping SSOT-visual × adapter × cobertura fixtures — cierre T2 registrado |
| 13 | [`13-pre-render-refinement-contract.md`](./13-pre-render-refinement-contract.md) | Orden canónico pre-render (agnóstico de backend, aplica a JointJS) |

### Handoff y referencia

| Archivo | Uso |
|---------|-----|
| [`HANDOFF-2026-04-17.md`](./HANDOFF-2026-04-17.md) | Handoff operativo — T2 cerrado, T3 en curso (3.1+3.2 cerrados) |
| [`opl-grammar.md`](./opl-grammar.md) | Gramática canónica de referencia |

## Regla de oro

> OPL como fuente de verdad de autoría.
> Semántica y visual son derivados.
> Ningún flujo edit→render→save es confiable sin las 4 leyes del isomorfismo verdes.

## Línea de trabajo actual

Branch: `feat/jointjs-integration` · rescate **T3 en curso**.

Slices cerrados: **T3.1** (types `KernelPatchOperation`) + **T3.2** (validate+apply
sobre Model via API existente) en commit `082d029`.

Próximo: **T3.3** — `kernel-patch-from-joint.ts` + context menu JointJS que
traduce eventos visuales en patches validados contra el kernel.

Ver HANDOFF-2026-04-17 para estado operativo exacto.
