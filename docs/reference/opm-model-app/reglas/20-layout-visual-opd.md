# 20 — Layout y composición visual del OPD

**Alcance**: límites de complejidad, oclusión, minimización de cruces, rotulado dentro del bounding box, grid/snap/smart-guides, auto-viewport, corridor para rótulos del refinable, colisión etiqueta↔objeto.
**Capa SSOT propietaria**: `opm-visual-es.md` §16.1, §16.2, §16.4, §22
**Aplicación en la app**: `src/render/layout/index.ts` + passes, `src/render/jointjs/pass-cosas.ts`.

## Reglas

### R-900: V-50 — Máximo 20-25 cosas por OPD

- Enunciado: la legibilidad visual de un OPD exige **no más de 20-25 cosas por contexto** (aproximadamente una página o pantalla utilizable).
- Referencia SSOT: V-50
- Aplicación en código: el validador emite warning `MEDIA` cuando un OPD supera 25 cosas visibles (excluyendo estados y triángulos).
- Política metodológica asociada: ver `82-metodologia-complejidad-gobernanza.md`.

### R-901: V-51 — Sin oclusión, minimizar cruces

- Enunciado: NO debe haber oclusión entre cosas. Los enlaces NO deben atravesar áreas ocupadas por cosas. Minimizar cruces.
- Referencia SSOT: V-51
- Aplicación en código:
  - `pass-zonas-externos.ts` separa cosas externas en anillo concéntrico
  - `crear-link.ts` usa router `manhattan` compacto con obstáculos
    explícitos de cosas/estados/triángulos agregadores (`padding=5`,
    `step=11`) y excluye links del filtro de obstáculos para permitir
    cruces enlace×enlace sin atravesar cosas
  - dagre minimiza cruces
- Estado actual: deuda residual en OPDs profundos: la minimización global
  de cruces sigue siendo heurística, pero la no-oclusión cosa↔enlace queda
  priorizada por routing.

### R-902: V-52 — Un elemento puede aparecer en cualquier número de OPDs

- Enunciado: cualquier elemento del modelo puede aparecer en cualquier número de OPDs. Solo deben incluirse los elementos necesarios para el aspecto que se muestra.
- Referencia SSOT: V-52
- Aplicación en código: `src/nucleo/` mantiene existencia única; `src/persistencia/` registra apariencias por OPD.

### R-903: V-194 — Rótulo íntegro en canon

- Enunciado: el rótulo visible de una cosa DEBE permanecer **íntegro** en el canon-diagrama. NO se admite truncamiento con elipsis ni corte silencioso del nombre.
- Referencia SSOT: V-194
- Aplicación en código: el renderer rechaza truncamiento; si el rótulo no cabe, agrandar el bounding box o ajustar tipografía, nunca truncar.

### R-904: V-195 — Rótulo dentro del bounding box

- Enunciado: el rótulo DEBE permanecer inscrito dentro del bounding box visible de la cosa, salvo estilos explícitamente tipificados por la implementación y documentados como variante no por defecto.
- Referencia SSOT: V-195
- Aplicación en código: `pass-cosas.ts` calcula tamaño mínimo de cosa para contener el rótulo; si el rótulo excede, el layout crece o declara variante de excepción.

### R-905: V-47 — Unicidad nominal a nivel de modelo

- Enunciado: la unicidad nominal se evalúa a nivel de modelo, pero toda apariencia visual DEBE renderizarse sin ambigüedad respecto de la cosa a la que refiere.
- Referencia SSOT: V-47
- Aplicación en código: validador global verifica unicidad de nombres; apariencias duplicadas visuales se indican con silueta desplazada (§1.8).

### R-906: V-121 — Nombre de proceso hereda política léxica

- Enunciado: la convención léxica concreta del nombre del proceso se hereda de la capa textual activa del corpus; la capa visual NO introduce una política paralela.
- Referencia SSOT: V-121
- Aplicación en código: validación de nombre de proceso vive en la capa OPL (ver `70-opl-convenciones-y-plantillas-cosa-estado.md`).

