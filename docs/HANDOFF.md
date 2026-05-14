# HANDOFF — Enlaces OPCloud y anclas estructurales

**Fecha**: 2026-05-14
**Repositorio**: `deep-opm-pro`
**Rama**: `main`
**Corte**: editor fino de anclas para símbolos estructurales, manteniendo la línea OPCloud/SSOT y la arquitectura JointJS OSS propia.
**Commit de cierre**: `feat(enlaces): editar anclas estructurales` (ver `git log` para SHA exacto)

## Política De Handoff Único

`docs/HANDOFF.md` es la única memoria de traspaso vigente del proyecto. Este archivo reemplaza y consolida el handoff anterior.

## Fuentes Normativas Y Técnicas

- SSOT OPM: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`.
- Roadmap vivo de enlaces: `docs/audits/opcloud-enlaces-pendientes/README.md`.
- OPCloud operacional: `opm-extracted/src/app/models/DrawnPart/OpmEntity.ts`, `opm-extracted/src/app/configuration/rappidEnviromentFunctionality/shared.ts`.
- JointJS OSS consultado: `https://docs.jointjs.com/api/layout/Port/` (`absolute` ports), `https://docs.jointjs.com/api/elementTools/Control/` (handles draggeables), `https://docs.jointjs.com/learn/features/ports/` (`portProp`/ports como puntos de conexión).

## Estado Actual

Quedó implementado el bloque recomendado del handoff anterior:

- **Editor fino de anclas del símbolo estructural**: el triángulo seleccionado expone handles sobre sus puertos `in/out`, implementados con `elementTools.Control`, para ajustar visualmente los offsets `refinable` y `refinador`.
- **Inspector coherente con canvas**: el Inspector de enlace estructural agrega la sección `Anclas del símbolo`, con inputs `dx/dy`, slots `-10/0/+10` y reset. Los cambios se aplican a todas las apariencias del grupo estructural seleccionado.
- **Persistencia separada de centro y anclas**: `actualizarAnclajesSimboloEstructural()` persiste `AparienciaEnlace.symbolAnchors` sin mover `symbolPos`. Al arrastrar el triángulo, `actualizarPosicionSimboloEstructural()` conserva anclas manuales previas.
- **Ports JointJS visibles sólo cuando corresponde**: los puertos del triángulo son invisibles por defecto y aparecen como handles cuando el símbolo/grupo está seleccionado, sin activar `labelsLayer` ni duplicar nodos `.joint-link`.
- **Contrato de modelo aditivo**: modelos previos sin `symbolAnchors` siguen usando `anclajesSimboloPorDefecto()`.

## Artefactos Modificados

- Modelo/operaciones/store: `app/src/modelo/simboloEstructural.ts`, `app/src/modelo/operaciones/apariencias.ts`, `app/src/modelo/operaciones.ts`, `app/src/store/modelo/acciones-canvas.ts`, `app/src/store/tipos.ts`, `app/src/store/sliceTypes.ts`.
- Renderer JointJS: `app/src/render/jointjs/JointCanvas.tsx`, `app/src/render/jointjs/composers/markers.ts`, `app/src/render/jointjs/handlers/toolsSimboloEstructural.ts`.
- UI: `app/src/ui/InspectorEnlace.tsx`.
- Tests: `app/src/modelo/operaciones.test.ts`, `app/src/store/enlaces.test.ts`, `app/src/render/jointjs/proyeccion.test.ts`.
- Documentación/memoria: `docs/audits/opcloud-enlaces-pendientes/README.md` y memoria externa `project_opcloud_enlaces_pendientes.md`.

## Verificación Final

Ejecutado en `app/`:

```bash
bun run lint
# clean

bun run typecheck
# clean

bun run test
# 1248 pass / 0 fail / 4713 expect() / 118 files

bun run browser:smoke
# 173 pass / 0 fail

bun run build
# clean
```

Antes del smoke se limpió Vite con:

```bash
pgrep -af vite | grep -v eval | awk '{print $1}' | xargs -r kill
```

Artefactos regenerables `app/dist` y `app/test-results` deben quedar fuera de git.

## Pendientes

- Heurísticas automáticas más finas para offsets alrededor del triángulo en modelos extremadamente densos. La edición manual ya existe.
- Labels avanzados OPCloud restantes: requirements, rate/time completos, tags/backtags y familias tagged/bidirectional.
- Exception links de tiempo (`Overtime`/`Undertime`) y metadatos avanzados de requisitos.
- Validación visual humana in-vivo con HODOM denso en `http://138.201.53.205:5173/`, especialmente grupos estructurales separados y anclas ajustadas manualmente.

## Supuestos Y Riesgos

- El editor persiste los mismos offsets en todas las ramas visibles del grupo seleccionado; si en el futuro se quiere una rama con ancla distinta, debe separarse mediante `grupoEstructuralId`.
- Los handles de ancla usan coordenadas internas del triángulo (`0..30`) y se clampean a `[-15, 15]` respecto del centro. Esto evita puertos fuera del símbolo, pero no intenta resolver automáticamente todos los cruces.
- `elementTools.Control` es OSS; la implementación evita APIs de JointJS+.
- No se usa `labelsLayer`; conservar esa decisión salvo que se resuelva explícitamente la duplicación DOM observada.

## Prompt De Continuación

Retomar desde `docs/HANDOFF.md` y `docs/audits/opcloud-enlaces-pendientes/README.md`. Siguiente bloque recomendado: atacar heurísticas automáticas de offsets/vertices alrededor del símbolo estructural para modelos densos, validando contra HODOM; luego avanzar a labels OPCloud avanzados (requirements, rate/time, tags/backtags) sin introducir campos muertos. Mantener `labelPositions`, `symbolAnchors` y la decisión de no usar `labelsLayer`.
