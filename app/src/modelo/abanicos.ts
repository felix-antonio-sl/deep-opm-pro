import { naturalezaDeEnlace } from "./constantes";
import { entidadIdDeExtremo } from "./extremos";
import type { Abanico, Enlace, Id, Modelo, OperadorAbanico, Resultado, TipoEnlace } from "./tipos";

export function formarAbanico(
  modelo: Modelo,
  opdId: Id,
  enlaceIds: Id[],
  operador: OperadorAbanico = "O",
): Resultado<Modelo> {
  const validado = validarCandidatoAbanico(modelo, opdId, enlaceIds, operador);
  if (!validado.ok) return validado;
  const existente = abanicoExistentePara(modelo, opdId, validado.value.puertoEntidadId, validado.value.tipo);
  if (existente) {
    return agregarRamasAAbanico(modelo, existente.id, validado.value.enlaces.map((enlace) => enlace.id), operador);
  }

  const abanicoId = siguienteId(modelo, "ab");
  const abanico: Abanico = {
    id: abanicoId,
    opdId,
    puertoEntidadId: validado.value.puertoEntidadId,
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
  return ok({
    ...modelo,
    abanicos: {
      ...(modelo.abanicos ?? {}),
      [abanicoId]: { ...abanico, enlaceIds: restantes },
    },
  });
}

export function alternarOperadorAbanico(modelo: Modelo, abanicoId: Id, operador: OperadorAbanico): Resultado<Modelo> {
  if (!esOperadorAbanico(operador)) return fallo(`Operador de abanico inválido: ${operador}`);
  const abanico = (modelo.abanicos ?? {})[abanicoId];
  if (!abanico) return fallo(`Abanico no existe: ${abanicoId}`);
  if (abanico.operador === operador) return ok(modelo);
  return ok({
    ...modelo,
    abanicos: {
      ...(modelo.abanicos ?? {}),
      [abanicoId]: { ...abanico, operador },
    },
  });
}

export function disolverAbanico(modelo: Modelo, abanicoId: Id): Resultado<Modelo> {
  if (!(modelo.abanicos ?? {})[abanicoId]) return ok(modelo);
  const abanicos = { ...(modelo.abanicos ?? {}) };
  delete abanicos[abanicoId];
  return ok({ ...modelo, abanicos });
}

export function detectarPuertoCompartido(modelo: Modelo, opdId: Id, enlace: Enlace): Abanico | undefined {
  return Object.values(modelo.abanicos ?? {}).find((abanico) => {
    if (abanico.opdId !== opdId) return false;
    const miembros = enlacesDeAbanico(modelo, abanico);
    if (miembros.length < 2) return false;
    const tipo = miembros[0]?.tipo;
    return tipo === enlace.tipo && compartePuerto(modelo, enlace, abanico.puertoEntidadId);
  });
}

export function abanicoDeEnlace(modelo: Modelo, enlaceId: Id): Abanico | undefined {
  return Object.values(modelo.abanicos ?? {}).find((abanico) => abanico.enlaceIds.includes(enlaceId));
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
    const validado = validarCandidatoAbanico(modelo, abanico.opdId, enlaceIds, abanico.operador, abanico.puertoEntidadId);
    if (!validado.ok) continue;
    siguientes[abanico.id] = { ...abanico, enlaceIds };
  }
  return { ...modelo, abanicos: siguientes };
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
    abanico.puertoEntidadId,
  );
  if (!validado.ok) return validado;

  return ok({
    ...modelo,
    abanicos: {
      ...(modelo.abanicos ?? {}),
      [abanicoId]: {
        ...abanico,
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
  puertoEsperado?: Id,
): Resultado<{ enlaces: Enlace[]; puertoEntidadId: Id; tipo: TipoEnlace }> {
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

  const comunes = puertosComunes(modelo, enlaces);
  const puertoEntidadId = puertoEsperado ?? comunes[0];
  if (!puertoEntidadId || !comunes.includes(puertoEntidadId)) {
    return fallo("Los enlaces de un abanico deben compartir un puerto");
  }
  if (!modelo.entidades[puertoEntidadId]) return fallo(`Puerto de abanico no existe: ${puertoEntidadId}`);
  if (puertoEsperado && !enlaces.every((enlace) => compartePuerto(modelo, enlace, puertoEsperado))) {
    return fallo("La rama no comparte el puerto del abanico");
  }
  if (comunes.length > 1 && !puertoEsperado) {
    return fallo("El abanico requiere un único puerto común");
  }

  const duenios = Object.values(modelo.abanicos ?? {}).filter((abanico) =>
    abanico.opdId === opdId && abanico.id !== undefined && abanico.enlaceIds.some((id) => idsUnicos.includes(id))
  );
  const ajenos = duenios.filter((abanico) => abanico.puertoEntidadId !== puertoEntidadId);
  if (ajenos.length > 0) return fallo("Un enlace ya pertenece a otro abanico");

  return ok({ enlaces, puertoEntidadId, tipo });
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

function abanicoExistentePara(modelo: Modelo, opdId: Id, puertoEntidadId: Id, tipo: TipoEnlace): Abanico | undefined {
  return Object.values(modelo.abanicos ?? {}).find((abanico) => {
    if (abanico.opdId !== opdId || abanico.puertoEntidadId !== puertoEntidadId) return false;
    const enlace = modelo.enlaces[abanico.enlaceIds[0] ?? ""];
    return enlace?.tipo === tipo;
  });
}

function enlacesDeAbanico(modelo: Modelo, abanico: Abanico): Enlace[] {
  return abanico.enlaceIds
    .map((enlaceId) => modelo.enlaces[enlaceId])
    .filter((enlace): enlace is Enlace => enlace !== undefined);
}

function puertosComunes(modelo: Modelo, enlaces: Enlace[]): Id[] {
  const [primero] = enlaces;
  if (!primero) return [];
  const ids = [
    entidadIdDeExtremo(modelo, primero.origenId),
    entidadIdDeExtremo(modelo, primero.destinoId),
  ].filter((id): id is Id => id !== null);
  return ids.filter((id) => enlaces.every((enlace) => compartePuerto(modelo, enlace, id)));
}

function puertoCompartido(modelo: Modelo, a: Enlace, b: Enlace): Id | null {
  const comunes = [
    entidadIdDeExtremo(modelo, a.origenId),
    entidadIdDeExtremo(modelo, a.destinoId),
  ].filter((id): id is Id => id !== null && compartePuerto(modelo, b, id));
  return comunes.length === 1 ? comunes[0] ?? null : null;
}

function compartePuerto(modelo: Modelo, enlace: Enlace, puertoEntidadId: Id): boolean {
  return entidadIdDeExtremo(modelo, enlace.origenId) === puertoEntidadId || entidadIdDeExtremo(modelo, enlace.destinoId) === puertoEntidadId;
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

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
