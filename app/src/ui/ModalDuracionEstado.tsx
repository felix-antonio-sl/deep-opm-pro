// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useEffect, useState } from "preact/hooks";
import { useModalDuracionEstadoViewModel } from "../app/viewmodels/modalDuracionEstadoViewModel";
import { UNIDADES_TIEMPO } from "../modelo/objetoDuracion";
import type { UnidadTiempo } from "../modelo/tipos";
import { Dialogo } from "./Dialogo";
import { tokens } from "./tokens";

export function ModalDuracionEstado() {
  const { abierto, estado, cerrar, fijar, quitar } = useModalDuracionEstadoViewModel();
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

// Ronda 28 L5: Bauhaus monocromático. Labels uppercase tracking +0.08em ink-50.
const style = {
  body: { display: "grid", gap: "14px", minWidth: "min(420px, calc(100vw - 80px))" },
  grid3: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px" },
  field: { display: "grid", gap: "6px" },
  label: { color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" },
  input: { height: "34px", padding: "0 10px", border: `1px solid ${tokens.colors.ink15}`, borderRadius: 0, background: tokens.colors.paper, color: tokens.colors.ink, fontFamily: tokens.typography.familyChrome, fontSize: "13px", caretColor: tokens.colors.accent },
  primaryButton: { minHeight: "32px", padding: "8px 18px", border: `${tokens.stroke.base}px solid ${tokens.colors.ink}`, borderRadius: 0, background: tokens.colors.ink, color: tokens.colors.paper, cursor: "pointer", fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 500 },
  secondaryButton: { minHeight: "32px", padding: "8px 18px", border: `${tokens.stroke.base}px solid ${tokens.colors.ink}`, borderRadius: 0, background: tokens.colors.paper, color: tokens.colors.ink, cursor: "pointer", fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 500 },
} satisfies Record<string, preact.JSX.CSSProperties>;
