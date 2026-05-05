# HANDOFF - estado, decisiones, pendientes, riesgos

**Fecha**: 2026-05-05
**Repositorio**: `deep-opm-pro`
**Corte**: MVP-α + ronda 1 (5 líneas + refactor) + ronda 2 (5 líneas + fixes drag/markers + smoke L2 + auditoria de cascadas)
**Commit**: `main` @ `03bea55`

---

## Politica De Handoff Unico

`docs/HANDOFF.md` es la unica memoria de traspaso vigente del proyecto. No se
mantienen handoffs paralelos, fechados ni duplicados. Cada nuevo handoff debe
reemplazar y consolidar el contenido anterior en este mismo archivo.

## Estado Actual

- Workspace de desarrollo del modelador OPM en `app/`, basado en SSOT
  OPM/ISO 19450 y evidencia observacional curada en `opm-extracted/`.
- `docs/historias-usuario-v2/` es el backlog vivo: 48 epicas, 1.117 HU
  canonicas. La cobertura M0 abarca ya la mayoria de EPICA-10/11/12/13/15/
  17/18/20/30/50 mas las HU-SHARED 002/003/006/007/008/009.
- `app/` es Bun + Vite + Preact + Zustand + JointJS OSS, con kernel OPM
  propio. Sin Angular, Firebase ni Rappid.

### Mecanismos de refinamiento

- **EPICA-20** arbol OPD con raiz SD, navegacion desde UI, canvas y OPL
  filtrados por OPD activo.
- **EPICA-12 in-zooming** completo a nivel M0: descomposicion reversible,
  subprocesos iniciales, orden temporal por `y`, paralelismo via misma
  `y` con plantilla OPL "en paralelo", proyeccion derivada de enlaces
  externos al primer/ultimo subproceso, **reasignacion manual** del
  ancla derivada (HU-12.011 fase 2: `DerivacionEnlace.origen` con
  variantes `"automatico" | "manual"`), **split de `effect`** en
  consumo + resultado intermedio con objeto sintetico (HU-12.011 fase
  2: `splitEffectEnPar` atomico y reversible).
- **Despliegue de objetos** en cuatro modos (`agregacion`, `exhibicion`,
  `generalizacion`, `clasificacion`) con OPL diferenciada y markers
  SVG canonicos por tipo desde `assets/svg/links/structural/`. La
  exhibicion se renderiza como tres triangulos anidados (no via
  `standard.Path` con `fill-rule`, que era fragil) para coherencia con
  la rotacion del resto y consistencia de bbox.
- **Plegado parcial** como `apariencia.modoPlegado: "completo" |
  "parcial"`, persistido y togglable desde Inspector.

### Estados de objeto (EPICA-13 M0)

- `Modelo.estados: Record<Id, Estado>` top-level con `id`, `entidadId`,
  `nombre`, `esInicial?`, `esFinal?`. Axioma `≥ 2 estados` aplicado:
  `agregarEstadosObjeto` crea siempre el par inicial; `eliminarEstado`
  rechaza si dejaria 1; `quitarEstadosObjeto` es la salida total.
- Render como capsulas internas en parte inferior del rectangulo del
  objeto (HU-12.009 + JOYAS §10). Designaciones Inicial y Final no
  excluyentes.
- OPL "puede ser X o Y" con designaciones entre parentesis ([OPL-ES D5/
  D6/D8]).
- Inspector con seccion Estados (renombrar inline, eliminar, designar
  Inicial/Final, agregar adicional, quitar todos).
- HU-13.014 (enlaces dirigidos a estado especifico) queda fuera del
  slice; obliga a extender `Enlace.origenId/destinoId` y vive como
  L4-bis en pendientes.

### Multiplicidad numerica de enlace (EPICA-15 parcial)

- `Enlace.multiplicidadOrigen?: string` y `multiplicidadDestino?: string`
  con sintaxis canonica regex `^\d+$|^\*$|^\d+\.\.\d+$|^\d+\.\.N$`.
- Render: etiqueta sobre la linea cerca de cada extremo, Arial 12px.
- OPL: pluralizacion canonica espanola simple (vocal+s, consonante+es,
  z->ces; casos especiales como TODO).
- Inspector: dos inputs validados inline.

### Validaciones metodologicas pasivas (EPICA-1C parcial)

