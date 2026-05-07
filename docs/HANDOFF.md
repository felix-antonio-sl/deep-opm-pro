# HANDOFF - Ronda 15 cerrada, Beta1 habilitada

**Fecha**: 2026-05-07  
**Repositorio**: `deep-opm-pro`  
**Rama**: `main`  
**Corte**: ronda 15 fusionada cerrada; Beta0 hardening completo; Beta1 habilitada.  
**Estado de codigo**: `main` incluye ronda 15 hasta `ae79282`, hotfix posterior `c51e109` para barra contextual y fixes `e1c8528`/`d63c8e2` para despliegue/unfold. Este handoff consolida ese estado y versiona bugs capturados post-cierre.

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

Regla viva: OPCloud operacionaliza OPM, pero no redefine la semantica. Antes de
crear una solucion nueva, revisar SSOT, `assets/`, `docs/JOYAS.md` y
`opm-extracted/`.

## Estado Ejecutivo

Ronda 15 cerro el hardening Beta0 pre-Beta1. La app ya puede entrar a ronda 16
Beta1 con sus precondiciones confirmadas:

- `Dialogo` estable via portal a `document.body`.
- IFML local sin `window.dispatchEvent("opm:nueva-cosa")`; flujo nueva-cosa
  vive tipado en store.
- Toolbar con menu `⋯ Mas`, 22 controles visibles iniciales y controles
  secundarios fuera de la banda principal.
- Canvas con `connector: jumpover` en enlaces procedurales y layout sugerido
  aplicable/undoable.
- Superficie contextual mas coherente: Inspector, OPL, arbol, paneles y barra
  contextual alineados.
- Alpha real preservado en 100%: OPL reverse editable ya no queda parcial.

La siguiente ronda operacional es **ronda 16 / Beta1**:
`docs/instrucciones-lineas-dev/ronda16/`.

## Memoria Consolidada De Ronda 15

### L1 - Dialogo root-cause

Se reprodujo y corrigio la causa raiz del `Dialogo` invisible: el componente
vivía dentro de `<main display:grid>` y quedaba vulnerable a containing-block
traps por ancestros con `transform`, `filter`, `contain` o `will-change`. El
fix porta `Dialogo` a `document.body` con `createPortal` de `preact/compat`.

La migracion `modal-grid` quedo reintroducida con smoke focal. Quedan fuera:
`mask-image` de affordance scroll y `canvas role="application"`, ambos
documentados como deudas no bloqueantes.

### L3 - IFML local

Ruta B aplicada: `nuevaCosaPendiente: { entidadId, aparienciaId, nombre } |
null` reemplaza el evento DOM `opm:nueva-cosa`. `ToolbarBase` consume el estado
del store y lo limpia con `confirmarNombreNuevaCosa` o
`descartarNuevaCosaPendiente`.

`evaluacion-exhaustiva.mjs` admite `--out <subdir>` y agrega verificadores IFML
para no pisar capturas y poder comparar rondas.

### L2 - Toolbar Mas

`ToolbarMas.tsx` agrega menu accesible para acciones secundarias. Soporta
Enter/Space/ArrowDown para abrir, Escape para cerrar, click-outside y semantica
`aria-haspopup="menu"`, `aria-expanded`, `role="menuitem"`.

La banda queda con 22 controles visibles iniciales. Algunas acciones siguen
replicadas en banda y menu para preservar smokes legacy; se deja como cleanup.

### L4 - Canvas fidelity

`connector: jumpover` en enlaces procedurales con `routerManhattan` mejora
cruces sin nueva dependencia. `aplicarLayoutSugerido` usa BFS por niveles,
entra como accion undoable y se expone como "Sugerir layout". La ley
`law-render-stable-metadata` se preserva.

### L5 - Superficie contextual

Inspector agrega `data-modo-inspector` y `aria-live`; muestra
apariencia≠entidad cuando una cosa aparece en multiples OPDs. Enlaces fuera del
OPD activo ofrecen "Ir al OPD". Panel OPL scrollea a la oracion seleccionada.
PanelMetodologia y PanelAvisos son colapsables sin perder contador.

El contrato Beta1 de `TablaEnlaces` queda expresado como `describe.skip` en
`e2e/15-superficie-contextual.spec.ts`.

## Hotfix Post-Cierre

