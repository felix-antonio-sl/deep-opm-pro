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
  const tools: dia.ToolView[] = [
    new linkTools.Boundary({
      padding: 18,
      useModelGeometry: true,
    }),
    new linkTools.SourceArrowhead({
      scale: 1.05,
      focusOpacity: 0.85,
    }),
    new linkTools.TargetArrowhead({
      scale: 1.05,
      focusOpacity: 0.85,
    }),
    new linkTools.Vertices({
      redundancyRemoval: false,
      snapRadius: 4,
      vertexAdding: true,
    }),
  ];

  if (routerAdmiteSegmentsTool(routerDeLink(link))) {
    tools.push(
      new linkTools.Segments({
        redundancyRemoval: false,
        snapRadius: 4,
      }),
    );
  }

  linkView.addTools(
    new dia.ToolsView({
      tools,
    }),
  );
}

export function routerAdmiteSegmentsTool(router: unknown): boolean {
  if (router == null) return true;
  if (typeof router === "string") return router === "normal";
  if (!esRegistro(router)) return false;
  const name = router.name;
  return typeof name === "string" && name === "normal";
}

function routerDeLink(link: dia.Link): unknown {
  return (link as dia.Link & { get: (key: string) => unknown }).get("router");
}

function esRegistro(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
