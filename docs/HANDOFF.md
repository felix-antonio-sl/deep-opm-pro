# HANDOFF - Ronda 15 cerrada, Beta1 habilitada

**Fecha**: 2026-05-07
**Repositorio**: `deep-opm-pro`
**Rama**: `main`
**Corte**: ronda 15 fusionada (Beta0 hardening pre-Beta1) cerrada con cinco lineas integradas en serie controlada con paralelismo seguro.
**Estado**: alpha real cerrado preservado; superficie de modelado diaria estabilizada; Beta1 abierta para diseno de ronda 16 (`docs/instrucciones-lineas-dev/ronda16/` ya existe como diseno previo).

## Politica De Handoff Unico

`docs/HANDOFF.md` es la unica memoria de traspaso vigente del proyecto. Este
archivo reemplaza y consolida el handoff anterior. No crear handoffs paralelos,
fechados ni duplicados.

## Contexto Normativo

El modelador OPM vive en `app/` con Bun + Vite + Preact + Zustand + JointJS OSS.
La arquitectura sigue siendo propia: no Angular, no Firebase, no Rappid.

Autoridad semantica:

- SSOT OPM/ISO 19450: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`
- Evidencia operacional OPCloud: `opm-extracted/`
- Evidencia visual canonica: `assets/svg/`, `assets/png/`, `docs/JOYAS.md`
- Backlog vivo: `docs/historias-usuario-v2/`
- Corte operativo vivo: `docs/roadmap/cortes-operativos.md`

## Memoria Consolidada Del Corte

La ronda 15 fusiono el plan original de hardening (`Dialogo` + Toolbar `⋯ Más`)
con la propuesta de ronda 16 visual (IFML, canvas fidelity, superficie
contextual), entregando Beta0 endurecido en cinco lineas:

- **L1** estabilizo el sustrato modal: causa raiz del bug `Dialogo` invisible
  era que el componente vivia dentro de `<main display:grid>` y era vulnerable
  a containing-block traps de cualquier ancestro con `transform/filter/contain/
  will-change`. Fix: portal unico a `document.body` via `createPortal` de
  `preact/compat`. Reverts: la migracion `modal-grid` quedo reintroducida; la
  affordance `mask-image` quedo en territorio L2; el cambio canvas
  `role="application"` quedo diagnosticado pero no reintroducido por romper
  helpers `getByRole("img", { name: "OPD activo" })` en multiples smokes.
- **L3** normalizo IFML eligiendo Ruta B (reemplazo SystemEvent ad-hoc por
  estado tipado): `nuevaCosaPendiente: { entidadId, aparienciaId, nombre } |
  null` reemplaza `window.dispatchEvent("opm:nueva-cosa")`; el ToolbarBase lo
  consume del store y se limpia con `confirmarNombreNuevaCosa` o
  `descartarNuevaCosaPendiente`. Eval `evaluacion-exhaustiva.mjs` admite
  `--out <subdir>` para no pisar capturas y agrega 4 verificadores IFML.
- **L2** rebalanceo Toolbar de ~38 a 22 controles visibles iniciales con
  `ToolbarMas.tsx` (boton `⋯ Más`) accesible (Enter/Space/ArrowDown abren,
  Escape cierra, click-outside cierra, `aria-haspopup="menu"`,
  `aria-expanded`, items `role="menuitem"`). Algunas acciones se replican en
  banda y en menu para no romper smokes legacy que dependen de testIds
  estables; documentado como deuda de cleanup futuro, no bloqueo.
- **L4** mejoro fidelidad visual: `connector: jumpover` en enlaces procedurales
  con `routerManhattan` aclara cruces en modelos medianos sin nueva
  dependencia; accion `aplicarLayoutSugerido` undoable (BFS por niveles desde
  fuentes) expuesta como boton "Sugerir layout" en `ToolbarCreacion`.
  Metadata `opm.kind`/`tipo`/`enlaceId` preservada (`law-render-stable-metadata`
  intacta).
- **L5** cerro coherencia UX: Inspector con `data-modo-inspector`/`aria-live`,
  indicador "esta cosa aparece N veces en M OPDs" para resolver friccion
  apariencia≠entidad, navegacion "Ir al OPD donde aparece este enlace" cuando
  el enlace esta fuera del OPD activo, scroll OPL a la oracion seleccionada,
  PanelMetodologia y PanelAvisos colapsables sin perder contador. Contrato
  TablaEnlaces Beta1 sintetizado en `e2e/15-superficie-contextual.spec.ts`
  como `describe.skip` con seis decisiones operables (columnas minimas,
  seleccion bidireccional, edicion in-place, navegacion a extremos, render con
  virtualizacion sobre 200 enlaces, layout como pestana en BarraPestanas).

## Commits Del Corte

| Linea | Commit | Mensaje |
|---|---|---|
| L1 | `c2a66d7` | `test(e2e): reproduce dialogo-portal y exige paint sobre canvas+grid` |
| L1 | `8c43075` | `fix(ui): porta Dialogo a body para sobrevivir al workbench grid+SVG` |
| L1 | `dbdd29c` | `a11y(modal-grid): reintroduce migracion a Dialogo canonico con smoke focal` |
| L1 | `f8017ed` | `fix(modal-grid): preserva testid del wrapper completo tras migracion` |
| L3 | `eb493f2` | `refactor(ifml): tipa flujo nueva-cosa como NavigationFlow del store` |
| L3 | `88ce250` | `test(e2e): cubre flujo IFML nueva-cosa pre-beta1` |
| L3 | `6aeb30e` | `chore(eval): mejora evaluacion exhaustiva visual pre-Beta1` |
| L2 | `be851d4` | `feat(toolbar): agrega menu Mas accesible` |
| L2 | `6111533` | `refactor(toolbar): mueve acciones secundarias a Mas` |
| L2 | `c1fa142` | `test(e2e): toolbar overflow queda bajo control` |
| L4 | `56208a3` | `fix(render): connector jumpover en enlaces procedurales con routerManhattan` |
| L4 | `b1a39b8` | `feat(canvas): layout sugerido aplicable y undoable` |
| L4 | `00ab638` | `test(e2e): canvas fidelity pre-beta` |
| L5 | `6b875f3` | `ux(superficie): alinea seleccion entre barra inspector opl y arbol` |
| L5 | `b535758` | `test(e2e): journey contextual pre-beta1` |
| L5 | `8aeff65` | `docs(beta1): contrato UX para TablaEnlaces` |

## Topologia De Ejecucion

Steipete dirigio con orden de merge `L1 -> L3 -> L2 -> L4 -> L5` y paralelismo
seguro donde el espacio de archivos lo permitia: L1 y L2 corrieron en
worktrees aislados simultaneos; L3 lanzo cuando L1 mergeo a main; L2 quedo en
cola y se mergeo despues de L3; L4 y L5 corrieron secuencialmente sobre main
con todas las lineas previas integradas. Todas las ramas se rebasaron sobre
main al cierre y se ff-mergearon. Conflicto unico: `ToolbarBase.tsx` entre L3
(reemplazo del listener `opm:nueva-cosa` por subscripcion al store) y L2
(adicion de hooks del menu Mas y un `[nuevaCosa, setNuevaCosa]` local que L3
ya habia obsoletado); resuelto descartando el estado local muerto.

## Verificacion Final Ejecutada

Estado vigente post-ronda 15 (`main` @ `8aeff65`):

```bash
cd app && bun run check
# 912 pass / 0 fail / 3569 expect() / 92 archivos

