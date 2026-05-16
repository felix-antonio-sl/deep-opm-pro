# HANDOFF — Estado operativo del modelador OPM

**Fecha**: 2026-05-16
**Repositorio**: `deep-opm-pro`
**Rama**: `main`
**HEAD versionado**: `96d5097 feat(ux): filtra tabla de enlaces densa`
**Corte**: Primer corte post-brief HODOM denso: tabla de enlaces apta para inspeccionar modelos grandes con búsqueda textual y filtro por familia.

## Política De Handoff Único

`docs/HANDOFF.md` es la única memoria de traspaso vigente del proyecto. No crear handoffs paralelos. Los reportes/capturas regenerables viven ignorados por git; la memoria versionada queda aquí.

## Fuentes Normativas Y Técnicas

- Brief activo del corte: `docs/instrucciones-lineas-dev/ronda22/refactor-ux-ifml.md`.
- SSOT OPM: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`.
- Evidencia OPCloud preferente: `opm-extracted/` antes de `decompiled/`.
- Canon visual local: `docs/JOYAS.md` y `assets/svg/`.
- JointJS OSS: usar documentación oficial viva cuando se toque JointJS.

## Estado Actual

### Post-Brief HODOM Denso — 2026-05-16

La rama `main` quedó sincronizada con `origin/main` tras `96d5097`, que mejora `TablaEnlaces` para operar sobre modelos densos:

- Búsqueda textual por origen, destino, etiqueta, tipo, familia y OPD.
- Filtro por familia `Procedurales` / `Estructurales` / `Todos`.
- Contador accesible `filtrados/total` con desglose procedurales/estructurales.
- Botón de limpieza de filtros.
- Smoke específico sobre modelo mixto de 10 enlaces para cubrir búsqueda + familia sin romper edición, eliminación ni navegación existente.

Prueba directa con HODOM v1.1 real:

```bash
# Cargado por browser contra http://127.0.0.1:5173/
# TablaEnlaces: 113 filas
# Contador: 113 de 113 enlaces · 83 procedurales · 30 estructurales
# Filtro estructural: 30 filas
# Búsqueda "Paciente": 19 filas
# pageErrors: []
```

Validación del corte:

```bash
cd app && bun run typecheck
cd app && bun run browser:smoke -- e2e/11-beta1-tabla-enlaces.spec.ts
# 4 passed
cd app && bun run lint
cd app && bun run test
# 1371 pass / 0 fail
cd app && bun run build
cd app && bun run browser:smoke
# 191 passed / 0 fail
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

Ejecutado sobre el estado actual:

```bash
node --check app/scripts/in-vivo-test.mjs
cd app && node scripts/in-vivo-test.mjs http://127.0.0.1:5173/
cd app && bun run lint
```

El cierre de código inmediatamente anterior (`de67395`) ya había quedado verificado con:

```bash
cd app && bun run typecheck
cd app && bun run test
# 1371 pass / 0 fail
cd app && bun run build
cd app && bun run browser:smoke
# 190 passed / 0 fail
```

Validación HODOM v1.1 realizada sobre el mismo corte funcional:

```bash
cd app
bun -e 'import { readFileSync } from "node:fs"; import { hidratarModelo } from "./src/serializacion/json"; import { proyectarModeloAJointCells } from "./src/render/jointjs/proyeccion"; const raw = readFileSync("/home/felix/projects/hd-hsc-os/docs/models/opm-hodom-bundle-v1.1.json", "utf8"); const hidratado = hidratarModelo(raw); if (!hidratado.ok) throw new Error(hidratado.error); const modelo = hidratado.value; const proyecciones = Object.keys(modelo.opds).map((opdId) => ({ opdId, cells: proyectarModeloAJointCells(modelo, opdId, null, null).length })); console.log(JSON.stringify({ entidades: Object.keys(modelo.entidades).length, enlaces: Object.keys(modelo.enlaces).length, opds: Object.keys(modelo.opds).length, proyecciones }, null, 2));'
# entidades=46 enlaces=113 opds=5
# opd-sd0=43 cells, opd-sd1=97, opd-sd1-2=38, opd-eq-salud-hd=19, opd-cap-op-hd=15
```

## Commits Relevantes Del Cierre UX/IFML

- `96d5097 feat(ux): filtra tabla de enlaces densa`
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

## Pendientes Post-Brief

El brief UX/IFML queda cerrado para el corte auditado. El primer corte de modelos densos ya mejoró `TablaEnlaces`; lo que sigue debe seguir usando HODOM como pressure test real:

- **Mini-mapa / mapa del sistema más operativo**: navegación visual para modelos densos.
- **Import/export OPX real**: interoperabilidad más allá del JSON local.
- **Modelos densos HODOM**: profundizar navegación por subgrafo, filtros de canvas y performance perceptual con 5 OPDs y 113 enlaces.
- **Enlaces OPCloud avanzados**: forked tagged links, smoke UI específico para tagged/bidirectional + exception/time.
- **Comentarios/notas**: EPICA-42 sigue fuera del modo mobile review productivo; hoy se comunica como no disponible.

## Prompt De Continuación

Retomar desde este `docs/HANDOFF.md`. Usar el script versionado `app/scripts/in-vivo-test.mjs` como baseline antes y después del próximo corte visual/UX. Si el siguiente bloque toca JointJS, consultar primero `opm-extracted/`, `docs/JOYAS.md`, assets SVG canónicos y documentación oficial de JointJS OSS.

Siguiente bloque recomendado: seguir con **HODOM denso**, ahora en navegación canvas/subgrafo. La tabla ya filtra 113 enlaces; falta que esa selección pueda traducirse en foco visual sobre el canvas o en una vista de subgrafo sin inundar el OPD.
