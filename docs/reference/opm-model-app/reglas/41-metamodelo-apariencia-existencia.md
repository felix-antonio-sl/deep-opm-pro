# 41 — Metamodelo: apariencia, existencia, referencia externa

**Alcance**: composición del modelo OPM, dualidad OPD-OPL, constructo OPD básico, objetos específicos de estado, existencia única vs apariencia local vs referencia externa cross-model.
**Capa SSOT propietaria**: `opm-visual-es.md` §18 (estructura del metamodelo)
**Aplicación en la app**: `src/nucleo/` (modelo de datos), `src/persistencia/` (serialización), identidad y referencia.

## Reglas

### R-1800: V-64 — Composición del modelo OPM

- Enunciado: un modelo OPM especifica un sistema. Se compone de:
  - un conjunto de OPDs (`1..*`)
  - una especificación OPL (`1..*` párrafos OPL)
  - **opcionalmente**, un conjunto de referencias a otros modelos OPM como sub-modelos (`0..*`, ver §23)
- Referencia SSOT: V-64 reescrita
- Aplicación en código: el root del modelo incluye `opds[]`, `opl[]`, `subModelos[]?`.

### R-1801: V-65 — Dualidad OPD ↔ OPL

- Enunciado: cada OPD tiene su contraparte en un párrafo OPL. Cada constructo OPD tiene su contraparte en una o más oraciones OPL. La dualidad es **bidireccional**: toda afirmación en un OPD debe ser reproducible como OPL, y toda oración OPL debe ser representable como constructo OPD.
- Referencia SSOT: V-65
- Aplicación en código: `opl-renderer.ts` cumple la dirección OPD→OPL; la inversa requiere parser OPL.

### R-1802: V-251 — Clausura OPD↔OPL local al modelo

- Enunciado: la clausura OPD↔OPL es local al modelo. El compuesto resultante es un grafo dirigido acíclico de modelos conectados por referencia, con cada modelo localmente autocontenido.
- Referencia SSOT: V-251
- Aplicación en código: cada modelo individual preserva la clausura; la composición cross-model NO la colapsa.

### R-1803: V-66 — Constructo OPD como proceso *Conectar*

- Enunciado: la construcción de un constructo OPD es el proceso *Conectar*, que toma un conjunto de cosas en estado `desconectado` y un conjunto de enlaces como instrumento, y produce un conjunto de cosas en estado `conectado`.
- Cardinalidades:
  - Enlaces: `1` (constructo básico) o `≥ 2` (constructo compuesto)
  - Cosas: `2` (básico) o `≥ 3` (compuesto)
- Referencia SSOT: V-66
- Aplicación en código: el modelo es reflexivo en OPM; esta regla tiene valor documental.

### R-1804: V-60 — Átomo mínimo del OPD

- Enunciado: todo OPD se compone de constructos OPD. Un constructo OPD consiste de un conjunto de cosas (2 o más cosas) y un conjunto de enlaces (1 o más enlaces). El **átomo mínimo** es el constructo básico: exactamente 1 enlace conectando exactamente 2 cosas.
- Referencia SSOT: V-60
- Aplicación en código: el validador considera el constructo básico como unidad atómica.

### R-1805: V-61 — Anatomía formal de un enlace

- Enunciado: todo enlace consta de:
  - **Origen** (cosa o estado de origen)
  - **Destino** (cosa o estado de destino)
  - **Conector** (línea visible + símbolo + opcional etiqueta + opcional etiqueta de ruta)

Origen y destino son cosas enlazadas; cada una exhibe símbolo (decoración visual) y multiplicidad (cardinalidad).

- Referencia SSOT: V-61
- Aplicación en código: el tipo `Enlace` encapsula estos componentes.

### R-1806: V-67 — Objetos con vs sin estados

- Enunciado: todo objeto exhibe un conjunto de estados. Si `s = 0`, es objeto sin estados. Si `s ≥ 1`, es objeto con estados. Un objeto con `s` estados deriva un **conjunto de objetos específicos de estado** de exactamente `s` elementos.
- Referencia SSOT: V-67
- Aplicación en código: operación `proyectarObjetosEspecificosDeEstado(objeto)`.

### R-1807: V-68 — Denominación de objeto específico de estado

