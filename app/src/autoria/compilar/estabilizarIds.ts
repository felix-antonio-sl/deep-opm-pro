import type { Abanico, Enlace, ExtremoEnlace, Id, Modelo } from "../../modelo/tipos";
import { camposFirmados, PARTICION_ENLACE } from "../../modelo/submodelos/firmaSemantica";
import { hashContenido } from "../procedencia";

/**
 * Normaliza las identidades referenciables una vez que el hecho está completo.
 * Esto evita que una adjunción posterior (evento, estado o ruta) conserve el ID
 * provisional acuñado por la primera oración que apareció en el proto.
 */
export function estabilizarIdsReferenciables(modelo: Modelo): void {
  const mapaEnlaces = mapaIdsEnlaces(modelo);
  remapearEnlaces(modelo, mapaEnlaces);
  remapearReferenciasEnlace(modelo, mapaEnlaces);
  remapearAbanicos(modelo);
}

function mapaIdsEnlaces(modelo: Modelo): Map<Id, Id> {
  const mapa = new Map<Id, Id>();
  const usados = new Map<Id, { id: Id; identidad: string; representacion: string }>();
  for (const enlace of Object.values(modelo.enlaces)) {
    validarEnlaceCompiladoProto(enlace);
    const identidad = JSON.stringify(firmaEnlace(enlace));
    const representacion = JSON.stringify(firmaRepresentacionEnlace(enlace));
    const nuevo = `e-${hashContenido(identidad)}`;
    const previo = usados.get(nuevo);
    if (previo && previo.identidad !== identidad) {
      throw new Error(`Colisión de hash entre enlaces '${previo.id}' y '${enlace.id}': '${nuevo}'.`);
    }
    if (previo && previo.representacion !== representacion) {
      throw new Error(
        `Enlaces '${previo.id}' y '${enlace.id}' comparten identidad pero difieren en presentación: '${nuevo}'.`,
      );
    }
    usados.set(nuevo, { id: previo?.id ?? enlace.id, identidad, representacion });
    mapa.set(enlace.id, nuevo);
  }
  return mapa;
}

const CAMPOS_IDENTIDAD_ENLACE_PROTO = camposFirmados(PARTICION_ENLACE).filter(
  (campo) => !["id", "grupoEstructuralId", "efectoEscindido", "derivado"].includes(campo),
);

function firmaEnlace(enlace: Enlace): unknown[] {
  return CAMPOS_IDENTIDAD_ENLACE_PROTO.map((campo) => {
    if (campo === "origenId" || campo === "destinoId") return [campo, firmaExtremo(enlace[campo])];
    return [campo, enlace[campo] ?? null];
  });
}

function firmaRepresentacionEnlace(enlace: Enlace): unknown[] {
  return [
    firmaEnlace(enlace),
    enlace.rutaEtiqueta ?? "",
    enlace.mostrarRequisitos ?? null,
    enlace.origenId.portId ?? "",
    enlace.destinoId.portId ?? "",
  ];
}

function validarEnlaceCompiladoProto(enlace: Enlace): void {
  if (enlace.grupoEstructuralId || enlace.efectoEscindido || enlace.derivado) {
    throw new Error(
      `El compilador Proto no puede estabilizar el enlace '${enlace.id}' con grupo o procedencia derivados.`,
    );
  }
}

function firmaExtremo(extremo: ExtremoEnlace): [string, Id] {
  return [extremo.kind, extremo.id];
}

function remapearEnlaces(modelo: Modelo, mapa: Map<Id, Id>): void {
  const enlaces: Record<Id, Enlace> = {};
  for (const enlace of Object.values(modelo.enlaces)) {
    const id = mapa.get(enlace.id)!;
    if (enlaces[id]) continue;
    enlaces[id] = {
      ...enlace,
      id,
    };
  }
  modelo.enlaces = enlaces;
}

function remapearReferenciasEnlace(modelo: Modelo, mapa: Map<Id, Id>): void {
  for (const opd of Object.values(modelo.opds)) {
    const siguientes: typeof opd.enlaces = {};
    const vistos = new Set<Id>();
    for (const apariencia of Object.values(opd.enlaces)) {
      apariencia.enlaceId = mapa.get(apariencia.enlaceId) ?? apariencia.enlaceId;
      if (vistos.has(apariencia.enlaceId)) continue;
      vistos.add(apariencia.enlaceId);
      siguientes[apariencia.id] = apariencia;
    }
    opd.enlaces = siguientes;
  }
  for (const abanico of Object.values(modelo.abanicos ?? {})) {
    abanico.enlaceIds = [...new Set(abanico.enlaceIds.map((id) => mapa.get(id) ?? id))];
    if (abanico.decision?.modo === "probabilidades") {
      abanico.decision = {
        ...abanico.decision,
        pesos: Object.fromEntries(Object.entries(abanico.decision.pesos).map(([id, peso]) => [mapa.get(id) ?? id, peso])),
      };
    }
  }
  for (const ancla of Object.values(modelo.anclasNormativas ?? {})) {
    if (ancla.target.tipo === "enlace") ancla.target = { ...ancla.target, id: mapa.get(ancla.target.id) ?? ancla.target.id };
  }
  for (const nota of Object.values(modelo.notasMesa ?? {})) {
    if (nota.target.tipo === "enlace") nota.target = { ...nota.target, id: mapa.get(nota.target.id) ?? nota.target.id };
  }
  for (const satisfaccion of Object.values(modelo.satisfaccionesRequisito ?? {})) {
    if (satisfaccion.target.tipo === "enlace") {
      satisfaccion.target = { ...satisfaccion.target, id: mapa.get(satisfaccion.target.id) ?? satisfaccion.target.id };
    }
  }
}

function remapearAbanicos(modelo: Modelo): void {
  const abanicos: Record<Id, Abanico> = {};
  for (const abanico of Object.values(modelo.abanicos ?? {})) {
    const id = `ab-${hashContenido(JSON.stringify([
      abanico.opdId,
      abanico.operador,
      [...abanico.enlaceIds].sort(),
    ]))}`;
    if (abanicos[id]) throw new Error(`Colisión de ID propietario entre abanicos: '${id}'.`);
    const portId = `port-${id}`;
    for (const enlaceId of abanico.enlaceIds) {
      const enlace = modelo.enlaces[enlaceId];
      if (!enlace) continue;
      const campo = abanico.puertoComun.lado === "origen" ? "origenId" : "destinoId";
      const extremo = enlace[campo];
      if (extremo.kind === "entidad" && extremo.id === abanico.puertoComun.entidadId) {
        enlace[campo] = { ...extremo, portId };
      }
    }
    abanicos[id] = {
      ...abanico,
      id,
      puertoComun: { ...abanico.puertoComun, portId },
      enlaceIds: [...abanico.enlaceIds],
    };
  }
  if (modelo.abanicos || Object.keys(abanicos).length > 0) modelo.abanicos = abanicos;
}
