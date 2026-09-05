import type { Abanico, ExtremoEnlace, Id, Modelo } from "./tipos";
import { refinaA } from "./refinamientos";
import { puedeEditarAbanicoEnOpd } from "./abanicos";
import { idPuertoAbanicoDerivado, proyeccionesCanonicasEnlaceExternoRefinado } from "./operaciones/refinamiento";

export function mensajeBloqueoCambioAbanicoHeredado(
  previo: Modelo,
  siguiente: Modelo,
  opdActivoId: Id,
  origen: "edicion" | "historial" = "edicion",
): string | null {
  const abanicoIds = new Set([
    ...Object.keys(previo.abanicos ?? {}),
    ...Object.keys(siguiente.abanicos ?? {}),
  ]);
  for (const abanicoId of abanicoIds) {
    const abanicoPrevio = previo.abanicos?.[abanicoId];
    const abanicoSiguiente = siguiente.abanicos?.[abanicoId];
    const abanico = abanicoPrevio ?? abanicoSiguiente;
    if (!abanico) continue;
    if (puedeEditarAbanicoEnOpd(abanico, opdActivoId)) continue;
    const introducePropietarioConAbanico =
      abanicoPrevio === undefined &&
      abanicoSiguiente !== undefined &&
      previo.opds[abanico.opdId] === undefined &&
      siguiente.opds[abanico.opdId] !== undefined;
    if (introducePropietarioConAbanico) continue;
    if (esTransicionAbanicoAutomaticoDesdeActivo(
      previo,
      siguiente,
      abanicoPrevio,
      abanicoSiguiente,
      opdActivoId,
      origen,
    )) continue;
    const cambioAgrupador = JSON.stringify(abanicoPrevio) !== JSON.stringify(abanicoSiguiente);
    const enlaceIds = new Set([
      ...(abanicoPrevio ? idsRamasCustodiadas(previo, abanicoPrevio) : []),
      ...(abanicoSiguiente ? idsRamasCustodiadas(siguiente, abanicoSiguiente) : []),
    ]);
    const cambioRama = [...enlaceIds].some((enlaceId) => (
      firmaRamaAbanico(previo, enlaceId) !== firmaRamaAbanico(siguiente, enlaceId)
    ));
    if (!cambioAgrupador && !cambioRama) continue;
    const propietario = previo.opds[abanico.opdId]?.nombre ?? siguiente.opds[abanico.opdId]?.nombre ?? abanico.opdId;
    return `Este abanico pertenece a '${propietario}'. Cambia a ese OPD para editarlo.`;
  }
  return null;
}

function esTransicionAbanicoAutomaticoDesdeActivo(
  previo: Modelo,
  siguiente: Modelo,
  abanicoPrevio: Abanico | undefined,
  abanicoSiguiente: Abanico | undefined,
  opdActivoId: Id,
  origen: "edicion" | "historial",
): boolean {
  const referencia = abanicoPrevio ?? abanicoSiguiente;
  if (!referencia) return false;
  const opdHijoId = referencia.opdId;
  if (abanicoPrevio === undefined && abanicoSiguiente !== undefined) {
    return previo.opds[opdHijoId]?.padreId === opdActivoId &&
      esProyeccionAbanicoAutomatico(siguiente, abanicoSiguiente, opdActivoId, opdHijoId);
  }
  if (abanicoPrevio !== undefined && abanicoSiguiente !== undefined) {
    return esProyeccionAbanicoAutomatico(previo, abanicoPrevio, opdActivoId, opdHijoId) &&
      esProyeccionAbanicoAutomatico(siguiente, abanicoSiguiente, opdActivoId, opdHijoId);
  }
  if (abanicoPrevio === undefined || abanicoSiguiente !== undefined) return false;
  return esProyeccionAbanicoAutomatico(previo, abanicoPrevio, opdActivoId, opdHijoId) &&
    esRetiroProyeccionPuro(previo, siguiente, abanicoPrevio) &&
    (
      origen === "historial" ||
      !fuenteProyeccionSigueVigente(previo, siguiente, abanicoPrevio, opdActivoId) ||
      existeProyeccionSucesora(previo, siguiente, abanicoPrevio, opdActivoId)
    );
}

