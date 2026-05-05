import { CANON } from "../../modelo/constantes";
import { entidadIdDeExtremo } from "../../modelo/extremos";
import type { Apariencia, Enlace, Id, Modelo, Posicion } from "../../modelo/tipos";
import { etiquetaEnlaceNormalizada } from "../../modelo/etiquetasEnlace";
import { LINK_ASSETS } from "./linkAssets";
import type { JointCellJson, OpmJointMetadata } from "./proyeccion";

export interface EnlaceConEndpointVisual {
  enlace: Enlace;
  aparienciaEnlaceId: Id;
  origen: { apariencia: Apariencia };
  destino: { apariencia: Apariencia };
}

export function proyectarBusesAgregacion(args: {
  modelo: Modelo;
  opdId: Id;
  enlaces: EnlaceConEndpointVisual[];
  seleccionados: Set<Id>;
}): { busCells: JointCellJson[]; enlacesConsumidos: Set<Id> } {
  const grupos = gruposAgregacion(args);
  const busCells = grupos.flatMap((grupo) => proyectarGrupoAgregacion(args.opdId, grupo, args.seleccionados));
  const enlacesConsumidos = new Set(grupos.flatMap((grupo) => grupo.ramas.map((rama) => rama.enlace.id)));
  return { busCells, enlacesConsumidos };
}

interface GrupoAgregacion {
  todoId: Id;
  ladoTodo: "origen" | "destino";
  todo: Apariencia;
  ramas: EnlaceConEndpointVisual[];
}

function gruposAgregacion(args: {
  modelo: Modelo;
  enlaces: EnlaceConEndpointVisual[];
}): GrupoAgregacion[] {
  const candidatas = args.enlaces.filter((item) => item.enlace.tipo === "agregacion");
  const porOrigen = agruparPorTodo(args.modelo, candidatas, "origen");
  const consumidos = new Set<Id>();
  const grupos: GrupoAgregacion[] = [];

  for (const grupo of porOrigen) {
    if (grupo.ramas.length < 2) continue;
    grupos.push(grupo);
    for (const rama of grupo.ramas) consumidos.add(rama.enlace.id);
  }

  for (const grupo of agruparPorTodo(args.modelo, candidatas.filter((item) => !consumidos.has(item.enlace.id)), "destino")) {
    if (grupo.ramas.length < 2) continue;
    grupos.push(grupo);
  }

  return grupos;
}

function agruparPorTodo(
  modelo: Modelo,
  enlaces: EnlaceConEndpointVisual[],
  ladoTodo: "origen" | "destino",
): GrupoAgregacion[] {
  const grupos = new Map<Id, EnlaceConEndpointVisual[]>();
  for (const item of enlaces) {
    const extremo = ladoTodo === "origen" ? item.enlace.origenId : item.enlace.destinoId;
    const todoId = entidadIdDeExtremo(modelo, extremo);
    if (!todoId) continue;
    const actuales = grupos.get(todoId) ?? [];
    actuales.push(item);
    grupos.set(todoId, actuales);
  }
  return Array.from(grupos.entries()).flatMap(([todoId, ramas]) => {
    const primera = ramas[0];
    if (!primera) return [];
    const todo = ladoTodo === "origen" ? primera.origen.apariencia : primera.destino.apariencia;
    return [{ todoId, ladoTodo, todo, ramas }];
  });
}

