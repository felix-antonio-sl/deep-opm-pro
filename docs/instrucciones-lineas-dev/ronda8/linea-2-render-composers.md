# Linea 2 — Composers de render por familia

## 1. Mision

Romper `app/src/render/jointjs/proyeccion.ts` (**1382 LOC**, 62 funciones libres) en composers por familia OPM, conservando la API publica via barrel re-export. La forma OPCloud para este problema es **una clase por shape OPM** (`OpmObject.ts:5468 LOC`, `OpmProcess.ts:2402 LOC`, `OpmEntity.ts:1736 LOC`, `Links/AggregationLink.ts:33`, `Links/EffectLink.ts:117`, `Links/InvocationLink.ts:211`, `Links/ConsumptionLink.ts:115`, `Links/ResultLink.ts:109`). Aunque sus archivos son enormes, el patron arquitectural es correcto: **separacion estricta entre composer de objeto, composer de proceso, composer de estado, composer de cada tipo de enlace**. Lo destilamos en **6 composers + 2 helpers** que reciben modelo + apariencia/enlace y emiten `JointCellJson`, sin clases (funciones puras), preservando JointJS OSS.

Cierre arquitectural: `proyeccion.ts` queda como **barrel agregador** (objetivo: < 200 LOC; tope absoluto: < 600 LOC); todo el codigo nuevo vive en `app/src/render/jointjs/composers/<familia>.ts`. Las 10 reglas del detector que apuntan a `proyeccion.ts` siguen matcheando porque el barrel mantiene strings claves o porque L6 recalibra (preferencia: barrel preserva strings).

**Slice minimo entregable**:

- 7 composers nuevos en `app/src/render/jointjs/composers/`:
  - `entidad.ts`: `proyectarEntidad`, `dimensionesConEstados`, `dimensionesPlegadoParcial`, `metadatosEntidad`, `markupConBadge`, `markupConEstados`, `markupPlegadoParcial`, `attrsConBadge`, `attrsConEstados`, `attrsPlegadoParcial`, `aplicarMetadatosAttrs`, `selectoresPartesPlegadas`, `textoFilaPlegado`, `rolApariencia`, `refYEtiquetaEntidad`. Constantes `PLEGADO`, `ESTADOS` viven aca.
  - `estados.ts`: helpers de capsulas, `anchoCapsulaEstado`, `puntoCapsulaEstado`. Render de marcadores V-4/V-5/V-6 sobre capsulas y anillo Current.
  - `plegado.ts`: dimensiones plegado parcial + selectoresPartes + texto filas; helpers de markup y attrs especificos de plegado.
  - `enlace.ts`: `proyectarEnlace`, `etiquetasMultiplicidad`, `etiquetasModificador`, `etiquetaEnlace`, `etiquetaTextoEnlace`, `etiquetaMultiplicidad`, `endpointJoint`, `extremo`, `centro`, `routerManhattan`, `verticesEnlace`, `verticesInvocacion`, `puntoZigzag`, `attrsLinea`, `markerAttrs`, `polyShapeCell`, `etiquetasProxyParte`, `etiquetaProxyParte`.
  - `halos.ts`: `proyectarHaloSeleccion`, `refResaltaEntidad`, `refResaltaEnlace` (resaltado por hover OPL y multi-seleccion).
  - `markers.ts`: `marcadorFuente`, `marcadorDestino`, marker assets de cada `TipoEnlace`. Mantiene contrato actual con `linkAssets.ts` (lectura).
  - `colores.ts`: `colorTextoParaFill`, `normalizarHex6`, `canalSrgb` (helpers de luminancia para text contrast).
- Composers consumen solo `modelo/tipos.ts` (lectura) y `linkAssets.ts` (lectura). NO importan de `JointCanvas.tsx` ni de UI.
- Barrel `proyeccion.ts` reducido (< 200 LOC) que re-exporta `proyectarModeloAJointCells`, `fijarOpcionesProyeccionGlobal`, `proyectarProxyExtraccion` (y otros helpers publicos consumidos por `completitud.test.ts` y JointCanvas).
- Frontera de tipos publica preservada: `RolApariencia`, `OpmJointMetadata`, `JointCellJson` y `OpcionesProyeccion` siguen exportados desde `proyeccion.ts` con el mismo nombre. Pueden vivir en `proyeccionTipos.ts` si ayuda a evitar ciclos, pero el barrel debe re-exportarlos.
- `proyeccion.test.ts` (820 LOC) preservado intacto (no reescribir).
- Tests aditivos por composer: `app/src/render/jointjs/composers/<familia>.test.ts` con cobertura minima por familia.

