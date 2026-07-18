import { tieneDesignacion } from "../estadosDesignaciones";
import type { ExtremoEnlace, Id, Modelo } from "../tipos";

/**
 * Razonamiento (Piso 3) — motor de DERIVACIÓN sobre el grafo estructural del modelo.
 *
 * Hace computables las inferencias que OPM ya implica estructuralmente
 * (qué afecta a algo, qué requiere un proceso, qué impacta una eliminación,
 * qué estados son alcanzables). Comparte con la simulación el modelo subyacente,
 * pero eso no demuestra que ambas operaciones sean duales categoriales.
 *
 * COHERENCIA CON F0 (decisión declarada): deriva del `Modelo` directamente, NO de
 * `hechosDe`, porque `impacto-de-eliminar` necesita los refinamientos y F0 no los
 * proyecta (hechosDe = entidades + estados + enlaces). La no-divergencia con el
 * cimiento de hechos NO se logra compartiendo implementación, sino por la LEY
 * `law-derivacion-no-contradice`: toda referencia derivada existe en `hechosDe`.
 * Ver `docs/roadmap/capa-categorial-opforja.md` §6.
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
  | { tipo: "alcanzable"; entidadId: Id; estado: string }
  | { tipo: "impacto-de-eliminar"; elementoId: Id }
  | { tipo: "impacto-aguas-abajo"; elementoId: Id };

export interface HechoDerivado {
  readonly inferido: true;
  readonly via: Consulta["tipo"];
  readonly entidadId?: Id;
  readonly procesoId?: Id;
  readonly enlaceId?: Id;
  readonly estadoId?: Id;
}

const TRANSFORMADORES: ReadonlySet<string> = new Set(["consumo", "resultado", "efecto"]);
const REQUIERE_ENTRANTE: ReadonlySet<string> = new Set(["consumo", "agente", "instrumento"]);
// Flujo descendente: resultado/efecto van proceso→objeto (lo que produce/afecta);
// consumo/agente/instrumento van objeto→proceso (lo que lo usa).
const SALIDA_PROCESO: ReadonlySet<string> = new Set(["resultado", "efecto"]);
const ENTRADA_PROCESO: ReadonlySet<string> = new Set(["consumo", "agente", "instrumento"]);

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
      // estadoId distingue cada estado: sin él, N estados colapsaban a N hechos idénticos.
      out.push({ inferido: true, via: "impacto-de-eliminar", entidadId: elementoId, estadoId: estado.id });
    }
  }
  const ent = modelo.entidades[elementoId];
  for (const slot of Object.values(ent?.refinamientos ?? {})) {
    if (slot) out.push({ inferido: true, via: "impacto-de-eliminar", entidadId: elementoId });
  }
  return out;
}

/**
 * Reachability de estados: ¿la entidad puede llegar al estado nombrado desde sus
 * estados de partida (designados inicial/default/current; fallback: todos)? El
 * grafo de transición es s1→s2 cuando un proceso consume s1 y produce s2 del
 * mismo objeto — la MISMA relación que la simulación recorre. Es el dual ESTÁTICO
 * del recorrido dinámico del unfold (urn:fxsl:kb:icas-efectos: fold/unfold sobre
 * el mismo grafo). Devuelve evidencia (estados alcanzados + procesos del camino)
 * si es alcanzable; vacío si no.
 */
