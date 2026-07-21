import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { useOpmStore } from "../store";
import { useZustandDiagnosticsPort } from "../app/ports/zustandDiagnosticsPort";
import {
  agruparIssuesDiagnostico,
  derivarIssuesDiagnostico,
  resumirDeltaDiagnostico,
  resumirPanelDiagnostico,
  type DiagnosticoIssue,
  type DiagnosticoIssueAgrupado,
  type SeveridadDiagnostico,
} from "../app/viewmodels/panelDiagnosticoViewModel";
import { EVENTO_ABRIR_AVISO_DIAGNOSTICO } from "../app/ports/feedbackPort";
import { tokens } from "./tokens";

const META: Record<SeveridadDiagnostico, { titulo: string; icono: string; color: string }> = {
  bloqueo: { titulo: "Bloqueos", icono: "!", color: tokens.colors.errorTexto },
  mejora: { titulo: "Mejoras", icono: "△", color: tokens.colors.alertaTexto },
  estilo: { titulo: "Estilo y legibilidad", icono: "·", color: tokens.colors.textoSlate },
};
type DiagnosticoMeta = (typeof META)[SeveridadDiagnostico];

interface PanelDiagnosticoProps {
  expandido?: boolean;
  onExpandidoChange?: (expandido: boolean) => void;
}

/** Marginalia reactiva del OPD activo. La severidad, el criterio y la acción
 * permanecen juntos: el panel no exige una revalidación manual ni separa la
 * explicación del hallazgo que la originó. */
export function PanelDiagnostico(props: PanelDiagnosticoProps = {}) {
  const [expandidoInterno, setExpandidoInterno] = useState(false);
  const [codigoResaltado, setCodigoResaltado] = useState<string | null>(null);
  const expandido = props.expandido ?? expandidoInterno;
  const setExpandido = (actualizar: boolean | ((actual: boolean) => boolean)) => {
    const siguiente = typeof actualizar === "function" ? actualizar(expandido) : actualizar;
    if (props.expandido === undefined) setExpandidoInterno(siguiente);
    props.onExpandidoChange?.(siguiente);
  };
  const { avisos, navegarAviso } = useZustandDiagnosticsPort();
  const esApunte = useOpmStore((s) => s.indice.modelos.some((item) => item.id === s.modelo.id && item.esApunte === true));
  const issues = useMemo(
    () => derivarIssuesDiagnostico(avisos, navegarAviso, { esApunte }),
    [avisos, navegarAviso, esApunte],
  );
  const grupos = useMemo(() => agruparIssuesDiagnostico(issues), [issues]);
  const resumen = useMemo(() => resumirPanelDiagnostico(issues), [issues]);
  useEffect(() => {
    const abrirAviso = (event: Event) => {
      const detail = (event as CustomEvent<{ reglaId?: string }>).detail;
      if (!detail?.reglaId) return;
      if (props.expandido === undefined) setExpandidoInterno(true);
      props.onExpandidoChange?.(true);
      setCodigoResaltado(detail.reglaId);
      requestAnimationFrame(() => {
        document.querySelector<HTMLElement>(`[data-aviso-codigo="${detail.reglaId}"]`)?.scrollIntoView({ block: "nearest" });
      });
    };
    window.addEventListener(EVENTO_ABRIR_AVISO_DIAGNOSTICO, abrirAviso);
    return () => window.removeEventListener(EVENTO_ABRIR_AVISO_DIAGNOSTICO, abrirAviso);
  }, [props.expandido, props.onExpandidoChange]);

  useEffect(() => {
    if (codigoResaltado && !issues.some((issue) => issue.testIdCodigo === codigoResaltado)) {
      setCodigoResaltado(null);
    }
  }, [codigoResaltado, issues]);

  return (
    <aside
      data-testid="panel-diagnostico"
      data-tutor-capability="cap.diagnostic.reactive"
      data-expandido={expandido ? "true" : "false"}
      data-severidad-dominante={resumen.dominante}
      aria-label="Diagnóstico del OPD activo"
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
          <span style={style.headerTitle}>Diagnóstico</span>
        </button>
        <span
          aria-label={resumen.ariaLabel}
          title={resumen.ariaLabel}
          style={contadorStyle(resumen.dominante)}
        >
          {resumen.texto}
        </span>
      </header>
      {expandido ? (
        <div id="panel-diagnostico-cuerpo" style={style.cuerpo}>
          {issues.length === 0 ? (
            <div style={style.empty}>Sin hallazgos en este OPD.</div>
          ) : (
            <div style={style.secciones}>
              <Seccion
                titulo={META.bloqueo.titulo}
                meta={META.bloqueo}
                issues={grupos.bloqueo}
                codigoResaltado={codigoResaltado}
                onNavegar={() => setExpandido(false)}
              />
              <Seccion
                titulo={META.mejora.titulo}
                meta={META.mejora}
                issues={grupos.mejora}
                codigoResaltado={codigoResaltado}
                onNavegar={() => setExpandido(false)}
              />
              <Seccion
                titulo={esApunte ? "Observaciones" : META.estilo.titulo}
                meta={META.estilo}
                issues={grupos.estilo}
                codigoResaltado={codigoResaltado}
                onNavegar={() => setExpandido(false)}
              />
            </div>
          )}
        </div>
      ) : null}
    </aside>
  );
}