**Fuera de slice**:
- `mapaSistema.ts` y `mapaExport.ts` ya estan separados; no se tocan.
- `abanicoOverlay.ts` y `abanicoDragSync.ts` ya estan separados; no se tocan.
- `agregacionBus.ts`, `autoinvocacionLoop.ts`, `rutaLabels.ts`, `estadoTargets.ts`, `plegadoNesting.ts`, `linkAssets.ts`, `customShapes.ts`: ya separados; no se tocan.
- `JointCanvas.tsx` (697 LOC): NO se toca en esta linea (territorio futuro ronda 9).

## 2. Deudas que cierra

| Deuda | Path absoluto | Aporte |
|---|---|---|
| Monolito `proyeccion.ts` | `/home/felix/projects/deep-opm-pro/app/src/render/jointjs/proyeccion.ts` (1382 LOC) | Reduce a < 200 LOC en barrel; 7 composers < 400 LOC c/u (mayoria < 250). |
| 10 reglas del detector | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/tools/progress-dashboard.mjs:...` | Barrel preserva strings clave (`drop-shadow`, `strokeDasharray`); L6 recalibra reglas que apunten a composers nuevos. |
| HANDOFF "deuda tecnica `proyeccion.ts` 1116 LOC" | `/home/felix/projects/deep-opm-pro/docs/HANDOFF.md §Pendientes Inmediatos` | Cierra el item explicito. |

## 3. Anclaje a evidencia

- **SSOT** (justifica la particion):
  - `opm-visual-es.md V-1` (objeto basico — rectangulo verde lima `#70E483`), `V-237` (axioma >=2 estados), `V-238` (estados como capsulas), `V-95` (multiples apariencias misma entidad), `V-163` (slot de valor), `V-4` (estado inicial — linea de entrada), `V-5` (estado final — cuadrado pequeno), `V-6` (estado default — borde grueso), `V-239/V-240` (ejes y familias estructurales). Justifica composer `entidad` + `estados`.
  - `opm-visual-es.md` familias de enlaces (estructurales: agregacion losange, exhibicion triangulo apilado, generalizacion triangulo, instanciacion linea con annotation; procedurales: agente disco, instrumento disco hueco, consumo flecha, resultado flecha, efecto par, invocacion zigzag). Justifica composer `enlace` + `markers`.
  - `metodologia-opm-es.md §15 invariantes` (axiomas de OPD coherente). Justifica composer `halos` para validar visualmente el invariante (resaltado de seleccion).
