# 01 — Canon y exportación

**Alcance**: regla rectora de canonicidad V-0 a V-0e, perfiles de export obligatorios (`canon-diagrama`, `canon-documento`), clasificación UI vs gramática.
**Capa SSOT propietaria**: `opm-visual-es.md` §0.1, §25
**Aplicación en la app**: `src/render/`, futura pipeline de export SVG/PDF, auditoría visual.

## Reglas

### R-100: V-0 — Canonicidad por exportación

- Enunciado: la gramática visual OPM conforme es la que persiste en un **export canónico declarado** por la implementación. Todo elemento visible en canvas que NO persiste en ningún export canónico se clasifica como afordance UI, no como gramática OPM.
- Referencia SSOT: V-0 (`opm-visual-es.md` §0.1)
- Aplicación en código: el canvas editable puede mostrar handles, grid, overlays; el exportador DEBE suprimir todo lo que no tenga regla `V-*` asociada.
- Antipatrón: considerar que "lo que se ve en el canvas" es automáticamente parte del modelo.

### R-101: V-0a — Dos perfiles obligatorios

- Enunciado: toda implementación conforme DEBE declarar al menos dos perfiles de export:
  - **canon-diagrama**: export por OPD, preferentemente vectorial, preserva gramática visible y metadato mínimo de identificación
  - **canon-documento**: export por modelo, potencialmente multi-OPD, puede incluir OPL, diccionarios, portadas, anexos, vistas derivadas
- Referencia SSOT: V-0a
- Aplicación en código: el exportador debe exponer ambos modos. Un único modo "imagen del canvas" es insuficiente.

### R-102: V-0b — Cobertura por reglas `V-*`

- Enunciado: si un elemento persiste en el canon-diagrama, pertenece a la gramática visible del OPD y DEBE quedar cubierto por alguna regla `V-*` o por un capítulo explícito de la capa visual.
- Referencia SSOT: V-0b
- Aplicación en código: auditoría del SVG exportado debe encontrar regla para cada símbolo.
- Antipatrón: exportar un glifo introducido por la herramienta sin respaldo normativo.

### R-103: V-0c — UI transitoria sin reutilización de canales semánticos

- Enunciado: si un elemento aparece en canvas editable pero desaparece del canon-diagrama y del canon-documento, es UI transitoria. NO puede reutilizar sin distinción los canales visuales reservados a la gramática semántica.
- Referencia SSOT: V-0c
- Aplicación en código: handles, puntos de conexión, botones flotantes deben usar colores/formas/tamaños distintos de piruletas, triángulos, flechas semánticas.
- Antipatrón: usar un círculo negro como handle de selección (colisiona con piruleta de agente).

### R-104: V-0d — Atributos de perfil declarados

- Enunciado: si un elemento aparece solo en uno de los perfiles canónicos, la implementación DEBE declararlo como atributo de perfil y la SSOT DEBE arbitrarlo explícitamente.
- Referencia SSOT: V-0d
- Aplicación en código: por ejemplo, el rótulo de número de OPD puede existir en canon-documento pero no en canon-diagrama; declarar cuál perfil incluye qué.

### R-105: V-0e — Captura de pantalla no es evidencia de canonicidad

- Enunciado: una captura de pantalla del canvas en modo edición, navegación, modal o simulación pausada NO constituye por sí misma evidencia suficiente de canonicidad.
- Referencia SSOT: V-0e
- Aplicación en código: la auditoría visual debe inspeccionar el SVG/export canónico, no solo capturas. Ver `docs/design/archive/auditoria-ssot-visual-2026-04-23.md`.

### R-106: V-225 — Tres familias de salida

- Enunciado: la adaptación reconoce:
  - **canon-documento**: artefacto documental completo por modelo
  - **canon-diagrama**: artefacto por OPD, preferentemente vectorial
  - **previsualización raster**: artefacto no canónico para compatibilidad o miniatura
- Referencia SSOT: V-225 (`opm-visual-es.md` §25.1)
- Aplicación en código: distinguir los tres casos en el exportador. Raster es un fallback, no canónico.

### R-107: V-226 — Perfil por defecto declarado

- Enunciado: toda implementación conforme DEBE declarar un perfil por defecto para canon-documento y otro para canon-diagrama. La ausencia de perfil declarado invalida la aplicación operativa de V-0.
- Referencia SSOT: V-226
- Aplicación en código: documentar el perfil por defecto en un ADR (ej. canon-diagrama = SVG 1.1, canon-documento = PDF multi-página).

### R-108: V-227 — Canon-diagrama preserva gramática visible

- Enunciado: el canon-diagrama DEBE preservar la gramática visible del OPD, preferentemente en formato vectorial. NO debe incluir handles, grid, overlays modales, toasts ni chrome de edición.
- Referencia SSOT: V-227
- Aplicación en código: el exportador SVG filtra capas UI antes de serializar.

### R-109: V-228 — Rótulos en negro por defecto en canon-diagrama

- Enunciado: en el canon-diagrama los rótulos dentro del grafo permanecen en negro por defecto, salvo que la SSOT promueva expresamente otro comportamiento. El cromatismo de clase se preserva primariamente en bordes, líneas y decoraciones semánticas.
- Referencia SSOT: V-228
- Aplicación en código: paleta de canon-diagrama usa negro para textos; paleta editable puede ser distinta.

### R-110: V-229 — Composición del canon-documento

- Enunciado: el canon-documento puede incluir:
  - Portada
  - URL / ID del modelo
  - Índice
  - Árbol de OPDs (mapa del sistema)
  - Diagramas
  - OPL
  - Diccionario de elementos
  - Diccionario de relaciones
  - Vistas derivadas
