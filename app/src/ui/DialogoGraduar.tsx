// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { Id } from "../modelo/tipos";
import { listarAvisosDiagnostico } from "../modelo/diagnostico";
import { opdsSueltos } from "../modelo/opdSueltos";
import { validarReferenciasOpd } from "../serializacion/validarIntegridad";
import { useOpmStore } from "../store";
import {
  derivarIssuesDiagnostico,
  severidadDiagnostico,
  type SeveridadDiagnostico,
} from "../app/viewmodels/panelDiagnosticoViewModel";
import { deriveEntryIntent, runTutorPolicy } from "../tutor";
import { Dialogo, DialogoAccion } from "./Dialogo";
import { tokens } from "./tokens";
import { TutorInterventionDetails, mapearLentesTutor } from "./TutorDetails";

/**
 * «Momento de graduación» (diseño §3, R-OPD-REF-15). Un apunte se gradúa a modelo:
 * se le da el nombre definitivo y una carpeta, y se le exige la validez que como
 * apunte estaba en observación. El reporte de validez muestra las mismas señales del
 * diagnóstico pero con su severidad REAL (`severidadDiagnostico(aviso, {esApunte:false})`
 * vía `derivarIssuesDiagnostico`), para que el usuario vea qué compromete el cierre
 * ANTES de graduar. La integridad bloquea; Bocetos y deuda de cierre pueden
 * asumirse de forma explícita como pendientes.
 */
