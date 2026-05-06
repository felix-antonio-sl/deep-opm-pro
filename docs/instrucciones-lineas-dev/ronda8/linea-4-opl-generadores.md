# Linea 4 — Generadores OPL por familia

## 1. Mision

Romper `app/src/opl/generar.ts` (**1031 LOC**, 39 funciones) en generadores por familia OPL, conservando la API publica (`generarOpl`, `generarOplInteractivo`, `emitirDespliegueOcurren`, `emitirEspecializacion` si siguen exportados hoy) via barrel re-export. La forma OPCloud para este problema es **modulos de texto logico** (`opm-extracted/src/app/models/LogicalPart/components/aliasing-module.ts:5-32`, `units-text-module.ts:5-31`, `configurationsTextModule.ts`, `StereotypeModule.ts`, `LogicalTextModule.ts:93 LOC`) — cada modulo declara `getText()` y se compone para producir el render textual completo. Lo destilamos en **7 generadores por familia + 1 helpers**, siguiendo la division natural del SSOT OPM (D5-D8 designaciones, T1-T3 transiciones, TS1-TS3 despliegue, JOYAS §9 duracion, plegado parcial).

Cierre arquitectural: `opl/generar.ts` queda como **barrel agregador** (objetivo: < 200 LOC; tope absoluto: < 500 LOC); todo el codigo nuevo vive en `app/src/opl/generadores/<familia>.ts`. Las 16 reglas del detector que apuntan a `generar.ts` siguen matcheando porque el barrel mantiene strings clave (oraciones canonicas) o porque L6 recalibra (preferencia: barrel preserva).

**Slice minimo entregable**:

- 7 generadores nuevos en `app/src/opl/generadores/`:
  - `estructural.ts`: oraciones de enlaces estructurales (agregacion, exhibicion, generalizacion, instanciacion). Cubre SSOT D1-D4, T1-T3.
  - `procedural.ts`: oraciones de enlaces procedimentales (agente, instrumento, consumo, resultado, efecto, invocacion, auto-invocacion). Cubre SSOT TS1-TS3.
  - `designaciones.ts`: oraciones D5-D8 (estado inicial, final, default, current). Cubre HU-13.010-013, propuesta Current.
  - `refinamiento.ts`: oraciones de descomposicion y despliegue (`refines/refined-by/zooms-into/unfolds-into`). Cubre SSOT TS1, T1.
  - `duracionMetadata.ts`: oraciones de duracion canonica (JOYAS §9), unidad textual (`[°C]`), descripcion + alias inline (`, tambien iP`).
  - `abanico.ts`: oraciones de abanico OR/XOR (operador agrupador).
  - `plegado.ts`: oraciones de plegado parcial (`lista A y B como rasgos` + truncado `y N partes mas`).
  - `refsHints.ts`: helpers compartidos para `OplReferencia` y `OplTokenHint` (refs y hints son cross-cutting).
- Barrel `opl/generar.ts` (< 200 LOC) que re-exporta `generarOpl(modelo, opdId)` y `generarOplInteractivo(modelo, opdId)` orquestando los generadores.
- OPL queda como lente pura del modelo: los generadores solo importan desde `modelo/tipos`, `opl/interaccion`/`opl/tipos` y `opl/generadores/*`. NO importan desde `render/`, `render/jointjs/proyeccion.ts`, `JointCanvas.tsx` ni tipos de `JointCellJson`.
- `opl/generar.test.ts` (~46 KB) preservado intacto.
- Tests aditivos: `app/src/opl/generadores/<familia>.test.ts` con cobertura minima.

**Fuera de slice**:
- `opl/bloquesJerarquicos.ts` (existe ronda 7 — agrupa por OPD): NO se toca.
- `opl/interaccion.ts`: NO se toca.
- `PanelOpl.tsx`: NO se toca (territorio L5).
- `opl/generar.test.ts`: preservado.

## 2. Deudas que cierra

