# JOYAS Y DESCUBRIMIENTOS — inmersion profunda en OPCloud

Informe generado el 2026-04-28 a partir del cruce de:
- `decompiled/` — 808 modulos webpack de `opcloud.systems` (produccion)
- `fixtures/` — extraccion runtime de `opcloud-sandbox.web.app` (demo, organizada por modelo)
- `assets/svg/` + `assets/png/` — 84 assets del CDN publico
- `config/` — firebase.json, routes.json, edx.config.json

Nota operativa: `decompiled/` fue insumo de este informe, pero no se conserva
por defecto en el workspace liviano; se regenera con `bash setup.sh` si hace
falta volver a inspeccionarlo.

---

## 1. Sistema de colores canonico

Extraido del codigo (`1185.js` — `opmStyle`) y confirmado en el DOM del sandbox:

| Token | Color | Uso | Confirmado en |
|-------|-------|-----|---------------|
| `#70E483` | Verde lima | Stroke de Object (rect) | Sandbox DOM: `stroke="#70E483"` |
| `#3BC3FF` | Cyan | Stroke de Process (ellipse) | Codigo |
| `#586D8C` | Azul grisaceo | Stroke de links, triangulos, markers | Sandbox DOM: `stroke="#586D8C"` |
| `#fdffff` | Blanco roto | Fill de Object/Process | Sandbox DOM: `fill="#fdffff"` |
| `transparent` | — | Wrapper de link (hit area) | Sandbox DOM |
| `#000002` | Negro casi puro | Texto de labels | Sandbox DOM |

Paleta de inspector (estilos de fuente, background de UI):
```
#feb663 #fe854f #b75d32  (naranjas)
#31d0c6 #7c68fc #61549C  (cyan/violetas)
#6a6c8a #4b4a67 #3c4260 #33334e #222138  (grises azulados)
#DCDCDC #006400 #00008B  (plata, verde oscuro, azul marino)
black grey #CC0A0E #FFFC7F #fff7d1 #f2f2f2 #d6d6d6
#ffffff #fff #78A8F1 #0070c0 #00b050 #808000 #1a3763
```

---

## 2. Dimensiones canonicas

| Parametro | Valor | Fuente |
|-----------|-------|--------|
| Object width | **135 px** | `64633.js`: `width: 135` + sandbox DOM |
| Object height | **60 px** | `64633.js`: `height: 60` + sandbox DOM |
| Process width | **135 px** | Mismo que Object (ellipse) |
| Process height | **60 px** | Mismo que Object (ellipse) |
| Link visible stroke-width | **2 px** | Sandbox DOM |
| Link wrapper stroke-width | **15 px** | Sandbox DOM (hit area) |
| Triangle marker SVG | **30×30 px** | Codigo: `getTriangleSVG()` |

---

## 3. Sistema de tipografia

Extraido del codigo (`72081.js` — text rendering):

```js
getParagraphWidthByParams(text, fontSize, fontWeight, fontFamily)
getParagraphHeightByParams(text, fontSize, fontWeight, fontFamily)
refactorText(textString, cell, cell.get("size").width)
```

Valores observados en sandbox DOM:
- `font-family: Arial`
- `font-size: 14px`
- `font-weight: 600` (semibold)
- `text-anchor: middle`
- `y: 0.8em` (alineacion vertical)
- Transform: `matrix(1,0,0,1, X, Y)` — X centrado al width, Y ~0.4 * height

Algoritmo de escalado de caja de texto:
```js
heightTextAndStates = getParagraphHeight(text, cell) + 20 + padding
widthTextAndStates = getParagraphWidth(text, cell) + 20 + padding
// Si el texto no cabe, se reduce y reflow
```

---

## 4. Arquitectura de enlaces — el patron wrapper+line

Cada enlace tiene **dos paths superpuestos**:

| Path | joint-selector | Stroke | stroke-width | Proposito |
|------|---------------|--------|-------------|-----------|
| `wrapper` | wrapper | `transparent` | **15 px** | Hit area invisible para click facil |
| `line` | line | `#586D8C` | **2 px** | Linea visible |

