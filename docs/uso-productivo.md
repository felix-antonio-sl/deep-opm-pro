# Uso Productivo Single-User

Doc operativa del modelador OPM para el usuario que trabaja con sus
propios modelos en la instancia privada `https://opforja.sanixai.com`.

No es manual técnico ni guía de deploy. Para administración de la
instancia: `docs/deploy/opforja.md`.

## Qué Es

Una herramienta para dibujar modelos OPM/ISO 19450: objetos, procesos
y enlaces. Los modelos quedan guardados en el navegador (este navegador,
esta dirección) y se respaldan exportando JSON.

## Regla De Apariciones En Diagramas

En Opforja, una cosa OPM y su dibujo local no son lo mismo:

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
- Los externos materializados automáticamente por refinamiento pueden
  actualizarse o limpiarse al resincronizar el refinamiento.
- Las cosas contextuales creadas manualmente fuera del contorno no se
  limpian automáticamente: permanecen hasta que el usuario las quite.

Esta regla es deliberada: evita que un refinamiento meta dentro del
contenedor cosas que pertenecen al contexto del diagrama, y evita que el
render invente entidades visibles por el solo hecho de existir en el
modelo.

## Entrar

1. Abrir `https://opforja.sanixai.com` en un navegador moderno.
2. El navegador pide usuario y contraseña: ingresar las credenciales
   personales.
3. Una vez dentro, la app abre el último modelo en uso. Si no hay
   modelos previos, abre la pantalla de bienvenida con opciones para
   empezar.

## Crear El Primer Modelo

Desde la pantalla de bienvenida, tres opciones:

- **Asistente guiado** (recomendado la primera vez): conversación que
  siembra un SD desde función y beneficiario.
- **Empezar vacío**: abre un modelo en blanco. Crear la primera cosa
  con los botones `Objeto` o `Proceso` en la barra superior.
- **Abrir ejemplo**: carga un modelo demo para explorar la
  herramienta antes de modelar uno propio.

## Tres Operaciones Diarias

### Guardar — `Ctrl+S`

Arriba a la izquierda hay un chip de estado que muestra una de estas
tres etiquetas:

- `Sin guardar · Ctrl+S` (fondo ámbar): hay cambios sin persistir.
- `Guardando…` (fondo azul claro): autosalvado en curso.
- `Guardado · HH:mm` (fondo verde): persistido a esa hora.

Mientras el chip diga `Sin guardar`, el trabajo no está respaldado
todavía. Pulsar `Ctrl+S` o hacer click en el chip para guardar.

### Buscar dentro del modelo — `Ctrl+F`

Abre un diálogo que busca cosas (objetos, procesos, estados) y
etiquetas de enlace por nombre. Click en una fila salta al OPD donde
aparece y la selecciona.

### Comandos rápidos — `Ctrl+K`

Abre el command palette: ejecutar cualquier acción del menú sin tocar
el mouse.

## Respaldo Manual

**Es la operación más importante.** El respaldo operativo vive en el
backend/Postgres; el respaldo portable para llevar fuera de la instancia es el
JSON descargado.

### Cuándo descargar JSON

- Al terminar una sesión de trabajo.
- Antes de cambios estructurales grandes.
- Antes de cambiar de entorno, dominio, navegador o equipo.
- Antes de depender del modelo para algo real.

### Cómo descargar

1. Guardar el modelo localmente con `Ctrl+S`.
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
6. Pulsar `Ctrl+S` o `Menú principal > Guardar como` para volver a
   persistirlo en el workspace local.

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

Al reabrir, la app intenta restaurar el último modelo activo. Si no
aparece, abrir `Menú principal > Cargar otro...` y elegirlo de la
lista. Si tampoco está ahí, importar el último JSON descargado.

### El navegador borró mis datos

Importar el último JSON descargado: `Menú principal >
Importar/Exportar JSON... > elegir archivo > Importar > Guardar como`.

### Quiero deshacer un cambio reciente

`Ctrl+Z` (deshacer) y `Ctrl+Shift+Z` (rehacer). Funcionan en el canvas
y en operaciones del modelo.

### La app no carga o muestra error

Recargar la página con `Ctrl+Shift+R`. Si persiste, contactar al
administrador de la instancia (ver `docs/deploy/opforja.md`).

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

- Solo este navegador en esta dirección. Los modelos no migran
  automáticamente a otro navegador, otra computadora ni a `localhost`.
  Para llevarlos: descargar JSON antes y reimportar.
- Sin colaboración: no hay edición simultánea, sin sharing remoto, sin
  permisos por usuario. La instancia tiene un solo usuario operativo.
- Sin sincronización en la nube: si el navegador pierde los datos, se
  pierden a menos que exista un JSON descargado.
- Sin SLA: la instancia es privada y no garantiza disponibilidad.
