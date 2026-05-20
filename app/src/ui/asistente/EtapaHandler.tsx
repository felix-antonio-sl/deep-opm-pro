import { useState } from "preact/hooks";
import { TOTAL_ETAPAS } from "../../modelo/creacionWizard";
import { S } from "./estilos";

interface Props {
  esHandler: boolean;
  agentes: string[];
  onEsHandler: (v: boolean) => void;
  onAgentes: (v: string[]) => void;
}

export function EtapaHandler({ esHandler, agentes, onEsHandler, onAgentes }: Props) {
  const [nuevo, setNuevo] = useState("");
  const agregar = () => {
    const t = nuevo.trim();
    if (t.length === 0) return;
    if (agentes.some((a) => a.toLowerCase() === t.toLowerCase())) return;
    onAgentes([...agentes, t]);
    setNuevo("");
  };
  return (
    <div>
      <h3 style={S.title}>Etapa 5 de {TOTAL_ETAPAS} — Handler del Sistema</h3>
      <p style={S.desc}>
        El handler es el agente humano que opera el sistema. Puede ser el
        mismo beneficiario u otra persona.
      </p>
      <label style={S.checkbox}>
        <input
          type="checkbox"
          checked={esHandler}
          onChange={(e) => onEsHandler((e.target as HTMLInputElement).checked)}
        />
        <span style={S.checkboxLabel}>El beneficiario es también el handler del sistema</span>
      </label>
      {!esHandler && (
        <div style={{ marginTop: "10px" }}>
          <p style={S.desc}>Agentes adicionales (presiona Enter para agregar):</p>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
            {agentes.map((a, i) => (
              <span key={i} style={S.itemTag}>
                {a}
                <button
                  type="button"
                  onClick={() => onAgentes(agentes.filter((_, j) => j !== i))}
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
              placeholder="Nombre del agente"
              value={nuevo}
              onInput={(e) => setNuevo((e.target as HTMLInputElement).value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); agregar(); } }}
            />
            <button type="button" style={S.btn(false)} onClick={agregar}>Agregar</button>
          </div>
        </div>
      )}
    </div>
  );
}