- **Corpus interno reusable**:
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/DrawnPart/OpmObject.ts:1-200` — `OpmObject` extiende JointJS shape con metodos `addState()`, `editAlias()`, `setUnit()`, etc. Cada metodo es shape-specific. Patron canonico: composer por tipo de shape. Su tamano (5468 LOC) es el caso degenerado de NO partir mas; el archivo es resultado de N anos de feature creep no controlado. Nuestro `entidad.ts` debe quedar mucho mas pequeno (< 400 LOC) por el simple hecho de no empezar en la misma posicion.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/DrawnPart/OpmEntity.ts:1-100` — `OpmEntity` clase base con `getState()`, `getApperance()`, `embedStates()`. Confirma que estados tienen tratamiento separado del shape padre. Justifica composer `estados.ts` separado de `entidad.ts`.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/DrawnPart/Links/AggregationLink.ts:1-33`, `EffectLink.ts:1-117`, `InvocationLink.ts:1-211`, `ConsumptionLink.ts:1-115`, `ResultLink.ts:1-109`, `AgentLink.ts:1-52`, `InstrumentLink.ts:1-50`, `BlankLink.ts:1-225`, `SelfInvocationLink.ts:1-329`, `UnidirectionalTaggedLink.ts:1-390`. Cada tipo de enlace es una clase de < 400 LOC con responsabilidad clara: marker source + marker target + ruta especifica. Justifica composer `enlace.ts` + `markers.ts` separados (en nuestro caso, una funcion por tipo de enlace en lugar de clase).
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/LogicalPart/components/aliasing-module.ts:5-32` — `AliasingModule.getText()` retorna `"{" + (this.alias || "") + "}"`. Patron de **modulo de presentacion atomico** que reusamos para metadatos: cada modulo (alias, unit, descripcion) tiene su funcion de format text. En el composer `entidad.ts`, `metadatosEntidad()` debe seguir centralizando estos formats.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/LogicalPart/components/units-text-module.ts:5-32` — `UnitsTextModule.getText()` retorna `"[units]"`. Mismo patron que aliasing.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/configuration/elementsFunctionality/draw.view.ts` — registro central de shapes JointJS (en su caso Rappid). Confirma que la inicializacion de shapes vive separada de los composers de instancia. En nuestro caso `customShapes.ts` y `linkAssets.ts` ya cumplen esa funcion — no se tocan.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/configuration/rappidEnviromentFunctionality/shared.ts` (6261 LOC) — el megamodulo Rappid. Es el ejemplo de NO partir oportunamente. Su existencia es la justificacion empirica de esta linea.
- **Estado actual del codigo**:
  - `proyeccion.ts` (1382 LOC, 62 funciones): empieza con `proyectarModeloAJointCells` (linea 84) que orquesta toda la proyeccion. Las funciones siguen un patron implicito: entidad (linea 198-470), halos/colores (282-368), proyeccion enlaces (842-1031), markers (1244-1297), router/vertices (1331-1362). Constantes `PLEGADO` (1366), `ESTADOS` (1372) al final.
  - Helpers privados con nombres claros: `proyectarEntidad`, `proyectarEnlace`, `proyectarHaloSeleccion`, `proyectarProxyExtraccion`, `proyectarRefinamientoEstructural`. La particion sigue las funciones existentes: cada composer absorbe el subset de funciones que comparten dominio.
  - `proyectarModeloAJointCells` (linea 84-178) es el orquestador publico que itera el modelo y compone resultados. Permanece en barrel `proyeccion.ts` y delega a los composers nuevos via imports.
  - `fijarOpcionesProyeccionGlobal` (linea 189) y `opcionesProyeccionGlobal` (linea 178) son singleton de configuracion. Pueden quedar en barrel o moverse a `composers/opciones.ts` si pesan; recomendado: dejar en barrel (son publicos).
  - `proyectarProxyExtraccion` (linea 773) es helper publico consumido por `completitud.test.ts`; debe seguir exportable desde barrel.

## 4. Archivos permitidos

```text
app/src/render/jointjs/proyeccion.ts                EDIT — reducir a barrel < 200 LOC
app/src/render/jointjs/proyeccionTipos.ts           NUEVO opcional — solo tipos publicos re-exportados
app/src/render/jointjs/composers/entidad.ts         NUEVO
app/src/render/jointjs/composers/entidad.test.ts    NUEVO
app/src/render/jointjs/composers/estados.ts         NUEVO
app/src/render/jointjs/composers/estados.test.ts    NUEVO
app/src/render/jointjs/composers/plegado.ts         NUEVO
app/src/render/jointjs/composers/plegado.test.ts    NUEVO
app/src/render/jointjs/composers/enlace.ts          NUEVO
app/src/render/jointjs/composers/enlace.test.ts     NUEVO
app/src/render/jointjs/composers/halos.ts           NUEVO
app/src/render/jointjs/composers/halos.test.ts      NUEVO
app/src/render/jointjs/composers/markers.ts         NUEVO
app/src/render/jointjs/composers/markers.test.ts    NUEVO
app/src/render/jointjs/composers/colores.ts         NUEVO
app/src/render/jointjs/composers/colores.test.ts    NUEVO
app/src/render/jointjs/proyeccion.test.ts           LECTURA (preservar intacto)
opm-extracted/**                                    LECTURA
assets/svg/**                                       LECTURA canonica
docs/HANDOFF.md                                     LECTURA
/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/** LECTURA
```

NO tocar `mapaSistema.ts`, `mapaExport.ts`, `abanicoOverlay.ts`, `abanicoDragSync.ts`, `agregacionBus.ts`, `autoinvocacionLoop.ts`, `rutaLabels.ts`, `estadoTargets.ts`, `plegadoNesting.ts`, `linkAssets.ts`, `customShapes.ts`, `JointCanvas.tsx`.
NO tocar `modelo/`, `serializacion/`, `opl/`, `ui/`, `store/`, `canvas/`.
NO tocar `tipos.ts`. `proyeccionTipos.ts` solo existe si se necesita para tipos publicos de esta capa; no se convierte en cajon de helpers.

## 5. Restricciones de no-colision

- **No tocar `JointCanvas.tsx`**: es el consumidor publico de `proyectarModeloAJointCells` y `fijarOpcionesProyeccionGlobal`. Esta linea preserva esas firmas exactas en barrel.
- **No perder tipos publicos**: `RolApariencia`, `OpmJointMetadata`, `JointCellJson`, `OpcionesProyeccion` siguen importables desde `render/jointjs/proyeccion`. Typecheck de consumidores es parte del contrato.
- **No tocar `proyeccion.test.ts`**: el contrato testeable es la salida de `proyectarModeloAJointCells`. Tras la particion debe pasar igual. Si un composer cambia formato de salida no equivalente, es bug — corregir antes de commitear.
- **Metadata `opm` estable**: cada cell mantiene shape de `opm`, `selector`, ids, tipos y roles actuales. Cambiar nombres de selectores o estructura de metadata rompe hover OPL, completitud y smokes.
- **No tocar `mapaSistema.ts`**: el mapa es vista neutra independiente; sigue importando lo minimo de `proyeccion.ts` (probablemente nada, solo tipos via `tipos.ts`).
- **No tocar `customShapes.ts` ni `linkAssets.ts`**: los assets visuales canonicos viven ahi (territorio operador).
- **No tocar `tipos.ts`**: si un composer necesita un tipo helper, lo define local al composer.
- **No introducir `joint-plus`** (Rappid commercial). Solo JointJS OSS.
- **No tocar UI**, store, persistencia, OPL, modelo. Esta linea es 100% render.
- **No tocar `vite.config.ts`** ni `package.json` (territorio L6).

## 6. Slice minimo shippeable

### Patron canonico de composer

```ts
// app/src/render/jointjs/composers/<familia>.ts
import type { Modelo, Apariencia, Entidad, /*...*/ } from "../../../modelo/tipos";
import type { JointCellJson, OpcionesProyeccion } from "../proyeccionTipos"; // o desde el barrel si quedan ahi
import { LINK_ASSETS } from "../linkAssets";

