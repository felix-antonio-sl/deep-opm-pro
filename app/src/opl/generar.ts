import { esAutoInvocacion } from "../modelo/autoinvocacion";
import {
  entidadDeExtremo,
  entidadIdDeExtremo,
  estadoDeExtremo,
  extremoApuntaAEntidad,
} from "../modelo/extremos";
import { estadosDeEntidad } from "../modelo/operaciones";
import { modoPlegadoApariencia, partesDePlegado, UMBRAL_PARTES_MAS } from "../modelo/plegado";
import { rutaEtiquetaNormalizada } from "../modelo/rutas";
import type { Abanico, Apariencia, Enlace, Entidad, Estado, Id, Modelo, ModoDespliegueObjeto, Opd, TipoEnlace } from "../modelo/tipos";

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
  const transiciones = transicionesEstado(modelo, opd);
  const abanicosOpd = Object.values(modelo.abanicos ?? {}).filter((abanico) => abanico.opdId === opd.id);
  const enlacesEnAbanico = new Set<Id>();
  for (const abanico of abanicosOpd) {
    const lineasAbanico = oracionesAbanico(modelo, abanico);
    lineas.push(...lineasAbanico);
    for (const id of abanico.enlaceIds) enlacesEnAbanico.add(id);
  }
  for (const aparienciaEnlace of Object.values(opd.enlaces)) {
    const enlace = modelo.enlaces[aparienciaEnlace.enlaceId];
    if (!enlace) continue;
    if (enlacesEnAbanico.has(enlace.id)) continue;
    const transicion = transiciones.lineaPorEnlaceConsumo.get(enlace.id);
    if (transicion) {
      lineas.push(transicion);
      continue;
    }
    if (transiciones.enlacesCubiertos.has(enlace.id)) continue;
    const linea = oracionEnlaceConRuta(modelo, enlace);
    if (linea) lineas.push(linea);
  }
  return lineas;
}

function oracionesAbanico(modelo: Modelo, abanico: Abanico): string[] {
  const enlaces = abanico.enlaceIds
    .map((id) => modelo.enlaces[id])
    .filter((enlace): enlace is Enlace => enlace !== undefined);
  if (enlaces.some((enlace) => rutaEtiquetaNormalizada(enlace.rutaEtiqueta))) {
    return enlaces.flatMap((enlace) => {
      const linea = oracionEnlaceConRuta(modelo, enlace);
      return linea ? [linea] : [];
    });
  }
  const linea = oracionAbanico(modelo, abanico);
  return linea ? [linea] : [];
}

function oracionAbanico(modelo: Modelo, abanico: Abanico): string | null {
  const enlaces = abanico.enlaceIds
    .map((id) => modelo.enlaces[id])
    .filter((enlace): enlace is Enlace => enlace !== undefined);
  if (enlaces.length < 2) return null;
  const primer = enlaces[0];
  const puerto = modelo.entidades[abanico.puertoEntidadId];
  if (!puerto || !primer) return null;

  const otrosNombres: string[] = [];
  for (const enlace of enlaces) {
    const origenEntId = entidadIdDeExtremo(modelo, enlace.origenId);
    const otroExtremo = origenEntId === abanico.puertoEntidadId ? enlace.destinoId : enlace.origenId;
    const otraEnt = entidadDeExtremo(modelo, otroExtremo);
    if (otraEnt) otrosNombres.push(nombreOpl(otraEnt));
  }
  if (otrosNombres.length < 2) return null;

  const cuantificador = abanico.operador === "XOR" ? "exactamente uno de" : "al menos uno de";
  const lista = listarOpl(otrosNombres);
  const puertoEsOrigen = entidadIdDeExtremo(modelo, primer.origenId) === abanico.puertoEntidadId;
  const puertoOpl = nombreOpl(puerto);

  switch (primer.tipo) {
    case "agente":
      return puertoEsOrigen
        ? `${puertoOpl} maneja ${cuantificador} ${lista}.`
        : `${puertoOpl} es manejado por ${cuantificador} ${lista}.`;
    case "instrumento":
      return puertoEsOrigen
        ? `${puertoOpl} es requerido por ${cuantificador} ${lista}.`
        : `${puertoOpl} requiere ${cuantificador} ${lista}.`;
    case "consumo":
      return puertoEsOrigen
        ? `${puertoOpl} es consumido por ${cuantificador} ${lista}.`
        : `${puertoOpl} consume ${cuantificador} ${lista}.`;
    case "resultado":
      return puertoEsOrigen
        ? `${puertoOpl} genera ${cuantificador} ${lista}.`
        : `${puertoOpl} es generado por ${cuantificador} ${lista}.`;
    case "efecto":
      return `${puertoOpl} afecta ${cuantificador} ${lista}.`;
    case "invocacion":
      return puertoEsOrigen
        ? `${puertoOpl} invoca ${cuantificador} ${lista}.`
        : `${puertoOpl} es invocado por ${cuantificador} ${lista}.`;
    default:
      return null;
  }
}

