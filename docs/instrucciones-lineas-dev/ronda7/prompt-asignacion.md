# Prompt minimo de asignacion de linea (ronda 7)

Plantilla generica para asignar cualquiera de las 6 lineas de la ronda 7 a un agente independiente. Reemplazar `{{LINEA}}` y `{{PATH_BRIEF}}`.

## Plantilla

```text
Implementa la linea de desarrollo {{LINEA}} de deep-opm-pro.

Brief autoridad: {{PATH_BRIEF}}.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda7/README.md.
Working directory: /home/felix/projects/deep-opm-pro.

Antes de codificar:
1. Lee el brief completo. Las HU listadas son contrato.
2. Lee la SSOT citada en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/.
3. Revisa en profundidad opm-extracted/ segun el brief: INDEX.md, MODULES.md, README.md, REFACTOR-NOTES.md, assets/INDEX.md y modulos src/ citados con paths absolutos desde repo root.
4. Revisa el estado actual de app/src antes de editar. No asumas que el codigo coincide con rondas historicas (ya hubo 6 rondas); verifica.
5. Revisa assets/svg/ y docs/JOYAS.md antes de redibujar cualquier marcador, icono o shape.
6. Revisa docs/HANDOFF.md (especialmente §Decisiones Vigentes y §Pendientes Inmediatos) para no romper contratos heredados de rondas 1-6.
7. Revisa los briefs de las otras 5 lineas en docs/instrucciones-lineas-dev/ronda7/ para entender el orden de merge sugerido y las dependencias declaradas.

Reglas duras no negociables:
- Cambios solo aditivos. No renombrar campos existentes, no romper JSON legacy, no reordenar APIs publicas sin necesidad.
- No tocar archivos fuera del scope declarado en seccion 4 del brief.
- No tocar archivos sueltos del operador en el working tree raiz (L1, L2.md, L3.md, L4.md, L5.md, L6.md, session-ses_208e.md), ni app/src/render/jointjs/customShapes.ts, ni el directorio home/. Son WIP del operador, fuera de scope; ni editar, ni mover, ni borrar.
- No copiar bloques 1:1 desde opm-extracted/. Usalo como evidencia, UX y trazabilidad; cita paths absolutos con lineas cuando aplique.
- Cada decision semantica debe citar SSOT o documento interno trazable.
- No tocar docs/HANDOFF.md, docs/historias-usuario-v2/, ni docs/instrucciones-lineas-dev/ronda1..6/.
- Mantener la logica nueva en helper/modulo de dominio nuevo siempre que el brief lo indique. Recordar que app/src/store.ts mide 2554 LOC, app/src/modelo/operaciones.ts mide 1743 LOC, app/src/render/jointjs/proyeccion.ts mide 1116 LOC, app/src/opl/generar.ts mide 988 LOC, app/src/ui/PanelCarpetas.tsx mide 609 LOC, app/src/ui/ArbolOpd.tsx mide 539 LOC, app/src/ui/InspectorEntidad.tsx mide 522 LOC, app/src/ui/PanelOpl.tsx mide 435 LOC. Toda capacidad nueva debe vivir en modulo de dominio nuevo, no expandir los monoliticos.
- Idiomas: documentacion y mensajes en es-CL; identificadores segun estilo actual del codigo.
- No introducir backend, Firebase, auth, Rappid ni dependencias nuevas. La excepcion declarada es L2 que puede emitir PNG/SVG cliente-side via paper.toSVG() + canvas.toBlob().
- No reabrir contratos de rondas 1-6: workspace local con jerarquia de carpetas sin permisos, Importacion JSON no autopersiste, Bus de agregacion derivado en render, Apariencia.estilo invariante a OPL, OPL-ES como lente derivada, Modelo post-asistente queda dirty, Mapa = vista neutra, arbol expandido por default invirtiendo set a "colapsados", multiplicidad canonica + custom validada, abanicos OR/XOR como arcos canonicos r=30/r=35.

Loop verde obligatorio antes de cerrar:
- cd app && bun run check
- cd app && bun run browser:smoke    (si tocaste UI/render)
- cd app && bun run build            (si tocaste proyeccion JointJS o serializacion)

Forma del entregable:
- Commits en la rama actual, salvo instruccion explicita de worktree/branch.
- Mensajes imperativos con prefijo feat(...) | test(...) | refactor(...) | chore(...) en es-CL sin tildes en el subject.
- Reportar hashes de commits, tests agregados, comandos ejecutados, decisiones tomadas (especialmente las de §10 del brief) y bloqueos.
- Confirmar que no tocaste HANDOFF, HU, los archivos sueltos del operador ni los briefs de otras lineas.

Si surge un cambio cross-line fuera del scope, detente y consulta. No lo resuelvas por invasion silenciosa. Si descubris un bug fuera de scope, entregar como patch a /tmp/ y NO commitear (regla del operador).
```

