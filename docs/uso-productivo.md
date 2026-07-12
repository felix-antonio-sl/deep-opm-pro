# Uso Productivo — Modelador OPM

Guía del usuario para trabajar con modelos OPM en la instancia
`https://opforja.sanixai.com`.

Para administración de la instancia: `docs/deploy/opforja.md`.
Para orientación técnica del repo: `../CLAUDE.md`.

## Qué es

Una herramienta para dibujar modelos OPM/ISO 19450: objetos, procesos,
estados y enlaces. Los modelos se guardan en el backend (Postgres/API)
asociados a una sesión de navegador. No dependen de localStorage.

## Regla de apariciones en diagramas

Una cosa OPM y su dibujo local no son lo mismo:

- La **entidad** existe una vez en el modelo: objeto, proceso o estado.
- La **aparición** es la representación visible de esa entidad dentro de
  un OPD específico.

Regla operativa: **una entidad se muestra en un OPD solo si tiene una
aparición en ese OPD**. Que la entidad exista en el modelo no implica
que deba verse en todos los diagramas.

Consecuencias prácticas:

- Una misma entidad puede aparecer en más de un OPD.
- Ocultar o quitar una aparición local no borra necesariamente la
  entidad del modelo.
- En un OPD refinado, el contorno, las cosas internas y los externos
  contextuales son apariciones locales con roles distintos.

## Entrar

1. Abrir `https://opforja.sanixai.com` en un navegador moderno.
2. La app exige **login** (email+password, auth v1). Sin sesión válida
   el backend responde 401 y la UI monta la pantalla de login.
3. Tras autenticarse, la app abre el último modelo en uso. Si no hay
   modelos previos, abre un modelo vacío listo para modelar.

## Empezar un modelo

**Todo nace apunte**: el comando **`Nuevo`** (paleta `Ctrl+K` › `Nuevo`) abre
al instante un **apunte** —un borrador sin rigor de cierre (ver §Apuntes)—, sin
pedir nombre. La app también abre en un lienzo en blanco cuando el workspace
está vacío.

Crear la primera cosa: botones `Objeto`/`Proceso` de la barra, o los atajos
`O` (objeto) y `P` (proceso) con el canvas enfocado. `S` agrega un estado **al
objeto seleccionado**. Para **conectar**, pulsa `R`: con una cosa seleccionada
la relación parte de ella; sin selección entras en **enlace libre** (clic en el
origen, luego en el destino; `Esc` cancela).

Para modelar con método desde cero (qué función transforma a quién antes de
dibujar), seguir el flujo Forja de `docs/manual-opforja.md` §2 — que admite **dos
arranques**: **SD-primero** (top-down) y **bottom-up** (bosquejar OPDs sueltos en
el Taller y adoptarlos después, ver §Taller).

## Apuntes — borradores sin rigor

Un **apunte** es un modelo en modo borrador: usa las mismas piezas OPM
(objetos, procesos, estados, enlaces) y el mismo lienzo, pero **no se le
exige cerrar** como modelo válido. Sirve para pensar y bocetar sin que la
validación interrumpa. Relaja el *rigor*, no la *semántica*: sigue siendo
OPM legítimo, no un dibujo libre.

- **Nacer y graduar**: todo modelo **nace apunte** (comando `Nuevo`). Un apunte
  muestra la cinta **`Apunte`** en la parte superior; **clic en esa cinta abre
  «Graduar apunte a modelo»**, que muestra el reporte de validez (lo que en el
  apunte estaba en observación) y te deja decidir cerrar. Graduar **no bloquea**
  por validez: informa y deja decidir. Las señales que queden son el checklist
  de lo que falta cerrar.
- **Qué cambia**: en un apunte los avisos de **validez** (falta de
  transformee, nombres pobres, firma de enlaces…) bajan de *bloqueo* a
  *observación al margen* — no detienen el trabajo. La **integridad** del
  documento (referencias rotas, enlaces sin extremo) **sigue bloqueando**:
  un apunte roto no es un borrador legítimo, es un documento roto.
- **Graduar no deja rastro**: al quitarle la marca, los avisos de validez
  vuelven a bloquear y el modelo es un modelo más. Las observaciones que
  quedaron pendientes son el checklist de lo que falta cerrar.
- **No se mezcla con biblioteca**: un modelo es apunte o biblioteca, no
  ambos a la vez.

## Taller — bosquejar bottom-up

No hace falta partir del SD raíz. En el árbol de OPDs, la banda **`Taller`** aloja
**OPDs sueltos** —fragmentos sin padre—: traza hechos OPM locales sin comprometer
aún un SD. Créalos con el botón de OPD suelto del árbol.

Cuando un fragmento encaja, **adóptalo**: clic derecho sobre el OPD suelto →
`Adoptar como descomposición` (in-zoom de un proceso) o `Adoptar como despliegue`
(unfold de un objeto). Adoptar fija el padre y declara el refinamiento en un gesto
—el mismo resultado que el camino top-down—. Un OPD que sigue suelto no bloquea la
edición, pero sí el **export canónico** hasta adoptarlo. (Método: `docs/manual-opforja.md`
§2/A1.5.)

## Gestionar modelos

Abrir el gestor desde `Ctrl+K` › `Abrir / importar modelo` (o el menú ☰). Un solo
buscador filtra todo; a la izquierda, las carpetas y `Archivo`. Los modelos se
agrupan en **dos zonas por su rol**:

