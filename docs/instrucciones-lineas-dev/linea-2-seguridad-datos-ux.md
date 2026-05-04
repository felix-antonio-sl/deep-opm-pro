# Línea 2 — UX de seguridad de datos: Guardar/Descartar/Cancelar + beforeunload + import asistido

## 1. Misión

El kernel ya calcula `dirty` correctamente (snapshot del último guardado vs. modelo actual). Lo que falta es la barrera de defensa **antes** de operaciones destructivas que pierden trabajo del usuario, y una salvaguarda contra cierre accidental de pestaña. Este es el slice de mayor valor percibido por el usuario, menor blast radius técnico, y desbloquea trabajar con confianza durante las líneas estructurales (L1, L4, L5).

**Tres entregables**:

1. **Diálogo "Hay cambios sin guardar — Guardar / Descartar / Cancelar"** intercepta cualquier operación destructiva mientras `dirty === true`: `nuevoModelo`, `cargarLocal`, `cargarDemo`, `importarJson`.
2. **`beforeunload` handler** cuando `dirty === true`: navegador pregunta antes de cerrar pestaña/recargar.
3. **Import asistido**: el textarea actual de pegar JSON se complementa con un file picker / drag-and-drop, preview del nombre/conteo de entidades antes de aplicar, y mensajes de error legibles cuando `hidratarModelo` falla.

## 2. HU base (lectura obligatoria antes de codificar)

| HU | Path | Aporta |
|---|---|---|
| HU-SHARED-006 | `docs/historias-usuario-v2/shared/HU-SHARED-006-dirty-state.md` | Contrato canónico del estado dirty (computado, no monotónico) |
| HU-30.005 | `docs/historias-usuario-v2/epicas/epica-30-persistencia-save-load.md` (sección 30.005) | Diálogo "Guardar como" |
| HU-30.012 | `docs/historias-usuario-v2/epicas/epica-30-persistencia-save-load.md` (sección 30.012) | Telón oscurecido durante diálogo |
| HU-30.013 | `docs/historias-usuario-v2/epicas/epica-30-persistencia-save-load.md` (sección 30.013) | Toast "guardado exitosamente" — ya existe, validar que sigue |
| HU-30.014 | `docs/historias-usuario-v2/epicas/epica-30-persistencia-save-load.md` (sección 30.014) | Ctrl+S — ya existe |
| HU-30.017 | `docs/historias-usuario-v2/epicas/epica-30-persistencia-save-load.md` (sección 30.017) | Nuevo Modelo |
| HU-30.037 | `docs/historias-usuario-v2/epicas/epica-30-persistencia-save-load.md` (sección 30.037) | Cancelar diálogo con ESC |
| HU-SHARED-002 (referencia) | `docs/historias-usuario-v2/shared/HU-SHARED-002-undo-redo.md` | Protocolo de undo — base del cómputo de dirty |

## 3. Anclaje a evidencia

- **OPCloud**: el patrón observado en producción es modal con telón opaco (~50% opacity) y tres botones horizontales. Buscar en `opm-extracted/_raw/` por términos como `dialog`, `modal`, `unsaved`, `discard`. Tomá la forma, no copiar markup.
- **JOYAS**: `docs/JOYAS.md` — botones primarios cyan `#3BC3FF`, secundarios neutros, espaciado 12-16px. Tipografía Arial 14px semibold.
- **Estado actual**: el dirty ya está implementado en `store.ts`. Verificar que `useOpmStore(s => s.dirty)` devuelve booleano correcto. NO modificar la lógica de dirty.

## 4. Archivos permitidos (scope estricto)

```
app/src/ui/Dialogo.tsx                       ← NUEVO — componente modal genérico (telón + caja + botones + ESC + foco)
app/src/ui/DialogoConfirmacion.tsx           ← NUEVO — alias para diálogo Guardar/Descartar/Cancelar (puede ser un hook + componente)
app/src/ui/Toolbar.tsx                       ← EDIT — interceptar acciones destructivas (Nuevo, Cargar, Demo)
app/src/ui/PersistenciaJson.tsx              ← EDIT — file picker + drag-and-drop + preview + mensajes legibles
app/src/main.tsx                             ← EDIT — beforeunload handler
```

**Lectura permitida** (para uso, no edición):
- `app/src/store.ts`: `useOpmStore`, `dirty`, acciones `nuevoModelo`, `cargarLocal`, `cargarDemo`, `importarJson`. Si necesitás modificar el store, **detenerse y consultar**.
- `app/src/persistencia/local.ts`: hidratación; si querés mostrar errores legibles, leé qué errores produce.
- `app/src/serializacion/json.ts`: estructura del JSON.

**Prohibido**: tocar `app/src/modelo/*`, `app/src/opl/*`, `app/src/render/*`, `app/src/serializacion/*`, `app/src/store.ts`, `app/src/persistencia/local.ts`.

