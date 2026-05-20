// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { TOTAL_ETAPAS } from "../../modelo/creacionWizard";
import { S } from "./estilos";
import { tokens } from "../tokens";

interface Props {
  cosas: string[];
  seleccionados: string[];
  onToggle: (v: string[]) => void;
}

export function EtapaAmbientales({ cosas, seleccionados, onToggle }: Props) {
  if (cosas.length === 0) {
    return (
      <div>
        <h3 style={S.title}>Etapa 10 de {TOTAL_ETAPAS} — Objetos Ambientales <span style={{ fontWeight: 400, color: tokens.colors.textoTerciario }}>(opcional)</span></h3>
        <p style={S.desc}>
          No hay objetos creados todavía. Puedes marcar objetos como
          ambientales más tarde desde el inspector.
        </p>
      </div>
    );
  }
  return (
    <div>
      <h3 style={S.title}>Etapa 10 de {TOTAL_ETAPAS} — Objetos Ambientales <span style={{ fontWeight: 400, color: tokens.colors.textoTerciario }}>(opcional)</span></h3>
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
