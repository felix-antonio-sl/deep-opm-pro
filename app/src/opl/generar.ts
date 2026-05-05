import { esAutoInvocacion } from "../modelo/autoinvocacion";
import { etiquetaEnlaceNormalizada } from "../modelo/etiquetasEnlace";
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
import { crearLineaOplInteractiva, type OplLineaInteractiva, type OplReferencia, type OplTokenHint } from "./interaccion";

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

export function generarOplInteractivo(modelo: Modelo, opdId: Id = modelo.opdRaizId): OplLineaInteractiva[] {
  const opd = modelo.opds[opdId];
  if (!opd) return [];
  const lineas: Array<{ texto: string; refs: OplReferencia[]; hints: OplTokenHint[] }> = [];

  for (const apariencia of Object.values(opd.apariencias)) {
    const entidad = modelo.entidades[apariencia.entidadId];
    if (!entidad) continue;
    agregarLinea(lineas, oracionEntidad(entidad), refsEntidad(entidad.id), [hintEntidad(entidad)]);
    const estados = entidad.tipo === "objeto" ? estadosDeEntidad(modelo, entidad.id) : [];
    if (estados.length > 0) {
      agregarLinea(
        lineas,
        oracionEstados(entidad, estados),
        [refEntidad(entidad.id), ...estados.map((estado) => refEstado(estado.id))],
        [hintEntidad(entidad), ...estados.map(hintEstado)],
      );
    }
    const refinamiento = oracionRefinamiento(modelo, apariencia, entidad);
    if (refinamiento) {
      agregarLinea(lineas, refinamiento, refsRefinamiento(modelo, apariencia, entidad), hintsRefinamiento(modelo, apariencia, entidad));
    }
  }

  const transiciones = transicionesEstadoInteractivo(modelo, opd);
  const abanicosOpd = Object.values(modelo.abanicos ?? {}).filter((abanico) => abanico.opdId === opd.id);
  const enlacesEnAbanico = new Set<Id>();
  for (const abanico of abanicosOpd) {
    for (const linea of oracionesAbanicoInteractivo(modelo, abanico)) {
      lineas.push(linea);
    }
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
    const texto = oracionEnlaceConRuta(modelo, enlace);
    if (texto) agregarLinea(lineas, texto, refsEnlace(modelo, enlace), hintsEnlace(modelo, enlace, texto));
  }

  return lineas.map((linea, index) => crearLineaOplInteractiva(`opl-${opdId}-${index + 1}`, linea.texto, index + 1, linea.refs, linea.hints));
}

function agregarLinea(
  lineas: Array<{ texto: string; refs: OplReferencia[]; hints: OplTokenHint[] }>,
  texto: string | null,
  refs: OplReferencia[],
  hints: OplTokenHint[],
): void {
  if (!texto) return;
  lineas.push({ texto, refs, hints });
}

