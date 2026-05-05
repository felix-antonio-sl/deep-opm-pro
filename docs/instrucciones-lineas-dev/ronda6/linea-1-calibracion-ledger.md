# Linea 1 — Calibracion del ledger HU

## 1. Mision

Recalibrar el detector `progress-dashboard.mjs` para que sus reglas regex matcheen la realidad de codigo post-ronda 5. Hoy el detector reporta 40/42 reglas matcheadas y subreporta sistematicamente las EPICAs cuyo codigo se reestructuro: EPICA-50 (OPL inverso), EPICA-14 (estilos), EPICA-30 y EPICA-34 (workspace y nuevo modelo), EPICA-1C (creacion interna), EPICA-20 (eliminacion segura) y EPICA-11 (bus + etiquetas). EPICA-50 incluso retrocedio de 18.2% a 3.6% por el refactor de `app/src/opl/` aun cuando la cobertura real subio.

**Slice minimo entregable**: reglas regex actualizadas para las 7 EPICAs senaladas en el HANDOFF, regeneracion de `docs/roadmap/hu-progress.{json,md,html}` y `docs/roadmap/hu-progress-evidence.json`, y un breve registro de calibracion como comentario al final de `progress-dashboard.mjs` (o nota en el commit) que documente que reglas se cambiaron, contra que evidencia (paths + identificadores) y por que.

**Fuera de slice**: cualquier edicion en `app/src`, `app/e2e`, `app/scripts` o `assets/`. Nuevos archivos en `docs/` que no sean la regeneracion de `hu-progress.*`. Cambios en HU del backlog. Refactor del propio `progress-dashboard.mjs` que vaya mas alla de actualizar reglas y notas (no reorganizar funciones, no introducir nuevas estrategias de auditoria).

## 2. HU base

| HU | Path absoluto | Aporte |
|---|---|---|
| (meta) | `/home/felix/projects/deep-opm-pro/docs/HANDOFF.md` (§Pendientes Inmediatos) | Lista las 7 EPICAs con detalle del subreporte. |
| EPICA-50 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | HU-50.002/.017/.018/.019/.020/.022 cubiertas por L1 ronda 5; reglas deben apuntar a `app/src/opl/interaccion.ts` y `app/src/ui/PanelOpl.tsx` actualizado. |
| EPICA-14 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-14-canvas-styling.md` | HU-14.001/.002/.003/.015/.017 cubiertas por L6 ronda 5; reglas deben apuntar a `app/src/modelo/estilos.ts` y `app/src/ui/StyleControls.tsx`. |
| EPICA-30 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-30-persistencia-save-load.md` | HU-30.001/.005/.006/.009/.010/.013/.015/.018 cubiertas por L2 ronda 5; reglas deben apuntar a `app/src/ui/MenuPrincipal.tsx`, `DialogoGuardarComo.tsx`, `DialogoCargarModelo.tsx` y `app/src/persistencia/workspace.ts`. |
| EPICA-34 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-34-persistencia-nuevo-modelo.md` | HU-34.001/.004/.005/.006/.007/.008 cubiertas por L2 ronda 5; reglas deben reconocer "Modelo (No guardado)" y SD vacio. |
| EPICA-1C | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-1c-canvas-validaciones.md` | HU-1C.004 cubierta por L5 ronda 5; reglas deben apuntar a `app/src/modelo/creacionInterna.ts`. |
| EPICA-20 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-20-estructura-arbol-opd.md` | HU-20.015/.016 cubiertas por L3 ronda 5; reglas deben apuntar a `app/src/modelo/opdEliminacion.ts`. |
| EPICA-11 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-11-canvas-modelado-basico.md` | HU-11.004 (bus agregacion) y HU-11.014 (etiqueta enlace) cubiertas por L4 ronda 5; reglas deben reconocer `app/src/render/jointjs/agregacionBus.ts` y `app/src/modelo/etiquetasEnlace.ts`. |

## 3. Anclaje a evidencia

