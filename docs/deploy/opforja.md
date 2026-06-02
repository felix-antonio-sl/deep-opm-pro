# Deploy Opforja

**Dominio:** `https://opforja.sanixai.com`
**Modo:** SPA estatica Vite servida por Nginx, sidecar interno Bun para captura
de bugs (`/__deep-opm/bug-reports`) y API interna Bun/Postgres para modelos
nuevos (`/__deep-opm/modelos`), publicada por Traefik en la red Docker externa
`web`.
**Acceso actual:** publico (`HTTP 200`). El Basic Auth de Traefik fue retirado
por decisión del operador. No guardar contrasenas en claro en este repo.

> Doc del **administrador** de la instancia. Para uso operativo del
> modelador (entrar, crear, guardar, respaldar, exportar PNG) ver
> `docs/uso-productivo.md`.

## Patrón Operativo

Este deploy replica el patron usado por `hdos-app`: `docker-compose.yml` local,
servicio conectado a red `web`, labels Traefik, TLS con
`certresolver=myresolver` y contenedor reiniciable.

Diferencia critica: `hdos-app` tiene auth de aplicacion; `deep-opm-pro` todavia
no. En el estado vigente, `opforja` esta publicado sin Basic Auth perimetral.
Para volver a modo privado, re-agregar `opforja-auth@docker` al router de
Traefik y aplicar `docker compose up -d --build`; ver `docs/HANDOFF.md`
§ Riesgos para el hash APR1 vigente.

El capturador de bugs no forma parte del modelo OPM ni de la persistencia de
usuario. En `opforja` se habilita por build arg `VITE_ENABLE_BUG_CAPTURE=true`
y Nginx reenvia `POST /__deep-opm/bug-reports` al sidecar privado
`bug-capture`. El sidecar escribe reportes en `./docs/bugs` mediante bind mount
local, con el mismo formato usado por Vite en desarrollo.

La persistencia de modelos nuevos vive en `opforja-postgres` y se expone a la
SPA por `model-api` bajo `/__deep-opm/modelos`. `localStorage` queda como cache
local transicional para preservar flujos existentes que aun esperan lectura
sincrona; no es la fuente primaria de datos nuevos.

## Contrato Funcional De Apariciones

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

Referencia normativa interna: `docs/roadmap/politica-apariciones-categorial.md`.

## Acceso Operativo

- Estado vigente: acceso publico, sin usuario Basic Auth requerido.
- Estado privado reversible: usuario Basic Auth `fsanhuezal`; contrasena
  entregada fuera del repositorio; usar hash APR1 en labels Traefik, nunca la
  contrasena en claro.
- Alcance del Basic Auth, cuando se reactive: barrera perimetral de despliegue
  privado, no auth de aplicacion ni identidad multiusuario.

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
docker exec opforja-model-api bun -e 'const r=await fetch("http://127.0.0.1:3001/healthz"); console.log(r.status, await r.text())'
```

Verificar dominio publico:

```bash
curl -I https://opforja.sanixai.com
# Esperado vigente: HTTP/2 200 con content-type: text/html
curl -sS https://opforja.sanixai.com/__deep-opm/modelos
# Esperado vigente tras corte sin migracion: {"modelos":[]} o lista de modelos nuevos
```

Si se reactiva Basic Auth, verificar acceso autenticado sin escribir la
contrasena en el repo:

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

## Actualización

1. Cerrar cambios de app con `bun run gate:refactor` cuando el cambio toque
   comportamiento.
2. Ejecutar `docker compose up -d --build`.
3. Verificar `docker compose ps`, `healthz` interno y `curl -I` externo.
4. Abrir la app y ejecutar smoke manual minimo:
   crear/cargar modelo, descargar backup JSON, exportar PNG del OPD activo y
   crear un bug de prueba con texto corto para verificar `docs/bugs/BUG-*`.

## Datos Del Usuario

La persistencia primaria de modelos nuevos vive en Postgres, volumen Docker
`opforja-postgres-data`, tabla `opforja_models`. El payload OPM se almacena como
`JSONB` real; la API devuelve el JSON como texto para hidratar la app.
`localStorage` del navegador queda como cache/espejo transicional, no como SSOT.
No hay migracion de modelos locales antiguos porque el corte parte sin datos
productivos previos.

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
docker compose up -d --build
```

Apagar el servicio:

```bash
docker compose down
```

No usar `docker compose down -v` salvo que se quiera borrar la base de datos.

## Limites

- No hay auth de aplicacion, multiusuario ni ownership por usuario; la instancia
  publica expone un catalogo compartido.
- La instancia esta publica mientras `opforja-auth@docker` no este aplicado.
- `localStorage` no es backup; el respaldo portable sigue siendo el JSON
  descargado o el backup de Postgres.
- El endpoint de modelos acepta hasta 15 MiB por request en `model-api`;
  Nginx permite hasta 25 MB en `/__deep-opm/modelos`.
- El sidecar de captura de bugs escribe en el filesystem local del servidor,
  no en una base de datos. Mientras la instancia sea publica, el endpoint
  `POST /__deep-opm/bug-reports` queda expuesto a internet.
- `/healthz` de Nginx verifica el contenedor web; `/healthz` de `model-api`
  verifica conectividad Postgres basica, no integridad funcional de modelado.
