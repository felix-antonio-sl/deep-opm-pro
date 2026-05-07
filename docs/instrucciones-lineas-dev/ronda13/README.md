# Ronda 13 — UX foundation (refactor estructural TIER 2 derivado de auditoría steipete)

**Fecha**: 2026-05-07
**Base**: `main` post-ronda-13.0 (cleanup TIER 1 ya ejecutado: stashes vacíos si autorizado, 9 literales `#3BC3FF`/`#586D8C` en Toolbar.tsx ya migrados a tokens, headers SSOT corregidos, opm-smoke.spec.ts particionado en 8 archivos por dominio, detector strict clean).
**Origen**: auditoría `docs/auditorias/2026-05-07-refactor-radical-steipete.md` §3 (TIER 2 — refactor estructural con tradeoffs reales) + §6.1 (lo que se absorbe en ronda 13). El operador aceptó la recomendación primaria steipete. Las opciones por ítem ya están elegidas:

- **T2.1 split Toolbar**: opción B (descomponer por modo del editor, no por bandas visuales) — opción A descartada porque BarraContextual seguiría siendo monolito ~600 LOC; opción C descartada por exceso de complejidad.
- **T2.2 + T2.4 tokens central**: introducir spacing/radii/shadows/typography + ESLint rule + migración archivo-por-archivo (~108 ocurrencias UI estimadas, 827 totales si se incluyen composers canvas — alcance solo UI chrome).
- **T2.3 methodological-checkers**: panel hermano de PanelAvisos extendido o nuevo PanelMetodologia (decisión final en línea L3 según research).
- **T2.5 BarraHerramientasElemento**: pilotar como **complemento** del Inspector lateral (no reemplazo); 6 acciones primarias + "···" → Inspector.
- **T2.6 lazy split adicional**: absorbido en L1 (toca misma capa de orquestación que split Toolbar).

**Diferimientos absolutos a ronda 14** (NO entran en ronda 13):
- T2.7 unificación generador OPL viejo/nuevo (steipete §T2.7: mantener separados, evento gatillante = parser OPL ronda 14).
- TIER 3 completo (Zustand→signals, JointJS→canvas custom, CQRS, DI runtime, branded `Id`, Web Components, signals-subset).
- HU-SHARED-007 OPL inverso editable + HU-50.019/.020/.022 + EPICA-32 sub-modelos peer.

**Objetivo cuantitativo**: 4 líneas paralelas en ~3-5 días. Coproducto disjunto por dominio funcional con orden de merge controlado (L2→L1→L4→L3) que minimiza el blast cross-line.

## 1. Filosofía operativa

- **Marco SSOT-céntrico** heredado de rondas 11-12.1. Tres niveles de autoridad (SSOT en `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`, `app/src/modelo/tipos.ts` viva, `opm-extracted/` + JOYAS + assets como respaldo). Ronda 13 NO modifica nivel 1 ni nivel 2 salvo extensiones aditivas justificadas (L3 puede crear `tipos/avisos.ts` aditivo).
- **Refactor estructural autorizado por brief**: a diferencia de rondas previas que cerraban HU del backlog, ronda 13 ejecuta **refactor de UX foundation autorizado explícitamente** por el operador tras auditoría steipete. La métrica de éxito no es "HU cerradas" sino "deuda técnica reducida + arquitectura preparada para ronda 14".
- **Aditividad estricta** preservada (`urn:fxsl:kb:icas-extension`): cada cambio agrega tipos opcionales (`?:`), funciones nuevas exportadas, ningún rename de exports kernel. Excepción autorizada: L1 refactoriza `Toolbar.tsx` (1098 LOC → ~80 LOC orquestador), pero los imports de Toolbar permanecen estables (los 5 nuevos archivos `app/src/ui/toolbar/*.tsx` se montan internamente).
- **Diferimiento por blast** (`urn:fxsl:kb:icas-calidad-riesgo`): TIER 3 y T2.7 expresamente excluidos.
- **Faithful sobre rondas 1-12.1** (`urn:fxsl:kb:icas-preservacion`): contratos públicos preservados, JSON lossless invariante, OPL invariante. Cero cambios kernel.
- **Loop verde obligatorio**: cada línea cierra con `cd app && bun run check`; si toca UI/render: `bun run browser:smoke`; si toca proyección o bundle: `bun run build`. Línea base post-ronda-13.0 (asumiendo T1 ejecutado): 675 unit / 2700 expect / 0 fail, 86 smokes redistribuidos en 8 archivos, chunk principal ≈ 218.99 kB / 59 kB gzip.
- **Ship-beats-perfect**: si una línea expone bug fuera de scope, se entrega como patch a `/tmp/` y NO se commitea (regla feedback consolidada).
- **Honestidad sobre cobertura**: ronda 13 es refactor estructural; las HU del backlog NO crecen mucho (L3 puede abrir métrica nueva "modelo metodológicamente válido" si se quiere registrar). MVP-α se preserva en 98.8% (HU-SHARED-007 sigue diferida ronda 14).