- Referencia SSOT: V-229
- Aplicación en código: el canon-documento es un ensamblado, no un único SVG. Declarar qué incluye el perfil por defecto.

### R-111: V-230 — Listados textuales pueden extender cromatismo

- Enunciado: los listados textuales del canon-documento pueden extender el cromatismo de clase a nombres fuera del grafo, siempre que el perfil lo declare y no contradiga el canon-diagrama.
- Referencia SSOT: V-230
- Aplicación en código: en índices, resaltar objetos con color verde y procesos con azul oscuro es admisible si se documenta.

### R-112: V-231 — Export parcial declarado

- Enunciado: si el export omite OPDs, sub-modelos o vistas derivadas, el artefacto DEBE declararse como export parcial e identificar explícitamente el subconjunto incluido.
- Referencia SSOT: V-231
- Aplicación en código: cada export incluye un metadato `"perfil": "canon-diagrama"`, `"parcial": true/false`, `"incluye": [...]`.

### R-113: V-232 — Referencias recuperables para contenido omitido

- Enunciado: el canon-documento puede incluir descripciones de entidades, tooltips computacionales, requirement views u otros anexos. Si los omite, DEBE mantener una referencia recuperable a esos atributos cuando formen parte del modelo.
- Referencia SSOT: V-232
- Aplicación en código: referencias persistentes (URI, hash, ID) a recursos no embebidos.

### R-114: V-233 — Canon-diagrama no depende de rasterización

- Enunciado: el canon-diagrama NO debe depender de rasterización para conservar sus distinciones esenciales. Si un perfil documental rasteriza los OPDs, DEBE declarar resolución mínima suficiente para preservar dash, contornos, triángulos y rótulos.
- Referencia SSOT: V-233
- Aplicación en código: SVG es la salida por defecto. PNG/JPEG solo como preview. PDF puede rasterizar, pero debe declarar DPI.

### R-115: V-234 — No recortar símbolos sin anclaje

- Enunciado: ningún export canónico debe recortar símbolos de forma que pierdan su anclaje topológico o su objeto contenedor.
- Referencia SSOT: V-234
- Aplicación en código: viewport del exportador calcula bounding box completo del OPD (ver V-199). Sin elementos huérfanos cortados por borde.

### R-116: V-235 — Watermarks como capa documental

- Enunciado: marcas de agua, etiquetas de confidencialidad u overlays editoriales son admisibles solo como capa documental adicional. NO pueden ocluir primitivas OPM ni confundirse con gramática del diagrama.
- Referencia SSOT: V-235
- Aplicación en código: watermark en z-index por encima del canvas pero con opacidad controlada y sin intersectar bounding boxes de cosas.

### R-117: V-236 — Portabilidad de recursos

- Enunciado: si el modelo depende de bitmaps, sub-modelos, descripciones externas o código adjunto, el export canónico DEBE:
  - embutir esos recursos, o
  - referenciarlos persistentemente, o
  - declarar explícitamente su ausencia
- Referencia SSOT: V-236
- Aplicación en código: el exportador resuelve recursos antes de emitir; si no puede, declara la ausencia en el metadato.

### R-118: V-196 — Grid como decoración opcional

- Enunciado: la grid del canvas es decoración opcional de edición. NO pertenece al modelo OPM y DEBE suprimirse en exportaciones canónicas.
- Referencia SSOT: V-196
- Aplicación en código: el exportador remueve el grid del SVG.

### R-119: V-197 — Snap a grid transparente al modelo

- Enunciado: el snap a grid es transparente al modelo. Dos OPDs con idéntica topología y diferencias de posicionamiento explicables solo por cuantización a grid se consideran visualmente equivalentes.
- Referencia SSOT: V-197
- Aplicación en código: los tests de snapshot no fallan por desfase de 1-2 px debido a snap.

### R-120: V-199 — Auto-ajuste de viewport

- Enunciado: la implementación DEBE auto-ajustar el viewport al exportar para evitar símbolos huérfanos recortados por el borde del artefacto.
- Referencia SSOT: V-199
- Aplicación en código: pre-export, computar bounding box del OPD y ajustar el `viewBox` del SVG. Ver `docs/design/archive/auditoria-ssot-visual-2026-04-23.md` §2.8 (deuda actual).

## Checklist

- [ ] Existe pipeline de export separado de la vista editable
- [ ] El export canónico declara perfil (canon-diagrama / canon-documento / preview)
- [ ] El canon-diagrama es vectorial por defecto (SVG)
- [ ] El canon-diagrama NO contiene grid, handles, overlays, modales, tooltips
- [ ] Los rótulos dentro del grafo son negros por defecto en canon-diagrama
- [ ] El viewport se auto-ajusta; no hay símbolos cortados
- [ ] El export declara versión de SSOT aplicada
- [ ] Cada elemento persistente en canon-diagrama tiene regla `V-*` que lo respalde
- [ ] Los recursos externos (sub-modelos, bitmaps, código) se resuelven antes de exportar o se declaran ausentes

## Antipatrones

- Usar `toDataURL()` del canvas como método único de export (incluye UI chrome)
- Exportar PNG por defecto (rasteriza información crítica)
- Omitir watermarks de resolución, o superponer watermark sobre cosas
- Mezclar canon-diagrama y canon-documento en un único archivo sin declarar perfil
- Basar la auditoría de conformidad en capturas de pantalla del canvas editable

## Referencias cruzadas

- Precedencia: `00-precedencia-autoridad.md`
- Layout y rótulos: `20-layout-visual-opd.md`
- UI que NO va al canon: `60-ui-afordances-canvas.md`
- Simulación y snapshot runtime: `50-simulacion-runtime-visual.md`
