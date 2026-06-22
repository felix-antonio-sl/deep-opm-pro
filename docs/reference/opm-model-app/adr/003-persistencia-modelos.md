# ADR 003 — Estrategia de persistencia de modelos

**Fecha**: 2026-04-22
**Estado**: aceptado
**Categoría**: origen de FEAT-06, FEAT-07, DEC-04 del BACKLOG

## Contexto

Hoy la app es **readonly productivo con mutaciones in-memory efímeras**:
los modelos se cargan desde `fixtures/ejemplos/*.json` vía `fetch` +
`hidratarModelo`, viven en memoria como `Map`s, se mutan con
`aplicarOperacion`, y mueren al refrescar. `MODO_LAYOUT='auto'` mueve
apariencias sin persistir — invariante declarado en §6 del handoff
2026-04-21 ("No persistir las mutaciones in-memory al JSON").

Cuando se implemente FEAT-01 (lente Canvas ↔ Modelo editable), esta
política deja de ser sostenible: perder trabajo al refrescar la tab es
inadmisible. Además abre preguntas que hoy no tienen respuesta:

- ¿Dónde vive un modelo que el usuario creó y editó?
- ¿Cómo lo comparte o lo exporta?
- ¿Un agente OpenClaw (ej. korvo) puede leer un modelo HDOS desde el
  modelador?
- ¿Qué relación guardan los fixtures del repo con los modelos del usuario?

Este ADR fija la estrategia antes de que FEAT-01 la improvise.

## Decisión

Adoptar **persistencia en tres capas separadas**, incrementales, con
triggers de avance explícitos. Cada capa resuelve un problema distinto
y ninguna obliga a la siguiente.

### Capa 1 — Estado de sesión (IndexedDB)

**Problema que resuelve**: no perder trabajo al refrescar.

**Forma**:
- `src/persistencia/sesion.ts` con tres operaciones: `snapshot(modelo)`,
  `recuperar(): Modelo | null`, `limpiar()`.
- Storage: `IndexedDB` (no `localStorage` — modelos superan rápido 5 MB
  con estados e enlaces denso).
- Trigger automático: debounce de 500 ms tras cada mutación exitosa.
- Clave: fija (`sesion:actual`). Una sesión, un modelo vivo.

**No persiste**: layouts algorítmicos calculados por `MODO_LAYOUT='auto'`.
Se regeneran al cargar (son función pura del modelo). Solo se persiste
`modelo.layouts` si el usuario *fijó* posiciones manualmente — extensión
de C-02.

### Capa 2 — Workspace del usuario (IndexedDB + JSON export/import)

**Problema que resuelve**: tener varios modelos propios, nombrarlos,
abrirlos, descargarlos como JSON, compartirlos por archivo.

**Forma**:
- `src/persistencia/workspace.ts` con: `guardar(modelo, nombre)`,
  `listar(): Array<{ id, nombre, actualizado, schemaVersion }>`,
  `cargar(id): Modelo`, `eliminar(id)`, `exportar(id): Blob`,
  `importar(json): Modelo`.
- Storage: IndexedDB (`opmodel-workspace`, object store `modelos`).
- `exportar` usa `serializarModelo` existente + agrega `schema_version`
  (ADR-001).
- `importar` pasa por `hidratarModelo` + `validarModelo`; rechaza si el
  validator encuentra errores estructurales bloqueantes.

**Separación explícita library ↔ workspace** (ver DEC-04):
- Library: fixtures del repo (`fixtures/ejemplos/*.json`), read-only,
  versionados en git, curados a mano.
- Workspace: modelos del usuario en IndexedDB, editables, efímeros
  desde la perspectiva del repo.
- Un fixture se puede "abrir en workspace" (copia con id nuevo); las
  ediciones no tocan el original.

**UI mínima requerida**:
- Dropdown actual "Seleccionar fixture" se reetiqueta como "Abrir…" y
  ofrece dos secciones: "Library" (fixtures) + "Mis modelos" (workspace).
- Botón "Guardar como…" → nombre → guarda en workspace.
- Botón "Descargar JSON" → llama `exportar(id)`.
- Drop-zone de archivo → `importar(json)` → abre en workspace.

### Capa 3 — Backend compartido (diferido)

**Problema que resuelve**: múltiples usuarios, URL compartible,
historial versionado, acceso desde agentes OpenClaw.

**Forma propuesta (sujeta a re-análisis cuando se active)**:
- Container dedicado `opmodel-backend` (Bun + SQLite o postgres).
- API REST: `GET/POST/PUT/DELETE /api/modelos`, `/api/modelos/:id/eventos`
  (log §5.3.1), `/api/modelos/:id/exportar`.
- Auth: por decidir. Probable: token compartido con OpenClaw gateway.
- Versionado: event log append-only (natural si Capa 2.5 está presente).

**Triggers de avance a Capa 3**:
- Un agente OpenClaw necesita leer un modelo desde el modelador.
- Aparece un segundo usuario humano operando la app.
- Se quiere compartir un modelo por URL (no por archivo descargado).

Hasta entonces, la app es single-user local y la Capa 2 alcanza.

### Capa 2.5 (ortogonal) — Event log Writer

**Problema que resuelve**: materializar la §5.3.1 de la constitución
categórica (toda mutación emite `LogEvento[]`), habilitar undo/redo
funtorial, auditabilidad de ediciones.

**Forma**:
- Extender `aplicarOperacion` para devolver `[Modelo, LogEvento[]]` en
  vez de `Modelo` solo (ya existe `ResultadoMutacion` como placeholder).