- Modulo `app/src/modelo/validaciones.ts` con funcion pura
  `validarModelo(modelo, opdActivoId): Aviso[]` y cinco reglas canonicas
  cada una con cita SSOT:
  1. `agregacion-misma-esencia` (advertencia) — info <-> fisico mixto
     en agregacion ([V-237]).
  2. `generalizacion-mismo-tipo` (error) — generalizacion entre objeto y
     proceso ([V-239]).
  3. `procedural-no-objeto-objeto` (error) — enlaces procedurales
     objeto<->objeto ([V-239]).
  4. `estructural-sin-duplicar` (advertencia) — pares estructurales
     duplicados.
  5. `subproceso-no-conecta-al-padre` (error) — auto-conexion al
     refinable.
- Componente `ui/PanelAvisos.tsx` montado como tercera fila del
  inspector-pane (debajo de Timeline). Severidad por color (rojo/ambar/
  azul) + click navega al elemento via acciones existentes del store.
- Lente derivada (no caching). Coexiste con `validarFirmaEnlace` que
  sigue siendo bloqueante en creacion.

### OPL bimodal y completitud cross-capa

- Eco OPL con plantillas canonicas SSOT por tipo de enlace; descomposicion
  con cláusulas "en esa secuencia" y "en paralelo"; despliegue diferenciado
  por modo; estados con `puede ser`.
- Cobertura tests: `app/src/opl/generar.test.ts` cubre cada
  `TipoEnlace` y `ModoDespliegueObjeto`; bug previo de coma en clausula
  de secuencia corregido.
- **Tests de exhaustividad cross-capa** en `app/src/completitud.test.ts`:
  `Record<TipoEnlace, true>` y `Record<ModoDespliegueObjeto, true>` y
  `Record<DesignacionEstado, true>` que TS exige completos —
  cualquier extension del union obliga al desarrollador a cubrirla en
  Toolbar dropdown, Inspector menu, LINK_ASSETS, validarFirmaEnlace,
  generarOpl, render, kernel y completitud.

### Drag y embed JointJS

- Las apariencias en un OPD hijo de descomposicion reciben rol persistido
  en metadata: `"contorno"` (refinable de este OPD), `"interno"`
  (creada como contenido del refinamiento) o `"externo"` (proxy de una
  entidad que tambien tiene apariencia en otro OPD).
- `JointCanvas.tsx` aplica `embed` a cells de rol `"interno"` del
  contorno tras cada `resetCells`. JointJS arrastra automaticamente
  embedded children cuando el padre se mueve. Las externas quedan
  libres: no siguen al contorno y no se confinan al bbox.
- `paper.options.restrictTranslate` confina el drag visual de cells
  embedded al bbox del padre (4px lados, 28 top, 8 bottom; coherente
  con padding del clamping kernel).
- Kernel `moverAparienciaPorId` simetrico: cuando se mueve el contorno,
  aplica delta solo a apariencias no-proxy; cuando se mueve una interna,
  clampea al bbox; cuando se mueve una externa, sin restriccion.

### UX de seguridad de datos

- `<ConfirmacionProvider>` global en `App.tsx` con un unico
  `<DialogoConfirmacion>` que intercepta acciones destructivas (Nuevo,
  Cargar local, Cargar demo, Importar JSON) cuando `dirty === true`.
- ESC = Cancelar; click fuera no cierra.
- `beforeunload` activo solo cuando dirty.
- Import asistido en `PersistenciaJson.tsx`: file picker + drop zone +
  preview validado + errores legibles.

### Defaults y consistencia OPM

- Nombres default `"Objeto"` / `"Proceso"` (sin articulo), siguiendo
  SSOT [Glos 3.76]. La OPL emite oraciones canonicas sin doble
  articulo.

### Persistencia y validacion

- `localStorage` estructurado con indice de modelos, guardar/cargar/
  borrar, Ctrl/Cmd+S, reinicio de historial al cargar.
- `hidratarModelo` valida estructura, referencias, firmas OPM,
  visibilidad de endpoints, estados, multiplicidades. Modelos legacy
  cargan sin perdida via campos opcionales con default.

## Artefactos Relevantes

- Instrucciones para agentes: `AGENTS.md`.
- Mapa operativo: `README.md`.
- Aviso de limites y autoria: `NOTICE.md`.
- Estado y memoria operativa: `docs/HANDOFF.md`.
- Briefs de delegacion historicos: `docs/instrucciones-lineas-dev/` (ronda
  1 commiteada; ronda 2 perdida del filesystem en pop de stash, no
  bloqueante).
- Roadmap activo: `docs/roadmap/sprint-0.md`,
  `docs/roadmap/mvp-alpha.md`, `docs/roadmap/mvp-alpha-coverage.md`.