- **Estado actual del codigo (post-ronda 5)**: leer la lista de archivos por EPICA segun la tabla del §2; cada uno existe en `app/src/` y tiene tests asociados.
  - EPICA-50: `app/src/opl/interaccion.ts`, `app/src/ui/PanelOpl.tsx`, `app/src/store.ts` (`fijarHoverOpl`, `fijarFiltroOplPorSeleccion`, `seleccionarDesdeOpl`, `renombrarEntidadDesdeOpl`).
  - EPICA-14: `app/src/modelo/estilos.ts`, `app/src/modelo/estilos.test.ts`, `app/src/ui/StyleControls.tsx`, `app/src/render/jointjs/proyeccion.ts` (overlays de fill/border).
  - EPICA-30: `app/src/ui/MenuPrincipal.tsx`, `app/src/ui/DialogoGuardarComo.tsx`, `app/src/ui/DialogoCargarModelo.tsx`, `app/src/persistencia/workspace.ts`, `app/src/persistencia/local.ts` (con indice tolerante).
  - EPICA-34: `app/src/persistencia/workspace.ts` (titulo "(No guardado)"), `app/src/store.ts` (`crearModeloNuevo`, `opdRaizId` con SD), `app/src/ui/MenuPrincipal.tsx` (entrada "Nuevo modelo").
  - EPICA-1C: `app/src/modelo/creacionInterna.ts`, `app/src/modelo/creacionInterna.test.ts`, `app/src/render/jointjs/JointCanvas.tsx` (enrutamiento de click dentro de bbox).
  - EPICA-20: `app/src/modelo/opdEliminacion.ts`, `app/src/modelo/opdEliminacion.test.ts`, `app/src/ui/ArbolOpd.tsx` (boton eliminar bloqueado/habilitado segun hijos).
  - EPICA-11: `app/src/render/jointjs/agregacionBus.ts`, `app/src/modelo/etiquetasEnlace.ts`, `app/src/ui/InspectorEnlace.tsx` (campo etiqueta), `app/src/opl/generar.ts` (sufijo `[etiqueta: ...]`).
- **Detector vigente**: `docs/historias-usuario-v2/tools/progress-dashboard.mjs` (1582 LOC). El array de reglas vive en `autoAuditRules()` (a partir de la linea ~379). Cada regla tiene `ids`, `estado`, `confianza`, `nota`, `requires: [{path, all|any|none}]` y opcional `evidenciaExtra`.
- **Mecanica del detector**: `evaluateRule` exige que TODOS los strings/regex de `all` matcheen y, si hay `any`, al menos uno; `none` no debe aparecer. Si todos los `requires` matchean, la HU pasa al `estado` declarado por la regla. Si falta cualquiera, se reporta "pendiente" con `brechas`.
- **Ledger**: `docs/roadmap/hu-progress-evidence.json` (1509 LOC); `--sync-real` regenera `autoEntries`. Las `entries` manuales solo se mantienen como respaldo para HU sin regla.
- **HANDOFF**: `docs/HANDOFF.md` §Pendientes Inmediatos enumera el subreporte exacto por EPICA.
- **Corpus interno reusable**: ninguno aplica fuera del propio script y `app/src/`. Esta linea **no** consulta `opm-extracted/` ni SSOT — solo usa codigo real.

## 4. Archivos permitidos

```text
docs/historias-usuario-v2/tools/progress-dashboard.mjs   EDIT aditivo fuerte
docs/roadmap/hu-progress-evidence.json                   EDIT regenerado por --sync-real
docs/roadmap/hu-progress.json                            EDIT regenerado
docs/roadmap/hu-progress.md                              EDIT regenerado
docs/roadmap/hu-progress.html                            EDIT regenerado
app/src/**                                               LECTURA (verificar evidencia)
app/e2e/**                                               LECTURA (verificar evidencia)
docs/HANDOFF.md                                          LECTURA (referencia del subreporte)
docs/historias-usuario-v2/**                             LECTURA (no editar HU ni epicas)
```

