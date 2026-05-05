# Linea 3 — Eliminacion segura de OPDs hoja

## 1. Mision

Agregar eliminacion segura desde el arbol OPD: permitir borrar solo nodos hoja, bloquear nodos internos con mensaje claro y mantener integridad del modelo al remover el refinamiento asociado.

**Slice minimo entregable**: accion "Eliminar OPD" en `ArbolOpd`, helper kernel `opdEliminacion.ts`, cascada controlada para OPD hoja, bloqueo de OPD con hijos, mensaje "Elimina descendientes primero" y tests unitarios/store/smoke.

**Fuera de slice**: drag-and-drop del arbol, reordenamiento, gestion avanzada Ctrl+D, cut/paste de nodos, eliminacion masiva y UI de historial de eliminaciones.

## 2. HU base

| HU | Path absoluto | Aporte |
|---|---|---|
| HU-20.015 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-20-estructura-arbol-opd.md` | Eliminar solo nodos hoja del arbol con cascada segura. |
| HU-20.016 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-20-estructura-arbol-opd.md` | Bloquear eliminacion de nodos internos con explicacion clara. |
| HU-SHARED-005 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-005-eliminar-con-scope.md` | Patron de eliminacion con alcance controlado. |

## 3. Anclaje a evidencia

- **SSOT**: `opm-iso-19450-es.md` §OPD tree fija raiz `SD` y jerarquia `SD1`, `SD1.1`; `opm-opl-es.md` §10 declara que etiquetas visibles de OPD deben mapear a identificadores persistentes; `metodologia-opm-es.md` §7 y §7b tratan refinamientos descendientes.
- **Corpus interno reusable**:
  - `opm-extracted/MODULES.md` lista `src/app/opd-hierarchy/opdsTreeActions.ts` con `RemoveOpdTreeAction`, `RenameOpdTreeAction`, `ToggleOPDsNamesTreeAction`.
  - `opm-extracted/INDEX.md` mapea `TreeViewService` en `src/app/rappid-components/services/tree-view.service.ts`, con funcion `remove`, y `SelectOpdsTreeDialog` como referencia de seleccion por arbol.
  - `assets/svg/delete.svg` y `assets/svg/deleteFunction.svg` son assets canonicos para acciones de borrado.
- **Estado actual del codigo**:
  - `app/src/ui/ArbolOpd.tsx` construye arbol con `padreId` y navega con click, pero no expone acciones.
  - `app/src/modelo/operaciones.ts` ya tiene `quitarDescomposicionProceso` y `quitarDespliegueObjeto`, que remueven subarboles a partir de una entidad refinada.
  - `app/src/store.ts` tiene `quitarDescomposicionSeleccionada` y `quitarDespliegueSeleccionado`, pero no accion por OPD.
  - `app/src/serializacion/json.ts` normaliza `padreId` y evita OPDs huerfanos al hidratar.

## 4. Archivos permitidos

```text
app/src/modelo/opdEliminacion.ts          NUEVO
app/src/modelo/opdEliminacion.test.ts     NUEVO
app/src/ui/ArbolOpd.tsx                   EDIT aditivo
app/src/ui/DialogoConfirmacion.tsx        LECTURA
app/src/ui/ConfirmacionContext.tsx        LECTURA
app/src/store.ts                          EDIT aditivo
app/src/store.test.ts                     EDIT aditivo
app/e2e/opm-smoke.spec.ts                 EDIT aditivo
assets/svg/delete.svg                     LECTURA
assets/svg/deleteFunction.svg             LECTURA
opm-extracted/**                          LECTURA
/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/** LECTURA
```

## 5. Restricciones de no-colision

- No tocar dialogos de persistencia de L2 ni menu principal.
- No tocar `PanelOpl.tsx`; L1 posee OPL.
- No tocar `operaciones.ts` salvo que el helper nuevo no pueda reusar funciones existentes; preferir mover logica a `opdEliminacion.ts`.
- No permitir borrar `modelo.opdRaizId`.
- No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`.

## 6. Slice minimo shippeable

### Modelo

Crear helper puro:

```ts
export function eliminarOpdHoja(modelo: Modelo, opdId: Id): Resultado<{
  modelo: Modelo;
  opdActivoSugerido: Id;
  entidadRefinadaId: Id | null;
}>;

export function diagnosticarEliminacionOpd(modelo: Modelo, opdId: Id): Resultado<{
  hoja: boolean;
  hijos: Id[];
  motivoBloqueo?: string;
}>;
```

Reglas:

- `SD` raiz no se elimina.
- Si `opdId` tiene hijos, retorna error claro.
- Si es hoja, encontrar entidad con `refinamiento.opdId === opdId`, remover su `refinamiento` y eliminar el OPD.
- Remover entidades/apariencias/enlaces que solo vivian en el OPD eliminado y preservar entidades compartidas con otras apariencias.

### Operaciones

Store:

```ts
eliminarOpdDesdeArbol(opdId: Id): void;
```

Debe confirmar si hay cambios destructivos, usar `commitModelo`, elegir OPD activo seguro y mostrar mensaje.

### Serializacion

Sin cambios.

### Render

Sin cambios JointJS directo. El canvas cambia por `opdActivoId` actualizado.

### OPL

Sin cambios. Tests deben confirmar que no quedan referencias a OPD eliminado.

### UX

En `ArbolOpd`, agregar accion discreta por nodo (boton/icono con title) solo visible/focusable por nodo. Para nodo interno, boton puede estar habilitado y explicar bloqueo, o disabled con title; debe cumplir HU-20.016 con mensaje claro.

### Cross-capa

La eliminacion debe entrar al stack undo existente como una accion. Deshacer debe restaurar el OPD hoja y su refinamiento.

## 7. Tests obligatorios

- Unit kernel: diagnostico bloquea raiz.
- Unit kernel: diagnostico bloquea OPD con hijo y lista hijos.
- Unit kernel: eliminar hoja remueve OPD, limpia `entidad.refinamiento` y no deja apariencias/enlaces huerfanos.
- Store: eliminar OPD activo hoja navega al padre.
- Store: intento de eliminar interno deja modelo intacto y setea mensaje claro.
- Smoke: crear descomposicion anidada, intentar borrar padre (bloqueo), borrar hoja (exito), deshacer restaura.

## 8. Verificacion

```bash
cd app
bun run check
bun run browser:smoke
bun run build
```

## 9. Decisiones bloqueadas (no reabrir)

- La raiz `SD` no se elimina.
- Solo nodos hoja entran al slice.
- La operacion es destructiva pero undoable.
- No hay gestion avanzada de arbol en esta linea.

## 10. Decisiones que tomas vos (documentar en commit)

- Si el boton eliminar se muestra siempre o solo al hover/focus del nodo.
- Si la confirmacion usa `ConfirmacionContext` o mensaje inline con segundo click; preferir confirmacion existente.
- Como nombrar el mensaje exacto de bloqueo, manteniendo "Eliminar descendientes primero".
- Si al borrar hoja activa se navega al padre o al SD; preferir padre.

## 11. Forma del entregable

Commits sugeridos:

- `feat(modelo): elimina opds hoja de forma segura`
- `feat(ui): agrega eliminacion controlada al arbol opd`
- `test(opd): cubre bloqueo de nodos internos`

No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`. Reportar comandos ejecutados, tests agregados, decisiones tomadas y bloqueos.
