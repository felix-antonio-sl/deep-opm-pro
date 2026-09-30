# Despliegue de opforja

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
El editor conserva una copia local en IndexedDB, separada por tenant, usuario y
documento. «Guardado aquí» confirma esa escritura local; «Sincronizado» exige
el acuse remoto de la misma revisión. La copia local permite recuperar trabajo
de una cuenta previamente autenticada cuando se corta la conexión. Un cierre
de sesión o un rechazo de autenticación no autoriza abrir ni reenviar los datos
de esa cuenta desde otra identidad.

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
- Estado privado reversible: usuario Basic Auth administrado fuera del repositorio;
  usar hash APR1 en labels Traefik, nunca el usuario real ni la contraseña en claro.
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
viaja en el bundle servido. El comando falla si Compose no alcanza disponibilidad
en 120 segundos, el sitio no responde, el acceso anónimo a sesión no devuelve 401
o el bundle no contiene el SHA esperado. `OPFORJA_URL` permite verificar otra
instancia del mismo circuito. Las regresiones del script se comprueban con
`cd app && bun test scripts/deploy.test.ts`.

`bun run cordon:skill` comprueba las emisiones instaladas de Claude y Codex
contra los pins por runtime de `app/src/canon/selloSkill.ts`. Las versiones
aceptadas pueden diferir. Las emisiones con sello conservan la comprobación de
versión y procedencia; la emisión nativa de Codex se compara por la firma del
conjunto de `SKILL.md` y sus referencias. Esa firma se contrastó con una salida
de `kora_cli.py render codex urn:kora:artefacto:modelamiento-opm`, sin reinstalar.
Un cambio de pin requiere revisar la emisión desde su fuente KORA y su contrato;
no basta con tomar el hash de lo instalado. El despliegue de la aplicación no
modifica las skills ni la biblioteca externa.

El corpus OPM se resuelve mediante `docs/canon-opm/resolutor-urn.json` hacia
`kora-knowledge`. `KORA_RAIZ` permite cambiar la raíz para el lector de doctrina;
`TUTOR_CANON_ROOT` cumple esa función para la materialización del Tutor.

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
OPFORJA_USER='<usuario>' OPFORJA_PASS='<secreto-local>' \
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
docker exec -it opforja-model-api bun run ./app/scripts/auth-cuenta.ts crear '<email>'

# ADOPCIÓN: crear cuenta ligada a un tenant anónimo EXISTENTE (rescatar datos).
# Identificar primero el tenant valioso:
docker exec -it opforja-postgres psql -U opforja -d opforja \
  -c "SELECT tenant_id, COUNT(*) AS modelos FROM opforja_models GROUP BY 1 ORDER BY 2 DESC"
docker exec -it opforja-model-api bun run ./app/scripts/auth-cuenta.ts crear '<email>' --tenant <tenant-id>

# Reset de password / listar cuentas
docker exec -it opforja-model-api bun run ./app/scripts/auth-cuenta.ts reset '<email>'
docker exec -it opforja-model-api bun run ./app/scripts/auth-cuenta.ts listar
```

Notas operativas:

- El gate vive en `model-api` (`MODEL_REQUIRE_AUTH: "true"` en compose).
  **Rollback de emergencia**: cambiar a `"false"` y ejecutar el circuito canónico
  `./deploy/deploy.sh`; restaura el comportamiento anónimo previo sin tocar datos
  (la migración 4 es aditiva).
- Las cookies anónimas previas quedan invalidadas al activar el gate
  (los datos NO se pierden: se rescatan con adopción `--tenant`).
- La cookie autenticada dura 30 días y rota en cada login. "Cerrar sesión"
  vive en el command palette (Ctrl/Cmd+K).
- Fuerza bruta: acotada por el rate-limit nginx existente + costo scrypt;
  el login responde "Credenciales inválidas" uniforme (sin oráculo de email).

## Agente integrado en el candidato de producto

El servicio de tareas vive en `model-api` y comparte las transacciones de modelos.
No requiere otro contenedor ni un runtime de herramientas de shell. Está apagado
por defecto; la edición manual sigue disponible sin proveedor generativo.

| Variable de servidor | Valor o función |
|---|---|
| `OPFORJA_AGENT_ENABLED` | `true` habilita llamadas; por defecto `false` |
| `OPFORJA_AGENT_PROVIDER` | `xiaomi-mimo` por defecto; `opencode-zen` como alternativa explícita |
| `OPFORJA_AGENT_MODEL` | `mimo-v2.6-pro` para MiMo directo |
| `OPFORJA_AGENT_API_KEY` | credencial del proveedor seleccionado, solo en entorno de servidor |
| `OPFORJA_AGENT_MAX_TASK_USD` | presupuesto inicial por tarea; por defecto `1` USD |

Las claves no usan prefijo `VITE_` ni se incluyen en el build del navegador. Una
credencial de Zen, MiMo directo o un plan de tokens se usa únicamente en su ruta
correspondiente. El adaptador MiMo está fijado a
`https://api.xiaomimimo.com/v1/chat/completions`; no acepta una URL arbitraria.
La red `agent-egress` permite salida del servicio al proveedor sin exponer puertos
del backend. La ruta SSE de tareas desactiva el buffering en Nginx.

