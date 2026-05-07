# Prompt de asignación — Ronda 12.1

Plantilla genérica para invocar a un agente sobre una línea específica + invocaciones concretas + reglas duras + loop verde.

## Plantilla genérica

Copia el bloque siguiente, sustituye `{{LINEA}}` y `{{PATH_BRIEF}}`, y envíalo al agente.

```
Toma control de la línea {{LINEA}} de la ronda 12.1 de deep-opm-pro: ronda CORTA de cierre fino MVP-α + UX polish del chrome. **Coproducto disjunto por dominio funcional**: L1 cierra HU semánticas residuales (kernel + store + smokes), L2 mejora la base UI (build/bundle + paleta tokens mínima + Dialogo refactor), L3 ejecuta UX polish del chrome (tooltips + iconografía Inspector + list-logical + conteo TraerConectados + íconos en menús). Apertura UX foundation (BarraHerramientasElemento.tsx, tokens.ts central completo, split Toolbar en tres bandas, sprite-sheet modificadores procedurales, minimapa flotante, dark mode) DIFERIDA explícitamente a ronda 13 dedicada.

Repo: /home/felix/projects/deep-opm-pro
Base: main @ 3805455 (post-ronda-12, MVP-α 90.8% ponderado, detector 98/100 reglas)

Lee primero, en este orden de jerarquía SSOT:

NIVEL 1 (autoridad obligatoria):
1. SSOT relevante en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/ según la línea.
2. /home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/00-METODOLOGIA.md §6 (jerarquía SSOT y citas obligatorias por tipo HU).
3. /home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/06-PROVENANCE.md §2 (política operativa: reuso obligatorio SVGs/dimensiones/colores/tipografía/plantillas OPL).

NIVEL 2 (coherencia obligatoria):
4. /home/felix/projects/deep-opm-pro/app/src/modelo/tipos.ts (SSOT viva del modelo en TS). Ronda 12.1 NO modifica tipos kernel.

NIVEL 3 (respaldo opcional pero recomendado):
5. /home/felix/projects/deep-opm-pro/docs/JOYAS.md (paleta canónica + dimensiones + tipografía — elevado a contrato visual obligatorio por PROVENANCE §2).
6. /home/felix/projects/deep-opm-pro/assets/svg/ (inventario iconos canónicos — verificar primero con `ls assets/svg/` antes de inventar import; la mayoría de SVGs canónicos YA están en el repo).
7. /home/felix/projects/deep-opm-pro/opm-extracted/ dirigido a la línea: paths verificados en README §5 + grep amplio (`grep -ri "concepto-clave" opm-extracted/src/app -l`) ANTES de citar. Cualquier path no verificable con `ls`/`grep` se rechaza (RF-1).

CONTRATO HEREDADO:
8. {{PATH_BRIEF}} (brief de la línea).
9. /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda12.1/README.md (filosofía SSOT-céntrico §1 + reglas §2 + opm-extracted §5 + assets §5b + JOYAS §5c + citas SSOT §5d + colisiones §7 + merge §8 + anclaje §9).
10. /home/felix/projects/deep-opm-pro/docs/HANDOFF.md (decisiones vigentes rondas 1-12 que NO se reabren).
11. /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda12/README.md (referencia patrón ronda previa).

Antes de codificar, captura:
- Lista exacta de archivos permitidos (§4 del brief).
- HU eje cubiertas + estado actual (§2 del brief).
- Contrato observable a preservar (APIs públicas estables, JSON lossless, OPL invariante).
- Comandos de verificación (§9 del brief).
- Decisiones que tomarás (§10 del brief).
- Assets canónicos a reusar (§5b del README + §3 del brief). **Verificar primero con `ls assets/svg/` que el SVG existe en el repo**.

Reglas duras comunes (no negociables):

JERARQUÍA SSOT-CÉNTRICA (auditoría 2026-05-07):
1. **SSOT (nivel 1) es autoridad obligatoria**. Cada archivo nuevo o modificado materialmente cita SSOT al header según tipo de HU: `[V-xxx]` (visual), `[Glos 3.x]` (glosario ISO 19450), `[OPL-ES …]` (OPL canónica), `[Met §x]` (metodología/etapas SD), `[JOYAS §x]` (cuando aplique visualmente). Ver README §5d para mapeo por línea. RF-2 vigente.
2. **`tipos.ts` (nivel 2)** es SSOT viva en TS: ronda 12.1 NO modifica tipos kernel. Si una HU requiere campo nuevo en kernel, abortar y reportar.
3. **JOYAS y `assets/svg/` son contrato operativo obligatorio** (PROVENANCE §2). La mayoría de SVGs canónicos ya están en `assets/svg/` del repo; verificar con `ls` antes de inventar import.
4. **`opm-extracted/` es nivel 3 (respaldo técnico opcional)**. Reuso semántico, NUNCA copy 1:1. Paths verificados con `ls`/`grep` SIEMPRE.

ADITIVIDAD Y CONTRATOS:
5. **Aditividad**: tipos opcionales (`?:`), funciones nuevas exportadas, NO renames, NO breaks de firma pública.
6. **Scope estricto**: solo archivos permitidos. Si aparece cambio cross-line, detente y reporta.
7. **Tests existentes intactos**: 659 baseline pasa sin tocar.
8. **JSON roundtrip lossless**: ronda 12.1 no toca kernel ni serializadores. Verificación trivial.
9. **OPL invariante**: cero oraciones nuevas. Generadores OPL no se tocan.
10. **Patrón canónico (rondas 8-12)**: barrel + sub-archivos por dominio + composer overlay separado para features visuales aditivas + slices Zustand con runtime singleton.

OPERATIVA:
11. **No introducir dependencias nuevas** (libs, frameworks, utilidades).
12. **Si descubres bug fuera de scope**: entrega como patch a /tmp/, NO commitees ni mezcles (regla feedback consolidada).
13. **Idiomas**: docs y mensajes UI en es-CL; identificadores en estilo del repo.
14. **No tocar**: docs/HANDOFF.md, docs/historias-usuario-v2/, docs/JOYAS.md, docs/auditorias/, docs/instrucciones-lineas-dev/ronda1..12/, customShapes.ts, in-vivo-test.mjs, home/.

DIFERIMIENTOS RONDA 13/14 (ABSOLUTOS):
15. **`BarraHerramientasElemento.tsx` flotante** (element-tool-bar canónico OPCloud) DIFERIDO ronda 13. NO crear.
16. **`app/src/ui/tokens.ts` central completo + migración archivo por archivo** DIFERIDO ronda 13. L2 introduce SOLO módulo mínimo + uso puntual en Dialogo.tsx.
17. **Split `Toolbar.tsx` en tres bandas** DIFERIDO ronda 13. L3 toca solo `title=` aditivos.
18. **Sprite-sheet 17 modificadores procedurales** DIFERIDO ronda 13.
19. **Minimapa flotante, dark mode, ESLint rule color literales, validation/methodological-checking pipeline visual** DIFERIDOS ronda 13.
20. **Consolidar duplicación Toolbar Objeto/Objeto-sticky** NO se aborda en ronda 12.1 (decisión consciente, vigente desde rondas previas).
21. **EPICA-32 sub-modelos peer + HU-50.019/.020/.022 parser OPL bidireccional + HU-SHARED-007 OPL inverso editable** DIFERIDOS ronda 14 dedicada.
22. **EPICA-70/91 descartadas del proyecto** desde 2026-05-05; no proponerlas.
23. **No reabrir contratos rondas 1-12** (HANDOFF §Decisiones Vigentes).
24. **Detector ledger es territorio operador**: cada línea declara internamente sus reglas detector pero NO edita progress-dashboard.mjs.

Loop verde obligatorio antes de cerrar:
- cd app && bun run check          (659+ tests, sin regresión)
- cd app && bun run browser:smoke  (81+ smokes, sin regresión)
- cd app && bun run build          (chunk principal sin regresión grave; objetivo L2: ≤ 200 kB)
- node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real (NO ejecutar tú; lo hace consolidación operador)

Forma del entregable (al cerrar):
- Hash final del último commit en main.
- LOC nuevos por archivo (`wc -l`).
- Output de cada comando de verificación (último tail).
- Lista de tests aditivos creados + conteo.
- Lista de smokes aditivos + conteo.
- Decisiones declaradas (§10 del brief).
- HU cerradas con id (de §2 del brief).
- Reglas detector que esta línea declara para consolidación operador (§7 del brief).
- **Citas SSOT agregadas en headers** (lista por archivo: `[V-…]`, `[Glos 3.x]`, `[OPL-ES …]`, `[Met §x]`, `[JOYAS §x]`) — RF-2 vigente.
- **Assets reusados de assets/svg/** (lista explícita; obligatorio por PROVENANCE §2).
- **Patrones de opm-extracted/ reusados semánticamente** (con paths verificados con `ls`/`grep`; opcional pero recomendado).
- Bloqueos o desviaciones explícitas con rationale.
- Confirmación de archivos no tocados (de §5 del brief).

Si dudás de un caso límite: detente y reporta al operador antes de actuar. Mejor pausar que invadir scope.

Co-author footer en commits si corresponde.
```

