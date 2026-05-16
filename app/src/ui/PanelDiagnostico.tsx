import { useEffect, useMemo, useState } from "preact/hooks";
import { nombreExtremo } from "../modelo/extremos";
import { verificarMetodologia } from "../modelo/checkers";
import type { AvisoMetodologico, CodigoChecker, Modelo, NavegacionAviso } from "../modelo/tipos";
import type { Aviso, SeveridadAviso } from "../modelo/validaciones";
import { validarModelo } from "../modelo/validaciones";
import { useOpmStore } from "../store";
import { EVENTO_ABRIR_AVISO_DIAGNOSTICO } from "../store/feedback";
import { clasificarSeveridad } from "./panelMetodologiaIssues";
import { tokens } from "./tokens";

type SeveridadDiagnostico = "bloqueo" | "mejora" | "estilo";

interface DiagnosticoIssue {
  id: string;
  testIdCodigo: string;
  severidad: SeveridadDiagnostico;
  codigo: string;
  mensaje: string;
  destino: string;
  cita: string;
  navegar: () => void;
}

const META: Record<SeveridadDiagnostico, { titulo: string; icono: string; color: string; fondo: string; borde: string }> = {
  bloqueo: {
    titulo: "Bloqueos",
    icono: "!",
    color: tokens.colors.errorTexto,
    fondo: tokens.colors.errorFondoIntenso,
    borde: tokens.colors.errorBordeSuave,
  },
  mejora: {
    titulo: "Mejoras",
    icono: "!",
    color: tokens.colors.alertaTexto,
    fondo: tokens.colors.advertenciaFondo,
    borde: tokens.colors.advertenciaBorde,
  },
  estilo: {
    titulo: "Estilo",
    icono: "i",
    color: tokens.colors.textoSlate,
    fondo: tokens.colors.fondoElevado,
    borde: tokens.colors.bordeSlate,
  },
};
type DiagnosticoMeta = (typeof META)[SeveridadDiagnostico];

export function PanelDiagnostico() {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const navegarAviso = useOpmStore((s) => s.navegarAviso);
  const [expandido, setExpandido] = useState(false);
  const [revision, setRevision] = useState(0);
  const [citaActiva, setCitaActiva] = useState<{ codigo: string; cita: string } | null>(null);
  const [codigoResaltado, setCodigoResaltado] = useState<string | null>(null);

  const issues = useMemo(() => [
    ...mapearAvisosValidacion(modelo, opdActivoId, navegarAviso),
    ...mapearAvisosMetodologia(modelo, navegarAviso),
  ], [modelo, navegarAviso, opdActivoId, revision]);

  const grupos = {
    bloqueo: issues.filter((issue) => issue.severidad === "bloqueo"),
    mejora: issues.filter((issue) => issue.severidad === "mejora"),
    estilo: issues.filter((issue) => issue.severidad === "estilo"),
  };

  useEffect(() => {
    const abrirAviso = (event: Event) => {
      const detail = (event as CustomEvent<{ reglaId?: string }>).detail;
      if (!detail?.reglaId) return;
      setExpandido(true);
      setCodigoResaltado(detail.reglaId);
      requestAnimationFrame(() => {
        document.querySelector<HTMLElement>(`[data-aviso-codigo="${detail.reglaId}"]`)?.scrollIntoView({ block: "nearest" });
      });
      window.setTimeout(() => setCodigoResaltado((actual) => (actual === detail.reglaId ? null : actual)), 2_400);
    };
    window.addEventListener(EVENTO_ABRIR_AVISO_DIAGNOSTICO, abrirAviso);
    return () => window.removeEventListener(EVENTO_ABRIR_AVISO_DIAGNOSTICO, abrirAviso);
  }, []);

  return (
    <aside
      data-testid="panel-diagnostico"
      data-revision={revision}
      data-expandido={expandido ? "true" : "false"}
      aria-label="Diagnóstico del modelo"
      style={expandido ? style.panelExpandido : style.panelColapsado}
    >
      <header style={style.header}>
        <button
          type="button"
          data-testid="panel-diagnostico-toggle"
          aria-expanded={expandido}
          aria-controls="panel-diagnostico-cuerpo"
          style={style.headerToggle}
          onClick={() => setExpandido((actual) => !actual)}
        >
          <span aria-hidden="true" style={style.chevron}>{expandido ? "▾" : "▸"}</span>
          <span>Diagnóstico del modelo</span>
        </button>
        <span style={style.headerActions}>
          {expandido ? (
            <button type="button" data-testid="panel-diagnostico-revalidar" style={style.revalidar} onClick={() => setRevision((valor) => valor + 1)}>
              Revalidar
            </button>
          ) : null}
          <span style={contadorStyle(issues)}>{issues.length} issues</span>
        </span>
      </header>
      {expandido ? (
        <div id="panel-diagnostico-cuerpo" style={style.cuerpo}>
          {citaActiva ? (
            <div
              data-testid="panel-diagnostico-cita"
              data-aviso-codigo={citaActiva.codigo}
              style={style.citaDetalle}
            >
              <strong>SSOT</strong>
              <span data-testid={`aviso-detalle-${citaActiva.codigo}`}>{citaActiva.cita}</span>
            </div>
          ) : null}
          {issues.length === 0 ? (
            <div style={style.empty}>Modelo sin issues metodológicos</div>
          ) : (
            <div style={style.secciones}>
              <Seccion titulo={META.bloqueo.titulo} meta={META.bloqueo} issues={grupos.bloqueo} codigoResaltado={codigoResaltado} onCita={setCitaActiva} />
              <Seccion titulo={META.mejora.titulo} meta={META.mejora} issues={grupos.mejora} codigoResaltado={codigoResaltado} onCita={setCitaActiva} />
              <Seccion titulo={META.estilo.titulo} meta={META.estilo} issues={grupos.estilo} codigoResaltado={codigoResaltado} onCita={setCitaActiva} />
            </div>
          )}
        </div>
      ) : null}
    </aside>
  );
}

