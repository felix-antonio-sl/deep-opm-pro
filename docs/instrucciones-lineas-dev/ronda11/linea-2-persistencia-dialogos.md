# Línea 2 — Persistencia + diálogos modales canónicos

## 1. Misión

Cerrar la **EPICA-30 persistencia** (16 pendientes + 5 parciales = 21 HU vivas) llevando el flujo guardar/cargar a la UX canónica de OPCloud:

- **Pantalla de inicio** con grid "Modelos Recientes" siempre visible y canvas oscurecido como telón.
- **Diálogo Guardar Como extendido**: campo descripción opcional, breadcrumb navegable (ya existe), Cancel/ESC sin persistir.
- **Diálogo Cargar Modelo extendido**: doble clic carga, clic + botón Cargar carga, Cargar Ejemplo Global y Organizacional, glifos editable/candado/autosalvado, búsqueda local por nombre, vista tiles vs lista.
- **Versiones**: toggle "Mostrar Versiones", política log-scale (10/día, 1/sem, 1/mes, máx 10), creación manual.
- **Archivado**: toggle "Mostrar Archivados", auto-archivar tras 90 días sin abrir, restaurar desde archivado.
- **Renombrado de modelo existente** sin requerir Guardar Como (HU-30.016).
- **Autosalvado cada 5 minutos** con glifo de flechas circulares en tile.

Slice mínimo entregable: feature **persistencia + UI diálogos** sin tocar kernel ni OPL. Toda la lógica vive en `persistencia/*` extendido + `ui/Dialogo*.tsx` + nuevo `ui/PantallaInicio.tsx` + `MenuPrincipal.tsx`.

**Fuera de slice**:
- Backend, Firebase, auth, sync remoto. Single-user MVP-α; cualquier multi-user es MVP-β+.
- Export PDF/SVG/CSV (EPICA-60/61/71): bloqueadas por regla "no introducir dependencias nuevas".
- Permisos read-only (territorio L5).
- Sub-modelos / plantillas (EPICA-32/33): MVP-β.

## 2. Deudas que cierra

| HU | Estado actual | Aporte L2 |
|---|---|---|
| HU-30.007 — Descripción opcional al guardar | pendiente | Campo `<textarea>` opcional en `DialogoGuardarComo.tsx`; persiste como `Modelo.descripcion?` aditivo. |
| HU-30.011 — Grid "Modelos Recientes" siempre visible | pendiente | Nueva `PantallaInicio.tsx` con grid de últimos 12 modelos abiertos. Aparece al cargar app sin modelo activo o al cerrar el último. |
| HU-30.012 — Canvas oscurecido como telón | pendiente | Backdrop semi-transparente sobre canvas mientras `PantallaInicio` está abierta. |
| HU-30.016 — Renombrar modelo existente sin Guardar Como | pendiente | Opción "Renombrar..." en `MenuPrincipal.tsx` que abre input simple en línea. Persiste vía `renombrarModeloLocal(id, nombre)` en `persistencia/local.ts`. |
| HU-30.022 — Cargar Ejemplo Organizacional | pendiente | Nuevo botón "Ejemplo Organizacional" en `DialogoCargarModelo.tsx` que carga JSON precanónico (`assets/ejemplos/organizacional.json` o equivalente). |
| HU-30.023 — Toggle "Mostrar Versiones" | pendiente | Toggle en `DialogoVersiones.tsx` que filtra entradas por flag persistente. |
| HU-30.024 — Política log-scale 10/día/sem/mes máx 10 | pendiente | Lógica en `persistencia/versiones.ts`: al `crearVersion`, evalúa cuántas hay en últimas 24h/7d/30d y elimina las que excedan el cap; máximo total 10. |
| HU-30.025 — Toggle "Mostrar Archivados" | pendiente | Toggle en `DialogoArchivados.tsx` con cargado lazy de archivados. |
| HU-30.026 — Auto-archivar tras 90 días sin abrir | pendiente | Cron simulado en `autosalvado.ts` o lazy check al abrir app: marca como archivado todo modelo con `ultimoUso` > 90d. Flag `auto-archivado` para distinguir. |
| HU-30.027 — Restaurar archivado | parcial → cubierto | Botón "Restaurar" ya parcial en `DialogoArchivados.tsx`; completar acción `restaurarArchivado(id)` que vuelve a estado activo y actualiza `ultimoUso`. |
| HU-30.028 — Buscar modelos por nombre | pendiente | Input en `DialogoCargarModelo.tsx` y/o `PantallaInicio.tsx` que filtra por substring case-insensitive. |
| HU-30.032 — Alternar vista tiles vs lista | pendiente | Toggle en `DialogoCargarModelo.tsx` con dos modos render: grid de tiles (default) vs lista compacta. Persistir en preferencias. |
| HU-30.033 — Ordenar lista por columna | pendiente | En modo lista, headers clickeables para ordenar por Nombre / Descripción / Fecha modificado / Tamaño. Default: Fecha modificado descendente. |
| HU-30.034 — Glifos editable/candado/autosalvado en tiles | pendiente | Iconos pequeños esquina inferior derecha de cada tile: lápiz (editable), candado (read-only), flechas circulares (autosalvado). |
| HU-30.035 — Autosalvado cada 5 minutos | pendiente | Timer en `autosalvado.ts` cada 5 min cuando hay cambios pendientes. Glifo HU-30.034 visible mientras corre. |
| HU-30.036 — Read-only redirige Guardar→Guardar Como | pendiente | Si modelo abierto en read-only (territorio L5), `guardarLocal()` reemplaza por `guardarComo()` automáticamente con confirmación. |
| HU-30.008 — Persistir payload OPM íntegro | parcial → cubierto | Verificar `exportarModelo` ya cubre todos los campos opcionales nuevos (gridConfig, imagen, modoTamano, subtipoModificador, descripcion). Test de roundtrip extendido. |
| HU-30.019 — Cargar con doble clic | parcial → cubierto | Doble clic sobre tile dispara `cargarLocal(id)`. Ya parcial en `DialogoCargarModelo.tsx`; completar wiring + smoke. |
| HU-30.020 — Cargar con clic + botón | parcial → cubierto | Clic selecciona tile, botón "Cargar" se habilita. Patrón ya parcial; completar UX. |
| HU-30.021 — Cargar Ejemplo Global | parcial → cubierto | Botón "Ejemplo Global" ya existe parcial; completar carga del JSON canónico. |
| HU-30.037 — Cancelar modal con Cancelar o ESC | parcial → cubierto | Wrapper `Dialogo.tsx` ya captura Esc. Completar para todos los diálogos persistencia + smoke. |

