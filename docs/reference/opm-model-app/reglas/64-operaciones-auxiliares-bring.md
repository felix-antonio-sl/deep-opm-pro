# 64 — Operaciones auxiliares inter-OPD (Bring)

**Alcance**: `bring connected things`, `bring links between selected entities`, materialización de apariencias existentes, reversibilidad, OPDs derivados como vistas.
**Capa SSOT propietaria**: `opm-visual-es.md` §26 (V-257..V-263)
**Aplicación en la app**: operaciones de canvas, UI de edición de OPDs.

## Reglas

### R-2800: V-257 — Operador derivado, no mecanismo ontológico

- Enunciado: una **operación auxiliar inter-OPD** es un operador derivado que modifica la composición visible de un OPD activo trayendo, retirando o re-materializando apariencias de cosas y enlaces **cuya existencia ya está declarada en el modelo**. NO introduce nuevas cosas, enlaces o relaciones ontológicas.
- Referencia SSOT: V-257 (D3)
- Aplicación en código: Bring NO crea cosas nuevas en el modelo; solo apariencias locales.

### R-2801: V-258 — `Bring connected things`

- Enunciado: `Bring connected things` es la operación que materializa en el OPD activo cosas conectadas directamente por enlace a una cosa seleccionada. La operación puede estar filtrada por:
  - familia de enlace (§3, V-239)
  - criterio de conectividad directa
- Referencia SSOT: V-258
- Aplicación en código: UI ofrece filtros; la operación llama al kernel para obtener adyacentes.

### R-2802: V-259 — Canon-diagrama indistinguible

- Enunciado: el resultado de `Bring connected things` DEBE ser indistinguible, en el canon-diagrama, de un OPD construido manualmente con las mismas cosas y enlaces. NO se admiten marcas persistentes de "cosa traída" en el export canónico.
- Referencia SSOT: V-259
- Aplicación en código: el export NO incluye flag de procedencia "Bring".

### R-2803: V-260 — `Bring links between selected entities`

- Enunciado: `Bring links between selected entities` es la operación que materializa en el OPD activo los enlaces existentes en el modelo entre un conjunto de cosas ya seleccionadas. NO crea enlaces nuevos.
- Referencia SSOT: V-260
- Aplicación en código: UI de multi-selección + "traer enlaces".

### R-2804: V-261 — Supresores de enlaces no materializados

- Enunciado: las operaciones auxiliares PUEDEN dejar en el OPD activo **supresores de enlaces no materializados** (§1.8, V-192) cuando existan conexiones hacia cosas ausentes del OPD. Este indicador NO es exclusivo de estas operaciones pero sí se refuerza por su ejecución.
- Referencia SSOT: V-261
- Aplicación en código: post-Bring, inspeccionar enlaces a cosas no traídas y agregar `...`.

### R-2805: V-262 — OPDs derivados por Bring como vistas

- Enunciado: las operaciones auxiliares PUEDEN crear OPDs derivados nombrados (por ejemplo, `<cosa> unfolded`) sin que esto constituya un mecanismo canónico de refinamiento (§10.1, V-242). Esos OPDs derivados se clasifican como **vistas ancladas o ad hoc** según V-114 (§15.4).
- Referencia SSOT: V-262
- Aplicación en código: al crear OPD derivado, etiquetarlo con categoría correspondiente.

### R-2806: V-263 — Reversibilidad

- Enunciado: toda operación auxiliar DEBE ser **reversible o acotada**: la herramienta DEBE permitir revertir o acotar explícitamente el cambio sobre el OPD activo. Bring NO puede modificar el modelo subyacente; si lo hiciera, deja de ser operación auxiliar y DEBE regularse en §10 u otra sección ontológica.
- Referencia SSOT: V-263
- Aplicación en código: Bring aparece en el stack de undo; no persiste cambios al modelo semántico.

### R-2807: Bring vs refinamiento

- Enunciado: las operaciones Bring son **operadores derivados**, NO mecanismos de refinamiento (V-243). Distinguir:
  - Refinamiento canónico (in-zooming, unfolding, sub-model): crea OPD hijo con relación padre-hijo
  - Bring: materializa apariencias en OPD existente o deriva OPD como vista
- Referencia SSOT: V-242, V-243, V-257
- Aplicación en código: UI separa ambas acciones.

### R-2808: Filtrado por familia de enlace

- Enunciado: la implementación DEBERÍA permitir filtrar `Bring connected things` por familia de enlace (transformador, habilitador, invocación, estructural fundamental, estructural etiquetada).
- Referencia SSOT: V-258
- Aplicación en código: toggle por familia en UI.

