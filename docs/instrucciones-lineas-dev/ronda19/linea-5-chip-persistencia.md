# L5 — Chip de persistencia visible

## 1. Misión

Mostrar un **chip persistente** junto al título del modelo que comunique de forma inmediata el estado de almacenamiento: `Local`, `Importado`, `Fixture`, `No guardado`, `Guardado hace 2 min`, `Versión 3`. Hoy el header sólo dice `(No guardado)` o el nombre limpio; el operador no sabe si vive en local, importado o versionado sin abrir un modal.

**Slice mínimo entregable**:
1. Componente `<ChipPersistencia />` que lee del store: `modeloPersistidoId`, `dirty`, `cargadoDesde` (origen pestaña), `autosalvado.ultimo`, número de versiones del modelo persistido.
2. Renderiza chip con icono + label + tiempo desde último save:
   - `Local · v3 · guardado hace 2 min` (persistido, clean, con versiones)
   - `Local · v3 · cambios sin guardar` (persistido, dirty)
   - `Importado · sin guardar` (cargado de JSON, no persistido)
   - `Fixture · sin guardar` (cargado de fixture, no persistido)
   - `Nuevo · sin guardar` (recién creado)
3. Tooltip en el chip muestra detalle completo y acción `Guardar como`.
4. El chip no reemplaza exportar, descartar ni versionar: los referencia como estado/atajo contextual cuando existan y mantiene esas acciones en el cluster `Modelo` de ronda19 L1.
5. Chip se monta dentro del cluster `Modelo` de la toolbar (slot `data-slot="cluster-modelo"` que L1 expone).

**Pendientes explícitos fuera de slice**:
- No reemplazar el modal `Guardar como` ni el flujo de versiones.
- No persistir nuevas preferencias en localStorage.

## 2. HU base

| HU | Path | Aporte |
|---|---|---|
| HU-30.020 | `docs/historias-usuario-v2/EPICA-30-arbol-opd/HU-30-020-chip-persistencia-visible.md` (NUEVO; o reusar EPICA persistencia si existe) | Chip persistencia |
| HU-30.021 | (idem) | Tooltip y acción guardar |

## 3. Anclaje a evidencia

- SSOT: no aplica directamente; es UX puro.
- Corpus reusable:
  - `app/src/ui/toolbar/ToolbarBase.tsx` — header + título + autosalvado actual.
  - `app/src/store/runtime.ts` — campo `autosalvado: AutosalvadoEstado`.
  - `app/src/store/pestanas.ts` — `Pestana.cargadoDesde: "nuevo" | "importado" | "persistido"`.
  - `app/src/persistencia/local.ts` — listado de versiones por modelo.
- Estado actual: el título dice `nombre` y `(No guardado)` si dirty. No hay distinción visual entre fixture/import/local.

## 4. Archivos permitidos

```
app/src/ui/ChipPersistencia.tsx                      NUEVO
app/src/ui/ChipPersistencia.test.tsx                 NUEVO (Preact testing-library)
app/src/ui/toolbar/ToolbarBase.tsx                   EDIT aditivo (mount slot)
app/src/ui/toolbar/toolbarStyles.ts                  EDIT aditivo (chip styles)
app/src/ui/tokens.ts                                 EDIT aditivo (chip variantes)
app/e2e/01-carga-y-workspace.spec.ts                 EDIT aditivo
docs/historias-usuario-v2/EPICA-30-arbol-opd/HU-30-020-chip-persistencia-visible.md NUEVO
```

## 5. Restricciones de no-colisión

- **L1 expone slot `data-slot="cluster-modelo"`** en su nueva organización de toolbar. L5 monta el chip dentro de ese slot.
- **Si L1 todavía no merge**: L5 monta el chip junto al título existente con `style.chipBesideTitle`. Migración trivial cuando L1 cierre.
- No tocar dominio funcional ni store.

## 6. Slice mínimo shippeable

### `<ChipPersistencia />`

