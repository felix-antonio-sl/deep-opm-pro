# Dossier: backend y operación de opforja

Área: `app/src/server/` (7.740 líneas de fuente + 4.513 de tests), `app/scripts/model-persistence-api.ts`
(1.148), `app/scripts/bug-capture-api.ts`, `app/scripts/auth-cuenta.ts`, `app/scripts/probe-agent-provider.ts`,
`Dockerfile`, `docker-compose.yml`, `deploy/`, `webroot/`, `config/`.

Se leyó el código completo de todos los módulos listados (no solo nombres), los contratos que el
servidor importa de `src/agent/`, `src/modelo/changes/`, `src/mesa/`, `src/persistencia/`,
`src/serializacion/json.ts`, `src/modelo/review.ts`, los clientes del navegador que consumen la API
(`src/persistencia/{backend,agentClient,reviewClient,humanChangeClient}.ts`), el runbook
`docs/deploy/opforja.md`, la spec `docs/specs/auth-identidad-v1.md`, las secciones 6–8 de
`docs/specs/opforja-producto-integrado.md`, `docs/decisiones/equilibrio-llm.md`, `HANDOFF.md` y la
historia Git del área. Nada del repositorio se modificó.

---

## 0. Resumen ejecutivo

1. **Qué es.** Un backend Bun de un solo proceso (`model-api`) sobre PostgreSQL 16, detrás de Nginx
   (SPA estática) y Traefik (TLS). Expone una API JSON bajo `/__deep-opm/*` para: sesión/login,
   modelos, workspace (carpetas/recientes/especies), versiones, autosave, commit atómico de revisión,
   agente integrado (tareas LLM + cambios semánticos con recibo/inversa), revisión compartida por
   enlace y, en un sidecar aparte, captura de bugs a disco.
2. **Núcleo real para un modelador**: persistencia por documento con control optimista de revisión,
   versiones, login de un operador, y el circuito "cambio semántico validado → commit atómico →
   recibo + inversa". Esto último es la pieza de mayor calidad técnica del área y merece portarse
   como *el único camino de escritura*, no solo del agente.
3. **Lo acumulado**: tres caminos de escritura del mismo documento (`POST /modelos` legado,
   `POST /modelos/:id/revisiones` atómico, `POST /agent/changes/:id/commit`), estado de un mismo
   hecho guardado en hasta tres lugares (carpeta, versiones, autosave, archivado), un repositorio
   Postgres de modelos sin tests escrito *inline* en un script de arranque mientras los tests
   ejercen un repositorio en memoria que diverge, y un agente integrado de ~4.650 líneas que **no ha
   hecho una sola inferencia real** (HANDOFF.md) y que multiplica contadores de concurrencia
   (revision, semanticHash, workingCopyHash, clientSequence, profileVersion, intent.version,
   authorizationVersion, lease.fence, controller TTL, grant TTL).
4. **Cortables sin pérdida para el modelado**: `webroot/` y `config/` (evidencia OPCloud, no
   producto), el sidecar de captura de bugs que escribe en el árbol Git del servidor, la tabla
   `opforja_agent_results` (solo escritura), rutas y métodos muertos del agente.
5. **Reglas OPM** en esta área son pocas y casi todas delegadas al kernel (`src/modelo/…`); las que sí
   viven aquí (tipos de enlace autorizables por el agente, clasificación transformador/habilitador
   para huellas de dependencia, reglas de XOR y de refinamiento en las rutas humanas, distinción
   inferencia vs hecho declarado) están catalogadas en §13.

---

## 1. Topología de despliegue

```
Internet ──TLS──> Traefik (red externa `web`, certresolver=myresolver, headers CSP/HSTS)
                     │
                     ▼
          contenedor `opforja` (nginx:1.27-alpine, :8080)
            ├─ /                 → SPA estática (try_files → index.html, no-store)
            ├─ /assets/          → inmutable 1 año
            ├─ /revision/        → index.html (no-store, no-referrer)   [lector de revisión]
            ├─ /__deep-opm/{modelos,workspace}   → model-api:3001 (25 MB, 10 r/s)
            ├─ /__deep-opm/{session,auth/}       → model-api:3001 (2 r/s)
            ├─ /__deep-opm/agent/  (SSE, sin buffering, 128 KB; /pieces 3 MB) → model-api
            ├─ /__deep-opm/review/ (sin access_log)                          → model-api
            └─ /__deep-opm/bug-reports (auth_request → /session; 1 r/s; 25 MB) → bug-capture:3000
                     │  red interna `opforja-internal` (internal: true)
                     ▼
          `opforja-model-api` (oven/bun:1.3.10-slim, :3001)  ── red `agent-egress` ──> MiMo / OpenCode Zen
                     │
          `opforja-postgres` (postgres:16-alpine, volumen `opforja-postgres-data`)
          `opforja-bug-capture` (bun, :3000, bind mount ./docs/bugs del host)
```

Fuentes: `docker-compose.yml:1-122`, `deploy/nginx.conf:1-163`, `Dockerfile:1-78`.

En desarrollo no hay Postgres: `vite.config.ts` monta el **mismo** handler de producción sobre un
repositorio en memoria (`src/server/devModelPersistence.ts`) y el handler de bugs sobre el disco local.

---

## 2. Inventario de módulos

| Archivo | Líneas | Propósito | Valor | Veredicto |
|---|---:|---|---|---|
| `src/server/modelPersistence.ts` | 387 | Tipos de contrato (`PersistenciaSesion`, `ModelRevisionCommit`, `ModelPersistenceRepository`…), `evaluarPoliticaCommit`, enrutador `crearModelPersistenceFetchHandler` con gates de auth/agente/identidad | núcleo | simplificar (enrutador por tabla, errores tipados) |
| `src/server/persistenceSession.ts` | 156 | Cookie HMAC firmada, login scrypt con señuelo, resolver anónimo de pruebas | núcleo | conservar casi tal cual; retirar acuñación anónima en prod |
| `src/server/passwordHash.ts` | 39 | scrypt `node:crypto` N=16384 r=8 p=1, formato `scrypt$N$r$p$salt$hash` | núcleo | conservar tal cual |
| `src/server/persistenceHttp.ts` | 28 | `leerJsonRequest` (límite de bytes), `responderJson` | importante | conservar |
| `src/server/validatePersistence.ts` | 212 | Validación de payloads de modelo, workspace, versión, commit, autosave | núcleo | conservar la idea; derivar de un esquema único |
| `src/server/tokenSessionResolver.ts` | 55 | Carril Bearer para cliente externo (skill `mesa`) + encadenado de resolvers | importante | simplificar |
| `src/server/sessionResolverSelector.ts` | 38 | Decide si habilitar el carril Bearer (token ≥48, identidad `tenant:user`) | marginal | fusionar con el anterior |
| `src/server/devModelPersistence.ts` | 176 | Middleware Vite: mismo handler + repo memoria + streaming de SSE | importante | conservar el principio "mismo handler en dev" |
| `src/server/repoMemoria.ts` | 359 | Implementación completa en memoria del contrato de repositorio + auth en memoria | importante | reemplazar por Postgres real en tests o por un único adaptador SQL (p. ej. PGlite) |
| `scripts/model-persistence-api.ts` | 1.148 | **Repositorio Postgres de producción + migraciones 1–7 + arranque Bun.serve + logging** | núcleo | extraer a `src/server/postgres/*`, testear, consolidar esquema |
| `src/server/agent/service.ts` | 23 | Composición: provider, gateway, runtime, variants, http | accesorio | depende del destino del agente |
| `src/server/agent/http.ts` | 323 | Rutas `/__deep-opm/agent/*` (status, tasks, changes, pieces, refinements) | importante/acreción | simplificar |
| `src/server/agent/changeGateway.ts` | 552 | Prepare/commit con grant, revalidación, inversa canónica, recibo, undo | **núcleo (como circuito de cambios)** | portar el núcleo, quitar grant |
| `src/server/agent/commitGrant.ts` | 123 | Grant de commit 15 s, token hasheado, `hashCommitRequest`, `stableJson` | acreción parcial | conservar `stableJson`/hash de identidad; cortar grant |
| `src/server/agent/humanChanges.ts` | 72 | Preparar cambios humanos (pieza, refinamiento) con el mismo circuito | importante | conservar, sacar de `/agent` |
| `src/server/agent/taskRuntime.ts` | 462 | Bucle LLM: claim/lease, reserva de presupuesto, streaming, tools, suspensión | marginal hoy (no validado) | reescribir mínimo si se conserva el agente |
| `src/server/agent/tools.ts` | 1.200 | 9 herramientas LLM + scoping + validación de cierre + huellas de dependencia + búsqueda en corpus | marginal/acreción | simplificar fuerte |
| `src/server/agent/context.ts` | 237 | Contexto JSON ≤24 KB (hechos seleccionados, enlaces, OPL del alcance) | importante si hay agente | conservar idea |
| `src/server/agent/variants.ts` | 205 | Variantes como overlays; preparar incorporación `inc:<hash>`; `discard` sin ruta | acreción | cortar variantes persistidas |
| `src/server/agent/opencodeProvider.ts` | 308 | Adaptador AI SDK OpenAI-compatible, URL fijada, sin logging de cuerpos | importante si hay agente | conservar |
| `src/server/agent/provider.ts` | 103 | Contrato neutral de proveedor (mensajes, eventos, uso) | importante si hay agente | conservar |
| `src/server/agent/config.ts` | 91 | Config por env, tarifas verificadas, disponibilidad | marginal | simplificar |
| `src/server/agent/events.ts` | 80 | SSE acotado 25 s con cursor, `snapshot-required` ante hueco | importante si hay agente | conservar |
| `src/server/agent/repository.ts` | 146 | Contratos de registros de tarea/cambio/variante y transacción | importante | reducir |
| `src/server/agent/postgresRepository.ts` | 421 | Tablas agénticas + `persistModelInTransaction` (escritor compartido del modelo) | núcleo (el escritor) / acreción (resto) | separar el escritor del modelo |
| `src/server/agent/memoryRepository.ts` | 176 | Espejo en memoria | importante (tests) | ver `repoMemoria` |
| `src/server/agent/sourceAccess.ts` / `sourceAdapters.ts` | 60 / 53 | Lectura de fuentes del documento por párrafo, versión sha256 | marginal | simplificar a una función |
| `src/server/agent/instructions.ts` | 12 | Prompt de sistema del agente | marginal | conservar si hay agente |
| `src/server/review/*` | 889 | Revisión compartida inmutable, anotaciones anónimas, resoluciones | importante (colaboración) | simplificar (una tabla + JSON) |
| `src/server/bugCapture.ts` + `bugIndex.ts` | 226 + 528 | Captura de bugs con screenshots a `docs/bugs` y regeneración de INDEX/HISTORY.md | acreción (meta-tooling) | cortar del producto |
| `scripts/bug-capture-api.ts` | 39 | Servidor node:http del sidecar | acreción | cortar |
| `scripts/auth-cuenta.ts` | 108 | CLI `crear [--tenant]`, `reset`, `listar` cuentas | núcleo operativo | conservar |
| `scripts/probe-agent-provider.ts` | 195 | Sonda sintética de proveedor (catálogo + 2 turnos con herramienta fija) | marginal | conservar solo si se conserva el agente |
| `Dockerfile` | 78 | 5 stages: deps, builder, bug-capture, model-api, runner nginx | importante | simplificar a 2 imágenes |
| `docker-compose.yml` | 122 | 4 servicios, 3 redes, 1 volumen, labels Traefik | importante | simplificar (quitar bug-capture) |
| `deploy/deploy.sh` | 48 | Circuito canónico: corpus → compose up --wait → curl healthz/401/SHA en bundle | núcleo operativo | conservar |
| `deploy/nginx.conf` | 163 | Rate limits por IP real, proxies por ruta, cabeceras | importante | simplificar a un bloque `/__deep-opm/` |
| `deploy/backup-opforja-db.sh` + `systemd/*` | 37 + 2 units | pg_dump diario 03:30 America/Santiago, retención 14 d | núcleo operativo | conservar (parametrizar ruta) |
| `webroot/` | 2 archivos | `index.html` de OPCloud (con Google Analytics) y favicon descargados por `setup.sh` | acreción (evidencia ajena) | cortar del repo del producto |
| `config/` | 4 JSON | `firebase.json`, `routes.json`, `assets.json`, `edx.config.json` de OPCloud | acreción (evidencia ajena) | cortar del repo del producto |

