import type {
  Abanico,
  Apariencia,
  AparienciaEnlace,
  Enlace,
  Entidad,
  Estado,
  ExtremoEnlace,
  Id,
  Modelo,
  Opd,
  Resultado,
} from "../tipos";

export type Compartidas = Record<Id, Id>;

function deepClone<T>(value: T): T {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

function namespaceId(originalId: Id, ns: string): Id {
  return `${originalId}-c${ns}`;
}

function remapExtremo(
  extremo: ExtremoEnlace,
  entidadMap: Map<Id, Id>,
  estadoMap: Map<Id, Id>,
): ExtremoEnlace | null {
  if (extremo.kind === "entidad") {
    const mapped = entidadMap.get(extremo.id);
    if (!mapped) return null;
    return { kind: "entidad", id: mapped };
  }
  if (extremo.kind === "estado") {
    const mapped = estadoMap.get(extremo.id);
    if (!mapped) return null;
    return { kind: "estado", id: mapped };
  }
  return null;
}

export function componerModelos(
  a: Modelo,
  b: Modelo,
  compartidas: Compartidas,
): Resultado<Modelo> {
  for (const [bId, aId] of Object.entries(compartidas)) {
    if (!b.entidades[bId]) return { ok: false, error: `compartidas: entidad '${bId}' no existe en B` };
    if (!a.entidades[aId]) return { ok: false, error: `compartidas: entidad '${aId}' no existe en A` };
  }

  const entidadMap = new Map<Id, Id>();
  const estadoMap = new Map<Id, Id>();
  const enlaceMap = new Map<Id, Id>();
  const opdMap = new Map<Id, Id>();
  const opdsDeB = new Set<Id>();

  for (const [bEntId] of Object.entries(compartidas)) {
    const aEntId = compartidas[bEntId]!;
    entidadMap.set(bEntId, aEntId);
  }

  let nextSeq = Math.max(a.nextSeq, b.nextSeq) + 100;

  const opds: Record<Id, Opd> = { ...deepClone(a.opds) };
  const rootB = b.opds[b.opdRaizId];
  for (const [opdId, opd] of Object.entries(b.opds)) {
    if (opdId === b.opdRaizId) {
      opdMap.set(opdId, a.opdRaizId);
    } else {
      const mappedId = namespaceId(opdId, String(nextSeq++));
      opdMap.set(opdId, mappedId);
      opds[mappedId] = { ...deepClone(opd), id: mappedId };
      opdsDeB.add(mappedId);
    }
  }

  const entidades: Record<Id, Entidad> = { ...deepClone(a.entidades) };
  for (const [entId, ent] of Object.entries(b.entidades)) {
    if (entidadMap.has(entId)) continue;
    const mappedId = namespaceId(entId, String(nextSeq++));
    entidadMap.set(entId, mappedId);
    entidades[mappedId] = { ...deepClone(ent), id: mappedId };
  }

  const estados: Record<Id, Estado> = { ...deepClone(a.estados) };
  for (const [estId, est] of Object.entries(b.estados)) {
    const entId = entidadMap.get(est.entidadId);
    if (!entId) continue;
    const mappedId = namespaceId(estId, String(nextSeq++));
    estadoMap.set(estId, mappedId);
    estados[mappedId] = { ...deepClone(est), id: mappedId, entidadId: entId };
  }

  const enlaces: Record<Id, Enlace> = { ...deepClone(a.enlaces) };
  for (const [enlId, enl] of Object.entries(b.enlaces)) {
    const origen = remapExtremo(enl.origenId, entidadMap, estadoMap);
    const destino = remapExtremo(enl.destinoId, entidadMap, estadoMap);
    if (!origen || !destino) continue;
    const mappedId = namespaceId(enlId, String(nextSeq++));
    enlaceMap.set(enlId, mappedId);
    enlaces[mappedId] = {
      ...deepClone(enl),
      id: mappedId,
      origenId: origen as ExtremoEnlace,
      destinoId: destino as ExtremoEnlace,
    };
  }

  if (rootB) {
    const rootA = opds[a.opdRaizId]!;
    for (const [apId, ap] of Object.entries(rootB.apariencias)) {
      const mappedEnt = entidadMap.get(ap.entidadId);
      if (mappedEnt) {
        const newApId = namespaceId(apId, String(nextSeq++));
        rootA.apariencias[newApId] = { ...deepClone(ap), id: newApId, entidadId: mappedEnt };
      }
    }
    for (const [aeId, ae] of Object.entries(rootB.enlaces)) {
      const mappedEnl = enlaceMap.get(ae.enlaceId);
      if (mappedEnl) {
        const newAeId = namespaceId(aeId, String(nextSeq++));
        rootA.enlaces[newAeId] = { ...deepClone(ae), id: newAeId, enlaceId: mappedEnl };
      }
    }
  }

  for (const [opdId, opd] of Object.entries(opds)) {
    const mappedPadre = opd.padreId !== null ? opdMap.get(opd.padreId) ?? opd.padreId : null;
    const apariencias: Record<Id, Apariencia> = {};
    if (opdsDeB.has(opdId)) {
      for (const [apId, ap] of Object.entries(opd.apariencias)) {
        const mappedEnt = entidadMap.get(ap.entidadId) ?? ap.entidadId;
        apariencias[apId] = { ...ap, entidadId: mappedEnt };
      }
    } else {
      Object.assign(apariencias, opd.apariencias);
    }
    const aparienciasEnlace: Record<Id, AparienciaEnlace> = {};
    if (opdsDeB.has(opdId)) {
      for (const [aeId, ae] of Object.entries(opd.enlaces)) {
        const mappedEnl = enlaceMap.get(ae.enlaceId) ?? ae.enlaceId;
        aparienciasEnlace[aeId] = { ...ae, enlaceId: mappedEnl };
      }
    } else {
      Object.assign(aparienciasEnlace, opd.enlaces);
    }
    opds[opdId] = { ...opd, padreId: mappedPadre, apariencias, enlaces: aparienciasEnlace };
  }

  const abanicos: Record<Id, Abanico> = {};
  if (a.abanicos) Object.assign(abanicos, deepClone(a.abanicos));
  if (b.abanicos) {
    for (const [abId, ab] of Object.entries(b.abanicos)) {
      const mappedOpd = opdMap.get(ab.opdId);
      if (!mappedOpd) continue;
      const mappedEnlaces = ab.enlaceIds.map((id) => enlaceMap.get(id)).filter((id): id is Id => !!id);
      if (mappedEnlaces.length !== ab.enlaceIds.length) continue;
      const mappedId = namespaceId(abId, String(nextSeq++));
      const mappedPuertoEntidad = entidadMap.get(ab.puertoComun.entidadId) ?? ab.puertoComun.entidadId;
      abanicos[mappedId] = {
        ...deepClone(ab),
        id: mappedId,
        opdId: mappedOpd,
        enlaceIds: mappedEnlaces,
        puertoComun: { ...ab.puertoComun, entidadId: mappedPuertoEntidad },
        puertoEntidadId: mappedPuertoEntidad,
      };
    }
  }

  const id = a.id;
  const nombre = a.nombre;

  return {
    ok: true,
    value: {
      id,
      nombre,
      opdRaizId: a.opdRaizId,
      opds,
      entidades,
      estados,
      enlaces,
      ...(Object.keys(abanicos).length > 0 ? { abanicos } : {}),
      nextSeq,
    },
  };
}