/** Vive aunque el panel visual tenga cero issues, para observar el delta
 * inicial 0→N sin montar una segunda voz diagnóstica. */
export function AnunciadorDeltaDiagnostico() {
  const [anuncio, setAnuncio] = useState("");
  const idsPreviosRef = useRef<readonly string[]>([]);
  const { avisos, navegarAviso } = useZustandDiagnosticsPort();
  const esApunte = useOpmStore((s) => s.indice.modelos.some((item) => item.id === s.modelo.id && item.esApunte === true));
  const ids = useMemo(
    () => derivarIssuesDiagnostico(avisos, navegarAviso, { esApunte }).map((issue) => issue.id).sort(),
    [avisos, navegarAviso, esApunte],
  );
  const firma = JSON.stringify(ids);

  useEffect(() => {
    const anteriores = idsPreviosRef.current;
    idsPreviosRef.current = ids;
    setAnuncio(resumirDeltaDiagnostico(anteriores, ids));
  }, [firma]);

  return (
    <span
      data-testid="diagnostico-delta-live"
      aria-live="polite"
      aria-atomic="true"
      style={style.srOnly}
    >
      {anuncio}
    </span>
  );
}

function Seccion(props: {
  titulo: string;
  meta: DiagnosticoMeta;
  issues: DiagnosticoIssueAgrupado[];
  codigoResaltado: string | null;
  onNavegar: () => void;
}) {
  if (props.issues.length === 0) return null;
  const total = props.issues.reduce((acc, grupo) => acc + grupo.instancias.length, 0);
  return (
    <section style={style.seccion}>
      <h3 style={style.seccionTitulo}>
        <span>{props.titulo}</span>
        <span style={style.seccionConteo}>· {total}</span>
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
            style={{
              ...style.row,
              borderLeftColor: props.meta.color,
              ...(props.codigoResaltado === grupo.testIdCodigo ? style.filaResaltada : {}),
            }}
          >
            <div style={style.rowHeading}>
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
                {grupo.instancias.length === 1 ? <span>{grupo.mensaje}</span> : null}
              </span>
            </div>
            <div style={style.instancias}>
              {grupo.instancias.map((instancia, index) => (
                <Instancia
                  key={instancia.id}
                  instancia={instancia}
                  mostrarMensaje={grupo.instancias.length > 1}
                  testId={index === 0
                    ? `aviso-navegar-${grupo.testIdCodigo}`
                    : `aviso-navegar-${grupo.testIdCodigo}-${index + 1}`}
                  onNavegar={props.onNavegar}
                />
              ))}
            </div>
            <Criterio grupo={grupo} />
          </article>
        ))}
      </div>
    </section>
  );
}

function Instancia(props: {
  instancia: DiagnosticoIssue;
  mostrarMensaje: boolean;
  testId: string;
  onNavegar: () => void;
}) {
  return (
    <div style={style.instancia}>
      {props.mostrarMensaje ? <span>{props.instancia.mensaje}</span> : null}
      {props.instancia.navegable ? (
        <button
          type="button"
          data-testid={props.testId}
          style={style.navegar}
          onClick={() => {
            props.instancia.navegar();
            props.onNavegar();
          }}
          title={`Ir a ${props.instancia.destino}`}
        >
          Ir a {props.instancia.destino}
        </button>
      ) : (
        <small style={style.destino}>{props.instancia.destino}</small>
      )}
    </div>
  );
}

function Criterio({ grupo }: { grupo: DiagnosticoIssueAgrupado }) {
  return (
    <details style={style.criterio}>
      <summary
        data-testid={`aviso-cita-${grupo.testIdCodigo}`}
        title={`Criterio: ${grupo.fuente}`}
        style={style.criterioSummary}
      >
        Criterio
      </summary>
      <div data-testid={`aviso-detalle-${grupo.testIdCodigo}`} style={style.criterioDetalle}>
        <p style={style.criterioBloque}>
          <strong style={style.criterioLabel}>Fuente</strong>
          <span>{grupo.fuente}</span>
        </p>
        {grupo.fundamento ? (
          <p style={style.criterioBloque}>
            <strong style={style.criterioLabel}>Por qué importa</strong>
            <span>{grupo.fundamento}</span>
          </p>
        ) : null}
        {grupo.acciones.length > 0 ? (
          <div style={style.criterioBloque}>
            <strong style={style.criterioLabel}>Qué puedes hacer</strong>
            <ul style={style.acciones}>
              {grupo.acciones.map((accion) => <li key={accion}>{accion}</li>)}
            </ul>
          </div>
        ) : null}
      </div>
    </details>
  );
}

