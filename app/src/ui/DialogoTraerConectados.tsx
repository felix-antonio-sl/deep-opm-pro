// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useEffect, useMemo, useState } from "preact/hooks";
import { useDialogoTraerConectadosViewModel } from "../app/viewmodels/dialogoTraerConectadosViewModel";
import { FAMILIAS_TRAER, type FamiliaTraerConectados } from "../canvas/reglasTraer";
import { Dialogo } from "./Dialogo";
import { tokens } from "./tokens";

/**
 * Dialogo de familias para traer conectados.
 *
 * SSOT: [Met §multi-OPD] hidrata solo la vista activa; [Glos 3.6] una
 * apariencia puede existir en mas de un OPD sin duplicar el hecho logical.
 * El conteo por familia se deriva en el viewmodel desde `reglasTraer.ts` +
 * `entidadIdDeExtremo`, sin agregar funciones nuevas al kernel.
 * Referencia tecnica verificada: opm-extracted/src/app/models/consistency/bringConnectedRules.ts.
 */

const LABELS: Record<FamiliaTraerConectados, string> = {
  "procedural-habilitador": "Procedurales habilitadores",
  "procedural-transformador": "Procedurales transformadores",
  direccional: "Direccionales",
  estructural: "Estructurales",
};

export function DialogoTraerConectados() {
  const { abierto, cerrar, traer, ultima, conteos } = useDialogoTraerConectadosViewModel();
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
          {FAMILIAS_TRAER.map((familia) => {
            const n = conteos[familia];
            const sinCandidatos = n === 0;
            return (
              <label key={familia} style={sinCandidatos ? style.checkDisabled : style.check} data-testid={`familia-traer-${familia}`}>
                <input
                  type="checkbox"
                  checked={seleccion.has(familia) && !sinCandidatos}
                  disabled={sinCandidatos}
                  onChange={(event) => {
                    const siguiente = new Set(seleccion);
                    if (event.currentTarget.checked) siguiente.add(familia);
                    else siguiente.delete(familia);
                    setSeleccion(siguiente);
                  }}
                />
                <span>{LABELS[familia]} · <span data-testid={`conteo-${familia}`}>{n} {n === 1 ? "candidato" : "candidatos"}</span></span>
              </label>
            );
          })}
        </div>
      </form>
    </Dialogo>
  );
}

// Ronda 28 L5: Bauhaus monocromático.
const buttonBase = {
  minHeight: "32px",
  borderRadius: 0,
  padding: "8px 18px",
  fontFamily: tokens.typography.familyChrome,
  fontSize: "13px",
  fontWeight: 500,
} satisfies preact.JSX.CSSProperties;

const style = {
  form: {
    display: "grid",
    gap: "16px",
  },
  lista: {
    display: "grid",
    gap: "12px",
  },
  check: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontFamily: tokens.typography.familyChrome,
    fontSize: "14px",
    color: tokens.colors.ink,
  },
  checkDisabled: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontFamily: tokens.typography.familyChrome,
    fontSize: "14px",
    color: tokens.colors.ink50,
    cursor: "not-allowed",
  },
  primary: {
    ...buttonBase,
    border: `${tokens.stroke.base}px solid ${tokens.colors.ink}`,
    background: tokens.colors.ink,
    color: tokens.colors.paper,
    cursor: "pointer",
  },
  secondary: {
    ...buttonBase,
    border: `${tokens.stroke.base}px solid ${tokens.colors.ink}`,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    cursor: "pointer",
  },
  disabled: {
    ...buttonBase,
    border: `${tokens.stroke.base}px solid ${tokens.colors.ink15}`,
    background: tokens.colors.ink04,
    color: tokens.colors.ink50,
    cursor: "not-allowed",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