| Deuda | Path absoluto | Aporte |
|---|---|---|
| Monolito `opl/generar.ts` | `/home/felix/projects/deep-opm-pro/app/src/opl/generar.ts` (1031 LOC) | Reduce a < 200 LOC en barrel; 7 generadores < 250 LOC c/u. |
| 16 reglas del detector | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/tools/progress-dashboard.mjs:...` | Barrel preserva oraciones clave (`oracionEnlace`, `oracionEstados`, `, tambien `, `[°C]`); L6 recalibra si necesario. |
| HANDOFF "deuda tecnica `opl/generar.ts` 988 LOC" | `/home/felix/projects/deep-opm-pro/docs/HANDOFF.md` | Cierra deuda blanda. |

## 3. Anclaje a evidencia

- **SSOT** (justifica la particion):
  - `opm-opl-es.md §1 axiomas, §3-§4 estructurales, §5-§9 procedurales, §10 designaciones, §12 multiplicidad, §13 rutas, §17/Ap. A roundtrip`. Cada seccion del SSOT corresponde a un generador.
  - `opm-opl-es.md D5` (`X es el estado inicial de Y`), `D6` (`X es el estado final de Y`), `D7` (`X es el estado por defecto de Y`), `D8` (`Y puede ser X1, X2 o X3`). Familia "designaciones" tiene su propio archivo.
  - `opm-opl-es.md T1` (procedural inversion), `T2` (instrument condition), `T3` (consumption-result loop). Familia "procedural" tiene su propio archivo.
  - `opm-opl-es.md TS1` (despliegue tagged), `TS3` (transicion entre estados). Familia "refinamiento" + "procedural".
  - `opm-iso-19450-es.md §JOYAS §9`: formato canonico `${min}, ${nominal}, y ${max} ${unit} Duracion Minima, Esperada y Maxima de \`X\`, respectivamente.`. Familia "duracion" tiene su propio archivo.
  - `opm-iso-19450-es.md §Glos 3.7 alias`, `§Glos 3.4 atributo (unidad)`. Inclusion de alias `, tambien iP` en oraciones (HU-17.009) y unidad `[°C]` (HU-17.011/.012). Familia "duracionMetadata" cubre alias, unidad, descripcion inline.
  - `opm-iso-19450-es.md §Glos 3.81 despliegue`: tipos de despliegue (agregacion, exhibicion, generalizacion, instanciacion). Familia "refinamiento".
  - `opm-iso-19450-es.md §plegado parcial`: oraciones lista A y B como rasgos (HU-17.027, HU-18.010 truncado). Familia "plegado".
  - `opm-iso-19450-es.md §Glos 3.13 abanico operador OR/XOR`. Familia "abanico".
- **Corpus interno reusable**:
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/LogicalPart/components/aliasing-module.ts:5-32` — `AliasingModule.getText()` retorna `"{" + alias + "}"`. Patron canonico de **modulo de texto atomico**: cada concepto (alias, unit, descripcion) tiene su funcion `getText()`. Lo destilamos en `duracionMetadata.ts` con funciones `formatearAlias`, `formatearUnidad`, `formatearDescripcionInline`.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/LogicalPart/components/units-text-module.ts:5-31` — `UnitsTextModule.getText()` retorna `"[" + units + "]"`. Mismo patron.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/LogicalPart/components/configurationsTextModule.ts:1-24` — `ConfigurationsTextModule` con `getText()`. Confirma patron de modulos de texto pequenos (24 LOC).
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/LogicalPart/components/StereotypeModule.ts:1-50` — `StereotypeModule` con `getText()`. Otra prueba del patron.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/LogicalPart/LogicalTextModule.ts:1-93` — `BasicLogicalTextModule` y `BasicNameModule` agrupadores que orquestan modulos de texto. Confirma que existe **un agregador** que invoca los modulos en orden y compone la oracion final. Lo destilamos en barrel `generar.ts`.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/LogicalPart/OpmLogicalState.ts:1-231` — `OpmLogicalState` con metodos para designaciones (initial/final/default/current). Confirma que designaciones son dominio cerrado por estado, justifica `designaciones.ts`.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/components/commands/set-state-time-duration.ts:1-46` — `SetStateTimeDurationCommand` y action que abre popup de duracion. Patron de duracion canonica con unidades. Justifica `duracionMetadata.ts` con su propio formateador.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/components/commands/set-process-time-duration.ts:1-46` — analogo para procesos.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/dialogs/opl-dialog/opl-dialog.component.ts:1-50` — el panel OPL (UI) consume el OPL service. Confirma que la generacion es separada del display. Nuestro `PanelOpl.tsx` (L5) consume el barrel `opl/generar.ts`.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/modules/app/export-opl.service.ts:1-163` — `ExportOPLAPIService` para export. Patron de servicio de export que reusa los generadores.
  - Indirecta sobre formato OPL: una busqueda en `opm-extracted/src/` muestra menciones `oplDurationSuffixWord(unit)` en el bundle minificado (modules/attribute-validation/validation-module.ts:932,971). El sufijo de unidad temporal en OPL ingles termina en `sec/min/h/...`; en es-CL usamos `s/min/h/...` consistente con `opm-opl-es.md`.
