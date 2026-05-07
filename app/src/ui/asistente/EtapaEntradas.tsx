// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useState } from "preact/hooks";
import { TOTAL_ETAPAS } from "../../modelo/creacionWizard";
import { S } from "./estilos";
import { tokens } from "../tokens";

interface Props {
  valor: string[];
  onChange: (v: string[]) => void;
}

export function EtapaEntradas({ valor, onChange }: Props) {
  const [nuevo, setNuevo] = useState("");
  const agregar = () => {
    const t = nuevo.trim();
    if (t.length === 0) return;
    if (valor.some((a) => a.toLowerCase() === t.toLowerCase())) return;
    onChange([...valor, t]);
    setNuevo("");
  };
  return (
    <div>
      <h3 style={S.title}>Etapa 8 de {TOTAL_ETAPAS} — Entradas <span style={{ fontWeight: 400, color: tokens.colors.textoTerciario }}>(opcional)</span></h3>
      <p style={S.desc}>
        ¿Que objetos consume o transforma el proceso? Son las entradas
        del sistema.
      </p>
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
        {valor.map((e, i) => (
          <span key={i} style={S.itemTag}>
            {e}
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
      <div style={{ display: "flex", gap: "6px" }}>
        <input
          style={S.input}
          placeholder="Nombre de la entrada"
          value={nuevo}
          onInput={(e) => setNuevo((e.target as HTMLInputElement).value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); agregar(); } }}
        />
        <button type="button" style={S.btn(false)} onClick={agregar}>Agregar</button>
      </div>
    </div>
  );
}
