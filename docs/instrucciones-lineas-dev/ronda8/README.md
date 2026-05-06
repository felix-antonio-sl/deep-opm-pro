# Ronda 8 — Refactor radical contrastado contra opm-extracted

**Fecha**: 2026-05-05
**Base**: `main` @ commit `ee10c9c` (`chore(ledger): regenera evidencia hu-progress post-ronda 7`) — HANDOFF vigente con rondas 1-7 consolidadas. El working tree puede contener archivos sueltos del operador (`scripts/in-vivo-test.mjs` y `ui/PersistenciaJson.tsx` en estado modified, además de cualquier WIP que haya en raíz). Esos archivos no son input de esta ronda; ni editar, ni mover, ni borrar.
**Objetivo**: 6 lineas paralelas de **refactor estructural** de los monolitos acumulados, con contraste profundo contra `opm-extracted/` para destilar patrones canonicos de OPCloud (separacion render/modelo/OPL/UI, slices por dominio, composers por familia, command pattern). NO se agregan features. NO se reabren contratos. La forma del repo es lo que escala.

## 1. Filosofia operativa (refactor)

- **Architecture-over-implementation**: invertimos en mover lineas de limite, no en pulir lo que ya existe. Si una linea termina con LOC reducido pero misma forma, fallo.
- **Refactor solo aditivo + reemplazo controlado**: cada linea entrega los modulos nuevos primero, luego adapta consumidores. Los archivos viejos se vacian a barrel re-exports temporales para que ninguna importacion existente rompa. No hay commit intermedio en rojo.
- **Reuso obligatorio del corpus interno**: cada linea cita evidencia concreta de `opm-extracted/` (path absoluto desde repo root + numero de linea) que respalda la particion. OPCloud ya recorrio este sendero — la separacion `ModelService / GraphService / OplService / TreeViewService / StorageService / ContextService` (cada servicio < 2000 LOC) es la prueba de que la app puede sostener el modelo OPM sin monolitos. Lo destilamos al stack Preact/Zustand/JointJS sin copiar 1:1 — el codigo se reescribe respetando idiomas y tipado fuerte propio.
- **Contrato observable antes que forma**: el barrel re-export preserva imports, pero no demuestra equivalencia. Cada linea debe declarar su contrato observable antes de mover codigo: exports publicos, consumidores, tests/goldens y salidas invariantes (JSON, OPL, `JointCellJson`, `data-testid`, acciones Zustand). El refactor es correcto solo si el diagrama "entrada vieja -> salida observable" conmuta despues de la particion.
- **Loop verde obligatorio**: cada linea cierra con `cd app && bun run check`; si toca UI/render: `bun run browser:smoke`; si toca proyeccion JointJS o serializacion: `bun run build`. Linea base post-ronda 7: 481 unit tests / 2206 expect, 40/40 smoke (44.3 s), bundle 1045 KB minificado / 295 KB gzip, detector 45/49 reglas.
- **Ship-beats-perfect**: si el refactor expone un bug que no es del scope, se entrega como patch a `/tmp/` y NO se commitea. Regla del operador para WIP cross-line.
- **APIs publicas documentadas**: cada modulo nuevo abre con un comentario JSDoc del modulo declarando su responsabilidad y sus consumidores conocidos.

## 2. Reglas duras comunes

