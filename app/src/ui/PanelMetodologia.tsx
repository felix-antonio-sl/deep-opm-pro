/**
 * PanelMetodologia: ViewComponent derivado por DataFlow puro.
 *
 * Citas SSOT:
 *   metodologia-opm-es.md §6 (construccion del SD), §7 (refinamiento), §6.11
 *   (verificacion del SD), §7.6 (verificacion de SD1).
 *
 * Contrato IFML ronda 13 L3: Modelo -> verificarMetodologia(modelo) ->
 * AvisoMetodologico[]; no Action, no store side-effect, no serializacion.
 *
 * Ronda 15 L5: el panel se puede colapsar para que no compita con Inspector
 * ni PanelAvisos por el alto del costado derecho. El estado vive en useState
 * local (preferencia de sesion). Cuando esta colapsado el contador sigue
 * visible para que el usuario sepa que hay avisos pendientes.
 *
 * Ronda 16 L3 (Beta1): cada aviso es accionable.
 *   - Click en una fila navega al elemento (entidad o OPD) del aviso usando
 *     `navegarAviso` ya provisto por el store (acciones-opd.ts).
 *   - Cita SSOT visible y, al click, expande detalle con rationale +
 *     accionesSugeridas.
 *   - Boton Revalidar dispara recomputo (los avisos son derivados, basta con
 *     invalidar un contador local: la siguiente render lee modelo fresco).
 *   - Severidades visuales salen de tokens (`severidadInfo`,
 *     `severidadAdvertencia`, `severidadSugerencia`); no hay hex literales.
 */

import { useMemo, useState } from "preact/hooks";
import { verificarMetodologia } from "../modelo/checkers";
import type {
  AvisoMetodologico,
  CodigoChecker,
  Modelo,
  NavegacionAviso,
  SeveridadAviso,
} from "../modelo/tipos";
import type { Aviso } from "../modelo/validaciones";
import { useOpmStore } from "../store";
import { tokens } from "./tokens";

interface SeveridadMeta {
  etiqueta: string;
  icono: string;
  color: string;
  fondo: string;
  borde: string;
}

const SEVERIDAD: Record<SeveridadAviso, SeveridadMeta> = {
  advertencia: {
    etiqueta: "Advertencia",
    icono: "⚠",
    color: tokens.colors.alertaTexto,
    fondo: tokens.colors.advertenciaFondo,
    borde: tokens.colors.advertenciaBorde,
  },
  sugerencia: {
    etiqueta: "Sugerencia",
    icono: "ℹ",
    color: tokens.colors.textoSlate,
    fondo: tokens.colors.fondoElevado,
    borde: tokens.colors.bordeSlate,
  },
  info: {
    etiqueta: "Info",
    icono: "ℹ",
    color: tokens.colors.azulInfo,
    fondo: tokens.colors.infoFondoAlterno,
    borde: tokens.colors.infoBordeSuave,
  },
};

