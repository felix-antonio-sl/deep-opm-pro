# HANDOFF - estado, decisiones, pendientes, riesgos

**Fecha**: 2026-05-04
**Repositorio**: `deep-opm-pro`
**Corte**: MVP-alpha + EPICA-20 minimo + EPICA-12 in-zooming MVP + repo liviano

---

## Politica De Handoff Unico

`docs/HANDOFF.md` es la unica memoria de traspaso vigente del proyecto. No se
mantienen handoffs paralelos, fechados ni duplicados. Cada nuevo handoff debe
reemplazar y consolidar el contenido anterior en este mismo archivo.

## Estado Actual

- El repo es un workspace de desarrollo nuevo para el modelador OPM en `app/`,
  basado en SSOT OPM/ISO 19450 y evidencia observacional de OPCloud.
- `docs/historias-usuario-v2/` es el backlog vivo local: 48 epicas, 1,117 HU
  canonicas, 48 stubs, 0 violaciones de linter y 0 huerfanas v1->v2.
- `opm-extracted/` esta versionado y es la fuente preferente para consultar
  logica observable de OPCloud. `decompiled/` y `_local/` se regeneran solo
  bajo demanda con `bash setup.sh` y no se conservan en el workspace liviano.
- `app/` contiene una app Bun + Vite + Preact + Zustand + JointJS OSS, con
  kernel OPM propio y sin copiar arquitectura Angular/Firebase/Rappid.
- EPICA-20 minimo esta implementado: arbol OPD con raiz `SD`, `opdActivoId` en
  store, navegacion desde UI, canvas JointJS y OPL filtrados por OPD activo.
- EPICA-12 in-zooming MVP esta implementado para procesos: accion
  "Descomponer", kernel idempotente, `entidad.refinamiento`, OPD hijo
  `SDn`/`SDn.m`, nodo `SDn: <Proceso> descompuesto`, navegacion automatica,
  apariencia del mismo proceso en padre e hijo, tres subprocesos iniciales,
  contenido interno dentro del contorno, OPL "se descompone en" ordenado por
  `y` y JSON round-trip validado.
- La proyeccion MVP de enlaces externos esta implementada: consumo deriva al
  primer subproceso por orden `y`, resultado deriva desde el ultimo subproceso,
  agente/instrumento/efecto quedan en el contorno hasta refinamiento explicito,
  y los enlaces del padre se conservan.
- La descomposicion es reversible desde UI: "Quitar descomposicion" elimina el
  OPD hijo y su subarbol, limpia entidades/enlaces huerfanos, remueve OPL de
  refinamiento y vuelve a un OPD activo valido.
- Auditoria visual SSOT/JointJS aplicada: firmas consumo/resultado/efecto,
  marcadores procedimentales basicos, agregacion con triangulo, routing
  manhattan basico, etiquetas sin elipsis silenciosa, posicion inicial libre
  por OPD y toolbar compacta sin overflow.
- Integridad de import JSON endurecida: validacion estructural, referencial,
  firmas OPM, endpoints visibles por OPD y rechazo de enlaces invisibles antes
  de hidratar `Modelo`.
- Auditorias in-vivo estabilizadas: `app/scripts/in-vivo-test.mjs` y
  `app/scripts/in-vivo-deep-checks.mjs` generan JSON, capturas y reporte dentro
  de `app/test-results/in-vivo/`, directorio ignorado por git.
- Destilacion de repo aplicada: removidos `_local/`, `decompiled/`,
  `app/dist/`, `app/.vite/`, `app/test-results/` y `.claude/`. Se mantiene
  `app/node_modules/` local para agilidad. Tamano actual aproximado: `143M`
  con dependencias locales, `31M` sin `node_modules`.
- Dev server remoto probado en `http://138.201.53.205:5173/` con Vite en
  `0.0.0.0:5173`; `5174` debe permanecer cerrado.

## Artefactos Relevantes

