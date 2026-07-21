// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { Id } from "../modelo/tipos";
import { listarAvisosDiagnostico } from "../modelo/diagnostico";
import { useOpmStore } from "../store";
import {
  derivarIssuesDiagnostico,
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
 * ANTES de graduar. Graduar NO bloquea por validez: informa y deja decidir.
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
  const exigibles = useMemo(
    () => {
      if (!modelo) return [];
      const puedeNavegar = modeloPersistidoId === modeloId;
      return derivarIssuesDiagnostico(
        listarAvisosDiagnostico(modelo, { tipo: "modelo" }),
        navegarAviso,
        { esApunte: false },
      )
        .filter((issue) => issue.severidad === "bloqueo" || issue.severidad === "mejora")
        .map((issue) => puedeNavegar ? issue : { ...issue, navegable: false });
    },
    [modelo, modeloId, modeloPersistidoId, navegarAviso],
  );
  const bloqueos = exigibles.filter((i) => i.severidad === "bloqueo");
  const mejoras = exigibles.filter((i) => i.severidad === "mejora");

  const carpetasVivas = useMemo(
    () => carpetas.filter((c) => !c.archivada).sort((a, b) => a.nombre.localeCompare(b.nombre, "es-CL")),
    [carpetas],
  );

  const nombreValido = nombre.trim().length > 0;
  const intervencionTutor = runTutorPolicy(deriveEntryIntent({
    intentId: `lifecycle:${modeloId ?? "none"}:${esBiblioteca ? "graduate-library" : "graduate"}`,
    focus: "lifecycle",
    transition: esBiblioteca ? "graduate-library" : "graduate",
    factsPreserved: true,
    activeLenses: mapearLentesTutor(modelo?.lentesConocimiento ?? []),
  }));
  const graduar = () => {
    if (modeloId === null) return;
    confirmarGraduacion({
      modeloId,
      nombre,
      carpetaId,
      bloqueos: bloqueos.length,
      mejoras: mejoras.length,
    });
  };

  return (
    <Dialogo
      open={abierto}
      title={esBiblioteca ? "Graduar y marcar Biblioteca" : "Graduar apunte a modelo"}
      onCancel={cerrarGraduar}
      initialFocusRef={inputRef}
      size="lg"
      testId="dialogo-graduar"
      actions={(
        <>
          <DialogoAccion disabled={graduacionEnCurso && preparado} onClick={cerrarGraduar}>Cancelar</DialogoAccion>
          <DialogoAccion
            tono="primaria"
            testId="graduar-confirmar"
            tutorEntrypoint={esBiblioteca ? "workspace:graduate-library" : "workspace:graduate-model"}
            disabled={!preparado || !nombreValido || graduacionEnCurso}
            onClick={graduar}
          >
            {graduacionEnCurso
              ? (preparado ? "Graduando…" : "Preparando…")
              : bloqueos.length > 0
                ? esBiblioteca
                  ? `Graduar de todos modos y marcar Biblioteca · ${bloqueos.length} ${bloqueos.length === 1 ? "bloqueo" : "bloqueos"}`
                  : `Graduar de todos modos · ${bloqueos.length} ${bloqueos.length === 1 ? "bloqueo" : "bloqueos"}`
                : esBiblioteca ? "Graduar y marcar Biblioteca" : "Graduar"}
          </DialogoAccion>
        </>
      )}
    >
      <div style={style.container}>
        <TutorInterventionDetails intervention={intervencionTutor} testId="tutor-dialogo-graduar" />
        <p style={style.intro}>
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
            <p style={style.contratoTexto}>Entidades · enlaces · OPDs · OPL · OPDs que sigan en Taller.</p>
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

        <section style={style.reporte} data-testid="graduar-validez">
          <h3 style={style.reporteTitulo}>Validez exigible</h3>
          {exigibles.length === 0 ? (
            <p style={style.reporteVacio} data-testid="graduar-validez-vacio">
              Sin pendientes de cierre en el diagnóstico actual.
            </p>
          ) : (
            <ul style={style.reporteLista}>
              {[...bloqueos, ...mejoras].map((issue) => (
                <li key={issue.id} style={style.reporteItem} data-severidad={issue.severidad}>
                  <span style={{ ...style.marca, color: colorSeveridad(issue.severidad) }} aria-hidden="true">
                    {glifoSeveridad(issue.severidad)}
                  </span>
                  {issue.navegable ? (
                    <button
                      type="button"
                      style={style.issueNavegable}
                      onClick={() => {
                        cerrarGraduar();
                        requestAnimationFrame(issue.navegar);
                      }}
                    >
                      {issue.titulo} · Ir al elemento
                    </button>
                  ) : <span style={style.reporteTexto}>{issue.titulo}</span>}
                </li>
              ))}
            </ul>
          )}
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
