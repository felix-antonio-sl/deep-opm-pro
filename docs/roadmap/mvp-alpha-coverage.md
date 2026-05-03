# MVP-alpha coverage

**Fecha:** 2026-05-03
**Estado:** vivo

## Criterio de lectura

Fuente de backlog: `docs/historias-usuario-v2/`.

Fuente de evidencia OPCloud: `opm-extracted/` y `docs/JOYAS.md`.

Fuente de verdad de implementacion: `app/src/modelo/` + `app/src/render/jointjs/`.

Estados:

- **Cubierto:** existe implementacion, test o smoke.
- **Parcial:** existe vertical slice, pero faltan criterios M0 relevantes.
- **Pendiente:** no hay implementacion usable.

## Resumen

| Area | Estado | Evidencia app | Evidencia OPCloud considerada |
|---|---|---|---|
| EPICA-10 creacion de cosas | Parcial | `app/src/modelo/operaciones.ts`, `app/src/ui/Toolbar.tsx`, `app/e2e/opm-smoke.spec.ts` | `opm-extracted/src/app/models/VisualPart/OpmVisualObject.ts`, `OpmVisualProcess.ts`, `docs/JOYAS.md` |
| EPICA-11 modelado basico | Parcial | `app/src/render/jointjs/JointCanvas.tsx`, `app/src/render/jointjs/proyeccion.ts` | `opm-extracted/src/app/models/DrawnPart/Links/*.ts`, `opm-extracted/src/app/configuration/rappidEnviromentFunctionality/shared.ts` |
| EPICA-20 arbol OPD | Parcial | `app/src/ui/ArbolOpd.tsx`, `opdActivoId` en `app/src/store.ts`, smoke `opm-opd-tree.png` | `opm-extracted/src/app/opd-hierarchy/`, `opm-extracted/src/app/models/LogicalPart/OpmLogicalThing.ts` |
| EPICA-30 persistencia | Parcial | `app/src/serializacion/json.ts`, `app/src/ui/PersistenciaJson.tsx`, localStorage | `opm-extracted/src/app/rappid-components/services/graph.service.ts`, `opm-extracted/src/app/models/json.model.ts` |
| EPICA-50 OPL-ES | Parcial | `app/src/opl/generar.ts`, `app/src/ui/PanelOpl.tsx` | `opm-extracted/src/app/dialogs/opl-dialog/`, `opm-extracted/src/app/modules/app/export-opl.service.ts` |
| HU-SHARED-002 undo/redo | Parcial | `app/src/store.ts`, `app/src/ui/Toolbar.tsx`, `app/src/store.test.ts`, `app/e2e/opm-smoke.spec.ts` | OPCloud usa `UndoRedoOperation`/acciones; MVP-alpha usa snapshots reemplazables |
| HU-SHARED-006 dirty state | Parcial | `snapshotGuardado`, titulo `(No guardado)`, save limpia dirty, undo hasta snapshot lo limpia | OPCloud muestra `(Not Saved)`; contrato canonico en `docs/historias-usuario-v2/shared/HU-SHARED-006-dirty-state.md` |
| HU-SHARED-007 eco OPL | Parcial | canvas -> OPL | OPL dialog/export en `opm-extracted/src/app/dialogs/opl-dialog/` |
| HU-SHARED-008 seleccion canvas | Parcial | seleccion entidad/enlace | JointJS selection/halo en `opm-extracted/src/app/configuration/rappidEnviromentFunctionality/shared.ts` |

## Cubierto hoy

- Modelo separa entidad logica y apariencia visual.
- SD inicial existe como `opdRaizId`.
- Crear objeto/proceso con dimensiones, colores y tipografia canonicas.
- Editar nombre, esencia y afiliacion desde inspector.
- Crear enlaces legales basicos por firma:
  - agregacion `objeto -> objeto`;
  - agente `objeto fisico -> proceso`;
  - instrumento `objeto -> proceso`;
  - consumo `objeto -> proceso`;
  - resultado `proceso -> objeto`;
  - efecto `objeto <-> proceso`;
  - invocacion `proceso -> proceso`.
