# Línea 3 — Descomposición avanzada (timeline + reasignación + creación interna + paralelo)

## 1. Misión

Cerrar **EPICA-12 al 95%+** (mover de 18+10/31 a ~26+5/31), agregando:
- **Crear subproceso/objeto interno por arrastre/click dentro del contenedor** (HU-12.015, HU-12.018, HU-12.022).
- **Reordenar timeline**: drag de subprocesos cambia su orden temporal por coordenada Y; commit al modelo y emite paralelo cuando coinciden (HU-12.016, HU-12.017).
- **Renombrado in-situ del subproceso** con propagación al árbol/OPL (HU-12.023, HU-12.024).
- **Reasignación manual de enlaces externos derivados** entre subprocesos concretos desde Inspector (HU-12.011 ya parcial → cubierto).
- **Distinción in-zooming vs unfolding en UI**: indicar visualmente la diferencia (HU-12.014 verbalización OPL, ya parcial → cubierto).
- **Afiliación ambiental dentro del SD hijo + restricciones interior** (HU-12.029, HU-12.030).

Slice mínimo: extensiones puntuales en `operaciones/refinamiento/*` (sub-archivos ronda 9.5), Inspector de refinamiento, render de timeline drag, OPL de paralelo.

**Fuera de slice**:
- HU-12.021 expandir contenedor al sacar objeto interno: difiere por complejidad del comportamiento.
- HU-12.031 paréntesis del contorno (render avanzado): difiere.
- HU-12.032/.033 mini-navegador y in-context árbol: difieren.

## 2. Deudas que cierra

| HU | Estado actual | Aporte L3 |
|---|---|---|
| HU-12.011 — Refinar enlaces fase 2 | parcial | Reasignación manual desde Inspector con selector de subproceso destino. `reasignarEnlaceExternoManual` ya existe en `operaciones/enlaces.ts`; L3 expone via UI. |
| HU-12.014 — Distinguir verbos OPL refinamiento | parcial | Verificar que `oracionRefinamiento` ya distingue "se descompone" vs "se despliega"; agregar matiz si falta. |
| HU-12.015 — Crear subproceso por arrastre | parcial | Click dentro del contorno crea subproceso (ya parcial en `crearCosaEnPosicion`); arrastre desde toolbar al interior. |
| HU-12.016 — Codificar orden temporal por Y | pendiente | `reordenarSubprocesoEnTimeline` ya existe en `acciones-canvas.ts`. L3 verifica que está cableado y agrega smoke. |
| HU-12.017 — Subprocesos paralelos en misma Y | pendiente | Detección de Y similar (tolerancia 4px) en `subprocesosOrdenadosDeRefinamiento` + emisión OPL "X y Y ocurren en paralelo". |
| HU-12.018 — Crear objeto interno | pendiente | Click dentro del contorno crea objeto. Ya parcial. |
| HU-12.019 — Conector OPL para objetos internos | parcial | Verificar emisión OPL adecuada; agregar si falta. |
| HU-12.022 — Conectar subproceso interno con objeto interno | parcial | Validación + smoke. |
| HU-12.023 — Renombrar subproceso in situ | pendiente | Doble-click sobre subproceso abre input inline. Reusa patrón ronda 6 árbol. |
| HU-12.024 — Propagar renombrado al árbol/OPL | pendiente | Reactividad existente del store ya propaga; agregar smoke. |
| HU-12.029 — Afiliación ambiental dentro del SD hijo | pendiente | `crearObjetoEnContorno` con afiliacion="ambiental" si origen es ambiental. |
| HU-12.030 — Restringir ambiental al interior | pendiente | Validación: ambiental no puede salir del bbox del contorno. |

## 3. Anclaje a evidencia