| Commit | Aporte | Estado |
|---|---|---|
| `c51e109` | `fix(barra-contextual): oculta copiar/pegar-estilo sin enlace operable` | Resuelve `BUG-20260507T211815Z-d78ae2`. Los botones "Copiar"/"Pegar" eran acciones de estilo de enlace, pero se mostraban con entidad seleccionada sin enlace operable. Ahora se ocultan cuando no aplican y reaparecen cuando hay enlace. Incluye unit de `accionesPilotoBarra` y ajuste e2e en `02-canvas-y-render.spec.ts`. |
| `e1c8528` | `fix(render): despliegue no proyecta contorno embebido` | Primera mitad de `BUG-20260507T211702Z-372334`: en OPD hijo, solo `descomposicion/inzoom` usa contorno embebido; `despliegue/unfold` renderiza el padre como entidad normal. Incluye test `BUG-372334` en `proyeccion.test.ts`. |
| `d63c8e2` | `fix(modelo): posiciona partes de despliegue fuera del padre` | Segunda mitad de `BUG-20260507T211702Z-372334`: la operacion `desplegarObjeto` crea al padre con tamaño normal y posiciona partes/refinadores fuera, debajo, conectados por enlaces estructurales. Incluye aserciones en `operaciones.test.ts`. |

## Commits Relevantes

| Linea | Commits | Aporte |
|---|---|---|
| L1 | `c2a66d7`, `8c43075`, `dbdd29c`, `f8017ed` | Reproduccion dialogo-portal, portal a body, modal-grid canonico, preservacion de testid. |
| L3 | `eb493f2`, `88ce250`, `6aeb30e` | IFML nueva-cosa tipado en store, smoke, evaluacion exhaustiva con `--out`. |
| L2 | `be851d4`, `6111533`, `c1fa142` | `ToolbarMas.tsx`, acciones secundarias a Mas, smoke overflow. |
| L4 | `56208a3`, `b1a39b8`, `00ab638` | Jumpover procedural, layout sugerido undoable, smoke canvas fidelity. |
| L5 | `6b875f3`, `b535758`, `8aeff65` | Superficie contextual, journey pre-Beta1, contrato TablaEnlaces. |
| Cons. | `ae79282` | HANDOFF/cortes/dashboard ronda 15; Beta1 habilitada. |
| Hotfix | `c51e109` | Oculta copiar/pegar estilo sin enlace operable. |
| Hotfix | `e1c8528` | Despliegue/unfold no proyecta contorno embebido en OPD hijo. |
| Hotfix | `d63c8e2` | Despliegue/unfold posiciona partes afuera del padre. |

## Verificacion Final Conocida

Loop verde del cierre ronda 15 (`main @ ae79282`):

```bash
cd app && bun run check
# 912 unit / 0 fail

cd app && bun run lint
# clean

cd app && bun run build
# 256.09 kB / 68.49 kB gzip

cd app && bun run browser:smoke
# 128 passed / 5 skipped (contrato TablaEnlaces)

node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
# MVP-alpha 100.0%; 102/102 reglas matched
```

Notas:

- Los hotfixes `c51e109`, `e1c8528` y `d63c8e2` tienen pruebas focales asociadas. No
  consta aqui un full loop completo posterior a esos hotfixes.
- Verificacion focal ejecutada para `e1c8528`/`d63c8e2`:
  `cd app && bun test src/modelo/operaciones.test.ts src/render/jointjs/proyeccion.test.ts` -> 88 pass / 0 fail.
- Bundle queda bajo el umbral de delta gzip de ronda 15: +2.78 KB gzip vs
  baseline pre-ronda.
- Vite dev server estuvo activo en `http://138.201.53.205:5173/` durante la
  captura de bugs; no es requisito de estado persistente.

## Bugs Capturados Post-Cierre

Los siguientes bugs quedan versionados bajo `docs/bugs/` para referencia de
agentes.