function esProyeccionAbanicoAutomatico(
  modelo: Modelo,
  abanico: Abanico,
  opdActivoId: Id,
  opdHijoId: Id,
): boolean {
  const opdHijo = modelo.opds[opdHijoId];
  if (!opdHijo || opdHijo.padreId !== opdActivoId || abanico.opdId !== opdHijoId || abanico.decision) return false;
  if (abanico.enlaceIds.length < 2 || new Set(abanico.enlaceIds).size !== abanico.enlaceIds.length) return false;

  const enlacesPadreIds: Id[] = [];
  let refinamientoId: Id | null = null;
  for (const enlaceId of abanico.enlaceIds) {
    const enlaceHijo = modelo.enlaces[enlaceId];
    const derivado = enlaceHijo?.derivado;
    if (
      !enlaceHijo ||
      !tieneFormaEnlaceDerivadoAutomatico(enlaceHijo) ||
      derivado?.tipo !== "enlace-externo-refinamiento" ||
      derivado.origen !== "automatico"
    ) return false;
    if (refinamientoId === null) refinamientoId = derivado.refinamientoId;
    if (derivado.refinamientoId !== refinamientoId) return false;
    const enlacePadre = modelo.enlaces[derivado.enlacePadreId];
    if (
      !enlacePadre ||
      enlacePadre.tipo !== enlaceHijo.tipo ||
      enlacePadre.etiqueta !== enlaceHijo.etiqueta ||
      !proyeccionesCanonicasEnlaceExternoRefinado(modelo, opdHijoId, enlacePadre.id).some((proyeccion) => (
        coincideExtremoProyectado(enlaceHijo.origenId, proyeccion.origenId, abanico, "origen") &&
        coincideExtremoProyectado(enlaceHijo.destinoId, proyeccion.destinoId, abanico, "destino")
      ))
    ) return false;
    enlacesPadreIds.push(enlacePadre.id);
  }
  const refinada = refinamientoId ? modelo.entidades[refinamientoId] : undefined;
  if (
    !refinamientoId ||
    !refinada ||
    new Set(enlacesPadreIds).size !== enlacesPadreIds.length ||
    !refinaA(refinada, opdHijoId)
  ) return false;

  const abanicoPadre = buscarFuenteProyeccion(modelo, abanico, opdActivoId, refinamientoId, enlacesPadreIds);
  return !!abanicoPadre &&
    abanico.puertoComun.portId === idPuertoAbanicoDerivado(abanicoPadre.id, opdHijoId, abanico.puertoComun.lado) &&
    idsEnBijeccion(abanico.enlaceIds, enlacesAutomaticosVisiblesDeFuente(modelo, opdHijoId, abanicoPadre));
}

function tieneFormaEnlaceDerivadoAutomatico(enlace: Modelo["enlaces"][Id]): boolean {
  if (!enlace) return false;
  const camposPermitidos = new Set(["id", "tipo", "origenId", "destinoId", "etiqueta", "derivado"]);
  return Object.keys(enlace).every((campo) => camposPermitidos.has(campo));
}

function coincideExtremoProyectado(
  actual: ExtremoEnlace,
  esperado: ExtremoEnlace,
  abanico: Abanico,
  lado: "origen" | "destino",
): boolean {
  if (actual.kind !== esperado.kind || actual.id !== esperado.id) return false;
  const portIdEsperado = abanico.puertoComun.lado === lado
    ? abanico.puertoComun.portId
    : esperado.portId;
  return actual.portId === portIdEsperado;
}

function esRetiroProyeccionPuro(previo: Modelo, siguiente: Modelo, abanico: Abanico): boolean {
  return abanico.enlaceIds.every((enlaceId) => {
    const enlacePrevio = previo.enlaces[enlaceId];
    const enlaceSiguiente = siguiente.enlaces[enlaceId];
    return !!enlacePrevio && (
      enlaceSiguiente === undefined || JSON.stringify(enlacePrevio) === JSON.stringify(enlaceSiguiente)
    );
  });
}

function fuenteProyeccionSigueVigente(
  previo: Modelo,
  siguiente: Modelo,
  abanicoHijo: Abanico,
  opdActivoId: Id,
): boolean {
  const refinamientoId = previo.enlaces[abanicoHijo.enlaceIds[0]!]?.derivado?.refinamientoId;
  const refinada = refinamientoId ? siguiente.entidades[refinamientoId] : undefined;
  if (!refinada || !refinaA(refinada, abanicoHijo.opdId)) return false;
  return Object.values(siguiente.abanicos ?? {}).some((abanicoPadre) => (
    abanicoPadre.opdId === opdActivoId &&
    abanicoPadre.puertoComun.entidadId === refinamientoId
  ));
}