/**
 * Composer para la familia <X>. Exporta funciones puras que toman modelo +
 * apariencia/enlace y retornan `JointCellJson` (subset del JSON JointJS).
 *
 * Consumidores: `proyeccion.ts` (barrel), `proyectarModeloAJointCells`.
 * No depende de UI, store, ni JointCanvas.
 */

export function proyectarX(/* args */): JointCellJson {
  // ...
}

// Constantes locales del composer, no exportadas si no son publicas.
const X_DEFAULTS = { /* ... */ };

// Helpers privados sin export.
function _helperPrivado(/* */): unknown { /* ... */ }
```

### `composers/entidad.ts` (objetivo < 400 LOC)

Funciones absorbidas de `proyeccion.ts:198-470`:
- `proyectarEntidad(modelo, opdId, apariencia, entidad, opciones, ref): JointCellJson` (linea 198-282).
- `dimensionesPlegadoParcial`, `dimensionesConEstados` (linea 382-403).
- `metadatosEntidad`, `markupConBadge`, `markupConEstados`, `markupPlegadoParcial` (linea 417-481).
- `attrsConBadge`, `attrsConEstados`, `attrsPlegadoParcial`, `aplicarMetadatosAttrs` (linea 481-728).
- `selectoresPartesPlegadas`, `textoFilaPlegado` (linea 728-742).
- `rolApariencia` (linea 369-382), `refYEtiquetaEntidad` (linea 404-417).
- Constantes `PLEGADO` y `ESTADOS` (linea 1366-1372+).

Tests:
- `proyectarEntidad` con objeto sin estados retorna cell rectangulo con metadatos basicos.
- `proyectarEntidad` con estados retorna cell con embedded states.
- Plegado parcial con `apariencia.modoPlegado === "parcial"` retorna cell con filas truncadas.
- Layout horizontal vs vertical de estados se respeta segun `entidad.layoutEstados`.

### `composers/estados.ts` (objetivo < 250 LOC)

Funciones:
- `anchoCapsulaEstado(nombre)` (linea 742).
- `puntoCapsulaEstado(modelo, apariencia, estadoId)` (linea 810-842).
- Helpers de marcadores V-4/V-5/V-6 sobre capsula (parte de `attrsConEstados`).
- Render Current como anillo verde (propuesta documentada, no SSOT).
- Estado suprimido omitido del render (parte de `proyectarEntidad`).

Tests:
- `anchoCapsulaEstado` con nombre largo respeta minimo configurado.
- `puntoCapsulaEstado` retorna posicion absoluta dentro del padre.
- Estado con `designaciones: ["inicial"]` produce marcador V-4.
- Estado con `designaciones: ["inicial", "final"]` produce ambos marcadores.
- Estado `suprimido === true` retorna `null` (omitir cell).

### `composers/plegado.ts` (objetivo < 200 LOC)

Funciones:
- `dimensionesPlegadoParcial`, `markupPlegadoParcial`, `attrsPlegadoParcial`, `selectoresPartesPlegadas`, `textoFilaPlegado`. Si `entidad.ts` ya consume estos, decidir si quedan en `entidad.ts` o se promueven a `plegado.ts`. Recomendado: promover a `plegado.ts` para que `entidad.ts` solo orqueste; `plegado.ts` provee primitivas.

Tests:
- `dimensionesPlegadoParcial` con 3 partes calcula altura proporcional.
- `markupPlegadoParcial` produce body + filas con selectores correctos.
- `textoFilaPlegado` con parte sin nombre retorna placeholder.

### `composers/enlace.ts` (objetivo < 400 LOC)

Funciones absorbidas de `proyeccion.ts:842-1064`:
- `proyectarEnlace(modelo, opdId, enlace, ref): JointCellJson` (linea 842-892).
- `etiquetasProxyParte`, `etiquetaProxyParte` (linea 892-926).
- `endpointJoint` (linea 926).
- `etiquetasMultiplicidad`, `etiquetasModificador`, `textoModificador`, `etiquetaBadgeModificador`, `etiquetaTextoModificador`, `etiquetaEnlace`, `etiquetaTextoEnlace`, `etiquetaMultiplicidad` (linea 931-1064).
- `extremo`, `centro`, `routerManhattan` (linea 1312-1331).
- `verticesEnlace`, `verticesInvocacion`, `puntoZigzag` (linea 1331-1362).
- `attrsLinea` (linea 1297).
- `polyShapeCell` (linea 1244).
- Helper `proyectarRefinamientoEstructural` (linea 1094-1148) — refinamiento estructural emite enlaces sinteticos; cabe en `enlace.ts` como caso especial.
- `marcadoresEstructurales` (linea 1148-1244) — markers de cosa-todo y partes; cabe en `markers.ts`.

Tests:
- `proyectarEnlace` con tipo `agregacion` y multiplicidad `"1..N"` produce labels canonicos.
- `proyectarEnlace` con `enlace.estilo` color custom respeta override.
- Vertices manuales se preservan en JSON cell.
- `routerManhattan` para enlaces ortogonales.
- Auto-invocacion (`origenId === destinoId`) usa `verticesInvocacion`.

### `composers/halos.ts` (objetivo < 150 LOC)

Funciones:
- `proyectarHaloSeleccion(opdId, apariencia, entidad)` (linea 282-323).
- `refResaltaEntidad`, `refResaltaEnlace` (linea 323-334).

Tests:
- Halo con `seleccionados.length >= 2` aplica color `#3DA8FF` 2px.
- `refResaltaEntidad` true cuando hover OPL apunta al id.
- En vista mapa (`vistaMapaActiva`) el halo no se aplica.

