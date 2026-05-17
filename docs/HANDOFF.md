# HANDOFF — Estado operativo del modelador OPM

**Fecha**: 2026-05-17
**Repositorio**: `deep-opm-pro`
**Rama**: `main`
**Último corte funcional**: `495cc19 refactor(ui): extrae viewmodel de toolbar base`
**Corte**: Refactorizacion total, Corte 1 cerrado: `app/src/ui` ya no importa `useOpmStore`; las superficies UI consumen `app/src/app/viewmodels/` como frontera temporal sobre Zustand.

## Política De Handoff Único

`docs/HANDOFF.md` es la única memoria de traspaso vigente del proyecto. No crear handoffs paralelos. Los reportes/capturas regenerables viven ignorados por git; la memoria versionada queda aquí.

## Fuentes Normativas Y Técnicas

- Brief activo del corte: `docs/instrucciones-lineas-dev/ronda22/refactor-ux-ifml.md`.
- SSOT OPM: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`.
- Evidencia OPCloud preferente: `opm-extracted/` antes de `decompiled/`.
- Canon visual local: `docs/JOYAS.md` y `assets/svg/`.
- JointJS OSS: usar documentación oficial viva cuando se toque JointJS.

## Estado Actual

### Refactorizacion Total — Corte 1 ViewModels UI Cerrado — 2026-05-17

La rama `main` queda sincronizada con `origin/main` tras `495cc19`.

Resultado arquitectonico:

- `rg "useOpmStore" app/src/ui -l` no reporta archivos.
- Los componentes UI siguen renderizando y gestionando interaccion visual, pero ya no leen Zustand directamente.
- `app/src/app/viewmodels/` actua como fachada temporal sobre el store para pantallas, dialogos, toolbar, mapa, command palette, asistente, arbol, inspectors y chrome.
- No se cambio semantica OPM, textos visibles, layout intencional ni formato de persistencia.
- Se mantuvo JointJS como adapter visual; el corte no movio proyeccion ni geometria.

Commits atomicos recientes de cierre:

- `495cc19 refactor(ui): extrae viewmodel de toolbar base`
- `3d67c08 refactor(ui): extrae viewmodel de barra contextual`
- `4f1c273 refactor(ui): extrae viewmodel de command palette`
- `b70fac1 refactor(ui): extrae viewmodel de mapa sistema`
- `3907535 refactor(ui): extrae viewmodel de menu principal`
- `7911635 refactor(ui): extrae viewmodel de asistente`
- `cd002e3 refactor(ui): extrae viewmodel de capturador bugs`
- `5662d9f refactor(ui): extrae viewmodel de arbol opd`
- `6a6f843 refactor(ui): extrae viewmodel de toolbar creacion`
- `951eb7b refactor(ui): extrae viewmodel de pantalla inicio`
- `d278715 refactor(ui): extrae viewmodel de plantillas`
- `c26c58b refactor(ui): extrae viewmodel de gestion opd`

Validacion acumulada del cierre de Corte 1:

```bash
cd app && bun run typecheck
cd app && bun run build
cd app && bun test src/ui/BarraHerramientasElemento.test.ts
cd app && bun test src/ui/CommandPalette.test.ts
cd app && bun test src/render/jointjs/mapaSistema.test.ts
cd app && bun test src/store/uiPanel.test.ts src/ui/toolbar/ToolbarCreacion.test.ts
cd app && bun run browser:smoke -- e2e/15-superficie-contextual.spec.ts
cd app && bun run browser:smoke -- e2e/12-command-palette.spec.ts
cd app && bun run browser:smoke -- e2e/04-arbol-y-pestanas.spec.ts
cd app && bun run browser:smoke -- e2e/12-toolbar-overflow.spec.ts e2e/02-canvas-y-render.spec.ts e2e/21-estado-vacio-opm.spec.ts
```

Resultados observados:

```text
typecheck OK
build OK
BarraHerramientasElemento: 53 pass / 0 fail
CommandPalette: 4 pass / 0 fail
mapaSistema: 13 pass / 0 fail
uiPanel + ToolbarCreacion: 4 pass / 0 fail
superficie contextual: 11 passed
command palette: 5 passed
arbol y pestanas: 6 passed
toolbar + canvas + estado vacio: 25 passed
```

Siguiente corte normativo recomendado:

- Entrar a Corte 2 del plan: puertos de aplicacion sobre el store existente.
- No hacer otra ronda de viewmodels cosmeticos: el valor ahora esta en que viewmodels grandes dependan de puertos pequenos (`ModelCommandPort`, `SelectionPort`, `OplPort`, `PersistencePort`) en vez de `useOpmStore`.
- Primer candidato pragmatico: consolidar `app/src/app/ports/` existente y migrar 1-2 viewmodels de alto trafico (`toolbarCreacionViewModel`, `jointCanvasViewModel` o `tablaEnlacesViewModel`) a puertos ya creados, sin segundo store global.

### Post-Brief HODOM Denso — Foco De Estados OPM — 2026-05-16

La rama `main` queda preparada para sincronizarse con `origin/main` tras `993e1f9`, que corrige la precisión OPM del foco temporal iniciado en `daa3bc3`:

- `TablaEnlaces` ya no degrada extremos `estado` a la entidad contenedora al construir `idsResaltadosTemporales`; conserva el `estado.id` cuando el enlace apunta a una cápsula.
- La proyección JointJS agrega halo `selection-halo` con `targetKind: "estado"` sobre la cápsula interna visible, usando geometría compartida `rectCapsulaEstado`.
- Si el estado no está visible por plegado parcial o supresión, el foco degrada al objeto contenedor para evitar selecciones invisibles.
- Los halos de entidad existentes quedan estables: metadata previa sin `targetKind` para no romper consumidores actuales.
- E2E nuevo cubre el flujo real: filtro en tabla sobre enlace `s-pendiente -> Aprobar`, botón `Resaltar filtrados`, enlace resaltado, halo en `s-pendiente`, sin halo falso en `o-pedido`.

Validación del corte:

```bash
cd app && bun run typecheck
cd app && bun test src/render/jointjs/proyeccion.test.ts src/render/jointjs/composers/halos.test.ts
# 59 pass / 0 fail
cd app && bun run browser:smoke -- e2e/11-beta1-tabla-enlaces.spec.ts
# 6 passed
cd app && bun run lint
cd app && bun run test
# 1373 pass / 0 fail
cd app && bun run build
cd app && bun run browser:smoke
# 193 passed / 0 fail
```

### Post-Brief HODOM Denso — 2026-05-16

La rama `main` queda preparada para sincronizarse con `origin/main` tras `daa3bc3`, que conecta `TablaEnlaces` con foco visual en el canvas:

- Búsqueda textual por origen, destino, etiqueta, tipo, familia y OPD.
- Filtro por familia `Procedurales` / `Estructurales` / `Todos`.
- Contador accesible `filtrados/total` con desglose procedurales/estructurales y visibles en el OPD activo.
- Botón de limpieza de filtros.
- Botón `Resaltar filtrados` que no cierra la tabla, cambia al primer OPD relevante si el filtro no tiene enlaces visibles en el OPD actual y resalta enlaces + extremos como subgrafo temporal.
- `idsResaltadosTemporales` vuelve a participar en la proyección JointJS, sin contaminar la selección real del store.
- Smokes específicos sobre modelo mixto de 10 enlaces para cubrir búsqueda + familia + foco visual sin romper edición, eliminación ni navegación existente.

Prueba directa con HODOM v1.1 real:

```bash
# Cargado por browser contra http://127.0.0.1:5173/
# Contador inicial: 113 de 113 enlaces · 83 procedurales · 30 estructurales · 21 visibles en SD-0 — Establecimiento HODOM
# Búsqueda "Paciente": 19 enlaces resaltados · 7 visibles en SD-0 — Establecimiento HODOM
# Foco canvas: 5 enlaces con wrapper resaltado + 4 halos de extremos
# pageErrors: []
```

Validación del corte:

```bash
cd app && bun run typecheck
cd app && bun run browser:smoke -- e2e/11-beta1-tabla-enlaces.spec.ts
# 5 passed
cd app && bun run lint
cd app && bun run test
# 1371 pass / 0 fail
cd app && bun run build
cd app && bun run browser:smoke
# 192 passed / 0 fail
cd app && node scripts/in-vivo-test.mjs http://127.0.0.1:5173/
# OK=57 FAIL=0 WARN=0 INFO=2
```

### UX/IFML Ronda 22 — 2026-05-16

La rama `main` quedó sincronizada con `origin/main` tras el commit `08b3753`, que reemplaza la sonda in-vivo obsoleta por una auditoría alineada a la UI actual:

- Carga/bienvenida y mini-glosa OPM.
- Chrome IFML desktop: `ViewPoint` default, clusters `Modelar`/`Conectar`/`Ayuda`, menú principal y `CommandPalette`.
- Ejemplo canónico `Cafetera Domestica`: JointJS, OPL y SSOT visual (`#fdffff`, `#70E483`, `#3BC3FF`, 135x60).
- Overlay feedback: `BarraHerramientasElemento`, `ErrorBadge`, `HoverTooltip`, `FlashToast`.
- Conexión por `MenuTipoEnlace` y submodo accesible `conectando`.
- Import JSON multi-OPD y navegación del árbol.
- Mobile review 390x844: tabs `Canvas`/`OPDs`/`OPL`/`Issues`, sin overflow horizontal.

