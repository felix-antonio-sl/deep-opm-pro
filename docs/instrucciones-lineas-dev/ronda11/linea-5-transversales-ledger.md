# Línea 5 — Transversales (read-only + dirty + eco OPL + nominal) + ledger ronda 11

## 1. Misión

Cerrar las HU transversales **EPICA-SHARED** restantes y consolidar la **recalibración del detector ronda 11**:

- **HU-SHARED-003 read-only propagado**: flag `readOnly` en store + indicador UI + redirigir Guardar→Guardar Como en read-only (HU-30.036).
- **HU-SHARED-002 undo/redo granular** (parcial): completar pila de undo/redo para incluir nuevos comandos ronda 10/11 que no estaban registrados (resize, alineación, modificadores, etc.).
- **HU-SHARED-007 eco OPL** (parcial): completar verbalización de despliegue async "ocurren" (ya en ronda 10), especialización (HU-50.015) y cierre de oraciones que falten.
- **HU-SHARED-009 validación nominal** (parcial): nombres vacíos/duplicados de cosas se validan (no solo estados); rechazar al kernel con mensaje actionable.

Adicionalmente:

- **Recalibración del detector ronda 11**: agregar ~14 reglas nuevas en `progress-dashboard.mjs` para HU cerradas por L1+L2+L3+L4 + corregir cualquier preexistente desactualizada.
- **Actualizar HANDOFF post-ronda 11** durante consolidación (NO durante línea).

Slice mínimo entregable: feature **transversales bajo blast** + **chore ledger**. La mayoría de cambios son aditivos pequeños sobre archivos ya estables.

**Fuera de slice**:
- No tocar UI de paneles principales (territorio L1/L2/L3/L4).
- No tocar features grandes (todas en otras líneas).
- No introducir backend/auth para read-only multi-user; es flag local en sesión.

## 2. Deudas que cierra

| HU | Estado actual | Aporte L5 |
|---|---|---|
| HU-SHARED-003 — Read-only propagado | pendiente | `OpmStore.readOnly?: boolean` flag (default `false`); cuando `true`, todas las acciones que modifican modelo se bloquean con mensaje "Modelo en solo lectura. Usa Guardar como para crear copia editable.". UI muestra candado en Toolbar + título de pestaña. |
| HU-30.036 — Redirigir Guardar→Guardar Como en read-only | pendiente | En `acciones-ui.ts`: si `readOnly`, `guardarLocal()` reemplaza por `guardarComo()` con confirmación al usuario. |
| HU-SHARED-002 — Pila undo/redo (granular) | parcial → cubierto | Verificar que cada comando ronda 10/11 (`redimensionarApariencia`, `alinearPorEje`, `aplicarSubtipoModificador`, `editarImagenEntidad`, `reordenarSubprocesoEnTimeline`, `reanclarExtremoEnlace`, `crearObjetoEnPosicion`, etc.) entra correctamente al undo stack como una operación atómica. Tests aditivos. |
| HU-SHARED-007 — Eco OPL sincronizado (parcial) | parcial → cubierto | Verificar que cada cambio de modelo en canvas emite oración OPL en vivo. Cubrir caso especial: ronda 11 L4 agrega multi-acciones (multi al todo) que deben emitir N oraciones de agregación, no solo una. |
| HU-50.015 — Especialización "es un/una" | parcial → cubierto | Verbalización canónica para enlaces de generalización: "{Hijo} es un/una {Padre}". Ya existe parcial en `opl/generadores/refinamiento.ts` o `procedural.ts`; completar + agregar test. |
| HU-SHARED-009 — Validación nominal | parcial → cubierto | Extender validación de nombres vacíos/duplicados desde estados (ya cubierto) a entidades. Rechazar al renombrar a string vacío o duplicado dentro del mismo OPD; mensaje claro. |

