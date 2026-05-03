---
epica: "EPICA-71"
titulo: "Interoperabilidad — importar CSV de atributos, instancias y valores sobre objeto-clase"
doc_fuente: "opcloud-reverse/71-interop-csv.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "S"
hu_emitidas: 26
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "Diagnostico piloto EPICA-10 aplicado a EPICA-71"
---

## Resumen

Esta epica cubre la ingesta masiva de estructura OPM desde archivos CSV. Su nucleo observado en OPCloud es un flujo muy especifico: un objeto-clase ya existente recibe una matriz `atributos × instancias × valores` en una sola pasada, generando N instancias clasificadas, M atributos de la clase y `N × M` atributos de instancia con su estado-valor. El dialogo tiene tres parametros clave (`Ignore CSV content for existing instances' values`, `Create non-computational instance attributes`, `Enable Auto Format`) y se invoca como extension del objeto desde el **entities extension group** de la barra contextual.

El alcance granulado de HU **extiende** este nucleo hacia un importador CSV general que el modelador OPM del repo necesita como producto (entrada desde menu principal, selector de archivo, vista previa tabular, mapeo de columnas, delimitador/codificacion, simulacion, validacion, fusionar vs reemplazar, CSV de enlaces, reporte final, autodiagramacion tras importacion). Las HU que van mas alla del flujo OPCloud observado se marcan con `requires-clarification` o con clase de afirmacion `inferido`/`hipotesis` y se entienden como propuesta propia del producto informada por el patron general de importadores tabulares, no como calca de OPCloud.

Principios rectores de esta epica:

1. **Respetar la clasificacion-instanciacion**: si el archivo describe instancias de una clase existente, el import debe emitir enlaces de classification-instantiation (triangulos vacios, consistentes con la convencion observada en el doc fuente) y no degenerar en exhibiciones sueltas.
2. **No corromper el nucleo**: el import debe fallar limpio ante filas invalidas sin dejar el modelo en estado intermedio. Transaccion todo-o-nada como default; parcial como opcion explicita.
3. **Previsualizar antes de escribir**: nunca mutar el modelo antes de la simulacion opcional; la simulacion es la afordance que convierte el importador en herramienta segura para modelos grandes.
4. **Preservar trazabilidad**: cada entidad creada por import queda marcada (p.ej. `source: csv`, `import_id: <uuid>`) para permitir reporte final y eventual deshacer.

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-71.001 | Abrir importador CSV desde el menu principal | ME | S | S | opcloud-ui | — |
| HU-71.002 | Invocar import CSV desde entities extension group sobre objeto-clase | ME | M1 | M | opcloud-ui | — |
| HU-71.003 | Seleccionar archivo CSV desde selector de archivos del SO | ME | S | XS | opcloud-ui | — |
| HU-71.004 | Mostrar metadatos del archivo (nombre y tamano) tras carga | ME | S | XS | opcloud-ui | — |
| HU-71.005 | Ver vista previa tabular del CSV antes de importar | ME | S | M | opcloud-ui | — |
| HU-71.006 | Configurar delimitador (coma, punto-y-coma, tab) | ME | S | S | mixto | — |
| HU-71.007 | Configurar codificacion del archivo (UTF-8, UTF-8 BOM, Latin-1) | ME | S | S | mixto | — |
| HU-71.008 | Declarar presencia de fila de encabezado | ME | S | XS | opcloud-ui | — |
| HU-71.009 | Mapear columnas a campos OPM (name, type, affiliation, essence, parent) | AD | S | L | opcloud-ui | [V-1] [Glos 3.39] [Glos 3.58] |
| HU-71.010 | Validar vista previa contra gramatica OPM antes de importar | ME | M1 | M | mixto | [V-239] [V-240] |
| HU-71.011 | Reportar errores de validacion en linea en la tabla de vista previa | ME | M1 | M | opcloud-ui | — |
| HU-71.012 | Ejecutar simulacion y mostrar resumen sin mutar modelo | ME | S | M | opcloud-ui | — |
| HU-71.013 | Importar matriz atributos×instancias×valores sobre objeto-clase | ME | M1 | L | mixto | [V-61] [V-1] [OPL-ES] |
| HU-71.014 | Crear atributos como computational con un solo estado (default) | IS | M1 | S | opcloud-ui | [Glos 3.26] |
| HU-71.015 | Crear atributos como non-computational (casilla) | ME | S | S | opcloud-ui | — |
| HU-71.016 | Respetar valores existentes con `Ignore CSV content for existing instances' values` | ME | M1 | M | opcloud-ui | — |
| HU-71.017 | Aplicar Auto Format sobre nombres del CSV | ME | M1 | XS | opcloud-ui | — |
| HU-71.018 | Crear masivamente things desde CSV plano (sin clase raiz) | AD | S | L | opcloud-ui | [V-1] |
| HU-71.019 | Crear masivamente enlaces desde CSV de enlaces | AD | S | L | opcloud-ui | [V-61] [V-239] |
| HU-71.020 | Elegir modo fusionar vs reemplazar al importar sobre modelo con contenido | ME | S | M | opcloud-ui | — |
| HU-71.021 | Bloquear import sobre objeto que es a su vez una instancia | ME | M1 | S | opcloud-ui | [V-61] |
| HU-71.022 | Aplicar stereotypes de organizacion a things importadas | AD | C | M | opcloud-ui | — |
| HU-71.023 | Integrar import con la ontologia de la organizacion (tipos permitidos) | AO | C | M | opcloud-ui | — |
| HU-71.024 | Autodiagramacion automatica tras importacion | ME | M1 | S | opcloud-ui | [V-124] [V-1] |
| HU-71.025 | Reporte final con N creadas, M ignoradas y K errores | ME | M1 | S | opcloud-ui | — |
| HU-71.026 | Deshacer import completo con un solo deshacer | ME | S | M | opcloud-ui | — |

Total: **26 historias de usuario** (20 opcloud-ui, 4 mixto, 2 con referencia SSOT).

## Historias de usuario

### HU-71.001 — Abrir importador CSV desde el menu principal

**Actor primario:** ME (modelador experto).
**Actores secundarios:** AD (autor de dominio — ingesta de vocabularios).
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; X (integracion externa).
**Superficie UI:** menu-principal + modal-import-csv.
**Gesto canonico:** clic en `Archivo → Importar → CSV…` (o equivalente).
**Fuente:** OPCloud: extension propuesta sobre el corpus; no observado en `opcloud-reverse/71-interop-csv.md`.

**Historia:**
> Como modelador experto, quiero abrir el importador CSV desde el menu principal para comenzar una ingesta tabular sin tener que seleccionar antes un objeto en el canvas.

**Contexto de negocio:**
La invocacion observada en OPCloud cuelga del entities extension group sobre un objeto seleccionado (HU-71.002), lo que obliga a crear primero la clase. Un modelador que parte de un CSV sin modelo previo necesita una segunda puerta de entrada desde el menu principal. Esta HU propone esa puerta como extension natural del producto; no es calca de OPCloud.

**Criterios de aceptacion:**
- **Dado** que estoy en un OPD (vacio o con contenido), **cuando** abro `Archivo → Importar → CSV…`, **entonces** se abre el modal del importador en modo "sin objeto contextual".
- **Dado** que abri el importador sin objeto contextual, **cuando** miro el modal, **entonces** aparece un selector adicional para indicar el modo de import (HU-71.013 clase+instancias, HU-71.018 things planos, HU-71.019 enlaces).
- **Dado** que cierro el modal sin importar, **cuando** vuelvo al canvas, **entonces** el modelo queda intacto.

**Reglas y restricciones:**
- El import desde menu principal es **superconjunto** del import desde entities extension group (HU-71.002).
- El modal diferencia visualmente si hay objeto contextual (marco halo detras) o no.

**Modelo de datos tocado:**
- Ninguno directo hasta que se confirme la importacion.

**Dependencias:**
- Bloquea a: HU-71.018, HU-71.019 (requieren puerta sin objeto contextual).

**Integraciones:**
- Menu principal (superficie nueva respecto a OPCloud observado).

**Notas de evidencia:**
- Fuente OPCloud: extension propuesta sobre el corpus. No observado directamente en `opcloud-reverse/71-interop-csv.md`.
- Clase de afirmacion: inferido (buena practica de importador tabular).
- Etiqueta: `requires-clarification` respecto a la ubicacion exacta del menu.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [interop, import-csv, menu, ui, requires-clarification].

---

### HU-71.002 — Invocar import CSV desde entities extension group sobre objeto-clase

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; X secundaria.
**Superficie UI:** barra-contextual + entities-extension-group + modal `Attributes and instances upload`.
**Gesto canonico:** seleccionar objeto-clase → clic en `Add attribute instances and values from CSV` dentro del entities extension group.
**Fuente:** OPCloud: `opcloud-reverse/71-interop-csv.md` §3.2, §7.1.

**Historia:**
> Como modelador experto, quiero invocar el import CSV como extension del objeto-clase seleccionado para aprovechar el contexto y evitar volver a nombrar la clase dentro del dialogo.

**Contexto de negocio:**
OPCloud modela el import CSV no como primitiva del canvas sino como **extension del objeto** (mismo mecanismo que URL Links). Esto preserva el principio de "las cosas OPM son primitivas; las capacidades son extensiones colgadas de ellas". El gesto canonico del doc fuente.