---

## 3. Contratos de datos (textuales cuando son contrato)

### 3.1 Sobre del documento persistido (`src/serializacion/json.ts:19-39`)

```ts
const FORMATO = "deep-opm-pro.modelo.v0";

export interface DocumentoModelo {
  formato: typeof FORMATO;
  modelo: Modelo;
  carpetaId?: Id | null;
}
```

`exportarModelo` serializa con `JSON.stringify(documento, null, 2)` tras `sincronizarPuertosTodosLosOpd`
y `normalizarModelo`. Es lo que viaja en `ModeloPersistido.json` y lo que se guarda en
`opforja_models.payload` (JSONB). **Consecuencia de contrato**: JSONB no preserva bytes ni orden de
claves; por eso toda huella que deba ser estable (`workingCopyHash` del gateway,
`canonicalWorkingCopyHash` de revisión) se calcula sobre `exportarModelo(hidratarModelo(json))`, no sobre
el texto crudo (`src/server/agent/changeGateway.ts:528-531`, `src/server/review/hash.ts:8-22`). El testigo
de base de `mesa` (`MesaBaseWitnessV1`) sí hashea el texto que devuelve el servidor (`payload::text`),
lo que funciona porque ambos lados leen el mismo texto normalizado por Postgres.

### 3.2 Registro de modelo (`src/persistencia/modelos.ts:5-37`)

```ts
export interface ResumenModeloPersistido {
  id: string;
  nombre: string;
  descripcion: string;
  creadoEn: string;
  actualizadoEn: string;
  carpetaId?: string | null;
  ultimaApertura?: string;
  autosalvado?: boolean;
  archivado?: boolean;
  archivadoEn?: string;
  archivadoAuto?: boolean;
  esBiblioteca?: boolean;
  esApunte?: boolean;
  versiones?: VersionResumen[];
  crearVersionAlGuardar?: boolean;
  revision?: number;
  estadoCierre?: EstadoCierreModelo; // derivado, no persistido
}

export interface ModeloPersistido extends ResumenModeloPersistido {
  json: string;
}
```

`VersionResumen` (`src/modelo/tipos/modelo.ts`): `{ id, creadoEn, nombre, descripcion?, preservar?,
modeloPayloadKey, bytes }`. En el commit atómico `modeloPayloadKey` se fuerza a `version.id` y `bytes`
se calcula en servidor (`src/server/validatePersistence.ts:156-166`): `modeloPayloadKey` es un vestigio
de la época IndexedDB.

`Especie` se decodifica de dos booleanos (`src/persistencia/especie.ts:11-17`):
`"apunte" | "modelo" | "biblioteca"`. **Postgres no persiste `esApunte`/`esBiblioteca` en el registro
del modelo**; viven solo en el índice del workspace (`src/mesa/especieWorkspace.ts:9-21`).

### 3.3 Workspace (`src/persistencia/workspace.ts`)

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

Obsérvese `CarpetaIndice.creadoEn: number` (epoch) frente al resto de marcas ISO `string`.

### 3.4 Sesión (`src/server/modelPersistence.ts:16-24`, `src/server/persistenceSession.ts:14-21`)

```ts
export interface PersistenciaSesion {
  tenantId: string;
  userId: string;
  auth?: boolean;                       // cookie de login o Bearer
  authKind?: "operator" | "agent";      // navegador vs carril Bearer
  setCookie?: string;
}
interface TokenSesionFirmado { tenantId: string; userId: string; iat: number; exp: number; auth?: boolean; nonce?: string; }
```

Cookie `opforja_session=<base64url(JSON)>.<HMAC-SHA256 base64url>`; HttpOnly, SameSite=Lax, Secure si
`x-forwarded-proto=https` o host no local. Cabecera de identidad esperada:
`x-opforja-session-identity: encodeURIComponent(tenantId):encodeURIComponent(userId)`
(`src/persistencia/sessionIdentity.ts:1-14`).

### 3.5 Commit atómico de revisión (`src/server/modelPersistence.ts:69-93`, `src/mesa/baseWitness.ts:25-38`)

```ts
export type ModelRevisionBase = { kind: "new" } | { kind: "existing"; witness: MesaBaseWitnessV1 };
export interface ModelRevisionCommit {
  model: ModeloPersistido;
  version: VersionResumen;
  base: ModelRevisionBase;
  speciesOnCreate?: Exclude<Especie, "biblioteca">;
  graduation?: { kind: "graduate"; folderId: string | null; role: "work" | "library" };
  reopening?: { kind: "reopen" };
  confirmedByOperator?: boolean;
}
export interface CommittedModelRevision { model: ModeloPersistido; version: VersionResumen; workspace: WorkspacePersistido; }

export interface MesaBaseWitnessV1 {
  format: "opforja.mesa-base.v1";
  modelId: string;
  saved: { revision: number; updatedAt: string; sha256: string };
  autosave: { createdAt: string; sha256: string } | null;
  source: "saved" | "autosave";
}
```

Ley de base (`src/mesa/baseWitness.ts:130-148`): la base efectiva es el autosave **solo si**
`autosave.createdAt > saved.updatedAt`; el servidor normaliza marcas para mantener esa ley
(`autosaveTimestampAfter` = `updatedAt + 1 ms`).

### 3.6 Contratos del circuito de cambios y del agente (`src/agent/contracts.ts`, `src/modelo/changes/types.ts`)

```ts
export type Target = { kind: "current"; documentId: string } | { kind: "variant"; documentId: string; variantId: string };
export interface Base { revision: number; semanticHash: string; workingCopyHash: string; clientSequence: number; profileVersion: string; }
export interface Dependency { kind: "element" | "source" | "assumption" | "decision"; id: string; version: string; }
export interface TaskIntent {
  id: string; version: number; target: Target; outcome: string; scopeIds: string[]; exclusions: string[];
  allowedSourceIds: string[]; sufficiency: string[]; authority: "read" | "propose" | "edit";
  authorizationVersion: number; rejectedAlternatives: Array<{ description: string; reason: string }>;
}
export interface ChangeSet extends SemanticChangeBatch {   // { id, operations: SemanticOperation[] }
  taskId: string | null; actorId: string; intentVersion: number | null; target: Target; base: Base;
  readIds: Id[]; writeIds: Id[]; dependencies: Dependency[]; explanation: string;
}
export interface CommitReceipt { changeId: Id; target: Target; previousRevision: number; revision: number; appliedOperationIds: string[]; inverseId: Id; }
export interface TaskEvent { id: Id; taskId: Id; sequence: number; kind: "status" | "result" | "decision" | "committed" | "invalidated"; revision: number | null; resultId: Id | null; }
```