Ejemplo del sandbox:
```
wrapper: M 457.5 183.33 L 581.5 184.28  stroke=transparent  sw=15
line:    M 457.5 183.33 L 581.5 184.28  stroke=#586D8C      sw=2
```

---

## 5. Sistema de markers de enlaces

Swallowtail marker (cola de golondrina para consumption/effect):
```svg
<path d="M0,9 L23,17 L12,9 L23,1 L0,9" 
      fill="white" stroke="${lineColor}" stroke-width="2"/>
```
Dimension: 23×17 px, centrado en Y=9.

Circle marker (agente — circulo relleno): renderizado como `<image>` con href a `agent.svg`.

**Markers son DINAMICOS**: cada enlace genera su propio marker unico en `<defs>` con ID unico
(`#v-3937177351`, `#v-2-1447209640`). NO se comparten entre enlaces del mismo tipo.

---

## 6. Algoritmo de routing

Extraido del codigo (`67888.js` — `OpmAggregationLink`):

```js
const router = {
  name: "manhattan",
  padding: 5,
  step: 11,
  isPointObstacle: isPointObstacle  // funcion custom
};
```

- **Manhattan routing**: solo giros ortogonales (90°)
- **padding: 5**: distancia minima a obstaculos
- **step: 11**: tamano de paso de la grilla
- **isPointObstacle custom**: excluye enlaces del filtro de obstaculos

La clase `OpmDefaultLink` (55422.js) maneja:
- `sourceAnchor` / `targetAnchor`: anclaje a puertos
- `Boundary tool`: herramienta para ajustar punto de conexion
- `getSourcePoint()` / `getTargetPoint()`: puntos de inicio/fin

---

## 7. Sistema de puertos (ports)

Cada Thing tiene **multiples puertos** como circulos invisibles:
```xml
<circle fill="transparent" magnet="true" r="2" stroke="transparent" 
        port="UUID" port-group="aaa" class="joint-port-body"/>
```

- **port-group: "aaa"**: grupo de puertos estandar
- **magnet: true**: atrae conexiones de enlaces
- **r: 2**: radio de 2px (invisible, solo funcional)
- Cada puerto tiene un **UUID unico**

Los puertos se distribuyen alrededor del perimetro del elemento.

---

## 8. Drop shadow

Extraido del codigo (`28258.js`):

```js
dropShadow: function(args) {
  "SVGFEDropShadowElement" in window ?
    "<filter><feDropShadow stdDeviation=\"${blur}\" dx=\"${dx}\" dy=\"${dy}\" 
     flood-color=\"${color}\" flood-opacity=\"${opacity}\"/></filter>"
    : "<filter><feGaussianBlur in=\"SourceAlpha\" stdDeviation=\"${blur}\"/>
       <feOffset dx=\"${dx}\" dy=\"${dy}\" result=\"offsetblur\"/>
       <feFlood flood-color=\"${color}\"/>
       <feComposite in2=\"offsetblur\" operator=\"in\"/>
       <feComponentTransfer><feFuncA type=\"linear\" slope=\"${opacity}\"/>
       </feComponentTransfer>...</filter>"
}
```

Aplicado via atributo `filter` en el `<rect>` del Object: `url(#dropShadowv-3-1352970975)`.

---

## 9. OPL — generacion de lenguaje natural

Modulo clave: `38452.js` (`_opl_generation_opl_functions`)

**Templates de frases**:
```
"<tag> exhibits <body>."
"<P> occurs if <O> is at state <s>, in which case <P> changes <s> <O>, 
 otherwise <P> is skipped."
"<s> <O> initiates <P>, which changes <s> <O>."
```

**Sustituciones de verbos para estados**:
- `consumes` → `changes`
- `yields` → `changes`

**Funciones del motor OPL**:
- `generateLinksWithOpl(link)`: genera OPL para un enlace
- `generateLinksWithOplByElements(source, target)`: genera por elementos
- `getStatefulObject(cell)`: obtiene objeto con estados
- `addRange(val)`: agrega rango a valor
- `extractAndDelete(text, delimiters)`: extrae texto entre delimitadores
- `addPlural(text)`: pluraliza texto
- `sortByY(cells)` / `sortByX(cells)`: ordenamiento
- `AddPath(path, template)`: agrega path a template

