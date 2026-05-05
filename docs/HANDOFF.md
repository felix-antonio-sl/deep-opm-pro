# HANDOFF - estado, decisiones, pendientes, riesgos

**Fecha**: 2026-05-05
**Repositorio**: `deep-opm-pro`
**Corte**: MVP-α + ronda 1 + ronda 2 + ronda 3 (consolidación orgánica de L1+L2+L4+L5 sobre `main`)
**Commit**: `main` @ `dfef5e8`

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

### Plegado parcial avanzado (L5 ronda 3, EPICA-18)

- `Apariencia.parteExtraidaDe?: { padreAparienciaId, parteEntidadId }`
  identifica apariencias creadas por extraccion al canvas.
- `plegado.ts` con operaciones puras `extraerParteDePlegado`,
  `reinsertarParteEnPlegado`, `contarPartesOcultas`, `partesExtraidasEn`,
  `filasPlegadoParcial` (HU-18.004-006, HU-18.009, HU-18.010).
- Render: lista compacta interna del padre con marca visual
  (cursiva, tachado, color desaturado, opacidad) en filas extraidas;
  contador "y N partes mas" cuando N > umbral 3; proxy visual como
  linea gris punteada entre apariencia extraida y rectangulo padre.
- OPL: plantilla de agregacion enumera hasta 3 partes con truncado
  pedagogico "y N partes mas".
- UX: doble clic sobre fila + boton explicito "Extraer al canvas" en
  Inspector; "Reinsertar al padre" para apariencias extraidas.

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
- **HU-13.014, HU-13.015 y HU-13.018 cerradas en ronda 3** con firma
  `ExtremoEnlace` (ver siguiente seccion).

### Firma ExtremoEnlace para enlaces a estado especifico (L1 ronda 3)

- `ExtremoEnlace = { kind: "entidad" | "estado"; id }` reemplaza Id plano
  en `Enlace.origenId/destinoId`. Helpers en `app/src/modelo/extremos.ts`:
  `entidadIdDeExtremo`, `entidadDeExtremo`, `estadoDeExtremo`,
  `extremoEntidad`, `extremoVisibleEnOpd`, `normalizarExtremo`,
  `extremoApuntaAEntidad`.
- `validarFirmaEnlace` rechaza extremos `kind=estado` en enlaces
  estructurales con cita `[V-237]` `[V-239]`. Regla pasiva
  `estructural-no-acepta-extremo-estado` complementa el bloqueo
  creacional.
- Render JointJS: `resolverEndpointVisual` recibe `ExtremoEnlace` y
  devuelve `EndpointVisual` con campo `punto` cuando `kind=estado`,
  anclando el extremo al centro horizontal de la capsula correspondiente
  (helper `puntoCapsulaEstado`); mantiene `proxy` para apariencias
  plegadas. `endpointJoint` produce coordenadas absolutas para JointJS
  source/target.
- Inspector: selector "Apuntar a estado" en `InspectorEnlace` para
  enlaces con entidad endpoint con >=2 estados.
- OPL: plantillas `[OPL-ES TS3]` "P cambia O de e1 a e2" cuando consumo
  + resultado comparten objeto+proceso con `kind=estado`; `TS4` (solo
  consumo a estado) y `TS5` (solo resultado a estado) cubren los demas
  casos.
- Hidratacion lossless legacy: deserializacion acepta string id y aplica
  `normalizarExtremo` a `kind=entidad`. `completitud.test.ts` extendido
  con `Record<ExtremoKind, true>` para forzar exhaustividad cross-capa.

### Abanicos logicos O/XOR scaffolding (L2 ronda 3)

- Tipos `Abanico = { id, opdId, puertoEntidadId, operador: "O"|"XOR",
  enlaceIds[] }` y `Modelo.abanicos: Record<Id, Abanico>` definidos en
  `tipos.ts` (commit L1 incluyo tipos como aditivos).
- `abanicos.ts` con operaciones puras: `formarAbanico`,
  `agregarRamaAAbanico`, `quitarRamaDeAbanico`,
  `alternarOperadorAbanico`, `disolverAbanico`,
  `detectarPuertoCompartido`. Invariantes: `enlaceIds.length >= 2` con
  auto-disolucion; mismo origen kind+id; tipos homogeneos en cluster.
- Markers SVG canonicos en `assets/svg/links/logical/{xor,or}.svg` (HU-15.010,
  HU-15.011) - **integracion render/UI/OPL pendiente** (ver
  pendientes inmediatos).
