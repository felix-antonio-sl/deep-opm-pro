import { naturalezaDeEnlace } from "../constantes";
import { entidadDeExtremo } from "../extremos";
import { entidadesVisiblesEnOpd } from "../politicaApariciones";
import type {
  Enlace,
  Entidad,
  Esencia,
  Id,
  Modelo,
  Opd,
} from "../tipos";

type OplEnlace = Enlace & { orig: Entidad; dest: Entidad };

export interface OplBloque {
  opdId: Id;
  opdNombre: string;
  sentencias: string[];
}

export function generarOplEstructurado(modelo: Modelo): OplBloque[] {
  const opds = ordenarOpdsPorRefinamiento(modelo);
  return opds.map((opd) => ({
    opdId: opd.id,
    opdNombre: opd.nombre,
    sentencias: generarSentenciasOpd(modelo, opd),
  }));
}

export function generarOplTexto(modelo: Modelo): string {
  const bloques = generarOplEstructurado(modelo);
  return bloques
    .map((b) => {
      const header = b.opdNombre.toUpperCase() === "SD" || b.opdNombre.startsWith("SD")
        ? `${b.opdNombre} del sistema ${modelo.nombre}.`
        : `${b.opdNombre} en refinamiento.`;
      return [header, ...b.sentencias, ""].join("\n");
    })
    .join("\n")
    .trimEnd() + "\n";
}

function ordenarOpdsPorRefinamiento(modelo: Modelo): Opd[] {
  const raiz = modelo.opds[modelo.opdRaizId];
  if (!raiz) return [];
  const resultado: Opd[] = [raiz];
  const resto = Object.values(modelo.opds).filter((o) => o.id !== modelo.opdRaizId);
  resto.sort((a, b) => (a.nombre ?? "").localeCompare(b.nombre ?? ""));
  resultado.push(...resto);
  return resultado;
}

function generarSentenciasOpd(modelo: Modelo, opd: Opd): string[] {
  const sentencias: string[] = [];
  const entidadesEnOpd = entidadesDelOpd(modelo, opd);

  for (const entidad of entidadesEnOpd) {
    sentencias.push(sentenciaExistencia(entidad));
  }

  for (const entidad of entidadesEnOpd) {
    if (entidad.tipo !== "objeto") continue;
    const ests = estadosDeEntidad(modelo, entidad.id);
    if (ests.length === 0) continue;
    const nombres = ests.map((e) => e.nombre);
    sentencias.push(`${entidad.nombre} puede estar en ${nombres.join(" o ")}.`);
    const inicial = ests.find((e) => e.esInicial);
    if (inicial) {
      sentencias.push(`${entidad.nombre} esta inicialmente en ${inicial.nombre}.`);
    }
    const terminal = ests.find((e) => e.esFinal);
    if (terminal) {
      sentencias.push(`${entidad.nombre} esta terminalmente en ${terminal.nombre}.`);
    }
  }

  const entidadIds = new Set(entidadesEnOpd.map((e) => e.id));
  const enlacesEnOpd = enlacesDelOpd(modelo, opd).filter(
    (el) => entidadIds.has(el.orig.id) && entidadIds.has(el.dest.id),
  );

  const estructurales = enlacesEnOpd.filter((el) => naturalezaDeEnlace(el.tipo) === "estructural");
  const procedurales = enlacesEnOpd.filter((el) => naturalezaDeEnlace(el.tipo) === "procedural");

  for (const el of estructurales) {
    const s = sentenciaEstructural(modelo, el);
    if (s) sentencias.push(s);
  }

  for (const el of procedurales) {
    const s = sentenciaProcedural(modelo, el);
    if (s) sentencias.push(s);
  }

  return sentencias;
}

function entidadesDelOpd(modelo: Modelo, opd: Opd): Entidad[] {
  return [...entidadesVisiblesEnOpd(opd)]
    .map((id) => modelo.entidades[id])
    .filter((e): e is Entidad => !!e);
}

function enlacesDelOpd(modelo: Modelo, opd: Opd): OplEnlace[] {
  const enlaceIds = new Set<Id>();
  for (const ae of Object.values(opd.enlaces)) {
    enlaceIds.add(ae.enlaceId);
  }
  const enlaces: OplEnlace[] = [];
  for (const id of enlaceIds) {
    const enlace = modelo.enlaces[id];
    if (!enlace) continue;
    const orig = entidadDeExtremo(modelo, enlace.origenId);
    const dest = entidadDeExtremo(modelo, enlace.destinoId);
    if (!orig || !dest) continue;
    enlaces.push({ ...enlace, orig, dest });
  }
  return enlaces;
}

