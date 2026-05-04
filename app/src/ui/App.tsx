import { JointCanvas } from "../render/jointjs/JointCanvas";
import { ArbolOpd } from "./ArbolOpd";
import { Inspector } from "./Inspector";
import { PanelOpl } from "./PanelOpl";
import { Toolbar } from "./Toolbar";

export function App() {
  return (
    <main style={layout.page}>
      <Toolbar />
      <section style={layout.workbench}>
        <div data-testid="tree-pane" style={layout.treePane}>
          <ArbolOpd />
        </div>
        <div data-testid="canvas-pane" style={layout.canvasPane}>
          <JointCanvas />
        </div>
        <div data-testid="inspector-pane" style={layout.inspectorPane}>
          <Inspector />
        </div>
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
    gridTemplateColumns: "220px minmax(0, 1fr) 300px",
    gridTemplateAreas: `"tree canvas inspector"`,
    minHeight: 0,
    minWidth: 0,
    overflow: "hidden",
    borderTop: "1px solid #d9e0ea",
    borderBottom: "1px solid #d9e0ea",
  },
  treePane: {
    gridArea: "tree",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
  },
  canvasPane: {
    gridArea: "canvas",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
    position: "relative",
  },
  inspectorPane: {
    gridArea: "inspector",
    minWidth: 0,
    minHeight: 0,
    overflow: "hidden",
    position: "relative",
    zIndex: 1,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