- **`Trabajo`**: tus apuntes y modelos juntos, por recencia. El chip de cada fila
  dice si es apunte o modelo, y **muta in-situ al graduar** (la fila no salta de
  zona: el modelo maduró, no cambió de naturaleza).
- **`Bibliotecas`**: los modelos designados como fuente, en un estante aparte, que
  se abren en **solo-lectura** (editarlos exige confirmación). De ellas se traen
  Piezas al lienzo (ver `docs/manual-opforja.md` §9).

Acciones por fila (al pasar el cursor): abrir, abrir en pestaña nueva, duplicar,
archivar, eliminar (con confirmación). `Importar JSON` es una acción del encabezado.

## Tres operaciones diarias

### Guardar — `Ctrl+S`

Arriba a la izquierda hay un chip de estado que muestra una de estas
tres etiquetas:

- `Sin guardar · Ctrl+S` (fondo ámbar): hay cambios sin persistir.
- `Guardando…` (fondo azul claro): autosalvado en curso.
- `Guardado · HH:mm` (fondo verde): persistido a esa hora.

Mientras el chip diga `Sin guardar`, el trabajo no está respaldado
todavía. Pulsar `Ctrl+S` o hacer clic en el chip para guardar.

Los modelos se persisten en el backend (Postgres). Si el backend no
está disponible, la app lo indica explícitamente; no hay fallback
silencioso a localStorage.

### Buscar dentro del modelo — `Ctrl+F`

Abre un diálogo que busca cosas (objetos, procesos, estados) y
etiquetas de enlace por nombre. Un clic en una fila salta al OPD donde
aparece y la selecciona.

### Comandos rápidos — `Ctrl+K`

Abre el command palette: ejecutar cualquier acción del menú sin tocar
el mouse.

## Respaldo manual

El respaldo operativo vive en el backend/Postgres. El respaldo
portátil para llevar fuera de la instancia es el JSON descargado.

### Cuándo descargar JSON

- Al terminar una sesión de trabajo importante.
- Antes de cambios estructurales grandes.
- Antes de depender del modelo para algo real.

### Cómo descargar

1. Guardar el modelo con `Ctrl+S`.
2. Abrir `Menú principal (☰) > Importar/Exportar JSON...`.
3. Pulsar `Descargar JSON`.
4. Guardar el archivo fuera del navegador, con nombre legible y fecha.
   La app sugiere `modelo-YYYY-MM-DD.json` por defecto.

### Cómo restaurar

1. Abrir la app.
2. `Menú principal (☰) > Importar/Exportar JSON...`.
3. Elegir o soltar el archivo `.json`.
4. Confirmar que la vista previa muestra el nombre y los conteos
   esperados.
5. Pulsar `Importar`.
6. Pulsar `Ctrl+S` para persistirlo en el backend.

## Exportar para compartir

Para entregar el diagrama del OPD activo como imagen raster:

`Cmd/Ctrl+K > Exportar OPD actual como PNG`.

El archivo `.png` resultante contiene solo el contenido del OPD: sin
toolbar, sin inspector, sin OPL. Para documentación de un modelo completo,
usar `Cmd/Ctrl+K > Exportar todos los OPDs como PNG`; descarga un `.zip`
con una imagen por OPD.

## Si algo se rompe

### El chip dice `Sin guardar` y no quiero perder el trabajo

Pulsar `Ctrl+S`. Si pide nombre, es porque el modelo nunca se guardó:
usar `Guardar como` desde el menú.

### Cerré el navegador sin guardar

Al reabrir, la app intenta restaurar el último modelo activo desde el
backend. Si no aparece, abrir el gestor (`Ctrl+K` › `Abrir / importar
modelo`) y elegirlo de la lista. Si tampoco está ahí, importar el último
JSON descargado.

### La app no carga o muestra error

Recargar la página con `Ctrl+Shift+R`. Si persiste, contactar al
administrador de la instancia (ver `docs/deploy/opforja.md`).

### Quiero deshacer un cambio reciente

`Ctrl+Z` (deshacer) y `Ctrl+Shift+Z` (rehacer). Funcionan en el canvas
y en operaciones del modelo.

## Atajos útiles

| Atajo | Acción |
|---|---|
| `O` · `P` | Crear objeto · proceso (canvas enfocado) |
| `S` | Estado (al objeto seleccionado) |
| `R` | Conectar (desde selección o enlace libre) |
| `Ctrl+S` | Guardar |
| `Ctrl+F` | Buscar cosas en el modelo |
| `Ctrl+Shift+F` | Buscar en el workspace |
| `Ctrl+K` | Comandos (paleta) |
| `Ctrl+Z` · `Ctrl+Shift+Z` | Deshacer · rehacer |
| `Delete` | Eliminar selección |

`Nuevo` y `Abrir / importar modelo` **no tienen atajo de teclado**: van por la
paleta `Ctrl+K` o el menú ☰. La hoja completa vive en `Menú principal > Ayuda >
Atajos` — su footer muestra la **versión de opforja** (fecha de build + commit).

## Límites honestos

- **Acceso por cuenta:** el acceso exige login con cuenta válida
  (single-operator hoy; registro cerrado por CLI). Reset de password vía
  `bun run auth:cuenta reset <email>` (ver `docs/deploy/opforja.md`
  § Cuentas y login).
- **Sin colaboración:** no hay edición simultánea, sin sharing remoto, sin
  permisos por usuario. La instancia tiene un solo usuario operativo.
- **Sin SLA:** la instancia es privada y no garantiza disponibilidad.
- **Mobile es solo lectura:** en dispositivos móviles, la app muestra los
  modelos en modo lectura sin affordances de edición.