**Criterios de aceptacion:**
- **Dado** que tengo seleccionado un objeto-clase legal (HU-71.021 valida la precondicion), **cuando** abro la barra contextual, **entonces** dentro del `entities extension group` aparece la opcion `Add attribute instances and values from CSV`.
- **Dado** que hago clic en esa opcion, **cuando** se ejecuta, **entonces** se abre el modal `Attributes and instances upload` con el halo del objeto visible detras.
- **Dado** que el objeto seleccionado no cumple la precondicion (HU-71.021), **cuando** intento invocar, **entonces** la accion esta deshabilitada o rechaza la invocacion con aviso.

**Reglas y restricciones:**
- El entities extension group es el mismo contenedor que aloja otras extensiones (URL Links, etc.) — ver EPICA-A0 (stereotypes) para el mecanismo.
- El modal queda **anclado visualmente** al objeto seleccionado para preservar contexto.

**Modelo de datos tocado:**
- Ninguno hasta que se confirme la importacion.

**Dependencias:**
- Bloqueada por: HU-71.021 (precondicion).
- Bloquea a: HU-71.003, HU-71.013.

**Integraciones:**
- Barra contextual (EPICA-17 atributos-instancias).
- EPICA-A0 (stereotypes) como duena del contenedor "extensions".

**Notas de evidencia:**
- Fuente OPCloud: `opcloud-reverse/71-interop-csv.md` §3.2 pasos 3-5, §7.1.
- Frames: frame_00003, frame_00005, frame_00007.
- Transcripcion: "we go to the entities extension group".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** M.
**Etiquetas:** [interop, import-csv, barra-contextual, entities-extension].

---

### HU-71.003 — Seleccionar archivo CSV desde selector de archivos del SO

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** modal-import-csv (zona carga con clip 📎).
**Gesto canonico:** clic en clip 📎 → seleccion en selector de archivos del SO.
**Fuente:** OPCloud: `opcloud-reverse/71-interop-csv.md` §3.3, §5.1.

**Historia:**
> Como modelador, quiero elegir el archivo CSV desde el selector estandar del sistema operativo para usar la afordance que ya conozco.

**Contexto de negocio:**
El clip 📎 en el modal es la unica afordance de carga observada. Abre el selector de archivos nativo del SO (no una UI personalizada). Esto aprovecha el conocimiento previo del usuario y respeta convenciones de la plataforma.

**Criterios de aceptacion:**
- **Dado** que el modal de import esta abierto, **cuando** hago clic en el clip 📎, **entonces** se abre el selector de archivos del SO con filtro `*.csv`.
- **Dado** que selecciono un archivo en el selector de archivos, **cuando** confirmo, **entonces** el modal recibe el archivo y pasa al estado "con archivo cargado" (HU-71.004).
- **Dado** que cancelo el selector de archivos, **cuando** vuelvo al modal, **entonces** el estado del modal es identico al previo (sin archivo cargado).
- **Dado** que selecciono un archivo con extension `.tsv` o `.txt`, **cuando** intento cargar, **entonces** el modal acepta el archivo y delega la deteccion de delimitador a HU-71.006.

**Reglas y restricciones:**
- Filtro por defecto: `*.csv`. El usuario puede cambiar a `Todos los archivos` para seleccionar otras extensiones.
- Un solo archivo por import; seleccion multiple no soportada.

**Modelo de datos tocado:**
- `importSession.file` — transitorio en memoria hasta confirmacion.

**Dependencias:**
- Bloqueada por: HU-71.001 o HU-71.002.
- Bloquea a: HU-71.004, HU-71.005.

**Integraciones:**
- Selector de archivos del SO (API del navegador).

**Notas de evidencia:**
- Fuente OPCloud: §3.3 paso 1, §5.1 tabla (clip 📎 `Upload attributes and instances CSV file`).
- Frames: frame_00005 (clip visible), frame_00011 (estado tras carga).
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [interop, import-csv, ui, selector-archivos].

---

### HU-71.004 — Mostrar metadatos del archivo (nombre y tamano) tras carga

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** modal-import-csv (bloque metadatos).
**Gesto canonico:** ninguno (renderizado automatico tras seleccion).
**Fuente:** OPCloud: `opcloud-reverse/71-interop-csv.md` §3.3, §5.1.

**Historia:**
> Como modelador, quiero ver el nombre y el tamano del archivo cargado para confirmar que seleccione el correcto antes de importar.

**Contexto de negocio:**
Confirmar visualmente el archivo cargado previene errores triviales (cargar el CSV equivocado). OPCloud muestra dos lineas literales bajo el clip: `File Name: importAttTest.csv` y `File Size: 0.186 KB`.

**Criterios de aceptacion:**
- **Dado** que cargue un archivo via selector de archivos, **cuando** termina la carga, **entonces** el modal muestra `File Name: <nombre>.csv` y `File Size: <tamano con unidad>`.
- **Dado** que el archivo tiene tamano <1 KB, **cuando** se muestra, **entonces** el tamano aparece en `KB` con 3 decimales (p.ej. `0.186 KB`).
- **Dado** que el archivo tiene tamano >1 MB, **cuando** se muestra, **entonces** el tamano aparece en `MB` redondeado a 2 decimales.
- **Dado** que remplazo el archivo por otro, **cuando** se carga el nuevo, **entonces** los metadatos se actualizan.

**Reglas y restricciones:**
- Unidad automatica (`KB` si <1 MB, `MB` si >=1 MB).
- No se muestra la ruta completa, solo el nombre.

**Modelo de datos tocado:**
- `importSession.fileName` — transitorio.
- `importSession.fileSize` — numero en bytes.

**Dependencias:**
- Bloqueada por: HU-71.003.

**Notas de evidencia:**
- Fuente OPCloud: §3.3 paso 3, §5.1 tabla.
- Frames: frame_00011 (`File Name: importAttTest.csv`, `File Size: 0.186 KB`).
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [interop, import-csv, ui, metadatos].

---

### HU-71.005 — Ver vista previa tabular del CSV antes de importar

**Actor primario:** ME.
**Actores secundarios:** AD.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; V (renderizado de tabla).
**Superficie UI:** modal-import-csv (panel vista previa).
**Gesto canonico:** ninguno (renderizado automatico tras analisis sintactico).
**Fuente:** OPCloud: propuesta propia; no observado (OPCloud remite a Excel).

**Historia:**
> Como modelador, quiero ver las primeras filas del CSV renderizadas como tabla para confirmar que el analizador sintactico interpreto delimitador/codificacion/encabezado correctamente antes de ejecutar la importacion.

**Contexto de negocio:**
El doc fuente no muestra vista previa tabular dentro del modal OPCloud; OPCloud remite a abrir el CSV en Excel (frame_00020). Un importador serio necesita **vista previa integrada** porque el costo de corregir tras un import malo es alto. Esta HU extiende el producto mas alla de OPCloud, manteniendo el principio "previsualizar antes de escribir".

**Criterios de aceptacion:**
- **Dado** que cargue un CSV valido, **cuando** se termina el analisis sintactico, **entonces** el modal muestra una tabla con hasta 20 filas de vista previa.
- **Dado** que el CSV tiene mas de 20 filas, **cuando** miro la vista previa, **entonces** aparece indicador `... <N> filas mas`.
- **Dado** que cambio delimitador/codificacion/encabezado (HU-71.006–008), **cuando** confirmo el cambio, **entonces** la tabla se re-renderiza con el nuevo analisis sintactico.
- **Dado** que el analisis sintactico falla (archivo corrupto, codificacion invalida), **cuando** intento vista previa, **entonces** aparece mensaje de error en el panel vista previa sin cerrar el modal.

**Reglas y restricciones:**
- Vista previa maximo: 20 filas × 20 columnas (para no bloquear modelador con CSVs enormes).
- Tabla con desplazamiento horizontal y vertical.
- Celdas con errores de validacion se destacan (HU-71.011).

**Modelo de datos tocado:**
- `importSession.parsed` — matriz 2D transitoria.

**Dependencias:**
- Bloqueada por: HU-71.003.
- Bloquea a: HU-71.009, HU-71.010, HU-71.011.

**Integraciones:**
- Analizador sintactico CSV (libreria interna o papaparse).

**Notas de evidencia:**
- Fuente OPCloud: propuesta propia. No observado en OPCloud (OPCloud remite a Excel).
- Clase de afirmacion: inferido.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [interop, import-csv, vista-previa, ui, inferido].

---

### HU-71.006 — Configurar delimitador (coma, punto-y-coma, tab)

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** U.
**Superficie UI:** modal-import-csv (selector delimitador).
**Gesto canonico:** seleccion en selector desplegable.
**Fuente:** OPCloud: `opcloud-reverse/71-interop-csv.md` §11.3.

**Historia:**
> Como modelador, quiero elegir el delimitador del CSV entre coma, punto-y-coma y tab para procesar archivos generados por distintas localidades y herramientas.

**Contexto de negocio:**
La pregunta abierta §11.3 del doc fuente lista delimitador como parametro no resuelto. En Chile y muchas localidades europeas el separador decimal es coma y el de campo es `;`. El tab es comun en exports de bases de datos. Exponer el selector es esencial para interoperabilidad real.

