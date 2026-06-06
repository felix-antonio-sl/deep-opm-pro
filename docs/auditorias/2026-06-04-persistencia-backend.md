# Auditoría de persistencia backend — diagnóstico priorizado

> **Estado:** **cortes 1-4 EJECUTADOS y DESPLEGADOS al 2026-06-06**. Corte 1 fue ejecutado y
> verificado en producción (blindaje urgente). Cortes 2-3 quedaron implementados y desplegados:
> backend-only para datos OPM + profesionalización DB. Corte 4 quedó implementado y verificado
> en producción con optimistic locking por `revision` y respuesta 409 ante guardado obsoleto.
> Auditado de primera mano: código (`app/src/server/modelPersistence.ts`,
> `app/scripts/model-persistence-api.ts`, `app/src/persistencia/*`, `app/src/store/persistencia.ts`),
> configuración viva (`docker-compose.yml`, `deploy/nginx.conf`, env real del contenedor) y
> estado de la DB en producción (12 tenants, 7 modelos, 9 MB, disco 43 GB libres — descartados
> el 2026-06-06 al recrear el volumen).

## Hallazgo central: techo localStorage — REMEDIADO EN CÓDIGO 2026-06-06

La migración a Postgres elevó la durabilidad pero inicialmente **NO el techo de capacidad**. El
guardado era **local-primero**: `guardarModeloLocal(...)` y si fallaba, abortaba con mensaje **sin
llegar al backend**. El corte 2 invirtió ese flujo: cuando el backend está disponible, guardar,
guardar como y autosalvar construyen el documento persistible y escriben al servidor. Por decisión
posterior del operador, **no hay recuperación legacy ni espejo/cache OPM en `localStorage`**:
si el backend está disponible, las rutas de guardar, cargar, listar, versionar, restaurar,
componer, submodelos, pestañas y workspace usan Postgres/API como única fuente de verdad.

Límites vigentes por capa tras el corte:

| Capa | Límite | Evidencia |
|---|---|---|
| Por modelo (request) | **15 MB** efectivos | nginx 25 MB (`client_max_body_size 25m`) > API 15 MB (`DEFAULT_MAX_BODY_BYTES`, `modelPersistence.ts:57`) |
| **Total del workspace** | Postgres/API; navegador no guarda payloads OPM | `localStorage` puede fallar sin afectar un `guardarModeloBackend(...)` exitoso |
| Servidor | sin cuota por tenant ni tope de modelos; techo = disco | DB 9 MB / 43 GB libres hoy |
| Versiones/autosaves | versiones podadas; autosave único por modelo | `MODEL_MAX_VERSIONS_PER_MODEL` default 30 + política log-scale; autosave PK `(tenant_id, modelo_id)` |

Referencia de escala: el bundle HODOM v1.6 (36 OPDs) pesa ~5 MB → **un solo modelo de esa
escala roza la cuota del navegador**. El retiro de `localStorage` del camino de datos OPM
(sin espejo ni recuperación legacy) es el ítem de mayor valor práctico.

## 🔴 Crítico — REMEDIADO 2026-06-06 (blindaje, corte 1; verificado por smoke post-deploy)

1. ~~Secret de sesión default~~ → **rotado**: `OPFORJA_SESSION_SECRET` aleatorio de 64 hex en
   `.env` del servidor (gitignored, modo 600); el compose ya NO tiene fallback (`:?` fail-fast)
   y `model-persistence-api.ts` aborta si el secret falta, es el default histórico o mide <32.
   Verificado en el contenedor vivo (len=64, ≠ default).
2. ~~Password Postgres default~~ → **rotado** vía `.env` + volumen recreado limpio
   (`down -v`, tenants descartables autorizados). Compose sin fallback.
3. ~~Sin backup~~ → **`deploy/backup-opforja-db.sh`** (pg_dump --clean + gzip + retención 14d)
   con timer systemd user `opforja-db-backup.timer` diario 03:30 (instalado y activo;
   primera corrida real verificada, dump no-vacío en `~/backups/opforja/`).
