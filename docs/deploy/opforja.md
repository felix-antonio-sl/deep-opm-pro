# Deploy Opforja

**Dominio:** `https://opforja.sanixai.com`
**Modo:** SPA estática Vite servida por Nginx, sidecar interno Bun para captura
de bugs (`/__deep-opm/bug-reports`) y API interna Bun/Postgres para modelos
nuevos (`/__deep-opm/session`, `/__deep-opm/workspace`,
`/__deep-opm/modelos`), publicada por Traefik en la red Docker externa `web`.
**Acceso actual:** la SPA carga pública (`HTTP 200`) pero exige **login de
aplicación** (auth v1, 2026-06-10): sin sesión autenticada el backend responde
401 y la UI monta `PantallaLogin`. Ver § Cuentas y login. El Basic Auth de
Traefik fue retirado previamente; no guardar contraseñas en claro en este repo.

> Doc del **administrador** de la instancia. Para uso operativo del
> modelador (entrar, crear, guardar, respaldar, exportar PNG) ver
> `docs/uso-productivo.md`.

## Carpeta `deploy/` (raíz del repo)

Infraestructura versionada, distinta de este `docs/deploy/` (que es el runbook).
Contenido:

- `nginx.conf`: rate-limiting (blindaje 2026-06-06) — el `Dockerfile` la copia a
  `/etc/nginx/conf.d/default.conf` de la imagen `opforja`. No se edita en el
  contenedor; se edita aquí y se reconstruye con `./deploy/deploy.sh`.
- `backup-opforja-db.sh` + `systemd/opforja-db-backup.{service,timer}`: backup
  diario `pg_dump` de `opforja-postgres` (retención 14 días, 03:30
  America/Santiago). Instalación e instrucciones de restauración documentadas
  como comentario de cabecera en el propio script; en resumen:
  `cp deploy/systemd/opforja-db-backup.{service,timer} ~/.config/systemd/user/ && systemctl --user daemon-reload && systemctl --user enable --now opforja-db-backup.timer`.
  Si se reconstruye el host, reinstalar el timer con ese mismo comando.

## Patrón operativo

Este deploy replica el patrón usado por `hdos-app`: `docker-compose.yml` local,
servicio conectado a red `web`, labels Traefik, TLS con
`certresolver=myresolver` y contenedor reiniciable.

Desde auth v1 (2026-06-10) `opforja` tiene **auth de aplicación** (login
obligatorio por correo y contraseña, registro cerrado) — el Basic Auth perimetral dejó
de ser necesario. Si igualmente se quisiera doble barrera, re-agregar
`opforja-auth@docker` al router de Traefik y aplicar `./deploy/deploy.sh`.

El capturador de bugs no forma parte del modelo OPM ni de la persistencia de
usuario. En `opforja` se habilita por build arg `VITE_ENABLE_BUG_CAPTURE=true`
y Nginx reenvía `POST /__deep-opm/bug-reports` al sidecar privado
`bug-capture`. El sidecar escribe reportes en `./docs/bugs` mediante bind mount
local, con el mismo formato usado por Vite en desarrollo.

La persistencia de modelos vive en `opforja-postgres` y se expone a la SPA por
`model-api`. Desde auth v1 la cookie HTTP-only firmada `opforja_session`
se emite solo en el login (`POST /__deep-opm/auth/login`); ya no se acuñan
tenants anónimos. Modelos, workspace/carpetas, versiones y autosave quedan
aislados por `tenant_id` de la cuenta.
No hay caché ni recuperación heredada desde el almacenamiento del navegador:
si la API no está disponible, la app falla de forma explícita en persistencia.

## Contrato funcional de apariciones

Para verificar o depurar Opforja, usar esta regla como contrato estable:

```text
Entidad visible en un OPD <=> existe una Apariencia local en opd.apariencias
```

La existencia global en `modelo.entidades` no obliga al render a mostrar la
entidad. El render de JointJS debe proyectar la fibra local del OPD activo:
sus apariciones de entidades y apariciones de enlaces. No debe inferir
visibilidad desde el conjunto global de entidades.

`contextoRefinamiento` declara rol local de una aparición, no visibilidad:

- `contorno`: aparición local de la cosa refinada como contenedor.
- `interno`: aparición confinada al contorno del refinamiento.
- `externo`: aparición externa materializada por la relación con el OPD padre.
- sin contexto: aparición manual/contextual del OPD activo.