## 2. Reglas duras comunes

1. **Scope estricto**: solo tocar archivos permitidos por el brief. Cualquier cambio cross-line no previsto se reporta y detiene.
2. **No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`** desde las líneas. Consolidación final del operador actualiza el HANDOFF. Tampoco tocar `docs/instrucciones-lineas-dev/ronda1..12.1/`, ni `docs/JOYAS.md`, ni la SSOT en `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/` (lectura).
3. **No tocar archivos sueltos del operador**: ni `app/scripts/in-vivo-test.mjs` ni `app/src/render/jointjs/customShapes.ts` ni `home/`.
4. **No copiar código 1:1 desde `opm-extracted/`**. Se usa como evidencia semántica/UX/arquitectura; la implementación se reescribe con Preact/Zustand/JointJS OSS. **L3 destila los 6 checkers semánticamente** (lógica adaptable, tipos del kernel propio); L4 extrae **solo la lista de 12 acciones** del element-tool-bar.component.ts 8979 LOC post-Angular IVY.
5. **Citas explícitas**: cada decisión arquitectural cita SSOT (`opm-iso-19450-es.md`, `opm-visual-es.md`, `opm-opl-es.md`, `metodologia-opm-es.md`) o documento interno con paths absolutos + líneas. Auditoría steipete en `docs/auditorias/2026-05-07-refactor-radical-steipete.md` es el contrato de ronda 13.
6. **APIs públicas estables**: ningún rename de exports kernel. **L1 refactoriza Toolbar.tsx internamente** pero `App.tsx` sigue importando `Toolbar` desde `./Toolbar`. **L4 introduce `BarraHerramientasElemento` como export nuevo**, no rename.
7. **JSON lossless**: cero cambios serializadores. Roundtrip permanece intacto.
8. **OPL invariante**: cero oraciones nuevas. Generadores OPL no se tocan (L3 podría agregar avisos sobre nombres de procesos pero NO modifica generador OPL).
9. **Idiomas**: docs y mensajes UI en es-CL; identificadores en estilo del repo (camelCase TS, kebab-case data-testid).
10. **Tests por capa**: cada feature trae tests al lado. Tests viejos se preservan sin reescribir.
11. **No introducir backend, Firebase, auth, Rappid, jspdf, pdf-lib, papaparse ni dependencias nuevas** salvo ESLint plugin necesario para L2 rule custom (validar con operador antes).
12. **Commits de línea**: `feat(...)` para features chicas, `refactor(...)` para extracción/split, `chore(...)` para tokens/lazy/lint, `test(...)` para evidencia. Co-author footer si aplica.
13. **No reabrir contratos rondas 1-12.1**: `docs/HANDOFF.md §Decisiones Vigentes` es contrato. Mantener vigentes en particular: read-only flag de runtime no de modelo, validación nominal `validarNombreEntidad`, modo barra creación sticky, atajos centralizados, paleta canónica canvas (`#70E483`/`#3BC3FF`/`#586D8C`), aditividad estricta, catálogo de demos kernel-construible, agente IA reclasificado como instrumento.
14. **EPICA-70 (OPCAT) y EPICA-91 (tutorial) descartadas del proyecto** desde 2026-05-05.
15. **Diferimiento explícito ronda 14** (lista cerrada): T2.7 unificación OPL, TIER 3 completo, HU-SHARED-007 inverso editable, HU-50.019/.020/.022 parser OPL bidireccional, EPICA-32 sub-modelos peer-persistence.
16. **Cada línea registra sus reglas detector ronda 13**: agrega reglas nuevas en `docs/historias-usuario-v2/tools/progress-dashboard.mjs` solo en consolidación final del operador, pero declara internamente qué evidencia respalda su entrega (especialmente L3 que abre dominio nuevo de avisos metodológicos).

## 3. Stack y comandos del repo

- Bun 1.3+, TypeScript strict, Preact 10 + Signals, Zustand 5, JointJS 3.7 core, Vite 6, Playwright.
- Working directory: `/home/felix/projects/deep-opm-pro`; app en `app/`.

