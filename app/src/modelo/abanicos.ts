import { naturalezaDeEnlace } from "./constantes";
import { entidadIdDeExtremo } from "./extremos";
import type { Abanico, Enlace, Id, Modelo, OperadorAbanico, PuertoAbanicoExacto, Resultado, TipoEnlace } from "./tipos";

type LadoEnlace = "origen" | "destino";

export interface PuertoComunExacto {
  entidadId: Id;
  lado: LadoEnlace;
  portId: Id;
  key: string;
}

type PuertoEsperadoAbanico = Id | PuertoAbanicoExacto;

export interface CandidatoAbanicoExacto {
  lado: LadoEnlace;
  entidadId: Id;
  tipo: TipoEnlace;
  enlaceIds: Id[];
}

export function formarAbanico(
  modelo: Modelo,
  opdId: Id,
  enlaceIds: Id[],
  operador: OperadorAbanico = "O",
): Resultado<Modelo> {
  const validado = validarCandidatoAbanico(modelo, opdId, enlaceIds, operador);
  if (!validado.ok) return validado;
  const puertoComun = puertoAbanicoDesdeExacto(validado.value.puertoComun);
  const existente = abanicoExistentePara(modelo, opdId, puertoComun, validado.value.tipo);
  if (existente) {
    return agregarRamasAAbanico(modelo, existente.id, validado.value.enlaces.map((enlace) => enlace.id), operador);
  }

  const abanicoId = siguienteId(modelo, "ab");
  const abanico: Abanico = {
    id: abanicoId,
    opdId,
    puertoComun,
    puertoEntidadId: puertoComun.entidadId,
    operador,
    enlaceIds: validado.value.enlaces.map((enlace) => enlace.id),
  };

  return ok({
    ...modelo,
    nextSeq: modelo.nextSeq + 1,
    abanicos: {
      ...(modelo.abanicos ?? {}),
      [abanicoId]: abanico,
    },
  });
}

export function agregarRamaAAbanico(modelo: Modelo, abanicoId: Id, enlaceId: Id): Resultado<Modelo> {
  return agregarRamasAAbanico(modelo, abanicoId, [enlaceId]);
}

export function quitarRamaDeAbanico(modelo: Modelo, abanicoId: Id, enlaceId: Id): Resultado<Modelo> {
  const abanico = (modelo.abanicos ?? {})[abanicoId];
  if (!abanico) return fallo(`Abanico no existe: ${abanicoId}`);
  if (!abanico.enlaceIds.includes(enlaceId)) return ok(modelo);
  const restantes = abanico.enlaceIds.filter((id) => id !== enlaceId);
  if (restantes.length < 2) return disolverAbanico(modelo, abanicoId);
  const siguienteAbanico = normalizarDecisionAbanico({ ...abanico, enlaceIds: restantes });
  return ok({
    ...modelo,
    enlaces: limpiarProbabilidadesDecision(modelo, abanico),
    abanicos: {
      ...(modelo.abanicos ?? {}),
      [abanicoId]: siguienteAbanico,
    },
  });
}

export function alternarOperadorAbanico(modelo: Modelo, abanicoId: Id, operador: OperadorAbanico): Resultado<Modelo> {
  if (!esOperadorAbanico(operador)) return fallo(`Operador de abanico inválido: ${operador}`);
  const abanico = (modelo.abanicos ?? {})[abanicoId];
  if (!abanico) return fallo(`Abanico no existe: ${abanicoId}`);
  if (abanico.operador === operador) return ok(modelo);
  const siguienteAbanico = operador === "XOR"
    ? { ...abanico, operador }
    : limpiarDecisionAbanico({ ...abanico, operador });
  return ok({
    ...modelo,
    enlaces: operador === "XOR" ? modelo.enlaces : limpiarProbabilidadesDecision(modelo, abanico),
    abanicos: {
      ...(modelo.abanicos ?? {}),
      [abanicoId]: siguienteAbanico,
    },
  });
}

