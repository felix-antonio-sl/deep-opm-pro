import {
  designarCurrent,
  designarDefault,
  designarFinal,
  designarInicial,
} from "../../modelo/estadosDesignaciones";
import { renombrarEtiquetaEnlace } from "../../modelo/etiquetasEnlace";
import { definirTiempoExcepcionEnlace, estadosDeEntidad } from "../../modelo/operaciones";
import {
  agregarEstado,
  cambiarAfiliacion,
  cambiarEsencia,
  crearEnlace,
  crearEstadosIniciales,
  crearObjeto,
  crearProceso,
  renombrarEntidad,
  renombrarEstado,
} from "../../modelo/operaciones";
import { aplicarModificador } from "../../modelo/modificadores";
import { posicionLibre } from "../../modelo/layout";
import { entidadIdDeExtremo } from "../../modelo/extremos";
import { formarAbanico } from "../../modelo/abanicos";
import type { DesignacionEstado, Enlace, Id, Modelo, Modificador, Resultado, TipoEnlace } from "../../modelo/tipos";
import { claveNombre } from "./parsear";
import type { PatchOplPropuesto, ReferenciaEntidadPatch } from "./tipos";

export function aplicarPatchesOpl(modelo: Modelo, patches: PatchOplPropuesto[], opdId: Id = modelo.opdRaizId): Resultado<Modelo> {
  let siguiente = modelo;
  const creadas = new Map<string, Id>();

  for (const patch of patches.filter((p): p is Exclude<PatchOplPropuesto, { tipo: "crear-enlace" | "fijar-etiqueta-enlace" | "crear-abanico" }> =>
    p.tipo !== "crear-enlace" && p.tipo !== "fijar-etiqueta-enlace" && p.tipo !== "crear-abanico"
  )) {
    const resultado = aplicarPatchNoEnlace(siguiente, patch, opdId, creadas);
    if (!resultado.ok) return resultado;
    siguiente = resultado.value;
  }

  for (const patch of patches.filter((p) => p.tipo === "crear-enlace" || p.tipo === "fijar-etiqueta-enlace")) {
    const resultado = aplicarPatchEnlace(siguiente, patch, opdId, creadas);
    if (!resultado.ok) return resultado;
    siguiente = resultado.value;
  }

  // Tercera fase: abanicos. Necesitan que todos los enlaces de sus ramas
  // existan ya en el modelo, por eso van despues de la fase de enlaces.
  for (const patch of patches.filter((p): p is Extract<PatchOplPropuesto, { tipo: "crear-abanico" }> => p.tipo === "crear-abanico")) {
    const resultado = aplicarPatchAbanico(siguiente, patch, opdId);
    if (!resultado.ok) return resultado;
    siguiente = resultado.value;
  }

  return ok(siguiente);
}

function aplicarPatchNoEnlace(
  modelo: Modelo,
  patch: Exclude<PatchOplPropuesto, { tipo: "crear-enlace" | "fijar-etiqueta-enlace" | "crear-abanico" }>,
  opdId: Id,
  creadas: Map<string, Id>,
): Resultado<Modelo> {
  switch (patch.tipo) {
    case "renombrar-entidad":
      return renombrarEntidad(modelo, patch.entidadId, patch.siguiente, opdId);
    case "cambiar-esencia":
      return cambiarEsencia(modelo, patch.entidadId, patch.siguiente);
    case "cambiar-afiliacion":
      return cambiarAfiliacion(modelo, patch.entidadId, patch.siguiente);
    case "crear-entidad": {
      const posicion = posicionLibre(modelo, opdId, patch.entidadTipo);
      const creado = patch.entidadTipo === "objeto"
        ? crearObjeto(modelo, opdId, posicion, patch.nombre)
        : crearProceso(modelo, opdId, posicion, patch.nombre);
      if (!creado.ok) return creado;
      const entidadId = idEntidadNueva(modelo, creado.value);
      let conProps = creado.value;
      if (entidadId) {
        creadas.set(claveNombre(patch.nombre), entidadId);
        // esencia/afiliacion ausentes (clasificación escindida que solo declaró
        // una dimensión): se conserva el default del modelo para la dimensión
        // no nombrada (crearObjeto/crearProceso ya la fijaron).
        if (patch.esencia !== undefined) {
          const esencia = cambiarEsencia(conProps, entidadId, patch.esencia);
          if (!esencia.ok) return esencia;
          conProps = esencia.value;
        }
        if (patch.afiliacion !== undefined) {
          const afiliacion = cambiarAfiliacion(conProps, entidadId, patch.afiliacion);
          if (!afiliacion.ok) return afiliacion;
          conProps = afiliacion.value;
        }
      }
      return ok(conProps);
    }
    case "sincronizar-estados":
      return sincronizarEstados(modelo, patch.objetoId, patch.nombres);
    case "renombrar-estado":
      return renombrarEstado(modelo, patch.estadoId, patch.siguiente);
    case "aplicar-designacion-estado":
      return aplicarDesignacionEstado(modelo, patch.entidadId, patch.estadoNombre, patch.designacion);
  }
}

