---
title: "Decisiones axiomáticas previas al apéndice categorial del SSOT OPM"
fecha: 2026-04-17
estado: "propuesto"
alcance: "Paso 0 previo a edición de ssot/, apéndice categorial y tests categoriales"
fuentes:
  - ssot/README.md
  - ssot/opm-iso-19450-es.md
  - ssot/opm-visual-es.md
  - ssot/metodologia-opm-es.md
  - videos-transcripciones-integrado.md
---

# Decisiones axiomáticas previas al apéndice categorial del SSOT OPM

## 0. Propósito

Este documento fija las decisiones mínimas que deben resolverse **antes** de escribir un apéndice categorial o introducir tests categoriales sobre el SSOT.

La razón es simple: hoy conviven dos realidades:

- el **OPM clásico cerrado** que la axiomática vigente todavía describe con bastante fidelidad;
- el **ecosistema OPM compuesto** que OPCloud ya opera y que el dominio H documenta empíricamente.

Si se formaliza categorialmente el primer mundo ignorando el segundo, el apéndice nace obsoleto. Si se formaliza el segundo sin elegir antes sus disyuntivas básicas, el apéndice nace inconsistente.

Por eso este documento actúa como **Paso 0**.

La incorporación de `videos-transcripciones-integrado.md` cambia además el estatuto de varias tensiones del dominio H: ya no son solo inferencias empíricas a partir de UI o archivos, sino comportamiento e intención de producto declarados explícitamente por OPCloud.

## 1. Tesis rectora

La deuda actual del SSOT es doble:

| Deuda | Descripción | Naturaleza |
|---|---|---|
| A | Universales no nombrados: adjunciones, colímites, fibraciones, coalgebras | deuda de explicitación |
| B | Axiomática clásica desalineada con el ecosistema real: sub-models, vistas ancladas, árbol mixto, operaciones auxiliares | deuda de alcance ontológico |

La Deuda A puede resolverse con mejor formalización.

La Deuda B exige decidir **qué sistema se está formalizando**.

La secuencia correcta es:

1. Resolver Deuda B.
2. Reescribir la base axiomática afectada.
3. Nombrar universales sobre esa nueva base.
4. Añadir verificación automática.

## 2. Marco categorial de decisión

Las siguientes decisiones se evalúan contra cuatro criterios:

| Criterio | Pregunta |
|---|---|
| Preservación | ¿la decisión preserva identidad, dualidad y trazabilidad? |
| Composición | ¿permite componer modelos y vistas sin reglas ad hoc? |
| Separación de canales | ¿separa semántica, vista, navegación y layout? |
| Auditabilidad | ¿habilita tests y referencias estables? |

Hipótesis de trabajo:

- el OPM clásico puede leerse como categoría con realizaciones bimodales;
- el OPM compuesto exige al menos una **fibración sobre un DAG de modelos**;
- el refinamiento ya no alcanza con una simple doble categoría temporal × estructural si además existe composición inter-modelo;
- las operaciones de vista y navegación deben modelarse como capas ortogonales, no como semántica colapsada en el layout.

### 2.1 Estatuto de la nueva fuente

`videos-transcripciones-integrado.md` debe tratarse como fuente de **intención operacional declarada**.

- no sustituye al SSOT;
- no reemplaza la evidencia estructural del dominio H;
- pero sí fija qué comportamientos OPCloud considera actualmente legítimos, centrales o esperados.

Esto endurece tres conclusiones metodológicas:

- cuando la transcripción confirma una anomalía del dominio H, esa anomalía deja de poder descartarse como accidente de implementación;
- cuando una operación aparece como configurable, filtrable o dependiente del contexto, debe leerse prima facie como capa operativa o de vista, no como primitiva ontológica;
- cuando el producto declara sincronización, carga perezosa, OPDs de navegación o dependencia del layout para ejecución, el SSOT debe decidir si los absorbe normativamente, los restringe o los separa por capa.

## 3. Decisiones

### D1. Apariencia cross-model en H1.4

**Pregunta**: cuando una cosa aparece en un sub-model referenciado, ¿qué ocurre con su identidad?

| Opción | Resumen |
|---|---|
| (a) | misma existencia, apariencia ampliada con procedencia como propiedad visual |
| (b) | existencia-espejo con identidad nueva sincronizada |
| (c) | existencia compartida por URI; la atenuación visual marca solo referencia no-propietaria |

**Decisión**: elegir **(c)**.

**Razón categorial**:

- preserva Yoneda: la identidad sigue determinada por su red de relaciones, no por el lugar desde donde se la mira;
- mantiene `V-123` como tesis de existencia única, agregando una dimensión ortogonal de referencia;
- modela el compuesto como fibración sobre referencias entre modelos, no como duplicación ontológica;
- hace de la apariencia gris una marca epistémica local, no una propiedad de la cosa.

**Alternativas rechazadas**:

- (a) introduce “procedencia” como propiedad del aspecto y mezcla ontología con punto de vista;
- (b) multiplica identidades y obliga a resolver sincronización como problema semántico central.