Solo las apariciones externas materializadas automáticamente por refinamiento
son candidatas a limpieza automática durante resincronización. Las apariciones
manuales o contextuales creadas por el usuario deben conservarse salvo acción
explícita del usuario.

Referencia normativa interna: `app/src/modelo/politicaApariciones.ts` (+ su ley `politicaApariciones.test.ts`). El doc `docs/roadmap/politica-apariciones-categorial.md` fue eliminado en la auditoría documental (`2a83c1c5`); la política vive en el kernel.

## Acceso operativo

- Estado vigente: acceso publico, sin usuario Basic Auth requerido.
- Estado privado reversible: usuario Basic Auth `fsanhuezal`; contraseña
  entregada fuera del repositorio; usar hash APR1 en labels Traefik, nunca la
  contraseña en claro.
- Alcance del Basic Auth, cuando se reactive: barrera perimetral de despliegue
  privado, no auth de aplicación ni identidad multiusuario.

## Comandos

Desde la raíz del repo, comando canónico (estampa la versión visible en la UI):

```bash
./deploy/deploy.sh
```

Envuelve `docker compose up -d --build` y pasa `OPFORJA_BUILD=$(git rev-parse
--short HEAD)`, de modo que el footer de «Ayuda › Atajos» muestra la fecha de
build (automática vía vite) + el short SHA del commit desplegado (tooltip); si
el arbol tiene cambios sin commitear, marca el build `-dirty`. **No usar
`docker compose up -d --build` a secas: el SHA quedaría en `local`** (la fecha
si se estampa igual). El script también espera salud y confirma que el SHA
viaja en el bundle servido.

Verificar contenedor:

```bash
docker compose ps
docker exec opforja wget -qO- http://127.0.0.1:8080/healthz
docker exec opforja wget -qO- http://bug-capture:3000/healthz
docker exec opforja-model-api bun -e 'const r=await fetch("http://127.0.0.1:3001/healthz"); console.log(r.status, await r.text())'
```

Verificar dominio publico:

```bash
curl -I https://opforja.sanixai.com
# Esperado vigente: HTTP/2 200 con content-type: text/html
curl -sS -o /dev/null -w '%{http_code}\n' https://opforja.sanixai.com/__deep-opm/session
# Esperado vigente (auth v1): 401 sin sesión autenticada
curl -sS -c /tmp/opforja.cookies -X POST https://opforja.sanixai.com/__deep-opm/auth/login \
  -H 'content-type: application/json' -d '{"email":"<email>","password":"<password>"}'
# Esperado: {"session":{"tenantId":"tenant-...","userId":"user-...","auth":true}}
curl -sS -b /tmp/opforja.cookies https://opforja.sanixai.com/__deep-opm/workspace
# Esperado: workspace del tenant de la cuenta
```

Si se reactiva Basic Auth, verificar acceso autenticado sin escribir la
contraseña en el repo:

```bash
OPFORJA_USER=fsanhuezal OPFORJA_PASS='<secreto-local>' \
  curl -sS -o /tmp/opforja.html -w '%{http_code} %{content_type} %{size_download}\n' \
  -u "$OPFORJA_USER:$OPFORJA_PASS" https://opforja.sanixai.com/
# Esperado en modo privado: 200 text/html ...
```

Verificar certificado:

```bash
printf '' | openssl s_client -servername opforja.sanixai.com -connect opforja.sanixai.com:443 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates
```

Esperado: certificado emitido para `CN = opforja.sanixai.com` por Let's Encrypt.

## Cuentas y login (auth v1)

Desde el corte auth v1 (`docs/specs/auth-identidad-v1.md`) la instancia exige
**login obligatorio**: sin sesión autenticada el backend responde 401 y la SPA
monta `PantallaLogin`. Registro cerrado — las cuentas se administran SOLO por
CLI dentro del contenedor `model-api`:

```bash
# Crear cuenta nueva (tenant nuevo). La password se pide por stdin.
docker exec -it opforja-model-api bun run ./app/scripts/auth-cuenta.ts crear felix@example.com

# ADOPCIÓN: crear cuenta ligada a un tenant anónimo EXISTENTE (rescatar datos).
# Identificar primero el tenant valioso:
docker exec -it opforja-postgres psql -U opforja -d opforja \
  -c "SELECT tenant_id, COUNT(*) AS modelos FROM opforja_models GROUP BY 1 ORDER BY 2 DESC"
docker exec -it opforja-model-api bun run ./app/scripts/auth-cuenta.ts crear felix@example.com --tenant <tenant-id>

# Reset de password / listar cuentas
docker exec -it opforja-model-api bun run ./app/scripts/auth-cuenta.ts reset felix@example.com
docker exec -it opforja-model-api bun run ./app/scripts/auth-cuenta.ts listar
```