```bash
cd app
bun run check          # typecheck + unit tests (675 baseline post-ronda-13.0)
bun run browser:smoke  # Playwright Chromium 86 smokes en 8 archivos
bun run build          # build Vite; chunk principal 218.99 kB / 59 kB gzip baseline; objetivo ronda 13 ≤ 195 kB
bun run dev            # localhost:5173
bun run lint           # solo si L2 introduce config ESLint
```

Auditoría HU al cierre de consolidación:

```bash
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real --strict
```

## 4. Diagnóstico del estado y objetivos ronda 13

Estado base post-ronda-13.0 (asumido):

| Métrica | Valor |
|---|---|
| Unit tests | 675 (vs 673 post-ronda-12.1; +2 por tokens.test.ts T1.2) |
| Smoke browser | 86 redistribuidos en 8 archivos (T1.4) |
| Chunk principal | ≈ 218.99 kB / 59 kB gzip |
| MVP-α | 98.8% ponderado (sin cambios) |
| Detector | strict clean (T1.5 verificado) |
| Stashes pendientes | 0 (T1.1 si autorizado, sino N) |
| Literales `#xxxxxx` en `app/src/ui/**`* | ~827 totales (incluye composers canvas) — alcance L2 = chrome UI puro estimado ~108 ocurrencias |
| Toolbar.tsx | 1098 LOC actuales (ya con T1.2 tokens activeButton/stickyBadge migrados) |

*Contar literales por scope: `grep -rE "#[0-9A-Fa-f]{3,8}" app/src/ui/ --include="*.tsx" --include="*.ts" | grep -v render/jointjs | grep -v tokens.ts` da una aproximación más cercana.

**Objetivos de ronda 13** (4 líneas paralelas):

| Objetivo | Línea | Métrica |
|---|---|---|
| Toolbar.tsx orquestador delgado | L1 | Toolbar.tsx ≤ 100 LOC; 5 archivos en `app/src/ui/toolbar/` |
| Lazy split adicional | L1 (combinado T2.6) | Chunk principal ≤ 195 kB (-23 kB vs 218.99 baseline) |
| tokens.ts central completo | L2 | spacing/radii/shadows/typography agregados; 108 literales UI migrados |
| ESLint rule color literales | L2 | `bun run lint` rechaza `#xxxxxx` en `app/src/ui/**` excepto tokens.ts |
| 6 checkers metodológicos | L3 | `app/src/modelo/checkers.ts` con `verificarMetodologia(modelo): AvisoMetodologico[]` |
| Panel metodológico visual | L3 | extensión `PanelAvisos` o nuevo `PanelMetodologia`; integrado en App.tsx |
| Barra flotante elemento | L4 | `BarraHerramientasElemento.tsx` con 6 acciones piloto + "···" → Inspector |
| Tests | L3+L4 | unit ≥ 825 (L3 ~150 nuevos checkers + L4 ~30 barra) |
| Smokes | L1+L2+L3+L4 | smoke ≥ 92 (cada línea ~2-3 smokes nuevos) |
| MVP-α | preservado | ≥ 98.8% (HU-SHARED-007 sigue diferida) |

### 4b. Diferimiento explícito a ronda 14 (lista cerrada)

NO entran en ronda 13:

- **T2.7 unificación generador OPL** viejo (`app/src/opl/`) vs nuevo (`app/src/modelo/opl/generador-opl.ts`). Steipete recomienda mantener separados; evento gatillante = parser OPL bidireccional ronda 14.
- **TIER 3 completo** (Zustand→signals, JointJS→canvas custom, CQRS, DI runtime, branded `Id`, Web Components, signals-subset). Espera evento gatillante específico.
- **HU-SHARED-007 OPL inverso editable** (forward cubierto, inverso requiere parser).
- **HU-50.019/.020/.022 parser OPL bidireccional**.
- **EPICA-32 sub-modelos peer-persistence**.

## 5. Patrones técnicos referenciales en `opm-extracted/` (nivel 3, respaldo)

