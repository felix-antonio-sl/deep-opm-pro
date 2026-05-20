import { abanicoDeEnlace, candidatosAbanicoExacto, puertoExactoCompartidoDeAbanico } from "../../modelo/abanicos";
import { anclaEnlaceMasCercana, OPCIONES_ANCLA_RELOJ_ENLACE, type AnclaRelojEnlace } from "../../modelo/anclajesEnlace";
import { entidadDeExtremo, nombreExtremo } from "../../modelo/extremos";
import type { Enlace, ExtremoEnlace, Id, Modelo, PuertoApariencia } from "../../modelo/tipos";

type LadoEnlace = "origen" | "destino";

export type ModoPuertoExtremo = "puerto-exacto" | "puerto-no-visible" | "estado" | "automatico" | "invalido";

export interface DetalleExtremoPuerto {
  lado: LadoEnlace;
  nombre: string;
  entidadId?: Id;
  entidadNombre?: string;
  extremo: ExtremoEnlace;
  modo: ModoPuertoExtremo;
  portId?: Id;
  ancla?: AnclaRelojEnlace;
  hora?: string;
  puerto?: PuertoApariencia;
}

export interface DetalleFanPuerto {
  abanicoId: Id;
  operador: string;
  ramas: number;
  entidadId: Id;
  entidadNombre: string;
  ladoCompartido: LadoEnlace;
  portId: Id;
  ancla?: AnclaRelojEnlace;
  hora?: string;
}

export interface DetalleFanPosible {
  lado: LadoEnlace;
  entidadId: Id;
  entidadNombre: string;
  tipo: string;
  ramas: number;
  enlaceIds: Id[];
  hora?: string;
}

export interface DetalleContratoPuertoEnlace {
  extremos: DetalleExtremoPuerto[];
  fan?: DetalleFanPuerto;
  fansPosibles: DetalleFanPosible[];
}

export function detalleContratoPuertoEnlace(modelo: Modelo, opdId: Id, enlace: Enlace): DetalleContratoPuertoEnlace {
  const extremos: DetalleExtremoPuerto[] = [
    detalleExtremo(modelo, opdId, enlace, "origen", enlace.origenId),
    detalleExtremo(modelo, opdId, enlace, "destino", enlace.destinoId),
  ];
  const abanico = abanicoDeEnlace(modelo, enlace.id);
  const puertoComun = abanico ? puertoExactoCompartidoDeAbanico(modelo, abanico) : undefined;
  const entidadPuerto = puertoComun ? modelo.entidades[puertoComun.entidadId] : undefined;
  const aparienciaPuerto = puertoComun ? aparienciaPorEntidad(modelo, opdId, puertoComun.entidadId) : undefined;
  const puerto = puertoComun ? aparienciaPuerto?.ports?.[puertoComun.portId] : undefined;
  const opcionAncla = puerto ? opcionAnclaParaPuerto(puerto) : undefined;
  const fan: DetalleFanPuerto | undefined = abanico && puertoComun && entidadPuerto ? {
    abanicoId: abanico.id,
    operador: abanico.operador,
    ramas: abanico.enlaceIds.length,
    entidadId: puertoComun.entidadId,
    entidadNombre: entidadPuerto.nombre,
    ladoCompartido: puertoComun.lado,
    portId: puertoComun.portId,
  } : undefined;
  if (fan && opcionAncla) {
    fan.ancla = opcionAncla.id;
    fan.hora = opcionAncla.hora;
  }

  const fansPosibles = candidatosAbanicoExacto(modelo, opdId, enlace.id).flatMap((candidato) => {
    const entidad = modelo.entidades[candidato.entidadId];
    const extremo = extremos.find((item) => item.lado === candidato.lado && item.entidadId === candidato.entidadId);
    if (!entidad) return [];
    const posible: DetalleFanPosible = {
      lado: candidato.lado,
      entidadId: candidato.entidadId,
      entidadNombre: entidad.nombre,
      tipo: candidato.tipo,
      ramas: candidato.enlaceIds.length,
      enlaceIds: candidato.enlaceIds,
    };
    if (extremo?.hora) posible.hora = extremo.hora;
    return [posible];
  });

  const detalle: DetalleContratoPuertoEnlace = { extremos, fansPosibles };
  if (fan) detalle.fan = fan;
  return detalle;
}

function detalleExtremo(modelo: Modelo, opdId: Id, enlace: Enlace, lado: LadoEnlace, extremo: ExtremoEnlace): DetalleExtremoPuerto {
  const entidad = entidadDeExtremo(modelo, extremo);
  if (!entidad) {
    return {
      lado,
      nombre: extremo.id,
      extremo,
      modo: "invalido",
    };
  }
  if (extremo.kind === "estado") {
    return {
      lado,
      nombre: nombreExtremo(modelo, extremo),
      entidadId: entidad.id,
      entidadNombre: entidad.nombre,
      extremo,
      modo: "estado",
    };
  }

  const apariencia = aparienciaPorEntidad(modelo, opdId, entidad.id);
  const portId = extremo.portId;
  const puerto = portId ? apariencia?.ports?.[portId] : undefined;
  const opcionAncla = puerto ? opcionAnclaParaPuerto(puerto) : undefined;

  const detalle: DetalleExtremoPuerto = {
    lado,
    nombre: nombreExtremo(modelo, extremo),
    entidadId: entidad.id,
    entidadNombre: entidad.nombre,
    extremo,
    modo: portId ? (puerto ? "puerto-exacto" : "puerto-no-visible") : "automatico",
  };
  if (portId) detalle.portId = portId;
  if (puerto) detalle.puerto = puerto;
  if (opcionAncla) {
    detalle.ancla = opcionAncla.id;
    detalle.hora = opcionAncla.hora;
  }
  return detalle;
}

function aparienciaPorEntidad(modelo: Modelo, opdId: Id, entidadId: Id) {
  return Object.values(modelo.opds[opdId]?.apariencias ?? {})
    .find((apariencia) => apariencia.entidadId === entidadId);
}

function opcionAnclaParaPuerto(puerto: PuertoApariencia) {
  const ancla = anclaEnlaceMasCercana(puerto);
  return OPCIONES_ANCLA_RELOJ_ENLACE.find((opcion) => opcion.id === ancla);
}