export function definirProbabilidadesAbanico(
  modelo: Modelo,
  abanicoId: Id,
  probabilidades: Record<Id, number> | undefined,
): Resultado<Modelo> {
  const abanico = (modelo.abanicos ?? {})[abanicoId];
  if (!abanico) return fallo(`Abanico no existe: ${abanicoId}`);
  if (abanico.operador !== "XOR") return fallo("Las probabilidades explícitas requieren abanico XOR");
  const enlaces = abanico.enlaceIds.map((id) => modelo.enlaces[id]);
  if (enlaces.some((enlace) => !enlace)) return fallo("Abanico inválido: contiene enlaces inexistentes");
  if (!probabilidades) {
    return ok({
      ...modelo,
      enlaces: limpiarProbabilidadesRamas(modelo, abanico.enlaceIds),
      abanicos: {
        ...(modelo.abanicos ?? {}),
        [abanicoId]: limpiarDecisionAbanico(abanico),
      },
    });
  }

  const validado = validarProbabilidadesAbanico(abanico.enlaceIds, probabilidades);
  if (!validado.ok) return validado;
  const siguientesEnlaces = { ...modelo.enlaces };
  for (const enlaceId of abanico.enlaceIds) {
    const enlace = modelo.enlaces[enlaceId];
    if (!enlace) continue;
    siguientesEnlaces[enlaceId] = { ...enlace, probabilidad: validado.value[enlaceId]! };
  }
  return ok({
    ...modelo,
    enlaces: siguientesEnlaces,
    abanicos: {
      ...(modelo.abanicos ?? {}),
      [abanicoId]: {
        ...abanico,
        decision: { modo: "probabilidades", pesos: validado.value },
      },
    },
  });
}

export function disolverAbanico(modelo: Modelo, abanicoId: Id): Resultado<Modelo> {
  const abanico = (modelo.abanicos ?? {})[abanicoId];
  if (!abanico) return ok(modelo);
  const abanicos = { ...(modelo.abanicos ?? {}) };
  delete abanicos[abanicoId];
  return ok({ ...modelo, enlaces: limpiarProbabilidadesDecision(modelo, abanico), abanicos });
}

export function detectarPuertoCompartido(modelo: Modelo, opdId: Id, enlace: Enlace): Abanico | undefined {
  return Object.values(modelo.abanicos ?? {}).find((abanico) => {
    if (abanico.opdId !== opdId) return false;
    const puertoEsperado = puertoEsperadoDeAbanico(abanico);
    const miembros = enlacesDeAbanico(modelo, abanico);
    if (miembros.length < 2) return false;
    const tipo = miembros[0]?.tipo;
    if (tipo !== enlace.tipo) return false;
    return puertosExactosComunes(modelo, [...miembros, enlace])
      .some((puerto) => coincidePuertoEsperado(puerto, puertoEsperado));
  });
}

export function abanicoDeEnlace(modelo: Modelo, enlaceId: Id): Abanico | undefined {
  return Object.values(modelo.abanicos ?? {}).find((abanico) => abanico.enlaceIds.includes(enlaceId));
}

export function candidatosAbanicoExacto(modelo: Modelo, opdId: Id, enlaceId: Id): CandidatoAbanicoExacto[] {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace || naturalezaDeEnlace(enlace.tipo) !== "procedural" || abanicoDeEnlace(modelo, enlaceId)) return [];
  return (["origen", "destino"] as const).flatMap((lado) => {
    const extremo = lado === "origen" ? enlace.origenId : enlace.destinoId;
    const entidadId = entidadIdDeExtremo(modelo, extremo);
    if (!entidadId || extremo.kind !== "entidad") return [];
    const enlaceIds = enlacesCompatiblesDelOpd(modelo, opdId, enlace)
      .filter((candidato) => !abanicoDeEnlace(modelo, candidato.id))
      .filter((candidato) => {
        const extremoCandidato = lado === "origen" ? candidato.origenId : candidato.destinoId;
        return extremoCandidato.kind === "entidad" && entidadIdDeExtremo(modelo, extremoCandidato) === entidadId;
      })
      .map((candidato) => candidato.id);
    if (enlaceIds.length < 2) return [];
    return [{ lado, entidadId, tipo: enlace.tipo, enlaceIds: ordenarConSeleccionPrimero(enlaceIds, enlaceId) }];
  });
}

export function puertoExactoCompartidoDeAbanico(modelo: Modelo, abanico: Abanico): PuertoComunExacto | undefined {
  const enlaces = enlacesDeAbanico(modelo, abanico);
  if (enlaces.length < 2) return undefined;
  const puertoEsperado = puertoEsperadoDeAbanico(abanico);
  const comunes = puertosExactosComunes(modelo, enlaces)
    .filter((puerto) => coincidePuertoEsperado(puerto, puertoEsperado));
  return comunes.length === 1 ? comunes[0] : undefined;
}

export function puertoComunDeAbanico(abanico: Abanico): PuertoAbanicoExacto {
  return abanico.puertoComun;
}