Antes de habilitar inferencia, ejecutar desde `app/`, con la credencial configurada
en el `.env` privado de la raíz (o ya exportada en el entorno):

```bash
bun --env-file=../.env run scripts/probe-agent-provider.ts --provider xiaomi-mimo --model mimo-v2.6-pro --synthetic
```

La sonda verifica catálogo y dos turnos con herramienta sintética; no envía modelos
del usuario. Un pase acredita esa conexión, no la calidad general del modelado.
Cambiar a un modelo sin precios conocidos exige configurar explícitamente su
precio y fecha en el servidor; el servicio no sustituye el modelo en silencio.
Los límites por tarea conservan consumo acumulado. Si falta uso informado, la
reserva se mantiene y continuar requiere aceptación explícita en la interfaz.

El corpus del agente reutiliza `.tutor-corpus/tutor-sources` materializado durante
el build. El contenedor no necesita acceso al repositorio KORA del host. Un fallo
del proveedor suspende la tarea y preserva los cambios ya confirmados y sus
recibos. Desactivar inferencia no revierte esos cambios.

Esta configuración pertenece al candidato en desarrollo; no acredita que la
instancia publicada ya ejecute estas capacidades. El despliegue mantiene el
procedimiento único `./deploy/deploy.sh` y requiere autorización de ese efecto.

## Actualización

1. Cerrar cambios de app con `cd app && bun run check`; añadir el E2E afectado para
   interacción y reservar `gate:refactor` para cambios transversales.
2. Ejecutar `./deploy/deploy.sh` desde la raíz.
3. Verificar `docker compose ps`, `healthz` interno y `curl -I` externo.
4. Abrir la app y ejecutar el smoke manual autorizado: crear/cargar un modelo
   sintético, descargar su backup JSON y exportar PNG del OPD activo. Crear un bug de
   prueba solo con autorización explícita, porque deja un artefacto operativo en
   `docs/bugs/BUG-*`; retirarlo o cerrarlo al terminar.

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
- `opforja_agent_tasks`, `opforja_agent_changes`, `opforja_agent_events`,
  `opforja_agent_results` y `opforja_agent_variants`: tareas, propuestas,
  recibos/inversos, resultados y continuidad del agente.
- `opforja_review_shares`, `opforja_review_annotations` y
  `opforja_review_resolutions`: revisiones fijas compartidas, observaciones y
  resoluciones del propietario. Los tokens de lectura se almacenan como hash.

La API devuelve JSON como texto para hidratar la app. IndexedDB guarda el
snapshot local, su diario pendiente, el historial necesario y las ramas en
conflicto en una transacción por documento. La sincronización usa el ancestro
capturado y un testigo de revisión; una divergencia conserva ambas ramas y pide
una elección explícita. No aplica automáticamente «la última escritura gana».
El control «Guardado del documento» permite guardar aquí, sincronizar, comparar
el OPL de ambas ramas y descargar una recuperación completa. Ante cuota o fallo
local, el estado permanece sin guardar y la copia en memoria sigue disponible
para descarga; borrar datos del navegador puede eliminar trabajo no exportado.

Los tenants anónimos previos se rescatan asociándolos a una cuenta con
`auth:cuenta --tenant`; ese rescate no depende de la nueva copia local.

«Compartir revisión» crea una instantánea fija, vinculada al propietario y a una
revisión efectiva confirmada. El enlace permite leerla y añadir observaciones
según su permiso; los cambios posteriores del editor no alteran esa copia.
Revocar el enlace impide nuevas lecturas. Las rutas de revisión usan
`Cache-Control: no-store` y `Referrer-Policy: no-referrer`; no registrar sus tokens.

«Paquete portátil» exporta la revisión abierta con un manifiesto de perfil,
integridad, vistas y fuentes seleccionadas expresamente. El lector estático
vive en `/portable-reader/`. Puede prepararse conectado y volver a abrirse sin
red; su service worker se limita a esa ruta y a sus recursos estáticos, sin
cachear la API ni el editor. Las fuentes omitidas quedan como localizadores,
sin texto oculto en el modelo serializado. Un perfil incompatible conserva los
bytes originales para recuperación y muestra la limitación. El checksum
acredita integridad de bytes, no equivalencia semántica ni verdad del modelo.

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
- La recuperación local no sustituye un respaldo independiente: conservar el
  JSON/paquete descargado o el backup de Postgres fuera del navegador.
- El endpoint de modelos acepta hasta 15 MiB por request en `model-api`;
  Nginx permite hasta 25 MB en `/__deep-opm/modelos` y
  `/__deep-opm/workspace`.
- El sidecar de captura de bugs escribe en el sistema de archivos local del servidor,
  no en una base de datos. Mientras la instancia sea pública, el endpoint
  `POST /__deep-opm/bug-reports` queda expuesto a internet.
- `/healthz` de Nginx verifica el contenedor web; `/healthz` de `model-api`
  verifica conectividad Postgres básica, no integridad funcional de modelado.