**Criterios de aceptacion:**
- **Dado** que el modal esta abierto, **cuando** miro las opciones, **entonces** veo un selector con `,` (coma, default), `;` (punto-y-coma), `\t` (tab) y `auto` (deteccion).
- **Dado** que elijo `auto`, **cuando** se analiza sintacticamente, **entonces** el analizador detecta el delimitador mas frecuente en la primera fila no vacia.
- **Dado** que cambio el delimitador despues de cargar el archivo, **cuando** confirmo el cambio, **entonces** la vista previa (HU-71.005) se re-renderiza.
- **Dado** que el archivo tiene delimitadores inconsistentes, **cuando** se analiza sintacticamente, **entonces** se reporta error en el panel vista previa (HU-71.011).

**Reglas y restricciones:**
- Delimitador por defecto: `,`.
- Opcion `auto` es heuristica, no garantizada.
- Cambiar delimitador re-dispara el analisis sintactico completo, no solo re-renderiza.

**Modelo de datos tocado:**
- `importSession.delimiter` — enum.

**Dependencias:**
- Bloqueada por: HU-71.003.

**Notas de evidencia:**
- Fuente OPCloud: §11.3 pregunta abierta.
- Clase de afirmacion: inferido (derivado de pregunta abierta).

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [interop, import-csv, analizador, delimitador, requires-clarification].

---

### HU-71.007 — Configurar codificacion del archivo (UTF-8, UTF-8 BOM, Latin-1)

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** U.
**Superficie UI:** modal-import-csv (selector codificacion).
**Gesto canonico:** seleccion en selector desplegable.
**Fuente:** OPCloud: `opcloud-reverse/71-interop-csv.md` §11.3.

**Historia:**
> Como modelador, quiero elegir codificacion del CSV para importar archivos generados por herramientas Windows (UTF-8 BOM), macOS/Linux (UTF-8 plano) o sistemas legacy (Latin-1).

**Contexto de negocio:**
La pregunta abierta §11.3 menciona tolerancia a BOM y UTF-16 como indefinida. Exports desde Excel en Windows producen `utf-8-sig` (con BOM). Caracteres espanoles (`a`, `n`, `u`) se corrompen si la codificacion esta mal.

**Criterios de aceptacion:**
- **Dado** que el modal esta abierto, **cuando** miro las opciones, **entonces** veo un selector con `UTF-8` (default), `UTF-8 BOM`, `Latin-1` (ISO-8859-1), `UTF-16`.
- **Dado** que el archivo tiene BOM y elijo `UTF-8`, **cuando** se analiza sintacticamente, **entonces** el BOM se ignora automaticamente o se reporta como aviso.
- **Dado** que elijo codificacion equivocada y la vista previa muestra mojibake, **cuando** cambio la codificacion, **entonces** la vista previa se re-renderiza con la nueva decodificacion.

**Reglas y restricciones:**
- Default: `UTF-8` (detecta BOM si esta presente).
- `UTF-16` raro pero relevante para exports de Mac.

**Modelo de datos tocado:**
- `importSession.encoding` — enum.

**Dependencias:**
- Bloqueada por: HU-71.003.

**Notas de evidencia:**
- Fuente OPCloud: §11.3 pregunta abierta ("tolerancia a BOM/UTF-16").
- Clase de afirmacion: inferido.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [interop, import-csv, analizador, codificacion, requires-clarification].

---

### HU-71.008 — Declarar presencia de fila de encabezado

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** modal-import-csv (casilla `Primera fila es encabezado`).
**Gesto canonico:** marcar/desmarcar casilla.
**Fuente:** OPCloud: inferido; no observado explicitamente.

**Historia:**
> Como modelador, quiero declarar si la primera fila del CSV contiene nombres de columna para que el analizador sintactico la trate como esquema y no como dato.

**Contexto de negocio:**
En el flow observado (attributes×instances), la primera fila SI es semantica (nombres de instancias) pero OPCloud no la trata como "encabezado CSV generico" sino como posicional. Para modos genericos de import (HU-71.018, HU-71.019) esta distincion importa: si hay encabezado, las columnas se mapean por nombre (HU-71.009); si no, por indice.

**Criterios de aceptacion:**
- **Dado** que abro el modal en modo general (no flow OPCloud), **cuando** miro las opciones, **entonces** hay casilla `Primera fila es encabezado` marcada por defecto.
- **Dado** que `Primera fila es encabezado` esta marcado, **cuando** se analiza sintacticamente, **entonces** la fila 1 se usa como encabezado y las filas 2..N como datos.
- **Dado** que desmarco `Primera fila es encabezado`, **cuando** se re-analiza, **entonces** todas las filas se tratan como datos y las columnas se nombran `col1`, `col2`, ...
- **Dado** que estoy en el flow OPCloud (attributes×instances — HU-71.013), **cuando** miro el modal, **entonces** la casilla no aparece (el contrato es posicional fijo).

**Reglas y restricciones:**
- Default: marcado, excepto en modos posicionales.
- El mapeo de columnas (HU-71.009) depende de esta decision.

**Modelo de datos tocado:**
- `importSession.hasHeader` — boolean.

**Dependencias:**
- Bloqueada por: HU-71.003.
- Bloquea a: HU-71.009.

**Notas de evidencia:**
- Fuente OPCloud: inferido a partir de practica comun en importadores tabulares; no observado explicitamente.
- Clase de afirmacion: inferido.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [interop, import-csv, analizador, encabezado, inferido].

---

### HU-71.009 — Mapear columnas a campos OPM (name, type, affiliation, essence, parent)

**Actor primario:** AD (autor de dominio).
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; K secundario (define como se arman las entidades).
**Superficie UI:** modal-import-csv (panel mapeo).
**Gesto canonico:** selector desplegable por cada columna del CSV → elegir campo OPM.
**Fuente:** OPCloud: propuesta propia. OPCloud usa contrato posicional fijo, no mapeo configurable.

**Historia:**
> Como autor de dominio, quiero mapear cada columna del CSV a un campo OPM (name, type, affiliation, essence, parent) para traducir mi hoja de calculo a estructura OPM valida aunque el CSV no siga el contrato OPCloud.

**Contexto de negocio:**
El flow OPCloud observado tiene **contrato fijo** (fila=atributo, columna=instancia). Para el modo general (HU-71.018, HU-71.019) el CSV puede venir con cualquier esquema; el modelador declara el mapeo caso a caso. Es la HU mas pesada de esta epica: define como un CSV arbitrario se traduce a OPM.

**Criterios de aceptacion:**
- **Dado** que cargue un CSV con encabezado en modo general, **cuando** miro el panel mapeo, **entonces** veo una fila por columna del CSV con un selector desplegable que permite mapear a: `(ignorar)`, `name`, `type`, `affiliation`, `essence`, `parent`, `description`, `stereotype`.
- **Dado** que mapeo una columna a `type`, **cuando** se valida, **entonces** los valores validos son `process`, `object`, `state` (ver HU-71.010).
- **Dado** que mapeo una columna a `parent`, **cuando** se valida, **entonces** los valores deben referenciar nombres de things ya existentes o en el mismo CSV (HU-71.010).
- **Dado** que no mapeo la columna `name`, **cuando** intento validar, **entonces** aparece error: "`name` es obligatorio para crear things".
- **Dado** que complete el mapeo, **cuando** continuo, **entonces** la vista previa (HU-71.005) muestra una columna sintetica "→ OPM" con interpretacion de cada fila.

**Reglas y restricciones:**
- Campos mapeables: `name` (obligatorio), `type`, `affiliation`, `essence`, `parent`, `description`, `stereotype`.
- Para modo enlaces (HU-71.019): `source`, `target`, `link_type`, `subtype`, `modifier`.
- Una columna no puede mapearse a dos campos.
- `name` es obligatorio; el resto tiene default.
- SSOT OPM [V-1] define los atributos minimos de cosa; [Glos 3.39] y [Glos 3.58] definen los tipos canonicos.

**Modelo de datos tocado:**
- `importSession.columnMapping` — dict `columnIndex → opmField`.

**Dependencias:**
- Bloqueada por: HU-71.005, HU-71.008.
- Bloquea a: HU-71.010, HU-71.018, HU-71.019.

**Integraciones:**
- Nucleo (`src/nucleo/tipos.ts`) para la lista de campos validos.

**Notas de evidencia:**
- Fuente OPCloud: propuesta propia. OPCloud usa contrato posicional fijo, no mapeo configurable.
- Clase de afirmacion: inferido.

**Prioridad:** S.
**Tamano:** L.
**Etiquetas:** [interop, import-csv, mapeo, ui, nucleo].

---

### HU-71.010 — Validar vista previa contra gramatica OPM antes de importar

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** K primario (validador del nucleo).
**Superficie UI:** modal-import-csv (panel vista previa + indicadores validacion).
**Gesto canonico:** ninguno (validacion automatica tras mapeo).
**Fuente:** OPCloud: propuesta propia basada en §11.5, §11.6 del doc fuente.

**Historia:**
> Como modelador, quiero que el importador valide cada fila contra la gramatica OPM antes de permitirme confirmar para no insertar entidades ilegales al modelo.

