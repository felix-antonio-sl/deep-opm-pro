# 12 — Decoraciones de extremo y marcas textuales de enlace

**Alcance**: vocabulario cerrado de decoraciones de extremo (piruletas, triángulos, flechas, rayo, arpón), marcas textuales sobre enlaces (`e`, `c`, `/`, `//`, `Pr=p`, rótulos, etiquetas de ruta). Distinción entre piruletas semánticas y handles UI.
**Capa SSOT propietaria**: `opm-visual-es.md` §1.5, §1.6, §1.8, §6
**Aplicación en la app**: `src/render/jointjs/markers.ts`, `src/render/jointjs/crear-link.ts`.

## Reglas

### R-400: Vocabulario canónico de decoraciones de extremo

- Enunciado: la capa visual reconoce un vocabulario cerrado de decoraciones de extremo de enlace:

| Decoración | Nombre (ES) | Nombre técnico (EN) | Uso |
|---|---|---|---|
| Punta de flecha cerrada | punta cerrada | arrowhead | Enlaces transformadores (consumo, resultado, efecto) |
| Círculo negro relleno | piruleta negra | black lollipop | Enlace de agente (extremo proceso) |
| Círculo blanco vacío | piruleta blanca | white lollipop | Enlace de instrumento (extremo proceso) |
| Corchete cuadrado abierto | corchete abierto | open bracket | Marcador legado/reservado; no se usa en el perfil actual de render de habilitadores |
| Línea en zigzag con punta | rayo | lightning bolt | Enlace de invocación |
| Punta de flecha abierta | punta abierta | open arrowhead | Enlaces estructurales etiquetados unidireccionales |
| Arpón (media punta) | arpón | harpoon | Enlaces estructurales etiquetados bidireccionales y recíprocos |

- Referencia SSOT: §1.5
- Aplicación en código: `markers.ts` define cada marcador SVG con path canónico y los referencia por `marker-end`/`marker-start` en los links.
- Antipatrón: introducir una decoración nueva sin regla `V-*` que la respalde.

### R-401: V-190 — Piruleta cuelga de línea visible

- Enunciado: una piruleta semántica (negra o blanca) SIEMPRE cuelga del extremo de una línea visible. Un círculo aislado sin línea visible NO se interpreta como piruleta; debe tratarse como UI, token runtime o error de render según el perfil observado.
- Referencia SSOT: V-190
- Aplicación en código: la piruleta es `sourceMarker` o `targetMarker` del link, no un shape suelto. Por FB-006/FB-007, el círculo se desplaza respecto del endpoint para que no quede cortado ni pegado al borde de la cosa.

### R-402: V-191 — Handles UI distintos de piruletas

- Enunciado: los handles de edición y puntos de anclaje UI NO pueden ser visualmente idénticos a las piruletas de §1.5 en el canon-diagrama. Si la implementación los usa en edición, DEBE distinguirlos por:
  - **color reservado a UI**
  - **posición** (fuera de la geometría del enlace)
  - **tamaño** (notablemente distinto)
- Referencia SSOT: V-191
- Aplicación en código: handles de JointJS usan azul claro o gris discontinuo, nunca negro saturado; ubicación en las esquinas del bounding box; tamaño ≤ 8 px.

### R-403: Habilitadores con source limpio y piruleta en proceso

- Enunciado: el enlace de agente y de instrumento tiene un extremo origen limpio
  y una decoración semántica junto al proceso:
  - en el extremo origen (habilitador): **sin marcador**
  - en el extremo destino (proceso): **piruleta** (negra para agente, blanca para instrumento)
- Referencia SSOT: §1.5; decisión de producto FB-005 para suprimir la marca de
  origen cuando interfiere con la lectura del source.
- Aplicación en código: `markers.ts` define `sourceMarker: { type: "none" }`
  por omisión para agente/instrumento y `targetMarker: MARKER_CIRCULO_RELLENO`
  (agente) o `MARKER_CIRCULO_HUECO` (instrumento).

### R-404: Zigzag con punta (rayo de invocación)

- Enunciado: el rayo de invocación DEBE tener **línea en zigzag CON punta**. El zigzag aislado sin punta de flecha no es conforme.
- Referencia SSOT: V-1.5 / §9.1
- Estado actual en el código: `MARKER_RAYO = "M 0 0 6 -4 4 0 10 -4"` es zigzag sin punta cerrada (deuda documentada en `docs/design/archive/auditoria-ssot-visual-2026-04-23.md` §2.5).
- Aplicación en código: extender el path del rayo para terminar en una punta cerrada, o combinar con un segundo marker.

### R-405: V-4.4 — Excepción temporal con barras oblicuas

- Enunciado: los enlaces de excepción temporal se marcan con `/` (sobretiempo) o `//` (subtiempo) sobre la línea:

| Enlace | Marca | Dispara cuando |
|---|---|---|
| Excepción por sobretiempo | `/` (una barra oblicua) | Duración real > duración máxima |
| Excepción por subtiempo | `//` (dos barras oblicuas) | Duración real < duración mínima |