function oracionesAbanicoInteractivo(modelo: Modelo, abanico: Abanico): Array<{ texto: string; refs: OplReferencia[]; hints: OplTokenHint[] }> {
  const enlaces = abanico.enlaceIds
    .map((id) => modelo.enlaces[id])
    .filter((enlace): enlace is Enlace => enlace !== undefined);
  if (enlaces.some((enlace) => rutaEtiquetaNormalizada(enlace.rutaEtiqueta))) {
    return enlaces.flatMap((enlace) => {
      const texto = oracionEnlaceConRuta(modelo, enlace);
      return texto ? [{ texto, refs: refsEnlace(modelo, enlace), hints: hintsEnlace(modelo, enlace, texto) }] : [];
    });
  }
  const texto = oracionAbanico(modelo, abanico);
  if (!texto) return [];
  return [{
    texto,
    refs: refsAbanico(modelo, abanico),
    hints: hintsAbanico(modelo, abanico, texto),
  }];
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
  const base = oracionProcedimentalParaRuta(modelo, enlace) ?? oracionEnlaceSinEtiqueta(modelo, enlace);
  return conEtiquetaEnlace(enlace, base ? `Por ruta ${ruta}, ${base}` : null);
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

function transicionesEstadoInteractivo(
  modelo: Modelo,
  opd: Opd,
): { lineaPorEnlaceConsumo: Map<Id, { texto: string; refs: OplReferencia[]; hints: OplTokenHint[] }>; enlacesCubiertos: Set<Id> } {
  const consumos = Object.values(opd.enlaces)
    .map((apariencia) => modelo.enlaces[apariencia.enlaceId])
    .filter((enlace): enlace is Enlace => !!enlace && enlace.tipo === "consumo" && enlace.origenId.kind === "estado");
  const resultados = Object.values(opd.enlaces)
    .map((apariencia) => modelo.enlaces[apariencia.enlaceId])
    .filter((enlace): enlace is Enlace => !!enlace && enlace.tipo === "resultado" && enlace.destinoId.kind === "estado");
  const lineaPorEnlaceConsumo = new Map<Id, { texto: string; refs: OplReferencia[]; hints: OplTokenHint[] }>();
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
    const texto = `${nombreOpl(proceso)} cambia ${nombreOpl(objeto)} de \`${estadoEntrada.nombre}\` a \`${estadoSalida.nombre}\`.`;
    lineaPorEnlaceConsumo.set(consumo.id, {
      texto,
      refs: [
        refEntidad(proceso.id),
        refEntidad(objeto.id),
        refEstado(estadoEntrada.id),
        refEstado(estadoSalida.id),
        refEnlace(consumo.id),
        refEnlace(resultado.id),
      ],
      hints: [
        hintEntidad(proceso),
        hintEnlace(consumo, "cambia"),
        hintEntidad(objeto),
        hintEstado(estadoEntrada),
        hintEstado(estadoSalida),
      ],
    });
    enlacesCubiertos.add(consumo.id);
    enlacesCubiertos.add(resultado.id);
  }

  return { lineaPorEnlaceConsumo, enlacesCubiertos };
}

function refsEnlace(modelo: Modelo, enlace: Enlace): OplReferencia[] {
  const refs: OplReferencia[] = [refEnlace(enlace.id)];
  const origen = entidadIdDeExtremo(modelo, enlace.origenId);
  const destino = entidadIdDeExtremo(modelo, enlace.destinoId);
  if (origen) refs.push(refEntidad(origen));
  if (destino) refs.push(refEntidad(destino));
  if (enlace.origenId.kind === "estado") refs.push(refEstado(enlace.origenId.id));
  if (enlace.destinoId.kind === "estado") refs.push(refEstado(enlace.destinoId.id));
  return refs;
}

function hintsEnlace(modelo: Modelo, enlace: Enlace, texto: string): OplTokenHint[] {
  const hints: OplTokenHint[] = [];
  const origen = entidadDeExtremo(modelo, enlace.origenId);
  const destino = entidadDeExtremo(modelo, enlace.destinoId);
  if (origen) hints.push(hintEntidad(origen, nombreOplExtremo(modelo, enlace.origenId, enlace.multiplicidadOrigen)));
  const verbo = verboInteractivo(enlace, texto);
  if (verbo) hints.push(hintEnlace(enlace, verbo));
  if (destino) hints.push(hintEntidad(destino, nombreOplExtremo(modelo, enlace.destinoId, enlace.multiplicidadDestino)));
  const estadoOrigen = estadoDeExtremo(modelo, enlace.origenId);
  const estadoDestino = estadoDeExtremo(modelo, enlace.destinoId);
  if (estadoOrigen) hints.push(hintEstado(estadoOrigen));
  if (estadoDestino) hints.push(hintEstado(estadoDestino));
  return hints;
}

function refsAbanico(modelo: Modelo, abanico: Abanico): OplReferencia[] {
  const refs: OplReferencia[] = [refEntidad(abanico.puertoEntidadId)];
  for (const id of abanico.enlaceIds) {
    const enlace = modelo.enlaces[id];
    if (enlace) refs.push(...refsEnlace(modelo, enlace));
  }
  return refs;
}

