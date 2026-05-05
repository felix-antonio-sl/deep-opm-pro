# Ronda 6 — Instrucciones de lineas de desarrollo paralelas

**Fecha**: 2026-05-05
**Base**: `main` @ commit `12c2e50` — HANDOFF vigente con rondas 1-5 consolidadas; si el workspace contiene cambios no relacionados, no revertirlos.
**Objetivo**: 6 lineas paralelas para los pendientes priorizados post-ronda 5 del HANDOFF: calibrar el ledger, ampliar OPL inverso, asistente de nuevo modelo, jerarquia de workspace + busqueda + autosalvado, mapa del sistema + reorden de OPDs, y afinado completo de estilo + tabla y propiedades de enlaces.

## 1. Filosofia operativa

- **No reinventar**: antes de disenar, revisar `opm-extracted/INDEX.md`, `opm-extracted/MODULES.md`, `opm-extracted/README.md`, `opm-extracted/REFACTOR-NOTES.md`, `opm-extracted/assets/INDEX.md`, modulos `src/` citados por cada brief, `assets/svg/`, `assets/png/`, `docs/JOYAS.md`, `fixtures/`, los briefs y commits de rondas 1-5 y la SSOT `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`.
- **HU como contrato**: cada linea cierra HU explicitas del backlog vivo o reduce una brecha listada en `docs/HANDOFF.md` y `docs/roadmap/hu-progress.md` (con la advertencia del detector citada en HANDOFF §Verificación).
- **Aditividad estricta**: campos nuevos opcionales, helpers nuevos, componentes nuevos. No renombrar tipos, no romper JSON legacy, no reordenar APIs publicas compartidas salvo wrapper minimo documentado.
- **Modularidad por dominio**: `app/src/modelo/operaciones.ts` mide 1743 LOC y `app/src/store.ts` mide 1616 LOC; toda capacidad nueva debe vivir en modulo de dominio nuevo (`creacionWizard.ts`, `mapaSistema.ts`, `tablaEnlaces.ts`, `enlaceEstilo.ts`, `oplEdicion.ts`, etc.). `operaciones.ts` y `store.ts` solo admiten wrappers finos cuando una firma existente lo obliga.
- **Loop verde obligatorio**: cada linea cierra con `cd app && bun run check`; si toca UI/render, sumar `bun run browser:smoke`; si toca proyeccion JointJS o serializacion, sumar `bun run build`.

## 2. Reglas duras comunes

1. **Scope estricto**: solo tocar archivos permitidos por el brief. Si aparece un cambio cross-line no previsto, detenerse y reportar.
2. **No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`** desde las lineas. El handoff unico se actualiza solo en consolidacion final.
3. **No copiar codigo 1:1 desde `opm-extracted/`**. Se usa como evidencia semantica, UX y trazabilidad; la implementacion en `app/` se reescribe con Preact/Zustand/JointJS OSS.
4. **Citas explicitas**: toda decision semantica cita SSOT (`opm-iso-19450-es.md`, `opm-visual-es.md`, `opm-opl-es.md`, `metodologia-opm-es.md`) o documento interno (`docs/JOYAS.md`, `opm-extracted/...`).
5. **Assets canonicos**: iconos y markers salen de `assets/svg/` y `assets/png/`. No redibujar `folder.svg`, `delete.svg`, `styleElement.svg`, marcadores de enlaces ni iconos de wizard si ya existen en `assets/`.
6. **JSON lossless**: cualquier campo nuevo se serializa/deserializa con default seguro; modelos previos siguen cargando. Roundtrip lossless verificado por unit tests.
7. **Tests por capa**: kernel, serializacion, OPL, render y store/UI se prueban segun el blast radius de cada linea.
8. **Idiomas**: documentacion y mensajes de usuario en es-CL; identificadores siguen el estilo existente del repo.
9. **No introducir backend, Firebase, auth, Rappid ni dependencias nuevas** en esta ronda. Las HU que requieran multi-usuario, permisos O/W/R, ACL o servicios remotos quedan fuera y deben omitirse del slice si las cita la EPICA.
10. **Commits de linea**: mensajes imperativos con `feat(...)`, `test(...)` o `refactor(...)`; reportar hashes y comandos ejecutados al cerrar.
11. **No reabrir contratos de rondas 1-5**: workspace local sin jerarquia (breadcrumb sintetico), Importacion JSON no autopersiste, Bus de agregacion derivado en render, Apariencia.estilo invariante a OPL, OPL-ES como lente derivada. Si la linea necesita matizarlos, lo declara como decision documentada en commit; no los rompe.

## 3. Stack y comandos del repo

- Bun 1.3+, TypeScript strict, Preact 10 + Signals, Zustand 5, JointJS 3.7 core, Vite 6, Playwright.
- Working directory: `/home/felix/projects/deep-opm-pro`; app en `app/`.

```bash
cd app
bun run check          # typecheck + unit tests
bun run browser:smoke  # Playwright Chromium para UI/render
bun run build          # build Vite; warning de chunk JointJS esperado
bun run dev            # localhost:5173
```

Auditoria HU al cierre de consolidacion:

```bash
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

