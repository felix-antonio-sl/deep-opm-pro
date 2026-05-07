// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { entidadDeExtremo, extremoEntidad, extremoEstado } from "../../modelo/extremos";
import { estadosDeEntidad } from "../../modelo/operaciones";
import type { Enlace, ExtremoEnlace, Modelo } from "../../modelo/tipos";
import { inspectorStyles as style } from "../inspectorStyles";
import { enlaceProcedural } from "./SeccionMultiplicidad";
import { tokens } from "../tokens";

interface Props {
  modelo: Modelo;
  enlace: Enlace;
  onApuntarExtremo: (lado: "origen" | "destino", extremo: ExtremoEnlace) => void;
  onAbrirMoverPuerto: () => void;
}

export function SeccionExtremos(props: Props) {
  const selectores = selectoresEstadoExtremo(props.modelo, props.enlace);
  if (!enlaceProcedural(props.enlace.tipo)) return null;
  return (
    <section style={sectionStyle}>
      <h3 style={titleStyle}>Extremos</h3>
      {selectores.map(({ lado, entidad, estados, actual }) => (
        <label key={lado} style={style.field}>
          <span style={style.label}>{lado === "origen" ? "Origen" : "Destino"}</span>
          <select
            data-testid={`extremo-${lado}-estado-select`}
            style={style.input}
            value={actual.kind === "estado" ? actual.id : entidad.id}
            onChange={(event) => {
              const value = event.currentTarget.value;
              props.onApuntarExtremo(lado, value === entidad.id ? extremoEntidad(entidad.id) : extremoEstado(value));
            }}
          >
            <option value={entidad.id}>(toda la entidad)</option>
            {estados.map((estado) => <option key={estado.id} value={estado.id}>{estado.nombre}</option>)}
          </select>
        </label>
      ))}
      <button type="button" data-testid="mover-puerto-btn" style={style.secondaryButton} onClick={props.onAbrirMoverPuerto}>
        Mover Puerto
      </button>
      <button type="button" data-testid="reanclar-extremo-btn" style={style.secondaryButton} onClick={props.onAbrirMoverPuerto} title="Usa los handles SourceArrowhead/TargetArrowhead del enlace seleccionado para reanclar">
        Reanclar extremo
      </button>
    </section>
  );
}

export function selectoresEstadoExtremo(modelo: Modelo, enlace: Enlace): Array<{
  lado: "origen" | "destino";
  entidad: NonNullable<ReturnType<typeof entidadDeExtremo>>;
  estados: ReturnType<typeof estadosDeEntidad>;
  actual: ExtremoEnlace;
}> {
  if (!enlaceProcedural(enlace.tipo)) return [];
  return (["origen", "destino"] as const).flatMap((lado) => {
    const actual = lado === "origen" ? enlace.origenId : enlace.destinoId;
    const entidad = entidadDeExtremo(modelo, actual);
    if (!entidad || entidad.tipo !== "objeto") return [];
    const estados = estadosDeEntidad(modelo, entidad.id);
    return estados.length >= 2 ? [{ lado, entidad, estados, actual }] : [];
  });
}

const sectionStyle = { display: "grid", gap: "8px", marginBottom: "14px" } satisfies preact.JSX.CSSProperties;
const titleStyle = { margin: "0 0 8px", color: tokens.colors.textoPrimario, fontSize: "13px", fontWeight: 700 } satisfies preact.JSX.CSSProperties;
