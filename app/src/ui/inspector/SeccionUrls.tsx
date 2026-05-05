import type { Id, UrlObjetoTipada } from "../../modelo/tipos";
import { inspectorStyles as style } from "../inspectorStyles";

interface Props {
  entidadId: Id;
  urls?: UrlObjetoTipada[] | undefined;
  onAbrirUrls: (entidadId: Id) => void;
}

export function SeccionUrls(props: Props) {
  return (
    <div data-testid="inspector-entidad-acciones" style={advancedStyles.actions}>
      <button type="button" style={style.secondaryButton} onClick={() => props.onAbrirUrls(props.entidadId)}>
        URLs ({props.urls?.length ?? 0})
      </button>
    </div>
  );
}

const advancedStyles = {
  actions: { display: "flex", gap: "8px", flexWrap: "wrap" },
} satisfies Record<string, preact.JSX.CSSProperties>;