### `composers/markers.ts` (objetivo < 200 LOC)

Funciones:
- `marcadorFuente(tipo)` (linea 1268-1278).
- `marcadorDestino(tipo)` (linea 1278-1297).
- `markerAttrs(marker)` (linea 1362).
- `marcadoresEstructurales` (linea 1148-1244, si decidis traerlo aca en lugar de `enlace.ts`).
- Lookup de marker por `TipoEnlace`. Consume `LINK_ASSETS` desde `linkAssets.ts` (lectura).

Tests:
- Cada `TipoEnlace` produce el marker SVG correcto para origen y destino.
- Marker triangulo apilado para exhibicion.
- Marker losange relleno para agregacion.

### `composers/colores.ts` (objetivo < 100 LOC)

Funciones:
- `colorTextoParaFill(fill)` (linea 334-344).
- `normalizarHex6(value)` (linea 344-355).
- `canalSrgb(value)` (linea 355-369).

Tests:
- `colorTextoParaFill` para fill claro retorna negro.
- `colorTextoParaFill` para fill oscuro retorna blanco.
- `normalizarHex6` con `"#fff"` expande a `"#ffffff"`.

### `proyeccion.ts` (barrel reducido)

```ts
// app/src/render/jointjs/proyeccion.ts (objetivo < 200 LOC)
import type { Modelo, /*...*/ } from "../../modelo/tipos";
import type { JointCellJson, OpcionesProyeccion, /*...*/ } from "./tipos";
import { proyectarEntidad } from "./composers/entidad";
import { proyectarEnlace } from "./composers/enlace";
import { proyectarHaloSeleccion } from "./composers/halos";
import { proyectarRefinamientoEstructural } from "./composers/enlace";
import { proyectarProxyExtraccion as proyectarProxyExtraccionInterno } from "./composers/entidad";

let _opcionesGlobal: Required<OpcionesProyeccion> = { /* defaults */ };

export function fijarOpcionesProyeccionGlobal(opciones: Required<OpcionesProyeccion>): void {
  _opcionesGlobal = opciones;
}

function opcionesProyeccionGlobal(): OpcionesProyeccion {
  return _opcionesGlobal;
}

export function proyectarModeloAJointCells(
  modelo: Modelo,
  opdId: Id = modelo.opdRaizId,
  ref: OplReferencia | null = null,
): JointCellJson[] {
  // Orquestador: itera apariencias, enlaces, halos, refinamientos
  // y delega a los composers.
  // ... (preservar comportamiento exacto del actual)
}

export const proyectarProxyExtraccion = proyectarProxyExtraccionInterno;

// Re-exports compatibilidad rondas 1-7:
export type { RolApariencia, OpmJointMetadata, JointCellJson, OpcionesProyeccion } from "./proyeccionTipos";
// (lo que los tests existentes y JointCanvas consuman)
```

