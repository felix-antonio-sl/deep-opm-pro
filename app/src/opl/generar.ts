import { estadosDeEntidad } from "../modelo/operaciones";
import { modoPlegadoApariencia, partesDePlegado, UMBRAL_PARTES_MAS } from "../modelo/plegado";
import type { Apariencia, Enlace, Entidad, Estado, Id, Modelo, ModoDespliegueObjeto, Opd, TipoEnlace } from "../modelo/tipos";

export function generarOpl(modelo: Modelo, opdId: Id = modelo.opdRaizId): string[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  const lineas: string[] = [];
  for (const apariencia of Object.values(opd.apariencias)) {
    const entidad = modelo.entidades[apariencia.entidadId];
    if (!entidad) continue;
    lineas.push(oracionEntidad(entidad));
    const estados = entidad.tipo === "objeto" ? estadosDeEntidad(modelo, entidad.id) : [];
    if (estados.length > 0) lineas.push(oracionEstados(entidad, estados));
    const refinamiento = oracionRefinamiento(modelo, apariencia, entidad);
    if (refinamiento) lineas.push(refinamiento);
  }
  for (const aparienciaEnlace of Object.values(opd.enlaces)) {
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace) continue;
    const linea = oracionEnlace(modelo, enlace);
    if (linea) lineas.push(linea);
  }
  return lineas;
}

function oracionRefinamiento(modelo: Modelo, apariencia: Apariencia, entidad: Entidad): string | null {
  if (!entidad.refinamiento) return null;
  const parcial = oracionPlegadoParcial(modelo, apariencia, entidad);
  if (parcial) return parcial;
  const opdHijo = modelo.opds[entidad.refinamiento.opdId];
  if (!opdHijo) return null;
  const aparienciasInternas = aparienciasInternasDeRefinamiento(modelo, opdHijo, entidad)
    .sort((a, b) => compararOrdenTemporal(a, b));
  const internos = aparienciasInternas
    .flatMap((apariencia) => {
      const interna = modelo.entidades[apariencia.entidadId];
      return interna ? [nombreOpl(interna)] : [];
    });
  if (entidad.refinamiento.tipo === "despliegue") {
    return oracionDespliegue(modelo, entidad, opdHijo, internos);
  }

  const destino = internos.length > 0 ? listarOpl(internos) : codigoOpd(opdHijo.nombre);
  const todosProcesos = aparienciasInternas.length > 1 && aparienciasInternas.every((apariencia) => modelo.entidades[apariencia.entidadId]?.tipo === "proceso");
  const temporal = todosProcesos ? describirProcesosTemporales(modelo, aparienciasInternas) : null;
  const destinoProcesos = temporal?.texto ?? destino;
  const secuencia = todosProcesos && temporal?.tieneSecuencia
    ? temporal.tieneParalelos ? ", en esa secuencia" : " en esa secuencia"
    : "";
  return `${nombreOpl(entidad)} se descompone en ${destinoProcesos}${secuencia}.`;
}

function oracionPlegadoParcial(modelo: Modelo, apariencia: Apariencia, entidad: Entidad): string | null {
  if (modoPlegadoApariencia(apariencia) !== "parcial") return null;
  const partes = partesDePlegado(modelo, entidad.id);
  if (partes.length === 0) return null;
  const visibles = partes.slice(0, UMBRAL_PARTES_MAS).map((parte) => {
    const interna = modelo.entidades[parte.entidadId];
    return interna ? nombreOpl(interna) : `**${parte.nombre}**`;
  });
  const restantes = partes.length - visibles.length;
  const destino = restantes > 0
    ? `${listarOpl(visibles)} y ${restantes} ${restantes === 1 ? "parte más" : "partes más"}`
    : listarOpl(visibles);
  return `${nombreOpl(entidad)} consiste en ${destino}.`;
}