- `src/persistencia/log.ts` con: `append(eventos)`, `leer(): LogEvento[]`,
  `reducir(): Modelo` (replay desde cero), `rebobinar(n): Modelo`.
- Storage: IndexedDB (`opmodel-workspace`, object store `eventos`).
- Relación con Capa 1+2: el log **es** la fuente de verdad; el modelo
  materializado es proyección. Capa 1 (sesión) persiste la proyección
  actual + cursor del log. Capa 2 (workspace) puede persistir proyección
  + log o solo proyección según tamaño (archivar logs viejos).

**Trigger de activación**: cuando FEAT-01 necesite undo/redo real. Hoy
no existe demanda; activar antes es over-engineering.

**Fundamentación**: `docs/ARQUITECTURA-CATEGORICA.md` §5.3.1 + §7 (P4
"Eventos como fuente de verdad auditable").

## Alternativas consideradas

### Alt A — Backend desde el día 1

Overkill. La app es local, el operador es uno, no hay señal para
justificar infra compartida. Hetzner deploy ya existe como container
estático; agregar postgres + auth + sync protocol es meses de trabajo
sin usuario. Rechazado.

### Alt B — Solo localStorage

Límite 5 MB blando por origin. Un modelo con ~50 cosas + estados +
enlaces + apariencias ronda 100-300 KB; con layouts detallados y
varios modelos llegaría al techo en meses. Además `localStorage` es
síncrono — bloquea el main thread en I/O. Rechazado.

### Alt C — Filesystem vía File System Access API

Permitiría que el usuario trabajara "sobre un archivo" como VSCode.
Atractivo pero: (1) solo Chromium, (2) fricción de permisos por tab,
(3) no cubre el caso "quiero ver mis últimos 3 modelos sin recordar
dónde los guardé". Queda como **incremento opcional** de Capa 2: si
el usuario elige "guardar en archivo" en vez de "guardar en workspace",
se activa File System Access. Fallback: descargar blob.

### Alt D — Git-backed (commits como versiones)

Elegante conceptualmente pero exige: (a) backend o (b) `isomorphic-git`
en el cliente (+500 KB gzip). El event log de Capa 2.5 cubre lo
importante (historial auditable) sin la complejidad de git. Si en
Capa 3 se quiere, se agrega como backing store del backend, no en el
cliente. Rechazado para el cliente.

### Alt E — OPL-ES como formato canónico de persistencia

La constitución (§5.5 teorema 2) declara: `parse(regenerate(M)) = M`
módulo layout. Es decir, OPL-ES texto preserva estructura. Muy útil
para **compartir** modelos (texto plano, diff-friendly, legible). Pero
no reemplaza JSON como storage:
- Pierde layout.
- Parser OPL-ES no existe aún (solo generator — half-lens).
- Tamaño serializado mayor que JSON comprimido.

Incluir como **vía de exportación alternativa** en Capa 2 (botón
"Exportar OPL"), no como storage primario. El parser OPL-ES es una
deuda ortogonal.

## Consecuencias

### Positivas

- FEAT-01 tiene un destino de escritura antes de tocar UI editable.
  No se improvisa storage en medio del ciclo.
- La separación library/workspace preserva la canonicidad de los
  fixtures curados (ADR-002 F-04) sin bloquear al usuario.
- Schema versioning (ADR-001) entra en funcionamiento al primer
  `exportar` — cada modelo guardado lleva `schema_version` al JSON.
- Capa 2.5 materializa la §5.3.1 de la constitución categórica
  (Writer monad) y valida empíricamente la arquitectura.
- Capa 3 diferida evita 80% del trabajo de infra hasta tener señal real.
- `serializarModelo ↔ hidratarModelo` existente se reutiliza 1:1; no
  hay refactor del kernel necesario.

### Negativas

- Migración futura de Capa 2 → Capa 3 va a requerir un "sync protocol"
  no trivial (qué es canónico: IndexedDB del cliente o servidor?).
  Se acepta como costo futuro.
- IndexedDB es async + con API verbosa. Sumar una deps ligera tipo
  `idb` (1 KB) vale la pena; evaluar en la implementación.
- Sin backend, colaboración multi-usuario es inexistente. Consciente.

### Mitigaciones

- Declarar en la implementación de Capa 2 que **el JSON exportado es
  el contrato canónico** (no IndexedDB). Si más adelante se migra a
  Capa 3, la migración se reduce a subir los JSONs exportados.
- Tests de round-trip IndexedDB: `guardar → cargar → validar` iguales.

## Acciones inmediatas

- Agregar FEAT-06 (Capa 1+2) y FEAT-07 (Capa 2.5) al BACKLOG.
- Agregar DEC-04 (library vs workspace) al BACKLOG.
- NO implementar nada aún: este ADR fija el destino, no arranca el
  ciclo. La implementación de Capa 1+2 se dispara cuando arranque
  FEAT-01.

## Relación con otros ADRs

- **ADR-001** (schema versioning): Capa 2 activa los migradores por
  primera vez. Cada export escribe `schema_version`; cada import corre
  la cadena `hidratarModelo` → migradores si aplica.
- **ADR-002** (deudas aceptadas): la UI vanilla (E-04) puede soportar
  la UI de Capa 2 (open/save/export) sin framework. Si esto cambia,
  revisar E-04.

## Revisión

Revisar este ADR cuando:
- Capa 2 esté implementada y el operador evalúe si Capa 2.5 (Writer)
  vale la pena activar ya, o esperar a un caso concreto de undo/redo.
- Aparezca el primer trigger de Capa 3 (agente OpenClaw, segundo
  usuario, URL compartible).
- IndexedDB empiece a rozar límites de cuota en uso real.
