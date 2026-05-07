# Linea 2 — Runtime effects + render pure options

## 1. Mision

Hacer explicitos los efectos runtime y purificar la proyeccion JointJS respecto a `globalThis`:

- `proyectarModeloAJointCells` debe ser reproducible por argumentos explicitos.
- `globalThis` queda encapsulado en adapter legacy, no como default invisible del core.
- `store/runtime.ts` expone efectos runtime inyectables/testeables para storage, confirm, autosave y snapshot.

Slice minimo: `app/src/render/jointjs/proyeccionOpciones.ts` o equivalente + tests de no contaminacion global; `app/src/store/runtimeEffects.ts` con interface y default adapter; cambios minimos en `runtime.ts`.

Fuera de slice: store slice contracts (L1), parser OPL, UI redesign, cambios de comportamiento.

## 2. HU Base

| HU | Path absoluto | Aporte L2 |
|---|---|---|
| Corte 14.3 | `/home/felix/projects/deep-opm-pro/docs/roadmap/cortes-operativos.md` | Normalizacion arquitectonica previa a Beta1. |
| Auditoria categorial F4/F5 | `/home/felix/projects/deep-opm-pro/docs/roadmap/auditoria-categorial-app.md` | Encapsula efectos y elimina global state del render core. |

## 3. Anclaje A Evidencia

- `docs/roadmap/auditoria-categorial-app.md` F4/F5 y Fase E.
- ICAS `urn:fxsl:kb:icas-efectos`: efectos explicitos componen en vez de esconder estado.
- ICAS `urn:fxsl:kb:icas-comparacion`: antes/despues debe conmutar; refactor sin cambio observable.
- Codigo actual:
  - `app/src/render/jointjs/proyeccion.ts` define `opcionesProyeccionGlobal()` y `fijarOpcionesProyeccionGlobal`.
  - `app/src/render/jointjs/JointCanvas.tsx` ya pasa opciones explicitas.
  - `app/src/store/runtime.ts` concentra snapshot, undo/redo, autosave, local workspace, `globalThis.confirm` y storage indirecto.
- OPCloud no aporta una arquitectura de effects para Preact/Zustand; usarlo solo para semantica visual cuando aparezca.

## 4. Archivos Permitidos

```text
app/src/render/jointjs/proyeccion.ts             EDIT aditivo
app/src/render/jointjs/proyeccionOpciones.ts     NUEVO opcional
app/src/render/jointjs/proyeccion.test.ts        EDIT aditivo
app/src/render/jointjs/JointCanvas.tsx           EDIT puntual si debe pasar opciones explicitas
app/src/store/runtimeEffects.ts                  NUEVO
app/src/store/runtime.ts                         EDIT aditivo
app/src/store/runtime.test.ts                    EDIT aditivo
app/src/store/tipos.ts                           LECTURA
```

## 5. Restricciones De No-Colision

- No tocar `app/src/store/sliceTypes.ts` ni aliases de slices (L1).
- No cambiar forma del store ni nombres de acciones.
- No tocar parser OPL ni leyes 14.2 salvo lectura.
- No tocar UI de Toolbar/Paneles por gusto; solo si necesita pasar opciones explicitas.
- No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/**`.

## 6. Slice Minimo Shippeable

### Render

Separar:

```ts
export const OPCIONES_PROYECCION_DEFAULT: Required<OpcionesProyeccion> = ...
export function opcionesProyeccionDesdeGlobalThis(): OpcionesProyeccion
```

`proyectarModeloAJointCells` puede conservar default legacy temporal, pero debe existir camino puro testeado:

```ts
proyectarModeloAJointCells(modelo, opdId, null, null, null, [], opcionesExplicitas)
```

Test:

- dos llamadas con opciones explicitas distintas producen diferencias esperadas;
- una llamada con opciones explicitas no lee `globalThis`;
- `fijarOpcionesProyeccionGlobal` queda como adapter legacy documentado.

### Runtime Effects

Crear interface:

```ts
export interface RuntimeEffects {
  now(): Date;
  confirm(message: string): boolean;
  readLocalStorage(key: string): string | null;
  writeLocalStorage(key: string, value: string): void;
}
```

Adaptar solo las llamadas que ya usan globales directos en `runtime.ts`. No migrar todo el mundo.

### Tests

`runtime.test.ts` debe poder instalar fake effects para un flujo pequeño (confirm true/false o storage).

## 7. Tests Obligatorios

- 2 tests render:
  - opciones explicitas no contaminadas por global;
  - default legacy preserva comportamiento.
- 2 tests runtime effects:
  - confirm inyectado controla rama;
  - storage fake evita tocar localStorage real si aplica.
- Total estimado: 4-8 tests.

## 8. Verificacion

```bash
cd app && bun run check
cd app && bun run lint
cd app && bun run build
cd app && bun run browser:smoke
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

## 9. Decisiones Bloqueadas

- No eliminar wrappers legacy si rompen UI.
- No reescribir runtime completo.
- No introducir DI container.
- No migrar Zustand/signals.
- No cambiar semantica de autosave/dirty/undo.

## 10. Decisiones Que Tomas Vos

- Nombre del módulo de opciones render.
- Alcance minimo de `RuntimeEffects`.
- Si `proyectarModeloAJointCells` conserva default legacy o exige opciones en nueva funcion wrapper.
- Qué globals encapsular en esta ronda y cuáles dejar documentados.

## 11. Forma Del Entregable

Commits sugeridos:

1. `refactor(render): explicita opciones de proyeccion`
2. `refactor(runtime): encapsula efectos globales`
3. `test(runtime): effects fake preservan comportamiento`

Entregable final:

- hashes;
- antes/despues de globals encapsulados;
- pruebas agregadas;
- `rg "globalThis" app/src/render/jointjs/proyeccion.ts app/src/store/runtime.ts` comentado;
- verificacion completa.
