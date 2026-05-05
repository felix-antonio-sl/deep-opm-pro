import { useEffect, useState } from "preact/hooks";
import { abanicoDeEnlace } from "../modelo/abanicos";
import { etiquetaEnlaceNormalizada, validarEtiquetaEnlace } from "../modelo/etiquetasEnlace";
import { entidadDeExtremo, entidadIdDeExtremo, extremoEntidad, extremoEstado, nombreExtremo } from "../modelo/extremos";
import { estadosDeEntidad, validarMultiplicidad } from "../modelo/operaciones";
import { enlaceAdmiteRuta } from "../modelo/rutas";
import { useOpmStore } from "../store";
import type { Abanico, Apariencia, Enlace, ExtremoEnlace, Id, Modelo, Modificador, OperadorAbanico } from "../modelo/tipos";
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
  const aplicarModificador = useOpmStore((s) => s.aplicarModificadorEnlaceSeleccionado);
  const quitarModificador = useOpmStore((s) => s.quitarModificadorEnlaceSeleccionado);
  const definirProbabilidadEvento = useOpmStore((s) => s.definirProbabilidadEventoSeleccionada);
  const definirDemoraInvocacion = useOpmStore((s) => s.definirDemoraInvocacionSeleccionada);
  const renombrarEtiquetaEnlace = useOpmStore((s) => s.renombrarEtiquetaEnlaceSeleccionado);
  const definirRutaEtiqueta = useOpmStore((s) => s.definirRutaEtiquetaSeleccionada);
  const eliminar = useOpmStore((s) => s.eliminarSeleccion);
  const abanico = abanicoDeEnlace(modelo, enlace.id);
  const origen = entidadDeExtremo(modelo, enlace.origenId);
  const destino = entidadDeExtremo(modelo, enlace.destinoId);
  const selectoresExtremo = selectoresEstadoExtremo(modelo, enlace);
  const reanclaje = contextoReanclaje(modelo, opdActivoId, enlace);
  const endpointActual = reanclaje?.endpointActualId ?? "";
  const [multiplicidadOrigen, setMultiplicidadOrigen] = useState(enlace.multiplicidadOrigen ?? "");
  const [multiplicidadDestino, setMultiplicidadDestino] = useState(enlace.multiplicidadDestino ?? "");
  const [probabilidad, setProbabilidad] = useState(enlace.probabilidad === undefined ? "" : String(enlace.probabilidad));
  const [demora, setDemora] = useState(enlace.demora ?? "");
  const [etiqueta, setEtiqueta] = useState(enlace.etiqueta);
  const [rutaEtiqueta, setRutaEtiqueta] = useState(enlace.rutaEtiqueta ?? "");
  const [endpointSeleccionado, setEndpointSeleccionado] = useState(endpointActual);
  const errorOrigen = multiplicidadOrigen !== "" && !validarMultiplicidad(multiplicidadOrigen);
  const errorDestino = multiplicidadDestino !== "" && !validarMultiplicidad(multiplicidadDestino);
  const errorProbabilidad = probabilidad !== "" && !probabilidadValida(probabilidad);
  const etiquetaNormalizada = etiquetaEnlaceNormalizada(etiqueta);
  const errorEtiqueta = validarEtiquetaEnlace(enlace, etiquetaNormalizada);

  useEffect(() => {
    setMultiplicidadOrigen(enlace.multiplicidadOrigen ?? "");
    setMultiplicidadDestino(enlace.multiplicidadDestino ?? "");
  }, [enlace.id, enlace.multiplicidadDestino, enlace.multiplicidadOrigen]);

  useEffect(() => {
    setProbabilidad(enlace.probabilidad === undefined ? "" : String(enlace.probabilidad));
    setDemora(enlace.demora ?? "");
    setEtiqueta(enlace.etiqueta);
    setRutaEtiqueta(enlace.rutaEtiqueta ?? "");
  }, [enlace.id, enlace.probabilidad, enlace.demora, enlace.etiqueta, enlace.rutaEtiqueta]);

  useEffect(() => {
    setEndpointSeleccionado(endpointActual);
  }, [enlace.id, endpointActual]);

  const cambiarMultiplicidad = (lado: "origen" | "destino", valor: string) => {
    if (lado === "origen") setMultiplicidadOrigen(valor);
    if (lado === "destino") setMultiplicidadDestino(valor);
    if (valor === "" || validarMultiplicidad(valor)) ajustarMultiplicidad(lado, valor);
  };

  const cambiarModificador = (valor: string) => {
    if (valor === "") {
      quitarModificador();
      return;
    }
    aplicarModificador(valor as Modificador);
  };

  const cambiarProbabilidad = (valor: string) => {
    setProbabilidad(valor);
    if (valor === "") {
      definirProbabilidadEvento(undefined);
      return;
    }
    if (probabilidadValida(valor)) definirProbabilidadEvento(Number(valor));
  };

  const cambiarDemora = (valor: string) => {
    setDemora(valor);
    definirDemoraInvocacion(valor.trim() === "" ? undefined : valor);
  };

  const cambiarEtiqueta = (valor: string) => {
    setEtiqueta(valor);
    const normalizada = etiquetaEnlaceNormalizada(valor);
    if (validarEtiquetaEnlace(enlace, normalizada).ok) renombrarEtiquetaEnlace(valor);
  };

  const cambiarRutaEtiqueta = (valor: string) => {
    setRutaEtiqueta(valor);
    definirRutaEtiqueta(valor.trim() === "" ? undefined : valor);
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

      <section style={etiquetaSectionStyle}>
        <h3 style={multiplicidadTitleStyle}>Etiqueta</h3>
        <label style={style.field}>
          <span style={style.label}>Etiqueta</span>
          <input
            data-testid="enlace-etiqueta-input"
            aria-invalid={!errorEtiqueta.ok}
            placeholder="componente crítico"
            style={!errorEtiqueta.ok ? inputErrorStyle : style.input}
            value={etiqueta}
            onInput={(event) => cambiarEtiqueta(event.currentTarget.value)}
          />
          {!errorEtiqueta.ok ? <span role="alert" style={errorStyle}>{errorEtiqueta.error}</span> : null}
        </label>
      </section>

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

      {enlaceProcedural(enlace.tipo) ? (
        <section style={modificadorSectionStyle}>
          <h3 style={multiplicidadTitleStyle}>Modificador</h3>
          <label style={style.field}>
            <span style={style.label}>Tipo</span>
            <select
              data-testid="modificador-enlace-select"
              style={style.input}
              value={enlace.modificador ?? ""}
              onChange={(event) => cambiarModificador(event.currentTarget.value)}
            >
              <option value="">Ninguno</option>
              <option value="condicion">Condición</option>
              <option value="evento">Evento</option>
              {enlace.tipo !== "invocacion" ? <option value="no">NO</option> : null}
            </select>
          </label>
          {enlace.modificador === "evento" ? (
            <label style={style.field}>
              <span style={style.label}>Probabilidad</span>
              <input
                data-testid="probabilidad-evento-input"
                aria-invalid={errorProbabilidad}
                placeholder="0.7"
                style={errorProbabilidad ? inputErrorStyle : style.input}
                value={probabilidad}
                onInput={(event) => cambiarProbabilidad(event.currentTarget.value)}
              />
              {errorProbabilidad ? <span role="alert" style={errorStyle}>Usa un número entre 0 y 1</span> : null}
            </label>
          ) : null}
          {enlace.tipo === "invocacion" ? (
            <label style={style.field}>
              <span style={style.label}>Demora</span>
              <input
                data-testid="demora-invocacion-input"
                placeholder="1s, 5 min"
                style={style.input}
                value={demora}
                onInput={(event) => cambiarDemora(event.currentTarget.value)}
              />
            </label>
          ) : null}
        </section>
      ) : null}

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

      {enlaceAdmiteRuta(modelo, enlace.id) ? (
        <section style={rutaSectionStyle}>
          <h3 style={multiplicidadTitleStyle}>Ruta</h3>
          <label style={style.field}>
            <span style={style.label}>Etiqueta</span>
            <input
              data-testid="ruta-etiqueta-input"
              placeholder="exitoso"
              style={style.input}
              value={rutaEtiqueta}
              onInput={(event) => cambiarRutaEtiqueta(event.currentTarget.value)}
            />
          </label>
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

function probabilidadValida(value: string): boolean {
  if (!/^(?:0(?:\.\d+)?|1(?:\.0+)?)$/.test(value)) return false;
  const numero = Number(value);
  return Number.isFinite(numero) && numero >= 0 && numero <= 1;
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

const etiquetaSectionStyle = {
  display: "grid",
  gap: "8px",
  marginBottom: "14px",
  padding: "8px",
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
} satisfies preact.JSX.CSSProperties;

const modificadorSectionStyle = {
  display: "grid",
  gap: "8px",
  marginBottom: "14px",
  padding: "8px",
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
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

const rutaSectionStyle = {
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