function oracionEnlaceConRuta(modelo: Modelo, enlace: Enlace): string | null {
  const ruta = rutaEtiquetaNormalizada(enlace.rutaEtiqueta);
  if (!ruta) return oracionEnlace(modelo, enlace);
  const base = oracionProcedimentalParaRuta(modelo, enlace) ?? oracionEnlace(modelo, enlace);
  return base ? `Por ruta ${ruta}, ${base}` : null;
}

function oracionProcedimentalParaRuta(modelo: Modelo, enlace: Enlace): string | null {
  const origen = entidadDeExtremo(modelo, enlace.origenId);
  const destino = entidadDeExtremo(modelo, enlace.destinoId);
  if (!origen || !destino) return null;
  if (enlace.tipo === "resultado" && enlace.destinoId.kind === "estado" && origen.tipo === "proceso") {
    const estado = estadoDeExtremo(modelo, enlace.destinoId);
    return estado ? `${nombreOpl(origen)} genera ${nombreOpl(destino)} en \`${estado.nombre}\`.` : null;
  }
  if (enlace.tipo === "consumo" && enlace.origenId.kind === "estado" && destino.tipo === "proceso") {
    const estado = estadoDeExtremo(modelo, enlace.origenId);
    return estado ? `${nombreOpl(destino)} consume ${nombreOpl(origen)} en \`${estado.nombre}\`.` : null;
  }
  return oracionEnlace(modelo, enlace);
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
      return enlace && extremoApuntaAEntidad(enlace.origenId, entidad.id) ? [enlace.tipo] : [];
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

function transicionesEstado(modelo: Modelo, opd: Opd): { lineaPorEnlaceConsumo: Map<Id, string>; enlacesCubiertos: Set<Id> } {
  const consumos = Object.values(opd.enlaces)
    .map((apariencia) => modelo.enlaces[apariencia.enlaceId])
    .filter((enlace): enlace is Enlace => !!enlace && enlace.tipo === "consumo" && enlace.origenId.kind === "estado");
  const resultados = Object.values(opd.enlaces)
    .map((apariencia) => modelo.enlaces[apariencia.enlaceId])
    .filter((enlace): enlace is Enlace => !!enlace && enlace.tipo === "resultado" && enlace.destinoId.kind === "estado");
  const lineaPorEnlaceConsumo = new Map<Id, string>();
  const enlacesCubiertos = new Set<Id>();

  for (const consumo of consumos) {
    const objetoEntradaId = entidadIdDeExtremo(modelo, consumo.origenId);
    const procesoId = entidadIdDeExtremo(modelo, consumo.destinoId);
    if (!objetoEntradaId || !procesoId) continue;
    const resultado = resultados.find((candidato) => (
      entidadIdDeExtremo(modelo, candidato.origenId) === procesoId &&
      entidadIdDeExtremo(modelo, candidato.destinoId) === objetoEntradaId
    ));
    if (!resultado) continue;
    const proceso = modelo.entidades[procesoId];
    const objeto = modelo.entidades[objetoEntradaId];
    const estadoEntrada = estadoDeExtremo(modelo, consumo.origenId);
    const estadoSalida = estadoDeExtremo(modelo, resultado.destinoId);
    if (!proceso || !objeto || !estadoEntrada || !estadoSalida) continue;
    lineaPorEnlaceConsumo.set(
      consumo.id,
      `${nombreOpl(proceso)} cambia ${nombreOpl(objeto)} de \`${estadoEntrada.nombre}\` a \`${estadoSalida.nombre}\`.`,
    );
    enlacesCubiertos.add(consumo.id);
    enlacesCubiertos.add(resultado.id);
  }

  return { lineaPorEnlaceConsumo, enlacesCubiertos };
}

function oracionEnlace(modelo: Modelo, enlace: Enlace): string | null {
  const origen = entidadDeExtremo(modelo, enlace.origenId);
  const destino = entidadDeExtremo(modelo, enlace.destinoId);
  if (!origen || !destino) return null;

  const origenOpl = nombreOplExtremo(modelo, enlace.origenId, enlace.multiplicidadOrigen);
  const destinoOpl = nombreOplExtremo(modelo, enlace.destinoId, enlace.multiplicidadDestino);
  const origenPlural = multiplicidadPlural(enlace.multiplicidadOrigen);
  const destinoPlural = multiplicidadPlural(enlace.multiplicidadDestino);

  if (enlace.modificador === "evento") {
    return oracionEvento(modelo, enlace, origen, destino, origenOpl, destinoOpl);
  }
  if (enlace.modificador === "condicion") {
    return oracionCondicion(modelo, enlace, origen, destino, origenOpl, destinoOpl);
  }
  if (enlace.modificador === "no") {
    return oracionNegada(modelo, enlace, origen, destino, origenOpl, destinoOpl, origenPlural, destinoPlural);
  }
  if (esAutoInvocacion(enlace)) {
    return `${origenOpl} se invoca a sí mismo${enlace.demora ? ` despues de ${enlace.demora}` : ""}.`;
  }

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
      if (enlace.origenId.kind === "estado" && destino.tipo === "proceso") {
        const estado = estadoDeExtremo(modelo, enlace.origenId);
        return estado ? `${destinoOpl} cambia ${nombreOpl(origen)} de \`${estado.nombre}\`.` : null;
      }
      return `${destinoOpl} ${verbo("consume", "consumen", destinoPlural)} ${origenOpl}.`;
    case "resultado":
      if (enlace.destinoId.kind === "estado" && origen.tipo === "proceso") {
        const estado = estadoDeExtremo(modelo, enlace.destinoId);
        return estado ? `${origenOpl} cambia ${nombreOpl(destino)} a \`${estado.nombre}\`.` : null;
      }
      return `${origenOpl} ${verbo("genera", "generan", origenPlural)} ${destinoOpl}.`;
    case "efecto":
      return oracionEfecto(modelo, enlace, origen, destino);
    case "invocacion":
      return `${origenOpl} ${verbo("invoca", "invocan", origenPlural)} ${destinoOpl}${enlace.demora ? ` despues de ${enlace.demora}` : ""}.`;
  }
}