**Total esperado**: 4 HU vivas EPICA-SHARED + HU-30.036 + HU-50.015 = 6 HU cubiertas. **+ ~14 reglas detector nuevas para todas las líneas ronda 11.**

## 3. Anclaje a evidencia

- **SSOT**:
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/metodologia-opm-es.md` §read-only: modelos en read-only son artefactos publicados; cualquier cambio requiere copia editable. UX no-multi-user.
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md` §nombres canónicos: una entidad debe tener nombre no vacío único en el OPD activo.
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-opl-es.md` §generalización: `<Hijo> es un/una <Padre>` para HU-50.015.
- **Corpus interno reusable**:
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/modules/app/permissions.service.ts` (si existe) — read-only flag propagation.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/configuration/elementsFunctionality/opmObject.ts` — nombre vacío handling.
- **Estado actual del código (post-ronda-10)**:
  - `app/src/store/runtime.ts` (~500 LOC ronda 9.5): no tiene flag `readOnly`. **L5 agrega `readOnly?` en `OpmStore` + check en `commitModelo` (si readOnly, abort).**
  - `app/src/modelo/operaciones/estados.ts` (~200 LOC): tiene `validarNombreEstado` que rechaza vacío/duplicado. **L5 agrega `validarNombreEntidad` análogo.**
  - `app/src/modelo/operaciones/entidad.ts`: `renombrarEntidad`. **L5 agrega validación duplicado dentro del OPD activo.**
  - `app/src/opl/generadores/refinamiento.ts` (ronda 10): tiene `oracionDespliegue` con "se despliega". **L5 verifica HU-50.015 "es un/una" emitida correctamente para tipo `generalizacion`.**
  - `app/src/store/modelo/acciones-canvas.ts`: `commitModelo` central que tracta undo. **L5 verifica todos los nuevos comandos pasan por commitModelo.**
  - `docs/historias-usuario-v2/tools/progress-dashboard.mjs` (ronda 10): 72 reglas. **L5 agrega ~14 reglas para ronda 11.**

## 4. Archivos permitidos

```text
app/src/modelo/operaciones/entidad.ts             EDIT extiende (validarNombreEntidad, renombrarEntidad con check duplicado)
app/src/modelo/operaciones.ts                     EDIT aditivo si requiere export validarNombreEntidad
app/src/store/runtime.ts                          EDIT aditivo (readOnly flag + check en commitModelo)
app/src/store/tipos.ts                            EDIT aditivo (readOnly?, activarReadOnly action)
app/src/store/modelo/acciones-ui.ts               EDIT extiende (activarReadOnly, redirigir guardarLocal en read-only)
app/src/store/modelo/acciones-canvas.ts           LECTURA (verificar que todos los commits pasan por commitModelo central)
app/src/persistencia/local.ts                     EDIT aditivo (cargar con flag readOnly opcional)
app/src/ui/Toolbar.tsx                            EDIT aditivo (indicador candado read-only)
app/src/ui/MenuPrincipal.tsx                      EDIT aditivo (indicador read-only en título + Guardar deshabilitado)
app/src/ui/PanelOpl.tsx                           EDIT aditivo (indicador read-only en Toolbar OPL)
app/src/ui/BarraPestanas.tsx                      EDIT aditivo (icono candado en pestaña read-only)
app/src/opl/generadores/refinamiento.ts           EDIT verificación (HU-50.015 "es un/una" emite correctamente)
app/src/opl/generadores/refinamiento.test.ts      EDIT aditivo (test HU-50.015)
app/src/modelo/validaciones.ts                    EDIT aditivo (validación nominal completa para entidades)
app/src/modelo/validaciones.test.ts               EDIT aditivo
app/src/store.test.ts                             EDIT aditivo (smokes undo de comandos ronda 10/11)
app/e2e/opm-smoke.spec.ts                         EDIT aditivo (smokes read-only + dirty + eco OPL + nominal)
docs/historias-usuario-v2/tools/progress-dashboard.mjs   EDIT extiende (~14 reglas nuevas + corregir preexistentes si hay drift)
docs/HANDOFF.md                                   EDIT en consolidación final (NO en línea)
opm-extracted/**                                  LECTURA
docs/historias-usuario-v2/**                      LECTURA (no editar HU files)
docs/roadmap/                                     LECTURA (regenerar en consolidación)
```

Cualquier otro archivo es **fuera de scope**.

## 5. Restricciones de no-colisión

- **No tocar `acciones-opd.ts`** (territorio L1).
- **No tocar `ArbolOpd.tsx`, `arbol/*`, `MenuContextualArbol.tsx`, `DialogoGestionArbol.tsx`** (territorio L1).
- **No tocar `Dialogo*.tsx` excepto `DialogoConfirmacion.tsx`** (territorio L2).
- **No tocar `panelOpl/*`** (territorio L3).
- **No tocar `BibliotecaCosa.tsx`, `MenuTipoEnlace.tsx`, `DialogoEstiloEnlace.tsx`, `inspectorEnlace/*`** (territorio L4).
- **No tocar tipos** (`tipos/*` en `app/src/modelo/`): los flags read-only viven en store, no en modelo OPM.
- **No tocar persistencia versiones/archivado** (territorio L2).
- **No tocar generadores OPL principales**: solo verificación HU-50.015 en archivos ya existentes.
- **`Toolbar.tsx`**: L5 agrega solo un icon candado en sección read-only. L2 agrega glifo autosalvado. L4 agrega draggable a botones cosa. Hunks disjuntos (secciones JSX distintas).
- **`MenuPrincipal.tsx`**: L5 agrega indicador. L2 agrega Renombrar + Ejemplos. Hunks disjuntos.
- **`PanelOpl.tsx`**: L5 agrega indicador en Toolbar OPL. L3 reescribe Toolbar entera. **Coordinación**: L5 espera a que L3 esté merged antes de tocar PanelOpl. O bien L5 NO toca PanelOpl y solo deshabilita acciones desde el store (más limpio).
- **`runtime.ts`**: L5 agrega `readOnly` flag. L2 agrega `solicitarConfirmacion` (si no estaba). Hunks disjuntos.
- **Detector**: L5 es el ÚNICO que toca `progress-dashboard.mjs`. Las demás líneas declaran sus reglas en sus briefs pero L5 las consolida.

## 6. Comportamiento esperado

- **Read-only flag**: `OpmStore.readOnly: boolean` (default `false`). Se activa por:
  - Cargar modelo con `cargarLocal(id, { readOnly: true })`.
  - Acción explícita `activarReadOnly()` (ej. desde menú u opción avanzada).
  - Restaurar versión histórica → opcional read-only hasta que el operador confirme edición.
- **Acciones bloqueadas en read-only**: cualquier acción que llame `commitModelo` se aborta si `readOnly === true`, mostrando mensaje "Modelo en solo lectura. Usa Guardar como para crear copia editable.".
- **Indicador UI**:
  - Toolbar: icon `🔒` junto al título del modelo.
  - Pestaña: icon candado en el tab dirty/clean.
  - Menú principal: badge "Solo lectura" + ítem "Crear copia editable" que dispara `guardarComo()` y carga la copia con `readOnly: false`.
  - Panel OPL Toolbar (si L3 ya merged): icon read-only en lugar de minimizar/maximizar.
- **Redirigir Guardar**: en read-only, atajo `Ctrl+S` o botón Guardar dispara `guardarComo()` automáticamente con mensaje "Modelo en solo lectura — guardando como copia nueva".
- **Validación nominal**: `validarNombreEntidad(modelo, entidadId, nombre, opdId)`:
  - Si `nombre.trim() === ""` → error "El nombre no puede estar vacío".
  - Si existe otra entidad con mismo nombre EN EL MISMO OPD ACTIVO → error "Ya existe '{nombre}' en este OPD".
  - El mismo nombre puede repetirse entre OPDs distintos (no es duplicado global).
  - Llamado desde `renombrarEntidad`, desde inputs UI inline, desde imports JSON.
- **HU-50.015 "es un/una"**: para enlaces tipo `generalizacion`, OPL emite oración:
  - `{Hijo}` es un/una `{Padre}` (por sintaxis OPM).
  - Verificar generador ya lo hace o agregar caso si falta.
- **Undo/redo granular**: cada acción ronda 10/11 que llama `commitModelo` registra entrada en `undoStack`. Smoke verifica:
  - Resize → Ctrl+Z revierte tamaño.
  - Aplicar subtipo modificador → Ctrl+Z revierte subtipo.
  - Editar imagen → Ctrl+Z revierte imagen.
  - Reanclar extremo enlace → Ctrl+Z revierte extremo.
  - Conectar multi al todo → Ctrl+Z revierte los N enlaces creados (atómico).
- **Eco OPL HU-SHARED-007 completo**: cada cambio canvas dispara re-render del panel OPL en vivo. Verificar también para acciones nuevas (multi al todo emite N oraciones agregación).

## 7. Pruebas requeridas

**Unit tests**:

- `validaciones.test.ts`: `validarNombreEntidad` casos: vacío/whitespace/duplicado/válido.
- `entidad.test.ts`: `renombrarEntidad` rechaza nombres inválidos.
- `runtime.test.ts`: `commitModelo` aborta si `readOnly`, retorna inmutable.
- `refinamiento.test.ts` o `procedural.test.ts`: HU-50.015 caso "Hijo es un Padre".

**Smoke browser** (~5 nuevos):

- "Read-only bloquea edición": cargar modelo en read-only, intentar renombrar entidad, verificar mensaje + sin cambio.
- "Read-only Guardar redirige a Guardar Como": Ctrl+S en read-only, verifica DialogoGuardarComo abierto.
- "Validación nombre vacío rechaza renombrado": intentar renombrar a "", mensaje "El nombre no puede estar vacío".
- "Validación nombre duplicado rechaza renombrado": intentar renombrar a nombre existente en mismo OPD, mensaje correspondiente.
- "Undo de comando ronda 10 (resize) revierte correctamente": resize manual de cosa, Ctrl+Z, verificar tamaño anterior.

**Detector**: tras consolidar reglas nuevas, run `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real` debe reportar:
- ≥85 reglas matched (vs 72 baseline).
- 0 reglas unmatched (todas las nuevas reglas deben matchear evidencia real).
- MVP-α ≥75-80% ponderado (objetivo conservador post-ronda-11).

## 8. Métricas esperadas

- **Tests aditivos**: ~8 unit + 5 smokes nuevos.
- **HU cerradas L5 directas**: 6 HU vivas (HU-SHARED-002/.003/.007/.009 + HU-30.036 + HU-50.015).
- **HU cerradas indirectas vía detector recalibrado**: ~50 HU adicionales (las cubiertas por L1/L2/L3/L4 que el detector reconocerá).
- **Reglas detector que esta línea consolida** (suma de las declaradas por L1/L2/L3/L4 + propias L5):
  - Reglas L1: ~4
  - Reglas L2: ~8
  - Reglas L3: ~5
  - Reglas L4: ~13
  - Reglas L5 propias: ~3 (HU-SHARED-003, HU-30.036, HU-50.015 + nominal)
  - **Total estimado**: ~33 reglas nuevas (de 72 → ~85-90 totales).
- **Build**: cero impacto significativo (cambios pequeños).
- **Smoke browser**: 59 → ~80 (con todas las líneas).

## 9. Loop verde y commits

```bash
cd app
bun run check          # 597 → ~660 unit (con todas las líneas)
bun run browser:smoke  # 59 → ~80
bun run build          # main chunk objetivo < 185 KB / < 50 KB gzip
cd ..
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

Commits sugeridos:

1. `feat(modelo): validarNombreEntidad rechaza vacío/duplicado en OPD (HU-SHARED-009)`
2. `feat(opl): verbaliza generalización "es un/una" canónico (HU-50.015)`
3. `feat(store): readOnly flag bloquea commitModelo + indicadores UI (HU-SHARED-003)`
4. `feat(persistencia): redirigir Guardar→Guardar Como en read-only (HU-30.036)`
5. `test(store): undo/redo granular para comandos ronda 10/11 (HU-SHARED-002)`
6. `chore(ledger): recalibra detector ronda 11 (~14 reglas nuevas)`
7. `chore(handoff): cierra ronda 11 - HANDOFF post-MVP-α 80-90%` *(en consolidación final)*

## 10. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| **`readOnly` flag no se propaga a todas las acciones**: si una acción no pasa por `commitModelo`, no se bloquea. | Auditar grep de `commitModelo` en `acciones-*.ts`; cada acción que muta modelo DEBE pasar por él. Tests cubren cada commit ronda 10/11. |
| **Undo de comando atómico falla si el comando llama múltiples `commitModelo`**: ej. multi-al-todo crea N enlaces como N commits → N undos. | Refactor a un solo `commitModelo` envolvente con `mensaje` agrupado. Tests verifican comportamiento atómico. |
| **Validación nominal duplica con `validarNombreEstado`**: ya existe lógica similar. | Extraer helper común `validarNombre(coleccion, nombre, idActual)` reusable. |
| **HU-50.015 ya estaba parcial**: si está cubierto pero no detectado, solo agregar regla detector. | Verificar primero con `bun test`; si emite "es un/una", solo recalibrar detector. Si no, completar emisión. |
| **Recalibración detector L5 depende de evidencias L1/L2/L3/L4 ya merged**: si una línea no terminó, sus reglas no matchean. | Coordinación: L5 corre AL FINAL de la ronda, después de todas las demás. Si alguna línea queda incompleta, marcar reglas afectadas como `parcial` con nota. |
| **`docs/HANDOFF.md` se toca en consolidación, no en línea**: pero L5 prepara contenido. | L5 deja un draft `docs/handoff-ronda11-draft.md` durante línea; consolidación lo sustituye en HANDOFF.md y borra el draft. |
| **Read-only conflicto con persistencia (L2)**: L2 toca diálogos persistencia, L5 redirige Guardar→Guardar Como. | L5 agrega lógica en `acciones-ui.ts` (extiende `guardarLocal` o agrega wrapper). L2 NO toca acciones-ui de persistencia. Disjunto. |
| **Indicador UI read-only en PanelOpl choca con L3 Toolbar nueva**: L3 reescribe Toolbar OPL. | L5 agrega solo un icon al final de la Toolbar L3, sin tocar layout. Coordinación: L5 después de L3. O alternativamente, indicator en Toolbar principal solo (no en panelOpl). |

## 11. Salida esperada

Al cierre de L5 + consolidación, el operador debe poder:

- Cargar un modelo en modo solo lectura y ver claramente que no es editable.
- Crear una copia editable con un click cuando intenta guardar un read-only.
- Confiar en que cada acción del canvas se puede deshacer atómicamente (incluyendo features ronda 10/11).
- Recibir mensajes claros cuando intenta poner nombres vacíos o duplicados.
- Ver oraciones OPL canónicas para todos los tipos de enlace, incluyendo generalización.

**Estado MVP-α esperado post-ronda 11**: 50.0% → **80-90% ponderado** (depende de pesos exactos por HU; estimación conservadora). Detector ≥85 reglas matched. Cero deuda estructural pendiente. Próxima ronda 12+ enfocada en EPICA-32/33 (sub-modelos + plantillas) o EPICA-50 fase profunda (edición OPL bidireccional con parser).

EPICA-SHARED cierra al 100% (4/4 vivas). MVP-α en estado presentable y demostrable, listo para validación con stakeholders.