- Instrucciones activas para agentes: `AGENTS.md`.
- Mapa operativo del repo: `README.md`.
- Aviso de limites, autoria y material derivado: `NOTICE.md`.
- Estado y memoria operativa: `docs/HANDOFF.md`.
- Roadmap activo: `docs/roadmap/sprint-0.md`,
  `docs/roadmap/mvp-alpha.md`, `docs/roadmap/mvp-alpha-coverage.md`.
- Historias de usuario vivas: `docs/historias-usuario-v2/`.
- Evidencia OPCloud curada: `opm-extracted/INDEX.md`,
  `opm-extracted/MODULES.md`, `opm-extracted/assets/INDEX.md`.
- App nueva: `app/src/modelo/`, `app/src/render/jointjs/`,
  `app/src/store.ts`, `app/src/ui/`.
- Supply-chain app: `app/bunfig.toml`, `app/bun.lock`, `app/package.json`.
- Auditorias visuales regenerables: `app/scripts/in-vivo-test.mjs`,
  `app/scripts/in-vivo-deep-checks.mjs`; salidas ignoradas en
  `app/test-results/in-vivo/`.

## Decisiones Vigentes

- JointJS OSS se usa como renderer/adaptador; el modelo de dominio vive en
  `app/src/modelo/`.
- Los markers de enlaces deben salir de los assets SVG canonicos en
  `assets/svg/links/procedural/` y `assets/svg/links/structural/`; la tabla
  operativa vive en `app/src/render/jointjs/linkAssets.ts`.
- Undo/redo y dirty state usan snapshots de `Modelo` con profundidad 100. Es
  suficiente para MVP-alpha; comandos inversos quedan para una etapa posterior.
- `opm-extracted/` se consulta para semantica, valores visuales, routing,
  puertos, marcadores y OPL; no se copian bloques 1:1 a `app/`.
- `decompiled/` y `_local/` no se versionan ni se conservan por defecto:
  material grande, derivado de OPCloud y regenerable con `bash setup.sh`.
- `docs/REPORTE-EJECUTIVO.md` dejo de versionarse. Los reportes/capturas de
  auditoria son salidas efimeras en `app/test-results/`; la memoria versionada
  del proyecto es este handoff.
- `hidratarModelo` no debe emitir un `Modelo` si el JSON falla estructura,
  referencias, firmas OPM, visibilidad de endpoints en OPD o deja enlaces sin
  apariencia.
- No se declara licencia open-source repo-wide por convivencia de codigo propio
  y evidencia OPCloud derivada; hasta definir politica explicita, `NOTICE.md`
  es el punto operativo.
- Bun Security Scanner API queda activo con `@socketsecurity/bun-security-scanner`.
  En modo publico funciona sin `SOCKET_API_KEY`; nuevas resoluciones usan edad
  minima de publicacion de 7 dias salvo `@types/bun`.

## Verificacion Del Corte

Ultimo loop verde conocido en `app/` antes de la destilacion:

- `bun run check` -> 47 tests verdes.
- `bun run security:scan` -> Socket free mode, 153 paquetes, 0 advisories.
- `bun run browser:smoke` -> 10 tests Playwright verdes.
- `bun run build` -> build OK; warning esperado de chunk grande por JointJS.
- `bun run visual:audit -- http://127.0.0.1:5173/` -> 51 OK, 0 FAIL,
  0 WARN, 3 INFO.
- `bun run visual:deep -- http://127.0.0.1:5173/` -> 27 OK, 0 FAIL,
  0 WARN, 2 INFO.

Verificacion ejecutada despues de la destilacion:

- `bun run check` -> 47 tests verdes.
- `bun run visual:audit -- http://127.0.0.1:5173/` -> 51 OK, 0 FAIL,
  0 WARN, 3 INFO; reporte generado en `app/test-results/in-vivo/`.
- `curl http://127.0.0.1:5173/` -> HTTP 200.
- `curl http://138.201.53.205:5173/` -> HTTP 200.

