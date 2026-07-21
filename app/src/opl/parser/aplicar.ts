import {
  designarCurrent,
  designarDefault,
  designarFinal,
  designarInicial,
} from "../../modelo/estadosDesignaciones";
import { renombrarEtiquetaEnlace } from "../../modelo/etiquetasEnlace";
import { definirTiempoExcepcionEnlace, estadosDeEntidad } from "../../modelo/operaciones";
import {
  ajustarMultiplicidad,
  agregarEstado,
  cambiarAfiliacion,
  cambiarEsencia,
  crearEnlace,
  crearEstadosIniciales,
  crearObjeto,
  crearProceso,
  descomponerProceso,
  desplegarObjeto,
  renombrarEntidad,
  renombrarEstado,
} from "../../modelo/operaciones";
import { aplicarModificador, definirDemora } from "../../modelo/modificadores";
import { crearAutoInvocacion } from "../../modelo/autoinvocacion";
import { definirRutaEtiqueta } from "../../modelo/rutas";
import { posicionLibre } from "../../modelo/layout";
import { extremoEstado, mismoExtremo, normalizarExtremo, type ExtremoEntrada } from "../../modelo/extremos";
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
    case "sincronizar-estados": {
      // La referencia puede ser pendiente por nombre (objeto declarado en una
      // línea previa del mismo texto): `creadas` la resuelve tras crear-entidad.
      const objetoId = resolverRef(modelo, patch.objeto, creadas);
      if (!objetoId) {
        const nombre = patch.objeto.tipo === "nombre" ? patch.objeto.nombre : patch.objeto.id;
        return fallo(`No existe el objeto '${nombre}' para sincronizar estados`);
      }
      return sincronizarEstados(modelo, objetoId, patch.nombres);
    }
    case "renombrar-estado":
      return renombrarEstado(modelo, patch.estadoId, patch.siguiente);
    case "aplicar-designacion-estado":
      return aplicarDesignacionEstado(modelo, patch.entidadId, patch.estadoNombre, patch.designacion);
    case "crear-refinamiento": {
      const resultado = patch.familia === "descomposicion"
        ? descomponerProceso(modelo, opdId, patch.entidadId)
        : desplegarObjeto(modelo, opdId, patch.entidadId);
      return resultado.ok ? ok(resultado.value.modelo) : resultado;
    }
    case "set-orden-inzoom": {
      // Fase 1·U4: setea el orden temporal declarado en el OPD hijo existente.
      const opd = modelo.opds[patch.opdId];
      if (!opd) return ok(modelo);
      return ok({ ...modelo, opds: { ...modelo.opds, [patch.opdId]: { ...opd, ordenInzoom: patch.ordenInzoom } } });
    }
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
  const extremos = resolverExtremosPatch(modelo, patch, origenId, destinoId);
  if (!extremos.ok) return extremos;

  // Idempotencia (D3): si ya existe un enlace con misma tripla, reusamos para
  // aplicar modificador/tiempos en lugar de duplicar.
  const existente = buscarEnlaceCon(
    modelo,
    patch.tipoEnlace,
    extremos.value.origen,
    extremos.value.destino,
    extremos.value,
  );
  if (existente) {
    return aplicarMetadatosCondicionExcepcion(modelo, existente, patch, extremos.value);
  }

  // Autoinvocación (IV2): self-link Proceso→Proceso. `crearEnlace` rechaza
  // extremos idénticos; el kernel tiene su propia operación con demora default.
  if (patch.tipoEnlace === "invocacion" && origenId === destinoId) {
    return patch.demora !== undefined
      ? crearAutoInvocacion(modelo, opdId, origenId, patch.demora)
      : crearAutoInvocacion(modelo, opdId, origenId);
  }

  const transicion = patch.tipoEnlace === "efecto" && extremos.value.estadoEntradaId && extremos.value.estadoSalidaId
    ? { estadoEntradaId: extremos.value.estadoEntradaId, estadoSalidaId: extremos.value.estadoSalidaId }
    : undefined;
  const creado = crearEnlace(
    modelo,
    opdId,
    extremos.value.origen,
    extremos.value.destino,
    patch.tipoEnlace,
    patch.etiqueta ?? "",
    transicion,
  );
  if (!creado.ok) return creado;
  if (
    patch.modificador === undefined &&
    patch.tiempoMaximo === undefined &&
    patch.tiempoMinimo === undefined &&
    patch.demora === undefined &&
    patch.multiplicidadOrigen === undefined &&
    patch.multiplicidadDestino === undefined &&
    patch.rutaEtiqueta === undefined &&
    extremos.value.estadoEntradaId === undefined &&
    extremos.value.estadoSalidaId === undefined
  ) {
    return creado;
  }
  const enlaceNuevo = enlaceMasRecientePorExtremos(modelo, creado.value, patch.tipoEnlace, extremos.value.origen, extremos.value.destino);
  if (!enlaceNuevo) return creado;
  return aplicarMetadatosCondicionExcepcion(creado.value, enlaceNuevo, patch, extremos.value);
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
  extremos?: { estadoEntradaId?: Id; estadoSalidaId?: Id },
): Resultado<Modelo> {
  let siguiente = modelo;
  if (enlace.tipo === "efecto" && (extremos?.estadoEntradaId || extremos?.estadoSalidaId)) {
    siguiente = {
      ...siguiente,
      enlaces: {
        ...siguiente.enlaces,
        [enlace.id]: {
          ...siguiente.enlaces[enlace.id]!,
          ...(extremos.estadoEntradaId ? { estadoEntradaId: extremos.estadoEntradaId } : {}),
          ...(extremos.estadoSalidaId ? { estadoSalidaId: extremos.estadoSalidaId } : {}),
        },
      },
    };
  }
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
  if (patch.demora !== undefined && enlace.demora !== patch.demora) {
    const aplicado = definirDemora(siguiente, enlace.id, patch.demora);
    if (!aplicado.ok) return aplicado;
    siguiente = aplicado.value;
  }
  if (patch.multiplicidadOrigen !== undefined && siguiente.enlaces[enlace.id]?.multiplicidadOrigen !== patch.multiplicidadOrigen) {
    const aplicado = ajustarMultiplicidad(siguiente, enlace.id, "origen", patch.multiplicidadOrigen);
    if (!aplicado.ok) return aplicado;
    siguiente = aplicado.value;
  }
  if (patch.multiplicidadDestino !== undefined && siguiente.enlaces[enlace.id]?.multiplicidadDestino !== patch.multiplicidadDestino) {
    const aplicado = ajustarMultiplicidad(siguiente, enlace.id, "destino", patch.multiplicidadDestino);
    if (!aplicado.ok) return aplicado;
    siguiente = aplicado.value;
  }
  if (patch.rutaEtiqueta !== undefined && siguiente.enlaces[enlace.id]?.rutaEtiqueta !== patch.rutaEtiqueta) {
    const aplicado = definirRutaEtiqueta(siguiente, enlace.id, patch.rutaEtiqueta);
    if (!aplicado.ok) return aplicado;
    siguiente = aplicado.value;
  }
  return ok(siguiente);
}