function oracionEvento(
  modelo: Modelo,
  enlace: Enlace,
  origen: Entidad,
  destino: Entidad,
  origenOpl: string,
  destinoOpl: string,
): string | null {
  const sufijo = sufijoProbabilidad(enlace);
  switch (enlace.tipo) {
    case "agente":
      return `${origenOpl} inicia y maneja ${destinoOpl}${sufijo}.`;
    case "instrumento":
      return `${origenOpl} inicia ${destinoOpl}, que requiere ${origenOpl}${sufijo}.`;
    case "consumo":
      return `${origenOpl} inicia ${destinoOpl}, que consume ${origenOpl}${sufijo}.`;
    case "resultado":
      return `${destinoOpl} inicia ${origenOpl}, que genera ${destinoOpl}${sufijo}.`;
    case "efecto": {
      const proceso = origen.tipo === "proceso" ? origenOpl : destino.tipo === "proceso" ? destinoOpl : null;
      const objeto = origen.tipo === "objeto" ? origenOpl : destino.tipo === "objeto" ? destinoOpl : null;
      return proceso && objeto ? `${objeto} inicia ${proceso}, que afecta ${objeto}${sufijo}.` : null;
    }
    case "invocacion":
      return `${origenOpl} inicia e invoca ${destinoOpl}${sufijo}.`;
    default:
      return oracionEnlaceSinModificador(modelo, enlace);
  }
}

function oracionCondicion(
  modelo: Modelo,
  enlace: Enlace,
  origen: Entidad,
  destino: Entidad,
  origenOpl: string,
  destinoOpl: string,
): string | null {
  switch (enlace.tipo) {
    case "agente":
      return `${origenOpl} maneja ${destinoOpl} si ${origenOpl} existe, de lo contrario ${destinoOpl} se omite.`;
    case "instrumento":
      return `${destinoOpl} ocurre si ${origenOpl} existe, de lo contrario ${destinoOpl} se omite.`;
    case "consumo":
      return `${destinoOpl} ocurre si ${origenOpl} existe, en cuyo caso ${destinoOpl} consume ${origenOpl}, de lo contrario ${destinoOpl} se omite.`;
    case "resultado":
      return `${origenOpl} ocurre si ${destinoOpl} puede generarse, en cuyo caso ${origenOpl} genera ${destinoOpl}, de lo contrario ${origenOpl} se omite.`;
    case "efecto": {
      const proceso = origen.tipo === "proceso" ? origenOpl : destino.tipo === "proceso" ? destinoOpl : null;
      const objeto = origen.tipo === "objeto" ? origenOpl : destino.tipo === "objeto" ? destinoOpl : null;
      return proceso && objeto ? `${proceso} ocurre si ${objeto} existe, en cuyo caso ${proceso} afecta ${objeto}, de lo contrario ${proceso} se omite.` : null;
    }
    case "invocacion":
      return `${origenOpl} invoca ${destinoOpl} si ${origenOpl} ocurre.`;
    default:
      return oracionEnlaceSinModificador(modelo, enlace);
  }
}

