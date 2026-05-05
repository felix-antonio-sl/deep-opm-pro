# Ronda 5 — Instrucciones de lineas de desarrollo paralelas

**Fecha**: 2026-05-05  
**Base**: `main` @ commit `89ffde0` — HANDOFF vigente con rondas 1-4 consolidadas; si el workspace contiene cambios no relacionados, no revertirlos  
**Objetivo**: 6 lineas paralelas para cerrar pendientes inmediatos M0/MVP-alpha del HANDOFF: OPL inversa, workspace de persistencia, eliminacion segura de OPDs, agregacion visual + etiquetas, creacion interna correcta y estilo visual de cosas.

## 1. Filosofia operativa

- **No reinventar**: antes de disenar, revisar `opm-extracted/INDEX.md`, `opm-extracted/MODULES.md`, `opm-extracted/README.md`, `opm-extracted/REFACTOR-NOTES.md`, `opm-extracted/assets/INDEX.md`, modulos `src/` citados por cada brief, `assets/svg/`, `assets/png/`, `docs/JOYAS.md`, `fixtures/` y la SSOT `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`.
- **HU como contrato**: cada linea cierra HU explicitas del backlog vivo o reduce una brecha listada por `docs/HANDOFF.md` y `docs/roadmap/hu-progress.md`.
- **Aditividad estricta**: campos nuevos opcionales, helpers nuevos y componentes nuevos. No renombrar tipos, no romper JSON legacy, no reordenar APIs publicas compartidas salvo wrapper minimo documentado.
- **Modularidad por dominio**: `app/src/modelo/operaciones.ts` mide 1743 LOC; toda capacidad nueva debe vivir en modulo de dominio (`opdEliminacion.ts`, `estilos.ts`, `oplInteraccion.ts`, etc.). `operaciones.ts` solo admite wrappers finos si una firma existente obliga.
- **Loop verde obligatorio**: cada linea cierra con `cd app && bun run check`; si toca UI/render, tambien `bun run browser:smoke`; si toca proyeccion JointJS o serializacion, sumar `bun run build`.

## 2. Reglas duras comunes