1. **Scope estricto**: solo tocar archivos permitidos por el brief. Si aparece un cambio cross-line no previsto, detenerse y reportar (no resolver por invasion silenciosa).
2. **No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`** desde las lineas. El handoff unico se actualiza solo en consolidacion final. Tampoco tocar `docs/instrucciones-lineas-dev/ronda1..7/` (memoria historica), ni `docs/JOYAS.md`, ni la SSOT en `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/` (lectura).
3. **No tocar archivos sueltos del operador** en working tree raiz, ni `scripts/in-vivo-test.mjs` (modified) ni `app/src/render/jointjs/customShapes.ts` ni `home/`. Son WIP del operador, fuera de scope.
4. **No copiar codigo 1:1 desde `opm-extracted/`**. Se usa como evidencia semantica, UX y arquitectura; la implementacion en `app/` se reescribe con Preact/Zustand/JointJS OSS. Cada cita debe apuntar a path absoluto desde repo root con numero de linea.
5. **Citas explicitas**: cada decision arquitectural cita SSOT (`opm-iso-19450-es.md`, `opm-visual-es.md`, `opm-opl-es.md`, `metodologia-opm-es.md`) o documento interno (`opm-extracted/INDEX.md`, `opm-extracted/MODULES.md`, modulos `src/` con paths absolutos + lineas).
6. **APIs publicas estables**: no renombrar funciones exportadas existentes. Si una funcion nueva reemplaza una vieja, se entrega adaptador con misma firma temporalmente y declarar el call site count en commit. No romper consumidores en commits intermedios.
7. **Contrato observable por linea**: antes de editar, capturar consumidores y salidas observables del archivo publico. Despues de editar, demostrar equivalencia con tests existentes intactos, tests aditivos y checks especificos de cada brief. Comentarios o strings agregados solo para satisfacer regex del detector NO cuentan como evidencia si no estan acompanados por regla tolerante o test/golden real.
8. **JSON lossless**: roundtrip permanece intacto. La particion de `serializacion/json.ts` no debe alterar el formato emitido ni el formato aceptado. Tests de `serializacion/json.test.ts` deben pasar sin tocar (la unica excepcion es agregar tests nuevos que cubran la particion). Cualquier commit que falle un test de roundtrip se rebasea.
9. **Idiomas**: documentacion y mensajes de usuario en es-CL; identificadores siguen el estilo existente del repo (camelCase TS, kebab-case data-testid, helpers de operacion en es-CL).
10. **Tests por capa**: cada slice/modulo nuevo trae sus tests al lado (mismo nombre + `.test.ts`). Los tests viejos de `store.test.ts`, `proyeccion.test.ts`, `generar.test.ts`, `serializacion/json.test.ts` siguen vivos sin reescribir; las lineas pueden agregar tests aditivos en archivos nuevos pero no quitar coverage existente.
11. **No introducir backend, Firebase, auth, Rappid, jspdf, pdf-lib, papaparse ni dependencias nuevas** en esta ronda. La unica capa nueva permitida es `vite.config` con `build.rollupOptions.output.manualChunks` (L6) — eso es config, no dep nueva.
12. **Commits de linea**: mensajes imperativos con `refactor(...)` (predominante), `feat(...)` solo si el refactor abre superficie nueva (poco probable), `test(...)`, `chore(...)`. Co-author footer si aplica al implementador externo. Cada linea reporta hashes y comandos al cerrar.
13. **No reabrir contratos de rondas 1-7**: `docs/HANDOFF.md §Decisiones Vigentes` es contrato. Multi-seleccion canonica, modo barra creacion sticky, mapa = vista derivada extendida, multi-pestana sesion-only, bloques OPL jerarquicos, workspace single-user, designaciones de estado, alias/unidad/descripcion/URLs, duracion canonica, plegado parcial persistido, atajos centralizados, divisor arbol/canvas, dialogos custom con captura — ninguno se reabre. Si la linea necesita matizarlos, lo declara como decision documentada en commit; no los rompe.
14. **EPICA-70 (OPCAT) y EPICA-91 (tutorial) descartadas del proyecto** desde 2026-05-05. No incluir en ningun brief, ni proponer reactivar.

## 3. Stack y comandos del repo

- Bun 1.3+, TypeScript strict, Preact 10 + Signals, Zustand 5, JointJS 3.7 core, Vite 6, Playwright.
- Working directory: `/home/felix/projects/deep-opm-pro`; app en `app/`.

```bash
cd app
bun run check          # typecheck + unit tests
bun run browser:smoke  # Playwright Chromium para UI/render
bun run build          # build Vite; warning de chunk JointJS esperado (objetivo ronda 8: chunk separado)
bun run dev            # localhost:5173
```

Auditoria HU al cierre de consolidacion:

```bash
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

## 4. Diagnostico estructural (que se rompe)

Crecimiento desde post-ronda 6 a post-ronda 7 (bandera roja):

| Archivo | Pre-r7 | Post-r7 | Crecimiento | Diagnostico |
|---|---:|---:|---:|---|
| `app/src/store.ts` | 2554 | **4006** | +57% | Slice unico monolitico; 18 reglas del detector apuntan aca; cada feature cuelga campos al final sin agrupar. |
| `app/src/render/jointjs/proyeccion.ts` | 1116 | **1382** | +24% | 62 funciones libres mezclando entidad/estados/plegado/enlace/halo/markers. |
| `app/src/opl/generar.ts` | 988 | **1031** | +4% | 16 reglas del detector; oraciones mezclan estructural/procedural/designaciones/plegado/duracion. |
| `app/src/ui/PanelCarpetas.tsx` | 609 | **829** | +36% | Un solo componente con drag-drop + cut/paste + glifos + menu contextual + breadcrumb. |
| `app/src/ui/ArbolOpd.tsx` | 539 | **698** | +30% | Un componente con render + Ctrl+arrows + toggle nombres + handlers menu contextual. |
| `app/src/ui/InspectorEntidad.tsx` | 522 | **665** | +27% | 5 sub-componentes inline; secciones descripcion/alias/unidad/URLs/layout/designaciones/duracion sin separar. |
| `app/src/ui/InspectorEnlace.tsx` | — | **715** | (nuevo dominio) | Multiplicidad + estilo + extremos + reanclaje + ruta + abanico + estilo color en un solo componente. |
| `app/src/ui/PanelOpl.tsx` | 435 | **515** | +18% | Render token + chevrons + bloques jerarquicos sin separar. |
| `app/src/render/jointjs/JointCanvas.tsx` | — | **697** | (nuevo dominio) | Handlers seleccion + zoom + pan + rubber band + Esc + Delete + flechas + drag halos en un solo TSX. |
| `app/src/serializacion/json.ts` | — | **877** | (sospechoso) | 30+ helpers de validacion sin separar por dominio (entidades / estados / opds / apariencias / enlaces). |
| `app/src/modelo/operaciones.ts` | 1743 | 1743 | 0% (congelado) | 32 exports en 6 dominios disjuntos; congelado por doctrina (riesgo desproporcionado). |