Verificar consumidores via `grep -rn "from \"@app/render/jointjs/proyeccion\"\|from \"\\.\\./proyeccion\"" src` y preservar cada export.

## 7. Tests obligatorios

- Unit por composer (al menos 3-5 tests por composer, total ~25-35 nuevos):
- `proyeccion.test.ts` (820 LOC) debe pasar **sin tocar** (regresion zero).
- `completitud.test.ts` debe pasar (consume `proyectarModeloAJointCells` y `proyectarProxyExtraccion`).
- Smoke browser: 40 actuales deben pasar sin cambios; render visual debe ser identico.
- Golden de proyeccion: con la misma entrada, `proyectarModeloAJointCells` conserva orden de cells, `id`, `type`, `attrs`, `markup`, `vertices`, `labels`, `opm` metadata y selectores publicos. Si por estabilidad de objeto cambia el orden de propiedades JSON pero no el valor, documentar y cubrir con deep equal semantico.

Verificacion adicional:
- `bun run build` debe seguir produciendo bundle equivalente (sin regresion gzip > 5%).

## 8. Verificacion

```bash
cd app
bun run check
bun run browser:smoke
bun run build
```

Verificacion adicional:

```bash
cd /home/felix/projects/deep-opm-pro
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
# detector debe seguir en 45/49 minimo (no caer)
```

Si una regla cae, examinar evidence ledger; restaurar strings clave en barrel.

## 9. Decisiones bloqueadas (no reabrir)

