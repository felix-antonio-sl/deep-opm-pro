/**
 * BibliotecaDock: panel acoplable bajo el árbol OPD (L3 ronda 20).
 *
 * Convive con árbol + canvas + inspector en desktop ≥ 900px. Aporta:
 * - Búsqueda persistente por nombre.
 * - Filtro tipo (radio: Todos / Objetos / Procesos).
 * - Filtro "Solo OPD activo" (checkbox).
 * - Lista plana con drag-to-canvas.
 *
 * El componente no persiste filtros: se reinician al desmontar (cierre del
 * dock). Decisión §9 del brief.
 *
 * SSOT: opm-iso-19450-es.md §"navegacion del modelo: lentes derivadas".
 * Refs: docs/instrucciones-lineas-dev/ronda20/linea-3-biblioteca-dockable.md.
 */
import { useMemo, useState } from "preact/hooks";
import type { Id, Modelo, TipoEntidad } from "../../modelo/tipos";
import { tokens } from "../tokens";
import {
  FILTROS_DEFAULT,
  filtrarEntidades,
  type FiltrosBiblioteca,
} from "./filtrosBiblioteca";
import { ListaBibliotecaCosas } from "./ListaBibliotecaCosas";

interface Props {
  modelo: Modelo;
  opdActivoId: Id;
  onCerrar: () => void;
  onNavegarOpd: (opdId: Id) => void;
}

export function BibliotecaDock({ modelo, opdActivoId, onCerrar, onNavegarOpd }: Props) {
  const [filtros, setFiltros] = useState<FiltrosBiblioteca>(FILTROS_DEFAULT);

  const items = useMemo(
    () => filtrarEntidades(modelo, opdActivoId, filtros),
    [modelo, opdActivoId, filtros],
  );

  // Modelo proyectado: solo entidades visibles tras filtros, para que la lista
  // dockable conserve apariciones/OPDs sin reimplementar el filtro por grupo.
  const modeloFiltrado = useMemo<Modelo>(() => {
    const idsVisibles = new Set(items.map((item) => item.entidad.id));
    const entidades = Object.fromEntries(
      Object.entries(modelo.entidades).filter(([id]) => idsVisibles.has(id)),
    );
    return { ...modelo, entidades };
  }, [items, modelo]);

  function fijarTipo(tipo: "todos" | TipoEntidad) {
    setFiltros((prev) => ({ ...prev, tipo }));
  }
  function toggleSoloOpdActivo() {
    setFiltros((prev) => ({ ...prev, soloOpdActivo: !prev.soloOpdActivo }));
  }
  function fijarQuery(query: string) {
    setFiltros((prev) => ({ ...prev, query }));
  }

  const totalContador = items.length === 1 ? "1 entidad" : `${items.length} entidades`;

  return (
    <section
      data-testid="biblioteca-dock"
      aria-label="Biblioteca de cosas (dock)"
      style={style.dock}
    >
      <header style={style.header}>
        <strong style={style.titulo}>Biblioteca</strong>
        <button
          type="button"
          data-testid="biblioteca-dock-cerrar"
          aria-label="Cerrar biblioteca dock"
          onClick={onCerrar}
          style={style.closeButton}
          title="Cerrar biblioteca"
        >
          x
        </button>
      </header>

      <div style={style.busqueda}>
        <input
          type="search"
          aria-label="Buscar en biblioteca"
          placeholder="Buscar..."
          value={filtros.query}
          onInput={(event) => fijarQuery((event.currentTarget as HTMLInputElement).value)}
          data-testid="biblioteca-dock-buscar"
          style={style.input}
        />
      </div>

      <div style={style.filtros} role="group" aria-label="Filtros de biblioteca">
        <ChipFiltro
          activo={filtros.tipo === "todos"}
          onClick={() => fijarTipo("todos")}
          testid="biblioteca-filtro-todos"
          rol="radio"
        >
          Todos
        </ChipFiltro>
        <ChipFiltro
          activo={filtros.tipo === "objeto"}
          onClick={() => fijarTipo("objeto")}
          testid="biblioteca-filtro-objetos"
          rol="radio"
        >
          Objetos
        </ChipFiltro>
        <ChipFiltro
          activo={filtros.tipo === "proceso"}
          onClick={() => fijarTipo("proceso")}
          testid="biblioteca-filtro-procesos"
          rol="radio"
        >
          Procesos
        </ChipFiltro>
        <ChipFiltro
          activo={filtros.soloOpdActivo}
          onClick={toggleSoloOpdActivo}
          testid="biblioteca-filtro-opd-activo"
          rol="checkbox"
        >
          Solo OPD activo
        </ChipFiltro>
      </div>

      <div style={style.lista}>
        {items.length === 0 ? (
          <p style={style.empty} data-testid="biblioteca-dock-empty">Sin resultados.</p>
        ) : (
          <ListaBibliotecaCosas
            modelo={modeloFiltrado}
            opdActivoId={opdActivoId}
            onNavegarOpd={onNavegarOpd}
          />
        )}
      </div>

      <footer style={style.footer}>
        <span style={style.contador} data-testid="biblioteca-dock-contador">{totalContador}</span>
      </footer>
    </section>
  );
}

