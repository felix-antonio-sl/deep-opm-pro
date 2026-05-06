import { useState } from "preact/hooks";
import { TOTAL_ETAPAS, VERBOS_SALIDA, VERBO_SALIDA_ES, type VerboSalida } from "../../modelo/creacionWizard";
import { S } from "./estilos";

export interface ItemSalida {
  nombre: string;
  verbo: VerboSalida;
}

interface Props {
  valor: ItemSalida[];
  onChange: (v: ItemSalida[]) => void;
}

export function EtapaSalidas({ valor, onChange }: Props) {
  const [nombre, setNombre] = useState("");
  const [verbo, setVerbo] = useState<VerboSalida>("creates");
  const agregar = () => {
    const t = nombre.trim();
    if (t.length === 0) return;
    if (valor.some((s) => s.nombre.toLowerCase() === t.toLowerCase())) return;
    onChange([...valor, { nombre: t, verbo }]);
    setNombre("");
    setVerbo("creates");
  };
  return (
    <div>
      <h3 style={S.title}>Etapa 9 de {TOTAL_ETAPAS} — Salidas <span style={{ fontWeight: 400, color: "#667085" }}>(opcional)</span></h3>
      <p style={S.desc}>
        ¿Que objetos produce el proceso? Pueden ser creados, afectados o
        cambiados por el proceso.
      </p>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
        {valor.map((s, i) => (
          <span key={i} style={S.itemTag}>
            {s.nombre} ({VERBO_SALIDA_ES[s.verbo]})
            <button
              type="button"
              onClick={() => onChange(valor.filter((_, j) => j !== i))}
              style={{ marginLeft: "6px", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        <input
          style={S.input}
          placeholder="Nombre de la salida"
          value={nombre}
          onInput={(e) => setNombre((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); agregar(); } }}
        />
        <select
          style={S.select}
          value={verbo}
          onChange={(e) => setVerbo((e.target as HTMLSelectElement).value as VerboSalida)}
        >
          {VERBOS_SALIDA.map((v) => (
            <option key={v} value={v}>{VERBO_SALIDA_ES[v]}</option>
          ))}
        </select>
        <button type="button" style={S.btn(false)} onClick={agregar}>Agregar</button>
      </div>
    </div>
  );
}