function oracionDespliegue(modelo: Modelo, entidad: Entidad, opdHijo: Opd, internos: string[]): string {
  const modo = modoDespliegue(modelo, entidad, opdHijo);
  const destino = internos.length > 0 ? listarOpl(internos) : codigoOpd(opdHijo.nombre);

  if (modo === "agregacion") return `${nombreOpl(entidad)} se despliega en ${destino}.`;
  if (modo === "exhibicion") return `${nombreOpl(entidad)} exhibe ${destino}.`;
  if (modo === "generalizacion") return `${destino} ${internos.length === 1 ? "es un" : "son"} ${nombreOpl(entidad)}.`;
  return `${destino} ${internos.length === 1 ? "es una instancia" : "son instancias"} de ${nombreOpl(entidad)}.`;
}

function modoDespliegue(modelo: Modelo, entidad: Entidad, opdHijo: Opd): ModoDespliegueObjeto {
  const modoPersistido = entidad.refinamiento?.tipo === "despliegue" ? entidad.refinamiento.modo : undefined;
  if (modoPersistido) return modoPersistido;
  const tipos = Object.values(opdHijo.enlaces)
    .flatMap((aparienciaEnlace) => {
      const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
      return enlace?.origenId === entidad.id ? [enlace.tipo] : [];
    });
  return tipos.map(modoPorTipoEnlace).find((modo): modo is ModoDespliegueObjeto => modo !== null) ?? "agregacion";
}

function modoPorTipoEnlace(tipo: TipoEnlace): ModoDespliegueObjeto | null {
  if (tipo === "agregacion") return "agregacion";
  if (tipo === "exhibicion") return "exhibicion";
  if (tipo === "generalizacion") return "generalizacion";
  if (tipo === "clasificacion") return "clasificacion";
  return null;
}