## Invocaciones concretas

### L1 — Multi-seleccion y operaciones batch

```text
Implementa la linea de desarrollo L1 (HU-SHARED-008 + HU-11.001/.007/.008/.023 + HU-14.016 + HU-90.003/.004/.005/.006/.007/.019, multi-seleccion canvas con Ctrl+clic y rubber band Shift, operaciones batch sobre seleccion: eliminar, alinear enlaces, conectar al todo, batch styling, copy/paste visual, nudge fino) de deep-opm-pro.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda7/linea-1-multi-seleccion-batch.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda7/README.md.
[resto identico a la plantilla]
```

### L2 — Mapa del sistema cierre + fix render

```text
Implementa la linea de desarrollo L2 (HU-21.005/.009/.011/.012/.013/.014/.016/.017/.018 + fix scaleContentToFit con >=2 OPDs, cierre completo del Mapa del sistema con filtros, resaltado, panel estadisticas, marcadores, zoom Ctrl+rueda, persistencia de zoom/pan/filtros, auto-refresh, export PNG/SVG cliente-side; PDF queda diferido por dependencia EPICA-60) de deep-opm-pro.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda7/linea-2-mapa-cierre.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda7/README.md.
[resto identico a la plantilla]
```

### L3 — Multi-pestana y bloques OPL jerarquicos

```text
Implementa la linea de desarrollo L3 (HU-34.002/.003/.004 + HU-50.027, slice de pestanas con N modelos abiertos en sesion, boton "+", boton X por pestana, drag-reorder, bloques OPL colapsables por OPD con chevrons; pestanas son sesion-only, no se persisten) de deep-opm-pro.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda7/linea-3-multi-pestana-opl-bloques.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda7/README.md.
[resto identico a la plantilla]
```

### L4 — Workspace cierre

```text
Implementa la linea de desarrollo L4 (HU-35.001-005 + HU-31.011-013 + HU-30.011/.023/.025/.027/.029/.034, workspace cierre: mover modelos entre carpetas con cut/paste y drag-drop, cut/paste y drag-drop de carpetas, busqueda global cross-folder con guard de 3 caracteres, versiones simples por save manual, archivado manual de modelos y carpetas con cascada; sin permisos O/W/R, sin log-scale, sin auto-archivado por single-user MVP) de deep-opm-pro.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda7/linea-4-workspace-cierre.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda7/README.md.
[resto identico a la plantilla]
```

### L5 — Atajos teclado centralizados y cierre arbol OPD

```text
Implementa la linea de desarrollo L5 (HU-90.001-009/.010-013/.014/.015/.016/.017/.020/.021 + HU-20.009/.010/.011/.013, registry central de atajos de teclado con contexto, divisor arrastrable entre panel arbol y canvas, menu contextual completo del arbol, toggle ocultar nombres, navegacion teclada Ctrl+arrows, Ctrl+0 fit-to-screen, Ctrl+rueda zoom canvas normal; cheatsheet opcional; sin remapeo de atajos por usuario) de deep-opm-pro.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda7/linea-5-atajos-arbol.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda7/README.md.
[resto identico a la plantilla]
```

### L6 — Objetos avanzados, designaciones de estado, plegado parcial

```text
Implementa la linea de desarrollo L6 (HU-17.002-012/.018-023/.027/.028/.033/.034 + HU-13.007/.010-013/.019 + HU-18.011/.013-015, objetos avanzados con alias, unidad, descripcion enriquecida, URLs tipadas, designaciones de estado Inicial/Final/Default/Current con exclusiones, duracion temporal con min/nominal/max, supresion de estados sin enlaces, layout horizontal/vertical de estados, persistencia de modoPlegado por apariencia, OPL canonico para todo lo anterior; sin slot de valor numerico, sin biblioteca lateral) de deep-opm-pro.
Brief autoridad: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda7/linea-6-objetos-avanzados.md.
Reglas comunes: /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda7/README.md.
[resto identico a la plantilla]
```

## Notas operativas

