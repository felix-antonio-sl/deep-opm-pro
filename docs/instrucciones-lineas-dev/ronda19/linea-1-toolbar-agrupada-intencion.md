# L1 — Toolbar agrupada por intención

## 1. Misión

Reorganizar la toolbar superior en **clusters por intención**: `Modelo / Modelar / Conectar / Vista / Validar / Ayuda`. Hoy mezcla creación, conexión, vista, archivo, debug y apariencia en una sola hilera. La meta es que un modelador OPM perciba en menos de 1 segundo qué acción cambia el modelo, qué cambia la vista y qué es administración.

**Slice mínimo entregable**: la toolbar superior renderiza 6 clusters visuales con divider entre cada uno, label oculto pero accesible por aria-group, y los items existentes redistribuidos a su cluster semántico sin cambiar comportamiento ni perder testIds.

**Pendientes explícitos fuera de slice**:
- No reemaquetar el menú principal lateral (eso es ronda 20+ si se decide).
- No cambiar el contenido del menú `⋯ Más`. Solo preservar consistencia con la nueva estructura de clusters.
- No tocar dominio funcional (modelo, store, canvas).

## 2. HU base

| HU | Path | Aporte |
|---|---|---|
| HU-90.001 | `docs/historias-usuario-v2/EPICA-90-toolbar-y-shortcuts/HU-90-001-toolbar-clusters-por-intencion.md` (crear si no existe; si existe, reutilizar) | Define agrupación y orden de clusters |
| HU-90.002 | (idem epic) | Define dividers y aria-group |

Si la HU no existe en backlog, declararla en el commit como nueva y referenciarla por path canónico.

## 3. Anclaje a evidencia

- SSOT: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/metodologia-opm-es.md` §"interfaz: significado vs vista".
- Corpus reusable: `opm-extracted/INDEX.md` clases `ToolbarComponent`, `ElementToolBarComponent` (revisar `opm-extracted/src/main/.../element-tool-bar/` para ver cómo OPCloud agrupa). Patrones de cluster ya implementados en ronda 18 P3 (cluster Crear/Historia/Modelo/Enlace/Vista de cluster actual).
- Evidencia visual canónica: `assets/png/` toolbar OPCloud, `docs/audits/opm-app-ux-2026-05-07/screenshots/18-toolbar-baseline-onstar-panels.png`, `19-main-menu-open.png`, `20-more-actions-open.png`.
- Estado actual: `app/src/ui/Toolbar.tsx` orquesta; `ToolbarBase.tsx` (~470 LOC) tiene el chrome; `ToolbarCreacion.tsx` los controles de creación/enlace/vista; `ToolbarMas.tsx` el menú secundario.

## 4. Archivos permitidos

```
app/src/ui/Toolbar.tsx                EDIT aditivo
app/src/ui/toolbar/ToolbarBase.tsx    EDIT aditivo
app/src/ui/toolbar/ToolbarCreacion.tsx EDIT aditivo
app/src/ui/toolbar/ToolbarMas.tsx     EDIT aditivo
app/src/ui/toolbar/toolbarStyles.ts   EDIT aditivo (cluster styles)
app/src/ui/tokens.ts                  EDIT aditivo (espacios cluster si se necesita)
app/e2e/01-carga-y-workspace.spec.ts  LECTURA (verificar testids)
app/e2e/04-toolbar-y-creacion.spec.ts LECTURA
docs/historias-usuario-v2/EPICA-90-toolbar-y-shortcuts/HU-90-001-toolbar-clusters-por-intencion.md NUEVO
```

## 5. Restricciones de no-colisión

- **L2 lee**: `ToolbarCreacion.tsx` (cluster Conectar). L1 reorganiza el cluster Conectar pero NO cambia ids ni handlers de "Tipos válidos" / select de enlaces.
- **L5 aditivo paralelo**: L5 añade chip de persistencia al cluster Modelo. L1 deja el `style.actions` con un slot `data-slot="cluster-modelo"` para que L5 pueda añadir el chip sin tocar JSX de L1. Coordinación por anchor comment.

## 6. Slice mínimo shippeable

### Estructura de cluster

```tsx
// toolbarStyles.ts
export const toolbarStyle = {
  // ... existentes
  cluster: {
    display: "inline-flex",
    alignItems: "center",
    gap: tokens.spacing.xs,
    padding: `0 ${tokens.spacing.xs}px`,
  },
  clusterLabel: { /* sr-only */ },
};
```

### JSX nueva organización (ToolbarBase + ToolbarCreacion)

```tsx
// ToolbarBase orquesta los clusters principales
<div role="group" aria-label="Modelo" style={style.cluster} data-cluster="modelo">
  {/* ☰, título modelo, chip persistencia (slot), nuevo/abrir/importar/guardar/exportar/descartar/versiones */}