| Patrón OPCloud | Path verificado | Aplicación ronda 13 |
|---|---|---|
| **Split UI por componentes** | `opm-extracted/src/app/modules/layout/{header,rappid-toolbar,element-tool-bar,navigator,opl-container,main}/` | **L1** referencia semántica sobre split Toolbar (no copia 1:1). Inspirar el modelo de modos del editor desde la separación OPCloud. |
| **SCSS variables canónicas** | `opm-extracted/src/styles/` (verificar existencia con `ls`; si no existe, descartar como ya hizo L2 ronda 12.1) | **L2** referencia para spacing/radii/shadows scales. Si el path no existe, derivar tokens desde JOYAS.md + observación de patterns repetidos en el repo propio. |
| **Methodological checkers** | `opm-extracted/src/app/dialogs/methodological-checking-dialog/checkers/` (6 archivos: `ing-checker.ts`, `inzoomed-content-checker.ts`, `object-name-as-singular-checker.ts`, `part-unfold-content-checker.ts`, `systemic-processes-main-function-checker.ts`, `transforming-process-checker.ts`) | **L3** destilar semánticamente los 6 checkers a `app/src/modelo/checkers.ts`. Adaptación: `OPCloudUtils.isInstanceOfLogicalProcess(thing)` → `entidad.tipo === "proceso"`; `model.logicalElements` → `Object.values(modelo.entidades)`; `linkType.Result/Consumption/Effect` → ya hay tipo `TipoEnlace`. |
| **Element-tool-bar canónico** | `opm-extracted/src/app/modules/layout/element-tool-bar/element-tool-bar.component.ts` 8979 LOC post-Angular IVY | **L4** NO portar 1:1. Solo extraer la lista de 12 acciones primarias listadas en steipete §T2.5. Implementación nueva en Preact + JointJS OSS con anchor al canvas vía `paperToLocal`. |
| **Lazy chunk pattern** | `opm-extracted/src/app/dialogs/Spinner/`, `multi-delete-progress/`, etc. | **L1** referencia para `<Suspense fallback={...}>` en lazy de MapaSistema/Timeline/TablaEnlaces/GestionArbolOpd. |

Ningún brief debe inventar paths bajo `opm-extracted/`. Si un path no aparece en esta tabla o no se verifica con `ls`/`grep` antes, NO se cita en un brief.

## 5b. Assets SVG canónicos a reusar (obligatorio)

Política `06-PROVENANCE.md §2`: **"SVGs, dimensiones, colores, tipografía y plantillas OPL se reutilizan"**. Aplicación ronda 13:

| Archivo SVG (en `assets/svg/`) | Aplicación ronda 13 |
|---|---|
| `editAlias.svg` | **L4** botón 9 (editar alias) en BarraHerramientasElemento. |
| `editUnits.svg` | **L4** asociado (no es uno de los 12 directamente pero útil). |
| `inzoom.svg` | **L4** botón 7 (in-zoom thing). |
| `unfold.svg` | **L4** botón 8 (unfold thing). |
| `addStates.svg` | **L4** botón 6 (add state). |
| `styleElement.svg` | **L4** botón 3 (toggle styling div). |
| `delete.svg` | **L4** opcional para "eliminar" si se incluye. |
| `computation.svg`, `updateComputationalProcess.svg`, `deleteFunction.svg` | (no entran en piloto L4 — diferidos a iteración futura). |
| `ExpressHalo.svg`, `supressHalo.svg` | **L4** referencia visual para halo de selección si se quiere alinear con OPCloud. |

Cualquier SVG nuevo requerido se verifica primero con `ls assets/svg/` antes de inventar import. La mayoría de SVGs canónicos ya están en el repo (verificado en ronda 12.1 L3).

## 5c. JOYAS canónicas (paleta + dimensiones) — contrato visual obligatorio

`docs/JOYAS.md` documenta paleta y dimensiones del bundle real de OPCloud. Ronda 13 respeta:

- **Paleta semántica canvas** (`docs/JOYAS.md §1`, **invariante**): `#70E483` Object stroke, `#3BC3FF` Process stroke, `#586D8C` link stroke, `#fdffff` fill, `#000002` text. Ningún cambio en ronda 13.
- **Paleta UI** (extensión ronda 13 L2): `tokens.colors.acentoUi = "#3DA8FF"`, `chromeNeutral = "#586D8C"` (compartido con link stroke por convención), `acentoUiSuave = "#eaf8ff"`, `chromeNeutralSuave = "#e8eef5"` (T1.2 ronda 13.0). L2 amplía con tokens secundarios para spacing/radii/shadows/typography.
- **Dimensiones canónicas** (`docs/JOYAS.md §2`, invariante).
- **Tipografía** (`docs/JOYAS.md §3`, invariante: Arial 14px font-weight 600).

L2 introduce tokens secundarios derivados de los patterns observables en el repo (no inventa de la nada): spacing observado 4/8/12/16/24 px; radii 4/6/8 px; shadow `0 12px 30px rgba(15,23,42,0.16)` repetido en ~8 diálogos.

