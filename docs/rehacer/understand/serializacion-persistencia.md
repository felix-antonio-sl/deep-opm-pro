# Dossier — `app/src/serializacion` + `app/src/persistencia`

Área: formato JSON persistido del modelo OPM, validadores de hidratación, perfiles de
export, paquete portátil, persistencia local (IndexedDB/Cache Storage), cliente HTTP
remoto (modelos, workspace, versiones, autosave, sesión, agente, revisión), cola de
sincronización y conflictos, workspace y carpetas.

Estado estudiado: `main` en `8ada528` (2026-09-30). Todo lo afirmado se leyó en el
código; los dos hallazgos marcados **[verificado]** se reprodujeron con un test
exploratorio en el scratchpad (no se tocó el repo).

---

## 0. Resumen ejecutivo

- **Tamaño**: `serializacion/` 3.633 líneas fuente + 4.317 de tests; `persistencia/`
  3.644 fuente + 1.579 tests. De `persistencia/`, ~1.500 líneas (localRepository,
  syncQueue, agentClient, reviewClient, readerCache, documentMigration,
  humanChangeClient) entraron en **un solo commit** (`8ada528`, 24,7k líneas en 194
  archivos, hoy mismo). Es la capa menos probada por uso humano real.
- **Contrato duro**: un solo formato de documento, `deep-opm-pro.modelo.v0`, sin JSON
  Schema, definido solo por los tipos TS (`modelo/tipos/*`) y por los validadores
  whitelist de `serializacion/`. La hidratación es **todo o nada**: el primer error
  rechaza el documento completo.
- **Núcleo de alta calidad que conviene portar**: `validarEnlaces` + `validarFirmaEnlace`
  (firma OPM de los 15 tipos de enlace), `validarEstados` (axioma de ≥2 estados,
  designaciones), `validarAbanicos`/`validarAbanicoCanonico`, `integridadReferencial`,
  `canonicalJson`+SHA-256 del paquete portátil, `politicaVersiones`, `movimientoModelos`
  (movimiento sin ciclos) y la transacción IndexedDB de un solo registro.
- **Problemas de fondo**:
  1. **No hay forma canónica real.** `exportarModelo(m)` ≠
     `exportarModelo(hidratarModelo(exportarModelo(m)))` en todos los fixtures no
     triviales **[verificado]** (la hidratación materializa `modoPlegado: "completo"`).
     Además el servidor guarda el documento como `JSONB` y lo devuelve como
     `payload::text`, con las claves reordenadas. Por eso el código canonicaliza con
     `hidratar→exportar` en decenas de sitios antes de comparar strings o calcular hashes.
  2. **Validación de multiplicidad bifurcada** **[verificado]**:
     `modelo/enlaceMultiplicidad.ts:14` acepta `"?"`, pero `modelo/operaciones/enlaces.ts:53`
     (el que usa la hidratación) lo rechaza. `fijarMultiplicidadOrigen(m, e, "?")` da `ok`,
     y el JSON que resulta **ya no hidrata** (`Enlace inválido: e-19.multiplicidadOrigen`).
     Hoy solo lo evita que la UI filtra antes con la versión estricta.
  3. **Tres mecanismos de guardado superpuestos**: la revisión confirmada (POST
     `/revisiones`), el autosave remoto cada 5 min (otra tabla, con una "base dual"
     saved/autosave y un testigo) y la copia local-first en IndexedDB con journal y sync
     manual. A eso se suman las versiones (snapshots) y, dentro del documento OPM, campos
     de catálogo como `versiones`, `archivado` y `crearVersionAlGuardar`.
  4. **Journal local sin poda**: cada edición encola un checkpoint que agrega **un
     snapshot completo** al `journal` y reserializa hasta 100 modelos de undo en `history`
     (`store/runtime.ts:1178,1297-1327`, `localRepository.ts:221-243`). Nada poda el
     journal, así que el registro de IndexedDB crece O(ediciones × tamaño del modelo).
  5. **`carpetaId` vive en tres lugares** (dentro del JSON del documento, en
     `ModeloPersistido.carpetaId` y en `ModeloIndice.carpetaId`), y lo mismo pasa con
     `versiones`, `archivado` y `descripcion`.

---

## 1. Inventario de módulos

### 1.1 `serializacion/`

| Archivo | LOC | Propósito | Consumidores | Veredicto |
|---|---:|---|---|---|
| `json.ts` | 196 | Formato `deep-opm-pro.modelo.v0`: `exportarModelo`, `hidratarModelo`, `carpetaIdDeJson`, orquesta `validarModelo` | ~60 sitios: store, server (agent, review), mesa, autoria, render headless, UI | **KEEP** (núcleo). Simplificar la orquestación |
| `validarGuards.ts` | 60 | Type guards de enums (`esTipoEnlace`, `esEsencia`…) | validadores | KEEP. Derivar de arrays `as const` en vez de repetir literales |
| `validarHelpers.ts` | 19 | `ok`/`fallo` + re-export de guards | validadores | SIMPLIFY (fusionar) |
| `validarIntegridad.ts` | 7 | Re-export de `modelo/integridadReferencial` ("superficie de import existente") | `json.ts`, `validarEnlaces.ts` | **CUT** (indirección sin valor) |
| `validarNormalizacion.ts` | 192 | `normalizarModelo` (orden de claves top-level, saneo de `padreId`), `normalizarEnlace` (trim de textos y dependencias tasa→unidad), `normalizarEntidad` (quita `imagen.cache`), `normalizarVersiones` | `json.ts` | KEEP la idea (una normalización); SIMPLIFY (ver §3.6) |
| `validarEntidades.ts` | 282 | Entidad: tipo, esencia, afiliación, refinamientos, estereotipo/requisito, alias, unidad, urls, imagen, valorSlot, simulación, `orderedFundamentalTypes`, `lineal`, `anclaje` | `json.ts`, `validateStereotypes.ts` | KEEP núcleo; separar extensiones |
| `validarEstados.ts` | 131 | Estados, designaciones, duración, axiomas | `json.ts`, `validateStereotypes.ts` | **KEEP** (reglas OPM) |
| `validarOpds.ts` | 225 | OPD, `refinamientos` (+ migración legacy `refinamiento`), `ordenInzoom`, `vista` | `json.ts`, `validarEntidades.ts` | KEEP |
| `validarApariencias.ts` | 276 | Apariencias de cosa y de enlace (ports, plegado, contexto de refinamiento, `labelPositions`, `symbolPos`…) | `validarOpds.ts` | KEEP; son datos de vista |
| `validarEnlaces.ts` | 412 | Enlaces (extremos, firma, multiplicidad, modificadores, tasas, TS3/TS4/TS5, derivación) y abanicos (O/XOR, puerto común, `DecisionPolicy`) | `json.ts`, `validateStereotypes.ts` | **KEEP** (reglas OPM); quitar la doble validación con `validarMetadatosEnlace` |
| `validarFamiliasEfectosPreestado.ts` | 49 | Forma de `familiasEfectosPreestado` + semántica en `modelo/` | `json.ts` | KEEP si la extensión sobrevive (es "extensión declarada", no OPM nuclear) |
| `validarDeclaracionesNoNucleares.ts` | 103 | `declaracionesNoNucleares` (rol/restricción/exclusión/frontera) | `json.ts` | MARGINAL: meta, no OPM |
| `validateAnnotations.ts` | 179 | `satisfaccionesRequisito`, `anclasNormativas`, `notasMesa` | `json.ts` | MARGINAL / ACRECIÓN (ver §12) |
| `validateAuthoring.ts` | 161 | `ontologia`, `fichaTrabajo`, `lentesConocimiento`, `procedencia` | `json.ts` | MARGINAL |
| `validateExploration.ts` | 218 | `mesaExploracion` v1 (fuentes→trazos→propuestas→confirmaciones) | `json.ts` | MARGINAL (feature meta) |
| `validateStereotypes.ts` | 88 | Catálogo `estereotipos` + plantilla (reusa los validadores nucleares sobre un subgrafo) | `json.ts` | IMPORTANTE si se conserva la reutilización |
| `validateSubmodels.ts` | 132 | `submodelos`, `referenciaPadreSubmodelo` (con campos v0 duplicados) | `json.ts` | IMPORTANTE/SIMPLIFY |
| `validatePieceLineage.ts` | 105 | `pieceLineage`, `PieceReferenceMetadata` | `json.ts`, `validateSubmodels.ts` | MARGINAL (acreción reciente) |
| `perfilesExport.ts` | 218 | Perfiles `canon-diagrama`/`canon-documento`/`intercambio`, gates de densidad (25 apariencias/OPD) y de Bocetos, documento canónico Markdown | `emitirDocumentoCanonico` ← `store/modelo/acciones-canvas.ts:403`. `exportarModeloConPerfil` **sin consumidores fuera de tests** | SIMPLIFY (ver §12) |
| `portablePackage.ts` | 563 | Paquete portátil `opforja.portable-package` v1: sobre + payload canónico + SHA-256, fuentes con consentimiento, redacción | `ui/portable/*` | KEEP la integridad; SIMPLIFY el multi-revisión |

### 1.2 `persistencia/`

