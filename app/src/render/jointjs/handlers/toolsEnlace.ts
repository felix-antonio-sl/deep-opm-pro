import { dia, linkTools } from "jointjs";
import { metadata } from "./helpers";

/**
 * Instalación/desinstalación de link tools de JointJS sobre el enlace
 * seleccionado: Boundary (handles), Vertices (drag/add), Segments (split).
 * Se llama en el useEffect de proyección cuando cambia enlaceSeleccionId.
 *
 * Refs: docs/HANDOFF.md §Decisiones Vigentes (vertices manuales y reanclaje ronda 6).
 */

export interface AdapterMin {
  graph: dia.Graph;
  paper: dia.Paper;
}

export function instalarHerramientasEnlaceSeleccionado(adapter: AdapterMin, enlaceSeleccionId: string | null): void {
  if (!enlaceSeleccionId) return;
  const link = adapter.graph.getLinks().find((cell) => {
    const meta = metadata(cell);
    return meta?.kind === "enlace" && meta.enlaceId === enlaceSeleccionId;
  });
  if (!link) return;
  const meta = metadata(link);
  if (meta?.kind === "enlace" && meta.tipo === "agregacion") return;
  const linkView = adapter.paper.findViewByModel<dia.LinkView>(link);
  linkView.removeTools();
  linkView.addTools(
    new dia.ToolsView({
      tools: [
        new linkTools.Boundary({
          padding: 18,
          useModelGeometry: true,
        }),
        new linkTools.Vertices({
          redundancyRemoval: false,
          snapRadius: 4,
          vertexAdding: true,
        }),
        new linkTools.Segments({
          redundancyRemoval: false,
          snapRadius: 4,
        }),
      ],
    }),
  );
}
