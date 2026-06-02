import type { ExtremoEnlace, Id, Modelo } from "../tipos";

/**
 * Razonamiento (Piso 3) — motor de DERIVACIÓN sobre el grafo de hechos.
 *
 * Hace computables las inferencias que OPM ya implica estructuralmente
 * (qué afecta a algo, qué requiere un proceso, qué impacta una eliminación).
 * Es el catamorfismo dual de la simulación (anamorfismo): mismo espacio,
 * sentido opuesto. Ver `docs/roadmap/capa-categorial-opforja.md` §6.
 *
 * ── FRONTERA DURA (anti scope-creep; rechazar en review lo que la cruce) ──
 * Esto es un CONJUNTO CERRADO de consultas predefinidas sobre la estructura.
 * Quedan FUERA DE ALCANCE (otra premisa, cambiaría la misión de OPM):
 * cuantificadores, deducción lógica general, lenguaje de consulta libre,
 * razonador tipo Datalog/Prolog, lógica de primer orden, demostrador.
 * Todo resultado se marca `inferido: true` y NUNCA se mezcla con hechos
 * declarados del modelo.
 */

export type Consulta =
  | { tipo: "afectan-a"; entidadId: Id }
  | { tipo: "requerido-por"; procesoId: Id }
  | { tipo: "impacto-de-eliminar"; elementoId: Id };

export interface HechoDerivado {
  readonly inferido: true;
  readonly via: Consulta["tipo"];
  readonly entidadId?: Id;
  readonly procesoId?: Id;
  readonly enlaceId?: Id;
}

const TRANSFORMADORES: ReadonlySet<string> = new Set(["consumo", "resultado", "efecto"]);
const REQUIERE_ENTRANTE: ReadonlySet<string> = new Set(["consumo", "agente", "instrumento"]);

function entidadDeExtremo(extremo: ExtremoEnlace, modelo: Modelo): Id | null {
  if (extremo.kind === "entidad") return extremo.id;
  return modelo.estados[extremo.id]?.entidadId ?? null;
}

/** Procesos que transforman (consumo/resultado/efecto) a la entidad dada. */
function afectanA(modelo: Modelo, entidadId: Id): HechoDerivado[] {
  const out: HechoDerivado[] = [];
  for (const enlace of Object.values(modelo.enlaces)) {
    if (!TRANSFORMADORES.has(enlace.tipo)) continue;
    const o = entidadDeExtremo(enlace.origenId, modelo);
    const d = entidadDeExtremo(enlace.destinoId, modelo);
    if (o !== entidadId && d !== entidadId) continue;
    const otro = o === entidadId ? d : o;
    if (otro && modelo.entidades[otro]?.tipo === "proceso") {
      out.push({ inferido: true, via: "afectan-a", procesoId: otro, entidadId, enlaceId: enlace.id });
    }
  }
  return out;
}

/**
 * Cierre transitivo de precondiciones de un proceso: lo que consume + sus
 * habilitadores, y transitivamente los productores de esos objetos (un objeto
 * requerido necesita que su proceso productor haya ocurrido antes).
 */
function requeridoPor(modelo: Modelo, procesoId: Id): HechoDerivado[] {
  const enlaces = Object.values(modelo.enlaces);
  const visitados = new Set<Id>([procesoId]);
  const cola: Id[] = [procesoId];
  const out: HechoDerivado[] = [];
  const agregar = (id: Id): void => {
    if (visitados.has(id)) return;
    visitados.add(id);
    cola.push(id);
    out.push({ inferido: true, via: "requerido-por", entidadId: id });
  };
  while (cola.length > 0) {
    const actual = cola.shift()!;
    for (const enlace of enlaces) {
      const o = entidadDeExtremo(enlace.origenId, modelo);
      const d = entidadDeExtremo(enlace.destinoId, modelo);
      if (!o || !d) continue;
      // `actual` (proceso) requiere lo que consume / sus habilitadores: X -> actual.
      if (REQUIERE_ENTRANTE.has(enlace.tipo) && d === actual) agregar(o);
      // `actual` (objeto requerido) requiere su productor: Q -(resultado)-> actual.
      if (enlace.tipo === "resultado" && d === actual) agregar(o);
    }
  }
  return out;
}

/** Hechos que desaparecerían al eliminar un elemento: enlaces incidentes, estados, refinamientos. */
function impactoDeEliminar(modelo: Modelo, elementoId: Id): HechoDerivado[] {
  const out: HechoDerivado[] = [];
  for (const enlace of Object.values(modelo.enlaces)) {
    const o = entidadDeExtremo(enlace.origenId, modelo);
    const d = entidadDeExtremo(enlace.destinoId, modelo);
    if (o === elementoId || d === elementoId) {
      out.push({ inferido: true, via: "impacto-de-eliminar", enlaceId: enlace.id });
    }
  }
  for (const estado of Object.values(modelo.estados)) {
    if (estado.entidadId === elementoId) {
      out.push({ inferido: true, via: "impacto-de-eliminar", entidadId: elementoId });
    }
  }
  const ent = modelo.entidades[elementoId];
  for (const slot of Object.values(ent?.refinamientos ?? {})) {
    if (slot) out.push({ inferido: true, via: "impacto-de-eliminar", entidadId: elementoId });
  }
  return out;
}

/** Motor de derivación puro. Toda salida es `inferido: true`. */
export function derivar(modelo: Modelo, consulta: Consulta): HechoDerivado[] {
  switch (consulta.tipo) {
    case "afectan-a":
      return afectanA(modelo, consulta.entidadId);
    case "requerido-por":
      return requeridoPor(modelo, consulta.procesoId);
    case "impacto-de-eliminar":
      return impactoDeEliminar(modelo, consulta.elementoId);
  }
}