Notas operativas:

- El gate vive en `model-api` (`MODEL_REQUIRE_AUTH: "true"` en compose).
  **Rollback de emergencia**: cambiar a `"false"` + `docker compose up -d`
  restaura el comportamiento anónimo previo sin tocar datos (la migración 4
  es aditiva).
- Las cookies anónimas previas quedan invalidadas al activar el gate
  (los datos NO se pierden: se rescatan con adopción `--tenant`).
- La cookie autenticada dura 30 días y rota en cada login. "Cerrar sesión"
  vive en el command palette (Ctrl/Cmd+K).
- Fuerza bruta: acotada por el rate-limit nginx existente + costo scrypt;
  el login responde "Credenciales inválidas" uniforme (sin oráculo de email).

## Actualización

1. Cerrar cambios de app con `bun run gate:refactor` cuando el cambio toque
   comportamiento.
2. Ejecutar `./deploy/deploy.sh` desde la raíz.
3. Verificar `docker compose ps`, `healthz` interno y `curl -I` externo.
4. Abrir la app y ejecutar smoke manual mínimo:
   crear/cargar modelo, descargar backup JSON, exportar PNG del OPD activo y
   crear un bug de prueba con texto corto para verificar `docs/bugs/BUG-*`.

## Datos del usuario

La persistencia primaria de modelos nuevos vive en Postgres, volumen Docker
`opforja-postgres-data`. Tablas vigentes:

- `opforja_accounts` y `opforja_account_tenants`: cuentas autenticadas y membresía por tenant.
- `opforja_tenants` y `opforja_users`: tenants y usuarios persistidos; la identidad anónima previa quedó retirada por auth v1.
- `opforja_models`: payload OPM como `JSONB` real, scope `(tenant_id, id)`.
- `opforja_workspaces`: snapshot JSONB del `WorkspaceIndice` (carpetas,
  recientes, preferencias de workspace).
- `opforja_model_versions`: snapshots versionados por modelo.
- `opforja_model_autosaves`: último autosave por modelo.

La API devuelve JSON como texto para hidratar la app. El navegador no guarda
payloads OPM ni snapshots de versiones. Los tenants anónimos previos se
rescatan asociándolos a una cuenta con `auth:cuenta --tenant`; no se migran
desde el almacenamiento del navegador.

Procedimiento detallado de respaldo manual por JSON:
`docs/uso-productivo.md` §Respaldo Manual.

Implicación operativa para el admin: una actualización de contenedor no debe
borrar el volumen `opforja-postgres-data`. `docker compose down` conserva el
volumen; `docker compose down -v` lo elimina y debe tratarse como operación
destructiva.

## Rollback

Rollback simple:

```bash
git checkout <commit-estable>
./deploy/deploy.sh
```

Apagar el servicio:

```bash
docker compose down
```

No usar `docker compose down -v` salvo que se quiera borrar la base de datos.

## Límites

- Auth v1 es single-operator: login obligatorio, pero sin roles ni
  multiusuario por tenant (ver § Cuentas y login). Ownership vía cookie
  HTTP-only firmada (`opforja_session`, 30 días); si se pierde la sesión,
  el acceso se recupera con la contraseña de la cuenta (no hay recuperación
  por cookie anónima — ese esquema quedó retirado en auth v1, 2026-06-10).
- La instancia está pública mientras `opforja-auth@docker` no esté aplicado.
- El almacenamiento del navegador no es parte del plan de respaldo; el respaldo
  portable sigue siendo el JSON descargado o el backup de Postgres.
- El endpoint de modelos acepta hasta 15 MiB por request en `model-api`;
  Nginx permite hasta 25 MB en `/__deep-opm/modelos` y
  `/__deep-opm/workspace`.
- El sidecar de captura de bugs escribe en el sistema de archivos local del servidor,
  no en una base de datos. Mientras la instancia sea pública, el endpoint
  `POST /__deep-opm/bug-reports` queda expuesto a internet.
- `/healthz` de Nginx verifica el contenedor web; `/healthz` de `model-api`
  verifica conectividad Postgres básica, no integridad funcional de modelado.
