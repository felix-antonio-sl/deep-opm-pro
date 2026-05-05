import { entidadIdDeExtremo } from "../../modelo/extremos";
import type { Apariencia, Enlace, Id, Modelo } from "../../modelo/tipos";
import { inspectorStyles as style } from "../inspectorStyles";

export interface ContextoReanclaje {
  aparienciaEnlaceId: Id;
  endpointActualId: Id;
  subprocesos: Array<{ id: Id; nombre: string }>;
}

interface Props {
  modelo: Modelo;
  opdActivoId: Id;
  enlace: Enlace;
  endpointSeleccionado: Id;
  onEndpointSeleccionado: (id: Id) => void;
  onAplicar: (aparienciaEnlaceId: Id, endpointId: Id) => void;
  onAutomatico: (aparienciaEnlaceId: Id) => void;
}

export function SeccionReanclaje(props: Props) {
  const reanclaje = contextoReanclaje(props.modelo, props.opdActivoId, props.enlace);
  if (!reanclaje) return null;
  return (
    <section style={sectionStyle}>
      <h3 style={titleStyle}>Reanclar a subproceso</h3>
      <div style={derivedBadgeStyle}>Derivado ({(props.enlace.derivado?.origen ?? "automatico") === "manual" ? "manual" : "automático"})</div>
      <label style={style.field}>
        <span style={style.label}>Subproceso</span>
        <select data-testid="reanclar-subproceso-select" style={style.input} value={props.endpointSeleccionado} onChange={(event) => props.onEndpointSeleccionado(event.currentTarget.value)} disabled={reanclaje.subprocesos.length <= 1}>
          {reanclaje.subprocesos.map((subproceso, index) => <option key={subproceso.id} value={subproceso.id}>{subproceso.nombre} ({index + 1})</option>)}
        </select>
      </label>
      {reanclaje.subprocesos.length <= 1 ? <div style={helpStyle}>No hay otro subproceso disponible.</div> : null}
      <div style={buttonRowStyle}>
        <button type="button" style={style.secondaryButton} disabled={!props.endpointSeleccionado || (props.endpointSeleccionado === reanclaje.endpointActualId && props.enlace.derivado?.origen === "manual")} onClick={() => props.onAplicar(reanclaje.aparienciaEnlaceId, props.endpointSeleccionado)}>
          Aplicar
        </button>
        <button type="button" style={style.secondaryButton} disabled={(props.enlace.derivado?.origen ?? "automatico") !== "manual"} onClick={() => props.onAutomatico(reanclaje.aparienciaEnlaceId)}>
          Volver a automático
        </button>
      </div>
    </section>
  );
}

export function contextoReanclaje(modelo: Modelo, opdId: Id, enlace: Enlace): ContextoReanclaje | null {
  if (!enlace.derivado) return null;
  const opd = modelo.opds[opdId];
  if (!opd) return null;
  const aparienciaEnlace = Object.values(opd.enlaces).find((apariencia) => apariencia.enlaceId === enlace.id);
  if (!aparienciaEnlace) return null;
  const contorno = Object.values(opd.apariencias).find((apariencia) => apariencia.entidadId === enlace.derivado?.refinamientoId);
  if (!contorno) return null;
  const subprocesos = Object.values(opd.apariencias)
    .filter((apariencia) => apariencia.entidadId !== contorno.entidadId)
    .filter((apariencia) => dentroDeApariencia(apariencia, contorno))
    .filter((apariencia) => modelo.entidades[apariencia.entidadId]?.tipo === "proceso")
    .sort((a, b) => a.y - b.y || a.x - b.x || a.id.localeCompare(b.id));
  const subprocesoIds = new Set(subprocesos.map((apariencia) => apariencia.entidadId));
  const destinoId = entidadIdDeExtremo(modelo, enlace.destinoId);
  const origenId = entidadIdDeExtremo(modelo, enlace.origenId);
  const endpointActualId = destinoId && subprocesoIds.has(destinoId)
    ? destinoId
    : origenId && subprocesoIds.has(origenId)
      ? origenId
      : subprocesos[0]?.entidadId;
  if (!endpointActualId) return null;
  return {
    aparienciaEnlaceId: aparienciaEnlace.id,
    endpointActualId,
    subprocesos: subprocesos.map((apariencia) => ({ id: apariencia.entidadId, nombre: modelo.entidades[apariencia.entidadId]?.nombre ?? apariencia.entidadId })),
  };
}

function dentroDeApariencia(apariencia: Apariencia, contorno: Apariencia): boolean {
  return apariencia.x >= contorno.x && apariencia.y >= contorno.y && apariencia.x + apariencia.width <= contorno.x + contorno.width && apariencia.y + apariencia.height <= contorno.y + contorno.height;
}

const sectionStyle = { display: "grid", gap: "8px", marginBottom: "14px" } satisfies preact.JSX.CSSProperties;
const titleStyle = { margin: "0 0 8px", color: "#1f2937", fontSize: "13px", fontWeight: 700 } satisfies preact.JSX.CSSProperties;
const derivedBadgeStyle = { color: "#344054", fontSize: "12px", fontWeight: 700 } satisfies preact.JSX.CSSProperties;
const helpStyle = { color: "#667085", fontSize: "12px", fontWeight: 600 } satisfies preact.JSX.CSSProperties;
const buttonRowStyle = { display: "grid", gap: "8px", gridTemplateColumns: "1fr" } satisfies preact.JSX.CSSProperties;
