# Linea 2 — Workspace local y dialogos de archivo

## 1. Mision

Convertir la persistencia local existente en un flujo de workspace usable: menu principal tipo hamburguesa, primer Guardar como, dialogo de nombre, breadcrumb local minimo, carga desde dialogo y nuevo modelo vacio formal con estado visible "Modelo (No guardado)".

**Slice minimo entregable**: menu principal en toolbar, dialogo "Guardar como", dialogo "Cargar modelo", guardar incremental con toast existente, guardar como sobre persistido con nombre precargado, nuevo modelo vacio con SD unico, canvas/OPL/biblioteca vacios y pruebas de store + smoke.

**Fuera de slice**: backend, carpetas reales remotas, Firebase, versionado log-scale, archivado, busqueda global, ejemplos organizacionales, asistente de 12 etapas y multiples pestanas simultaneas.

## 2. HU base

| HU | Path absoluto | Aporte |
|---|---|---|
| HU-30.001 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-30-persistencia-save-load.md` | Menu principal hamburguesa con acciones de archivo. |
| HU-30.005 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-30-persistencia-save-load.md` | Primer Guardar abre "Guardar como". |
| HU-30.006 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-30-persistencia-save-load.md` | Nombre del modelo en dialogo. |
| HU-30.009 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-30-persistencia-save-load.md` | Breadcrumb en dialogo modal. |
| HU-30.010 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-30-persistencia-save-load.md` | Boton atras/flecha en dialogo. |
| HU-30.013 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-30-persistencia-save-load.md` | Guardado incremental con confirmacion. |
| HU-30.015 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-30-persistencia-save-load.md` | Guardar como sobre modelo persistido. |
| HU-30.018 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-30-persistencia-save-load.md` | Dialogo "Cargar Modelo". |
| HU-34.001 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-34-persistencia-nuevo-modelo.md` | Activar nuevo modelo desde menu. |
| HU-34.004-HU-34.008 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-34-persistencia-nuevo-modelo.md` | Estado inicial: tab/titulo, SD unico, canvas vacio, OPL vacio, biblioteca vacia. |

## 3. Anclaje a evidencia

- **SSOT**: `opm-iso-19450-es.md` §OPD tree fija raiz `SD`; `metodologia-opm-es.md` §6 parte desde un SD inicial; `opm-opl-es.md` §10 exige que las referencias visibles a OPD (`SD`, `SD1`) mapeen a IDs persistentes.
- **Corpus interno reusable**:
  - `opm-extracted/MODULES.md` lista `src/app/dialogs/load-model-dialog/load-model-dialog.component.ts`, `name-validator.ts`, `InputNameDialogComponent`, `SaveURLComponent` y `treeParser.ts`.
  - `opm-extracted/INDEX.md` mapea `LoadModelDialogComponent`, `InputNameDialogComponent`, `SaveURLComponent`, `DeleteModelDialogComponent` y `TreeParser`.
  - `assets/svg/folder.svg`, `assets/svg/regFile.svg`, `assets/svg/sharedFolder.svg`, `assets/svg/autosave.svg` y `assets/svg/toolbar/modelWizard.svg` son assets canonicos disponibles.
- **Estado actual del codigo**:
  - `app/src/persistencia/local.ts` ya guarda/lista/carga/borra modelos en `localStorage` con `ResumenModeloPersistido`.
  - `app/src/store.ts` ya tiene `guardarLocal`, `cargarLocal`, `nuevoModelo`, `modeloPersistidoId`, `dirty`, `snapshotGuardado` y mensaje "Modelo guardado exitosamente".
  - `app/src/ui/Toolbar.tsx` expone botones sueltos "Nuevo", "Guardar", "Cargar"; no existe menu principal ni dialogo Guardar como.
  - `app/src/ui/PersistenciaJson.tsx` existe como import/export JSON tecnico, no como workspace de usuario.

## 4. Archivos permitidos

```text
app/src/persistencia/local.ts             EDIT aditivo
app/src/persistencia/workspace.ts         NUEVO
app/src/persistencia/local.test.ts        EDIT aditivo
app/src/store.ts                          EDIT aditivo
app/src/store.test.ts                     EDIT aditivo
app/src/ui/App.tsx                        EDIT aditivo
app/src/ui/Toolbar.tsx                    EDIT aditivo
app/src/ui/MenuPrincipal.tsx              NUEVO
app/src/ui/DialogoGuardarComo.tsx         NUEVO
app/src/ui/DialogoCargarModelo.tsx        NUEVO
app/src/ui/Dialogo.tsx                    LECTURA o EDIT aditivo si falta API reusable
app/src/ui/ConfirmacionContext.tsx        LECTURA
app/src/ui/PanelOpl.tsx                   LECTURA
app/src/ui/ArbolOpd.tsx                   LECTURA
app/e2e/opm-smoke.spec.ts                 EDIT aditivo
assets/svg/folder.svg                     LECTURA
assets/svg/regFile.svg                    LECTURA
assets/svg/sharedFolder.svg               LECTURA
assets/svg/autosave.svg                   LECTURA
assets/svg/toolbar/modelWizard.svg        LECTURA
opm-extracted/**                          LECTURA
/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/** LECTURA
```