**Contexto de negocio:**
El nucleo tiene validador estricto (`src/nucleo/validacion/`). Dejarlo intervenir **antes** de la confirmacion en lugar de despues es la diferencia entre un import seguro y un import que corrompe el modelo. La SSOT OPM [V-239] y [V-240] define las familias canonicas de enlace y sus firmas, que el validador debe respetar. Valida: tipos OPM permitidos, unicidad de nombres, referencias a parents existentes, compatibilidad esencia/tipo (objeto informatico no puede ser Agent, etc.).

**Criterios de aceptacion:**
- **Dado** que complete el mapeo (HU-71.009), **cuando** se ejecuta la validacion, **entonces** cada fila recibe estado `ok`, `aviso` o `error`.
- **Dado** que una fila tiene `type=proces` (typo), **cuando** se valida, **entonces** la celda `type` se marca con error: "`proces` no es un tipo OPM valido. Permitidos: process, object, state".
- **Dado** que dos filas tienen el mismo `name`, **cuando** se valida, **entonces** la segunda se marca con aviso: "Nombre duplicado — colisionara con regla de unicidad (HU-1C.012)".
- **Dado** que una fila referencia `parent=ClasePadre` inexistente, **cuando** se valida, **entonces** se marca con error: "`ClasePadre` no existe ni en el modelo ni en el CSV".
- **Dado** que hay errores, **cuando** intento hacer clic en `IMPORT`, **entonces** el boton esta deshabilitado o muestra sugerencia "Resolver errores antes de importar".

**Reglas y restricciones:**
- Validacion es delegada al nucleo — no se re-implementa en el importador.
- Avisos no bloquean import; errores si.
- Validacion corre sobre la **totalidad** del CSV, no solo la vista previa.
- SSOT [V-239]: cinco familias canonicas de enlace; [V-240]: firma Proceso→Proceso para invocacion.

**Modelo de datos tocado:**
- `importSession.validationReport` — lista de `{rowIndex, column, severity, message}`.

**Dependencias:**
- Bloqueada por: HU-71.009.
- Bloquea a: HU-71.011, HU-71.012, HU-71.013.

**Integraciones:**
- `src/nucleo/validacion/` (14 passes).

**Notas de evidencia:**
- Fuente OPCloud: propuesta propia basada en §11.5 (celdas vacias), §11.6 (colision de nombres) del doc fuente.
- Clase de afirmacion: inferido.

**Prioridad:** M1.
**Tamano:** M.
**Etiquetas:** [interop, import-csv, validacion, gramatica-opm, nucleo].

---

### HU-71.011 — Reportar errores de validacion en linea en la tabla de vista previa

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; V (estilos de celda).
**Superficie UI:** modal-import-csv (tabla vista previa con destacados).
**Gesto canonico:** posarse sobre celda en error → sugerencia con detalle.
**Fuente:** OPCloud: propuesta propia.

**Historia:**
> Como modelador, quiero ver los errores y avisos pintados directamente sobre las celdas de la vista previa para corregir el CSV sin salir de la UI del importador.

**Contexto de negocio:**
Reportar errores como texto plano abajo exige al usuario recorrer filas buscandolos. Pintar la celda problematica es retroalimentacion inmediata. Convencion: borde rojo + sugerencia para error, borde amarillo + sugerencia para aviso.

**Criterios de aceptacion:**
- **Dado** que la validacion (HU-71.010) detecto errores, **cuando** miro la vista previa, **entonces** cada celda con error tiene borde rojo y cada celda con aviso tiene borde amarillo.
- **Dado** que me poso sobre celda en error, **cuando** esperar ~500ms, **entonces** aparece sugerencia con el mensaje de error.
- **Dado** que hago clic en celda en error, **cuando** se abre un panel de detalle, **entonces** veo el mensaje completo y una sugerencia de correccion cuando hay.
- **Dado** que corrijo el CSV fuera y re-cargo el archivo, **cuando** se re-valida, **entonces** los indicadores se actualizan.

**Reglas y restricciones:**
- Borde rojo: error (bloqueante).
- Borde amarillo: aviso (no bloqueante).
- Sugerencia al posarse, panel al hacer clic.
- Los errores se cuentan en indicador resumen arriba de la vista previa.

**Modelo de datos tocado:**
- Ninguno persistente — solo UI.

**Dependencias:**
- Bloqueada por: HU-71.010.

**Integraciones:**
- Tabla de vista previa.

**Notas de evidencia:**
- Fuente OPCloud: propuesta propia.
- Clase de afirmacion: inferido.

**Prioridad:** M1.
**Tamano:** M.
**Etiquetas:** [interop, import-csv, validacion, ui, reporte-errores].

---

### HU-71.012 — Ejecutar simulacion y mostrar resumen sin mutar modelo

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; X secundario.
**Superficie UI:** modal-import-csv (boton `Simular` + panel resumen).
**Gesto canonico:** clic en `Simular`.
**Fuente:** OPCloud: propuesta propia.

**Historia:**
> Como modelador, quiero ejecutar una simulacion que me muestre cuantas things y enlaces se crearian y que validaciones fallan sin mutar el modelo, para auditar la importacion antes de comprometerme.

**Contexto de negocio:**
La simulacion es la afordance mas valiosa para modelos grandes. Permite iterar analisis sintactico + mapeo + validacion hasta que el resumen sea lo esperado, y recien entonces ejecutar la importacion real. OPCloud no lo tiene; es propuesta propia del producto.

**Criterios de aceptacion:**
- **Dado** que hay CSV cargado, mapeo completo y validacion verde (o con avisos), **cuando** hago clic en `Simular`, **entonces** se ejecuta la simulacion de la importacion sin tocar el modelo.
- **Dado** que la simulacion termino, **cuando** miro el resumen, **entonces** veo: `N things se crearian (T1: N1, T2: N2, ...)`, `L enlaces se crearian`, `K filas se ignorarian`, `E errores se reportarian`.
- **Dado** que el resumen me parece correcto, **cuando** hago clic en `IMPORT`, **entonces** se ejecuta la importacion real con los mismos parametros.
- **Dado** que el resumen muestra algo inesperado, **cuando** cambio mapeo/delimitador/codificacion, **entonces** puedo re-correr la simulacion.

**Reglas y restricciones:**
- Simulacion es **idempotente** — no crea entidades, no dispara eventos del modelo.
- Simulacion es **reversible** (solo porque no hizo nada) — trivialmente.
- El resumen se cachea hasta que cambie cualquier parametro.

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-71.010.
- Bloquea a: HU-71.013, HU-71.018, HU-71.019.

**Notas de evidencia:**
- Fuente OPCloud: propuesta propia.
- Clase de afirmacion: inferido.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [interop, import-csv, simulacion, validacion].

---

### HU-71.013 — Importar matriz atributos×instancias×valores sobre objeto-clase

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** K primario; V, L secundarias.
**Superficie UI:** modal `Attributes and instances upload` + canvas tras importacion.
**Gesto canonico:** clic en `IMPORT` tras carga y parametrizacion.
**Fuente:** OPCloud: `opcloud-reverse/71-interop-csv.md` §3.4, §6.

**Historia:**
> Como modelador, quiero que el clic en `IMPORT` genere sobre el objeto-clase seleccionado: N instancias clasificadas + M atributos de clase + `N × M` atributos de instancia con su estado-valor desde la matriz del CSV, en una sola pasada.

**Contexto de negocio:**
Este es el **nucleo del flujo OPCloud observado**. Permite instanciar masivamente estructuras parametricas (1 clase, N instancias, M atributos, valor por celda) sin crear cada entidad a mano. Es el caso de uso primario para modelos de simulacion, variantes de diseno y pruebas parametricas. La SSOT OPM [V-61] define la anatomia de enlace y [V-1] los valores por defecto que el import debe respetar.

**Criterios de aceptacion:**
- **Dado** que el objeto-clase `C` esta seleccionado, el CSV carga con el contrato posicional correcto (A1 ignorado, fila1=instancias, colA=atributos, cuerpo=valores), y hago clic en `IMPORT`, **cuando** termina, **entonces** el modelo contiene: N objects-instancia con enlace classification-instantiation hacia `C`; M objects-atributo exhibidos por `C`; `N × M` objects-atributo por instancia, cada uno exhibido por su instancia portadora y con un estado-valor unico cuyo literal es la celda del CSV.
- **Dado** que la importacion ejecuto, **cuando** miro el canvas, **entonces** `C` permanece en su posicion original; las instancias se distribuyen en un bus vertical derecho; cada instancia cuelga sus atributos en peine estructural; los triangulos de classification-instantiation se dibujan vacios sin decoracion interior.
- **Dado** que la importacion ejecuto, **cuando** consulto el panel OPL-ES, **entonces** aparecen las lineas: `C is an informatical and systemic object.`, `AttributeM of C is an informatical and systemic object.` por cada atributo de clase, `C exhibits Attribute1, Attribute2, ..., AttributeM.`, y lineas analogas por cada instancia.
- **Dado** que la importacion ejecuto, **cuando** consulto el panel `Draggable OPM Things`, **entonces** aparecen `N × M + M + N + 1` entradas (atributos por instancia + atributos de clase + instancias + clase).
- **Dado** que algo falla a mitad de la importacion, **cuando** se detecta la falla, **entonces** la importacion se revierte (transaccion todo-o-nada) y el modelo queda como estaba.