function contadorStyle(dominante: SeveridadDiagnostico | "sin-hallazgos"): preact.JSX.CSSProperties {
  const color = dominante === "sin-hallazgos"
    ? tokens.colors.exitoTexto
    : dominante === "bloqueo"
      ? tokens.colors.errorTexto
      : dominante === "mejora"
        ? tokens.colors.alertaTexto
        : tokens.colors.textoSlate;
  return { ...style.count, color };
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
    minWidth: 0,
    minHeight: 24,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    border: 0,
    padding: 0,
    background: "transparent",
    color: tokens.colors.textoPrimario,
    cursor: "pointer",
    fontFamily: tokens.typography.familyChrome,
    fontSize: 13,
    fontWeight: 700,
  },
  headerTitle: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  chevron: { width: 12, flex: "0 0 auto", color: tokens.colors.textoTerciario },
  count: {
    flex: "0 0 auto",
    display: "inline-flex",
    alignItems: "center",
    whiteSpace: "nowrap",
    fontSize: 11,
    fontWeight: 500,
  },
  cuerpo: {
    height: "calc(100% - 32px)",
    minHeight: 0,
    overflow: "auto",
    padding: "10px 12px 16px",
  },
  empty: { padding: "8px 0", color: tokens.colors.exitoTexto, fontSize: 12, fontWeight: 600 },
  secciones: { display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 14 },
  seccion: { minWidth: 0, display: "grid", alignContent: "start", gap: 7 },
  seccionTitulo: {
    margin: 0,
    color: tokens.colors.textoPrimario,
    fontFamily: tokens.typography.serif,
    fontSize: 12,
    fontWeight: 600,
  },
  seccionConteo: { marginLeft: 4, color: tokens.colors.textoTerciario, fontWeight: 400 },
  list: { display: "grid", gap: 10 },
  row: {
    display: "grid",
    gap: 6,
    minWidth: 0,
    padding: "2px 0 4px 10px",
    borderLeft: `1px solid ${tokens.colors.bordePanel}`,
    background: "transparent",
  },
  filaResaltada: { outline: `2px solid ${tokens.colors.acentoUi}`, outlineOffset: "2px" },
  rowHeading: { display: "flex", alignItems: "flex-start", gap: 6, minWidth: 0 },
  icon: { flex: "0 0 auto", width: 12, fontWeight: 700, textAlign: "center" },
  rowText: { display: "grid", gap: 3, minWidth: 0, color: tokens.colors.textoPrimario, fontSize: 12, lineHeight: 1.35 },
  contadorGrupo: { marginLeft: 4, color: tokens.colors.textoSlate, fontSize: 11, fontWeight: 400 },
  instancias: { display: "grid", gap: 7, paddingLeft: 18 },
  instancia: { display: "grid", gap: 3, color: tokens.colors.textoPrimario, fontSize: 12, lineHeight: 1.35 },
  navegar: {
    justifySelf: "start",
    minHeight: 24,
    border: 0,
    padding: 0,
    background: "transparent",
    color: tokens.colors.textoSlate,
    cursor: "pointer",
    fontFamily: tokens.typography.serif,
    fontSize: 11,
    fontStyle: "italic",
    textAlign: "left",
  },
  destino: { color: tokens.colors.textoTerciario, fontFamily: tokens.typography.serif, fontStyle: "italic" },
  criterio: { marginLeft: 18, color: tokens.colors.textoSlate, fontFamily: tokens.typography.serif, fontSize: 11 },
  criterioSummary: { minHeight: 24, display: "flex", alignItems: "center", cursor: "pointer", fontStyle: "italic" },
  criterioDetalle: { display: "grid", gap: 7, padding: "2px 0 4px 10px", borderLeft: `1px solid ${tokens.colors.bordePanel}` },
  criterioBloque: { display: "grid", gap: 2, margin: 0, lineHeight: 1.35 },
  criterioLabel: { color: tokens.colors.textoPrimario, fontFamily: tokens.typography.familyChrome, fontSize: 10, fontStyle: "normal" },
  acciones: { display: "grid", gap: 3, margin: 0, paddingLeft: 16 },
  srOnly: {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
