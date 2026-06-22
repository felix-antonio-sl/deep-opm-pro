# Plan de ejecución — integración JointJS como renderer adapter

| Campo | Valor |
|-------|-------|
| Fecha | 2026-04-16 |
| Estado | **Activo** |
| Base | ADR-008 (19-jointjs-renderer-adr) |
| Reemplaza | Fases 4-5 pendientes de `05-phases.md` |
| Estimación total | 4-6 semanas de trabajo efectivo (single operator) |

## Objetivo ejecutivo

Reemplazar `OpdCanvas` + renderer SVG manual + camino LLM por un renderer JointJS determinista, subordinado al kernel, que cierra el isomorfismo textual-gráfico **sin LLM**.

```text
OPL  ⇄  SemanticKernel  →  VisualRenderSpec  →  joint.dia.Graph  →  Paper
   (lens, 4 leyes)        (existe hoy)         (a construir)       (JointJS)
```

## Precondiciones verificadas

- [x] `compileToKernel()` + `renderFromKernel()` operativos (handoff 2026-04-07)
- [x] `VisualRenderSpec` existe en `packages/core/src/generator/visual-render-spec.ts`
- [x] `kernelToVisualRenderSpec()` existe y produce spec válido
- [x] `visual-render-verifier.ts` existe y verifica specs
- [x] 1096 tests verdes
- [x] 7 fixtures reales cargan y producen spec
- [x] Decisión ADR-008 documentada

## Invariantes durante la ejecución

Todas las fases deben mantener:

1. `bun run test` verde al cerrar cada slice
2. `bun run typecheck:core` verde
3. Las 4 leyes del ADR-003 siguen pasando
4. El verifier post-render pasa para las 7 fixtures
5. `OpdCanvas` sigue operativo hasta que JointJS lo reemplace formalmente (Fase 4)

## Topología

4 fases secuenciales. Cada una con output visible, tests, y criterio de cierre explícito. No abrir la siguiente hasta cerrar la anterior.

---

## Fase 1 — Bootstrap JointJS + render mínimo

### Intención

Instalar JointJS, crear el adapter mínimo `spec → joint.dia.Graph`, renderizar 1 fixture (`coffee-making`) en una pantalla aislada.

### Duración estimada

1 semana.

### Archivos nuevos

```text
packages/web/package.json                          # add @joint/core dependency
packages/web/src/lib/renderers/jointjs/
  index.ts                                          # API pública del módulo
  visual-render-spec-to-joint-graph.ts              # F_visual: spec -> JointGraph
  joint-shapes/
    object-shape.ts                                 # Rectángulo, label centrado
    process-shape.ts                                # Elipse, label centrado
  joint-links/
    procedural-link.ts                              # Flecha con marker estándar
  joint-paper-setup.ts                              # Paper config (grid, zoom, pan)
  types.ts                                          # JointGraphOptions, EventHandlers
packages/web/src/components/JointDiagramPreview.tsx # Wrapper React
packages/web/src/pages/JointSandbox.tsx             # Ruta aislada /joint-sandbox
packages/web/tests/
  jointjs-renderer.test.ts                          # Unit: spec -> graph
  jointjs-coffee-fixture.test.ts                    # E2E mínimo
```

### Comandos

```bash
cd /home/felix/projects/opmodel/packages/web
bun add @joint/core
bun add -D @types/backbone                         # JointJS dep transitiva
```

### Criterio de cierre

- [ ] `@joint/core` instalado, build web pasa
- [ ] Ruta `/joint-sandbox` renderiza `coffee-making` con nodos object/process visibles
- [ ] Layout automático (dagre) colocado sin overlap
- [ ] `visual-render-verifier` pasa contra el grafo resultante
- [ ] `bun run test` verde
- [ ] Commit: `feat(web): bootstrap jointjs renderer with coffee-making fixture`

### Blast radius

**Bajo**. No toca nada del core ni del `OpdCanvas` existente. Ruta separada.

---

## Fase 2 — Shapes OPM completos + style pack base

### Intención

Cubrir todos los constructos OPM que aparecen en las 7 fixtures. Style pack `iso-19450` que respete convenciones visuales del corpus.

### Duración estimada

1.5 semanas.

### Archivos nuevos