- Enunciado: un objeto específico de estado se nombra concatenando el nombre del estado con el nombre del objeto original (ej. `Producto Diseñado` para estado `diseñado` de `Producto`).
- Referencia SSOT: V-68
- Aplicación en código: utilidad `nombreObjetoEspecifico(objeto, estado) = capitalizar(estado) + " " + objeto.nombre`.

### R-1808: V-123 reescrita — Existencia, apariencia local, referencia externa

- Enunciado: toda cosa en un modelo OPM tiene **existencia única** dentro del modelo que la declara como propietario. La existencia determina nombre, esencia y conjunto de estados, y se hereda por todas las apariencias locales en OPDs del mismo modelo.

Una cosa puede además tener:
- **apariencia local** en múltiples OPDs del mismo modelo (V-52)
- **referencia externa** desde sub-modelos que la usan sin poseer su existencia (§23, V-184)

| Concepto | Dónde vive | Qué codifica |
|---|---|---|
| Existencia | Un modelo único propietario | Identidad, nombre canónico, esencia, estados |
| Apariencia local | Múltiples OPDs del mismo modelo | Vista geométrica específica |
| Referencia externa | Sub-modelos que la usan | Préstamo sin cambio de propiedad |

- Referencia SSOT: V-123 reescrita (D1)
- Aplicación en código: `src/persistencia/` implementa los tres conceptos como tipos distintos.

### R-1809: Eliminar apariencia ≠ eliminar cosa

- Enunciado: eliminar una apariencia de un OPD NO elimina la cosa del modelo. Eliminar la cosa del modelo elimina todas sus apariencias en todos los OPDs.
- Referencia SSOT: V-123 (consecuencia)
- Aplicación en código: operación "remover del OPD" vs "eliminar del modelo".

### R-1810: V-252 — URI / handle persistente obligatorio cross-model

- Enunciado: toda cosa cuya existencia pueda ser referenciada desde otro modelo DEBE exponer un URI o handle persistente en la serialización del modelo propietario.
- Referencia SSOT: V-252
- Aplicación en código: `cosa.uri` o `cosa.handle` serializado.

### R-1811: V-253 — Marcas cross-model como gramática de vista

- Enunciado: la atenuación cromática, el distintivo de procedencia, el nombre alias o cualquier otra marca visual aplicada a una cosa en tanto que **referencia externa** son parte de la gramática de vista de §23, NO de la gramática nuclear.
- Referencia SSOT: V-253
- Aplicación en código: esas marcas no alteran el tipo semántico de la cosa.

### R-1812: Propiedades definidas a nivel de existencia

- Enunciado: las propiedades de la cosa (nombre, esencia, estados) se definen a nivel de **existencia**. Las apariencias NO pueden alterarlas.
- Referencia SSOT: V-123
- Aplicación en código: propiedades son read-only en apariencias.

### R-1813: V-121 — Nombre hereda política de capa textual

- Enunciado: la convención léxica concreta del nombre del proceso se hereda de la capa textual activa del corpus; la capa visual NO introduce una política paralela.
- Referencia SSOT: V-121
- Aplicación en código: validación de nombres vive en capa OPL.

### R-1814: V-122 — Alias decorativo vs computacional

- Enunciado: una cosa puede mostrar un alias breve entre paréntesis (decorativo). Las llaves `{alias}` se reservan exclusivamente al binding computacional regulado por §20.
- Referencia SSOT: V-122
- Aplicación en código: `cosa.aliasDecorativo: string` y `cosa.aliasComputacional: string` como campos distintos.

### R-1815: V-47 — Unicidad nominal a nivel de modelo

- Enunciado: la unicidad nominal se evalúa **a nivel de modelo**, pero toda apariencia visual DEBE renderizarse sin ambigüedad respecto de la cosa a la que refiere.
- Referencia SSOT: V-47
- Aplicación en código: validador global verifica unicidad de `cosa.nombre` dentro del modelo.

### R-1816: Convención de apariencias múltiples

- Enunciado: si una cosa aparece múltiples veces en el mismo OPD (apariencias duplicadas dentro del mismo diagrama), se indica con silueta desplazada detrás del símbolo (§1.8).
- Referencia SSOT: §1.8
- Aplicación en código: `apariencias[].instancia` discrimina apariciones dentro
  del mismo OPD y el renderer JointJS dibuja la silueta desplazada.