**Reglas y restricciones:**
- **Contrato posicional**: A1 = literal ignorado, fila 1 desde B = nombres de instancia, col A desde 2 = nombres de atributo, celda (i,j) con i≥2, j≥B = valor.
- El modelo emite **N+1 entidades independientes con el mismo rotulo visual** (`Attribute1` se duplica N+1 veces) — ver doc fuente §6 y brecha 48.4. Esto contradice el patron "una entidad, multiples apariencias" de doc 17, pero es la convencion OPCloud observada.
- Atributos default: **computational con un solo estado** (ver HU-71.014, HU-71.015 para modos).
- Transaccion: todo-o-nada salvo opcion explicita HU-71.020.
- Diagramacion: autodiagramacion tras importacion (HU-71.024).

**Modelo de datos tocado:**
- `thing` × (1 + N + M + N×M) nuevos registros.
- `link` classification-instantiation × N.
- `link` exhibition-characterization × M (clase) + N×M (instancias).
- `state` × N×M (uno por atributo de instancia).

**Dependencias:**
- Bloqueada por: HU-71.002, HU-71.003, HU-71.012, HU-71.021.
- Bloquea a: HU-71.014, HU-71.015, HU-71.016.

**Integraciones:**
- Nucleo (crear thing, crear link, crear state).
- Renderizador (redibuja canvas).
- Panel OPL-ES (regenera lineas).
- Biblioteca lateral.
- Diagramacion (autodiagramacion — HU-71.024).

**Notas de evidencia:**
- Fuente OPCloud: §3.4, §6.
- Frames: frame_00017, frame_00018, frame_00019, frame_00021.
- Transcripcion: "each instance has its own attributes with its own values".
- Fuente normativa: [V-61] anatomia de enlace; [V-1] valores por defecto; [OPL-ES] plantillas de clasificacion-instanciacion.
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** L.
**Etiquetas:** [interop, import-csv, instancias, atributos, classification-instantiation, nucleo].

---

### HU-71.014 — Crear atributos como computational con un solo estado (default)

**Actor primario:** IS (ingeniero de simulacion).
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** K.
**Superficie UI:** modal `Attributes and instances upload` (casilla `Create non-computational instance attributes` desmarcada).
**Gesto canonico:** ninguno (default).
**Fuente:** OPCloud: `opcloud-reverse/71-interop-csv.md` §5.3, §7.5.

**Historia:**
> Como ingeniero de simulacion, quiero que por defecto los atributos creados por import sean computational con un solo estado para que sus valores participen directamente en simulacion computacional sin edicion manual posterior.

**Contexto de negocio:**
El modo computational (default) hace que el valor sea numerico/parametrizable y apto para calculos (docs b1–b5). Es el modo esperable para el caso canonico de "instancias con parametros"; elegirlo como default reduce friccion. La SSOT [Glos 3.26] define el concepto de atributo computational en el contexto OPM.

**Criterios de aceptacion:**
- **Dado** que `Create non-computational instance attributes` esta desmarcado, **cuando** ejecuto la importacion, **entonces** cada atributo de instancia queda con `computational=true` y un unico estado cuyo valor es la celda del CSV.
- **Dado** que el atributo quedo computational, **cuando** abro su inspector, **entonces** veo su valor editable numericamente.
- **Dado** que el atributo quedo computational, **cuando** ejecuto una simulacion (EPICA-B1), **entonces** su valor participa en calculos.

**Reglas y restricciones:**
- Default OPCloud: computational con un solo estado.
- La palabra canonica del estado: pregunta abierta §11.9 doc fuente.

**Modelo de datos tocado:**
- `thing.computational` — boolean — persistente.
- `state.value` — string — persistente.

**Dependencias:**
- Bloqueada por: HU-71.013.

**Integraciones:**
- EPICA-B1 (simulacion computacional).

**Notas de evidencia:**
- Fuente OPCloud: §5.3 tabla, §7.5.
- Transcripcion: "by default the attributes are computational with a single state".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [interop, import-csv, atributos, computational, simulacion].

---

### HU-71.015 — Crear atributos como non-computational (casilla)

**Actor primario:** ME.
**Actores secundarios:** AD.
**Tipo:** opcloud-ui.
**Nivel categorico:** K.
**Superficie UI:** modal (casilla `Create non-computational instance attributes`).
**Gesto canonico:** marcar casilla antes de `IMPORT`.
**Fuente:** OPCloud: `opcloud-reverse/71-interop-csv.md` §5.1, §5.3.

**Historia:**
> Como modelador, quiero marcar `Create non-computational instance attributes` para que los atributos importados sean declarativos (etiqueta simbolica) en vez de computational, util para modelos documentales o referenciales.

**Contexto de negocio:**
Para modelos no parametricos (documentacion, referencia, estructuras sin simulacion), el modo non-computational es mas honesto: el valor es simbolico y no invita a la interpretacion numerica.

**Criterios de aceptacion:**
- **Dado** que `Create non-computational instance attributes` esta marcado, **cuando** ejecuto la importacion, **entonces** cada atributo de instancia queda con `computational=false` y un unico estado con literal del CSV.
- **Dado** que el atributo quedo non-computational, **cuando** ejecuto una simulacion (EPICA-B1), **entonces** su valor NO participa en calculos cuantitativos.
- **Dado** que marque la casilla, **cuando** cierro el modal sin importar, **entonces** la preferencia NO persiste para proximos imports (comportamiento por-dialogo).

**Reglas y restricciones:**
- Default: desmarcado.
- Por-dialogo (no fijo).

**Modelo de datos tocado:**
- `thing.computational` — boolean — persistente.

**Dependencias:**
- Bloqueada por: HU-71.013.

**Notas de evidencia:**
- Fuente OPCloud: §5.1 tabla, §5.3 tabla.
- Transcripcion: casilla cambia a non-computational con un estado.
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [interop, import-csv, atributos, non-computational].

---

### HU-71.016 — Respetar valores existentes con `Ignore CSV content for existing instances' values`

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario.
**Superficie UI:** modal (casilla `Ignore CSV content for existing instances' values`).
**Gesto canonico:** marcar casilla antes de `IMPORT`.
**Fuente:** OPCloud: `opcloud-reverse/71-interop-csv.md` §3.6, §5.1, §1.1.

**Historia:**
> Como modelador, quiero marcar `Ignore CSV content for existing instances' values` para proteger valores de instancias ya presentes en el modelo al re-importar un CSV que incluye tanto instancias nuevas como existentes.

**Contexto de negocio:**
Flujo de actualizacion parcial: el CSV trae instancias nuevas y quiero agregarlas sin pisar el trabajo manual hecho sobre las instancias anteriores. Sin esta opcion, la importacion pisaria los valores editados.

**Criterios de aceptacion:**
- **Dado** que ya existe una instancia `Instance1` con valor `X` en `Attribute1`, el CSV la incluye con valor `Y`, y la casilla esta marcada, **cuando** ejecuto la importacion, **entonces** el valor persiste como `X` (no se pisa).
- **Dado** que la casilla esta marcada, **cuando** ejecuto la importacion, **entonces** los propios atributos/objetos pre-existentes no se duplican.
- **Dado** que la casilla esta marcada y el CSV contiene nuevas instancias no pre-existentes, **cuando** ejecuto la importacion, **entonces** las instancias nuevas SI se crean con sus valores.
- **Dado** que la casilla esta desmarcada (default), **cuando** ejecuto la importacion, **entonces** los valores del CSV sobreescriben los existentes.

**Reglas y restricciones:**
- Coincidencia por **nombre exacto** de instancia (case-sensitive o no: pregunta abierta §11.6 doc fuente).
- Comportamiento sobre atributos nuevos no existentes: pregunta abierta §11.8 doc fuente.

**Modelo de datos tocado:**
- Preserva `state.value` existentes.

**Dependencias:**
- Bloqueada por: HU-71.013.

**Integraciones:**
- Nucleo (detecta existencia por nombre).

**Notas de evidencia:**
- Fuente OPCloud: §3.6, §5.1 tabla, §1.1.
- Transcripcion: "it will not duplicate also the object and will not override the values".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** M.
**Etiquetas:** [interop, import-csv, fusionar, idempotencia].

---

### HU-71.017 — Aplicar Auto Format sobre nombres del CSV

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** modal (casilla `Enable Auto Format`).
**Gesto canonico:** marcar/desmarcar casilla.
**Fuente:** OPCloud: `opcloud-reverse/71-interop-csv.md` §5.1, §4.6, §1.1.

**Historia:**
> Como modelador, quiero que `Enable Auto Format` este marcado por defecto para capitalizar primera letra de cada palabra en nombres de instancias y atributos del CSV, consistente con el dialogo emergente de creacion (HU-10.006).

**Contexto de negocio:**
Consistencia de estilo en nombres entre creacion manual (dialogo emergente Auto Format) y creacion por import. Desmarcarlo preserva el texto exacto del CSV (util para dominios con capitalizacion no convencional).