export function DialogoGraduar() {
  const modeloId = useOpmStore((s) => s.dialogoGraduarModeloId);
  const modelo = useOpmStore((s) => s.graduacionModeloObjetivo);
  const destino = useOpmStore((s) => s.graduacionDestino);
  const carpetas = useOpmStore((s) => s.indice.carpetas);
  const carpetaModelo = useOpmStore((s) => s.graduacionCarpetaObjetivo);
  const modeloPersistidoId = useOpmStore((s) => s.modeloPersistidoId);
  const navegarAviso = useOpmStore((s) => s.navegarAviso);
  const cerrarGraduar = useOpmStore((s) => s.cerrarGraduar);
  const confirmarGraduacion = useOpmStore((s) => s.confirmarGraduacion);
  const graduacionEnCurso = useOpmStore((s) => s.graduacionEnCurso);
  const graduacionError = useOpmStore((s) => s.graduacionError);

  const abierto = modeloId !== null;
  const preparado = modelo !== null;
  const esBiblioteca = destino === "biblioteca";
  const inputRef = useRef<HTMLInputElement>(null);
  const [nombre, setNombre] = useState(modelo?.nombre ?? "");
  const [carpetaId, setCarpetaId] = useState<Id | null>(carpetaModelo);

  useEffect(() => {
    if (!abierto) return;
    setNombre(modelo?.nombre ?? "");
    setCarpetaId(carpetaModelo);
  }, [abierto, modelo?.nombre, carpetaModelo]);

  // Validez EXIGIBLE: las señales del diagnóstico con su severidad real (como si
  // ya fuera modelo). Lo que en apunte era observación aquí aparece como bloqueo/mejora.
  const cierre = useMemo(
    () => {
      if (!modelo) {
        return {
          integridad: [],
          bloqueosCierre: [],
          mejoras: [],
          bocetos: [],
        };
      }
      const puedeNavegar = modeloPersistidoId === modeloId;
      const avisos = listarAvisosDiagnostico(modelo, { tipo: "modelo" });
      const issues = derivarIssuesDiagnostico(
        avisos,
        navegarAviso,
        { esApunte: false },
      )
        .filter((issue) => issue.severidad === "bloqueo" || issue.severidad === "mejora")
        .map((issue) => puedeNavegar ? issue : { ...issue, navegable: false });
      const idsIntegridad = new Set(avisos
        .filter((aviso) =>
          severidadDiagnostico(aviso, { esApunte: false }) === "bloqueo" &&
          severidadDiagnostico(aviso, { esApunte: true }) === "bloqueo"
        )
        .map((aviso) => aviso.id));
      return {
        integridad: issues.filter((issue) => issue.severidad === "bloqueo" && idsIntegridad.has(issue.id)),
        bloqueosCierre: issues.filter((issue) => issue.severidad === "bloqueo" && !idsIntegridad.has(issue.id)),
        mejoras: issues.filter((issue) => issue.severidad === "mejora"),
        bocetos: opdsSueltos(modelo),
      };
    },
    [modelo, modeloId, modeloPersistidoId, navegarAviso],
  );
  const pendientesFormales = cierre.bloqueosCierre.length + cierre.mejoras.length + cierre.bocetos.length;
  const integridadReferencial = useMemo(
    () => modelo ? validarReferenciasOpd(modelo) : { ok: true as const, value: true as const },
    [modelo],
  );
  const bloqueosIntegridad = integridadReferencial.ok ? cierre.integridad.length : 1;
  const hayPendientes = bloqueosIntegridad + pendientesFormales > 0;

  const carpetasVivas = useMemo(
    () => carpetas.filter((c) => !c.archivada).sort((a, b) => a.nombre.localeCompare(b.nombre, "es-CL")),
    [carpetas],
  );

  const nombreValido = nombre.trim().length > 0;
  const intentId = `lifecycle:${modeloId ?? "none"}:${esBiblioteca ? "graduate-library" : "graduate"}`;
  const intervencionTutor = runTutorPolicy(deriveEntryIntent({
    intentId,
    focus: "lifecycle",
    transition: esBiblioteca ? "graduate-library" : "graduate",
    factsPreserved: true,
    activeLenses: mapearLentesTutor(modelo?.lentesConocimiento ?? []),
  }), [{ owner: "product", intentId }]);
  const graduar = () => {
    if (modeloId === null) return;
    confirmarGraduacion({
      modeloId,
      nombre,
      carpetaId,
      bloqueos: cierre.bloqueosCierre.length,
      mejoras: cierre.mejoras.length,
      bocetos: cierre.bocetos.length,
    });
  };

  return (
    <Dialogo
      open={abierto}
      title={esBiblioteca ? "Graduar y marcar Biblioteca" : "Graduar Apunte a Modelo"}
      onCancel={cerrarGraduar}
      initialFocusRef={inputRef}
      size="lg"
      testId="dialogo-graduar"
      actions={(
        <>
          <DialogoAccion disabled={graduacionEnCurso && preparado} onClick={cerrarGraduar}>
            {hayPendientes ? "Seguir en Taller y corregir" : "Cancelar"}
          </DialogoAccion>
          <DialogoAccion
            tono="primaria"
            testId="graduar-confirmar"
            tutorEntrypoint={esBiblioteca ? "workspace:graduate-library" : "workspace:graduate-model"}
            disabled={!preparado || !nombreValido || graduacionEnCurso || bloqueosIntegridad > 0}
            onClick={graduar}
          >
            {graduacionEnCurso
              ? (preparado ? "Graduando…" : "Preparando…")
              : bloqueosIntegridad > 0
                ? "Corrige la integridad para graduar"
                : pendientesFormales > 0
                  ? esBiblioteca ? "Graduar con pendientes y marcar Biblioteca" : "Graduar con pendientes"
                  : esBiblioteca ? "Graduar y marcar Biblioteca" : "Graduar a Modelo"}
          </DialogoAccion>
        </>
      )}
    >
      <div style={style.container}>
        <TutorInterventionDetails intervention={intervencionTutor} testId="tutor-dialogo-graduar" />
        <p style={style.intro} data-tutor-surface-owner="product" data-tutor-intent={intentId}>
          {esBiblioteca
            ? "Dejará de ser Apunte y quedará como Modelo de Biblioteca. Los hechos no cambian. Si luego quitas el rol Biblioteca, volverá a Modelo de Trabajo, no a Apunte."
            : "Al graduar cambia el rigor, no los hechos."}
        </p>

        <div style={style.contratos}>
          <section style={style.contrato}>
            <h3 style={style.contratoTitulo}>Se vuelve exigible</h3>
            <p style={style.contratoTexto}>Validez de cierre · nombre definitivo · ubicación explícita.</p>
          </section>
          <section style={style.contrato}>
            <h3 style={style.contratoTitulo}>No cambia</h3>
            <p style={style.contratoTexto}>ID · entidades · enlaces · OPDs · OPL · Bocetos.</p>
          </section>
        </div>

        <label style={style.label}>
          <span>Nombre definitivo</span>
          <input
            ref={inputRef}
            aria-label="Nombre definitivo"
            data-testid="graduar-nombre"
            style={style.input}
            value={nombre}
            disabled={!preparado || graduacionEnCurso}
            aria-invalid={!nombreValido}
            onInput={(event) => setNombre(event.currentTarget.value)}
          />
          {!nombreValido ? <span role="alert" style={style.errorCampo}>El nombre no puede quedar vacío.</span> : null}
        </label>

        <label style={style.label}>
          <span>Carpeta</span>
          <select
            aria-label="Carpeta"
            data-testid="graduar-carpeta"
            style={style.input}
            value={carpetaId ?? ""}
            disabled={!preparado || graduacionEnCurso}
            onChange={(event) => {
              const value = event.currentTarget.value;
              setCarpetaId(value === "" ? null : value);
            }}
          >
            <option value="">Sin carpeta</option>
            {carpetasVivas.map((carpeta) => (
              <option key={carpeta.id} value={carpeta.id}>{carpeta.nombre}</option>
            ))}
          </select>
        </label>

        <section style={style.reporte} data-testid="graduar-integridad">
          <h3 style={style.reporteTitulo}>1. Integridad · {bloqueosIntegridad === 0 ? "íntegra" : `${bloqueosIntegridad} bloqueo${bloqueosIntegridad === 1 ? "" : "s"}`}</h3>
          {!integridadReferencial.ok ? (
            <p role="alert" style={style.errorOperacion}>
              Referencias del modelo: {integridadReferencial.error}
            </p>
          ) : cierre.integridad.length === 0 ? (
            <p style={style.reporteVacio} data-testid="graduar-validez-vacio">
              Sin referencias o estructura inválidas detectadas.
            </p>
          ) : (
            <ListaIssues issues={cierre.integridad} onNavigate={cerrarGraduar} />
          )}
        </section>
        <section style={style.reporte} data-testid="graduar-integracion">
          <h3 style={style.reporteTitulo}>2. Integración · {cierre.bocetos.length} Boceto{cierre.bocetos.length === 1 ? "" : "s"}</h3>
          <p style={style.reporteVacio}>
            {cierre.bocetos.length === 0
              ? "Todos los OPD están integrados en el árbol."
              : `Aún fuera del árbol: ${cierre.bocetos.map((opd) => opd.nombre).join(", ")}.`}
          </p>
        </section>
        <section style={style.reporte} data-testid="graduar-validez">
          <h3 style={style.reporteTitulo}>
            3. Cierre formal OPM · {cierre.bloqueosCierre.length} bloqueo{cierre.bloqueosCierre.length === 1 ? "" : "s"} · {cierre.mejoras.length} mejora{cierre.mejoras.length === 1 ? "" : "s"}
          </h3>
          {cierre.bloqueosCierre.length + cierre.mejoras.length === 0 ? (
            <p style={style.reporteVacio}>Sin pendientes formales en el diagnóstico actual.</p>
          ) : (
            <ListaIssues issues={[...cierre.bloqueosCierre, ...cierre.mejoras]} onNavigate={cerrarGraduar} />
          )}
        </section>
        <section style={style.reporte} data-testid="graduar-validacion-humana">
          <h3 style={style.reporteTitulo}>4. Validación humana · no registrada</h3>
          <p style={style.reporteVacio}>
            Graduar reconoce el régimen formal del documento; no certifica, aprueba ni sustituye la revisión de una persona o autoridad de dominio.
          </p>
        </section>
        {graduacionError ? (
          <p role="alert" aria-live="assertive" data-testid="graduar-error" style={style.errorOperacion}>
            {graduacionError}
          </p>
        ) : null}
      </div>
    </Dialogo>
  );
}