```ts
// src/modelo/changes/types.ts
export type SemanticOperation =
  | { kind: "createObject"; id; opdId; name; position } | { kind: "createProcess"; id; opdId; name; position }
  | { kind: "createState"; id; entityId; name }
  | { kind: "renameEntity"; entityId; beforeName; afterName } | { kind: "renameState"; stateId; beforeName; afterName }
  | { kind: "createProceduralLink"; id; opdId; source: ExtremoEnlace; destination: ExtremoEnlace; linkType: TipoEnlace; label? }
  | { kind: "deleteLink"; linkId } | { kind: "deleteState"; stateId } | { kind: "deleteEntity"; entityId }
  | CreateXorExclusionOperation | CreateRefinementOperation
  | CopyPieceOperation | ConnectPieceReferenceOperation | ReplaceSubmodelReferenceOperation;
// todas con { operationId: string; preconditions: OperationPrecondition[] }
export interface SemanticInverse { id: Id; sourceChangeId: Id; patches: Array<{ path: ModelPath; expected: ModelSlot; restore: ModelSlot }>; }
export type ChangeRejectionCode = "invalid-change" | "precondition-failed" | "id-collision" | "out-of-scope" | "external-owned" | "invalid-model";
```

Registros durables (`src/server/agent/repository.ts:43-94`): `AgentTaskRecord` (estado, intención,
presupuesto/uso, perfil, **transcript completo del proveedor**, `controller`, `lease {owner, fence,
expiresAt}`, `results[]`, `pendingDecision`, `pendingCommit`, `dependencies`, `sources`),
`AgentChangeRecord { change, requestHash, undoOf?, reversedBy?, status: "prepared"|"committed"|"rejected",
receipt, inverse, grant }`, `AgentVariantRecord { id, taskId, base, operations, state: "open"|"incorporated"|"discarded" }`.

Máquina de estados de tarea (`src/agent/taskState.ts:1-26`): `preparing → working → awaiting-decision |
suspended | completed | cancelled | failed`; `awaiting-decision|suspended → preparing`. Presupuesto por
defecto (`src/agent/taskState.ts:62-69`): 12 llamadas a modelo, 40 a herramientas, 120.000 tokens de
entrada, 16.000 de salida, 1 USD, 600 s.

Grant (`src/server/agent/commitGrant.ts:7-24`): `CommitGrant { id, token, kind: "review"|"delegated",
changeId, taskId, actorId, target, base, controllerId, intentVersion, authorizationVersion, leaseFence,
expiresAt }`; se persiste `Omit<CommitGrant,"token"> & { tokenHash, consumedAt }`.

### 3.7 Revisión compartida (`src/modelo/review.ts:5-96`)

`ReviewAnchor = {kind:"model"} | {kind:"opd"|"entity"|"state"|"link"; id}`; `ReviewAnnotation {id, shareId,
documentId, revision, anchor, text, actorId, actorLabel, actorKind: "reader"|"operator", createdAt,
resolutions[]}`; `ReviewResolution {id, actorId, actorLabel, at, revision, outcome: "addressed"|"kept", note,
anchorPresent}`; `ReviewShareRecord {id, tenantId, documentId, ownerId, tokenHash, createdAt, revokedAt,
permissions: {annotate}, snapshot: {revision, source, capturedAt, modelName, modelJson, includedSourceIds}}`;
vistas `ReviewShareOwnerView` y `ReviewReaderView` (esta última con `omittedSourcesCount` numérico, nunca ids).

### 3.8 Reporte de bug (en disco, `src/server/bugCapture.ts:70-81`)

`docs/bugs/BUG-<yyyymmddThhmmssZ>-<hex6>/{payload.json, report.md, screenshots/NN-nombre.ext}`; más
`INDEX.md`, `HISTORY.md` y `statuses.json` regenerados por `bugIndex.ts`.

---

## 4. API HTTP completa

Orden de evaluación del enrutador (`src/server/modelPersistence.ts:189-360`):
1. `GET /healthz` → `{ok}` 200/503 (ping `SELECT 1`).
2. `/__deep-opm/review/<token>…` (no `grants`) → handler público, **antes de cualquier sesión**.
3. `POST /__deep-opm/auth/login|logout`.
4. Cualquier otra ruta fuera de la lista → 404.
5. Resolver sesión; con `requireAuth` y `auth !== true` → 401 sin `Set-Cookie`.
6. Sesión `agent` (Bearer) fuera de `GET *` y `POST /modelos/:id/revisiones`, o en `/agent/*`/`/review/grants` → 403.
7. Sesión `operator` en ruta ≠ `/session` sin cabecera de identidad coincidente → 401.
8. `touchSession` (upsert tenant+user en **cada** request) y despacho.
9. Errores: `PersistenciaConflictError` → 409; mensaje que empieza por "Payload|JSON|Modelo persistido|Revision
   de modelo|Workspace persistido|Version persistida|Autosalvado persistido" → 400; resto → 500
   (`esErrorPayload`, `modelPersistence.ts:379-387`).

### 4.1 Sesión y autenticación

| Método y ruta | Cuerpo | Respuesta |
|---|---|---|
| `POST /__deep-opm/auth/login` | `{email, password}` | 200 `{session:{tenantId,userId,auth:true}}` + Set-Cookie 30 días con `nonce`; 401 `"Credenciales inválidas"` uniforme (verificación contra `HASH_SENUELO` si no existe la cuenta) |
| `POST /__deep-opm/auth/logout` | — | 200 `{ok:true}` + cookie expirada (**sin revocación en servidor**) |
| `GET /__deep-opm/session` | — | 200 `{session:{tenantId,userId,auth?}}`; 401 sin login. No exige cabecera de identidad; nginx lo usa como `auth_request` de bug-reports |

### 4.2 Modelos, versiones, autosave, revisiones

| Método y ruta | Cuerpo | Respuesta / semántica |
|---|---|---|
| `GET /modelos[?includePayload=1]` | — | `{modelos: ResumenModeloPersistido[] \| ModeloPersistido[]}` ordenados por `actualizado_en DESC`. El SQL **siempre** selecciona `payload::text`; el navegador pide siempre `includePayload=1` e hidrata cada modelo para calcular `estadoCierre` (`src/persistencia/backend.ts:259-270, 624-630`) |
| `GET /modelos/:id` | — | `{modelo}` / 404 |
| `POST\|PUT /modelos` | `{modelo}` o el modelo plano | **camino legado**: CAS por `revision` (`FOR UPDATE`); crear exige `revision` ausente; `autosalvado:true` upsertea autosave, `false` lo borra. 200 `{modelo}` / 409 |
| `DELETE /modelos/:id` | — | borra autosave, versiones, modelo (FK CASCADE arrastra agente y revisión) |
| `POST /modelos/:id/revisiones` | `ModelRevisionCommit` | **camino atómico** (modelo + versión + workspace en una transacción): valida testigo de base, política (`evaluarPoliticaCommit`), biblioteca solo-lectura, sin-delta, graduación/reapertura; poda versiones. 200 `CommittedModelRevision` / 409 |
| `GET /modelos/:id/versiones` | — | `{versiones: VersionResumen[]}` |
| `GET /modelos/:id/versiones/:vid` | — | `{modeloId, version, json}` |
| `POST\|PUT /modelos/:id/versiones` | `{version, json\|payload}` | inserta (409 si existe) y poda log-scale (máx. `MODEL_MAX_VERSIONS_PER_MODEL`=30) |
| `DELETE /modelos/:id/versiones/:vid` | — | 200/404 |
| `GET /modelos/:id/autosave` | — | `{modeloId, creadoEn, json}` / 404 |
| `POST\|PUT /modelos/:id/autosave` | `{json, revisionBase, creadoEn?}` | exige `revisionBase == revision`; rechaza autosave no posterior al vigente; normaliza `creadoEn > actualizadoEn`; marca `autosalvado=true` |
| `GET /workspace` | — | `WorkspacePersistido` (índice vacío, revisión 0 si no existe) |
| `POST\|PUT /workspace` | `WorkspaceWrite` | CAS por `revisionBase`; 409 si desactualizado |

### 4.3 Agente integrado y cambios humanos (`src/server/agent/http.ts:31-183`)

Todas exigen sesión `operator`, `Origin`/`sec-fetch-site` del mismo origen (`isSameOriginRequest`,
`http.ts:186-197`), JSON ≤128 KB (≤2 MiB+16 KB en `/pieces`), respuestas `cache-control: no-store`.

| Método y ruta | Cuerpo / query | Efecto |
|---|---|---|
| `GET /agent/status` | — | `{available, reason, profile (matriz de capacidades), model, budgetIncrement}` |
| `GET /agent/tasks?documentId` | — | `{tasks: TaskView[]}` del actor |
| `POST /agent/tasks` | `StartTaskRequest {documentId, outcome, scopeIds, allowedSourceIds, exclusions, sufficiency, authority, controllerId, clientSequence, workingCopyHash}` | 202 `{task}`; 503 si no disponible; `propose` crea variante |
| `GET /agent/tasks/:id?documentId` | — | recupera expirados y devuelve `{task, cursor}` |
| `GET /agent/tasks/:id/events?documentId&after` (o `Last-Event-ID`) | — | SSE `event: task` con `id: sequence`; conexión ≤25 s, sondeo 500 ms; `snapshot-required` ante hueco/cursor adelantado/error |
| `POST /agent/tasks/:id/instructions` | `{documentId, text, expectedVersion}` | corrección: `intent.version++`, invalida en curso |
| `POST /agent/tasks/:id/continue` | `{documentId, answer?, acceptReservedUsage?, extendBudget?}` | reanuda |
| `POST /agent/tasks/:id/stop` | `{documentId}` | **Detener**: `cancelled`, `authorizationVersion++`, `fence++`, aborta |
| `POST /agent/tasks/:id/presence` | `{documentId, controllerId, clientSequence, workingCopyHash}` | latido del navegador controlador (TTL 45 s) |
| `POST /agent/tasks/:id/grants` | `{documentId, changeId, kind, …}` | grant ligado a tarea (**no lo usa el cliente**; usa la variante de `/changes`) |
| `GET /agent/changes/:id?documentId` | — | `{change, status, diff (con OPL antes/después), validation}` revalidado sobre la base vigente |
| `GET /agent/changes/:id/receipt?documentId` | — | `{receipt, applied: {kind, receipt, inverse, modelJson, base} \| null}` |
| `POST /agent/changes/:id/prepare` | `{documentId}` | variante → candidato `inc:<sha>` sobre el vigente |
| `POST /agent/changes/:id/grants` | `{documentId, kind: "review"\|"delegated", controllerId, clientSequence, workingCopyHash}` | `{grant}` (TTL 15 s) |
| `POST /agent/changes/:id/commit` | `{documentId, grant}` | 200 `{kind:"committed", receipt, inverse, modelJson, base, recovered}`; 403 `authority-denied`; 409 resto |
| `POST /agent/changes/:id/undo` | `{documentId, controllerId, clientSequence, workingCopyHash}` | prepara cambio `undoOf` sin operaciones |
| `POST /agent/changes/:id/reapply` | idem | prepara deshacer del deshacer |
| `POST /agent/pieces` | `{documentId, kind: copy\|reference\|update, sourceJson (≤1 MiB), pieceId, function, target, includeBoundaryChange?, controllerId, clientSequence, workingCopyHash}` | cambio humano preparado + `manifest/losses/comparison` |
| `POST /agent/refinements` | `{documentId, entityId, opdId, refinementType, mode?, question, justification, controllerId, clientSequence, workingCopyHash}` | cambio humano preparado + `frontier {declarations, preserved}` |

