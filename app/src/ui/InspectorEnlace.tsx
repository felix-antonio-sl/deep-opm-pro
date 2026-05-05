import { useEffect, useState } from "preact/hooks";
import { abanicoDeEnlace } from "../modelo/abanicos";
import { entidadDeExtremo, entidadIdDeExtremo, extremoEntidad, extremoEstado, nombreExtremo } from "../modelo/extremos";
import { estadosDeEntidad, validarMultiplicidad } from "../modelo/operaciones";
import { useOpmStore } from "../store";
import type { Abanico, Apariencia, Enlace, ExtremoEnlace, Id, Modelo, OperadorAbanico } from "../modelo/tipos";
import { inspectorStyles as style } from "./inspectorStyles";

interface Props {
  enlace: Enlace;
}

export function InspectorEnlace({ enlace }: Props) {
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const ajustarMultiplicidad = useOpmStore((s) => s.ajustarMultiplicidadSeleccionada);
  const apuntarExtremo = useOpmStore((s) => s.apuntarExtremoEnlaceSeleccionado);
  const reanclarEnlaceExternoDerivado = useOpmStore((s) => s.reanclarEnlaceExternoDerivado);
  const volverEnlaceExternoDerivadoAAutomatico = useOpmStore((s) => s.volverEnlaceExternoDerivadoAAutomatico);
  const splitEffect = useOpmStore((s) => s.splitEffectSeleccionado);
  const alternarOperadorAbanico = useOpmStore((s) => s.alternarOperadorAbanicoSeleccionado);
  const quitarRamaDeAbanico = useOpmStore((s) => s.quitarRamaDeAbanicoSeleccionado);
  const disolverAbanico = useOpmStore((s) => s.disolverAbanicoSeleccionado);
  const eliminar = useOpmStore((s) => s.eliminarSeleccion);
  const abanico = abanicoDeEnlace(modelo, enlace.id);
  const origen = entidadDeExtremo(modelo, enlace.origenId);
  const destino = entidadDeExtremo(modelo, enlace.destinoId);
  const selectoresExtremo = selectoresEstadoExtremo(modelo, enlace);
  const reanclaje = contextoReanclaje(modelo, opdActivoId, enlace);
  const endpointActual = reanclaje?.endpointActualId ?? "";
  const [multiplicidadOrigen, setMultiplicidadOrigen] = useState(enlace.multiplicidadOrigen ?? "");
  const [multiplicidadDestino, setMultiplicidadDestino] = useState(enlace.multiplicidadDestino ?? "");
  const [endpointSeleccionado, setEndpointSeleccionado] = useState(endpointActual);
  const errorOrigen = multiplicidadOrigen !== "" && !validarMultiplicidad(multiplicidadOrigen);
  const errorDestino = multiplicidadDestino !== "" && !validarMultiplicidad(multiplicidadDestino);

  useEffect(() => {
    setMultiplicidadOrigen(enlace.multiplicidadOrigen ?? "");
    setMultiplicidadDestino(enlace.multiplicidadDestino ?? "");
  }, [enlace.id, enlace.multiplicidadDestino, enlace.multiplicidadOrigen]);

  useEffect(() => {
    setEndpointSeleccionado(endpointActual);
  }, [enlace.id, endpointActual]);

  const cambiarMultiplicidad = (lado: "origen" | "destino", valor: string) => {
    if (lado === "origen") setMultiplicidadOrigen(valor);
    if (lado === "destino") setMultiplicidadDestino(valor);
    if (valor === "" || validarMultiplicidad(valor)) ajustarMultiplicidad(lado, valor);
  };

  const aplicarReanclaje = () => {
    if (!reanclaje || !endpointSeleccionado) return;
    reanclarEnlaceExternoDerivado(reanclaje.aparienciaEnlaceId, endpointSeleccionado);
  };

  const volverAAutomatico = () => {
    if (!reanclaje) return;
    volverEnlaceExternoDerivadoAAutomatico(reanclaje.aparienciaEnlaceId);
  };

  return (
    <>
      <div style={style.header}>
        <span style={style.kind}>Enlace {capitalizar(enlace.tipo)}</span>
        <code style={style.id}>{enlace.id}</code>
      </div>

      <div style={style.summary}>
        <span>{origen ? nombreExtremo(modelo, enlace.origenId) : enlace.origenId.id}</span>
        <span style={style.arrow}>{"->"}</span>
        <span>{destino ? nombreExtremo(modelo, enlace.destinoId) : enlace.destinoId.id}</span>
      </div>

      <section style={multiplicidadSectionStyle}>
        <h3 style={multiplicidadTitleStyle}>Multiplicidad</h3>
        <label style={style.field}>
          <span style={style.label}>Origen</span>
          <input
            aria-invalid={errorOrigen}
            placeholder="1, 2..N, *"
            style={errorOrigen ? inputErrorStyle : style.input}
            value={multiplicidadOrigen}
            onInput={(event) => cambiarMultiplicidad("origen", event.currentTarget.value)}
          />
          {errorOrigen ? <span role="alert" style={errorStyle}>Sintaxis inválida: 1, *, 2..N o 1..5</span> : null}
        </label>
        <label style={style.field}>
          <span style={style.label}>Destino</span>
          <input
            aria-invalid={errorDestino}
            placeholder="1, 2..N, *"
            style={errorDestino ? inputErrorStyle : style.input}
            value={multiplicidadDestino}
            onInput={(event) => cambiarMultiplicidad("destino", event.currentTarget.value)}
          />
          {errorDestino ? <span role="alert" style={errorStyle}>Sintaxis inválida: 1, *, 2..N o 1..5</span> : null}
        </label>
      </section>

      {selectoresExtremo.length > 0 ? (
        <section style={extremosSectionStyle}>
          <h3 style={multiplicidadTitleStyle}>Extremos de estado</h3>
          {selectoresExtremo.map(({ lado, entidad, estados, actual }) => (
            <label key={lado} style={style.field}>
              <span style={style.label}>{lado === "origen" ? "Origen" : "Destino"}</span>
              <select
                data-testid={`extremo-${lado}-estado-select`}
                style={style.input}
                value={actual.kind === "estado" ? actual.id : entidad.id}
                onChange={(event) => {
                  const value = event.currentTarget.value;
                  apuntarExtremo(lado, value === entidad.id ? extremoEntidad(entidad.id) : extremoEstado(value));
                }}
              >
                <option value={entidad.id}>(toda la entidad)</option>
                {estados.map((estado) => (
                  <option key={estado.id} value={estado.id}>{estado.nombre}</option>
                ))}
              </select>
            </label>
          ))}
        </section>
      ) : null}

      {reanclaje ? (
        <section style={reanclajeSectionStyle}>
          <h3 style={multiplicidadTitleStyle}>Reanclar a subproceso</h3>
          <div style={derivedBadgeStyle}>Derivado ({(enlace.derivado?.origen ?? "automatico") === "manual" ? "manual" : "automático"})</div>
          <label style={style.field}>
            <span style={style.label}>Subproceso</span>
            <select
              data-testid="reanclar-subproceso-select"
              style={style.input}
              value={endpointSeleccionado}
              onChange={(event) => setEndpointSeleccionado(event.currentTarget.value)}
              disabled={reanclaje.subprocesos.length <= 1}
            >
              {reanclaje.subprocesos.map((subproceso, index) => (
                <option key={subproceso.id} value={subproceso.id}>
                  {subproceso.nombre} ({index + 1})
                </option>
              ))}
            </select>
          </label>
          {reanclaje.subprocesos.length <= 1 ? <div style={helpStyle}>No hay otro subproceso disponible.</div> : null}
          <div style={buttonRowStyle}>
            <button
              type="button"
              style={style.secondaryButton}
              disabled={!endpointSeleccionado || (endpointSeleccionado === endpointActual && enlace.derivado?.origen === "manual")}
              onClick={aplicarReanclaje}
            >
              Aplicar
            </button>
            <button
              type="button"
              style={style.secondaryButton}
              disabled={(enlace.derivado?.origen ?? "automatico") !== "manual"}
              onClick={volverAAutomatico}
            >
              Volver a automático
            </button>
          </div>
        </section>
      ) : null}

      {enlace.tipo === "efecto" ? (
        <button
          type="button"
          style={style.secondaryButton}
          onClick={splitEffect}
          title="Convierte el efecto en consumo + objeto intermedio + resultado"
        >
          Split en par
        </button>
      ) : null}

      {abanico ? (
        <section style={abanicoSectionStyle}>
          <h3 style={multiplicidadTitleStyle}>Abanico {abanico.operador}</h3>
          <div style={helpStyle}>
            {abanico.enlaceIds.length} ramas comparten puerto.{" "}
            {abanico.operador === "XOR" ? "Exactamente una se cumple." : "Al menos una se cumple."}
          </div>
          <div style={buttonRowStyle}>
            <button
              type="button"
              data-testid="abanico-toggle-O"
              style={style.secondaryButton}
              disabled={abanico.operador === "O"}
              onClick={() => alternarOperadorAbanico("O" satisfies OperadorAbanico)}
            >
              O
            </button>
            <button
              type="button"
              data-testid="abanico-toggle-XOR"
              style={style.secondaryButton}
              disabled={abanico.operador === "XOR"}
              onClick={() => alternarOperadorAbanico("XOR" satisfies OperadorAbanico)}
            >
              XOR
            </button>
          </div>
          <div style={buttonRowStyle}>
            <button type="button" style={style.secondaryButton} onClick={quitarRamaDeAbanico}>
              Quitar rama
            </button>
            <button type="button" style={style.secondaryButton} onClick={disolverAbanico}>
              Disolver abanico
            </button>
          </div>
        </section>
      ) : null}

      <button type="button" style={style.dangerButton} onClick={eliminar}>Eliminar enlace</button>
    </>
  );
}

