import { TOTAL_ETAPAS } from "../../modelo/creacionWizard";
import { S } from "./estilos";

interface Props {
  valor: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
}

export function EtapaNombreSistema({ valor, onChange, onEnter }: Props) {
  return (
    <div>
      <h3 style={S.title}>Etapa 6 de {TOTAL_ETAPAS} — Nombre del Sistema</h3>
      <p style={S.desc}>
        ¿Como se llama el sistema? Por defecto se usa el nombre del proceso
        principal seguido de "System", pero puedes personalizarlo.
      </p>
      <input
        style={S.input}
        placeholder="Ej: Sistema de Conduccion"
        value={valor}
        onInput={(e) => onChange((e.target as HTMLInputElement).value)}
        onKeyDown={(e) => { if (e.key === "Enter") onEnter?.(); }}
        autoFocus
      />
    </div>
  );
}