## 4. Vision general de las 6 lineas

| ID | Titulo | Pendiente que cierra | HU eje | Tamano | Riesgo |
|---|---|---|---|---|---|
| **L1** | Calibracion del ledger HU | Pendiente #1 HANDOFF: regex desactualizadas | reglas para EPICA-14, 30, 34, 50, 1C, 20, 11 | S | bajo |
| **L2** | OPL edicion canvas avanzada | EPICA-50: tokens compuestos, multi-enlace, propagacion en vivo, copia/export/busqueda/indentacion | HU-50.013, HU-50.015, HU-50.016, HU-50.021, HU-50.023, HU-50.024, HU-50.025, HU-50.026 | L | alto |
| **L3** | Asistente nuevo modelo (12 etapas) | EPICA-34: wizard guiado + siembra SD radial | HU-34.010 a HU-34.028 | L | alto |
| **L4** | Workspace jerarquico, busqueda y autosalvado | EPICA-31 carpetas + EPICA-35 buscar + EPICA-30 autosalvado | HU-31.002-007/.009-010/.022-023/.026, HU-35.008-015/.018-020, HU-30.011/.013/.028/.034/.035 | L | medio-alto |
| **L5** | Mapa del sistema y gestion del arbol OPD | EPICA-21 meta-grafo + EPICA-20 reorden y gestion | HU-21.001-011/.015, HU-20.014/.017-022 | M | medio |
| **L6** | Estilo completo, tabla y propiedades de enlaces | EPICA-14 estilado texto/enlaces + EPICA-16 tabla + EPICA-11 propiedades enlace avanzadas | HU-14.004-008/.012/.013/.014, HU-16.001-007/.010/.012-018/.021, HU-11.015/.018-020/.023/.025 | L | medio-alto |

Quedan fuera de ronda: HU-14.009 (texto X/Y), HU-14.016 (multi-seleccion bloqueada por HU-SHARED-008), HU-11.026/.027 (tabla de tipos extendida con condicion/evento/NOT), HU-21.012-014/.016-018 (filtros/auto-refresh/export del mapa), HU-30.021/.022 (ejemplos globales/org), HU-30.023-027 (versiones, archivado, log-scale), HU-30.029 (busqueda global cross-folder ≥3 chars), HU-31.008/.013-021/.024-025 (permisos O/W/R, drag-and-drop carpetas, modal de permisos, lectura automatica), HU-31.011-012 (cut/paste de carpetas), HU-31.014 (union de permisos), HU-34.002-003 (boton "+" pestanas y multi-pestana), HU-35.001-007/.016/.017 (mover modelos entre carpetas, drag tile, biblioteca lateral), HU-50.027/.028 (expandir-colapsar bloques, AI text), refactor de `operaciones.ts`, code splitting Vite y redistribucion publica.

## 5. Mapa de archivos por linea

Convencion: `aditivo` = solo agregar o conectar helper; `nuevo` = archivo creado por esa linea; `lectura` = puede leerse pero no editarse; vacio = sin contacto.

