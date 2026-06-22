# 40 — Navegación del árbol OPD e identidad persistente

**Alcance**: SD, etiquetado `SDx.y`, árbol de procesos / de objetos, tres categorías de OPD, separación de canales (temporal / navegación / identidad), identificador persistente.
**Capa SSOT propietaria**: `opm-visual-es.md` §15
**Aplicación en la app**: `src/persistencia/` (identidad), UI de navegación entre OPDs, generador OPL.

## Reglas

### R-1700: V-46 — SD contiene exactamente un proceso sistémico

- Enunciado: el SD (System Diagram) contiene exactamente **un proceso sistémico**. Puede contener procesos ambientales.
- Referencia SSOT: V-46
- Aplicación en código: validador emite error `CRÍTICA` si el SD tiene 0 o 2+ procesos sistémicos.
- Excepción: vistas de sub-modelo pueden no cumplir V-46 (V-186).

### R-1701: Convención de etiquetas

- Enunciado: las etiquetas visibles de OPD siguen el patrón: `SD` → `SD1` → `SD1.1` → `SD1.1.1`, etc.
- Referencia SSOT: §15.1
- Aplicación en código: la herramienta genera etiquetas al crear nodos; son proyecciones humanas de navegación.

### R-1702: V-247 — `SDx.y` es proyección humana, no identidad

- Enunciado: la etiqueta `SDx.y` es una proyección humana del **orden de navegación** combinada con la profundidad del árbol. NO es identificador persistente. Puede mutar bajo reordenamiento de hermanos o inserción/eliminación de nodos.
- Referencia SSOT: V-247
- Aplicación en código: las referencias internas usan `opdId: UUID`, no `sdLabel`.

### R-1703: V-248 — Identificador persistente obligatorio

- Enunciado: toda implementación conforme DEBE asignar a cada OPD un **identificador persistente**, estable bajo reordenamiento del árbol y bajo renumeración de etiquetas. La forma concreta (UUID, slug persistente, URI) es elección de implementación, pero la serialización del modelo DEBE preservarlo.
- Referencia SSOT: V-248
- Aplicación en código: `src/persistencia/` garantiza `opd.id` estable; ADR documenta la forma (ej. UUIDv4).

### R-1704: V-249 — Referencias externas citan ID persistente

- Enunciado: toda referencia externa al modelo que cite un OPD concreto (documentos, trazabilidad de requisitos, tests) DEBE usar el identificador persistente de V-248, NO `SDx.y`. La SSOT no admite como referencia estable ninguna designación derivada del layout.
- Referencia SSOT: V-249
- Aplicación en código: exportadores, tests, enlaces cross-model usan el ID persistente.

### R-1705: V-250 — Acoplamiento de proyección

- Enunciado: el producto del acoplamiento entre coordenada vertical del canvas, orden en OPL y posición del árbol es un rasgo operacional. La SSOT lo reconoce como acoplamiento de **proyección**, no de **identidad**: los tres canales pueden derivarse coherentemente del layout, pero ninguno sustituye al identificador persistente.
- Referencia SSOT: V-250
- Aplicación en código: documentar en ADR que los tres canales son vistas, no ID.

### R-1706: V-246 — Tres canales independientes del OPD

- Enunciado: todo OPD conforme distingue operacionalmente tres canales:
  - **Orden temporal**: derivado de coordenada vertical de subprocesos (§10.4, V-35, V-55)
  - **Orden de navegación**: posición del OPD en el árbol
  - **Identidad persistente**: identificador estable
- Referencia SSOT: V-246 (D6)
- Aplicación en código: el modelo separa los tres conceptos.

### R-1707: Árbol de procesos OPD

- Enunciado: el árbol de procesos OPD tiene raíz en `SD`. Cada nodo corresponde a un OPD creado por descomposición de un proceso. Es el **mecanismo principal de navegación** del modelo.
- Referencia SSOT: §15.2
- Aplicación en código: estructura de datos del árbol gobierna el breadcrumb.

### R-1708: Árbol de objetos OPD

- Enunciado: el árbol de objetos OPD tiene raíz en un objeto. Muestra su elaboración por refinamiento (exhibición, agregación, etc.).
- Referencia SSOT: §15.3
- Aplicación en código: navegación alternativa por objeto.

### R-1709: V-114 — Tres categorías de OPD

- Enunciado: el árbol de OPDs de un modelo admite tres categorías **distintas y mutuamente excluyentes**:

| Categoría | Definición |
|---|---|
| **OPD jerárquico** | Nace por refinamiento de una cosa del modelo (in-zooming u unfolding). Participa del árbol por relación padre-hijo derivada de refinamiento. |
| **OPD de vista anclada** | Vive en el árbol por posición, pero no por refinamiento. Incluye: Vista de Sub-modelo (§23), Mapa del Sistema, Vista de Requisitos (§19.7), y otras vistas tipificadas por la implementación. |
| **OPD de vista ad hoc** | Colección editorial transitoria no anclada al árbol jerárquico ni a una vista tipificada. No participa de refinamiento. |

- Referencia SSOT: V-114 reescrita
- Aplicación en código: cada OPD tiene `categoria: "jerárquico" | "vista_anclada" | "vista_ad_hoc"`.

### R-1710: V-244 — Reglas distintas por categoría

- Enunciado: las tres categorías admiten reglas distintas de creación, eliminación y navegación. La implementación DEBE declarar en su metadato a qué categoría pertenece cada OPD del modelo.
- Referencia SSOT: V-244 (D5)
- Aplicación en código: persistencia serializa la categoría.

### R-1711: V-245 — Eliminabilidad por categoría

- Enunciado:
  - **OPD jerárquico**: solo es eliminable si es **hoja** del subárbol jerárquico
  - **OPD de vista anclada**: eliminable según política del tipo de vista; una vista tipificada puede ser **regenerable** por su fuente
  - **OPD de vista ad hoc**: eliminable libremente sin afectar la jerarquía
- Referencia SSOT: V-245
- Aplicación en código: botón "eliminar OPD" verifica categoría y dependencias.

### R-1712: V-113 revisada — Solo hojas jerárquicas eliminables

- Enunciado: solo los OPDs jerárquicos **hoja** son eliminables directamente del árbol jerárquico. Los nodos jerárquicos internos quedan protegidos para preservar la integridad del refinamiento. Las vistas ancladas y ad hoc se eliminan por las reglas propias de su tipo.
- Referencia SSOT: V-113 revisada
- Aplicación en código: validador bloquea eliminación de nodo jerárquico interno.

### R-1713: Etiqueta de arista del árbol OPD

- Enunciado: cada arista del árbol de procesos usa un enlace estructural etiquetado unidireccional con una fórmula de refinamiento equivalente a:
  - `se refina por descomposición de NombreProceso en`
  - `se refina por despliegue de NombreCosa en`
- Referencia SSOT: `opm-iso-19450-es.md` §Etiquetas OPD
- Aplicación en código: el generador OPL emite sentencias de refinamiento entre OPDs.

### R-1714: Vistas ancladas tipificadas

- Enunciado: ejemplos típicos de vista anclada:
  - Vista de Sub-modelo (V-180)
  - Mapa del Sistema (índice navegable por miniaturas)
  - Árbol de procesos
  - Árbol de objetos
  - Vista de Requisitos (V-254)
- Referencia SSOT: V-114, `metodologia-opm-es.md` §8.3
- Aplicación en código: UI enumera las vistas tipificadas disponibles.

### R-1715: Vistas ad hoc como colecciones editoriales

- Enunciado: ejemplos típicos de vista ad hoc:
  - Vista de asignación
  - Vista motivada por simulación
  - Vista temática para revisión de un requisito o escenario
- Referencia SSOT: `metodologia-opm-es.md` §8.3
- Aplicación en código: crear vista ad hoc sin obligación de refinamiento.

### R-1716: V-243 revisita — Bring produce vistas ancladas o ad hoc

- Enunciado: operaciones como Bring pueden crear OPDs derivados nombrados (por ejemplo, `<cosa> unfolded`) sin que esto constituya un mecanismo canónico de refinamiento. Esos OPDs derivados se clasifican como vistas ancladas o ad hoc según el tipo.
- Referencia SSOT: V-262, `metodologia-opm-es.md` §8.1
- Aplicación en código: clasificar explícitamente al generar el OPD.

### R-1717: Simplificación de OPD

- Enunciado: un subconjunto de subprocesos puede reagruparse en un nuevo proceso compacto mediante recomposición, generando un OPD simplificado con menos niveles.
- Referencia SSOT: §10.7, `opm-iso-19450-es.md` §Simplificación de un OPD
- Aplicación en código: operación explícita en UI; restricción: no crear enlaces procedimentales ilegales entre procesos pares.