## 5d. Política de citas SSOT obligatorias en archivos nuevos (RF-2 vigente)

Política heredada de rondas previas. Cada archivo nuevo o modificado materialmente cita SSOT al header según tipo de HU/refactor. Aplicación concreta ronda 13:

- **L1** refactor Toolbar (`opcloud-ui`): `[JOYAS §1-3]` + cita a steipete §T2.1 opción B + referencia al modelo de modos del editor (`store/seleccion.ts` para discriminante).
- **L1** lazy splits (`opcloud-ui`): `[JOYAS §2]` opcional + comentario rationale "lazy bundle <195 kB objetivo histórico" + referencia steipete §T2.6.
- **L2** tokens (`opcloud-ui`): `[JOYAS §1-3]` para colors/dimensions/typography + cita a steipete §T2.2 + comentario sobre alcance (chrome UI puro, NO canvas semantico).
- **L2** ESLint rule (`opcloud-ui`): comentario en config explicando objetivo (impedir colision semantica chrome vs canvas) + cita steipete §T2.2.
- **L3** checkers (`opm-semantica`): `[Met §metodologia]` + `[Glos 3.55 Object]` + `[Glos 3.69 Process]` + cita a `opm-iso-19450-es.md` para reglas semánticas + cita opcional al checker original en opm-extracted (path verificado).
- **L3** PanelMetodologia/PanelAvisos extension (`opcloud-ui`): `[Met §metodologia]` + cita steipete §T2.3.
- **L4** BarraHerramientasElemento (`opcloud-ui`): `[V-209]` o `[JOYAS §2]` + cita steipete §T2.5 + comentario rationale "complemento del Inspector lateral, no reemplazo".

## 6. Visión general de las 4 líneas

| ID | Título | Capa principal | Tamaño | Riesgo |
|---|---|---|---|---|
| **L1** | Split Toolbar.tsx por modo del editor + lazy split adicional | `app/src/ui/Toolbar.tsx` (refactor a orquestador ~80 LOC) + `app/src/ui/toolbar/{ToolbarBase,ToolbarSeleccion,ToolbarMultiseleccion,ToolbarCreacion,ToolbarMapaSistema}.tsx` (5 NUEVOS) + `app/src/ui/App.tsx` (lazy MapaSistema + Timeline + TablaEnlaces + GestionArbolOpd) | M | medio (refactor estructural mayor) |
| **L2** | tokens.ts central completo + ESLint rule + migración archivo por archivo | `app/src/ui/tokens.ts` (extensión) + `app/src/ui/tokens.test.ts` + ~108 archivos UI (migración mecánica) + ESLint config | L | medio (volumen alto, cero cambio funcional) |
| **L3** | Destilar 6 methodological-checkers + panel visual | `app/src/modelo/checkers.ts` (NUEVO ~250 LOC) + `app/src/modelo/checkers.test.ts` (NUEVO ~150 LOC) + `app/src/modelo/tipos/avisos.ts` (NUEVO si requiere `AvisoMetodologico`) + `app/src/ui/PanelAvisos.tsx` (extensión) o `app/src/ui/PanelMetodologia.tsx` (NUEVO) | M | bajo (dominio nuevo aislado, sin cascada) |
| **L4** | BarraHerramientasElemento.tsx flotante (12 acciones primarias OPCloud, 6 piloto) | `app/src/ui/BarraHerramientasElemento.tsx` (NUEVO) + `app/src/ui/InspectorEntidad.tsx` (LECTURA + integración del botón "···") + `app/src/render/jointjs/handlers/seleccion.ts` (LECTURA — wiring del anchor) | M | medio (componente flotante con anchor canvas, lógica posicionamiento) |

Quedan fuera de ronda 13 (diferidas a ronda 14, ver §4b lista cerrada).

## 7. Mapa de archivos por línea

Convención: `aditivo` = solo agregar campos opcionales/funciones nuevas; `nuevo` = archivo creado por esa línea; `lectura` = puede leerse pero no editarse; `extiende` = agrega funciones públicas nuevas sin tocar las previas; `refactor` = cambio estructural mayor autorizado por brief; vacío = sin contacto.

