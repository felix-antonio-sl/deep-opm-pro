# Prompt de asignación — Ronda 9

Plantilla genérica para invocar a un agente sobre una línea específica + invocaciones concretas listas para copia-pega + reglas duras comunes + loop verde obligatorio.

## Plantilla genérica

Copia el bloque siguiente, sustituye `{{LINEA}}` por el ID (`L1`, `L2`, `L3`, `L4`, `L5`) y `{{PATH_BRIEF}}` por el path absoluto al brief de la línea, antes de enviarlo al agente.

```
Toma control de la línea {{LINEA}} de la ronda 9 de deep-opm-pro.

Repo: /home/felix/projects/deep-opm-pro
Base: main @ 95e0b59 (post-consolidación ronda 8)

Lee primero, en este orden:
1. {{PATH_BRIEF}}
2. /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda9/README.md
3. /home/felix/projects/deep-opm-pro/docs/HANDOFF.md
4. SSOT relevante en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/ según el dominio de tu línea

Antes de codificar, captura:
- Lista exacta de archivos permitidos (sección §4 del brief).
- Contrato observable a preservar (sección §5 + §9).
- Comandos de verificación (sección §8).
- Decisiones que tomarás vos (sección §10).

Reglas duras comunes (no negociables):
1. Scope estricto: solo archivos permitidos. Si aparece cambio cross-line, detente y reporta.
2. APIs públicas estables: ningún rename de función exportada, ningún cambio de firma.
3. Tests existentes intactos: si un test falla, hay bug en la partición; rebasea, no parchees el test.
4. Patrón barrel re-export para superficies con consumidores externos.
5. Citas explícitas: cada decisión arquitectural cita SSOT (id de sección) o documento interno (path absoluto + línea).
6. Reuso obligatorio del corpus interno: revisa opm-extracted/ en profundidad antes de inventar.
7. No introducir dependencias nuevas (ni libs, ni framework, ni utilidades nuevas).
8. Si descubres bug fuera de scope: entrega como patch a /tmp/, NO commitees ni mezcles con tu trabajo.
9. Idiomas: docs y mensajes en es-CL; identificadores en estilo del repo.
10. No tocar docs/HANDOFF.md, docs/historias-usuario-v2/, docs/JOYAS.md, docs/instrucciones-lineas-dev/ronda1..8/.
11. No tocar archivos sueltos del operador en working tree raíz, customShapes.ts, in-vivo-test.mjs, home/.
12. EPICA-70 (OPCAT) y EPICA-91 (tutorial) descartadas del proyecto desde 2026-05-05; no proponerlas.

Loop verde obligatorio antes de cerrar:
- cd app && bun run check
- cd app && bun run browser:smoke (si tu línea toca UI o render)
- cd app && bun run build (si tu línea toca proyección o bundle)
- node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real (NO ejecutar tú; lo hace consolidación final)

Forma del entregable (al cerrar):
- Hash final del último commit en main.
- LOC final de archivos tocados (`wc -l`).
- Output de cada comando de verificación (último tail).
- Lista de tests aditivos creados + conteo.
- Decisiones declaradas (de §10 del brief).
- Bloqueos o desviaciones explícitas con rationale.
- Confirmación de archivos no tocados (de §11 del brief).

Si dudás de un caso límite: detente y reporta al operador antes de actuar. Mejor pausar que invadir scope.

Co-author footer en commits si corresponde (Codex / OpenAI Codex u otro implementador externo).
```

## Invocaciones concretas listas para copia-pega

### L1 — Operaciones por dominio

