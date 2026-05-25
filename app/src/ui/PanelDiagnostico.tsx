import { useEffect, useMemo, useState } from "preact/hooks";
import { useZustandDiagnosticsPort } from "../app/ports/zustandDiagnosticsPort";
import {
  agruparIssuesDiagnostico,
  derivarIssuesDiagnostico,
  type DiagnosticoIssue,
  type DiagnosticoIssueAgrupado,
  type SeveridadDiagnostico,
} from "../app/viewmodels/panelDiagnosticoViewModel";
import { EVENTO_ABRIR_AVISO_DIAGNOSTICO } from "../app/ports/feedbackPort";
import { tokens } from "./tokens";

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
  const [expandido, setExpandido] = useState(false);
  const [revision, setRevision] = useState(0);
  const { avisos, navegarAviso } = useZustandDiagnosticsPort(revision);
  const [citaActiva, setCitaActiva] = useState<{ codigo: string; cita: string } | null>(null);
  const [codigoResaltado, setCodigoResaltado] = useState<string | null>(null);

  const issues = useMemo(() => derivarIssuesDiagnostico(avisos, navegarAviso), [avisos, navegarAviso]);
  const grupos = useMemo(() => agruparIssuesDiagnostico(issues), [issues]);

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
          <span style={contadorStyle(issues)}>{issues.length === 1 ? "1 sugerencia" : `${issues.length} sugerencias`}</span>
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
              {/* Ronda24/L1 #2: badge SSOT decorativo eliminado del header
                  del detalle. El contenedor sigue identificado por su
                  data-testid; la cita en sí es autodescriptiva. */}
              <span data-testid={`aviso-detalle-${citaActiva.codigo}`}>{citaActiva.cita}</span>
            </div>
          ) : null}
          {issues.length === 0 ? (
            <div style={style.empty}>Modelo sin sugerencias metodológicas</div>
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
  issues: DiagnosticoIssueAgrupado[];
  codigoResaltado: string | null;
  onCita: (detalle: { codigo: string; cita: string }) => void;
}) {
  const total = props.issues.reduce((acc, grupo) => acc + grupo.instancias.length, 0);
  return (
    <section style={style.seccion}>
      <h3 style={{ ...style.seccionTitulo, color: props.meta.color }}>
        {props.titulo} ({total})
      </h3>
      {props.issues.length === 0 ? <p style={style.seccionEmpty}>Sin sugerencias en este grupo</p> : null}
      <div role="list" style={style.list}>
        {props.issues.map((grupo) => (
          <article
            key={grupo.id}
            data-testid={`aviso-${grupo.testIdCodigo}`}
            data-aviso-codigo={grupo.testIdCodigo}
            data-aviso-instancias={grupo.instancias.length}
            data-resaltado={props.codigoResaltado === grupo.testIdCodigo ? "true" : "false"}
            role="listitem"
            style={{ ...filaStyle(props.meta), ...(props.codigoResaltado === grupo.testIdCodigo ? style.filaResaltada : {}) }}
          >
            <button
              type="button"
              data-testid={`aviso-navegar-${grupo.testIdCodigo}`}
              style={style.rowMain}
              onClick={grupo.navegar}
              title="Ir al elemento"
            >
              <span aria-hidden="true" style={{ ...style.icon, color: props.meta.color }}>{props.meta.icono}</span>
              <span style={style.rowText}>
                <strong>
                  {grupo.titulo}
                  {grupo.instancias.length > 1 ? (
                    <span data-testid={`aviso-contador-${grupo.testIdCodigo}`} style={style.contadorGrupo}>
                      {grupo.instancias.length}
                    </span>
                  ) : null}
                </strong>
                <span>{grupo.mensaje}</span>
                <small>{etiquetaDestinos(grupo)}</small>
              </span>
            </button>
            <button
              type="button"
              data-testid={`aviso-cita-${grupo.testIdCodigo}`}
              style={style.cita}
              onClick={() => props.onCita({ codigo: grupo.testIdCodigo, cita: grupo.cita })}
              title={`Cita SSOT: ${grupo.cita}`}
              aria-label={`Cita SSOT: ${grupo.cita}`}
            >
              {/* Ronda24/L1 #2: el label visible pasa de "SSOT" (jerga
                  interna) a "Cita" — humano. El title y aria-label
                  preservan la referencia SSOT como contrato técnico. */}
              Cita
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function etiquetaDestinos(grupo: DiagnosticoIssueAgrupado): string {
  if (grupo.instancias.length === 1) return grupo.destino;
  const destinosUnicos: string[] = [];
  for (const instancia of grupo.instancias) {
    if (!destinosUnicos.includes(instancia.destino)) destinosUnicos.push(instancia.destino);
    if (destinosUnicos.length >= 3) break;
  }
  const resto = grupo.instancias.length - destinosUnicos.length;
  return resto > 0 ? `${destinosUnicos.join(", ")} y ${resto} más` : destinosUnicos.join(", ");
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
    borderTop: `1px solid ${tokens.colors.bordePanel}`,
    background: tokens.colors.fondoPanel,
    fontFamily: tokens.typography.familyChrome,
  },
  panelExpandido: {
    height: 200,
    overflow: "hidden",
    borderTop: `1px solid ${tokens.colors.bordePanel}`,
    background: tokens.colors.fondoPanel,
    fontFamily: tokens.typography.familyChrome,
  },
  header: {
    minHeight: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    padding: "0 12px",
    borderBottom: `1px solid ${tokens.colors.bordePanel}`,
    background: tokens.colors.fondoPanelSuave,
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
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoElevado,
    color: tokens.colors.textoSlate,
    cursor: "pointer",
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 7px",
  },
  count: {
    minWidth: 62,
    height: 20,
    // Codex L6 (S-02): chrome a radius cero; el contador no es píldora.
    borderRadius: tokens.radii.none,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 8px",
    border: `1px solid ${tokens.colors.bordePanel}`,
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
    borderRadius: tokens.radii.md,
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
    borderRadius: tokens.radii.md,
    padding: 6,
    minWidth: 0,
  },
  filaResaltada: {
    // Codex L6 (S-01): el foco se marca solo con outline crimson, sin sombra.
    outline: `2px solid ${tokens.colors.acentoUi}`,
    outlineOffset: "1px",
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
  contadorGrupo: {
    marginLeft: 6,
    padding: "0 6px",
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoElevado,
    border: `1px solid ${tokens.colors.bordeChrome}`,
    color: tokens.colors.textoSlate,
    fontSize: 10,
    fontWeight: 700,
  },
  cita: {
    alignSelf: "start",
    border: `1px solid ${tokens.colors.bordeIntermedio}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoElevado,
    color: tokens.colors.textoSlate,
    cursor: "pointer",
    fontSize: 10,
    fontWeight: 800,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
