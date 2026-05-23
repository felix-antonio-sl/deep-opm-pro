// Ronda 28 L5: etapa 1 Bauhaus — título grande, descripción ink-70, hint
// debajo del input.
import { S } from "./estilos";

interface Props {
  valor: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
}

export function EtapaFuncionPrincipal({ valor, onChange, onEnter }: Props) {
  return (
    <div>
      <h3 style={S.title}>Función principal</h3>
      <p style={S.desc}>
        ¿Cuál es la función principal del sistema? Es el proceso central
        que entrega valor al beneficiario. Suele ir en gerundio (ando/iendo)
        para reflejar la acción continua.
      </p>
      <input
        style={S.input}
        value={valor}
        onInput={(e) => onChange((e.target as HTMLInputElement).value)}
        onKeyDown={(e) => { if (e.key === "Enter") onEnter?.(); }}
        autoFocus
      />
      <p style={S.inputHint}>Ej: Conducir, Procesar pedidos</p>
    </div>
  );
}