```
Toma control de la línea L1 de la ronda 9 de deep-opm-pro.

Repo: /home/felix/projects/deep-opm-pro
Base: main @ 95e0b59 (post-consolidación ronda 8)
Worktree DEDICADO: git worktree add /tmp/r9-l1 main (no compartir working tree con otras líneas)

Lee primero, en este orden:
1. /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda9/linea-1-operaciones-dominios.md
2. /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda9/README.md
3. /home/felix/projects/deep-opm-pro/docs/HANDOFF.md
4. SSOT en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md (axiomas, glosario)

Mision: romper el monolito app/src/modelo/operaciones.ts (1743 LOC) en 7 sub-archivos por dominio (creacion, refinamiento, entidad, estados, enlaces, apariencias, eliminacion) + barrel re-export. APIs publicas estables. operaciones.test.ts intacto (1185 LOC). 38 consumidores preservados.

Reglas duras: ver README.md §2 y prompt-asignacion.md secciones globales.
Loop verde: bun run check (no requiere browser:smoke ni build).

Forma del entregable: ver §11 del brief.

Co-author footer si corresponde.
```

### L2 — Handlers JointCanvas por familia

```
Toma control de la línea L2 de la ronda 9 de deep-opm-pro.

Repo: /home/felix/projects/deep-opm-pro
Base: main @ 95e0b59 (post-consolidación ronda 8)

Lee primero:
1. /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda9/linea-2-jointcanvas-handlers.md
2. /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda9/README.md
3. /home/felix/projects/deep-opm-pro/docs/HANDOFF.md §Decisiones Vigentes (composers L2 ronda 8 estabilizados)
4. SSOT en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-visual-es.md (V-1..V-240)
5. opm-extracted/src/app/configuration/rappidEnviromentFunctionality/selectionConfiguration.ts (5-65)

Mision: romper app/src/render/jointjs/JointCanvas.tsx (697 LOC) en 6-8 sub-archivos por familia de handlers (seleccion, zoom, pan opcional, rubberBand, teclado opcional, drag, hoverOpl, toolsEnlace) + helpers compartidos. JointCanvas.tsx queda como orquestador < 200 LOC. Composers L2 ronda 8 son lectura.

Reglas duras: ver README.md §2 y prompt-asignacion.md secciones globales.
Loop verde: bun run check + bun run browser:smoke (40/40) + bun run build (sin regresion de chunks).

Forma del entregable: ver §11 del brief.

Co-author footer si corresponde.
```

### L3 — Asistente por etapa

```
Toma control de la línea L3 de la ronda 9 de deep-opm-pro.

Repo: /home/felix/projects/deep-opm-pro
Base: main @ 95e0b59 (post-consolidación ronda 8)

Lee primero:
1. /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda9/linea-3-asistente-etapas.md
2. /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda9/README.md
3. /home/felix/projects/deep-opm-pro/docs/HANDOFF.md
4. SSOT en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/metodologia-opm-es.md (workflow OPM)

Mision: romper app/src/ui/AsistenteNuevoModelo.tsx (935 LOC) en 11 sub-componentes por etapa + orquestador Asistente.tsx + AsistenteNuevoModelo.tsx barrel. Lógica del wizard en el store NO se toca. Comportamiento observable identico (data-testid preservados). Beneficio opcional: reducir chunk feature-asistente con imports dinamicos por etapa.

Reglas duras: ver README.md §2 y prompt-asignacion.md secciones globales.
Loop verde: bun run check + bun run browser:smoke (40/40) + bun run build (reportar tamaño chunk feature-asistente).

Forma del entregable: ver §11 del brief.

Co-author footer si corresponde.
```

### L4 — Undo per-pestaña

```
Toma control de la línea L4 de la ronda 9 de deep-opm-pro.

Repo: /home/felix/projects/deep-opm-pro
Base: main @ 95e0b59 (post-consolidación ronda 8)

Lee primero:
1. /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda9/linea-4-undo-per-pestana.md
2. /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda9/README.md
3. /home/felix/projects/deep-opm-pro/docs/HANDOFF.md §Decisiones Vigentes y §Pendientes Inmediatos (deuda heredada ronda 7)
4. opm-extracted/src/app/modules/app/context.service.ts (5-130)
5. opm-extracted/src/app/modules/app/tabsService.ts (5-130)
6. /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda7/linea-3-multi-pestana-bloques-opl.md (si existe)

Mision: cablear commitModelo/deshacerRuntime/rehacerRuntime para empujar al historialUndo de la pestaña activa en lugar de undoStack global. APIs publicas preservadas (commitModelo, deshacer, rehacer, puedeDeshacer, puedeRehacer). Decision de alternativa A (redoStack global con clear) vs B (Pestana.historialRedo) declarada en commit.

Reglas duras: ver README.md §2 y prompt-asignacion.md secciones globales.
Loop verde: bun run check + bun run browser:smoke (41/41 con smoke nuevo cross-pestaña).

Forma del entregable: ver §11 del brief.

Co-author footer si corresponde.
```