### R-1817: Constructos compuestos

- Enunciado: un **constructo compuesto** tiene:
  - N cosas (≥ 3) y ≥ 2 enlaces
  - O un abanico de enlaces (N enlaces con un extremo común)

Las referencias externas y los vínculos entre modelos NO alteran esta definición del constructo básico; pertenecen al nivel metamodelo del compuesto.

- Referencia SSOT: V-66, `opm-iso-19450-es.md` §Metamodelo
- Aplicación en código: el validador reconoce constructos compuestos.

### R-1818: Tres capas del metamodelo

- Enunciado: la estructura del metamodelo OPM se organiza en tres capas relacionadas:
  - **Modelo OPM individual** → conjunto de OPDs + especificación OPL + metadatos persistentes
  - **Conjunto de OPDs** → OPDs → constructos OPD → conjuntos de cosas + conjuntos de enlaces
  - **Especificación OPL** → párrafos OPL → oraciones OPL → frases y nombres reservados
- Referencia SSOT: `opm-iso-19450-es.md` §Metamodelo OPM
- Aplicación en código: arquitectura del kernel refleja esta estratificación.

### R-1819: Herencia de afiliación — cadena estructural

- Enunciado: la afiliación se hereda por la cadena estructural. Atributos de objetos ambientales son automáticamente ambientales; procesos de entidades ambientales son ambientales.
- Referencia SSOT: V-74
- Aplicación en código: cálculo efectivo de afiliación vs declaración explícita.

### R-1820: Cosas referenciables externamente

- Enunciado: toda cosa que pueda ser referenciada desde otro modelo DEBE exponer un identificador persistente recuperable en la serialización.
- Referencia SSOT: V-252, `opm-iso-19450-es.md` §Metamodelo
- Aplicación en código: ID único por cosa (no solo por OPD).

### R-1821: Consistencia global del modelo

- Enunciado: un hecho afirmado en un OPD NO puede contradecir un hecho afirmado en otro OPD del mismo modelo (V-98).
- Referencia SSOT: V-98
- Aplicación en código: validador cross-OPD.

### R-1822: Dualidad preservada dentro de cada modelo individual

- Enunciado: en modelos compuestos, la dualidad OPD↔OPL se preserva íntegramente **dentro** de cada modelo individual. La composición entre modelos NO colapsa esa dualidad en una única especificación cerrada.
- Referencia SSOT: V-251, §18.1
- Aplicación en código: OPL autocontenido por modelo individual.

## Checklist

- [ ] Modelo OPM tiene OPDs + OPL + (opcional) sub-modelos
- [ ] Dualidad OPD↔OPL bidireccional preservada localmente
- [ ] Átomo mínimo: 1 enlace + 2 cosas
- [ ] Enlace: origen + destino + conector (línea + símbolo + etiqueta?)
- [ ] Objeto con `s` estados → proyección a `s` objetos específicos de estado
- [ ] Existencia única, apariencias locales, referencias externas como conceptos distintos
- [ ] Eliminar apariencia ≠ eliminar cosa
- [ ] Cosas referenciables exponen URI/handle persistente
- [ ] Marcas cross-model como gramática de vista, no nuclear
- [ ] Nombre canónico definido a nivel de existencia, no apariencia
- [ ] Unicidad nominal global del modelo
- [x] Silueta desplazada para apariencias duplicadas en mismo OPD
- [ ] OPL autocontenido por modelo individual en compuestos

## Antipatrones

- Dos apariencias de la misma cosa con propiedades divergentes (esencia distinta, etc.)
- Eliminar cosa del modelo al borrarla de un OPD
- Referencia externa sin URI persistente
- Apariencias duplicadas en el mismo OPD sin silueta desplazada
- Colapsar OPL de múltiples modelos en un único texto global
- Nombre canónico editable a nivel de apariencia

## Referencias cruzadas

- Sub-modelos: `42-sub-modelos-inter-modelo.md`
- Navegación e identidad: `40-navegacion-arbol-identidad.md`
- Enlaces y anatomía: `12-enlaces-decoraciones-marcas.md`
- Estados: `11-estados-designaciones.md`
- OPL y dualidad: `70-opl-convenciones-y-plantillas-cosa-estado.md`