- **SSOT**:
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md` §3.* (in-zooming + paralelo): paralelo cuando subprocesos coinciden en Y.
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-opl-es.md`: oración paralelo "X y Y ocurren en paralelo / coexisten".
- **Corpus interno reusable**:
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/configuration/rappidEnviromentFunctionality/in-zooming/` (carpeta entera, si existe).
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/LogicalPart/OpmLogicalThing.ts` (patrón refinement).
- **Estado actual del código (post-9.5)**:
  - `app/src/modelo/operaciones/refinamiento/descomposicion.ts` (204 LOC): tiene `descomponerProceso` + `subprocesosInicialesInzoom` + INZOOM constantes con `toleranciaParaleloY: 4`. **L3 usa la tolerancia para emitir OPL paralelo**.
  - `app/src/modelo/operaciones/refinamiento/helpers.ts`: tiene `subprocesosOrdenadosDeRefinamiento` que ordena por `compararOrdenTemporal(a, b) = a.y - b.y || a.x - b.x`. **L3 agrega `agruparSubprocesosParalelos` que detecta Y similar**.
  - `app/src/modelo/operaciones/refinamiento/proyeccion.ts`: tiene `proyectarEnlacesExternosEnRefinamiento`. **L3 agrega ruta UI para reasignación manual** (la operación `reanclarEnlaceExternoDerivado` ya existe en `operaciones/enlaces.ts`).
  - `app/src/store/modelo/acciones-canvas.ts` (472 LOC): tiene `reordenarSubprocesoEnTimeline`. **L3 verifica que esté wired al canvas drag handler**.
  - `app/src/render/jointjs/handlers/drag.ts`: handler `change:position` actualmente recompute abanicos. **L3 agrega lógica: si la cell es subproceso interno y el drag fue vertical, llamar a `reordenarSubprocesoEnTimeline`**.
  - `app/src/ui/inspector/SeccionRefinamiento.tsx`: ya existe (ronda 8). **L3 agrega selector "Reasignar externo a subproceso..." + botón.**
  - `app/src/ui/InspectorEnlace.tsx` con `SeccionReanclaje` (ronda 8). L3 verifica que el flujo end-to-end funciona.
  - `app/src/opl/generadores/refinamiento.ts`: ya tiene `oracionRefinamiento` + `oracionDespliegueOcurren` + `oracionEspecializacion`. **L3 agrega `oracionParalelo`** cuando 2+ subprocesos en Y similar.

## 4. Archivos permitidos

```text
app/src/modelo/operaciones/refinamiento/helpers.ts          EDIT extiende (agruparSubprocesosParalelos)
app/src/modelo/operaciones/refinamiento/helpers.test.ts     NUEVO (si no existe)
app/src/modelo/validaciones.ts                              EDIT aditivo (validar ambiental dentro del contorno)
app/src/modelo/validaciones.test.ts                         EDIT aditivo
app/src/modelo/creacionInterna.ts                           EDIT extiende (crear ambiental con clamp dentro del contorno)
app/src/modelo/creacionInterna.test.ts                      EDIT aditivo
app/src/store/modelo/acciones-opd.ts                        EDIT extiende (reasignarEnlaceExternoManual delegando)
app/src/store/modelo/acciones-canvas.ts                     EDIT verificar (reordenarSubprocesoEnTimeline ya existe)
app/src/store/tipos.ts                                      EDIT aditivo opcional
app/src/render/jointjs/handlers/drag.ts                     EDIT aditivo (detectar drag vertical de subproceso → reordenar timeline)
app/src/render/jointjs/handlers/seleccion.ts                EDIT aditivo (doble-click subproceso → renombrar inline)
app/src/opl/generadores/refinamiento.ts                     EDIT aditivo (oracionParalelo)
app/src/opl/generadores/refinamiento.test.ts                EDIT aditivo
app/src/ui/inspector/SeccionRefinamiento.tsx                EDIT aditivo (botón "Reasignar externo a subproceso..." con selector)
app/src/ui/inspectorEnlace/SeccionReanclaje.tsx             EDIT aditivo opcional (verificar UX)
app/src/ui/RenombradoInline.tsx                             NUEVO opcional (componente reusable de input inline)
app/e2e/opm-smoke.spec.ts                                   EDIT aditivo (smoke timeline + reasignar + paralelo + ambiental + renombrar inline)
opm-extracted/**                                            LECTURA
docs/HANDOFF.md                                             LECTURA (no editar)
docs/historias-usuario-v2/**                                LECTURA (no editar)
```

## 5. Restricciones de no-colisión

- **No tocar `tipos/*`** (territorios L1, L2, L4).
- **No tocar `operaciones/refinamiento/{descomposicion,despliegue,proyeccion}.ts`** salvo aditivos mínimos. Si se requiere modificar lógica core, declarar y minimizar.
- **No tocar `operaciones/enlaces.ts`** (territorio L2).
- **No tocar `operaciones/apariencias.ts`** (territorio L1; pero L3 puede leer).
- **No tocar `composers/*`** (territorio L1, L4).
- **No tocar `acciones-entidad.ts` ni `acciones-enlace.ts`** salvo lectura.
- **`handlers/drag.ts`**: L3 agrega lógica condicional dentro del handler `change:position` existente, sin reescribirlo. L1 también lo modifica para snap-to-grid; coordinación: L1 modifica el inicio del handler, L3 agrega un branch al final. Ambos son aditivos en la misma función; orden de merge L1 → L3 evita choque.
- **`handlers/seleccion.ts`**: L3 agrega doble-click subproceso. L1 agrega click en resize handle. L4 agrega click en insignia imagen. Cada uno detecta su selector y enruta a su acción. Sin choque conceptual; coordinación con `data-testid`/`joint-selector` distintos.
- **`opm-smoke.spec.ts`**: agregar smokes al final.