```tsx
export function ChipPersistencia() {
  const modeloPersistidoId = useOpmStore((s) => s.modeloPersistidoId);
  const dirty = useOpmStore((s) => s.dirty);
  const autosalvado = useOpmStore((s) => s.autosalvado);
  const pestanaActiva = useOpmStore((s) => s.pestanasAbiertas.find((p) => p.id === s.pestanaActivaId));
  const indice = useOpmStore((s) => s.indice);
  const abrirGuardarComo = useOpmStore((s) => s.abrirGuardarComo);

  const cargadoDesde = pestanaActiva?.cargadoDesde ?? "nuevo";
  const versiones = modeloPersistidoId
    ? indice.modelos.find((m) => m.id === modeloPersistidoId)?.versiones?.length ?? 0
    : 0;
  const tiempoSave = autosalvado.ultimo ? formatearTiempoRelativo(autosalvado.ultimo) : null;

  const variante = clasificarVariante({ modeloPersistidoId, dirty, cargadoDesde, versiones, tiempoSave });

  return (
    <button
      type="button"
      style={chipStyle(variante)}
      title={detallarChip(variante)}
      onClick={abrirGuardarComo}
      data-testid="chip-persistencia"
      data-variante={variante.tipo}
    >
      <span style={style.chipIcon}>{iconoPorVariante(variante.tipo)}</span>
      <span style={style.chipLabel}>{labelChip(variante)}</span>
    </button>
  );
}
```

### Variantes

| `variante.tipo` | Cuándo | Color base |
|---|---|---|
| `local-clean` | persistido, clean | `tokens.colors.exitoFondo` |
| `local-dirty` | persistido, dirty | `tokens.colors.advertenciaFondo` |
| `importado` | `cargadoDesde === "importado"`, no persistido | `tokens.colors.azulPanelSuave` |
| `fixture` | `cargadoDesde === "fixture"` (si existe; sino derivar) | `tokens.colors.fondoCard` |
| `nuevo` | `cargadoDesde === "nuevo"` y modelo vacío | `tokens.colors.fondoNeutral` |

### Tooltip

```
Local · v3 · guardado hace 2 min
─
Modelo: Cafetera Domestica
Origen: cargado desde dialogo (modelo-abc123)
Cambios pendientes: no
Click para "Guardar como" o nuevo versión
```

## 7. Tests obligatorios

- Unit (~8 tests nuevos):
  - `clasificarVariante` para cada combinación.
  - `formatearTiempoRelativo` para deltas <1min, 1-60min, 1-24h, >24h.
  - `<ChipPersistencia />` renderiza la variante correcta para distintos store states (preact-testing-library).
- Smoke (~1 test nuevo):
  - `chip persistencia muestra "Importado · sin guardar" tras importar JSON, y "Local · v1 · clean" tras guardar`.
  - `chip persistencia conserva comprensión tras exportar/descartar`: exportar no cambia dirty; descartar vuelve al estado persistido o fixture correspondiente.

## 8. Verificación

```bash
cd app
bun run check
bun run lint
bun run browser:smoke
bun run build
```

Audit visual:
- Cargar fixture: chip dice "Fixture · sin guardar".
- Importar JSON: chip dice "Importado · sin guardar".
- Guardar como: chip cambia a "Local · v1 · guardado hace 0s".
- Editar y esperar autosalvado: chip cambia a "Local · v1 · guardado hace 2s".
- Exportar: chip no cambia indebidamente a local/clean.
- Descartar cambios: chip vuelve a `Local · vN · guardado...` o `Fixture/Importado · sin guardar`, según origen.
- Cumplir criterio §P2 informe UX: ver estado de almacenamiento sin abrir modal.

## 9. Decisiones bloqueadas (no reabrir)

- **El chip click abre `Guardar como`**, no el catalogo. Acción primaria coherente con la intención.
- **No persistir preferencias del chip** (siempre visible, no se oculta).
- **Tiempo relativo usa locale es-CL**: `hace X min`, no `Xm ago`.

## 10. Decisiones que tomas vos (documentar en commit)

- Iconos exactos por variante (recomendado: SVG inline simple, no emoji).
- Si el chip muestra hashtag de versión (`v3`) o solo conteo (`3 versiones`).
- Si en mobile el chip se reduce a solo icono con tooltip (recomendado: sí).

## 11. Forma del entregable

- Commit 1: `feat(ui): chip de persistencia visible en toolbar`.
- Commit 2: `test(e2e): chip persistencia refleja estado fixture/importado/local`.
- Co-author footer estándar.
- No tocar HANDOFF.md ni store.