export function formarAbanicoAutomatico(
  modelo: Modelo,
  opdId: Id,
  enlaceId: Id,
  operador: OperadorAbanico = "O",
): Resultado<Modelo> {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace) return fallo(`Enlace no existe: ${enlaceId}`);
  const existente = detectarPuertoCompartido(modelo, opdId, enlace);
  if (existente) return agregarRamaAAbanico(modelo, existente.id, enlaceId);

  const candidatos = enlacesCompatiblesDelOpd(modelo, opdId, enlace)
    .filter((candidato) => candidato.id !== enlaceId)
    .filter((candidato) => puertoCompartido(modelo, enlace, candidato) !== null);
  const primero = candidatos[0];
  if (!primero) return ok(modelo);
  return formarAbanico(modelo, opdId, [primero.id, enlaceId], operador);
}

export function sincronizarAbanicos(modelo: Modelo): Modelo {
  const siguientes: Record<Id, Abanico> = {};
  for (const abanico of Object.values(modelo.abanicos ?? {})) {
    const enlaceIds = abanico.enlaceIds.filter((enlaceId) => modelo.enlaces[enlaceId]);
    if (enlaceIds.length < 2) continue;
    const validado = validarCandidatoAbanico(modelo, abanico.opdId, enlaceIds, abanico.operador, puertoEsperadoDeAbanico(abanico), abanico.id);
    if (!validado.ok) continue;
    const puertoComun = puertoAbanicoDesdeExacto(validado.value.puertoComun);
    siguientes[abanico.id] = normalizarDecisionAbanico({ ...abanico, puertoComun, puertoEntidadId: puertoComun.entidadId, enlaceIds });
  }
  return { ...modelo, abanicos: siguientes };
}

export function validarAbanicoCanonico(
  modelo: Modelo,
  opdId: Id,
  enlaceIds: Id[],
  operador: OperadorAbanico,
  puertoEsperado: PuertoEsperadoAbanico,
  abanicoId?: Id,
): Resultado<PuertoComunExacto> {
  const validado = validarCandidatoAbanico(modelo, opdId, enlaceIds, operador, puertoEsperado, abanicoId);
  return validado.ok ? ok(validado.value.puertoComun) : validado;
}

function agregarRamasAAbanico(
  modelo: Modelo,
  abanicoId: Id,
  enlaceIds: Id[],
  operador?: OperadorAbanico,
): Resultado<Modelo> {
  const abanico = (modelo.abanicos ?? {})[abanicoId];
  if (!abanico) return fallo(`Abanico no existe: ${abanicoId}`);
  const candidatoIds = [...abanico.enlaceIds];
  for (const enlaceId of enlaceIds) {
    if (!candidatoIds.includes(enlaceId)) candidatoIds.push(enlaceId);
  }
  const validado = validarCandidatoAbanico(
    modelo,
    abanico.opdId,
    candidatoIds,
    operador ?? abanico.operador,
    puertoEsperadoDeAbanico(abanico),
    abanicoId,
  );
  if (!validado.ok) return validado;

  return ok({
    ...modelo,
    abanicos: {
      ...(modelo.abanicos ?? {}),
      [abanicoId]: {
        ...abanico,
        puertoComun: puertoAbanicoDesdeExacto(validado.value.puertoComun),
        puertoEntidadId: validado.value.puertoComun.entidadId,
        operador: operador ?? abanico.operador,
        enlaceIds: validado.value.enlaces.map((enlace) => enlace.id),
      },
    },
  });
}

