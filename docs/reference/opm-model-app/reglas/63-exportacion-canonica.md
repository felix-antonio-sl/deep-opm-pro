# 63 — Exportación canónica

**Alcance**: perfiles `canon-documento` y `canon-diagrama`, previsualización raster, contenido exigido, export parcial, resolución y viewport, watermarks, portabilidad de recursos.
**Capa SSOT propietaria**: `opm-visual-es.md` §25; V-0..V-0e
**Aplicación en la app**: pipeline de export SVG/PDF, empaquetador de canon-documento.

## Reglas

### R-2700: V-225 — Tres familias de salida

- Enunciado: esta adaptación reconoce tres familias de salida:
  - **canon-documento**: artefacto documental completo por modelo
  - **canon-diagrama**: artefacto por OPD, preferentemente vectorial
  - **previsualización raster**: artefacto no canónico para compatibilidad o miniatura
- Referencia SSOT: V-225
- Aplicación en código: el exportador expone los tres modos.

### R-2701: V-226 — Perfil por defecto declarado

- Enunciado: toda implementación conforme DEBE declarar un perfil por defecto para canon-documento y otro para canon-diagrama. La ausencia de perfil declarado invalida la aplicación operativa de V-0.
- Referencia SSOT: V-226
- Aplicación en código: ADR declara los defaults (ej. SVG 1.1 para canon-diagrama; PDF multi-página para canon-documento).

### R-2702: V-227 — Canon-diagrama preserva gramática visible

- Enunciado: el canon-diagrama DEBE preservar la gramática visible del OPD, preferentemente en formato vectorial. NO debe incluir:
  - handles
  - grid
  - overlays modales
  - toasts
  - chrome de edición
- Referencia SSOT: V-227
- Aplicación en código: pipeline de export filtra capas UI.

### R-2703: V-228 — Rótulos en negro por defecto

- Enunciado: en el canon-diagrama los rótulos dentro del grafo permanecen en **negro por defecto**, salvo que la SSOT promueva expresamente otro comportamiento. El cromatismo de clase se preserva primariamente en bordes, líneas y decoraciones semánticas.
- Referencia SSOT: V-228
- Aplicación en código: paleta canon-diagrama fuerza texto negro.

### R-2704: V-229 — Composición del canon-documento

- Enunciado: el canon-documento PUEDE incluir:
  - Portada
  - URL / ID persistente del modelo
  - Índice
  - Árbol de OPDs / Mapa del Sistema
  - Diagramas (canon-diagrama por OPD)
  - OPL
  - Diccionario de elementos
  - Diccionario de relaciones
  - Vistas derivadas

Su estructura exacta DEBE declararse por perfil.

- Referencia SSOT: V-229
- Aplicación en código: plantilla configurable.

### R-2705: V-230 — Listados textuales con cromatismo de clase

- Enunciado: los listados textuales del canon-documento PUEDEN extender el cromatismo de clase a nombres fuera del grafo, siempre que el perfil lo declare y NO contradiga el canon-diagrama.
- Referencia SSOT: V-230
- Aplicación en código: opción `listaConColor: boolean` por perfil.

### R-2706: V-231 — Export parcial declarado

- Enunciado: si el export omite OPDs, sub-modelos o vistas derivadas, el artefacto DEBE declararse como **export parcial** e identificar explícitamente el subconjunto incluido.
- Referencia SSOT: V-231
- Aplicación en código: metadato `"parcial": true, "incluye": [...]`.

### R-2707: V-232 — Descripciones con referencia recuperable

- Enunciado: el canon-documento puede incluir descripciones de entidades, tooltips computacionales, requirement views u otros anexos. Si los omite, DEBE mantener una referencia recuperable cuando formen parte del modelo.
- Referencia SSOT: V-232
- Aplicación en código: URI/hash persistente para recursos omitidos.

### R-2708: V-233 — Canon-diagrama no depende de rasterización

- Enunciado: el canon-diagrama NO debe depender de rasterización para conservar sus distinciones esenciales. Si un perfil documental rasteriza los OPDs, DEBE declarar resolución mínima suficiente para preservar dash, contornos, triángulos y rótulos.
- Referencia SSOT: V-233
- Aplicación en código: SVG por defecto; PDF puede rasterizar pero con DPI declarado.