function buscarEnlaceCon(
  modelo: Modelo,
  tipo: TipoEnlace,
  origen: ExtremoEntrada,
  destino: ExtremoEntrada,
  estados?: { estadoEntradaId?: Id; estadoSalidaId?: Id },
): Enlace | null {
  const origenNormalizado = normalizarExtremo(origen);
  const destinoNormalizado = normalizarExtremo(destino);
  return Object.values(modelo.enlaces).find((enlace) => {
    if (enlace.tipo !== tipo) return false;
    if (!mismoExtremo(enlace.origenId, origenNormalizado)) return false;
    if (!mismoExtremo(enlace.destinoId, destinoNormalizado)) return false;
    if (tipo === "efecto") {
      return enlace.estadoEntradaId === estados?.estadoEntradaId
        && enlace.estadoSalidaId === estados?.estadoSalidaId;
    }
    return true;
  }) ?? null;
}

function enlaceMasRecientePorExtremos(
  previo: Modelo,
  siguiente: Modelo,
  tipo: TipoEnlace,
  origen: ExtremoEntrada,
  destino: ExtremoEntrada,
): Enlace | null {
  const previos = new Set(Object.keys(previo.enlaces));
  const origenNormalizado = normalizarExtremo(origen);
  const destinoNormalizado = normalizarExtremo(destino);
  for (const [id, enlace] of Object.entries(siguiente.enlaces)) {
    if (previos.has(id)) continue;
    if (enlace.tipo !== tipo) continue;
    if (!mismoExtremo(enlace.origenId, origenNormalizado)) continue;
    if (!mismoExtremo(enlace.destinoId, destinoNormalizado)) continue;
    return enlace;
  }
  return null;
}