function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function selectoresEstadoExtremo(modelo: Modelo, enlace: Enlace): Array<{
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

function enlaceProcedural(tipo: Enlace["tipo"]): boolean {
  return tipo === "agente" || tipo === "instrumento" || tipo === "consumo" || tipo === "resultado" || tipo === "efecto" || tipo === "invocacion";
}

interface ContextoReanclaje {
  aparienciaEnlaceId: Id;
  endpointActualId: Id;
  subprocesos: Array<{ id: Id; nombre: string }>;
}

function contextoReanclaje(modelo: Modelo, opdId: Id, enlace: Enlace): ContextoReanclaje | null {
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
    subprocesos: subprocesos.map((apariencia) => ({
      id: apariencia.entidadId,
      nombre: modelo.entidades[apariencia.entidadId]?.nombre ?? apariencia.entidadId,
    })),
  };
}

function dentroDeApariencia(apariencia: Apariencia, contorno: Apariencia): boolean {
  return (
    apariencia.x >= contorno.x &&
    apariencia.y >= contorno.y &&
    apariencia.x + apariencia.width <= contorno.x + contorno.width &&
    apariencia.y + apariencia.height <= contorno.y + contorno.height
  );
}

const multiplicidadSectionStyle = {
  display: "grid",
  gap: "2px",
  marginBottom: "14px",
} satisfies preact.JSX.CSSProperties;