| Archivo | LOC | Propósito | Consumidores | Veredicto |
|---|---:|---|---|---|
| `backend.ts` | 771 | Cliente HTTP `/__deep-opm/*`: sesión/login/logout, modelos, revisiones, autosave, versiones, workspace, `SyncTransport` para la sync local, estado de identidad | store, ports, UI (2), mesa | KEEP la idea; SIMPLIFY mucho (≈40 % es boilerplate `try/fetch/leerJson/fallo`) |
| `modelos.ts` | 132 | `ModeloPersistido`/`ResumenModeloPersistido`, `construirModeloPersistido` (merge campo por campo con el existente) | store, backend, mesa, server | KEEP el contrato; SIMPLIFY |
| `workspace.ts` | 582 | `WorkspaceIndice`, carpetas (crear/renombrar/eliminar/archivar), especies (apunte/biblioteca), graduar/reabrir, búsqueda global, auto-archivado | store, server/repoMemoria, UI | SIMPLIFY; hay código muerto |
| `workspaceStorage.ts` | 82 | Normalizadores del índice (`normalizarModeloIndice`, `esPreferenciasUi`, `esMapaWorkspace`) | backend, server/validatePersistence | KEEP (fusionar con workspace) |
| `movimientoModelos.ts` | 104 | Cortar/pegar/mover modelos y carpetas; `validarMovimientoSinCiclo` | store/workspaceMod | **KEEP** (limpio) |
| `versiones.ts` | 134 | `construirVersionPersistible`, eliminar/listar/filtrar; `restaurarVersion*` es stub que siempre falla | store | SIMPLIFY/CUT stubs |
| `politicaVersiones.ts` | 61 | Retención log-scale (día 10 / semana 7 / mes 4 / histórico 1, `preservar` fuera de cuota, hito protegido) | viewmodel de versiones | **KEEP** (bien pensado) |
| `autosalvado.ts` | 82 | Timer idempotente con ciclo invalidante (5 min) | store/persistencia | KEEP (o reemplazar por debounce) |
| `compactacion.ts` | 7 | `JSON.stringify(JSON.parse(json))` | modelos, versiones, backend | KEEP (trivial) |
| `especie.ts` | 17 | `especieDe({esApunte, esBiblioteca})` | server, UI, store, mesa | KEEP; migrar a un discriminado |
| `nombreApunte.ts` | 9 | "Apunte AAAA-MM-DD" | store | KEEP |
| `sessionIdentity.ts` | 14 | Header `x-opforja-session-identity` (`tenant:user`) | backend, clientes, server | KEEP |
| `baseWitnessBrowser.ts` | 55 | Testigo `opforja.mesa-base.v1` con Web Crypto (gemelo de `mesa/baseWitness.ts` en Node) | backend | SIMPLIFY (una implementación isomórfica) |
| `localRepository.ts` | 621 | Repositorio local-first en IndexedDB `opforja-local` (snapshot + journal + history + conflicts en **un** registro por documento), `saveHere`, `markSynchronized`, `recordConflict`, `resolveConflict`, `recoveryJson` | runtime, ports, backend | KEEP el núcleo transaccional; **CUT/SIMPLIFY** el journal de snapshots completos |
| `syncQueue.ts` | 193 | `synchronizeDocument`: coalesce de checkpoints, acuse por igualdad de snapshot, conflicto por ancestro divergente, reintento tras commit incierto | ports | KEEP el algoritmo, pero con igualdad por hash canónico |
| `documentMigration.ts` | 172 | `migrateDocument`: acepta un documento v0 o un record `{json,…}`, reporta campos "no representados" y OPD sueltos | `ui/PersistenciaJson.tsx` | KEEP la idea (import con reporte de pérdidas) |
| `readerCache.ts` | 142 | Cache Storage para paquetes portátiles y assets del lector (service worker) | `ui/portable/*` | MARGINAL |
| `reviewClient.ts` | 138 | Cliente de revisiones compartidas (`/__deep-opm/review`) | UI de revisión | MARGINAL; mal ubicado (no es persistencia) |
| `agentClient.ts` | 304 | Cliente del runtime de agente (tareas, cambios, grants, SSE) | UI agent, ports | MARGINAL/fuera de lugar |
| `humanChangeClient.ts` | 24 | Propuestas humanas vía API del agente | UI | MARGINAL/fuera de lugar |

---

## 2. Contrato del documento persistido `deep-opm-pro.modelo.v0`

### 2.1 Envoltorio (`serializacion/json.ts:19-39`)

```ts
const FORMATO = "deep-opm-pro.modelo.v0";

export interface DocumentoModelo {
  formato: typeof FORMATO;
  modelo: Modelo;
  carpetaId?: Id | null;
}

export function exportarModelo(modelo: Modelo, carpetaId?: Id | null): string {
  const modeloConPuertos = sincronizarPuertosTodosLosOpd(modelo);
  const normalizado = normalizarModelo(modeloConPuertos);
  const documento: DocumentoModelo = {
    formato: FORMATO,
    modelo: { ...normalizado, ...(typeof modeloConPuertos.descripcion === "string" ? { descripcion: modeloConPuertos.descripcion } : {}) },
    ...(carpetaId !== undefined ? { carpetaId } : {}),
  };
  return JSON.stringify(documento, null, 2);
}
```

- La salida es JSON con indentación de 2 espacios. Se usa como **identidad**: el cálculo
  de dirty, los snapshots de pestaña, los hashes `workingCopyHash` y el testigo de base
  se hacen sobre este string o sobre su forma compacta (`compactarJsonDocumento`).
- El backend guarda la forma compacta (`construirModeloPersistido` → `compactarJsonDocumento`)
  en una columna `payload JSONB` y la devuelve como `payload::text`
  (`app/scripts/model-persistence-api.ts:125,508,545,668`). **JSONB reordena las
  claves**: el string remoto nunca coincide byte a byte con el enviado.
- El formato está congelado en `v0` y no hay migraciones versionadas: toda la
  compatibilidad hacia atrás vive como tolerancia dentro de los validadores (§3.5).
- `carpetaId` en el sobre es la **tercera** fuente de verdad de la carpeta. Solo se lee
  con `carpetaIdDeJson`, como fallback cuando el índice no conoce el modelo
  (`store/runtime.ts:310,342,816,842`).
- `sincronizarPuertosTodosLosOpd` (`modelo/operaciones/ports.ts:112`) corre en **export
  y también en hydrate**: materializa `portId` en `Enlace.origenId/destinoId` y
  `Apariencia.ports`. El export no es una proyección pura, porque recalcula geometría de
  puertos.

### 2.2 Tipos centrales (contrato textual)

`Modelo` (`modelo/tipos/modelo.ts:96-136`):

```ts
export interface Modelo {
  id: Id; nombre: string; descripcion?: string;
  opdRaizId: Id;
  opds: Record<Id, Opd>;
  entidades: Record<Id, Entidad>;
  estados: Record<Id, Estado>;
  enlaces: Record<Id, Enlace>;
  abanicos?: Record<Id, Abanico>;
  ontologia?: OntologiaOrganizacional;
  satisfaccionesRequisito?: Record<Id, SatisfaccionRequisito>;
  declaracionesNoNucleares?: Record<Id, DeclaracionNoNuclear>;
  familiasEfectosPreestado?: Record<Id, FamiliaEfectosPreestado>;
  anclasNormativas?: Record<Id, AnclaNormativa>;
  notasMesa?: Record<Id, NotaMesa>;
  mesaExploracion?: MesaExploracionV1;
  estereotipos?: Record<Id, Estereotipo>;
  procedencia?: SelloProcedencia;
  fichaTrabajo?: FichaTrabajo;
  lentesConocimiento?: LenteConocimiento[];
  submodelos?: Record<Id, SubmodeloReferencia>;
  pieceLineage?: Record<Id, PieceLineageRecord>;
  referenciaPadreSubmodelo?: ReferenciaPadreSubmodelo;
  archivado?: boolean; archivadoEn?: string;
  versiones?: VersionResumen[]; crearVersionAlGuardar?: boolean;
  nextSeq: number;
}
```

`Opd` (`tipos/opd.ts`): `{ id, nombre, padreId: Id|null, preguntaGuia?, apariencias:
Record<Id,Apariencia>, enlaces: Record<Id,AparienciaEnlace>, vista?: OpdVista,
ordenLocal?: number, ordenInzoom?: Id[][] }`. `padreId === null` en un OPD que no es la
raíz marca un **Boceto/OPD suelto** (Taller).

`Entidad` (`tipos/entidad.ts:108-152`): `{ id, tipo: "objeto"|"proceso", nombre,
esencia: "informacional"|"fisica", afiliacion: "sistemica"|"ambiental", refinamientos?:
Partial<Record<"descomposicion"|"despliegue", {opdId, modo?}>>, alias?, unidad?,
esAtributo?, valorSlot?, simulacion?, descripcion?, estereotipoId?, anclaje?, requisito?,
urls?, imagen?, layoutEstados?, lineal?, orderedFundamentalTypes? }`.

`Estado` (`tipos/estado.ts`): `{ id, entidadId, nombre, esInicial?, esFinal?,
designaciones?: ("inicial"|"final"|"default"|"current")[], duracion?: {unidad, min,
nominal, max}, suprimido?, width?, height?, x?, y?, orden? }`. `esInicial`/`esFinal`
conviven con `designaciones` (redundancia histórica).

`Enlace` (`tipos/enlace.ts:211-251`):

```ts
export type TipoEnlace = "agregacion" | "exhibicion" | "generalizacion" | "clasificacion"
  | "etiquetado" | "etiquetadoBidireccional" | "agente" | "instrumento" | "consumo"
  | "resultado" | "efecto" | "invocacion" | "excepcionSobretiempo" | "excepcionSubtiempo"
  | "excepcionSubSobretiempo";
export interface ExtremoEnlace { kind: "entidad" | "estado"; id: Id; portId?: Id; }
export interface Enlace {
  id: Id; tipo: TipoEnlace; origenId: ExtremoEnlace; destinoId: ExtremoEnlace; etiqueta: string;
  multiplicidadOrigen?: string; multiplicidadDestino?: string;
  modificador?: "condicion" | "evento" | "no"; subtipoModificador?: "C" | "E" | "no";
  probabilidad?: number; demora?: string; rutaEtiqueta?: string; backwardTag?: string;
  requisitos?: string; mostrarRequisitos?: boolean; tasa?: string; unidadesTasa?: string;
  tiempoMaximo?: string; unidadTiempoMaximo?: string; tiempoMinimo?: string; unidadTiempoMinimo?: string;
  grupoEstructuralId?: Id; estadoEntradaId?: Id; estadoSalidaId?: Id;
  efectoEscindido?: { grupoId: Id; enlacePadreId: Id; rol: "entrada" | "salida"; modo?: "par" | "standalone" };
  derivado?: { tipo: "enlace-externo-refinamiento"; refinamientoId: Id; enlacePadreId: Id; origen?: "automatico" | "manual" };
}
```

Nota de diseño: `ExtremoEnlace.portId` es un dato **de vista** (el puerto de la
apariencia) guardado en el enlace **global**. Un mismo enlace que aparece en varios OPD
comparte un único `portId` por extremo. En una reescritura corresponde a
`AparienciaEnlace`.

`Apariencia` (`tipos/apariencia.ts:321-355`): `{ id, entidadId, opdId, x, y, width, height,
modoTamano?, modoPlegado?, ordenPartes?, parteExtraidaDe?: {padreAparienciaId,
parteEntidadId}, contextoRefinamiento?: {tipo, refinableEntidadId, rol:
"contorno"|"interno"|"externo", contenedorAparienciaId?, enlacesPadreIds?, origen?:
"adopcion"}, ports?: Record<Id,{x,y}> (0..1), estadosSuprimidos?: Id[] }`.

