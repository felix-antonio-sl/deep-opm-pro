import type { Estado, Id, Modelo, Resultado } from "../tipos";
import { eliminarEnlacesPorExtremosEstado } from "./eliminacion";
import { fallo, ok, siguienteId } from "./helpers";

/**
 * Operaciones de estados de objeto: crear estados iniciales, agregar, renombrar,
 * eliminar (cascada de enlaces a estados), quitar (todos), designar inicial/final.
 *
 * El subdominio "designaciones avanzadas" (Default/Current con exclusiones,
 * supresión, duración) vive aparte en `modelo/estadosDesignaciones.ts` y
 * `modelo/objetoDuracion.ts` (no parte de operaciones).
 *
 * Refs: SSOT opm-iso-19450-es.md §3.71 (State).
 */

export interface EstadosInicialesObjeto {
  modelo: Modelo;
  estadoIds: [Id, Id];
  creado: boolean;
}

export interface EstadoCreado {
  modelo: Modelo;
  estadoId: Id;
}

export function estadosDeEntidad(modelo: Modelo, entidadId: Id): Estado[] {
  return Object.values(modelo.estados ?? {})
    .filter((estado) => estado.entidadId === entidadId)
    .sort((a, b) => ordenEstado(a) - ordenEstado(b) || a.id.localeCompare(b.id));
}

export function crearEstadosIniciales(modelo: Modelo, entidadId: Id): Resultado<EstadosInicialesObjeto> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  if (entidad.tipo !== "objeto") return fallo("Los estados sólo aplican a objetos");

  const existentes = estadosDeEntidad(modelo, entidadId);
  if (existentes.length > 0) {
    if (existentes.length === 1) return fallo("Un objeto con estados debe tener al menos dos estados");
    const primero = existentes[0]?.id;
    const segundo = existentes[1]?.id;
    if (!primero || !segundo) return fallo("El objeto tiene estados inválidos");
    return ok({ modelo, estadoIds: [primero, segundo], creado: false });
  }

  const estado1Id = siguienteId(modelo, "s");
  const estado2Id = siguienteId({ ...modelo, nextSeq: modelo.nextSeq + 1 }, "s");
  const estado1: Estado = { id: estado1Id, entidadId, nombre: "estado1" };
  const estado2: Estado = { id: estado2Id, entidadId, nombre: "estado2" };

  return ok({
    modelo: {
      ...modelo,
      nextSeq: modelo.nextSeq + 2,
      estados: {
        ...(modelo.estados ?? {}),
        [estado1Id]: estado1,
        [estado2Id]: estado2,
      },
    },
    estadoIds: [estado1Id, estado2Id],
    creado: true,
  });
}

export function agregarEstado(modelo: Modelo, entidadId: Id, nombre?: string): Resultado<EstadoCreado> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  if (entidad.tipo !== "objeto") return fallo("Los estados sólo aplican a objetos");
  if (estadosDeEntidad(modelo, entidadId).length < 2) {
    return fallo("Agregar un estado requiere que el objeto ya tenga al menos dos estados");
  }

  const limpio = nombre?.trim() || siguienteNombreEstado(modelo, entidadId);
  const validado = validarNombreEstado(modelo, entidadId, limpio);
  if (!validado.ok) return validado;

  const estadoId = siguienteId(modelo, "s");
  const estado: Estado = { id: estadoId, entidadId, nombre: validado.value };
  return ok({
    modelo: {
      ...modelo,
      nextSeq: modelo.nextSeq + 1,
      estados: {
        ...(modelo.estados ?? {}),
        [estadoId]: estado,
      },
    },
    estadoId,
  });
}

export function renombrarEstado(modelo: Modelo, estadoId: Id, nombre: string): Resultado<Modelo> {
  const estado = modelo.estados?.[estadoId];
  if (!estado) return fallo(`Estado no existe: ${estadoId}`);
  const validado = validarNombreEstado(modelo, estado.entidadId, nombre, estadoId);
  if (!validado.ok) return validado;
  if (estado.nombre === validado.value) return ok(modelo);

  return ok({
    ...modelo,
    estados: {
      ...(modelo.estados ?? {}),
      [estadoId]: { ...estado, nombre: validado.value },
    },
  });
}

