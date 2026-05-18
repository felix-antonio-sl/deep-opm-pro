# Deploy Privado Opforja

**Dominio:** `https://opforja.sanixai.com`
**Modo:** SPA estatica Vite servida por Nginx, publicada por Traefik en la red
Docker externa `web`.
**Acceso:** privado por Basic Auth de Traefik (`auth@docker`). No guardar
credenciales en este repo.

## Patrón Operativo

Este deploy replica el patron usado por `hdos-app`: `docker-compose.yml` local,
servicio conectado a red `web`, labels Traefik, TLS con
`certresolver=myresolver` y contenedor reiniciable.

Diferencia critica: `hdos-app` tiene auth de aplicacion; `deep-opm-pro` todavia
no. Por eso `opforja` queda protegido con el middleware Traefik existente
`auth@docker`.

## Comandos

Desde la raiz del repo:

```bash
docker compose up -d --build
```

Verificar contenedor:

```bash
docker compose ps
docker exec opforja wget -qO- http://127.0.0.1:8080/healthz
```

Verificar dominio publico:

```bash
curl -I https://opforja.sanixai.com
# Esperado: HTTP/2 401 con WWW-Authenticate: Basic realm="traefik"
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
   crear/cargar modelo, descargar backup JSON y exportar SVG del OPD activo.

## Datos Locales

La persistencia de modelos vive en `localStorage` del navegador y queda ligada
al origen `https://opforja.sanixai.com`. No migra automaticamente desde
`localhost`.

Antes de cambiar de origen, navegador o build:

1. Abrir `Menu principal > Importar/Exportar JSON...`.
2. Usar `Descargar JSON`.
3. Guardar el archivo fuera del navegador.
4. Tras importar en `opforja`, ejecutar `Guardar` o `Guardar como`.

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
- El acceso privado depende del middleware Traefik `auth@docker`.
- `localStorage` no es backup; el respaldo portable es el JSON descargado.
- El endpoint `/healthz` verifica Nginx/contenedor, no integridad funcional de
  modelado.