### 4.4 Revisión compartida (`src/server/review/service.ts`)

| Método y ruta | Quién | Efecto |
|---|---|---|
| `GET /review/<token>` (token `^[A-Za-z0-9_-]{40,64}$`) | anónimo | `ReviewReaderView` (modelo proyectado sin notas de mesa, URLs saneadas, solo fuentes incluidas) |
| `POST /review/<token>/annotations` | anónimo | `{anchor, text ≤5000}` → 201 si `annotate` y el referente existe en la instantánea |
| `GET /review/grants?documentId` | autor | `{shares: ReviewShareOwnerView[]}` |
| `POST /review/grants` | autor | `{documentId, includedSourceIds, annotate, expectedRevision, expectedWorkingCopyHash}` → 201 `{share, token}` (token solo una vez; se guarda su sha256) |
| `GET /review/grants/:shareId?documentId` | autor | vista de lectura con anotaciones |
| `DELETE /review/grants/:shareId?documentId` | autor | revoca |
| `POST /review/grants/:shareId/annotations/:aid/resolve?documentId` | autor | `{outcome: addressed\|kept, note}`; registra `anchorPresent` contra el modelo **vigente** |

Respuestas con `cache-control: no-store, private`, `referrer-policy: no-referrer`; el log de acceso
de model-api redacta los tokens (`scripts/model-persistence-api.ts:1032-1042`), nginx apaga `access_log`.

### 4.5 Captura de bugs (sidecar)

| Método y ruta | Efecto |
|---|---|
| `GET /__deep-opm/bug-reports` | ledger `{active, history, counts}` leído del disco |
| `POST /__deep-opm/bug-reports` | `{text, screenshots: [{name, type, dataUrl png/jpeg/webp}] ≤12, context}` ≤25 MB → escribe carpeta `BUG-*` y regenera INDEX/HISTORY |

---

## 5. Esquema PostgreSQL

Migraciones versionadas en `opforja_schema_migrations(version, nombre, aplicado_en)`, aplicadas en el
arranque, cada una en su transacción (`scripts/model-persistence-api.ts:68-390`).

| Migración | Contenido |
|---|---|
| 1 `base_persistencia_modelos` | `opforja_tenants(id, creado_en)`, `opforja_users(id, tenant_id, creado_en)`, `opforja_models(... payload JSONB)` con backfill `tenant-legacy`/`user-legacy` y PK `(tenant_id,id)`, `opforja_workspaces(tenant_id PK, owner_id, actualizado_en, indice JSONB)`, `opforja_model_versions(PK tenant_id,modelo_id,id; payload JSONB; preservar; modelo_payload_key; bytes)`, `opforja_model_autosaves(PK tenant_id,modelo_id; payload JSONB)` |
| 2 `integridad_referencial_y_operacion` | backfill de tenants/users desde todas las tablas, purga de huérfanos, FKs `ON DELETE CASCADE` a tenant/modelo, FKs a users, índices por owner/fecha |
| 3 `optimistic_locking_modelos` | `revision INTEGER NOT NULL DEFAULT 1` + índice |
| 4 `auth_identidad` | `opforja_accounts(id, email UNIQUE, password_hash, user_id FK, creado_en, ultimo_login_en)`, `opforja_account_tenants(account_id, tenant_id, rol DEFAULT 'owner', creado_en)` |
| 5 `optimistic_locking_workspace` | `opforja_workspaces.revision` |
| 6 `persistencia_agente_atomica` | `opforja_agent_tasks`, `opforja_agent_changes`, `opforja_agent_events(sequence>0, UNIQUE id)`, `opforja_agent_results`, `opforja_agent_variants` — todas con `payload JSONB` y FK al modelo (`src/server/agent/postgresRepository.ts:21-88`) |
| 7 `revision_compartida_inmutable` | `opforja_review_shares(token_hash UNIQUE, permissions JSONB, snapshot JSONB)`, `opforja_review_annotations(payload JSONB)`, `opforja_review_resolutions(payload JSONB)` (`src/server/review/postgresRepository.ts:25-70`) |

Columnas de `opforja_models`: `tenant_id, owner_id, id, nombre, descripcion, carpeta_id, creado_en,
actualizado_en, ultima_apertura, autosalvado, archivado, archivado_en, archivado_auto,
crear_version_al_guardar, versiones JSONB, revision, payload JSONB`.

Observaciones de esquema:
- **Marcas de tiempo como `TEXT` ISO**; el orden se resuelve en código (`isTimestampAfter`).
- **Estado triplicado**: la carpeta vive en `payload.carpetaId`, en `opforja_models.carpeta_id` y en
  `workspace.indice.modelos[].carpetaId`; las versiones en `opforja_model_versions`, en la columna
  legada `opforja_models.versiones` (usada como `COALESCE` de respaldo, `model-persistence-api.ts:495-507`)
  y en `workspace.indice.modelos[].versiones` (`registrarVersionEnWorkspace`); `autosalvado`/`archivado*`
  en columna y en índice; la especie solo en el índice.
- **Tres técnicas de escritura JSONB**: base64 + `convert_from(decode(...))::jsonb` en modelos/versiones/
  workspace; `${JSON.stringify(x)}::jsonb` en agente y revisión; y un `asJson` que parsea dos veces por si
  el valor quedó doblemente codificado (`src/server/review/postgresRepository.ts:327-333`). Es síntoma
  de un problema de binding no resuelto de raíz.
- `opforja_agent_results` se escribe en cada `putTask` (`postgresRepository.ts:180-186`) y **nunca se lee**:
  los resultados ya viajan en `opforja_agent_tasks.payload`.
- Todo el estado agéntico es un documento JSONB por fila; las columnas indexadas son solo claves y estado.

---

## 6. Autenticación y sesión

- **Registro cerrado, un operador** (spec `auth-identidad-v1.md` D1–D4). Cuentas solo por CLI
  `auth-cuenta.ts` (`crear <email> [--tenant <id>]` para adoptar un tenant anónimo previo, `reset`,
  `listar`); contraseña por stdin, ≥8 caracteres.
- **Login**: email normalizado; `verifyPassword` siempre (señuelo) para uniformar costo y respuesta
  (`persistenceSession.ts:80-85`); cookie firmada con `auth:true` y `nonce` (rotación), 30 días.
- **Gate**: `MODEL_REQUIRE_AUTH !== "false"` ⇒ activo (fail-closed, `model-persistence-api.ts:396`).
  El secreto es fail-fast: ≥32 caracteres y distinto del default histórico (`:60-64`).
- **Cabecera de identidad** (`modelPersistence.ts:242-248`): el navegador envía la identidad que cree
  tener; si la cookie resuelve otra, 401. Evita que una pestaña con datos locales de la cuenta A
  escriba bajo la cuenta B tras un cambio de sesión y, de paso, actúa como defensa CSRF (cabecera
  personalizada ⇒ preflight). Es un diseño bueno y barato.
- **Carril Bearer externo** (`tokenSessionResolver.ts`, `sessionResolverSelector.ts`): `MODEL_AGENT_TOKEN`
  (≥48) + `MODEL_AGENT_IDENTITY="tenant:user"` otorgan una sesión `authKind:"agent"` limitada a lecturas y
  al commit atómico de revisiones; lo usa la CLI `mesa` (`scripts/mesa-cli.ts`) desde la skill KORA/OpForja.
  Comparación en tiempo constante. Es un token estático compartido por proceso, ligado a un único
  tenant/usuario.
- **Límites reales**: el logout y el reset de contraseña no invalidan cookies ya emitidas (tokens sin
  estado, sin lista de revocación ni versión de credencial); no hay roles ni multiusuario por tenant
  (`rol` fijo `'owner'`); la fuerza bruta la acotan nginx (2 r/s) y scrypt.
- **Deuda del modo anónimo**: `crearCookieSessionResolver` sigue acuñando tenants aleatorios cuando no
  hay cookie (`persistenceSession.ts:23-41`); en producción el gate corta antes de persistir, pero el
  mecanismo existe para dev/tests. `touchSession` (`asegurarSesion`, `model-persistence-api.ts:976-990`)
  upsertea tenant+user en cada request, residuo de esa era.

---

## 7. Semántica de persistencia

1. **CAS por revisión** en modelo (`save`, `FOR UPDATE` + `WHERE opforja_models.revision = $current`,
   `postgresRepository.ts:299-352`) y en workspace (`revisionBase`). Un conflicto es 409; el cliente
   conserva ambas ramas (IndexedDB, fuera de esta área).