Las capturas y reportes browser no se conservan en el repo liviano. Se
regeneran con:

```bash
cd app
bun run browser:smoke
bun run visual:audit -- http://127.0.0.1:5173/
bun run visual:deep -- http://127.0.0.1:5173/
```

## Pendientes Inmediatos

1. Ampliar smoke de undo/redo por operacion: eliminar, renombrar, mover,
   esencia, afiliacion, crear/eliminar enlace y vertices.
2. Completar in-zooming mas alla del MVP: edicion/reordenamiento del timeline
   top-to-bottom, reasignacion manual de enlaces externos entre subprocesos,
   split de `effect` y enlaces estado-especificos.
3. Implementar unfold/despliegue de objetos y distinguirlo explicitamente de
   in-zooming de procesos.
4. Persistencia local real: IndexedDB o storage estructurado con lista de
   modelos.
5. Dialogo Guardar / Descartar / Cancelar cuando exista navegacion real entre
   modelos.
6. Definir politica de licencia explicita para codigo propio vs. material
   observacional antes de redistribucion publica.
7. OPL bidireccional queda fuera hasta estabilizar parser y mas kernel.

## Supuestos

- Para MVP-alpha, snapshots de modelo son suficientemente pequenos y reversibles.
- La app puede seguir sin backend ni auth mientras se valida modelado local.
- OPCloud informa UX y comportamiento, pero SSOT OPM manda cuando haya tension
  semantica.
- `app/node_modules/` puede mantenerse localmente para velocidad, aunque no se
  versiona y puede borrarse si se necesita un workspace frio.
- Si se necesita una clase que no esta en `opm-extracted/`, se regenera
  `decompiled/` con `bash setup.sh`, se consulta y luego puede eliminarse otra
  vez.

## Riesgos

- `opm-extracted/` es material derivado de ingenieria inversa: usarlo como
  evidencia, no como fuente copiada.
- No hay licencia repo-wide declarada; redistribucion publica queda bloqueada
  hasta decision explicita.
- El scanner de Socket corre en modo publico si no hay `SOCKET_API_KEY`; CI/org
  policy requiere configurar credencial.
- Dirty state no tiene confirmacion de salida hasta que exista navegacion/cierre
  de modelos.
- El bundle de JointJS genera warning de tamano; no bloquea MVP-alpha, pero
  puede exigir code splitting luego.
- `setup.sh` hardcodea hashes de bundles OPCloud; si OPCloud cambia deploy,
  hay que actualizar hashes antes de regenerar `_local/`/`decompiled/`.

## Prompt Breve De Continuacion

```
Retoma `docs/HANDOFF.md` en `deep-opm-pro`. Estado: EPICA-20 minimo
implementado con arbol OPD, raiz SD, `opdActivoId`, canvas JointJS y OPL por
OPD activo. EPICA-12 in-zooming MVP implementado para descomponer procesos:
kernel idempotente, OPD hijo `SDn`/`SDn.m`, nodo `SDn: <Proceso>
descompuesto`, navegacion automatica, contenido interno dentro del contorno,
tres subprocesos iniciales, OPL "se descompone en", JSON round-trip,
redistribucion de enlaces externos al primer/ultimo subproceso y eliminacion
reversible de descomposicion.

Repo destilado: no conservar `_local/`, `decompiled/`, `app/dist/`,
`app/test-results/` ni `.claude/` por defecto. `opm-extracted/`, `assets/`,
`fixtures/`, `docs/historias-usuario-v2/` y `docs/HANDOFF.md` son referencias
versionadas. Ultimo check posterior a la poda: `bun run check` con 47 tests
verdes y dev server HTTP 200 local/remoto en puerto 5173.

Continuar profundizando in-zooming: edicion/reordenamiento del timeline
top-to-bottom, reasignacion manual de enlaces externos, split de `effect`; luego
unfold/despliegue de objetos.
```
