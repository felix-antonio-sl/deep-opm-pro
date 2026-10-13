# Operación de OpForja

Estos procedimientos son instrucciones para un operador autorizado. No ejecute estos comandos por el
solo hecho de leer esta guía; desplegar, borrar datos o tocar credenciales exige autorización expresa.

## Variables y entorno

| Variable | Uso |
|---|---|
| OPFORJA_DATOS | directorio de cuenta/modelos/previas/papelera/archivo |
| OPFORJA_WEB | build web; en desarrollo lo sirve Vite |
| OPFORJA_SECRETO | secreto de sesión proporcionado fuera del repositorio |
| OPFORJA_TOKEN | token Bearer opcional de API, nunca se imprime |
| OPFORJA_VERSION | versión de proceso y bundle, deben coincidir |
| PORT | puerto del servidor |
| OPFORJA_PREVIAS / OPFORJA_PREVIAS_MIN | copias previas y separación temporal, default 30/10 |
| OPFORJA_URL | URL del circuito deploy, default documentado opforja.sanixai.com |
| PW_CHROMIUM / PLAYWRIGHT_BROWSERS_PATH | ruta explícita de Chrome o registro Playwright instalado |
| OPFORJA_E2E_PUERTO | puerto exclusivo de pruebas, entero 1..65535/default 8787 |

El servidor admite --datos y --host. Los comandos con Bun pueden usar --no-env-file
para evitar carga implícita; no copie secretos a scripts, modelos o logs. La build
web y servidor deben llevar la misma OPFORJA_VERSION. envDir:false protege Vite.

### 8.2 Autenticación de una cuenta

- **Cuenta**: `/datos/cuenta.json` = `{"email", "hashClave", "versionCredencial"}`. `hashClave` usa
  el formato `scrypt$16384$8$1$<sal>$<hash>`, porte exacto de `passwordHash.ts`, así que la
  migración copia el hash actual sin pedir la clave.
- **CLI** (`servidor/cuenta.ts`, en el contenedor):
  - `bun --no-env-file servidor/cuenta.js crear <email>` recibe la clave dos veces por stdin
    (≥ 10 caracteres) y falla si ya existe una cuenta;
  - `clave` cambia la clave y sube `versionCredencial`, lo que cierra las sesiones;
  - `cerrar-sesiones` sube `versionCredencial`.
  - Las tres órdenes leen, cambian y publican la cuenta bajo un cerrojo exclusivo
    (`/datos/.cuenta.lock`), así que dos órdenes simultáneas no se pisan. El cerrojo nunca se
    retira por antigüedad: si no se obtiene en 15 s, la orden falla sin cambiar nada. Si un
    proceso caído lo dejó, bórrelo a mano cuando ninguna orden de cuenta esté en curso.

  Todas aceptan `--datos <dir>`. El CLI consume stdin hasta EOF y no desactiva
  el eco: el operador captura su clave de forma protegida y la proporciona por
  stdin, sin incluirla en argumentos ni logs.

  Para crear la cuenta desde una terminal interactiva en el host del contenedor,
  este comando pregunta el correo y oculta la clave. El operador lo ejecuta;
  ningún agente debe suministrar una clave sintética para el corte vigente.

  ```sh
  python3 -c '
  import getpass, subprocess
  correo = input("Correo: ").strip()
  clave = getpass.getpass("Clave (mínimo 10 caracteres): ")
  repeticion = getpass.getpass("Repite la clave: ")
  if len(clave) < 10 or clave != repeticion:
      raise SystemExit("Las claves deben coincidir y tener al menos 10 caracteres.")
  resultado = subprocess.run(
      ["docker", "exec", "-i", "opforja", "bun", "--no-env-file",
       "servidor/cuenta.js", "crear", correo, "--datos", "/datos"],
      input=clave + "\n" + repeticion + "\n", text=True)
  raise SystemExit(resultado.returncode)
  '
  ```

- **Sesión**: la cookie es `opforja_sesion=<b64url({"v":versionCredencial,"exp":epoch})>.<b64url(HMAC-SHA256)>`,
  con `HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=2592000` (30 días; `Secure` se omite solo
  en `localhost`). Se verifica en tiempo constante; un `v` distinto del de la cuenta da 401.
- **Login**: siempre se verifica contra un hash, el de la cuenta o un señuelo, para igualar el
  costo, y la respuesta es uniforme. Cinco fallos por IP (según `X-Forwarded-For` de Traefik) en 15
  min dan 429 por 15 min; 20 fallos globales en 15 min dan 429 global.
- **CSRF**: toda petición que muta **con cookie** exige la cabecera `X-Opforja: 1`. Si viene
  `Origin`, debe coincidir con el host; si no, 403.
- **Token Bearer opcional** (DECISIONS 13):
  - Sin `OPFORJA_TOKEN`, toda cabecera `Authorization` da 401.
  - Si existe, se compara con `timingSafeEqual(sha256(t), sha256(OPFORJA_TOKEN))`.
  - Un token válido actúa como la cuenta en `/api/modelos*` y `/api/papelera*`, sin CSRF porque no
    es una credencial ambiente.
  - No sirve para `/api/sesion` ni para cambiar la clave.
  - Los fallos cuentan para el límite de intentos.
  - En el log se registra `auth:"bearer"`, nunca el token.

