import type { Enlace, Entidad, Id, Modelo } from "../modelo/tipos";

export function generarOpl(modelo: Modelo, opdId: Id = modelo.opdRaizId): string[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  const lineas: string[] = [];
  for (const apariencia of Object.values(opd.apariencias)) {
    const entidad = modelo.entidades[apariencia.entidadId];
    if (entidad) lineas.push(oracionEntidad(entidad));
  }
  for (const aparienciaEnlace of Object.values(opd.enlaces)) {
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace) continue;
    const linea = oracionEnlace(modelo, enlace);
    if (linea) lineas.push(linea);
  }
  return lineas;
}

function oracionEntidad(entidad: Entidad): string {
  const nombre = nombreOpl(entidad);
  const tipo = entidad.tipo === "objeto" ? "objeto" : "proceso";
  return `${nombre} es un ${tipo} ${textoEsencia(entidad)} y ${textoAfiliacion(entidad)}.`;
}

function oracionEnlace(modelo: Modelo, enlace: Enlace): string | null {
  const origen = modelo.entidades[enlace.origenId];
  const destino = modelo.entidades[enlace.destinoId];
  if (!origen || !destino) return null;

  const origenOpl = nombreOpl(origen);
  const destinoOpl = nombreOpl(destino);

  switch (enlace.tipo) {
    case "agregacion":
      return `${origenOpl} consta de ${destinoOpl}.`;
    case "agente":
      return `${origenOpl} maneja ${destinoOpl}.`;
    case "instrumento":
      return `${destinoOpl} requiere ${origenOpl}.`;
    case "consumo":
      return `${destinoOpl} consume ${origenOpl}.`;
    case "resultado":
      return `${origenOpl} genera ${destinoOpl}.`;
    case "efecto":
      return oracionEfecto(origen, destino);
    case "invocacion":
      return `${origenOpl} invoca ${destinoOpl}.`;
  }
}

function oracionEfecto(origen: Entidad, destino: Entidad): string | null {
  const proceso = origen.tipo === "proceso" ? origen : destino.tipo === "proceso" ? destino : null;
  const objeto = origen.tipo === "objeto" ? origen : destino.tipo === "objeto" ? destino : null;
  return proceso && objeto ? `${nombreOpl(proceso)} afecta ${nombreOpl(objeto)}.` : null;
}

function nombreOpl(entidad: Entidad): string {
  return entidad.tipo === "objeto" ? `**${entidad.nombre}**` : `*${entidad.nombre}*`;
}

function textoEsencia(entidad: Entidad): string {
  return entidad.esencia === "fisica" ? "físico" : "informacional";
}

function textoAfiliacion(entidad: Entidad): string {
  return entidad.afiliacion === "sistemica" ? "sistémico" : "ambiental";
}
