# HANDOFF - estado, decisiones, pendientes, riesgos

**Fecha**: 2026-05-04
**Repositorio**: `deep-opm-pro`
**Corte**: MVP-alpha + ciclo de 5 líneas paralelas + ronda de refactor estructural (markers SVG canonicos, layout puro, Inspector sub-componentes, ConfirmacionProvider global)

---

## Politica De Handoff Unico

`docs/HANDOFF.md` es la unica memoria de traspaso vigente del proyecto. No se
mantienen handoffs paralelos, fechados ni duplicados. Cada nuevo handoff debe
reemplazar y consolidar el contenido anterior en este mismo archivo.

## Estado Actual

- El repo es un workspace de desarrollo del modelador OPM en `app/`, basado
  en SSOT OPM/ISO 19450 y evidencia observacional curada en `opm-extracted/`.
- `docs/historias-usuario-v2/` es el backlog vivo local: 48 epicas, 1.117 HU
  canonicas, 48 stubs, 0 violaciones de linter y 0 huerfanas v1->v2.
- `docs/instrucciones-lineas-dev/` registra los briefs operativos que
  guiaron este ciclo de 5 lineas paralelas; sirve como referencia historica
  del patron de delegacion (no es backlog ni roadmap).
- `app/` contiene una app Bun + Vite + Preact + Zustand + JointJS OSS, con
  kernel OPM propio y sin copiar arquitectura Angular/Firebase/Rappid.

### Mecanismos de refinamiento

- **EPICA-20** minimo: arbol OPD con raiz `SD`, `opdActivoId` en store,
  navegacion desde UI, canvas JointJS y OPL filtrados por OPD activo.
- **EPICA-12 in-zooming** MVP para procesos: accion "Descomponer", kernel
  idempotente, `entidad.refinamiento`, OPD hijo `SDn`, contorno grueso del
  refinable, tres subprocesos iniciales, OPL "se descompone en" ordenado por
  `y`, deteccion de paralelos por misma altura, JSON round-trip y reversibilidad
  por subarbol via "Quitar descomposicion".
- **Despliegue de objetos** en cuatro modos canonicos (`agregacion`,
  `exhibicion`, `generalizacion`, `clasificacion`): `desplegarObjeto(modelo,
  opdId, objetoId, modo)` parametrizado, `TipoEnlace` extendido con los tres
  estructurales nuevos, OPL diferenciada por modo (`se despliega en … como
  partes`, `exhibe`, `es un / es una`, `es una instancia de`), submenu
  "Desplegar como…" en Inspector, JSON round-trip retro-compatible, markers
  estructurales reusan triangulo de agregacion hasta tener SVG dedicados.
- **Proyeccion de enlaces externos** en in-zoom: consumo deriva al primer
  subproceso por `y`, resultado deriva del ultimo, agente/instrumento/efecto
  quedan en el contorno hasta refinamiento explicito; metadatos `derivado.tipo
  = "enlace-externo-refinamiento"`, `refinamientoId` y `enlacePadreId` los
  hacen trazables y recalculables sin pisar enlaces manuales.
- **Plegado parcial** como estado de visualizacion sobre `Apariencia`:
  `apariencia.modoPlegado: "completo" | "parcial"` (default `completo`,
  retro-compatible al deserializar); modo `parcial` renderiza partes apiladas
  como filas internas dentro del rectangulo padre sin abrir OPD hijo y sin
  alterar el modelo; entrada de menu "Plegado parcial" en Inspector cuando la
  entidad tiene refinamiento; badge "tiene partes" en modo `completo` cuando
  aplica. Funcion pura `cambiarModoPlegado` en `app/src/modelo/plegado.ts`,
  conectada al store para preservar undo y dirty.

### OPL bimodal

- **EPICA-50** panel OPL-ES persistente: render filtrado por OPD activo,
  numeracion, hover cruzado, edicion inversa minima de nombres por doble clic.