- **Estado actual del codigo**:
  - `opl/generar.ts` (1031 LOC, 39 funciones): empieza con `generarOpl` (linea 17), `generarOplInteractivo` (55), `agregarLinea` (118). Funciones por dominio:
    - Abanico: `oracionesAbanicoInteractivo` (128), `oracionesAbanico` (147), `oracionAbanico` (161).
    - Procedural/ruta: `oracionEnlaceConRuta` (212), `oracionProcedimentalParaRuta` (219), `verboInteractivo` (648), `oracionEnlace` (672), `oracionEnlaceSinEtiqueta` (676).
    - Refinamiento: `oracionRefinamiento` (234), `oracionPlegadoParcial` (261), `oracionDespliegue` (276), `modoDespliegue` (286), `modoPorTipoEnlace` (297), `verboDespliegue` (597).
    - Estados: `oracionEstados` (332), `nombreEstadoOpl` (336), `oracionesUnidadDescripcionEstados` (341), `textoDesignacionEstado` (360), `transicionesEstado` (366), `transicionesEstadoInteractivo` (401).
    - Entidad: `oracionEntidad` (326).
    - Refs/Hints: `refsEnlace` (454), `hintsEnlace` (465), `refsAbanico` (480), `hintsAbanico` (489), `refsRefinamiento` (507), `hintsRefinamiento` (526), `refsEntidad` (606), `refEntidad` (610), `refEnlace` (614), `refEstado` (618), `hintEntidad` (622), `hintEstado` (631), `hintEnlace` (640).
    - Helpers internos: `aparienciasInternasDeRefinamiento` (305), `dentroDe` (313), `compararOrdenTemporal` (322).
  - Las funciones se agrupan naturalmente en 7 familias OPL + 1 archivo de refs/hints compartidos.

## 4. Archivos permitidos

```text
app/src/opl/generar.ts                                EDIT — reducir a barrel < 200 LOC
app/src/opl/generadores/estructural.ts                NUEVO
app/src/opl/generadores/estructural.test.ts           NUEVO
app/src/opl/generadores/procedural.ts                 NUEVO
app/src/opl/generadores/procedural.test.ts            NUEVO
app/src/opl/generadores/designaciones.ts              NUEVO
app/src/opl/generadores/designaciones.test.ts         NUEVO
app/src/opl/generadores/refinamiento.ts               NUEVO
app/src/opl/generadores/refinamiento.test.ts          NUEVO
app/src/opl/generadores/duracionMetadata.ts           NUEVO
app/src/opl/generadores/duracionMetadata.test.ts      NUEVO
app/src/opl/generadores/abanico.ts                    NUEVO
app/src/opl/generadores/abanico.test.ts               NUEVO
app/src/opl/generadores/plegado.ts                    NUEVO
app/src/opl/generadores/plegado.test.ts               NUEVO
app/src/opl/generadores/refsHints.ts                  NUEVO
app/src/opl/generadores/refsHints.test.ts             NUEVO
app/src/opl/generar.test.ts                           LECTURA (preservar intacto)
opm-extracted/**                                      LECTURA
docs/HANDOFF.md                                       LECTURA
/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/** LECTURA
```

NO tocar `opl/bloquesJerarquicos.ts`, `opl/interaccion.ts`. NO tocar `modelo/`, `serializacion/`, `render/`, `ui/`, `store/`, `canvas/`, `tipos.ts`, `vite.config.ts`.

## 5. Restricciones de no-colision

