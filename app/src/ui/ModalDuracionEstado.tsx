// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useEffect, useState } from "preact/hooks";
import { UNIDADES_TIEMPO } from "../modelo/objetoDuracion";
import { useOpmStore } from "../store";
import type { UnidadTiempo } from "../modelo/tipos";
import { Dialogo } from "./Dialogo";
import { tokens } from "./tokens";

export function ModalDuracionEstado() {
  const abierto = useOpmStore((s) => s.modalDuracionAbierto);
  const modelo = useOpmStore((s) => s.modelo);
  const cerrar = useOpmStore((s) => s.cerrarModalDuracion);
  const fijar = useOpmStore((s) => s.fijarDuracionEstado);
  const quitar = useOpmStore((s) => s.quitarDuracionEstado);
  const estado = abierto ? modelo.estados[abierto] : undefined;
  const [unidad, setUnidad] = useState<UnidadTiempo>("s");
  const [min, setMin] = useState("0");
  const [nominal, setNominal] = useState("1");
  const [max, setMax] = useState("1");

  useEffect(() => {
    if (!estado?.duracion) return;
    setUnidad(estado.duracion.unidad);
    setMin(String(estado.duracion.min));
    setNominal(String(estado.duracion.nominal));
    setMax(String(estado.duracion.max));
  }, [estado?.id, estado?.duracion]);

  return (
    <Dialogo
      open={abierto !== null}
      title={`Duración de ${estado?.nombre ?? "estado"}`}
      onCancel={cerrar}
      actions={(
        <>
          {estado?.duracion ? <button type="button" style={style.secondaryButton} onClick={() => estado && quitar(estado.id)}>Quitar</button> : null}
          <button type="button" style={style.secondaryButton} onClick={cerrar}>Cerrar</button>
          <button
            type="button"
            style={style.primaryButton}
            onClick={() => {
              if (!estado) return;
              fijar(estado.id, {
                unidad,
                min: Number(min),
                nominal: Number(nominal),
                max: Number(max),
              });
            }}
          >
            Aplicar
          </button>
        </>
      )}
    >
      <div style={style.body}>
        <label style={style.field}>
          <span style={style.label}>Unidad</span>
          <select style={style.input} value={unidad} onChange={(event) => setUnidad(event.currentTarget.value as UnidadTiempo)}>
            {UNIDADES_TIEMPO.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <div style={style.grid3}>
          <Numero label="Mínima" value={min} onInput={setMin} />
          <Numero label="Nominal" value={nominal} onInput={setNominal} />
          <Numero label="Máxima" value={max} onInput={setMax} />
        </div>
      </div>
    </Dialogo>
  );
}

function Numero(props: { label: string; value: string; onInput: (value: string) => void }) {
  return (
    <label style={style.field}>
      <span style={style.label}>{props.label}</span>
      <input
        type="number"
        step="any"
        style={style.input}
        value={props.value}
        onInput={(event) => props.onInput(event.currentTarget.value)}
      />
    </label>
  );
}

const style = {
  body: { display: "grid", gap: "12px", minWidth: "min(420px, calc(100vw - 80px))" },
  grid3: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "8px" },
  field: { display: "grid", gap: "4px" },
  label: { color: tokens.colors.textoTerciario, fontSize: "12px", fontWeight: 700 },
  input: { height: "34px", padding: "0 8px", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, fontSize: "13px" },
  primaryButton: { height: "34px", padding: "0 12px", border: `1px solid ${tokens.colors.chromeNeutral}`, borderRadius: tokens.radii.sm, background: tokens.colors.chromeNeutral, color: tokens.colors.fondoChrome, cursor: "pointer", fontWeight: 700 },
  secondaryButton: { height: "34px", padding: "0 14px", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoChrome, color: tokens.colors.textoSecundario, cursor: "pointer", fontSize: "13px", fontWeight: 700 },
} satisfies Record<string, preact.JSX.CSSProperties>;
