# Linea 5 — Creacion interna correcta en contenedor

## 1. Mision

Permitir crear una cosa interna directamente dentro de un contenedor refinado, sin que nazca como externa solapada ni dispare advertencias de interior/exterior.

**Slice minimo entregable**: helper `creacionInterna.ts` detecta contenedor de refinamiento del OPD activo y crea entidad/apariencia interna con `opdId` correcto, `Toolbar`/canvas enrutan la creacion segun posicion, store mantiene seleccion de la nueva cosa y tests verifican que queda dentro del OPD hijo.

**Fuera de slice**: arrastre desde biblioteca (HU-1C.005), snap correctivo de cosas externas, panel de verificacion metodologica, dialogo de nombres duplicados y reuso de entidad existente.

## 2. HU base

| HU | Path absoluto | Aporte |
|---|---|---|
| HU-1C.004 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-1c-canvas-validaciones.md` | Crear cosa interna correcta directamente dentro del contenedor. |
| HU-12.003 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-12-canvas-descomposicion.md` | Dependencia: existencia de contenedor refinado/OPD hijo. |
| HU-12.018 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-12-canvas-descomposicion.md` | Modelo de cosa interna en OPD hijo. |

## 3. Anclaje a evidencia

- **SSOT**: `opm-visual-es.md` V-1 y reglas de in-zooming/unfolding distinguen interior/exterior; `opm-iso-19450-es.md` glosario de OPD y refinamiento; `metodologia-opm-es.md` §7 indica construccion de SD1 dentro del contenedor refinado.
- **Corpus interno reusable**:
  - `opm-extracted/MODULES.md` lista `src/app/configuration/elementsFunctionality/graphFunctionality.ts` con `createDrawnEntity`.
  - `opm-extracted/INDEX.md` mapea `OpmVisualThing`, `OpmVisualObject`, `OpmVisualProcess`, `OpmOpd`, `InzoomedTree` y `UnfoldedTree`.
  - `opm-extracted/ImportOPX/OPX.API.ts` incluye `load_Inzoomed_sections`, `load_Unfolded_sections` y traversal de arboles como evidencia de entidad visual por OPD.
  - `docs/JOYAS.md` fija dimensiones canonicas 135x60 para objetos/procesos.
- **Estado actual del codigo**:
  - `app/src/modelo/layout.ts` ya expone `contenedorRefinamiento`, `dentroDeApariencia` y `posicionLibre`.
  - `app/src/modelo/operaciones.ts` crea entidades con `crearObjeto`/`crearProceso` sobre un `opdId`, y ya posee helpers internos `dentroDe`.
  - `app/src/store.ts` usa `crearObjetoDemo` y `crearProcesoDemo` con `posicionLibre`, no con posicion de click/drop dentro de contenedor.
  - `app/src/render/jointjs/JointCanvas.tsx` es el punto de eventos canvas y seleccion.

## 4. Archivos permitidos

```text
app/src/modelo/creacionInterna.ts          NUEVO
app/src/modelo/creacionInterna.test.ts     NUEVO
app/src/modelo/layout.ts                   EDIT aditivo si falta helper exportado
app/src/modelo/operaciones.ts              LECTURA o EDIT wrapper minimo
app/src/render/jointjs/JointCanvas.tsx     EDIT aditivo
app/src/ui/Toolbar.tsx                     EDIT aditivo acotado
app/src/store.ts                           EDIT aditivo
app/src/store.test.ts                      EDIT aditivo
app/e2e/opm-smoke.spec.ts                  EDIT aditivo
docs/JOYAS.md                              LECTURA
opm-extracted/**                           LECTURA
/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/** LECTURA
```

## 5. Restricciones de no-colision

- No tocar estilo visual de L6.
- No tocar dialogos/menu de L2 salvo rebase de `Toolbar.tsx`; si L2 ya movio acciones a menu, agregar solo el modo de creacion necesario.
- No tocar OPL interactivo de L1.
- No implementar biblioteca lateral ni drag desde biblioteca.
- No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`.

## 6. Slice minimo shippeable

### Modelo

Crear helper:

```ts
export function crearCosaEnPosicion(modelo: Modelo, opdId: Id, tipo: TipoEntidad, posicion: Posicion): Resultado<{
  modelo: Modelo;
  entidadId: Id;
  aparienciaId: Id;
  interna: boolean;
}>;
```

Regla:

- Si `opdId` ya es OPD hijo y la posicion cae dentro del contorno refinado visible, crear apariencia en ese mismo OPD y marcarla como interna por pertenencia al OPD hijo.
- Si no hay contenedor o la posicion cae fuera, conservar comportamiento actual.
- No migrar apariencias externas por resize; eso queda fuera.

### Operaciones

Store:

```ts
crearEntidadEnCanvas(tipo: TipoEntidad, posicion: Posicion): void;
fijarModoCreacion(tipo: TipoEntidad | null): void; // solo si UX lo requiere
```

### Serializacion

Sin cambios de schema; confirmar roundtrip con entidad interna.

### Render

`JointCanvas` debe pasar coordenada canvas al store. Evitar convertir scroll/zoom de forma ad hoc si ya hay utilidades JointJS; usar API de paper cuando exista.

### OPL

Sin nueva plantilla. La entidad interna debe aparecer en OPL del OPD hijo solo cuando corresponda al OPD activo.

### UX

Dos opciones aceptables:

- Botones "Objeto"/"Proceso" entran a modo creacion y el siguiente click en canvas crea en esa posicion.
- Mantener botones demo, pero agregar accion/click directo solo si testable y clara.

El usuario no debe ver advertencia de interior/exterior al crear dentro correctamente.

### Cross-capa

La nueva cosa debe quedar seleccionada, entrar al undo stack y respetar dimensiones/color/tipografia canonicas existentes.

## 7. Tests obligatorios

- Unit modelo: crear objeto en OPD hijo dentro del contorno produce apariencia en `opdId` hijo y `interna: true`.
- Unit modelo: crear fuera del contorno no marca interna.
- Store: crear entidad en canvas selecciona la nueva entidad y deja dirty.
- Serializacion: roundtrip preserva OPD y apariencia de la cosa interna.
- Smoke: descomponer proceso, crear objeto dentro del contenedor del OPD hijo, verificar que aparece en arbol/canvas correcto y no hay mensaje de advertencia.

## 8. Verificacion

```bash
cd app
bun run check
bun run browser:smoke
bun run build
```

## 9. Decisiones bloqueadas (no reabrir)

- La pertenencia interna se expresa por OPD/apariencia correcta, no por overlay externo solapado.
- No resolver colisiones nominales en esta linea.
- No implementar biblioteca drag-and-drop.
- No cambiar dimensiones canonicas de cosa.

## 10. Decisiones que tomas vos (documentar en commit)

- UX exacta para elegir modo de creacion por click.
- Tolerancia de hit-test del contenedor.
- Si procesos internos tambien entran al helper en este slice o solo objetos; HU habla "cosa", por lo que ambos son aceptables si tests cubren.
- Mensaje de exito o ausencia de mensaje tras crear.

## 11. Forma del entregable

Commits sugeridos:

- `feat(modelo): crea cosas internas por posicion`
- `feat(canvas): agrega creacion directa en contenedor`
- `test(validaciones): cubre creacion interna sin advertencia`

No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`. Reportar comandos ejecutados, tests agregados, decisiones tomadas y bloqueos.