- **No tocar `opl/bloquesJerarquicos.ts`**: agrupa por OPD las oraciones; consume `OracionOpl[]` desde `generar.ts` sin enterarse de la particion interna.
- **No tocar `PanelOpl.tsx`** (territorio L5): consume `generarOplInteractivo` desde el barrel `opl/generar.ts`.
- **No importar render**: ningun archivo bajo `opl/generadores/` importa desde `render/`, `render/jointjs/proyeccion.ts` ni tipos visuales. Si necesitas un formateador parecido a render, duplicalo pequeno y puro en OPL o reportalo para consolidacion.
- **No tocar `opl/generar.test.ts`**: 1000+ LOC de tests cubriendo oraciones canonicas. Tras la particion debe pasar SIN tocar.
- **No reescribir tests existentes**.
- **No cambiar el formato OPL emitido**: oraciones canonicas tipo `\`X\` es el estado inicial de **Y**.` o `**Padre** lista **A** y **B** como rasgos.` no cambian. Los tests verifican strings exactos.
- **No tocar `tipos.ts`** ni cualquier modulo en `modelo/`. Generadores son puros — leen modelo, retornan strings + refs/hints.
- **No tocar `store.ts`** ni cualquier slice (territorio L1).
- **No introducir libreria de templating** (handlebars, mustache). Templates como template literals TS.
- **No tocar `vite.config.ts`** (territorio L6).

## 6. Slice minimo shippeable

### Patron canonico de generador

```ts
// app/src/opl/generadores/<familia>.ts
import type { Modelo, Enlace, Entidad, Estado, /*...*/ } from "../../modelo/tipos";
import type { OplLineaInteractiva, OplReferencia, OplTokenHint } from "../tipos";
import { refEnlace, refEntidad, hintEntidad, /*...*/ } from "./refsHints";

/**
 * Generador de oraciones OPL para la familia <X>.
 * Cubre SSOT: <citas explicitas con seccion>.
 *
 * Cada funcion toma modelo + entidad/enlace y retorna `string | null`
 * (oracion plana) o `OplLineaInteractiva` (con refs y hints).
 *
 * Consumidores: `opl/generar.ts` (barrel).
 */

export function oracion<X>(modelo: Modelo, /*args*/): string | null {
  // ...
}

export function oracion<X>Interactivo(modelo: Modelo, /*args*/): OplLineaInteractiva | null {
  // ...
}
```

### `generadores/refsHints.ts` (objetivo < 150 LOC)

Helpers compartidos por todos los generadores:
- `refsEnlace(modelo, enlace)`, `hintsEnlace(modelo, enlace, texto)`.
- `refsAbanico(modelo, abanico)`, `hintsAbanico(modelo, abanico, texto)`.
- `refsRefinamiento(modelo, apariencia, entidad)`, `hintsRefinamiento(modelo, apariencia, entidad)`.
- `refsEntidad(id)`, `refEntidad(id)`, `refEnlace(id)`, `refEstado(id)`.
- `hintEntidad(entidad, texto?)`, `hintEstado(estado)`, `hintEnlace(enlace, texto)`.
- `agregarLinea(lineas, texto, refs, hints)` — helper para construir `OplLineaInteractiva`.

Tests:
- `refEntidad("e1")` retorna `OplReferencia` valida con `tipo: "entidad"`.
- `hintEntidad(entidad)` con nombre largo recorta a 80 chars.

### `generadores/estructural.ts` (objetivo < 200 LOC)

Funciones:
- `oracionEnlaceEstructural(modelo, enlace): string | null` — agregacion, exhibicion, generalizacion, instanciacion.
- `oracionEnlaceEstructuralInteractivo(modelo, enlace): OplLineaInteractiva | null`.
- `oracionEntidad(entidad): string` (linea 326-332 actual).

Tests:
- Enlace agregacion `A -> B` produce `**A** consta de **B**.`.
- Enlace exhibicion `A -> B` produce `**A** exhibe **B**.`.
- Enlace generalizacion `A -> B` produce `**A** es un tipo de **B**.` (o segun SSOT).
- Enlace instanciacion `A -> B` produce `**A** es una instancia de **B**.`.

### `generadores/procedural.ts` (objetivo < 250 LOC)

Funciones:
- `oracionEnlaceProcedural(modelo, enlace): string | null` — agente, instrumento, consumo, resultado, efecto, invocacion, auto-invocacion.
- `oracionEnlaceProceduralInteractivo`.
- `oracionEnlaceConRuta`, `oracionProcedimentalParaRuta` (linea 212-234 actual).
- `verboInteractivo` (linea 648).
- `oracionEnlace`, `oracionEnlaceSinEtiqueta` (linea 672-694).
- `transicionesEstado(modelo, opd)` (linea 366-401) — enlaces consumo+resultado entre estados de mismo objeto.
- `transicionesEstadoInteractivo` (linea 401-454).

