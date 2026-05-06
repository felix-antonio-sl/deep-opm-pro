# Linea 3 — Validadores de serializacion por dominio

## 1. Mision

Romper `app/src/serializacion/json.ts` (**877 LOC**, 30+ helpers de validacion) en validadores por dominio canonico, conservando la API publica via barrel re-export. La forma OPCloud para este problema es **`JsonModel` clase de 611 LOC** (`opm-extracted/src/app/models/json.model.ts:5-611`) que concentra `toJson()` + `fromJson()` y delega validaciones por tipo. OPCloud lo tiene en una sola clase porque ese codigo es estable. En nuestro caso, post-ronda 7, los campos opcionales nuevos (`alias`, `unidad`, `descripcion`, `urls`, `designaciones`, `duracion`, `suprimido`, `layoutEstados`, `modoPlegado`, `versiones`, `archivado`, multiplicidad custom, etc.) hicieron crecer el archivo a 877 LOC y los helpers se mezclaron sin separacion clara. Lo destilamos en **6 validadores por dominio + 1 helpers**, manteniendo `serializacion/json.ts` como **barrel agregador**.

Cierre arquitectural: `serializacion/json.ts` queda como **barrel** (objetivo: < 200 LOC; tope absoluto: < 400 LOC); todo el codigo nuevo vive en `app/src/serializacion/<validador>.ts`. Las 11 reglas del detector que apuntan a `json.ts` siguen matcheando porque el barrel preserva strings clave o porque L6 recalibra (preferencia: barrel preserva).

**Slice minimo entregable**:

- 6 validadores nuevos en `app/src/serializacion/`:
  - `validarEntidades.ts`: `validarEntidades`, `camposEntidadAvanzada` (alias, unidad, descripcion, urls, layoutEstados).
  - `validarEstados.ts`: `validarEstados`, `validarDesignacionesEstado`, `validarDuracionEstado`.
  - `validarOpds.ts`: `validarOpds`, `validarRefinamiento`, `validarModoDespliegue`.
  - `validarApariencias.ts`: `validarApariencias`, `validarEstiloApariencia`, `validarParteExtraidaDe`, `validarModoPlegado`, `validarOrdenPartes`, `validarAparienciasEnlace`, `validarVertices`.
  - `validarEnlaces.ts`: `validarEnlaces`, `validarRutaEtiquetaOpcional`, `validarEstiloEnlaceOpcional`, `validarExtremoEnlace`, `validarMultiplicidadOpcional`, `validarDerivacionEnlace`, `validarAbanicos`.
  - `validarHelpers.ts`: type guards puros (`esRecord`, `esExtremoKind`, `esTipoEntidad`, `esEsencia`, `esAfiliacion`, `esTipoEnlace`, `esOperadorAbanico`, `esModoDespliegue`, `esNumeroFinito`, `esNumeroPositivo`, `esEnteroSeguro`), helpers de Resultado (`ok`, `fallo`), normalizadores (`normalizarEnlace`, `normalizarEstiloEnlace`, `normalizarVersiones`, `validarReferenciasOpd`, `endpointVisibleEnOpd`, `validarAparienciasExtraidas`, `modeloParaExtremos`).
- `validarHelpers.ts` NO puede convertirse en nuevo monolito. Si supera ~250 LOC o mezcla guards/normalizacion/integridad referencial, partirlo en `validarGuards.ts`, `validarNormalizacion.ts` y/o `validarIntegridad.ts` dentro de esta misma linea.
- Barrel `serializacion/json.ts` (< 200 LOC) que re-exporta `exportarModelo`, `hidratarModelo`, `carpetaIdDeJson` y orquesta `validarDocumento`/`validarModelo` consumiendo los validadores nuevos.
- Tipo publico preservado: `DocumentoModelo` sigue exportado desde `serializacion/json.ts` con el mismo shape.
- `serializacion/json.test.ts` preservado intacto (no reescribir).
- Tests aditivos por validador: `app/src/serializacion/<validador>.test.ts` con cobertura minima por dominio.