- Cita SSOT: `[V-239]` axiomas operadores logicos; `[Glos 3.60]`
  enlaces.

### Multiplicidad numerica de enlace (EPICA-15 parcial)

- `Enlace.multiplicidadOrigen?: string` y `multiplicidadDestino?: string`
  con sintaxis canonica regex `^\d+$|^\*$|^\d+\.\.\d+$|^\d+\.\.N$`.
- Render: etiqueta sobre la linea cerca de cada extremo, Arial 12px.
- OPL: pluralizacion canonica espanola simple (vocal+s, consonante+es,
  z->ces; casos especiales como TODO).
- Inspector: dos inputs validados inline.

### Validaciones metodologicas pasivas (EPICA-1C, ronda 3 L4)

- Modulo `app/src/modelo/validaciones.ts` con funcion pura
  `validarModelo(modelo, opdActivoId): Aviso[]` y **diez reglas
  canonicas** cada una con cita SSOT obligatoria en `Aviso.citaSSOT`:
  1. `agregacion-misma-esencia` (advertencia) — info <-> fisico mixto
     en agregacion ([V-237]).
  2. `generalizacion-mismo-tipo` (error) — generalizacion entre objeto
     y proceso ([V-239]).
  3. `procedural-no-objeto-objeto` (error) — enlaces procedurales
     objeto<->objeto ([V-239]).
  4. `estructural-sin-duplicar` (advertencia) — pares estructurales
     duplicados.
  5. `subproceso-no-conecta-al-padre` (error) — auto-conexion al
     refinable.
  6. `agente-requiere-objeto-fisico` (error) — `[Glos 3.3]` `[Glos 3.39]`
     (L4 ronda 3).
  7. `proceso-sin-entrada-ni-salida` (advertencia) — `[Glos 3.58]`
     `[V-115]` `[V-239]` (L4 ronda 3).
  8. `instrumento-y-agente-simultaneos` (advertencia) — `[Glos 3.3]`
     `[Glos 3.30]` `[V-239]` (L4 ronda 3).
  9. `solo-un-nivel-de-instanciacion` (advertencia) — `[Glos 3.28]`
     `[V-239]` (L4 ronda 3).
  10. `consumo-doble-mismo-objeto` (advertencia) — `[V-43]` `[V-239]`
     (L4 ronda 3).
  11. `estructural-no-acepta-extremo-estado` (error) — `[V-237]`
     `[V-239]` (L1 ronda 3).
- Componente `ui/PanelAvisos.tsx` con cita SSOT como chip clickeable
  (despliega detalle), boton "Revalidar" para rerun manual liviano,
  filtros por severidad, navegacion al elemento invalido (HU-1C.013-019).
- Lente derivada reactiva sin caching. Coexiste con
  `validarFirmaEnlace` que sigue siendo bloqueante en creacion.

### OPL bimodal y completitud cross-capa

- Eco OPL con plantillas canonicas SSOT por tipo de enlace; descomposicion
  con cláusulas "en esa secuencia" y "en paralelo"; despliegue diferenciado
  por modo; estados con `puede ser`; transicion `[OPL-ES TS3]`.
- Cobertura tests: `app/src/opl/generar.test.ts` cubre cada
  `TipoEnlace`, `ModoDespliegueObjeto`, transicion con `kind=estado`.
- **Tests de exhaustividad cross-capa** en `app/src/completitud.test.ts`:
  `Record<TipoEnlace, true>`, `Record<ModoDespliegueObjeto, true>`,
  `Record<DesignacionEstado, true>`, `Record<ExtremoKind, true>` que TS
  exige completos — cualquier extension del union obliga al desarrollador
  a cubrirla en Toolbar dropdown, Inspector menu, LINK_ASSETS,
  validarFirmaEnlace, generarOpl, render, kernel y completitud.

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
  con padding del clamping kernel). El callback **no descuenta**
  `cellBBox.width/height` porque JointJS aplica ese descuento
  internamente (`Element.mjs:130-131`); el doble descuento previo
  bloqueaba drag horizontal/vertical de subprocesos embebidos
  (regresion arreglada en commit `86df1f3`, smoke de regresion en
  `opm-smoke.spec.ts`).
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
  visibilidad de endpoints, estados, multiplicidades, abanicos,
  apariencias extraidas, kind de extremos. Modelos legacy (string id en
  endpoints) cargan via `normalizarExtremo` con default
  `kind="entidad"`.

