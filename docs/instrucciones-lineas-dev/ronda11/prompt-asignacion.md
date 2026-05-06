# Prompt de asignación — Ronda 11

Plantilla genérica para invocar a un agente sobre una línea específica + invocaciones concretas + reglas duras + loop verde.

## Plantilla genérica

Copia el bloque siguiente, sustituye `{{LINEA}}` y `{{PATH_BRIEF}}`, y envíalo al agente.

```
Toma control de la línea {{LINEA}} de la ronda 11 de deep-opm-pro: ronda de CIERRE MVP-α tras 3 rondas de refactor estructural (8, 9, 9.5) + 1 ronda de features (10) + recalibración detector ronda 10.

Repo: /home/felix/projects/deep-opm-pro
Base: main @ d94903d (post-recalibración detector ronda 10, MVP-α 50.0% ponderado, detector 72/72)

Lee primero, en este orden:
1. {{PATH_BRIEF}}
2. /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda11/README.md (filosofía cierre MVP-α + reglas duras §2 + mapa colisiones §7 + protocolo merge §8)
3. /home/felix/projects/deep-opm-pro/docs/HANDOFF.md (decisiones vigentes rondas 1-10 que NO se reabren)
4. SSOT relevante en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/ según la línea.

Antes de codificar, captura:
- Lista exacta de archivos permitidos (§4 del brief).
- HU eje cubiertas + estado actual (§2 del brief).
- Contrato observable a preservar (APIs públicas estables, JSON lossless donde aplica).
- Comandos de verificación (§9 del brief).
- Decisiones que tomarás (§10 del brief).

Reglas duras comunes (no negociables):
1. **Aditividad**: tipos opcionales (`?:`), funciones nuevas exportadas, NO renames, NO breaks de firma pública.
2. **Scope estricto**: solo archivos permitidos. Si aparece cambio cross-line, detente y reporta.
3. **Tests existentes intactos**: 597 baseline pasa sin tocar.
4. **JSON roundtrip lossless**: cargar JSON pre-ronda 11 produce modelo válido. Tests `serializacion/json.test.ts` pasan sin tocar.
5. **OPL invariante donde aplica**: oraciones existentes preservadas; oraciones nuevas son aditivas.
6. **Patrón canónico (rondas 8-10)**: barrel + sub-archivos por dominio + composer overlay separado para features visuales aditivas.
7. **Citas explícitas**: cada decisión arquitectural cita SSOT (id sección) o documento interno (path absoluto + línea).
8. **Reuso obligatorio del corpus interno**: revisa opm-extracted/ en profundidad antes de inventar.
9. **No introducir dependencias nuevas** (libs, frameworks, utilidades).
10. **Si descubres bug fuera de scope**: entrega como patch a /tmp/, NO commitees ni mezcles.
11. **Idiomas**: docs y mensajes UI en es-CL; identificadores en estilo del repo.
12. **No tocar**: docs/HANDOFF.md, docs/historias-usuario-v2/, docs/JOYAS.md, docs/instrucciones-lineas-dev/ronda1..10/, customShapes.ts, in-vivo-test.mjs, home/.
13. **EPICA-70/91 descartadas del proyecto** desde 2026-05-05; no proponerlas.
14. **No reabrir contratos rondas 1-10** (HANDOFF §Decisiones Vigentes incluyendo aditividad estricta, cache imagen no-serializable, single-user EPICA-19, exclusión imagen/estados, gridConfig fuera del JSON OPM, composer overlay separado).
15. **Detector ledger es territorio L5**: cada línea declara internamente sus reglas detector pero NO edita progress-dashboard.mjs (excepto L5).

Loop verde obligatorio antes de cerrar:
- cd app && bun run check          (597+ tests, sin regresión)
- cd app && bun run browser:smoke  (59+/59+ con tus smokes nuevos; smoke 854 conocido flaky → reintento normalmente verde)
- cd app && bun run build          (chunk principal sin regresión grave; objetivo < 185 KB / < 50 KB gzip al cierre)
- node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real (NO ejecutar tú; lo hace consolidación)

Forma del entregable (al cerrar):
- Hash final del último commit en main.
- LOC nuevos por archivo (`wc -l`).
- Output de cada comando de verificación (último tail).
- Lista de tests aditivos creados + conteo.
- Lista de smokes aditivos + conteo.
- Decisiones declaradas (§10 del brief).
- HU cerradas con id (de §2 del brief).
- Reglas detector que esta línea declara para consolidación L5 (§8 del brief).
- Bloqueos o desviaciones explícitas con rationale.
- Confirmación de archivos no tocados (de §11 del brief).

Si dudás de un caso límite: detente y reporta al operador antes de actuar. Mejor pausar que invadir scope.

Co-author footer en commits si corresponde.
```