function validarCandidatoAbanico(
  modelo: Modelo,
  opdId: Id,
  enlaceIds: Id[],
  operador: OperadorAbanico,
  puertoEsperado?: PuertoEsperadoAbanico,
  abanicoActualId?: Id,
): Resultado<{ enlaces: Enlace[]; puertoComun: PuertoComunExacto; tipo: TipoEnlace }> {
  if (!esOperadorAbanico(operador)) return fallo(`Operador de abanico inválido: ${operador}`);
  if (!modelo.opds[opdId]) return fallo(`OPD no existe: ${opdId}`);
  const idsUnicos = Array.from(new Set(enlaceIds));
  if (idsUnicos.length < 2) return fallo("Un abanico requiere al menos dos enlaces");

  const enlaces: Enlace[] = [];
  for (const enlaceId of idsUnicos) {
    const enlace = modelo.enlaces[enlaceId];
    if (!enlace) return fallo(`Enlace no existe: ${enlaceId}`);
    if (!enlaceVisibleEnOpd(modelo, opdId, enlaceId)) return fallo(`Enlace no visible en OPD: ${enlaceId}`);
    if (naturalezaDeEnlace(enlace.tipo) !== "procedural") {
      return fallo("Los abanicos O/XOR aplican sólo a enlaces procedimentales");
    }
    enlaces.push(enlace);
  }

  const tipo = enlaces[0]?.tipo;
  if (!tipo || enlaces.some((enlace) => enlace.tipo !== tipo)) {
    return fallo("Los enlaces de un abanico deben ser homogéneos");
  }

  const comunes = puertosExactosComunes(modelo, enlaces);
  const candidatosEsperados = puertoEsperado
    ? comunes.filter((puerto) => coincidePuertoEsperado(puerto, puertoEsperado))
    : comunes;
  const puertoElegido = candidatosEsperados[0];
  if (!puertoElegido || candidatosEsperados.length !== 1) {
    return fallo("Los enlaces de un abanico deben compartir un puerto");
  }
  if (!modelo.entidades[puertoElegido.entidadId]) return fallo(`Puerto de abanico no existe: ${puertoElegido.entidadId}`);
  if (comunes.length > 1 && !puertoEsperado) {
    return fallo("El abanico requiere un único puerto común");
  }

  const duenios = Object.values(modelo.abanicos ?? {}).filter((abanico) =>
    abanico.opdId === opdId && abanico.id !== abanicoActualId && abanico.enlaceIds.some((id) => idsUnicos.includes(id))
  );
  if (duenios.length > 0) return fallo("Un enlace ya pertenece a otro abanico");

  return ok({ enlaces, puertoComun: puertoElegido, tipo });
}

function enlacesCompatiblesDelOpd(modelo: Modelo, opdId: Id, enlace: Enlace): Enlace[] {
  const opd = modelo.opds[opdId];
  if (!opd || naturalezaDeEnlace(enlace.tipo) !== "procedural") return [];
  return Object.values(opd.enlaces)
    .map((apariencia) => modelo.enlaces[apariencia.enlaceId])
    .filter((candidato): candidato is Enlace =>
      candidato !== undefined &&
      candidato.tipo === enlace.tipo &&
      naturalezaDeEnlace(candidato.tipo) === "procedural"
    );
}

function abanicoExistentePara(modelo: Modelo, opdId: Id, puertoComun: PuertoAbanicoExacto, tipo: TipoEnlace): Abanico | undefined {
  return Object.values(modelo.abanicos ?? {}).find((abanico) => {
    if (abanico.opdId !== opdId || !mismoPuertoAbanico(puertoComunDeAbanico(abanico), puertoComun)) return false;
    const enlace = modelo.enlaces[abanico.enlaceIds[0] ?? ""];
    return enlace?.tipo === tipo;
  });
}

function enlacesDeAbanico(modelo: Modelo, abanico: Abanico): Enlace[] {
  return abanico.enlaceIds
    .map((enlaceId) => modelo.enlaces[enlaceId])
    .filter((enlace): enlace is Enlace => enlace !== undefined);
}

function puertoCompartido(modelo: Modelo, a: Enlace, b: Enlace): PuertoComunExacto | null {
  const exactos = puertosExactosComunes(modelo, [a, b]);
  return exactos.length === 1 ? exactos[0] ?? null : null;
}

function puertosExactosComunes(modelo: Modelo, enlaces: Enlace[]): PuertoComunExacto[] {
  const [primero] = enlaces;
  if (!primero) return [];
  const candidatos = puertosExactosDeEnlace(modelo, primero);
  return candidatos.flatMap((extremo) => {
    if (!enlaces.every((enlace) => tienePuertoExacto(modelo, enlace, extremo))) return [];
    return [extremo];
  });
}

function puertosExactosDeEnlace(modelo: Modelo, enlace: Enlace): PuertoComunExacto[] {
  return ([
    ["origen", enlace.origenId],
    ["destino", enlace.destinoId],
  ] as const).flatMap(([lado, extremo]) => {
    const entidadId = entidadIdDeExtremo(modelo, extremo);
    if (!entidadId || extremo.kind !== "entidad" || !extremo.portId) return [];
    const key = `${lado}:${entidadId}:${extremo.portId}`;
    return [{ entidadId, lado, portId: extremo.portId, key }];
  });
}

function tienePuertoExacto(modelo: Modelo, enlace: Enlace, puerto: PuertoComunExacto): boolean {
  const extremo = puerto.lado === "origen" ? enlace.origenId : enlace.destinoId;
  return extremo.kind === "entidad" &&
    extremo.portId === puerto.portId &&
    entidadIdDeExtremo(modelo, extremo) === puerto.entidadId;
}

function enlaceVisibleEnOpd(modelo: Modelo, opdId: Id, enlaceId: Id): boolean {
  return Object.values(modelo.opds[opdId]?.enlaces ?? {}).some((apariencia) => apariencia.enlaceId === enlaceId);
}

