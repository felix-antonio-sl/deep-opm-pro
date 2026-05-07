# Prompt de asignación — Ronda 13

Plantilla genérica + invocaciones concretas por línea + reglas duras + loop verde.

## Plantilla genérica

Copia el bloque siguiente, sustituye `{{LINEA}}` y `{{PATH_BRIEF}}`, y envíalo al agente.

```
Toma control de la línea {{LINEA}} de la ronda 13 de deep-opm-pro: ronda DEDICADA UX foundation (refactor estructural TIER 2 derivado de auditoría steipete `docs/auditorias/2026-05-07-refactor-radical-steipete.md`). 4 líneas paralelas con disjuntez por dominio funcional. Apertura UX de capacidades antes diferidas (split Toolbar por modo del editor, tokens central, methodological-checkers, BarraHerramientasElemento flotante).

Repo: /home/felix/projects/deep-opm-pro
Base: main post-ronda-13.0 (cleanup TIER 1 ya ejecutado: stashes vacíos si autorizado, 9 literales `#3BC3FF`/`#586D8C` en Toolbar.tsx ya migrados, headers SSOT corregidos, opm-smoke.spec.ts particionado en 8 archivos por dominio, detector strict clean).

Lee primero, en este orden de jerarquía SSOT:

NIVEL 1 (autoridad obligatoria):
1. SSOT relevante en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/ según la línea (metodologia/iso-19450/visual/opl/PROVENANCE/METODOLOGIA).
2. /home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/00-METODOLOGIA.md §6 (jerarquía SSOT y citas obligatorias por tipo HU).
3. /home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/06-PROVENANCE.md §2 (política operativa: reuso obligatorio SVGs/dimensiones/colores/tipografía/plantillas OPL).

NIVEL 2 (coherencia obligatoria):
4. /home/felix/projects/deep-opm-pro/app/src/modelo/tipos.ts (SSOT viva del modelo en TS). Ronda 13 NO modifica tipos kernel salvo extensión opcional bien justificada (L3 puede crear tipos/avisos.ts aditivo).

NIVEL 3 (respaldo obligatorio por contrato visual):
5. /home/felix/projects/deep-opm-pro/docs/JOYAS.md (paleta canónica + dimensiones + tipografía).
6. /home/felix/projects/deep-opm-pro/assets/svg/ (inventario iconos canónicos — verificar primero con `ls assets/svg/`; la mayoría de SVGs canónicos YA están en el repo).
7. /home/felix/projects/deep-opm-pro/opm-extracted/ dirigido a la línea: paths verificados en README §5 + grep amplio (`grep -ri "concepto-clave" opm-extracted/src/app -l`) ANTES de citar. Cualquier path no verificable con `ls`/`grep` se rechaza.

CONTRATO HEREDADO + AUDITORÍA STEIPETE:
8. {{PATH_BRIEF}} (brief de la línea con 11 secciones obligatorias).
9. /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda13/README.md (filosofía SSOT-céntrico §1 + reglas §2 + opm-extracted §5 + assets §5b + JOYAS §5c + citas SSOT §5d + colisiones §7 + merge §8 + anclaje §9).
10. /home/felix/projects/deep-opm-pro/docs/HANDOFF.md (decisiones vigentes rondas 1-12.1 que NO se reabren).
11. /home/felix/projects/deep-opm-pro/docs/auditorias/2026-05-07-refactor-radical-steipete.md (contrato técnico ronda 13 con TIER 1/2/3 + recomendaciones por ítem).

Antes de codificar, captura:
- Lista exacta de archivos permitidos (§4 del brief).
- Aporte declarado de la línea (§2 del brief; sin HU directa = refactor estructural).
- Contrato observable a preservar (APIs públicas estables, JSON lossless, OPL invariante, exports kernel sin rename).
- Comandos de verificación (§8 del brief).
- Decisiones que tomarás (§10 del brief).
- Assets canónicos a reusar (§5b del README + §3 del brief). Verificar primero con `ls assets/svg/`.

Reglas duras comunes (no negociables):