| Archivo | L1 | L2 | L3 | L4 | L5 | L6 |
|---|---|---|---|---|---|---|
| `docs/historias-usuario-v2/tools/progress-dashboard.mjs` | **EDIT aditivo fuerte** | — | — | — | — | — |
| `docs/roadmap/hu-progress-evidence.json` | EDIT regenerado | — | — | — | — | — |
| `app/src/modelo/tipos.ts` | — | aditivo opcional | aditivo `modelo.nombre`/`modelo.descripcion` opcionales | aditivo opcional `carpeta` y `modelo.autosalvado` | aditivo opcional `opd.ordenLocal?` | aditivo `enlace.estilo?` y `enlace.multiplicidad{Origen,Destino}?` |
| `app/src/modelo/operaciones.ts` | — | lectura | lectura | lectura | lectura | lectura o wrapper minimo |
| `app/src/modelo/creacionWizard.ts` | — | — | **nuevo** | — | — | — |
| `app/src/modelo/enlaceMultiplicidad.ts` | — | — | — | — | — | **nuevo** |
| `app/src/modelo/enlaceEstilo.ts` | — | — | — | — | — | **nuevo** |
| `app/src/modelo/enlaceVertices.ts` | — | — | — | — | — | **nuevo** |
| `app/src/modelo/opdReorden.ts` | — | — | — | — | **nuevo** | — |
| `app/src/opl/generar.ts` | — | aditivo (TS para despliegue/especializacion) | aditivo (sembrado del SD) | lectura | lectura | aditivo (multiplicidad en oraciones) |
| `app/src/opl/interaccion.ts` | — | **EDIT aditivo fuerte** | — | — | — | — |
| `app/src/opl/edicionCanvas.ts` | — | **nuevo** | — | — | — | — |
| `app/src/opl/generar.test.ts` | — | aditivo | aditivo (asistente) | lectura | lectura | aditivo (multiplicidad) |
| `app/src/persistencia/local.ts` | — | lectura | aditivo (`modelo.descripcion`) | aditivo (`modelo.carpetaId?`, `ultimaApertura`, `autosalvado`) | lectura | aditivo opcional (estilo enlace persistido) |
| `app/src/persistencia/workspace.ts` | — | lectura | lectura | EDIT aditivo (carpetas e indice global) | lectura | lectura |
| `app/src/persistencia/local.test.ts` | — | lectura | aditivo (descripcion) | aditivo (jerarquia y autosalvado) | lectura | aditivo (estilo enlace) |
| `app/src/persistencia/autosalvado.ts` | — | — | — | **nuevo** | — | — |
| `app/src/serializacion/json.ts` | — | lectura | aditivo (campos asistente) | aditivo (`modelo.carpetaId?`) | aditivo (`opd.ordenLocal?`) | aditivo (`enlace.estilo?`, `enlace.multiplicidad{Origen,Destino}?`) |
| `app/src/serializacion/json.test.ts` | — | lectura | aditivo | aditivo | aditivo | aditivo |
| `app/src/render/jointjs/proyeccion.ts` | — | aditivo (highlight multi-enlace, indentacion en bloque OPL si aplica al canvas) | lectura | lectura | aditivo (modo mapa) | aditivo (estilo enlace render) |
| `app/src/render/jointjs/proyeccion.test.ts` | — | aditivo si tocan render | lectura | lectura | aditivo (mapa, marcadores) | aditivo (estilo enlace) |
| `app/src/render/jointjs/JointCanvas.tsx` | — | aditivo (vertice por click sobre OPL multi-enlace) | lectura | lectura | aditivo (modo mapa derivado) | aditivo (vertices manuales y reanclaje extremos) |
| `app/src/render/jointjs/mapaSistema.ts` | — | — | — | — | **nuevo** | — |
| `app/src/store.ts` | — | aditivo (edicion canvas desde OPL) | aditivo (state asistente) | aditivo (carpetas, busqueda intra, autosalvado) | aditivo (mapa, reorden) | aditivo (multiplicidad, estilo, vertices, tabla) |
| `app/src/store.test.ts` | — | aditivo | aditivo | aditivo | aditivo | aditivo |
| `app/src/ui/App.tsx` | — | lectura | aditivo modal asistente | aditivo modal busqueda y carpetas | aditivo modal mapa y gestion arbol | aditivo modal tabla de enlaces |
| `app/src/ui/MenuPrincipal.tsx` | — | lectura | aditivo (entrada "Nuevo modelo por asistente") | aditivo (entrada "Buscar cosas (Ctrl+F)") | aditivo (entrada "Mapa del sistema") | aditivo (entrada "Tabla de enlaces") |
| `app/src/ui/Toolbar.tsx` | — | lectura | lectura | aditivo discreto si requiere indicador autosalvado | lectura | lectura |
| `app/src/ui/PanelOpl.tsx` | — | **EDIT aditivo fuerte** | lectura | lectura | aditivo (placeholder "vista mapa") | lectura |
| `app/src/ui/ArbolOpd.tsx` | — | lectura | lectura | lectura | aditivo (drag, sufijos, expandir todo) | lectura |
| `app/src/ui/DialogoCargarModelo.tsx` | — | — | lectura | aditivo (jerarquia carpetas, breadcrumb interno, tiles vs lista, ordenamiento) | lectura | lectura |
| `app/src/ui/DialogoGuardarComo.tsx` | — | — | lectura | aditivo (selector de carpeta destino, descripcion) | lectura | lectura |
| `app/src/ui/AsistenteNuevoModelo.tsx` | — | — | **nuevo** | — | — | — |
| `app/src/ui/DialogoBuscarCosas.tsx` | — | — | — | **nuevo** | — | — |
| `app/src/ui/PanelCarpetas.tsx` | — | — | — | **nuevo** | — | — |
| `app/src/ui/MapaSistema.tsx` | — | — | — | — | **nuevo** | — |
| `app/src/ui/GestionArbolOpd.tsx` | — | — | — | — | **nuevo** | — |
| `app/src/ui/InspectorEnlace.tsx` | — | aditivo (boton "Editar OPL") | lectura | lectura | lectura | **EDIT aditivo fuerte** (multiplicidad, estilo, etiqueta canonica) |
| `app/src/ui/InspectorEntidad.tsx` | — | lectura | lectura | lectura | lectura | aditivo (estilo de texto: familia/tamano/peso/color/alineacion) |
| `app/src/ui/StyleControls.tsx` | — | lectura | lectura | lectura | lectura | EDIT aditivo (texto, swatches extendidos, copy/paste) |
| `app/src/ui/TablaEnlaces.tsx` | — | — | — | — | — | **nuevo** |
| `app/e2e/opm-smoke.spec.ts` | aditivo (regenerar ledger no smoke; pero si toca app, smoke aditivo) | aditivo | aditivo | aditivo | aditivo | aditivo |
| `assets/svg/**` | — | — | lectura canonica | lectura canonica | lectura canonica | lectura canonica |
| `opm-extracted/**` | lectura | lectura | lectura | lectura | lectura | lectura |