Bundle: 1045 KB minificado / 295 KB gzip; Vite advierte por chunk grande. JointJS importado side-effect global en `main.tsx` y named en JointCanvas.tsx — todo en chunk principal.

Detector ledger: cae a 45/49 reglas (vs 47/49 pre-ronda 7). Las reglas asumen monolitos como `store.ts`, `proyeccion.ts`, `generar.ts`. Si partimos sin recalibrar, el detector cae mas. Por eso la **regla de oro de esta ronda**:

> **Patron `barrel re-export`**: `store.ts`, `serializacion/json.ts`, `opl/generar.ts`, `render/jointjs/proyeccion.ts` se mantienen como ARCHIVO PUBLICO TOP-LEVEL despues del refactor. Su contenido nuevo es: importar de los slices y re-exportar. Las APIs publicas no cambian. Esto preserva superficie de importacion y compatibilidad inicial con las 49 reglas existentes del detector, pero NO es prueba semantica. Las reglas que apuntan a archivos nuevos (slices) se agregan ADITIVAMENTE en L6 y cada linea debe respaldar su equivalencia con tests/goldens reales.

Inspirado en `opm-extracted/src/app/models/OpmModel.ts:6-7` donde `class OpmModel extends BasicOpmModel { ... }` — la subclase agrega capacidades pero la superclase mantiene la firma. Aqui el agregador `store.ts` "extiende" hereditariamente la union de slices.

## 5. Contraste opm-extracted ↔ deep-opm-pro

OPCloud opera con ~349 archivos / ~165k LOC y ningun monolito mayor a `shared.ts:6261` (megamodulo Rappid + utilidades, irreproducible — su existencia justifica precisamente que no queremos ir alli). Sus servicios estado-clave (analogo a nuestro store) son:

| OPCloud | Path | LOC | Responsabilidad | Analogo deep-opm-pro |
|---|---|---:|---|---|
| `ModelService` | `opm-extracted/src/app/modules/app/model.service.ts` | 190 | Modelo activo + render + OPL roundtrip | parte de `store.ts` |
| `ContextService` | `opm-extracted/src/app/modules/app/context.service.ts` | 1037 | Tabs + save + permissions + sync | parte de `store.ts` (workspace + pestanas) |
| `GraphService` | `opm-extracted/src/app/rappid-components/services/graph.service.ts` | 1943 | Render JointJS solo | parte de `proyeccion.ts` + `JointCanvas.tsx` |
| `OplService` (referenciado, en `aliasing-module.ts:23`) | en `rappid-components/services/...` | — | Settings OPL + render OPL | parte de `opl/generar.ts` + `PanelOpl.tsx` |
| `TreeViewService` | (referenciado en `opdsTreeActions.ts:73-77`) | — | Tree-view OPD jerarquico | parte de `ArbolOpd.tsx` |
| `StorageService` | `opm-extracted/src/app/rappid-components/services/storage.service.ts` | 406 | Persistencia local/remote | parte de `persistencia/local.ts` + `workspace.ts` |
| `JsonModel` | `opm-extracted/src/app/models/json.model.ts` | 611 | toJson + fromJson + validacion | `serializacion/json.ts` |
| `TabsManager` | `opm-extracted/src/app/modules/app/tabsService.ts` | 130 | UI orquestador de pestanas | `store/pestanas.ts` (ya existe) |

Patrones canonicos destilables (sin copiar 1:1):