function aplicarDesignacionEstado(
  modelo: Modelo,
  entidadId: Id,
  estadoNombre: string,
  designacion: DesignacionEstado,
): Resultado<Modelo> {
  const clave = claveNombre(estadoNombre);
  const estado = estadosDeEntidad(modelo, entidadId).find((item) => claveNombre(item.nombre) === clave);
  if (!estado) return fallo(`Estado '${estadoNombre}' no existe para entidad ${entidadId}`);
  switch (designacion) {
    case "inicial":
      return designarInicial(modelo, estado.id);
    case "final":
      return designarFinal(modelo, estado.id);
    case "default":
      return designarDefault(modelo, estado.id);
    case "current":
      return designarCurrent(modelo, estado.id);
  }
}

function aplicarPatchEnlace(
  modelo: Modelo,
  patch: Extract<PatchOplPropuesto, { tipo: "crear-enlace" | "fijar-etiqueta-enlace" }>,
  opdId: Id,
  creadas: Map<string, Id>,
): Resultado<Modelo> {
  if (patch.tipo === "fijar-etiqueta-enlace") {
    return renombrarEtiquetaEnlace(modelo, patch.enlaceId, patch.siguiente);
  }
  const origenId = resolverRef(modelo, patch.origen, creadas);
  const destinoId = resolverRef(modelo, patch.destino, creadas);
  if (!origenId) return fallo(`No se pudo resolver origen para enlace ${patch.tipoEnlace}`);
  if (!destinoId) return fallo(`No se pudo resolver destino para enlace ${patch.tipoEnlace}`);

  // Idempotencia (D3): si ya existe un enlace con misma tripla, reusamos para
  // aplicar modificador/tiempos en lugar de duplicar.
  const existente = buscarEnlaceCon(modelo, patch.tipoEnlace, origenId, destinoId);
  if (existente) {
    return aplicarMetadatosCondicionExcepcion(modelo, existente, patch);
  }

  const creado = crearEnlace(modelo, opdId, origenId, destinoId, patch.tipoEnlace, patch.etiqueta ?? "");
  if (!creado.ok) return creado;
  if (patch.modificador === undefined && patch.tiempoMaximo === undefined && patch.tiempoMinimo === undefined) {
    return creado;
  }
  const enlaceNuevo = enlaceMasReciente(modelo, creado.value, patch.tipoEnlace, origenId, destinoId);
  if (!enlaceNuevo) return creado;
  return aplicarMetadatosCondicionExcepcion(creado.value, enlaceNuevo, patch);
}

/**
 * Aplica modificador y/o tiempos de excepcion a un enlace recien creado o
 * existente. `aplicarModificador` valida la regla de compatibilidad (enlace
 * procedural); `definirTiempoExcepcionEnlace` valida que el enlace sea de
 * excepcion temporal. SSOT §6-§7 condicion, §8.1 excepcion.
 */
