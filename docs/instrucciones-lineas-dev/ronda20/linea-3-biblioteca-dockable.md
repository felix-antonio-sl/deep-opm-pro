# L3 — Biblioteca dockable junto al árbol OPD con búsqueda y filtros

## 1. Misión

Sacar la biblioteca de su rol de **overlay temporal sobre canvas** y darle un rol de **panel persistente acoplable**. Hoy `<BibliotecaCosa />` se monta como `<aside>` con `position: fixed` que tapa el canvas; aporta info útil pero compite con el trabajo principal y no permite mantener contexto. El informe línea 159: "abrir la biblioteca no debe tapar el area central del modelo salvo en mobile. Debe poder quedar visible mientras se navega el canvas."

**Slice mínimo entregable**:

1. Nuevo modo de presentación de la biblioteca: **dock** acoplado al borde derecho del pane del árbol OPD (mismo lado que tree-pane), debajo del árbol, en una franja horizontal o stacking vertical según viewport.
2. La biblioteca dock convive con el árbol OPD: el usuario puede ver árbol + biblioteca + canvas a la vez en desktop.
3. Toggle en toolbar (cluster Vista de ronda 19) o atajo `Ctrl+B` abre/cierra el dock.
4. Cuando el dock está abierto en desktop, el overlay actual queda **deshabilitado** (no se puede abrir en simultáneo con el dock).
5. **Búsqueda persistente**: input de texto que filtra entidades por nombre en tiempo real.
6. **Filtros por tipo**: chips toggleables `Todos / Objetos / Procesos`.
7. **Filtros por OPD**: chip toggleable `Solo en OPD activo` que limita el listado a entidades con apariencia en `opdActivoId`.
8. **Acciones por item**: `Centrar en canvas` (si tiene apariencia en OPD activo), `Abrir SD del refinamiento` (si la entidad refina otro OPD), `Mostrar apariciones` (selecciona en Inspector tab Apariciones).
9. En mobile/tablet (viewport < 900px) se mantiene el comportamiento overlay actual; el dock no se muestra. Esta línea no implementa el modo Revisar mobile (eso es ronda 21 L2).

**Pendientes explícitos fuera de slice**:

- No tocar la lógica de drag desde la biblioteca al canvas (ya funciona).
- No agregar acciones de creación desde la biblioteca (la biblioteca lista, no crea).
- No fusionar biblioteca con árbol OPD en un único panel; son lentes ortogonales (estructura jerárquica vs catálogo plano).
- No persistir filtros en localStorage; persisten solo por sesión.

## 2. HU base

| HU | Path | Aporte |
|---|---|---|
| HU-19.030 (NUEVO) | `docs/historias-usuario-v2/epicas/epica-19-canvas-imagenes.md` (la EPICA-19 cubre biblioteca de cosas) | Biblioteca como dock persistente |
| HU-19.031 (NUEVO) | (idem epic) | Búsqueda persistente |
| HU-19.032 (NUEVO) | (idem epic) | Filtros por tipo y OPD activo |
| HU-19.033 (NUEVO) | (idem epic) | Acción "Centrar en canvas" |
| HU-20.030 (NUEVO) | `docs/historias-usuario-v2/epicas/epica-20-estructura-arbol-opd.md` | Layout dual árbol + biblioteca |
| HU-20.031 (NUEVO) | (idem epic) | Toggle teclado para biblioteca dock |

## 3. Anclaje a evidencia

