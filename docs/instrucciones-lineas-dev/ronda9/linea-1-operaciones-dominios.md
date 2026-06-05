# Línea 1 — Operaciones por dominio

## 1. Misión

Romper el monolito `app/src/modelo/operaciones.ts` (**1743 LOC**) en sub-archivos por dominio canónico, conservando la API pública exacta (firmas, nombres exportados, tipos de retorno) vía barrel re-export. La forma OPCloud para este problema es **un comando por archivo** o **comandos por dominio del modelo** (`opm-extracted/src/app/models/components/commands/edit-alias.ts:5-30`, `object-decider.ts:5-127`); destilamos ese patrón a TypeScript con funciones puras `(modelo, ...args) => Resultado<Modelo>` agrupadas en archivos por dominio. La fuente única de verdad sobre el contrato es `operaciones.test.ts` (1185 LOC, intacto).

Cierre arquitectural: `operaciones.ts` queda como **barrel agregador** (objetivo: < 200 LOC; tope absoluto: < 350 LOC); todo el código nuevo vive en `app/src/modelo/operaciones/<dominio>.ts`. Las reglas del detector que apuntan a `operaciones.ts` siguen matcheando porque el barrel re-exporta las mismas firmas; nuevas reglas tolerantes apuntan a sub-archivos en L_scaffolding.

**Slice mínimo entregable**:

7 sub-archivos nuevos en `app/src/modelo/operaciones/`:

- `creacion.ts`: `crearModelo`, `crearObjeto`, `crearProceso`, `crearEntidad` (helper privado), creación inicial OPD raíz. Tipos: `EstadosInicialesObjeto` (si solo se usa aquí), helpers de generación de id/nextSeq.
- `refinamiento.ts`: `descomponerProceso`, `desplegarObjeto`, `quitarDescomposicionProceso`, `quitarDespliegueObjeto`, helpers `quitarRefinamientoEntidad`, `subprocesosInicialesInzoom`, `partesInicialesDespliegue`, `enlacesEstructuralesDespliegue`, `proyectarEnlacesExternosEnRefinamiento`, `redistribuirEnlacesExternosSiPrimerSubproceso`, `refrescarEnlacesExternosDerivados`, `aparienciasExtremosExternos`, `proyeccionEnlaceExterno`, `aparienciaEnlaceExiste`, `enlaceDerivadoExiste`, `enlaceDerivadoManualExisteParaPadre`, `limpiarEnlacesDerivadosAutomaticos`, `subprocesosOrdenadosDeRefinamiento`, `dentroDe`, `compararOrdenTemporal`, `procesoDescompuestoEnOpd`, `enlacesExternosDelProceso`, `siguienteNombreOpdHijo`, `codigoOpd`, `idsSubarbolOpd`. Tipos: `DescomposicionProceso`, `DespliegueObjeto`, `EstadoCreado`, `LadoEndpointDerivado`, `nombreInicialDespliegue`, `tipoEnlaceDespliegue`. Es el dominio más voluminoso (~600-700 LOC esperados).
- `entidad.ts`: `renombrarEntidad`, `cambiarEsencia`, `cambiarAfiliacion`. Helpers de validación de nombre de entidad (delegando a `modelo/objetoMetadata.ts` cuando ya existan).
- `estados.ts`: `estadosDeEntidad`, `crearEstadosIniciales`, `agregarEstado`, `renombrarEstado`, `eliminarEstado`, `quitarEstadosObjeto`, `designarEstadoInicial`, `designarEstadoFinal`. Helpers privados `designarEstado`, `validarNombreEstado`, `siguienteNombreEstado`, `normalizarNombreEstado`, `ordenEstado`. Tipos: `EstadosInicialesObjeto`, `EstadoCreado` si los consume aquí.
- `enlaces.ts`: `crearEnlace`, `apuntarExtremoEnlace`, `reanclarEnlaceExternoDerivado`, `volverEnlaceExternoDerivadoAAutomatico`, `validarFirmaEnlace`, `validarMultiplicidad`, `ajustarMultiplicidad`. Helpers privados `validarReanclajeEnlaceExterno`, `ladoReanclableDerivado`. Tipos: `LadoMultiplicidadEnlace`, `LadoExtremoEnlace`. **No mover** `enlaceMultiplicidad.ts`/`enlaceEstilo.ts`/`enlaceVertices.ts` (ya viven separados desde rondas previas).
- `apariencias.ts`: `moverApariencia`, `moverAparienciaPorId`, `actualizarVerticesEnlace`. Helper privado `aparienciaEsProxyExterna`, `entidadVisibleEnOpd`.
- `eliminacion.ts`: `eliminarEntidad`, `eliminarEnlace`, `splitEffectEnPar`. Helpers privados `eliminarEnlacesPorExtremosEstado`, `extremosEffect`, `nombreIntermedioUnico`, `posicionIntermedioSplit`, `posicionDentroDeContorno`. **`entidadesDelOpd`** (read-only) puede ir aquí o en `helpers.ts`.