function existeProyeccionSucesora(
  previo: Modelo,
  siguiente: Modelo,
  abanicoHijoPrevio: Abanico,
  opdActivoId: Id,
): boolean {
  const fuentePrevia = fuenteDeProyeccion(previo, abanicoHijoPrevio, opdActivoId);
  if (!fuentePrevia) return false;
  const mismaFuenteVigente = siguiente.abanicos?.[fuentePrevia.id]?.opdId === opdActivoId;
  return Object.values(siguiente.abanicos ?? {}).some((candidato) => {
    if (
      candidato.opdId !== abanicoHijoPrevio.opdId ||
      !esProyeccionAbanicoAutomatico(siguiente, candidato, opdActivoId, abanicoHijoPrevio.opdId)
    ) return false;
    const fuenteSiguiente = fuenteDeProyeccion(siguiente, candidato, opdActivoId);
    if (!fuenteSiguiente) return false;
    return mismaFuenteVigente
      ? fuenteSiguiente.id === fuentePrevia.id
      : fuenteSiguiente.puertoComun.entidadId === fuentePrevia.puertoComun.entidadId;
  });
}

function fuenteDeProyeccion(modelo: Modelo, abanicoHijo: Abanico, opdActivoId: Id): Abanico | undefined {
  const derivaciones = abanicoHijo.enlaceIds.map((enlaceId) => modelo.enlaces[enlaceId]?.derivado);
  const refinamientoId = derivaciones[0]?.refinamientoId;
  if (!refinamientoId || derivaciones.some((derivacion) => derivacion?.refinamientoId !== refinamientoId)) return undefined;
  const enlacesPadreIds = derivaciones.flatMap((derivacion) => derivacion?.enlacePadreId ? [derivacion.enlacePadreId] : []);
  return buscarFuenteProyeccion(modelo, abanicoHijo, opdActivoId, refinamientoId, enlacesPadreIds);
}

function buscarFuenteProyeccion(
  modelo: Modelo,
  abanicoHijo: Abanico,
  opdActivoId: Id,
  refinamientoId: Id,
  enlacesPadreIds: readonly Id[],
): Abanico | undefined {
  return Object.values(modelo.abanicos ?? {}).find((candidato) => (
    candidato.id !== abanicoHijo.id &&
    candidato.opdId === opdActivoId &&
    candidato.operador === abanicoHijo.operador &&
    candidato.puertoComun.entidadId === refinamientoId &&
    idsEnBijeccion(candidato.enlaceIds, enlacesPadreIds)
  ));
}

function idsRamasCustodiadas(modelo: Modelo, abanico: Abanico): Id[] {
  const opdPadreId = modelo.opds[abanico.opdId]?.padreId;
  if (!opdPadreId) return abanico.enlaceIds;
  const fuente = fuenteDeProyeccion(modelo, abanico, opdPadreId);
  if (!fuente) return abanico.enlaceIds;
  return [...abanico.enlaceIds, ...enlacesAutomaticosVisiblesDeFuente(modelo, abanico.opdId, fuente)];
}

function enlacesAutomaticosVisiblesDeFuente(modelo: Modelo, opdHijoId: Id, fuente: Abanico): Id[] {
  const opdHijo = modelo.opds[opdHijoId];
  if (!opdHijo) return [];
  const enlacesFuente = new Set(fuente.enlaceIds);
  return Object.values(opdHijo.enlaces).flatMap((apariencia) => {
    const enlace = modelo.enlaces[apariencia.enlaceId];
    const derivado = enlace?.derivado;
    return enlace &&
      derivado?.tipo === "enlace-externo-refinamiento" &&
      derivado.origen === "automatico" &&
      derivado.refinamientoId === fuente.puertoComun.entidadId &&
      enlacesFuente.has(derivado.enlacePadreId)
      ? [enlace.id]
      : [];
  });
}

function idsEnBijeccion(a: readonly Id[], b: readonly Id[]): boolean {
  if (a.length !== b.length || new Set(a).size !== a.length || new Set(b).size !== b.length) return false;
  const idsB = new Set(b);
  return a.every((id) => idsB.has(id));
}

function firmaRamaAbanico(modelo: Modelo, enlaceId: Id): string {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace) return "ausente";
  return JSON.stringify({
    tipo: enlace.tipo,
    origenId: enlace.origenId,
    destinoId: enlace.destinoId,
    estadoEntradaId: enlace.estadoEntradaId,
    estadoSalidaId: enlace.estadoSalidaId,
    modificador: enlace.modificador,
    subtipoModificador: enlace.subtipoModificador,
    probabilidad: enlace.probabilidad,
    derivado: enlace.derivado,
  });
}
