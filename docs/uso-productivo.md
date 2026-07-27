# Uso productivo de opforja

Guía del usuario para trabajar con modelos OPM en la instancia
`https://opforja.sanixai.com`.

Para administrar la instancia, consulta el
[runbook de despliegue](deploy/opforja.md). Para mantener el repositorio, consulta
[CLAUDE.md](../CLAUDE.md).

## Qué es

opforja es un **modelador bimodal OPM/ISO 19450**: cada hecho se trabaja como
diagrama OPD y lenguaje OPL. No es un dibujador genérico. Los modelos se guardan en
el backend (Postgres/API) del tenant autenticado; no dependen de `localStorage` ni
de una sesión particular del navegador.

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
dibujar), sigue el flujo del [manual de opforja](manual-opforja.md#2-flujo-de-modelamiento-forja),
que admite **dos
arranques**: **SD-primero** (top-down) y **bottom-up** (crear Bocetos OPD e
integrarlos después, ver §Taller).

## Apuntes — borradores sin rigor

Un **apunte** es un modelo en modo borrador: usa las mismas piezas OPM
(objetos, procesos, estados, enlaces) y el mismo lienzo, pero **no se le
exige cerrar** como modelo válido. Sirve para pensar y bocetar sin que la
validación interrumpa. Relaja el *rigor*, no la *semántica*: sigue siendo
OPM legítimo, no un dibujo libre.

- **Nacer y graduar**: todo modelo **nace Apunte** (comando `Nuevo`) y vive en
  **Taller**. Su cinta ofrece `Revisar para graduar`. El diálogo separa
  integridad, Bocetos, cierre formal OPM y validación humana. La integridad rota
  bloquea; si solo quedan Bocetos o deuda formal, puedes `Seguir en Taller y
  corregir` o `Graduar con pendientes` de manera explícita.
- **Qué cambia**: en un apunte los avisos de **validez** (falta de
  transformee, nombres pobres, firma de enlaces…) bajan de *bloqueo* a
  *observación al margen* — no detienen el trabajo. La **integridad** del
  documento (referencias rotas, enlaces sin extremo) **sigue bloqueando**:
  un apunte roto no es un borrador legítimo, es un documento roto.
- **Graduar conserva identidad**: el documento pasa a **Modelos** con el mismo
  ID, hechos, OPDs, OPL y carpeta; se confirma una versión. `Listo formalmente`
  o `Con pendientes` se calcula desde el diagnóstico actual, no se marca a mano.
- **Reabrir es la inversa**: un Modelo de Trabajo puede usar `Reabrir en Taller`.
  Vuelve como Apunte con el mismo ID y contenido y se confirma una versión
  `Reapertura en Taller`.
- **No se mezcla con Biblioteca**: Biblioteca es un rol de Modelo. Para reabrir
  una Biblioteca, primero hay que quitarle ese rol.

## Taller — documentos exploratorios y Bocetos bottom-up

**Taller** es el espacio global de los documentos Apunte. Dentro de cualquier
documento, la banda local **`Bocetos`** aloja OPDs todavía no integrados al árbol:
fragmentos sin padre que permiten trazar hechos OPM sin comprometer aún un SD.
Créalos con `+ Nuevo boceto OPD`.

Cuando un fragmento encaja, **intégralo**: clic derecho sobre el Boceto →
`Integrar como descomposición` (in-zoom de un proceso) o
`Integrar como despliegue` (unfold de un objeto). Integrar fija el padre y
declara el refinamiento en un gesto —el mismo resultado que el camino top-down—.
El componente pasa a ser un **OPD integrado**.

`Devolver a Bocetos` hace el camino inverso sin pérdida: conserva el ID, hechos,
geometría, pregunta guía y subárbol. No lo confundas con
`Eliminar refinamiento`, que sí destruye el subárbol.

Integrar/devolver y graduar/reabrir son ciclos distintos:

- en un **Apunte**, un Boceto pendiente es observación y la salida declara el
  bosquejo;
- en un **Modelo**, un Boceto bloquea el export canónico hasta integrarlo;
- graduar no integra Bocetos y devolver un OPD no reabre el documento.

La base metodológica está en
[A1.5 del manual de opforja](manual-opforja.md#2-flujo-de-modelamiento-forja).

## Gestionar modelos

Abrir **Trabajo de modelado** desde `Ctrl+K` › `Abrir / importar modelo` (o el
menú ☰). Un buscador filtra el espacio activo. La navegación superior separa:

- **`Taller`**: Apuntes, con sus Bocetos pendientes visibles en el chip.
- **`Modelos`**: Modelos de Trabajo, agrupados en `Listos formalmente` y
  `Con pendientes`.
- **`Bibliotecas`**: Modelos designados como fuente, en un estante global que se
  abre en **solo lectura**. De aquí se traen Piezas al lienzo (ver
  [Patrones y Piezas](manual-opforja.md#9-patrones-de-modelado)).
- **`Archivo`**: lente de todo lo archivado; no expresa madurez.

Las carpetas organizan Taller y Modelos. En el menú `Acciones` de cada fila se
puede abrir en otra pestaña, revisar versiones, reabrir un Modelo en Taller,
marcar/quitar Biblioteca, archivar/restaurar o eliminar con confirmación.
`Importar JSON` permanece en el encabezado.

## Tres operaciones diarias

### Guardar — `Ctrl+S`

Arriba a la izquierda, el estado de almacenamiento aparece en línea y su texto
comunica el estado sin depender solo del color. Según el momento muestra
`Guardado`, `Guardando…` o `Sin guardar ⌃S`; el tooltip entrega el detalle
completo.

El autosalvado persiste cambios de forma periódica. Mientras el estado diga
`Sin guardar`, los cambios más recientes todavía no están respaldados. Pulsa
`Ctrl+S` para guardar antes de un hito o cierre. Al hacer clic en el estado se
abre **Guardar como o nueva versión**; el clic no fuerza por sí mismo el guardado.

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

## Requisitos y cobertura

1. `Ctrl+K` → `Crear requisito`, con o sin una selección.
2. Completa ID lógico, descripción, dureza `hard|soft`, actor y estado.
3. Para reutilizar un objeto existente, selecciónalo y ejecuta
   `Marcar como requisito`.
4. Selecciona una cosa o enlace y ejecuta `Vincular requisito existente`.
5. Sobre el requisito, usa `Vista de requisito` para reunir sus coberturas en una
   vista de solo lectura.

La cobertura expresa qué entidad o enlace realiza una intención. No prueba que una
medición, auditoría o test externo haya pasado. Esa separación pertenece al
[manual para transformar sistemas](manual-sistemas-opm.md#36-requisitos-y-evidencia).

## Ontología organizacional

`Ctrl+K` → `Configurar ontología` permite guardar en el modelo términos canónicos,
sinónimos y un modo de control:

- `Sin control`: conserva los nombres escritos.
- `Sugerir canónico`: conserva el alias; la UI todavía no muestra una sugerencia
  visible de reemplazo.
- `Reforzar canónico`: al crear o renombrar, sustituye un sinónimo por el término
  canónico.

La configuración persiste en el modelo y actúa hacia adelante. No conserva una
traza por entidad ni revierte automáticamente nombres previos al desactivarla.
Es una tabla de vocabulario del dominio; no modifica la ontología formal OPM.

## Simulación

`Ctrl+K` ofrece dos herramientas distintas:

- **Simulación conceptual**: recorre procesos, condiciones, estados y duraciones
  declaradas para leer comportamiento del modelo.
- **Simulación numérica**: toma atributos numéricos marcados como simulables,
  genera entre 1 y 10.000 muestras según sus parámetros y permite descargar CSV.

La simulación numérica **no** ejecuta la dinámica del proceso, no calcula colas,
capacidad o rendimiento y no compara alternativas por sí sola.

## Versiones

`Ctrl+K` → `Versiones del modelo` permite crear una versión manual, consultar el
historial y **restaurar una versión como copia**. La restauración no pisa el modelo
vigente. Las revisiones empujadas por una sesión de agente pueden aparecer
agrupadas como un hito expandible.

En el gestor también puedes mostrar glifos de versiones y abrir el historial desde
el menú contextual de cada modelo.

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

## Exportar y compartir

La paleta `Ctrl+K` ofrece salidas con propósitos distintos:

| Salida | Perfil o función | Uso |
|---|---|---|
| `Exportar JSON al portapapeles` | `intercambio` | respaldo y rehidratación; no certifica conformidad canónica |
| `Exportar OPL del modelo (Markdown)` | auxiliar | lectura textual de todos los OPDs |
| `Exportar documento canónico (Markdown)` | `canon-documento` | portada, métricas, árbol, OPL y procedencia |
| `Exportar diagnóstico (JSON)` | auxiliar | revisión de avisos por otra herramienta |
| `Exportar OPD actual como PNG` | `canon-diagrama` | una imagen del OPD activo |
| `Exportar todos los OPDs como PNG` | `canon-diagrama` | ZIP con una imagen por OPD |

El documento canónico no es una matriz completa de cobertura de requisitos y las
imágenes no contienen inspector, toolbar ni panel OPL. Conserva JSON cuando
necesites reconstruir o auditar el modelo.

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
administrador de la instancia (ver
[runbook de despliegue](deploy/opforja.md)).

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
paleta `Ctrl+K` o el menú ☰. Para el inventario completo, usa
`Ctrl+K` → `Atajos de teclado`; esa vista deriva del registro real de la
aplicación.

## Límites honestos

- **Acceso por cuenta:** el acceso exige una cuenta válida; el alta y reset se
  administran fuera de la UI (ver
  [Cuentas y login](deploy/opforja.md)).
- **Sin coedición:** no hay edición simultánea del mismo modelo ni sharing remoto
  con permisos por modelo.
- **Sin SLA:** la instancia es privada y no garantiza disponibilidad.
- **Mobile es solo lectura:** en dispositivos móviles, la app muestra los
  modelos en modo lectura sin affordances de edición.

La frontera completa `IMPLEMENTADO | PROPUESTO | EXTERNO` vive en el
[manual para transformar sistemas](manual-sistemas-opm.md#9-frontera-de-capacidad-de-opforja).

## Siguiente paso

- Aprende el método en el [manual de opforja](manual-opforja.md).
- Lleva el modelo a una intervención en el
  [manual para transformar sistemas](manual-sistemas-opm.md).
- Vuelve al [índice documental](README.md).
