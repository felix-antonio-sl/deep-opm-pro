import type { ComponentChildren } from "preact";
import { tokens } from "../tokens";

interface CodexCanvasMountProps {
  children: ComponentChildren;
  floating?: ComponentChildren;
}

export function CodexCanvasMount({ children, floating }: CodexCanvasMountProps) {
  return (
    <div data-testid="canvas-pane" style={style.canvas}>
      {children}
      {floating ? <div style={style.floating}>{floating}</div> : null}
    </div>
  );
}

const style = {
  canvas: {
    gridArea: "canvas",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
    position: "relative",
    background: tokens.colors.paperWarm,
  },
  floating: {
    position: "absolute",
    left: "16px",
    top: "16px",
    zIndex: 12,
    pointerEvents: "none",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
