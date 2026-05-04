import type { Apariencia, Enlace, Entidad, Id, Modelo, Opd } from "../modelo/tipos";

export function generarOpl(modelo: Modelo, opdId: Id = modelo.opdRaizId): string[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  const lineas: string[] = [];
  for (const apariencia of Object.values(opd.apariencias)) {
    const entidad = modelo.entidades[apariencia.entidadId];
    if (!entidad) continue;
    lineas.push(oracionEntidad(entidad));
    const descomposicion = oracionDescomposicion(modelo, entidad);
    if (descomposicion) lineas.push(descomposicion);
  }
  for (const aparienciaEnlace of Object.values(opd.enlaces)) {
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace) continue;
    const linea = oracionEnlace(modelo, enlace);
    if (linea) lineas.push(linea);
  }
  return lineas;
}

function oracionDescomposicion(modelo: Modelo, entidad: Entidad): string | null {
  if (entidad.refinamiento?.tipo !== "descomposicion") return null;
  const opdHijo = modelo.opds[entidad.refinamiento.opdId];
  if (!opdHijo) return null;
  const aparienciasInternas = aparienciasInternasDeDescomposicion(modelo, opdHijo, entidad)
    .sort((a, b) => a.y - b.y || a.x - b.x);
  const internos = aparienciasInternas
    .flatMap((apariencia) => {
      const interna = modelo.entidades[apariencia.entidadId];
      return interna ? [nombreOpl(interna)] : [];
    });
  const destino = internos.length > 0 ? listarOpl(internos) : codigoOpd(opdHijo.nombre);
  const secuencia = aparienciasInternas.length > 1 && aparienciasInternas.every((apariencia) => modelo.entidades[apariencia.entidadId]?.tipo === "proceso")
    ? " en esa secuencia"
    : "";
  return `${nombreOpl(entidad)} se descompone en ${destino}${secuencia}.`;
}

function aparienciasInternasDeDescomposicion(modelo: Modelo, opdHijo: Opd, entidad: Entidad): Apariencia[] {
  const contorno = Object.values(opdHijo.apariencias).find((apariencia) => apariencia.entidadId === entidad.id);
  if (!contorno) return [];
  return Object.values(opdHijo.apariencias)
    .filter((apariencia) => apariencia.entidadId !== entidad.id)
    .filter((apariencia) => dentroDe(apariencia, contorno));
}

function dentroDe(apariencia: Apariencia, contorno: Apariencia): boolean {
  return (
    apariencia.x >= contorno.x &&
    apariencia.y >= contorno.y &&
    apariencia.x + apariencia.width <= contorno.x + contorno.width &&
    apariencia.y + apariencia.height <= contorno.y + contorno.height
  );
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

function listarOpl(items: string[]): string {
  if (items.length === 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} y ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

function codigoOpd(nombre: string): string {
  return /^SD(?:\d+(?:\.\d+)*)?/.exec(nombre.trim())?.[0] ?? nombre;
}

function textoEsencia(entidad: Entidad): string {
  return entidad.esencia === "fisica" ? "físico" : "informacional";
}

function textoAfiliacion(entidad: Entidad): string {
  return entidad.afiliacion === "sistemica" ? "sistémico" : "ambiental";
}
