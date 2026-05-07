// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { TOTAL_ETAPAS } from "../../modelo/creacionWizard";
import { S } from "./estilos";
import { tokens } from "../tokens";

interface Atributo {
  nombre: string;
  estadoEntrada: string;
  estadoSalida: string;
}

interface Props {
  valor: Atributo | null;
  onChange: (v: Atributo | null) => void;
}

export function EtapaAtributo({ valor, onChange }: Props) {
  const a = valor ?? { nombre: "", estadoEntrada: "", estadoSalida: "" };
  const set = (patch: Partial<Atributo>) => onChange({ ...a, ...patch });
  return (
    <div>
      <h3 style={S.title}>Etapa 4 de {TOTAL_ETAPAS} — Atributo Relevante <span style={{ fontWeight: 400, color: tokens.colors.textoTerciario }}>(opcional)</span></h3>
      <p style={S.desc}>
        Si el beneficiario tiene un atributo que cambia con el proceso,
        indicalo aqui junto con su estado de entrada y salida.
      </p>
      <input
        style={{ ...S.input, marginBottom: "8px" }}
        placeholder="Atributo relevante (ej: Satisfaccion)"
        value={a.nombre}
        onInput={(e) => set({ nombre: (e.target as HTMLInputElement).value })}
      />
      <input
        style={{ ...S.input, marginBottom: "8px" }}
        placeholder="Estado de entrada (ej: insatisfecho)"
        value={a.estadoEntrada}
        onInput={(e) => set({ estadoEntrada: (e.target as HTMLInputElement).value })}
      />
      <input
        style={S.input}
        placeholder="Estado de salida (ej: satisfecho)"
        value={a.estadoSalida}
        onInput={(e) => set({ estadoSalida: (e.target as HTMLInputElement).value })}
      />
    </div>
  );
}