**Criterios de aceptacion:**
- **Dado** que `Enable Auto Format` esta marcado (default), el CSV trae `instance one` como nombre, **cuando** ejecuto la importacion, **entonces** la instancia se llama `Instance One`.
- **Dado** que desmarco la casilla, **cuando** ejecuto la importacion, **entonces** el nombre se preserva literal: `instance one`.
- **Dado** que el CSV trae un valor de celda (`value11`), **cuando** ejecuto la importacion con Auto Format marcado, **entonces** el valor aparece como **pregunta abierta** §11.7 doc fuente: ¿tambien se capitaliza?

**Reglas y restricciones:**
- Default: marcado.
- Aplica a nombres estructurales (instancias, atributos). Sobre valores de celda: pregunta abierta §11.7.
- Consistente con HU-10.006 (dialogo emergente Auto Format).

**Modelo de datos tocado:**
- `thing.name` — string capitalizado o literal.

**Dependencias:**
- Bloqueada por: HU-71.013.

**Integraciones:**
- Misma logica de capitalizacion que HU-10.006.

**Notas de evidencia:**
- Fuente OPCloud: §5.1 tabla, §4.6, §1.1.
- Transcripcion: "capitalize the first letter of each word if necessary".
- Clase de afirmacion: confirmado por transcripcion (sobre nombres) + abierto (sobre valores).
- Etiqueta: `requires-clarification` parcial.

**Prioridad:** M1.
**Tamano:** XS.
**Etiquetas:** [interop, import-csv, auto-format, capitalizacion, requires-clarification].

---

### HU-71.018 — Crear masivamente things desde CSV plano (sin clase raiz)

**Actor primario:** AD (autor de dominio).
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario.
**Superficie UI:** modal-import-csv (modo "things").
**Gesto canonico:** clic en `IMPORT` con modo=things.
**Fuente:** OPCloud: extension propuesta; no observado en OPCloud.

**Historia:**
> Como autor de dominio, quiero importar un CSV plano con N filas y cada fila crea una thing independiente, sin requerir un objeto-clase previo, para poblar el modelo con vocabularios grandes (ontologias, catalogos) en una sola pasada.

**Contexto de negocio:**
El flow OPCloud observado exige clase raiz (HU-71.013). Pero un autor de dominio frecuentemente quiere cargar un vocabulario completo (p.ej. lista de stakeholders, lista de procesos del dominio) sin estructura de clase. Esta HU extiende el producto con un modo plano. La SSOT OPM [V-1] define los atributos minimos que cada thing debe poseer.

**Criterios de aceptacion:**
- **Dado** que elegi modo "things" y mapee columnas (HU-71.009), **cuando** ejecuto la importacion, **entonces** se crea una thing por fila con los campos especificados en el mapeo.
- **Dado** que el CSV tiene columna `type`, **cuando** se importan, **entonces** cada thing toma el tipo correspondiente (`process`, `object`, `state`).
- **Dado** que el CSV no tiene columna `type`, **cuando** se importan, **entonces** todas las filas se crean como `object` (default configurable).
- **Dado** que el CSV tiene columna `parent`, **cuando** se resuelve una fila con `parent=X`, **entonces** se crea enlace de aggregation-participation hacia `X` (o classification-instantiation si `parent` apunta a clase).
- **Dado** que una fila viola validacion (HU-71.010), **cuando** se intenta crear, **entonces** se reporta en el reporte final (HU-71.025) sin crear esa thing.

**Reglas y restricciones:**
- Orden de resolucion: primero things sin parent; despues things con parent (orden topologico).
- Si hay ciclo en parents, se reporta error antes de la confirmacion.
- Default type si no mapeado: `object` (configurable).

**Modelo de datos tocado:**
- `thing` × N nuevos.
- `link` × cantidad de referencias `parent` resueltas.

**Dependencias:**
- Bloqueada por: HU-71.001, HU-71.009, HU-71.012.
- Bloquea a: HU-71.019.

**Integraciones:**
- Nucleo (crear thing, crear link).
- Autodiagramacion (HU-71.024).

**Notas de evidencia:**
- Fuente OPCloud: extension propuesta. No observado en OPCloud.
- Clase de afirmacion: inferido.

**Prioridad:** S.
**Tamano:** L.
**Etiquetas:** [interop, import-csv, nucleo, creacion-masiva, things].

---

### HU-71.019 — Crear masivamente enlaces desde CSV de enlaces

**Actor primario:** AD.
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario.
**Superficie UI:** modal-import-csv (modo "enlaces").
**Gesto canonico:** clic en `IMPORT` con modo=enlaces + CSV de enlaces.
**Fuente:** OPCloud: extension propuesta; no observado en OPCloud.

**Historia:**
> Como autor de dominio, quiero importar un segundo CSV que describe enlaces (`source`, `target`, `link_type`, `subtype`, `modifier`) para conectar things ya presentes sin tener que trazar cada enlace a mano.

**Contexto de negocio:**
Tras importar things (HU-71.018), falta conectarlas. Un CSV de enlaces complementario es la via simetrica. Columnas canonicas: `source` (nombre de thing existente), `target` (idem), `link_type` (enum OPM), `subtype` (opcional), `modifier` (None|NOT). La SSOT OPM [V-239] define las cinco familias canonicas y [V-61] la anatomia del enlace.

**Criterios de aceptacion:**
- **Dado** que el modelo tiene things `A` y `B`, y el CSV trae una fila `source=A, target=B, link_type=Instrument`, **cuando** ejecuto la importacion de enlaces, **entonces** se crea un enlace Instrument de `A` hacia `B`.
- **Dado** que el CSV referencia `source=X` que no existe en el modelo, **cuando** se valida (HU-71.010), **entonces** se reporta error: "`X` no existe".
- **Dado** que el CSV describe un enlace ilegal (p.ej. Agent entre objetos informaticos — ver HU-10.010), **cuando** se valida, **entonces** se reporta error: "Enlace Agent requiere source fisico".
- **Dado** que el enlace ya existe (mismo source/target/type), **cuando** se importa, **entonces** se ignora con aviso "enlace duplicado" (HU-71.016 analogo para enlaces).

**Reglas y restricciones:**
- Validacion estricta contra gramatica OPM: el importador delega al mismo validador que usa el selector de enlaces (HU-10.008).
- Orden: primero se importan things, despues enlaces (dos pasadas si ambos CSV estan cargados).
- Referencias a things por nombre exacto.

**Modelo de datos tocado:**
- `link` × N nuevos.

**Dependencias:**
- Bloqueada por: HU-71.018.
- Relaciona: HU-10.008, HU-10.010.

**Integraciones:**
- Validador de enlaces del nucleo.
- Panel OPL-ES.

**Notas de evidencia:**
- Fuente OPCloud: extension propuesta. No observado en OPCloud.
- Clase de afirmacion: inferido.

**Prioridad:** S.
**Tamano:** L.
**Etiquetas:** [interop, import-csv, nucleo, enlaces, creacion-masiva].

---

### HU-71.020 — Elegir modo fusionar vs reemplazar al importar sobre modelo con contenido

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; K secundario.
**Superficie UI:** modal-import-csv (selector modo).
**Gesto canonico:** seleccion en selector desplegable `Modo de importacion`.
**Fuente:** OPCloud: extension propuesta; no observado en OPCloud.

**Historia:**
> Como modelador, quiero elegir entre `fusionar` (anadir a lo existente) y `reemplazar` (reemplazar el contenido del OPD actual) al importar para no borrar inadvertidamente trabajo previo.

**Contexto de negocio:**
OPCloud observado es implicitamente `fusionar` (nunca borra lo previo). Pero un usuario que importa un vocabulario nuevo a veces quiere partir limpio. Exponer el modo explicitamente evita operaciones destructivas inadvertidas.

**Criterios de aceptacion:**
- **Dado** que el modal esta abierto y el modelo no esta vacio, **cuando** miro las opciones, **entonces** hay selector `Modo de importacion` con `fusionar` (default) y `reemplazar`.
- **Dado** que elijo `fusionar`, **cuando** importo, **entonces** las entidades del CSV se anaden al modelo existente respetando HU-71.016 para conflictos.
- **Dado** que elijo `reemplazar`, **cuando** hago clic en `IMPORT`, **entonces** aparece confirmacion destructiva: "Esto borrara todas las entidades del OPD actual. ¿Continuar?" con opcion default `Cancelar`.
- **Dado** que confirmo `reemplazar`, **cuando** se ejecuta, **entonces** el OPD actual se vacia y se rellena con el contenido del CSV.

**Reglas y restricciones:**
- Default: `fusionar`.
- `reemplazar` requiere confirmacion adicional.
- El modo `reemplazar` opera solo sobre el OPD actual, no sobre todo el modelo.

**Modelo de datos tocado:**
- Potencialmente destructivo en modo `reemplazar`.

**Dependencias:**
- Bloqueada por: HU-71.012.
- Relaciona: HU-71.026 (deshacer).

**Notas de evidencia:**
- Fuente OPCloud: extension propuesta. No observado.
- Clase de afirmacion: inferido.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [interop, import-csv, fusionar, reemplazar].

---

