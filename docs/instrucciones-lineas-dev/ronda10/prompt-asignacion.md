# Prompt de asignación — Ronda 10

Plantilla genérica para invocar a un agente sobre una línea específica + invocaciones concretas + reglas duras + loop verde.

## Plantilla genérica

Copia el bloque siguiente, sustituye `{{LINEA}}` y `{{PATH_BRIEF}}`, y envíalo al agente.

```
Toma control de la línea {{LINEA}} de la ronda 10 de deep-opm-pro: ronda de FEATURES post-MVP-α tras 2 rondas de refactor estructural cerradas (8, 9, 9.5).

Repo: /home/felix/projects/deep-opm-pro
Base: main @ 010e3c7 (post-9.5, cero deuda estructural pendiente, detector 55/55)

Lee primero, en este orden:
1. {{PATH_BRIEF}}
2. /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda10/README.md (filosofía features post-refactor + reglas duras §2)
3. /home/felix/projects/deep-opm-pro/docs/HANDOFF.md (decisiones vigentes rondas 1-9.5 que NO se reabren)
4. SSOT relevante en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/ según la línea.

Antes de codificar, captura:
- Lista exacta de archivos permitidos (§4 del brief).
- HU eje cubiertas + estado actual (§2).
- Contrato observable a preservar (APIs públicas estables, JSON lossless donde aplica).
- Comandos de verificación (§8).
- Decisiones que tomarás (§10).

Reglas duras comunes (no negociables):
1. **Aditividad**: tipos opcionales (`?:`), funciones nuevas exportadas, NO renames, NO breaks de firma pública.
2. **Scope estricto**: solo archivos permitidos. Si aparece cambio cross-line, detente y reporta.
3. **Tests existentes intactos**: 561 baseline pasa sin tocar.
4. **JSON roundtrip lossless**: cargar JSON pre-ronda 10 produce modelo válido. Tests `serializacion/json.test.ts` pasan sin tocar.
5. **OPL invariante donde aplica**: HU-19.015 (imágenes), oraciones existentes preservadas; oraciones nuevas son aditivas.
6. **Patrón canónico (rondas 8-9-9.5)**: barrel + sub-archivos por dominio. Si una línea agrega un archivo grande nuevo, ubicarlo en el subdirectorio correcto.
7. **Citas explícitas**: cada decisión arquitectural cita SSOT (id sección) o documento interno (path absoluto + línea).
8. **Reuso obligatorio del corpus interno**: revisa opm-extracted/ en profundidad antes de inventar.
9. **No introducir dependencias nuevas** (libs, frameworks, utilidades).
10. **Si descubres bug fuera de scope**: entrega como patch a /tmp/, NO commitees ni mezcles.
11. **Idiomas**: docs y mensajes en es-CL; identificadores en estilo del repo.
12. **No tocar**: docs/HANDOFF.md, docs/historias-usuario-v2/, docs/JOYAS.md, docs/instrucciones-lineas-dev/ronda1..9.5/, customShapes.ts, in-vivo-test.mjs, home/.
13. **EPICA-70/91 descartadas del proyecto** desde 2026-05-05; no proponerlas.
14. **No reabrir contratos rondas 1-9.5** (HANDOFF §Decisiones Vigentes).

Loop verde obligatorio antes de cerrar:
- cd app && bun run check          (561+ tests, sin regresion)
- cd app && bun run browser:smoke  (40+/40+ con tus smokes nuevos)
- cd app && bun run build          (chunk principal sin regresión grave)
- node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real (NO ejecutar tú; lo hace consolidación)

Forma del entregable (al cerrar):
- Hash final del último commit en main.
- LOC nuevos por archivo (`wc -l`).
- Output de cada comando de verificación (último tail).
- Lista de tests aditivos creados + conteo (~10-12 esperados).
- Lista de smokes aditivos + conteo (~3-5 esperados).
- Decisiones declaradas (§10 del brief).
- HU cerradas con id (de §2 del brief).
- Bloqueos o desviaciones explícitas con rationale.
- Confirmación de archivos no tocados (de §11 del brief).

Si dudás de un caso límite: detente y reporta al operador antes de actuar. Mejor pausar que invadir scope.

Co-author footer en commits si corresponde.
```

## Invocaciones concretas listas para copia-pega

### L1 — Grid + snap + auto-tamaño + alineación