2. **Autosave** como fila aparte con ley temporal (`createdAt > saved.updatedAt`) y `revisionBase`
   obligatoria; guardar con `autosalvado:false` lo consolida (borra).
3. **Commit atómico** (`commitRevision`, `model-persistence-api.ts:665-800`): en una transacción bloquea
   modelo, autosave y workspace; compara el testigo completo (revisión, `updatedAt`, sha256 de saved y
   autosave, fuente); aplica `evaluarPoliticaCommit` (`modelPersistence.ts:95-131`, que envuelve
   `evaluarPush` de `src/mesa/validarPush.ts:39-70`):
   - el bundle debe hidratar (`hidratarModelo`);
   - crear exige especie `apunte|modelo`;
   - destino `biblioteca` es solo-lectura;
   - destino con sello de procedencia exige bundle sellado;
   - base autosave exige `confirmedByOperator`;
   - sin delta (`esSinDelta` sobre `exportarModelo` canónico) no crea revisión, salvo graduación/reapertura.
   Luego persiste modelo, inserta versión (409 si el id existe), poda y registra la versión y la especie
   en el índice del workspace.
4. **Poda log-scale** (`src/persistencia/politicaVersiones.ts:3-56`): buckets día(10)/semana(7)/mes(4)/
   histórico(1), tope ordinario configurable; las `preservar` no cuentan; la versión recién confirmada
   nunca se poda en su propio commit.
5. **Tres escritores del mismo registro** comparten `persistModelInTransaction` (bien) pero entran por
   tres rutas con políticas distintas: `save` legado (sin versión ni política de sello), `commitRevision`
   (con política) y `ChangeGateway.commit` (con validación semántica e inversa). El navegador usa el commit atómico
   cuando confirma una versión con testigo (`src/store/persistencia.ts:403`, `acciones-ui.ts:216`,
   `workspaceMod.ts:484, 759`), pero sigue usando el camino legado para guardados sin versión
   (`persistencia.ts:429`, `acciones-ui.ts:242, 341, 476`, `carpetas.ts:95`) y, con
   `crearVersionAlGuardar`, dispara un `POST /versiones` aparte y sin esperar
   (`persistencia.ts:290`, `acciones-ui.ts:183, 313`): modelo y versión **no quedan atómicos**
   ("Modelo guardado; no se pudo guardar versión en servidor").

---

## 8. Agente integrado

### 8.1 Composición (`src/server/agent/service.ts:13-22`)

`createAgentService(repository, config)` construye un único `TaskRuntime`, `ChangeGateway`,
`VariantService`, las herramientas y el proveedor (MiMo por defecto, OpenCode Zen alternativo; si no hay
API key, un proveedor que siempre devuelve error). Todo vive en el mismo proceso `model-api` y comparte
la transacción/lock de fila de `opforja_models` (`AgentRepository.transaction`,
`postgresRepository.ts:95-254`: `SELECT … FOR UPDATE` de modelo, autosave y workspace antes de tocar
tareas).

### 8.2 Ciclo de una tarea (`src/server/agent/taskRuntime.ts`)

1. `start` (`:51-106`): valida disponibilidad (habilitado + API key + tarifa conocida), alcance (ids de
   entidades/estados/OPDs existentes), fuentes; `authority: propose` ⇒ `target: variant` y fila de
   variante; `transcript = [{role:"user", content: outcome}]`; `controller` con TTL 45 s; evento `status`;
   `schedule`.
2. `run` (`:242-348`): `claim` (suspende si presupuesto agotado, perfil de proveedor cambió o controlador
   ausente; toma lease de 150 s y sube `fence` si cambia de worker) → `context` (prompt de sistema
   `AGENT_INSTRUCTIONS` + JSON ≤24 KB, `context.ts:10-167`) → **reserva** de presupuesto antes de inferir
   (bytes UTF-8 del request + 2.048 como cota de tokens de entrada, salida `min(4096, restante)`, costo por
   tarifa; `usageUnknown = true`) → stream del proveedor con timeout 120 s → conciliación con el uso
   informado → si no hubo llamadas a herramienta, **suspende con `result-not-verified`** (un fin de stream
   no prueba cumplimiento) → ejecuta cada llamada, persiste su resultado en el transcript, detiene si la
   herramienta pide `halt`.
3. Humano: `stop` (`:131-144`), `instruct` (`:108-129`, corrección que reescribe el encargo y reinicia el
   turno), `continue` (`:146-178`, con respuesta a decisión, aceptación explícita de uso reservado
   desconocido o ampliación de presupuesto), `presence` (`:180-195`, una sola ventana controla),
   `recoverExpired` (`:203-225`, suspende por controlador ausente o worker interrumpido al leer).
4. Toda transición cierra llamadas de herramienta pendientes con un resultado sintético
   `not-completed` (`closePendingToolCalls`, `:453-462`) para que el transcript siga siendo válido.

### 8.3 Herramientas (`src/server/agent/tools.ts:88-143`)

| Herramienta | Qué hace | Halt |
|---|---|---|
| `read_context` | reconstruye el contexto acotado | — |
| `query_model` | 5 inferencias cerradas de `derivar` (`afectan-a`, `requerido-por`, `alcanzable`, `impacto-de-eliminar`, `impacto-aguas-abajo`), marcadas `inferido: true`; registra dependencia `structural-query:*` con huella del subgrafo relevante | — |
| `read_source` | fragmento `paragraph:N[-M]` (≤21 párrafos, ≤24 KB) de una fuente adjunta al documento y autorizada | — |
| `search_rules` | busca en el corpus canónico materializado en `.tutor-corpus/tutor-sources` (heurística por términos sobre HTML) | — |
| `propose_change` | ≤40 operaciones del perfil autorizable; valida alcance e intención; aplica sobre el vigente (o sobre base + overlay de variante); guarda cambio `prepared` con inversa y dependencias | — |
| `validate_change` | revalida un candidato guardado | — |
| `apply_change` | marca `pendingCommit`; **no commitea** | `awaiting-decision` (`commit-required` en `edit`, `review-required` en `propose`) |
| `ask_decision` | 2–5 alternativas y motivo material | `awaiting-decision` |
| `finish_task` | cierre con criterios exactos del encargo, evidencia por `resultId`, recibos verificados en BD; reglas distintas por autoridad (lectura ⇒ cita lectura; propuesta ⇒ cita propuesta vigente validada; edición ⇒ cita resultado de recibo confirmado) | `completed` |

### 8.4 Propuesta, incorporación, recibo, deshacer

- **Edición delegada** (`authority: edit`): `apply_change` → el navegador pide grant `delegated` sobre
  `/changes/:id/grants` → `commit` con el grant.
- **Propuesta** (`authority: propose`): las operaciones se acumulan en la variante; la persona revisa
  (`GET /changes/:id` con diff y OPL antes/después, `projectChangeDiff`), `prepare` produce un candidato
  `inc:<sha256(...)>` contra el vigente (`variants.ts:35-160`), grant `review`, `commit`.
- **Commit** (`changeGateway.ts:146-244`): bajo el lock del documento, idempotente (repetir un cambio ya
  confirmado devuelve su recibo con `recovered:true`), verifica grant (hash del token, claims, vencimiento,
  no consumido), base (revisión, `semanticHash`, `workingCopyHash` canónico, `clientSequence`, perfil),
  autoridad de la tarea, controlador y fence; **revalida** con `applyChangeSet`; serializa con
  `exportarModelo`, rehidrata y **reconstruye la inversa a partir del diff del modelo canónico** (para que
  deshacer no choque con su propio commit, `:193-202`); CAS del modelo; recibo; consume el grant; marca
  variante incorporada; resultado `committed-change` + evento `committed`.
- **Deshacer / reaplicar**: cambio humano sin tarea con `undoOf`, validado por `validateInverse`
  (cada parche comprueba el valor escrito por el cambio original antes de restaurar), grant `review`
  obligatorio; el original queda con `reversedBy`.
- **Cambios humanos sin LLM** (`humanChanges.ts`): piezas y refinamientos se preparan con constructores
  específicos del kernel, nunca con parches del cliente, y pasan por el mismo grant/commit/recibo/inversa.

### 8.5 Proveedor (`src/server/agent/opencodeProvider.ts`)

AI SDK `streamText` sobre `@ai-sdk/openai-compatible`, `maxRetries: 0`, URL fijada por proveedor y
verificada en un `fetch` guardado (`redirect: "error"`), `onError` silencioso para no filtrar cuerpos,
MiMo con `thinking: disabled` y `max_completion_tokens`. Rechaza llamadas de herramienta inválidas,
duplicadas o a herramientas no declaradas; exige `finish` con uso conocido y razón `stop|tool-calls`.

### 8.6 Estado de validación

HANDOFF.md: **no hubo inferencia real** con MiMo; el circuito se comprobó con transporte controlado y
Postgres aislado. Jev se evaluó aparte y no está en la ruta. La especificación (A01–A24) sigue con
aceptación humana pendiente. La instancia publicada no ejecuta estas capacidades.

---

## 9. Revisión compartida

`createShare` bloquea el modelo (`FOR UPDATE`), exige `expectedRevision` y `expectedWorkingCopyHash`
canónico, verifica que las fuentes elegidas existan y guarda **una copia privada inmutable** del JSON
(no depende de una versión podable). El lector recibe el modelo proyectado por `projectReviewModel`
(`src/modelo/review.ts:98-133`): sin `notasMesa`, URLs saneadas, `mesaExploracion` filtrada a fuentes
incluidas y a trazos/propuestas/confirmaciones cuyas fuentes estén todas incluidas. Anotaciones
anónimas con `actorId` aleatorio por anotación y etiqueta "Lector con enlace". La resolución del autor
registra si el referente aún existe en la revisión vigente. Revocar impide nuevas lecturas.