## 5. Restricciones de no-colision

- No tocar `app/src/`, `app/e2e/` ni `app/scripts/`. Esta linea es de toolchain pura.
- No editar HU ni epicas en `docs/historias-usuario-v2/`. La calibracion es del detector, no del backlog.
- No reorganizar el script: mantener `autoAuditRules()` como punto unico de cambio. Si una regla nueva exige un helper, agregarlo justo encima de `autoAuditRules` y citarlo en el commit.
- No agregar reglas para EPICAs que la ronda 5 no haya cubierto realmente. Las reglas nuevas deben describir la cobertura **actual**, no la deseada.
- No sobreescribir entradas manuales existentes en el bloque `entries` del ledger; tu cambio solo afecta `autoEntries` via `--sync-real`.
- No cambiar la firma de salida del dashboard (esquema `deep-opm-pro.hu-progress-report.v1`); los consumidores externos dependen de el.

## 6. Slice minimo shippeable

### Reglas regex actualizadas

Para cada una de las 7 EPICAs, ajustar o agregar reglas en `autoAuditRules()` siguiendo el patron existente. Reglas mininas esperadas por EPICA:

#### EPICA-50 (OPL inverso post-ronda 5)

```js
{
  ids: ["HU-50.002", "HU-50.017", "HU-50.018", "HU-50.019", "HU-50.020", "HU-50.022"],
  estado: "cubierto",
  confianza: "alta-auto",
  nota: "Auto: panel OPL numerado con tokens estables, hover/click bidireccional canvas<->OPL, filtro por seleccion y renombrado inverso desde la lente.",
  requires: [
    { path: "app/src/opl/interaccion.ts", all: ["generarOplInteractivo", "OplLineaInteractiva", "OplReferencia"] },
    { path: "app/src/ui/PanelOpl.tsx", all: ["filtroOplPorSeleccion", "hoverOplRef", /\d+\.\s/] },
    { path: "app/src/store.ts", all: ["seleccionarDesdeOpl", "renombrarEntidadDesdeOpl", "fijarFiltroOplPorSeleccion", "fijarHoverOpl"] },
  ],
  evidenciaExtra: ["app/src/opl/generar.test.ts", "app/e2e/opm-smoke.spec.ts"],
},
```

#### EPICA-14 (estilo visual cosas)

```js
{
  ids: ["HU-14.001", "HU-14.002", "HU-14.003", "HU-14.015", "HU-14.017"],
  estado: "cubierto",
  confianza: "alta-auto",
  nota: "Auto: Apariencia.estilo? con paleta cerrada de fill/borderColor, swatches + reset y persistencia JSON sin eco OPL.",
  requires: [
    { path: "app/src/modelo/estilos.ts", all: ["aplicarEstiloApariencia", "resetEstiloApariencia"] },
    { path: "app/src/ui/StyleControls.tsx", all: ["fill", "borderColor", "Reset"] },
    { path: "app/src/serializacion/json.ts", all: ["estilo"] },
  ],
  evidenciaExtra: ["app/src/modelo/estilos.test.ts"],
},
```

#### EPICA-30 (workspace local + dialogos)

```js
{
  ids: ["HU-30.001", "HU-30.005", "HU-30.006", "HU-30.009", "HU-30.010", "HU-30.013", "HU-30.015", "HU-30.018"],
  estado: "cubierto",
  confianza: "alta-auto",
  nota: "Auto: menu hamburguesa abre Guardar como / Cargar; primer Ctrl+S abre dialogo; guardado posterior reescribe id; importacion no autopersiste.",
  requires: [
    { path: "app/src/ui/MenuPrincipal.tsx", all: ["Guardar como", "Cargar modelo", "Nuevo modelo"] },
    { path: "app/src/ui/DialogoGuardarComo.tsx", all: ["nombre", "descripcion"] },
    { path: "app/src/ui/DialogoCargarModelo.tsx", all: ["Cargar"] },
    { path: "app/src/persistencia/workspace.ts", all: ["guardarComo", "indice"] },
  ],
},
```