`AparienciaEnlace` (`tipos/enlace.ts:277-288`): `{ id, enlaceId, opdId, vertices: {x,y}[],
symbolPos?, symbolAnchors?: {refinable?:{dx,dy}, refinador?:{dx,dy}}, labelPositions?:
Record<string,{distance, offset?, angle?}> }`.

`Abanico` (`tipos/abanico.ts`):

```ts
export interface Abanico {
  id: Id; opdId: Id;
  puertoComun: { entidadId: Id; lado: "origen" | "destino"; portId: Id };
  /** Alias legacy derivado de puertoComun.entidadId. Se conserva para compatibilidad de JSON v0 */
  puertoEntidadId: Id;
  operador: "O" | "XOR";
  enlaceIds: Id[];
  decision?: DecisionPolicy; // estado-fijo | uniforme | probabilidades{pesos} | funcion{funcionId,fallback?}
}
```

Metadatos de catálogo en `VersionResumen` (`tipos/modelo.ts:46-54`): `{ id, creadoEn,
nombre, descripcion?, preservar?, modeloPayloadKey, bytes }`.

### 2.3 Clasificación de los campos del documento

| Capa | Campos | Estatus |
|---|---|---|
| **OPM nuclear** | `entidades` (tipo, esencia, afiliación, refinamientos, nombre, `esAtributo`/`valorSlot`/`unidad`/`alias`), `estados`, `enlaces` (tipo, extremos, multiplicidad, modificadores, etiqueta, tasas, tiempos, TS3/TS4/TS5, derivación), `abanicos`, `opds` (árbol, `ordenInzoom`) | **Sagrado** |
| **Vista/diagrama** | `apariencias` (x, y, w, h, plegado, ports, `estadosSuprimidos`, contexto de refinamiento), `AparienciaEnlace` (vértices, símbolo, labels), `Estado.x/y/width/height`, `layoutEstados`, `ordenLocal`, `ExtremoEnlace.portId` | Necesario (fidelidad OPD) |
| **Meta de autoría** | `fichaTrabajo`, `lentesConocimiento`, `ontologia`, `procedencia`, `preguntaGuia` | Marginal |
| **Anotación/meta** | `notasMesa`, `anclasNormativas`, `satisfaccionesRequisito`, `declaracionesNoNucleares`, `mesaExploracion`, `familiasEfectosPreestado` | Marginal/acreción (salvo requisitos) |
| **Reutilización** | `estereotipos` (+plantilla), `Entidad.estereotipoId`, `Entidad.anclaje`, `submodelos`, `referenciaPadreSubmodelo`, `pieceLineage`, `OpdVista.submodel-view` | Importante, pero son **cuatro** mecanismos solapados |
| **Simulación** | `Entidad.simulacion`, `Abanico.decision`, `Enlace.probabilidad`, `Estado.duracion` | Importante |
| **Catálogo filtrado al documento (legacy)** | `archivado`, `archivadoEn`, `versiones`, `crearVersionAlGuardar`, sobre `carpetaId` | **Cortar del documento** (ya viven en el record/índice) |
| **Contador** | `nextSeq` (entero seguro ≥1) | Keep |

### 2.4 Defaults y normalizaciones que aplica la hidratación

| Dónde | Qué hace | Efecto |
|---|---|---|
| `validarApariencias.ts:168` | `modoPlegado` ausente → `"completo"` **escrito** | Rompe el punto fijo del export (§3.6) |
| `validarOpds.ts:99` | `despliegue.modo` ausente → `"agregacion"` solo para validar; no se escribe si faltaba | Consistente con el test "no materializa modo" |
| `validarOpds.ts:151` | `padreId` ausente y OPD ≠ raíz → raíz; `null` explícito se conserva (Boceto) | Migración implícita |
| `validarNormalizacion.ts:35-48` | `padreId` colgante o autorreferente → raíz, con `console.warn` | Saneo con aviso |
| `validarEstados.ts:75-79` | `width`/`height` → `round(max(52/24, v))`; `x`/`y` → `round` | Normalización con pérdida dentro del validador |
| `validarEstados.ts:69-70` | `esInicial:false`/`esFinal:false` se omiten | Canoniza |
| `validarEnlaces.ts:287` | `derivado.origen` ausente → `"automatico"` escrito | Materializa |
| `validarEnlaces.ts:344` | `puertoEntidadId` se recalcula desde `puertoComun` canónico | Normaliza |
| `validarEntidades.ts:225` | `valorSlot` presente ⇒ `esAtributo = true` | Implica |
| `validarNormalizacion.ts:120-163` | Trim de `rutaEtiqueta`, `backwardTag`, `requisitos`, `tasa`, tiempos; las unidades se retiran si falta el valor | Canoniza |
| `validarNormalizacion.ts:114-117` | Quita `imagen.cache` | Transitorio fuera |
| `validarEnlaces.ts:247-249` | Extremo string legacy → `{kind:"entidad", id}` | Migración implícita |
| `validarEntidades.ts:161-168` | `estereotipo:"requirement"` legacy, o solo `requisito`, → `estereotipoId = ESTEREOTIPO_REQUIREMENT_ID` | Migración implícita |
| `validarOpds.ts:79-92` | `refinamiento` legacy (pre-15.2) → `refinamientos` | Migración implícita |
| `validateAuthoring.ts:319-321` | `procedencia.glosarioHash` legacy se descarta en silencio | Migración con pérdida |

### 2.5 Migraciones legacy implícitas (catálogo para una v1)

1. Extremo de enlace `string` → `ExtremoEnlace`.
2. `Entidad.refinamiento` (único) → `Entidad.refinamientos` (producto parcial).
3. `Entidad.estereotipo: "requirement"` → `estereotipoId`.
4. `Opd.padreId` ausente → raíz.
5. `Abanico` sin `puertoComun` (solo `puertoEntidadId`) → `puertoComun` canónico
   (`validarEnlaces.ts:392-397`).
6. Enlaces sin `portId` → puertos materializados por `sincronizarPuertosTodosLosOpd`.
7. `procedencia.glosarioHash` → descartado.
8. `SubmodeloReferencia` con duplicados v0 (`modeloId`, `anchorEntidadId`, `opdVistaId`,
   `compartidas`, `estado`) junto a `source/anchor/contrato/materializacion`
   (`tipos/extensiones.ts:499-518`).
9. Documentos sin `estados`/`abanicos` → `{}`.

Ninguna está versionada: se aceptan para siempre. Una reescritura debería congelarlas
en **un** migrador `v0 → v1` explícito, con reporte de pérdidas (`documentMigration.ts`
ya tiene el patrón `unrepresentedData`).

### 2.6 Canonicidad: hallazgo central **[verificado]**

Test exploratorio en el scratchpad sobre `fixtureTodos()`:

```
System Diagram  bytes 9779  export 0.21 ms  idempotent(in-mem vs hydrated) false
SD Sync         bytes 37980 export 0.65 ms  idempotent false
OnStar System   bytes 32515 export 0.46 ms  idempotent false
Modelo Vacio    bytes 401   export 0.03 ms  idempotent true
second pass (hydrate→export→hydrate→export) stable: true
```

Diferencia observada: la apariencia hidratada gana `"modoPlegado": "completo"`, y
cambia el orden de claves porque los validadores reconstruyen objetos con un orden
propio. Consecuencias:

- `exportarModelo` solo es canónico **después** de pasar una vez por `hidratarModelo`.
  Por eso aparece el patrón `hidratarModelo(exportarModelo(x))` en
  `store/runtime.ts:710`, `store/workspaceMod.ts:440`, `autoria/bundle.ts:110-117`,
  `persistencia/backend.ts:114-122` (readRemote), `server/review/hash.ts:9-21`,
  `mesa/esSinDelta.ts:56-59` y `persistencia/documentMigration.ts:45-47`.
