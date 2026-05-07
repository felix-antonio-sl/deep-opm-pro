// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useState } from "preact/hooks";
import { nombreExtremo } from "../modelo/extremos";
import type { Aviso, SeveridadAviso } from "../modelo/validaciones";
import { validarModelo } from "../modelo/validaciones";
import type { Id, Modelo } from "../modelo/tipos";
import { useOpmStore } from "../store";
import { tokens } from "./tokens";

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
    color: tokens.colors.errorTexto,
    fondo: tokens.colors.errorFondoIntenso,
    borde: tokens.colors.errorBordeSuave,
  },
  advertencia: {
    icono: "⚠",
    etiqueta: "Advertencia",
    color: tokens.colors.alertaTexto,
    fondo: tokens.colors.advertenciaFondo,
    borde: tokens.colors.advertenciaBorde,
  },
  info: {
    icono: "ℹ",
    etiqueta: "Info",
    color: tokens.colors.azulInfo,
    fondo: tokens.colors.infoFondoAlterno,
    borde: tokens.colors.infoBordeSuave,
  },
};

export function PanelAvisos() {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const navegarAviso = useOpmStore((s) => s.navegarAviso);
  const [revision, setRevision] = useState(0);
  const [citaActiva, setCitaActiva] = useState<string | null>(null);
  const avisos = validarModelo(modelo, opdActivoId);

  return (
    <aside data-testid="panel-avisos" data-revision={revision} aria-label="Verificación metodológica" style={style.panel}>
      <div style={style.header}>
        <span>Verificación metodológica</span>
        <span style={style.headerActions}>
          <button type="button" style={style.revalidar} onClick={() => setRevision((valor) => valor + 1)}>
            Revalidar
          </button>
          <span style={contadorStyle(avisos)}>{avisos.length}</span>
        </span>
      </div>
      {citaActiva ? (
        <div data-testid="panel-avisos-cita" style={style.citaDetalle}>
          <span style={style.citaDetalleLabel}>SSOT</span>
          <span>{citaActiva}</span>
        </div>
      ) : null}
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
              <article
                key={`${aviso.reglaId}-${aviso.elementoId ?? aviso.opdId ?? index}`}
                role="listitem"
                style={filaStyle(meta, disabled)}
                title={disabled ? aviso.mensaje : "Ir al elemento"}
              >
                <span aria-label={meta.etiqueta} title={meta.etiqueta} style={iconoStyle(meta)}>
                  {meta.icono}
                </span>
                <span style={style.rowMain}>
                  <span style={style.rule}>{aviso.reglaId}</span>
                  <span style={style.message}>{aviso.mensaje}</span>
                  <span style={style.target}>{etiquetaElemento(modelo, aviso)}</span>
                </span>
                <span style={style.rowActions}>
                  <button
                    type="button"
                    style={style.cita}
                    title={`Cita SSOT ${aviso.citaSSOT}`}
                    onClick={() => setCitaActiva(aviso.citaSSOT)}
                  >
                    {aviso.citaSSOT}
                  </button>
                  <button
                    type="button"
                    disabled={disabled}
                    style={irElementoStyle(disabled)}
                    onClick={() => navegarAviso(aviso)}
                  >
                    Ir
                  </button>
                </span>
              </article>
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
    const origen = nombreExtremo(modelo, enlace.origenId);
    const destino = nombreExtremo(modelo, enlace.destinoId);
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
  const color = hayError ? tokens.colors.errorTexto : hayAdvertencia ? tokens.colors.alertaTexto : tokens.colors.exitoTexto;
  const background = avisos.length === 0 ? tokens.colors.exitoFondo : hayError ? tokens.colors.errorFondoIntenso : hayAdvertencia ? tokens.colors.advertenciaFondo : tokens.colors.infoFondoAlterno;
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

function irElementoStyle(disabled: boolean): preact.JSX.CSSProperties {
  return {
    ...style.irElemento,
    opacity: disabled ? 0.48 : 1,
    cursor: disabled ? "default" : "pointer",
  };
}

const style = {
  panel: {
    gridRow: "3",
    minHeight: "170px",
    maxHeight: "34%",
    minWidth: 0,
    overflow: "hidden",
    background: tokens.colors.fondoChrome,
    borderTop: `1px solid ${tokens.colors.bordeIntermedio}`,
    display: "flex",
    flexDirection: "column",
    fontFamily: tokens.typography.familyChrome,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    padding: "0 12px",
    borderBottom: `1px solid ${tokens.colors.bordeChrome}`,
    color: tokens.colors.textoPrimario,
    fontSize: "13px",
    fontWeight: 700,
  },
  headerActions: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  },
  revalidar: {
    border: `1px solid ${tokens.colors.bordeSlate}`,
    background: tokens.colors.fondoChrome,
    color: tokens.colors.textoSlate,
    borderRadius: tokens.radii.sm,
    padding: "3px 7px",
    fontFamily: tokens.typography.familyChrome,
    fontSize: "11px",
    fontWeight: 700,
    cursor: "pointer",
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
  citaDetalle: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    minWidth: 0,
    padding: "5px 12px",
    borderBottom: `1px solid ${tokens.colors.bordeChrome}`,
    color: tokens.colors.textoSlate,
    background: tokens.colors.fondoElevado,
    fontSize: "11px",
    fontWeight: 700,
    overflow: "hidden",
  },
  citaDetalleLabel: {
    color: tokens.colors.azulInfo,
    flex: "0 0 auto",
  },
  list: {
    overflow: "auto",
    minHeight: 0,
    flex: "1 1 auto",
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
    color: tokens.colors.exitoTexto,
    fontSize: "12px",
    fontWeight: 700,
  },
  emptyDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: tokens.colors.exitoBase,
    flex: "0 0 auto",
  },
  row: {
    width: "100%",
    border: `1px solid ${tokens.colors.mapaBorde}`,
    borderLeft: `3px solid ${tokens.colors.azulInfo}`,
    borderRadius: tokens.radii.sm,
    padding: "7px 8px",
    display: "grid",
    gridTemplateColumns: "22px minmax(0, 1fr) minmax(92px, auto)",
    alignItems: "start",
    gap: "8px",
    color: tokens.colors.textoPrimario,
    textAlign: "left",
    fontFamily: tokens.typography.familyChrome,
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
    color: tokens.colors.textoSecundario,
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0,
    overflowWrap: "anywhere",
  },
  message: {
    color: tokens.colors.textoPrimario,
    fontSize: "12px",
    fontWeight: 700,
    lineHeight: 1.25,
    overflowWrap: "anywhere",
  },
  target: {
    color: tokens.colors.textoTerciario,
    fontSize: "11px",
    fontWeight: 600,
    lineHeight: 1.2,
    overflowWrap: "anywhere",
  },
  rowActions: {
    display: "grid",
    justifyItems: "end",
    gap: "5px",
    minWidth: 0,
  },
  cita: {
    border: `1px solid ${tokens.colors.bordeSlate}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoChrome,
    color: tokens.colors.azulInfo,
    fontSize: "11px",
    fontWeight: 700,
    fontFamily: tokens.typography.familyChrome,
    padding: "3px 5px",
    maxWidth: "150px",
    overflowWrap: "anywhere",
    cursor: "pointer",
  },
  irElemento: {
    border: `1px solid ${tokens.colors.bordeSlate}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoChrome,
    color: tokens.colors.textoSlate,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "11px",
    fontWeight: 700,
    padding: "3px 8px",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