### HU-71.021 — Bloquear import sobre objeto que es a su vez una instancia

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario; U secundario.
**Superficie UI:** barra-contextual (accion deshabilitada) + sugerencia.
**Gesto canonico:** intento de invocar sobre objeto invalido.
**Fuente:** OPCloud: `opcloud-reverse/71-interop-csv.md` §1.1, §4.1.

**Historia:**
> Como modelador, quiero que la accion `Add attribute instances and values from CSV` este deshabilitada o rechace la invocacion si el objeto seleccionado es el mismo una instancia, para prevenir estados inconsistentes.

**Contexto de negocio:**
La transcripcion §1.1 es explicita: "make sure it is not an instance by itself meaning it is not connected by the instance structure link". Un InstanceN no admite re-importar sobre si: generaria una jerarquia circular o invalida. La SSOT [V-61] define la relacion classification-instantiation como relacion de clase a instancia; una instancia no puede fungir como clase.

**Criterios de aceptacion:**
- **Dado** que tengo seleccionado un Object `X` que esta conectado por enlace classification-instantiation como **instancia** (no como clase), **cuando** abro el entities extension group, **entonces** la accion `Add attribute instances and values from CSV` esta deshabilitada con sugerencia "`X` es una instancia; selecciona una clase".
- **Dado** que tengo un Object de clase (no instancia), **cuando** abro el grupo, **entonces** la accion esta habilitada.
- **Dado** que la deteccion falla por algun error y se invoca el modal, **cuando** hago clic en `IMPORT`, **entonces** el nucleo rechaza la operacion con error claro.

**Reglas y restricciones:**
- Deteccion: el objeto es instancia si tiene al menos un enlace saliente de classification-instantiation hacia una clase.
- Sugerencia explicita para reducir friccion al usuario.
- **Abierto** §4.1 doc fuente: ¿deshabilitada vs aviso vs rechazo del modal? Esta HU opta por deshabilitada + rechazo en servidor.

**Modelo de datos tocado:**
- Ninguno (validacion de precondicion).

**Dependencias:**
- Bloquea a: HU-71.002, HU-71.013.

**Integraciones:**
- Nucleo (validador).

**Notas de evidencia:**
- Fuente OPCloud: §1.1, §4.1.
- Transcripcion: "make sure it is not an instance by itself".
- Clase de afirmacion: confirmado por transcripcion + abierto (sobre el mecanismo UI).
- Etiqueta: `requires-clarification`.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [interop, import-csv, precondicion, validacion, requires-clarification].

---

### HU-71.022 — Aplicar stereotypes de organizacion a things importadas

**Actor primario:** AD.
**Actores secundarios:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** D (dominio) primario; K secundario.
**Superficie UI:** modal-import-csv (selector stereotype por defecto + mapeo columna).
**Gesto canonico:** seleccion en selector desplegable `Stereotype por defecto` y/o mapear columna a `stereotype`.
**Fuente:** OPCloud: extension propuesta; no observado en OPCloud.

**Historia:**
> Como autor de dominio, quiero aplicar un stereotype de mi organizacion (p.ej. `kora:actor`, `hdos:procedure`) a las things importadas, sea por default o por columna del CSV, para que la ingesta respete la ontologia de mi dominio.

**Contexto de negocio:**
El repo ya tiene perfiles de dominio (`src/suite/kora/profile.ts`). Un import que ignore stereotypes fuerza al usuario a post-procesar cada thing. Exponer el stereotype en tiempo de import es la via limpia.

**Criterios de aceptacion:**
- **Dado** que mi organizacion tiene stereotypes definidos (EPICA-A0, EPICA-82), **cuando** abro el importador, **entonces** hay selector desplegable `Stereotype por defecto` con los stereotypes del perfil activo + `(ninguno)`.
- **Dado** que elijo un default stereotype, **cuando** importo, **entonces** todas las things creadas reciben ese stereotype.
- **Dado** que mapeo una columna del CSV a `stereotype`, **cuando** importo, **entonces** el valor de la columna tiene precedencia sobre el default.
- **Dado** que el valor de stereotype en el CSV no existe en el perfil, **cuando** se valida, **entonces** se reporta aviso "stereotype `X` no registrado en el perfil".

**Reglas y restricciones:**
- Precedencia: columna > default > ninguno.
- Stereotypes validos: los del perfil activo (EPICA-A0).

**Modelo de datos tocado:**
- `thing.stereotype` — string opcional — persistente.

**Dependencias:**
- Bloqueada por: HU-71.013 o HU-71.018.
- Relaciona: EPICA-A0, EPICA-82.

**Integraciones:**
- Perfil de dominio (`src/suite/<dominio>/profile.ts`).

**Notas de evidencia:**
- Fuente OPCloud: extension propuesta. No observado en OPCloud (OPCloud tiene stereotype extension pero no lo liga al import CSV).
- Clase de afirmacion: inferido.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [interop, import-csv, stereotype, ontologia, dominio].

---

### HU-71.023 — Integrar import con la ontologia de la organizacion (tipos permitidos)

**Actor primario:** AO (admin de organizacion).
**Actores secundarios:** AD.
**Tipo:** opcloud-ui.
**Nivel categorico:** C (config) primario; K secundario.
**Superficie UI:** modal-import-csv (validacion contra ontologia).
**Gesto canonico:** ninguno (validacion automatica).
**Fuente:** OPCloud: extension propuesta; no observado en OPCloud.

**Historia:**
> Como admin de organizacion, quiero que el importador rechace o marque things cuyos tipos/stereotypes no esten registrados en la ontologia de mi organizacion para mantener higiene del modelo corporativo.

**Contexto de negocio:**
EPICA-82 define la ontologia de la organizacion (conjunto de tipos, stereotypes, roles permitidos). Un import descontrolado contamina el modelo con entidades no-ontologicas. Esta HU liga import CSV con ontologia.

**Criterios de aceptacion:**
- **Dado** que la organizacion tiene ontologia activa (EPICA-82), **cuando** el importador valida, **entonces** cada thing se coteja contra la ontologia.
- **Dado** que una thing del CSV tiene `type` o `stereotype` no listado en la ontologia, **cuando** se valida, **entonces** se reporta aviso (si la ontologia es no-estricta) o error (si es estricta).
- **Dado** que la ontologia es estricta y hay errores, **cuando** intento `IMPORT`, **entonces** el boton esta deshabilitado.
- **Dado** que la ontologia es no-estricta, **cuando** importo, **entonces** las entidades con aviso se crean pero se marcan con flag `ontology:non-canonical`.

**Reglas y restricciones:**
- Modo ontologia: `strict` | `warn` | `off` (configurado en EPICA-82).
- Default del repo: `warn`.

**Modelo de datos tocado:**
- `thing.ontologyFlag` — opcional — persistente.

**Dependencias:**
- Bloqueada por: HU-71.022.
- Relaciona: EPICA-82.

**Integraciones:**
- Config organizacion.

**Notas de evidencia:**
- Fuente OPCloud: extension propuesta.
- Clase de afirmacion: inferido.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [interop, import-csv, ontologia, config].

---

### HU-71.024 — Autodiagramacion automatica tras importacion

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** V (renderizado/diagramacion).
**Superficie UI:** canvas-opd.
**Gesto canonico:** ninguno (disparo automatico tras importacion).
**Fuente:** OPCloud: `opcloud-reverse/71-interop-csv.md` §7.2, §11.12.

**Historia:**
> Como modelador, quiero que tras un import masivo el canvas ejecute autodiagramacion para no quedar con N entidades apiladas en el origen.

**Contexto de negocio:**
OPCloud observado aplica autodiagramacion tras importacion (peine estructural con buses Manhattan). El repo tiene motor de diagramacion algoritmico (`src/render/layout/`) con 9 passes dagre + post-procesos OPM. Invariante: la diagramacion es responsabilidad del renderizador, no codificado en fixtures. La SSOT [V-124] define el sombreado como canal semantico que debe conservarse tras la diagramacion; [V-1] define las ocho representaciones de cosa que el motor debe respetar.

**Criterios de aceptacion:**
- **Dado** que termine un import que creo >=3 nuevas entidades, **cuando** se termina la confirmacion, **entonces** el renderizador ejecuta autodiagramacion sobre el OPD actual.
- **Dado** que la autodiagramacion termino, **cuando** miro el canvas, **entonces** las entidades estan distribuidas sin solapamiento y con buses Manhattan para enlaces estructurales.
- **Dado** que el OPD ya tenia entidades pre-import, **cuando** corre autodiagramacion, **entonces** las entidades pre-import se pueden reubicar si la diagramacion lo requiere (pregunta abierta §11.12 doc fuente).
- **Dado** que quiero preservar diagramacion manual pre-import, **cuando** configuro la opcion `Preserve existing layout`, **entonces** la autodiagramacion solo toca las entidades nuevas.

**Reglas y restricciones:**
- Autodiagramacion es el mismo motor de EPICA-10/11/12.
- Opcion `Preserve existing layout` (default marcada): solo re-diagrama nuevas.
- Pregunta abierta §11.12: OPCloud no lo especifica; esta HU propone `preserve existing` como default por principio de minima sorpresa.

**Modelo de datos tocado:**
- `thing.position` — se reescribe para entidades involucradas.

**Dependencias:**
- Bloqueada por: HU-71.013, HU-71.018, HU-71.019.

