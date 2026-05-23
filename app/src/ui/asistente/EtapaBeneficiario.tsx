// Ronda 28 L5: etapa 2 Bauhaus.
import { S } from "./estilos";

interface Props {
  valor: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
}

export function EtapaBeneficiario({ valor, onChange, onEnter }: Props) {
  return (
    <div>
      <h3 style={S.title}>Beneficiario</h3>
      <p style={S.desc}>
        ¿Quién es el beneficiario principal del sistema? Es la persona o
        grupo que recibe el valor generado por la función principal.
      </p>
      <input
        style={S.input}
        value={valor}
        onInput={(e) => onChange((e.target as HTMLInputElement).value)}
        onKeyDown={(e) => { if (e.key === "Enter") onEnter?.(); }}
        autoFocus
      />
      <p style={S.inputHint}>Ej: Conductor, Cliente</p>
    </div>
  );
}