## Invocaciones concretas listas para copia-pega

### L1 — Cierre HU semánticas MVP-α (modal nombre + cargar tiles + descomposición objeto + enlace estructural etiquetado + undo granular)

```
Toma control de la línea L1 de la ronda 12.1 de deep-opm-pro: cierre fino HU semánticas residuales MVP-α (6 HU: HU-10.003 modal nombre, HU-30.019 cargar doble clic, HU-30.020 cargar clic+botón, HU-10.021 descomposición objeto, HU-11.012 enlace estructural etiquetado, HU-SHARED-002 undo granular).

Repo: /home/felix/projects/deep-opm-pro
Base: main @ 3805455

Lee primero:
1. docs/instrucciones-lineas-dev/ronda12.1/linea-1-cierre-fino-mvp-alpha.md
2. docs/instrucciones-lineas-dev/ronda12.1/README.md (reglas §2, colisiones §7, merge §8)
3. docs/HANDOFF.md (decisiones vigentes; NO reabrir read-only flag de runtime, validarNombreEntidad, modo barra creación sticky, multi-pestaña sesión-only, undo per-pestaña)
4. SSOT en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/metodologia-opm-es.md §6 + §inzoom + opm-iso-19450-es.md §3.55 §3.69 + opm-visual-es.md V-239
5. opm-extracted/ — uso mínimo en esta línea (cosecha sobre código propio del repo, no patrones nuevos OPCloud)

Foco:
- HU-10.003 smoke modal nombre con autofocus + Enter + Esc
- HU-30.019 smoke doble clic carga tile
- HU-30.020 smoke clic + botón Cargar
- HU-10.021 verificar inzoom para objetos (acciones-canvas.ts) + smoke
- HU-11.012 wiring etiqueta enlace estructural (MenuContextualEnlace.tsx + acciones-canvas.ts si falta)
- HU-SHARED-002 tests undo granular comandos ronda 11 (operacionesBatch.test.ts)

HU-SHARED-007 OPL inverso editable DIFERIDA ronda 14 (requiere parser).

Archivos permitidos: §4 del brief.
Archivos prohibidos: Toolbar.tsx (L3), Dialogo.tsx (L2), tokens.ts (L2), App.tsx (L2), inspector/Seccion* (L3), MenuContextualEntidad/Arbol (L3), ArbolOpd/BibliotecaCosa (L3), DialogoTraerConectados (L3), DialogoCargarModelo/Plantillas (L2), generadores OPL, serializadores, progress-dashboard.mjs.

[plantilla genérica de reglas duras + loop verde + entregable]
```

