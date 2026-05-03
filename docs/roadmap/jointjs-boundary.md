# Frontera JointJS

**Fecha:** 2026-05-03
**Estado:** adapter minimo implementado

## Punto alcanzado con SVG directo

La app puede seguir sin JointJS mientras la interaccion sea simple:

- crear objetos y procesos;
- seleccionar entidades;
- editar nombre, esencia y afiliacion;
- mover entidades con drag simple;
- crear enlaces basicos por firma;
- eliminar entidades con cascada de enlaces;
- renderizar links rectos con hit area y markers basicos;
- generar OPL-ES reactivo;
- exportar/importar JSON;
- guardar/cargar en `localStorage`;
- cargar demo minimo.

## Donde empieza a justificarse JointJS

No implementar a mano, salvo spike deliberado:

- puertos canonicos invisibles por perimetro (`port-group: aaa`);
- reanclaje de extremos de enlace;
- vertices manuales persistentes;
- routing manhattan con `padding: 5`, `step: 11`, obstaculos y links excluidos;
- herramientas de link (`Boundary tool`, handles, reconnect);
- seleccion multiple y transformaciones de grupo;
- bus estructural de agregacion con triangulo compartido;
- undo/redo visual fino de interacciones de canvas;
- coexistencia robusta de drag, link-editing y hit areas.

## Regla operativa

La decision ya se tomo: JointJS queda encapsulado como renderer/interaccion
detras de `app/src/render/jointjs/`. El `Modelo` propio sigue siendo la fuente
de verdad; `dia.Graph` se reconstruye/proyecta desde el modelo y nunca se
serializa como contrato OPM.

## Adapter minimo actual

Implementado:

- `Modelo -> JointCellJson[]` en `app/src/render/jointjs/proyeccion.ts`.
- `Apariencia.id -> dia.Element.id`.
- `AparienciaEnlace.id -> dia.Link.id`.
- metadata visual `{ opdId, entidadId, aparienciaId }` / `{ opdId, enlaceId, aparienciaEnlaceId, tipo }`.
- seleccion por click en elementos.
- drag de elementos con commit al store via `moverAparienciaPorId`.
- enlace visual `standard.Link` desde apariencias origen/destino.
- seleccion de enlaces por click desde JointJS.
- link tools visibles en enlace seleccionado (`Boundary`, `Vertices`, `Segments`).
- vertices manuales editables y persistidos en `AparienciaEnlace.vertices`.
- eliminacion de enlaces sin borrar entidades.
- inspector minimo de enlace.
- vertices de link preparados en modelo via `actualizarVerticesEnlace`.
- smoke browser con Playwright en `app/e2e/opm-smoke.spec.ts`.

No implementado todavia:

- puertos canonicos por tipo de link;
- reanclaje/reconexion validado por firmas OPM;
- routing manhattan OPCloud-like;
- bus de agregacion compartido;
- propiedades avanzadas de enlaces.

## Siguiente corte recomendado

Antes de link editing completo, hacer un slice pequeno:

1. normalizar seleccion interna a `{ tipo: "entidad" | "enlace"; id }`;
2. preparar puertos canonicos invisibles por perimetro;
3. validar reanclaje/reconexion via operaciones OPM antes de habilitar arrowhead tools;
4. smoke browser: reconectar enlace permitido y rechazar enlace ilegal sin mutar modelo.
