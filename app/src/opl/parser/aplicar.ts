import { renombrarEtiquetaEnlace } from "../../modelo/etiquetasEnlace";
import { estadosDeEntidad } from "../../modelo/operaciones";
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
import { posicionLibre } from "../../modelo/layout";
import type { Id, Modelo, Resultado } from "../../modelo/tipos";
import { claveNombre } from "./parsear";
import type { PatchOplPropuesto, ReferenciaEntidadPatch } from "./tipos";

export function aplicarPatchesOpl(modelo: Modelo, patches: PatchOplPropuesto[], opdId: Id = modelo.opdRaizId): Resultado<Modelo> {
  let siguiente = modelo;
  const creadas = new Map<string, Id>();

  for (const patch of patches.filter((p) => p.tipo !== "crear-enlace" && p.tipo !== "fijar-etiqueta-enlace")) {
    const resultado = aplicarPatchNoEnlace(siguiente, patch, opdId, creadas);
    if (!resultado.ok) return resultado;
    siguiente = resultado.value;
  }

  for (const patch of patches.filter((p) => p.tipo === "crear-enlace" || p.tipo === "fijar-etiqueta-enlace")) {
    const resultado = aplicarPatchEnlace(siguiente, patch, opdId, creadas);
    if (!resultado.ok) return resultado;
    siguiente = resultado.value;
  }

  return ok(siguiente);
}

function aplicarPatchNoEnlace(
  modelo: Modelo,
  patch: Exclude<PatchOplPropuesto, { tipo: "crear-enlace" | "fijar-etiqueta-enlace" }>,
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
        const esencia = cambiarEsencia(conProps, entidadId, patch.esencia);
        if (!esencia.ok) return esencia;
        conProps = esencia.value;
        const afiliacion = cambiarAfiliacion(conProps, entidadId, patch.afiliacion);
        if (!afiliacion.ok) return afiliacion;
        conProps = afiliacion.value;
      }
      return ok(conProps);
    }
    case "sincronizar-estados":
      return sincronizarEstados(modelo, patch.objetoId, patch.nombres);
    case "renombrar-estado":
      return renombrarEstado(modelo, patch.estadoId, patch.siguiente);
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
  return crearEnlace(modelo, opdId, origenId, destinoId, patch.tipoEnlace, patch.etiqueta ?? "");
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

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