function esOperadorAbanico(value: unknown): value is OperadorAbanico {
  return value === "O" || value === "XOR";
}

function siguienteId(modelo: Modelo, prefijo: string): Id {
  return `${prefijo}-${modelo.nextSeq}`;
}

function ordenarConSeleccionPrimero(enlaceIds: Id[], enlaceSeleccionId: Id): Id[] {
  return [
    enlaceSeleccionId,
    ...enlaceIds.filter((id) => id !== enlaceSeleccionId),
  ];
}

function validarProbabilidadesAbanico(enlaceIds: Id[], probabilidades: Record<Id, number>): Resultado<Record<Id, number>> {
  const ids = new Set(enlaceIds);
  const claves = Object.keys(probabilidades);
  if (claves.some((id) => !ids.has(id))) return fallo("Las probabilidades contienen ramas ajenas al abanico");
  if (enlaceIds.some((id) => !(id in probabilidades))) return fallo("Todas las ramas del abanico requieren probabilidad");

  const normalizadas: Record<Id, number> = {};
  for (const enlaceId of enlaceIds) {
    const valor = probabilidades[enlaceId];
    if (typeof valor !== "number" || !Number.isFinite(valor) || valor < 0 || valor > 1) {
      return fallo(`Probabilidad inválida para rama ${enlaceId}`);
    }
    normalizadas[enlaceId] = valor;
  }
  const suma = Object.values(normalizadas).reduce((acc, valor) => acc + valor, 0);
  if (Math.abs(suma - 1) > 1e-9) return fallo("Las probabilidades del abanico deben sumar 1");
  return ok(normalizadas);
}

function limpiarProbabilidadesRamas(modelo: Modelo, enlaceIds: Id[], pesosEsperados?: Record<Id, number>): Modelo["enlaces"] {
  let cambiado = false;
  const enlaces = { ...modelo.enlaces };
  for (const enlaceId of enlaceIds) {
    const enlace = enlaces[enlaceId];
    if (!enlace || enlace.probabilidad === undefined) continue;
    if (pesosEsperados && enlace.probabilidad !== pesosEsperados[enlaceId]) continue;
    const { probabilidad: _probabilidad, ...sinProbabilidad } = enlace;
    enlaces[enlaceId] = sinProbabilidad;
    cambiado = true;
  }
  return cambiado ? enlaces : modelo.enlaces;
}

function limpiarProbabilidadesDecision(modelo: Modelo, abanico: Abanico): Modelo["enlaces"] {
  return abanico.decision?.modo === "probabilidades"
    ? limpiarProbabilidadesRamas(modelo, abanico.enlaceIds, abanico.decision.pesos)
    : modelo.enlaces;
}

function limpiarDecisionAbanico(abanico: Abanico): Abanico {
  if (!abanico.decision) return abanico;
  const { decision: _decision, ...sinDecision } = abanico;
  return sinDecision;
}

function normalizarDecisionAbanico(abanico: Abanico): Abanico {
  if (abanico.operador !== "XOR") return limpiarDecisionAbanico(abanico);
  if (abanico.decision?.modo !== "probabilidades") return abanico;
  const ids = new Set(abanico.enlaceIds);
  const pesos = abanico.decision.pesos;
  const completo = abanico.enlaceIds.every((id) => id in pesos) && Object.keys(pesos).every((id) => ids.has(id));
  return completo ? abanico : limpiarDecisionAbanico(abanico);
}

function puertoAbanicoDesdeExacto(puerto: PuertoComunExacto | PuertoAbanicoExacto): PuertoAbanicoExacto {
  return {
    entidadId: puerto.entidadId,
    lado: puerto.lado,
    portId: puerto.portId,
  };
}

function puertoEsperadoDeAbanico(abanico: Abanico): PuertoEsperadoAbanico {
  const legacy = abanico as Abanico & { puertoComun?: PuertoAbanicoExacto };
  return legacy.puertoComun ?? legacy.puertoEntidadId;
}

function coincidePuertoEsperado(puerto: PuertoComunExacto, esperado: PuertoEsperadoAbanico): boolean {
  if (typeof esperado === "string") return puerto.entidadId === esperado;
  return mismoPuertoAbanico(puerto, esperado);
}

function mismoPuertoAbanico(a: PuertoComunExacto | PuertoAbanicoExacto, b: PuertoComunExacto | PuertoAbanicoExacto): boolean {
  return a.entidadId === b.entidadId && a.lado === b.lado && a.portId === b.portId;
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