- SSOT: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/metodologia-opm-es.md` §"navegacion del modelo: lentes derivadas".
- Corpus reusable:
  - `app/src/ui/BibliotecaCosa.tsx` (~151 LOC) — overlay actual; lectura completa antes de extender.
  - `app/src/ui/ArbolOpd.tsx` — para entender el layout del tree-pane.
  - `app/src/ui/App.tsx` — `treePane`, `divisor`, `canvasPane`, `inspectorPane` — entender el grid actual.
  - `app/src/ui/divisorPanel.tsx` — divisor reutilizable.
  - `app/src/store/uiPanel.ts` — slice donde añadir `bibliotecaDockAbierto`.
  - `opm-extracted/INDEX.md` clases `LibraryComponent`, `OpdNavigationComponent`. Revisar cómo OPCloud presenta la library cuando coexiste con el tree.
  - Evidencia visual: `docs/audits/opm-app-ux-2026-05-07/screenshots/24-library-open.png`, `57-ronda3-library-large-model.png`.
- Estado actual: el overlay se abre con `bibliotecaCosaAbierta` (existente en uiPanel) y se cierra con click fuera o testid `cerrar-biblioteca`.

## 4. Archivos permitidos

```
app/src/ui/BibliotecaCosa.tsx                                EDIT aditivo (preserva el modo overlay; agrega prop modoDock)
app/src/ui/biblioteca/BibliotecaDock.tsx                     NUEVO (wrapper dock)
app/src/ui/biblioteca/BibliotecaDock.test.tsx                NUEVO
app/src/ui/biblioteca/filtrosBiblioteca.ts                   NUEVO (helper puro)
app/src/ui/biblioteca/filtrosBiblioteca.test.ts              NUEVO
app/src/ui/App.tsx                                           EDIT aditivo (mount BibliotecaDock cuando dock abierto y desktop)
app/src/store/uiPanel.ts                                     EDIT aditivo (bibliotecaDockAbierto + acciones)
app/src/store/sliceTypes.ts                                  EDIT aditivo (campo + acciones)
app/src/store/modelo/acciones-ui.ts                          EDIT aditivo (toggleBibliotecaDock, abrirBibliotecaDock, cerrarBibliotecaDock)
app/src/ui/atajosTeclado.ts                                  EDIT aditivo (Ctrl+B → toggle)
app/src/ui/tokens.ts                                         EDIT aditivo (dock styling)
app/src/ui/Toolbar.tsx o app/src/ui/toolbar/ToolbarBase.tsx  EDIT aditivo (botón toggle dock; preserva testid)
app/e2e/04-arbol-y-pestanas.spec.ts                          LECTURA o EDIT aditivo
app/e2e/20-biblioteca-dock.spec.ts (NUEVO)                   NUEVO
docs/historias-usuario-v2/...                                NO TOCAR
```

## 5. Restricciones de no-colisión

- **L1 inspector tabs**: ortogonal. Cero colisión.
- **L4 estados con nombres**: ortogonal. Cero colisión.
- **L2 OPL editor**: si la biblioteca dock añade `Ctrl+B`, verificar que ese atajo no choca con shortcuts existentes (`Ctrl+B` no parece estar tomado en `atajosTeclado.ts`; verificar al inicio de la línea).
- **Ronda 19 L1 toolbar**: si ronda 19 ya cerró, esta línea agrega el toggle al cluster Vista de la toolbar agrupada; si no, agrega un botón en la posición actual (`abrir-biblioteca-cosa`). El testid `abrir-biblioteca-cosa` se preserva intacto en cualquier caso.
- **No tocar `App.tsx` workbench grid template** más allá de añadir `BibliotecaDock` como sibling del tree-pane. La estructura `tree | divisor | canvas | inspector | (opl)` se preserva. La biblioteca dock se monta como overlay del tree-pane (parte inferior del tree-pane vía flex-column en treePane).

## 6. Slice mínimo shippeable

### `biblioteca/filtrosBiblioteca.ts` (puro)

```ts
import type { Entidad, Modelo, TipoEntidad, Id } from "../../modelo/tipos";

export interface FiltrosBiblioteca {
  query: string;
  tipo: "todos" | TipoEntidad;
  soloOpdActivo: boolean;
}

export interface ItemBiblioteca {
  entidad: Entidad;
  apareceEnOpdActivo: boolean;
  totalApariciones: number;
}

export function filtrarEntidades(
  modelo: Modelo,
  opdActivoId: Id,
  filtros: FiltrosBiblioteca,
): ItemBiblioteca[] {
  // 1. Recolectar entidades del modelo.
  // 2. Aplicar filtro tipo (si !== "todos").
  // 3. Calcular apariciones por OPD para cada entidad.
  // 4. Aplicar filtro soloOpdActivo (si activo, descarta entidades sin apariencia en opdActivoId).
  // 5. Filtrar por query (case-insensitive, locale es-CL, match en nombre).
  // 6. Ordenar por nombre (locale es-CL).
  // 7. Devolver lista de ItemBiblioteca.
}

