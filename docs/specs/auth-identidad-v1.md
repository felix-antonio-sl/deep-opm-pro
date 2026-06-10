# Auth/identidad v1 — identidad durable single-operator

**Estado**: IMPLEMENTADO en `main` (2026-06-10; deploy coordinado pendiente — §7) · **Frente**: corte mayor auth/tenants (HANDOFF § Frentes abiertos #2)
**Desbloquea**: gate C3 de W6.1 (re-protección de la instancia) · 2 `test.fixme` mobile (modelo sembrado tras login)

## Decisiones rectoras (adjudicadas con el operador)

| # | Decisión | Elección |
|---|---|---|
| D1 | Propósito del corte | **Identidad durable single-operator**: login para que el operador (y pocos usuarios de confianza) recuperen su tenant desde cualquier navegador. Invitaciones/roles/administración multiusuario quedan FUERA (corte posterior sobre esta base). |
| D2 | Mecanismo | **Email + password, registro cerrado**: hash **scrypt vía `node:crypto`** (built-in, cero dependencias nuevas, uniforme Bun/Node — `Bun.password`/argon2id se descartó porque el middleware dev de Vite puede correr bajo Node y no verificaría los hashes); solo el operador crea cuentas (CLI); sin signup público; recuperación = reset por operador. |
| D3 | Política de acceso | **Login obligatorio**: sin sesión autenticada no hay persistencia ni workbench. Ya no se auto-crean tenants anónimos en prod. Los tenants anónimos existentes quedan en BD (adopción por comando). |
| D4 | Arquitectura | **A. Auth nativa en el model-api existente**: extiende handler/cookie/Postgres actuales; gate `requireAuth` por env; dev/unit/e2e existentes intactos. |

## Contexto: lo que ya existe (no se rehace)

- Multitenancy operativa: cookie HMAC `opforja_session` `{tenantId, userId}` (HttpOnly, SameSite=Lax, Secure), aislamiento `tenant_id` en cada query del repo Postgres, PK compuesto `(tenant_id, id)` en modelos, FKs CASCADE.
- `crearModelPersistenceFetchHandler` puro, compartido por prod (model-api Bun), dev (middleware Vite + `repoMemoria`) y tests.
- Sistema de migraciones versionado (`opforja_schema_migrations`, migración 1 aplicada).
- Blindaje 2026-06-06: secret fail-fast ≥32 chars, rate-limit nginx por IP, backup diario pg_dump 14d.

## §1 Modelo de datos — migración 2 (`auth_identidad`)

```sql
CREATE TABLE opforja_accounts (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,            -- normalizado lowercase+trim; índice único sobre email
  password_hash TEXT NOT NULL,    -- scrypt node:crypto
  user_id TEXT NOT NULL REFERENCES opforja_users(id),
  creado_en TEXT NOT NULL,
  ultimo_login_en TEXT
);
CREATE UNIQUE INDEX opforja_accounts_email_idx ON opforja_accounts (email);

CREATE TABLE opforja_account_tenants (   -- membresía: v1 siempre 1 fila rol 'owner'
  account_id TEXT NOT NULL REFERENCES opforja_accounts(id) ON DELETE CASCADE,
  tenant_id TEXT NOT NULL REFERENCES opforja_tenants(id) ON DELETE CASCADE,
  rol TEXT NOT NULL DEFAULT 'owner',
  creado_en TEXT NOT NULL,
  PRIMARY KEY (account_id, tenant_id)
);
```

La membresía existe desde el día uno para que invitaciones/roles futuros sean migración aditiva, no rediseño. En v1 la resolución de login toma la única fila.

## §2 Sesión y cookie

- Misma cookie `opforja_session`, mismo HMAC; payload ampliado: `{tenantId, userId, auth: true}`.
- Cookies anónimas viejas (sin `auth`) ⇒ inválidas bajo `requireAuth` ⇒ 401.
- Cookie autenticada: `Max-Age` **30 días** (vs 180 del anónimo); **rotación en cada login** (token nuevo).
- El resolver de prod bajo `requireAuth` **no auto-crea** tenants: cookie válida con `auth` o nada.

## §3 Endpoints (en el handler compartido)

| Ruta | Método | Comportamiento |
|---|---|---|
| `/__deep-opm/auth/login` | POST | `{email, password}` → verifica scrypt → Set-Cookie autenticada + `{session}`. Fallo: 401 con mensaje uniforme "Credenciales inválidas" (no revela existencia del email). |
| `/__deep-opm/auth/logout` | POST | Set-Cookie expirada + 200. |
| `/__deep-opm/session` | GET | Con `requireAuth`: 200 sólo con sesión autenticada; si no, **401**. |
| resto de persistencia | * | Con `requireAuth`: **401** sin sesión autenticada. |
| `/healthz` | GET | Público, sin cambios. |

Gate: `crearModelPersistenceFetchHandler({ repo, sessionResolver, requireAuth })`. Prod: `MODEL_REQUIRE_AUTH=true` (compose). Dev middleware/unit: sin el flag ⇒ comportamiento actual intacto (los ~263 smoke existentes no se tocan).

Fuerza bruta: rate-limit nginx existente + costo scrypt. Sin lockout por cuenta en v1 (YAGNI; el riesgo lo acota nginx).

## §4 Frontend

- `bootstrapSession` (en `src/persistencia/backend.ts`) distingue 401 ⇒ estado `requiere-login` en el store.
- **`PantallaLogin`** (Preact, tokens ui-forja): bloquea el workbench completo; email+password; error explícito (credenciales vs servicio caído). Login OK ⇒ re-bootstrap de sesión y workspace.
- **"Cerrar sesión"**: ítem en menú principal + comando de paleta ⇒ POST logout ⇒ vuelve a `PantallaLogin`.
- Sin signup, sin "olvidé mi contraseña" en UI (registro cerrado, D2).

## §5 CLI de cuentas — `bun run auth:cuenta`

Corre con `DATABASE_URL` (en el servidor: `docker exec opforja-model-api bun ...`).

- `crear <email>` — password por stdin (no argv); crea tenant+user+account+membresía.
- `crear <email> --tenant <id>` — **adopción**: liga la cuenta a un tenant EXISTENTE (rescate de tenants anónimos valiosos, p.ej. el del operador).
- `reset <email>` — nueva password por stdin.
- `listar` — cuentas con email, tenant, último login.

## §6 Testing

- **Unit (handler puro + repo memoria)**: login ok/fallo/uniformidad de error, gate 401 en todas las rutas, logout, rotación de cookie, cookie anónima vieja rechazada, adopción de tenant, migración 2 idempotente.
- **E2E**: project Playwright `auth` con webServer propio (`MODEL_REQUIRE_AUTH=true` + cuenta sembrada; patrón del project `mobile` en puerto propio): carga ⇒ PantallaLogin ⇒ login ⇒ workbench con persistencia ⇒ logout ⇒ 401/login. Los projects existentes (chromium, mobile) no cambian.
- Gate del corte: `bun run gate:refactor` + smoke en paridad + lane auth verde.

## §7 Deploy, migración de datos y rollback

1. Migración 2 se aplica sola al levantar model-api (sistema existente).
2. `MODEL_REQUIRE_AUTH=true` en compose (junto a los secrets actuales).
3. Operador crea su cuenta vía `docker exec` y, si quiere conservar su workspace actual, adopta su tenant anónimo con `--tenant`.
4. **Rollback**: `MODEL_REQUIRE_AUTH=false` + `docker compose up -d` restaura el comportamiento anónimo actual sin tocar datos (las tablas nuevas son aditivas).

## Fuera de alcance (corte posterior)

- Invitaciones, roles efectivos (la columna `rol` queda fija en `'owner'`), UI de administración de cuentas/tenants, multiusuario por tenant, SMTP/recuperación self-service, OAuth/passkeys.

## Riesgos

- La pantalla de login pasa a ser la puerta de TODO el producto: si el model-api cae, no hay acceso (igual que hoy con la persistencia, pero ahora visible al entrar). Mitigación: healthcheck compose existente + mensaje de error distinguible en PantallaLogin.
- Cookies anónimas activas al momento del deploy quedan invalidadas de golpe (esperado, D3); los datos NO se pierden (adopción por CLI).
- `VITE_MOBILE_READONLY`: el shell mobile también queda detrás del login (correcto: D3 sin excepciones).