- Seleccionar entidad y enlace.
- Eliminar entidad con cascada.
- Eliminar enlace sin borrar entidades.
- Arrastrar entidad y persistir `Apariencia`.
- Renderizar marcadores procedimentales basicos segun SSOT: corchete + piruleta para habilitadores, puntas cerradas transformadoras, invocacion zigzag y efecto bidireccional.
- Renderizar agregacion basica con triangulo estructural separado del enlace.
- Aplicar routing manhattan basico `padding: 5`, `step: 11` en enlaces procedimentales.
- Mostrar JointJS link tools `Boundary`, `Vertices`, `Segments`.
- Crear/mover vertices de enlace y persistir `AparienciaEnlace.vertices`.
- Mantener handles JointJS de edicion en canal UI naranja, separado del azul canonico `#586D8C`.
- Elegir tipo de enlace desde selector compacto para evitar overflow de toolbar.
- Generar OPL-ES forward para cosas y enlaces basicos.
- Exportar/importar JSON propio.
- Guardar/cargar localStorage.
- Dirty state computado contra snapshot guardado.
- Deshacer/rehacer por botones y `Ctrl+Z`/`Ctrl+Y`/`Ctrl+Shift+Z`.
- Stack undo/redo snapshot con profundidad 100 y purge de redo tras nueva operacion.
- Smoke browser con capturas.

## Brechas MVP-alpha

### Alta prioridad inmediata

1. **HU-SHARED-002 undo/redo restante**
   - Minimo operativo implementado con snapshots de `Modelo` y profundidad 100.
   - Falta ampliar smoke por operacion: eliminar/renombrar/mover/cambiar esencia-afiliacion/enlace/vertices.
   - Decision temporal: snapshots son suficientes para MVP-alpha; comandos inversos quedan para cuando aumente el costo de memoria o se requiera auditoria granular.

2. **HU-SHARED-006 dirty state restante**
   - Minimo operativo implementado contra `snapshotGuardado`.
   - Falta dialogo Guardar / Descartar / Cancelar al cerrar o navegar cuando exista navegacion real entre modelos.

3. **EPICA-20 arbol OPD restante**
   - Minimo operativo implementado: panel con nodo raiz `SD`, `opdActivoId` en store, clic en nodo cambia canvas y OPL activo.
   - Falta descomposicion/unfold para crear hijos desde UI.
   - Falta gestion avanzada: renombrar, eliminar hojas, ordenar, expandir/colapsar y atajos.

### Siguiente prioridad

4. **EPICA-30 persistencia real**
   - IndexedDB o storage estructurado local.
   - Lista de modelos.
   - Cargar fixture canonico.

5. **EPICA-50 OPL bidireccional**
   - Hoy es solo forward.
   - Edicion OPL -> modelo queda fuera hasta estabilizar parser.

6. **Puertos y reconexion**
   - Ya hay vertices/tools.
   - Antes de permitir arrowheads, implementar validacion de reconexion contra firmas OPM.

## Reglas de uso de `opm-extracted/`

- Usar primero `opm-extracted/INDEX.md` para ubicar clases.
- Leer archivos puntuales, no copiar arquitectura Angular/Firebase/Rappid.
- Reusar valores observacionales:
  - color `#70E483`, `#3BC3FF`, `#586D8C`;
  - dimensiones `135x60`;
  - wrapper `15px`, line `2px`;
  - routing/ports/markers como evidencia.
- Si `opm-extracted/` tensiona con SSOT OPM, manda SSOT.

## Verificacion actual

Ultimo loop verde en `app/`:

- `bun run check`
- `bun run browser:smoke`
- `bun run build`

Capturas esperadas:

- `app/test-results/opm-demo-jointjs.png`
- `app/test-results/opm-opd-tree.png`
- `app/test-results/opm-drag-jointjs.png`
- `app/test-results/opm-dirty-undo-redo.png`
- `app/test-results/opm-link-tools-jointjs.png`
- `app/test-results/opm-agregacion-triangulo.png`
