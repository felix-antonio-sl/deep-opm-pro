import type {
  Abanico,
  Apariencia,
  AparienciaEnlace,
  Enlace,
  Entidad,
  Estado,
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

function namespaceId(originalId: Id, suffix: string): Id {
  const parts = originalId.split("-");
  if (parts.length >= 2) {
    return `${parts[0]}-c-${parts.slice(1).join("-")}`;
  }
  return `c-${originalId}`;
}

function remapExtremo(
  extremo: { kind: string; id: Id },
  entidadMap: Map<Id, Id>,
  estadoMap: Map<Id, Id>,
): { kind: string; id: Id } | null {
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

  for (const [bEntId] of Object.entries(compartidas)) {
    const aEntId = compartidas[bEntId]!;
    entidadMap.set(bEntId, aEntId);
  }

  let nextSeq = Math.max(a.nextSeq, b.nextSeq) + 100;

  const opds: Record<Id, Opd> = { ...deepClone(a.opds) };
  for (const [opdId, opd] of Object.entries(b.opds)) {
    const mappedId = opdId === b.opdRaizId ? a.opdRaizId : namespaceId(opdId, String(nextSeq++));
    opdMap.set(opdId, mappedId);
    if (!opds[mappedId]) {
      opds[mappedId] = { ...deepClone(opd), id: mappedId };
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
      origenId: origen,
      destinoId: destino,
    };
  }

  for (const [opdId, opd] of Object.entries(opds)) {
    const mappedPadre = opd.padreId !== null ? opdMap.get(opd.padreId) ?? opd.padreId : null;
    const apariencias: Record<Id, Apariencia> = {};
    for (const [apId, ap] of Object.entries(opd.apariencias)) {
      const mappedEnt = entidadMap.get(ap.entidadId);
      if (!mappedEnt) continue;
      apariencias[apId] = { ...ap, entidadId: mappedEnt };
    }
    const aparienciasEnlace: Record<Id, AparienciaEnlace> = {};
    for (const [aeId, ae] of Object.entries(opd.enlaces)) {
      const mappedEnl = enlaceMap.get(ae.enlaceId);
      if (!mappedEnl) continue;
      aparienciasEnlace[aeId] = { ...ae, enlaceId: mappedEnl };
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
      abanicos[mappedId] = {
        ...deepClone(ab),
        id: mappedId,
        opdId: mappedOpd,
        enlaceIds: mappedEnlaces,
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
