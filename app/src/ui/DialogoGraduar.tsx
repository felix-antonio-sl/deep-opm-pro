// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { Id } from "../modelo/tipos";
import { useOpmStore } from "../store";
import { useZustandDiagnosticsPort } from "../app/ports/zustandDiagnosticsPort";
import {
  derivarIssuesDiagnostico,
  type SeveridadDiagnostico,
} from "../app/viewmodels/panelDiagnosticoViewModel";
import { Dialogo, DialogoAccion } from "./Dialogo";
import { tokens } from "./tokens";

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
  const modelo = useOpmStore((s) => s.modelo);
  const carpetas = useOpmStore((s) => s.indice.carpetas);
  const carpetaModelo = useOpmStore((s) =>
    s.indice.modelos.find((m) => m.id === s.dialogoGraduarModeloId)?.carpetaId ?? null,
  );
  const cerrarGraduar = useOpmStore((s) => s.cerrarGraduar);
  const confirmarGraduacion = useOpmStore((s) => s.confirmarGraduacion);
  const { avisos, navegarAviso } = useZustandDiagnosticsPort(0);

  const abierto = modeloId !== null;
  const inputRef = useRef<HTMLInputElement>(null);
  const [nombre, setNombre] = useState(modelo.nombre);
  const [carpetaId, setCarpetaId] = useState<Id | null>(carpetaModelo);

  useEffect(() => {
    if (!abierto) return;
    setNombre(modelo.nombre);
    setCarpetaId(carpetaModelo);
  }, [abierto, modelo.nombre, carpetaModelo]);

  // Validez EXIGIBLE: las señales del diagnóstico con su severidad real (como si
  // ya fuera modelo). Lo que en apunte era observación aquí aparece como bloqueo/mejora.
  const exigibles = useMemo(
    () => derivarIssuesDiagnostico(avisos, navegarAviso, { esApunte: false })
      .filter((issue) => issue.severidad === "bloqueo" || issue.severidad === "mejora"),
    [avisos, navegarAviso],
  );
  const bloqueos = exigibles.filter((i) => i.severidad === "bloqueo");
  const mejoras = exigibles.filter((i) => i.severidad === "mejora");

  const carpetasVivas = useMemo(
    () => carpetas.filter((c) => !c.archivada).sort((a, b) => a.nombre.localeCompare(b.nombre, "es-CL")),
    [carpetas],
  );

  const graduar = () => {
    if (modeloId === null) return;
    confirmarGraduacion({ modeloId, nombre, carpetaId });
  };

  return (
    <Dialogo
      open={abierto}
      title="Graduar apunte a modelo"
      onCancel={cerrarGraduar}
      initialFocusRef={inputRef}
      size="lg"
      testId="dialogo-graduar"
      actions={(
        <>
          <DialogoAccion onClick={cerrarGraduar}>Cancelar</DialogoAccion>
          <DialogoAccion tono="primaria" testId="graduar-confirmar" onClick={graduar}>Graduar</DialogoAccion>
        </>
      )}
    >
      <div style={style.container}>
        <p style={style.intro}>
          Al graduar, el borrador deja de ser apunte: se le exige la validez OPM que hasta
          ahora estaba en observación. Revísala abajo antes de confirmar.
        </p>

        <label style={style.label}>
          <span>Nombre definitivo</span>
          <input
            ref={inputRef}
            aria-label="Nombre definitivo"
            data-testid="graduar-nombre"
            style={style.input}
            value={nombre}
            onInput={(event) => setNombre(event.currentTarget.value)}
          />
        </label>

        <label style={style.label}>
          <span>Carpeta</span>
          <select
            aria-label="Carpeta"
            data-testid="graduar-carpeta"
            style={style.input}
            value={carpetaId ?? ""}
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
              Sin observaciones pendientes: el borrador cumple la validez de cierre.
            </p>
          ) : (
            <ul style={style.reporteLista}>
              {[...bloqueos, ...mejoras].map((issue) => (
                <li key={issue.id} style={style.reporteItem} data-severidad={issue.severidad}>
                  <span style={{ ...style.marca, color: colorSeveridad(issue.severidad) }} aria-hidden="true">
                    {glifoSeveridad(issue.severidad)}
                  </span>
                  <span style={style.reporteTexto}>{issue.titulo}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
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
} satisfies Record<string, preact.JSX.CSSProperties>;