**Fuera de slice**:
- `persistencia/local.ts`, `persistencia/workspace.ts`, `persistencia/movimientoModelos.ts`, `persistencia/versiones.ts`, `persistencia/autosalvado.ts`: NO se tocan. Consumen `exportarModelo`/`hidratarModelo` desde el barrel sin cambios.
- `tipos.ts`: NO se toca.
- Migracion a Zod o validadores de runtime libreria: descartado (regla de no introducir deps).

## 2. Deudas que cierra

| Deuda | Path absoluto | Aporte |
|---|---|---|
| Monolito `serializacion/json.ts` | `/home/felix/projects/deep-opm-pro/app/src/serializacion/json.ts` (877 LOC) | Reduce a < 200 LOC en barrel; 6 validadores < 250 LOC c/u. |
| 11 reglas del detector | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/tools/progress-dashboard.mjs:...` | Barrel preserva strings clave; L6 recalibra reglas que apunten a archivos nuevos si necesario. |
| HANDOFF "deuda tecnica `serializacion/json.ts` 877 LOC" | implicito en HANDOFF (no listado pero detectable por tamano) | Cierra deuda blanda. |

## 3. Anclaje a evidencia

- **SSOT** (justifica la particion):
  - `opm-iso-19450-es.md §Glos 3.7 alias`, `§Glos 3.4 atributo (unidad)`, `§Glos 3.68 estado`, `§Glos 3.71a designaciones`. Cada concepto es un dominio independiente — su validador puede vivir aislado.
  - `opm-iso-19450-es.md §OPD tree`, `§refinamiento`. Justifica `validarOpds.ts` separado (incluye `validarRefinamiento`, `validarModoDespliegue`).
  - `opm-iso-19450-es.md §Glos 3.81 despliegue`, `§Glos 3.83 enlace`, `§multiplicidad`. Justifica `validarEnlaces.ts` separado.
  - `opm-iso-19450-es.md §Glos 3.45 estado-funcion` (intersection de estados con aspectos), justifica `validarEstados.ts` con sub-helpers para designaciones y duracion.
- **Corpus interno reusable**:
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/json.model.ts:1-611` — `JsonModel` con `toJson(changeIds, justForLogs, removeSubModelsParts)` (linea 15-167) y `fromJson(opmModelJson, validityCheckingMode)` (linea 167-373) y helpers privados `createNewLogicalElement`, `createNewVisualElement`, `fixOpdsHierarchy`, `switchIdsOfJsonModel`. Patron: **clase orquestadora con toJson/fromJson + helpers privados por dominio**. Lo destilamos en barrel + validadores; nuestra ventaja es que TS strict + tipos disjuntos hace innecesario un orquestador clase.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/OpmModel.ts:6-25` — `OpmModel extends BasicOpmModel` con `this.json = new JsonModel(this)` (linea 8). `JsonModel` se compone via instancia, no es estatico. Confirmacion empirica: la serializacion como subsistema cohesivo merece separacion. Nuestro barrel + validadores es la version funcional pura del mismo patron.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/BasicOpmModel.ts:1-100` — `BasicOpmModel` con metodos basicos del modelo. La separacion `BasicOpmModel` / `OpmModel` es analoga a nuestro `tipos.ts` (esquema) / `serializacion/json.ts` (validacion + parsing).
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/OpmModelMetaData.ts` — metadata del modelo separada del esquema basico. Justifica que `validarModeloMetadata` (versiones, archivado, dirty flags) podria ir como sub-helper en `validarHelpers.ts` o en `validarEntidades.ts` (segun dependa del nivel).
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/components/ElementsMap.ts:1-19` — `ElementsMap` mapa de id->elemento. Patron de **resolver de referencias post-load**. Nuestro `validarReferenciasOpd` (linea 740 actual) cumple lo mismo y queda en `validarHelpers.ts`.
- **Estado actual del codigo**:
  - `serializacion/json.ts` (877 LOC, 30+ funciones): empieza con `interface DocumentoModelo` (linea 41), `exportarModelo` (47), `hidratarModelo` (56), `carpetaIdDeJson` (73). Helpers: `normalizarModelo` (83), `normalizarEnlace` (128), `normalizarEstiloEnlace` (140), `validarDocumento` (149), `validarModelo` (156), `validarAbanicos` (204), `validarEntidades` (259), `camposEntidadAvanzada` (287), `validarEstados` (320), `validarDesignacionesEstado` (380), `validarDuracionEstado` (392), `validarRefinamiento` (410), `validarModoDespliegue` (424), `validarOpds` (430), `validarApariencias` (465), `validarEstiloApariencia` (507), `validarParteExtraidaDe` (522), `validarModoPlegado` (536), `validarOrdenPartes` (542), `validarAparienciasEnlace` (548), `validarVertices` (563), `validarEnlaces` (575), `validarRutaEtiquetaOpcional` (644), `validarEstiloEnlaceOpcional` (650), `normalizarVersiones` (669), `validarExtremoEnlace` (693), `validarMultiplicidadOpcional` (713), `validarDerivacionEnlace` (723), `validarReferenciasOpd` (740), `endpointVisibleEnOpd` (778), `validarAparienciasExtraidas` (788), `modeloParaExtremos` (803), helpers (816-875).
  - Las funciones se agrupan naturalmente en 6 dominios + helpers (validar entidad, estado, opd, apariencia, enlace + helpers utilitarios).
  - `exportarModelo` (47-55) es de 8 LOC: `JSON.stringify({ schema, modelo, carpetaId })` con `normalizarModelo`. Permanece en barrel.
  - `hidratarModelo` (56-73) es de ~17 LOC: parse JSON + `validarDocumento` + extraccion modelo. Permanece en barrel.
  - `carpetaIdDeJson` (73-83) es de 10 LOC. Permanece en barrel.

