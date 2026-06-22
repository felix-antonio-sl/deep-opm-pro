# 42 — Sub-modelos y composición inter-modelo

**Alcance**: modelos compuestos por referencia (DAG), declaración cruzada padre-hijo, vistas de sub-modelo, referencias externas cross-model, ciclo de carga, portabilidad, desconexión.
**Capa SSOT propietaria**: `opm-visual-es.md` §23; `opm-iso-19450-es.md` §Metamodelo OPM
**Aplicación en la app**: `src/persistencia/` (composición), UI de sub-modelos, exportador.

## Reglas

### R-1900: V-176 — Modelo puede referenciar otros

- Enunciado: un modelo OPM puede referenciar otros modelos OPM como sub-modelos. El resultado es un **grafo dirigido acíclico** de modelos individuales.
- Referencia SSOT: V-176 (D2)
- Aplicación en código: `modelo.subModelos: Referencia[]`.

### R-1901: V-177 — Cada sub-modelo autocontenido en OPL

- Enunciado: cada sub-modelo conserva su propia especificación OPL **autocontenida**. La dualidad OPD↔OPL se preserva íntegramente dentro de cada modelo individual.
- Referencia SSOT: V-177
- Aplicación en código: cada sub-modelo tiene su OPL sin merge automático.

### R-1902: V-178 — Declaración explícita del padre

- Enunciado: el modelo padre DEBE contener una declaración explícita de cada sub-modelo referenciado y de la base de selección o derivación que lo vincula al padre.
- Referencia SSOT: V-178
- Aplicación en código: serialización incluye `subModelo.origenDerivacion`.

### R-1903: V-179 — Declaración simétrica del hijo

- Enunciado: el sub-modelo DEBE declarar su modelo de origen o su vista derivada de manera simétrica y persistente.
- Referencia SSOT: V-179
- Aplicación en código: persistencia bidireccional del vínculo.

### R-1904: V-180 — Vista de sub-modelo en árbol

- Enunciado: una vista de sub-modelo anclada al árbol se identifica como `SDx.y: <Nombre> Vista de Sub-modelo` o equivalente declarado. El token `SDx.y` es **etiqueta visible interna al árbol del modelo propietario**, no identidad persistente: las referencias externas al sub-modelo o a sus OPDs DEBEN seguir usando el identificador persistente declarado por V-248.
- Referencia SSOT: V-180
- Aplicación en código: vista anclada al árbol (V-114, categoría 2).

### R-1905: V-181 — Tres categorías diferenciadas

- Enunciado: la vista de sub-modelo constituye una categoría **distinta** del OPD jerárquico ordinario y de la vista ad hoc no anclada. La implementación DEBE diferenciar estas tres categorías en su metadato de árbol y de export.
- Referencia SSOT: V-181, conforme a V-114
- Aplicación en código: `opd.categoria: "jerárquico" | "vista_anclada" | "vista_ad_hoc"`.

### R-1906: V-182 — Sub-modelo visualizado en solo lectura

- Enunciado: cuando un sub-modelo se visualiza desde el árbol del padre, la implementación PUEDE presentarlo en modo de **solo lectura** o equivalente. Esa condición pertenece a la gramática de vista, no al contenido del OPD.
- Referencia SSOT: V-182
- Aplicación en código: modo de visualización sin edición; edición se realiza en el modelo propietario.

### R-1907: V-183 — Distintivo de vínculo externo

- Enunciado: el nodo del árbol del padre que referencia un sub-modelo DEBE llevar un **distintivo o indicador explícito** de vínculo externo. El mismo vínculo DEBE ser visible en la pestaña, ruta de navegación o metadato del documento.
- Referencia SSOT: V-183
- Aplicación en código: icono o marca en el nodo de árbol indicando "sub-modelo".

### R-1908: V-184 — Apariencias cross-model como referencia externa

- Enunciado: una cosa visible dentro de un sub-modelo que también aparece en el modelo padre es **referencia externa a la misma existencia compartida** (V-123, §18.7). NO es existencia-espejo ni entidad duplicada. La existencia pertenece al modelo propietario original y la aparición en el sub-modelo es apariencia local de una referencia externa.
- Referencia SSOT: V-184 (D1)
- Aplicación en código: la referencia externa no crea existencia nueva; apunta al URI/handle del propietario.

### R-1909: V-185 — Atenuación cromática como gramática de vista

- Enunciado: si la implementación usa atenuación cromática, alias forzado o distintivos para indicar procedencia cross-model, esos indicadores se clasifican como **gramática de vista** de §23 y NO como semántica nuclear. La atenuación cromática es marca epistémica local ("esta cosa es referencia, no propiedad de este modelo"), no propiedad de la cosa.
- Referencia SSOT: V-185
- Aplicación en código: atenuación solo aplicada en el OPD donde la cosa es referencia externa.