Resultado de la última auditoría:

```bash
cd app
node scripts/in-vivo-test.mjs http://127.0.0.1:5173/
# OK=57 FAIL=0 WARN=0 INFO=2
# pageerror=0 console.error=0 console.warn=0 requestfailed=0
```

El script genera `docs/REPORTE-EJECUTIVO.md` y `app/test-results/in-vivo/`, ambos ignorados por git según `.gitignore`.

## Validación Reciente

Ejecutado sobre el estado actual (`495cc19`):

```bash
cd app && bun run typecheck
cd app && bun run build
cd app && bun run browser:smoke -- e2e/12-toolbar-overflow.spec.ts e2e/02-canvas-y-render.spec.ts e2e/21-estado-vacio-opm.spec.ts
```

Resultado:

```text
typecheck OK
build OK
25 browser smoke passed / 0 fail
```

Última auditoría in-vivo completa sigue siendo la de `08b3753`/`63dd213`; este corte no cambió el script in-vivo ni la superficie global de chrome, solo la frontera UI -> viewmodel.

Validación HODOM v1.1 realizada sobre el corte funcional previo de foco canvas:

```bash
cd app
bun -e 'import { readFileSync } from "node:fs"; import { hidratarModelo } from "./src/serializacion/json"; import { proyectarModeloAJointCells } from "./src/render/jointjs/proyeccion"; const raw = readFileSync("/home/felix/projects/hd-hsc-os/docs/models/opm-hodom-bundle-v1.1.json", "utf8"); const hidratado = hidratarModelo(raw); if (!hidratado.ok) throw new Error(hidratado.error); const modelo = hidratado.value; const proyecciones = Object.keys(modelo.opds).map((opdId) => ({ opdId, cells: proyectarModeloAJointCells(modelo, opdId, null, null).length })); console.log(JSON.stringify({ entidades: Object.keys(modelo.entidades).length, enlaces: Object.keys(modelo.enlaces).length, opds: Object.keys(modelo.opds).length, proyecciones }, null, 2));'
# entidades=46 enlaces=113 opds=5
# opd-sd0=43 cells, opd-sd1=97, opd-sd1-2=38, opd-eq-salud-hd=19, opd-cap-op-hd=15
```

