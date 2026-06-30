import { useEffect, useMemo, useState } from "preact/hooks";
import { useOpmStore } from "../store";
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

const META: Record<SeveridadDiagnostico, { titulo: string; icono: string; color: string }> = {
  bloqueo: {
    titulo: "Bloqueos",
    icono: "!",
    color: tokens.colors.errorTexto,
  },
  mejora: {
    titulo: "Mejoras",
    icono: "△",
    color: tokens.colors.alertaTexto,
  },
  estilo: {
    titulo: "Estilo",
    icono: "·",
    color: tokens.colors.textoSlate,
  },
};
type DiagnosticoMeta = (typeof META)[SeveridadDiagnostico];

interface PanelDiagnosticoProps {
  expandido?: boolean;
  onExpandidoChange?: (expandido: boolean) => void;
}

let codigoResaltadoGlobal: string | null = null;

export function PanelDiagnostico(props: PanelDiagnosticoProps = {}) {
  const [expandidoInterno, setExpandidoInterno] = useState(false);
  const expandido = props.expandido ?? expandidoInterno;
  const setExpandido = (actualizar: boolean | ((actual: boolean) => boolean)) => {
    const siguiente = typeof actualizar === "function" ? actualizar(expandido) : actualizar;
    if (props.expandido === undefined) setExpandidoInterno(siguiente);
    props.onExpandidoChange?.(siguiente);
  };
  const [revision, setRevision] = useState(0);
  const { avisos, navegarAviso } = useZustandDiagnosticsPort(revision);
  const [citaActiva, setCitaActiva] = useState<{ codigo: string; cita: string } | null>(null);
  const [codigoResaltado, setCodigoResaltado] = useState<string | null>(codigoResaltadoGlobal);

  // Modo apunte: el bit persistido del modelo activo es la única verdad (derivado
  // del índice, no un estado paralelo — corrección 2). En un apunte la validez OPM
  // se relaja a observación; la integridad sigue bloqueando (degradación por-clase).
  const esApunte = useOpmStore((s) => s.indice.modelos.some((m) => m.id === s.modelo.id && m.esApunte === true));
  const issues = useMemo(
    () => derivarIssuesDiagnostico(avisos, navegarAviso, { esApunte }),
    [avisos, navegarAviso, esApunte],
  );
  const grupos = useMemo(() => agruparIssuesDiagnostico(issues), [issues]);

  useEffect(() => {
    const abrirAviso = (event: Event) => {
      const detail = (event as CustomEvent<{ reglaId?: string }>).detail;
      if (!detail?.reglaId) return;
      codigoResaltadoGlobal = detail.reglaId;
      setExpandido(true);
      setCodigoResaltado(detail.reglaId);
      requestAnimationFrame(() => {
        document.querySelector<HTMLElement>(`[data-aviso-codigo="${detail.reglaId}"]`)?.scrollIntoView({ block: "nearest" });
      });
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
              revalidar
            </button>
          ) : null}
          <span style={contadorStyle(issues)}>{issues.length === 0 ? "sin sugerencias" : `△ ${issues.length} ${issues.length === 1 ? "sugerencia" : "sugerencias"}`}</span>
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
              <Seccion
                titulo={META.bloqueo.titulo}
                meta={META.bloqueo}
                issues={grupos.bloqueo}
                codigoResaltado={codigoResaltado}
                onCita={setCitaActiva}
                onNavegar={() => setExpandido(false)}
              />
              <Seccion
                titulo={META.mejora.titulo}
                meta={META.mejora}
                issues={grupos.mejora}
                codigoResaltado={codigoResaltado}
                onCita={setCitaActiva}
                onNavegar={() => setExpandido(false)}
              />
              <Seccion
                titulo={META.estilo.titulo}
                meta={META.estilo}
                issues={grupos.estilo}
                codigoResaltado={codigoResaltado}
                onCita={setCitaActiva}
                onNavegar={() => setExpandido(false)}
              />
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
  onNavegar: () => void;
}) {
  const total = props.issues.reduce((acc, grupo) => acc + grupo.instancias.length, 0);
  return (
    <section style={style.seccion}>
      <h3 style={style.seccionTitulo}>
        <span>{props.titulo}</span>
        <span style={style.seccionConteo}>· {total === 0 ? "ninguno" : total}</span>
      </h3>
      <div role="list" style={style.list}>
        {props.issues.map((grupo) => (
          <article
            key={grupo.id}
            data-testid={`aviso-${grupo.testIdCodigo}`}
            data-aviso-codigo={grupo.testIdCodigo}
            data-aviso-instancias={grupo.instancias.length}
            data-resaltado={props.codigoResaltado === grupo.testIdCodigo ? "true" : "false"}
            role="listitem"
            style={{ ...style.row, ...(props.codigoResaltado === grupo.testIdCodigo ? style.filaResaltada : {}) }}
          >
            <button
              type="button"
              data-testid={`aviso-navegar-${grupo.testIdCodigo}`}
              style={style.rowMain}
              onClick={() => {
                grupo.navegar();
                props.onNavegar();
              }}
              title="Ir al elemento"
            >
              <span aria-hidden="true" style={{ ...style.icon, color: props.meta.color }}>{props.meta.icono}</span>
              <span style={style.rowText}>
                <strong>
                  {grupo.titulo}
                  {grupo.instancias.length > 1 ? (
                    <span data-testid={`aviso-contador-${grupo.testIdCodigo}`} style={style.contadorGrupo}>
                      · {grupo.instancias.length}
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
              [cita]
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
  };
}

const style = {
  panelColapsado: {
    minHeight: 32,
    maxHeight: 32,
    overflow: "hidden",
    borderTop: 0,
    background: "transparent",
    fontFamily: tokens.typography.familyChrome,
  },
  panelExpandido: {
    height: "100%",
    minHeight: 200,
    overflow: "hidden",
    borderTop: 0,
    background: "transparent",
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
    background: "transparent",
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
    border: 0,
    borderRadius: 0,
    background: "transparent",
    color: tokens.colors.textoSlate,
    cursor: "pointer",
    fontFamily: tokens.typography.serif,
    fontSize: 12,
    fontStyle: "italic",
    fontWeight: 400,
    padding: 0,
  },
  count: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    border: 0,
    background: "transparent",
    fontSize: 11,
    fontWeight: 500,
  },
  cuerpo: {
    height: "calc(100% - 32px)",
    minHeight: 0,
    overflow: "auto",
    padding: "8px 12px",
  },
  citaDetalle: {
    display: "block",
    padding: "4px 0 4px 10px",
    marginBottom: 8,
    borderLeft: `1px solid ${tokens.colors.bordePanel}`,
    background: "transparent",
    color: tokens.colors.textoSlate,
    fontFamily: tokens.typography.serif,
    fontSize: 12,
    fontStyle: "italic",
  },
  empty: {
    padding: 12,
    color: tokens.colors.exitoTexto,
    fontSize: 13,
    fontWeight: 700,
  },
  secciones: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 10,
  },
  seccion: { minWidth: 0, display: "grid", alignContent: "start", gap: 6 },
  seccionTitulo: {
    margin: 0,
    color: tokens.colors.textoPrimario,
    fontFamily: tokens.typography.serif,
    fontSize: 12,
    fontWeight: 600,
  },
  seccionConteo: {
    marginLeft: 4,
    color: tokens.colors.textoTerciario,
    fontWeight: 400,
  },
  list: { display: "grid", gap: 4 },
  row: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: 6,
    border: 0,
    borderRadius: 0,
    background: "transparent",
    padding: "2px 0 2px 14px",
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
  icon: { flex: "0 0 auto", width: 12, fontWeight: 600, textAlign: "center" },
  rowText: { display: "grid", gap: 2, minWidth: 0, color: tokens.colors.textoPrimario, fontSize: 12 },
  contadorGrupo: {
    marginLeft: 4,
    padding: 0,
    color: tokens.colors.textoSlate,
    fontSize: 11,
    fontWeight: 400,
  },
  cita: {
    alignSelf: "start",
    border: 0,
    borderRadius: 0,
    background: "transparent",
    color: tokens.colors.textoSlate,
    cursor: "pointer",
    fontFamily: tokens.typography.serif,
    fontSize: 11,
    fontStyle: "italic",
    fontWeight: 400,
    padding: 0,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