```text
packages/web/src/lib/renderers/jointjs/
  joint-shapes/
    state-shape.ts              # Rectángulo redondeado dentro de object
    system-boundary.ts          # Box con dashed border, para SD
    fan-shape.ts                # XOR/OR/AND triangle markers
    modifier-marker.ts          # Event (E) / Condition (C) indicators
    internal-object.ts          # Styling diferenciado para internal
    external-thing.ts           # Styling para environmental affiliation
  joint-links/
    structural-link.ts          # Aggregation, exhibition, generalization, classification
    refinement-link.ts          # SD → SD1 connector
    consumption-link.ts         # Con marker específico
    result-link.ts              # Con marker específico
    effect-link.ts              # Doble flecha
    instrument-link.ts          # Con círculo en punta
    agent-link.ts               # Con triángulo relleno
    invocation-link.ts          # Dashed con flecha
  style-packs/
    iso-19450.ts                # Colores, tamaños, fuentes base
    dori-classic.ts             # Referencia OPCloud (opcional)
    print-ready.ts              # B/N alto contraste (opcional fase 2)
  in-zoom/
    in-zoom-container.ts        # Child rendering para processes refinados
    unfold-container.ts         # Child rendering para objects unfolded
  layout/
    opm-dagre-layout.ts         # Layout automático con opciones OPM
    opm-hierarchy-layout.ts     # Jerárquico para in-zoom
```

### Cambios

- Mapping exhaustivo `opmKind + visualRole` → shape+style en `visual-render-spec-to-joint-graph.ts`
- Jerarquía visual: `affiliation: systemic|environmental` modula color/border
- Lanes y groups del `VisualRenderSpec.scene` se mapean a `joint.shapes.basic.Rect` con `embed()` de hijos

### Tests nuevos

```text
packages/web/tests/
  jointjs-shapes.test.ts                    # Cada shape renderiza con props esperadas
  jointjs-fixture-coffee.test.ts
  jointjs-fixture-driver-rescuing.test.ts
  jointjs-fixture-hodom-v2.test.ts
  jointjs-fixture-hodom-hsc-v0.test.ts
  jointjs-fixture-ev-ams.test.ts
  jointjs-fixture-hospitalizacion-domiciliaria.test.ts
  jointjs-style-pack-iso.test.ts            # Style pack produce output consistente
  jointjs-in-zoom-rendering.test.ts         # Process refinado muestra subprocess
  jointjs-fan-rendering.test.ts             # XOR/OR/AND se ven distinguibles
```

### Criterio de cierre

- [ ] 7 fixtures renderizan visualmente correctas (inspección manual + screenshots)
- [ ] Todos los link kinds OPM tienen shape/marker JointJS distinguible
- [ ] `visual-render-verifier` pasa contra las 7
- [ ] Style pack `iso-19450` completo y documentado
- [ ] Tests de snapshot JointJS para las 7 fixtures guardados en `packages/web/tests/__snapshots__/`
- [ ] `bun run test` verde
- [ ] Commit: `feat(web): jointjs complete OPM shapes + iso-19450 style pack`

### Blast radius

**Bajo-medio**. Todo queda en el módulo renderer nuevo. No toca `OpdCanvas`.

---

## Fase 3 — Eventos y layout ortogonal

### Intención

Habilitar interacción: drag, pan, zoom, select, context menu. Traducir eventos JointJS a `KernelPatchOperation` pasando por validación. Cerrar Ley 4 (ortogonalidad).

### Duración estimada

1.5 semanas.

### Archivos nuevos

```text
packages/web/src/lib/renderers/jointjs/
  joint-event-handlers.ts         # Whitelist central de eventos
  joint-to-kernel-patch.ts        # JointEvent -> KernelPatchOperation
  interaction/
    drag-to-layout.ts             # pointerdown/move/up -> LayoutModel delta
    select-selection.ts           # click/shift+click -> selección
    context-menu.ts               # right-click -> menú {add, delete, rename, connect}
    pan-zoom.ts                   # wheel+drag con Paper options
packages/web/src/hooks/
  useJointPaper.ts                # Hook React que monta JointJS paper
  useJointEventPipeline.ts        # Suscripción a eventos + dispatch a kernel
packages/core/src/generator/
  kernel-patch-types.ts           # NUEVO. Tipos de operación (addThing, deleteLink, ...)
  kernel-patch-apply.ts           # Aplicar patch al kernel con validación
  kernel-patch-from-joint.ts      # Traducción desde JointJS event
```

### Cambios

- `SemanticKernel` expone API de mutación controlada vía patches (no mutación directa)
- `validateOpl()` se adapta a validar un `KernelPatchOperation` antes de aplicar
- `LayoutModel` gana función `applyDragDelta(nodeId, dx, dy)` ortogonal al kernel

### Comportamiento

