# Línea 4 — Auto-invocación con demora por defecto

## 1. Misión

Implementar auto-invocación de proceso con demora default `1s`, sin abrir una familia nueva de enlace: en esta ronda se representa como `tipo: "invocacion"` con origen y destino en el mismo proceso, más render de bucle y OPL IV2.

**Slice mínimo entregable**: operación `crearAutoInvocacion`, render de loop zigzag, OPL `*P* se invoca a sí mismo`, demora `1s` por defecto editable con el inspector existente, validación para evitar duplicados y tests.

**Fuera de slice**: invocación in-zoomed avanzada, wait-process visual derivado, editor de duración rico, simulación.

## 2. HU base

| HU | Path absoluto | Aporte |
|---|---|---|
| HU-15.020 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-15-canvas-enlaces-avanzados.md` | Crear auto-invocación con demora por defecto de 1 segundo. |
| HU-15.019 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-15-canvas-enlaces-avanzados.md` | Contexto: invocación normal ya existe. |
| HU-SHARED-002 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-002-undo-redo.md` | Crear/quitar debe entrar al historial. |
| HU-SHARED-007 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/shared/HU-SHARED-007-eco-opl.md` | OPL reactivo. |

## 3. Anclaje a evidencia

- **SSOT**:
  - `opm-visual-es.md` §9.1: auto-invocación es zigzag que sale y regresa al mismo proceso.
  - `opm-visual-es.md` V-240: invocación tiene firma `Proceso -> Proceso`.
  - `opm-opl-es.md` IV2: `*Invocador* se invoca a sí mismo.`
  - `opm-iso-19450-es.md` §Enlaces de invocación: comportamiento iterativo/cíclico.
- **Corpus interno reusable**:
  - `opm-extracted/src/app/models/DrawnPart/Links/SelfInvocationLink.ts` define `SelfInvocationLink`, `PartInvocation` y `ConnectionPoint`; usar la geometría como evidencia, no copiar.
  - `opm-extracted/src/app/configuration/elementsFunctionality/linkDrawing.ts:selfInvocationLink(...)` muestra prevención de duplicados y puerto default.
  - `opm-extracted/src/app/models/DrawnPart/Links/InvocationLink.ts` contiene `makeInvocationLinkVertices(...)`, ya conceptualmente reflejado por el render zigzag actual.
- **Estado actual del código**:
  - `app/src/modelo/modificadores.ts:crearInvocacion` cubre proceso→proceso distinto y `definirDemora` restringe demora a `invocacion`.
  - `app/src/modelo/operaciones.ts:crearEnlace` rechaza extremos idénticos; no forzar ese camino si ensucia `operaciones.ts`.
  - `app/src/render/jointjs/proyeccion.ts` descarta enlaces cuya apariencia origen y destino son iguales; debe admitir auto-invocación.

## 4. Archivos permitidos

```text
app/src/modelo/autoinvocacion.ts              NUEVO
app/src/modelo/modificadores.ts               EDIT aditivo solo si reutiliza demora/validación
app/src/modelo/modificadores.test.ts          EDIT aditivo
app/src/modelo/operaciones.ts                 EDIT aditivo acotado solo si imprescindible
app/src/modelo/validaciones.ts                EDIT aditivo si se agrega aviso de duplicado
app/src/render/jointjs/autoinvocacionLoop.ts  NUEVO
app/src/render/jointjs/proyeccion.ts          EDIT aditivo acotado
app/src/render/jointjs/proyeccion.test.ts     EDIT aditivo
app/src/opl/generar.ts                        EDIT aditivo
app/src/opl/generar.test.ts                   EDIT aditivo
app/src/store.ts                              EDIT aditivo
app/src/ui/InspectorEntidad.tsx               EDIT aditivo
app/e2e/opm-smoke.spec.ts                     EDIT aditivo
opm-extracted/**                              LECTURA
```

## 5. Restricciones de no-colisión

- Preferir `tipo: "invocacion"` con `origenId` y `destinoId` al mismo proceso. No agregar `auto-invocacion` a `TipoEnlace` salvo que una restricción técnica lo haga claramente necesario.
- No tocar `Toolbar.tsx` por defecto; exponer acción desde Inspector de proceso seleccionado para minimizar colisión.
- Si se edita `operaciones.ts`, el cambio máximo aceptable es permitir mismo extremo solo para invocación mediante helper pequeño y testeado.
- No duplicar auto-invocación: un proceso tiene a lo más una auto-invocación explícita por OPD en este slice.

