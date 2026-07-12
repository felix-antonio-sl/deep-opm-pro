import { dia, linkTools } from "jointjs";
import type { OpmJointMetadata } from "../proyeccionTipos";
import { metadata } from "./helpers";

/**
 * Instalación/desinstalación de link tools de JointJS sobre el enlace
 * seleccionado: Boundary (handles), Vertices (drag/add), Segments (split).
 * Se llama en el useEffect de proyección cuando cambia enlaceSeleccionId.
 *
 */

export interface AdapterMin {
  graph: dia.Graph;
  paper: dia.Paper;
}

export function instalarHerramientasEnlaceSeleccionado(adapter: AdapterMin, enlaceSeleccionId: string | null): void {
  if (!enlaceSeleccionId) return;
  const links = linksParaHerramientasEnlaceSeleccionado(adapter.graph.getLinks(), enlaceSeleccionId);
  for (const link of links) {
    const meta = metadata(link);
    if (meta?.kind !== "enlace") continue;
    if (meta.tipo === "agregacion") continue;
    const linkView = adapter.paper.findViewByModel<dia.LinkView>(link);
    linkView.removeTools();
    linkView.addTools(new dia.ToolsView({ tools: crearHerramientasEnlace(link, meta) }));
  }
}

export function linksParaHerramientasEnlaceSeleccionado(links: dia.Link[], enlaceSeleccionId: string | null): dia.Link[] {
  if (!enlaceSeleccionId) return [];
  const candidatos = links.filter((cell) => {
    const meta = metadata(cell);
    return meta?.kind === "enlace" && meta.enlaceId === enlaceSeleccionId;
  });
  const tramosAutoInvocacion = candidatos.filter((cell) => {
    const meta = metadata(cell);
    return meta?.kind === "enlace" && !!meta.rolInvocacion;
  });
  if (tramosAutoInvocacion.length > 0) return tramosAutoInvocacion;
  return candidatos.slice(0, 1);
}

export function ladosReanclablesPorMeta(meta: OpmJointMetadata | null): Array<"origen" | "destino"> {
  if (meta?.kind !== "enlace") return [];
  if (meta.rolInvocacion === "auto-salida") return ["origen"];
  if (meta.rolInvocacion === "auto-retorno") return ["destino"];
  return ["origen", "destino"];
}

function crearHerramientasEnlace(link: dia.Link, meta: Extract<OpmJointMetadata, { kind: "enlace" }>): dia.ToolView[] {
  const ladosReanclables = ladosReanclablesPorMeta(meta);
  const tools: dia.ToolView[] = [
    new linkTools.Boundary({
      padding: 18,
      useModelGeometry: true,
    }),
  ];

  if (ladosReanclables.includes("origen")) {
    tools.push(new linkTools.SourceArrowhead({
      scale: 1.05,
      focusOpacity: 0.85,
    }));
  }
  if (ladosReanclables.includes("destino")) {
    tools.push(new linkTools.TargetArrowhead({
      scale: 1.05,
      focusOpacity: 0.85,
    }));
  }
  if (!meta.rolInvocacion) {
    tools.push(
      new linkTools.Vertices({
        redundancyRemoval: false,
        snapRadius: 4,
        vertexAdding: true,
      }),
    );
    if (admiteSegmentsTool(routerDeLink(link), connectorDeLink(link))) {
      tools.push(
        new linkTools.Segments({
          redundancyRemoval: false,
          snapRadius: 4,
        }),
      );
    }
  }
  return tools;
}

export function routerAdmiteSegmentsTool(router: unknown): boolean {
  if (router == null) return true;
  if (typeof router === "string") return router === "normal";
  if (!esRegistro(router)) return false;
  const name = router.name;
  return typeof name === "string" && name === "normal";
}

export function connectorAdmiteSegmentsTool(connector: unknown): boolean {
  if (connector == null) return true;
  if (typeof connector === "string") return connector === "straight" || connector === "normal";
  if (!esRegistro(connector)) return false;
  const name = connector.name;
  return typeof name === "string" && (name === "straight" || name === "normal");
}

export function admiteSegmentsTool(router: unknown, connector: unknown): boolean {
  return routerAdmiteSegmentsTool(router) && connectorAdmiteSegmentsTool(connector);
}

function routerDeLink(link: dia.Link): unknown {
  return (link as dia.Link & { get: (key: string) => unknown }).get("router");
}

function connectorDeLink(link: dia.Link): unknown {
  return (link as dia.Link & { get: (key: string) => unknown }).get("connector");
}

function esRegistro(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