### R-2709: V-234 — No recortar símbolos

- Enunciado: ningún export canónico DEBE recortar símbolos de forma que pierdan su anclaje topológico o su objeto contenedor.
- Referencia SSOT: V-234
- Aplicación en código: viewport computa bounding box completo antes de exportar.

### R-2710: V-199 — Auto-ajuste de viewport

- Enunciado: la implementación DEBE auto-ajustar el viewport al exportar para evitar símbolos huérfanos recortados por el borde del artefacto.
- Referencia SSOT: V-199
- Aplicación en código: pre-export recalcula `viewBox`.

### R-2711: V-235 — Watermarks sin ocluir

- Enunciado: marcas de agua, etiquetas de confidencialidad u overlays editoriales son admisibles solo como **capa documental adicional**. NO pueden ocluir primitivas OPM ni confundirse con gramática del diagrama.
- Referencia SSOT: V-235
- Aplicación en código: watermarks con opacidad controlada, sin intersectar bounding boxes.

### R-2712: V-236 — Portabilidad de recursos

- Enunciado: si el modelo depende de bitmaps, sub-modelos, descripciones externas o código adjunto, el export canónico DEBE:
  - embutir esos recursos, **o**
  - referenciarlos persistentemente, **o**
  - declarar explícitamente su ausencia
- Referencia SSOT: V-236
- Aplicación en código: resolver recursos antes de export; si no, declarar ausencia.

### R-2713: V-141 — Snapshot de runtime declarado

- Enunciado: todo export que pretenda representar un estado de simulación DEBE declararlo explícitamente como snapshot de runtime. Si NO existe esa declaración, el artefacto se interpreta como canon-diagrama estático.
- Referencia SSOT: V-141
- Aplicación en código: metadato `"tipo": "snapshot_runtime"` cuando aplica.

### R-2714: V-217 — Normalización de estilado autoral

- Enunciado: salvo declaración contraria del perfil, el canon-documento y canon-diagrama DEBEN normalizar el estilado autoral hacia el esquema canónico de la SSOT. El estilado autoral se conserva como capa editable del canvas, NO como condición de conformidad del artefacto exportado.
- Referencia SSOT: V-217
- Aplicación en código: flag `preservarEstilado: boolean`.

### R-2715: V-196 — Grid suprimido en canon

- Enunciado: la grid del canvas es decoración opcional de edición. NO pertenece al modelo OPM y DEBE suprimirse en exportaciones canónicas.
- Referencia SSOT: V-196
- Aplicación en código: exportador remueve grid.

### R-2716: Metadato de identidad persistente

- Enunciado: cada OPD exportado DEBE incluir su **identificador persistente** (V-248) en metadato, no solo `SDx.y`.
- Referencia SSOT: V-248, V-249
- Aplicación en código: SVG con atributo `data-opd-id="<UUID>"` o equivalente.

### R-2717: Metadato de versión SSOT

- Enunciado: el export DEBERÍA declarar la versión de SSOT contra la cual fue producido (ej. `2.3.0-ampliada.3`).
- Referencia SSOT: V-226 (implícito)
- Aplicación en código: leer de `ssot.lock` al exportar.

### R-2718: Modelos compuestos declaran sub-modelos

- Enunciado: todo export canónico de un modelo compuesto DEBE declarar si incluye o no los sub-modelos NO cargados y cómo se resuelven las referencias externas (V-187).
- Referencia SSOT: V-187
- Aplicación en código: metadato `"subModelos": [{uri, incluido: boolean}]`.

### R-2719: Portabilidad sin convenciones implícitas

- Enunciado: un modelo compuesto NO puede considerarse portable si la resolución de sus sub-modelos depende de convenciones implícitas de filesystem o sesión. El esquema de resolución DEBE ser parte del formato de intercambio o del manifiesto (V-188).
- Referencia SSOT: V-188
- Aplicación en código: manifiesto con URIs, no paths.

### R-2720: Export como instantánea publicable

