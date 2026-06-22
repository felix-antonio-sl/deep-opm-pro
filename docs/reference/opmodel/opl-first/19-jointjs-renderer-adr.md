# ADR-008: JointJS as deterministic renderer adapter

| Campo | Valor |
|-------|-------|
| Fecha | 2026-04-16 |
| Estado | **Vinculante** |
| Precede | ADR-003 (10-isomorphism-architecture), ADR-004 (11-effective-visual-slice), ADR-005 (14-opm-graph-generator) |
| Supersede | ADR-006 (16-llm-mediated-renderer), ADR-007 (17-llm-mediated-modeling-orchestrator), 12-web-visual-refactor-plan (parcial), 18-minimal-extraction-plan (parcial) |
| Autor | Felix (Ominono) |

## Problema

La capa visual de `opmodel` nunca cerró producto. Las causas documentadas en handoffs y ADRs anteriores:

- `OpdCanvas.tsx` es "mini-engine entero" con lógica semántica embebida (ADR-004)
- `spatial-layout.ts` concentra merge/apply/relax/diff en un chokepoint opaco (12-web-visual-refactor-plan)
- cada intento de refactor se volvió otro ADR (005, 006, 007, 018) antes de cerrar un slice visible
- la línea `LLM-mediated renderer` (ADR-006) introdujo dependencia externa no determinista para un problema que es de composición, no de estilo
- la línea `LLM-mediated modeling orchestrator` (ADR-007) movió la frustración a un nuevo servicio Python en vez de atacar la surface

El motor semántico es maduro (1096 tests verdes, isomorfismo OPL↔Kernel con 4 leyes verificables). La deuda vive exclusivamente desde `VisualRenderSpec` hacia el pixel.

## Decisión

Sustituir el renderer SVG manual y todos los esfuerzos de LLM-mediated rendering por **JointJS (clientio/joint) como adapter determinista de presentación** que consume `VisualRenderSpec` y emite un `joint.dia.Graph` sincronizado con el kernel vía operaciones.

```text
SemanticKernel
  -> kernelToVisualRenderSpec()          [ya existe, core]
  -> VisualRenderSpec                    [ya existe, core]
  -> visualRenderSpecToJointGraph()      [NUEVO, web adapter]
  -> joint.dia.Graph                     [JointJS runtime]
  -> joint.dia.Paper                     [canvas web]
  -> eventos (drag, click, edit)
      -> onLayoutChange   -> LayoutModel (𝓛)        [regenera]
      -> onSemanticChange -> KernelPatch (operaciones) [valida -> aplica -> re-render]
```

## Regla central

JointJS **no** es SSOT.

JointJS es un funtor de presentación. El grafo visual es una fibra computada sobre el kernel, no una alternativa a él.

```text
F_visual : 𝒮 × 𝓛 -> JointGraph        (kernel + layout -> grafo visual)
F_layout : JointGraph -> 𝓛            (evento de drag -> layout nuevo)
F_patch  : JointGraphEdit -> KernelPatch -> 𝒮  (evento semántico -> operación validada)
```

La Ley 4 del ADR-003 (ortogonalidad layout/semántica) **se preserva**: eventos de drag escriben en `𝓛`, no en `𝒮`. Eventos que pretenden crear/borrar entidades pasan por el kernel primero y JointJS re-renderiza desde el spec actualizado.

## Beneficiario

Felix como operador único que necesita, para un sistema OPM dado:

1. escribir OPL o recorrer wizard
2. ver el diagrama renderizado con calidad institucional
3. mover cajas sin romper la semántica
4. ajustar el modelo (agregar/borrar/renombrar) con feedback visual inmediato
5. exportar SVG/PNG listos para documentar

Sin pasar por LLM, sin orquestador externo, sin Python.

## Tesis operativa

No construir "draw.io para OPM". No construir "IA que dibuja OPM". Construir:

```text
compilador determinista de OPM a JointJS
```

JointJS ya resuelve bien: shapes con children/ports, links con routing, layout via `dagre`/`elkjs`, pan/zoom, selección, snap, undo/redo, export SVG. Todo eso es exactamente lo que `OpdCanvas.tsx` reimplementaba mal.

## Invariantes

### I1. SemanticKernel sigue siendo SSOT

Ningún evento JointJS puede mutar `things`, `links`, `states`, `modifiers`, `fans` o `refinements` del kernel directamente. Debe pasar por:

```text
JointJS event -> KernelPatchOperation -> validateAgainstSSOT -> applyToKernel -> re-derive spec -> re-render
```

### I2. VisualRenderSpec es la única frontera kernel→visual

