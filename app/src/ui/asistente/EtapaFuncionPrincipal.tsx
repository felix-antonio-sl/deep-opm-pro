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
      <h3 style={S.title}>Etapa 1 de {TOTAL_ETAPAS} — Función principal</h3>
      <p style={S.desc}>
        ¿Cuál es la función principal del sistema? Es el proceso central
        que entrega valor al beneficiario. Suele ir en gerundio (ando/iendo)
        para reflejar la acción continua.
      </p>
      <input
        style={S.input}
        placeholder="Ej: Conducir, Procesar pedidos"
        value={valor}
        onInput={(e) => onChange((e.target as HTMLInputElement).value)}
        onKeyDown={(e) => { if (e.key === "Enter") onEnter?.(); }}
        autoFocus
      />
    </div>
  );
}
