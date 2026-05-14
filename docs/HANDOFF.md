# HANDOFF — Enlaces OPCloud, triángulos y labels persistibles

**Fecha**: 2026-05-14
**Repositorio**: `deep-opm-pro`
**Rama**: `main`
**Corte**: mejoras de manejo visual de enlaces contra OPCloud/SSOT, con foco en distribución estructural y labels.
**HEAD previo al cierre final**: `733fdba` (`feat(enlaces): distribuir simbolos estructurales`). El commit final de labels queda en `git log` como `feat(enlaces): persistir layout de labels`.

## Política De Handoff Único

`docs/HANDOFF.md` es la única memoria de traspaso vigente del proyecto. Este archivo reemplaza y consolida el handoff anterior.

## Fuentes Normativas Y Técnicas

- SSOT OPM: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`.
- Roadmap vivo de enlaces: `docs/audits/opcloud-enlaces-pendientes/README.md`.
- OPCloud operacional: `opm-extracted/src/app/configuration/rappidEnviromentFunctionality/shared.ts`, en particular `setLabelsOLinks()` y `TriangleClass.checkFOrOverLapping()`.
- JointJS OSS consultado: `docs.jointjs.com/api/dia/Paper/` (`interactive`, `labelMove`, `snapLabels`, `labelsLayer`) y `docs.jointjs.com/api/dia/Link/` / learn labels (`labels[]`, `position.distance/offset`).

## Estado Actual

Quedó implementada una nueva tanda de emulación OPCloud para enlaces:

- **Distribución de símbolos estructurales**: los triángulos de grupos estructurales reservan centros y separan colisiones automáticas siguiendo el patrón OPCloud de mover símbolos solapados por carriles de 50 px. No muta el modelo si la posición no fue persistida por el operador.
- **Wrapping de labels largo por tramo visible**: labels de rutas, etiquetas y ramas estructurales usan `textWrap` con ancho estimado desde el segmento visible entre contornos, no un ancho fijo ciego.
- **Layout persistible de labels**: `AparienciaEnlace.labelPositions` guarda `distance`, `offset` y `angle` por rol visual (`etiqueta`, `ruta`, multiplicidades, modificadores, probabilidad, demora, orden, proxies).
- **Arrastre controlado de labels**: `JointCanvas` habilita `labelMove` sólo para el enlace seleccionado y usa `snapLabels: true`. `handlers/drag.ts` persiste `change:labels` vía operación pura de modelo.
- **Decisión importante**: no se usa `labelsLayer: true`. En JointJS OSS agrega nodos `.joint-link` extra para labels, lo que rompe el contrato DOM de enlaces reales y falló smoke. Se retiró y se validó de nuevo.

## Artefactos Modificados

- Modelo/tipos/operaciones: `app/src/modelo/tipos/enlace.ts`, `app/src/modelo/operaciones/apariencias.ts`, barrels y store.
- Renderer JointJS: `app/src/render/jointjs/labelLayout.ts`, `labelText.ts`, `proyeccion.ts`, `agregacionBus.ts`, `composers/enlace.ts`, `rutaLabels.ts`, `JointCanvas.tsx`, `handlers/drag.ts`.
- Tests: `app/src/modelo/operaciones.test.ts`, `app/src/render/jointjs/proyeccion.test.ts`, `app/src/render/jointjs/composers/enlace.test.ts`.
- Documentación/memoria: `docs/audits/opcloud-enlaces-pendientes/README.md` y memoria externa `project_opcloud_enlaces_pendientes.md`.

## Verificación Final

Ejecutado en `app/`:

```bash
bun run typecheck
# clean

bun run test
# 1245 pass / 0 fail / 4697 expect() / 118 files

bun run build
# clean

bun run lint
# clean

bun run browser:smoke
# 173 pass / 0 fail
```

Antes del smoke se limpió Vite con:

```bash
pgrep -af vite | grep -v eval | awk '{print $1}' | xargs -r kill
```

Artefactos regenerables `app/dist` y `app/test-results` fueron eliminados tras la verificación.

## Pendientes

- **Offsets avanzados del símbolo estructural**: ya hay `symbolAnchors`, ports y separación de centros; falta editor fino de offsets del triángulo y heurísticas OPCloud más densas para vértices superiores.
- **Semántica avanzada de labels**: quedan requirements, rate/time completos, tags/backtags y familias tagged/bidirectional. `path/ruta`, probabilidad, demora, multiplicidades y etiquetas estructurales ya tienen rol visual y posición persistible.
- **Exception links de tiempo**: OPCloud tiene `Overtime/Undertime`; aún no están modelados en la app.
- **Validación visual humana**: conviene revisar in-vivo un modelo denso HODOM en `http://138.201.53.205:5173/`, especialmente labels manualmente movidos y grupos estructurales separados.

## Supuestos Y Riesgos

- La persistencia de labels es aditiva; modelos previos sin `labelPositions` hidratan igual.
- `labelMove` sólo se habilita en enlaces seleccionados para no convertir cualquier click sobre texto en operación accidental.
- No se introdujeron requirements/rate/tags como campos muertos: requieren UI, OPL y validación de modelo, no sólo rendering.
- La decisión de no usar `labelsLayer` conserva smoke y selección, pero los labels siguen en la capa del link. Si en el futuro se necesita elevar labels sobre todo el canvas, debe hacerse sin duplicar `.joint-link`.

## Prompt De Continuación

Retomar desde `docs/HANDOFF.md` y `docs/audits/opcloud-enlaces-pendientes/README.md`. Siguiente bloque recomendado: implementar editor fino de `symbolAnchors` para vértices/puertos superiores del triángulo estructural contra OPCloud, manteniendo `labelPositions` y sin usar `labelsLayer`. Verificar con HODOM denso y cerrar con `typecheck`, `test`, `build`, `lint`, `browser:smoke`.
