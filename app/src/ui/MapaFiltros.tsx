// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import type { Id } from "../modelo/tipos";
import type { CriterioResaltado, DescriptorMapa } from "../canvas/mapaSistema";
import { tokens } from "./tokens";

interface Props {
  descriptor: DescriptorMapa;
  profundidadMaxima: number;
  profundidad: number | null;
  subarbolRaizId: Id | null;
  criterio: CriterioResaltado;
  onProfundidad: (valor: number | null) => void;
  onSubarbol: (valor: Id | null) => void;
  onCriterio: (valor: CriterioResaltado) => void;
  onLimpiar: () => void;
  onCerrar: () => void;
}

export function MapaFiltros({
  descriptor,
  profundidadMaxima,
  profundidad,
  subarbolRaizId,
  criterio,
  onProfundidad,
  onSubarbol,
  onCriterio,
  onLimpiar,
  onCerrar,
}: Props) {
  const limite = Math.max(1, profundidadMaxima);

  return (
    <aside style={style.panel} aria-label="Filtros del mapa" data-testid="mapa-filtros">
      <header style={style.header}>
        <h2 style={style.title}>Filtros</h2>
        <button type="button" style={style.iconButton} onClick={onCerrar} aria-label="Cerrar filtros">×</button>
      </header>
      <div style={style.body}>
        <label style={style.field}>
          <span style={style.label}>Profundidad</span>
          <div style={style.inline}>
            <input
              type="checkbox"
              checked={profundidad === null}
              onChange={(event) => onProfundidad(event.currentTarget.checked ? null : limite)}
            />
            <span style={style.help}>Sin límite</span>
          </div>
          <input
            type="range"
            min={1}
            max={limite}
            value={profundidad ?? limite}
            disabled={profundidad === null}
            onInput={(event) => onProfundidad(Number(event.currentTarget.value))}
            style={style.slider}
          />
          <span style={style.value}>{profundidad === null ? "Sin límite" : `Nivel ${profundidad}`}</span>
        </label>

        <label style={style.field}>
          <span style={style.label}>Subárbol</span>
          <select
            value={subarbolRaizId ?? ""}
            onChange={(event) => onSubarbol(event.currentTarget.value || null)}
            style={style.select}
          >
            <option value="">Árbol completo</option>
            {descriptor.nodos.map((nodo) => (
              <option key={nodo.opdId} value={nodo.opdId}>
                {nodo.nombre}
              </option>
            ))}
          </select>
        </label>

        <label style={style.field}>
          <span style={style.label}>Resaltado</span>
          <select
            value={criterio}
            onChange={(event) => onCriterio(event.currentTarget.value as CriterioResaltado)}
            style={style.select}
          >
            <option value="ninguno">Sin resaltado</option>
            <option value="predominanciaProceso">Predominancia procesos</option>
            <option value="predominanciaObjeto">Predominancia objetos</option>
            <option value="tieneEstados">Tiene estados</option>
            <option value="raiz">Raíz</option>
          </select>
        </label>

        <button type="button" style={style.button} onClick={onLimpiar}>
          Limpiar filtros
        </button>
      </div>
    </aside>
  );
}

const style = {
  panel: {
    minWidth: "240px",
    maxWidth: "280px",
    borderRight: `1px solid ${tokens.colors.bordeIntermedio}`,
    background: tokens.colors.fondoChrome,
    overflow: "auto",
  },
  header: {
    height: "42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 10px",
    borderBottom: `1px solid ${tokens.colors.bordeChrome}`,
  },
  title: {
    margin: 0,
    color: tokens.colors.textoPrimario,
    fontSize: "13px",
    fontWeight: 700,
  },
  iconButton: {
    width: "28px",
    height: "28px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoChrome,
    color: tokens.colors.textoSecundario,
    cursor: "pointer",
    fontSize: "18px",
    lineHeight: 1,
  },
  body: {
    display: "grid",
    gap: "14px",
    padding: "12px",
  },
  field: {
    display: "grid",
    gap: "6px",
  },
  label: {
    color: tokens.colors.textoControl,
    fontSize: "12px",
    fontWeight: 700,
  },
  inline: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  help: {
    color: tokens.colors.textoTerciario,
    fontSize: "12px",
    fontWeight: 600,
  },
  value: {
    color: tokens.colors.textoTerciario,
    fontSize: "12px",
    fontWeight: 600,
  },
  slider: {
    width: "100%",
  },
  select: {
    width: "100%",
    height: "32px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoChrome,
    color: tokens.colors.textoPrimario,
    fontSize: "12px",
  },
  button: {
    height: "32px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoCard,
    color: tokens.colors.textoPrimario,
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 700,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
