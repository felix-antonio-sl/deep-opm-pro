// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useEffect, useMemo, useState } from "preact/hooks";
import { FAMILIAS_TRAER, tiposDeFamilia, type FamiliaTraerConectados } from "../canvas/reglasTraer";
import { entidadIdDeExtremo } from "../modelo/extremos";
import type { Id, Modelo } from "../modelo/tipos";
import { useOpmStore } from "../store";
import { Dialogo } from "./Dialogo";
import { tokens } from "./tokens";

/**
 * Dialogo de familias para traer conectados.
 *
 * SSOT: [Met §multi-OPD] hidrata solo la vista activa; [Glos 3.6] una
 * apariencia puede existir en mas de un OPD sin duplicar el hecho logical.
 * El conteo por familia se deriva localmente de `tiposDeFamilia` (export
 * existente de reglasTraer.ts) + `entidadIdDeExtremo`, sin agregar funciones
 * nuevas al kernel — la UI cuenta enlaces candidatos en la vista activa.
 * Referencia tecnica verificada: opm-extracted/src/app/models/consistency/bringConnectedRules.ts.
 */

function contarCandidatosUi(modelo: Modelo, entidadFocoId: Id, familia: FamiliaTraerConectados): number {
  const tipos = new Set(tiposDeFamilia(familia));
  if (tipos.size === 0) return 0;
  let total = 0;
  for (const enlace of Object.values(modelo.enlaces)) {
    if (!tipos.has(enlace.tipo)) continue;
    const origen = entidadIdDeExtremo(modelo, enlace.origenId);
    const destino = entidadIdDeExtremo(modelo, enlace.destinoId);
    if (origen === entidadFocoId || destino === entidadFocoId) total += 1;
  }
  return total;
}

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
  const modelo = useOpmStore((s) => s.modelo);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const seleccionados = useOpmStore((s) => s.seleccionados);
  const inicial = useMemo(() => new Set<FamiliaTraerConectados>(ultima?.length ? ultima : FAMILIAS_TRAER), [ultima]);
  const [seleccion, setSeleccion] = useState(inicial);

  const entidadFocoId = useMemo(() => {
    const candidatos = [seleccionId, ...seleccionados];
    for (const id of candidatos) {
      if (id && modelo.entidades[id]) return id;
    }
    return null;
  }, [modelo.entidades, seleccionId, seleccionados]);

  const conteos = useMemo(() => {
    const out: Record<FamiliaTraerConectados, number> = {
      "procedural-habilitador": 0,
      "procedural-transformador": 0,
      direccional: 0,
      estructural: 0,
    };
    if (!entidadFocoId) return out;
    for (const familia of FAMILIAS_TRAER) {
      out[familia] = contarCandidatosUi(modelo, entidadFocoId, familia);
    }
    return out;
  }, [modelo, entidadFocoId]);

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

const buttonBase = {
  height: "32px",
  borderRadius: tokens.radii.sm,
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
    color: tokens.colors.textoPrimario,
  },
  checkDisabled: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    color: tokens.colors.textoDeshabilitado,
    cursor: "not-allowed",
  },
  primary: {
    ...buttonBase,
    border: `1px solid ${tokens.colors.acentoSecundario}`,
    background: tokens.colors.acentoSecundario,
    color: tokens.colors.fondoChrome,
    cursor: "pointer",
  },
  secondary: {
    ...buttonBase,
    border: `1px solid ${tokens.colors.bordeInput}`,
    background: tokens.colors.fondoChrome,
    color: tokens.colors.textoPrimario,
    cursor: "pointer",
  },
  disabled: {
    ...buttonBase,
    border: `1px solid ${tokens.colors.bordeIntermedio}`,
    background: tokens.colors.fondoDeshabilitado,
    color: tokens.colors.textoDeshabilitado,
    cursor: "default",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