#### EPICA-34 (modelo nuevo basico, ruta simple)

```js
{
  ids: ["HU-34.001", "HU-34.004", "HU-34.005", "HU-34.006", "HU-34.007", "HU-34.008"],
  estado: "cubierto",
  confianza: "alta-auto",
  nota: "Auto: Nuevo Modelo crea pestana con SD vacio, titulo (No guardado) y panel OPL/biblioteca vacios.",
  requires: [
    { path: "app/src/ui/MenuPrincipal.tsx", all: ["Nuevo modelo"] },
    { path: "app/src/store.ts", all: ["crearModeloNuevo", "opdRaizId"] },
    { path: "app/src/persistencia/workspace.ts", any: ["No guardado", "(No guardado)"] },
  ],
},
```

#### EPICA-1C (creacion interna por posicion)

```js
{
  ids: ["HU-1C.004"],
  estado: "cubierto",
  confianza: "alta-auto",
  nota: "Auto: click dentro del bbox de un contenedor refinado crea cosa hija sin advertencia interior/exterior.",
  requires: [
    { path: "app/src/modelo/creacionInterna.ts", all: ["esContenedorRefinado", "crearComoHija"] },
    { path: "app/src/render/jointjs/JointCanvas.tsx", any: ["creacionInterna", "bboxContenedor"] },
  ],
  evidenciaExtra: ["app/src/modelo/creacionInterna.test.ts"],
},
```

#### EPICA-20 (eliminacion segura de OPDs)

```js
{
  ids: ["HU-20.015", "HU-20.016"],
  estado: "cubierto",
  confianza: "alta-auto",
  nota: "Auto: bloqueo de raiz, mensaje accionable para internos, eliminacion controlada de hojas con limpieza de huerfanos y undo.",
  requires: [
    { path: "app/src/modelo/opdEliminacion.ts", all: ["eliminarOpdHoja", "diagnosticarEliminacionOpd"] },
    { path: "app/src/ui/ArbolOpd.tsx", any: ["Eliminar", "eliminarOpd"] },
    { path: "app/src/store.ts", any: ["eliminarOpdDesdeArbol", "eliminarOpd"] },
  ],
  evidenciaExtra: ["app/src/modelo/opdEliminacion.test.ts"],
},
```

#### EPICA-11 (bus agregacion + etiquetas enlace)

```js
{
  ids: ["HU-11.004", "HU-11.014"],
  estado: "cubierto",
  confianza: "alta-auto",
  nota: "Auto: bus de agregacion derivado en render con triangulo unico + ramas y etiquetas editables que aparecen como sufijo OPL.",
  requires: [
    { path: "app/src/render/jointjs/agregacionBus.ts", all: ["proyectarBusAgregacion"] },
    { path: "app/src/modelo/etiquetasEnlace.ts", any: ["fijarEtiquetaEnlace", "etiqueta"] },
    { path: "app/src/ui/InspectorEnlace.tsx", any: ["etiqueta"] },
    { path: "app/src/opl/generar.ts", any: [/\[etiqueta:/, "consta de"] },
  ],
},
```

> Las reglas anteriores son orientativas; ajustarlas a los identificadores **reales** que existan en `app/` al momento de implementar L1. Si un nombre de funcion difiere, usar el real, no el sugerido.

### Pruebas manuales del detector

Ejecutar:

```bash
cd /home/felix/projects/deep-opm-pro
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

Verificar en la salida de consola y en `docs/roadmap/hu-progress.md`:

- `rulesMatched` >= `rulesEvaluated - 1` (idealmente igual; tolerar 1 regla pendiente con justificacion explicita en el commit).
- Las 7 EPICAs senaladas muestran `Cubiertas` y `Avance` consistentes con la realidad de codigo.
- EPICA-50 ya no aparece en 3.6%.
- Ninguna EPICA previamente verde retrocede en avance: si retrocede, la regla cambio es defectuosa y debe corregirse.

### Registro de calibracion

Documentar en el cuerpo del commit (no en archivos nuevos):

- Cada regla agregada/modificada con su `ids`, archivos cubiertos y razon de cambio.
- Confirmacion de `rulesMatched/rulesEvaluated` antes y despues.
- Confirmacion de que `--sync-real` no toco entradas manuales del ledger.

## 7. Tests obligatorios

- No hay nuevos unit tests en `app/`.
- Verificacion manual del detector: ejecutar `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real` y leer la salida.
- Verificacion de coherencia: comparar `docs/roadmap/hu-progress.md` antes (`git stash` o `git show HEAD:`) y despues; el resumen por EPICA debe subir donde corresponde y no caer en otras.
- Re-ejecucion idempotente: correr `--sync-real` dos veces seguidas debe producir el mismo `hu-progress-evidence.json` y `hu-progress.json` (las regeneraciones consecutivas no introducen ruido). Verificar con `git diff` o `diff` entre dos copias.

## 8. Verificacion

```bash
cd /home/felix/projects/deep-opm-pro
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
git status docs/roadmap/
git diff --stat docs/roadmap/
```

Loop verde de `app/` no aplica a esta linea (no toca codigo de la app). Si el agente decide ejecutar `cd app && bun run check` por sanity, el resultado debe ser el mismo `283 unit tests / 1541 expects` del HANDOFF — cualquier cambio implica que tocaste codigo fuera de scope.

## 9. Decisiones bloqueadas (no reabrir)

- El esquema `deep-opm-pro.hu-progress-report.v1` no cambia.
- `autoEntries` es el unico bloque que `--sync-real` regenera; las `entries` manuales siguen siendo respaldo.
- Las reglas describen el codigo **actual**, no el aspirado por el HANDOFF ni por la ronda 6.
- Esta linea no genera nuevas HU, no edita epicas y no reescribe el HANDOFF.
- No se introduce dependencia nueva en el script (`fs`/`path`/`url` solamente).

## 10. Decisiones que tomas vos (documentar en commit)

- Si una regla actual (pre-ronda 5) sigue siendo valida pero apunta a paths obsoletos, refactorizarla in-place o crear una nueva en su lugar; preferir refactor si el `ids` se conserva.
- Si encontras evidencia de que una HU listada como cubierta en el HANDOFF no existe en codigo real, **no inventes la regla**: marcala como `pendiente` con `nota: "Auto: HANDOFF la lista como cubierta pero el codigo no la respalda"` y documenta el hallazgo en el commit (esto es input critico para Felix).
- Si encontras una HU cubierta cuyo HANDOFF no menciona, agregar la regla y dejar nota de "evidencia adicional encontrada".
- Si una EPICA sube de avance pero conviene declarar `parcial` en lugar de `cubierto` por brechas residuales, usar `estado: "parcial"` con `confianza: "alta-auto"` y describir las brechas en el campo `brechas` del entry.
- Patrones regex versus strings literales: preferir strings literales cuando sean exactos y unicos; usar regex solo para variaciones aceptables (ej. `/\[etiqueta:/`).

## 11. Forma del entregable

Commits sugeridos:

- `chore(ledger): calibra detector hu-progress para evidencia post-ronda 5`
- `chore(ledger): regenera hu-progress evidence con --sync-real`

Co-author footer estandar (`Co-Authored-By: ...`) si aplica al implementador. No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`. Reportar en el commit body o en el reporte final:

- Reglas modificadas y agregadas (con `ids`).
- `rulesMatched/rulesEvaluated` antes y despues.
- Lista de EPICAs cuyo avance subio, con porcentaje viejo -> nuevo.
- Cualquier discrepancia HANDOFF-vs-codigo encontrada (input para una proxima iteracion del HANDOFF, no para corregirla aqui).
- Confirmacion de que ningun archivo en `app/` ni en `docs/historias-usuario-v2/` fue tocado.
