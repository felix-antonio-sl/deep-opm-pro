# Politica Categorial De Apariciones En OPD

Fecha: 2026-05-19
Estado: normativo operativo

## Problema

El modelo distingue entidades globales y apariciones locales, pero esa
distincion no estaba formulada como regla unica. La pregunta "debe mostrarse
esta entidad en este diagrama?" quedaba repartida entre render, refinamiento,
creacion, limpieza de externos y validaciones.

## Reformulacion Categorial

Categoria base minima: Set, con una familia indexada por OPD.

- Objeto global: `Entidad`.
- Contexto/base: `Opd`.
- Fibra sobre un OPD: conjunto `opd.apariencias`.
- Objeto total: par local `(opdId, apariencia)` proyectado a una entidad global.
- Render: funtor desde la fibra local del OPD activo hacia celdas JointJS.
- Refinamiento: reindexacion controlada entre fibras padre/hijo.

La regla estructural es:

```text
Entidad visible en OPD  <=>  existe Apariencia en la fibra opd.apariencias
```

Esto sigue el patron schema/instancia y preservacion functorial de
`urn:fxsl:kb:icas-preservacion`: no basta mapear una entidad global al render;
la traduccion debe preservar identidad y composicion en el contexto local.

Tambien usa la lectura de familias parametrizadas/fibrations de
`urn:fxsl:kb:icas-extension`: las apariciones no son atributos globales de la
entidad, sino secciones locales sobre cada OPD. El render observa una fibra, no
el total completo.

## Decision Normativa

1. La visibilidad tiene una sola SSOT operacional: `opd.apariencias`.
2. `modelo.entidades` declara existencia global, no visibilidad local.
3. `contextoRefinamiento` declara rol/propiedad de refinamiento, no visibilidad.
4. El render debe seguir siendo un funtor simple: dibuja toda aparicion de la
   fibra activa y no inventa ni filtra apariciones semanticas.
5. La limpieza automatica solo aplica a apariciones cuyo origen sea
   `refinamiento-externo-materializado`.
6. Las apariciones manuales o contextuales no se eliminan por re-sincronizacion
   de refinamiento salvo accion explicita del usuario.

## Clasificacion Operativa

`app/src/modelo/politicaApariciones.ts` materializa la politica:

- `entidadVisibleEnOpd`: pertenencia a la fibra local.
- `aparicionesVisiblesEnOpd`: enumeracion canonica de la fibra activa.
- `aparienciaDeEntidadEnOpd`: lookup canonico entidad -> aparicion local.
- `entidadesVisiblesEnOpd`: conjunto derivado de entidades visibles en un OPD.
- `opdIdDeEntidadVisible`: resolucion canonica de primer OPD donde una entidad
  tiene aparicion, con preferencia por el OPD activo.
- `aparienciaRenderizableEnOpd`: pertenencia por id de apariencia en el OPD.
- `clasificarAparicion`: origen, rol de refinamiento, confinamiento y limpieza.
- `aparienciaLimpiableAutomaticamente`: unico gate para limpieza automatica.

Los consumidores de render, OPL, validacion, store, enlaces, plegado,
fixtures y helpers de refinamiento deben factorizar las consultas
"entidad visible en OPD" y "aparicion local de entidad" por esta politica.
Leer `opd.apariencias` directamente sigue permitido cuando el codigo esta
manipulando la fibra como coleccion local, pero no para redefinir el predicado
de visibilidad.

Origenes admitidos:

- `manual`
- `refinamiento-contorno`
- `refinamiento-interno`
- `refinamiento-externo-materializado`
- `plegado-extraido`

## Leyes De Coherencia

- Identidad: una apariencia renderizada debe conservar su `id`, `opdId` y
  `entidadId`; renombrar o mover no cambia la pertenencia a la fibra.
- Composicion: crear/refinar/sincronizar/renderizar debe equivaler a
  crear/refinar/sincronizar y luego proyectar la fibra activa.
- Faithfulness local: dos apariciones distintas del mismo OPD no deben
  colapsarse accidentalmente en una celda indistinguible.
- No fullness global: no toda entidad global tiene que aparecer en todo OPD.
  Esta perdida es intencional y declarada.
- Naturalidad de refinamiento: si un enlace padre exige una entidad externa en
  el OPD hijo, la materializacion debe ser coherente con la limpieza posterior.

## Formal Vs Heuristico

Formal dentro del codigo: la equivalencia operacional entre visibilidad y
pertenencia a `opd.apariencias`.

Heuristico: llamar "fibracion" a la arquitectura completa de OPDs. El patron es
el adecuado por familias indexadas, pero el codigo no implementa una fibration
matematica completa con liftings cartesianos explicitados.

URNs usadas:

- `urn:fxsl:kb:icas-preservacion`
- `urn:fxsl:kb:icas-extension`
- `urn:fxsl:kb:icas-identidad-relacion`
