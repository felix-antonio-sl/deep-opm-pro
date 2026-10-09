# Operación de OpForja

Estos procedimientos son instrucciones para un operador autorizado. Las pruebas
del rehecho y las comprobaciones operativas tienen evidencia separada: los ensayos
PostgreSQL y el respaldo ya recuperado en aislamiento se conservan en privado.
La decisión vigente de fase B autoriza el corte con biblioteca vacía (§9.4).
No ejecute estos comandos por el solo hecho de leer esta guía.

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
└── archivo/                              migración (§8.6) e inválidos; no lo lee la app
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

### 8.6 Migración única desde PostgreSQL (`herramientas/migrar-postgres.ts`)

Capacidad disponible, fuera del corte vigente de fase B (§9.4). No se ejecuta
para poblar la biblioteca nueva ni portar una cuenta.

Uso, dentro de la imagen nueva y conectada a la red del stack viejo:

```
bun servidor/migrar-postgres.js --url <DATABASE_URL> [--email <correo>] [--datos /datos] [--ensayo --salida <dir>] [--reemplazar]
bun servidor/migrar-postgres.js --verificar [--datos /datos]
```

`--verificar` relee cada `modelos/*.json` con `leerCanonico` y termina con código ≠ 0 si alguno
falla. El script vive en `herramientas/` y no en `servidor/` porque usa `diagnosticar` de `nucleo/`
para el informe; así `servidor/` depende solo de `codec/` (§2.2, CC-19). En la imagen se compila a
`servidor/migrar-postgres.js` (§9.1), así que los comandos no cambian. Usa el cliente PostgreSQL
integrado de Bun (`import { SQL } from "bun"`), sin
dependencias. La lectura va detrás de la interfaz
`FuenteLegada { cuentas(); tenants(accountId); indices(tenants); modelos(tenants); autosaves(tenants); versiones(tenants) }`,
inyectable en pruebas con filas falsas.

1. **Cuenta**: `SELECT id, email, password_hash FROM opforja_accounts` (si hay varias, exige
   `--email`), y los tenants con `SELECT tenant_id FROM opforja_account_tenants WHERE account_id =
   $1`. Escribe `cuenta.json` con el mismo hash y `versionCredencial: 1`.
2. **Índice viejo**: `SELECT indice FROM opforja_workspaces WHERE tenant_id = ANY($1)`. Da las
   carpetas y los flags `esApunte`, `esBiblioteca` y `archivado`, solo para el informe.
3. **Modelos**:
   - `SELECT id, nombre, carpeta_id, actualizado_en, archivado, revision, payload::text FROM
     opforja_models WHERE tenant_id = ANY($1)`;
   - autosaves: `SELECT modelo_id, creado_en, payload::text FROM opforja_model_autosaves WHERE
     tenant_id = ANY($1)`.

   La fuente de cada modelo es el autosave si `creado_en > actualizado_en` (ley v0 del testigo); si
   no, el guardado. El otro va a `archivo/…/originales/`.
4. **Por modelo**:
   - se aplica `importarV0(fuente)`;
   - `modelo.id` pasa a ser el id del registro saneado a `ID_MODELO` (§3.3) y `modelo.nombre`, el
     `nombre` del registro (si difiere del payload, se informa). La PK vieja es `(tenant_id, id)`: si
     dos tenants de la cuenta traen el mismo id, el segundo recibe un `m-…` nuevo y el informe lo
     registra (nunca se sobrescribe un archivo, CC-17);
   - se escribe `modelos/<id>.json` con `exportarV0`, o `papelera/` si estaba `archivado`;
   - un rechazo va a `archivo/…/rechazados/<id>.json` (el payload original), con las causas en el
     informe;
   - el payload original se copia siempre a `archivo/…/originales/<id>.json`.

   Los nombres **no se tocan** (DS-7).
5. **Versiones**: `SELECT modelo_id, id, nombre, creado_en, payload::text FROM
   opforja_model_versions WHERE tenant_id = ANY($1)` se copia tal cual a
   `archivo/…/versiones/<modelo>/<id>.json` (recuperable a mano).