## 5. Restricciones de no-colision

- No tocar `PanelOpl.tsx` salvo lectura; L1 posee OPL interactivo.
- No tocar `ArbolOpd.tsx` salvo lectura; L3 posee acciones del arbol.
- No cambiar formato `deep-opm-pro.modelo.v0` salvo necesidad documentada y tests de compatibilidad.
- No crear carpetas remotas ni prometer sincronizacion; el breadcrumb puede ser local/sintetico (`Inicio / Modelos locales`) si no hay jerarquia real.
- No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`.

## 6. Slice minimo shippeable

### Modelo

Mantener `Modelo` como fuente de verdad. Si hace falta metadata UI, crear tipo fuera del kernel:

```ts
export interface WorkspaceModeloLocal {
  id: Id | null;
  nombre: string;
  descripcion: string;
  carpetaId: "local";
}
```

### Operaciones

Agregar acciones store:

```ts
abrirMenuPrincipal(): void;
cerrarMenuPrincipal(): void;
abrirGuardarComo(): void;
guardarComoLocal(input: { nombre: string; descripcion?: string }): void;
abrirCargarModelo(): void;
cargarLocalDesdeDialogo(id: Id): void;
```

`guardarLocal()` debe hacer:

- si `modeloPersistidoId === null`, abrir Guardar como;
- si existe ID, guardar incremental con el nombre actual y mensaje de exito.

### Serializacion

Sin cambios de formato salvo preservar descripcion en `ModeloPersistido`. Si se agrega descripcion al indice local, mantener default `""` para documentos viejos.

### Render

Sin cambios JointJS.

### OPL

Verificar que nuevo modelo vacio deja `generarOpl(...)` sin lineas y `PanelOpl` muestra placeholder. No cambiar texto en esta linea.

### UX

- Menu principal con acciones: Nuevo, Guardar, Guardar como, Cargar, Exportar JSON (si se conserva), Demo.
- Dialogo "Guardar como": nombre requerido, descripcion opcional, breadcrumb local, boton atras deshabilitado o funcional a `Inicio`.
- Dialogo "Cargar modelo": lista modelos locales, doble clic carga, boton Cargar carga seleccionado, Cancelar/ESC cierra.
- Nuevo modelo desde menu pasa por confirmacion dirty existente y produce "Modelo (No guardado)", SD unico, canvas vacio y OPL vacio.

### Cross-capa

`Toolbar` debe conservar atajo Ctrl+S, pero ahora respeta primer Guardar como. `PersistenciaJson` no debe convertirse en flujo principal si no cabe; puede quedar como herramienta tecnica.

## 7. Tests obligatorios

- Persistencia local: guarda descripcion y mantiene compatibilidad con entradas sin descripcion.
- Store: primer `guardarLocal()` sin `modeloPersistidoId` no persiste silenciosamente; abre estado de Guardar como.
- Store: `guardarComoLocal` setea `modeloPersistidoId`, limpia dirty y actualiza `modelo.nombre`.
- Store: `nuevoModelo` deja `modelo.opdRaizId`, un unico OPD `SD`, cero apariencias y cero lineas OPL.
- UI component/smoke: menu abre, Guardar como permite nombrar, Cargar muestra modelos locales, doble clic o boton carga.
- Smoke: Ctrl+S en modelo nuevo abre Guardar como; segundo Ctrl+S guarda incremental.

## 8. Verificacion

```bash
cd app
bun run check
bun run browser:smoke
bun run build
```

## 9. Decisiones bloqueadas (no reabrir)

- Persistencia de esta ronda es local browser/localStorage; no backend.
- Raiz inicial se llama `SD`.
- No implementar multiples pestanas en esta linea.
- No reusar Angular de OPCloud; solo observar UX y assets.

## 10. Decisiones que tomas vos (documentar en commit)

- Si el menu principal es popover propio o panel modal pequeno; debe ser testeable.
- Como modelar el breadcrumb local sin jerarquia real.
- Si "Guardar como" actualiza `modelo.nombre` antes o despues de persistir; documentar.
- Si `PersistenciaJson` se oculta del flujo principal o queda accesible desde menu como accion avanzada.

## 11. Forma del entregable

Commits sugeridos:

- `feat(persistencia): agrega workspace local con guardar como`
- `feat(ui): incorpora menu principal y dialogos de archivo`
- `test(persistencia): cubre nuevo modelo guardar y cargar`

No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`. Reportar comandos ejecutados, tests agregados, decisiones tomadas y bloqueos.