### R-907: V-122 — Alias decorativo entre paréntesis

- Enunciado: una cosa PUEDE mostrar un alias breve junto al nombre entre paréntesis (ej. `Sistema de Turborreactor (str)`). Las llaves `{alias}` se reservan exclusivamente al binding computacional regulado por §20 (ver `53-capa-computacional.md`).
- Referencia SSOT: V-122
- Aplicación en código: distinguir campos `aliasDecorativo` y `aliasComputacional` en el modelo.

### R-908: V-49 — Consumido desaparece al inicio

- Enunciado: el objeto consumido desaparece al inicio del proceso, no al final.
- Referencia SSOT: V-49
- Aplicación en código: la animación visual del consumo ocurre al inicio del subproceso.

### R-909: V-196 — Grid como decoración opcional

- Enunciado: la grid del canvas es decoración opcional de edición. NO pertenece al modelo OPM y DEBE suprimirse en exportaciones canónicas.
- Referencia SSOT: V-196
- Aplicación en código: el grid se dibuja en capa separada del DOM y se elimina en el export.

### R-910: V-197 — Snap transparente al modelo

- Enunciado: el snap a grid es transparente al modelo. Dos OPDs con idéntica topología y diferencias de posicionamiento explicables solo por cuantización a grid se consideran visualmente equivalentes.
- Referencia SSOT: V-197
- Aplicación en código: los tests de snapshot toleran desvíos de posición ≤ tamaño de celda de snap.

### R-911: V-198 — Smart-guides en canal reservado

- Enunciado: si la implementación ofrece smart-guides o líneas temporales de alineación, DEBE usar un canal visual reservado a UI. NO puede reutilizar sin distinción el patrón discontinuo reservado a afiliación ambiental.
- Referencia SSOT: V-198
- Aplicación en código: smart-guides con color distintivo (ej. cyan) y opacidad baja; nunca patrón dashed igual al de ambiental.

### R-912: V-199 — Auto-ajuste de viewport al exportar

- Enunciado: la implementación DEBE auto-ajustar el viewport al exportar para evitar símbolos huérfanos recortados por el borde del artefacto.
- Referencia SSOT: V-199
- Aplicación en código: pre-export computar bounding box del OPD + margen; fijar `viewBox` del SVG.

### R-913: Corridor sin enlaces en franja de rótulo

- Enunciado: cuando un proceso refinable se agranda para contener subprocesos, la franja superior (donde va el rótulo del refinable) DEBE reservar un **corridor sin enlaces** para que el rótulo permanezca legible.
- Referencia SSOT: V-51, V-195 (combinadas)
- Aplicación en código: `pass-refinable-envelope.ts` reserva una banda superior para el rótulo; el routing de links la evita.
- Estado actual: deuda declarada (ver `docs/design/archive/auditoria-ssot-visual-2026-04-23.md` §2.9).

### R-914: Separación horizontal proporcional al rótulo

- Enunciado: en `pass-zonas-externos`, la separación horizontal entre elementos DEBE ser proporcional al largo del rótulo más ancho de la zona, para evitar colisiones por truncamiento visual.
- Referencia SSOT: V-195, V-51
- Aplicación en código: `pass-zonas-externos.ts` calcula ancho máximo de rótulo y ajusta separación.

### R-915: Label routing en tagged-links

- Enunciado: el label de un tagged-link (etiqueta estructural) DEBE colocarse en el midpoint del enlace con detección de colisión contra bounding boxes de otras cosas. Si hay colisión, recalcular posición.
- Referencia SSOT: V-51, V-195
- Aplicación en código: `crear-link.ts` aplica label-placement con test de colisión.
- Estado actual: caso más severo observado — etiqueta `communicates via` en driver-rescuing colisiona con GPS y OnStar Advisor.

### R-916: Orden vertical de subprocesos respeta fixture

- Enunciado: cuando el fixture declara Y explícita para subprocesos, el layout DEBE respetarla o usarla como tiebreaker para dagre. NO inferir orden solo de enlaces internos.
- Referencia SSOT: V-35, V-55 (implícito)
- Aplicación en código: agregar pass `pass-orden-vertical-fixture` (deuda documentada).
- Ver: `21-tiempo-paralelismo-orden.md`.