**Total esperado**: 16 pendientes + 5 parciales = 21 HU cubiertas (todo EPICA-30 vivo cierra).

## 3. Anclaje a evidencia

- **SSOT**:
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/metodologia-opm-es.md` §persistencia: el modelo OPM se serializa íntegro como JSON. La persistencia es ortogonal a la semántica.
  - JOYAS §persistencia: workspace local + jerarquía + autosalvado + versiones + archivado son contrato único de MVP.
- **Corpus interno reusable**:
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/dialogs/save-as-dialog/` — patrón Save As con descripción + breadcrumb.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/dialogs/load-model-dialog/` — patrón Cargar con grid/list + búsqueda + glifos.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/dialogs/versions-dialog/` — patrón versiones (si existe).
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/modules/app/persistence.service.ts` — autosalvado lifecycle.
- **Estado actual del código (post-ronda-10)**:
  - `app/src/persistencia/local.ts` (~150 LOC ronda 8): `guardarLocal`, `cargarLocal`, `eliminarLocal`. **L2 agrega `renombrarModeloLocal`, `tocarUltimoUso`.**
  - `app/src/persistencia/versiones.ts` (~80 LOC): `crearVersion`, `restaurarVersion`, `eliminarVersion`. **L2 agrega política log-scale + max 10.**
  - `app/src/persistencia/autosalvado.ts` (~60 LOC): hook básico. **L2 extiende con timer 5 min + glifo trigger.**
  - `app/src/persistencia/workspace.ts` (~200 LOC ronda 8): `WorkspaceIndice`, `escribirIndiceWorkspace`, `archivarModelo`, `archivarCarpeta`, `buscarGlobal`. **L2 extiende con auto-archivar 90d, descripción, glifos.**
  - `app/src/ui/Dialogo*.tsx`: existen en lugares. **L2 extiende cada uno con sus HU específicas.**
  - `app/src/ui/MenuPrincipal.tsx` (~50 LOC): tiene Guardar/Guardar como/Cargar/Nuevo. **L2 agrega "Renombrar..." item.**
  - `app/src/store/runtime.ts`: tiene `solicitarConfirmacionAlCerrar` ya (HU-SHARED-006 ronda 10 L5). **L2 reusa para confirmar Cargar dirty.**

## 4. Archivos permitidos

```text
app/src/modelo/tipos/modelo.ts                    EDIT aditivo (Modelo.descripcion?)
app/src/modelo/tipos/ui.ts                        EDIT aditivo (PreferenciasUiUsuario.{vistaCargar?, ordenCargar?, recientes?})
app/src/persistencia/local.ts                     EDIT extiende (renombrarModeloLocal, tocarUltimoUso, listarRecientes, tocarUltimoUsoBatch)
app/src/persistencia/local.test.ts                EDIT aditivo
app/src/persistencia/versiones.ts                 EDIT extiende (política log-scale + max 10 + filtrarVisibles)
app/src/persistencia/versiones.test.ts            EDIT aditivo
app/src/persistencia/autosalvado.ts               EDIT extiende (timer 5 min + estado glifo)
app/src/persistencia/autosalvado.test.ts          EDIT aditivo
app/src/persistencia/workspace.ts                 EDIT extiende (autoArchivarPorEdad, descripcion, restaurarArchivado completo)
app/src/persistencia/workspace.test.ts            NUEVO si no existe
app/src/serializacion/json.ts                     EDIT aditivo (incluir descripcion en exportarModelo, validar al hidratar)
app/src/serializacion/json.test.ts                EDIT aditivo (test descripcion roundtrip)
app/src/store/runtime.ts                          EDIT aditivo (solicitarConfirmacion para Cargar dirty si no estaba completo)
app/src/store/tipos.ts                            EDIT aditivo (acciones nuevas)
app/src/store/modelo/acciones-ui.ts               EDIT extiende (abrirDialogoVersiones, abrirDialogoArchivados, cerrarPantallaInicio, abrirRenombrarModelo)
app/src/ui/PantallaInicio.tsx                     NUEVO (grid recientes + telón + búsqueda)
app/src/ui/DialogoCargarModelo.tsx                EDIT extiende (toggle versiones+archivados, búsqueda local, vista tiles/lista, glifos)
app/src/ui/DialogoGuardarComo.tsx                 EDIT extiende (descripcion textarea)
app/src/ui/DialogoVersiones.tsx                   EDIT extiende (toggle visible, política aplicada)
app/src/ui/DialogoArchivados.tsx                  EDIT extiende (toggle visible, restaurar acción completa)
app/src/ui/MenuPrincipal.tsx                      EDIT aditivo (Renombrar... item, Ejemplo Organizacional submenú)
app/src/ui/Toolbar.tsx                            EDIT aditivo (glifo autosalvado opcional en barra)
app/e2e/opm-smoke.spec.ts                         EDIT aditivo (smokes persistencia L2)
assets/ejemplos/                                  NUEVO opcional (organizacional.json si se diseña uno canónico distinto al global)
opm-extracted/**                                  LECTURA
docs/HANDOFF.md                                   LECTURA
docs/historias-usuario-v2/**                      LECTURA
```

Cualquier otro archivo es **fuera de scope**.

## 5. Restricciones de no-colisión

- **No tocar `acciones-opd.ts`** (territorio L1).
- **No tocar `acciones-canvas.ts`** (territorio L3 + L4).
- **No tocar `acciones-enlace.ts` ni `acciones-entidad.ts`** (territorio L4).
- **No tocar `ArbolOpd.tsx`, `arbol/*`, `MenuContextualArbol.tsx`, `DialogoGestionArbol.tsx`** (territorio L1).
- **No tocar `PanelOpl.tsx`, `panelOpl/*`** (territorio L3).
- **No tocar `BibliotecaCosa.tsx`, `MenuTipoEnlace.tsx`** (territorio L4, archivos nuevos).
- **No tocar `progress-dashboard.mjs`** (territorio L5 consolidación).
- **`tipos/ui.ts`**: L2 agrega `vistaCargar?`, `ordenCargar?`, `recientes?`. Disjunto de L1/L3.
- **`Toolbar.tsx`**: L2 agrega solo glifo autosalvado opcional. L4 toca botones modelado. L5 toca read-only indicator. Hunks disjuntos.
- **`MenuPrincipal.tsx`**: L2 agrega Renombrar + Ejemplo Organizacional. L5 agrega indicador read-only. Hunks disjuntos.
- **`runtime.ts`**: L2 agrega `solicitarConfirmacion` (si no estaba); L5 agrega `readOnly` flag. Hunks disjuntos.

## 6. Comportamiento esperado

- **Pantalla de Inicio** aparece automáticamente al abrir la app si no hay modelo activo, o al cerrar el último (incluyendo "Nuevo" sin guardar y luego cerrar pestaña). Telón oscurece canvas pero permite ver el modelo de fondo si existía.
- **Grid recientes** muestra los últimos 12 modelos por `ultimoUso` desc, con tile de 200×140 px: nombre + descripción truncada + fecha + glifos esquina inferior.
- **Búsqueda local en grid**: input arriba que filtra tiles por nombre case-insensitive en vivo.
- **Doble clic sobre tile**: carga inmediato con confirmación dirty si aplica.
- **Clic sobre tile + botón "Abrir"**: equivalente a doble clic.
- **Botón "Nuevo"** en grid: cierra pantalla y abre modelo nuevo vacío.
- **Botón "Cargar Ejemplo Global"** y **"Cargar Ejemplo Organizacional"**: cargan JSONs precanónicos.
- **Renombrar... en MenuPrincipal**: abre modal pequeño con campo nombre, valida no-duplicado, persiste sin Guardar Como.
- **Versiones**: toggle "Mostrar versiones" muestra/oculta la columna en tiles. Por defecto oculta.
- **Política log-scale**: al `crearVersion`, evaluar:
  - Últimas 24h: máximo 10 versiones.
  - Últimos 7 días: máximo 7 (excluyendo las 24h, el resto).
  - Últimos 30 días: máximo 4.
  - Más de 30 días: máximo 1.
  - Total absoluto: 10. Si excede, eliminar las más antiguas dentro de su bucket.
- **Auto-archivado**: al abrir app, escanea modelos con `ultimoUso > 90 días`; los marca `archivado=true, archivadoAuto=true`. Notificar al usuario en pantalla inicio si hubo auto-archivado en sesión actual.
- **Toggle Mostrar Archivados**: muestra modelos archivados como tiles con badge "Archivado" semi-transparente.
- **Restaurar archivado**: botón en tile o en `DialogoArchivados`; pone `archivado=false` y `ultimoUso=now`.
- **Vista tiles vs lista**: toggle persistido en preferencias. Lista muestra columnas Nombre, Descripción, Modificado, Tamaño, Glifos. Headers clickeables ordenan asc/desc.
- **Glifos**: lápiz (editable, default), candado (read-only), flechas circulares (autosalvado activo). Tooltips claros.
- **Autosalvado**: timer cada 5 min mientras dirty. Tras guardado exitoso, glifo gira 360° una vez y vuelve a estático.

## 7. Pruebas requeridas

**Unit tests**:

- `local.test.ts`: `renombrarModeloLocal(id, nuevo)` cambia nombre, preserva contenido, falla si duplicado. `tocarUltimoUso(id)` actualiza timestamp.
- `versiones.test.ts`: política log-scale con timestamps mockeados (tabla de casos: 100 versiones distribuidas en 90 días → quedan ≤10).
- `autosalvado.test.ts`: timer dispara `guardarLocal()` cada 5 min mientras dirty; no dispara si limpio.
- `workspace.test.ts`: `autoArchivarPorEdad(indice, 90)` marca correctamente; `restaurarArchivado(indice, id)` revierte estado.
- `json.test.ts`: roundtrip con `Modelo.descripcion?` lossless.

**Smoke browser** (~10 nuevos):

- "Pantalla inicio aparece al abrir app sin modelo": navegar a `/`, verificar telón + grid + búsqueda.
- "Pantalla inicio carga modelo con doble clic": tile doble clic → modelo activo.
- "DialogoGuardarComo persiste descripción": llenar nombre + descripción, guardar, recargar, verificar `Modelo.descripcion` presente.
- "Renombrar modelo desde menú principal": abrir `MenuPrincipal` > "Renombrar...", cambiar nombre, verificar persistido.
- "DialogoCargarModelo busca por nombre": input búsqueda filtra tiles.
- "DialogoCargarModelo alterna tiles/lista": toggle, verificar render distinto.
- "DialogoVersiones aplica política log-scale": crear 15 versiones simuladas, verificar quedan ≤10.
- "DialogoArchivados restaura modelo": clic en Restaurar, verificar tile vuelve a recientes.
- "Cargar Ejemplo Organizacional": botón carga modelo organizacional con N entidades esperadas.
- "Esc cierra todos los diálogos persistencia sin persistir cambios": uno por diálogo (5 sub-tests dentro o agrupados).

## 8. Métricas esperadas

- **Tests aditivos**: ~15 unit + 10 smokes nuevos.
- **HU cerradas**: 16 pendientes + 5 parciales = 21 HU cubiertas.
- **Reglas detector ronda 11 que esta línea aporta** (a registrar en consolidación L5):
  - HU-30.007 → 1 regla (descripción persiste).
  - HU-30.011/.012 → 1 regla (PantallaInicio + telón).
  - HU-30.016 → 1 regla (renombrar sin Guardar Como).
  - HU-30.022 → 1 regla (Ejemplo Organizacional).
  - HU-30.023/.024 → 1 regla (toggle versiones + log-scale).
  - HU-30.025/.026/.027 → 1 regla (toggle archivados + auto-archivar 90d + restaurar).
  - HU-30.028/.032/.033 → 1 regla (búsqueda local + tiles/lista + ordenamiento columna).
  - HU-30.034/.035 → 1 regla (glifos + autosalvado 5 min).
  - HU-30.036 → 1 regla **L5** (read-only redirect, NO L2).
  - **Total estimado L2**: 8 reglas nuevas.
- **Build**: chunk principal o lazy `feature-pantallainicio-*.js` separado de ~5-8 KB. Razonable.
- **Smoke browser**: 59 → ~69 (con L1).

## 9. Loop verde y commits

```bash
cd app
bun run check          # 597 → ~615 unit
bun run browser:smoke  # 59 → ~70 (con L1)
bun run build          # main chunk objetivo < 175 KB / < 47 KB gzip
```

Commits sugeridos:

1. `feat(modelo): Modelo.descripcion? aditivo + roundtrip JSON (HU-30.007)`
2. `feat(persistencia): renombrarModeloLocal + tocarUltimoUso (HU-30.016)`
3. `feat(persistencia): política log-scale versiones + max 10 (HU-30.024)`
4. `feat(persistencia): autosalvado cada 5 min + glifo (HU-30.035)`
5. `feat(persistencia): autoArchivar 90 días + restaurar (HU-30.026/.027)`
6. `feat(ui): PantallaInicio con grid recientes + telón + búsqueda (HU-30.011/.012/.028)`
7. `feat(ui): DialogoCargarModelo con tiles/lista + ordenamiento + glifos (HU-30.032/.033/.034)`
8. `feat(ui): DialogoGuardarComo descripción + DialogoVersiones toggle + DialogoArchivados toggle (HU-30.007/.023/.025)`
9. `feat(ui): MenuPrincipal Renombrar + Ejemplo Organizacional (HU-30.016/.022)`
10. `test(e2e): smokes persistencia L2 (10 nuevos)`

Cada commit verde antes de avanzar. Co-author si aplica.

## 10. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| **`tipos/modelo.ts` agrega campo opcional** que rompe hidratación de modelos antiguos. | Default `descripcion: undefined` en `hidratarModelo`. Test de roundtrip explícito sin descripción. |
| **PantallaInicio bloquea acceso al canvas** y rompe smokes existentes que asumen canvas visible al cargar. | Agregar `data-testid="pantalla-inicio"` y skip en smokes existentes vía `closePantallaInicioSiVisible(page)` helper. PantallaInicio NO aparece si ya hay modelo activo en sesión. |
| **Auto-archivado de 90 días destruye modelos del operador**: si el operador no abrió un modelo válido en 90 días pero quiere preservarlo. | Auto-archivado solo MARCA, no elimina. Restaurar sigue disponible. Notificar en sesión. Pin opcional con flag `noAutoArchivar?` en futuro. |
| **Política log-scale elimina versiones que el usuario quería preservar**. | Versión "preferida" con flag manual `preservar?` que la exenta. Mostrar en UI cuáles son log-scale vs preservadas. |
| **Choque sobre `runtime.ts` con L5 read-only**. | L2 toca solo `solicitarConfirmacion`. L5 agrega `readOnly` flag separado. Hunks disjuntos por sección. |
| **Diálogos diferentes con foco/Esc handling inconsistente**. | Wrapper `Dialogo.tsx` ya maneja foco + Esc; verificar cada Dialogo* la usa. Tests aditivos por diálogo. |
| **JSON ejemplos organizacional/global pesa demasiado al cargar**. | Lazy import en `import("../../assets/ejemplos/organizacional.json")` solo al clic en botón. |
| **Búsqueda en grid causa re-render costoso** con muchos modelos (>200). | Debounce 200ms en input + memoización por nombre. Aceptable para MVP-α (single-user típicamente <50 modelos). |

## 11. Salida esperada

Al cierre de L2, el operador debe poder:

- Abrir la app y ver pantalla de inicio con modelos recientes en grid.
- Buscar modelos por nombre desde la pantalla.
- Cargar un ejemplo Global u Organizacional con un click.
- Guardar con descripción opcional para documentar el modelo.
- Renombrar un modelo sin pasar por Guardar Como.
- Ver versiones con política log-scale automática.
- Ver y restaurar modelos archivados (manualmente o auto-archivados a los 90 días).
- Confiar en autosalvado cada 5 minutos con feedback visual del glifo.

EPICA-30 cierra al 100% (21/21 vivas). MVP-α avanza ~17 puntos porcentuales solo por L2 (depende de pesos por HU; estimado).