JERARQUÍA SSOT-CÉNTRICA:
1. **SSOT (nivel 1) es autoridad obligatoria**. Cada archivo nuevo o modificado materialmente cita SSOT al header según tipo: `[V-xxx]` (visual), `[Glos 3.x]` (glosario ISO 19450), `[OPL-ES …]` (OPL canónica), `[Met §x]` (metodología/etapas SD), `[JOYAS §x]` (cuando aplique visualmente). Ver README §5d para mapeo por línea.
2. **`tipos.ts` (nivel 2)** es SSOT viva en TS: ronda 13 NO modifica tipos kernel salvo L3 puede crear `tipos/avisos.ts` aditivo bien justificado.
3. **JOYAS y `assets/svg/` son contrato operativo obligatorio** (PROVENANCE §2). La mayoría de SVGs canónicos ya están en `assets/svg/` del repo; verificar con `ls` antes de inventar import.
4. **`opm-extracted/` es nivel 3 (respaldo técnico)**: NUNCA copy 1:1. Reescribir en Preact + Zustand + JointJS OSS preservando semántica. Paths verificados con `ls`/`grep` SIEMPRE.

ADITIVIDAD Y CONTRATOS:
5. **Aditividad**: tipos opcionales (`?:`), funciones nuevas exportadas, NO renames de exports kernel. **L1 refactoriza Toolbar.tsx internamente** pero `App.tsx` sigue importando `Toolbar` desde `./Toolbar` (export estable).
6. **Scope estricto**: solo archivos permitidos por §4 brief. Si emerge cambio cross-line no previsto, detente y reporta.
7. **Tests existentes intactos**: 675 baseline pasa sin tocar lógica.
8. **JSON roundtrip lossless**: ronda 13 no toca serializadores. Verificación trivial.
9. **OPL invariante**: cero oraciones nuevas. Generadores OPL no se tocan. **L3 emite avisos metodológicos**, NO oraciones OPL.
10. **Contratos observables sin cambios**: `data-testid` previos preservados; nuevos aditivos.

OPERATIVA:
11. **No introducir dependencias nuevas** salvo ESLint plugins necesarios para L2 rule custom (validar con operador antes).
12. **Si descubres bug fuera de scope**: entrega como patch a /tmp/, NO commitees ni mezcles (regla feedback consolidada).
13. **Idiomas**: docs y mensajes UI en es-CL; identificadores en estilo del repo.
14. **No tocar**: docs/HANDOFF.md, docs/historias-usuario-v2/ (excepto progress-dashboard.mjs que es territorio operador en consolidación final), docs/JOYAS.md, docs/auditorias/, docs/instrucciones-lineas-dev/ronda1..12.1/, customShapes.ts, in-vivo-test.mjs, home/.

DIFERIMIENTOS RONDA 14 (ABSOLUTOS):
15. **T2.7 unificación generador OPL** (viejo `app/src/opl/` vs nuevo `app/src/modelo/opl/generador-opl.ts`) DIFERIDA — recomendación steipete: mantener separados; evento gatillante = parser OPL ronda 14.
16. **TIER 3 completo** (Zustand→signals, JointJS→canvas custom, CQRS, DI runtime, branded `Id`, Web Components, signals-subset) DIFERIDO. NO ejecutar.
17. **HU-SHARED-007 OPL inverso editable + HU-50.019/.020/.022 + EPICA-32 sub-modelos peer**: ronda 14 dedicada parser OPL.
18. **EPICA-70/91 descartadas del proyecto** desde 2026-05-05; no proponerlas.
19. **No reabrir contratos rondas 1-12.1** (HANDOFF §Decisiones Vigentes).
20. **Detector ledger es territorio operador**: cada línea declara internamente sus reglas detector pero NO edita progress-dashboard.mjs.

OBJETIVOS GLOBALES RONDA 13:
21. **Bundle**: chunk principal ≤ 195 kB (objetivo histórico recuperado por L1 lazy splits).
22. **0 literales `#xxxxxx`** en `app/src/ui/**/*.{ts,tsx}` excepto `tokens.ts` (ESLint enforced por L2).
23. **MVP-α ≥ 98.8%** preservado (HU-SHARED-007 sigue diferida ronda 14).