1 archivo de soporte opcional:

- `helpers.ts`: si emerge un núcleo de helpers compartidos entre 3+ dominios (ej. validaciones genéricas de id/posición/intersección), aterrizan aquí. Si los helpers son específicos de 1-2 dominios, viven en su sub-archivo.

Barrel `operaciones.ts` reducido:

```ts
// app/src/modelo/operaciones.ts
export * from "./operaciones/creacion";
export * from "./operaciones/refinamiento";
export * from "./operaciones/entidad";
export * from "./operaciones/estados";
export * from "./operaciones/enlaces";
export * from "./operaciones/apariencias";
export * from "./operaciones/eliminacion";
```

Si hay colisión de nombres entre dominios, re-exportar explícitamente:

```ts
export { crearModelo, crearObjeto, crearProceso } from "./operaciones/creacion";
export { ... } from "./operaciones/refinamiento";
// etc.
```

`operaciones.test.ts` preservado intacto (1185 LOC). Tests aditivos por sub-archivo opcionales pero recomendados (`operaciones/<dominio>.test.ts` con tests focalizados).

**Fuera de slice**:

- **No tocar `app/src/modelo/tipos.ts`** (territorio L5). Si un tipo necesita re-exportarse aquí, hacerlo desde `tipos.ts` global, no migrarlo.
- **No tocar otros archivos de `app/src/modelo/`** (`abanicos.ts`, `autoinvocacion.ts`, `creacionWizard.ts`, `creacionInterna.ts`, `enlaceMultiplicidad.ts`, `enlaceEstilo.ts`, `enlaceVertices.ts`, `estadosDesignaciones.ts`, `etiquetasEnlace.ts`, `extremos.ts`, `modificadores.ts`, `objetoDuracion.ts`, `objetoMetadata.ts`, `opdEliminacion.ts`, `opdReorden.ts`, `plegado.ts`, `rutas.ts`, `validaciones.ts`, etc.). Estos ya fueron extraídos en rondas previas y son consumidores de `operaciones.ts`, no candidatos a fusionar.
- **No reescribir `operaciones.test.ts`**. Es el contrato observable.
- **No introducir validaciones nuevas, ni cambiar firmas, ni agregar parámetros opcionales nuevos**. La línea es 100% refactor estructural.

## 2. Deudas que cierra

| Deuda | Path absoluto | Aporte |
|---|---|---|
| Monolito `operaciones.ts` congelado por doctrina desde ronda 4 | `/home/felix/projects/deep-opm-pro/app/src/modelo/operaciones.ts` (1743 LOC) | Reduce a < 200 LOC en barrel; 7 sub-archivos < 350 LOC c/u (refinamiento puede llegar a < 700 LOC con desviación declarada). |
| HANDOFF "deuda técnica `app/src/modelo/operaciones.ts` 1743 LOC (congelado)" | `/home/felix/projects/deep-opm-pro/docs/HANDOFF.md §Pendientes Inmediatos` | Cierra el ítem explícito; la subcarpeta `app/src/modelo/operaciones/` se crea con 7 dominios trazables. |

## 3. Anclaje a evidencia