function oracionNegada(
  modelo: Modelo,
  enlace: Enlace,
  origen: Entidad,
  destino: Entidad,
  origenOpl: string,
  destinoOpl: string,
  origenPlural: boolean,
  destinoPlural: boolean,
): string | null {
  switch (enlace.tipo) {
    case "agente":
      return `${origenOpl} no ${verbo("maneja", "manejan", origenPlural)} ${destinoOpl}.`;
    case "instrumento":
      return `${destinoOpl} no ${verbo("requiere", "requieren", destinoPlural)} ${origenOpl}.`;
    case "consumo":
      return `${destinoOpl} no ${verbo("consume", "consumen", destinoPlural)} ${origenOpl}.`;
    case "resultado":
      return `${origenOpl} no ${verbo("genera", "generan", origenPlural)} ${destinoOpl}.`;
    case "efecto": {
      const proceso = origen.tipo === "proceso" ? origenOpl : destino.tipo === "proceso" ? destinoOpl : null;
      const objeto = origen.tipo === "objeto" ? origenOpl : destino.tipo === "objeto" ? destinoOpl : null;
      return proceso && objeto ? `${proceso} no afecta ${objeto}.` : null;
    }
    default:
      return oracionEnlaceSinModificador(modelo, enlace);
  }
}

function oracionEnlaceSinModificador(modelo: Modelo, enlace: Enlace): string | null {
  const { modificador: _modificador, probabilidad: _probabilidad, ...sinModificador } = enlace;
  return oracionEnlace(modelo, sinModificador);
}

function oracionEfecto(modelo: Modelo, enlace: Enlace, origen: Entidad, destino: Entidad): string | null {
  const proceso = origen.tipo === "proceso" ? origen : destino.tipo === "proceso" ? destino : null;
  const objeto = origen.tipo === "objeto" ? origen : destino.tipo === "objeto" ? destino : null;
  if (!proceso || !objeto) return null;
  const procesoEsOrigen = entidadIdDeExtremo(modelo, enlace.origenId) === proceso.id;
  const objetoEsOrigen = entidadIdDeExtremo(modelo, enlace.origenId) === objeto.id;
  const multiplicidadProceso = procesoEsOrigen ? enlace.multiplicidadOrigen : enlace.multiplicidadDestino;
  const multiplicidadObjeto = objetoEsOrigen ? enlace.multiplicidadOrigen : enlace.multiplicidadDestino;
  const extremoObjeto = objetoEsOrigen ? enlace.origenId : enlace.destinoId;
  return `${nombreOplConMultiplicidad(proceso, multiplicidadProceso)} ${verbo("afecta", "afectan", multiplicidadPlural(multiplicidadProceso))} ${nombreOplExtremo(modelo, extremoObjeto, multiplicidadObjeto)}.`;
}

function sufijoProbabilidad(enlace: Enlace): string {
  return enlace.probabilidad === undefined ? "" : ` (probabilidad ${formatearProbabilidad(enlace.probabilidad)})`;
}

function formatearProbabilidad(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(3)));
}

function nombreOpl(entidad: Entidad): string {
  return entidad.tipo === "objeto" ? `**${entidad.nombre}**` : `*${entidad.nombre}*`;
}

function nombreOplExtremo(modelo: Modelo, extremo: Enlace["origenId"], multiplicidad: string | undefined): string {
  const entidad = entidadDeExtremo(modelo, extremo);
  if (!entidad) return extremo.id;
  const base = nombreOplConMultiplicidad(entidad, multiplicidad);
  const estado = estadoDeExtremo(modelo, extremo);
  return estado ? `${base} en \`${estado.nombre}\`` : base;
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