### R-917: Agrupamiento de agregadores externos

- Enunciado: en `pass-zonas-externos`, los agregadores externos DEBEN agruparse con sus partes en sub-cluster contiguo para reducir cruces.
- Referencia SSOT: V-51
- Aplicación en código: agrupamiento por cadena estructural antes de dagre global.

### R-918: Penalización de cruces externo × envelope

- Enunciado: el costo dagre DEBE penalizar cruces entre enlaces de externos y el contorno del envelope del refinable.
- Referencia SSOT: V-51
- Aplicación en código: configurar `weight` en dagre para estos cruces.

### R-919: Envelope proporcional al contenido

- Enunciado: `pass-refinable-envelope.ts` DEBE calcular el bounding box del envelope ajustado al contenido **real**, evitando envelopes desproporcionadamente grandes que dejen espacio vacío.
- Referencia SSOT: V-51
- Aplicación en código: recalcular envelope post-layout de subprocesos; no basarse en tamaños fijos.
- Estado actual: SD1.1.1 de ev-ams muestra envelope desproporcionado (deuda crítica).

### R-920: V-63 — Colores como información, no normativo

- Enunciado: los colores son informativos, no normativos. La semántica se fija por forma, contorno y sombreado.
- Referencia SSOT: V-63
- Aplicación en código: paleta alternativa admisible; NO depender del color para distinguir clases semánticas.

### R-921: Densidad de enlaces

- Enunciado: minimizar el número de enlaces y cruces de enlaces en cada OPD es invariante metodológico.
- Referencia SSOT: `metodologia-opm-es.md` §15, V-51
- Aplicación en código: optimización global de routing; considerar semi-plegado (`34-semi-plegado.md`) para reducir densidad.

### R-922: Política de canvas limpio

- Enunciado: en ausencia de declaración contraria, la adaptación adopta la **política de canvas limpio**: la validación NO deja marcas persistentes sobre el OPD estático una vez cerrado el diálogo o panel de validación.
- Referencia SSOT: V-219
- Aplicación en código: los hallazgos de validación viven en vistas auxiliares, no en el OPD.
- Ver: `62-validacion-marcas-error.md`.

### R-923: Direcciones canónicas rankdir

- Enunciado: dagre se configura con `rankdir = TB` (top-bottom) para descomposición de proceso, consistente con V-35 / V-55.
- Referencia SSOT: V-35, V-55
- Aplicación en código: `pass-dagre-internos.ts` fija `rankdir: "TB"` para contenedores de proceso; otros tipos de diagrama pueden usar `LR` si se justifica.

### R-924: Anclajes cardinales de enlaces

- Enunciado: los enlaces deben intersectar las cosas en el punto cardinal más cercano de su borde: 12h, 3h, 6h o 9h. Si varios enlaces comparten la misma cosa y el mismo lado cardinal, sus anclajes se distribuyen de forma contigua alrededor del punto cardinal, no en posiciones arbitrarias del borde.
- Referencia SSOT: V-51, V-61; decisión de producto FB-009.
- Aplicación en código: `pass-enlaces.ts` agrupa endpoints por `(cosa, lado)` y asigna offsets contiguos; `crear-link.ts` materializa esos puntos con anchors JointJS `top/right/bottom/left` y `connectionPoint: boundary`.

### R-925: Distancia mínima antes del primer quiebre ortogonal

- Enunciado: el primer quiebre de 90 grados de un enlace no debe ocurrir a menos de ~1 cm del punto de intersección con source o target.
- Referencia SSOT: V-51; decisión de producto FB-008.
- Aplicación en código: `crear-link.ts` inserta stubs exteriores de 38 px
  derivados del ancla cardinal y configura `manhattan` con
  `startDirections/endDirections` cardinales para preservar un tramo recto
  antes del primer quiebre. Los segmentos sintetizados por
  `OpmTriangleAgg` pasan por el mismo factory y conservan esta regla.