Reglas de colision:

- `store.ts` es el principal archivo compartido. Cada linea agrega acciones agrupadas por dominio y no reordena bloques existentes; el agente extrae lo nuevo a `feature/.ts` cuando supere ~80 LOC adicionales.
- `MenuPrincipal.tsx` lo tocan L3, L4, L5 y L6 (cada una agrega una entrada). El orden de entradas debe respetar la primera version comprometida; cualquier reorden es decision documentada.
- `InspectorEnlace.tsx` pertenece a L6 para multiplicidad/estilo/etiqueta canonica y a L2 solo para boton "Editar OPL" (pequeno, al final del panel). Coordinar mediante orden de merge.
- `StyleControls.tsx` pertenece a L6; ninguna otra linea lo toca.
- `proyeccion.ts` lo tocan L2 (overlays multi-enlace), L5 (modo mapa) y L6 (estilo enlace). Cada una extrae a helper nuevo (`oplEdicionOverlay.ts`, `mapaSistema.ts`, `enlaceEstilo.ts`); `proyeccion.ts` solo queda como punto de composicion.
- `serializacion/json.ts` pertenece a L3 (campos asistente), L4 (carpeta), L5 (orden) y L6 (estilo/multiplicidad enlace). Todos usan defaults seguros y campos opcionales; ninguno reescribe firmas existentes.
- `DialogoCargarModelo.tsx` y `DialogoGuardarComo.tsx` pertenecen a L4; L3 solo lee.
- `assets/svg/` se considera lectura canonica universal; ningun brief redibuja iconos.

## 6. Protocolo de conciliacion

Orden de merge sugerido: **L1 -> L4 -> L3 -> L5 -> L6 -> L2**.

1. **L1 primero**: recalibra el ledger antes de que las otras lineas envien evidencia que dispare nuevas reglas. Bajo riesgo y sin codigo en `app/`.
2. **L4 segundo**: establece carpetas, busqueda, autosalvado e indice expandido del workspace; base para que el asistente y los dialogos consuman jerarquia.
3. **L3 tercero**: el asistente reescribe el flujo de "Nuevo modelo" e introduce nuevas entradas en `MenuPrincipal.tsx`; conviene aterrizar despues del workspace pero antes del mapa.
4. **L5 cuarto**: introduce mapa del sistema y gestion de arbol; toca `ArbolOpd.tsx` y `proyeccion.ts` con un modo nuevo. Aterriza antes que L6 para que la tabla de enlaces no compita por `proyeccion.ts`.
5. **L6 quinto**: toca multiplicidad, estilo y vertices; introduce overlays en proyeccion y panel/tabla en UI. Aprovecha la modularizacion de proyeccion lograda por L5.
6. **L2 ultimo**: mayor blast radius en OPL/canvas; aprovecha multiplicidad L6 (puede mostrarla en oraciones) y modo mapa L5 (suspende OPL si aplica). Cualquier cascada cross-line se resuelve aqui en consolidacion final.