## 4. Archivos permitidos

```text
app/src/serializacion/json.ts                       EDIT — reducir a barrel < 200 LOC
app/src/serializacion/validarEntidades.ts           NUEVO
app/src/serializacion/validarEntidades.test.ts      NUEVO
app/src/serializacion/validarEstados.ts             NUEVO
app/src/serializacion/validarEstados.test.ts        NUEVO
app/src/serializacion/validarOpds.ts                NUEVO
app/src/serializacion/validarOpds.test.ts           NUEVO
app/src/serializacion/validarApariencias.ts         NUEVO
app/src/serializacion/validarApariencias.test.ts    NUEVO
app/src/serializacion/validarEnlaces.ts             NUEVO
app/src/serializacion/validarEnlaces.test.ts        NUEVO
app/src/serializacion/validarHelpers.ts             NUEVO
app/src/serializacion/validarHelpers.test.ts        NUEVO
app/src/serializacion/validarGuards.ts              NUEVO opcional si helpers crece
app/src/serializacion/validarGuards.test.ts         NUEVO opcional
app/src/serializacion/validarNormalizacion.ts       NUEVO opcional si helpers crece
app/src/serializacion/validarNormalizacion.test.ts  NUEVO opcional
app/src/serializacion/validarIntegridad.ts          NUEVO opcional para checks cross-domain
app/src/serializacion/validarIntegridad.test.ts     NUEVO opcional
app/src/serializacion/json.test.ts                  LECTURA (preservar intacto)
opm-extracted/**                                    LECTURA
docs/HANDOFF.md                                     LECTURA
/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/** LECTURA
```

NO tocar `persistencia/`, `modelo/`, `render/`, `opl/`, `ui/`, `store/`, `canvas/`, `tipos.ts`, `vite.config.ts`.

## 5. Restricciones de no-colision