function ListaIssues(props: {
  issues: ReturnType<typeof derivarIssuesDiagnostico>;
  onNavigate: () => void;
}) {
  return (
    <ul style={style.reporteLista}>
      {props.issues.map((issue) => (
        <li key={issue.id} style={style.reporteItem} data-severidad={issue.severidad}>
          <span style={{ ...style.marca, color: colorSeveridad(issue.severidad) }} aria-hidden="true">
            {glifoSeveridad(issue.severidad)}
          </span>
          {issue.navegable ? (
            <button
              type="button"
              style={style.issueNavegable}
              onClick={() => {
                props.onNavigate();
                requestAnimationFrame(issue.navegar);
              }}
            >
              {issue.titulo} · Ir al elemento
            </button>
          ) : <span style={style.reporteTexto}>{issue.titulo}</span>}
        </li>
      ))}
    </ul>
  );
}

function colorSeveridad(severidad: SeveridadDiagnostico): string {
  if (severidad === "bloqueo") return tokens.colors.errorTexto;
  if (severidad === "mejora") return tokens.colors.alertaTexto;
  return tokens.colors.textoSlate;
}

function glifoSeveridad(severidad: SeveridadDiagnostico): string {
  if (severidad === "bloqueo") return "!";
  if (severidad === "mejora") return "△";
  return "·";
}