export const FILTROS_DEFAULT: FiltrosBiblioteca = {
  query: "",
  tipo: "todos",
  soloOpdActivo: false,
};
```

### `biblioteca/BibliotecaDock.tsx`

```tsx
interface Props {
  modelo: Modelo;
  opdActivoId: Id;
  onCerrar: () => void;
  onCentrarEnCanvas: (aparienciaId: Id) => void;
  onAbrirSdRefinamiento: (entidadId: Id) => void;
  onMostrarApariciones: (entidadId: Id) => void;
}

export function BibliotecaDock(props: Props) {
  const [filtros, setFiltros] = useState<FiltrosBiblioteca>(FILTROS_DEFAULT);
  const items = useMemo(
    () => filtrarEntidades(props.modelo, props.opdActivoId, filtros),
    [props.modelo, props.opdActivoId, filtros],
  );

  return (
    <aside style={style.dock} data-testid="biblioteca-dock" aria-label="Biblioteca de cosas (dock)">
      <header style={style.header}>
        <h3 style={style.titulo}>Biblioteca</h3>
        <button type="button" onClick={props.onCerrar} aria-label="Cerrar biblioteca dock" data-testid="biblioteca-dock-cerrar" style={style.cerrar}>×</button>
      </header>

      <div style={style.busqueda}>
        <input
          type="search"
          aria-label="Buscar en biblioteca"
          placeholder="Buscar..."
          value={filtros.query}
          onInput={(e) => setFiltros((f) => ({ ...f, query: e.currentTarget.value }))}
          data-testid="biblioteca-dock-buscar"
          style={style.input}
        />
      </div>

      <div style={style.filtros} role="group" aria-label="Filtros de biblioteca">
        <ChipFiltro
          activo={filtros.tipo === "todos"}
          onClick={() => setFiltros((f) => ({ ...f, tipo: "todos" }))}
          testid="biblioteca-filtro-todos"
        >
          Todos
        </ChipFiltro>
        <ChipFiltro
          activo={filtros.tipo === "objeto"}
          onClick={() => setFiltros((f) => ({ ...f, tipo: "objeto" }))}
          testid="biblioteca-filtro-objetos"
        >
          Objetos
        </ChipFiltro>
        <ChipFiltro
          activo={filtros.tipo === "proceso"}
          onClick={() => setFiltros((f) => ({ ...f, tipo: "proceso" }))}
          testid="biblioteca-filtro-procesos"
        >
          Procesos
        </ChipFiltro>
        <ChipFiltro
          activo={filtros.soloOpdActivo}
          onClick={() => setFiltros((f) => ({ ...f, soloOpdActivo: !f.soloOpdActivo }))}
          testid="biblioteca-filtro-opd-activo"
        >
          Solo OPD activo
        </ChipFiltro>
      </div>

      <div style={style.lista}>
        {items.length === 0 ? <p style={style.empty}>Sin resultados.</p> : null}
        {items.map((item) => <ItemBibliotecaDock key={item.entidad.id} item={item} {...props} />)}
      </div>

      <footer style={style.footer}>
        <span style={style.contador}>{items.length} {items.length === 1 ? "entidad" : "entidades"}</span>
      </footer>
    </aside>
  );
}
```

### Ubicación del dock dentro de `App.tsx`

El tree-pane actualmente ocupa `gridArea: "tree"` con altura completa de la fila workbench. Cambiar el `treePane` a un grid vertical:

```tsx
// app/src/ui/App.tsx
const treePaneEstilo = {
  ...layout.treePane,
  display: "grid",
  gridTemplateRows: bibliotecaDockAbierto ? "minmax(0, 1fr) 8px minmax(0, 1fr)" : "minmax(0, 1fr)",
};

<div data-testid="tree-pane" style={treePaneEstilo}>
  <ArbolOpd />
  {bibliotecaDockAbierto && esDesktop ? (
    <>
      <DivisorPanel orientacion="horizontal" altoInicial={300} onAltoChange={fijarAltoDockBiblioteca} />
      <BibliotecaDock {...props} />
    </>
  ) : null}
