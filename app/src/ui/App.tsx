import { JointCanvas } from "../render/jointjs/JointCanvas";
import { Inspector } from "./Inspector";
import { PanelOpl } from "./PanelOpl";
import { Toolbar } from "./Toolbar";

export function App() {
  return (
    <main style={layout.page}>
      <Toolbar />
      <section style={layout.workbench}>
        <JointCanvas />
        <Inspector />
      </section>
      <PanelOpl />
    </main>
  );
}

const layout = {
  page: {
    display: "grid",
    gridTemplateRows: "48px minmax(0, 1fr) 180px",
    width: "100%",
    height: "100%",
    background: "#f5f7fb",
  },
  workbench: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 300px",
    minHeight: 0,
    overflow: "hidden",
    borderTop: "1px solid #d9e0ea",
    borderBottom: "1px solid #d9e0ea",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