Loop verde obligatorio antes de cerrar:
- cd app && bun run check          (675+ tests, sin regresión)
- cd app && bun run browser:smoke  (86+ smokes, sin regresión)
- cd app && bun run build          (chunk principal ≤ 195 kB post-L1 lazy)
- cd app && bun run lint           (cero violaciones color literales en app/src/ui/** excepto tokens.ts; solo si L2 introdujo config)
- node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real --strict (NO ejecutar tú; lo hace consolidación operador)

Forma del entregable (al cerrar):
- Hash final del último commit en main.
- LOC delta por archivo (`git diff --stat`).
- Output de cada comando de verificación (último tail).
- Lista de tests aditivos creados + conteo.
- Lista de smokes aditivos + conteo.
- Decisiones declaradas (§10 del brief).
- Reglas detector que esta línea declara para consolidación operador (§7-§8 brief).
- **Citas SSOT agregadas en headers** (lista por archivo: `[V-…]`, `[Glos 3.x]`, `[Met §x]`, `[JOYAS §x]`).
- **Assets reusados de assets/svg/** (lista explícita; obligatorio por PROVENANCE §2).
- **Patrones de opm-extracted/ reusados semánticamente** (paths verificados).
- Bloqueos o desviaciones explícitas con rationale.
- Confirmación de archivos no tocados (de §5 del brief).

Si dudás de un caso límite: detente y reporta al operador antes de actuar. Mejor pausar que invadir scope.

Co-author footer en commits si corresponde.
```

## Invocaciones concretas listas para copia-pega

### L1 — Split Toolbar.tsx por modo del editor + lazy split adicional

```
Toma control de la línea L1 de la ronda 13 de deep-opm-pro: split Toolbar.tsx (1098 LOC → ~80 LOC orquestador) + 5 archivos por modo del editor en `app/src/ui/toolbar/` + lazy splits adicionales (MapaSistema/Timeline/TablaEnlaces/GestionArbolOpd) en App.tsx. Combina T2.1 opción B + T2.6 steipete.

Repo: /home/felix/projects/deep-opm-pro
Base: main post-ronda-13.0

Lee primero:
1. docs/instrucciones-lineas-dev/ronda13/linea-1-toolbar-split-lazy.md
2. docs/instrucciones-lineas-dev/ronda13/README.md (especial §7 colisiones Toolbar.tsx + §8 merge)
3. docs/auditorias/2026-05-07-refactor-radical-steipete.md §T2.1 opción B + §T2.6
4. docs/HANDOFF.md (decisiones vigentes; NO consolidar duplicación Objeto/sticky; NO opciones A/C)
5. opm-extracted/src/app/modules/layout/{header,rappid-toolbar,element-tool-bar,navigator,opl-container,main}/ (referencia semántica, NO copia)
6. SSOT en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/06-PROVENANCE.md §2

Foco:
- Refactorizar Toolbar.tsx a orquestador delgado (~80 LOC) que decide qué subcomponentes montar según modo del editor
- Crear ToolbarBase, ToolbarSeleccion, ToolbarMultiseleccion, ToolbarCreacion, ToolbarMapaSistema (5 archivos en app/src/ui/toolbar/)
- Cada archivo refleja modo del editor (no banda visual)
- Lazy MapaSistema + Timeline + TablaEnlaces + GestionArbolOpd en App.tsx (~25 kB ahorro chunk principal estimado)
- Slot opcional en ToolbarSeleccion.tsx para BarraHerramientasElemento (L4 decide invocar)
- Cero cambios funcionales: data-testid preservados, smokes existentes pasan

Archivos permitidos: §4 del brief.
Archivos prohibidos: tokens.ts (L2), Inspector secciones (L2), MenuContextual* (L2), Dialogo*/Modal* (L2), MenuPrincipal/PantallaInicio/ArbolOpd/BibliotecaCosa (L2), BarraHerramientasElemento (L4), checkers/avisos/PanelMetodologia (L3), generadores OPL, serializadores, render JointJS handlers (lectura solo), customShapes, progress-dashboard.

[plantilla genérica de reglas duras + loop verde + entregable]
```

### L2 — tokens.ts central completo + ESLint rule + migración archivo por archivo

```
Toma control de la línea L2 de la ronda 13 de deep-opm-pro: expandir tokens.ts a módulo central completo (colors + spacing + radii + shadows + typography) + introducir ESLint rule custom para impedir color literales en app/src/ui/** + migrar 108 ocurrencias estimadas con commits atómicos por archivo. Combina T2.2 + T2.4 steipete.

Repo: /home/felix/projects/deep-opm-pro
Base: main post-ronda-13.0

Lee primero:
1. docs/instrucciones-lineas-dev/ronda13/linea-2-tokens-central.md
2. docs/instrucciones-lineas-dev/ronda13/README.md (especial §5c JOYAS contrato visual + §7 colisiones)
3. docs/JOYAS.md (paleta canvas invariante + dimensiones + tipografía)
4. docs/auditorias/2026-05-07-refactor-radical-steipete.md §T2.2 + §T2.4
5. docs/HANDOFF.md (decisiones vigentes; NO migrar paleta canvas; NO dark mode; NO ESLint rule más amplia)
6. opm-extracted/src/styles/ (si existe; referencia spacing/radii)

Foco:
- Extender tokens.ts con spacing (4/8/12/16/24/32), radii (4/6/8), shadows.dialogo (`0 12px 30px rgba(15,23,42,0.16)`), typography (familyChrome/sizes/weights)
- ESLint rule custom no-restricted-syntax con regex `/#[0-9A-Fa-f]{3,8}/` solo en app/src/ui/** excepto tokens.ts
- Migrar archivo por archivo con commits atómicos (Inspector secciones → MenuContextual* → Dialogo* → Modal* → MenuPrincipal/PantallaInicio/ArbolOpd/BibliotecaCosa/arbol/panelOpl/etc.)
- Cero refactor de lógica funcional; solo sustitución literales por referencias
- Visual snapshot Playwright para regresión (.toolbar/.inspector/.dialogo)

NO migrar Toolbar.tsx (L1 lo refactoriza completo). NO migrar BarraHerramientasElemento (L4 lo crea con tokens). NO migrar PanelMetodologia/checkers (L3). NO migrar paleta canvas en composers (contrato JOYAS invariante).

Archivos permitidos: §4 del brief (~30 archivos UI + tokens + tokens.test + eslint config + package.json + 2 smokes).
Archivos prohibidos: Toolbar.tsx + toolbar/* (L1), App.tsx (L1), BarraHerramientasElemento (L4), PanelMetodologia/checkers/avisos (L3), composers JointJS (paleta canvas invariante), tests (literales OK), customShapes, in-vivo-test, progress-dashboard.

[plantilla genérica de reglas duras + loop verde + entregable]
```

### L3 — Destilar 6 methodological-checkers + panel visual

```
Toma control de la línea L3 de la ronda 13 de deep-opm-pro: destilar semánticamente 6 methodological-checkers desde opm-extracted (la única joya semántica nueva real según steipete) + crear panel visual hermano de PanelAvisos. T2.3 steipete.

Repo: /home/felix/projects/deep-opm-pro
Base: main post-ronda-13.0

Lee primero:
1. docs/instrucciones-lineas-dev/ronda13/linea-3-checkers-metodologicos.md
2. docs/instrucciones-lineas-dev/ronda13/README.md (especial §5 patrones + §5d citas SSOT)
3. docs/auditorias/2026-05-07-refactor-radical-steipete.md §T2.3
4. opm-extracted/src/app/dialogs/methodological-checking-dialog/checkers/ (6 archivos: ing-checker.ts, inzoomed-content-checker.ts, object-name-as-singular-checker.ts, part-unfold-content-checker.ts, systemic-processes-main-function-checker.ts, transforming-process-checker.ts) — destilación semántica, NO copia 1:1
5. SSOT en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/metodologia-opm-es.md §metodologia + §inzoom + §unfold + opm-iso-19450-es.md §3.55 §3.69
6. docs/HANDOFF.md (decisiones vigentes; AvisoMetodologico NO se serializa; avisos blandos no errores)

Foco:
- Crear app/src/modelo/checkers.ts (~250 LOC) con 6 funciones puras + verificarMetodologia(modelo) orquestador
- Crear app/src/modelo/tipos/avisos.ts (~50 LOC) con AvisoMetodologico + SeveridadAviso + CodigoChecker
- Re-export desde tipos.ts
- Crear app/src/ui/PanelMetodologia.tsx (panel hermano) o extender PanelAvisos.tsx (decisión en línea según research)
- Integrar en App.tsx (zona del layout no ocupada por L1 lazy ni L4 flotante)
- Cobertura ~150 unit tests (5-10 por checker × 6) + integración con demos canónicos (Cafetera debe producir 0 avisos)
- 2 smokes browser

Adaptación kernel: OPCloudUtils.isInstanceOfLogicalProcess → entidad.tipo === "proceso"; model.logicalElements → Object.values(modelo.entidades); linkType.Result/Consumption/Effect → TipoEnlace existente.

Heurística es-CL para forma verbal: tolerante con sustantivos verbales (-ción, -sión, -aje, -miento, -izar) además de infinitivos -ar/-er/-ir.

Archivos permitidos: §4 del brief.
Archivos prohibidos: Toolbar.tsx + toolbar/* (L1), tokens.ts (L2), BarraHerramientasElemento (L4), Inspector* (L4 puede leer), generadores OPL, serializadores, render JointJS, acciones-* (avisos son función pura del modelo), customShapes, progress-dashboard.

[plantilla genérica de reglas duras + loop verde + entregable]
```

### L4 — BarraHerramientasElemento.tsx flotante

```
Toma control de la línea L4 de la ronda 13 de deep-opm-pro: crear BarraHerramientasElemento.tsx flotante anclada al canvas junto a la cosa seleccionada con 6 acciones primarias OPCloud destiladas (de las 12 catalogadas) + botón "···" que abre/cierra Inspector lateral. T2.5 steipete piloto.

Repo: /home/felix/projects/deep-opm-pro
Base: main post-ronda-13.0

Lee primero:
1. docs/instrucciones-lineas-dev/ronda13/linea-4-barra-herramientas-elemento.md
2. docs/instrucciones-lineas-dev/ronda13/README.md (especial §5b assets canónicos + §7 colisiones)
3. docs/auditorias/2026-05-07-refactor-radical-steipete.md §T2.5 (lista 12 acciones, recomendación pilotar 6)
4. opm-extracted/src/app/modules/layout/element-tool-bar/element-tool-bar.component.ts (8979 LOC post-Angular IVY; NO portar 1:1, solo extraer lista de 12 acciones)
5. docs/JOYAS.md §2 (dimensiones canónicas íconos)
6. assets/svg/ (verificar con `ls assets/svg/`: inzoom.svg, addStates.svg, editAlias.svg, styleElement.svg ya existen)
7. SSOT en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/06-PROVENANCE.md §2

Foco:
- Crear app/src/ui/BarraHerramientasElemento.tsx (~400 LOC) con 6 botones piloto:
  1. Copiar estilo (acción existente copiarEstiloEnlaceAlPortapapeles)
  2. Pegar estilo (pegarEstiloEnlaceDesdePortapapeles)
  3. Agregar estado (solo objeto; assets/svg/addStates.svg)
  4. Inzoom (assets/svg/inzoom.svg; desplegarSeleccionada)
  5. Editar alias (assets/svg/editAlias.svg; abrir SeccionAlias)
  6. Editar imagen (solo objeto; abrir ModalImagenObjeto)
  7. Botón "···" toggle Inspector lateral
- Anchor al canvas vía bbox del DOM JointJS (lectura de handlers/seleccion.ts; NO modificar)
- Posicionamiento: arriba del bbox 8px; collision avoidance básico (abajo si arriba no cabe)
- Visibility: solo con seleccion === 1 entidad
- Integración App.tsx como overlay; InspectorEntidad recibe prop colapsado? opcional
- ~30 unit tests + 3 smokes

NO portar las 12 acciones (solo 6 piloto). NO reemplazar Inspector (es complemento). NO modificar handlers JointJS (si emerge necesidad, pausar y reportar). NO tocar acciones store (cero acciones nuevas; invocar existentes). NO introducir keyboard shortcut (selección hace toggle automático).

Archivos permitidos: §4 del brief.
Archivos prohibidos: Toolbar.tsx + toolbar/* (L1; pero L1 deja slot opcional en ToolbarSeleccion para invocar — decidir overlay separado en App.tsx), tokens.ts (L2), checkers/avisos/PanelMetodologia (L3), customShapes, in-vivo-test, generadores OPL, serializadores, progress-dashboard.

[plantilla genérica de reglas duras + loop verde + entregable]
```

## Reglas comunes de coordinación

1. **Orden de merge**: L2 → L1 → L4 → L3 → consolidación operador (ver README §8).
2. **Cero sleep / cero polling**: cada línea opera sobre su `main` actualizada antes de empezar; al cerrar, hace `git pull --rebase` y verifica que loop verde sigue verde.
3. **Conflictos en archivos compartidos** (`App.tsx` único compartido entre L1/L3/L4): hunks disjuntos garantizados por orden de merge (L1 primero lazy imports + rendering principal; L3 monta panel hermano en zona libre; L4 monta overlay flotante). Si conflicto emerge, abortar y consultar.
4. **Bug fuera de scope** detectado por una línea: se entrega como patch a `/tmp/ronda13-bug-{nombre}.patch` y se documenta. NO se commitea.
5. **Si emerge necesidad de cambio kernel** (`tipos.ts` salvo `tipos/avisos.ts` aditivo L3, modelo/operaciones, opl/generadores, serializadores, render JointJS): la línea **aborta y reporta**. Cambios kernel salen del scope ronda 13 (excepto extensión justificada L3 documentada).
6. **Reuso obligatorio assets + JOYAS**: cada línea documenta en su entregable los assets reusados de `assets/svg/` (PROVENANCE §2). Patrones reusados semánticamente de `opm-extracted/` con paths verificados.
7. **Citas SSOT obligatorias en headers**: cada archivo nuevo o modificado materialmente cita SSOT según tipo.

## Cierre de ronda

Una vez las 4 líneas mergeadas:

1. Confirmar `bun run check` + `bun run browser:smoke` + `bun run build` + `bun run lint` verde.
2. Recalibrar detector con `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real --strict`. Esperar ≥110 reglas matched + MVP-α ≥98.8% preservado.
3. Verificar bundle ≤ 195 kB (objetivo histórico recuperado por L1 lazy splits).
4. Verificar `bun run lint` cero violaciones color literales en app/src/ui/** excepto tokens.ts.
5. Actualizar `docs/HANDOFF.md` reescribiéndolo a "post-ronda 13" (incluye 4 líneas con atribución + decisiones nuevas + cascadas resueltas + métricas finales + diferimientos confirmados a ronda 14: T2.7 OPL viejo/nuevo, TIER 3 completo, HU-SHARED-007, parser OPL, EPICA-32 sub-modelos peer).
6. Commit final: `chore(ronda13): glue + ledger + handoff`. Push.

Si bundle > 195 kB tras L1, registrar como deuda explícita y proponer próxima medida (lazy split adicional). Si MVP-α cae, registrar HU que volvieron a parcial (no debería ocurrir; ronda 13 es refactor estructural sin cambios funcionales).

## Próximo paso post-ronda-13

**Ronda 14** (parser OPL bidireccional, dedicada): cierra HU-SHARED-007 inverso editable + HU-50.019/.020/.022 + posiblemente unifica OPL viejo/nuevo (T2.7 steipete pendiente) + posiblemente abre EPICA-32 sub-modelos peer-persistence.

**TIER 3** (ronda 15+ si emerge evento gatillante): Zustand→signals si emerge problema de reactividad fina; JointJS→canvas custom si JointJS deja de mantenerse o necesidades de performance gráfica lo justifican; CQRS si event sourcing aporta valor concreto; etc.