| Archivo | L1 | L2 | L3 | L4 |
|---|---|---|---|---|
| `app/src/ui/Toolbar.tsx` | refactor (1098 → ~80 LOC orquestador) | — | — | — |
| `app/src/ui/toolbar/ToolbarBase.tsx` | nuevo | — | — | — |
| `app/src/ui/toolbar/ToolbarSeleccion.tsx` | nuevo | — | — | lectura (slot opcional para BarraHerramientasElemento) |
| `app/src/ui/toolbar/ToolbarMultiseleccion.tsx` | nuevo | — | — | — |
| `app/src/ui/toolbar/ToolbarCreacion.tsx` | nuevo | — | — | — |
| `app/src/ui/toolbar/ToolbarMapaSistema.tsx` | nuevo | — | — | — |
| `app/src/ui/App.tsx` | aditivo (lazy MapaSistema + Timeline + TablaEnlaces + GestionArbolOpd) | — | aditivo (montar PanelMetodologia si decide panel hermano) | aditivo (montar BarraHerramientasElemento condicional a selección) |
| `app/src/ui/MapaSistema.tsx`, `Timeline.tsx`, `TablaEnlaces.tsx`, `GestionArbolOpd.tsx` | lectura (verificar export para lazy) | — | — | — |
| `app/src/ui/tokens.ts` | lectura (usar `tokens.colors` en 5 nuevos toolbar/) | extensión (spacing/radii/shadows/typography) | — | lectura (usar tokens) |
| `app/src/ui/tokens.test.ts` | — | aditivo (assertions tokens nuevos) | — | — |
| `app/src/ui/inspector/Seccion*.tsx` (11 archivos) | — | aditivo (migrar literales a tokens) | — | — |
| `app/src/ui/MenuContextual{Entidad,Enlace,Arbol}.tsx` | — | aditivo (migrar literales) | — | — |
| `app/src/ui/Dialogo*.tsx` (~14 archivos) | — | aditivo (migrar literales) | — | — |
| `app/src/ui/Modal*.tsx` (~4 archivos) | — | aditivo (migrar literales) | — | — |
| `app/src/ui/MenuPrincipal.tsx`, `PantallaInicio.tsx`, `ArbolOpd.tsx`, `BibliotecaCosa.tsx`, `arbol/NodoOpd.tsx`, `panelOpl/*.tsx` | — | aditivo (migrar literales) | — | — |
| `app/src/ui/PanelAvisos.tsx` | — | — | extensión aditiva (si decide extender en lugar de panel hermano) | — |
| `app/src/ui/PanelMetodologia.tsx` | — | — | nuevo (si decide panel hermano) | — |
| `app/src/modelo/checkers.ts` | — | — | nuevo (~250 LOC con 6 checkers) | — |
| `app/src/modelo/checkers.test.ts` | — | — | nuevo (~150 LOC, ~150 tests) | — |
| `app/src/modelo/tipos/avisos.ts` | — | — | nuevo (si requiere `AvisoMetodologico`) | — |
| `app/src/ui/BarraHerramientasElemento.tsx` | — | — | — | nuevo (~400 LOC) |
| `app/src/ui/InspectorEntidad.tsx` | — | — | — | lectura + integración mínima del botón "···" → toggle Inspector |
| `app/src/render/jointjs/handlers/seleccion.ts` | — | — | — | lectura (anchor al canvas; si requiere extensión, pausar y reportar) |
| `app/src/store/seleccion.ts` | lectura (discriminante de modo) | — | — | lectura (entidad/apariencia seleccionada) |
| `app/src/store/runtime.ts` | lectura (modoEnlace, modoCreacion, vistaMapaActiva) | — | — | — |
| `eslint.config.js` o `.eslintrc.cjs` | — | nuevo o extendido | — | — |
| `app/e2e/0X-*.spec.ts` (8 archivos post-T1.4) | aditivo (smokes split toolbar) | aditivo (smokes visual snapshot) | aditivo (smokes panel metodologia) | aditivo (smokes barra flotante) |
| `app/src/modelo/tipos.ts` | — | — | aditivo (re-export de `tipos/avisos.ts`) | — |
| `assets/svg/**` | LECTURA | LECTURA | LECTURA | LECTURA |
| `opm-extracted/**` | LECTURA | LECTURA | LECTURA (6 checkers + tests) | LECTURA (lista 12 acciones) |
| `docs/HANDOFF.md` | — | — | — | — |
| `docs/historias-usuario-v2/**` | — | — | — | — |
| `docs/historias-usuario-v2/tools/progress-dashboard.mjs` | — | — | — | — |

Reglas de colisión:

- **`app/src/ui/Toolbar.tsx`**: solo L1 lo toca (refactor a orquestador). L2 NO migra Toolbar.tsx a tokens (post-L1, los 5 nuevos archivos `toolbar/*.tsx` lo harán naturalmente importando `tokens.colors`).
- **`app/src/ui/App.tsx`**: L1 (lazy MapaSistema/Timeline/TablaEnlaces/GestionArbolOpd) + L3 (montar PanelMetodologia condicional) + L4 (montar BarraHerramientasElemento condicional). Hunks disjuntos: L1 toca imports lazy y rendering principal; L3 monta panel hermano en una zona del layout; L4 monta componente flotante por separado. **Coordinación**: L1 primero (lazy es base), luego L3 (panel layout), luego L4 (overlay).
- **`app/src/ui/tokens.ts`**: L2 lo expande exclusivamente; L1 lo lee para los 5 nuevos archivos toolbar/. Sin conflicto.
- **`app/src/ui/InspectorEntidad.tsx`**: L4 lo lee y agrega solo la integración del botón "···" → toggle Inspector. L3 NO lo toca (panel metodológico va en App.tsx, no en Inspector).
- **`app/src/render/jointjs/handlers/seleccion.ts`**: L4 SOLO LECTURA. Si requiere extensión para anchor canvas, **pausa y reporta** (cambio render fuera de scope).
- **Smokes en `app/e2e/0X-*.spec.ts`**: cada línea agrega smokes al final del archivo correspondiente sin tocar tests previos. L1 ~3 (split Toolbar), L2 ~3 (visual snapshot), L3 ~2 (panel metodología), L4 ~3 (barra flotante).
- **`app/src/ui/BarraHerramientasElemento.tsx`**: solo L4 lo crea. L1 deja un slot opcional en `ToolbarSeleccion.tsx` (lectura) para que L4 invoque o lo monte separado.
- **Detector ledger**: cada línea declara internamente sus reglas; consolidación operador agrega ~6-10 reglas nuevas (L1 ~2, L2 ~1, L3 ~3, L4 ~2).

## 8. Protocolo de conciliación (orden de merge)

Orden sugerido: **L2 → L1 → L4 → L3 → consolidación operador**.

Rationale categorial:

1. **L2 tokens central primero** (riesgo medio, dependencia base): expande `tokens.ts` con spacing/radii/shadows/typography y migra los 108 literales UI. Si L2 falla aquí, L1 tendría que usar literales en los 5 nuevos archivos toolbar/ (rollback parcial). Aterriza primero para que el resto consuma tokens.
2. **L1 split Toolbar segundo**: refactor de Toolbar.tsx a orquestador + 5 archivos por modo + lazy adicional. Aterriza después de L2 para que los 5 nuevos archivos toolbar/ ya importen `tokens.colors` y `tokens.spacing` etc. desde el inicio.
3. **L4 BarraHerramientasElemento tercero**: depende de la estructura de Toolbar split (L1 puede dejar un slot en ToolbarSeleccion.tsx). Aterriza después de L1 para no chocar.
4. **L3 panel metodológico cuarto**: dominio nuevo aislado, sin cascada con L1/L2/L4. Aterriza al final para no entrar en el orden de merge crítico.
5. **Consolidación operador**: regenera detector + actualiza HANDOFF + commit final `chore(ronda13): glue + ledger + handoff`. Cero línea L5 separada por la naturaleza del trabajo (refactor estructural + dominio nuevo, no cosecha HU).

Después de cada merge: `cd app && bun run check`; si tocó UI/render: `bun run browser:smoke`; al cierre de ronda: `bun run build` y auditoría HU con `--sync-real --strict`.

Chequeo de contrato por merge:

- **Export surface**: cada línea declara qué exports nuevos agrega. Cero rename, cero break. **L1 preserva el export `Toolbar`** desde `./Toolbar` (consumidores no cambian).
- **JSON lossless**: cero cambios serializadores en ronda 13.
- **OPL invariante**: cero oraciones nuevas. **L3 emite avisos metodológicos**, NO oraciones OPL.
- **Behavioral surface**: `data-testid` previos preservados. `data-testid` nuevos van en los 5 archivos toolbar/, BarraHerramientasElemento, PanelMetodologia.
- **Bundle**: post-L1 chunk principal debe medir ≤ 195 kB (objetivo histórico). Si crece, L1 reporta y propone medida adicional.
- **Lint**: post-L2 `bun run lint` debe pasar (cero literales `#xxxxxx` en `app/src/ui/**` excepto tokens.ts).
- **Detector surface**: cada línea declara su evidencia; consolidación agrega reglas nuevas.

