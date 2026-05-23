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
      <span class="opm-label-uppercase" style={style.label}>Descripción</span>
      <textarea
        data-testid="seccion-descripcion-cosa"
        style={advancedStyles.textarea}
        value={props.descripcion ?? ""}
        onInput={(event) => props.onDescripcion(event.currentTarget.value)}
      />
    </label>
  );
}

// Ronda 28 L3: textarea Bauhaus — border 1px ink-15, padding 7 10, caret cinabrio.
const advancedStyles = {
  textarea: {
    width: "100%",
    minHeight: "72px",
    padding: "7px 10px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    outlineColor: tokens.colors.focus,
    caretColor: tokens.colors.accent,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    resize: "vertical" as const,
    fontFamily: tokens.typography.familyChrome,
    fontSize: `${tokens.typography.sizes.base}px`,
    lineHeight: 1.5,
    boxSizing: "border-box" as const,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