function hintsAbanico(modelo: Modelo, abanico: Abanico, texto: string): OplTokenHint[] {
  const enlaces = abanico.enlaceIds
    .map((id) => modelo.enlaces[id])
    .filter((enlace): enlace is Enlace => enlace !== undefined);
  const puerto = modelo.entidades[abanico.puertoEntidadId];
  const hints: OplTokenHint[] = puerto ? [hintEntidad(puerto)] : [];
  const primer = enlaces[0];
  const verbo = primer ? verboInteractivo(primer, texto) : null;
  if (primer && verbo) hints.push(hintEnlace(primer, verbo));
  for (const enlace of enlaces) {
    const origenEntId = entidadIdDeExtremo(modelo, enlace.origenId);
    const otroExtremo = origenEntId === abanico.puertoEntidadId ? enlace.destinoId : enlace.origenId;
    const entidad = entidadDeExtremo(modelo, otroExtremo);
    if (entidad) hints.push(hintEntidad(entidad));
  }
  return hints;
}

function refsRefinamiento(modelo: Modelo, apariencia: Apariencia, entidad: Entidad): OplReferencia[] {
  const refs = refsEntidad(entidad.id);
  if (!entidad.refinamiento) return refs;
  const opdHijo = modelo.opds[entidad.refinamiento.opdId];
  if (!opdHijo) return refs;
  for (const interna of aparienciasInternasDeRefinamiento(modelo, opdHijo, entidad)) {
    refs.push(refEntidad(interna.entidadId));
  }
  for (const enlace of Object.values(modelo.enlaces)) {
    const origen = entidadIdDeExtremo(modelo, enlace.origenId);
    const destino = entidadIdDeExtremo(modelo, enlace.destinoId);
    if (origen === entidad.id || destino === entidad.id) refs.push(refEnlace(enlace.id));
  }
  if (modoPlegadoApariencia(apariencia) === "parcial") {
    for (const parte of partesDePlegado(modelo, entidad.id)) refs.push(refEntidad(parte.entidadId));
  }
  return refs;
}

function hintsRefinamiento(modelo: Modelo, apariencia: Apariencia, entidad: Entidad): OplTokenHint[] {
  const hints: OplTokenHint[] = [hintEntidad(entidad)];
  if (modoPlegadoApariencia(apariencia) === "parcial") {
    for (const parte of partesDePlegado(modelo, entidad.id)) {
      const interna = modelo.entidades[parte.entidadId];
      if (interna) hints.push(hintEntidad(interna));
    }
    return hints;
  }
  if (!entidad.refinamiento) return hints;
  const opdHijo = modelo.opds[entidad.refinamiento.opdId];
  if (!opdHijo) return hints;

  // Recolectar enlaces que conectan al padre con cada hijo en el OPD hijo
  // para asociar cada token nombre de hijo al enlace específico (HU-50.021).
  const enlaceHijoPorEntidadId = new Map<Id, Enlace>();
  for (const enlace of Object.values(modelo.enlaces)) {
    const origen = entidadIdDeExtremo(modelo, enlace.origenId);
    const destino = entidadIdDeExtremo(modelo, enlace.destinoId);
    if (origen === entidad.id && destino && !enlaceHijoPorEntidadId.has(destino)) {
      enlaceHijoPorEntidadId.set(destino, enlace);
    }
    if (destino === entidad.id && origen && !enlaceHijoPorEntidadId.has(origen)) {
      enlaceHijoPorEntidadId.set(origen, enlace);
    }
  }

  // Verbo de refinamiento (HU-50.022: doble clic en verbo abre inspector)
  if (entidad.refinamiento.tipo === "despliegue") {
    const modo = modoDespliegue(modelo, entidad, opdHijo);
    const verboRefinamiento = verboDespliegue(modo);
    if (verboRefinamiento) {
      // Usar el primer enlace hijo como referencia para el verbo
      const primerEnlace = enlaceHijoPorEntidadId.values().next().value;
      if (primerEnlace) {
        hints.push(hintEnlace(primerEnlace, verboRefinamiento));
      } else {
        hints.push({ texto: verboRefinamiento, ref: refEntidad(entidad.id), rol: "verbo" });
      }
    }
  } else {
    const verboDescomposicion = "se descompone en";
    const primerEnlace = enlaceHijoPorEntidadId.values().next().value;
    if (primerEnlace) {
      hints.push(hintEnlace(primerEnlace, verboDescomposicion));
    } else {
      hints.push({ texto: verboDescomposicion, ref: refEntidad(entidad.id), rol: "verbo" });
    }
  }

  // Cada hijo recibe un hint con la ref de su enlace específico hacia el padre
  for (const interna of aparienciasInternasDeRefinamiento(modelo, opdHijo, entidad)) {
    const entidadInterna = modelo.entidades[interna.entidadId];
    if (!entidadInterna) continue;
    const enlaceHijo = enlaceHijoPorEntidadId.get(interna.entidadId);
    if (enlaceHijo) {
      // El token "nombre" del hijo referencia el enlace que lo conecta al padre (HU-50.021)
      hints.push({
        texto: nombreOpl(entidadInterna),
        ref: refEnlace(enlaceHijo.id),
        rol: "nombre",
        markdown: entidadInterna.tipo === "objeto" ? "objeto" : "proceso",
      });
    } else {
      hints.push(hintEntidad(entidadInterna));
    }
  }
  return hints;
}