- **Aislamiento**: si las lineas corren de verdad en paralelo, usar worktrees por linea (`git worktree add ../deep-opm-pro-l1 main`). El repo compartido puede contener cambios no relacionados; no revertirlos. Los archivos sueltos del operador en working tree raiz y `app/src/render/jointjs/customShapes.ts` deben ignorarse en cada worktree (no editar, no mover, no borrar).
- **Orden de merge sugerido**: L2 -> L5 -> L4 -> L1 -> L6 -> L3, con `bun run check` (y smoke si toco UI/render) despues de cada merge. Rationale completo en README §6. La ronda 6 demostro que el ultimo commit del ciclo debe reservarse para una capa explicita de **cascadas resueltas**.
- **Coherencia metodologica**: toda linea debe reciclar evidencia de `opm-extracted/` y SSOT antes de crear una solucion propia. La cita debe ser path absoluto desde repo root + lineas cuando aplique.
- **Cascadas anticipadas**:
  - `MenuPrincipal.tsx` lo tocan L2, L3, L4, L5 y L6 (cada una agrega entradas al final del menu existente). Resolver via append en orden de merge; no reorganizar.
  - `tipos.ts` lo tocan L1, L3, L4, L5 y L6 con campos opcionales. Cada uno agrupa por dominio y NO reordena.
  - `serializacion/json.ts` lo tocan L4 y L6 (campos OPM). L1/L2/L3/L5 verifican que sus campos NO entran al JSON OPM (son sesion/workspace).
  - `store.ts` lo tocan todas excepto eventualmente L5 (que puede reusar acciones existentes). Cada una agrupa acciones por dominio en bloque consecutivo y NO reordena bloques previos. L3 extrae a `store/pestanas.ts` para no inflar el monolitico (2554 LOC -> mantener bajo control).
  - `proyeccion.ts` lo tocan L1 (halo seleccion), L2 (resaltado mapa) y L6 (badges + designaciones estado). Cada una extrae a helper nuevo cuando supera 30 LOC efectivas. `proyeccion.ts` solo queda como punto de composicion.
  - `JointCanvas.tsx` lo tocan L1 (handlers seleccion), L2 (zoom mapa, refrescar) y L5 (Ctrl+0 fit, Ctrl+rueda canvas normal). Coordinacion via `vistaMapaActiva` y registry central de L5.
  - `InspectorEntidad.tsx` (522 LOC) es territorio L6; L1 solo usa el slot estable `data-testid="inspector-entidad-acciones"` que dejo abierto.
  - `StyleControls.tsx` (309 LOC) es territorio L1 para "aplicar a seleccion".
  - `PanelOpl.tsx` (435 LOC) es territorio L3 para chevrons jerarquicos.
  - `ArbolOpd.tsx` (539 LOC) es territorio L5 para Ctrl+arrows, divisor, menu contextual y toggle nombres.
  - `PanelCarpetas.tsx` (609 LOC) lo tocan L3 (item "Abrir en pestana") y L4 (drag-drop + cut/paste + glifos). El orden L4 antes de L3 reduce colision: L4 reescribe handlers de tile; L3 inserta un item al final del menu contextual existente.
  - `App.tsx` (108 LOC) lo tocan todas para montar modales/handlers globales. Cada linea agrega su modal/listener al final del JSX y registra/desregistra en mount/unmount. L1 instala handlers globales de teclado en bruto; L5 los migra al registry central manteniendo comportamiento.
- **Atajos globales coordinados**:
  - `Ctrl+S` = guardar (L5 registra).
  - `Ctrl+F` = busqueda intra-modelo (L5 registra; existe ronda 6).
  - `Ctrl+Shift+F` = busqueda global (L5 registra apuntando a accion L4).
  - `Ctrl+D` = abrir Gestion del Arbol (L5 registra; existe ronda 6).
  - `Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z` = undo/redo (L5 registra).
  - `Ctrl+A` = seleccionar todo en OPD (L5 registra apuntando a accion L1).
  - `Ctrl+C / Ctrl+V` = copiar/pegar visual (L5 registra apuntando a L1).
  - `Delete / Esc / Flechas / Shift+Flechas` = seleccion + nudge (L5 registra apuntando a L1).
  - `Ctrl+ArrowUp/Down/Left/Right` = navegar OPD (L5 implementa y registra).
  - `Ctrl+T / Ctrl+W / Ctrl+Tab` = pestanas (L5 registra; placeholders no-op si L3 aun no mergeo).
  - `Ctrl+0` = fit-to-screen (L5 registra).
  - `Ctrl+rueda` = zoom canvas/mapa (L2 mapa; L5 canvas normal).
- **Reporte unificado**: cada agente debe devolver hashes, tests, decisiones y bloqueos para que la consolidacion reescriba un unico `docs/HANDOFF.md`.
- **Criterio de rechazo**: una linea que toca archivos fuera de su scope sin consultar debe rebasearse o reescribirse antes de mergear.
- **Verificacion final post-ronda 7**: ejecutar `cd app && bun run check && bun run browser:smoke && bun run build`, luego `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real` y registrar el delta de avance HU. Linea base post-ronda 6: 412 unit tests / 2006 expect, 37/37 smoke (40.0 s), bundle 915 KB / 261 KB gzip, detector 47/49 reglas. Objetivo conservador post-ronda 7: >= 500 tests, >= 45 smoke, detector >= 47/49, M0 >= 73%, MVP-alpha >= 55%, MVP-beta >= 38%.