function proyectarGrupoAgregacion(
  opdId: Id,
  grupo: GrupoAgregacion,
  seleccionados: Set<Id>,
): JointCellJson[] {
  const triangleSize = 30;
  const partes = grupo.ramas
    .map((rama) => ({
      rama,
      parte: grupo.ladoTodo === "origen" ? rama.destino.apariencia : rama.origen.apariencia,
    }))
    .sort((a, b) => centro(a.parte).y - centro(b.parte).y || centro(a.parte).x - centro(b.parte).x || a.rama.enlace.id.localeCompare(b.rama.enlace.id));
  const todoCentro = centro(grupo.todo);
  const partesCentro = partes.map((item) => centro(item.parte));
  const promedioPartes = promedio(partesCentro);
  const triangleCenter = {
    x: Math.round((todoCentro.x + promedioPartes.x) / 2),
    y: Math.round((todoCentro.y + promedioPartes.y) / 2),
  };
  const topTriangle = { x: triangleCenter.x, y: triangleCenter.y - triangleSize / 2 };
  const bottomTriangle = { x: triangleCenter.x, y: triangleCenter.y + triangleSize / 2 };
  const grupoId = `ag-bus-${opdId}-${grupo.todoId}-${grupo.ladoTodo}`;
  const algunaSeleccionada = partes.some(({ rama }) => seleccionados.has(rama.enlace.id));
  const primeraRama = partes[0]?.rama;
  if (!primeraRama) return [];
  const metaBus: OpmJointMetadata = {
    kind: "enlace",
    opdId,
    enlaceId: primeraRama.enlace.id,
    aparienciaEnlaceId: primeraRama.aparienciaEnlaceId,
    tipo: "agregacion",
  };

  return [
    {
      id: `${grupoId}-refinable`,
      type: "standard.Link",
      source: extremo(grupo.todo.id),
      target: topTriangle,
      router: routerManhattan(),
      connector: { name: "straight" },
      attrs: attrsLinea(algunaSeleccionada),
      opm: metaBus,
      z: 1,
    },
    ...partes.map(({ rama, parte }, index) => ramaAgregacion(opdId, grupoId, rama, parte, bottomTriangle, seleccionados.has(rama.enlace.id), index)),
    marcadorAgregacion(`${grupoId}-triangulo`, triangleCenter, triangleSize, algunaSeleccionada, metaBus),
  ];
}

function ramaAgregacion(
  opdId: Id,
  grupoId: Id,
  rama: EnlaceConEndpointVisual,
  parte: Apariencia,
  source: Posicion,
  seleccionada: boolean,
  index: number,
): JointCellJson {
  const etiqueta = etiquetaEnlaceNormalizada(rama.enlace.etiqueta);
  return {
    id: `${grupoId}-${rama.aparienciaEnlaceId}-rama`,
    type: "standard.Link",
    source,
    target: extremo(parte.id),
    router: routerManhattan(),
    connector: { name: "straight" },
    labels: etiqueta ? [etiquetaRama(etiqueta)] : [],
    attrs: attrsLinea(seleccionada),
    opm: {
      kind: "enlace",
      opdId,
      enlaceId: rama.enlace.id,
      aparienciaEnlaceId: rama.aparienciaEnlaceId,
      tipo: "agregacion",
    },
    z: 1 + index * 0.001,
  };
}

function marcadorAgregacion(
  id: Id,
  center: Posicion,
  size: number,
  seleccionada: boolean,
  meta: OpmJointMetadata,
): JointCellJson {
  return {
    id,
    type: "standard.Polygon",
    position: { x: center.x - size / 2, y: center.y - size / 2 },
    size: { width: size, height: size },
    angle: 0,
    attrs: {
      body: {
        refPoints: LINK_ASSETS.structural.agregacion.markerPoints,
        fill: CANON.colores.enlace,
        stroke: CANON.colores.enlace,
        strokeWidth: seleccionada ? CANON.dims.enlaceVisible + 2 : CANON.dims.enlaceVisible,
        cursor: "pointer",
      },
      label: { text: "", display: "none" },
    },
    opm: meta,
    z: 2,
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

function extremo(id: Id): Record<string, unknown> {
  return {
    id,
    anchor: { name: "midSide", args: { rotate: true } },
    connectionPoint: { name: "boundary", args: { offset: 1 } },
  };
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

function routerManhattan(): Record<string, unknown> {
  return { name: "manhattan", args: { padding: 5, step: 11 } };
}