- **Patron barrel re-export**: `proyeccion.ts` debe seguir importable como `import { proyectarModeloAJointCells, fijarOpcionesProyeccionGlobal, proyectarProxyExtraccion } from "../render/jointjs/proyeccion"` por todos los consumidores. Lo mismo aplica a los tipos publicos exportados hoy.
- **JointJS OSS solo**: no usar joint-plus, no `joint.shapes.standard.Rectangle.define` mas alla de lo que ya hace `customShapes.ts`.
- **Salida JointCellJson**: el formato exacto de salida de `proyectarModeloAJointCells` no cambia. Si un test pasa antes y falla despues con misma entrada, es bug.
- **Constantes canonicas**: dimensiones, padding, colores (verde lima `#70E483`, cyan `#3BC3FF`, gris estados, azul seleccion `#3DA8FF`) NO cambian. Vienen de `JOYAS.md` y SSOT.
- **Markers SVG**: vienen de `linkAssets.ts` que lee `assets/svg/links/`. NO redibujar; NO inventar markers nuevos.
- **Halo selection**: borde 2 px color `#3DA8FF` solo cuando `seleccionados.length >= 2` (decision ronda 7).
- **Marcadores V-4/V-5/V-6 + Current** sobre capsulas estado: contratos cerrados ronda 7.
- **Plegado parcial**: hasta 3 partes inline + "y N partes mas" — no se altera en composer.
- **Vista mapa suspende halos** y aplica resaltado propio.

## 10. Decisiones que tomas vos (documentar en commit)

- **Si `marcadoresEstructurales` vive en `enlace.ts` o `markers.ts`**. Recomendado: `enlace.ts` (es composicion de enlace, no marker primitivo); `markers.ts` solo expone primitivas markerSource/markerTarget.
- **Si `proyectarRefinamientoEstructural` vive en `enlace.ts` o se promueve a composer separado** (`refinamiento.ts`). Recomendado: en `enlace.ts` (es composicion de enlaces sinteticos para refinamiento; no merece composer aparte por tamano).
- **Si `composers/plegado.ts` se merge a `composers/entidad.ts`** o queda separado. Recomendado: separado (su tamano y dominio justifican archivo aparte; reduce tamano de `entidad.ts`).
- **Si las constantes `PLEGADO` y `ESTADOS` viven en `composers/entidad.ts` o en `composers/constantes.ts`**. Recomendado: en `entidad.ts` (consumo principal); si crece, promover.
- **Si `colores.ts` se merge a `entidad.ts`** o queda separado. Recomendado: separado (helpers puros sin dependencia OPM, reusables).
- **Si `opcionesProyeccionGlobal` y `fijarOpcionesProyeccionGlobal` viven en barrel `proyeccion.ts` o se promueven a `composers/opciones.ts`**. Recomendado: en barrel (publicos, simples).
- **Si los composers exportan tipos** publicos. Recomendado: solo si otro composer o el barrel los consume; sino, locales.

## 11. Forma del entregable

Commits sugeridos:

- `refactor(render): extrae composer entidad con metadatos y markup`
- `refactor(render): extrae composer estados con marcadores V-4 V-5 V-6 y Current`
- `refactor(render): extrae composer plegado parcial con dimensiones y filas`
- `refactor(render): extrae composer enlace con multiplicidad modificador y vertices`
- `refactor(render): extrae composer halos para seleccion y resaltado OPL`
- `refactor(render): extrae composer markers para fuente y destino por tipo`
- `refactor(render): extrae composer colores con luminancia para text contrast`
- `refactor(render): reduce proyeccion.ts a barrel agregador`
- `test(render): cubre composers entidad estados plegado enlace halos markers colores`

Co-author footer estandar si aplica.

NO tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`. Reportar:

- Hashes de commits.
- LOC final del barrel `proyeccion.ts` (objetivo < 200; tope < 600).
- LOC de cada composer.
- Resultado de `bun run check`, `browser:smoke`, `build`.
- Resultado del detector (debe ser >= 45 sin caida).
- Decisiones tomadas en §10.
- Bloqueos.

Si descubris bug fuera de scope (ej. fix render abanico), entregar como patch a `/tmp/` y NO commitear.