1. **Slices por dominio con dependencias declaradas via constructor** (Angular DI). Lo destilamos como **slices de Zustand con tipos disjuntos por dominio** y composicion via `createStore<UnionDeSlices>`. Cada slice es una funcion `(set, get, api) => ({...estado, ...acciones})`.
2. **Command/Action pattern** para todo cambio del modelo (`opm-extracted/src/app/models/components/commands/edit-alias.ts:5-30`, `object-decider.ts:5-127`). Cada comando es una clase con `act()` + `canBePerformed()`. Lo destilamos como **funciones puras `Resultado<Modelo>` (ya tenemos)** mas un decider por tipo (object/process/state/link) que filtra cuales se ofrecen segun contexto. NO migramos el ya existente `operaciones.ts` (congelado); el decider va en la capa UI (Inspector / menu contextual).
3. **JointJS shapes y plugins** registrados en un solo modulo de inicializacion (`opm-extracted/src/app/configuration/elementsFunctionality/draw.view.ts`). En nuestro caso, importacion JointJS se aisla en `JointCanvas.tsx` y se mueve a chunk separado via Vite `manualChunks` (L6).
4. **Composers de render por familia** (objects, processes, states, links). En OPCloud cada uno tiene su archivo en `models/DrawnPart/` (`OpmObject.ts:5468`, `OpmProcess.ts:2402`, `OpmEntity.ts:1736`, `Links/AggregationLink.ts:33`, `Links/EffectLink.ts:117`, `Links/InvocationLink.ts:211`). Lo destilamos partiendo `proyeccion.ts` en composers por familia (L2): entidad / estados / plegado / enlace / refinamiento estructural / halos.
5. **OPL como lente derivada por modulo de tipo logico** (`opm-extracted/src/app/models/LogicalPart/components/aliasing-module.ts:5-32`, `units-text-module.ts:5-32`). Patron: cada modulo logico aporta su `getText()`. Lo destilamos partiendo `opl/generar.ts` en generadores por familia (L4): estructural / procedural / designaciones / refinamiento / duracion / abanico / plegado.
6. **JsonModel concentra serializacion** (`opm-extracted/src/app/models/json.model.ts:6-611`). Aunque OPCloud lo tiene como clase de 611 LOC, internamente tiene `toJson()` + `fromJson()` + helpers separados por tipo. Lo destilamos en `serializacion/json.ts` como barrel + slices por dominio (L3): `entidad`, `estado`, `apariencia`, `enlace`, `opd`.
7. **Inspector como hub de comandos por tipo** (`opm-extracted/src/app/models/components/commands/object-decider.ts:5-88`). Cada tipo tiene su decider que devuelve la lista de comandos aplicables. En nuestro UI, `InspectorEntidad.tsx` y `InspectorEnlace.tsx` se parten por seccion (L5): metadata / esencia-afiliacion / estados / designaciones / duracion / URLs / refinamiento / multiplicidad / estilo / vertices / reanclaje.
8. **Code splitting por chunk** (OPCloud tiene 16 chunks decompilados, ver `opm-extracted/REFACTOR-NOTES.md:23-28`). Lo destilamos en Vite (L6): JointJS en chunk separado, modulos pesados (mapa, asistente nuevo modelo) en chunks lazy.

Patrones que NO se transfieren:

- **Angular DI con `@Injectable`** y constructor injection. Reemplazamos por composicion explicita en `createStore<...>()` y prop drilling minimo (Preact context para cosas globales como `seleccionados`).
- **RxJS `BehaviorSubject` + Observables** (`model.service.ts:16-18`). Reemplazamos por Zustand selectors (`useOpmStore<T>(selector)`) que ya existe.
- **MongoDB / Firestore / GAE backend**. Sigue siendo single-user MVP con persistencia local.
- **Rappid commercial (joint-plus)**: halo, paper-scroller, snap-line. Reemplazamos por nuestro `JointCanvas.tsx` con eventos JointJS OSS + helpers propios.
- **Megamodulos (`shared.ts:6261`, `OpmObject.ts:5468`)**: lo evitamos; nuestros monolitos son una via mucho mas modesta hacia ese fallo.

## 6. Vision general de las 6 lineas

| ID | Titulo | Deuda que cierra | Modulo nuevo creado | Tamano | Riesgo |
|---|---|---|---|---|---|
| **L1** | Slices del store (`store.ts` 4006→<1500) | 1 monolito Zustand sin secciones | `store/{seleccion,enlaces,workspace,carpetas,uiPanel,mapa,modelo}.ts` | XL | alto |
| **L2** | Composers de render (`proyeccion.ts` 1382→<600) | 62 funciones libres en proyeccion | `render/jointjs/composers/{entidad,estados,plegado,enlace,halos,markers}.ts` | L | medio |
| **L3** | Validadores de serializacion por dominio (`serializacion/json.ts` 877→<400) | 30+ helpers mezclados | `serializacion/{validarEntidades,validarEstados,validarOpds,validarApariencias,validarEnlaces,helpers}.ts` | M | bajo |
| **L4** | Generadores OPL por familia (`opl/generar.ts` 1031→<500) | Oraciones mezcladas en un solo archivo | `opl/generadores/{estructural,procedural,designaciones,refinamiento,duracion,abanico,plegado}.ts` | M | medio |
| **L5** | UI grandes a sub-componentes (PanelCarpetas + ArbolOpd + InspectorEntidad + InspectorEnlace + PanelOpl) | 4 componentes >500 LOC con responsabilidades mezcladas | `ui/inspector/`, `ui/arbol/`, `ui/panelCarpetas/`, `ui/panelOpl/` | XL | medio |
| **L6** | Code-splitting + recalibrar detector + cleanup deuda | Bundle 1045KB; detector 45/49 | `vite.config` extendido + recalibracion ledger + reglas detector nuevas | M | bajo |

Quedan fuera de ronda 8:
- **`modelo/operaciones.ts`** (1743 LOC): congelado por doctrina; tests pesados (`operaciones.test.ts:1185 LOC`); el riesgo de tocarlo es desproporcionado al beneficio. Si una linea futura lo aborda, debe ser con worktree dedicado y tests verde antes y despues.
- **`render/jointjs/JointCanvas.tsx`** (697 LOC): el blast en handlers de eventos JointJS es alto; partir aqui requiere haber estabilizado primero los composers del L2 y los slices del L1. Se difiere a ronda 9 si los smokes lo confirman.
- **`ui/AsistenteNuevoModelo.tsx`** (~785 LOC estimadas): asistente 12 etapas; refactor cabe pero suma blast a una ronda ya saturada. Diferido.
- **Refactor de `tipos.ts`** a tipos disjuntos: no rompe nada pero cambiaria firmas; diferido para no chocar con L1 y L3.
- **EPICA-70 (OPCAT)** y **EPICA-91 (tutorial)**: descartadas del proyecto.
- Cualquier feature nueva: esto es ronda de refactor.