### L2 — Build + bundle + paleta tokens mínima + Dialogo refactor

```
Toma control de la línea L2 de la ronda 12.1 de deep-opm-pro: base UI (bundle ≤ 200 kB + tokens.ts mínimo + Dialogo size prop + HU-30.037 cobertura Esc).

Repo: /home/felix/projects/deep-opm-pro
Base: main @ 3805455

Lee primero:
1. docs/instrucciones-lineas-dev/ronda12.1/linea-2-build-paleta-dialogo.md
2. docs/instrucciones-lineas-dev/ronda12.1/README.md
3. docs/JOYAS.md §1 (paleta canónica canvas invariante)
4. docs/HANDOFF.md (decisiones vigentes; NO reabrir paleta canvas, code splitting Vite)
5. SSOT en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/metodologia-opm-es.md §6
6. opm-extracted/src/styles/ (verificar con `ls`; referencia opcional para variables CSS canónicas, NO copiar 1:1)

Foco:
- Crear app/src/ui/tokens.ts MÍNIMO (solo paleta UI nueva: #3DA8FF acento + #1a3763 secundario + #586D8C neutral + alias canvas para referencia)
- Migrar SOLO Dialogo.tsx al token (literales #3BC3FF acento → colors.acentoUi)
- Agregar prop opcional `size?` en Dialogo.tsx (default "md" mantiene comportamiento actual; sm/lg/xl como variantes)
- Aplicar size="lg" en DialogoCargarModelo.tsx + DialogoPlantillas.tsx (remover overrides ad-hoc)
- Lazy splits IN-PLACE EN TOOLBAR.TSX para DialogoTraerConectados + DialogoPlantillas (corrección post-V1: los diálogos viven en Toolbar.tsx líneas 14/19/684-685, NO en App.tsx). Edición restringida a esos 3 puntos; coordinación con L3 garantiza hunks disjuntos.
- 3 smokes Esc cobertura HU-30.037 (DialogoVersiones, DialogoArchivados, DialogoBuscarGlobal)

NO migrar Toolbar.tsx (territorio ronda 13). NO migrar Inspector/MenuContextual (ronda 13). NO introducir tokens.spacing/radii/typography (ronda 13). NO introducir ESLint rule (ronda 13). NO modificar comportamiento Dialogo.tsx default.

Archivos permitidos: §4 del brief. **Toolbar.tsx con scope restringido** (corrección post-V1): editar SOLO líneas 14/19 (imports → lazy) y líneas 684-685 (montaje → Suspense) para los dos diálogos; cualquier otra edición es bloqueante.
Archivos prohibidos: inspector/Seccion* (L3), MenuContextual* (L1+L3), ArbolOpd/BibliotecaCosa (L3), DialogoTraerConectados (L3 agrega conteo, L2 NO lo modifica), DialogoVersiones/Archivados/BuscarGlobal solo lectura para smokes, acciones-* (L1), store/tipos (L1), generadores OPL, serializadores, progress-dashboard.mjs, App.tsx.

[plantilla genérica de reglas duras + loop verde + entregable]
```