## 6. Slice mínimo shippeable

### 6.1 Capa modelo (helpers + validaciones)

```ts
// app/src/modelo/operaciones/refinamiento/helpers.ts (extiende)
export function agruparSubprocesosParalelos(
  subprocesos: Apariencia[],
  toleranciaY = 4,
): Apariencia[][] {
  // Agrupar subprocesos cuya Y difiere ≤ toleranciaY.
  // Retorna grupos en orden de Y asc.
}
```

```ts
// app/src/modelo/validaciones.ts (aditivo)
export function validarAmbientalDentroContorno(modelo: Modelo, opdId: Id): Aviso[] {
  // Para cada apariencia con entidad.afiliacion="ambiental" en OPD que tiene contorno refinable,
  // verificar que el bbox de la apariencia está dentro del contorno.
  // Si no: aviso severidad media "Cosa ambiental fuera del contorno SD<n>".
}
```

```ts
// app/src/modelo/creacionInterna.ts (extiende)
// Si la posición del click cae dentro de contorno refinable Y la afiliación heredada o seleccionada es "ambiental":
// - Crear con afiliacion="ambiental".
// - Clamp posición al interior del contorno.
```

### 6.2 Capa store

```ts
// app/src/store/modelo/acciones-opd.ts (extiende)
reasignarEnlaceExternoManual(aparienciaEnlaceId: string, nuevoSubprocesoId: string) {
  // Delega a reanclarEnlaceExternoDerivado del operaciones/enlaces.ts (ya existe).
  // Smoke flow: usuario selecciona enlace derivado en Inspector → click "Reasignar..." → selector subproceso → confirma → commit.
}
```

### 6.3 Capa render + handlers

```ts
// app/src/render/jointjs/handlers/drag.ts (aditivo en change:position)
// Si la cell movida es subproceso interno (meta.entidadId está en lista subprocesos del refinamiento activo):
//   const nuevaY = cell.position().y;
//   reordenarSubprocesoEnTimelineRef.current(opdActivoId, aparienciaId, nuevaY);
//   (commit ya cuantiza al timeline contorno)
```

```ts
// app/src/render/jointjs/handlers/seleccion.ts (aditivo)
// En element:pointerdblclick:
// Si meta.kind === "entidad" y meta.entidadId es subproceso del refinamiento activo:
//   abrirRenombradoInline(meta.aparienciaId, meta.entidadId);
//   (UI overlay input que commitea al renombrarSeleccionada del store)
```

### 6.4 Capa OPL

```ts
// app/src/opl/generadores/refinamiento.ts (aditivo)
export function oracionParalelo(grupoSubprocesos: Entidad[]): string {
  // "<X>, <Y> y <Z> ocurren en paralelo."
}
// Refinar oracionRefinamiento para emitir grupos paralelos detectados via agruparSubprocesosParalelos.
```

### 6.5 Capa UI

```tsx
// app/src/ui/inspector/SeccionRefinamiento.tsx (aditivo)
// Si la entidad seleccionada es proceso descompuesto Y hay enlaces externos derivados:
//   Mostrar lista "Enlaces externos derivados" con cada uno:
//     - "Padre: consumo Objeto → Proceso refinado"
//     - "Derivado actual: → Subproceso N"
//     - Selector "Reasignar a subproceso:" + botón Reasignar
//   onClick → store.reasignarEnlaceExternoManual(...)
```

```tsx
// app/src/ui/RenombradoInline.tsx (NUEVO opcional)
// Componente reusable: input que reemplaza el rótulo de la cell durante edición.
// onSubmit: store.renombrarSeleccionada(nuevoNombre).
// Cancelar con Escape.
```

## 7. Tests obligatorios