function resolverExtremosPatch(
  modelo: Modelo,
  patch: Pick<Extract<PatchOplPropuesto, { tipo: "crear-enlace" }>, "tipoEnlace" | "estadoEntrada" | "estadoSalida">,
  origenId: Id,
  destinoId: Id,
): Resultado<{ origen: ExtremoEntrada; destino: ExtremoEntrada; estadoEntradaId?: Id; estadoSalidaId?: Id }> {
  const estadoEntradaId = patch.estadoEntrada ? resolverEstadoPorNombre(modelo, destinoObjetoDeEntrada(patch.tipoEnlace, origenId, destinoId), patch.estadoEntrada) : undefined;
  const estadoSalidaId = patch.estadoSalida ? resolverEstadoPorNombre(modelo, destinoObjetoDeSalida(patch.tipoEnlace, origenId, destinoId), patch.estadoSalida) : undefined;
  if (patch.estadoEntrada && !estadoEntradaId) return fallo(`Estado de entrada no existe: ${patch.estadoEntrada}`);
  if (patch.estadoSalida && !estadoSalidaId) return fallo(`Estado de salida no existe: ${patch.estadoSalida}`);

  if (patch.tipoEnlace === "consumo" && estadoEntradaId) {
    return ok({ origen: extremoEstado(estadoEntradaId), destino: destinoId });
  }
  // Gramática HS: habilitador calificado por estado — el origen es el estado
  // del objeto ("Operador en `disponible` maneja P" / "P requiere Equipo en `calibrado`").
  if ((patch.tipoEnlace === "agente" || patch.tipoEnlace === "instrumento") && estadoEntradaId) {
    return ok({ origen: extremoEstado(estadoEntradaId), destino: destinoId });
  }
  if (patch.tipoEnlace === "resultado" && estadoSalidaId) {
    return ok({ origen: origenId, destino: extremoEstado(estadoSalidaId) });
  }
  if (patch.tipoEnlace === "efecto") {
    if (estadoEntradaId && !estadoSalidaId) return ok({ origen: extremoEstado(estadoEntradaId), destino: origenId, estadoEntradaId });
    if (!estadoEntradaId && estadoSalidaId) return ok({ origen: origenId, destino: extremoEstado(estadoSalidaId), estadoSalidaId });
    return ok({
      origen: origenId,
      destino: destinoId,
      ...(estadoEntradaId ? { estadoEntradaId } : {}),
      ...(estadoSalidaId ? { estadoSalidaId } : {}),
    });
  }
  return ok({ origen: origenId, destino: destinoId });
}

function destinoObjetoDeEntrada(tipo: TipoEnlace, origenId: Id, destinoId: Id): Id {
  // El estado de entrada pertenece al OBJETO, que en consumo y en los
  // habilitadores (agente/instrumento) es el extremo ORIGEN del enlace.
  if (tipo === "consumo" || tipo === "agente" || tipo === "instrumento") return origenId;
  return destinoId;
}

function destinoObjetoDeSalida(tipo: TipoEnlace, origenId: Id, destinoId: Id): Id {
  if (tipo === "resultado" || tipo === "efecto") return destinoId;
  return origenId;
}

function resolverEstadoPorNombre(modelo: Modelo, entidadId: Id, nombre: string): Id | null {
  const clave = claveNombre(nombre);
  return estadosDeEntidad(modelo, entidadId).find((estado) => claveNombre(estado.nombre) === clave)?.id ?? null;
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
    const extremos = resolverExtremosPatch(modelo, { tipoEnlace: patch.tipoEnlace, ...rama }, origenId, destinoId);
    if (!extremos.ok) return fallo(extremos.error);
    const enlace = buscarEnlaceCon(modelo, patch.tipoEnlace, extremos.value.origen, extremos.value.destino, extremos.value);
    if (enlace && patch.modificador !== undefined && enlace.modificador !== patch.modificador) continue;
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

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