cd app && bun run lint
# eslint src/ui/ OK

cd app && bun run build
# vite build OK
# main bundle: 256.09 kB / 68.49 kB gzip

cd app && bun run browser:smoke
# 128 passed / 5 skipped (contrato TablaEnlaces L5)

cd app && bun run scripts/quality-ledger.mjs --markdown
# Canonical laws: 6/6
# Compat detectors: 1
# MVP-alpha: 121/121 (100%)
# Auto rules: 102/102 matched
```

Desde la raiz:

```bash
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
# HU vivas: 1126
# Total: 28.5% ponderado (313 cubiertas, 22 parciales, 413 pendientes, 378 diferidas)
# MVP-alpha: 100.0% ponderado (121 cubiertas, 0 parciales, 0 pendientes)
# 102/102 reglas matched
```

Eval exhaustiva (`bun run scripts/evaluacion-exhaustiva.mjs --out
ronda-15-cierre` con vite corriendo): 17 criterios, 11 OK, 2 WARN heredados de
toolbar (`overflow-horizontal` 851px delta, `ratio-disabled-inicial` 27.5%), 0
errors runtime, 7 axe rutas, INFO `dialogo-en-body: true` confirma portal L1
activo. Dos FAIL `dialogos/dialogo-biblioteca` y `dialogos/dialogo-menu-principal`
son criterios L3 que asumen `[role="dialog"]` tras click en botones que en
realidad despliegan paneles/menus inline (no Dialogos canonicos); deuda de
afinacion del eval, no regresion.

Bundle delta acumulado vs baseline pre-ronda (`244.67 kB / 65.71 kB gzip`):
**+11.42 kB raw / +2.78 kB gzip**, dentro del umbral de 3 kB gzip declarado
en el README §9. Distribucion: L2 +1.74 KB gzip (menu Mas + hooks), L4 +0.07
KB gzip (jumpover + layoutSugerido), L5 +1.17 KB gzip (Inspector/OPL/Paneles).

## Reverts Conscientes Tras Ronda 15

- **`789eb0e` modal-grid**: REINTRODUCIDA bajo portal L1, smoke focal en
  `[L1] aria-labelledby y Esc captura`.
- **`816e7bf` mask-image affordance scroll horizontal**: NO reintroducida.
  Diagnostico: cambio mecanicamente compatible con portal pero pertenece a
  `toolbarStyles.ts`/territorio L2. Queda como mejora opcional para una linea
  futura de polish; no bloquea Beta1.
- **`73f46ce` canvas role="application"**: NO reintroducida. Diagnostico:
  introduce `tabIndex={0}` en SVG y reordena pseudo-stacking; rompe selectores
  `getByRole("img", { name: "OPD activo" })` en `_smoke-helpers.ts` y al menos
  `01,05,06,07,08-*.spec.ts`. Cambio atomico pero requiere actualizar
  helpers en bloque, lo que excede scope L1 y L4. Queda como deuda de a11y a
  ejecutar con migracion de helpers en una linea dedicada.

## Estado Por Dominio

- **Modelo/kernel**: estable. Sin cambios semanticos en ronda 15.
- **OPL**: reverse editable cerrado para alpha; sin tocar parser ni preview.
- **Render JointJS**: jumpover y layout sugerido aplicable. Metadata estable
  cubierta por ley `law-render-stable-metadata`.
- **Store**: contrato de slices preservado; nuevas acciones UI tipadas
  (`confirmarNombreNuevaCosa`, `descartarNuevaCosaPendiente`,
  `aplicarLayoutSugerido`) con membresia explicita en `sliceTypes.ts`.
- **Runtime/browser effects**: sin nuevos accesos directos a globals.
- **UI workbench**: Toolbar con menu Mas; Inspector/OPL/Paneles coherentes;
  modal stack via portal a body.
- **Eval**: `evaluacion-exhaustiva.mjs` con `--out` y verificadores IFML L3.
- **Dashboard HU**: alpha 100%; total 28.5%.

## Gates Beta1

Beta1 (`docs/instrucciones-lineas-dev/ronda16/`) queda HABILITADA. Diseno ya
producido por `4739836`:

- L1 ronda 16: TablaEnlaces como pestana en workbench (contrato definido por
  L5 ronda 15 en `e2e/15-superficie-contextual.spec.ts` describe.skip).
- L2 ronda 16: busqueda intra-modelo.
- L3 ronda 16: validacion metodologica.
- L4 ronda 16: catalogo modelos ancla.
- L5 ronda 16: eval Beta1 dominio real.

Pre-condiciones de Beta1 confirmadas por ronda 15:

- Modal layer estable (L1).
- IFML flow nueva-cosa tipado (L3).
- Toolbar sin overflow horizontal nuevo (L2).
- Canvas con cruces legibles y autolayout disponible (L4).
- Superficie contextual coherente y contrato TablaEnlaces operable (L5).

## Deuda Viva Reconocida

| Item | Origen | Sugerencia |
|---|---|---|
| `mask-image` affordance scroll horizontal Toolbar no reintroducida | L1/L2 | linea de polish post-Beta1 |
| canvas `role="application"` no reintroducido | L1/L4 | requiere migrar helpers `getByRole("img")` en bloque |
| Acciones replicadas en banda y menu Mas | L2 | actualizar smokes legacy y mover puro al menu |
| FAIL eval `dialogo-biblioteca` / `dialogo-menu-principal` | L3 | refinar criterios eval para distinguir Dialogo canonico vs panel/menu inline |
| HU-13.005 duplicate-id (legado pre-ronda-8) | dashboard | sin bloqueo |

## Proximos Pasos Operativos

1. Ejecutar ronda 16 (`docs/instrucciones-lineas-dev/ronda16/`) para Beta1
   dominio real (TablaEnlaces, busqueda, validacion metodologica, catalogo
   modelos ancla, eval Beta1).
2. Definir evals Beta1 contra modelos ancla (`hd-dt`, `hdos`, `hdos-app`).
3. Mantener loop verde:
   - `cd app && bun run check`
   - `cd app && bun run lint`
   - `cd app && bun run build`
   - `cd app && bun run browser:smoke`
   - `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real`

## Prompt De Continuacion Breve

Usa `docs/HANDOFF.md` como memoria unica. Beta0 hardening cerrado: portal modal,
IFML flow tipado, Toolbar `⋯ Más`, canvas con jumpover y autolayout sugerido,
superficie contextual coherente. Beta1 habilitada: ejecutar ronda 16 fusionada
para TablaEnlaces, busqueda intra-modelo, validacion metodologica, catalogo y
eval contra modelos ancla. Tres deudas conocidas (mask-image, canvas role
application, acciones replicadas Toolbar) quedan documentadas como polish
opcional, no bloqueo.