```typescript
// drag (no semántico)
paper.on('element:pointerup', (view, e, x, y) => {
  const id = view.model.id;
  const { x: nx, y: ny } = view.model.position();
  layoutStore.dispatch(setNodePosition(id, nx, ny));   // 𝓛 only, kernel intact
});

// add thing (semántico)
contextMenu.on('add-thing', async ({ kind, label, position }) => {
  const patch: KernelPatchOperation = {
    op: 'addThing',
    payload: { kind, label },
  };
  const validation = validateKernelPatch(kernel, patch);
  if (!validation.ok) {
    toast.error(validation.issues);
    return;
  }
  const newKernel = applyKernelPatch(kernel, patch);
  const newSpec = kernelToVisualRenderSpec(newKernel, atlas);
  const newGraph = visualRenderSpecToJointGraph(newSpec);
  paper.model.fromJSON(newGraph.toJSON());
  layoutStore.dispatch(setNodePosition(patch.result.id, position.x, position.y));
});
```

### Tests nuevos

```text
packages/web/tests/
  jointjs-drag-is-layout-only.test.ts       # Ley 4: drag no muta kernel
  jointjs-context-menu.test.ts              # Menú emite patch correcto
  jointjs-patch-validation.test.ts          # Patch inválido se rechaza
  jointjs-patch-apply-roundtrip.test.ts     # Aplicar patch + OPL roundtrip
  jointjs-pan-zoom.test.ts                  # Paper options funcionan
packages/core/tests/
  kernel-patch-operations.test.ts           # Todas las operaciones soportadas
  kernel-patch-validation.test.ts           # Validación SSOT por operación
```

### Criterio de cierre

- [ ] Drag mueve cajas sin alterar kernel (verificado por test)
- [ ] Context menu permite: agregar thing, borrar thing, renombrar, conectar con link, cambiar tipo
- [ ] Patch inválido muestra error y no aplica
- [ ] OPL roundtrip pasa después de sesión de edición visual de 10+ operaciones
- [ ] Las 4 leyes del ADR-003 siguen pasando después de edición visual
- [ ] `bun run test` verde
- [ ] Commit: `feat(web): jointjs interaction with kernel patch validation`

### Blast radius

**Medio**. Introduce nuevo módulo `kernel-patch-*` en core que afecta la arquitectura de mutación. Se minimiza manteniendo API actual intacta y agregando patches como camino alternativo.

---

## Fase 4 — Integración Generator + retiro OpdCanvas

### Intención

Cablear JointJS al Generator workspace (ADR-005). Retirar `OpdCanvas` como surface primaria. Export SVG/PNG desde JointJS. Deprecar LLM renderer.

### Duración estimada

1 semana.

### Archivos modificados

```text
packages/web/src/features/generator/components/
  DiagramPreview.tsx              # Reemplaza render SVG manual por JointDiagramPreview
  ModelWorkspace.tsx              # Layout completo generator + jointjs
packages/web/src/components/
  OpdCanvas.tsx                   # DEPRECATED header, mantener funcional pero no primary
  OplEditorView.tsx               # Conectar a jointjs paper para source mapping
packages/web/src/App.tsx          # Routing: ruta principal -> generator
packages/web/src/lib/renderers/jointjs/
  export/
    svg-export.ts                 # paper.toSVG() con style pack
    png-export.ts                 # canvas rasterization
    export-options.ts             # paperSize, dpi, margin, ...
packages/web/src/lib/renderers/llm-renderer/
  README.md                       # NUEVO: header DEPRECATED, razón, fecha
```

### Cambios

- `DiagramPreview` del Generator usa `<JointDiagramPreview spec={...} />`
- El editor OPL tiene hot-reload visual: cada `Ctrl+S` recompila a spec y regenera `joint.dia.Graph`
- Export SVG/PNG botones en la toolbar del Generator
- Source mapping bidireccional: click en caja JointJS → highlight línea OPL, click en línea OPL → highlight caja

### Tests nuevos

```text
packages/web/tests/
  generator-jointjs-integration.test.tsx    # Generator workspace + jointjs
  jointjs-export-svg.test.ts                # SVG export shape válido
  jointjs-export-png.test.ts                # PNG export dimensiones correctas
  generator-opl-to-visual-source-map.test.tsx  # Click OPL -> highlight JointJS
```

### Criterio de cierre

- [ ] Generator workspace usa JointJS como `DiagramPreview`
- [ ] OPL editor → visual actualización < 500ms para fixtures de 50+ entidades
- [ ] Source mapping bidireccional funciona OPL ↔ JointJS
- [ ] Export SVG/PNG produce archivo válido comparable visualmente al render anterior
- [ ] `OpdCanvas.tsx` marcado `@deprecated` en header, ya no está en la ruta principal
- [ ] `packages/web/src/lib/renderers/llm-renderer/` marcado deprecated con README
- [ ] Las 7 fixtures se pueden crear/editar/exportar end-to-end sin abrir `OpdCanvas`
- [ ] `bun run test` verde
- [ ] `bun run web:build` verde
- [ ] Commit: `feat(web): generator uses jointjs; deprecate opd-canvas and llm-renderer`

### Blast radius

