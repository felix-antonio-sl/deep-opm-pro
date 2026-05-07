import { useEffect, useMemo, useState } from "preact/hooks";
import { FAMILIAS_TRAER, type FamiliaTraerConectados } from "../canvas/reglasTraer";
import { useOpmStore } from "../store";
import { Dialogo } from "./Dialogo";

/**
 * Dialogo de familias para traer conectados.
 *
 * SSOT: [Met §multi-OPD] hidrata solo la vista activa; [Glos 3.6] una
 * apariencia puede existir en mas de un OPD sin duplicar el hecho logical.
 * Referencia tecnica verificada: opm-extracted/src/app/models/consistency/bringConnectedRules.ts.
 */

const LABELS: Record<FamiliaTraerConectados, string> = {
  "procedural-habilitador": "Procedurales habilitadores",
  "procedural-transformador": "Procedurales transformadores",
  direccional: "Direccionales",
  estructural: "Estructurales",
};

export function DialogoTraerConectados() {
  const abierto = useOpmStore((s) => s.dialogoTraerConectadosAbierto);
  const cerrar = useOpmStore((s) => s.cerrarDialogoTraerConectados);
  const traer = useOpmStore((s) => s.traerConectadosSeleccionado);
  const ultima = useOpmStore((s) => s.indice.preferenciasUi?.traerConectadosUltimo);
  const inicial = useMemo(() => new Set<FamiliaTraerConectados>(ultima?.length ? ultima : FAMILIAS_TRAER), [ultima]);
  const [seleccion, setSeleccion] = useState(inicial);

  useEffect(() => {
    if (abierto) setSeleccion(new Set(ultima?.length ? ultima : FAMILIAS_TRAER));
  }, [abierto, ultima]);

  if (!abierto) return null;
  const activas = [...seleccion];

  return (
    <Dialogo
      open={abierto}
      title="Traer conectados"
      onCancel={cerrar}
      actions={(
        <>
          <button type="button" style={style.secondary} onClick={cerrar}>Cancelar</button>
          <button type="submit" form="form-traer-conectados" style={activas.length > 0 ? style.primary : style.disabled} disabled={activas.length === 0}>Traer</button>
        </>
      )}
    >
      <form
        id="form-traer-conectados"
        style={style.form}
        data-testid="dialogo-traer-conectados"
        onSubmit={(event) => {
          event.preventDefault();
          traer(activas);
        }}
      >
        <div style={style.lista}>
          {FAMILIAS_TRAER.map((familia) => (
            <label key={familia} style={style.check}>
              <input
                type="checkbox"
                checked={seleccion.has(familia)}
                onChange={(event) => {
                  const siguiente = new Set(seleccion);
                  if (event.currentTarget.checked) siguiente.add(familia);
                  else siguiente.delete(familia);
                  setSeleccion(siguiente);
                }}
              />
              <span>{LABELS[familia]}</span>
            </label>
          ))}
        </div>
      </form>
    </Dialogo>
  );
}

const buttonBase = {
  height: "32px",
  borderRadius: "4px",
  padding: "0 14px",
  fontSize: "13px",
  fontWeight: 700,
} satisfies preact.JSX.CSSProperties;

const style = {
  form: {
    display: "grid",
    gap: "16px",
  },
  lista: {
    display: "grid",
    gap: "10px",
  },
  check: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    color: "#1f2937",
  },
  primary: {
    ...buttonBase,
    border: "1px solid #1a3763",
    background: "#1a3763",
    color: "#ffffff",
    cursor: "pointer",
  },
  secondary: {
    ...buttonBase,
    border: "1px solid #b9c5d4",
    background: "#ffffff",
    color: "#1f2937",
    cursor: "pointer",
  },
  disabled: {
    ...buttonBase,
    border: "1px solid #d9e0ea",
    background: "#f2f4f7",
    color: "#98a2b3",
    cursor: "default",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
