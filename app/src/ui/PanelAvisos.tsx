import type { Aviso, SeveridadAviso } from "../modelo/validaciones";
import { validarModelo } from "../modelo/validaciones";
import type { Id, Modelo } from "../modelo/tipos";
import { useOpmStore } from "../store";

interface SeveridadMeta {
  icono: string;
  etiqueta: string;
  color: string;
  fondo: string;
  borde: string;
}

const SEVERIDAD: Record<SeveridadAviso, SeveridadMeta> = {
  error: {
    icono: "⛔",
    etiqueta: "Error",
    color: "#b42318",
    fondo: "#fff3f1",
    borde: "#fecdca",
  },
  advertencia: {
    icono: "⚠",
    etiqueta: "Advertencia",
    color: "#dc6803",
    fondo: "#fff8eb",
    borde: "#fedf89",
  },
  info: {
    icono: "ℹ",
    etiqueta: "Info",
    color: "#175cd3",
    fondo: "#eff8ff",
    borde: "#b2ddff",
  },
};

export function PanelAvisos() {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const cambiarOpdActivo = useOpmStore((s) => s.cambiarOpdActivo);
  const seleccionarEntidad = useOpmStore((s) => s.seleccionarEntidad);
  const seleccionarEnlace = useOpmStore((s) => s.seleccionarEnlace);
  const avisos = validarModelo(modelo, opdActivoId);

  const navegar = (aviso: Aviso) => {
    const opdDestino = opdDestinoDeAviso(modelo, aviso, opdActivoId);
    if (opdDestino && opdDestino !== opdActivoId) cambiarOpdActivo(opdDestino);

    if (aviso.elementoTipo === "entidad" && aviso.elementoId && modelo.entidades[aviso.elementoId]) {
      seleccionarEntidad(aviso.elementoId);
    } else if (aviso.elementoTipo === "enlace" && aviso.elementoId && modelo.enlaces[aviso.elementoId]) {
      seleccionarEnlace(aviso.elementoId);
    } else if (aviso.elementoTipo === "opd" && aviso.elementoId && modelo.opds[aviso.elementoId]) {
      cambiarOpdActivo(aviso.elementoId);
    }
  };

  return (
    <aside data-testid="panel-avisos" aria-label="Verificación metodológica" style={style.panel}>
      <div style={style.header}>
        <span>Verificación metodológica</span>
        <span style={contadorStyle(avisos)}>{avisos.length}</span>
      </div>
      {avisos.length === 0 ? (
        <div style={style.empty}>
          <span style={style.emptyDot} aria-hidden="true" />
          <span>Sin avisos</span>
        </div>
      ) : (
        <div role="list" style={style.list}>
          {avisos.map((aviso, index) => {
            const meta = SEVERIDAD[aviso.severidad];
            const disabled = !puedeNavegar(modelo, aviso);
            return (
              <button
                key={`${aviso.reglaId}-${aviso.elementoId ?? aviso.opdId ?? index}`}
                type="button"
                role="listitem"
                disabled={disabled}
                style={filaStyle(meta, disabled)}
                title={disabled ? aviso.mensaje : "Ir al elemento"}
                onClick={() => navegar(aviso)}
              >
                <span aria-label={meta.etiqueta} title={meta.etiqueta} style={iconoStyle(meta)}>
                  {meta.icono}
                </span>
                <span style={style.rowMain}>
                  <span style={style.rule}>{aviso.reglaId}</span>
                  <span style={style.message}>{aviso.mensaje}</span>
                  <span style={style.target}>{etiquetaElemento(modelo, aviso)}</span>
                </span>
                <span style={style.cita}>{aviso.citaSSOT}</span>
              </button>
            );
          })}
        </div>
      )}
    </aside>
  );
}

function puedeNavegar(modelo: Modelo, aviso: Aviso): boolean {
  if (!aviso.elementoTipo || !aviso.elementoId) return false;
  if (aviso.elementoTipo === "entidad") return Boolean(modelo.entidades[aviso.elementoId]);
  if (aviso.elementoTipo === "enlace") return Boolean(modelo.enlaces[aviso.elementoId]);
  return Boolean(modelo.opds[aviso.elementoId]);
}

function opdDestinoDeAviso(modelo: Modelo, aviso: Aviso, opdActivoId: Id): Id | null {
  if (aviso.opdId && modelo.opds[aviso.opdId]) return aviso.opdId;
  if (!aviso.elementoId) return null;
  if (aviso.elementoTipo === "opd") return modelo.opds[aviso.elementoId] ? aviso.elementoId : null;
  if (aviso.elementoTipo === "enlace") return opdIdDeEnlace(modelo, aviso.elementoId, opdActivoId);
  if (aviso.elementoTipo === "entidad") return opdIdDeEntidad(modelo, aviso.elementoId, opdActivoId);
  return null;
}

