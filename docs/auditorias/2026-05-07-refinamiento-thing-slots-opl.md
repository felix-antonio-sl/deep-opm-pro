# Auditoria L1 ronda 14.1 - refinamiento Thing slots y OPL

## Alcance

Brief: `docs/instrucciones-lineas-dev/ronda14.1/linea-1-refinamiento-thing-hardening.md`.

Slice auditado:

- deuda de slots `refineeInzooming` / `refineeUnfolding` / `refineable`;
- e2e especifico para `object-inzoom` y `process-unfold`;
- OPL de descomposicion de objeto contra SSOT OPM.

No se audita OPL reverse, OPX import ni paridad total de persistencia OPCloud.

## Evidencia normativa

SSOT visual:

- `opm-visual-es.md` V-69: in-zooming y unfolding producen contorno grueso en el refinable.
- `opm-visual-es.md` V-79: en OPD hijo la cosa refinada aparece como contenedor; en descomposicion de objeto el rectangulo contiene componentes.
- `opm-visual-es.md` V-80..V-85: los externos conectados se copian al OPD hijo; los internos son propios del refinamiento.

SSOT OPL:

- `opm-opl-es.md` define `oracion_de_descomposicion_objeto_en_diagrama` como objeto que se descompone en `lista_de_objetos`, opcionalmente con `lista_de_procesos_en_zoom`.
- `opm-opl-es.md` define `oracion_de_despliegue_proceso` ademas de `oracion_de_despliegue_objeto`; por tanto `process-unfold` es semantica OPM valida.

Evidencia OPCloud secundaria:

- `opm-extracted/src/app/models/VisualPart/OpmVisualThing.ts` mantiene `refineable`, `refineeInzooming` y `refineeUnfolding` por visual thing.
- `opm-extracted/src/app/models/json.model.ts` serializa/reconecta `refineableId`, `refineeInzoomingId`, `refineeUnfoldingId`.
- `opm-extracted/src/app/ImportOPX/OPX.API.ts` reconstruye relaciones de refinamiento visual entre OPDs.
- `opm-extracted/src/app/models/modules/attribute-validation/validation-module.ts` contiene plantillas para unfolding de objeto y proceso.

## Modelo local vs OPCloud

Modelo local vigente:

```ts
entidad.refinamiento?: {
  tipo: "descomposicion" | "despliegue";
  opdId: Id;
  modo?: ModoDespliegueObjeto;
}
```

OPCloud visual:

```text
refineable
refineeInzooming
refineeUnfolding
```

La diferencia real es simultaneidad: OPCloud puede conservar in-zoom y unfold separados para la misma visual thing; el modelo local puede representar solo un refinamiento activo por entidad.

## Contraejemplo Beta1

No se encontro contraejemplo Beta1 que requiera simultaneidad `inzoom + unfold` sobre la misma Thing.

El eval inmediato de Beta1 queda representado por el schema actual:

- objeto con in-zoom: `refinamiento.tipo === "descomposicion"`;
- proceso con unfold: `refinamiento.tipo === "despliegue"`;
- navegacion OPD padre-hijo por `opdId`;
- contorno refinable + internos en OPD hijo;
- OPL forward por tipo de refinamiento.

Lo que el schema actual no puede representar:

- una misma entidad con in-zoom y unfold activos al mismo tiempo;
- import/export OPX lossless de las tres referencias visuales OPCloud;
- UI que muestre dos OPDs hijos paralelos para la misma Thing.

Nada de eso aparece como bloqueo del slice Beta1 L1.

## Costo de migrar ahora

Blast radius estimado de migracion a slots separados:

- tipos: `app/src/modelo/tipos/entidad.ts`;
- operaciones: descomposicion, despliegue, helpers de eliminacion y navegacion OPD;
- serializacion y validacion;
- store `acciones-opd` y runtime;
- UI inspector, barra contextual, arbol OPD, plegado parcial;
- OPL forward e interactivo;
- fixtures, imports JSON y tests e2e.

Reversibilidad: media-baja. El cambio toca persistencia, navegacion jerarquica y compatibilidad de modelos guardados. Requiere migrador o tolerancia dual de schema para no romper modelos existentes.

## Decision

Recomendacion L1: **schema vNext**.

Mantener `entidad.refinamiento` para Beta1 y documentar slots separados como deuda consciente. Migrar solo cuando exista una HU/eval que exija simultaneidad de in-zoom y unfold o import/export OPX lossless de refinamientos visuales.

## OPL de descomposicion de objeto

Hallazgo: el generador OPL ya aceptaba object-inzoom, pero su formula era demasiado general para descomposicion mixta: podia mezclar procesos internos dentro de la lista principal de componentes.

Correccion aplicada:

- objeto descompuesto: componentes objeto en la lista principal;
- procesos internos: se emiten como `así como ...`;
- proceso descompuesto: subprocesos en la lista principal y objetos internos como `así como ...`;
- se conserva el wording historico de proceso con secuencia para no abrir una refactorizacion OPL amplia.

Ejemplo esperado:

```text
**Vehiculo** se descompone en **Vehiculo 1**, **Vehiculo 2** y **Vehiculo 3** en esa secuencia, así como *Inspeccionar*.
```

## Cobertura agregada

Unit:

- `app/src/opl/generadores/refinamiento.test.ts`
  - descomposicion de objeto lista componentes como objetos;
  - descomposicion de objeto separa operaciones internas.
- `app/src/opl/generar.test.ts`
  - OPL forward para object decomposition;
  - OPL interactivo conserva refs/hints de componentes y procesos internos.

Browser:

- `app/e2e/05-refinamiento-y-plegado.spec.ts`
  - object-inzoom desde barra contextual;
  - process-unfold desde inspector con modo agregacion.

## Deuda residual

- Schema vNext: slots separados por entidad/visual thing.
- Migracion dual: leer `refinamiento` legacy y escribir slots nuevos cuando se active vNext.
- Paridad OPX: mapear `refineableId`, `refineeInzoomingId`, `refineeUnfoldingId` sin perdida.
- OPL reverse de refinamiento sigue fuera de este slice.
