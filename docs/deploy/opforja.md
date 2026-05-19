# Deploy Privado Opforja

**Dominio:** `https://opforja.sanixai.com`
**Modo:** SPA estatica Vite servida por Nginx, con sidecar interno Bun para
captura de bugs (`/__deep-opm/bug-reports`), publicada por Traefik en la red
Docker externa `web`.
**Acceso:** privado por Basic Auth de Traefik (`opforja-auth@docker`). No
guardar contrasenas en claro en este repo.

> Doc del **administrador** de la instancia. Para uso operativo del
> modelador (entrar, crear, guardar, respaldar, exportar SVG) ver
> `docs/uso-productivo.md`.

## Patrón Operativo

Este deploy replica el patron usado por `hdos-app`: `docker-compose.yml` local,
servicio conectado a red `web`, labels Traefik, TLS con
`certresolver=myresolver` y contenedor reiniciable.

Diferencia critica: `hdos-app` tiene auth de aplicacion; `deep-opm-pro` todavia
no. Por eso `opforja` queda protegido con un middleware Traefik propio,
`opforja-auth@docker`, aislado del Basic Auth global del dashboard Traefik.

El capturador de bugs no forma parte del modelo OPM ni de la persistencia de
usuario. En `opforja` se habilita por build arg `VITE_ENABLE_BUG_CAPTURE=true`
y Nginx reenvia `POST /__deep-opm/bug-reports` al sidecar privado
`bug-capture`. El sidecar escribe reportes en `./docs/bugs` mediante bind mount
local, con el mismo formato usado por Vite en desarrollo.

## Acceso Operativo

- Usuario Basic Auth: `fsanhuezal`.
- Contrasena: entregada fuera del repositorio; `docker-compose.yml` conserva
  solo el hash APR1 usado por Traefik.
- Alcance: barrera perimetral de despliegue privado, no auth de aplicacion ni
  identidad multiusuario.

## Comandos

Desde la raiz del repo:

```bash
docker compose up -d --build
```

Verificar contenedor:

```bash
docker compose ps
docker exec opforja wget -qO- http://127.0.0.1:8080/healthz
docker exec opforja wget -qO- http://bug-capture:3000/healthz
```

Verificar dominio publico:

```bash
curl -I https://opforja.sanixai.com
# Esperado: HTTP/2 401 con WWW-Authenticate: Basic realm="traefik"
```

Verificar acceso autenticado sin escribir la contrasena en el repo:

```bash
OPFORJA_USER=fsanhuezal OPFORJA_PASS='<secreto-local>' \
  curl -sS -o /tmp/opforja.html -w '%{http_code} %{content_type} %{size_download}\n' \
  -u "$OPFORJA_USER:$OPFORJA_PASS" https://opforja.sanixai.com/
# Esperado: 200 text/html ...
```

Verificar certificado:

```bash
printf '' | openssl s_client -servername opforja.sanixai.com -connect opforja.sanixai.com:443 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates
```

Esperado: certificado emitido para `CN = opforja.sanixai.com` por Let's Encrypt.

## Actualización

1. Cerrar cambios de app con `bun run gate:refactor` cuando el cambio toque
   comportamiento.
2. Ejecutar `docker compose up -d --build`.
3. Verificar `docker compose ps`, `healthz` interno y `curl -I` externo.
4. Abrir la app con credenciales Basic Auth y ejecutar smoke manual minimo:
   crear/cargar modelo, descargar backup JSON, exportar SVG del OPD activo y
   crear un bug de prueba con texto corto para verificar `docs/bugs/BUG-*`.

## Datos Del Usuario

La persistencia de modelos vive en `localStorage` del navegador del
usuario y queda ligada al origen `https://opforja.sanixai.com`. El admin
no tiene acceso a esos modelos desde la infraestructura: no hay backend,
no hay base de datos. El respaldo es responsabilidad del usuario via JSON
descargado.

Procedimiento detallado de respaldo, restore y migración entre orígenes:
`docs/uso-productivo.md` §Respaldo Manual.

Implicación operativa para el admin: una actualización del contenedor
no afecta los datos del usuario (viven en el navegador), pero cualquier
cambio que modifique el origen, el navegador del usuario o el storage
del navegador sí. Avisar al usuario antes de operaciones que afecten su
sesión activa.

## Rollback

Rollback simple:

```bash
git checkout <commit-estable>
docker compose up -d --build
```

Apagar el servicio:

```bash
docker compose down
```

## Limites

- No hay auth de aplicacion, multiusuario, backend ni sincronizacion remota.
- El acceso privado depende del middleware Traefik `opforja-auth@docker`.
- `localStorage` no es backup; el respaldo portable es el JSON descargado.
- El sidecar de captura de bugs es una herramienta operativa privada: depende
  del Basic Auth perimetral y escribe en el filesystem local del servidor, no
  en una base de datos.
- El endpoint `/healthz` verifica Nginx/contenedor, no integridad funcional de
  modelado.