### Auditoria de avance HU (commit `09ed4fc`)

- Dashboard automatico en `docs/roadmap/hu-progress.{html,json,md}` con
  ledger en `docs/roadmap/hu-progress-evidence.json`.
- Generador en `docs/historias-usuario-v2/tools/progress-dashboard.mjs`
  escanea fuentes y matchea reglas automaticas de avance HU.
- Comando: `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real`
  reescribe el ledger con avance real; sin flag solo regenera reportes.

### Skill local lineas-paralelas

- SSOT en `~/kora/artifacts/skills/dev/lineas-paralelas/SKILL.md`
  (URN `urn:dev:artefacto:lineas-paralelas`). Vector PMI x LFS:
  pi=2, mu=0, xi=1, lambda=0, phi=1, sigma=[1,1,1,1,0]. Forma
  material `habilidad`.
- Despliegue exclusivo en este repo: `.codex/skills/lineas-paralelas/`,
  `.opencode/skills/lineas-paralelas/` (versionados) y
  `.claude/skills/lineas-paralelas/` (en disco; `.claude/` ignorado por
  `.gitignore`).
- Genera `docs/instrucciones-lineas-dev/<ronda>/` con README maestro,
  N briefs por linea y prompt generico de asignacion. Replica el patron
  observable en ronda 3.
- Regenerar tras cambios al SKILL.md fuente: `kora transmute --target
  {claude-code,codex,opencode} --agent dev/lineas-paralelas` + copia
  manual al repo.

## Artefactos Relevantes

- Instrucciones para agentes: `AGENTS.md`.
- Mapa operativo: `README.md`.
- Aviso de limites y autoria: `NOTICE.md`.
- Estado y memoria operativa: `docs/HANDOFF.md`.
- Briefs de delegacion historicos: `docs/instrucciones-lineas-dev/`
  (ronda 1 commiteada, ronda 2 perdida, ronda 3 commiteada en
  `dfef5e8`).
- Roadmap activo: `docs/roadmap/sprint-0.md`,
  `docs/roadmap/mvp-alpha.md`, `docs/roadmap/mvp-alpha-coverage.md`.
- Auditoria de avance HU v2: `docs/roadmap/hu-progress.{html,md,json}`,
  ledger `docs/roadmap/hu-progress-evidence.json`.
- Backlog vivo: `docs/historias-usuario-v2/`.
- Evidencia OPCloud: `opm-extracted/INDEX.md`, `MODULES.md`,
  `assets/INDEX.md`. Especialmente `opm-extracted/src/app/models/
  consistency/behavioral.rules.ts` para reglas de validacion.
- App: `app/src/modelo/` (incluye `extremos.ts`, `abanicos.ts`,
  `plegado.ts`, `layout.ts`, `validaciones.ts`),
  `app/src/render/jointjs/`, `app/src/store.ts`, `app/src/ui/`
  (Inspector partido en Entidad/Enlace/styles compartidos; Dialogo +
  DialogoConfirmacion + ConfirmacionContext; Timeline; PanelAvisos;
  PersistenciaJson asistido).
- Auditorias visuales regenerables: `app/scripts/in-vivo-test.mjs`,
  `app/scripts/in-vivo-deep-checks.mjs`.

## Decisiones Vigentes

- JointJS OSS como renderer/adaptador; el modelo de dominio vive en
  `app/src/modelo/`.
- Markers de enlaces salen de `assets/svg/links/{procedural,structural,
  logical}/` via `app/src/render/jointjs/linkAssets.ts`. Exhibicion
  como tres polygons anidados (no Path con fill-rule).
- **`TipoEnlace` flat** (sin dimension `naturaleza`); inferencia
  procedural/estructural via funcion pura sobre el tipo.
- **`Modelo.estados` top-level** (no anidado en Entidad), consistente con
  `entidades`/`enlaces`/`opds` y filtrable via lente derivada.
- **`Modelo.abanicos` top-level** consistente con `Modelo.estados`;
  `abanicos.ts` es la unica fuente de mutacion.
- **`apariencia.modoPlegado` es estado de visualizacion**, no nuevo tipo
  de refinamiento. Default `"completo"` para retro-compatibilidad.
- **`apariencia.parteExtraidaDe` para apariencias extraidas** del
  plegado parcial; modelo no cambia al reinsertar (los enlaces
  refieren por entidad, no por apariencia).