1. **Scope estricto**: solo tocar archivos permitidos por el brief. Si aparece un cambio cross-line no previsto, detenerse y reportar.
2. **No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`** desde las lineas. El handoff unico se actualiza solo en consolidacion final.
3. **No copiar codigo 1:1 desde `opm-extracted/`**. Se usa como evidencia semantica, UX y trazabilidad; la implementacion en `app/` se reescribe con Preact/Zustand/JointJS OSS.
4. **Citas explicitas**: toda decision semantica cita SSOT (`opm-iso-19450-es.md`, `opm-visual-es.md`, `opm-opl-es.md`, `metodologia-opm-es.md`) o documento interno (`docs/JOYAS.md`, `opm-extracted/...`).
5. **Assets canonicos**: iconos y markers salen de `assets/svg/` y `assets/png/`. No redibujar `folder.svg`, `delete.svg`, `styleElement.svg`, enlaces ni wizard si ya existen.
6. **JSON lossless**: cualquier campo nuevo se serializa/deserializa con default seguro; modelos previos siguen cargando.
7. **Tests por capa**: kernel, serializacion, OPL, render y store/UI se prueban segun el blast radius de cada linea.
8. **Idiomas**: documentacion y mensajes de usuario en es-CL; identificadores siguen el estilo existente del repo.
9. **No introducir backend, Firebase, auth, Rappid ni dependencias nuevas** en esta ronda.
10. **Commits de linea**: mensajes imperativos con `feat(...)`, `test(...)` o `refactor(...)`; reportar hashes y comandos ejecutados al cerrar.

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
| **L1** | OPL interactivo inverso | EPICA-50: numeracion, resaltado, filtro y edicion OPL->canvas | HU-50.002, HU-50.017, HU-50.018, HU-50.019, HU-50.020, HU-50.022 | L | alto |
| **L2** | Workspace local y dialogos de archivo | EPICA-30/34: menu, guardar como, cargar, nuevo modelo vacio formal | HU-30.001, HU-30.005, HU-30.006, HU-30.009, HU-30.010, HU-30.013, HU-30.015, HU-30.018, HU-34.001, HU-34.004-HU-34.008 | L | alto |
| **L3** | Eliminacion segura de OPDs hoja | EPICA-20: no eliminar nodos internos y cascada hoja controlada | HU-20.015, HU-20.016 | M | medio |
| **L4** | Bus de agregacion y etiquetas de enlace | EPICA-11: bus vertical unico y renombrado de etiqueta | HU-11.004, HU-11.014 | M | medio-alto |
| **L5** | Creacion interna correcta en contenedor | EPICA-1C: crear cosa interna sin advertencia | HU-1C.004 | M | medio |
| **L6** | Estilo visual editable de cosas | EPICA-14: fill/borde/reset/persistencia sin eco OPL | HU-14.001, HU-14.002, HU-14.003, HU-14.015, HU-14.017 | M | medio |

Quedan fuera de ronda: asistente de 12 etapas (HU-34.010+), persistencia remota/Firebase, versionado log-scale, tree drag-and-drop, estilo de enlaces completo, bus para familias no-agregacion, export OPL/HTML, busqueda OPL, code splitting Vite y redistribucion publica.

## 5. Mapa de archivos por linea

Convencion: `aditivo` = solo agregar o conectar helper; `nuevo` = archivo creado por esa linea; `lectura` = puede leerse pero no editarse; vacio = sin contacto.

| Archivo | L1 | L2 | L3 | L4 | L5 | L6 |
|---|---|---|---|---|---|---|
| `app/src/modelo/tipos.ts` | lectura | aditivo opcional metadata workspace | lectura | lectura | lectura | aditivo (`Apariencia.estilo?`) |
| `app/src/modelo/operaciones.ts` | lectura | lectura | lectura | lectura | lectura o wrapper minimo | lectura |
| `app/src/modelo/opdEliminacion.ts` | — | — | **nuevo** | — | — | — |
| `app/src/modelo/creacionInterna.ts` | — | — | — | — | **nuevo** | — |
| `app/src/modelo/etiquetasEnlace.ts` | — | — | — | **nuevo** | — | — |
| `app/src/modelo/estilos.ts` | — | — | — | — | — | **nuevo** |
| `app/src/opl/generar.ts` | aditivo anotacion | lectura | lectura | aditivo etiqueta | lectura | lectura |
| `app/src/opl/interaccion.ts` | **nuevo** | — | — | lectura | — | — |
| `app/src/opl/generar.test.ts` | aditivo | lectura | lectura | aditivo | lectura | aditivo negativo estilo |
| `app/src/persistencia/local.ts` | lectura | aditivo dialog/workspace | lectura | lectura | lectura | lectura |
| `app/src/persistencia/workspace.ts` | — | **nuevo** | — | — | — | — |
| `app/src/persistencia/local.test.ts` | lectura | aditivo | lectura | lectura | lectura | aditivo si persiste estilo |
| `app/src/serializacion/json.ts` | lectura | lectura | lectura | lectura | lectura | aditivo estilo |
| `app/src/serializacion/json.test.ts` | lectura | aditivo si cambia metadata | lectura | lectura | lectura | aditivo estilo |
| `app/src/render/jointjs/proyeccion.ts` | aditivo hover si necesario | lectura | lectura | aditivo acotado | lectura | aditivo estilo |
| `app/src/render/jointjs/agregacionBus.ts` | — | — | — | **nuevo** | — | — |
| `app/src/render/jointjs/proyeccion.test.ts` | aditivo hover | lectura | lectura | aditivo bus | lectura | aditivo estilo |
| `app/src/render/jointjs/JointCanvas.tsx` | aditivo hover/seleccion | lectura | lectura | lectura | aditivo punto de creacion | lectura |
| `app/src/store.ts` | aditivo OPL UI | aditivo workspace | aditivo OPD delete | aditivo etiquetas | aditivo creacion interna | aditivo estilo |
| `app/src/store.test.ts` | aditivo | aditivo | aditivo | aditivo | aditivo | aditivo |
| `app/src/ui/App.tsx` | lectura | aditivo modales | lectura | lectura | lectura | lectura |
| `app/src/ui/Toolbar.tsx` | lectura | aditivo menu archivo | lectura | lectura | aditivo menor si crea modo interno | lectura |
| `app/src/ui/MenuPrincipal.tsx` | — | **nuevo** | — | — | — | — |
| `app/src/ui/DialogoGuardarComo.tsx` | — | **nuevo** | — | — | — | — |
| `app/src/ui/DialogoCargarModelo.tsx` | — | **nuevo** | — | — | — | — |
| `app/src/ui/ArbolOpd.tsx` | lectura | lectura | aditivo acciones hoja | lectura | lectura | lectura |
| `app/src/ui/PanelOpl.tsx` | aditivo fuerte | lectura | lectura | lectura | lectura | lectura |
| `app/src/ui/InspectorEnlace.tsx` | lectura | lectura | lectura | aditivo etiqueta | lectura | lectura |
| `app/src/ui/InspectorEntidad.tsx` | lectura | lectura | lectura | lectura | lectura | aditivo estilo |
| `app/src/ui/StyleControls.tsx` | — | — | — | — | — | **nuevo** |
| `app/e2e/opm-smoke.spec.ts` | aditivo | aditivo | aditivo | aditivo | aditivo | aditivo |
| `assets/svg/folder.svg`, `assets/svg/regFile.svg`, `assets/svg/delete.svg` | — | lectura canonica | lectura canonica | — | — | — |
| `assets/svg/styleElement.svg` | — | — | — | — | — | lectura canonica |
| `opm-extracted/**` | lectura | lectura | lectura | lectura | lectura | lectura |

Reglas de colision:
- `store.ts` es el principal archivo compartido. Cada linea agrega acciones agrupadas por dominio y no reordena bloques existentes.
- `proyeccion.ts` lo tocan L1, L4 y L6. Cada una debe extraer la logica a helper nuevo; `proyeccion.ts` solo queda como punto de composicion.
- `Toolbar.tsx` lo toca L2 y posiblemente L5. L5 solo puede agregar un modo o variante de creacion; L2 posee menu, guardar/cargar/nuevo.
- `InspectorEnlace.tsx` pertenece a L4 para etiqueta; L6 no implementa estilo de enlaces en esta ronda.
- `serializacion/json.ts` pertenece a L6 salvo metadata workspace opcional de L2; si L2 no necesita campo nuevo, no tocar.

## 6. Protocolo de conciliacion

Orden de merge sugerido: **L2 -> L3 -> L5 -> L4 -> L6 -> L1**.

1. **L2 primero**: establece menu/dialogos y flujo de modelo nuevo, base de UX para persistencia y estados dirty.
2. **L3 segundo**: consume arbol OPD existente y agrega eliminacion segura sin depender de render nuevo.
3. **L5 tercero**: agrega semantica de creacion interna antes de que estilo y OPL interactivo dependan de seleccion mas rica.
4. **L4 cuarto**: toca proyeccion de enlaces y etiqueta; conviene integrarlo antes de OPL interactivo.
5. **L6 quinto**: introduce `Apariencia.estilo?` y serializacion; debe rebasear sobre cualquier ajuste de proyeccion previo.
6. **L1 ultimo**: mayor blast radius de UI/OPL/seleccion; aprovecha etiquetas L4 y estilos L6 sin reabrir contratos.

Despues de cada merge: `cd app && bun run check`; si toco UI/render: `bun run browser:smoke`; al cierre de ronda: `bun run build` y auditoria HU con `--sync-real`.

## 7. Anclaje obligatorio a HU y SSOT

Antes de codificar cada linea, leer:

- HU listadas en el brief bajo `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/`.
- SSOT en `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`:
  - `opm-iso-19450-es.md`: glosario OPD/OPL/multiplicidad, §OPD tree, §multiplicidad, §rutas, §nombres canonicos.
  - `opm-visual-es.md`: V-1, V-63, V-129, V-239, V-240, V-193-V-195.
  - `opm-opl-es.md`: §1, §3-§10, §12 multiplicidad, §13 rutas, §17/Ap. A roundtrip.
  - `metodologia-opm-es.md`: §6 nuevo SD, §7/§7b refinamiento, §15 invariantes.
- Evidencia OPCloud en `opm-extracted/`:
  - `INDEX.md`, `MODULES.md`, `README.md`, `REFACTOR-NOTES.md`, `assets/INDEX.md`.
  - Modulos puntuales citados en cada brief (`rappid-opl`, `load-model-dialog`, `opdsTreeActions`, `TreeViewService`, `linkDrawing`, `keyboardShortcuts`, `styleCopyingDialog`, `opmStyle`).

Si SSOT y OPCloud difieren, manda SSOT. OPCloud operacionaliza; no redefine semantica.

## 8. Brief por linea

| Linea | Brief |
|---|---|
| L1 | [linea-1-opl-interactivo-inverso.md](./linea-1-opl-interactivo-inverso.md) |
| L2 | [linea-2-workspace-persistencia-local.md](./linea-2-workspace-persistencia-local.md) |
| L3 | [linea-3-eliminacion-segura-opds.md](./linea-3-eliminacion-segura-opds.md) |
| L4 | [linea-4-bus-agregacion-etiquetas.md](./linea-4-bus-agregacion-etiquetas.md) |
| L5 | [linea-5-creacion-interna-contenedor.md](./linea-5-creacion-interna-contenedor.md) |
| L6 | [linea-6-estilo-visual-cosas.md](./linea-6-estilo-visual-cosas.md) |

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

Metricas esperadas post-ronda 5:

- Unit tests: base HANDOFF **250 unit tests**; objetivo conservador **>= 310 tests verdes**.
- Smoke browser: base HANDOFF **28 Playwright smoke**; objetivo conservador **>= 34 tests verdes**.
- HU cerradas o elevadas: HU-50.002/017/018/019/020/022, HU-30.001/005/006/009/010/013/015/018, HU-34.001/004/005/006/007/008, HU-20.015/016, HU-11.004/014, HU-1C.004, HU-14.001/002/003/015/017.
- `app/src/modelo/operaciones.ts` no debe crecer mas de wrappers minimos; cualquier crecimiento neto relevante se justifica en el reporte.
- `docs/HANDOFF.md` permanece intacto durante las lineas; se actualiza solo en consolidacion final.
