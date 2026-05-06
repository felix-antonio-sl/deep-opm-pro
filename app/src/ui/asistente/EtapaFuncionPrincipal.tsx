import { TOTAL_ETAPAS } from "../../modelo/creacionWizard";
import { S } from "./estilos";

interface Props {
  valor: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
}

export function EtapaFuncionPrincipal({ valor, onChange, onEnter }: Props) {
  return (
    <div>
      <h3 style={S.title}>Etapa 2 de {TOTAL_ETAPAS} — Funcion Principal</h3>
      <p style={S.desc}>
        ¿Cual es la funcion principal del sistema? Es el proceso central
        que entrega valor al beneficiario. Debe terminar en "ing" o su
        equivalente en espanol (ando/iendo).
      </p>
      <input
        style={S.input}
        placeholder="Ej: Conducir, Procesar Pedidos"
        value={valor}
        onInput={(e) => onChange((e.target as HTMLInputElement).value)}
        onKeyDown={(e) => { if (e.key === "Enter") onEnter?.(); }}
        autoFocus
      />
    </div>
  );
}