function opdIdDeEnlace(modelo: Modelo, enlaceId: Id, opdPreferidoId: Id): Id | null {
  const preferido = modelo.opds[opdPreferidoId];
  if (preferido && Object.values(preferido.enlaces).some((apariencia) => apariencia.enlaceId === enlaceId)) {
    return opdPreferidoId;
  }
  for (const opd of Object.values(modelo.opds)) {
    if (Object.values(opd.enlaces).some((apariencia) => apariencia.enlaceId === enlaceId)) return opd.id;
  }
  return null;
}

function opdIdDeEntidad(modelo: Modelo, entidadId: Id, opdPreferidoId: Id): Id | null {
  const preferido = modelo.opds[opdPreferidoId];
  if (preferido && Object.values(preferido.apariencias).some((apariencia) => apariencia.entidadId === entidadId)) {
    return opdPreferidoId;
  }
  for (const opd of Object.values(modelo.opds)) {
    if (Object.values(opd.apariencias).some((apariencia) => apariencia.entidadId === entidadId)) return opd.id;
  }
  return null;
}

function etiquetaElemento(modelo: Modelo, aviso: Aviso): string {
  if (aviso.elementoTipo === "entidad" && aviso.elementoId) {
    const entidad = modelo.entidades[aviso.elementoId];
    return entidad ? `${entidad.nombre} · ${entidad.id}` : aviso.elementoId;
  }
  if (aviso.elementoTipo === "enlace" && aviso.elementoId) {
    const enlace = modelo.enlaces[aviso.elementoId];
    if (!enlace) return aviso.elementoId;
    const origen = modelo.entidades[enlace.origenId]?.nombre ?? enlace.origenId;
    const destino = modelo.entidades[enlace.destinoId]?.nombre ?? enlace.destinoId;
    return `${origen} -> ${destino} · ${enlace.id}`;
  }
  if (aviso.elementoTipo === "opd" && aviso.elementoId) {
    return modelo.opds[aviso.elementoId]?.nombre ?? aviso.elementoId;
  }
  return "Sin elemento";
}

function contadorStyle(avisos: Aviso[]): preact.JSX.CSSProperties {
  const hayError = avisos.some((aviso) => aviso.severidad === "error");
  const hayAdvertencia = avisos.some((aviso) => aviso.severidad === "advertencia");
  const color = hayError ? "#b42318" : hayAdvertencia ? "#dc6803" : "#147a4a";
  const background = avisos.length === 0 ? "#ecfdf3" : hayError ? "#fff3f1" : hayAdvertencia ? "#fff8eb" : "#eff8ff";
  return {
    ...style.count,
    color,
    background,
  };
}

function filaStyle(meta: SeveridadMeta, disabled: boolean): preact.JSX.CSSProperties {
  return {
    ...style.row,
    borderColor: meta.borde,
    borderLeftColor: meta.color,
    background: meta.fondo,
    cursor: disabled ? "default" : "pointer",
    opacity: disabled ? 0.72 : 1,
  };
}

function iconoStyle(meta: SeveridadMeta): preact.JSX.CSSProperties {
  return {
    ...style.icon,
    color: meta.color,
  };
}

const style = {
  panel: {
    gridRow: "3",
    minHeight: "170px",
    maxHeight: "34%",
    minWidth: 0,
    overflow: "hidden",
    background: "#ffffff",
    borderTop: "1px solid #d9e0ea",
    display: "grid",
    gridTemplateRows: "42px minmax(0, 1fr)",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    padding: "0 12px",
    borderBottom: "1px solid #e4eaf1",
    color: "#1f2937",
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
  list: {
    overflow: "auto",
    padding: "8px",
    display: "grid",
    alignContent: "start",
    gap: "6px",
  },
  empty: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px",
    color: "#147a4a",
    fontSize: "12px",
    fontWeight: 700,
  },
  emptyDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#12b76a",
    flex: "0 0 auto",
  },
  row: {
    width: "100%",
    border: "1px solid #dbe5ef",
    borderLeft: "3px solid #175cd3",
    borderRadius: "4px",
    padding: "7px 8px",
    display: "grid",
    gridTemplateColumns: "22px minmax(0, 1fr) auto",
    alignItems: "start",
    gap: "8px",
    color: "#1f2937",
    textAlign: "left",
    fontFamily: "Arial, sans-serif",
  },
  icon: {
    minWidth: "22px",
    height: "22px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    lineHeight: 1,
  },
  rowMain: {
    minWidth: 0,
    display: "grid",
    gap: "3px",
  },
  rule: {
    color: "#475467",
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0,
    overflowWrap: "anywhere",
  },
  message: {
    color: "#1f2937",
    fontSize: "12px",
    fontWeight: 700,
    lineHeight: 1.25,
    overflowWrap: "anywhere",
  },
  target: {
    color: "#667085",
    fontSize: "11px",
    fontWeight: 600,
    lineHeight: 1.2,
    overflowWrap: "anywhere",
  },
  cita: {
    color: "#475467",
    fontSize: "11px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
