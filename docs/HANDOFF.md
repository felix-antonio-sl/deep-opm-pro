# HANDOFF — Enlaces OPCloud avanzados

**Fecha**: 2026-05-14
**Repositorio**: `deep-opm-pro`
**Rama**: `main`
**Corte**: soporte de enlaces estructurales etiquetados OPCloud (`tag/backwardTag`), labels `requirements`/`rate`, OPL/JSON/UI/render alineados con SSOT y JointJS OSS.

## Política De Handoff Único

`docs/HANDOFF.md` es la única memoria de traspaso vigente del proyecto. Este archivo reemplaza y consolida el handoff anterior.

## Fuentes Normativas Y Técnicas

- SSOT OPM: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`.
- Roadmap vivo de enlaces: `docs/audits/opcloud-enlaces-pendientes/README.md`.
- OPCloud operacional:
  - `opm-extracted/src/app/models/LogicalPart/OpmTaggedRelation.ts`
  - `opm-extracted/src/app/models/DrawnPart/Links/UnidirectionalTaggedLink.ts`
  - `opm-extracted/src/app/configuration/rappidEnviromentFunctionality/shared.ts` (`BiDirectionalTaggedLink`, `updateTagLabel`, `updateBackwardTagLabel`, `updateRequirementsLabel`).
- JointJS OSS consultado:
  - `https://docs.jointjs.com/learn/features/labels/`
  - `https://docs.jointjs.com/learn/features/diagram-basics/links/`

## Estado Actual

Quedó implementado el siguiente bloque del roadmap:

- **Familias tagged OPCloud**: nuevos `TipoEnlace` `etiquetado` y `etiquetadoBidireccional`, expuestos en toolbar, menú de tipos válidos, tabla de enlaces y reglas de traer conectados.
- **Semántica SSOT**: los tagged son estructurales, pero no fundamentales. No entran a bus/triángulo, sort structural, router manhattan ni controles de grupo estructural. Los fundamentales siguen siendo `agregacion`, `exhibicion`, `generalizacion`, `clasificacion`.
- **Firmas con estados**: `etiquetado` admite entidad/estado; `etiquetadoBidireccional` bloquea el caso SSOT inválido de estado sólo en destino.
- **Markers OPCloud**: unidireccional usa open arrow `0,0 20,-10 0,0 20,10`; bidireccional usa harpoon en ambos extremos y cambia orientación horizontal como `fixArrowDirection()` de OPCloud.
- **Labels OPCloud**: forward tag, backward tag, `Satisfied: ...` y `Rate = ... [units]` se proyectan con posiciones/offsets observados en OPCloud y heredan `labelPositions` persistibles.
- **Metadatos de enlace**: `backwardTag`, `requisitos`, `mostrarRequisitos`, `tasa`, `unidadesTasa` tienen operaciones puras, acciones Zustand, Inspector y validación JSON.
- **OPL tagged**: unidireccional sin tag emite `se relaciona con`; con tag usa el tag como verbo. Bidireccional emite forward/backward cuando ambos existen y default `se relacionan` si no hay tags.
- **Serialización estricta**: JSON normaliza strings, conserva metadatos válidos y rechaza `backwardTag` fuera de bidireccional, `tasa/unidadesTasa` fuera de consumo/resultado/efecto y `grupoEstructuralId` fuera de estructurales fundamentales.

## Artefactos Modificados

- Modelo/operaciones: `app/src/modelo/tipos/enlace.ts`, `app/src/modelo/constantes.ts`, `app/src/modelo/enlaceMetadatos.ts`, `app/src/modelo/operaciones/helpers.ts`, `app/src/modelo/operaciones.ts`, `app/src/modelo/modificadores.ts`, `app/src/modelo/etiquetasEnlace.ts`.
- Render JointJS: `app/src/render/jointjs/composers/enlace.ts`, `app/src/render/jointjs/composers/markers.ts`, `app/src/render/jointjs/linkAssets.ts`, `app/src/render/jointjs/labelLayout.ts`, `app/src/render/jointjs/{agregacionBus,opcloudRouting,sortStructuralLinks}.ts`, `app/src/render/jointjs/mapa/estadisticas.ts`.
- UI/store: `app/src/ui/InspectorEnlace.tsx`, `app/src/ui/inspectorEnlace/SeccionMetadatosOpcloud.tsx`, `app/src/ui/MenuTipoEnlace.tsx`, `app/src/ui/TablaEnlaces.tsx`, `app/src/ui/toolbar/ToolbarCreacion.tsx`, `app/src/store/{tipos,sliceTypes}.ts`, `app/src/store/modelo/acciones-enlace.ts`.
- OPL/serialización/canvas: `app/src/opl/generadores/{procedural,refsHints}.ts`, `app/src/serializacion/{json,validarGuards,validarEnlaces,validarNormalizacion}.ts`, `app/src/canvas/reglasTraer.ts`.
- Tests: `app/src/completitud.test.ts`, `app/src/modelo/operaciones.test.ts`, `app/src/opl/generar.test.ts`, `app/src/serializacion/json.test.ts`, `app/src/render/jointjs/proyeccion.test.ts`, `app/src/store/enlaces.test.ts`, `app/src/canvas/reglasTraer.test.ts`.

## Verificación Final

Ejecutado en `app/`:

```bash
bun run typecheck
# clean

bun run test
# 1264 pass / 0 fail / 4818 expect() / 118 files

bun run build
# clean

bun run browser:smoke
# primera corrida: 172 pass / 1 flake en busqueda; rerun aislado clean
# segunda corrida completa: 173 pass / 0 fail
```

Antes del smoke se limpió Vite con:

```bash
pgrep -af vite | grep -v eval | awk '{print $1}' | xargs -r kill
```

Dev server vigente para revisión manual: `http://138.201.53.205:5173/`.

## Pendientes

- **Exception/time links OPCloud**: `Overtime`, `Undertime`, `OvertimeUndertime` y su semántica visual/OPL.
- **Forked tagged links**: OPCloud sincroniza enlaces unidireccionales con mismo source+tag; todavía no emulamos ese comportamiento de fork.
- **Import/export OPX real**: los campos nuevos están en JSON local, pero no hay mapeo OPX productivo.
- **Smoke específico tagged**: conviene agregar una prueba browser que cree tagged/bidirectional desde UI y verifique Inspector + OPL + JSON, aunque la cobertura unit/render ya existe.

## Supuestos Y Riesgos

- `requirements` se modela como metadato visual de enlace, no como semántica formal de verificación de requisitos.
- `rate` queda restringido a consumo/resultado/efecto porque OPCloud lo expone en popup procedural y la SSOT no lo define para tagged/fundamental.
- Los tagged son estructurales para OPL/SSOT, pero visualmente no usan triángulo ni bus. Esto sigue el patrón OPCloud de `OpmTaggedLink`.
- No se usa `labelsLayer`; conservar esa decisión salvo que se resuelva explícitamente la duplicación DOM observada en JointJS OSS.

## Prompt De Continuación

Retomar desde `docs/HANDOFF.md` y `docs/audits/opcloud-enlaces-pendientes/README.md`. Siguiente bloque recomendado: exception/time links OPCloud y, en paralelo, smoke UI para tagged/bidirectional. Mantener el principio: revisar `opm-extracted` primero, respetar SSOT para semántica y adaptar a nuestra arquitectura Preact/Zustand/JointJS OSS sin copiar Rappid.