- Backlog vivo: `docs/historias-usuario-v2/`.
- Evidencia OPCloud: `opm-extracted/INDEX.md`, `MODULES.md`,
  `assets/INDEX.md`. Especialmente `opm-extracted/src/app/models/
  consistency/behavioral.rules.ts` para reglas de validacion.
- App: `app/src/modelo/` (incluye `plegado.ts`, `layout.ts`,
  `validaciones.ts`), `app/src/render/jointjs/`, `app/src/store.ts`,
  `app/src/ui/` (Inspector partido en Entidad/Enlace/styles compartidos;
  Dialogo + DialogoConfirmacion + ConfirmacionContext; Timeline;
  PanelAvisos; PersistenciaJson asistido).
- Auditorias visuales regenerables: `app/scripts/in-vivo-test.mjs`,
  `app/scripts/in-vivo-deep-checks.mjs`.

## Decisiones Vigentes

- JointJS OSS como renderer/adaptador; el modelo de dominio vive en
  `app/src/modelo/`.
- Markers de enlaces salen de `assets/svg/links/{procedural,structural}/`
  via `app/src/render/jointjs/linkAssets.ts`. Exhibicion como tres
  polygons anidados (no Path con fill-rule).
- **`TipoEnlace` flat** (sin dimension `naturaleza`); inferencia
  procedural/estructural via funcion pura sobre el tipo.
- **`Modelo.estados` top-level** (no anidado en Entidad), consistente con
  `entidades`/`enlaces`/`opds` y filtrable via lente derivada.
- **`apariencia.modoPlegado` es estado de visualizacion**, no nuevo tipo
  de refinamiento. Default `"completo"` para retro-compatibilidad.
- **Roles de apariencia** se calculan al proyectar y se persisten en
  metadata del cell JointJS — el render y el kernel los consumen para
  decisiones de embed/delta. Distincion basada en el modelo (apariencia
  en otro OPD == proxy externo), no heuristica geometrica.
- **`DerivacionEnlace.origen`** distingue `"automatico"` vs `"manual"`;
  `refrescarEnlacesExternosDerivados` respeta el ancla manual.
- **Multiplicidad como string** con regex canonica fija.
- **Validaciones pasivas** son lente derivada sin caching, complementarias
  a `validarFirmaEnlace` (bloqueante en creacion). Reglas citan SSOT.
- **`<ConfirmacionProvider>` global** monta un unico `DialogoConfirmacion`;
  los consumidores leen `confirmarSiDirty` via context.
- **Drag con embed**: `parent.embed(child)` para internos; JointJS arrastra
  automaticamente. `restrictTranslate` confina al bbox. Kernel persiste
  el delta a no-proxies.
- Undo/redo y dirty state usan snapshots de `Modelo` con profundidad 100.
- `opm-extracted/` se consulta para semantica/clases observables; no se
  copian bloques 1:1.
- `decompiled/` y `_local/` no se versionan; regenerables con
  `bash setup.sh`.
- `hidratarModelo` no debe emitir un Modelo si el JSON falla estructura,
  referencias, firmas OPM, visibilidad de endpoints, sintaxis de
  multiplicidad o axiomas de estados.
- No hay licencia open-source repo-wide; `NOTICE.md` es punto operativo
  hasta decision explicita.

## Verificacion Del Corte

Loop verde de convergencia ejecutado en `app/`:

- `bun run check` -> **163 tests verdes, 990 expects** (vs. 106/641 del
  corte previo). 10 archivos de test.
- `bun run browser:smoke` -> **20/20 verde** (vs. 16 previo). Cobertura
  nueva: reanclaje manual persistente, multiplicidad sincronizada,
  estados M0 con capsulas y OPL, **split de efecto end-to-end** (commit
  `03bea55`).
- `bun run build` -> OK; warning esperado de chunk grande JointJS
  (738 KB minificado, 214 KB gzip — +32 KB vs corte previo por L1-L5
  de ronda 2).

Las capturas y reportes browser no se conservan en el repo liviano. Se
regeneran con:

```bash
cd app
bun run browser:smoke
bun run visual:audit -- http://127.0.0.1:5173/
bun run visual:deep -- http://127.0.0.1:5173/
```

## Pendientes Inmediatos

1. **HU-13.014 (L4-bis enlaces a estado especifico)**: extender
   `Enlace.origenId/destinoId` para aceptar `estado.id` ademas de
   `entidad.id`; render del extremo apuntando a la capsula de estado;
   OPL con cláusula de transicion por par entrada-salida ([OPL-ES TS3]).
