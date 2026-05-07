# Linea 1 — Store slice contracts

## 1. Mision

Reemplazar aliases opacos `Partial<OpmStore>` por contratos reales de slices sin cambiar runtime. La meta es que cada slice declare qué estado/acciones provee y que `OpmStore` sea interseccion/composicion explicita, no un God Object difuso.

Slice minimo:

- nuevo `app/src/store/sliceTypes.ts` o `app/src/store/slices.ts`;
- `store/tipos.ts` deja de exportar `ModeloSlice = Partial<OpmStore>` y similares;
- `CrearSlice<T>` mantiene compatibilidad con Zustand sin cambiar comportamiento.

Fuera de slice: runtime effects, render options, reorganizacion de carpetas, cambios de UI.

## 2. HU Base

| HU | Path absoluto | Aporte L1 |
|---|---|---|
| Corte 14.3 | `/home/felix/projects/deep-opm-pro/docs/roadmap/cortes-operativos.md` | Normalizacion arquitectonica previa a Beta1. |
| Auditoria categorial F3 | `/home/felix/projects/deep-opm-pro/docs/roadmap/auditoria-categorial-app.md` | Reduce `Partial<OpmStore>` como deuda de preservacion. |

## 3. Anclaje A Evidencia

- `docs/roadmap/auditoria-categorial-app.md` F3 y Fase D.
- ICAS `urn:fxsl:kb:icas-comparacion`: refactor debe ser transformacion natural; mismos selectores/acciones observables.
- ICAS `urn:fxsl:kb:icas-preservacion`: tipos deben preservar identidad/composicion del store.
- Codigo actual:
  - `app/src/store/tipos.ts` exporta `CrearSlice<T>` y aliases `Partial<OpmStore>`.
  - `app/src/store.ts` compone slices con Zustand.
  - slices existentes: `modelo.ts`, `seleccion.ts`, `enlaces.ts`, `workspaceMod.ts`, `carpetas.ts`, `uiPanel.ts`, `mapa.ts`, `persistencia.ts`, `pestanas.ts`.
- OPCloud no aporta patron de Zustand; no copiar arquitectura Angular/Firebase.

## 4. Archivos Permitidos

```text
app/src/store/sliceTypes.ts              NUEVO recomendado
app/src/store/tipos.ts                   EDIT aditivo / tipos
app/src/store/modelo.ts                  EDIT tipos si necesario
app/src/store/seleccion.ts               EDIT tipos si necesario
app/src/store/enlaces.ts                 EDIT tipos si necesario
app/src/store/workspaceMod.ts            EDIT tipos si necesario
app/src/store/carpetas.ts                EDIT tipos si necesario
app/src/store/uiPanel.ts                 EDIT tipos si necesario
app/src/store/mapa.ts                    EDIT tipos si necesario
app/src/store/persistencia.ts            EDIT tipos si necesario
app/src/store/pestanas.ts                EDIT tipos si necesario
app/src/store.ts                         LECTURA / EDIT minimo si typescript lo exige
app/src/store/*.test.ts                  LECTURA / tests aditivos si cambian exports
```

## 5. Restricciones De No-Colision

- No tocar `app/src/store/runtime.ts` (L2).
- No tocar `app/src/render/jointjs/**` (L2).
- No tocar `app/src/opl/**`.
- No tocar UI excepto si TypeScript exige import type por cambio de alias; reportar si ocurre.
- No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/**`.

## 6. Slice Minimo Shippeable

### Tipos

Crear contratos:

```ts
export type ModeloSlice = Pick<OpmStore, "modelo" | "crearObjetoDemo" | ...>;
```

La lista puede empezar por grupos ya comentados dentro de `OpmStore`. No hace falta perfectitud total si el avance reduce opacidad sin romper runtime.

### CrearSlice

Mantener firma compatible:

```ts
export type CrearSlice<T> = (
  set: (partial: Partial<OpmStore> | ((state: OpmStore) => Partial<OpmStore>)) => void,
  get: () => OpmStore,
) => T;
```

No introducir wrapper de Zustand nuevo.

### Imports

Si `store/tipos.ts` importa operaciones por compat detector, no reordenar masivamente. Esta ronda es tipos primero.

### Tests

Si TypeScript cubre suficiente, no agregar tests runtime artificiales. El test principal es `bun run typecheck` via `bun run check`.

## 7. Tests Obligatorios

- `bun run check` debe validar los contratos.
- Agregar test solo si se crea helper runtime o si se toca comportamiento.
- Confirmar que `rg "type .*Slice = Partial<OpmStore>" app/src/store` queda vacio.

## 8. Verificacion

```bash
cd app && bun run check
cd app && bun run lint
cd app && bun run build
cd app && bun run browser:smoke
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

## 9. Decisiones Bloqueadas

- No split físico de todos los slices.
- No cambiar Zustand.
- No cambiar nombres publicos de acciones.
- No mover imports operacionales fuera de `store/tipos.ts` si no es necesario para tipos.

## 10. Decisiones Que Tomas Vos

- Nombre del archivo nuevo (`sliceTypes.ts` recomendado).
- Granularidad de `Pick<OpmStore, ...>` por slice.
- Si conviene `interface` o `type`.
- Si dejar comentarios de deuda residual para slices demasiado grandes.

## 11. Forma Del Entregable

Commits sugeridos:

1. `refactor(store): explicita contratos de slices`
2. `chore(store): elimina aliases Partial<OpmStore>`

Entregable final:

- hashes;
- lista de aliases reemplazados;
- comando `rg` demostrando que no quedan aliases opacos;
- verificacion completa;
- deuda residual.
