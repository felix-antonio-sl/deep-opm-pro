# BUG-20260512T044458Z-d4931c

**Creado**: 2026-05-12T04:44:58Z
**Detectado por**: smoke browser shard 1/4, agente Claude
**Commit responsable probable**: `d4931c7` (`fix(ux): P0 dirty-state + P0-2 modos mutuamente excluyentes`)
**Severidad**: alta — bloquea flujo "Cargar modelo tras Guardar como" en smoke E2E

## Sintoma

Cuatro smokes fallan en shard 1/4 con `Error: expect(locator).toBeVisible() failed` sobre
`getByRole('dialog', { name: 'Cargar modelo' })` desde el helper `cargarPrimerModelo`
(`app/e2e/_smoke-helpers.ts:209`).

Tests afectados:

- `app/e2e/01-carga-y-workspace.spec.ts:81` — workspace local abre menu, guarda como, guarda incremental y carga desde dialogo
- `app/e2e/01-carga-y-workspace.spec.ts:155` — L2 dialogo cargar busca descripcion, selecciona tile y carga
- `app/e2e/05-refinamiento-y-plegado.spec.ts:371` — activa plegado parcial desde Inspector y persiste la vista compacta
- `app/e2e/05-refinamiento-y-plegado.spec.ts:417` — edita estilo visual de cosa, persiste local y resetea defaults

Resultado: shard 1/4 termina con **4 failed / 52 passed**.

## Reproduccion

```bash
cd app
pgrep -af vite   # verificar que no haya zombies en :5173
bun run browser:smoke -- --shard=1/4
```

Tambien reproducible aislado:

```bash
bunx playwright test e2e/01-carga-y-workspace.spec.ts:81 --reporter=line
```

## Evidencia capturada

Page snapshot al fallar (parcial, del primer test):

```
- group "Modelo":
    - button "Estado de almacenamiento: Nuevo · sin guardar"
    - button "Nuevo"
    - button "Guardar"
    - button "Cargar"
- ... el dialogo "Cargar modelo" no aparece tras click en "Cargar"
```

El chip de estado dice `"Nuevo · sin guardar"`, lo que sugiere que el `Guardar como`
previo del test no persistio en localStorage o el indice de workspace quedo vacio.

Traces y screenshots disponibles en `app/test-results/` mientras no se rerun el smoke:

- `01-carga-y-workspace-works-bd596-ental-y-carga-desde-dialogo-chromium/`
- `01-carga-y-workspace-L2-di-938c1-ion-selecciona-tile-y-carga-chromium/`
- `05-refinamiento-y-plegado--38efe-te-local-y-resetea-defaults-chromium/`
- `05-refinamiento-y-plegado--c6118--persiste-la-vista-compacta-chromium/`

## Por que se atribuye al commit P0 d4931c7

1. Baseline: `bun run browser:smoke -- --shard=1/4` corrido en `d4931c7` limpio
   (sin cambios P1-5) reproduce los mismos 4 fails, mismos 52 pass.
2. Antes del commit P0 (HEAD anterior `b6352e8`) el HANDOFF reporta
   `172 passed / 0 fail` en smoke completo.
3. Los 4 fails tocan persistencia local y carga (`Guardar como` →
   `Cargar modelo` → seleccionar reciente). El commit `d4931c7` introdujo
   la separacion `dirtyModelo` vs `dirty` para el bloqueo de carga; muy
   probablemente la regresion vive en uno de:
   - `app/src/store/persistencia.ts` (manejo de dirtyModelo en guardar/cargar)
   - logica de `commitModelo` con la nueva flag por defecto (`runtime.ts:301`)
   - chip de microcopy en el header (`Nuevo · sin guardar` reemplazo a `Modelo (No guardado)`).

## Por que NO se atribuye al commit P1-5 b777984

Smoke shard 1/4 con los cambios P1-5 aplicados produce **exactamente los
mismos 4 fails**, ningun pass adicional ni nuevo fail. Diff cero en perfil
de smoke entre `d4931c7` y `b777984`.

## Hipotesis de causa raiz

El test 01:81 espera que tras `guardarComoActual(page, "Modelo de prueba")`
el indice de workspace tenga al menos un modelo y el chip diga "guardado".
Si `guardarModeloLocal` o `actualizarMetadataModeloLocal` ahora dependen de
`dirtyModelo === true` en vez de `dirty === true`, y `dirtyModelo` quedo
desincronizado del flujo de creacion inicial (`crearEntidadEnCanvas` setea
`nuevaCosaPendiente` pero podria no marcar `dirtyModelo`), el guardado se
omitiria silenciosamente.

Tambien posible: el chip cambio de texto a `"Nuevo · sin guardar"` y algun
helper o assert intermedio depende del texto previo, pero el error no apunta
a un assert de texto sino a la visibilidad del dialogo "Cargar modelo".

## Accion recomendada

1. Abrir trace del primer fail (`01-carga-y-workspace --reporter=html`) y
   ver si el dialogo `Guardar como` confirmo, si `Modelo guardado exitosamente`
   aparecio, y si el siguiente click en "Cargar" hace algo.
2. Revisar `crearEntidadEnCanvas` y `commitModelo`: confirmar que cualquier
   mutacion semantica setea `dirtyModelo=true`.
3. Revisar el path `guardarComoActual` → `guardarModeloLocal`: confirmar
   que el guardado se ejecuta independiente del valor de `dirtyModelo`.
4. Si la regresion es real, abrir PR de fix sobre `d4931c7` antes de
   continuar con P1-1/P1-2/P1-4.

## Notas operativas

- No se modifico codigo en este commit; solo se documenta el bug.
- El commit P1-5 (`b777984`) se publico igualmente porque sus 7 archivos no
  tocan persistencia y los unit/lint/build/smoke quedan iguales o mejores
  (3 fails preexistentes de runtime.test.ts se curan).