```
Toma control de la línea L1 de la ronda 10 de deep-opm-pro: cierre EPICA-1A completa (18 HU).

Repo: /home/felix/projects/deep-opm-pro
Base: main @ 010e3c7

Lee primero:
1. docs/instrucciones-lineas-dev/ronda10/linea-1-grid-snap-autosize.md
2. docs/instrucciones-lineas-dev/ronda10/README.md (reglas duras §2, mapa colisiones §7, protocolo merge §8)
3. docs/HANDOFF.md (decisiones vigentes; NO reabrir multi-seleccion, modo barra creacion sticky, etc.)
4. SSOT en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-visual-es.md V-* (dimensiones canonicas)
5. docs/JOYAS.md §dimensiones (135x60 default preservado)

Mision: agregar grid + snap + auto-tamano + handles de resize + alinear/distribuir multi-seleccion. Apariencia.modoTamano? aditivo, PreferenciasUiUsuario.gridConfig? aditivo. Composer/handler nuevos para resize. Toolbar extendida. EPICA-1A completa (18 HU pendientes -> cubiertas).

Reglas duras: ver README §2 + plantilla genérica.
Loop verde: bun run check + bun run browser:smoke + bun run build.

Forma del entregable: ver §11 del brief.

Co-author footer si corresponde.
```

### L2 — Modificadores avanzados de enlace + ruta editable + advertencia consumo

```
Toma control de la línea L2 de la ronda 10 de deep-opm-pro: cerrar EPICA-15 al 95%+ + modificadores enlace canónicos.

Repo: /home/felix/projects/deep-opm-pro
Base: main @ 010e3c7

Lee primero:
1. docs/instrucciones-lineas-dev/ronda10/linea-2-modificadores-enlace.md
2. docs/instrucciones-lineas-dev/ronda10/README.md
3. docs/HANDOFF.md
4. SSOT opm-iso-19450-es.md §Modifiers, opm-opl-es.md D5-D8 (oraciones modificador)
5. opm-extracted/src/app/models/Logical/OpmLogicalLink.ts (si existe; patrón referencial)

Mision: agregar Enlace.subtipoModificador? (refinamiento de modificador para distinguir badges C/E/¬), render markers, OPL refinado con probabilidad, dialogo Mover Puerto, advertencia consumo duplicado. ~10 HU. EPICA-15 pasa de 18+1/23 a ~22+1/23.

Reglas duras: ver README §2.
Loop verde: bun run check + bun run browser:smoke + bun run build.

Forma del entregable: ver §11 del brief.
```

### L3 — Descomposición avanzada (timeline + reasignación + paralelo + ambiental)

```
Toma control de la línea L3 de la ronda 10 de deep-opm-pro: cerrar EPICA-12 al 95%+.

Repo: /home/felix/projects/deep-opm-pro
Base: main @ 010e3c7

Lee primero:
1. docs/instrucciones-lineas-dev/ronda10/linea-3-descomposicion-avanzada.md
2. docs/instrucciones-lineas-dev/ronda10/README.md
3. docs/HANDOFF.md
4. SSOT opm-iso-19450-es.md §in-zooming, opm-opl-es.md (oracion paralelo)
5. opm-extracted/src/app/configuration/rappidEnviromentFunctionality/in-zooming/ (si existe)

Mision: timeline reordenable por drag vertical, reasignacion manual de externos desde Inspector, deteccion de subprocesos paralelos en Y similar (toleranciaY=4), renombrado inline, ambiental clamp interior. ~7 HU. EPICA-12 pasa de 18+10/31 a ~26+5/31.

Reglas duras: ver README §2.
Loop verde: bun run check + bun run browser:smoke + bun run build.

Forma del entregable: ver §11 del brief.
```

### L4 — Imágenes incrustadas (URL + modos + render compuesto + cache)

```
Toma control de la línea L4 de la ronda 10 de deep-opm-pro: agregar imagenes incrustadas (EPICA-19 single-user).

Repo: /home/felix/projects/deep-opm-pro
Base: main @ 010e3c7

Lee primero:
1. docs/instrucciones-lineas-dev/ronda10/linea-4-imagenes-incrustadas.md
2. docs/instrucciones-lineas-dev/ronda10/README.md
3. docs/HANDOFF.md (decision: imagen es presentacion, NO altera semantica OPM ni OPL HU-19.015)
4. SSOT opm-iso-19450-es.md §Object
5. opm-extracted/src/app/configuration/elementsFunctionality/imageRepoConfig.ts (referencial; NO replicar pool organizacional, single-user MVP)

Mision: Entidad.imagen? aditivo (URL externa + modo imagen/texto/imagen-texto), modal de edicion, insignia 📷 clickeable, render via composer overlay separado (NO toca composer base, patron ronda 7 badges 📄/🔗), cache + degradacion a "texto" si URL caida, supresion en cosa con refinamiento, exclusion mutua con estados visibles. ~13 HU. HU-19.004..006 (pool organizacional) difieren a multi-user.

Reglas duras especiales L4:
- composers/imagenOverlay.ts NUEVO; composers/entidad.ts INTACTO.
- OPL invariante: tests confirman que oracion entidad NO cambia con/sin imagen.

Loop verde: bun run check + bun run browser:smoke + bun run build.

Forma del entregable: ver §11 del brief.
```