const style = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  intro: {
    margin: 0,
    color: tokens.colors.inkMid,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "13px",
    lineHeight: 1.5,
  },
  contratos: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "14px",
  },
  contrato: {
    display: "grid",
    alignContent: "start",
    gap: "4px",
    paddingTop: "8px",
    borderTop: `${tokens.stroke.hairline}px solid ${tokens.colors.rule}`,
  },
  contratoTitulo: {
    margin: 0,
    color: tokens.colors.ink,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12.5px",
    fontWeight: 600,
  },
  contratoTexto: {
    margin: 0,
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12px",
    lineHeight: 1.4,
  },
  label: {
    display: "grid",
    gap: "6px",
    color: tokens.colors.ink70,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "13px",
    fontWeight: 400,
  },
  input: {
    height: "34px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ruleStrong}`,
    borderRadius: 0,
    padding: "0 10px",
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "13px",
    caretColor: tokens.colors.crimson,
  },
  errorCampo: {
    color: tokens.colors.errorTexto,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12px",
  },
  reporte: {
    display: "grid",
    gap: "8px",
    paddingTop: "8px",
    borderTop: `${tokens.stroke.hairline}px solid ${tokens.colors.rule}`,
  },
  reporteTitulo: {
    margin: 0,
    color: tokens.colors.ink,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "13px",
    fontWeight: 600,
  },
  reporteVacio: {
    margin: 0,
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12.5px",
  },
  reporteLista: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "grid",
    gap: "6px",
    maxHeight: "220px",
    overflow: "auto",
  },
  reporteItem: {
    display: "grid",
    gridTemplateColumns: "16px 1fr",
    alignItems: "baseline",
    gap: "8px",
    color: tokens.colors.inkMid,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12.5px",
    lineHeight: 1.45,
  },
  marca: {
    fontFamily: tokens.typography.mono,
    fontWeight: 600,
    textAlign: "center" as const,
  },
  reporteTexto: {
    minWidth: 0,
  },
  issueNavegable: {
    minWidth: 0,
    border: 0,
    borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.ruleStrong}`,
    padding: 0,
    background: "transparent",
    color: tokens.colors.inkMid,
    font: "inherit",
    textAlign: "left",
    cursor: "pointer",
  },
  errorOperacion: {
    margin: 0,
    color: tokens.colors.errorTexto,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12.5px",
    lineHeight: 1.4,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