## 6. Slice mínimo shippeable

### Modelo

Sin nuevo tipo de enlace. La auto-invocación se reconoce por:

```ts
enlace.tipo === "invocacion" &&
enlace.origenId.kind === "entidad" &&
enlace.destinoId.kind === "entidad" &&
enlace.origenId.id === enlace.destinoId.id
```

`demora` default: `"1s"`.

### Operaciones

`autoinvocacion.ts`:

```ts
export function crearAutoInvocacion(
  modelo: Modelo,
  opdId: Id,
  procesoId: Id,
  demora = "1s",
): Resultado<Modelo>;

export function esAutoInvocacion(enlace: Enlace): boolean;
export function autoInvocacionDeProceso(modelo: Modelo, opdId: Id, procesoId: Id): Enlace | undefined;
```

Reglas:

- `procesoId` debe ser proceso visible en el OPD.
- Si ya existe auto-invocación para ese proceso en el OPD, devolver error claro o no-op documentado.
- La demora se normaliza con la regla actual de `definirDemora`.

### Serialización

Sin cambios si se usa `tipo="invocacion"` y `demora`. Agregar test de round-trip si aparece regresión.

### Render

`autoinvocacionLoop.ts`:

```ts
export function proyectarAutoInvocacion(args: {
  opdId: Id;
  enlace: Enlace;
  aparienciaEnlaceId: Id;
  proceso: Apariencia;
  seleccionada: boolean;
}): JointCellJson[];
```

Mínimo visual:

- Dos segmentos zigzag o path curvo que sale de la elipse y vuelve a ella.
- Marker de invocación canónico en el tramo de retorno (`LINK_ASSETS.procedural.invocacion.marker`).
- Label de demora (`1s`) visible como ya ocurre para invocación normal.

### OPL

Si `esAutoInvocacion(enlace)`, emitir:

```text
*Proceso* se invoca a sí mismo despues de 1s.
```

Mantener ortografía local existente (`despues`) salvo que se haga corrección global justificada.

### UX

En `InspectorEntidad.tsx`, cuando la entidad seleccionada es proceso:

- Botón `Auto-invocación`.
- Si ya existe, mostrar acceso al enlace existente o deshabilitar botón.
- Seleccionar el enlace creado para que el inspector de enlace permita editar demora.

### Cross-capa

Si se decide agregar `TipoEnlace = "auto-invocacion"`, entonces es obligatorio actualizar `completitud.test.ts`, `Toolbar`, `LINK_ASSETS`, OPL, render, validación y serialización. Esta opción requiere justificar el blast radius en commit.

## 7. Tests obligatorios

- `autoinvocacion.test.ts` o `modificadores.test.ts`: crea auto-invocación con `demora="1s"`.
- Test: rechaza proceso inexistente, objeto y duplicado.
- `generar.test.ts`: OPL IV2 con demora.
- `proyeccion.test.ts`: enlace mismo proceso no se descarta y produce celdas visibles.
- `store.test.ts`: acción desde store crea auto-invocación y selecciona enlace.
- `opm-smoke.spec.ts`: seleccionar proceso, crear auto-invocación, ver loop/label `1s`, exportar JSON.

## 8. Verificación

```bash
cd app
bun run check
bun run browser:smoke
bun run build
```

## 9. Decisiones bloqueadas (no reabrir)

- La familia semántica sigue siendo invocación (`Proceso -> Proceso`) por V-240.
- Demora default de HU-15.020 es `1s`.
- No se introduce simulación ni wait-process derivado.
- Una auto-invocación explícita por proceso/OPD en este slice.

## 10. Decisiones que tomas vos (documentar en commit)

- Error vs no-op cuando ya existe auto-invocación.
- Geometría exacta del loop en JointJS.
- Si el botón vive en Inspector de entidad o en menú de enlace/toolbar.
- Si se mantiene `despues` sin tilde para consistencia o se corrige en toda OPL de demora.

## 11. Forma del entregable

Commits sugeridos:

- `feat(modelo): crea auto-invocacion con demora default`
- `feat(render): proyecta auto-invocacion como loop`
- `feat(opl): emite IV2 para auto-invocacion`
- `feat(ui): accion de auto-invocacion en inspector`
- `test(...)` por capa

No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`.
