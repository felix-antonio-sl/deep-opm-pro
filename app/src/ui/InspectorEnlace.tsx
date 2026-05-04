import { useEffect, useState } from "preact/hooks";
import { validarMultiplicidad } from "../modelo/operaciones";
import { useOpmStore } from "../store";
import type { Enlace } from "../modelo/tipos";
import { inspectorStyles as style } from "./inspectorStyles";

interface Props {
  enlace: Enlace;
}

export function InspectorEnlace({ enlace }: Props) {
  const modelo = useOpmStore((s) => s.modelo);
  const ajustarMultiplicidad = useOpmStore((s) => s.ajustarMultiplicidadSeleccionada);
  const eliminar = useOpmStore((s) => s.eliminarSeleccion);
  const origen = modelo.entidades[enlace.origenId];
  const destino = modelo.entidades[enlace.destinoId];
  const [multiplicidadOrigen, setMultiplicidadOrigen] = useState(enlace.multiplicidadOrigen ?? "");
  const [multiplicidadDestino, setMultiplicidadDestino] = useState(enlace.multiplicidadDestino ?? "");
  const errorOrigen = multiplicidadOrigen !== "" && !validarMultiplicidad(multiplicidadOrigen);
  const errorDestino = multiplicidadDestino !== "" && !validarMultiplicidad(multiplicidadDestino);

  useEffect(() => {
    setMultiplicidadOrigen(enlace.multiplicidadOrigen ?? "");
    setMultiplicidadDestino(enlace.multiplicidadDestino ?? "");
  }, [enlace.id, enlace.multiplicidadDestino, enlace.multiplicidadOrigen]);

  const cambiarMultiplicidad = (lado: "origen" | "destino", valor: string) => {
    if (lado === "origen") setMultiplicidadOrigen(valor);
    if (lado === "destino") setMultiplicidadDestino(valor);
    if (valor === "" || validarMultiplicidad(valor)) ajustarMultiplicidad(lado, valor);
  };

  return (
    <>
      <div style={style.header}>
        <span style={style.kind}>Enlace {capitalizar(enlace.tipo)}</span>
        <code style={style.id}>{enlace.id}</code>
      </div>

      <div style={style.summary}>
        <span>{origen?.nombre ?? enlace.origenId}</span>
        <span style={style.arrow}>{"->"}</span>
        <span>{destino?.nombre ?? enlace.destinoId}</span>
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

      <button type="button" style={style.dangerButton} onClick={eliminar}>Eliminar enlace</button>
    </>
  );
}

function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

const multiplicidadSectionStyle = {
  display: "grid",
  gap: "2px",
  marginBottom: "14px",
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