/** Verbo canónico para el modo de despliegue, usado como hint interactivo. */
function verboDespliegue(modo: ModoDespliegueObjeto): string | null {
  switch (modo) {
    case "agregacion": return "se despliega en";
    case "exhibicion": return "exhibe";
    case "generalizacion": return "es un";
    case "clasificacion": return "es una instancia de";
  }
}

function refsEntidad(id: Id): OplReferencia[] {
  return [refEntidad(id)];
}

function refEntidad(id: Id): OplReferencia {
  return { tipo: "entidad", id };
}

function refEnlace(id: Id): OplReferencia {
  return { tipo: "enlace", id };
}

function refEstado(id: Id): OplReferencia {
  return { tipo: "estado", id };
}

function hintEntidad(entidad: Entidad, texto = nombreOpl(entidad)): OplTokenHint {
  return {
    texto,
    ref: refEntidad(entidad.id),
    rol: "nombre",
    markdown: entidad.tipo === "objeto" ? "objeto" : "proceso",
  };
}

function hintEstado(estado: Estado): OplTokenHint {
  return {
    texto: `\`${estado.nombre}\``,
    ref: refEstado(estado.id),
    rol: "estado",
    markdown: "estado",
  };
}

function hintEnlace(enlace: Enlace, texto: string): OplTokenHint {
  return {
    texto,
    ref: refEnlace(enlace.id),
    rol: "verbo",
  };
}

function verboInteractivo(enlace: Enlace, texto: string): string | null {
  const candidatos = [
    ...(esAutoInvocacion(enlace) ? ["se invoca"] : []),
    ...(enlace.modificador === "evento" ? ["inicia y maneja", "inicia e invoca", "inicia"] : []),
    ...(enlace.modificador === "condicion" ? ["ocurre si", "maneja", "invoca"] : []),
    ...(enlace.modificador === "no" ? ["no maneja", "no requiere", "no consume", "no genera", "no afecta"] : []),
    ...verbosPorTipo[enlace.tipo],
  ];
  return candidatos.find((candidato) => texto.includes(candidato)) ?? null;
}

const verbosPorTipo: Record<TipoEnlace, string[]> = {
  agregacion: ["consta", "constan"],
  exhibicion: ["exhibe", "exhiben"],
  generalizacion: ["es un", "son"],
  clasificacion: ["es una instancia", "son instancias"],
  agente: ["maneja", "manejan", "es manejado"],
  instrumento: ["requiere", "requieren", "es requerido"],
  consumo: ["consume", "consumen", "cambia"],
  resultado: ["genera", "generan", "cambia"],
  efecto: ["afecta", "afectan"],
  invocacion: ["invoca", "invocan", "se invoca"],
};

function oracionEnlace(modelo: Modelo, enlace: Enlace): string | null {
  return conEtiquetaEnlace(enlace, oracionEnlaceSinEtiqueta(modelo, enlace));
}