- Enunciado: las exportaciones DEBEN tratarse como **instantáneas publicables**, NO como fuente de verdad del modelo.
- Referencia SSOT: `metodologia-opm-es.md` §8.8
- Aplicación en código: el modelo vivo es el estado persistido, no el export.

### R-2721: V-0 reiterada — canon determina conformidad

- Enunciado: la gramática visual OPM conforme es la que persiste en un export canónico declarado. Todo elemento visible en canvas que no persiste en ningún export canónico se clasifica como afordance UI, no como gramática OPM.
- Referencia SSOT: V-0
- Aplicación en código: auditoría de conformidad se basa en el export, no en el canvas.

### R-2722: Formatos recomendados

- Enunciado (recomendaciones del proyecto, no de la SSOT):
  - canon-diagrama por defecto: **SVG 1.1**
  - canon-documento por defecto: **PDF** multi-página (con SVG embedded o rasterizado a ≥ 300 DPI)
  - preview raster: **PNG** 2x resolución viewport
- Referencia SSOT: V-233 (principios); decisión local documentada en ADR.
- Aplicación en código: formatos configurables.

### R-2723: Export y navegación

- Enunciado: el canon-documento DEBERÍA incluir **navegación hipervínculo** entre OPDs (hacia padres, hijos, hermanos), referenciando por identificador persistente.
- Referencia SSOT: V-229, V-249
- Aplicación en código: PDF con anchors y vínculos intra-documento.

### R-2724: Export debe ser idempotente

- Enunciado: exportar dos veces el mismo modelo al mismo perfil DEBE producir artefactos equivalentes (salvo timestamp y metadato de versión).
- Referencia SSOT: invariante operativo
- Aplicación en código: tests de idempotencia de export.

### R-2725: Integridad del rótulo en export

- Enunciado: el canon-diagrama NO admite truncamiento silencioso del rótulo (V-212). Si el rótulo no cabe, la herramienta DEBE expandir, reubicar o rechazar antes de exportar elipsis no declarada.
- Referencia SSOT: V-212, V-194
- Aplicación en código: pre-export verifica integridad de rótulos.

## Checklist

- [ ] Dos perfiles obligatorios: canon-diagrama y canon-documento
- [ ] Perfil por defecto declarado en ADR
- [ ] Canon-diagrama vectorial por defecto
- [ ] Sin handles, grid, modales, toasts, chrome en canon
- [ ] Rótulos en negro por defecto
- [ ] Canon-documento incluye índice, árbol, OPL, diccionarios
- [ ] Export parcial declarado explícitamente
- [ ] Recursos omitidos con referencia recuperable
- [ ] Canon-diagrama no depende de rasterización
- [ ] Sin recorte de símbolos por borde
- [ ] Auto-viewport antes de exportar
- [ ] Watermarks sin ocluir
- [ ] Recursos embebidos / referenciados / ausencia declarada
- [ ] Snapshot de runtime declarado cuando aplica
- [ ] Estilado autoral normalizado por defecto
- [ ] Identificador persistente de OPD en metadato
- [ ] Versión SSOT en metadato
- [ ] Sub-modelos declarados en manifiesto
- [ ] Export es idempotente
- [ ] Rótulos íntegros sin elipsis silenciosa

## Antipatrones

- Export PNG como canon-diagrama (pierde vectorialidad)
- Grid visible en SVG exportado
- Símbolos cortados por borde del artefacto
- Watermark oclusivo sobre una cosa OPM
- Referencia a bitmap por path relativo sin resolución
- Sub-modelos implícitos por filesystem
- Snapshot de simulación sin declaración
- Rótulo truncado con elipsis en canon
- Export sin versión SSOT ni ID persistente del OPD

## Referencias cruzadas

- Canon: `01-canon-exportacion.md`
- Layout y rótulo: `20-layout-visual-opd.md`
- UI omitida en canon: `60-ui-afordances-canvas.md`
- Estilado autoral y normalización: `61-estilado-autoral.md`
- Simulación y snapshot: `50-simulacion-runtime-visual.md`
- Navegación e identidad: `40-navegacion-arbol-identidad.md`
- Sub-modelos y portabilidad: `42-sub-modelos-inter-modelo.md`