## Invocaciones concretas listas para copia-pega

### L1 — Árbol OPD completo (navegación + interacción + gestión modal)

```
Toma control de la línea L1 de la ronda 11 de deep-opm-pro: cierre EPICA-20 árbol OPD completa (12 HU pendientes).

Repo: /home/felix/projects/deep-opm-pro
Base: main @ d94903d

Lee primero:
1. docs/instrucciones-lineas-dev/ronda11/linea-1-arbol-opd.md
2. docs/instrucciones-lineas-dev/ronda11/README.md (reglas duras §2, mapa colisiones §7, protocolo merge §8)
3. docs/HANDOFF.md (decisiones vigentes; NO reabrir undo per-pestaña, multi-pestaña sesión-only, divisor árbol/canvas, atajos centralizados)
4. SSOT en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/metodologia-opm-es.md (jerarquía SDn)

Foco:
- Atajos teclado Ctrl+↑/↓, F2, Ctrl+E, Ctrl+Shift+E, Ctrl+D
- Renombrado inline + drag manual + reorden automático
- Menú contextual extendido + DialogoGestionArbol nuevo

Archivos permitidos: §4 del brief.
Archivos prohibidos: acciones-canvas.ts (territorio L3+L4), Toolbar.tsx (territorio L2/L4/L5), MenuPrincipal.tsx (territorio L2+L5), Dialogo*.tsx EXCEPTO el DialogoGestionArbol nuevo (territorio L2), runtime.ts (territorio L2+L5), progress-dashboard.mjs (territorio L5).

[plantilla genérica de reglas duras + loop verde + entregable]
```

### L2 — Persistencia + diálogos modales canónicos

```
Toma control de la línea L2 de la ronda 11 de deep-opm-pro: cierre EPICA-30 persistencia (16 pendientes + 5 parciales = 21 HU).

Repo: /home/felix/projects/deep-opm-pro
Base: main @ d94903d

Lee primero:
1. docs/instrucciones-lineas-dev/ronda11/linea-2-persistencia-dialogos.md
2. docs/instrucciones-lineas-dev/ronda11/README.md
3. docs/HANDOFF.md (decisiones vigentes; NO reabrir importación JSON no auto-persiste, modelo post-asistente queda dirty, workspace single-user MVP, autosalvado, estado dirty)
4. SSOT en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/metodologia-opm-es.md §persistencia.

Foco:
- PantallaInicio NUEVA con grid recientes + telón
- DialogoCargarModelo extendido (tiles/lista, glifos, búsqueda)
- DialogoGuardarComo + descripción
- Versiones (toggle + log-scale)
- Archivados (toggle + auto-archivar 90d + restaurar)
- Autosalvado 5 min con glifo
- Renombrar modelo desde menú principal
- Cargar Ejemplo Organizacional

Archivos permitidos: §4 del brief.
Archivos prohibidos: acciones-opd.ts (L1), ArbolOpd.tsx + arbol/* (L1), DialogoGestionArbol.tsx (L1), PanelOpl.tsx + panelOpl/* (L3), BibliotecaCosa.tsx + MenuTipoEnlace.tsx + DialogoEstiloEnlace.tsx (L4), runtime.ts excepto solicitarConfirmacion (L5), progress-dashboard.mjs (L5).

[plantilla genérica de reglas duras + loop verde + entregable]
```