### R-1910: V-256 — Ciclo de carga como propiedad de la referencia

- Enunciado: la sincronización de cambios entre modelo propietario y sub-modelo referenciador se rige por el ciclo de carga (`cargado y sincronizado`, `cargado y no sincronizado`, `no cargado`) declarado por la implementación. Todos esos estados son propiedades de la **referencia**, no de la cosa subyacente.
- Referencia SSOT: V-256 (D1)
- Aplicación en código: `referencia.estadoCarga: "cargado_sincronizado" | "cargado_no_sincronizado" | "no_cargado"`.

### R-1911: V-186 — Excepción controlada a V-46

- Enunciado: una vista de sub-modelo PUEDE no contener exactamente un proceso sistémico en el sentido de V-46, siempre que declare explícitamente la selección parcial o el criterio de vista que la originó.
- Referencia SSOT: V-186
- Aplicación en código: validador admite esta excepción solo en vistas de sub-modelo.

### R-1912: V-187 — Portabilidad con declaración de sub-modelos

- Enunciado: todo export canónico de un modelo compuesto DEBE declarar si incluye o no los sub-modelos no cargados y cómo se resuelven las referencias externas.
- Referencia SSOT: V-187
- Aplicación en código: exportador emite metadato de composición.

### R-1913: V-188 — Esquema de resolución explícito

- Enunciado: un modelo compuesto NO puede considerarse portable si la resolución de sus sub-modelos depende de convenciones implícitas de filesystem o sesión. El esquema de resolución DEBE ser parte del formato de intercambio o del manifiesto de export.
- Referencia SSOT: V-188
- Aplicación en código: el formato de serialización incluye manifiesto con URIs/handles de sub-modelos.

### R-1914: V-189 — Desconexión cambia estado del vínculo

- Enunciado: la operación de desconectar un sub-modelo DEBE cambiar explícitamente el estado del vínculo en el árbol y en el metadato del modelo. NO puede dejar un nodo visualmente ambiguo entre vista anclada y OPD ordinario.
- Referencia SSOT: V-189
- Aplicación en código: operación explícita `desconectarSubModelo`; el nodo cambia de categoría o se elimina.

### R-1915: Contrato de interfaz de sub-modelo (metodológico)

- Enunciado: la creación de un sub-modelo requiere un mínimo de:
  - un objeto + un proceso conectados por exhibición-caracterización
  - y enlace de instrumento
  - con un solo proceso por sub-modelo
  - las cosas compartidas DEBEN estar sin refinar
- Referencia SSOT: `metodologia-opm-es.md` §8.2
- Aplicación en código: asistente de creación de sub-modelo fuerza estos mínimos.

### R-1916: Congelación de interfaz post-creación

- Enunciado: una vez creado el sub-modelo:
  - Las cosas compartidas en el modelo principal NO PUEDEN recibir nuevos enlaces de refinamiento ni nuevas conexiones
  - Las cosas compartidas en el sub-modelo NO PUEDEN renombrarse, recibir nuevos estados ni eliminarse
  - NO PUEDEN agregarse nuevas cosas compartidas después de la creación; si la interfaz es incorrecta, DEBE destruirse y recrearse
  - Los sub-modelos PUEDEN anidarse recursivamente, aplicando las mismas reglas en cada nivel
- Referencia SSOT: `metodologia-opm-es.md` §8.2
- Aplicación en código: estas restricciones se enforce en validador y UI.

### R-1917: Autoridad semántica pertenece al propietario

- Enunciado: la autoridad semántica de una cosa compartida pertenece al **modelo propietario**; el modelo consumidor solo la referencia.
- Referencia SSOT: `metodologia-opm-es.md` §8.2, V-123
- Aplicación en código: modificaciones a cosas compartidas se escriben en el propietario, no en el consumidor.

### R-1918: Resolución por identificador persistente

- Enunciado: la referencia entre modelo propietario y modelo consumidor DEBE poder resolverse mediante identificador persistente (por ejemplo URI o handle persistente), NO solo mediante posición en el árbol o etiqueta visible.
- Referencia SSOT: `metodologia-opm-es.md` §8.2, V-252
- Aplicación en código: resolución por URI, no por path.

### R-1919: Sub-modelos para trabajo concurrente