function aparienciasInternasDeRefinamiento(modelo: Modelo, opdHijo: Opd, entidad: Entidad): Apariencia[] {
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

function compararOrdenTemporal(a: Apariencia, b: Apariencia): number {
  return a.y - b.y || a.x - b.x || a.id.localeCompare(b.id);
}

function oracionEntidad(entidad: Entidad): string {
  const nombre = nombreOpl(entidad);
  const tipo = entidad.tipo === "objeto" ? "objeto" : "proceso";
  return `${nombre} es un ${tipo} ${textoEsencia(entidad)} y ${textoAfiliacion(entidad)}.`;
}

function oracionEstados(entidad: Entidad, estados: Estado[]): string {
  return `${nombreOpl(entidad)} puede ser ${listarEstadosOpl(estados.map(nombreEstadoOpl))}.`;
}

function nombreEstadoOpl(estado: Estado): string {
  const designaciones = [
    ...(estado.esInicial ? ["inicial"] : []),
    ...(estado.esFinal ? ["final"] : []),
  ];
  return `\`${estado.nombre}\`${designaciones.length > 0 ? ` (${listarDesignaciones(designaciones)})` : ""}`;
}

function oracionEnlace(modelo: Modelo, enlace: Enlace): string | null {
  const origen = modelo.entidades[enlace.origenId];
  const destino = modelo.entidades[enlace.destinoId];
  if (!origen || !destino) return null;

  const origenOpl = nombreOplConMultiplicidad(origen, enlace.multiplicidadOrigen);
  const destinoOpl = nombreOplConMultiplicidad(destino, enlace.multiplicidadDestino);
  const origenPlural = multiplicidadPlural(enlace.multiplicidadOrigen);
  const destinoPlural = multiplicidadPlural(enlace.multiplicidadDestino);

  switch (enlace.tipo) {
    case "agregacion":
      return `${origenOpl} ${verbo("consta", "constan", origenPlural)} de ${destinoOpl}.`;
    case "exhibicion":
      return `${origenOpl} ${verbo("exhibe", "exhiben", origenPlural)} ${destinoOpl}.`;
    case "generalizacion":
      return destinoPlural ? `${destinoOpl} son ${origenOpl}.` : `${destinoOpl} es un ${origenOpl}.`;
    case "clasificacion":
      return destinoPlural ? `${destinoOpl} son instancias de ${origenOpl}.` : `${destinoOpl} es una instancia de ${origenOpl}.`;
    case "agente":
      return `${origenOpl} ${verbo("maneja", "manejan", origenPlural)} ${destinoOpl}.`;
    case "instrumento":
      return `${destinoOpl} ${verbo("requiere", "requieren", destinoPlural)} ${origenOpl}.`;
    case "consumo":
      return `${destinoOpl} ${verbo("consume", "consumen", destinoPlural)} ${origenOpl}.`;
    case "resultado":
      return `${origenOpl} ${verbo("genera", "generan", origenPlural)} ${destinoOpl}.`;
    case "efecto":
      return oracionEfecto(enlace, origen, destino);
    case "invocacion":
      return `${origenOpl} ${verbo("invoca", "invocan", origenPlural)} ${destinoOpl}.`;
  }
}

function oracionEfecto(enlace: Enlace, origen: Entidad, destino: Entidad): string | null {
  const proceso = origen.tipo === "proceso" ? origen : destino.tipo === "proceso" ? destino : null;
  const objeto = origen.tipo === "objeto" ? origen : destino.tipo === "objeto" ? destino : null;
  if (!proceso || !objeto) return null;
  const multiplicidadProceso = proceso.id === enlace.origenId ? enlace.multiplicidadOrigen : enlace.multiplicidadDestino;
  const multiplicidadObjeto = objeto.id === enlace.origenId ? enlace.multiplicidadOrigen : enlace.multiplicidadDestino;
  return `${nombreOplConMultiplicidad(proceso, multiplicidadProceso)} ${verbo("afecta", "afectan", multiplicidadPlural(multiplicidadProceso))} ${nombreOplConMultiplicidad(objeto, multiplicidadObjeto)}.`;
}

function nombreOpl(entidad: Entidad): string {
  return entidad.tipo === "objeto" ? `**${entidad.nombre}**` : `*${entidad.nombre}*`;
}

function nombreOplConMultiplicidad(entidad: Entidad, multiplicidad: string | undefined): string {
  const nombre = multiplicidadPlural(multiplicidad) ? pluralizarCanonico(entidad.nombre) : entidad.nombre;
  const token = entidad.tipo === "objeto" ? `**${nombre}**` : `*${nombre}*`;
  return multiplicidad ? `${multiplicidad} ${token}` : token;
}

function pluralizarCanonico(texto: string): string {
  if (/z$/i.test(texto)) return `${texto.slice(0, -1)}ces`;
  if (/[aeiou]$/i.test(texto)) return `${texto}s`;
  return `${texto}es`;
}

function multiplicidadPlural(multiplicidad: string | undefined): boolean {
  if (!multiplicidad) return false;
  if (multiplicidad === "*") return true;
  if (/^\d+$/.test(multiplicidad)) return Number(multiplicidad) !== 1;
  if (multiplicidad.endsWith("..N")) return true;
  const [, max] = multiplicidad.split("..");
  return Number(max) !== 1;
}

function verbo(singular: string, plural: string, usarPlural: boolean): string {
  return usarPlural ? plural : singular;
}

function listarOpl(items: string[]): string {
  if (items.length === 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} y ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

function listarEstadosOpl(items: string[]): string {
  if (items.length === 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} o ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} o ${items[items.length - 1]}`;
}

function listarDesignaciones(items: string[]): string {
  if (items.length === 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

function describirProcesosTemporales(modelo: Modelo, apariencias: Apariencia[]): { texto: string; tieneParalelos: boolean; tieneSecuencia: boolean } {
  const grupos: Array<{ y: number; items: string[] }> = [];
  for (const apariencia of apariencias) {
    const entidad = modelo.entidades[apariencia.entidadId];
    if (!entidad) continue;
    const ultimoGrupo = grupos[grupos.length - 1];
    if (ultimoGrupo && apariencia.y === ultimoGrupo.y) {
      ultimoGrupo.items.push(nombreOpl(entidad));
    } else {
      grupos.push({ y: apariencia.y, items: [nombreOpl(entidad)] });
    }
  }

  return {
    texto: listarSecuenciaTemporal(grupos.map((grupo) => grupo.items.length > 1 ? `${listarOpl(grupo.items)} en paralelo` : grupo.items[0] ?? "")),
    tieneParalelos: grupos.some((grupo) => grupo.items.length > 1),
    tieneSecuencia: grupos.length > 1,
  };
}

function listarSecuenciaTemporal(items: string[]): string {
  if (items.length <= 2) return items.join(", ");
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