Es una capacidad de colaboración genuina y bien acotada; su implementación (3 tablas + JSONB por fila,
repo memoria paralelo con locks propios) es más pesada de lo necesario.

---

## 10. Captura de bugs

El botón de la UI (`src/ui/CapturadorBugs.tsx`) envía texto, capturas y contexto; el sidecar escribe en
`docs/bugs/` del **clon Git del servidor** mediante bind mount y regenera `INDEX.md`/`HISTORY.md` a partir
de carpetas, `statuses.json` y README de `archive/`. En el repo hay 379 archivos (6,7 MB) de reportes
archivados y 0 activos. Es tooling de desarrollo del propio producto, expuesto a producción (detrás de
login desde `056ff25`). No aporta al modelado y acopla datos de ejecución con el árbol de fuentes
(`deploy.sh:9` tiene que excluir `docs/bugs/` del cálculo de `-dirty`).

---

## 11. Operación

- **Dockerfile**: `deps` (bun install), `builder` (`bun run build` con `TUTOR_CORPUS_PREBUILT=1`), `bug-capture`,
  `model-api` (copia `node_modules`, **todo `app/src`**, `.tutor-corpus`, el script de API y el CLI de
  cuentas), `runner` (nginx + `dist`). El backend arrastra el código completo del frontend porque importa
  `modelo`, `serializacion`, `opl`, `mesa`, `persistencia`, `tutor`.
- **Compose**: build args `VITE_ENABLE_BUG_CAPTURE=true`, `VITE_MOBILE_READONLY=true`, `VITE_OPFORJA_BUILD`;
  secretos obligatorios `OPFORJA_DB_PASSWORD`, `OPFORJA_SESSION_SECRET` (compose falla si faltan);
  `MODEL_REQUIRE_AUTH: "true"`; carril Bearer opcional; 5 variables del agente. Healthchecks en Postgres y
  model-api. Redes: `web` externa, `opforja-internal` interna, `agent-egress` para salida.
- **deploy.sh**: materializa el corpus del Tutor desde el KORA del host (`bun run --cwd app tutor:corpus`),
  `docker compose up -d --build --wait --wait-timeout 120` con `OPFORJA_BUILD=<sha>[-dirty]`, luego verifica
  `/healthz`, `/`, que `/__deep-opm/session` devuelva 401 y que algún bundle `/assets/*.js` contenga el SHA.
  Tiene test con stubs de git/docker/curl (`app/scripts/deploy.test.ts`). Es la única vía de despliegue
  (AGENTS.md).
- **nginx.conf**: IP real desde `X-Forwarded-For` (confiado porque solo Traefik llega), tres zonas de
  rate-limit (api 10 r/s, sesión 2 r/s, bugs 1 r/s), nueve `location` de proxy casi idénticos; cinco
  (`bug-reports`, `modelos`, `workspace`, `auth/`, `session`) envían `$scheme` como `X-Forwarded-Proto` y
  tres (`agent/pieces`, `agent/`, `review/`) el mapa validado `$opforja_forwarded_proto` (inconsistencia
  menor: el chequeo de origen del agente depende de ese valor; la marca `Secure` de la cookie se salva
  porque `esRequestSeguro` también acepta cualquier host no local).
- **Backups**: `pg_dump --clean --if-exists | gzip`, `umask 077`, retención 14 días; unidad systemd con
  ruta absoluta del host (`/home/felix/projects/deep-opm-pro/...`) y un comentario obsoleto sobre un
  "cleanup de sesiones de las 04:00" que no existe.
- **Observabilidad**: un log JSON por request (`model_api_request` con método, ruta redactada, estado,
  duración), migraciones y podas. Sin métricas ni trazas; `/healthz` solo prueba `SELECT 1`.
- **Variables de entorno del backend**: `MODEL_API_HOST/PORT`, `DATABASE_URL`, `MODEL_SESSION_SECRET`,
  `MODEL_MAX_VERSIONS_PER_MODEL`, `MODEL_REQUIRE_AUTH`, `MODEL_AGENT_TOKEN/IDENTITY`, y 16 `OPFORJA_AGENT_*`
  (enabled, provider, model, protocol, api key, 3 de tarifa, 6 de presupuesto, request timeout).
- **`webroot/` y `config/`**: descargados por `setup.sh:165-168` desde OPCloud (index con Google
  Analytics `G-Z8Y7TVP1HK`, configuración Firebase con API key pública, rutas del bundle decompilado,
  config edX). `NOTICE.md` los declara evidencia observacional. Ningún código, build ni despliegue los
  usa.

---

## 12. Flujos principales (resumen)

- **Arranque del editor**: `GET /session` → 401 ⇒ `PantallaLogin` → `POST /auth/login` → `GET /workspace`
  → `GET /modelos?includePayload=1` (todos los modelos completos) → abrir documento → `GET /modelos/:id`
  + `GET /modelos/:id/autosave` (base efectiva) → IndexedDB local.
- **Guardar**: legado `POST /modelos` (+ `POST /versiones` aparte si corresponde) o atómico
  `POST /modelos/:id/revisiones`; autosave periódico `PUT /modelos/:id/autosave` con `revisionBase`.
- **Compartir**: `POST /review/grants` → token → enlace `/revision/#…` → lector `GET /review/<token>`.
- **Agente**: `POST /agent/tasks` → SSE `/events` + `presence` cada <45 s → propuesta visible → `prepare`
  → `grants` → `commit` → recibo; Detener = `stop`; Continuar = `continue`.
- **Skill externa (`mesa`)**: Bearer → `GET /modelos`, `/workspace`, `/modelos/:id`, `/autosave` →
  testigo de base → `POST /modelos/:id/revisiones`.

---

## 13. Reglas OPM y reglas de producto codificadas en el área

### 13.1 Reglas OPM (sagradas; conservar semántica exacta)

| # | Regla | Ubicación |
|---|---|---|
| O1 | El agente solo puede autorar **enlaces procedurales** de los cinco tipos base: `agente`, `instrumento`, `consumo`, `resultado`, `efecto` (sin eventos, condiciones, negaciones ni enlaces estructurales) | `src/server/agent/tools.ts:81` |
| O2 | Clasificación transformador vs habilitador: **transformadores** = `consumo`, `resultado`, `efecto`; **entradas requeridas/habilitadores** = `consumo`, `agente`, `instrumento`; **salidas de proceso** = `resultado`, `efecto`; **entradas de proceso** = `consumo`, `agente`, `instrumento` (usada para huellas de dependencia de inferencias) | `src/server/agent/tools.ts:853-856`, uso en `structuralQueryVersion` `:897-1021` |
| O3 | Alcanzabilidad de un estado: se considera la salida de un estado por `consumo` desde el estado y la llegada por `resultado` hacia el estado (par entrada/salida de cambio de estado) | `src/server/agent/tools.ts:945-958` |
| O4 | Impacto aguas abajo: se recorre objeto→proceso por enlaces de entrada y proceso→objeto por enlaces de salida | `src/server/agent/tools.ts:971-1003` |
| O5 | Toda inferencia estructural se marca `inferido: true` y "no equivale a hecho declarado ni causalidad general" (distinción inferencia vs declaración) | `src/server/agent/tools.ts:240-242`; prompt `src/server/agent/instructions.ts:1-12` |
| O6 | Exclusión XOR: ≥2 enlaces procedurales distintos, del **mismo OPD seleccionado explícitamente**, visibles en ese OPD, con extremos autorizados, sin pertenecer ya a un abanico; la operación solo crea el grupo, no fusiona ni modifica grupos existentes; puerto, tipo y dirección exactos los valida `formarAbanico` | `src/server/agent/tools.ts:612-633`; kernel `src/modelo/changes/xor.ts:14-38`; prompt `instructions.ts` |
| O7 | Refinamiento humano: tipos `descomposicion` (in-zoom) y `despliegue` (unfold); modos de despliegue `agregacion`, `exhibicion`, `generalizacion`, `clasificacion`; exige pregunta y justificación; **la frontera original debe preservarse** (toda declaración de la frontera previa sigue presente) | `src/server/agent/http.ts:62-89` |
| O8 | Visibilidad por OPD: un OPD seleccionado concede como alcance exactamente sus apariciones locales (y enlaces cuyos extremos están en alcance); nunca se infiere otro OPD desde el payload de una operación. Coincide con el contrato "entidad visible en un OPD ⇔ existe apariencia local" | `src/server/agent/changeGateway.ts:423-441`; `tools.ts:714-746`; runbook `docs/deploy/opforja.md` §Contrato funcional de apariciones |
| O9 | Borrado en cascada: eliminar una entidad arrastra sus estados y todos los enlaces incidentes (a la entidad o a sus estados) y sus apariciones; eliminar un estado arrastra sus enlaces | `src/server/agent/tools.ts:676-695`; `changeGateway.ts:465-493` |
| O10 | Los estados pertenecen a una entidad (`createState` exige `entityId`; el contexto lista estados por entidad) | `tools.ts:600-603`; `context.ts:188-200`; el kernel impone que los estados solo aplican a objetos y que un objeto con estados tiene al menos dos (`src/modelo/operaciones/estados.ts:81, 85, 120-122, 166, 232`) |
| O11 | Bimodalidad en revisión: toda propuesta se presenta con su diff semántico **y** el OPL antes/después de cada OPD afectado | `src/agent/changeProjection.ts:11-19`; usado en `http.ts:151-154`, `tools.ts:356, 380, 409` |
| O12 | Integridad referencial OPD tras cada lote (`validarReferenciasOpd`) y rechazo `invalid-model` | kernel `src/modelo/changes/apply.ts:84-85`, invocado desde gateway |
| O13 | Anclas de revisión solo a referentes OPM reales: modelo, OPD, entidad, estado, enlace | `src/modelo/review.ts:5-7, 135-143`; `review/service.ts:225-235` |
| O14 | "Agente" de software ≠ agente OPM: su papel habilitador se modela como instrumento no humano | spec `docs/specs/opforja-producto-integrado.md` §6 (no codificado) |