### L5 — Cierre transversal MVP-α + OPL polish

```
Toma control de la línea L5 de la ronda 10 de deep-opm-pro: cierre transversal MVP-alpha (parciales pequenos + polish OPL).

Repo: /home/felix/projects/deep-opm-pro
Base: main @ 010e3c7

Lee primero:
1. docs/instrucciones-lineas-dev/ronda10/linea-5-cierre-mvp-alpha.md
2. docs/instrucciones-lineas-dev/ronda10/README.md
3. docs/HANDOFF.md
4. docs/historias-usuario-v2/shared/HU-SHARED-002-undo-redo.md, HU-SHARED-006-dirty-state.md
5. SSOT opm-opl-es.md (oraciones D5-D8)

Mision: cerrar parciales dispersos para mover MVP-alpha de 46.3% a ~52-55%. Dialogo Guardar/Descartar/Cancelar al cerrar dirty (HU-SHARED-006). Smokes undo por operacion (HU-SHARED-002). Botones copiar/exportar OPL + input busqueda en panel (HU-50.023/.024/.025). Verificacion HU-50.013 "ocurren" + .015 "es un/una". Extraer todas las partes plegadas (HU-18.013). Smoke split de efecto end-to-end (HU-13.015). ~12 HU.

Reglas duras: ver README §2. AditivO puro; cero kernel cambia.
Loop verde: bun run check + bun run browser:smoke (47+/47+ esperado).

Forma del entregable: ver §11 del brief.
```

## Notas operativas

### Worktrees

- **NO se requieren worktrees dedicados en ronda 10**: las 5 líneas son aditivas y disjuntas en archivos editados.
- Si trabajan implementadores en paralelo, coordinar en `Toolbar.tsx`, `acciones-canvas.ts`, `acciones-ui.ts`, `acciones-entidad.ts`, `opm-smoke.spec.ts`, `validaciones.ts`, `handlers/{drag,seleccion}.ts` (los cross-line), agregando aditivamente al final.

### Coherencia metodológica

- **Aditividad sobre extensión**: cada feature agrega tipos opcionales y funciones nuevas. Cero rename.
- **JSON roundtrip lossless**: validador específico por línea verifica que JSON pre-ronda 10 hidrata sin pérdida.
- **OPL invariante donde aplica**: especialmente en L4 (HU-19.015).
- **Reportar cierre con métricas explícitas**: HU cerradas con id, LOC, tests, smokes, decisiones.
- **Si descubres deuda oculta no relacionada**: documentar en commit como observación; bug cross-line se entrega como patch a `/tmp/`.

### Reporte unificado al operador

Tras todas las líneas commiteadas, la consolidación final:

1. `cd app && bun run check` (suite verde, ≥600 tests).
2. `cd app && bun run browser:smoke` (≥45 smokes verde).
3. `cd app && bun run build` (chunks reportados).
4. `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real` (detector ≥55, idealmente +5-8 reglas nuevas).
5. Resolución de cascadas residuales (smokes flaky, ajustes de detector si emergen archivos nuevos).
6. Update de `docs/HANDOFF.md` como handoff único (consolidación ronda 10, MVP-α nuevo nivel).
7. Commits semánticos: `chore(detector): ...`, `chore(ledger): ...`, `docs(handoff): consolida ronda 10`.

### Anti-patrones a evitar

- **Reabrir tipos existentes** (`Apariencia.width/height`, `Enlace.modificador`, etc.). Aditivo siempre.
- **Reescribir tests** para que pasen. Si fallan, hay bug en la feature.
- **Tocar composer base** cuando hay un overlay viable (L4).
- **Introducir dependencias nuevas** "por conveniencia".
- **Pool organizacional / multi-user** (L4): difiere a futuro.
- **Edición OPL→canvas con parser** (L5): difiere; solo polish.
- **EPICA-70 OPCAT, EPICA-91 tutorial**: descartadas.
- **Comentarios señuelo en barrels** para satisfacer detector regex (lección rondas 8-9.5).