function oracionEnlaceSinEtiqueta(modelo: Modelo, enlace: Enlace): string | null {
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

function conEtiquetaEnlace(enlace: Enlace, linea: string | null): string | null {
  if (!linea) return null;
  const etiqueta = etiquetaEnlaceNormalizada(enlace.etiqueta);
  return etiqueta ? `${linea} [etiqueta: ${etiqueta}]` : linea;
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
  return oracionEnlaceSinEtiqueta(modelo, sinModificador);
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

// ── Generadores exportados para HU-50.013 y HU-50.015 ──

/**
 * HU-50.013: Emite oración interactiva para despliegue asíncrono "se despliega en".
 * SSOT: opm-opl-es.md §TS1 — plantilla de despliegue.
 */
export function emitirDespliegueOcurren(
  modelo: Modelo,
  entidad: Entidad,
  opdHijo: Opd,
  ordinal: number,
): OplLineaInteractiva | null {
  const aparienciasInternas = aparienciasInternasDeRefinamiento(modelo, opdHijo, entidad)
    .sort((a, b) => compararOrdenTemporal(a, b));
  const internos = aparienciasInternas
    .flatMap((apariencia) => {
      const interna = modelo.entidades[apariencia.entidadId];
      return interna ? [nombreOpl(interna)] : [];
    });
  const destino = internos.length > 0 ? listarOpl(internos) : codigoOpd(opdHijo.nombre);
  const texto = `${nombreOpl(entidad)} se despliega en ${destino}.`;
  const refs: OplReferencia[] = [refEntidad(entidad.id)];
  const hints: OplTokenHint[] = [hintEntidad(entidad)];

  // Asociar cada hijo a su enlace específico (HU-50.021)
  for (const interna of aparienciasInternas) {
    const entidadInterna = modelo.entidades[interna.entidadId];
    if (!entidadInterna) continue;
    const enlaceHijo = Object.values(modelo.enlaces).find((enlace) => {
      const origen = entidadIdDeExtremo(modelo, enlace.origenId);
      const destino = entidadIdDeExtremo(modelo, enlace.destinoId);
      return (origen === entidad.id && destino === interna.entidadId) ||
        (destino === entidad.id && origen === interna.entidadId);
    });
    if (enlaceHijo) {
      refs.push(refEnlace(enlaceHijo.id));
      hints.push({
        texto: nombreOpl(entidadInterna),
        ref: refEnlace(enlaceHijo.id),
        rol: "nombre",
        markdown: entidadInterna.tipo === "objeto" ? "objeto" : "proceso",
      });
    } else {
      refs.push(refEntidad(interna.entidadId));
      hints.push(hintEntidad(entidadInterna));
    }
  }

  const verbo = "se despliega en";
  const primerEnlace = Object.values(modelo.enlaces).find((enlace) => {
    const origen = entidadIdDeExtremo(modelo, enlace.origenId);
    const destino = entidadIdDeExtremo(modelo, enlace.destinoId);
    return origen === entidad.id || destino === entidad.id;
  });
  if (primerEnlace) {
    hints.push(hintEnlace(primerEnlace, verbo));
    refs.push(refEnlace(primerEnlace.id));
  }

  return crearLineaOplInteractiva(`opl-desp-${entidad.id}`, texto, ordinal, refs, hints);
}

/**
 * HU-50.015: Emite oración interactiva para especialización "es un/una".
 * SSOT: opm-opl-es.md §TS1 — plantilla de especialización.
 */
export function emitirEspecializacion(
  modelo: Modelo,
  entidadPadre: Entidad,
  hijo: { entidad: Entidad; enlace: Enlace },
  ordinal: number,
): OplLineaInteractiva | null {
  const texto = `${nombreOpl(hijo.entidad)} es un ${nombreOpl(entidadPadre)}.`;
  return crearLineaOplInteractiva(
    `opl-espec-${hijo.enlace.id}`,
    texto,
    ordinal,
    [refEntidad(entidadPadre.id), refEntidad(hijo.entidad.id), refEnlace(hijo.enlace.id)],
    [
      hintEntidad(hijo.entidad),
      { texto: "es un", ref: refEnlace(hijo.enlace.id), rol: "verbo" },
      hintEntidad(entidadPadre),
    ],
  );
}
