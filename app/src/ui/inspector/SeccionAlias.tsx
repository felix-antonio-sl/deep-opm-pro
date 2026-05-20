import { inspectorStyles as style } from "../inspectorStyles";

interface Props {
  alias?: string | undefined;
  unidad?: string | undefined;
  onAlias: (value: string) => void;
  onUnidad: (value: string) => void;
}

export function SeccionAlias(props: Props) {
  return (
    <div style={sectionStyles.grid2} data-testid="inspector-seccion-alias">
      <label style={style.field}>
        <span style={style.label}>Alias</span>
        {/* Ronda23 L1 #14: placeholders con ejemplo concreto en vez de slugs
            `{alias}`/`[unidad]` que se leían como variables sin sustituir. */}
        <input style={style.input} value={props.alias ?? ""} onInput={(event) => props.onAlias(event.currentTarget.value)} placeholder="ej: cliente" />
      </label>
      <label style={style.field}>
        <span style={style.label}>Unidad</span>
        <input style={style.input} value={props.unidad ?? ""} onInput={(event) => props.onUnidad(event.currentTarget.value)} placeholder="ej: kg" />
      </label>
    </div>
  );
}

const sectionStyles = {
  grid2: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "8px" },
} satisfies Record<string, preact.JSX.CSSProperties>;