6. **Informes** (DECISIONS 12). Por modelo, `archivo/migracion-<fecha>/informes/<id>.md` contiene:
   - el nombre, la carpeta y la especie viejas;
   - la fuente usada (guardado o autosave) y los conteos antes y después (cosas, estados, enlaces,
     abanicos, OPDs);
   - el `Informe` completo del códec, incluido el **diff de visibilidad por OPD** (§8-21);
   - los **errores de canon cargados**, por código (`diagnosticar`, T-288), con sus reparaciones
     sugeridas.

   El índice `archivo/migracion-<fecha>/INFORME.md` tiene los totales, una tabla de modelos con
   enlace a su informe y los rechazados. `--ensayo` escribe lo mismo en `--salida` sin tocar
   `modelos/`.
7. Las tablas del agente, de la revisión compartida y de la captura de bugs no se migran; quedan
   intactas en el volumen PostgreSQL.
8. Seguridad: el script se niega a escribir si `modelos/` no está vacío (salvo `--reemplazar`) y
   solo ejecuta `SELECT`.

### 8.7 Respaldo

`deploy/respaldo.sh` ejecuta, con `umask 077`:

```
docker run --rm -v opforja-datos:/datos:ro -v "$DESTINO":/respaldo alpine tar czf /respaldo/opforja-$(date +%F).tgz -C /datos .
```

La retención es de 14 días. El temporizador systemd corre a diario a las 03:30
(`deploy/systemd/opforja-respaldo.timer`, con `Environment=OPFORJA_REPO=`). Restaurar es detener,
hacer `tar xzf` en el volumen y arrancar. Los archivos son JSON legibles, así que un modelo también
se recupera a mano.

---

## Despliegue, recuperación y transición

El único circuito es `./deploy/deploy.sh`, sujeto a autorización explícita.
Construye con versión Git, espera salud y compara versión y acceso 401. El corte H3
ya está integrado en `main`; el despliegue requiere autorización y verificación
operativas propias. Lea el log sin cuerpos, claves ni tokens; si el almacenamiento
falla, preserve la única copia original.

Recuperar una copia previa: copie el JSON elegido a una ubicación protegida y use
Importar en Biblioteca (ID nuevo) o la API con CAS vigente. Restaurar papelera no
admite aceptar pérdidas; 400/422 conserva su entrada y muestra el Informe. Descargue
el original antes de una recuperación manual y decida reparaciones explícitamente.

### 9.4 Corte de fase B sin migración (autorizado por el dueño)

Decisión textual vigente en `docs/decisiones.md`: «omitimos la migración» y
«OpForja nuevo arranca con la biblioteca vacía». El corte se hizo sin CC-17,
congelamiento separado, respaldo final, ensayo adicional, migración ni
`--verificar`; la revisión de los siete modelos y sus 121 errores queda sin efecto.
Los ensayos anteriores se conservan como evidencia histórica.

Precondiciones: commit nuevo en `main`, árbol limpio y `OPFORJA_SECRETO` instalado
fuera de Git. El secreto de sesión no es la clave de la cuenta.

1. **Destino vacío**: comprobar que `opforja-datos` no existe o está vacío antes del
   deploy. Si contiene datos, conservarlos y detener el corte; no vaciarlo por
   conveniencia. No copiar cuentas, modelos viejos ni material sintético al volumen.
2. **Secreto**: instalar `OPFORJA_SECRETO` en el `.env` ignorado junto al compose,
   con permisos `0600`, sin imprimirlo ni incluirlo en logs o argumentos.
3. **Desplegar**: ejecutar únicamente `./deploy/deploy.sh`, con el proyecto Compose
   real `deep-opm-pro`. Comprueba salud, versión Git, acceso 401 sin sesión y HTML
   de la aplicación.
   El deploy retira los servicios anteriores del proyecto y conserva sus volúmenes.