- Referencia SSOT: §4.4
- Aplicación en código: texto sobre el link con fuente monoespaciada; el proceso de manejo de excepción es ambiental (contorno discontinuo).

### R-406: Marcas textuales sobre enlace

- Enunciado: el conjunto de marcas textuales sobre enlaces es:

| Marca | Significado | Posición |
|---|---|---|
| `e` | Modificador de evento — el objeto inicia el proceso | cerca del extremo del proceso |
| `c` | Modificador de condición — el proceso se omite si la precondición falla | cerca del extremo del proceso |
| `/` | Excepción por sobretiempo | sobre la línea |
| `//` | Excepción por subtiempo | sobre la línea |
| `Pr=p` | Probabilidad del enlace dentro de un abanico probabilístico | cerca del enlace |
| Texto itálico sobre el eje | Etiqueta (tag) de enlace estructural | centrada sobre la línea |
| Texto sobre enlace procedimental | Etiqueta de ruta (path label) | centrada o adyacente |

- Referencia SSOT: §1.6
- Aplicación en código: `crear-link.ts` agrega `<tspan>` o `labels` al link en posiciones canónicas.

### R-407: Tamaño y legibilidad de la marca textual

- Enunciado: las marcas textuales DEBEN ser legibles a la resolución del canon-diagrama (V-233). No se admite elipsis silenciosa ni corte (V-194).
- Referencia SSOT: V-233, V-194
- Aplicación en código: tamaño mínimo recomendado 10-12 pt; el enlace debe permitir espacio para la marca antes del marcador de extremo.

### R-408: Etiqueta estructural en itálicas

- Enunciado: la etiqueta textual de un enlace **estructural etiquetado** se renderiza en itálica (convención tipográfica OPM). El texto itálico se ubica sobre el eje del enlace.
- Referencia SSOT: §1.6, §8.1
- Aplicación en código: `text-style: italic` en el label del link estructural etiquetado.

### R-409: Etiqueta de ruta (path label)

- Enunciado: una etiqueta de ruta (path label) es texto colocado sobre un enlace procedimental que resuelve ambigüedad cuando un proceso tiene múltiples combinaciones entrada/salida.
- Referencia SSOT: §6.1
- Aplicación en código: el label de ruta va centrado sobre el enlace procedimental; el renderer respeta la etiqueta tal cual venga del modelo.

### R-410: V-20 — Regla de coincidencia de rutas

- Enunciado: al ejecutarse un proceso, se sigue la trayectoria cuya etiqueta de ruta de entrada coincide con la etiqueta de ruta de salida. Todos los enlaces de consumo/resultado con la misma etiqueta forman una trayectoria.
- Referencia SSOT: V-20
- Aplicación en código: el motor de simulación empareja rutas por string exacto de etiqueta.

### R-411: Modificadores de control son marcas, no nuevas líneas

- Enunciado: los modificadores `e` y `c` NO crean enlaces adicionales; son marcas textuales sobre enlaces transformadores o habilitadores existentes.
- Referencia SSOT: §4, V-12, V-13
- Aplicación en código: el modelo asocia `modificador?: "e" | "c" | undefined` a cada enlace transformador/habilitador; el renderer dibuja la letra al lado del extremo del proceso.

### R-412: V-12 — Evento es el segmento objeto→proceso

- Enunciado: el enlace de evento es **el segmento desde el objeto/estado hacia el proceso**. El segmento desde el proceso hacia el objeto (consumo, efecto) NO es un enlace de evento.
- Referencia SSOT: V-12
- Aplicación en código: la marca `e` solo se aplica al segmento que va hacia el proceso.

### R-413: V-13 — Evento se pierde tras evaluación

- Enunciado: un evento se pierde tras la evaluación, incluso si la precondición falla.
- Referencia SSOT: V-13, `opm-iso-19450-es.md` §8.2.1
- Aplicación en código: el motor de simulación marca el token de evento como consumido tras evaluar la precondición, haya o no éxito.

### R-414: V-192 — Supresor de enlaces no materializados

- Enunciado: el supresor de enlaces no materializados (`...` en burbuja adyacente) pertenece a la gramática auxiliar del OPD **solo** si persiste en el canon-diagrama. NO debe confundirse con menús contextuales o botones UI con la misma grafía.
- Referencia SSOT: V-192
- Aplicación en código: si un supresor se dibuja en canvas y se incluye en export, es gramática; si se elimina al exportar, es UI.

### R-415: V-193 — Triángulos compactados anclados

- Enunciado: los triángulos o indicadores estructurales compactados que representen relaciones adicionales hacia cosas ausentes DEBEN quedar anclados geométricamente a la cosa visible correspondiente. Un triángulo flotante sin anclaje visible NO es conforme en el canon-diagrama.
- Referencia SSOT: V-193
- Aplicación en código: el triángulo compactado se embebe como decoración del bounding box de la cosa anfitriona.

### R-416: Indicadores auxiliares

