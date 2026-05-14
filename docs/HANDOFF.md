# HANDOFF — Enlaces OPCloud y anclas automáticas

**Fecha**: 2026-05-14
**Repositorio**: `deep-opm-pro`
**Rama**: `main`
**Corte**: heurística automática de anclas para símbolos estructurales, manteniendo edición manual, `symbolPos` persistible y la arquitectura JointJS OSS.

## Política De Handoff Único

`docs/HANDOFF.md` es la única memoria de traspaso vigente del proyecto. Este archivo reemplaza y consolida el handoff anterior.

## Fuentes Normativas Y Técnicas

- SSOT OPM: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`.
- Roadmap vivo de enlaces: `docs/audits/opcloud-enlaces-pendientes/README.md`.
- OPCloud operacional: `opm-extracted/src/app/configuration/rappidEnviromentFunctionality/shared.ts` (`OpmFundamentalLink`, `TriangleClass`) y `opm-extracted/src/app/models/DrawnPart/OpmEntity.ts`.
- JointJS OSS consultado: `https://docs.jointjs.com/api/layout/Port/` (`absolute` ports), `https://docs.jointjs.com/learn/features/ports/` (`portProp`/ports como puntos de conexión), `https://docs.jointjs.com/api/elementTools/Control/` (handles draggeables).

## Estado Actual

Quedó implementado el bloque recomendado del handoff anterior:

- **Anclas automáticas por dirección**: si una apariencia de enlace estructural no tiene `symbolAnchors`, el renderer ubica el puerto `in` del triángulo hacia el refinable y el puerto `out` hacia el refinador o promedio de refinadores. En layouts laterales evita segmentos top/bottom innecesarios; en layouts verticales conserva el resultado OPCloud-style.
- **Sin serializar defaults falsos**: mover el triángulo persiste `symbolPos`, pero ya no crea `symbolAnchors` top/bottom por defecto. Las anclas sólo entran al JSON cuando el operador las ajusta explícitamente.
- **Reset realmente automático**: el Inspector cambió el reset a `Auto anclas`, que elimina `symbolAnchors` y devuelve el grupo al modo inferido.
- **Manual sigue ganando**: `symbolAnchors` persistidos por handles o por Inspector se respetan y sobreviven al drag del triángulo.
- **HODOM denso validado por sonda**: el bundle `/home/felix/projects/hd-hsc-os/docs/models/opm-hodom-bundle-v1.1.json` hidrata y proyecta todos sus OPDs; `opd-sd1` proyectó 28 apariencias, 59 enlaces, 97 cells y 5 triángulos sin error.

## Artefactos Modificados

- Modelo/operaciones/store: `app/src/modelo/simboloEstructural.ts`, `app/src/modelo/operaciones/apariencias.ts`, `app/src/modelo/operaciones.ts`, `app/src/store/modelo/acciones-canvas.ts`, `app/src/store/tipos.ts`, `app/src/store/sliceTypes.ts`.
- Renderer JointJS: `app/src/render/jointjs/composers/enlace.ts`, `app/src/render/jointjs/agregacionBus.ts`.
- UI: `app/src/ui/InspectorEnlace.tsx`.
- Tests: `app/src/modelo/operaciones.test.ts`, `app/src/store.test.ts`, `app/src/store/enlaces.test.ts`, `app/src/render/jointjs/proyeccion.test.ts`.
- Documentación/memoria: `docs/audits/opcloud-enlaces-pendientes/README.md` y memoria externa `project_opcloud_enlaces_pendientes.md`.

## Verificación Final

Ejecutado en `app/`:

```bash
bun run lint
# clean

bun run typecheck
# clean

bun run test
# 1253 pass / 0 fail / 4735 expect() / 118 files

bun run build
# clean

bun run browser:smoke
# 173 pass / 0 fail
```

Antes del smoke se limpió Vite con:

```bash
pgrep -af vite | grep -v eval | awk '{print $1}' | xargs -r kill
```

Artefactos regenerables `app/dist` y `app/test-results` deben quedar fuera de git.

## Pendientes

- Labels avanzados OPCloud: requirements, rate/time completos, tags/backtags y familias tagged/bidirectional.
- Exception links de tiempo (`Overtime`/`Undertime`) y metadatos avanzados de requisitos.
- Validación visual humana in-vivo con HODOM denso en `http://138.201.53.205:5173/`, especialmente grupos estructurales separados y anclas automáticas/manuales.

## Supuestos Y Riesgos

- La inferencia automática vive en render y no muta modelo. Esto preserva compatibilidad JSON, pero significa que el mismo modelo puede renderizar mejor tras cambios de heurística sin diff de datos.
- OPCloud usa puertos `top`/`bottom` para el triángulo y desplaza triángulos solapados; la ancla direccional es una extensión local deliberada sobre ports `absolute` de JointJS OSS.
- El botón `Auto anclas` elimina sólo `symbolAnchors`; no toca `symbolPos`, `labelPositions` ni grupos estructurales.
- No se usa `labelsLayer`; conservar esa decisión salvo que se resuelva explícitamente la duplicación DOM observada.

## Prompt De Continuación

Retomar desde `docs/HANDOFF.md` y `docs/audits/opcloud-enlaces-pendientes/README.md`. Siguiente bloque recomendado: labels OPCloud avanzados (`requirements`, `rate/time`, `tags/backtags`, tagged/bidirectional), empezando por inventariar campos reales en `opm-extracted` y decidir el mínimo modelo/UI/OPL sin introducir campos muertos. Mantener `labelPositions`, `symbolAnchors` y la decisión de no usar `labelsLayer`.