**Integraciones:**
- `src/render/layout/` (motor).

**Notas de evidencia:**
- Fuente OPCloud: §7.2, §11.12.
- Clase de afirmacion: observado (OPCloud aplica autodiagramacion) + abierto (politica de preservacion).

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [interop, import-csv, diagramacion, renderizado, requires-clarification].

---

### HU-71.025 — Reporte final con N creadas, M ignoradas y K errores

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; L secundario.
**Superficie UI:** notificacion/modal tras importacion con resumen.
**Gesto canonico:** ninguno (modal automatico tras confirmacion).
**Fuente:** OPCloud: propuesta propia.

**Historia:**
> Como modelador, quiero ver tras la importacion un reporte final con conteos de things/enlaces creados, entidades ignoradas por duplicado y errores reportados, para auditar el resultado sin tener que buscar entidad por entidad.

**Contexto de negocio:**
OPCloud observado no emite reporte final explicito (el usuario infiere el resultado mirando canvas y OPL). Para imports grandes esto es fragil. Esta HU anade un reporte estructurado.

**Criterios de aceptacion:**
- **Dado** que termino la importacion, **cuando** se cierra el modal, **entonces** aparece una notificacion o modal con resumen: `Creadas: N things, L enlaces. Ignoradas: M (duplicadas o protegidas). Errores: K.`
- **Dado** que hay errores, **cuando** hago clic en `Ver detalle`, **entonces** se abre panel con lista de errores (fila, columna, mensaje).
- **Dado** que hago clic en una fila del panel de errores, **cuando** se ejecuta, **entonces** el canvas hace zoom/desplazamiento a la entidad afectada (si se creo parcial) o muestra el fragmento del CSV original.
- **Dado** que la importacion fue 100% exitosa, **cuando** cierro la notificacion, **entonces** no quedan pendientes.

**Reglas y restricciones:**
- Notificacion si todo ok; modal si hay errores o avisos.
- Reporte persiste en `importSession.report` hasta proxima importacion.

**Modelo de datos tocado:**
- `importSession.report` — transitorio (con opcion de export a JSON).

**Dependencias:**
- Bloqueada por: HU-71.013, HU-71.018, HU-71.019.

**Integraciones:**
- UI notificacion/modal.

**Notas de evidencia:**
- Fuente OPCloud: propuesta propia.
- Clase de afirmacion: inferido.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [interop, import-csv, reporte, ui].

---

### HU-71.026 — Deshacer import completo con un solo deshacer

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** K primario (operacion nucleo reversible); P secundario (registro de eventos).
**Superficie UI:** atajo `Ctrl+Z` o boton deshacer.
**Gesto canonico:** deshacer.
**Fuente:** OPCloud: propuesta propia.

**Historia:**
> Como modelador, quiero deshacer un import completo con un solo deshacer para revertir un resultado inesperado sin tener que eliminar entidad por entidad.

**Contexto de negocio:**
Un import puede crear docenas o centenas de entidades. Si el resultado no es el esperado, deshacer una a una es inviable. La importacion debe registrarse como **una sola operacion** en el registro de eventos para permitir un deshacer atomico.

**Criterios de aceptacion:**
- **Dado** que ejecute un import que creo N things y L enlaces, **cuando** presiono `Ctrl+Z`, **entonces** todas las entidades creadas se eliminan en una operacion atomica y el modelo vuelve al estado pre-import.
- **Dado** que la importacion modifico valores existentes (modo `reemplazar` o sin HU-71.016), **cuando** hago deshacer, **entonces** los valores originales se restauran.
- **Dado** que hice deshacer, **cuando** presiono `Ctrl+Y` (rehacer), **entonces** la importacion se re-aplica.
- **Dado** que ejecute varias operaciones manuales despues de la importacion, **cuando** hago deshacer, **entonces** se revierte **solo** la importacion si uso atajo dedicado `Deshacer Import`; `Ctrl+Z` estandar revierte paso a paso.

**Reglas y restricciones:**
- Import se registra como evento unico en `src/persistencia/registro-eventos`.
- Atajo estandar `Ctrl+Z` revierte la operacion mas reciente.
- Atajo opcional `Deshacer Import` va al ultimo import aunque haya otras operaciones intermedias.
- Ver EPICA-30 para modelo general de deshacer/rehacer.

**Modelo de datos tocado:**
- `registroEventos.entries` — nueva entrada `kind=import-csv` con payload reversible.

**Dependencias:**
- Bloqueada por: HU-71.013, HU-71.018, HU-71.019.
- Relaciona: EPICA-30 (persistencia), EPICA-90 (atajos).

**Integraciones:**
- Registro de eventos de persistencia.
- Deshacer/rehacer del nucleo.

**Notas de evidencia:**
- Fuente OPCloud: propuesta propia.
- Clase de afirmacion: inferido.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [interop, import-csv, deshacer, trazabilidad, registro-eventos].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

Cada pregunta se correlaciona con las numeradas en el doc fuente y, cuando aplica, queda cubierta parcialmente por una HU marcada `requires-clarification`:

- **Q71.1** (doc §11.1): Mecanismo exacto de bloqueo cuando el objeto seleccionado es instancia. Cubierta parcialmente por HU-71.021.
- **Q71.2** (doc §11.2): Comportamiento de `IMPORT` sin archivo cargado. No cubierta por HU; nota: probablemente no-op con aviso, a validar.
- **Q71.3** (doc §11.3): Delimitador, BOM, UTF-16, limite de tamano, limite de filas. Cubierta parcialmente por HU-71.006, HU-71.007. Limites de tamano/filas no cubiertos — nueva HU candidata HU-71.027 (deferred).
- **Q71.4** (doc §11.4): Celda A1 con valor no-literal. No cubierta; nota: asumido "ignorado" por contrato posicional.
- **Q71.5** (doc §11.5): Celdas vacias en el cuerpo del CSV. Cubierta parcialmente por HU-71.010 validacion.
- **Q71.6** (doc §11.6): Colision de nombres (instancia=clase, atributo=reservado). Cubierta parcialmente por HU-71.010.
- **Q71.7** (doc §11.7): Auto Format sobre valores de celda. Cubierta parcialmente por HU-71.017 con marca `requires-clarification`.
- **Q71.8** (doc §11.8): Efecto de `Ignore CSV content` sobre atributos nuevos no existentes. Cubierta parcialmente por HU-71.016; nota explicita pendiente.
- **Q71.9** (doc §11.9): Literal exacto del estado unico en modo non-computational. Cubierta parcialmente por HU-71.015.
- **Q71.10** (doc §11.10): Sintaxis OPL de classification-instantiation tras import (linea global vs solo individuales). No cubierta en esta epica; delegada a EPICA-50.
- **Q71.11** (doc §11.11): Determinismo del orden visual tras importacion. Cubierta parcialmente por HU-71.024.
- **Q71.12** (doc §11.12): Re-import sobre OPD con apariencias manuales. Cubierta parcialmente por HU-71.024 con opcion `Preserve existing layout`.
- **Q71.13** (doc §11.13): Representacion multi-estado en CSV. No cubierta; declarada fuera de alcance; requeriria HU adicional cuando aparezca presion.

## Referencias cruzadas

- Doc fuente: `opcloud-reverse/71-interop-csv.md`.
- Fuente normativa: `opm-iso-19450-es.md`, `opm-visual-es.md`, `opm-opl-es.md`.
- Evidencia OPCloud: `JOYAS.md`, `sandbox-data/`, `assets/svg/`, `decompiled/`.
- **Epicas que dependen de esta**: EPICA-82 (organization ontology — HU-71.023), EPICA-B1 (simulacion computacional — HU-71.014).
- **Epicas de las que esta depende**: EPICA-10 (canvas-creacion-cosas — Auto Format en HU-71.017, precondicion de clase en HU-71.021), EPICA-13 (estados — modelo de estado-valor), EPICA-17 (atributos-instancias — modelo canonico de atributo), EPICA-A0 (stereotypes — entities extension group en HU-71.002, HU-71.022), EPICA-50 (OPL pane — plantillas nuevas de clasificacion-instanciacion), EPICA-20 (OPD tree — pregunta abierta sobre nodo SDn), EPICA-30 (persistencia — registro de eventos y deshacer en HU-71.026), EPICA-70 (import OPCAT — misma geometria divergente de clasificacion-instanciacion), EPICA-1C (validaciones — unicidad de nombres).
- **Invariantes del repo**: `src/nucleo/tipos.ts` (Thing, Link, State), `src/nucleo/validacion/` (14 passes — delegacion desde HU-71.010), `src/render/layout/` (autodiagramacion — HU-71.024), `src/render/opl-renderer.ts` (plantillas OPL nuevas), `src/persistencia/registro-eventos` (HU-71.026).
- **SSOT OPM**: divergencia observada en §1.7 (clasificacion-instanciacion con decoracion vs triangulos vacios en OPCloud). Decision del repo: seguir SSOT (decoracion interior) aunque divirja de OPCloud.
- **Brecha 48.4 del doc fuente**: N+1 entidades independientes con el mismo rotulo visual contradice "una entidad, multiples apariencias" de doc 17. Esta epica documenta la convencion OPCloud sin decidir que hacer en el repo; la decision queda delegada al handoff.