- **No tocar `tipos.ts`**: validadores consumen tipos desde `tipos.ts` sin modificar. Si un validador necesita un tipo helper (ej. resultado de validacion intermedio), lo define LOCAL al modulo y no lo exporta.
- **No tocar `modelo/operaciones.ts`** ni cualquier modulo en `modelo/`: validadores son puros — no invocan operaciones de modelo.
- **No tocar `persistencia/local.ts`** ni `workspace.ts` ni nada en `persistencia/`. Consumen el barrel `serializacion/json.ts` y NO se enteran de la particion.
- **No tocar barrel L1 (`store.ts`)**, L2 (`proyeccion.ts`), L4 (`opl/generar.ts`). Esta linea es 100% serializacion.
- **No tocar `serializacion/json.test.ts`**: 40+ tests que cubren roundtrip lossless. Tras la particion deben pasar SIN tocar.
- **No reescribir tests existentes** ni cambiar su estructura.
- **No introducir Zod, Yup, io-ts, ni librerias de validacion**. Validadores usan TS strict + type guards manuales (ya estilo del repo).
- **No cambiar el formato JSON emitido por `exportarModelo`** ni el formato aceptado por `hidratarModelo`. Roundtrip lossless es contrato.
- **No perder API publica**: `DocumentoModelo`, `exportarModelo`, `hidratarModelo`, `carpetaIdDeJson` siguen importables desde `serializacion/json.ts`. Si un consumidor importaba accidentalmente otro helper, re-export temporal y documentar el call site.
- **No cambiar orden/campos normalizados**: `normalizarModelo`, normalizadores de enlace/versiones y `JSON.stringify` deben emitir los mismos campos para modelos equivalentes. Si un helper se mueve, su salida debe ser deep-equal.
- **No tocar `vite.config.ts`** (territorio L6).

## 6. Slice minimo shippeable

### Patron canonico de validador

```ts
// app/src/serializacion/validar<Dominio>.ts
import type { /*tipos*/ } from "../modelo/tipos";
import type { Resultado } from "../modelo/resultado"; // o donde vive
import { ok, fallo, esRecord, /*...*/ } from "./validarHelpers";

/**
 * Validadores para el dominio <X> del JSON OPM.
 *
 * Cada funcion toma `unknown` y retorna `Resultado<T>` — nunca lanza.
 * Consumidores: `serializacion/json.ts` (barrel).
 */

export function validar<X>(value: unknown, /*contexto*/): Resultado<<X>> {
  if (!esRecord(value)) return fallo("se esperaba objeto");
  // ... validaciones
  return ok(/* objeto validado */);
}

// Helpers privados (no exportados).
function _helperPrivado(/* */): /* */ { /* ... */ }
```

### `validarHelpers.ts` (objetivo < 150 LOC; tope 250 LOC)

Helpers consumidos por todos los demas validadores:
- `ok<T>(value: T): Resultado<T>`, `fallo(error: string): Resultado<never>`.
- Type guards: `esRecord`, `esExtremoKind`, `esTipoEntidad`, `esEsencia`, `esAfiliacion`, `esTipoEnlace`, `esOperadorAbanico`, `esModoDespliegue`, `esNumeroFinito`, `esNumeroPositivo`, `esEnteroSeguro`.
- Helpers de modelo: `validarReferenciasOpd(modelo)`, `endpointVisibleEnOpd(modelo, opd, extremo)`, `validarAparienciasExtraidas(modelo, opd)`, `modeloParaExtremos(entidades, estados)`.
- Normalizadores: `normalizarEnlace(enlace)`, `normalizarEstiloEnlace(value)`, `normalizarVersiones(value)`.

Si estos tres grupos juntos superan el tope, mover:
- type guards a `validarGuards.ts`;
- normalizadores a `validarNormalizacion.ts`;
- integridad referencial a `validarIntegridad.ts`.
El barrel de serializacion importa desde esos archivos; `validarHelpers.ts` no queda como "helpers de todo".