### R-1718: Mapa del Sistema

- Enunciado: vista anclada al árbol que muestra el contenido de cada OPD como índice navegable mediante miniaturas o equivalentes. NO constituye refinamiento. El modelador DEBERÍA generarlo para modelos con más de 10 OPDs.
- Referencia SSOT: `metodologia-opm-es.md` §8.2, §16; V-205 (navegación)
- Aplicación en código: mapa del sistema como vista anclada separada.

### R-1719: Principio de consistencia de hechos OPM

- Enunciado: si un hecho aparece en un OPD y contradice otro hecho del mismo modelo en otro OPD, el modelo es inconsistente y la herramienta DEBERÍA detectarlo. Que un hecho sea refinamiento o abstracción de otro NO constituye contradicción.
- Referencia SSOT: `opm-iso-19450-es.md` §Principio de consistencia de hechos OPM, V-98
- Aplicación en código: validador cross-OPD.

### R-1720: Convención de orden OPL

- Enunciado: la secuencia de párrafos OPL sigue en general el **orden de navegación** del árbol, comenzando desde `SD`. Ese orden puede proyectarse desde el layout del padre, pero NO sustituye la identidad persistente del OPD.
- Referencia SSOT: `opm-iso-19450-es.md` §Etiquetas OPD
- Aplicación en código: generador OPL recorre el árbol en pre-orden.

### R-1721: Coherencia entre etiqueta visible y contexto

- Enunciado: la etiqueta `SDx.y` debe corresponder a la posición actual en el árbol. Si el modelador reordena hermanos, la etiqueta debe renumerarse automáticamente (es proyección humana, no ID).
- Referencia SSOT: V-247, V-248
- Aplicación en código: la herramienta renumera `SDx.y` al reordenar; el ID persistente no cambia.

### R-1722: Importancia proyectada al OPD más alto

- Enunciado: la importancia relativa de una cosa es proporcional al OPD más alto de la jerarquía donde aparece (V-99).
- Referencia SSOT: V-99
- Aplicación en código: métricas de importancia del modelo.

### R-1723: OPD Último (flat-model) como capa derivada

- Enunciado: el **OPD Último** es una representación plana obtenida por aplanamiento recursivo del árbol OPD local. Es útil para uso automatizado, pero NO sustituye la identidad persistente ni la estructura explícita de referencias entre modelos.
- Referencia SSOT: `metodologia-opm-es.md` §8.2
- Aplicación en código: exportador puede emitir el flat-model como vista derivada.

## Checklist

- [ ] SD tiene exactamente un proceso sistémico
- [ ] Etiquetas `SDx.y` se generan automáticamente
- [ ] `SDx.y` es proyección, no identidad
- [ ] Cada OPD tiene ID persistente serializado
- [ ] Referencias externas usan ID persistente
- [ ] Tres canales distinguidos: temporal / navegación / identidad
- [ ] Cada OPD clasificado en una de las 3 categorías
- [ ] OPDs jerárquicos internos no eliminables
- [ ] Vistas ancladas regenerables por su fuente cuando aplica
- [ ] Vistas ad hoc eliminables libremente
- [ ] Etiquetas de arista del árbol con fórmula de refinamiento
- [ ] Mapa del Sistema generado para modelos >10 OPDs
- [ ] Orden OPL sigue orden de navegación del árbol
- [ ] Renumeración automática al reordenar hermanos
- [ ] Consistencia cross-OPD verificada (no contradicciones)

## Antipatrones

- Usar `SDx.y` como ID de trazabilidad externa (viola V-249)
- Permitir eliminar un OPD jerárquico interno
- Tratar una vista ad hoc como refinamiento
- SD con dos procesos sistémicos
- Referencia externa a un OPD que cambia al reordenar
- Crear OPD sin categoría declarada

## Referencias cruzadas

- Refinamiento: `30-refinamiento-entre-opds.md`
- Metamodelo: `41-metamodelo-apariencia-existencia.md`
- Sub-modelos: `42-sub-modelos-inter-modelo.md`
- Orden temporal: `21-tiempo-paralelismo-orden.md`
- Operaciones auxiliares: `64-operaciones-auxiliares-bring.md`
- Metodología (SD): `80-metodologia-construccion-sd.md`
- OPL (refinamiento): `73-opl-plantillas-contexto-y-multiplicidad.md`