- Enunciado: además del supresor de enlaces no materializados, existen los siguientes indicadores auxiliares:

| Indicador | Representación | Significado |
|---|---|---|
| Colección incompleta | Barra horizontal corta bajo el triángulo | Existen refinadores no mostrados |
| Cosa duplicada | Silueta desplazada detrás del símbolo | Copia visual de la misma cosa en el mismo OPD |
| Supresión de estados | Rountangle con `...` en esquina inferior derecha del objeto | El objeto tiene más estados que los mostrados |
| Multiplicidad | Número o expresión junto al extremo del enlace | Cardinalidad de la relación |
| Supresor de enlaces no materializados | Burbuja adyacente con `...` | Existen conexiones hacia cosas no presentes en el OPD actual |

- Referencia SSOT: §1.8
- Aplicación en código: `markers.ts` expone los glifos auxiliares; el renderer los invoca cuando el modelo lo declara.

### R-417: V-61 — Anatomía formal de un enlace

- Enunciado: todo enlace consiste de tres componentes:
  - **Origen** (cosa o estado de origen)
  - **Destino** (cosa o estado de destino)
  - **Conector** (línea visible + símbolo de decoración + opcionalmente etiqueta y etiqueta de ruta)

Origen y destino son cosas enlazadas; cada una exhibe símbolo (decoración) y multiplicidad (cardinalidad).
- Referencia SSOT: V-61 (`opm-visual-es.md` §1.10)
- Aplicación en código: el tipo interno de `enlace` encapsula estos componentes.

### R-418: Código de color para decoraciones

- Enunciado: el esquema por defecto usa **negro** para enlaces procedimentales y estructurales. La variante cromática es admisible si preserva topología (V-63). Los triángulos estructurales pueden tener interiores en otros colores siempre que la topología interna sea inequívoca.
- Referencia SSOT: §1.1b, V-63
- Aplicación en código: `paleta.ts` centraliza la elección de color.
- Antipatrón: enlaces rojos como marca tácita de "transformador" (mezcla con validación).

### R-419: Separación entre marcas semánticas y runtime

- Enunciado: los tokens transitorios de flujo (V-135) que aparezcan durante simulación NO son parte de la gramática estática. No deben confundirse con piruletas, handles o puntos de anclaje.
- Referencia SSOT: V-135
- Aplicación en código: los tokens runtime se dibujan en una capa separada del SVG con z-index superior y se remueven al detener simulación.

### R-420: Separación de marcador respecto del borde de la cosa

- Enunciado: todo marcador terminal debe quedar visualmente separado del punto de intersección entre enlace y borde de cosa, excepto las puntas transformadoras de `consumo`, `resultado` y `efecto`, que permanecen en el límite del link.
- Referencia SSOT: V-190, V-234; decisión de producto FB-007.
- Aplicación en código: `markers.ts` usa geometría desplazada para piruletas, triángulos, arpones e invocación; mantiene `MARKER_FLECHA_TRANSFORMADORA` con punta en `(0,0)` para consumo/resultado/efecto y sus alias internos `entrada`/`salida`.

## Checklist

- [ ] Cada enlace tiene una sola decoración de extremo semántica (no duplicada)
- [ ] Piruletas semánticas nunca flotan sin línea
- [ ] Handles UI usan canal visual reservado (color, tamaño, posición)
- [ ] Rayo de invocación termina en punta cerrada
- [ ] Habilitadores tienen origen limpio y piruleta en destino
- [ ] Marcadores no transformadores se separan del borde; consumo/resultado/efecto quedan al límite del link
- [ ] Marcas `e` y `c` van junto al extremo del proceso
- [ ] Excepciones temporales usan `/` (over) o `//` (under)
- [ ] Etiquetas estructurales en itálica
- [ ] Etiquetas de ruta sobre enlace procedimental
- [ ] Supresores `...` persisten en canon-diagrama si son gramática
- [ ] Triángulos compactados anclados a cosa visible

## Antipatrones

- Zigzag de invocación sin punta (deuda actual)
- Piruleta de agente del mismo diámetro que handle de selección
- Enlaces condicionales dibujados con línea discontinua en lugar de marca `c`
- Usar `×` como decoración persistente para marcar enlace inválido (ver V-221, pertenece a UI transitoria)
- Etiquetas de ruta en cursiva (colisiona con etiqueta estructural)
- Token runtime persistente en canon-diagrama sin declaración de snapshot
- Reintroducir una marca `sourceMarker` en agente/instrumento sin revisar FB-005

## Referencias cruzadas

- Taxonomía de enlaces: `13-enlaces-taxonomia-familias.md`
- Estructurales fundamentales (triángulos): `14-enlaces-estructurales.md`
- Estado especificado: `15-enlaces-estado-especificado.md`
- Modificadores y operadores: `16-modificadores-operadores.md`
- Canon vs UI: `01-canon-exportacion.md`, `60-ui-afordances-canvas.md`
- Simulación runtime: `50-simulacion-runtime-visual.md`
