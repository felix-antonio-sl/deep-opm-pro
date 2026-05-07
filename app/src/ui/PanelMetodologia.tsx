/**
 * PanelMetodologia: ViewComponent derivado por DataFlow puro.
 *
 * Citas SSOT: [Met §metodologia] [Met §inzoom] [Met §unfold].
 * Contrato IFML ronda 13 L3: Modelo -> verificarMetodologia(modelo) ->
 * AvisoMetodologico[]; no Action, no store side-effect, no serializacion.
 */

import { verificarMetodologia } from "../modelo/checkers";
import type { AvisoMetodologico, CodigoChecker, Modelo, SeveridadAviso } from "../modelo/tipos";
import { useOpmStore } from "../store";
import { colors } from "./tokens";

interface SeveridadMeta {
  etiqueta: string;
  color: string;
  fondo: string;
  borde: string;
}

const SEVERIDAD: Record<SeveridadAviso, SeveridadMeta> = {
  advertencia: {
    etiqueta: "Advertencia",
    color: "rgb(180, 83, 9)",
    fondo: "rgb(255, 251, 235)",
    borde: "rgb(253, 230, 138)",
  },
  sugerencia: {
    etiqueta: "Sugerencia",
    color: colors.chromeNeutral,
    fondo: colors.chromeNeutralSuave,
    borde: "rgb(203, 213, 225)",
  },
  info: {
    etiqueta: "Info",
    color: colors.acentoSecundario,
    fondo: colors.acentoUiSuave,
    borde: "rgb(191, 219, 254)",
  },
};

export function PanelMetodologia() {
  const modelo = useOpmStore((s) => s.modelo);
  const avisos = verificarMetodologia(modelo);

  return (
    <aside data-testid="panel-metodologia" aria-label="Avisos metodológicos" style={style.panel}>
      <div style={style.header}>
        <span>Metodología</span>
        <span data-testid="panel-metodologia-total" style={contadorStyle(avisos.length)}>{avisos.length}</span>
      </div>
      {avisos.length === 0 ? (
        <div data-testid="panel-metodologia-vacio" style={style.empty}>
          Modelo metodológicamente válido
        </div>
      ) : (
        <div role="list" style={style.list}>
          {avisos.map((aviso, index) => (
            <article
              key={`${aviso.codigo}-${aviso.entidadId ?? aviso.opdId ?? index}`}
              role="listitem"
              data-testid={`aviso-${aviso.codigo}`}
              style={filaStyle(aviso.severidad)}
              title={aviso.rationale}
            >
              <span style={style.codigo}>{etiquetaCodigo(aviso.codigo)}</span>
              <span style={style.mensaje}>{aviso.mensaje}</span>
              <span style={style.target}>{etiquetaDestino(modelo, aviso)}</span>
            </article>
          ))}
        </div>
      )}
    </aside>
  );
}

function etiquetaCodigo(codigo: CodigoChecker): string {
  return codigo.toLowerCase().replaceAll("_", " ");
}

function etiquetaDestino(modelo: Modelo, aviso: AvisoMetodologico): string {
  if (aviso.entidadId) {
    const entidad = modelo.entidades[aviso.entidadId];
    return entidad ? entidad.nombre : aviso.entidadId;
  }
  if (aviso.opdId) return modelo.opds[aviso.opdId]?.nombre ?? aviso.opdId;
  return "Modelo";
}

function contadorStyle(total: number): preact.JSX.CSSProperties {
  return {
    ...style.count,
    color: total === 0 ? "rgb(20, 122, 74)" : "rgb(180, 83, 9)",
    background: total === 0 ? "rgb(236, 253, 243)" : "rgb(255, 251, 235)",
  };
}

function filaStyle(severidad: SeveridadAviso): preact.JSX.CSSProperties {
  const meta = SEVERIDAD[severidad];
  return {
    ...style.row,
    color: meta.color,
    background: meta.fondo,
    borderColor: meta.borde,
    borderLeftColor: meta.color,
  };
}

const style = {
  panel: {
    flex: "0 0 150px",
    minWidth: 0,
    minHeight: "120px",
    overflow: "hidden",
    background: "white",
    borderTop: "1px solid rgb(217, 224, 234)",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    padding: "5px 12px",
    borderBottom: "1px solid rgb(228, 234, 241)",
    color: "rgb(31, 41, 55)",
    fontSize: "13px",
    fontWeight: 700,
  },
  count: {
    minWidth: "24px",
    height: "18px",
    borderRadius: "9px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 700,
  },
  empty: {
    padding: "12px",
    color: "rgb(20, 122, 74)",
    fontSize: "12px",
    fontWeight: 700,
  },
  list: {
    overflow: "auto",
    minHeight: 0,
    display: "grid",
    gap: "6px",
    padding: "8px",
  },
  row: {
    display: "grid",
    gap: "3px",
    padding: "7px 8px",
    border: "1px solid",
    borderLeft: "3px solid",
    borderRadius: "6px",
    minWidth: 0,
  },
  codigo: {
    color: colors.acentoSecundario,
    fontSize: "10px",
    fontWeight: 800,
    textTransform: "uppercase",
  },
  mensaje: {
    color: "rgb(30, 41, 59)",
    fontSize: "12px",
    lineHeight: 1.25,
    fontWeight: 700,
  },
  target: {
    color: colors.chromeNeutral,
    fontSize: "11px",
    lineHeight: 1.2,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