### 8.3 Almacenamiento en archivos (`servidor/almacen.ts`)

```
/datos/                                   (volumen Docker opforja-datos)
├── cuenta.json
├── modelos/<id>.json                     documento canónico v0 (nombre de archivo == modelo.id)
├── previas/<id>/<ISO-8601>--<rev8>.json  copias previas rotadas (sin UI, DECISIONS 6)
├── papelera/<id>--<ISO-8601>--<motivo>.json   eliminados y reemplazados (purga > 30 días, al arrancar y cada 24 h)
└── archivo/                              documentos inválidos apartados; no lo lee la app
```

- **Escritura atómica**: `modelos/.tmp-<id>-<aleatorio>`, luego `write` + `fsync`, `rename` sobre
  `<id>.json` y `fsync` del directorio. Nunca queda un archivo a medias.
- **CAS**: bajo un mutex por id (cadena de promesas; hay un solo proceso) se lee, se calcula la
  `rev` vigente, se compara con `If-Match` y se escribe. Si difiere, 412 con la `rev` vigente.
- **Copias previas** (DECISIONS 6):
  - Dentro del mismo mutex y **antes** del `rename`, si la copia más reciente de `previas/<id>/`
    tiene más de `OPFORJA_PREVIAS_MIN` minutos (o no existe), el archivo vigente se enlaza con
    `link` (o `copyFile` si falla) como `previas/<id>/<fecha>--<rev8>.json`.
  - Se conservan las `OPFORJA_PREVIAS` más recientes y se borran las demás en la misma operación.
  - 30 copias con 10 min entre ellas cubren ≥ 5 h de edición continua y, con pausas, días.
  - Para recuperar una (`docs/operacion.md`): `docker cp` y luego **Importar** en la Biblioteca, que
    crea un modelo nuevo, o `PUT` con el token.
- **Índice**: vive en memoria y se construye al arrancar, parseando cada `modelos/*.json` con
  `importarV0` y contando con `resumen` (§3.4.1). Se actualiza en cada escritura. Solo se mueve a
  `archivo/invalidos/` (y se registra) un archivo que no pasa `JSON.parse` o da `ok: false`; uno
  legible que ya no es punto fijo del códec vigente se sigue sirviendo tal cual (§3.4.4, CC-14).
- **Log**: una línea JSON por petición (`metodo`, `ruta` sin cuerpo, `estado`, `ms`, `auth`) y por
  evento de almacén. Nunca contiene contenido de modelos, claves ni tokens.

### 8.7 Respaldo

`deploy/respaldo.sh` ejecuta, con `umask 077`:

```
docker run --rm -v opforja-datos:/datos:ro -v "$DESTINO":/respaldo alpine tar czf /respaldo/opforja-$(date +%F).tgz -C /datos .
```

La retención es de 14 días. El temporizador systemd de usuario corre a diario a las 03:30
(`deploy/systemd/opforja-respaldo.timer`). El servicio ejecuta una copia instalada del script,
`~/.local/lib/opforja/respaldo.sh`, y escribe en `OPFORJA_RESPALDOS=~/.local/state/opforja/respaldos`,
ambos fuera del checkout; la cabecera de `opforja-respaldo.service` da los comandos de instalación, que
se hacen desde una versión publicada. Restaurar es detener, hacer `tar xzf` en el volumen y arrancar.
Los archivos son JSON legibles, así que un modelo también se recupera a mano.

`deploy.sh` no revierte solo si la verificación posterior falla. Antes de desplegar, conserve la
imagen en servicio con `docker tag opforja:latest opforja:previo`; para volver a ella,
`docker tag opforja:previo opforja:latest` y `docker compose up -d --no-build`. `/salud` informará
entonces la versión anterior.

---

## Despliegue y recuperación

El único circuito es `./deploy/deploy.sh`, sujeto a autorización explícita. Construye la imagen
con la versión Git del árbol, espera salud y comprueba versión, acceso anónimo 401 y HTML de la
aplicación. Necesita el árbol limpio y `OPFORJA_SECRETO` en el `.env` ignorado junto al compose
(permisos `0600`, nunca impreso). Conserva el volumen `opforja-datos`; antes de desplegar, conserve
también la imagen en servicio (§8.7) y saque un respaldo.

Recuperar una copia previa: copie el JSON elegido a una ubicación protegida y use Importar en la
Biblioteca (ID nuevo) o la API con el CAS vigente. Restaurar desde la papelera no admite aceptar
pérdidas; 400/422 conserva su entrada y muestra el Informe. Descargue el original antes de una
recuperación manual y decida las reparaciones explícitamente. Si el almacenamiento falla, preserve
la única copia original y lea el log, que no contiene cuerpos, claves ni tokens.

La cuenta la crea el dueño con el comando protegido de §8.2. La salud técnica no acredita la
prueba de humo humana: entrar, crear y editar un modelo, ver «Guardado», recargar y comprobar que
persiste.

**Datos heredados.** OpForja arrancó con la biblioteca vacía y sin migrar el producto anterior
(decisión del dueño). Su volumen PostgreSQL, `deep-opm-pro_opforja-postgres-data`, y su respaldo se
conservan sin montar: no ejecute `down -v`, `volume rm` ni limpieza sobre ellos. El migrador que los
leía ya no forma parte del producto; queda en Git hasta `d5f77c7c`.