function alcanzable(modelo: Modelo, entidadId: Id, estadoNombre: string): HechoDerivado[] {
  const estadosEntidad = Object.values(modelo.estados).filter((e) => e.entidadId === entidadId);
  const meta = estadosEntidad.find((e) => e.nombre === estadoNombre);
  if (!meta) return [];

  // Grafo de transición de estados inducido por procesos (consumo de estado + resultado a estado).
  const entradasPorProceso = new Map<Id, Id[]>();
  const salidasPorProceso = new Map<Id, Id[]>();
  for (const enlace of Object.values(modelo.enlaces)) {
    if (enlace.tipo === "consumo" && enlace.origenId.kind === "estado" && enlace.destinoId.kind === "entidad"
      && modelo.estados[enlace.origenId.id]?.entidadId === entidadId) {
      const lista = entradasPorProceso.get(enlace.destinoId.id) ?? [];
      lista.push(enlace.origenId.id);
      entradasPorProceso.set(enlace.destinoId.id, lista);
    }
    if (enlace.tipo === "resultado" && enlace.origenId.kind === "entidad" && enlace.destinoId.kind === "estado"
      && modelo.estados[enlace.destinoId.id]?.entidadId === entidadId) {
      const lista = salidasPorProceso.get(enlace.origenId.id) ?? [];
      lista.push(enlace.destinoId.id);
      salidasPorProceso.set(enlace.origenId.id, lista);
    }
  }
  const adyacencia = new Map<Id, Array<{ a: Id; proceso: Id }>>();
  for (const [proceso, entradas] of entradasPorProceso) {
    const salidas = salidasPorProceso.get(proceso) ?? [];
    for (const de of entradas) for (const a of salidas) {
      const lista = adyacencia.get(de) ?? [];
      lista.push({ a, proceso });
      adyacencia.set(de, lista);
    }
  }

  const designados = estadosEntidad.filter(
    (e) => tieneDesignacion(e, "current") || tieneDesignacion(e, "default") || tieneDesignacion(e, "inicial"),
  );
  const partida = designados.length > 0 ? designados : estadosEntidad;

  const visitados = new Set<Id>(partida.map((e) => e.id));
  const procesosUsados = new Set<Id>();
  const cola = [...visitados];
  while (cola.length > 0) {
    const actual = cola.shift()!;
    for (const { a, proceso } of adyacencia.get(actual) ?? []) {
      procesosUsados.add(proceso);
      if (!visitados.has(a)) {
        visitados.add(a);
        cola.push(a);
      }
    }
  }

  if (!visitados.has(meta.id)) return [];
  const out: HechoDerivado[] = [];
  for (const estadoId of visitados) out.push({ inferido: true, via: "alcanzable", entidadId, estadoId });
  for (const proceso of procesosUsados) out.push({ inferido: true, via: "alcanzable", procesoId: proceso });
  return out;
}

/**
 * Cono de impacto AGUAS ABAJO: cierre transitivo del flujo descendente desde un
 * elemento. resultado/efecto llevan proceso→objeto (lo producido/afectado);
 * consumo/agente/instrumento llevan objeto→proceso (lo que lo usa). Si el
 * elemento colapsa, todo lo alcanzable hacia adelante queda comprometido. Es el
 * dual DESCENDENTE de `requerido-por` (que cierra aguas arriba). Transitivo (no
 * primer nivel como `impacto-de-eliminar`). Excluye el propio elemento.
 */
function impactoAguasAbajo(modelo: Modelo, elementoId: Id): HechoDerivado[] {
  const forward = new Map<Id, Array<{ a: Id; enlaceId: Id }>>();
  const agregarArista = (de: Id, a: Id, enlaceId: Id): void => {
    const lista = forward.get(de) ?? [];
    lista.push({ a, enlaceId });
    forward.set(de, lista);
  };
  for (const enlace of Object.values(modelo.enlaces)) {
    const o = entidadDeExtremo(enlace.origenId, modelo);
    const d = entidadDeExtremo(enlace.destinoId, modelo);
    if (!o || !d || o === d) continue;
    const proceso = modelo.entidades[o]?.tipo === "proceso" ? o : modelo.entidades[d]?.tipo === "proceso" ? d : null;
    if (!proceso) continue;
    const objeto = proceso === o ? d : o;
    if (SALIDA_PROCESO.has(enlace.tipo)) agregarArista(proceso, objeto, enlace.id); // proceso → objeto
    else if (ENTRADA_PROCESO.has(enlace.tipo)) agregarArista(objeto, proceso, enlace.id); // objeto → proceso
  }
  const visitados = new Set<Id>([elementoId]);
  const cola: Id[] = [elementoId];
  const out: HechoDerivado[] = [];
  while (cola.length > 0) {
    const actual = cola.shift()!;
    for (const { a, enlaceId } of forward.get(actual) ?? []) {
      if (visitados.has(a)) continue;
      visitados.add(a);
      cola.push(a);
      out.push({ inferido: true, via: "impacto-aguas-abajo", entidadId: a, enlaceId });
    }
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
    case "alcanzable":
      return alcanzable(modelo, consulta.entidadId, consulta.estado);
    case "impacto-de-eliminar":
      return impactoDeEliminar(modelo, consulta.elementoId);
    case "impacto-aguas-abajo":
      return impactoAguasAbajo(modelo, consulta.elementoId);
  }
  return assertNever(consulta);
}

function assertNever(value: never): never {
  throw new Error(`Consulta de razonamiento no implementada: ${JSON.stringify(value)}`);
}
