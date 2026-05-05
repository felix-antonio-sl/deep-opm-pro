# Línea 2 — Gesto directo a cápsula de estado

## 1. Misión

Cerrar HU-13.014 como cubierta plena: el modelo, inspector, render, OPL y JSON ya aceptan `ExtremoEnlace.kind = "estado"`, pero falta el gesto directo sobre la cápsula de estado en canvas.

**Slice mínimo entregable**: hacer interactuables las cápsulas de estado en JointJS, mapear selector→`estadoId`, crear enlace con extremo estado desde el gesto del usuario y cubrirlo con smoke e2e. En la UI actual, el gesto aceptado es `elegir tipo de enlace` → clic sobre cápsula destino/origen; si se implementa drag real, debe usar la misma ruta de store.

**Fuera de slice**: rutas, abanicos a estados y etiquetas de trayectoria. Eso es L3.

## 2. HU base

| HU | Path absoluto | Aporte |
|---|---|---|
| HU-13.014 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-13-canvas-estados.md` | Crear enlace entrante/saliente dirigido a estado específico por gesto directo. |
| HU-13.018 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-13-canvas-estados.md` | Confirmar que el gesto produce OPL TS3 cuando corresponde. |
| HU-SHARED-008 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-008-seleccion-canvas.md` | Selección/click canvas consistente. |

## 3. Anclaje a evidencia

- **SSOT**: `opm-iso-19450-es.md` §Enlaces procedimentales con estado especificado: los enlaces conectan con estados específicos; `opm-opl-es.md` TS3; `opm-visual-es.md` V-237/V-239 para estado y familias de enlace.
- **Corpus interno reusable**:
  - `opm-extracted/src/app/configuration/elementsFunctionality/linkDrawing.ts` muestra `InOutLinkpair(...)`, `uniteResults(...)` y `uniteConsumptions(...)` trabajando con `OpmState` como endpoint.
  - `opm-extracted/src/app/models/ModelFromWizardParamsCreator.ts` conecta estados a procesos en ejemplos wizard.
  - `docs/JOYAS.md` §10 documenta cápsulas internas de estado.
- **Estado actual del código**:
  - `app/src/render/jointjs/proyeccion.ts` ya calcula `puntoCapsulaEstado(...)`, pero los attrs de `stateCapsule*` y `stateLabel*` tienen `pointerEvents: "none"`.
  - `app/src/modelo/operaciones.ts:crearEnlace` ya acepta `ExtremoEntrada`, por lo que no hace falta rediseñar kernel.
  - `app/src/store.ts:seleccionarEntidad` solo recibe entidad; falta una acción o ruta para seleccionar estado como extremo.

## 4. Archivos permitidos

```text
app/src/render/jointjs/estadoTargets.ts       NUEVO
app/src/render/jointjs/proyeccion.ts          EDIT aditivo acotado
app/src/render/jointjs/proyeccion.test.ts     EDIT aditivo
app/src/render/jointjs/JointCanvas.tsx        EDIT aditivo
app/src/store.ts                              EDIT aditivo
app/e2e/opm-smoke.spec.ts                     EDIT aditivo
app/src/modelo/operaciones.ts                 LECTURA
app/src/modelo/extremos.ts                    LECTURA
app/src/opl/generar.ts                        LECTURA
app/src/serializacion/json.ts                 LECTURA
opm-extracted/**                              LECTURA
```

## 5. Restricciones de no-colisión

- No tocar `ExtremoEnlace`, `validarFirmaEnlace`, OPL TS3 ni serialización: ya existen.
- No cambiar la UX del inspector de enlaces; el selector manual queda como fallback.
- En `JointCanvas.tsx`, agregar un handler pequeño para estado; no reescribir los handlers de entidad/enlace.
- Las cápsulas deben seguir renderizando igual visualmente. Solo cambian metadata y `pointerEvents`.

## 6. Slice mínimo shippeable

### Modelo

Sin cambios. Usar `extremoEstado(estadoId)` de `app/src/modelo/extremos.ts`.

### Operaciones

Sin cambios de kernel. El store debe llamar:

```ts
crearEnlace(modelo, opdActivoId, modoEnlace.origenId, extremoEstado(estadoId), modoEnlace.tipo)
```

cuando el usuario está en `modoEnlace` y pulsa una cápsula destino. Si el estado se usa como origen, aplicar la misma idea al iniciar el modo desde estado solo si se implementa ese gesto.

### Serialización

Sin cambios; el JSON ya preserva `{ kind: "estado", id }`.

### Render

Crear helper:

```ts
export type EstadoTarget = { selector: string; estadoId: Id };
export function targetsEstado(estados: Estado[]): EstadoTarget[];
```

`OpmJointMetadata.kind === "entidad"` debe incluir `estadosInteractivos?: EstadoTarget[]`. En attrs:

- `stateCapsuleN.pointerEvents = "auto"`, `cursor = "crosshair"` cuando hay estados.
- `stateLabelN.pointerEvents = "auto"` para que el texto también funcione.
- El hit target no debe alterar bbox ni tamaño.

### OPL

Sin cambios. Smoke debe verificar TS3 como efecto observable.

### UX

Flujo mínimo:

1. Seleccionar proceso.
2. Elegir tipo `resultado` o `consumo`.
3. Clic directo sobre cápsula de estado.
4. El enlace exportado apunta a `{ kind: "estado", id: estadoId }`.

Si `modoEnlace` no está activo, clic en cápsula selecciona el objeto padre, no el estado como entidad separada.

### Cross-capa

El smoke debe exportar JSON, verificar `kind: "estado"` y verificar OPL.

## 7. Tests obligatorios

- `proyeccion.test.ts`: las cápsulas exponen metadata `estadosInteractivos` con selectores estables.
- `proyeccion.test.ts`: `pointerEvents` de cápsula/label es `auto`.
- `store.test.ts` o unit equivalente: acción nueva crea enlace con destino estado usando `modoEnlace`.
- `opm-smoke.spec.ts`: crear/importar objeto con estados, activar enlace a cápsula y confirmar JSON + OPL TS3.

## 8. Verificación

```bash
cd app
bun run check
bun run browser:smoke
```

## 9. Decisiones bloqueadas (no reabrir)

- `ExtremoEnlace` sigue siendo objeto etiquetado.
- Los estados siguen siendo top-level en `Modelo.estados`, no entidades visuales independientes.
- El selector del inspector sigue existiendo como edición fina.

## 10. Decisiones que tomas vos (documentar en commit)

- Si el gesto inicia enlace desde una cápsula estado o solo permite destino estado en este slice.
- Nombre exacto de la acción de store (`seleccionarEstadoComoExtremo`, `seleccionarEstado`, etc.).
- Si el cursor de cápsula cambia solo en `modoEnlace` o siempre.

## 11. Forma del entregable

Commits sugeridos:

- `feat(render): expone capsulas de estado como targets de enlace`
- `feat(store): crea enlaces hacia estado desde gesto canvas`
- `test(smoke): cubre gesto directo a capsula de estado`

No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`.