### 13.2 Reglas de producto o de método Forja (no son ISO 19450; no confundirlas con OPM)

| # | Regla | Ubicación |
|---|---|---|
| P1 | Biblioteca es solo-lectura para commits de revisión y del agente | `src/mesa/validarPush.ts:56-57`; `model-persistence-api.ts:717-721`; `postgresRepository.ts:404-416` |
| P2 | Modelo con sello de procedencia solo acepta bundles sellados; el kernel rechaza cualquier cambio sobre un modelo con `procedencia` (`external-owned`) | `validarPush.ts:59-62`; `src/modelo/changes/apply.ts:41-43` |
| P3 | Base autosave exige confirmación explícita del operador | `validarPush.ts:64-67` |
| P4 | Commit sin delta no crea revisión (salvo graduación/reapertura) | `modelPersistence.ts:124-129`; `src/mesa/esSinDelta.ts` |
| P5 | Especie al crear: `apunte` o `modelo`; graduación `apunte → trabajo|biblioteca`; reapertura `modelo → apunte`, prohibida para biblioteca | `validatePersistence.ts:116-151`; `src/persistencia/workspace.ts:422-459` |
| P6 | Piezas ancladas a fuente externa y vistas materializadas son de solo lectura | kernel `apply.ts:64-74, 87-94` |
| P7 | Autoridad de tarea `read` no puede proponer ni incorporar; `edit` solo sobre el vigente con lease y controlador vivos; cambio sin tarea solo con confirmación humana `review` | `changeGateway.ts:341-371` |
| P8 | Cierre de tarea: criterios de suficiencia exactos, evidencia por resultado guardado, recibo confirmado para criterios de edición | `tools.ts:443-558` |

---

## 14. Acoplamientos

- **Servidor → kernel y más allá**: el backend importa `modelo/changes`, `modelo/reuse/piece`,
  `modelo/razonamiento/derivar`, `modelo/submodelos` (`firmaSnapshotSubmodelo` como `semanticHash`),
  `serializacion/json`, `opl/generar`, `tutor/fuentes`, `mesa/*`, `persistencia/{workspace,modelos,especie,
  politicaVersiones,workspaceStorage}`. Correcto que comparta el kernel puro; incorrecto que dependa de
  `persistencia/` y `mesa/` del cliente (capas de navegador) — la dirección `modelo → store → app` queda
  cruzada: `server` usa helpers del cliente.
- **Imagen del backend = todo `app/src`** (`Dockerfile:55-58`), incluido UI y render.
- **Despliegue depende de un KORA local** (materialización del corpus del Tutor en el host antes del build).
- **Agente ↔ Tutor**: `search_rules` lee HTML materializado desde disco relativo al módulo
  (`tools.ts:1151-1158`); versión = digest del manifiesto + sha256 del HTML.
- **nginx enumera rutas** del backend: cada ruta nueva exige tocar `nginx.conf`.
- **Dev = prod handler**: fortaleza (un solo enrutador) con la debilidad de que el repositorio de dev
  (`repoMemoria`) no es el de prod.
- **Contrato con la skill externa**: `MesaBaseWitnessV1`, `POST /modelos/:id/revisiones`, lecturas `GET`,
  y el token Bearer. Cambiarlos rompe `scripts/mesa-cli.ts` y la skill instalada.

---

## 15. Olores de sobreingeniería y acreción (con ejemplos)

1. **Repositorio de producción sin tests e inline en un script.** `scripts/model-persistence-api.ts`
   contiene las 7 migraciones, el repositorio Postgres completo y `Bun.serve` al tope del módulo; se
   extrajo `sessionResolverSelector.ts` solo porque importar el script arranca Postgres
   (`sessionResolverSelector.ts:4-11`). Los 24 tests de `modelPersistence.test.ts` ejercen
   `repoMemoria`, que **diverge**: el test "preserva esBiblioteca en el roundtrip POST -> GET"
   (`modelPersistence.test.ts:167-193`) pasa en memoria y fallaría contra Postgres, que no tiene esa
   columna; memoria no poda versiones, no ordena `listVersions` y valida biblioteca antes que existencia.
2. **Tres caminos de escritura** del documento (§7.5) con políticas distintas y versiones no atómicas en
   el camino legado que la UI aún usa.
3. **Estado triplicado** (carpeta, versiones, autosalvado, archivado; §5) y especie solo en el índice;
   obliga a `registrarVersionEnWorkspace`, `mapaEspeciePorModelo`, `COALESCE` con columna legada.
4. **Listado que descarga todo.** `GET /modelos?includePayload=1` baja e hidrata cada modelo para calcular
   `estadoCierre`; el SQL selecciona `payload` aun sin `includePayload`. No escala con el catálogo.
5. **Diez contadores de concurrencia** en el agente: `revision`, `semanticHash`, `workingCopyHash`,
   `clientSequence`, `profileVersion`, `intent.version`, `authorizationVersion`, `lease.fence`,
   `controller.expiresAt`, `grant.expiresAt`. Cada uno defendible aislado; juntos son difíciles de razonar.
   `Base` repite información (`revision` + dos hashes).
6. **Grant de commit de 15 s entre el mismo navegador y el mismo servidor** (`commitGrant.ts`): añade un
   viaje de ida y vuelta, una tabla de claims y verificación que `commit` repite de todos modos
   (`assertDocumentBase`, `assertTaskAuthority`, `assertGrantStillCurrent`). La idempotencia real la da
   `change.id` + `requestHash` + recibo persistido.
7. **Variantes persistidas como overlay** (`variants.ts`) con identidad derivada `inc:<sha>` y resultados
   `variant-incorporation` para enlazar origen y candidato: un cambio preparado ya es una propuesta; la
   variante duplica el concepto.
8. **Código y datos muertos**: `opforja_agent_results` (solo escritura); `AgentTransaction.getGrant/putGrant`
   (sin uso fuera de los repos); `VariantService.discard` y estado `rejected` (sin ruta HTTP);
   `ChangeGateway.getReceipt` (sin llamador); ruta `POST /agent/tasks/:id/grants` (el cliente usa
   `/changes/:id/grants`); estado `failed` nunca asignado; `canTransitionTask` no usado por el runtime;
   `_preparedContract` (`variants.ts:202-205`); aceptación de ids de consulta estructural "antiguos"
   (`tools.ts:881-882`) en un sistema que no se ha desplegado.
9. **Autodeclaración de capacidades** (`src/agent/capabilityProfile.ts:29-78`): una matriz que apunta a
   rutas de archivos de test como "evidencia"; gobierno autorreferente que no verifica nada por sí mismo.
10. **Cambios humanos bajo `/agent/*`**: `pieces` y `refinements` no usan LLM pero viven en el namespace
    y el servicio del agente; la reutilización de piezas y el refinamiento quedan rehenes de él.
11. **Clasificación de errores por prefijo de mensaje** (`esErrorPayload` en `modelPersistence.ts` y
    `bugCapture.ts`) en lugar de tipos.
12. **`touchSession` en cada request** (dos upserts en transacción) y acuñación de tenants anónimos que en
    producción no se usa.
13. **Nueve bloques nginx de proxy casi idénticos** y `X-Forwarded-Proto` inconsistente.
14. **Captura de bugs en el producto** que escribe en el árbol Git del servidor y mantiene un ledger
    Markdown regenerado (528 líneas de `bugIndex.ts`).
15. **Comentarios de procedencia burocrática** ("Blindaje 2026-06-06, auditoría persistencia crítico #1",
    "Task 8 Ola 1, FIX 2 + FIX 3") en lugar de explicar el porqué técnico; útiles en Git, ruido en código.
16. **`webroot/` y `config/`** en la raíz del repositorio del producto (evidencia de terceros, con GA y
    claves de Firebase públicas), sin consumidor.
17. **Tarifas de proveedor en el código** (`config.ts:43-52`) con fecha de verificación; requieren
    commit para cambiar un precio.

---

## 16. Piezas de alta calidad que vale portar casi tal cual

- `passwordHash.ts` completo (scrypt parametrizado en el hash, `timingSafeEqual`, señuelo).
- Firma/verificación de cookie de `persistenceSession.ts` (HMAC, comparación constante, `exp`/`iat`,
  `Secure` según proxy) y el login uniforme sin oráculo de email.
- **Cabecera de identidad de sesión** (`x-opforja-session-identity`) y su check en el enrutador.
- `persistModelInTransaction` (CAS por `WHERE revision = $current` + consolidación de autosave en la misma
  transacción) como **escritor único** del modelo.
- El testigo de base `MesaBaseWitnessV1` y la ley `autosave.createdAt > saved.updatedAt`.
- `aplicarPoliticaLogScaleVersiones` (poda con versión protegida y `preservar` fuera de cupo).
- El **núcleo del gateway**: revalidar bajo lock, serializar canónico, reconstruir la inversa del diff
  canónico, CAS, recibo persistido junto al commit, idempotencia por `change.id` + `requestHash`,
  deshacer como cambio nuevo validado por `validateInverse` (`changeGateway.ts:146-244, 287-329`).
- `deriveTrustedScope` / `collectIntentScope` como definición de "alcance por OPD visible" (si se
  conserva la delegación a un agente).
- `stableJson` + `hashCommitRequest` (identidad de contenido estable).
- `opencodeProvider.ts`: URL fijada, sin reintentos ocultos, sin logging de cuerpos, validación de tool
  calls, exigencia de uso conocido.
- `events.ts`: SSE acotado, reconexión por cursor, `snapshot-required` ante hueco.
- Reserva de presupuesto **antes** de inferir y conservación íntegra de la reserva cuando el uso es
  desconocido (`taskRuntime.ts:250-302`).
