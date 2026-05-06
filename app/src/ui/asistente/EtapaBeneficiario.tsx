import { TOTAL_ETAPAS } from "../../modelo/creacionWizard";
import { S } from "./estilos";

interface Props {
  valor: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
}

export function EtapaBeneficiario({ valor, onChange, onEnter }: Props) {
  return (
    <div>
      <h3 style={S.title}>Etapa 3 de {TOTAL_ETAPAS} — Beneficiario</h3>
      <p style={S.desc}>
        ¿Quien es el beneficiario principal del sistema? Es la persona o grupo
        que recibe el valor generado por la funcion principal.
      </p>
      <input
        style={S.input}
        placeholder="Ej: Conductor, Cliente"
        value={valor}
        onInput={(e) => onChange((e.target as HTMLInputElement).value)}
        onKeyDown={(e) => { if (e.key === "Enter") onEnter?.(); }}
        autoFocus
      />
    </div>
  );
}
