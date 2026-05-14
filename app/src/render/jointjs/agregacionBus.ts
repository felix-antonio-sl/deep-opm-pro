import { CANON, naturalezaDeEnlace } from "../../modelo/constantes";
import { entidadIdDeExtremo } from "../../modelo/extremos";
import { anclajeRefinableSimbolo, anclajeRefinadorSimbolo, normalizarAnclajeSimbolo } from "../../modelo/simboloEstructural";
import type { AnclajeSimboloEstructural, AnclajesSimboloEstructural, Apariencia, Enlace, Id, Modelo, Posicion, TipoEnlace } from "../../modelo/tipos";
import { etiquetaEnlaceNormalizada } from "../../modelo/etiquetasEnlace";
import type { JointCellJson, OpmJointMetadata } from "./proyeccion";
import { marcadoresEstructurales, type PuertoSimboloEstructural } from "./composers/markers";
import { etiquetaOrdenEstructural, extremoTriangulo } from "./composers/enlace";
import { labelTextWrap } from "./labelText";

const Z_ENLACE_BUS = 4;
const DISTANCIA_MIN_SIMBOLO = 44;
const DESPLAZAMIENTO_SOLAPE_SIMBOLO = 50;

export interface ReservaSimboloEstructural {
  centro: Posicion;
  persistida?: boolean;
}

export interface EnlaceConEndpointVisual {
  enlace: Enlace;
  aparienciaEnlaceId: Id;
  symbolPos?: Posicion;
  symbolAnchors?: AnclajesSimboloEstructural;
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
  const reservas: ReservaSimboloEstructural[] = [];
  const busCells = grupos.flatMap((grupo) => proyectarGrupoEstructural(args.modelo, args.opdId, grupo, args.seleccionados, reservas));
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
  modelo: Modelo,
  opdId: Id,
  grupo: GrupoEstructural,
  seleccionados: Set<Id>,
  reservas: ReservaSimboloEstructural[],
): JointCellJson[] {
  const triangleSize = 30;
  const refinadores = grupo.ramas
    .map((rama) => ({
      rama,
      refinador: grupo.ladoRefinable === "origen" ? rama.destino.apariencia : rama.origen.apariencia,
    }))
    .sort((a, b) => centroApariencia(a.refinador).y - centroApariencia(b.refinador).y || centroApariencia(a.refinador).x - centroApariencia(b.refinador).x || a.rama.enlace.id.localeCompare(b.rama.enlace.id));
  const refinableCentro = centroApariencia(grupo.refinable);
  const refinadoresCentro = refinadores.map((item) => centroApariencia(item.refinador));
  const promedioRefinadores = promedio(refinadoresCentro);
  const symbolPosPersistido = symbolPosGrupo(refinadores.map((item) => item.rama.symbolPos));
  const centroBase = symbolPosPersistido ?? {
    x: Math.round((refinableCentro.x + promedioRefinadores.x) / 2),
    y: Math.round((refinableCentro.y + promedioRefinadores.y) / 2),
  };
  const triangleCenter = symbolPosPersistido
    ? centroBase
    : separarCentroSimboloEstructural(centroBase, reservas, refinableCentro);
  reservas.push({ centro: triangleCenter, ...(symbolPosPersistido ? { persistida: true } : {}) });
  const grupoId = `struct-bus-${opdId}-${grupo.tipo}-${grupo.refinableId}-${grupo.grupoId}-${grupo.ladoRefinable}`;
  const triangleId = `${grupoId}-triangulo`;
  const algunaSeleccionada = refinadores.some(({ rama }) => seleccionados.has(rama.enlace.id));
  const primeraRama = refinadores[0]?.rama;
  if (!primeraRama) return [];
  const aparienciaEnlaceIds = grupo.ramas.map((rama) => rama.aparienciaEnlaceId);
  const enlaceIds = grupo.ramas.map((rama) => rama.enlace.id);
  const puertosSimbolo = puertosSimboloGrupo(refinadores);
  const metaRefinable: OpmJointMetadata = {
    kind: "enlace",
    opdId,
    enlaceId: primeraRama.enlace.id,
    aparienciaEnlaceId: primeraRama.aparienciaEnlaceId,
    tipo: grupo.tipo,
    enlaceIds,
    aparienciaEnlaceIds,
    rolEstructural: "refinable",
    ladoRefinable: grupo.ladoRefinable,
  };
  const metaSimbolo: OpmJointMetadata = {
    ...metaRefinable,
    rolEstructural: "simbolo",
  };
  const ordenado = modelo.entidades[grupo.refinableId]?.orderedFundamentalTypes?.includes(grupo.tipo) ?? false;

  return [
    {
      id: `${grupoId}-refinable`,
      type: "standard.Link",
      source: extremo(grupo.refinable.id, portRefinable(primeraRama, grupo.ladoRefinable)),
      target: extremoTriangulo(triangleId, "in"),
      router: routerManhattan(),
      connector: { name: "straight" },
      labels: ordenado ? [etiquetaOrdenEstructural()] : [],
      attrs: attrsLinea(algunaSeleccionada),
      opm: metaRefinable,
      z: Z_ENLACE_BUS,
    },
    ...refinadores.map(({ rama, refinador }, index) => ramaEstructural(opdId, grupoId, triangleId, grupo.ladoRefinable, rama, refinador, seleccionados.has(rama.enlace.id), index)),
    ...marcadoresEstructurales(grupo.tipo, triangleId, triangleCenter, triangleSize, algunaSeleccionada, metaSimbolo, puertosSimbolo).map((cell) => ({ ...cell, z: 12 })),
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
      enlaceIds: [rama.enlace.id],
      aparienciaEnlaceIds: [rama.aparienciaEnlaceId],
      rolEstructural: "rama",
      ladoRefinable,
    },
    z: Z_ENLACE_BUS + index * 0.001,
  };
}