### L5 — Tipos por dominio

```
Toma control de la línea L5 de la ronda 9 de deep-opm-pro.

Repo: /home/felix/projects/deep-opm-pro
Base: main @ 95e0b59 (post-consolidación ronda 8)

Lee primero:
1. /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda9/linea-5-tipos-dominios.md
2. /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda9/README.md
3. /home/felix/projects/deep-opm-pro/docs/HANDOFF.md
4. SSOT en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md (definiciones canónicas)
5. opm-extracted/src/app/models/DrawnPart/OpmObject.ts (5-15), models/Logical/AggregationLink.ts

Mision: romper app/src/modelo/tipos.ts (241 LOC, fan-in 122) en 11 sub-archivos por dominio + barrel re-export. Cero diff runtime (tipos son zero-cost). 122 consumidores intactos. NO tocar app/src/store/tipos.ts (otro archivo, otra línea).

Reglas duras: ver README.md §2 y prompt-asignacion.md secciones globales.
Loop verde: bun run typecheck (crítico) + bun run check.

Forma del entregable: ver §11 del brief.

Co-author footer si corresponde.
```

## Notas operativas

### Worktrees

- **L1 OBLIGATORIAMENTE en worktree dedicado**: `git worktree add /tmp/r9-l1 main`. No compartir árbol con L2-L5.
- **L2-L5 pueden trabajar en main directo** o en worktrees individuales (preferible si hay implementadores paralelos). Si trabajan en main directo, coordinar para no pisarse: cada línea solo edita sus archivos permitidos (§4 del brief).

### Coherencia metodológica

- **Patrón canónico ronda 8 + ronda 9**: barrel re-export + sub-archivos por dominio. No improvisar.
- **Reportar cierre con métricas explícitas**: LOC, tests, smokes, decisiones tomadas. No "está listo, pasa todo" — entrega evidencia.
- **Si descubres deuda oculta no relacionada**: documentar en commit como observación; bug cross-line se entrega como patch a `/tmp/`.

### Reporte unificado al operador

Tras todas las líneas commiteadas, la consolidación final hace:

1. `cd app && bun run check` (full suite verde).
2. `cd app && bun run browser:smoke` (40+/40+ con smokes nuevos).
3. `cd app && bun run build` (chunks reportados).
4. `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real` (detector ≥ 55 reglas, idealmente más).
5. Resolución de cascadas residuales (test legacy, recalibración detector si surgen archivos nuevos no mapeados, etc.).
6. Update de `docs/HANDOFF.md` como handoff único (consolidación ronda 9).
7. Commits semánticos: `fix(test): ...`, `chore(detector): ...`, `chore(ledger): ...`, `docs(handoff): consolida ronda 9`.

### Anti-patrones a evitar

- **Comentarios señuelo en barrels** para satisfacer detector regex sin tener evidencia real (lección ronda 8).
- **Renames "limpieza" de exports** que rompen consumidores.
- **Mover tipos entre `tipos.ts` (modelo) y `tipos.ts` (store)** — son archivos distintos.
- **Tocar `operaciones.test.ts` o smokes existentes** "porque están feos" — son contrato observable.
- **Introducir dependencias nuevas** "porque ahorrarían tiempo".
- **Mezclar refactor con feature** — esta ronda es 100% refactor (con la excepción de undo per-pestaña que es deuda funcional).
