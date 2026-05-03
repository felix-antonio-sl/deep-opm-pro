import type { Enlace, Entidad, Modelo } from "../modelo/tipos";

export function generarOpl(modelo: Modelo): string[] {
  const lineas: string[] = [];
  for (const entidad of Object.values(modelo.entidades)) {
    lineas.push(oracionEntidad(entidad));
  }
  for (const enlace of Object.values(modelo.enlaces)) {
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
      return `${origenOpl} consume ${destinoOpl}.`;
    case "resultado":
      return `${origenOpl} genera ${destinoOpl}.`;
    case "efecto":
      return `${origenOpl} afecta ${destinoOpl}.`;
    case "invocacion":
      return `${origenOpl} invoca ${destinoOpl}.`;
  }
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
