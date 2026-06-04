# Auditoría de persistencia backend — diagnóstico priorizado

> **Estado:** diagnóstico completo, **NO implementado** (decisión del operador 2026-06-04: en pausa).
> Vive aquí por **valor prospectivo** (brechas abiertas que gobiernan el próximo corte de
> persistencia). Auditado de primera mano: código (`app/src/server/modelPersistence.ts`,
> `app/scripts/model-persistence-api.ts`, `app/src/persistencia/*`, `app/src/store/persistencia.ts`),
> configuración viva (`docker-compose.yml`, `deploy/nginx.conf`, env real del contenedor) y
> estado de la DB en producción (12 tenants, 7 modelos, 9 MB, disco 43 GB libres).

## Hallazgo central: el techo de almacenamiento sigue siendo localStorage

La migración a Postgres elevó la durabilidad pero **NO el techo de capacidad**. El guardado es
**local-primero**: `guardarModeloLocal(...)` y si falla, aborta con mensaje **sin llegar al
backend** (`store/persistencia.ts:291-299`; `local.ts:152-156` captura `QuotaExceededError` y
devuelve fallo). Límites vigentes por capa:

| Capa | Límite | Evidencia |
|---|---|---|
| Por modelo (request) | **15 MB** efectivos | nginx 25 MB (`client_max_body_size 25m`) > API 15 MB (`DEFAULT_MAX_BODY_BYTES`, `modelPersistence.ts:57`) |
| **Total del workspace** | **~5–10 MB por navegador** (cuota localStorage) | local-primero bloqueante; las versiones viven también dentro del JSON local y comen cuota |
| Servidor | sin cuota por tenant ni tope de modelos; techo = disco | DB 9 MB / 43 GB libres hoy |
| Versiones/autosaves | sin tope de cantidad (sin poda) | `model-persistence-api.ts` no poda; `listVersions` sin paginación |

Referencia de escala: el bundle HODOM v1.6 (36 OPDs) pesa ~5 MB → **un solo modelo de esa
escala roza la cuota del navegador**. El retiro de localStorage del camino crítico de escritura
(backend-primero, espejo best-effort) es el ítem de mayor valor práctico.

## 🔴 Crítico — activo en producción (verificado en el contenedor vivo)

1. **Secret de sesión = default hardcodeado.** `MODEL_SESSION_SECRET=opforja-dev-session`
   (compose línea 66: `${OPFORJA_SESSION_SECRET:-opforja-dev-session}`, env var NO seteada).
   El default está en el código público → cualquiera puede **forjar cookies de otro tenant**.
   El aislamiento por tenant es de papel. Rotarlo invalida las cookies existentes.
2. **Password de Postgres = default** (`opforja-dev`, compose línea 41/64). Mitigado solo
   porque Postgres no está expuesto fuera de la red Docker interna.
3. **Sin backup del volumen `opforja-postgres-data`.** El único cron de backup del servidor es
   de hd-hsc-os (otro proyecto). Corrupción o `down -v` accidental = pérdida total.
4. **Sin rate limiting** (instancia pública): creación infinita de tenants
   (`tenant-${randomBytes}` por sesión nueva) + payloads de 15 MB sin freno → DoS/disco.

## 🟡 Profesionalización (deuda estructural)

- **Sin migraciones versionadas**: schema por `CREATE TABLE IF NOT EXISTS` + `ALTER ... IF NOT
  EXISTS` acumulativos en el arranque (`model-persistence-api.ts:41-118`). Sin FKs ni UNIQUE
  compuestos → huérfanos silenciosos posibles.
- **Last-write-wins sin detección de conflicto**: `ON CONFLICT ... DO UPDATE` pisa sin aviso;
  dos pestañas del mismo tenant → la segunda borra los cambios de la primera en silencio.
  Sin version number/etag.
- **Sin transacciones en multi-write**: el delete de modelo borra autosaves → versiones →
  modelo en 3 queries sueltas (`model-persistence-api.ts:260-265`); fallo a media = huérfanos.
- **Sin poda**: versiones y autosaves crecen sin tope; tenants huérfanos (cookies perdidas a
  los 180 días o antes) nunca se limpian.
- **Cero logging operativo**: único log es el "listening"; errores de DB → 500 genérico sin
  stack ni registro (`modelPersistence.ts:164-167`). Inauditables ante incidente.

## 🟢 Menor

Sesión de 180 días sin rotación; healthcheck = `SELECT 1` (no pool/latencia/disco); pool de
conexiones Bun.SQL sin configurar (tamaño/timeouts); sin reintentos ante errores transitorios.

## Lo que ya está bien (no tocar)

Queries 100% parametrizadas (Bun.SQL, sin inyección); firma HMAC-SHA256 con `timingSafeEqual`;
aislamiento `WHERE tenant_id` en todas las queries; índices en la ruta de lectura
(`(tenant_id, actualizado_en DESC)`); tests de ruta feliz + aislamiento de tenant.

## Cortes propuestos (cuando se retome)

1. **Blindaje urgente** (~1 corte): secrets reales por env (`OPFORJA_SESSION_SECRET`,
   `OPFORJA_DB_PASSWORD`), `pg_dump` automatizado por cron con retención, rate limiting básico.
   Decidir antes: ¿los 12 tenants/7 modelos actuales son descartables? (rotar secret los invalida).
2. **Backend-primero**: invertir el orden de guardado (backend manda, localStorage best-effort)
   → elimina el techo de ~5-10 MB. Es también el pendiente ya registrado en HANDOFF desde el
   corte de persistencia ("retiro gradual de lecturas síncronas").
3. **Profesionalización**: migraciones versionadas + FKs, transacciones, poda de
   versiones/autosaves, logging estructurado.
4. **Conflicto multi-pestaña**: optimistic locking (version/etag) + UX de conflicto.

## Cobertura de tests del subsistema (referencia)

`modelPersistence.test.ts` ~60% (ruta feliz, aislamiento; omite conflictos/rollback/rate-limit);
`backend.test.ts` ~40% (omite divergencia espejo, offline, timeouts); `persistencia.test.ts`
(store) ~30% (omite sincronización real y multi-tab); `local.test.ts` no cubre quota llena.