2. **Plegado parcial avanzado**: extraccion de partes al canvas
   (HU-18.004), reanclaje de enlaces al proxy al reinsertar (HU-18.009),
   contador "y N partes mas" (HU-18.005), anidamiento.
3. **EPICA-15 enlaces avanzados restantes**: abanicos XOR/O
   (HU-15.008-012), modificadores Evento/NO (HU-15.015-016), invocacion
   con demora (HU-15.020).
4. **EPICA-1C validaciones extendidas**: reglas adicionales de
   `BehaviouralRule` (`InstrumentWithAgentConsistency`,
   `OnlyOneLevelOfInstantiation`, `LegalConsumptionWarning`, etc.) y
   navegacion fina al elemento inválido.
5. **Refactor de `app/src/modelo/operaciones.ts`** (~1.470 LOC) cuando
   se acerque a 1.700 LOC. Separar por dominios: refinamiento,
   estados, derivados, split, validacion de firma.
6. **OPL bidireccional plena**: edicion inversa de propiedades
   estructurales, no solo nombres.
7. **Code splitting JointJS** cuando el bundle exija reducir el chunk
   inicial (738 KB minificado).
8. **Politica de licencia explicita** antes de redistribucion publica.
9. **Evaluar IndexedDB** solo cuando los modelos reales superen limites
   practicos de localStorage.

## Supuestos

- Snapshots de modelo son suficientemente pequenos y reversibles para
  el corte actual; commit inverso queda para etapa posterior si crece.
- localStorage estructurado es suficiente; IndexedDB no se introduce
  hasta que haya evidencia de tamano/concurrencia que lo justifique.
- App funcional sin backend ni auth para el modelado local.
- OPCloud informa UX y comportamiento; SSOT OPM manda en tension
  semantica.

## Riesgos

- `opm-extracted/` es material derivado de ingenieria inversa: usar como
  evidencia, no como fuente copiada.
- Sin licencia repo-wide declarada; redistribucion publica bloqueada.
- Bundle JointJS warning de tamano (738 KB); no bloquea MVP-α pero
  exigira code splitting al crecer.
- `setup.sh` hardcodea hashes de bundles OPCloud; actualizar antes de
  regenerar `_local/`/`decompiled/`.
- Pluralizacion espanola simple en multiplicidad: casos irregulares
  quedan como TODO en `opl/generar.ts`.

## Prompt Breve De Continuacion

```
Retoma `docs/HANDOFF.md` en `deep-opm-pro`. Estado: MVP-α + ronda 1
(5 lineas + refactor) + ronda 2 (5 lineas + fixes drag/markers).

Operativo: kernel OPM con descomposicion + reasignacion manual de
externos derivados + split de efecto en consumo+resultado intermedio,
despliegue de objetos en cuatro modos con markers SVG canonicos
diferenciados, plegado parcial, timeline lateral con paralelismo,
estados M0 con designaciones Inicial/Final y OPL "puede ser X o Y",
multiplicidad numerica con pluralizacion espanola, panel de avisos
metodologicos pasivos con cinco reglas SSOT, importacion asistida,
ConfirmacionProvider global y beforeunload defensivo. Drag con embed
JointJS para mover contorno + internos juntos; externos quedan ancla
visual. Cobertura: 163 unit, 20 smoke, build verde (738 KB). Auditoria
de cascadas cerrada: cada feature integrada en kernel/serializacion/
store, render/OPL y UX, validada cross-capa por completitud.test.ts.

Pendientes priorizados: (1) L4-bis enlaces a estado especifico
(HU-13.014); (2) plegado parcial avanzado (extraccion, reanclaje al
proxy, contador, anidamiento); (3) EPICA-15 restantes (XOR/O,
Evento/NO, invocacion con demora); (4) reglas adicionales de
BehaviouralRule en validaciones; (5) refactor de operaciones.ts
cuando llegue a 1.700 LOC; (6) OPL bidireccional plena.

Reglas vigentes: TipoEnlace flat, Modelo.estados top-level,
modoPlegado como vista, roles de apariencia (contorno/interno/externo)
persistidos en metadata, DerivacionEnlace.origen automatico/manual,
multiplicidad como string canonico, validaciones pasivas sin caching,
ConfirmacionProvider global, beforeunload solo si dirty, layout puro
en modelo/layout.ts, markers estructurales canonicos. Backlog vivo en
`docs/historias-usuario-v2/`. Briefs ronda 1 en
`docs/instrucciones-lineas-dev/` como referencia metodologica.
```