Tests:
- `esRecord(null)` false; `esRecord({})` true; `esRecord([])` false.
- `esTipoEntidad("objeto")` true; `esTipoEntidad("foo")` false.
- `esNumeroFinito(NaN)` false; `esNumeroFinito(Infinity)` false; `esNumeroFinito(0)` true.
- `validarReferenciasOpd` con OPD que apunta a entidad inexistente retorna fallo.
- `normalizarVersiones` con array invalido retorna `[]`.

### `validarEntidades.ts` (objetivo < 200 LOC)

Funciones absorbidas de `json.ts:259-320`:
- `validarEntidades(value: Record<string, unknown>): Resultado<Record<Id, Entidad>>`.
- `camposEntidadAvanzada(entidadId: Id, raw: Record<string, unknown>): Resultado<Partial<Entidad>>` (alias, unidad, descripcion, urls, layoutEstados).

Tests:
- Entidad valida con `tipo: "objeto"`, `nombre`, `esencia`, `afiliacion` retorna ok.
- Entidad sin `nombre` retorna fallo.
- Entidad con `alias: "iP"` se preserva.
- Entidad con `urls: [{ id, url, tipo: "imagen" }]` se preserva.
- Entidad legacy sin campos opcionales se hidrata sin error y queda con `undefined`.
- `camposEntidadAvanzada` con `urls: "no-array"` retorna fallo.

### `validarEstados.ts` (objetivo < 200 LOC)

Funciones absorbidas de `json.ts:320-410`:
- `validarEstados(value: unknown, entidades: Record<Id, Entidad>): Resultado<Record<Id, Estado>>`.
- `validarDesignacionesEstado(estadoId: Id, value: unknown): Resultado<DesignacionEstado[]>`.
- `validarDuracionEstado(estadoId: Id, value: unknown): Resultado<DuracionTemporal | undefined>`.

Tests:
- Estado con `entidadId` valida + `nombre` retorna ok.
- Estado con `designaciones: ["inicial"]` se preserva.
- Estado con `designaciones: ["default", "current"]` retorna fallo (excluyentes — HU-13.013 Q13.2).
- Estado con `duracion: { unidad: "s", min: 1, nominal: 5, max: 10 }` valida.
- Estado con `duracion: { min: 5, nominal: 1, max: 10 }` retorna fallo (`min > nominal`).
- Estado legacy sin `designaciones`/`duracion`/`suprimido` carga sin error.

### `validarOpds.ts` (objetivo < 150 LOC)

Funciones absorbidas de `json.ts:410-465`:
- `validarOpds(value: Record<string, unknown>, entidades: Record<Id, Entidad>): Resultado<Record<Id, Opd>>`.
- `validarRefinamiento(entidadId: Id, value: unknown): Resultado<RefinamientoEntidad | undefined>`.
- `validarModoDespliegue(entidadId: Id, value: unknown): Resultado<ModoDespliegueObjeto>`.

Tests:
- OPD raiz `SD` valida.
- OPD con `parendId` apuntando a OPD inexistente retorna fallo.
- OPD con `refinamiento.tipo: "descomposicion"` retorna ok.
- OPD con `refinamiento.tipo: "despliegue"` y `modo: "agregacion"` retorna ok.

### `validarApariencias.ts` (objetivo < 250 LOC)

Funciones absorbidas de `json.ts:465-575`:
- `validarApariencias(value: Record<string, unknown>, entidades: Record<Id, Entidad>): Resultado<Record<Id, Apariencia>>`.
- `validarEstiloApariencia(value: unknown): Resultado<EstiloApariencia | undefined>`.
- `validarParteExtraidaDe(aparienciaId: Id, value: unknown): Resultado<Id | undefined>`.
- `validarModoPlegado(aparienciaId: Id, value: unknown): Resultado<ModoPlegado>`.
- `validarOrdenPartes(aparienciaId: Id, value: unknown): Resultado<OrdenPartesPlegado | undefined>`.
- `validarAparienciasEnlace(opdId: Id, value: Record<string, unknown>): Resultado<Record<Id, AparienciaEnlace>>`.
- `validarVertices(aparienciaId: Id, value: unknown[]): Resultado<Array<{ x: number; y: number }>>`.