- **SSOT**: este refactor no toca semántica OPM; la validación semántica vive en cada función de operación y permanece intacta. Citas implícitas a `docs/HANDOFF.md §Decisiones Vigentes` (firmas de enlace, esencia/afiliación, estados con designaciones, refinamiento OPD, etc.) que esta línea preserva.
- **Corpus interno reusable**:
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/components/commands/edit-alias.ts:5-30` — comando OPCloud `EditAlias` con método `act()`. Patrón de **comando puro sobre el modelo**. Destilamos como funciones `Resultado<Modelo>` agrupadas por dominio.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/components/commands/object-decider.ts:5-127` — `ObjectDecider` que filtra qué comandos aplican a un objeto según contexto. En nuestro stack, los deciders viven en la capa UI (Inspector/menú contextual); las funciones de `operaciones.ts` son solo la capa pura.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/Logical/AggregationLink.ts` y `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/Logical/EffectLink.ts` — OPCloud parte enlaces por familia en archivos. Confirma que `enlaces.ts` debe agrupar `crearEnlace`/`apuntarExtremoEnlace`/`reanclarEnlaceExternoDerivado`/`volverEnlaceExternoDerivadoAAutomatico`/`validarFirmaEnlace`/`validarMultiplicidad`/`ajustarMultiplicidad` en un dominio.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/json.model.ts:6-611` — `JsonModel` concentra serialización pero internamente separa por tipo. Confirma el patrón "barrel + sub-archivos por dominio" (replicado en ronda 8 sobre `serializacion/json.ts`).
  - `/home/felix/projects/deep-opm-pro/opm-extracted/REFACTOR-NOTES.md:13-25` — explicación de webcrack dividiendo bundles por path semántico. Justifica que `operaciones.ts` se beneficie de la misma división.
  - `/home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda8/linea-3-serializacion-validadores.md` y `linea-4-opl-generadores.md` — briefs ronda 8 con el mismo patrón (barrel + sub-archivos por dominio). Reusables como plantilla mental.
- **Estado actual del código (post-ronda 8)**:
  - `app/src/modelo/operaciones.ts` (1743 LOC): 32+ funciones exportadas + 30+ helpers privados. Tipos exportados: `DescomposicionProceso`, `DespliegueObjeto`, `EstadosInicialesObjeto`, `EstadoCreado`, `LadoMultiplicidadEnlace`, `LadoExtremoEnlace`. Imports activos desde `./tipos` (40 entidades), `./extremos`, `./constantes`, `./modificadores`, `./abanicos`, `./creacionInterna`, `./enlaceMultiplicidad`, `./enlaceVertices`, `./etiquetasEnlace`, `./opdEliminacion`, `./opdReorden`, `./plegado`, `./rutas`, `../serializacion/json` (para `nextSeqOpd`).
  - 38 archivos importan de `operaciones.ts` (verificado con `grep -rl "from.*modelo/operaciones" app/src/ | wc -l` → 38).
  - `operaciones.test.ts` (1185 LOC): tests de integración que cubren las 32 funciones públicas. Tras la partición debe pasar **sin reescribir** (la API pública no cambia).

## 4. Archivos permitidos

```text
app/src/modelo/operaciones.ts                          EDIT — reducir a barrel < 200 LOC (objetivo) / < 350 LOC (tope)
app/src/modelo/operaciones/creacion.ts                 NUEVO
app/src/modelo/operaciones/creacion.test.ts            NUEVO opcional
app/src/modelo/operaciones/refinamiento.ts             NUEVO
app/src/modelo/operaciones/refinamiento.test.ts        NUEVO opcional
app/src/modelo/operaciones/entidad.ts                  NUEVO
app/src/modelo/operaciones/entidad.test.ts             NUEVO opcional
app/src/modelo/operaciones/estados.ts                  NUEVO
app/src/modelo/operaciones/estados.test.ts             NUEVO opcional
app/src/modelo/operaciones/enlaces.ts                  NUEVO
app/src/modelo/operaciones/enlaces.test.ts             NUEVO opcional
app/src/modelo/operaciones/apariencias.ts              NUEVO
app/src/modelo/operaciones/apariencias.test.ts         NUEVO opcional
app/src/modelo/operaciones/eliminacion.ts              NUEVO
app/src/modelo/operaciones/eliminacion.test.ts         NUEVO opcional
app/src/modelo/operaciones/helpers.ts                  NUEVO opcional (solo si emerge núcleo compartido)
app/src/modelo/operaciones.test.ts                     LECTURA (preservar intacto)
opm-extracted/**                                       LECTURA
docs/HANDOFF.md                                        LECTURA (no editar)
docs/historias-usuario-v2/**                           LECTURA (no editar)
docs/instrucciones-lineas-dev/ronda1..8/**             LECTURA (referencia)
```