4. **Cuenta humana**: avisar que el servicio está arriba sin cuenta. El dueño ejecuta
   `servidor/cuenta.js crear <correo> --datos /datos` dentro del contenedor, usando
   Bun y su propia clave dos veces por stdin (mínimo diez caracteres). El operador
   captura la clave sin eco y termina stdin con EOF; el CLI no oculta el eco por sí solo.
5. **Prueba de humo humana**: entrar, crear un modelo, editarlo, ver «Guardado»,
   recargar y comprobar que persiste. La salud técnica no acredita este paso.

Se conserva sin montar el volumen PostgreSQL real
`deep-opm-pro_opforja-postgres-data` (nombre lógico anterior `opforja-postgres-data`),
el respaldo PostgreSQL y la evidencia de ambos ensayos. No se ejecuta `down -v`,
`volume rm` ni limpieza de esos archivos. La preview aislada sigue por su instrucción
propia; no se incorpora al proyecto desplegado ni al volumen de producción.

**Resultado del corte:** `./deploy/deploy.sh` terminó con código 0 y versión
`1e0d3ab0` en `https://opforja.sanixai.com`. Salud 200, acceso anónimo 401 y HTML
200; el JavaScript servido contiene la misma versión. El control inicial de
`opforja-datos` encontró cero archivos, cero modelos y ninguna cuenta. PostgreSQL
quedó conservado sin montar, el respaldo mantuvo su hash y la preview su identidad.
La creación de cuenta y el smoke humano siguen a cargo del dueño.

**Actualización DEC35–38:** el dueño respondió directamente «Autorizo» a la
solicitud de desplegar `5e0003f0`, conservando cuentas/modelos y sin migración
(cita en `docs/decisiones.md`). `./deploy/deploy.sh` terminó con código 0;
salud y cabecera de versión informan `5e0003f0`, sesión anónima 401, HTML y bundle
200, y el JavaScript servido contiene esa versión. Chromium observó la pantalla
«Entrar», DOM listo y cero errores de página o solicitudes externas. La espera
inicial `networkidle` venció; la comprobación posterior verificó la preparación
real de la interfaz y su pantalla, sin cambiar el producto.

Se conservó `opforja-datos:/datos`: cero archivos antes y después, con metadatos
idénticos; no se crearon cuentas ni modelos de prueba. La preview histórica mantuvo
su ID, tiempo de arranque y estado. No se ejecutó migración. El siguiente paso del
dueño sigue siendo crear su cuenta con el comando protegido de §8.2 y realizar
la prueba de humo humana.

**Rollback**: `git checkout pre-rehacer && ./deploy/deploy.sh` levanta el stack viejo con su volumen
intacto. Los cambios hechos en la versión nueva se llevan exportando el JSON. El importador viejo
rechaza la multiplicidad `?`, los objetos con un solo estado, la especialización de estado, los
enlaces sin aparición, el agente desde objeto informacional y el manejador sistémico, y descarta en
silencio `duracion`, `unidadTiempo`, `genero` y `coleccionIncompleta` (las cotas de excepción sí
viajan, porque el export también las escribe en el enlace, §3.4.3); todo eso se documenta en
`docs/operacion.md` (CC-13).

---

## Ensayo y límites del migrador

El CLI fuente está en herramientas/migrar-postgres.ts; build lo escribe como
`dist-servidor/migrar-postgres.js`, copiado a servidor/ en la imagen prevista.
La fuente legada usa marcas TEXT ISO; autosave se elige sólo si es estrictamente
posterior, incluida precisión submilisegundo. Se conservan bytes originales e
Informes. El adaptador Bun serializa explícitamente los tenants como TEXT[].
Guardados: originales/<id>.json; autosaves: originales/autosaves/<id>/<n>.json,
incluso huérfanos. Se rechazan salidas solapadas con datos y componentes symlink;
un fallo parcial no declara éxito ni borra lo ya preservado. --verificar no muta.
Estas propiedades fueron probadas con fuentes falsas y temporales propios;
no acreditan una migración PostgreSQL real ni disponibilidad productiva.