## 7. Mapa de archivos por linea

Convencion: `aditivo` = solo agregar imports/re-exports; `nuevo` = archivo creado por esa linea; `lectura` = puede leerse pero no editarse; `barrel` = el archivo se reduce a re-exports de los slices nuevos; vacio = sin contacto.

| Archivo | L1 | L2 | L3 | L4 | L5 | L6 |
|---|---|---|---|---|---|---|
| `app/src/store.ts` | **barrel** (4006→<200 re-export) | aditivo (selector cache) | lectura | lectura | aditivo (acciones nuevas si UI lo demanda) | lectura |
| `app/src/store/tipos.ts` | **nuevo** (union publica `OpmStore` + tipos store-locales) | — | — | — | — | — |
| `app/src/store/runtime.ts` | **nuevo** (singletons undo/redo/dirty/autosalvado) | — | — | — | — | — |
| `app/src/store/seleccion.ts` | **nuevo** | — | — | — | — | — |
| `app/src/store/enlaces.ts` | **nuevo** | — | — | — | — | — |
| `app/src/store/workspaceMod.ts` | **nuevo** | — | — | — | — | — |
| `app/src/store/carpetas.ts` | **nuevo** | — | — | — | — | — |
| `app/src/store/uiPanel.ts` | **nuevo** | — | — | — | — | — |
| `app/src/store/mapa.ts` | **nuevo** | — | — | — | — | — |
| `app/src/store/modelo.ts` | **nuevo** (modeloActivo + commit/undo/redo) | — | — | — | — | — |
| `app/src/store/persistencia.ts` | **nuevo** | — | — | — | — | — |
| `app/src/store/pestanas.ts` | aditivo (ya existe; solo reorganiza imports) | — | — | — | — | — |
| `app/src/store.test.ts` | aditivo (preservar; sumar tests por slice nuevo) | — | — | — | — | — |
| `app/src/render/jointjs/proyeccion.ts` | lectura | **barrel** (1382→<200 re-export) | lectura | lectura | lectura | lectura |
| `app/src/render/jointjs/proyeccionTipos.ts` | — | nuevo opcional (solo si separar tipos publicos evita ciclos) | — | — | — | — |
| `app/src/render/jointjs/composers/entidad.ts` | — | **nuevo** | — | — | — | — |
| `app/src/render/jointjs/composers/estados.ts` | — | **nuevo** | — | — | — | — |
| `app/src/render/jointjs/composers/plegado.ts` | — | **nuevo** | — | — | — | — |
| `app/src/render/jointjs/composers/enlace.ts` | — | **nuevo** | — | — | — | — |
| `app/src/render/jointjs/composers/halos.ts` | — | **nuevo** | — | — | — | — |
| `app/src/render/jointjs/composers/markers.ts` | — | **nuevo** | — | — | — | — |
| `app/src/render/jointjs/composers/colores.ts` | — | **nuevo** | — | — | — | — |
| `app/src/render/jointjs/proyeccion.test.ts` | — | aditivo (preservar) | — | — | — | — |
| `app/src/serializacion/json.ts` | lectura | lectura | **barrel** (877→<200 re-export) | lectura | lectura | lectura |
| `app/src/serializacion/validarEntidades.ts` | — | — | **nuevo** | — | — | — |
| `app/src/serializacion/validarEstados.ts` | — | — | **nuevo** | — | — | — |
| `app/src/serializacion/validarOpds.ts` | — | — | **nuevo** | — | — | — |
| `app/src/serializacion/validarApariencias.ts` | — | — | **nuevo** | — | — | — |
| `app/src/serializacion/validarEnlaces.ts` | — | — | **nuevo** | — | — | — |
| `app/src/serializacion/validarHelpers.ts` | — | — | **nuevo** (esRecord, esEsencia, ok, fallo, etc.) | — | — | — |
| `app/src/serializacion/validarGuards.ts` | — | — | nuevo opcional (si `validarHelpers.ts` crece) | — | — | — |
| `app/src/serializacion/validarNormalizacion.ts` | — | — | nuevo opcional (si `validarHelpers.ts` crece) | — | — | — |
| `app/src/serializacion/validarIntegridad.ts` | — | — | nuevo opcional (checks cross-domain) | — | — | — |
| `app/src/serializacion/json.test.ts` | — | — | aditivo (preservar) | — | — | — |
| `app/src/opl/generar.ts` | lectura | lectura | lectura | **barrel** (1031→<200 re-export) | lectura | lectura |
| `app/src/opl/generadores/estructural.ts` | — | — | — | **nuevo** | — | — |
| `app/src/opl/generadores/procedural.ts` | — | — | — | **nuevo** | — | — |
| `app/src/opl/generadores/designaciones.ts` | — | — | — | **nuevo** | — | — |
| `app/src/opl/generadores/refinamiento.ts` | — | — | — | **nuevo** | — | — |
| `app/src/opl/generadores/duracionMetadata.ts` | — | — | — | **nuevo** | — | — |
| `app/src/opl/generadores/abanico.ts` | — | — | — | **nuevo** | — | — |
| `app/src/opl/generadores/plegado.ts` | — | — | — | **nuevo** | — | — |
| `app/src/opl/generadores/refsHints.ts` | — | — | — | **nuevo** (refs y hints compartidos) | — | — |
| `app/src/opl/generar.test.ts` | — | — | — | aditivo (preservar) | — | — |
| `app/src/ui/PanelCarpetas.tsx` | — | — | — | — | **barrel** (829→<150) | — |
| `app/src/ui/panelCarpetas/Tile.tsx` | — | — | — | — | **nuevo** | — |
| `app/src/ui/panelCarpetas/MenuContextual.tsx` | — | — | — | — | **nuevo** | — |
| `app/src/ui/panelCarpetas/Breadcrumb.tsx` | — | — | — | — | **nuevo** | — |
| `app/src/ui/panelCarpetas/handlersDragDrop.ts` | — | — | — | — | **nuevo** | — |
| `app/src/ui/ArbolOpd.tsx` | — | — | — | — | **barrel** (698→<150) | — |
| `app/src/ui/arbol/NodoOpd.tsx` | — | — | — | — | **nuevo** | — |
| `app/src/ui/arbol/handlersTeclado.ts` | — | — | — | — | **nuevo** | — |
| `app/src/ui/arbol/togglesArbol.ts` | — | — | — | — | **nuevo** | — |
| `app/src/ui/InspectorEntidad.tsx` | — | — | — | — | **barrel** (665→<150) | — |
| `app/src/ui/inspector/SeccionDescripcion.tsx` | — | — | — | — | **nuevo** | — |
| `app/src/ui/inspector/SeccionAlias.tsx` | — | — | — | — | **nuevo** | — |
| `app/src/ui/inspector/SeccionUrls.tsx` | — | — | — | — | **nuevo** | — |
| `app/src/ui/inspector/SeccionLayoutEstados.tsx` | — | — | — | — | **nuevo** | — |
| `app/src/ui/inspector/SeccionDesignaciones.tsx` | — | — | — | — | **nuevo** | — |
| `app/src/ui/inspector/SeccionDuracion.tsx` | — | — | — | — | **nuevo** | — |
| `app/src/ui/inspector/SeccionEsenciaAfiliacion.tsx` | — | — | — | — | **nuevo** | — |
| `app/src/ui/inspector/SeccionRefinamiento.tsx` | — | — | — | — | **nuevo** | — |
| `app/src/ui/InspectorEnlace.tsx` | — | — | — | — | **barrel** (715→<150) | — |
| `app/src/ui/inspectorEnlace/SeccionMultiplicidad.tsx` | — | — | — | — | **nuevo** | — |
| `app/src/ui/inspectorEnlace/SeccionEstiloEnlace.tsx` | — | — | — | — | **nuevo** | — |
| `app/src/ui/inspectorEnlace/SeccionExtremos.tsx` | — | — | — | — | **nuevo** | — |
| `app/src/ui/inspectorEnlace/SeccionRuta.tsx` | — | — | — | — | **nuevo** | — |
| `app/src/ui/inspectorEnlace/SeccionAbanico.tsx` | — | — | — | — | **nuevo** | — |
| `app/src/ui/inspectorEnlace/SeccionReanclaje.tsx` | — | — | — | — | **nuevo** | — |
| `app/src/ui/PanelOpl.tsx` | — | — | — | — | **barrel** (515→<150) | — |
| `app/src/ui/panelOpl/RenderToken.tsx` | — | — | — | — | **nuevo** | — |
| `app/src/ui/panelOpl/Bloques.tsx` | — | — | — | — | **nuevo** | — |
| `app/vite.config.ts` | — | — | — | — | — | EDIT (manualChunks + lazy) |
| `app/src/main.tsx` | — | — | — | — | — | aditivo (importar dynamicamente paneles modales pesados si aplica) |
| `app/src/ui/App.tsx` | — | — | — | — | — | aditivo (lazy() para `MapaSistema`, `AsistenteNuevoModelo`, modales) |
| `docs/historias-usuario-v2/tools/progress-dashboard.mjs` | — | — | — | — | — | EDIT (recalibrar reglas para slices nuevos) |
| `docs/roadmap/hu-progress-evidence.json` | — | — | — | — | — | regenera (lo hace `--sync-real`) |
| `app/e2e/opm-smoke.spec.ts` | — | — | — | — | aditivo (smoke por componente nuevo si la UI lo requiere) | — |
| `opm-extracted/**` | LECTURA | LECTURA | LECTURA | LECTURA | LECTURA | LECTURA |
| `assets/svg/**` | LECTURA | LECTURA | LECTURA | LECTURA | LECTURA | LECTURA |
| `docs/HANDOFF.md` | — | — | — | — | — | — |
| `docs/historias-usuario-v2/**` | — | — | — | — | — | — |

