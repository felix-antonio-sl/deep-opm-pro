// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useState } from "preact/hooks";
import type { ValorConcreto } from "../modelo/tipos";
import { filasSimulacionACsv } from "../modelo/simulacion/csv";
import { useDialogoSimulacionNumericaViewModel } from "../app/viewmodels/dialogoSimulacionNumericaViewModel";
import { Dialogo, DialogoAccion } from "./Dialogo";
import { tokens } from "./tokens";

const N_MAX = 10000;
const N_AVISO = 5000;
const N_DEFAULT = 100;

export interface DialogoSimulacionNumericaProps {
  abierto: boolean;
  columnas: string[];
  onEjecutar: (n: number) => Array<Record<string, ValorConcreto | undefined>>;
  onCerrar: () => void;
}

export function DialogoSimulacionNumericaContenido({
  abierto,
  columnas,
  onEjecutar,
  onCerrar,
}: DialogoSimulacionNumericaProps) {
  const [n, setN] = useState<number>(N_DEFAULT);
  const [nInput, setNInput] = useState(String(N_DEFAULT));
  const [filas, setFilas] = useState<Array<Record<string, ValorConcreto | undefined>> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const nValido = Number.isInteger(n) && n >= 1 && n <= N_MAX;
  const hayColumnas = columnas.length > 0;

  const ejecutar = () => {
    if (!nValido || !hayColumnas) return;
    const resultado = onEjecutar(n);
    setFilas(resultado);
    setError(null);
  };

  const descargarCsv = () => {
    if (!filas) return;
    const csv = filasSimulacionACsv(filas, columnas);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "simulacion.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const onCambiarN = (valor: string) => {
    setNInput(valor);
    const parsed = parseInt(valor, 10);
    if (!Number.isNaN(parsed)) {
      setN(parsed);
      if (parsed < 1 || parsed > N_MAX) {
        setError(`N debe estar entre 1 y ${N_MAX.toLocaleString("es")}.`);
      } else {
        setError(null);
      }
    } else {
      setError("Ingresa un número entero.");
    }
  };

  return (
    <Dialogo
      open={abierto}
      title="Simulación numérica"
      onCancel={onCerrar}
      size="xl"
      testId="modal-simulacion-numerica"
      actions={(
        <>
          <DialogoAccion onClick={onCerrar}>Cerrar</DialogoAccion>
          {filas !== null ? (
            <DialogoAccion
              aria-label="Descargar CSV"
              onClick={descargarCsv}
            >
              Descargar CSV
            </DialogoAccion>
          ) : null}
          <DialogoAccion
            tono="primaria"
            disabled={!nValido || !hayColumnas}
            aria-label="Ejecutar simulación"
            onClick={ejecutar}
          >
            Ejecutar
          </DialogoAccion>
        </>
      )}
    >
      <div style={style.body}>
        {!hayColumnas ? (
          <div style={style.vacio} data-testid="simulacion-numerica-estado-vacio">
            <p style={style.vacioPrincipal}>No hay atributos simulables en este modelo.</p>
            <p style={style.vacioGuia}>
              Para usar esta función, crea un atributo numérico en un objeto y márcalo como simulable
              desde la sección <strong>Atributo</strong> del inspector.
            </p>
          </div>
        ) : (
          <>
            <div style={style.controles}>
              <label style={style.campo}>
                <span style={style.etiqueta}>Ejecuciones (N)</span>
                <input
                  type="number"
                  min={1}
                  max={N_MAX}
                  step={1}
                  value={nInput}
                  aria-label="Número de ejecuciones"
                  style={error ? style.inputError : style.input}
                  onInput={(evt) => onCambiarN(evt.currentTarget.value)}
                  onKeyDown={(evt) => {
                    if (evt.key === "Enter" && nValido && hayColumnas) ejecutar();
                  }}
                />
              </label>
              {error ? <p style={style.errorMsg}>{error}</p> : null}
              {n > N_AVISO && !error ? (
                <p style={style.aviso}>
                  N &gt; {N_AVISO.toLocaleString("es")}: puede demorar un momento.
                </p>
              ) : null}
            </div>
            {filas !== null ? (
              <div style={style.tablaWrap} data-testid="simulacion-numerica-tabla">
                <p style={style.resumen}>
                  {filas.length} {filas.length === 1 ? "fila" : "filas"} · {columnas.length}{" "}
                  {columnas.length === 1 ? "columna" : "columnas"}
                </p>
                <div style={style.tablaScroll}>
                  <table style={style.tabla} aria-label="Resultados de simulación">
                    <thead>
                      <tr>
                        <th style={{ ...style.th, ...style.thIndex }}>#</th>
                        {columnas.map((col) => (
                          <th key={col} style={style.th} title={col}>
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filas.map((fila, i) => (
                        <tr key={i} style={i % 2 === 0 ? style.trPar : style.trImpar}>
                          <td style={{ ...style.td, ...style.tdIndex }}>{i + 1}</td>
                          {columnas.map((col) => (
                            <td key={col} style={style.td}>
                              {fila[col] !== undefined ? String(fila[col]) : ""}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </Dialogo>
  );
}

export function DialogoSimulacionNumerica() {
  const { abierto, cerrar, columnas, ejecutar } = useDialogoSimulacionNumericaViewModel();

  return (
    <DialogoSimulacionNumericaContenido
      abierto={abierto}
      columnas={columnas}
      onEjecutar={ejecutar}
      onCerrar={cerrar}
    />
  );
}

// Estilos Codex — tipografía editorial, tokens canónicos.
const style = {
  body: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "100%",
    minHeight: "120px",
  },
  controles: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  campo: {
    display: "grid",
    gridTemplateColumns: "140px minmax(0, 1fr)",
    alignItems: "center",
    gap: "8px",
  },
  etiqueta: {
    fontFamily: tokens.typography.familyChrome,
    fontSize: "13px",
    color: tokens.colors.ink70,
    fontWeight: 400,
  } as preact.JSX.CSSProperties,
  input: {
    height: "32px",
    minWidth: 0,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ruleStrong}`,
    borderRadius: 0,
    padding: "0 10px",
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "13px",
    caretColor: tokens.colors.crimson,
  } as preact.JSX.CSSProperties,
  inputError: {
    height: "32px",
    minWidth: 0,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.crimson}`,
    borderRadius: 0,
    padding: "0 10px",
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "13px",
    caretColor: tokens.colors.crimson,
  } as preact.JSX.CSSProperties,
  errorMsg: {
    margin: 0,
    color: tokens.colors.crimson,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12px",
    fontWeight: 400,
  } as preact.JSX.CSSProperties,
  aviso: {
    margin: 0,
    color: tokens.colors.ink50,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12px",
    fontWeight: 400,
  } as preact.JSX.CSSProperties,
  tablaWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    minHeight: 0,
  } as preact.JSX.CSSProperties,
  resumen: {
    margin: 0,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12px",
    color: tokens.colors.ink50,
  } as preact.JSX.CSSProperties,
  tablaScroll: {
    overflowX: "auto",
    overflowY: "auto",
    maxHeight: "360px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.rule}`,
  } as preact.JSX.CSSProperties,
  tabla: {
    width: "100%",
    borderCollapse: "collapse",
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12px",
  } as preact.JSX.CSSProperties,
  th: {
    padding: "6px 10px",
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    fontWeight: 500,
    textAlign: "left",
    borderBottom: `1px solid ${tokens.colors.ruleStrong}`,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "160px",
    position: "sticky",
    top: 0,
    zIndex: 1,
  } as preact.JSX.CSSProperties,
  thIndex: {
    width: "40px",
    minWidth: "40px",
    color: tokens.colors.ink50,
    fontWeight: 400,
  } as preact.JSX.CSSProperties,
  td: {
    padding: "4px 10px",
    color: tokens.colors.ink,
    borderBottom: `1px solid ${tokens.colors.rule}`,
    whiteSpace: "nowrap",
  } as preact.JSX.CSSProperties,
  tdIndex: {
    color: tokens.colors.ink50,
    fontWeight: 400,
    fontSize: "11px",
  } as preact.JSX.CSSProperties,
  trPar: {
    background: tokens.colors.paper,
  } as preact.JSX.CSSProperties,
  trImpar: {
    background: tokens.colors.paperWarm,
  } as preact.JSX.CSSProperties,
  vacio: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    padding: "8px 0",
  } as preact.JSX.CSSProperties,
  vacioPrincipal: {
    margin: 0,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "14px",
    color: tokens.colors.ink,
    fontWeight: 500,
  } as preact.JSX.CSSProperties,
  vacioGuia: {
    margin: 0,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "13px",
    color: tokens.colors.ink50,
    lineHeight: 1.5,
  } as preact.JSX.CSSProperties,
} satisfies Record<string, preact.JSX.CSSProperties>;