### L3 — Panel OPL polish

```
Toma control de la línea L3 de la ronda 11 de deep-opm-pro: cierre EPICA-50 panel OPL (8 HU pendientes).

Repo: /home/felix/projects/deep-opm-pro
Base: main @ d94903d

Lee primero:
1. docs/instrucciones-lineas-dev/ronda11/linea-3-panel-opl-polish.md
2. docs/instrucciones-lineas-dev/ronda11/README.md
3. docs/HANDOFF.md (decisiones vigentes; NO reabrir OPL-ES como lente derivada, hover OPL↔canvas, bloques OPL jerárquicos)
4. SSOT en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-opl-es.md D5-D8 (bloques OPL).

Foco:
- Toolbar superior NUEVA con botones canónicos
- Toggle 123 numeración + posición lateral + minimizar/restaurar
- Indentación jerárquica + colapsar bloques
- Selección enlace específico en oración multi-enlace
- Toggle AI Text (placeholder, NO implementar funcional)

Archivos permitidos: §4 del brief.
Archivos prohibidos: generadores OPL (opl/generar.ts, opl/generadores/*) — la estructura de oraciones es invariante, NO tocar; acciones-opd.ts (L1), arbol/* (L1), Dialogo* (L2), Toolbar.tsx (L2/L4/L5), Inspector* (L4), runtime.ts y progress-dashboard.mjs (L5).

[plantilla genérica de reglas duras + loop verde + entregable]
```

### L4 — Modelado canónico (drag desde toolbar + biblioteca + reanclaje + lote + propiedades enlace)

```
Toma control de la línea L4 de la ronda 11 de deep-opm-pro: cierre EPICA-10 (12 HU vivas) + EPICA-11 (10 HU vivas) = 22 HU.

Repo: /home/felix/projects/deep-opm-pro
Base: main @ d94903d

Lee primero:
1. docs/instrucciones-lineas-dev/ronda11/linea-4-modelado-canonico.md
2. docs/instrucciones-lineas-dev/ronda11/README.md
3. docs/HANDOFF.md (decisiones vigentes; NO reabrir multi-selección, modo barra creación sticky, abanicos OR/XOR, modificadores existentes, multiplicidad canónica, vértices manuales, estilo de enlace, alias/unidad/descripción/URLs)
4. SSOT en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md (firmas enlace) + opm-visual-es.md (propiedades visuales) + opm-opl-es.md D5/T1.

Foco:
- Drag desde Toolbar al canvas (cosa nueva en posición exacta)
- MenuTipoEnlace NUEVO con tipos válidos + preview OPL + filtros
- BibliotecaCosa NUEVO panel lateral
- Reanclar extremo enlace (linkTools.SourceArrowhead/TargetArrowhead)
- DialogoEstiloEnlace NUEVO + copiar/pegar estilo
- Borrar enlaces lote
- Conectar multi-selección al todo
- Menú contextual sobre enlace
- Verificar HU-10.004 descripción + HU-11.001 modo sticky + HU-11.025 handles

Archivos permitidos: §4 del brief.
Archivos prohibidos: refinamiento (operaciones/refinamiento/*, ronda 9 + 10 L3), grid + autosize (canvas/grid.ts, composers/grid.ts, ronda 10 L1), imágenes (ModalImagenObjeto.tsx, composers/imagenOverlay.ts, imagenObjeto.ts, ronda 10 L4), acciones-opd.ts (L1), arbol/* (L1), Dialogo* persistencia (L2), PanelOpl.tsx + panelOpl/* (L3), runtime.ts y progress-dashboard.mjs (L5).

[plantilla genérica de reglas duras + loop verde + entregable]
```