function estadosDeEntidad(
  modelo: Modelo,
  entidadId: Id,
): { id: Id; nombre: string; esInicial?: boolean; esFinal?: boolean }[] {
  return Object.values(modelo.estados ?? {})
    .filter((e) => e.entidadId === entidadId)
    .sort((a, b) => a.id.localeCompare(b.id));
}

function sentenciaExistencia(entidad: Entidad): string {
  const tipo = entidad.tipo === "objeto" ? "objeto" : "proceso";
  const esencia = esenciaOpl(entidad.esencia);
  const af = entidad.afiliacion === "ambiental" ? " y ambiental" : "";
  return `${entidad.nombre} es un ${tipo} ${esencia}${af}.`;
}

function esenciaOpl(esencia: Esencia): string {
  return esencia === "fisica" ? "fisico" : "informatico";
}

function sentenciaEstructural(modelo: Modelo, el: OplEnlace): string | null {
  const sufijoOrdenado = estructuralOrdenado(modelo, el) ? " en esa secuencia" : "";
  switch (el.tipo) {
    case "agregacion":
      return `${el.orig.nombre} consta de ${el.dest.nombre}${sufijoOrdenado}.`;
    case "exhibicion":
      return `${el.orig.nombre} exhibe ${el.dest.nombre}${sufijoOrdenado}.`;
    case "generalizacion":
      return `${el.orig.nombre} es de tipo ${el.dest.nombre}${sufijoOrdenado}.`;
    case "clasificacion":
      return `${el.orig.nombre} tiene como instancia ${el.dest.nombre}${sufijoOrdenado}.`;
    default:
      return null;
  }
}

function estructuralOrdenado(modelo: Modelo, el: OplEnlace): boolean {
  if (naturalezaDeEnlace(el.tipo) !== "estructural") return false;
  const refinableId = el.origenId.kind === "entidad" ? el.origenId.id : null;
  return !!refinableId && (modelo.entidades[refinableId]?.orderedFundamentalTypes?.includes(el.tipo) ?? false);
}

function sentenciaProcedural(modelo: Modelo, el: OplEnlace): string | null {
  switch (el.tipo) {
    case "consumo":
      return `${el.dest.nombre} consume ${el.orig.nombre}.`;
    case "resultado":
      return `${el.orig.nombre} produce ${el.dest.nombre}.`;
    case "efecto": {
      const destEsEstado = el.destinoId.kind === "estado";
      const origEsEstado = el.origenId.kind === "estado";
      if (destEsEstado || origEsEstado) {
        const proc = el.orig.tipo === "proceso" ? el.orig.nombre : el.dest.nombre;
        const obj = el.orig.tipo === "objeto" ? el.orig.nombre : el.dest.nombre;
        const estadoOrigen = origEsEstado ? nombreEstadoEnExtremo(modelo, el.origenId.id) : null;
        const estadoDestino = destEsEstado ? nombreEstadoEnExtremo(modelo, el.destinoId.id) : null;
        if (estadoOrigen && estadoDestino) {
          return `${proc} cambia ${obj} de ${estadoOrigen} a ${estadoDestino}.`;
        }
        return `${proc} afecta ${obj}.`;
      }
      const proc = el.orig.tipo === "proceso" ? el.orig : el.dest;
      const obj = el.orig.tipo === "objeto" ? el.orig : el.dest;
      const estados = estadosDeEntidad(modelo, obj.id);
      const inicial = estados.find((e) => e.esInicial);
      const terminal = estados.find((e) => e.esFinal);
      if (inicial && terminal) {
        return `${proc.nombre} cambia ${obj.nombre} de ${inicial.nombre} a ${terminal.nombre}.`;
      }
      return `${proc.nombre} afecta ${obj.nombre}.`;
    }
    case "agente":
      return `${el.orig.nombre} manipula ${el.dest.nombre}.`;
    case "instrumento":
      return `${el.dest.nombre} usa ${el.orig.nombre}.`;
    case "invocacion":
      return `${el.orig.nombre} invoca ${el.dest.nombre}.`;
    case "excepcionSobretiempo":
      return `${el.dest.nombre} ocurre si duración de ${el.orig.nombre} excede su duración máxima.`;
    case "excepcionSubtiempo":
      return `${el.dest.nombre} ocurre si duración de ${el.orig.nombre} es menor que su duración mínima.`;
    case "excepcionSubSobretiempo":
      return `${el.dest.nombre} ocurre si duración de ${el.orig.nombre} es menor que su duración mínima o excede su duración máxima.`;
    default:
      return null;
  }
}

function nombreEstadoEnExtremo(modelo: Modelo, extremoId: Id): string | null {
  const estado = modelo.estados?.[extremoId];
  return estado ? estado.nombre : null;
}