- Los hashes que cruzan el borde cliente/servidor (`workingCopyHash`,
  `canonicalWorkingCopyHash`) dependen de que ambos lados hagan exactamente
  `exportarModelo(hidratarModelo(json), carpetaIdDeJson(json))`. Es un **contrato byte a
  byte implícito** (`server/review/hash.ts:8`: "Matches the browser's UTF-8 hash of
  exportarModelo(model, carpetaId)").
- `exportarModelo` se llama muchas veces por edición (dirty, snapshot, checkpoint, undo
  history). Cuesta ≈0,2-0,7 ms en fixtures de 10-40 kB, y cada llamada recalcula puertos.

**Recomendación**: definir una función `canonicalize(model)` que sea punto fijo
(materializa todos los defaults o ninguno), un `canonicalHash = sha256(canonicalJson(...))`
con claves ordenadas (reusar `portablePackage.ts:531-540`), y comparar por hash, nunca por
string con formato. Guardar el payload como `TEXT`, o comparar solo hashes canónicos.

---

## 3. Pipeline de hidratación (`json.ts:41-59, 82-196`)

1. `JSON.parse` → si falla: `"JSON inválido"`.
2. `formato === "deep-opm-pro.modelo.v0"` → si no: `"Documento de modelo inválido"`.
3. `validarModelo`, en orden y cortando en el primer fallo:
   `id/nombre/opdRaizId/nextSeq` → `validarEntidades` → `validarPieceLineage` →
   `validarEstados` → `validarOpds` (+`validarApariencias`, `validarAparienciasEnlace`) →
   raíz existe → `validarEnlaces` → `ontologia` → `satisfaccionesRequisito` →
   `anclasNormativas` → `notasMesa` → `mesaExploracion` → `estereotipos` → `procedencia` →
   `fichaTrabajo` → `lentesConocimiento` → `submodelos` → `referenciaPadreSubmodelo` →
   `validarAbanicos` → `familiasEfectosPreestado` → `declaracionesNoNucleares`.
4. Se ensambla `Modelo` con allowlist: los campos vacíos no se emiten, para mantener la
   "byte-identidad sobre opcional ausente".
5. `validarReferenciasOpd` (`modelo/integridadReferencial.ts:27-86`).
6. `normalizarModelo` + `sincronizarPuertosTodosLosOpd`.

Propiedades:

- **Whitelist estricta**: todo campo no declarado se descarta en silencio. Esto ya causó
  pérdidas históricas documentadas en el propio código: `Estado.orden`
  (`validarEstados.ts:60-64`, "V16-2 … se perdia al reimportar") y
  `AparienciaEnlace.labelPositions` (`validarApariencias.ts:214-216`, "V16-4"). Cada campo
  nuevo del tipo exige tocar el validador, el normalizador y el allowlist de `json.ts`. El
  test `json-roundtrip-campos.test.ts` (877 líneas) existe para atrapar esas omisiones.
- **Todo o nada**: un único dato malo (por ejemplo `"?"` como multiplicidad) impide abrir
  el modelo completo, y el mensaje es técnico (`Enlace inválido: e-19.multiplicidadOrigen`).
- **Doble validación de metadatos de enlace**: `validarEnlaces.ts:102-131` y
  `modificadores.ts:129-188` verifican lo mismo (tasa y tiempos por familia, unidades que
  requieren valor).
- `modeloParaExtremos` (`integridadReferencial.ts:144-155`) fabrica un `Modelo` falso
  ("modelo-validacion") para reusar helpers. Es una señal de que los helpers exigen el
  `Modelo` completo cuando bastaría `Pick<…>`.

---

## 4. Reglas OPM codificadas en la frontera de import

Son sagradas y hay que portarlas tal cual (o reubicarlas en el kernel de modelo y
reutilizarlas desde el import). Las marcadas **[Forja]** son reglas metodológicas locales
o de OPCloud, no ISO 19450 pura; conviene contrastarlas con el corpus KORA antes de
mantenerlas como **rechazo duro** en import.

### 4.1 Entidades

| Regla | Ubicación |
|---|---|
| `tipo ∈ {objeto, proceso}`, `esencia ∈ {informacional, fisica}`, `afiliacion ∈ {sistemica, ambiental}` obligatorios | `validarEntidades.ts:113-116`, `validarGuards.ts:27-37` |
| Refinamiento: slots ortogonales `descomposicion` (in-zoom, sin `modo`) y `despliegue` (unfold, `modo ∈ {agregacion, exhibicion, generalizacion, clasificacion}`, default agregación) | `validarOpds.ts:49-102` |
| El OPD de refinamiento debe existir **y contener una apariencia de la cosa refinada** | `integridadReferencial.ts:39-47` |
| `orderedFundamentalTypes` ⊆ enlaces estructurales fundamentales | `validarEntidades.ts:322-338` |
| `valorSlot` (integer/float/char/string, placeholder `"value"`) implica atributo; `simulacion` requiere `valorSlot` | `validarEntidades.ts:221-232` |
| `requisito` solo con estereotipo requirement (idLogico, descripción y dureza hard/soft) | `validarEntidades.ts:154-213` **[Forja/OPCloud]** |
| `estereotipoId` debe resolver contra la fábrica o el catálogo | `integridadReferencial.ts:34-38` |

### 4.2 Estados

| Regla | Ubicación |
|---|---|
| Un estado pertenece a un **objeto** existente (nunca a un proceso) | `validarEstados.ts:28-31` |
| Nombre no vacío | `validarEstados.ts:32-34` |
| **Axioma**: un objeto con estados tiene **≥2** (exactamente 1 = rechazo) | `validarEstados.ts:85` |
| Nombres únicos por objeto (case-insensitive, locale `es`) | `validarEstados.ts:86-90` |
| A lo sumo un `default` y un `current` por objeto | `validarEstados.ts:92-97` |
| Designaciones sin duplicados; un estado no puede ser `default` y `current` a la vez | `validarEstados.ts:103-112` |
| Duración `{unidad ∈ ms…año, min, nominal, max}` finita y validada por `validarDuracion` (orden min ≤ nominal ≤ max) | `validarEstados.ts:115-131`, `modelo/objetoDuracion.ts` |

### 4.3 Enlaces (firma, `modelo/operaciones/helpers.ts:58-148`)

| Tipo | Firma | Línea |
|---|---|---|
| Estructurales fundamentales | **No aceptan extremos Estado** [V-237][V-239] | 67-69 |
| `etiquetado` | misma clase (obj-obj o proc-proc) | 70-74 |
| `etiquetadoBidireccional` | misma clase; no admite estado solo en destino [V-30] | 75-80 |
| `agregacion`, `generalizacion`, `clasificacion` | misma clase OPM | 81-98 |
| `exhibicion` | cualquier par (característica objeto/proceso) | 86-88 |
| `agente` | **Objeto físico** → Proceso | 99-103 |
| `instrumento`, `consumo` | Objeto (o Estado) → Proceso | 104-113 |
| `resultado` | Proceso → Objeto (o Estado) | 114-118 |
| `efecto` | Proceso → Objeto; o Estado → Proceso (efecto de entrada); Objeto → Proceso solo como rama de abanico | 119-129 |
| `invocacion` | Proceso → Proceso; **se permite la autoinvocación** | 130-134; `validarEnlaces.ts:58-64` |
| `excepcionSobretiempo/Subtiempo/SubSobretiempo` | Proceso → Proceso, sin estados; **el proceso de manejo debe ser ambiental** (R-EXC-1A) | 135-146 **[Forja: R-OPD-CTL-6]** |

Otras reglas de enlace en el import:

| Regla | Ubicación |
|---|---|
| Nada de autoenlaces, salvo la autoinvocación | `validarEnlaces.ts:58-64` |
| Multiplicidad canónica: `\d+`, `N`, `+`, `*`, `d..d`, `d..N`, `d..*` (**sin `?`**) | `modelo/operaciones/enlaces.ts:53-57`, usada en `validarEnlaces.ts:264-272` |
| Modificadores c/e/NO solo en procedurales; no en resultado, invocación ni excepciones [AP-01/02/03/10]; no en TS4/TS5 escindidos en par [AP-08]; el subtipo C/E/no exige su modificador | `modelo/modificadores.ts:198-217` |
| `probabilidad` ∈ [0,1], solo en procedurales (ramas XOR o eventos) [Glos 3.60] | `modificadores.ts:139-147` |
| `demora` solo en invocación [V-240] | `modificadores.ts:149-152` |
| `backwardTag` solo en `etiquetadoBidireccional` | `validarEnlaces.ts:94-96` |
| `tasa`/`unidadesTasa` solo en consumo/resultado/efecto; la unidad requiere tasa | `validarEnlaces.ts:106-111`, `constantes.ts:76-78` |
| `tiempoMaximo` en sobretiempo y sub-sobretiempo; `tiempoMinimo` en subtiempo y sub-sobretiempo; la unidad requiere valor | `validarEnlaces.ts:116-131`, `constantes.ts:86-92` |
| `grupoEstructuralId` solo en estructurales fundamentales | `validarEnlaces.ts:134-136` |
| `estadoEntradaId`/`estadoSalidaId`/`efectoEscindido` solo en `efecto`, con estados existentes | `validarEnlaces.ts:178-214` |
| Un extremo Estado no lleva `portId` | `validarEnlaces.ts:260` |
| `derivado`: `refinamientoId` es una entidad con refinamiento y `enlacePadreId` existe | `integridadReferencial.ts:48-57` |
| **Todo enlace tiene al menos una apariencia en algún OPD** | `integridadReferencial.ts:82-84` |
| Los extremos de cada apariencia de enlace son **visibles** en ese OPD (directos o como parte de un plegado parcial) | `integridadReferencial.ts:72-80, 88-96` |

### 4.4 Abanicos (O/XOR)

| Regla | Ubicación |
|---|---|
| ≥2 enlaces únicos, existentes, visibles en el OPD del abanico | `validarEnlaces.ts:309-323` |
| Solo **procedurales** y **homogéneos** (mismo tipo) | `modelo/abanicos.ts:370-379` |
| Comparten **un único puerto exacto** (entidad, lado, portId), coherente con `puertoEntidadId` | `abanicos.ts:380-391`; `validarEnlaces.ts:386-411` |
| Un enlace pertenece a lo sumo a un abanico | `abanicos.ts:393-397` |
| En `generic-view` no se crean abanicos (solo se proyectan) | `abanicos.ts:359-361` |
| `DecisionPolicy.probabilidades.pesos` ∈ [0,1] | `validarEnlaces.ts:365-375` |

### 4.5 OPD, apariencias y vistas

| Regla | Ubicación |
|---|---|
| El OPD raíz existe; claves coinciden con `id` | `json.ts:101`, `validarOpds.ts:112` |
| Apariencia: `opdId` = OPD contenedor, entidad existente, w/h > 0, x/y finitos | `validarApariencias.ts:33-42` |
| `ports` relativos en [0,1] | `validarApariencias.ts:77-91` |
| `parteExtraidaDe`: el padre existe, está en plegado `parcial` y la parte es realmente parte de ese plegado | `integridadReferencial.ts:98-111` |
| `ordenInzoom`: bandas disjuntas (anticadena); solo en OPD que es descomposición de un proceso; ids = subprocesos **internos** reales | `validarOpds.ts:176-192`; `integridadReferencial.ts:125-142` |
| `vista.requirement-view` apunta a un requisito; `submodel-view` a un submodelo cuyo `opdVistaId` coincide | `integridadReferencial.ts:58-67` |

### 4.6 Extensiones (reglas de forma, no OPM)

- `familiasEfectosPreestado`: tipo `particion-preestado`, estatuto `extension-declarada`,
  "exactamente uno por preestado", ≥2 miembros TS3 completos del mismo par
  objeto-proceso, dominio de estados del objeto (`modelo/familiasEfectosPreestado.ts`,
  semántica en `validarSemanticaFamiliasPreestado`). Es una extensión declarada, **no**
  un abanico ni un operador lógico; conviene conservarla solo si OPL la usa.
- `mesaExploracion`: cadena cerrada fuente→trazo→propuesta→confirmación, un target por
  confirmación, Markdown ≤128 kB (`validateExploration.ts`).
- `anclasNormativas`/`notasMesa`: target resoluble (entidad, enlace, OPD o modelo);
  `ratificado-con-fuente` exige fuente (`validateAnnotations.ts:146-163`).

### 4.7 Divergencias de reglas entre edición e import (riesgo de pérdida de datos)

1. **Multiplicidad `?`** **[verificado]**. `enlaceMultiplicidad.ts:7,14` la acepta (y la
   lista como canónica). La usa `store/enlaces.ts:38-43` (`fijarMultiplicidadEnlace`), y
   el generador OPL la trata como opcional (`opl/generar.ts:451`). En cambio
   `operaciones/enlaces.ts:53` la rechaza, y es la que usa el import. El mensaje de error
   de `ajustarMultiplicidad` (`operaciones/enlaces.ts:67-68`) ofrece `?` como válida. Con
   el test exploratorio: `fijarMultiplicidadOrigen(m, e, "?")` → ok; `hidratarModelo` →
   `Enlace inválido: e-19.multiplicidadOrigen`.
2. **Probabilidad**: el setter `modificadores.ts:75` exige modificador `evento`; el
   validador (`:139-147`) acepta cualquier procedural. Un comentario admite que la versión
   anterior impedía reimportar un XOR probabilizado.

**Regla de oro para la reescritura**: una sola definición de cada regla, usada a la vez
por la operación de edición, el parser OPL y el import.

---

## 5. Export / import

### 5.1 JSON "intercambio" (el camino real)

- **Export**: `store/persistencia.ts:150` (`exportarJson` → `exportarModelo(get().modelo)`,
  sin `carpetaId`). UI: `ui/PersistenciaJson.tsx` (Exportar, Descargar JSON con nombre
  `slug-AAAA-MM-DD.json`).
- **Import**: `PersistenciaJson.tsx:32` ejecuta `migrateDocument(texto)` **en cada
  pulsación** del textarea (hidrata, exporta, parsea dos veces y recorre en profundidad).
  Luego `importarJson(exportarModelo(migracion.value.document))` vuelve a hidratar. Son
  tres hidrataciones por import.
- `migrateDocument` (`documentMigration.ts:32-95`) acepta un documento v0 o un record
  persistido `{json, esApunte?, esBiblioteca?, archivado?}`. Devuelve `document`,
  `sourceProfile` (especie inferida solo de flags, `looseOpdIds`), `differences`,
  `recoverableOriginal` y `unrepresentedData` (rutas descartadas por la whitelist). La UI
  ofrece "Descargar original" si hubo pérdida. **Patrón valioso**, porque hace visible la
  pérdida en vez de ocultarla.
- No existe importador ni exportador de formato OPCloud. Hay referencias a
  `opm-extracted/json.model.ts` en comentarios, pero no hay código de conversión.

### 5.2 Perfiles (`perfilesExport.ts`)

- `intercambio` = identidad. `canon-diagrama` quita `notasMesa`, `mesaExploracion`,
  `ontologia`, `satisfaccionesRequisito`, `declaracionesNoNucleares` y `procedencia`.
  `canon-documento` = diagrama + `ATRIBUTOS_DE_PERFIL["canon-documento"]`
  (`satisfaccionesRequisito`, `declaracionesNoNucleares`, `procedencia`). El comentario de
  cabecera (líneas 5-15) no menciona `mesaExploracion` ni `declaracionesNoNucleares`: está
  desactualizado.
- Gates: `gateDensidadCanonica` bloquea si **algún** OPD supera
  `CANON_DIAGRAMA_MAX_APARIENCIAS = 25` (`modelo/perfilDiagrama.ts:5`).
  `gateOpdsSinAdoptar` bloquea si hay Bocetos, salvo que el documento sea un Apunte.
- `exportarModeloConPerfil` **no tiene consumidores de producción**. Solo se usa
  `emitirDocumentoCanonico` (Markdown: portada, métricas, árbol, OPL completa vía
  `opl/exportarMarkdown`, declaraciones no nucleares, procedencia).
- Según `docs/uso-productivo.md`, las exportaciones PNG se rotulan `canon-diagrama`, pero
  el render (`render/jointjs/mapaExport.ts`) no pasa por `filtrarModeloPorPerfil`. El
  perfil es una etiqueta documental, no una proyección aplicada.

### 5.3 OPL / Markdown / PNG / SVG / diagnóstico

Viven fuera del área, pero forman parte del contrato de export:
`opl/exportarMarkdown.ts` (`exportarOplOpdMarkdown`, `exportarOplModeloMarkdown`),
`opl/contextoSkill.ts`, `render/jointjs/mapaExport.ts` (`descargarOpdActualPng`,
`descargarTodosLosOpdsPngZip`, `exportarOpdOffscreenSvgPng`) y
`modelo/exportarDiagnostico.ts`.

### 5.4 Paquete portátil (`portablePackage.ts`)

Contrato textual:

```ts
export const PORTABLE_PACKAGE_FORMAT = "opforja.portable-package" as const;
export const PORTABLE_PACKAGE_VERSION = 1 as const;
export const PORTABLE_READER_PROFILE = { id: "deep-opm-pro.modelo", version: "deep-opm-pro.modelo.v0" } as const;
// envelope (bytes UTF-8, JSON indentado):
{ format, version, payload: <string canonicalJson(PortablePackageData)>,
  integrity: { algorithm: "SHA-256", payloadDigest: <hex> } }
// PortablePackageData:
{ manifest: { packageId, createdAt, selectedRevisionId },
  profile: { id, version },
  revisions: [{ id, modelId, modelJson, label, createdAt, revision?, selectedOpdId,
                views: { selectedOpdId, opdIds } }],
  sources: { included: [{ id, title, locator, mediaType, content, contentSha256,
                          authorization: "human-authorized", modelSourceId?, redactedLocatorParams? }],
             omitted:  [{ id, title, locator, reason, modelSourceId?, redactedLocatorParams? }] } }
```

- Límites: 40 MB por paquete, 1 MB por fuente, 10 MB en total de fuentes, 50 revisiones y
  200 fuentes.
- Lectura: acepta exactamente las claves esperadas (`assertExactKeys`), verifica el
  digest en tiempo constante, rehidrata cada revisión y comprueba que `views.opdIds`
  coincida exactamente con los OPD del modelo. Responde `unsupported-format`,
  `unsupported-version` o `unsupported-profile` **sin reescribir los bytes originales**.
- Saneo: las fuentes de `mesaExploracion` no autorizadas se redactan, junto con sus
  trazos y propuestas dependientes. Las credenciales en URLs se retiran con
  `sanitizePublicModelUrls`.
- Uso real (`ui/portable/PortablePackagePanel.tsx:23-44`): **siempre una revisión** (la de
  trabajo), con fuentes `mediaType: "text/plain"` aunque la fuente sea Markdown. El
  soporte multi-revisión (hasta 50) es capacidad sin uso.
- `readerCache.ts` guarda paquetes en Cache Storage (`opforja-portable-packages-v1`) bajo
  `/portable-reader/__packages/<uuid>` y registra un service worker con un manifiesto de
  assets.

---

## 6. Persistencia remota (API HTTP)

### 6.1 Endpoints (cliente `persistencia/backend.ts`; servidor `server/modelPersistence.ts`)

| Método y ruta | Cuerpo / respuesta | Cliente |
|---|---|---|
| `GET /__deep-opm/session` | → `{session:{tenantId,userId,auth?}}` (401 si hay login obligatorio) | `obtenerSesionBackend`, `obtenerEstadoSesionBackend` (fallback offline a la identidad cacheada en IndexedDB) |
| `POST /__deep-opm/auth/login` | `{email,password}` → `{session}` + cookie HttpOnly | `iniciarSesionBackend` |
| `POST /__deep-opm/auth/logout` | → borra la cookie | `cerrarSesionBackend` |
| `GET /__deep-opm/modelos?includePayload=1` | → `{modelos: ModeloPersistido[]}` | `listarModelosBackend`: **descarga el JSON de todos los modelos e hidrata cada uno** solo para calcular `estadoCierre` (`backend.ts:259-271, 624-630`) |
| `POST /__deep-opm/modelos` | `{modelo: ModeloPersistido}` → `{modelo}` | `guardarModeloBackend` (guardado directo, sin CAS) |
| `GET /__deep-opm/modelos/:id` | → `{modelo}` | `cargarModeloBackend` |
| `DELETE /__deep-opm/modelos/:id` | → `{ok}` | `borrarModeloBackend` |
| `POST /__deep-opm/modelos/:id/revisiones` | `ModelRevisionCommit` → `{model, version, workspace}` | `confirmarRevisionBackend` (CAS por testigo) |
| `GET/PUT /__deep-opm/modelos/:id/autosave` | `{creadoEn, json, revisionBase}` → `{modeloId, creadoEn, json}`; 404 = no hay | `cargar/guardarAutosalvadoBackend` |
| `GET/POST /__deep-opm/modelos/:id/versiones[/:vid]`, `DELETE …/:vid` | `{version: VersionResumen, json}` | `guardar/cargar/borrarVersionBackend` |
| `GET/PUT /__deep-opm/workspace` | `{indice, revisionBase}` → `{indice, revision}` (CAS optimista) | `cargar/guardarWorkspaceBackend` |
| `/__deep-opm/agent/*`, `/__deep-opm/review/*` | Runtime de agente y revisiones compartidas | `agentClient.ts`, `reviewClient.ts`, `humanChangeClient.ts` |

Contrato de sesión: toda petición no-sesión envía `x-opforja-session-identity:
enc(tenant):enc(user)` (`sessionIdentity.ts`). El servidor rechaza con 401 si no coincide
con la cookie (`server/modelPersistence.ts:242-248`). Un 401/403 dispara
`forgetObservedBackendSession` y los listeners. Nota: `agentClient` y `reviewClient`
hacen `GET /session` **antes de cada request** (`agentClient.ts:77`,
`reviewClient.ts:209`), incluso en cada reconexión SSE.

### 6.2 Record remoto (`persistencia/modelos.ts:5-37`)

```ts
export interface ResumenModeloPersistido {
  id: string; nombre: string; descripcion: string; creadoEn: string; actualizadoEn: string;
  carpetaId?: string | null; ultimaApertura?: string; autosalvado?: boolean;
  archivado?: boolean; archivadoEn?: string; archivadoAuto?: boolean;
  esBiblioteca?: boolean; esApunte?: boolean;  // excluyentes
  versiones?: VersionResumen[]; crearVersionAlGuardar?: boolean; revision?: number;
  estadoCierre?: EstadoCierreModelo; // derivado, no persistido
}
export interface ModeloPersistido extends ResumenModeloPersistido { json: string; }
```

Tablas Postgres (`app/scripts/model-persistence-api.ts:110-170`): `opforja_models`
(PK `(tenant_id,id)`, `payload JSONB`, `revision INTEGER`, columnas espejo de cada flag),
`opforja_model_versions` (`payload JSONB`), `opforja_model_autosaves` (una fila por
modelo), `opforja_workspaces` (`indice JSONB`, una fila por tenant), además de tenants,
users y accounts. Las migraciones están numeradas (`opforja_schema_migrations`).

### 6.3 Revisión confirmada y "base dual"

```ts
export interface ModelRevisionCommit {
  model: ModeloPersistido; version: VersionResumen;
  base: { kind: "new" } | { kind: "existing"; witness: MesaBaseWitnessV1 };
  speciesOnCreate?: "apunte" | "modelo";
  graduation?: { kind: "graduate"; folderId: string | null; role: "work" | "library" };
  reopening?: { kind: "reopen" };
  confirmedByOperator?: boolean;
}
export interface MesaBaseWitnessV1 {
  format: "opforja.mesa-base.v1"; modelId: string;
  saved: { revision: number; updatedAt: string; sha256: string };
  autosave: { createdAt: string; sha256: string } | null;
  source: "saved" | "autosave"; // autosave si es posterior a saved.updatedAt
}
```

- La base efectiva es el guardado o el autosave, el que sea más reciente
  (`selectedRevisionSnapshot`, `backend.ts:101-105`; `baseWitnessBrowser.ts:182-205`).
  El servidor aplica `evaluarPoliticaCommit` → `mesa/validarPush.evaluarPush`: el bundle
  debe hidratar, la biblioteca es solo lectura, un destino sellado exige bundle sellado,
  una base autosave exige `confirmedByOperator`, y no hay commit si no hay delta
  (`esSinDelta` compara `exportarModelo∘hidratarModelo` de ambos lados).
- La UI de sincronización manda **siempre** `confirmedByOperator: true`
  (`app/ports/documentPersistencePort.ts` → `synchronizeDocument(..., {confirmedByOperator: true})`).
  El gate "base no ratificada" queda reducido a ceremonia en ese camino.
- Hay dos implementaciones del testigo: `mesa/baseWitness.ts` (Node `crypto`/`Buffer`) y
  `persistencia/baseWitnessBrowser.ts` (Web Crypto). Un test las mantiene equivalentes.

### 6.4 Versiones

`construirVersionPersistible` (`versiones.ts:124-143`) compacta el export y genera
`VersionResumen` (`modeloPayloadKey = id`, `bytes = length`). La retención
(`politicaVersiones.ts`) se aplica en la UI de versiones, no en el servidor. Stubs:
`restaurarVersion`/`restaurarVersionResultado` siempre fallan ("Versión no disponible sin
backend"); `crearVersion`, `listarVersiones`, `eliminarVersion` e `idsVersionesPodadas`
solo se usan en tests.

---

## 7. Persistencia local (navegador)

### 7.1 IndexedDB `opforja-local` v1 (`localRepository.ts:446-531`)

- Object stores: `documents` (keyPath `key`) y `session` (keyPath `id`; guarda
  `{id:"active", identity}` como identidad offline).
- Clave: `JSON.stringify([tenantId, userId, documentId])` (`:582-584`). Los documentos
  sin backend usan `documentId = "local:<tabId>"`.
- Registro único por documento (contrato textual, `:45-59`):

```ts
export interface LocalDocumentRecord {
  key: string; tenantId: string; userId: string; documentId: string;
  localRevision: number; lastSyncedLocalRevision: number;
  snapshotJson: string;                 // copia vigente
  remoteBase: LocalRemoteBase | null;   // { revision: number|null; snapshotJson; base?; witness? }
  status: "synced" | "saved-here" | "conflict";
  journal: LocalJournalEntry[];         // { id, localRevision, createdAt, status: pending|synced|conflict,
                                        //   snapshotJson, base, change, inverse, receipt?, remoteRevision? }
  history: unknown[];                   // [{ format: "opforja.local-history.v1", undo: string[], cursor, intents }]
  conflicts: LocalConflictBranch[];     // { id, operationId, localRevision, baseSnapshotJson,
                                        //   localSnapshotJson, remoteSnapshotJson, remoteRevision,
                                        //   createdAt, status: open|resolved, resolution? }
  updatedAt: string;
}
```

- `transact` (`:467-493`) hace get, `update` puro y put/delete en **una** transacción
  `readwrite`. Si el callback lanza, aborta (y conserva la revisión anterior). Es sólido.
- `saveHere` (`:191-246`): es idempotente si el snapshot no cambió o si se repite el mismo
  `operationId` con el mismo contenido. Aplica CAS por `expectedLocalRevision`. Agrega
  una entrada `pending` con el **snapshot completo**.
- `recoveryJson` → `{format: "opforja.local-recovery.v1", document: record}`.
- `isQuotaError` distingue `QuotaExceededError`. El runtime informa "No hay espacio
  local; el trabajo sigue en memoria".

### 7.2 Quién escribe y cuánto

- `store/runtime.ts:1175-1178`: **cada edición confirmada** llama a
  `queueLocalDocumentCheckpoint`.
- `localDocumentSnapshotInput` (`runtime.ts:1190-1212`) exporta el modelo, rehidrata y
  reexporta el snapshot inicial, y exporta **todos los modelos de la pila de undo** (hasta
  `UNDO_LIMIT = 100`) a JSON indentado como `history`.
- `saveHere` agrega una entrada al `journal` con el snapshot completo. **Ningún código
  poda el journal**: `markSynchronized` y `resolveConflict` solo cambian estados. Un
  modelo de 40 kB editado 1.000 veces deja ≈40 MB en el journal, más 100 snapshots de
  undo reescritos en cada edición. Es un riesgo de cuota y de rendimiento.

### 7.3 Otros almacenamientos del navegador

- Cache Storage `opforja-portable-packages-v1` (paquetes) y el caché del service worker
  del lector.
- `localStorage`/`sessionStorage`: solo preferencias de UI (tutor, móvil, colapso del
  inspector). **Ningún modelo vive en localStorage.**

---

## 8. Sincronización y conflictos (`syncQueue.ts`)

Algoritmo (`synchronizeDocumentOnce`, `:52-143`):

1. Un documento con conflicto abierto no se sincroniza (`kind: "conflict"`).
2. Bucle: toma las entradas `pending` ordenadas; lee el remoto (`readRemote` →
   `cargarBaseRevisionBackend` → hidrata la base efectiva → `exportarModelo(…,
   carpetaIdDeJson)` como snapshot canónico).
3. Si algún pending tiene `snapshotJson === remote.snapshotJson`, era un commit previo
   cuyo acuse se perdió: `markSynchronized` y continúa.
4. Coalescencia: la operación es `{...newest, base: first.base}`. Si
   `remote.snapshotJson !== base.snapshotJson`, registra un conflicto con dos ramas
   (`recordConflict`).
5. `commitRemote` → `confirmarRevisionBackend` con el testigo vigente (CAS real en el
   servidor). Si la respuesta no coincide, entra en `resolveAfterUncertainCommit`: relee y
   decide entre synced, pending o conflicto.
6. `inFlight` deduplica sincronizaciones concurrentes por clave.

Propiedades y riesgos:

- La corrección depende de la **igualdad de strings** de snapshots canónicos. Funciona
  porque ambos lados pasan por `hidratar→exportar`, pero cualquier cambio en el orden de
  claves, en los defaults o en `sincronizarPuertos` entre versiones del cliente produce
  **conflictos falsos** o reenvíos. Comparar por hash canónico con claves ordenadas es más
  robusto.
- Cada sincronización crea una revisión y una versión remota nombrada `Copia local N`
  (`backend.ts:148-160`), lo que ensucia el historial.
- La resolución de conflictos es binaria (`local` | `remote`), sin merge semántico. La
  rama descartada queda en `conflicts[]` (`resolved`) con sus snapshots completos,
  también sin poda.
- La sincronización es **manual** (botón "Sincronizar" en
  `ui/DocumentPersistenceStatus.tsx`). En paralelo corren el autosave remoto (5 min) y el
  guardado Ctrl+S. El usuario ve estados distintos: `Guardado`/`Sin guardar` (chip) y
  `Guardado aquí`/`Sincronizado`/conflicto (control de documento)
  (`docs/uso-productivo.md:137-156`).

---

## 9. Workspace y carpetas

### 9.1 Contrato (`persistencia/workspace.ts:7-59`)

```ts
export interface CarpetaIndice { id: Id; nombre: string; padreId: Id | null; creadoEn: number; archivada?: boolean; archivadaEn?: string; }
export interface ModeloIndice {
  id: Id; carpetaId: Id | null; archivado?: boolean; archivadoEn?: string; archivadoAuto?: boolean;
  esBiblioteca?: boolean; esApunte?: boolean; ultimoUso?: string; descripcion?: string;
  autosalvado?: boolean; versiones?: VersionResumen[]; mapa?: MapaWorkspace;
}
export interface WorkspaceIndice { modelos: ModeloIndice[]; carpetas: CarpetaIndice[]; recientes: Id[]; busquedaGlobalUltima?: string; preferenciasUi?: PreferenciasUiUsuario; }
export interface WorkspacePersistido { indice: WorkspaceIndice; revision: number; }
export interface WorkspaceWrite { indice: WorkspaceIndice; revisionBase: number; }
```

- El índice es **un solo JSON por tenant**, reemplazado completo con CAS optimista
  (`revisionBase`). Mezcla estructura (carpetas, carpeta de cada modelo), catálogo
  (archivado, especies, versiones) y **preferencias de UI** (anchos de paneles, grid,
  `crucesPuenteSkill`, estado del mapa). Una preferencia de UI y una operación de carpeta
  compiten por el mismo CAS.
- `CarpetaIndice.creadoEn` es `number` (epoch ms); el resto de fechas son ISO string.
- `normalizarModeloIndice` (`workspaceStorage.ts:19-31`) **no conserva** `archivadoAuto`,
  `ultimoUso`, `descripcion` ni `autosalvado` aunque el tipo los declare. Se pierden al
  pasar por el servidor (`server/validatePersistence.ts` usa el mismo normalizador). Hoy
  la pérdida es latente: `ultimoUso` solo lo lee `autoArchivarPorEdad` (muerta) y el store
  no escribe esos campos en el índice. El tipo arrastra campos vestigiales y es la misma
  clase de bug de whitelist que en el modelo.
- `recientes`: el comentario dice "max 10", el store usa 10 y `restaurarArchivado` usa 12
  (`workspace.ts:501`), aunque esa función solo se usa en tests.

### 9.2 Operaciones

- Carpetas: `crearCarpeta`/`renombrarCarpeta` validan nombre (regex sin `\/:*?"<>|.$[]#`) y
  unicidad entre hermanas (`es-CL`). `eliminarCarpeta` en cascada **mueve los modelos a
  la raíz** (no los borra). `archivarCarpeta`/`restaurarCarpeta` propagan a
  descendientes.
- Movimiento: `movimientoModelos.ts`, con `validarMovimientoSinCiclo` y cortar/pegar
  mediante `PortapapelesWorkspace`.
- Especies: `marcarBiblioteca`/`marcarApunte` son excluyentes; `graduarApunte` (mover y
  quitar apunte, con rol biblioteca opcional); `reabrirModeloEnTaller` (rechaza
  bibliotecas); `especieDe` decodifica los dos booleanos. El comentario de `especie.ts`
  prohíbe migrar a un discriminado "antes del 3er flag". Es gobernanza autorreferente.
- Búsqueda global por nombre o descripción (≥3 caracteres), cruzando con los resúmenes.
- **Código muerto**: `autoArchivarPorEdad`, `carpetaTieneAncestro`,
  `listarModelosPorCarpeta`, `listarCarpetasPorPadre`, `BREADCRUMB_RAIZ` (solo interno),
  `restaurarArchivado` (tests), `normalizarWorkspaceIndice` (tests),
  `listarModelosGuardadosSeguro` (`store/runtime.ts`, devuelve `[]`).
  `workspaceDesdeModelo` devuelve `{carpetaId: "local"}`, marcado "Compatibilidad con
  ronda 5".

---

## 10. Flujos principales (extremo a extremo)

1. **Guardar (Ctrl+S)** — `store/persistencia.ts:210-440`: exige
   `revisionBasePorModelo[id]`; `exportarModelo(modelo, carpetaId)` →
   `construirModeloPersistido` (merge con el existente) → `confirmarRevisionBackend`
   (testigo) o `guardarModeloBackend`. Si hay `crearVersionAlGuardar`,
   `guardarVersionBackend` se lanza aparte, sin esperar respuesta. Luego fusiona el
   workspace devuelto con el local (`mergeWorkspaceBootstrap`). Hay guardas por
   `sessionEpoch`, por pestaña de origen y por revisión obsoleta.
2. **Autosave** — `store/persistencia.ts:571-670`: timer de 5 min; si `dirty` y existe
   `modeloPersistidoId`, hace `PUT /autosave` con `revisionBase`. La base efectiva pasa a
   ser el autosave si es más reciente.
3. **Checkpoint local** — cada edición: `queueLocalDocumentCheckpoint` → `saveHere` (§7.2).
4. **Sincronizar** — botón → `saveHere` → `synchronizeDocument` (§8).
5. **Abrir** — `cargarLocal(id)` → `cargarModeloBackend` → `hidratarModelo`. Si está
   offline: `obtenerEstadoSesionBackend` usa la identidad cacheada →
   `restoreLocalDocumentRecord` (`runtime.ts:1214-1295`) reconstruye la pestaña y el undo
   desde `history`.
6. **Importar JSON** — `migrateDocument` → `exportarModelo` → `importarJson`/pestaña nueva
   (§5.1).
7. **Iniciar tarea de agente** — `runtime.ts:296-360`: sube el JSON actual como autosave
   hasta tres veces, hasta que el hash de la base remota coincida con el local. Calcula
   `Base {revision, semanticHash, workingCopyHash, clientSequence, profileVersion}`.
8. **Compartir revisión / paquete portátil** — `reviewClient.create` con
   `expectedWorkingCopyHash`; `createPortablePackage` (una revisión).

---

## 11. Acoplamientos

- **Hacia `modelo/`**: `serializacion` usa `operaciones.validarFirmaEnlace`,
  `validarMultiplicidad`, `sincronizarPuertosTodosLosOpd`, `abanicos.validarAbanicoCanonico`,
  `modificadores.validarMetadatosEnlace`, `integridadReferencial` (que a su vez importa
  `checkers.contornoDeOpd/subprocesosInternosDeOpd`, `plegado`, `refinamientos` y
  `estereotipos`). Es correcto que el import reuse las reglas del kernel, pero la
  dependencia de `checkers` (diagnóstico) desde la hidratación es pesada.
- **Hacia `opl/`**: `perfilesExport.ts` importa `opl/exportarMarkdown`, es decir, la
  serialización depende del generador OPL.
- **Hacia `mesa/`**: `backend.ts` y `baseWitnessBrowser.ts` usan `mesa/baseWitness`
  (tipos) y `mesa/timestampOrder`. El servidor usa `mesa/validarPush` y
  `mesa/esSinDelta`. El vocabulario "mesa" (flujo CLI humano-agente) se filtró al núcleo
  de persistencia.
- **Hacia `agent/`**: `localRepository.ts` importa `ChangeSet`, `CommitReceipt`, `Base` y
  `SemanticInverse` para el journal. `persistencia/agentClient.ts` define todo el
  transporte del agente.
- **Desde UI directamente** (se saltan store y app): `ui/PersistenciaJson.tsx`
  (`documentMigration`), `ui/portable/*` (`readerCache`), `ui/agent/*` (`agentClient`),
  `ui/DialogoCargarModelo.tsx` (`especie`), 7 archivos UI en total importan
  `persistencia/*` y 14 de `ui/`+`render/` importan `serializacion/*`. Contradice la
  dirección `modelo → store → app → ui` de `AGENTS.md`.
- **Servidor**: `server/*` importa tipos y normalizadores de `persistencia/`
  (`workspaceStorage`, `modelos`, `workspace`, `especie`, `sessionIdentity`). Es un
  acoplamiento sano como contrato compartido, aunque vive en una carpeta de cliente.
- **Estado global oculto**: `backend.ts` mantiene `observedSessionIdentity`,
  `documentLocalIdentity`, `sessionBoundaryVersion` y `pendingSessionRequest` a nivel de
  módulo; `localRepository.ts` tiene `sharedLocalRepository` y `syncQueue.ts` tiene
  `inFlight`. Dificulta los tests y el razonamiento.

---

## 12. Olores de sobreingeniería y acreción (ejemplos concretos)

1. **Validadores whitelist a mano, campo por campo** (≈2.300 líneas). Cada campo
   opcional se repite en: tipo TS, validador, normalizador, spread condicional en
   `json.ts:164-193` y otro en `normalizarModelo` (`validarNormalizacion.ts:74-111`), más
   un test de roundtrip de 877 líneas que vigila olvidos. Hubo pérdidas reales (`orden`,
   `labelPositions`). *Alternativa*: esquema declarativo único (tabla de campos con tipo,
   default y "¿nuclear?"), del que se derivan validación, normalización y allowlist.
   También sirve dejar pasar las extensiones desconocidas en vez de descartarlas.
2. **Comentarios-bitácora de rondas y comités** en el código de contrato ("W5.1", "W6.5-a",
   "D6", "ronda 15.2", "corrección 5/8", "comité 2026-07-06", "SELLO cat-thinking
   `urn:fxsl:kb:icas-topoi`… presheaf `Vis : OPD^op → Set`", `apariencia.ts:345-349`).
   Rutas absolutas `/home/felix/projects/...` en docstrings (`validarNormalizacion.ts:22`,
   `validarOpds.ts:22`, `validarApariencias.ts:23`, `integridadReferencial.ts:22-24`).
   Aportan ruido, no contrato.
3. **Indirecciones sin valor**: `validarIntegridad.ts` (re-export),
   `validarHelpers.ts` (re-export de guards), `modeloParaExtremos` (modelo falso),
   `crearVersion` → `crearVersionResultado` → `construirVersionPersistible` (tres capas
   para una), `ResultadoVersion`/`ErrorVersion` con códigos que nadie consume.
4. **Duplicados**: `esRecord`, `ok`, `fallo` están redefinidos en `backend.ts`,
   `workspace.ts`, `movimientoModelos.ts`, `workspaceStorage.ts`, `documentMigration.ts`,
   `reviewClient.ts`, `portablePackage.ts`, `validarHelpers.ts` y `operaciones/helpers.ts`.
   También hay dos `normalizarVersionResumen` (`backend.ts:741-759`,
   `validarNormalizacion.ts:169-192`, más `server/validatePersistence.ts:201-211`), dos
   `validarMultiplicidad`, dos testigos de base y dos `esEstadoCargaSubmodelo`
   (`validarOpds.ts:223`, `validateSubmodels.ts:130`).
5. **Tres o cuatro fuentes de verdad** de la misma metadata: `carpetaId` (documento,
   record, índice); `versiones` (documento, record, índice); `archivado*` (documento,
   record, índice); `descripcion` (documento `Modelo.descripcion` y record
   `ModeloPersistido.descripcion`, que el guardado envía por separado como
   `descripcionModeloLocal`); `esApunte`/`esBiblioteca` (record e índice).
6. **Persistencia en tres carriles**: revisión CAS, autosave con base dual y testigo,
   local-first con journal y sync manual, más versiones. El usuario ve dos indicadores de
   estado distintos. Para un modelador de un solo usuario por documento bastaría un
   carril: IndexedDB write-behind con debounce, más un push con CAS por revisión al
   servidor, más snapshots con nombre.
7. **Ceremonias sin efecto**: `confirmedByOperator: true` siempre en la sincronización de
   la UI; `speciesOnCreate` obligatorio; "sello de procedencia" exigido estructuralmente
   (bundle sellado) sin atestación criptográfica (lo reconoce el propio código,
   `mesa/validarPush.ts:11-12`); `perfil` `canon-diagrama` anunciado para PNG sin que se
   aplique.
8. **Features de circunstancia en el núcleo del formato**: `NivelAutoridad =
   "operador-modelado" | "mesa" | "dt-seremi-legal"` (`tipos/extensiones.ts:158`)
   introduce una autoridad sanitaria chilena concreta en el contrato del modelador
   genérico, cuando el repo declara que no es fuente de modelos de dominio. También
   `crucesPuenteSkill` en las preferencias del workspace (contador de exportes e importes
   del "puente app↔skill") y `mesaExploracion` (fuentes, trazos y propuestas de un flujo
   humano-LLM) como parte del documento OPM.
9. **Cuatro mecanismos de reutilización solapados** en el documento: `estereotipos`
   (plantilla copiada + `estereotipoId`), `Entidad.anclaje` (referencia viva con
   `frozenAtHash`/`frozenAtPieza`), `submodelos` (referencia materializada con mapas de
   ids y duplicados v0) y `pieceLineage` (copia con linaje). Cada uno tiene validador,
   hashes de drift y UI propios.
10. **Paquete portátil multi-revisión (≤50) usado con una sola revisión**; perfil de lector
    con negociación de versión para un único perfil existente.
11. **Coste por edición desproporcionado**: `exportarModelo` (con recálculo de puertos) se
    llama para dirty, snapshot de pestaña y checkpoint local, y en el checkpoint se
    reserializan hasta 100 modelos del undo (§7.2). `listarModelosBackend` descarga e
    hidrata todos los modelos del tenant para mostrar un badge de cierre.
12. **Normalización que cambia datos dentro de validadores** (`Math.max(52, width)`,
    `round(x)` en estados; `console.warn` en `normalizarModelo`): la frontera "valida" y
    "corrige" a la vez, de forma dispersa.
13. **Gate de densidad duro** (25 apariencias por OPD) que **impide** exportar el
    documento canónico. Es una regla de estilo metodológico convertida en bloqueo de
    salida.
14. **Comentarios desactualizados que contradicen el código**: el saneo de `padreId`
    (`validarNormalizacion.ts:29-34` dice que `null` se cuelga de la raíz; el código lo
    conserva como Boceto), la cabecera de perfiles (§5.2) y `recientes` "max 10".

---

## 13. Recomendación por pieza (keep / simplify / cut)

| Pieza | Rec. | Justificación |
|---|---|---|
| Formato de documento (`DocumentoModelo`, tipos nucleares) | **keep** (migrar a v1) | Contrato de compatibilidad. Nueva `v1` sin catálogo dentro, `portId` en `AparienciaEnlace`, sin duplicados v0; migrador `v0→v1` explícito |
| Reglas OPM de §4.1-4.5 | **keep** | Sagradas; unificarlas en el kernel con una sola definición (por ejemplo, multiplicidad) |
| Reglas **[Forja]** en import (excepción → ambiental, requisito ⇔ estereotipo) | **simplify** | Verificar contra KORA; convertirlas en aviso (checker) en vez de rechazo que impide abrir |
| Hidratación todo-o-nada | **simplify** | Mantener rechazo duro para la integridad estructural, pero degradar las violaciones "blandas" a diagnósticos y reportar pérdidas como `documentMigration` |
| Validadores campo a campo | **simplify** | Esquema declarativo único → validación, normalización y allowlist |
| `normalizarModelo` + defaults dispersos | **simplify** | Un `canonicalize` punto fijo + hash canónico (claves ordenadas) |
| `validarIntegridad.ts`, `validarHelpers.ts` | **cut** | Re-exports |
| `perfilesExport.exportarModeloConPerfil`, `ATRIBUTOS_DE_PERFIL` | **cut/simplify** | Sin consumidores; dejar `emitirDocumentoCanonico` y una proyección `sinMeta(modelo)` |
| Gates de densidad y Bocetos en export | **simplify** | Convertirlos en advertencia con opción de continuar |
| `portablePackage` (sobre, digest, claves exactas, redacción con consentimiento) | **keep** | Buena ingeniería de integridad y privacidad |
| `portablePackage` multi-revisión, perfil negociable | **simplify** | Una revisión; el perfil = versión del formato |
| `readerCache` + lector offline con SW | **marginal** | Mantener solo si el lector portátil sigue siendo un requisito |
| `backend.ts` | **simplify** | Un `request<T>()` genérico con manejo 401 y un solo header de identidad; quitar el estado global de módulo; mover `SyncTransport` a sync |
| `listarModelosBackend?includePayload=1` + hidratar todo | **cut** | Pedir resúmenes; calcular `estadoCierre` en el servidor o al abrir |
| Autosave remoto + base dual + testigo `mesa-base.v1` | **simplify/cut** | Colapsar en un solo camino de guardado con CAS por revisión; si se mantiene autosave, que no sea otra "base" |
| `baseWitnessBrowser` + `mesa/baseWitness` | **simplify** | Una implementación isomórfica (Web Crypto está en Bun y en el navegador) |
| `localRepository` (transacción, partición por cuenta, conflictos de dos ramas) | **keep** el núcleo | Diseño correcto para trabajo offline |
| Journal de snapshots completos + `history` con 100 modelos de undo | **cut/simplify** | Guardar solo el último snapshot y la base; como mucho N entradas o deltas; podar al sincronizar |
| `syncQueue` | **keep** el algoritmo | Comparar hashes canónicos; no crear una versión por sync |
| `documentMigration` | **keep** | Patrón de import honesto; ejecutarlo al confirmar, no en cada tecla |
| `modelos.ts` (`construirModeloPersistido` merge) | **simplify** | Record = metadata de catálogo; un solo lugar para `carpetaId`/flags/versiones |
| `workspace.ts` | **simplify** | Separar estructura (carpetas), catálogo (flags) y preferencias de UI (otra clave u otro endpoint); borrar código muerto |
| `workspaceStorage.normalizarModeloIndice` + `ModeloIndice` | **fix/cut** | Descarta `archivadoAuto`, `ultimoUso`, `descripcion`, `autosalvado` (hoy vestigiales): quitarlos del tipo o conservarlos |
| Especies `esApunte`/`esBiblioteca` | **simplify** | Discriminado `rigor: "apunte" \| "modelo"` + `rol: "trabajo" \| "biblioteca"`, migrado en el borde |
| `movimientoModelos.ts`, `politicaVersiones.ts`, `autosalvado.ts` | **keep** | Pequeños, correctos y bien testeados |
| `versiones.ts` stubs (`restaurarVersion*`, `crearVersion`, `listarVersiones`, `eliminarVersion`) | **cut** | Muertos o solo en tests |
| `agentClient`, `reviewClient`, `humanChangeClient` | **move** | No son persistencia; ubicarlos en `agent/`/`review/` como transporte; quitar el `GET /session` previo a cada request |
| Extensiones meta (`notasMesa`, `anclasNormativas`, `declaracionesNoNucleares`, `mesaExploracion`, `fichaTrabajo`, `lentesConocimiento`, `ontologia`, `procedencia`) | **simplify** | Un único contenedor `extensiones: Record<string, unknown>` con validadores registrables, fuera del núcleo; conservar solo los que tengan uso humano comprobado |
| `NivelAutoridad "dt-seremi-legal"` | **cut** del contrato | Dato de dominio; debería ser texto libre o configuración |
| Reutilización (4 mecanismos) | **simplify** | Converger en "referencia viva" + "copia con linaje"; la plantilla de estereotipo como copia |

---

## 14. Esbozo de contrato para la reescritura

```
DocumentoOpm v1 (archivo .opforja.json o payload):
{ formato: "opforja.modelo.v1",
  modelo: { id, nombre, descripcion?, opdRaizId, nextSeq,
            entidades, estados, enlaces, abanicos, opds,          // núcleo OPM
            extensiones?: { [clave: string]: unknown } } }       // meta, validadores registrables
- Sin carpetaId/versiones/archivado en el documento (viven en el record de catálogo).
- ExtremoEnlace sin portId; AparienciaEnlace.{origenPortId, destinoPortId}.
- Estado sin esInicial/esFinal (solo designaciones).
- Abanico sin puertoEntidadId.
- canonicalize() = punto fijo; hash = sha256(canonicalJson(documento)) con claves ordenadas.
Migrador v0→v1: puro, con reporte { diferencias, datosNoRepresentados, originalRecuperable }.
Record de catálogo: { id, nombre, carpetaId, rigor, rol, archivadoEn?, revision, actualizadoEn, hashCanonico }.
Workspace: { carpetas[], recientes[] } con CAS; preferencias UI en un endpoint o clave aparte.
Local: IndexedDB { documento vigente, base remota {revision, hash}, ramas en conflicto } por (tenant,user,doc).
```

Compatibilidad obligatoria: leer **todo** documento v0 que hoy hidrata, incluidas las
formas legacy de §2.5, y los paquetes `opforja.portable-package` v1 existentes. El hash
de revisión compartida (`server/review/hash.ts`) cambiará con v1: hay que versionarlo
(por ejemplo `hashVersion: 1|2`) para no invalidar enlaces de revisión ya emitidos.

---

## 15. Partes de alta calidad para portar casi tal cual

1. `modelo/operaciones/helpers.ts:58-148` `validarFirmaEnlace`: tabla completa de firmas
   OPM, exhaustiva (`satisfies never`).
2. `serializacion/validarEstados.ts`: axiomas de estados y designaciones.
3. `modelo/integridadReferencial.ts`: invariantes cruzados (refinamiento visible, enlaces
   con apariencia, extremos visibles con plegado parcial, `ordenInzoom` interno).
4. `serializacion/validarEnlaces.ts:291-412` + `modelo/abanicos.ts:299-398`: abanicos con
   puerto exacto.
5. `serializacion/portablePackage.ts`: `canonicalJson`, `constantTimeEqual`,
   `assertExactKeys`, lectura que conserva bytes ante versiones desconocidas y redacción
   por consentimiento.
6. `persistencia/localRepository.ts:446-531` (`IndexedDbLocalRepositoryStorage.transact`)
   y el modelo de conflicto de dos ramas.
7. `persistencia/syncQueue.ts`: acuse por snapshot tras respuesta perdida,
   `resolveAfterUncertainCommit` y deduplicación en vuelo.
8. `persistencia/politicaVersiones.ts`, `persistencia/movimientoModelos.ts`,
   `persistencia/autosalvado.ts`.
9. `persistencia/documentMigration.ts`: `collectUnrepresented` y el reporte de pérdidas.
10. Tests: `json.test.ts` y `json-roundtrip-campos.test.ts` son un **corpus de regresión
    de contrato** muy valioso para validar el migrador v0→v1 (cada caso "preserva X" o
    "rechaza Y").

---

## 16. Límites de este estudio

- Se leyó completo todo `serializacion/` y `persistencia/`. De `store/persistencia.ts`,
  `store/runtime.ts`, `server/*` y `app/scripts/model-persistence-api.ts` se leyeron solo
  los tramos que tocan el contrato. La reconciliación del workspace
  (`mergeWorkspaceBootstrap`) y el `postgresRepository` completo no se auditaron.
- Los dos hallazgos **[verificado]** (multiplicidad `?` y no-idempotencia del export) se
  observaron con un test exploratorio en el scratchpad. El resto de los riesgos
  (crecimiento del journal, pérdida de campos del índice) se infieren del código, no se
  midieron en uso real.
- La conformidad ISO de las reglas marcadas **[Forja]** no se contrastó con el corpus
  KORA; hay que hacerlo antes de decidir si siguen siendo rechazo duro.
- Una suite verde no implica validación humana del flujo local-first, que es reciente
  (commit `8ada528`).