**Consecuencia normativa**:

- reformular `V-123` para distinguir `existencia`, `apariencia local` y `referencia externa`;
- exigir URI o handle persistente en serialización.

**Evidencia adicional desde transcripciones integradas**:

- `Intro 38 - Sub Models` declara que las cosas compartidas entre modelo principal y sub-model quedan transparentes en ambos lados y siguen siendo las mismas cosas compartidas, no duplicados sincronizados;
- la misma transcripción introduce estados `loaded and synchronized`, `loaded and unsynchronized` y `unloaded`, lo que refuerza que la variación visible pertenece a la referencia/carga local, no a la ontología de la cosa.

### D2. Sub-model en H1.2

**Pregunta**: ¿sub-model es un quinto mecanismo de refinamiento o debe reabsorberse en “vista”?

**Decisión**: tratarlo como **quinto mecanismo explícito**.

**Razón categorial**:

- no es una vista arbitraria: crea estructura estable en árbol, persistencia propia, frontera de serialización y dualidad OPD/OPL degradada a través de esa frontera;
- tiene semántica distinta de in-zoom, unfold y vista ad hoc;
- reabsorberlo en “vista” colapsa niveles que no comparten la misma propiedad universal.

**Alternativa rechazada**:

- “sub-model = vista anclada” reduce una composición inter-modelo a una mera proyección interna y hace opaca la ruptura de clausura de `V-64`.

**Consecuencia normativa**:

- ampliar §10.1 con cinco mecanismos;
- definir sufijo y metadato propios para `Subsystem Model View`;
- reescribir `V-64` para admitir modelo compuesto por referencia.

**Evidencia adicional desde transcripciones integradas**:

- `Intro 38 - Sub Models` declara que el objetivo es permitir trabajo paralelo entre modeladores con interacción mínima entre modelo principal y subsystem;
- la misma fuente impone restricciones semánticas específicas: selección mínima objeto+proceso+enlace, un solo proceso compartido, mismo folder, nombre controlado desde el main model y frontera explícita de sincronización;
- eso excede claramente una simple vista y confirma que sub-model introduce estructura, serialización y gobernanza propias.

### D3. Bring en H2.1

**Pregunta**: ¿Bring es mecanismo primario de refinamiento o vía derivada?

**Decisión**: tratarlo como **tercera vía declarada, pero no mecanismo primario**.

**Razón categorial**:

- Bring no introduce una nueva semántica base; materializa una operación derivada sobre relaciones ya existentes;
- su comportamiento depende de filtros, disponibilidad contextual y políticas de layout;
- se parece más a un levantamiento operativo de unfold/despliegue que a una forma ontológica nueva de refinamiento.

**Alternativa rechazada**:

- elevar Bring a mecanismo primario sobredimensiona una operación auxiliar y agrava la proliferación de primitivas normativas.

**Consecuencia normativa**:

- crear una §26 de operaciones auxiliares;
- declarar que Bring puede crear OPDs derivados sin por ello convertirse en mecanismo base;
- separar claramente semántica de operación y semántica del modelo resultante.

**Evidencia adicional desde transcripciones integradas**:

- `Intro 40 - Bring connected Things` declara expresamente que Bring busca traer solo elementos directamente conectados y no “OPM related connected things”, lo cual es exactamente el comportamiento de un operador derivado y filtrado;
- la misma operación depende de defaults configurables y de selección puntual entre familias de enlace, lo que la ubica del lado de política operativa y no de ontología básica;
- `Intro 45 - Bring Links Between Selected Entities` refuerza esta lectura al introducir otra variante de Bring centrada en visibilidad y conectividad entre entidades ya elegidas.

### D4. Familia de invocación en H2.4

**Pregunta**: ¿la invocación pertenece a habilitación o constituye una familia propia?

**Decisión**: tratarla como **quinta familia**.

**Razón categorial**:

- su firma es proceso→proceso, no objeto→proceso;
- no es transformador ni habilitador en el sentido clásico del hom-set `Object → Process`;
- su comportamiento temporal y composicional es diferente y merece partición propia.

**Alternativa rechazada**:

- absorberla dentro de habilitación oculta una diferencia de dominio/codominio y debilita la taxonomía.

**Consecuencia normativa**:

- la partición operativa pasa a ser:
  `ProceduralTransforming`, `ProceduralEnabling`, `ProceduralInvocation`, `FundamentalStructural`, `TaggedStructural`.

**Evidencia adicional desde transcripciones integradas**:

- `Intro 21 - The Links table` muestra que la taxonomía de familias de enlace no es un detalle editorial sino superficie operativa central del producto;
- precisamente por eso, dejar la invocación absorbida implícitamente en otra familia volvería incompleta la taxonomía justo en la superficie donde el producto operacionaliza explícitamente las familias de enlace.

### D5. Reformulación de V-114 en H1.3

**Pregunta**: ¿qué tipos de OPD existen realmente en el árbol?

**Decisión**: adoptar **tres categorías**:

| Categoría | Rasgo |
|---|---|
| OPD jerárquico | participa de refinamiento |
| OPD de vista anclada | vive en el árbol pero no por refinamiento |
| OPD de vista ad hoc | vive fuera del árbol jerárquico |

**Razón categorial**:

- distingue estructura de navegación de estructura de refinamiento;
- evita que “vista” sea una bolsa semántica única para fenómenos heterogéneos;
- preserva una factorización limpia entre árbol lógico y vistas derivadas.

**Alternativa rechazada**:

- mantener solo “jerárquico vs vista” ya es falso empíricamente frente a system maps y sub-model views ancladas.

**Consecuencia normativa**:

- reescribir `V-114`;
- declarar condiciones de eliminación, navegación y serialización por categoría.

**Evidencia adicional desde transcripciones integradas**:

- `Intro 31 - System Map` dice explícitamente que el system map crea un nuevo OPD en el árbol para navegación global del modelo;
- `Intro 33 - OPM Requirements Modeling` crea `requirement views` bajo el árbol, pero declara que esas vistas son read-only;
- `Intro 43 - OPD tree management` añade que, si existe sub-model, el árbol puede mostrar sus OPDs y refrescarlos para traerlos al modelo actual;
- estas tres piezas vuelven ya insostenible una ontología binaria “jerárquico vs vista”.

### D6. Acoplamiento triple de `y` en H3.1

**Pregunta**: ¿puede la coordenada `y` seguir codificando simultáneamente orden temporal, orden de hermanos e identificador `SDx.y`?

**Decisión**: **no**. Deben separarse los canales.

**Razón categorial**:

- el sistema actual colapsa un producto de tres proyecciones en un solo parámetro geométrico;
- reordenar layout altera tiempo, árbol e identidad referencial a la vez;
- `SD1.2` se vuelve referencia volátil, lo que destruye auditabilidad.

**Alternativa rechazada**:

- conservar el acoplamiento y solo documentar su volatilidad es insuficiente; explica el anti-patrón, pero no lo corrige.

**Consecuencia normativa**:

- separar:
  - orden temporal,
  - orden de navegación,
  - identificador estable del OPD.
- `SDx.y` no debe ser la identidad canónica persistente;
- el identificador estable debe independizarse del layout;
- el layout puede seguir proyectando tiempo, pero ya no la identidad del nodo.

**Evidencia adicional desde transcripciones integradas**:

- `Advance 2 - Conceptual Simulation` declara explícitamente que en un proceso in-zoomed el orden de ejecución depende de qué proceso está más alto o más bajo, y que al cambiar ese orden se actualiza también el OPL;
- `Intro 41 - Grid and alignment` vuelve a afirmar que la altura o nivel de los subprocesses determina el orden de ejecución en OPM;
- por tanto, el acoplamiento entre geometría y semántica temporal ya no es inferido: está reconocido por el propio producto y debe separarse normativamente de identidad y navegación.

## 4. Arquitectura objetivo

Con estas decisiones, la arquitectura objetivo deja de ser “modelo cerrado con vistas accesorias” y pasa a ser:

- una base OPM clásica para semántica local;
- una composición inter-modelo por referencia;
- una fibración sobre el DAG de modelos;
- un árbol OPD mixto para navegación local;
- una capa de vistas y operaciones auxiliares separada del núcleo semántico;
- un sistema de identificadores estables no dependientes del layout.

En este marco:

- la adjunción OPD↔OPL sigue siendo fuerte **dentro** de cada modelo;
- a través de fronteras de modelo, la dualidad exige reglas explícitas adicionales;
- el refinamiento temporal × estructural sigue existiendo, pero ya no agota toda la dimensión composicional;
- la forma más promisoria de extensión es un lenguaje de fibración/operad jerárquico, no solo una double category clásica.

## 5. Secuencia de trabajo obligatoria

### Paso 0

Adoptar o corregir estas seis decisiones.

### Paso 1

Reescribir las cláusulas afectadas del SSOT:

- `V-64`
- `V-114`
- `V-123`
- §10.1
- taxonomía de familias de enlace
- semántica de identificadores OPD y árbol

### Paso 2

Redactar el apéndice categorial sobre la nueva base.

### Paso 3

Implementar tests categoriales contra la axiomática ya corregida.

## 6. Lo que queda explícitamente fuera

Este documento no decide todavía:

- la redacción final de las reglas `V-NEW-*`;
- el formato exacto de serialización;
- si la extensión final se formaliza mejor como operad, 2-categoría fibrada o ambas;
- la semántica coalgebraica de ejecución y simulación.

Esas tareas vienen después.

## 7. Cierre

La decisión estratégica es esta:

el siguiente artefacto útil del proyecto no es un nuevo análisis, ni un patch directo del apéndice categorial.

Es este nivel intermedio: una **carta de decisiones axiomáticas** que determine qué OPM se va a formalizar.

Mientras eso no esté fijado, cualquier formalización profunda corre el riesgo de ser rigurosa sobre el sistema equivocado.
