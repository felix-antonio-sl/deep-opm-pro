// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { inspectorStyles as style } from "../inspectorStyles";
import { tokens } from "../tokens";

/**
 * Descripción persistente de una cosa OPM. SSOT: [Glos 3.76] cosa =
 * objeto o proceso; la metadata se conserva en JSON por [Met §6].
 */
interface Props {
  descripcion?: string | undefined;
  onDescripcion: (value: string) => void;
}

export function SeccionDescripcion(props: Props) {
  return (
    <label style={style.field} data-testid="inspector-seccion-descripcion">
      <span style={style.label}>Descripción</span>
      <textarea
        data-testid="seccion-descripcion-cosa"
        style={advancedStyles.textarea}
        value={props.descripcion ?? ""}
        onInput={(event) => props.onDescripcion(event.currentTarget.value)}
      />
    </label>
  );
}

const advancedStyles = {
  textarea: {
    width: "100%",
    minHeight: "72px",
    padding: "8px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    outlineColor: tokens.colors.chromeNeutral,
    resize: "vertical",
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12px",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