Tests:
- Enlace agente `Conductor -> Conducir` produce `**Conductor** maneja *Conducir*.`.
- Enlace consumo `Combustible -> Conducir` produce `*Conducir* consume **Combustible**.`.
- Enlace resultado `Conducir -> Distancia` produce `*Conducir* resulta en **Distancia**.`.
- Transicion estado `cargado -> Descarga -> descargado` produce oracion T3.

### `generadores/designaciones.ts` (objetivo < 150 LOC)

Funciones:
- `oracionDesignacionEstado(estado, entidad, designacion): string` — D5, D6, D7, propuesta Current.
- `oracionDesignacionEstadoInteractivo`.
- `textoDesignacionEstado(designacion: string): string` (linea 360 actual).
- `oracionEstados(entidad, estados): string` (linea 332 actual) — D8.

Tests:
- Estado `cargado` con `designaciones: ["inicial"]`: `\`cargado\` es el estado inicial de **Vehiculo**.` (D5).
- Estado con `["final"]`: D6.
- Estado con `["default"]`: D7.
- Estado con `["current"]`: propuesta `\`X\` es el estado actual de **Y**.`.
- Estado con `["inicial", "final"]`: emite ambas oraciones (HU-17.033).
- Objeto con 3 estados: `**Vehiculo** puede ser \`cargado\`, \`vacio\` o \`descargando\`.` (D8).

### `generadores/refinamiento.ts` (objetivo < 200 LOC)

Funciones:
- `oracionRefinamiento(modelo, apariencia, entidad)` (linea 234 actual) — descomposicion / despliegue.
- `oracionDespliegue(modelo, entidad, opdHijo, internos)` (linea 276 actual).
- `modoDespliegue(modelo, entidad, opdHijo)` (linea 286).
- `modoPorTipoEnlace(tipo)` (linea 297).
- `verboDespliegue(modo)` (linea 597) — agregacion / exhibicion / generalizacion / clasificacion.
- `aparienciasInternasDeRefinamiento(modelo, opdHijo, entidad)` (linea 305).
- `dentroDe(apariencia, contorno)` (linea 313).
- `compararOrdenTemporal(a, b)` (linea 322).

Tests:
- Descomposicion `Conducir` con sub-procesos `Acelerar`, `Frenar`: `*Conducir* consta de *Acelerar* y *Frenar*.`.
- Despliegue agregacion `Vehiculo` con partes `Motor`, `Chasis`: oracion canonica.
- Despliegue exhibicion: `*Vehiculo* exhibe **velocidad**.`.

### `generadores/duracionMetadata.ts` (objetivo < 150 LOC)

Funciones:
- `formatearDuracion(estado): string | null` — JOYAS §9 canonico: `${min}, ${nominal}, y ${max} ${unit} Duracion Minima, Esperada y Maxima de \`X\`, respectivamente.`.
- `formatearAliasInline(entidad): string` — `, tambien iP` (HU-17.009).
- `formatearUnidadInline(entidad): string` — `[°C]` (HU-17.011).
- `formatearDescripcionInline(entidad): string` — texto descriptivo opcional inline.
- `oracionesUnidadDescripcionEstados(entidad, estados): string[]` (linea 341 actual) — oraciones de unidad/descripcion de estados.
- `nombreEstadoOpl(estado): string` (linea 336).

Tests:
- Estado con `duracion: { unidad: "s", min: 1, nominal: 5, max: 10 }`: `1, 5, y 10 s Duracion Minima, Esperada y Maxima de \`X\`, respectivamente.`.
- Entidad con `alias: "iP"`: `formatearAliasInline` retorna `, tambien iP`.
- Entidad con `unidad: "°C"`: `formatearUnidadInline` retorna `[°C]`.
- Entidad sin `alias`: `formatearAliasInline` retorna `""`.

### `generadores/abanico.ts` (objetivo < 150 LOC)

Funciones:
- `oracionAbanico(modelo, abanico): string | null` (linea 161 actual).
- `oracionesAbanico(modelo, abanico): string[]` (linea 147).
- `oracionesAbanicoInteractivo(modelo, abanico)` (linea 128).

Tests:
- Abanico OR con 2 enlaces de tipo `instrumento`: oracion canonica de OR.
- Abanico XOR con 2 enlaces de tipo `consumo`: oracion canonica de XOR.

### `generadores/plegado.ts` (objetivo < 100 LOC)

Funciones:
- `oracionPlegadoParcial(modelo, apariencia, entidad)` (linea 261 actual) — `lista A y B como rasgos` + truncado `y N partes mas`.