### R-926: Cruces sin marcas no semánticas

- Enunciado: un cruce entre enlaces no debe introducir arcos, puentes, corchetes o gaps persistentes que puedan confundirse con gramática OPM.
- Referencia SSOT: V-0b, V-51, V-227; decisión de producto 2026-04-27 posterior a FB-006..009.
- Aplicación en código: `crear-link.ts` usa connector JointJS `straight` sobre rutas `manhattan`; se evita `jumpover` porque dibuja arcos link-link no semánticos en OPDs densos.

### R-928: Hit-area de enlace garantiza selectividad

- Enunciado: cada enlace renderizado DEBE exponer un área de selección
  significativamente mayor a su trazo visible para garantizar que el
  usuario pueda seleccionarlo con precisión razonable, aún cuando varios
  enlaces converjan o se crucen en regiones densas.
- Referencia SSOT: V-219 (afordances UI), decisión FB-013.
- Aplicación en código: `crear-link.ts` sobrescribe explícitamente el
  selector `wrapper` de `joint.shapes.standard.Link` con
  `stroke: transparent` y `stroke-width: 15`; el wrapper sigue la conexión
  y captura los pointer events sin alterar el trazo visible.
  Los segmentos sintetizados hacia/desde `OpmTriangleAgg` reutilizan el
  mismo factory; si en el futuro se introduce una sub-clase del link, debe
  replicar el patrón wrapper/line para no perder esta garantía.

### R-927: Márgenes de OPD

- Enunciado: los OPDs DEBEN tener márgenes exteriores que contengan todo el contenido semántico. No se admite layout "al borde del canvas".
- Referencia SSOT: V-199 implícita
- Aplicación en código: margen mínimo recomendado 20 px en cada lado del bounding box del contenido.

## Checklist

- [ ] Un OPD tiene ≤ 20-25 cosas visibles
- [ ] No hay oclusión entre cosas
- [ ] Enlaces no atraviesan bounding boxes de cosas
- [ ] Rótulos íntegros, sin elipsis ni truncamiento
- [ ] Rótulos dentro del bounding box (salvo variante declarada)
- [ ] Unicidad nominal global
- [ ] Grid se suprime en canon-diagrama
- [ ] Auto-viewport en export
- [ ] Smart-guides con color reservado (no discontinuo semántico)
- [ ] Corridor sin enlaces en franja de rótulo del refinable
- [ ] Label routing de tagged-links evita colisión con objetos
- [ ] Endpoints de enlaces usan anclajes cardinales 12h/3h/6h/9h
- [ ] Primer quiebre ortogonal queda a distancia suficiente del borde de source/target
- [ ] Cruces entre enlaces no dibujan puentes/arcos persistentes no OPM
- [ ] Cada enlace tiene wrapper transparente de hit-area (≥15px)
- [ ] Orden vertical de subprocesos respeta fixture cuando aplica
- [ ] Agregadores externos agrupados
- [ ] Envelope proporcional al contenido
- [ ] rankdir=TB para descomposición de proceso
- [ ] Márgenes exteriores respetados

## Antipatrones

- Truncamiento silencioso "...text" en rótulos
- Rótulo del refinable atravesado por enlaces
- Envelope fijo que queda vacío en la mitad inferior
- Tagged-link con etiqueta sobre el bounding box de otra cosa
- Subprocesos paralelos a alturas distintas sin intención de secuencia
- Grid visible en el SVG exportado
- Usar línea discontinua para smart-guides (mezcla con ambiental)
- Canvas sin margen (contenido tocando los bordes)

## Referencias cruzadas

- Primitivas de cosas: `10-primitivas-cosas.md`
- Refinamiento y envelope: `30-refinamiento-entre-opds.md`
- Distribución de enlaces: `31-distribucion-enlaces-descomposicion.md`
- Orden temporal y paralelismo: `21-tiempo-paralelismo-orden.md`
- UI y afordances: `60-ui-afordances-canvas.md`
- Export y viewport: `63-exportacion-canonica.md`
- Metodología de complejidad: `82-metodologia-complejidad-gobernanza.md`