- Enunciado: cuando múltiples modeladores trabajan en subsistemas simultáneamente, DEBERÍA separarse en sub-modelos. Las conexiones entre modelo principal y sub-modelos DEBEN mantenerse mínimas para reducir acoplamiento y conflictos de edición concurrente.
- Referencia SSOT: `metodologia-opm-es.md` §8.2
- Aplicación en código: sugerencia en UI al detectar edición concurrente en mismo subsistema.

### R-1920: Ejecución compuesta con handoff explícito

- Enunciado: cuando el comportamiento cruza a un sub-modelo, el cruce NO DEBE interpretarse como mera continuación implícita de un árbol global único. DEBE tratarse como una **transición explícita** entre fronteras de modelo, gobernada por la composición inter-modelo y por la referencia persistente al sub-modelo correspondiente.
- Referencia SSOT: `metodologia-opm-es.md` §14.1
- Aplicación en código: motor de simulación marca el handoff como evento explícito.

### R-1921: Simulación por modelo individual vs compuesta

- Enunciado: si la herramienta NO soporta ejecución compuesta, el modelador DEBERÍA ejecutar o simular cada modelo individual por separado y tratar la frontera como punto explícito de coordinación.
- Referencia SSOT: `metodologia-opm-es.md` §14.1
- Aplicación en código: declarar explícitamente si el motor soporta simulación compuesta.

### R-1922: Declaración persistente de sub-modelos

- Enunciado: cada sub-modelo se declara explícitamente en el modelo padre con una oración OPL específica:
  - `SD1.1 es una vista de sub-modelo de Modelo Subsistema` (CM1)
  - `SD1.1 referencia el sub-modelo Modelo Subsistema desde SD1` (CM2)

Y las referencias externas se declaran con:
  - `**Cosa** en SD1.1 es referencia externa a **Cosa** del modelo propietario Modelo Principal` (CM3)

- Referencia SSOT: `opm-opl-es.md` §10.4
- Aplicación en código: el generador OPL emite estas plantillas.

### R-1923: Frontera propietario/consumidor preservada

- Enunciado: la frontera entre modelo propietario y modelo consumidor DEBE preservarse. El consumidor NO renombra ni agrega estados a referencias externas.
- Referencia SSOT: `metodologia-opm-es.md` §15
- Aplicación en código: validador rechaza mutaciones de cosas referenciadas externamente desde el consumidor.

### R-1924: Navegación cross-model con distintivo

- Enunciado: al navegar del padre al sub-modelo, la UI DEBE mostrar un distintivo de "entrada a sub-modelo" (breadcrumb, pestaña, color).
- Referencia SSOT: V-183
- Aplicación en código: UI con indicador visual persistente.

## Checklist

- [ ] Modelos compuestos son DAG (acíclicos)
- [ ] Cada sub-modelo con OPL autocontenido
- [ ] Declaración cruzada padre-hijo serializada
- [ ] Vistas de sub-modelo categorizadas como "vista anclada"
- [ ] Sub-modelos visibles en solo lectura desde padre
- [ ] Nodo del árbol con distintivo de vínculo externo
- [ ] Referencias externas como misma existencia compartida (no duplicada)
- [ ] Atenuación cromática como gramática de vista, no nuclear
- [ ] Ciclo de carga como propiedad de la referencia
- [ ] Vistas de sub-modelo admiten excepción a V-46
- [ ] Export declara inclusión/exclusión de sub-modelos
- [ ] Esquema de resolución explícito en manifiesto
- [ ] Desconexión cambia estado del vínculo
- [ ] Interfaz de sub-modelo congelada tras creación
- [ ] Autoridad semántica pertenece al propietario
- [ ] Resolución por URI/handle, no por path visible
- [ ] Handoff explícito en ejecución cross-model
- [ ] Frontera propietario/consumidor preservada

## Antipatrones

- Permitir modificación de referencia externa en el consumidor
- Incluir sub-modelos en un único texto OPL global implícito
- Depender de filesystem paths para resolver sub-modelos
- Desconectar sub-modelo sin cambiar categoría del nodo
- Ejecución cross-model como continuación implícita
- Referencias externas sin distintivo visible
- Usar "SDx.y" como ID persistente para sub-modelo

## Referencias cruzadas

- Refinamiento (D2): `30-refinamiento-entre-opds.md`
- Navegación y categorías de OPD: `40-navegacion-arbol-identidad.md`
- Metamodelo (existencia): `41-metamodelo-apariencia-existencia.md`
- Exportación: `63-exportacion-canonica.md`
- OPL composición inter-modelo (CM1..CM3): `73-opl-plantillas-contexto-y-multiplicidad.md`
- Metodología gobernanza: `82-metodologia-complejidad-gobernanza.md`