- **HU-SHARED-007** eco OPL canonico cubierto: declaracion de cosas,
  enlaces canonicos (`agregacion`, `agente`, `instrumento`, `consumo`,
  `resultado`, `efecto`, `invocacion`, mas los tres estructurales nuevos),
  refinamiento de procesos con cláusulas "en esa secuencia" y "en paralelo"
  (esta ultima cerrada en este ciclo con plantilla canonica para subprocesos
  con misma `y`), refinamiento de objetos con verbos diferenciados por modo.
- Cobertura unit de OPL ampliada por tipo de enlace canonico; bug detectado y
  corregido en cláusula de secuencia (coma redundante) durante el ciclo.

### Editor de timeline procedural

- Panel `Timeline` lateral activo cuando el OPD activo es hijo de
  descomposicion de proceso. Lista subprocesos por `y` ascendente, drag
  vertical reordena (modifica `apariencia.y` via accion `reordenarSubproceso`
  en store que reusa `moverAparienciaPorId`), agrupa subprocesos con misma `y`
  como paralelos. Snap a "misma altura" disponible. La operacion entra al stack
  undo y actualiza el OPL en linea.

### UX de seguridad de datos

- Diálogo modal generico `Dialogo.tsx` + `DialogoConfirmacion.tsx` intercepta
  acciones destructivas (`Nuevo`, `Cargar local`, `Cargar demo`, `Importar
  JSON`) cuando `dirty === true`, ofreciendo `Guardar / Descartar / Cancelar`.
  ESC equivale a Cancelar; click fuera no cierra (forza eleccion consciente).
- `beforeunload` activo solo cuando `dirty === true`. Cuando no hay cambios
  pendientes, el cierre es inmediato.
- Import asistido en `PersistenciaJson.tsx`: file picker + drop zone + preview
  validado antes de hidratar (nombre, conteo de entidades/OPDs/enlaces) +
  errores legibles cuando `hidratarModelo` falla. Coexiste con el textarea
  manual previo.
- `Apariencia.modoPlegado`, `RefinamientoEntidad.modo` y los nuevos
  `TipoEnlace` (`exhibicion`, `generalizacion`, `clasificacion`) tienen
  defaults retro-compatibles en `hidratarModelo`: modelos persistidos antes de
  este ciclo cargan sin perdida.

### Persistencia y validacion

- Persistencia local estructurada sobre `localStorage`: indice de modelos,
  guardar/cargar/borrar, `modeloPersistidoId`, `Nuevo`, Ctrl/Cmd+S, reinicio
  de historial al cargar y preservacion de registros guardados al crear un
  modelo nuevo. IndexedDB queda para una etapa posterior si el tamano de
  modelos lo exige.
- Integridad de import JSON endurecida: validacion estructural, referencial,
  firmas OPM, endpoints visibles por OPD y rechazo de enlaces invisibles antes
  de hidratar `Modelo`. Ahora extendida para validar `RefinamientoEntidad.modo`,
  los tres `TipoEnlace` estructurales nuevos y `Apariencia.modoPlegado`.

### Auditoria visual

- SSOT/JointJS: firmas consumo/resultado/efecto/agente/instrumento/invocacion
  con marcadores canonicos desde `assets/svg/links/procedural/`. Refinamientos
  estructurales con markers diferenciados por tipo (`assets/svg/links/structural/`):
  triangulo solido (agregacion), triangulo vacio (generalizacion), triangulo
  vacio + dot interno (clasificacion), triangulo con sub-triangulos via
  `standard.Path` con `fill-rule: evenodd` (exhibicion). Routing manhattan
  basico; etiquetas sin elipsis silenciosa; posicion inicial libre por OPD;
  toolbar compacta.
- `app/scripts/in-vivo-test.mjs` y `app/scripts/in-vivo-deep-checks.mjs`
  generan JSON, capturas y reporte dentro de `app/test-results/in-vivo/`,
  directorio ignorado por git.

## Artefactos Relevantes

- Instrucciones activas para agentes: `AGENTS.md`.
- Mapa operativo del repo: `README.md`.
- Aviso de limites, autoria y material derivado: `NOTICE.md`.
- Estado y memoria operativa: `docs/HANDOFF.md`.
- Briefs operativos del ciclo de 5 lineas: `docs/instrucciones-lineas-dev/`.
- Roadmap activo: `docs/roadmap/sprint-0.md`,
  `docs/roadmap/mvp-alpha.md`, `docs/roadmap/mvp-alpha-coverage.md`.