- **Roles de apariencia** se calculan al proyectar y se persisten en
  metadata del cell JointJS — el render y el kernel los consumen para
  decisiones de embed/delta. Distincion basada en el modelo (apariencia
  en otro OPD == proxy externo), no heuristica geometrica.
- **`ExtremoEnlace` etiquetado** (no string fundido); solo enlaces
  procedurales aceptan `kind=estado`. Estructurales rechazan via
  `validarFirmaEnlace` y regla pasiva `estructural-no-acepta-extremo-
  estado`. Hidratacion lossless de modelos legacy.
- **`DerivacionEnlace.origen`** distingue `"automatico"` vs `"manual"`;
  `refrescarEnlacesExternosDerivados` respeta el ancla manual y
  preserva `kind` en proyeccion al OPD hijo.
- **Multiplicidad como string** con regex canonica fija.
- **Validaciones pasivas** son lente derivada reactiva sin caching,
  complementarias a `validarFirmaEnlace` (bloqueante en creacion).
  Reglas citan SSOT obligatoria en `Aviso.citaSSOT`.
- **`<ConfirmacionProvider>` global** monta un unico `DialogoConfirmacion`;
  los consumidores leen `confirmarSiDirty` via context.
- **Drag con embed**: `parent.embed(child)` para internos; JointJS arrastra
  automaticamente. `restrictTranslate` confina al bbox interior del
  padre con padding, sin descontar `cellBBox` (JointJS lo descuenta
  internamente). Kernel persiste el delta a no-proxies.
- Undo/redo y dirty state usan snapshots de `Modelo` con profundidad 100.
- `opm-extracted/` se consulta para semantica/clases observables; no se
  copian bloques 1:1.
- `decompiled/` y `_local/` no se versionan; regenerables con
  `bash setup.sh`.
- `hidratarModelo` no debe emitir un Modelo si el JSON falla estructura,
  referencias, firmas OPM, visibilidad de endpoints, sintaxis de
  multiplicidad, axiomas de estados, abanicos, apariencias extraidas
  o kind de extremos.
- No hay licencia open-source repo-wide; `NOTICE.md` es punto operativo
  hasta decision explicita.

## Verificacion Del Corte

Loop verde local de convergencia ejecutado en `app/`:

- `bun run check` -> **209 tests verdes, 1.160 expects** (vs. 163/990 del
  corte previo), 11 archivos de test (incluye `abanicos.test.ts`
  nuevo).
- `bun run build` -> OK; warning esperado de chunk grande JointJS
  (>500 KB minificado, ~218 KB gzip).
- `bun run browser:smoke` -> 17/21 verde local; **4 tests rotos como
  regresion preexistente de L4** (`8c82dcb`): `descompone proceso y
  navega al OPD hijo`, `mantiene canvas e inspector en columnas
  separadas tras recalculos`, `redistribuye consumo al primer
  subproceso y resultado al ultimo`, `reancla consumo derivado y
  conserva el ancla manual al reordenar`. Smoke pre-L4 (`bb16b24`):
  20/20 verde. Diagnostico pendiente.

Las capturas y reportes browser no se conservan en el repo liviano. Se
regeneran con:

```bash
cd app
bun run browser:smoke
bun run visual:audit -- http://127.0.0.1:5173/
bun run visual:deep -- http://127.0.0.1:5173/
```

## Pendientes Inmediatos

1. **L3 ronda 3 (modificadores e invocacion)**: HU-15.015 evento,
   HU-15.016 NO, HU-15.018 probabilidad, HU-15.019 invocacion entre
   procesos, HU-11.027 base de `Modificador = "condicion" | "evento" |
   "no"`. **Requiere base post-L1 limpia (ya disponible en
   `dfef5e8`)**. Ningun trabajo previo en disco; abrir desde cero
   sobre `main`.
2. **L2 ronda 3 integracion funcional**: tipos `Abanico` y validacion
   ya estan; faltan la **integracion render/UI/OPL**: conector visual
   XOR/O cerca del puerto, deteccion automatica al conectar segunda
   rama, OPL distinguida "exactamente uno de" / "al menos uno de",
   inspector con seccion Abanico y operador toggle. Brief vigente:
   `docs/instrucciones-lineas-dev/ronda3/linea-2-abanicos-logicos.md`.
