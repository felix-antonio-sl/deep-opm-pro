// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import type { EstadisticasModelo } from "../canvas/mapaSistema";
import { tokens } from "./tokens";

interface Props {
  estadisticas: EstadisticasModelo;
  onCerrar: () => void;
}

export function MapaPanelEstadisticas({ estadisticas, onCerrar }: Props) {
  return (
    <aside style={style.panel} aria-label="Estadísticas del modelo" data-testid="mapa-estadisticas">
      <header style={style.header}>
        <h2 style={style.title}>Estadísticas</h2>
        <button type="button" style={style.iconButton} onClick={onCerrar} aria-label="Cerrar estadísticas">×</button>
      </header>
      <dl style={style.grid}>
        <Fila label="Entidades" valor={estadisticas.totalEntidades} />
        <Fila label="Enlaces" valor={estadisticas.totalEnlaces} />
        <Fila label="OPDs" valor={estadisticas.totalOpds} />
        <Fila label="Profundidad máxima" valor={estadisticas.profundidadMaxima} />
        <Fila label="Ramas" valor={estadisticas.totalRamas} />
        <Fila label="Procesos" valor={estadisticas.porTipoCosa.proceso} />
        <Fila label="Objetos" valor={estadisticas.porTipoCosa.objeto} />
        <Fila label="Estados" valor={estadisticas.porTipoCosa.estados} />
        <Fila label="Estructurales" valor={estadisticas.porFamiliaEnlace.agregacion} />
        <Fila label="Procedurales" valor={estadisticas.porFamiliaEnlace.procedural} />
        <Fila label="Lógicos" valor={estadisticas.porFamiliaEnlace.logico} />
      </dl>
    </aside>
  );
}

function Fila({ label, valor }: { label: string; valor: number }) {
  return (
    <div style={style.row}>
      <dt style={style.label}>{label}</dt>
      <dd style={style.value}>{valor}</dd>
    </div>
  );
}

const style = {
  panel: {
    minWidth: "220px",
    maxWidth: "260px",
    borderLeft: `1px solid ${tokens.colors.bordeIntermedio}`,
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
  grid: {
    display: "grid",
    gap: "1px",
    margin: 0,
    padding: "10px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "30px",
    gap: "12px",
  },
  label: {
    color: tokens.colors.textoTerciario,
    fontSize: "12px",
    fontWeight: 600,
  },
  value: {
    margin: 0,
    color: tokens.colors.textoPrimario,
    fontSize: "13px",
    fontWeight: 700,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