- Historias de usuario vivas: `docs/historias-usuario-v2/`.
- Evidencia OPCloud curada: `opm-extracted/INDEX.md`,
  `opm-extracted/MODULES.md`, `opm-extracted/assets/INDEX.md`.
- App: `app/src/modelo/` (incluye `plegado.ts` y `layout.ts` puros),
  `app/src/render/jointjs/`, `app/src/store.ts`, `app/src/ui/` (incluye
  `Dialogo.tsx`, `DialogoConfirmacion.tsx` puro de presentacion,
  `ConfirmacionContext.tsx` con Provider global, `Inspector.tsx` /
  `InspectorEntidad.tsx` / `InspectorEnlace.tsx` con `inspectorStyles.ts`,
  `Timeline.tsx`), `app/src/persistencia/`.
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
- **`TipoEnlace` flat**: se extiende con `exhibicion | generalizacion |
  clasificacion`. NO se introduce dimension paralela `naturaleza`. La
  inferencia procedural-vs-estructural se hace con funcion pura sobre el tipo.
- **Despliegue parametrizado por modo**: `desplegarObjeto(m, opd, obj, modo)`
  con default `"agregacion"`; firma retro-compatible y persistencia que asume
  el default cuando el campo no existe.
- **Plegado parcial es estado de visualizacion**, no nuevo tipo de
  refinamiento. Vive en `Apariencia.modoPlegado`. Default `"completo"` para
  retro-compatibilidad. Cambios via funcion pura `cambiarModoPlegado` en
  `app/src/modelo/plegado.ts`, conectada al store para preservar undo/dirty.
- **Reorden de subprocesos en in-zoom** opera sobre la SSOT existente
  (`apariencia.y`); el panel `Timeline` es vista derivada. "Misma Y" significa
  estrictamente igual, no epsilon (el snap se encarga). Cada reorden entra al
  stack undo como una operacion atomica.
- **Confirmacion de cambios sin guardar** se intercepta en la UI, no en el
  store. Una sola instancia de `<DialogoConfirmacion>` montada por
  `<ConfirmacionProvider>` en `App.tsx`; los consumidores (Toolbar,
  PersistenciaJson) leen `confirmarSiDirty` via `useConfirmarSiDirty()`
  contra el contexto. ESC = Cancelar. Click fuera del modal NO cierra (forza
  eleccion consciente).
- **`beforeunload`** activo SOLO cuando `dirty === true`. Sin texto custom
  (los browsers modernos lo ignoran).
- Undo/redo y dirty state usan snapshots de `Modelo` con profundidad 100. Es
  suficiente para MVP-alpha; comandos inversos quedan para una etapa posterior.
- Los enlaces derivados por refinamiento se modelan como enlaces OPM normales
  mas metadatos `derivado`; no se esconden en el adapter JointJS. Esto permite
  serializar, validar, recalcular y borrar en cascada sin confundirlos con
  enlaces manuales.
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

Loop verde de convergencia ejecutado en `app/`:

- `bun run check` -> **106 tests verdes, 641 `expect()` calls** (vs. 98/604
  pre-refactor). 8 archivos de test (incluye `modelo/layout.test.ts` nuevo).
- `bun run browser:smoke` -> **16/16 tests Playwright Chromium verdes**.
  Cobertura: plegado parcial con persistencia, confirmacion antes de Nuevo,
  beforeunload sólo en dirty, importacion asistida con preview y errores
  legibles.
- `bun run build` -> build OK; warning esperado de chunk grande JointJS
  (706 KB minificado, 206 KB gzip).

Las capturas y reportes browser no se conservan en el repo liviano. Se
regeneran con:

```bash
cd app
bun run browser:smoke
bun run visual:audit -- http://127.0.0.1:5173/
bun run visual:deep -- http://127.0.0.1:5173/
```

## Pendientes Inmediatos