Tests:
- Apariencia con `entidadId` + `posicion` valida.
- Apariencia con `modoPlegado: "parcial"` se preserva.
- Apariencia con `vertices: [{x:1,y:2}, {x:3,y:4}]` se preserva.
- AparienciaEnlace con `vertices` invalidos retorna fallo.
- Estilo apariencia con `fill: "#FF0000"`, `borderColor: "#000"` valida.
- Estilo apariencia con `fontSize: -5` retorna fallo.

### `validarEnlaces.ts` (objetivo < 250 LOC)

Funciones absorbidas de `json.ts:575-740`:
- `validarEnlaces(value: Record<string, unknown>, entidades: Record<Id, Entidad>, estados: Record<Id, Estado>): Resultado<Record<Id, Enlace>>`.
- `validarRutaEtiquetaOpcional(enlaceId: Id, value: unknown): Resultado<string | undefined>`.
- `validarEstiloEnlaceOpcional(enlaceId: Id, value: unknown): Resultado<Enlace["estilo"]>`.
- `validarExtremoEnlace(enlaceId: Id, lado: string, value: unknown, modelo: Modelo): Resultado<ExtremoEnlace>`.
- `validarMultiplicidadOpcional(enlaceId: Id, value: unknown): Resultado<string | undefined>`.
- `validarDerivacionEnlace(enlaceId: Id, value: unknown): Resultado<DerivacionEnlace | undefined>`.
- `validarAbanicos(value: unknown, enlaces: Record<Id, Enlace>): Resultado<Record<Id, Abanico>>`.

Tests:
- Enlace con `tipo: "agregacion"`, `origen: { kind: "entidad", id: "e1" }`, `destino: { kind: "entidad", id: "e2" }` valida.
- Enlace con `multiplicidad: "1..N"` valida.
- Enlace con `multiplicidad: "abc"` retorna fallo (no es canonica ni custom valida).
- Enlace con `estilo: { color: "#FF0000", strokeWidth: 3, dashArray: "4 1" }` valida.
- Abanico con `operador: "or"` y `enlaces: ["e1", "e2"]` valida.
- Abanico con enlaces de tipos distintos retorna fallo.

### `serializacion/json.ts` (barrel reducido)

```ts
// app/src/serializacion/json.ts (objetivo < 200 LOC)
import type { Modelo } from "../modelo/tipos";
import type { Resultado } from "../modelo/resultado";
import {
  ok, fallo, esRecord,
  normalizarModelo, normalizarEnlace, normalizarEstiloEnlace, normalizarVersiones,
  validarReferenciasOpd, endpointVisibleEnOpd, validarAparienciasExtraidas, modeloParaExtremos,
} from "./validarHelpers";
import { validarEntidades } from "./validarEntidades";
import { validarEstados } from "./validarEstados";
import { validarOpds } from "./validarOpds";
import { validarApariencias, validarAparienciasEnlace } from "./validarApariencias";
import { validarEnlaces, validarAbanicos } from "./validarEnlaces";

export interface DocumentoModelo {
  schema: string;
  modelo: Modelo;
  carpetaId?: Id | null;
}

export function exportarModelo(modelo: Modelo, carpetaId?: Id | null): string {
  return JSON.stringify({ schema: "deep-opm-pro.modelo.v1", modelo: normalizarModelo(modelo), carpetaId: carpetaId ?? null });
}

export function hidratarModelo(json: string): Resultado<Modelo> {
  // Parse + validar
  let parsed: unknown;
  try { parsed = JSON.parse(json); } catch { return fallo("JSON invalido"); }
  const docResult = validarDocumento(parsed);
  if (!docResult.ok) return docResult;
  return ok(docResult.value.modelo);
}

export function carpetaIdDeJson(json: string): Id | null {
  try {
    const parsed = JSON.parse(json) as { carpetaId?: Id | null };
    return parsed.carpetaId ?? null;
  } catch { return null; }
}

function validarDocumento(value: unknown): Resultado<DocumentoModelo> {
  if (!esRecord(value)) return fallo("se esperaba documento objeto");
  // ... validacion de schema + delegacion a validarModelo
}

function validarModelo(value: unknown): Resultado<Modelo> {
  // Orquestador: invoca validarEntidades, validarEstados, validarOpds, validarApariencias, validarEnlaces, validarAbanicos
  // y luego validarReferenciasOpd para integridad referencial.
  // ...
}

// Re-exports compatibilidad rondas 1-7:
// (lo que persistencia/local.ts y workspace.ts consuman)
```

