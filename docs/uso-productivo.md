# Uso Productivo — Modelador OPM

Guía del usuario para trabajar con modelos OPM en la instancia
`https://opforja.sanixai.com`.

Para administración de la instancia: `docs/deploy/opforja.md`.
Para orientación técnica del repo: `../CLAUDE.md`.

## Qué Es

Una herramienta para dibujar modelos OPM/ISO 19450: objetos, procesos,
estados y enlaces. Los modelos se guardan en el backend (Postgres/API)
asociados a una sesión de navegador. No dependen de localStorage.

## Regla De Apariciones En Diagramas

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

## Empezar Un Modelo

Cuando el workspace está vacío, la app abre un modelo en blanco. Crear
la primera cosa con los botones `Objeto` o `Proceso` en la barra
superior, o con los atajos `O` (objeto), `P` (proceso), `S` (estado)
cuando el canvas tiene el foco.

Para modelar con método desde cero (qué función transforma a quién y
por qué antes de dibujar nada), seguir el flujo Forja descrito en
`docs/manual-opforja.md` §2.

## Tres Operaciones Diarias

### Guardar — `Ctrl+S`

Arriba a la izquierda hay un chip de estado que muestra una de estas
tres etiquetas:

- `Sin guardar · Ctrl+S` (fondo ámbar): hay cambios sin persistir.
- `Guardando…` (fondo azul claro): autosalvado en curso.
- `Guardado · HH:mm` (fondo verde): persistido a esa hora.

Mientras el chip diga `Sin guardar`, el trabajo no está respaldado
todavía. Pulsar `Ctrl+S` o hacer click en el chip para guardar.

Los modelos se persisten en el backend (Postgres). Si el backend no
está disponible, la app lo indica explícitamente; no hay fallback
silencioso a localStorage.

### Buscar dentro del modelo — `Ctrl+F`

Abre un diálogo que busca cosas (objetos, procesos, estados) y
etiquetas de enlace por nombre. Click en una fila salta al OPD donde
aparece y la selecciona.

### Comandos rápidos — `Ctrl+K`

Abre el command palette: ejecutar cualquier acción del menú sin tocar
el mouse.

## Respaldo Manual

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

## Exportar Para Compartir

Para entregar el diagrama del OPD activo como imagen raster:

`Cmd/Ctrl+K > Exportar OPD actual como PNG`.

El archivo `.png` resultante contiene solo el contenido del OPD: sin
toolbar, sin inspector, sin OPL. Para documentación de un modelo completo,
usar `Cmd/Ctrl+K > Exportar todos los OPDs como PNG`; descarga un `.zip`
con una imagen por OPD.

## Si Algo Se Rompe

### El chip dice `Sin guardar` y no quiero perder el trabajo

Pulsar `Ctrl+S`. Si pide nombre, es porque el modelo nunca se guardó:
usar `Guardar como` desde el menú.

### Cerré el navegador sin guardar

Al reabrir, la app intenta restaurar el último modelo activo desde el
backend. Si no aparece, abrir `Menú principal > Cargar otro...` y
elegirlo de la lista. Si tampoco está ahí, importar el último JSON
descargado.

### La app no carga o muestra error

Recargar la página con `Ctrl+Shift+R`. Si persiste, contactar al
administrador de la instancia (ver `docs/deploy/opforja.md`).

### Quiero deshacer un cambio reciente

`Ctrl+Z` (deshacer) y `Ctrl+Shift+Z` (rehacer). Funcionan en el canvas
y en operaciones del modelo.

## Atajos Útiles

| Atajo | Acción |
|---|---|
| `Ctrl+S` | Guardar |
| `Ctrl+O` | Cargar otro modelo |
| `Ctrl+N` | Modelo nuevo |
| `Ctrl+F` | Buscar dentro del modelo |
| `Ctrl+Shift+F` | Buscar en todo el workspace |
| `Ctrl+K` | Command palette |
| `Ctrl+Z` | Deshacer |
| `Ctrl+Shift+Z` | Rehacer |
| `Delete` | Eliminar selección |

La hoja completa de atajos vive en `Menú principal > Ayuda > Atajos`.

## Límites Honestos

- **Acceso por cuenta:** el acceso exige login con cuenta válida
  (single-operator hoy; registro cerrado por CLI). Reset de password vía
  `bun run auth:cuenta reset <email>` (ver `docs/deploy/opforja.md`
  § Cuentas y login).
- **Sin colaboración:** no hay edición simultánea, sin sharing remoto, sin
  permisos por usuario. La instancia tiene un solo usuario operativo.
- **Sin SLA:** la instancia es privada y no garantiza disponibilidad.
- **Mobile es solo lectura:** en dispositivos móviles, la app muestra los
  modelos en modo lectura sin affordances de edición.