Reglas de colision:

- **`store.ts`** es el archivo super-compartido (4006 LOC). Solo L1 lo toca, y lo reduce a barrel. Las demas lineas siguen importando desde `store.ts` (las APIs publicas no cambian).
- **`tipos.ts` global** sigue siendo lectura para las 6 lineas. La excepcion autorizada es `app/src/store/tipos.ts` de L1, que NO reemplaza `app/src/tipos.ts`: solo aloja `OpmStore` y tipos auxiliares del store para evitar ciclos entre slices. Si otra linea necesita un tipo nuevo, lo declara local al modulo nuevo. Solo si el tipo es realmente publico cross-modulo, se discute en consolidacion (no en linea).
- **`proyeccion.ts`** lo toca solo L2 (barrel). Otros consumidores (`completitud.test.ts`, `JointCanvas.tsx`) siguen importando de `proyeccion.ts` sin cambios.
- **`opl/generar.ts`** lo toca solo L4 (barrel). `PanelOpl.tsx` (territorio L5) consume `generarOpl` y `generarOplInteractivo` desde `opl/generar.ts` sin enterarse de la particion.
- **`serializacion/json.ts`** lo toca solo L3 (barrel). `persistencia/local.ts`, `workspace.ts`, `versiones.ts` consumen `exportarModelo`, `hidratarModelo`, `carpetaIdDeJson` sin cambios.
- **UI grandes** son territorio exclusivo de L5 (4 archivos a sub-componentes). Las demas lineas no tocan UI.
- **Vite/build** es territorio L6. Ninguna otra linea cambia `vite.config.ts`, `package.json`, `main.tsx`. Si una linea descubre que su modulo nuevo necesita lazy import, lo deja como deuda y reporta al operador.
- **Detector ledger** es territorio L6. L6 declara reglas tolerantes a paths variables (`any` / multiples evidencias) y puede crear scaffolding de reglas al inicio. La regeneracion final de `--sync-real` que pretende medir >=50/55 se reserva para consolidacion, despues de L1-L5.
- **`opm-extracted/`** es lectura universal; ninguna linea modifica nada ahi.
- **`docs/HANDOFF.md`** y `docs/historias-usuario-v2/` son intocables.