4. ~~Sin rate limiting~~ → **nginx `limit_req`** por IP real (X-Forwarded-For tras Traefik):
   API 10r/s burst 25; `/session` (vector tenants infinitos) 2r/s burst 10; `/bug-reports`
   1r/s burst 5; 429. Verificado en vivo: ráfaga de 30 a /session → 11×200 + 19×429.

## 🟡 Profesionalización — REMEDIADA 2026-06-06

- ~~Sin migraciones versionadas~~ → `opforja_schema_migrations` + migraciones idempotentes
  `base_persistencia_modelos` e `integridad_referencial_y_operacion`.
- ~~Sin FKs~~ → FKs idempotentes para tenants/users/modelos/workspaces/versiones/autosaves,
  con limpieza previa de versiones/autosaves huérfanos.
- ~~Last-write-wins sin detección de conflicto~~ → `revision` por modelo, lectura en transacción
  con `SELECT ... FOR UPDATE`, incremento en cada guardado exitoso y `409 Modelo desactualizado;
  recarga antes de guardar` cuando una pestaña intenta pisar una revisión vieja.
- ~~Sin transacciones en multi-write~~ → `sql.begin()` en sesión, borrado de modelo y versionado.
- ~~Sin poda de versiones~~ → poda log-scale tras cada upsert de versión
  (`MODEL_MAX_VERSIONS_PER_MODEL`, default 30). Autosaves ya quedan acotados a uno por modelo.
- ~~Cero logging operativo~~ → logs JSON de arranque, migraciones, requests y poda.
- **Aún abierto:** tenants huérfanos por cookies expiradas y auth/tenants real.

## 🟢 Menor

Sesión de 180 días sin rotación; healthcheck = `SELECT 1` (no pool/latencia/disco); pool de
conexiones Bun.SQL sin configurar (tamaño/timeouts); sin reintentos ante errores transitorios.

## Lo que ya está bien (no tocar)

Queries 100% parametrizadas (Bun.SQL, sin inyección); firma HMAC-SHA256 con `timingSafeEqual`;
aislamiento `WHERE tenant_id` en todas las queries; índices en la ruta de lectura
(`(tenant_id, actualizado_en DESC)`); tests de ruta feliz + aislamiento de tenant.

## Cortes propuestos / estado

1. **Blindaje urgente — ejecutado en producción**: secrets reales por env (`OPFORJA_SESSION_SECRET`,
   `OPFORJA_DB_PASSWORD`), `pg_dump` automatizado por cron con retención, rate limiting básico.
2. **Backend-only OPM — implementado en código**: backend manda; sin espejo/cache OPM en `localStorage`.
3. **Profesionalización — implementada en código**: migraciones versionadas + FKs,
   transacciones, poda de versiones y logging estructurado.
4. **Conflicto multi-pestaña — ejecutado y desplegado**: optimistic locking por `revision` + 409.
   UX específica de resolución de conflicto queda como refinamiento; la pérdida silenciosa ya está bloqueada.

## Cobertura de tests del subsistema (referencia)

`modelPersistence.test.ts` cubre ruta feliz, aislamiento y conflicto 409; aún omite rate-limit.
`backend.test.ts` cubre que listar/guardar backend no escribe payloads OPM en `localStorage` y transporta `revision`.
`persistencia.test.ts` cubre guardar/cargar backend ignorando copias locales obsoletas y con
`localStorage` rechazando escrituras. `local.test.ts` y `versiones.test.ts` mantienen regresión
del módulo legacy/offline, fuera del camino backend. `e2e/33-backend-only-persistencia.spec.ts`
cubre navegador backend-only sin payloads OPM en `localStorage`. Verificación del corte 4:
`cd app && bun run check` → **2274 pass / 0 fail**; e2e focal → **1 passed**; smoke productivo
rev1/rev2/409/delete OK.
