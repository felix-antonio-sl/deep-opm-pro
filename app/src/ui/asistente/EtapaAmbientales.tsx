import { TOTAL_ETAPAS } from "../../modelo/creacionWizard";
import { S } from "./estilos";

interface Props {
  cosas: string[];
  seleccionados: string[];
  onToggle: (v: string[]) => void;
}

export function EtapaAmbientales({ cosas, seleccionados, onToggle }: Props) {
  if (cosas.length === 0) {
    return (
      <div>
        <h3 style={S.title}>Etapa 10 de {TOTAL_ETAPAS} — Objetos Ambientales <span style={{ fontWeight: 400, color: "#667085" }}>(opcional)</span></h3>
        <p style={S.desc}>
          No hay objetos creados todavia. Puedes marcar objetos como
          ambientales mas tarde desde el inspector.
        </p>
      </div>
    );
  }
  return (
    <div>
      <h3 style={S.title}>Etapa 10 de {TOTAL_ETAPAS} — Objetos Ambientales <span style={{ fontWeight: 400, color: "#667085" }}>(opcional)</span></h3>
      <p style={S.desc}>
        Marca los objetos que son externos al sistema (ambientales).
      </p>
      {cosas.map((c) => (
        <label key={c} style={S.checkbox}>
          <input
            type="checkbox"
            checked={seleccionados.includes(c)}
            onChange={() => {
              if (seleccionados.includes(c)) {
                onToggle(seleccionados.filter((s) => s !== c));
              } else {
                onToggle([...seleccionados, c]);
              }
            }}
          />
          <span style={S.checkboxLabel}>{c}</span>
        </label>
      ))}
    </div>
  );
}
