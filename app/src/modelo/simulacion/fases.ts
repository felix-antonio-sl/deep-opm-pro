import { rutaEtiquetaNormalizada } from "../rutas";
import type { Enlace, Id, Modelo, TipoEnlace } from "../tipos";
import type { FaseSimulacion, PasoSimulacion, TransicionEstadoSim } from "./tipos";

export interface DescriptorFaseSimulacion {
  fase: FaseSimulacion;
  indice: number;
  total: number;
  rotulo: string;
}

const ROTULOS_FASE: Record<FaseSimulacion, string> = {
  preparacion: "preparacion",
  consumo: "consumo",
  proceso: "proceso activo",
  resultado: "resultado",
  cierre: "cierre",
};

const TIPOS_CONSUMO = new Set<TipoEnlace>(["consumo", "efecto"]);
const TIPOS_RESULTADO = new Set<TipoEnlace>(["resultado", "efecto", "invocacion"]);
const TIPOS_PREPARACION = new Set<TipoEnlace>(["agente", "instrumento"]);

export function fasesDelPasoSimulacion(modelo: Modelo, paso: PasoSimulacion): FaseSimulacion[] {
  const fases: FaseSimulacion[] = ["preparacion"];
  if (enlacesConsumo(modelo, paso).length > 0 || paso.transicionesPlanificadas.some((t) => t.estadoAntesId !== null)) {
    fases.push("consumo");
  }
  fases.push("proceso");
  if (enlacesResultado(modelo, paso).length > 0 || paso.transicionesPlanificadas.some((t) => t.estadoDespuesId !== null)) {
    fases.push("resultado");
  }
  fases.push("cierre");
  return fases;
}

export function primeraFaseSimulacion(modelo: Modelo, paso: PasoSimulacion | undefined): FaseSimulacion | undefined {
  return paso ? fasesDelPasoSimulacion(modelo, paso)[0] : undefined;
}

export function descriptorFaseSimulacion(
  modelo: Modelo,
  paso: PasoSimulacion | undefined,
  fase: FaseSimulacion | undefined,
): DescriptorFaseSimulacion | null {
  if (!paso) return null;
  const fases = fasesDelPasoSimulacion(modelo, paso);
  const faseNormalizada = normalizarFaseSimulacion(modelo, paso, fase);
  const indice = Math.max(0, fases.indexOf(faseNormalizada));
  return {
    fase: faseNormalizada,
    indice: indice + 1,
    total: fases.length,
    rotulo: ROTULOS_FASE[faseNormalizada],
  };
}

export function siguienteFaseSimulacion(
  modelo: Modelo,
  paso: PasoSimulacion,
  fase: FaseSimulacion | undefined,
): FaseSimulacion | null {
  const fases = fasesDelPasoSimulacion(modelo, paso);
  const actual = normalizarFaseSimulacion(modelo, paso, fase);
  const indice = fases.indexOf(actual);
  return indice >= 0 && indice < fases.length - 1 ? fases[indice + 1]! : null;
}

export function normalizarFaseSimulacion(
  modelo: Modelo,
  paso: PasoSimulacion,
  fase: FaseSimulacion | undefined,
): FaseSimulacion {
  const fases = fasesDelPasoSimulacion(modelo, paso);
  return fase && fases.includes(fase) ? fase : fases[0]!;
}

export function enlacesDeFaseSimulacion(
  modelo: Modelo,
  paso: PasoSimulacion,
  fase: FaseSimulacion,
  estadosCurrent: Record<Id, Id>,
): Id[] {
  const transiciones = transicionesVigentesSimulacion(paso, estadosCurrent);
  const rutas = rutasActivas(transiciones);
  const filtrar = (ids: Id[]) => filtrarPorRutasActivas(modelo, ids, rutas);

  if (fase === "preparacion") return filtrar(enlacesPreparacion(modelo, paso));
  if (fase === "consumo") return filtrar(enlacesConsumo(modelo, paso));
  if (fase === "resultado") return filtrar(enlacesResultado(modelo, paso));
  if (fase === "proceso") return [];
  return [];
}

export function transicionesVigentesSimulacion(
  paso: PasoSimulacion,
  estadosCurrent: Record<Id, Id>,
): TransicionEstadoSim[] {
  const grupos = new Map<Id, TransicionEstadoSim[]>();
  for (const transicion of paso.transicionesPlanificadas) {
    const previas = grupos.get(transicion.entidadId);
    if (previas) previas.push(transicion);
    else grupos.set(transicion.entidadId, [transicion]);
  }

  const vigentes: TransicionEstadoSim[] = [];
  for (const [entidadId, transiciones] of grupos) {
    if (transiciones.length === 1) {
      vigentes.push(transiciones[0]!);
      continue;
    }
    const conEstadoEntrada = transiciones.filter((transicion) => transicion.estadoAntesId !== null);
    if (conEstadoEntrada.length === 0) {
      vigentes.push(...transiciones);
      continue;
    }
    vigentes.push(...conEstadoEntrada.filter((transicion) => estadosCurrent[entidadId] === transicion.estadoAntesId));
  }
  return vigentes;
}

export function estadosCurrentVisualesFase(
  estadosCurrent: Record<Id, Id>,
  transiciones: readonly TransicionEstadoSim[],
  fase: FaseSimulacion,
): Record<Id, Id> {
  const visuales: Record<Id, Id> = { ...estadosCurrent };
  if (fase === "proceso") {
    for (const transicion of transiciones) {
      if (transicion.estadoAntesId !== null) delete visuales[transicion.entidadId];
    }
  }
  if (fase === "resultado" || fase === "cierre") {
    for (const transicion of transiciones) {
      if (transicion.estadoDespuesId !== null) visuales[transicion.entidadId] = transicion.estadoDespuesId;
      else if (transicion.estadoAntesId !== null) delete visuales[transicion.entidadId];
    }
  }
  return visuales;
}

function enlacesPreparacion(modelo: Modelo, paso: PasoSimulacion): Id[] {
  return paso.enlacesEntradaIds.filter((id) => {
    const enlace = modelo.enlaces[id];
    if (!enlace) return false;
    return TIPOS_PREPARACION.has(enlace.tipo) || enlace.modificador === "condicion" || enlace.modificador === "evento";
  });
}

function enlacesConsumo(modelo: Modelo, paso: PasoSimulacion): Id[] {
  return paso.enlacesEntradaIds.filter((id) => {
    const enlace = modelo.enlaces[id];
    return enlace ? TIPOS_CONSUMO.has(enlace.tipo) : false;
  });
}

function enlacesResultado(modelo: Modelo, paso: PasoSimulacion): Id[] {
  return paso.enlacesSalidaIds.filter((id) => {
    const enlace = modelo.enlaces[id];
    return enlace ? TIPOS_RESULTADO.has(enlace.tipo) : false;
  });
}

function rutasActivas(transiciones: readonly TransicionEstadoSim[]): Set<string> {
  return new Set(
    transiciones
      .map((transicion) => transicion.rutaEtiqueta)
      .filter((ruta): ruta is string => Boolean(ruta)),
  );
}

function filtrarPorRutasActivas(modelo: Modelo, ids: Id[], rutas: Set<string>): Id[] {
  if (rutas.size === 0) return ids;
  return ids.filter((id) => {
    const ruta = rutaNormalizada(modelo.enlaces[id]);
    return ruta ? rutas.has(ruta) : false;
  });
}

function rutaNormalizada(enlace: Enlace | undefined): string | undefined {
  return rutaEtiquetaNormalizada(enlace?.rutaEtiqueta);
}