### L5 — Transversales (read-only + dirty + eco OPL + nominal) + ledger ronda 11

```
Toma control de la línea L5 de la ronda 11 de deep-opm-pro: cierre HU-SHARED-002/.003/.007/.009 + HU-30.036 + HU-50.015 + recalibración detector ronda 11.

Repo: /home/felix/projects/deep-opm-pro
Base: main @ d94903d

ESTA LÍNEA SE EJECUTA AL FINAL DE LA RONDA, después de L1+L2+L3+L4 mergeadas. Si alguna está incompleta, declarar dependencia y pausar.

Lee primero:
1. docs/instrucciones-lineas-dev/ronda11/linea-5-transversales-ledger.md
2. docs/instrucciones-lineas-dev/ronda11/README.md
3. docs/HANDOFF.md (decisiones vigentes; NO reabrir slices Zustand con runtime singleton, tests legacy se preservan, detector apunta a evidencia real)
4. SSOT en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/metodologia-opm-es.md §read-only + opm-iso-19450-es.md §nombres + opm-opl-es.md §generalización.

Foco:
- Read-only flag en store + indicadores UI + redirección Guardar→Guardar Como
- Validación nominal entidades (vacío + duplicado en OPD)
- Verificación HU-50.015 "es un/una" en generalización
- Smokes undo/redo granular para comandos ronda 10/11
- Recalibración detector: agregar ~14 reglas nuevas para HU cerradas por L1+L2+L3+L4 + propias L5
- Preparar draft HANDOFF post-ronda 11 (consolidación final lo aplica)

Archivos permitidos: §4 del brief, INCLUYE progress-dashboard.mjs (exclusivo L5).
Archivos prohibidos: acciones-opd.ts (L1), ArbolOpd.tsx + arbol/* (L1), Dialogo* persistencia (L2) excepto DialogoConfirmacion.tsx, panelOpl/* (L3), BibliotecaCosa.tsx + MenuTipoEnlace.tsx + DialogoEstiloEnlace.tsx + inspectorEnlace/* (L4), tipos del modelo OPM (los flags read-only viven en store, no en modelo).

[plantilla genérica de reglas duras + loop verde + entregable]
```

## Reglas comunes de coordinación

1. **Orden de merge**: L3 → L1 → L4 → L2 → L5 → consolidación.
2. **Cero sleep / cero polling**: cada línea opera sobre su `main` actualizada antes de empezar; al cerrar, hace `git pull --rebase` y verifica que loop verde sigue verde.
3. **Conflictos en archivos compartidos**: se resuelven a favor de la línea con scope explícito sobre el archivo (ver §7 del README); si ambas reclaman scope, se pide al operador.
4. **Bug fuera de scope** detectado por una línea: se entrega como patch a `/tmp/ronda11-bug-{nombre}.patch` y se documenta. NO se commitea.
5. **Si el detector unmatchea reglas existentes**: la línea responsable del cambio que rompió el match debe corregirla en el mismo commit (igual que ronda 8/9/9.5/10).

## Cierre de ronda

Una vez las 5 líneas mergeadas:

1. Crear/actualizar `docs/HANDOFF.md` reescribiéndolo a "post-ronda 11" (incluye nuevo estado MVP-α, decisiones de ronda 11, cascadas resueltas, métricas finales).
2. Recalibrar detector con `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real`. Esperar ≥85 reglas matched. MVP-α esperado: ≥75% ponderado.
3. Confirmar `bun run check` + `bun run browser:smoke` + `bun run build` verde.
4. Commit final: `chore(handoff): cierra ronda 11 - MVP-α ≥75%`. Push.

Si MVP-α < 75% post-ronda-11, registrar en HANDOFF las HU que quedaron sin cerrar y los rationales (HU sin evidencia code-side, HU con peso M0/M1 alto que requiere ronda 12+, etc.).
