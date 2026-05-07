# Prompt de asignación — Ronda 13.0

Una sola línea ejecutora L1 con 5 ítems TIER 1 derivados de la auditoría steipete `docs/auditorias/2026-05-07-refactor-radical-steipete.md` §2.

## Invocación L1 (única)

```
Toma control de la única línea L1 de la ronda 13.0 de deep-opm-pro: cleanup TIER 1 de la auditoría steipete (5 ítems atómicos, ~½ día, blast bajo, reversibles).

Repo: /home/felix/projects/deep-opm-pro
Base: main @ d99382e (post-ronda-12.1, MVP-α 98.8%, detector recalibrado)

Lee primero:
1. docs/instrucciones-lineas-dev/ronda13.0/linea-1-cleanup-tier1.md (brief con tablas T1.1-T1.5 + archivos permitidos + restricciones)
2. docs/instrucciones-lineas-dev/ronda13.0/README.md (filosofía + reglas + orden de commits)
3. docs/auditorias/2026-05-07-refactor-radical-steipete.md §2 (T1.1-T1.5 detallado con verificación)
4. docs/auditorias/2026-05-07-ssot-opm-extracted.md §RF-1+R4 (paths exactos T1.3)
5. docs/HANDOFF.md (decisiones vigentes; NO reabrir paleta canvas, code splitting Vite, validarNombreEntidad, etc.)

Foco (orden de commits T1.3 → T1.5 → T1.2 → T1.4 → T1.1):
- T1.3 (5 min): corregir headers SSOT en 4 archivos del modelo (paths exactos en brief §2 T1.3 tabla).
- T1.5 (15 min audit + 0-30 fix): ejecutar `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real --strict`; si emerge fix paths, hacer cleanup quirúrgico.
- T1.2 (30 min): sustituir 9 literales `#3BC3FF`/`#586D8C` activeButton/stickyBadge en Toolbar.tsx por `tokens.colors.acentoUi`/`chromeNeutral` + 2 tokens nuevos `acentoUiSuave`/`chromeNeutralSuave`. Smoke `boton-toolbar-activo` debe seguir verde.
- T1.4 (1 h): partir `app/e2e/opm-smoke.spec.ts` (3847 LOC / 93 tests) en 8 archivos por dominio (`01-carga-y-workspace` a `08-mvp-alpha-residual`). Movimiento mecánico, sin tocar lógica.
- T1.1 (10 min, AUTORIZACIÓN OPERADOR REQUERIDA): preguntar al operador antes de `git stash drop` × 5; si autorizado, ejecutar en orden inverso (4→3→2→1→0); si rechazado, omitir y documentar.

Reglas duras comunes (no negociables):

ADITIVIDAD Y SCOPE:
1. **Cero cambios kernel/render/OPL/serializadores/canvas/store** salvo lo permitido por §4 brief.
2. **Aditividad estricta**: tipos opcionales, exports nuevos, NO renames, NO breaks.
3. **Scope estricto**: solo archivos permitidos por §4 brief. Si emerge cambio cross-line, detente y reporta.
4. **Tests existentes intactos**: 673 baseline pasa sin tocar lógica; T1.4 solo redistribuye archivos.
5. **JSON lossless + OPL invariante**: ronda 13.0 NO toca generadores OPL ni serializadores.

OPERATIVA:
6. **No introducir dependencias nuevas**.
7. **Si descubres bug fuera de scope**: entrega como patch a /tmp/, NO commitees ni mezcles (regla feedback consolidada).
8. **Idiomas**: docs y mensajes UI en es-CL; identificadores en estilo del repo.
9. **No tocar**: docs/HANDOFF.md, docs/historias-usuario-v2/ (excepto progress-dashboard.mjs T1.5 si emerge fix), docs/JOYAS.md, customShapes, in-vivo-test, home/.

TIER 1 vs TIER 2/3:
10. **NO ejecutar TIER 2** (split Toolbar, tokens central completo, methodological-checkers, BarraHerramientasElemento, lazy adicional, OPL viejo/nuevo) — territorio ronda 13 grande.
11. **NO ejecutar TIER 3** (Zustand→signals, JointJS→canvas custom, etc.) — espera evento gatillante.

T1.1 STASHES (DESTRUCTIVO):
12. **PREGUNTAR AL OPERADOR antes de cualquier `git stash drop`**. Mostrar `git stash list` + propuesta de drop. Esperar go-ahead explícito. Si NO autorizado, omitir el commit T1.1 y documentar en commit consolidación final con rationale.

Loop verde obligatorio antes de cerrar:
- cd app && bun run check          (673 → 675 esperado por +2 tokens.test)
- cd app && bun run browser:smoke  (86 redistribuidos en 8 archivos; misma cobertura)
- cd app && bun run build          (chunk principal sin crecimiento)
- node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real --strict (clean o con fix aplicado)

Forma del entregable (al cerrar):
- Hash final del último commit en main.
- LOC delta por archivo (`git diff --stat HEAD~5 HEAD` o ~6 si T1.5 fix).
- Output de cada comando de verificación (último tail).
- Lista de commits creados en orden + rationale por uno.
- Decisiones declaradas (§10 brief).
- Estado final `git stash list` (vacío si autorizado, sino con explicación).
- Resultado `--strict` (clean / N fixes con paths).
- Confirmación archivos no tocados (de §5 brief).

Si dudás de un caso límite: detente y reporta al operador antes de actuar.

Co-author footer en commits si corresponde.
```

## Cierre de ronda 13.0

Una vez los 5 ítems ejecutados (4 si T1.1 rechazado), el operador (no una línea separada) ejecuta consolidación:

1. Confirmar `bun run check` + `bun run browser:smoke` + `bun run build` verde.
2. Confirmar `--strict` clean o con N fixes documentados.
3. NO actualizar HANDOFF (ronda 13.0 es cleanup técnico; el HANDOFF refleja el estado tras ronda 13 grande).
4. Push directo a `main` (commits atómicos no requieren rama).

## Próximo paso post-ronda-13.0

**Ronda 13 grande** (4 líneas paralelas, ~3-5 días):
- L1: T2.1 split Toolbar opción B (descomposición por estado del editor) + T2.6 lazy adicional MapaSistema/Timeline/TablaEnlaces/GestionArbolOpd
- L2: T2.2 + T2.4 tokens.ts central completo + spacing/radii/shadows/typography + ESLint rule + migración 108 ocurrencias
- L3: T2.3 destilar 6 methodological-checkers desde opm-extracted + integración como panel hermano de PanelAvisos
- L4: T2.5 BarraHerramientasElemento.tsx flotante (12 acciones primarias OPCloud, 6 inicial + "···" → Inspector)

T2.7 (OPL viejo vs nuevo) NO entra: recomendación steipete es mantener separados. Documentar en HANDOFF.

Briefs de ronda 13 grande generados en paralelo a ronda 13.0; ver `docs/instrucciones-lineas-dev/ronda13/`.