3. **Smoke regresion L4**: diagnosticar por que 4 smoke tests cayeron
   con commit `8c82dcb` (validaciones extendidas + cambios `store.ts`
   + `PanelAvisos.tsx`). Probable culpa: el cambio de layout de
   inspector-pane afecta la deteccion de elementos por Playwright. Una
   vez diagnosticado, decidir si arreglar test o ajustar implementacion.
4. **HU-15.013 (L4-bis)**: ramas de abanico a estados distintos.
   Consume L1 (firma `ExtremoEnlace`) + L2 (operaciones de abanico) y
   por eso queda como continuacion natural de L2.
5. **HU-15.005 / HU-15.007**: etiqueta de ruta de texto libre sobre
   rama a estado. Depende de HU-13.014 (cerrada) y HU-15.013.
6. **EPICA-18 nesting**: anidamiento de plegado parcial (Q18.1) fuera
   del slice L5; queda para ronda 4.
7. **Refactor de `app/src/modelo/operaciones.ts`** cuando se acerque a
   1.700 LOC. Modularidad por dominio ya iniciada con `extremos.ts`,
   `abanicos.ts`, `plegado.ts`. Continuar separando por
   refinamiento, estados, derivados, split.
8. **OPL bidireccional plena**: edicion inversa de propiedades
   estructurales, no solo nombres.
9. **Code splitting JointJS** cuando el bundle exija reducir el chunk
   inicial (>500 KB minificado).
10. **Politica de licencia explicita** antes de redistribucion publica.
11. **Evaluar IndexedDB** solo cuando los modelos reales superen limites
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
- Bundle JointJS warning de tamano (>500 KB); no bloquea MVP-α pero
  exigira code splitting al crecer.
- 4 smoke tests rotos como deuda visible de L4. Compromete validacion
  end-to-end de descomposicion, layout inspector, redistribucion de
  consumo y reanclaje derivado.
- `setup.sh` hardcodea hashes de bundles OPCloud; actualizar antes de
  regenerar `_local/`/`decompiled/`.
- Pluralizacion espanola simple en multiplicidad: casos irregulares
  quedan como TODO en `opl/generar.ts`.

## Prompt Breve De Continuacion

```
Retoma `docs/HANDOFF.md` en `deep-opm-pro`. Estado: MVP-α + ronda 1 +
ronda 2 + ronda 3 (consolidacion organica L1+L2(parcial)+L4+L5 +
hotfix doble descuento de drag).

Operativo: kernel OPM con descomposicion + reasignacion manual de
externos derivados + split de efecto + plegado parcial avanzado
(extraccion al canvas, reanclaje al proxy, contador "y N partes mas")
+ firma ExtremoEnlace para enlaces a estado especifico (HU-13.014/015/018
cerrados con plantillas OPL TS3-TS5) + scaffolding de abanicos logicos
(tipos definidos, operaciones puras en abanicos.ts, falta integracion
render/UI/OPL) + 11 reglas de validacion BehaviouralRule pasiva con
citas SSOT obligatorias + dashboard de avance HU automatico.

Cobertura: 209 unit, 1.160 expects, 11 files de test; smoke 17/21
(4 rotos como deuda L4 a diagnosticar); build verde.

Pendientes priorizados: (1) L3 modificadores e invocacion sobre base
post-L1 limpia; (2) L2 integracion funcional render/UI/OPL de
abanicos; (3) diagnostico de smoke regresion L4; (4) HU-15.013 ramas
a estados como continuacion L2; (5) refactor modular continuado en
operaciones.ts; (6) OPL bidireccional plena.

Reglas vigentes: TipoEnlace flat, Modelo.estados/abanicos top-level,
modoPlegado y parteExtraidaDe como vista de Apariencia, ExtremoEnlace
etiquetado solo procedural acepta kind=estado, roles de apariencia
(contorno/interno/externo) persistidos en metadata,
DerivacionEnlace.origen automatico/manual preservando kind,
multiplicidad como string canonico, validaciones pasivas reactivas sin
caching con citaSSOT obligatoria, ConfirmacionProvider global,
beforeunload solo si dirty, drag con embed JointJS sin doble descuento
de cellBBox, layout puro en modelo/layout.ts, markers estructurales y
logicos canonicos. Backlog vivo en `docs/historias-usuario-v2/`. Briefs
ronda 3 en `docs/instrucciones-lineas-dev/ronda3/` para reanudar L2/L3.
Skill local urn:dev:artefacto:lineas-paralelas desplegada en
.{codex,opencode}/skills/ y SSOT en ~/kora/artifacts/skills/dev/.
```