- `projectReviewModel` (qué se oculta a un lector) y el patrón de token con hash + `no-store` + redacción
  de logs.
- `deploy.sh` y su test con stubs; `backup-opforja-db.sh`.
- `auth-cuenta.ts` (adopción `--tenant`, password por stdin).

---

## 17. Recomendación keep / simplify / cut por pieza

| Pieza | Decisión | Justificación |
|---|---|---|
| Auth v1 (login, cookie, CLI de cuentas) | **keep** | Necesario, pequeño, bien hecho. Añadir versión de credencial en el token para que reset/logout invaliden sesiones |
| Cabecera de identidad | **keep** | Barata, cubre cambio de cuenta y CSRF |
| Acuñación anónima + `touchSession` por request | **cut** | Residuo pre-auth; crear tenant/user solo en `auth-cuenta crear` |
| Carril Bearer externo (`mesa`) | **simplify** | Útil para la skill; un solo resolver con tokens por cuenta en tabla (hash), no env estático ligado a un tenant |
| Enrutador `crearModelPersistenceFetchHandler` | **simplify** | Tabla de rutas declarativa, errores tipados, un gate por familia |
| Repositorio Postgres inline en script | **simplify** | Mover a `src/server/db/*`, un solo adaptador probado contra Postgres real (o PGlite en tests); eliminar `repoMemoria` como implementación paralela |
| Migraciones 1–7 | **simplify** | Nuevo baseline único + una migración de datos desde el esquema actual |
| `POST /modelos` legado + `POST /versiones` aparte | **cut** | Reemplazar por un único commit atómico (modelo + versión opcional) |
| `POST /modelos/:id/revisiones` | **keep → fusionar** | Base del único camino de escritura de documentos completos (import, skill externa) |
| Autosave como fila aparte con ley temporal | **simplify** | Mantener "borrador sobre revisión" pero con un único documento `draft` por modelo; el borrador local vive en IndexedDB |
| Estado triplicado (carpeta, versiones, autosalvado, archivado, especie) | **cut duplicados** | Una sola autoridad por hecho: carpeta/especie/archivado en columnas del modelo o en el índice, nunca en ambos ni en el payload |
| `GET /modelos?includePayload=1` | **cut** | Listado liviano con metadatos (incluido `estadoCierre` calculado al guardar) |
| Poda log-scale | **keep** | Buena política, pura |
| Circuito de cambio semántico (validar → commit → recibo → inversa → deshacer) | **keep y generalizar** | Debe ser el camino de *toda* edición incremental (humana, OPL, agente), no un anexo del agente |
| Grant de commit 15 s | **cut** | Redundante con base + idempotencia; un commit con `baseRevision`, `workingCopyHash`, `changeId` basta |
| Variantes persistidas + `inc:<sha>` | **cut** | Una propuesta es un cambio preparado; incorporar = commit sobre la base vigente o re-preparar |
| Cambios humanos (piezas, refinamientos) bajo `/agent` | **simplify** | Mover a `/changes` del documento, independientes del LLM |
| Agente LLM integrado (runtime, tools, contexto, eventos) | **simplify fuerte / diferir** | Sin inferencia real validada; conservar contrato de proveedor, reserva de presupuesto, SSE y `propose/validate/ask/finish`. Reducir a: tarea = intención + transcript + propuestas; estados `working/waiting/suspended/done/stopped`; un solo contador de época (reemplaza `intent.version`, `authorizationVersion`, `fence`) |
| `finish_task` con reglas de evidencia | **simplify** | Mantener "no afirmar cambios sin recibo"; quitar la validación combinatoria por autoridad |
| `search_rules` sobre HTML materializado | **simplify** | Índice de reglas precomputado al build (JSON de fragmentos), sin parseo HTML en caliente |
| Matriz de capacidades con rutas de tests | **cut** | Sustituir por una lista de operaciones autorizables; la evidencia está en los tests |
| `opforja_agent_results`, `getGrant/putGrant`, `discard`, `getReceipt`, ruta `tasks/:id/grants`, estado `failed` | **cut** | Muertos |
| Revisión compartida | **keep / simplify** | Valor real de colaboración; una tabla `review_shares` con `snapshot` y `annotations` JSONB (o 2 tablas), sin repo memoria paralelo |
| Captura de bugs (sidecar, `bugIndex`, UI, `docs/bugs`) | **cut** | Tooling de desarrollo; reemplazar por "copiar diagnóstico" o enlace a issues |
| `probe-agent-provider.ts` | **keep si agente** | Sonda barata y segura |
| Dockerfile 5 stages | **simplify** | Dos imágenes: `web` (nginx + dist) y `api` (bun + bundle del servidor con `bun build --target=bun`, sin `app/src` completo) |
| Compose | **simplify** | 3 servicios (web, api, postgres); red de egreso solo si hay agente |
| nginx.conf | **simplify** | Un `location /__deep-opm/` genérico + excepciones (SSE sin buffering, login estricto, revisión sin log) |
| deploy.sh + test | **keep** | Circuito verificable; desacoplar la materialización del corpus del host (artefacto versionado o fetch con pin) |
| Backup + systemd | **keep** | Parametrizar ruta del host; eliminar comentario obsoleto |
| `webroot/`, `config/` | **cut** | Evidencia OPCloud sin consumidor; si se necesita, repositorio de investigación aparte |
| Comentarios de procedencia ("Blindaje…", "Task 8 FIX…") | **cut** | Reemplazar por el porqué técnico; la historia vive en Git |

---

## 18. Propuesta de backend mínimo para la reescritura

**Esquema (baseline v1 de la reescritura):**

```
accounts(id, email UNIQUE, password_hash, credential_version, created_at, last_login_at)
workspaces(id, owner_account_id, name, revision, index JSONB)        -- carpetas, recientes, preferencias
documents(id, workspace_id, name, folder_id, species, archived_at, revision, updated_at,
          closure_summary JSONB, payload JSONB)                        -- autoridad única de metadatos
document_versions(document_id, id, name, note, preserved, created_at, bytes, payload JSONB)
document_changes(document_id, change_id, request_hash, status, receipt JSONB, inverse JSONB,
                 reversed_by, created_at)                              -- recibos e inversas
review_shares(document_id, id, token_hash UNIQUE, created_at, revoked_at, can_annotate,
              snapshot JSONB, annotations JSONB)
api_tokens(id, account_id, token_hash, scope, created_at, revoked_at)  -- carril skill externa
-- opcional, solo si el agente se conserva:
agent_tasks(document_id, id, status, epoch, updated_at, payload JSONB)
agent_events(document_id, task_id, sequence, payload JSONB)
```

Marcas `timestamptz`. `tenant` desaparece como concepto separado si sigue siendo 1:1 con la cuenta; si se
quiere multiusuario futuro, `workspace_members(workspace_id, account_id, role)`.

**API (≈15 rutas):**

```
POST /api/auth/login · POST /api/auth/logout · GET /api/session
GET  /api/workspace · PUT /api/workspace (revisionBase)
GET  /api/documents                       (metadatos, sin payload)
GET  /api/documents/:id                   (payload + revision)
POST /api/documents                       (crear: payload + especie)
POST /api/documents/:id/commits           (documento completo: baseRevision, payload, version?)
POST /api/documents/:id/changes           (lote semántico: changeId, base, operations) → receipt
GET  /api/documents/:id/changes/:cid      (recibo; recuperación tras timeout)
POST /api/documents/:id/changes/:cid/undo
GET/POST/DELETE /api/documents/:id/versions[/:vid]
DELETE /api/documents/:id
POST /api/documents/:id/reviews · DELETE …/reviews/:rid · GET /api/reviews/:token · POST /api/reviews/:token/annotations
(opcional) /api/documents/:id/tasks[...] para el agente
```

**Migración de datos** desde el esquema actual: `opforja_models` → `documents` (tomando `species`,
`folder_id`, `archived_at` del índice del workspace como autoridad y validando coherencia con columnas y
payload), `opforja_model_versions` → `document_versions`, autosaves más recientes que la revisión →
versión marcada "borrador recuperado", `opforja_agent_changes` confirmados → `document_changes` (recibo e
inversa), `opforja_review_*` → `review_shares` con anotaciones y resoluciones embebidas,
`opforja_accounts` + `opforja_account_tenants` → `accounts` + `workspaces`. Mantener el formato del
payload `deep-opm-pro.modelo.v0` (o versionarlo explícitamente con un migrador puro en `serializacion`).

---

## 19. Riesgos y preguntas abiertas

- **Compatibilidad con la skill externa**: `mesa-cli.ts` y la skill instalada dependen de
  `MesaBaseWitnessV1`, `/modelos/:id/revisiones` y el Bearer. Cualquier reescritura necesita una capa de
  compatibilidad o un corte coordinado con KORA.
- **Decisión del operador sobre el agente**: la spec y HANDOFF lo declaran "producto integrado por
  decisión del operador". Recortarlo es legítimo desde la solicitud de rehacer, pero el circuito de
  cambios (recibo/inversa) debe sobrevivir porque es valioso aunque no exista LLM.
- **JSONB y bytes**: confirmar que ningún consumidor compara el texto crudo del payload tras un commit
  (el commit devuelve el JSON enviado, la lectura posterior devuelve el normalizado por Postgres).
- **Revocación de sesiones**: hoy imposible sin rotar el secreto global.
- **Datos existentes**: tenants anónimos adoptados, columna `versiones` legada y posibles divergencias
  entre `carpeta_id`, `payload.carpetaId` y el índice: la migración debe reportarlas, no resolverlas en
  silencio.
- **Suite verde ≠ validación**: 3.682 pruebas no acreditan inferencia real ni aceptación humana del
  agente (declarado en el propio HANDOFF).