**Formato de duracion**:
```
"${min}, ${nominal}, and ${max}${suf} Minimal Duration, 
 Expected Duration, and Maximal Duration, respectively"
```

---

## 10. Sistema de estados (State)

- **Tipos**: `defaultState`, `currentState`, `rangeState`
- **Renderizado**: Los estados se incrustan **dentro** del Object padre
- **Dimensiones**: `statesWidthPadding`, `statesHeightPadding` — se restan del espacio de texto
- **Layout**: posicionados en la parte inferior del rectangulo del Object
- **Comandos**: `AddStateCommand`, `DestateCommand`, `SetStateTimeDurationCommand`
- **Validaciones**: `ObjectCannotBeConnectedToItsStates`, `StateCannotConnectToFather`
- **OpmEllipsis**: elemento especial para estados colapsados (2 en meta-modelo SD)

---

## 11. Sistema de in-zoom / refinamiento

Dos tipos de refinamiento:
1. **inZoomed** (in-zoom): `model.inzoomSplit(visualLink)`
2. **structural refinement** (unfolding clasico): `model.structuralSplit(visualLink, fatherType)`

Cada elemento visual tiene atributos:
- `refineable`: elemento que refina a este
- `refineeInzooming`: refinado via in-zoom
- `refineeUnfolding`: refinado via unfolding

---

## 12. Enumeracion completa de tipos de enlace

```
linkType.Agent
linkType.Instrument
linkType.Consumption
linkType.Effect
linkType.Result
linkType.Invocation
linkType.SelfInvocation
linkType.Exhibition
linkType.Aggregation
linkType.Generalization
linkType.Classification
linkType.TaggedLink
linkType.Unidirectional
linkType.Bidirectional
linkType.OvertimeException
linkType.UndertimeException
```

---

## 13. Triangulo agregador

- **Clase**: `TriangleClass extends joint.shapes.devs.Model`
- **Renderizado**: como `<image>` con href a SVG externo
- **Geometria** (`getTriangleSVG()`):
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30">
  <path fill="#000" stroke="${color}" stroke-width="2" d="M2.5,2.5"/>
  <path fill="${color}" stroke="${color}" stroke-width="2"
        d="M2.49,24.98 L15.33,0.76 L28.16,24.98 L2.49,24.98 z"/>
</svg>
```
Triangulo isosceles: base 25.67px en Y=24.98, vertice en X=15.33, Y=0.76. Color: `#586D8C`.

- **Conexiones**: `OpmAggregationLink` crea triangulo + N enlaces salientes
- **En el meta-modelo OPM**: 26 TriangleAgg en SD, variando segun OPD

---

## Resumen de joyas por valor

| Nivel | Joya | Impacto |
|-------|------|---------|
| **Critico** | Patron wrapper+line para hit area de enlaces (15px invisible) | Explica selectividad |
| **Critico** | Router manhattan `padding:5 step:11 isPointObstacle` | Secreto del routing |
| **Critico** | Sistema de puertos `port-group:aaa` con magnetismo | Anclaje de enlaces |
| **Critico** | `getParagraphWidth/Height` con `refactorText` | Escalado de texto |
| **Alto** | Paleta de colores completa (28 colores) | Canon visual |
| **Alto** | Markers dinamicos por enlace (no compartidos) | Arrowheads |
| **Alto** | OPL template engine con sustitucion de verbos | Lenguaje natural |
| **Alto** | Drop shadow con feDropShadow + fallback | Parametros de sombra |
| **Medio** | 16 tipos de enlace enumerados | Taxonomia OPM |
| **Medio** | In-zoom vs structural refinement (dos tipos) | Refinamiento |
| **Medio** | State embedding dentro de Object | Layout de estados |
| **Medio** | OpmEllipsis para estados colapsados | Edge case visual |

---

Fuentes:
- `decompiled/` — 808 modulos de `opcloud.systems`
- `fixtures/` — 6 modelos del sandbox con 10 OPDs
- `assets/svg/` + `assets/png/` — 84 assets del CDN
- `config/` — firebase.json, routes.json, edx.config.json