</div>
<span style={style.divider} />
<div role="group" aria-label="Modelar" style={style.cluster} data-cluster="modelar">
  {/* Crear Objeto, Crear Proceso, + Atributo */}
</div>
<span style={style.divider} />
<div role="group" aria-label="Conectar" style={style.cluster} data-cluster="conectar">
  <ToolbarCreacion /> {/* Solo el cluster Enlace + Tipos válidos + Biblioteca */}
</div>
<span style={style.divider} />
<div role="group" aria-label="Vista" style={style.cluster} data-cluster="vista">
  {/* Grid, Auto-layout, Configurar grid */}
</div>
<span style={style.divider} />
<div role="group" aria-label="Validar" style={style.cluster} data-cluster="validar">
  {/* Issues badge si > 0; Mapa toggle */}
</div>
<span style={style.divider} />
<div role="group" aria-label="Ayuda" style={style.cluster} data-cluster="ayuda">
  <ToolbarMas /> {/* Más acciones; cheatsheet, etc. */}
</div>
```

`ToolbarCreacion` se reduce a renderizar **solo el cluster Conectar** (selectors + Tipos válidos + Biblioteca + Cancelar). Los controles de Vista que actualmente vive en `ToolbarCreacion` (Grid, Config Grid, Auto-layout) se mueven al cluster Vista en ToolbarBase, **conservando todos los testids**.

### Movimiento de controles (testids preservados)

| Control | Cluster origen | Cluster destino | testid preservado |
|---|---|---|---|
| `toggle-grid` | banda intermedia | Vista | sí |
| `config-grid` | banda intermedia | Vista | sí |
| `toolbar-aplicar-layout` | banda intermedia | Vista | sí |
| `abrir-biblioteca-cosa` | banda intermedia | Conectar | sí |
| `abrir-menu-tipo-enlace` | banda intermedia | Conectar | sí |
| Tipo de enlace `<select>` | banda intermedia | Conectar | sí |
| Guardar / Guardar como | menú o banda actual | Modelo | sí |
| Importar / Exportar | menú o banda actual | Modelo | sí |
| Descartar cambios / Nuevo modelo | menú principal o secundario | Modelo | sí |
| Versiones guardadas | junto al título actual | Modelo | sí |

El cluster `Modelo` debe dejar claro el contrato de administración del informe: guardar, importar, exportar, descartar y versionar no son acciones de modelado semántico ni de vista; viven juntas y con labels accesibles únicos.

## 7. Tests obligatorios

- Unit (~5 tests nuevos):
  - `toolbarStyles.cluster` exports correctamente.
  - `ToolbarBase` renderiza los 6 grupos con `aria-label` correcto y `role="group"`.
- Smoke (~2 tests nuevos):
  - Smoke 04 actualizado: localizadores que usaban `getByRole("button", { name: "Objeto" })` deben seguir funcionando con la nueva organización.
  - Smoke nuevo: cada cluster tiene `aria-label` correcto y al menos un control descubrible por `getByRole("group", { name: ... })`.

## 8. Verificación

```bash
cd app
bun run check                           # 977+ unit a no romper
bun run lint                            # clean
bun run browser:smoke                   # 149+ smoke a no romper
bun run build                           # < 320 KB
```

Audit visual: `test-vivo-iterativo-opmkv` con criterios:
- 6 clusters visualmente distinguibles a 1280x720.
- Dividers visibles entre clusters.
- Cluster `Modelo` contiene o expone claramente guardar/importar/exportar/descartar/versiones, sin duplicar labels accesibles.
- Ningún testid existente roto.
- Comparación lado a lado con `18-toolbar-baseline-onstar-panels.png`.

## 9. Decisiones bloqueadas (no reabrir)

- **No remover `Crear varios *`** del cluster Modelar aunque sea redundante con menú Más; espejo deliberado por compatibilidad smokes (regla 5.5 ronda 18).
- **No cambiar el orden Modelo/Modelar/Conectar/Vista/Validar/Ayuda**: refleja flujo principal del informe.
- **Aria-label en español es-CL** (no en inglés). Coherencia con resto del repo.

## 10. Decisiones que tomas vos (documentar en commit)

- Estilo del divider entre clusters (línea simple vs gap mayor).
- Ubicación exacta del cluster Validar (sólo cuando hay issues, o siempre con badge `0`).
- Si el cluster Ayuda lleva texto "Ayuda" o solo el botón ⋯ Más.

## 11. Forma del entregable

- Commit 1: `style(toolbar): introduce cluster por intencion con role=group y aria-label` — refactor JSX + estilos.
- Commit 2: `test(e2e): smoke verifica clusters Modelo/Modelar/Conectar/Vista/Validar/Ayuda` — smoke nuevo + ajuste de smokes existentes si aplica.
- Co-author: `Co-Authored-By: <agente>` según corresponda.
- No tocar HANDOFF.md ni HU base.