const extremosSectionStyle = {
  display: "grid",
  gap: "8px",
  marginBottom: "14px",
} satisfies preact.JSX.CSSProperties;

const reanclajeSectionStyle = {
  display: "grid",
  gap: "8px",
  marginBottom: "14px",
} satisfies preact.JSX.CSSProperties;

const abanicoSectionStyle = {
  display: "grid",
  gap: "8px",
  marginBottom: "14px",
  padding: "8px",
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
} satisfies preact.JSX.CSSProperties;

const multiplicidadTitleStyle = {
  margin: "0 0 8px",
  color: "#1f2937",
  fontSize: "13px",
  fontWeight: 700,
} satisfies preact.JSX.CSSProperties;

const inputErrorStyle = {
  ...style.input,
  borderColor: "#d92d20",
  outlineColor: "#d92d20",
} satisfies preact.JSX.CSSProperties;

const errorStyle = {
  color: "#b42318",
  fontSize: "12px",
  fontWeight: 600,
} satisfies preact.JSX.CSSProperties;

const derivedBadgeStyle = {
  color: "#344054",
  fontSize: "12px",
  fontWeight: 700,
} satisfies preact.JSX.CSSProperties;

const helpStyle = {
  color: "#667085",
  fontSize: "12px",
  fontWeight: 600,
} satisfies preact.JSX.CSSProperties;

const buttonRowStyle = {
  display: "grid",
  gap: "8px",
  gridTemplateColumns: "1fr",
} satisfies preact.JSX.CSSProperties;