function Seccion(props: {
  titulo: string;
  meta: DiagnosticoMeta;
  issues: DiagnosticoIssue[];
  codigoResaltado: string | null;
  onCita: (detalle: { codigo: string; cita: string }) => void;
}) {
  return (
    <section style={style.seccion}>
      <h3 style={{ ...style.seccionTitulo, color: props.meta.color }}>
        {props.titulo} ({props.issues.length})
      </h3>
      {props.issues.length === 0 ? <p style={style.seccionEmpty}>Sin issues en este grupo</p> : null}
      <div role="list" style={style.list}>
        {props.issues.map((issue) => (
          <article
            key={issue.id}
            data-testid={`aviso-${issue.testIdCodigo}`}
            data-aviso-codigo={issue.testIdCodigo}
            data-resaltado={props.codigoResaltado === issue.testIdCodigo ? "true" : "false"}
            role="listitem"
            style={{ ...filaStyle(props.meta), ...(props.codigoResaltado === issue.testIdCodigo ? style.filaResaltada : {}) }}
          >
            <button
              type="button"
              data-testid={`aviso-navegar-${issue.testIdCodigo}`}
              style={style.rowMain}
              onClick={issue.navegar}
              title="Ir al elemento"
            >
              <span aria-hidden="true" style={{ ...style.icon, color: props.meta.color }}>{props.meta.icono}</span>
              <span style={style.rowText}>
                <strong>{issue.codigo}</strong>
                <span>{issue.mensaje}</span>
                <small>{issue.destino}</small>
              </span>
            </button>
            <button
              type="button"
              data-testid={`aviso-cita-${issue.testIdCodigo}`}
              style={style.cita}
              onClick={() => props.onCita({ codigo: issue.testIdCodigo, cita: issue.cita })}
              title={`Cita SSOT: ${issue.cita}`}
            >
              SSOT
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function mapearAvisosValidacion(
  modelo: Modelo,
  opdActivoId: string,
  navegarAviso: (aviso: Aviso) => void,
): DiagnosticoIssue[] {
  return validarModelo(modelo, opdActivoId).map((aviso, index) => ({
    id: `val-${aviso.reglaId}-${aviso.elementoId ?? aviso.opdId ?? index}`,
    testIdCodigo: aviso.reglaId,
    severidad: severidadDesdeAviso(aviso.severidad),
    codigo: aviso.reglaId,
    mensaje: aviso.mensaje,
    destino: etiquetaElemento(modelo, aviso),
    cita: aviso.citaSSOT,
    navegar: () => navegarAviso(aviso),
  }));
}

function mapearAvisosMetodologia(
  modelo: Modelo,
  navegarAviso: (aviso: Aviso) => void,
): DiagnosticoIssue[] {
  return verificarMetodologia(modelo).map((aviso, index) => {
    const adaptado = adaptarAvisoMetodologico(aviso);
    return {
      id: `met-${aviso.codigo}-${aviso.entidadId ?? aviso.opdId ?? index}`,
      testIdCodigo: aviso.codigo,
      severidad: clasificarSeveridad(aviso),
      codigo: etiquetaCodigo(aviso.codigo),
      mensaje: aviso.mensaje,
      destino: etiquetaDestinoMetodologico(modelo, aviso),
      cita: detalleCitaMetodologica(aviso),
      navegar: () => { if (adaptado) navegarAviso(adaptado); },
    };
  });
}

function detalleCitaMetodologica(aviso: AvisoMetodologico): string {
  return [
    aviso.ssotRef,
    aviso.rationale,
    ...(aviso.accionesSugeridas ?? []).map((accion) => `Accion: ${accion}`),
  ].filter(Boolean).join(" · ") || "SSOT OPM";
}

function adaptarAvisoMetodologico(aviso: AvisoMetodologico): Aviso | null {
  const destino = resolverDestino(aviso);
  if (!destino) return null;
  const adaptado: Aviso = {
    reglaId: aviso.codigo,
    severidad: aviso.severidad === "sugerencia" ? "info" : aviso.severidad,
    mensaje: aviso.mensaje,
    citaSSOT: aviso.ssotRef ?? "",
    elementoTipo: destino.tipo === "opd" ? "opd" : "entidad",
    elementoId: destino.id,
  };
  if (destino.opdId) adaptado.opdId = destino.opdId;
  return adaptado;
}

function resolverDestino(aviso: AvisoMetodologico): NavegacionAviso | null {
  if (aviso.navegarA) return aviso.navegarA;
  if (aviso.entidadId) {
    const destino: NavegacionAviso = { tipo: "entidad", id: aviso.entidadId };
    if (aviso.opdId) destino.opdId = aviso.opdId;
    return destino;
  }
  if (aviso.opdId) return { tipo: "opd", id: aviso.opdId };
  return null;
}

function severidadDesdeAviso(severidad: SeveridadAviso): SeveridadDiagnostico {
  if (severidad === "error") return "bloqueo";
  if (severidad === "advertencia") return "mejora";
  return "estilo";
}

function etiquetaElemento(modelo: Modelo, aviso: Aviso): string {
  if (aviso.elementoTipo === "entidad" && aviso.elementoId) {
    const entidad = modelo.entidades[aviso.elementoId];
    return entidad ? `${entidad.nombre} · ${entidad.id}` : aviso.elementoId;
  }
  if (aviso.elementoTipo === "enlace" && aviso.elementoId) {
    const enlace = modelo.enlaces[aviso.elementoId];
    if (!enlace) return aviso.elementoId;
    return `${nombreExtremo(modelo, enlace.origenId)} -> ${nombreExtremo(modelo, enlace.destinoId)} · ${enlace.id}`;
  }
  if (aviso.elementoTipo === "opd" && aviso.elementoId) return modelo.opds[aviso.elementoId]?.nombre ?? aviso.elementoId;
  return "Modelo";
}

function etiquetaDestinoMetodologico(modelo: Modelo, aviso: AvisoMetodologico): string {
  if (aviso.entidadId) return modelo.entidades[aviso.entidadId]?.nombre ?? aviso.entidadId;
  if (aviso.opdId) return modelo.opds[aviso.opdId]?.nombre ?? aviso.opdId;
  return "Modelo";
}

function etiquetaCodigo(codigo: CodigoChecker): string {
  return codigo.toLowerCase().replaceAll("_", " ");
}

function contadorStyle(issues: DiagnosticoIssue[]): preact.JSX.CSSProperties {
  const hayBloqueo = issues.some((issue) => issue.severidad === "bloqueo");
  const hayMejora = issues.some((issue) => issue.severidad === "mejora");
  return {
    ...style.count,
    color: issues.length === 0 ? tokens.colors.exitoTexto : hayBloqueo ? tokens.colors.errorTexto : hayMejora ? tokens.colors.alertaTexto : tokens.colors.textoSlate,
    background: issues.length === 0 ? tokens.colors.exitoFondo : hayBloqueo ? tokens.colors.errorFondoIntenso : hayMejora ? tokens.colors.advertenciaFondo : tokens.colors.fondoElevado,
  };
}

function filaStyle(meta: DiagnosticoMeta): preact.JSX.CSSProperties {
  return {
    ...style.row,
    borderColor: meta.borde,
    borderLeftColor: meta.color,
    background: meta.fondo,
  };
}

const style = {
  panelColapsado: {
    minHeight: 32,
    maxHeight: 32,
    overflow: "hidden",
    borderTop: `1px solid ${tokens.colors.bordeIntermedio}`,
    background: tokens.colors.fondoChrome,
    fontFamily: tokens.typography.familyChrome,
  },
  panelExpandido: {
    height: 200,
    overflow: "hidden",
    borderTop: `1px solid ${tokens.colors.bordeIntermedio}`,
    background: tokens.colors.fondoChrome,
    fontFamily: tokens.typography.familyChrome,
  },
  header: {
    minHeight: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    padding: "0 12px",
    borderBottom: `1px solid ${tokens.colors.bordeChrome}`,
    color: tokens.colors.textoPrimario,
    fontSize: 13,
    fontWeight: 700,
  },
  headerToggle: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    border: 0,
    background: "transparent",
    color: tokens.colors.textoPrimario,
    cursor: "pointer",
    fontFamily: tokens.typography.familyChrome,
    fontSize: 13,
    fontWeight: 700,
  },
  chevron: { width: 12, color: tokens.colors.textoTerciario },
  headerActions: { display: "inline-flex", alignItems: "center", gap: 8 },
  revalidar: {
    border: `1px solid ${tokens.colors.bordeSlate}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoChrome,
    color: tokens.colors.textoSlate,
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 7px",
  },
  count: {
    minWidth: 62,
    height: 20,
    borderRadius: 10,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 8px",
    fontSize: 11,
    fontWeight: 700,
  },
  cuerpo: {
    height: 168,
    minHeight: 0,
    overflow: "auto",
    padding: 8,
  },
  citaDetalle: {
    display: "flex",
    gap: 8,
    padding: "6px 8px",
    marginBottom: 8,
    border: `1px solid ${tokens.colors.infoBordeSuave}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.infoFondoAlterno,
    color: tokens.colors.textoSlate,
    fontSize: 11,
  },
  empty: {
    padding: 12,
    color: tokens.colors.exitoTexto,
    fontSize: 13,
    fontWeight: 700,
  },
  secciones: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 8,
  },
  seccion: { minWidth: 0, display: "grid", alignContent: "start", gap: 6 },
  seccionTitulo: { margin: 0, fontSize: 12, fontWeight: 800 },
  seccionEmpty: { margin: 0, color: tokens.colors.textoTerciario, fontSize: 12 },
  list: { display: "grid", gap: 6 },
  row: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: 6,
    border: `1px solid ${tokens.colors.bordeChrome}`,
    borderLeftWidth: 3,
    borderRadius: tokens.radii.sm,
    padding: 6,
    minWidth: 0,
  },
  filaResaltada: {
    outline: `2px solid ${tokens.colors.acentoUi}`,
    outlineOffset: "1px",
    boxShadow: tokens.shadows.popover,
  },
  rowMain: {
    display: "flex",
    alignItems: "flex-start",
    gap: 6,
    minWidth: 0,
    border: 0,
    padding: 0,
    background: "transparent",
    textAlign: "left",
    cursor: "pointer",
  },
  icon: { flex: "0 0 auto", width: 16, fontWeight: 900, textAlign: "center" },
  rowText: { display: "grid", gap: 2, minWidth: 0, color: tokens.colors.textoPrimario, fontSize: 12 },
  cita: {
    alignSelf: "start",
    border: `1px solid ${tokens.colors.bordeIntermedio}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoChrome,
    color: tokens.colors.textoSlate,
    cursor: "pointer",
    fontSize: 10,
    fontWeight: 800,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