## 5. Restricciones de no-colisión

1. NO modificar `store.ts`. Sólo lectura. Si una decisión exige modificar el store (poco probable), documentar y detenerse.
2. NO modificar `persistencia/local.ts` ni `serializacion/json.ts`. La hidratación ya valida; sólo hay que **mostrar** mejor sus errores.
3. Las acciones destructivas se interceptan **en la UI**, no en el store. Patrón: el handler del botón llama a un hook `useConfirmarSiDirty(action: () => void)`; si dirty es false, ejecuta directo; si true, abre el diálogo.
4. `beforeunload` debe usar el patrón estándar (`event.preventDefault()` + `event.returnValue = ""`) sin texto custom (los browsers modernos lo ignoran). Solo se activa cuando `dirty === true`.

## 6. Slice mínimo shippeable

Lo que debe quedar funcionando al cerrar la línea:

1. **Diálogo modal genérico (`Dialogo.tsx`)**:
   - Telón con opacidad ~50% sobre el canvas.
   - Caja centrada con título, mensaje, slot para botones.
   - ESC cierra (interpretado como "Cancelar" según HU-30.037).
   - Foco inicial en el botón primario (Guardar) cuando aplica.
   - Cierre vía click fuera del modal: NO (forzar elección consciente; sólo ESC y botones cierran).
2. **Hook `useConfirmarSiDirty`** o equivalente que toma una acción y la ejecuta directamente si `dirty === false`, o abre el diálogo si `dirty === true`. Las tres opciones del diálogo:
   - **Guardar**: ejecuta `guardar()` (acción existente del store) y luego la acción original.
   - **Descartar**: ejecuta la acción original sin guardar.
   - **Cancelar**: cierra el diálogo, no ejecuta nada.
3. **Toolbar.tsx**: los handlers de "Nuevo", "Cargar local", "Cargar demo" pasan por el hook.
4. **PersistenciaJson.tsx**:
   - El handler de "Importar" pasa por el hook.
   - Agregar un `<input type="file" accept="application/json">` o área de drop alternativa al textarea actual (pueden coexistir).
   - Antes de aplicar el JSON, mostrar preview corto: `Modelo "X" — N entidades, M OPDs, K enlaces`.
   - Si `hidratarModelo` devuelve error, mostrarlo legible (no `[object Object]`).
5. **main.tsx**: `window.addEventListener("beforeunload", handler)` cuando dirty; handler usa `event.preventDefault()` + `event.returnValue = ""`. Suscribirse al store para activar/desactivar el listener (alternativa: leer dirty al vuelo desde el listener via `store.getState().dirty`).

## 7. Tests obligatorios

Test unitario o smoke browser para cada salvaguarda:

- **Smoke browser** en `app/playwright/` (o el path equivalente que use `bun run browser:smoke`):
  - Tras crear una entidad → click "Nuevo" → diálogo aparece → click "Cancelar" → modelo intacto.
  - Tras crear una entidad → click "Nuevo" → diálogo aparece → click "Descartar" → modelo nuevo cargado, dirty false.
  - Tras crear y guardar → click "Nuevo" → diálogo NO aparece (dirty es false).
  - ESC cierra el diálogo (equivale a Cancelar).

Si el harness de smoke no permite estos flujos triviales, agregar al menos un unit test de la integración del hook `useConfirmarSiDirty` con un store mock.

## 8. Verificación

```bash
cd app
bun run check          # typecheck + unit tests OBLIGATORIO verde
bun run browser:smoke  # smoke con los nuevos casos
bun run dev            # validación visual manual: telón, foco, ESC, Ctrl+S sigue funcionando
```

## 9. Decisiones bloqueadas (no reabrir)

- Interceptar **en la UI**, no en el store. Razón: simplicidad; el store sigue síncrono y no necesita estado de "esperando confirmación".
- ESC = Cancelar (no = Descartar). Razón: principio de menor sorpresa.
- `beforeunload` activo sólo cuando `dirty === true`. Razón: no molestar al usuario en cierre legítimo.

## 10. Decisiones que tomás vos (documentar en commit)

- Componente vs. hook: podés implementar el diálogo como `<DialogoConfirmacion />` controlado por estado local de Toolbar/PersistenciaJson, o exponer un `useConfirmar` que monta el modal globalmente. Lo segundo escala mejor; lo primero es más simple. Elegí lo que prefieras y documentá razón en el commit.
- Drag-and-drop opcional: si el time presupuestado lo permite, agregar zona drop en `PersistenciaJson.tsx`. Si no, file picker basta.

## 11. Forma del entregable

- Uno o varios commits, prefijo `feat(ui)` para diálogo y safeguards, `feat(persistencia)` para import asistido si tocás algo de ese eje (debería ser sólo UI).
- Mensajes en imperativo, co-author footer estándar.
- No tocar HU ni HANDOFF.