### Garantia API publica

Verificar consumidores:

```bash
cd app && grep -rE "from \"\\.\\/serializacion\\/json\"|from \"\\.\\.\\/serializacion\\/json\"|from \"@app\\/serializacion\\/json\"" src --include="*.ts" --include="*.tsx"
```

Asegurarse que `exportarModelo`, `hidratarModelo`, `carpetaIdDeJson` siguen funcionando. Si algun consumidor importaba un nombre interno (no publico), restaurar como re-export.

## 7. Tests obligatorios

- Unit por validador (al menos 4-6 tests por validador, total ~25-35 nuevos).
- `serializacion/json.test.ts` debe pasar **sin tocar** (regresion zero).
- Roundtrip lossless: cargar modelo legacy (sin campos opcionales nuevos) y un modelo full (con todos los campos) y verificar `hidratar(exportar(modelo)) === modelo`.
- Golden JSON: para fixtures existentes, `exportarModelo` debe conservar schema, `carpetaId`, campos opcionales, orden normalizado donde los tests lo observen y aceptacion de legacy. No introducir defaults nuevos salvo que el comportamiento actual ya los aplique.

Casos especificos a cubrir en tests aditivos:
- Modelo legacy sin `entidad.alias`, `entidad.urls`, `estado.designaciones`, etc.: hidrata sin error, queda con `undefined`.
- Modelo full con todos los campos opcionales: roundtrip lossless.
- Modelo con `designaciones: ["default", "current"]` rechaza con error explicito.
- Modelo con `duracion: { unidad: "fortnights", min: 1, nominal: 5, max: 10 }` rechaza.
- Modelo con OPD raiz `SD` apuntando a entidad inexistente rechaza.
- Modelo con `apariencia.modoPlegado: "parcial"` y `apariencia.partes` vacio: define recomendacion (probablemente warning en lugar de fallo, segun comportamiento actual).

## 8. Verificacion

```bash
cd app
bun run check          # 481 tests + nuevos
bun run browser:smoke  # 40 actuales
bun run build          # bundle
```

Verificacion adicional:

```bash
cd /home/felix/projects/deep-opm-pro
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

## 9. Decisiones bloqueadas (no reabrir)

- **Patron barrel re-export**: `serializacion/json.ts` debe seguir importable como `import { exportarModelo, hidratarModelo, carpetaIdDeJson } from "../serializacion/json"` por todos los consumidores (`persistencia/local.ts`, `workspace.ts`, `versiones.ts`, `movimientoModelos.ts`, etc.).
- **Tipo publico `DocumentoModelo`**: sigue exportado desde `serializacion/json.ts` si hoy algun consumidor o test lo importa. No moverlo a archivo interno sin re-export.
- **Schema JSON emitido**: el formato `{ schema: "deep-opm-pro.modelo.v1", modelo: {...}, carpetaId: ... }` no cambia.
- **Modelo legacy carga sin error**: campos opcionales ausentes hidratan a `undefined` o defaults seguros (`suprimido: false`, etc.).
- **Roundtrip lossless es contrato**: `hidratar(exportar(m)) === m` deep equal para todos los modelos validos.
- **Default y Current excluyentes** (HU-13.013 Q13.2): un estado con ambos rechaza al hidratar.
- **Inicial y Final coexisten** (HU-17.033): un estado con `["inicial", "final"]` valida.
- **Multiplicidad canonica + custom**: `["1", "0..1", "N", "0..N", "*"]` + custom regex (heredado ronda 6).
- **OPD raiz `SD`**: existe siempre; eliminado al hidratar es fallo.
- **Sin Zod, Yup, io-ts**: validacion manual con type guards puros TS strict.
- **`Resultado<T>` patron**: `{ ok: true, value: T } | { ok: false, error: string }`. NO cambiar a `Either`, `Maybe`, ni promesas.

## 10. Decisiones que tomas vos (documentar en commit)

- **Si `validarHelpers.ts` exporta SOLO type guards y Resultado helpers**, o tambien las validaciones cross-domain (`validarReferenciasOpd`, `endpointVisibleEnOpd`). Recomendado: helpers pequeno y seccionado; si el archivo pasa ~250 LOC o mezcla demasiados dominios, crear `validarIntegridad.ts`, `validarGuards.ts` o `validarNormalizacion.ts`.
- **Si `validarAbanicos`** (currently en json.ts:204) vive en `validarEnlaces.ts` o en archivo propio. Recomendado: en `validarEnlaces.ts` (los abanicos son agrupacion de enlaces; un archivo por dominio funcional).
- **Si los validadores exportan tipos auxiliares** (ej. `Resultado<EntidadValidada>` con campo extra). Recomendado: NO exportar tipos auxiliares; los validadores devuelven tipos del repo (`Entidad`, `Estado`, etc.).
- **Si normalizadores** (`normalizarEnlace`, `normalizarEstiloEnlace`) viven en `validarHelpers.ts` o en sus archivos de dominio. Recomendado: en `validarHelpers.ts` (son utilidades cross-domain).
- **Si `validarDocumento` y `validarModelo`** (orquestadores) viven en barrel `json.ts` o se promueven a archivo propio (`validarDocumento.ts`). Recomendado: en barrel (son orquestadores publicos minimos).
- **Si los tests adicionan o reemplazan tests existentes**. Recomendado: SOLO adicionar; tests de `json.test.ts` no se tocan.
- **Como manejar el fallo de un validador anidado** en el orquestador `validarModelo`. Recomendado: short-circuit con primer fallo (ya es comportamiento actual).

## 11. Forma del entregable

Commits sugeridos:

- `refactor(serializacion): extrae validar entidades con campos opcionales avanzados`
- `refactor(serializacion): extrae validar estados con designaciones y duracion`
- `refactor(serializacion): extrae validar opds con refinamiento y modo despliegue`
- `refactor(serializacion): extrae validar apariencias con plegado vertices y estilo`
- `refactor(serializacion): extrae validar enlaces multiplicidad estilo extremos abanicos`
- `refactor(serializacion): extrae validar helpers con type guards y normalizadores`
- `refactor(serializacion): reduce json.ts a barrel agregador con orquestador minimo`
- `test(serializacion): cubre validadores entidades estados opds apariencias enlaces helpers`

Co-author footer estandar si aplica.

NO tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`. Reportar:

- Hashes de commits.
- LOC final del barrel `json.ts` (objetivo < 200; tope < 400).
- LOC de cada validador.
- Resultado de `bun run check`, `browser:smoke`, `build`.
- Resultado del detector (debe ser >= 45 sin caida).
- Decisiones tomadas en §10.
- Bloqueos.

Si descubris bug fuera de scope (ej. campo opcional nuevo no validado correctamente desde ronda 7), entregar como patch a `/tmp/` y NO commitear.