function aplicarMetadatosCondicionExcepcion(
  modelo: Modelo,
  enlace: Enlace,
  patch: Extract<PatchOplPropuesto, { tipo: "crear-enlace" }>,
): Resultado<Modelo> {
  let siguiente = modelo;
  if (patch.modificador && enlace.modificador !== patch.modificador) {
    const aplicado = aplicarModificador(siguiente, enlace.id, patch.modificador);
    if (!aplicado.ok) return aplicado;
    siguiente = aplicado.value;
  }
  const tieneTiempos = patch.tiempoMaximo !== undefined || patch.tiempoMinimo !== undefined;
  if (tieneTiempos) {
    const valores: Parameters<typeof definirTiempoExcepcionEnlace>[2] = {};
    if (patch.tiempoMaximo !== undefined) valores.tiempoMaximo = patch.tiempoMaximo;
    if (patch.unidadTiempoMaximo !== undefined) valores.unidadTiempoMaximo = patch.unidadTiempoMaximo;
    if (patch.tiempoMinimo !== undefined) valores.tiempoMinimo = patch.tiempoMinimo;
    if (patch.unidadTiempoMinimo !== undefined) valores.unidadTiempoMinimo = patch.unidadTiempoMinimo;
    const aplicado = definirTiempoExcepcionEnlace(siguiente, enlace.id, valores);
    if (!aplicado.ok) return aplicado;
    siguiente = aplicado.value;
  }
  return ok(siguiente);
}

function buscarEnlaceCon(modelo: Modelo, tipo: TipoEnlace, origenId: Id, destinoId: Id): Enlace | null {
  return Object.values(modelo.enlaces).find((enlace) => {
    if (enlace.tipo !== tipo) return false;
    return entidadIdDeExtremo(modelo, enlace.origenId) === origenId
      && entidadIdDeExtremo(modelo, enlace.destinoId) === destinoId;
  }) ?? null;
}

function enlaceMasReciente(previo: Modelo, siguiente: Modelo, tipo: TipoEnlace, origenId: Id, destinoId: Id): Enlace | null {
  const previos = new Set(Object.keys(previo.enlaces));
  for (const [id, enlace] of Object.entries(siguiente.enlaces)) {
    if (previos.has(id)) continue;
    if (enlace.tipo !== tipo) continue;
    if (entidadIdDeExtremo(siguiente, enlace.origenId) !== origenId) continue;
    if (entidadIdDeExtremo(siguiente, enlace.destinoId) !== destinoId) continue;
    return enlace;
  }
  return null;
}

function sincronizarEstados(modelo: Modelo, objetoId: Id, nombres: string[]): Resultado<Modelo> {
  let siguiente = modelo;
  let estados = estadosDeEntidad(siguiente, objetoId);
  if (estados.length === 0) {
    const creados = crearEstadosIniciales(siguiente, objetoId);
    if (!creados.ok) return creados;
    siguiente = creados.value.modelo;
    estados = estadosDeEntidad(siguiente, objetoId);
  }
  if (estados.length === 1) return fallo("Un objeto con estados debe tener al menos dos estados");

  for (let index = 0; index < nombres.length; index += 1) {
    estados = estadosDeEntidad(siguiente, objetoId);
    const estado = estados[index];
    if (estado) {
      if (claveNombre(estado.nombre) !== claveNombre(nombres[index]!)) {
        const renombrado = renombrarEstado(siguiente, estado.id, nombres[index]!);
        if (!renombrado.ok) return renombrado;
        siguiente = renombrado.value;
      }
    } else {
      const agregado = agregarEstado(siguiente, objetoId, nombres[index]!);
      if (!agregado.ok) return agregado;
      siguiente = agregado.value.modelo;
    }
  }
  return ok(siguiente);
}

function resolverRef(modelo: Modelo, ref: ReferenciaEntidadPatch, creadas: Map<string, Id>): Id | null {
  if (ref.tipo === "id") return ref.id;
  const clave = claveNombre(ref.nombre);
  return creadas.get(clave) ?? Object.values(modelo.entidades).find((entidad) =>
    claveNombre(entidad.nombre) === clave && (ref.entidadTipo === undefined || entidad.tipo === ref.entidadTipo)
  )?.id ?? null;
}

