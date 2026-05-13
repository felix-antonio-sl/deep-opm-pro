import { CANON, naturalezaDeEnlace } from "../../modelo/constantes";
import { entidadIdDeExtremo } from "../../modelo/extremos";
import type { Apariencia, Enlace, Id, Modelo, Posicion, TipoEnlace } from "../../modelo/tipos";
import { etiquetaEnlaceNormalizada } from "../../modelo/etiquetasEnlace";
import type { JointCellJson, OpmJointMetadata } from "./proyeccion";
import { marcadoresEstructurales } from "./composers/markers";
import { extremoTriangulo } from "./composers/enlace";

const Z_ENLACE_BUS = 4;

export interface EnlaceConEndpointVisual {
  enlace: Enlace;
  aparienciaEnlaceId: Id;
  origen: { apariencia: Apariencia; portId?: Id };
  destino: { apariencia: Apariencia; portId?: Id };
}

export function proyectarBusesEstructurales(args: {
  modelo: Modelo;
  opdId: Id;
  enlaces: EnlaceConEndpointVisual[];
  seleccionados: Set<Id>;
}): { busCells: JointCellJson[]; enlacesConsumidos: Set<Id> } {
  const grupos = gruposEstructurales(args);
  const busCells = grupos.flatMap((grupo) => proyectarGrupoEstructural(args.opdId, grupo, args.seleccionados));
  const enlacesConsumidos = new Set(grupos.flatMap((grupo) => grupo.ramas.map((rama) => rama.enlace.id)));
  return { busCells, enlacesConsumidos };
}

interface GrupoEstructural {
  tipo: TipoEnlace;
  refinableId: Id;
  grupoId: Id;
  ladoRefinable: "origen" | "destino";
  refinable: Apariencia;
  ramas: EnlaceConEndpointVisual[];
}

function gruposEstructurales(args: {
  modelo: Modelo;
  enlaces: EnlaceConEndpointVisual[];
}): GrupoEstructural[] {
  const candidatas = args.enlaces.filter((item) => naturalezaDeEnlace(item.enlace.tipo) === "estructural");
  const porOrigen = agruparPorRefinable(args.modelo, candidatas, "origen");
  const consumidos = new Set<Id>();
  const grupos: GrupoEstructural[] = [];

  for (const grupo of porOrigen) {
    if (grupo.ramas.length < 2) continue;
    grupos.push(grupo);
    for (const rama of grupo.ramas) consumidos.add(rama.enlace.id);
  }

  for (const grupo of agruparPorRefinable(args.modelo, candidatas.filter((item) => !consumidos.has(item.enlace.id)), "destino")) {
    if (grupo.ramas.length < 2) continue;
    grupos.push(grupo);
  }

  return grupos;
}

function agruparPorRefinable(
  modelo: Modelo,
  enlaces: EnlaceConEndpointVisual[],
  ladoRefinable: "origen" | "destino",
): GrupoEstructural[] {
  const grupos = new Map<Id, EnlaceConEndpointVisual[]>();
  for (const item of enlaces) {
    const extremo = ladoRefinable === "origen" ? item.enlace.origenId : item.enlace.destinoId;
    const refinableId = entidadIdDeExtremo(modelo, extremo);
    if (!refinableId) continue;
    const grupoId = item.enlace.grupoEstructuralId ?? "auto";
    const key = `${item.enlace.tipo}:${refinableId}:${grupoId}`;
    const actuales = grupos.get(key) ?? [];
    actuales.push(item);
    grupos.set(key, actuales);
  }
  return Array.from(grupos.entries()).flatMap(([key, ramas]) => {
    const primera = ramas[0];
    if (!primera) return [];
    const refinable = ladoRefinable === "origen" ? primera.origen.apariencia : primera.destino.apariencia;
    const refinableId = ladoRefinable === "origen" ? entidadIdDeExtremo(modelo, primera.enlace.origenId) : entidadIdDeExtremo(modelo, primera.enlace.destinoId);
    if (!refinableId) return [];
    return [{
      tipo: primera.enlace.tipo,
      refinableId,
      grupoId: sanitizarId(key),
      ladoRefinable,
      refinable,
      ramas,
    }];
  });
}

