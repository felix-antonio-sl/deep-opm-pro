import type {
  Abanico,
  Apariencia,
  AparienciaEnlace,
  ContextoRefinamientoApariencia,
  DecisionPolicy,
  DerivacionEnlace,
  EfectoEscindido,
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

type Refinamientos = NonNullable<Entidad["refinamientos"]>;

function deepClone<T>(value: T): T {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

function nsId(originalId: Id, ns: string): Id {
  return `${originalId}-c${ns}`;
}

// ── Helpers de remapeo ────────────────────────────────────────────────
// Replican el rigor de `submodelos/materializacion.ts` (que funciona) adaptado
// al esquema de namespacing de composición. A diferencia de materializacion,
// que solo materializa el SD raíz y DESCARTA refinamientos, componer trae el
// modelo COMPLETO de B (todos sus OPDs), así que DEBE remapear refinamientos.

function remapExtremo(extremo: ExtremoEnlace, entidadMap: Map<Id, Id>, estadoMap: Map<Id, Id>): ExtremoEnlace | null {
  const id = extremo.kind === "estado" ? estadoMap.get(extremo.id) : entidadMap.get(extremo.id);
  return id ? { ...extremo, id } : null;
}

function remapDerivacion(derivado: DerivacionEnlace | undefined, enlaceMap: Map<Id, Id>): DerivacionEnlace | undefined {
  if (!derivado) return undefined;
  const enlacePadreId = enlaceMap.get(derivado.enlacePadreId);
  if (!enlacePadreId) return undefined;
  return { ...derivado, enlacePadreId };
}

function remapEfectoEscindido(efecto: EfectoEscindido | undefined, enlaceMap: Map<Id, Id>): EfectoEscindido | undefined {
  if (!efecto) return undefined;
  const enlacePadreId = enlaceMap.get(efecto.enlacePadreId);
  if (!enlacePadreId) return undefined;
  return { ...efecto, grupoId: nsId(efecto.grupoId, "efe"), enlacePadreId };
}

function remapDecision(
  decision: DecisionPolicy,
  entidadMap: Map<Id, Id>,
  estadoMap: Map<Id, Id>,
  enlaceMap: Map<Id, Id>,
): DecisionPolicy {
  if (decision.modo === "estado-fijo") {
    return { ...decision, estadoId: estadoMap.get(decision.estadoId) ?? decision.estadoId };
  }
  if (decision.modo === "uniforme") {
    return { ...decision, objetoId: entidadMap.get(decision.objetoId) ?? decision.objetoId };
  }
  if (decision.modo === "probabilidades") {
    return {
      ...decision,
      pesos: Object.fromEntries(Object.entries(decision.pesos).map(([id, peso]) => [enlaceMap.get(id) ?? id, peso])),
    };
  }
  return decision;
}

function remapContextoRefinamiento(
  contexto: ContextoRefinamientoApariencia,
  entidadMap: Map<Id, Id>,
  aparienciaMap: Map<Id, Id>,
  enlaceMap: Map<Id, Id>,
): ContextoRefinamientoApariencia {
  return {
    ...contexto,
    refinableEntidadId: entidadMap.get(contexto.refinableEntidadId) ?? contexto.refinableEntidadId,
    ...(contexto.contenedorAparienciaId
      ? { contenedorAparienciaId: aparienciaMap.get(contexto.contenedorAparienciaId) ?? contexto.contenedorAparienciaId }
      : {}),
    // Los enlaces padre heredados se renombran con el resto de enlaces de B; sin
    // este remapeo quedaban refs colgantes (ningún validador las atrapa).
    ...(contexto.enlacesPadreIds
      ? { enlacesPadreIds: contexto.enlacesPadreIds.map((id) => enlaceMap.get(id) ?? id) }
      : {}),
  };
}

function remapRefinamientos(refinamientos: Refinamientos | undefined, opdMap: Map<Id, Id>): Refinamientos | undefined {
  if (!refinamientos) return undefined;
  const out: Refinamientos = {};
  for (const tipo of Object.keys(refinamientos) as (keyof Refinamientos)[]) {
    const slot = refinamientos[tipo];
    if (!slot) continue;
    out[tipo] = { ...slot, opdId: opdMap.get(slot.opdId) ?? slot.opdId };
  }
  return out;
}

function remapEnlaceB(
  enlace: Enlace,
  id: Id,
  origenId: ExtremoEnlace,
  destinoId: ExtremoEnlace,
  estadoMap: Map<Id, Id>,
  enlaceMap: Map<Id, Id>,
): Enlace {
  const { derivado, efectoEscindido, estadoEntradaId, estadoSalidaId, grupoEstructuralId, ...base } = deepClone(enlace);
  const derivadoR = remapDerivacion(derivado, enlaceMap);
  const efectoR = remapEfectoEscindido(efectoEscindido, enlaceMap);
  return {
    ...base,
    id,
    origenId,
    destinoId,
    ...(grupoEstructuralId ? { grupoEstructuralId: nsId(grupoEstructuralId, "ge") } : {}),
    ...(estadoEntradaId ? { estadoEntradaId: estadoMap.get(estadoEntradaId) ?? estadoEntradaId } : {}),
    ...(estadoSalidaId ? { estadoSalidaId: estadoMap.get(estadoSalidaId) ?? estadoSalidaId } : {}),
    ...(derivadoR ? { derivado: derivadoR } : {}),
    ...(efectoR ? { efectoEscindido: efectoR } : {}),
  };
}

function remapAparienciaB(
  apariencia: Apariencia,
  id: Id,
  opdId: Id,
  entidadMap: Map<Id, Id>,
  estadoMap: Map<Id, Id>,
  aparienciaMap: Map<Id, Id>,
  enlaceMap: Map<Id, Id>,
): Apariencia {
  const { parteExtraidaDe, contextoRefinamiento, estadosSuprimidos, ...base } = deepClone(apariencia);
  return {
    ...base,
    id,
    opdId,
    entidadId: entidadMap.get(apariencia.entidadId) ?? apariencia.entidadId,
    ...(parteExtraidaDe
      ? {
          parteExtraidaDe: {
            padreAparienciaId: aparienciaMap.get(parteExtraidaDe.padreAparienciaId) ?? parteExtraidaDe.padreAparienciaId,
            parteEntidadId: entidadMap.get(parteExtraidaDe.parteEntidadId) ?? parteExtraidaDe.parteEntidadId,
          },
        }
      : {}),
    ...(contextoRefinamiento
      ? { contextoRefinamiento: remapContextoRefinamiento(contextoRefinamiento, entidadMap, aparienciaMap, enlaceMap) }
      : {}),
    ...(estadosSuprimidos ? { estadosSuprimidos: estadosSuprimidos.map((eId) => estadoMap.get(eId) ?? eId) } : {}),
  };
}

export function componerModelos(a: Modelo, b: Modelo, compartidas: Compartidas): Resultado<Modelo> {
  for (const [bId, aId] of Object.entries(compartidas)) {
    if (!b.entidades[bId]) return { ok: false, error: `compartidas: entidad '${bId}' no existe en B` };
    if (!a.entidades[aId]) return { ok: false, error: `compartidas: entidad '${aId}' no existe en A` };
  }

  const entidadMap = new Map<Id, Id>();
  const estadoMap = new Map<Id, Id>();
  const enlaceMap = new Map<Id, Id>();
  const opdMap = new Map<Id, Id>();
  const aparienciaMap = new Map<Id, Id>();
  let nextSeq = Math.max(a.nextSeq, b.nextSeq) + 100;

  // 1. compartidas sembradas en entidadMap.
  for (const [bEntId, aEntId] of Object.entries(compartidas)) entidadMap.set(bEntId, aEntId);

  // 2. opdMap: raíz de B → raíz de A; hijos de B → namespaced.
  for (const opdId of Object.keys(b.opds)) {
    opdMap.set(opdId, opdId === b.opdRaizId ? a.opdRaizId : nsId(opdId, String(nextSeq++)));
  }
  // 3. entidadMap para entidades no compartidas de B.
  for (const entId of Object.keys(b.entidades)) {
    if (!entidadMap.has(entId)) entidadMap.set(entId, nsId(entId, String(nextSeq++)));
  }
  // 4. estadoMap (solo estados de entidades mapeadas).
  for (const est of Object.values(b.estados)) {
    if (entidadMap.has(est.entidadId)) estadoMap.set(est.id, nsId(est.id, String(nextSeq++)));
  }
  // 5. enlaceMap (solo enlaces con ambos extremos mapeables).
  for (const enl of Object.values(b.enlaces)) {
    if (remapExtremo(enl.origenId, entidadMap, estadoMap) && remapExtremo(enl.destinoId, entidadMap, estadoMap)) {
      enlaceMap.set(enl.id, nsId(enl.id, String(nextSeq++)));
    }
  }
  // 6. aparienciaMap para TODAS las apariencias de B (cualquier OPD).
  for (const opd of Object.values(b.opds)) {
    for (const apId of Object.keys(opd.apariencias)) aparienciaMap.set(apId, nsId(apId, String(nextSeq++)));
  }

  // 7. Entidades: A + B (no compartidas), con refinamientos remapeados.
  const entidades: Record<Id, Entidad> = { ...deepClone(a.entidades) };
  for (const [entId, ent] of Object.entries(b.entidades)) {
    if (compartidas[entId]) continue;
    const mappedId = entidadMap.get(entId)!;
    const refinamientos = remapRefinamientos(ent.refinamientos, opdMap);
    const { refinamientos: _r, ...resto } = deepClone(ent);
    entidades[mappedId] = { ...resto, id: mappedId, ...(refinamientos ? { refinamientos } : {}) };
  }

  // 8. Estados.
  const estados: Record<Id, Estado> = { ...deepClone(a.estados) };
  for (const est of Object.values(b.estados)) {
    const mappedId = estadoMap.get(est.id);
    const entidadId = entidadMap.get(est.entidadId);
    if (!mappedId || !entidadId) continue;
    estados[mappedId] = { ...deepClone(est), id: mappedId, entidadId };
  }

  // 9. Enlaces.
  const enlaces: Record<Id, Enlace> = { ...deepClone(a.enlaces) };
  for (const enl of Object.values(b.enlaces)) {
    const mappedId = enlaceMap.get(enl.id);
    const origen = remapExtremo(enl.origenId, entidadMap, estadoMap);
    const destino = remapExtremo(enl.destinoId, entidadMap, estadoMap);
    if (!mappedId || !origen || !destino) continue;
    enlaces[mappedId] = remapEnlaceB(enl, mappedId, origen, destino, estadoMap, enlaceMap);
  }

  // 10. OPDs: copia de A, luego B (raíz mergeado al raíz de A; hijos namespaced).
  const opds: Record<Id, Opd> = { ...deepClone(a.opds) };
  for (const [opdId, opd] of Object.entries(b.opds)) {
    const destinoOpdId = opdMap.get(opdId)!;
    const apariencias: Record<Id, Apariencia> = {};
    for (const ap of Object.values(opd.apariencias)) {
      if (!entidadMap.has(ap.entidadId)) continue;
      const apMapped = aparienciaMap.get(ap.id)!;
      apariencias[apMapped] = remapAparienciaB(ap, apMapped, destinoOpdId, entidadMap, estadoMap, aparienciaMap, enlaceMap);
    }
    const aparienciasEnlace: Record<Id, AparienciaEnlace> = {};
    for (const ae of Object.values(opd.enlaces)) {
      const enlaceId = enlaceMap.get(ae.enlaceId);
      if (!enlaceId) continue;
      const aeId = nsId(ae.id, String(nextSeq++));
      aparienciasEnlace[aeId] = { ...deepClone(ae), id: aeId, enlaceId, opdId: destinoOpdId };
    }
    if (opdId === b.opdRaizId) {
      const rootA = opds[a.opdRaizId]!;
      // C1: una entidad COMPARTIDA ya tiene apariencia en el raíz de A; la de B
      // se remapeó a su mismo entidadId. Fusionarla crearía un doble visual.
      // Deduplicar por entidad: conservar la apariencia de A, descartar la de B.
      const entidadesEnRaizA = new Set(Object.values(rootA.apariencias).map((ap) => ap.entidadId));
      const aparienciasSinDuplicar: Record<Id, Apariencia> = {};
      for (const [apId, ap] of Object.entries(apariencias)) {
        if (entidadesEnRaizA.has(ap.entidadId)) continue;
        aparienciasSinDuplicar[apId] = ap;
      }
      opds[a.opdRaizId] = {
        ...rootA,
        apariencias: { ...rootA.apariencias, ...aparienciasSinDuplicar },
        enlaces: { ...rootA.enlaces, ...aparienciasEnlace },
      };
    } else {
      opds[destinoOpdId] = {
        ...deepClone(opd),
        id: destinoOpdId,
        padreId: opd.padreId !== null ? opdMap.get(opd.padreId) ?? opd.padreId : null,
        apariencias,
        enlaces: aparienciasEnlace,
      };
    }
  }

  // 11. Abanicos, con decision remapeada.
  const abanicos: Record<Id, Abanico> = {};
  if (a.abanicos) Object.assign(abanicos, deepClone(a.abanicos));
  for (const ab of Object.values(b.abanicos ?? {})) {
    const mappedOpd = opdMap.get(ab.opdId);
    if (!mappedOpd) continue;
    const mappedEnlaces = ab.enlaceIds.map((id) => enlaceMap.get(id)).filter((id): id is Id => !!id);
    if (mappedEnlaces.length !== ab.enlaceIds.length) continue;
    const mappedPuerto = entidadMap.get(ab.puertoComun.entidadId);
    if (!mappedPuerto) continue;
    const mappedId = nsId(ab.id, String(nextSeq++));
    abanicos[mappedId] = {
      ...deepClone(ab),
      id: mappedId,
      opdId: mappedOpd,
      enlaceIds: mappedEnlaces,
      puertoComun: { ...ab.puertoComun, entidadId: mappedPuerto },
      puertoEntidadId: mappedPuerto,
      ...(ab.decision ? { decision: remapDecision(ab.decision, entidadMap, estadoMap, enlaceMap) } : {}),
    };
  }

  return {
    ok: true,
    value: {
      id: a.id,
      nombre: a.nombre,
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