### L3 — UX polish chrome (Toolbar tooltips + iconografía Inspector + list-logical + conteo TraerConectados + delete.svg en menús)

```
Toma control de la línea L3 de la ronda 12.1 de deep-opm-pro: UX polish del chrome — iconografía canónica reusada + tooltips sistemáticos + conteo familias.

Repo: /home/felix/projects/deep-opm-pro
Base: main @ 3805455

Lee primero:
1. docs/instrucciones-lineas-dev/ronda12.1/linea-3-ux-polish-chrome.md
2. docs/instrucciones-lineas-dev/ronda12.1/README.md (reglas §2, assets §5b, JOYAS §5c)
3. docs/JOYAS.md §2 (dimensiones canónicas íconos)
4. assets/svg/ (verificar con `ls assets/svg/` qué SVGs ya están — la mayoría de "ausentes" del reporte UX YA están en repo)
5. assets/svg/list-logical/ (verificar object/objectDashed/process/processDashed.svg)
6. opm-extracted/src/app/modules/layout/element-tool-bar/element-tool-bar.component.ts (referencia patrón matTooltip; NO copiar — usar `title=` HTML nativo)
7. docs/HANDOFF.md (decisiones vigentes; NO reabrir paleta canvas, modo barra creación sticky, atajos centralizados)

Foco:
- Tooltips sistemáticos en Toolbar.tsx (~6-8 botones sin `title=`; auditar con `grep -nE "<button|title=" app/src/ui/Toolbar.tsx`). **Coordinación L2 (post-V1)**: L2 también edita Toolbar.tsx en hunks restringidos a líneas 14/19/684-685 (lazy + Suspense de los dos diálogos). Tus `title=` van en botones distintos; verifica `git diff` post-merge L2 antes de tocar.
- Iconografía Inspector: `inzoom.svg`/`unfold.svg` en SeccionRefinamiento, `addStates.svg` en SeccionLayoutEstados, `timeDuration.svg` en SeccionDuracion (todos ya en assets/svg/)
- list-logical en ArbolOpd y BibliotecaCosa (verificar discriminante `esInformatico?` en tipos/entidad.ts; si no existe, omitir variante dashed)
- delete.svg en MenuContextualEntidad y MenuContextualArbol (NO MenuContextualEnlace — territorio L1)
- Conteo por familia en DialogoTraerConectados (verificar export `contarCandidatos` en reglasTraer.ts; si no existe, reportar y omitir)

NO refactor Toolbar.tsx (ronda 13 dedicada). NO consolidar duplicación Objeto/sticky (decisión vigente). NO migrar a tokens (L2 lo hace solo en Dialogo.tsx). NO crear funciones nuevas en kernel (reglasTraer.contarCandidatos si no existe → reportar).

Archivos permitidos: §4 del brief.
Archivos prohibidos: Dialogo.tsx (L2), tokens.ts (L2), App.tsx (L2), DialogoCargarModelo/Plantillas (L2 size prop), MenuContextualEnlace.tsx (L1 HU-11.012), InspectorEntidad.tsx (L1 HU-10.021 si aplica; L3 toca solo secciones leaf), acciones-* (L1), store/tipos (L1), tests (L1), generadores OPL, serializadores, progress-dashboard.mjs.

[plantilla genérica de reglas duras + loop verde + entregable]
```