Cualquier otro archivo es **fuera de scope**. Si un cambio cross-line aparece, detener y reportar.

## 5. Restricciones de no-colisión

- **Worktree dedicado obligatorio**: `git worktree add /tmp/r9-l1 main` (o ruta equivalente). L1 NO comparte working tree con L2-L5. Esto evita que cambios en `tipos.ts` (L5), `JointCanvas.tsx` (L2), `AsistenteNuevoModelo.tsx` (L3) o `runtime.ts` (L4) ensucien el árbol de L1.
- **No editar `tipos.ts`**: si un tipo de `operaciones.ts` debe migrar a su sub-archivo (ej. `EstadoCreado` solo se usa en `estados.ts`), hacerlo localmente al sub-archivo. NO migrarlo a `tipos.ts` ni mover tipos existentes de `tipos.ts`. Eso es L5.
- **No editar otros archivos de `app/src/modelo/`** ni de `app/src/canvas/`, `app/src/render/`, `app/src/ui/`, `app/src/store/`, `app/src/serializacion/`, `app/src/opl/`, `app/src/persistencia/`. La línea está aislada en `app/src/modelo/operaciones/`.
- **No reescribir `operaciones.test.ts`**. Si un test falla tras la partición, hay un bug en la partición; rebasear, no parchar el test.
- **No introducir dependencias nuevas**. Lo que existe en imports de `operaciones.ts` se redistribuye a los sub-archivos sin agregar.
- **No tocar `customShapes.ts`, `in-vivo-test.mjs`, `home/`** ni archivos sueltos del operador en working tree raíz.

## 6. Slice mínimo shippeable

### 6.1 Capa modelo (única capa que toca L1)

Cada sub-archivo abre con un comentario JSDoc del módulo:

```ts
// app/src/modelo/operaciones/creacion.ts
/**
 * Operaciones de creación de modelo y entidades.
 * Cubre crearModelo (modelo nuevo con OPD raíz), crearObjeto, crearProceso.
 * Consumidores: store/modelo.ts, ui/AsistenteNuevoModelo.tsx (vía store),
 * tests de operaciones.
 * Refs: SSOT opm-iso-19450-es.md §3.55 (Object), §3.69 (Process).
 */
import type { Modelo, Posicion, Resultado, /* ... */ } from "../tipos";
import { /* helpers desde otros archivos modelo/* */ } from "...";
import { entidadAux } from "./helpers";

export function crearModelo(nombre = "Modelo OPM"): Modelo { /* ... */ }
export function crearObjeto(modelo: Modelo, opdId: Id, posicion: Posicion, nombre = "Objeto"): Resultado<Modelo> { /* ... */ }
export function crearProceso(modelo: Modelo, opdId: Id, posicion: Posicion, nombre = "Proceso"): Resultado<Modelo> { /* ... */ }
```

### 6.2 Helpers compartidos

Si dos o más dominios comparten un helper privado, **decidir explícitamente**:

- Si el helper es genuinamente cross-dominio (ej. `crearEntidad` lo usan creacion + refinamiento + estados): mover a `helpers.ts` y exportarlo (interno al subdirectorio).
- Si el helper es específico de un dominio pero llamado por otro 1 vez: duplicar (la duplicación es preferible al acoplamiento accidental, según `urn:fxsl:kb:icas-composicion`).
- Si el helper depende de tipos del subdirectorio: mantenerlo en su archivo dominio.

### 6.3 Barrel reducido