Despues de cada merge: `cd app && bun run check`; si toco UI/render: `bun run browser:smoke`; al cierre de ronda: `bun run build` y auditoria HU con `--sync-real` (que ahora deberia reflejar la realidad gracias a L1).

## 7. Anclaje obligatorio a HU y SSOT

Antes de codificar cada linea, leer:

- HU listadas en el brief bajo `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/`.
- SSOT en `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`:
  - `opm-iso-19450-es.md`: glosario OPD/OPL/multiplicidad, §OPD tree, §multiplicidad, §rutas, §nombres canonicos.
  - `opm-visual-es.md`: V-1, V-61, V-63, V-129, V-239, V-240.
  - `opm-opl-es.md`: §1, §3-§10, §12 multiplicidad, §13 rutas, §17/Ap. A roundtrip.
  - `metodologia-opm-es.md`: §6 nuevo SD (12 etapas), §7/§7b refinamiento, §15 invariantes.
- Evidencia OPCloud en `opm-extracted/`:
  - `INDEX.md`, `MODULES.md`, `README.md`, `REFACTOR-NOTES.md`, `assets/INDEX.md`.
  - Modulos puntuales citados en cada brief (`new-model-wizard`, `load-model-dialog`, `folder-picker`, `system-map`, `opdsTreeActions`, `link-properties`, `style-panel`, `MultiplicityEditor`, `inverse-opl`).

Si SSOT y OPCloud difieren, manda SSOT. OPCloud operacionaliza; no redefine semantica.

## 8. Brief por linea

| Linea | Brief |
|---|---|
| L1 | [linea-1-calibracion-ledger.md](./linea-1-calibracion-ledger.md) |
| L2 | [linea-2-opl-edicion-canvas.md](./linea-2-opl-edicion-canvas.md) |
| L3 | [linea-3-asistente-nuevo-modelo.md](./linea-3-asistente-nuevo-modelo.md) |
| L4 | [linea-4-workspace-jerarquia-busqueda.md](./linea-4-workspace-jerarquia-busqueda.md) |
| L5 | [linea-5-mapa-sistema-drag-drop-opd.md](./linea-5-mapa-sistema-drag-drop-opd.md) |
| L6 | [linea-6-enlaces-estilo-tabla-propiedades.md](./linea-6-enlaces-estilo-tabla-propiedades.md) |

Prompt para asignar lineas: [prompt-asignacion.md](./prompt-asignacion.md).

## 9. Verificacion al cierre de la ronda

```bash
cd app
bun run check
bun run browser:smoke
bun run build
cd ..
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

Metricas esperadas post-ronda 6:

- Unit tests: base HANDOFF **283 unit tests / 1541 expects**; objetivo conservador **>= 360 tests verdes**.
- Smoke browser: base HANDOFF **34 Playwright smoke**; objetivo conservador **>= 42 smoke verdes**.
- HU cerradas o elevadas (segun brief): HU-50.013/.015/.016/.021/.023/.024/.025/.026, HU-34.010-028, HU-31.002-007/.009-010/.022-023/.026, HU-35.008-015/.018-020, HU-30.011/.013/.028/.034/.035, HU-21.001-011/.015, HU-20.014/.017-022, HU-14.004-008/.012-014, HU-16.001-007/.010/.012-018/.021, HU-11.015/.018-020/.023/.025.
- Ledger calibrado: tras `--sync-real`, las EPICAs 14, 30, 34, 50, 1C, 20 y 11 deben mostrar avance proporcional al codigo real (sin caidas espurias por refactors de ronda 5).
- `app/src/modelo/operaciones.ts` y `app/src/store.ts` no deben crecer mas de wrappers minimos; cualquier crecimiento neto relevante se justifica en el reporte de la linea.
- `docs/HANDOFF.md` permanece intacto durante las lineas; se actualiza solo en consolidacion final.