Tests:
- Plegado parcial con 2 partes `A`, `B`: `**Padre** lista **A** y **B** como rasgos.`.
- Plegado parcial con 5 partes: `**Padre** lista **A**, **B** y 3 partes mas.` (HU-18.010).

### `opl/generar.ts` (barrel reducido)

```ts
// app/src/opl/generar.ts (objetivo < 200 LOC)
import type { Modelo, Id } from "../modelo/tipos";
import type { OplLineaInteractiva } from "./tipos";
import { agregarLinea } from "./generadores/refsHints";
import { oracionEntidad, oracionEnlaceEstructural } from "./generadores/estructural";
import { oracionEnlaceProcedural, transicionesEstado, oracionEnlaceConRuta } from "./generadores/procedural";
import { oracionDesignacionEstado, oracionEstados } from "./generadores/designaciones";
import { oracionRefinamiento, oracionDespliegue, aparienciasInternasDeRefinamiento } from "./generadores/refinamiento";
import { oracionPlegadoParcial } from "./generadores/plegado";
import { oracionesAbanico, oracionAbanico } from "./generadores/abanico";
import { oracionesUnidadDescripcionEstados, formatearAliasInline } from "./generadores/duracionMetadata";

export function generarOpl(modelo: Modelo, opdId: Id = modelo.opdRaizId): string[] {
  const lineas: string[] = [];
  // Orquestador: itera entidades, enlaces, abanicos, refinamientos
  // y delega a los generadores.
  // Mantener orden EXACTO al actual para preservar tests.
  return lineas;
}

export function generarOplInteractivo(modelo: Modelo, opdId: Id = modelo.opdRaizId): OplLineaInteractiva[] {
  const lineas: OplLineaInteractiva[] = [];
  // Orquestador interactivo (con refs y hints)
  return lineas;
}

export { emitirDespliegueOcurren, emitirEspecializacion } from "./generadores/refinamiento"; // si esas funciones eran publicas antes

// Re-exports si los tests u otros consumidores los necesitan.
```

### Garantia API publica

Verificar consumidores:

```bash
cd app && grep -rE "from \"\\.\\/opl\\/generar\"|from \"\\.\\.\\/opl\\/generar\"" src --include="*.ts" --include="*.tsx"
```

Asegurarse que `generarOpl`, `generarOplInteractivo`, `emitirDespliegueOcurren` y `emitirEspecializacion` (si aparecen en consumidores o tests) siguen funcionando exactamente igual.

## 7. Tests obligatorios

- Unit por generador (al menos 4-6 tests por generador, total ~30-40 nuevos).
- `opl/generar.test.ts` debe pasar **sin tocar** (regresion zero).
- Verificacion semantica: oraciones emitidas deben coincidir caracter-por-caracter con expectativas de tests existentes (los tests usan strings exactos).
- Equivalencia interactiva: para cada modelo/opd testeado, `generarOplInteractivo(modelo, opdId).map(linea => texto visible de linea)` debe ser igual a `generarOpl(modelo, opdId)`. Si el campo visible no se llama `texto` en el tipo actual, usar el extractor existente del test o helper local sin cambiar la API.

Casos especificos:
- Modelo simple objeto-proceso: oraciones estructurales + procedurales correctas.
- Modelo con designaciones: D5-D8 + propuesta Current.
- Modelo con duracion: oracion JOYAS §9.
- Modelo con plegado parcial 5 partes: truncado correcto.
- Modelo con abanico OR/XOR: oracion canonica.
- Modelo con descomposicion + despliegue: oraciones de refinamiento separadas.
- Roundtrip generarOpl + generarOplInteractivo: las lineas planas y las interactivas deben tener el mismo texto.

## 8. Verificacion

```bash
cd app
bun run check          # 481 + nuevos tests
bun run browser:smoke  # 40 actuales (PanelOpl debe seguir funcionando)
bun run build          # bundle
```

Verificacion adicional:

```bash
cd /home/felix/projects/deep-opm-pro
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
# detector >= 45 sin caida
```

## 9. Decisiones bloqueadas (no reabrir)