function idEntidadNueva(previo: Modelo, siguiente: Modelo): Id | null {
  const previos = new Set(Object.keys(previo.entidades));
  return Object.keys(siguiente.entidades).find((id) => !previos.has(id)) ?? null;
}

/**
 * Aplica un patch `crear-abanico` (ronda 26/L3): busca los N enlaces que
 * matchean las ramas y los agrupa con `formarAbanico` del modelo.
 *
 * Pre-requisitos: los enlaces ya existen en el modelo (los crearon los
 * patches de la fase 2). Si alguna rama no se encuentra, devuelve
 * ok(modelo) silenciosamente (patch idempotente no-op).
 *
 * NOTA sobre puertos: `formarAbanico` requiere que los enlaces compartan
 * un puerto exacto (entidadId + lado + portId). Como `crearEnlace` no
 * asigna `portId` explicito, asignamos un portId compartido de fan-out al
 * lado del proceso pivote en todos los enlaces de las ramas antes de
 * invocar `formarAbanico`.
 */
function aplicarPatchAbanico(
  modelo: Modelo,
  patch: Extract<PatchOplPropuesto, { tipo: "crear-abanico" }>,
  opdId: Id,
): Resultado<Modelo> {
  const procesoId = resolverRefSinCreadas(modelo, patch.procesoRef);
  if (!procesoId) return ok(modelo);

  const enlacesRama: Enlace[] = [];
  for (const rama of patch.ramas) {
    const origenId = resolverRefSinCreadas(modelo, rama.origen);
    const destinoId = resolverRefSinCreadas(modelo, rama.destino);
    if (!origenId || !destinoId) continue;
    const enlace = buscarEnlaceParaAbanico(modelo, patch.tipoEnlace, origenId, destinoId, patch.modificador);
    if (enlace) enlacesRama.push(enlace);
  }

  if (enlacesRama.length < 2) {
    return ok(modelo);
  }

  const portId: Id = `port-fan-opl-${patch.linea}-${procesoId}`;
  const lado: "origen" | "destino" = patch.procesoEsOrigen ? "origen" : "destino";
  const enlacesConPuerto = { ...modelo.enlaces };
  for (const enlace of enlacesRama) {
    const extremoActual = lado === "origen" ? enlace.origenId : enlace.destinoId;
    if (extremoActual.kind !== "entidad" || extremoActual.id !== procesoId) {
      return ok(modelo);
    }
    const extremoConPuerto = { ...extremoActual, portId };
    enlacesConPuerto[enlace.id] = lado === "origen"
      ? { ...enlace, origenId: extremoConPuerto }
      : { ...enlace, destinoId: extremoConPuerto };
  }
  const modeloConPuertos: Modelo = { ...modelo, enlaces: enlacesConPuerto };

  return formarAbanico(modeloConPuertos, opdId, enlacesRama.map((e) => e.id), patch.operador);
}

function resolverRefSinCreadas(modelo: Modelo, ref: ReferenciaEntidadPatch): Id | null {
  if (ref.tipo === "id") return ref.id;
  const clave = claveNombre(ref.nombre);
  return Object.values(modelo.entidades).find((entidad) =>
    claveNombre(entidad.nombre) === clave && (ref.entidadTipo === undefined || entidad.tipo === ref.entidadTipo)
  )?.id ?? null;
}

function buscarEnlaceParaAbanico(
  modelo: Modelo,
  tipo: TipoEnlace,
  origenId: Id,
  destinoId: Id,
  modificador: Modificador | undefined,
): Enlace | null {
  return Object.values(modelo.enlaces).find((enlace) => {
    if (enlace.tipo !== tipo) return false;
    if (entidadIdDeExtremo(modelo, enlace.origenId) !== origenId) return false;
    if (entidadIdDeExtremo(modelo, enlace.destinoId) !== destinoId) return false;
    if (modificador !== undefined && enlace.modificador !== modificador) return false;
    return true;
  }) ?? null;
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