**Medio-alto**. Cambia la surface primaria de la web. Se mitiga manteniendo `OpdCanvas` accesible por ruta secundaria durante período de transición (2-4 semanas post-cierre).

---

## Orden recomendado dentro de cada fase

### Fase 1
1. Instalar dependencia, build
2. Scaffold módulo jointjs
3. Shape object + process
4. Link procedural básico
5. Layout dagre
6. Paper + ruta sandbox
7. Render coffee-making

### Fase 2
1. Restantes shapes (state, system-boundary, internal, external, fan, modifier)
2. Restantes links (structural, refinement, consumption, result, effect, instrument, agent, invocation)
3. Style pack `iso-19450`
4. In-zoom containers
5. Layout jerárquico
6. Snapshot tests 7 fixtures

### Fase 3
1. Types de `KernelPatchOperation`
2. `validateKernelPatch` + `applyKernelPatch`
3. `kernel-patch-from-joint`
4. Drag como layout-only
5. Context menu básico (add/delete)
6. Context menu avanzado (rename, connect, change-type)
7. Source mapping visual → OPL

### Fase 4
1. `JointDiagramPreview` wrapper
2. Integrar en `DiagramPreview` del generator
3. Hot-reload OPL → visual
4. Export SVG
5. Export PNG
6. Deprecation OpdCanvas + llm-renderer
7. Documentación update

---

## Riesgos operativos

### R1. Diamond de cambios concurrentes
**Riesgo**: mientras se hace jointjs, alguien toca `OpdCanvas` y genera merge hell.
**Mitigación**: single operator, trabajar en branch `feat/jointjs-integration`, no tocar `OpdCanvas` hasta Fase 4.

### R2. Fixtures con casos no cubiertos por JointJS shapes
**Riesgo**: aparece un constructo en `hospitalizacion-domiciliaria` que no mapea a shape existente.
**Mitigación**: Fase 2 corre tests contra las 7 fixtures explícitamente. Si falta shape, se agrega antes de cerrar la fase.

### R3. Performance con modelos grandes
**Riesgo**: `ev-ams` (214 oraciones) renderiza lento.
**Mitigación**: JointJS tiene virtualización (`Paper.async: true`, `frozen: true`). Si aparece, se activa. Bench: renderizar 214 nodos debe ser <2s.

### R4. Source mapping bidireccional imperfecto
**Riesgo**: el mapeo line-OPL ↔ node-JointJS es heurístico.
**Mitigación**: `sourceInfo` del kernel ya lleva spans OPL. `VisualRenderSpec.nodes[].id` mantiene identidad estable. Mapping exacto.

### R5. Bundle size web crece
**Riesgo**: `@joint/core` agrega ~200KB gzip.
**Mitigación**: se tolera. Se puede code-split `/generator` con lazy import.

### R6. Felix se aburre o cambia de dirección antes de cerrar Fase 4
**Riesgo**: histórico.
**Mitigación**: fases cortas (1-1.5 sem c/u), commit al cierre de cada slice, cada fase entrega valor visible independientemente. Si se para en Fase 2, ya se tiene un renderer determinista completo.

---

## Bench de validación

Mantener vivos durante toda la ejecución:

- `packages/core/tests/isomorphism-laws.test.ts` (4 leyes × 6 fixtures)
- `packages/core/tests/compile-to-kernel.test.ts`
- Tests nuevos por fase (listados arriba)
- Snapshot visuales en `packages/web/tests/__snapshots__/jointjs/`
- Export SVG snapshots para comparar con renders previos

---

## Lo que este plan NO incluye

Explícitamente fuera de scope hasta cerrar Fase 4:

- edición colaborativa multi-usuario
- minimap / navegación de modelos muy grandes
- animaciones de simulación en canvas
- reverse compilation SVG → OPL
- LangGraph / Deep Agents / servicio Python
- LLM-mediated rendering
- persistencia avanzada de layout más allá de `LayoutModel`
- nueva gramática OPL o constructos nuevos
- refinamiento profundo más allá de SD1

---

## Definición de éxito global

Al cierre de Fase 4:

1. Felix puede crear un SD válido usando wizard o OPL, verlo renderizado en JointJS, ajustar layout, editar semántica vía context menu, y exportar SVG listo para documentar.
2. Las 7 fixtures reales funcionan end-to-end sin abrir `OpdCanvas`.
3. Las 4 leyes del ADR-003 siguen verificadas.
4. Ningún LLM participa en el pipeline de render o modelado.
5. `OpdCanvas` queda marcado deprecated, se puede retirar físicamente 30 días después.
6. `opmodel` es usable como producto, no solo como motor con tests.

## Resumen corto

No es rewrite. Es sustituir el renderer por uno maduro, preservando el motor. 4 fases, 4-6 semanas, cero LLM en el camino.