export function PanelMetodologia() {
  const modelo = useOpmStore((s) => s.modelo);
  const navegarAviso = useOpmStore((s) => s.navegarAviso);
  const [colapsado, setColapsado] = useState(false);
  const [revision, setRevision] = useState(0);
  const [detalleCodigo, setDetalleCodigo] = useState<CodigoChecker | null>(null);
  // `useMemo` con `revision` como dep: garantiza que Revalidar fuerce recompute
  // aunque el modelo no haya cambiado. Para Beta1 no perdemos memoizacion util
  // (avisos es O(entidades+enlaces), barato), pero conservamos un loop verde.
  const avisos = useMemo(() => verificarMetodologia(modelo), [modelo, revision]);

  return (
    <aside
      data-testid="panel-metodologia"
      data-revision={revision}
      aria-label="Avisos metodológicos"
      data-colapsado={colapsado ? "true" : "false"}
      style={colapsado ? panelColapsado : style.panel}
    >
      <div style={style.header}>
        <button
          type="button"
          data-testid="panel-metodologia-toggle"
          aria-expanded={!colapsado}
          aria-controls="panel-metodologia-cuerpo"
          title={colapsado ? "Expandir avisos metodológicos" : "Colapsar avisos metodológicos"}
          style={style.headerToggle}
          onClick={() => setColapsado((prev) => !prev)}
        >
          <span aria-hidden="true" style={style.chevron}>{colapsado ? "▸" : "▾"}</span>
          <span>Metodología</span>
        </button>
        <span style={style.headerActions}>
          {!colapsado ? (
            <button
              type="button"
              data-testid="panel-metodologia-revalidar"
              style={style.revalidar}
              onClick={(event) => { event.stopPropagation(); setRevision((valor) => valor + 1); }}
              title="Recalcular avisos metodológicos"
            >
              Revalidar
            </button>
          ) : null}
          <span data-testid="panel-metodologia-total" style={contadorStyle(avisos)}>{avisos.length}</span>
        </span>
      </div>
      {colapsado ? null : (
        <div id="panel-metodologia-cuerpo" style={style.cuerpo}>
          {avisos.length === 0 ? (
            <div data-testid="panel-metodologia-vacio" style={style.empty}>
              <span style={style.emptyDot} aria-hidden="true" />
              <span>Modelo metodológicamente válido</span>
            </div>
          ) : (
            <div role="list" style={style.list}>
              {avisos.map((aviso, index) => {
                const meta = SEVERIDAD[aviso.severidad];
                const detalleAbierto = detalleCodigo === aviso.codigo;
                return (
                  <article
                    key={`${aviso.codigo}-${aviso.entidadId ?? aviso.opdId ?? index}`}
                    role="listitem"
                    data-testid={`aviso-${aviso.codigo}`}
                    data-severidad={aviso.severidad}
                    style={filaStyle(meta)}
                  >
                    <button
                      type="button"
                      data-testid={`aviso-navegar-${aviso.codigo}`}
                      style={filaNavegar(meta)}
                      title="Ir al elemento del aviso"
                      onClick={() => navegarAvisoMetodologico(aviso, navegarAviso)}
                    >
                      <span aria-label={meta.etiqueta} title={meta.etiqueta} style={iconoStyle(meta)}>
                        {meta.icono}
                      </span>
                      <span style={style.rowMain}>
                        <span style={style.codigo}>{etiquetaCodigo(aviso.codigo)}</span>
                        <span style={style.mensaje}>{aviso.mensaje}</span>
                        <span style={style.target}>{etiquetaDestino(modelo, aviso)}</span>
                      </span>
                    </button>
                    <div style={style.rowActions}>
                      <button
                        type="button"
                        data-testid={`aviso-cita-${aviso.codigo}`}
                        style={style.cita}
                        title={`Cita SSOT: ${aviso.ssotRef ?? aviso.rationale ?? ""}`}
                        onClick={() => setDetalleCodigo(detalleAbierto ? null : aviso.codigo)}
                      >
                        {aviso.ssotRef ? cortarCita(aviso.ssotRef) : "SSOT"}
                      </button>
                    </div>
                    {detalleAbierto ? (
                      <div data-testid={`aviso-detalle-${aviso.codigo}`} style={style.detalle}>
                        <div style={style.detalleSsot}>
                          <span style={style.detalleSsotLabel}>SSOT</span>
                          <span>{aviso.ssotRef ?? "—"}</span>
                        </div>
                        {aviso.rationale ? (
                          <div style={style.detalleRationale}>{aviso.rationale}</div>
                        ) : null}
                        {aviso.accionesSugeridas && aviso.accionesSugeridas.length > 0 ? (
                          <ul style={style.detalleAcciones}>
                            {aviso.accionesSugeridas.map((accion, idx) => (
                              <li key={idx} style={style.detalleAccionItem}>{accion}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

function navegarAvisoMetodologico(aviso: AvisoMetodologico, navegar: (aviso: Aviso) => void): void {
  const destino = resolverDestino(aviso);
  if (!destino) return;
  // Mapeo a la firma `Aviso` consumida por `navegarAviso` del store.
  const elementoTipo: Aviso["elementoTipo"] = destino.tipo === "opd" ? "opd" : "entidad";
  const adaptador: Aviso = {
    reglaId: aviso.codigo,
    severidad: aviso.severidad === "sugerencia" ? "info" : aviso.severidad,
    mensaje: aviso.mensaje,
    citaSSOT: aviso.ssotRef ?? "",
    elementoTipo,
    elementoId: destino.id,
  };
  if (destino.opdId) adaptador.opdId = destino.opdId;
  navegar(adaptador);
}

function resolverDestino(aviso: AvisoMetodologico): NavegacionAviso | null {
  if (aviso.navegarA) return aviso.navegarA;
  if (aviso.entidadId) {
    const item: NavegacionAviso = { tipo: "entidad", id: aviso.entidadId };
    if (aviso.opdId) item.opdId = aviso.opdId;
    return item;
  }
  if (aviso.opdId) return { tipo: "opd", id: aviso.opdId };
  return null;
}

function cortarCita(ref: string): string {
  // El boton "SSOT" del panel muestra una cita corta. Cortar despues del
  // primer "/" o despues de 28 chars manteniendo lectura razonable.
  const corte = ref.split(" / ")[0] ?? ref;
  return corte.length > 32 ? `${corte.slice(0, 30)}…` : corte;
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

function contadorStyle(avisos: AvisoMetodologico[]): preact.JSX.CSSProperties {
  const hayAdvertencia = avisos.some((aviso) => aviso.severidad === "advertencia");
  const total = avisos.length;
  return {
    ...style.count,
    color: total === 0 ? tokens.colors.exitoTexto : hayAdvertencia ? tokens.colors.alertaTexto : tokens.colors.textoSlate,
    background: total === 0 ? tokens.colors.exitoFondo : hayAdvertencia ? tokens.colors.advertenciaFondo : tokens.colors.fondoElevado,
  };
}

function filaStyle(meta: SeveridadMeta): preact.JSX.CSSProperties {
  return {
    ...style.row,
    background: meta.fondo,
    borderColor: meta.borde,
    borderLeftColor: meta.color,
  };
}

function filaNavegar(meta: SeveridadMeta): preact.JSX.CSSProperties {
  return {
    ...style.rowNavegar,
    color: meta.color,
  };
}

function iconoStyle(meta: SeveridadMeta): preact.JSX.CSSProperties {
  return {
    ...style.icon,
    color: meta.color,
  };
}

const panelColapsado: preact.JSX.CSSProperties = {
  flex: "0 0 auto",
  minWidth: 0,
  minHeight: "32px",
  overflow: "hidden",
  background: tokens.colors.fondoChrome,
  borderTop: `1px solid ${tokens.colors.bordeIntermedio}`,
  display: "flex",
  flexDirection: "column",
  fontFamily: tokens.typography.familyChrome,
};

const style = {
  panel: {
    flex: "0 0 180px",
    minWidth: 0,
    minHeight: "150px",
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
    minHeight: "30px",
    borderBottom: `1px solid ${tokens.colors.bordeChrome}`,
    color: tokens.colors.textoPrimario,
    fontSize: "13px",
    fontWeight: 700,
  },
  headerToggle: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    border: 0,
    background: "transparent",
    padding: "4px 0",
    cursor: "pointer",
    color: tokens.colors.textoPrimario,
    fontSize: "13px",
    fontWeight: 700,
    fontFamily: tokens.typography.familyChrome,
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
  chevron: {
    width: "12px",
    color: tokens.colors.textoTerciario,
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
  cuerpo: {
    minHeight: 0,
    flex: "1 1 auto",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
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
  list: {
    overflow: "auto",
    minHeight: 0,
    flex: "1 1 auto",
    padding: "8px",
    display: "grid",
    alignContent: "start",
    gap: "6px",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: "8px",
    padding: "7px 8px",
    border: "1px solid",
    borderLeft: "3px solid",
    borderRadius: tokens.radii.sm,
    minWidth: 0,
    color: tokens.colors.textoPrimario,
    fontFamily: tokens.typography.familyChrome,
  },
  rowNavegar: {
    display: "grid",
    gridTemplateColumns: "22px minmax(0, 1fr)",
    gap: "8px",
    minWidth: 0,
    border: 0,
    background: "transparent",
    padding: 0,
    textAlign: "left",
    cursor: "pointer",
    fontFamily: tokens.typography.familyChrome,
  },
  rowMain: {
    minWidth: 0,
    display: "grid",
    gap: "3px",
  },
  rowActions: {
    display: "grid",
    justifyItems: "end",
    gap: "5px",
    minWidth: 0,
    alignSelf: "start",
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
  codigo: {
    color: tokens.colors.textoSecundario,
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0,
    overflowWrap: "anywhere",
  },
  mensaje: {
    color: tokens.colors.textoPrimario,
    fontSize: "12px",
    lineHeight: 1.25,
    fontWeight: 700,
    overflowWrap: "anywhere",
  },
  target: {
    color: tokens.colors.textoTerciario,
    fontSize: "11px",
    fontWeight: 600,
    lineHeight: 1.2,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  cita: {
    border: `1px solid ${tokens.colors.bordeSlate}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoChrome,
    color: tokens.colors.azulInfo,
    fontSize: "11px",
    fontWeight: 700,
    fontFamily: tokens.typography.familyChrome,
    padding: "3px 6px",
    maxWidth: "150px",
    overflowWrap: "anywhere",
    cursor: "pointer",
  },
  detalle: {
    gridColumn: "1 / -1",
    marginTop: "6px",
    padding: "8px 10px",
    background: tokens.colors.fondoChrome,
    border: `1px solid ${tokens.colors.bordeChrome}`,
    borderRadius: tokens.radii.sm,
    display: "grid",
    gap: "6px",
    fontSize: "11px",
    color: tokens.colors.textoSlate,
  },
  detalleSsot: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    minWidth: 0,
    color: tokens.colors.textoSlate,
    overflowWrap: "anywhere",
  },
  detalleSsotLabel: {
    color: tokens.colors.azulInfo,
    fontWeight: 700,
    flex: "0 0 auto",
  },
  detalleRationale: {
    lineHeight: 1.35,
  },
  detalleAcciones: {
    margin: 0,
    paddingLeft: "16px",
    display: "grid",
    gap: "3px",
  },
  detalleAccionItem: {
    lineHeight: 1.35,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