```text
packages/core/src/generator/visual-render-spec.ts
packages/core/src/generator/kernel-to-visual-render-spec.ts
```

No se agregan caminos alternativos kernel→JointJS que eludan el spec. Si algo no está en `VisualRenderSpec`, no se renderiza.

### I3. Layout vive en 𝓛, no en JointGraph

El `joint.dia.Graph` contiene coordenadas como cache de render, no como fuente. Al persistir el modelo, las coordenadas se serializan a `LayoutModel` del ADR-003, no al `.opmodel` semántico.

### I4. Eventos visuales no destructivos

Arrastrar una caja, redimensionar, cambiar routing: no modifica el kernel. Solo escribe layout.

### I5. Eventos visuales semánticos pasan por validación SSOT

Crear/borrar/renombrar/reconectar: emite un `KernelPatchOperation`, pasa por `validateOpl()` o equivalente, y solo entonces se aplica. Si la validación falla, la UI muestra el error y el grafo visual se revierte al estado del kernel.

### I6. El renderer determinista reemplaza al LLM renderer

`packages/web/src/lib/renderers/llm-renderer/` queda deprecado. No se elimina inmediatamente para permitir comparaciones visuales, pero no recibe features nuevas.

### I7. Verificación post-render obligatoria

El `visual-render-verifier.ts` existente (core) sigue aplicándose: toda salida JointJS debe pasar:

- nodos requeridos del spec están presentes en el grafo
- edges requeridos del spec están presentes
- opmKind (object/process) preservado en shape
- lanes/groups respetados en jerarquía JointJS
- ausencia de nodos sin correspondencia en spec

### I8. Sin LLM en el pipeline de render

El pipeline render es **100% determinista**. Ningún LLM participa en producir el diagrama. La calidad visual depende de:

- `kernelToVisualRenderSpec()` (reglas OPM duras)
- `visualRenderSpecToJointGraph()` (mapping determinista spec→shapes)
- JointJS routing + layout algorithms (dagre, elk)
- Style packs JointJS versionados

## Lo que NO decide esta ADR

- edición colaborativa multiusuario
- persistencia de layout más allá de `LayoutModel` actual
- animaciones avanzadas o simulación visual en tiempo real
- minimap o navegación de modelos muy grandes (>200 entidades)
- reverse compilation SVG/JointGraph → OPL

## Componentes

### Nuevos (a crear)

```text
packages/web/src/lib/renderers/jointjs/
  visual-render-spec-to-joint-graph.ts
  joint-shapes/
    object-shape.ts
    process-shape.ts
    state-shape.ts
    system-boundary.ts
    fan-shape.ts
    modifier-marker.ts
  joint-links/
    procedural-link.ts
    structural-link.ts
    refinement-link.ts
  layout/
    opm-dagre-layout.ts
    opm-hierarchy-layout.ts
  style-packs/
    dori-classic.ts
    iso-19450.ts
    print-ready.ts
  joint-event-handlers.ts
  joint-to-kernel-patch.ts
  joint-paper-setup.ts
```

### Existentes (reutilizar sin cambios)

- `packages/core/src/generator/visual-render-spec.ts`
- `packages/core/src/generator/kernel-to-visual-render-spec.ts`
- `packages/core/src/generator/visual-render-verifier.ts`
- `packages/core/src/opl-validate.ts`
- `packages/core/src/semantic-kernel.ts`

### Existentes (depreciar)

- `packages/web/src/lib/renderers/llm-renderer/**` — no eliminar aún, marcar deprecated
- `packages/web/src/lib/svg/render-visual-render-spec.ts` — mantener como fallback determinista SSR/CI
- `packages/web/src/lib/svg/render-diagram-spec.ts` — idem
- `packages/web/src/components/OpdCanvas.tsx` — coexiste temporalmente, se retira al cerrar fase 4

## Por qué JointJS y no alternativas

| Candidato | Pro | Contra | Veredicto |
|-----------|-----|--------|-----------|
| JointJS | Maduro (10+ años), shapes extensibles, ports, routing multiple, layout dagre/elk, SVG nativo, MPL2 licencia core | Curva aprendizaje, bundle medio (~200KB) | **Elegido** |
| Cytoscape.js | Potente para grafos grandes | Estilo de nodo menos controlable, no orientado a shapes con children | Descartado |
| ReactFlow | React-nativo, fácil | Opinado sobre shape shape, routing limitado, no OPM-friendly para fans | Descartado |
| D3 + manual | Control total | Reimplementar todo lo que JointJS ya da | Ya lo intentamos, es `OpdCanvas` |
| SVG manual | Determinista, liviano | Sin interactividad robusta | Se mantiene como fallback CI |
| Sprotty / Eclipse GLSP | Robusto | Java backend pesado, overkill | Descartado |