```ts
// app/src/modelo/operaciones.ts (< 200 LOC)
/**
 * Barrel agregador de operaciones del modelo OPM.
 * Re-exporta todas las funciones públicas desde sub-archivos por dominio:
 * creacion, refinamiento, entidad, estados, enlaces, apariencias, eliminacion.
 * Consumidores: 38 archivos en app/src/. Las firmas públicas se preservan
 * sin cambio respecto a la versión monolítica pre-ronda 9.
 */
export type { DescomposicionProceso, DespliegueObjeto, EstadosInicialesObjeto, EstadoCreado, LadoMultiplicidadEnlace, LadoExtremoEnlace } from "./operaciones/<archivo-dominio>";
export { crearModelo, crearObjeto, crearProceso } from "./operaciones/creacion";
export { descomponerProceso, desplegarObjeto, quitarDescomposicionProceso, quitarDespliegueObjeto } from "./operaciones/refinamiento";
export { renombrarEntidad, cambiarEsencia, cambiarAfiliacion } from "./operaciones/entidad";
export { estadosDeEntidad, crearEstadosIniciales, agregarEstado, renombrarEstado, eliminarEstado, quitarEstadosObjeto, designarEstadoInicial, designarEstadoFinal } from "./operaciones/estados";
export { crearEnlace, apuntarExtremoEnlace, reanclarEnlaceExternoDerivado, volverEnlaceExternoDerivadoAAutomatico, validarFirmaEnlace, validarMultiplicidad, ajustarMultiplicidad } from "./operaciones/enlaces";
export { moverApariencia, moverAparienciaPorId, actualizarVerticesEnlace } from "./operaciones/apariencias";
export { eliminarEntidad, eliminarEnlace, splitEffectEnPar, entidadesDelOpd } from "./operaciones/eliminacion";
```

Verificación crítica: `grep -rln "from.*['\"].*operaciones['\"]" app/src/` debe seguir devolviendo los 38 archivos sin error de import resolution tras el refactor. Verificar también que no haya `unused-export` en sub-archivos.

## 7. Tests obligatorios

- **`operaciones.test.ts` intacto**: pasa sin tocar. **Si falla, hay bug en la partición**.
- **Tests aditivos por dominio (recomendados)**:
  - `creacion.test.ts`: 1+ test por función pública (smoke). ~5 tests / ~20 expects.
  - `refinamiento.test.ts`: cobertura focalizada en helpers privados expuestos como tests de unidad. ~8 tests / ~30 expects.
  - `entidad.test.ts`: ~3 tests / ~10 expects.
  - `estados.test.ts`: ~6 tests / ~25 expects.
  - `enlaces.test.ts`: ~6 tests / ~25 expects.
  - `apariencias.test.ts`: ~3 tests / ~10 expects.
  - `eliminacion.test.ts`: ~5 tests / ~20 expects.
- **Total esperado**: ~36 tests aditivos / ~140 expects nuevos. Combinados con los 558 actuales: ~594 tests / ~2497 expects.

Si un test focalizado del subarchivo falla pero `operaciones.test.ts` pasa, el bug está en el test nuevo (no en la partición). Eso es información valiosa pero no bloqueante.

## 8. Verificación

```bash
# En el worktree dedicado /tmp/r9-l1:
cd /tmp/r9-l1/app

bun run typecheck          # debe pasar (ningún consumidor roto)
bun run test src/modelo/   # tests de operaciones + sub-archivos verdes
bun run test src/          # suite completa, ningún test reescrito
bun run check              # typecheck + tests integrados
```

**No se requiere `browser:smoke` ni `build`** porque L1 es 100% refactor de modelo (no toca UI/render/build).


## 9. Decisiones bloqueadas (no reabrir)

- **Firmas y nombres de funciones exportadas**: idénticos al monolito. Cualquier rename rompe el funtor faithful y se rechaza.
- **`operaciones.test.ts` no se reescribe**. Si el implementador siente que el test es "feo", lo deja igual.
- **Tipos `DescomposicionProceso`, `DespliegueObjeto`, `EstadosInicialesObjeto`, `EstadoCreado`, `LadoMultiplicidadEnlace`, `LadoExtremoEnlace`**: se mantienen exportados con el mismo nombre desde el barrel. Su archivo de origen puede cambiar (queda en el sub-archivo del dominio que los emite), pero el barrel los re-exporta.
- **Doctrina de `tipos.ts` global**: no se migran tipos a `tipos.ts`; eso es L5. Los tipos específicos de operaciones siguen en sus sub-archivos.
- **No introducir Command pattern OO**: las funciones siguen siendo puras, no se convierten a clases con `act()`/`canBePerformed()`. El stack es Preact/Zustand funcional.
- **No agrupar por capa (validación / mutación)**: la partición es **por dominio del modelo OPM**, no por capa funcional. Mezclar particiones es anti-patrón.
- **No introducir `index.ts` en `operaciones/`**: el barrel `operaciones.ts` es el único punto de entrada público. Un `operaciones/index.ts` interno sería redundante.