## Commits Relevantes Del Cierre UX/IFML

- `993e1f9 feat(ux): enfoca extremos de estado filtrados`
- `63dd213 docs: registra foco hodom en canvas`
- `96d5097 feat(ux): filtra tabla de enlaces densa`
- `daa3bc3 feat(ux): enfoca enlaces filtrados en canvas`
- `08b3753 test(ux): actualiza auditoria in vivo`
- `de67395 refactor(a11y): unifica fuente de avisos`
- `84a96f2 test(a11y): cubre ciclo de feedback`
- `5ac1319 fix(a11y): ajusta contraste de warning`
- `d9b85c1 fix(a11y): respeta reduced motion`
- `38762ea fix(a11y): describe hover tooltip al foco`
- `15d9077 fix(a11y): anuncia cambios de viewpoint`
- `f5486db fix(a11y): navega tabs del inspector con flechas`
- `f10ce76 refactor(ifml): tipa eventos de acciones contextuales`
- `76b1911 feat(a11y): permite conectar por teclado`
- `d7c2c1d feat(ux): guia conexion por anchors`
- `97abbb8 feat(ifml): declara contexto canonico del workbench`
- `976ef1d refactor(ux): ordena menu principal por intencion`

## Workspace No Consolidado

Hay artefactos no trackeados en `docs/audits/`, `docs/bugs/` y `docs/instrucciones-lineas-dev/ronda22/`. Son insumos/artefactos de trabajo previos; no promoverlos sin una decisión explícita de alcance.

También pueden existir salidas regenerables ignoradas:

- `docs/REPORTE-EJECUTIVO.md`
- `app/test-results/in-vivo/`
- `app/dist/`

## Pendientes Post-Brief Y Refactorizacion

El brief UX/IFML queda cerrado para el corte auditado. Los cortes de modelos densos ya mejoraron `TablaEnlaces`, conectaron sus filtros con foco visual en canvas y corrigieron el foco de extremos `estado`.

Pendiente inmediato de refactorizacion:

- Corte 2: puertos de aplicacion sobre store existente.
- Consolidar contratos en `app/src/app/ports/` sin duplicar estado ni introducir dependency injection pesada.
- Migrar gradualmente viewmodels grandes para que dependan de puertos pequenos y no del store completo.
- Mantener `OpmStore` como fachada compatible mientras se reduce su contrato efectivo.

Pendientes funcionales a retomar despues o como pressure tests:

- **Mini-mapa / mapa del sistema más operativo**: navegación visual para modelos densos.
- **Import/export OPX real**: interoperabilidad más allá del JSON local.
- **Modelos densos HODOM**: profundizar filtros de canvas, mini-mapa y performance perceptual con 5 OPDs y 113 enlaces.
- **Enlaces OPCloud avanzados**: forked tagged links, smoke UI específico para tagged/bidirectional + exception/time.
- **Comentarios/notas**: EPICA-42 sigue fuera del modo mobile review productivo; hoy se comunica como no disponible.

## Prompt De Continuación

Retomar desde este `docs/HANDOFF.md` y el plan `docs/roadmap/refactorizacion-total-plan-normativo.md`.

Siguiente bloque recomendado: iniciar **Corte 2 - Puertos de aplicacion sobre store existente**. Primer objetivo: escoger un viewmodel grande y hacerlo depender de un puerto pequeno ya existente o consolidado en `app/src/app/ports/`, validando con typecheck, unit dirigido y smoke relevante. Si el siguiente bloque toca JointJS, consultar primero `opm-extracted/`, `docs/JOYAS.md`, assets SVG canónicos y documentación oficial de JointJS OSS.