## 9. Anclaje obligatorio: SSOT (autoridad) + nivel 2 + nivel 3 (respaldo)

Antes de codificar cada línea, leer **en este orden**:

**Nivel 1 — SSOT (autoridad obligatoria)** en `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`:

- `metodologia-opm-es.md`: §metodologia, §inzoom, §unfold (relevante L3 y L4).
- `opm-iso-19450-es.md`: §3.55 Object, §3.69 Process, §3.x Result/Consumption/Effect (relevante L3 checkers).
- `opm-visual-es.md`: V-209 list-logical, V-239 familias estructurales (relevante L4).
- `06-PROVENANCE.md §2`: política operativa (citas obligatorias).
- `00-METODOLOGIA.md §6`: jerarquía SSOT.

**Nivel 2 — `app/src/modelo/tipos.ts` (SSOT viva)**: cualquier extensión kernel (L3 puede agregar `tipos/avisos.ts`) verifica coherencia con ISO-19450.

**Nivel 3 — respaldo técnico (citas opcionales pero recomendadas)**:

- **`docs/JOYAS.md`** completo: paleta canónica + dimensiones + tipografía. **Cita obligatoria L2** por contrato visual.
- **`assets/svg/`** inventario: política PROVENANCE obliga reuso. **Cita obligatoria L4**.
- **`opm-extracted/`** dirigido a la línea: paths verificados en §5.
- **`docs/auditorias/2026-05-07-refactor-radical-steipete.md`**: contrato de ronda 13.
- **HANDOFF + briefs rondas 1-12.1** (`docs/HANDOFF.md §Decisiones Vigentes`): contrato heredado.

**Orden de prioridad cuando hay conflicto**: SSOT (nivel 1) manda → `tipos.ts` (nivel 2) → JOYAS + assets/svg → opm-extracted (nivel 3).

## 10. Brief por línea

| Línea | Brief |
|---|---|
| L1 | [linea-1-toolbar-split-lazy.md](./linea-1-toolbar-split-lazy.md) |
| L2 | [linea-2-tokens-central.md](./linea-2-tokens-central.md) |
| L3 | [linea-3-checkers-metodologicos.md](./linea-3-checkers-metodologicos.md) |
| L4 | [linea-4-barra-herramientas-elemento.md](./linea-4-barra-herramientas-elemento.md) |

Prompt para asignar líneas: [prompt-asignacion.md](./prompt-asignacion.md).

## 11. Verificación al cierre de la ronda

```bash
cd app
bun run check
bun run browser:smoke
bun run build
bun run lint  # solo si L2 introdujo config ESLint
cd ..
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real --strict
```

Métricas esperadas post-ronda 13 (sobre base post-ronda-13.0: 675 unit / ~2700 expect, 86 smokes, chunk principal 218.99 kB / 59 kB gzip, MVP-α 98.8%):

- **Unit tests ≥ 825** (L3 ~150 nuevos checkers + L4 ~30 barra; L1+L2 sin tests funcionales nuevos significativos).
- **Smoke browser ≥ 92** (L1 ~3, L2 ~3 visual snapshots, L3 ~2, L4 ~3).
- **Build**: chunk principal **≤ 195 kB / ≤ 53 kB gzip** (objetivo histórico recuperado por T2.6 lazy splits).
- **Lint**: `bun run lint` pasa con cero violaciones de `no-restricted-syntax` color literales en `app/src/ui/**` excepto tokens.ts.
- **Toolbar.tsx**: **≤ 100 LOC** (orquestador delgado).
- **Detector ledger**: ≥ 110 reglas matched (vs baseline post-ronda-12.1; +6-10 nuevas por L3+L4 + correcciones por L1+L2). Cero unmatched nuevos.
- **MVP-α ≥ 98.8%** (preservado; HU-SHARED-007 sigue diferida a ronda 14). L3 puede abrir nueva métrica complementaria "modelo metodológicamente válido" si se quiere registrar en ledger separado.
- **APIs públicas sin cambios**: ningún rename de exports kernel. **`Toolbar` sigue exportado desde `./Toolbar`** (refactor interno).
- **Contratos observables sin cambios**: JSON roundtrip preservado, OPL invariante (cero oraciones nuevas), `data-testid` previos preservados, `data-testid` nuevos aditivos.
- **`docs/HANDOFF.md` permanece intacto** durante las líneas; se actualiza solo en consolidación final del operador.

Si una métrica no se cumple, la línea correspondiente lo declara explícito con rationale.