## Integración con ADRs previas

### ADR-003 (10-isomorphism-architecture, VINCULANTE)
Preservado íntegro. JointJS vive como proyección desde el atlas, después del colímite. Las 4 leyes del isomorfismo no se tocan. La Ley 4 (ortogonalidad layout/semántica) se refuerza con I3 e I4 de este ADR.

### ADR-004 (11-effective-visual-slice)
`EffectiveVisualSlice` sigue siendo la frontera canónica de vista efectiva por OPD. JointJS consume el slice vía `VisualRenderSpec`, no accede directamente a kernel/atlas.

### ADR-005 (14-opm-graph-generator)
El `DiagramPreview.tsx` del generator pasa a renderizar con JointJS. El pipeline `SdDraft → Kernel → VisualRenderSpec → JointGraph` reemplaza `SdDraft → Kernel → DiagramSpec → SVG`.

### ADR-006 (16-llm-mediated-renderer) — SUPERSEDED
La idea de separar `VisualRenderSpec` del renderer se conserva y es justamente la interfaz que habilita JointJS. La introducción de LLM en el pipeline se descarta. Razón: el problema era de composición determinista, no de estética generativa. El renderer determinista + JointJS layout + style packs cubre el gap sin dependencia externa.

### ADR-007 (17-llm-mediated-modeling-orchestrator) — SUPERSEDED
Se descarta la introducción de un servicio Python con LangGraph/Deep Agents para orquestar modelado. Razón: agregar capa agéntica sobre una superficie que aún no está pulida amplifica el problema en vez de resolverlo. La orquestación LLM, si se justifica a futuro, será decisión posterior al cierre de producción estable de la surface JointJS.

### 12-web-visual-refactor-plan — SUPERSEDED PARCIAL
Fase 1 (canonizar `EffectiveVisualSlice`) se preserva. Fases 2-3 (partir layout pipeline, adelgazar OpdCanvas) se reemplazan por la integración JointJS.

### 18-minimal-extraction-plan — SUPERSEDED PARCIAL
Se mantiene "keep core + generator + web surface". Se elimina "add orchestration service Python/LangGraph/Deep Agents".

## Criterio de cumplimiento

Esta ADR se considera cumplida cuando, para las 7 fixtures reales (`coffee-making`, `driver-rescuing`, `hospitalizacion-domiciliaria`, `hodom-v2`, `hodom-hsc-v0`, `hodom-hsc`, `ev-ams`):

1. `VisualRenderSpec → joint.dia.Graph` produce diagrama visible con todos los nodos/edges del spec
2. `visual-render-verifier` pasa contra el grafo resultante
3. drag de una caja altera solo `LayoutModel`, no el kernel
4. agregar un thing desde menú contextual pasa por validación SSOT y aparece tanto en OPL como en visual
5. export SVG/PNG desde JointJS es visualmente equivalente o superior al renderer SVG manual actual
6. `bun run test` sigue verde
7. `OpdCanvas.tsx` pierde su rol de surface primaria

## Riesgos

### R1. JointJS empuja modelado hacia lo que sabe representar
Mitigación: `VisualRenderSpec` es el único contrato. Si un constructo OPM no mapea limpio a shape JointJS, se diseña un shape custom antes de relajar la semántica.

### R2. Bundle size web crece
Mitigación: JointJS core MPL2 (~200KB). Se tolera. Tree-shaking donde aplique.

### R3. Perdida de estilo visual propio
Mitigación: style packs JointJS versionados (`dori-classic`, `iso-19450`, `print-ready`) dan control fino de shapes y colores.

### R4. Eventos JointJS de bajo nivel se filtran sin traducción a patch
Mitigación: registro central `joint-event-handlers.ts` con whitelist explícita de eventos que pueden mutar estado. El resto se ignora.

### R5. Drift entre JointGraph y kernel
Mitigación: fuente única de render es `kernel -> spec -> joint`. Se descarta y reconstruye `JointGraph` en cada cambio semántico. No hay "sync" bidireccional perezoso.

### R6. Refactor infinito (riesgo histórico)
Mitigación: plan de ejecución con 4 fases acotadas (ver `20-jointjs-execution-plan.md`). No se abre ADR-009 hasta cerrar las 4 fases.

## Frase de producto

> `opmodel` ya no construye un canvas propio.
>
> Compila un sistema OPM semánticamente canónico a un `VisualRenderSpec`, y usa JointJS como runtime de presentación subordinado al kernel. El isomorfismo textual-gráfico es determinista, verificable y no requiere inteligencia externa.