## 8. Protocolo de conciliacion (orden de merge)

Orden sugerido: **L6a → L3 → L2 → L4 → L5 → L1 → L6b/consolidacion**.

Rationale:

1. **L6 primero** (bajo blast, dividido en L6a/L6b): L6a aterriza code splitting de Vite + scaffolding declarativo del detector con reglas tolerantes a paths nuevos. L6b es la regeneracion/medicion final del detector en consolidacion, cuando L1-L5 ya existan. Esto evita medir una ronda incompleta como si fuera cobertura real. NO refactoriza ningun monolito.
2. **L3 segundo** (bajo blast): partir `serializacion/json.ts`. Es el monolito mas autocontenido (no toca UI, no toca render, no toca store). Aterrizar segundo valida que el patron barrel + slices funciona en la ruta mas simple. Si L3 falla aqui, las demas se detienen.
3. **L2 tercero** (medio blast): partir `proyeccion.ts`. JointCanvas y proyeccion.test siguen consumiendo `proyectarModeloAJointCells` desde `proyeccion.ts` (barrel). Aterriza antes de L4 porque estabiliza el contrato visual y los tipos publicos de `JointCellJson`, pero L4 NO puede importar render/proyeccion.
4. **L4 cuarto** (medio blast): partir `opl/generar.ts`. Aterriza antes de L5 porque `PanelOpl.tsx` (territorio L5) consume `generarOplInteractivo`. Si un helper parece compartido con render, se duplica como formateador OPL puro o se reporta; nunca se importa desde `render/` ni `proyeccion.ts`.
5. **L5 quinto** (medio blast): UI grandes a sub-componentes. Aterriza antes de L1 porque los componentes nuevos del Inspector consumen acciones del store; si L1 ya hubiera fragmentado el store, L5 tendria que coordinar imports nuevos. En este orden, L5 importa de `store.ts` (barrel intacto) sin enterarse de la particion futura.
6. **L1 ultimo** (alto blast): partir `store.ts`. Aterriza al final porque toca el archivo con mas reglas del detector (18) y mas consumidores. Reservar al final permite que L2-L5 hayan validado que el patron barrel funciona en sus dominios. L1 es el cierre estructural de la ronda.

Despues de cada merge: `cd app && bun run check`; si toco UI/render: `bun run browser:smoke`; al cierre de ronda: `bun run build` y auditoria HU con `--sync-real`. **Reservar el ultimo commit del ciclo para una capa explicita de cascadas resueltas** (rondas 6 y 7 demostraron que esa capa es ineludible: ajustes de imports, fixes de tests que esperaban paths viejos, ajustes de tipos compartidos).

Chequeo de contrato por merge:

- Export surface: verificar consumidores via `grep`/`rg` para cada barrel tocado y mantener cada export publico previo, incluyendo tipos publicos.
- Behavioral surface: la misma entrada debe producir el mismo JSON serializado, mismas lineas OPL, mismo orden/id/type/metadata `opm` en `JointCellJson`, mismos `data-testid` y mismas acciones Zustand observables.
- Detector surface: si se preserva un string por compatibilidad, debe estar conectado a una regla tolerante o test/golden; no se aceptan comentarios sin evidencia real como sustituto de implementacion.