1. **Reasignacion manual de enlaces externos derivados** (HU-12.011 fase 2):
   permitir al usuario re-anclar consumo/resultado de un padre a un subproceso
   especifico distinto del primero/ultimo automatico. Requiere extender
   `DerivacionEnlace` con `origen: "automatico" | "manual"` y respetar el
   ancla manual en `refrescarEnlacesExternosDerivados`.
2. **Split de `effect`** en consumo + resultado intermedio (HU-12.011),
   y enlaces estado-especificos.
3. **Plegado parcial avanzado**: extraccion de partes al canvas con doble
   clic (HU-18.004), reanclaje de enlaces al proxy al reinsertar (HU-18.009),
   contador "y N partes mas" con truncado pedagogico (HU-18.005), anidamiento.
4. **Refactor de `app/src/modelo/operaciones.ts`** (~1.050 LOC) en submodulos
   por dominio cuando el archivo se acerque a 1.300 LOC. Hoy todavia legible.
5. **OPL bidireccional plena**: edicion inversa de propiedades estructurales
   (no solo nombres) en panel OPL-ES.
6. **Definir politica de licencia explicita** para codigo propio vs material
   observacional antes de redistribucion publica.
7. **Code splitting de JointJS** cuando el bundle exija reducir el chunk
   inicial (706 KB minificado).
8. **Evaluar IndexedDB** solo cuando los modelos reales superen limites
   practicos de `localStorage`.

## Supuestos

- Para MVP-alpha, snapshots de modelo son suficientemente pequenos y reversibles.
- Para MVP-alpha, `localStorage` estructurado es suficiente; IndexedDB no se
  introduce hasta que haya evidencia de tamano/concurrencia que lo justifique.
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
- El despliegue cubre los cuatro modos canonicos en kernel + OPL + persistencia,
  con markers SVG dedicados por tipo desde `assets/svg/links/structural/`. El
  marker de exhibicion usa `standard.Path` con `fill-rule: evenodd` para los
  sub-triangulos; los demas usan `standard.Polygon` con `refPoints`. Para
  validar visualmente la rotacion del path, abrir un OPD con los cuatro tipos
  desplegados.
- El bundle de JointJS genera warning de tamano (706 KB minificado); no bloquea
  MVP-alpha, pero exigira code splitting al crecer.
- `setup.sh` hardcodea hashes de bundles OPCloud; si OPCloud cambia deploy,
  hay que actualizar hashes antes de regenerar `_local/`/`decompiled/`.

## Prompt Breve De Continuacion

```
Retoma `docs/HANDOFF.md` en `deep-opm-pro`. Estado: MVP-alpha + ciclo de 5
lineas + ronda de refactor estructural integrados en `main`.

Operativo: kernel OPM con descomposicion de procesos, despliegue de objetos
en cuatro modos (agregacion / exhibicion / generalizacion / clasificacion)
con markers SVG canonicos diferenciados, plegado parcial como estado de
Apariencia, timeline lateral para reorden de subprocesos con paralelismo,
OPL diferenciada por modo, importacion asistida, dialogo
Guardar/Descartar/Cancelar global via ConfirmacionProvider y beforeunload
defensivo. Heuristicas geometricas en `modelo/layout.ts`; Inspector partido
en sub-componentes (Entidad, Enlace) con `inspectorStyles.ts`. Cobertura:
106 unit tests, 16 smoke browser, build verde.

Pendientes priorizados: (1) reasignacion manual de enlaces externos derivados;
(2) split de `effect` y enlaces estado-especificos; (3) plegado parcial
avanzado (extraccion, reanclaje, anidamiento); (4) refactor de
operaciones.ts cuando llegue a 1.300 LOC; (5) OPL bidireccional plena.

Reglas vigentes: TipoEnlace flat, plegado parcial es vista no refinamiento,
confirmacion en UI no en store con un unico DialogoConfirmacion via
ConfirmacionProvider, beforeunload solo si dirty, layout puro en
`modelo/layout.ts`, markers estructurales canonicos desde
`assets/svg/links/structural/`. Backlog vivo en
`docs/historias-usuario-v2/`. Briefs del ciclo previo en
`docs/instrucciones-lineas-dev/` (referencia de patron de delegacion).
```