- **Tests existentes intactos**.
- **Tests aditivos** (~10 tests / ~30 expects):
  - `refinamiento/helpers.test.ts`: agruparSubprocesosParalelos detecta Y similar dentro de tolerancia.
  - `validaciones.test.ts`: validarAmbientalDentroContorno emite aviso correcto.
  - `creacionInterna.test.ts`: crearCosaEnPosicion con afiliación ambiental clampea al contorno.
  - `opl/generadores/refinamiento.test.ts`: oracionParalelo emite "ocurren en paralelo".
- **Smokes aditivos**:
  - `test("drag vertical de subproceso reordena timeline y commitea posicion")`
  - `test("dos subprocesos en misma Y emiten OPL paralelo")`
  - `test("reasignar enlace externo manual desde Inspector")`
  - `test("doble-click subproceso abre renombrado inline")`
  - `test("crear objeto ambiental dentro del contorno respeta clamp")`

## 8. Verificación

```bash
cd app
bun run typecheck
bun run test src/modelo/operaciones/refinamiento/ src/modelo/validaciones.test.ts src/modelo/creacionInterna.test.ts src/opl/generadores/refinamiento.test.ts
bun run check
bun run browser:smoke
bun run build
```

## 9. Decisiones bloqueadas (no reabrir)

- **`subprocesosOrdenadosDeRefinamiento` ordena por Y** (ronda 4-5): no se reabre. L3 agrega agrupación paralelo encima.
- **`reanclarEnlaceExternoDerivado`** existe en `operaciones/enlaces.ts` (ronda 6): NO se duplica ni se reescribe; L3 lo expone vía UI.
- **`reordenarSubprocesoEnTimeline`** existe en `acciones-canvas.ts` (ronda 6): NO se reabre.
- **HU-12.021 (expandir contorno al sacar objeto interno)**: difiere por complejidad de re-layout. Documentado fuera de scope.
- **HU-12.031 (paréntesis del contorno)**: difiere.

## 10. Decisiones que tomas vos (documentar en commit)

- **Tolerancia paralelo Y**: usar `INZOOM.toleranciaParaleloY = 4` (constante existente). Si el usuario reporta que es muy estrecho, ajustar.
- **`RenombradoInline.tsx`**: crear como componente reusable (también podría usarse en árbol/inspector futuro) o agregar inline en handler. Recomendado: componente.
- **Lugar exacto del selector de "Reasignar externo"**: dentro de `SeccionRefinamiento.tsx` cuando la entidad es proceso descompuesto, o en `SeccionReanclaje.tsx` (existente para enlaces). Decidir según UX.
- **Smoke de paralelo**: simular drag de 2 subprocesos a misma Y y verificar OPL.
- **Si emergen archivos de tests faltantes** (`refinamiento/helpers.test.ts`): crear o agregar al test global más cercano.

## 11. Forma del entregable

```
1. feat(refinamiento): timeline reordenable + reasignacion manual + paralelo OPL + ambiental clamp

   Cierra ~7 HU EPICA-12 (HU-12.011/.014/.015/.016/.017/.018/.022/.023/.024/.029/.030).
   EPICA-12 descomposicion pasa de 18+10/31 a ~26+5/31.

   - operaciones/refinamiento/helpers.ts extiende: agruparSubprocesosParalelos
   - validaciones.ts aditivo: validarAmbientalDentroContorno
   - creacionInterna.ts extiende: crear ambiental con clamp interior
   - acciones-opd.ts extiende: reasignarEnlaceExternoManual
   - handlers/drag.ts aditivo: drag vertical subproceso → reordenar timeline
   - handlers/seleccion.ts aditivo: doble-click subproceso → renombrar inline
   - opl/generadores/refinamiento.ts aditivo: oracionParalelo
   - inspector/SeccionRefinamiento.tsx aditivo: selector reasignar externo
   - RenombradoInline.tsx NUEVO (componente reusable)
   - ~10 tests / ~30 expects nuevos
   - 5 smokes nuevos

   Refs: docs/instrucciones-lineas-dev/ronda10/linea-3-descomposicion-avanzada.md,
         SSOT opm-iso-19450-es.md §in-zooming, opm-opl-es.md (paralelo).

   Co-Authored-By: <implementador> <noreply@...>
```

**Reporte de cierre**:
- Hash + LOC nuevos.
- Output tests.
- Smokes nuevos confirmados.
- Decisiones declaradas (de §10).
- Confirmación: tipos enlace/entidad/apariencia intactos; OPL existente preservado, oracionParalelo solo emite cuando hay grupo.

**Qué NO tocar**: territorios L1/L2/L4/L5, HANDOFF, historias-usuario-v2, JOYAS, customShapes.ts, in-vivo-test.mjs, home/.