</div>
```

`esDesktop` se calcula con `window.innerWidth >= 900` y se actualiza con resize listener. **NO** persistir en store; basta state local + listener.

### `BibliotecaCosa.tsx` extension

Agregar prop opcional `modo?: "overlay" | "dock"` (default `"overlay"`). Cuando `modo === "dock"`, quitar el `position: fixed` y los offsets, dejar solo el contenido. Compatible con consumers existentes.

### Slice de store

```ts
// uiPanel.ts
bibliotecaDockAbierto: false,
toggleBibliotecaDock(): void {
  const abierto = !this.bibliotecaDockAbierto;
  // Si se abre el dock, cerrar el overlay para evitar duplicación.
  return { bibliotecaDockAbierto: abierto, bibliotecaCosaAbierta: false };
},
```

### Toggle en toolbar

Si ronda 19 L1 cerró: agregar botón al cluster Vista con icono `library.svg` y label "Biblioteca". Si ronda 19 L1 no cerró: agregar el botón en posición actual del overlay con icono nuevo y label "Biblioteca dock". El testid `abrir-biblioteca-cosa` queda apuntando al overlay; el dock usa `toggle-biblioteca-dock`.

## 7. Tests obligatorios

- Unit (~10 tests nuevos):
  - `filtrarEntidades` con filtros default → todas las entidades ordenadas alfabéticamente.
  - `filtrarEntidades` con `tipo="objeto"` → solo objetos.
  - `filtrarEntidades` con `query="motor"` → solo entidades con "motor" en nombre.
  - `filtrarEntidades` con `soloOpdActivo=true` → solo entidades con apariencia en OPD activo.
  - Combinación de los 3 filtros.
  - `<BibliotecaDock />` (preact-testing-library):
    - Renderiza header, búsqueda, 4 chips, lista, contador.
    - Click en chip "Objetos" cambia filtro.
    - Type en input search filtra.
- Smoke (~3 tests nuevos en `e2e/20-biblioteca-dock.spec.ts`):
  - `Ctrl+B` abre el dock; canvas sigue visible.
  - Search filtra items.
  - Click "Solo OPD activo" filtra.

## 8. Verificación

```bash
cd app
bun run check
bun run lint
bun run browser:smoke
bun run build
```

Audit visual con `test-vivo-iterativo-opmkv`:

- Cargar fixture App modeladora (8 OPDs).
- Abrir dock con `Ctrl+B`. Verificar criterio del informe línea 159: "Abrir la biblioteca no debe tapar el area central del modelo salvo en mobile. Debe poder quedar visible mientras se navega el canvas." → árbol + dock + canvas + inspector visibles a 1280x720.
- Filtrar por "motor", verificar items.
- Click "Solo OPD activo" con SD raíz seleccionado → solo entidades del SD.
- Comparar lado a lado con `24-library-open.png` (overlay) — el dock no debe taparlo.

## 9. Decisiones bloqueadas (no reabrir)

- **No reemplazar el overlay**. Coexisten: overlay (legacy) y dock (nuevo). El usuario puede preferir uno u otro.
- **Mobile sigue con overlay**. El dock es exclusivamente desktop ≥ 900px.
- **Filtros no persisten en localStorage**. Sesión only.
- **Atajo `Ctrl+B`** verificar que no choca con shortcuts existentes; si choca, usar `Ctrl+Shift+B`.

## 10. Decisiones que tomas vos (documentar en commit)

- Si el dock va arriba o abajo del árbol OPD (recomendado: abajo, con divisor horizontal redimensionable).
- Si los chips son toggles individuales o radio (recomendado: tipo es radio, soloOpdActivo es checkbox).
- Si el dock muestra contador "5 de 47" (sobre total) o "5 entidades" (filtradas) (recomendado: filtradas).
- Si el dock se abre por default tras la primera vez que se usa (recomendado: no, default cerrado).

## 11. Forma del entregable

- Commit 1: `feat(biblioteca): filtros puros (tipo + opd activo + query)` — `filtrosBiblioteca.ts` + tests.
- Commit 2: `feat(biblioteca): dock acoplable junto al arbol OPD` — `BibliotecaDock.tsx` + slice store + montaje.
- Commit 3: `feat(atajos): Ctrl+B toggle biblioteca dock` — atajo + toggle en toolbar.
- Commit 4: `test(e2e): biblioteca dock convive con canvas y filtra correctamente`.
- Co-author footer estándar.
- No tocar HANDOFF.md ni overlay legacy más allá de la prop `modo`.