| Bug | Estado | Lectura operativa |
|---|---|---|
| `BUG-20260507T211702Z-372334` | Resuelto por `e1c8528` + `d63c8e2` | En despliegue/unfold, los componentes aparecian dentro del contenedor grande. Los fixes limitan el contorno embebido a `descomposicion/inzoom` y posicionan los refinadores de `despliegue/unfold` fuera del padre. Mantener reporte como evidencia visual. |
| `BUG-20260507T211815Z-d78ae2` | Resuelto por `c51e109` | Botones de barra contextual "Copiar"/"Pegar" aparecian inactivos porque no habia enlace operable. Se ocultaron cuando no aplican. Mantener reporte como evidencia. |
| `BUG-20260507T212356Z-692129` | Abierto | Paneles/Workbench se perciben visualmente sucios y poco usables. Afecta calidad de uso diario; candidato a sub-slice de polish visual temprano en ronda 16, especialmente L3/L5, sin reabrir Beta0 global. |

## Deuda Viva No Bloqueante Para Beta1

| Item | Origen | Sugerencia |
|---|---|---|
| `mask-image` affordance scroll horizontal Toolbar no reintroducida | L1/L2 | Polish post-Beta1 o micro-ronda visual. |
| canvas `role="application"` no reintroducido | L1/L4 | Requiere migrar helpers `getByRole("img")` en bloque. |
| Acciones replicadas en banda y menu Mas | L2 | Actualizar smokes legacy y mover acciones secundarias solo a Mas. |
| FAIL eval `dialogo-biblioteca` / `dialogo-menu-principal` | L3 | Refinar criterios: panel/menu inline no son Dialogo canonico. |
| `BUG-20260507T212356Z-692129` | Captura post-cierre | Tratar como polish visual de workbench en Beta1 temprano. |
| HU-13.005 duplicate-id | Dashboard legado | Sin bloqueo. |

## Ronda 16 / Beta1

Diseño ejecutable ya existe en `docs/instrucciones-lineas-dev/ronda16/`:

1. **L1 Tabla de Enlaces workbench**: convertir la tabla en superficie de
   inspeccion/edicion real.
2. **L2 Busqueda intra-modelo**: Ctrl/Cmd+F, apariciones, salto a OPD,
   seleccion visible y OPL sync.
3. **L3 Validacion metodologica accionable**: avisos con severidad, cita SSOT,
   navegacion y revalidacion.
4. **L4 Catalogo simple + modelos ancla**: fijar evals reales sobre `hd-dt`,
   `hdos`, `hdos-app` o KORA/HDOS/HODOM/GOREOS.
5. **L5 Eval Beta1 dominio real**: flujo end-to-end sin workaround.

Orden recomendado: **L4 -> L3 -> L1 -> L2 -> L5**.

Rationale: L4 fija modelos/evals; L3 define validacion; L1/L2 construyen
superficies de inspeccion/navegacion; L5 cierra con flujo real y absorbe bugs
post-cierre relevantes.

## Criterio De Cierre Beta1

Beta1 solo cierra cuando al menos un dominio ancla real:

1. se modela con multiples OPDs;
2. usa descomposicion, estados, enlaces avanzados y propiedades;
3. pasa validacion metodologica con avisos accionables;
4. permite buscar elementos y navegar al resultado;
5. permite inspeccionar/editar enlaces desde TablaEnlaces;
6. guarda/carga sin perdida;
7. no requiere editar JSON ni usar workaround de desarrollo;
8. resuelve o documenta explicitamente bugs capturados que afecten el flujo.

## Proximos Pasos Operativos

1. Ejecutar ronda 16 desde `docs/instrucciones-lineas-dev/ronda16/`.
2. Incorporar polish visual de `BUG-20260507T212356Z-692129` temprano si
   contamina el uso diario de validacion/OPL/Inspector.
3. Mantener loop verde:
   - `cd app && bun run check`
   - `cd app && bun run lint`
   - `cd app && bun run build`
   - `cd app && bun run browser:smoke`
   - `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real`

## Prompt De Continuacion Breve

Usa `docs/HANDOFF.md` como memoria unica. Ronda 15 esta cerrada y Beta1 esta
habilitada. `main` incluye portal modal, IFML store-flow, Toolbar `⋯ Mas`,
jumpover procedural, layout sugerido undoable, superficie contextual, hotfix de
barra contextual `c51e109` y fixes unfold `e1c8528`/`d63c8e2`. Ejecutar ronda 16:
catalogo/evals ancla, validacion metodologica, TablaEnlaces, busqueda y eval
dominio real. Bug vivo principal: `BUG-20260507T212356Z-692129` (paneles
visualmente poco usables).