- **Patron barrel re-export**: `opl/generar.ts` debe seguir importable como `import { generarOpl, generarOplInteractivo } from "../opl/generar"` por todos los consumidores. Cualquier export publico adicional existente (`emitirDespliegueOcurren`, `emitirEspecializacion`) se conserva por re-export.
- **Formato OPL emitido**: oraciones canonicas no cambian. Tests verifican strings exactos.
- **Alias en OPL siempre tras primera mencion** (HU-17.009): `, tambien iP`.
- **Unidad textual en corchetes** (HU-17.011): `[°C]`.
- **Designaciones**: D5/D6/D7 SSOT + propuesta Current `\`X\` es el estado actual de **Y**.`.
- **Duracion JOYAS §9**: formato canonico no se altera.
- **Plegado parcial truncado a 3 partes inline + "y N partes mas"** (HU-18.010).
- **OPL es lente derivada**: no es fuente de verdad. Generadores son funciones puras `Modelo -> string[]`.
- **OPL no depende de render**: no importar `proyeccion`, `JointCellJson`, composers ni assets visuales. La direccion de dependencia es modelo -> OPL/UI, nunca render -> OPL ni OPL -> render.
- **Numeracion de oraciones por OPD** (cubierto por L3 ronda 7 — `bloquesJerarquicos.ts`): NO se altera.

## 10. Decisiones que tomas vos (documentar en commit)

- **Si `transicionesEstado`** (linea 366 actual) vive en `procedural.ts` (es loop consumo+resultado entre estados) o en `designaciones.ts` (toca estados). Recomendado: `procedural.ts` (consumo+resultado son procedurales; el estado solo es endpoint).
- **Si `formatearAliasInline` y `formatearUnidadInline`** viven en `duracionMetadata.ts` o en archivo `metadata.ts` separado. Recomendado: `duracionMetadata.ts` (todo lo metadata-textual junto).
- **Si `oracionesUnidadDescripcionEstados`** (line 341 actual, oraciones de unidad/descripcion sobre estados) vive en `duracionMetadata.ts` o en `designaciones.ts`. Recomendado: `duracionMetadata.ts` (unidad/descripcion son metadata).
- **Si `agregarLinea`** (helper de `OplLineaInteractiva`) vive en `refsHints.ts` o como helper privado del barrel. Recomendado: `refsHints.ts` (todos los helpers cross-cutting).
- **Si los generadores exportan tipos auxiliares**. Recomendado: NO; usan tipos del repo (`OplLineaInteractiva`, `OplReferencia`, `OplTokenHint`).
- **Si los tests adicionan o reemplazan tests existentes**. Recomendado: SOLO adicionar.
- **Como manejar `oracionEnlace` y `oracionEnlaceSinEtiqueta`** (linea 672, 676 actual): viven en `procedural.ts` o se reparten entre `estructural.ts` y `procedural.ts` segun tipo. Recomendado: en `procedural.ts` (la mayoria de tipos son procedurales; estructurales tienen su propio generador).
- **Si un helper parece comun a render y OPL**: mantenerlo local a OPL salvo que ya exista en modelo/OPL. No crear dependencia hacia L2. Si la duplicacion pequena molesta, documentarla para ronda 9.

## 11. Forma del entregable

Commits sugeridos:

- `refactor(opl): extrae generador estructural agregacion exhibicion generalizacion instanciacion`
- `refactor(opl): extrae generador procedural agente instrumento consumo resultado efecto invocacion`
- `refactor(opl): extrae generador designaciones D5 D6 D7 y propuesta current`
- `refactor(opl): extrae generador refinamiento descomposicion y despliegue`
- `refactor(opl): extrae generador duracion canonica JOYAS y metadata alias unidad`
- `refactor(opl): extrae generador abanico OR XOR`
- `refactor(opl): extrae generador plegado parcial con truncado`
- `refactor(opl): extrae helpers de refs y hints compartidos entre generadores`
- `refactor(opl): reduce generar.ts a barrel agregador con orquestadores generarOpl y generarOplInteractivo`
- `test(opl): cubre generadores estructural procedural designaciones refinamiento duracion abanico plegado`

Co-author footer estandar si aplica.

NO tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`. Reportar:

- Hashes de commits.
- LOC final del barrel `generar.ts` (objetivo < 200; tope < 500).
- LOC de cada generador.
- Resultado de `bun run check`, `browser:smoke`, `build`.
- Resultado del detector (>= 45 sin caida).
- Decisiones tomadas en §10.
- Bloqueos.

Si descubris bug fuera de scope (ej. oracion mal formada en algun caso edge), entregar como patch a `/tmp/` y NO commitear.
