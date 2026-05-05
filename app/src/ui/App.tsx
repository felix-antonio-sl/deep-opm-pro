import { JointCanvas } from "../render/jointjs/JointCanvas";
import { ArbolOpd } from "./ArbolOpd";
import { ConfirmacionProvider } from "./ConfirmacionContext";
import { Inspector } from "./Inspector";
import { PanelAvisos } from "./PanelAvisos";
import { PanelOpl } from "./PanelOpl";
import { Timeline } from "./Timeline";
import { Toolbar } from "./Toolbar";

export function App() {
  return (
    <ConfirmacionProvider>
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
            <div style={layout.inspectorContent}>
              <Inspector />
            </div>
            <Timeline />
            <PanelAvisos />
          </div>
        </section>
        <PanelOpl />
      </main>
    </ConfirmacionProvider>
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
    display: "flex",
    flexDirection: "column",
  },
  inspectorContent: {
    minWidth: 0,
    minHeight: 0,
    flex: "1 1 auto",
    overflow: "auto",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