## Reglas comunes de coordinación

1. **Orden de merge**: L1 → L2 → L3 → consolidación operador (ver README §8).
2. **Cero sleep / cero polling**: cada línea opera sobre su `main` actualizada antes de empezar; al cerrar, hace `git pull --rebase` y verifica que loop verde sigue verde.
3. **Conflictos en archivos compartidos** (`opm-smoke.spec.ts` único compartido entre L1/L2/L3): cada línea agrega smokes al final del archivo sin tocar tests previos. Conflictos triviales se resuelven aceptando ambos hunks aditivos.
4. **Bug fuera de scope** detectado por una línea: se entrega como patch a `/tmp/ronda12.1-bug-{nombre}.patch` y se documenta. NO se commitea (regla feedback consolidada).
5. **Si emerge necesidad de cambio kernel** (tipos.ts, modelo/operaciones, opl/generadores, serializadores): la línea **aborta y reporta**. Cambios kernel salen del scope ronda corta.
6. **Reuso obligatorio assets + JOYAS**: cada línea documenta en su entregable los assets reusados de `assets/svg/` (obligatorio por PROVENANCE §2). Patrones reusados semánticamente de `opm-extracted/` son opcionales pero recomendados (paths verificados — RF-1).
7. **Citas SSOT obligatorias en headers**: cada archivo nuevo o modificado materialmente cita SSOT según tipo de HU. RF-2 vigente.

## Cierre de ronda

Una vez las 3 líneas mergeadas, el operador (no una línea L5 separada) ejecuta la consolidación:

1. Confirmar `bun run check` + `bun run browser:smoke` + `bun run build` verde.
2. Recalibrar detector con `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real`. Esperar ≥104 reglas matched (vs 98 baseline).
3. Verificar: MVP-α esperado ≥95% ponderado (cierre de 6 HU L1 + 1 HU L2 + recategorización de 3 HU marcadas con asterisco si aplica).
4. Actualizar `docs/HANDOFF.md` reescribiéndolo a "post-ronda 12.1" (incluye nuevo estado MVP-α + decisiones de ronda 12.1 + cascadas resueltas + métricas finales + diferimientos confirmados a ronda 13/14).
5. Commit final: `chore(ronda12.1): glue + ledger + handoff`. Push.

Si MVP-α < 95% post-ronda-12.1, registrar en HANDOFF las HU que quedaron sin cerrar y los rationales (HU-SHARED-007 honestamente diferida a ronda 14, etc.). MVP-α 92-94% sigue siendo válido como cierre presentable de la ronda corta.

Si chunk principal > 200 kB tras L2, registrar como deuda explícita y proponer próxima medida (lazy split adicional, code-split candidato).