interface ChipProps {
  activo: boolean;
  onClick: () => void;
  testid: string;
  rol: "radio" | "checkbox";
  children: preact.ComponentChildren;
}

function ChipFiltro({ activo, onClick, testid, rol, children }: ChipProps) {
  return (
    <button
      type="button"
      role={rol}
      aria-checked={activo}
      onClick={onClick}
      data-testid={testid}
      style={activo ? style.chipActivo : style.chip}
    >
      {children}
    </button>
  );
}

const style = {
  dock: {
    display: "grid",
    gridTemplateRows: "auto auto auto minmax(0, 1fr) auto",
    minHeight: 0,
    minWidth: 0,
    overflow: "hidden",
    background: tokens.colors.fondoChrome,
    borderTop: `1px solid ${tokens.colors.bordeIntermedio}`,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
    borderBottom: `1px solid ${tokens.colors.bordeChrome}`,
    color: tokens.colors.textoPrimario,
    fontSize: `${tokens.typography.sizes.lg}px`,
  },
  titulo: {
    fontWeight: tokens.typography.weights.semibold,
  },
  closeButton: {
    width: "26px",
    height: "26px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoElevado,
    cursor: "pointer",
    color: tokens.colors.textoControl,
  },
  busqueda: {
    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px ${tokens.spacing.xs}px`,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
    border: `1px solid ${tokens.colors.bordeInput}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoInput,
    color: tokens.colors.textoPrimario,
    fontSize: `${tokens.typography.sizes.md}px`,
  },
  filtros: {
    display: "flex",
    flexWrap: "wrap",
    gap: `${tokens.spacing.xs}px`,
    padding: `${tokens.spacing.xs}px ${tokens.spacing.md}px`,
  },
  chip: {
    padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.pill,
    background: tokens.colors.fondoElevado,
    color: tokens.colors.textoSecundario,
    fontSize: `${tokens.typography.sizes.xs}px`,
    fontWeight: tokens.typography.weights.medium,
    cursor: "pointer",
  },
  chipActivo: {
    padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
    border: `1px solid ${tokens.colors.acentoUi}`,
    borderRadius: tokens.radii.pill,
    background: tokens.colors.acentoUiSuave,
    color: tokens.colors.azulAccion,
    fontSize: `${tokens.typography.sizes.xs}px`,
    fontWeight: tokens.typography.weights.semibold,
    cursor: "pointer",
  },
  lista: {
    minHeight: 0,
    overflow: "auto",
    padding: `0 ${tokens.spacing.xs}px`,
  },
  empty: {
    margin: 0,
    padding: `${tokens.spacing.md}px ${tokens.spacing.md}px`,
    color: tokens.colors.textoDeshabilitado,
    fontSize: `${tokens.typography.sizes.sm}px`,
    textAlign: "center",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: `${tokens.spacing.xs}px ${tokens.spacing.md}px`,
    borderTop: `1px solid ${tokens.colors.bordeChrome}`,
    color: tokens.colors.textoTerciario,
    fontSize: `${tokens.typography.sizes.xs}px`,
  },
  contador: {
    fontVariantNumeric: "tabular-nums",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