## 10. Decisiones que tomas vos (documentar en commit)

- **Cómo agrupar helpers privados**: si emerge `helpers.ts` o si se duplican entre dominios. Documentar la decisión en commit con rationale: "duplicado en X y Y porque genuinamente local" o "extraído a helpers.ts porque cross-3-dominios".
- **Granularidad de tests aditivos**: del rango ~30-50 tests, decidir cuántos cubren cada dominio. Mínimo 1 test por función pública. Si el dominio refinamiento es tan grande que merece sub-archivos internos (ej. `refinamiento/inzoom.ts` + `refinamiento/despliegue.ts`), hacerlo y declararlo en commit.
- **Formato de re-export**: `export *` vs `export { ... }` explícito. Recomendado: `export { explicito }` para que el barrel sea greppable y el detector tenga evidencia textual. `export *` es válido pero hace al barrel opaco.
- **Tipos compartidos entre sub-archivos**: si `LadoMultiplicidadEnlace` (declarado en `enlaces.ts`) lo necesita `apariencias.ts` o algún test, decidir si: (a) re-exportarlo desde `enlaces.ts`, (b) moverlo a `helpers.ts`, (c) duplicar la definición. Mejor (a).
- **Si la partición revela un bug oculto** (ej. helper que no debería ser global, dependencia circular oculta): declararlo en commit como **observación** sin arreglarlo en esta línea (bugs cross-line se entregan como patch a `/tmp/`).

## 11. Forma del entregable

Commits sugeridos (uno o varios, a tu criterio):

```
1. refactor(modelo): extrae operaciones por dominio en operaciones/{creacion,refinamiento,entidad,estados,enlaces,apariencias,eliminacion}.ts
   - 7 sub-archivos nuevos
   - operaciones.ts reducido a barrel < 200 LOC
   - 38 consumidores intactos (firmas preservadas)
   - operaciones.test.ts intacto (1185 LOC)
   - tests aditivos por sub-archivo (~30-50 tests)

   Co-Authored-By: <implementador-externo> <noreply@...>
```

Si se decide commits separados por sub-archivo:

```
1. refactor(modelo): scaffolding del subdirectorio operaciones/ + barrel
2. refactor(modelo): extrae creacion.ts
3. refactor(modelo): extrae refinamiento.ts
... (uno por dominio)
N. refactor(modelo): operaciones.ts queda como barrel definitivo
```

Co-author footer si aplica al implementador externo (Codex u otro).

**Reporte de cierre obligatorio**:

- Hash final del último commit en main.
- LOC final de cada sub-archivo + barrel.
- Output de `bun run check` (último tail).
- Output de `wc -l app/src/modelo/operaciones*.ts app/src/modelo/operaciones/*.ts`.
- Lista de tests aditivos creados + conteo.
- Decisiones declaradas (de §10).
- Si hubo desviación de objetivo LOC: declararla con rationale.
- Si el smoke browser cambió 40/40 → otro número: investigar (no debería; L1 no toca UI).
- Confirmación de que `operaciones.test.ts` no se tocó (`git diff --stat HEAD~N app/src/modelo/operaciones.test.ts` debe ser 0).

**Qué NO tocar**:

- `docs/HANDOFF.md`, `docs/historias-usuario-v2/`, `docs/JOYAS.md`, `docs/instrucciones-lineas-dev/ronda1..8/`.
- Cualquier archivo fuera de `app/src/modelo/operaciones.ts` y `app/src/modelo/operaciones/*.ts`.
- `app/src/modelo/operaciones.test.ts`.
- `app/src/render/jointjs/customShapes.ts`, `app/scripts/in-vivo-test.mjs`, `home/`.