### R-2809: Bring no valida semántica global

- Enunciado: Bring solo agrega apariencias; NO valida semántica global. La validación del modelo sigue siendo responsabilidad del validador cuando se cierre la edición.
- Referencia SSOT: V-263 (consecuencia)
- Aplicación en código: sin efectos secundarios fuera del OPD activo.

### R-2810: Bring y supresor

- Enunciado: al traer cosas conectadas de forma parcial (ej. solo con filtro de familia), los enlaces hacia cosas NO traídas se resumen con supresor `...`.
- Referencia SSOT: V-261, V-192
- Aplicación en código: post-Bring, `pass-supresores` genera indicadores.

### R-2811: Bring no altera existencia

- Enunciado: Bring NO crea cosas nuevas en el modelo ni altera propiedades de las existentes. Solo agrega **apariencias locales** (V-123).
- Referencia SSOT: V-257, V-123
- Aplicación en código: las apariencias agregadas son vistas de cosas existentes.

### R-2812: OPD derivado con nombre reservado

- Enunciado: los OPDs derivados por Bring pueden tener nombre reservado según patrón (ej. `<cosa> unfolded`, `<cosa> connected`). El patrón NO debe usarse manualmente para nombres arbitrarios.
- Referencia SSOT: V-262 (implícito)
- Aplicación en código: validador protege el patrón.

### R-2813: Revertir Bring limpia el OPD

- Enunciado: al revertir una operación Bring, el OPD activo regresa al estado anterior. Las apariencias agregadas por Bring se eliminan; las cosas traídas siguen existiendo en el modelo (si existían previamente) pero NO en este OPD.
- Referencia SSOT: V-263
- Aplicación en código: undo restaura el snapshot anterior del OPD activo.

### R-2814: Acotar operación

- Enunciado: "acotar" significa restringir el conjunto afectado (ej. solo cosas de una familia, solo enlaces recíprocos). La herramienta DEBERÍA ofrecer preview antes de confirmar.
- Referencia SSOT: V-263
- Aplicación en código: preview interactivo antes de aplicar.

### R-2815: Bring y operaciones de Inspección

- Enunciado: operaciones como buscar, traer conectados y traer filtrado DEBERÍAN usarse para **inspección localizada** de un subgrafo antes de editar, especialmente en modelos con alta densidad de enlaces.
- Referencia SSOT: `metodologia-opm-es.md` §8.8
- Aplicación en código: Bring como herramienta de exploración.

### R-2816: Bring no propaga a sub-modelos

- Enunciado: Bring opera dentro del modelo activo. Para traer cosas cross-model, se requiere composición inter-modelo (§23) explícita, no Bring.
- Referencia SSOT: V-257 (alcance implícito), V-184
- Aplicación en código: Bring restringido al modelo actual.

## Checklist

- [ ] Bring es operador derivado, no mecanismo ontológico
- [ ] `Bring connected things` materializa adyacentes existentes
- [ ] `Bring links between selected entities` materializa enlaces existentes
- [ ] Resultado indistinguible en canon-diagrama de OPD manual
- [ ] Supresores `...` aparecen cuando hay cosas no traídas conectadas
- [ ] OPDs derivados por Bring clasificados como vistas (ancladas o ad hoc)
- [ ] Reversibilidad garantizada (undo)
- [ ] Bring no crea cosas ni altera propiedades
- [ ] Bring no modifica el modelo subyacente
- [ ] Filtrado por familia admitido
- [ ] Patrón de nombre reservado para OPDs derivados
- [ ] Preview antes de aplicar
- [ ] Bring no aplica cross-model

## Antipatrones

- Bring que crea una cosa nueva en el modelo
- Export con marca "cosa traída por Bring" (viola V-259)
- Bring sin reversibilidad (undo)
- OPD derivado sin categoría (jerárquico / anclada / ad hoc)
- Usar Bring para traer cosas de un sub-modelo directamente
- Sin supresor `...` tras Bring parcial

## Referencias cruzadas

- Refinamiento canónico: `30-refinamiento-entre-opds.md`
- Navegación y categorías de OPD: `40-navegacion-arbol-identidad.md`
- Metamodelo y apariencias: `41-metamodelo-apariencia-existencia.md`
- Sub-modelos: `42-sub-modelos-inter-modelo.md`
- UI de búsqueda / navegación: `60-ui-afordances-canvas.md`
- Indicadores auxiliares: `12-enlaces-decoraciones-marcas.md` (supresor `...`)