## 9. Anclaje obligatorio a SSOT y opm-extracted

Antes de codificar cada linea, leer:

- SSOT en `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`:
  - `opm-iso-19450-es.md`: glosario y axiomas. Mas relevante para L4 (OPL) y L3 (validaciones de modelo).
  - `opm-visual-es.md`: V-1 a V-240. Mas relevante para L2 (composers de render).
  - `opm-opl-es.md`: D5-D8, T1-T3, TS1-TS3. Mas relevante para L4 (generadores OPL).
- Evidencia OPCloud en `opm-extracted/`:
  - `INDEX.md`, `MODULES.md`, `README.md`, `REFACTOR-NOTES.md`, `assets/INDEX.md`.
  - Modulos puntuales citados en cada brief con paths absolutos desde repo root + lineas.
- HANDOFF y briefs de rondas 1-7 (leer `docs/HANDOFF.md §Decisiones Vigentes` y `§Cascadas Gestionadas`).

Si SSOT y OPCloud difieren, manda SSOT. OPCloud operacionaliza; no redefine semantica.

## 10. Brief por linea

| Linea | Brief |
|---|---|
| L1 | [linea-1-store-slices.md](./linea-1-store-slices.md) |
| L2 | [linea-2-render-composers.md](./linea-2-render-composers.md) |
| L3 | [linea-3-serializacion-validadores.md](./linea-3-serializacion-validadores.md) |
| L4 | [linea-4-opl-generadores.md](./linea-4-opl-generadores.md) |
| L5 | [linea-5-ui-subcomponentes.md](./linea-5-ui-subcomponentes.md) |
| L6 | [linea-6-build-detector.md](./linea-6-build-detector.md) |

Prompt para asignar lineas: [prompt-asignacion.md](./prompt-asignacion.md).

## 11. Verificacion al cierre de la ronda

```bash
cd app
bun run check
bun run browser:smoke
bun run build
cd ..
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

Metricas esperadas post-ronda 8 (sobre base post-ronda 7: 481 unit / 2206 expect, 40/40 smoke, bundle 1045 KB / 295 KB gzip, detector 45/49 reglas):

- **`store.ts` < 1500 LOC** (objetivo agresivo: <500 LOC en barrel; LOC reales viven en `store/*.ts` slices). Reduccion >= 60% del actual 4006 LOC.
- **`render/jointjs/proyeccion.ts` < 600 LOC** (objetivo agresivo: <200 LOC en barrel). Reduccion >= 55% del actual 1382 LOC.
- **`opl/generar.ts` < 500 LOC** (objetivo agresivo: <200 LOC en barrel). Reduccion >= 50% del actual 1031 LOC.
- **`serializacion/json.ts` < 400 LOC** (objetivo agresivo: <200 LOC en barrel). Reduccion >= 55% del actual 877 LOC.
- **UI grandes**: `PanelCarpetas.tsx` < 350, `ArbolOpd.tsx` < 300, `InspectorEntidad.tsx` < 300, `InspectorEnlace.tsx` < 300, `PanelOpl.tsx` < 200. Cada uno con sub-componentes < 200 LOC.
- **Bundle**: chunk principal sin JointJS; objetivo `< 600 KB minificado / < 240 KB gzip` para chunk principal + chunk JointJS separado (`< 500 KB / 200 KB gzip` esperado). Total razonable: similar al actual o menor en gzip.
- **Detector ledger >= 50/55 reglas post-consolidacion** (vs 45/49 actual). L6a puede cerrar por debajo de ese numero si las reglas nuevas esperan archivos de L1-L5; L6b/consolidacion ejecuta el `--sync-real` final. El delta viene de L6 con reglas tolerantes para archivos actuales y slice paths nuevos (`store/seleccion.ts`, `serializacion/*`, `render/jointjs/composers/*`, `opl/generadores/*`, `ui/inspector/*`).
- **Unit tests >= 481 verdes** (sin regresion). **Tests nuevos esperados: ~30-50** distribuidos entre los slices/composers nuevos. Total razonable >= 510.
- **Smoke browser >= 40 verdes** (sin regresion). Idealmente +1-2 smokes nuevos en L5 si la particion UI altera selectores.
- **0 reglas de detector caidas vs estado actual** (L6 garantiza preservacion de las 45 actuales + agrega).
- **APIs publicas sin cambios**: cada barrel re-exporta exactamente las firmas publicas previas. Tests existentes no se reescriben.
- **Contratos observables sin cambios**: JSON y OPL son caracter-por-caracter equivalentes donde los tests existentes lo fijan; `JointCellJson` mantiene orden/id/type/selectores/metadata `opm`; UI mantiene `data-testid`, foco y propagacion de eventos.
- **`docs/HANDOFF.md` permanece intacto** durante las lineas; se actualiza solo en consolidacion final con la nueva forma del repo.

Si una metrica no se cumple, la linea correspondiente lo declara explicito en el reporte y propone meta realista con rationale.