function puertosSimboloGrupo(refinadores: Array<{ rama: EnlaceConEndpointVisual; refinador: Apariencia }>): PuertoSimboloEstructural[] {
  const refinable = anclajeRefinableGrupo(refinadores);
  const refinador = anclajeRefinadorGrupo(refinadores);
  return [
    { id: "in", ...refinable },
    { id: "out", ...refinador },
  ];
}

function anclajeRefinableGrupo(refinadores: Array<{ rama: EnlaceConEndpointVisual }>): AnclajeSimboloEstructural {
  const validos = refinadores
    .map(({ rama }) => normalizarAnclajeSimbolo(rama.symbolAnchors?.refinable))
    .filter((anclaje): anclaje is AnclajeSimboloEstructural => !!anclaje);
  if (validos.length === 0) return anclajeRefinableSimbolo();
  return {
    dx: Math.round(validos.reduce((total, anclaje) => total + anclaje.dx, 0) / validos.length),
    dy: Math.round(validos.reduce((total, anclaje) => total + anclaje.dy, 0) / validos.length),
  };
}

function anclajeRefinadorGrupo(refinadores: Array<{ rama: EnlaceConEndpointVisual }>): AnclajeSimboloEstructural {
  const validos = refinadores
    .map(({ rama }) => normalizarAnclajeSimbolo(rama.symbolAnchors?.refinador))
    .filter((anclaje): anclaje is AnclajeSimboloEstructural => !!anclaje);
  if (validos.length === 0) return anclajeRefinadorSimbolo(0, 1);
  return {
    dx: Math.round(validos.reduce((total, anclaje) => total + anclaje.dx, 0) / validos.length),
    dy: Math.round(validos.reduce((total, anclaje) => total + anclaje.dy, 0) / validos.length),
  };
}

function etiquetaRama(text: string): Record<string, unknown> {
  return {
    markup: [{ tagName: "text", selector: "label" }],
    attrs: {
      label: {
        text,
        ...labelTextWrap(text),
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

export function centroApariencia(apariencia: Apariencia): Posicion {
  return {
    x: apariencia.x + apariencia.width / 2,
    y: apariencia.y + apariencia.height / 2,
  };
}

export function separarCentroSimboloEstructural(
  base: Posicion,
  reservas: readonly ReservaSimboloEstructural[],
  refinableCentro: Posicion,
): Posicion {
  const centroBase = { x: Math.round(base.x), y: Math.round(base.y) };
  if (!colisionaConReservas(centroBase, reservas)) return centroBase;

  const direccionPreferida = refinableCentro.x <= centroBase.x ? 1 : -1;
  for (let intento = 1; intento <= 12; intento += 1) {
    const carril = Math.ceil(intento / 2);
    const direccion = intento % 2 === 1 ? direccionPreferida : -direccionPreferida;
    const candidato = {
      x: centroBase.x + direccion * DESPLAZAMIENTO_SOLAPE_SIMBOLO * carril,
      y: centroBase.y,
    };
    if (!colisionaConReservas(candidato, reservas)) return candidato;
  }

  return {
    x: centroBase.x + direccionPreferida * DESPLAZAMIENTO_SOLAPE_SIMBOLO,
    y: centroBase.y + DESPLAZAMIENTO_SOLAPE_SIMBOLO,
  };
}

function colisionaConReservas(centro: Posicion, reservas: readonly ReservaSimboloEstructural[]): boolean {
  return reservas.some((reserva) => Math.abs(reserva.centro.x - centro.x) < DISTANCIA_MIN_SIMBOLO && Math.abs(reserva.centro.y - centro.y) < DISTANCIA_MIN_SIMBOLO);
}

function promedio(puntos: Posicion[]): Posicion {
  if (puntos.length === 0) return { x: 0, y: 0 };
  const total = puntos.reduce((acc, punto) => ({ x: acc.x + punto.x, y: acc.y + punto.y }), { x: 0, y: 0 });
  return { x: total.x / puntos.length, y: total.y / puntos.length };
}

function symbolPosGrupo(puntos: Array<Posicion | undefined>): Posicion | null {
  const validos = puntos.filter((punto): punto is Posicion => !!punto && Number.isFinite(punto.x) && Number.isFinite(punto.y));
  if (validos.length === 0) return null;
  return {
    x: Math.round(validos.reduce((total, punto) => total + punto.x, 0) / validos.length),
    y: Math.round(validos.reduce((total, punto) => total + punto.y, 0) / validos.length),
  };
}

function sanitizarId(id: string): Id {
  return id.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function routerManhattan(): Record<string, unknown> {
  return { name: "manhattan", args: { padding: 5, step: 11 } };
}