function proyectarGrupoEstructural(
  opdId: Id,
  grupo: GrupoEstructural,
  seleccionados: Set<Id>,
): JointCellJson[] {
  const triangleSize = 30;
  const refinadores = grupo.ramas
    .map((rama) => ({
      rama,
      refinador: grupo.ladoRefinable === "origen" ? rama.destino.apariencia : rama.origen.apariencia,
    }))
    .sort((a, b) => centro(a.refinador).y - centro(b.refinador).y || centro(a.refinador).x - centro(b.refinador).x || a.rama.enlace.id.localeCompare(b.rama.enlace.id));
  const refinableCentro = centro(grupo.refinable);
  const refinadoresCentro = refinadores.map((item) => centro(item.refinador));
  const promedioRefinadores = promedio(refinadoresCentro);
  const triangleCenter = {
    x: Math.round((refinableCentro.x + promedioRefinadores.x) / 2),
    y: Math.round((refinableCentro.y + promedioRefinadores.y) / 2),
  };
  const grupoId = `struct-bus-${opdId}-${grupo.tipo}-${grupo.refinableId}-${grupo.grupoId}-${grupo.ladoRefinable}`;
  const triangleId = `${grupoId}-triangulo`;
  const algunaSeleccionada = refinadores.some(({ rama }) => seleccionados.has(rama.enlace.id));
  const primeraRama = refinadores[0]?.rama;
  if (!primeraRama) return [];
  const metaBus: OpmJointMetadata = {
    kind: "enlace",
    opdId,
    enlaceId: primeraRama.enlace.id,
    aparienciaEnlaceId: primeraRama.aparienciaEnlaceId,
    tipo: grupo.tipo,
  };

  return [
    {
      id: `${grupoId}-refinable`,
      type: "standard.Link",
      source: extremo(grupo.refinable.id, portRefinable(primeraRama, grupo.ladoRefinable)),
      target: extremoTriangulo(triangleId, "in"),
      router: routerManhattan(),
      connector: { name: "straight" },
      attrs: attrsLinea(algunaSeleccionada),
      opm: metaBus,
      z: Z_ENLACE_BUS,
    },
    ...refinadores.map(({ rama, refinador }, index) => ramaEstructural(opdId, grupoId, triangleId, grupo.ladoRefinable, rama, refinador, seleccionados.has(rama.enlace.id), index)),
    ...marcadoresEstructurales(grupo.tipo, triangleId, triangleCenter, triangleSize, algunaSeleccionada, metaBus).map((cell) => ({ ...cell, z: 12 })),
  ];
}

function ramaEstructural(
  opdId: Id,
  grupoId: Id,
  triangleId: Id,
  ladoRefinable: "origen" | "destino",
  rama: EnlaceConEndpointVisual,
  refinador: Apariencia,
  seleccionada: boolean,
  index: number,
): JointCellJson {
  const etiqueta = etiquetaEnlaceNormalizada(rama.enlace.etiqueta);
  return {
    id: `${grupoId}-${rama.aparienciaEnlaceId}-rama`,
    type: "standard.Link",
    source: extremoTriangulo(triangleId, "out"),
    target: extremo(refinador.id, portRefinador(rama, ladoRefinable)),
    router: routerManhattan(),
    connector: { name: "straight" },
    labels: etiqueta ? [etiquetaRama(etiqueta)] : [],
    attrs: attrsLinea(seleccionada),
    opm: {
      kind: "enlace",
      opdId,
      enlaceId: rama.enlace.id,
      aparienciaEnlaceId: rama.aparienciaEnlaceId,
      tipo: rama.enlace.tipo,
    },
    z: Z_ENLACE_BUS + index * 0.001,
  };
}

function etiquetaRama(text: string): Record<string, unknown> {
  return {
    markup: [{ tagName: "text", selector: "label" }],
    attrs: {
      label: {
        text,
        fill: "#475467",
        fontFamily: CANON.dims.fontFamily,
        fontSize: 12,
        fontStyle: "italic",
        fontWeight: CANON.dims.fontWeight,
        textAnchor: "middle",
        textVerticalAnchor: "middle",
        pointerEvents: "none",
      },
    },
    position: {
      distance: 0.5,
      offset: -20,
      angle: 0,
      args: {
        keepGradient: false,
        ensureLegibility: true,
      },
    },
  };
}

function attrsLinea(seleccionada: boolean): Record<string, unknown> {
  return {
    wrapper: {
      stroke: "transparent",
      strokeWidth: CANON.dims.enlaceHitArea,
      cursor: "pointer",
    },
    line: {
      stroke: CANON.colores.enlace,
      strokeWidth: seleccionada ? CANON.dims.enlaceVisible + 2 : CANON.dims.enlaceVisible,
      targetMarker: null,
    },
  };
}

function extremo(id: Id, portId?: Id): Record<string, unknown> {
  if (portId) return { id, port: portId, connectionPoint: { name: "anchor" } };
  return {
    id,
    anchor: { name: "midSide", args: { rotate: true } },
    connectionPoint: { name: "boundary", args: { offset: 0, sticky: true } },
  };
}

function portRefinable(rama: EnlaceConEndpointVisual, ladoRefinable: "origen" | "destino"): Id | undefined {
  return ladoRefinable === "origen" ? rama.origen.portId : rama.destino.portId;
}

function portRefinador(rama: EnlaceConEndpointVisual, ladoRefinable: "origen" | "destino"): Id | undefined {
  return ladoRefinable === "origen" ? rama.destino.portId : rama.origen.portId;
}

function centro(apariencia: Apariencia): Posicion {
  return {
    x: apariencia.x + apariencia.width / 2,
    y: apariencia.y + apariencia.height / 2,
  };
}

function promedio(puntos: Posicion[]): Posicion {
  if (puntos.length === 0) return { x: 0, y: 0 };
  const total = puntos.reduce((acc, punto) => ({ x: acc.x + punto.x, y: acc.y + punto.y }), { x: 0, y: 0 });
  return { x: total.x / puntos.length, y: total.y / puntos.length };
}

function sanitizarId(id: string): Id {
  return id.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function routerManhattan(): Record<string, unknown> {
  return { name: "manhattan", args: { padding: 5, step: 11 } };
}