export function eliminarEstado(modelo: Modelo, estadoId: Id): Resultado<Modelo> {
  const estado = modelo.estados?.[estadoId];
  if (!estado) return fallo(`Estado no existe: ${estadoId}`);
  const estados = estadosDeEntidad(modelo, estado.entidadId);
  if (estados.length <= 2) {
    return fallo("Un objeto con estados debe conservar al menos dos estados; usa quitar estados para eliminar el conjunto completo");
  }

  const siguientes = { ...(modelo.estados ?? {}) };
  delete siguientes[estadoId];
  return ok(eliminarEnlacesPorExtremosEstado({ ...modelo, estados: siguientes }, new Set([estadoId])));
}

export function quitarEstadosObjeto(modelo: Modelo, entidadId: Id): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  if (entidad.tipo !== "objeto") return fallo("Los estados sólo aplican a objetos");
  const siguientes = Object.fromEntries(
    Object.entries(modelo.estados ?? {}).filter(([, estado]) => estado.entidadId !== entidadId),
  ) as Record<Id, Estado>;
  if (Object.keys(siguientes).length === Object.keys(modelo.estados ?? {}).length) return ok(modelo);
  const removidos = new Set(Object.values(modelo.estados ?? {})
    .filter((estado) => estado.entidadId === entidadId)
    .map((estado) => estado.id));
  return ok(eliminarEnlacesPorExtremosEstado({ ...modelo, estados: siguientes }, removidos));
}

export function designarEstadoInicial(modelo: Modelo, estadoId: Id): Resultado<Modelo> {
  return designarEstado(modelo, estadoId, "esInicial");
}

export function designarEstadoFinal(modelo: Modelo, estadoId: Id): Resultado<Modelo> {
  return designarEstado(modelo, estadoId, "esFinal");
}

function designarEstado(modelo: Modelo, estadoId: Id, campo: "esInicial" | "esFinal"): Resultado<Modelo> {
  const estado = modelo.estados?.[estadoId];
  if (!estado) return fallo(`Estado no existe: ${estadoId}`);
  const estados = { ...(modelo.estados ?? {}) };

  for (const actual of estadosDeEntidad(modelo, estado.entidadId)) {
    const actualizado: Estado = { ...actual };
    if (actual.id === estadoId) {
      actualizado[campo] = true;
    } else {
      delete actualizado[campo];
    }
    estados[actual.id] = actualizado;
  }

  return ok({ ...modelo, estados });
}

function validarNombreEstado(modelo: Modelo, entidadId: Id, nombre: string, estadoId?: Id): Resultado<string> {
  const limpio = nombre.trim();
  if (limpio.length === 0) return fallo("El nombre del estado no puede estar vacío");
  const normalizado = normalizarNombreEstado(limpio);
  const duplicado = estadosDeEntidad(modelo, entidadId)
    .some((estado) => estado.id !== estadoId && normalizarNombreEstado(estado.nombre) === normalizado);
  if (duplicado) return fallo("El nombre del estado debe ser único dentro del objeto");
  return ok(limpio);
}

function siguienteNombreEstado(modelo: Modelo, entidadId: Id): string {
  const estados = estadosDeEntidad(modelo, entidadId);
  const indices = estados
    .map((estado) => /^estado(\d+)$/i.exec(estado.nombre.trim())?.[1])
    .filter((valor): valor is string => valor !== undefined)
    .map((valor) => Number.parseInt(valor, 10))
    .filter((valor) => Number.isSafeInteger(valor));
  const maximo = indices.length > 0 ? Math.max(...indices) : estados.length;
  return `estado${maximo + 1}`;
}

function normalizarNombreEstado(nombre: string): string {
  return nombre.trim().toLocaleLowerCase("es");
}

function ordenEstado(estado: Estado): number {
  const secuencia = /-(\d+)$/.exec(estado.id)?.[1];
  return secuencia ? Number.parseInt(secuencia, 10) : Number.MAX_SAFE_INTEGER;
}
